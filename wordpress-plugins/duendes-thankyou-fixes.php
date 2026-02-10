<?php
/**
 * Plugin Name: Duendes - Thank You Page Fixes
 * Description: Solo traducciones para Thank You de FunnelKit
 * Version: 1.3
 */

if (!defined('ABSPATH')) exit;

add_action('wp_footer', 'duendes_thankyou_js', 9999);

function duendes_thankyou_js() {
    $uri = isset($_SERVER['REQUEST_URI']) ? $_SERVER['REQUEST_URI'] : '';
    if (strpos($uri, 'order-confirmed') === false && strpos($uri, 'thank-you') === false) {
        return;
    }
    ?>
    <script>
    (function() {
        var trad = {
            'My Store': 'Duendes del Uruguay',
            'Thank You': 'Gracias',
            'Thank you': 'Gracias',
            'Your Order is Confirmed': 'Tu Pedido esta Confirmado',
            'Customer Details': 'Tus Datos',
            'Order Details': 'Detalle del Pedido',
            'Payment Method': 'Metodo de Pago',
            'Payment method': 'Metodo de pago',
            'Shipping': 'Envio',
            'Billing Address': 'Direccion de Facturacion',
            'Shipping Address': 'Direccion de Envio',
            'OUR BANK DETAILS': 'DATOS BANCARIOS',
            'We have accepted your order, and we\'re getting it ready.': 'Recibimos tu pedido y lo estamos preparando.',
            'A confirmation mail has been sent to': 'Te enviamos un email de confirmacion a',
            'HERE IS A SPECIAL OFFER': 'OFERTA ESPECIAL',
            'Yes! I want this offer': 'Si, quiero esta oferta',
            'Contact Support': 'Contactar Soporte'
        };

        function traducir() {
            var walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
            while (walker.nextNode()) {
                var node = walker.currentNode;
                var txt = node.nodeValue;
                for (var en in trad) {
                    if (txt.indexOf(en) !== -1) {
                        node.nodeValue = txt.replace(en, trad[en]);
                    }
                }
            }
        }

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', traducir);
        } else {
            traducir();
        }
        setTimeout(traducir, 500);
        setTimeout(traducir, 1500);
    })();
    </script>
    <?php
}
