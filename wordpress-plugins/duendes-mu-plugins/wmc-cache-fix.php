<?php
/**
 * Plugin Name: WMC Cache Compatible Fix
 * Description: Habilita el modo compatible con caché para WooCommerce Multi Currency
 */

// Activar modo compatible con caché
add_filter('pre_option_woocommerce_multi_currency_enable_cache_compatible', function() {
    return '1';
});

// Activar switch por JavaScript
add_filter('pre_option_woocommerce_multi_currency_switch_by_js', function() {
    return '1';
});

// También forzar en los parámetros JS
add_filter('wmc_get_option', function($value, $option) {
    if ($option === 'enable_cache_compatible') return '1';
    if ($option === 'switch_by_js') return '1';
    return $value;
}, 10, 2);
