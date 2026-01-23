// ═══════════════════════════════════════════════════════════════════════════════
// GENERADOR DE CONTENIDO PARA EL CIRCULO
// Genera comentarios y posts en el estilo de cada perfil fundador
// ═══════════════════════════════════════════════════════════════════════════════

import {
  MIEMBROS_FUNDADORES,
  obtenerPerfilAleatorio,
  seleccionarPerfilSegunContexto
} from './miembros-fundadores.js';

// ═══════════════════════════════════════════════════════════════════════════════
// TEMPLATES DE COMENTARIOS POR TIPO
// ═══════════════════════════════════════════════════════════════════════════════

export const TEMPLATES_COMENTARIOS = {
  // Agradecimiento - comentarios breves de apoyo
  agradecimiento: {
    corto: [
      'Hermoso, gracias por compartir',
      'Me encanto!',
      'Gracias por esto',
      'Justo lo que necesitaba leer hoy',
      'Que lindo!',
      'Abrazo grande',
      'Gracias, gracias',
      'Me llego al corazon',
      'Hermoso mensaje'
    ],
    medio: [
      'Gracias por compartir esto con nosotras. Me llego mucho.',
      'Que lindo lo que escribiste. Se nota que viene del corazon.',
      'Necesitaba leer esto hoy. Gracias!',
      'Me encanta la energia de este grupo. Gracias por ser parte.',
      'Gracias por la sinceridad. Nos ayuda a todas.'
    ],
    largo: [
      'No sabes lo importante que es para mi leer esto. Estaba pasando un momento dificil y tus palabras me reconfortaron. Gracias de verdad.',
      'Cada vez que entro a este grupo me emociono. Gracias por compartir con tanta autenticidad. Somos tan afortunadas de tener esta comunidad.',
      'Gracias por abrirte asi. Se que no es facil. Tu experiencia me ayuda a entender la mia propia. Un abrazo enorme.'
    ]
  },

  // Pregunta - dudas genuinas
  pregunta: {
    basica: [
      'Alguien mas le pasa esto?',
      'Es normal sentir {emocion}?',
      'Como hacen ustedes con {tema}?',
      'Soy la unica que {experiencia}?',
      'Alguna tiene experiencia con {tema}?'
    ],
    desarrollada: [
      'Chicas, les quiero consultar algo que me tiene pensando. {contexto}. Ustedes que opinan?',
      'Perdon si es tonta la pregunta, pero recien empiezo con esto. {pregunta}. Que me recomiendan?',
      'Me pasa algo raro y queria saber si a otras les pasa. {situacion}. Es normal o deberia preocuparme?',
      'Estoy entre {opcion1} y {opcion2}. Ustedes que eligirian y por que?'
    ],
    profunda: [
      'Vengo pensando en algo y necesito la opinion del grupo. {reflexion}. Les paso algo similar? Como lo resolvieron?',
      'Estoy en un momento de mucha confusion y me encantaria escuchar sus experiencias. {situacion}. Alguien paso por algo parecido?'
    ]
  },

  // Experiencia - compartir vivencias personales
  experiencia: {
    breve: [
      'Hoy me paso algo lindo con {guardian}.',
      'Queria contarles que {experiencia}.',
      'Finalmente {logro}! Queria compartirlo.'
    ],
    narrativa: [
      'Les cuento algo que me paso esta semana. {narrativa}. No se si es coincidencia pero senti que debia compartirlo.',
      'Desde que tengo a {guardian}, algo cambio en mi. {cambio}. Alguien mas noto cambios asi?',
      'Anoche tuve un sueno muy raro. {sueno}. Ustedes que piensan que significa?'
    ],
    profunda: [
      'Necesito compartir esto aunque me cuesta. {historia}. Gracias por ser un espacio donde puedo decir estas cosas.',
      'Hace tiempo queria escribir esto pero no me animaba. {historia}. Me siento mas liviana de haberlo compartido.'
    ]
  },

  // Reflexion - pensamientos y observaciones
  reflexion: {
    corta: [
      'Interesante punto de vista.',
      'Eso me dejo pensando.',
      'Nunca lo habia visto asi.',
      'Coincido totalmente.'
    ],
    desarrollada: [
      'Lo que decis me hizo pensar en {pensamiento}. Es interesante ver como todo esta conectado.',
      'Me parece que hay algo importante en lo que compartis. {reflexion}. Quizas sea una senal.',
      'Tu experiencia me resono mucho. {conexion}. Gracias por hacerme ver esto.'
    ],
    filosofica: [
      'Pienso que {filosofia}. Pero cada camino es unico y valido.',
      'Es interesante como {observacion}. Me pregunto si {pregunta_retorica}.',
      'Siento que el universo nos manda estos mensajes por algo. {interpretacion}.'
    ]
  },

  // Consejo - ayuda practica o emocional
  consejo: {
    practico: [
      'Lo que a mi me funciona es {consejo}. Simple pero efectivo.',
      'Proba {consejo}. A mi me sirvio mucho.',
      'Un tip: {tip}. Cambio todo.',
      'Consejo practico: {consejo}.'
    ],
    emocional: [
      'Te entiendo perfectamente. {validacion}. Dale tiempo.',
      'Pase por algo similar. {experiencia_personal}. Vas a salir de esta.',
      'Confia en el proceso. {apoyo}. Estamos aca.',
      'Lo que sentis es completamente valido. {consuelo}.'
    ],
    experto: [
      'Desde mi experiencia con {tema}, te recomendaria {recomendacion}. Pero escucha tu intuicion.',
      'Energeticamente lo que describis podria ser {interpretacion}. Sugiero {consejo}.',
      'Esto que contas es muy comun cuando {contexto}. Lo ideal seria {solucion}.'
    ]
  },

  // Bienvenida - para nuevos miembros
  bienvenida: {
    simple: [
      'Bienvenida!',
      'Bienvenida al Circulo!',
      'Que lindo tenerte aca!'
    ],
    calorosa: [
      'Bienvenida! Aca estamos para lo que necesites.',
      'Que alegria que te sumes! Este grupo es un refugio, vas a ver.',
      'Bienvenida al Circulo! Pregunta lo que quieras, somos todas muy abiertas.',
      'Bienvenida! Espero que te sientas tan comoda como nos sentimos todas aca.'
    ],
    entusiasta: [
      'Ayyy bienvenida!! Que lindo que te sumaste! Ya vamos a estar charlando un monton, vas a ver!',
      'Bienvenida!! Aca encontraste tu lugar. Se nota que sos de las nuestras!'
    ]
  }
};

