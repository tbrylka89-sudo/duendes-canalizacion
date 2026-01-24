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

    const { data: resendData, error } = await resend.emails.send({
      from: from || 'Duendes del Uruguay <hola@duendesdeluruguay.com>',
      to: Array.isArray(to) ? to : [to],
      subject,
      html: emailHtml,
      replyTo: replyTo || 'duendesdeluruguay@gmail.com',
    });

    if (error) {
      console.error('Error Resend:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
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
      from: 'Duendes del Uruguay <hola@duendesdeluruguay.com>',
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
