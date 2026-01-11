import { kv } from '@vercel/kv';

export const dynamic = 'force-dynamic';

// GET - Búsqueda global en clientes, pedidos y productos
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q')?.toLowerCase().trim();

    if (!q || q.length < 2) {
      return Response.json({ success: true, resultados: [] });
    }

    const resultados = [];

    // ═══ BUSCAR CLIENTES ═══
    try {
      const keys = await kv.keys('user:*');
      const elegidoKeys = await kv.keys('elegido:*');
      const allKeys = [...keys, ...elegidoKeys].slice(0, 100); // Limitar

      for (const key of allKeys) {
        const usuario = await kv.get(key);
        if (!usuario) continue;

        const email = usuario.email?.toLowerCase() || '';
        const nombre = usuario.nombre?.toLowerCase() || '';

        if (email.includes(q) || nombre.includes(q)) {
          resultados.push({
            tipo: 'cliente',
            titulo: usuario.nombre || usuario.email,
            subtitulo: `${usuario.email} • ᚱ${usuario.runas || 0} • ☘${usuario.treboles || 0}`,
            url: `/admin/clientes?email=${encodeURIComponent(usuario.email)}`,
            data: usuario
          });
        }

        if (resultados.length >= 5) break; // Máximo 5 clientes
      }
    } catch (e) {
      console.error('Error buscando clientes:', e);
    }

    // ═══ BUSCAR EN CONTENIDO ═══
    try {
      const contenidoKeys = await kv.keys('contenido:*');
      for (const key of contenidoKeys.slice(0, 50)) {
        const contenido = await kv.get(key);
        if (!contenido) continue;

        const titulo = contenido.titulo?.toLowerCase() || '';
        const categoria = contenido.categoria?.toLowerCase() || '';

        if (titulo.includes(q) || categoria.includes(q)) {
          resultados.push({
            tipo: 'contenido',
            titulo: contenido.titulo,
            subtitulo: `${contenido.categoria} • ${contenido.estado || 'borrador'}`,
            url: `/admin/contenido?id=${contenido.id}`,
            data: contenido
          });
        }

        if (resultados.filter(r => r.tipo === 'contenido').length >= 3) break;
      }
    } catch (e) {}

    // ═══ BUSCAR PRODUCTOS (si hay conexión WooCommerce) ═══
    try {
      const productosCache = await kv.get('productos_cache');
      if (productosCache && Array.isArray(productosCache)) {
        for (const producto of productosCache.slice(0, 50)) {
          const nombre = producto.name?.toLowerCase() || '';
          const sku = producto.sku?.toLowerCase() || '';

          if (nombre.includes(q) || sku.includes(q)) {
            resultados.push({
              tipo: 'producto',
              titulo: producto.name,
              subtitulo: `$${producto.price} • Stock: ${producto.stock_quantity || 0}`,
              url: `/admin/productos?id=${producto.id}`,
              data: producto
            });
          }

          if (resultados.filter(r => r.tipo === 'producto').length >= 3) break;
        }
      }
    } catch (e) {}

    // Ordenar: clientes primero, luego contenido, luego productos
    resultados.sort((a, b) => {
      const orden = { cliente: 0, contenido: 1, producto: 2 };
      return (orden[a.tipo] || 3) - (orden[b.tipo] || 3);
    });

    return Response.json({
      success: true,
      resultados: resultados.slice(0, 10), // Máximo 10 resultados
      query: q
    });

  } catch (error) {
    console.error('Error en búsqueda global:', error);
    return Response.json({
      success: false,
      error: error.message,
      resultados: []
    }, { status: 500 });
  }
}
