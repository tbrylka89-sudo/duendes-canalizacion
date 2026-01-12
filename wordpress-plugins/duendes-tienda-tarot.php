<?php
/**
 * Plugin Name: Duendes Tienda Tarot
 * Description: Tienda con cards estilo cartas de tarot misticas con sonidos
 * Version: 2.0
 */

if (!defined('ABSPATH')) exit;

// Interceptar la tienda - pero usar el header/footer del tema
add_action('template_redirect', function() {
    if (is_shop() || is_product_category()) {
        duendes_render_tienda_tarot();
        exit;
    }
});

function duendes_render_tienda_tarot() {
    $categoria_actual = null;
    $titulo = 'Guardianes Disponibles';
    $subtitulo = 'Piezas únicas canalizadas en Piriápolis';

    if (is_product_category()) {
        $categoria_actual = get_queried_object();
        $titulo = $categoria_actual->name;
        $subtitulo = $categoria_actual->description ?: 'Guardianes de ' . $categoria_actual->name;
    }

    // Obtener productos
    $args = [
        'post_type' => 'product',
        'posts_per_page' => 50,
        'post_status' => 'publish',
        'orderby' => 'date',
        'order' => 'DESC'
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
        ['slug' => 'proteccion', 'nombre' => 'Protección', 'color' => '#3b82f6', 'icono' => '🛡️'],
        ['slug' => 'amor', 'nombre' => 'Amor', 'color' => '#ec4899', 'icono' => '💜'],
        ['slug' => 'dinero-abundancia-negocios', 'nombre' => 'Abundancia', 'color' => '#f59e0b', 'icono' => '✨'],
        ['slug' => 'salud', 'nombre' => 'Sanación', 'color' => '#22c55e', 'icono' => '🌿'],
        ['slug' => 'sabiduria-guia-claridad', 'nombre' => 'Sabiduría', 'color' => '#8b5cf6', 'icono' => '🔮'],
    ];

    // Obtener header del tema
    get_header();
    ?>
    <style>
        /* Reset para esta pagina */
        .site-content, .content-area, main, #main, #primary {
            background: #FAF8F5 !important;
            padding: 0 !important;
            margin: 0 !important;
            max-width: 100% !important;
        }

        /* Ocultar breadcrumbs y titulos del tema */
        .woocommerce-breadcrumb,
        .woocommerce-products-header,
        .page-title,
        .archive-title {
            display: none !important;
        }

        /* Hero Section - fondo oscuro */
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

        /* Categorias con animaciones */
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
            box-shadow:
                0 25px 50px rgba(0,0,0,0.5),
                0 0 40px var(--cat-glow, rgba(198,169,98,0.2));
        }

        .cat-card.active .cat-card-inner {
            border-color: var(--cat-color, #C6A962);
            box-shadow: 0 0 30px var(--cat-glow, rgba(198,169,98,0.3));
        }

        /* Icono animado de categoria */
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

        /* Particulas flotantes por categoria */
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
            0% {
                opacity: 0;
                transform: translateY(100%) scale(0.5);
            }
            20% {
                opacity: 1;
            }
            80% {
                opacity: 1;
            }
            100% {
                opacity: 0;
                transform: translateY(-100%) scale(0.8) rotate(20deg);
            }
        }

        /* Anillo decorativo */
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
            0% {
                transform: scale(0.8);
                opacity: 0.8;
            }
            100% {
                transform: scale(1.5);
                opacity: 0;
            }
        }

        /* Nombre de categoria */
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

        /* Colores especificos por categoria */
        .cat-card[data-cat="proteccion"] {
            --cat-color: #3b82f6;
            --cat-glow: rgba(59, 130, 246, 0.4);
        }
        .cat-card[data-cat="amor"] {
            --cat-color: #ec4899;
            --cat-glow: rgba(236, 72, 153, 0.4);
        }
        .cat-card[data-cat="abundancia"] {
            --cat-color: #f59e0b;
            --cat-glow: rgba(245, 158, 11, 0.4);
        }
        .cat-card[data-cat="salud"] {
            --cat-color: #22c55e;
            --cat-glow: rgba(34, 197, 94, 0.4);
        }
        .cat-card[data-cat="sabiduria"] {
            --cat-color: #8b5cf6;
            --cat-glow: rgba(139, 92, 246, 0.4);
        }

        /* Brillo de fondo */
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

        /* Marco decorativo */
        .cat-frame {
            position: absolute;
            inset: 4px;
            border: 1px solid rgba(198,169,98,0.15);
            border-radius: 10px;
            pointer-events: none;
        }

        /* Esquinas doradas */
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

        .cat-card:hover .cat-corner {
            opacity: 1;
        }

        /* Responsive categorias */
        @media (max-width: 768px) {
            .cat-nav {
                gap: 12px;
            }
            .cat-card {
                width: 100px;
                height: 130px;
            }
            .cat-icon-main {
                font-size: 28px;
            }
            .cat-icon-container {
                width: 50px;
                height: 50px;
                margin-bottom: 8px;
            }
            .cat-name {
                font-size: 10px;
            }
            .cat-count {
                font-size: 9px;
            }
        }

        /* Contenedor de productos - fondo crema */
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

        /* Card estilo tarot */
        .tarot-card {
            position: relative;
            aspect-ratio: 2/3;
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
        }

        .tarot-card:hover .tarot-inner {
            transform: translateY(-12px) scale(1.02);
            box-shadow:
                0 40px 70px rgba(0,0,0,0.4),
                0 0 50px rgba(198,169,98,0.15);
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
            border: 2px solid #C6A962;
            z-index: 3;
        }
        .tarot-corner.tl { top: 12px; left: 12px; border-right: none; border-bottom: none; border-radius: 6px 0 0 0; }
        .tarot-corner.tr { top: 12px; right: 12px; border-left: none; border-bottom: none; border-radius: 0 6px 0 0; }
        .tarot-corner.bl { bottom: 12px; left: 12px; border-right: none; border-top: none; border-radius: 0 0 0 6px; }
        .tarot-corner.br { bottom: 12px; right: 12px; border-left: none; border-top: none; border-radius: 0 0 6px 0; }

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

        /* Imagen */
        .tarot-image {
            position: absolute;
            inset: 20px;
            bottom: 110px;
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
            background: linear-gradient(180deg, transparent 60%, rgba(0,0,0,0.7) 100%);
            pointer-events: none;
        }

        /* Sin imagen */
        .tarot-no-image {
            position: absolute;
            inset: 20px;
            bottom: 110px;
            background: linear-gradient(145deg, #1f1f1f 0%, #141414 100%);
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            border: 1px dashed rgba(198,169,98,0.2);
        }

        .tarot-no-image svg {
            width: 50px;
            height: 50px;
            fill: rgba(198,169,98,0.2);
        }

        /* Info del producto */
        .tarot-info {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            padding: 20px;
            text-align: center;
            z-index: 2;
        }

        .tarot-tipo {
            font-family: 'Cinzel', serif;
            font-size: 10px;
            color: rgba(255,255,255,0.4);
            text-transform: uppercase;
            letter-spacing: 3px;
            margin-bottom: 6px;
        }

        .tarot-name {
            font-family: 'Cinzel', serif;
            font-size: 15px;
            color: #fff;
            margin-bottom: 8px;
            letter-spacing: 1px;
            line-height: 1.3;
            min-height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .tarot-price {
            font-family: 'Cinzel', serif;
            font-size: 16px;
            color: #C6A962;
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

        /* Responsive */
        @media (max-width: 768px) {
            .tienda-hero {
                padding: 60px 20px;
            }
            .tienda-hero h1 {
                letter-spacing: 3px;
            }
            .cat-nav {
                gap: 8px;
            }
            .cat-btn {
                padding: 10px 16px;
                font-size: 11px;
            }
            .productos-container {
                padding: 40px 15px 60px;
            }
            .productos-grid {
                grid-template-columns: repeat(2, 1fr);
                gap: 15px;
            }
            .tarot-name {
                font-size: 13px;
                min-height: 35px;
            }
            .tarot-price {
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
        .cart-notification-icon {
            font-size: 24px;
            margin-right: 10px;
        }
    </style>

    <!-- Fonts -->
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
            // Definir particulas por categoria
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

                // Determinar key de categoria
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

                    <!-- Particulas flotantes -->
                    <div class="cat-particles">
                        <?php foreach ($parts as $i => $p): ?>
                        <span class="particle" style="left: <?php echo 15 + ($i * 20); ?>%; animation-delay: <?php echo $i * 0.5; ?>s;"><?php echo $p; ?></span>
                        <?php endforeach; ?>
                    </div>

                    <!-- Icono principal -->
                    <div class="cat-icon-container">
                        <div class="cat-ring"></div>
                        <span class="cat-icon-main"><?php echo $cat['icono']; ?></span>
                    </div>

                    <span class="cat-name"><?php echo $cat['nombre']; ?></span>
                    <span class="cat-count"><?php echo $count; ?> guardianes</span>
                </a>
            </div>
            <?php endforeach; ?>
        </div>
    </section>

    <!-- Productos - fondo crema -->
    <section class="productos-container">
        <div class="productos-grid">
            <?php while ($products->have_posts()): $products->the_post();
                global $product;
                $img_url = get_the_post_thumbnail_url(get_the_ID(), 'large');
                $cats = wp_get_post_terms(get_the_ID(), 'product_cat');
                $cat_principal = !empty($cats) ? $cats[0] : null;

                // Determinar icono
                $icono = '✨';
                if ($cat_principal) {
                    $cat_slug = $cat_principal->slug;
                    if (strpos($cat_slug, 'protec') !== false) $icono = '🛡️';
                    elseif (strpos($cat_slug, 'amor') !== false) $icono = '💜';
                    elseif (strpos($cat_slug, 'dinero') !== false || strpos($cat_slug, 'abundan') !== false) $icono = '✨';
                    elseif (strpos($cat_slug, 'salud') !== false || strpos($cat_slug, 'sana') !== false) $icono = '🌿';
                    elseif (strpos($cat_slug, 'sabid') !== false) $icono = '🔮';
                }

                $tipo = get_post_meta(get_the_ID(), '_guardian_tipo', true) ?: 'Guardián';
                $nombre = get_the_title();
            ?>
            <article class="tarot-card" data-product-id="<?php echo get_the_ID(); ?>">
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
                        <div class="tarot-price">$<?php echo number_format($product->get_price(), 0); ?> USD</div>
                    </div>

                    <div class="tarot-glow"></div>
                </a>
            </article>
            <?php endwhile; wp_reset_postdata(); ?>
        </div>
    </section>

    <!-- Footer section -->
    <section class="tienda-footer-section">
        <p>Duendes del Uruguay · Canalizados en Piriápolis · Piezas únicas e irrepetibles</p>
    </section>

    <!-- Notificacion carrito -->
    <div class="cart-notification" id="cart-notification">
        <span class="cart-notification-icon">✨</span>
        <span>Guardián agregado al carrito</span>
    </div>

    <!-- Audio elementos -->
    <audio id="sound-hover" preload="auto">
        <source src="data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA//tQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWGluZwAAAA8AAAACAAABhgC7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7//////////////////////////////////////////////////////////////////8AAAAATGF2YzU4LjEzAAAAAAAAAAAAAAAAJAAAAAAAAAAAAYYNBrYOAAAAAAD/+9DEAAAIAAp/AAAAgAADSAAAAEAAANIAAAAQQAAgBACAIAgCAYEAEMCgPg+D4Pg+CAIAAAAfB8Hw+D4IAAAAAAfB8Hw+D4PggAAAAA" type="audio/mp3">
    </audio>
    <audio id="sound-click" preload="auto">
        <source src="data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA//tQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWGluZwAAAA8AAAACAAABhgC7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7//////////////////////////////////////////////////////////////////8AAAAATGF2YzU4LjEzAAAAAAAAAAAAAAAAJAAAAAAAAAAAAYYNBrYOAAAAAAD/+9DEAAAIAAp/AAAAgAADSAAAAEAAANIAAAAQQAAgBACAIAgCAYEAEMCgPg+D4Pg+CAIAAAAfB8Hw+D4IAAAAAAfB8Hw+D4PggAAAAA" type="audio/mp3">
    </audio>

    <script>
    (function() {
        // Audio Context para sonidos suaves
        let audioCtx = null;

        function initAudio() {
            if (!audioCtx) {
                audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            }
            return audioCtx;
        }

        // Sonido suave de hover (campanita mistica)
        function playHoverSound() {
            try {
                const ctx = initAudio();
                const oscillator = ctx.createOscillator();
                const gainNode = ctx.createGain();

                oscillator.connect(gainNode);
                gainNode.connect(ctx.destination);

                oscillator.frequency.setValueAtTime(800, ctx.currentTime);
                oscillator.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.1);
                oscillator.type = 'sine';

                // Fade in suave
                gainNode.gain.setValueAtTime(0, ctx.currentTime);
                gainNode.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 0.05);
                // Fade out
                gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.3);

                oscillator.start(ctx.currentTime);
                oscillator.stop(ctx.currentTime + 0.3);
            } catch(e) {}
        }

        // Sonido de click/agregar (mas magico, como cristales)
        function playClickSound() {
            try {
                const ctx = initAudio();

                // Crear multiples tonos para sonido de cristal
                const frequencies = [523, 659, 784, 1047]; // Do, Mi, Sol, Do alto

                frequencies.forEach((freq, i) => {
                    const oscillator = ctx.createOscillator();
                    const gainNode = ctx.createGain();

                    oscillator.connect(gainNode);
                    gainNode.connect(ctx.destination);

                    oscillator.frequency.setValueAtTime(freq, ctx.currentTime);
                    oscillator.type = 'sine';

                    const delay = i * 0.05;

                    // Fade in
                    gainNode.gain.setValueAtTime(0, ctx.currentTime + delay);
                    gainNode.gain.linearRampToValueAtTime(0.1, ctx.currentTime + delay + 0.02);
                    // Fade out largo
                    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + 0.8);

                    oscillator.start(ctx.currentTime + delay);
                    oscillator.stop(ctx.currentTime + delay + 0.8);
                });
            } catch(e) {}
        }

        // Sonido de exito al agregar carrito (arpegio magico)
        function playCartSound() {
            try {
                const ctx = initAudio();
                const notes = [523, 659, 784, 1047, 1319]; // Arpegio ascendente

                notes.forEach((freq, i) => {
                    const osc = ctx.createOscillator();
                    const gain = ctx.createGain();

                    osc.connect(gain);
                    gain.connect(ctx.destination);

                    osc.frequency.setValueAtTime(freq, ctx.currentTime);
                    osc.type = 'sine';

                    const delay = i * 0.08;

                    gain.gain.setValueAtTime(0, ctx.currentTime + delay);
                    gain.gain.linearRampToValueAtTime(0.12, ctx.currentTime + delay + 0.02);
                    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + 1);

                    osc.start(ctx.currentTime + delay);
                    osc.stop(ctx.currentTime + delay + 1);
                });
            } catch(e) {}
        }

        // Event listeners para tarjetas de producto
        document.querySelectorAll('.tarot-card').forEach(card => {
            let hoverTimeout;

            card.addEventListener('mouseenter', () => {
                // Pequeño delay para evitar sonidos al pasar rapido
                hoverTimeout = setTimeout(() => {
                    playHoverSound();
                }, 100);
            });

            card.addEventListener('mouseleave', () => {
                clearTimeout(hoverTimeout);
            });

            card.addEventListener('click', (e) => {
                playClickSound();
            });
        });

        // Event listeners para tarjetas de categoria
        document.querySelectorAll('.cat-card').forEach(card => {
            let hoverTimeout;

            card.addEventListener('mouseenter', () => {
                hoverTimeout = setTimeout(() => {
                    playHoverSound();
                }, 100);
            });

            card.addEventListener('mouseleave', () => {
                clearTimeout(hoverTimeout);
            });

            card.addEventListener('click', (e) => {
                playClickSound();
            });
        });

        // Interceptar agregar al carrito (si hay boton)
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('add_to_cart_button') ||
                e.target.classList.contains('single_add_to_cart_button') ||
                e.target.closest('.add_to_cart_button')) {
                playCartSound();

                // Mostrar notificacion
                const notif = document.getElementById('cart-notification');
                if (notif) {
                    notif.classList.add('show');
                    setTimeout(() => {
                        notif.classList.remove('show');
                    }, 3000);
                }
            }
        });

        // Inicializar audio en primer interaccion
        document.addEventListener('click', function initOnClick() {
            initAudio();
            document.removeEventListener('click', initOnClick);
        }, { once: true });
    })();
    </script>

    <?php
    get_footer();
}
