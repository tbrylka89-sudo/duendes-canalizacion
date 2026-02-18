<?php
/**
 * Plugin Name: Duendes Checkout Final
 * Description: CSS completo + traducciones + filtros para checkout FunnelKit - VERSIÓN AGRESIVA
 * Version: 2.0
 * Author: Duendes del Uruguay
 */

if (!defined('ABSPATH')) exit;

// =============================================================================
// PARTE 1: CSS ULTRA-AGRESIVO DEL CHECKOUT
// =============================================================================

add_action('wp_head', function() {
    // Solo en páginas de checkout FunnelKit
    if (!function_exists('is_wfacp_checkout') || !is_wfacp_checkout()) {
        // Fallback: detectar por URL
        $uri = $_SERVER['REQUEST_URI'] ?? '';
        if (strpos($uri, 'checkout') === false && strpos($uri, 'caja') === false) {
            return;
        }
    }
    ?>
    <style id="duendes-checkout-final-css">
    /* ═══════════════════════════════════════════════════════════════════════
       DUENDES CHECKOUT FINAL v2 - BLANCO, NEGRO, ELEGANTE - FUERZA BRUTA
       ═══════════════════════════════════════════════════════════════════════ */

    /* === RESET TOTAL DE COLORES DORADOS === */
    body *[style*="c9a227"],
    body *[style*="C9A227"],
    body *[style*="gold"],
    body *[style*="orange"],
    body *[style*="#d4a"],
    body *[style*="#e8d"],
    body *[style*="rgb(201"],
    body *[style*="rgb(232"] {
        background: transparent !important;
        background-color: transparent !important;
        border-color: #E5E5E5 !important;
    }

    /* === FONDO BLANCO FORZADO === */
    html,
    body,
    body.wfacp_main_wrapper,
    body.woocommerce-checkout,
    body.wfacp_checkout_page,
    #wfacp-e-form,
    .wfacp_main_form,
    .wfacp-form,
    .wfacp_page,
    .wfacp-section,
    .wfacp_inner_form_wrap,
    .wfacp-inner-form-wrap,
    .wfacp_main_form .wfacp-section,
    .elementor-section,
    .elementor-container,
    .elementor-widget-container,
    .elementor-element,
    section,
    div[class*="wfacp"],
    .wfacp_form_steps,
    .wfacp-comm-title,
    .wfacp_section_title,
    .wfacp_mb_mini_cart_sec_accordion_content,
    header,
    .site-header,
    .wfacp-header {
        background: #FFFFFF !important;
        background-color: #FFFFFF !important;
        background-image: none !important;
    }

    /* === ELIMINAR TODAS LAS LÍNEAS/BORDES DORADOS === */
    .wfacp-section,
    .wfacp_main_form .wfacp-section,
    .wfacp-comm-title,
    .wfacp_section_title,
    .wfacp-section-title,
    .wfacp_section_heading,
    .wfacp-section-heading,
    hr,
    .wfacp-divider-skin,
    .wfacp_divider_billing,
    .wfacp_divider_shipping,
    .wfacp-divider,
    [class*="divider"],
    [class*="separator"],
    .elementor-divider,
    .elementor-divider-separator {
        border-color: #E5E5E5 !important;
        border-bottom-color: #E5E5E5 !important;
        border-top-color: #E5E5E5 !important;
        background: transparent !important;
        background-color: transparent !important;
    }

    /* Líneas decorativas bajo títulos - ELIMINAR */
    .wfacp-section::before,
    .wfacp-section::after,
    .wfacp_section_title::before,
    .wfacp_section_title::after,
    .wfacp-section-title::before,
    .wfacp-section-title::after,
    .wfacp-comm-title::before,
    .wfacp-comm-title::after,
    .wfacp_section_heading::before,
    .wfacp_section_heading::after,
    .elementor-divider-separator,
    span.wfacp_section_title_line,
    .wfacp_section_title_line,
    .wfacp-section-title-line,
    hr.wfacp-divider,
    hr.wfacp_divider {
        display: none !important;
        background: transparent !important;
        background-color: transparent !important;
        border: none !important;
        height: 0 !important;
        opacity: 0 !important;
    }

    /* Títulos de sección sin líneas decorativas */
    .wfacp_section_title,
    .wfacp-section-title,
    .wfacp-comm-title,
    .wfacp_section_heading,
    h2.wfacp_section_title,
    h3.wfacp_section_title,
    .wfacp_main_form h2,
    .wfacp_main_form h3 {
        border: none !important;
        border-bottom: none !important;
        padding-bottom: 10px !important;
        margin-bottom: 15px !important;
        color: #1A1A1A !important;
        font-weight: 600 !important;
    }

    /* === BOTÓN PRINCIPAL - NEGRO FORZADO === */
    .wfacp-order-place-btn,
    .wfacp_order_place_btn,
    .wfacp-order-place-btn-wrap button,
    .wfacp-order-place-btn-wrap .wfacp-order-place-btn,
    #wfacp-e-form .wfacp_order_place_btn,
    #wfacp-e-form .wfacp-order-place-btn,
    button.wfacp-order-place-btn,
    button.wfacp_order_place_btn,
    button[type="submit"].wfacp_order_place_btn,
    button[type="submit"].wfacp-order-place-btn,
    .wfacp_main_form button.button.wfacp-order-place-btn,
    .wfacp_main_form .wfacp-order-place-btn-wrap button,
    #place_order,
    input#place_order,
    button#place_order,
    .wfacp_main_form #place_order,
    .single_add_to_cart_button,
    .checkout-button,
    .wc-proceed-to-checkout .checkout-button,
    form.wfacp-form button[type="submit"],
    form#wfacp-e-form button[type="submit"] {
        background: #1A1A1A !important;
        background-color: #1A1A1A !important;
        background-image: none !important;
        color: #FFFFFF !important;
        border: none !important;
        border-radius: 4px !important;
        font-weight: 600 !important;
        letter-spacing: 2px !important;
        padding: 18px 40px !important;
        text-transform: uppercase !important;
        font-size: 14px !important;
        box-shadow: none !important;
        transition: background 0.3s ease !important;
    }

    .wfacp-order-place-btn:hover,
    .wfacp_order_place_btn:hover,
    .wfacp-order-place-btn-wrap button:hover,
    #place_order:hover,
    button[type="submit"].wfacp_order_place_btn:hover,
    button[type="submit"].wfacp-order-place-btn:hover {
        background: #333333 !important;
        background-color: #333333 !important;
        color: #FFFFFF !important;
    }

    /* === OCULTAR TEXTO "SELLARÁS EL PACTO" DEBAJO DEL BOTÓN === */
    .wfacp-order-place-btn-wrap .wfacp_order_place_btn_lock,
    .wfacp-order-place-btn-wrap .wfacp_you_save_text,
    .wfacp-order-place-btn-wrap .wfacp_btn_below_text,
    .wfacp_main_form .wfacp_btn_below_text,
    .wfacp-place-order-btn-after-text,
    .wfacp_order_place_btn_lock,
    .wfacp_btn_text,
    .wfacp_place_order_text,
    p.wfacp_btn_below_text,
    span.wfacp_btn_below_text,
    div.wfacp_btn_below_text,
    .wfacp-order-place-btn-wrap > p,
    .wfacp-order-place-btn-wrap > span:not(:first-child),
    .wfacp-order-place-btn-wrap > div:not(:first-child):not(.wfacp-payment-secure-text),
    [class*="btn_below"],
    [class*="below_btn"],
    [class*="after_btn"],
    .wfacp-payment-secure-text,
    .wfacp_payment_secure_text {
        display: none !important;
        visibility: hidden !important;
        height: 0 !important;
        overflow: hidden !important;
        opacity: 0 !important;
        font-size: 0 !important;
    }

    /* === OCULTAR BADGES MCAFEE/NORTON Y TEXTOS DE SEGURIDAD FALSOS === */
    .wfacp_secure_badge,
    .wfacp-secure-badge,
    .wfacp_main_form .wfacp_secure_badge,
    .wfacp-payment-secure,
    .wfacp-security-badges,
    .wfacp-bank-level-security,
    .wfacp-100-secure,
    .wfacp_icon_section,
    .wfacp_payment_method_security,
    .wfacp-payment-method-security-text,
    img[src*="mcafee"],
    img[src*="norton"],
    img[src*="secure-badge"],
    img[src*="ssl-badge"],
    img[src*="trust-badge"],
    img[src*="security"],
    [class*="mcafee"],
    [class*="norton"],
    [class*="secure_badge"],
    [class*="security-badge"],
    .wfacp-icon-lock,
    .wfacp_lock_icon,
    .wfacp_main_form [class*="secure"]:not(input),
    .wfacp_main_form [class*="badge"]:not(.wfacp-product-badge):not([class*="coupon"]),
    .wfacp_guarantee_box,
    .wfacp_icon_box,
    .wfacp-trust-badges,
    .wfacp_trust_badges,
    /* Ocultar sección entera de badges de seguridad */
    .wfacp_main_form > div:last-child img,
    .elementor-widget-wfacp-order-place-button + div,
    .elementor-widget-wfacp-order-place-button ~ .elementor-widget-image,
    .wfacp-order-place-btn-wrap ~ div:has(img),
    /* Textos de seguridad */
    p:contains("256-Bit"),
    p:contains("Bank Level"),
    p:contains("100% Pagos"),
    p:contains("100% Secure"),
    span:contains("256-Bit"),
    span:contains("100% Pagos"),
    .wfacp_main_form p:has(svg),
    .wfacp_main_form div:has(> svg + span) {
        display: none !important;
        visibility: hidden !important;
        height: 0 !important;
        overflow: hidden !important;
    }

    /* === CAMPOS DE FORMULARIO === */
    .wfacp_main_form input[type="text"],
    .wfacp_main_form input[type="email"],
    .wfacp_main_form input[type="tel"],
    .wfacp_main_form input[type="number"],
    .wfacp_main_form input[type="password"],
    .wfacp_main_form select,
    .wfacp_main_form textarea,
    #wfacp-e-form input,
    #wfacp-e-form select,
    #wfacp-e-form textarea,
    .select2-container--default .select2-selection--single {
        border: 1px solid #D1D1D1 !important;
        border-radius: 4px !important;
        background: #FFFFFF !important;
        padding: 12px 16px !important;
        font-size: 14px !important;
        color: #1A1A1A !important;
        box-shadow: none !important;
    }

    .wfacp_main_form input:focus,
    .wfacp_main_form select:focus,
    .wfacp_main_form textarea:focus,
    #wfacp-e-form input:focus,
    #wfacp-e-form select:focus {
        border-color: #1A1A1A !important;
        outline: none !important;
        box-shadow: none !important;
    }

    /* === CHECKBOX DE TÉRMINOS - MÁS GRANDE === */
    .wfacp_main_form input[type="checkbox"],
    #wfacp-e-form input[type="checkbox"],
    #terms,
    input#terms {
        min-width: 22px !important;
        min-height: 22px !important;
        width: 22px !important;
        height: 22px !important;
        border: 2px solid #1A1A1A !important;
        border-radius: 3px !important;
        cursor: pointer !important;
        -webkit-appearance: none !important;
        -moz-appearance: none !important;
        appearance: none !important;
        background: #FFFFFF !important;
        position: relative !important;
        margin-right: 12px !important;
        flex-shrink: 0 !important;
        vertical-align: middle !important;
    }

    .wfacp_main_form input[type="checkbox"]:checked,
    #wfacp-e-form input[type="checkbox"]:checked,
    #terms:checked {
        background: #1A1A1A !important;
        background-color: #1A1A1A !important;
    }

    .wfacp_main_form input[type="checkbox"]:checked::after,
    #wfacp-e-form input[type="checkbox"]:checked::after,
    #terms:checked::after {
        content: '✓' !important;
        color: #FFFFFF !important;
        font-size: 16px !important;
        font-weight: bold !important;
        position: absolute !important;
        top: 50% !important;
        left: 50% !important;
        transform: translate(-50%, -50%) !important;
        line-height: 1 !important;
    }

    /* Label del checkbox clickeable */
    .woocommerce-terms-and-conditions-wrapper,
    .wfacp-form .woocommerce-terms-and-conditions-wrapper,
    .wfacp_main_form .woocommerce-terms-and-conditions-wrapper {
        display: flex !important;
        align-items: flex-start !important;
        cursor: pointer !important;
    }

    .woocommerce-terms-and-conditions-checkbox-text,
    .wfacp-form .woocommerce-terms-and-conditions-checkbox-text {
        cursor: pointer !important;
        color: #333333 !important;
        font-size: 14px !important;
        line-height: 1.5 !important;
    }

    /* === ORDER SUMMARY / RESUMEN === */
    .wfacp_order_summary,
    .wfacp-order-summary,
    .wfacp_mb_mini_cart_sec_accordion_content,
    .wfacp-product-switch-panel,
    .wfacp_order_summary_container {
        background: #F9F9F9 !important;
        border: 1px solid #E5E5E5 !important;
        border-radius: 4px !important;
    }

    .wfacp_order_summary .wfacp-product-name,
    .wfacp_order_summary .product-name,
    .wfacp-order-summary .product-name,
    .wfacp_order_summary td,
    .wfacp-order-summary td {
        color: #1A1A1A !important;
    }

    .wfacp_order_summary .wfacp-product-price,
    .wfacp_order_summary .product-price,
    .wfacp-order-summary .product-price,
    .wfacp_order_summary .amount,
    .wfacp-order-summary .amount,
    .wfacp_order_summary .woocommerce-Price-amount,
    .order-total .amount {
        color: #1A1A1A !important;
        font-weight: 600 !important;
    }

    /* === STEPS/BREADCRUMBS === */
    .wfacp_form_steps,
    .wfacp-form-steps,
    .wfacp_steps_wrap,
    .wfacp-steps-wrap {
        background: #FFFFFF !important;
    }

    .wfacp_form_steps .wfacp_step_active,
    .wfacp_form_steps .wfacp-current,
    .wfacp_steps_wrap .wfacp_current_step,
    .wfacp-step.wfacp-active,
    .wfacp_step_text_have.wfacp_active {
        color: #1A1A1A !important;
        font-weight: 600 !important;
    }

    .wfacp_form_steps span:not(.wfacp_step_active):not(.wfacp-current),
    .wfacp_steps_wrap span:not(.wfacp_current_step),
    .wfacp-step:not(.wfacp-active),
    .wfacp_step_text_have:not(.wfacp_active) {
        color: #999999 !important;
    }

    .wfacp_form_steps .wfacp_steps_sec::before,
    .wfacp_form_steps .wfacp_steps_sec::after,
    .wfacp_form_steps hr,
    .wfacp_steps_wrap .wfacp_step_sep,
    .wfacp-step-separator,
    .wfacp_step_sep {
        background: #E5E5E5 !important;
        background-color: #E5E5E5 !important;
        border-color: #E5E5E5 !important;
    }

    /* Iconos de steps */
    .wfacp_form_steps .wfacp-step-icon,
    .wfacp_form_steps svg,
    .wfacp-steps-wrap svg {
        fill: #999999 !important;
        color: #999999 !important;
    }

    .wfacp_form_steps .wfacp_step_active .wfacp-step-icon,
    .wfacp_form_steps .wfacp-current svg {
        fill: #1A1A1A !important;
        color: #1A1A1A !important;
    }

    /* === LINK DE CUPÓN === */
    .wfacp_main_form .wfacp-coupon-section a,
    .wfacp_main_form .wfacp_coupon_field_msg,
    .wfacp-coupon-link,
    .showcoupon,
    a.showcoupon,
    .wfacp_coupon_row a {
        color: #1A1A1A !important;
        text-decoration: none !important;
    }

    .wfacp_main_form .wfacp-coupon-section a:hover,
    .showcoupon:hover,
    .wfacp_coupon_row a:hover {
        text-decoration: underline !important;
    }

    /* Botón aplicar cupón */
    .wfacp_main_form .wfacp-coupon-section button,
    .wfacp_main_form .wfacp_coupon_btn,
    .wfacp-coupon-btn,
    button.wfacp_coupon_btn {
        background: #1A1A1A !important;
        background-color: #1A1A1A !important;
        color: #FFFFFF !important;
        border: none !important;
        border-radius: 4px !important;
    }

    /* === MÉTODOS DE PAGO === */
    .wfacp_main_form .wc_payment_method label,
    .wfacp_main_form .payment_method_title,
    #payment .payment_methods label {
        color: #1A1A1A !important;
    }

    .wfacp_main_form .wc_payment_methods,
    .wfacp_main_form .woocommerce-checkout-payment,
    #payment {
        background: #FFFFFF !important;
        border: 1px solid #E5E5E5 !important;
        border-radius: 4px !important;
    }

    /* === VARIABLES CSS FORZADAS === */
    :root,
    body {
        --wfacp-primary-color: #1A1A1A !important;
        --wfacp-secondary-color: #333333 !important;
        --wfacp-btn-bg: #1A1A1A !important;
        --wfacp-btn-color: #FFFFFF !important;
    }

    /* === LINKS EN GENERAL === */
    .wfacp_main_form a,
    .wfacp-form a,
    #wfacp-e-form a {
        color: #1A1A1A !important;
    }

    .wfacp_main_form a:hover,
    .wfacp-form a:hover {
        color: #333333 !important;
    }

    /* === TEXTO DE SEGURIDAD PERSONALIZADO (reemplaza McAfee/Norton) === */
    .wfacp-order-place-btn-wrap::after {
        content: '🔒 Pago 100% seguro · Datos protegidos con encriptación SSL' !important;
        display: block !important;
        color: #999999 !important;
        font-size: 13px !important;
        text-align: center !important;
        margin-top: 15px !important;
        font-weight: normal !important;
    }

    /* === TIPOGRAFÍA FORZADA === */
    .wfacp_main_form label,
    .wfacp-form label,
    #wfacp-e-form label {
        color: #333333 !important;
    }

    .wfacp_main_form p,
    .wfacp-form p {
        color: #333333 !important;
    }

    /* === OCULTAR CUALQUIER IMAGEN DE SEGURIDAD === */
    .wfacp_main_form img[alt*="secure" i],
    .wfacp_main_form img[alt*="mcafee" i],
    .wfacp_main_form img[alt*="norton" i],
    .wfacp_main_form img[alt*="ssl" i],
    .wfacp_main_form img[alt*="trust" i],
    .wfacp_main_form img[alt*="safe" i] {
        display: none !important;
    }

    </style>
    <?php
}, 99999);

