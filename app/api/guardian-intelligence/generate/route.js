/**
 * GUARDIAN INTELLIGENCE - API DE GENERACIÓN
 * POST: Genera historia única para un guardián
 */

import { NextResponse } from 'next/server';
import { kv } from '@vercel/kv';
import { generarHistoriaUnica, reescribirSeccion } from '@/lib/guardian-intelligence/generator';

export async function POST(request) {
  try {
    const body = await request.json();
    const { accion = 'generar', datos, problema, seccion } = body;

    // Acción: generar historia nueva
    if (accion === 'generar' && datos) {
      // Obtener contexto (frases ya usadas, etc.)
      const frasesUsadas = await kv.lrange('gi:frases:usadas', 0, 99) || [];
      const sincrodestinosUsados = await kv.lrange('gi:sincrodestinos:usados', 0, 49) || [];
      const estructurasRecientes = await kv.lrange('gi:estructuras:recientes', 0, 9) || [];

      const contexto = {
        frasesUsadas,
        sincrodestinosUsados,
        estructurasRecientes
      };

      const resultado = await generarHistoriaUnica(datos, contexto);

      // Guardar la estructura usada
      if (resultado.metadata?.estructuraUsada) {
        await kv.lpush('gi:estructuras:recientes', resultado.metadata.estructuraUsada);
        await kv.ltrim('gi:estructuras:recientes', 0, 9);
      }

      return NextResponse.json({
        success: true,
        ...resultado,
        timestamp: new Date().toISOString()
      });
    }

    // Acción: reescribir sección problemática
    if (accion === 'reescribir' && seccion && problema) {
      const nuevaSeccion = await reescribirSeccion(seccion, problema);

      return NextResponse.json({
        success: true,
        seccionOriginal: seccion,
        seccionNueva: nuevaSeccion,
        timestamp: new Date().toISOString()
      });
    }

    return NextResponse.json({
      success: false,
      error: 'Acción no válida o faltan parámetros'
    }, { status: 400 });

  } catch (error) {
    console.error('[GI Generate] Error:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}

// GET: Obtener estadísticas de generación
export async function GET() {
  try {
    const stats = {
      frasesUsadas: await kv.llen('gi:frases:usadas') || 0,
      sincrodestinosUsados: await kv.llen('gi:sincrodestinos:usados') || 0,
      historiasGeneradas: await kv.get('gi:stats:historias_generadas') || 0
    };

    return NextResponse.json({
      success: true,
      stats
    });

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
