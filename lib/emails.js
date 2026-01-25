// ═══════════════════════════════════════════════════════════════════════════════
// SISTEMA DE EMAILS - Duendes del Uruguay
// Envío de notificaciones por email usando Gmail SMTP (con fallback a Resend)
// ═══════════════════════════════════════════════════════════════════════════════

import nodemailer from 'nodemailer';

const GMAIL_USER = process.env.GMAIL_USER;
const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD;
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = `Duendes del Uruguay <${GMAIL_USER || 'info@duendesdeluruguay.com'}>`;
const REPLY_TO = 'info@duendesdeluruguay.com';

// Crear transporter de Gmail (se crea una vez y se reutiliza)
let gmailTransporter = null;

function getGmailTransporter() {
  if (!gmailTransporter && GMAIL_USER && GMAIL_APP_PASSWORD) {
    gmailTransporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: GMAIL_USER,
        pass: GMAIL_APP_PASSWORD
      }
    });
  }
  return gmailTransporter;
}

// ═══════════════════════════════════════════════════════════════
// PLANTILLAS DE EMAIL
// ═══════════════════════════════════════════════════════════════

const plantillaBase = (contenido, titulo) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${titulo}</title>
</head>
<body style="margin:0;padding:0;background-color:#1a1a2e;font-family:system-ui,-apple-system,sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:40px 20px;">
    <!-- Header -->
    <div style="text-align:center;margin-bottom:30px;">
      <h1 style="color:#d4af37;font-size:28px;margin:0;">✦ Duendes del Uruguay ✦</h1>
    </div>

    <!-- Contenido -->
    <div style="background:linear-gradient(180deg,#252544 0%,#1f1f3d 100%);border-radius:20px;padding:40px 30px;border:1px solid rgba(212,175,55,0.2);">
      ${contenido}
    </div>

    <!-- Footer -->
    <div style="text-align:center;margin-top:30px;color:#666;font-size:12px;">
      <p>Este mensaje fue enviado desde Duendes del Uruguay</p>
      <p><a href="https://duendesdeluruguay.com/mi-magia" style="color:#d4af37;">Ir a Mi Magia</a></p>
      <p style="margin-top:20px;color:#444;">
        Si no querés recibir más emails, podés configurarlo en tu perfil.
      </p>
    </div>
  </div>
