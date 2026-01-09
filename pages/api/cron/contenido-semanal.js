// ═══════════════════════════════════════════════════════════════
// CRON: GENERAR CONTENIDO SEMANAL AUTOMÁTICO
// Archivo: pages/api/cron/contenido-semanal.js
// Ejecutar: Lunes a las 06:00
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
    // Calcular semana actual
    const ahora = new Date();
    const año = ahora.getFullYear();
    const inicioAño = new Date(año, 0, 1);
    const dias = Math.floor((ahora - inicioAño) / (24 * 60 * 60 * 1000));
    const semana = Math.ceil((dias + inicioAño.getDay() + 1) / 7);
    const semanaId = `${año}-${String(semana).padStart(2, '0')}`;

    // Verificar si ya existe contenido para esta semana
    const contenidoExistente = await kv.get(`contenido-circulo:${semanaId}`);
    
    if (contenidoExistente) {
      return res.status(200).json({
        success: true,
        mensaje: 'Ya existe contenido para esta semana',
        semana: semanaId,
        estado: contenidoExistente.estado
      });
    }

    // Llamar al endpoint de generación
    const baseUrl = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}` 
      : 'http://localhost:3000';
    
    const response = await fetch(`${baseUrl}/api/admin/contenido/generar`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-key': process.env.ADMIN_SECRET
      },
      body: JSON.stringify({ semana: semanaId })
    });

    const resultado = await response.json();

    if (!response.ok) {
      throw new Error(resultado.error || 'Error generando contenido');
    }

    // Notificar a admin que hay contenido nuevo para revisar
    await notificarAdmin(semanaId, resultado.tematica);

    return res.status(200).json({
      success: true,
      semana: semanaId,
      tematica: resultado.tematica,
      mensaje: 'Contenido generado como borrador. Revisar y publicar manualmente.'
    });

  } catch (error) {
    console.error('[CRON/CONTENIDO] Error:', error);
    return res.status(500).json({ error: error.message });
  }
}

async function notificarAdmin(semana, tematica) {
  const adminEmail = process.env.ADMIN_EMAIL || 'thib@duendesdeluruguay.com';
  const adminUrl = `https://duendes-vercel.vercel.app/admin/circulo?key=${process.env.ADMIN_SECRET}`;
  
  const tematicasNombres = {
    'cosmos': '🌙 Cosmos del Mes',
    'duendes': '🧝 Mundo Duende',
    'diy': '✂️ Hacelo Vos Misma',
    'esoterico': '🔮 Esotérico Práctico'
  };
  
  try {
    await resend.emails.send({
      from: 'Sistema Duendes <sistema@duendesdeluruguay.com>',
      to: adminEmail,
      subject: `📝 Contenido semanal generado - ${semana}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; background: #f5f5f5;">
          <h2 style="color: #333;">Nuevo contenido para revisar</h2>
          
          <div style="background: white; padding: 20px; border-radius: 10px; margin: 20px 0;">
            <p><strong>Semana:</strong> ${semana}</p>
            <p><strong>Temática:</strong> ${tematicasNombres[tematica] || tematica}</p>
            <p><strong>Estado:</strong> BORRADOR</p>
          </div>
          
          <p>El contenido fue generado automáticamente y está esperando tu revisión.</p>
          
          <p>Podés:</p>
          <ul>
            <li>Revisar el contenido</li>
            <li>Mejorar secciones específicas</li>
            <li>Regenerar lo que no te guste</li>
            <li>Publicar cuando esté listo</li>
          </ul>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${adminUrl}" style="display: inline-block; background: #d4af37; color: #000; padding: 15px 30px; text-decoration: none; font-weight: bold; border-radius: 25px;">
              Revisar Contenido
            </a>
          </div>
        </div>
      `
    });
  } catch (error) {
    console.error('Error notificando admin:', error);
  }
}
