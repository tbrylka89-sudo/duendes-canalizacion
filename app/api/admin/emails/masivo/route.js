import { kv } from '@vercel/kv';
import { Resend } from 'resend';
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request) {
  try {
    const { destinatarios, asunto, mensaje } = await request.json();
    const keys = await kv.keys('user:*');
    let enviados = 0;
    
    for (const k of keys) {
      const user = await kv.get(k);
      if (!user?.email) continue;
      
      let enviar = destinatarios === 'todos' || (destinatarios === 'circulo' && user.esCirculo) || (destinatarios === 'compradores' && user.gastado > 0);
      
      if (enviar) {
        await resend.emails.send({
          from: 'Duendes del Uruguay <hola@duendesdeluruguay.com>',
          to: user.email,
          subject: asunto.replace(/{nombre}/g, user.nombre||'amiga'),
          html: `<div style="font-family:Georgia,serif;padding:30px;">${mensaje.replace(/{nombre}/g, user.nombre||'amiga').replace(/\n/g,'<br>')}<p style="margin-top:40px;color:#888;">Con amor, Duendes del Uruguay ✦</p></div>`
        });
        enviados++;
      }
    }
    
    return Response.json({ success: true, enviados });
  } catch (error) {
    return Response.json({ success: false, error: error.message });
  }
}
