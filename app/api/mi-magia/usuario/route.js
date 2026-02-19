import { kv } from '@vercel/kv';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

const WOO_URL = process.env.WORDPRESS_URL || 'https://duendesdeluruguay.com';
const WOO_KEY = process.env.WC_CONSUMER_KEY;
const WOO_SECRET = process.env.WC_CONSUMER_SECRET;

function getWooAuthHeader() {
  if (!WOO_KEY || !WOO_SECRET) return null;
  return `Basic ${Buffer.from(`${WOO_KEY}:${WOO_SECRET}`).toString('base64')}`;
}

// Verificar estado del formulario para una orden (con caché de 5 min)
async function verificarFormularioOrden(ordenId) {
  if (!ordenId) return null;

  const cacheKey = `formulario:estado:${ordenId}`;
  const cached = await kv.get(cacheKey);
  if (cached !== null) return cached;

  const authHeader = getWooAuthHeader();
  if (!authHeader) return null;

  try {
    const res = await fetch(`${WOO_URL}/wp-json/wc/v3/orders/${ordenId}`, {
      headers: { 'Authorization': authHeader, 'Content-Type': 'application/json' }
    });

    if (!res.ok) return null;

    const order = await res.json();
    const completadoMeta = order.meta_data?.find(m => m.key === '_duendes_formulario_completado');
    const completado = completadoMeta?.value === 'yes';

    // Cachear por 5 minutos
    await kv.set(cacheKey, completado, { ex: 300 });
    return completado;
  } catch (e) {
    console.error(`Error verificando formulario orden ${ordenId}:`, e.message);
    return null;
  }
}

export async function OPTIONS() {
  return new Response(null, { headers: CORS_HEADERS });
}

