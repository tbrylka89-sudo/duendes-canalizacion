import { kv } from '@vercel/kv';

export const dynamic = 'force-dynamic';

// GET - Obtener todos los banners
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const ubicacion = searchParams.get('ubicacion');
    const soloActivos = searchParams.get('activos') === 'true';

    const keys = await kv.keys('banner:*');
    const banners = [];
    const ahora = new Date();

    for (const key of keys) {
      const banner = await kv.get(key);
      if (!banner) continue;

      // Filtrar por ubicación si se especifica
      if (ubicacion && banner.ubicacion !== ubicacion) continue;

      // Filtrar por estado activo
      if (soloActivos) {
        if (!banner.activo) continue;

        // Verificar fechas
        if (banner.fechaInicio && new Date(banner.fechaInicio) > ahora) continue;
        if (banner.fechaFin && new Date(banner.fechaFin) < ahora) continue;
      }

      banners.push(banner);
    }

    // Ordenar por fecha de creación (más reciente primero)
    banners.sort((a, b) => new Date(b.fechaCreacion || 0) - new Date(a.fechaCreacion || 0));

    return Response.json({
      success: true,
      banners,
      total: banners.length
    });

  } catch (error) {
    console.error('Error obteniendo banners:', error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST - Crear o actualizar banner
export async function POST(request) {
  try {
    const body = await request.json();
    const {
      id,
      ubicacion,
      titulo,
      subtitulo,
      ctaTexto,
      ctaUrl,
      imagenUrl,
      colorFondo,
      colorTexto,
      activo = true,
      fechaInicio,
      fechaFin
    } = body;

    if (!titulo) {
      return Response.json({ success: false, error: 'El título es requerido' }, { status: 400 });
    }

    const ahora = new Date().toISOString();
    const bannerId = id || `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Si es actualización, obtener existente
    let existente = null;
    if (id) {
      existente = await kv.get(`banner:${id}`);
    }

    const bannerObj = {
      id: bannerId,
      ubicacion: ubicacion || 'hero',
      titulo,
      subtitulo: subtitulo || '',
      ctaTexto: ctaTexto || '',
      ctaUrl: ctaUrl || '',
      imagenUrl: imagenUrl || '',
      colorFondo: colorFondo || '#1B4D3E',
      colorTexto: colorTexto || '#FFFFFF',
      activo,
      fechaInicio: fechaInicio || null,
      fechaFin: fechaFin || null,
      fechaCreacion: existente?.fechaCreacion || ahora,
      fechaActualizacion: ahora
    };

    await kv.set(`banner:${bannerId}`, bannerObj);

    return Response.json({
      success: true,
      banner: bannerObj,
      mensaje: existente ? 'Banner actualizado' : 'Banner creado'
    });

  } catch (error) {
    console.error('Error guardando banner:', error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}

// DELETE - Eliminar banner
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return Response.json({ success: false, error: 'ID requerido' }, { status: 400 });
    }

    const banner = await kv.get(`banner:${id}`);
    if (!banner) {
      return Response.json({ success: false, error: 'Banner no encontrado' }, { status: 404 });
    }

    await kv.del(`banner:${id}`);

    return Response.json({
      success: true,
      mensaje: 'Banner eliminado'
    });

  } catch (error) {
    console.error('Error eliminando banner:', error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
