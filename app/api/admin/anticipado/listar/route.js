import { kv } from '@vercel/kv';

export async function GET() {
  try {
    const keys = await kv.keys('anticipado:*');
    const anticipados = [];
    const ahora = new Date();
    
    for (const k of keys) {
      const ant = await kv.get(k);
      if (ant && new Date(ant.expira) > ahora) {
        const h = Math.ceil((new Date(ant.expira) - ahora) / (1000*60*60));
        anticipados.push({ ...ant, tiempoRestante: `${h}h` });
      }
    }
    return Response.json({ success: true, anticipados });
  } catch (error) {
    return Response.json({ success: false, anticipados: [] });
  }
}
