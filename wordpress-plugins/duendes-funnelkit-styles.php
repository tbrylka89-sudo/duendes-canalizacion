<?php
/**
 * Plugin Name: Duendes - FunnelKit Checkout Styles
 * Description: Estilos premium para el checkout de FunnelKit
 * Version: 1.0
 */

if (!defined('ABSPATH')) exit;

add_action('wp_head', function() {
    // Solo en páginas de checkout de FunnelKit
    if (!is_checkout() && strpos($_SERVER['REQUEST_URI'], '/checkouts/') === false) {
        return;
    }
    ?>
    <style id="duendes-funnelkit-premium">
    /* ============================================
       DUENDES - FUNNELKIT CHECKOUT PREMIUM
       ============================================ */

    /* Fondo general del checkout */
    .wfacp_main_form,
    .wfacp-form,
    #wfacp-e-form {
        background: #0a0a0a !important;
    }

    /* Contenedor del formulario */
    .wfacp_page,
    .wfacp-section {
        background: #1a1a1a !important;
        border: 1px solid rgba(201, 162, 39, 0.2) !important;
        border-radius: 12px !important;
    }

    /* Títulos de secciones */
    .wfacp-section .wfacp-section-title,
    .wfacp_section_title,
    .wfacp-comm-title h2,
    .wfacp-section h2,
    .wfacp-section h3 {
        color: #c9a227 !important;
        font-family: 'Cinzel', serif !important;
    }

    /* Labels de campos */
    .wfacp_main_form label,
    .wfacp-form label {
        color: rgba(255,255,255,0.8) !important;
    }

    /* Inputs */
    .wfacp_main_form input[type="text"],
    .wfacp_main_form input[type="email"],
    .wfacp_main_form input[type="tel"],
    .wfacp_main_form input[type="number"],
    .wfacp_main_form select,
    .wfacp_main_form textarea,
    .wfacp-form input,
    .wfacp-form select,
    .wfacp-form textarea {
        background: #0a0a0a !important;
        border: 1px solid rgba(201, 162, 39, 0.3) !important;
        color: #fff !important;
        border-radius: 8px !important;
    }

    .wfacp_main_form input:focus,
    .wfacp_main_form select:focus,
    .wfacp-form input:focus,
    .wfacp-form select:focus {
        border-color: #c9a227 !important;
        box-shadow: 0 0 0 2px rgba(201, 162, 39, 0.2) !important;
    }

    /* ============================================
       RESUMEN DEL PEDIDO - COLORES PREMIUM
       ============================================ */

    /* Filas del resumen - NEGRO en vez de beige */
    .wfacp_order_summary_container,
    .wfacp-order-summary-wrap,
    .wfacp_order_summary,
    .wfacp-product-switch-panel {
        background: #1a1a1a !important;
    }

    /* Subtotal, Envío, Total - fondo oscuro */
    .wfacp_order_summary tr,
    .wfacp_order_summary .cart-subtotal,
    .wfacp_order_summary .order-total,
    .wfacp_order_summary .woocommerce-shipping-totals,
    .wfacp-order-summary-wrap tr,
    tr.cart-subtotal,
    tr.order-total,
    tr.woocommerce-shipping-totals {
        background: #1a1a1a !important;
    }

    /* Fila de subtotal */
    .wfacp_order_summary .cart-subtotal td,
    .wfacp_order_summary .cart-subtotal th,
    tr.cart-subtotal td,
    tr.cart-subtotal th {
        background: rgba(201, 162, 39, 0.1) !important;
        color: #fff !important;
        border-color: rgba(201, 162, 39, 0.2) !important;
    }

    /* Fila de total - destacada con dorado */
    .wfacp_order_summary .order-total td,
    .wfacp_order_summary .order-total th,
    tr.order-total td,
    tr.order-total th {
        background: rgba(201, 162, 39, 0.15) !important;
        color: #c9a227 !important;
        font-weight: bold !important;
        border-color: rgba(201, 162, 39, 0.3) !important;
    }

    /* Producto en el resumen */
    .wfacp_order_summary .wfacp_product_row,
    .wfacp_order_summary .cart_item,
    .wfacp-product-row {
        background: #0a0a0a !important;
        border-bottom: 1px solid rgba(201, 162, 39, 0.1) !important;
    }

    /* Texto del resumen */
    .wfacp_order_summary td,
    .wfacp_order_summary th,
    .wfacp-order-summary-wrap td,
    .wfacp-order-summary-wrap th {
        color: rgba(255,255,255,0.85) !important;
    }

    /* ============================================
       BOTÓN DE COMPRA - NEGRO ELEGANTE O DORADO
       ============================================ */

    /* Botón principal */
    .wfacp_main_form .wfacp-next-btn-wrap button,
    .wfacp_main_form #place_order,
    #place_order,
    .wfacp-btn-primary,
    button.button.wfacp-next-btn {
        background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%) !important;
        border: 2px solid #c9a227 !important;
        color: #c9a227 !important;
        font-family: 'Cinzel', serif !important;
        font-weight: 600 !important;
        letter-spacing: 2px !important;
        text-transform: uppercase !important;
        padding: 18px 40px !important;
        border-radius: 8px !important;
        transition: all 0.3s ease !important;
    }

    .wfacp_main_form .wfacp-next-btn-wrap button:hover,
    .wfacp_main_form #place_order:hover,
    #place_order:hover {
        background: linear-gradient(135deg, #c9a227 0%, #e8d48b 100%) !important;
        color: #0a0a0a !important;
        border-color: #c9a227 !important;
        transform: translateY(-2px) !important;
        box-shadow: 0 8px 25px rgba(201, 162, 39, 0.3) !important;
    }

    /* ============================================
       OPCIONES DE TIPO DESTINATARIO
       ============================================ */

    /* Contenedor de opciones radio */
    .wfacp_main_form .woocommerce-input-wrapper label,
    .duendes-tipo-opcion,
    .wfacp-radio-option {
        background: #1a1a1a !important;
        border: 1px solid rgba(201, 162, 39, 0.2) !important;
        border-radius: 10px !important;
        color: #fff !important;
        transition: all 0.3s ease !important;
    }

    .wfacp_main_form .woocommerce-input-wrapper label:hover,
    .duendes-tipo-opcion:hover {
        border-color: #c9a227 !important;
        background: rgba(201, 162, 39, 0.05) !important;
    }

    /* Opción seleccionada */
    .wfacp_main_form .woocommerce-input-wrapper input:checked + label,
    .duendes-tipo-opcion.selected {
        border-color: #c9a227 !important;
        background: rgba(201, 162, 39, 0.1) !important;
    }

    /* ============================================
       MÉTODOS DE PAGO
       ============================================ */

    .wfacp_main_form .wc_payment_methods,
    .wfacp_main_form .wc_payment_method,
    .payment_methods li {
        background: #1a1a1a !important;
        border: 1px solid rgba(201, 162, 39, 0.2) !important;
        border-radius: 8px !important;
        margin-bottom: 10px !important;
    }

    .wfacp_main_form .wc_payment_method label,
    .payment_method_title {
        color: #fff !important;
    }

    .wfacp_main_form .payment_box,
    .payment_box {
        background: rgba(201, 162, 39, 0.05) !important;
        color: rgba(255,255,255,0.8) !important;
        border-radius: 0 0 8px 8px !important;
    }

    /* ============================================
       CUPÓN
       ============================================ */

    .wfacp-coupon-section,
    .wfacp_coupon_field_box,
    .woocommerce-form-coupon {
        background: rgba(201, 162, 39, 0.05) !important;
        border: 1px dashed rgba(201, 162, 39, 0.3) !important;
        border-radius: 8px !important;
    }

    .wfacp-coupon-section a,
    .wfacp_coupon_field_box a {
        color: #c9a227 !important;
    }

    /* ============================================
       STEPS/BREADCRUMB
       ============================================ */

    .wfacp-form-steps,
    .wfacp_steps_wrap {
        background: transparent !important;
    }

    .wfacp-form-steps .wfacp-step,
    .wfacp_steps_wrap .wfacp_step {
        color: rgba(255,255,255,0.5) !important;
    }

    .wfacp-form-steps .wfacp-step.active,
    .wfacp-form-steps .wfacp-step.completed,
    .wfacp_steps_wrap .wfacp_step.wfacp_active {
        color: #c9a227 !important;
    }

    .wfacp-form-steps .wfacp-step-line,
    .wfacp_step_line {
        background: rgba(201, 162, 39, 0.3) !important;
    }

    /* ============================================
       BADGES DE SEGURIDAD
       ============================================ */

    .wfacp-payment-secure-badge,
    .wfacp-secure-badges {
        filter: brightness(0.8) !important;
    }

    /* ============================================
       TEXTOS GENERALES
       ============================================ */

    .wfacp_main_form p,
    .wfacp_main_form span,
    .wfacp_main_form div {
        color: rgba(255,255,255,0.85) !important;
    }

    /* Links */
    .wfacp_main_form a {
        color: #c9a227 !important;
    }

    /* Checkboxes y términos */
    .wfacp_main_form .woocommerce-terms-and-conditions-wrapper {
        color: rgba(255,255,255,0.7) !important;
    }

    /* ============================================
       MINI CART / MOSTRAR RESUMEN
       ============================================ */

    .wfacp_mini_cart_start_h,
    .wfacp-product-switch-title {
        background: #1a1a1a !important;
        color: #c9a227 !important;
        border: 1px solid rgba(201, 162, 39, 0.2) !important;
    }

    /* ============================================
       MOBILE FIXES
       ============================================ */

    @media (max-width: 768px) {
        .wfacp_main_form .wfacp-next-btn-wrap button,
        #place_order {
            padding: 15px 30px !important;
            font-size: 14px !important;
        }
    }

    /* ============================================
       OVERRIDE ELEMENTOR BACKGROUNDS
       ============================================ */

    .elementor-section[data-element_type="section"],
    .elementor-element[data-element_type="widget"] {
        --e-global-color-primary: #c9a227 !important;
    }

    /* Remover cualquier fondo claro residual */
    .wfacp-section,
    .wfacp_main_form .wfacp-section,
    .wfacp-e-form .wfacp-section,
    [class*="wfacp"] {
        --wfacp-primary-color: #c9a227 !important;
        --wfacp-section-bg: #1a1a1a !important;
    }

    </style>
    <?php
}, 9999);
