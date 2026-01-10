// ═══════════════════════════════════════════════════════════════════════════
// 🍀 API TITO + WOOCOMMERCE
// Conecta Tito con el carrito y productos de WooCommerce en tiempo real
// ═══════════════════════════════════════════════════════════════════════════

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function OPTIONS() {
  return new Response(null, { headers: CORS_HEADERS });
}

// ═══════════════════════════════════════════════════════════════
// CONFIGURACIÓN
// ═══════════════════════════════════════════════════════════════

const WP_URL = process.env.WORDPRESS_URL || 'https://duendesuy.10web.cloud';

function getWooAuth() {
  return Buffer.from(`${process.env.WC_CONSUMER_KEY}:${process.env.WC_CONSUMER_SECRET}`).toString('base64');
}

// ═══════════════════════════════════════════════════════════════
// OBTENER PRODUCTOS CON IMÁGENES
// ═══════════════════════════════════════════════════════════════

async function obtenerProductos(params = {}) {
  try {
    const { categoria, busqueda, ids, limite = 12, orden = 'date' } = params;

    let url = `${WP_URL}/wp-json/wc/v3/products?per_page=${limite}&orderby=${orden}&status=publish`;

    if (categoria) {
      // Primero buscar categoría por slug o nombre
      const catRes = await fetch(
        `${WP_URL}/wp-json/wc/v3/products/categories?search=${encodeURIComponent(categoria)}`,
        { headers: { 'Authorization': `Basic ${getWooAuth()}` } }
      );
      const cats = await catRes.json();
      if (cats.length > 0) {
        url += `&category=${cats[0].id}`;
      }
    }

    if (busqueda) {
      url += `&search=${encodeURIComponent(busqueda)}`;
    }

    if (ids && ids.length > 0) {
      url += `&include=${ids.join(',')}`;
    }

    const response = await fetch(url, {
      headers: { 'Authorization': `Basic ${getWooAuth()}` }
    });

    if (!response.ok) {
      console.error('Error WooCommerce:', response.status);
      return [];
    }

    const productos = await response.json();

    return productos.map(p => ({
      id: p.id,
      nombre: p.name,
      precio: p.price,
      precioRegular: p.regular_price,
      precioOferta: p.sale_price,
      moneda: 'USD',
      imagen: p.images?.[0]?.src || null,
      imagenes: p.images?.slice(0, 4).map(i => i.src) || [],
      url: p.permalink,
      descripcionCorta: p.short_description?.replace(/<[^>]*>/g, '').substring(0, 150),
      categorias: p.categories?.map(c => c.name).join(', '),
      enStock: p.stock_status === 'instock',
      atributos: p.attributes?.map(a => `${a.name}: ${a.options.join(', ')}`).join(' | '),
      etiquetas: p.tags?.map(t => t.name) || []
    }));

  } catch (error) {
    console.error('Error obteniendo productos:', error);
    return [];
  }
}

// ═══════════════════════════════════════════════════════════════
// OBTENER PRODUCTO INDIVIDUAL
// ═══════════════════════════════════════════════════════════════

async function obtenerProducto(productId) {
  try {
    const response = await fetch(
      `${WP_URL}/wp-json/wc/v3/products/${productId}`,
      { headers: { 'Authorization': `Basic ${getWooAuth()}` } }
    );

    if (!response.ok) return null;

    const p = await response.json();

    return {
      id: p.id,
      nombre: p.name,
      precio: p.price,
      precioRegular: p.regular_price,
      precioOferta: p.sale_price,
      moneda: 'USD',
      imagen: p.images?.[0]?.src || null,
      imagenes: p.images?.map(i => i.src) || [],
      url: p.permalink,
      descripcion: p.description?.replace(/<[^>]*>/g, ''),
      descripcionCorta: p.short_description?.replace(/<[^>]*>/g, ''),
      categorias: p.categories?.map(c => c.name).join(', '),
      enStock: p.stock_status === 'instock',
      peso: p.weight,
      dimensiones: p.dimensions,
      atributos: p.attributes || [],
      relacionados: p.related_ids?.slice(0, 4) || []
    };

  } catch (error) {
    console.error('Error obteniendo producto:', error);
    return null;
  }
}

// ═══════════════════════════════════════════════════════════════
// OBTENER CATEGORÍAS
// ═══════════════════════════════════════════════════════════════

async function obtenerCategorias() {
  try {
    const response = await fetch(
      `${WP_URL}/wp-json/wc/v3/products/categories?per_page=50&hide_empty=true`,
      { headers: { 'Authorization': `Basic ${getWooAuth()}` } }
    );

    if (!response.ok) return [];

    const cats = await response.json();

    return cats.map(c => ({
      id: c.id,
      nombre: c.name,
      slug: c.slug,
      descripcion: c.description,
      imagen: c.image?.src || null,
      cantidad: c.count
    }));

  } catch (error) {
    console.error('Error obteniendo categorías:', error);
    return [];
  }
}

