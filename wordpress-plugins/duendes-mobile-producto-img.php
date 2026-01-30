<?php
/**
 * Plugin Name: Duendes - Imagen producto mobile
 * Description: Reduce tamaño de imagen de producto en celular
 * Version: 1.0
 */
if (!defined('ABSPATH')) exit;

// Solo cargar en páginas de producto
add_action('wp_head', function() {
    if (!is_product()) return;
    ?>
    <style id="duendes-mobile-prod-img">
    @media (max-width: 768px) {
        .prod-main-img {
            max-width: 85% !important;
            margin-left: auto !important;
            margin-right: auto !important;
            display: block !important;
        }
    }
    </style>
    <?php
});
