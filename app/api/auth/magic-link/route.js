import { kv } from '@vercel/kv';

export const dynamic = 'force-dynamic';

// ═══════════════════════════════════════════════════════════════════════════════
// API: VALIDACIÓN DE MAGIC LINKS
// Verifica el token, retorna datos del usuario, marca como usado
// ═══════════════════════════════════════════════════════════════════════════════

export async function POST(request) {
  try {
    const { token } = await request.json();

    if (!token) {
      return Response.json({
        success: false,
        error: 'Token requerido'
      }, { status: 400 });
    }

    // Buscar magic link
    const magicData = await kv.get(`magic:${token}`);

    if (!magicData) {
      return Response.json({
        success: false,
        error: 'Enlace inválido o expirado'
      }, { status: 401 });
    }

    // Verificar expiración
    if (magicData.expiraEn && Date.now() > magicData.expiraEn) {
      await kv.del(`magic:${token}`);
      return Response.json({
        success: false,
        error: 'Enlace expirado. Solicitá uno nuevo.'
      }, { status: 401 });
    }

    const email = magicData.email;

    // Buscar usuario
    const usuario = await kv.get(`user:${email}`) || await kv.get(`elegido:${email}`);

    if (!usuario) {
      return Response.json({
        success: false,
        error: 'Usuario no encontrado'
      }, { status: 404 });
    }

    // Eliminar magic link usado (one-time use)
    await kv.del(`magic:${token}`);

    // Actualizar último acceso
    const actualizado = {
      ...usuario,
      ultimoAcceso: new Date().toISOString()
    };

    if (await kv.get(`user:${email}`)) {
      await kv.set(`user:${email}`, actualizado);
    }
    if (await kv.get(`elegido:${email}`)) {
      await kv.set(`elegido:${email}`, actualizado);
    }

    return Response.json({
      success: true,
      usuario: {
        email: usuario.email,
        nombre: usuario.nombre,
        token: usuario.token, // Token permanente para acceso
        runas: usuario.runas,
        treboles: usuario.treboles,
        esDelCirculo: usuario.esDelCirculo || false,
        perfilCompletado: usuario.perfilCompletado || false
      }
    });

  } catch (error) {
    console.error('[MAGIC LINK] Error:', error);
    return Response.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}

// GET - Solicitar nuevo magic link
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email');

  if (!email) {
    return Response.json({
      success: false,
      error: 'Email requerido'
    }, { status: 400 });
  }

  const emailNorm = email.toLowerCase().trim();
  const usuario = await kv.get(`user:${emailNorm}`) || await kv.get(`elegido:${emailNorm}`);

  if (!usuario) {
    return Response.json({
      success: false,
      error: 'No encontramos una cuenta con ese email'
    }, { status: 404 });
  }

  // Crear y enviar magic link usando la API de clientes
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'https://duendes-vercel.vercel.app'}/api/admin/clientes/crear`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: emailNorm,
        enviarEmail: true
      })
    });

    const data = await response.json();

    if (data.success) {
      return Response.json({
        success: true,
        mensaje: 'Te enviamos un enlace mágico a tu email'
      });
    } else {
      throw new Error(data.error);
    }

  } catch (error) {
    console.error('[MAGIC LINK] Error enviando:', error);
    return Response.json({
      success: false,
      error: 'Error enviando el enlace. Intentá de nuevo.'
    }, { status: 500 });
  }
}