// ═══════════════════════════════════════════════════════════════════════════════
// TEMAS PARA POSTS DEL FORO
// ═══════════════════════════════════════════════════════════════════════════════

export const TEMAS_POSTS = {
  altares: [
    { titulo: 'Mi altar de {estacion}', tipo: 'compartir' },
    { titulo: 'Como organizan sus altares?', tipo: 'pregunta' },
    { titulo: 'Altar viajero - ideas?', tipo: 'pregunta' },
    { titulo: 'Finalmente arme mi rincon sagrado', tipo: 'compartir' },
    { titulo: 'Limpieza energetica del altar', tipo: 'pregunta' }
  ],
  experiencias: [
    { titulo: 'Sone con mi guardian anoche', tipo: 'experiencia' },
    { titulo: 'Senales que recibi esta semana', tipo: 'compartir' },
    { titulo: 'Primera semana con {guardian}', tipo: 'experiencia' },
    { titulo: 'Algo increible me paso hoy', tipo: 'experiencia' },
    { titulo: 'Mi guardian me ayudo a {logro}', tipo: 'experiencia' }
  ],
  rituales: [
    { titulo: 'Ritual de luna {fase}', tipo: 'pregunta' },
    { titulo: 'Comparto mi ritual matutino', tipo: 'compartir' },
    { titulo: 'Meditacion con cristales', tipo: 'compartir' },
    { titulo: 'Ritual de {proposito}', tipo: 'compartir' },
    { titulo: 'Que rituales hacen diariamente?', tipo: 'pregunta' }
  ],
  preguntas: [
    { titulo: 'Se puede tener mas de un guardian?', tipo: 'pregunta' },
    { titulo: 'Que significa si mi guardian {evento}?', tipo: 'pregunta' },
    { titulo: 'Como conectar con un guardian nuevo?', tipo: 'pregunta' },
    { titulo: 'Cual es su guardian favorito y por que?', tipo: 'pregunta' },
    { titulo: 'Cuanto tiempo tardan en sentir la conexion?', tipo: 'pregunta' }
  ],
  presentaciones: [
    { titulo: 'Hola! Soy nueva en el Circulo', tipo: 'presentacion' },
    { titulo: 'Me presento: {nombre} de {lugar}', tipo: 'presentacion' },
    { titulo: 'Llegue por recomendacion', tipo: 'presentacion' }
  ],
  general: [
    { titulo: 'Alguien siente la energia rara?', tipo: 'pregunta' },
    { titulo: 'Gracias a este grupo', tipo: 'agradecimiento' },
    { titulo: 'Encontre esto y pense en ustedes', tipo: 'compartir' },
    { titulo: 'Reflexiones de fin de semana', tipo: 'reflexion' }
  ]
};

