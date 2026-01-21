// /pages/api/admin/comunicacion/enviar.js
import { kv } from '@vercel/kv';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const adminKey = req.headers['x-admin-key'];
  if (adminKey !== process.env.ADMIN_SECRET) {
    return res.status(401).json({ error: 'No autorizado' });
  }

  try {
    const { destinatario, emailEspecifico, asunto, mensaje } = req.body;
    
    if (!asunto || !mensaje) {
      return res.status(400).json({ error: 'Falta asunto o mensaje' });
    }

    let destinatarios = [];
    const ahora = new Date();

    if (destinatario === 'especifico' && emailEspecifico) {
      // Email específico
      const usuario = await kv.get(`elegido:${emailEspecifico.toLowerCase()}`);
      if (usuario) {
        destinatarios.push({ email: emailEspecifico, nombre: usuario.nombre });
      }
    } else {
      // Obtener miembros según filtro
      const keys = await kv.keys('membresia:*');
      
      for (const key of keys) {
        const mem = await kv.get(key);
        if (!mem) continue;
        
        const venc = new Date(mem.fechaVencimiento);
        const diasRestantes = Math.ceil((venc - ahora) / (1000 * 60 * 60 * 24));
        
        let incluir = false;
        
        switch (destinatario) {
          case 'todos':
            incluir = true;
            break;
          case 'activos':
            incluir = diasRestantes > 0;
            break;
          case 'por-vencer':
            incluir = diasRestantes > 0 && diasRestantes <= 7;
            break;
        }
        
        if (incluir) {
          const usuario = await kv.get(`elegido:${mem.email}`);
          destinatarios.push({
            email: mem.email,
            nombre: usuario?.nombre || 'Amiga'
          });
        }
      }
    }

    if (destinatarios.length === 0) {
      return res.status(400).json({ error: 'No hay destinatarios' });
    }

    // Enviar emails
    let enviados = 0;
    let errores = 0;

    for (const dest of destinatarios) {
      try {
        // Personalizar mensaje
        const mensajePersonalizado = mensaje
          .replace(/{nombre}/g, dest.nombre)
          .replace(/{email}/g, dest.email);

        await resend.emails.send({
          from: 'Duendes del Uruguay <magia@duendesdeluruguay.com>',
          to: dest.email,
          subject: asunto,
          html: `
            <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <div style="text-align: center; margin-bottom: 30px;">
                <span style="font-size: 40px;">✦</span>
              </div>
              <div style="white-space: pre-wrap; line-height: 1.8; color: #333;">
${mensajePersonalizado}
              </div>
              <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee;">
                <p style="color: #888; font-size: 12px;">
                  Duendes del Uruguay - Piriápolis, Uruguay<br>
                  <a href="https://duendesdeluruguay.com" style="color: #d4af37;">duendesdeluruguay.com</a>
                </p>
              </div>
            </div>
          `
        });
        enviados++;
      } catch (e) {
        console.error(`Error enviando a ${dest.email}:`, e);
        errores++;
      }
    }

    // Log
    await kv.lpush('admin:logs', JSON.stringify({
      tipo: 'email-masivo',
      asunto,
      destinatario,
      enviados,
      errores,
      fecha: new Date().toISOString()
    }));

    return res.status(200).json({ 
      success: true, 
      enviados, 
      errores,
      total: destinatarios.length 
    });
  } catch (error) {
    console.error('[COMUNICACION] Error:', error);
    return res.status(500).json({ error: error.message });
  }
}
