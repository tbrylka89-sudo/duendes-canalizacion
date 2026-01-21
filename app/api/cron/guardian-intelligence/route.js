/**
 * GUARDIAN INTELLIGENCE - CRON JOB
 * Se ejecuta una vez por día (7:00 AM Uruguay) para generar reporte diario
 */

import { NextResponse } from 'next/server';
import { kv } from '@vercel/kv';
import { ejecutarReporteDiario } from '@/lib/guardian-intelligence/daily-report';
import { obtenerEstadoMonitor } from '@/lib/guardian-intelligence/monitor';

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

    // Verificar si el reporte está activo
    const reporteActivo = await obtenerEstadoMonitor();

    if (!reporteActivo) {
      return NextResponse.json({
        success: true,
        mensaje: 'Reporte diario está desactivado',
        ejecutado: false
      });
    }

    // Ejecutar reporte diario completo
    const resultado = await ejecutarReporteDiario();

    // Registrar ejecución
    await kv.set('gi:cron:ultima_ejecucion', {
      fecha: new Date().toISOString(),
      tipo: 'reporte_diario',
      alertas: resultado.reporte.alertas.length,
      emailEnviado: resultado.envio.success
    });

    return NextResponse.json({
      success: true,
      ejecutado: true,
      resumen: resultado.reporte.resumen,
      alertas: resultado.reporte.alertas.length,
      emailEnviado: resultado.envio.success,
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
