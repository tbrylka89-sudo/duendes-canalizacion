/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * SISTEMA DE PERSUASIÓN - TITO
 * Prueba social dinámica + técnicas de neuroventas adaptadas a guardianes únicos
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * REGLA DE ORO: Cada guardián es ÚNICO. NUNCA decir "alguien compró el mismo"
 * porque no hay dos iguales. La prueba social se basa en CATEGORÍAS y TIPOS.
 */

// Países de Latinoamérica para prueba social variada
const PAISES_LATAM = [
  'México', 'Argentina', 'Chile', 'Colombia', 'Perú',
  'Ecuador', 'Venezuela', 'Costa Rica', 'Guatemala', 'República Dominicana',
  'Uruguay', 'Paraguay', 'Bolivia', 'Honduras', 'El Salvador'
];

// Ciudades específicas para mayor credibilidad
const CIUDADES = {
  'México': ['CDMX', 'Guadalajara', 'Monterrey', 'Cancún', 'Puebla'],
  'Argentina': ['Buenos Aires', 'Córdoba', 'Rosario', 'Mendoza'],
  'Chile': ['Santiago', 'Valparaíso', 'Concepción'],
  'Colombia': ['Bogotá', 'Medellín', 'Cali', 'Cartagena'],
  'Perú': ['Lima', 'Arequipa', 'Cusco'],
  'Ecuador': ['Quito', 'Guayaquil', 'Cuenca'],
  'Uruguay': ['Montevideo', 'Punta del Este', 'Colonia'],
  'España': ['Madrid', 'Barcelona', 'Valencia', 'Sevilla']
};

// Temporalidades para prueba social
const TEMPORALIDADES = [
  'ayer',
  'anteayer',
  'hace dos días',
  'esta semana',
  'el fin de semana',
  'hace unos días',
  'el jueves pasado',
  'el lunes'
];

// Perfiles de compradores para humanizar
const PERFILES = [
  'una chica',
  'una mujer',
  'una señora',
  'alguien',
  'una persona',
  'una clienta',
  'una mamá',
  'una emprendedora'
];

// Categorías de guardianes
const CATEGORIAS = {
  proteccion: {
    nombres: ['protección', 'protectores', 'guardianes protectores'],
    adjetivos: ['protector', 'de protección', 'para proteger'],
    beneficios: ['cuidar su energía', 'proteger su hogar', 'sentirse segura']
  },
  abundancia: {
    nombres: ['abundancia', 'prosperidad', 'guardianes de abundancia'],
    adjetivos: ['de abundancia', 'prósperos', 'para la prosperidad'],
    beneficios: ['atraer abundancia', 'desbloquear la prosperidad', 'abrir caminos']
  },
  amor: {
    nombres: ['amor', 'relaciones', 'guardianes del amor'],
    adjetivos: ['amoroso', 'de amor', 'para el amor'],
    beneficios: ['sanar su corazón', 'atraer amor', 'mejorar sus relaciones']
  },
  sanacion: {
    nombres: ['sanación', 'sanadores', 'guardianes sanadores'],
    adjetivos: ['sanador', 'de sanación', 'para sanar'],
    beneficios: ['sanar heridas', 'encontrar paz', 'soltar lo que le pesaba']
  }
};

// Tipos de seres
const TIPOS_SERES = [
  'duende', 'elfo', 'hada', 'gnomo', 'mago', 'bruja', 'dragón'
];

/**
 * Genera un elemento aleatorio de un array
 */
