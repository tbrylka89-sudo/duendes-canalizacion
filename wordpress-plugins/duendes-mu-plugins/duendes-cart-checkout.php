<?php
/**
 * Plugin Name: Duendes Cart & Checkout Styling
 * Description: Estética mágica CREMITA Y VIDA para carrito y checkout
 * Version: 2.1
 * Author: Duendes del Uruguay
 */

if (!defined('ABSPATH')) exit;

// ═══════════════════════════════════════════════════════════════
// TRADUCCIONES AL ESPAÑOL
// ═══════════════════════════════════════════════════════════════

// Ocultar el mensaje "has been added to cart" completamente
add_filter('wc_add_to_cart_message_html', '__return_empty_string');

// Traducir textos de envío
add_filter('woocommerce_shipping_package_name', function($name, $i, $package) {
    return 'Envío';
}, 10, 3);

// Traducir "Shipping to X. Change address"
add_filter('woocommerce_shipping_estimate_html', function($html) {
    $html = str_replace('Shipping to', 'Envío a', $html);
    $html = str_replace('Change address', 'Cambiar dirección', $html);
    return $html;
});

// Traducir labels de la tabla del carrito
add_filter('woocommerce_cart_item_name', function($name, $cart_item, $cart_item_key) {
    return $name;
}, 10, 3);

// Cambiar texto "View cart"
add_filter('woocommerce_continue_shopping_redirect', function($url) {
    return wc_get_page_permalink('shop');
});

// Cambiar labels del carrito via JavaScript (funciona en móvil y desktop)
add_action('wp_footer', function() {
    if (!is_cart() && !is_checkout()) return;
    ?>
    <script>
    (function() {
        function traducirCarrito() {
            // Traducciones de labels
            var traducciones = {
                'Product': 'Guardián',
                'Price': 'Precio',
                'Quantity': 'Cantidad',
                'Subtotal': 'Subtotal',
                'Remove': 'Quitar',
                'Coupon': 'Cupón',
                'Shipping': 'Envío',
                'Total': 'Total'
            };

            // Cambiar data-title en celdas de tabla responsive
            document.querySelectorAll('td[data-title]').forEach(function(td) {
                var titulo = td.getAttribute('data-title');
                if (traducciones[titulo]) {
                    td.setAttribute('data-title', traducciones[titulo]);
                }
            });

            // Cambiar headers de tabla del carrito
            document.querySelectorAll('th.product-name').forEach(function(th) {
                th.textContent = 'Guardián';
            });
            document.querySelectorAll('th.product-price').forEach(function(th) {
                th.textContent = 'Precio';
            });
            document.querySelectorAll('th.product-quantity').forEach(function(th) {
                th.textContent = 'Cantidad';
            });
            document.querySelectorAll('th.product-subtotal').forEach(function(th) {
                th.textContent = 'Subtotal';
            });

            // Cambiar texto de envío en totales
            document.querySelectorAll('.cart_totals th, .woocommerce-shipping-totals th, tr.shipping th').forEach(function(el) {
                var texto = el.textContent.trim().toLowerCase();
                if (texto === 'shipping' || texto === 'envío') {
                    el.innerHTML = 'Envío';
                }
                if (texto === 'subtotal') {
                    el.innerHTML = 'Subtotal';
                }
                if (texto === 'total') {
                    el.innerHTML = 'Total';
                }
            });

            // Cambiar "Change address" a "Cambiar dirección"
            document.querySelectorAll('a').forEach(function(a) {
                var texto = a.textContent.trim();
                if (texto === 'Change address') {
                    a.textContent = 'Cambiar dirección';
                }
                if (texto === 'Enter a different address') {
                    a.textContent = 'Ingresá otra dirección';
                }
            });

            // Cambiar textos de "Shipping to X"
            document.querySelectorAll('.woocommerce-shipping-destination, .shipping-calculator-button').forEach(function(el) {
                el.innerHTML = el.innerHTML
                    .replace('Shipping to', 'Envío a')
                    .replace('Change address', 'Cambiar dirección')
                    .replace('Calculate shipping', 'Calcular envío');
            });

            // Cambiar "Cart totals" a "Total del carrito"
            document.querySelectorAll('.cart_totals h2').forEach(function(el) {
                if (el.textContent.trim().toLowerCase() === 'cart totals') {
                    el.textContent = 'Total del Carrito';
                }
            });

            // Cambiar botón "Update cart"
            document.querySelectorAll('button[name="update_cart"]').forEach(function(btn) {
                if (btn.value === 'Update cart') {
                    btn.value = 'Actualizar carrito';
                }
            });

            // Cambiar botón "Proceed to checkout"
            document.querySelectorAll('.checkout-button, .wc-proceed-to-checkout a').forEach(function(btn) {
                if (btn.textContent.trim() === 'Proceed to checkout') {
                    btn.textContent = 'Finalizar Compra';
                }
            });

            // Cambiar "View cart"
            document.querySelectorAll('.wc-forward').forEach(function(btn) {
                if (btn.textContent.trim() === 'View cart') {
                    btn.textContent = 'Ver carrito';
                }
            });

            // Texto del cupón
            document.querySelectorAll('.coupon label, input#coupon_code').forEach(function(el) {
                if (el.placeholder === 'Coupon code') {
                    el.placeholder = 'Código de cupón';
                }
            });
            document.querySelectorAll('.coupon button').forEach(function(btn) {
                if (btn.value === 'Apply coupon') {
                    btn.value = 'Aplicar';
                }
            });
        }

        // Ejecutar al cargar
        document.addEventListener('DOMContentLoaded', traducirCarrito);

        // Re-ejecutar después de actualizaciones AJAX del carrito
        if (typeof jQuery !== 'undefined') {
            jQuery(document.body).on('updated_cart_totals updated_shipping_method', traducirCarrito);
        }

        // También ejecutar con delay por si hay carga lenta
        setTimeout(traducirCarrito, 500);
        setTimeout(traducirCarrito, 1500);
    })();
    </script>
    <?php
});

