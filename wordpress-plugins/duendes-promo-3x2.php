<?php
/**
 * Plugin Name: Duendes - Promoción 3x2 + Estilo Carrito/Checkout
 * Description: Promo 3x2 y estética oscura completa para carrito y checkout
 * Version: 2.0
 * Author: Duendes del Uruguay
 */

if (!defined('ABSPATH')) exit;

// ═══════════════════════════════════════════════════════════════════════════
// CONFIGURACIÓN
// ═══════════════════════════════════════════════════════════════════════════

define('DUENDES_PROMO_3X2_ACTIVA', true);
define('DUENDES_PROMO_GUARDIANES_REQUERIDOS', 2);
define('DUENDES_PROMO_CATEGORIA_MINI', 'mini');

// ═══════════════════════════════════════════════════════════════════════════
// ESTILOS GLOBALES PARA CARRITO Y CHECKOUT
// ═══════════════════════════════════════════════════════════════════════════

add_action('wp_head', 'duendes_estilos_carrito_checkout', 999);

function duendes_estilos_carrito_checkout() {
    if (!is_cart() && !is_checkout()) return;
    ?>
    <style id="duendes-cart-checkout-styles">
    /* ═══════════════════════════════════════════════════════════════════
       VARIABLES Y BASE
       ═══════════════════════════════════════════════════════════════════ */
    :root {
        --duendes-bg-dark: #0a0a0f;
        --duendes-bg-card: #0d0d14;
        --duendes-bg-card-hover: #12101a;
        --duendes-gold: #C6A962;
        --duendes-gold-dim: rgba(198,169,98,0.6);
        --duendes-gold-subtle: rgba(198,169,98,0.15);
        --duendes-gold-border: rgba(198,169,98,0.25);
        --duendes-text: #ffffff;
        --duendes-text-dim: rgba(255,255,255,0.7);
        --duendes-text-muted: rgba(255,255,255,0.5);
        --duendes-font-title: 'Cinzel', Georgia, serif;
        --duendes-font-body: 'Cormorant Garamond', Georgia, serif;
    }

    /* ═══════════════════════════════════════════════════════════════════
       FONDO GENERAL
       ═══════════════════════════════════════════════════════════════════ */
    body.woocommerce-cart,
    body.woocommerce-checkout {
        background: var(--duendes-bg-dark) !important;
    }

    body.woocommerce-cart .site-content,
    body.woocommerce-checkout .site-content,
    body.woocommerce-cart .entry-content,
    body.woocommerce-checkout .entry-content,
    body.woocommerce-cart main,
    body.woocommerce-checkout main,
    body.woocommerce-cart article,
    body.woocommerce-checkout article {
        background: transparent !important;
    }

    .woocommerce-cart .woocommerce,
    .woocommerce-checkout .woocommerce {
        max-width: 1200px;
        margin: 0 auto;
        padding: 40px 20px;
    }

    /* Ocultar notices molestos */
    .woocommerce-message,
    .woocommerce-info:not(.duendes-keep) {
        display: none !important;
    }

    /* ═══════════════════════════════════════════════════════════════════
       PÁGINA DE CARRITO
       ═══════════════════════════════════════════════════════════════════ */

    /* Contenedor principal del carrito */
    .woocommerce-cart-form {
        background: linear-gradient(145deg, var(--duendes-bg-card) 0%, var(--duendes-bg-card-hover) 100%);
        border: 1px solid var(--duendes-gold-border);
        border-radius: 20px;
        padding: 30px;
        margin-bottom: 30px;
    }

    /* Tabla del carrito */
    .woocommerce table.shop_table {
        background: transparent !important;
        border: none !important;
        border-collapse: separate;
        border-spacing: 0 12px;
    }

    .woocommerce table.shop_table thead {
        display: none; /* Ocultar encabezados - diseño más limpio */
    }

    .woocommerce table.shop_table tbody tr {
        background: rgba(255,255,255,0.02);
        border-radius: 12px;
        transition: all 0.3s ease;
    }

    .woocommerce table.shop_table tbody tr:hover {
        background: var(--duendes-gold-subtle);
    }

    .woocommerce table.shop_table td {
        background: transparent !important;
        border: none !important;
        padding: 20px 15px !important;
        vertical-align: middle;
        color: var(--duendes-text) !important;
    }

    .woocommerce table.shop_table td:first-child {
        border-radius: 12px 0 0 12px;
    }

    .woocommerce table.shop_table td:last-child {
        border-radius: 0 12px 12px 0;
    }

    /* Imagen del producto */
    .woocommerce table.shop_table td.product-thumbnail img {
        border-radius: 12px;
        width: 80px !important;
        height: 80px !important;
        object-fit: cover;
        border: 1px solid var(--duendes-gold-border);
    }

    /* Nombre del producto */
    .woocommerce table.shop_table td.product-name {
        font-family: var(--duendes-font-body);
        font-size: 18px;
    }

    .woocommerce table.shop_table td.product-name a {
        color: var(--duendes-text) !important;
        text-decoration: none !important;
        transition: color 0.3s ease;
    }

    .woocommerce table.shop_table td.product-name a:hover {
        color: var(--duendes-gold) !important;
    }

    /* Precio */
    .woocommerce table.shop_table td.product-price,
    .woocommerce table.shop_table td.product-subtotal {
        font-family: var(--duendes-font-title);
        font-size: 16px;
        color: var(--duendes-gold) !important;
        letter-spacing: 1px;
    }

    .woocommerce table.shop_table .woocommerce-Price-amount {
        color: var(--duendes-gold) !important;
    }

    /* Campo de cantidad */
    .woocommerce table.shop_table td.product-quantity .quantity {
        display: flex;
        align-items: center;
        gap: 8px;
    }

    .woocommerce table.shop_table .quantity .qty {
        background: rgba(255,255,255,0.05) !important;
        border: 1px solid var(--duendes-gold-border) !important;
        color: var(--duendes-text) !important;
        border-radius: 8px !important;
        width: 60px !important;
        height: 40px !important;
        text-align: center;
        font-family: var(--duendes-font-title);
    }

    /* Botón eliminar */
    .woocommerce table.shop_table td.product-remove a.remove {
        color: var(--duendes-gold-dim) !important;
        font-size: 24px;
        transition: all 0.3s ease;
    }

    .woocommerce table.shop_table td.product-remove a.remove:hover {
        color: #ff6b6b !important;
        background: transparent !important;
    }

    /* Cupón y actualizar carrito */
    .woocommerce table.shop_table td.actions {
        background: transparent !important;
        padding-top: 30px !important;
    }

    .woocommerce .coupon {
        display: flex !important;
        gap: 12px;
        align-items: center;
        flex-wrap: wrap;
    }

    .woocommerce .coupon label {
        display: none;
    }

    .woocommerce .coupon #coupon_code {
        background: rgba(255,255,255,0.05);
        border: 1px solid var(--duendes-gold-border);
        border-radius: 25px;
        padding: 12px 20px;
        color: var(--duendes-text);
        font-family: var(--duendes-font-body);
        min-width: 200px;
    }

    .woocommerce .coupon #coupon_code::placeholder {
        color: var(--duendes-text-muted);
    }

    .woocommerce .coupon #coupon_code:focus {
        border-color: var(--duendes-gold);
        outline: none;
        box-shadow: 0 0 15px rgba(198,169,98,0.2);
    }

    /* Botones del carrito */
    .woocommerce .button,
    .woocommerce button.button,
    .woocommerce input.button {
        background: linear-gradient(135deg, var(--duendes-gold) 0%, #a88a42 100%) !important;
        color: var(--duendes-bg-dark) !important;
        border: none !important;
        border-radius: 25px !important;
        padding: 12px 28px !important;
        font-family: var(--duendes-font-title) !important;
        font-size: 13px !important;
        font-weight: 600 !important;
        letter-spacing: 1.5px !important;
        text-transform: uppercase !important;
        cursor: pointer !important;
        transition: all 0.3s ease !important;
    }

    .woocommerce .button:hover,
    .woocommerce button.button:hover,
    .woocommerce input.button:hover {
        transform: translateY(-2px) !important;
        box-shadow: 0 8px 25px rgba(198,169,98,0.35) !important;
    }

    .woocommerce button[name="update_cart"] {
        background: transparent !important;
        border: 1px solid var(--duendes-gold-border) !important;
        color: var(--duendes-gold) !important;
    }

    .woocommerce button[name="update_cart"]:hover {
        background: var(--duendes-gold-subtle) !important;
        border-color: var(--duendes-gold) !important;
    }

    /* ═══════════════════════════════════════════════════════════════════
       TOTALES DEL CARRITO
       ═══════════════════════════════════════════════════════════════════ */

    .cart_totals {
        background: linear-gradient(145deg, var(--duendes-bg-card) 0%, var(--duendes-bg-card-hover) 100%);
        border: 1px solid var(--duendes-gold-border);
        border-radius: 20px;
        padding: 30px;
    }

    .cart_totals h2 {
        color: var(--duendes-gold) !important;
        font-family: var(--duendes-font-title) !important;
        font-size: 18px !important;
        letter-spacing: 3px !important;
        text-transform: uppercase !important;
        margin-bottom: 25px !important;
        padding-bottom: 15px;
        border-bottom: 1px solid var(--duendes-gold-border);
    }

    .cart_totals table {
        background: transparent !important;
        border: none !important;
    }

    .cart_totals table th,
    .cart_totals table td {
        background: transparent !important;
        border: none !important;
        padding: 12px 0 !important;
        color: var(--duendes-text) !important;
        font-family: var(--duendes-font-body);
        font-size: 16px;
    }

    .cart_totals table th {
        color: var(--duendes-text-dim) !important;
        text-transform: uppercase;
        letter-spacing: 1px;
        font-size: 12px;
    }

    .cart_totals table .order-total th,
    .cart_totals table .order-total td {
        font-family: var(--duendes-font-title) !important;
        font-size: 20px !important;
        color: var(--duendes-gold) !important;
        padding-top: 20px !important;
        border-top: 1px solid var(--duendes-gold-border) !important;
    }

    .cart_totals .wc-proceed-to-checkout {
        margin-top: 25px;
    }

    .cart_totals .wc-proceed-to-checkout .checkout-button {
        width: 100%;
        text-align: center;
        padding: 16px 28px !important;
        font-size: 14px !important;
    }

    /* Shipping */
    .cart_totals .shipping th,
    .cart_totals .shipping td {
        vertical-align: top;
    }

    .cart_totals .shipping ul {
        list-style: none;
        margin: 0;
        padding: 0;
    }

    .cart_totals .shipping li {
        margin-bottom: 8px;
        color: var(--duendes-text-dim);
    }

    .cart_totals .shipping label {
        color: var(--duendes-text) !important;
    }

    .cart_totals .shipping .woocommerce-Price-amount {
        color: var(--duendes-gold) !important;
    }

    /* ═══════════════════════════════════════════════════════════════════
       PÁGINA DE CHECKOUT
       ═══════════════════════════════════════════════════════════════════ */

    .woocommerce-checkout .woocommerce {
        display: grid;
        grid-template-columns: 1fr 400px;
        gap: 40px;
        align-items: start;
    }

    @media (max-width: 968px) {
        .woocommerce-checkout .woocommerce {
            grid-template-columns: 1fr;
        }
    }

    /* Formulario de checkout */
    .woocommerce-checkout .woocommerce-billing-fields,
    .woocommerce-checkout .woocommerce-shipping-fields,
    .woocommerce-checkout .woocommerce-additional-fields {
        background: linear-gradient(145deg, var(--duendes-bg-card) 0%, var(--duendes-bg-card-hover) 100%);
        border: 1px solid var(--duendes-gold-border);
        border-radius: 20px;
        padding: 30px;
        margin-bottom: 25px;
    }

    .woocommerce-checkout h3 {
        color: var(--duendes-gold) !important;
        font-family: var(--duendes-font-title) !important;
        font-size: 16px !important;
        letter-spacing: 3px !important;
        text-transform: uppercase !important;
        margin: 0 0 25px 0 !important;
        padding-bottom: 15px;
        border-bottom: 1px solid var(--duendes-gold-border);
    }

    /* Campos del formulario */
    .woocommerce-checkout .form-row {
        margin-bottom: 18px;
    }

    .woocommerce-checkout .form-row label {
        color: var(--duendes-text-dim) !important;
        font-family: var(--duendes-font-body);
        font-size: 14px;
        margin-bottom: 8px;
        display: block;
    }

    .woocommerce-checkout .form-row label .required {
        color: var(--duendes-gold);
    }

    .woocommerce-checkout input[type="text"],
    .woocommerce-checkout input[type="email"],
    .woocommerce-checkout input[type="tel"],
    .woocommerce-checkout input[type="number"],
    .woocommerce-checkout input[type="password"],
    .woocommerce-checkout select,
    .woocommerce-checkout textarea {
        background: rgba(255,255,255,0.03) !important;
        border: 1px solid var(--duendes-gold-border) !important;
        border-radius: 12px !important;
        padding: 14px 18px !important;
        color: var(--duendes-text) !important;
        font-family: var(--duendes-font-body) !important;
        font-size: 15px !important;
        width: 100%;
        transition: all 0.3s ease;
    }

    .woocommerce-checkout input:focus,
    .woocommerce-checkout select:focus,
    .woocommerce-checkout textarea:focus {
        border-color: var(--duendes-gold) !important;
        outline: none !important;
        box-shadow: 0 0 20px rgba(198,169,98,0.15) !important;
        background: rgba(198,169,98,0.03) !important;
    }

    .woocommerce-checkout input::placeholder,
    .woocommerce-checkout textarea::placeholder {
        color: var(--duendes-text-muted) !important;
    }

    /* Select2 dropdowns */
    .woocommerce-checkout .select2-container--default .select2-selection--single {
        background: rgba(255,255,255,0.03) !important;
        border: 1px solid var(--duendes-gold-border) !important;
        border-radius: 12px !important;
        height: 50px !important;
    }

    .woocommerce-checkout .select2-container--default .select2-selection--single .select2-selection__rendered {
        color: var(--duendes-text) !important;
        line-height: 50px !important;
        padding-left: 18px !important;
        font-family: var(--duendes-font-body) !important;
    }

    .woocommerce-checkout .select2-container--default .select2-selection--single .select2-selection__arrow {
        height: 50px !important;
        right: 12px !important;
    }

    .select2-dropdown {
        background: var(--duendes-bg-card) !important;
        border: 1px solid var(--duendes-gold-border) !important;
        border-radius: 12px !important;
    }

    .select2-results__option {
        color: var(--duendes-text) !important;
        padding: 12px 18px !important;
    }

    .select2-results__option--highlighted {
        background: var(--duendes-gold-subtle) !important;
        color: var(--duendes-gold) !important;
    }

    /* ═══════════════════════════════════════════════════════════════════
       RESUMEN DEL PEDIDO (CHECKOUT)
       ═══════════════════════════════════════════════════════════════════ */

    .woocommerce-checkout-review-order {
        background: linear-gradient(145deg, var(--duendes-bg-card) 0%, #15121f 100%);
        border: 1px solid var(--duendes-gold-border);
        border-radius: 20px;
        padding: 30px;
        position: sticky;
        top: 30px;
    }

    .woocommerce-checkout-review-order h3 {
        border-bottom: none;
        margin-bottom: 20px !important;
    }

    .woocommerce-checkout-review-order-table {
        background: transparent !important;
        border: none !important;
    }

    .woocommerce-checkout-review-order-table th,
    .woocommerce-checkout-review-order-table td {
        background: transparent !important;
        border: none !important;
        padding: 12px 0 !important;
        color: var(--duendes-text) !important;
        font-family: var(--duendes-font-body);
    }

    .woocommerce-checkout-review-order-table thead th {
        color: var(--duendes-text-muted) !important;
        font-size: 12px;
        text-transform: uppercase;
        letter-spacing: 1px;
        border-bottom: 1px solid var(--duendes-gold-border) !important;
        padding-bottom: 15px !important;
    }

    .woocommerce-checkout-review-order-table tbody tr {
        border-bottom: 1px solid rgba(255,255,255,0.05);
    }

    .woocommerce-checkout-review-order-table .product-name {
        font-size: 15px;
    }

    .woocommerce-checkout-review-order-table .product-total {
        color: var(--duendes-gold) !important;
        font-family: var(--duendes-font-title);
    }

    .woocommerce-checkout-review-order-table tfoot th {
        color: var(--duendes-text-dim) !important;
        text-transform: uppercase;
        font-size: 12px;
        letter-spacing: 1px;
    }

    .woocommerce-checkout-review-order-table tfoot .order-total th,
    .woocommerce-checkout-review-order-table tfoot .order-total td {
        font-family: var(--duendes-font-title) !important;
        font-size: 22px !important;
        color: var(--duendes-gold) !important;
        padding-top: 20px !important;
        border-top: 1px solid var(--duendes-gold-border) !important;
    }

    /* Métodos de pago */
    .woocommerce-checkout-payment {
        background: transparent !important;
        margin-top: 25px;
    }

    .woocommerce-checkout-payment ul.payment_methods {
        list-style: none;
        padding: 0;
        margin: 0 0 20px 0;
        border: none !important;
    }

    .woocommerce-checkout-payment li.payment_method {
        background: rgba(255,255,255,0.02);
        border: 1px solid var(--duendes-gold-border);
        border-radius: 12px;
        margin-bottom: 10px;
        padding: 15px;
        transition: all 0.3s ease;
    }

    .woocommerce-checkout-payment li.payment_method:hover {
        border-color: var(--duendes-gold-dim);
    }

    .woocommerce-checkout-payment li.payment_method label {
        color: var(--duendes-text) !important;
        font-family: var(--duendes-font-body);
        cursor: pointer;
    }

    .woocommerce-checkout-payment .payment_box {
        background: var(--duendes-gold-subtle) !important;
        border-radius: 8px;
        margin-top: 12px;
        padding: 15px;
        color: var(--duendes-text-dim);
        font-size: 14px;
    }

    .woocommerce-checkout-payment .payment_box::before {
        display: none;
    }

    /* Botón de compra */
    .woocommerce-checkout #place_order {
        width: 100%;
        padding: 18px 28px !important;
        font-size: 15px !important;
        margin-top: 15px;
    }

    /* Terms */
    .woocommerce-checkout .woocommerce-terms-and-conditions-wrapper {
        margin: 20px 0;
    }

    .woocommerce-checkout .woocommerce-privacy-policy-text {
        color: var(--duendes-text-muted);
        font-size: 13px;
    }

    .woocommerce-checkout .woocommerce-privacy-policy-text a {
        color: var(--duendes-gold);
    }

    /* Checkbox styling */
    .woocommerce-checkout input[type="checkbox"] {
        appearance: none;
        -webkit-appearance: none;
        width: 20px;
        height: 20px;
        background: rgba(255,255,255,0.03);
        border: 1px solid var(--duendes-gold-border);
        border-radius: 4px;
        cursor: pointer;
        position: relative;
        vertical-align: middle;
        margin-right: 10px;
    }

    .woocommerce-checkout input[type="checkbox"]:checked {
        background: var(--duendes-gold);
        border-color: var(--duendes-gold);
    }

    .woocommerce-checkout input[type="checkbox"]:checked::after {
        content: '✓';
        position: absolute;
        color: var(--duendes-bg-dark);
        font-size: 14px;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }

    /* ═══════════════════════════════════════════════════════════════════
       RESPONSIVE
       ═══════════════════════════════════════════════════════════════════ */

    @media (max-width: 768px) {
        .woocommerce-cart-form {
            padding: 20px;
        }

        .woocommerce table.shop_table td {
            padding: 12px 8px !important;
        }

        .woocommerce table.shop_table td.product-thumbnail img {
            width: 60px !important;
            height: 60px !important;
        }

        .woocommerce table.shop_table td.product-name {
            font-size: 15px;
        }

        .cart_totals,
        .woocommerce-checkout .woocommerce-billing-fields,
        .woocommerce-checkout-review-order {
            padding: 20px;
        }

        .woocommerce-checkout .woocommerce {
            padding: 20px 15px;
        }
    }
    </style>
    <?php
}

