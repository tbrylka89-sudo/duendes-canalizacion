import { NextResponse } from 'next/server';

/**
 * API para enviar email con resultado del test del guardián
 */
export async function POST(request) {
    try {
        const data = await request.json();
        const { email, nombre, guardian, porcentaje, frase, esRegalo, nombreQuienRegala } = data;

        if (!email || !nombre) {
            return NextResponse.json({ success: false, error: 'Datos incompletos' }, { status: 400 });
        }

        // Verificar si Resend está configurado
        if (!process.env.RESEND_API_KEY) {
            console.log('RESEND_API_KEY no configurada, email no enviado');
            return NextResponse.json({ success: true, message: 'Email no enviado (sin API key)' });
        }

        // Construir el email HTML
        const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: 'Segoe UI', Arial, sans-serif; background: #0a0a12; color: #ffffff; padding: 40px 20px; margin: 0; }
        .container { max-width: 600px; margin: 0 auto; background: linear-gradient(180deg, #0d0d1a 0%, #0a0a12 100%); border-radius: 20px; padding: 40px; border: 1px solid rgba(0, 212, 255, 0.2); }
        .header { text-align: center; margin-bottom: 30px; }
        .icon { width: 60px; height: 60px; background: linear-gradient(135deg, #00d4ff 0%, #0088cc 100%); border-radius: 50%; margin: 0 auto 20px; }
        h1 { color: #ffffff; font-size: 28px; font-weight: 300; margin: 0 0 10px 0; }
        .subtitle { color: rgba(255, 255, 255, 0.7); font-size: 16px; }
        .guardian-section { text-align: center; margin: 40px 0; }
        .guardian-circle { width: 120px; height: 120px; border-radius: 50%; border: 3px solid #00d4ff; margin: 0 auto 15px; display: block; }
        .guardian-name { color: #00d4ff; font-size: 22px; margin-bottom: 10px; }
        .porcentaje { background: #00d4ff; color: #000; padding: 8px 20px; border-radius: 20px; display: inline-block; font-weight: bold; font-size: 18px; }
        .frase { background: rgba(0, 212, 255, 0.1); border: 1px solid rgba(0, 212, 255, 0.3); border-radius: 15px; padding: 25px; margin: 30px 0; text-align: center; }
        .frase p { color: #00d4ff; font-size: 20px; font-style: italic; margin: 0; }
        .cta { display: inline-block; padding: 16px 40px; background: transparent; border: 2px solid #00d4ff; border-radius: 30px; color: #ffffff; text-decoration: none; font-size: 14px; text-transform: uppercase; letter-spacing: 2px; margin-top: 30px; }
        .footer { text-align: center; margin-top: 40px; color: rgba(255, 255, 255, 0.5); font-size: 13px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="icon"></div>
            <h1>${esRegalo ? nombre + ', alguien te eligió' : nombre + ', tu guardián te encontró'}</h1>
            ${esRegalo && nombreQuienRegala ? '<p class="subtitle">Un regalo de ' + nombreQuienRegala + '</p>' : ''}
        </div>

        <div class="guardian-section">
            <div class="guardian-circle" style="background: linear-gradient(135deg, #00d4ff 0%, #0088cc 100%);"></div>
            <div class="guardian-name">${guardian}</div>
            <div class="porcentaje">${porcentaje}% de conexión</div>
        </div>

        <div class="frase">
            <p>"${frase}"</p>
        </div>

        <div style="text-align: center;">
            <a href="https://duendesdeluruguay.com/shop/" class="cta">Ver Guardianes en la Tienda</a>
        </div>

        <div class="footer">
            <p>Duendes del Uruguay</p>
            <p>Canalizados para vos</p>
        </div>
    </div>
</body>
</html>
        `;

        // Enviar con Resend
        // Primero intenta con dominio propio, si falla usa dominio de prueba
        const dominioPropio = 'Duendes del Uruguay <hola@duendesdeluruguay.com>';
        const dominioPrueba = 'Duendes del Uruguay <onboarding@resend.dev>';

        const subject = esRegalo
            ? `${nombre}, alguien te eligió un guardián`
            : `${nombre}, tu guardián te encontró`;

        // Intentar con dominio propio primero
        let response = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                from: dominioPropio,
                to: email,
                subject: subject,
                html: htmlContent
            })
        });

        let result = await response.json();

        // Si falla por dominio no verificado, usar dominio de prueba
        if (!response.ok && result.message?.includes('not verified')) {
            console.log('Dominio propio no verificado, usando dominio de prueba de Resend');
            response = await fetch('https://api.resend.com/emails', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    from: dominioPrueba,
                    to: email,
                    subject: subject,
                    html: htmlContent,
                    reply_to: 'hola@duendesdeluruguay.com'
                })
            });
            result = await response.json();
        }

        if (response.ok) {
            return NextResponse.json({ success: true, message: 'Email enviado', id: result.id });
        } else {
            console.error('Error Resend:', result);
            return NextResponse.json({ success: false, error: result.message || 'Error enviando email' });
        }

    } catch (error) {
        console.error('Error en send-email:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
