import { kv } from '@vercel/kv';

// ═══════════════════════════════════════════════════════════════════════════════
// API: GENERAR CÓDIGO DE REFERIDO
// Crea un código único para que el usuario comparta
// ═══════════════════════════════════════════════════════════════════════════════

export const dynamic = 'force-dynamic';

function generarCodigoUnico(email) {
  // Tomar primeras letras del email + random
  const base = email.split('@')[0].slice(0, 4).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `DU-${base}-${random}`;
}

export async function POST(request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return Response.json({
        success: false,
        error: 'Se requiere el email del usuario'
      }, { status: 400 });
    }

    // Obtener usuario
    const usuario = await kv.get(`user:${email}`);

    if (!usuario) {
      return Response.json({
        success: false,
        error: 'Usuario no encontrado'
      }, { status: 404 });
    }

    // Si ya tiene código, devolverlo
    if (usuario.codigoReferido) {
      return Response.json({
        success: true,
        codigo: usuario.codigoReferido,
        mensaje: 'Ya tenés tu código de referido',
        yaExistia: true
      });
    }

    // Generar nuevo código
    let codigo = generarCodigoUnico(email);

    // Verificar que no exista
    let intentos = 0;
    while (intentos < 5) {
      const existente = await kv.get(`referido:${codigo}`);
      if (!existente) break;
      codigo = generarCodigoUnico(email);
      intentos++;
    }

    // Guardar código en el usuario
    await kv.set(`user:${email}`, {
      ...usuario,
      codigoReferido: codigo,
      referidos: usuario.referidos || []
    });

    // Crear índice inverso para buscar por código
    await kv.set(`referido:${codigo}`, {
      email,
      creado: new Date().toISOString()
    });

    console.log(`[REFERIDOS] Código generado para ${email}: ${codigo}`);

    return Response.json({
      success: true,
      codigo,
      mensaje: 'Código de referido generado exitosamente',
      yaExistia: false
    });

  } catch (error) {
    console.error('[REFERIDOS] Error generando código:', error);
    return Response.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