// =============================================================================
// PARTE 2: JAVASCRIPT PARA FORZAR CAMBIOS (backup del CSS)
// =============================================================================

add_action('wp_footer', function() {
    // Solo en páginas de checkout
    $uri = $_SERVER['REQUEST_URI'] ?? '';
    if (strpos($uri, 'checkout') === false && strpos($uri, 'caja') === false) {
        return;
    }
    ?>
    <script id="duendes-checkout-final-js">
    (function() {
        function aplicarEstilosDuendes() {
            // Forzar botón negro
            var botones = document.querySelectorAll('.wfacp-order-place-btn, .wfacp_order_place_btn, #place_order, button[type="submit"]');
            botones.forEach(function(btn) {
                if (btn.closest('.wfacp-order-place-btn-wrap') || btn.id === 'place_order' || btn.classList.contains('wfacp_order_place_btn')) {
                    btn.style.setProperty('background', '#1A1A1A', 'important');
                    btn.style.setProperty('background-color', '#1A1A1A', 'important');
                    btn.style.setProperty('background-image', 'none', 'important');
                    btn.style.setProperty('color', '#FFFFFF', 'important');
                    btn.style.setProperty('border', 'none', 'important');
                }
            });

            // Ocultar "Sellarás el Pacto" y badges
            var elementosOcultar = document.querySelectorAll([
                '.wfacp_btn_below_text',
                '.wfacp-place-order-btn-after-text',
                '.wfacp_secure_badge',
                '.wfacp-secure-badge',
                '.wfacp-payment-secure-text',
                '.wfacp_payment_secure_text',
                '[class*="secure_badge"]',
                '[class*="mcafee"]',
                '[class*="norton"]'
            ].join(','));
            elementosOcultar.forEach(function(el) {
                el.style.setProperty('display', 'none', 'important');
            });

            // Ocultar imágenes de McAfee/Norton
            var imagenes = document.querySelectorAll('img');
            imagenes.forEach(function(img) {
                var src = (img.src || '').toLowerCase();
                var alt = (img.alt || '').toLowerCase();
                if (src.indexOf('mcafee') > -1 || src.indexOf('norton') > -1 ||
                    src.indexOf('secure') > -1 || src.indexOf('ssl') > -1 ||
                    alt.indexOf('mcafee') > -1 || alt.indexOf('norton') > -1 ||
                    alt.indexOf('256') > -1 || alt.indexOf('secure') > -1) {
                    img.style.setProperty('display', 'none', 'important');
                }
            });

            // Ocultar textos de seguridad
            var textos = document.querySelectorAll('p, span, div');
            textos.forEach(function(el) {
                var texto = (el.textContent || '').toLowerCase();
                if ((texto.indexOf('256-bit') > -1 || texto.indexOf('bank level') > -1 ||
                     texto.indexOf('100% pagos') > -1 || texto.indexOf('100% secure') > -1 ||
                     texto.indexOf('sellarás el pacto') > -1) && !el.closest('button')) {
                    el.style.setProperty('display', 'none', 'important');
                }
            });

            // Eliminar líneas doradas de secciones
            var lineas = document.querySelectorAll('.wfacp_section_title_line, hr.wfacp-divider, .elementor-divider-separator');
            lineas.forEach(function(el) {
                el.style.setProperty('display', 'none', 'important');
            });

            // Forzar fondo blanco
            document.body.style.setProperty('background', '#FFFFFF', 'important');

            // Cambiar textos en inglés
            cambiarTextos();
        }

        function cambiarTextos() {
            var traducciones = {
                'ORDER SUMMARY': 'RESUMEN DE TU PEDIDO',
                'Order Summary': 'Resumen de tu Pedido',
                'Enter your address to view shipping options.': 'Ingresá tu dirección para ver las opciones de envío.',
                'Enter your address to view shipping options': 'Ingresá tu dirección para ver las opciones de envío',
                'Your personal data will be used to process your order, support your experience throughout this website, and for other purposes described in our privacy policy.': 'Tus datos personales se usan para procesar tu pedido y mejorar tu experiencia.',
                'I have read and agree to the website terms and conditions': 'He leído y acepto los términos y condiciones',
                'Place Order': 'SELLAR EL PACTO',
                'Place order': 'SELLAR EL PACTO',
                'Have a coupon? Click here to enter your code': '¿Tenés un código? Hacé click acá',
                '256-Bit Bank Level Security': '',
                '100% Pagos Seguros': '',
                '100% Secure Payments': ''
            };

            // Buscar y reemplazar textos
            var walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
            var nodo;
            while (nodo = walker.nextNode()) {
                var texto = nodo.textContent.trim();
                if (traducciones[texto] !== undefined) {
                    if (traducciones[texto] === '') {
                        nodo.parentElement.style.display = 'none';
                    } else {
                        nodo.textContent = nodo.textContent.replace(texto, traducciones[texto]);
                    }
                }
            }
        }

        // Ejecutar inmediatamente
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', aplicarEstilosDuendes);
        } else {
            aplicarEstilosDuendes();
        }

        // Ejecutar después de que todo cargue
        window.addEventListener('load', function() {
            aplicarEstilosDuendes();
            // Y otra vez después de un delay por si AJAX carga cosas
            setTimeout(aplicarEstilosDuendes, 500);
            setTimeout(aplicarEstilosDuendes, 1500);
            setTimeout(aplicarEstilosDuendes, 3000);
        });

        // Observer para cambios dinámicos
        var observer = new MutationObserver(function(mutations) {
            aplicarEstilosDuendes();
        });
        observer.observe(document.body, { childList: true, subtree: true });
    })();
    </script>
    <?php
}, 99999);

