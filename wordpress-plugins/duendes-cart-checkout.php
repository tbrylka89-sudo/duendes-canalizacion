<?php
/**
 * Plugin Name: Duendes Cart & Checkout Styling
 * Description: Estética mágica para carrito y checkout
 * Version: 1.0
 * Author: Duendes del Uruguay
 */

if (!defined('ABSPATH')) exit;

add_action('wp_head', 'duendes_cart_checkout_styles');

function duendes_cart_checkout_styles() {
    if (!is_cart() && !is_checkout()) return;
?>
<style>
/* ═══════════════════════════════════════════════════════════════
   DUENDES - CARRITO Y CHECKOUT MÁGICO
═══════════════════════════════════════════════════════════════ */
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400&display=swap');

/* Base */
body.woocommerce-cart,
body.woocommerce-checkout {
    background: linear-gradient(180deg, #0a0a0a 0%, #0d1117 100%) !important;
    min-height: 100vh;
}

.woocommerce-cart .site-main,
.woocommerce-checkout .site-main {
    background: transparent;
    padding: 40px 20px;
}

/* Contenedor principal */
.woocommerce-cart-form,
.woocommerce-checkout,
.woocommerce table.shop_table {
    font-family: 'Cormorant Garamond', Georgia, serif;
}

/* ═══════════════════════════════════════════════════════════════
   TABLA DEL CARRITO
═══════════════════════════════════════════════════════════════ */
.woocommerce table.shop_table {
    background: rgba(20, 20, 20, 0.8) !important;
    border: 1px solid rgba(198, 169, 98, 0.2) !important;
    border-radius: 20px !important;
    overflow: hidden;
    border-collapse: separate !important;
}

.woocommerce table.shop_table th {
    background: rgba(198, 169, 98, 0.1) !important;
    color: #C6A962 !important;
    font-family: 'Cinzel', serif !important;
    font-size: 14px !important;
    text-transform: uppercase !important;
    letter-spacing: 2px !important;
    padding: 20px !important;
    border: none !important;
}

.woocommerce table.shop_table td {
    background: transparent !important;
    color: #fff !important;
    padding: 20px !important;
    border-bottom: 1px solid rgba(198, 169, 98, 0.1) !important;
    vertical-align: middle !important;
}

.woocommerce table.shop_table td.product-name {
    font-family: 'Cinzel', serif !important;
    font-size: 18px !important;
}

.woocommerce table.shop_table td.product-name a {
    color: #fff !important;
    text-decoration: none !important;
}

.woocommerce table.shop_table td.product-name a:hover {
    color: #C6A962 !important;
}

.woocommerce table.shop_table td.product-price,
.woocommerce table.shop_table td.product-subtotal {
    font-family: 'Cinzel', serif !important;
    color: #C6A962 !important;
    font-size: 18px !important;
}

/* Imagen del producto */
.woocommerce table.shop_table img {
    border-radius: 12px !important;
    border: 2px solid rgba(198, 169, 98, 0.3) !important;
}

/* Cantidad */
.woocommerce .quantity .qty {
    background: #1a1a1a !important;
    border: 1px solid rgba(198, 169, 98, 0.3) !important;
    border-radius: 8px !important;
    color: #fff !important;
    padding: 10px !important;
    width: 70px !important;
    font-family: 'Cinzel', serif !important;
}

/* Botón eliminar */
.woocommerce a.remove {
    color: #ff6b6b !important;
    font-size: 24px !important;
}

.woocommerce a.remove:hover {
    background: #ff6b6b !important;
    color: #fff !important;
    border-radius: 50%;
}

/* ═══════════════════════════════════════════════════════════════
   TOTALES DEL CARRITO
═══════════════════════════════════════════════════════════════ */
.cart_totals {
    background: rgba(20, 20, 20, 0.8) !important;
    border: 1px solid rgba(198, 169, 98, 0.2) !important;
    border-radius: 20px !important;
    padding: 30px !important;
}

.cart_totals h2 {
    font-family: 'Cinzel', serif !important;
    color: #C6A962 !important;
    font-size: 24px !important;
    margin-bottom: 20px !important;
}

.cart_totals .shop_table {
    background: transparent !important;
    border: none !important;
}

.cart_totals .shop_table th,
.cart_totals .shop_table td {
    color: #fff !important;
    background: transparent !important;
    border-bottom: 1px solid rgba(198, 169, 98, 0.1) !important;
}

.cart_totals .order-total th,
.cart_totals .order-total td {
    font-family: 'Cinzel', serif !important;
    font-size: 22px !important;
    color: #C6A962 !important;
}

/* ═══════════════════════════════════════════════════════════════
   BOTONES
═══════════════════════════════════════════════════════════════ */
.woocommerce button.button,
.woocommerce a.button,
.woocommerce input.button,
.woocommerce #respond input#submit,
.woocommerce .checkout-button,
.wc-proceed-to-checkout a.checkout-button {
    background: linear-gradient(135deg, #C6A962 0%, #a88a42 100%) !important;
    color: #0a0a0a !important;
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
    box-shadow: 0 10px 30px rgba(198, 169, 98, 0.3) !important;
}

.woocommerce button.button:hover,
.woocommerce a.button:hover,
.woocommerce input.button:hover,
.woocommerce .checkout-button:hover {
    transform: translateY(-3px) !important;
    box-shadow: 0 15px 40px rgba(198, 169, 98, 0.4) !important;
}

/* Botón "Actualizar carrito" */
.woocommerce button[name="update_cart"] {
    background: rgba(198, 169, 98, 0.1) !important;
    color: #C6A962 !important;
    border: 1px solid rgba(198, 169, 98, 0.3) !important;
}

.woocommerce button[name="update_cart"]:hover {
    background: rgba(198, 169, 98, 0.2) !important;
}

/* ═══════════════════════════════════════════════════════════════
   CHECKOUT
═══════════════════════════════════════════════════════════════ */
.woocommerce-checkout h3,
.woocommerce-checkout h2 {
    font-family: 'Cinzel', serif !important;
    color: #C6A962 !important;
}

.woocommerce form .form-row label {
    color: #fff !important;
    font-family: 'Cormorant Garamond', serif !important;
    font-size: 16px !important;
}

.woocommerce form .form-row input.input-text,
.woocommerce form .form-row textarea,
.woocommerce form .form-row select {
    background: #1a1a1a !important;
    border: 1px solid rgba(198, 169, 98, 0.3) !important;
    border-radius: 12px !important;
    color: #fff !important;
    padding: 14px 18px !important;
    font-family: 'Cormorant Garamond', serif !important;
    font-size: 16px !important;
    transition: border-color 0.3s !important;
}

.woocommerce form .form-row input.input-text:focus,
.woocommerce form .form-row textarea:focus,
.woocommerce form .form-row select:focus {
    border-color: #C6A962 !important;
    outline: none !important;
    box-shadow: 0 0 20px rgba(198, 169, 98, 0.2) !important;
}

/* Checkout boxes */
#order_review,
#customer_details,
.woocommerce-billing-fields,
.woocommerce-shipping-fields,
.woocommerce-additional-fields {
    background: rgba(20, 20, 20, 0.8) !important;
    border: 1px solid rgba(198, 169, 98, 0.2) !important;
    border-radius: 20px !important;
    padding: 30px !important;
    margin-bottom: 30px !important;
}

/* Payment methods */
.woocommerce-checkout #payment {
    background: rgba(20, 20, 20, 0.8) !important;
    border: 1px solid rgba(198, 169, 98, 0.2) !important;
    border-radius: 20px !important;
}

.woocommerce-checkout #payment ul.payment_methods {
    border: none !important;
    padding: 20px !important;
}

.woocommerce-checkout #payment ul.payment_methods li {
    background: rgba(255, 255, 255, 0.03) !important;
    border: 1px solid rgba(198, 169, 98, 0.1) !important;
    border-radius: 12px !important;
    margin-bottom: 10px !important;
    padding: 15px !important;
}

