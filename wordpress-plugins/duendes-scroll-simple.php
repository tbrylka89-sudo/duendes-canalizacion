<?php
/**
 * Plugin Name: Duendes - Scroll Simple Fix
 * Description: Fix minimo para scroll - sin CSS agresivo
 * Version: 1.0
 */

if (!defined('ABSPATH')) exit;

// Solo JavaScript para asegurar scroll
add_action('wp_footer', function() {
    ?>
    <script>
    (function() {
        // Asegurar que el body pueda scrollear
        document.documentElement.style.overflow = '';
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.height = '';
        document.body.style.width = '';

        // Remover clases que bloquean scroll
        document.body.classList.remove('menu-movil-abierto');
        document.body.classList.remove('no-scroll');
        document.body.classList.remove('overflow-hidden');

        console.log('[Scroll Fix] Scroll habilitado');
    })();
    </script>
    <?php
}, 99999);
