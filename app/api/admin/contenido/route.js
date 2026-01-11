import { kv } from '@vercel/kv';

export const dynamic = 'force-dynamic';

// GET - Listar contenido con filtros
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const filtro = searchParams.get('filtro') || 'todos';
    const categoria = searchParams.get('categoria');
    const id = searchParams.get('id');
    const limite = parseInt(searchParams.get('limite') || '50');

    // Si piden un contenido específico
    if (id) {
      const contenido = await kv.get(`contenido:${id}`);
      if (!contenido) {
        return Response.json({ success: false, error: 'Contenido no encontrado' }, { status: 404 });
      }
      return Response.json({ success: true, contenido });
    }

    // Obtener todas las keys de contenido
    const keys = await kv.keys('contenido:*');
    const contenidos = [];

    for (const key of keys) {
      const contenido = await kv.get(key);
      if (!contenido) continue;

      // Aplicar filtros
      if (filtro === 'borradores' && contenido.estado !== 'borrador') continue;
      if (filtro === 'programados' && contenido.estado !== 'programado') continue;
      if (filtro === 'publicados' && contenido.estado !== 'publicado') continue;
      if (categoria && contenido.categoria !== categoria) continue;

      contenidos.push(contenido);
    }

    // Ordenar por fecha (más reciente primero)
    contenidos.sort((a, b) => new Date(b.fechaCreacion || 0) - new Date(a.fechaCreacion || 0));

    // Estadísticas
    const stats = {
      total: contenidos.length,
      borradores: contenidos.filter(c => c.estado === 'borrador').length,
      programados: contenidos.filter(c => c.estado === 'programado').length,
      publicados: contenidos.filter(c => c.estado === 'publicado').length
    };

    return Response.json({
      success: true,
      contenidos: contenidos.slice(0, limite),
      stats,
      filtro
    });

  } catch (error) {
    console.error('Error listando contenido:', error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST - Guardar contenido (nuevo o actualizar)
export async function POST(request) {
  try {
    const body = await request.json();
    const {
      id,
      titulo,
      contenido,
      categoria,
      tipo,
      estado = 'borrador',
      fechaPublicacion,
      imagenUrl,
      audioUrl,
      metadatos = {}
    } = body;

    if (!titulo || !contenido) {
      return Response.json({ success: false, error: 'Título y contenido son requeridos' }, { status: 400 });
    }

    const ahora = new Date().toISOString();
    const contenidoId = id || `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Si es actualización, obtener el existente
    let existente = null;
    if (id) {
      existente = await kv.get(`contenido:${id}`);
    }

    const contenidoObj = {
      id: contenidoId,
      titulo,
      contenido,
      categoria,
      tipo,
      estado,
      fechaPublicacion: fechaPublicacion || null,
      imagenUrl: imagenUrl || existente?.imagenUrl || null,
      audioUrl: audioUrl || existente?.audioUrl || null,
      metadatos: {
        ...existente?.metadatos,
        ...metadatos
      },
      fechaCreacion: existente?.fechaCreacion || ahora,
      fechaActualizacion: ahora,
      palabras: contenido.split(/\s+/).length,
      caracteres: contenido.length
    };

    // Guardar en KV
    await kv.set(`contenido:${contenidoId}`, contenidoObj);

    // Si está programado, agregar a cola de publicación
    if (estado === 'programado' && fechaPublicacion) {
      await kv.zadd('contenido:programados', {
        score: new Date(fechaPublicacion).getTime(),
        member: contenidoId
      });
    }

    return Response.json({
      success: true,
      contenido: contenidoObj,
      mensaje: existente ? 'Contenido actualizado' : 'Contenido guardado'
    });

  } catch (error) {
    console.error('Error guardando contenido:', error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}

// DELETE - Eliminar contenido
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return Response.json({ success: false, error: 'ID requerido' }, { status: 400 });
    }

    const contenido = await kv.get(`contenido:${id}`);
    if (!contenido) {
      return Response.json({ success: false, error: 'Contenido no encontrado' }, { status: 404 });
    }

    await kv.del(`contenido:${id}`);
    await kv.zrem('contenido:programados', id);

    return Response.json({
      success: true,
      mensaje: 'Contenido eliminado'
    });

  } catch (error) {
    console.error('Error eliminando contenido:', error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
