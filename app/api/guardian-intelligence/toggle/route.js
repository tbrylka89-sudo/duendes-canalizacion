/**
 * GUARDIAN INTELLIGENCE - API DE TOGGLE
 * POST: Activa/desactiva funcionalidades del sistema
 */

import { NextResponse } from 'next/server';
import { kv } from '@vercel/kv';

export async function POST(request) {
  try {
    const body = await request.json();
    const { funcionalidad, activo } = body;

    const funcionalidades = {
      'monitor_24_7': 'gi:config:monitor_activo',
      'seo_automatico': 'gi:config:seo_automatico',
      'correccion_automatica': 'gi:config:correccion_automatica',
      'alertas_whatsapp': 'gi:config:alertas_whatsapp',
      'alertas_email': 'gi:config:alertas_email',
      'cross_selling': 'gi:config:cross_selling'
    };

    if (!funcionalidades[funcionalidad]) {
      return NextResponse.json({
        success: false,
        error: 'Funcionalidad no válida',
        funcionalidadesDisponibles: Object.keys(funcionalidades)
      }, { status: 400 });
    }

    await kv.set(funcionalidades[funcionalidad], activo);

    return NextResponse.json({
      success: true,
      funcionalidad,
      activo,
      mensaje: `${funcionalidad} ${activo ? 'ACTIVADO' : 'DESACTIVADO'}`
    });

  } catch (error) {
    console.error('[GI Toggle] Error:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}

// GET: Obtener estado de todas las funcionalidades
export async function GET() {
  try {
    const estado = {
      monitor_24_7: await kv.get('gi:config:monitor_activo') ?? true,
      seo_automatico: await kv.get('gi:config:seo_automatico') ?? true,
      correccion_automatica: await kv.get('gi:config:correccion_automatica') ?? false,
      alertas_whatsapp: await kv.get('gi:config:alertas_whatsapp') ?? true,
      alertas_email: await kv.get('gi:config:alertas_email') ?? true,
      cross_selling: await kv.get('gi:config:cross_selling') ?? true
    };

    return NextResponse.json({
      success: true,
      estado,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