// ═══════════════════════════════════════════════════════════════════════════
// HOOKS PARA LA PROMO 3x2
// ═══════════════════════════════════════════════════════════════════════════

add_action('woocommerce_after_cart_table', 'duendes_verificar_promo_3x2');
add_action('woocommerce_before_checkout_form', 'duendes_verificar_promo_3x2', 5);

function duendes_verificar_promo_3x2() {
    if (!DUENDES_PROMO_3X2_ACTIVA) return;
    if (!WC()->cart) return;

    $guardianes = duendes_contar_guardianes_carrito();
    $minis_actuales = duendes_contar_minis_gratis_en_carrito();
    $minis_merecidos = floor($guardianes / DUENDES_PROMO_GUARDIANES_REQUERIDOS);
    $minis_pendientes = $minis_merecidos - $minis_actuales;

    if ($minis_pendientes > 0) {
        duendes_mostrar_selector_mini($minis_pendientes, $minis_merecidos);
    }
}

function duendes_contar_guardianes_carrito() {
    if (!WC()->cart) return 0;

    $count = 0;
    foreach (WC()->cart->get_cart() as $cart_item) {
        if (isset($cart_item['duendes_mini_gratis']) && $cart_item['duendes_mini_gratis']) {
            continue;
        }
        if (!has_term(DUENDES_PROMO_CATEGORIA_MINI, 'product_cat', $cart_item['product_id'])) {
            $count += $cart_item['quantity'];
        }
    }
    return $count;
}

