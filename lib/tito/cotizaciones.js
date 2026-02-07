/**
 * SISTEMA DE COTIZACIONES EN TIEMPO REAL
 * Obtiene tasas de cambio actualizadas y las cachea
 */

import { kv } from '@vercel/kv';

// Tasas de respaldo (por si falla la API) - Actualizado Feb 2026
const TASAS_FALLBACK = {
  ARS: 1350,   // Peso argentino (tasa blue/MEP aproximada)
  MXN: 21,     // Peso mexicano
  COP: 4400,   // Peso colombiano
  CLP: 1000,   // Peso chileno
  PEN: 3.80,   // Sol peruano
  BRL: 6.2,    // Real brasileño
  EUR: 0.95,   // Euro
  UYU: 44,     // Peso uruguayo (referencia, pero usamos tabla fija)
};

// Precios FIJOS para Uruguay (no dependen de cotización)
// Tabla oficial - NO MODIFICAR sin autorización
export const PRECIOS_URUGUAY = {
  convertir: (precioUSD) => {
    if (precioUSD <= 75) return 2500;      // Mini Clásico ($70 USD)
    if (precioUSD <= 160) return 5500;     // Mini Especial / Pixie ($150 USD)
    if (precioUSD <= 210) return 8000;     // Mediano Especial ($200 USD)
    if (precioUSD <= 500) return 16500;    // Grande Especial ($450 USD)
    return 39800;                           // Gigante ($1050 USD)
  },
  // Tabla directa para referencia
  tabla: {
    mini_clasico: { uyu: 2500, usd: 70 },
    mini_especial: { uyu: 5500, usd: 150 },
    mediano_especial: { uyu: 8000, usd: 200 },
    grande_especial: { uyu: 16500, usd: 450 },
    gigante: { uyu: 39800, usd: 1050 }
  }
};

// Info de países para formateo de precios
export const INFO_PAISES = {
  'AR': { codigoMoneda: 'ARS', moneda: 'pesos argentinos', esBlue: true },
  'MX': { codigoMoneda: 'MXN', moneda: 'pesos mexicanos' },
  'CO': { codigoMoneda: 'COP', moneda: 'pesos colombianos' },
  'CL': { codigoMoneda: 'CLP', moneda: 'pesos chilenos' },
  'PE': { codigoMoneda: 'PEN', moneda: 'soles' },
  'BR': { codigoMoneda: 'BRL', moneda: 'reales' },
  'ES': { codigoMoneda: 'EUR', moneda: 'euros' },
  'UY': { codigoMoneda: 'UYU', moneda: 'pesos uruguayos', esFijo: true },
  'US': { codigoMoneda: 'USD', moneda: 'dólares', esDolarizado: true },
  'EC': { codigoMoneda: 'USD', moneda: 'dólares', esDolarizado: true },
  'PA': { codigoMoneda: 'USD', moneda: 'dólares', esDolarizado: true }
};

/**
 * Formatea un precio según el país del cliente
 * FUNCIÓN CENTRALIZADA - usar siempre esta para precios
 * @param {number} precioUSD - Precio en dólares
 * @param {string} codigoPais - Código ISO del país (UY, AR, MX, etc.)
 * @param {object} tasas - Tasas de cambio (opcional)
 * @returns {Promise<string>} Precio formateado para mostrar
 */
