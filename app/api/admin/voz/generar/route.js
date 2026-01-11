// API para generar voz con Eleven Labs
// Sistema completo de voces - IDs verificados de la biblioteca pública
// Actualizado con 60+ voces premium organizadas por categorías

// ═══════════════════════════════════════════════════════════════
// CATÁLOGO COMPLETO DE VOCES (IDs verificados de ElevenLabs)
// ═══════════════════════════════════════════════════════════════

const CATALOGO_VOCES = {
  // ═══════════════════════════════════════════════════════════════
  // VOCES PROPIAS DE DUENDES (Clones personalizados)
  // ═══════════════════════════════════════════════════════════════
  'thibisay': {
    id: 'ofSX50hgXXAqhe3nRhJI',
    nombre: 'Thibisay',
    categoria: 'duendes',
    genero: 'femenino',
    edad: 'adulta',
    estilo: 'cálida',
    descripcion: 'La voz oficial de Duendes del Uruguay',
    personalidad: 'Mágica, maternal, sabia',
    icono: '🌟',
    premium: true,
    recomendada: true
  },
  'thibisay-pro': {
    id: 'knhUzs4lao5jJEzGotGw',
    nombre: 'Thibisay Pro',
    categoria: 'duendes',
    genero: 'femenino',
    edad: 'adulta',
    estilo: 'profesional',
    descripcion: 'Clon profesional de alta calidad',
    personalidad: 'Refinada, clara, elegante',
    icono: '✨',
    premium: true
  },

  // ═══════════════════════════════════════════════════════════════
  // VOCES EN ESPAÑOL (Acento rioplatense, latino y español)
  // ═══════════════════════════════════════════════════════════════
  'agustin': {
    id: 'ByVRQtaK1WDOvTmP1PKO',
    nombre: 'Agustín',
    categoria: 'espanol',
    genero: 'masculino',
    edad: 'adulto',
    estilo: 'conversacional',
    descripcion: 'Voz argentina relajada y cercana',
    personalidad: 'Cálido, accesible, natural',
    icono: '🇦🇷',
    acento: 'rioplatense',
    recomendada: true
  },
  'malena-tango': {
    id: '1WXz8v08ntDcSTeVXMN2',
    nombre: 'Malena Tango',
    categoria: 'espanol',
    genero: 'femenino',
    edad: 'adulta',
    estilo: 'storyteller',
    descripcion: 'Voz argentina clara y melodiosa, perfecta para narración',
    personalidad: 'Melodiosa, expresiva, cautivadora',
    icono: '🎭',
    acento: 'rioplatense',
    recomendada: true
  },

  // ═══════════════════════════════════════════════════════════════
  // VOCES FEMENINAS PREMIUM (Biblioteca ElevenLabs)
  // ═══════════════════════════════════════════════════════════════
  'rachel': {
    id: '21m00Tcm4TlvDq8ikWAM',
    nombre: 'Rachel',
    categoria: 'femeninas',
    genero: 'femenino',
    edad: 'adulta',
    estilo: 'narradora',
    descripcion: 'Voz americana cálida, perfecta para narración',
    personalidad: 'Amigable, clara, profesional',
    icono: '📖',
    recomendada: true
  },
  'sarah': {
    id: 'EXAVITQu4vr4xnSDxMaL',
    nombre: 'Sarah',
    categoria: 'femeninas',
    genero: 'femenino',
    edad: 'joven',
    estilo: 'suave',
    descripcion: 'Voz suave e íntima, ideal para meditaciones',
    personalidad: 'Serena, dulce, reconfortante',
    icono: '🌸',
    recomendada: true
  },
  'alice': {
    id: 'Xb7hH8MSUJpSbSDYk0k2',
    nombre: 'Alice',
    categoria: 'femeninas',
    genero: 'femenino',
    edad: 'joven',
    estilo: 'británica',
    descripcion: 'Voz británica sofisticada y clara',
    personalidad: 'Elegante, inteligente, refinada',
    icono: '🎀'
  },
  'domi': {
    id: 'AZnzlk1XvdvUeBnXmlld',
    nombre: 'Domi',
    categoria: 'femeninas',
    genero: 'femenino',
    edad: 'joven',
    estilo: 'fuerte',
    descripcion: 'Voz joven con personalidad fuerte',
    personalidad: 'Decidida, clara, segura',
    icono: '⚡'
  },
  'charlotte': {
    id: 'XB0fDUnXU5powFXDhCwa',
    nombre: 'Charlotte',
    categoria: 'femeninas',
    genero: 'femenino',
    edad: 'madura',
    estilo: 'elegante',
    descripcion: 'Voz elegante estilo europeo',
    personalidad: 'Refinada, sabia, maternal',
    icono: '👑',
    recomendada: true
  },
  'dorothy': {
    id: 'ThT5KcBeYPX3keUQqHPh',
    nombre: 'Dorothy',
    categoria: 'femeninas',
    genero: 'femenino',
    edad: 'joven',
    estilo: 'agradable',
    descripcion: 'Voz británica joven y amigable',
    personalidad: 'Cercana, simpática, natural',
    icono: '🌻'
  },
  'glinda': {
    id: 'z9fAnlkpzviPz146aGWa',
    nombre: 'Glinda',
    categoria: 'femeninas',
    genero: 'femenino',
    edad: 'madura',
    estilo: 'maternal',
    descripcion: 'Voz cálida y maternal, como una abuela',
    personalidad: 'Protectora, amorosa, sabia',
    icono: '🧡',
    recomendada: true
  },
  'grace': {
    id: 'oWAxZDx7w5VEj9dCyTzz',
    nombre: 'Grace',
    categoria: 'femeninas',
    genero: 'femenino',
    edad: 'adulta',
    estilo: 'sureña',
    descripcion: 'Voz americana con acento sureño cálido',
    personalidad: 'Cálida, acogedora, amable',
    icono: '🌺'
  },
  'serena': {
    id: 'pMsXgVXv3BLzUgSXRplE',
    nombre: 'Serena',
    categoria: 'femeninas',
    genero: 'femenino',
    edad: 'adulta',
    estilo: 'calma',
    descripcion: 'Voz perfecta para meditaciones y relajación',
    personalidad: 'Tranquila, serena, guía espiritual',
    icono: '🧘',
    recomendada: true
  },
  'emily': {
    id: 'LcfcDJNUP1GQjkzn1xUU',
    nombre: 'Emily',
    categoria: 'femeninas',
    genero: 'femenino',
    edad: 'joven',
    estilo: 'dulce',
    descripcion: 'Voz joven y dulce',
    personalidad: 'Tierna, amigable, jovial',
    icono: '🌷'
  },
  'freya': {
    id: 'jsCqWAovK2LkecY7zXl4',
    nombre: 'Freya',
    categoria: 'femeninas',
    genero: 'femenino',
    edad: 'joven',
    estilo: 'dinámica',
    descripcion: 'Voz energética y vibrante',
    personalidad: 'Enérgica, optimista, inspiradora',
    icono: '🔥'
  },
  'gigi': {
    id: 'jBpfuIE2acCO8z3wKNLl',
    nombre: 'Gigi',
    categoria: 'femeninas',
    genero: 'femenino',
    edad: 'joven',
    estilo: 'animada',
    descripcion: 'Voz animada y expresiva',
    personalidad: 'Divertida, expresiva, carismática',
    icono: '🎭'
  },
  'jessie': {
    id: 't0jbNlBVZ17f02VDIeMI',
    nombre: 'Jessie',
    categoria: 'femeninas',
    genero: 'femenino',
    edad: 'adulta',
    estilo: 'conversacional',
    descripcion: 'Voz conversacional natural',
    personalidad: 'Natural, cercana, auténtica',
    icono: '💬'
  },
  'lily': {
    id: 'pFZP5JQG7iQjIQuC4Bku',
    nombre: 'Lily',
    categoria: 'femeninas',
    genero: 'femenino',
    edad: 'joven',
    estilo: 'británica',
    descripcion: 'Voz británica joven y cálida',
    personalidad: 'Cálida, inteligente, acogedora',
    icono: '🌺'
  },
  'matilda': {
    id: 'XrExE9yKIg1WjnnlVkGX',
    nombre: 'Matilda',
    categoria: 'femeninas',
    genero: 'femenino',
    edad: 'adulta',
    estilo: 'cálida',
    descripcion: 'Voz cálida y reconfortante',
    personalidad: 'Acogedora, maternal, sabia',
    icono: '🍂'
  },
  'mimi': {
    id: 'zrHiDhphv9ZnVXBqCLjz',
    nombre: 'Mimi',
    categoria: 'femeninas',
    genero: 'femenino',
    edad: 'joven',
    estilo: 'suave',
    descripcion: 'Voz suave y gentil',
    personalidad: 'Delicada, suave, tranquila',
    icono: '🦋'
  },
  'nicole': {
    id: 'piTKgcLEGmPE4e6mEKli',
    nombre: 'Nicole',
    categoria: 'femeninas',
    genero: 'femenino',
    edad: 'adulta',
    estilo: 'profesional',
    descripcion: 'Voz profesional y clara',
    personalidad: 'Profesional, confiable, clara',
    icono: '💼'
  },

  // ═══════════════════════════════════════════════════════════════
  // VOCES MASCULINAS PREMIUM (Biblioteca ElevenLabs)
  // ═══════════════════════════════════════════════════════════════
  'adam': {
    id: 'pNInz6obpgDQGcFmaJgB',
    nombre: 'Adam',
    categoria: 'masculinas',
    genero: 'masculino',
    edad: 'adulto',
    estilo: 'profunda',
    descripcion: 'Voz profunda ideal para narración épica',
    personalidad: 'Autoritario, confiable, sabio',
    icono: '🎭',
    recomendada: true
  },
  'josh': {
    id: 'TxGEqnHWrfWFTfGW9XjX',
    nombre: 'Josh',
    categoria: 'masculinas',
    genero: 'masculino',
    edad: 'joven',
    estilo: 'profunda',
    descripcion: 'Voz joven y profunda',
    personalidad: 'Dinámico, seguro, moderno',
    icono: '🌊'
  },
  'arnold': {
    id: 'VR6AewLTigWG4xSOukaG',
    nombre: 'Arnold',
    categoria: 'masculinas',
    genero: 'masculino',
    edad: 'adulto',
    estilo: 'nítida',
    descripcion: 'Voz nítida y potente',
    personalidad: 'Misterioso, potente, imponente',
    icono: '⚡'
  },
  'antoni': {
    id: 'ErXwobaYiN019PkySvjV',
    nombre: 'Antoni',
    categoria: 'masculinas',
    genero: 'masculino',
    edad: 'joven',
    estilo: 'amigable',
    descripcion: 'Voz joven y amigable',
    personalidad: 'Cercano, natural, simpático',
    icono: '😊'
  },
  'sam': {
    id: 'yoZ06aMxZJJ28mfd3POQ',
    nombre: 'Sam',
    categoria: 'masculinas',
    genero: 'masculino',
    edad: 'joven',
    estilo: 'rasposa',
    descripcion: 'Voz joven con tono rasposo',
    personalidad: 'Rebelde, auténtico, cool',
    icono: '🎸'
  },
  'clyde': {
    id: '2EiwWnXFnvU5JabPnv8n',
    nombre: 'Clyde',
    categoria: 'masculinas',
    genero: 'masculino',
    edad: 'anciano',
    estilo: 'veterano',
    descripcion: 'Voz de anciano experimentado y sabio',
    personalidad: 'Sabio, cálido, abuelo',
    icono: '🧓',
    recomendada: true
  },
  'harry': {
    id: 'SOYHLrjzK2X1ezoPC6cr',
    nombre: 'Harry',
    categoria: 'masculinas',
    genero: 'masculino',
    edad: 'adulto',
    estilo: 'expresiva',
    descripcion: 'Voz muy expresiva y versátil',
    personalidad: 'Dramático, expresivo, artístico',
    icono: '🎪'
  },
  'patrick': {
    id: 'ODq5zmih8GrVes37Dizd',
    nombre: 'Patrick',
    categoria: 'masculinas',
    genero: 'masculino',
    edad: 'maduro',
    estilo: 'natural',
    descripcion: 'Voz profunda y natural',
    personalidad: 'Tranquilo, confiable, estable',
    icono: '🌿',
    recomendada: true
  },
  'bill': {
    id: 'pqHfZKP75CvOlQylNhV4',
    nombre: 'Bill',
    categoria: 'masculinas',
    genero: 'masculino',
    edad: 'adulto',
    estilo: 'americana',
    descripcion: 'Voz americana clásica',
    personalidad: 'Confiable, amigable, accesible',
    icono: '🇺🇸'
  },
  'brian': {
    id: 'nPczCjzI2devNBz1zQrb',
    nombre: 'Brian',
    categoria: 'masculinas',
    genero: 'masculino',
    edad: 'adulto',
    estilo: 'profunda',
    descripcion: 'Voz profunda y autoritaria',
    personalidad: 'Serio, profesional, imponente',
    icono: '🎙️'
  },
  'callum': {
    id: 'N2lVS1w4EtoT3dr4eOWO',
    nombre: 'Callum',
    categoria: 'masculinas',
    genero: 'masculino',
    edad: 'joven',
    estilo: 'versátil',
    descripcion: 'Voz versátil y dinámica',
    personalidad: 'Adaptable, energético, moderno',
    icono: '🎯'
  },
  'charlie': {
    id: 'IKne3meq5aSn9XLyUdCD',
    nombre: 'Charlie',
    categoria: 'masculinas',
    genero: 'masculino',
    edad: 'joven',
    estilo: 'casual',
    descripcion: 'Voz casual y relajada',
    personalidad: 'Relajado, amigable, natural',
    icono: '☕'
  },
  'chris': {
    id: 'iP95p4xoKVk53GoZ742B',
    nombre: 'Chris',
    categoria: 'masculinas',
    genero: 'masculino',
    edad: 'adulto',
    estilo: 'clara',
    descripcion: 'Voz clara y articulada',
    personalidad: 'Claro, preciso, profesional',
    icono: '📢'
  },
  'daniel': {
    id: 'onwK4e9ZLuTAKqWW03F9',
    nombre: 'Daniel',
    categoria: 'masculinas',
    genero: 'masculino',
    edad: 'adulto',
    estilo: 'británica',
    descripcion: 'Voz británica distinguida',
    personalidad: 'Sofisticado, educado, elegante',
    icono: '🎩'
  },
  'dave': {
    id: 'CYw3kZ02Hs0563khs1Fj',
    nombre: 'Dave',
    categoria: 'masculinas',
    genero: 'masculino',
    edad: 'adulto',
    estilo: 'americana',
    descripcion: 'Voz americana informal',
    personalidad: 'Casual, amigable, accesible',
    icono: '🤙'
  },
  'drew': {
    id: '29vD33N1CtxCmqQRPOHJ',
    nombre: 'Drew',
    categoria: 'masculinas',
    genero: 'masculino',
    edad: 'joven',
    estilo: 'energética',
    descripcion: 'Voz joven y energética',
    personalidad: 'Entusiasta, dinámico, motivador',
    icono: '🚀'
  },
  'ethan': {
    id: 'g5CIjZEefAph4nQFvHAz',
    nombre: 'Ethan',
    categoria: 'masculinas',
    genero: 'masculino',
    edad: 'joven',
    estilo: 'natural',
    descripcion: 'Voz joven y natural',
    personalidad: 'Auténtico, cercano, genuino',
    icono: '🌱'
  },
  'fin': {
    id: 'D38z5RcWu1voky8WS1ja',
    nombre: 'Fin',
    categoria: 'masculinas',
    genero: 'masculino',
    edad: 'joven',
    estilo: 'irlandesa',
    descripcion: 'Voz con acento irlandés',
    personalidad: 'Encantador, amigable, cálido',
    icono: '🍀'
  },
  'george': {
    id: 'JBFqnCBsd6RMkjVDRZzb',
    nombre: 'George',
    categoria: 'masculinas',
    genero: 'masculino',
    edad: 'maduro',
    estilo: 'británica',
    descripcion: 'Voz británica madura y elegante',
    personalidad: 'Distinguido, sabio, refinado',
    icono: '🎓'
  },
  'giovanni': {
    id: 'zcAOhNBS3c14rBihAFp1',
    nombre: 'Giovanni',
    categoria: 'masculinas',
    genero: 'masculino',
    edad: 'adulto',
    estilo: 'italiana',
    descripcion: 'Voz con acento italiano',
    personalidad: 'Apasionado, expresivo, carismático',
    icono: '🇮🇹'
  },
  'james': {
    id: 'ZQe5CZNOzWyzPSCn5a3c',
    nombre: 'James',
    categoria: 'masculinas',
    genero: 'masculino',
    edad: 'maduro',
    estilo: 'autoridad',
    descripcion: 'Voz madura con autoridad',
    personalidad: 'Autoritario, confiable, líder',
    icono: '👔'
  },
  'jeremy': {
    id: 'bVMeCyTHy58xNoL34h3p',
    nombre: 'Jeremy',
    categoria: 'masculinas',
    genero: 'masculino',
    edad: 'adulto',
    estilo: 'narrativa',
    descripcion: 'Voz ideal para narración',
    personalidad: 'Envolvente, cautivador, narrador',
    icono: '📚'
  },
  'joseph': {
    id: 'Zlb1dXrM653N07WRdFW3',
    nombre: 'Joseph',
    categoria: 'masculinas',
    genero: 'masculino',
    edad: 'maduro',
    estilo: 'cálida',
    descripcion: 'Voz madura y cálida',
    personalidad: 'Paternal, sabio, reconfortante',
    icono: '🏠'
  },
  'liam': {
    id: 'TX3LPaxmHKxFdv7VOQHJ',
    nombre: 'Liam',
    categoria: 'masculinas',
    genero: 'masculino',
    edad: 'joven',
    estilo: 'irlandesa',
    descripcion: 'Voz joven con toque irlandés',
    personalidad: 'Amable, encantador, juvenil',
    icono: '🌿'
  },
  'michael': {
    id: 'flq6f7yk4E4fJM5XTYuZ',
    nombre: 'Michael',
    categoria: 'masculinas',
    genero: 'masculino',
    edad: 'adulto',
    estilo: 'americana',
    descripcion: 'Voz americana versátil',
    personalidad: 'Versátil, profesional, confiable',
    icono: '🎬'
  },
  'paul': {
    id: '5Q0t7uMcjvnagumLfvZi',
    nombre: 'Paul',
    categoria: 'masculinas',
    genero: 'masculino',
    edad: 'adulto',
    estilo: 'informativa',
    descripcion: 'Voz clara e informativa',
    personalidad: 'Informativo, claro, didáctico',
    icono: '📰'
  },
  'thomas': {
    id: 'GBv7mTt0atIp3Br8iCZE',
    nombre: 'Thomas',
    categoria: 'masculinas',
    genero: 'masculino',
    edad: 'adulto',
    estilo: 'profunda',
    descripcion: 'Voz profunda y resonante',
    personalidad: 'Profundo, impactante, memorable',
    icono: '🎵'
  },

  // ═══════════════════════════════════════════════════════════════
  // PERSONAJES MÁGICOS Y MÍSTICOS
  // ═══════════════════════════════════════════════════════════════
  'merlin': {
    id: '2EiwWnXFnvU5JabPnv8n', // Clyde
    nombre: 'Merlín',
    categoria: 'misticos',
    genero: 'masculino',
    edad: 'anciano',
    estilo: 'sabia',
    descripcion: 'El gran hechicero, sabio y milenario',
    personalidad: 'Sabio, misterioso, poderoso',
    intro: "Saludos, viajero del tiempo. Soy Merlín, hechicero y alquimista milenario...\n\n",
    icono: '🧙‍♂️',
    recomendada: true
  },
  'hechicero': {
    id: 'VR6AewLTigWG4xSOukaG', // Arnold
    nombre: 'Hechicero Oscuro',
    categoria: 'misticos',
    genero: 'masculino',
    edad: 'adulto',
    estilo: 'misteriosa',
    descripcion: 'Guardián de secretos ancestrales',
    personalidad: 'Misterioso, profundo, enigmático',
    intro: "Bienvenida, alma curiosa. Soy un hechicero ancestral, guardián de los secretos...\n\n",
    icono: '🔮'
  },
  'druida': {
    id: 'ODq5zmih8GrVes37Dizd', // Patrick
    nombre: 'Druida del Bosque',
    categoria: 'misticos',
    genero: 'masculino',
    edad: 'maduro',
    estilo: 'natural',
    descripcion: 'Conectado con la madre tierra',
    personalidad: 'Sereno, natural, sabio',
    intro: "Paz y armonía, caminante. Soy un druida conectado con la madre tierra...\n\n",
    icono: '🌿'
  },
  'anciano-sabio': {
    id: '2EiwWnXFnvU5JabPnv8n', // Clyde
    nombre: 'Anciano Sabio',
    categoria: 'misticos',
    genero: 'masculino',
    edad: 'anciano',
    estilo: 'ancestral',
    descripcion: 'Guardián de la sabiduría antigua',
    personalidad: 'Abuelo cósmico, tierno, protector',
    intro: "Querida nieta del universo, soy un anciano guardián de la sabiduría antigua...\n\n",
    icono: '👴'
  },
  'oraculo': {
    id: 'z9fAnlkpzviPz146aGWa', // Glinda
    nombre: 'Oráculo',
    categoria: 'misticos',
    genero: 'femenino',
    edad: 'ancestral',
    estilo: 'enigmática',
    descripcion: 'Voz del oráculo que revela destinos',
    personalidad: 'Misteriosa, profética, sabia',
    intro: "Las estrellas me han hablado de ti... Soy el Oráculo...\n\n",
    icono: '🌙'
  },
  'alquimista': {
    id: 'JBFqnCBsd6RMkjVDRZzb', // George
    nombre: 'Alquimista',
    categoria: 'misticos',
    genero: 'masculino',
    edad: 'maduro',
    estilo: 'sabia',
    descripcion: 'Maestro de la transmutación',
    personalidad: 'Meticuloso, sabio, transformador',
    intro: "En el crisol de la vida, todo puede transmutarse... Soy el Alquimista...\n\n",
    icono: '⚗️'
  },
  'chamana': {
    id: 'XrExE9yKIg1WjnnlVkGX', // Matilda
    nombre: 'Chamana',
    categoria: 'misticos',
    genero: 'femenino',
    edad: 'madura',
    estilo: 'ancestral',
    descripcion: 'Puente entre mundos',
    personalidad: 'Espiritual, conectada, guía',
    intro: "Los espíritus me guían... Soy la Chamana que camina entre mundos...\n\n",
    icono: '🪶'
  },
  'vidente': {
    id: 'pMsXgVXv3BLzUgSXRplE', // Serena
    nombre: 'Vidente',
    categoria: 'misticos',
    genero: 'femenino',
    edad: 'adulta',
    estilo: 'etérea',
    descripcion: 'Ve más allá del velo',
    personalidad: 'Intuitiva, serena, clarividente',
    intro: "Veo lo que otros no pueden ver... El velo se abre ante ti...\n\n",
    icono: '👁️'
  },
  'guardian-secretos': {
    id: 'pNInz6obpgDQGcFmaJgB', // Adam
    nombre: 'Guardián de Secretos',
    categoria: 'misticos',
    genero: 'masculino',
    edad: 'adulto',
    estilo: 'enigmática',
    descripcion: 'Custodio de conocimientos ocultos',
    personalidad: 'Misterioso, protector, sabio',
    intro: "He guardado secretos por eones... Ahora te revelaré uno...\n\n",
    icono: '🗝️'
  },

  // ═══════════════════════════════════════════════════════════════
  // SERES MÁGICOS Y ELEMENTALES
  // ═══════════════════════════════════════════════════════════════
  'hada': {
    id: 'jBpfuIE2acCO8z3wKNLl', // Gigi
    nombre: 'Hada del Bosque',
    categoria: 'magicos',
    genero: 'femenino',
    edad: 'joven',
    estilo: 'etérea',
    descripcion: 'Voz etérea y mágica de hada',
    personalidad: 'Dulce, juguetona, luminosa',
    intro: "¡Hola, ser de luz! Soy un hada del bosque encantado...\n\n",
    icono: '🧚'
  },
  'ninfa': {
    id: 'EXAVITQu4vr4xnSDxMaL', // Sarah
    nombre: 'Ninfa del Agua',
    categoria: 'magicos',
    genero: 'femenino',
    edad: 'joven',
    estilo: 'fluida',
    descripcion: 'Espíritu del agua, voz cristalina',
    personalidad: 'Serena, fluida, purificadora',
    intro: "Como el agua que fluye, te doy la bienvenida...\n\n",
    icono: '💧'
  },
  'dryada': {
    id: 'z9fAnlkpzviPz146aGWa', // Glinda
    nombre: 'Dríada',
    categoria: 'magicos',
    genero: 'femenino',
    edad: 'antigua',
    estilo: 'terrenal',
    descripcion: 'Espíritu del árbol, voz de la naturaleza',
    personalidad: 'Sabia, paciente, protectora',
    intro: "Mis raíces conocen los secretos de la tierra...\n\n",
    icono: '🌳'
  },
  'sirena': {
    id: 'pFZP5JQG7iQjIQuC4Bku', // Lily
    nombre: 'Sirena',
    categoria: 'magicos',
    genero: 'femenino',
    edad: 'joven',
    estilo: 'encantadora',
    descripcion: 'Voz encantadora del océano',
    personalidad: 'Seductora, misteriosa, melodiosa',
    intro: "Desde las profundidades del mar, te canto...\n\n",
    icono: '🧜‍♀️'
  },
  'duende-guardian': {
    id: 'ErXwobaYiN019PkySvjV', // Antoni
    nombre: 'Duende Guardián',
    categoria: 'magicos',
    genero: 'masculino',
    edad: 'joven',
    estilo: 'juguetona',
    descripcion: 'Duende protector del hogar',
    personalidad: 'Travieso, leal, protector',
    intro: "¡Shh! Soy el duende guardián de este lugar mágico...\n\n",
    icono: '🍀'
  },
  'gnomo-sabio': {
    id: '2EiwWnXFnvU5JabPnv8n', // Clyde
    nombre: 'Gnomo Sabio',
    categoria: 'magicos',
    genero: 'masculino',
    edad: 'anciano',
    estilo: 'sabia',
    descripcion: 'Gnomo anciano conocedor de tesoros',
    personalidad: 'Sabio, astuto, generoso',
    intro: "He vivido bajo tierra por siglos, y conozco todos sus secretos...\n\n",
    icono: '🧙'
  },
  'elemental-fuego': {
    id: 'VR6AewLTigWG4xSOukaG', // Arnold
    nombre: 'Elemental de Fuego',
    categoria: 'magicos',
    genero: 'masculino',
    edad: 'ancestral',
    estilo: 'intensa',
    descripcion: 'Espíritu del fuego transformador',
    personalidad: 'Apasionado, poderoso, transformador',
    intro: "Ardo con la llama eterna de la transformación...\n\n",
    icono: '🔥'
  },
  'elemental-aire': {
    id: 'jsCqWAovK2LkecY7zXl4', // Freya
    nombre: 'Elemental del Aire',
    categoria: 'magicos',
    genero: 'femenino',
    edad: 'joven',
    estilo: 'libre',
    descripcion: 'Espíritu del viento y la libertad',
    personalidad: 'Libre, veloz, mensajera',
    intro: "Viajo con el viento, llevando mensajes entre mundos...\n\n",
    icono: '💨'
  },
  'espiritu-luna': {
    id: 'XB0fDUnXU5powFXDhCwa', // Charlotte
    nombre: 'Espíritu de la Luna',
    categoria: 'magicos',
    genero: 'femenino',
    edad: 'ancestral',
    estilo: 'mística',
    descripcion: 'Guardiana de los ciclos lunares',
    personalidad: 'Mística, cíclica, iluminadora',
    intro: "Bajo mi luz plateada, los secretos se revelan...\n\n",
    icono: '🌙'
  },

  // ═══════════════════════════════════════════════════════════════
  // PERSONAJES TIERNOS Y RECONFORTANTES
  // ═══════════════════════════════════════════════════════════════
  'abuela-magica': {
    id: 'z9fAnlkpzviPz146aGWa', // Glinda
    nombre: 'Abuela Mágica',
    categoria: 'tiernos',
    genero: 'femenino',
    edad: 'anciana',
    estilo: 'amorosa',
    descripcion: 'Como una abuela que cuenta cuentos',
    personalidad: 'Amorosa, sabia, reconfortante',
    intro: "Ven, siéntate junto al fuego, querida... Tengo una historia para ti...\n\n",
    icono: '👵',
    recomendada: true
  },
  'guardian-bosque': {
    id: 'ODq5zmih8GrVes37Dizd', // Patrick
    nombre: 'Guardián del Bosque',
    categoria: 'tiernos',
    genero: 'masculino',
    edad: 'adulto',
    estilo: 'protectora',
    descripcion: 'Protector gentil de las criaturas',
    personalidad: 'Gentil, protector, cariñoso',
    intro: "El bosque te da la bienvenida bajo mi cuidado...\n\n",
    icono: '🦌'
  },
  'madre-tierra': {
    id: 'XB0fDUnXU5powFXDhCwa', // Charlotte
    nombre: 'Madre Tierra',
    categoria: 'tiernos',
    genero: 'femenino',
    edad: 'madura',
    estilo: 'maternal',
    descripcion: 'Voz de la madre naturaleza',
    personalidad: 'Maternal, protectora, sabia',
    intro: "Todos mis hijos son bienvenidos en mi regazo...\n\n",
    icono: '🌍'
  },
  'hada-madrina': {
    id: 'XrExE9yKIg1WjnnlVkGX', // Matilda
    nombre: 'Hada Madrina',
    categoria: 'tiernos',
    genero: 'femenino',
    edad: 'madura',
    estilo: 'bondadosa',
    descripcion: 'Tu hada madrina personal',
    personalidad: 'Bondadosa, mágica, protectora',
    intro: "Bibidi babidi bu... Tu hada madrina ha llegado...\n\n",
    icono: '✨'
  },
  'abuelo-cuentos': {
    id: '2EiwWnXFnvU5JabPnv8n', // Clyde
    nombre: 'Abuelo de los Cuentos',
    categoria: 'tiernos',
    genero: 'masculino',
    edad: 'anciano',
    estilo: 'cálida',
    descripcion: 'El abuelo que cuenta las mejores historias',
    personalidad: 'Tierno, sabio, narrador',
    intro: "¿Te conté la historia de...? Ah, claro que no... Ven, escucha...\n\n",
    icono: '📖'
  },
  'angel-guardian': {
    id: 'pMsXgVXv3BLzUgSXRplE', // Serena
    nombre: 'Ángel Guardián',
    categoria: 'tiernos',
    genero: 'femenino',
    edad: 'celestial',
    estilo: 'celestial',
    descripcion: 'Tu ángel protector',
    personalidad: 'Protector, amoroso, celestial',
    intro: "Siempre estoy contigo, velando por tu camino...\n\n",
    icono: '👼'
  },
  'santa': {
    id: 'knrPHWnBmmDHMoiMeP3l',
    nombre: 'Papá Noel',
    categoria: 'tiernos',
    genero: 'masculino',
    edad: 'anciano',
    estilo: 'jovial',
    descripcion: 'El mismísimo Santa Claus',
    personalidad: 'Alegre, generoso, bondadoso',
    intro: "¡Jo jo jo! ¿Has sido bueno este año?\n\n",
    icono: '🎅'
  },

  // ═══════════════════════════════════════════════════════════════
  // VOCES PARA MEDITACIÓN Y MINDFULNESS
  // ═══════════════════════════════════════════════════════════════
  'guia-meditacion': {
    id: 'pMsXgVXv3BLzUgSXRplE', // Serena
    nombre: 'Guía de Meditación',
    categoria: 'meditacion',
    genero: 'femenino',
    edad: 'adulta',
    estilo: 'serena',
    descripcion: 'Voz perfecta para meditaciones guiadas',
    personalidad: 'Serena, calmada, reconfortante',
    icono: '🧘',
    recomendada: true
  },
  'sanador': {
    id: 'ODq5zmih8GrVes37Dizd', // Patrick
    nombre: 'Sanador',
    categoria: 'meditacion',
    genero: 'masculino',
    edad: 'maduro',
    estilo: 'reconfortante',
    descripcion: 'Voz masculina calmada para sanación',
    personalidad: 'Paciente, sabio, sanador',
    icono: '💚'
  },
  'voz-interior': {
    id: 'EXAVITQu4vr4xnSDxMaL', // Sarah
    nombre: 'Voz Interior',
    categoria: 'meditacion',
    genero: 'femenino',
    edad: 'joven',
    estilo: 'suave',
    descripcion: 'Como tu propia voz interior',
    personalidad: 'Íntima, suave, personal',
    icono: '💭'
  },
  'maestro-zen': {
    id: 'JBFqnCBsd6RMkjVDRZzb', // George
    nombre: 'Maestro Zen',
    categoria: 'meditacion',
    genero: 'masculino',
    edad: 'maduro',
    estilo: 'mindful',
    descripcion: 'Maestro de la paz interior',
    personalidad: 'Tranquilo, sabio, presente',
    icono: '☯️'
  },
  'guia-respiracion': {
    id: 'zrHiDhphv9ZnVXBqCLjz', // Mimi
    nombre: 'Guía de Respiración',
    categoria: 'meditacion',
    genero: 'femenino',
    edad: 'joven',
    estilo: 'rítmica',
    descripcion: 'Perfecta para ejercicios de respiración',
    personalidad: 'Rítmica, calmada, guía',
    icono: '🌬️'
  },
  'coach-mindfulness': {
    id: '21m00Tcm4TlvDq8ikWAM', // Rachel
    nombre: 'Coach Mindfulness',
    categoria: 'meditacion',
    genero: 'femenino',
    edad: 'adulta',
    estilo: 'profesional',
    descripcion: 'Coach profesional de atención plena',
    personalidad: 'Profesional, cálida, guía',
    icono: '🎯'
  },
  'voz-calma': {
    id: 'XrExE9yKIg1WjnnlVkGX', // Matilda
    nombre: 'Voz de la Calma',
    categoria: 'meditacion',
    genero: 'femenino',
    edad: 'adulta',
    estilo: 'tranquila',
    descripcion: 'Serenidad en cada palabra',
    personalidad: 'Serena, equilibrada, pacífica',
    icono: '🕊️'
  },
  'terapeuta-sonidos': {
    id: 'Zlb1dXrM653N07WRdFW3', // Joseph
    nombre: 'Terapeuta de Sonidos',
    categoria: 'meditacion',
    genero: 'masculino',
    edad: 'maduro',
    estilo: 'terapéutica',
    descripcion: 'Voz para terapia de sonido',
    personalidad: 'Sanador, profundo, armonioso',
    icono: '🔔'
  },

  // ═══════════════════════════════════════════════════════════════
  // NARRADORES PROFESIONALES
  // ═══════════════════════════════════════════════════════════════
  'narradora': {
    id: '21m00Tcm4TlvDq8ikWAM', // Rachel
    nombre: 'Narradora',
    categoria: 'narradores',
    genero: 'femenino',
    edad: 'adulta',
    estilo: 'profesional',
    descripcion: 'Voz profesional para narración',
    personalidad: 'Clara, profesional, envolvente',
    icono: '📚',
    recomendada: true
  },
  'narrador': {
    id: 'pNInz6obpgDQGcFmaJgB', // Adam
    nombre: 'Narrador',
    categoria: 'narradores',
    genero: 'masculino',
    edad: 'maduro',
    estilo: 'profesional',
    descripcion: 'Voz masculina profunda para narración',
    personalidad: 'Autoritario, claro, profesional',
    icono: '🎙️',
    recomendada: true
  },
  'narrador-cuentos': {
    id: 'SOYHLrjzK2X1ezoPC6cr', // Harry
    nombre: 'Narrador de Cuentos',
    categoria: 'narradores',
    genero: 'masculino',
    edad: 'adulto',
    estilo: 'expresiva',
    descripcion: 'Perfecto para cuentos infantiles',
    personalidad: 'Expresivo, mágico, cautivador',
    icono: '📖'
  },
  'narradora-documentales': {
    id: 'piTKgcLEGmPE4e6mEKli', // Nicole
    nombre: 'Narradora Documentales',
    categoria: 'narradores',
    genero: 'femenino',
    edad: 'adulta',
    estilo: 'informativa',
    descripcion: 'Ideal para documentales y educación',
    personalidad: 'Informativa, clara, profesional',
    icono: '🎬'
  },
  'narrador-misterio': {
    id: 'VR6AewLTigWG4xSOukaG', // Arnold
    nombre: 'Narrador de Misterio',
    categoria: 'narradores',
    genero: 'masculino',
    edad: 'adulto',
    estilo: 'misteriosa',
    descripcion: 'Crea atmósfera de suspenso',
    personalidad: 'Misterioso, envolvente, dramático',
    icono: '🔍'
  },
  'narradora-romantica': {
    id: 'XB0fDUnXU5powFXDhCwa', // Charlotte
    nombre: 'Narradora Romántica',
    categoria: 'narradores',
    genero: 'femenino',
    edad: 'madura',
    estilo: 'emotiva',
    descripcion: 'Para historias de amor',
    personalidad: 'Emotiva, cálida, romántica',
    icono: '💝'
  },
  'narrador-epico': {
    id: 'nPczCjzI2devNBz1zQrb', // Brian
    nombre: 'Narrador Épico',
    categoria: 'narradores',
    genero: 'masculino',
    edad: 'adulto',
    estilo: 'épica',
    descripcion: 'Para historias épicas y aventuras',
    personalidad: 'Épico, grandioso, inspirador',
    icono: '⚔️'
  },
  'narradora-intimista': {
    id: 't0jbNlBVZ17f02VDIeMI', // Jessie
    nombre: 'Narradora Intimista',
    categoria: 'narradores',
    genero: 'femenino',
    edad: 'adulta',
    estilo: 'íntima',
    descripcion: 'Para historias personales',
    personalidad: 'Cercana, íntima, personal',
    icono: '🌸'
  },

  // ═══════════════════════════════════════════════════════════════
  // VOCES JÓVENES Y ENERGÉTICAS
  // ═══════════════════════════════════════════════════════════════
  'joven-alegre': {
    id: 'jsCqWAovK2LkecY7zXl4', // Freya
    nombre: 'Joven Alegre',
    categoria: 'jovenes',
    genero: 'femenino',
    edad: 'joven',
    estilo: 'energética',
    descripcion: 'Llena de energía y optimismo',
    personalidad: 'Optimista, vibrante, motivadora',
    icono: '🌟'
  },
  'chico-cool': {
    id: 'yoZ06aMxZJJ28mfd3POQ', // Sam
    nombre: 'Chico Cool',
    categoria: 'jovenes',
    genero: 'masculino',
    edad: 'joven',
    estilo: 'moderna',
    descripcion: 'Voz juvenil y moderna',
    personalidad: 'Cool, auténtico, relajado',
    icono: '🎸'
  },
  'estudiante': {
    id: 'AZnzlk1XvdvUeBnXmlld', // Domi
    nombre: 'Estudiante',
    categoria: 'jovenes',
    genero: 'femenino',
    edad: 'joven',
    estilo: 'natural',
    descripcion: 'Como una estudiante universitaria',
    personalidad: 'Inteligente, curiosa, natural',
    icono: '📚'
  },
  'aventurero': {
    id: '29vD33N1CtxCmqQRPOHJ', // Drew
    nombre: 'Aventurero',
    categoria: 'jovenes',
    genero: 'masculino',
    edad: 'joven',
    estilo: 'entusiasta',
    descripcion: 'Listo para la aventura',
    personalidad: 'Aventurero, entusiasta, valiente',
    icono: '🏔️'
  },
  'influencer': {
    id: 'jBpfuIE2acCO8z3wKNLl', // Gigi
    nombre: 'Influencer',
    categoria: 'jovenes',
    genero: 'femenino',
    edad: 'joven',
    estilo: 'moderna',
    descripcion: 'Voz de redes sociales',
    personalidad: 'Trendy, carismática, conectada',
    icono: '📱'
  },
  'gamer': {
    id: 'g5CIjZEefAph4nQFvHAz', // Ethan
    nombre: 'Gamer',
    categoria: 'jovenes',
    genero: 'masculino',
    edad: 'joven',
    estilo: 'gamer',
    descripcion: 'Para contenido gaming',
    personalidad: 'Gamer, entusiasta, competitivo',
    icono: '🎮'
  },

  // ═══════════════════════════════════════════════════════════════
  // ANCIANOS SABIOS
  // ═══════════════════════════════════════════════════════════════
  'anciana-sabia': {
    id: 'z9fAnlkpzviPz146aGWa', // Glinda
    nombre: 'Anciana Sabia',
    categoria: 'ancianos',
    genero: 'femenino',
    edad: 'anciana',
    estilo: 'sabia',
    descripcion: 'Sabiduría de muchas vidas',
    personalidad: 'Sabia, compasiva, guía',
    icono: '🦉',
    recomendada: true
  },
  'viejo-sabio': {
    id: '2EiwWnXFnvU5JabPnv8n', // Clyde
    nombre: 'Viejo Sabio',
    categoria: 'ancianos',
    genero: 'masculino',
    edad: 'anciano',
    estilo: 'ancestral',
    descripcion: 'Guardián del conocimiento antiguo',
    personalidad: 'Sabio, paciente, maestro',
    icono: '🧙',
    recomendada: true
  },
  'curandera': {
    id: 'XrExE9yKIg1WjnnlVkGX', // Matilda
    nombre: 'Curandera',
    categoria: 'ancianos',
    genero: 'femenino',
    edad: 'madura',
    estilo: 'sanadora',
    descripcion: 'Conocedora de remedios ancestrales',
    personalidad: 'Sanadora, sabia, protectora',
    icono: '🌿'
  },
  'ermitano': {
    id: 'Zlb1dXrM653N07WRdFW3', // Joseph
    nombre: 'Ermitaño',
    categoria: 'ancianos',
    genero: 'masculino',
    edad: 'anciano',
    estilo: 'contemplativa',
    descripcion: 'Sabio solitario de la montaña',
    personalidad: 'Contemplativo, profundo, iluminado',
    icono: '🏔️'
  },
  'abuela-luna': {
    id: 'oWAxZDx7w5VEj9dCyTzz', // Grace
    nombre: 'Abuela Luna',
    categoria: 'ancianos',
    genero: 'femenino',
    edad: 'anciana',
    estilo: 'cósmica',
    descripcion: 'Guardiana de los ciclos lunares',
    personalidad: 'Mística, maternal, cíclica',
    icono: '🌙'
  },

  // ═══════════════════════════════════════════════════════════════
  // PERSONAJES DE FANTASÍA
  // ═══════════════════════════════════════════════════════════════
  'principe-elfo': {
    id: 'onwK4e9ZLuTAKqWW03F9', // Daniel
    nombre: 'Príncipe Elfo',
    categoria: 'fantasia',
    genero: 'masculino',
    edad: 'joven',
    estilo: 'elegante',
    descripcion: 'Nobleza élfica',
    personalidad: 'Noble, elegante, sabio',
    icono: '🧝‍♂️'
  },
  'princesa-elfina': {
    id: 'Xb7hH8MSUJpSbSDYk0k2', // Alice
    nombre: 'Princesa Elfina',
    categoria: 'fantasia',
    genero: 'femenino',
    edad: 'joven',
    estilo: 'etérea',
    descripcion: 'Realeza del bosque encantado',
    personalidad: 'Graciosa, sabia, luminosa',
    icono: '🧝‍♀️'
  },
  'dragon-anciano': {
    id: 'pNInz6obpgDQGcFmaJgB', // Adam
    nombre: 'Dragón Anciano',
    categoria: 'fantasia',
    genero: 'masculino',
    edad: 'ancestral',
    estilo: 'profunda',
    descripcion: 'Voz de dragón milenario',
    personalidad: 'Antiguo, poderoso, sabio',
    intro: "He visto imperios nacer y caer... Escucha mi sabiduría...\n\n",
    icono: '🐉'
  },
  'unicornio': {
    id: 'pFZP5JQG7iQjIQuC4Bku', // Lily
    nombre: 'Unicornio',
    categoria: 'fantasia',
    genero: 'femenino',
    edad: 'mágica',
    estilo: 'pura',
    descripcion: 'Pureza y magia',
    personalidad: 'Puro, mágico, sanador',
    icono: '🦄'
  },
  'fenix': {
    id: 'jsCqWAovK2LkecY7zXl4', // Freya
    nombre: 'Fénix',
    categoria: 'fantasia',
    genero: 'femenino',
    edad: 'eterna',
    estilo: 'renacida',
    descripcion: 'Ave de fuego y renacimiento',
    personalidad: 'Renaciente, poderosa, eterna',
    intro: "De las cenizas renazco, más fuerte que antes...\n\n",
    icono: '🔥'
  },
  'guardian-portal': {
    id: 'VR6AewLTigWG4xSOukaG', // Arnold
    nombre: 'Guardián del Portal',
    categoria: 'fantasia',
    genero: 'masculino',
    edad: 'eterno',
    estilo: 'imponente',
    descripcion: 'Custodia las puertas entre mundos',
    personalidad: 'Imponente, justo, protector',
    intro: "Alto ahí, viajero. Solo los dignos pueden pasar...\n\n",
    icono: '🚪'
  }
};

