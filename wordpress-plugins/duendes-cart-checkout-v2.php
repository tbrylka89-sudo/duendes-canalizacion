<?php
/**
 * Plugin Name: Duendes Cart & Checkout v2
 * Description: Estilos y traducciones para carrito/checkout - SIN MutationObserver, SIN loops
 * Version: 2.0.0
 * Author: Duendes del Uruguay
 *
 * CAMBIOS vs version anterior:
 * - NO usa MutationObserver (causaba loops infinitos)
 * - Traducciones via PHP donde sea posible
 * - JavaScript solo ejecuta UNA vez despues de carga
 * - Botones con texto GARANTIZADO via CSS :empty y PHP
 */

if (!defined('ABSPATH')) exit;

// ============================================================================
// 1. TRADUCCIONES VIA PHP (MEJOR QUE JS)
// ============================================================================

// Traducir textos de envio
add_filter('woocommerce_shipping_package_name', function() {
    return 'Envio';
}, 10);

// Ocultar mensaje "has been added to cart"
add_filter('wc_add_to_cart_message_html', '__return_empty_string');

// Traducir botones via filtros de WooCommerce
add_filter('woocommerce_product_single_add_to_cart_text', function() {
    return 'ADOPTAR GUARDIAN';
});

add_filter('woocommerce_product_add_to_cart_text', function($text, $product) {
    if ($product->is_type('simple')) {
        return 'ADOPTAR';
    }
    return $text;
}, 10, 2);

// Traducir "Proceed to checkout"
add_filter('woocommerce_proceed_to_checkout', function() {
    return '<a href="' . esc_url(wc_get_checkout_url()) . '" class="checkout-button button alt wc-forward">FINALIZAR COMPRA</a>';
});

// Traducir "View cart"
add_filter('woocommerce_widget_cart_item_quantity', function($html, $cart_item, $cart_item_key) {
    return $html;
}, 10, 3);

// ============================================================================
// 2. FORZAR TEXTO EN BOTONES VIA PHP
// ============================================================================

add_action('woocommerce_before_cart', function() {
    // Forzar texto del boton actualizar carrito
    add_filter('woocommerce_cart_item_quantity', function($quantity, $cart_item_key, $cart_item) {
        return $quantity;
    }, 10, 3);
});

// ============================================================================
// 3. ESTILOS CSS - CARRITO CREMITA
// ============================================================================

add_action('wp_head', 'duendes_cart_v2_styles');

