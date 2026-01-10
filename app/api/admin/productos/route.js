import { kv } from '@vercel/kv';

// ═══════════════════════════════════════════════════════════════
// API DE PRODUCTOS INTELIGENTE
// ═══════════════════════════════════════════════════════════════

// GET - Obtener todos los productos con estadisticas
export async function GET() {
  try {
    // Obtener productos almacenados en KV
    let productos = await kv.get('productos:catalogo') || [];

    // Si no hay productos en KV, intentar cargar de WooCommerce
    if (productos.length === 0) {
      productos = await fetchWooProducts();
      if (productos.length > 0) {
        await kv.set('productos:catalogo', productos);
      }
    }

    // Calcular estadisticas
    const estadisticas = calcularEstadisticas(productos);

    return Response.json({
      success: true,
      productos,
      estadisticas,
      total: productos.length
    });

  } catch (error) {
    console.error('Error obteniendo productos:', error);
    return Response.json({
      success: false,
      error: error.message,
      productos: [],
      estadisticas: null
    });
  }
}

// PUT - Actualizar un producto
export async function PUT(request) {
  try {
    const producto = await request.json();

    if (!producto.id) {
      return Response.json({ success: false, error: 'ID de producto requerido' });
    }

    // Obtener catalogo actual
    let productos = await kv.get('productos:catalogo') || [];

    // Encontrar y actualizar producto
    const index = productos.findIndex(p => p.id === producto.id);
    if (index === -1) {
      return Response.json({ success: false, error: 'Producto no encontrado' });
    }

    // Actualizar producto manteniendo datos de WooCommerce
    productos[index] = {
      ...productos[index],
      ...producto,
      actualizadoEn: new Date().toISOString()
    };

    // Guardar
    await kv.set('productos:catalogo', productos);

    // Si tiene wooId, intentar actualizar en WooCommerce tambien
    if (producto.wooId && process.env.WOO_CONSUMER_KEY) {
      await actualizarEnWoo(producto);
    }

    return Response.json({
      success: true,
      producto: productos[index]
    });

  } catch (error) {
    console.error('Error actualizando producto:', error);
    return Response.json({ success: false, error: error.message });
  }
}

