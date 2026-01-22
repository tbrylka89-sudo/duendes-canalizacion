import { kv } from '@vercel/kv';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// Preguntas del Test del Guardian - DISEÑO DE CONVERSIÓN
// Cada pregunta tiene doble propósito: conectar emocionalmente + detectar perfil de compra
const PREGUNTAS = [
  // === PREGUNTA 1: ESPEJO INICIAL (detecta dolor sin preguntar directo) ===
  {
    id: 1,
    tipo: 'seleccion',
    mensaje: 'Hay personas que sienten que cargan con más de lo que les corresponde. Otras sienten que la vida les debe algo. ¿Cuál te suena más?',
    opciones: [
      { id: 'carga', texto: 'Cargo con todo y nadie me cuida a mí', categoria: 'proteccion', dolor: 'carga_emocional', intensidad: 'alta' },
      { id: 'esquiva', texto: 'Las cosas buenas siempre le pasan a otros', categoria: 'fortuna', dolor: 'mala_suerte', intensidad: 'media' },
      { id: 'vacio', texto: 'Tengo todo pero siento un vacío', categoria: 'sanacion', dolor: 'vacio_existencial', intensidad: 'alta' },
      { id: 'estancada', texto: 'Sé que puedo más pero algo me frena', categoria: 'transformacion', dolor: 'bloqueo', intensidad: 'media' }
    ]
  },
  // === PREGUNTA 2: MOMENTO DE VIDA (detecta urgencia y disposición) ===
  {
    id: 2,
    tipo: 'seleccion',
    mensaje: '¿En qué momento estás ahora?',
    opciones: [
      { id: 'crisis', texto: 'Atravesando algo difícil', momento: 'crisis', urgencia: 'alta', perfil_compra: 'vulnerable' },
      { id: 'transicion', texto: 'Cerrando un ciclo, abriendo otro', momento: 'transicion', urgencia: 'media', perfil_compra: 'buscador_activo' },
      { id: 'busqueda', texto: 'Buscando algo más, no sé qué', momento: 'busqueda', urgencia: 'baja', perfil_compra: 'curioso' },
      { id: 'estable', texto: 'Estable, pero quiero potenciar algo', momento: 'estable', urgencia: 'baja', perfil_compra: 'buscador_activo' }
    ]
  },
  // === PREGUNTA 3: ESPEJO PROFUNDO (valida el dolor) ===
  {
    id: 3,
    tipo: 'seleccion',
    mensaje: '¿Cuál de estas frases podrías haber dicho vos?',
    opciones: [
      { id: 'fuerte', texto: '"Estoy cansada de ser la fuerte para todos"', arquetipo: 'protectora_agotada', categoria: 'proteccion' },
      { id: 'merece', texto: '"A veces siento que no merezco cosas buenas"', arquetipo: 'autoestima_baja', categoria: 'amor_propio' },
      { id: 'repite', texto: '"Siempre termino en el mismo lugar"', arquetipo: 'patron_repetido', categoria: 'sanacion' },
      { id: 'tarde', texto: '"Siento que llego tarde a todo"', arquetipo: 'ansiosa', categoria: 'fortuna' }
    ]
  },
  // === PREGUNTA 4: QUÉ BUSCA (detecta categoría principal) ===
  {
    id: 4,
    tipo: 'seleccion',
    mensaje: 'Si un ser mágico pudiera ayudarte con UNA cosa, ¿cuál elegirías?',
    opciones: [
      { id: 'proteger', texto: 'Que me proteja y cuide mi energía', categoria: 'proteccion', intencion: 'proteccion' },
      { id: 'suerte', texto: 'Que me traiga suerte y oportunidades', categoria: 'fortuna', intencion: 'abundancia' },
      { id: 'sanar', texto: 'Que me ayude a soltar y sanar', categoria: 'sanacion', intencion: 'sanacion' },
      { id: 'amor', texto: 'Que abra mi corazón al amor', categoria: 'amor', intencion: 'amor' },
      { id: 'calma', texto: 'Que me traiga paz y calma', categoria: 'calma', intencion: 'bienestar' }
    ]
  },
  // === PREGUNTA 5: TEXTO LIBRE - DOLOR (análisis con IA) ===
  {
    id: 5,
    tipo: 'texto_libre',
    mensaje: 'Si pudieras contarle a alguien lo que de verdad te pesa... ¿qué le dirías?',
    placeholder: 'No hay respuesta incorrecta. Escribí lo que sientas...',
    analisis: ['dolor', 'urgencia', 'categoria']
  },
  // === PREGUNTA 6: EXPERIENCIA PREVIA (detecta familiaridad con el mundo místico) ===
  {
    id: 6,
    tipo: 'seleccion',
    mensaje: '¿Tenés experiencia con objetos o seres que te acompañen espiritualmente?',
    opciones: [
      { id: 'si_varios', texto: 'Sí, tengo varios y me encantan', experiencia: 'alta', perfil_compra: 'coleccionista' },
      { id: 'si_uno', texto: 'Tengo algo pero quiero más', experiencia: 'media', perfil_compra: 'expansion' },
      { id: 'no_pero', texto: 'No, pero siempre me llamó la atención', experiencia: 'baja', perfil_compra: 'primera_vez' },
      { id: 'esceptica', texto: 'Soy escéptica pero algo me trajo acá', experiencia: 'ninguna', perfil_compra: 'esceptico_curioso' }
    ]
  },
  // === PREGUNTA 7: ESTILO DE MENSAJE ===
  {
    id: 7,
    tipo: 'seleccion',
    mensaje: '¿Cómo preferís que te hablen?',
    opciones: [
      { id: 'directo', texto: 'Directo, sin vueltas', estilo: 'directo' },
      { id: 'suave', texto: 'Suave y contenedor', estilo: 'suave' },
      { id: 'poetico', texto: 'Poético y profundo', estilo: 'mistico' },
      { id: 'practico', texto: 'Práctico, con acciones claras', estilo: 'practico' }
    ]
  },
  // === PREGUNTA 8: BLOQUEO PRINCIPAL (detecta estilo de decisión) ===
  {
    id: 8,
    tipo: 'seleccion',
    mensaje: '¿Qué te frena más cuando algo te interesa?',
    opciones: [
      { id: 'que_diran', texto: 'El qué dirán / qué van a pensar', bloqueo: 'social', estilo_decision: 'emocional' },
      { id: 'dinero', texto: 'No tener la plata en este momento', bloqueo: 'economico', estilo_decision: 'racional' },
      { id: 'tiempo', texto: 'No tener tiempo para dedicarle', bloqueo: 'tiempo', estilo_decision: 'analitico' },
      { id: 'funciona', texto: 'No saber si realmente funciona', bloqueo: 'escepticismo', estilo_decision: 'analitico' }
    ]
  },
  // === PREGUNTA 9: ESTILO DE DECISIÓN ===
  {
    id: 9,
    tipo: 'seleccion',
    mensaje: 'Cuando algo te interesa de verdad, ¿qué hacés?',
    opciones: [
      { id: 'enseguida', texto: 'Lo compro/hago enseguida', decision: 'impulsivo', velocidad: 'rapido' },
      { id: 'pienso_dias', texto: 'Lo pienso unos días', decision: 'analitico', velocidad: 'medio' },
      { id: 'consulto', texto: 'Lo consulto con alguien', decision: 'emocional', velocidad: 'lento' },
      { id: 'investigo', texto: 'Investigo todo antes', decision: 'analitico', velocidad: 'lento' }
    ]
  },
  // === PREGUNTA 10: CREENCIAS (escala) ===
  {
    id: 10,
    tipo: 'escala',
    mensaje: '¿Creés en la energía de los objetos?',
    opciones: [
      { id: 'totalmente', texto: 'Totalmente', valor: 4, creencia: 'creyente', apertura: 90 },
      { id: 'a_veces', texto: 'A veces sí, a veces no', valor: 3, creencia: 'buscador', apertura: 60 },
      { id: 'no_mucho', texto: 'No mucho, pero algo hay', valor: 2, creencia: 'esceptico', apertura: 30 },
      { id: 'para_nada', texto: 'Para nada', valor: 1, creencia: 'esceptico', apertura: 10 }
    ]
  },
  // === PREGUNTA 11: NIVEL DE SUFRIMIENTO (escala 1-10) ===
  {
    id: 11,
    tipo: 'escala_numerica',
    mensaje: '¿Cuánto estás sufriendo ahora mismo?',
    min: 1,
    max: 10,
    minLabel: 'Tranquila',
    maxLabel: 'Mucho'
  },
  // === PREGUNTA 12: DURACIÓN DEL DOLOR ===
  {
    id: 12,
    tipo: 'seleccion',
    mensaje: 'Última: ¿hace cuánto te sentís así?',
    opciones: [
      { id: 'dias', texto: 'Hace días', duracion: 'dias', cronicidad: 0 },
      { id: 'semanas', texto: 'Hace semanas', duracion: 'semanas', cronicidad: 1 },
      { id: 'meses', texto: 'Hace meses', duracion: 'meses', cronicidad: 2 },
      { id: 'anios', texto: 'Hace años', duracion: 'anios', cronicidad: 3 }
    ]
  }
];

