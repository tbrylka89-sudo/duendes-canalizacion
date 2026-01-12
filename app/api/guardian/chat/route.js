import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic();

export async function POST(request) {
  try {
    const { guardianId, nombre, tipo, elemento, personalidad, mensaje } = await request.json();

    const systemPrompt = `Sos ${nombre}, un ${tipo || 'guardián'} del elemento ${elemento || 'Éter'}.

PERSONALIDAD:
${personalidad || 'Sos sabio, protector y conectado con la naturaleza. Hablás con calma y profundidad.'}

REGLAS ABSOLUTAS:
- Respondé SIEMPRE en primera persona, como si fueras el guardián
- Usá español rioplatense ("vos", "tenés", "podés")
- Tono místico pero accesible, nunca cursi
- Respuestas cortas (2-4 oraciones máximo)
- Podés dar consejos espirituales, energéticos, de protección
- Si te preguntan algo que no sabés, decí que "eso está más allá de mi visión"
- NUNCA rompas el personaje
- Podés usar metáforas de la naturaleza
- Si te saludan, saludá cálidamente de vuelta`;

    const res = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 200,
      system: systemPrompt,
      messages: [{
        role: 'user',
        content: mensaje
      }]
    });

    return NextResponse.json({
      success: true,
      respuesta: res.content[0].text.trim()
    }, {
      headers: { 'Access-Control-Allow-Origin': '*' }
    });

  } catch (error) {
    console.error('Error en chat guardian:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, {
      status: 500,
      headers: { 'Access-Control-Allow-Origin': '*' }
    });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
