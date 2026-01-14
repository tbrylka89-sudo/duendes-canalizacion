/**
 * Test del Guardián v9 - Preguntas que erizan la piel
 * Estructura: Pasado → Presente → Futuro → Recuerdo Recurrente
 */

export const QUESTION_BLOCKS = {
  PASADO: 'pasado',
  PRESENTE: 'presente',
  FUTURO: 'futuro',
  CIERRE: 'cierre'
};

export const BASE_QUESTIONS = [
  // === BLOQUE 1: PASADO (preguntas 1-4) ===
  {
    id: 'infancia',
    block: QUESTION_BLOCKS.PASADO,
    step: 1,
    type: 'text',
    baseText: 'Cerrá los ojos un segundo. ¿Qué recuerdo de tu infancia aparece primero, sin que lo llames?',
    variations: [
      'Hay un recuerdo de cuando eras chica que vuelve solo. ¿Cuál es?',
      'Si tu infancia pudiera hablarte, ¿qué imagen te mostraría primero?',
      'Un momento de tu niñez que guardás aunque no sepas por qué...'
    ],
    placeholder: 'Dejá que venga solo, sin forzarlo...',
    hint: 'No hay respuesta correcta. Solo lo que aparezca.',
    analyzes: ['dolor_origen', 'patron_familiar']
  },
  {
    id: 'memoria_feliz',
    block: QUESTION_BLOCKS.PASADO,
    step: 2,
    type: 'text',
    baseText: 'Contame una memoria que te hace sonreír, aunque también duela un poco.',
    variations: [
      '¿Cuál es ese recuerdo que te da ternura y nostalgia al mismo tiempo?',
      'Hay algo del pasado que recordás con amor, aunque ya no esté. ¿Qué es?',
      'Un momento donde fuiste feliz de verdad, aunque hoy te cueste recrearlo...'
    ],
    placeholder: 'Puede ser grande o pequeño...',
    hint: 'La felicidad a veces viene mezclada con melancolía.',
    analyzes: ['necesidad_emocional', 'perdida']
  },
  {
    id: 'patron_familiar',
    block: QUESTION_BLOCKS.PASADO,
    step: 3,
    type: 'select',
    baseText: '¿Qué heredaste de tu familia que preferirías soltar?',
    options: [
      { id: 'miedo', label: 'El miedo a no ser suficiente', icon: '🌑' },
      { id: 'sacrificio', label: 'La creencia de que hay que sacrificarse', icon: '⚔️' },
      { id: 'silencio', label: 'El hábito de callar lo que sentís', icon: '🤐' },
      { id: 'control', label: 'La necesidad de tener todo bajo control', icon: '🎭' },
      { id: 'culpa', label: 'La culpa por ser feliz', icon: '⛓️' }
    ],
    analyzes: ['patron_generacional']
  },

  // === BLOQUE 2: PRESENTE (preguntas 4-7) ===
  {
    id: 'dolor_hoy',
    block: QUESTION_BLOCKS.PRESENTE,
    step: 4,
    type: 'text',
    baseText: 'Ahora, en este momento exacto: ¿qué es lo que más te pesa?',
    variations: [
      '¿Qué es eso que te duele HOY, no ayer, no mañana?',
      'Si pudieras sacar algo de tu pecho ahora mismo, ¿qué sería?',
      '¿Qué carga estás sosteniendo que nadie más ve?'
    ],
    placeholder: 'Lo que sea que necesites soltar...',
    hint: 'Este es un espacio seguro.',
    analyzes: ['dolor_actual', 'urgencia']
  },
  {
    id: 'cuerpo',
    block: QUESTION_BLOCKS.PRESENTE,
    step: 5,
    type: 'select',
    baseText: 'Tu cuerpo sabe cosas que tu mente ignora. ¿Dónde sentís que se acumula todo?',
    options: [
      { id: 'pecho', label: 'En el pecho, como un nudo', icon: '💔' },
      { id: 'garganta', label: 'En la garganta, palabras atrapadas', icon: '🗣️' },
      { id: 'estomago', label: 'En el estómago, un vacío o presión', icon: '🌀' },
      { id: 'espalda', label: 'En la espalda, como una carga', icon: '🏋️' },
      { id: 'cabeza', label: 'En la cabeza, pensamientos que no paran', icon: '💭' },
      { id: 'todo', label: 'En todo el cuerpo, un cansancio profundo', icon: '😔' }
    ],
    analyzes: ['sintoma_corporal']
  },
  {
    id: 'miedo_secreto',
    block: QUESTION_BLOCKS.PRESENTE,
    step: 6,
    type: 'text',
    baseText: '¿Qué es eso que te da miedo admitir, incluso a vos misma?',
    variations: [
      'Hay algo que no le contás a nadie. ¿Qué es?',
      '¿Cuál es el pensamiento que te avergüenza tener?',
      'Si pudieras confesar algo sin ser juzgada, ¿qué sería?'
    ],
    placeholder: 'Nadie más va a leer esto...',
    hint: 'Los guardianes no juzgan. Solo escuchan.',
    analyzes: ['miedo_profundo', 'verguenza']
  },
  {
    id: 'momento_vida',
    block: QUESTION_BLOCKS.PRESENTE,
    step: 7,
    type: 'select',
    baseText: 'Si tuvieras que definir dónde estás parada hoy en tu vida...',
    options: [
      { id: 'buscando', label: 'Buscando algo que todavía no encuentro', icon: '🔍' },
      { id: 'sanando', label: 'Sanando heridas que creí cerradas', icon: '💚' },
      { id: 'transicion', label: 'En medio de un cambio que me asusta y emociona', icon: '🦋' },
      { id: 'proteccion', label: 'Necesitando protección, estoy agotada', icon: '🛡️' },
      { id: 'despertar', label: 'Despertando a algo nuevo en mí', icon: '🌅' }
    ],
    analyzes: ['etapa_vital', 'necesidad_principal']
  },

  // === BLOQUE 3: FUTURO (preguntas 8-10) ===
  {
    id: 'pedido_universo',
    block: QUESTION_BLOCKS.FUTURO,
    step: 8,
    type: 'text',
    baseText: 'Si el universo estuviera escuchándote ahora mismo, ¿qué le pedirías?',
    variations: [
      '¿Qué le susurrarías a la luna si supieras que puede cumplirlo?',
      'Un deseo profundo, no material. ¿Cuál es?',
      'Si pudieras recibir UN regalo del universo, ¿qué sería?'
    ],
    placeholder: 'Pedí sin miedo, sin filtro...',
    hint: 'Los deseos más profundos merecen ser nombrados.',
    analyzes: ['deseo_profundo', 'intencion']
  },
  {
    id: 'vision_futuro',
    block: QUESTION_BLOCKS.FUTURO,
    step: 9,
    type: 'text',
    baseText: 'Imaginá que dentro de un año todo salió bien. ¿Cómo es tu vida? ¿Cómo te sentís?',
    variations: [
      'Si pudieras verte en un año, sanada y en paz, ¿qué estarías haciendo?',
      '¿Cómo sería despertar un día sintiéndote completa?',
      'Describime la versión de vos que querés ser...'
    ],
    placeholder: 'Soñá en voz alta...',
    hint: 'Lo que imaginás ya existe en algún lugar.',
    analyzes: ['vision', 'aspiracion']
  },
  {
    id: 'estilo_magia',
    block: QUESTION_BLOCKS.FUTURO,
    step: 10,
    type: 'select',
    baseText: '¿Cómo preferís que tu guardián se comunique con vos?',
    options: [
      { id: 'directo', label: 'Directo y claro, sin vueltas', icon: '⚡' },
      { id: 'suave', label: 'Suave y contenedor, con paciencia', icon: '🌸' },
      { id: 'mistico', label: 'Místico y poético, con símbolos', icon: '🌙' },
      { id: 'practico', label: 'Práctico, con acciones concretas', icon: '🔧' }
    ],
    analyzes: ['estilo_comunicacion']
  },

  // === BLOQUE 4: CIERRE (pregunta final) ===
  {
    id: 'recuerdo_recurrente',
    block: QUESTION_BLOCKS.CIERRE,
    step: 11,
    type: 'text',
    baseText: 'Última pregunta. Hay un recuerdo que vuelve una y otra vez, sin que lo llames. ¿Cuál es? No importa si es triste o feliz.',
    variations: [
      'Esa escena que se repite en tu mente cuando estás sola. ¿Cuál es?',
      '¿Qué momento de tu vida aparece en tus sueños o pensamientos sin invitación?',
      'El recuerdo que no te suelta, aunque hayan pasado años...'
    ],
    placeholder: 'Este recuerdo tiene un mensaje para vos...',
    hint: 'Lo que vuelve sin ser llamado, tiene algo que enseñarte.',
    analyzes: ['tema_central', 'mensaje_inconsciente'],
    isFinal: true
  }
];

