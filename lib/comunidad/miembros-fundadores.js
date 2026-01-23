// ═══════════════════════════════════════════════════════════════════════════════
// MIEMBROS FUNDADORES DEL CIRCULO
// 50 perfiles realistas con personalidades distintivas para poblar la comunidad
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
  { nombre: 'Astrid', especie: 'vikinga', categoria: 'proteccion' },
  { nombre: 'Aurora', especie: 'hada', categoria: 'amor' },
  { nombre: 'Celestine', especie: 'bruja', categoria: 'sabiduria' },
  { nombre: 'Daphne', especie: 'ninfa', categoria: 'sanacion' },
  { nombre: 'Elowen', especie: 'elfa', categoria: 'proteccion' },
  { nombre: 'Freya', especie: 'vikinga', categoria: 'amor' }
];

// ═══════════════════════════════════════════════════════════════════════════════
// 50 PERFILES DE MIEMBROS FUNDADORES
// ═══════════════════════════════════════════════════════════════════════════════

export const MIEMBROS_FUNDADORES = [
  // ─────────────────────────────────────────────────────────────
  // 1. MARIA DEL CARMEN - La veterana entusiasta
  // ─────────────────────────────────────────────────────────────
  {
    id: 'maria-del-carmen',
    nombre: 'Maria del Carmen Perez',
    nombreCorto: 'Mari',
    avatar: '🌸',
    pais: 'Uruguay',
    edad: 54,
    personalidad: 'entusiasta',
    tiempoMiembro: '2 años',
    guardianes: ['Ruperto', 'Moonstone', 'Toto'],
    temasInteres: ['rituales', 'luna', 'altares', 'cristales'],
    estilo: {
      longitud: 'largo',
      usaEmojis: true,
      formalidad: 'coloquial',
      caracteristicas: ['cuenta historias', 'da la bienvenida a nuevas', 'muy agradecida']
    },
    frasesTypo: ['ay nena', 'les cuento', 'jajaja', 'la verdad es que'],
    actividadBase: 'alta'
  },

  // ─────────────────────────────────────────────────────────────
  // 2. GASTON - El reflexivo profundo
  // ─────────────────────────────────────────────────────────────
  {
    id: 'gaston',
    nombre: 'Gaston Fernandez',
    nombreCorto: 'Gaston',
    avatar: '🌿',
    pais: 'Argentina',
    edad: 38,
    personalidad: 'reflexivo',
    tiempoMiembro: '1 año',
    guardianes: ['Merlin'],
    temasInteres: ['meditacion', 'simbolismo', 'suenos', 'filosofia'],
    estilo: {
      longitud: 'medio',
      usaEmojis: false,
      formalidad: 'formal',
      caracteristicas: ['hace preguntas profundas', 'cita poetas', 'respuestas pensadas']
    },
    frasesTypo: ['me pregunto si', 'interesante', 'hay algo ahi'],
    actividadBase: 'media'
  },

  // ─────────────────────────────────────────────────────────────
  // 3. LUCIANA - La nueva curiosa
  // ─────────────────────────────────────────────────────────────
  {
    id: 'luciana',
    nombre: 'Luciana Martinez',
    nombreCorto: 'Lu',
    avatar: '🦋',
    pais: 'Argentina',
    edad: 26,
    personalidad: 'curiosa',
    tiempoMiembro: 'recien llegue',
    guardianes: ['Heart'],
    temasInteres: ['aprender', 'conexion', 'experiencias de otras'],
    estilo: {
      longitud: 'medio',
      usaEmojis: true,
      formalidad: 'muy informal',
      caracteristicas: ['hace muchas preguntas', 'agradece consejos', 'entusiasta']
    },
    frasesTypo: ['perdon si es tonta la pregunta', 'recien empiezo', 'ustedes que piensan?'],
    actividadBase: 'alta'
  },

  // ─────────────────────────────────────────────────────────────
  // 4. SOLEDAD - La mistica profunda
  // ─────────────────────────────────────────────────────────────
  {
    id: 'soledad',
    nombre: 'Soledad Aguirre',
    nombreCorto: 'Sole',
    avatar: '🔮',
    pais: 'Argentina',
    edad: 47,
    personalidad: 'mistica',
    tiempoMiembro: '18 meses',
    guardianes: ['Sennua', 'Amy', 'Liam'],
    temasInteres: ['registros akashicos', 'vidas pasadas', 'sincronicidades', 'tarot'],
    estilo: {
      longitud: 'largo',
      usaEmojis: false,
      formalidad: 'formal',
      caracteristicas: ['ve senales en todo', 'interpreta suenos', 'habla de energia']
    },
    frasesTypo: ['no es casualidad', 'siento que', 'el universo'],
    actividadBase: 'alta'
  },

  // ─────────────────────────────────────────────────────────────
  // 5. PATRICIA - La practica organizadora
  // ─────────────────────────────────────────────────────────────
  {
    id: 'patricia',
    nombre: 'Patricia Gomez',
    nombreCorto: 'Pato',
    avatar: '📋',
    pais: 'Uruguay',
    edad: 41,
    personalidad: 'practica',
    tiempoMiembro: '8 meses',
    guardianes: ['Brianna'],
    temasInteres: ['rituales simples', 'organizacion', 'rutinas', 'consejos practicos'],
    estilo: {
      longitud: 'corto',
      usaEmojis: false,
      formalidad: 'coloquial',
      caracteristicas: ['va al grano', 'da tips concretos', 'ahorra tiempo']
    },
    frasesTypo: ['lo que a mi me funciona', 'proba esto', 'simple'],
    actividadBase: 'media'
  },

  // ─────────────────────────────────────────────────────────────
  // 6. ROMINA - La emocional agradecida
  // ─────────────────────────────────────────────────────────────
  {
    id: 'romina',
    nombre: 'Romina Sosa',
    nombreCorto: 'Romi',
    avatar: '💖',
    pais: 'Argentina',
    edad: 33,
    personalidad: 'emocional',
    tiempoMiembro: '6 meses',
    guardianes: ['Emilio'],
    temasInteres: ['sanacion emocional', 'apoyo mutuo', 'transformacion', 'duelos'],
    estilo: {
      longitud: 'largo',
      usaEmojis: true,
      formalidad: 'coloquial',
      caracteristicas: ['comparte vulnerabilidades', 'muy agradecida', 'abraza virtual']
    },
    frasesTypo: ['me hiciste llorar', 'gracias gracias', 'necesitaba leer esto'],
    actividadBase: 'alta'
  },

  // ─────────────────────────────────────────────────────────────
  // 7. FERNANDO - El esceptico en conversion
  // ─────────────────────────────────────────────────────────────
  {
    id: 'fernando',
    nombre: 'Fernando Riquelme',
    nombreCorto: 'Fer',
    avatar: '🤔',
    pais: 'Chile',
    edad: 49,
    personalidad: 'esceptico',
    tiempoMiembro: '4 meses',
    guardianes: ['Bjorn'],
    temasInteres: ['experiencias verificables', 'logica', 'hechos'],
    estilo: {
      longitud: 'medio',
      usaEmojis: false,
      formalidad: 'formal',
      caracteristicas: ['pide evidencias', 'respeta pero cuestiona', 'va abriendose']
    },
    frasesTypo: ['no se si creo pero', 'curiosamente', 'me cuesta aceptar'],
    actividadBase: 'baja'
  },

  // ─────────────────────────────────────────────────────────────
  // 8. CAROLINA - La organizadora comunitaria
  // ─────────────────────────────────────────────────────────────
  {
    id: 'carolina',
    nombre: 'Carolina Mendez',
    nombreCorto: 'Caro',
    avatar: '✨',
    pais: 'Argentina',
    edad: 35,
    personalidad: 'organizador',
    tiempoMiembro: '14 meses',
    guardianes: ['Rafael', 'Fortunato'],
    temasInteres: ['comunidad', 'eventos grupales', 'colaboracion', 'rituales colectivos'],
    estilo: {
      longitud: 'medio',
      usaEmojis: true,
      formalidad: 'coloquial',
      caracteristicas: ['propone actividades', 'coordina', 'incluye a todas']
    },
    frasesTypo: ['que les parece si', 'organicemonos', 'podriamos'],
    actividadBase: 'alta'
  },

  // ─────────────────────────────────────────────────────────────
  // 9. ELENA - La abuela sabia
  // ─────────────────────────────────────────────────────────────
  {
    id: 'elena',
    nombre: 'Elena Rodriguez',
    nombreCorto: 'Ele',
    avatar: '🕯️',
    pais: 'Uruguay',
    edad: 68,
    personalidad: 'reflexivo',
    tiempoMiembro: '2 años',
    guardianes: ['Toto', 'Zoe'],
    temasInteres: ['tradiciones', 'sabiduria', 'acompanar nuevas', 'paciencia'],
    estilo: {
      longitud: 'medio',
      usaEmojis: false,
      formalidad: 'formal',
      caracteristicas: ['da consejos como abuela', 'cuenta del pasado', 'calma']
    },
    frasesTypo: ['hijita', 'a mi edad', 'con paciencia', 'los anos ensenan'],
    actividadBase: 'media'
  },

  // ─────────────────────────────────────────────────────────────
  // 10. AGUSTINA - La artista visual
  // ─────────────────────────────────────────────────────────────
  {
    id: 'agustina',
    nombre: 'Agustina Bentancor',
    nombreCorto: 'Agus',
    avatar: '🎨',
    pais: 'Uruguay',
    edad: 29,
    personalidad: 'artístico',
    tiempoMiembro: '11 meses',
    guardianes: ['Groen'],
    temasInteres: ['arte espiritual', 'altares esteticos', 'creatividad', 'colores'],
    estilo: {
      longitud: 'medio',
      usaEmojis: true,
      formalidad: 'muy informal',
      caracteristicas: ['comparte fotos', 'describe visual', 'inspira crear']
    },
    frasesTypo: ['imaginate', 'pinte algo', 'me inspiro'],
    actividadBase: 'alta'
  },

  // ─────────────────────────────────────────────────────────────
  // 11. VALERIA - La mama ocupada
  // ─────────────────────────────────────────────────────────────
  {
    id: 'valeria',
    nombre: 'Valeria Sanchez',
    nombreCorto: 'Vale',
    avatar: '🌻',
    pais: 'Argentina',
    edad: 37,
    personalidad: 'practica',
    tiempoMiembro: '5 meses',
    guardianes: ['Valentina'],
    temasInteres: ['rituales rapidos', 'familia', 'proteccion hijos', 'equilibrio'],
    estilo: {
      longitud: 'corto',
      usaEmojis: true,
      formalidad: 'muy informal',
      caracteristicas: ['escribe rapido', 'poco tiempo', 'agradecida']
    },
    frasesTypo: ['perdon recien leo', 'rapidito', 'con los chicos'],
    actividadBase: 'baja'
  },

  // ─────────────────────────────────────────────────────────────
  // 12. MARTINA - La joven espiritual
  // ─────────────────────────────────────────────────────────────
  {
    id: 'martina',
    nombre: 'Martina Lopez',
    nombreCorto: 'Maru',
    avatar: '🌙',
    pais: 'Argentina',
    edad: 23,
    personalidad: 'entusiasta',
    tiempoMiembro: '7 meses',
    guardianes: ['Heart'],
    temasInteres: ['tarot', 'astrologia', 'manifest', 'selfcare espiritual'],
    estilo: {
      longitud: 'medio',
      usaEmojis: true,
      formalidad: 'muy informal',
      caracteristicas: ['usa jerga joven', 'muy expresiva', 'conecta con pares']
    },
    frasesTypo: ['literal', 'mal', 'tipo', 're', 'amoooo'],
    actividadBase: 'alta'
  },

  // ─────────────────────────────────────────────────────────────
  // 13. SUSANA - La herbolaria
  // ─────────────────────────────────────────────────────────────
  {
    id: 'susana',
    nombre: 'Susana Olivera',
    nombreCorto: 'Susi',
    avatar: '🌿',
    pais: 'Uruguay',
    edad: 57,
    personalidad: 'practica',
    tiempoMiembro: '16 meses',
    guardianes: ['Gaia'],
    temasInteres: ['hierbas', 'jardineria sagrada', 'sahumerios caseros', 'luna y plantas'],
    estilo: {
      longitud: 'medio',
      usaEmojis: false,
      formalidad: 'coloquial',
      caracteristicas: ['comparte recetas', 'habla de plantas', 'conecta con naturaleza']
    },
    frasesTypo: ['en mi jardin', 'las plantas', 'cosecho'],
    actividadBase: 'media'
  },

  // ─────────────────────────────────────────────────────────────
  // 14. DIEGO - El hombre sensible
  // ─────────────────────────────────────────────────────────────
  {
    id: 'diego',
    nombre: 'Diego Alvarez',
    nombreCorto: 'Diego',
    avatar: '🛡️',
    pais: 'Uruguay',
    edad: 42,
    personalidad: 'reflexivo',
    tiempoMiembro: '10 meses',
    guardianes: ['Astrid'],
    temasInteres: ['runas', 'vikingos', 'proteccion', 'espiritualidad masculina'],
    estilo: {
      longitud: 'medio',
      usaEmojis: false,
      formalidad: 'coloquial',
      caracteristicas: ['perspectiva masculina', 'respetuoso', 'se abre de a poco']
    },
    frasesTypo: ['che', 'como hombre', 'desde mi experiencia'],
    actividadBase: 'media'
  },

  // ─────────────────────────────────────────────────────────────
  // 15. FLORENCIA - La esoterica profesional
  // ─────────────────────────────────────────────────────────────
  {
    id: 'florencia',
    nombre: 'Florencia Torres',
    nombreCorto: 'Flor',
    avatar: '🔮',
    pais: 'Argentina',
    edad: 44,
    personalidad: 'mistica',
    tiempoMiembro: '20 meses',
    guardianes: ['Moon', 'Merlin', 'Abraham'],
    temasInteres: ['chamanismo', 'reiki', 'registros akashicos', 'lecturas'],
    estilo: {
      longitud: 'largo',
      usaEmojis: false,
      formalidad: 'formal',
      caracteristicas: ['usa terminos tecnicos', 'da workshops', 'aporta conocimiento']
    },
    frasesTypo: ['energeticamente', 'a nivel vibracional', 'el campo'],
    actividadBase: 'alta'
  },

  // ─────────────────────────────────────────────────────────────
  // 16. ANDREA - La esceptica convertida
  // ─────────────────────────────────────────────────────────────
  {
    id: 'andrea',
    nombre: 'Andrea Ruiz',
    nombreCorto: 'Andre',
    avatar: '💫',
    pais: 'Argentina',
    edad: 39,
    personalidad: 'esceptico',
    tiempoMiembro: '9 meses',
    guardianes: ['Fortunato'],
    temasInteres: ['testimonios', 'ayudar escepticos', 'experiencias reales'],
    estilo: {
      longitud: 'medio',
      usaEmojis: true,
      formalidad: 'coloquial',
      caracteristicas: ['cuenta su conversion', 'empatiza con dudas', 'testimonial']
    },
    frasesTypo: ['yo antes no creia', 'pero paso que', 'tuve que aceptar'],
    actividadBase: 'media'
  },

  // ─────────────────────────────────────────────────────────────
  // 17. NATALIA - La buscadora indecisa
  // ─────────────────────────────────────────────────────────────
  {
    id: 'natalia',
    nombre: 'Natalia Vega',
    nombreCorto: 'Nati',
    avatar: '🌺',
    pais: 'Uruguay',
    edad: 31,
    personalidad: 'curiosa',
    tiempoMiembro: '1 mes',
    guardianes: [],
    temasInteres: ['decidir guardian', 'comparar experiencias', 'investigar'],
    estilo: {
      longitud: 'medio',
      usaEmojis: true,
      formalidad: 'coloquial',
      caracteristicas: ['pregunta mucho', 'compara opciones', 'lee todo']
    },
    frasesTypo: ['lei que', 'es cierto que', 'me recomiendan'],
    actividadBase: 'alta'
  },

  // ─────────────────────────────────────────────────────────────
  // 18. MERCEDES - La matrona del grupo
  // ─────────────────────────────────────────────────────────────
  {
    id: 'mercedes',
    nombre: 'Mercedes Cardozo',
    nombreCorto: 'Meche',
    avatar: '🌹',
    pais: 'Uruguay',
    edad: 63,
    personalidad: 'organizador',
    tiempoMiembro: '2 años',
    guardianes: ['Zoe', 'Toto', 'Ruperto'],
    temasInteres: ['cuidar grupo', 'contener nuevas', 'tradiciones', 'familia'],
    estilo: {
      longitud: 'medio',
      usaEmojis: false,
      formalidad: 'formal',
      caracteristicas: ['maternal', 'contiene conflictos', 'da bienvenida']
    },
    frasesTypo: ['queridas', 'las abrazo', 'cuidense', 'siempre estoy'],
    actividadBase: 'alta'
  },

  // ─────────────────────────────────────────────────────────────
  // 19. CAMILA - La influencer espiritual
  // ─────────────────────────────────────────────────────────────
  {
    id: 'camila',
    nombre: 'Camila Herrera',
    nombreCorto: 'Cami',
    avatar: '📸',
    pais: 'Argentina',
    edad: 27,
    personalidad: 'entusiasta',
    tiempoMiembro: '8 meses',
    guardianes: ['Heart'],
    temasInteres: ['contenido visual', 'estetica', 'manifestacion', 'redes'],
    estilo: {
      longitud: 'corto',
      usaEmojis: true,
      formalidad: 'muy informal',
      caracteristicas: ['comparte reels', 'trendy', 'visual']
    },
    frasesTypo: ['les muestro', 'aesthetic', 'manifeste'],
    actividadBase: 'alta'
  },

  // ─────────────────────────────────────────────────────────────
  // 20. GRACIELA - La silenciosa observadora
  // ─────────────────────────────────────────────────────────────
  {
    id: 'graciela',
    nombre: 'Graciela Duarte',
    nombreCorto: 'Graci',
    avatar: '🍃',
    pais: 'Argentina',
    edad: 51,
    personalidad: 'silencioso',
    tiempoMiembro: '12 meses',
    guardianes: ['Brianna'],
    temasInteres: ['leer', 'observar', 'apoyar silenciosamente'],
    estilo: {
      longitud: 'corto',
      usaEmojis: true,
      formalidad: 'coloquial',
      caracteristicas: ['lee todo', 'comenta poco', 'carinosa cuando aparece']
    },
    frasesTypo: ['hermoso', 'gracias', 'abrazo'],
    actividadBase: 'baja'
  },

  // ─────────────────────────────────────────────────────────────
  // 21. PILAR - La espanola mistica
  // ─────────────────────────────────────────────────────────────
  {
    id: 'pilar',
    nombre: 'Pilar Navarro',
    nombreCorto: 'Pili',
    avatar: '🌟',
    pais: 'Espana',
    edad: 45,
    personalidad: 'mistica',
    tiempoMiembro: '15 meses',
    guardianes: ['Moonstone', 'Celestine'],
    temasInteres: ['brujeria tradicional', 'luna', 'ancestras', 'tarot'],
    estilo: {
      longitud: 'largo',
      usaEmojis: false,
      formalidad: 'formal',
      caracteristicas: ['habla de tradiciones espanolas', 'muy espiritual', 'poetica']
    },
    frasesTypo: ['vale', 'tia', 'mola', 'es que'],
    actividadBase: 'media'
  },

  // ─────────────────────────────────────────────────────────────
  // 22. GUADALUPE - La mexicana calidosa
  // ─────────────────────────────────────────────────────────────
  {
    id: 'guadalupe',
    nombre: 'Guadalupe Hernandez',
    nombreCorto: 'Lupita',
    avatar: '🌵',
    pais: 'Mexico',
    edad: 36,
    personalidad: 'entusiasta',
    tiempoMiembro: '7 meses',
    guardianes: ['Valentina', 'Aurora'],
    temasInteres: ['dia de muertos', 'ancestros', 'amor', 'familia'],
    estilo: {
      longitud: 'medio',
      usaEmojis: true,
      formalidad: 'muy informal',
      caracteristicas: ['muy carinosa', 'habla de tradiciones mexicanas', 'expresiva']
    },
    frasesTypo: ['ay manita', 'que padre', 'orale', 'bien bonito'],
    actividadBase: 'alta'
  },

  // ─────────────────────────────────────────────────────────────
  // 23. IGNACIO - El chileno analitico
  // ─────────────────────────────────────────────────────────────
  {
    id: 'ignacio',
    nombre: 'Ignacio Vargas',
    nombreCorto: 'Nacho',
    avatar: '🏔️',
    pais: 'Chile',
    edad: 34,
    personalidad: 'reflexivo',
    tiempoMiembro: '6 meses',
    guardianes: ['Merlin'],
    temasInteres: ['filosofia', 'psicologia', 'simbolismo', 'jung'],
    estilo: {
      longitud: 'largo',
      usaEmojis: false,
      formalidad: 'formal',
      caracteristicas: ['analiza profundo', 'conecta con psicologia', 'respetuoso']
    },
    frasesTypo: ['po', 'cachai', 'la wea', 'es interesante'],
    actividadBase: 'media'
  },

  // ─────────────────────────────────────────────────────────────
  // 24. CATALINA - La colombiana alegre
  // ─────────────────────────────────────────────────────────────
  {
    id: 'catalina',
    nombre: 'Catalina Restrepo',
    nombreCorto: 'Cata',
    avatar: '🌈',
    pais: 'Colombia',
    edad: 28,
    personalidad: 'entusiasta',
    tiempoMiembro: '4 meses',
    guardianes: ['Heart'],
    temasInteres: ['amor', 'abundancia', 'alegria', 'celebrar'],
    estilo: {
      longitud: 'medio',
      usaEmojis: true,
      formalidad: 'muy informal',
      caracteristicas: ['super positiva', 'celebra todo', 'muy carinosa']
    },
    frasesTypo: ['ay parcera', 'que chimba', 'ome', 'bacano'],
    actividadBase: 'alta'
  },

  // ─────────────────────────────────────────────────────────────
  // 25. BEATRIZ - La veterana sabia
  // ─────────────────────────────────────────────────────────────
  {
    id: 'beatriz',
    nombre: 'Beatriz Larrosa',
    nombreCorto: 'Bea',
    avatar: '📚',
    pais: 'Uruguay',
    edad: 70,
    personalidad: 'reflexivo',
    tiempoMiembro: '2 años',
    guardianes: ['Liam', 'Sennua'],
    temasInteres: ['sabiduria', 'libros', 'tradiciones', 'transmitir conocimiento'],
    estilo: {
      longitud: 'medio',
      usaEmojis: false,
      formalidad: 'formal',
      caracteristicas: ['muy culta', 'cita autores', 'transmite calma']
    },
    frasesTypo: ['como decia', 'en mis tiempos', 'recuerdo que'],
    actividadBase: 'media'
  },

  // ─────────────────────────────────────────────────────────────
  // 26. SOFIA - La joven esceptica
  // ─────────────────────────────────────────────────────────────
  {
    id: 'sofia',
    nombre: 'Sofia Gimenez',
    nombreCorto: 'Sofi',
    avatar: '🔍',
    pais: 'Argentina',
    edad: 22,
    personalidad: 'esceptico',
    tiempoMiembro: '2 semanas',
    guardianes: [],
    temasInteres: ['entender', 'cuestionar', 'evidencias'],
    estilo: {
      longitud: 'corto',
      usaEmojis: false,
      formalidad: 'coloquial',
      caracteristicas: ['hace preguntas dificiles', 'respetuosa', 'genuina curiosidad']
    },
    frasesTypo: ['pero como funciona', 'no entiendo', 'pueden explicarme'],
    actividadBase: 'media'
  },

  // ─────────────────────────────────────────────────────────────
  // 27. ROSARIO - La sanadora empatica
  // ─────────────────────────────────────────────────────────────
  {
    id: 'rosario',
    nombre: 'Rosario Medina',
    nombreCorto: 'Charo',
    avatar: '💚',
    pais: 'Argentina',
    edad: 48,
    personalidad: 'emocional',
    tiempoMiembro: '14 meses',
    guardianes: ['Emilio', 'Daphne'],
    temasInteres: ['sanacion', 'empatia', 'acompanar dolor', 'contencion'],
    estilo: {
      longitud: 'largo',
      usaEmojis: true,
      formalidad: 'coloquial',
      caracteristicas: ['muy empatica', 'contiene a otras', 'comparte dolor propio']
    },
    frasesTypo: ['te entiendo tanto', 'te mando luz', 'estoy aca'],
    actividadBase: 'alta'
  },

  // ─────────────────────────────────────────────────────────────
  // 28. INES - La minimalista espiritual
  // ─────────────────────────────────────────────────────────────
  {
    id: 'ines',
    nombre: 'Ines Pereira',
    nombreCorto: 'Ine',
    avatar: '🤍',
    pais: 'Uruguay',
    edad: 32,
    personalidad: 'practica',
    tiempoMiembro: '9 meses',
    guardianes: ['Elowen'],
    temasInteres: ['minimalismo', 'esencialismo', 'menos es mas', 'silencio'],
    estilo: {
      longitud: 'corto',
      usaEmojis: false,
      formalidad: 'formal',
      caracteristicas: ['pocas palabras', 'precisas', 'profundas']
    },
    frasesTypo: ['simple', 'lo esencial', 'menos'],
    actividadBase: 'baja'
  },

  // ─────────────────────────────────────────────────────────────
  // 29. CARMEN - La espanola directa
  // ─────────────────────────────────────────────────────────────
  {
    id: 'carmen',
    nombre: 'Carmen Garcia',
    nombreCorto: 'Carme',
    avatar: '🔥',
    pais: 'Espana',
    edad: 52,
    personalidad: 'practica',
    tiempoMiembro: '11 meses',
    guardianes: ['Amy', 'Brianna'],
    temasInteres: ['proteccion', 'limites', 'energia', 'defensa'],
    estilo: {
      longitud: 'medio',
      usaEmojis: false,
      formalidad: 'coloquial',
      caracteristicas: ['directa', 'sin rodeos', 'protectora']
    },
    frasesTypo: ['oye', 'mira', 'es que', 'a ver'],
    actividadBase: 'media'
  },

  // ─────────────────────────────────────────────────────────────
  // 30. ALEJANDRA - La abundante
  // ─────────────────────────────────────────────────────────────
  {
    id: 'alejandra',
    nombre: 'Alejandra Ibarra',
    nombreCorto: 'Ale',
    avatar: '💰',
    pais: 'Mexico',
    edad: 40,
    personalidad: 'entusiasta',
    tiempoMiembro: '1 año',
    guardianes: ['Abraham', 'Fortunato', 'Toto'],
    temasInteres: ['abundancia', 'prosperidad', 'negocios', 'manifestar'],
    estilo: {
      longitud: 'medio',
      usaEmojis: true,
      formalidad: 'coloquial',
      caracteristicas: ['comparte logros', 'motiva', 'celebra exitos ajenos']
    },
    frasesTypo: ['andale', 'fijate que', 'te lo juro'],
    actividadBase: 'alta'
  },

  // ─────────────────────────────────────────────────────────────
  // 31. DANIELA - La nueva timida
  // ─────────────────────────────────────────────────────────────
  {
    id: 'daniela',
    nombre: 'Daniela Castro',
    nombreCorto: 'Dani',
    avatar: '🌷',
    pais: 'Chile',
    edad: 25,
    personalidad: 'silencioso',
    tiempoMiembro: '3 semanas',
    guardianes: ['Valentina'],
    temasInteres: ['amor', 'autoestima', 'encontrarse'],
    estilo: {
      longitud: 'corto',
      usaEmojis: true,
      formalidad: 'muy informal',
      caracteristicas: ['timida', 'agradecida', 'lee mas que comenta']
    },
    frasesTypo: ['holis', 'gracias por compartir', 'que lindo'],
    actividadBase: 'baja'
  },

  // ─────────────────────────────────────────────────────────────
  // 32. MARCOS - El padre protector
  // ─────────────────────────────────────────────────────────────
  {
    id: 'marcos',
    nombre: 'Marcos Delgado',
    nombreCorto: 'Marcos',
    avatar: '🏠',
    pais: 'Argentina',
    edad: 45,
    personalidad: 'practica',
    tiempoMiembro: '5 meses',
    guardianes: ['Ruperto', 'Rafael'],
    temasInteres: ['proteccion familia', 'hogar', 'hijos', 'estabilidad'],
    estilo: {
      longitud: 'medio',
      usaEmojis: false,
      formalidad: 'coloquial',
      caracteristicas: ['perspectiva de padre', 'protector', 'concreto']
    },
    frasesTypo: ['mirá', 'la cosa es', 'por los pibes'],
    actividadBase: 'media'
  },

  // ─────────────────────────────────────────────────────────────
  // 33. JULIA - La escritora poetica
  // ─────────────────────────────────────────────────────────────
  {
    id: 'julia',
    nombre: 'Julia Moreno',
    nombreCorto: 'Juli',
    avatar: '✍️',
    pais: 'Argentina',
    edad: 35,
    personalidad: 'artístico',
    tiempoMiembro: '13 meses',
    guardianes: ['Sennua', 'Moonstone'],
    temasInteres: ['escritura', 'poesia', 'expresion', 'suenos'],
    estilo: {
      longitud: 'largo',
      usaEmojis: false,
      formalidad: 'formal',
      caracteristicas: ['escribe poetico', 'metaforas', 'muy expresiva']
    },
    frasesTypo: ['es como', 'siento que', 'las palabras'],
    actividadBase: 'media'
  },

  // ─────────────────────────────────────────────────────────────
  // 34. LAURA - La psicologa espiritual
  // ─────────────────────────────────────────────────────────────
  {
    id: 'laura',
    nombre: 'Laura Etcheverry',
    nombreCorto: 'Lau',
    avatar: '🧠',
    pais: 'Uruguay',
    edad: 43,
    personalidad: 'reflexivo',
    tiempoMiembro: '18 meses',
    guardianes: ['Merlin', 'Emilio'],
    temasInteres: ['psicologia', 'autoconocimiento', 'sombra', 'integracion'],
    estilo: {
      longitud: 'largo',
      usaEmojis: false,
      formalidad: 'formal',
      caracteristicas: ['conecta psico con espiritu', 'preguntas profundas', 'contenedora']
    },
    frasesTypo: ['desde la psicologia', 'me parece que', 'quizas'],
    actividadBase: 'alta'
  },

  // ─────────────────────────────────────────────────────────────
  // 35. ROCIO - La yogui serena
  // ─────────────────────────────────────────────────────────────
  {
    id: 'rocio',
    nombre: 'Rocio Paz',
    nombreCorto: 'Ro',
    avatar: '🧘',
    pais: 'Argentina',
    edad: 30,
    personalidad: 'reflexivo',
    tiempoMiembro: '10 meses',
    guardianes: ['Gaia', 'Moon'],
    temasInteres: ['yoga', 'meditacion', 'respiracion', 'cuerpo'],
    estilo: {
      longitud: 'medio',
      usaEmojis: false,
      formalidad: 'coloquial',
      caracteristicas: ['transmite calma', 'conecta con cuerpo', 'practica']
    },
    frasesTypo: ['respira', 'el cuerpo sabe', 'fluir'],
    actividadBase: 'media'
  },

  // ─────────────────────────────────────────────────────────────
  // 36. ESPERANZA - La sobreviviente
  // ─────────────────────────────────────────────────────────────
  {
    id: 'esperanza',
    nombre: 'Esperanza Molina',
    nombreCorto: 'Espe',
    avatar: '🌅',
    pais: 'Colombia',
    edad: 55,
    personalidad: 'emocional',
    tiempoMiembro: '2 años',
    guardianes: ['Emilio', 'Zoe', 'Ruperto'],
    temasInteres: ['superacion', 'resiliencia', 'fe', 'esperanza'],
    estilo: {
      longitud: 'largo',
      usaEmojis: true,
      formalidad: 'coloquial',
      caracteristicas: ['cuenta su historia', 'da esperanza', 'muy fuerte']
    },
    frasesTypo: ['yo pase por', 'si yo pude', 'nunca es tarde'],
    actividadBase: 'alta'
  },

  // ─────────────────────────────────────────────────────────────
  // 37. MONICA - La empresaria espiritual
  // ─────────────────────────────────────────────────────────────
  {
    id: 'monica',
    nombre: 'Monica Suarez',
    nombreCorto: 'Moni',
    avatar: '💼',
    pais: 'Mexico',
    edad: 46,
    personalidad: 'organizador',
    tiempoMiembro: '1 año',
    guardianes: ['Abraham', 'Bjorn'],
    temasInteres: ['negocios', 'emprendimiento', 'abundancia', 'liderazgo'],
    estilo: {
      longitud: 'medio',
      usaEmojis: true,
      formalidad: 'coloquial',
      caracteristicas: ['practica', 'ejecutiva', 'concreta']
    },
    frasesTypo: ['a ver', 'mira', 'el punto es'],
    actividadBase: 'media'
  },

  // ─────────────────────────────────────────────────────────────
  // 38. TERESA - La abuela artesana
  // ─────────────────────────────────────────────────────────────
  {
    id: 'teresa',
    nombre: 'Teresa Gonzalez',
    nombreCorto: 'Tere',
    avatar: '🧶',
    pais: 'Espana',
    edad: 67,
    personalidad: 'practica',
    tiempoMiembro: '16 meses',
    guardianes: ['Groen', 'Toto'],
    temasInteres: ['artesanias', 'manualidades', 'altares hechos a mano', 'tradicion'],
    estilo: {
      longitud: 'medio',
      usaEmojis: false,
      formalidad: 'formal',
      caracteristicas: ['comparte tutoriales', 'muy paciente', 'tradicional']
    },
    frasesTypo: ['venga', 'pues', 'os cuento', 'mirad'],
    actividadBase: 'media'
  },

  // ─────────────────────────────────────────────────────────────
  // 39. PAULA - La astrologa novata
  // ─────────────────────────────────────────────────────────────
  {
    id: 'paula',
    nombre: 'Paula Ramirez',
    nombreCorto: 'Pau',
    avatar: '⭐',
    pais: 'Argentina',
    edad: 24,
    personalidad: 'curiosa',
    tiempoMiembro: '3 meses',
    guardianes: ['Moonstone'],
    temasInteres: ['astrologia', 'carta natal', 'transitos', 'luna'],
    estilo: {
      longitud: 'medio',
      usaEmojis: true,
      formalidad: 'muy informal',
      caracteristicas: ['comparte data astral', 'aprende rapido', 'entusiasta']
    },
    frasesTypo: ['con esta luna', 'mi carta dice', 'mercurio retrogrado'],
    actividadBase: 'alta'
  },

  // ─────────────────────────────────────────────────────────────
  // 40. MIRTA - La jubilada activa
  // ─────────────────────────────────────────────────────────────
  {
    id: 'mirta',
    nombre: 'Mirta Acosta',
    nombreCorto: 'Mirta',
    avatar: '🌼',
    pais: 'Uruguay',
    edad: 64,
    personalidad: 'entusiasta',
    tiempoMiembro: '19 meses',
    guardianes: ['Brianna', 'Valentina'],
    temasInteres: ['comunidad', 'amistad', 'compartir', 'compania'],
    estilo: {
      longitud: 'medio',
      usaEmojis: true,
      formalidad: 'coloquial',
      caracteristicas: ['muy sociable', 'siempre presente', 'alegre']
    },
    frasesTypo: ['que alegria', 'chiquilinas', 'que lindo'],
    actividadBase: 'alta'
  },

  // ─────────────────────────────────────────────────────────────
  // 41. VERONICA - La enfermera sanadora
  // ─────────────────────────────────────────────────────────────
  {
    id: 'veronica',
    nombre: 'Veronica Blanco',
    nombreCorto: 'Vero',
    avatar: '⚕️',
    pais: 'Argentina',
    edad: 38,
    personalidad: 'practica',
    tiempoMiembro: '8 meses',
    guardianes: ['Emilio', 'Gaia'],
    temasInteres: ['salud', 'cuidado', 'sanacion', 'cuerpo y alma'],
    estilo: {
      longitud: 'medio',
      usaEmojis: false,
      formalidad: 'coloquial',
      caracteristicas: ['mezcla medicina con espiritu', 'cuida', 'contiene']
    },
    frasesTypo: ['desde lo medico', 'el cuerpo habla', 'cuidate'],
    actividadBase: 'media'
  },

  // ─────────────────────────────────────────────────────────────
  // 42. ANA MARIA - La viuda renacida
  // ─────────────────────────────────────────────────────────────
  {
    id: 'ana-maria',
    nombre: 'Ana Maria Ferreira',
    nombreCorto: 'Anita',
    avatar: '🕊️',
    pais: 'Uruguay',
    edad: 59,
    personalidad: 'emocional',
    tiempoMiembro: '1 año',
    guardianes: ['Heart', 'Zoe'],
    temasInteres: ['duelo', 'amor eterno', 'seguir adelante', 'senales'],
    estilo: {
      longitud: 'largo',
      usaEmojis: true,
      formalidad: 'coloquial',
      caracteristicas: ['comparte duelo', 'habla de su esposo', 'muy sensible']
    },
    frasesTypo: ['mi Jorge', 'las senales', 'sigo adelante'],
    actividadBase: 'media'
  },

  // ─────────────────────────────────────────────────────────────
  // 43. LORENA - La docente curiosa
  // ─────────────────────────────────────────────────────────────
  {
    id: 'lorena',
    nombre: 'Lorena Figueroa',
    nombreCorto: 'Lore',
    avatar: '📖',
    pais: 'Chile',
    edad: 41,
    personalidad: 'curiosa',
    tiempoMiembro: '6 meses',
    guardianes: ['Liam', 'Merlin'],
    temasInteres: ['aprender', 'ensenar', 'conocimiento', 'compartir saberes'],
    estilo: {
      longitud: 'largo',
      usaEmojis: false,
      formalidad: 'formal',
      caracteristicas: ['explica bien', 'ordenada', 'didactica']
    },
    frasesTypo: ['fijense que', 'les explico', 'es importante'],
    actividadBase: 'alta'
  },

  // ─────────────────────────────────────────────────────────────
  // 44. MARIANA - La mama soltera guerrera
  // ─────────────────────────────────────────────────────────────
  {
    id: 'mariana',
    nombre: 'Mariana Ortega',
    nombreCorto: 'Mary',
    avatar: '💪',
    pais: 'Mexico',
    edad: 33,
    personalidad: 'practica',
    tiempoMiembro: '7 meses',
    guardianes: ['Astrid', 'Ruperto'],
    temasInteres: ['fuerza', 'proteccion', 'hijos', 'salir adelante'],
    estilo: {
      longitud: 'medio',
      usaEmojis: true,
      formalidad: 'muy informal',
      caracteristicas: ['directa', 'fuerte', 'real']
    },
    frasesTypo: ['ahi la llevamos', 'no queda de otra', 'por mis hijos'],
    actividadBase: 'media'
  },

  // ─────────────────────────────────────────────────────────────
  // 45. CECILIA - La contadora mistica
  // ─────────────────────────────────────────────────────────────
  {
    id: 'cecilia',
    nombre: 'Cecilia Nunez',
    nombreCorto: 'Ceci',
    avatar: '🔢',
    pais: 'Argentina',
    edad: 47,
    personalidad: 'mistica',
    tiempoMiembro: '11 meses',
    guardianes: ['Abraham', 'Fortunato'],
    temasInteres: ['numerologia', 'abundancia', 'patrones', 'ciclos'],
    estilo: {
      longitud: 'medio',
      usaEmojis: false,
      formalidad: 'coloquial',
      caracteristicas: ['mezcla numeros con magia', 'encuentra patrones', 'analitica']
    },
    frasesTypo: ['los numeros dicen', 'no es casualidad que', 'fijate que'],
    actividadBase: 'media'
  },

  // ─────────────────────────────────────────────────────────────
  // 46. ANTONIA - La abuela mapuche
  // ─────────────────────────────────────────────────────────────
  {
    id: 'antonia',
    nombre: 'Antonia Huenuman',
    nombreCorto: 'Anto',
    avatar: '🪶',
    pais: 'Chile',
    edad: 66,
    personalidad: 'mistica',
    tiempoMiembro: '2 años',
    guardianes: ['Moon', 'Sennua', 'Gaia'],
    temasInteres: ['tradicion mapuche', 'tierra', 'ancestros', 'naturaleza'],
    estilo: {
      longitud: 'medio',
      usaEmojis: false,
      formalidad: 'formal',
      caracteristicas: ['conecta con raices', 'habla de la tierra', 'sabia']
    },
    frasesTypo: ['la tierra nos habla', 'los antiguos decian', 'hay que escuchar'],
    actividadBase: 'media'
  },

  // ─────────────────────────────────────────────────────────────
  // 47. VICTORIA - La arquitecta creativa
  // ─────────────────────────────────────────────────────────────
  {
    id: 'victoria',
    nombre: 'Victoria Lagos',
    nombreCorto: 'Vicky',
    avatar: '🏛️',
    pais: 'Argentina',
    edad: 36,
    personalidad: 'artístico',
    tiempoMiembro: '9 meses',
    guardianes: ['Groen', 'Elowen'],
    temasInteres: ['espacios sagrados', 'altares', 'feng shui', 'diseno'],
    estilo: {
      longitud: 'medio',
      usaEmojis: true,
      formalidad: 'coloquial',
      caracteristicas: ['habla de espacios', 'muy visual', 'creativa']
    },
    frasesTypo: ['el espacio', 'la energia del lugar', 'imaginate'],
    actividadBase: 'alta'
  },

  // ─────────────────────────────────────────────────────────────
  // 48. ELENA M - La periodista buscadora
  // ─────────────────────────────────────────────────────────────
  {
    id: 'elena-m',
    nombre: 'Elena Montenegro',
    nombreCorto: 'Ele M',
    avatar: '📝',
    pais: 'Espana',
    edad: 29,
    personalidad: 'curiosa',
    tiempoMiembro: '2 meses',
    guardianes: ['Celestine'],
    temasInteres: ['historias', 'investigar', 'entender', 'documentar'],
    estilo: {
      longitud: 'largo',
      usaEmojis: false,
      formalidad: 'formal',
      caracteristicas: ['pregunta todo', 'documenta', 'muy curiosa']
    },
    frasesTypo: ['me contais', 'os pregunto', 'es que quiero entender'],
    actividadBase: 'alta'
  },

  // ─────────────────────────────────────────────────────────────
  // 49. ALICIA - La nuevita ansiosa
  // ─────────────────────────────────────────────────────────────
  {
    id: 'alicia',
    nombre: 'Alicia Dominguez',
    nombreCorto: 'Ali',
    avatar: '🌱',
    pais: 'Colombia',
    edad: 19,
    personalidad: 'emocional',
    tiempoMiembro: 'recien llegue',
    guardianes: [],
    temasInteres: ['ansiedad', 'encontrar paz', 'proteccion', 'empezar'],
    estilo: {
      longitud: 'medio',
      usaEmojis: true,
      formalidad: 'muy informal',
      caracteristicas: ['busca ayuda', 'vulnerable', 'abierta']
    },
    frasesTypo: ['ayudaaa', 'es que', 'no se que hacer'],
    actividadBase: 'alta'
  },

  // ─────────────────────────────────────────────────────────────
  // 50. ROBERTO - El abuelo silencioso
  // ─────────────────────────────────────────────────────────────
  {
    id: 'roberto',
    nombre: 'Roberto Silva',
    nombreCorto: 'Beto',
    avatar: '🌳',
    pais: 'Uruguay',
    edad: 69,
    personalidad: 'silencioso',
    tiempoMiembro: '1 año',
    guardianes: ['Bjorn', 'Toto'],
    temasInteres: ['observar', 'leer', 'aprender en silencio'],
    estilo: {
      longitud: 'corto',
      usaEmojis: false,
      formalidad: 'formal',
      caracteristicas: ['pocas palabras', 'profundo cuando habla', 'respetuoso']
    },
    frasesTypo: ['comparto', 'interesante', 'gracias'],
    actividadBase: 'baja'
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
      m.guardianes.some(g => g.toLowerCase() === guardian.toLowerCase())
    );
    if (conGuardian.length > 0) {
      candidatos = conGuardian;
    }
  }

  // Filtrar por tema de interes
  if (tema) {
    const interesados = candidatos.filter(m =>
      m.temasInteres.some(i => i.includes(tema.toLowerCase()) || tema.toLowerCase().includes(i))
    );
    if (interesados.length > 0) {
      candidatos = interesados;
    }
  }

  // Para respuestas cortas, preferir ciertos perfiles
  if (esRespuesta && tipo === 'agradecimiento') {
    const apropiados = candidatos.filter(m =>
      m.personalidad === 'silencioso' ||
      m.personalidad === 'emocional' ||
      m.estilo.longitud === 'corto'
    );
    if (apropiados.length > 0) {
      candidatos = apropiados;
    }
  }

  // Para preguntas, preferir curiosos o nuevos
  if (tipo === 'pregunta') {
    const apropiados = candidatos.filter(m =>
      m.personalidad === 'curiosa' ||
      m.personalidad === 'esceptico' ||
      m.tiempoMiembro.includes('semana') ||
      m.tiempoMiembro.includes('recien')
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
    m.guardianes.some(g => g.toLowerCase() === nombreGuardian.toLowerCase())
  );
}

