/**
 * GUARDIAN INTELLIGENCE - CONFIGURACIÓN CENTRAL
 * El cerebro de Duendes del Uruguay
 */

// ═══════════════════════════════════════════════════════════════
// CONFIGURACIÓN DEL SISTEMA
// ═══════════════════════════════════════════════════════════════

export const GI_CONFIG = {
  // Versión del sistema
  version: '1.0.0',

  // Modo del sistema
  modos: {
    AUTOMATICO: 'automatico',      // Hace cambios solo
    APROBACION: 'aprobacion',      // Requiere tu OK
    SUGERENCIA: 'sugerencia'       // Solo sugiere
  },

  // Modo actual (se puede cambiar desde el panel)
  modoActual: 'aprobacion',

  // Monitor 24/7
  monitor24_7: {
    activo: true,                  // Switch ON/OFF
    intervaloMinutos: 15,          // Cada cuánto verificar
    alertasWhatsApp: true,         // Enviar a WhatsApp
    alertasEmail: true,            // Enviar por email
    alertasPanel: true             // Mostrar en panel WP
  },

  // Umbrales de alerta
  umbrales: {
    similitudMaxima: 70,           // % de similitud para marcar como repetido
    puntajeMinimo: 60,             // Puntaje mínimo aceptable de historia
    saldoMinimoUSD: 10,            // Alertar cuando API tenga menos de esto
    diasVencimiento: 7             // Alertar X días antes de vencimiento
  }
};

// ═══════════════════════════════════════════════════════════════
// SINCRODESTINOS - BASE DE CONOCIMIENTO
// ═══════════════════════════════════════════════════════════════

export const SINCRODESTINOS = {
  // Categorías de sincrodestinos permitidos
  permitidos: {
    animales: [
      'Una mariposa entró por la ventana y se posó sobre {nombre} mientras secaba la pintura',
      'El gato del vecino, que NUNCA entra al taller, se acostó a sus pies hasta que lo terminamos',
      'Un colibrí se quedó flotando frente a la ventana justo cuando pintábamos sus ojos',
      'Una polilla blanca apareció de la nada y se quedó toda la noche en la mesa de trabajo',
      'El perro de la casa, que siempre duerme afuera, entró y se echó junto a {nombre}',
      'Un hornero empezó a construir su nido en la ventana del taller esa semana',
      'Apareció una araña tejiendo justo encima de donde trabajábamos - la dejamos',
      'Una lechuza cantó tres noches seguidas mientras lo canalizábamos'
    ],
    naturaleza: [
      'Durante las semanas que duró su canalización, brotaron hongos en una maceta abandonada',
      'La planta de jade que no florecía hace 5 años dio una flor',
      'Encontramos un trébol de cuatro hojas en el jardín el día que lo terminamos',
      'Las semillas que había plantado mi abuela hace años de repente germinaron',
      'Apareció musgo en una piedra del taller que siempre estuvo seca',
      'El rosal del patio, que creíamos muerto, dio un pimpollo rojo'
    ],
    clima: [
      'Justo cuando terminamos su rostro, empezó a llover después de semanas de sequía',
      'Apareció un arcoíris doble mientras pegábamos su último cristal',
      'El día que nació, hubo el atardecer más naranja que recuerdo',
      'Una tormenta eléctrica impresionante esa noche - los rayos no paraban',
      'Nevó por primera vez en años justo cuando poníamos su capa',
      'El viento sopló tan fuerte que se abrió la puerta del taller sola'
    ],
    objetos: [
      'Encontramos una moneda antigua en el piso del taller que nadie había visto',
      'Apareció una foto de mi abuela que creíamos perdida hace años',
      'El cristal que elegimos para {nombre} "saltó" de la caja cuando la abrimos',
      'Encontré en un bolsillo un papel donde había escrito su nombre meses antes',
      'Se cayó un libro de la estantería abierto justo en una página sobre su tema',
      'Apareció una pluma que nadie sabe de dónde vino'
    ],
    personas: [
      'Mi hermana llamó llorando después de 3 años sin hablar - soñó conmigo',
      'Un cliente preguntó por un guardián así ANTES de que lo publicáramos',
      'El vecino tocó la puerta para regalar algo relacionado con su tema',
      'Mi madre me mandó un mensaje hablando de exactamente lo que {nombre} representa',
      'Llegó una carta de alguien que no veía hace años, justo sobre el tema que canaliza',
      'Una amiga vino a visitarme sin avisar y trajo un regalo perfecto para el proceso'
    ],
    tecnologia: [
      'Se cortó la luz del barrio pero nuestra lámpara siguió encendida',
      'La radio se prendió sola con una canción que hablaba de lo que {nombre} representa',
      'Mi teléfono mostró una notificación de hace años justo con su nombre',
      'El reloj del taller se detuvo en la hora exacta que empezamos a crearlo'
    ],
    sueños: [
      'La noche anterior soñé con sus colores exactos sin saber que iba a canalizarlo',
      'Soñamos su nombre dos días antes de empezar a moldearlo',
      'Desperté a las 3:33 AM sabiendo exactamente cómo tenía que ser su rostro',
      'Soñé con la persona que iba a adoptarlo antes de siquiera publicarlo'
    ]
  },

  // Sincrodestinos PROHIBIDOS (fantasía irreal)
  prohibidos: [
    'llovieron tréboles',
    'llovieron monedas',
    'llovieron flores',
    'apareció un hada',
    'apareció un duende real',
    'el muñeco habló',
    'el guardián habló',
    'levitó',
    'flotó en el aire',
    'brilló con luz propia',
    'se movió solo',
    'desapareció y apareció',
    'se teletransportó',
    'creció de tamaño',
    'cambió de color solo'
  ]
};

