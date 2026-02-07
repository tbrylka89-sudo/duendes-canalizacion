<?php
/**
 * Plugin Name: Duendes Tienda Tarot v3
 * Description: Cards unificadas + etiquetas tamaño + sección adoptados
 * Version: 3.0
 */

if (!defined('ABSPATH')) exit;

add_action('template_redirect', function() {
    if (is_shop() || is_product_category()) {
        duendes_render_tienda_v3();
        exit;
    }
});

function duendes_render_tienda_v3() {
    $categoria_actual = null;
    $titulo = 'Encontrá al que ya te eligió';
    $subtitulo = 'Cada uno nació para alguien. Uno de ellos, para vos.';

    if (is_product_category()) {
        $categoria_actual = get_queried_object();
        $titulo = $categoria_actual->name;
        $subtitulo = $categoria_actual->description ?: 'Guardianes de ' . $categoria_actual->name;
    }

    // ═══ PRODUCTOS DISPONIBLES (con imagen, con stock) ═══
    $args_disponibles = [
        'post_type' => 'product',
        'posts_per_page' => -1,
        'post_status' => 'publish',
        'orderby' => 'rand',
        'meta_query' => [
            'relation' => 'AND',
            ['key' => '_thumbnail_id', 'compare' => 'EXISTS'],
            ['key' => '_stock_status', 'value' => 'instock']
        ]
    ];

    // ═══ PRODUCTOS ADOPTADOS (sin stock) ═══
    $args_adoptados = [
        'post_type' => 'product',
        'posts_per_page' => 12, // Mostrar solo últimos 12 adoptados
        'post_status' => 'publish',
        'orderby' => 'modified',
        'order' => 'DESC',
        'meta_query' => [
            'relation' => 'AND',
            ['key' => '_thumbnail_id', 'compare' => 'EXISTS'],
            ['key' => '_stock_status', 'value' => 'outofstock']
        ]
    ];

    if ($categoria_actual) {
        $tax_query = [[
            'taxonomy' => 'product_cat',
            'field' => 'term_id',
            'terms' => $categoria_actual->term_id
        ]];
        $args_disponibles['tax_query'] = $tax_query;
        $args_adoptados['tax_query'] = $tax_query;
    }

    $productos_disponibles = new WP_Query($args_disponibles);
    $productos_adoptados = new WP_Query($args_adoptados);

    // Categorias
    $categorias = [
        ['slug' => 'proteccion', 'nombre' => 'Protección', 'desc' => 'Algo te drena', 'icono' => '🛡️'],
        ['slug' => 'amor', 'nombre' => 'Amor', 'desc' => 'El corazón pide', 'icono' => '💜'],
        ['slug' => 'dinero-abundancia-negocios', 'nombre' => 'Abundancia', 'desc' => 'No alcanza', 'icono' => '✨'],
        ['slug' => 'salud', 'nombre' => 'Sanación', 'desc' => 'Necesitás sanar', 'icono' => '🌿'],
        ['slug' => 'sabiduria-guia-claridad', 'nombre' => 'Sabiduría', 'desc' => 'Buscás respuestas', 'icono' => '🔮'],
    ];

    get_header();
    ?>
    <style>
        /* ═══ RESET ═══ */
        .site-content, .content-area, main, #main, #primary {
            background: #FAF8F5 !important;
            padding: 0 !important;
            margin: 0 !important;
            max-width: 100% !important;
        }
        .woocommerce-breadcrumb, .woocommerce-products-header, .page-title, .archive-title {
            display: none !important;
        }

        /* ═══ HERO ═══ */
        .tienda-hero {
            background: linear-gradient(180deg, #0a0a0a 0%, #1a1510 100%);
            padding: 60px 40px;
            text-align: center;
        }
        .tienda-hero h1 {
            font-family: 'Cinzel', serif;
            font-size: clamp(28px, 5vw, 48px);
            color: #C6A962;
            letter-spacing: 4px;
            text-transform: uppercase;
            margin: 0 0 10px 0;
        }
        .tienda-hero p {
            font-family: 'Cormorant Garamond', serif;
            font-size: 16px;
            color: rgba(255,255,255,0.6);
            font-style: italic;
            margin: 0 0 30px 0;
        }

        /* ═══ CATEGORIAS MINI ═══ */
        .cat-nav {
            display: flex;
            justify-content: center;
            gap: 12px;
            flex-wrap: wrap;
        }
        .cat-pill {
            display: flex;
            align-items: center;
            gap: 6px;
            padding: 10px 16px;
            background: rgba(255,255,255,0.05);
            border: 1px solid rgba(198,169,98,0.3);
            border-radius: 25px;
            text-decoration: none;
            transition: all 0.3s;
        }
        .cat-pill:hover, .cat-pill.active {
            background: rgba(198,169,98,0.15);
            border-color: #C6A962;
        }
        .cat-pill span {
            font-family: 'Cinzel', serif;
            font-size: 11px;
            color: #fff;
            letter-spacing: 1px;
            text-transform: uppercase;
        }

        /* ═══ PRODUCTOS ═══ */
        .productos-section {
            background: #FAF8F5;
            padding: 50px 20px 80px;
        }
        .productos-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
            gap: 30px;
            max-width: 1400px;
            margin: 0 auto;
        }

        /* ═══ CARD UNIFICADA ═══ */
        .guardian-card {
            background: linear-gradient(145deg, #1a1a1a 0%, #0d0d0d 100%);
            border-radius: 16px;
            overflow: hidden;
            text-decoration: none;
            display: block;
            transition: all 0.4s ease;
            border: 2px solid rgba(198,169,98,0.4);
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        }
        .guardian-card:hover {
            transform: translateY(-8px);
            border-color: #C6A962;
            box-shadow: 0 20px 50px rgba(0,0,0,0.3), 0 0 30px rgba(198,169,98,0.15);
        }

        /* Imagen */
        .guardian-imagen {
            position: relative;
            aspect-ratio: 1/1;
            overflow: hidden;
        }
        .guardian-imagen img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform 0.5s;
        }
        .guardian-card:hover .guardian-imagen img {
            transform: scale(1.08);
        }

        /* Etiqueta tamaño */
        .guardian-tamano {
            position: absolute;
            top: 12px;
            left: 12px;
            padding: 5px 10px;
            background: rgba(0,0,0,0.75);
            border: 1px solid rgba(198,169,98,0.5);
            border-radius: 4px;
            font-family: 'Cinzel', serif;
            font-size: 9px;
            color: #C6A962;
            letter-spacing: 1.5px;
            text-transform: uppercase;
            backdrop-filter: blur(5px);
        }

        /* Badge categoria */
        .guardian-categoria {
            position: absolute;
            top: 12px;
            right: 12px;
            width: 32px;
            height: 32px;
            background: rgba(0,0,0,0.75);
            border: 1px solid rgba(198,169,98,0.5);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 14px;
            backdrop-filter: blur(5px);
        }

        /* Info */
        .guardian-info {
            padding: 18px;
            text-align: center;
            border-top: 1px solid rgba(198,169,98,0.2);
        }
        .guardian-tipo {
            font-family: 'Cinzel', serif;
            font-size: 9px;
            color: rgba(255,255,255,0.5);
            letter-spacing: 2px;
            text-transform: uppercase;
            margin-bottom: 4px;
        }
        .guardian-nombre {
            font-family: 'Cinzel', serif;
            font-size: 16px;
            color: #fff;
            margin: 0 0 12px 0;
        }
        .guardian-precio {
            font-family: 'Cinzel', serif;
            font-size: 18px;
            color: #C6A962;
            font-weight: 600;
            margin-bottom: 14px;
        }
        .guardian-cta {
            display: inline-block;
            padding: 10px 20px;
            background: transparent;
            border: 1px solid rgba(198,169,98,0.5);
            border-radius: 4px;
            font-family: 'Cinzel', serif;
            font-size: 10px;
            color: #C6A962;
            letter-spacing: 1.5px;
            text-transform: uppercase;
            transition: all 0.3s;
        }
        .guardian-card:hover .guardian-cta {
            background: rgba(198,169,98,0.2);
            border-color: #C6A962;
        }

        /* ═══ SECCION ADOPTADOS ═══ */
        .adoptados-section {
            background: linear-gradient(180deg, #1a1510 0%, #0a0a0a 100%);
            padding: 60px 20px 80px;
            text-align: center;
        }
        .adoptados-titulo {
            font-family: 'Cinzel', serif;
            font-size: clamp(24px, 4vw, 36px);
            color: #C6A962;
            letter-spacing: 3px;
            margin: 0 0 10px 0;
        }
        .adoptados-subtitulo {
            font-family: 'Cormorant Garamond', serif;
            font-size: 16px;
            color: rgba(255,255,255,0.5);
            font-style: italic;
            margin: 0 0 40px 0;
        }
        .adoptados-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
            gap: 20px;
            max-width: 1200px;
            margin: 0 auto;
        }

        /* Card adoptado - clickeable para ver historia */
        .guardian-card.adoptado {
            cursor: pointer;
        }
        .guardian-card.adoptado .guardian-imagen::after {
            content: '';
            position: absolute;
            inset: 0;
            background: linear-gradient(0deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0.1) 100%);
        }

        /* Cartel ADOPTADO estilo western - abajo para ver la cara */
        .cartel-adoptado {
            position: absolute;
            bottom: 15px;
            left: 50%;
            transform: translateX(-50%) rotate(-3deg);
            padding: 10px 25px;
            background: linear-gradient(145deg, #8B4513 0%, #654321 100%);
            border: 4px solid #3d2314;
            border-radius: 3px;
            font-family: 'Cinzel', serif;
            font-size: 13px;
            font-weight: 600;
            color: #FFD700;
            letter-spacing: 3px;
            text-transform: uppercase;
            box-shadow:
                0 6px 20px rgba(0,0,0,0.6),
                inset 0 2px 0 rgba(255,255,255,0.15),
                inset 0 -2px 0 rgba(0,0,0,0.2);
            z-index: 10;
            white-space: nowrap;
            text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
        }

        /* ═══ FOOTER ═══ */
        .tienda-footer {
            background: #0a0a0a;
            padding: 40px 20px;
            text-align: center;
            border-top: 1px solid rgba(198,169,98,0.1);
        }
        .tienda-footer p {
            font-family: 'Cormorant Garamond', serif;
            color: rgba(255,255,255,0.4);
            font-size: 14px;
            margin: 0;
        }

        /* ═══ RESPONSIVE ═══ */
        @media (max-width: 768px) {
            .tienda-hero { padding: 40px 15px; }
            .cat-nav { gap: 8px; }
            .cat-pill { padding: 8px 12px; }
            .cat-pill span { font-size: 9px; }

            .productos-section { padding: 30px 12px 60px; }
            .productos-grid {
                grid-template-columns: repeat(2, 1fr);
                gap: 12px;
            }

            .guardian-card {
                border-radius: 12px;
                border-width: 1.5px;
            }
            .guardian-imagen { aspect-ratio: 1/1.1; }
            .guardian-tamano {
                font-size: 7px;
                padding: 4px 7px;
                top: 8px;
                left: 8px;
            }
            .guardian-categoria {
                width: 26px;
                height: 26px;
                font-size: 11px;
                top: 8px;
                right: 8px;
            }
            .guardian-info { padding: 12px 10px; }
            .guardian-tipo { font-size: 7px; margin-bottom: 2px; }
            .guardian-nombre { font-size: 13px; margin-bottom: 8px; }
            .guardian-precio { font-size: 15px; margin-bottom: 10px; }
            .guardian-cta {
                font-size: 8px;
                padding: 8px 14px;
                letter-spacing: 1px;
            }

            .adoptados-section { padding: 40px 12px 60px; }
            .adoptados-grid {
                grid-template-columns: repeat(2, 1fr);
                gap: 10px;
            }
            .cartel-adoptado {
                font-size: 9px;
                padding: 5px 12px;
            }
        }
    </style>

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600&family=Cormorant+Garamond:ital,wght@0,400;0,500;1,400&display=swap" rel="stylesheet">

    <!-- HERO -->
    <section class="tienda-hero">
        <h1><?php echo esc_html($titulo); ?></h1>
        <p><?php echo esc_html($subtitulo); ?></p>
        <div class="cat-nav">
            <?php foreach ($categorias as $cat):
                $term = get_term_by('slug', $cat['slug'], 'product_cat');
                $link = $term ? get_term_link($term) : '#';
                $is_active = $categoria_actual && $categoria_actual->slug === $cat['slug'];
            ?>
            <a href="<?php echo esc_url($link); ?>" class="cat-pill <?php echo $is_active ? 'active' : ''; ?>">
                <span><?php echo $cat['icono']; ?> <?php echo $cat['nombre']; ?></span>
            </a>
            <?php endforeach; ?>
        </div>
    </section>

    <!-- PRODUCTOS DISPONIBLES -->
    <section class="productos-section">
        <div class="productos-grid">
            <?php while ($productos_disponibles->have_posts()): $productos_disponibles->the_post();
                global $product;
                echo duendes_render_guardian_card($product, false);
            endwhile; wp_reset_postdata(); ?>
        </div>
    </section>

    <!-- PRODUCTOS ADOPTADOS -->
    <?php if ($productos_adoptados->have_posts()): ?>
    <section class="adoptados-section">
        <h2 class="adoptados-titulo">Ya Encontraron Hogar</h2>
        <p class="adoptados-subtitulo">Estos guardianes ya fueron adoptados y ahora acompañan a sus humanos</p>
        <div class="adoptados-grid">
            <?php while ($productos_adoptados->have_posts()): $productos_adoptados->the_post();
                global $product;
                echo duendes_render_guardian_card($product, true);
            endwhile; wp_reset_postdata(); ?>
        </div>
    </section>
    <?php endif; ?>

    <!-- FOOTER -->
    <section class="tienda-footer">
        <p>Duendes del Uruguay · Nacidos en Piriápolis · Destinados a encontrarte</p>
    </section>

    <script>
    (function() {
        // Precios geolocalizados
        function getCookie(n) {
            const m = document.cookie.match(new RegExp('(^| )' + n + '=([^;]+)'));
            return m ? m[2] : null;
        }

        const pais = getCookie('duendes_pais') || 'US';
        if (pais === 'UY') {
            document.querySelectorAll('.guardian-precio').forEach(el => {
                const uyu = el.dataset.uyu;
                if (uyu) el.textContent = '$' + parseInt(uyu).toLocaleString('es-UY') + ' UYU';
            });
        }
    })();
    </script>

    <?php
    get_footer();
}

