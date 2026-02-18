<?php
/**
 * Plugin Name: Duendes - Thank You Traducciones
 * Description: Traduce los textos en ingles de la pagina Thank You de FunnelKit
 * Version: 1.0
 */

if (!defined('ABSPATH')) exit;

add_action('wp_footer', function() {
    $uri = $_SERVER['REQUEST_URI'] ?? '';
    if (strpos($uri, 'thank') === false &&
        strpos($uri, 'confirmacion') === false &&
        strpos($uri, 'order-received') === false &&
        strpos($uri, 'agradecimiento') === false) {
        return;
    }
    ?>
    <script>
    document.addEventListener('DOMContentLoaded', function() {
        setTimeout(function() {
            var traducciones = {
                'Phone': 'Teléfono',
                'Email': 'Correo electrónico',
                'Shipping': 'Envío',
                'Payment method': 'Método de pago',
                'Payment Method': 'Método de pago',
                'Credit card': 'Tarjeta de crédito',
                'Credit Card': 'Tarjeta de crédito',
                'Debit card': 'Tarjeta de débito',
                'PayPal': 'PayPal',
                'Bank transfer': 'Transferencia bancaria',
                'Cash on delivery': 'Pago contra entrega',
                'Subtotal': 'Subtotal',
                'Total': 'Total',
                'Discount': 'Descuento',
                'United States (US)': 'Estados Unidos',
                'United States': 'Estados Unidos',
                'Argentina': 'Argentina',
                'Uruguay': 'Uruguay',
                'Mexico': 'México',
                'Spain': 'España',
                'Chile': 'Chile',
                'Colombia': 'Colombia',
                'Peru': 'Perú',
                'Order Details': 'Detalles del Pedido',
                'Order details': 'Detalles del pedido',
                'Customer Details': 'Datos del Cliente',
                'Customer details': 'Datos del cliente',
                'Billing Address': 'Dirección de facturación',
                'Billing address': 'Dirección de facturación',
                'Shipping Address': 'Dirección de envío',
                'Shipping address': 'Dirección de envío',
                'Order Number': 'Número de pedido',
                'Order number': 'Número de pedido',
                'Date': 'Fecha',
                'Thank You': 'Gracias',
                'Thank you': 'Gracias',
                'Color:': 'Color:',
                'Size:': 'Talla:',
                'Size: Large': 'Talla: Grande',
                'Size: Medium': 'Talla: Mediano',
                'Size: Small': 'Talla: Pequeño'
            };

            function traducirPagina() {
                var walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
                var nodos = [];
                while (walker.nextNode()) {
                    nodos.push(walker.currentNode);
                }

                nodos.forEach(function(node) {
                    var txt = node.nodeValue;
                    if (!txt || txt.trim() === '') return;

                    for (var en in traducciones) {
                        if (txt.indexOf(en) !== -1) {
                            txt = txt.split(en).join(traducciones[en]);
                        }
                    }

                    if (txt !== node.nodeValue) {
                        node.nodeValue = txt;
                    }
                });
            }

            traducirPagina();
            setInterval(traducirPagina, 2000);
        }, 800);
    });
    </script>
    <?php
}, 9999);
