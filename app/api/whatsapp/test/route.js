/**
 * ENDPOINT DE PRUEBA - Solo devuelve texto fijo
 * Para debuggear ManyChat
 */

export const runtime = 'edge';

export async function POST(request) {
  // Log para ver qué llega
  let body = {};
  try {
    body = await request.json();
  } catch (e) {
    body = { error: 'no body' };
  }

  console.log('[WHATSAPP TEST]', JSON.stringify(body));

  // Respuesta simple y fija
  return Response.json({
    respuesta_tito: "Hola! Este es un mensaje de prueba. Si ves esto, ManyChat funciona correctamente.",
    test: true,
    recibido: body
  });
}

export async function GET() {
  return Response.json({
    status: 'ok',
    mensaje: 'Endpoint de prueba para ManyChat'
  });
}
