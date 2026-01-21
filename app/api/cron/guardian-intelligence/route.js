/**
 * GUARDIAN INTELLIGENCE - CRON JOB
 * Se ejecuta cada 15 minutos para monitoreo 24/7
 * Configurado en vercel.json con schedule cada 15 minutos
 */

import { NextResponse } from 'next/server';
import { kv } from '@vercel/kv';
import { ejecutarMonitoreo, obtenerEstadoMonitor } from '@/lib/guardian-intelligence/monitor';

export async function GET(request) {
  try {
    // Verificar autenticación del cron
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;

    // En producción, verificar el secret
    if (process.env.NODE_ENV === 'production') {
      if (authHeader !== `Bearer ${cronSecret}`) {
        return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
      }
    }

    // Verificar si el monitor está activo
    const monitorActivo = await obtenerEstadoMonitor();

    if (!monitorActivo) {
      return NextResponse.json({
        success: true,
        mensaje: 'Monitor 24/7 está desactivado',
        ejecutado: false
      });
    }

    // Ejecutar monitoreo completo
    const resultado = await ejecutarMonitoreo();

    // Registrar ejecución
    await kv.set('gi:cron:ultima_ejecucion', {
      fecha: new Date().toISOString(),
      resultado: resultado.resumen
    });

    // Si hay problemas críticos, ya se enviaron alertas en ejecutarMonitoreo()

    return NextResponse.json({
      success: true,
      ejecutado: true,
      resultado: resultado.resumen,
      alertas: resultado.alertas.length,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('[GI Cron] Error:', error);

    // Guardar error para diagnóstico
    await kv.lpush('gi:cron:errores', {
      fecha: new Date().toISOString(),
      error: error.message
    });
    await kv.ltrim('gi:cron:errores', 0, 99);

    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}

// También permitir POST para ejecución manual
export async function POST(request) {
  return GET(request);
}