// =============================================================================
// PARTE 3: TRADUCCIONES AL ESPAÑOL
// =============================================================================

add_filter('gettext', function($translated, $text, $domain) {
    $traducciones = [
        // Campos del formulario
        'Enter your address to view shipping options.' => 'Ingresá tu dirección para ver las opciones de envío.',
        'Enter your address to view shipping options' => 'Ingresá tu dirección para ver las opciones de envío',
        'ORDER SUMMARY' => 'RESUMEN DE TU PEDIDO',
        'Order Summary' => 'Resumen de tu Pedido',
        'SHIPPING INFORMATION' => 'INFORMACIÓN DE ENVÍO',
        'Shipping Information' => 'Información de Envío',
        'METODO DE ENVIO' => 'MÉTODO DE ENVÍO',
        'Shipping Method' => 'Método de Envío',
        'PAGO' => 'MÉTODO DE PAGO',
        'Payment' => 'Método de Pago',
        'PAYMENT' => 'MÉTODO DE PAGO',

        // Términos y privacidad
        'Your personal data will be used to process your order, support your experience throughout this website, and for other purposes described in our privacy policy.' => 'Tus datos personales se usan para procesar tu pedido y mejorar tu experiencia. Leé nuestra política de privacidad.',
        'Your personal data will be used to process your order, support your experience throughout this website, and for other purposes described in our politica de privacidad.' => 'Tus datos personales se usan para procesar tu pedido y mejorar tu experiencia. Leé nuestra política de privacidad.',
        'I have read and agree to the website terms and conditions' => 'He leído y acepto los términos y condiciones',
        'I have read and agree to the website términos y condiciones' => 'He leído y acepto los términos y condiciones',

        // Botones y acciones
        'CONFIRMAR TU COMPRA' => 'SELLAR EL PACTO',
        'Confirmar tu compra' => 'SELLAR EL PACTO',
        'Place Order' => 'SELLAR EL PACTO',
        'Place order' => 'SELLAR EL PACTO',
        'PLACE ORDER' => 'SELLAR EL PACTO',

        // Cupones
        'Coupon code' => 'Código de cupón',
        'Apply coupon' => 'Aplicar',
        'Apply Coupon' => 'Aplicar',
        'Have a coupon? Click here to enter your code' => '¿Tenés un código? Hacé click acá',
        'Have a coupon?' => '¿Tenés un código?',
        'Click here to enter your code' => 'Hacé click acá',
        'Tenes un codigo? Ingresalo aca' => '¿Tenés un código? Ingresalo acá',

        // Dirección
        'Ship to a different address?' => '¿Enviar a otra dirección?',
        'Use a different billing address' => 'Usar otra dirección de facturación',

        // Campos
        'Phone' => 'Teléfono',
        'Email address' => 'Email',
        'Email' => 'Email',
        'First name' => 'Nombre',
        'Last name' => 'Apellido',
        'Address' => 'Dirección',
        'Street address' => 'Dirección',
        'City' => 'Ciudad',
        'Town / City' => 'Ciudad',
        'State' => 'Departamento',
        'State / County' => 'Departamento',
        'Postcode' => 'Código Postal',
        'Postcode / ZIP' => 'Código Postal',
        'ZIP Code' => 'Código Postal',
        'Country' => 'País',
        'Country / Region' => 'País',
        'Apartment, suite, unit, etc.' => 'Apartamento, oficina, etc.',
        'Apartment, suite, etc.' => 'Apartamento, oficina, etc.',
        'House number and street name' => 'Número y nombre de calle',

        // Otros
        'Subtotal' => 'Subtotal',
        'Total' => 'Total',
        'Shipping' => 'Envío',
        'Free shipping' => 'Envío gratis',
        'Discount' => 'Descuento',
        'Tax' => 'Impuestos',

        // Seguridad (ocultar estos)
        '256-Bit Bank Level Security' => '',
        '100% Pagos Seguros' => '',
        '100% Secure Payments' => '',
        'Your information is protected' => '',
        'Sellarás el Pacto' => '',
    ];

    if (isset($traducciones[$text])) {
        return $traducciones[$text] === '' ? ' ' : $traducciones[$text];
    }
    return $translated;
}, 10, 3);

