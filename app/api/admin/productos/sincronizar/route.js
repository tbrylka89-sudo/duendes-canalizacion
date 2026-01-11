import { kv } from '@vercel/kv';

// ═══════════════════════════════════════════════════════════════
// SINCRONIZAR PRODUCTOS DESDE WOOCOMMERCE
// ═══════════════════════════════════════════════════════════════

export async function POST() {
  try {
    const WOO_URL = process.env.WORDPRESS_URL || process.env.WOO_URL || 'https://duendesuy.10web.cloud';
    const WOO_KEY = process.env.WC_CONSUMER_KEY || process.env.WOO_CONSUMER_KEY;
    const WOO_SECRET = process.env.WC_CONSUMER_SECRET || process.env.WOO_CONSUMER_SECRET;

    if (!WOO_KEY || !WOO_SECRET) {
      return Response.json({
        success: false,
        error: 'Credenciales de WooCommerce no configuradas'
      });
    }

    // Obtener productos existentes para preservar datos locales
    const productosExistentes = await kv.get('productos:catalogo') || [];
    const datosLocalesPorWooId = {};
    productosExistentes.forEach(p => {
      if (p.wooId) {
        datosLocalesPorWooId[p.wooId] = {
          guardian: p.guardian,
          elemento: p.elemento,
          cristales: p.cristales,
          proposito: p.proposito
        };
      }
    });

    // Fetch de WooCommerce
    const auth = Buffer.from(`${WOO_KEY}:${WOO_SECRET}`).toString('base64');

    // Obtener todos los productos (paginado)
    let todosProductos = [];
    let page = 1;
    let hasMore = true;

    while (hasMore) {
      const response = await fetch(
        `${WOO_URL}/wp-json/wc/v3/products?per_page=100&page=${page}`,
        {
          headers: {
            'Authorization': `Basic ${auth}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) {
        throw new Error(`WooCommerce error: ${response.status}`);
      }

      const productos = await response.json();

      if (productos.length === 0) {
        hasMore = false;
      } else {
        todosProductos = [...todosProductos, ...productos];
        page++;

        // Limite de seguridad
        if (page > 10) hasMore = false;
      }
    }

    // Mapear productos de WooCommerce
    const productosWoo = todosProductos.map(p => {
      const datosLocales = datosLocalesPorWooId[p.id] || {};

      return {
        id: `woo_${p.id}`,
        wooId: p.id,
        nombre: p.name,
        precio: parseFloat(p.price) || 0,
        precioRegular: parseFloat(p.regular_price) || 0,
        precioOferta: parseFloat(p.sale_price) || null,
        stock: p.stock_quantity || 0,
        stockStatus: p.stock_status,
        categoria: p.categories?.[0]?.name || 'Sin categoria',
        categorias: p.categories?.map(c => c.name) || [],
        imagen: p.images?.[0]?.src || null,
        imagenes: p.images?.map(i => i.src) || [],
        descripcion: limpiarHtml(p.short_description || ''),
        descripcionCompleta: limpiarHtml(p.description || ''),
        slug: p.slug,
        sku: p.sku,
        wooUrl: p.permalink,
        vendidos: p.total_sales || 0,
        destacado: p.featured || false,
        estado: p.status,
        fechaCreacion: p.date_created,
        // Datos locales preservados o inferidos
        guardian: datosLocales.guardian || extraerGuardian(p.name),
        elemento: datosLocales.elemento || null,
        cristales: datosLocales.cristales || [],
        proposito: datosLocales.proposito || null,
        origen: 'woocommerce',
        sincronizadoEn: new Date().toISOString()
      };
    });

    // Mantener productos locales que no son de WooCommerce
    const productosLocales = productosExistentes.filter(p => p.origen === 'local');

    // Combinar
    const catalogoFinal = [...productosWoo, ...productosLocales];

    // Guardar en KV
    await kv.set('productos:catalogo', catalogoFinal);

    // Guardar registro de sincronizacion
    await kv.set('productos:ultima_sincronizacion', {
      fecha: new Date().toISOString(),
      totalWoo: productosWoo.length,
      totalLocal: productosLocales.length
    });

    return Response.json({
      success: true,
      total: catalogoFinal.length,
      woocommerce: productosWoo.length,
      locales: productosLocales.length,
      sincronizadoEn: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error sincronizando productos:', error);
    return Response.json({
      success: false,
      error: error.message
    });
  }
}

// ═══════════════════════════════════════════════════════════════
// FUNCIONES AUXILIARES
// ═══════════════════════════════════════════════════════════════

function extraerGuardian(nombre) {
  // Intentar extraer nombre del guardian del nombre del producto
  // Patrones comunes: "Finnegan - Guardian de..." o "Guardian Finnegan"
  const match = nombre?.match(/^([A-Za-z]+)\s*[-–]/);
  if (match) return match[1];

  const match2 = nombre?.match(/Guardian\s+([A-Za-z]+)/i);
  if (match2) return match2[1];

  return null;
}

function limpiarHtml(html) {
  if (!html) return '';
  return html
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, ' ')
    .trim();
}
