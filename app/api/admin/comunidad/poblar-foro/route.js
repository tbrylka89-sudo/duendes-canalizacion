import Anthropic from '@anthropic-ai/sdk';
import { kv } from '@vercel/kv';
import {
  MIEMBROS_FUNDADORES,
  obtenerPerfilAleatorio,
  obtenerPerfilesAleatorios,
  seleccionarPerfilSegunContexto,
  perfilesConGuardian,
  GUARDIANES_MENCIONADOS
} from '@/lib/comunidad/miembros-fundadores';
import {
  generarPromptPersonalidad,
  TEMAS_POSTS
} from '@/lib/comunidad/generador-contenido';

// ═══════════════════════════════════════════════════════════════════════════════
// API: POBLAR FORO CON CONTENIDO INICIAL
// Genera posts y conversaciones completas entre perfiles fundadores
// ═══════════════════════════════════════════════════════════════════════════════

export const dynamic = 'force-dynamic';
export const maxDuration = 300; // 5 minutos para generacion masiva

const anthropic = new Anthropic();
const MODELO_IA = 'claude-sonnet-4-20250514';

// Categorias del foro
const CATEGORIAS_FORO = {
  altares: { nombre: 'Altares y Espacios Sagrados', icono: '?', descripcion: 'Comparti fotos de tus altares' },
  experiencias: { nombre: 'Experiencias con Guardianes', icono: '?', descripcion: 'Senales, suenos, conexiones' },
  rituales: { nombre: 'Rituales y Practicas', icono: '?', descripcion: 'Comparti tus rituales' },
  preguntas: { nombre: 'Preguntas al Circulo', icono: '?', descripcion: 'Consulta a la comunidad' },
  presentaciones: { nombre: 'Presentaciones', icono: '?', descripcion: 'Presentate al Circulo' },
  general: { nombre: 'Charla General', icono: '?', descripcion: 'Todo lo demas' }
};

