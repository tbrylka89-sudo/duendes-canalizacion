// ═══════════════════════════════════════════════════════════════════════════════
// MOTOR DE INTERACCION AUTOMATICA
// Sistema que genera interacciones REALES usando Claude, no frases hechas
// ═══════════════════════════════════════════════════════════════════════════════

import { kv } from '@vercel/kv';
import Anthropic from '@anthropic-ai/sdk';
import {
  MIEMBROS_FUNDADORES,
  obtenerPerfilAleatorio,
  obtenerPerfilesAleatorios,
  seleccionarPerfilSegunContexto,
  perfilesConGuardian
} from './miembros-fundadores.js';

// ═══════════════════════════════════════════════════════════════════════════════
// CONFIGURACION
// ═══════════════════════════════════════════════════════════════════════════════

const CONFIG_DEFAULT = {
  activo: true,
  minInteraccionesDia: 5,
  maxInteraccionesDia: 15,
  minInteraccionesFinDeSemana: 8,
  maxInteraccionesFinDeSemana: 25,
  horariosPermitidos: [8, 9, 10, 11, 14, 15, 16, 17, 19, 20, 21, 22], // Horas del dia
  probabilidadRespuestaUsuarioReal: 0.8, // 80% de chance de responder a usuarios reales
  maxComentariosPorPost: 4,
  generarConversaciones: true
};

// ═══════════════════════════════════════════════════════════════════════════════
// CLIENTE ANTHROPIC
// ═══════════════════════════════════════════════════════════════════════════════

function getAnthropicClient() {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error('ANTHROPIC_API_KEY no configurada');
  }
  return new Anthropic({ apiKey });
}

// ═══════════════════════════════════════════════════════════════════════════════
// FUNCIONES PRINCIPALES
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Genera un comentario ESPECIFICO para un contenido real
 * Lee el contenido y genera una respuesta relevante usando Claude
 */
