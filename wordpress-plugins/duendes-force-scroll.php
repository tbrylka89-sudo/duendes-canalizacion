<?php
/**
 * Plugin Name: Duendes - Force Scroll
 * Description: Fuerza el scroll a funcionar - prioridad maxima
 * Version: 1.0
 */

if (!defined('ABSPATH')) exit;

// CSS con prioridad MAXIMA - se carga en wp_head con prioridad 0
add_action('wp_head', function() {
    ?>
    <style id="duendes-force-scroll-css">
    /* FORZAR SCROLL - MAXIMA PRIORIDAD */
    html {
        overflow-y: scroll !important;
        overflow-x: hidden !important;
        height: auto !important;
        min-height: 100% !important;
        -webkit-overflow-scrolling: touch !important;
        overscroll-behavior-y: auto !important;
        touch-action: pan-y !important;
    }

    body {
        overflow-y: visible !important;
        overflow-x: hidden !important;
        height: auto !important;
        min-height: 100% !important;
        position: static !important;
        -webkit-overflow-scrolling: touch !important;
        overscroll-behavior-y: auto !important;
        touch-action: pan-y !important;
    }

    /* Excepto cuando el menu esta abierto */
    body.menu-movil-abierto {
        overflow: hidden !important;
        position: fixed !important;
    }
    </style>
    <?php
}, 0);

// JavaScript en wp_head tambien - se ejecuta ANTES que cualquier otro
add_action('wp_head', function() {
    ?>
    <script id="duendes-force-scroll-init">
    // Ejecutar inmediatamente
    (function() {
        function forceScroll() {
            var html = document.documentElement;
            var body = document.body;

            if (!body) return;

            // Solo si el menu NO esta abierto
            if (body.classList.contains('menu-movil-abierto')) return;

            // Forzar estilos
            html.style.setProperty('overflow-y', 'scroll', 'important');
            html.style.setProperty('overflow-x', 'hidden', 'important');
            html.style.setProperty('height', 'auto', 'important');

            body.style.setProperty('overflow-y', 'visible', 'important');
            body.style.setProperty('overflow-x', 'hidden', 'important');
            body.style.setProperty('height', 'auto', 'important');
            body.style.setProperty('position', 'static', 'important');

            // Remover clases problematicas
            body.classList.remove('no-scroll');
            body.classList.remove('overflow-hidden');
            body.classList.remove('fixed');
        }

        // Ejecutar ahora
        if (document.body) forceScroll();

        // Y cuando el DOM cargue
        document.addEventListener('DOMContentLoaded', forceScroll);

        // Y despues de cargar todo
        window.addEventListener('load', forceScroll);

        // Y cada 100ms por 5 segundos
        var count = 0;
        var interval = setInterval(function() {
            forceScroll();
            count++;
            if (count > 50) clearInterval(interval);
        }, 100);
    })();
    </script>
    <?php
}, 0);

// Remover el plugin scroll-simple si existe
add_action('muplugins_loaded', function() {
    // Solo asegurar que este plugin tenga prioridad
}, 0);