// ═══════════════════════════════════════════════════════════════
// ESTRUCTURAS NARRATIVAS
// ═══════════════════════════════════════════════════════════════

export const ESTRUCTURAS = {
  A: {
    nombre: 'Clásica con secciones',
    orden: ['presentacion', 'backstory', 'sincrodestino', 'personalidad', 'aportes', 'creacion', 'mensaje', 'cierre'],
    descripcion: 'Formato tradicional con títulos y secciones claras'
  },
  B: {
    nombre: 'Narrativa fluida',
    orden: ['historia_completa'],
    descripcion: 'Sin títulos, todo fluye como una historia continua'
  },
  C: {
    nombre: 'Mensaje primero',
    orden: ['mensaje', 'quien_es', 'por_que', 'sincrodestino', 'aportes'],
    descripcion: 'Empieza con el mensaje canalizado como gancho'
  },
  D: {
    nombre: 'Sincrodestino primero',
    orden: ['sincrodestino', 'presentacion', 'historia', 'mensaje', 'aportes'],
    descripcion: 'Abre con el momento mágico'
  },
  E: {
    nombre: 'Carta del guardián',
    orden: ['carta_primera_persona'],
    descripcion: 'Escrito como si el guardián te escribiera una carta'
  },
  F: {
    nombre: 'Segunda persona',
    orden: ['conexion_directa_vos'],
    descripcion: 'Toda la historia dirigida a "vos"'
  },
  G: {
    nombre: 'Diario de canalización',
    orden: ['diario'],
    descripcion: 'Como entradas de diario del proceso de creación'
  }
};

// ═══════════════════════════════════════════════════════════════
// GUÍAS DE NARRATIVA - CÓMO ESCRIBIR HISTORIAS
// ═══════════════════════════════════════════════════════════════

