import { kv } from '@vercel/kv';

export const dynamic = 'force-dynamic';

// ═══════════════════════════════════════════════════════════════════════════════
// FORO DEL CÍRCULO DE DUENDES
// Sistema completo: posts, comentarios, likes, categorías
// ═══════════════════════════════════════════════════════════════════════════════

const CATEGORIAS_FORO = {
  altares: { nombre: 'Altares y Espacios Sagrados', icono: '🕯️', descripcion: 'Compartí fotos de tus altares' },
  experiencias: { nombre: 'Experiencias con Guardianes', icono: '✨', descripcion: 'Señales, sueños, conexiones' },
  rituales: { nombre: 'Rituales y Prácticas', icono: '🔮', descripcion: 'Compartí tus rituales' },
  preguntas: { nombre: 'Preguntas al Círculo', icono: '❓', descripcion: 'Consultá a la comunidad' },
  presentaciones: { nombre: 'Presentaciones', icono: '👋', descripcion: 'Presentate al Círculo' },
  general: { nombre: 'Charla General', icono: '💬', descripcion: 'Todo lo demás' }
};

// ═══════════════════════════════════════════════════════════════════════════════
// GET - Listar posts
// ═══════════════════════════════════════════════════════════════════════════════

export async function GET(request) {
  try {
    const url = new URL(request.url);
    const categoria = url.searchParams.get('categoria');
    const limite = parseInt(url.searchParams.get('limite')) || 20;
    const offset = parseInt(url.searchParams.get('offset')) || 0;
    const postId = url.searchParams.get('post_id');

    // Si piden un post específico
    if (postId) {
      const post = await kv.get(`foro:post:${postId}`);
      if (!post) {
        return Response.json({ success: false, error: 'Post no encontrado' }, { status: 404 });
      }

      // Obtener comentarios del post
      const comentariosKeys = await kv.keys(`foro:comentario:${postId}:*`);
      const comentarios = [];
      for (const key of comentariosKeys) {
        const comentario = await kv.get(key);
        if (comentario) comentarios.push(comentario);
      }

      // Ordenar comentarios por fecha
      comentarios.sort((a, b) => new Date(a.creado_en) - new Date(b.creado_en));

      return Response.json({
        success: true,
        post,
        comentarios,
        total_comentarios: comentarios.length
      });
    }

    // Listar posts
    const allPostKeys = await kv.keys('foro:post:*');
    let posts = [];

    for (const key of allPostKeys) {
      const post = await kv.get(key);
      if (post && post.estado === 'publicado') {
        posts.push(post);
      }
    }

    // Filtrar por categoría si se especifica
    if (categoria && categoria !== 'todas') {
      posts = posts.filter(p => p.categoria === categoria);
    }

    // Ordenar por fecha (más recientes primero)
    posts.sort((a, b) => new Date(b.creado_en) - new Date(a.creado_en));

    // Paginar
    const total = posts.length;
    posts = posts.slice(offset, offset + limite);

    return Response.json({
      success: true,
      posts,
      total,
      limite,
      offset,
      categorias: CATEGORIAS_FORO
    });

  } catch (error) {
    console.error('Error en foro GET:', error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// POST - Crear post o comentario
// ═══════════════════════════════════════════════════════════════════════════════

export async function POST(request) {
  try {
    const body = await request.json();
    const { accion } = body;

    switch (accion) {
      case 'crear_post':
        return await crearPost(body);
      case 'crear_comentario':
        return await crearComentario(body);
      case 'like':
        return await toggleLike(body);
      case 'reportar':
        return await reportarContenido(body);
      default:
        return Response.json({ success: false, error: 'Acción no válida' }, { status: 400 });
    }

  } catch (error) {
    console.error('Error en foro POST:', error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// FUNCIONES DE POSTS
// ═══════════════════════════════════════════════════════════════════════════════

async function crearPost(body) {
  const {
    usuario_email,
    usuario_nombre,
    titulo,
    contenido,
    categoria = 'general',
    imagenes = []
  } = body;

  // Validar
  if (!usuario_email || !titulo || !contenido) {
    return Response.json({
      success: false,
      error: 'Faltan campos requeridos (usuario_email, titulo, contenido)'
    }, { status: 400 });
  }

  if (!CATEGORIAS_FORO[categoria]) {
    return Response.json({
      success: false,
      error: 'Categoría no válida',
      categorias_validas: Object.keys(CATEGORIAS_FORO)
    }, { status: 400 });
  }

  // Verificar que es miembro del círculo
  const esMiembro = await verificarMiembroCirculo(usuario_email);
  if (!esMiembro) {
    return Response.json({
      success: false,
      error: 'Solo miembros del Círculo pueden publicar'
    }, { status: 403 });
  }

  // Generar ID único
  const postId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  const post = {
    id: postId,
    usuario_email,
    usuario_nombre: usuario_nombre || usuario_email.split('@')[0],
    titulo: titulo.substring(0, 200),
    contenido: contenido.substring(0, 5000),
    categoria,
    categoria_info: CATEGORIAS_FORO[categoria],
    imagenes: imagenes.slice(0, 5), // Máximo 5 imágenes
    likes: [],
    total_likes: 0,
    total_comentarios: 0,
    estado: 'publicado',
    creado_en: new Date().toISOString(),
    editado_en: null
  };

  // Guardar
  await kv.set(`foro:post:${postId}`, post);

  // Actualizar contador de posts del usuario
  const userPostsKey = `foro:user-posts:${usuario_email}`;
  const userPosts = await kv.get(userPostsKey) || [];
  userPosts.push(postId);
  await kv.set(userPostsKey, userPosts);

  return Response.json({
    success: true,
    post
  });
}

async function crearComentario(body) {
  const {
    post_id,
    usuario_email,
    usuario_nombre,
    contenido
  } = body;

  // Validar
  if (!post_id || !usuario_email || !contenido) {
    return Response.json({
      success: false,
      error: 'Faltan campos requeridos'
    }, { status: 400 });
  }

  // Verificar que el post existe
  const post = await kv.get(`foro:post:${post_id}`);
  if (!post) {
    return Response.json({ success: false, error: 'Post no encontrado' }, { status: 404 });
  }

  // Verificar membresía
  const esMiembro = await verificarMiembroCirculo(usuario_email);
  if (!esMiembro) {
    return Response.json({
      success: false,
      error: 'Solo miembros del Círculo pueden comentar'
    }, { status: 403 });
  }

  // Crear comentario
  const comentarioId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  const comentario = {
    id: comentarioId,
    post_id,
    usuario_email,
    usuario_nombre: usuario_nombre || usuario_email.split('@')[0],
    contenido: contenido.substring(0, 2000),
    likes: [],
    total_likes: 0,
    creado_en: new Date().toISOString()
  };

  // Guardar comentario
  await kv.set(`foro:comentario:${post_id}:${comentarioId}`, comentario);

  // Actualizar contador en el post
  post.total_comentarios = (post.total_comentarios || 0) + 1;
  await kv.set(`foro:post:${post_id}`, post);

  return Response.json({
    success: true,
    comentario
  });
}

async function toggleLike(body) {
  const { tipo, id, usuario_email } = body;

  if (!tipo || !id || !usuario_email) {
    return Response.json({ success: false, error: 'Faltan campos' }, { status: 400 });
  }

  let key;
  if (tipo === 'post') {
    key = `foro:post:${id}`;
  } else if (tipo === 'comentario') {
    const [postId, comentarioId] = id.split(':');
    key = `foro:comentario:${postId}:${comentarioId}`;
  } else {
    return Response.json({ success: false, error: 'Tipo no válido' }, { status: 400 });
  }

  const item = await kv.get(key);
  if (!item) {
    return Response.json({ success: false, error: 'No encontrado' }, { status: 404 });
  }

  // Toggle like
  const likes = item.likes || [];
  const yaLikeo = likes.includes(usuario_email);

  if (yaLikeo) {
    item.likes = likes.filter(e => e !== usuario_email);
  } else {
    item.likes = [...likes, usuario_email];
  }
  item.total_likes = item.likes.length;

  await kv.set(key, item);

  return Response.json({
    success: true,
    liked: !yaLikeo,
    total_likes: item.total_likes
  });
}

async function reportarContenido(body) {
  const { tipo, id, usuario_email, motivo } = body;

  const reporte = {
    tipo,
    id,
    reportado_por: usuario_email,
    motivo,
    creado_en: new Date().toISOString(),
    estado: 'pendiente'
  };

  await kv.set(`foro:reporte:${Date.now()}`, reporte);

  return Response.json({
    success: true,
    mensaje: 'Reporte enviado. Lo revisaremos pronto.'
  });
}

// ═══════════════════════════════════════════════════════════════════════════════
// UTILIDADES
// ═══════════════════════════════════════════════════════════════════════════════

async function verificarMiembroCirculo(email) {
  // Verificar en la clave del círculo
  const circuloData = await kv.get(`circulo:${email.toLowerCase()}`);
  if (circuloData?.activo) return true;

  // Verificar en datos de usuario
  const userData = await kv.get(`user:${email.toLowerCase()}`);
  if (userData?.esCirculo) return true;

  const elegidoData = await kv.get(`elegido:${email.toLowerCase()}`);
  if (elegidoData?.esCirculo) return true;

  return false;
}

// ═══════════════════════════════════════════════════════════════════════════════
// DELETE - Eliminar post o comentario (solo autor o admin)
// ═══════════════════════════════════════════════════════════════════════════════

export async function DELETE(request) {
  try {
    const url = new URL(request.url);
    const tipo = url.searchParams.get('tipo');
    const id = url.searchParams.get('id');
    const usuario_email = url.searchParams.get('usuario_email');

    if (!tipo || !id || !usuario_email) {
      return Response.json({ success: false, error: 'Faltan parámetros' }, { status: 400 });
    }

    let key;
    if (tipo === 'post') {
      key = `foro:post:${id}`;
    } else if (tipo === 'comentario') {
      const [postId, comentarioId] = id.split(':');
      key = `foro:comentario:${postId}:${comentarioId}`;
    }

    const item = await kv.get(key);
    if (!item) {
      return Response.json({ success: false, error: 'No encontrado' }, { status: 404 });
    }

    // Verificar que es el autor
    if (item.usuario_email !== usuario_email) {
      return Response.json({ success: false, error: 'No autorizado' }, { status: 403 });
    }

    // Marcar como eliminado (soft delete)
    item.estado = 'eliminado';
    item.eliminado_en = new Date().toISOString();
    await kv.set(key, item);

    return Response.json({
      success: true,
      mensaje: 'Eliminado correctamente'
    });

  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
