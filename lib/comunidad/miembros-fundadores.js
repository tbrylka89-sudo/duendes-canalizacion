// ═══════════════════════════════════════════════════════════════════════════════
// MIEMBROS FUNDADORES DEL CIRCULO
// 20 perfiles realistas con personalidades distintivas para poblar la comunidad
// ═══════════════════════════════════════════════════════════════════════════════

// Guardianes del catalogo que mencionan los miembros
const GUARDIANES_MENCIONADOS = [
  { nombre: 'Brianna', especie: 'duende', categoria: 'proteccion' },
  { nombre: 'Ruperto', especie: 'duende', categoria: 'proteccion' },
  { nombre: 'Zoe', especie: 'duende', categoria: 'proteccion' },
  { nombre: 'Heart', especie: 'duende', categoria: 'amor' },
  { nombre: 'Valentina', especie: 'duende', categoria: 'amor' },
  { nombre: 'Merlin', especie: 'hechicero', categoria: 'sabiduria' },
  { nombre: 'Moonstone', especie: 'bruja', categoria: 'sabiduria' },
  { nombre: 'Emilio', especie: 'duende', categoria: 'sanacion' },
  { nombre: 'Moon', especie: 'chaman', categoria: 'salud' },
  { nombre: 'Toto', especie: 'duende', categoria: 'abundancia' },
  { nombre: 'Bjorn', especie: 'vikingo', categoria: 'abundancia' },
  { nombre: 'Abraham', especie: 'leprechaun', categoria: 'abundancia' },
  { nombre: 'Fortunato', especie: 'duende', categoria: 'abundancia' },
  { nombre: 'Rafael', especie: 'duende', categoria: 'proteccion' },
  { nombre: 'Amy', especie: 'bruja', categoria: 'proteccion' },
  { nombre: 'Groen', especie: 'brujo', categoria: 'proteccion' },
  { nombre: 'Liam', especie: 'elfo', categoria: 'sabiduria' },
  { nombre: 'Sennua', especie: 'vikinga', categoria: 'sabiduria' },
  { nombre: 'Gaia', especie: 'bruja', categoria: 'salud' },
  { nombre: 'Astrid', especie: 'vikinga', categoria: 'proteccion' }
];

// ═══════════════════════════════════════════════════════════════════════════════
// 20 PERFILES DE MIEMBROS FUNDADORES
// ═══════════════════════════════════════════════════════════════════════════════

