/**
 * GUARDIAN INTELLIGENCE - MONITOR 24/7
 * Vigila que todo funcione y alerta cuando hay problemas
 */

import { kv } from '@vercel/kv';
import { GI_CONFIG, APIS_MONITOREAR, NOTIFICACIONES } from './config.js';

// ═══════════════════════════════════════════════════════════════
// VERIFICACIONES DE SALUD
// ═══════════════════════════════════════════════════════════════

/**
 * Verifica que Tito esté respondiendo
 */
export async function verificarTito() {
  try {
    const baseUrl = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : 'https://duendes-vercel.vercel.app';
    const response = await fetch(`${baseUrl}/api/tito/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        mensaje: 'test de salud',
        visitorId: 'gi-monitor-test'
      })
    });

    if (!response.ok) {
      return {
        ok: false,
        servicio: 'Tito Chat',
        error: `HTTP ${response.status}`,
        severidad: 'critico'
      };
    }

    const data = await response.json();
    return {
      ok: true,
      servicio: 'Tito Chat',
      respuesta: data.respuesta?.substring(0, 50) + '...'
    };

  } catch (error) {
    return {
      ok: false,
      servicio: 'Tito Chat',
      error: error.message,
      severidad: 'critico'
    };
  }
}

/**
 * Verifica conexión con WooCommerce
 */
export async function verificarWooCommerce() {
  try {
    const wpUrl = process.env.WORDPRESS_URL || 'https://duendesdeluruguay.com';
    const auth = Buffer.from(
      `${process.env.WC_CONSUMER_KEY}:${process.env.WC_CONSUMER_SECRET}`
    ).toString('base64');

    const response = await fetch(`${wpUrl}/wp-json/wc/v3/products?per_page=1`, {
      headers: { 'Authorization': `Basic ${auth}` }
    });

    if (!response.ok) {
      return {
        ok: false,
        servicio: 'WooCommerce',
        error: `HTTP ${response.status}`,
        severidad: 'critico'
      };
    }

    const productos = await response.json();
    return {
      ok: true,
      servicio: 'WooCommerce',
      productosActivos: productos.length > 0
    };

  } catch (error) {
    return {
      ok: false,
      servicio: 'WooCommerce',
      error: error.message,
      severidad: 'critico'
    };
  }
}

/**
 * Verifica Vercel KV (base de datos)
 */
export async function verificarKV() {
  try {
    const testKey = 'gi:health:test';
    const testValue = `test_${Date.now()}`;

    await kv.set(testKey, testValue, { ex: 60 });
    const retrieved = await kv.get(testKey);

    // Comparar como strings para evitar problemas de tipo
    if (String(retrieved) !== String(testValue)) {
      // Dar una segunda oportunidad (puede haber latencia)
      await new Promise(r => setTimeout(r, 100));
      const retrieved2 = await kv.get(testKey);
      if (String(retrieved2) !== String(testValue)) {
        return {
          ok: false,
          servicio: 'Vercel KV',
          error: 'Lectura no coincide con escritura',
          severidad: 'critico'
        };
      }
    }

    return {
      ok: true,
      servicio: 'Vercel KV'
    };

  } catch (error) {
    return {
      ok: false,
      servicio: 'Vercel KV',
      error: error.message,
      severidad: 'critico'
    };
  }
}

/**
 * Verifica que el sitio WordPress esté online
 */
export async function verificarWordPress() {
  try {
    const wpUrl = process.env.WORDPRESS_URL || 'https://duendesdeluruguay.com';
    const response = await fetch(wpUrl, {
      method: 'HEAD',
      redirect: 'follow'
    });

    if (!response.ok) {
      return {
        ok: false,
        servicio: 'WordPress',
        error: `HTTP ${response.status}`,
        severidad: 'critico'
      };
    }

    return {
      ok: true,
      servicio: 'WordPress',
      url: wpUrl
    };

  } catch (error) {
    return {
      ok: false,
      servicio: 'WordPress',
      error: error.message,
      severidad: 'critico'
    };
  }
}

/**
 * Verifica API de emails (Resend)
 */
export async function verificarResend() {
  try {
    // Solo verificar que la API key esté configurada
    // No enviar email de prueba para no gastar cuota
    if (!process.env.RESEND_API_KEY) {
      return {
        ok: false,
        servicio: 'Resend (Emails)',
        error: 'API key no configurada',
        severidad: 'alto'
      };
    }

    return {
      ok: true,
      servicio: 'Resend (Emails)',
      nota: 'API key configurada'
    };

  } catch (error) {
    return {
      ok: false,
      servicio: 'Resend (Emails)',
      error: error.message,
      severidad: 'alto'
    };
  }
}

// ═══════════════════════════════════════════════════════════════
// VERIFICACIÓN DE SALDOS
// ═══════════════════════════════════════════════════════════════

/**
 * Obtiene información de saldos de APIs
 * Nota: La mayoría requiere verificación manual porque no tienen endpoint de saldo
 */
export async function verificarSaldos() {
  const saldos = {
    fecha: new Date().toISOString(),
    apis: [],
    alertas: []
  };

  // Verificar cada API
  for (const [key, config] of Object.entries(APIS_MONITOREAR)) {
    const info = {
      nombre: config.nombre,
      tipo: config.tipo || 'saldo',
      requiereVerificacionManual: config.checkManual || false
    };

    // Por ahora, marcar todas como "verificar manualmente"
    // En el futuro se pueden agregar integraciones específicas
    if (config.checkManual) {
      info.estado = 'verificar_manualmente';
      info.urlPanel = obtenerUrlPanel(key);
    }

    saldos.apis.push(info);
  }

  // Agregar recordatorio de verificar saldos
  saldos.alertas.push({
    tipo: 'recordatorio',
    mensaje: 'Recordá verificar los saldos de APIs manualmente',
    urls: {
      anthropic: 'https://console.anthropic.com/settings/billing',
      openai: 'https://platform.openai.com/usage',
      vercel: 'https://vercel.com/duendes-del-uruguay/~/usage',
      resend: 'https://resend.com/emails',
      replicate: 'https://replicate.com/account/billing'
    }
  });

  return saldos;
}

function obtenerUrlPanel(api) {
  const urls = {
    anthropic: 'https://console.anthropic.com/settings/billing',
    openai: 'https://platform.openai.com/usage',
    vercel: 'https://vercel.com/duendes-del-uruguay/~/usage',
    resend: 'https://resend.com/emails',
    replicate: 'https://replicate.com/account/billing',
    elevenlabs: 'https://elevenlabs.io/subscription'
  };
  return urls[api] || null;
}

// ═══════════════════════════════════════════════════════════════
// MONITOR PRINCIPAL
// ═══════════════════════════════════════════════════════════════

/**
 * Ejecuta verificación completa del sistema
 */
export async function ejecutarMonitoreo() {
  const resultado = {
    fecha: new Date().toISOString(),
    activo: GI_CONFIG.monitor24_7.activo,
    servicios: [],
    saldos: null,
    alertas: [],
    resumen: {
      total: 0,
      ok: 0,
      fallidos: 0,
      criticos: 0
    }
  };

  if (!GI_CONFIG.monitor24_7.activo) {
    resultado.alertas.push({
      tipo: 'info',
      mensaje: 'Monitor 24/7 está DESACTIVADO'
    });
    return resultado;
  }

  // Ejecutar todas las verificaciones en paralelo
  const verificaciones = await Promise.all([
    verificarTito(),
    verificarWooCommerce(),
    verificarKV(),
    verificarWordPress(),
    verificarResend()
  ]);

  resultado.servicios = verificaciones;

  // Calcular resumen
  for (const v of verificaciones) {
    resultado.resumen.total++;
    if (v.ok) {
      resultado.resumen.ok++;
    } else {
      resultado.resumen.fallidos++;
      if (v.severidad === 'critico') {
        resultado.resumen.criticos++;
      }
      resultado.alertas.push({
        tipo: v.severidad || 'error',
        servicio: v.servicio,
        mensaje: v.error
      });
    }
  }

  // Verificar saldos
  resultado.saldos = await verificarSaldos();

  // Guardar resultado en KV para historial
  await guardarResultadoMonitoreo(resultado);

  // Enviar alertas si hay problemas críticos
  if (resultado.resumen.criticos > 0) {
    await enviarAlertasCriticas(resultado);
  }

  return resultado;
}

/**
 * Guarda resultado de monitoreo para historial
 */
async function guardarResultadoMonitoreo(resultado) {
  try {
    const key = `gi:monitor:${Date.now()}`;
    await kv.set(key, resultado, { ex: 7 * 24 * 60 * 60 }); // 7 días

    // Guardar último resultado
    await kv.set('gi:monitor:ultimo', resultado);

    // Guardar en lista de historial (últimos 100)
    await kv.lpush('gi:monitor:historial', key);
    await kv.ltrim('gi:monitor:historial', 0, 99);

  } catch (error) {
    console.error('[GI Monitor] Error guardando resultado:', error);
  }
}

/**
 * Envía alertas cuando hay problemas críticos
 */
async function enviarAlertasCriticas(resultado) {
  const mensaje = `🚨 ALERTA GUARDIAN INTELLIGENCE

${resultado.resumen.criticos} servicio(s) con problemas críticos:

${resultado.alertas
  .filter(a => a.tipo === 'critico')
  .map(a => `❌ ${a.servicio}: ${a.mensaje}`)
  .join('\n')}

Verificado: ${new Date().toLocaleString('es-UY')}`;

  // Enviar por email si está configurado
  if (NOTIFICACIONES.canales.email.activo) {
    try {
      const { Resend } = await import('resend');
      const resend = new Resend(process.env.RESEND_API_KEY);

      await resend.emails.send({
        from: 'Guardian Intelligence <alertas@duendesdeluruguay.com>',
        to: NOTIFICACIONES.canales.email.email,
        subject: '🚨 Alerta Crítica - Guardian Intelligence',
        text: mensaje
      });
    } catch (error) {
      console.error('[GI Monitor] Error enviando email:', error);
    }
  }

  // Guardar alerta en KV para mostrar en panel
  if (NOTIFICACIONES.canales.panel.activo) {
    await kv.lpush('gi:alertas:pendientes', {
      fecha: new Date().toISOString(),
      tipo: 'critico',
      mensaje,
      leida: false
    });
  }
}

/**
 * Obtiene el último estado del monitoreo
 */
export async function obtenerUltimoMonitoreo() {
  try {
    return await kv.get('gi:monitor:ultimo');
  } catch {
    return null;
  }
}

/**
 * Obtiene historial de monitoreos
 */
export async function obtenerHistorialMonitoreo(limite = 10) {
  try {
    const keys = await kv.lrange('gi:monitor:historial', 0, limite - 1);
    const resultados = [];

    for (const key of keys) {
      const resultado = await kv.get(key);
      if (resultado) {
        resultados.push(resultado);
      }
    }

    return resultados;
  } catch {
    return [];
  }
}

/**
 * Obtiene alertas pendientes (no leídas)
 */
export async function obtenerAlertasPendientes() {
  try {
    const alertas = await kv.lrange('gi:alertas:pendientes', 0, -1);
    return alertas.filter(a => !a.leida);
  } catch {
    return [];
  }
}

/**
 * Marca una alerta como leída
 */
export async function marcarAlertaLeida(index) {
  try {
    const alertas = await kv.lrange('gi:alertas:pendientes', 0, -1);
    if (alertas[index]) {
      alertas[index].leida = true;
      // Reemplazar toda la lista (no hay update individual en listas)
      await kv.del('gi:alertas:pendientes');
      for (const alerta of alertas.reverse()) {
        await kv.lpush('gi:alertas:pendientes', alerta);
      }
    }
  } catch (error) {
    console.error('[GI Monitor] Error marcando alerta:', error);
  }
}

// ═══════════════════════════════════════════════════════════════
// SWITCH ON/OFF
// ═══════════════════════════════════════════════════════════════

/**
 * Activa o desactiva el monitor 24/7
 */
export async function toggleMonitor(activo) {
  GI_CONFIG.monitor24_7.activo = activo;

  // Guardar estado en KV para persistencia
  await kv.set('gi:config:monitor_activo', activo);

  return {
    activo,
    mensaje: activo ? 'Monitor 24/7 ACTIVADO' : 'Monitor 24/7 DESACTIVADO'
  };
}

/**
 * Obtiene el estado actual del monitor
 */
export async function obtenerEstadoMonitor() {
  try {
    const activo = await kv.get('gi:config:monitor_activo');
    return activo !== null ? activo : GI_CONFIG.monitor24_7.activo;
  } catch {
    return GI_CONFIG.monitor24_7.activo;
  }
}

export default {
  verificarTito,
  verificarWooCommerce,
  verificarKV,
  verificarWordPress,
  verificarResend,
  verificarSaldos,
  ejecutarMonitoreo,
  obtenerUltimoMonitoreo,
  obtenerHistorialMonitoreo,
  obtenerAlertasPendientes,
  marcarAlertaLeida,
  toggleMonitor,
  obtenerEstadoMonitor
};