function duendes_contar_minis_gratis_en_carrito() {
    if (!WC()->cart) return 0;

    $count = 0;
    foreach (WC()->cart->get_cart() as $cart_item) {
        if (isset($cart_item['duendes_mini_gratis']) && $cart_item['duendes_mini_gratis']) {
            $count += $cart_item['quantity'];
        }
    }
    return $count;
}

// ═══════════════════════════════════════════════════════════════════════════
// SELECTOR DE MINI GRATIS
// ═══════════════════════════════════════════════════════════════════════════

function duendes_mostrar_selector_mini($minis_pendientes = 1, $minis_totales = 1) {
    $categoria = get_term_by('slug', DUENDES_PROMO_CATEGORIA_MINI, 'product_cat');
    if (!$categoria) return;

    $query = new WP_Query([
        'post_type' => 'product',
        'post_status' => 'publish',
        'posts_per_page' => 8,
        'tax_query' => [[
            'taxonomy' => 'product_cat',
            'field' => 'term_id',
            'terms' => $categoria->term_id,
        ]]
    ]);

    $minis = [];
    if ($query->have_posts()) {
        while ($query->have_posts()) {
            $query->the_post();
            $product = wc_get_product(get_the_ID());
            if ($product && $product->is_in_stock()) {
                $minis[] = $product;
            }
        }
        wp_reset_postdata();
    }

    if (empty($minis)) return;
    ?>
    <div class="duendes-promo-3x2-selector">
        <style>
            .duendes-promo-3x2-selector {
                margin: 35px 0;
            }
            .duendes-promo-box {
                background: linear-gradient(145deg, #0d0d14 0%, #18141f 100%);
                border: 1px solid rgba(198,169,98,0.35);
                border-radius: 20px;
                padding: 35px;
                text-align: center;
                position: relative;
                overflow: hidden;
            }
            .duendes-promo-box::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                height: 2px;
                background: linear-gradient(90deg, transparent, #C6A962, transparent);
            }
            .duendes-promo-titulo {
                color: #C6A962;
                margin: 0 0 8px 0;
                font-family: 'Cinzel', Georgia, serif;
                font-size: 20px;
                font-weight: 500;
                letter-spacing: 2px;
                text-transform: uppercase;
            }
            .duendes-promo-subtitulo {
                color: rgba(255,255,255,0.7);
                margin: 0 0 28px 0;
                font-family: 'Cormorant Garamond', Georgia, serif;
                font-size: 16px;
                font-style: italic;
            }
            .duendes-minis-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
                gap: 15px;
                max-width: 600px;
                margin: 0 auto 28px auto;
            }
            .duendes-mini-opcion {
                background: rgba(198,169,98,0.04);
                border: 1px solid rgba(198,169,98,0.2);
                border-radius: 14px;
                padding: 18px 12px;
                cursor: pointer;
                transition: all 0.3s ease;
            }
            .duendes-mini-opcion:hover {
                border-color: rgba(198,169,98,0.5);
                transform: translateY(-4px);
                box-shadow: 0 12px 35px rgba(0,0,0,0.4);
            }
            .duendes-mini-opcion.elegido {
                border-color: #C6A962;
                background: rgba(198,169,98,0.12);
                box-shadow: 0 0 25px rgba(198,169,98,0.25);
            }
            .duendes-mini-opcion img {
                width: 85px;
                height: 85px;
                object-fit: cover;
                border-radius: 10px;
                margin-bottom: 10px;
            }
            .duendes-mini-opcion span {
                display: block;
                color: #fff;
                font-family: 'Cormorant Garamond', Georgia, serif;
                font-size: 14px;
                line-height: 1.3;
            }
            .duendes-promo-btn {
                background: linear-gradient(135deg, #C6A962 0%, #a88a42 100%);
                color: #0d0d14;
                border: none;
                padding: 15px 40px;
                border-radius: 30px;
                font-family: 'Cinzel', Georgia, serif;
                font-size: 14px;
                font-weight: 600;
                letter-spacing: 1.5px;
                text-transform: uppercase;
                cursor: pointer;
                opacity: 0.35;
                transition: all 0.3s ease;
            }
            .duendes-promo-btn.activo {
                opacity: 1;
            }
            .duendes-promo-btn.activo:hover {
                transform: scale(1.03);
                box-shadow: 0 10px 30px rgba(198,169,98,0.4);
            }
            .duendes-promo-nota {
                color: rgba(255,255,255,0.35);
                font-size: 12px;
                margin: 20px 0 0 0;
                font-family: 'Cormorant Garamond', Georgia, serif;
                font-style: italic;
            }
        </style>

        <div class="duendes-promo-box">
            <h3 class="duendes-promo-titulo">
                <?php echo $minis_pendientes > 1 ? "Elegí tus {$minis_pendientes} regalos" : "Tu regalo te espera"; ?>
            </h3>
            <p class="duendes-promo-subtitulo">
                <?php echo $minis_pendientes > 1
                    ? "Seleccioná {$minis_pendientes} mini guardianes de regalo"
                    : "Seleccioná el mini guardián que querés llevarte"; ?>
            </p>

            <div class="duendes-minis-grid">
                <?php foreach ($minis as $mini):
                    $img = wp_get_attachment_image_url($mini->get_image_id(), 'thumbnail') ?: wc_placeholder_img_src();
                ?>
                <div class="duendes-mini-opcion" data-id="<?php echo $mini->get_id(); ?>">
                    <img src="<?php echo esc_url($img); ?>" alt="<?php echo esc_attr($mini->get_name()); ?>">
                    <span><?php echo esc_html($mini->get_name()); ?></span>
                </div>
                <?php endforeach; ?>
            </div>

            <button class="duendes-promo-btn" id="duendes-btn-agregar">
                Agregar mi regalo
            </button>

            <p class="duendes-promo-nota">
                Promo 3x2: Por cada 2 guardianes, un mini de regalo
                <?php if ($minis_totales > 1): ?> • Te corresponden <?php echo $minis_totales; ?> minis<?php endif; ?>
            </p>
        </div>

        <script>
        (function() {
            var elegido = null;
            var opciones = document.querySelectorAll('.duendes-mini-opcion');
            var btn = document.getElementById('duendes-btn-agregar');

            opciones.forEach(function(op) {
                op.addEventListener('click', function() {
                    opciones.forEach(function(o) { o.classList.remove('elegido'); });
                    this.classList.add('elegido');
                    elegido = this.getAttribute('data-id');
                    btn.classList.add('activo');
                });
            });

            btn.addEventListener('click', function() {
                if (!elegido || !btn.classList.contains('activo')) return;
                btn.textContent = 'Agregando...';
                btn.classList.remove('activo');

                fetch('<?php echo admin_url('admin-ajax.php'); ?>', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: 'action=duendes_agregar_mini_gratis&product_id=' + elegido + '&nonce=<?php echo wp_create_nonce('duendes_mini_gratis'); ?>'
                })
                .then(function(r) { return r.json(); })
                .then(function(data) {
                    if (data.success) {
                        location.reload();
                    } else {
                        alert(data.data || 'Error');
                        btn.textContent = 'Agregar mi regalo';
                        btn.classList.add('activo');
                    }
                });
            });
        })();
        </script>
    </div>
    <?php
}

