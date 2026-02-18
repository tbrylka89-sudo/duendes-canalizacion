<?php
/*
Plugin Name: ZZZ Duendes Override Styles
Description: Override de estilos globales
*/
if (!defined('ABSPATH')) exit;

// Inyectar CSS inline al final del head
add_action('wp_head', function() {
    ?>
    <style id="duendes-final-override">
    /* BOTONES - Fondo dorado, texto negro */
    body .elementor-button,
    body .elementor-widget-button .elementor-button,
    body .elementor-button.elementor-size-sm,
    body .elementor-button.elementor-size-md,
    body .elementor-button.elementor-size-lg,
    body a.elementor-button,
    .elementor .elementor-button,
    .elementor-element .elementor-button,
    html body .elementor-button {
        background: #B8973A !important;
        background-color: #B8973A !important;
        background-image: none !important;
        color: #070906 !important;
        border: none !important;
    }

    body .elementor-button:hover,
    html body .elementor-button:hover {
        background: #fff !important;
        background-color: #fff !important;
        color: #070906 !important;
    }

    body .elementor-button span,
    body .elementor-button .elementor-button-text,
    body .elementor-button .elementor-button-content-wrapper,
    html body .elementor-button span {
        color: #070906 !important;
    }

    /* OVERLAY del hero - más claro */
    .elementor-background-overlay,
    body .elementor-background-overlay {
        opacity: 0.2 !important;
    }

    /* WOOCOMMERCE */
    .woocommerce a.button,
    .woocommerce button.button,
    .woocommerce input.button {
        background: #B8973A !important;
        color: #070906 !important;
    }
    </style>
    <?php
}, 999999);

// También en footer por si el head no funciona
add_action('wp_footer', function() {
    ?>
    <style id="duendes-footer-override">
    body .elementor-button { background: #B8973A !important; color: #070906 !important; }
    body .elementor-button span { color: #070906 !important; }
    .elementor-background-overlay { opacity: 0.2 !important; }
    </style>
    <?php
}, 999999);
