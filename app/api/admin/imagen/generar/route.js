export async function POST(request) {
  try {
    const { prompt, estilo } = await request.json();
    
    const estilos = {
      magico: 'magical forest, golden hour, mystical, soft bokeh',
      watercolor: 'watercolor painting, soft edges, dreamy',
      realista: 'photorealistic, high detail',
      natural: 'nature photography, green forest, moss, crystals'
    };
    
    const promptFinal = `${prompt}, ${estilos[estilo]||estilos.magico}, high quality`;
    
    // OpenAI DALL-E
    if (process.env.OPENAI_API_KEY) {
      const res = await fetch('https://api.openai.com/v1/images/generations', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: 'dall-e-3', prompt: promptFinal, n: 1, size: '1024x1024' })
      });
      const data = await res.json();
      if (data.data?.[0]?.url) return Response.json({ success: true, url: data.data[0].url });
    }
    
    // Leonardo AI
    if (process.env.LEONARDO_API_KEY) {
      const res = await fetch('https://cloud.leonardo.ai/api/rest/v1/generations', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${process.env.LEONARDO_API_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: promptFinal, modelId: '6bef9f1b-29cb-40c7-b9df-32b51c1f67d3', width: 1024, height: 1024, num_images: 1 })
      });
      const data = await res.json();
      if (data.sdGenerationJob?.generationId) {
        await new Promise(r => setTimeout(r, 15000));
        const result = await fetch(`https://cloud.leonardo.ai/api/rest/v1/generations/${data.sdGenerationJob.generationId}`, {
          headers: { 'Authorization': `Bearer ${process.env.LEONARDO_API_KEY}` }
        });
        const r = await result.json();
        if (r.generations_by_pk?.generated_images?.[0]?.url) return Response.json({ success: true, url: r.generations_by_pk.generated_images[0].url });
      }
    }
    
    return Response.json({ success: false, error: 'Configurá OPENAI_API_KEY o LEONARDO_API_KEY en Vercel' });
  } catch (error) {
    return Response.json({ success: false, error: error.message });
  }
}