// ═══════════════════════════════════════════════════════════════════════════
// AJAX: AGREGAR MINI GRATIS
// ═══════════════════════════════════════════════════════════════════════════

add_action('wp_ajax_duendes_agregar_mini_gratis', 'duendes_ajax_agregar_mini_gratis');
add_action('wp_ajax_nopriv_duendes_agregar_mini_gratis', 'duendes_ajax_agregar_mini_gratis');

function duendes_ajax_agregar_mini_gratis() {
    if (!wp_verify_nonce($_POST['nonce'] ?? '', 'duendes_mini_gratis')) {
        wp_send_json_error('Sesión expirada');
    }

    $product_id = intval($_POST['product_id'] ?? 0);
    if (!$product_id) wp_send_json_error('Producto inválido');

    $guardianes = duendes_contar_guardianes_carrito();
    $merecidos = floor($guardianes / DUENDES_PROMO_GUARDIANES_REQUERIDOS);
    $actuales = duendes_contar_minis_gratis_en_carrito();

    if ($guardianes < DUENDES_PROMO_GUARDIANES_REQUERIDOS) {
        wp_send_json_error('Necesitás 2 guardianes');
    }
    if ($actuales >= $merecidos) {
        wp_send_json_error('Ya tenés todos tus regalos');
    }
    if (!has_term(DUENDES_PROMO_CATEGORIA_MINI, 'product_cat', $product_id)) {
        wp_send_json_error('Producto no válido');
    }

    $key = WC()->cart->add_to_cart($product_id, 1, 0, [], [
        'duendes_mini_gratis' => true,
        'duendes_promo_3x2' => true,
    ]);

    if ($key) {
        wp_send_json_success();
    } else {
        wp_send_json_error('Error al agregar');
    }
}