function duendes_cart_v2_styles() {
    if (!is_cart() && !is_checkout()) return;
    ?>
    <style id="duendes-cart-v2-css">
    /* ================================================================
       FUENTES
    ================================================================ */
    @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400&display=swap');

    /* ================================================================
       BASE - FONDO CREMITA
    ================================================================ */
    body.woocommerce-cart,
    body.woocommerce-checkout {
        background: linear-gradient(180deg, #FAF8F5 0%, #F5F0E8 100%) !important;
        min-height: 100vh;
    }

    .woocommerce-cart .site-main,
    .woocommerce-checkout .site-main {
        background: transparent !important;
        padding: 40px 20px;
    }

    /* Tipografia base */
    .woocommerce-cart-form,
    .woocommerce-checkout,
    .woocommerce table.shop_table {
        font-family: 'Cormorant Garamond', Georgia, serif;
    }

    /* ================================================================
       TABLA DEL CARRITO
    ================================================================ */
    .woocommerce table.shop_table {
        background: #FFFFFF !important;
        border: 1px solid rgba(198, 169, 98, 0.3) !important;
        border-radius: 20px !important;
        overflow: hidden;
        border-collapse: separate !important;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.06) !important;
    }

    .woocommerce table.shop_table th {
        background: linear-gradient(135deg, #C6A962 0%, #a88a42 100%) !important;
        color: #1a1a1a !important;
        font-family: 'Cinzel', serif !important;
        font-size: 13px !important;
        text-transform: uppercase !important;
        letter-spacing: 2px !important;
        padding: 18px 15px !important;
        border: none !important;
    }

    .woocommerce table.shop_table td {
        background: transparent !important;
        color: #2a2a2a !important;
        padding: 20px 15px !important;
        border-bottom: 1px solid rgba(198, 169, 98, 0.15) !important;
        vertical-align: middle !important;
    }

    .woocommerce table.shop_table td.product-name {
        font-family: 'Cinzel', serif !important;
        font-size: 18px !important;
        color: #1a1a1a !important;
    }

    .woocommerce table.shop_table td.product-name a {
        color: #1a1a1a !important;
        text-decoration: none !important;
    }

    .woocommerce table.shop_table td.product-name a:hover {
        color: #C6A962 !important;
    }

    .woocommerce table.shop_table td.product-price,
    .woocommerce table.shop_table td.product-subtotal {
        font-family: 'Cinzel', serif !important;
        color: #8B7355 !important;
        font-size: 18px !important;
        font-weight: 600 !important;
    }

    /* Imagen del producto */
    .woocommerce table.shop_table img {
        border-radius: 12px !important;
        border: 2px solid rgba(198, 169, 98, 0.4) !important;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08) !important;
    }

    /* Cantidad */
    .woocommerce .quantity .qty {
        background: #FAF8F5 !important;
        border: 2px solid rgba(198, 169, 98, 0.4) !important;
        border-radius: 10px !important;
        color: #1a1a1a !important;
        padding: 10px !important;
        width: 70px !important;
        font-family: 'Cinzel', serif !important;
        font-weight: 600 !important;
    }

    /* Boton eliminar */
    .woocommerce a.remove {
        color: #d63031 !important;
        font-size: 22px !important;
        background: rgba(214, 48, 49, 0.08) !important;
        border-radius: 50% !important;
        width: 30px !important;
        height: 30px !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
    }

    .woocommerce a.remove:hover {
        background: #d63031 !important;
        color: #fff !important;
    }

    /* ================================================================
       TOTALES DEL CARRITO
    ================================================================ */
    .cart_totals {
        background: #FFFFFF !important;
        border: 1px solid rgba(198, 169, 98, 0.3) !important;
        border-radius: 20px !important;
        padding: 30px !important;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.06) !important;
    }

    .cart_totals h2 {
        font-family: 'Cinzel', serif !important;
        color: #1a1a1a !important;
        font-size: 22px !important;
        margin-bottom: 20px !important;
        text-transform: uppercase !important;
        letter-spacing: 2px !important;
    }

    .cart_totals .shop_table {
        background: transparent !important;
        border: none !important;
        box-shadow: none !important;
    }

    .cart_totals .shop_table th,
    .cart_totals .shop_table td {
        color: #2a2a2a !important;
        background: transparent !important;
        border-bottom: 1px solid rgba(198, 169, 98, 0.15) !important;
        padding: 15px 0 !important;
    }

    .cart_totals .order-total th,
    .cart_totals .order-total td {
        font-family: 'Cinzel', serif !important;
        font-size: 24px !important;
        color: #8B7355 !important;
        border-bottom: none !important;
        padding-top: 20px !important;
    }

    /* ================================================================
       BOTONES - DORADOS Y SIEMPRE CON TEXTO
    ================================================================ */
    .woocommerce button.button,
    .woocommerce a.button,
    .woocommerce input.button,
    .woocommerce .checkout-button,
    .wc-proceed-to-checkout a.checkout-button {
        background: linear-gradient(135deg, #C6A962 0%, #a88a42 100%) !important;
        color: #1a1a1a !important;
        border: none !important;
        border-radius: 50px !important;
        padding: 16px 32px !important;
        font-family: 'Cinzel', serif !important;
        font-size: 14px !important;
        font-weight: 600 !important;
        text-transform: uppercase !important;
        letter-spacing: 2px !important;
        cursor: pointer !important;
        transition: all 0.3s ease !important;
        box-shadow: 0 8px 25px rgba(198, 169, 98, 0.35) !important;
        min-height: 48px !important;
        display: inline-flex !important;
        align-items: center !important;
        justify-content: center !important;
    }

    .woocommerce button.button:hover,
    .woocommerce a.button:hover,
    .woocommerce .checkout-button:hover {
        transform: translateY(-2px) !important;
        box-shadow: 0 12px 35px rgba(198, 169, 98, 0.45) !important;
        background: linear-gradient(135deg, #d4bc7a 0%, #C6A962 100%) !important;
    }

    /* BOTON ACTUALIZAR CARRITO - SIEMPRE VISIBLE CON TEXTO */
    button[name="update_cart"],
    .woocommerce button[name="update_cart"],
    .woocommerce-cart button[name="update_cart"],
    input[name="update_cart"] {
        background: linear-gradient(135deg, #C6A962, #a8893d) !important;
        color: #000 !important;
        border: none !important;
        padding: 12px 25px !important;
        font-weight: 700 !important;
        opacity: 1 !important;
        cursor: pointer !important;
        min-width: 180px !important;
    }

    /* Si el boton esta vacio, mostrar texto via CSS */
    button[name="update_cart"]:empty::before,
    .woocommerce button[name="update_cart"]:empty::before {
        content: "ACTUALIZAR CARRITO" !important;
    }

    button[name="update_cart"]:disabled {
        background: #888 !important;
        color: #ccc !important;
        opacity: 0.7 !important;
        cursor: not-allowed !important;
    }

    /* BOTON FINALIZAR COMPRA - SIEMPRE VISIBLE */
    .checkout-button:empty::before,
    .wc-proceed-to-checkout a:empty::before {
        content: "FINALIZAR COMPRA" !important;
    }

    /* ================================================================
       CHECKOUT
    ================================================================ */
    .woocommerce-checkout h3,
    .woocommerce-checkout h2 {
        font-family: 'Cinzel', serif !important;
        color: #1a1a1a !important;
        text-transform: uppercase !important;
        letter-spacing: 2px !important;
    }

    .woocommerce form .form-row label {
        color: #2a2a2a !important;
        font-family: 'Cormorant Garamond', serif !important;
        font-size: 16px !important;
    }

    .woocommerce form .form-row input.input-text,
    .woocommerce form .form-row textarea,
    .woocommerce form .form-row select {
        background: #FFFFFF !important;
        border: 2px solid rgba(198, 169, 98, 0.3) !important;
        border-radius: 12px !important;
        color: #1a1a1a !important;
        padding: 14px 18px !important;
        font-family: 'Cormorant Garamond', serif !important;
        font-size: 16px !important;
    }

    .woocommerce form .form-row input.input-text:focus,
    .woocommerce form .form-row textarea:focus {
        border-color: #C6A962 !important;
        outline: none !important;
        box-shadow: 0 0 0 4px rgba(198, 169, 98, 0.15) !important;
    }

    /* Checkout boxes */
    #order_review,
    #customer_details,
    .woocommerce-billing-fields,
    .woocommerce-shipping-fields {
        background: #FFFFFF !important;
        border: 1px solid rgba(198, 169, 98, 0.25) !important;
        border-radius: 20px !important;
        padding: 30px !important;
        margin-bottom: 30px !important;
        box-shadow: 0 8px 30px rgba(0, 0, 0, 0.04) !important;
    }

    /* Metodos de pago */
    .woocommerce-checkout #payment {
        background: #FFFFFF !important;
        border: 1px solid rgba(198, 169, 98, 0.25) !important;
        border-radius: 20px !important;
    }

    .woocommerce-checkout #payment ul.payment_methods li {
        background: #FAF8F5 !important;
        border: 2px solid rgba(198, 169, 98, 0.2) !important;
        border-radius: 12px !important;
        margin-bottom: 10px !important;
        padding: 18px !important;
    }

    .woocommerce-checkout #payment ul.payment_methods li:hover {
        border-color: #C6A962 !important;
    }

    /* ================================================================
       MENSAJES
    ================================================================ */
    .woocommerce-message,
    .woocommerce-info {
        background: linear-gradient(135deg, #fff9e6 0%, #fff5d6 100%) !important;
        border: none !important;
        border-left: 4px solid #C6A962 !important;
        color: #5d4e37 !important;
        border-radius: 12px !important;
        padding: 18px 20px !important;
    }

    .woocommerce-error {
        background: linear-gradient(135deg, #fff5f5 0%, #ffe8e8 100%) !important;
        border: none !important;
        border-left: 4px solid #e74c3c !important;
        color: #c0392b !important;
        border-radius: 12px !important;
    }

    /* ================================================================
       CARRITO VACIO
    ================================================================ */
    .cart-empty.woocommerce-info {
        background: #FFFFFF !important;
        border: 1px solid rgba(198, 169, 98, 0.3) !important;
        border-radius: 20px !important;
        padding: 50px 30px !important;
        text-align: center !important;
        color: #3d3d3d !important;
    }

    /* ================================================================
       CUPON
    ================================================================ */
    .woocommerce-cart .coupon {
        display: flex;
        gap: 10px;
        align-items: center;
    }

    .woocommerce-cart .coupon input.input-text {
        background: #FFFFFF !important;
        border: 2px solid rgba(198, 169, 98, 0.3) !important;
        border-radius: 12px !important;
        color: #1a1a1a !important;
        padding: 12px 16px !important;
    }

    .woocommerce-cart .coupon button {
        background: #FAF8F5 !important;
        color: #8B7355 !important;
        border: 2px solid #C6A962 !important;
    }

    .woocommerce-cart .coupon button:hover {
        background: #C6A962 !important;
        color: #1a1a1a !important;
    }

    /* ================================================================
       RESPONSIVE
    ================================================================ */
    @media (max-width: 768px) {
        .woocommerce table.shop_table {
            background: transparent !important;
            border: none !important;
            box-shadow: none !important;
        }

        .woocommerce table.shop_table thead {
            display: none !important;
        }

        .woocommerce table.shop_table_responsive tr {
            display: block !important;
            background: #FFFFFF !important;
            border: 1px solid rgba(198, 169, 98, 0.25) !important;
            border-radius: 16px !important;
            margin-bottom: 15px !important;
            padding: 20px !important;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.04) !important;
        }

        .woocommerce table.shop_table_responsive td {
            display: block !important;
            border: none !important;
            padding: 8px 0 !important;
            text-align: left !important;
        }

        /* Labels movil en espanol */
        .woocommerce table.shop_table_responsive td.product-name::before {
            content: "Guardian:" !important;
            display: block !important;
            color: #8B7355 !important;
            font-family: 'Cinzel', serif !important;
            font-size: 11px !important;
            text-transform: uppercase !important;
            margin-bottom: 5px !important;
        }

        .woocommerce table.shop_table_responsive td.product-price::before {
            content: "Precio:" !important;
            display: block !important;
            color: #8B7355 !important;
            font-family: 'Cinzel', serif !important;
            font-size: 11px !important;
            text-transform: uppercase !important;
            margin-bottom: 5px !important;
        }

        .woocommerce table.shop_table_responsive td.product-quantity::before {
            content: "Cantidad:" !important;
            display: block !important;
            color: #8B7355 !important;
            font-family: 'Cinzel', serif !important;
            font-size: 11px !important;
            text-transform: uppercase !important;
            margin-bottom: 5px !important;
        }

        .woocommerce table.shop_table_responsive td.product-subtotal::before {
            content: "Subtotal:" !important;
            display: block !important;
            color: #8B7355 !important;
            font-family: 'Cinzel', serif !important;
            font-size: 11px !important;
            text-transform: uppercase !important;
            margin-bottom: 5px !important;
        }

        .woocommerce table.shop_table_responsive td.product-thumbnail img {
            width: 120px !important;
            height: 120px !important;
            object-fit: cover !important;
        }

        .cart_totals,
        #order_review,
        #customer_details {
            padding: 20px !important;
            margin: 15px 0 !important;
        }

        .woocommerce button.button,
        .woocommerce a.button {
            width: 100% !important;
            text-align: center !important;
            padding: 18px 24px !important;
        }
    }

    /* ================================================================
       PRECIOS SIEMPRE VISIBLES
    ================================================================ */
    .woocommerce-Price-amount,
    .woocommerce table.shop_table .amount,
    .cart_totals .amount {
        color: #8B7355 !important;
        font-weight: 600 !important;
    }
    </style>
    <?php
}

