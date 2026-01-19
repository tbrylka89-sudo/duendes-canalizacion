/**
 * Endpoint de prueba para ManyChat Dynamic Block
 * Devuelve respuesta simple para diagnosticar problemas
 */

export async function POST(request) {
  try {
    const body = await request.json();
    const { mensaje, nombre } = body;

    console.log('[TEST-DYNAMIC] Recibido:', { mensaje, nombre });

    // Respuesta ManyChat Dynamic Block v2 - formato más simple posible
    return Response.json({
      version: "v2",
      content: {
        messages: [
          {
            type: "text",
            text: `Hola ${nombre || 'amigo'}! Recibí tu mensaje: "${mensaje || 'vacío'}"`
          }
        ]
      }
    });

  } catch (error) {
    console.error('[TEST-DYNAMIC] Error:', error);
    return Response.json({
      version: "v2",
      content: {
        messages: [
          { type: "text", text: "Error en el servidor" }
        ]
      }
    });
  }
}

export async function GET() {
  return Response.json({
    status: "ok",
    endpoint: "Test Dynamic Block",
    uso: "POST con {mensaje, nombre}"
  });
}
