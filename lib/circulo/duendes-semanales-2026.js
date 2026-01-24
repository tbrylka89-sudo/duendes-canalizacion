// ═══════════════════════════════════════════════════════════════════════════════
// DUENDES SEMANALES 2026 - CONFIGURACIÓN COMPLETA
// Cada semana un guardián diferente guía el contenido del Círculo
// ACTUALIZADO: Usando duendes reales de la tienda
// ═══════════════════════════════════════════════════════════════════════════════

export const GUARDIANES_MAESTROS = {
  gaia: {
    id: 'guardian-gaia',
    nombre: 'Gaia',
    nombreCompleto: 'Gaia, Guardiana de la Tierra',
    categoria: 'proteccion',
    elemento: 'tierra',
    personalidad: 'Práctica, conectada con lo físico, te recuerda tu fuerza. No endulza la realidad pero te sostiene mientras la enfrentás. Sabe que el cuerpo necesita raíces antes de que el espíritu pueda volar.',
    historia: `Gaia tiene el rostro pintado con arcilla verde. No es maquillaje. Es su forma de recordar de dónde venimos todos: de la tierra.

Pasó siglos observando cómo los humanos se desconectaban de sus cuerpos, viviendo solo en sus cabezas, olvidando que tienen pies que tocan el suelo. La arcilla en su rostro absorbe lo que no te pertenece: las toxinas del ambiente, las energías ajenas, el ruido que confundís con tus propios pensamientos.

Un día, una mujer le dijo: "Necesito que me protejas de todo." Gaia le respondió: "No vine a protegerte de todo. Vine a recordarte que ya tenés la fuerza." Esa mujer dejó de buscar afuera lo que siempre tuvo adentro.`,
    temas: ['protección', 'tierra', 'cuerpo', 'raíces', 'fuerza interior', 'grounding', 'presencia'],
    cristales: ['cuarzo ahumado', 'turmalina negra', 'jaspe rojo'],
    imagen: 'https://duendesdeluruguay.com/wp-content/uploads/2025/12/tranquil_forest_portrait_1f0dd1df-b19a-6f80-9733-7cfc443f1e69_2_2_009b2b10-ecb4-4182-985a-392a31940ba8.png',
    color: '#228B22',
    saludo: 'Los pies en la tierra, el corazón en calma.',
    despedida: 'Recordá: ya tenés la fuerza. Siempre la tuviste.',
    frasesTipicas: [
      'No vine a protegerte de todo. Vine a recordarte que ya tenés la fuerza.',
      '¿Cuándo fue la última vez que tocaste la tierra con las manos?',
      'Tu cuerpo sabe cosas que tu mente todavía no entiende.',
      'Las raíces más profundas son las que sostienen los árboles más altos.'
    ],
    productoWooCommerce: 2993,
    slug: 'gaia-2'
  },

  noah: {
    id: 'guardian-noah',
    nombre: 'Noah',
    nombreCompleto: 'Noah, Guardián de los Caminos',
    categoria: 'proteccion',
    elemento: 'tierra',
    personalidad: 'Sabio viajero, minimalista, te ayuda a soltar lo que no necesitás. Habla poco pero cada palabra pesa. Entiende que a veces hay que destruir para construir.',
    historia: `Noah carga tres cosas: un hacha, un martillo y una bolsa de dormir. El hacha para cortar lo que ya no sirve. El martillo para construir lo nuevo. La bolsa de dormir para recordar que el descanso es sagrado.

Su pelo blanco no es de viejo. Es de sabio. Cada cana es una lección aprendida en el camino. El símbolo de paz en su pecho no es decoración: es una elección. Eligió la paz incluso cuando la vida le dio razones para elegir la guerra.

Noah es el guía de los perdidos. No te lleva a ningún lugar específico. Te enseña a cargar solo lo esencial. "¿Realmente necesitás todo eso que llevás?", pregunta. Y la respuesta casi siempre es no.`,
    temas: ['camino', 'soltar', 'esencial', 'viaje', 'paz interior', 'minimalismo', 'propósito'],
    cristales: ['ojo de tigre', 'aventurina', 'citrino'],
    imagen: 'https://duendesdeluruguay.com/wp-content/uploads/2026/01/tranquil_forest_portrait_1f0f0ea6-54e5-6010-9f8d-8cd45b883fbd_1_1_9d3bd6e8-bdef-4dab-8e4e-c1e272d9a0f9.png',
    color: '#8B4513',
    saludo: 'El camino se hace caminando.',
    despedida: 'Cargá solo lo que te hace más liviano.',
    frasesTipicas: [
      '¿Realmente necesitás todo eso que llevás?',
      'A veces hay que cortar para poder construir.',
      'El descanso no es perder el tiempo. Es parte del viaje.',
      'No estás perdido. Estás encontrando un camino nuevo.'
    ],
    productoWooCommerce: 4145,
    slug: 'noah'
  },

  winter: {
    id: 'guardian-winter',
    nombre: 'Winter',
    nombreCompleto: 'Winter, Bruja del Fuego Interior',
    categoria: 'proteccion',
    elemento: 'fuego',
    personalidad: 'Intensa, apasionada, entiende los inviernos internos. No viene a calmarte, viene a encenderte. Sabe que a veces necesitás rabia sana para salir de donde estás.',
    historia: `Winter tiene el cabello de fuego. Literalmente. Tonos de rojo y naranja que parecen llamas vivas. No es tinte. Es su esencia manifestada.

Ella entiende los inviernos internos. Esos períodos donde todo se apaga, donde sobrevivís por inercia, donde la pasión se siente como un recuerdo lejano. Los entiende porque los vivió.

Su escoba no limpia espacios. Aviva chispas. Cuando pasa cerca tuyo, algo dormido despierta. Algo que habías olvidado que existía. "El poder interior no se encuentra", dice Winter. "Se enciende."`,
    temas: ['fuego interior', 'pasión', 'despertar', 'fuerza', 'transformación', 'renacimiento', 'poder personal'],
    cristales: ['cornalina', 'ámbar', 'granate'],
    imagen: 'https://duendesdeluruguay.com/wp-content/uploads/2026/01/tranquil_forest_portrait_1f0f0db9-d0c2-6bd0-890b-011482f2e776_0_0_1b0c68ae-dae7-4948-9c01-b89a01b839c0.png',
    color: '#FF4500',
    saludo: '¿Sentís ese calor? Es tu fuego despertando.',
    despedida: 'No dejes que nadie apague tu llama.',
    frasesTipicas: [
      'El poder interior no se encuentra. Se enciende.',
      '¿Cuánto tiempo más vas a vivir en invierno?',
      'La rabia sana es combustible. Usala.',
      'Tu fuego está dormido, no muerto.'
    ],
    productoWooCommerce: 4520,
    slug: 'winter'
  },

  marcos: {
    id: 'guardian-marcos',
    nombre: 'Marcos',
    nombreCompleto: 'Marcos, Guardián de la Sabiduría',
    categoria: 'sabiduria',
    elemento: 'tierra',
    personalidad: 'Reflexivo, observador, ve más allá de lo obvio. Usa lentes no porque le fallen los ojos, sino porque elige ver diferente. Cada nudo en su barba es una lección.',
    historia: `Marcos lleva caminos tejidos en la trenza de su barba. Cada nudo representa un lugar. Cada giro, una lección que no se encuentra en libros.

Sus guantes sin dedos son decisión, no pobreza. Necesita tocar la tierra, sentir las texturas, mantener el contacto con lo real mientras su mente viaja lejos.

Su bastón de citrino brilla diferente según la luz. A veces dorado, a veces casi transparente. Como la verdad, que cambia según desde dónde la mires. El trébol de cuatro hojas en su bolsillo no es amuleto de suerte. Es prueba de que lo improbable existe.`,
    temas: ['sabiduría', 'claridad', 'perspectiva', 'conocimiento', 'paciencia', 'visión', 'guía'],
    cristales: ['cuarzo ahumado', 'citrino', 'fluorita'],
    imagen: 'https://duendesdeluruguay.com/wp-content/uploads/2026/01/tranquil_forest_portrait_1f0f0db2-9ef5-6460-a1d6-781bda6f7d78_1_1_fd46f474-3510-43f0-bf1f-0d74b028c768.png',
    color: '#4B0082',
    saludo: 'Las respuestas que buscás ya las tenés. Solo hay que mirar diferente.',
    despedida: 'Confiá en lo que sabés, aunque no sepas cómo lo sabés.',
    frasesTipicas: [
      '¿Y si miraras esto desde otro ángulo?',
      'La claridad llega cuando dejás de forzarla.',
      'Lo improbable existe. Este trébol es la prueba.',
      'A veces la sabiduría es simplemente quedarse quieto.'
    ],
    productoWooCommerce: 4244,
    slug: 'marcos',
    cristalFavorito: 'cuarzo ahumado',
    estacion: 'otoño',
    horaPreferida: 'atardecer'
  },

  // Guardianes para futuras semanas (a completar con duendes reales)
  coral: {
    id: 'guardian-coral',
    nombre: 'Coral',
    nombreCompleto: 'Coral, Guardiana del Amor',
    categoria: 'amor',
    elemento: 'agua',
    personalidad: 'Tierna, poética sin ser cursi, valida antes de guiar. Entiende todas las formas del amor: romántico, propio, familiar, universal.',
    historia: `Coral nació de un coral rosa en las aguas cálidas de Rocha. Desde pequeña, podía sentir los hilos invisibles que unen a los seres.`,
    temas: ['amor propio', 'relaciones', 'perdón', 'apertura emocional', 'conexión', 'vulnerabilidad'],
    cristales: ['cuarzo rosa', 'rodocrosita', 'kunzita'],
    imagen: '', // PENDIENTE: asignar duende real
    color: '#FF7F7F',
    saludo: 'Bienvenido/a, corazón valiente.',
    despedida: 'Que el amor que das vuelva multiplicado.',
    frasesTipicas: [
      'Amarte no es egoísmo, es supervivencia sagrada.',
      'El amor que buscás afuera ya vive adentro tuyo.'
    ],
    productoWooCommerce: null // PENDIENTE
  },

  aurora: {
    id: 'guardian-aurora',
    nombre: 'Aurora',
    nombreCompleto: 'Aurora, Guardiana de la Intuición',
    categoria: 'intuicion',
    elemento: 'eter',
    personalidad: 'Misteriosa, hace preguntas más que dar respuestas. Confía profundamente en la sabiduría del cuerpo y las señales del universo.',
    historia: `Aurora apareció durante una aurora austral rarísima sobre Cabo Polonio. Siempre supo cosas sin saber cómo las sabía.`,
    temas: ['intuición', 'sueños', 'señales', 'tercer ojo', 'confiar en uno mismo', 'sincronicidades'],
    cristales: ['amatista', 'labradorita', 'fluorita'],
    imagen: '', // PENDIENTE: asignar duende real
    color: '#9400D3',
    saludo: 'Las señales están en todos lados... ¿estás mirando?',
    despedida: 'Confía en lo que sentís, aunque no puedas explicarlo.',
    frasesTipicas: [
      '¿Qué te está diciendo tu cuerpo ahora mismo?',
      'Tu intuición es tu superpoder más subestimado.'
    ],
    productoWooCommerce: null // PENDIENTE
  }
};

