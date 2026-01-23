import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

// POST - Analizar imagen de guardián
export async function POST(request) {
  try {
    const { imagenUrl, imagenBase64, nombre, categoria } = await request.json();

    if (!imagenUrl && !imagenBase64) {
      return NextResponse.json({
        success: false,
        error: 'Se requiere URL de imagen o imagen en base64'
      }, { status: 400 });
    }

    let base64Image;
    let mediaType;

    if (imagenBase64) {
      // Ya viene en base64 (desde el creador de productos)
      // Formato: data:image/jpeg;base64,/9j/4AAQ...
      const matches = imagenBase64.match(/^data:image\/(\w+);base64,(.+)$/);
      if (matches) {
        mediaType = `image/${matches[1]}`;
        base64Image = matches[2];
      } else {
        // Si no tiene el prefijo data:, asumir que es base64 puro
        base64Image = imagenBase64;
        mediaType = 'image/jpeg';
      }
    } else {
      // Descargar imagen desde URL y convertir a base64
      const imageResponse = await fetch(imagenUrl);
      const imageBuffer = await imageResponse.arrayBuffer();
      base64Image = Buffer.from(imageBuffer).toString('base64');

      // Detectar tipo de imagen
      const contentType = imageResponse.headers.get('content-type') || 'image/jpeg';
      mediaType = contentType.includes('png') ? 'image/png' : 'image/jpeg';
    }

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
              text: `Analizá esta imagen de un guardián artesanal llamado "${nombre || 'sin nombre'}" de la categoría "${categoria || 'sin categoría'}".

IMPORTANTE: Es una figura artesanal hecha a mano, NO una persona real. Es un duende/pixie/elemental de fantasía.

Describí en español rioplatense:

1. **EXPRESIÓN**: ¿Qué emoción transmite su rostro? (serenidad, picardía, sabiduría, protección, alegría, misterio)

2. **COLORES**: ¿Qué colores predominan y qué energía representan?

3. **ELEMENTOS/ACCESORIOS**: ¿Qué lleva puesto o porta? (cristales, flores, armas, símbolos, etc.)

4. **POSTURA**: ¿Cómo está posicionado? (abierto, protector, contemplativo, activo)

5. **PERSONALIDAD SUGERIDA**: Basándote en lo visual, ¿qué tipo de personalidad le darías? (3-4 adjetivos)

6. **TIPO DE PERSONA QUE LO ELEGIRÍA**: ¿A quién crees que llamaría este guardián?

7. **ESPECIE SUGERIDA**: Basándote en su apariencia, ¿es más duende, pixie o elfo? (Por defecto duende si no es obvio)

Respondé de forma concisa y directa, sin introducción.`
            }
          ]
        }
      ]
    });

    const analisis = response.content[0].text;

    return NextResponse.json({
      success: true,
      analisis,
      datos_extraidos: {
        nombre,
        categoria,
        imagen: imagenUrl
      }
    });

  } catch (error) {
    console.error('Error analizando imagen:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
