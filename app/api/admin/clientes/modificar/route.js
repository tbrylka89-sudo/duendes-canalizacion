import { kv } from '@vercel/kv';

export async function POST(request) {
  try {
    const { email, campo, valor } = await request.json();
    const user = await kv.get(`user:${email}`);
    if (!user) return Response.json({ success: false, error: 'No encontrado' });
    user[campo] = valor;
    await kv.set(`user:${email}`, user);
    return Response.json({ success: true, cliente: user });
  } catch (error) {
    return Response.json({ success: false, error: error.message });
  }
}