export async function formatearPrecio(precioUSD, codigoPais, tasas = null) {
  // Uruguay: precio fijo UYU, NUNCA convertir
  if (codigoPais === 'UY') {
    const precioUYU = PRECIOS_URUGUAY.convertir(precioUSD);
    return `$${precioUYU.toLocaleString('es-UY')} pesos`;
  }

  // Países dolarizados: solo USD
  if (['US', 'EC', 'PA'].includes(codigoPais)) {
    return `$${precioUSD} USD`;
  }

  // Otros países: USD + aproximado en moneda local
  if (!tasas) {
    tasas = await obtenerCotizaciones();
  }

  const infoPais = INFO_PAISES[codigoPais];
  if (infoPais && tasas[infoPais.codigoMoneda]) {
    const tasa = tasas[infoPais.codigoMoneda];
    const precioLocal = Math.round(precioUSD * tasa);
    const nota = infoPais.esBlue ? ' al blue' : '';
    return `$${precioUSD} USD (aprox. $${precioLocal.toLocaleString('es')} ${infoPais.moneda}${nota})`;
  }

  // Fallback: solo USD
  return `$${precioUSD} USD`;
}

// Cache key y duración
const CACHE_KEY = 'tito:cotizaciones';
const CACHE_DURACION = 6 * 60 * 60; // 6 horas en segundos

/**
 * Obtiene la tasa del dólar blue/MEP para Argentina
 * Usa la API de Bluelytics que es gratuita y confiable
 */
async function obtenerDolarBlue() {
  try {
    const response = await fetch('https://api.bluelytics.com.ar/v2/latest', {
      headers: { 'Accept': 'application/json' },
      signal: AbortSignal.timeout(5000) // 5s timeout
    });
    if (!response.ok) return null;
    const data = await response.json();
    // Usar el promedio del blue (entre compra y venta)
    const blueAvg = data?.blue?.value_avg;
    if (blueAvg && blueAvg > 500) {
      console.log(`[Cotizaciones] Dólar blue Argentina: $${blueAvg}`);
      return blueAvg;
    }
    return null;
  } catch (e) {
    console.log('[Cotizaciones] Error obteniendo dólar blue:', e.message);
    return null;
  }
}

/**
 * Obtiene las cotizaciones actualizadas
 * Usa caché de 6 horas para no abusar de la API
 * Para Argentina: usa dólar blue en vez de oficial
 */
export async function obtenerCotizaciones() {
  try {
    // Intentar obtener del caché
    const cached = await kv.get(CACHE_KEY);
    if (cached && cached.tasas && cached.timestamp) {
      const edad = Date.now() - cached.timestamp;
      // Si tiene menos de 6 horas, usar caché
      if (edad < CACHE_DURACION * 1000) {
        console.log('[Cotizaciones] Usando caché:', new Date(cached.timestamp).toISOString());
        return cached.tasas;
      }
    }
  } catch (e) {
    console.log('[Cotizaciones] Error leyendo caché:', e.message);
  }

  // Obtener tasas frescas de la API (general + blue para Argentina)
  try {
    // Llamar ambas APIs en paralelo
    const [generalResponse, dolarBlue] = await Promise.all([
      fetch('https://api.exchangerate-api.com/v4/latest/USD', {
        headers: { 'Accept': 'application/json' },
        next: { revalidate: 3600 }
      }),
      obtenerDolarBlue()
    ]);

    if (!generalResponse.ok) throw new Error('API no disponible');

    const data = await generalResponse.json();

    // Para ARS: preferir blue, fallback a oficial * 1.2, fallback hardcoded
    let tasaARS;
    if (dolarBlue) {
      tasaARS = dolarBlue;
    } else if (data.rates.ARS) {
      // Si solo tenemos la tasa oficial, ajustar ~20% arriba para aproximar al blue
      tasaARS = Math.round(data.rates.ARS * 1.2);
      console.log(`[Cotizaciones] ARS: usando oficial (${data.rates.ARS}) * 1.2 = ${tasaARS}`);
    } else {
      tasaARS = TASAS_FALLBACK.ARS;
    }

    const tasas = {
      ARS: tasaARS,
      MXN: data.rates.MXN || TASAS_FALLBACK.MXN,
      COP: data.rates.COP || TASAS_FALLBACK.COP,
      CLP: data.rates.CLP || TASAS_FALLBACK.CLP,
      PEN: data.rates.PEN || TASAS_FALLBACK.PEN,
      BRL: data.rates.BRL || TASAS_FALLBACK.BRL,
      EUR: data.rates.EUR || TASAS_FALLBACK.EUR,
      UYU: data.rates.UYU || TASAS_FALLBACK.UYU,
      // USD siempre 1
      USD: 1,
      // Timestamp de actualización
      _actualizacion: new Date().toISOString(),
      _fuente: dolarBlue ? 'exchangerate + bluelytics' : 'exchangerate-api.com',
      _arsBlue: !!dolarBlue
    };

    // Guardar en caché
    try {
      await kv.set(CACHE_KEY, {
        tasas,
        timestamp: Date.now()
      }, { ex: CACHE_DURACION });
      console.log('[Cotizaciones] Actualizadas y cacheadas:', tasas._actualizacion, '| ARS:', tasas.ARS);
    } catch (e) {
      console.log('[Cotizaciones] Error guardando caché:', e.message);
    }

    return tasas;

  } catch (error) {
    console.error('[Cotizaciones] Error obteniendo tasas:', error.message);
    // Retornar tasas de respaldo
    return {
      ...TASAS_FALLBACK,
      USD: 1,
      _actualizacion: 'fallback',
      _fuente: 'hardcoded'
    };
  }
}

