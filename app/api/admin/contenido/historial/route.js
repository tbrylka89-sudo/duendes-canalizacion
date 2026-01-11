import { kv } from '@vercel/kv';

// GET - Obtener historial de contenido generado
export async function GET() {
  try {
    // Obtener todas las keys del historial
    const keys = await kv.keys('contenido-historial:*');
    const contenidos = [];

    for (const key of keys) {
      const contenido = await kv.get(key);
      if (contenido) {
        contenidos.push(contenido);
      }
    }

    // Ordenar por fecha (más reciente primero)
    contenidos.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

    return Response.json({
      success: true,
      contenidos: contenidos.slice(0, 50), // Limitar a últimos 50
      total: contenidos.length
    });

  } catch (error) {
    console.error('Error obteniendo historial:', error);
    return Response.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}

// POST - Guardar contenido en historial
export async function POST(request) {
  try {
    const body = await request.json();
    const { titulo, contenido, categoria, tipo, imagen, palabras, publicado } = body;

    if (!titulo || !contenido) {
      return Response.json({
        success: false,
        error: 'Titulo y contenido requeridos'
      }, { status: 400 });
    }

    const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const ahora = new Date();

    const nuevoContenido = {
      id,
      titulo,
      contenido,
      categoria: categoria || 'general',
      tipo: tipo || 'articulo',
      imagen: imagen || null,
      palabras: palabras || contenido.split(/\s+/).length,
      publicado: publicado || false,
      fecha: ahora.toISOString()
    };

    await kv.set(`contenido-historial:${id}`, nuevoContenido);

    return Response.json({
      success: true,
      contenido: nuevoContenido
    });

  } catch (error) {
    console.error('Error guardando en historial:', error);
    return Response.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
