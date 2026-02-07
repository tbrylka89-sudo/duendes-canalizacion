<?php
/**
 * Plugin Name: Duendes Checkout Fix
 * Description: Fix para el checkout en móvil (Plexo)
 * Version: 1.0
 */

if (!defined('ABSPATH')) exit;

add_action('wp_head', function() {
    if (!is_checkout()) return;
    ?>
    <style id="duendes-checkout-fix">
    /* Fix checkout móvil */
    @media (max-width: 768px) {
        /* Contenedor principal del checkout */
        .woocommerce-checkout,
        .woocommerce form.checkout,
        #payment,
        .wc_payment_methods,
        .wc_payment_method {
            max-width: 100% !important;
            overflow-x: hidden !important;
        }

        /* Plexo iframe/contenedor */
        .payment_box,
        .payment_method_plexo,
        .payment_method_handy,
        .payment_box iframe,
        .payment_box > div,
        #plexo-form,
        #handy-form,
        [class*="plexo"],
        [class*="handy"] {
            max-width: 100% !important;
            width: 100% !important;
            overflow-x: auto !important;
            box-sizing: border-box !important;
        }

        /* Inputs dentro del formulario de pago */
        .payment_box input,
        .payment_box select,
        .payment_box .form-row {
            max-width: 100% !important;
            width: 100% !important;
            box-sizing: border-box !important;
        }

        /* Tabla de tarjetas guardadas */
        .payment_box table,
        .wc-saved-payment-methods {
            max-width: 100% !important;
            font-size: 14px !important;
            overflow-x: auto !important;
            display: block !important;
        }

        /* Contenedor de opciones de pago */
        .woocommerce-checkout-payment,
        .woocommerce-checkout #payment {
            padding: 15px 10px !important;
            max-width: 100% !important;
        }

        /* Labels de métodos de pago */
        .wc_payment_method label {
            display: flex !important;
            flex-wrap: wrap !important;
            align-items: center !important;
            gap: 8px !important;
            font-size: 14px !important;
        }

        /* Íconos de tarjetas */
        .wc_payment_method label img {
            max-height: 30px !important;
            width: auto !important;
        }

        /* Body de la página */
        body.woocommerce-checkout {
            overflow-x: hidden !important;
        }

        /* Elementor container fix */
        .elementor-section,
        .elementor-container,
        .elementor-column,
        .elementor-widget-wrap {
            max-width: 100% !important;
        }
    }

    /* Fix general para el iframe de Plexo */
    iframe[src*="plexo"],
    iframe[src*="handy"],
    iframe[src*="payment"] {
        max-width: 100% !important;
        width: 100% !important;
    }
    </style>
    <?php
});
