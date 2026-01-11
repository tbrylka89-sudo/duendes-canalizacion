export async function POST(request) {
  try {
    const { prompt, estilo } = await request.json();

    const estilos = {
      magico: 'magical forest, golden hour, mystical, soft bokeh, fantasy art, enchanted',
      watercolor: 'watercolor painting, soft edges, dreamy, artistic',
      realista: 'photorealistic, high detail, professional photography',
      natural: 'nature photography, green forest, moss, crystals, earth tones',
      duende: 'whimsical forest creature, handmade felt doll, magical, enchanted forest, soft lighting, fairy tale style'
    };

    const promptFinal = `${prompt}, ${estilos[estilo] || estilos.magico}, high quality, beautiful`;

    // OpenAI DALL-E
    const openaiKey = process.env.OPENAI_API_KEY;
    if (openaiKey) {
      try {
        const res = await fetch('https://api.openai.com/v1/images/generations', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${openaiKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model: 'dall-e-3',
            prompt: promptFinal,
            n: 1,
            size: '1024x1024',
            quality: 'standard'
          })
        });
        const data = await res.json();

        if (data.error) {
          console.error('OpenAI error:', data.error);
          return Response.json({ success: false, error: `OpenAI: ${data.error.message}` });
        }

        if (data.data?.[0]?.url) {
          return Response.json({ success: true, url: data.data[0].url });
        }
      } catch (openaiErr) {
        console.error('OpenAI fetch error:', openaiErr);
      }
    }

    // Leonardo AI fallback
    const leonardoKey = process.env.LEONARDO_API_KEY;
    if (leonardoKey) {
      try {
        const res = await fetch('https://cloud.leonardo.ai/api/rest/v1/generations', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${leonardoKey}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt: promptFinal, modelId: '6bef9f1b-29cb-40c7-b9df-32b51c1f67d3', width: 1024, height: 1024, num_images: 1 })
        });
        const data = await res.json();
        if (data.sdGenerationJob?.generationId) {
          await new Promise(r => setTimeout(r, 15000));
          const result = await fetch(`https://cloud.leonardo.ai/api/rest/v1/generations/${data.sdGenerationJob.generationId}`, {
            headers: { 'Authorization': `Bearer ${leonardoKey}` }
          });
          const r = await result.json();
          if (r.generations_by_pk?.generated_images?.[0]?.url) {
            return Response.json({ success: true, url: r.generations_by_pk.generated_images[0].url });
          }
        }
      } catch (leonardoErr) {
        console.error('Leonardo error:', leonardoErr);
      }
    }

    // Si llegamos aquí, no hay keys configuradas
    const hasOpenAI = !!process.env.OPENAI_API_KEY;
    const hasLeonardo = !!process.env.LEONARDO_API_KEY;

    if (!hasOpenAI && !hasLeonardo) {
      return Response.json({ success: false, error: 'Configurá OPENAI_API_KEY en Vercel → Settings → Environment Variables' });
    }

    return Response.json({ success: false, error: 'Error generando imagen. Revisá los logs en Vercel.' });
  } catch (error) {
    console.error('Image generation error:', error);
    return Response.json({ success: false, error: error.message });
  }
}
