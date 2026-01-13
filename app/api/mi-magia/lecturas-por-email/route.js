import { kv } from '@vercel/kv';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function OPTIONS() {
  return new Response(null, { headers: CORS_HEADERS });
}

// ═══════════════════════════════════════════════════════════════
// OBTENER LECTURAS POR EMAIL
// Para Mi Magia - busca canalizaciones personalizadas
// ═══════════════════════════════════════════════════════════════

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email')?.toLowerCase();

    if (!email) {
      return Response.json({
        success: false,
        error: 'Email requerido'
      }, { status: 400, headers: CORS_HEADERS });
    }

    // Buscar lecturas del usuario
    const lecturas = await kv.get(`lecturas:${email}`) || [];

    // Buscar también datos del elegido para verificar guardianes
    const elegido = await kv.get(`elegido:${email}`);

    // Si no hay lecturas pero hay elegido, devolver info básica
    if (lecturas.length === 0 && !elegido) {
      return Response.json({
        success: false,
        error: 'Email no encontrado',
        lecturas: []
      }, { status: 404, headers: CORS_HEADERS });
    }

    // Devolver lecturas (incluyendo canalizaciones de guardianes)
    return Response.json({
      success: true,
      lecturas,
      guardianes: elegido?.guardianes || [],
      tieneCompras: !!elegido?.primeraCompra
    }, { headers: CORS_HEADERS });

  } catch (error) {
    console.error('Error obteniendo lecturas:', error);
    return Response.json({
      success: false,
      error: error.message
    }, { status: 500, headers: CORS_HEADERS });
  }
}
