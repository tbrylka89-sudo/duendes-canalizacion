<?php
/**
 * Plugin Name: Duendes Shop Premium
 * Description: Tienda con diseño premium - Bloque 2 Neuromarketing
 * Version: 2.1
 * Author: Claude Code
 */

if (!defined('ABSPATH')) exit;

// Solo en shop y categorías
add_action('wp_head', function() {
    if (!is_shop() && !is_product_category()) return;

    // Obtener datos
    $stats = duendes_shop_premium_get_stats();
    $cat_actual = '';
    if (is_product_category()) {
        $term = get_queried_object();
        $cat_actual = $term ? $term->slug : '';
    }
    ?>
    <style>
    <?php echo duendes_shop_premium_get_css(); ?>
    </style>
    <script>
    window.DUENDES_SHOP = {
        stats: <?php echo json_encode($stats); ?>,
        catActual: <?php echo json_encode($cat_actual); ?>,
        shopUrl: <?php echo json_encode(get_permalink(wc_get_page_id('shop'))); ?>
    };
    </script>
    <?php
}, 100);

// JavaScript para inyectar elementos
add_action('wp_footer', function() {
    if (!is_shop() && !is_product_category()) return;
    ?>
    <script>
    (function() {
        document.addEventListener('DOMContentLoaded', function() {
            setTimeout(initShopPremium, 100);
        });

        function initShopPremium() {
            var data = window.DUENDES_SHOP || {};

            var productsContainer = document.querySelector('.elementor-widget-woocommerce-products, .products, ul.products');
            if (!productsContainer) {
                console.log('DSP: No products container found');
                return;
            }

            var wrapper = document.createElement('div');
            wrapper.className = 'dsp-wrapper';

            var sidebar = createSidebar(data);

            var main = document.createElement('div');
            main.className = 'dsp-main';

            var header = createHeader(data);

            main.appendChild(header);

            var parent = productsContainer.parentNode;
            parent.insertBefore(wrapper, productsContainer);

            wrapper.appendChild(sidebar);
            wrapper.appendChild(main);
            main.appendChild(productsContainer);

            // Inyectar sección de categorías grandes después del banner
            injectCategoriasGrandes(data);

            // Inyectar botones CONOCER HISTORIA en cada producto
            injectBotonesConocerHistoria();

            console.log('DSP: Shop Premium initialized');
        }

        function injectCategoriasGrandes(data) {
            var categorias = [
                {slug: '', nombre: 'Todos', desc: 'Ver todos los guardianes', icono: '&#10022;', cat: ''},
                {slug: 'proteccion', nombre: 'Proteccion', desc: 'Algo te drena', icono: '&#128737;', cat: 'proteccion'},
                {slug: 'amor', nombre: 'Amor', desc: 'El corazon pide', icono: '&#128156;', cat: 'amor'},
                {slug: 'dinero-abundancia-negocios', nombre: 'Abundancia', desc: 'No alcanza', icono: '&#10024;', cat: 'abundancia'},
                {slug: 'salud', nombre: 'Sanacion', desc: 'Necesitas sanar', icono: '&#127807;', cat: 'salud'},
                {slug: 'sabiduria-guia-claridad', nombre: 'Sabiduria', desc: 'Buscas respuestas', icono: '&#128302;', cat: 'sabiduria'}
            ];

            var catActual = data.catActual || '';
            var shopUrl = data.shopUrl || '/shop/';

            var html = '<div class="dsp-categorias-grandes"><div class="dsp-categorias-grid">';
            categorias.forEach(function(cat) {
                var url = cat.slug ? '/product-category/' + cat.slug + '/' : shopUrl;
                var isActive = (cat.slug === '' && !catActual) || catActual === cat.slug;
                html += '<a href="' + url + '" class="dsp-categoria-card' + (isActive ? ' active' : '') + '" data-cat="' + cat.cat + '">';
                html += '<span class="dsp-categoria-icono">' + cat.icono + '</span>';
                html += '<h3 class="dsp-categoria-titulo">' + cat.nombre + '</h3>';
                html += '<p class="dsp-categoria-desc">' + cat.desc + '</p>';
                html += '</a>';
            });
            html += '</div></div>';

            // Buscar el banner/hero "Encontrá tu guardián" e insertar después
            var bannerEncontrado = false;
            var allElements = document.querySelectorAll('h1, h2, .elementor-heading-title, [class*="title"], .elementor-section');
            allElements.forEach(function(el) {
                if (!bannerEncontrado && el.textContent && el.textContent.toUpperCase().includes('ENCONTR')) {
                    var parent = el.closest('.elementor-section') || el.closest('section') || el.parentNode;
                    if (parent && !parent.querySelector('.dsp-categorias-grandes')) {
                        parent.insertAdjacentHTML('afterend', html);
                        bannerEncontrado = true;
                    }
                }
            });

            // Fallback: insertar antes del wrapper de productos
            if (!bannerEncontrado) {
                var wrapper = document.querySelector('.dsp-wrapper');
                if (wrapper && wrapper.parentNode) {
                    wrapper.insertAdjacentHTML('beforebegin', html);
                }
            }
        }

        function injectBotonesConocerHistoria() {
            var products = document.querySelectorAll('.product, li.product, .wc-block-grid__product');
            products.forEach(function(product) {
                // Buscar el link del producto para obtener la URL
                var link = product.querySelector('a.woocommerce-LoopProduct-link, a[href*="/producto/"], a[href*="/product/"]');
                if (!link) return;
                var url = link.getAttribute('href');
                if (!url) return;

                // No duplicar botones
                if (product.querySelector('.btn-conocer-historia')) return;

                // Crear el botón
                var btn = document.createElement('a');
                btn.href = url;
                btn.className = 'btn-conocer-historia';
                btn.textContent = 'CONOCER HISTORIA';

                // Insertar al final del producto
                product.appendChild(btn);
            });
        }

        function createSidebar(data) {
            var sidebar = document.createElement('aside');
            sidebar.className = 'dsp-sidebar';

            var catActual = data.catActual || '';

            var html = '';
            html += '<div class="dsp-buscador">';
            html += '<input type="text" id="dsp-search" placeholder="Buscar guardian..." autocomplete="off">';
            html += '<svg class="dsp-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.35-4.35"></path></svg>';
            html += '</div>';

            html += '<div class="dsp-sorprendeme" onclick="window.location=\'/shop/?sorprendeme=1\'">';
            html += '<span class="dsp-sorprendeme-symbol">&#10022;</span>';
            html += '<h3>SORPRENDEME</h3>';
            html += '<p>Deja que tu energia decida. Tres guardianes van a aparecer por algo.</p>';
            html += '</div>';

            html += '<div class="dsp-test-box">';
            html += '<h4>NO SABES CUAL ELEGIR?</h4>';
            html += '<p>Tu guardian ya te eligio a vos. Solo falta que lo descubras.</p>';
            html += '<a href="/descubri-que-duende-te-elige/" class="dsp-test-link">Descubrir quien me espera</a>';
            html += '<span class="dsp-test-detail">5 preguntas - 2 minutos - Gratis</span>';
            html += '</div>';

            html += '<div class="dsp-filter-section">';
            html += '<h4>INTENCION</h4>';
            html += '<ul class="dsp-filter-list">';
            html += '<li><a href="/shop/" class="dsp-filter-item' + (!catActual ? ' active' : '') + '">Todos</a></li>';
            html += '<li><a href="/product-category/proteccion/" class="dsp-filter-item' + (catActual === 'proteccion' ? ' active' : '') + '">Proteccion</a></li>';
            html += '<li><a href="/product-category/amor/" class="dsp-filter-item' + (catActual === 'amor' ? ' active' : '') + '">Amor</a></li>';
            html += '<li><a href="/product-category/dinero-abundancia-negocios/" class="dsp-filter-item' + (catActual === 'dinero-abundancia-negocios' ? ' active' : '') + '">Abundancia</a></li>';
            html += '<li><a href="/product-category/salud/" class="dsp-filter-item' + (catActual === 'salud' ? ' active' : '') + '">Sanacion</a></li>';
            html += '<li><a href="/product-category/sabiduria-guia-claridad/" class="dsp-filter-item' + (catActual === 'sabiduria-guia-claridad' ? ' active' : '') + '">Sabiduria</a></li>';
            html += '</ul>';
            html += '</div>';

            html += '<div class="dsp-filter-section">';
            html += '<h4>TAMANO</h4>';
            html += '<ul class="dsp-filter-list">';
            html += '<li><a href="/shop/" class="dsp-filter-item">Todos</a></li>';
            html += '<li><a href="/product-category/mini/" class="dsp-filter-item">Mini <span class="dsp-precio">~$25</span></a></li>';
            html += '<li><a href="/product-category/pixie/" class="dsp-filter-item">Pixie <span class="dsp-precio">~$45</span></a></li>';
            html += '<li><a href="/product-category/mediano/" class="dsp-filter-item">Mediano <span class="dsp-precio">~$70</span></a></li>';
            html += '<li><a href="/product-category/grande/" class="dsp-filter-item">Grande <span class="dsp-precio">~$130</span></a></li>';
            html += '<li><a href="/product-category/gigante/" class="dsp-filter-item">Gigante <span class="dsp-precio">~$200+</span></a></li>';
            html += '</ul>';
            html += '</div>';

            sidebar.innerHTML = html;

            setTimeout(function() {
                var searchInput = document.getElementById('dsp-search');
                if (searchInput) {
                    searchInput.addEventListener('input', function() {
                        var query = this.value.toLowerCase().trim();
                        var products = document.querySelectorAll('.product, .elementor-widget-woocommerce-products .product, li.product');

                        products.forEach(function(product) {
                            var name = product.querySelector('.woocommerce-loop-product__title, .product-title, h2, h3');
                            var nameText = name ? name.textContent.toLowerCase() : '';

                            if (query === '' || nameText.includes(query)) {
                                product.style.display = '';
                            } else {
                                product.style.display = 'none';
                            }
                        });
                    });
                }
            }, 500);

            return sidebar;
        }

        function createHeader(data) {
            var header = document.createElement('div');
            header.className = 'dsp-header-wrap';

            var intenciones = [
                {slug: '', nombre: 'TODOS', sub: 'Ver todos'},
                {slug: 'proteccion', nombre: 'PROTECCION', sub: 'Escudo y amparo'},
                {slug: 'amor', nombre: 'AMOR', sub: 'Sanar y abrir'},
                {slug: 'dinero-abundancia-negocios', nombre: 'ABUNDANCIA', sub: 'Desbloquear el flujo'},
                {slug: 'salud', nombre: 'SANACION', sub: 'Soltar y renovar'},
                {slug: 'sabiduria-guia-claridad', nombre: 'SABIDURIA', sub: 'Claridad y guia'}
            ];

            var navItems = intenciones.map(function(i) {
                var isActive = (i.slug === '' && !data.catActual) || data.catActual === i.slug;
                var url = i.slug ? '/product-category/' + i.slug + '/' : '/shop/';
                return '<a href="' + url + '" class="dsp-nav-item' + (isActive ? ' active' : '') + '">' +
                    '<span class="dsp-nav-text">' + i.nombre + '</span>' +
                    '<span class="dsp-nav-sub">' + i.sub + '</span>' +
                '</a>';
            }).join('');

            var statsAdoptados = (data.stats && data.stats.adoptados) ? data.stats.adoptados : '15.000';
            var statsPaises = (data.stats && data.stats.paises) ? data.stats.paises : '28';

            var html = '';
            html += '<header class="dsp-header">';
            html += '<h1 class="dsp-title">TIENDA MAGICA</h1>';
            html += '<p class="dsp-subtitle">Que necesita tu alma hoy?</p>';
            html += '<div class="dsp-divider"></div>';
            html += '</header>';
            html += '<p class="dsp-social-proof">' + statsAdoptados + '+ guardianes ya encontraron su hogar en ' + statsPaises + ' paises</p>';
            html += '<nav class="dsp-nav-intencion">' + navItems + '</nav>';
            html += '<div class="dsp-filtros-tamano">';
            html += '<a href="/shop/" class="dsp-tamano-item">Todos</a>';
            html += '<a href="/shop/?tamano=mini" class="dsp-tamano-item">Mini <span class="dsp-tamano-cm">~8cm</span></a>';
            html += '<a href="/shop/?tamano=pixie" class="dsp-tamano-item">Pixie <span class="dsp-tamano-cm">~12cm</span></a>';
            html += '<a href="/shop/?tamano=mediano" class="dsp-tamano-item">Mediano <span class="dsp-tamano-cm">~20cm</span></a>';
            html += '<a href="/shop/?tamano=grande" class="dsp-tamano-item">Grande <span class="dsp-tamano-cm">~30cm</span></a>';
            html += '<a href="/shop/?tamano=gigante" class="dsp-tamano-item">Gigante <span class="dsp-tamano-cm">~45cm</span></a>';
            html += '</div>';

            header.innerHTML = html;
            return header;
        }
    })();
    </script>
    <?php
}, 99);

