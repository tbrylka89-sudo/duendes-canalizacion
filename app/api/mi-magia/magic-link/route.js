import { kv } from '@vercel/kv';
import { Resend } from 'resend';

export const dynamic = 'force-dynamic';

const resend = new Resend(process.env.RESEND_API_KEY);

// Generar token seguro
function generarToken() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let token = '';
  for (let i = 0; i < 64; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
}

export async function POST(request) {
  try {
    const { email } = await request.json();

    if (!email || !email.includes('@')) {
      return Response.json({ success: false, error: 'Email inválido' }, { status: 400 });
    }

    const emailLower = email.toLowerCase().trim();

    // Verificar rate limiting (máximo 3 emails por hora por dirección)
    const rateLimitKey = `magic-link:rate:${emailLower}`;
    const intentos = await kv.get(rateLimitKey) || 0;

    if (intentos >= 3) {
      return Response.json({
        success: false,
        error: 'Demasiados intentos. Esperá unos minutos.'
      }, { status: 429 });
    }

    // Generar token único
    const token = generarToken();
    const expiracion = 30 * 60; // 30 minutos

    // Guardar token en KV
    await kv.set(`magic-link:${token}`, {
      email: emailLower,
      creado: Date.now()
    }, { ex: expiracion });

    // Incrementar rate limit
    await kv.set(rateLimitKey, intentos + 1, { ex: 3600 }); // 1 hora

    // URL del magic link
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://duendes-vercel.vercel.app';
    const magicLinkUrl = `${baseUrl}/mi-magia?token=${token}`;

    // Verificar si el usuario ya existe
    const usuarioExistente = await kv.get(`elegido:${emailLower}`);
    const esNuevo = !usuarioExistente;
    const nombreUsuario = usuarioExistente?.nombre || emailLower.split('@')[0];

    // Si es usuario nuevo, crear registro básico
    if (esNuevo) {
      await kv.set(`elegido:${emailLower}`, {
        email: emailLower,
        nombre: nombreUsuario,
        runas: 100,
        treboles: 0,
        creado: new Date().toISOString(),
        onboardingCompleto: false
      });
    }

    // Crear/actualizar token persistente para el usuario
    await kv.set(`token:${token}`, {
      email: emailLower,
      nombre: nombreUsuario,
      creado: new Date().toISOString()
    }, { ex: 30 * 24 * 60 * 60 }); // 30 días

    // Enviar email con Resend
    let emailEnviado = false;
    try {
      const { data, error } = await resend.emails.send({
        from: 'Duendes del Uruguay <magia@duendesdeluruguay.com>',
        to: emailLower,
        subject: esNuevo ? '✨ Tu portal Mi Magia te espera' : '✨ Tu acceso a Mi Magia',
        html: generarEmailHTML(magicLinkUrl, nombreUsuario, esNuevo)
      });
      if (error) {
        console.error('Error Resend:', error);
      } else {
        emailEnviado = true;
        console.log(`📧 Magic Link enviado a ${emailLower}, id: ${data?.id}`);
      }
    } catch (emailError) {
      console.error('Error enviando email:', emailError);
      // Fallback: devolver link directo si falla el email
    }

    if (emailEnviado) {
      return Response.json({
        success: true,
        emailEnviado: true,
        mensaje: 'Revisá tu email para acceder'
      });
    } else {
      // Fallback si falla el email
      return Response.json({
        success: true,
        emailEnviado: false,
        linkDirecto: magicLinkUrl,
        mensaje: 'No pudimos enviar el email. Usá este enlace directo.'
      });
    }

  } catch (error) {
    console.error('Error en magic link:', error);
    return Response.json({
      success: false,
      error: 'Error al enviar el enlace. Intentá de nuevo.'
    }, { status: 500 });
  }
}

function generarEmailHTML(magicLinkUrl, nombre, esNuevo) {
  const saludo = esNuevo
    ? `<p style="color:#d4d4d4;font-size:17px;line-height:1.6;margin:0 0 20px;">
        ${nombre}, tu portal mágico está listo.<br>
        Tocá el botón para entrar por primera vez.
      </p>`
    : `<p style="color:#d4d4d4;font-size:17px;line-height:1.6;margin:0 0 20px;">
        ${nombre}, tocá el botón para entrar a tu portal.
      </p>`;

  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:Georgia,'Times New Roman',serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;padding:40px 20px;">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;background:#111;border-radius:16px;border:1px solid #222;overflow:hidden;">

        <!-- Header -->
        <tr><td style="padding:40px 30px 20px;text-align:center;">
          <div style="font-size:48px;margin-bottom:16px;">✨</div>
          <h1 style="font-family:'Palatino Linotype',Palatino,Georgia,serif;color:#d4af37;font-size:28px;margin:0 0 8px;font-weight:normal;">
            Mi Magia
          </h1>
          <p style="color:rgba(255,255,255,0.4);font-size:14px;margin:0;">
            Duendes del Uruguay
          </p>
        </td></tr>

        <!-- Content -->
        <tr><td style="padding:10px 30px 30px;">
          ${saludo}

          <table width="100%" cellpadding="0" cellspacing="0">
            <tr><td align="center" style="padding:10px 0 25px;">
              <a href="${magicLinkUrl}"
                style="display:inline-block;background:linear-gradient(135deg,#d4af37,#b8972e);color:#0a0a0a;padding:16px 40px;border-radius:10px;text-decoration:none;font-size:17px;font-weight:bold;font-family:'Palatino Linotype',Georgia,serif;">
                Entrar a Mi Magia
              </a>
            </td></tr>
          </table>

          <p style="color:rgba(255,255,255,0.35);font-size:13px;margin:0;line-height:1.5;">
            Este enlace expira en 30 minutos y solo funciona una vez.
            Si no pediste este acceso, ignorá este email.
          </p>
        </td></tr>

        <!-- Footer -->
        <tr><td style="padding:20px 30px;border-top:1px solid #222;text-align:center;">
          <p style="color:rgba(255,255,255,0.25);font-size:12px;margin:0;">
            Duendes del Uruguay — Piriápolis, Maldonado
          </p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}
