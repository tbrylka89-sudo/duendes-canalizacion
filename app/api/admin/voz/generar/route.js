// API para generar voz con Eleven Labs
// Sistema completo de voces categorizadas - SOLO VOCES PREMIUM

// ═══════════════════════════════════════════════════════════════
// CATÁLOGO DE VOCES PREMIUM (Suenan naturales, no a IA)
// ═══════════════════════════════════════════════════════════════

const CATALOGO_VOCES = {
  // ═══ VOCES PROPIAS DE DUENDES ═══
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

  // ═══ VOCES PREMIUM FEMENINAS (Ultra realistas) ═══
  'aria': {
    id: '9BWtsMINqrJLrRacOk9x',
    nombre: 'Aria',
    categoria: 'premium',
    genero: 'femenino',
    edad: 'joven',
    estilo: 'expresiva',
    descripcion: 'Voz ultra-realista, muy expresiva y natural',
    personalidad: 'Cálida, cercana, emotiva',
    icono: '🎵',
    premium: true,
    recomendada: true
  },
  'sarah': {
    id: 'EXAVITQu4vr4xnSDxMaL',
    nombre: 'Sarah',
    categoria: 'premium',
    genero: 'femenino',
    edad: 'adulta',
    estilo: 'suave',
    descripcion: 'Voz suave perfecta para meditaciones',
    personalidad: 'Serena, reconfortante, íntima',
    icono: '🌸',
    premium: true,
    recomendada: true
  },
  'charlotte': {
    id: 'XB0fDUnXU5powFXDhCwa',
    nombre: 'Charlotte',
    categoria: 'premium',
    genero: 'femenino',
    edad: 'madura',
    estilo: 'elegante',
    descripcion: 'Voz elegante estilo europeo, muy natural',
    personalidad: 'Refinada, sabia, maternal',
    icono: '👑',
    premium: true,
    recomendada: true
  },
  'laura': {
    id: 'FGY2WhTYpPnrIDTdsKH5',
    nombre: 'Laura',
    categoria: 'premium',
    genero: 'femenino',
    edad: 'adulta',
    estilo: 'cálida',
    descripcion: 'Voz americana cálida y muy humana',
    personalidad: 'Amigable, confiable, cercana',
    icono: '🌻',
    premium: true
  },
  'lily': {
    id: 'pFZP5JQG7iQjIQuC4Bku',
    nombre: 'Lily',
    categoria: 'premium',
    genero: 'femenino',
    edad: 'joven',
    estilo: 'británica',
    descripcion: 'Voz británica joven y encantadora',
    personalidad: 'Dulce, elegante, refinada',
    icono: '🌷',
    premium: true
  },
  'alice': {
    id: 'Xb7hH8MSUJpSbSDYk0k2',
    nombre: 'Alice',
    categoria: 'premium',
    genero: 'femenino',
    edad: 'adulta',
    estilo: 'confiable',
    descripcion: 'Voz clara y articulada, muy profesional',
    personalidad: 'Seria, confiable, clara',
    icono: '📘',
    premium: true
  },
  'matilda': {
    id: 'XrExE9yKIg1WjnnlVkGX',
    nombre: 'Matilda',
    categoria: 'premium',
    genero: 'femenino',
    edad: 'adulta',
    estilo: 'cálida',
    descripcion: 'Voz cálida y amigable, ideal para guías',
    personalidad: 'Maternal, acogedora, paciente',
    icono: '🧡',
    premium: true
  },

  // ═══ VOCES PREMIUM MASCULINAS (Ultra realistas) ═══
  'roger': {
    id: 'CwhRBWXzGAHq8TQ4Fs17',
    nombre: 'Roger',
    categoria: 'premium',
    genero: 'masculino',
    edad: 'maduro',
    estilo: 'profunda',
    descripcion: 'Voz profunda y autorizada, muy natural',
    personalidad: 'Sabio, confiable, paternal',
    icono: '🎭',
    premium: true,
    recomendada: true
  },
  'george': {
    id: 'JBFqnCBsd6RMkjVDRZzb',
    nombre: 'George',
    categoria: 'premium',
    genero: 'masculino',
    edad: 'maduro',
    estilo: 'británica',
    descripcion: 'Voz británica cálida y narradora',
    personalidad: 'Elegante, sabio, reconfortante',
    icono: '📖',
    premium: true,
    recomendada: true
  },
  'callum': {
    id: 'N2lVS1w4EtoT3dr4eOWO',
    nombre: 'Callum',
    categoria: 'premium',
    genero: 'masculino',
    edad: 'adulto',
    estilo: 'transatlántica',
    descripcion: 'Voz versátil con acento transatlántico',
    personalidad: 'Carismático, versátil, agradable',
    icono: '🌊',
    premium: true
  },
  'charlie': {
    id: 'IKne3meq5aSn9XLyUdCD',
    nombre: 'Charlie',
    categoria: 'premium',
    genero: 'masculino',
    edad: 'adulto',
    estilo: 'natural',
    descripcion: 'Voz australiana casual y amigable',
    personalidad: 'Relajado, cercano, natural',
    icono: '🌴',
    premium: true
  },
  'liam': {
    id: 'TX3LPaxmHKxFdv7VOQHJ',
    nombre: 'Liam',
    categoria: 'premium',
    genero: 'masculino',
    edad: 'adulto',
    estilo: 'articulada',
    descripcion: 'Voz americana clara y bien articulada',
    personalidad: 'Profesional, claro, confiable',
    icono: '⭐',
    premium: true
  },
  'daniel': {
    id: 'onwK4e9ZLuTAKqWW03F9',
    nombre: 'Daniel',
    categoria: 'premium',
    genero: 'masculino',
    edad: 'adulto',
    estilo: 'británica-profunda',
    descripcion: 'Voz británica profunda y autorizada',
    personalidad: 'Serio, confiable, imponente',
    icono: '🦁',
    premium: true
  },

  // ═══ PERSONAJES MÁGICOS (Con voces premium) ═══
  'merlin': {
    id: 'JBFqnCBsd6RMkjVDRZzb', // George - británica perfecta para Merlín
    nombre: 'Merlín',
    categoria: 'personajes',
    genero: 'masculino',
    edad: 'anciano',
    estilo: 'sabia',
    descripcion: 'El gran hechicero, sabio y milenario',
    personalidad: 'Sabio, misterioso, poderoso',
    intro: "Saludos, viajero del tiempo. Soy Merlín, hechicero y alquimista milenario...\n\n",
    icono: '🧙‍♂️',
    premium: true
  },
  'hechicero': {
    id: 'onwK4e9ZLuTAKqWW03F9', // Daniel - profunda para misterio
    nombre: 'Hechicero Oscuro',
    categoria: 'personajes',
    genero: 'masculino',
    edad: 'adulto',
    estilo: 'misteriosa',
    descripcion: 'Guardián de secretos ancestrales',
    personalidad: 'Misterioso, profundo, enigmático',
    intro: "Bienvenida, alma curiosa. Soy un hechicero ancestral, guardián de los secretos...\n\n",
    icono: '🔮',
    premium: true
  },
  'druida': {
    id: 'CwhRBWXzGAHq8TQ4Fs17', // Roger - paternal y sabio
    nombre: 'Druida del Bosque',
    categoria: 'personajes',
    genero: 'masculino',
    edad: 'maduro',
    estilo: 'natural',
    descripcion: 'Conectado con la madre tierra',
    personalidad: 'Sereno, natural, sabio',
    intro: "Paz y armonía, caminante. Soy un druida conectado con la madre tierra...\n\n",
    icono: '🌿',
    premium: true
  },
  'anciano-sabio': {
    id: 'JBFqnCBsd6RMkjVDRZzb', // George
    nombre: 'Anciano Sabio',
    categoria: 'personajes',
    genero: 'masculino',
    edad: 'anciano',
    estilo: 'ancestral',
    descripcion: 'Guardián de la sabiduría antigua',
    personalidad: 'Abuelo cósmico, tierno, protector',
    intro: "Querida nieta del universo, soy un anciano guardián de la sabiduría antigua...\n\n",
    icono: '👴',
    premium: true
  },

  // ═══ SERES MÁGICOS FEMENINOS (Con voces premium) ═══
  'hada': {
    id: 'pFZP5JQG7iQjIQuC4Bku', // Lily - británica dulce
    nombre: 'Hada del Bosque',
    categoria: 'magicos',
    genero: 'femenino',
    edad: 'joven',
    estilo: 'etérea',
    descripcion: 'Voz etérea y mágica de hada',
    personalidad: 'Dulce, juguetona, luminosa',
    intro: "¡Hola, ser de luz! Soy un hada del bosque encantado...\n\n",
    icono: '🧚',
    premium: true
  },
  'ninfa': {
    id: 'EXAVITQu4vr4xnSDxMaL', // Sarah - suave y fluida
    nombre: 'Ninfa del Agua',
    categoria: 'magicos',
    genero: 'femenino',
    edad: 'joven',
    estilo: 'fluida',
    descripcion: 'Espíritu del agua, voz cristalina',
    personalidad: 'Serena, fluida, purificadora',
    icono: '💧',
    premium: true
  },
  'dryada': {
    id: 'XrExE9yKIg1WjnnlVkGX', // Matilda - maternal
    nombre: 'Dríada',
    categoria: 'magicos',
    genero: 'femenino',
    edad: 'antigua',
    estilo: 'terrenal',
    descripcion: 'Espíritu del árbol, voz de la naturaleza',
    personalidad: 'Sabia, paciente, protectora',
    icono: '🌳',
    premium: true
  },

  // ═══ PERSONAJES TIERNOS (Con voces premium) ═══
  'abuela-magica': {
    id: 'XrExE9yKIg1WjnnlVkGX', // Matilda - maternal
    nombre: 'Abuela Mágica',
    categoria: 'tiernos',
    genero: 'femenino',
    edad: 'anciana',
    estilo: 'amorosa',
    descripcion: 'Como una abuela que cuenta cuentos',
    personalidad: 'Amorosa, sabia, reconfortante',
    icono: '👵',
    premium: true
  },
  'guardian-bosque': {
    id: 'CwhRBWXzGAHq8TQ4Fs17', // Roger
    nombre: 'Guardián del Bosque',
    categoria: 'tiernos',
    genero: 'masculino',
    edad: 'adulto',
    estilo: 'protectora',
    descripcion: 'Protector gentil de las criaturas',
    personalidad: 'Gentil, protector, cariñoso',
    icono: '🦌',
    premium: true
  },
  'madre-tierra': {
    id: 'XB0fDUnXU5powFXDhCwa', // Charlotte - elegante y maternal
    nombre: 'Madre Tierra',
    categoria: 'tiernos',
    genero: 'femenino',
    edad: 'madura',
    estilo: 'maternal',
    descripcion: 'Voz de la madre naturaleza, reconfortante',
    personalidad: 'Maternal, protectora, sabia',
    icono: '🌍',
    premium: true
  },

  // ═══ NARRADORES PROFESIONALES ═══
  'narradora': {
    id: '9BWtsMINqrJLrRacOk9x', // Aria
    nombre: 'Narradora',
    categoria: 'narradores',
    genero: 'femenino',
    edad: 'adulta',
    estilo: 'profesional',
    descripcion: 'Voz profesional para narración de contenido',
    personalidad: 'Clara, profesional, envolvente',
    icono: '📚',
    premium: true
  },
  'narrador': {
    id: 'JBFqnCBsd6RMkjVDRZzb', // George
    nombre: 'Narrador',
    categoria: 'narradores',
    genero: 'masculino',
    edad: 'maduro',
    estilo: 'profesional',
    descripcion: 'Voz masculina profunda para narración',
    personalidad: 'Autoritario, claro, profesional',
    icono: '🎙️',
    premium: true
  },

  // ═══ VOCES PARA MEDITACIÓN ═══
  'guia-meditacion': {
    id: 'EXAVITQu4vr4xnSDxMaL', // Sarah
    nombre: 'Guía de Meditación',
    categoria: 'meditacion',
    genero: 'femenino',
    edad: 'adulta',
    estilo: 'serena',
    descripcion: 'Voz perfecta para meditaciones guiadas',
    personalidad: 'Serena, calmada, reconfortante',
    icono: '🧘',
    premium: true,
    recomendada: true
  },
  'sanador': {
    id: 'CwhRBWXzGAHq8TQ4Fs17', // Roger
    nombre: 'Sanador',
    categoria: 'meditacion',
    genero: 'masculino',
    edad: 'maduro',
    estilo: 'reconfortante',
    descripcion: 'Voz masculina calmada para sanación',
    personalidad: 'Paciente, sabio, sanador',
    icono: '💚',
    premium: true
  }
};

// Mapa simple de IDs para compatibilidad
const VOCES = Object.fromEntries(
  Object.entries(CATALOGO_VOCES).map(([key, value]) => [key, value.id])
);

// Categorías para el UI - Solo voces premium
const CATEGORIAS_VOCES = {
  premium: { nombre: '⭐ Voces Premium', icono: '⭐', descripcion: 'Voces ultra-realistas de alta calidad (Recomendadas)' },
  duendes: { nombre: 'Voces Duendes', icono: '🌟', descripcion: 'Voces oficiales de Duendes del Uruguay' },
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
