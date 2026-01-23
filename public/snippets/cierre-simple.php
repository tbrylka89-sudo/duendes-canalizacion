<?php
/**
 * CIERRE DINÁMICO - VERSIÓN ULTRA SIMPLE
 *
 * Solo carga el script desde Vercel, que hace todo el trabajo.
 *
 * Agregar en WordPress:
 * - Code Snippets plugin, o
 * - functions.php del tema hijo
 */

// Cargar script en páginas de producto
add_action('wp_footer', function() {
    if (function_exists('is_product') && is_product()) {
        echo '<script src="https://duendes-vercel.vercel.app/js/cierre-dinamico-autonomo.js" defer></script>';
    }
});
