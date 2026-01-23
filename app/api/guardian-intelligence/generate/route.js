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
      // Obtener contexto GLOBAL (de TODAS las categorías, días anteriores incluidos)
      const frasesUsadas = await kv.lrange('gi:frases:usadas', 0, 99) || [];
      const sincrodestinosUsados = await kv.lrange('gi:sincrodestinos:usados', 0, 49) || [];
      const estructurasRecientes = await kv.lrange('gi:estructuras:recientes', 0, 9) || [];
      const patronesRecientes = await kv.lrange('gi:patrones:apertura', 0, 14) || []; // Últimos 15 patrones
      const hooksUsados = await kv.lrange('gi:hooks:usados', 0, 19) || []; // Últimos 20 hooks

      const contexto = {
        frasesUsadas,
        sincrodestinosUsados,
        estructurasRecientes,
        patronesRecientes,  // NUEVO: patrones de apertura usados globalmente
        hooksUsados         // NUEVO: hooks específicos usados
      };

      console.log(`[GI] Contexto cargado - Patrones recientes: ${patronesRecientes.length}, Hooks: ${hooksUsados.length}`);

      const resultado = await generarHistoriaUnica(datos, contexto);

      // Guardar la estructura usada
      if (resultado.metadata?.estructuraUsada) {
        await kv.lpush('gi:estructuras:recientes', resultado.metadata.estructuraUsada);
        await kv.ltrim('gi:estructuras:recientes', 0, 9);
      }

      // NUEVO: Guardar el patrón de apertura usado (para rotación global)
      if (resultado.metadata?.patronApertura) {
        await kv.lpush('gi:patrones:apertura', resultado.metadata.patronApertura);
        await kv.ltrim('gi:patrones:apertura', 0, 14); // Mantener últimos 15
        console.log(`[GI] Patrón guardado: ${resultado.metadata.patronApertura}`);
      }

      // NUEVO: Guardar el hook usado
      if (resultado.metadata?.hookUsado) {
        await kv.lpush('gi:hooks:usados', resultado.metadata.hookUsado);
        await kv.ltrim('gi:hooks:usados', 0, 19); // Mantener últimos 20
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
      historiasGeneradas: await kv.get('gi:stats:historias_generadas') || 0,
      patronesRecientes: await kv.lrange('gi:patrones:apertura', 0, 14) || [],
      hooksRecientes: await kv.lrange('gi:hooks:usados', 0, 9) || []
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
