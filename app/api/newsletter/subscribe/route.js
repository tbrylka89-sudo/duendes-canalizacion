import { kv } from '@vercel/kv';

export async function POST(request) {
    try {
        const data = await request.json();
        const { email, name, country, source } = data;

        // Validar email
        if (!email || !email.includes('@') || !email.includes('.')) {
            return Response.json({
                success: false,
                error: 'Email inválido'
            }, { status: 400 });
        }

        // Crear hash del email para key
        const emailHash = Buffer.from(email.toLowerCase().trim())
            .toString('base64')
            .replace(/[^a-zA-Z0-9]/g, '')
            .substring(0, 32);

        // Verificar si ya existe
        const existing = await kv.get(`newsletter:${emailHash}`);
        if (existing) {
            return Response.json({
                success: true,
                message: 'Ya estás en la lista',
                already_subscribed: true
            });
        }

        // Guardar suscripción
        const subscription = {
            email: email.toLowerCase().trim(),
            name: name || '',
            country: country || '',
            source: source || 'test_guardian',
            subscribed_at: new Date().toISOString(),
            status: 'active'
        };

        await kv.set(`newsletter:${emailHash}`, subscription);

        // Actualizar contador global
        const statsKey = 'newsletter:stats';
        let stats = await kv.get(statsKey) || { total: 0, by_source: {}, by_country: {} };
        stats.total++;
        stats.by_source[source || 'test_guardian'] = (stats.by_source[source || 'test_guardian'] || 0) + 1;
        if (country) {
            stats.by_country[country] = (stats.by_country[country] || 0) + 1;
        }
        stats.last_subscription = new Date().toISOString();
        await kv.set(statsKey, stats);

        // Intentar enviar email con Resend si está configurado
        let emailSent = false;
        if (process.env.RESEND_API_KEY) {
            try {
                const resendResponse = await fetch('https://api.resend.com/emails', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        from: 'Duendes del Uruguay <hola@duendesdeluruguay.com>',
                        to: email,
                        subject: 'Tu señal fue recibida ✨',
                        html: `
                            <div style="font-family: Georgia, serif; max-width: 500px; margin: 0 auto; padding: 40px 20px; background: #0a0a0a; color: #f5f7ff;">
                                <h1 style="font-size: 24px; color: #d4af37; margin-bottom: 20px;">
                                    ${name ? name + ', tu' : 'Tu'} señal fue recibida
                                </h1>
                                <p style="line-height: 1.7; color: #ccc;">
                                    Ahora formas parte de Los Elegidos. Vas a recibir mensajes cuando el universo tenga algo que decirte.
                                </p>
                                <p style="margin-top: 30px; font-style: italic; color: #888;">
                                    No son newsletters. Son señales.
                                </p>
                                <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #333;">
                                    <a href="https://duendesdeluruguay.com" style="color: #3B82F6; text-decoration: none;">
                                        Duendes del Uruguay
                                    </a>
                                </div>
                            </div>
                        `
                    })
                });
                emailSent = resendResponse.ok;
            } catch (e) {
                console.log('Resend error (non-fatal):', e.message);
            }
        }

        return Response.json({
            success: true,
            message: 'Señal recibida',
            email_sent: emailSent
        });

    } catch (error) {
        console.error('Newsletter subscribe error:', error);
        return Response.json({
            success: false,
            error: 'Error del portal'
        }, { status: 500 });
    }
}

// GET: Stats para admin
export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const apiKey = searchParams.get('key');

        const validKey = process.env.INSIGHTS_API_KEY || 'duendes-insights-2024';
        if (apiKey !== validKey) {
            return Response.json({ success: false, error: 'API key inválida' }, { status: 401 });
        }

        const stats = await kv.get('newsletter:stats') || { total: 0, by_source: {}, by_country: {} };

        return Response.json({ success: true, stats });
    } catch (error) {
        return Response.json({ success: false, error: error.message }, { status: 500 });
    }
}