// =============================================================================
// PARTE 4: FILTROS PARA BOTÓN FUNNELKIT
// =============================================================================

// Filtro específico de FunnelKit para el texto del botón
add_filter('wfacp_place_order_btn_text', function($text) {
    return 'SELLAR EL PACTO';
}, 99999);

// Filtro alternativo
add_filter('woocommerce_order_button_text', function($text) {
    return 'SELLAR EL PACTO';
}, 99999);

// Filtro para el HTML del botón
add_filter('wfacp_place_order_btn_html', function($html) {
    // Quitar emojis de candado
    $html = preg_replace('/🔒|🔐|<i[^>]*lock[^>]*><\/i>/i', '', $html);
    return $html;
}, 99999);

// =============================================================================
// PARTE 5: REMOVER ACCIONES DE BADGES
// =============================================================================

add_action('init', function() {
    // Remover badges de seguridad de FunnelKit
    remove_all_actions('wfacp_after_order_place_btn');
    remove_all_actions('wfacp_below_place_order_btn');
    remove_all_actions('wfacp_before_payment_section');
    remove_all_actions('wfacp_after_payment_section');
}, 99999);

add_action('wp', function() {
    remove_all_actions('wfacp_after_order_place_btn');
    remove_all_actions('wfacp_below_place_order_btn');
}, 99999);

// =============================================================================
// PARTE 6: OCULTAR TEXTO DEBAJO DEL BOTÓN VIA FILTRO
// =============================================================================

add_filter('wfacp_btn_below_text', function($text) {
    return '';
}, 99999);

add_filter('wfacp_below_place_order_text', function($text) {
    return '';
}, 99999);