export const GUIAS_NARRATIVA = {
  // VOZ: Siempre en plural, somos un equipo
  voz: {
    usar: ['nosotros', 'nos', 'nuestro', 'el equipo', 'en el taller'],
    NUNCA_usar: ['Thi', 'Gabriel', 'yo', 'mi'],
    tono: 'personas contando una experiencia - ni formal ni informal'
  },

  // ESTRUCTURA ESTÁNDAR de toda historia
  estructura_estandar: {
    partes: [
      {
        nombre: 'intro_canalizadores',
        descripcion: 'Nosotros contando cómo empezó la creación, qué notamos, primeras impresiones',
        ejemplo: 'Lo primero que notamos cuando empezamos a moldear a {nombre} fue...'
      },
      {
        nombre: 'sincrodestino',
        descripcion: 'El momento mágico/coincidencia que ocurrió durante la creación - DEBE ser realista',
        ejemplo: 'Esa misma tarde, encontramos un billete olvidado... / Apareció una mariposa...'
      },
      {
        nombre: 'descripcion_guardian',
        descripcion: 'Quién es, qué accesorios tiene, para quién es',
        ejemplo: '{nombre} mide lo que cabe en tu mano. Elegimos un {accesorio} para él porque...'
      },
      {
        nombre: 'para_quien',
        descripcion: 'Identificación con el cliente - sus problemas específicos',
        ejemplo: '{nombre} es para quienes trabajan duro pero sienten que... Para quienes...'
      },
      {
        nombre: 'transicion_mensaje',
        descripcion: 'Introducción al mensaje canalizado',
        ejemplo: 'Durante el proceso de canalización, {nombre} nos dictó el mensaje que quería transmitirle a quien lo adopte:'
      },
      {
        nombre: 'mensaje_canalizado',
        descripcion: 'La "carta" del guardián en primera persona, en cursiva',
        formato: 'En cursiva, primera persona, habla directo al lector con voseo'
      },
      {
        nombre: 'firma',
        descripcion: 'Firma del guardián',
        formato: '— {nombre}'
      },
      {
        nombre: 'prueba_social',
        descripcion: 'Qué cuentan quienes lo adoptaron',
        ejemplo: 'Quienes adoptaron a {nombre} nos cuentan que...'
      },
      {
        nombre: 'cierre_llamado',
        descripcion: 'Cierre con llamado sutil',
        ejemplo: 'Si llegaste hasta acá, probablemente {él/ella} ya te estaba esperando.'
      }
    ]
  },

  // NEUROMARKETING obligatorio
  neuromarketing: {
    identificacion: 'Describir el problema del cliente como si lo vivieras',
    especificidad: 'Detalles concretos, no abstracciones',
    prueba_social: 'Mencionar experiencias de otros adoptantes',
    escasez_implicita: 'Cada guardián es único - nunca directo tipo "últimas unidades"',
    llamado_sutil: 'Nunca agresivo, siempre sugerente'
  },

  // Español rioplatense
  idioma: {
    voseo: true,
    ejemplos: ['vos', 'tenés', 'podés', 'sentás', 'mirás', 'trabajás'],
    region: 'Uruguay'
  }
};

// ═══════════════════════════════════════════════════════════════
// EXPERIENCIAS HUMANAS PARA CONECTAR
// ═══════════════════════════════════════════════════════════════

export const EXPERIENCIAS_HUMANAS = {
  amor: [
    'ruptura reciente',
    'relación tóxica que no puede dejar',
    'miedo a quedarse sola',
    'amor no correspondido',
    'infidelidad sufrida',
    'no sentirse suficiente para su pareja',
    'buscar el amor después de los 40',
    'recuperarse de un divorcio'
  ],
  dinero: [
    'deudas que no puede pagar',
    'negocio que no despega',
    'trabajo que odia pero necesita',
    'miedo a cobrar lo que vale',
    'sensación de que la plata se escapa',
    'emprender con miedo',
    'no llegar a fin de mes'
  ],
  familia: [
    'relación rota con madre/padre',
    'hermanos que no se hablan',
    'pérdida de un ser querido',
    'conflictos con suegros',
    'hijos que no entiende',
    'familia que no la apoya'
  ],
  salud: [
    'ansiedad constante',
    'no poder dormir',
    'depresión silenciosa',
    'enfermedad crónica',
    'cansancio que no se va',
    'dolores sin explicación médica',
    'adicciones propias o de seres queridos'
  ],
  identidad: [
    'no saber quién es',
    'sentirse perdida en la vida',
    'crisis de los 40/50',
    'sentir que el tiempo se acaba',
    'compararse con otros',
    'autoestima en el piso',
    'sentirse impostora'
  ],
  espiritual: [
    'sentir que falta algo',
    'desconexión con todo',
    'buscar propósito',
    'cuestionar sus creencias',
    'querer conectar con algo más grande'
  ]
};

// ═══════════════════════════════════════════════════════════════
// VOCABULARIO A EVITAR Y ALTERNATIVAS
// ═══════════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════════
// HOOKS DE APERTURA POR CATEGORÍA - VARIEDAD OBLIGATORIA
// ═══════════════════════════════════════════════════════════════