// Perfiles de compra y qué ofrecerles
const PERFILES_COMPRA = {
  vulnerable: {
    nombre: 'En momento sensible',
    enfoque: 'VALOR PRIMERO, no venta',
    oferta_principal: 'contenido_gratuito',
    oferta_secundaria: 'mini_accesible',
    mensaje: 'No te voy a vender nada. Primero quiero que sepas que no estás sola.',
    cta: 'Recibir mensaje de tu guardián (gratis)'
  },
  buscador_activo: {
    nombre: 'Lista para transformar',
    enfoque: 'Mostrar opciones completas',
    oferta_principal: 'guardian_canalizado',
    oferta_secundaria: 'pack_proteccion',
    mensaje: 'Estás lista. Tu guardián te está esperando.',
    cta: 'Conocer guardianes disponibles'
  },
  curioso: {
    nombre: 'Explorando',
    enfoque: 'Educar y nutrir',
    oferta_principal: 'mini_entrada',
    oferta_secundaria: 'newsletter_valor',
    mensaje: 'No tenés que decidir nada ahora. Solo escuchá lo que tu intuición dice.',
    cta: 'Ver guardianes de entrada'
  },
  coleccionista: {
    nombre: 'Ya conoce el mundo',
    enfoque: 'Mostrar piezas especiales',
    oferta_principal: 'pieza_unica',
    oferta_secundaria: 'maestro_mistico',
    mensaje: 'Tenemos piezas que no mostramos a todos. Vos ya sabés reconocerlas.',
    cta: 'Ver piezas exclusivas'
  },
  expansion: {
    nombre: 'Quiere crecer su familia',
    enfoque: 'Complementar lo que tiene',
    oferta_principal: 'guardian_complementario',
    oferta_secundaria: 'pack_familia',
    mensaje: 'Tu guardián actual va a estar feliz de tener compañía.',
    cta: 'Ver guardianes que complementan'
  },
  primera_vez: {
    nombre: 'Primera experiencia',
    enfoque: 'Guiar con cariño',
    oferta_principal: 'mini_especial',
    oferta_secundaria: 'guia_cuidado',
    mensaje: 'Tu primer guardián es especial. Te voy a ayudar a elegir el indicado.',
    cta: 'Empezar con un mini especial'
  },
  esceptico_curioso: {
    nombre: 'Escéptico pero abierto',
    enfoque: 'Sin presión, dejar que sienta',
    oferta_principal: 'contenido_valor',
    oferta_secundaria: 'mini_sin_compromiso',
    mensaje: 'No tenés que creer en nada. Solo notá qué sentiste al leer esto.',
    cta: 'Seguir explorando sin compromiso'
  }
};

