// API para generar voz con Eleven Labs
// Sistema completo de voces - IDs verificados de la biblioteca pública

// ═══════════════════════════════════════════════════════════════
// CATÁLOGO DE VOCES (IDs verificados de ElevenLabs)
// ═══════════════════════════════════════════════════════════════

const CATALOGO_VOCES = {
  // ═══ VOCES PROPIAS DE DUENDES (Clones personalizados) ═══
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
    premium: true
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

  // ═══ VOCES FEMENINAS DE LA BIBLIOTECA PÚBLICA ═══
  'rachel': {
    id: '21m00Tcm4TlvDq8ikWAM',
    nombre: 'Rachel',
    categoria: 'femeninas',
    genero: 'femenino',
    edad: 'adulta',
    estilo: 'narradora',
    descripcion: 'Voz americana cálida para narración',
    personalidad: 'Amigable, clara, profesional',
    icono: '📖',
    recomendada: true
  },
  'bella': {
    id: 'EXAVITQu4vr4xnSDxMaL',
    nombre: 'Bella',
    categoria: 'femeninas',
    genero: 'femenino',
    edad: 'joven',
    estilo: 'suave',
    descripcion: 'Voz suave e íntima, ideal para meditaciones',
    personalidad: 'Serena, dulce, reconfortante',
    icono: '🌸',
    recomendada: true
  },
  'elli': {
    id: 'MF3mGyEYCl7XYWbV9V6O',
    nombre: 'Elli',
    categoria: 'femeninas',
    genero: 'femenino',
    edad: 'joven',
    estilo: 'brillante',
    descripcion: 'Voz joven y energética',
    personalidad: 'Alegre, vivaz, optimista',
    icono: '💫'
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
    descripcion: 'Voz cálida como una abuela',
    personalidad: 'Protectora, amorosa, sabia',
    icono: '🧡'
  },
  'grace': {
    id: 'oWAxZDx7w5VEj9dCyTzz',
    nombre: 'Grace',
    categoria: 'femeninas',
    genero: 'femenino',
    edad: 'adulta',
    estilo: 'sureña',
    descripcion: 'Voz americana con acento sureño',
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
    descripcion: 'Voz perfecta para meditaciones',
    personalidad: 'Tranquila, serena, guía',
    icono: '🧘',
    recomendada: true
  },

  // ═══ VOCES MASCULINAS DE LA BIBLIOTECA PÚBLICA ═══
  'adam': {
    id: 'pNInz6obpgDQGcFmaJgB',
    nombre: 'Adam',
    categoria: 'masculinas',
    genero: 'masculino',
    edad: 'adulto',
    estilo: 'profunda',
    descripcion: 'Voz profunda ideal para narración',
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
    descripcion: 'Voz de anciano experimentado',
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
    icono: '🌿'
  },

  // ═══ PERSONAJES MÁGICOS ═══
  'merlin': {
    id: '2EiwWnXFnvU5JabPnv8n', // Clyde - anciano sabio
    nombre: 'Merlín',
    categoria: 'personajes',
    genero: 'masculino',
    edad: 'anciano',
    estilo: 'sabia',
    descripcion: 'El gran hechicero, sabio y milenario',
    personalidad: 'Sabio, misterioso, poderoso',
    intro: "Saludos, viajero del tiempo. Soy Merlín, hechicero y alquimista milenario...\n\n",
    icono: '🧙‍♂️'
  },
  'hechicero': {
    id: 'VR6AewLTigWG4xSOukaG', // Arnold - misterioso
    nombre: 'Hechicero Oscuro',
    categoria: 'personajes',
    genero: 'masculino',
    edad: 'adulto',
    estilo: 'misteriosa',
    descripcion: 'Guardián de secretos ancestrales',
    personalidad: 'Misterioso, profundo, enigmático',
    intro: "Bienvenida, alma curiosa. Soy un hechicero ancestral, guardián de los secretos...\n\n",
    icono: '🔮'
  },
  'druida': {
    id: 'ODq5zmih8GrVes37Dizd', // Patrick - natural
    nombre: 'Druida del Bosque',
    categoria: 'personajes',
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
    categoria: 'personajes',
    genero: 'masculino',
    edad: 'anciano',
    estilo: 'ancestral',
    descripcion: 'Guardián de la sabiduría antigua',
    personalidad: 'Abuelo cósmico, tierno, protector',
    intro: "Querida nieta del universo, soy un anciano guardián de la sabiduría antigua...\n\n",
    icono: '👴'
  },

  // ═══ SERES MÁGICOS FEMENINOS ═══
  'hada': {
    id: 'MF3mGyEYCl7XYWbV9V6O', // Elli - brillante
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
    id: 'EXAVITQu4vr4xnSDxMaL', // Bella - suave
    nombre: 'Ninfa del Agua',
    categoria: 'magicos',
    genero: 'femenino',
    edad: 'joven',
    estilo: 'fluida',
    descripcion: 'Espíritu del agua, voz cristalina',
    personalidad: 'Serena, fluida, purificadora',
    icono: '💧'
  },
  'dryada': {
    id: 'z9fAnlkpzviPz146aGWa', // Glinda - maternal
    nombre: 'Dríada',
    categoria: 'magicos',
    genero: 'femenino',
    edad: 'antigua',
    estilo: 'terrenal',
    descripcion: 'Espíritu del árbol, voz de la naturaleza',
    personalidad: 'Sabia, paciente, protectora',
    icono: '🌳'
  },

  // ═══ PERSONAJES TIERNOS ═══
  'abuela-magica': {
    id: 'z9fAnlkpzviPz146aGWa', // Glinda - maternal
    nombre: 'Abuela Mágica',
    categoria: 'tiernos',
    genero: 'femenino',
    edad: 'anciana',
    estilo: 'amorosa',
    descripcion: 'Como una abuela que cuenta cuentos',
    personalidad: 'Amorosa, sabia, reconfortante',
    icono: '👵'
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
    icono: '🦌'
  },
  'madre-tierra': {
    id: 'XB0fDUnXU5powFXDhCwa', // Charlotte - elegante
    nombre: 'Madre Tierra',
    categoria: 'tiernos',
    genero: 'femenino',
    edad: 'madura',
    estilo: 'maternal',
    descripcion: 'Voz de la madre naturaleza',
    personalidad: 'Maternal, protectora, sabia',
    icono: '🌍'
  },

  // ═══ NARRADORES ═══
  'narradora': {
    id: '21m00Tcm4TlvDq8ikWAM', // Rachel
    nombre: 'Narradora',
    categoria: 'narradores',
    genero: 'femenino',
    edad: 'adulta',
    estilo: 'profesional',
    descripcion: 'Voz profesional para narración',
    personalidad: 'Clara, profesional, envolvente',
    icono: '📚'
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
    icono: '🎙️'
  },

  // ═══ VOCES PARA MEDITACIÓN ═══
  'guia-meditacion': {
    id: 'EXAVITQu4vr4xnSDxMaL', // Bella - suave
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
  }
};