export const HOOKS_APERTURA = {
  proteccion: [
    // Desde el guardián (no desde el dolor)
    '{nombre} nació con una misión clara: ser escudo.',
    '{nombre} no llegó por casualidad. Los guardianes de protección eligen a quién acompañar.',
    'Cuando lo canalizamos, {nombre} nos transmitió algo: viene a cuidar a quien cuida a todos.',
    '{nombre} trae consigo una energía que se siente apenas lo ves: es un centinela.',
    'Los guardianes de protección son raros. {nombre} es uno de ellos.',
    // Desde una situación/necesidad (no dramático)
    'Hay momentos en los que necesitás sentir que alguien te cuida a vos.',
    'A veces lo que más necesitamos es saber que no estamos solos en esto.',
    '{nombre} es para quien busca un compañero que le cubra las espaldas.',
    'Si sentís que das mucho y recibís poco, {nombre} vino a equilibrar eso.'
  ],
  abundancia: [
    // Desde el guardián
    '{nombre} es un guardián de abundancia - y eso significa mucho más que dinero.',
    'Cuando {nombre} llegó al taller, algo cambió. Los guardianes de abundancia traen esa energía.',
    '{nombre} vino a abrir puertas. Es lo que hace, es su especialidad.',
    'Los guardianes de abundancia son generosos por naturaleza. {nombre} no es la excepción.',
    '{nombre} trae consigo la energía del flujo - lo que tiene que llegar, llega.',
    // Desde una búsqueda/situación
    'Si estás buscando un cambio en cómo fluyen las cosas en tu vida, {nombre} apareció por algo.',
    '{nombre} es para quien está listo para recibir más.',
    'Hay momentos en los que sentís que es hora de que las cosas cambien. {nombre} acompaña esos momentos.',
    '{nombre} no promete riqueza instantánea. Promete compañía en el camino hacia lo que merecés.'
  ],
  amor: [
    // Desde el guardián
    '{nombre} es un guardián del corazón. Literal y metafóricamente.',
    'Los guardianes de amor son los más sensibles. {nombre} lo confirma.',
    '{nombre} llegó con una energía suave pero firme. Es típico de los guardianes de amor.',
    'Cuando canalizamos a {nombre}, nos transmitió ternura. Es su esencia.',
    '{nombre} viene a recordarte algo que olvidaste sobre vos misma.',
    // Desde una búsqueda/situación
    'Si estás en un momento de reconectarte con vos misma, {nombre} es el compañero ideal.',
    '{nombre} es para quien quiere empezar a tratarse mejor.',
    'Hay etapas donde necesitás más amor del que das. {nombre} entiende eso.',
    '{nombre} acompaña procesos de sanación del corazón, sin prisa.'
  ],
  salud: [
    // Desde el guardián
    '{nombre} es un guardián de sanación. Su energía se siente apenas lo mirás.',
    'Los guardianes de salud traen calma. {nombre} es exactamente eso.',
    '{nombre} llegó con una vibra tranquila, como los sanadores que son.',
    'Cuando lo canalizamos, {nombre} transmitió paz. Es lo que viene a aportar.',
    '{nombre} es de esos guardianes que acompañan procesos, sin apurar nada.',
    // Desde una búsqueda/situación
    'Si estás en un momento de cuidarte más, {nombre} llegó en el momento justo.',
    '{nombre} es para quien decidió priorizar su bienestar.',
    'Hay etapas donde el cuerpo pide atención. {nombre} ayuda a escucharlo.',
    '{nombre} acompaña a quienes eligen sanar, paso a paso.'
  ],
  sabiduria: [
    // Desde el guardián
    '{nombre} es un guardián de sabiduría. Se nota en su mirada.',
    'Los guardianes de sabiduría son observadores. {nombre} lo es.',
    '{nombre} no habla mucho, pero cuando lo hace, cada palabra cuenta.',
    'Cuando lo canalizamos, {nombre} transmitió claridad. Es lo suyo.',
    '{nombre} es de esos guardianes que te hacen ver lo que ya sabías.',
    // Desde una búsqueda/situación
    'Si estás buscando claridad, {nombre} puede ser el compañero que necesitás.',
    '{nombre} es para quien está en momento de decisiones importantes.',
    'Hay etapas donde necesitás silencio para escucharte. {nombre} ayuda con eso.',
    '{nombre} acompaña a quienes buscan respuestas adentro, no afuera.'
  ],
  sanacion: [
    // Desde el guardián
    '{nombre} es un guardián de sanación profunda. Su energía lo dice todo.',
    'Los guardianes de sanación son los más empáticos. {nombre} es prueba de eso.',
    '{nombre} llegó con una energía contenedora. Es lo que traen los sanadores.',
    'Cuando lo canalizamos, {nombre} transmitió compasión. Es su don.',
    '{nombre} no viene a arreglarte. Viene a acompañarte mientras sanás.',
    // Desde una búsqueda/situación
    'Si estás en proceso de sanar algo, {nombre} es el compañero que entiende.',
    '{nombre} es para quien decidió cerrar ciclos y avanzar.',
    'Hay momentos donde necesitás sentirte acompañada en el proceso. {nombre} está para eso.',
    '{nombre} acompaña transformaciones, sin juzgar el ritmo de cada una.'
  ]
};

