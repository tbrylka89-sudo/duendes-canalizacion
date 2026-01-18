import { kv } from '@vercel/kv';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

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
    
    // Construir objeto de usuario
    const usuario = {
      email: email,
      nombre: elegido.nombre || tokenData.nombre || 'Elegida',
      nombrePreferido: elegido.nombrePreferido || elegido.nombre || tokenData.nombre,
      pronombre: elegido.pronombre || 'ella',
      
      // Onboarding, Tour y Perfil
      onboardingCompleto: elegido.onboardingCompleto || false,
      tourVisto: elegido.tourVisto || false,
      perfilCompleto: elegido.perfilCompleto || false,
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
      guardianes: elegido.guardianes || [],
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
