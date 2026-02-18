<?php
/**
 * Plugin Name: Duendes - Carrito Page
 * Description: Muestra el carrito de WooCommerce con estilo
 * Version: 1.0
 */

if (!defined('ABSPATH')) exit;

// Inyectar contenido del carrito en la página
add_action('wp_head', function() {
    if (!is_page('carrito') && !is_cart()) return;
    ?>
    <style>
    /* Ocultar contenido vacío */
    .entry-content:empty, .page-content:empty {
        display: none;
    }

    /* Estilos del carrito */
    .duendes-carrito-container {
        max-width: 1100px;
        margin: 0 auto;
        padding: 40px 20px;
        min-height: 60vh;
    }

    .duendes-carrito-titulo {
        font-family: 'Cinzel', serif;
        font-size: 32px;
        color: #c9a227;
        text-align: center;
        margin-bottom: 40px;
    }

    /* Tabla del carrito */
    .woocommerce-cart-form {
        background: #1a1a1a;
        border-radius: 12px;
        padding: 25px;
        border: 1px solid rgba(201,162,39,0.2);
    }

    .woocommerce-cart-form table {
        width: 100%;
        border-collapse: collapse;
    }

    .woocommerce-cart-form th {
        font-family: 'Cinzel', serif;
        color: #c9a227;
        text-transform: uppercase;
        font-size: 12px;
        letter-spacing: 1px;
        padding: 15px 10px;
        border-bottom: 1px solid rgba(201,162,39,0.2);
        text-align: left;
    }

    .woocommerce-cart-form td {
        padding: 20px 10px;
        border-bottom: 1px solid rgba(255,255,255,0.05);
        color: rgba(255,255,255,0.85);
        font-family: 'Cormorant Garamond', serif;
        font-size: 16px;
        vertical-align: middle;
    }

    .woocommerce-cart-form .product-thumbnail img {
        width: 80px;
        height: 80px;
        object-fit: cover;
        border-radius: 8px;
    }

    .woocommerce-cart-form .product-name a {
        color: #fff !important;
        text-decoration: none;
        font-weight: 500;
    }

    .woocommerce-cart-form .product-name a:hover {
        color: #c9a227 !important;
    }

    .woocommerce-cart-form .product-remove a {
        color: rgba(255,255,255,0.4) !important;
        font-size: 20px;
        text-decoration: none;
    }

    .woocommerce-cart-form .product-remove a:hover {
        color: #ff4444 !important;
    }

    .woocommerce-cart-form .quantity input {
        width: 60px;
        padding: 8px;
        text-align: center;
        background: rgba(255,255,255,0.05);
        border: 1px solid rgba(201,162,39,0.2);
        border-radius: 4px;
        color: #fff;
    }

    /* Botones */
    .woocommerce-cart-form .button,
    .woocommerce .button,
    .checkout-button {
        background: #000 !important;
        color: #fff !important;
        border: none !important;
        padding: 14px 28px !important;
        font-family: 'Cinzel', serif !important;
        font-size: 13px !important;
        letter-spacing: 1px !important;
        border-radius: 6px !important;
        cursor: pointer !important;
        transition: all 0.3s !important;
        text-transform: uppercase !important;
    }

    .woocommerce-cart-form .button:hover,
    .woocommerce .button:hover,
    .checkout-button:hover {
        background: #222 !important;
        transform: translateY(-1px) !important;
    }

    .checkout-button {
        background: #c9a227 !important;
        color: #000 !important;
        width: 100% !important;
        margin-top: 15px !important;
    }

    .checkout-button:hover {
        background: #d4af37 !important;
    }

    /* Totales */
    .cart_totals {
        background: #1a1a1a;
        border-radius: 12px;
        padding: 25px;
        border: 1px solid rgba(201,162,39,0.2);
        margin-top: 30px;
    }

    .cart_totals h2 {
        font-family: 'Cinzel', serif;
        color: #c9a227;
        font-size: 18px;
        margin-bottom: 20px;
    }

    .cart_totals table {
        width: 100%;
    }

    .cart_totals th, .cart_totals td {
        padding: 12px 0;
        color: rgba(255,255,255,0.85);
        font-family: 'Cormorant Garamond', serif;
        font-size: 16px;
    }

    .cart_totals .order-total th,
    .cart_totals .order-total td {
        color: #c9a227;
        font-size: 20px;
        font-weight: 600;
        border-top: 1px solid rgba(201,162,39,0.2);
        padding-top: 20px;
    }

    /* Carrito vacio */
    .cart-empty {
        text-align: center;
        padding: 60px 20px;
        color: rgba(255,255,255,0.6);
        font-family: 'Cormorant Garamond', serif;
        font-size: 18px;
    }

    .cart-empty::before {
        content: '🛒';
        display: block;
        font-size: 48px;
        margin-bottom: 20px;
        opacity: 0.5;
    }

    .return-to-shop .button {
        margin-top: 20px;
    }

    /* Cupón */
    .coupon {
        display: flex;
        gap: 10px;
        margin-top: 20px;
    }

    .coupon input {
        flex: 1;
        padding: 12px 15px;
        background: rgba(255,255,255,0.05);
        border: 1px solid rgba(201,162,39,0.2);
        border-radius: 6px;
        color: #fff;
        font-family: 'Cormorant Garamond', serif;
    }

    .coupon input::placeholder {
        color: rgba(255,255,255,0.4);
    }

    /* Responsive */
    @media (max-width: 768px) {
        .woocommerce-cart-form table,
        .woocommerce-cart-form thead,
        .woocommerce-cart-form tbody,
        .woocommerce-cart-form th,
        .woocommerce-cart-form td,
        .woocommerce-cart-form tr {
            display: block;
        }

        .woocommerce-cart-form thead {
            display: none;
        }

        .woocommerce-cart-form tr {
            margin-bottom: 20px;
            border-bottom: 1px solid rgba(201,162,39,0.1);
            padding-bottom: 20px;
        }

        .woocommerce-cart-form td {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px 0;
            border: none;
        }

        .woocommerce-cart-form td::before {
            content: attr(data-title);
            font-family: 'Cinzel', serif;
            font-size: 11px;
            color: rgba(255,255,255,0.5);
            text-transform: uppercase;
        }
    }
    </style>
    <?php
});

// Agregar contenido del carrito si la página está vacía
add_filter('the_content', function($content) {
    if (!is_page('carrito') && !is_cart()) return $content;

    // Si ya tiene contenido de WooCommerce, no hacer nada
    if (strpos($content, 'woocommerce') !== false) return $content;

    // Agregar el shortcode del carrito
    ob_start();
    ?>
    <div class="duendes-carrito-container">
        <h1 class="duendes-carrito-titulo">Tu Carrito</h1>
        <?php echo do_shortcode('[woocommerce_cart]'); ?>
    </div>
    <?php
    return ob_get_clean();
}, 999);
