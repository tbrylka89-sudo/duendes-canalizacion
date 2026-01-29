import { kv } from '@vercel/kv';

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

    // Devolver link directo
    return Response.json({
      success: true,
      linkDirecto: magicLinkUrl
    });

  } catch (error) {
    console.error('Error en magic link:', error);
    return Response.json({
      success: false,
      error: 'Error al generar el enlace. Intentá de nuevo.'
    }, { status: 500 });
  }
}
