import { kv } from '@vercel/kv';
import { notificarRecordatorioRacha } from '@/lib/emails';

// ═══════════════════════════════════════════════════════════════════════════════
// CRON: RECORDATORIO DE RACHA
// Se ejecuta cada día para recordar a usuarios con rachas activas
// Configurar en vercel.json como cron job
// ═══════════════════════════════════════════════════════════════════════════════

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export async function GET(request) {
  try {
    // Verificar cron secret (para que no cualquiera lo ejecute)
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('[CRON-RACHA] Iniciando recordatorios de racha...');

    // Obtener todos los usuarios
    const usuariosKeys = await kv.keys('user:*');
    let recordatoriosEnviados = 0;
    let errores = 0;

    const ahora = new Date();
    const horaActual = ahora.getHours();

    // Solo enviar recordatorios entre 18:00 y 22:00
    if (horaActual < 18 || horaActual > 22) {
      return Response.json({
        success: true,
        mensaje: 'Fuera de horario de recordatorios',
        hora: horaActual
      });
    }

    for (const key of usuariosKeys) {
      // Ignorar keys de progreso, badges, etc
      if (key.includes(':progreso') || key.includes(':badges') ||
          key.includes(':transacciones') || key.includes(':historial')) continue;

      try {
        const usuario = await kv.get(key);
        if (!usuario) continue;

        const email = key.replace('user:', '');
        const racha = usuario.racha || 0;

        // Solo usuarios con racha activa (más de 2 días)
        if (racha < 3) continue;

        // Verificar si ya reclamó hoy
        const ultimoCofre = usuario.ultimoCofre;
        if (ultimoCofre) {
          const fechaUltimo = new Date(ultimoCofre);
          const hoy = new Date();
          hoy.setHours(0, 0, 0, 0);
          fechaUltimo.setHours(0, 0, 0, 0);

          // Si ya reclamó hoy, no necesita recordatorio
          if (fechaUltimo.getTime() === hoy.getTime()) continue;
        }

        // Calcular horas restantes hasta medianoche
        const medianoche = new Date();
        medianoche.setHours(24, 0, 0, 0);
        const horasRestantes = Math.round((medianoche - ahora) / (1000 * 60 * 60));

        // Solo recordar si quedan menos de 6 horas
        if (horasRestantes > 6) continue;

        // Verificar preferencias de notificación
        if (usuario.notificaciones?.email === false) continue;

        // Enviar recordatorio
        const nombre = usuario.nombrePreferido || usuario.nombre || 'Alma mágica';
        const result = await notificarRecordatorioRacha(email, nombre, racha, horasRestantes);

        if (result.success) {
          recordatoriosEnviados++;
          console.log(`[CRON-RACHA] Recordatorio enviado a ${email} (racha: ${racha})`);
        } else {
          errores++;
        }

        // Pausa entre emails para no saturar
        await new Promise(r => setTimeout(r, 200));

      } catch (e) {
        console.error(`[CRON-RACHA] Error procesando usuario:`, e);
        errores++;
      }
    }

    console.log(`[CRON-RACHA] Finalizado. Enviados: ${recordatoriosEnviados}, Errores: ${errores}`);

    return Response.json({
      success: true,
      recordatoriosEnviados,
      errores,
      hora: horaActual
    });

  } catch (error) {
    console.error('[CRON-RACHA] Error general:', error);
    return Response.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
