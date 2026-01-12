import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// ═══════════════════════════════════════════════════════════════
// API DE CONTROL REMOTO DE WORDPRESS
// Gestiona snippets WPCode, caché, y más desde Vercel
// ═══════════════════════════════════════════════════════════════

const WP_URL = process.env.WORDPRESS_URL || 'https://duendesuy.10web.cloud';
const WP_SECRET = process.env.WP_REMOTE_SECRET || 'duendes_vercel_2026_secretkey_XkJ9mN2pL5qR8sT1';

// Headers para autenticación con WordPress
function getHeaders() {
  return {
    'X-Duendes-Secret': WP_SECRET,
    'Content-Type': 'application/json'
  };
}

// GET - Obtener estado, snippets, o info
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action') || 'status';
  const id = searchParams.get('id');

  try {
    let endpoint = '';
    let params = '';

    switch (action) {
      case 'status':
        endpoint = '/wp-json/duendes/v1/status';
        break;
      case 'snippets':
        endpoint = '/wp-json/duendes/v1/snippets';
        params = '?action=list';
        break;
      case 'snippet':
        if (!id) {
          return NextResponse.json({ success: false, error: 'ID requerido' }, { status: 400 });
        }
        endpoint = '/wp-json/duendes/v1/snippets';
        params = `?action=get&id=${id}`;
        break;
      case 'plugins':
        endpoint = '/wp-json/duendes/v1/control';
        params = '?action=plugins';
        break;
      case 'info':
        endpoint = '/wp-json/duendes/v1/control';
        params = '?action=info';
        break;
      default:
        return NextResponse.json({ success: false, error: 'Acción no válida' }, { status: 400 });
    }

    const response = await fetch(`${WP_URL}${endpoint}${params}`, {
      headers: getHeaders(),
      cache: 'no-store'
    });

    if (!response.ok) {
      throw new Error(`WordPress respondió con ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error('Error en WordPress API:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
      wordpress_url: WP_URL
    }, { status: 500 });
  }
}

// POST - Activar/desactivar snippets, limpiar caché
export async function POST(request) {
  try {
    const body = await request.json();
    const { action, id, ids } = body;

    if (!action) {
      return NextResponse.json({ success: false, error: 'Acción requerida' }, { status: 400 });
    }

    let endpoint = '';
    let params = '';

    switch (action) {
      case 'activate':
        if (!id) {
          return NextResponse.json({ success: false, error: 'ID requerido' }, { status: 400 });
        }
        endpoint = '/wp-json/duendes/v1/snippets';
        params = `?action=activate&id=${id}`;
        break;

      case 'deactivate':
        if (!id) {
          return NextResponse.json({ success: false, error: 'ID requerido' }, { status: 400 });
        }
        endpoint = '/wp-json/duendes/v1/snippets';
        params = `?action=deactivate&id=${id}`;
        break;

      case 'activate_multiple':
        if (!ids || !Array.isArray(ids)) {
          return NextResponse.json({ success: false, error: 'IDs requeridos (array)' }, { status: 400 });
        }
        // Activar múltiples snippets
        const activateResults = await Promise.all(
          ids.map(async (snippetId) => {
            const res = await fetch(`${WP_URL}/wp-json/duendes/v1/snippets?action=activate&id=${snippetId}`, {
              method: 'POST',
              headers: getHeaders()
            });
            return res.json();
          })
        );
        return NextResponse.json({
          success: true,
          message: `${ids.length} snippets activados`,
          results: activateResults
        });

      case 'deactivate_multiple':
        if (!ids || !Array.isArray(ids)) {
          return NextResponse.json({ success: false, error: 'IDs requeridos (array)' }, { status: 400 });
        }
        // Desactivar múltiples snippets
        const deactivateResults = await Promise.all(
          ids.map(async (snippetId) => {
            const res = await fetch(`${WP_URL}/wp-json/duendes/v1/snippets?action=deactivate&id=${snippetId}`, {
              method: 'POST',
              headers: getHeaders()
            });
            return res.json();
          })
        );
        return NextResponse.json({
          success: true,
          message: `${ids.length} snippets desactivados`,
          results: deactivateResults
        });

      case 'clear_cache':
        endpoint = '/wp-json/duendes/v1/cache';
        break;

      default:
        return NextResponse.json({ success: false, error: 'Acción no válida' }, { status: 400 });
    }

    const response = await fetch(`${WP_URL}${endpoint}${params}`, {
      method: 'POST',
      headers: getHeaders()
    });

    if (!response.ok) {
      throw new Error(`WordPress respondió con ${response.status}`);
    }

    const data = await response.json();

    // Si se activó/desactivó un snippet, limpiar caché automáticamente
    if (action === 'activate' || action === 'deactivate') {
      try {
        await fetch(`${WP_URL}/wp-json/duendes/v1/cache`, {
          method: 'POST',
          headers: getHeaders()
        });
        data.cache_cleared = true;
      } catch (e) {
        data.cache_cleared = false;
      }
    }

    return NextResponse.json(data);

  } catch (error) {
    console.error('Error en WordPress API POST:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
