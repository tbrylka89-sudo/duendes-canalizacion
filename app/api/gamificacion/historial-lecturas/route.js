import { kv } from '@vercel/kv';

// ═══════════════════════════════════════════════════════════════
// API: HISTORIAL DE LECTURAS
// Obtener todas las lecturas completadas del usuario
// ═══════════════════════════════════════════════════════════════

export const dynamic = 'force-dynamic';

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

    // Obtener email desde token
    let userEmail = email;
    if (token && !email) {
      const tokenData = await kv.get(`token:${token}`);
      if (!tokenData) {
        return Response.json({
          success: false,
          error: 'Token inválido'
        }, { status: 401 });
      }
      // El token puede ser un string (email) o un objeto {email, nombre, creado}
      userEmail = typeof tokenData === 'string' ? tokenData : tokenData.email;
    }

    // Obtener historial de lecturas
    const historial = await kv.get(`historial:${userEmail}`) || [];

    // Ordenar por fecha descendente (más recientes primero)
    const historialOrdenado = historial
      .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
      .slice(0, limite);

    return Response.json({
      success: true,
      lecturas: historialOrdenado,
      total: historial.length
    });

  } catch (error) {
    console.error('[HISTORIAL-LECTURAS] Error:', error);
    return Response.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