// POST - Crear nuevo producto (local)
export async function POST(request) {
  try {
    const nuevoProducto = await request.json();

    // Validar campos requeridos
    if (!nuevoProducto.nombre) {
      return Response.json({ success: false, error: 'Nombre requerido' });
    }

    // Obtener catalogo actual
    let productos = await kv.get('productos:catalogo') || [];

    // Generar ID unico
    const id = `local_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const producto = {
      id,
      nombre: nuevoProducto.nombre,
      precio: nuevoProducto.precio || 0,
      stock: nuevoProducto.stock || 0,
      categoria: nuevoProducto.categoria || 'Sin categoria',
      imagen: nuevoProducto.imagen || null,
      descripcion: nuevoProducto.descripcion || '',
      guardian: nuevoProducto.guardian || null,
      elemento: nuevoProducto.elemento || null,
      cristales: nuevoProducto.cristales || [],
      proposito: nuevoProducto.proposito || null,
      destacado: nuevoProducto.destacado || false,
      vendidos: 0,
      creadoEn: new Date().toISOString(),
      origen: 'local'
    };

    productos.push(producto);
    await kv.set('productos:catalogo', productos);

    return Response.json({
      success: true,
      producto
    });

  } catch (error) {
    console.error('Error creando producto:', error);
    return Response.json({ success: false, error: error.message });
  }
}

// ═══════════════════════════════════════════════════════════════
// FUNCIONES AUXILIARES
// ═══════════════════════════════════════════════════════════════

async function fetchWooProducts() {
  const WOO_URL = process.env.WOO_URL || 'https://duendesuy.10web.cloud';
  const WOO_KEY = process.env.WOO_CONSUMER_KEY;
  const WOO_SECRET = process.env.WOO_CONSUMER_SECRET;

  if (!WOO_KEY || !WOO_SECRET) {
    // Productos de ejemplo si no hay WooCommerce
    return [
      {
        id: 'demo_1',
        wooId: null,
        nombre: 'Finnegan - Guardian de la Abundancia',
        precio: 89,
        stock: 1,
        categoria: 'Guardianes',
        imagen: 'https://placehold.co/300x300/2d5016/d4af37?text=Finnegan',
        descripcion: 'Un poderoso guardian conectado con la energia de la abundancia y la prosperidad.',
        guardian: 'Finnegan',
        elemento: 'tierra',
        cristales: ['pirita', 'citrino'],
        proposito: 'abundancia',
        destacado: true,
        vendidos: 12,
        origen: 'demo'
      },
      {
        id: 'demo_2',
        wooId: null,
        nombre: 'Bramble - Protector del Hogar',
        precio: 75,
        stock: 1,
        categoria: 'Guardianes',
        imagen: 'https://placehold.co/300x300/4a0080/d4af37?text=Bramble',
        descripcion: 'Guardian especializado en proteger el hogar y mantener la armonia familiar.',
        guardian: 'Bramble',
        elemento: 'tierra',
        cristales: ['turmalina_negra', 'obsidiana'],
        proposito: 'proteccion',
        destacado: false,
        vendidos: 8,
        origen: 'demo'
      },
      {
        id: 'demo_3',
        wooId: null,
        nombre: 'Willow - Guardiana de Suenos',
        precio: 92,
        stock: 2,
        categoria: 'Guardianes',
        imagen: 'https://placehold.co/300x300/9b59b6/d4af37?text=Willow',
        descripcion: 'Compania perfecta para meditacion, suenos lucidos y conexion espiritual.',
        guardian: 'Willow',
        elemento: 'agua',
        cristales: ['amatista', 'labradorita', 'selenita'],
        proposito: 'intuicion',
        destacado: true,
        vendidos: 15,
        origen: 'demo'
      },
      {
        id: 'demo_4',
        wooId: null,
        nombre: 'Oak - Protector Ancestral',
        precio: 125,
        stock: 1,
        categoria: 'Guardianes Premium',
        imagen: 'https://placehold.co/300x300/5D4E37/d4af37?text=Oak',
        descripcion: 'El mas antiguo de los guardianes, conectado con la sabiduria ancestral.',
        guardian: 'Oak',
        elemento: 'tierra',
        cristales: ['cuarzo_ahumado', 'jaspe'],
        proposito: 'equilibrio',
        destacado: true,
        vendidos: 5,
        origen: 'demo'
      },
      {
        id: 'demo_5',
        wooId: null,
        nombre: 'Sage - Sanador de Cristal',
        precio: 95,
        stock: 0,
        categoria: 'Guardianes',
        imagen: 'https://placehold.co/300x300/0d7377/d4af37?text=Sage',
        descripcion: 'Especialista en sanacion energetica y limpieza de chakras.',
        guardian: 'Sage',
        elemento: 'eter',
        cristales: ['cuarzo_transparente', 'turquesa'],
        proposito: 'sanacion',
        destacado: false,
        vendidos: 10,
        origen: 'demo'
      }
    ];
  }

  try {
    const auth = Buffer.from(`${WOO_KEY}:${WOO_SECRET}`).toString('base64');
    const response = await fetch(
      `${WOO_URL}/wp-json/wc/v3/products?per_page=100`,
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

    const wooProductos = await response.json();

    return wooProductos.map(p => ({
      id: `woo_${p.id}`,
      wooId: p.id,
      nombre: p.name,
      precio: parseFloat(p.price) || 0,
      stock: p.stock_quantity || 0,
      categoria: p.categories?.[0]?.name || 'Sin categoria',
      imagen: p.images?.[0]?.src || null,
      descripcion: p.short_description || p.description || '',
      slug: p.slug,
      wooUrl: p.permalink,
      vendidos: p.total_sales || 0,
      destacado: p.featured || false,
      guardian: extraerGuardian(p.name),
      elemento: null,
      cristales: [],
      proposito: null,
      origen: 'woocommerce',
      sincronizadoEn: new Date().toISOString()
    }));

  } catch (error) {
    console.error('Error fetching WooCommerce:', error);
    return [];
  }
}

async function actualizarEnWoo(producto) {
  const WOO_URL = process.env.WOO_URL || 'https://duendesuy.10web.cloud';
  const WOO_KEY = process.env.WOO_CONSUMER_KEY;
  const WOO_SECRET = process.env.WOO_CONSUMER_SECRET;

  if (!WOO_KEY || !WOO_SECRET || !producto.wooId) return;

  try {
    const auth = Buffer.from(`${WOO_KEY}:${WOO_SECRET}`).toString('base64');
    await fetch(
      `${WOO_URL}/wp-json/wc/v3/products/${producto.wooId}`,
      {
        method: 'PUT',
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: producto.nombre,
          regular_price: String(producto.precio),
          stock_quantity: producto.stock,
          description: producto.descripcion
        })
      }
    );
  } catch (error) {
    console.error('Error actualizando en WooCommerce:', error);
  }
}

function extraerGuardian(nombre) {
  // Intentar extraer nombre del guardian del nombre del producto
  const match = nombre?.match(/^([A-Za-z]+)\s*[-–]/);
  return match ? match[1] : null;
}

function calcularEstadisticas(productos) {
  const total = productos.length;
  const enStock = productos.filter(p => p.stock > 0).length;
  const sinStock = productos.filter(p => p.stock <= 0).length;
  const valorInventario = productos.reduce((acc, p) => acc + (p.precio * p.stock), 0);

  // Mas vendido
  const ordenadoPorVentas = [...productos].sort((a, b) => (b.vendidos || 0) - (a.vendidos || 0));
  const masVendido = ordenadoPorVentas[0]?.guardian || ordenadoPorVentas[0]?.nombre?.split(' ')[0] || '-';

  return {
    total,
    enStock,
    sinStock,
    valorInventario: Math.round(valorInventario),
    masVendido
  };
}
