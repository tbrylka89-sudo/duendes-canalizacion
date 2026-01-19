import Anthropic from '@anthropic-ai/sdk';

// ═══════════════════════════════════════════════════════════════════════════════
// API: ANÁLISIS DE IMAGEN CON CLAUDE VISION
// Describe visualmente una imagen para usar como referencia en DALL-E
// ═══════════════════════════════════════════════════════════════════════════════

export const dynamic = 'force-dynamic';

const anthropic = new Anthropic();

export async function POST(request) {
  try {
    const body = await request.json();
    const { imagenUrl, contexto = '' } = body;

    if (!imagenUrl) {
      return Response.json({
        success: false,
        error: 'Se requiere una URL de imagen'
      }, { status: 400 });
    }

    // Descargar la imagen y convertir a base64
    const imageResponse = await fetch(imagenUrl);
    if (!imageResponse.ok) {
      throw new Error('No se pudo descargar la imagen');
    }

    const imageBuffer = await imageResponse.arrayBuffer();
    const base64Image = Buffer.from(imageBuffer).toString('base64');

    // Detectar tipo de imagen
    const contentType = imageResponse.headers.get('content-type') || 'image/jpeg';
    const mediaType = contentType.includes('png') ? 'image/png' :
                      contentType.includes('gif') ? 'image/gif' :
                      contentType.includes('webp') ? 'image/webp' : 'image/jpeg';

    // Analizar con Claude Vision
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: mediaType,
                data: base64Image
              }
            },
            {
              type: 'text',
              text: `You are describing a HANDCRAFTED COLD PORCELAIN CLAY FIGURINE for an AI image generator to recreate it as a PHOTOGRAPH of the same figurine.

CRITICAL: This is NOT a fantasy character. It's a REAL PHYSICAL FIGURINE made of cold porcelain clay, like a collectible art piece.

Describe in extreme detail:

1. MATERIAL & TEXTURE: Cold porcelain clay appearance, matte or slightly glossy finish, visible handcrafted texture, small imperfections that make it artisanal

2. FACE: Exact eye color and shape, nose style, mouth expression, skin tone of the clay, any painted details, blush on cheeks

3. HAIR: Color, style, texture (is it sculpted clay or added fibers?), any accessories in hair

4. CLOTHING & ACCESSORIES: Every piece of clothing, colors, patterns, any crystals/gems attached, metallic elements, decorative details

5. POSE & SIZE: How is it sitting/standing? Approximate size (like 10-15cm tall figurine)

6. DISTINCTIVE FEATURES: What makes THIS specific figurine unique? Celtic knots? Specific crystals? Mushrooms? Wings?

${contexto ? `Context: ${contexto}` : ''}

Write a single detailed paragraph in English. Start directly with "A photograph of a handcrafted cold porcelain clay figurine depicting..."

Be EXTREMELY specific so DALL-E recreates THIS EXACT figurine, not a generic fantasy character.`
            }
          ]
        }
      ]
    });

    const descripcion = response.content[0]?.text || '';

    return Response.json({
      success: true,
      descripcion,
      imagenAnalizada: imagenUrl
    });

  } catch (error) {
    console.error('[VISION] Error:', error);
    return Response.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
