import { kv } from '@vercel/kv';

// ═══════════════════════════════════════════════════════════════════════════════
// API: DAR RUNAS MASIVO (Admin)
// Otorgar runas a todos los usuarios o a un grupo específico
// ═══════════════════════════════════════════════════════════════════════════════

export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const {
      cantidad,
      motivo,
      filtro = 'todos' // 'todos', 'circulo', 'activos'
    } = await request.json();

    if (typeof cantidad !== 'number' || cantidad <= 0) {
      return Response.json({
        success: false,
        error: 'Se requiere una cantidad positiva'
      }, { status: 400 });
    }

    // Obtener todos los usuarios
    const usuariosKeys = await kv.keys('user:*');
    let usuariosActualizados = 0;
    let totalRunasOtorgadas = 0;

    const hace30dias = Date.now() - 30 * 24 * 60 * 60 * 1000;

    for (const key of usuariosKeys) {
      // Ignorar keys de progreso, badges, historial, etc.
      if (key.includes(':')) {
        const partes = key.split(':');
        if (partes.length > 2) continue;
      }

      const usuario = await kv.get(key);
      if (!usuario) continue;

      const email = key.replace('user:', '');

      // Aplicar filtro
      if (filtro === 'circulo' && !usuario.esCirculo) continue;

      if (filtro === 'activos') {
        const ultimaActividad = usuario.ultimaActividad || usuario.fechaRegistro;
        if (!ultimaActividad || new Date(ultimaActividad).getTime() < hace30dias) continue;
      }

      // Actualizar runas
      const runasActuales = usuario.runas || 0;
      const nuevasRunas = runasActuales + cantidad;

      await kv.set(key, {
        ...usuario,
        runas: nuevasRunas
      });

      // Registrar transacción
      const historialKey = `user:${email}:transacciones`;
      const historial = await kv.get(historialKey) || [];
      historial.unshift({
        tipo: 'admin_masivo',
        cantidad,
        motivo: motivo || 'Regalo masivo del administrador',
        fecha: new Date().toISOString(),
        balanceAnterior: runasActuales,
        balanceNuevo: nuevasRunas
      });
      await kv.set(historialKey, historial.slice(0, 100));

      usuariosActualizados++;
      totalRunasOtorgadas += cantidad;
    }

    console.log(`[DAR-RUNAS-MASIVO] ${cantidad} runas a ${usuariosActualizados} usuarios (filtro: ${filtro})`);

    const filtroTexto = {
      'todos': 'todos los usuarios',
      'circulo': 'miembros del Círculo',
      'activos': 'usuarios activos'
    }[filtro] || filtro;

    return Response.json({
      success: true,
      mensaje: `Se otorgaron ${cantidad} runas a ${usuariosActualizados} ${filtroTexto}`,
      usuariosActualizados,
      totalRunasOtorgadas,
      filtroAplicado: filtro
    });

  } catch (error) {
    console.error('[DAR-RUNAS-MASIVO] Error:', error);
    return Response.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
