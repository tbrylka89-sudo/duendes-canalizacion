import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { kv } from '@vercel/kv';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

/**
 * API de Sugerencias de Tito
 * Analiza datos del test y genera recomendaciones de negocio
 */

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const key = searchParams.get('key');
  const forceRefresh = searchParams.get('refresh') === 'true';

  // Validar API key
  if (key !== process.env.INSIGHTS_API_KEY) {
    return NextResponse.json({ error: 'API key requerida' }, { status: 401 });
  }

  try {
    // Verificar si hay sugerencias cacheadas recientes (menos de 6 horas)
    const cacheKey = 'tito:suggestions_cache';
    if (!forceRefresh) {
      const cached = await kv.get(cacheKey);
      if (cached && cached.generated_at) {
        const cacheAge = Date.now() - new Date(cached.generated_at).getTime();
        if (cacheAge < 6 * 60 * 60 * 1000) { // 6 horas
          return NextResponse.json({
            ...cached,
            from_cache: true
          });
        }
      }
    }

    // Obtener datos de aprendizaje
    const learningData = await kv.get('tito:learning_data') || {};
    const statsV9 = await kv.get('test_guardian_v9:stats') || {};
    const statsOld = await kv.get('test_guardian:stats') || {};

    // Combinar estadísticas
    const totalTests = (statsV9.total || 0) + (statsOld.total || 0);

    if (totalTests < 5) {
      return NextResponse.json({
        success: true,
        message: 'Todavía no hay suficientes datos para generar sugerencias. Necesito al menos 5 tests completados.',
        total_tests: totalTests,
        suggestions: null
      });
    }

    // Preparar datos para análisis
    const dataForAnalysis = {
      total_tests: totalTests,
      keywords_frecuentes: Object.entries(learningData.keywords_frequency || {})
        .sort((a, b) => b[1] - a[1])
        .slice(0, 30),
      distribucion_guardianes: { ...statsV9.by_guardian, ...statsOld.by_guardian },
      distribucion_paises: { ...statsV9.by_country, ...statsOld.by_country },
      distribucion_patrones: { ...statsV9.by_patron, ...statsOld.by_patron },
      distribucion_momentos: { ...statsV9.by_momento, ...statsOld.by_momento },
      sintomas_corporales: { ...statsV9.by_cuerpo, ...statsOld.by_cuerpo },
      ultimos_insights: (learningData.recent_insights || []).slice(-20),
      textos_recientes: (learningData.text_responses || [])
        .slice(-30)
        .map(t => ({ field: t.field, text: t.text.slice(0, 200), guardian: t.guardian }))
    };

    // Generar sugerencias con IA
    const suggestions = await generateSuggestionsWithAI(dataForAnalysis);

    // Cachear resultado
    const result = {
      success: true,
      generated_at: new Date().toISOString(),
      total_tests: totalTests,
      ...suggestions
    };

    await kv.set(cacheKey, result, { ex: 24 * 60 * 60 }); // 24 horas

    return NextResponse.json(result);

  } catch (error) {
    console.error('Error generando sugerencias:', error);
    return NextResponse.json(
      { error: 'Error generando sugerencias', message: error.message },
      { status: 500 }
    );
  }
}

