import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import {
  BASE_QUESTIONS,
  getQuestionByStep,
  getTotalQuestions,
  QUESTION_GENERATION_PROMPT
} from '@/lib/test-questions';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

export async function POST(request) {
  try {
    const body = await request.json();
    const { step, previousAnswers, identity } = body;

    // Validar step
    if (typeof step !== 'number' || step < 1 || step > getTotalQuestions()) {
      return NextResponse.json(
        { error: 'Step inválido', validRange: `1-${getTotalQuestions()}` },
        { status: 400 }
      );
    }

    // Obtener pregunta base
    const baseQuestion = getQuestionByStep(step);
    if (!baseQuestion) {
      return NextResponse.json(
        { error: 'Pregunta no encontrada' },
        { status: 404 }
      );
    }

    // Si no hay respuestas previas o es la primera pregunta, usar pregunta base
    const hasPreviousContext = previousAnswers && Object.keys(previousAnswers).length > 0;

    let questionText = baseQuestion.baseText;
    let personalized = false;

    // Intentar personalizar con IA si hay contexto
    if (hasPreviousContext && identity?.nombre) {
      try {
        const prompt = QUESTION_GENERATION_PROMPT
          .replace('{nombre}', identity.nombre)
          .replace('{respuestas_previas}', JSON.stringify(previousAnswers, null, 2))
          .replace('{pregunta_base}', baseQuestion.baseText);

        const message = await anthropic.messages.create({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 150,
          messages: [{ role: 'user', content: prompt }]
        });

        const aiQuestion = message.content[0]?.text?.trim();

        // Validar que la respuesta sea razonable
        if (aiQuestion && aiQuestion.length > 10 && aiQuestion.length < 300 && !aiQuestion.includes('{')) {
          questionText = aiQuestion;
          personalized = true;
        }
      } catch (aiError) {
        console.error('Error generando pregunta con IA:', aiError);
        // Usar variación aleatoria como fallback
        if (baseQuestion.variations && baseQuestion.variations.length > 0) {
          questionText = baseQuestion.variations[Math.floor(Math.random() * baseQuestion.variations.length)];
        }
      }
    } else {
      // Sin contexto: usar variación aleatoria para que no sea siempre igual
      if (baseQuestion.variations && baseQuestion.variations.length > 0 && Math.random() > 0.5) {
        questionText = baseQuestion.variations[Math.floor(Math.random() * baseQuestion.variations.length)];
      }
    }

    // Construir respuesta
    const response = {
      question: {
        id: baseQuestion.id,
        step: baseQuestion.step,
        block: baseQuestion.block,
        text: questionText,
        type: baseQuestion.type,
        placeholder: baseQuestion.placeholder || '',
        hint: baseQuestion.hint || ''
      },
      isLast: baseQuestion.isFinal === true,
      totalQuestions: getTotalQuestions(),
      personalized
    };

    // Agregar opciones si es tipo select
    if (baseQuestion.type === 'select' && baseQuestion.options) {
      response.question.options = baseQuestion.options;
    }

    return NextResponse.json(response);

  } catch (error) {
    console.error('Error en next-question:', error);
    return NextResponse.json(
      { error: 'Error interno', message: error.message },
      { status: 500 }
    );
  }
}

// GET para obtener todas las preguntas (debug/admin)
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const key = searchParams.get('key');

  // Proteger con API key
  if (key !== process.env.INSIGHTS_API_KEY) {
    return NextResponse.json({ error: 'API key requerida' }, { status: 401 });
  }

  return NextResponse.json({
    totalQuestions: getTotalQuestions(),
    questions: BASE_QUESTIONS.map(q => ({
      id: q.id,
      step: q.step,
      block: q.block,
      type: q.type,
      baseText: q.baseText,
      hasVariations: q.variations?.length || 0,
      analyzes: q.analyzes
    }))
  });
}