// ═══════════════════════════════════════════════════════════════════════════════
// FUNCIONES DE GENERACION
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Genera el prompt de personalidad para Claude
 */
export function generarPromptPersonalidad(perfil) {
  const estilo = perfil.estiloEscritura;

  return `Sos ${perfil.nombre}, una mujer de ${perfil.edad} anos de ${perfil.ubicacion}.
Personalidad: ${perfil.personalidad}
Miembro del Circulo hace: ${perfil.tiempoMiembro}

TU FORMA DE ESCRIBIR:
- Extension: ${estilo.extension} (${estilo.extension === 'corto' ? 'maximo 2-3 oraciones' : estilo.extension === 'largo' ? 'parrafos completos, expresiva' : '4-6 oraciones'})
- ${estilo.usaEmojis ? 'Usas emojis naturalmente' : 'NO usas emojis'}
- Tono: ${estilo.tono}
- Puntuacion: ${estilo.puntuacion}
- Muletillas que usas: "${estilo.muletillas.join('", "')}"

${perfil.guardianes.length > 0 ? `TUS GUARDIANES:
${perfil.guardianes.map(g => `- ${g.nombre} (desde ${g.desde}, conexion: ${g.conexion})`).join('\n')}` : 'Todavia no tenes guardian pero estas buscando.'}

TUS INTERESES: ${perfil.intereses.join(', ')}

CONTEXTO PERSONAL: ${perfil.contexto}

EJEMPLOS DE COMO ESCRIBIS:
${perfil.frasesEjemplo.map(f => `- "${f}"`).join('\n')}

REGLAS IMPORTANTES:
- Escribi en espanol rioplatense (vos, tenes, podes)
- Mantene tu personalidad constante
- ${estilo.extension === 'corto' ? 'Se breve, no te extiendas' : ''}
- ${perfil.personalidad === 'silenciosa' ? 'Sos de pocas palabras pero carinosas' : ''}
- ${perfil.personalidad === 'entusiasta' ? 'Sos expresiva y calorosa' : ''}
- ${perfil.personalidad === 'mistica' ? 'Ves conexiones espirituales en todo' : ''}
- ${perfil.personalidad === 'practica' ? 'Vas al grano, das consejos utiles' : ''}`;
}

/**
 * Genera prompt para un comentario especifico
 */
export function generarPromptComentario(perfil, contexto) {
  const {
    tipoComentario = 'experiencia',
    contenidoOriginal = '',
    temaPost = '',
    guardian = null,
    respuestaA = null
  } = contexto;

  const promptPersonalidad = generarPromptPersonalidad(perfil);

  return `${promptPersonalidad}

TAREA: Escribi un comentario de tipo "${tipoComentario}"

${contenidoOriginal ? `CONTENIDO AL QUE RESPONDES:
"${contenidoOriginal}"` : ''}

${temaPost ? `TEMA DEL POST: ${temaPost}` : ''}

${guardian ? `GUARDIAN MENCIONADO: ${guardian}` : ''}

${respuestaA ? `ESTAS RESPONDIENDO A: "${respuestaA}"` : ''}

GENERA UN COMENTARIO NATURAL EN TU VOZ.
- No uses frases genericas de IA
- Que suene como algo que dirias vos
- ${perfil.estiloEscritura.extension === 'corto' ? 'Maximo 2-3 oraciones' : ''}
- Conecta con lo que leiste de forma personal`;
}

