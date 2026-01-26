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

    // Enviar email
    let emailResult = null;
    if (process.env.RESEND_API_KEY) {
      console.log('📧 Enviando email a:', emailLower);
      emailResult = await resend.emails.send({
        from: 'Duendes del Uruguay <info@duendesdeluruguay.com>',
        to: emailLower,
        subject: esNuevo ? '✨ Tu portal mágico te espera' : '🔮 Entrá a Mi Magia',
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="margin: 0; padding: 0; background-color: #0a0a0a; font-family: Georgia, serif;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0a0a0a; padding: 40px 20px;">
              <tr>
                <td align="center">
                  <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 500px; background: linear-gradient(135deg, #111 0%, #1a1a1a 100%); border-radius: 20px; border: 1px solid #333;">
                    <tr>
                      <td style="padding: 40px 30px; text-align: center;">
                        <div style="font-size: 50px; margin-bottom: 20px;">🔮</div>
                        <h1 style="font-family: Georgia, serif; font-size: 32px; color: #ffffff; margin: 0 0 10px;">
                          ${esNuevo ? '¡Bienvenida!' : 'Hola de nuevo'}
                        </h1>
                        <p style="color: rgba(255,255,255,0.7); font-size: 16px; line-height: 1.6; margin: 0 0 30px;">
                          ${esNuevo
                            ? 'Tu portal personal en Duendes del Uruguay está listo. Tocá el botón para entrar y comenzar tu viaje mágico.'
                            : 'Tocá el botón para entrar a Mi Magia. El enlace es válido por 30 minutos.'
                          }
                        </p>
                        <a href="${magicLinkUrl}" style="display: inline-block; background: linear-gradient(135deg, #d4af37 0%, #b8972e 100%); color: #0a0a0a; text-decoration: none; padding: 16px 40px; border-radius: 10px; font-weight: bold; font-size: 16px;">
                          ✨ Entrar a Mi Magia
                        </a>
                        <p style="color: rgba(255,255,255,0.4); font-size: 13px; margin-top: 30px;">
                          Si no solicitaste este enlace, podés ignorar este email.
                        </p>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 20px 30px; border-top: 1px solid #222; text-align: center;">
                        <p style="color: rgba(255,255,255,0.3); font-size: 12px; margin: 0;">
                          Duendes del Uruguay<br>
                          Magia que transforma
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </body>
          </html>
        `
      });
      console.log('📧 Resultado Resend:', JSON.stringify(emailResult));
      if (emailResult.error) {
        console.error('❌ Error Resend:', emailResult.error);
      }
    } else {
      // En desarrollo sin Resend, loguear el link
      console.log('🔮 Magic Link (dev):', magicLinkUrl);
    }

    // Siempre loguear el link para debug
    console.log('🔗 Magic Link generado:', magicLinkUrl);

    // Si es usuario nuevo, crear registro básico
    if (esNuevo) {
      await kv.set(`elegido:${emailLower}`, {
        email: emailLower,
        nombre: emailLower.split('@')[0],
        runas: 100,
        treboles: 0,
        creado: new Date().toISOString(),
        onboardingCompleto: false
      });
    }

    // Crear/actualizar token persistente para el usuario
    await kv.set(`token:${token}`, {
      email: emailLower,
      nombre: usuarioExistente?.nombre || emailLower.split('@')[0],
      creado: new Date().toISOString()
    }, { ex: 30 * 24 * 60 * 60 }); // 30 días

    // Si el email falló, devolver el link directo como fallback
    const emailFallo = emailResult?.error;
    console.log('📧 Email fallo?:', emailFallo, 'Result:', JSON.stringify(emailResult));

    return Response.json({
      success: true,
      mensaje: emailFallo ? `Error: ${emailResult?.error?.message || 'desconocido'}` : 'Enlace mágico enviado',
      // Solo devolver link directo si el email falló
      ...(emailFallo && { linkDirecto: magicLinkUrl }),
      // Debug info
      debug: { error: emailResult?.error, hasApiKey: !!process.env.RESEND_API_KEY }
    });

  } catch (error) {
    console.error('Error enviando magic link:', error);
    return Response.json({
      success: false,
      error: 'Error al enviar el enlace. Intentá de nuevo.'
    }, { status: 500 });
  }
}
