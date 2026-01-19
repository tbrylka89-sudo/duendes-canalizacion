import { kv } from '@vercel/kv';

// ═══════════════════════════════════════════════════════════════════════════════
// API: DAR RUNAS A USUARIO (Admin)
// Ajustar runas de un usuario específico
// ═══════════════════════════════════════════════════════════════════════════════

export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const { email, cantidad, motivo } = await request.json();

    if (!email) {
      return Response.json({
        success: false,
        error: 'Se requiere el email del usuario'
      }, { status: 400 });
    }

    if (typeof cantidad !== 'number' || cantidad === 0) {
      return Response.json({
        success: false,
        error: 'Se requiere una cantidad válida'
      }, { status: 400 });
    }

    // Obtener usuario actual
    const usuario = await kv.get(`user:${email}`);

    if (!usuario) {
      return Response.json({
        success: false,
        error: 'Usuario no encontrado'
      }, { status: 404 });
    }

    // Calcular nuevo balance
    const runasActuales = usuario.runas || 0;
    const nuevasRunas = Math.max(0, runasActuales + cantidad); // No permitir runas negativas

    // Actualizar usuario
    await kv.set(`user:${email}`, {
      ...usuario,
      runas: nuevasRunas,
      ultimaActividad: new Date().toISOString()
    });

    // Registrar la transacción
    const transaccion = {
      tipo: cantidad > 0 ? 'admin_regalo' : 'admin_ajuste',
      cantidad,
      motivo: motivo || 'Ajuste administrativo',
      fecha: new Date().toISOString(),
      balanceAnterior: runasActuales,
      balanceNuevo: nuevasRunas
    };

    // Agregar al historial de transacciones del usuario
    const historialKey = `user:${email}:transacciones`;
    const historial = await kv.get(historialKey) || [];
    historial.unshift(transaccion);

    // Mantener solo las últimas 100 transacciones
    await kv.set(historialKey, historial.slice(0, 100));

    console.log(`[DAR-RUNAS] Admin ajustó ${cantidad} runas a ${email}. Nuevo balance: ${nuevasRunas}`);

    return Response.json({
      success: true,
      mensaje: cantidad > 0
        ? `Se otorgaron ${cantidad} runas a ${email}`
        : `Se restaron ${Math.abs(cantidad)} runas de ${email}`,
      runasAntes: runasActuales,
      runasDespues: nuevasRunas
    });

  } catch (error) {
    console.error('[DAR-RUNAS] Error:', error);
    return Response.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