// ===== ALGORITMO DE PERFILADO PSICOLÓGICO =====

/**
 * Detecta dolor principal del texto libre
 */
function detectarDolorDeTexto(texto) {
  if (!texto) return 'proposito';
  const t = texto.toLowerCase();

  if (t.includes('solo') || t.includes('sola') || t.includes('nadie') || t.includes('abandonad')) return 'soledad';
  if (t.includes('plata') || t.includes('dinero') || t.includes('trabajo') || t.includes('deuda')) return 'dinero';
  if (t.includes('enferm') || t.includes('dolor') || t.includes('cuerpo') || t.includes('salud')) return 'salud';
  if (t.includes('pareja') || t.includes('amor') || t.includes('relacion') || t.includes('familia')) return 'relaciones';
  return 'proposito';
}

/**
 * Calcula el perfil psicológico completo basado en las respuestas
 */
function calcularPerfilPsicologico(respuestas) {
  // === VULNERABILIDAD ===
  let vulnScore = 0;

  // Pregunta 2: momento de vida
  if (respuestas[2]?.momento === 'crisis') vulnScore += 40;
  else if (respuestas[2]?.momento === 'transicion') vulnScore += 20;

  // Pregunta 11: nivel de sufrimiento (1-10)
  const sufrimiento = respuestas[11]?.valor || 5;
  if (sufrimiento >= 8) vulnScore += 30;
  else if (sufrimiento >= 6) vulnScore += 20;
  else if (sufrimiento >= 4) vulnScore += 10;

  // Pregunta 12: duración del dolor
  const cronicidad = respuestas[12]?.cronicidad || 0;
  vulnScore += cronicidad * 10; // 0, 10, 20, o 30

  // Pregunta 5: texto libre - detectar palabras de aislamiento
  const textoLibre = respuestas[5]?.texto || '';
  if (textoLibre.toLowerCase().includes('solo') || textoLibre.toLowerCase().includes('nadie')) {
    vulnScore += 10;
  }

  const vulnerabilidad = {
    nivel: vulnScore > 70 ? 'alta' : vulnScore > 40 ? 'media' : 'baja',
    score: Math.min(vulnScore, 100),
    indicadores: []
  };

  if (respuestas[2]?.momento === 'crisis') vulnerabilidad.indicadores.push('crisis_actual');
  if (sufrimiento >= 7) vulnerabilidad.indicadores.push('sufrimiento_alto');
  if (cronicidad >= 2) vulnerabilidad.indicadores.push('dolor_cronico');

  // === DOLOR PRINCIPAL ===
  const dolorMap = {
    'carga': 'relaciones',
    'esquiva': 'soledad',
    'vacio': 'proposito',
    'estancada': 'dinero'
  };

  let tipoDolor = dolorMap[respuestas[1]?.id] || 'proposito';
  // Si hay texto libre, puede override
  const dolorTexto = detectarDolorDeTexto(textoLibre);
  if (textoLibre.length > 20) {
    tipoDolor = dolorTexto;
  }

  const dolor_principal = {
    tipo: tipoDolor,
    intensidad: sufrimiento * 10
  };

  // === ESTILO DE DECISIÓN ===
  const estiloDecisionMap = {
    'enseguida': 'impulsivo',
    'pienso_dias': 'analitico',
    'consulto': 'emocional',
    'investigo': 'analitico'
  };

  const velocidadMap = {
    'enseguida': 'rapido',
    'pienso_dias': 'medio',
    'consulto': 'lento',
    'investigo': 'lento'
  };

  const respuestaDecision = respuestas[9]?.id || 'consulto';
  const estilo_decision = {
    tipo: estiloDecisionMap[respuestaDecision] || 'emocional',
    velocidad: velocidadMap[respuestaDecision] || 'medio'
  };

  // Reforzar con pregunta 8 (bloqueos)
  if (respuestas[8]?.bloqueo === 'escepticismo' && estilo_decision.tipo !== 'impulsivo') {
    estilo_decision.tipo = 'analitico';
  }

  // === CREENCIAS ===
  const creenciasDefaults = { tipo: 'buscador', apertura: 50 };
  const creencias = respuestas[10] ? {
    tipo: respuestas[10].creencia || 'buscador',
    apertura: respuestas[10].apertura || 50
  } : creenciasDefaults;

  return {
    vulnerabilidad,
    dolor_principal,
    estilo_decision,
    creencias
  };
}

