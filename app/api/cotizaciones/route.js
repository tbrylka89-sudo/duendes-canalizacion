/**
 * API de Cotizaciones
 * GET - Ver cotizaciones actuales
 * POST - Forzar actualización
 * Updated: 2026-01-25
 */

import { obtenerCotizaciones, forzarActualizacion } from '@/lib/tito/cotizaciones';

export async function GET() {
  const cotizaciones = await obtenerCotizaciones();

  return Response.json({
    success: true,
    cotizaciones,
    nota: 'Las cotizaciones se actualizan cada 6 horas automáticamente'
  });
}

export async function POST() {
  const cotizaciones = await forzarActualizacion();

  return Response.json({
    success: true,
    mensaje: 'Cotizaciones actualizadas',
    cotizaciones
  });
}