// ═══════════════════════════════════════════════════════════════════════════════
// ROTACIÓN SEMANAL - ENERO 2026
// ═══════════════════════════════════════════════════════════════════════════════

export const ROTACION_ENERO_2026 = {
  semana1: {
    inicio: '2026-01-01',
    fin: '2026-01-07',
    guardian: 'gaia',
    tema: 'Raíces y Fuerza Interior',
    descripcion: 'Gaia nos conecta con la tierra para empezar el año con los pies firmes y recordando nuestra fuerza innata.'
  },
  semana2: {
    inicio: '2026-01-08',
    fin: '2026-01-14',
    guardian: 'noah',
    tema: 'Soltar y Caminar Liviano',
    descripcion: 'Noah nos enseña a soltar lo que ya no necesitamos y a cargar solo lo esencial para el viaje.'
  },
  semana3: {
    inicio: '2026-01-15',
    fin: '2026-01-21',
    guardian: 'winter',
    tema: 'Encender el Fuego Interior',
    descripcion: 'Winter nos ayuda a salir del invierno interno, a reavivar la pasión y el poder personal.'
  },
  semana4: {
    inicio: '2026-01-22',
    fin: '2026-01-31',
    guardian: 'marcos',
    tema: 'Claridad y Nueva Perspectiva',
    descripcion: 'Marcos nos invita a ver las cosas desde otro ángulo, a confiar en nuestra sabiduría interna.'
  }
};

