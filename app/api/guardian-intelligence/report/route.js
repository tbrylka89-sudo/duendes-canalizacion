/**
 * GUARDIAN INTELLIGENCE - API DE REPORTES
 * GET: Ver último reporte o reportes anteriores
 * POST: Generar reporte manualmente
 */

import { NextResponse } from 'next/server';
import { kv } from '@vercel/kv';
import { generarReporteDiario, enviarReporteDiario, registrarEvento, TIPOS_EVENTO } from '@/lib/guardian-intelligence/daily-report';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const accion = searchParams.get('accion') || 'ultimo';
    const fecha = searchParams.get('fecha');

    // Obtener último reporte
    if (accion === 'ultimo') {
      const hoy = new Date().toISOString().split('T')[0];
      const ayer = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];

      // Intentar hoy, luego ayer
      let reporte = await kv.get(`gi:reporte:${hoy}`);
      if (!reporte) {
        reporte = await kv.get(`gi:reporte:${ayer}`);
      }

      if (!reporte) {
        return NextResponse.json({
          success: false,
          mensaje: 'No hay reportes guardados aún'
        });
      }

      return NextResponse.json({
        success: true,
        reporte
      });
    }

    // Obtener reporte de fecha específica
    if (accion === 'fecha' && fecha) {
      const reporte = await kv.get(`gi:reporte:${fecha}`);

      if (!reporte) {
        return NextResponse.json({
          success: false,
          mensaje: `No hay reporte para ${fecha}`
        });
      }

      return NextResponse.json({
        success: true,
        reporte
      });
    }

    // Listar reportes disponibles (últimos 7 días)
    if (accion === 'listar') {
      const reportes = [];
      for (let i = 0; i < 7; i++) {
        const fecha = new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        const reporte = await kv.get(`gi:reporte:${fecha}`);
        if (reporte) {
          reportes.push({
            fecha,
            alertas: reporte.alertas?.length || 0,
            ventas: reporte.resumen?.ventas?.total || 'N/A'
          });
        }
      }

      return NextResponse.json({
        success: true,
        reportes
      });
    }

    return NextResponse.json({
      success: false,
      error: 'Acción no válida. Usar: ultimo, fecha, listar'
    }, { status: 400 });

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { accion = 'generar', fecha, enviarEmail = true, evento } = body;

    // Generar reporte (manual)
    if (accion === 'generar') {
      const reporte = await generarReporteDiario(fecha);

      let envio = { success: false, mensaje: 'No se solicitó envío' };
      if (enviarEmail) {
        envio = await enviarReporteDiario(reporte);
      }

      return NextResponse.json({
        success: true,
        reporte,
        emailEnviado: envio.success,
        timestamp: new Date().toISOString()
      });
    }

    // Registrar evento manualmente (para testing)
    if (accion === 'registrar_evento' && evento) {
      await registrarEvento(evento.tipo, evento.datos || {});

      return NextResponse.json({
        success: true,
        mensaje: `Evento '${evento.tipo}' registrado`,
        tiposDisponibles: Object.values(TIPOS_EVENTO)
      });
    }

    return NextResponse.json({
      success: false,
      error: 'Acción no válida'
    }, { status: 400 });

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
