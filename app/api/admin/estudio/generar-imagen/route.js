export const dynamic = 'force-dynamic';
export const maxDuration = 60;

// ═══════════════════════════════════════════════════════════════
// GENERADOR DE IMÁGENES PARA CONTENIDO - DALL-E
// Crea banners coherentes con el estilo de Duendes del Uruguay
// ═══════════════════════════════════════════════════════════════

const ESTILO_BASE = `Mystical and enchanting digital art style.
Warm earth tones with magical golden accents.
Ethereal lighting with soft glows.
Fantasy elements but grounded and elegant.
No text or letters in the image.
Professional quality, suitable for blog header.`;

const ESTILOS_CATEGORIA = {
  cosmos: 'Celestial theme with moon phases, stars, cosmic energy. Deep blues, purples, and silver.',
  duendes: 'Forest spirits, magical woodland creatures, mushrooms, ancient trees. Earthy greens and golden browns.',
  diy: 'Crafting elements, crystals, candles, natural materials arranged artistically. Warm and inviting.',
  esoterico: 'Tarot cards, mystical symbols, crystals, sacred geometry. Deep purples and golds.',
  sanacion: 'Healing energy, soft light, nature elements, peaceful atmosphere. Greens, soft pinks, white light.',
  rituales: 'Ritual setup with candles, herbs, crystals, altar elements. Warm candlelight ambiance.',
};

const ESTILOS_TIPO = {
  articulo: 'Editorial style, sophisticated composition.',
  ritual: 'Atmospheric, intimate setting with ritual elements.',
  guia: 'Clear, organized visual elements.',
  meditacion: 'Serene, peaceful, dreamy quality.',
  reflexion: 'Contemplative mood, soft focus elements.',
  historia: 'Narrative quality, storytelling elements.',
};

export async function POST(request) {
  const openaiKey = process.env.OPENAI_API_KEY;

  if (!openaiKey) {
    return Response.json({ success: false, error: 'OpenAI API key no configurada' }, { status: 500 });
  }

  try {
    const { titulo, extracto, categoria = 'general', tipo = 'articulo' } = await request.json();

    if (!titulo) {
      return Response.json({ success: false, error: 'Título requerido' }, { status: 400 });
    }

    // Construir prompt para la imagen
    const estiloCategoria = ESTILOS_CATEGORIA[categoria] || '';
    const estiloTipo = ESTILOS_TIPO[tipo] || '';

    const prompt = `Create a banner image for: "${titulo}"

${ESTILO_BASE}

Category style: ${estiloCategoria}
Content type: ${estiloTipo}

${extracto ? `Context: ${extracto}` : ''}

Important:
- Horizontal composition (16:9 aspect ratio feel)
- No text, letters, or words in the image
- Mystical but not cheesy
- Professional quality for spiritual content platform`;

    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openaiKey}`
      },
      body: JSON.stringify({
        model: 'dall-e-3',
        prompt: prompt,
        n: 1,
        size: '1792x1024',
        quality: 'standard',
        response_format: 'url'
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenAI error:', errorData);
      return Response.json({
        success: false,
        error: errorData.error?.message || `Error API: ${response.status}`
      }, { status: 500 });
    }

    const data = await response.json();
    const imageUrl = data.data?.[0]?.url;

    if (!imageUrl) {
      return Response.json({ success: false, error: 'No se generó imagen' }, { status: 500 });
    }

    return Response.json({
      success: true,
      imagen: imageUrl,
      promptUsado: prompt,
    });

  } catch (error) {
    console.error('Error:', error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
