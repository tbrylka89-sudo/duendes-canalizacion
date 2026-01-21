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

    // Acción: aplicar historia a WooCommerce
    if (accion === 'aplicar' && datos?.id && datos?.historia) {
      const resultado = await aplicarHistoriaWooCommerce(datos.id, datos.historia);

      if (resultado.success) {
        // Incrementar contador de historias corregidas
        await kv.incr('gi:stats:historias_corregidas');
      }

      return NextResponse.json({
        success: resultado.success,
        mensaje: resultado.mensaje,
        productoId: datos.id,
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

/**
 * Aplica una historia directamente a WooCommerce
 */
async function aplicarHistoriaWooCommerce(productoId, historia) {
  try {
    const wpUrl = process.env.WORDPRESS_URL || 'https://duendesdeluruguay.com';
    const auth = Buffer.from(
      `${process.env.WC_CONSUMER_KEY}:${process.env.WC_CONSUMER_SECRET}`
    ).toString('base64');

    const response = await fetch(`${wpUrl}/wp-json/wc/v3/products/${productoId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        description: historia
      })
    });

    if (!response.ok) {
      throw new Error(`WooCommerce respondió ${response.status}`);
    }

    return {
      success: true,
      mensaje: 'Historia aplicada correctamente'
    };

  } catch (error) {
    console.error('[GI Generate] Error aplicando historia:', error);
    return {
      success: false,
      mensaje: error.message
    };
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