add_action('wp_head', 'duendes_cart_checkout_styles');

function duendes_cart_checkout_styles() {
    if (!is_cart() && !is_checkout()) return;
?>
<style>
/* ═══════════════════════════════════════════════════════════════
   DUENDES - CARRITO CREMITA CON VIDA
═══════════════════════════════════════════════════════════════ */
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400&display=swap');

/* BASE - FONDO CREMITA */
body.woocommerce-cart,
body.woocommerce-checkout {
    background: linear-gradient(180deg, #FAF8F5 0%, #F5F0E8 100%) !important;
    min-height: 100vh;
}

.woocommerce-cart .site-main,
.woocommerce-checkout .site-main,
.woocommerce-cart .content-area,
.woocommerce-checkout .content-area {
    background: transparent !important;
    padding: 40px 20px;
}

/* Contenedor principal */
.woocommerce-cart-form,
.woocommerce-checkout,
.woocommerce table.shop_table {
    font-family: 'Cormorant Garamond', Georgia, serif;
}

/* ═══════════════════════════════════════════════════════════════
   TABLA DEL CARRITO - ELEGANTE Y LEGIBLE
═══════════════════════════════════════════════════════════════ */
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
    transition: color 0.3s;
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

/* Botones de cantidad estilo minimal */
.woocommerce .quantity .plus,
.woocommerce .quantity .minus {
    background: #C6A962 !important;
    color: #fff !important;
    border: none !important;
}

/* Botón eliminar */
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

/* ═══════════════════════════════════════════════════════════════
   TOTALES DEL CARRITO
═══════════════════════════════════════════════════════════════ */
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

/* Shipping method */
.woocommerce-shipping-methods li {
    color: #2a2a2a !important;
}

.woocommerce-shipping-methods li label {
    color: #2a2a2a !important;
}

/* ═══════════════════════════════════════════════════════════════
   BOTONES - DORADOS Y VIVOS
═══════════════════════════════════════════════════════════════ */
.woocommerce button.button,
.woocommerce a.button,
.woocommerce input.button,
.woocommerce #respond input#submit,
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
    transition: all 0.4s ease !important;
    box-shadow: 0 8px 25px rgba(198, 169, 98, 0.35) !important;
}

.woocommerce button.button:hover,
.woocommerce a.button:hover,
.woocommerce input.button:hover,
.woocommerce .checkout-button:hover {
    transform: translateY(-3px) !important;
    box-shadow: 0 12px 35px rgba(198, 169, 98, 0.45) !important;
    background: linear-gradient(135deg, #d4bc7a 0%, #C6A962 100%) !important;
}

/* Botón "Actualizar carrito" - secundario */
.woocommerce button[name="update_cart"] {
    background: transparent !important;
    color: #8B7355 !important;
    border: 2px solid #C6A962 !important;
    box-shadow: none !important;
}

.woocommerce button[name="update_cart"]:hover {
    background: #C6A962 !important;
    color: #1a1a1a !important;
}

/* ═══════════════════════════════════════════════════════════════
   CHECKOUT - CREMITA ELEGANTE
═══════════════════════════════════════════════════════════════ */
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
    font-weight: 500 !important;
}

.woocommerce form .form-row input.input-text,
.woocommerce form .form-row textarea,
.woocommerce form .form-row select,
.select2-container--default .select2-selection--single {
    background: #FFFFFF !important;
    border: 2px solid rgba(198, 169, 98, 0.3) !important;
    border-radius: 12px !important;
    color: #1a1a1a !important;
    padding: 14px 18px !important;
    font-family: 'Cormorant Garamond', serif !important;
    font-size: 16px !important;
    transition: border-color 0.3s, box-shadow 0.3s !important;
}

.woocommerce form .form-row input.input-text:focus,
.woocommerce form .form-row textarea:focus,
.woocommerce form .form-row select:focus {
    border-color: #C6A962 !important;
    outline: none !important;
    box-shadow: 0 0 0 4px rgba(198, 169, 98, 0.15) !important;
}

/* Select2 dropdown styling */
.select2-container--default .select2-selection--single {
    height: auto !important;
    padding: 10px 14px !important;
}

.select2-container--default .select2-selection--single .select2-selection__rendered {
    color: #1a1a1a !important;
}

.select2-dropdown {
    background: #fff !important;
    border: 2px solid rgba(198, 169, 98, 0.3) !important;
    border-radius: 12px !important;
}

.select2-container--default .select2-results__option--highlighted[aria-selected] {
    background: #C6A962 !important;
    color: #1a1a1a !important;
}

/* Checkout boxes */
#order_review,
#customer_details,
.woocommerce-billing-fields,
.woocommerce-shipping-fields,
.woocommerce-additional-fields {
    background: #FFFFFF !important;
    border: 1px solid rgba(198, 169, 98, 0.25) !important;
    border-radius: 20px !important;
    padding: 30px !important;
    margin-bottom: 30px !important;
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.04) !important;
}

