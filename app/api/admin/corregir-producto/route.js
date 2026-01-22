import { NextResponse } from 'next/server';

// CORS headers para permitir llamadas desde WordPress
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

// Helper para respuestas con CORS
const jsonResponse = (data, status = 200) => {
  return NextResponse.json(data, { status, headers: corsHeaders });
};

// OPTIONS para CORS preflight
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

// Configuración WooCommerce
const WC_URL = process.env.WORDPRESS_URL;
const WC_KEY = process.env.WC_CONSUMER_KEY;
const WC_SECRET = process.env.WC_CONSUMER_SECRET;

// Diccionario de correcciones - orden importa (más específicos primero)
const correcciones = {
  // Palabras pegadas con "el" - TODAS las variaciones
  'fueral momento': 'fuera el momento',
  'fueral ': 'fuera el ',
  'bloqueal ': 'bloquea el ',
  'paral otro': 'para el otro',
  'paral ': 'para el ',
  'seral ': 'será el ',
  'eral ': 'era el ',
  'hayal ': 'haya el ',
  'tengal ': 'tenga el ',
  'puedal ': 'pueda el ',
  'veal ': 'vea el ',
  'seal ': 'sea el ',
  'cargal ': 'carga el ',
  'ganal ': 'gana el ',
  'tomal ': 'toma el ',
  'tienel ': 'tiene el ',
  'vienel ': 'viene el ',
  'importal ': 'importa ',
  'nadal ': 'nada ',
  'todal ': 'toda ',
  'cadal ': 'cada ',
  // Errores de palabras
  'investáste': 'inventaste',
  'investaste': 'inventaste',
  'herramiestás': 'herramientas',
  'herramiestas': 'herramientas',
  // Conjugaciones incorrectas (la S final es error común)
  'llegastes': 'llegaste',
  'vistes': 'viste',
  'hicistes': 'hiciste',
  'dijistes': 'dijiste',
  'pudistes': 'pudiste',
  'quisistes': 'quisiste',
  'fuistes': 'fuiste',
  'tuvistes': 'tuviste',
  // Tildes INCORRECTAS - solo palabras completas para no romper otras
  // QUITADO: 'tí', 'ví', etc. porque matchean dentro de palabras como "sentís"
  'entás': 'estás',
  'entas': 'estás',
  // Ortografía general
  'vim': 'vine',
  'conciente': 'consciente',
  'travez': 'través',
  'atravez': 'a través',
  'poque': 'porque',
  'porqe': 'porque',
  'aveces': 'a veces',
  'enserio': 'en serio',
  'envez': 'en vez',
  'talvez': 'tal vez',
  'osea': 'o sea',
  'ósea': 'o sea',
  'nose ': 'no sé ',
  'nosé ': 'no sé ',
  ' q ': ' que ',
  'a el ': 'al ',
  'de el ': 'del ',
  // Específicos del proyecto
  'guradián': 'guardián',
  'guaridan': 'guardián',
  'pixe ': 'pixie ',
  'duened': 'duende',
  'duenede': 'duende'
};

const corregirOrtografia = (texto) => {
  if (!texto) return texto;
  let resultado = texto;
  Object.entries(correcciones).forEach(([mal, bien]) => {
    resultado = resultado.replace(new RegExp(mal, 'gi'), bien);
  });
  return resultado;
};

// POST - Corregir producto por ID
export async function POST(request) {
  try {
    const { productoId } = await request.json();

    if (!productoId) {
      return jsonResponse({ success: false, error: 'Falta productoId' }, 400);
    }

    const auth = Buffer.from(`${WC_KEY}:${WC_SECRET}`).toString('base64');

    // 1. Obtener producto actual
    const getRes = await fetch(
      `${WC_URL}/wp-json/wc/v3/products/${productoId}`,
      {
        headers: { 'Authorization': `Basic ${auth}` }
      }
    );

    if (!getRes.ok) {
      return jsonResponse({ success: false, error: 'Producto no encontrado' }, 404);
    }

    const producto = await getRes.json();
    const descripcionOriginal = producto.description || '';

    // 2. Corregir
    const descripcionCorregida = corregirOrtografia(descripcionOriginal);

    // 3. Verificar si hay cambios
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
      mensaje: 'Ortografía corregida',
      cambios: true,
      producto: producto.name
    });

  } catch (error) {
    return jsonResponse({ success: false, error: error.message }, 500);
  }
}

// GET - Para llamar desde WordPress
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const productoId = searchParams.get('id');

  if (!productoId) {
    return jsonResponse({ success: false, error: 'Falta id' }, 400);
  }

  try {
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
    const descripcionCorregida = corregirOrtografia(descripcionOriginal);

    if (descripcionOriginal === descripcionCorregida) {
      return jsonResponse({ success: true, mensaje: 'Sin errores', cambios: false, producto: producto.name });
    }

    // Guardar
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
      return jsonResponse({ success: false, error: 'Error al guardar' }, 500);
    }

    return jsonResponse({ success: true, mensaje: 'Corregido', cambios: true, producto: producto.name });

  } catch (error) {
    return jsonResponse({ success: false, error: error.message }, 500);
  }
}
