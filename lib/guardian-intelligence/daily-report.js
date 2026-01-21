/**
 * GUARDIAN INTELLIGENCE - REPORTE DIARIO
 * Genera un resumen de todo lo que pasó en el día
 */

import { kv } from '@vercel/kv';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

// ═══════════════════════════════════════════════════════════════
// REGISTRO DE EVENTOS (llamar desde otras partes del sistema)
// ═══════════════════════════════════════════════════════════════

/**
 * Registra un evento para el reporte diario
 */
export async function registrarEvento(tipo, datos = {}) {
  const hoy = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  const key = `gi:eventos:${hoy}`;

  const evento = {
    tipo,
    datos,
    hora: new Date().toISOString()
  };

  try {
    await kv.lpush(key, JSON.stringify(evento));
    // Expirar en 7 días
    await kv.expire(key, 7 * 24 * 60 * 60);
  } catch (error) {
    console.error('[GI Daily] Error registrando evento:', error);
  }
}

// Tipos de eventos predefinidos
export const TIPOS_EVENTO = {
  VENTA: 'venta',
  CHAT_TITO: 'chat_tito',
  ERROR_API: 'error_api',
  HISTORIA_GENERADA: 'historia_generada',
  HISTORIA_APLICADA: 'historia_aplicada',
  ALERTA_CRITICA: 'alerta_critica',
  VISITA_PRODUCTO: 'visita_producto',
  CARRITO_ABANDONADO: 'carrito_abandonado',
  EMAIL_ENVIADO: 'email_enviado',
  PROMOCION_USADA: 'promocion_usada'
};

// ═══════════════════════════════════════════════════════════════
// GENERACIÓN DEL REPORTE DIARIO
// ═══════════════════════════════════════════════════════════════

/**
 * Obtiene todos los eventos de un día
 */
async function obtenerEventosDelDia(fecha = null) {
  const dia = fecha || new Date().toISOString().split('T')[0];
  const key = `gi:eventos:${dia}`;

  try {
    const eventos = await kv.lrange(key, 0, -1) || [];
    return eventos.map(e => typeof e === 'string' ? JSON.parse(e) : e);
  } catch (error) {
    console.error('[GI Daily] Error obteniendo eventos:', error);
    return [];
  }
}

/**
 * Obtiene métricas de WooCommerce del día
 */
