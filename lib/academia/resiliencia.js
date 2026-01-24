/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * SISTEMA DE RESILIENCIA - ACADEMIA DE GUARDIANES
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Este módulo maneja errores en tiempo de ejecución y recuperación automática.
 * Implementa:
 * - Retry con backoff exponencial
 * - Circuit breaker para APIs externas
 * - Cache inteligente
 * - Fallbacks automáticos
 * - Logging de errores para análisis
 */

// ═══════════════════════════════════════════════════════════════════════════════
// CONFIGURACIÓN
// ═══════════════════════════════════════════════════════════════════════════════

const CONFIG = {
  // Retry
  maxRetries: 3,
  baseDelayMs: 1000,
  maxDelayMs: 30000,

  // Circuit Breaker
  circuitBreakerThreshold: 5, // Fallos antes de abrir
  circuitBreakerResetMs: 60000, // Tiempo para reintentar

  // Cache
  cacheTTL: {
    guardianes: 5 * 60 * 1000, // 5 minutos
    woocommerce: 10 * 60 * 1000, // 10 minutos
    contenido: 60 * 60 * 1000, // 1 hora
  },

  // Timeouts
  timeouts: {
    woocommerce: 30000,
    openai: 60000,
    claude: 60000,
    dalle: 120000,
  }
};

// ═══════════════════════════════════════════════════════════════════════════════
// ESTADO DEL CIRCUIT BREAKER
// ═══════════════════════════════════════════════════════════════════════════════

const circuitState = {
  woocommerce: { failures: 0, lastFailure: null, isOpen: false },
  openai: { failures: 0, lastFailure: null, isOpen: false },
  claude: { failures: 0, lastFailure: null, isOpen: false },
  dalle: { failures: 0, lastFailure: null, isOpen: false },
  kv: { failures: 0, lastFailure: null, isOpen: false },
};

// ═══════════════════════════════════════════════════════════════════════════════
// CACHE EN MEMORIA (con TTL)
// ═══════════════════════════════════════════════════════════════════════════════

const memoryCache = new Map();

export function cacheGet(key) {
  const item = memoryCache.get(key);
  if (!item) return null;

  if (Date.now() > item.expiry) {
    memoryCache.delete(key);
    return null;
  }

  return item.value;
}

export function cacheSet(key, value, ttlMs = 60000) {
  memoryCache.set(key, {
    value,
    expiry: Date.now() + ttlMs,
    createdAt: Date.now()
  });
}

