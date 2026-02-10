<?php
/**
 * Plugin Name: Duendes - Redirect Cart to FunnelKit
 * Description: Redirige el carrito viejo de WooCommerce al checkout de FunnelKit
 * Version: 1.0
 */

if (!defined('ABSPATH')) exit;

/**
 * Redirigir /carrito/ al checkout de FunnelKit
 */
add_action('template_redirect', function() {
    // Solo en la página del carrito
    if (!is_cart()) return;

    // URL del checkout de FunnelKit
    $funnelkit_checkout = '/checkouts/caja/';

    // Si el carrito está vacío, ir a la tienda
    if (WC()->cart->is_empty()) {
        wp_redirect(wc_get_page_permalink('shop'));
        exit;
    }

    // Redirigir al checkout de FunnelKit
    wp_redirect(home_url($funnelkit_checkout));
    exit;
});

/**
 * Cambiar el link "Ver Carrito" para ir directo al checkout
 */
add_filter('woocommerce_get_cart_url', function($url) {
    return home_url('/checkouts/caja/');
});

/**
 * Cambiar el botón "Ver Carrito" en mensajes
 */
add_filter('wc_add_to_cart_message_html', function($message, $products) {
    $checkout_url = home_url('/checkouts/caja/');

    // Reemplazar link del carrito por checkout
    $message = str_replace(
        wc_get_cart_url(),
        $checkout_url,
        $message
    );

    // Cambiar texto "Ver carrito" por "Ir a la caja"
    $message = str_replace(
        'Ver carrito',
        'Ir a la caja',
        $message
    );

    return $message;
}, 10, 2);