// Prompt para que Claude genere variaciones personalizadas
export const QUESTION_GENERATION_PROMPT = `Sos parte del Test del Guardián, una experiencia mística y emocional.

CONTEXTO DE LA PERSONA:
- Nombre: {nombre}
- Respuestas anteriores: {respuestas_previas}

PREGUNTA BASE A PERSONALIZAR:
"{pregunta_base}"

INSTRUCCIONES:
1. Generá una variación de esta pregunta que se sienta PERSONAL para esta persona
2. Si mencionó algo específico en respuestas anteriores, hacé referencia sutil
3. Mantené el tono: íntimo, rioplatense (vos/tenés), emocional pero no cursi
4. La pregunta debe erizar la piel, tocar fibras profundas
5. NO uses frases genéricas de IA ("en lo profundo de tu ser", "brumas ancestrales", etc.)
6. Máximo 2 oraciones

PROHIBIDO:
- Frases hechas o clichés espirituales
- Tono condescendiente o predicador
- Más de 2 oraciones
- Emojis en la pregunta (solo en opciones si aplica)

Respondé SOLO con la pregunta personalizada, nada más.`;

// Prompt para analizar respuestas y generar resultado
export const RESULT_GENERATION_PROMPT = `Sos un canalizador de guardianes místicos. Acabás de recibir las respuestas del Test del Guardián.

DATOS DE LA PERSONA:
- Nombre: {nombre}
- País: {pais}
- Edad aproximada: {edad}

RESPUESTAS DEL TEST:
{respuestas_completas}

INSTRUCCIONES:
Analizá profundamente estas respuestas y generá:

1. DOLOR PRINCIPAL DETECTADO: ¿Qué le duele realmente a esta persona? (1 oración)
2. NECESIDAD OCULTA: ¿Qué necesita pero no sabe pedir? (1 oración)
3. PATRÓN IDENTIFICADO: ¿Qué ciclo repite? (1 oración)
4. GUARDIÁN RECOMENDADO: Elegí UNO de estos y explicá por qué:
   - Guardian de la Sanación (para heridas emocionales profundas)
   - Guardian de la Protección (para quienes cargan demasiado)
   - Guardian de la Abundancia (para bloqueos con recibir/merecer)
   - Guardian del Amor (para heridas relacionales)
   - Guardian del Camino (para quienes están perdidas)

5. REVELACIÓN EMOCIONAL: Un párrafo de 3-4 oraciones que la haga sentir VISTA.
   Usá detalles específicos de sus respuestas. Que sienta "¿cómo sabe esto?"
   Tono: íntimo, validador, empático. NO predicador.

6. FRASE SELLADA: Una frase corta y poderosa que pueda guardar. Máximo 10 palabras.

7. RITUAL SUGERIDO: Una práctica simple que pueda hacer esta noche (2-3 oraciones).

8. POR QUÉ ESTE GUARDIÁN: 3 razones específicas basadas en sus respuestas.

Respondé en formato JSON válido:
{
  "dolor_principal": "...",
  "necesidad_oculta": "...",
  "patron": "...",
  "guardian": {
    "tipo": "sanacion|proteccion|abundancia|amor|camino",
    "nombre": "Guardian de la...",
    "razon_match": "..."
  },
  "revelacion": "...",
  "frase_sellada": "...",
  "ritual": "...",
  "razones": ["...", "...", "..."]
}`;

