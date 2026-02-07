<?php
/**
 * Plugin Name: Duendes - Meta Commerce Checkout
 * Description: URL de checkout para Instagram/Facebook Shops
 * Version: 2.0
 *
 * Formato Meta: https://duendesdeluruguay.com/caja/?products=ID:CANTIDAD,ID:CANTIDAD&coupon=CODIGO
 * Ejemplo: https://duendesdeluruguay.com/caja/?products=123:1,456:2&coupon=DESCUENTO10
 */

if (!defined('ABSPATH')) exit;

add_action('template_redirect', function() {
    // Solo procesar si viene el parámetro products
    if (!isset($_GET['products']) || empty($_GET['products'])) return;

    // Verificar que WooCommerce esté activo
    if (!function_exists('WC') || !WC()->cart) return;

    // Limpiar carrito actual
    WC()->cart->empty_cart();

    $products_param = sanitize_text_field($_GET['products']);
    $items = explode(',', $products_param);

    foreach ($items as $item) {
        $parts = explode(':', $item);

        // Manejar formato Meta: wc_post_id_123 o SKU_123 o simplemente 123
        $product_identifier = $parts[0];

        // Extraer ID numérico si viene con prefijo
        if (preg_match('/(\d+)$/', $product_identifier, $matches)) {
            $product_id = intval($matches[1]);
        } else {
            $product_id = intval($product_identifier);
        }

        $quantity = isset($parts[1]) ? intval($parts[1]) : 1;

        // Validar que el producto existe y está disponible
        if ($product_id > 0 && $quantity > 0) {
            $product = wc_get_product($product_id);
            if ($product && $product->is_purchasable()) {
                WC()->cart->add_to_cart($product_id, $quantity);
            }
        }
    }

    // Aplicar cupón si viene
    if (!empty($_GET['coupon'])) {
        $coupon = sanitize_text_field($_GET['coupon']);
        WC()->cart->apply_coupon($coupon);
    }

    // Si no estamos en checkout, redirigir
    if (!is_checkout()) {
        wp_redirect(wc_get_checkout_url());
        exit;
    }
}, 1);
