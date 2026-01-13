import { kv } from '@vercel/kv';
import { Resend } from 'resend';
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request) {
  try {
    const { email, nombre } = await request.json();
    if (!email) return Response.json({ success: false, error: 'Email requerido' });
    
    const existe = await kv.get(`user:${email}`);
    if (existe) return Response.json({ success: false, error: 'Ya existe', cliente: existe });
    
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
    let token = ''; for (let i = 0; i < 12; i++) token += chars.charAt(Math.floor(Math.random() * chars.length));
    const cliente = { email, nombre: nombre||'', token, runas: 50, treboles: 0, guardianes: [], lecturas: [], creado: new Date().toISOString() };
    await kv.set(`user:${email}`, cliente);
    
    await resend.emails.send({
      from: 'Duendes del Uruguay <hola@duendesdeluruguay.com>',
      to: email,
      subject: '✨ Tu acceso a Mi Magia',
      html: `<div style="font-family:Georgia,serif;padding:30px;"><h1 style="color:#d4af37;">¡Bienvenida!</h1><p><a href="https://duendes-vercel.vercel.app/mi-magia?token=${token}" style="background:#d4af37;color:#1a1a1a;padding:15px 30px;border-radius:50px;text-decoration:none;display:inline-block;">Entrar</a></p></div>`
    });
    
    return Response.json({ success: true, cliente });
  } catch (error) {
    return Response.json({ success: false, error: error.message });
  }
}
