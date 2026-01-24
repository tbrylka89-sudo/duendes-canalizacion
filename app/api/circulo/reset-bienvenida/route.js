import { kv } from '@vercel/kv';

// ═══════════════════════════════════════════════════════════════════════════════
// API: Reset bienvenida del usuario para forzar regeneración
// Borra el cache de bienvenida y duende-del-dia para que se genere de nuevo
// ═══════════════════════════════════════════════════════════════════════════════

export async function POST(request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return Response.json({
        success: false,
        error: 'Email requerido'
      }, { status: 400 });
    }

    const emailNorm = email.toLowerCase().trim();
    const borrados = [];
    const errores = [];

    // 1. Borrar bienvenida cacheada
    try {
      await kv.del(`bienvenida:${emailNorm}`);
      borrados.push(`bienvenida:${emailNorm}`);
    } catch (e) {
      errores.push({ key: `bienvenida:${emailNorm}`, error: e.message });
    }

    // 2. Borrar duende-dia de hoy
    const hoy = new Date().toISOString().split('T')[0];
    try {
      await kv.del(`circulo:duende-dia:${hoy}`);
      borrados.push(`circulo:duende-dia:${hoy}`);
    } catch (e) {
      errores.push({ key: `circulo:duende-dia:${hoy}`, error: e.message });
    }

    // 3. Borrar historial de mensajes del usuario (opcional - para limpiar mensajes viejos)
    try {
      await kv.del(`circulo:historial:${emailNorm}`);
      borrados.push(`circulo:historial:${emailNorm}`);
    } catch (e) {
      errores.push({ key: `circulo:historial:${emailNorm}`, error: e.message });
    }

    return Response.json({
      success: true,
      mensaje: 'Cache de bienvenida reseteado. Volvé a entrar al Círculo para ver a Marcos.',
      borrados,
      errores: errores.length > 0 ? errores : undefined
    });

  } catch (error) {
    console.error('[RESET-BIENVENIDA] Error:', error);
    return Response.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