// ═══════════════════════════════════════════════════════════════════════════════
// POST - Poblar el foro con contenido
// ═══════════════════════════════════════════════════════════════════════════════

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      cantidadPosts = 15,
      respuestasPorPost = { min: 3, max: 8 },
      limpiarExistente = false,
      usarIA = true,
      diasAtras = 30
    } = body;

    // Limpiar posts existentes si se solicita
    if (limpiarExistente) {
      const existingPosts = await kv.keys('foro:post:*');
      for (const key of existingPosts) {
        await kv.del(key);
      }
      const existingComments = await kv.keys('foro:comentario:*');
      for (const key of existingComments) {
        await kv.del(key);
      }
    }

    const postsCreados = [];
    const comentariosCreados = [];

    // Distribuir posts entre categorias
    const categoriasArray = Object.keys(CATEGORIAS_FORO);
    const postsPerCategoria = Math.ceil(cantidadPosts / categoriasArray.length);

    let postIndex = 0;

    for (const categoria of categoriasArray) {
      const postsEnCategoria = Math.min(postsPerCategoria, cantidadPosts - postIndex);

      for (let i = 0; i < postsEnCategoria && postIndex < cantidadPosts; i++) {
        // Seleccionar perfil para el post
        const perfilAutor = seleccionarPerfilParaCategoria(categoria);

        // Generar post
        const postData = await generarPostCompleto(perfilAutor, categoria, usarIA, diasAtras);

        // Generar respuestas
        const numRespuestas = Math.floor(
          Math.random() * (respuestasPorPost.max - respuestasPorPost.min + 1)
        ) + respuestasPorPost.min;

        const respuestas = await generarRespuestasConversacion(
          postData,
          numRespuestas,
          perfilAutor,
          usarIA
        );

        // Guardar post
        const postId = `fundador-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

        const post = {
          id: postId,
          usuario_email: perfilAutor.email,
          usuario_nombre: perfilAutor.nombre,
          titulo: postData.titulo,
          contenido: postData.contenido,
          categoria: categoria,
          categoria_info: CATEGORIAS_FORO[categoria],
          imagenes: [],
          likes: generarLikesAleatorios(20, 150),
          total_likes: 0,
          total_comentarios: respuestas.length,
          estado: 'publicado',
          creado_en: postData.fecha,
          editado_en: null,
          es_contenido_fundador: true
        };

        post.total_likes = post.likes.length;

        await kv.set(`foro:post:${postId}`, post);
        postsCreados.push({ id: postId, titulo: postData.titulo, categoria });

        // Guardar respuestas
        for (let j = 0; j < respuestas.length; j++) {
          const respuesta = respuestas[j];
          const comentarioId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

          const comentario = {
            id: comentarioId,
            post_id: postId,
            usuario_email: respuesta.perfil.email,
            usuario_nombre: respuesta.perfil.nombre,
            contenido: respuesta.contenido,
            likes: generarLikesAleatorios(5, 50),
            total_likes: 0,
            creado_en: respuesta.fecha,
            es_contenido_fundador: true
          };

          comentario.total_likes = comentario.likes.length;

          await kv.set(`foro:comentario:${postId}:${comentarioId}`, comentario);
          comentariosCreados.push(comentarioId);

          // Delay para IDs unicos
          await new Promise(r => setTimeout(r, 5));
        }

        postIndex++;

        // Delay entre posts para no sobrecargar
        await new Promise(r => setTimeout(r, 100));
      }
    }

    return Response.json({
      success: true,
      mensaje: 'Foro poblado exitosamente con contenido fundador',
      stats: {
        posts_creados: postsCreados.length,
        comentarios_creados: comentariosCreados.length,
        posts: postsCreados
      }
    });

  } catch (error) {
    console.error('[POBLAR-FORO] Error:', error);
    return Response.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// FUNCIONES AUXILIARES
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Selecciona perfil apropiado para una categoria
 */
function seleccionarPerfilParaCategoria(categoria) {
  const preferencias = {
    altares: ['artista', 'practica', 'herbolaria'],
    experiencias: ['mistica', 'emocional', 'entusiasta'],
    rituales: ['mistica', 'herbolaria', 'esoterica_profesional'],
    preguntas: ['curiosa', 'buscadora', 'esceptico_abierto'],
    presentaciones: ['curiosa', 'joven_espiritual', 'ocupada'],
    general: ['entusiasta', 'organizadora', 'matrona']
  };

  const personalidadesPreferidas = preferencias[categoria] || [];

  // Intentar encontrar alguien con personalidad preferida
  const candidatos = MIEMBROS_FUNDADORES.filter(m =>
    personalidadesPreferidas.includes(m.personalidad)
  );

  if (candidatos.length > 0) {
    return candidatos[Math.floor(Math.random() * candidatos.length)];
  }

  return obtenerPerfilAleatorio();
}

/**
 * Genera un post completo con IA o templates
 */
async function generarPostCompleto(perfil, categoria, usarIA, diasAtras) {
  const fecha = generarFechaAleatoria(diasAtras);

  // Seleccionar tema de la categoria
  const temasCategoria = TEMAS_POSTS[categoria] || TEMAS_POSTS.general;
  const temaBase = temasCategoria[Math.floor(Math.random() * temasCategoria.length)];

  // Reemplazar variables en titulo
  let titulo = temaBase.titulo;
  if (titulo.includes('{guardian}') && perfil.guardianes.length > 0) {
    titulo = titulo.replace('{guardian}', perfil.guardianes[0].nombre);
  } else if (titulo.includes('{guardian}')) {
    const guardianAleatorio = GUARDIANES_MENCIONADOS[Math.floor(Math.random() * GUARDIANES_MENCIONADOS.length)];
    titulo = titulo.replace('{guardian}', guardianAleatorio.nombre);
  }
  titulo = titulo.replace('{estacion}', 'verano');
  titulo = titulo.replace('{fase}', 'llena');
  titulo = titulo.replace('{proposito}', 'proteccion');
  titulo = titulo.replace('{evento}', 'se cae del altar');
  titulo = titulo.replace('{logro}', 'tomar una decision importante');
  titulo = titulo.replace('{nombre}', perfil.nombreCorto);
  titulo = titulo.replace('{lugar}', perfil.ubicacion.split(',')[0]);

  if (!usarIA) {
    // Generar contenido basico sin IA
    const contenidosBasicos = {
      altares: `Queria compartir con ustedes mi altar nuevo. Todavia lo estoy armando pero ya se siente especial.`,
      experiencias: `Hoy me paso algo lindo que queria contarles. Senti una conexion muy fuerte con mi guardian.`,
      rituales: `Les comparto un ritual que me funciona muy bien. Espero que les sirva tambien.`,
      preguntas: `Tengo una duda y me encantaria escuchar sus opiniones. Ustedes que piensan?`,
      presentaciones: `Hola a todas! Me acabo de unir al Circulo y estoy muy emocionada de conocerlas.`,
      general: `Queria charlar un poco con ustedes sobre algo que vengo pensando.`
    };

    return {
      titulo,
      contenido: contenidosBasicos[categoria] || contenidosBasicos.general,
      fecha
    };
  }

  // Generar con IA
  const prompt = `${generarPromptPersonalidad(perfil)}

TAREA: Escribi un post para el foro del Circulo.

CATEGORIA: ${categoria} - ${CATEGORIAS_FORO[categoria].nombre}
TITULO SUGERIDO: ${titulo}
TIPO: ${temaBase.tipo}

GENERA el contenido del post (2-4 parrafos).

REGLAS:
- Escribi como ${perfil.nombreCorto}, con tu voz y estilo
- ${perfil.estiloEscritura.extension === 'corto' ? 'Se concisa, no te extiendas' : 'Desarrolla bien la idea'}
- Termina invitando a participar (pregunta o invitacion)
- Menciona ${perfil.guardianes.length > 0 ? `a tu guardian ${perfil.guardianes[0].nombre}` : 'que estas buscando tu guardian'} si es relevante
- ${perfil.estiloEscritura.usaEmojis ? 'Podes usar algunos emojis' : 'No uses emojis'}
- Suena natural, como si escribieras en un grupo de WhatsApp de amigas

NO INCLUYAS EL TITULO, solo el contenido del post.`;

  const response = await anthropic.messages.create({
    model: MODELO_IA,
    max_tokens: 800,
    messages: [{ role: 'user', content: prompt }]
  });

  return {
    titulo,
    contenido: response.content[0].text.trim(),
    fecha
  };
}

/**
 * Genera respuestas que forman una conversacion natural
 */
async function generarRespuestasConversacion(postData, cantidad, autorPost, usarIA) {
  const respuestas = [];
  const perfilesUsados = new Set([autorPost.id]);
  const fechaPost = new Date(postData.fecha);

  // Tipos de respuesta para variedad
  const tiposRespuesta = [
    'apoyo',      // Apoyo emocional
    'experiencia', // Compartir experiencia similar
    'consejo',    // Dar consejo practico
    'pregunta',   // Hacer pregunta de seguimiento
    'reflexion'   // Reflexion sobre el tema
  ];

  for (let i = 0; i < cantidad; i++) {
    // Seleccionar perfil unico
    let perfil;
    let intentos = 0;
    do {
      perfil = seleccionarPerfilSegunContexto({
        tipo: tiposRespuesta[i % tiposRespuesta.length],
        esRespuesta: true
      });
      intentos++;
    } while (perfilesUsados.has(perfil.id) && intentos < 20);

    perfilesUsados.add(perfil.id);

    // Calcular fecha de respuesta (despues del post)
    const horasDesfase = Math.floor(Math.random() * 48) + 1;
    const fechaRespuesta = new Date(fechaPost);
    fechaRespuesta.setHours(fechaRespuesta.getHours() + horasDesfase);

    // Asegurar que no es futura
    const ahora = new Date();
    if (fechaRespuesta > ahora) {
      fechaRespuesta.setTime(ahora.getTime() - Math.random() * 86400000);
    }

    const tipoRespuesta = tiposRespuesta[i % tiposRespuesta.length];

    let contenido;

    if (!usarIA) {
      // Respuestas basicas sin IA
      const respuestasBasicas = {
        apoyo: 'Que lindo lo que compartis! Gracias por abrirte asi.',
        experiencia: 'Me paso algo similar hace un tiempo. Te entiendo perfecto.',
        consejo: 'Lo que a mi me funciona es meditar un ratito cada dia. Proba y conta!',
        pregunta: 'Me intriga lo que contas. Podes desarrollar un poco mas?',
        reflexion: 'Me deja pensando lo que escribiste. Hay algo ahi muy profundo.'
      };
      contenido = respuestasBasicas[tipoRespuesta];
    } else {
      // Generar con IA
      const prompt = `${generarPromptPersonalidad(perfil)}

CONTEXTO: Estas respondiendo a este post en el foro del Circulo:
---
TITULO: ${postData.titulo}
CONTENIDO: ${postData.contenido}
---
Escrito por ${autorPost.nombreCorto}.

TAREA: Escribi una respuesta de tipo "${tipoRespuesta}".

${tipoRespuesta === 'apoyo' ? 'Muestra apoyo emocional, validacion.' : ''}
${tipoRespuesta === 'experiencia' ? 'Comparti una experiencia personal similar.' : ''}
${tipoRespuesta === 'consejo' ? 'Da un consejo practico basado en tu experiencia.' : ''}
${tipoRespuesta === 'pregunta' ? 'Hace una pregunta genuina para saber mas.' : ''}
${tipoRespuesta === 'reflexion' ? 'Reflexiona sobre lo que leiste, aporta tu perspectiva.' : ''}

REGLAS:
- ${perfil.estiloEscritura.extension === 'corto' ? 'Maximo 2-3 oraciones' : 'Podes extenderte un poco'}
- ${perfil.estiloEscritura.usaEmojis ? 'Podes usar emojis' : 'Sin emojis'}
- Usa tus muletillas naturales
- Suena autentica, como ${perfil.nombreCorto}
- ${perfil.guardianes.length > 0 ? `Si es relevante, mencioná a ${perfil.guardianes[0].nombre}` : ''}`;

      const response = await anthropic.messages.create({
        model: MODELO_IA,
        max_tokens: 300,
        messages: [{ role: 'user', content: prompt }]
      });

      contenido = response.content[0].text.trim();
    }

    respuestas.push({
      perfil,
      contenido,
      tipo: tipoRespuesta,
      fecha: fechaRespuesta.toISOString()
    });

    // Delay entre respuestas
    if (usarIA) {
      await new Promise(r => setTimeout(r, 50));
    }
  }

  return respuestas;
}

/**
 * Genera fecha aleatoria en los ultimos N dias
 */
function generarFechaAleatoria(diasAtras) {
  const ahora = new Date();
  const dias = Math.floor(Math.random() * diasAtras);
  const horas = Math.floor(Math.random() * 24);
  const minutos = Math.floor(Math.random() * 60);

  const fecha = new Date(ahora);
  fecha.setDate(fecha.getDate() - dias);
  fecha.setHours(fecha.getHours() - horas);
  fecha.setMinutes(fecha.getMinutes() - minutos);

  return fecha.toISOString();
}

/**
 * Genera array de likes aleatorios
 */
function generarLikesAleatorios(min, max) {
  const cantidad = Math.floor(Math.random() * (max - min + 1)) + min;
  const likes = [];

  for (let i = 0; i < cantidad; i++) {
    const perfil = MIEMBROS_FUNDADORES[Math.floor(Math.random() * MIEMBROS_FUNDADORES.length)];
    if (!likes.includes(perfil.email)) {
      likes.push(perfil.email);
    }
  }

  return likes;
}

// ═══════════════════════════════════════════════════════════════════════════════
// GET - Ver estado actual del foro
// ═══════════════════════════════════════════════════════════════════════════════

export async function GET() {
  try {
    const postKeys = await kv.keys('foro:post:*');
    const commentKeys = await kv.keys('foro:comentario:*');

    // Obtener algunos posts de ejemplo
    const ejemplos = [];
    for (let i = 0; i < Math.min(5, postKeys.length); i++) {
      const post = await kv.get(postKeys[i]);
      if (post) {
        ejemplos.push({
          id: post.id,
          titulo: post.titulo,
          categoria: post.categoria,
          autor: post.usuario_nombre,
          likes: post.total_likes,
          comentarios: post.total_comentarios
        });
      }
    }

    return Response.json({
      success: true,
      stats: {
        total_posts: postKeys.length,
        total_comentarios: commentKeys.length
      },
      ejemplos,
      categorias: CATEGORIAS_FORO,
      perfiles_disponibles: MIEMBROS_FUNDADORES.length
    });
  } catch (error) {
    return Response.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
