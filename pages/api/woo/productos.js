// /pages/api/woo/productos.js
// API para traer productos de WooCommerce

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Credenciales WooCommerce
    const WOO_URL = process.env.WORDPRESS_URL || process.env.WOO_URL || 'https://duendesdeluruguay.com';
    const WOO_KEY = process.env.WC_CONSUMER_KEY || process.env.WOO_CONSUMER_KEY;
    const WOO_SECRET = process.env.WC_CONSUMER_SECRET || process.env.WOO_CONSUMER_SECRET;

    if (!WOO_KEY || !WOO_SECRET) {
      // Si no hay credenciales, devolver productos de ejemplo con placeholders
      return res.status(200).json({
        success: true,
        productos: [
          { id: 1001, nombre: 'Finnegan - Guardián de la Abundancia', precio: 89, imagen: 'https://placehold.co/300x300/2d5016/d4af37?text=Finnegan', stock: 1 },
          { id: 1002, nombre: 'Bramble - Protector del Hogar', precio: 75, imagen: 'https://placehold.co/300x300/4a0080/d4af37?text=Bramble', stock: 1 },
          { id: 1003, nombre: 'Thistle - Sanador de Cristal', precio: 95, imagen: 'https://placehold.co/300x300/0d7377/d4af37?text=Thistle', stock: 1 },
          { id: 1004, nombre: 'Clover - Duende de la Suerte', precio: 85, imagen: 'https://placehold.co/300x300/8b4513/d4af37?text=Clover', stock: 1 },
          { id: 1005, nombre: 'Moss - Guardián del Bosque', precio: 110, imagen: 'https://placehold.co/300x300/1a1a2e/d4af37?text=Moss', stock: 1 },
          { id: 1006, nombre: 'Fern - Espíritu del Jardín', precio: 78, imagen: 'https://placehold.co/300x300/228B22/d4af37?text=Fern', stock: 1 },
          { id: 1007, nombre: 'Willow - Guardiana de Sueños', precio: 92, imagen: 'https://placehold.co/300x300/9b59b6/d4af37?text=Willow', stock: 1 },
          { id: 1008, nombre: 'Oak - Protector Ancestral', precio: 125, imagen: 'https://placehold.co/300x300/5D4E37/d4af37?text=Oak', stock: 1 },
        ],
        nota: 'Productos de ejemplo - Conectá WooCommerce para ver los reales'
      });
    }

    // Autenticación básica para WooCommerce API
    const auth = Buffer.from(`${WOO_KEY}:${WOO_SECRET}`).toString('base64');

    // Paginar para obtener TODOS los productos
    let wooProductos = [];
    let page = 1;
    let hayMas = true;

    while (hayMas) {
      const response = await fetch(
        `${WOO_URL}/wp-json/wc/v3/products?status=publish&per_page=100&page=${page}`,
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
        hayMas = false;
      } else {
        wooProductos = wooProductos.concat(productos);
        page++;
        // Seguridad: máximo 10 páginas (1000 productos)
        if (page > 10) hayMas = false;
      }
    }

    // Formatear productos para el frontend
    const productos = wooProductos.map(p => ({
      id: p.id,
      nombre: p.name,
      precio: parseFloat(p.price) || 0,
      imagen: p.images?.[0]?.src || `https://placehold.co/300x300/1a1a1a/d4af37?text=${encodeURIComponent(p.name?.substring(0,10) || 'Duende')}`,
      stock: p.stock_quantity || 1,
      slug: p.slug,
      categoria: p.categories?.[0]?.name || 'Sin categoría'
    }));

    return res.status(200).json({
      success: true,
      productos,
      total: productos.length
    });

  } catch (error) {
    console.error('Error fetching WooCommerce products:', error);
    return res.status(500).json({
      success: false,
      error: error.message,
      productos: []
    });
  }
}
