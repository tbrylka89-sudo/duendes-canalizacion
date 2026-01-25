import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

/**
 * API para enviar email con resultado del test del guardián
 * Usa Gmail SMTP para emails profesionales desde @duendesdeluruguay.com
 */
export async function POST(request) {
    try {
        const data = await request.json();
        const { email, nombre, guardian, porcentaje, frase, esRegalo, nombreQuienRegala, guardianImagen, guardianUrl } = data;

        if (!email || !nombre) {
            return NextResponse.json({ success: false, error: 'Datos incompletos' }, { status: 400 });
        }

        // Verificar si Gmail SMTP está configurado
        if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
            console.log('Gmail SMTP no configurado, intentando con Resend...');
            // Fallback a Resend si no hay Gmail configurado
            return await sendWithResend(data);
        }

        // Configurar transporter de Gmail
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_APP_PASSWORD
            }
        });

        // Construir el email HTML
        const htmlContent = buildEmailHtml({ nombre, guardian, porcentaje, frase, esRegalo, nombreQuienRegala, guardianImagen, guardianUrl });

        const subject = esRegalo
            ? `✨ ${nombre}, alguien te eligió un guardián`
            : `✨ ${nombre}, tu guardián te encontró`;

        // Enviar email
        const info = await transporter.sendMail({
            from: `"Duendes del Uruguay" <${process.env.GMAIL_USER}>`,
            to: email,
            subject: subject,
            html: htmlContent
        });

        console.log('Email enviado:', info.messageId);
        return NextResponse.json({ success: true, message: 'Email enviado', id: info.messageId });

    } catch (error) {
        console.error('Error en send-email:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

// Función para construir el HTML del email
function buildEmailHtml({ nombre, guardian, porcentaje, frase, esRegalo, nombreQuienRegala, guardianImagen, guardianUrl }) {
    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #0a0a0a; font-family: 'Segoe UI', Arial, sans-serif;">
    <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">

        <!-- Header -->
        <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #d4af37; font-size: 24px; font-weight: 400; margin: 0;">
                ✦ Duendes del Uruguay ✦
            </h1>
        </div>

        <!-- Card principal -->
        <div style="background: linear-gradient(180deg, #1a1a2e 0%, #0f0f1a 100%); border-radius: 20px; padding: 40px 30px; border: 1px solid rgba(212, 175, 55, 0.3);">

            <!-- Título -->
            <div style="text-align: center; margin-bottom: 30px;">
                <h2 style="color: #ffffff; font-size: 22px; font-weight: 400; margin: 0 0 10px 0;">
                    ${esRegalo ? nombre + ', alguien te eligió' : nombre + ', tu guardián te encontró'}
                </h2>
                ${esRegalo && nombreQuienRegala ? `<p style="color: rgba(255,255,255,0.6); font-size: 14px; margin: 0;">Un regalo de ${nombreQuienRegala}</p>` : ''}
            </div>

            <!-- Guardián -->
            <div style="text-align: center; margin: 30px 0;">
                ${guardianImagen ? `
                <img src="${guardianImagen}" alt="${guardian}" style="width: 180px; height: 180px; border-radius: 50%; border: 3px solid #d4af37; object-fit: cover; margin-bottom: 15px;">
                ` : `
                <div style="width: 120px; height: 120px; border-radius: 50%; background: linear-gradient(135deg, #d4af37 0%, #8b6914 100%); margin: 0 auto 15px;"></div>
                `}
                <h3 style="color: #d4af37; font-size: 24px; margin: 0 0 10px 0; font-weight: 500;">
                    ${guardian}
                </h3>
                ${porcentaje ? `
                <span style="background: linear-gradient(135deg, #d4af37 0%, #c9a227 100%); color: #000; padding: 8px 20px; border-radius: 20px; font-weight: bold; font-size: 16px;">
                    ${porcentaje}% de conexión
                </span>
                ` : ''}
            </div>

            <!-- Frase/Mensaje -->
            ${frase ? `
            <div style="background: rgba(212, 175, 55, 0.1); border: 1px solid rgba(212, 175, 55, 0.3); border-radius: 15px; padding: 25px; margin: 30px 0; text-align: center;">
                <p style="color: #d4af37; font-size: 18px; font-style: italic; margin: 0; line-height: 1.6;">
                    "${frase}"
                </p>
            </div>
            ` : ''}

            <!-- CTA -->
            <div style="text-align: center; margin-top: 30px;">
                <a href="${guardianUrl || 'https://duendesdeluruguay.com/tienda/'}"
                   style="display: inline-block; padding: 16px 40px; background: linear-gradient(135deg, #d4af37 0%, #c9a227 100%); border-radius: 30px; color: #000; text-decoration: none; font-size: 14px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px;">
                    Conocer a ${guardian}
                </a>
            </div>

        </div>

        <!-- Footer -->
        <div style="text-align: center; margin-top: 30px; color: rgba(255,255,255,0.5); font-size: 12px;">
            <p style="margin: 0 0 5px 0;">Duendes del Uruguay</p>
            <p style="margin: 0;">Guardianes artesanales canalizados para vos</p>
            <p style="margin: 15px 0 0 0;">
                <a href="https://duendesdeluruguay.com" style="color: #d4af37; text-decoration: none;">duendesdeluruguay.com</a>
            </p>
        </div>

    </div>
</body>
</html>
    `;
}

// Fallback a Resend si Gmail no está configurado
async function sendWithResend(data) {
    const { email, nombre, guardian, porcentaje, frase, esRegalo, nombreQuienRegala, guardianImagen, guardianUrl } = data;

    if (!process.env.RESEND_API_KEY) {
        return NextResponse.json({ success: false, error: 'No hay servicio de email configurado' }, { status: 500 });
    }

    const htmlContent = buildEmailHtml({ nombre, guardian, porcentaje, frase, esRegalo, nombreQuienRegala, guardianImagen, guardianUrl });

    const subject = esRegalo
        ? `✨ ${nombre}, alguien te eligió un guardián`
        : `✨ ${nombre}, tu guardián te encontró`;

    const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            from: 'Duendes del Uruguay <onboarding@resend.dev>',
            to: email,
            subject: subject,
            html: htmlContent,
            reply_to: 'info@duendesdeluruguay.com'
        })
    });

    const result = await response.json();

    if (response.ok) {
        return NextResponse.json({ success: true, message: 'Email enviado (Resend)', id: result.id });
    } else {
        return NextResponse.json({ success: false, error: result.message || 'Error enviando email' });
    }
}