/* Payment methods */
.woocommerce-checkout #payment {
    background: #FFFFFF !important;
    border: 1px solid rgba(198, 169, 98, 0.25) !important;
    border-radius: 20px !important;
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.04) !important;
}

.woocommerce-checkout #payment ul.payment_methods {
    border: none !important;
    padding: 20px !important;
}

.woocommerce-checkout #payment ul.payment_methods li {
    background: #FAF8F5 !important;
    border: 2px solid rgba(198, 169, 98, 0.2) !important;
    border-radius: 12px !important;
    margin-bottom: 10px !important;
    padding: 18px !important;
    transition: all 0.3s !important;
}

.woocommerce-checkout #payment ul.payment_methods li:hover {
    border-color: #C6A962 !important;
}

.woocommerce-checkout #payment ul.payment_methods li.wc_payment_method > label {
    color: #2a2a2a !important;
    font-family: 'Cormorant Garamond', serif !important;
    font-size: 16px !important;
}

.woocommerce-checkout #payment div.place-order {
    padding: 30px 20px !important;
    background: linear-gradient(135deg, #FAF8F5 0%, #F5F0E8 100%) !important;
    border-radius: 0 0 20px 20px !important;
}

/* Order review */
.woocommerce-checkout-review-order-table {
    background: transparent !important;
}

.woocommerce-checkout-review-order-table th,
.woocommerce-checkout-review-order-table td {
    color: #2a2a2a !important;
    background: transparent !important;
    padding: 12px 0 !important;
}

.woocommerce-checkout-review-order-table .order-total th,
.woocommerce-checkout-review-order-table .order-total td {
    color: #8B7355 !important;
    font-size: 20px !important;
    font-weight: 600 !important;
}

