export const dynamic = 'force-dynamic';
export const maxDuration = 60;

// Estilos predefinidos para imágenes Duendes
const ESTILOS = {
  duendes: {
    nombre: 'Estilo Duendes',
    prompt: 'whimsical forest fantasy art, enchanted woodland creatures, soft golden light filtering through trees, moss-covered stones, magical mushrooms, fireflies, ethereal mist, Studio Ghibli inspired, warm earthy tones with touches of gold and emerald green, mystical but cozy atmosphere, detailed botanical elements, handmade felt doll aesthetic'
  },
  celestial: {
    nombre: 'Celestial Místico',
    prompt: 'celestial mystical art, night sky with stars and moon phases, cosmic swirls in deep purple and midnight blue, golden constellations, sacred geometry patterns, ethereal goddess energy, art nouveau influence, luminous and dreamy, silver and gold accents'
  },
  botanico: {
    nombre: 'Botánico Mágico',
    prompt: 'magical botanical illustration style, detailed herbs and flowers with mystical properties, vintage apothecary aesthetic, pressed flower art meets fantasy, soft watercolor textures, sage green and dusty pink palette, delicate linework, nature journal aesthetic'
  },
  cristales: {
    nombre: 'Reino de Cristales',
    prompt: 'crystal and gemstone fantasy art, faceted precious stones with inner light, geode caves, amethyst purple and rose quartz pink, prismatic light effects, mineral formations, sacred crystal grid patterns, luminescent and magical, high detail gem textures'
  },
  altar: {
    nombre: 'Altar Sagrado',
    prompt: 'sacred altar still life, witchy aesthetic, candles with soft glow, dried flowers and herbs, crystals arranged meaningfully, vintage brass elements, tarot cards, moon phases, cozy mystical atmosphere, warm candlelight, velvet and lace textures'
  },
  magico: {
    nombre: 'Mágico General',
    prompt: 'magical forest, golden hour, mystical, soft bokeh, fantasy art, enchanted'
  },
  watercolor: {
    nombre: 'Acuarela',
    prompt: 'watercolor painting, soft edges, dreamy, artistic, pastel colors'
  },
  realista: {
    nombre: 'Fotorrealista',
    prompt: 'photorealistic, high detail, professional photography, natural lighting'
  },
  natural: {
    nombre: 'Naturaleza',
    prompt: 'nature photography, green forest, moss, crystals, earth tones, organic'
  }
};

