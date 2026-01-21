/**
 * GUARDIAN INTELLIGENCE - API DE ESTADÍSTICAS
 * GET: Obtiene estadísticas completas del sistema
 */

import { NextResponse } from 'next/server';
import { kv } from '@vercel/kv';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const tipo = searchParams.get('tipo') || 'resumen';

    // Estadísticas básicas
    const stats = {
      fecha: new Date().toISOString(),

      // Historias
      historiasGeneradas: await kv.get('gi:stats:historias_generadas') || 0,
      historiasCorregidas: await kv.get('gi:stats:historias_corregidas') || 0,

      // SEO
      productosConSEO: await kv.get('gi:stats:productos_con_seo') || 0,
      seoAplicadosHoy: await kv.get('gi:stats:seo_hoy') || 0,

      // Monitor
      monitorActivo: await kv.get('gi:config:monitor_activo') ?? true,
      ultimoMonitoreo: await kv.get('gi:monitor:ultimo'),
      alertasPendientes: await kv.llen('gi:alertas:pendientes') || 0,

      // Base de conocimiento
      frasesUsadas: await kv.llen('gi:frases:usadas') || 0,
      sincrodestinosUsados: await kv.llen('gi:sincrodestinos:usados') || 0,

      // Último análisis
      ultimoAnalisis: await kv.get('gi:analisis:ultimo')
    };

    // Si piden detalle, agregar más info
    if (tipo === 'detalle') {
      stats.detalle = {
        ultimasHistorias: await kv.lrange('gi:historial:historias', 0, 9),
        ultimasAlertas: await kv.lrange('gi:alertas:pendientes', 0, 9),
        ultimosSEO: await kv.lrange('gi:historial:seo', 0, 9)
      };
    }

    return NextResponse.json({
      success: true,
      stats
    });

  } catch (error) {
    console.error('[GI Stats] Error:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}

// POST: Registrar estadística
export async function POST(request) {
  try {
    const body = await request.json();
    const { tipo, valor = 1 } = body;

    const statsKeys = {
      historia_generada: 'gi:stats:historias_generadas',
      historia_corregida: 'gi:stats:historias_corregidas',
      seo_aplicado: 'gi:stats:productos_con_seo',
      seo_hoy: 'gi:stats:seo_hoy'
    };

    if (statsKeys[tipo]) {
      await kv.incrby(statsKeys[tipo], valor);
      return NextResponse.json({
        success: true,
        mensaje: `Estadística ${tipo} incrementada en ${valor}`
      });
    }

    return NextResponse.json({
      success: false,
      error: 'Tipo de estadística no válido'
    }, { status: 400 });

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
