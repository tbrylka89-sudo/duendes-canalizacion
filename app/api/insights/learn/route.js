import { NextResponse } from 'next/server';
import { kv } from '@vercel/kv';

/**
 * API de Aprendizaje - Alimenta a Tito con datos del test
 * Recopila patrones para generar sugerencias de negocio
 */

export async function POST(request) {
  try {
    const body = await request.json();
    const { visitorId, answers, guardian, analysis, timestamp } = body;

    if (!visitorId || !answers) {
      return NextResponse.json(
        { error: 'visitorId y answers son requeridos' },
        { status: 400 }
      );
    }

    // Obtener datos de aprendizaje actuales
    const learnKey = 'tito:learning_data';
    let learningData = await kv.get(learnKey) || {
      total_entries: 0,
      text_responses: [],
      patterns: {
        dolor_guardian: {},  // {dolor: {guardian: count}}
        pais_guardian: {},   // {pais: {guardian: count}}
        patron_guardian: {}, // {patron: {guardian: count}}
        cuerpo_dolor: {}     // {cuerpo: [dolores]}
      },
      keywords_frequency: {},
      recent_insights: [],
      last_updated: null
    };

    // Incrementar contador
    learningData.total_entries++;

    // Guardar respuestas de texto para análisis posterior
    const textFields = ['infancia', 'memoria_feliz', 'dolor_hoy', 'miedo_secreto', 'pedido_universo', 'vision_futuro', 'recuerdo_recurrente'];
    textFields.forEach(field => {
      if (answers[field] && typeof answers[field] === 'string' && answers[field].length > 10) {
        learningData.text_responses.push({
          field,
          text: answers[field].slice(0, 500), // Limitar tamaño
          guardian,
          timestamp
        });
      }
    });

    // Mantener solo últimas 500 respuestas de texto
    if (learningData.text_responses.length > 500) {
      learningData.text_responses = learningData.text_responses.slice(-500);
    }

    // Analizar patrones dolor -> guardián
    if (analysis?.dolor_principal && guardian) {
      const dolorKey = analysis.dolor_principal.toLowerCase().slice(0, 50);
      if (!learningData.patterns.dolor_guardian[dolorKey]) {
        learningData.patterns.dolor_guardian[dolorKey] = {};
      }
      learningData.patterns.dolor_guardian[dolorKey][guardian] =
        (learningData.patterns.dolor_guardian[dolorKey][guardian] || 0) + 1;
    }

    // Analizar patrones patrón familiar -> guardián
    const patron = answers.patron_familiar?.id || answers.patron_familiar;
    if (patron && guardian) {
      if (!learningData.patterns.patron_guardian[patron]) {
        learningData.patterns.patron_guardian[patron] = {};
      }
      learningData.patterns.patron_guardian[patron][guardian] =
        (learningData.patterns.patron_guardian[patron][guardian] || 0) + 1;
    }

    // Analizar keywords frecuentes
    const allText = textFields
      .map(f => answers[f])
      .filter(t => typeof t === 'string')
      .join(' ')
      .toLowerCase();

    const keywords = extractKeywords(allText);
    keywords.forEach(kw => {
      learningData.keywords_frequency[kw] = (learningData.keywords_frequency[kw] || 0) + 1;
    });

    // Limpiar keywords poco frecuentes (mantener top 200)
    const sortedKeywords = Object.entries(learningData.keywords_frequency)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 200);
    learningData.keywords_frequency = Object.fromEntries(sortedKeywords);

    // Guardar insight reciente para Tito
    if (analysis) {
      learningData.recent_insights.push({
        guardian,
        dolor: analysis.dolor_principal,
        necesidad: analysis.necesidad_oculta,
        patron: analysis.patron,
        timestamp
      });
      // Mantener últimos 100 insights
      if (learningData.recent_insights.length > 100) {
        learningData.recent_insights = learningData.recent_insights.slice(-100);
      }
    }

    learningData.last_updated = new Date().toISOString();

    // Guardar datos de aprendizaje
    await kv.set(learnKey, learningData);

    // También guardar entrada individual para trazabilidad
    const entryKey = `tito:entry:${Date.now()}`;
    await kv.set(entryKey, {
      visitorId,
      guardian,
      dolor: analysis?.dolor_principal,
      patron,
      timestamp
    }, { ex: 30 * 24 * 60 * 60 }); // 30 días

    return NextResponse.json({
      success: true,
      message: 'Datos recibidos para aprendizaje',
      total_entries: learningData.total_entries
    });

  } catch (error) {
    console.error('Error en learn:', error);
    return NextResponse.json(
      { error: 'Error guardando datos', message: error.message },
      { status: 500 }
    );
  }
}

// GET para ver estado del aprendizaje (admin)
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const key = searchParams.get('key');

  if (key !== process.env.INSIGHTS_API_KEY) {
    return NextResponse.json({ error: 'API key requerida' }, { status: 401 });
  }

  try {
    const learningData = await kv.get('tito:learning_data') || {};

    return NextResponse.json({
      success: true,
      stats: {
        total_entries: learningData.total_entries || 0,
        text_responses_count: learningData.text_responses?.length || 0,
        top_keywords: Object.entries(learningData.keywords_frequency || {})
          .sort((a, b) => b[1] - a[1])
          .slice(0, 20),
        recent_insights_count: learningData.recent_insights?.length || 0,
        last_updated: learningData.last_updated
      },
      patterns: learningData.patterns
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Extraer keywords relevantes de texto
function extractKeywords(text) {
  const stopWords = ['el', 'la', 'los', 'las', 'un', 'una', 'de', 'del', 'en', 'con', 'por', 'para', 'que', 'es', 'son', 'mi', 'mis', 'me', 'te', 'se', 'su', 'sus', 'y', 'o', 'a', 'al', 'como', 'pero', 'si', 'no', 'ya', 'muy', 'mas', 'este', 'esta', 'esto', 'ese', 'esa', 'eso'];

  const emotionalKeywords = [
    'miedo', 'dolor', 'soledad', 'abandono', 'culpa', 'verguenza', 'ansiedad',
    'amor', 'feliz', 'paz', 'tranquila', 'libre', 'fuerte', 'esperanza',
    'mama', 'papa', 'madre', 'padre', 'familia', 'hijo', 'hija',
    'pareja', 'relacion', 'trabajo', 'dinero', 'salud',
    'cansada', 'agotada', 'perdida', 'sola', 'atrapada',
    'proteccion', 'seguridad', 'confianza', 'fuerza'
  ];

  const words = text
    .replace(/[^\w\sáéíóúñü]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 3)
    .filter(w => !stopWords.includes(w));

  // Retornar solo palabras emocionales encontradas
  return words.filter(w => emotionalKeywords.some(ek => w.includes(ek)));
}
