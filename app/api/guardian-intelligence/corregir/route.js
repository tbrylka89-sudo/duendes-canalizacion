/**
 * GUARDIAN INTELLIGENCE - API DE CORRECCIÓN AUTOMÁTICA
 * POST: Corrige historias problemáticas automáticamente
 */

import { NextResponse } from 'next/server';
import { kv } from '@vercel/kv';
import { analizarHistoria } from '@/lib/guardian-intelligence/analyzer';
import { corregirHistoria } from '@/lib/guardian-intelligence/generator';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function OPTIONS() {
  return new Response(null, { headers: corsHeaders });
}

// Helper para obtener producto de WooCommerce
async function obtenerProducto(productId) {
  const wpUrl = process.env.WORDPRESS_URL || 'https://duendesdeluruguay.com';
  const auth = Buffer.from(
    `${process.env.WC_CONSUMER_KEY}:${process.env.WC_CONSUMER_SECRET}`
  ).toString('base64');

  const response = await fetch(
    `${wpUrl}/wp-json/wc/v3/products/${productId}`,
    { headers: { 'Authorization': `Basic ${auth}` } }
  );

  if (!response.ok) {
    throw new Error(`Error obteniendo producto ${productId}: ${response.status}`);
  }

  return response.json();
}

// Helper para actualizar producto en WooCommerce
async function actualizarProducto(productId, descripcion) {
  const wpUrl = process.env.WORDPRESS_URL || 'https://duendesdeluruguay.com';
  const auth = Buffer.from(
    `${process.env.WC_CONSUMER_KEY}:${process.env.WC_CONSUMER_SECRET}`
  ).toString('base64');

  const response = await fetch(
    `${wpUrl}/wp-json/wc/v3/products/${productId}`,
    {
      method: 'PUT',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ description: descripcion })
    }
  );

  if (!response.ok) {
    throw new Error(`Error actualizando producto ${productId}: ${response.status}`);
  }

  return response.json();
}

// Helper para extraer categoría del producto
function extraerCategoria(producto) {
  if (!producto.categories || producto.categories.length === 0) {
    return 'proteccion';
  }

  const nombreCategoria = producto.categories[0].name.toLowerCase();

  if (nombreCategoria.includes('protecci') || nombreCategoria.includes('escudo')) {
    return 'proteccion';
  } else if (nombreCategoria.includes('abundancia') || nombreCategoria.includes('prosper')) {
    return 'abundancia';
  } else if (nombreCategoria.includes('amor')) {
    return 'amor';
  } else if (nombreCategoria.includes('salud') || nombreCategoria.includes('sanaci')) {
    return 'sanacion';
  } else if (nombreCategoria.includes('sabidur')) {
    return 'sabiduria';
  }

  return 'proteccion';
}

// Helper para extraer tipo del nombre
function extraerTipo(nombre) {
  const nombreLower = nombre.toLowerCase();

  if (nombreLower.includes('pixie')) return 'pixie';
  if (nombreLower.includes('hada')) return 'hada';
  if (nombreLower.includes('bruja')) return 'bruja';
  if (nombreLower.includes('duende')) return 'duende';
  if (nombreLower.includes('elfo') || nombreLower.includes('elfa')) return 'elfo';

  return 'guardián';
}

