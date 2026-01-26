/**
 * WHISPERS DEL GUARDIÁN
 * Genera 6 mensajes únicos que aparecen después de cierto tiempo en la página del producto
 * Cada mensaje es una "comunicación" del guardián hacia quien lo está mirando
 */

import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

// Configuración WooCommerce
const WC_URL = process.env.WORDPRESS_URL;
const WC_KEY = process.env.WC_CONSUMER_KEY;
const WC_SECRET = process.env.WC_CONSUMER_SECRET;

const PROMPT_WHISPERS = `Sos el guardián {nombre}, un {especie} de {categoria}.

Tu misión: generar 6 MENSAJES CORTOS (whispers/susurros) que aparecerán en la página del producto cuando alguien te esté mirando por un rato.

CONTEXTO:
- La persona está en tu página de producto, mirándote
- Lleva un tiempo ahí (30 segundos, 1 minuto, etc.)
- Estos mensajes aparecen como notificaciones sutiles tipo "{nombre} tiene un mensaje para vos..."
- Deben crear CONEXIÓN EMOCIONAL y CURIOSIDAD

TU HISTORIA/ESENCIA:
{historia}

TUS ACCESORIOS:
{accesorios}

REGLAS PARA LOS WHISPERS:

1. CADA MENSAJE DEBE SER DIFERENTE en tono y propósito:
   - Mensaje 1: Intriga/curiosidad ("Sé por qué estás acá...")
   - Mensaje 2: Validación/empatía ("Lo que sentís es real...")
   - Mensaje 3: Conexión personal ("Te reconozco...")
   - Mensaje 4: Revelación sutil ("Hay algo que necesitás saber...")
   - Mensaje 5: Llamado suave ("Cuando estés lista/o...")
   - Mensaje 6: Urgencia sutil ("No voy a estar acá para siempre...")

2. LONGITUD: Máximo 15-20 palabras cada uno. Son SUSURROS, no discursos.

3. TONO:
   - Primera persona (yo, el guardián)
   - Íntimo, como si hablara al oído
   - NUNCA vendedor ni agresivo
   - Español rioplatense ("vos", "tenés", "sentís")

4. PERSONALIZADO según mi esencia:
   - Si soy protector → mensajes sobre cuidar, resguardar
   - Si soy de abundancia → mensajes sobre merecer, fluir
   - Si soy de amor → mensajes sobre conexión, corazón
   - Si soy de sanación → mensajes sobre soltar, sanar
   - Si soy de sabiduría → mensajes sobre entender, ver claro

5. PROHIBIDO:
   - "Comprá", "oferta", "descuento"
   - Frases genéricas de IA
   - Mensajes que podrían ser de cualquier guardián
   - Presión agresiva

RESPONDE SOLO CON UN JSON:
{
  "whispers": [
    {"id": 1, "tiempo_segundos": 30, "mensaje": "..."},
    {"id": 2, "tiempo_segundos": 60, "mensaje": "..."},
    {"id": 3, "tiempo_segundos": 90, "mensaje": "..."},
    {"id": 4, "tiempo_segundos": 120, "mensaje": "..."},
    {"id": 5, "tiempo_segundos": 150, "mensaje": "..."},
    {"id": 6, "tiempo_segundos": 180, "mensaje": "..."}
  ]
}`;

// POST - Generar whispers para un producto
export async function POST(request) {
  try {
    const body = await request.json();
    const { productoId, nombre, especie, categoria, historia, accesorios } = body;

    if (!productoId || !nombre) {
      return NextResponse.json({
        success: false,
        error: 'Se requiere productoId y nombre del guardián'
      }, { status: 400 });
    }

    // Construir prompt
    const prompt = PROMPT_WHISPERS
      .replace(/{nombre}/g, nombre)
      .replace(/{especie}/g, especie || 'duende')
      .replace(/{categoria}/g, categoria || 'protección')
      .replace(/{historia}/g, historia || 'Un guardián misterioso con energía especial.')
      .replace(/{accesorios}/g, accesorios || 'Elementos mágicos únicos.');

    // Generar con Claude
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      temperature: 0.7,
      messages: [{ role: 'user', content: prompt }]
    });

    const texto = response.content[0].text;

    // Extraer JSON
    const jsonMatch = texto.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No se pudo parsear la respuesta');
    }

    const resultado = JSON.parse(jsonMatch[0]);

    // Validar estructura
    if (!resultado.whispers || resultado.whispers.length !== 6) {
      throw new Error('Respuesta inválida: se necesitan 6 whispers');
    }

    return NextResponse.json({
      success: true,
      productoId,
      nombre,
      whispers: resultado.whispers
    });

  } catch (error) {
    console.error('Error generando whispers:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}

// PUT - Guardar whispers en WooCommerce
export async function PUT(request) {
  try {
    const { productoId, whispers } = await request.json();

    if (!productoId || !whispers) {
      return NextResponse.json({
        success: false,
        error: 'Se requiere productoId y whispers'
      }, { status: 400 });
    }

    const auth = Buffer.from(`${WC_KEY}:${WC_SECRET}`).toString('base64');

    const updateData = {
      meta_data: [
        { key: '_duendes_whispers', value: JSON.stringify(whispers) },
        { key: '_duendes_whispers_fecha', value: new Date().toISOString() }
      ]
    };

    const response = await fetch(
      `${WC_URL}/wp-json/wc/v3/products/${productoId}`,
      {
        method: 'PUT',
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData)
      }
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Error actualizando producto: ${error}`);
    }

    const producto = await response.json();

    return NextResponse.json({
      success: true,
      mensaje: `Whispers guardados para ${producto.name}`,
      productoId: producto.id,
      totalWhispers: whispers.length
    });

  } catch (error) {
    console.error('Error guardando whispers:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}

// GET - Obtener whispers de un producto
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const productoId = searchParams.get('productoId');

  if (!productoId) {
    return NextResponse.json({
      success: false,
      error: 'Se requiere productoId'
    }, { status: 400 });
  }

  try {
    const auth = Buffer.from(`${WC_KEY}:${WC_SECRET}`).toString('base64');

    const response = await fetch(
      `${WC_URL}/wp-json/wc/v3/products/${productoId}`,
      {
        headers: { 'Authorization': `Basic ${auth}` },
        cache: 'no-store'
      }
    );

    if (!response.ok) {
      throw new Error('Producto no encontrado');
    }

    const producto = await response.json();
    const whispersRaw = producto.meta_data?.find(m => m.key === '_duendes_whispers')?.value;

    let whispers = [];
    if (whispersRaw) {
      try {
        whispers = JSON.parse(whispersRaw);
      } catch (e) {
        whispers = [];
      }
    }

    return NextResponse.json({
      success: true,
      productoId: producto.id,
      nombre: producto.name,
      tieneWhispers: whispers.length > 0,
      whispers
    });

  } catch (error) {
    console.error('Error obteniendo whispers:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