async function generateSuggestionsWithAI(data) {
  const prompt = `Sos Tito, el asistente inteligente de Duendes del Uruguay, un e-commerce de guardianes canalizados (figuras artesanales místicas).

DATOS DEL TEST DEL GUARDIÁN (últimas semanas):

Total de tests completados: ${data.total_tests}

PALABRAS CLAVE MÁS FRECUENTES (lo que la gente escribe):
${data.keywords_frecuentes.map(([k, v]) => `- "${k}": ${v} veces`).join('\n')}

DISTRIBUCIÓN DE GUARDIANES RECOMENDADOS:
${Object.entries(data.distribucion_guardianes).map(([g, c]) => `- ${g}: ${c}`).join('\n')}

DISTRIBUCIÓN POR PAÍS:
${Object.entries(data.distribucion_paises).slice(0, 10).map(([p, c]) => `- ${p}: ${c}`).join('\n')}

PATRONES FAMILIARES MÁS COMUNES:
${Object.entries(data.distribucion_patrones).map(([p, c]) => `- ${p}: ${c}`).join('\n')}

MOMENTO DE VIDA:
${Object.entries(data.distribucion_momentos).map(([m, c]) => `- ${m}: ${c}`).join('\n')}

SÍNTOMAS CORPORALES:
${Object.entries(data.sintomas_corporales).map(([s, c]) => `- ${s}: ${c}`).join('\n')}

EJEMPLOS DE TEXTOS RECIENTES (respuestas libres):
${data.textos_recientes.slice(0, 15).map(t => `[${t.field}] "${t.text}"`).join('\n')}

ÚLTIMOS INSIGHTS DETECTADOS:
${data.ultimos_insights.slice(0, 10).map(i => `- Dolor: "${i.dolor}" → Guardián: ${i.guardian}`).join('\n')}

---

INSTRUCCIONES:
Analizá estos datos y generá sugerencias ESPECÍFICAS y ACCIONABLES para el negocio.

Respondé en formato JSON válido con esta estructura:
{
  "resumen_ejecutivo": "Párrafo de 2-3 oraciones resumiendo los hallazgos principales",

  "product_ideas": [
    {
      "nombre": "Nombre sugerido del producto",
      "tipo": "guardian|ritual_kit|curso|contenido",
      "descripcion": "Por qué este producto basado en los datos",
      "audiencia": "A quién va dirigido",
      "urgencia": "alta|media|baja"
    }
  ],

  "content_ideas": [
    {
      "titulo": "Título del contenido",
      "formato": "post|video|email|blog",
      "tema": "De qué trata",
      "por_que": "Por qué este tema según los datos"
    }
  ],

  "pain_points_no_atendidos": [
    {
      "dolor": "Descripción del dolor detectado",
      "frecuencia": "Qué tan común es",
      "oportunidad": "Cómo atenderlo"
    }
  ],

  "segmentos_detectados": [
    {
      "nombre": "Nombre del segmento",
      "caracteristicas": "Qué los define",
      "tamaño_estimado": "porcentaje del total",
      "estrategia": "Cómo comunicarse con ellos"
    }
  ],

  "alertas": [
    "Cosas importantes que noté que requieren atención"
  ],

  "mensaje_tito": "Un mensaje corto y amigable de Tito sobre lo que ve en los datos (tono rioplatense, cálido)"
}

IMPORTANTE:
- Sé ESPECÍFICO, no genérico
- Basá todo en los DATOS reales, no en suposiciones
- Priorizá por impacto potencial
- El tono de Tito es amigable, rioplatense, como un amigo que te da consejos de negocio
- Máximo 3 items por categoría para mantenerlo accionable`;

  try {
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2000,
      messages: [{ role: 'user', content: prompt }]
    });

    const responseText = message.content[0]?.text || '';
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);

    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
  } catch (error) {
    console.error('Error con IA:', error);
  }

  // Fallback si IA falla
  return generateFallbackSuggestions(data);
}

function generateFallbackSuggestions(data) {
  // Encontrar guardián más común
  const topGuardian = Object.entries(data.distribucion_guardianes)
    .sort((a, b) => b[1] - a[1])[0];

  // Encontrar patrón más común
  const topPatron = Object.entries(data.distribucion_patrones)
    .sort((a, b) => b[1] - a[1])[0];

  // Encontrar país más común
  const topPais = Object.entries(data.distribucion_paises)
    .sort((a, b) => b[1] - a[1])[0];

  return {
    resumen_ejecutivo: `Con ${data.total_tests} tests completados, el guardián más buscado es ${topGuardian?.[0] || 'protección'}. El patrón familiar más común es "${topPatron?.[0] || 'miedo'}". La mayoría de visitantes son de ${topPais?.[0] || 'Argentina'}.`,

    product_ideas: [
      {
        nombre: `Guardián especializado en ${topPatron?.[0] || 'sanación'}`,
        tipo: 'guardian',
        descripcion: `Basado en que muchas personas mencionan "${topPatron?.[0]}" como patrón a soltar`,
        audiencia: 'Personas que buscan romper patrones generacionales',
        urgencia: 'media'
      }
    ],

    content_ideas: [
      {
        titulo: `Cómo soltar el patrón de ${topPatron?.[0] || 'miedo'}`,
        formato: 'post',
        tema: 'Patrones familiares y cómo romperlos',
        por_que: 'Es el patrón más mencionado en los tests'
      }
    ],

    pain_points_no_atendidos: [
      {
        dolor: 'Necesidad de validación emocional',
        frecuencia: 'Alta',
        oportunidad: 'Crear contenido que valide las experiencias de las personas'
      }
    ],

    segmentos_detectados: [
      {
        nombre: 'Sanadoras en proceso',
        caracteristicas: 'Mujeres que reconocen sus heridas y buscan sanar',
        tamaño_estimado: '40%',
        estrategia: 'Contenido empático, sin prisa, validador'
      }
    ],

    alertas: [
      'Los datos aún son limitados. Más tests = mejores sugerencias.'
    ],

    mensaje_tito: `¡Hola! Soy Tito. Estuve mirando los datos y hay cosas interesantes. Todavía necesito más información para darte consejos más precisos, pero lo que veo es que la gente que llega acá está buscando ${topGuardian?.[0] || 'protección'} y viene con el patrón de "${topPatron?.[0] || 'miedo'}". Seguimos aprendiendo juntos.`
  };
}
