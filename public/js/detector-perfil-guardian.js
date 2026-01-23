/**
 * DETECTOR DE PERFIL PSICOLÓGICO - Duendes del Uruguay
 *
 * Este script detecta el perfil del visitante y muestra el cierre
 * de la historia más adecuado para maximizar conversión.
 *
 * Perfiles:
 * - vulnerable: Personas emocionales, buscan conexión y validación
 * - esceptico: Personas analíticas, necesitan pruebas, leen todo
 * - impulsivo: Personas de acción rápida, decisiones intuitivas
 *
 * Uso en WordPress:
 * 1. Agregar este script en el tema
 * 2. Asegurar que los meta fields _cierre_vulnerable, _cierre_esceptico, _cierre_impulsivo existan
 * 3. Agregar el contenedor <div id="cierre-dinamico" data-producto-id="XXX"></div>
 */

(function() {
  'use strict';

  // Configuración
  const CONFIG = {
    // Umbrales de detección
    TIEMPO_ESCEPTICO: 45000,      // 45s+ en página = escéptico
    TIEMPO_IMPULSIVO: 8000,       // Menos de 8s = impulsivo
    TIEMPO_RACIONAL: 120000,      // 2min+ leyendo todo = racional
    SCROLL_RAPIDO: 500,           // px/s para detectar scroll rápido
    RELECTURA_UMBRAL: 2,          // Veces que vuelve arriba = escéptico

    // Hora nocturna (vulnerable por defecto)
    HORA_NOCTURNA_INICIO: 22,
    HORA_NOCTURNA_FIN: 6,

    // Cookie del test del guardián
    COOKIE_PERFIL_TEST: 'ddu_perfil_guardian',
    // Cookie de cliente con guardianes
    COOKIE_TIENE_GUARDIANES: 'ddu_tiene_guardianes',

    // Clase CSS para transición suave
    CLASE_TRANSICION: 'cierre-transicion',

    // Fuentes que indican perfil
    FUENTES_IMPULSIVO: ['instagram', 'facebook', 'tiktok', 'whatsapp'],
    FUENTES_VULNERABLE: ['google', 'busqueda', 'search'],
    FUENTES_RACIONAL: ['reddit', 'quora', 'linkedin']
  };

  // Estado del tracking
  const estado = {
    tiempoInicio: Date.now(),
    scrollMaximo: 0,
    velocidadesScroll: [],
    vecesVolvioPrincipo: 0,
    ultimaPosicionScroll: 0,
    perfilDetectado: null,
    perfilConfianza: 0, // 0-100
    fuenteReferrer: null
  };

  /**
   * Obtiene el perfil guardado del test del guardián (cookie)
   */
  function obtenerPerfilDelTest() {
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
      const [name, value] = cookie.trim().split('=');
      if (name === CONFIG.COOKIE_PERFIL_TEST) {
        return value;
      }
    }
    return null;
  }

  /**
   * Detecta la fuente del tráfico
   */
  function detectarFuente() {
    const referrer = document.referrer.toLowerCase();
    const urlParams = new URLSearchParams(window.location.search);
    const utm = urlParams.get('utm_source') || urlParams.get('ref') || '';

    const fuente = referrer + ' ' + utm;

    for (const f of CONFIG.FUENTES_IMPULSIVO) {
      if (fuente.includes(f)) {
        estado.fuenteReferrer = 'impulsivo';
        return 'impulsivo';
      }
    }

    for (const f of CONFIG.FUENTES_RACIONAL) {
      if (fuente.includes(f)) {
        estado.fuenteReferrer = 'racional';
        return 'racional';
      }
    }

    for (const f of CONFIG.FUENTES_VULNERABLE) {
      if (fuente.includes(f)) {
        estado.fuenteReferrer = 'vulnerable';
        return 'vulnerable';
      }
    }

    return null;
  }

  /**
   * Detecta si es horario nocturno (indica estado vulnerable)
   */
  function esHorarioNocturno() {
    const hora = new Date().getHours();
    return hora >= CONFIG.HORA_NOCTURNA_INICIO || hora < CONFIG.HORA_NOCTURNA_FIN;
  }

  /**
   * Calcula la velocidad de scroll promedio
   */
  function calcularVelocidadScroll() {
    if (estado.velocidadesScroll.length < 3) return 0;
    const ultimas = estado.velocidadesScroll.slice(-10);
    return ultimas.reduce((a, b) => a + b, 0) / ultimas.length;
  }

  /**
   * Detecta si ya tiene guardianes (coleccionista)
   */
  function tieneGuardianes() {
    // Buscar cookie de cliente con guardianes
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
      const [name, value] = cookie.trim().split('=');
      if (name === CONFIG.COOKIE_TIENE_GUARDIANES && value === 'true') {
        return true;
      }
    }
    // También verificar localStorage
    try {
      const guardianesComprados = localStorage.getItem('ddu_guardianes_comprados');
      if (guardianesComprados && JSON.parse(guardianesComprados).length > 0) {
        return true;
      }
    } catch (e) {}
    return false;
  }

  /**
   * Detecta el perfil basándose en comportamiento
   * 6 perfiles: vulnerable, esceptico, impulsivo, coleccionista, racional, default
   */
  function detectarPerfil() {
    // 1. Si tiene cookie del test, usar ese perfil (máxima confianza)
    const perfilTest = obtenerPerfilDelTest();
    if (perfilTest) {
      return { perfil: perfilTest, confianza: 95, fuente: 'test' };
    }

    // 2. Si ya tiene guardianes = coleccionista (alta confianza)
    if (tieneGuardianes()) {
      return { perfil: 'coleccionista', confianza: 90, fuente: 'historial' };
    }

    // 3. Analizar comportamiento
    const tiempoEnPagina = Date.now() - estado.tiempoInicio;
    const velocidadScroll = calcularVelocidadScroll();
    const fuenteTrafico = detectarFuente();
    const nocturno = esHorarioNocturno();

    // Puntuación para cada perfil (6 perfiles)
    let puntos = {
      vulnerable: 0,
      esceptico: 0,
      impulsivo: 0,
      coleccionista: 0,
      racional: 0
    };

    // Factor tiempo
    if (tiempoEnPagina > CONFIG.TIEMPO_RACIONAL) {
      puntos.racional += 25; // Lee mucho tiempo = racional
      puntos.esceptico += 15;
    } else if (tiempoEnPagina > CONFIG.TIEMPO_ESCEPTICO) {
      puntos.esceptico += 30;
    } else if (tiempoEnPagina < CONFIG.TIEMPO_IMPULSIVO) {
      puntos.impulsivo += 25;
    } else {
      puntos.vulnerable += 15;
    }

    // Factor scroll
    if (velocidadScroll > CONFIG.SCROLL_RAPIDO) {
      puntos.impulsivo += 20;
    } else if (velocidadScroll > 0 && velocidadScroll < 150) {
      puntos.esceptico += 15; // Lee despacio
      puntos.racional += 15;  // También podría ser racional
    }

    // Factor relectura (volver arriba)
    if (estado.vecesVolvioPrincipo >= CONFIG.RELECTURA_UMBRAL) {
      puntos.esceptico += 25;
      puntos.racional += 10;
    }

    // Factor fuente de tráfico
    if (fuenteTrafico === 'impulsivo') {
      puntos.impulsivo += 20;
    } else if (fuenteTrafico === 'vulnerable') {
      puntos.vulnerable += 15;
    } else if (fuenteTrafico === 'racional') {
      puntos.racional += 25;
    }

    // Factor horario nocturno
    if (nocturno) {
      puntos.vulnerable += 20;
    }

    // Si navegó desde otra página de guardianes (posible coleccionista)
    const referrer = document.referrer.toLowerCase();
    if (referrer.includes('duendes') && referrer.includes('product')) {
      puntos.coleccionista += 20;
    }

    // Default: vulnerable tiene ventaja base (es el más común en este nicho)
    puntos.vulnerable += 10;

    // Determinar ganador
    const perfiles = Object.entries(puntos);
    perfiles.sort((a, b) => b[1] - a[1]);

    const ganador = perfiles[0];
    const segundo = perfiles[1];

    // Confianza basada en diferencia
    const diferencia = ganador[1] - segundo[1];
    const confianza = Math.min(50 + diferencia, 90);

    return {
      perfil: ganador[0],
      confianza,
      puntos,
      fuente: 'comportamiento'
    };
  }

  /**
   * Obtiene los cierres del producto
   */
  async function obtenerCierres(productoId) {
    try {
      // Intentar obtener del data attribute primero (más rápido)
      const container = document.getElementById('cierre-dinamico');
      if (container) {
        const cierresData = container.getAttribute('data-cierres');
        if (cierresData) {
          return JSON.parse(cierresData);
        }
      }

      // Si no está en el HTML, hacer request a la API de Next.js
      const response = await fetch(`/api/producto/${productoId}?campos=cierres`);
      if (response.ok) {
        const data = await response.json();
        return data.cierres;
      }

      return null;
    } catch (e) {
      console.warn('Error obteniendo cierres:', e);
      return null;
    }
  }

  /**
   * Muestra el cierre en el contenedor
   */
  function mostrarCierre(cierre, perfil) {
    const container = document.getElementById('cierre-dinamico');
    if (!container || !cierre) return;

    // Agregar clase de transición
    container.classList.add(CONFIG.CLASE_TRANSICION);

    // Marcar el perfil usado (para analytics)
    container.setAttribute('data-perfil-usado', perfil);

    // Convertir a HTML si es texto plano
    let cierreHtml = cierre;
    if (!cierre.includes('<')) {
      cierreHtml = cierre
        .split('\n')
        .map(linea => linea.trim() ? `<p>${linea}</p>` : '')
        .join('');
    }

    // Insertar con animación
    container.style.opacity = '0';
    container.innerHTML = cierreHtml;

    requestAnimationFrame(() => {
      container.style.transition = 'opacity 0.5s ease-in-out';
      container.style.opacity = '1';
    });
  }

  /**
   * Actualiza el cierre si el perfil cambia significativamente
   */
  function actualizarCierreSiCambio(cierres) {
    const nuevoAnalisis = detectarPerfil();

    // Solo cambiar si la confianza es significativamente mayor
    if (nuevoAnalisis.confianza > estado.perfilConfianza + 15) {
      if (nuevoAnalisis.perfil !== estado.perfilDetectado) {
        estado.perfilDetectado = nuevoAnalisis.perfil;
        estado.perfilConfianza = nuevoAnalisis.confianza;

        const nuevoCierre = cierres[nuevoAnalisis.perfil];
        if (nuevoCierre) {
          mostrarCierre(nuevoCierre, nuevoAnalisis.perfil);
        }
      }
    }
  }

  /**
   * Inicializa el tracking de scroll
   */
  function iniciarTrackingScroll() {
    let ultimoTiempo = Date.now();
    let ultimaPosicion = window.scrollY;

    window.addEventListener('scroll', () => {
      const ahora = Date.now();
      const posicion = window.scrollY;
      const deltaTime = ahora - ultimoTiempo;

      if (deltaTime > 100) { // Evitar spam
        const deltaPosicion = Math.abs(posicion - ultimaPosicion);
        const velocidad = (deltaPosicion / deltaTime) * 1000; // px/s

        estado.velocidadesScroll.push(velocidad);
        if (estado.velocidadesScroll.length > 20) {
          estado.velocidadesScroll.shift();
        }

        // Detectar si volvió al principio
        if (posicion < 200 && estado.scrollMaximo > 500) {
          estado.vecesVolvioPrincipo++;
        }

        estado.scrollMaximo = Math.max(estado.scrollMaximo, posicion);
        ultimoTiempo = ahora;
        ultimaPosicion = posicion;
      }
    }, { passive: true });
  }

  /**
   * Inicialización principal
   */
  async function init() {
    const container = document.getElementById('cierre-dinamico');
    if (!container) {
      // No hay contenedor, no hacer nada
      return;
    }

    const productoId = container.getAttribute('data-producto-id');
    if (!productoId) {
      console.warn('Falta data-producto-id en #cierre-dinamico');
      return;
    }

    // Iniciar tracking
    iniciarTrackingScroll();

    // Obtener cierres
    const cierres = await obtenerCierres(productoId);
    if (!cierres) {
      console.warn('No se encontraron cierres para producto', productoId);
      return;
    }

    // Detección inicial (después de 2 segundos para tener datos)
    setTimeout(() => {
      const analisis = detectarPerfil();
      estado.perfilDetectado = analisis.perfil;
      estado.perfilConfianza = analisis.confianza;

      const cierre = cierres[analisis.perfil] || cierres.vulnerable;
      if (cierre) {
        mostrarCierre(cierre, analisis.perfil);
      }

      // Log para debug (remover en producción)
      if (window.location.search.includes('debug')) {
        console.log('Perfil detectado:', analisis);
      }
    }, 2000);

    // Re-evaluar cada 15 segundos
    setInterval(() => {
      actualizarCierreSiCambio(cierres);
    }, 15000);
  }

  // Ejecutar cuando el DOM esté listo
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Exponer para debug
  window.DDU_PerfilDetector = {
    getEstado: () => estado,
    detectarPerfil,
    forzarPerfil: (perfil) => {
      const container = document.getElementById('cierre-dinamico');
      if (container) {
        const cierres = JSON.parse(container.getAttribute('data-cierres') || '{}');
        if (cierres[perfil]) {
          mostrarCierre(cierres[perfil], perfil);
        }
      }
    }
  };

})();