/**
 * Genera prompt para un post del foro
 */
export function generarPromptPost(perfil, contexto) {
  const {
    categoria = 'general',
    tipo = 'experiencia',
    tema = null,
    guardian = null
  } = contexto;

  const promptPersonalidad = generarPromptPersonalidad(perfil);

  const temaInfo = TEMAS_POSTS[categoria]?.[Math.floor(Math.random() * (TEMAS_POSTS[categoria]?.length || 1))];

  return `${promptPersonalidad}

TAREA: Escribi un post para el foro del Circulo

CATEGORIA: ${categoria}
TIPO DE POST: ${tipo}
${tema ? `TEMA: ${tema}` : ''}
${guardian ? `SOBRE EL GUARDIAN: ${guardian}` : ''}

GENERA:
1. Un titulo atractivo y natural (no generico)
2. El contenido del post

EL POST DEBE:
- Sonar autentico, como algo que realmente escribirias
- Invitar a la conversacion (terminar con pregunta o invitacion)
- ${perfil.estiloEscritura.extension === 'largo' ? 'Ser desarrollado, con detalles' : 'Ser conciso pero completo'}
- Usar tu voz y muletillas naturales
- No sonar a texto de IA

FORMATO DE RESPUESTA:
TITULO: [tu titulo]
CONTENIDO: [el contenido del post]`;
}

/**
 * Adapta un template al estilo del perfil
 */
export function adaptarTemplate(template, perfil, variables = {}) {
  let texto = template;

  // Reemplazar variables
  Object.entries(variables).forEach(([key, value]) => {
    texto = texto.replace(new RegExp(`{${key}}`, 'g'), value);
  });

  // Adaptar segun estilo
  const estilo = perfil.estiloEscritura;

  // Agregar muletilla al inicio ocasionalmente
  if (Math.random() > 0.5 && estilo.muletillas.length > 0) {
    const muletilla = estilo.muletillas[Math.floor(Math.random() * estilo.muletillas.length)];
    texto = `${muletilla.charAt(0).toUpperCase() + muletilla.slice(1)}, ${texto.charAt(0).toLowerCase() + texto.slice(1)}`;
  }

  // Agregar emojis si el perfil los usa
  if (estilo.usaEmojis && Math.random() > 0.4) {
    const emojis = ['!', '!'];
    texto = texto + ' ' + emojis[Math.floor(Math.random() * emojis.length)];
  }

  return texto;
}

/**
 * Selecciona template apropiado segun perfil y tipo
 */
export function seleccionarTemplate(tipo, subtipo, perfil) {
  const templates = TEMPLATES_COMENTARIOS[tipo]?.[subtipo] || TEMPLATES_COMENTARIOS[tipo]?.corto || [];

  if (templates.length === 0) return null;

  // Filtrar templates segun extension preferida del perfil
  const extension = perfil.estiloEscritura.extension;
  let candidatos = templates;

  if (extension === 'corto' && TEMPLATES_COMENTARIOS[tipo].corto) {
    candidatos = TEMPLATES_COMENTARIOS[tipo].corto;
  } else if (extension === 'largo' && TEMPLATES_COMENTARIOS[tipo].largo) {
    candidatos = TEMPLATES_COMENTARIOS[tipo].largo;
  }

  return candidatos[Math.floor(Math.random() * candidatos.length)];
}

/**
 * Genera comentario rapido (sin IA, usando templates)
 */
export function generarComentarioRapido(tipo, perfil, variables = {}) {
  // Determinar subtipo segun extension del perfil
  let subtipo = 'medio';
  if (perfil.estiloEscritura.extension === 'corto' || perfil.estiloEscritura.extension === 'muy_corto') {
    subtipo = 'corto';
  } else if (perfil.estiloEscritura.extension === 'largo' || perfil.estiloEscritura.extension === 'medio_largo') {
    subtipo = 'largo';
  }

  const template = seleccionarTemplate(tipo, subtipo, perfil);
  if (!template) return null;

  return adaptarTemplate(template, perfil, variables);
}

/**
 * Genera respuestas variadas para un post
 */