/**
 * Mapea perfil psicológico al tipo de cierre recomendado
 */
function perfilACierre(perfil) {
  // Prioridad: vulnerabilidad > creencias > estilo
  if (perfil.vulnerabilidad.nivel === 'alta') return 'vulnerable';
  if (perfil.creencias.tipo === 'esceptico') return 'esceptico';
  if (perfil.estilo_decision.tipo === 'impulsivo') return 'impulsivo';
  if (perfil.estilo_decision.tipo === 'analitico') return 'racional';
  if (perfil.creencias.tipo === 'creyente' && perfil.vulnerabilidad.nivel === 'baja') return 'coleccionista';
  return 'vulnerable'; // default
}

// GET: Retorna las preguntas del test
export async function GET() {
  return Response.json({
    success: true,
    preguntas: PREGUNTAS,
    version: '2.0'
  });
}

// POST: Procesa respuestas y genera resultado
export async function POST(request) {
  try {
    const { email, respuestas, nombre } = await request.json();

    if (!email || !respuestas) {
      return Response.json({ success: false, error: 'Faltan datos' }, { status: 400 });
    }

    // 1. Analizar respuestas de seleccion
    const analisis = analizarRespuestas(respuestas);

    // 2. Analizar texto libre con IA
    const textoLibreAnalisis = await analizarTextoLibre(
      respuestas[5]?.texto || '',
      respuestas[6]?.texto || '',
      nombre
    );

    // 3. Combinar analisis
    const resultado = combinarAnalisis(analisis, textoLibreAnalisis);

    // 4. NUEVO: Calcular perfil psicológico
    const perfilPsicologico = calcularPerfilPsicologico(respuestas);
    const perfilCierre = perfilACierre(perfilPsicologico);

    // 5. Generar revelacion emocional
    const revelacion = await generarRevelacion(resultado, nombre);

    // 6. Obtener recomendaciones de productos (simulado por ahora)
    const productosRecomendados = generarRecomendaciones(resultado);

    // 7. Construir resultado final
    const testGuardian = {
      fecha: new Date().toISOString(),
      version: '2.0',
      arquetipoPrincipal: resultado.arquetipoPrincipal,
      arquetipoSecundario: resultado.arquetipoSecundario,
      arquetipoDetalle: resultado.arquetipoScores,
      elemento: resultado.elemento,
      intencionPrincipal: resultado.intencion,
      categoriaPrincipal: resultado.categoria,
      dolorDetectado: textoLibreAnalisis.dolor_clave || [],
      deseosClave: textoLibreAnalisis.deseo_clave || [],
      estiloMensaje: resultado.estilo,
      productosRecomendados,
      revelacion,
      // NUEVO: Perfil psicológico completo
      perfilPsicologico,
      perfilCierre
    };

    // 8. Guardar en KV
    const userData = await kv.get(`user:${email}`) || await kv.get(`elegido:${email}`) || {};
    userData.testGuardian = testGuardian;
    userData.testGuardianRaw = respuestas;
    // NUEVO: Guardar perfil psicológico y cierre recomendado a nivel superior para fácil acceso
    userData.perfilPsicologico = perfilPsicologico;
    userData.perfilCierre = perfilCierre;

    if (userData.email) {
      await kv.set(`user:${email}`, userData);
    } else {
      await kv.set(`elegido:${email}`, { ...userData, email });
    }

    return Response.json({
      success: true,
      resultado: testGuardian
    });

  } catch (error) {
    console.error('Error en test-guardian:', error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}

// Analizar respuestas de seleccion - NUEVO SISTEMA
function analizarRespuestas(respuestas) {
  // Scores de categoría
  const categoriaScores = {
    proteccion: 0,
    fortuna: 0,
    sanacion: 0,
    transformacion: 0,
    amor: 0,
    amor_propio: 0,
    calma: 0
  };

  // Datos del perfil
  let perfilCompra = 'curioso';
  let momento = 'busqueda';
  let urgencia = 'baja';
  let experiencia = 'baja';
  let estilo = 'suave';
  let dolor = '';
  let arquetipo = '';
  let intensidad = 'media';

  // Pregunta 1: Espejo inicial (categoria + dolor + intensidad)
  if (respuestas[1]) {
    const r1 = respuestas[1];
    if (r1.categoria) categoriaScores[r1.categoria] += 30;
    dolor = r1.dolor || dolor;
    intensidad = r1.intensidad || intensidad;
  }

  // Pregunta 2: Momento de vida (perfil de compra + urgencia)
  if (respuestas[2]) {
    const r2 = respuestas[2];
    momento = r2.momento || momento;
    urgencia = r2.urgencia || urgencia;
    perfilCompra = r2.perfil_compra || perfilCompra;
  }

  // Pregunta 3: Espejo profundo (arquetipo + categoria)
  if (respuestas[3]) {
    const r3 = respuestas[3];
    arquetipo = r3.arquetipo || arquetipo;
    if (r3.categoria) categoriaScores[r3.categoria] += 25;
  }

  // Pregunta 4: Qué busca (categoria principal)
  if (respuestas[4]) {
    const r4 = respuestas[4];
    if (r4.categoria) categoriaScores[r4.categoria] += 35;
  }

  // Pregunta 6: Experiencia previa
  if (respuestas[6]) {
    const r6 = respuestas[6];
    experiencia = r6.experiencia || experiencia;
    // Ajustar perfil de compra si tiene más info
    if (r6.perfil_compra) perfilCompra = r6.perfil_compra;
  }

  // Pregunta 7: Estilo de mensaje
  if (respuestas[7]) {
    estilo = respuestas[7].estilo || estilo;
  }

  // Determinar categoría principal
  const categoriasSorted = Object.entries(categoriaScores).sort((a, b) => b[1] - a[1]);
  const categoriaPrincipal = categoriasSorted[0][0];
  const categoriaSecundaria = categoriasSorted[1][0];

  return {
    categoriaPrincipal,
    categoriaSecundaria,
    categoriaScores,
    perfilCompra,
    momento,
    urgencia,
    experiencia,
    estilo,
    dolor,
    arquetipo,
    intensidad
  };
}

// Analizar texto libre con IA
async function analizarTextoLibre(dolor, deseo, nombre) {
  if (!dolor && !deseo) {
    return { dolor_clave: [], deseo_clave: [], arquetipo_sugerido: null };
  }

  try {
    const prompt = `Analiza estas respuestas de ${nombre || 'una mujer'} en busqueda espiritual (35-65 años).

DOLOR EXPRESADO:
"${dolor}"

DESEO EXPRESADO:
"${deseo}"

Extrae en formato JSON:
{
  "dolor_clave": ["max 3 palabras clave del dolor"],
  "deseo_clave": ["max 3 palabras clave del deseo"],
  "arquetipo_sugerido": "victima|buscadora|repite_patrones|sanadora_herida|busca_amor|null",
  "intensidad_emocional": "alta|media|baja"
}

Solo responde con el JSON, nada mas.`;

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 300,
      messages: [{ role: 'user', content: prompt }]
    });

    const texto = response.content[0].text.trim();
    return JSON.parse(texto);
  } catch (error) {
    console.error('Error analizando texto:', error);
    return { dolor_clave: [], deseo_clave: [], arquetipo_sugerido: null };
  }
}

