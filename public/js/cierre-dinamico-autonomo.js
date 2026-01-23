/**
 * CIERRE DINÁMICO AUTÓNOMO - Duendes del Uruguay
 *
 * Script que se auto-inyecta en páginas de producto de WooCommerce.
 * No requiere snippet PHP - funciona de forma completamente independiente.
 *
 * Solo necesita ser cargado en el sitio (via plugin Insert Headers and Footers,
 * o en functions.php con wp_enqueue_script)
 *
 * Uso: Agregar en WordPress:
 * <script src="https://duendes-vercel.vercel.app/js/cierre-dinamico-autonomo.js" defer></script>
 */

(function() {
  'use strict';

  // Verificar si estamos en una página de producto de WooCommerce
  const isProductPage = document.body.classList.contains('single-product') ||
                        document.querySelector('.product-type-simple, .product-type-variable') ||
                        window.location.pathname.includes('/product/');

  if (!isProductPage) {
    return; // No es página de producto, salir
  }

  // Configuración
  const CONFIG = {
    TIEMPO_ESCEPTICO: 45000,
    TIEMPO_IMPULSIVO: 8000,
    TIEMPO_RACIONAL: 120000,
    SCROLL_RAPIDO: 500,
    RELECTURA_UMBRAL: 2,
    HORA_NOCTURNA_INICIO: 22,
    HORA_NOCTURNA_FIN: 6,
    COOKIE_PERFIL_TEST: 'ddu_perfil_guardian',
    COOKIE_TIENE_GUARDIANES: 'ddu_tiene_guardianes',
    FUENTES_IMPULSIVO: ['instagram', 'facebook', 'tiktok', 'whatsapp'],
    FUENTES_VULNERABLE: ['google', 'busqueda', 'search'],
    FUENTES_RACIONAL: ['reddit', 'quora', 'linkedin'],
    API_BASE: 'https://duendes-vercel.vercel.app'
  };

  // Estado del tracking
  const estado = {
    tiempoInicio: Date.now(),
    scrollMaximo: 0,
    velocidadesScroll: [],
    vecesVolvioPrincipo: 0,
    perfilDetectado: null,
    perfilConfianza: 0,
    fuenteReferrer: null
  };

  // Obtener el ID del producto desde WooCommerce
  function obtenerProductoId() {
    // Método 1: Desde body class
    const bodyClasses = document.body.className;
    const match = bodyClasses.match(/postid-(\d+)/);
    if (match) return match[1];

    // Método 2: Desde form de add-to-cart
    const form = document.querySelector('form.cart');
    if (form) {
      const input = form.querySelector('input[name="product_id"], button[name="add-to-cart"]');
      if (input) return input.value;
    }

    // Método 3: Desde data attribute
    const productDiv = document.querySelector('[data-product_id]');
    if (productDiv) return productDiv.dataset.product_id;

    // Método 4: Desde botón add-to-cart
    const addToCart = document.querySelector('.add_to_cart_button, .single_add_to_cart_button');
    if (addToCart && addToCart.dataset.product_id) return addToCart.dataset.product_id;

    return null;
  }

  // Funciones de detección de perfil
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

  function esHorarioNocturno() {
    const hora = new Date().getHours();
    return hora >= CONFIG.HORA_NOCTURNA_INICIO || hora < CONFIG.HORA_NOCTURNA_FIN;
  }

  function calcularVelocidadScroll() {
    if (estado.velocidadesScroll.length < 3) return 0;
    const ultimas = estado.velocidadesScroll.slice(-10);
    return ultimas.reduce((a, b) => a + b, 0) / ultimas.length;
  }

  function tieneGuardianes() {
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
      const [name, value] = cookie.trim().split('=');
      if (name === CONFIG.COOKIE_TIENE_GUARDIANES && value === 'true') {
        return true;
      }
    }
    try {
      const guardianesComprados = localStorage.getItem('ddu_guardianes_comprados');
      if (guardianesComprados && JSON.parse(guardianesComprados).length > 0) {
        return true;
      }
    } catch (e) {}
    return false;
  }

  function detectarPerfil() {
    const perfilTest = obtenerPerfilDelTest();
    if (perfilTest) {
      return { perfil: perfilTest, confianza: 95, fuente: 'test' };
    }

    if (tieneGuardianes()) {
      return { perfil: 'coleccionista', confianza: 90, fuente: 'historial' };
    }

    const tiempoEnPagina = Date.now() - estado.tiempoInicio;
    const velocidadScroll = calcularVelocidadScroll();
    const fuenteTrafico = detectarFuente();
    const nocturno = esHorarioNocturno();

    let puntos = {
      vulnerable: 10, // Base
      esceptico: 0,
      impulsivo: 0,
      coleccionista: 0,
      racional: 0
    };

    if (tiempoEnPagina > CONFIG.TIEMPO_RACIONAL) {
      puntos.racional += 25;
      puntos.esceptico += 15;
    } else if (tiempoEnPagina > CONFIG.TIEMPO_ESCEPTICO) {
      puntos.esceptico += 30;
    } else if (tiempoEnPagina < CONFIG.TIEMPO_IMPULSIVO) {
      puntos.impulsivo += 25;
    } else {
      puntos.vulnerable += 15;
    }

    if (velocidadScroll > CONFIG.SCROLL_RAPIDO) {
      puntos.impulsivo += 20;
    } else if (velocidadScroll > 0 && velocidadScroll < 150) {
      puntos.esceptico += 15;
      puntos.racional += 15;
    }

    if (estado.vecesVolvioPrincipo >= CONFIG.RELECTURA_UMBRAL) {
      puntos.esceptico += 25;
      puntos.racional += 10;
    }

    if (fuenteTrafico === 'impulsivo') puntos.impulsivo += 20;
    else if (fuenteTrafico === 'vulnerable') puntos.vulnerable += 15;
    else if (fuenteTrafico === 'racional') puntos.racional += 25;

    if (nocturno) puntos.vulnerable += 20;

    const referrer = document.referrer.toLowerCase();
    if (referrer.includes('duendes') && referrer.includes('product')) {
      puntos.coleccionista += 20;
    }

    const perfiles = Object.entries(puntos);
    perfiles.sort((a, b) => b[1] - a[1]);
    const ganador = perfiles[0];
    const segundo = perfiles[1];
    const diferencia = ganador[1] - segundo[1];
    const confianza = Math.min(50 + diferencia, 90);

    return {
      perfil: ganador[0],
      confianza,
      puntos,
      fuente: 'comportamiento'
    };
  }

  // Obtener cierres desde la API de Vercel
  async function obtenerCierres(productoId) {
    try {
      const response = await fetch(`${CONFIG.API_BASE}/api/producto/${productoId}?campos=cierres`);
      if (response.ok) {
        const data = await response.json();
        return data.cierresDinamicos || data.cierres;
      }
      return null;
    } catch (e) {
      console.warn('[DDU] Error obteniendo cierres:', e);
      return null;
    }
  }

  // Crear el contenedor del cierre
  function crearContenedor() {
    // Buscar el mejor lugar para insertar el cierre
    // Primero buscar selectores específicos de Duendes, luego WooCommerce estándar
    const insertPoints = [
      '.prod-mensaje',              // Después de "Su mensaje para vos"
      '.prod-cuidados-tabs',        // Después de la sección de cuidados
      '.prod-garantia',             // Después de garantía
      '.duendes-producto-page .elementor-section:last-of-type',
      '.woocommerce-product-details__short-description',
      '.product-short-description',
      '.summary.entry-summary',
      '.product_meta',
      '.woocommerce-tabs',
      '.single-product-content'
    ];

    let insertAfter = null;
    for (const selector of insertPoints) {
      const el = document.querySelector(selector);
      if (el) {
        insertAfter = el;
        break;
      }
    }

    const container = document.createElement('div');
    container.id = 'cierre-dinamico';
    container.className = 'cierre-dinamico-container';
    container.style.cssText = `
      margin: 2rem 0;
      padding: 1.5rem;
      background: linear-gradient(135deg, rgba(139, 92, 246, 0.08) 0%, rgba(59, 130, 246, 0.08) 100%);
      border-radius: 12px;
      border-left: 4px solid #8b5cf6;
      opacity: 0;
      transition: opacity 0.5s ease-in-out;
    `;

    // Agregar estilos para los párrafos
    const style = document.createElement('style');
    style.textContent = `
      .cierre-dinamico-container p {
        margin-bottom: 1rem;
        line-height: 1.8;
        color: #374151;
        font-size: 1.05rem;
      }
      .cierre-dinamico-container p:last-child {
        margin-bottom: 0;
      }
    `;
    document.head.appendChild(style);

    if (insertAfter) {
      insertAfter.parentNode.insertBefore(container, insertAfter.nextSibling);
    } else {
      // Fallback: insertar después del formulario de compra
      const cart = document.querySelector('form.cart');
      if (cart) {
        cart.parentNode.insertBefore(container, cart.nextSibling);
      }
    }

    return container;
  }

  // Mostrar el cierre
  function mostrarCierre(container, cierre, perfil) {
    if (!container || !cierre) return;

    container.setAttribute('data-perfil-usado', perfil);

    let cierreHtml = cierre;
    if (!cierre.includes('<')) {
      cierreHtml = cierre
        .split('\n')
        .map(linea => linea.trim() ? `<p>${linea}</p>` : '')
        .join('');
    }

    container.innerHTML = cierreHtml;

    requestAnimationFrame(() => {
      container.style.opacity = '1';
    });
  }

  // Tracking de scroll
  function iniciarTrackingScroll() {
    let ultimoTiempo = Date.now();
    let ultimaPosicion = window.scrollY;

    window.addEventListener('scroll', () => {
      const ahora = Date.now();
      const posicion = window.scrollY;
      const deltaTime = ahora - ultimoTiempo;

      if (deltaTime > 100) {
        const deltaPosicion = Math.abs(posicion - ultimaPosicion);
        const velocidad = (deltaPosicion / deltaTime) * 1000;

        estado.velocidadesScroll.push(velocidad);
        if (estado.velocidadesScroll.length > 20) {
          estado.velocidadesScroll.shift();
        }

        if (posicion < 200 && estado.scrollMaximo > 500) {
          estado.vecesVolvioPrincipo++;
        }

        estado.scrollMaximo = Math.max(estado.scrollMaximo, posicion);
        ultimoTiempo = ahora;
        ultimaPosicion = posicion;
      }
    }, { passive: true });
  }

  // Inicialización
  async function init() {
    const productoId = obtenerProductoId();
    if (!productoId) {
      console.warn('[DDU] No se pudo detectar el ID del producto');
      return;
    }

    // Iniciar tracking
    iniciarTrackingScroll();

    // Obtener cierres
    const cierres = await obtenerCierres(productoId);
    if (!cierres || Object.keys(cierres).length === 0) {
      // No hay cierres para este producto, no hacer nada
      return;
    }

    // Crear contenedor
    const container = crearContenedor();
    if (!container) {
      console.warn('[DDU] No se pudo crear el contenedor');
      return;
    }

    // Guardar cierres en el contenedor para uso posterior
    container.setAttribute('data-cierres', JSON.stringify(cierres));
    container.setAttribute('data-producto-id', productoId);

    // Detección inicial después de 2 segundos
    setTimeout(() => {
      const analisis = detectarPerfil();
      estado.perfilDetectado = analisis.perfil;
      estado.perfilConfianza = analisis.confianza;

      const cierre = cierres[analisis.perfil] || cierres.default || cierres.vulnerable;
      if (cierre) {
        mostrarCierre(container, cierre, analisis.perfil);
      }

      if (window.location.search.includes('debug')) {
        console.log('[DDU] Perfil detectado:', analisis);
        console.log('[DDU] Cierres disponibles:', Object.keys(cierres));
      }
    }, 2000);

    // Re-evaluar cada 15 segundos
    setInterval(() => {
      const nuevoAnalisis = detectarPerfil();
      if (nuevoAnalisis.confianza > estado.perfilConfianza + 15 &&
          nuevoAnalisis.perfil !== estado.perfilDetectado) {
        estado.perfilDetectado = nuevoAnalisis.perfil;
        estado.perfilConfianza = nuevoAnalisis.confianza;
        const nuevoCierre = cierres[nuevoAnalisis.perfil];
        if (nuevoCierre) {
          mostrarCierre(container, nuevoCierre, nuevoAnalisis.perfil);
        }
      }
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
          mostrarCierre(container, cierres[perfil], perfil);
        }
      }
    }
  };

})();
