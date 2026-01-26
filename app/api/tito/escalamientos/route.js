/**
 * Endpoint para gestionar escalamientos de Tito a humanos
 *
 * GET - Ver escalamientos pendientes
 * POST - Marcar escalamiento como atendido
 */

import { kv } from '@vercel/kv';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
  return new Response(null, { headers: CORS_HEADERS });
}

// GET - Ver escalamientos pendientes
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const ticketId = searchParams.get('id');
    const soloUrgentes = searchParams.get('urgentes') === 'true';

    // Si piden un ticket específico
    if (ticketId) {
      const ticket = await kv.get(`escalamiento:${ticketId}`);
      if (!ticket) {
        return Response.json({
          success: false,
          error: 'Ticket no encontrado'
        }, { status: 404, headers: CORS_HEADERS });
      }
      return Response.json({
        success: true,
        ticket
      }, { headers: CORS_HEADERS });
    }

    // Lista de pendientes
    let pendientes = await kv.get('escalamientos:pendientes') || [];

    // Filtrar urgentes si se pide
    if (soloUrgentes) {
      pendientes = pendientes.filter(p => p.urgente);
    }

    // Obtener detalles completos de los primeros 20
    const ticketsCompletos = await Promise.all(
      pendientes.slice(0, 20).map(async (p) => {
        const ticket = await kv.get(`escalamiento:${p.id}`);
        return ticket || p;
      })
    );

    return Response.json({
      success: true,
      total: pendientes.length,
      urgentes: pendientes.filter(p => p.urgente).length,
      escalamientos: ticketsCompletos
    }, { headers: CORS_HEADERS });

  } catch (error) {
    console.error('[Escalamientos GET] Error:', error);
    return Response.json({
      success: false,
      error: error.message
    }, { status: 500, headers: CORS_HEADERS });
  }
}

// POST - Actualizar estado de escalamiento
export async function POST(request) {
  try {
    const { ticketId, accion, notas } = await request.json();

    if (!ticketId || !accion) {
      return Response.json({
        success: false,
        error: 'Se requiere ticketId y accion'
      }, { status: 400, headers: CORS_HEADERS });
    }

    const ticket = await kv.get(`escalamiento:${ticketId}`);
    if (!ticket) {
      return Response.json({
        success: false,
        error: 'Ticket no encontrado'
      }, { status: 404, headers: CORS_HEADERS });
    }

    // Actualizar según acción
    switch (accion) {
      case 'atender':
        ticket.estado = 'en_proceso';
        ticket.fechaAtendido = new Date().toISOString();
        break;

      case 'resolver':
        ticket.estado = 'resuelto';
        ticket.fechaResuelto = new Date().toISOString();
        ticket.notas = notas || '';
        break;

      case 'descartar':
        ticket.estado = 'descartado';
        ticket.fechaDescartado = new Date().toISOString();
        ticket.notas = notas || '';
        break;

      default:
        return Response.json({
          success: false,
          error: 'Acción no válida. Usar: atender, resolver, descartar'
        }, { status: 400, headers: CORS_HEADERS });
    }

    // Guardar ticket actualizado
    await kv.set(`escalamiento:${ticketId}`, ticket);

    // Si se resolvió/descartó, quitar de pendientes
    if (['resuelto', 'descartado'].includes(ticket.estado)) {
      const pendientes = await kv.get('escalamientos:pendientes') || [];
      const nuevosPendientes = pendientes.filter(p => p.id !== ticketId);
      await kv.set('escalamientos:pendientes', nuevosPendientes);
    }

    return Response.json({
      success: true,
      mensaje: `Ticket ${ticketId} actualizado: ${ticket.estado}`,
      ticket
    }, { headers: CORS_HEADERS });

  } catch (error) {
    console.error('[Escalamientos POST] Error:', error);
    return Response.json({
      success: false,
      error: error.message
    }, { status: 500, headers: CORS_HEADERS });
  }
}