// Modificadores de calidad
const CALIDAD_PROMPT = 'high quality digital art, professional illustration, detailed and polished, suitable for social media and print, no text or watermarks, centered composition';

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      prompt,
      descripcion,
      estilo = 'duendes',
      tamaño = '1024x1024',
      calidad = 'standard'
    } = body;

    // Aceptar tanto 'prompt' como 'descripcion'
    const descripcionFinal = descripcion || prompt;

    if (!descripcionFinal) {
      return Response.json({
        success: false,
        error: 'Descripción requerida'
      }, { status: 400 });
    }

    const estiloConfig = ESTILOS[estilo] || ESTILOS['duendes'];

    // Construir prompt completo
    const promptFinal = `${descripcionFinal}, ${estiloConfig.prompt}, ${CALIDAD_PROMPT}`;

    // Validar tamaño
    const tamañosValidos = ['1024x1024', '1792x1024', '1024x1792'];
    const tamañoFinal = tamañosValidos.includes(tamaño) ? tamaño : '1024x1024';

    // OpenAI DALL-E
    const openaiKey = process.env.OPENAI_API_KEY;
    if (openaiKey) {
      try {
        const res = await fetch('https://api.openai.com/v1/images/generations', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${openaiKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model: 'dall-e-3',
            prompt: promptFinal,
            n: 1,
            size: tamañoFinal,
            quality: calidad === 'hd' ? 'hd' : 'standard',
            style: 'vivid'
          })
        });
        const data = await res.json();

        if (data.error) {
          console.error('OpenAI error:', data.error);

          // Errores específicos con mensajes amigables
          if (data.error.code === 'content_policy_violation') {
            return Response.json({
              success: false,
              error: 'La descripción viola las políticas de contenido. Intentá con otra descripción.'
            }, { status: 400 });
          }

          if (data.error.code === 'rate_limit_exceeded') {
            return Response.json({
              success: false,
              error: 'Límite de generación alcanzado. Esperá unos minutos.'
            }, { status: 429 });
          }

          if (data.error.code === 'invalid_api_key' || data.error.message?.includes('Incorrect API key')) {
            return Response.json({
              success: false,
              error: 'API Key de OpenAI inválida. Actualizá OPENAI_API_KEY en Vercel → Settings → Environment Variables'
            }, { status: 401 });
          }

          if (data.error.code === 'insufficient_quota' || data.error.message?.includes('quota')) {
            return Response.json({
              success: false,
              error: 'Sin créditos en OpenAI. Recargá tu cuenta en platform.openai.com/account/billing'
            }, { status: 402 });
          }

          // Error genérico sin mostrar detalles sensibles
          return Response.json({
            success: false,
            error: 'Error generando imagen. Revisá la configuración de OpenAI.'
          }, { status: 500 });
        }

        if (data.data?.[0]?.url) {
          return Response.json({
            success: true,
            url: data.data[0].url,
            imagen: {
              url: data.data[0].url,
              promptOriginal: descripcionFinal,
              promptCompleto: promptFinal,
              promptRevisado: data.data[0].revised_prompt,
              estilo: estiloConfig.nombre,
              tamaño: tamañoFinal,
              calidad
            }
          });
        }
      } catch (openaiErr) {
        console.error('OpenAI fetch error:', openaiErr);
      }
    }

    // Leonardo AI fallback
    const leonardoKey = process.env.LEONARDO_API_KEY;
    if (leonardoKey) {
      try {
        const res = await fetch('https://cloud.leonardo.ai/api/rest/v1/generations', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${leonardoKey}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prompt: promptFinal,
            modelId: '6bef9f1b-29cb-40c7-b9df-32b51c1f67d3',
            width: 1024,
            height: 1024,
            num_images: 1
          })
        });
        const data = await res.json();
        if (data.sdGenerationJob?.generationId) {
          await new Promise(r => setTimeout(r, 15000));
          const result = await fetch(`https://cloud.leonardo.ai/api/rest/v1/generations/${data.sdGenerationJob.generationId}`, {
            headers: { 'Authorization': `Bearer ${leonardoKey}` }
          });
          const r = await result.json();
          if (r.generations_by_pk?.generated_images?.[0]?.url) {
            return Response.json({
              success: true,
              url: r.generations_by_pk.generated_images[0].url,
              imagen: {
                url: r.generations_by_pk.generated_images[0].url,
                promptOriginal: descripcionFinal,
                estilo: estiloConfig.nombre,
                provider: 'leonardo'
              }
            });
          }
        }
      } catch (leonardoErr) {
        console.error('Leonardo error:', leonardoErr);
      }
    }

    // Si llegamos aquí, no hay keys configuradas
    const hasOpenAI = !!process.env.OPENAI_API_KEY;
    const hasLeonardo = !!process.env.LEONARDO_API_KEY;

    if (!hasOpenAI && !hasLeonardo) {
      return Response.json({
        success: false,
        error: 'Configurá OPENAI_API_KEY en Vercel → Settings → Environment Variables'
      }, { status: 500 });
    }

    return Response.json({ success: false, error: 'Error generando imagen. Revisá los logs en Vercel.' }, { status: 500 });
  } catch (error) {
    console.error('Image generation error:', error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}

// GET - Obtener estilos disponibles
export async function GET() {
  return Response.json({
    success: true,
    estilos: Object.entries(ESTILOS).map(([id, config]) => ({
      id,
      nombre: config.nombre,
      descripcion: config.prompt.substring(0, 80) + '...'
    })),
    tamaños: [
      { id: '1024x1024', nombre: 'Cuadrado (1:1)', uso: 'Instagram, perfil' },
      { id: '1792x1024', nombre: 'Horizontal (16:9)', uso: 'Blog, portada' },
      { id: '1024x1792', nombre: 'Vertical (9:16)', uso: 'Stories, Pinterest' }
    ],
    calidades: [
      { id: 'standard', nombre: 'Estándar', descripcion: 'Más rápido, menor costo' },
      { id: 'hd', nombre: 'HD', descripcion: 'Mayor detalle, más lento' }
    ]
  });
}