// ═══════════════════════════════════════════════════════════════════════════
// PRECIO 0 Y DISPLAY
// ═══════════════════════════════════════════════════════════════════════════

add_action('woocommerce_before_calculate_totals', function($cart) {
    if (is_admin() && !defined('DOING_AJAX')) return;
    if (did_action('woocommerce_before_calculate_totals') >= 2) return;

    foreach ($cart->get_cart() as $item) {
        if (!empty($item['duendes_mini_gratis'])) {
            $item['data']->set_price(0);
        }
    }
}, 99);

add_filter('woocommerce_cart_item_name', function($name, $item, $key) {
    if (!empty($item['duendes_mini_gratis'])) {
        $name .= ' <span style="background:linear-gradient(135deg,#C6A962,#a88a42);color:#0d0d14;padding:3px 12px;border-radius:12px;font-size:11px;font-weight:600;margin-left:10px;">REGALO</span>';
    }
    return $name;
}, 10, 3);

add_filter('woocommerce_cart_item_price', function($price, $item, $key) {
    if (!empty($item['duendes_mini_gratis'])) {
        return '<span style="color:#C6A962;font-weight:600;">¡Gratis!</span>';
    }
    return $price;
}, 10, 3);

add_filter('woocommerce_cart_item_quantity', function($qty, $key, $item) {
    if (!empty($item['duendes_mini_gratis'])) {
        return '<span style="color:#C6A962;">1</span>';
    }
    return $qty;
}, 10, 3);