// Categorías de guardianes con sus atributos
export const GUARDIANS = {
  sanacion: {
    nombre: 'El Guardián de la Sanación',
    elemento: 'agua',
    color: '#4ECDC4',
    palabras_clave: ['herida', 'dolor', 'sanar', 'soltar', 'perdonar'],
    mensaje_tipo: 'Las heridas que cargás no son tu identidad. Son cicatrices de batallas que ganaste por sobrevivir.'
  },
  proteccion: {
    nombre: 'El Guardián de la Protección',
    elemento: 'tierra',
    color: '#00a8ff',
    palabras_clave: ['cansancio', 'carga', 'sostener', 'agotamiento', 'límites'],
    mensaje_tipo: 'Proteger a otros sin protegerte a vos misma es una forma de abandono. Llegó el momento de ponerte primero.'
  },
  abundancia: {
    nombre: 'El Guardián de la Abundancia',
    elemento: 'fuego',
    color: '#FFD700',
    palabras_clave: ['merecer', 'dinero', 'recibir', 'escasez', 'bloqueo'],
    mensaje_tipo: 'El universo no tiene límites para dar. El límite está en cuánto te permitís recibir.'
  },
  amor: {
    nombre: 'El Guardián del Amor',
    elemento: 'aire',
    color: '#FF6B9D',
    palabras_clave: ['relación', 'pareja', 'soledad', 'traición', 'confianza'],
    mensaje_tipo: 'El amor que buscás afuera es el reflejo del que todavía no te das a vos misma.'
  },
  camino: {
    nombre: 'El Guardián del Camino',
    elemento: 'eter',
    color: '#9B59B6',
    palabras_clave: ['perdida', 'propósito', 'rumbo', 'confusión', 'sentido'],
    mensaje_tipo: 'No estás perdida. Estás en el exacto lugar donde necesitás estar para encontrarte.'
  }
};

