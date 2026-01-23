/**
 * Sitemap dinamico para Duendes del Uruguay
 * Next.js 14 App Router - Genera sitemap.xml automaticamente
 */

const SITE_URL = 'https://duendes-vercel.vercel.app';

/**
 * Obtiene productos de WooCommerce
 */
async function getProductos() {
  try {
    const WOO_URL = process.env.WORDPRESS_URL || 'https://duendesdeluruguay.com';
    const WOO_KEY = process.env.WC_CONSUMER_KEY;
    const WOO_SECRET = process.env.WC_CONSUMER_SECRET;

    if (!WOO_KEY || !WOO_SECRET) {
      console.warn('[SITEMAP] Credenciales de WooCommerce no configuradas');
      return [];
    }

    const auth = Buffer.from(`${WOO_KEY}:${WOO_SECRET}`).toString('base64');

    const res = await fetch(
      `${WOO_URL}/wp-json/wc/v3/products?per_page=100&status=publish`,
      {
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/json'
        },
        next: { revalidate: 3600 } // Cache 1 hora
      }
    );

    if (!res.ok) {
      console.error('[SITEMAP] Error obteniendo productos:', res.status);
      return [];
    }

    const productos = await res.json();
    return productos;
  } catch (error) {
    console.error('[SITEMAP] Error:', error.message);
    return [];
  }
}

/**
 * Genera el sitemap dinamico
 * Next.js 14 App Router detecta esta funcion y genera /sitemap.xml
 */
export default async function sitemap() {
  // URLs estaticas publicas
  const staticUrls = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/tienda`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
  ];

  // URLs dinamicas de productos
  const productos = await getProductos();

  const productUrls = productos.map((producto) => ({
    url: `${SITE_URL}/producto/${producto.slug}`,
    lastModified: producto.date_modified
      ? new Date(producto.date_modified)
      : new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  return [...staticUrls, ...productUrls];
}
