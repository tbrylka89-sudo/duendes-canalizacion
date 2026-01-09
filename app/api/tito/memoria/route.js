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
// OBTENER MEMORIA DE UN VISITANTE
// ═══════════════════════════════════════════════════════════════

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const visitorId = searchParams.get('visitorId');
    const email = searchParams.get('email');
    
    if (!visitorId && !email) {
      return Response.json({ 
        success: false, 
        error: 'Se requiere visitorId o email' 
      }, { status: 400, headers: CORS_HEADERS });
    }
    
    let memoria = null;
    
    // Buscar por visitorId
    if (visitorId) {
      memoria = await kv.get(`tito:visitante:${visitorId}`);
    }
    
    // Si no hay memoria por visitorId, buscar por email
    if (!memoria && email) {
      // Buscar si es cliente
      const elegido = await kv.get(`elegido:${email.toLowerCase()}`);
      
      if (elegido) {
        memoria = {
          nombre: elegido.nombre,
          email: email,
          esCliente: true,
          totalCompras: elegido.totalCompras || 0,
          guardianes: elegido.guardianes?.map(g => g.nombre) || [],
          nivel: elegido.nivel || 1,
          tituloNivel: elegido.tituloNivel || '✨ Elegida',
          treboles: elegido.treboles || 0,
          runas: elegido.runas || 0
        };
        
        // Verificar si es del Círculo
        // (esto requeriría consultar a WordPress, por ahora asumimos que no)
      }
    }
    
    return Response.json({ 
      success: true, 
      memoria: memoria || null,
      encontrado: !!memoria
    }, { headers: CORS_HEADERS });
    
  } catch (error) {
    console.error('Error obteniendo memoria:', error);
    return Response.json({ 
      success: false, 
      error: error.message 
    }, { status: 500, headers: CORS_HEADERS });
  }
}

// ═══════════════════════════════════════════════════════════════
// GUARDAR/ACTUALIZAR MEMORIA
// ═══════════════════════════════════════════════════════════════

export async function POST(request) {
  try {
    const { visitorId, datos } = await request.json();
    
    if (!visitorId) {
      return Response.json({ 
        success: false, 
        error: 'Se requiere visitorId' 
      }, { status: 400, headers: CORS_HEADERS });
    }
    
    // Obtener memoria existente
    let memoria = await kv.get(`tito:visitante:${visitorId}`) || {
      creado: new Date().toISOString(),
      interacciones: 0
    };
    
    // Actualizar con nuevos datos
    memoria = {
      ...memoria,
      ...datos,
      ultimaActualizacion: new Date().toISOString()
    };
    
    // Guardar con TTL de 60 días
    await kv.set(`tito:visitante:${visitorId}`, memoria, { ex: 60 * 24 * 60 * 60 });
    
    return Response.json({ 
      success: true, 
      memoria 
    }, { headers: CORS_HEADERS });
    
  } catch (error) {
    console.error('Error guardando memoria:', error);
    return Response.json({ 
      success: false, 
      error: error.message 
    }, { status: 500, headers: CORS_HEADERS });
  }
}