// Obtener stats
if (!function_exists('duendes_shop_premium_get_stats')) {
    function duendes_shop_premium_get_stats() {
        $cached = get_transient('duendes_shop_stats_v2');
        if ($cached) return $cached;

        $stats = array('adoptados' => '15.000', 'paises' => '28');

        $testimonios_page = get_page_by_path('testimonios');
        if ($testimonios_page) {
            $content = $testimonios_page->post_content;
            if (preg_match('/(\d[\d.,]+)\+?\s*(guardianes|adoptados)/i', $content, $m)) {
                $stats['adoptados'] = $m[1];
            }
            if (preg_match('/(\d+)\s*paises/i', $content, $m)) {
                $stats['paises'] = $m[1];
            }
        }

        set_transient('duendes_shop_stats_v2', $stats, HOUR_IN_SECONDS);
        return $stats;
    }
}

// CSS
if (!function_exists('duendes_shop_premium_get_css')) {
    function duendes_shop_premium_get_css() {
        return '
    @import url("https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400&display=swap");

    .duendes-shop-hero,
    .woocommerce-products-header { display: none !important; }

    .dsp-wrapper {
        display: flex;
        gap: 40px;
        max-width: 1400px;
        margin: 40px auto;
        padding: 0 20px;
    }

    .dsp-sidebar {
        width: 260px;
        flex-shrink: 0;
    }

    @media (max-width: 992px) {
        .dsp-wrapper { flex-direction: column; }
        .dsp-sidebar {
            width: 100%;
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 20px;
        }
    }

    .dsp-buscador {
        position: relative;
        margin-bottom: 25px;
    }

    .dsp-buscador input {
        width: 100%;
        padding: 14px 45px 14px 18px;
        background: rgba(255,255,255,0.03);
        border: 1px solid rgba(201,162,39,0.2);
        color: #fff;
        font-family: "Cormorant Garamond", serif;
        font-size: 15px;
        outline: none;
        transition: all 0.3s;
    }

    .dsp-buscador input::placeholder {
        color: rgba(255,255,255,0.4);
    }

    .dsp-buscador input:focus {
        border-color: rgba(201,162,39,0.5);
        background: rgba(255,255,255,0.05);
    }

    .dsp-search-icon {
        position: absolute;
        right: 15px;
        top: 50%;
        transform: translateY(-50%);
        width: 18px;
        height: 18px;
        color: rgba(201,162,39,0.5);
        pointer-events: none;
    }

    .dsp-sorprendeme {
        border: 1px solid rgba(201,162,39,0.07);
        padding: 25px 20px;
        text-align: center;
        cursor: pointer;
        transition: all 0.3s ease;
        margin-bottom: 25px;
        background: rgba(0,0,0,0.2);
    }

    .dsp-sorprendeme:hover {
        border-color: rgba(201,162,39,0.25);
        background: rgba(201,162,39,0.05);
    }

    .dsp-sorprendeme-symbol {
        display: block;
        font-size: 32px;
        color: #C9A227;
        margin-bottom: 15px;
        animation: dsp-breathe 3s ease-in-out infinite;
    }

    @keyframes dsp-breathe {
        0%, 100% { opacity: 0.5; transform: scale(1); }
        50% { opacity: 1; transform: scale(1.15); }
    }

    .dsp-sorprendeme h3 {
        font-family: "Cinzel", serif;
        font-size: 13px;
        letter-spacing: 4px;
        color: #C9A227;
        margin: 0 0 12px 0;
    }

    .dsp-sorprendeme p {
        font-family: "Cormorant Garamond", serif;
        font-size: 15px;
        font-style: italic;
        color: rgba(255,255,255,0.6);
        margin: 0;
        line-height: 1.6;
    }

    .dsp-test-box {
        padding: 20px;
        margin-bottom: 25px;
        border-left: 2px solid rgba(201,162,39,0.3);
        background: rgba(0,0,0,0.15);
    }

    .dsp-test-box h4 {
        font-family: "Cinzel", serif;
        font-size: 11px;
        letter-spacing: 2px;
        color: rgba(255,255,255,0.85);
        margin: 0 0 10px 0;
    }

    .dsp-test-box p {
        font-family: "Cormorant Garamond", serif;
        font-size: 14px;
        font-style: italic;
        color: rgba(255,255,255,0.5);
        margin: 0 0 15px 0;
        line-height: 1.5;
    }

    .dsp-test-link {
        display: block;
        font-family: "Cormorant Garamond", serif;
        font-size: 15px;
        color: #C9A227;
        text-decoration: none;
        margin-bottom: 8px;
    }

    .dsp-test-link:hover { text-decoration: underline; }

    .dsp-test-detail {
        font-size: 11px;
        color: rgba(255,255,255,0.4);
        display: block;
    }

    .dsp-filter-section {
        margin-bottom: 25px;
        padding: 15px;
        background: rgba(0,0,0,0.1);
    }

    .dsp-filter-section h4 {
        font-family: "Cinzel", serif;
        font-size: 10px;
        letter-spacing: 2px;
        color: rgba(255,255,255,0.5);
        margin: 0 0 15px 0;
        padding-bottom: 10px;
        border-bottom: 1px solid rgba(255,255,255,0.1);
    }

    .dsp-filter-list {
        list-style: none;
        padding: 0;
        margin: 0;
    }

    .dsp-filter-list li { margin-bottom: 10px; }

    .dsp-filter-item {
        font-family: "Cormorant Garamond", serif;
        font-size: 15px;
        color: rgba(255,255,255,0.6);
        text-decoration: none;
        display: flex;
        justify-content: space-between;
        transition: color 0.2s;
    }

    .dsp-filter-item:hover { color: #C9A227; }
    .dsp-filter-item.active { color: #C9A227 !important; font-weight: 600; }
    .dsp-precio { color: #C9A227 !important; font-size: 13px; }

    .dsp-main { flex: 1; min-width: 0; }
    .dsp-header-wrap { margin-bottom: 30px; }

    .dsp-header { text-align: center; margin-bottom: 25px; }

    .dsp-title {
        font-family: "Cinzel", serif;
        font-size: clamp(26px, 5vw, 40px);
        letter-spacing: 10px;
        color: rgba(255,255,255,0.75);
        margin: 0 0 15px 0;
        font-weight: 400;
    }

    .dsp-subtitle {
        font-family: "Cormorant Garamond", serif;
        font-size: clamp(18px, 4vw, 26px);
        font-style: italic;
        color: rgba(255,255,255,0.45);
        margin: 0 0 20px 0;
    }

    .dsp-divider {
        width: 50px;
        height: 1px;
        background: rgba(201,162,39,0.4);
        margin: 0 auto;
    }

    .dsp-social-proof {
        text-align: center;
        font-family: "Cormorant Garamond", serif;
        font-size: 14px;
        color: rgba(255,255,255,0.4);
        margin: 0 0 25px 0;
    }

    .dsp-nav-intencion {
        display: flex;
        justify-content: center;
        flex-wrap: wrap;
        gap: 0;
        border-top: 1px solid rgba(255,255,255,0.1);
        border-bottom: 1px solid rgba(255,255,255,0.1);
        margin-bottom: 20px;
    }

    .dsp-nav-item {
        padding: 18px 20px;
        text-decoration: none;
        text-align: center;
        position: relative;
        transition: all 0.3s;
    }

    .dsp-nav-text {
        display: block;
        font-family: "Cinzel", serif;
        font-size: 10px;
        letter-spacing: 2px;
        color: rgba(255,255,255,0.55);
        transition: color 0.3s;
    }

    .dsp-nav-sub {
        display: block;
        font-family: "Cormorant Garamond", serif;
        font-size: 11px;
        font-style: italic;
        color: transparent;
        margin-top: 4px;
        transition: color 0.3s;
    }

    .dsp-nav-item:hover .dsp-nav-sub { color: rgba(255,255,255,0.35); }
    .dsp-nav-item:hover .dsp-nav-text,
    .dsp-nav-item.active .dsp-nav-text { color: #C9A227; }
    .dsp-nav-item.active .dsp-nav-sub { color: rgba(255,255,255,0.35); }

    .dsp-nav-item.active::after {
        content: "";
        position: absolute;
        bottom: -1px;
        left: 20px;
        right: 20px;
        height: 1px;
        background: #C9A227;
    }

    .dsp-filtros-tamano {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 25px;
        flex-wrap: wrap;
        margin-bottom: 30px;
    }

    .dsp-tamano-item {
        font-family: "Cinzel", serif;
        font-size: 10px;
        letter-spacing: 1px;
        color: rgba(255,255,255,0.5);
        text-decoration: none;
        text-transform: uppercase;
        transition: color 0.2s;
    }

    .dsp-tamano-item:hover { color: #C9A227; }

    .dsp-tamano-cm {
        font-family: "Cormorant Garamond", serif;
        font-size: 10px;
        color: rgba(255,255,255,0.3);
        margin-left: 5px;
    }

    .elementor-widget-woocommerce-products ul.products,
    ul.products {
        display: grid !important;
        grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)) !important;
        gap: 25px !important;
    }

    ul.products li.product {
        margin: 0 !important;
        padding: 0 !important;
    }

    ul.products li.product a img {
        aspect-ratio: 3/4;
        object-fit: cover;
        transition: transform 0.4s ease;
    }

    ul.products li.product:hover a img {
        transform: scale(1.03);
    }

    ul.products li.product {
        text-align: center !important;
    }

    ul.products li.product .woocommerce-loop-product__title {
        font-family: "Cinzel", serif !important;
        font-size: 15px !important;
        color: #fff !important;
        margin: 12px 0 6px 0 !important;
        text-align: center !important;
    }

    ul.products li.product .price {
        font-family: "Cormorant Garamond", serif !important;
        font-size: 14px !important;
        color: rgba(255,255,255,0.6) !important;
        text-align: center !important;
        display: block !important;
    }

    ul.products li.product .button,
    .woocommerce-result-count,
    .woocommerce-ordering { display: none !important; }

    /* Botón CONOCER HISTORIA */
    .btn-conocer-historia {
        display: block !important;
        margin: 15px auto 0 auto !important;
        padding: 14px 28px !important;
        background: #0a0a0a !important;
        color: #fff !important;
        font-family: "Cinzel", serif !important;
        font-size: 12px !important;
        font-weight: 500 !important;
        letter-spacing: 2px !important;
        text-transform: uppercase !important;
        text-decoration: none !important;
        border: 1px solid rgba(255,255,255,0.15) !important;
        border-radius: 6px !important;
        cursor: pointer !important;
        transition: all 0.3s ease !important;
        text-align: center !important;
        max-width: 200px !important;
    }

    .btn-conocer-historia:hover {
        background: #1a1a1a !important;
        border-color: #C9A227 !important;
        color: #C9A227 !important;
        box-shadow: 0 8px 25px rgba(0,0,0,0.3) !important;
        transform: translateY(-2px) !important;
    }

    /* Sección de Categorías Grande */
    .dsp-categorias-grandes {
        background: linear-gradient(180deg, #1a1510 0%, #0a0a0a 100%) !important;
        padding: 50px 20px 60px !important;
        margin-bottom: 0 !important;
    }

    .dsp-categorias-grid {
        display: grid !important;
        grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)) !important;
        gap: 20px !important;
        max-width: 1100px !important;
        margin: 0 auto !important;
    }

    .dsp-categoria-card {
        background: #0a0a0a !important;
        border: 1px solid rgba(198,169,98,0.2) !important;
        border-radius: 14px !important;
        padding: 35px 25px !important;
        text-align: center !important;
        cursor: pointer !important;
        transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1) !important;
        text-decoration: none !important;
        display: block !important;
    }

    .dsp-categoria-card:hover {
        transform: translateY(-8px) !important;
        border-color: var(--cat-color, #C9A227) !important;
        box-shadow: 0 20px 50px rgba(0,0,0,0.4), 0 0 30px var(--cat-glow, rgba(198,169,98,0.2)) !important;
    }

    .dsp-categoria-card.active {
        border-color: var(--cat-color, #C9A227) !important;
        box-shadow: 0 0 30px var(--cat-glow, rgba(198,169,98,0.3)) !important;
        background: linear-gradient(145deg, #1a1a1a 0%, #0a0a0a 100%) !important;
    }

    .dsp-categoria-card[data-cat="proteccion"] { --cat-color: #3b82f6; --cat-glow: rgba(59, 130, 246, 0.4); }
    .dsp-categoria-card[data-cat="amor"] { --cat-color: #ec4899; --cat-glow: rgba(236, 72, 153, 0.4); }
    .dsp-categoria-card[data-cat="abundancia"] { --cat-color: #f59e0b; --cat-glow: rgba(245, 158, 11, 0.4); }
    .dsp-categoria-card[data-cat="salud"] { --cat-color: #22c55e; --cat-glow: rgba(34, 197, 94, 0.4); }
    .dsp-categoria-card[data-cat="sabiduria"] { --cat-color: #8b5cf6; --cat-glow: rgba(139, 92, 246, 0.4); }

    .dsp-categoria-icono {
        font-size: 42px !important;
        margin-bottom: 14px !important;
        display: block !important;
        filter: drop-shadow(0 0 12px var(--cat-glow, rgba(198,169,98,0.5))) !important;
        transition: transform 0.4s !important;
    }

    .dsp-categoria-card:hover .dsp-categoria-icono {
        transform: scale(1.15) !important;
    }

    .dsp-categoria-titulo {
        font-family: "Cinzel", serif !important;
        font-size: 18px !important;
        color: #fff !important;
        letter-spacing: 2px !important;
        text-transform: uppercase !important;
        margin: 0 0 6px 0 !important;
        transition: color 0.3s !important;
    }

    .dsp-categoria-card:hover .dsp-categoria-titulo,
    .dsp-categoria-card.active .dsp-categoria-titulo {
        color: var(--cat-color, #C9A227) !important;
    }

    .dsp-categoria-desc {
        font-family: "Cormorant Garamond", serif !important;
        font-size: 14px !important;
        color: rgba(255,255,255,0.5) !important;
        font-style: italic !important;
        margin: 0 !important;
    }

    @media (max-width: 768px) {
        .dsp-categorias-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 12px !important;
        }
        .dsp-categoria-card {
            padding: 22px 15px !important;
        }
        .dsp-categoria-icono {
            font-size: 32px !important;
        }
        .dsp-categoria-titulo {
            font-size: 13px !important;
            letter-spacing: 1px !important;
        }
        .dsp-categoria-desc {
            font-size: 11px !important;
        }
        .btn-conocer-historia {
            padding: 12px 20px !important;
            font-size: 10px !important;
            max-width: 160px !important;
        }
    }
    ';
    }
}
