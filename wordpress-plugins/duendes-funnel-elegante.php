<?php
/**
 * Plugin Name: Duendes - Funnel Elegante
 * Description: Estilos claros y elegantes para carrito y checkout FunnelKit
 * Version: 1.0
 */

if (!defined('ABSPATH')) exit;

// Aplicar en carrito y checkout
add_action('wp_head', function() {
    // Solo en carrito, checkout y páginas de FunnelKit
    $es_carrito = is_cart() || is_page('carrito') || is_page('cart');
    $es_checkout = is_checkout() || strpos($_SERVER['REQUEST_URI'], '/checkouts/') !== false;

    if (!$es_carrito && !$es_checkout) return;
    ?>
    <style id="duendes-funnel-elegante">
    /* ============================================
       DUENDES - ESTILO ELEGANTE CLARO
       Fondo cremita, botones negros, tipografía elegante
       ============================================ */

    /* === RESET DE COLORES OSCUROS === */
    .wfacp_main_form,
    .wfacp-form,
    #wfacp-e-form,
    .wfacp_page,
    .wfacp-section,
    .wfacp_order_summary_container,
    .wfacp-order-summary-wrap,
    .wfacp_order_summary,
    .woocommerce-cart-form,
    .cart_totals,
    .woocommerce-checkout,
    body.woocommerce-cart,
    body.woocommerce-checkout {
        background: #FFFBF5 !important; /* Cremita suave */
    }

    /* === FONDO GENERAL === */
    body.woocommerce-cart,
    body.woocommerce-checkout,
    .wfacp_main_wrapper,
    .wfacp-main-container {
        background: #FFFBF5 !important;
    }

    /* === CONTENEDORES === */
    .wfacp-section,
    .wfacp_page,
    .woocommerce-cart-form,
    .cart_totals,
    .wfacp_order_summary_container {
        background: #FFFFFF !important;
        border: 1px solid #E8E0D5 !important;
        border-radius: 12px !important;
        box-shadow: 0 2px 8px rgba(0,0,0,0.04) !important;
    }

    /* === TIPOGRAFÍA === */
    .wfacp-section .wfacp-section-title,
    .wfacp_section_title,
    .wfacp-comm-title h2,
    .wfacp-section h2,
    .wfacp-section h3,
    .cart_totals h2,
    .woocommerce-cart-form th,
    h1, h2, h3 {
        color: #1a1a1a !important;
        font-family: 'Cormorant Garamond', Georgia, serif !important;
        font-weight: 600 !important;
    }

    /* === LABELS Y TEXTOS === */
    .wfacp_main_form label,
    .wfacp-form label,
    .wfacp_main_form p,
    .wfacp_main_form span,
    .wfacp_main_form div,
    .woocommerce-cart-form td,
    .cart_totals th,
    .cart_totals td,
    label {
        color: #333333 !important;
        font-family: 'Cormorant Garamond', Georgia, serif !important;
    }

    /* === INPUTS === */
    .wfacp_main_form input[type="text"],
    .wfacp_main_form input[type="email"],
    .wfacp_main_form input[type="tel"],
    .wfacp_main_form input[type="number"],
    .wfacp_main_form select,
    .wfacp_main_form textarea,
    .wfacp-form input,
    .wfacp-form select,
    .wfacp-form textarea,
    .woocommerce input,
    .woocommerce select,
    .woocommerce textarea,
    input[type="text"],
    input[type="email"],
    input[type="tel"],
    select,
    textarea {
        background: #FFFFFF !important;
        border: 1px solid #D4C5B5 !important;
        color: #1a1a1a !important;
        border-radius: 6px !important;
        padding: 12px 15px !important;
        font-family: 'Cormorant Garamond', Georgia, serif !important;
        font-size: 16px !important;
    }

    .wfacp_main_form input:focus,
    .wfacp_main_form select:focus,
    input:focus,
    select:focus,
    textarea:focus {
        border-color: #1a1a1a !important;
        box-shadow: 0 0 0 2px rgba(0,0,0,0.05) !important;
        outline: none !important;
    }

    /* === BOTONES PRINCIPALES - NEGRO ELEGANTE === */
    .wfacp_main_form .wfacp-next-btn-wrap button,
    .wfacp_main_form #place_order,
    #place_order,
    .wfacp-btn-primary,
    button.button.wfacp-next-btn,
    .checkout-button,
    .woocommerce .button.alt,
    .wc-block-components-checkout-place-order-button,
    button[name="woocommerce_checkout_place_order"] {
        background: #1a1a1a !important;
        border: none !important;
        color: #FFFFFF !important;
        font-family: 'Cormorant Garamond', Georgia, serif !important;
        font-weight: 600 !important;
        font-size: 16px !important;
        letter-spacing: 1px !important;
        text-transform: uppercase !important;
        padding: 16px 40px !important;
        border-radius: 6px !important;
        cursor: pointer !important;
        transition: all 0.3s ease !important;
        width: 100% !important;
    }

    .wfacp_main_form .wfacp-next-btn-wrap button:hover,
    .wfacp_main_form #place_order:hover,
    #place_order:hover,
    .checkout-button:hover,
    .woocommerce .button.alt:hover {
        background: #333333 !important;
        transform: translateY(-1px) !important;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15) !important;
    }

    /* === BOTONES SECUNDARIOS === */
    .woocommerce .button,
    .wfacp_main_form .button,
    .coupon .button,
    button.button {
        background: #FFFFFF !important;
        border: 1px solid #1a1a1a !important;
        color: #1a1a1a !important;
        font-family: 'Cormorant Garamond', Georgia, serif !important;
        font-weight: 600 !important;
        padding: 12px 24px !important;
        border-radius: 6px !important;
        transition: all 0.3s ease !important;
    }

    .woocommerce .button:hover,
    .coupon .button:hover {
        background: #1a1a1a !important;
        color: #FFFFFF !important;
    }

    /* === TABLA DEL CARRITO === */
    .woocommerce-cart-form table {
        width: 100% !important;
        border-collapse: collapse !important;
    }

    .woocommerce-cart-form th {
        text-transform: uppercase !important;
        font-size: 12px !important;
        letter-spacing: 1px !important;
        padding: 15px 10px !important;
        border-bottom: 2px solid #E8E0D5 !important;
        color: #666 !important;
    }

    .woocommerce-cart-form td {
        padding: 20px 10px !important;
        border-bottom: 1px solid #F0EBE3 !important;
        vertical-align: middle !important;
    }

    .woocommerce-cart-form .product-name a {
        color: #1a1a1a !important;
        text-decoration: none !important;
        font-weight: 500 !important;
    }

    .woocommerce-cart-form .product-name a:hover {
        text-decoration: underline !important;
    }

    .woocommerce-cart-form .product-thumbnail img {
        border-radius: 8px !important;
        border: 1px solid #E8E0D5 !important;
    }

    .woocommerce-cart-form .product-remove a {
        color: #999 !important;
        font-size: 18px !important;
    }

    .woocommerce-cart-form .product-remove a:hover {
        color: #c00 !important;
    }

    /* === RESUMEN DEL PEDIDO === */
    .wfacp_order_summary tr,
    .cart_totals tr {
        background: #FFFFFF !important;
    }

    .wfacp_order_summary .order-total td,
    .wfacp_order_summary .order-total th,
    .cart_totals .order-total td,
    .cart_totals .order-total th,
    tr.order-total td,
    tr.order-total th {
        font-size: 18px !important;
        font-weight: 700 !important;
        color: #1a1a1a !important;
        border-top: 2px solid #E8E0D5 !important;
        padding-top: 15px !important;
    }

    /* === MÉTODOS DE PAGO === */
    .wfacp_main_form .wc_payment_methods,
    .wfacp_main_form .wc_payment_method,
    .payment_methods li,
    .wc_payment_method {
        background: #FFFFFF !important;
        border: 1px solid #E8E0D5 !important;
        border-radius: 8px !important;
        margin-bottom: 10px !important;
    }

    .wfacp_main_form .wc_payment_method label,
    .payment_method_title,
    .wc_payment_method label {
        color: #1a1a1a !important;
        font-weight: 500 !important;
    }

    .wfacp_main_form .payment_box,
    .payment_box {
        background: #F9F6F1 !important;
        color: #666 !important;
        border-radius: 0 0 8px 8px !important;
        padding: 15px !important;
    }

    /* === CUPÓN === */
    .wfacp-coupon-section,
    .wfacp_coupon_field_box,
    .woocommerce-form-coupon,
    .coupon {
        background: #F9F6F1 !important;
        border: 1px dashed #D4C5B5 !important;
        border-radius: 8px !important;
        padding: 15px !important;
    }

    /* === LINKS === */
    .wfacp_main_form a,
    .woocommerce a {
        color: #1a1a1a !important;
        text-decoration: underline !important;
    }

    /* === CARRITO VACÍO === */
    .cart-empty {
        text-align: center !important;
        padding: 60px 20px !important;
        color: #666 !important;
    }

    /* === STEPS/BREADCRUMB === */
    .wfacp-form-steps .wfacp-step,
    .wfacp_steps_wrap .wfacp_step {
        color: #999 !important;
    }

    .wfacp-form-steps .wfacp-step.active,
    .wfacp-form-steps .wfacp-step.completed {
        color: #1a1a1a !important;
        font-weight: 600 !important;
    }

    /* === CANTIDAD INPUT === */
    .quantity input {
        width: 60px !important;
        text-align: center !important;
        background: #FFFFFF !important;
        border: 1px solid #D4C5B5 !important;
    }

    /* === MOBILE === */
    @media (max-width: 768px) {
        .wfacp_main_form .wfacp-next-btn-wrap button,
        #place_order,
        .checkout-button {
            padding: 14px 20px !important;
            font-size: 14px !important;
        }

        .wfacp-section,
        .woocommerce-cart-form,
        .cart_totals {
            margin: 10px !important;
            padding: 15px !important;
        }
    }

    /* === OVERRIDE ELEMENTOR === */
    .elementor-widget-woocommerce-cart,
    .elementor-widget-woocommerce-checkout-page {
        --e-global-color-primary: #1a1a1a !important;
        --e-global-color-secondary: #666 !important;
    }

    /* === FORZAR FONDO CREMITA EN TODO === */
    .wfacp_main_wrapper,
    .wfacp-main-container,
    .wfacp_page,
    #wfacp-e-form,
    .wfacp-form,
    .wfacp_inner_form_wrap {
        background: #FFFBF5 !important;
    }

    </style>
    <?php
}, 99999); // Prioridad muy alta para sobreescribir otros estilos
