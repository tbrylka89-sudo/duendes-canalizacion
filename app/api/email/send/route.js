import { Resend } from 'resend';
import { NextResponse } from 'next/server';
import templates from '@/lib/email-templates';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request) {
  try {
    // Verificar token de seguridad
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.DUENDES_API_TOKEN}`) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const body = await request.json();
    const { to, subject, template, data, html, from, replyTo } = body;

    if (!to || !subject) {
      return NextResponse.json(
        { error: 'Faltan campos: to, subject' },
        { status: 400 }
      );
    }

    // Usar template si se especifica, sino usar html directo
    let emailHtml = html;
    if (template && templates[template]) {
      emailHtml = templates[template](data || {});
    }

    if (!emailHtml) {
      return NextResponse.json(
        { error: 'Falta html o template válido' },
        { status: 400 }
      );
    }

    // Lista de remitentes a probar (dominio verificado primero, fallback después)
    const fromOptions = [
      from || 'Duendes del Uruguay <hola@duendesdeluruguay.com>',
      'Duendes del Uruguay <onboarding@resend.dev>', // Fallback para testing
    ];

    let lastError = null;
    let resendData = null;

    // Intentar enviar con cada opción de from hasta que funcione
    for (const fromEmail of fromOptions) {
      const { data, error } = await resend.emails.send({
        from: fromEmail,
        to: Array.isArray(to) ? to : [to],
        subject,
        html: emailHtml,
        replyTo: replyTo || 'duendesdeluruguay@gmail.com',
      });

      if (!error && data) {
        resendData = data;
        break;
      }

      lastError = error;
      console.log(`Falló con ${fromEmail}, probando siguiente...`);
    }

    if (!resendData) {
      console.error('Error Resend (todos los intentos):', lastError);
      return NextResponse.json({ error: lastError?.message || 'Error enviando email' }, { status: 500 });
    }

    return NextResponse.json({ success: true, id: resendData.id });
  } catch (err) {
    console.error('Error enviando email:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// GET para test rápido
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token');
  const email = searchParams.get('email');
  const nombre = searchParams.get('nombre') || 'Thibisay';

  if (token !== process.env.DUENDES_API_TOKEN) {
    return NextResponse.json({ error: 'Token inválido' }, { status: 401 });
  }

  if (!email) {
    return NextResponse.json({ error: 'Falta email' }, { status: 400 });
  }

  try {
    const html = templates.emailTest({ nombre });

    const { data, error } = await resend.emails.send({
      from: 'Duendes del Uruguay <onboarding@resend.dev>',
      to: [email],
      subject: '✨ Email de prueba - Duendes del Uruguay',
      html,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, id: data.id, message: `Email enviado a ${email}` });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
