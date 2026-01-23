<?php
/**
 * Plugin Name: Fix Checkout Cache
 * Description: Desactiva cache en páginas de WooCommerce para evitar errores de sesión
 * Version: 1.0
 */

// Desactivar cache en páginas de WooCommerce
add_action('template_redirect', function() {
    if (function_exists('is_cart') && function_exists('is_checkout')) {
        if (is_cart() || is_checkout() || is_account_page()) {
            // Headers para no cachear
            nocache_headers();
            header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
            header('Pragma: no-cache');
            header('Expires: Wed, 11 Jan 1984 05:00:00 GMT');

            // Marcar para 10Web que no cachee
            if (!defined('DONOTCACHEPAGE')) {
                define('DONOTCACHEPAGE', true);
            }
            if (!defined('DONOTCACHEOBJECT')) {
                define('DONOTCACHEOBJECT', true);
            }
            if (!defined('DONOTCACHEDB')) {
                define('DONOTCACHEDB', true);
            }
        }
    }
}, 1);

// Asegurar que WooCommerce AJAX no se cachee
add_action('init', function() {
    if (isset($_GET['wc-ajax']) ||
        strpos($_SERVER['REQUEST_URI'], 'wc-ajax') !== false ||
        strpos($_SERVER['REQUEST_URI'], 'add-to-cart') !== false) {

        if (!defined('DONOTCACHEPAGE')) {
            define('DONOTCACHEPAGE', true);
        }
        nocache_headers();
    }
}, 1);

// Hook para 10Web específicamente
add_filter('tenweb_rocket_cache_reject_uri', function($uris) {
    $uris[] = '/carrito/(.*)';
    $uris[] = '/cart/(.*)';
    $uris[] = '/checkout/(.*)';
    $uris[] = '/finalizar-compra/(.*)';
    $uris[] = '/mi-cuenta/(.*)';
    $uris[] = '/my-account/(.*)';
    $uris[] = '(.*)wc-ajax=(.*)';
    $uris[] = '(.*)add-to-cart=(.*)';
    return $uris;
});

// También para WP Rocket si está activo
add_filter('rocket_cache_reject_uri', function($uris) {
    $uris[] = '/carrito/(.*)';
    $uris[] = '/cart/(.*)';
    $uris[] = '/checkout/(.*)';
    $uris[] = '/finalizar-compra/(.*)';
    $uris[] = '/mi-cuenta/(.*)';
    return $uris;
});

// Forzar regeneración de nonce en checkout
add_action('wp_enqueue_scripts', function() {
    if (function_exists('is_checkout') && is_checkout()) {
        // Regenerar nonce de WooCommerce
        if (WC()->session) {
            WC()->session->set_customer_session_cookie(true);
        }
    }
}, 99);