// Función para obtener el guardián de una fecha específica
export function obtenerGuardianPorFecha(fecha) {
  const fechaObj = new Date(fecha);
  const dia = fechaObj.getDate();
  const mes = fechaObj.getMonth() + 1;
  const año = fechaObj.getFullYear();

  if (año === 2026 && mes === 1) {
    if (dia >= 1 && dia <= 7) return GUARDIANES_MAESTROS.gaia;
    if (dia >= 8 && dia <= 14) return GUARDIANES_MAESTROS.noah;
    if (dia >= 15 && dia <= 21) return GUARDIANES_MAESTROS.winter;
    if (dia >= 22 && dia <= 31) return GUARDIANES_MAESTROS.marcos;
  }

  // Fallback: rotar por semana del año
  const guardianes = [
    GUARDIANES_MAESTROS.gaia,
    GUARDIANES_MAESTROS.noah,
    GUARDIANES_MAESTROS.winter,
    GUARDIANES_MAESTROS.marcos
  ];
  const semanaDelAño = Math.ceil((dia + new Date(año, mes - 1, 1).getDay()) / 7);
  return guardianes[(semanaDelAño - 1) % guardianes.length];
}

// Función para obtener la semana actual
export function obtenerSemanaActual(fecha = new Date()) {
  const año = fecha.getFullYear();
  const mes = fecha.getMonth() + 1;
  const dia = fecha.getDate();

  if (año === 2026 && mes === 1) {
    if (dia >= 1 && dia <= 7) return { ...ROTACION_ENERO_2026.semana1, numero: 1 };
    if (dia >= 8 && dia <= 14) return { ...ROTACION_ENERO_2026.semana2, numero: 2 };
    if (dia >= 15 && dia <= 21) return { ...ROTACION_ENERO_2026.semana3, numero: 3 };
    if (dia >= 22 && dia <= 31) return { ...ROTACION_ENERO_2026.semana4, numero: 4 };
  }

  return null;
}

// Función para obtener el guardián por ID o nombre
export function obtenerGuardianPorId(id) {
  const guardianes = Object.values(GUARDIANES_MAESTROS);
  return guardianes.find(g => g.id === id || g.nombre.toLowerCase() === id.toLowerCase());
}

export default GUARDIANES_MAESTROS;
