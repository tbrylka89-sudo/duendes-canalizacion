<?php
/**
 * Plugin Name: Duendes Tienda Tarot
 * Description: Tienda con cards estilo cartas de tarot misticas
 * Version: 1.0
 */

if (!defined('ABSPATH')) exit;

// Interceptar la tienda completamente
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

    ?>
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title><?php echo esc_html($titulo); ?> - Duendes del Uruguay</title>
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400&display=swap" rel="stylesheet">
        <?php wp_head(); ?>
        <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }

            body {
                background: #0a0a0a;
                color: #fff;
                font-family: 'Cormorant Garamond', serif;
                min-height: 100vh;
            }

            /* Header */
            .tienda-header {
                background: linear-gradient(180deg, #0a0a0a 0%, transparent 100%);
                padding: 20px 40px;
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                z-index: 100;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            .tienda-logo {
                font-family: 'Cinzel', serif;
                font-size: 20px;
                color: #C6A962;
                text-decoration: none;
                letter-spacing: 2px;
            }

            .tienda-nav {
                display: flex;
                gap: 30px;
            }

            .tienda-nav a {
                color: rgba(255,255,255,0.7);
                text-decoration: none;
                font-family: 'Cinzel', serif;
                font-size: 12px;
                letter-spacing: 1px;
                transition: color 0.3s;
            }

            .tienda-nav a:hover {
                color: #C6A962;
            }

            /* Hero */
            .tienda-hero {
                padding: 150px 40px 80px;
                text-align: center;
                position: relative;
                overflow: hidden;
            }

            .hero-bg {
                position: absolute;
                inset: 0;
                background: radial-gradient(ellipse at center, rgba(198,169,98,0.1) 0%, transparent 70%);
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
                font-size: clamp(36px, 7vw, 64px);
                color: #C6A962;
                font-weight: 400;
                letter-spacing: 8px;
                text-transform: uppercase;
                margin-bottom: 15px;
                position: relative;
            }

            .tienda-hero p {
                font-size: 20px;
                color: rgba(255,255,255,0.5);
                font-style: italic;
                margin-bottom: 50px;
                position: relative;
            }

            /* Categorias */
            .cat-nav {
                display: flex;
                justify-content: center;
                gap: 15px;
                flex-wrap: wrap;
                position: relative;
            }

            .cat-btn {
                background: rgba(255,255,255,0.03);
                border: 1px solid rgba(198,169,98,0.2);
                padding: 14px 28px;
                border-radius: 50px;
                color: #fff;
                text-decoration: none;
                font-family: 'Cinzel', serif;
                font-size: 13px;
                letter-spacing: 1px;
                transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                display: flex;
                align-items: center;
                gap: 8px;
            }

            .cat-btn:hover, .cat-btn.active {
                background: rgba(198,169,98,0.15);
                border-color: #C6A962;
                transform: translateY(-3px);
                box-shadow: 0 10px 30px rgba(198,169,98,0.2);
            }

            .cat-btn span {
                opacity: 0.5;
                font-size: 11px;
            }

            /* Grid de productos - estilo tarot */
            .productos-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
                gap: 40px;
                padding: 0 40px 100px;
                max-width: 1600px;
                margin: 0 auto;
            }

            /* Card estilo tarot */
            .tarot-card {
                position: relative;
                aspect-ratio: 2/3;
                perspective: 1000px;
            }

            .tarot-inner {
                position: relative;
                width: 100%;
                height: 100%;
                background: linear-gradient(145deg, #1a1a1a 0%, #0d0d0d 100%);
                border-radius: 20px;
                overflow: hidden;
                transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
                cursor: pointer;
                text-decoration: none;
                display: block;
            }

            .tarot-card:hover .tarot-inner {
                transform: translateY(-15px) rotateX(5deg);
                box-shadow:
                    0 50px 80px rgba(0,0,0,0.5),
                    0 0 60px rgba(198,169,98,0.15),
                    inset 0 0 60px rgba(198,169,98,0.03);
            }

            /* Marco decorativo estilo tarot */
            .tarot-frame {
                position: absolute;
                inset: 8px;
                border: 1px solid rgba(198,169,98,0.3);
                border-radius: 16px;
                pointer-events: none;
                z-index: 2;
            }

            .tarot-frame::before {
                content: '';
                position: absolute;
                inset: 6px;
                border: 1px solid rgba(198,169,98,0.15);
                border-radius: 12px;
            }

            /* Esquinas decorativas */
            .tarot-corner {
                position: absolute;
                width: 30px;
                height: 30px;
                border: 2px solid #C6A962;
                z-index: 3;
            }
            .tarot-corner.tl { top: 15px; left: 15px; border-right: none; border-bottom: none; border-radius: 8px 0 0 0; }
            .tarot-corner.tr { top: 15px; right: 15px; border-left: none; border-bottom: none; border-radius: 0 8px 0 0; }
            .tarot-corner.bl { bottom: 15px; left: 15px; border-right: none; border-top: none; border-radius: 0 0 0 8px; }
            .tarot-corner.br { bottom: 15px; right: 15px; border-left: none; border-top: none; border-radius: 0 0 8px 0; }

            /* Imagen */
            .tarot-image {
                position: absolute;
                inset: 25px;
                bottom: 120px;
                border-radius: 12px;
                overflow: hidden;
            }

            .tarot-image img {
                width: 100%;
                height: 100%;
                object-fit: cover;
                transition: transform 0.6s;
            }

            .tarot-card:hover .tarot-image img {
                transform: scale(1.08);
            }

            /* Gradiente sobre imagen */
            .tarot-image::after {
                content: '';
                position: absolute;
                inset: 0;
                background: linear-gradient(180deg, transparent 50%, rgba(0,0,0,0.8) 100%);
                pointer-events: none;
            }

            /* Info del producto */
            .tarot-info {
                position: absolute;
                bottom: 0;
                left: 0;
                right: 0;
                padding: 25px;
                text-align: center;
                z-index: 2;
            }

            .tarot-name {
                font-family: 'Cinzel', serif;
                font-size: 20px;
                color: #fff;
                margin-bottom: 8px;
                letter-spacing: 2px;
            }

            .tarot-tipo {
                font-size: 12px;
                color: rgba(255,255,255,0.5);
                text-transform: uppercase;
                letter-spacing: 3px;
                margin-bottom: 12px;
            }

            .tarot-price {
                font-family: 'Cinzel', serif;
                font-size: 18px;
                color: #C6A962;
            }

            /* Badge categoria */
            .tarot-badge {
                position: absolute;
                top: 25px;
                right: 25px;
                width: 40px;
                height: 40px;
                background: rgba(0,0,0,0.6);
                border: 1px solid rgba(198,169,98,0.3);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 18px;
                z-index: 5;
                backdrop-filter: blur(10px);
            }

            /* Decoracion SVG estilo tarot */
            .tarot-deco {
                position: absolute;
                bottom: 100px;
                left: 50%;
                transform: translateX(-50%);
                width: 60px;
                height: 20px;
                z-index: 3;
            }

            .tarot-deco svg {
                width: 100%;
                height: 100%;
                fill: #C6A962;
                opacity: 0.4;
            }

            /* Efecto brillo */
            .tarot-glow {
                position: absolute;
                inset: 0;
                background: linear-gradient(135deg, rgba(198,169,98,0.1) 0%, transparent 50%, rgba(198,169,98,0.05) 100%);
                opacity: 0;
                transition: opacity 0.4s;
                pointer-events: none;
                border-radius: 20px;
            }

            .tarot-card:hover .tarot-glow {
                opacity: 1;
            }

            /* Sin imagen */
            .tarot-no-image {
                position: absolute;
                inset: 25px;
                bottom: 120px;
                background: linear-gradient(145deg, #1f1f1f 0%, #141414 100%);
                border-radius: 12px;
                display: flex;
                align-items: center;
                justify-content: center;
                border: 1px dashed rgba(198,169,98,0.2);
            }

            .tarot-no-image svg {
                width: 60px;
                height: 60px;
                fill: rgba(198,169,98,0.2);
            }

            /* Footer */
            .tienda-footer {
                text-align: center;
                padding: 60px 40px;
                border-top: 1px solid rgba(198,169,98,0.1);
            }

            .tienda-footer p {
                color: rgba(255,255,255,0.4);
                font-size: 14px;
            }

            /* Responsive */
            @media (max-width: 768px) {
                .tienda-header {
                    padding: 15px 20px;
                }
                .tienda-nav {
                    display: none;
                }
                .tienda-hero {
                    padding: 120px 20px 60px;
                }
                .tienda-hero h1 {
                    letter-spacing: 4px;
                }
                .cat-nav {
                    gap: 10px;
                }
                .cat-btn {
                    padding: 10px 18px;
                    font-size: 11px;
                }
                .productos-grid {
                    grid-template-columns: repeat(2, 1fr);
                    gap: 20px;
                    padding: 0 15px 60px;
                }
                .tarot-name {
                    font-size: 16px;
                }
            }
        </style>
    </head>
    <body>
        <!-- Header -->
        <header class="tienda-header">
            <a href="<?php echo home_url(); ?>" class="tienda-logo">Duendes del Uruguay</a>
            <nav class="tienda-nav">
                <a href="<?php echo home_url(); ?>">Inicio</a>
                <a href="<?php echo home_url('/shop'); ?>">Tienda</a>
                <a href="<?php echo home_url('/circulo'); ?>">Círculo</a>
                <a href="<?php echo home_url('/nosotros'); ?>">Nosotros</a>
                <a href="<?php echo wc_get_cart_url(); ?>">Carrito</a>
            </nav>
        </header>

        <!-- Hero -->
        <section class="tienda-hero">
            <div class="hero-bg"></div>
            <div class="hero-pattern"></div>
            <h1><?php echo esc_html($titulo); ?></h1>
            <p><?php echo esc_html($subtitulo); ?></p>

            <div class="cat-nav">
                <?php foreach ($categorias as $cat):
                    $term = get_term_by('slug', $cat['slug'], 'product_cat');
                    $count = $term ? $term->count : 0;
                    $link = $term ? get_term_link($term) : '#';
                    $is_active = $categoria_actual && $categoria_actual->slug === $cat['slug'];
                ?>
                <a href="<?php echo esc_url($link); ?>" class="cat-btn <?php echo $is_active ? 'active' : ''; ?>">
                    <?php echo $cat['icono']; ?> <?php echo $cat['nombre']; ?>
                    <span>(<?php echo $count; ?>)</span>
                </a>
                <?php endforeach; ?>
            </div>
        </section>

        <!-- Grid de productos -->
        <section class="productos-grid">
            <?php while ($products->have_posts()): $products->the_post();
                global $product;
                $img_url = get_the_post_thumbnail_url(get_the_ID(), 'large');
                $cats = wp_get_post_terms(get_the_ID(), 'product_cat');
                $cat_principal = !empty($cats) ? $cats[0] : null;

                // Determinar icono segun categoria
                $icono = '✨';
                if ($cat_principal) {
                    $cat_slug = $cat_principal->slug;
                    if (strpos($cat_slug, 'protec') !== false) $icono = '🛡️';
                    elseif (strpos($cat_slug, 'amor') !== false) $icono = '💜';
                    elseif (strpos($cat_slug, 'dinero') !== false || strpos($cat_slug, 'abundan') !== false) $icono = '✨';
                    elseif (strpos($cat_slug, 'salud') !== false || strpos($cat_slug, 'sana') !== false) $icono = '🌿';
                    elseif (strpos($cat_slug, 'sabid') !== false) $icono = '🔮';
                }

                // Tipo de ser
                $tipo = get_post_meta(get_the_ID(), '_guardian_tipo', true) ?: 'Guardián';
            ?>
            <article class="tarot-card">
                <a href="<?php the_permalink(); ?>" class="tarot-inner">
                    <!-- Marco decorativo -->
                    <div class="tarot-frame"></div>
                    <div class="tarot-corner tl"></div>
                    <div class="tarot-corner tr"></div>
                    <div class="tarot-corner bl"></div>
                    <div class="tarot-corner br"></div>

                    <!-- Badge categoria -->
                    <div class="tarot-badge"><?php echo $icono; ?></div>

                    <!-- Imagen -->
                    <?php if ($img_url): ?>
                    <div class="tarot-image">
                        <img src="<?php echo esc_url($img_url); ?>" alt="<?php the_title_attribute(); ?>">
                    </div>
                    <?php else: ?>
                    <div class="tarot-no-image">
                        <svg viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
                    </div>
                    <?php endif; ?>

                    <!-- Decoracion central -->
                    <div class="tarot-deco">
                        <svg viewBox="0 0 60 20">
                            <path d="M0 10 L15 10 L20 5 L25 15 L30 10 L35 15 L40 5 L45 10 L60 10" stroke="currentColor" stroke-width="1" fill="none"/>
                        </svg>
                    </div>

                    <!-- Info -->
                    <div class="tarot-info">
                        <div class="tarot-tipo"><?php echo esc_html($tipo); ?></div>
                        <h3 class="tarot-name"><?php the_title(); ?></h3>
                        <div class="tarot-price">$<?php echo number_format($product->get_price(), 0); ?> USD</div>
                    </div>

                    <!-- Efecto glow -->
                    <div class="tarot-glow"></div>
                </a>
            </article>
            <?php endwhile; wp_reset_postdata(); ?>
        </section>

        <!-- Footer -->
        <footer class="tienda-footer">
            <p>Duendes del Uruguay · Canalizados en Piriápolis · Piezas únicas</p>
        </footer>

        <?php wp_footer(); ?>
    </body>
    </html>
    <?php
}