/**
 * Obtiene perfiles por personalidad
 */
export function perfilesPorPersonalidad(personalidad) {
  return MIEMBROS_FUNDADORES.filter(m => m.personalidad === personalidad);
}

/**
 * Obtiene perfiles por pais
 */
export function perfilesPorPais(pais) {
  return MIEMBROS_FUNDADORES.filter(m =>
    m.pais.toLowerCase().includes(pais.toLowerCase())
  );
}

/**
 * Obtiene perfiles veteranos (mas de 1 año)
 */
export function perfilesVeteranos() {
  return MIEMBROS_FUNDADORES.filter(m =>
    m.tiempoMiembro.includes('año') ||
    m.tiempoMiembro.includes('2 años') ||
    parseInt(m.tiempoMiembro) >= 12
  );
}

/**
 * Obtiene perfiles nuevos (menos de 2 meses)
 */
export function perfilesNuevos() {
  return MIEMBROS_FUNDADORES.filter(m =>
    m.tiempoMiembro.includes('semana') ||
    m.tiempoMiembro.includes('recien') ||
    m.tiempoMiembro === '1 mes' ||
    m.tiempoMiembro === '2 meses'
  );
}

/**
 * Obtiene perfiles activos (actividad alta)
 */
export function perfilesActivos() {
  return MIEMBROS_FUNDADORES.filter(m => m.actividadBase === 'alta');
}

/**
 * Obtiene perfiles por rango de edad
 */
export function perfilesPorEdad(edadMin, edadMax) {
  return MIEMBROS_FUNDADORES.filter(m =>
    m.edad >= edadMin && m.edad <= edadMax
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
  perfilesPorPais,
  perfilesVeteranos,
  perfilesNuevos,
  perfilesActivos,
  perfilesPorEdad
};
