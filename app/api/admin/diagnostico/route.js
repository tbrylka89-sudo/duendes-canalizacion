// Endpoint de diagnóstico para verificar APIs
export const dynamic = 'force-dynamic';

export async function GET(request) {
  const url = new URL(request.url);
  const test = url.searchParams.get('test');

  const resultado = {
    timestamp: new Date().toISOString(),
    elevenlabs: { configurado: false, voces: [] },
    openai: { configurado: false, error: null }
  };

  // ═══ TEST ELEVENLABS ═══
  const elevenLabsKey = process.env.ELEVENLABS_API_KEY;
  if (elevenLabsKey) {
    resultado.elevenlabs.configurado = true;
    try {
      // Listar TODAS las voces disponibles en la cuenta
      const res = await fetch('https://api.elevenlabs.io/v1/voices', {
        headers: { 'xi-api-key': elevenLabsKey }
      });

      if (res.ok) {
        const data = await res.json();
        resultado.elevenlabs.total = data.voices?.length || 0;
        resultado.elevenlabs.voces = (data.voices || []).map(v => ({
          id: v.voice_id,
          nombre: v.name,
          categoria: v.category,
          labels: v.labels
        }));

        // Buscar voces específicas
        const vocesEspanol = resultado.elevenlabs.voces.filter(v =>
          v.nombre.toLowerCase().includes('agust') ||
          v.nombre.toLowerCase().includes('malena') ||
          v.labels?.accent?.toLowerCase().includes('argentin') ||
          v.labels?.language?.toLowerCase().includes('spanish')
        );
        resultado.elevenlabs.vocesEspanol = vocesEspanol;
      } else {
        resultado.elevenlabs.error = `HTTP ${res.status}: ${await res.text()}`;
      }
    } catch (e) {
      resultado.elevenlabs.error = e.message;
    }
  }

  // ═══ TEST OPENAI ═══
  const openaiKey = process.env.OPENAI_API_KEY;
  if (openaiKey) {
    resultado.openai.configurado = true;
    resultado.openai.keyPreview = openaiKey.substring(0, 8) + '...' + openaiKey.substring(openaiKey.length - 4);

    if (test === 'openai') {
      try {
        // Test simple: listar modelos
        const res = await fetch('https://api.openai.com/v1/models', {
          headers: { 'Authorization': `Bearer ${openaiKey}` }
        });

        if (res.ok) {
          const data = await res.json();
          resultado.openai.funcionando = true;
          resultado.openai.modelosDisponibles = data.data?.filter(m =>
            m.id.includes('dall-e') || m.id.includes('gpt')
          ).map(m => m.id).slice(0, 10);
        } else {
          const errorData = await res.json();
          resultado.openai.funcionando = false;
          resultado.openai.error = errorData.error?.message || `HTTP ${res.status}`;
          resultado.openai.errorCode = errorData.error?.code;
        }
      } catch (e) {
        resultado.openai.error = e.message;
      }
    }
  }

  // ═══ RESUMEN ═══
  resultado.resumen = {
    elevenLabsFuncionando: resultado.elevenlabs.configurado && resultado.elevenlabs.total > 0,
    openaiConfigurado: resultado.openai.configurado,
    totalVocesElevenLabs: resultado.elevenlabs.total || 0,
    vocesEspanolEncontradas: resultado.elevenlabs.vocesEspanol?.length || 0
  };

  return Response.json(resultado);
}
