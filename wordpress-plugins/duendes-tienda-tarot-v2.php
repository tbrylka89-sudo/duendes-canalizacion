<?php
/**
 * Plugin Name: Duendes Tienda Tarot v2
 * Description: Tienda con cards estilo cartas de tarot - IMAGEN VISIBLE + PRECIO AFUERA
 * Version: 2.1
 */

if (!defined('ABSPATH')) exit;

// Interceptar la tienda
add_action('template_redirect', function() {
    if (is_shop() || is_product_category()) {
        duendes_render_tienda_tarot_v2();
        exit;
    }
});

function duendes_render_tienda_tarot_v2() {
    $categoria_actual = null;
    $titulo = 'Encontrá al que ya te eligió';
    $subtitulo = 'Cada uno nació para alguien. Uno de ellos, para vos.';

    if (is_product_category()) {
        $categoria_actual = get_queried_object();
        $titulo = $categoria_actual->name;
        $subtitulo = $categoria_actual->description ?: 'Guardianes de ' . $categoria_actual->name;
    }

    // Obtener productos - SOLO con imagen, orden mezclado
    $args = [
        'post_type' => 'product',
        'posts_per_page' => -1,
        'post_status' => 'publish',
        'orderby' => 'rand', // Orden aleatorio para variedad
        'meta_query' => [
            [
                'key' => '_thumbnail_id', // Solo productos CON imagen
                'compare' => 'EXISTS'
            ]
        ]
    ];

    if ($categoria_actual) {
        $args['tax_query'] = [[
            'taxonomy' => 'product_cat',
            'field' => 'term_id',
            'terms' => $categoria_actual->term_id
        ]];
    }

    $products = new WP_Query($args);

    // Categorias principales
    $categorias = [
        ['slug' => 'proteccion', 'nombre' => 'Protección', 'desc' => 'Algo te drena', 'color' => '#3b82f6', 'icono' => '🛡️'],
        ['slug' => 'amor', 'nombre' => 'Amor', 'desc' => 'El corazón pide', 'color' => '#ec4899', 'icono' => '💜'],
        ['slug' => 'dinero-abundancia-negocios', 'nombre' => 'Abundancia', 'desc' => 'No alcanza', 'color' => '#f59e0b', 'icono' => '✨'],
        ['slug' => 'salud', 'nombre' => 'Sanación', 'desc' => 'Necesitás sanar', 'color' => '#22c55e', 'icono' => '🌿'],
        ['slug' => 'sabiduria-guia-claridad', 'nombre' => 'Sabiduría', 'desc' => 'Buscás respuestas', 'color' => '#8b5cf6', 'icono' => '🔮'],
    ];

    get_header();
    ?>
    <style>
        /* Reset */
        .site-content, .content-area, main, #main, #primary {
            background: #FAF8F5 !important;
            padding: 0 !important;
            margin: 0 !important;
            max-width: 100% !important;
        }

        .woocommerce-breadcrumb,
        .woocommerce-products-header,
        .page-title,
        .archive-title {
            display: none !important;
        }

        /* Hero Section */
        .tienda-hero {
            background: linear-gradient(180deg, #0a0a0a 0%, #1a1510 100%);
            padding: 80px 40px;
            text-align: center;
            position: relative;
            overflow: hidden;
        }

        .hero-bg {
            position: absolute;
            inset: 0;
            background: radial-gradient(ellipse at center, rgba(198,169,98,0.15) 0%, transparent 70%);
            pointer-events: none;
        }

        .hero-pattern {
            position: absolute;
            inset: 0;
            opacity: 0.03;
            background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0L60 30L30 60L0 30L30 0z' fill='%23C6A962' fill-opacity='1'/%3E%3C/svg%3E");
            background-size: 30px 30px;
        }

        .tienda-hero h1 {
            font-family: 'Cinzel', serif;
            font-size: clamp(32px, 6vw, 56px);
            color: #C6A962;
            font-weight: 400;
            letter-spacing: 6px;
            text-transform: uppercase;
            margin: 0 0 15px 0;
            position: relative;
            text-shadow: 0 0 40px rgba(198,169,98,0.3);
        }

        .tienda-hero p {
            font-family: 'Cormorant Garamond', serif;
            font-size: 18px;
            color: rgba(255,255,255,0.6);
            font-style: italic;
            margin: 0 0 40px 0;
            position: relative;
        }

        /* Categorias */
        .cat-nav {
            display: flex;
            justify-content: center;
            gap: 20px;
            flex-wrap: wrap;
            position: relative;
            padding: 20px 0;
        }

        .cat-card {
            position: relative;
            width: 140px;
            height: 180px;
            perspective: 1000px;
        }

        .cat-card-inner {
            position: relative;
            width: 100%;
            height: 100%;
            background: linear-gradient(145deg, rgba(20,20,20,0.95) 0%, rgba(10,10,10,0.98) 100%);
            border: 1px solid rgba(198,169,98,0.3);
            border-radius: 12px;
            text-decoration: none;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            overflow: hidden;
            transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
            box-shadow: 0 10px 30px rgba(0,0,0,0.4);
        }

        .cat-card:hover .cat-card-inner {
            transform: translateY(-10px) scale(1.05);
            border-color: var(--cat-color, #C6A962);
            box-shadow: 0 25px 50px rgba(0,0,0,0.5), 0 0 40px var(--cat-glow, rgba(198,169,98,0.2));
        }

        .cat-card.active .cat-card-inner {
            border-color: var(--cat-color, #C6A962);
            box-shadow: 0 0 30px var(--cat-glow, rgba(198,169,98,0.3));
        }

        .cat-icon-container {
            position: relative;
            width: 70px;
            height: 70px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 12px;
        }

        .cat-icon-main {
            font-size: 40px;
            position: relative;
            z-index: 2;
            transition: transform 0.4s;
            filter: drop-shadow(0 0 10px var(--cat-glow, rgba(198,169,98,0.5)));
        }

        .cat-card:hover .cat-icon-main {
            transform: scale(1.2);
            animation: iconPulse 1s ease-in-out infinite;
        }

        @keyframes iconPulse {
            0%, 100% { transform: scale(1.2); }
            50% { transform: scale(1.3); }
        }

        .cat-particles {
            position: absolute;
            inset: 0;
            overflow: hidden;
            pointer-events: none;
            opacity: 0;
            transition: opacity 0.3s;
        }

        .cat-card:hover .cat-particles {
            opacity: 1;
        }

        .particle {
            position: absolute;
            font-size: 12px;
            opacity: 0;
            animation: floatParticle 3s ease-in-out infinite;
        }

        @keyframes floatParticle {
            0% { opacity: 0; transform: translateY(100%) scale(0.5); }
            20% { opacity: 1; }
            80% { opacity: 1; }
            100% { opacity: 0; transform: translateY(-100%) scale(0.8) rotate(20deg); }
        }

        .cat-ring {
            position: absolute;
            width: 90px;
            height: 90px;
            border: 1px solid var(--cat-color, rgba(198,169,98,0.3));
            border-radius: 50%;
            opacity: 0;
            transition: all 0.4s;
        }

        .cat-card:hover .cat-ring {
            opacity: 1;
            animation: ringExpand 1.5s ease-out infinite;
        }

        @keyframes ringExpand {
            0% { transform: scale(0.8); opacity: 0.8; }
            100% { transform: scale(1.5); opacity: 0; }
        }

        .cat-name {
            font-family: 'Cinzel', serif;
            font-size: 13px;
            color: #fff;
            letter-spacing: 1px;
            text-transform: uppercase;
            transition: color 0.3s;
        }

        .cat-card:hover .cat-name {
            color: var(--cat-color, #C6A962);
        }

        .cat-count {
            font-family: 'Cormorant Garamond', serif;
            font-size: 11px;
            color: rgba(255,255,255,0.4);
            margin-top: 5px;
        }

        /* Colores por categoria */
        .cat-card[data-cat="proteccion"] { --cat-color: #3b82f6; --cat-glow: rgba(59, 130, 246, 0.4); }
        .cat-card[data-cat="amor"] { --cat-color: #ec4899; --cat-glow: rgba(236, 72, 153, 0.4); }
        .cat-card[data-cat="abundancia"] { --cat-color: #f59e0b; --cat-glow: rgba(245, 158, 11, 0.4); }
        .cat-card[data-cat="salud"] { --cat-color: #22c55e; --cat-glow: rgba(34, 197, 94, 0.4); }
        .cat-card[data-cat="sabiduria"] { --cat-color: #8b5cf6; --cat-glow: rgba(139, 92, 246, 0.4); }

        .cat-bg-glow {
            position: absolute;
            inset: -50%;
            background: radial-gradient(circle, var(--cat-glow, rgba(198,169,98,0.1)) 0%, transparent 70%);
            opacity: 0;
            transition: opacity 0.4s;
        }

        .cat-card:hover .cat-bg-glow {
            opacity: 1;
        }

        .cat-frame {
            position: absolute;
            inset: 4px;
            border: 1px solid rgba(198,169,98,0.15);
            border-radius: 10px;
            pointer-events: none;
        }

        .cat-corner {
            position: absolute;
            width: 15px;
            height: 15px;
            border: 2px solid var(--cat-color, #C6A962);
            opacity: 0.5;
            transition: opacity 0.3s;
        }
        .cat-corner.tl { top: 8px; left: 8px; border-right: none; border-bottom: none; border-radius: 4px 0 0 0; }
        .cat-corner.tr { top: 8px; right: 8px; border-left: none; border-bottom: none; border-radius: 0 4px 0 0; }
        .cat-corner.bl { bottom: 8px; left: 8px; border-right: none; border-top: none; border-radius: 0 0 0 4px; }
        .cat-corner.br { bottom: 8px; right: 8px; border-left: none; border-top: none; border-radius: 0 0 4px 0; }

        .cat-card:hover .cat-corner { opacity: 1; }

        /* Responsive categorias */
        @media (max-width: 768px) {
            .cat-nav { gap: 12px; }
            .cat-card { width: 100px; height: 130px; }
            .cat-icon-main { font-size: 28px; }
            .cat-icon-container { width: 50px; height: 50px; margin-bottom: 8px; }
            .cat-name { font-size: 10px; }
            .cat-count { font-size: 9px; }
        }

        /* Contenedor de productos */
        .productos-container {
            background: #FAF8F5;
            padding: 60px 40px 100px;
        }

        /* Grid de productos */
        .productos-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
            gap: 35px;
            max-width: 1500px;
            margin: 0 auto;
        }

        /* ═══════════════════════════════════════════════════════════════════
           NUEVO: Card wrapper que incluye la card + precio afuera
           ═══════════════════════════════════════════════════════════════════ */
        .producto-wrapper {
            display: flex;
            flex-direction: column;
            gap: 12px;
        }

        /* Card estilo tarot - SOLO la imagen y nombre */
        .tarot-card {
            position: relative;
            aspect-ratio: 3/4; /* Más cuadrada para mostrar más imagen */
            cursor: pointer;
        }

        .tarot-inner {
            position: relative;
            width: 100%;
            height: 100%;
            background: linear-gradient(145deg, #1a1a1a 0%, #0d0d0d 100%);
            border-radius: 16px;
            overflow: hidden;
            transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
            text-decoration: none;
            display: block;
            box-shadow: 0 15px 40px rgba(0,0,0,0.3);
            border: 2px solid rgba(198,169,98,0.5); /* Borde dorado visible */
        }

        .tarot-card:hover .tarot-inner {
            transform: translateY(-12px) scale(1.02);
            box-shadow: 0 40px 70px rgba(0,0,0,0.4), 0 0 50px rgba(198,169,98,0.15);
        }

        /* Marco decorativo */
        .tarot-frame {
            position: absolute;
            inset: 6px;
            border: 1px solid rgba(198,169,98,0.4);
            border-radius: 12px;
            pointer-events: none;
            z-index: 2;
        }

        .tarot-frame::before {
            content: '';
            position: absolute;
            inset: 5px;
            border: 1px solid rgba(198,169,98,0.2);
            border-radius: 9px;
        }

        /* Esquinas decorativas */
        .tarot-corner {
            position: absolute;
            width: 25px;
            height: 25px;
            border: 2px solid var(--card-color, #C6A962);
            z-index: 3;
            transition: all 0.3s ease;
        }
        .tarot-corner.tl { top: 12px; left: 12px; border-right: none; border-bottom: none; border-radius: 6px 0 0 0; }
        .tarot-corner.tr { top: 12px; right: 12px; border-left: none; border-bottom: none; border-radius: 0 6px 0 0; }
        .tarot-corner.bl { bottom: 12px; left: 12px; border-right: none; border-top: none; border-radius: 0 0 0 6px; }
        .tarot-corner.br { bottom: 12px; right: 12px; border-left: none; border-top: none; border-radius: 0 0 6px 0; }

        /* Colores por categoria */
        .tarot-card[data-cat="proteccion"] { --card-color: #3b82f6; --card-glow: rgba(59, 130, 246, 0.3); }
        .tarot-card[data-cat="amor"] { --card-color: #ec4899; --card-glow: rgba(236, 72, 153, 0.3); }
        .tarot-card[data-cat="abundancia"] { --card-color: #f59e0b; --card-glow: rgba(245, 158, 11, 0.3); }
        .tarot-card[data-cat="salud"] { --card-color: #22c55e; --card-glow: rgba(34, 197, 94, 0.3); }
        .tarot-card[data-cat="sabiduria"] { --card-color: #8b5cf6; --card-glow: rgba(139, 92, 246, 0.3); }

        .tarot-card:hover .tarot-corner {
            box-shadow: 0 0 10px var(--card-glow, rgba(198,169,98,0.3));
        }

        .tarot-card[data-cat] .tarot-frame {
            border-color: rgba(198,169,98,0.2);
        }
        .tarot-card[data-cat]:hover .tarot-frame {
            border-color: var(--card-color, #C6A962);
        }

        /* Badge categoria */
        .tarot-badge {
            position: absolute;
            top: 20px;
            right: 20px;
            width: 36px;
            height: 36px;
            background: rgba(0,0,0,0.7);
            border: 1px solid rgba(198,169,98,0.4);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 16px;
            z-index: 5;
            backdrop-filter: blur(10px);
        }

        /* Imagen - AHORA OCUPA CASI TODO */
        .tarot-image {
            position: absolute;
            inset: 20px;
            bottom: 70px; /* Solo deja espacio para el nombre */
            border-radius: 10px;
            overflow: hidden;
        }

        .tarot-image img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform 0.6s;
        }

        .tarot-card:hover .tarot-image img {
            transform: scale(1.06);
        }

        .tarot-image::after {
            content: '';
            position: absolute;
            inset: 0;
            background: linear-gradient(180deg, transparent 70%, rgba(0,0,0,0.5) 100%);
            pointer-events: none;
        }

        /* Sin imagen - más visible */
        .tarot-no-image {
            position: absolute;
            inset: 20px;
            bottom: 70px;
            background: linear-gradient(145deg, #2a2520 0%, #1a1510 100%);
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: column;
            gap: 10px;
            border: 1px dashed rgba(198,169,98,0.4);
        }

        .tarot-no-image svg {
            width: 60px;
            height: 60px;
            fill: rgba(198,169,98,0.4);
        }

        .tarot-no-image::after {
            content: 'Imagen próximamente';
            font-family: 'Cormorant Garamond', serif;
            font-size: 12px;
            color: rgba(198,169,98,0.5);
            font-style: italic;
        }

        /* Info MINIMA dentro de la card - solo nombre */
        .tarot-info {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            padding: 15px 20px;
            text-align: center;
            z-index: 2;
            background: linear-gradient(0deg, rgba(0,0,0,0.8) 0%, transparent 100%);
        }

        .tarot-name {
            font-family: 'Cinzel', serif;
            font-size: 14px;
            color: #fff;
            letter-spacing: 1px;
            line-height: 1.3;
        }

        .tarot-tipo {
            font-family: 'Cinzel', serif;
            font-size: 9px;
            color: rgba(255,255,255,0.5);
            text-transform: uppercase;
            letter-spacing: 2px;
            margin-bottom: 4px;
        }

        /* Efecto glow */
        .tarot-glow {
            position: absolute;
            inset: 0;
            background: linear-gradient(135deg, rgba(198,169,98,0.1) 0%, transparent 50%, rgba(198,169,98,0.05) 100%);
            opacity: 0;
            transition: opacity 0.4s;
            pointer-events: none;
            border-radius: 16px;
        }

        .tarot-card:hover .tarot-glow {
            opacity: 1;
        }

        /* ═══════════════════════════════════════════════════════════════════
           PRECIO AFUERA DE LA CARD
           ═══════════════════════════════════════════════════════════════════ */
        .producto-precio {
            text-align: center;
            padding: 10px 0;
        }

        .precio-principal {
            font-family: 'Cinzel', serif;
            font-size: 18px;
            color: #1a1510;
            font-weight: 600;
            display: block;
        }

        .precio-secundario {
            font-family: 'Cormorant Garamond', serif;
            font-size: 13px;
            color: rgba(26,21,16,0.6);
            display: block;
            margin-top: 2px;
        }

        /* Footer tienda */
        .tienda-footer-section {
            background: #0a0a0a;
            text-align: center;
            padding: 50px 40px;
            border-top: 1px solid rgba(198,169,98,0.1);
        }

        .tienda-footer-section p {
            font-family: 'Cormorant Garamond', serif;
            color: rgba(255,255,255,0.4);
            font-size: 14px;
            margin: 0;
        }

        /* ═══════════════════════════════════════════════════════════════════
           RESPONSIVE MOBILE - IMAGEN GRANDE + PRECIO AFUERA
           ═══════════════════════════════════════════════════════════════════ */
        @media (max-width: 768px) {
            .tienda-hero {
                padding: 50px 20px;
            }
            .tienda-hero h1 {
                letter-spacing: 3px;
            }
            .tienda-hero p {
                font-size: 15px;
                margin-bottom: 25px;
            }

            .productos-container {
                padding: 40px 12px 150px;
                background: linear-gradient(180deg, #FAF8F5 0%, #FDF9F3 30%, #F8F3EB 60%, #FAF8F5 100%);
                position: relative;
            }

            .productos-container::before {
                content: '';
                position: absolute;
                inset: 0;
                background: radial-gradient(ellipse at 30% 20%, rgba(198,169,98,0.08) 0%, transparent 50%),
                            radial-gradient(ellipse at 70% 80%, rgba(198,169,98,0.05) 0%, transparent 40%);
                pointer-events: none;
            }

            .productos-grid {
                grid-template-columns: repeat(2, 1fr);
                gap: 16px;
                position: relative;
                z-index: 1;
            }

            .producto-wrapper {
                gap: 8px;
            }

            /* Card más cuadrada para más imagen visible */
            .tarot-card {
                aspect-ratio: 4/5; /* Más cuadrada = más imagen */
            }

            .tarot-inner {
                border-radius: 14px;
                box-shadow: 0 8px 25px rgba(0,0,0,0.3);
                border: 2px solid rgba(198,169,98,0.6); /* Borde más visible en móvil */
            }

            /* Glow neon activo sin hover */
            .tarot-card[data-cat] .tarot-inner {
                box-shadow: 0 8px 25px rgba(0,0,0,0.25), 0 0 20px -5px var(--card-glow, rgba(198,169,98,0.3));
            }

            .tarot-corner {
                width: 16px;
                height: 16px;
                opacity: 0.6;
            }
            .tarot-corner.tl { top: 8px; left: 8px; }
            .tarot-corner.tr { top: 8px; right: 8px; }
            .tarot-corner.bl { bottom: 8px; left: 8px; }
            .tarot-corner.br { bottom: 8px; right: 8px; }

            .tarot-badge {
                width: 28px;
                height: 28px;
                font-size: 12px;
                top: 12px;
                right: 12px;
            }

            /* IMAGEN CASI COMPLETA - solo 50px abajo para nombre */
            .tarot-image {
                inset: 12px;
                bottom: 50px;
                border-radius: 8px;
            }

            .tarot-no-image {
                inset: 12px;
                bottom: 50px;
            }

            /* Info minimalista */
            .tarot-info {
                padding: 10px 12px;
            }

            .tarot-tipo {
                font-size: 7px;
                letter-spacing: 1.5px;
                margin-bottom: 2px;
            }

            .tarot-name {
                font-size: 11px;
            }

            /* PRECIO AFUERA - destacado */
            .producto-precio {
                padding: 8px 0;
                background: linear-gradient(90deg, transparent, rgba(198,169,98,0.1), transparent);
                border-radius: 8px;
            }

            .precio-principal {
                font-size: 15px;
                color: #c9a227;
            }

            .precio-secundario {
                font-size: 11px;
            }

            /* Animacion respiracion */
            @keyframes cardBreath {
                0%, 100% { box-shadow: 0 8px 25px rgba(0,0,0,0.25), 0 0 20px -5px var(--card-glow, rgba(198,169,98,0.3)); }
                50% { box-shadow: 0 10px 30px rgba(0,0,0,0.25), 0 0 25px -3px var(--card-glow, rgba(198,169,98,0.4)); }
            }

            .tarot-card[data-cat] .tarot-inner {
                animation: cardBreath 4s ease-in-out infinite;
                animation-delay: calc(var(--card-index, 0) * 0.3s);
            }

            /* Touch feedback */
            .tarot-card:active .tarot-inner {
                transform: scale(0.98);
            }

            /* Colores neon mas intensos */
            .tarot-card[data-cat="proteccion"] { --card-glow: rgba(59, 130, 246, 0.5); }
            .tarot-card[data-cat="amor"] { --card-glow: rgba(236, 72, 153, 0.5); }
            .tarot-card[data-cat="abundancia"] { --card-glow: rgba(245, 158, 11, 0.5); }
            .tarot-card[data-cat="salud"] { --card-glow: rgba(34, 197, 94, 0.5); }
            .tarot-card[data-cat="sabiduria"] { --card-glow: rgba(139, 92, 246, 0.5); }
        }

        /* Extra pequeño */
        @media (max-width: 380px) {
            .productos-grid {
                gap: 12px;
            }
            .tarot-name {
                font-size: 10px;
            }
            .precio-principal {
                font-size: 14px;
            }
        }

        /* Notificacion carrito */
        .cart-notification {
            position: fixed;
            bottom: 30px;
            right: 30px;
            background: linear-gradient(135deg, #1a1a1a, #0d0d0d);
            border: 1px solid #C6A962;
            border-radius: 12px;
            padding: 20px 25px;
            color: #fff;
            font-family: 'Cinzel', serif;
            z-index: 9999;
            opacity: 0;
            transform: translateY(20px);
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            box-shadow: 0 20px 50px rgba(0,0,0,0.5);
        }
        .cart-notification.show {
            opacity: 1;
            transform: translateY(0);
        }
    </style>

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400&display=swap" rel="stylesheet">

    <!-- Hero Section -->
    <section class="tienda-hero">
        <div class="hero-bg"></div>
        <div class="hero-pattern"></div>
        <h1><?php echo esc_html($titulo); ?></h1>
        <p><?php echo esc_html($subtitulo); ?></p>

        <div class="cat-nav">
            <?php
            $particulas = [
                'proteccion' => ['🛡️', '⚔️', '🔒', '🏰'],
                'amor' => ['💜', '💗', '💕', '💝'],
                'abundancia' => ['🪙', '💰', '✨', '⭐'],
                'salud' => ['🌿', '🍀', '🌱', '🌸'],
                'sabiduria' => ['🔮', '📿', '🌙', '⭐']
            ];

            foreach ($categorias as $cat):
                $term = get_term_by('slug', $cat['slug'], 'product_cat');
                $count = $term ? $term->count : 0;
                $link = $term ? get_term_link($term) : '#';
                $is_active = $categoria_actual && $categoria_actual->slug === $cat['slug'];

                $cat_key = 'proteccion';
                if (strpos($cat['slug'], 'amor') !== false) $cat_key = 'amor';
                elseif (strpos($cat['slug'], 'dinero') !== false || strpos($cat['slug'], 'abundan') !== false) $cat_key = 'abundancia';
                elseif (strpos($cat['slug'], 'salud') !== false) $cat_key = 'salud';
                elseif (strpos($cat['slug'], 'sabid') !== false) $cat_key = 'sabiduria';

                $parts = $particulas[$cat_key];
            ?>
            <div class="cat-card <?php echo $is_active ? 'active' : ''; ?>" data-cat="<?php echo $cat_key; ?>">
                <a href="<?php echo esc_url($link); ?>" class="cat-card-inner">
                    <div class="cat-bg-glow"></div>
                    <div class="cat-frame"></div>
                    <div class="cat-corner tl"></div>
                    <div class="cat-corner tr"></div>
                    <div class="cat-corner bl"></div>
                    <div class="cat-corner br"></div>
                    <div class="cat-particles">
                        <?php foreach ($parts as $i => $p): ?>
                        <span class="particle" style="left: <?php echo 15 + ($i * 20); ?>%; animation-delay: <?php echo $i * 0.5; ?>s;"><?php echo $p; ?></span>
                        <?php endforeach; ?>
                    </div>
                    <div class="cat-icon-container">
                        <div class="cat-ring"></div>
                        <span class="cat-icon-main"><?php echo $cat['icono']; ?></span>
                    </div>
                    <span class="cat-name"><?php echo $cat['nombre']; ?></span>
                    <span class="cat-count"><?php echo isset($cat['desc']) ? $cat['desc'] : $count . ' guardianes'; ?></span>
                </a>
            </div>
            <?php endforeach; ?>
        </div>
    </section>

    <!-- Productos -->
    <section class="productos-container">
        <div class="productos-grid">
            <?php
            $card_index = 0;
            while ($products->have_posts()): $products->the_post();
                global $product;

                // Obtener precios DIRECTAMENTE del meta (sin filtros de conversion)
                $product_id = get_the_ID();
                $precio_raw = floatval(get_post_meta($product_id, '_price', true));
                if ($precio_raw <= 0) {
                    $precio_raw = floatval(get_post_meta($product_id, '_regular_price', true));
                }
                // Si el precio es muy alto, probablemente esta guardado en UYU por error
                if ($precio_raw > 1500) {
                    $precio_raw = round($precio_raw / 43);
                }

                // Normalizar USD y obtener UYU fijo
                $rangos = [
                    [0, 100, 70, 2500],
                    [100, 175, 150, 5500],
                    [175, 350, 200, 8000],
                    [350, 800, 450, 16500],
                    [800, 99999, 1050, 39800],
                ];
                $precio_usd = 70;
                $precio_uyu = 2500;
                foreach ($rangos as $r) {
                    if ($precio_raw >= $r[0] && $precio_raw < $r[1]) {
                        $precio_usd = $r[2];
                        $precio_uyu = $r[3];
                        break;
                    }
                }

                $img_url = get_the_post_thumbnail_url(get_the_ID(), 'large');
                $cats = wp_get_post_terms(get_the_ID(), 'product_cat');
                $cat_principal = !empty($cats) ? $cats[0] : null;

                $icono = '✨';
                $cat_key = '';
                if ($cat_principal) {
                    $cat_slug = $cat_principal->slug;
                    if (strpos($cat_slug, 'protec') !== false) { $icono = '🛡️'; $cat_key = 'proteccion'; }
                    elseif (strpos($cat_slug, 'amor') !== false) { $icono = '💜'; $cat_key = 'amor'; }
                    elseif (strpos($cat_slug, 'dinero') !== false || strpos($cat_slug, 'abundan') !== false) { $icono = '✨'; $cat_key = 'abundancia'; }
                    elseif (strpos($cat_slug, 'salud') !== false || strpos($cat_slug, 'sana') !== false) { $icono = '🌿'; $cat_key = 'salud'; }
                    elseif (strpos($cat_slug, 'sabid') !== false) { $icono = '🔮'; $cat_key = 'sabiduria'; }
                }

                $tipo = get_post_meta(get_the_ID(), '_guardian_tipo', true) ?: get_post_meta(get_the_ID(), '_duendes_tipo', true) ?: 'Guardián';
                $nombre = get_the_title();
            ?>
            <div class="producto-wrapper">
                <article class="tarot-card" data-product-id="<?php echo get_the_ID(); ?>" data-cat="<?php echo esc_attr($cat_key); ?>" style="--card-index: <?php echo $card_index; ?>">
                    <a href="<?php the_permalink(); ?>" class="tarot-inner">
                        <div class="tarot-frame"></div>
                        <div class="tarot-corner tl"></div>
                        <div class="tarot-corner tr"></div>
                        <div class="tarot-corner bl"></div>
                        <div class="tarot-corner br"></div>
                        <div class="tarot-badge"><?php echo $icono; ?></div>

                        <?php if ($img_url): ?>
                        <div class="tarot-image">
                            <img src="<?php echo esc_url($img_url); ?>" alt="<?php the_title_attribute(); ?>" loading="lazy">
                        </div>
                        <?php else: ?>
                        <div class="tarot-no-image">
                            <svg viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
                        </div>
                        <?php endif; ?>

                        <div class="tarot-info">
                            <div class="tarot-tipo"><?php echo esc_html($tipo); ?></div>
                            <h3 class="tarot-name"><?php echo esc_html($nombre); ?></h3>
                        </div>

                        <div class="tarot-glow"></div>
                    </a>
                </article>

                <!-- PRECIO AFUERA DE LA CARD -->
                <div class="producto-precio" data-precio-usd="<?php echo $precio_usd; ?>" data-precio-uyu="<?php echo $precio_uyu; ?>">
                    <span class="precio-principal">$<?php echo number_format($precio_usd, 0); ?> USD</span>
                </div>
            </div>
            <?php
                $card_index++;
            endwhile; wp_reset_postdata(); ?>
        </div>
    </section>

    <!-- Footer section -->
    <section class="tienda-footer-section">
        <p>Duendes del Uruguay · Nacidos en Piriápolis · Destinados a encontrarte</p>
    </section>

    <!-- Notificacion carrito -->
    <div class="cart-notification" id="cart-notification">
        <span>✨</span>
        <span>Guardián agregado al carrito</span>
    </div>

    <script>
    (function() {
        // Audio Context para sonidos
        let audioCtx = null;
        function initAudio() {
            if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            return audioCtx;
        }

        function playHoverSound() {
            try {
                const ctx = initAudio();
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.frequency.setValueAtTime(800, ctx.currentTime);
                osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.1);
                osc.type = 'sine';
                gain.gain.setValueAtTime(0, ctx.currentTime);
                gain.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 0.05);
                gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.3);
                osc.start(ctx.currentTime);
                osc.stop(ctx.currentTime + 0.3);
            } catch(e) {}
        }

        function playClickSound() {
            try {
                const ctx = initAudio();
                [523, 659, 784, 1047].forEach((freq, i) => {
                    const osc = ctx.createOscillator();
                    const gain = ctx.createGain();
                    osc.connect(gain);
                    gain.connect(ctx.destination);
                    osc.frequency.setValueAtTime(freq, ctx.currentTime);
                    osc.type = 'sine';
                    const delay = i * 0.05;
                    gain.gain.setValueAtTime(0, ctx.currentTime + delay);
                    gain.gain.linearRampToValueAtTime(0.1, ctx.currentTime + delay + 0.02);
                    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + 0.8);
                    osc.start(ctx.currentTime + delay);
                    osc.stop(ctx.currentTime + delay + 0.8);
                });
            } catch(e) {}
        }

        // Event listeners
        document.querySelectorAll('.tarot-card').forEach(card => {
            let hoverTimeout;
            card.addEventListener('mouseenter', () => {
                hoverTimeout = setTimeout(() => playHoverSound(), 100);
            });
            card.addEventListener('mouseleave', () => clearTimeout(hoverTimeout));
            card.addEventListener('click', () => playClickSound());
        });

        document.querySelectorAll('.cat-card').forEach(card => {
            let hoverTimeout;
            card.addEventListener('mouseenter', () => {
                hoverTimeout = setTimeout(() => playHoverSound(), 100);
            });
            card.addEventListener('mouseleave', () => clearTimeout(hoverTimeout));
            card.addEventListener('click', () => playClickSound());
        });

        document.addEventListener('click', function initOnClick() {
            initAudio();
            document.removeEventListener('click', initOnClick);
        }, { once: true });

        // ═══════════════════════════════════════════════════════════════
        // SISTEMA DE PRECIOS GEOLOCALIZADOS
        // ═══════════════════════════════════════════════════════════════

        function getCookie(name) {
            const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
            return match ? match[2] : null;
        }

        async function actualizarPreciosGeo() {
            try {
                const pais = getCookie('duendes_pais') || 'US';

                // Si es Uruguay, mostrar solo pesos (sin paréntesis)
                if (pais === 'UY') {
                    document.querySelectorAll('.producto-precio').forEach(el => {
                        const precioUYU = parseInt(el.dataset.precioUyu) || 0;
                        el.querySelector('.precio-principal').innerHTML = `$${precioUYU.toLocaleString('es-UY')} UYU`;
                    });
                }
                // Otros países: mostrar USD (sin aproximación en shop)
                else {
                    document.querySelectorAll('.producto-precio').forEach(el => {
                        const precioUSD = parseFloat(el.dataset.precioUsd);
                        el.querySelector('.precio-principal').innerHTML = `$${precioUSD} USD`;
                    });
                }
            } catch(e) {
                console.log('Geo no disponible:', e);
            }
        }

        actualizarPreciosGeo();
    })();
    </script>

    <?php
    get_footer();
}