export function cacheClear(pattern = null) {
  if (!pattern) {
    memoryCache.clear();
    return;
  }

  for (const key of memoryCache.keys()) {
    if (key.includes(pattern)) {
      memoryCache.delete(key);
    }
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// RETRY CON BACKOFF EXPONENCIAL
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Ejecuta una función con retry automático
 */
export async function conRetry(fn, opciones = {}) {
  const {
    maxRetries = CONFIG.maxRetries,
    baseDelay = CONFIG.baseDelayMs,
    maxDelay = CONFIG.maxDelayMs,
    serviceName = 'unknown',
    onRetry = null,
    shouldRetry = (error) => true
  } = opciones;

  let lastError;

  for (let intento = 0; intento <= maxRetries; intento++) {
    try {
      // Verificar circuit breaker
      if (circuitState[serviceName]?.isOpen) {
        const tiempoDesdeUltimoFallo = Date.now() - circuitState[serviceName].lastFailure;
        if (tiempoDesdeUltimoFallo < CONFIG.circuitBreakerResetMs) {
          throw new Error(`Circuit breaker abierto para ${serviceName}. Reintentando en ${Math.round((CONFIG.circuitBreakerResetMs - tiempoDesdeUltimoFallo) / 1000)}s`);
        }
        // Reset circuit breaker para probar
        circuitState[serviceName].isOpen = false;
        circuitState[serviceName].failures = 0;
      }

      const resultado = await fn();

      // Éxito - resetear contador de fallos
      if (circuitState[serviceName]) {
        circuitState[serviceName].failures = 0;
      }

      return resultado;

    } catch (error) {
      lastError = error;

      // Registrar fallo en circuit breaker
      if (circuitState[serviceName]) {
        circuitState[serviceName].failures++;
        circuitState[serviceName].lastFailure = Date.now();

        if (circuitState[serviceName].failures >= CONFIG.circuitBreakerThreshold) {
          circuitState[serviceName].isOpen = true;
          console.error(`[CIRCUIT BREAKER] ${serviceName} abierto después de ${circuitState[serviceName].failures} fallos`);
        }
      }

      // Verificar si debemos reintentar
      if (!shouldRetry(error) || intento === maxRetries) {
        throw error;
      }

      // Calcular delay con jitter
      const delay = Math.min(
        baseDelay * Math.pow(2, intento) + Math.random() * 1000,
        maxDelay
      );

      if (onRetry) {
        onRetry(intento + 1, delay, error);
      }

      console.warn(`[RETRY] ${serviceName} intento ${intento + 1}/${maxRetries + 1} en ${Math.round(delay)}ms: ${error.message}`);

      await sleep(delay);
    }
  }

  throw lastError;
}

// ═══════════════════════════════════════════════════════════════════════════════
// FETCH CON TIMEOUT Y RETRY
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Fetch resiliente con timeout, retry y cache opcional
 */
export async function fetchResiliente(url, opciones = {}) {
  const {
    timeout = 30000,
    serviceName = 'http',
    useCache = false,
    cacheTTL = 60000,
    ...fetchOpciones
  } = opciones;

  // Intentar cache primero
  const cacheKey = `fetch:${url}:${JSON.stringify(fetchOpciones)}`;
  if (useCache) {
    const cached = cacheGet(cacheKey);
    if (cached) {
      return { ...cached, fromCache: true };
    }
  }

  return conRetry(
    async () => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      try {
        const response = await fetch(url, {
          ...fetchOpciones,
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();

        // Guardar en cache si corresponde
        if (useCache) {
          cacheSet(cacheKey, data, cacheTTL);
        }

        return data;

      } catch (error) {
        clearTimeout(timeoutId);

        if (error.name === 'AbortError') {
          throw new Error(`Timeout después de ${timeout}ms`);
        }

        throw error;
      }
    },
    {
      serviceName,
      shouldRetry: (error) => {
        // No reintentar en errores 4xx (excepto 429)
        if (error.message.includes('HTTP 4') && !error.message.includes('429')) {
          return false;
        }
        return true;
      }
    }
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// FALLBACK CHAIN
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Ejecuta una cadena de funciones hasta que una tenga éxito
 */
export async function conFallback(funciones, contexto = {}) {
  const errores = [];

  for (let i = 0; i < funciones.length; i++) {
    const { fn, nombre = `fallback_${i}` } = funciones[i];

    try {
      const resultado = await fn(contexto);

      if (i > 0) {
        console.log(`[FALLBACK] Éxito con ${nombre} después de ${i} intentos fallidos`);
      }

      return {
        resultado,
        usedFallback: i > 0,
        fallbackUsed: nombre,
        erroresPrevios: errores
      };

    } catch (error) {
      errores.push({ nombre, error: error.message });
      console.warn(`[FALLBACK] ${nombre} falló: ${error.message}`);
    }
  }

  throw new Error(`Todos los fallbacks fallaron: ${errores.map(e => e.nombre).join(', ')}`);
}

// ═══════════════════════════════════════════════════════════════════════════════
// FALLBACKS ESPECÍFICOS PARA ACADEMIA
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Obtener guardianes con fallback
 */
export async function obtenerGuardianesConFallback(criterios = {}) {
  return conFallback([
    {
      nombre: 'WooCommerce API',
      fn: async () => {
        // Implementar llamada real a WooCommerce
        throw new Error('No implementado - usar implementación real');
      }
    },
    {
      nombre: 'Cache KV',
      fn: async () => {
        const cached = cacheGet('guardianes:todos');
        if (!cached) throw new Error('No hay cache');
        return cached;
      }
    },
    {
      nombre: 'Base de datos local',
      fn: async () => {
        // Usar productos-base-datos.json como último recurso
        const { default: productosBase } = await import('../productos-base-datos.json');
        return productosBase.productos;
      }
    }
  ]);
}

/**
 * Generar imagen con fallback
 */
export async function generarImagenConFallback(prompt, opciones = {}) {
  return conFallback([
    {
      nombre: 'DALL-E 3',
      fn: async () => {
        // Implementar llamada real a DALL-E
        throw new Error('No implementado - usar implementación real');
      }
    },
    {
      nombre: 'Replicate SDXL',
      fn: async () => {
        // Fallback a Replicate
        throw new Error('No implementado - usar implementación real');
      }
    },
    {
      nombre: 'Placeholder',
      fn: async (ctx) => {
        const texto = encodeURIComponent(opciones.titulo || 'Imagen');
        return {
          url: `https://placehold.co/1024x1024/1a1a1a/d4af37?text=${texto}`,
          esPlaceholder: true
        };
      }
    }
  ]);
}

/**
 * Generar contenido con fallback
 */
export async function generarContenidoConFallback(prompt, opciones = {}) {
  return conFallback([
    {
      nombre: 'Claude',
      fn: async () => {
        // Implementar llamada real a Claude
        throw new Error('No implementado - usar implementación real');
      }
    },
    {
      nombre: 'Gemini',
      fn: async () => {
        // Fallback a Gemini
        throw new Error('No implementado - usar implementación real');
      }
    },
    {
      nombre: 'Contenido predefinido',
      fn: async (ctx) => {
        // Último recurso: usar plantilla genérica
        return {
          contenido: generarContenidoPlantilla(opciones),
          esPlantilla: true
        };
      }
    }
  ]);
}

function generarContenidoPlantilla(opciones) {
  const { guardian, tema, tipo } = opciones;
  const nombre = guardian?.nombre || 'Tu guardián';
  const categoria = guardian?.categoria || 'protección';

  return `
## ${nombre} te habla sobre ${tema || categoria}

Hoy quiero compartir contigo algo importante sobre ${categoria}.

En mis años acompañando a personas como vos, aprendí que el primer paso siempre es reconocer dónde estás parado/a.

No necesitás tener todas las respuestas. Solo necesitás estar dispuesta/o a escuchar.

*Este es un contenido de respaldo. Se regenerará con contenido personalizado pronto.*
  `.trim();
}

// ═══════════════════════════════════════════════════════════════════════════════
// LOGGING Y MONITOREO
// ═══════════════════════════════════════════════════════════════════════════════

const errorLog = [];

export function logError(contexto, error, metadata = {}) {
  const entry = {
    timestamp: new Date().toISOString(),
    contexto,
    mensaje: error.message,
    stack: error.stack,
    metadata,
    circuitState: { ...circuitState }
  };

  errorLog.push(entry);

  // Mantener solo últimos 100 errores en memoria
  if (errorLog.length > 100) {
    errorLog.shift();
  }

  console.error(`[ERROR] ${contexto}:`, error.message, metadata);

  return entry;
}

export function getErrorLog() {
  return [...errorLog];
}

export function getCircuitState() {
  return { ...circuitState };
}

export function resetCircuitBreaker(serviceName = null) {
  if (serviceName) {
    if (circuitState[serviceName]) {
      circuitState[serviceName] = { failures: 0, lastFailure: null, isOpen: false };
    }
  } else {
    for (const key of Object.keys(circuitState)) {
      circuitState[key] = { failures: 0, lastFailure: null, isOpen: false };
    }
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// UTILIDADES
// ═══════════════════════════════════════════════════════════════════════════════

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ═══════════════════════════════════════════════════════════════════════════════
// HEALTH CHECK
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Verifica el estado de salud de todos los servicios
 */
export async function healthCheck() {
  const resultados = {
    timestamp: new Date().toISOString(),
    servicios: {},
    saludable: true
  };

  // Verificar WooCommerce
  try {
    // Implementar ping a WooCommerce
    resultados.servicios.woocommerce = {
      status: circuitState.woocommerce.isOpen ? 'degraded' : 'healthy',
      failures: circuitState.woocommerce.failures
    };
  } catch (e) {
    resultados.servicios.woocommerce = { status: 'unhealthy', error: e.message };
    resultados.saludable = false;
  }

  // Verificar OpenAI
  resultados.servicios.openai = {
    status: circuitState.openai.isOpen ? 'degraded' : 'healthy',
    failures: circuitState.openai.failures
  };

  // Verificar Claude
  resultados.servicios.claude = {
    status: circuitState.claude.isOpen ? 'degraded' : 'healthy',
    failures: circuitState.claude.failures
  };

  // Verificar KV
  resultados.servicios.kv = {
    status: circuitState.kv.isOpen ? 'degraded' : 'healthy',
    failures: circuitState.kv.failures
  };

  // Cache stats
  resultados.cache = {
    items: memoryCache.size,
    keys: [...memoryCache.keys()].slice(0, 10)
  };

  // Errores recientes
  resultados.erroresRecientes = errorLog.slice(-5);

  return resultados;
}

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORT
// ═══════════════════════════════════════════════════════════════════════════════

export default {
  // Cache
  cacheGet,
  cacheSet,
  cacheClear,

  // Retry y Fallback
  conRetry,
  conFallback,
  fetchResiliente,

  // Fallbacks específicos
  obtenerGuardianesConFallback,
  generarImagenConFallback,
  generarContenidoConFallback,

  // Logging y monitoreo
  logError,
  getErrorLog,
  getCircuitState,
  resetCircuitBreaker,
  healthCheck,

  // Config
  CONFIG
};