// Mapa simple de IDs para compatibilidad
const VOCES = Object.fromEntries(
  Object.entries(CATALOGO_VOCES).map(([key, value]) => [key, value.id])
);

// Categorías para el UI - 12 categorías especializadas
const CATEGORIAS_VOCES = {
  duendes: { nombre: 'Voces Duendes', icono: '🌟', descripcion: 'Voces oficiales de Duendes del Uruguay', orden: 1 },
  espanol: { nombre: 'Voces en Español', icono: '🇦🇷', descripcion: 'Acento rioplatense, latino y español - nativas', orden: 2 },
  femeninas: { nombre: 'Voces Femeninas', icono: '👩', descripcion: 'Voces de mujer premium - varias edades y estilos', orden: 3 },
  masculinas: { nombre: 'Voces Masculinas', icono: '👨', descripcion: 'Voces de hombre premium - varias edades y estilos', orden: 4 },
  misticos: { nombre: 'Místicos y Sabios', icono: '🔮', descripcion: 'Hechiceros, oráculos, alquimistas y chamanes', orden: 5 },
  magicos: { nombre: 'Seres Mágicos', icono: '🧚', descripcion: 'Hadas, ninfas, elementales y criaturas encantadas', orden: 6 },
  tiernos: { nombre: 'Tiernos y Amorosos', icono: '🍄', descripcion: 'Abuelas, ángeles y personajes reconfortantes', orden: 7 },
  meditacion: { nombre: 'Meditación y Mindfulness', icono: '🧘', descripcion: 'Voces serenas para meditación, sanación y respiración', orden: 8 },
  narradores: { nombre: 'Narradores Profesionales', icono: '🎙️', descripcion: 'Voces para cuentos, documentales, misterio y épica', orden: 9 },
  jovenes: { nombre: 'Jóvenes y Energéticos', icono: '⚡', descripcion: 'Voces juveniles, modernas y llenas de energía', orden: 10 },
  ancianos: { nombre: 'Ancianos Sabios', icono: '🦉', descripcion: 'Voces de sabiduría ancestral y experiencia', orden: 11 },
  fantasia: { nombre: 'Fantasía y Leyendas', icono: '🐉', descripcion: 'Elfos, dragones, unicornios y criaturas míticas', orden: 12 }
};

