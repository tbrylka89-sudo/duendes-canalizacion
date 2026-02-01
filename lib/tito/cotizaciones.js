/**
 * SISTEMA DE COTIZACIONES EN TIEMPO REAL
 * Obtiene tasas de cambio actualizadas y las cachea
 */

import { kv } from '@vercel/kv';

// Tasas de respaldo (por si falla la API)
const TASAS_FALLBACK = {
  ARS: 1250,   // Peso argentino
  MXN: 21,     // Peso mexicano
  COP: 4500,   // Peso colombiano
  CLP: 1020,   // Peso chileno
  PEN: 3.85,   // Sol peruano
  BRL: 6.4,    // Real brasileño
  EUR: 0.96,   // Euro
  UYU: 44,     // Peso uruguayo (referencia, pero usamos tabla fija)
};

// Precios FIJOS para Uruguay (no dependen de cotización)
export const PRECIOS_URUGUAY = {
  convertir: (precioUSD) => {
    if (precioUSD <= 75) return 2500;
    if (precioUSD <= 160) return 5500;
    if (precioUSD <= 210) return 8000;
    if (precioUSD <= 350) return 12500;
    if (precioUSD <= 500) return 16500;
    if (precioUSD <= 700) return 24500;
    return 39800;
  }
};

// Cache key y duración
const CACHE_KEY = 'tito:cotizaciones';
const CACHE_DURACION = 6 * 60 * 60; // 6 horas en segundos

/**
 * Obtiene las cotizaciones actualizadas
 * Usa caché de 6 horas para no abusar de la API
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

  // Obtener tasas frescas de la API
  try {
    // API gratuita y confiable
    const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD', {
      headers: { 'Accept': 'application/json' },
      next: { revalidate: 3600 } // Cache de Next.js
    });

    if (!response.ok) throw new Error('API no disponible');

    const data = await response.json();

    const tasas = {
      ARS: data.rates.ARS || TASAS_FALLBACK.ARS,
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
      _fuente: 'exchangerate-api.com'
    };

    // Guardar en caché
    try {
      await kv.set(CACHE_KEY, {
        tasas,
        timestamp: Date.now()
      }, { ex: CACHE_DURACION });
      console.log('[Cotizaciones] Actualizadas y cacheadas:', tasas._actualizacion);
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
  forzarActualizacion,
  PRECIOS_URUGUAY
};