// ═══════════════════════════════════════════════════════════════
// OBTENER DATOS DEL USUARIO PARA MI MAGIA
// ═══════════════════════════════════════════════════════════════

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');
    
    if (!token) {
      return Response.json({ 
        success: false, 
        error: 'Token requerido' 
      }, { status: 400, headers: CORS_HEADERS });
    }
    
    // Buscar token en KV
    let tokenData = await kv.get(`token:${token}`);

    // Si no existe en token:${token}, buscar en elegidos (tokens antiguos)
    if (!tokenData || !tokenData.email) {
      const keys = await kv.keys('elegido:*');
      for (const key of keys) {
        const elegido = await kv.get(key);
        if (elegido?.token === token) {
          tokenData = { email: elegido.email, nombre: elegido.nombre };
          // Crear la key token:${token} para futuras búsquedas
          await kv.set(`token:${token}`, tokenData, { ex: 365 * 24 * 60 * 60 });
          break;
        }
      }
    }

    if (!tokenData || !tokenData.email) {
      return Response.json({
        success: false,
        error: 'Token inválido o expirado'
      }, { status: 401, headers: CORS_HEADERS });
    }

    const email = tokenData.email.toLowerCase();
    
    // Cargar datos del elegido
    const elegido = await kv.get(`elegido:${email}`) || {};
    
    // Cargar membresía del círculo
    const circulo = await kv.get(`circulo:${email}`);
    
    // Cargar lecturas pendientes
    const lecturasPendientes = await kv.get(`lecturas-pendientes:${email}`) || [];
    
    // Cargar lecturas completadas
    const lecturasCompletadas = await kv.get(`lecturas:${email}`) || [];

    // Calcular nivel de acceso
    const nivelAcceso = calcularNivelAcceso(elegido, circulo);

    // Verificar estado del formulario para cada guardián
    const guardianes = elegido.guardianes || [];
    const ordenesUnicas = [...new Set(guardianes.map(g => g.ordenId).filter(Boolean))];

    // Verificar formularios en paralelo
    const estadosFormularios = {};
    await Promise.all(
      ordenesUnicas.map(async (ordenId) => {
        const completado = await verificarFormularioOrden(ordenId);
        estadosFormularios[ordenId] = completado;
      })
    );

    // Agregar estado del formulario a cada guardián
    const guardianesConFormulario = guardianes.map(g => ({
      ...g,
      formularioCompletado: g.ordenId ? estadosFormularios[g.ordenId] : null,
      formularioPendiente: g.ordenId ? estadosFormularios[g.ordenId] === false : false
    }));

    // Construir objeto de usuario
    const usuario = {
      email: email,
      nombre: elegido.nombre || tokenData.nombre || 'Elegida',
      nombrePreferido: elegido.nombrePreferido || elegido.nombre || tokenData.nombre,
      pronombre: elegido.pronombre || 'ella',

      // Nivel de acceso (gratis/compro/circulo)
      nivelAcceso: nivelAcceso,

      // Onboarding, Tour y Perfil
      onboardingCompleto: elegido.onboardingCompleto || false,
      tourVisto: elegido.tourVisto || false,
      perfilCompleto: elegido.perfilCompleto || false,
      // Perfilado psicológico (test de 6 preguntas)
      perfilPsicologico: elegido.perfilPsicologico || null,
      perfiladoCompletado: elegido.perfiladoCompletado || false,
      ultimaVerificacion: elegido.ultimaVerificacion,

      // Datos del perfil "Para Conocerme"
      fechaNacimiento: elegido.fechaNacimiento,
      signoZodiacal: elegido.signoZodiacal,
      queBusca: elegido.queBusca || [],
      momentoVida: elegido.momentoVida,
      tieneGuardianesFisicos: elegido.tieneGuardianesFisicos,
      guardianesFisicos: elegido.guardianesFisicos,
      comoNosConociste: elegido.comoNosConociste,

      // Monedas
      treboles: elegido.treboles || 0,
      runas: elegido.runas || 0,

      // Compras
      guardianes: guardianesConFormulario,
      talismanes: elegido.talismanes || [],
      varas: elegido.varas || [],
      libros: elegido.libros || [],
      obsequios: elegido.obsequios || [],

      // Stats
      totalCompras: elegido.totalCompras || 0,
      nivel: elegido.nivel || 1,
      tituloNivel: calcularTituloNivel(elegido.totalCompras || 0, elegido.pronombre || 'ella'),

      // Círculo
      esCirculo: !!circulo && circulo.activo,
      circuloPlan: circulo?.plan,
      circuloExpira: circulo?.expira,
      circuloPruebaUsada: elegido.circuloPruebaUsada || false,

      // Lecturas
      lecturas: lecturasCompletadas,
      lecturasPendientes: lecturasPendientes,

      // Fechas
      primeraCompra: elegido.primeraCompra,
      ultimaCompra: elegido.ultimaCompra,

      // Metadata
      pais: elegido.pais,
      fechaNacimiento: elegido.fechaNacimiento
    };
    
    return Response.json({ 
      success: true, 
      usuario 
    }, { headers: CORS_HEADERS });
    
  } catch (error) {
    console.error('Error obteniendo usuario:', error);
    return Response.json({ 
      success: false, 
      error: error.message 
    }, { status: 500, headers: CORS_HEADERS });
  }
}

// ═══════════════════════════════════════════════════════════════
// ACTUALIZAR DATOS DEL USUARIO (tour, preferencias)
// ═══════════════════════════════════════════════════════════════