// Patrones de apertura que necesitan ROTACIÓN (no prohibidos, solo no repetir seguidos)
// Si ya se usó uno similar en las últimas 15 historias GLOBALES, usar otro diferente
export const PATRONES_APERTURA = {
  // DESDE EL GUARDIÁN (preferidos para variar)
  guardian_presentacion: ['nació con', 'llegó con', 'es un guardián', 'es una guardiana', 'cuando lo canalizamos', 'cuando la canalizamos'],
  guardian_mision: ['viene a', 'vino a', 'su misión', 'trae consigo', 'su especialidad'],
  guardian_energia: ['su energía', 'transmitió', 'se siente', 'se nota'],

  // DESDE UNA BÚSQUEDA/SITUACIÓN (no dramático)
  busqueda: ['si estás buscando', 'si estás en', 'para quien busca', 'para quienes'],
  momento_vida: ['hay momentos', 'hay etapas', 'a veces lo que', 'en esos momentos'],

  // DESDE EL DOLOR (usar con moderación)
  pregunta_cuantas: ['cuántas veces', '¿cuántas veces', 'cuantas veces'],
  hay_quienes: ['hay quienes', 'hay personas que', 'algunas personas'],
  cuerpo: ['el cuerpo habla', 'tu cuerpo sabe'],

  // OTROS
  reflexion: ['dicen que', 'cuentan que', 'se dice que'],
  afirmacion_directa: ['lo sabés', 'ya lo sentiste']
};

// Estas SÍ están prohibidas siempre (frases de IA genérica o clichés)
export const APERTURAS_PROHIBIDAS_SIEMPRE = [
  'en lo profundo del bosque',
  'las brumas del',
  'desde tiempos inmemoriales',
  'el velo entre mundos',
  'érase una vez',
  'había una vez',
  'hace mucho mucho tiempo',
  'en tierras lejanas'
];

export const VOCABULARIO = {
  evitar: {
    'transmutar': ['transformar', 'convertir', 'cambiar', 'alquimizar', 'disolver'],
    'energías negativas': ['malas vibras', 'pesadez', 'oscuridad', 'cargas', 'lo que no te sirve'],
    'campo de protección': ['escudo', 'burbuja', 'manto', 'aura protectora', 'barrera invisible'],
    'abundancia': ['prosperidad', 'flujo', 'riqueza', 'fortuna', 'plenitud'],
    'canalizar': ['crear', 'manifestar', 'traer', 'dar forma', 'dar vida'],
    'ancestral': ['antiguo', 'milenario', 'de otros tiempos', 'sabio', 'eterno'],
    'guardián': ['protector', 'cuidador', 'vigía', 'centinela', 'compañero'],
    'universo': ['la vida', 'todo', 'lo que es', 'el misterio'],
    'vibración': ['energía', 'frecuencia', 'estado', 'esencia'],
    'luz': ['claridad', 'brillo', 'chispa', 'fulgor']
  },

  frases_prohibidas_ia: [
    'en lo profundo del bosque',
    'las brumas del otoño',
    'un manto de estrellas',
    'la danza de las hojas',
    'el susurro del viento ancestral',
    'desde tiempos inmemoriales',
    'el velo entre los mundos',
    'en los confines del tiempo',
    'la sabiduría ancestral',
    'el portal dimensional'
  ]
};

// ═══════════════════════════════════════════════════════════════
// SEO - CONFIGURACIÓN RANK MATH
// ═══════════════════════════════════════════════════════════════

export const SEO_CONFIG = {
  // Estructura de focus keyword
  focusKeyword: {
    patron: '{tipo} de {categoria}',  // Ej: "duende de protección"
    maxPalabras: 3,
    incluirNombre: false  // "Matheo duende protección" es muy largo
  },

  // Estructura de meta description
  metaDescription: {
    maxCaracteres: 155,
    incluir: ['nombre', 'tipo', 'categoria', 'beneficio_principal'],
    patron: '{nombre} es un {tipo} de {categoria}. {beneficio_principal}. Pieza única hecha a mano en Uruguay.'
  },

  // Estructura de título SEO
  tituloSEO: {
    maxCaracteres: 60,
    patron: '{nombre} - {tipo} de {categoria} | Duendes del Uruguay'
  },

  // Schema markup
  schema: {
    tipo: 'Product',
    incluir: ['name', 'description', 'image', 'price', 'availability', 'brand']
  }
};