/**
 * Renderiza una card de guardian
 */
function duendes_render_guardian_card($product, $es_adoptado = false) {
    $product_id = $product->get_id();

    // Precio
    $precio_raw = floatval(get_post_meta($product_id, '_price', true));
    if ($precio_raw <= 0) $precio_raw = floatval(get_post_meta($product_id, '_regular_price', true));
    if ($precio_raw > 1500) $precio_raw = round($precio_raw / 43);

    // Determinar tamaño y precio
    $tamanos = [
        [0, 100, 'Mini', 70, 2500],
        [100, 175, 'Pixie', 150, 5500],
        [175, 350, 'Mediano', 200, 8000],
        [350, 800, 'Grande', 450, 16500],
        [800, 99999, 'Gigante', 1050, 39800],
    ];
    $tamano = 'Mini';
    $precio_usd = 70;
    $precio_uyu = 2500;
    foreach ($tamanos as $t) {
        if ($precio_raw >= $t[0] && $precio_raw < $t[1]) {
            $tamano = $t[2];
            $precio_usd = $t[3];
            $precio_uyu = $t[4];
            break;
        }
    }

    // Imagen
    $img_url = get_the_post_thumbnail_url($product_id, 'large');

    // Categoria
    $cats = wp_get_post_terms($product_id, 'product_cat');
    $icono = '✨';
    if (!empty($cats)) {
        $slug = $cats[0]->slug;
        if (strpos($slug, 'protec') !== false) $icono = '🛡️';
        elseif (strpos($slug, 'amor') !== false) $icono = '💜';
        elseif (strpos($slug, 'dinero') !== false || strpos($slug, 'abundan') !== false) $icono = '✨';
        elseif (strpos($slug, 'salud') !== false) $icono = '🌿';
        elseif (strpos($slug, 'sabid') !== false) $icono = '🔮';
    }

    // Tipo y nombre
    $tipo = get_post_meta($product_id, '_guardian_tipo', true) ?: get_post_meta($product_id, '_duendes_tipo', true) ?: 'Guardián';
    $nombre = get_the_title($product_id);
    $link = get_permalink($product_id);

    ob_start();
    ?>
    <a href="<?php echo esc_url($link); ?>" class="guardian-card <?php echo $es_adoptado ? 'adoptado' : ''; ?>">
        <div class="guardian-imagen">
            <?php if ($img_url): ?>
                <img src="<?php echo esc_url($img_url); ?>" alt="<?php echo esc_attr($nombre); ?>" loading="lazy">
            <?php endif; ?>
            <span class="guardian-tamano"><?php echo $tamano; ?></span>
            <span class="guardian-categoria"><?php echo $icono; ?></span>
            <?php if ($es_adoptado): ?>
                <span class="cartel-adoptado">Adoptado</span>
            <?php endif; ?>
        </div>
        <div class="guardian-info">
            <div class="guardian-tipo"><?php echo esc_html($tipo); ?></div>
            <h3 class="guardian-nombre"><?php echo esc_html($nombre); ?></h3>
            <?php if (!$es_adoptado): ?>
                <div class="guardian-precio" data-usd="<?php echo $precio_usd; ?>" data-uyu="<?php echo $precio_uyu; ?>">
                    $<?php echo $precio_usd; ?> USD
                </div>
                <span class="guardian-cta">Conocer su Historia</span>
            <?php endif; ?>
        </div>
    </a>
    <?php
    return ob_get_clean();
}