</body>
</html>
`;

// ═══════════════════════════════════════════════════════════════
// EMAIL: SUBIDA DE NIVEL
// ═══════════════════════════════════════════════════════════════

export function emailSubidaNivel(nombre, nivelAnterior, nivelNuevo, beneficios) {
  const contenido = `
    <div style="text-align:center;">
      <div style="font-size:64px;margin-bottom:20px;">🎉</div>
      <h2 style="color:#fff;font-size:24px;margin:0 0 10px 0;">
        ¡Felicitaciones, ${nombre}!
      </h2>
      <p style="color:#d4af37;font-size:18px;margin:0 0 30px 0;">
        Subiste de nivel
      </p>
    </div>

    <div style="background:rgba(0,0,0,0.3);border-radius:12px;padding:20px;margin-bottom:24px;">
      <div style="display:flex;justify-content:center;align-items:center;gap:20px;">
        <div style="text-align:center;">
          <span style="color:#666;font-size:12px;display:block;">Antes</span>
          <span style="color:#888;font-size:20px;">${nivelAnterior}</span>
        </div>
        <div style="color:#d4af37;font-size:24px;">→</div>
        <div style="text-align:center;">
          <span style="color:#d4af37;font-size:12px;display:block;">Ahora</span>
          <span style="color:#d4af37;font-size:24px;font-weight:bold;">${nivelNuevo}</span>
        </div>
      </div>
    </div>

    ${beneficios ? `
    <div style="margin-bottom:24px;">
      <h3 style="color:#fff;font-size:16px;margin:0 0 12px 0;">Nuevos beneficios desbloqueados:</h3>
      <ul style="color:#ccc;margin:0;padding-left:20px;line-height:1.8;">
        ${beneficios.map(b => `<li>${b}</li>`).join('')}
      </ul>
    </div>
    ` : ''}

    <div style="text-align:center;margin-top:30px;">
      <a href="https://duendesdeluruguay.com/mi-magia"
         style="display:inline-block;padding:14px 32px;background:linear-gradient(135deg,#d4af37,#b8962e);color:#1a1a2e;text-decoration:none;border-radius:12px;font-weight:600;">
        Ver mi progreso
      </a>
    </div>
  `;

  return plantillaBase(contenido, `¡Subiste a ${nivelNuevo}!`);
}

// ═══════════════════════════════════════════════════════════════
// EMAIL: RECORDATORIO DE RACHA
// ═══════════════════════════════════════════════════════════════

export function emailRecordatorioRacha(nombre, diasRacha, horasRestantes) {
  const contenido = `
    <div style="text-align:center;">
      <div style="font-size:64px;margin-bottom:20px;">🔥</div>
      <h2 style="color:#fff;font-size:24px;margin:0 0 10px 0;">
        ${nombre}, ¡no pierdas tu racha!
      </h2>
      <p style="color:#ccc;font-size:16px;margin:0 0 30px 0;">
        Llevás <span style="color:#d4af37;font-weight:bold;">${diasRacha} días</span> consecutivos
      </p>
    </div>

    <div style="background:rgba(231,76,60,0.1);border:1px solid rgba(231,76,60,0.3);border-radius:12px;padding:20px;text-align:center;margin-bottom:24px;">
      <p style="color:#e74c3c;margin:0;font-size:14px;">
        ⏰ Te quedan aproximadamente <strong>${horasRestantes} horas</strong> para reclamar tu cofre diario
      </p>
    </div>

    <div style="background:rgba(0,0,0,0.3);border-radius:12px;padding:20px;margin-bottom:24px;">
      <p style="color:#ccc;margin:0;font-size:14px;text-align:center;">
        Si perdés la racha, volvés a empezar de cero.<br>
        <span style="color:#888;">Las rachas largas dan mejores recompensas en el cofre.</span>
      </p>
    </div>

    <div style="text-align:center;margin-top:30px;">
      <a href="https://duendesdeluruguay.com/mi-magia"
         style="display:inline-block;padding:14px 32px;background:linear-gradient(135deg,#d4af37,#b8962e);color:#1a1a2e;text-decoration:none;border-radius:12px;font-weight:600;">
        Reclamar mi cofre
      </a>
    </div>
  `;

  return plantillaBase(contenido, '¡No pierdas tu racha!');
}

// ═══════════════════════════════════════════════════════════════
// EMAIL: CONFIRMACIÓN DE COMPRA
// ═══════════════════════════════════════════════════════════════

export function emailConfirmacionCompra(nombre, producto, runas, xp) {
  const contenido = `
    <div style="text-align:center;">
      <div style="font-size:64px;margin-bottom:20px;">✨</div>
      <h2 style="color:#fff;font-size:24px;margin:0 0 10px 0;">
        ¡Gracias por tu compra, ${nombre}!
      </h2>
      <p style="color:#ccc;font-size:16px;margin:0 0 30px 0;">
        Tu guardián ya está en camino
      </p>
    </div>

    <div style="background:rgba(0,0,0,0.3);border-radius:12px;padding:20px;margin-bottom:24px;">
      <h3 style="color:#d4af37;font-size:16px;margin:0 0 12px 0;">Tu compra:</h3>
      <p style="color:#fff;font-size:18px;margin:0;">${producto}</p>
    </div>

    <div style="display:flex;gap:12px;margin-bottom:24px;">
      <div style="flex:1;background:rgba(212,175,55,0.1);border-radius:12px;padding:16px;text-align:center;">
        <span style="display:block;font-size:24px;color:#d4af37;font-weight:bold;">+${runas}</span>
        <span style="color:#888;font-size:12px;">Runas ganadas</span>
      </div>
      <div style="flex:1;background:rgba(155,89,182,0.1);border-radius:12px;padding:16px;text-align:center;">
        <span style="display:block;font-size:24px;color:#9b59b6;font-weight:bold;">+${xp}</span>
        <span style="color:#888;font-size:12px;">XP ganado</span>
      </div>
    </div>

    <p style="color:#888;font-size:14px;text-align:center;margin-bottom:24px;">
      Las runas se acreditaron automáticamente a tu cuenta.<br>
      Usalas para desbloquear experiencias únicas.
    </p>

    <div style="text-align:center;margin-top:30px;">
      <a href="https://duendesdeluruguay.com/mi-magia"
         style="display:inline-block;padding:14px 32px;background:linear-gradient(135deg,#d4af37,#b8962e);color:#1a1a2e;text-decoration:none;border-radius:12px;font-weight:600;">
        Ir a Mi Magia
      </a>
    </div>
  `;

  return plantillaBase(contenido, '¡Gracias por tu compra!');
}

// ═══════════════════════════════════════════════════════════════
// EMAIL: NUEVO BADGE DESBLOQUEADO
// ═══════════════════════════════════════════════════════════════

export function emailNuevoBadge(nombre, badgeNombre, badgeIcono, badgeDescripcion) {
  const contenido = `
    <div style="text-align:center;">
      <div style="font-size:80px;margin-bottom:20px;">${badgeIcono}</div>
      <h2 style="color:#fff;font-size:24px;margin:0 0 10px 0;">
        ¡Nuevo logro desbloqueado!
      </h2>
      <p style="color:#d4af37;font-size:20px;font-weight:bold;margin:0 0 30px 0;">
        ${badgeNombre}
      </p>
    </div>

    <div style="background:rgba(0,0,0,0.3);border-radius:12px;padding:24px;text-align:center;margin-bottom:24px;">
      <p style="color:#ccc;margin:0;font-size:15px;">
        ${badgeDescripcion}
      </p>
    </div>

    <p style="color:#888;font-size:14px;text-align:center;margin-bottom:24px;">
      ${nombre}, este logro queda guardado para siempre en tu perfil.<br>
      ¡Seguí desbloqueando más!
    </p>

    <div style="text-align:center;margin-top:30px;">
      <a href="https://duendesdeluruguay.com/mi-magia"
         style="display:inline-block;padding:14px 32px;background:linear-gradient(135deg,#d4af37,#b8962e);color:#1a1a2e;text-decoration:none;border-radius:12px;font-weight:600;">
        Ver mis logros
      </a>
    </div>
  `;

  return plantillaBase(contenido, `¡Desbloqueaste: ${badgeNombre}!`);
}

// ═══════════════════════════════════════════════════════════════
// EMAIL: BIENVENIDA AL CÍRCULO
// ═══════════════════════════════════════════════════════════════

export function emailBienvenidaCirculo(nombre) {
  const contenido = `
    <div style="text-align:center;">
      <div style="font-size:64px;margin-bottom:20px;">⭐</div>
      <h2 style="color:#fff;font-size:24px;margin:0 0 10px 0;">
        Bienvenida al Círculo, ${nombre}
      </h2>
      <p style="color:#d4af37;font-size:16px;margin:0 0 30px 0;">
        Ahora sos parte de algo especial
      </p>
    </div>

    <div style="background:rgba(0,0,0,0.3);border-radius:12px;padding:24px;margin-bottom:24px;">
      <h3 style="color:#d4af37;font-size:16px;margin:0 0 16px 0;">Lo que tenés disponible:</h3>
      <ul style="color:#ccc;margin:0;padding-left:20px;line-height:2;">
        <li>Acceso a todos los cursos del Círculo</li>
        <li>Foro privado con otras elegidas</li>
        <li>Canalizaciones exclusivas mensuales</li>
        <li>Cofre diario mejorado (+50% runas)</li>
        <li>Lecturas con descuento permanente</li>
        <li>Contenido nuevo cada semana</li>
      </ul>
    </div>

    <p style="color:#888;font-size:14px;text-align:center;margin-bottom:24px;">
      Tu membresía se renovará automáticamente cada mes.<br>
      Podés cancelar cuando quieras desde tu perfil.
    </p>

    <div style="text-align:center;margin-top:30px;">
      <a href="https://duendesdeluruguay.com/mi-magia/circulo"
         style="display:inline-block;padding:14px 32px;background:linear-gradient(135deg,#d4af37,#b8962e);color:#1a1a2e;text-decoration:none;border-radius:12px;font-weight:600;">
        Explorar el Círculo
      </a>
    </div>
  `;

  return plantillaBase(contenido, '¡Bienvenida al Círculo!');
}

// ═══════════════════════════════════════════════════════════════
// EMAIL: REFERIDO EXITOSO
// ═══════════════════════════════════════════════════════════════

export function emailReferidoExitoso(nombre, nombreReferido, runasGanadas) {
  const contenido = `
    <div style="text-align:center;">
      <div style="font-size:64px;margin-bottom:20px;">💫</div>
      <h2 style="color:#fff;font-size:24px;margin:0 0 10px 0;">
        ¡Tu referida se unió!
      </h2>
      <p style="color:#ccc;font-size:16px;margin:0 0 30px 0;">
        Gracias por compartir la magia, ${nombre}
      </p>
    </div>

    <div style="background:rgba(46,204,113,0.1);border:1px solid rgba(46,204,113,0.3);border-radius:12px;padding:20px;text-align:center;margin-bottom:24px;">
      <p style="color:#2ecc71;margin:0;font-size:16px;">
        <strong>${nombreReferido}</strong> usó tu código
      </p>
      <p style="color:#2ecc71;margin:10px 0 0 0;font-size:24px;font-weight:bold;">
        +${runasGanadas} runas para vos
      </p>
    </div>

    <p style="color:#888;font-size:14px;text-align:center;margin-bottom:24px;">
      Seguí compartiendo tu código para ganar más runas.<br>
      Si tu referida se une al Círculo, ganás un bonus extra.
    </p>

    <div style="text-align:center;margin-top:30px;">
      <a href="https://duendesdeluruguay.com/mi-magia"
         style="display:inline-block;padding:14px 32px;background:linear-gradient(135deg,#d4af37,#b8962e);color:#1a1a2e;text-decoration:none;border-radius:12px;font-weight:600;">
        Ver mis referidas
      </a>
    </div>
  `;

  return plantillaBase(contenido, '¡Tu referida se unió!');
}

// ═══════════════════════════════════════════════════════════════
// FUNCIÓN: ENVIAR EMAIL (Gmail SMTP con fallback a Resend)
// ═══════════════════════════════════════════════════════════════

export async function enviarEmail(to, subject, html) {
  // Intentar primero con Gmail SMTP
  const transporter = getGmailTransporter();

  if (transporter) {
    try {
      const info = await transporter.sendMail({
        from: FROM_EMAIL,
        to,
        subject,
        html
      });
      console.log(`[EMAILS] Email enviado via Gmail a ${to}: ${subject}`);
      return { success: true, id: info.messageId };
    } catch (error) {
      console.error('[EMAILS] Error Gmail SMTP, intentando Resend:', error.message);
      // Si falla Gmail, intentar con Resend
    }
  }

  // Fallback a Resend
  if (!RESEND_API_KEY) {
    console.log('[EMAILS] No hay Gmail ni Resend configurado, email no enviado');
    return { success: false, error: 'No email service configured' };
  }

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'Duendes del Uruguay <onboarding@resend.dev>',
        to,
        subject,
        html,
        reply_to: REPLY_TO
      })
    });

    const data = await res.json();

    if (res.ok) {
      console.log(`[EMAILS] Email enviado via Resend a ${to}: ${subject}`);
      return { success: true, id: data.id };
    } else {
      console.error(`[EMAILS] Error Resend:`, data);
      return { success: false, error: data.message };
    }
  } catch (error) {
    console.error('[EMAILS] Error:', error);
    return { success: false, error: error.message };
  }
}

// ═══════════════════════════════════════════════════════════════
// FUNCIONES DE CONVENIENCIA
// ═══════════════════════════════════════════════════════════════

export async function notificarSubidaNivel(email, nombre, nivelAnterior, nivelNuevo, beneficios) {
  const html = emailSubidaNivel(nombre, nivelAnterior, nivelNuevo, beneficios);
  return enviarEmail(email, `🎉 ¡Subiste a nivel ${nivelNuevo}!`, html);
}

export async function notificarRecordatorioRacha(email, nombre, diasRacha, horasRestantes) {
  const html = emailRecordatorioRacha(nombre, diasRacha, horasRestantes);
  return enviarEmail(email, `🔥 ¡No pierdas tu racha de ${diasRacha} días!`, html);
}

export async function notificarCompra(email, nombre, producto, runas, xp) {
  const html = emailConfirmacionCompra(nombre, producto, runas, xp);
  return enviarEmail(email, `✨ ¡Gracias por tu compra!`, html);
}

export async function notificarNuevoBadge(email, nombre, badgeNombre, badgeIcono, badgeDescripcion) {
  const html = emailNuevoBadge(nombre, badgeNombre, badgeIcono, badgeDescripcion);
  return enviarEmail(email, `🏆 ¡Desbloqueaste: ${badgeNombre}!`, html);
}

export async function notificarBienvenidaCirculo(email, nombre) {
  const html = emailBienvenidaCirculo(nombre);
  return enviarEmail(email, `⭐ ¡Bienvenida al Círculo de Duendes!`, html);
}

export async function notificarReferidoExitoso(email, nombre, nombreReferido, runasGanadas) {
  const html = emailReferidoExitoso(nombre, nombreReferido, runasGanadas);
  return enviarEmail(email, `💫 ¡Tu referida ${nombreReferido} se unió!`, html);
}