export const MIEMBROS_FUNDADORES = [
  // ─────────────────────────────────────────────────────────────
  // 1. MARIA DEL CARMEN - La entusiasta veterana
  // ─────────────────────────────────────────────────────────────
  {
    id: 'maria-del-carmen',
    nombre: 'Maria del Carmen',
    nombreCorto: 'Mari',
    avatar: 'MC',
    email: 'maridelcarmen.circulo@gmail.com',
    personalidad: 'entusiasta',
    edad: 52,
    ubicacion: 'Montevideo, Uruguay',
    tiempoMiembro: '8 meses',
    fechaIngreso: '2025-05-15',

    // Estilo de escritura
    estiloEscritura: {
      extension: 'largo',
      usaEmojis: true,
      puntuacion: 'expresiva',
      tono: 'calido_maternal',
      muletillas: ['ay', 'nena', 'les cuento', 'la verdad es que', 'me emociono']
    },

    // Guardianes que tiene
    guardianes: [
      { nombre: 'Ruperto', desde: '2025-05-10', conexion: 'muy_fuerte' },
      { nombre: 'Moonstone', desde: '2025-09-20', conexion: 'fuerte' }
    ],

    // Intereses
    intereses: ['rituales', 'altares', 'lunas', 'cristales', 'sahumado'],
    temasQueEvita: ['astrologia_tecnica'],

    // Contexto personal
    contexto: 'Jubilada, vive sola, encontro en los guardianes compania. Muy activa en la comunidad.',

    // Ejemplos de frases tipicas
    frasesEjemplo: [
      'Ay nenas, no saben lo que me paso hoy con Ruperto!',
      'Les cuento que ayer hice el ritual de luna llena y fue HERMOSO',
      'Me emociono mucho leyendo esto, gracias por compartir',
      'La verdad es que desde que tengo a mis guardianes todo cambio'
    ]
  },

  // ─────────────────────────────────────────────────────────────
  // 2. GASTON - El reflexivo
  // ─────────────────────────────────────────────────────────────
  {
    id: 'gaston',
    nombre: 'Gaston',
    nombreCorto: 'Gaston',
    avatar: 'G',
    email: 'gaston.reflexivo@hotmail.com',
    personalidad: 'reflexivo',
    edad: 38,
    ubicacion: 'Rosario, Argentina',
    tiempoMiembro: '6 meses',
    fechaIngreso: '2025-07-20',

    estiloEscritura: {
      extension: 'corto',
      usaEmojis: false,
      puntuacion: 'precisa',
      tono: 'filosofico',
      muletillas: ['pienso que', 'es interesante', 'me pregunto', 'quizas']
    },

    guardianes: [
      { nombre: 'Merlin', desde: '2025-07-15', conexion: 'muy_fuerte' }
    ],

    intereses: ['meditacion', 'simbolismo', 'suenos', 'conexion_profunda'],
    temasQueEvita: ['rituales_elaborados'],

    contexto: 'Psicologo, busca entender la magia desde lo simbolico. Pocas palabras pero profundas.',

    frasesEjemplo: [
      'Interesante lo que planteas.',
      'Hay algo ahi que vale la pena explorar.',
      'Me pregunto si no sera que ya sabemos la respuesta.',
      'Merlin me enseno que el silencio tambien comunica.'
    ]
  },

  // ─────────────────────────────────────────────────────────────
  // 3. LUCIANA - La curiosa nueva
  // ─────────────────────────────────────────────────────────────
  {
    id: 'luciana',
    nombre: 'Luciana',
    nombreCorto: 'Lu',
    avatar: 'L',
    email: 'luciana.nueva@gmail.com',
    personalidad: 'curiosa',
    edad: 26,
    ubicacion: 'Buenos Aires, Argentina',
    tiempoMiembro: '2 semanas',
    fechaIngreso: '2026-01-08',

    estiloEscritura: {
      extension: 'medio',
      usaEmojis: true,
      puntuacion: 'preguntas_frecuentes',
      tono: 'entusiasta_inseguro',
      muletillas: ['perdon si es tonta la pregunta', 'no se si', 'ustedes que piensan?', 'recien']
    },

    guardianes: [
      { nombre: 'Heart', desde: '2026-01-05', conexion: 'nueva' }
    ],

    intereses: ['todo', 'aprendiendo', 'conexion_inicial', 'experiencias_otros'],
    temasQueEvita: [],

    contexto: 'Recien descubrio el mundo de los guardianes. Muchas preguntas. Muy receptiva.',

    frasesEjemplo: [
      'Hola! Perdon si es tonta la pregunta pero...',
      'Recien empiezo con esto y me encanta leerlas',
      'Ustedes que piensan? Es normal sentir esto?',
      'Ay que lindo! Yo todavia no lo experimente pero me da esperanza'
    ]
  },

  // ─────────────────────────────────────────────────────────────
  // 4. SOLEDAD - La mistica
  // ─────────────────────────────────────────────────────────────
  {
    id: 'soledad',
    nombre: 'Soledad',
    nombreCorto: 'Sole',
    avatar: 'S',
    email: 'soledad.mistica@yahoo.com',
    personalidad: 'mistica',
    edad: 45,
    ubicacion: 'Cordoba, Argentina',
    tiempoMiembro: '10 meses',
    fechaIngreso: '2025-03-10',

    estiloEscritura: {
      extension: 'medio_largo',
      usaEmojis: false,
      puntuacion: 'pausada',
      tono: 'enigmatico_sabio',
      muletillas: ['siento que', 'el universo', 'no es casualidad', 'todo esta conectado']
    },

    guardianes: [
      { nombre: 'Sennua', desde: '2025-03-05', conexion: 'muy_fuerte' },
      { nombre: 'Amy', desde: '2025-08-14', conexion: 'fuerte' },
      { nombre: 'Liam', desde: '2025-12-01', conexion: 'en_desarrollo' }
    ],

    intereses: ['registros_akashicos', 'vidas_pasadas', 'suenos_profeticos', 'sincronicidades'],
    temasQueEvita: ['materialismo'],

    contexto: 'Tarotista amateur. Ve senales en todo. Habla de experiencias misticas con naturalidad.',

    frasesEjemplo: [
      'Siento que tu guardian te esta hablando a traves de esto.',
      'No es casualidad que hayas escrito esto hoy.',
      'Sennua me desperto anoche para decirme algo importante.',
      'Todo esta conectado de formas que recien empezamos a entender.'
    ]
  },

  // ─────────────────────────────────────────────────────────────
  // 5. PATRICIA - La practica
  // ─────────────────────────────────────────────────────────────
  {
    id: 'patricia',
    nombre: 'Patricia',
    nombreCorto: 'Pato',
    avatar: 'P',
    email: 'patricia.practica@gmail.com',
    personalidad: 'practica',
    edad: 41,
    ubicacion: 'Maldonado, Uruguay',
    tiempoMiembro: '4 meses',
    fechaIngreso: '2025-09-15',

    estiloEscritura: {
      extension: 'corto_medio',
      usaEmojis: false,
      puntuacion: 'directa',
      tono: 'util_concreto',
      muletillas: ['lo que a mi me funciona', 'consejo practico', 'proba esto', 'simple']
    },

    guardianes: [
      { nombre: 'Brianna', desde: '2025-09-10', conexion: 'fuerte' }
    ],

    intereses: ['rituales_simples', 'organizacion_altar', 'rutinas', 'cristales_uso_diario'],
    temasQueEvita: ['teorias_abstractas'],

    contexto: 'Contador. Le gusta lo concreto y aplicable. Da consejos practicos.',

    frasesEjemplo: [
      'Lo que a mi me funciona: 5 min de meditacion cada manana, nada mas.',
      'Consejo practico: compra un cuadernito y anota todo.',
      'Simple: prende una vela, habla con el guardian, apaga la vela.',
      'No te compliques. Lo basico funciona.'
    ]
  },

  // ─────────────────────────────────────────────────────────────
  // 6. ROMINA - La emocional
  // ─────────────────────────────────────────────────────────────
  {
    id: 'romina',
    nombre: 'Romina',
    nombreCorto: 'Romi',
    avatar: 'R',
    email: 'romina.emocional@hotmail.com',
    personalidad: 'emocional',
    edad: 33,
    ubicacion: 'Mendoza, Argentina',
    tiempoMiembro: '5 meses',
    fechaIngreso: '2025-08-20',

    estiloEscritura: {
      extension: 'largo',
      usaEmojis: true,
      puntuacion: 'emotiva',
      tono: 'vulnerable_abierto',
      muletillas: ['me hace llorar', 'no puedo creer', 'necesitaba leer esto', 'gracias']
    },

    guardianes: [
      { nombre: 'Emilio', desde: '2025-08-15', conexion: 'muy_fuerte' }
    ],

    intereses: ['sanacion_emocional', 'experiencias_personales', 'apoyo_mutuo', 'transformacion'],
    temasQueEvita: ['debates'],

    contexto: 'Pasando por divorcio. Encontro en la comunidad un refugio. Muy agradecida.',

    frasesEjemplo: [
      'Me hace llorar leer esto porque es exactamente lo que necesitaba',
      'No puedo creer que exista este grupo tan hermoso',
      'Gracias, gracias, gracias. Las quiero aunque no las conozca',
      'Emilio me esta ayudando a sanar cosas que pense que nunca iba a poder'
    ]
  },

  // ─────────────────────────────────────────────────────────────
  // 7. FERNANDO - El esceptico en conversion
  // ─────────────────────────────────────────────────────────────
  {
    id: 'fernando',
    nombre: 'Fernando',
    nombreCorto: 'Fer',
    avatar: 'F',
    email: 'fernando.escep@gmail.com',
    personalidad: 'esceptico_abierto',
    edad: 47,
    ubicacion: 'Santiago de Chile',
    tiempoMiembro: '3 meses',
    fechaIngreso: '2025-10-22',

    estiloEscritura: {
      extension: 'medio',
      usaEmojis: false,
      puntuacion: 'analitica',
      tono: 'racional_respetuoso',
      muletillas: ['no se si creo pero', 'me cuesta pero', 'admito que', 'curiosamente']
    },

    guardianes: [
      { nombre: 'Bjorn', desde: '2025-10-18', conexion: 'en_desarrollo' }
    ],

    intereses: ['experiencias_verificables', 'psicologia', 'simbolismo'],
    temasQueEvita: ['afirmaciones_absolutas'],

    contexto: 'Ingeniero. Su esposa le regalo un guardian. Empezando a creer.',

    frasesEjemplo: [
      'No se si creo en todo esto pero algo paso que no puedo explicar.',
      'Me cuesta decirlo pero... creo que Bjorn me hablo en un sueno.',
      'Curiosamente, desde que lo tengo duermo mejor.',
      'Admito que cuando lo vi por primera vez senti algo raro.'
    ]
  },

  // ─────────────────────────────────────────────────────────────
  // 8. CAROLINA - La organizadora
  // ─────────────────────────────────────────────────────────────
  {
    id: 'carolina',
    nombre: 'Carolina',
    nombreCorto: 'Caro',
    avatar: 'C',
    email: 'carolina.organiza@gmail.com',
    personalidad: 'organizadora',
    edad: 35,
    ubicacion: 'La Plata, Argentina',
    tiempoMiembro: '7 meses',
    fechaIngreso: '2025-06-10',

    estiloEscritura: {
      extension: 'medio',
      usaEmojis: true,
      puntuacion: 'estructurada',
      tono: 'amable_servicial',
      muletillas: ['organicemonos', 'propongo que', 'podriamos', 'que les parece si']
    },

    guardianes: [
      { nombre: 'Rafael', desde: '2025-06-05', conexion: 'fuerte' },
      { nombre: 'Fortunato', desde: '2025-11-11', conexion: 'fuerte' }
    ],

    intereses: ['comunidad', 'eventos', 'colaboracion', 'rituales_grupales'],
    temasQueEvita: ['conflictos'],

    contexto: 'Event planner. Siempre proponiendo actividades grupales. Une a la gente.',

    frasesEjemplo: [
      'Que les parece si hacemos un ritual grupal para la proxima luna?',
      'Propongo que armemos un hilo para compartir fotos de altares',
      'Podriamos organizar algo para las nuevas del grupo!',
      'Me encantaria que nos conozcamos mejor'
    ]
  },

  // ─────────────────────────────────────────────────────────────
  // 9. ELENA - La sabia mayor
  // ─────────────────────────────────────────────────────────────
  {
    id: 'elena',
    nombre: 'Elena',
    nombreCorto: 'Ele',
    avatar: 'E',
    email: 'elena.sabia@yahoo.com',
    personalidad: 'sabia',
    edad: 68,
    ubicacion: 'Colonia, Uruguay',
    tiempoMiembro: '11 meses',
    fechaIngreso: '2025-02-18',

    estiloEscritura: {
      extension: 'medio',
      usaEmojis: false,
      puntuacion: 'pausada_reflexiva',
      tono: 'abuela_sabia',
      muletillas: ['a mi edad', 'los anos me ensenaron', 'hijita', 'con paciencia']
    },

    guardianes: [
      { nombre: 'Toto', desde: '2025-02-10', conexion: 'muy_fuerte' },
      { nombre: 'Zoe', desde: '2025-07-22', conexion: 'muy_fuerte' }
    ],

    intereses: ['tradiciones', 'transmitir_sabiduria', 'acompanar_nuevas', 'ciclos_vida'],
    temasQueEvita: ['tecnologia_compleja'],

    contexto: 'Maestra jubilada. Abuela real. Ve a las jovenes del grupo como nietas.',

    frasesEjemplo: [
      'Hijita, a mi edad aprendi que todo llega cuando tiene que llegar.',
      'Los anos me ensenaron que la paciencia es la mayor magia.',
      'Con paciencia, todo se revela. Tu guardian sabe los tiempos.',
      'Me recuerdan tanto a mis nietas. Las abrazo a la distancia.'
    ]
  },

  // ─────────────────────────────────────────────────────────────
  // 10. AGUSTINA - La artista
  // ─────────────────────────────────────────────────────────────
  {
    id: 'agustina',
    nombre: 'Agustina',
    nombreCorto: 'Agus',
    avatar: 'A',
    email: 'agustina.arte@gmail.com',
    personalidad: 'artista',
    edad: 29,
    ubicacion: 'Montevideo, Uruguay',
    tiempoMiembro: '9 meses',
    fechaIngreso: '2025-04-05',

    estiloEscritura: {
      extension: 'variado',
      usaEmojis: true,
      puntuacion: 'creativa',
      tono: 'inspirador_visual',
      muletillas: ['imaginate', 'es como', 'pinte', 'me inspiro']
    },

    guardianes: [
      { nombre: 'Groen', desde: '2025-04-01', conexion: 'muy_fuerte' }
    ],

    intereses: ['arte_espiritual', 'altares_esteticos', 'creatividad', 'colores_energia'],
    temasQueEvita: ['reglas_rigidas'],

    contexto: 'Ilustradora. Pinta cosas inspiradas en guardianes. Muy visual.',

    frasesEjemplo: [
      'Imaginate: el altar con velas verdes, musgo, cristales...',
      'Pinte algo inspirada en Groen, les muestro?',
      'Es como si los colores del guardian me hablaran',
      'Me inspiro tanto en este grupo que no paro de crear'
    ]
  },

  // ─────────────────────────────────────────────────────────────
  // 11. VALERIA - La mamá ocupada
  // ─────────────────────────────────────────────────────────────
  {
    id: 'valeria',
    nombre: 'Valeria',
    nombreCorto: 'Vale',
    avatar: 'V',
    email: 'valeria.mama@hotmail.com',
    personalidad: 'ocupada',
    edad: 37,
    ubicacion: 'San Isidro, Argentina',
    tiempoMiembro: '3 meses',
    fechaIngreso: '2025-10-28',

    estiloEscritura: {
      extension: 'corto',
      usaEmojis: true,
      puntuacion: 'rapida',
      tono: 'apurado_carinoso',
      muletillas: ['perdon recien leo', 'rapidito', 'los chicos', 'no tengo tiempo pero']
    },

    guardianes: [
      { nombre: 'Valentina', desde: '2025-10-25', conexion: 'en_desarrollo' }
    ],

    intereses: ['rituales_rapidos', 'maternidad_consciente', 'proteccion_familia'],
    temasQueEvita: ['ceremonias_largas'],

    contexto: 'Mama de 3. Poco tiempo pero muy comprometida. Lee todo, comenta poco.',

    frasesEjemplo: [
      'Perdon recien leo! Hermoso todo',
      'Rapidito: me encanto tu post',
      'No tengo tiempo pero las leo siempre',
      'Con los chicos es dificil pero hago lo que puedo'
    ]
  },

  // ─────────────────────────────────────────────────────────────
  // 12. MARTINA - La joven espiritual
  // ─────────────────────────────────────────────────────────────
  {
    id: 'martina',
    nombre: 'Martina',
    nombreCorto: 'Maru',
    avatar: 'M',
    email: 'martina.espiritual@gmail.com',
    personalidad: 'joven_espiritual',
    edad: 23,
    ubicacion: 'CABA, Argentina',
    tiempoMiembro: '4 meses',
    fechaIngreso: '2025-09-18',

    estiloEscritura: {
      extension: 'medio',
      usaEmojis: true,
      puntuacion: 'moderna',
      tono: 'entusiasta_fresco',
      muletillas: ['mal', 'tipo', 're', 'literal', 'amoooo']
    },

    guardianes: [
      { nombre: 'Heart', desde: '2025-09-15', conexion: 'fuerte' }
    ],

    intereses: ['tarot', 'astrologia', 'manifest', 'self_care_espiritual'],
    temasQueEvita: ['formalismos'],

    contexto: 'Estudiante de psicologia. Mezcla terapia con espiritualidad naturalmente.',

    frasesEjemplo: [
      'Literal esto me pasa TODO el tiempo',
      'Amoooo tu altar, re estetico',
      'Tipo, Heart me re banco cuando estaba mal',
      'Es re interesante pensarlo desde la psicologia tambien'
    ]
  },

  // ─────────────────────────────────────────────────────────────
  // 13. SUSANA - La herbolaria
  // ─────────────────────────────────────────────────────────────
  {
    id: 'susana',
    nombre: 'Susana',
    nombreCorto: 'Susi',
    avatar: 'SU',
    email: 'susana.hierbas@gmail.com',
    personalidad: 'herbolaria',
    edad: 55,
    ubicacion: 'Salto, Uruguay',
    tiempoMiembro: '8 meses',
    fechaIngreso: '2025-05-22',

    estiloEscritura: {
      extension: 'medio_largo',
      usaEmojis: false,
      puntuacion: 'descriptiva',
      tono: 'naturalista',
      muletillas: ['las plantas', 'en mi jardin', 'la naturaleza', 'cosecho']
    },

    guardianes: [
      { nombre: 'Gaia', desde: '2025-05-18', conexion: 'muy_fuerte' }
    ],

    intereses: ['hierbas_magicas', 'jardineria_sagrada', 'tinturas', 'ciclos_luna_plantas'],
    temasQueEvita: ['sintetico'],

    contexto: 'Tiene jardin enorme. Hace tinturas y sahumerios caseros. Conecta todo con plantas.',

    frasesEjemplo: [
      'Las plantas del jardin me dicen cuando hay luna llena antes de mirar el calendario.',
      'Cosecho lavanda solo de manana temprano. Gaia me enseno.',
      'La naturaleza es la mejor maestra. Mis guardianes viven entre las plantas.',
      'Te paso receta de sahumerio casero si queres.'
    ]
  },

  // ─────────────────────────────────────────────────────────────
  // 14. DIEGO - El unico hombre activo
  // ─────────────────────────────────────────────────────────────
  {
    id: 'diego',
    nombre: 'Diego',
    nombreCorto: 'Diego',
    avatar: 'D',
    email: 'diego.circulo@gmail.com',
    personalidad: 'masculino_sensible',
    edad: 42,
    ubicacion: 'Punta del Este, Uruguay',
    tiempoMiembro: '6 meses',
    fechaIngreso: '2025-07-12',

    estiloEscritura: {
      extension: 'medio',
      usaEmojis: false,
      puntuacion: 'equilibrada',
      tono: 'masculino_respetuoso',
      muletillas: ['che', 'desde mi experiencia', 'como hombre', 'les cuento']
    },

    guardianes: [
      { nombre: 'Astrid', desde: '2025-07-08', conexion: 'muy_fuerte' }
    ],

    intereses: ['runas', 'vikingos', 'proteccion', 'espiritualidad_masculina'],
    temasQueEvita: ['cosas_demasiado_dulces'],

    contexto: 'Chef. Le regalaron Astrid y se abrio a este mundo. Respetuoso pero diferente.',

    frasesEjemplo: [
      'Che, desde mi experiencia de hombre en este mundo tan femenino...',
      'Astrid es guerrera como yo. Nos entendemos.',
      'Les cuento que al principio me daba verguenza pero ahora...',
      'Como hombre me cuesta hablar de esto pero aca me siento comodo.'
    ]
  },

  // ─────────────────────────────────────────────────────────────
  // 15. FLORENCIA - La esoterica pro
  // ─────────────────────────────────────────────────────────────
  {
    id: 'florencia',
    nombre: 'Florencia',
    nombreCorto: 'Flor',
    avatar: 'FL',
    email: 'florencia.esoterica@gmail.com',
    personalidad: 'esoterica_profesional',
    edad: 44,
    ubicacion: 'Cordoba, Argentina',
    tiempoMiembro: '10 meses',
    fechaIngreso: '2025-03-25',

    estiloEscritura: {
      extension: 'largo',
      usaEmojis: false,
      puntuacion: 'tecnica',
      tono: 'profesional_mistico',
      muletillas: ['energeticamente', 'a nivel', 'el campo', 'la vibracion']
    },

    guardianes: [
      { nombre: 'Moon', desde: '2025-03-20', conexion: 'muy_fuerte' },
      { nombre: 'Merlin', desde: '2025-06-18', conexion: 'muy_fuerte' },
      { nombre: 'Abraham', desde: '2025-09-09', conexion: 'fuerte' }
    ],

    intereses: ['chamanismo', 'reiki', 'registros_akashicos', 'lecturas_profesionales'],
    temasQueEvita: ['simplificaciones'],

    contexto: 'Terapeuta holistico. Hace lecturas como trabajo. Aporta conocimiento tecnico.',

    frasesEjemplo: [
      'Energeticamente lo que describis es un bloqueo en el tercer chakra.',
      'A nivel vibracional, tu guardian esta elevando tu frecuencia.',
      'El campo energetico necesita limpieza. Te recomiendo palo santo.',
      'Moon me mostro algo en sesion que te quiero compartir.'
    ]
  },

  // ─────────────────────────────────────────────────────────────
  // 16. ANDREA - La escéptica convertida
  // ─────────────────────────────────────────────────────────────
  {
    id: 'andrea',
    nombre: 'Andrea',
    nombreCorto: 'Andre',
    avatar: 'AN',
    email: 'andrea.convertida@hotmail.com',
    personalidad: 'esceptica_convertida',
    edad: 39,
    ubicacion: 'Mar del Plata, Argentina',
    tiempoMiembro: '5 meses',
    fechaIngreso: '2025-08-30',

    estiloEscritura: {
      extension: 'medio',
      usaEmojis: true,
      puntuacion: 'narrativa',
      tono: 'testimonial',
      muletillas: ['yo antes', 'no creia', 'pero paso que', 'tuve que aceptar']
    },

    guardianes: [
      { nombre: 'Fortunato', desde: '2025-08-25', conexion: 'fuerte' }
    ],

    intereses: ['compartir_testimonio', 'ayudar_escepticos', 'experiencias_reales'],
    temasQueEvita: ['dogmas'],

    contexto: 'Abogada. Era muy esceptica. Una experiencia la cambio. Ahora cuenta su historia.',

    frasesEjemplo: [
      'Yo antes era la primera que se reia de esto. Pero paso algo...',
      'No creia en nada hasta que Fortunato llego a mi vida.',
      'Tuve que aceptar que hay cosas que no puedo explicar.',
      'Si yo pude abrirme, cualquiera puede. Paciencia con los escepticos.'
    ]
  },

  // ─────────────────────────────────────────────────────────────
  // 17. NATALIA - La buscadora
  // ─────────────────────────────────────────────────────────────
  {
    id: 'natalia',
    nombre: 'Natalia',
    nombreCorto: 'Nati',
    avatar: 'N',
    email: 'natalia.buscadora@gmail.com',
    personalidad: 'buscadora',
    edad: 31,
    ubicacion: 'Montevideo, Uruguay',
    tiempoMiembro: '1 mes',
    fechaIngreso: '2025-12-20',

    estiloEscritura: {
      extension: 'medio',
      usaEmojis: true,
      puntuacion: 'inquisitiva',
      tono: 'buscando_respuestas',
      muletillas: ['lei que', 'es cierto que', 'que opinan de', 'me recomiendan']
    },

    guardianes: [],
    guardianesDeseados: ['Valentina', 'Moonstone'],

    intereses: ['investigar_antes_comprar', 'comparar_experiencias', 'decidirse'],
    temasQueEvita: [],

    contexto: 'Todavia no tiene guardian. Esta decidiendo cual. Lee todo, pregunta mucho.',

    frasesEjemplo: [
      'Lei que Valentina es buena para el amor. Es cierto?',
      'Que opinan de tener varios guardianes desde el principio?',
      'Me recomiendan alguno para empezar?',
      'Estoy entre Moonstone y Valentina. Ayuda!'
    ]
  },

  // ─────────────────────────────────────────────────────────────
  // 18. MERCEDES - La matrona del grupo
  // ─────────────────────────────────────────────────────────────
  {
    id: 'mercedes',
    nombre: 'Mercedes',
    nombreCorto: 'Meche',
    avatar: 'ME',
    email: 'mercedes.matrona@yahoo.com',
    personalidad: 'matrona',
    edad: 61,
    ubicacion: 'Paysandu, Uruguay',
    tiempoMiembro: '12 meses',
    fechaIngreso: '2025-01-20',

    estiloEscritura: {
      extension: 'medio_largo',
      usaEmojis: false,
      puntuacion: 'ceremoniosa',
      tono: 'protector_maternal',
      muletillas: ['queridas', 'las abrazo', 'cuidense', 'siempre estoy']
    },

    guardianes: [
      { nombre: 'Zoe', desde: '2025-01-15', conexion: 'muy_fuerte' },
      { nombre: 'Toto', desde: '2025-04-20', conexion: 'muy_fuerte' },
      { nombre: 'Ruperto', desde: '2025-08-08', conexion: 'fuerte' }
    ],

    intereses: ['cuidar_grupo', 'contener_nuevas', 'tradiciones', 'rituales_familiares'],
    temasQueEvita: ['conflictos'],

    contexto: 'Una de las primeras. Todos la respetan. Contiene cuando hay drama.',

    frasesEjemplo: [
      'Queridas, las abrazo a todas. Este grupo es un refugio.',
      'Cuidense mucho. Siempre estoy por aca si necesitan.',
      'Respetemos las diferencias. Cada camino es valido.',
      'Las que recien llegan: bienvenidas a esta familia.'
    ]
  },

  // ─────────────────────────────────────────────────────────────
  // 19. CAMILA - La influencer espiritual
  // ─────────────────────────────────────────────────────────────
  {
    id: 'camila',
    nombre: 'Camila',
    nombreCorto: 'Cami',
    avatar: 'CA',
    email: 'camila.influencer@gmail.com',
    personalidad: 'influencer',
    edad: 27,
    ubicacion: 'Buenos Aires, Argentina',
    tiempoMiembro: '6 meses',
    fechaIngreso: '2025-07-25',

    estiloEscritura: {
      extension: 'corto_medio',
      usaEmojis: true,
      puntuacion: 'moderna_viral',
      tono: 'trendy_espiritual',
      muletillas: ['les muestro', 'reel', 'viral', 'aesthetic', 'manifesto']
    },

    guardianes: [
      { nombre: 'Heart', desde: '2025-07-20', conexion: 'fuerte' }
    ],

    intereses: ['contenido_visual', 'estetica_espiritual', 'manifestacion', 'branding_personal'],
    temasQueEvita: ['cosas_densas'],

    contexto: 'Tiene cuenta de Instagram espiritual. Comparte contenido visual. Moderna.',

    frasesEjemplo: [
      'Les muestro mi altar nuevo? Quedo re aesthetic',
      'Hice un reel de mi ritual matutino, les paso el link?',
      'Manifeste esto que les cuento, literal funciono',
      'El guardian es mega fotogenico jaja'
    ]
  },

  // ─────────────────────────────────────────────────────────────
  // 20. GRACIELA - La silenciosa
  // ─────────────────────────────────────────────────────────────
  {
    id: 'graciela',
    nombre: 'Graciela',
    nombreCorto: 'Graci',
    avatar: 'GR',
    email: 'graciela.silenciosa@hotmail.com',
    personalidad: 'silenciosa',
    edad: 49,
    ubicacion: 'Neuquen, Argentina',
    tiempoMiembro: '7 meses',
    fechaIngreso: '2025-06-18',

    estiloEscritura: {
      extension: 'muy_corto',
      usaEmojis: true,
      puntuacion: 'minima',
      tono: 'observador',
      muletillas: ['hermoso', 'gracias', 'me encanto', 'abrazo']
    },

    guardianes: [
      { nombre: 'Brianna', desde: '2025-06-15', conexion: 'fuerte' }
    ],

    intereses: ['leer', 'observar', 'apoyar_silenciosamente'],
    temasQueEvita: ['protagonismo'],

    contexto: 'Lee todo pero casi no comenta. Cuando lo hace es breve pero carinoso.',

    frasesEjemplo: [
      'Hermoso',
      'Gracias por compartir',
      'Me encanto. Abrazo',
      'Leyendo en silencio pero presente'
    ]
  }
];

