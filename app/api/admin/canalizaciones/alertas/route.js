import { kv } from '@vercel/kv';

export const dynamic = 'force-dynamic';

const WOO_URL = process.env.WORDPRESS_URL || 'https://duendesdeluruguay.com';
const WOO_KEY = process.env.WC_CONSUMER_KEY;
const WOO_SECRET = process.env.WC_CONSUMER_SECRET;

// ═══════════════════════════════════════════════════════════════
// ALERTAS DE CANALIZACIONES
// Muestra órdenes con problemas de sincronización
// ═══════════════════════════════════════════════════════════════

function getAuthHeader() {
  return `Basic ${Buffer.from(`${WOO_KEY}:${WOO_SECRET}`).toString('base64')}`;
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const accion = searchParams.get('accion') || 'resumen';

    // Obtener últimas 50 órdenes de WooCommerce
    const wcRes = await fetch(
      `${WOO_URL}/wp-json/wc/v3/orders?per_page=50&status=processing,completed`,
      {
        headers: {
          'Authorization': getAuthHeader(),
          'Content-Type': 'application/json'
        }
      }
    );

    if (!wcRes.ok) {
      return Response.json({ error: 'Error conectando con WooCommerce' }, { status: 500 });
    }

    const ordenes = await wcRes.json();

    // Clasificar órdenes
    const alertas = {
      sinFormulario: [],           // Cliente no completó formulario
      pendienteSincronizacion: [], // Formulario completado pero no sincronizado
      sinCanalizacion: [],         // No hay canalización creada
      listas: []                   // Todo OK
    };

    for (const orden of ordenes) {
      const ordenId = orden.id;
      const email = orden.billing?.email;
      const nombre = `${orden.billing?.first_name || ''} ${orden.billing?.last_name || ''}`.trim();
      const fecha = new Date(orden.date_created).toLocaleDateString('es-UY');

      // Ver si tiene productos que necesitan canalización (excluir runas, membresías)
      const tieneGuardianes = orden.line_items?.some(item => {
        const sku = item.sku?.toLowerCase() || '';
        return !sku.includes('runas') && !sku.includes('circulo') && !sku.includes('lectura');
      });

      if (!tieneGuardianes) continue;

      // Buscar meta datos
      const tipoMeta = orden.meta_data?.find(m => m.key === '_duendes_tipo_destinatario');
      const completadoMeta = orden.meta_data?.find(m => m.key === '_duendes_formulario_completado');
      const sincronizadoMeta = orden.meta_data?.find(m => m.key === '_duendes_sincronizado_vercel');

      const tipoDestinatario = tipoMeta?.value || null;
      const formularioCompletado = completadoMeta?.value === 'yes';
      const sincronizadoWP = sincronizadoMeta?.value === 'yes';

      // Buscar en KV
      const formDataKV = await kv.get(`form_data:orden:${ordenId}`);
      const sincronizadoKV = !!formDataKV;

      // Buscar canalizaciones
      const todasIds = await kv.get('canalizaciones:todas') || [];
      let tieneCanalizacion = false;
      for (const id of todasIds) {
        const canal = await kv.get(`canalizacion:${id}`);
        if (canal && String(canal.ordenId) === String(ordenId)) {
          tieneCanalizacion = true;
          break;
        }
      }

      const item = {
        ordenId,
        numero: orden.number,
        email,
        nombre,
        fecha,
        tipoDestinatario,
        productos: orden.line_items?.map(i => i.name).slice(0, 3)
      };

      // Clasificar
      if (!formularioCompletado) {
        alertas.sinFormulario.push(item);
      } else if (formularioCompletado && !sincronizadoKV) {
        alertas.pendienteSincronizacion.push(item);
      } else if (!tieneCanalizacion) {
        alertas.sinCanalizacion.push(item);
      } else {
        alertas.listas.push(item);
      }
    }

    // Resumen
    const resumen = {
      total: ordenes.length,
      conGuardianes: alertas.sinFormulario.length + alertas.pendienteSincronizacion.length + alertas.sinCanalizacion.length + alertas.listas.length,
      problemas: alertas.sinFormulario.length + alertas.pendienteSincronizacion.length,
      sinFormulario: alertas.sinFormulario.length,
      pendienteSincronizacion: alertas.pendienteSincronizacion.length,
      sinCanalizacion: alertas.sinCanalizacion.length,
      listas: alertas.listas.length
    };

    if (accion === 'resumen') {
      return Response.json({
        success: true,
        resumen,
        hayProblemas: resumen.problemas > 0
      });
    }

    // Detalle completo
    return Response.json({
      success: true,
      resumen,
      alertas,
      hayProblemas: resumen.problemas > 0
    });

  } catch (error) {
    console.error('[ALERTAS] Error:', error);
    return Response.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
