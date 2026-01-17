import { kv } from '@vercel/kv';

// ═══════════════════════════════════════════════════════════════════════════════
// API: Historial de Mensajes del Duende de la Semana
// Devuelve los últimos mensajes recibidos por el usuario
// ═══════════════════════════════════════════════════════════════════════════════

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    const limite = parseInt(searchParams.get('limite') || '10');

    if (!email) {
      return Response.json({
        success: false,
        error: 'Email requerido'
      }, { status: 400 });
    }

    // Buscar mensajes guardados del usuario
    const keyHistorial = `circulo:historial:${email.toLowerCase()}`;
    const historial = await kv.get(keyHistorial) || [];

    // Ordenar por fecha (más reciente primero) y limitar
    const mensajesOrdenados = historial
      .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
      .slice(0, limite);

    return Response.json({
      success: true,
      mensajes: mensajesOrdenados,
      total: historial.length
    });

  } catch (error) {
    console.error('[CIRCULO/HISTORIAL-MENSAJES] Error:', error);
    return Response.json({
      success: false,
      error: error.message,
      mensajes: []
    }, { status: 500 });
  }
}

// POST: Guardar mensaje en historial
export async function POST(request) {
  try {
    const { email, guardian, mensaje } = await request.json();

    if (!email || !mensaje) {
      return Response.json({
        success: false,
        error: 'Email y mensaje requeridos'
      }, { status: 400 });
    }

    const keyHistorial = `circulo:historial:${email.toLowerCase()}`;
    const historial = await kv.get(keyHistorial) || [];

    // Agregar nuevo mensaje
    historial.push({
      guardian: guardian || 'Guardián del Círculo',
      mensaje,
      fecha: new Date().toISOString()
    });

    // Mantener solo los últimos 50 mensajes
    const historialLimitado = historial.slice(-50);

    await kv.set(keyHistorial, historialLimitado);

    return Response.json({
      success: true,
      mensaje: 'Mensaje guardado'
    });

  } catch (error) {
    console.error('[CIRCULO/HISTORIAL-MENSAJES] Error POST:', error);
    return Response.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