// Combinar analisis
function combinarAnalisis(analisis, textoLibre) {
  // Si el texto libre sugiere un arquetipo diferente, ajustar scores
  if (textoLibre.arquetipo_sugerido && analisis.arquetipoScores[textoLibre.arquetipo_sugerido] !== undefined) {
    analisis.arquetipoScores[textoLibre.arquetipo_sugerido] += 20;

    // Recalcular principal
    const sorted = Object.entries(analisis.arquetipoScores).sort((a, b) => b[1] - a[1]);
    analisis.arquetipoPrincipal = sorted[0][0];
    analisis.arquetipoSecundario = sorted[1][0];
  }

  return { ...analisis, ...textoLibre };
}

// Generar revelacion emocional con IA
async function generarRevelacion(resultado, nombre) {
  const arquetipoNombres = {
    victima: 'Alma en Busca de Refugio',
    buscadora: 'Eterna Buscadora',
    repite_patrones: 'Rompedora de Ciclos',
    sanadora_herida: 'Sanadora en Despertar',
    busca_amor: 'Corazon Abierto'
  };

  const elementoEmojis = {
    tierra: '🌿',
    agua: '🌊',
    fuego: '🔥',
    aire: '💨'
  };

  try {
    const prompt = `Genera una revelacion emocional para ${nombre || 'esta mujer'}.

PERFIL:
- Arquetipo principal: ${resultado.arquetipoPrincipal}
- Elemento: ${resultado.elemento}
- Dolor detectado: ${resultado.dolor_clave?.join(', ') || 'no especificado'}
- Deseo: ${resultado.deseo_clave?.join(', ') || 'no especificado'}

Escribe en español rioplatense (vos, tenes). Tono: calido, profundo, esperanzador. NO uses frases genericas de IA.

Formato JSON:
{
  "mensaje": "Mensaje principal de 60-80 palabras que toque el corazon",
  "mensaje_guardian": "Mensaje corto (40 palabras) como si fuera el guardian hablando en primera persona",
  "ritual_sugerido": "Un ritual simple de 1-2 oraciones"
}`;

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 500,
      messages: [{ role: 'user', content: prompt }]
    });

    const generated = JSON.parse(response.content[0].text.trim());

    return {
      titulo: arquetipoNombres[resultado.arquetipoPrincipal] || 'Alma Unica',
      subtitulo: `${elementoEmojis[resultado.elemento] || '✨'} ${resultado.elemento?.charAt(0).toUpperCase() + resultado.elemento?.slice(1)} + ${resultado.arquetipoPrincipal?.replace('_', ' ')}`,
      mensaje: generated.mensaje,
      mensajeGuardian: generated.mensaje_guardian,
      ritualSugerido: generated.ritual_sugerido,
      colorEnergetico: getColorByElemento(resultado.elemento)
    };
  } catch (error) {
    console.error('Error generando revelacion:', error);
    return {
      titulo: arquetipoNombres[resultado.arquetipoPrincipal] || 'Alma Unica',
      subtitulo: `${elementoEmojis[resultado.elemento] || '✨'} Tu esencia`,
      mensaje: 'Tu camino es unico y tu guardian te esta esperando. Lo que buscas ya vive dentro tuyo.',
      mensajeGuardian: 'Llegue porque me llamaste. Estoy aca para acompanarte.',
      ritualSugerido: 'Esta noche, antes de dormir, coloca una mano en tu corazon y respira profundo.',
      colorEnergetico: '#d4af37'
    };
  }
}

