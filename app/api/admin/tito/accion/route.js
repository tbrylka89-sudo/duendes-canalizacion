import { kv } from '@vercel/kv';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

async function enviarEmail(to, subject, html) {
  try {
    await resend.emails.send({
      from: 'Duendes del Uruguay <hola@duendesdeluruguay.com>',
      to, subject,
      html: `<div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;padding:30px;background:#FFFEF9;">${html}<p style="margin-top:40px;color:#888;">Con amor, Duendes del Uruguay ✦</p></div>`
    });
    return true;
  } catch(e) { return false; }
}

export async function POST(request) {
  try {
    const { accion } = await request.json();
    if (!accion?.accion) return Response.json({ success: false, resultado: 'Sin acción' });

    const { accion: tipo, datos } = accion;
    let resultado = '';

    switch(tipo) {
      case 'buscar_cliente': {
        const keys = await kv.keys('user:*');
        for (const k of keys) {
          const u = await kv.get(k);
          if (u && (u.email?.toLowerCase().includes(datos.query.toLowerCase()) || u.nombre?.toLowerCase().includes(datos.query.toLowerCase()))) {
            resultado = `📋 ${u.nombre || 'Sin nombre'} (${u.email})\n• Runas: ${u.runas||0}\n• Tréboles: ${u.treboles||0}\n• Círculo: ${u.esCirculo?'Sí':'No'}\n• Link: https://duendes-vercel.vercel.app/mi-magia?token=${u.token}`;
            break;
          }
        }
        if (!resultado) resultado = `❌ No encontré "${datos.query}"`;
        break;
      }

      case 'dar_acceso': {
        const existe = await kv.get(`user:${datos.email}`);
        if (existe) { resultado = `Ya tiene cuenta. Link: https://duendes-vercel.vercel.app/mi-magia?token=${existe.token}`; break; }
        const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
        let token = ''; for (let i = 0; i < 12; i++) token += chars.charAt(Math.floor(Math.random() * chars.length));
        await kv.set(`user:${datos.email}`, { email: datos.email, nombre: datos.nombre||'', token, runas: 100, treboles: 0, guardianes: [], lecturas: [], creado: new Date().toISOString() });
        await enviarEmail(datos.email, '✨ Tu acceso a Mi Magia', `<h1 style="color:#d4af37;">¡Bienvenida!</h1><p><a href="https://duendes-vercel.vercel.app/mi-magia?token=${token}" style="background:#d4af37;color:#1a1a1a;padding:15px 30px;border-radius:50px;text-decoration:none;display:inline-block;">Entrar a Mi Magia</a></p><p>🎁 100 Runas de regalo</p>`);
        resultado = `✅ Cuenta creada. Link: https://duendes-vercel.vercel.app/mi-magia?token=${token}`;
        break;
      }

      case 'dar_circulo': {
        const user = await kv.get(`user:${datos.email}`);
        if (!user) { resultado = `❌ No encontré a ${datos.email}`; break; }
        const expira = new Date(); expira.setDate(expira.getDate() + (datos.dias||15));
        user.esCirculo = true; user.circuloExpira = expira.toLocaleDateString('es-UY'); user.runas = (user.runas||0) + 100;
        await kv.set(`user:${datos.email}`, user);
        await enviarEmail(datos.email, '★ Bienvenida al Círculo', `<h1 style="color:#d4af37;">¡Felicitaciones!</h1><p>${datos.dias} días de Círculo + 100 Runas</p>`);
        resultado = `✅ ${datos.dias} días de Círculo para ${user.nombre||datos.email}`;
        break;
      }

      case 'regalar_runas': {
        const user = await kv.get(`user:${datos.email}`);
        if (!user) { resultado = `❌ No encontré a ${datos.email}`; break; }
        user.runas = (user.runas||0) + datos.cantidad;
        await kv.set(`user:${datos.email}`, user);
        await enviarEmail(datos.email, '🎁 Runas de regalo', `<h1 style="color:#d4af37;">¡Sorpresa!</h1><p>${datos.cantidad} Runas de Poder</p>${datos.mensaje?`<p>"${datos.mensaje}"</p>`:''}`);
        resultado = `✅ ${datos.cantidad} runas para ${user.nombre||datos.email}`;
        break;
      }

      case 'regalar_treboles': {
        const user = await kv.get(`user:${datos.email}`);
        if (!user) { resultado = `❌ No encontré a ${datos.email}`; break; }
        user.treboles = (user.treboles||0) + datos.cantidad;
        await kv.set(`user:${datos.email}`, user);
        await enviarEmail(datos.email, '☘ Tréboles de regalo', `<h1 style="color:#d4af37;">¡Sorpresa!</h1><p>${datos.cantidad} Tréboles</p>`);
        resultado = `✅ ${datos.cantidad} tréboles para ${user.nombre||datos.email}`;
        break;
      }

      case 'enviar_email': {
        await enviarEmail(datos.email, datos.asunto, `<p>${datos.mensaje.replace(/\n/g,'<br>')}</p>`);
        resultado = `✅ Email enviado a ${datos.email}`;
        break;
      }

      case 'crear_cupon': {
        await kv.set(`cupon:${datos.codigo}`, { codigo: datos.codigo, descuento: datos.descuento, creado: new Date().toISOString() });
        resultado = `✅ Cupón ${datos.codigo}: ${datos.descuento}% descuento`;
        break;
      }

      case 'crear_anticipado': {
        const id = `ant_${Date.now()}`;
        const expira = new Date(); expira.setHours(expira.getHours() + (datos.horas||48));
        await kv.set(`anticipado:${id}`, { id, nombre: datos.nombre, precio: datos.precio, imagen: datos.imagen, expira: expira.toISOString() });
        const keys = await kv.keys('user:*');
        let n = 0;
        for (const k of keys) {
          const u = await kv.get(k);
          if (u?.esCirculo) { await enviarEmail(u.email, `🚀 Anticipado: ${datos.nombre}`, `<h1>${datos.nombre}</h1><p>$${datos.precio} - ${datos.horas}hs de acceso exclusivo</p>`); n++; }
        }
        resultado = `✅ Anticipado "${datos.nombre}" - Notifiqué a ${n} del Círculo`;
        break;
      }

      default: resultado = `❓ No conozco "${tipo}"`;
    }

    return Response.json({ success: true, resultado });
  } catch (error) {
    return Response.json({ success: false, resultado: 'Error: ' + error.message });
  }
}