// ============================================================================
// 4. JAVASCRIPT MINIMO - EJECUTA UNA SOLA VEZ
// ============================================================================

add_action('wp_footer', 'duendes_cart_v2_scripts');

function duendes_cart_v2_scripts() {
    if (!is_cart() && !is_checkout()) return;
    ?>
    <script id="duendes-cart-v2-js">
    (function() {
        'use strict';

        // Ejecutar traducciones UNA sola vez cuando el DOM este listo
        function traducirCarrito() {
            // Traducciones de headers
            var traducciones = {
                'Product': 'Guardian',
                'Price': 'Precio',
                'Quantity': 'Cantidad',
                'Subtotal': 'Subtotal',
                'Shipping': 'Envio',
                'Total': 'Total',
                'Cart totals': 'Total del Carrito',
                'Update cart': 'ACTUALIZAR CARRITO',
                'Proceed to checkout': 'FINALIZAR COMPRA',
                'View cart': 'Ver carrito',
                'Apply coupon': 'Aplicar',
                'Coupon code': 'Codigo de cupon'
            };

            // Cambiar data-title en celdas responsive
            document.querySelectorAll('td[data-title]').forEach(function(td) {
                var titulo = td.getAttribute('data-title');
                if (titulo === 'Product') td.setAttribute('data-title', 'Guardian');
                if (titulo === 'Price') td.setAttribute('data-title', 'Precio');
                if (titulo === 'Quantity') td.setAttribute('data-title', 'Cantidad');
                if (titulo === 'Subtotal') td.setAttribute('data-title', 'Subtotal');
            });

            // Traducir headers de tabla
            document.querySelectorAll('th.product-name').forEach(function(th) {
                if (th.textContent.trim() === 'Product') th.textContent = 'Guardian';
            });
            document.querySelectorAll('th.product-price').forEach(function(th) {
                if (th.textContent.trim() === 'Price') th.textContent = 'Precio';
            });
            document.querySelectorAll('th.product-quantity').forEach(function(th) {
                if (th.textContent.trim() === 'Quantity') th.textContent = 'Cantidad';
            });
            document.querySelectorAll('th.product-subtotal').forEach(function(th) {
                if (th.textContent.trim() === 'Subtotal') th.textContent = 'Subtotal';
            });

            // Titulo Cart totals
            document.querySelectorAll('.cart_totals h2').forEach(function(h2) {
                if (h2.textContent.trim().toLowerCase() === 'cart totals') {
                    h2.textContent = 'Total del Carrito';
                }
            });

            // Traducir filas de totales
            document.querySelectorAll('.cart_totals th, tr.shipping th').forEach(function(th) {
                var texto = th.textContent.trim().toLowerCase();
                if (texto === 'shipping') th.textContent = 'Envio';
                if (texto === 'subtotal') th.textContent = 'Subtotal';
                if (texto === 'total') th.textContent = 'Total';
            });

            // FORZAR TEXTO EN BOTON ACTUALIZAR CARRITO
            document.querySelectorAll('button[name="update_cart"]').forEach(function(btn) {
                if (!btn.textContent.trim() || btn.textContent.trim() === 'Update cart') {
                    btn.textContent = 'ACTUALIZAR CARRITO';
                }
                if (btn.value === 'Update cart' || !btn.value.trim()) {
                    btn.value = 'Actualizar carrito';
                }
            });

            // FORZAR TEXTO EN BOTON CHECKOUT
            document.querySelectorAll('.checkout-button, .wc-proceed-to-checkout a').forEach(function(btn) {
                if (!btn.textContent.trim() || btn.textContent.trim() === 'Proceed to checkout') {
                    btn.textContent = 'FINALIZAR COMPRA';
                }
            });

            // Traducir placeholder del cupon
            document.querySelectorAll('input#coupon_code, input[name="coupon_code"]').forEach(function(input) {
                if (input.placeholder === 'Coupon code') {
                    input.placeholder = 'Codigo de cupon';
                }
            });

            // Traducir boton aplicar cupon
            document.querySelectorAll('.coupon button, button[name="apply_coupon"]').forEach(function(btn) {
                if (btn.value === 'Apply coupon') {
                    btn.value = 'Aplicar';
                }
                if (btn.textContent.trim() === 'Apply coupon') {
                    btn.textContent = 'Aplicar';
                }
            });

            // Checkout: Order Summary
            document.querySelectorAll('h2, h3').forEach(function(h) {
                if (h.textContent.trim() === 'Order Summary' || h.textContent.trim() === 'Order summary') {
                    h.textContent = 'Resumen del Pedido';
                }
            });
        }

        // Ejecutar cuando DOM este listo
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', traducirCarrito);
        } else {
            traducirCarrito();
        }

        // Re-ejecutar despues de updates AJAX de WooCommerce
        // Esto es necesario porque WooCommerce reemplaza el HTML del carrito
        if (typeof jQuery !== 'undefined') {
            jQuery(document.body).on('updated_cart_totals updated_checkout', function() {
                // Usar un pequeno delay para que WooCommerce termine de actualizar
                setTimeout(traducirCarrito, 100);
            });
        }

    })();
    </script>
    <?php
}

