import { kv } from '@vercel/kv';
import emailTemplates from '@/lib/email-templates';

export const dynamic = 'force-dynamic';

const BREVO_API_KEY = process.env.BREVO_API_KEY;
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://duendes-vercel.vercel.app';

function generarToken(longitud = 24) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let token = '';
  for (let i = 0; i < longitud; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
}

// POST - Admin envía formulario a un cliente
export async function POST(request) {
  try {
    const body = await request.json();
    const {
      email,
      nombre,
      formType,
      productName,
      ordenId,
      canalizacionId,
      personalMessage,
      notaAdmin
    } = body;

    // Validar campos requeridos
    if (!email || !email.includes('@')) {
      return Response.json({ success: false, error: 'Email inválido' }, { status: 400 });
    }
    if (!nombre) {
      return Response.json({ success: false, error: 'Nombre requerido' }, { status: 400 });
    }
    // formType es opcional — si es null, el cliente lo elige al abrir el formulario
    const tiposValidos = ['para_mi', 'regalo_sabe', 'regalo_sorpresa', 'para_nino', 'reconexion'];
    if (formType && !tiposValidos.includes(formType)) {
      return Response.json({ success: false, error: 'Tipo de formulario inválido' }, { status: 400 });
    }

    // Generar token único
    const token = generarToken();
    const linkFormulario = `${BASE_URL}/formulario/${token}`;

    // Guardar invitación en KV
    const invite = {
      token,
      formType: formType || null,
      customerEmail: email.toLowerCase().trim(),
      customerName: nombre,
      productName: productName || null,
      ordenId: ordenId || null,
      canalizacionId: canalizacionId || null,
      personalMessage: personalMessage || null,
      notaAdmin: notaAdmin || null,
      status: 'pending',
      createdAt: new Date().toISOString(),
      completedAt: null
    };

    await kv.set(`form_invite:${token}`, invite, { ex: 30 * 24 * 60 * 60 }); // 30 días

    // Indexar por email
    const invites = await kv.get(`form_invites:${email.toLowerCase().trim()}`) || [];
    invites.unshift(token);
    await kv.set(`form_invites:${email.toLowerCase().trim()}`, invites.slice(0, 20));

    // Agregar a lista global para admin
    const allInvites = await kv.get('form_invites:todas') || [];
    allInvites.unshift({ token, email: email.toLowerCase().trim(), nombre, formType, createdAt: invite.createdAt, status: 'pending' });
    await kv.set('form_invites:todas', allInvites.slice(0, 200));

    // Generar email HTML
    const emailHtml = emailTemplates.emailFormularioInvitacion({
      nombreDestinatario: nombre,
      formType,
      linkFormulario,
      productName: productName || null,
      personalMessage: personalMessage || null
    });

    // Enviar email via Brevo
    let emailEnviado = false;
    if (BREVO_API_KEY) {
      try {
        const subjects = {
          para_mi: 'Tu guardián quiere conocerte',
          regalo_sabe: 'Alguien te regaló algo especial',
          regalo_sorpresa: 'Contanos sobre esa persona especial',
          para_nino: 'Un guardián quiere conocer a un pequeño/a',
          reconexion: 'Tu guardián quiere reconectarse'
        };

        const res = await fetch('https://api.brevo.com/v3/smtp/email', {
          method: 'POST',
          headers: {
            'accept': 'application/json',
            'content-type': 'application/json',
            'api-key': BREVO_API_KEY
          },
          body: JSON.stringify({
            sender: { name: 'Duendes del Uruguay', email: 'info@duendesdeluruguay.com' },
            to: [{ email: email.toLowerCase().trim(), name: nombre }],
            subject: (formType && subjects[formType]) || 'Tu guardián te espera',
            htmlContent: emailHtml
          })
        });

        if (res.ok) {
          emailEnviado = true;
          console.log(`[FORM-SEND] Email enviado a ${email}`);
        } else {
          const err = await res.text();
          console.error('[FORM-SEND] Error Brevo:', err);
        }
      } catch (emailErr) {
        console.error('[FORM-SEND] Error enviando:', emailErr);
      }
    }

    return Response.json({
      success: true,
      token,
      linkFormulario,
      emailEnviado,
      mensaje: emailEnviado
        ? `Formulario enviado a ${email}`
        : `Formulario creado. Link: ${linkFormulario} (email no enviado)`
    });

  } catch (error) {
    console.error('[FORM-SEND] Error:', error);
    return Response.json({ success: false, error: 'Error al enviar formulario' }, { status: 500 });
  }
}

// GET - Listar invitaciones enviadas
export async function GET() {
  try {
    const allInvites = await kv.get('form_invites:todas') || [];

    // Enriquecer con datos actualizados
    const enriched = await Promise.all(
      allInvites.slice(0, 50).map(async (inv) => {
        const full = await kv.get(`form_invite:${inv.token}`);
        return full || inv;
      })
    );

    return Response.json({
      success: true,
      invitaciones: enriched,
      total: enriched.length
    });

  } catch (error) {
    console.error('[FORM-LIST] Error:', error);
    return Response.json({ success: false, error: 'Error listando formularios' }, { status: 500 });
  }
}
