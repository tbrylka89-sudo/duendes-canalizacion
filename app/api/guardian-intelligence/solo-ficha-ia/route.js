/**
 * GUARDIAN INTELLIGENCE - SOLO FICHA IA
 * POST: Genera solo la ficha de personalidad (flor, piedra, gustos, etc)
 * NO toca los datos básicos (tamaño, especie, categoría)
 * v1.1 - 2026-02-10
 */

import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function OPTIONS() {
  return new Response(null, { headers: corsHeaders });
}

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    endpoint: 'solo-ficha-ia',
    version: '1.1',
    methods: ['POST'],
    description: 'Genera ficha de personalidad (flor, piedra, gustos, etc) usando IA'
  }, { headers: corsHeaders });
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { nombre, historia, datosBasicos } = body;

    if (!nombre || !historia) {
      return NextResponse.json({
        success: false,
        error: 'Se requiere nombre e historia'
      }, { status: 400, headers: corsHeaders });
    }

    const anthropic = new Anthropic();

    const prompt = `Sos un experto en crear fichas de personalidad para guardianes místicos de "Duendes del Uruguay".
Basándote en la historia y datos de este guardián, generá una ficha coherente con su esencia.

GUARDIÁN:
- Nombre: ${nombre}
- Especie: ${datosBasicos?.especie || 'duende'}
- Categoría: ${datosBasicos?.categoria || 'proteccion'}
- Género: ${datosBasicos?.genero === 'F' ? 'Femenino' : 'Masculino'}
- Tamaño: ${datosBasicos?.tamano_cm || '?'} cm
- Accesorios: ${datosBasicos?.accesorios || 'No especificados'}

HISTORIA:
${historia}

INSTRUCCIONES:
Generá una ficha que sea COHERENTE con la historia, los accesorios y la personalidad del guardián.
- La flor debe resonar con su energía y colores
- La piedra/cristal debe conectar con los que ya tiene o su propósito
- El color debe reflejar su esencia visual
- Los gustos deben ser específicos y únicos, basados en su historia
- El dato curioso debe hacer que alguien diga "ayyy es como yo"
- La frase/lema debe ser algo que ESTE guardián DIRÍA, no genérico

FORMATO DE RESPUESTA (JSON exacto):
{
  "flor_favorita": "nombre de la flor",
  "piedra_favorita": "nombre del cristal/piedra",
  "color_favorito": "color específico (ej: violeta profundo)",
  "espacio_casa": "lugar específico de la casa",
  "elemento": "Fuego|Agua|Tierra|Aire|Éter",
  "estacion": "Primavera|Verano|Otoño|Invierno",
  "momento_dia": "momento específico",
  "le_gusta_pasear": "Sí, le encanta|No, prefiere quedarse|Que le pregunte primero",
  "le_gusta": ["cosa1", "cosa2", "cosa3"],
  "no_le_gusta": ["cosa1", "cosa2", "cosa3"],
  "frase_lema": "frase que diría este guardián",
  "dato_curioso": "algo único y entrañable"
}

Respondé SOLO con el JSON.`;

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      messages: [{ role: 'user', content: prompt }]
    });

    const respuestaTexto = message.content[0].text;

    // Parsear JSON
    let fichaIA;
    try {
      const jsonMatch = respuestaTexto.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        fichaIA = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No se encontró JSON');
      }
    } catch (parseError) {
      return NextResponse.json({
        success: false,
        error: 'Error parseando respuesta de IA'
      }, { status: 500, headers: corsHeaders });
    }

    // Asegurar arrays
    if (!Array.isArray(fichaIA.le_gusta)) {
      fichaIA.le_gusta = [fichaIA.le_gusta];
    }
    if (!Array.isArray(fichaIA.no_le_gusta)) {
      fichaIA.no_le_gusta = [fichaIA.no_le_gusta];
    }

    return NextResponse.json({
      success: true,
      fichaIA,
      mensaje: 'Ficha IA generada correctamente'
    }, { headers: corsHeaders });

  } catch (error) {
    console.error('[GI Solo-Ficha-IA] Error:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500, headers: corsHeaders });
  }
}
