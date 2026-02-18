<?php
/**
 * Plugin Name: Duendes - Checkout Simple
 * Description: Traducciones para checkout + telefono obligatorio
 * Version: 1.3
 */

if (!defined('ABSPATH')) exit;

// Hacer telefono obligatorio
add_filter('woocommerce_billing_fields', function($fields) {
    if (isset($fields['billing_phone'])) {
        $fields['billing_phone']['required'] = true;
        $fields['billing_phone']['label'] = 'Teléfono';
    }
    return $fields;
}, 999);

add_filter('woocommerce_shipping_fields', function($fields) {
    if (isset($fields['shipping_phone'])) {
        $fields['shipping_phone']['required'] = true;
        $fields['shipping_phone']['label'] = 'Teléfono';
    }
    return $fields;
}, 999);

add_action('wp_footer', function() {
    $uri = $_SERVER['REQUEST_URI'] ?? '';
    if (strpos($uri, 'checkout') === false) return;
    ?>
    <script>
    setTimeout(function() {
        function traducir() {
            var t = {
                // Headers
                'Shipping Information': 'Informacion de envio',
                'Order summary': 'Resumen del pedido',
                'Order Summary': 'Resumen del pedido',
                'Shipping Method': 'Metodo de envio',
                'Payment': 'Pago',

                // Campos
                'Town / City': 'Ciudad',
                'Town / City *': 'Ciudad *',
                'Postcode / ZIP': 'Codigo postal',
                'Postcode / ZIP *': 'Codigo postal *',
                'Country / Region': 'Pais',
                'State / County': 'Departamento',
                'Department': 'Departamento',
                'Department *': 'Departamento *',

                // Telefono - quitar opcional
                'Telefono (opcional)': 'Telefono *',
                'Phone (optional)': 'Telefono *',
                'Phone': 'Telefono',

                // Billing
                'Use a different billing address': 'Usar direccion de facturacion diferente',
                'Use a different billing address (opcional)': 'Usar direccion de facturacion diferente (opcional)',

                // Cupon
                'Have a coupon?': 'Tenes un cupon?',
                'Have a coupon? Click here to enter your code': 'Tenes un cupon? Haz clic para ingresar tu codigo',
                'Click here to enter your code': 'Haz clic para ingresar tu codigo',
                'Coupon code': 'Codigo de cupon',
                'Apply': 'Aplicar',
                'Apply coupon': 'Aplicar cupon',

                // Totales
                'Free': 'Pagas al recibir',
                'Subtotal': 'Subtotal',
                'Total': 'Total',
                'Shipping': 'Envio',
                'Discount': 'Descuento',

                // Seguridad
                '256-Bit Bank Level Security': 'Seguridad bancaria 256-Bit',
                '100% Secure Pagos': '100% Pagos Seguros',
                '100% Secure Payments': '100% Pagos Seguros',

                // Terminos
                'privacy policy': 'politica de privacidad',
                'Privacy Policy': 'politica de privacidad',
                'terms and conditions': 'terminos y condiciones',
                'Terms and Conditions': 'terminos y condiciones',
                'I have read and agree to the website': 'He leido y acepto los',
                'I have read and agree to the website terms and conditions': 'He leido y acepto los terminos y condiciones',
                'Your personal data will be used to process your order, support your experience throughout this website, and for other purposes described in our': 'Tus datos personales se usaran para procesar tu pedido y mejorar tu experiencia. Ver nuestra'
            };

            // Traducir nodos de texto
            var walk = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
            while (walk.nextNode()) {
                var node = walk.currentNode;
                var txt = node.nodeValue.trim();
                if (txt && t[txt]) {
                    node.nodeValue = node.nodeValue.replace(txt, t[txt]);
                }
                // Buscar coincidencias parciales
                for (var key in t) {
                    if (txt.indexOf(key) !== -1 && txt !== t[key]) {
                        node.nodeValue = node.nodeValue.replace(key, t[key]);
                    }
                }
            }

            // Traducir labels
            document.querySelectorAll('label, span, p, h1, h2, h3, h4, div').forEach(function(el) {
                if (el.children.length === 0) {
                    var txt = el.textContent.trim();
                    if (t[txt]) el.textContent = t[txt];
                }
            });

            // Links de terminos
            document.querySelectorAll('a').forEach(function(a) {
                var txt = a.textContent.trim().toLowerCase();
                if (txt.indexOf('terms') > -1 || txt.indexOf('condition') > -1) {
                    a.href = 'https://duendesdeluruguay.com/terminos-y-condiciones/';
                    a.textContent = 'terminos y condiciones';
                }
                if (txt.indexOf('privacy') > -1 || txt.indexOf('privac') > -1) {
                    a.href = 'https://duendesdeluruguay.com/politica-de-privacidad/';
                    a.textContent = 'politica de privacidad';
                }
            });

            // Cambiar placeholder del cupon
            document.querySelectorAll('input').forEach(function(input) {
                var ph = input.placeholder || '';
                if (ph.toLowerCase().indexOf('coupon') > -1 || ph.toLowerCase().indexOf('cupon') > -1 || ph.toLowerCase().indexOf('code') > -1) {
                    input.placeholder = 'Si tenes un codigo especial ingresalo aqui';
                }
                // Quitar (opcional) del telefono
                var label = input.closest('.form-row, .wfacp-form-control-wrapper, .field-wrapper');
                if (label) {
                    var labelText = label.querySelector('label');
                    if (labelText && labelText.textContent.toLowerCase().indexOf('telefono') > -1) {
                        labelText.textContent = labelText.textContent.replace('(opcional)', '*').replace('(optional)', '*');
                    }
                }
            });
        }

        traducir();
        setInterval(traducir, 1500);
    }, 500);
    </script>
    <?php
}, 9999);
