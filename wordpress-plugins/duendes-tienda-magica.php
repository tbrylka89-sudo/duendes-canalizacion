<?php
/**
 * Plugin Name: Duendes Tienda Magica
 * Description: Pagina de tienda elegante
 * Version: 2.0
 */

if (!defined('ABSPATH')) exit;

// Estilos en la tienda
add_action('wp_head', function() {
    if (is_shop() || is_product_category()) {
        echo '<style>' . duendes_tienda_styles_v2() . '</style>';
    }
}, 99);

// Reemplazar el header de la tienda
add_action('woocommerce_before_shop_loop', 'duendes_tienda_header_v2', 5);

function duendes_tienda_header_v2() {
    if (!is_shop()) return;

    // Ocultar el titulo duplicado
    remove_action('woocommerce_archive_description', 'woocommerce_taxonomy_archive_description', 10);

    $categorias = [
        ['slug' => 'proteccion', 'nombre' => 'Proteccion', 'emoji' => '🛡️'],
        ['slug' => 'amor', 'nombre' => 'Amor', 'emoji' => '💜'],
        ['slug' => 'dinero-abundancia-negocios', 'nombre' => 'Abundancia', 'emoji' => '✨'],
        ['slug' => 'salud', 'nombre' => 'Sanacion', 'emoji' => '🌿'],
        ['slug' => 'sabiduria-guia-claridad', 'nombre' => 'Sabiduria', 'emoji' => '🔮'],
    ];

    echo '<div class="duendes-shop-hero">
        <div class="hero-orbs">
            <div class="orb orb-1"></div>
            <div class="orb orb-2"></div>
            <div class="orb orb-3"></div>
        </div>
        <h1>Guardianes Disponibles</h1>
        <p class="hero-sub">Piezas unicas. Cuando uno se va, desaparece para siempre.</p>
        <div class="cat-pills">';

    foreach ($categorias as $cat) {
        $term = get_term_by('slug', $cat['slug'], 'product_cat');
        $count = $term ? $term->count : 0;
        $link = $term ? get_term_link($term) : '#';
        echo '<a href="' . esc_url($link) . '" class="cat-pill">' . $cat['emoji'] . ' ' . $cat['nombre'] . ' <span>(' . $count . ')</span></a>';
    }

    echo '</div></div>';
}