// ═══════════════════════════════════════════════════════════════
// BUSCAR PRODUCTOS RELACIONADOS (para recomendaciones)
// ═══════════════════════════════════════════════════════════════

async function obtenerRecomendaciones(params = {}) {
  const { intencion, presupuesto, tamano } = params;

  let busqueda = '';
  let categoria = '';

  // Mapear intención a categoría
  const mapeoIntenciones = {
    'proteccion': 'proteccion',
    'protección': 'proteccion',
    'abundancia': 'abundancia',
    'prosperidad': 'abundancia',
    'dinero': 'abundancia',
    'amor': 'amor',
    'relaciones': 'amor',
    'sanacion': 'sanacion',
    'sanación': 'sanacion',
    'salud': 'sanacion'
  };

  if (intencion) {
    const intencionLower = intencion.toLowerCase();
    for (const [key, value] of Object.entries(mapeoIntenciones)) {
      if (intencionLower.includes(key)) {
        categoria = value;
        break;
      }
    }
  }

  // Mapear tamaño a búsqueda
  if (tamano) {
    const tamanoLower = tamano.toLowerCase();
    if (tamanoLower.includes('pequeño') || tamanoLower.includes('mini')) {
      busqueda = 'mini';
    } else if (tamanoLower.includes('grande') || tamanoLower.includes('gigante')) {
      busqueda = 'grande';
    }
  }

  let productos = await obtenerProductos({ categoria, busqueda, limite: 8 });

  // Filtrar por presupuesto si se especifica
  if (presupuesto) {
    const maxPrecio = parseFloat(presupuesto);
    if (!isNaN(maxPrecio)) {
      productos = productos.filter(p => parseFloat(p.precio) <= maxPrecio);
    }
  }

  return productos.slice(0, 5);
}

// ═══════════════════════════════════════════════════════════════
// OBTENER INFO DE CARRITO ABANDONADO
// ═══════════════════════════════════════════════════════════════

async function analizarCarritoAbandonado(productIds) {
  if (!productIds || productIds.length === 0) return null;

  const productos = await obtenerProductos({ ids: productIds });

  const total = productos.reduce((sum, p) => sum + parseFloat(p.precio || 0), 0);

  return {
    productos,
    total,
    totalItems: productos.length,
    mensaje: productos.length === 1
      ? `Veo que tenés a "${productos[0].nombre}" esperándote...`
      : `Tenés ${productos.length} guardianes esperándote en tu carrito...`,
    urgencia: total > 200
      ? 'Con el 30% ($' + Math.round(total * 0.3) + ') podés reservarlos por 30 días.'
      : '¡Son piezas únicas! Si alguien más los adopta, desaparecen para siempre.'
  };
}

// ═══════════════════════════════════════════════════════════════
// HANDLER PRINCIPAL
// ═══════════════════════════════════════════════════════════════

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const accion = searchParams.get('accion');

  try {
    let resultado;

    switch (accion) {
      case 'productos':
        resultado = await obtenerProductos({
          categoria: searchParams.get('categoria'),
          busqueda: searchParams.get('busqueda'),
          ids: searchParams.get('ids')?.split(',').map(Number).filter(n => !isNaN(n)),
          limite: parseInt(searchParams.get('limite')) || 12
        });
        break;

      case 'producto':
        resultado = await obtenerProducto(searchParams.get('id'));
        break;

      case 'categorias':
        resultado = await obtenerCategorias();
        break;

      case 'recomendaciones':
        resultado = await obtenerRecomendaciones({
          intencion: searchParams.get('intencion'),
          presupuesto: searchParams.get('presupuesto'),
          tamano: searchParams.get('tamano')
        });
        break;

      case 'carrito':
        const ids = searchParams.get('ids')?.split(',').map(Number).filter(n => !isNaN(n));
        resultado = await analizarCarritoAbandonado(ids);
        break;

      default:
        resultado = { error: 'Acción no válida. Usa: productos, producto, categorias, recomendaciones, carrito' };
    }

    return Response.json({
      success: true,
      data: resultado
    }, { headers: CORS_HEADERS });

  } catch (error) {
    console.error('Error API Tito/WOO:', error);
    return Response.json({
      success: false,
      error: error.message
    }, { status: 500, headers: CORS_HEADERS });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { accion } = body;

    let resultado;

    switch (accion) {
      case 'recomendaciones':
        resultado = await obtenerRecomendaciones(body);
        break;

      case 'carrito':
        resultado = await analizarCarritoAbandonado(body.productIds);
        break;

      case 'buscar':
        resultado = await obtenerProductos({
          busqueda: body.query,
          categoria: body.categoria,
          limite: body.limite || 8
        });
        break;

      default:
        resultado = { error: 'Acción no válida' };
    }

    return Response.json({
      success: true,
      data: resultado
    }, { headers: CORS_HEADERS });

  } catch (error) {
    console.error('Error API Tito/WOO POST:', error);
    return Response.json({
      success: false,
      error: error.message
    }, { status: 500, headers: CORS_HEADERS });
  }
}
