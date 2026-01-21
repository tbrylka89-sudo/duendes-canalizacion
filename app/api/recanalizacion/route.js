import { kv } from '@vercel/kv';

// ═══════════════════════════════════════════════════════════════════════════════
// API DE RECANALIZACIONES
// Permite a usuarios solicitar una nueva canalización para su guardián
// ═══════════════════════════════════════════════════════════════════════════════

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function OPTIONS() {
  return new Response(null, { status: 200, headers: corsHeaders });
}

// GET - Verificar si un email es cliente existente
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email')?.toLowerCase();
  const accion = searchParams.get('accion');

  if (accion === 'verificar-cliente' && email) {
    try {
      // Buscar en usuarios registrados
      const usuario = await kv.get(`usuario:${email}`);

      // También buscar en órdenes (si el email tiene alguna compra)
      const ordenes = await kv.get('wp:ventas:recientes') || [];
      const tieneCompra = ordenes.some(o =>
        o.email?.toLowerCase() === email ||
        o.billing_email?.toLowerCase() === email
      );

      // Es cliente si tiene usuario O tiene compras
      const esCliente = !!usuario || tieneCompra;

      return Response.json({
        success: true,
        esCliente,
        tieneCirculo: usuario?.esCirculo || false,
        // Si es cliente, la recanalización es gratuita (incluida con la compra)
        // Si no es cliente, debe pagar
        requierePago: !esCliente,
        precioRecanalizacion: esCliente ? 0 : 25, // USD
        mensaje: esCliente
          ? '¡Sos parte de nuestra familia! Tu recanalización es gratuita.'
          : 'Para solicitar una recanalización necesitás haber comprado un guardián o pagar el servicio.'
      }, { headers: corsHeaders });

    } catch (error) {
      return Response.json({
        success: false,
        error: error.message
      }, { status: 500, headers: corsHeaders });
    }
  }

  // Obtener solicitudes de un email específico
  if (accion === 'mis-solicitudes' && email) {
    try {
      const keys = await kv.keys('recanalizacion:*');
      const misSolicitudes = [];

      for (const key of keys) {
        const r = await kv.get(key);
        if (r?.emailCliente?.toLowerCase() === email) {
          misSolicitudes.push({
            id: r.id,
            estado: r.estado,
            productoOriginal: r.productoOriginal,
            creadaEn: r.creadaEn,
            mensaje: r.mensaje || null
          });
        }
      }

      return Response.json({
        success: true,
        solicitudes: misSolicitudes
      }, { headers: corsHeaders });

    } catch (error) {
      return Response.json({
        success: false,
        error: error.message
      }, { status: 500, headers: corsHeaders });
    }
  }

  return Response.json({
    success: true,
    info: 'API de Recanalizaciones - Duendes del Uruguay',
    acciones: ['verificar-cliente', 'mis-solicitudes'],
    uso: '?accion=verificar-cliente&email=tu@email.com'
  }, { headers: corsHeaders });
}

// POST - Crear solicitud de recanalización
export async function POST(request) {
  try {
    const data = await request.json();

    const {
      email,
      nombre,
      productoOriginal,
      nombreGuardian,
      motivo,
      fotoUrl, // URL de la foto subida (si aplica)
      preguntasRespuestas, // Respuestas al formulario
      pagoConfirmado, // Si ya pagó (para no-clientes)
      pagoId // ID de transacción si pagó
    } = data;

    // Validaciones básicas
    if (!email || !nombre) {
      return Response.json({
        success: false,
        error: 'Email y nombre son requeridos'
      }, { status: 400, headers: corsHeaders });
    }

    // Verificar si es cliente
    const usuario = await kv.get(`usuario:${email.toLowerCase()}`);
    const ordenes = await kv.get('wp:ventas:recientes') || [];
    const tieneCompra = ordenes.some(o =>
      o.email?.toLowerCase() === email.toLowerCase() ||
      o.billing_email?.toLowerCase() === email.toLowerCase()
    );
    const esCliente = !!usuario || tieneCompra;

    // Si no es cliente y no pagó, rechazar
    if (!esCliente && !pagoConfirmado) {
      return Response.json({
        success: false,
        requierePago: true,
        precioRecanalizacion: 25,
        mensaje: 'Para solicitar una recanalización sin ser cliente, necesitás realizar el pago primero.',
        urlPago: 'https://duendesdeluruguay.com/recanalización/' // URL a página de pago
      }, { status: 402, headers: corsHeaders });
    }

    // Crear la solicitud
    const id = `recan_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

    const solicitud = {
      id,
      emailCliente: email.toLowerCase(),
      nombreCliente: nombre,
      productoOriginal: productoOriginal || 'No especificado',
      nombreGuardian: nombreGuardian || null,
      motivo: motivo || 'Solicitud de nueva canalización',
      fotoUrl: fotoUrl || null,
      preguntasRespuestas: preguntasRespuestas || {},
      esCliente,
      pagoConfirmado: esCliente ? true : pagoConfirmado,
      pagoId: pagoId || null,
      estado: 'pendiente',
      creadaEn: new Date().toISOString(),
      fuente: 'formulario-web'
    };

    await kv.set(`recanalizacion:${id}`, solicitud);

    // Notificar al admin (agregar a cola de notificaciones)
    const notificaciones = await kv.get('admin:notificaciones') || [];
    notificaciones.unshift({
      tipo: 'recanalizacion',
      mensaje: `Nueva solicitud de recanalización de ${nombre} (${email})`,
      id,
      fecha: new Date().toISOString(),
      leida: false
    });
    await kv.set('admin:notificaciones', notificaciones.slice(0, 100));

    return Response.json({
      success: true,
      mensaje: esCliente
        ? '¡Solicitud recibida! Como parte de nuestra familia, procesaremos tu recanalización pronto.'
        : '¡Pago confirmado y solicitud recibida! Procesaremos tu recanalización pronto.',
      id,
      estado: 'pendiente',
      tiempoEstimado: '3-5 días hábiles'
    }, { headers: corsHeaders });

  } catch (error) {
    console.error('[RECANALIZACION] Error:', error);
    return Response.json({
      success: false,
      error: error.message
    }, { status: 500, headers: corsHeaders });
  }
}