// Configuraciones de voz por tipo de contenido
const VOZ_SETTINGS = {
  meditacion: { stability: 0.80, similarity_boost: 0.5, style: 0.2 },   // Muy lento, muy calmado
  ritual: { stability: 0.70, similarity_boost: 0.65, style: 0.35 },     // Místico, pausado
  sanacion: { stability: 0.75, similarity_boost: 0.55, style: 0.25 },   // Suave, reconfortante
  cuento: { stability: 0.55, similarity_boost: 0.75, style: 0.6 },      // Expresivo, narrativo
  leccion: { stability: 0.60, similarity_boost: 0.70, style: 0.45 },    // Claro, didáctico
  mensaje: { stability: 0.50, similarity_boost: 0.80, style: 0.55 },    // Personal, emotivo
  narracion: { stability: 0.55, similarity_boost: 0.75, style: 0.5 },   // Normal
  personaje: { stability: 0.45, similarity_boost: 0.85, style: 0.7 },   // Muy expresivo
  divertido: { stability: 0.40, similarity_boost: 0.85, style: 0.8 },   // Animado
  default: { stability: 0.60, similarity_boost: 0.70, style: 0.4 }
};

// Texto de muestra para preview de voces
const TEXTO_MUESTRA = "Bienvenida al mundo mágico de los duendes. Aquí encontrarás sabiduría ancestral y amor infinito.";

