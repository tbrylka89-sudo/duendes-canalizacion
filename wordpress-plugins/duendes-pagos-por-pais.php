<?php
/**
 * Plugin Name: Duendes - Pagos por País
 * Description: Uruguay → Plexo | Resto del mundo → dLocal Go
 * Version: 2.0
 * Updated: 2026-02-19
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

    // IDs de Plexo (pueden variar según el plugin)
    $plexo_gateways = [
        'plexo',
        'plexo_gateway',
        'wc_plexo',
        'plexo-payment',
    ];

    // IDs de dLocal Go (pueden variar según el plugin)
    $dlocal_gateways = [
        'dlocal-go',
        'dlocalgo',
        'dlocal_go',
        'wc-dlocal-go',
        'dlocal-go-payments',
    ];

    // ESTRATEGIA:
    // Uruguay (UY) → Solo Plexo (ocultar dLocal Go)
    // Resto del mundo → Solo dLocal Go (ocultar Plexo)

    if ($pais === 'UY') {
        // Uruguay: quitar dLocal Go, dejar Plexo
        foreach ($dlocal_gateways as $dlocal_id) {
            if (isset($gateways[$dlocal_id])) {
                unset($gateways[$dlocal_id]);
            }
        }
    } else {
        // Exterior: quitar Plexo, dejar dLocal Go
        foreach ($plexo_gateways as $plexo_id) {
            if (isset($gateways[$plexo_id])) {
                unset($gateways[$plexo_id]);
            }
        }
    }

    return $gateways;
}, 10);

// Log para debug (activar si hay problemas)
// add_action('woocommerce_checkout_before_customer_details', function() {
//     $pais = WC()->customer ? WC()->customer->get_billing_country() : 'N/A';
//     $geo = class_exists('WC_Geolocation') ? WC_Geolocation::geolocate_ip() : [];
//     error_log("[Duendes Pagos v2] País: $pais | Geo: " . ($geo['country'] ?? 'N/A'));
//     error_log("[Duendes Pagos v2] Gateways: " . implode(', ', array_keys(WC()->payment_gateways->get_available_payment_gateways())));
// });