function duendes_tienda_styles_v2() {
    return '
    @import url("https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400&display=swap");

    /* Ocultar header duplicado */
    .woocommerce-products-header { display: none !important; }

    /* Hero de la tienda */
    .duendes-shop-hero {
        text-align: center;
        padding: 80px 20px 60px;
        position: relative;
        overflow: hidden;
    }

    .duendes-shop-hero h1 {
        font-family: "Cinzel", serif;
        font-size: clamp(36px, 6vw, 56px);
        color: #C6A962;
        margin: 0 0 15px 0;
        font-weight: 400;
        letter-spacing: 2px;
    }

    .hero-sub {
        font-family: "Cormorant Garamond", serif;
        font-size: 20px;
        color: rgba(255,255,255,0.6);
        font-style: italic;
        margin: 0 0 40px 0;
    }

    /* Orbes flotantes */
    .hero-orbs {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        pointer-events: none;
        overflow: hidden;
    }

    .orb {
        position: absolute;
        border-radius: 50%;
        filter: blur(60px);
        opacity: 0.3;
        animation: float 8s ease-in-out infinite;
    }

    .orb-1 {
        width: 300px;
        height: 300px;
        background: #C6A962;
        top: -100px;
        left: 10%;
        animation-delay: 0s;
    }

    .orb-2 {
        width: 200px;
        height: 200px;
        background: #E879F9;
        top: 50%;
        right: 5%;
        animation-delay: -3s;
    }

    .orb-3 {
        width: 250px;
        height: 250px;
        background: #818CF8;
        bottom: -50px;
        left: 30%;
        animation-delay: -5s;
    }

    @keyframes float {
        0%, 100% { transform: translateY(0) scale(1); }
        50% { transform: translateY(-30px) scale(1.1); }
    }

    /* Pills de categorias */
    .cat-pills {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 12px;
        position: relative;
        z-index: 1;
    }

    .cat-pill {
        background: rgba(255,255,255,0.05);
        border: 1px solid rgba(198, 169, 98, 0.3);
        color: #fff;
        padding: 12px 24px;
        border-radius: 50px;
        font-family: "Cinzel", serif;
        font-size: 14px;
        text-decoration: none;
        transition: all 0.3s;
        backdrop-filter: blur(10px);
    }

    .cat-pill:hover {
        background: rgba(198, 169, 98, 0.2);
        border-color: #C6A962;
        transform: translateY(-2px);
        color: #C6A962;
    }

    .cat-pill span {
        opacity: 0.5;
        font-size: 12px;
    }

    /* Grid de productos */
    ul.products {
        display: grid !important;
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)) !important;
        gap: 30px !important;
        padding: 40px 20px !important;
        max-width: 1400px !important;
        margin: 0 auto !important;
    }

    ul.products li.product {
        background: linear-gradient(145deg, rgba(30,30,30,0.9) 0%, rgba(15,15,15,0.95) 100%) !important;
        border: 1px solid rgba(198, 169, 98, 0.1) !important;
        border-radius: 20px !important;
        overflow: hidden !important;
        transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1) !important;
        padding: 0 !important;
        position: relative !important;
        box-shadow: 0 10px 40px rgba(0,0,0,0.3) !important;
    }

    ul.products li.product:hover {
        transform: translateY(-12px) !important;
        border-color: rgba(198, 169, 98, 0.4) !important;
        box-shadow: 0 25px 60px rgba(0,0,0,0.5), 0 0 30px rgba(198, 169, 98, 0.1) !important;
    }

    ul.products li.product a.woocommerce-LoopProduct-link {
        display: block;
    }

    ul.products li.product a img {
        width: 100% !important;
        height: 300px !important;
        object-fit: cover !important;
        margin: 0 !important;
        border-radius: 0 !important;
        transition: transform 0.5s !important;
    }

    ul.products li.product:hover a img {
        transform: scale(1.05) !important;
    }

    ul.products li.product .woocommerce-loop-product__title {
        font-family: "Cinzel", serif !important;
        font-size: 20px !important;
        color: #fff !important;
        padding: 20px 20px 8px !important;
        margin: 0 !important;
        font-weight: 400 !important;
    }

    ul.products li.product .price {
        font-family: "Cormorant Garamond", serif !important;
        color: #C6A962 !important;
        font-size: 18px !important;
        padding: 0 20px 20px !important;
    }

    ul.products li.product .button,
    ul.products li.product .add_to_cart_button {
        background: transparent !important;
        color: #C6A962 !important;
        border: 1px solid rgba(198, 169, 98, 0.3) !important;
        border-radius: 0 !important;
        padding: 16px !important;
        font-family: "Cinzel", serif !important;
        font-weight: 500 !important;
        width: 100% !important;
        margin: 0 !important;
        text-transform: uppercase !important;
        font-size: 12px !important;
        letter-spacing: 2px !important;
        transition: all 0.3s !important;
        border-left: none !important;
        border-right: none !important;
        border-bottom: none !important;
    }

    ul.products li.product .button:hover,
    ul.products li.product .add_to_cart_button:hover {
        background: #C6A962 !important;
        color: #0a0a0a !important;
    }

    /* Sidebar filters */
    .woocommerce-sidebar,
    .widget-area {
        background: rgba(15,15,15,0.5) !important;
        border-radius: 16px !important;
        padding: 20px !important;
        border: 1px solid rgba(198, 169, 98, 0.1) !important;
    }

    /* Responsive */
    @media (max-width: 768px) {
        .duendes-shop-hero {
            padding: 60px 15px 40px;
        }

        .cat-pills {
            gap: 8px;
        }

        .cat-pill {
            padding: 10px 16px;
            font-size: 12px;
        }

        ul.products {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 15px !important;
            padding: 20px 15px !important;
        }

        ul.products li.product a img {
            height: 200px !important;
        }

        ul.products li.product .woocommerce-loop-product__title {
            font-size: 16px !important;
            padding: 15px 15px 5px !important;
        }
    }
    ';
}
