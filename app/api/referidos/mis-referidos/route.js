import { kv } from '@vercel/kv';

// ═══════════════════════════════════════════════════════════════════════════════
// API: MIS REFERIDOS
// Ver lista de personas referidas y estadísticas
// ═══════════════════════════════════════════════════════════════════════════════

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return Response.json({
        success: false,
        error: 'Se requiere el email'
      }, { status: 400 });
    }

    const usuario = await kv.get(`user:${email}`);

    if (!usuario) {
      return Response.json({
        success: false,
        error: 'Usuario no encontrado'
      }, { status: 404 });
    }

    const referidos = usuario.referidos || [];
    const codigoReferido = usuario.codigoReferido;

    // Calcular estadísticas
    let totalBonusGanado = 0;
    const referidosDetalle = [];

    for (const ref of referidos) {
      totalBonusGanado += ref.bonusOtorgado || 50;

      // Obtener info adicional del referido
      const refUsuario = await kv.get(`user:${ref.email}`);

      referidosDetalle.push({
        email: ref.email.split('@')[0] + '@...', // Ocultar email completo
        fecha: ref.fecha,
        bonus: ref.bonusOtorgado || 50,
        esCirculo: refUsuario?.esCirculo || false
      });
    }

    // Ordenar por fecha más reciente
    referidosDetalle.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

    return Response.json({
      success: true,
      codigoReferido,
      tieneCodigo: !!codigoReferido,
      totalReferidos: referidos.length,
      totalBonusGanado,
      referidos: referidosDetalle,
      // Link para compartir
      linkCompartir: codigoReferido
        ? `https://duendesdeluruguay.com/registro?ref=${codigoReferido}`
        : null
    });

  } catch (error) {
    console.error('[MIS-REFERIDOS] Error:', error);
    return Response.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
