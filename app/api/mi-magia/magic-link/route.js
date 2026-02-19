import { kv } from '@vercel/kv';
import { enviarEmail } from '@/lib/emails';

export const dynamic = 'force-dynamic';

// Generar token seguro
function generarToken() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let token = '';
  for (let i = 0; i < 64; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
}

// Plantilla de email para magic link
function emailMagicLink(nombre, magicLinkUrl) {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:Georgia,serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;padding:40px 20px;">
<tr><td align="center">
<table width="500" cellpadding="0" cellspacing="0" style="background:#1a1a1a;border-radius:16px;overflow:hidden;border:1px solid rgba(198,169,98,0.2);">

  <tr><td style="padding:40px 40px 30px;text-align:center;">
    <p style="font-size:11px;letter-spacing:3px;color:#C6A962;margin:0 0 15px;text-transform:uppercase;">Duendes del Uruguay</p>
    <h1 style="font-size:26px;color:#fff;margin:0;font-weight:normal;">Tu enlace mágico</h1>
  </td></tr>

  <tr><td style="padding:0 40px 30px;">
    <p style="color:rgba(255,255,255,0.8);font-size:16px;line-height:1.7;margin:0 0 25px;text-align:center;">
      Hola${nombre ? ` ${nombre}` : ''},<br><br>
      Hacé click en el botón para entrar a tu espacio personal.
    </p>

    <table width="100%" cellpadding="0" cellspacing="0">
    <tr><td align="center">
      <a href="${magicLinkUrl}" style="display:inline-block;background:linear-gradient(135deg,#C6A962,#a88a42);color:#1a1a1a;padding:16px 40px;text-decoration:none;font-size:16px;font-weight:bold;border-radius:50px;letter-spacing:1px;">
        ENTRAR A MI MAGIA
      </a>
    </td></tr>
    </table>

    <p style="color:rgba(255,255,255,0.4);font-size:12px;text-align:center;margin:25px 0 0;">
      Este enlace expira en 30 días.<br>
      Si no solicitaste este acceso, ignorá este email.
    </p>
  </td></tr>

  <tr><td style="padding:20px 40px;border-top:1px solid rgba(198,169,98,0.15);text-align:center;">
    <p style="color:rgba(255,255,255,0.3);font-size:11px;margin:0;">
      Duendes del Uruguay · Piriápolis, Uruguay
    </p>
  </td></tr>

</table>
</td></tr>
</table>
</body>
</html>
`;
}

export async function POST(request) {
  try {
    const { email } = await request.json();

    if (!email || !email.includes('@')) {
      return Response.json({ success: false, error: 'Email inválido' }, { status: 400 });
    }

    const emailLower = email.toLowerCase().trim();

    // Verificar rate limiting (máximo 3 intentos por hora por dirección)
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
    const baseUrl = 'https://magia.duendesdeluruguay.com';
    const magicLinkUrl = `${baseUrl}?token=${token}`;

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

    // Enviar email con el magic link
    try {
      const htmlEmail = emailMagicLink(nombreUsuario, magicLinkUrl);
      await enviarEmail(
        emailLower,
        '✨ Tu enlace mágico - Duendes del Uruguay',
        htmlEmail
      );
      console.log(`[magic-link] Email enviado a ${emailLower}`);
    } catch (emailError) {
      console.error('[magic-link] Error enviando email:', emailError);
      // Aún así devolvemos success porque el token se creó correctamente
      // El usuario puede usar el link directo si el email falla
    }

    // Devolver link directo (útil para desarrollo/testing)
    return Response.json({
      success: true,
      mensaje: 'Te enviamos un enlace mágico a tu email',
      // Solo mostrar link en desarrollo
      ...(process.env.NODE_ENV === 'development' && { linkDirecto: magicLinkUrl })
    });

  } catch (error) {
    console.error('Error en magic link:', error);
    return Response.json({
      success: false,
      error: 'Error al generar el enlace. Intentá de nuevo.'
    }, { status: 500 });
  }
}
