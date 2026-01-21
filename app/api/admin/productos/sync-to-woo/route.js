import { kv } from '@vercel/kv';

export const dynamic = 'force-dynamic';

// ═══════════════════════════════════════════════════════════════
// SINCRONIZACIÓN VERCEL → WOOCOMMERCE
// Actualiza productos en WooCommerce con datos enriquecidos
// ═══════════════════════════════════════════════════════════════

const WP_URL = process.env.WORDPRESS_URL || 'https://duendesdeluruguay.com';

function getWooAuth() {
  return Buffer.from(`${process.env.WC_CONSUMER_KEY}:${process.env.WC_CONSUMER_SECRET}`).toString('base64');
}

// Obtener lista de productos de WooCommerce
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const categoria = searchParams.get('categoria');
  const busqueda = searchParams.get('busqueda');
  const limite = parseInt(searchParams.get('limite')) || 50;

  try {
    let url = `${WP_URL}/wp-json/wc/v3/products?per_page=${limite}&status=publish&orderby=date&order=desc`;

    if (busqueda) {
      url += `&search=${encodeURIComponent(busqueda)}`;
    }

    const response = await fetch(url, {
      headers: { 'Authorization': `Basic ${getWooAuth()}` }
    });

    if (!response.ok) {
      throw new Error(`Error WooCommerce: ${response.status}`);
    }

    const productos = await response.json();

    // Enriquecer con datos de KV
    const productosEnriquecidos = await Promise.all(
      productos.map(async (p) => {
        const datosKV = await kv.get(`producto:${p.id}`);

        return {
          id: p.id,
          nombre: p.name,
          slug: p.slug,
          precio: p.price,
          precioRegular: p.regular_price,
          imagen: p.images?.[0]?.src,
          imagenes: p.images?.map(i => i.src),
          categorias: p.categories?.map(c => ({ id: c.id, nombre: c.name })),
          enStock: p.stock_status === 'instock',
          url: p.permalink,
          // Datos enriquecidos de Vercel KV
          tieneHistoria: !!datosKV?.historia,
          tieneNeuro: !!datosKV?.neuromarketing,
          datosEnriquecidos: datosKV || null
        };
      })
    );

    return Response.json({
      success: true,
      total: productosEnriquecidos.length,
      productos: productosEnriquecidos
    });

  } catch (error) {
    console.error('Error obteniendo productos:', error);
    return Response.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}

// Sincronizar producto a WooCommerce
export async function POST(request) {
  try {
    const { productId, datos } = await request.json();

    if (!productId) {
      return Response.json({ success: false, error: 'productId requerido' }, { status: 400 });
    }

    // 1. Guardar datos enriquecidos en KV
    if (datos) {
      await kv.set(`producto:${productId}`, {
        ...datos,
        actualizadoEn: new Date().toISOString()
      });

      if (datos.historia) {
        await kv.set(`producto:${productId}:historia`, datos.historia);
      }
      if (datos.neuromarketing) {
        await kv.set(`producto:${productId}:neuro`, datos.neuromarketing);
      }
    }

    // 2. Actualizar producto en WooCommerce (descripción con historia)
    const datosWoo = {};

    // Construir descripción rica si hay historia
    if (datos?.historia) {
      const h = datos.historia;
      datosWoo.description = `
<div class="historia-guardian">
  <h2>🔮 La Historia de Este Guardián</h2>
  <p>${h.origen || ''}</p>

  <h3>✨ Personalidad</h3>
  <p>${h.personalidad || ''}</p>

  <h3>💫 Sus Fortalezas</h3>
  <ul>
    ${(h.fortalezas || []).map(f => `<li>${f}</li>`).join('\n    ')}
  </ul>

  <h3>🌿 Congenia especialmente con</h3>
  <p>${(h.afinidades || []).join(', ')}</p>

  <blockquote class="mensaje-poder">
    "${h.mensajePoder || ''}"
  </blockquote>

  <h3>📜 Ritual de Bienvenida</h3>
  <p>${h.ritual || ''}</p>

  <h3>🛡️ Cuidados Especiales</h3>
  <p>${h.cuidados || ''}</p>
</div>
      `.trim();
    }

    // Actualizar meta campos personalizados
    datosWoo.meta_data = [
      { key: '_tiene_historia_vercel', value: datos?.historia ? 'yes' : 'no' },
      { key: '_historia_guardian', value: JSON.stringify(datos?.historia || {}) },
      { key: '_neuro_guardian', value: JSON.stringify(datos?.neuromarketing || {}) },
      { key: '_sync_vercel', value: new Date().toISOString() }
    ];

    // Hacer PUT a WooCommerce
    const response = await fetch(`${WP_URL}/wp-json/wc/v3/products/${productId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Basic ${getWooAuth()}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(datosWoo)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error actualizando WOO:', errorText);
      throw new Error(`Error WooCommerce: ${response.status}`);
    }

    const productoActualizado = await response.json();

    return Response.json({
      success: true,
      mensaje: 'Producto sincronizado correctamente',
      producto: {
        id: productoActualizado.id,
        nombre: productoActualizado.name,
        url: productoActualizado.permalink
      }
    });

  } catch (error) {
    console.error('Error sincronizando:', error);
    return Response.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}

// Eliminar datos enriquecidos
export async function DELETE(request) {
  const { searchParams } = new URL(request.url);
  const productId = searchParams.get('id');

  if (!productId) {
    return Response.json({ success: false, error: 'id requerido' }, { status: 400 });
  }

  try {
    await kv.del(`producto:${productId}`);
    await kv.del(`producto:${productId}:historia`);
    await kv.del(`producto:${productId}:neuro`);

    return Response.json({
      success: true,
      mensaje: 'Datos enriquecidos eliminados'
    });
  } catch (error) {
    return Response.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