/* ═══════════════════════════════════════════════════════════════
   MENSAJES - COLORIDOS Y VIVOS
═══════════════════════════════════════════════════════════════ */
.woocommerce-message,
.woocommerce-info {
    background: linear-gradient(135deg, #fff9e6 0%, #fff5d6 100%) !important;
    border: none !important;
    border-left: 4px solid #C6A962 !important;
    color: #5d4e37 !important;
    border-radius: 12px !important;
    padding: 18px 20px !important;
    box-shadow: 0 4px 15px rgba(198, 169, 98, 0.15) !important;
}

.woocommerce-message::before,
.woocommerce-info::before {
    color: #C6A962 !important;
}

.woocommerce-error {
    background: linear-gradient(135deg, #fff5f5 0%, #ffe8e8 100%) !important;
    border: none !important;
    border-left: 4px solid #e74c3c !important;
    color: #c0392b !important;
    border-radius: 12px !important;
    padding: 18px 20px !important;
}

.woocommerce-error li {
    color: #c0392b !important;
}

/* ═══════════════════════════════════════════════════════════════
   CARRITO VACÍO
═══════════════════════════════════════════════════════════════ */
.woocommerce-cart .woocommerce {
    max-width: 600px;
    margin: 0 auto;
    padding: 40px 20px;
}

.cart-empty.woocommerce-info,
.woocommerce-info.wc-empty-cart-message {
    background: #FFFFFF !important;
    border: 1px solid rgba(198, 169, 98, 0.3) !important;
    border-radius: 20px !important;
    padding: 50px 30px !important;
    text-align: center !important;
    color: #3d3d3d !important;
    font-family: 'Cormorant Garamond', serif !important;
    font-size: 18px !important;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.06) !important;
    margin: 0 auto !important;
}

.cart-empty.woocommerce-info::before,
.woocommerce-info.wc-empty-cart-message::before {
    content: '' !important;
    display: block !important;
    width: 70px !important;
    height: 70px !important;
    margin: 0 auto 20px !important;
    background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="%23C6A962" stroke-width="1.5"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>') center/contain no-repeat !important;
}

.return-to-shop {
    text-align: center !important;
    margin-top: 25px !important;
}

.return-to-shop .button,
.wc-backward {
    display: inline-block !important;
    background: linear-gradient(135deg, #C6A962 0%, #a88a42 100%) !important;
    color: #1a1a1a !important;
    padding: 16px 35px !important;
    border-radius: 50px !important;
    font-family: 'Cinzel', serif !important;
    font-size: 13px !important;
    font-weight: 600 !important;
    text-transform: uppercase !important;
    letter-spacing: 2px !important;
    text-decoration: none !important;
    box-shadow: 0 8px 25px rgba(198, 169, 98, 0.35) !important;
}

/* ═══════════════════════════════════════════════════════════════
   COUPON - ELEGANTE
═══════════════════════════════════════════════════════════════ */
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

.woocommerce-cart .coupon input.input-text::placeholder {
    color: #999 !important;
}

.woocommerce-cart .coupon button {
    background: #FAF8F5 !important;
    color: #8B7355 !important;
    border: 2px solid #C6A962 !important;
    padding: 12px 20px !important;
}

.woocommerce-cart .coupon button:hover {
    background: #C6A962 !important;
    color: #1a1a1a !important;
}

/* ═══════════════════════════════════════════════════════════════
   MINI CART WIDGET
═══════════════════════════════════════════════════════════════ */
.widget_shopping_cart {
    background: #FFFFFF !important;
}

.widget_shopping_cart_content {
    color: #2a2a2a !important;
}

/* ═══════════════════════════════════════════════════════════════
   RESPONSIVE - MÓVIL HERMOSO
═══════════════════════════════════════════════════════════════ */
@media (max-width: 768px) {
    body.woocommerce-cart,
    body.woocommerce-checkout {
        background: #FAF8F5 !important;
    }

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

    .woocommerce table.shop_table_responsive td::before {
        color: #8B7355 !important;
        font-family: 'Cinzel', serif !important;
        font-size: 11px !important;
        text-transform: uppercase !important;
        letter-spacing: 1px !important;
    }

    /* Forzar labels en español para móvil */
    .woocommerce table.shop_table_responsive td.product-name::before {
        content: "Guardián:" !important;
    }
    .woocommerce table.shop_table_responsive td.product-price::before {
        content: "Precio:" !important;
    }
    .woocommerce table.shop_table_responsive td.product-quantity::before {
        content: "Cantidad:" !important;
    }
    .woocommerce table.shop_table_responsive td.product-subtotal::before {
        content: "Subtotal:" !important;
    }
    .woocommerce table.shop_table_responsive td.product-remove::before {
        content: "" !important;
    }

    .woocommerce table.shop_table_responsive td.product-thumbnail {
        text-align: center !important;
        padding-bottom: 15px !important;
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

/* ═══════════════════════════════════════════════════════════════
   FORZAR VISIBILIDAD DE TEXTOS Y BOTONES
═══════════════════════════════════════════════════════════════ */
/* Botones nunca vacíos */
.woocommerce button.button,
.woocommerce a.button,
.woocommerce input.button,
.wc-proceed-to-checkout a {
    color: #1a1a1a !important;
    min-height: 48px !important;
}

/* Textos siempre visibles */
.woocommerce .cart_totals th,
.woocommerce .cart_totals td,
.woocommerce table.shop_table th,
.woocommerce table.shop_table td {
    color: #2a2a2a !important;
}

/* Precios siempre dorados */
.woocommerce-Price-amount,
.woocommerce table.shop_table .amount,
.cart_totals .amount,
.product-price .amount,
.product-subtotal .amount {
    color: #8B7355 !important;
    font-weight: 600 !important;
}

/* Labels móvil visibles */
.woocommerce table.shop_table_responsive td::before {
    content: attr(data-title) !important;
    color: #8B7355 !important;
    display: block !important;
    font-weight: 600 !important;
}

/* ═══════════════════════════════════════════════════════════════
   ANIMACIONES SUTILES
═══════════════════════════════════════════════════════════════ */
.woocommerce table.shop_table tr {
    transition: transform 0.2s, box-shadow 0.2s;
}

@media (min-width: 769px) {
    .woocommerce table.shop_table tbody tr:hover {
        transform: translateX(5px);
    }
}

/* Product images hover */
.woocommerce table.shop_table img {
    transition: transform 0.3s, box-shadow 0.3s;
}

.woocommerce table.shop_table img:hover {
    transform: scale(1.05);
    box-shadow: 0 8px 25px rgba(198, 169, 98, 0.25) !important;
}
</style>
<?php
}

// Agregar header personalizado al carrito
add_action('woocommerce_before_cart', 'duendes_cart_header');

function duendes_cart_header() {
?>
<div style="
    text-align: center;
    padding: 40px 20px 20px;
    margin-bottom: 20px;
">
    <p style="
        color: #8B7355;
        font-family: 'Cormorant Garamond', serif;
        font-size: 14px;
        text-transform: uppercase;
        letter-spacing: 3px;
        margin: 0 0 15px 0;
    ">Tu Seleccion Magica</p>
    <h1 style="
        font-family: 'Cinzel', serif;
        font-size: clamp(28px, 5vw, 36px);
        color: #1a1a1a;
        margin: 0;
        letter-spacing: 3px;
    ">TU CARRITO</h1>
    <div style="
        width: 60px;
        height: 2px;
        background: linear-gradient(90deg, transparent, #C6A962, transparent);
        margin: 20px auto 0;
    "></div>
</div>
<?php
}

// Header del checkout
add_action('woocommerce_before_checkout_form', 'duendes_checkout_header', 5);

function duendes_checkout_header() {
?>
<div style="
    text-align: center;
    padding: 40px 20px 20px;
    margin-bottom: 20px;
">
    <p style="
        color: #8B7355;
        font-family: 'Cormorant Garamond', serif;
        font-size: 14px;
        text-transform: uppercase;
        letter-spacing: 3px;
        margin: 0 0 15px 0;
    ">Sella el Pacto</p>
    <h1 style="
        font-family: 'Cinzel', serif;
        font-size: clamp(26px, 5vw, 36px);
        color: #1a1a1a;
        margin: 0 0 10px 0;
        letter-spacing: 3px;
    ">FINALIZAR ADOPCION</h1>
    <p style="
        color: #5d4e37;
        font-family: 'Cormorant Garamond', serif;
        font-size: 18px;
        margin: 0;
        font-style: italic;
    ">Tu guardian esta listo para encontrarte</p>
    <div style="
        width: 60px;
        height: 2px;
        background: linear-gradient(90deg, transparent, #C6A962, transparent);
        margin: 25px auto 0;
    "></div>
</div>
<?php
}
?>
