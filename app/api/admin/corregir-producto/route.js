import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

const jsonResponse = (data, status = 200) => {
  return NextResponse.json(data, { status, headers: corsHeaders });
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

// Config
const WC_URL = process.env.WORDPRESS_URL;
const WC_KEY = process.env.WC_CONSUMER_KEY;
const WC_SECRET = process.env.WC_CONSUMER_SECRET;

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

// Corrección inteligente con Claude
async function corregirConClaude(texto) {
  if (!texto || texto.trim().length < 50) return texto;

  try {
    const response = await anthropic.messages.create({
      model: 'claude-3-5-haiku-20241022',
      max_tokens: 4000,
      messages: [{
        role: 'user',
        content: `Corregí la ortografía y gramática de este texto en español rioplatense.

REGLAS:
- Solo corregí errores de ortografía y gramática
- NO cambies el contenido, estilo, ni palabras
- NO agregues ni quites nada
- Mantené el formato HTML exacto
- Mantené las negritas, cursivas, párrafos
- "vos", "tenés", "podés" son correctos (rioplatense)
- Si no hay errores, devolvé el texto exacto

TEXTO:
${texto}

Devolvé SOLO el texto corregido, nada más.`
      }]
    });

    return response.content[0].text;
  } catch (error) {
    console.error('Error con Claude:', error);
    return texto; // Si falla, devolver original
  }
}

// POST - Corregir producto
export async function POST(request) {
  try {
    const { productoId } = await request.json();

    if (!productoId) {
      return jsonResponse({ success: false, error: 'Falta productoId' }, 400);
    }

    const auth = Buffer.from(`${WC_KEY}:${WC_SECRET}`).toString('base64');

    // 1. Obtener producto
    const getRes = await fetch(
      `${WC_URL}/wp-json/wc/v3/products/${productoId}`,
      { headers: { 'Authorization': `Basic ${auth}` } }
    );

    if (!getRes.ok) {
      return jsonResponse({ success: false, error: 'Producto no encontrado' }, 404);
    }

    const producto = await getRes.json();
    const descripcionOriginal = producto.description || '';

    if (!descripcionOriginal || descripcionOriginal.length < 50) {
      return jsonResponse({ success: true, mensaje: 'Sin descripción para corregir', cambios: false });
    }

    // 2. Corregir con Claude
    const descripcionCorregida = await corregirConClaude(descripcionOriginal);

    // 3. Verificar cambios
    if (descripcionOriginal === descripcionCorregida) {
      return jsonResponse({
        success: true,
        mensaje: 'Sin errores detectados',
        cambios: false,
        producto: producto.name
      });
    }

    // 4. Guardar
    const putRes = await fetch(
      `${WC_URL}/wp-json/wc/v3/products/${productoId}`,
      {
        method: 'PUT',
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ description: descripcionCorregida })
      }
    );

    if (!putRes.ok) {
      const error = await putRes.text();
      return jsonResponse({ success: false, error }, 500);
    }

    return jsonResponse({
      success: true,
      mensaje: 'Ortografía corregida con IA',
      cambios: true,
      producto: producto.name
    });

  } catch (error) {
    return jsonResponse({ success: false, error: error.message }, 500);
  }
}

// GET
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const productoId = searchParams.get('id');

  if (!productoId) {
    return jsonResponse({ success: false, error: 'Falta id' }, 400);
  }

  // Reusar POST
  const fakeRequest = { json: async () => ({ productoId: parseInt(productoId) }) };
  return POST(fakeRequest);
}
