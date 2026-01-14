import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { kv } from '@vercel/kv';
import { GUARDIANS, RESULT_GENERATION_PROMPT, analyzeTextForKeywords } from '@/lib/test-questions';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

export async function POST(request) {
  try {
    const body = await request.json();
    const { identity, answers, contact } = body;

    // Validar datos mínimos
    if (!identity?.nombre || !contact?.email) {
      return NextResponse.json(
        { error: 'Nombre y email son requeridos' },
        { status: 400 }
      );
    }

    // Calcular edad aproximada desde fecha de nacimiento
    let edad = 'desconocida';
    if (identity.nacimiento) {
      const nacimiento = new Date(identity.nacimiento);
      const hoy = new Date();
      edad = Math.floor((hoy - nacimiento) / (365.25 * 24 * 60 * 60 * 1000));
    }

    // Preparar respuestas para análisis
    const respuestasTexto = Object.entries(answers)
      .map(([key, value]) => `${key}: ${typeof value === 'object' ? value.label || value.id : value}`)
      .join('\n');

    // Generar resultado con IA
    let resultado;
    try {
      const prompt = RESULT_GENERATION_PROMPT
        .replace('{nombre}', identity.nombre)
        .replace('{pais}', identity.pais || 'desconocido')
        .replace('{edad}', edad)
        .replace('{respuestas_completas}', respuestasTexto);

      const message = await anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1500,
        messages: [{ role: 'user', content: prompt }]
      });

      const responseText = message.content[0]?.text || '';

      // Extraer JSON de la respuesta
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        resultado = JSON.parse(jsonMatch[0]);
      }
    } catch (aiError) {
      console.error('Error con IA:', aiError);
    }

    // Fallback si IA falla: análisis básico
    if (!resultado) {
      resultado = generateFallbackResult(identity, answers);
    }

    // Obtener datos del guardián
    const guardianType = resultado.guardian?.tipo || 'proteccion';
    const guardianData = GUARDIANS[guardianType] || GUARDIANS.proteccion;

    // Construir respuesta final
    const finalResult = {
      success: true,
      guardian: {
        tipo: guardianType,
        nombre: guardianData.nombre,
        elemento: guardianData.elemento,
        color: guardianData.color,
        mensaje: resultado.revelacion || guardianData.mensaje_tipo,
        imagen: `https://duendesdeluruguay.com/wp-content/uploads/2024/guardian-${guardianType}.jpg`
      },
      revelation: resultado.revelacion || `${identity.nombre}, tu guardián te encontró. No llegaste por casualidad.`,
      sealedPhrase: resultado.frase_sellada || 'Tu fuerza es más grande que tu miedo.',
      ritual: resultado.ritual || 'Esta noche, apoyá la mano en tu pecho y decí: "Hoy me elijo. Hoy vuelvo a mí."',
      reasons: resultado.razones || [
        'Porque tu energía pidió protección sin palabras',
        'Porque sentí el cansancio de quien ha dado demasiado',
        'Porque el guardián que te eligió sabe sostenerte'
      ],
      analysis: {
        dolor_principal: resultado.dolor_principal,
        necesidad_oculta: resultado.necesidad_oculta,
        patron: resultado.patron
      }
    };

    // Guardar en KV para insights
    const emailHash = Buffer.from(contact.email.toLowerCase()).toString('base64').slice(0, 20);
    const visitorId = `tg9:${emailHash}`;

    const dataToSave = {
      visitor_id: visitorId,
      identity,
      contact: { email: contact.email, prefijo: contact.prefijo, whatsapp: contact.whatsapp },
      answers,
      result: {
        guardian: guardianType,
        dolor_principal: resultado.dolor_principal,
        necesidad_oculta: resultado.necesidad_oculta,
        patron: resultado.patron
      },
      timestamp: new Date().toISOString(),
      version: 'v9'
    };

    // Guardar perfil del visitante
    await kv.set(visitorId, dataToSave, { ex: 365 * 24 * 60 * 60 }); // 1 año

    // Actualizar estadísticas globales
    await updateGlobalStats(guardianType, identity.pais, answers);

    // Enviar a endpoint de aprendizaje
    try {
      await fetch(`${process.env.VERCEL_URL || 'https://duendes-vercel.vercel.app'}/api/insights/learn`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          visitorId,
          answers,
          guardian: guardianType,
          analysis: resultado,
          timestamp: new Date().toISOString()
        })
      });
    } catch (learnError) {
      console.error('Error enviando a learn:', learnError);
    }

    return NextResponse.json(finalResult);

  } catch (error) {
    console.error('Error en process-result:', error);
    return NextResponse.json(
      { error: 'Error procesando resultado', message: error.message },
      { status: 500 }
    );
  }
}