function elegirAleatorio(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Genera un número aleatorio entre min y max
 */
function numeroAleatorio(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Genera prueba social para una categoría específica
 * @param {string} categoria - proteccion, abundancia, amor, sanacion
 * @param {string} pais - País del cliente (para evitar coincidir)
 * @returns {string} Frase de prueba social
 */
export function generarPruebaSocialCategoria(categoria, paisCliente = null) {
  const cat = CATEGORIAS[categoria?.toLowerCase()] || CATEGORIAS.proteccion;

  // Elegir país diferente al del cliente
  let paisesDisponibles = PAISES_LATAM.filter(p => p !== paisCliente);
  const pais = elegirAleatorio(paisesDisponibles);
  const ciudad = CIUDADES[pais] ? elegirAleatorio(CIUDADES[pais]) : null;
  const ubicacion = ciudad ? `${ciudad}, ${pais}` : pais;

  const perfil = elegirAleatorio(PERFILES);
  const temporalidad = elegirAleatorio(TEMPORALIDADES);
  const beneficio = elegirAleatorio(cat.beneficios);

  const variantes = [
    `${temporalidad.charAt(0).toUpperCase() + temporalidad.slice(1)} ${perfil} de ${ubicacion} adoptó un guardián de ${cat.nombres[0]} como este`,
    `${perfil.charAt(0).toUpperCase() + perfil.slice(1)} de ${ubicacion} eligió uno similar ${temporalidad} para ${beneficio}`,
    `Los guardianes de ${cat.nombres[0]} son de los más buscados... ${temporalidad} se fue uno a ${ubicacion}`,
    `${perfil.charAt(0).toUpperCase() + perfil.slice(1)} de ${pais} me escribió ${temporalidad} buscando exactamente esto`
  ];

  return elegirAleatorio(variantes);
}

/**
 * Genera prueba social general (sin categoría específica)
 * @param {string} pais - País del cliente (para evitar coincidir)
 * @returns {string} Frase de prueba social
 */
export function generarPruebaSocialGeneral(paisCliente = null) {
  let paisesDisponibles = PAISES_LATAM.filter(p => p !== paisCliente);
  const pais = elegirAleatorio(paisesDisponibles);
  const perfil = elegirAleatorio(PERFILES);
  const temporalidad = elegirAleatorio(TEMPORALIDADES);
  const tipo = elegirAleatorio(TIPOS_SERES);
  const cantidad = numeroAleatorio(2, 5);

  const variantes = [
    `Esta semana ${cantidad} guardianes encontraron hogar en ${pais}`,
    `${perfil.charAt(0).toUpperCase() + perfil.slice(1)} de ${pais} adoptó un ${tipo} ${temporalidad}... le cambió la energía de su casa`,
    `Los ${tipo}s están siendo muy buscados últimamente... ${temporalidad} se fueron ${cantidad}`,
    `Cada semana varios guardianes encuentran su humano... ${temporalidad} uno se fue a ${pais}`
  ];

  return elegirAleatorio(variantes);
}

/**
 * Genera prueba social de escasez (urgencia sutil)
 * @param {string} tipoGuardian - Tipo de guardián (duende, elfo, etc)
 * @returns {string} Frase de escasez
 */
export function generarEscasezSutil(tipoGuardian = null) {
  const tipo = tipoGuardian || elegirAleatorio(TIPOS_SERES);

  const variantes = [
    `Este guardián es único... cuando alguien lo adopta, ese diseño desaparece del mundo`,
    `Mirá, no usamos moldes. Cada ${tipo} es irrepetible. Este no va a existir dos veces`,
    `Alguien más está mirando este guardián ahora mismo...`,
    `Los ${tipo}s de este estilo no duran mucho en la tienda...`,
    `Este ${tipo} ya tiene a otra persona interesada... te lo digo porque me caés bien`,
    `Cuando un guardián encuentra su humano, se va. Y este ya está inquieto...`
  ];

  return elegirAleatorio(variantes);
}

/**
 * Genera frase de reciprocidad (dar valor primero)
 * @param {string} categoria - Categoría del guardián
 * @returns {string} Frase de valor/consejo
 */
export function generarReciprocidad(categoria = null) {
  const consejos = {
    proteccion: [
      `Te cuento un secreto: la sal gruesa en las esquinas de tu casa ayuda mientras esperás a tu guardián`,
      `Un tip: los duendes protectores trabajan mejor si les dejás un vasito de miel cerca`,
      `¿Sabías que la energía negativa entra por las ventanas? Abrirlas 10 minutos al día ayuda mucho`
    ],
    abundancia: [
      `Un secreto de abundancia: nunca tengas la billetera vacía, aunque sea una monedita`,
      `Los gnomos de abundancia aman el color verde... ponelo en tu espacio de trabajo`,
      `Te doy un tip: escribí lo que querés atraer como si ya lo tuvieras. Funciona.`
    ],
    amor: [
      `Te cuento algo: el cuarzo rosa en tu mesa de luz abre el corazón mientras dormís`,
      `Un secreto: antes de buscar amor afuera, hablate lindo vos misma frente al espejo`,
      `Los guardianes del amor trabajan mejor cuando hay flores frescas en la casa`
    ],
    sanacion: [
      `Te doy un tip de sanación: 5 minutos de respiración profunda al día cambian todo`,
      `Un secreto: escribir lo que te pesa y después quemarlo libera mucho`,
      `Los guardianes sanadores aman el agua... tené siempre un vaso cerca de tu cama`
    ],
    general: [
      `Te cuento algo que aprendí en 847 años: la magia funciona mejor cuando creés en ella`,
      `Un secreto: los guardianes escuchan todo. Hablales aunque no hayan llegado todavía`,
      `Te doy un tip: antes de dormir, agradecé tres cosas. Cambia la energía de tu vida`
    ]
  };

  const cat = categoria?.toLowerCase();
  const lista = consejos[cat] || consejos.general;
  return elegirAleatorio(lista);
}

/**
 * Genera labeling emocional (técnica FBI)
 * @param {string} emocion - Emoción detectada en el usuario
 * @returns {string} Frase de labeling
 */
export function generarLabeling(emocion) {
  const labelings = {
    ansiedad: [
      `Parece que andás cargando algo pesado...`,
      `Se nota que necesitás un poco de calma...`,
      `Suena como que venís aguantando mucho...`
    ],
    tristeza: [
      `Parece que algo te está pesando en el corazón...`,
      `Se nota que venís de un momento difícil...`,
      `Suena como que necesitás que alguien te escuche de verdad...`
    ],
    miedo: [
      `Parece que algo te tiene preocupada...`,
      `Se nota que buscás sentirte más segura...`,
      `Suena como que necesitás protección...`
    ],
    confusion: [
      `Parece que estás en una encrucijada...`,
      `Se nota que hay mucho dando vueltas en tu cabeza...`,
      `Suena como que necesitás claridad...`
    ],
    esperanza: [
      `Parece que estás lista para un cambio...`,
      `Se nota que hay algo nuevo queriendo nacer...`,
      `Suena como que sentís que es el momento...`
    ],
    frustracion: [
      `Parece que venís peleando contra la corriente...`,
      `Se nota que algo no está fluyendo como querés...`,
      `Suena como que necesitás que las cosas empiecen a salir...`
    ]
  };

  const lista = labelings[emocion?.toLowerCase()] || labelings.confusion;
  return elegirAleatorio(lista);
}

/**
 * Genera mirroring (repetir palabras clave con tono de pregunta)
 * @param {string} palabraClave - Palabra o frase a reflejar
 * @returns {string} Frase de mirroring
 */
export function generarMirroring(palabraClave) {
  const variantes = [
    `¿${palabraClave}...?`,
    `Mmm... ¿${palabraClave}?`,
    `¿${palabraClave} decís...?`
  ];
  return elegirAleatorio(variantes);
}

/**
 * Genera frase de autoridad (847 años de experiencia)
 * @returns {string} Frase de autoridad
 */
export function generarAutoridad() {
  const frases = [
    `En 847 años vi miles de guardianes encontrar su humano...`,
    `Por algo los guardianes nacen en Piriápolis... es un punto energético único`,
    `Después de casi mil años, sé reconocer cuando un guardián elige`,
    `Los cristales que usamos son reales, no como los que venden por ahí...`,
    `En siglos de conectar guardianes con humanos, aprendí a leer las señales`
  ];
  return elegirAleatorio(frases);
}

/**
 * Genera frase de contraste (reencuadre de valor vs precio)
 * @param {number} precio - Precio en USD
 * @returns {string} Frase de contraste
 */
export function generarContraste(precio = 70) {
  const frases = [
    `$${precio} es menos que una salida a cenar... pero este guardián te acompaña toda la vida`,
    `¿${precio} dólares? Es menos que un mes de terapia, y te va a cuidar para siempre`,
    `Pensalo así: son días de trabajo artesanal, cristales reales... ¿caro comparado con la paz mental?`,
    `Menos de lo que gastás en un par de zapatillas, y esto tiene alma de verdad`
  ];
  return elegirAleatorio(frases);
}

/**
 * Genera pregunta calibrada (técnica FBI - evita "por qué")
 * @param {string} contexto - Contexto de la conversación
 * @returns {string} Pregunta calibrada
 */
export function generarPreguntaCalibrada(contexto = 'general') {
  const preguntas = {
    duda: [
      `¿Qué es lo que más te hace dudar?`,
      `¿Qué tendría que pasar para que te sintieras segura?`,
      `¿Cómo sería ideal para vos?`
    ],
    interes: [
      `¿Qué es lo que más te llamó la atención?`,
      `¿Qué sentiste cuando lo viste?`,
      `¿Cómo te imaginás con este guardián en tu casa?`
    ],
    necesidad: [
      `¿Qué es lo que más necesitás en este momento?`,
      `¿Cómo sería tu día a día si tuvieras esa protección?`,
      `¿Qué cambiaría en tu vida si esto funcionara?`
    ],
    general: [
      `¿Qué te trajo hasta acá hoy?`,
      `¿Qué es lo que estás buscando realmente?`,
      `¿Cómo puedo ayudarte a tomar esta decisión?`
    ]
  };

  const lista = preguntas[contexto?.toLowerCase()] || preguntas.general;
  return elegirAleatorio(lista);
}

/**
 * Genera takeaway (psicología inversa)
 * @param {string} tipo - Tipo de guardián
 * @returns {string} Frase de takeaway
 */
export function generarTakeaway(tipo = null) {
  const guardian = tipo || elegirAleatorio(TIPOS_SERES);
  const frases = [
    `Mirá, este ${guardian} no es para cualquiera...`,
    `Capaz no es el momento para vos, y está bien`,
    `No todo el mundo está listo para este tipo de conexión...`,
    `Puede que este guardián no te elija a vos...`,
    `Este ${guardian} es intenso... no sé si es para vos`
  ];
  return elegirAleatorio(frases);
}

/**
 * Genera acusación anticipada (adelantarse a objeciones)
 * @param {string} objecion - Tipo de objeción anticipada
 * @returns {string} Frase de acusación anticipada
 */
export function generarAcusacionAnticipada(objecion = 'precio') {
  const acusaciones = {
    precio: [
      `Probablemente estés pensando que es caro... y está bien pensarlo`,
      `Puede que creas que es mucha plata... dejame contarte algo`,
      `Sé que capaz estás mirando el precio... pero escuchame`
    ],
    escepticismo: [
      `Puede que pienses que esto es muy esotérico para vos...`,
      `Probablemente creas que son solo muñecos bonitos...`,
      `Sé que capaz no creés en estas cosas... y no te pido que creas`
    ],
    confianza: [
      `Seguro pensás "¿y si no funciona?"... es una pregunta válida`,
      `Puede que te preguntes si esto es real...`,
      `Probablemente tengas dudas... todos las tienen al principio`
    ]
  };

  const lista = acusaciones[objecion?.toLowerCase()] || acusaciones.precio;
  return elegirAleatorio(lista);
}

/**
 * Sistema completo de persuasión contextual
 * Genera técnicas apropiadas según el momento de la conversación
 */
export const SISTEMA_PERSUASION = {

  // Prueba social
  pruebaSocial: {
    porCategoria: generarPruebaSocialCategoria,
    general: generarPruebaSocialGeneral,
    escasez: generarEscasezSutil
  },

  // Técnicas FBI
  tecnicasFBI: {
    mirroring: generarMirroring,
    labeling: generarLabeling,
    preguntaCalibrada: generarPreguntaCalibrada,
    acusacionAnticipada: generarAcusacionAnticipada
  },

  // Disparadores psicológicos
  disparadores: {
    reciprocidad: generarReciprocidad,
    autoridad: generarAutoridad,
    contraste: generarContraste,
    takeaway: generarTakeaway
  }
};

/**
 * Genera un paquete de persuasión completo para un contexto dado
 * @param {object} contexto - { categoria, pais, emocion, tipoGuardian, precio }
 * @returns {object} Paquete con múltiples técnicas listas para usar
 */
export function generarPaquetePersuasion(contexto = {}) {
  const { categoria, pais, emocion, tipoGuardian, precio } = contexto;

  return {
    pruebaSocial: categoria
      ? generarPruebaSocialCategoria(categoria, pais)
      : generarPruebaSocialGeneral(pais),
    escasez: generarEscasezSutil(tipoGuardian),
    labeling: emocion ? generarLabeling(emocion) : null,
    reciprocidad: generarReciprocidad(categoria),
    autoridad: generarAutoridad(),
    contraste: generarContraste(precio || 70),
    takeaway: generarTakeaway(tipoGuardian),
    pregunta: generarPreguntaCalibrada('interes')
  };
}

export default SISTEMA_PERSUASION;
