import { GoogleGenerativeAI } from '@google/generative-ai';

// ═══════════════════════════════════════════════════════════════════════════════
// API: GENERACIÓN DE IMÁGENES CON GEMINI (Nano Banana)
// Usa gemini-2.0-flash-exp para generar imágenes desde texto o editar existentes
// ═══════════════════════════════════════════════════════════════════════════════

export const dynamic = 'force-dynamic';
export const maxDuration = 120;

export async function POST(request) {
  if (!process.env.GEMINI_API_KEY) {
    return Response.json({
      success: false,
      error: 'GEMINI_API_KEY no configurada'
    }, { status: 400 });
  }

  try {
    const { prompt, imagenBase64, modo = 'texto_a_imagen' } = await request.json();

    if (!prompt) {
      return Response.json({
        success: false,
        error: 'Se requiere un prompt'
      }, { status: 400 });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    // Usar el modelo con capacidad de imagen
    // gemini-2.0-flash-exp tiene capacidad de generación de imágenes
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash-exp',
      generationConfig: {
        responseModalities: ['image', 'text'],
      }
    });

    let result;
    let contents;

    // MODO: Texto a Imagen
    if (modo === 'texto_a_imagen' || !imagenBase64) {
      console.log('[GEMINI-IMG] Generando imagen desde texto...');

      const enhancedPrompt = `Generate a high-quality, photorealistic image: ${prompt}.
Style: Magical, ethereal, nature photography, warm lighting, detailed.`;

      contents = [{ text: enhancedPrompt }];

    }
    // MODO: Imagen a Imagen (edición)
    else {
      console.log('[GEMINI-IMG] Editando imagen existente...');

      // Extraer el tipo de imagen del base64
      const mimeMatch = imagenBase64.match(/data:([^;]+);base64,/);
      const mimeType = mimeMatch ? mimeMatch[1] : 'image/png';
      const base64Data = imagenBase64.replace(/^data:[^;]+;base64,/, '');

      contents = [
        { text: prompt },
        {
          inlineData: {
            mimeType: mimeType,
            data: base64Data
          }
        }
      ];
    }

    // Generar
    result = await model.generateContent(contents);
    const response = result.response;

    // Extraer imagen de la respuesta
    let imagenUrl = null;
    let textoRespuesta = '';

    for (const part of response.candidates[0].content.parts) {
      if (part.text) {
        textoRespuesta = part.text;
      }
      if (part.inlineData) {
        // Convertir a data URL
        imagenUrl = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }

    if (!imagenUrl) {
      // Si no hay imagen, puede que el modelo no soporte generación directa
      // Intentar con el modelo de imagen específico
      return Response.json({
        success: false,
        error: 'El modelo no generó una imagen. Puede que necesites usar gemini-2.5-flash-preview-05-20 o verificar que tu API key tenga acceso a generación de imágenes.',
        textoRespuesta
      }, { status: 400 });
    }

    console.log('[GEMINI-IMG] Imagen generada exitosamente');

    return Response.json({
      success: true,
      imagen: {
        url: imagenUrl,
        formato: 'base64',
        modelo: 'gemini-2.0-flash-exp'
      },
      textoRespuesta
    });

  } catch (error) {
    console.error('[GEMINI-IMG] Error:', error);

    // Manejar error específico de modelo no disponible
    if (error.message?.includes('not found') || error.message?.includes('not supported')) {
      return Response.json({
        success: false,
        error: 'El modelo de imagen de Gemini no está disponible. Puede que necesites habilitar la API de Imagen en Google Cloud o usar otro modelo.',
        detalles: error.message
      }, { status: 400 });
    }

    return Response.json({
      success: false,
      error: error.message || 'Error generando imagen'
    }, { status: 500 });
  }
}
