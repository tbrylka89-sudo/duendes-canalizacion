import { kv } from '@vercel/kv';

export const dynamic = 'force-dynamic';

const WOO_URL = process.env.WORDPRESS_URL || 'https://duendesdeluruguay.com';
const WOO_KEY = process.env.WC_CONSUMER_KEY;
const WOO_SECRET = process.env.WC_CONSUMER_SECRET;

function getAuthHeader() {
  if (!WOO_KEY || !WOO_SECRET) {
    throw new Error('Credenciales de WooCommerce no configuradas');
  }
  return `Basic ${Buffer.from(`${WOO_KEY}:${WOO_SECRET}`).toString('base64')}`;
}

// GET - Buscar pedido por número y devolver datos consolidados
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const orden = searchParams.get('orden');

    if (!orden) {
      return Response.json({ success: false, error: 'Número de pedido requerido' }, { status: 400 });
    }

    // 1. Obtener orden de WooCommerce
    const wcRes = await fetch(
      `${WOO_URL}/wp-json/wc/v3/orders/${orden}`,
      {
        headers: {
          'Authorization': getAuthHeader(),
          'Content-Type': 'application/json'
        }
      }
    );

    if (!wcRes.ok) {
      if (wcRes.status === 404) {
        return Response.json({ success: false, error: `Pedido #${orden} no encontrado` }, { status: 404 });
      }
      return Response.json({ success: false, error: `Error al consultar WooCommerce (${wcRes.status})` }, { status: 500 });
    }

    const orderData = await wcRes.json();

    // 2. Extraer datos relevantes
    const email = orderData.billing?.email || '';
    const nombre = `${orderData.billing?.first_name || ''} ${orderData.billing?.last_name || ''}`.trim();

    // Buscar meta del tipo destinatario
    const tipoMeta = orderData.meta_data?.find(m => m.key === '_duendes_tipo_destinatario');
    const tipoDestinatario = tipoMeta?.value || null;

    // Buscar datos de canalización ya guardados
    const datosCanalizacionMeta = orderData.meta_data?.find(m => m.key === '_duendes_datos_canalizacion');
    let datosCanalizacion = null;
    if (datosCanalizacionMeta?.value) {
      try {
        datosCanalizacion = typeof datosCanalizacionMeta.value === 'string'
          ? JSON.parse(datosCanalizacionMeta.value)
          : datosCanalizacionMeta.value;
      } catch { /* ignorar parse errors */ }
    }

    const formularioCompletadoMeta = orderData.meta_data?.find(m => m.key === '_duendes_formulario_completado');
    const formularioCompletado = formularioCompletadoMeta?.value === 'yes';

    // 3. Extraer items del pedido
    const items = orderData.line_items?.map(item => ({
      id: item.id,
      product_id: item.product_id,
      nombre: item.name,
      cantidad: item.quantity,
      total: item.total,
      imagen: item.image?.src || null
    })) || [];

    // 4. Buscar canalizaciones existentes en KV para esta orden
    const todasIds = await kv.get('canalizaciones:todas') || [];
    const canalizacionesOrden = [];

    for (const id of todasIds) {
      const canal = await kv.get(`canalizacion:${id}`);
      if (canal && String(canal.ordenId) === String(orden)) {
        canalizacionesOrden.push({
          id,
          estado: canal.estado,
          guardian: canal.guardian?.nombre || canal.productoManual?.nombre || 'Sin nombre',
          productId: canal.guardian?.id || canal.productoManual?.id || null,
          formCompletado: canal.formCompletado || false,
          formToken: canal.formToken || null,
          createdAt: canal.createdAt
        });
      }
    }

    // 5. Buscar invitaciones de formulario para este email
    const formInvites = await kv.get(`form_invites:${email}`) || [];
    const invitacionesOrden = [];
    for (const token of formInvites.slice(0, 20)) {
      const inv = await kv.get(`form_invite:${token}`);
      if (inv && String(inv.ordenId) === String(orden)) {
        invitacionesOrden.push({
          token,
          formType: inv.formType,
          status: inv.status,
          createdAt: inv.createdAt,
          completedAt: inv.completedAt
        });
      }
    }

    return Response.json({
      success: true,
      pedido: {
        id: orderData.id,
        numero: orderData.number,
        estado: orderData.status,
        fecha: orderData.date_created,
        total: orderData.total,
        moneda: orderData.currency,
        email,
        nombre,
        tipoDestinatario,
        formularioCompletado,
        datosCanalizacion,
        items,
        canalizaciones: canalizacionesOrden,
        invitaciones: invitacionesOrden
      }
    });

  } catch (error) {
    console.error('[POR-PEDIDO] Error:', error);
    return Response.json({
      success: false,
      error: error.message || 'Error interno'
    }, { status: 500 });
  }
}
