import { NextResponse } from 'next/server';

// ═══════════════════════════════════════════════════════════════════════════════
// API: PRODUCTOS DE TIENDA
// Obtiene productos de WooCommerce para mostrar en la tienda Vercel
// ═══════════════════════════════════════════════════════════════════════════════

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const WOO_URL = process.env.WORDPRESS_URL || 'https://duendesuy.10web.cloud';
    const WOO_KEY = process.env.WC_CONSUMER_KEY;
    const WOO_SECRET = process.env.WC_CONSUMER_SECRET;

    if (!WOO_KEY || !WOO_SECRET) {
      return NextResponse.json({
        success: false,
        error: 'Credenciales de WooCommerce no configuradas',
        productos: []
      });
    }

    const auth = Buffer.from(`${WOO_KEY}:${WOO_SECRET}`).toString('base64');

    // Obtener productos publicados
    const res = await fetch(
      `${WOO_URL}/wp-json/wc/v3/products?per_page=100&status=publish&orderby=date&order=desc`,
      {
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/json'
        },
        next: { revalidate: 300 } // Cache 5 minutos
      }
    );

    if (!res.ok) {
      console.error('[TIENDA] WooCommerce error:', res.status);
      return NextResponse.json({
        success: false,
        error: `Error de WooCommerce: ${res.status}`,
        productos: []
      });
    }

    const productos = await res.json();

    // Formatear productos para el frontend
    const productosFormateados = productos.map(p => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      price: p.price,
      regular_price: p.regular_price,
      sale_price: p.sale_price,
      on_sale: p.on_sale,
      permalink: p.permalink,
      short_description: p.short_description?.replace(/<[^>]*>/g, '').substring(0, 150),
      images: p.images?.map(img => ({
        id: img.id,
        src: img.src,
        alt: img.alt
      })) || [],
      categories: p.categories?.map(cat => ({
        id: cat.id,
        name: cat.name,
        slug: cat.slug
      })) || [],
      stock_status: p.stock_status,
      attributes: p.attributes
    }));

    return NextResponse.json({
      success: true,
      productos: productosFormateados,
      total: productosFormateados.length
    });

  } catch (error) {
    console.error('[TIENDA] Error:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
      productos: []
    }, { status: 500 });
  }
}