// Mapa simple de IDs para compatibilidad
const VOCES = Object.fromEntries(
  Object.entries(CATALOGO_VOCES).map(([key, value]) => [key, value.id])
);

// Categorías para el UI
const CATEGORIAS_VOCES = {
  duendes: { nombre: 'Voces Duendes', icono: '🌟', descripcion: 'Voces oficiales de Duendes del Uruguay' },
  femeninas: { nombre: 'Voces Femeninas', icono: '👩', descripcion: 'Voces de mujer, varias edades y estilos' },
  masculinas: { nombre: 'Voces Masculinas', icono: '👨', descripcion: 'Voces de hombre, varias edades y estilos' },
  meditacion: { nombre: 'Para Meditación', icono: '🧘', descripcion: 'Voces serenas para meditación y sanación' },
  narradores: { nombre: 'Narradores', icono: '🎙️', descripcion: 'Voces profesionales para narración' },
  personajes: { nombre: 'Personajes Mágicos', icono: '🧙', descripcion: 'Hechiceros, druidas y sabios' },
  magicos: { nombre: 'Seres Mágicos', icono: '🧚', descripcion: 'Hadas, ninfas y dríadas' },
  tiernos: { nombre: 'Personajes Tiernos', icono: '🍄', descripcion: 'Voces dulces y reconfortantes' }
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
