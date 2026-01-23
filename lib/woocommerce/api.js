// ═══════════════════════════════════════════════════════════════════════════════
// WOOCOMMERCE API HELPER
// Funciones para fetch de productos desde WooCommerce REST API
// ═══════════════════════════════════════════════════════════════════════════════

const WOO_URL = process.env.WORDPRESS_URL || 'https://duendesdeluruguay.com';
const WOO_KEY = process.env.WC_CONSUMER_KEY;
const WOO_SECRET = process.env.WC_CONSUMER_SECRET;

/**
 * Genera header de autenticacion Basic para WooCommerce API
 */
function getAuthHeader() {
  if (!WOO_KEY || !WOO_SECRET) {
    throw new Error('Credenciales de WooCommerce no configuradas');
  }
  const auth = Buffer.from(`${WOO_KEY}:${WOO_SECRET}`).toString('base64');
  return `Basic ${auth}`;
}

/**
 * Obtiene un producto por su slug
 * @param {string} slug - Slug del producto
 * @returns {Object|null} Producto o null si no existe
 */
export async function getProductBySlug(slug) {
  try {
    const res = await fetch(
      `${WOO_URL}/wp-json/wc/v3/products?slug=${encodeURIComponent(slug)}`,
      {
        headers: {
          'Authorization': getAuthHeader(),
          'Content-Type': 'application/json'
        },
        next: { revalidate: 300 } // Cache 5 minutos
      }
    );

    if (!res.ok) {
      console.error('[WOO] Error fetching product by slug:', res.status);
      return null;
    }

    const productos = await res.json();
    return productos.length > 0 ? productos[0] : null;
  } catch (error) {
    console.error('[WOO] Error in getProductBySlug:', error);
    return null;
  }
}

/**
 * Obtiene un producto por su ID
 * @param {number|string} id - ID del producto
 * @returns {Object|null} Producto o null si no existe
 */
export async function getProductById(id) {
  try {
    const res = await fetch(
      `${WOO_URL}/wp-json/wc/v3/products/${id}`,
      {
        headers: {
          'Authorization': getAuthHeader(),
          'Content-Type': 'application/json'
        },
        next: { revalidate: 300 }
      }
    );

    if (!res.ok) {
      console.error('[WOO] Error fetching product by ID:', res.status);
      return null;
    }

    return await res.json();
  } catch (error) {
    console.error('[WOO] Error in getProductById:', error);
    return null;
  }
}

/**
 * Obtiene productos populares (mas vendidos o destacados)
 * @param {number} limit - Cantidad de productos a obtener
 * @returns {Array} Lista de productos
 */
export async function getPopularProducts(limit = 20) {
  try {
    const res = await fetch(
      `${WOO_URL}/wp-json/wc/v3/products?per_page=${limit}&status=publish&orderby=popularity&order=desc`,
      {
        headers: {
          'Authorization': getAuthHeader(),
          'Content-Type': 'application/json'
        },
        next: { revalidate: 600 } // Cache 10 minutos
      }
    );

    if (!res.ok) {
      console.error('[WOO] Error fetching popular products:', res.status);
      return [];
    }

    return await res.json();
  } catch (error) {
    console.error('[WOO] Error in getPopularProducts:', error);
    return [];
  }
}

/**
 * Obtiene todos los productos publicados (para sitemap/static paths)
 * @param {number} limit - Cantidad maxima
 * @returns {Array} Lista de productos con slug
 */
export async function getAllProductSlugs(limit = 100) {
  try {
    const res = await fetch(
      `${WOO_URL}/wp-json/wc/v3/products?per_page=${limit}&status=publish&_fields=id,slug`,
      {
        headers: {
          'Authorization': getAuthHeader(),
          'Content-Type': 'application/json'
        },
        next: { revalidate: 3600 } // Cache 1 hora
      }
    );

    if (!res.ok) {
      console.error('[WOO] Error fetching product slugs:', res.status);
      return [];
    }

    return await res.json();
  } catch (error) {
    console.error('[WOO] Error in getAllProductSlugs:', error);
    return [];
  }
}

/**
 * Obtiene productos relacionados por IDs
 * @param {Array} ids - Array de IDs de productos
 * @param {number} limit - Cantidad maxima
 * @returns {Array} Lista de productos relacionados
 */
export async function getRelatedProducts(ids, limit = 4) {
  if (!ids || ids.length === 0) return [];

  try {
    const idsToFetch = ids.slice(0, limit);
    const res = await fetch(
      `${WOO_URL}/wp-json/wc/v3/products?include=${idsToFetch.join(',')}`,
      {
        headers: {
          'Authorization': getAuthHeader(),
          'Content-Type': 'application/json'
        },
        next: { revalidate: 300 }
      }
    );

    if (!res.ok) {
      console.error('[WOO] Error fetching related products:', res.status);
      return [];
    }

    return await res.json();
  } catch (error) {
    console.error('[WOO] Error in getRelatedProducts:', error);
    return [];
  }
}

/**
 * Formatea un producto para uso en el frontend
 * @param {Object} producto - Producto raw de WooCommerce
 * @returns {Object} Producto formateado
 */
export function formatProduct(producto) {
  if (!producto) return null;

  // Limpiar descripcion de HTML
  const cleanDescription = (html) => {
    if (!html) return '';
    return html
      .replace(/<[^>]*>/g, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&quot;/g, '"')
      .replace(/&#039;/g, "'")
      .trim();
  };

  return {
    id: producto.id,
    name: producto.name,
    slug: producto.slug,
    permalink: producto.permalink,
    price: producto.price,
    regularPrice: producto.regular_price,
    salePrice: producto.sale_price,
    onSale: producto.on_sale,
    description: cleanDescription(producto.description),
    shortDescription: cleanDescription(producto.short_description),
    images: producto.images?.map(img => ({
      id: img.id,
      src: img.src,
      alt: img.alt || producto.name
    })) || [],
    categories: producto.categories?.map(cat => ({
      id: cat.id,
      name: cat.name,
      slug: cat.slug
    })) || [],
    tags: producto.tags?.map(tag => ({
      id: tag.id,
      name: tag.name,
      slug: tag.slug
    })) || [],
    attributes: producto.attributes || [],
    stockStatus: producto.stock_status,
    stockQuantity: producto.stock_quantity,
    averageRating: producto.average_rating,
    ratingCount: producto.rating_count,
    relatedIds: producto.related_ids || [],
    sku: producto.sku
  };
}

export default {
  getProductBySlug,
  getProductById,
  getPopularProducts,
  getAllProductSlugs,
  getRelatedProducts,
  formatProduct
};
