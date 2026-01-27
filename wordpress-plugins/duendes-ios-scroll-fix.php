<?php
/**
 * Plugin Name: Duendes - iOS Scroll Fix
 * Description: Fix crítico para scroll en iOS Safari
 * Version: 1.0
 * Priority: PRIMERO - Carga antes que otros
 */

if (!defined('ABSPATH')) exit;

// Cargar MUY temprano en wp_head
add_action('wp_head', function() {
    ?>
    <style id="duendes-ios-scroll-critical">
    /* ═══════════════════════════════════════════════════════════════
       FIX CRÍTICO iOS SAFARI - SCROLL
       Carga ANTES que otros estilos para establecer base correcta
       ═══════════════════════════════════════════════════════════════ */

    /* Reset de scroll - iOS necesita esto EXPLÍCITO */
    html {
        height: 100% !important;
        overflow-y: scroll !important;
        overflow-x: hidden !important;
        -webkit-overflow-scrolling: touch !important;
        overscroll-behavior: none !important;
    }

    body {
        min-height: 100% !important;
        height: auto !important;
        overflow-y: visible !important;
        overflow-x: hidden !important;
        -webkit-overflow-scrolling: touch !important;
        position: relative !important;
        overscroll-behavior: none !important;
    }

    /* SOLO bloquear cuando menú está abierto - Y guardar posición */
    body.menu-movil-abierto {
        overflow: hidden !important;
        position: fixed !important;
        width: 100% !important;
        left: 0 !important;
        right: 0 !important;
        /* top se setea via JS para mantener posición */
    }

    /* Header SIEMPRE visible */
    .duendes-header,
    #duendesHeader,
    header.duendes-header,
    .site-header {
        position: fixed !important;
        top: 0 !important;
        left: 0 !important;
        right: 0 !important;
        width: 100% !important;
        z-index: 999999 !important;
        transform: none !important;
        opacity: 1 !important;
        visibility: visible !important;
        display: flex !important;
    }

    /* Espacio para header - usar margin, no padding para iOS */
    body:not(.menu-movil-abierto) {
        margin-top: 70px !important;
        padding-top: 0 !important;
    }

    @media (max-width: 480px) {
        body:not(.menu-movil-abierto) {
            margin-top: 60px !important;
        }
    }

    /* Admin bar adjustment */
    body.admin-bar .duendes-header,
    body.admin-bar #duendesHeader {
        top: 32px !important;
    }
    body.admin-bar:not(.menu-movil-abierto) {
        margin-top: 102px !important;
    }
    @media (max-width: 782px) {
        body.admin-bar .duendes-header,
        body.admin-bar #duendesHeader {
            top: 46px !important;
        }
        body.admin-bar:not(.menu-movil-abierto) {
            margin-top: 106px !important;
        }
    }

    /* Asegurar que el contenido principal sea scrolleable */
    main,
    #main,
    .site-main,
    .content,
    #content,
    .elementor {
        position: relative !important;
        overflow: visible !important;
    }

    /* NO aplicar overflow hidden a containers generales */
    .container,
    .wrapper,
    section,
    article {
        overflow: visible !important;
    }

    /* Solo aplicar overflow-x hidden donde sea necesario */
    .elementor-section,
    .e-con {
        overflow-x: clip !important; /* clip es mejor que hidden para scroll */
        overflow-y: visible !important;
    }
    </style>
    <?php
}, 1); // Prioridad 1 = muy temprano

// JavaScript para manejar el scroll en iOS
add_action('wp_footer', function() {
    ?>
    <script id="duendes-ios-scroll-fix">
    (function() {
        'use strict';

        // Detectar iOS
        var isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) ||
                    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

        var scrollPosition = 0;
        var body = document.body;

        // Función para habilitar scroll
        function enableScroll() {
            body.classList.remove('menu-movil-abierto');
            body.style.removeProperty('top');
            body.style.removeProperty('position');
            body.style.removeProperty('width');
            body.style.removeProperty('overflow');

            // Restaurar posición de scroll
            if (scrollPosition > 0) {
                window.scrollTo(0, scrollPosition);
            }

            // Forzar recálculo en iOS
            if (isIOS) {
                document.documentElement.style.height = '100%';
                setTimeout(function() {
                    document.documentElement.style.height = '';
                }, 10);
            }
        }

        // Función para deshabilitar scroll (cuando menú abierto)
        function disableScroll() {
            scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
            body.classList.add('menu-movil-abierto');
            body.style.top = '-' + scrollPosition + 'px';
        }

        // Monitorear cambios en la clase del body
        var observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.attributeName === 'class') {
                    var menuAbierto = body.classList.contains('menu-movil-abierto');

                    if (!menuAbierto && body.style.position === 'fixed') {
                        // El menú se cerró pero el body sigue fijo
                        enableScroll();
                    }
                }
            });
        });

        observer.observe(body, { attributes: true });

        // Fix inmediato al cargar
        function fixInicial() {
            // Si el menú no está abierto, asegurar scroll
            if (!body.classList.contains('menu-movil-abierto')) {
                enableScroll();
            }

            // Asegurar que el header sea visible
            var headers = document.querySelectorAll('.duendes-header, #duendesHeader, header.duendes-header');
            headers.forEach(function(header) {
                header.style.setProperty('visibility', 'visible', 'important');
                header.style.setProperty('opacity', '1', 'important');
                header.style.setProperty('display', 'flex', 'important');
            });
        }

        // Ejecutar inmediatamente
        fixInicial();

        // También al cargar
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', fixInicial);
        }
        window.addEventListener('load', fixInicial);

        // Fix periódico para iOS (cada segundo por 10 segundos)
        var fixCount = 0;
        var fixInterval = setInterval(function() {
            if (!body.classList.contains('menu-movil-abierto')) {
                enableScroll();
            }
            fixCount++;
            if (fixCount >= 10) {
                clearInterval(fixInterval);
            }
        }, 1000);

        // Exponer funciones globalmente para que otros scripts las usen
        window.duendesScroll = {
            enable: enableScroll,
            disable: disableScroll,
            getPosition: function() { return scrollPosition; }
        };

        console.log('[iOS Scroll Fix] Inicializado' + (isIOS ? ' (iOS detectado)' : ''));
    })();
    </script>
    <?php
}, 1); // Prioridad 1 = muy temprano