// Color por elemento
function getColorByElemento(elemento) {
  const colores = {
    tierra: '#56ab91',
    agua: '#4a90a4',
    fuego: '#e75480',
    aire: '#9b59b6'
  };
  return colores[elemento] || '#d4af37';
}

// Generar recomendaciones (placeholder - se puede conectar a WooCommerce)
function generarRecomendaciones(resultado) {
  const recomendaciones = {
    proteccion: [
      { nombre: 'Guardian de la Proteccion', matchScore: 95, razon: 'Especialista en crear escudos energeticos' },
      { nombre: 'Duende del Hogar Seguro', matchScore: 88, razon: 'Protege tu espacio sagrado' }
    ],
    abundancia: [
      { nombre: 'Guardian de la Abundancia', matchScore: 95, razon: 'Desbloquea el flujo de prosperidad' },
      { nombre: 'Hada del Oro Interior', matchScore: 85, razon: 'Trabaja con tu merecimiento' }
    ],
    amor: [
      { nombre: 'Guardian del Amor', matchScore: 95, razon: 'Abre el corazon a dar y recibir' },
      { nombre: 'Duende del Vinculo Sagrado', matchScore: 87, razon: 'Sana heridas de relaciones pasadas' }
    ],
    sanacion: [
      { nombre: 'Guardian Sanador', matchScore: 95, razon: 'Especialista en sanar heridas emocionales' },
      { nombre: 'Hada de la Paz Interior', matchScore: 90, razon: 'Trae calma a tu alma cansada' }
    ]
  };

  return recomendaciones[resultado.categoria] || recomendaciones.sanacion;
}
