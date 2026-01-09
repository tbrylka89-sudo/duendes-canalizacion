import { kv } from '@vercel/kv';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q')?.toLowerCase() || '';
    if (!q) return Response.json({ success: false, clientes: [] });
    
    const keys = await kv.keys('user:*');
    const clientes = [];
    for (const k of keys) {
      const user = await kv.get(k);
      if (user && (user.email?.toLowerCase().includes(q) || user.nombre?.toLowerCase().includes(q))) {
        clientes.push(user);
      }
    }
    return Response.json({ success: true, clientes });
  } catch (error) {
    return Response.json({ success: false, clientes: [] });
  }
}
