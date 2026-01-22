import { generarSincronicidad } from '@/lib/sincronicidad';

export const dynamic = 'force-dynamic';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function OPTIONS() {
  return new Response(null, { status: 200, headers: corsHeaders });
}

// ═══════════════════════════════════════════════════════════════════════════════
// API DE SINCRONICIDAD - Genera "coincidencias mágicas" personalizadas
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * GET /api/sincronicidad
 *
 * Query params:
 * - nombre (string): Nombre del usuario
 * - fecha_nacimiento (string): Fecha de nacimiento en formato ISO (YYYY-MM-DD)
 * - guardian (string): Nombre del guardián
 * - volvio (string): "true" si el usuario volvió a la página (opcional)
 *
 * Calcula automáticamente:
 * - diaSemana: Día de la semana actual (0-6)
 * - hora: Hora actual (0-23)
 *
 * Respuesta:
 * {
 *   success: true,
 *   sincronicidad: {
 *     tipo: string,
 *     mensaje: string,
 *     datos: object
 *   }
 * }
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);

    // Obtener parámetros
    const nombre = searchParams.get('nombre') || '';
    const fechaNacimiento = searchParams.get('fecha_nacimiento') || null;
    const guardian = searchParams.get('guardian') || '';
    const volvio = searchParams.get('volvio') === 'true';

    // Calcular día de la semana y hora automáticamente
    const ahora = new Date();
    const diaSemana = ahora.getDay(); // 0 = domingo, 6 = sábado
    const hora = ahora.getHours(); // 0-23

    // Validar que al menos tenemos algún dato para generar sincronicidad
    if (!nombre && !fechaNacimiento && !guardian && !volvio) {
      return Response.json({
        success: false,
        error: 'Se requiere al menos un parámetro: nombre, fecha_nacimiento, guardian o volvio'
      }, { status: 400, headers: corsHeaders });
    }

    // Generar sincronicidad
    const sincronicidad = generarSincronicidad({
      nombre,
      fechaNacimiento,
      guardian,
      diaSemana,
      hora,
      volvioAPagina: volvio
    });

    return Response.json({
      success: true,
      sincronicidad,
      meta: {
        timestamp: ahora.toISOString(),
        diaSemana,
        hora
      }
    }, { headers: corsHeaders });

  } catch (error) {
    console.error('Error en API sincronicidad:', error);
    return Response.json({
      success: false,
      error: error.message
    }, { status: 500, headers: corsHeaders });
  }
}
