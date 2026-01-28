<?php
/**
 * Plugin Name: Duendes - Forzar USD
 * Description: Fuerza WooCommerce a mostrar precios en USD base. El plugin de precios inteligentes maneja la conversión.
 * Version: 1.0.0
 */

if (!defined('ABSPATH')) exit;

// ═══════════════════════════════════════════════════════════════════════════
// FORZAR MONEDA BASE A USD
// ═══════════════════════════════════════════════════════════════════════════

// Sobrescribir la moneda de WooCommerce a USD
add_filter('woocommerce_currency', function($currency) {
    return 'USD';
}, 999999);

// Sobrescribir el símbolo de moneda
add_filter('woocommerce_currency_symbol', function($symbol, $currency) {
    return '$';
}, 999999, 2);

// Asegurar que los precios se formateen correctamente
add_filter('wc_price_args', function($args) {
    $args['currency'] = 'USD';
    return $args;
}, 999999);

// Los filtros de moneda arriba usan prioridad 999999
// que se ejecuta DESPUÉS de cualquier plugin de moneda
// No necesitamos remove_all_filters (que puede romper cosas)

// Ocultar selectores de moneda de otros plugins
add_action('wp_head', function() {
    ?>
    <style>
    /* Ocultar cualquier selector de moneda de plugins */
    .wmc-sidebar,
    .wmc-currency-bar,
    .curcy-switcher,
    .currency-switcher,
    #wcml_currency_switcher,
    .woocommerce-currency-switcher,
    [class*="currency-switch"],
    [class*="curcy"] {
        display: none !important;
    }
    </style>
    <?php
}, 1);
