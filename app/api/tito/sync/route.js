import { kv } from '@vercel/kv';

// ═══════════════════════════════════════════════════════════════
// SINCRONIZACIÓN DE PRODUCTOS PARA TITO
// Se ejecuta automáticamente o manualmente
// ═══════════════════════════════════════════════════════════════

export async function GET(request) {
  try {
    // Verificar credenciales de WooCommerce
    if (!process.env.WC_CONSUMER_KEY || !process.env.WC_CONSUMER_SECRET) {
      return Response.json({ 
        error: 'Faltan credenciales de WooCommerce',
        hint: 'Configurar WC_CONSUMER_KEY y WC_CONSUMER_SECRET en Vercel'
      }, { status: 500 });
    }

    const wpUrl = process.env.WORDPRESS_URL || 'https://duendesuy.10web.cloud';
    const auth = Buffer.from(`${process.env.WC_CONSUMER_KEY}:${process.env.WC_CONSUMER_SECRET}`).toString('base64');
    
    // ═══════════════════════════════════════════════════════════
    // OBTENER PRODUCTOS DE WOOCOMMERCE
    // ═══════════════════════════════════════════════════════════
    
    const response = await fetch(`${wpUrl}/wp-json/wc/v3/products?per_page=100&status=publish`, {
      headers: { 
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error WooCommerce: ${response.status} - ${errorText}`);
    }
    
    const productos = await response.json();
    
    // ═══════════════════════════════════════════════════════════
    // PROCESAR Y SIMPLIFICAR PRODUCTOS
    // ═══════════════════════════════════════════════════════════
    
    const productosSimplificados = productos.map(p => ({
      id: p.id,
      nombre: p.name,
      slug: p.slug,
      precio: p.price,
      precioRegular: p.regular_price,
      stock: p.stock_quantity || (p.stock_status === 'instock' ? 1 : 0),
      disponible: p.stock_status === 'instock',
      
      // Descripción limpia (sin HTML)
      descripcion_corta: p.short_description
        ?.replace(/<[^>]*>/g, '')
        ?.replace(/&nbsp;/g, ' ')
        ?.replace(/\s+/g, ' ')
        ?.trim()
        ?.substring(0, 300) || '',
      
      descripcion: p.description
        ?.replace(/<[^>]*>/g, '')
        ?.replace(/&nbsp;/g, ' ')
        ?.replace(/\s+/g, ' ')
        ?.trim()
        ?.substring(0, 500) || '',
      
      // Categorías
      categorias: p.categories?.map(c => c.name).join(', ') || '',
      categoriaSlugs: p.categories?.map(c => c.slug) || [],
      
      // Atributos (cristales, tamaño, etc.)
      atributos: p.attributes?.reduce((acc, attr) => {
        acc[attr.name.toLowerCase()] = attr.options?.join(', ') || '';
        return acc;
      }, {}) || {},
      
      // Imágenes
      imagen: p.images?.[0]?.src || '',
      imagenes: p.images?.map(img => img.src) || [],
      
      // URL
      url: p.permalink || `${wpUrl}/producto/${p.slug}/`,
      
      // Metadata
      fechaCreacion: p.date_created,
      tipo: p.type
    }));
    
    // ═══════════════════════════════════════════════════════════
    // GUARDAR EN VERCEL KV
    // ═══════════════════════════════════════════════════════════
    
    await kv.set('tito:productos', productosSimplificados);
    await kv.set('tito:last_sync', new Date().toISOString());
    await kv.set('tito:productos_count', productosSimplificados.length);
    
    // Estadísticas
    const disponibles = productosSimplificados.filter(p => p.disponible).length;
    const porCategoria = {};
    
    productosSimplificados.forEach(p => {
      p.categoriaSlugs.forEach(cat => {
        porCategoria[cat] = (porCategoria[cat] || 0) + 1;
      });
    });
    
    await kv.set('tito:stats', {
      total: productosSimplificados.length,
      disponibles,
      porCategoria,
      ultimaSync: new Date().toISOString()
    });
    
    // ═══════════════════════════════════════════════════════════
    // RESPONDER
    // ═══════════════════════════════════════════════════════════
    
    return Response.json({ 
      success: true, 
      message: 'Productos sincronizados correctamente',
      total: productosSimplificados.length, 
      disponibles,
      porCategoria,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Error en sync:', error);
    
    return Response.json({ 
      success: false,
      error: error.message 
    }, { status: 500 });
  }
}

// También permitir POST para llamadas manuales
export async function POST(request) {
  return GET(request);
}
