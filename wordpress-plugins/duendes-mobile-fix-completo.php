<?php
/**
 * Plugin Name: Duendes - Mobile Fix Completo
 * Description: Corrige todos los problemas de responsive y móvil del sitio
 * Version: 2.0
 * Author: Duendes del Uruguay
 */

if (!defined('ABSPATH')) exit;

// ═══════════════════════════════════════════════════════════════════════════
// ESTILOS RESPONSIVE GLOBALES
// ═══════════════════════════════════════════════════════════════════════════

add_action('wp_head', function() {
    ?>
    <style id="duendes-mobile-fix-completo">
    /* ═══════════════════════════════════════════════════════════════
       1. SCROLL Y BODY - SIEMPRE FUNCIONANDO
       ═══════════════════════════════════════════════════════════════ */
    html {
        overflow-y: auto !important;
        overflow-x: hidden !important;
        height: auto !important;
        -webkit-overflow-scrolling: touch !important;
    }

    body {
        overflow-y: auto !important;
        overflow-x: hidden !important;
        height: auto !important;
        min-height: 100% !important;
        -webkit-overflow-scrolling: touch !important;
    }

    /* Solo bloquear scroll cuando menú está abierto */
    body.menu-movil-abierto {
        overflow: hidden !important;
        position: fixed !important;
        width: 100% !important;
        height: 100% !important;
    }

    /* ═══════════════════════════════════════════════════════════════
       2. HEADER RESPONSIVE MEJORADO
       ═══════════════════════════════════════════════════════════════ */

    /* Header base */
    .duendes-header,
    #duendesHeader,
    header.duendes-header {
        position: fixed !important;
        top: 0 !important;
        left: 0 !important;
        right: 0 !important;
        z-index: 999999 !important;
        background: #0a0a0a !important;
        border-bottom: 1px solid rgba(201, 162, 39, 0.2) !important;
        height: 70px !important;
        display: flex !important;
        align-items: center !important;
        padding: 0 20px !important;
        transform: translateY(0) !important;
        opacity: 1 !important;
        visibility: visible !important;
    }

    /* Espacio para el header fijo */
    body {
        padding-top: 70px !important;
        margin-top: 0 !important;
    }

    /* Admin bar adjustment */
    body.admin-bar .duendes-header,
    body.admin-bar #duendesHeader {
        top: 32px !important;
    }
    body.admin-bar {
        padding-top: 102px !important;
    }
    @media (max-width: 782px) {
        body.admin-bar .duendes-header,
        body.admin-bar #duendesHeader {
            top: 46px !important;
        }
        body.admin-bar {
            padding-top: 116px !important;
        }
    }

    /* ═══════════════════════════════════════════════════════════════
       3. MENÚ MÓVIL MEJORADO
       ═══════════════════════════════════════════════════════════════ */

    /* Botón hamburguesa - siempre visible en móvil */
    .menu-hamburguesa,
    .hamburger-btn,
    .mobile-menu-toggle,
    #menuBtn,
    button[class*="hamburger"],
    button[class*="menu-toggle"] {
        display: none !important;
    }

    @media (max-width: 1024px) {
        /* BOTÓN HAMBURGUESA - Área táctil 44px OBLIGATORIA */
        .menu-hamburguesa,
        .hamburger-btn,
        .mobile-menu-toggle,
        #menuBtn,
        .header-menu-btn,
        button[class*="hamburger"],
        button[class*="menu-toggle"],
        button[class*="menu-btn"] {
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            min-width: 44px !important;
            min-height: 44px !important;
            width: 44px !important;
            height: 44px !important;
            background: rgba(201, 162, 39, 0.1) !important;
            border: 1px solid rgba(201, 162, 39, 0.3) !important;
            border-radius: 8px !important;
            cursor: pointer !important;
            padding: 10px !important;
            z-index: 1000001 !important;
            position: relative !important;
            -webkit-tap-highlight-color: transparent !important;
            touch-action: manipulation !important;
        }

        .header-menu-btn:active,
        #menuBtn:active,
        .menu-hamburguesa:active {
            background: rgba(201, 162, 39, 0.2) !important;
            transform: scale(0.95) !important;
        }

        /* Ocultar navegación desktop en móvil */
        .header-nav,
        .header-izquierda nav,
        .nav-desktop,
        .desktop-menu {
            display: none !important;
        }
    }

    /* BOTÓN CERRAR MENÚ - Siempre visible y grande */
    .menu-close-btn,
    .cerrar-menu,
    #cerrarMenuBtn,
    .mobile-menu .close-btn,
    #mobileMenu .close-btn,
    .ddu-cierre-close {
        position: absolute !important;
        top: 15px !important;
        right: 15px !important;
        min-width: 48px !important;
        min-height: 48px !important;
        width: 48px !important;
        height: 48px !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        background: rgba(201, 162, 39, 0.15) !important;
        border: 2px solid rgba(201, 162, 39, 0.4) !important;
        border-radius: 50% !important;
        color: #c9a227 !important;
        font-size: 28px !important;
        font-weight: 300 !important;
        cursor: pointer !important;
        z-index: 1000002 !important;
        -webkit-tap-highlight-color: transparent !important;
        touch-action: manipulation !important;
        transition: all 0.2s ease !important;
    }

    .menu-close-btn:hover,
    .menu-close-btn:active,
    .cerrar-menu:hover,
    .cerrar-menu:active,
    #cerrarMenuBtn:hover,
    #cerrarMenuBtn:active {
        background: rgba(201, 162, 39, 0.3) !important;
        transform: scale(1.05) !important;
    }

    /* Menú móvil overlay */
    #mobileMenu,
    .mobile-menu,
    .menu-movil {
        position: fixed !important;
        top: 0 !important;
        left: 0 !important;
        right: 0 !important;
        bottom: 0 !important;
        width: 100% !important;
        height: 100vh !important;
        height: 100dvh !important;
        background: rgba(10, 10, 10, 0.98) !important;
        z-index: 1000000 !important;
        display: none !important;
        flex-direction: column !important;
        align-items: center !important;
        justify-content: center !important;
        padding: 80px 20px 40px !important;
        overflow-y: auto !important;
        -webkit-overflow-scrolling: touch !important;
        opacity: 0 !important;
        visibility: hidden !important;
        transition: opacity 0.3s ease, visibility 0.3s ease !important;
    }

    #mobileMenu.activo,
    .mobile-menu.activo,
    .menu-movil.activo {
        display: flex !important;
        opacity: 1 !important;
        visibility: visible !important;
    }

    /* Botón cerrar del menú móvil - SIEMPRE VISIBLE */
    .menu-close-btn,
    .cerrar-menu,
    #mobileMenu .close-btn,
    .mobile-menu .close-btn {
        position: absolute !important;
        top: 20px !important;
        right: 20px !important;
        width: 44px !important;
        height: 44px !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        background: rgba(201, 162, 39, 0.1) !important;
        border: 1px solid rgba(201, 162, 39, 0.3) !important;
        border-radius: 50% !important;
        color: #c9a227 !important;
        font-size: 24px !important;
        cursor: pointer !important;
        z-index: 1000002 !important;
        -webkit-tap-highlight-color: transparent !important;
        touch-action: manipulation !important;
    }

    .menu-close-btn:hover,
    .cerrar-menu:hover {
        background: rgba(201, 162, 39, 0.2) !important;
    }

    /* Links del menú móvil */
    #mobileMenu a,
    .mobile-menu a,
    .menu-movil a {
        display: block !important;
        padding: 16px 24px !important;
        font-family: 'Cinzel', serif !important;
        font-size: 18px !important;
        color: rgba(255,255,255,0.9) !important;
        text-decoration: none !important;
        letter-spacing: 2px !important;
        text-transform: uppercase !important;
        text-align: center !important;
        width: 100% !important;
        max-width: 300px !important;
        border-bottom: 1px solid rgba(201, 162, 39, 0.15) !important;
        transition: color 0.3s ease, background 0.3s ease !important;
        -webkit-tap-highlight-color: transparent !important;
    }

    #mobileMenu a:last-child,
    .mobile-menu a:last-child {
        border-bottom: none !important;
    }

    #mobileMenu a:hover,
    #mobileMenu a:active,
    .mobile-menu a:hover,
    .mobile-menu a:active {
        color: #c9a227 !important;
        background: rgba(201, 162, 39, 0.05) !important;
    }

    /* ═══════════════════════════════════════════════════════════════
       4. GRIDS RESPONSIVE - TODOS LOS BREAKPOINTS
       ═══════════════════════════════════════════════════════════════ */

    /* Breakpoint: Tablets grandes (1024px) */
    @media (max-width: 1024px) {
        .galeria-masonry,
        .productos-grid,
        .masonry-grid,
        [class*="grid-cols-5"],
        [class*="grid-cols-4"] {
            grid-template-columns: repeat(3, 1fr) !important;
        }

        .categorias-grid {
            grid-template-columns: repeat(3, 1fr) !important;
        }
    }

    /* Breakpoint: Tablets (768px) */
    @media (max-width: 768px) {
        .galeria-masonry,
        .productos-grid,
        .masonry-grid,
        [class*="grid-cols-5"],
        [class*="grid-cols-4"],
        [class*="grid-cols-3"] {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 15px !important;
        }

        .categorias-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 15px !important;
        }

        /* Secciones */
        section,
        .elementor-section,
        .e-con {
            padding-left: 15px !important;
            padding-right: 15px !important;
        }

        /* Titulos */
        h1 {
            font-size: clamp(24px, 6vw, 36px) !important;
        }

        h2 {
            font-size: clamp(20px, 5vw, 28px) !important;
        }

        /* Botones */
        .btn, button, .button,
        a.btn, a.button,
        [class*="btn-"],
        [class*="button-"] {
            padding: 12px 24px !important;
            font-size: 14px !important;
            min-height: 44px !important;
        }
    }

    /* Breakpoint: Móviles grandes (600px) */
    @media (max-width: 600px) {
        .galeria-masonry,
        .productos-grid,
        .masonry-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 12px !important;
        }

        .categorias-grid,
        .recomendaciones-grid,
        .numerologia-grid {
            grid-template-columns: 1fr !important;
            gap: 12px !important;
        }

        /* Secciones con menos padding */
        .section,
        section.section {
            padding: 25px 15px !important;
        }

        /* Galería items más pequeños */
        .galeria-item,
        .producto-card,
        .guardian-card {
            min-height: 200px !important;
        }

        .galeria-item img,
        .producto-card img,
        .guardian-card img {
            height: 150px !important;
            object-fit: cover !important;
        }
    }

    /* Breakpoint: Móviles pequeños (480px) */
    @media (max-width: 480px) {
        body {
            font-size: 16px !important;
        }

        /* Una columna para todo */
        .galeria-masonry,
        .productos-grid,
        .masonry-grid,
        [class*="grid-cols"] {
            grid-template-columns: 1fr !important;
        }

        /* Header más compacto */
        .duendes-header,
        #duendesHeader {
            height: 60px !important;
            padding: 0 12px !important;
        }

        body {
            padding-top: 60px !important;
        }

        /* Logo más pequeño */
        .header-logo-nombre,
        .header-logo-texto span {
            font-size: 14px !important;
            letter-spacing: 1px !important;
        }

        /* CTAs full width */
        .btn-cta,
        .cta-button,
        .btn-primary,
        a[class*="cta"] {
            width: 100% !important;
            max-width: 100% !important;
            text-align: center !important;
            justify-content: center !important;
        }

        /* Mensaje del guardián */
        .mensaje-guardian {
            padding: 20px 15px !important;
            font-size: 16px !important;
        }

        .mensaje-guardian::before {
            font-size: 40px !important;
            top: 5px !important;
            left: 8px !important;
        }
    }

    /* Breakpoint: Móviles muy pequeños (360px) */
    @media (max-width: 360px) {
        .duendes-header,
        #duendesHeader {
            height: 56px !important;
            padding: 0 10px !important;
        }

        body {
            padding-top: 56px !important;
        }

        .galeria-item,
        .producto-card {
            min-height: 180px !important;
        }

        h1 {
            font-size: 22px !important;
        }

        h2 {
            font-size: 18px !important;
        }
    }

    /* ═══════════════════════════════════════════════════════════════
       5. GALERÍA MASONRY - FIX ESPECÍFICO
       ═══════════════════════════════════════════════════════════════ */

    /* Reset de spans de grid que causan problemas */
    @media (max-width: 900px) {
        .galeria-masonry > *,
        .masonry-grid > *,
        [class*="masonry"] > * {
            grid-column: span 1 !important;
            grid-row: span 1 !important;
        }

        /* Altura uniforme */
        .galeria-item,
        .masonry-item {
            height: 280px !important;
            min-height: 280px !important;
            max-height: 280px !important;
        }
    }

    @media (max-width: 600px) {
        .galeria-item,
        .masonry-item {
            height: 220px !important;
            min-height: 220px !important;
            max-height: 220px !important;
        }
    }

    /* ═══════════════════════════════════════════════════════════════
       6. ANIMACIONES - REDUCIR EN MÓVIL Y RESPETAR PREFERENCIAS
       ═══════════════════════════════════════════════════════════════ */

    /* Respetar preferencia de movimiento reducido */
    @media (prefers-reduced-motion: reduce) {
        *,
        *::before,
        *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
            scroll-behavior: auto !important;
        }
    }

    /* Reducir animaciones en móvil para mejor rendimiento */
    @media (max-width: 768px) {
        .particle,
        .particula,
        [class*="particle"],
        [class*="float"],
        [class*="shimmer"],
        [class*="pulse-"],
        [class*="glow-animation"] {
            animation: none !important;
            opacity: 0 !important;
            display: none !important;
        }

        /* Mantener solo animaciones esenciales */
        .spinner,
        .loading-spinner,
        [class*="spin"] {
            animation-duration: 1s !important;
        }
    }

    /* ═══════════════════════════════════════════════════════════════
       7. TOUCH Y INTERACCIÓN - MEJORAR TÁCTIL
       ═══════════════════════════════════════════════════════════════ */

    /* Asegurar que los elementos sean tocables */
    a, button, input, select, textarea,
    [role="button"],
    [onclick],
    .clickable,
    .touchable {
        -webkit-tap-highlight-color: rgba(201, 162, 39, 0.2) !important;
        touch-action: manipulation !important;
    }

    /* Tamaño mínimo para elementos táctiles (44x44px recomendado) */
    @media (pointer: coarse) {
        a, button,
        input[type="submit"],
        input[type="button"],
        .btn, .button {
            min-height: 44px !important;
            min-width: 44px !important;
        }
    }

    /* Fix para pointer-events bloqueados */
    .galeria-item,
    .producto-card,
    .guardian-card,
    a.card,
    [class*="card"] a {
        pointer-events: auto !important;
    }

    /* ═══════════════════════════════════════════════════════════════
       8. IMÁGENES RESPONSIVE
       ═══════════════════════════════════════════════════════════════ */

    img {
        max-width: 100% !important;
        height: auto !important;
    }

    /* Imágenes de producto */
    .producto-imagen,
    .guardian-imagen,
    .galeria-item img {
        width: 100% !important;
        object-fit: cover !important;
        aspect-ratio: 1 / 1 !important;
    }

    /* Lazy loading visual */
    img[loading="lazy"] {
        background: linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%) !important;
    }

    /* ═══════════════════════════════════════════════════════════════
       9. OVERFLOW Y SCROLL HORIZONTAL
       ═══════════════════════════════════════════════════════════════ */

    /* Prevenir scroll horizontal */
    .container,
    .wrapper,
    main,
    .content,
    article,
    section {
        max-width: 100vw !important;
        overflow-x: hidden !important;
    }

    /* Carruseles que sí necesitan scroll horizontal */
    .carousel,
    .swiper,
    .slick-slider,
    [class*="carousel"],
    [class*="slider"] {
        overflow-x: auto !important;
        -webkit-overflow-scrolling: touch !important;
        scrollbar-width: none !important;
        -ms-overflow-style: none !important;
    }

    .carousel::-webkit-scrollbar,
    .swiper::-webkit-scrollbar,
    [class*="carousel"]::-webkit-scrollbar {
        display: none !important;
    }

    /* ═══════════════════════════════════════════════════════════════
       10. TEXTOS Y TIPOGRAFÍA RESPONSIVE
       ═══════════════════════════════════════════════════════════════ */

    @media (max-width: 600px) {
        /* Evitar letter-spacing excesivo */
        h1, h2, h3, h4, h5, h6,
        .titulo, [class*="title"],
        [class*="heading"] {
            letter-spacing: 1px !important;
        }

        /* Texto legible */
        p, span, li, a {
            font-size: 16px !important;
            line-height: 1.6 !important;
        }

        /* Descripción en cards */
        .card-description,
        .producto-descripcion,
        .galeria-descripcion {
            font-size: 14px !important;
            -webkit-line-clamp: 3 !important;
            overflow: hidden !important;
            display: -webkit-box !important;
            -webkit-box-orient: vertical !important;
        }
    }

    /* ═══════════════════════════════════════════════════════════════
       11. BANNER PROMOCIONAL RESPONSIVE
       ═══════════════════════════════════════════════════════════════ */

    @media (max-width: 768px) {
        .promo-banner,
        .banner-promocion,
        [class*="promo-banner"] {
            flex-direction: column !important;
            text-align: center !important;
            padding: 15px !important;
        }

        .promo-banner .carousel,
        .mini-carousel {
            width: 100% !important;
            max-width: 200px !important;
            margin: 0 auto !important;
        }
    }

    /* ═══════════════════════════════════════════════════════════════
       12. Z-INDEX CONSOLIDADO
       ═══════════════════════════════════════════════════════════════ */

    /* Capa base: contenido normal */
    /* Capa 100-999: elementos elevados (cards, dropdowns) */
    /* Capa 1000-9999: overlays (modales, popups) */
    /* Capa 10000-99999: elementos fijos (header, menú) */
    /* Capa 100000+: elementos críticos (Tito, alertas) */

    /* Header */
    .duendes-header,
    #duendesHeader {
        z-index: 99999 !important;
    }

    /* Menú móvil */
    #mobileMenu,
    .mobile-menu {
        z-index: 100000 !important;
    }

    /* Tito siempre arriba */
    .tito-widget,
    #titoWidget {
        z-index: 9999999 !important;
    }

    /* ═══════════════════════════════════════════════════════════════
       13. FOOTER RESPONSIVE
       ═══════════════════════════════════════════════════════════════ */

    @media (max-width: 600px) {
        .duendes-footer-garantizado {
            padding: 30px 15px !important;
        }

        .duendes-footer-nombre {
            font-size: 16px !important;
            letter-spacing: 1px !important;
        }

        .duendes-footer-legal {
            flex-direction: column !important;
            gap: 10px !important;
        }

        .duendes-footer-sep {
            display: none !important;
        }

        .duendes-footer-copyright {
            font-size: 11px !important;
        }
    }

    /* ═══════════════════════════════════════════════════════════════
       14. FIXES ESPECÍFICOS PARA ELEMENTOR
       ═══════════════════════════════════════════════════════════════ */

    @media (max-width: 768px) {
        /* Columnas de Elementor */
        .elementor-column,
        .elementor-col-50,
        .elementor-col-33,
        .elementor-col-25 {
            width: 100% !important;
            max-width: 100% !important;
        }

        /* Secciones de Elementor */
        .elementor-section,
        .e-con {
            padding-left: 15px !important;
            padding-right: 15px !important;
        }

        /* Gaps de Elementor */
        .elementor-section .elementor-container {
            gap: 20px !important;
        }
    }

    /* ═══════════════════════════════════════════════════════════════
       15. ACCESIBILIDAD
       ═══════════════════════════════════════════════════════════════ */

    /* Focus visible mejorado */
    a:focus-visible,
    button:focus-visible,
    input:focus-visible,
    select:focus-visible,
    textarea:focus-visible {
        outline: 2px solid #c9a227 !important;
        outline-offset: 2px !important;
    }

    /* Contraste en textos grises */
    @media (max-width: 768px) {
        .text-muted,
        .text-secondary,
        [style*="opacity: 0.5"],
        [style*="opacity:0.5"] {
            opacity: 0.7 !important;
        }
    }

    /* Skip link para navegación por teclado */
    .skip-link {
        position: absolute !important;
        top: -40px !important;
        left: 0 !important;
        background: #c9a227 !important;
        color: #0a0a0a !important;
        padding: 8px 16px !important;
        z-index: 10000000 !important;
        transition: top 0.3s !important;
    }

    .skip-link:focus {
        top: 0 !important;
    }
    </style>
    <?php
}, 1);

