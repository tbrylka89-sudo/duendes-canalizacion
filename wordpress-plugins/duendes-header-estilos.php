<?php
/**
 * Plugin Name: Duendes - Header Estilos
 * Description: Ajustes mínimos - ocultar solo el carrito flotante de FunnelKit
 * Version: 2.1
 */

if (!defined('ABSPATH')) exit;

add_action('wp_head', function() {
    ?>
    <style>
    /* ══════════════════════════════════════════════════════════════
       OCULTAR SOLO EL CARRITO FLOTANTE DE FUNNELKIT
       (la burbuja que aparece abajo a la derecha, NO el carrito normal)
       ══════════════════════════════════════════════════════════════ */

    /* Solo el icono flotante fijo en la pantalla */
    .fkcart-checkout-wrap.fkcart-checkout-fixed,
    .fkcart-checkout-wrap[style*="fixed"],
    .fkcart-floating-icon,
    .fkcart-floating-cart,
    body > .fkcart-checkout-wrap {
        display: none !important;
    }

    /* Quitar selector de país duplicado de plugins viejos */
    .duendes-pais-selector {
        display: none !important;
    }

    </style>
    <?php
}, 9999);
