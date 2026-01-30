<?php
/**
 * Plugin Name: Duendes - Shop footer spacing fix
 * Description: Agrega espacio entre productos y footer en la tienda
 * Version: 1.1
 */
if (!defined('ABSPATH')) exit;

add_action('wp_head', function() {
    if (!is_shop() && !is_product_category() && !is_product_tag()) return;
    ?>
    <style id="duendes-shop-footer-fix">
    .productos-container {
        padding-bottom: 200px !important;
    }
    @media (max-width: 768px) {
        .productos-container {
            padding-bottom: 250px !important;
        }
    }
    </style>
    <?php
});
