import { kv } from '@vercel/kv';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function OPTIONS() {
  return new Response(null, { status: 200, headers: corsHeaders });
}

// ═══════════════════════════════════════════════════════════════
// GENERAR TARJETA QR PARA IMPRIMIR
// Se genera cuando alguien compra un guardián
// ═══════════════════════════════════════════════════════════════

export async function POST(request) {
  try {
    const body = await request.json();
    const { ordenId, email, nombreCliente, guardian } = body;

    if (!ordenId || !guardian) {
      return Response.json({
        success: false,
        error: 'Datos incompletos'
      }, { status: 400, headers: corsHeaders });
    }

    // Generar código único para este guardián + comprador
    const fecha = new Date();
    const codigoQR = `DU${fecha.getFullYear().toString().slice(-2)}${(fecha.getMonth()+1).toString().padStart(2,'0')}-${guardian.id.toString().padStart(5,'0')}-${ordenId}`;

    // URL que contendrá el QR
    const urlMiMagia = `https://duendesdeluruguay.com/mi-magia?codigo=${codigoQR}&email=${encodeURIComponent(email)}`;

    // Guardar tarjeta en KV
    const tarjeta = {
      id: `tarjeta_${ordenId}_${guardian.id}`,
      ordenId,
      email,
      nombreCliente,
      guardian: {
        id: guardian.id,
        nombre: guardian.nombre,
        categoria: guardian.categoria,
        imagen: guardian.imagen
      },
      codigoQR,
      urlMiMagia,
      fechaCompra: fecha.toISOString(),
      impresa: false
    };

    await kv.set(`tarjeta:${tarjeta.id}`, tarjeta);

    // Agregar a lista de tarjetas pendientes de imprimir
    const pendientes = await kv.get('tarjetas:pendientes') || [];
    pendientes.unshift(tarjeta.id);
    await kv.set('tarjetas:pendientes', pendientes);

    return Response.json({
      success: true,
      tarjeta,
      codigoQR,
      urlMiMagia
    }, { headers: corsHeaders });

  } catch (error) {
    console.error('Error generando tarjeta QR:', error);
    return Response.json({
      success: false,
      error: error.message
    }, { status: 500, headers: corsHeaders });
  }
}

// GET - Obtener tarjetas pendientes de imprimir
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const tarjetaId = searchParams.get('id');
    const codigoQR = searchParams.get('codigo');

    // Si piden una tarjeta específica por ID
    if (tarjetaId) {
      const tarjeta = await kv.get(`tarjeta:${tarjetaId}`);
      if (!tarjeta) {
        return Response.json({
          success: false,
          error: 'Tarjeta no encontrada'
        }, { status: 404, headers: corsHeaders });
      }
      return Response.json({ success: true, tarjeta }, { headers: corsHeaders });
    }

    // Si buscan por código QR
    if (codigoQR) {
      const pendientesIds = await kv.get('tarjetas:pendientes') || [];

      for (const id of pendientesIds) {
        const tarjeta = await kv.get(`tarjeta:${id}`);
        if (tarjeta && tarjeta.codigoQR === codigoQR) {
          return Response.json({ success: true, tarjeta }, { headers: corsHeaders });
        }
      }

      return Response.json({
        success: false,
        error: 'Tarjeta no encontrada con ese código'
      }, { status: 404, headers: corsHeaders });
    }

    // Obtener todas las pendientes
    const pendientesIds = await kv.get('tarjetas:pendientes') || [];
    const tarjetas = [];

    for (const id of pendientesIds.slice(0, 50)) { // Máximo 50
      const tarjeta = await kv.get(`tarjeta:${id}`);
      if (tarjeta && !tarjeta.impresa) {
        tarjetas.push(tarjeta);
      }
    }

    return Response.json({
      success: true,
      tarjetas,
      total: tarjetas.length
    }, { headers: corsHeaders });

  } catch (error) {
    console.error('Error obteniendo tarjetas:', error);
    return Response.json({
      success: false,
      error: error.message
    }, { status: 500, headers: corsHeaders });
  }
}
