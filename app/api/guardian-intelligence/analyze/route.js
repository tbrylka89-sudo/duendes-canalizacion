/**
 * GUARDIAN INTELLIGENCE - API DE ANÁLISIS
 * POST: Analiza una o todas las historias del catálogo
 */

import { NextResponse } from 'next/server';
import { kv } from '@vercel/kv';
import { analizarHistoria, analizarCatalogoCompleto, compararContraOtras } from '@/lib/guardian-intelligence/analyzer';

// CORS headers para permitir llamadas desde WordPress
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function OPTIONS() {
  return new Response(null, { headers: corsHeaders });
}

// Helper para obtener productos de WooCommerce
async function obtenerProductosWoo() {
  const wpUrl = process.env.WORDPRESS_URL || 'https://duendesdeluruguay.com';
  const auth = Buffer.from(
    `${process.env.WC_CONSUMER_KEY}:${process.env.WC_CONSUMER_SECRET}`
  ).toString('base64');

  const productos = [];
  let page = 1;
  let hasMore = true;

  while (hasMore) {
    const response = await fetch(
      `${wpUrl}/wp-json/wc/v3/products?per_page=100&page=${page}&status=publish`,
      { headers: { 'Authorization': `Basic ${auth}` } }
    );

    if (!response.ok) break;

    const data = await response.json();
    if (data.length === 0) {
      hasMore = false;
    } else {
      productos.push(...data.map(p => ({
        id: p.id,
        nombre: p.name,
        descripcion: p.description,
        accesorios: extraerAccesorios(p)
      })));
      page++;
    }

    // Límite de seguridad
    if (page > 10) break;
  }

  return productos;
}

function extraerAccesorios(producto) {
  try {
    // Intentar extraer de meta_data
    const meta = producto.meta_data?.find(m => m.key === '_duendes_accesorios');
    if (meta && meta.value) {
      if (typeof meta.value === 'string') {
        return meta.value.split(',').map(a => a.trim());
      }
      if (Array.isArray(meta.value)) {
        return meta.value;
      }
    }

    // Intentar extraer de atributos
    const attr = producto.attributes?.find(a =>
      a.name && a.name.toLowerCase().includes('accesorio')
    );
    if (attr && attr.options) return attr.options;

    return [];
  } catch (e) {
    return [];
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    let { modo = 'individual', producto, todosLosProductos } = body;

    // Modo individual: analiza una sola historia
    if (modo === 'individual' && producto) {
      const historia = producto.descripcion || producto.historia || '';
      const accesorios = producto.accesorios || [];

      const analisis = analizarHistoria(historia, accesorios);

      // Si hay otras historias para comparar
      let similitudes = [];
      if (todosLosProductos && todosLosProductos.length > 0) {
        const historias = todosLosProductos.map(p => ({
          id: p.id,
          nombre: p.nombre,
          contenido: p.descripcion || p.historia || ''
        }));

        similitudes = compararContraOtras(
          { id: producto.id, contenido: historia },
          historias
        );
      }

      return NextResponse.json({
        success: true,
        producto: {
          id: producto.id,
          nombre: producto.nombre
        },
        analisis,
        similitudes: similitudes.filter(s => s.similitud >= 40),
        timestamp: new Date().toISOString()
      }, { headers: corsHeaders });
    }

    // Modo completo: analiza todo el catálogo
    if (modo === 'completo') {
      // Si no se pasaron productos, obtenerlos de WooCommerce
      if (!todosLosProductos || todosLosProductos.length === 0) {
        todosLosProductos = await obtenerProductosWoo();
      }

      if (todosLosProductos.length === 0) {
        return NextResponse.json({
          success: false,
          error: 'No se encontraron productos para analizar'
        }, { status: 400, headers: corsHeaders });
      }

      const resultado = analizarCatalogoCompleto(todosLosProductos);

      // Guardar resultado en KV
      await kv.set('gi:analisis:ultimo', {
        fecha: new Date().toISOString(),
        total: resultado.total,
        productos: resultado.productos,
        resumen: resultado.resumen
      });

      return NextResponse.json({
        success: true,
        resultado,
        timestamp: new Date().toISOString()
      }, { headers: corsHeaders });
    }

    return NextResponse.json({
      success: false,
      error: 'Modo no válido o faltan parámetros'
    }, { status: 400, headers: corsHeaders });

  } catch (error) {
    console.error('[GI Analyze] Error:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500, headers: corsHeaders });
  }
}

// GET: Obtener último análisis guardado
export async function GET() {
  try {
    const ultimoAnalisis = await kv.get('gi:analisis:ultimo');

    if (!ultimoAnalisis) {
      return NextResponse.json({
        success: false,
        mensaje: 'No hay análisis previo guardado'
      }, { headers: corsHeaders });
    }

    return NextResponse.json({
      success: true,
      analisis: ultimoAnalisis
    }, { headers: corsHeaders });

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500, headers: corsHeaders });
  }
}
