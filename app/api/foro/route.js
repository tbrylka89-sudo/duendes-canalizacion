import { kv } from '@vercel/kv';

// GET - Obtener posts del foro
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const categoria = searchParams.get('categoria') || 'general';

    // Obtener posts de la categoría
    const postsKeys = await kv.keys(`foro:${categoria}:*`);
    const posts = [];

    for (const key of postsKeys) {
      const post = await kv.get(key);
      if (post) {
        posts.push(post);
      }
    }

    // Ordenar por fecha (más reciente primero)
    posts.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

    return Response.json({
      success: true,
      posts: posts.slice(0, 50),
      total: posts.length
    });

  } catch (error) {
    console.error('Error obteniendo posts:', error);
    return Response.json({
      success: false,
      error: error.message,
      posts: []
    });
  }
}

// POST - Crear nuevo post
export async function POST(request) {
  try {
    const body = await request.json();
    const { email, autor, categoria, titulo, contenido } = body;

    if (!email || !titulo || !contenido) {
      return Response.json({
        success: false,
        error: 'Email, titulo y contenido requeridos'
      }, { status: 400 });
    }

    const ahora = new Date();
    const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const categoriaFinal = categoria || 'general';

    const nuevoPost = {
      id,
      autor: autor || 'Anónimo',
      autorEmail: email.toLowerCase(),
      titulo,
      contenido,
      categoria: categoriaFinal,
      fecha: ahora.toISOString(),
      respuestas: [],
      likes: 0,
      visible: true
    };

    await kv.set(`foro:${categoriaFinal}:${id}`, nuevoPost);

    // Guardar actividad del usuario
    try {
      const userKey = `user:${email.toLowerCase()}`;
      let user = await kv.get(userKey);
      if (!user) {
        user = await kv.get(`elegido:${email.toLowerCase()}`);
      }
      if (user) {
        if (!user.actividadForo) user.actividadForo = [];
        user.actividadForo.push({
          tipo: 'post',
          postId: id,
          fecha: ahora.toISOString()
        });
        await kv.set(userKey, user);
      }
    } catch (e) {}

    return Response.json({
      success: true,
      post: nuevoPost
    });

  } catch (error) {
    console.error('Error creando post:', error);
    return Response.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
