import { kv } from '@vercel/kv';
import OpenAI from 'openai';

// ═══════════════════════════════════════════════════════════════════════════════
// API: GENERACIÓN DE IMÁGENES CON DALL-E
// Genera imágenes en el estilo de los duendes de Duendes del Uruguay
// ═══════════════════════════════════════════════════════════════════════════════

export const dynamic = 'force-dynamic';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Estilo base para todas las imágenes de duendes
const ESTILO_DUENDES = `
Highly detailed photograph of a magical guardian figurine made of cold porcelain clay,
sitting in an enchanted forest setting. The figurine has an artisanal, handcrafted look
with visible texture and warm tones.

Environment: mystical forest with soft golden hour lighting, bokeh effect,
moss-covered ground, small crystals scattered around, four-leaf clovers,
tiny mushrooms, magical sparkles in the air.

Style: cinematic photography, shallow depth of field, warm color palette with
amber and gold tones, ethereal atmosphere, professional product photography
mixed with fantasy art.

The overall mood is cozy, magical, and inviting - like discovering a tiny
guardian in a secret garden.
`;

export async function POST(request) {
  if (!process.env.OPENAI_API_KEY) {
    return Response.json({
      success: false,
      error: 'OPENAI_API_KEY no configurada en Vercel'
    }, { status: 400 });
  }

  try {
    const body = await request.json();
    const {
      prompt,
      tipo = 'guardian', // guardian, escena, cristal, ritual
      estilo = 'fotografico',
      tamaño = '1024x1024',
      calidad = 'standard',
      guardarEnWP = false
    } = body;

    if (!prompt) {
      return Response.json({
        success: false,
        error: 'Se requiere un prompt para generar la imagen'
      }, { status: 400 });
    }

    // Construir prompt completo según el tipo
    let promptCompleto = '';

    switch (tipo) {
      case 'guardian':
        promptCompleto = `${ESTILO_DUENDES}

Specific subject: ${prompt}

Additional details: The guardian figurine should look wise and protective,
with gentle eyes and a serene expression. Include relevant crystals and
natural elements that match its purpose.`;
        break;

      case 'escena':
        promptCompleto = `Magical forest scene with ethereal atmosphere. ${prompt}

Style: cinematic, golden hour lighting, soft bokeh, warm amber tones,
mystical fog, sparkling particles in the air. Like a scene from a
fairy tale brought to life through photography.`;
        break;

      case 'cristal':
        promptCompleto = `Close-up photograph of magical crystals. ${prompt}

Style: macro photography, dramatic lighting with golden and purple hues,
crystals glowing with inner light, placed on moss with tiny flowers,
fantasy atmosphere, professional gemstone photography.`;
        break;

      case 'ritual':
        promptCompleto = `Mystical ritual setup with candles and magical elements. ${prompt}

Style: warm atmospheric lighting, cozy witchy aesthetic, golden candle glow,
crystals and herbs arranged beautifully, smoke wisps, sacred geometry,
like a still from a mystical movie.`;
        break;

      default:
        promptCompleto = `${ESTILO_DUENDES}\n\n${prompt}`;
    }

    // Agregar modificadores de estilo
    if (estilo === 'ilustracion') {
      promptCompleto += '\n\nStyle: digital illustration, storybook art style, painterly, soft edges';
    } else if (estilo === 'acuarela') {
      promptCompleto += '\n\nStyle: watercolor painting, soft washes, delicate details, dreamy atmosphere';
    }

    // Generar imagen con DALL-E 3
    const response = await openai.images.generate({
      model: 'dall-e-3',
      prompt: promptCompleto,
      n: 1,
      size: tamaño,
      quality: calidad,
      response_format: 'url'
    });

    const imagenUrl = response.data[0]?.url;
    const promptRevisado = response.data[0]?.revised_prompt;

    if (!imagenUrl) {
      throw new Error('No se generó imagen');
    }

    // Guardar en historial
    const historial = await kv.get('admin:dalle:historial') || [];
    const registro = {
      id: `dalle_${Date.now()}`,
      prompt: prompt,
      promptCompleto: promptCompleto.slice(0, 500),
      promptRevisado,
      url: imagenUrl,
      tipo,
      estilo,
      fecha: new Date().toISOString()
    };
    historial.unshift(registro);
    await kv.set('admin:dalle:historial', historial.slice(0, 50));

    // Opcionalmente subir a WordPress
    let wpMedia = null;
    if (guardarEnWP && process.env.WP_APP_PASSWORD) {
      try {
        // Descargar imagen
        const imgRes = await fetch(imagenUrl);
        const imgBlob = await imgRes.blob();

        // Subir a WordPress
        const formData = new FormData();
        formData.append('file', imgBlob, `duende_${Date.now()}.png`);

        const WP_URL = process.env.WORDPRESS_URL || 'https://duendesdeluruguay.com';
        const auth = Buffer.from(`${process.env.WP_USER || 'admin'}:${process.env.WP_APP_PASSWORD}`).toString('base64');

        const wpRes = await fetch(`${WP_URL}/wp-json/wp/v2/media`, {
          method: 'POST',
          headers: { 'Authorization': `Basic ${auth}` },
          body: formData
        });

        if (wpRes.ok) {
          const wpData = await wpRes.json();
          wpMedia = {
            id: wpData.id,
            url: wpData.source_url
          };
        }
      } catch (wpError) {
        console.error('[DALLE] Error subiendo a WP:', wpError);
      }
    }

    return Response.json({
      success: true,
      imagen: {
        url: imagenUrl,
        promptOriginal: prompt,
        promptRevisado,
        tipo,
        wordpress: wpMedia
      }
    });

  } catch (error) {
    console.error('[DALLE] Error:', error);

    // Manejar errores específicos de OpenAI
    if (error.code === 'content_policy_violation') {
      return Response.json({
        success: false,
        error: 'El prompt viola las políticas de contenido. Intentá con una descripción diferente.'
      }, { status: 400 });
    }

    return Response.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}

// GET - Obtener historial de imágenes generadas
export async function GET() {
  try {
    const historial = await kv.get('admin:dalle:historial') || [];

    return Response.json({
      success: true,
      historial,
      configuracion: {
        openaiConfigurado: !!process.env.OPENAI_API_KEY,
        wpConfigurado: !!process.env.WP_APP_PASSWORD
      }
    });

  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
