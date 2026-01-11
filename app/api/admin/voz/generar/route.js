// API para generar voz con Eleven Labs
// Voces sugeridas para contenido mágico/esotérico

// Voces personalizadas de Thibisay + voces de Eleven Labs
const VOCES = {
  // === VOCES PROPIAS DE DUENDES ===
  'thibisay': process.env.ELEVENLABS_VOZ_THIBISAY || 'ofSX50hgXXAqhe3nRhJI',
  'thibisay-rapido': 'ofSX50hgXXAqhe3nRhJI',
  'thibisay-pro': 'knhUzs4lao5jJEzGotGw',
  'duende': 'ofSX50hgXXAqhe3nRhJI',

  // === PERSONAJES MÁGICOS ===
  'merlin': 'TxGEqnHWrfWFTfGW9XjX',       // Harry (voz madura, sabia)
  'hechicero': 'VR6AewLTigWG4xSOukaG',    // Arnold (profunda, misteriosa)
  'anciano': 'pNInz6obpgDQGcFmaJgB',      // Adam (grave, ancestral)
  'hada': 'jBpfuIE2acCO8z3wKNLl',         // Gigi (etérea, dulce)
  'druida': 'ODq5zmih8GrVes37Dizd',       // Patrick (cálida, natural)

  // === VOCES DE ELEVEN LABS ===
  'rachel': '21m00Tcm4TlvDq8ikWAM',       // Cálida, narradora
  'bella': 'EXAVITQu4vr4xnSDxMaL',        // Suave, íntima
  'charlotte': 'XB0fDUnXU5powFXDhCwa',    // Elegante, madura
  'adam': 'pNInz6obpgDQGcFmaJgB',         // Profunda, narración
};

// Configuraciones de voz por tipo
const VOZ_SETTINGS = {
  meditacion: { stability: 0.75, similarity_boost: 0.6, style: 0.3 },  // Más lento, calmado
  ritual: { stability: 0.65, similarity_boost: 0.7, style: 0.4 },      // Místico
  narracion: { stability: 0.5, similarity_boost: 0.75, style: 0.5 },   // Normal
  personaje: { stability: 0.4, similarity_boost: 0.8, style: 0.7 },    // Más expresivo
  default: { stability: 0.6, similarity_boost: 0.7, style: 0.4 }
};

// Intros de personajes
const INTROS_PERSONAJES = {
  merlin: "Saludos, viajero del tiempo. Soy Merlín, hechicero y alquimista milenario, maestro de maestros. Hoy te acompaño en este viaje mágico...\n\n",
  hechicero: "Bienvenida, alma curiosa. Soy un hechicero ancestral, guardián de los secretos del bosque. Permíteme guiarte...\n\n",
  anciano: "Querida nieta del universo, soy un anciano guardián de la sabiduría antigua. Escuchá con el corazón lo que tengo para compartirte...\n\n",
  hada: "¡Hola, ser de luz! Soy un hada del bosque encantado. Con mi voz etérea te llevaré por caminos mágicos...\n\n",
  druida: "Paz y armonía, caminante. Soy un druida conectado con la madre tierra. Juntos exploraremos los misterios de la naturaleza...\n\n"
};

export async function POST(request) {
  try {
    const { texto, voz = 'duende', modelo = 'eleven_multilingual_v2', tipo = 'default', conIntro = false } = await request.json();

    if (!texto) {
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

    // Agregar intro si es personaje y se solicita
    let textoFinal = texto;
    if (conIntro && INTROS_PERSONAJES[voz]) {
      textoFinal = INTROS_PERSONAJES[voz] + texto;
    }

    // Obtener settings según tipo de contenido
    const settings = VOZ_SETTINGS[tipo] || VOZ_SETTINGS.default;

    let voiceId = VOCES[voz] || VOCES.duende;

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
      vozUsada: voiceId,
      tipo: tipo,
      conIntro: conIntro && !!INTROS_PERSONAJES[voz],
      caracteres: textoFinal.length
    });

  } catch (error) {
    console.error('Error generando voz:', error);
    return Response.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}

// GET - Listar voces disponibles
export async function GET() {
  return Response.json({
    success: true,
    voces: {
      propias: [
        { id: 'thibisay', nombre: 'Thibisay', desc: 'Voz propia de Duendes' },
        { id: 'thibisay-pro', nombre: 'Thibisay Pro', desc: 'Clon profesional' }
      ],
      personajes: [
        { id: 'merlin', nombre: 'Merlín', desc: 'Hechicero sabio y milenario', tieneIntro: true },
        { id: 'hechicero', nombre: 'Hechicero', desc: 'Guardián del bosque', tieneIntro: true },
        { id: 'anciano', nombre: 'Anciano', desc: 'Sabio ancestral', tieneIntro: true },
        { id: 'hada', nombre: 'Hada', desc: 'Voz etérea y dulce', tieneIntro: true },
        { id: 'druida', nombre: 'Druida', desc: 'Conectado con la tierra', tieneIntro: true }
      ],
      generales: [
        { id: 'rachel', nombre: 'Rachel', desc: 'Cálida, narradora' },
        { id: 'bella', nombre: 'Bella', desc: 'Suave, íntima' },
        { id: 'charlotte', nombre: 'Charlotte', desc: 'Elegante, madura' },
        { id: 'adam', nombre: 'Adam', desc: 'Profunda, narración' }
      ]
    },
    tiposAudio: Object.keys(VOZ_SETTINGS),
    modelos: [
      { id: 'eleven_multilingual_v2', nombre: 'Multilingüe v2 (recomendado)', soportaEspanol: true },
      { id: 'eleven_turbo_v2_5', nombre: 'Turbo v2.5 (más rápido)', soportaEspanol: true }
    ]
  });
}
