import { kv } from '@vercel/kv';

// POST - Responder a un post
export async function POST(request) {
  try {
    const body = await request.json();
    const { postId, email, autor, contenido } = body;

    if (!postId || !email || !contenido) {
      return Response.json({
        success: false,
        error: 'postId, email y contenido requeridos'
      }, { status: 400 });
    }

    // Buscar el post en todas las categorías
    const categorias = ['general', 'guardianes', 'magia', 'suenos', 'cristales', 'ayuda'];
    let postKey = null;
    let post = null;

    for (const cat of categorias) {
      const key = `foro:${cat}:${postId}`;
      const p = await kv.get(key);
      if (p) {
        postKey = key;
        post = p;
        break;
      }
    }

    if (!post) {
      return Response.json({
        success: false,
        error: 'Post no encontrado'
      }, { status: 404 });
    }

    const ahora = new Date();
    const respuestaId = `${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;

    const nuevaRespuesta = {
      id: respuestaId,
      autor: autor || 'Anónimo',
      autorEmail: email.toLowerCase(),
      contenido,
      fecha: ahora.toISOString()
    };

    if (!post.respuestas) post.respuestas = [];
    post.respuestas.push(nuevaRespuesta);

    await kv.set(postKey, post);

    return Response.json({
      success: true,
      respuesta: nuevaRespuesta
    });

  } catch (error) {
    console.error('Error respondiendo post:', error);
    return Response.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
