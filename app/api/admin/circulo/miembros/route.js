import { kv } from '@vercel/kv';

export async function GET() {
  try {
    const keys = await kv.keys('user:*');
    const miembros = [];
    for (const k of keys) {
      const user = await kv.get(k);
      if (user?.esCirculo) {
        miembros.push({ email: user.email, nombre: user.nombre||'', tipo: user.circuloPrueba?'prueba':'pago', expira: user.circuloExpira, prueba: user.circuloPrueba||false });
      }
    }
    return Response.json({ success: true, miembros });
  } catch (error) {
    return Response.json({ success: false, miembros: [] });
  }
}