export function generarRespuestasPost(cantidadRespuestas, contextoPost) {
  const respuestas = [];
  const perfilesUsados = new Set();

  for (let i = 0; i < cantidadRespuestas; i++) {
    // Seleccionar perfil que no se haya usado
    let perfil;
    let intentos = 0;
    do {
      perfil = seleccionarPerfilSegunContexto({
        ...contextoPost,
        esRespuesta: true
      });
      intentos++;
    } while (perfilesUsados.has(perfil.id) && intentos < 10);

    if (perfilesUsados.has(perfil.id)) {
      perfil = obtenerPerfilAleatorio();
    }

    perfilesUsados.add(perfil.id);

    // Variar tipos de respuesta
    const tiposRespuesta = ['agradecimiento', 'experiencia', 'consejo', 'reflexion'];
    const tipoRespuesta = tiposRespuesta[i % tiposRespuesta.length];

    respuestas.push({
      perfil,
      tipo: tipoRespuesta,
      promptContexto: generarPromptComentario(perfil, {
        ...contextoPost,
        tipoComentario: tipoRespuesta
      })
    });
  }

  return respuestas;
}

/**
 * Genera contenido completo para un dia
 */
export function generarContenidoDia(fecha, opciones = {}) {
  const {
    minComentarios = 3,
    maxComentarios = 8,
    incluirPosts = true,
    categoriaPost = null
  } = opciones;

  const contenido = {
    fecha,
    comentarios: [],
    posts: []
  };

  // Generar comentarios
  const cantidadComentarios = Math.floor(Math.random() * (maxComentarios - minComentarios + 1)) + minComentarios;

  for (let i = 0; i < cantidadComentarios; i++) {
    const perfil = obtenerPerfilAleatorio();
    const tiposComentario = ['agradecimiento', 'experiencia', 'pregunta', 'reflexion'];
    const tipo = tiposComentario[Math.floor(Math.random() * tiposComentario.length)];

    contenido.comentarios.push({
      perfil,
      tipo,
      prompt: generarPromptComentario(perfil, { tipoComentario: tipo })
    });
  }

  // Generar post (opcional)
  if (incluirPosts && Math.random() > 0.3) {
    const perfil = seleccionarPerfilSegunContexto({ tipo: 'experiencia' });
    const categorias = Object.keys(TEMAS_POSTS);
    const categoria = categoriaPost || categorias[Math.floor(Math.random() * categorias.length)];

    contenido.posts.push({
      perfil,
      categoria,
      prompt: generarPromptPost(perfil, { categoria })
    });
  }

  return contenido;
}

// ═══════════════════════════════════════════════════════════════════════════════
// VALIDACION Y CALIDAD
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Valida que un comentario generado suene natural
 */
export function validarComentario(comentario, perfil) {
  const problemas = [];

  // Verificar longitud segun perfil
  const palabras = comentario.split(' ').length;
  if (perfil.estiloEscritura.extension === 'corto' && palabras > 30) {
    problemas.push('Demasiado largo para este perfil');
  }
  if (perfil.estiloEscritura.extension === 'largo' && palabras < 20) {
    problemas.push('Demasiado corto para este perfil');
  }

  // Verificar uso de emojis
  const tieneEmojis = /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]/u.test(comentario);
  if (perfil.estiloEscritura.usaEmojis && !tieneEmojis && Math.random() > 0.5) {
    problemas.push('Podria tener emojis');
  }
  if (!perfil.estiloEscritura.usaEmojis && tieneEmojis) {
    problemas.push('No deberia tener emojis');
  }

  // Verificar frases de IA
  const frasesProhibidas = [
    'desde las profundidades',
    'brumas ancestrales',
    'velo entre mundos',
    'tiempos inmemoriales',
    'vibraciones cosmicas'
  ];
  const comentarioLower = comentario.toLowerCase();
  frasesProhibidas.forEach(frase => {
    if (comentarioLower.includes(frase)) {
      problemas.push(`Contiene frase prohibida: "${frase}"`);
    }
  });

  return {
    esValido: problemas.length === 0,
    problemas
  };
}

// Exportar todo
export default {
  TEMPLATES_COMENTARIOS,
  TEMAS_POSTS,
  generarPromptPersonalidad,
  generarPromptComentario,
  generarPromptPost,
  adaptarTemplate,
  seleccionarTemplate,
  generarComentarioRapido,
  generarRespuestasPost,
  generarContenidoDia,
  validarComentario
};