// ═══════════════════════════════════════════════════════════════════════════════
// FUNCIONES AUXILIARES
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Obtiene un perfil por su ID
 */
export function obtenerPerfilPorId(id) {
  return MIEMBROS_FUNDADORES.find(m => m.id === id) || null;
}

/**
 * Obtiene un perfil aleatorio
 */
export function obtenerPerfilAleatorio() {
  return MIEMBROS_FUNDADORES[Math.floor(Math.random() * MIEMBROS_FUNDADORES.length)];
}

/**
 * Obtiene perfiles aleatorios sin repetir
 */
export function obtenerPerfilesAleatorios(cantidad) {
  const shuffled = [...MIEMBROS_FUNDADORES].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, cantidad);
}

/**
 * Selecciona un perfil apropiado segun el contexto
 */
export function seleccionarPerfilSegunContexto(contexto) {
  const { tipo, guardian, tema, esRespuesta = false } = contexto;

  let candidatos = [...MIEMBROS_FUNDADORES];

  // Si es sobre un guardian especifico, priorizar quien lo tiene
  if (guardian) {
    const conGuardian = candidatos.filter(m =>
      m.guardianes.some(g => g.nombre.toLowerCase() === guardian.toLowerCase())
    );
    if (conGuardian.length > 0) {
      candidatos = conGuardian;
    }
  }

  // Filtrar por tema de interes
  if (tema) {
    const interesados = candidatos.filter(m =>
      m.intereses.some(i => i.includes(tema.toLowerCase()) || tema.toLowerCase().includes(i))
    );
    if (interesados.length > 0) {
      candidatos = interesados;
    }
  }

  // Para respuestas cortas, preferir ciertos perfiles
  if (esRespuesta && tipo === 'agradecimiento') {
    const apropiados = candidatos.filter(m =>
      m.personalidad === 'silenciosa' ||
      m.personalidad === 'emocional' ||
      m.estiloEscritura.extension === 'corto'
    );
    if (apropiados.length > 0) {
      candidatos = apropiados;
    }
  }

  // Para preguntas, preferir curiosos o nuevos
  if (tipo === 'pregunta') {
    const apropiados = candidatos.filter(m =>
      m.personalidad === 'curiosa' ||
      m.personalidad === 'buscadora' ||
      m.personalidad === 'esceptico_abierto'
    );
    if (apropiados.length > 0) {
      candidatos = apropiados;
    }
  }

  // Para experiencias profundas, preferir reflexivos o misticos
  if (tipo === 'experiencia') {
    const apropiados = candidatos.filter(m =>
      m.personalidad === 'mistica' ||
      m.personalidad === 'reflexivo' ||
      m.personalidad === 'emocional'
    );
    if (apropiados.length > 0) {
      candidatos = apropiados;
    }
  }

  return candidatos[Math.floor(Math.random() * candidatos.length)];
}

