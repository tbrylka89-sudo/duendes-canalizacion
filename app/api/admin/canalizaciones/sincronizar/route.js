import { kv } from '@vercel/kv';

export const dynamic = 'force-dynamic';

const WOO_URL = process.env.WORDPRESS_URL || 'https://duendesdeluruguay.com';
const WOO_KEY = process.env.WC_CONSUMER_KEY;
const WOO_SECRET = process.env.WC_CONSUMER_SECRET;

// ═══════════════════════════════════════════════════════════════
// SINCRONIZAR DATOS DE FORMULARIO DESDE WORDPRESS A VERCEL KV
// Usado para sincronización manual si el webhook falló
// ═══════════════════════════════════════════════════════════════

function getAuthHeader() {
  if (!WOO_KEY || !WOO_SECRET) {
    throw new Error('Credenciales de WooCommerce no configuradas');
  }
  return `Basic ${Buffer.from(`${WOO_KEY}:${WOO_SECRET}`).toString('base64')}`;
}

// POST - Sincronizar una orden específica
export async function POST(request) {
  try {
    const body = await request.json();
    const { ordenId } = body;

    if (!ordenId) {
      return Response.json({ success: false, error: 'ordenId requerido' }, { status: 400 });
    }

    console.log(`[SYNC] Iniciando sincronización manual de orden #${ordenId}`);

    // 1. Obtener orden de WooCommerce
    const wcRes = await fetch(
      `${WOO_URL}/wp-json/wc/v3/orders/${ordenId}`,
      {
        headers: {
          'Authorization': getAuthHeader(),
          'Content-Type': 'application/json'
        }
      }
    );

    if (!wcRes.ok) {
      return Response.json({
        success: false,
        error: `Error al consultar WooCommerce (${wcRes.status})`
      }, { status: 500 });
    }

    const orderData = await wcRes.json();

    // 2. Buscar datos de canalización en meta
    const tipoMeta = orderData.meta_data?.find(m => m.key === '_duendes_tipo_destinatario');
    const datosCanalizacionMeta = orderData.meta_data?.find(m => m.key === '_duendes_datos_canalizacion');
    const formularioCompletadoMeta = orderData.meta_data?.find(m => m.key === '_duendes_formulario_completado');

    const tipoDestinatario = tipoMeta?.value || null;
    const formularioCompletado = formularioCompletadoMeta?.value === 'yes';

    if (!formularioCompletado || !datosCanalizacionMeta?.value) {
      return Response.json({
        success: false,
        error: 'El formulario no ha sido completado en WordPress',
        estado: {
          tipoDestinatario,
          formularioCompletado,
          tieneDatos: !!datosCanalizacionMeta?.value
        }
      }, { status: 400 });
    }

    // 3. Parsear datos
    let datosCanalizacion;
    try {
      datosCanalizacion = typeof datosCanalizacionMeta.value === 'string'
        ? JSON.parse(datosCanalizacionMeta.value)
        : datosCanalizacionMeta.value;
    } catch (e) {
      return Response.json({
        success: false,
        error: 'Error parseando datos del formulario: ' + e.message
      }, { status: 500 });
    }

    const email = orderData.billing?.email || '';
    const nombre = `${orderData.billing?.first_name || ''} ${orderData.billing?.last_name || ''}`.trim();

    // 4. Guardar en KV (misma estructura que el webhook)
    const formDataKey = `form_data:orden:${ordenId}`;
    const formData = {
      ordenId: parseInt(ordenId),
      tipo: tipoDestinatario,
      datos: datosCanalizacion,
      email,
      nombre,
      guardianes: orderData.line_items?.map(i => i.name) || [],
      recibidoEn: new Date().toISOString(),
      procesado: false,
      origen: 'sincronizacion_manual'
    };

    await kv.set(formDataKey, formData);
    console.log(`[SYNC] Datos guardados en ${formDataKey}`);

    // 5. Actualizar canalizaciones existentes
    const pendientes = await kv.get('canalizaciones:pendientes') || [];
    const borradores = await kv.get('canalizaciones:borradores') || [];
    const todasIds = [...pendientes, ...borradores];

    let canalizacionesActualizadas = 0;

    for (const canalizacionId of todasIds) {
      const canalizacion = await kv.get(`canalizacion:${canalizacionId}`);

      if (canalizacion && String(canalizacion.ordenId) === String(ordenId)) {
        canalizacion.formData = formData;
        canalizacion.tipoFormulario = tipoDestinatario;
        canalizacion.formularioCompletado = true;
        canalizacion.formularioRecibidoEn = new Date().toISOString();
        canalizacion.sincronizadoManualmente = true;

        // Si estaba en borrador, moverla a pendiente
        if (canalizacion.estado === 'borrador') {
          canalizacion.estado = 'pendiente';

          const nuevosBorradores = borradores.filter(id => id !== canalizacionId);
          await kv.set('canalizaciones:borradores', nuevosBorradores);

          if (!pendientes.includes(canalizacionId)) {
            pendientes.push(canalizacionId);
            await kv.set('canalizaciones:pendientes', pendientes);
          }
        }

        await kv.set(`canalizacion:${canalizacionId}`, canalizacion);
        canalizacionesActualizadas++;

        console.log(`[SYNC] Canalización ${canalizacionId} actualizada`);
      }
    }

    // 6. Marcar como procesado
    formData.procesado = true;
    formData.canalizacionesActualizadas = canalizacionesActualizadas;
    await kv.set(formDataKey, formData);

    // 7. Registrar en log
    await kv.set(`log:sync:${ordenId}`, {
      ordenId,
      email,
      tipoDestinatario,
      sincronizadoEn: new Date().toISOString(),
      canalizacionesActualizadas,
      origen: 'manual'
    }, { ex: 30 * 24 * 60 * 60 });

    return Response.json({
      success: true,
      ordenId,
      email,
      tipoDestinatario,
      canalizacionesActualizadas,
      datosResumen: {
        nombre: datosCanalizacion.nombre,
        momento: datosCanalizacion.momento?.substring(0, 100),
        necesidades: datosCanalizacion.necesidades,
        tieneFoto: !!datosCanalizacion.foto_url
      },
      mensaje: canalizacionesActualizadas > 0
        ? `Sincronizado: ${canalizacionesActualizadas} canalización(es) actualizadas`
        : 'Datos sincronizados, pero no había canalizaciones pendientes para esta orden'
    });

  } catch (error) {
    console.error('[SYNC] Error:', error);
    return Response.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}

// GET - Ver estado de sincronización
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const ordenId = searchParams.get('orden');

    if (ordenId) {
      // Ver estado de una orden específica
      const formDataKV = await kv.get(`form_data:orden:${ordenId}`);
      const logSync = await kv.get(`log:sync:${ordenId}`);

      return Response.json({
        ordenId,
        sincronizado: !!formDataKV,
        datos: formDataKV,
        log: logSync
      });
    }

    // Listar últimas sincronizaciones
    const listasParaProcesar = await kv.get('canalizaciones:listas_para_procesar') || [];

    return Response.json({
      status: 'active',
      endpoint: '/api/admin/canalizaciones/sincronizar',
      descripcion: 'Sincroniza datos de formulario desde WordPress a Vercel KV',
      uso: {
        POST: 'Sincronizar orden específica: { "ordenId": 123 }',
        GET: 'Ver estado: ?orden=123'
      },
      ultimasSincronizaciones: listasParaProcesar.slice(-10)
    });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
