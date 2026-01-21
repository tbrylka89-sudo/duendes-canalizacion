/**
 * GUARDIAN INTELLIGENCE - API GENERAR FICHA
 * POST: Genera datos de ficha del guardián usando IA
 */

import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import fichaConfig from '@/lib/ficha-guardian-config.json';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function OPTIONS() {
  return new Response(null, { headers: corsHeaders });
}

// Obtener descripción de especie
function obtenerDescripcionEspecie(especieId) {
  const clasica = fichaConfig.especies.clasicas.find(e => e.id === especieId);
  if (clasica) return clasica;

  const exclusiva = fichaConfig.especies.exclusivas.find(e => e.id === especieId);
  if (exclusiva) return exclusiva;

  const arquetipo = fichaConfig.especies.arquetipos_conocidos.find(e => e.id === especieId);
  if (arquetipo) return arquetipo;

  return null;
}

// Obtener descripción de categoría
function obtenerDescripcionCategoria(categoriaId) {
  return fichaConfig.categorias[categoriaId] || null;
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { nombre, historia, especie, categoria, genero } = body;

    if (!nombre || !historia) {
      return NextResponse.json({
        success: false,
        error: 'Se requiere nombre e historia del guardián'
      }, { status: 400, headers: corsHeaders });
    }

    // Obtener contexto de especie y categoría
    const infoEspecie = obtenerDescripcionEspecie(especie);
    const infoCategoria = obtenerDescripcionCategoria(categoria);

    const anthropic = new Anthropic();

    const prompt = `Sos un experto en crear fichas de personalidad para guardianes místicos de "Duendes del Uruguay".
Basándote en la historia y datos de este guardián, generá una ficha coherente con su esencia.

GUARDIÁN:
- Nombre: ${nombre}
- Especie: ${especie || 'guardián'} ${infoEspecie ? `(${infoEspecie.descripcion})` : ''}
- Categoría: ${categoria || 'protección'} ${infoCategoria ? `(${infoCategoria.descripcion})` : ''}
- Género: ${genero === 'F' ? 'Femenino' : 'Masculino'}

HISTORIA:
${historia}

INSTRUCCIONES:
Generá una ficha que sea COHERENTE con la historia y personalidad del guardián.
- La flor debe resonar con su energía
- La piedra/cristal debe conectar con su propósito
- El color debe reflejar su esencia
- Los gustos deben ser específicos y únicos
- El dato curioso debe hacer que alguien diga "ayyy es como yo"
- La frase/lema debe ser algo que este guardián DIRÍA, no genérico

FORMATO DE RESPUESTA (JSON exacto):
{
  "flor_favorita": "nombre de la flor (sin explicación)",
  "piedra_favorita": "nombre del cristal/piedra",
  "color_favorito": "color específico (ej: verde musgo, no solo verde)",
  "espacio_casa": "lugar específico de la casa",
  "elemento": "Fuego|Agua|Tierra|Aire|Éter",
  "estacion": "Primavera|Verano|Otoño|Invierno",
  "momento_dia": "momento específico (ej: las 3am cuando todo está en silencio)",
  "le_gusta_pasear": "Sí, le encanta|No, prefiere quedarse|Que le pregunte primero",
  "le_gusta": ["cosa1", "cosa2", "cosa3"],
  "no_le_gusta": ["cosa1", "cosa2", "cosa3"],
  "frase_lema": "frase que diría este guardián",
  "dato_curioso": "algo único y entrañable que lo humaniza"
}

IMPORTANTE:
- Respondé SOLO con el JSON, sin explicaciones
- Los gustos deben ser específicos, no genéricos como "la naturaleza"
- El dato curioso debe ser algo tierno/gracioso, que genere conexión
- La frase debe sonar como algo que ESTE guardián diría, con su personalidad`;

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      messages: [
        { role: 'user', content: prompt }
      ]
    });

    // Extraer el JSON de la respuesta
    const respuestaTexto = message.content[0].text;

    // Intentar parsear el JSON
    let ficha;
    try {
      // Buscar JSON en la respuesta (por si hay texto extra)
      const jsonMatch = respuestaTexto.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        ficha = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No se encontró JSON en la respuesta');
      }
    } catch (parseError) {
      console.error('[GI Ficha] Error parseando respuesta:', respuestaTexto);
      return NextResponse.json({
        success: false,
        error: 'Error procesando respuesta de IA',
        detalle: parseError.message
      }, { status: 500, headers: corsHeaders });
    }

    // Validar campos requeridos
    const camposRequeridos = [
      'flor_favorita', 'piedra_favorita', 'color_favorito',
      'espacio_casa', 'elemento', 'estacion', 'momento_dia',
      'le_gusta_pasear', 'le_gusta', 'no_le_gusta',
      'frase_lema', 'dato_curioso'
    ];

    for (const campo of camposRequeridos) {
      if (!ficha[campo]) {
        return NextResponse.json({
          success: false,
          error: `Campo faltante: ${campo}`
        }, { status: 500, headers: corsHeaders });
      }
    }

    // Asegurar que le_gusta y no_le_gusta son arrays
    if (!Array.isArray(ficha.le_gusta)) {
      ficha.le_gusta = [ficha.le_gusta];
    }
    if (!Array.isArray(ficha.no_le_gusta)) {
      ficha.no_le_gusta = [ficha.no_le_gusta];
    }

    return NextResponse.json({
      success: true,
      ficha,
      guardian: nombre
    }, { headers: corsHeaders });

  } catch (error) {
    console.error('[GI Ficha] Error:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500, headers: corsHeaders });
  }
}
