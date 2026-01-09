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
    const tokenData = await kv.get(`token:${token}`);
    
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
      
      // Onboarding
      onboardingCompleto: elegido.onboardingCompleto || false,
      ultimaVerificacion: elegido.ultimaVerificacion,
      
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
