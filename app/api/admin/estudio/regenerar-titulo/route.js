export const dynamic = 'force-dynamic';

// ═══════════════════════════════════════════════════════════════
// REGENERADOR DE TÍTULO
// Genera títulos atrapantes que generen curiosidad real
// ═══════════════════════════════════════════════════════════════

export async function POST(request) {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    return Response.json({ success: false, error: 'API key no configurada' }, { status: 500 });
  }

  try {
    const { tituloActual, contenido, categoria, tipo } = await request.json();

    const userPrompt = `Generá un título ATRAPANTE para este contenido.

TÍTULO ACTUAL: "${tituloActual}"
CATEGORÍA: ${categoria}
TIPO: ${tipo}

CONTENIDO (resumen):
"""
${contenido.substring(0, 800)}...
"""

REGLAS PARA EL TÍTULO:
1. NO uses frases genéricas como "La magia de...", "Descubriendo...", "El poder de..."
2. SÍ usa títulos que generen CURIOSIDAD REAL:
   - "Por qué tu protección energética no funciona (y qué hacer)"
   - "Lo que nadie te dice sobre los cristales de cuarzo"
   - "El duende que cambió mi forma de ver la abundancia"
3. Puede ser una pregunta intrigante
4. Puede ser una afirmación que desafíe creencias
5. Máximo 10-12 palabras

Respondé SOLO con el nuevo título, sin comillas ni explicación.`;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 100,
        messages: [{ role: 'user', content: userPrompt }]
      })
    });

    if (!response.ok) {
      return Response.json({ success: false, error: `Error API: ${response.status}` }, { status: 500 });
    }

    const data = await response.json();
    const titulo = data.content?.[0]?.text?.trim() || tituloActual;

    return Response.json({
      success: true,
      titulo: titulo.replace(/^["']|["']$/g, ''), // Quitar comillas si las hay
    });

  } catch (error) {
    console.error('Error:', error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
