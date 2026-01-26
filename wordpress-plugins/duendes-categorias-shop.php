<?php
/**
 * Plugin Name: Duendes - Categorías en Shop
 * Description: Agrega barra de categorías visual en la página /shop
 * Version: 1.0
 * Author: Duendes del Uruguay
 */

if (!defined('ABSPATH')) exit;

// Solo cargar en la página de shop
add_action('wp', function() {
    if (is_shop() || is_product_category()) {
        add_action('wp_head', 'duendes_categorias_shop_styles');
        add_action('woocommerce_before_shop_loop', 'duendes_categorias_shop_html', 5);
    }
});

function duendes_categorias_shop_styles() {
    ?>
    <style>
    /* Ocultar título default de WooCommerce */
    .woocommerce-products-header__title {
        display: none !important;
    }

    /* Hero de la tienda */
    .duendes-shop-hero {
        background: linear-gradient(180deg, #0a0a0a 0%, #1a1510 100%);
        padding: 40px 20px 30px;
        text-align: center;
        position: relative;
        overflow: hidden;
        margin: -20px -20px 30px -20px;
    }

    @media (min-width: 768px) {
        .duendes-shop-hero {
            padding: 60px 20px 40px;
            margin: -40px -40px 40px -40px;
        }
    }

    .duendes-shop-hero::before {
        content: '';
        position: absolute;
        inset: 0;
        background: radial-gradient(ellipse at center, rgba(198,169,98,0.15) 0%, transparent 70%);
        pointer-events: none;
    }

    .duendes-shop-hero h1 {
        font-family: 'Cinzel', serif;
        font-size: clamp(22px, 5vw, 42px);
        color: #C6A962;
        font-weight: 400;
        letter-spacing: 3px;
        text-transform: uppercase;
        margin: 0 0 10px 0;
        position: relative;
        text-shadow: 0 0 40px rgba(198,169,98,0.3);
    }

    .duendes-shop-hero p {
        font-family: 'Cormorant Garamond', Georgia, serif;
        font-size: 15px;
        color: rgba(255,255,255,0.6);
        font-style: italic;
        margin: 0 0 25px 0;
        position: relative;
    }

    /* Navegación de categorías */
    .duendes-cat-nav {
        display: flex;
        justify-content: center;
        gap: 10px;
        flex-wrap: wrap;
        position: relative;
        padding: 15px 0;
        max-width: 700px;
        margin: 0 auto;
    }

    .duendes-cat-card {
        position: relative;
        width: 90px;
        height: 115px;
        cursor: pointer;
        text-decoration: none !important;
    }

    @media (min-width: 768px) {
        .duendes-cat-card {
            width: 100px;
            height: 130px;
        }
    }

    .duendes-cat-card-inner {
        position: relative;
        width: 100%;
        height: 100%;
        background: linear-gradient(145deg, rgba(20,20,20,0.95) 0%, rgba(10,10,10,0.98) 100%);
        border: 1px solid rgba(198,169,98,0.3);
        border-radius: 12px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        overflow: hidden;
        transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        box-shadow: 0 10px 30px rgba(0,0,0,0.4);
    }

    .duendes-cat-card:hover .duendes-cat-card-inner {
        transform: translateY(-8px) scale(1.03);
        box-shadow: 0 20px 40px rgba(0,0,0,0.5), 0 0 30px var(--cat-glow, rgba(198,169,98,0.2));
    }

    .duendes-cat-card.active .duendes-cat-card-inner {
        border-color: var(--cat-color, #C6A962);
        box-shadow: 0 0 25px var(--cat-glow, rgba(198,169,98,0.3));
    }

    .duendes-cat-card:hover .duendes-cat-card-inner {
        border-color: var(--cat-color, #C6A962);
    }

    .duendes-cat-icon {
        font-size: 26px;
        margin-bottom: 8px;
        filter: drop-shadow(0 0 10px var(--cat-glow, rgba(198,169,98,0.5)));
        transition: transform 0.4s;
    }

    @media (min-width: 768px) {
        .duendes-cat-icon {
            font-size: 28px;
        }
    }

    .duendes-cat-card:hover .duendes-cat-icon {
        transform: scale(1.15);
    }

    .duendes-cat-name {
        font-family: 'Cinzel', serif;
        font-size: 9px;
        color: #fff;
        letter-spacing: 1px;
        text-transform: uppercase;
        transition: color 0.3s;
    }

    @media (min-width: 768px) {
        .duendes-cat-name {
            font-size: 10px;
        }
    }

    .duendes-cat-card:hover .duendes-cat-name,
    .duendes-cat-card.active .duendes-cat-name {
        color: var(--cat-color, #C6A962);
    }

    .duendes-cat-desc {
        font-family: 'Cormorant Garamond', Georgia, serif;
        font-size: 8px;
        color: rgba(255,255,255,0.4);
        margin-top: 4px;
    }

    /* Colores por categoría */
    .duendes-cat-card[data-cat="todos"] { --cat-color: #C6A962; --cat-glow: rgba(198,169,98,0.4); }
    .duendes-cat-card[data-cat="proteccion"] { --cat-color: #3b82f6; --cat-glow: rgba(59, 130, 246, 0.4); }
    .duendes-cat-card[data-cat="amor"] { --cat-color: #ec4899; --cat-glow: rgba(236, 72, 153, 0.4); }
    .duendes-cat-card[data-cat="abundancia"] { --cat-color: #f59e0b; --cat-glow: rgba(245, 158, 11, 0.4); }
    .duendes-cat-card[data-cat="salud"] { --cat-color: #22c55e; --cat-glow: rgba(34, 197, 94, 0.4); }
    .duendes-cat-card[data-cat="sabiduria"] { --cat-color: #8b5cf6; --cat-glow: rgba(139, 92, 246, 0.4); }

    /* Esquinas decorativas */
    .duendes-cat-corner {
        position: absolute;
        width: 10px;
        height: 10px;
        border: 2px solid var(--cat-color, #C6A962);
        opacity: 0.5;
        transition: opacity 0.3s;
    }
    .duendes-cat-corner.tl { top: 5px; left: 5px; border-right: none; border-bottom: none; border-radius: 3px 0 0 0; }
    .duendes-cat-corner.tr { top: 5px; right: 5px; border-left: none; border-bottom: none; border-radius: 0 3px 0 0; }
    .duendes-cat-corner.bl { bottom: 5px; left: 5px; border-right: none; border-top: none; border-radius: 0 0 0 3px; }
    .duendes-cat-corner.br { bottom: 5px; right: 5px; border-left: none; border-top: none; border-radius: 0 0 3px 0; }

    .duendes-cat-card:hover .duendes-cat-corner {
        opacity: 1;
    }

    /* Marco interno */
    .duendes-cat-frame {
        position: absolute;
        inset: 3px;
        border: 1px solid rgba(198,169,98,0.15);
        border-radius: 10px;
        pointer-events: none;
    }
    </style>
    <?php
}

function duendes_categorias_shop_html() {
    // Definir categorías
    $categorias = [
        [
            'slug' => '',
            'key' => 'todos',
            'nombre' => 'Todos',
            'desc' => 'Ver todos',
            'icono' => '🌟',
            'url' => wc_get_page_permalink('shop')
        ],
        [
            'slug' => 'proteccion',
            'key' => 'proteccion',
            'nombre' => 'Protección',
            'desc' => 'Algo te drena',
            'icono' => '🛡️',
            'url' => get_term_link('proteccion', 'product_cat')
        ],
        [
            'slug' => 'amor',
            'key' => 'amor',
            'nombre' => 'Amor',
            'desc' => 'El corazón pide',
            'icono' => '💜',
            'url' => get_term_link('amor', 'product_cat')
        ],
        [
            'slug' => 'dinero-abundancia-negocios',
            'key' => 'abundancia',
            'nombre' => 'Abundancia',
            'desc' => 'No alcanza',
            'icono' => '✨',
            'url' => get_term_link('dinero-abundancia-negocios', 'product_cat')
        ],
        [
            'slug' => 'salud',
            'key' => 'salud',
            'nombre' => 'Sanación',
            'desc' => 'Necesitás sanar',
            'icono' => '🌿',
            'url' => get_term_link('salud', 'product_cat')
        ],
        [
            'slug' => 'sabiduria-guia-claridad',
            'key' => 'sabiduria',
            'nombre' => 'Sabiduría',
            'desc' => 'Buscás respuestas',
            'icono' => '🔮',
            'url' => get_term_link('sabiduria-guia-claridad', 'product_cat')
        ],
    ];

    // Detectar categoría activa
    $categoria_activa = '';
    if (is_product_category()) {
        $term = get_queried_object();
        if ($term) {
            $categoria_activa = $term->slug;
        }
    }

    ?>
    <div class="duendes-shop-hero">
        <h1>Encontrá al que ya te eligió</h1>
        <p>Cada uno nació para alguien. Uno de ellos, para vos.</p>

        <div class="duendes-cat-nav">
            <?php foreach ($categorias as $cat):
                $is_active = false;
                if ($cat['slug'] === '' && is_shop() && !is_product_category()) {
                    $is_active = true;
                } elseif ($cat['slug'] !== '' && $categoria_activa === $cat['slug']) {
                    $is_active = true;
                }

                // Verificar que la URL es válida
                $url = $cat['url'];
                if (is_wp_error($url)) {
                    $url = wc_get_page_permalink('shop') . '?product_cat=' . $cat['slug'];
                }
            ?>
                <a href="<?php echo esc_url($url); ?>"
                   class="duendes-cat-card <?php echo $is_active ? 'active' : ''; ?>"
                   data-cat="<?php echo esc_attr($cat['key']); ?>">
                    <div class="duendes-cat-card-inner">
                        <div class="duendes-cat-frame"></div>
                        <div class="duendes-cat-corner tl"></div>
                        <div class="duendes-cat-corner tr"></div>
                        <div class="duendes-cat-corner bl"></div>
                        <div class="duendes-cat-corner br"></div>
                        <span class="duendes-cat-icon"><?php echo $cat['icono']; ?></span>
                        <span class="duendes-cat-name"><?php echo esc_html($cat['nombre']); ?></span>
                        <span class="duendes-cat-desc"><?php echo esc_html($cat['desc']); ?></span>
                    </div>
                </a>
            <?php endforeach; ?>
        </div>
    </div>
    <?php
}