export async function POST(request) {
  try {
    const { texto, voz = 'thibisay', modelo = 'eleven_multilingual_v2', tipo = 'default', conIntro = false, preview = false } = await request.json();

    // Si es preview, usar texto de muestra
    const textoBase = preview ? TEXTO_MUESTRA : texto;

    if (!textoBase) {
      return Response.json({
        success: false,
        error: 'El texto es requerido'
      }, { status: 400 });
    }

    const apiKey = process.env.ELEVENLABS_API_KEY;
    if (!apiKey) {
      return Response.json({
        success: false,
        error: 'ELEVENLABS_API_KEY no configurada'
      }, { status: 500 });
    }

    // Obtener info de la voz del catálogo
    const vozInfo = CATALOGO_VOCES[voz] || CATALOGO_VOCES['thibisay'];

    // Agregar intro si tiene y se solicita
    let textoFinal = textoBase;
    if (conIntro && vozInfo.intro) {
      textoFinal = vozInfo.intro + textoBase;
    }

    // Obtener settings según tipo de contenido
    const settings = VOZ_SETTINGS[tipo] || VOZ_SETTINGS.default;

    let voiceId = vozInfo.id || VOCES['thibisay'];

    // Función para llamar a Eleven Labs
    async function llamarElevenLabs(vid) {
      return await fetch(
        `https://api.elevenlabs.io/v1/text-to-speech/${vid}`,
        {
          method: 'POST',
          headers: {
            'Accept': 'audio/mpeg',
            'Content-Type': 'application/json',
            'xi-api-key': apiKey
          },
          body: JSON.stringify({
            text: textoFinal,
            model_id: modelo,
            voice_settings: {
              stability: settings.stability,
              similarity_boost: settings.similarity_boost,
              style: settings.style,
              use_speaker_boost: true
            }
          })
        }
      );
    }

    // Intentar con la voz seleccionada
    let response = await llamarElevenLabs(voiceId);

    // Si falla con 404, intentar con Thibisay rápido, luego Rachel
    if (response.status === 404) {
      console.log('Voz no encontrada, probando Thibisay rápido');
      voiceId = 'ofSX50hgXXAqhe3nRhJI';
      response = await llamarElevenLabs(voiceId);

      if (response.status === 404) {
        console.log('Thibisay rápido no encontrado, usando Rachel');
        voiceId = VOCES.rachel;
        response = await llamarElevenLabs(voiceId);
      }
    }

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Error Eleven Labs:', errorData);
      return Response.json({
        success: false,
        error: `Error de Eleven Labs: ${response.status}`
      }, { status: response.status });
    }

    // Convertir a base64
    const audioBuffer = await response.arrayBuffer();
    const base64Audio = Buffer.from(audioBuffer).toString('base64');

    return Response.json({
      success: true,
      audio: base64Audio,
      formato: 'audio/mpeg',
      voz: voz,
      vozInfo: {
        id: voz,
        nombre: vozInfo.nombre,
        categoria: vozInfo.categoria,
        genero: vozInfo.genero,
        icono: vozInfo.icono
      },
      vozUsada: voiceId,
      tipo: tipo,
      conIntro: conIntro && !!vozInfo.intro,
      caracteres: textoFinal.length,
      preview: preview || false
    });

  } catch (error) {
    console.error('Error generando voz:', error);
    return Response.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}

