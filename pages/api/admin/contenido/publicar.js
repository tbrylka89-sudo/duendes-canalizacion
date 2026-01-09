// ═══════════════════════════════════════════════════════════════
// ADMIN: PUBLICAR CONTENIDO SEMANAL
// Archivo: pages/api/admin/contenido/publicar.js
// ═══════════════════════════════════════════════════════════════

import { kv } from '@vercel/kv';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const adminKey = req.headers['x-admin-key'] || req.body?.adminKey;
  if (adminKey !== process.env.ADMIN_SECRET) {
    return res.status(401).json({ error: 'No autorizado' });
  }

  try {
    const { semana, notificar } = req.body;
    
    if (!semana) {
      return res.status(400).json({ error: 'Semana requerida' });
    }

    // Obtener contenido
    const contenido = await kv.get(`contenido-circulo:${semana}`);
    if (!contenido) {
      return res.status(404).json({ error: 'No existe contenido para esta semana' });
    }

    if (contenido.estado === 'publicado') {
      return res.status(400).json({ error: 'El contenido ya está publicado' });
    }

    // Publicar
    contenido.estado = 'publicado';
    contenido.fechaPublicacion = new Date().toISOString();
    
    await kv.set(`contenido-circulo:${semana}`, contenido);

    // Notificar a miembros si se solicita
    let notificados = 0;
    if (notificar) {
      notificados = await notificarMiembros(contenido);
    }

    return res.status(200).json({
      success: true,
      semana,
      estado: 'publicado',
      fechaPublicacion: contenido.fechaPublicacion,
      miembrosNotificados: notificados
    });

  } catch (error) {
    console.error('[ADMIN/PUBLICAR] Error:', error);
    return res.status(500).json({ error: error.message });
  }
}

async function notificarMiembros(contenido) {
  try {
    // Obtener todos los elegidos
    const keys = await kv.keys('elegido:*');
    let notificados = 0;
    
    const tematicasNombres = {
      'cosmos': '🌙 Cosmos del Mes',
      'duendes': '🧝 Mundo Duende',
      'diy': '✂️ Hacelo Vos Misma',
      'esoterico': '🔮 Esotérico Práctico'
    };
    
    for (const key of keys) {
      const elegido = await kv.get(key);
      
      // Solo notificar a miembros del Círculo activos
      if (!elegido?.membresia?.activa) continue;
      
      // Verificar que no haya vencido
      if (new Date(elegido.membresia.fechaVencimiento) < new Date()) continue;
      
      const portalUrl = `https://duendes-vercel.vercel.app/mi-magia?token=${elegido.token}`;
      
      try {
        await resend.emails.send({
          from: 'Duendes del Uruguay <magia@duendesdeluruguay.com>',
          to: elegido.email,
          subject: `✦ Nuevo contenido del Círculo: ${contenido.titulo}`,
          html: `
            <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; color: #f5f5f5; padding: 40px;">
              <div style="text-align: center; margin-bottom: 30px;">
                <span style="background: linear-gradient(135deg, #d4af37, #f4d03f); -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-size: 14px; letter-spacing: 3px;">CÍRCULO DE DUENDES</span>
              </div>
              
              <h1 style="color: #d4af37; font-size: 24px; text-align: center; margin-bottom: 10px;">
                ${tematicasNombres[contenido.tematica] || contenido.tematica}
              </h1>
              
              <h2 style="color: #f5f5f5; font-size: 20px; text-align: center; font-weight: normal; margin-bottom: 30px;">
                ${contenido.titulo}
              </h2>
              
              <p style="font-size: 16px; line-height: 1.8; color: #ccc;">
                ${elegido.nombre}, tu contenido exclusivo de esta semana ya está disponible en tu portal.
              </p>
              
              <div style="background: #1a1a1a; border-left: 3px solid #d4af37; padding: 20px; margin: 30px 0;">
                <p style="margin: 0; font-style: italic; color: #d4af37;">
                  "${contenido.subtitulo || 'Contenido exclusivo para miembros del Círculo'}"
                </p>
              </div>
              
              <div style="text-align: center; margin: 40px 0;">
                <a href="${portalUrl}" style="display: inline-block; background: #d4af37; color: #0a0a0a; padding: 18px 40px; text-decoration: none; font-weight: bold; border-radius: 50px; font-size: 16px;">
                  Ver Contenido ✦
                </a>
              </div>
              
              <p style="font-size: 14px; color: #666; text-align: center;">
                Este contenido es exclusivo para miembros del Círculo.
              </p>
            </div>
          `
        });
        notificados++;
      } catch (emailError) {
        console.error(`Error enviando a ${elegido.email}:`, emailError);
      }
    }
    
    return notificados;
  } catch (error) {
    console.error('Error notificando miembros:', error);
    return 0;
  }
}