export async function POST(request) {
  try {
    const datos = await request.json();
    const { email, tourVisto, perfil } = datos;

    if (!email) {
      return Response.json({
        success: false,
        error: 'Email requerido'
      }, { status: 400, headers: CORS_HEADERS });
    }

    const emailLower = email.toLowerCase();

    // Obtener datos existentes
    const elegido = await kv.get(`elegido:${emailLower}`) || {};

    // Actualizar solo los campos proporcionados
    const elegidoActualizado = { ...elegido };

    if (tourVisto !== undefined) {
      elegidoActualizado.tourVisto = tourVisto;
    }

    // Si viene perfil (formulario "Para conocerme")
    if (perfil) {
      elegidoActualizado.fechaNacimiento = perfil.fechaNacimiento || elegido.fechaNacimiento;
      elegidoActualizado.signoZodiacal = perfil.signoZodiacal || elegido.signoZodiacal;
      elegidoActualizado.queBusca = perfil.queBusca || elegido.queBusca;
      elegidoActualizado.momentoVida = perfil.momentoVida || elegido.momentoVida;
      elegidoActualizado.tieneGuardianesFisicos = perfil.tieneGuardianesFisicos || elegido.tieneGuardianesFisicos;
      elegidoActualizado.guardianesFisicos = perfil.guardianesFisicos || elegido.guardianesFisicos;
      elegidoActualizado.comoNosConociste = perfil.comoNosConociste || elegido.comoNosConociste;
      elegidoActualizado.perfilCompleto = true;
    }

    // Guardar
    await kv.set(`elegido:${emailLower}`, elegidoActualizado);

    return Response.json({
      success: true,
      mensaje: 'Usuario actualizado correctamente'
    }, { headers: CORS_HEADERS });

  } catch (error) {
    console.error('Error actualizando usuario:', error);
    return Response.json({
      success: false,
      error: error.message
    }, { status: 500, headers: CORS_HEADERS });
  }
}

// ═══════════════════════════════════════════════════════════════
// CALCULAR TÍTULO DE NIVEL
// ═══════════════════════════════════════════════════════════════

function calcularTituloNivel(totalCompras, pronombre) {
  const sufijo = pronombre === 'ella' ? 'a' : pronombre === 'él' ? 'o' : 'e';

  if (totalCompras >= 1000) return `Elegid${sufijo} del Santuario`;
  if (totalCompras >= 500) return `Guardián${sufijo} del Círculo`;
  if (totalCompras >= 300) return `Raíz Ancestral`;
  if (totalCompras >= 150) return `Trébol de Oro`;
  if (totalCompras >= 50) return `Brote Mágico`;
  return `Semilla Despierta`;
}

// ═══════════════════════════════════════════════════════════════
// CALCULAR NIVEL DE ACCESO (gratis/compro/circulo)
// ═══════════════════════════════════════════════════════════════

function calcularNivelAcceso(elegido, circulo) {
  // Nivel 3: Círculo - Miembro activo del Círculo
  if (circulo && circulo.activo) {
    const expira = circulo.expira ? new Date(circulo.expira) : null;
    if (!expira || expira > new Date()) {
      return {
        nivel: 'circulo',
        codigo: 3,
        nombre: 'Círculo de Duendes',
        descripcion: 'Acceso completo a todo el contenido exclusivo',
        esPrueba: circulo.esPrueba || circulo.plan === 'prueba-gratis',
        expira: circulo.expira
      };
    }
  }

  // Nivel 2: Compró - Ha comprado al menos un guardián u otro producto
  const tieneCompras = (
    (elegido.guardianes && elegido.guardianes.length > 0) ||
    (elegido.talismanes && elegido.talismanes.length > 0) ||
    (elegido.varas && elegido.varas.length > 0) ||
    (elegido.libros && elegido.libros.length > 0) ||
    (elegido.totalCompras && elegido.totalCompras > 0)
  );

  if (tieneCompras) {
    return {
      nivel: 'compro',
      codigo: 2,
      nombre: 'Guardián Adoptado',
      descripcion: 'Acceso completo a las funciones estándar',
      esPrueba: false,
      expira: null
    };
  }

  // Nivel 1: Gratis - Solo registrado, sin compras
  return {
    nivel: 'gratis',
    codigo: 1,
    nombre: 'Explorador',
    descripcion: 'Acceso limitado - algunas funciones están bloqueadas',
    esPrueba: false,
    expira: null,
    puedeProbarCirculo: !elegido.circuloPruebaUsada
  };
}