// ═══════════════════════════════════════════════════════════════════════════
// VALIDACIÓN AL ACTUALIZAR CARRITO
// ═══════════════════════════════════════════════════════════════════════════

add_action('woocommerce_cart_updated', function() {
    if (!WC()->cart) return;

    $guardianes = duendes_contar_guardianes_carrito();
    $merecidos = floor($guardianes / DUENDES_PROMO_GUARDIANES_REQUERIDOS);
    $actuales = duendes_contar_minis_gratis_en_carrito();

    if ($actuales > $merecidos) {
        $remover = $actuales - $merecidos;
        $removidos = 0;

        foreach (WC()->cart->get_cart() as $key => $item) {
            if ($removidos >= $remover) break;
            if (!empty($item['duendes_mini_gratis'])) {
                WC()->cart->remove_cart_item($key);
                $removidos++;
            }
        }
    }
});

// ═══════════════════════════════════════════════════════════════════════════
// GUARDAR EN ORDEN
// ═══════════════════════════════════════════════════════════════════════════

add_action('woocommerce_checkout_create_order_line_item', function($item, $key, $values, $order) {
    if (!empty($values['duendes_mini_gratis'])) {
        $item->add_meta_data('_duendes_mini_gratis', 'yes', true);
        $item->add_meta_data('Regalo Promo 3x2', 'Sí', true);
    }
}, 10, 4);
