import { kv } from '@vercel/kv';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function OPTIONS() {
  return new Response(null, { headers: CORS_HEADERS });
}

// ═══════════════════════════════════════════════════════════════
// GUARDAR DATOS DE ONBOARDING
// ═══════════════════════════════════════════════════════════════

export async function POST(request) {
  try {
    const datos = await request.json();
    const {
      token, // puede venir token en vez de email
      email,
      nombrePreferido,
      pronombre,
      genero,
      pais,
      moneda,
      perfilIncompleto,
      ultimaVerificacion
    } = datos;

    // Obtener email del token si no viene directo
    let emailFinal = email;
    if (!emailFinal && token) {
      const tokenData = await kv.get(`magic-link:${token}`);
      emailFinal = tokenData?.email;
    }

    if (!emailFinal) {
      return Response.json({
        success: false,
        error: 'Email requerido'
      }, { status: 400, headers: CORS_HEADERS });
    }

    const emailLower = emailFinal.toLowerCase();

    // Obtener datos existentes
    const elegido = await kv.get(`elegido:${emailLower}`) || {};

    // Actualizar con datos de onboarding
    const elegidoActualizado = {
      ...elegido,
      nombrePreferido: nombrePreferido || elegido.nombrePreferido,
      pronombre: pronombre || elegido.pronombre || 'ella',
      genero: genero || elegido.genero,
      pais: pais || elegido.pais,
      moneda: moneda || elegido.moneda || 'USD',
      onboardingCompleto: true,
      perfilIncompleto: perfilIncompleto !== undefined ? perfilIncompleto : elegido.perfilIncompleto,
      ultimaVerificacion: ultimaVerificacion || new Date().toISOString()
    };

    // Guardar
    await kv.set(`elegido:${emailLower}`, elegidoActualizado);

    return Response.json({
      success: true,
      mensaje: 'Onboarding guardado correctamente'
    }, { headers: CORS_HEADERS });

  } catch (error) {
    console.error('Error guardando onboarding:', error);
    return Response.json({
      success: false,
      error: error.message
    }, { status: 500, headers: CORS_HEADERS });
  }
}