export async function generarComentarioEspecifico(contenido, perfil) {
  const anthropic = getAnthropicClient();
  const estilo = perfil.estiloEscritura;

  // Construir el prompt con toda la personalidad del perfil
  const prompt = `Sos ${perfil.nombre}, una persona de ${perfil.edad} anos de ${perfil.ubicacion}.
Tu personalidad: ${perfil.personalidad}
Llevas ${perfil.tiempoMiembro} en el Circulo de Duendes del Uruguay.

TU FORMA DE ESCRIBIR:
- Extension: ${estilo.extension} (${estilo.extension === 'corto' || estilo.extension === 'muy_corto' ? 'maximo 2-3 oraciones' : estilo.extension === 'largo' ? 'parrafos completos, expresiva' : '4-6 oraciones'})
- ${estilo.usaEmojis ? 'Usas emojis naturalmente pero no en exceso' : 'NO usas emojis nunca'}
- Tono: ${estilo.tono}
- Muletillas que usas naturalmente: "${estilo.muletillas.join('", "')}"

${perfil.guardianes.length > 0 ? `TUS GUARDIANES:
${perfil.guardianes.map(g => `- ${g.nombre} (tenes una conexion ${g.conexion} con el/ella)`).join('\n')}` : 'Todavia no tenes guardian pero estas buscando.'}

CONTEXTO PERSONAL: ${perfil.contexto}

EJEMPLOS DE COMO ESCRIBIS (para que entiendas tu voz):
${perfil.frasesEjemplo.map(f => `- "${f}"`).join('\n')}

LEISTE ESTE CONTENIDO:
"""
${contenido.titulo ? `Titulo: ${contenido.titulo}\n` : ''}${contenido.contenido || contenido.texto || contenido}
"""
${contenido.autor ? `\nEscrito por: ${contenido.autor}` : ''}

TAREA: Escribi un comentario natural de maximo 2-3 oraciones respondiendo a este contenido.

REGLAS CRITICAS:
- Escribi en espanol rioplatense (vos, tenes, podes)
- ${estilo.extension === 'corto' || estilo.extension === 'muy_corto' ? 'Se MUY breve, 1-2 oraciones maximo' : ''}
- Responde al contenido ESPECIFICO que leiste, no seas generico
- Usa tus muletillas naturalmente
- ${estilo.usaEmojis ? 'Podes usar 1-2 emojis si tiene sentido' : 'NO uses emojis'}
- NO uses frases de IA como "desde las profundidades", "brumas ancestrales", "velo entre mundos"
- Que suene como algo que VOS dirias
- Si el contenido menciona un guardian que tenes, podes relacionarlo con tu experiencia`;

  try {
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 300,
      messages: [
        { role: 'user', content: prompt }
      ]
    });

    const comentario = response.content[0].text.trim();

    // Validar que no tenga frases prohibidas
    const frasesProhibidas = [
      'desde las profundidades',
      'brumas ancestrales',
      'velo entre mundos',
      'tiempos inmemoriales',
      'vibraciones cosmicas',
      'campo energetico universal'
    ];

    const comentarioLower = comentario.toLowerCase();
    for (const frase of frasesProhibidas) {
      if (comentarioLower.includes(frase)) {
        // Regenerar si tiene frase prohibida
        return await generarComentarioEspecifico(contenido, perfil);
      }
    }

    return {
      success: true,
      comentario,
      perfil: {
        id: perfil.id,
        nombre: perfil.nombre,
        nombreCorto: perfil.nombreCorto,
        avatar: perfil.avatar,
        email: perfil.email
      }
    };

  } catch (error) {
    console.error('[MOTOR-INTERACCION] Error generando comentario:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Genera una conversacion completa del foro
 * Un post inicial + respuestas naturales entre perfiles
 */
export async function generarConversacionForo(tema, opciones = {}) {
  const anthropic = getAnthropicClient();
  const {
    categoria = 'general',
    cantidadRespuestas = 3,
    perfilAutor = null
  } = opciones;

  // Seleccionar autor del post
  const autor = perfilAutor || seleccionarPerfilSegunContexto({ tipo: 'experiencia', tema });
  const estiloAutor = autor.estiloEscritura;

  // Prompt para generar el post inicial
  const promptPost = `Sos ${autor.nombre}, de ${autor.edad} anos, ${autor.ubicacion}.
Personalidad: ${autor.personalidad}
Miembro hace: ${autor.tiempoMiembro}

TU ESTILO:
- Extension: ${estiloAutor.extension}
- ${estiloAutor.usaEmojis ? 'Usas emojis' : 'NO usas emojis'}
- Tono: ${estiloAutor.tono}
- Muletillas: "${estiloAutor.muletillas.join('", "')}"

${autor.guardianes.length > 0 ? `TUS GUARDIANES: ${autor.guardianes.map(g => g.nombre).join(', ')}` : ''}

CONTEXTO: ${autor.contexto}

EJEMPLOS DE TU VOZ:
${autor.frasesEjemplo.slice(0, 2).map(f => `- "${f}"`).join('\n')}

TEMA A DESARROLLAR: ${tema}
CATEGORIA DEL FORO: ${categoria}

GENERA un post para el foro del Circulo de Duendes del Uruguay.

FORMATO:
TITULO: [un titulo atractivo y natural, no generico]
CONTENIDO: [el contenido del post]

REGLAS:
- Espanol rioplatense (vos, tenes, podes)
- Que suene autentico, como algo que escribirias vos
- Invita a la conversacion (termina con pregunta o invitacion)
- NO uses frases de IA genericas
- Conecta con tus guardianes si tiene sentido`;

  try {
    // Generar post
    const responsePost = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 800,
      messages: [{ role: 'user', content: promptPost }]
    });

    const postTexto = responsePost.content[0].text;

    // Parsear titulo y contenido
    const tituloMatch = postTexto.match(/TITULO:\s*(.+)/i);
    const contenidoMatch = postTexto.match(/CONTENIDO:\s*([\s\S]+)/i);

    const titulo = tituloMatch ? tituloMatch[1].trim() : tema;
    const contenidoPost = contenidoMatch ? contenidoMatch[1].trim() : postTexto;

    // Generar respuestas
    const respuestas = [];
    const perfilesUsados = new Set([autor.id]);

    for (let i = 0; i < cantidadRespuestas; i++) {
      // Seleccionar perfil que no se haya usado
      let perfilRespuesta;
      let intentos = 0;
      do {
        perfilRespuesta = obtenerPerfilAleatorio();
        intentos++;
      } while (perfilesUsados.has(perfilRespuesta.id) && intentos < 10);

      if (perfilesUsados.has(perfilRespuesta.id)) continue;
      perfilesUsados.add(perfilRespuesta.id);

      // Construir contexto de respuesta (incluyendo respuestas anteriores)
      let contextoConversacion = `POST ORIGINAL por ${autor.nombreCorto}:\n"${contenidoPost}"`;

      if (respuestas.length > 0) {
        contextoConversacion += '\n\nRESPUESTAS ANTERIORES:';
        respuestas.forEach(r => {
          contextoConversacion += `\n- ${r.perfil.nombreCorto}: "${r.contenido}"`;
        });
      }

      const resultadoRespuesta = await generarComentarioEspecifico(
        { contenido: contextoConversacion, autor: autor.nombreCorto },
        perfilRespuesta
      );

      if (resultadoRespuesta.success) {
        respuestas.push({
          perfil: resultadoRespuesta.perfil,
          contenido: resultadoRespuesta.comentario,
          creadoEn: new Date(Date.now() + (i + 1) * 1000 * 60 * Math.floor(Math.random() * 30 + 5)).toISOString()
        });
      }

      // Pausa entre llamadas
      await new Promise(r => setTimeout(r, 500));
    }

    return {
      success: true,
      post: {
        titulo,
        contenido: contenidoPost,
        autor: {
          id: autor.id,
          nombre: autor.nombre,
          nombreCorto: autor.nombreCorto,
          avatar: autor.avatar,
          email: autor.email
        },
        categoria,
        creadoEn: new Date().toISOString()
      },
      respuestas
    };

  } catch (error) {
    console.error('[MOTOR-INTERACCION] Error generando conversacion:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Genera una respuesta empatica a un post de usuario REAL
 * Detecta el tono y necesidad del usuario y responde apropiadamente
 */
export async function responderAUsuarioReal(postUsuario) {
  const anthropic = getAnthropicClient();

  // Primero, analizar el post para elegir el mejor perfil
  const promptAnalisis = `Analiza este post de un usuario real del Circulo:

"${postUsuario.contenido}"

Responde en formato JSON:
{
  "tono": "alegre|triste|buscando_ayuda|compartiendo|preguntando|desahogandose",
  "necesita": "apoyo_emocional|consejo_practico|validacion|respuesta_informativa|celebracion",
  "guardian_mencionado": "nombre o null",
  "tema_principal": "breve descripcion"
}`;

  try {
    const analisis = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 200,
      messages: [{ role: 'user', content: promptAnalisis }]
    });

    let infoAnalisis;
    try {
      const textoAnalisis = analisis.content[0].text;
      const jsonMatch = textoAnalisis.match(/\{[\s\S]*\}/);
      infoAnalisis = jsonMatch ? JSON.parse(jsonMatch[0]) : {};
    } catch {
      infoAnalisis = { necesita: 'apoyo_emocional' };
    }

    // Seleccionar perfil apropiado
    let perfil;
    if (infoAnalisis.guardian_mencionado) {
      const perfilesConEsteGuardian = perfilesConGuardian(infoAnalisis.guardian_mencionado);
      if (perfilesConEsteGuardian.length > 0) {
        perfil = perfilesConEsteGuardian[Math.floor(Math.random() * perfilesConEsteGuardian.length)];
      }
    }

    if (!perfil) {
      // Seleccionar segun necesidad
      const mapeoPersonalidad = {
        'apoyo_emocional': ['emocional', 'matrona', 'sabia'],
        'consejo_practico': ['practica', 'herbolaria', 'organizadora'],
        'validacion': ['entusiasta', 'emocional', 'matrona'],
        'respuesta_informativa': ['esoterica_profesional', 'reflexivo', 'mistica'],
        'celebracion': ['entusiasta', 'joven_espiritual', 'artista']
      };

      const personalidadesApropiadas = mapeoPersonalidad[infoAnalisis.necesita] || ['entusiasta'];
      const perfilesFiltrados = MIEMBROS_FUNDADORES.filter(m =>
        personalidadesApropiadas.includes(m.personalidad)
      );

      perfil = perfilesFiltrados.length > 0
        ? perfilesFiltrados[Math.floor(Math.random() * perfilesFiltrados.length)]
        : obtenerPerfilAleatorio();
    }

    // Generar respuesta empatica
    const resultado = await generarComentarioEspecifico(
      {
        contenido: postUsuario.contenido,
        titulo: postUsuario.titulo,
        autor: postUsuario.autor?.nombre || 'Un miembro del Circulo'
      },
      perfil
    );

    return {
      ...resultado,
      analisis: infoAnalisis
    };

  } catch (error) {
    console.error('[MOTOR-INTERACCION] Error respondiendo a usuario real:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Orquesta toda la actividad del dia
 * Genera posts, comentarios y respuestas segun la fecha
 */
export async function generarActividadDiaria(fecha = new Date()) {
  const config = await obtenerConfiguracion();

  if (!config.activo) {
    return { success: false, mensaje: 'Sistema de actividad automatica desactivado' };
  }

  const diaSemana = fecha.getDay(); // 0=domingo, 6=sabado
  const esFinDeSemana = diaSemana === 0 || diaSemana === 6;

  // Determinar cantidad de interacciones
  const min = esFinDeSemana ? config.minInteraccionesFinDeSemana : config.minInteraccionesDia;
  const max = esFinDeSemana ? config.maxInteraccionesFinDeSemana : config.maxInteraccionesDia;
  const cantidadObjetivo = Math.floor(Math.random() * (max - min + 1)) + min;

  const resultados = {
    fecha: fecha.toISOString(),
    esFinDeSemana,
    objetivo: cantidadObjetivo,
    generados: {
      posts: [],
      comentarios: [],
      respuestasAUsuarios: []
    },
    errores: []
  };

  try {
    // 1. Obtener contenido publicado hoy para comentar
    const contenidoHoy = await obtenerContenidoPublicadoHoy(fecha);

    // 2. Obtener posts de usuarios reales sin respuesta
    const postsUsuariosSinRespuesta = await obtenerPostsUsuariosSinRespuesta();

    // 3. Distribuir interacciones
    let interaccionesRealizadas = 0;

    // Responder a usuarios reales (prioridad)
    for (const post of postsUsuariosSinRespuesta.slice(0, 3)) {
      if (interaccionesRealizadas >= cantidadObjetivo) break;
      if (Math.random() > config.probabilidadRespuestaUsuarioReal) continue;

      const respuesta = await responderAUsuarioReal(post);
      if (respuesta.success) {
        // Guardar respuesta en el foro
        await guardarRespuestaEnForo(post.id, respuesta);
        resultados.generados.respuestasAUsuarios.push({
          postId: post.id,
          perfil: respuesta.perfil.nombreCorto,
          preview: respuesta.comentario.slice(0, 100)
        });
        interaccionesRealizadas++;
      } else {
        resultados.errores.push({ tipo: 'respuesta_usuario', error: respuesta.error });
      }

      await new Promise(r => setTimeout(r, 1000));
    }

    // Comentar contenido publicado hoy
    for (const contenido of contenidoHoy.slice(0, 5)) {
      if (interaccionesRealizadas >= cantidadObjetivo) break;

      const perfil = seleccionarPerfilSegunContexto({
        guardian: contenido.guardian,
        tema: contenido.categoria
      });

      const comentario = await generarComentarioEspecifico(contenido, perfil);
      if (comentario.success) {
        await guardarComentarioEnPost(contenido.id, comentario);
        resultados.generados.comentarios.push({
          contenidoId: contenido.id,
          perfil: comentario.perfil.nombreCorto,
          preview: comentario.comentario.slice(0, 100)
        });
        interaccionesRealizadas++;
      } else {
        resultados.errores.push({ tipo: 'comentario', error: comentario.error });
      }

      await new Promise(r => setTimeout(r, 1000));
    }

    // Generar conversaciones nuevas si no llegamos al objetivo
    if (interaccionesRealizadas < cantidadObjetivo && config.generarConversaciones) {
      const temasConversacion = [
        'Mi experiencia con el ritual de luna llena',
        'Senales que recibi esta semana',
        'Como organizo mi altar',
        'Algo lindo que me paso con mi guardian',
        'Meditacion matutina: mi rutina',
        'Cristales que estoy usando',
        'Pregunta sobre conexion con guardianes',
        'Reflexiones de esta semana'
      ];

      const cantidadConversaciones = Math.min(2, Math.ceil((cantidadObjetivo - interaccionesRealizadas) / 4));

      for (let i = 0; i < cantidadConversaciones; i++) {
        const tema = temasConversacion[Math.floor(Math.random() * temasConversacion.length)];
        const categorias = ['general', 'guardianes', 'rituales', 'testimonios'];
        const categoria = categorias[Math.floor(Math.random() * categorias.length)];

        const conversacion = await generarConversacionForo(tema, {
          categoria,
          cantidadRespuestas: Math.min(config.maxComentariosPorPost, 3)
        });

        if (conversacion.success) {
          await guardarConversacionEnForo(conversacion);
          resultados.generados.posts.push({
            titulo: conversacion.post.titulo,
            autor: conversacion.post.autor.nombreCorto,
            respuestas: conversacion.respuestas.length
          });
          interaccionesRealizadas += 1 + conversacion.respuestas.length;
        } else {
          resultados.errores.push({ tipo: 'conversacion', error: conversacion.error });
        }

        await new Promise(r => setTimeout(r, 2000));
      }
    }

    resultados.interaccionesTotales = interaccionesRealizadas;
    resultados.success = true;

    // Guardar registro
    await guardarRegistroActividad(resultados);

    return resultados;

  } catch (error) {
    console.error('[MOTOR-INTERACCION] Error en actividad diaria:', error);
    resultados.success = false;
    resultados.errorGeneral = error.message;
    return resultados;
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// FUNCIONES AUXILIARES
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Obtiene la configuracion del sistema
 */
export async function obtenerConfiguracion() {
  const config = await kv.get('comunidad:actividad:config');
  return { ...CONFIG_DEFAULT, ...config };
}

/**
 * Guarda la configuracion del sistema
 */
export async function guardarConfiguracion(nuevaConfig) {
  const configActual = await obtenerConfiguracion();
  const configFinal = { ...configActual, ...nuevaConfig };
  await kv.set('comunidad:actividad:config', configFinal);
  return configFinal;
}

/**
 * Obtiene contenido publicado hoy
 */
async function obtenerContenidoPublicadoHoy(fecha) {
  const hoy = fecha.toISOString().split('T')[0];
  const contenido = [];

  // Obtener temas del foro de hoy
  const categorias = ['general', 'guardianes', 'rituales', 'luna', 'cristales', 'testimonios'];

  for (const cat of categorias) {
    const temas = await kv.get(`comunidad:temas:${cat}`) || [];
    const temasHoy = temas.filter(t => t.creadoEn?.startsWith(hoy));

    for (const tema of temasHoy) {
      const temaCompleto = await kv.get(`comunidad:tema:${tema.id}`);
      if (temaCompleto && !esBotPerfil(temaCompleto.autor?.email)) {
        contenido.push({
          id: tema.id,
          tipo: 'tema_foro',
          titulo: tema.titulo,
          contenido: temaCompleto.contenido,
          categoria: cat,
          autor: temaCompleto.autor?.nombre
        });
      }
    }
  }

  return contenido;
}

/**
 * Obtiene posts de usuarios reales sin respuesta
 */
async function obtenerPostsUsuariosSinRespuesta() {
  const posts = [];
  const categorias = ['general', 'guardianes', 'rituales', 'luna', 'cristales', 'testimonios'];

  for (const cat of categorias) {
    const temas = await kv.get(`comunidad:temas:${cat}`) || [];

    for (const tema of temas.slice(0, 10)) {
      if (tema.totalRespuestas === 0) {
        const temaCompleto = await kv.get(`comunidad:tema:${tema.id}`);
        if (temaCompleto && !esBotPerfil(temaCompleto.autor?.email)) {
          posts.push({
            id: tema.id,
            titulo: tema.titulo,
            contenido: temaCompleto.contenido,
            autor: temaCompleto.autor,
            categoria: cat,
            creadoEn: tema.creadoEn
          });
        }
      }
    }
  }

  // Ordenar por fecha, mas recientes primero
  posts.sort((a, b) => new Date(b.creadoEn) - new Date(a.creadoEn));

  return posts.slice(0, 5);
}

/**
 * Verifica si un email pertenece a un perfil bot
 */
function esBotPerfil(email) {
  if (!email) return false;
  return MIEMBROS_FUNDADORES.some(m => m.email === email);
}

/**
 * Guarda una respuesta en el foro
 */
async function guardarRespuestaEnForo(temaId, respuesta) {
  const tema = await kv.get(`comunidad:tema:${temaId}`);
  if (!tema) return;

  const nuevaRespuesta = {
    id: `resp_bot_${Date.now()}`,
    contenido: respuesta.comentario,
    autor: {
      email: respuesta.perfil.email,
      nombre: respuesta.perfil.nombre
    },
    corazones: [],
    reportes: [],
    esBot: true,
    creadoEn: new Date().toISOString()
  };

  const respuestas = await kv.get(`comunidad:respuestas:${temaId}`) || [];
  respuestas.push(nuevaRespuesta);
  await kv.set(`comunidad:respuestas:${temaId}`, respuestas);

  // Actualizar contador
  tema.totalRespuestas = respuestas.length;
  tema.ultimaRespuesta = nuevaRespuesta.creadoEn;
  await kv.set(`comunidad:tema:${temaId}`, tema);

  // Actualizar lista de categoria
  const temasCategoria = await kv.get(`comunidad:temas:${tema.categoria}`) || [];
  const idx = temasCategoria.findIndex(t => t.id === temaId);
  if (idx !== -1) {
    temasCategoria[idx].totalRespuestas = respuestas.length;
  }
  await kv.set(`comunidad:temas:${tema.categoria}`, temasCategoria);
}

/**
 * Guarda un comentario en un post
 */
async function guardarComentarioEnPost(postId, comentario) {
  // Similar a guardarRespuestaEnForo
  await guardarRespuestaEnForo(postId, comentario);
}

/**
 * Guarda una conversacion completa en el foro
 */
async function guardarConversacionEnForo(conversacion) {
  const { post, respuestas } = conversacion;

  // Crear el tema
  const nuevoTema = {
    id: `tema_bot_${Date.now()}`,
    categoria: post.categoria,
    titulo: post.titulo,
    contenido: post.contenido,
    autor: {
      email: post.autor.email,
      nombre: post.autor.nombre
    },
    corazones: [],
    vistas: Math.floor(Math.random() * 20) + 5,
    totalRespuestas: respuestas.length,
    fijado: false,
    reportes: [],
    esBot: true,
    creadoEn: post.creadoEn
  };

  await kv.set(`comunidad:tema:${nuevoTema.id}`, nuevoTema);

  // Agregar a lista de categoria
  const temas = await kv.get(`comunidad:temas:${post.categoria}`) || [];
  temas.unshift({
    id: nuevoTema.id,
    titulo: nuevoTema.titulo,
    autor: nuevoTema.autor.nombre,
    corazones: 0,
    vistas: nuevoTema.vistas,
    totalRespuestas: respuestas.length,
    fijado: false,
    creadoEn: nuevoTema.creadoEn
  });
  await kv.set(`comunidad:temas:${post.categoria}`, temas);

  // Guardar respuestas
  const respuestasFormateadas = respuestas.map((r, i) => ({
    id: `resp_bot_${Date.now()}_${i}`,
    contenido: r.contenido,
    autor: {
      email: r.perfil.email,
      nombre: r.perfil.nombre
    },
    corazones: [],
    reportes: [],
    esBot: true,
    creadoEn: r.creadoEn
  }));

  await kv.set(`comunidad:respuestas:${nuevoTema.id}`, respuestasFormateadas);
}

/**
 * Guarda registro de actividad diaria
 */
async function guardarRegistroActividad(resultados) {
  const fecha = resultados.fecha.split('T')[0];

  // Guardar registro del dia
  await kv.set(`comunidad:actividad:registro:${fecha}`, resultados);

  // Agregar a historial
  await kv.lpush('comunidad:actividad:historial', {
    fecha,
    interacciones: resultados.interaccionesTotales,
    posts: resultados.generados.posts.length,
    comentarios: resultados.generados.comentarios.length,
    respuestas: resultados.generados.respuestasAUsuarios.length,
    errores: resultados.errores.length
  });
  await kv.ltrim('comunidad:actividad:historial', 0, 99);
}

/**
 * Obtiene estadisticas de actividad
 */
export async function obtenerEstadisticasActividad() {
  const config = await obtenerConfiguracion();
  const historial = await kv.lrange('comunidad:actividad:historial', 0, 29) || [];

  const ultimaEjecucion = historial[0] || null;
  const totalInteracciones7dias = historial.slice(0, 7).reduce((sum, h) => sum + (h?.interacciones || 0), 0);
  const promedioInteracciones = historial.length > 0
    ? Math.round(historial.reduce((sum, h) => sum + (h?.interacciones || 0), 0) / historial.length)
    : 0;

  return {
    config,
    ultimaEjecucion,
    estadisticas: {
      totalInteracciones7dias,
      promedioInteracciones,
      diasRegistrados: historial.length
    },
    historial: historial.slice(0, 10)
  };
}

// Exportar todo
export default {
  generarComentarioEspecifico,
  generarConversacionForo,
  responderAUsuarioReal,
  generarActividadDiaria,
  obtenerConfiguracion,
  guardarConfiguracion,
  obtenerEstadisticasActividad
};
