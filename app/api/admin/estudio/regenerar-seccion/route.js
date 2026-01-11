export const dynamic = 'force-dynamic';
export const maxDuration = 60;

// ═══════════════════════════════════════════════════════════════
// REGENERADOR DE SECCIÓN INDIVIDUAL
// Permite regenerar una sección con instrucciones específicas
// ═══════════════════════════════════════════════════════════════

const SYSTEM_PROMPT = `Sos Thibisay, la voz de Duendes del Uruguay. Escribís en español rioplatense.

REGLAS INQUEBRANTABLES:
- PROHIBIDO frases cliché de IA ("En lo profundo del bosque", "Las brumas", "Un manto de estrellas", etc.)
- Primera frase = IMPACTO EMOCIONAL DIRECTO
- Escribí como hablando con una amiga
- Cada párrafo debe aportar VALOR REAL
- Tono cálido pero no cursi
- Detalles específicos, no abstracciones

Vas a recibir una sección para regenerar con instrucciones específicas. Mantené la esencia pero aplicá los cambios pedidos.`;

export async function POST(request) {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    return Response.json({ success: false, error: 'API key no configurada' }, { status: 500 });
  }

  try {
    const {
      seccionId,
      seccionNombre,
      contenidoActual,
      contexto,
      instruccion = ''
    } = await request.json();

    if (!seccionNombre) {
      return Response.json({ success: false, error: 'Nombre de sección requerido' }, { status: 400 });
    }

    const userPrompt = `CONTEXTO DEL CONTENIDO:
- Título: "${contexto.titulo}"
- Categoría: ${contexto.categoria}
- Tipo: ${contexto.tipo}

SECCIÓN A REGENERAR: "${seccionNombre}"

CONTENIDO ACTUAL:
"""
${contenidoActual || '(vacío)'}
"""

${contexto.otrasSecciones ? `OTRAS SECCIONES (para contexto):
"""
${contexto.otrasSecciones.substring(0, 500)}...
"""` : ''}

INSTRUCCIÓN: ${instruccion || 'Regenerá esta sección manteniendo la esencia pero mejorando la calidad'}

IMPORTANTE:
- Devolvé SOLO el contenido de la sección, sin título ni formato extra
- Mínimo 150 palabras
- Primera frase con impacto emocional
- Sin clichés de IA
- Mantené coherencia con el resto del contenido`;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 2000,
        system: SYSTEM_PROMPT,
        messages: [{ role: 'user', content: userPrompt }]
      })
    });

    if (!response.ok) {
      return Response.json({ success: false, error: `Error API: ${response.status}` }, { status: 500 });
    }

    const data = await response.json();
    const contenido = data.content?.[0]?.text || '';

    return Response.json({
      success: true,
      contenido: contenido.trim(),
      seccionId,
    });

  } catch (error) {
    console.error('Error:', error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
