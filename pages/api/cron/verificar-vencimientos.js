// ═══════════════════════════════════════════════════════════════
// CRON: VERIFICAR VENCIMIENTOS DE MEMBRESÍA
// Archivo: pages/api/cron/verificar-vencimientos.js
// Ejecutar: Diariamente a las 10:00
// ═══════════════════════════════════════════════════════════════

import { kv } from '@vercel/kv';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  const cronKey = req.headers['authorization'] || req.query.key;
  if (cronKey !== `Bearer ${process.env.CRON_SECRET}` && cronKey !== process.env.ADMIN_SECRET) {
    return res.status(401).json({ error: 'No autorizado' });
  }

  try {
    const ahora = new Date();
    const keys = await kv.keys('elegido:*');
    
    const resultados = {
      notificados7dias: 0,
      notificados3dias: 0,
      notificados1dia: 0,
      vencidos: 0
    };

    for (const key of keys) {
      const elegido = await kv.get(key);
      
      if (!elegido?.membresia?.activa) continue;
      
      const vencimiento = new Date(elegido.membresia.fechaVencimiento);
      const diasRestantes = Math.ceil((vencimiento - ahora) / (1000 * 60 * 60 * 24));
      
      // Ya venció
      if (diasRestantes <= 0) {
        elegido.membresia.activa = false;
        await kv.set(key, elegido);
        await enviarEmailVencido(elegido);
        resultados.vencidos++;
        continue;
      }
      
      // Notificaciones preventivas
      // Verificar si ya se notificó para este período
      const notificaciones = elegido.membresia.notificaciones || {};
      
      if (diasRestantes === 7 && !notificaciones.dia7) {
        await enviarEmailRecordatorio(elegido, 7);
        elegido.membresia.notificaciones = { ...notificaciones, dia7: true };
        await kv.set(key, elegido);
        resultados.notificados7dias++;
      }
      else if (diasRestantes === 3 && !notificaciones.dia3) {
        await enviarEmailRecordatorio(elegido, 3);
        elegido.membresia.notificaciones = { ...notificaciones, dia3: true };
        await kv.set(key, elegido);
        resultados.notificados3dias++;
      }
      else if (diasRestantes === 1 && !notificaciones.dia1) {
        await enviarEmailRecordatorio(elegido, 1);
        elegido.membresia.notificaciones = { ...notificaciones, dia1: true };
        await kv.set(key, elegido);
        resultados.notificados1dia++;
      }
    }

    return res.status(200).json({
      success: true,
      fecha: ahora.toISOString(),
      resultados
    });

  } catch (error) {
    console.error('[CRON/VENCIMIENTOS] Error:', error);
    return res.status(500).json({ error: error.message });
  }
}

