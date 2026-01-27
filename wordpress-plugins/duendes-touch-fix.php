<?php
/**
 * Plugin Name: Duendes - Touch Fix
 * Description: Fix específico para dispositivos táctiles reales
 * Version: 1.0
 */

if (!defined('ABSPATH')) exit;

add_action('wp_head', function() {
    ?>
    <style id="duendes-touch-fix-css">
    /* Fix para dispositivos táctiles */
    html, body {
        touch-action: pan-y !important;
        -webkit-overflow-scrolling: touch !important;
        overscroll-behavior: auto !important;
        overflow-y: auto !important;
        overflow-x: hidden !important;
    }

    /* Asegurar que todos los contenedores permitan scroll táctil */
    *, *::before, *::after {
        touch-action: inherit !important;
    }

    /* Header NO debe bloquear touch */
    .elementor-location-header,
    [data-elementor-type="header"],
    header {
        touch-action: auto !important;
    }
    </style>

    <script id="duendes-touch-fix-js">
    (function() {
        // Detectar si es dispositivo táctil real
        var isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

        if (!isTouchDevice) return;

        console.log('[Touch Fix] Dispositivo táctil detectado');

        // Prevenir que otros scripts bloqueen el scroll
        var originalPreventDefault = Event.prototype.preventDefault;
        Event.prototype.preventDefault = function() {
            // Permitir preventDefault solo si NO es un evento de scroll/touch en el documento
            if ((this.type === 'touchmove' || this.type === 'touchstart' || this.type === 'wheel') &&
                (this.target === document || this.target === document.body || this.target === document.documentElement)) {
                console.log('[Touch Fix] Bloqueado preventDefault en', this.type);
                return;
            }
            return originalPreventDefault.apply(this, arguments);
        };

        // Forzar estilos de scroll en touch
        function enableTouchScroll() {
            document.documentElement.style.touchAction = 'pan-y';
            document.documentElement.style.webkitOverflowScrolling = 'touch';
            document.documentElement.style.overflowY = 'auto';

            document.body.style.touchAction = 'pan-y';
            document.body.style.webkitOverflowScrolling = 'touch';
            document.body.style.overflowY = 'auto';
            document.body.style.position = 'relative';
        }

        enableTouchScroll();
        document.addEventListener('DOMContentLoaded', enableTouchScroll);
        window.addEventListener('load', enableTouchScroll);

        // Ejecutar cada 500ms
        setInterval(enableTouchScroll, 500);
    })();
    </script>
    <?php
}, 1);