// Fallback si IA falla
function generateFallbackResult(identity, answers) {
  // Analizar respuestas para determinar guardián
  let guardianType = 'proteccion';

  const momento = answers.momento_vida?.id || answers.momento_vida;
  const patron = answers.patron_familiar?.id || answers.patron_familiar;
  const cuerpo = answers.cuerpo?.id || answers.cuerpo;

  if (momento === 'sanando' || patron === 'culpa' || patron === 'sacrificio') {
    guardianType = 'sanacion';
  } else if (momento === 'buscando' || patron === 'miedo') {
    guardianType = 'abundancia';
  } else if (cuerpo === 'pecho' || patron === 'silencio') {
    guardianType = 'amor';
  } else if (momento === 'transicion' || momento === 'despertar') {
    guardianType = 'camino';
  }

  return {
    guardian: { tipo: guardianType },
    dolor_principal: 'Un peso que has cargado demasiado tiempo',
    necesidad_oculta: 'Permiso para descansar y recibir',
    patron: 'Poner a otros primero',
    revelacion: `${identity.nombre}, leí tu señal con respeto. Sentí algo claro: estás lista para soltar lo que ya no es tuyo.`,
    frase_sellada: 'Tu energía no está rota. Está despertando.',
    ritual: 'Esta noche, apoyá la mano en tu pecho y decí: "Hoy me elijo. Hoy vuelvo a mí."',
    razones: [
      'Porque tu energía pidió protección sin palabras',
      'Porque sentí el cansancio de quien ha dado demasiado',
      'Porque el guardián que te eligió sabe sostenerte'
    ]
  };
}

// Actualizar estadísticas globales
async function updateGlobalStats(guardianType, pais, answers) {
  try {
    const statsKey = 'test_guardian_v9:stats';
    let stats = await kv.get(statsKey) || {
      total: 0,
      by_guardian: {},
      by_country: {},
      by_momento: {},
      by_patron: {},
      by_cuerpo: {},
      keywords: [],
      updated: null
    };

    stats.total++;
    stats.by_guardian[guardianType] = (stats.by_guardian[guardianType] || 0) + 1;

    if (pais) {
      stats.by_country[pais] = (stats.by_country[pais] || 0) + 1;
    }

    const momento = answers.momento_vida?.id || answers.momento_vida;
    if (momento) {
      stats.by_momento[momento] = (stats.by_momento[momento] || 0) + 1;
    }

    const patron = answers.patron_familiar?.id || answers.patron_familiar;
    if (patron) {
      stats.by_patron[patron] = (stats.by_patron[patron] || 0) + 1;
    }

    const cuerpo = answers.cuerpo?.id || answers.cuerpo;
    if (cuerpo) {
      stats.by_cuerpo[cuerpo] = (stats.by_cuerpo[cuerpo] || 0) + 1;
    }

    // Extraer keywords de respuestas de texto
    const textAnswers = ['infancia', 'memoria_feliz', 'dolor_hoy', 'miedo_secreto', 'pedido_universo', 'vision_futuro', 'recuerdo_recurrente'];
    textAnswers.forEach(key => {
      if (answers[key] && typeof answers[key] === 'string') {
        const keywords = analyzeTextForKeywords(answers[key]);
        stats.keywords = [...new Set([...stats.keywords, ...keywords.dolor, ...keywords.emocion])].slice(-100);
      }
    });

    stats.updated = new Date().toISOString();

    await kv.set(statsKey, stats);
  } catch (error) {
    console.error('Error actualizando stats:', error);
  }
}
