import { kv } from '@vercel/kv';

export const dynamic = 'force-dynamic';

// ═══════════════════════════════════════════════════════════════════════════════
// API: SISTEMA DE PERFILADO DEL COMPRADOR
// Test que clasifica usuarios para personalizar la experiencia
// ═══════════════════════════════════════════════════════════════════════════════

// Preguntas del test de perfilado
const PREGUNTAS_PERFILADO = [
  {
    id: 'estado_actual',
    pregunta: '¿Cómo te sentís en este momento de tu vida?',
    tipo: 'single',
    opciones: [
      { valor: 'crisis', texto: 'Atravesando un momento difícil', vulnerabilidad: 3, impulsivo: 1 },
      { valor: 'busqueda', texto: 'Buscando algo nuevo, un cambio', vulnerabilidad: 2, impulsivo: 2 },
      { valor: 'curiosidad', texto: 'Con curiosidad, explorando', vulnerabilidad: 1, esceptico: 2 },
      { valor: 'estable', texto: 'Bien, pero abierta a crecer', vulnerabilidad: 1, analitico: 2 }
    ]
  },
  {
    id: 'dolor_principal',
    pregunta: '¿Qué es lo que más te gustaría transformar?',
    tipo: 'single',
    opciones: [
      { valor: 'soledad', texto: 'Sentirme menos sola/incomprendida', dolor: 'soledad', emocional: 2 },
      { valor: 'dinero', texto: 'Mi situación económica', dolor: 'dinero', analitico: 2 },
      { valor: 'salud', texto: 'Mi bienestar físico o emocional', dolor: 'salud', vulnerabilidad: 2 },
      { valor: 'relaciones', texto: 'Mis relaciones con otros', dolor: 'relaciones', emocional: 2 }
    ]
  },
  {
    id: 'decision',
    pregunta: 'Cuando algo te llama la atención, ¿cómo actuás?',
    tipo: 'single',
    opciones: [
      { valor: 'impulso', texto: 'Si me resuena, voy. Confío en mi intuición.', impulsivo: 3 },
      { valor: 'analisis', texto: 'Investigo, leo reseñas, lo pienso bien.', analitico: 3 },
      { valor: 'emocional', texto: 'Depende de cómo me haga sentir en el momento.', emocional: 3 },
      { valor: 'consulto', texto: 'Le pregunto a alguien de confianza qué opina.', vulnerabilidad: 1 }
    ]
  },
  {
    id: 'tiempo_libre',
    pregunta: '¿En qué invertís tu tiempo libre idealmente?',
    tipo: 'single',
    opciones: [
      { valor: 'naturaleza', texto: 'Conectar con la naturaleza', poderAdquisitivo: 2 },
      { valor: 'hobbies', texto: 'Hobbies creativos o artísticos', poderAdquisitivo: 2 },
      { valor: 'social', texto: 'Estar con amigos/familia', poderAdquisitivo: 1 },
      { valor: 'desarrollo', texto: 'Cursos, libros, crecimiento personal', poderAdquisitivo: 3 }
    ]
  },
  {
    id: 'espiritualidad',
    pregunta: '¿Cuál es tu relación con lo espiritual?',
    tipo: 'single',
    opciones: [
      { valor: 'creyente', texto: 'Creo firmemente en lo que no se ve', creencia: 'creyente', emocional: 2 },
      { valor: 'buscador', texto: 'Estoy explorando, abierta a todo', creencia: 'buscador', vulnerabilidad: 1 },
      { valor: 'esceptico', texto: 'Necesito pruebas, pero no descarto nada', creencia: 'esceptico', analitico: 2 },
      { valor: 'practico', texto: 'Me interesa lo que funciona, sin importar por qué', creencia: 'practico', impulsivo: 1 }
    ]
  },
  {
    id: 'inversion_bienestar',
    pregunta: '¿Cuánto solés invertir en tu bienestar al mes?',
    tipo: 'single',
    opciones: [
      { valor: 'poco', texto: 'Poco o nada, no es mi prioridad', poderAdquisitivo: 1 },
      { valor: 'moderado', texto: 'Algo, cuando puedo', poderAdquisitivo: 2 },
      { valor: 'regular', texto: 'Tengo un presupuesto fijo para esto', poderAdquisitivo: 3 },
      { valor: 'alto', texto: 'Es una prioridad, invierto lo que sea necesario', poderAdquisitivo: 4 }
    ]
  }
];

