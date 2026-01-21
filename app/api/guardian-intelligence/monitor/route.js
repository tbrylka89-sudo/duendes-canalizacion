/**
 * GUARDIAN INTELLIGENCE - API DE MONITOREO 24/7
 * GET: Ejecuta verificación y devuelve estado
 * POST: Ejecuta verificación completa
 */

import { NextResponse } from 'next/server';
import {
  ejecutarMonitoreo,
  obtenerUltimoMonitoreo,
  obtenerHistorialMonitoreo,
  obtenerAlertasPendientes,
  marcarAlertaLeida,
  toggleMonitor,
  obtenerEstadoMonitor,
  verificarSaldos
} from '@/lib/guardian-intelligence/monitor';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const accion = searchParams.get('accion') || 'estado';

    switch (accion) {
      case 'estado':
        const ultimo = await obtenerUltimoMonitoreo();
        const activo = await obtenerEstadoMonitor();
        return NextResponse.json({
          success: true,
          monitorActivo: activo,
          ultimoMonitoreo: ultimo,
          timestamp: new Date().toISOString()
        });

      case 'historial':
        const limite = parseInt(searchParams.get('limite') || '10');
        const historial = await obtenerHistorialMonitoreo(limite);
        return NextResponse.json({
          success: true,
          historial,
          total: historial.length
        });

      case 'alertas':
        const alertas = await obtenerAlertasPendientes();
        return NextResponse.json({
          success: true,
          alertas,
          total: alertas.length
        });

      case 'saldos':
        const saldos = await verificarSaldos();
        return NextResponse.json({
          success: true,
          saldos
        });

      case 'ejecutar':
        const resultado = await ejecutarMonitoreo();
        return NextResponse.json({
          success: true,
          resultado
        });

      default:
        return NextResponse.json({
          success: false,
          error: 'Acción no válida'
        }, { status: 400 });
    }

  } catch (error) {
    console.error('[GI Monitor] Error:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { accion, valor, alertaIndex } = body;

    switch (accion) {
      case 'ejecutar':
        const resultado = await ejecutarMonitoreo();
        return NextResponse.json({
          success: true,
          resultado
        });

      case 'toggle':
        const nuevoEstado = await toggleMonitor(valor);
        return NextResponse.json({
          success: true,
          ...nuevoEstado
        });

      case 'leer_alerta':
        await marcarAlertaLeida(alertaIndex);
        return NextResponse.json({
          success: true,
          mensaje: 'Alerta marcada como leída'
        });

      default:
        return NextResponse.json({
          success: false,
          error: 'Acción no válida'
        }, { status: 400 });
    }

  } catch (error) {
    console.error('[GI Monitor] Error:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