.woocommerce-checkout #payment ul.payment_methods li label {
    color: #fff !important;
    font-family: 'Cormorant Garamond', serif !important;
}

.woocommerce-checkout #payment div.place-order {
    padding: 30px 20px !important;
}

/* Order review */
.woocommerce-checkout-review-order-table {
    background: transparent !important;
}

.woocommerce-checkout-review-order-table th,
.woocommerce-checkout-review-order-table td {
    color: #fff !important;
    background: transparent !important;
}

/* ═══════════════════════════════════════════════════════════════
   MENSAJES
═══════════════════════════════════════════════════════════════ */
.woocommerce-message,
.woocommerce-info {
    background: rgba(198, 169, 98, 0.1) !important;
    border: 1px solid rgba(198, 169, 98, 0.3) !important;
    border-left: 4px solid #C6A962 !important;
    color: #fff !important;
    border-radius: 12px !important;
}

.woocommerce-error {
    background: rgba(255, 107, 107, 0.1) !important;
    border: 1px solid rgba(255, 107, 107, 0.3) !important;
    border-left: 4px solid #ff6b6b !important;
    color: #fff !important;
    border-radius: 12px !important;
}

/* ═══════════════════════════════════════════════════════════════
   CARRITO VACÍO
═══════════════════════════════════════════════════════════════ */
.cart-empty.woocommerce-info {
    background: rgba(20, 20, 20, 0.8) !important;
    border: 1px solid rgba(198, 169, 98, 0.2) !important;
    border-radius: 20px !important;
    padding: 60px !important;
    text-align: center !important;
    color: #fff !important;
    font-family: 'Cormorant Garamond', serif !important;
    font-size: 20px !important;
}

