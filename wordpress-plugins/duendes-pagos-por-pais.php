<?php
/**
 * Plugin Name: Duendes - Pagos por País
 * Description: Muestra Mercado Pago solo para Uruguay, Plexo para todos
 * Version: 1.0
 */

if (!defined('ABSPATH')) exit;

add_filter('woocommerce_available_payment_gateways', function($gateways) {
    if (is_admin()) return $gateways;

    // Detectar país del cliente
    $pais = '';

    // Primero intentar desde el cliente de WooCommerce
    if (WC()->customer) {
        $pais = WC()->customer->get_billing_country();
    }

    // Si no hay, usar geolocalización
    if (empty($pais) && class_exists('WC_Geolocation')) {
        $geo = WC_Geolocation::geolocate_ip();
        $pais = $geo['country'] ?? '';
    }

    // IDs de los gateways de Mercado Pago (pueden variar)
    $mercadopago_gateways = [
        'woo-mercado-pago-basic',      // Checkout Pro
        'woo-mercado-pago-custom',     // Checkout API (tarjetas)
        'woo-mercado-pago-ticket',     // Checkout API Efectivo
        'mercadopago',                  // Posible ID alternativo
        'wc_mercadopago_basic',
        'wc_mercadopago_custom',
        'wc_mercadopago_ticket',
    ];

    // Si NO es Uruguay, quitar Mercado Pago
    if ($pais !== 'UY') {
        foreach ($mercadopago_gateways as $mp_id) {
            if (isset($gateways[$mp_id])) {
                unset($gateways[$mp_id]);
            }
        }
    }

    return $gateways;
});

// Log para debug (desactivar en producción)
// add_action('woocommerce_checkout_before_customer_details', function() {
//     $pais = WC()->customer ? WC()->customer->get_billing_country() : 'N/A';
//     $geo = WC_Geolocation::geolocate_ip();
//     error_log("[Duendes Pagos] País cliente: $pais | Geo: " . ($geo['country'] ?? 'N/A'));
// });
