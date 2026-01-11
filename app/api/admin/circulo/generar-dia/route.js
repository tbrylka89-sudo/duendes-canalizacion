import { kv } from '@vercel/kv';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

// ═══════════════════════════════════════════════════════════════
// GENERADOR DE CONTENIDO PARA UN DÍA ESPECÍFICO
// ═══════════════════════════════════════════════════════════════

const ESTRUCTURA_SEMANAL = {
  0: { tipo: 'ritual', categoria: 'rituales', nombre: 'Ritual Semanal' },
  1: { tipo: 'meditacion', categoria: 'sanacion', nombre: 'Meditación Guiada' },
  2: { tipo: 'articulo', categoria: 'esoterico', nombre: 'Sabiduría Esotérica' },
  3: { tipo: 'guia', categoria: 'diy', nombre: 'DIY Mágico' },
  4: { tipo: 'historia', categoria: 'duendes', nombre: 'Historias de Duendes' },
  5: { tipo: 'reflexion', categoria: 'cosmos', nombre: 'Conexión Lunar' },
  6: { tipo: 'articulo', categoria: 'sanacion', nombre: 'Sanación y Bienestar' },
};

const SYSTEM_PROMPT = `Sos Thibisay, la voz de Duendes del Uruguay. Escribís en español rioplatense.

REGLAS INQUEBRANTABLES:
- PROHIBIDO frases cliché de IA ("En lo profundo del bosque", "Las brumas", "Un manto de estrellas")
- Primera frase = IMPACTO EMOCIONAL DIRECTO
- Escribí como hablando con una amiga querida
- Cada párrafo debe aportar VALOR REAL
- Tono cálido pero no cursi
- Usá "vos" en lugar de "tú"

ESTRUCTURA: intro (150 palabras), desarrollo (400 palabras), practica (300 palabras), cierre (100 palabras)`;

export async function POST(request) {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    return Response.json({ success: false, error: 'API key no configurada' }, { status: 500 });
  }

  try {
    const { dia, mes, año, instruccionExtra } = await request.json();

    if (!dia || !mes || !año) {
      return Response.json({ success: false, error: 'Día, mes y año requeridos' }, { status: 400 });
    }

    const fecha = new Date(año, mes - 1, dia);
    const diaSemana = fecha.getDay();
    const estructura = ESTRUCTURA_SEMANAL[diaSemana];

    const userPrompt = `Generá contenido para El Círculo de Duendes del Uruguay.

FECHA: ${dia}/${mes}/${año}
DÍA: ${estructura.nombre}
CATEGORÍA: ${estructura.categoria}
TIPO: ${estructura.tipo}

${instruccionExtra ? `INSTRUCCIÓN ESPECIAL: ${instruccionExtra}` : ''}

Generá un JSON con: titulo, extracto, intro, desarrollo, practica, cierre

FORMATO:
{
  "titulo": "...",
  "extracto": "...",
  "intro": "...",
  "desarrollo": "...",
  "practica": "...",
  "cierre": "..."
}`;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4000,
        system: SYSTEM_PROMPT,
        messages: [{ role: 'user', content: userPrompt }]
      })
    });

    if (!response.ok) {
      throw new Error(`Error API: ${response.status}`);
    }

    const data = await response.json();
    const texto = data.content?.[0]?.text || '';
    const jsonMatch = texto.match(/\{[\s\S]*\}/);

    if (!jsonMatch) {
      throw new Error('No se pudo parsear la respuesta');
    }

    const contenido = JSON.parse(jsonMatch[0]);

    const contenidoCompleto = {
      id: `${año}-${mes}-${dia}`,
      fecha: fecha.toISOString(),
      dia,
      mes,
      año,
      diaSemana,
      tipo: estructura.tipo,
      categoria: estructura.categoria,
      titulo: contenido.titulo,
      extracto: contenido.extracto,
      secciones: {
        intro: contenido.intro,
        desarrollo: contenido.desarrollo,
        practica: contenido.practica,
        cierre: contenido.cierre
      },
      estado: 'borrador',
      generadoEn: new Date().toISOString(),
      publicadoEn: null,
      imagen: null,
      audio: null
    };

    await kv.set(`circulo:contenido:${año}:${mes}:${dia}`, contenidoCompleto);

    return Response.json({
      success: true,
      contenido: contenidoCompleto
    });

  } catch (error) {
    console.error('Error:', error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