// Calcular perfil a partir de respuestas
function calcularPerfil(respuestas) {
  const scores = {
    vulnerabilidad: 0,
    impulsivo: 0,
    analitico: 0,
    emocional: 0,
    esceptico: 0,
    poderAdquisitivo: 0
  };

  let dolorPrincipal = null;
  let creencia = null;

  for (const [preguntaId, valor] of Object.entries(respuestas)) {
    const pregunta = PREGUNTAS_PERFILADO.find(p => p.id === preguntaId);
    if (!pregunta) continue;

    const opcion = pregunta.opciones.find(o => o.valor === valor);
    if (!opcion) continue;

    // Sumar scores
    if (opcion.vulnerabilidad) scores.vulnerabilidad += opcion.vulnerabilidad;
    if (opcion.impulsivo) scores.impulsivo += opcion.impulsivo;
    if (opcion.analitico) scores.analitico += opcion.analitico;
    if (opcion.emocional) scores.emocional += opcion.emocional;
    if (opcion.esceptico) scores.esceptico += opcion.esceptico;
    if (opcion.poderAdquisitivo) scores.poderAdquisitivo += opcion.poderAdquisitivo;

    // Capturar dolor y creencia
    if (opcion.dolor) dolorPrincipal = opcion.dolor;
    if (opcion.creencia) creencia = opcion.creencia;
  }

  // Calcular nivel de vulnerabilidad
  let nivelVulnerabilidad = 'baja';
  if (scores.vulnerabilidad >= 5) nivelVulnerabilidad = 'alta';
  else if (scores.vulnerabilidad >= 3) nivelVulnerabilidad = 'media';

  // Calcular estilo de decisión
  const estilosDecision = [
    { estilo: 'impulsivo', score: scores.impulsivo },
    { estilo: 'analitico', score: scores.analitico },
    { estilo: 'emocional', score: scores.emocional }
  ];
  const estiloDecision = estilosDecision.sort((a, b) => b.score - a.score)[0].estilo;

  // Calcular poder adquisitivo
  let poderAdquisitivo = 'bajo';
  if (scores.poderAdquisitivo >= 8) poderAdquisitivo = 'alto';
  else if (scores.poderAdquisitivo >= 5) poderAdquisitivo = 'medio';

  return {
    vulnerabilidad: nivelVulnerabilidad,
    dolorPrincipal: dolorPrincipal || 'general',
    estiloDecision,
    poderAdquisitivo,
    creencia: creencia || 'buscador',
    scores,
    calculadoEn: new Date().toISOString()
  };
}

// GET - Obtener preguntas del test
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email');

  // Si hay email, verificar si ya completó el test
  if (email) {
    const perfil = await kv.get(`perfilado:${email.toLowerCase()}`);
    if (perfil) {
      return Response.json({
        success: true,
        yaCompletado: true,
        perfil
      });
    }
  }

  return Response.json({
    success: true,
    yaCompletado: false,
    preguntas: PREGUNTAS_PERFILADO.map(p => ({
      id: p.id,
      pregunta: p.pregunta,
      tipo: p.tipo,
      opciones: p.opciones.map(o => ({
        valor: o.valor,
        texto: o.texto
      }))
    }))
  });
}

// POST - Guardar respuestas y calcular perfil
export async function POST(request) {
  try {
    const { email, respuestas, datosAdicionales } = await request.json();

    if (!email) {
      return Response.json({
        success: false,
        error: 'Email requerido'
      }, { status: 400 });
    }

    const emailNorm = email.toLowerCase().trim();

    // Calcular perfil
    const perfil = calcularPerfil(respuestas);

    // Agregar datos adicionales
    const perfilCompleto = {
      ...perfil,
      email: emailNorm,
      fechaNacimiento: datosAdicionales?.fechaNacimiento || null,
      genero: datosAdicionales?.genero || null, // 'ella', 'el', 'neutro'
      nombre: datosAdicionales?.nombre || null,
      respuestasOriginales: respuestas
    };

    // Guardar en KV
    await kv.set(`perfilado:${emailNorm}`, perfilCompleto);

    // Actualizar datos del usuario si existe
    const usuario = await kv.get(`elegido:${emailNorm}`) || await kv.get(`user:${emailNorm}`);
    if (usuario) {
      const usuarioActualizado = {
        ...usuario,
        perfil: perfilCompleto,
        perfilCompletado: true,
        genero: datosAdicionales?.genero || usuario.genero,
        fechaNacimiento: datosAdicionales?.fechaNacimiento || usuario.fechaNacimiento
      };

      if (await kv.get(`elegido:${emailNorm}`)) {
        await kv.set(`elegido:${emailNorm}`, usuarioActualizado);
      }
      if (await kv.get(`user:${emailNorm}`)) {
        await kv.set(`user:${emailNorm}`, usuarioActualizado);
      }
    }

    return Response.json({
      success: true,
      perfil: perfilCompleto,
      mensaje: 'Perfil calculado y guardado'
    });

  } catch (error) {
    console.error('[PERFILADO] Error:', error);
    return Response.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
