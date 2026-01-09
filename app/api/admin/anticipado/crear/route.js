import { kv } from '@vercel/kv';
import { Resend } from 'resend';
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request) {
  try {
    const { idWoo, nombre, precio, imagen, descripcion, duracion } = await request.json();
    const id = `ant_${Date.now()}`;
    const expira = new Date(); expira.setHours(expira.getHours() + parseInt(duracion||48));
    
    await kv.set(`anticipado:${id}`, { id, idWoo, nombre, precio, imagen, descripcion, duracion: parseInt(duracion||48), expira: expira.toISOString(), activo: true });
    
    const keys = await kv.keys('user:*');
    let enviados = 0;
    for (const k of keys) {
      const user = await kv.get(k);
      if (user?.esCirculo && user.email) {
        await resend.emails.send({
          from: 'Duendes del Uruguay <hola@duendesdeluruguay.com>',
          to: user.email,
          subject: `🚀 Anticipado: ${nombre}`,
          html: `<div style="font-family:Georgia,serif;padding:30px;"><h1 style="color:#d4af37;">Acceso Exclusivo</h1><h2>${nombre}</h2>${imagen?`<img src="${imagen}" style="max-width:100%;border-radius:12px;">`:''}<p style="font-size:24px;color:#d4af37;">$${precio}</p><p>${descripcion||''}</p><p><a href="https://duendesuy.10web.cloud/shop/" style="background:#d4af37;color:#1a1a1a;padding:15px 30px;border-radius:50px;text-decoration:none;display:inline-block;">Ver</a></p></div>`
        });
        enviados++;
      }
    }
    
    return Response.json({ success: true, enviados });
  } catch (error) {
    return Response.json({ success: false, error: error.message });
  }
}
