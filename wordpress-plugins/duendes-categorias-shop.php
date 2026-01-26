<?php
/**
 * Plugin Name: Duendes - Categorías en Shop
 * Description: Agrega barra de categorías en /shop
 * Version: 1.2
 */

if (!defined('ABSPATH')) exit;

add_action('wp_footer', function() {
    if (!is_shop() && !is_product_category()) return;

    $shop_url = wc_get_page_permalink('shop');
    $is_shop_home = is_shop() && !is_product_category();
    $current_cat = '';
    if (is_product_category()) {
        $term = get_queried_object();
        $current_cat = $term ? $term->slug : '';
    }
    ?>
    <style>
    .duendes-cats {
        display: flex !important;
        justify-content: center !important;
        gap: 12px !important;
        flex-wrap: wrap !important;
        padding: 30px 20px 40px !important;
        background: linear-gradient(180deg, #1a1510 0%, #0a0a0a 100%) !important;
        margin: 0 !important;
    }
    .duendes-cats a {
        display: flex !important;
        flex-direction: column !important;
        align-items: center !important;
        padding: 15px 20px !important;
        background: rgba(20,20,20,0.9) !important;
        border: 1px solid rgba(198,169,98,0.3) !important;
        border-radius: 10px !important;
        text-decoration: none !important;
        transition: all 0.3s !important;
        min-width: 90px !important;
    }
    .duendes-cats a:hover,
    .duendes-cats a.active {
        border-color: #C6A962 !important;
        transform: translateY(-3px) !important;
        box-shadow: 0 5px 20px rgba(198,169,98,0.2) !important;
    }
    .duendes-cats .cat-icon {
        font-size: 26px !important;
        margin-bottom: 6px !important;
    }
    .duendes-cats .cat-name {
        font-family: 'Cinzel', serif !important;
        font-size: 11px !important;
        color: #fff !important;
        text-transform: uppercase !important;
        letter-spacing: 1px !important;
    }
    .duendes-cats a:hover .cat-name,
    .duendes-cats a.active .cat-name {
        color: #C6A962 !important;
    }
    </style>

    <script>
    document.addEventListener('DOMContentLoaded', function() {
        var cats = [
            {slug: '', name: 'Todos', icon: '🌟'},
            {slug: 'proteccion', name: 'Protección', icon: '🛡️'},
            {slug: 'amor', name: 'Amor', icon: '💜'},
            {slug: 'dinero-abundancia-negocios', name: 'Abundancia', icon: '✨'},
            {slug: 'salud', name: 'Sanación', icon: '🌿'},
            {slug: 'sabiduria-guia-claridad', name: 'Sabiduría', icon: '🔮'}
        ];

        var shopUrl = '<?php echo esc_js($shop_url); ?>';
        var currentCat = '<?php echo esc_js($current_cat); ?>';
        var isShopHome = <?php echo $is_shop_home ? 'true' : 'false'; ?>;

        var html = '<div class="duendes-cats">';
        cats.forEach(function(cat) {
            var url = cat.slug ? shopUrl + '?product_cat=' + cat.slug : shopUrl;
            var isActive = (cat.slug === '' && isShopHome) || (cat.slug === currentCat);
            html += '<a href="' + url + '" class="' + (isActive ? 'active' : '') + '">';
            html += '<span class="cat-icon">' + cat.icon + '</span>';
            html += '<span class="cat-name">' + cat.name + '</span>';
            html += '</a>';
        });
        html += '</div>';

        // Buscar el título "ENCONTRÁ AL QUE YA TE ELIGIÓ" y poner las categorías después
        var titulo = null;
        var allElements = document.querySelectorAll('h1, h2, .elementor-heading-title, [class*="title"]');
        allElements.forEach(function(el) {
            if (el.textContent && el.textContent.toUpperCase().includes('ENCONTR')) {
                titulo = el;
            }
        });

        // También buscar en secciones de Elementor
        if (!titulo) {
            var sections = document.querySelectorAll('.elementor-section, .elementor-widget-heading');
            sections.forEach(function(sec) {
                if (sec.textContent && sec.textContent.toUpperCase().includes('ENCONTR')) {
                    titulo = sec;
                }
            });
        }

        if (titulo) {
            // Buscar el contenedor padre (sección de Elementor)
            var parent = titulo.closest('.elementor-section') || titulo.closest('section') || titulo.parentNode;
            if (parent) {
                parent.insertAdjacentHTML('afterend', html);
                return;
            }
        }

        // Fallback: buscar antes de los productos
        var products = document.querySelector('.products, ul.products, .woocommerce-products');
        if (products && products.parentNode) {
            products.insertAdjacentHTML('beforebegin', html);
        }
    });
    </script>
    <?php
});