// Helper para obtener pregunta por step
export function getQuestionByStep(step) {
  return BASE_QUESTIONS.find(q => q.step === step);
}

// Helper para obtener total de preguntas
export function getTotalQuestions() {
  return BASE_QUESTIONS.length;
}

// Helper para analizar texto y detectar palabras clave
export function analyzeTextForKeywords(text) {
  const keywords = {
    dolor: [],
    emocion: [],
    patron: []
  };

  const textLower = text.toLowerCase();

  // Palabras de dolor
  const dolorWords = ['duele', 'dolor', 'sufro', 'cansa', 'agota', 'pesa', 'angustia', 'ansiedad', 'miedo', 'culpa', 'verguenza', 'soledad', 'abandono', 'traicion'];
  dolorWords.forEach(w => {
    if (textLower.includes(w)) keywords.dolor.push(w);
  });

  // Palabras de emoción
  const emocionWords = ['amor', 'feliz', 'paz', 'tranquila', 'libre', 'fuerte', 'valiente', 'esperanza'];
  emocionWords.forEach(w => {
    if (textLower.includes(w)) keywords.emocion.push(w);
  });

  // Palabras de patrón
  const patronWords = ['siempre', 'nunca', 'otra vez', 'de nuevo', 'repite', 'igual que', 'como mi madre', 'como mi padre'];
  patronWords.forEach(w => {
    if (textLower.includes(w)) keywords.patron.push(w);
  });

  return keywords;
}