/**
 * Convierte un precio de USD a la moneda local
 * @param {number} precioUSD - Precio en dólares
 * @param {string} paisCode - Código de país (UY, AR, MX, etc.)
 * @param {object} tasas - Tasas de cambio (opcional, las obtiene si no se pasan)
 */
export async function convertirPrecio(precioUSD, paisCode, tasas = null) {
  // Uruguay usa precios fijos
  if (paisCode === 'UY') {
    return {
      precioLocal: PRECIOS_URUGUAY.convertir(precioUSD),
      moneda: 'pesos uruguayos',
      formato: `$${PRECIOS_URUGUAY.convertir(precioUSD).toLocaleString('es-UY')} pesos`,
      esFijo: true
    };
  }

  // Países dolarizados
  if (['US', 'EC', 'PA'].includes(paisCode)) {
    return {
      precioLocal: precioUSD,
      moneda: 'dólares',
      formato: `$${precioUSD} USD`,
      esFijo: true
    };
  }

  // Obtener tasas si no se pasaron
  if (!tasas) {
    tasas = await obtenerCotizaciones();
  }

  // Mapeo de país a moneda
  const paisAMoneda = {
    'AR': 'ARS', 'MX': 'MXN', 'CO': 'COP', 'CL': 'CLP',
    'PE': 'PEN', 'BR': 'BRL', 'ES': 'EUR'
  };

  const monedaNombres = {
    'ARS': 'pesos argentinos', 'MXN': 'pesos mexicanos',
    'COP': 'pesos colombianos', 'CLP': 'pesos chilenos',
    'PEN': 'soles', 'BRL': 'reales', 'EUR': 'euros'
  };

  const codigoMoneda = paisAMoneda[paisCode] || 'USD';
  const tasa = tasas[codigoMoneda] || 1;
  const precioLocal = Math.round(precioUSD * tasa);
  const nombreMoneda = monedaNombres[codigoMoneda] || 'dólares';

  return {
    precioLocal,
    precioUSD,
    moneda: nombreMoneda,
    tasa,
    formato: `$${precioUSD} USD (aprox. $${precioLocal.toLocaleString('es')} ${nombreMoneda})`,
    actualizacion: tasas._actualizacion
  };
}

/**
 * Fuerza actualización de cotizaciones (para usar desde admin)
 */
export async function forzarActualizacion() {
  try {
    await kv.del(CACHE_KEY);
    return await obtenerCotizaciones();
  } catch (e) {
    return { error: e.message };
  }
}

export default {
  obtenerCotizaciones,
  convertirPrecio,
  formatearPrecio,
  forzarActualizacion,
  PRECIOS_URUGUAY,
  INFO_PAISES
};