// ═══════════════════════════════════════════════════════════════════════════
// JAVASCRIPT PARA MENÚ MÓVIL MEJORADO
// ═══════════════════════════════════════════════════════════════════════════

add_action('wp_footer', function() {
    ?>
    <script id="duendes-mobile-menu-fix">
    (function() {
        'use strict';

        // Variables del menú
        var menuBtn = null;
        var mobileMenu = null;
        var closeBtn = null;
        var body = document.body;
        var scrollPos = 0;

        // Función para encontrar o crear elementos del menú
        function initMenu() {
            // Buscar botón hamburguesa (múltiples selectores)
            menuBtn = document.getElementById('menuBtn') ||
                      document.querySelector('.menu-hamburguesa') ||
                      document.querySelector('.hamburger-btn') ||
                      document.querySelector('.mobile-menu-toggle') ||
                      document.querySelector('.header-menu-btn') ||
                      document.querySelector('button[class*="hamburger"]') ||
                      document.querySelector('button[class*="menu-btn"]');

            // Buscar menú móvil
            mobileMenu = document.getElementById('mobileMenu') ||
                         document.querySelector('.mobile-menu') ||
                         document.querySelector('.menu-movil');

            // Si no hay menú móvil, crear uno básico
            if (!mobileMenu && menuBtn) {
                crearMenuMovil();
            }

            // Buscar o crear botón de cerrar
            if (mobileMenu) {
                closeBtn = mobileMenu.querySelector('.menu-close-btn') ||
                           mobileMenu.querySelector('.cerrar-menu') ||
                           mobileMenu.querySelector('.close-btn') ||
                           mobileMenu.querySelector('.ddu-cierre-close') ||
                           document.getElementById('cerrarMenuBtn');

                if (!closeBtn) {
                    crearBotonCerrar();
                }

                // Agregar link de Mi Magia si no existe
                agregarLinkMiMagia();
            }

            // Agregar event listeners
            if (menuBtn) {
                menuBtn.removeEventListener('click', toggleMenu);
                menuBtn.addEventListener('click', toggleMenu);
            }

            if (closeBtn) {
                closeBtn.removeEventListener('click', cerrarMenu);
                closeBtn.addEventListener('click', cerrarMenu);
            }

            // Cerrar con Escape
            document.removeEventListener('keydown', handleEscape);
            document.addEventListener('keydown', handleEscape);

            // Cerrar al hacer click en overlay
            if (mobileMenu) {
                mobileMenu.removeEventListener('click', handleOverlayClick);
                mobileMenu.addEventListener('click', handleOverlayClick);
            }
        }

        // Agregar link de Mi Magia si no existe
        function agregarLinkMiMagia() {
            if (!mobileMenu) return;

            // Verificar si ya existe el link
            var existeMiMagia = mobileMenu.querySelector('a[href*="mi-magia"]');
            if (existeMiMagia) return;

            // Crear el link
            var miMagiaLink = document.createElement('a');
            miMagiaLink.href = '/mi-magia/';
            miMagiaLink.innerHTML = '<span style="margin-right:8px;">✨</span> Mi Magia';
            miMagiaLink.style.cssText = 'display:flex !important; align-items:center !important;';

            // Buscar dónde insertarlo (después de FAQ o antes del último link)
            var faqLink = mobileMenu.querySelector('a[href*="faq"]');
            var contactoLink = mobileMenu.querySelector('a[href*="contacto"]');

            if (faqLink && faqLink.nextSibling) {
                mobileMenu.insertBefore(miMagiaLink, faqLink.nextSibling);
            } else if (contactoLink) {
                mobileMenu.insertBefore(miMagiaLink, contactoLink);
            } else {
                // Agregar antes del último link
                var links = mobileMenu.querySelectorAll('a');
                if (links.length > 0) {
                    var lastLink = links[links.length - 1];
                    mobileMenu.insertBefore(miMagiaLink, lastLink);
                }
            }
        }

        function crearMenuMovil() {
            var menu = document.createElement('nav');
            menu.id = 'mobileMenu';
            menu.className = 'mobile-menu';
            menu.setAttribute('role', 'navigation');
            menu.setAttribute('aria-label', 'Menú principal');

            // Links del menú
            menu.innerHTML = `
                <button class="menu-close-btn cerrar-menu" aria-label="Cerrar menú">×</button>
                <a href="/shop/">Tienda</a>
                <a href="/descubri-que-duende-te-elige/">Test del Guardián</a>
                <a href="/como-funciona/">Cómo Funciona</a>
                <a href="/mi-magia/">Mi Magia</a>
                <a href="/faq/">FAQ</a>
                <a href="/contacto/">Contacto</a>
                <a href="/mi-cuenta/">Mi Cuenta</a>
            `;

            document.body.appendChild(menu);
            mobileMenu = menu;

            // Obtener botón de cerrar recién creado
            closeBtn = menu.querySelector('.menu-close-btn');
        }

        function crearBotonCerrar() {
            if (!mobileMenu) return;

            var btn = document.createElement('button');
            btn.className = 'menu-close-btn cerrar-menu';
            btn.setAttribute('aria-label', 'Cerrar menú');
            btn.innerHTML = '×';
            mobileMenu.insertBefore(btn, mobileMenu.firstChild);
            closeBtn = btn;
        }

        function toggleMenu(e) {
            if (e) e.preventDefault();
            if (!mobileMenu) return;

            if (mobileMenu.classList.contains('activo')) {
                cerrarMenu();
            } else {
                abrirMenu();
            }
        }

        function abrirMenu() {
            if (!mobileMenu) return;

            // Guardar posición de scroll
            scrollPos = window.pageYOffset;

            // Abrir menú
            mobileMenu.classList.add('activo');
            body.classList.add('menu-movil-abierto');

            // Mantener posición cuando se bloquea scroll
            body.style.top = '-' + scrollPos + 'px';

            // Focus en botón cerrar para accesibilidad
            if (closeBtn) {
                setTimeout(function() {
                    closeBtn.focus();
                }, 100);
            }
        }

        function cerrarMenu() {
            if (!mobileMenu) return;

            // Cerrar menú
            mobileMenu.classList.remove('activo');
            body.classList.remove('menu-movil-abierto');

            // Restaurar scroll
            body.style.top = '';
            window.scrollTo(0, scrollPos);

            // Focus de vuelta al botón hamburguesa
            if (menuBtn) {
                menuBtn.focus();
            }
        }

        function handleEscape(e) {
            if (e.key === 'Escape' && mobileMenu && mobileMenu.classList.contains('activo')) {
                cerrarMenu();
            }
        }

        function handleOverlayClick(e) {
            // Solo cerrar si click fue directamente en el overlay, no en los links
            if (e.target === mobileMenu) {
                cerrarMenu();
            }
        }

        // Cerrar menú al hacer click en cualquier link del menú
        function setupLinkListeners() {
            if (!mobileMenu) return;

            var links = mobileMenu.querySelectorAll('a');
            links.forEach(function(link) {
                link.addEventListener('click', function() {
                    setTimeout(cerrarMenu, 100);
                });
            });
        }

        // Asegurar scroll siempre funcione
        function fixScroll() {
            var menuAbierto = body.classList.contains('menu-movil-abierto');

            if (!menuAbierto) {
                document.documentElement.style.overflowY = 'auto';
                document.documentElement.style.overflowX = 'hidden';
                body.style.overflowY = 'auto';
                body.style.overflowX = 'hidden';
                body.style.position = '';
                body.style.width = '';
                body.style.height = '';
            }
        }

        // Inicializar
        function init() {
            initMenu();
            setupLinkListeners();
            fixScroll();
        }

        // Ejecutar cuando DOM esté listo
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
        } else {
            init();
        }

        // Re-inicializar después de que cargue todo
        window.addEventListener('load', init);

        // Fix periódico del scroll
        setInterval(fixScroll, 500);

        // Re-inicializar si cambia el tamaño de pantalla
        var resizeTimer;
        window.addEventListener('resize', function() {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(function() {
                // Cerrar menú en resize a desktop
                if (window.innerWidth > 1024 && mobileMenu && mobileMenu.classList.contains('activo')) {
                    cerrarMenu();
                }
            }, 250);
        });
    })();
    </script>
    <?php
}, 999);

// ═══════════════════════════════════════════════════════════════════════════
// AGREGAR VIEWPORT META TAG CORRECTO
// ═══════════════════════════════════════════════════════════════════════════

add_action('wp_head', function() {
    ?>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes">
    <?php
}, 0);

// ═══════════════════════════════════════════════════════════════════════════
// AGREGAR SKIP LINK PARA ACCESIBILIDAD
// ═══════════════════════════════════════════════════════════════════════════

add_action('wp_body_open', function() {
    echo '<a href="#main-content" class="skip-link">Saltar al contenido principal</a>';
}, 1);
