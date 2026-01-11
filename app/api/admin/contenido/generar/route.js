export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export async function POST(request) {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  // Test mode - returns immediately
  const url = new URL(request.url);
  if (url.searchParams.get('test') === '1') {
    return Response.json({ success: true, test: true, hasApiKey: !!apiKey });
  }

  if (!apiKey) {
    return Response.json({ success: false, error: 'API key no configurada' }, { status: 500 });
  }

  try {
    const body = await request.json();
    const { tema, palabras = 1500, categoria = 'general', tipo = 'articulo', instruccionesExtra = '' } = body;

    if (!tema) {
      return Response.json({ success: false, error: 'Tema requerido' }, { status: 400 });
    }

    const systemPrompt = `Sos Thibisay, escritora de Duendes del Uruguay.
Escribís en español rioplatense (vos, tenés, podés).
Creá contenido mágico y espiritual con un tono cálido e íntimo.
Usá markdown para formato (# títulos, **negrita**, etc).`;

    const userPrompt = `Escribí un ${tipo} sobre: "${tema}"
Categoría: ${categoria}
Extensión: aproximadamente ${palabras} palabras
${instruccionesExtra ? `Instrucciones extra: ${instruccionesExtra}` : ''}

Incluí:
- Un título atractivo con #
- Introducción emotiva
- Desarrollo con subtítulos ##
- Cierre inspirador`;

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
        system: systemPrompt,
        messages: [{ role: 'user', content: userPrompt }]
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Anthropic error:', response.status, errorData);
      return Response.json({
        success: false,
        error: `Error API: ${response.status}`
      }, { status: 500 });
    }

    const data = await response.json();
    const contenido = data.content?.[0]?.text || '';

    // Extraer título
    const tituloMatch = contenido.match(/^#\s+(.+)$/m);
    const titulo = tituloMatch ? tituloMatch[1].trim() : tema;

    return Response.json({
      success: true,
      contenido,
      titulo,
      palabras: contenido.split(/\s+/).length,
      categoria,
      tipo
    });

  } catch (error) {
    console.error('Error:', error);
    return Response.json({
      success: false,
      error: error.message || 'Error desconocido'
    }, { status: 500 });
  }
}
