<?php
/**
 * Plugin Name: Duendes Producto Mágico Loader
 * Description: Carga la página de producto mágica automáticamente
 * Version: 1.0
 * Author: Duendes del Uruguay
 */

if (!defined('ABSPATH')) exit;

// Solo cargar en frontend y páginas de producto
add_action('wp_footer', 'duendes_cargar_pagina_magica', 99);

function duendes_cargar_pagina_magica() {
    // Solo en páginas de producto individual
    if (!is_product()) return;

    // Cargar el archivo HTML
    $archivo = WP_CONTENT_DIR . '/duendes-magic/producto-magico-full.html';

    if (file_exists($archivo)) {
        echo file_get_contents($archivo);
        error_log('[DuendesMagico] Archivo cargado para producto: ' . get_the_ID());
    } else {
        error_log('[DuendesMagico] Archivo no encontrado: ' . $archivo);
    }
}
