import { kv } from '@vercel/kv';

export const dynamic = 'force-dynamic';

// ═══════════════════════════════════════════════════════════════
// API: HISTORIAL DE EXPERIENCIAS DEL USUARIO
// ═══════════════════════════════════════════════════════════════

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');
    const email = searchParams.get('email');
    const limite = parseInt(searchParams.get('limite')) || 50;

    if (!token && !email) {
      return Response.json({
        success: false,
        error: 'Se requiere token o email'
      }, { status: 400 });
    }

    let userEmail = email;
    if (token && !email) {
      const tokenData = await kv.get(`token:${token}`);
      if (!tokenData) {
        return Response.json({
          success: false,
          error: 'Token inválido'
        }, { status: 401 });
      }
      userEmail = typeof tokenData === 'string' ? tokenData : tokenData.email;
    }

    // Obtener usuario para historial
    const usuario = await kv.get(`elegido:${userEmail}`);
    if (!usuario) {
      return Response.json({
        success: false,
        error: 'Usuario no encontrado'
      }, { status: 404 });
    }

    // Obtener historial de experiencias del usuario
    const historial = usuario.historialExperiencias || [];

    // Ordenar por fecha descendente y limitar
    const historialOrdenado = historial
      .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
      .slice(0, limite);

    // Para cada experiencia pendiente, verificar si ya está lista
    const experienciasActualizadas = [];
    for (const exp of historialOrdenado) {
      if (exp.estado === 'pendiente' || exp.estado === 'procesando') {
        // Verificar el estado actual de la solicitud
        const solicitud = await kv.get(`solicitud:${exp.id}`);
        if (solicitud && solicitud.estado !== exp.estado) {
          exp.estado = solicitud.estado;
        }
      }
      experienciasActualizadas.push(exp);
    }

    return Response.json({
      success: true,
      experiencias: experienciasActualizadas,
      total: historial.length
    });

  } catch (error) {
    console.error('[HISTORIAL-EXPERIENCIAS] Error:', error);
    return Response.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
