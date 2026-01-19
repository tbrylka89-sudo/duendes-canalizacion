import { kv } from '@vercel/kv';

// ═══════════════════════════════════════════════════════════════════════════════
// API: WORDPRESS MEDIA LIBRARY
// Acceso completo a la biblioteca de medios de WordPress
// ═══════════════════════════════════════════════════════════════════════════════

export const dynamic = 'force-dynamic';

const WP_URL = process.env.WORDPRESS_URL || 'https://duendesuy.10web.cloud';
const WP_USER = process.env.WP_USER || 'admin';
const WP_APP_PASSWORD = process.env.WP_APP_PASSWORD;

function getAuth() {
  if (WP_APP_PASSWORD) {
    return Buffer.from(`${WP_USER}:${WP_APP_PASSWORD}`).toString('base64');
  }
  // Fallback a WooCommerce credentials
  const WOO_KEY = process.env.WC_CONSUMER_KEY;
  const WOO_SECRET = process.env.WC_CONSUMER_SECRET;
  if (WOO_KEY && WOO_SECRET) {
    return Buffer.from(`${WOO_KEY}:${WOO_SECRET}`).toString('base64');
  }
  return null;
}

// GET - Obtener medios de WordPress
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const tipo = searchParams.get('tipo') || 'image';
  const pagina = parseInt(searchParams.get('pagina')) || 1;
  const porPagina = parseInt(searchParams.get('por_pagina')) || 50;
  const buscar = searchParams.get('buscar');

  const auth = getAuth();
  if (!auth) {
    return Response.json({
      success: false,
      error: 'Credenciales de WordPress no configuradas',
      ayuda: 'Configura WP_USER y WP_APP_PASSWORD, o usa las credenciales de WooCommerce'
    }, { status: 400 });
  }

  try {
    let url = `${WP_URL}/wp-json/wp/v2/media?per_page=${porPagina}&page=${pagina}`;

    if (tipo && tipo !== 'todos') {
      url += `&media_type=${tipo}`;
    }
    if (buscar) {
      url += `&search=${encodeURIComponent(buscar)}`;
    }

    const res = await fetch(url, {
      headers: { 'Authorization': `Basic ${auth}` }
    });

    if (!res.ok) {
      throw new Error(`WordPress respondió ${res.status}`);
    }

    const medios = await res.json();
    const total = res.headers.get('X-WP-Total');
    const totalPaginas = res.headers.get('X-WP-TotalPages');

    return Response.json({
      success: true,
      medios: medios.map(m => ({
        id: m.id,
        titulo: m.title?.rendered || '',
        alt: m.alt_text || '',
        url: m.source_url,
        tipo: m.media_type,
        mime: m.mime_type,
        tamaños: m.media_details?.sizes ? Object.entries(m.media_details.sizes).map(([key, val]) => ({
          nombre: key,
          url: val.source_url,
          ancho: val.width,
          alto: val.height
        })) : [],
        fecha: m.date,
        ancho: m.media_details?.width,
        alto: m.media_details?.height
      })),
      paginacion: {
        total: parseInt(total) || medios.length,
        totalPaginas: parseInt(totalPaginas) || 1,
        paginaActual: pagina
      }
    });

  } catch (error) {
    console.error('[WP-MEDIA] Error:', error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST - Subir archivo a WordPress
export async function POST(request) {
  const auth = getAuth();
  if (!auth) {
    return Response.json({
      success: false,
      error: 'Credenciales de WordPress no configuradas'
    }, { status: 400 });
  }

  try {
    const formData = await request.formData();
    const archivo = formData.get('archivo');
    const titulo = formData.get('titulo') || archivo?.name || 'Archivo sin nombre';
    const alt = formData.get('alt') || titulo;

    if (!archivo) {
      return Response.json({ success: false, error: 'No se recibió archivo' }, { status: 400 });
    }

    // Crear FormData para WordPress
    const wpFormData = new FormData();
    wpFormData.append('file', archivo);
    wpFormData.append('title', titulo);
    wpFormData.append('alt_text', alt);

    const res = await fetch(`${WP_URL}/wp-json/wp/v2/media`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Disposition': `attachment; filename="${archivo.name}"`
      },
      body: wpFormData
    });

    if (!res.ok) {
      const error = await res.text();
      throw new Error(`Error subiendo: ${res.status} - ${error}`);
    }

    const medio = await res.json();

    // Guardar referencia en KV
    const subidas = await kv.get('admin:media:subidas') || [];
    subidas.unshift({
      id: medio.id,
      url: medio.source_url,
      titulo,
      fecha: new Date().toISOString()
    });
    await kv.set('admin:media:subidas', subidas.slice(0, 100));

    return Response.json({
      success: true,
      medio: {
        id: medio.id,
        url: medio.source_url,
        titulo: medio.title?.rendered,
        tamaños: medio.media_details?.sizes ? Object.entries(medio.media_details.sizes).map(([key, val]) => ({
          nombre: key,
          url: val.source_url
        })) : []
      }
    });

  } catch (error) {
    console.error('[WP-MEDIA] Error POST:', error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