.cart-empty.woocommerce-info::before {
    content: '🛒';
    display: block;
    font-size: 60px;
    margin-bottom: 20px;
}

/* ═══════════════════════════════════════════════════════════════
   COUPON
═══════════════════════════════════════════════════════════════ */
.woocommerce-cart .coupon {
    display: flex;
    gap: 10px;
    align-items: center;
}

.woocommerce-cart .coupon input.input-text {
    background: #1a1a1a !important;
    border: 1px solid rgba(198, 169, 98, 0.3) !important;
    border-radius: 12px !important;
    color: #fff !important;
    padding: 12px 16px !important;
}

.woocommerce-cart .coupon button {
    background: rgba(198, 169, 98, 0.1) !important;
    color: #C6A962 !important;
    border: 1px solid rgba(198, 169, 98, 0.3) !important;
}

/* ═══════════════════════════════════════════════════════════════
   RESPONSIVE
═══════════════════════════════════════════════════════════════ */
@media (max-width: 768px) {
    .woocommerce table.shop_table_responsive tr {
        background: rgba(20, 20, 20, 0.8) !important;
        border: 1px solid rgba(198, 169, 98, 0.2) !important;
        border-radius: 16px !important;
        margin-bottom: 20px !important;
        padding: 20px !important;
    }

    .woocommerce table.shop_table_responsive td {
        border: none !important;
    }

    .cart_totals,
    #order_review,
    #customer_details {
        padding: 20px !important;
    }
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
    padding: 40px 20px;
    margin-bottom: 30px;
">
    <p style="
        color: #C6A962;
        font-family: 'Cormorant Garamond', serif;
        font-size: 14px;
        text-transform: uppercase;
        letter-spacing: 3px;
        margin: 0 0 15px 0;
    ">Tu Selección Mágica</p>
    <h1 style="
        font-family: 'Cinzel', serif;
        font-size: 36px;
        color: #fff;
        margin: 0;
    ">🛒 Tu Carrito</h1>
</div>
<?php
}

// Header del checkout
add_action('woocommerce_before_checkout_form', 'duendes_checkout_header', 5);

function duendes_checkout_header() {
?>
<div style="
    text-align: center;
    padding: 40px 20px;
    margin-bottom: 30px;
">
    <p style="
        color: #C6A962;
        font-family: 'Cormorant Garamond', serif;
        font-size: 14px;
        text-transform: uppercase;
        letter-spacing: 3px;
        margin: 0 0 15px 0;
    ">Sellá el Pacto</p>
    <h1 style="
        font-family: 'Cinzel', serif;
        font-size: 36px;
        color: #fff;
        margin: 0 0 10px 0;
    ">✨ Finalizar Adopción</h1>
    <p style="
        color: rgba(255,255,255,0.7);
        font-family: 'Cormorant Garamond', serif;
        font-size: 18px;
        margin: 0;
    ">Tu guardián está listo para encontrarte</p>
</div>
<?php
}
?>