async function obtenerMetricasWoo() {
  try {
    const wpUrl = process.env.WORDPRESS_URL || 'https://duendesdeluruguay.com';
    const auth = Buffer.from(
      `${process.env.WC_CONSUMER_KEY}:${process.env.WC_CONSUMER_SECRET}`
    ).toString('base64');

    // Obtener pedidos de hoy
    const hoy = new Date().toISOString().split('T')[0];
    const response = await fetch(
      `${wpUrl}/wp-json/wc/v3/orders?after=${hoy}T00:00:00&status=any&per_page=100`,
      { headers: { 'Authorization': `Basic ${auth}` } }
    );

    if (!response.ok) {
      return { error: 'No se pudo conectar con WooCommerce' };
    }

    const pedidos = await response.json();

    // Calcular métricas
    const completados = pedidos.filter(p => p.status === 'completed' || p.status === 'processing');
    const totalVentas = completados.reduce((sum, p) => sum + parseFloat(p.total), 0);
    const productosVendidos = completados.reduce((sum, p) =>
      sum + p.line_items.reduce((s, item) => s + item.quantity, 0), 0);

    // Top productos vendidos
    const productoCount = {};
    completados.forEach(p => {
      p.line_items.forEach(item => {
        productoCount[item.name] = (productoCount[item.name] || 0) + item.quantity;
      });
    });
    const topProductos = Object.entries(productoCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    return {
      pedidosHoy: pedidos.length,
      pedidosCompletados: completados.length,
      totalVentas: totalVentas.toFixed(2),
      productosVendidos,
      topProductos,
      pendientes: pedidos.filter(p => p.status === 'pending').length,
      fallidos: pedidos.filter(p => p.status === 'failed').length
    };

  } catch (error) {
    return { error: error.message };
  }
}

/**
 * Obtiene estadísticas de Tito del día
 */
async function obtenerMetricasTito() {
  try {
    // Contar chats del día
    const hoy = new Date().toISOString().split('T')[0];
    const chatsKey = `tito:chats:${hoy}`;
    const totalChats = await kv.get(chatsKey) || 0;

    // Obtener temas frecuentes (si se registran)
    const temasKey = `tito:temas:${hoy}`;
    const temas = await kv.hgetall(temasKey) || {};

    return {
      totalChats,
      temasFrecuentes: Object.entries(temas)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
    };
  } catch (error) {
    return { totalChats: 'N/A', error: error.message };
  }
}

/**
 * Verifica el estado de los servicios
 */
async function verificarServicios() {
  const servicios = [];

  // Verificar WooCommerce
  try {
    const wpUrl = process.env.WORDPRESS_URL || 'https://duendesdeluruguay.com';
    const response = await fetch(wpUrl, { method: 'HEAD' });
    servicios.push({ nombre: 'WordPress', ok: response.ok });
  } catch {
    servicios.push({ nombre: 'WordPress', ok: false });
  }

  // Verificar KV
  try {
    await kv.ping();
    servicios.push({ nombre: 'Vercel KV', ok: true });
  } catch {
    servicios.push({ nombre: 'Vercel KV', ok: false });
  }

  // Verificar API keys configuradas
  servicios.push({
    nombre: 'Anthropic API',
    ok: !!process.env.ANTHROPIC_API_KEY
  });
  servicios.push({
    nombre: 'Resend (Emails)',
    ok: !!process.env.RESEND_API_KEY
  });

  return servicios;
}

/**
 * Genera el reporte diario completo
 */
export async function generarReporteDiario(fecha = null) {
  const dia = fecha || new Date().toISOString().split('T')[0];

  // Obtener todos los datos en paralelo
  const [eventos, metricas, tito, servicios] = await Promise.all([
    obtenerEventosDelDia(dia),
    obtenerMetricasWoo(),
    obtenerMetricasTito(),
    verificarServicios()
  ]);

  // Contar eventos por tipo
  const eventosPorTipo = {};
  eventos.forEach(e => {
    eventosPorTipo[e.tipo] = (eventosPorTipo[e.tipo] || 0) + 1;
  });

  // Filtrar errores y alertas
  const errores = eventos.filter(e => e.tipo === 'error_api' || e.tipo === 'alerta_critica');

  const reporte = {
    fecha: dia,
    generadoEn: new Date().toISOString(),

    resumen: {
      ventas: metricas.error ? 'Error obteniendo datos' : {
        pedidos: metricas.pedidosCompletados,
        total: `$${metricas.totalVentas} USD`,
        productos: metricas.productosVendidos
      },
      tito: {
        chats: tito.totalChats
      },
      eventos: {
        total: eventos.length,
        porTipo: eventosPorTipo
      }
    },

    detalles: {
      topProductos: metricas.topProductos || [],
      temasTito: tito.temasFrecuentes || [],
      errores: errores.length,
      listaErrores: errores.slice(0, 10) // Máximo 10
    },

    servicios: {
      todos: servicios,
      todosOk: servicios.every(s => s.ok)
    },

    alertas: []
  };

  // Generar alertas automáticas
  if (!reporte.servicios.todosOk) {
    reporte.alertas.push({
      tipo: 'critico',
      mensaje: `Servicios caídos: ${servicios.filter(s => !s.ok).map(s => s.nombre).join(', ')}`
    });
  }
  if (metricas.fallidos > 0) {
    reporte.alertas.push({
      tipo: 'atencion',
      mensaje: `${metricas.fallidos} pedido(s) fallido(s) hoy`
    });
  }
  if (errores.length > 5) {
    reporte.alertas.push({
      tipo: 'atencion',
      mensaje: `${errores.length} errores registrados hoy`
    });
  }

  // Guardar reporte
  await kv.set(`gi:reporte:${dia}`, reporte, { ex: 30 * 24 * 60 * 60 }); // 30 días

  return reporte;
}

// ═══════════════════════════════════════════════════════════════
// ENVÍO DEL REPORTE POR EMAIL
// ═══════════════════════════════════════════════════════════════

/**
 * Genera el HTML del reporte para email
 */
function generarHTMLReporte(reporte) {
  const alertasHTML = reporte.alertas.length > 0
    ? reporte.alertas.map(a => `
        <div style="padding: 10px; margin: 5px 0; background: ${a.tipo === 'critico' ? '#ff4444' : '#ffaa00'}; color: white; border-radius: 5px;">
          ${a.tipo === 'critico' ? '🚨' : '⚠️'} ${a.mensaje}
        </div>
      `).join('')
    : '<p style="color: #00aa00;">✅ Sin alertas</p>';

  const serviciosHTML = reporte.servicios.todos.map(s =>
    `<span style="margin-right: 15px;">${s.ok ? '🟢' : '🔴'} ${s.nombre}</span>`
  ).join('');

  const topProductosHTML = reporte.detalles.topProductos.length > 0
    ? reporte.detalles.topProductos.map(([nombre, qty]) =>
        `<li>${nombre}: ${qty} vendido(s)</li>`
      ).join('')
    : '<li>Sin ventas hoy</li>';

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #1a1a2e; color: #eee; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: #16213e; border-radius: 10px; padding: 20px; }
        h1 { color: #ffd700; border-bottom: 2px solid #ffd700; padding-bottom: 10px; }
        h2 { color: #00d4ff; margin-top: 25px; }
        .metric { display: inline-block; background: #0f3460; padding: 15px; border-radius: 8px; margin: 5px; text-align: center; min-width: 100px; }
        .metric-value { font-size: 24px; font-weight: bold; color: #ffd700; }
        .metric-label { font-size: 12px; color: #888; }
        .servicios { background: #0f3460; padding: 15px; border-radius: 8px; margin-top: 15px; }
        ul { padding-left: 20px; }
        li { margin: 5px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>🧠 Reporte Diario - Guardian Intelligence</h1>
        <p style="color: #888;">Fecha: ${reporte.fecha}</p>

        <h2>📊 Resumen del Día</h2>
        <div>
          <div class="metric">
            <div class="metric-value">${typeof reporte.resumen.ventas === 'object' ? reporte.resumen.ventas.pedidos : '?'}</div>
            <div class="metric-label">Pedidos</div>
          </div>
          <div class="metric">
            <div class="metric-value">${typeof reporte.resumen.ventas === 'object' ? reporte.resumen.ventas.total : '?'}</div>
            <div class="metric-label">Ventas</div>
          </div>
          <div class="metric">
            <div class="metric-value">${reporte.resumen.tito.chats}</div>
            <div class="metric-label">Chats Tito</div>
          </div>
          <div class="metric">
            <div class="metric-value">${reporte.resumen.eventos.total}</div>
            <div class="metric-label">Eventos</div>
          </div>
        </div>

        <h2>🚨 Alertas</h2>
        ${alertasHTML}

        <h2>🔌 Estado de Servicios</h2>
        <div class="servicios">
          ${serviciosHTML}
        </div>

        <h2>🏆 Top Productos del Día</h2>
        <ul>
          ${topProductosHTML}
        </ul>

        ${reporte.detalles.errores > 0 ? `
          <h2>⚠️ Errores Detectados</h2>
          <p>${reporte.detalles.errores} error(es) registrado(s). Revisar el panel para más detalles.</p>
        ` : ''}

        <hr style="border-color: #333; margin-top: 30px;">
        <p style="color: #666; font-size: 12px; text-align: center;">
          Generado automáticamente por Guardian Intelligence<br>
          ${new Date().toLocaleString('es-UY', { timeZone: 'America/Montevideo' })}
        </p>
      </div>
    </body>
    </html>
  `;
}

/**
 * Envía el reporte por email
 */
export async function enviarReporteDiario(reporte, email = null) {
  const destinatario = email || process.env.ADMIN_EMAIL || 'duendesdeluruguay@gmail.com';

  try {
    const resultado = await resend.emails.send({
      from: 'Guardian Intelligence <alertas@duendesdeluruguay.com>',
      to: destinatario,
      subject: `📊 Reporte Diario - ${reporte.fecha} | ${reporte.alertas.length > 0 ? '⚠️ ' + reporte.alertas.length + ' alerta(s)' : '✅ Todo OK'}`,
      html: generarHTMLReporte(reporte)
    });

    return { success: true, id: resultado.id };
  } catch (error) {
    console.error('[GI Daily] Error enviando email:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Ejecuta el reporte diario completo (llamado por el cron)
 */
export async function ejecutarReporteDiario() {
  console.log('[GI Daily] Generando reporte diario...');

  const reporte = await generarReporteDiario();
  const envio = await enviarReporteDiario(reporte);

  return {
    reporte,
    envio,
    timestamp: new Date().toISOString()
  };
}

export default {
  registrarEvento,
  TIPOS_EVENTO,
  generarReporteDiario,
  enviarReporteDiario,
  ejecutarReporteDiario
};