async function enviarEmailRecordatorio(elegido, dias) {
  const renewUrl = 'https://duendesdeluruguay.com/circulo-de-duendes.html';
  
  const mensajes = {
    7: {
      asunto: `✦ Tu membresía del Círculo vence en 7 días`,
      mensaje: `Quedan 7 días para que tu acceso al Círculo termine. No pierdas tu contenido exclusivo, tus lecturas gratis y tus descuentos especiales.`
    },
    3: {
      asunto: `⚠️ Solo 3 días para renovar tu Círculo`,
      mensaje: `En 3 días perderás acceso al contenido exclusivo, las lecturas gratis mensuales y los descuentos del Círculo. ¿Vas a dejar que eso pase?`
    },
    1: {
      asunto: `🚨 Último día: Tu Círculo vence mañana`,
      mensaje: `Mañana termina tu membresía. Hoy es tu última oportunidad de renovar sin perder ningún beneficio.`
    }
  };
  
  const config = mensajes[dias];
  
  try {
    await resend.emails.send({
      from: 'Duendes del Uruguay <magia@duendesdeluruguay.com>',
      to: elegido.email,
      subject: config.asunto,
      html: `
        <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; color: #f5f5f5; padding: 40px;">
          <h1 style="color: #d4af37; font-size: 24px; text-align: center;">
            ${dias === 1 ? '🚨' : dias === 3 ? '⚠️' : '✦'} Tu Círculo te necesita
          </h1>
          
          <p style="font-size: 18px; line-height: 1.8;">
            ${elegido.nombre},
          </p>
          
          <p style="font-size: 16px; line-height: 1.8;">
            ${config.mensaje}
          </p>
          
          <div style="background: #1a1a1a; border: 1px solid ${dias === 1 ? '#f87171' : '#d4af37'}; border-radius: 10px; padding: 25px; margin: 30px 0;">
            <h3 style="color: #d4af37; margin-top: 0;">Lo que perderías:</h3>
            <ul style="list-style: none; padding: 0; line-height: 2;">
              <li>❌ Contenido semanal exclusivo</li>
              <li>❌ Lecturas gratis cada mes</li>
              <li>❌ Acceso anticipado a nuevos guardianes</li>
              <li>❌ Descuentos permanentes</li>
              <li>❌ Runas y tréboles mensuales</li>
            </ul>
          </div>
          
          <div style="text-align: center; margin: 40px 0;">
            <a href="${renewUrl}" style="display: inline-block; background: #d4af37; color: #0a0a0a; padding: 18px 40px; text-decoration: none; font-weight: bold; border-radius: 50px; font-size: 16px;">
              Renovar Ahora ✦
            </a>
          </div>
          
          <p style="font-size: 16px; line-height: 1.8;">
            Tu clan de guardianes espera que sigas siendo parte del Círculo.<br><br>
            <strong style="color: #d4af37;">Gabriel, Thibisay y el equipo</strong>
          </p>
        </div>
      `
    });
    console.log(`[EMAIL] Recordatorio ${dias} días enviado a ${elegido.email}`);
  } catch (error) {
    console.error(`Error enviando recordatorio a ${elegido.email}:`, error);
  }
}

async function enviarEmailVencido(elegido) {
  const renewUrl = 'https://duendesdeluruguay.com/circulo-de-duendes.html';
  
  try {
    await resend.emails.send({
      from: 'Duendes del Uruguay <magia@duendesdeluruguay.com>',
      to: elegido.email,
      subject: `💔 Tu membresía del Círculo ha terminado`,
      html: `
        <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; color: #f5f5f5; padding: 40px;">
          <h1 style="color: #888; font-size: 24px; text-align: center;">
            Tu tiempo en el Círculo terminó
          </h1>
          
          <p style="font-size: 18px; line-height: 1.8;">
            ${elegido.nombre},
          </p>
          
          <p style="font-size: 16px; line-height: 1.8;">
            Tu membresía del Círculo de Duendes ha vencido. Ya no tenés acceso al contenido exclusivo, las lecturas gratis ni los descuentos especiales.
          </p>
          
          <p style="font-size: 16px; line-height: 1.8;">
            Pero la puerta sigue abierta. Si querés volver, tu lugar te espera.
          </p>
          
          <div style="text-align: center; margin: 40px 0;">
            <a href="${renewUrl}" style="display: inline-block; background: #d4af37; color: #0a0a0a; padding: 18px 40px; text-decoration: none; font-weight: bold; border-radius: 50px; font-size: 16px;">
              Volver al Círculo ✦
            </a>
          </div>
          
          <p style="font-size: 14px; color: #666; text-align: center;">
            Tu portal Mi Magia sigue activo con tus guardianes y lecturas anteriores.<br>
            Solo el contenido exclusivo del Círculo queda bloqueado.
          </p>
        </div>
      `
    });
    console.log(`[EMAIL] Vencimiento enviado a ${elegido.email}`);
  } catch (error) {
    console.error(`Error enviando vencimiento a ${elegido.email}:`, error);
  }
}
