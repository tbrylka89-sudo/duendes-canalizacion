/**
 * GUARDIAN INTELLIGENCE - API DE SEO AUTOMÁTICO
 * POST: Genera SEO optimizado para Rank Math 100/100
 */

import { NextResponse } from 'next/server';
import { generarSEO } from '@/lib/guardian-intelligence/generator';

export async function POST(request) {
  try {
    const body = await request.json();
    const { producto, aplicar = false } = body;

    if (!producto) {
      return NextResponse.json({
        success: false,
        error: 'Falta el producto'
      }, { status: 400 });
    }

    // Generar SEO optimizado
    const seo = await generarSEO(producto);

    // Si se pide aplicar directamente a WooCommerce
    if (aplicar && producto.id) {
      const resultado = await aplicarSEOaWooCommerce(producto.id, seo);

      return NextResponse.json({
        success: true,
        seo,
        aplicado: resultado.success,
        mensaje: resultado.mensaje,
        timestamp: new Date().toISOString()
      });
    }

    return NextResponse.json({
      success: true,
      seo,
      aplicado: false,
      instrucciones: {
        rankMath: {
          focusKeyword: seo.focusKeyword,
          metaDescription: seo.metaDescription,
          seoTitle: seo.tituloSEO
        },
        schema: seo.schema,
        sugerencias: seo.sugerencias
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('[GI SEO] Error:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}

/**
 * Aplica el SEO directamente a WooCommerce via API
 */
async function aplicarSEOaWooCommerce(productoId, seo) {
  try {
    const wpUrl = process.env.WORDPRESS_URL || 'https://duendesdeluruguay.com';
    const auth = Buffer.from(
      `${process.env.WC_CONSUMER_KEY}:${process.env.WC_CONSUMER_SECRET}`
    ).toString('base64');

    // Actualizar meta datos del producto
    // Nota: Rank Math usa meta_data específicos
    const metaData = [
      { key: 'rank_math_focus_keyword', value: seo.focusKeyword },
      { key: 'rank_math_description', value: seo.metaDescription },
      { key: 'rank_math_title', value: seo.tituloSEO },
      { key: '_yoast_wpseo_focuskw', value: seo.focusKeyword }, // Por si usa Yoast
      { key: '_yoast_wpseo_metadesc', value: seo.metaDescription }
    ];

    const response = await fetch(`${wpUrl}/wp-json/wc/v3/products/${productoId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        meta_data: metaData
      })
    });

    if (!response.ok) {
      throw new Error(`WooCommerce respondió ${response.status}`);
    }

    return {
      success: true,
      mensaje: 'SEO aplicado correctamente'
    };

  } catch (error) {
    console.error('[GI SEO] Error aplicando:', error);
    return {
      success: false,
      mensaje: error.message
    };
  }
}

// GET: Obtener estado SEO de todos los productos
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const limite = parseInt(searchParams.get('limite') || '10');

    const wpUrl = process.env.WORDPRESS_URL || 'https://duendesdeluruguay.com';
    const auth = Buffer.from(
      `${process.env.WC_CONSUMER_KEY}:${process.env.WC_CONSUMER_SECRET}`
    ).toString('base64');

    const response = await fetch(
      `${wpUrl}/wp-json/wc/v3/products?per_page=${limite}&status=publish`,
      {
        headers: { 'Authorization': `Basic ${auth}` }
      }
    );

    if (!response.ok) {
      throw new Error('Error obteniendo productos');
    }

    const productos = await response.json();

    // Analizar estado SEO de cada producto
    const analisis = productos.map(p => {
      const tieneTitle = p.meta_data?.find(m => m.key === 'rank_math_title')?.value;
      const tieneDesc = p.meta_data?.find(m => m.key === 'rank_math_description')?.value;
      const tieneKeyword = p.meta_data?.find(m => m.key === 'rank_math_focus_keyword')?.value;

      return {
        id: p.id,
        nombre: p.name,
        seoCompleto: !!(tieneTitle && tieneDesc && tieneKeyword),
        tiene: {
          titulo: !!tieneTitle,
          descripcion: !!tieneDesc,
          keyword: !!tieneKeyword
        }
      };
    });

    const sinSEO = analisis.filter(p => !p.seoCompleto);

    return NextResponse.json({
      success: true,
      total: productos.length,
      conSEO: analisis.filter(p => p.seoCompleto).length,
      sinSEO: sinSEO.length,
      productosSinSEO: sinSEO,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