// GET - Listar voces disponibles con catálogo completo
export async function GET(request) {
  const url = new URL(request.url);
  const categoria = url.searchParams.get('categoria');
  const genero = url.searchParams.get('genero');

  // Convertir catálogo a array con filtros
  let voces = Object.entries(CATALOGO_VOCES).map(([id, voz]) => ({
    id,
    ...voz,
    tieneIntro: !!voz.intro
  }));

  // Filtrar por categoría si se especifica
  if (categoria) {
    voces = voces.filter(v => v.categoria === categoria);
  }

  // Filtrar por género si se especifica
  if (genero) {
    voces = voces.filter(v => v.genero === genero);
  }

  // Agrupar por categoría
  const vocesPorCategoria = {};
  Object.entries(CATEGORIAS_VOCES).forEach(([catId, catInfo]) => {
    const vocesDeCategoria = voces.filter(v => v.categoria === catId);
    if (vocesDeCategoria.length > 0) {
      vocesPorCategoria[catId] = {
        ...catInfo,
        voces: vocesDeCategoria
      };
    }
  });

  return Response.json({
    success: true,
    categorias: CATEGORIAS_VOCES,
    vocesPorCategoria,
    todasLasVoces: voces,
    total: voces.length,
    filtros: {
      categoriasDisponibles: Object.keys(CATEGORIAS_VOCES),
      generosDisponibles: ['femenino', 'masculino', 'neutro'],
      edadesDisponibles: ['niña', 'niño', 'adolescente', 'joven', 'adulta', 'adulto', 'madura', 'maduro', 'anciana', 'anciano', 'antigua']
    },
    tiposAudio: Object.entries(VOZ_SETTINGS).map(([id, settings]) => ({
      id,
      nombre: id.charAt(0).toUpperCase() + id.slice(1),
      settings
    })),
    modelos: [
      { id: 'eleven_multilingual_v2', nombre: 'Multilingüe v2 (recomendado)', soportaEspanol: true },
      { id: 'eleven_turbo_v2_5', nombre: 'Turbo v2.5 (más rápido)', soportaEspanol: true }
    ],
    textoMuestra: TEXTO_MUESTRA
  });
}