// Helper para determinar género
function extraerGenero(nombre, tipo) {
  const nombreLower = nombre.toLowerCase();
  const tipoLower = tipo.toLowerCase();

  // Por tipo
  if (['pixie', 'hada', 'bruja'].includes(tipoLower)) return 'F';
  if (['duende', 'elfo'].includes(tipoLower)) return 'M';

  // Por terminación del nombre
  if (nombreLower.endsWith('a') || nombreLower.endsWith('ela') || nombreLower.endsWith('ina')) {
    return 'F';
  }

  return 'M';
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { productId, modo = 'preview', limite = 5 } = body;

    // Modo: corregir UN producto específico
    if (productId) {
      const producto = await obtenerProducto(productId);

      const tipo = extraerTipo(producto.name);
      const categoria = extraerCategoria(producto);
      const genero = extraerGenero(producto.name, tipo);

      const datosGuardian = {
        nombre: producto.name.split(' - ')[0].split(' pixie')[0].split(' Pixie')[0].trim(),
        tipo,
        categoria,
        genero,
        accesorios: []
      };

      // Analizar historia actual
      const analisisActual = analizarHistoria(producto.description, []);

      if (analisisActual.puntaje >= 70) {
        return NextResponse.json({
          success: true,
          mensaje: 'Esta historia ya tiene buen puntaje, no necesita corrección',
          producto: producto.name,
          puntajeActual: analisisActual.puntaje
        }, { headers: corsHeaders });
      }

      // Corregir la historia
      const resultado = await corregirHistoria(
        producto.description,
        analisisActual.problemas,
        datosGuardian,
        {}
      );

      // Si modo es 'aplicar', actualizar en WooCommerce
      if (modo === 'aplicar') {
        await actualizarProducto(productId, resultado.historia);

        // Registrar corrección
        await kv.incr('gi:stats:historias_corregidas');
        await kv.lpush('gi:historial:correcciones', {
          productoId: productId,
          nombre: producto.name,
          puntajeAntes: analisisActual.puntaje,
          puntajeDespues: resultado.validacion.puntaje,
          fecha: new Date().toISOString()
        });

        return NextResponse.json({
          success: true,
          mensaje: 'Historia corregida y aplicada en WooCommerce',
          producto: producto.name,
          puntajeAntes: analisisActual.puntaje,
          puntajeDespues: resultado.validacion.puntaje,
          problemasResueltos: analisisActual.problemas.length - resultado.validacion.problemas.length
        }, { headers: corsHeaders });
      }

      // Modo preview: solo mostrar la corrección
      return NextResponse.json({
        success: true,
        modo: 'preview',
        producto: producto.name,
        puntajeAntes: analisisActual.puntaje,
        problemasAntes: analisisActual.problemas,
        historiaCorregida: resultado.historia,
        puntajeDespues: resultado.validacion.puntaje,
        problemasDespues: resultado.validacion.problemas,
        metadata: resultado.metadata
      }, { headers: corsHeaders });
    }

    // Modo: corregir MÚLTIPLES productos con peor puntaje
    // Obtener último análisis
    const ultimoAnalisis = await kv.get('gi:analisis:ultimo');

    if (!ultimoAnalisis || !ultimoAnalisis.productos) {
      return NextResponse.json({
        success: false,
        error: 'No hay análisis previo. Ejecutá /analyze primero.'
      }, { status: 400, headers: corsHeaders });
    }

    // Obtener productos con peor puntaje
    const productosProblematicos = ultimoAnalisis.productos
      .filter(p => p.puntaje < 50)
      .sort((a, b) => a.puntaje - b.puntaje)
      .slice(0, limite);

    if (productosProblematicos.length === 0) {
      return NextResponse.json({
        success: true,
        mensaje: 'No hay productos con puntaje menor a 50 para corregir'
      }, { headers: corsHeaders });
    }

    const resultados = [];
    const sincrodestinosUsados = [];

    for (const prod of productosProblematicos) {
      try {
        const producto = await obtenerProducto(prod.id);

        const tipo = extraerTipo(producto.name);
        const categoria = extraerCategoria(producto);
        const genero = extraerGenero(producto.name, tipo);

        const datosGuardian = {
          nombre: producto.name.split(' - ')[0].split(' pixie')[0].split(' Pixie')[0].trim(),
          tipo,
          categoria,
          genero,
          accesorios: []
        };

        const resultado = await corregirHistoria(
          producto.description,
          prod.problemas || [],
          datosGuardian,
          { sincrodestinosUsados }
        );

        // Actualizar si modo es 'aplicar'
        if (modo === 'aplicar') {
          await actualizarProducto(prod.id, resultado.historia);
          await kv.incr('gi:stats:historias_corregidas');
        }

        resultados.push({
          id: prod.id,
          nombre: producto.name,
          puntajeAntes: prod.puntaje,
          puntajeDespues: resultado.validacion.puntaje,
          aplicado: modo === 'aplicar'
        });

        // Agregar sincrodestino usado para evitar repeticiones
        if (resultado.metadata?.sincrodestinoNuevo) {
          sincrodestinosUsados.push(resultado.metadata.sincrodestinoNuevo);
        }

        // Pequeña pausa para no sobrecargar la API
        await new Promise(r => setTimeout(r, 1000));

      } catch (error) {
        resultados.push({
          id: prod.id,
          nombre: prod.nombre,
          error: error.message
        });
      }
    }

    return NextResponse.json({
      success: true,
      modo,
      totalProcesados: resultados.length,
      resultados,
      timestamp: new Date().toISOString()
    }, { headers: corsHeaders });

  } catch (error) {
    console.error('[GI Corregir] Error:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500, headers: corsHeaders });
  }
}

// GET: Ver historial de correcciones
export async function GET() {
  try {
    const correcciones = await kv.lrange('gi:historial:correcciones', 0, 19);
    const totalCorregidas = await kv.get('gi:stats:historias_corregidas') || 0;

    return NextResponse.json({
      success: true,
      totalCorregidas,
      ultimasCorrecciones: correcciones
    }, { headers: corsHeaders });

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500, headers: corsHeaders });
  }
}