// ═══════════════════════════════════════════════════════════════
// ALERTAS DE SALDOS DE APIs
// ═══════════════════════════════════════════════════════════════

export const APIS_MONITOREAR = {
  anthropic: {
    nombre: 'Anthropic (Claude)',
    url: 'https://api.anthropic.com/v1/usage',  // Si existe
    alertaMinimo: 10,  // USD
    checkManual: true  // Hay que verificar manualmente por ahora
  },
  openai: {
    nombre: 'OpenAI',
    url: 'https://api.openai.com/v1/usage',
    alertaMinimo: 10,
    checkManual: true
  },
  vercel: {
    nombre: 'Vercel',
    tipo: 'fecha',
    alertaDias: 7  // Alertar 7 días antes de vencer
  },
  resend: {
    nombre: 'Resend (Emails)',
    url: null,
    alertaMinimo: 100,  // Emails restantes
    checkManual: true
  },
  replicate: {
    nombre: 'Replicate (Imágenes)',
    alertaMinimo: 5,
    checkManual: true
  },
  elevenlabs: {
    nombre: 'ElevenLabs (Voz)',
    alertaMinimo: 1000,  // Caracteres
    checkManual: true
  }
};

// ═══════════════════════════════════════════════════════════════
// CROSS-SELLING INTELIGENTE
// ═══════════════════════════════════════════════════════════════

export const CROSS_SELLING = {
  reglas: [
    {
      condicion: 'categoria === "proteccion"',
      sugerir: ['cristales de protección', 'vela negra', 'sal negra'],
      mensaje: 'Para potenciar la protección de {nombre}:'
    },
    {
      condicion: 'categoria === "abundancia"',
      sugerir: ['citrino', 'pirita', 'canela'],
      mensaje: 'Para amplificar la abundancia:'
    },
    {
      condicion: 'categoria === "amor"',
      sugerir: ['cuarzo rosa', 'vela rosa', 'rosa seca'],
      mensaje: 'Para abrir más tu corazón:'
    },
    {
      condicion: 'precio > 200',
      sugerir: ['altar', 'kit de cristales', 'guía avanzada'],
      mensaje: 'Completa tu altar con:'
    },
    {
      condicion: 'tamano === "mini"',
      sugerir: ['bolsita de transporte', 'mini altar', 'cristal individual'],
      mensaje: 'Ideal para llevar:'
    }
  ],

  // Productos complementarios
  bundles: [
    {
      nombre: 'Pack Protección Total',
      incluye: ['guardian_proteccion', 'turmalina', 'sal_negra'],
      descuento: 15
    },
    {
      nombre: 'Pack Abundancia Ilimitada',
      incluye: ['guardian_abundancia', 'citrino', 'pirita'],
      descuento: 15
    }
  ]
};

// ═══════════════════════════════════════════════════════════════
// NOTIFICACIONES
// ═══════════════════════════════════════════════════════════════

export const NOTIFICACIONES = {
  canales: {
    whatsapp: {
      activo: true,
      numero: '+598 98 690 629',  // Número de Thibisay
      soloUrgentes: true
    },
    email: {
      activo: true,
      email: 'duendesdeluruguay@gmail.com',
      frecuencia: 'inmediata'  // inmediata, diaria, semanal
    },
    panel: {
      activo: true,
      persistir: true  // Mantener hasta que se lean
    }
  },

  tipos: {
    error_critico: { whatsapp: true, email: true, panel: true },
    venta: { whatsapp: false, email: true, panel: true },
    alerta_saldo: { whatsapp: true, email: true, panel: true },
    sugerencia: { whatsapp: false, email: false, panel: true },
    reporte_diario: { whatsapp: false, email: true, panel: true }
  }
};

export default {
  GI_CONFIG,
  SINCRODESTINOS,
  ESTRUCTURAS,
  GUIAS_NARRATIVA,
  EXPERIENCIAS_HUMANAS,
  HOOKS_APERTURA,
  PATRONES_APERTURA,
  APERTURAS_PROHIBIDAS_SIEMPRE,
  VOCABULARIO,
  SEO_CONFIG,
  APIS_MONITOREAR,
  CROSS_SELLING,
  NOTIFICACIONES
};
