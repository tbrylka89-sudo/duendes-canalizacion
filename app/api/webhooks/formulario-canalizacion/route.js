import { kv } from '@vercel/kv';
import { Resend } from 'resend';

export const dynamic = 'force-dynamic';

// ═══════════════════════════════════════════════════════════════
// WEBHOOK: FORMULARIO DE CANALIZACIÓN COMPLETADO
//
// Este endpoint recibe notificaciones de WordPress cuando un cliente
// completa el formulario de canalización en la Thank You page.
// Sincroniza los datos del formulario con las canalizaciones en Vercel KV.
// ═══════════════════════════════════════════════════════════════

const WEBHOOK_SECRET = process.env.DUENDES_FORMULARIO_SECRET || 'duendes_form_2026_secret';

export async function POST(request) {
  try {
    const body = await request.json();

    // Verificar token de seguridad
    const token = request.headers.get('x-duendes-token') || body.token;
    if (token !== WEBHOOK_SECRET) {
      console.log('[FORM-WEBHOOK] Token inválido');
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const {
      order_id,
      tipo_formulario,
      datos,
      email_cliente,
      nombre_cliente,
      guardians // Array de nombres de guardianes en la orden
    } = body;

    if (!order_id || !datos) {
      return Response.json({ error: 'Faltan datos requeridos' }, { status: 400 });
    }

    console.log(`[FORM-WEBHOOK] Formulario recibido para orden #${order_id}`);
    console.log(`[FORM-WEBHOOK] Tipo: ${tipo_formulario}, Cliente: ${nombre_cliente} <${email_cliente}>`);

    // ═══════════════════════════════════════════════════════════
    // 1. GUARDAR DATOS DEL FORMULARIO EN KV
    // ═══════════════════════════════════════════════════════════

    const formDataKey = `form_data:orden:${order_id}`;
    const formData = {
      ordenId: order_id,
      tipo: tipo_formulario,
      datos,
      email: email_cliente,
      nombre: nombre_cliente,
      guardianes: guardians || [],
      recibidoEn: new Date().toISOString(),
      procesado: false
    };

    await kv.set(formDataKey, formData);
    console.log(`[FORM-WEBHOOK] Datos guardados en ${formDataKey}`);

    // ═══════════════════════════════════════════════════════════
    // 2. BUSCAR CANALIZACIONES PENDIENTES DE ESTA ORDEN
    // ═══════════════════════════════════════════════════════════

    const pendientes = await kv.get('canalizaciones:pendientes') || [];
    const borradores = await kv.get('canalizaciones:borradores') || [];
    const todasIds = [...pendientes, ...borradores];

    let canalizacionesActualizadas = 0;

    for (const canalizacionId of todasIds) {
      const canalizacion = await kv.get(`canalizacion:${canalizacionId}`);

      if (canalizacion && canalizacion.ordenId === order_id) {
        // Agregar datos del formulario a la canalización
        canalizacion.formData = formData;
        canalizacion.tipoFormulario = tipo_formulario;
        canalizacion.formularioCompletado = true;
        canalizacion.formularioRecibidoEn = new Date().toISOString();

        // Si estaba en borrador, moverla a pendiente para que se pueda procesar
        if (canalizacion.estado === 'borrador') {
          canalizacion.estado = 'pendiente';

          // Actualizar índices
          const nuevosBorradores = borradores.filter(id => id !== canalizacionId);
          await kv.set('canalizaciones:borradores', nuevosBorradores);

          if (!pendientes.includes(canalizacionId)) {
            pendientes.push(canalizacionId);
            await kv.set('canalizaciones:pendientes', pendientes);
          }
        }

        await kv.set(`canalizacion:${canalizacionId}`, canalizacion);
        canalizacionesActualizadas++;

        console.log(`[FORM-WEBHOOK] Canalización ${canalizacionId} actualizada con datos del formulario`);
      }
    }

    // ═══════════════════════════════════════════════════════════
    // 3. MARCAR FORMULARIO COMO PROCESADO
    // ═══════════════════════════════════════════════════════════

    formData.procesado = true;
    formData.canalizacionesActualizadas = canalizacionesActualizadas;
    await kv.set(formDataKey, formData);

    // ═══════════════════════════════════════════════════════════
    // 4. REGISTRAR EN LOG PARA DEBUGGING
    // ═══════════════════════════════════════════════════════════

    const logKey = `log:formulario:${order_id}`;
    await kv.set(logKey, {
      ordenId: order_id,
      email: email_cliente,
      tipo: tipo_formulario,
      recibidoEn: new Date().toISOString(),
      canalizacionesActualizadas,
      datos: {
        nombre: datos.nombre || null,
        momento: datos.momento?.substring(0, 50) || null,
        necesidades: datos.necesidades || [],
        tieneRelacion: !!datos.relacion,
        tieneFoto: !!datos.foto_url
      }
    }, { ex: 30 * 24 * 60 * 60 }); // 30 días

    // ═══════════════════════════════════════════════════════════
    // 5. NOTIFICAR AL ADMIN SI HAY CANALIZACIONES LISTAS
    // ═══════════════════════════════════════════════════════════

    if (canalizacionesActualizadas > 0) {
      // Agregar a lista de canalizaciones con datos listos
      const listasParaProcesar = await kv.get('canalizaciones:listas_para_procesar') || [];
      listasParaProcesar.push({
        ordenId: order_id,
        email: email_cliente,
        nombre: nombre_cliente,
        tipo: tipo_formulario,
        fecha: new Date().toISOString()
      });
      await kv.set('canalizaciones:listas_para_procesar', listasParaProcesar);
    }

    return Response.json({
      success: true,
      ordenId: order_id,
      canalizacionesActualizadas,
      mensaje: canalizacionesActualizadas > 0
        ? `${canalizacionesActualizadas} canalización(es) actualizadas con datos del formulario`
        : 'Datos guardados, no había canalizaciones pendientes para esta orden'
    });

  } catch (error) {
    console.error('[FORM-WEBHOOK] Error:', error);
    return Response.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}

// GET para verificar estado
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const orderId = searchParams.get('orden');

  if (orderId) {
    // Buscar datos del formulario para una orden específica
    const formData = await kv.get(`form_data:orden:${orderId}`);
    const log = await kv.get(`log:formulario:${orderId}`);

    return Response.json({
      ordenId: orderId,
      formularioRecibido: !!formData,
      datos: formData || null,
      log: log || null
    });
  }

  // Mostrar últimos formularios recibidos
  const listasParaProcesar = await kv.get('canalizaciones:listas_para_procesar') || [];

  return Response.json({
    status: 'active',
    endpoint: '/api/webhooks/formulario-canalizacion',
    descripcion: 'Recibe notificaciones cuando un cliente completa el formulario de canalización en WordPress',
    ultimosFormularios: listasParaProcesar.slice(-10),
    uso: {
      POST: 'Enviar datos del formulario completado',
      GET: 'Ver estado. Usar ?orden=123 para ver datos de una orden específica'
    }
  });
}
