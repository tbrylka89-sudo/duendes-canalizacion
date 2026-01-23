import { kv } from '@vercel/kv';

export const dynamic = 'force-dynamic';

// ═══════════════════════════════════════════════════════════════════════════════
// ENDPOINT ADMIN: GESTIÓN DE KV
// Para operaciones de lectura/escritura en Vercel KV
// ═══════════════════════════════════════════════════════════════════════════════

export async function GET(request) {
  try {
    const url = new URL(request.url);
    const key = url.searchParams.get('key');
    const pattern = url.searchParams.get('pattern');

    if (pattern) {
      // Buscar keys que coincidan con el patrón
      const keys = await kv.keys(pattern);
      return Response.json({
        success: true,
        keys,
        count: keys.length
      });
    }

    if (!key) {
      return Response.json({
        success: false,
        error: 'Se requiere key o pattern'
      }, { status: 400 });
    }

    const value = await kv.get(key);

    return Response.json({
      success: true,
      key,
      value,
      exists: value !== null
    });

  } catch (error) {
    console.error('[KV GET] Error:', error);
    return Response.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { accion, key, value, keys } = body;

    switch (accion) {
      case 'set': {
        if (!key) {
          return Response.json({
            success: false,
            error: 'Se requiere key'
          }, { status: 400 });
        }

        await kv.set(key, value);

        return Response.json({
          success: true,
          key,
          message: 'Valor guardado correctamente'
        });
      }

      case 'delete': {
        if (!key) {
          return Response.json({
            success: false,
            error: 'Se requiere key'
          }, { status: 400 });
        }

        await kv.del(key);

        return Response.json({
          success: true,
          key,
          message: 'Key eliminada'
        });
      }

      case 'mget': {
        if (!keys || !Array.isArray(keys)) {
          return Response.json({
            success: false,
            error: 'Se requiere array de keys'
          }, { status: 400 });
        }

        const values = await kv.mget(...keys);
        const result = {};
        keys.forEach((k, i) => {
          result[k] = values[i];
        });

        return Response.json({
          success: true,
          values: result
        });
      }

      case 'mset': {
        if (!body.data || typeof body.data !== 'object') {
          return Response.json({
            success: false,
            error: 'Se requiere objeto data con key:value'
          }, { status: 400 });
        }

        const entries = Object.entries(body.data);
        for (const [k, v] of entries) {
          await kv.set(k, v);
        }

        return Response.json({
          success: true,
          count: entries.length,
          message: `${entries.length} valores guardados`
        });
      }

      default:
        return Response.json({
          success: false,
          error: 'Acción no válida. Usar: set, delete, mget, mset'
        }, { status: 400 });
    }

  } catch (error) {
    console.error('[KV POST] Error:', error);
    return Response.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
