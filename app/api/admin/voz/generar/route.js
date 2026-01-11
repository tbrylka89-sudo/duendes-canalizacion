// API para generar voz con Eleven Labs
// Voces sugeridas para contenido mágico/esotérico

// Voces personalizadas de Thibisay + voces de Eleven Labs
const VOCES = {
  // === VOCES PROPIAS DE DUENDES ===
  // Voice ID compartido de Thibisay: knhUzs4lao5jJEzGotGw
  'thibisay': process.env.ELEVENLABS_VOZ_THIBISAY || 'knhUzs4lao5jJEzGotGw',
  'thibisay-rapido': process.env.ELEVENLABS_VOZ_THIBISAY_RAPIDO || 'knhUzs4lao5jJEzGotGw',
  'duende': process.env.ELEVENLABS_VOZ_THIBISAY || 'knhUzs4lao5jJEzGotGw',

  // === VOCES DE ELEVEN LABS ===
  'rachel': '21m00Tcm4TlvDq8ikWAM',      // Cálida, narradora
  'bella': 'EXAVITQu4vr4xnSDxMaL',        // Suave, íntima
  'domi': 'AZnzlk1XvdvUeBnXmlld',         // Expresiva, joven
  'elli': 'MF3mGyEYCl7XYWbV9V6O',         // Clara, amigable
  'charlotte': 'XB0fDUnXU5powFXDhCwa',    // Elegante, madura
  'adam': 'pNInz6obpgDQGcFmaJgB',         // Profunda, narración
  'antoni': 'ErXwobaYiN019PkySvjV'        // Cálida, conversacional
};

export async function POST(request) {
  try {
    const { texto, voz = 'duende', modelo = 'eleven_multilingual_v2' } = await request.json();

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

    const voiceId = VOCES[voz] || VOCES.duende;

    // Llamar a Eleven Labs API
    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
      {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': apiKey
        },
        body: JSON.stringify({
          text: texto,
          model_id: modelo,
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
            style: 0.5,
            use_speaker_boost: true
          }
        })
      }
    );

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
      caracteres: texto.length
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
    voces: Object.keys(VOCES).map(key => ({
      id: key,
      voiceId: VOCES[key],
      recomendado: key === 'duende' || key === 'bella' || key === 'rachel'
    })),
    modelos: [
      { id: 'eleven_multilingual_v2', nombre: 'Multilingüe v2 (recomendado)', soportaEspanol: true },
      { id: 'eleven_monolingual_v1', nombre: 'Monolingual v1', soportaEspanol: false }
    ]
  });
}