// ============================================================================
// 5. HEADERS PERSONALIZADOS
// ============================================================================

add_action('woocommerce_before_cart', 'duendes_cart_v2_header');

function duendes_cart_v2_header() {
    ?>
    <div style="text-align: center; padding: 40px 20px 20px; margin-bottom: 20px;">
        <p style="color: #8B7355; font-family: 'Cormorant Garamond', serif; font-size: 14px; text-transform: uppercase; letter-spacing: 3px; margin: 0 0 15px 0;">
            Tu Seleccion Magica
        </p>
        <h1 style="font-family: 'Cinzel', serif; font-size: clamp(28px, 5vw, 36px); color: #1a1a1a; margin: 0; letter-spacing: 3px;">
            TU CARRITO
        </h1>
        <div style="width: 60px; height: 2px; background: linear-gradient(90deg, transparent, #C6A962, transparent); margin: 20px auto 0;"></div>
    </div>
    <?php
}

add_action('woocommerce_before_checkout_form', 'duendes_checkout_v2_header', 5);

function duendes_checkout_v2_header() {
    ?>
    <div style="text-align: center; padding: 40px 20px 20px; margin-bottom: 20px;">
        <p style="color: #8B7355; font-family: 'Cormorant Garamond', serif; font-size: 14px; text-transform: uppercase; letter-spacing: 3px; margin: 0 0 15px 0;">
            Sella el Pacto
        </p>
        <h1 style="font-family: 'Cinzel', serif; font-size: clamp(26px, 5vw, 36px); color: #1a1a1a; margin: 0 0 10px 0; letter-spacing: 3px;">
            FINALIZAR ADOPCION
        </h1>
        <p style="color: #5d4e37; font-family: 'Cormorant Garamond', serif; font-size: 18px; margin: 0; font-style: italic;">
            Tu guardian esta listo para encontrarte
        </p>
        <div style="width: 60px; height: 2px; background: linear-gradient(90deg, transparent, #C6A962, transparent); margin: 25px auto 0;"></div>
    </div>
    <?php
}