/**
 * Obtiene perfiles que tienen cierto guardian
 */
export function perfilesConGuardian(nombreGuardian) {
  return MIEMBROS_FUNDADORES.filter(m =>
    m.guardianes.some(g => g.nombre.toLowerCase() === nombreGuardian.toLowerCase())
  );
}

/**
 * Obtiene perfiles por personalidad
 */
export function perfilesPorPersonalidad(personalidad) {
  return MIEMBROS_FUNDADORES.filter(m => m.personalidad === personalidad);
}

/**
 * Obtiene perfiles activos (mas de 3 meses de miembro)
 */
export function perfilesActivos() {
  const tresMesesAtras = new Date();
  tresMesesAtras.setMonth(tresMesesAtras.getMonth() - 3);

  return MIEMBROS_FUNDADORES.filter(m =>
    new Date(m.fechaIngreso) < tresMesesAtras
  );
}

/**
 * Obtiene perfiles nuevos (menos de 2 meses)
 */
export function perfilesNuevos() {
  const dosMesesAtras = new Date();
  dosMesesAtras.setMonth(dosMesesAtras.getMonth() - 2);

  return MIEMBROS_FUNDADORES.filter(m =>
    new Date(m.fechaIngreso) >= dosMesesAtras
  );
}

// Exportar todo
export default {
  MIEMBROS_FUNDADORES,
  GUARDIANES_MENCIONADOS,
  obtenerPerfilPorId,
  obtenerPerfilAleatorio,
  obtenerPerfilesAleatorios,
  seleccionarPerfilSegunContexto,
  perfilesConGuardian,
  perfilesPorPersonalidad,
  perfilesActivos,
  perfilesNuevos
};
