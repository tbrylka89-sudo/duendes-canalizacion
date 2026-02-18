<?php
/**
 * Plugin Name: Duendes Shop Magic v4
 * Description: Tienda completa estilo tarot con cards doradas, niebla de bosque, toast social proof
 * Version: 4.0
 * Author: Claude Code
 */

if (!defined('ABSPATH')) exit;

// ════════════════════════════════════════════════════════════════════════════
// ESTILOS GLOBALES - BOTONES DORADOS EN TODO EL SITIO
// ════════════════════════════════════════════════════════════════════════════
add_action('wp_head', function() {
    ?>
    <style id="duendes-global-buttons">
    /* NUCLEAR OVERRIDE - máxima especificidad */
    html body .elementor-button.elementor-size-md,
    html body .elementor-button.elementor-size-sm,
    html body .elementor-button.elementor-size-lg,
    html body .elementor-button.elementor-size-xl,
    html body a.elementor-button,
    html body .elementor-widget-button .elementor-button,
    html body .elementor a.elementor-button {
        background: #B8973A !important;
        background-color: #B8973A !important;
        background-image: none !important;
        color: #070906 !important;
        border: none !important;
        border-color: #B8973A !important;
    }
    html body .elementor-button.elementor-size-md:hover,
    html body .elementor-button.elementor-size-sm:hover,
    html body .elementor-button.elementor-size-lg:hover,
    html body a.elementor-button:hover,
    html body .elementor-widget-button .elementor-button:hover {
        background: #ffffff !important;
        background-color: #ffffff !important;
        color: #070906 !important;
    }
    html body .elementor-button .elementor-button-text,
    html body .elementor-button span,
    html body .elementor-button .elementor-button-content-wrapper {
        color: inherit !important;
    }
    /* Hero overlay más claro */
    .elementor-background-overlay {
        opacity: 0.25 !important;
        background-color: rgba(0,0,0,0.25) !important;
    }
    </style>
    <style id="duendes-global-buttons-extra">
    /* ═══ BOTONES GLOBALES - Solo dorado #B8973A, negro #070906 y blanco ═══ */

    /* Botón primario - fondo dorado, texto negro */
    .elementor-button,
    .elementor-widget-button .elementor-button,
    .e-button,
    button.elementor-button,
    a.elementor-button,
    .wp-block-button__link,
    .woocommerce a.button,
    .woocommerce button.button,
    .woocommerce input.button,
    .woocommerce .button,
    input[type="submit"],
    .btn-primary,
    .button-primary {
        background: #B8973A !important;
        background-color: #B8973A !important;
        color: #070906 !important;
        border: none !important;
        border-color: #B8973A !important;
    }

    /* Hover de botón primario - fondo blanco, texto negro */
    .elementor-button:hover,
    .elementor-widget-button .elementor-button:hover,
    .e-button:hover,
    button.elementor-button:hover,
    a.elementor-button:hover,
    .wp-block-button__link:hover,
    .woocommerce a.button:hover,
    .woocommerce button.button:hover,
    .woocommerce input.button:hover,
    .woocommerce .button:hover,
    input[type="submit"]:hover,
    .btn-primary:hover,
    .button-primary:hover {
        background: #fff !important;
        background-color: #fff !important;
        color: #070906 !important;
    }

    /* Botón secundario/outline - transparente con borde dorado */
    .elementor-button.e-btn-outline,
    .elementor-button[class*="outline"],
    .btn-outline,
    .btn-secondary,
    .button-outline,
    .button-secondary,
    a.elementor-button[style*="background-color: transparent"],
    a.elementor-button[style*="background: transparent"] {
        background: transparent !important;
        background-color: transparent !important;
        border: 1px solid rgba(184,151,58,0.35) !important;
        color: #B8973A !important;
    }

    .elementor-button.e-btn-outline:hover,
    .elementor-button[class*="outline"]:hover,
    .btn-outline:hover,
    .btn-secondary:hover,
    .button-outline:hover,
    .button-secondary:hover {
        background: #fff !important;
        background-color: #fff !important;
        color: #070906 !important;
        border-color: #fff !important;
    }

    /* Eliminar cualquier verde del theme */
    .elementor-button[style*="background-color: #5"],
    .elementor-button[style*="background: #5"],
    .elementor-button[style*="green"],
    [class*="success"],
    .bg-success {
        background: #B8973A !important;
        background-color: #B8973A !important;
    }

    /* Asegurar texto de botones sea correcto */
    .elementor-button .elementor-button-text,
    .elementor-button span {
        color: inherit !important;
    }

    /* ═══ HERO DE HOME - Hacer imagen más visible ═══ */
    .elementor-section .elementor-background-overlay {
        opacity: 0.35 !important;
        background-color: rgba(0,0,0,0.35) !important;
    }
    </style>
    <?php
}, 9999);

// JavaScript NUCLEAR para forzar colores dorados
add_action('wp_footer', function() {
    ?>
    <script id="duendes-gold-nuclear">
    (function(){
        'use strict';
        console.log('[DUENDES GOLD v2.0] Iniciando...');

        var GOLD = '#B8973A';
        var BLACK = '#070906';
        var WHITE = '#ffffff';

        // 1. INYECTAR CSS VIA JAVASCRIPT (máxima prioridad)
        var styleEl = document.createElement('style');
        styleEl.id = 'duendes-gold-injected';
        styleEl.textContent = [
            '/* INYECTADO POR JS - PRIORIDAD MÁXIMA */',
            '.elementor-button,',
            '.elementor-widget-button .elementor-button,',
            'a.elementor-button,',
            'a.elementor-button-link,',
            '[class*="elementor-button"],',
            '.e-button {',
            '  background: ' + GOLD + ' !important;',
            '  background-color: ' + GOLD + ' !important;',
            '  background-image: none !important;',
            '  color: ' + BLACK + ' !important;',
            '  border: none !important;',
            '}',
            '.elementor-button:hover,',
            'a.elementor-button:hover,',
            '[class*="elementor-button"]:hover {',
            '  background: ' + WHITE + ' !important;',
            '  background-color: ' + WHITE + ' !important;',
            '  color: ' + BLACK + ' !important;',
            '}',
            '.elementor-button span,',
            '.elementor-button .elementor-button-text,',
            '[class*="elementor-button"] span {',
            '  color: inherit !important;',
            '}',
            '.elementor-background-overlay {',
            '  opacity: 0.2 !important;',
            '}'
        ].join('\n');
        document.head.appendChild(styleEl);
        console.log('[DUENDES GOLD v2.0] CSS inyectado');

        // 2. FUNCIÓN PARA FORZAR GOLD EN ELEMENTOS
        function forceGold(el) {
            if (!el || !el.style) return;
            el.style.cssText = 'background: ' + GOLD + ' !important; background-color: ' + GOLD + ' !important; background-image: none !important; color: ' + BLACK + ' !important; border: none !important;';
        }

        function forceGoldChild(el) {
            if (!el || !el.style) return;
            el.style.cssText = 'color: ' + BLACK + ' !important; background: transparent !important;';
        }

        // 3. BUSCAR Y ARREGLAR TODOS LOS BOTONES
        function fixAll() {
            var count = 0;

            // Por clase elementor-button
            document.querySelectorAll('.elementor-button, a.elementor-button, [class*="elementor-button"]').forEach(function(btn) {
                forceGold(btn);
                btn.querySelectorAll('span, .elementor-button-text, .elementor-button-content-wrapper').forEach(forceGoldChild);
                count++;
            });

            // Por href (CTAs de la home)
            document.querySelectorAll('a[href*="shop"], a[href*="descubri"], a[href*="guardian"], a[href*="tienda"]').forEach(function(btn) {
                if (btn.className && btn.className.indexOf('elementor') > -1) {
                    forceGold(btn);
                    btn.querySelectorAll('span').forEach(forceGoldChild);
                    count++;
                }
            });

            // Por texto (VER GUARDIANES, DESCUBRI, etc)
            document.querySelectorAll('a, button').forEach(function(el) {
                var txt = (el.textContent || '').toUpperCase();
                if (txt.indexOf('GUARDIAN') > -1 || txt.indexOf('DESCUBR') > -1 || txt.indexOf('VER ') === 0 || txt.indexOf('EXPLORAR') > -1) {
                    if (el.offsetWidth > 50) { // Solo si parece un botón (tiene ancho)
                        forceGold(el);
                        el.querySelectorAll('*').forEach(forceGoldChild);
                        count++;
                    }
                }
            });

            // Overlays del hero
            document.querySelectorAll('.elementor-background-overlay, [class*="background-overlay"]').forEach(function(o) {
                o.style.cssText = 'opacity: 0.2 !important;';
            });

            if (count > 0) console.log('[DUENDES GOLD v2.0] Botones arreglados: ' + count);
        }

        // 4. OBSERVER AGRESIVO
        var observer = new MutationObserver(function(mutations) {
            var needsFix = false;
            mutations.forEach(function(m) {
                // Cualquier cambio en style o class
                if (m.type === 'attributes') {
                    var el = m.target;
                    if (el.className && typeof el.className === 'string') {
                        if (el.className.indexOf('elementor-button') > -1) {
                            forceGold(el);
                            needsFix = true;
                        }
                        if (el.className.indexOf('background-overlay') > -1) {
                            el.style.cssText = 'opacity: 0.2 !important;';
                        }
                    }
                }
                // Nodos nuevos agregados
                if (m.addedNodes && m.addedNodes.length) {
                    needsFix = true;
                }
            });
            if (needsFix) {
                requestAnimationFrame(fixAll);
            }
        });

        observer.observe(document.documentElement, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['style', 'class']
        });

        // 5. EJECUTAR MÚLTIPLES VECES
        fixAll();

        document.addEventListener('DOMContentLoaded', fixAll);
        window.addEventListener('load', function() {
            fixAll();
            setTimeout(fixAll, 50);
            setTimeout(fixAll, 150);
            setTimeout(fixAll, 300);
            setTimeout(fixAll, 600);
            setTimeout(fixAll, 1000);
            setTimeout(fixAll, 1500);
            setTimeout(fixAll, 2500);
            setTimeout(fixAll, 4000);
        });

        // 6. CADA 2 SEGUNDOS COMO RESPALDO
        setInterval(fixAll, 2000);

        // 7. EN SCROLL Y RESIZE (por si Elementor hace algo)
        var scrollTimeout;
        window.addEventListener('scroll', function() {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(fixAll, 100);
        }, { passive: true });

        window.addEventListener('resize', function() {
            setTimeout(fixAll, 100);
        });

        console.log('[DUENDES GOLD v2.0] Listo');
    })();
    </script>
    <?php
}, 999999);

// ════════════════════════════════════════════════════════════════════════════
// INTERCEPTAR PÁGINA DE SHOP COMPLETAMENTE
// ════════════════════════════════════════════════════════════════════════════
add_action('template_redirect', function() {
    if (!is_shop()) return;

    // Renderizar nuestra página custom
    duendes_shop_magic_render();
    exit;
});

// ════════════════════════════════════════════════════════════════════════════
// OBTENER PRODUCTOS POR CATEGORÍA DE TAMAÑO
// ════════════════════════════════════════════════════════════════════════════
function duendes_shop_magic_get_products_by_size($size_category, $limit = -1) {
    // Mapeo de categorías de tamaño a slugs de WooCommerce
    $size_slugs = [
        'mini-clasicos' => ['mini', 'mini-clasico', 'mini-clasicos'],
        'mini-especiales' => ['mini-especial', 'mini-especiales'],
        'pixie' => ['pixie', 'pixies'],
        'medianos' => ['mediano', 'medianos'],
        'grandes' => ['grande', 'grandes'],
        'gigantes' => ['gigante', 'gigantes']
    ];

    $slugs = $size_slugs[$size_category] ?? [$size_category];

    // Buscar términos que coincidan
    $term_ids = [];
    foreach ($slugs as $slug) {
        $term = get_term_by('slug', $slug, 'product_cat');
        if ($term) {
            $term_ids[] = $term->term_id;
        }
    }

    if (empty($term_ids)) {
        // Si no hay categoría específica, buscar por precio
        return duendes_shop_magic_get_products_by_price($size_category, $limit);
    }

    $args = [
        'post_type' => 'product',
        'posts_per_page' => $limit,
        'post_status' => 'publish',
        'tax_query' => [
            [
                'taxonomy' => 'product_cat',
                'field' => 'term_id',
                'terms' => $term_ids,
                'operator' => 'IN'
            ]
        ],
        'meta_query' => [
            [
                'key' => '_stock_status',
                'value' => 'instock',
                'compare' => '='
            ]
        ],
        'orderby' => 'date',
        'order' => 'DESC'
    ];

    return new WP_Query($args);
}

function duendes_shop_magic_get_products_by_price($size_category, $limit = -1) {
    // Precios por categoría en USD
    $price_ranges = [
        'mini-clasicos' => [60, 80],
        'mini-especiales' => [140, 160],
        'pixie' => [140, 160],
        'medianos' => [190, 210],
        'grandes' => [440, 460],
        'gigantes' => [1000, 1100]
    ];

    $range = $price_ranges[$size_category] ?? [0, 9999];

    $args = [
        'post_type' => 'product',
        'posts_per_page' => $limit,
        'post_status' => 'publish',
        'meta_query' => [
            'relation' => 'AND',
            [
                'key' => '_price',
                'value' => $range,
                'type' => 'NUMERIC',
                'compare' => 'BETWEEN'
            ],
            [
                'key' => '_stock_status',
                'value' => 'instock',
                'compare' => '='
            ]
        ],
        'orderby' => 'date',
        'order' => 'DESC'
    ];

    return new WP_Query($args);
}

// ════════════════════════════════════════════════════════════════════════════
// DETECTAR SI UN PRODUCTO ES NUEVO (últimos 14 días)
// ════════════════════════════════════════════════════════════════════════════
function duendes_shop_magic_is_new($product_id) {
    $post_date = get_the_date('U', $product_id);
    $days_ago = (time() - $post_date) / DAY_IN_SECONDS;
    return $days_ago <= 14;
}

// ════════════════════════════════════════════════════════════════════════════
// OBTENER CATEGORÍA DE INTENCIÓN (protección, amor, etc.)
// ════════════════════════════════════════════════════════════════════════════
function duendes_shop_magic_get_intention($product_id) {
    $intention_slugs = [
        'proteccion' => ['proteccion', 'protection'],
        'amor' => ['amor', 'love'],
        'abundancia' => ['dinero-abundancia-negocios', 'abundancia', 'abundance', 'dinero'],
        'sanacion' => ['salud', 'sanacion', 'healing'],
        'sabiduria' => ['sabiduria-guia-claridad', 'sabiduria', 'wisdom']
    ];

    $terms = wp_get_post_terms($product_id, 'product_cat', ['fields' => 'slugs']);

    foreach ($intention_slugs as $intention => $slugs) {
        foreach ($slugs as $slug) {
            if (in_array($slug, $terms)) {
                return $intention;
            }
        }
    }

    return 'sabiduria'; // Default
}

function duendes_shop_magic_get_intention_icon($intention) {
    $icons = [
        'proteccion' => '🛡️',
        'amor' => '💜',
        'abundancia' => '✨',
        'sanacion' => '🌿',
        'sabiduria' => '🔮'
    ];
    return $icons[$intention] ?? '✨';
}

// ════════════════════════════════════════════════════════════════════════════
// RENDERIZAR LA TIENDA COMPLETA
// ════════════════════════════════════════════════════════════════════════════
function duendes_shop_magic_render() {
    // Obtener productos por categoría
    $mini_clasicos = duendes_shop_magic_get_products_by_size('mini-clasicos');
    $mini_especiales = duendes_shop_magic_get_products_by_size('mini-especiales');
    $pixies = duendes_shop_magic_get_products_by_size('pixie');
    $medianos = duendes_shop_magic_get_products_by_size('medianos');
    $grandes = duendes_shop_magic_get_products_by_size('grandes');
    $gigantes = duendes_shop_magic_get_products_by_size('gigantes');

    // Contar disponibles
    $count_mini_clasicos = $mini_clasicos->found_posts;
    $count_mini_especiales = $mini_especiales->found_posts;
    $count_pixies = $pixies->found_posts;
    $count_medianos = $medianos->found_posts;
    $count_grandes = $grandes->found_posts;
    $count_gigantes = $gigantes->found_posts;
    // Agregar clase al body
    add_filter('body_class', function($classes) {
        $classes[] = 'duendes-shop-magic';
        return $classes;
    });

    // Header de WordPress (incluye DOCTYPE, html, head, body y el menú)
    get_header();
    ?>

<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&family=Cinzel+Decorative:wght@400;700&family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&display=swap" rel="stylesheet">

<style>
<?php echo duendes_shop_magic_get_css(); ?>
</style>

<div class="shop-wrapper">

<canvas id="particles"></canvas>
<div id="cursor-glow"></div>

<!-- ANNOUNCEMENT BAR -->
<div class="ann"><div class="ann-track">
    <span class="ann-item">CADA GUARDIÁN ES ÚNICO — CUANDO SE ADOPTA, DESAPARECE PARA SIEMPRE</span>
    <span class="ann-item">ENVÍO A TODO EL MUNDO · MENSAJE CANALIZADO INCLUIDO</span>
    <span class="ann-item">MÁS DE 15,000 GUARDIANES ADOPTADOS EN 10 AÑOS</span>
    <span class="ann-item">CADA GUARDIÁN ES ÚNICO — CUANDO SE ADOPTA, DESAPARECE PARA SIEMPRE</span>
    <span class="ann-item">ENVÍO A TODO EL MUNDO · MENSAJE CANALIZADO INCLUIDO</span>
    <span class="ann-item">MÁS DE 15,000 GUARDIANES ADOPTADOS EN 10 AÑOS</span>
</div></div>

<!-- HERO -->
<section class="hero">
    <div class="hero-bg"></div><div class="hero-vig"></div>
    <div class="hero-ring"></div><div class="hero-ring"></div>
    <div class="hero-c">
        <div class="hero-rune">⟡</div>
        <h1>NO LO ELEGÍS VOS.<br><em>ÉL TE ELIGE A VOS.</em></h1>
        <p class="hero-sub">Guardianes únicos, hechos a mano en Piriápolis.<br>Cada uno existe una sola vez.</p>
    </div>
    <div class="hero-scroll">EXPLORAR</div>
</section>

<!-- GUARANTEE STRIP -->
<div class="gstrip">
    <div class="gs"><span class="gs-i">🌎</span><span class="gs-t">Envío mundial</span></div>
    <div class="gs"><span class="gs-i">📜</span><span class="gs-t">Mensaje canalizado incluido</span></div>
    <div class="gs"><span class="gs-i">🔒</span><span class="gs-t">Pago seguro</span></div>
    <div class="gs"><span class="gs-i">✋</span><span class="gs-t">Hecho a mano</span></div>
    <div class="gs"><span class="gs-i">✨</span><span class="gs-t">Pieza única e irrepetible</span></div>
</div>

<!-- FILTER BAR -->
<div class="fbar" id="fbar">
    <div class="fbar-in">
        <button class="fpill on" data-f="all"><span class="em">✦</span>TODOS</button>
        <button class="fpill" data-f="proteccion"><span class="em">🛡️</span>PROTECCIÓN</button>
        <button class="fpill" data-f="amor"><span class="em">💜</span>AMOR</button>
        <button class="fpill" data-f="abundancia"><span class="em">✨</span>ABUNDANCIA</button>
        <button class="fpill" data-f="sanacion"><span class="em">🌿</span>SANACIÓN</button>
        <button class="fpill" data-f="sabiduria"><span class="em">🔮</span>SABIDURÍA</button>
        <div class="srch-box">
            <label class="srch-label" for="srch">🔍 BUSCAR GUARDIÁN</label>
            <input type="text" class="srch" placeholder="Escribí un nombre..." id="srch">
        </div>
        <div class="live"><span class="live-dot"></span><span id="vc"><?php echo rand(14, 29); ?> explorando ahora</span></div>
    </div>
</div>

<main class="shop">

<!-- ═══ MINI CLÁSICOS — $70 USD ═══ -->
<?php if ($count_mini_clasicos > 0): ?>
<div class="sec-div reveal" data-section="mini-clasicos">
    <div class="sec-fog"></div><div class="sec-vine-l"></div><div class="sec-vine-r"></div>
    <div class="sd-line"></div>
    <div class="sd-rune">✦</div>
    <h2 class="sd-title">MINI <em>CLÁSICOS</em></h2>
    <p class="sd-flavor">Caben en tu bolsillo, en tu mesa de luz, en tu mochila.<br>Pasan desapercibidos para todos — menos para vos. Siempre cerca, siempre protegiendo.</p>
    <div class="sd-price">$70 USD</div>
    <div class="sd-count"><?php echo $count_mini_clasicos; ?> DISPONIBLES</div>
</div>
<div class="grid">
    <?php
    while ($mini_clasicos->have_posts()): $mini_clasicos->the_post();
        global $product;
        duendes_shop_magic_render_card($product, 'MINI');
    endwhile;
    wp_reset_postdata();
    ?>
</div>
<?php endif; ?>

<!-- ═══ MINI ESPECIALES — $150 USD ═══ -->
<?php if ($count_mini_especiales > 0): ?>
<div class="sec-div reveal" data-section="mini-especiales">
    <div class="sec-fog"></div><div class="sec-vine-l"></div><div class="sec-vine-r"></div>
    <div class="sd-line"></div>
    <div class="sd-rune">✧</div>
    <h2 class="sd-title">MINI <em>ESPECIALES</em></h2>
    <p class="sd-flavor">Pequeños en tamaño, inmensos en poder. Guardianes raros que concentran una energía antigua en un cuerpo diminuto. No aparecen seguido — cuando los ves, ya te están hablando.</p>
    <div class="sd-price">$150 USD</div>
    <div class="sd-count"><?php echo $count_mini_especiales; ?> DISPONIBLES</div>
</div>
<div class="grid">
    <?php
    while ($mini_especiales->have_posts()): $mini_especiales->the_post();
        global $product;
        duendes_shop_magic_render_card($product, 'MINI ESPECIAL');
    endwhile;
    wp_reset_postdata();
    ?>
</div>
<?php endif; ?>

<!-- TESTIMONIAL 1 -->
<div class="testi reveal">
    <div class="t-stars">★ ★ ★ ★ ★</div>
    <p class="t-q">"Cuando lo vi, lo sentí. No sé cómo explicarlo, pero sabía que era mío. Llegó con un mensaje que me hizo llorar."</p>
    <div class="t-a">María L. — Buenos Aires · <em>adoptó a su guardián</em></div>
</div>

<!-- ═══ PIXIE — $150 USD ═══ -->
<?php if ($count_pixies > 0): ?>
<div class="sec-div reveal" data-section="pixie">
    <div class="sec-fog"></div><div class="sec-vine-l"></div><div class="sec-vine-r"></div>
    <div class="sd-line"></div>
    <div class="sd-rune">❋</div>
    <h2 class="sd-title">PIXIE <em>ENCANTADOS</em></h2>
    <p class="sd-flavor">Juguetones, traviesos, con aroma a musgo y risa de arroyo. Los Pixie eligen a personas que necesitan recordar que la magia está en las cosas simples. Donde ellos están, las cosas empiezan a fluir.</p>
    <div class="sd-price">$150 USD</div>
    <div class="sd-count"><?php echo $count_pixies; ?> DISPONIBLES</div>
</div>
<div class="grid">
    <?php
    while ($pixies->have_posts()): $pixies->the_post();
        global $product;
        duendes_shop_magic_render_card($product, 'PIXIE');
    endwhile;
    wp_reset_postdata();
    ?>
</div>
<?php endif; ?>

<!-- INTERLUDE - TEST -->
<div class="inter reveal">
    <div class="inter-rune">⟡</div>
    <h2>¿NO SABÉS CUÁL ES EL TUYO?</h2>
    <p>Hacé el Test del Guardián y descubrí cuál fue canalizado para vos.</p>
    <a href="/descubri-que-duende-te-elige/" class="inter-btn">DESCUBRÍ CUÁL TE ELIGE</a>
</div>

<!-- ═══ MEDIANOS — $200 USD ═══ -->
<?php if ($count_medianos > 0): ?>
<div class="sec-div reveal" data-section="medianos">
    <div class="sec-fog"></div><div class="sec-vine-l"></div><div class="sec-vine-r"></div>
    <div class="sd-line"></div>
    <div class="sd-rune">◆</div>
    <h2 class="sd-title">MEDIANOS <em>GUARDIANES</em></h2>
    <p class="sd-flavor">El tamaño que más se elige. Lo suficientemente grande para sentir su presencia en la habitación, lo suficientemente íntimo para que sea solo tuyo. Cada uno llega con un mensaje canalizado que solo tiene sentido para quien lo recibe.</p>
    <div class="sd-price">$200 USD</div>
    <div class="sd-count"><?php echo $count_medianos; ?> DISPONIBLES</div>
</div>
<div class="grid">
    <?php
    while ($medianos->have_posts()): $medianos->the_post();
        global $product;
        duendes_shop_magic_render_card($product, 'MEDIANO');
    endwhile;
    wp_reset_postdata();
    ?>
</div>
<?php endif; ?>

<!-- TESTIMONIAL 2 -->
<div class="testi reveal">
    <div class="t-stars">★ ★ ★ ★ ★</div>
    <p class="t-q">"Le regalé un duende a mi mamá que estaba pasando un momento difícil. Me dijo que cada vez que lo mira, siente paz."</p>
    <div class="t-a">Carolina M. — Ciudad de México · <em>adoptó a su guardián</em></div>
</div>

<!-- ═══ GRANDES — $450 USD ═══ -->
<div class="sec-div <?php echo $count_grandes == 0 ? 'sec-agotado' : ''; ?> reveal" data-section="grandes">
    <div class="sec-fog"></div><div class="sec-vine-l"></div><div class="sec-vine-r"></div>
    <div class="sd-line"></div>
    <div class="sd-rune">⬧</div>
    <h2 class="sd-title">GRANDES <em>ANCESTRALES</em></h2>
    <p class="sd-flavor">Guardianes de presencia imponente. Los Grandes no se esconden: custodian espacios enteros, transforman la energía de una habitación. Se dice que los más antiguos eligen familias, no personas.</p>
    <div class="sd-price">$450 USD</div>
    <?php if ($count_grandes == 0): ?>
    <div class="agotado-notice">✦ PRÓXIMAMENTE — NUEVOS EN CAMINO</div>
    <p class="agotado-sub">Seguinos en redes para ser la primera en enterarte cuando lleguen</p>
    <?php else: ?>
    <div class="sd-count"><?php echo $count_grandes; ?> DISPONIBLES</div>
    <?php endif; ?>
</div>
<?php if ($count_grandes > 0): ?>
<div class="grid">
    <?php
    while ($grandes->have_posts()): $grandes->the_post();
        global $product;
        duendes_shop_magic_render_card($product, 'GRANDE');
    endwhile;
    wp_reset_postdata();
    ?>
</div>
<?php endif; ?>

<!-- ═══ GIGANTES — $1,050 USD ═══ -->
<div class="sec-div <?php echo $count_gigantes == 0 ? 'sec-agotado' : ''; ?> reveal" data-section="gigantes">
    <div class="sec-fog"></div><div class="sec-vine-l"></div><div class="sec-vine-r"></div>
    <div class="sd-line"></div>
    <div class="sd-rune">⟡</div>
    <h2 class="sd-title">GIGANTES <em>LEGENDARIOS</em></h2>
    <p class="sd-flavor">Solo unos pocos existen. Los Gigantes son piezas de museo viviente — esculturas canalizadas que transforman el espacio donde habitan. Quienes los adoptan dicen que la casa ya no se siente igual. Son los guardianes más buscados y los primeros en agotarse.</p>
    <div class="sd-price">$1,050 USD</div>
    <?php if ($count_gigantes == 0): ?>
    <div class="agotado-notice">✦ PRÓXIMAMENTE — NUEVOS EN CAMINO</div>
    <p class="agotado-sub">Los Gigantes se agotan en horas. Dejanos tu email para reservar el tuyo.</p>
    <?php else: ?>
    <div class="sd-count"><?php echo $count_gigantes; ?> DISPONIBLES</div>
    <?php endif; ?>
</div>
<?php if ($count_gigantes > 0): ?>
<div class="grid">
    <?php
    while ($gigantes->have_posts()): $gigantes->the_post();
        global $product;
        duendes_shop_magic_render_card($product, 'GIGANTE');
    endwhile;
    wp_reset_postdata();
    ?>
</div>
<?php endif; ?>

<!-- UGC GALLERY -->
<div class="ugc reveal">
    <h2 class="ugc-t">GUARDIANES EN SU NUEVO HOGAR</h2>
    <p class="ugc-s">Fotos reales de personas que encontraron a su guardián</p>
    <div class="ugc-g">
        <div class="ugc-i"><img src="https://duendesdeluruguay.com/wp-content/uploads/2025/11/Santino-image-2_A_cinematic_portrait_photograph_of_a_handcrafted_duende_figure_on_lush_green_mos-0-825x1024.jpg" alt="Guardián adoptado" loading="lazy"></div>
        <div class="ugc-i"><img src="https://duendesdeluruguay.com/wp-content/uploads/2025/12/tranquil_forest_portrait_1f0dd1e3-0eca-6d60-9507-79cfea2fa1f0_1_1_393e2885-238d-4cf3-993a-a509fcd2ef23-747x1024.png" alt="Guardián adoptado" loading="lazy"></div>
        <div class="ugc-i"><img src="https://duendesdeluruguay.com/wp-content/uploads/2025/12/tranquil_forest_portrait_1f0dc61d-b324-6a90-a48f-2624a5bae62c_2_2_d1e8f843-befd-47be-ac8c-080b21f862db-1-640x1024.png" alt="Guardián adoptado" loading="lazy"></div>
        <div class="ugc-i"><img src="https://duendesdeluruguay.com/wp-content/uploads/2026/01/tranquil_forest_portrait_1f0f0dec-1950-6460-ae64-e7627e76c478_2_2_cd7834dd-5e9c-4ca9-9f01-a9cbb06dac0b-747x1024.png" alt="Guardián adoptado" loading="lazy"></div>
        <div class="ugc-i"><img src="https://duendesdeluruguay.com/wp-content/uploads/2025/12/tranquil_forest_portrait_1f0dc5e4-63b1-68c0-a223-14f05aac861e_1_1_8ba7ffb7-f78a-4d45-a0a8-241da7ab71d1-1-640x1024.png" alt="Guardián adoptado" loading="lazy"></div>
    </div>
</div>

<!-- FAQ -->
<div class="faq reveal">
    <h2 class="faq-title">PREGUNTAS FRECUENTES</h2>
    <div class="faq-item"><div class="faq-q">¿Cómo funciona la adopción?</div><div class="faq-a">Elegís el guardián que sentís que te llama, completás el pedido y nosotros lo preparamos con un ritual de activación. Llega a tu casa con su mensaje canalizado personalizado.</div></div>
    <div class="faq-item"><div class="faq-q">¿Cada duende es realmente único?</div><div class="faq-a">Sí. Cada guardián es esculpido y pintado a mano en nuestro taller de Piriápolis. No existen dos iguales. Cuando se adopta, desaparece de la tienda para siempre.</div></div>
    <div class="faq-item"><div class="faq-q">¿Envían a mi país?</div><div class="faq-a">Enviamos a todo el mundo. El envío internacional demora entre 15-30 días hábiles. Dentro de Uruguay, 3-7 días.</div></div>
    <div class="faq-item"><div class="faq-q">¿Qué incluye el mensaje canalizado?</div><div class="faq-a">Cada guardián llega con un mensaje escrito a mano: una guía espiritual personalizada que te acompaña en tu camino. Es único para cada guardián.</div></div>
    <div class="faq-item"><div class="faq-q">¿Qué métodos de pago aceptan?</div><div class="faq-a">Tarjetas de crédito/débito, transferencia bancaria y Wise para pagos internacionales. Todos los pagos son 100% seguros.</div></div>
</div>

<!-- TRUST NUMBERS -->
<div class="trust reveal">
    <div class="trust-i"><div class="trust-n">15,000+</div><div class="trust-l">ADOPTADOS EN 10 AÑOS</div></div>
    <div class="trust-i"><div class="trust-n">177K</div><div class="trust-l">COMUNIDAD MÁGICA</div></div>
    <div class="trust-i"><div class="trust-n">100%</div><div class="trust-l">HECHOS A MANO</div></div>
    <div class="trust-i"><div class="trust-n">∞</div><div class="trust-l">CADA UNO ES ÚNICO</div></div>
</div>

</main>

</div><!-- /.shop-wrapper -->

<!-- TOAST -->
<div id="toast"><div class="toast-dot"></div><div><div class="toast-t" id="tt"></div><div class="toast-tm" id="ttm"></div></div></div>

<script>
<?php echo duendes_shop_magic_get_js(); ?>
</script>

<?php
// Footer de WordPress (incluye wp_footer y cierra body/html)
get_footer();
}

// ════════════════════════════════════════════════════════════════════════════
// RENDERIZAR UNA CARD DE PRODUCTO
// ════════════════════════════════════════════════════════════════════════════
function duendes_shop_magic_render_card($product, $size_label) {
    $id = $product->get_id();
    $name = $product->get_name();
    $permalink = $product->get_permalink();
    $image = wp_get_attachment_image_src($product->get_image_id(), 'large');
    $image_url = $image ? $image[0] : wc_placeholder_img_src('large');
    $price = $product->get_price();
    $intention = duendes_shop_magic_get_intention($id);
    $intention_icon = duendes_shop_magic_get_intention_icon($intention);
    $is_new = duendes_shop_magic_is_new($id);
    $stock_status = $product->get_stock_status();
    $is_adopted = ($stock_status !== 'instock');

    // Determinar tipo de guardián
    $guardian_type = 'Guardián';
    if (stripos($size_label, 'MINI ESPECIAL') !== false) {
        $guardian_type = 'Mini Especial';
    } elseif (stripos($size_label, 'MINI') !== false) {
        $guardian_type = 'Guardián Mini';
    } elseif (stripos($size_label, 'PIXIE') !== false) {
        $guardian_type = 'Guardián Pixie';
    } elseif (stripos($size_label, 'MEDIANO') !== false) {
        $guardian_type = 'Guardián Mediano';
    } elseif (stripos($size_label, 'GRANDE') !== false) {
        $guardian_type = 'Guardián Grande';
    } elseif (stripos($size_label, 'GIGANTE') !== false) {
        $guardian_type = 'Guardián Gigante';
    }
    ?>
    <a href="<?php echo esc_url($permalink); ?>" class="card reveal<?php echo $is_adopted ? ' adp' : ''; ?>" data-cat="<?php echo esc_attr($intention); ?>" data-name="<?php echo esc_attr(strtolower($name)); ?>">
        <span class="card-corner cc-tl"></span>
        <span class="card-corner cc-tr"></span>
        <span class="card-corner cc-bl"></span>
        <span class="card-corner cc-br"></span>
        <div class="card-img">
            <?php if ($is_new && !$is_adopted): ?>
            <span class="b-new">NUEVO</span>
            <?php endif; ?>
            <span class="b-size"><?php echo esc_html($size_label); ?></span>
            <img src="<?php echo esc_url($image_url); ?>" alt="<?php echo esc_attr($name); ?>" loading="lazy" decoding="async">
            <span class="b-cat"><?php echo $intention_icon; ?></span>
            <?php if (!$is_adopted): ?>
            <span class="b-unico">✦ ÚNICO</span>
            <?php endif; ?>
            <?php if ($is_adopted): ?>
            <span class="stamp">ADOPTADO</span>
            <?php else: ?>
            <div class="card-cta"><span class="cta-b">CONOCER SU HISTORIA</span></div>
            <?php endif; ?>
        </div>
        <div class="card-info">
            <div class="c-type"><?php echo esc_html($guardian_type); ?></div>
            <div class="c-name"><?php echo esc_html($name); ?></div>
            <div class="c-price">$<?php echo number_format($price, 0); ?> USD</div>
            <div class="c-link">Conocer su Historia →</div>
        </div>
    </a>
    <?php
}

// ════════════════════════════════════════════════════════════════════════════
// CSS COMPLETO
// ════════════════════════════════════════════════════════════════════════════
function duendes_shop_magic_get_css() {
    return '
/* Reset solo para contenido de la tienda, NO para el header/menu */
.duendes-shop-magic .shop *,.duendes-shop-magic .shop *::before,.duendes-shop-magic .shop *::after,
.duendes-shop-magic .hero *,.duendes-shop-magic .ann *,.duendes-shop-magic .fbar *,
.duendes-shop-magic #toast *{margin:0;padding:0;box-sizing:border-box}
:root{
  --bg:#070906;--bg2:#0b0d09;--bg-card:#0f120d;
  --gold:#D4AF37;--gold-dim:rgba(212,175,55,0.5);--gold-glow:rgba(212,175,55,0.25);--gold-bright:#E8C547;
  --text:#ffffff;--text-dim:rgba(255,255,255,0.85);--text-muted:rgba(255,255,255,0.75);
  --forest-deep:#0a1208;--moss:rgba(100,140,70,0.06);
  --danger:rgba(180,50,50,0.9);--green:#5eb85e;
  --font-display:"Cinzel Decorative","Cinzel",serif;
  --font-h:"Cinzel",serif;--font-b:"Cormorant Garamond",serif;
  --ease:cubic-bezier(0.22,1,0.36,1);
}
html{scroll-behavior:smooth}
body.duendes-shop-magic{background:var(--bg)!important;color:var(--text);font-family:var(--font-b);overflow-x:hidden;-webkit-font-smoothing:antialiased}
.shop-wrapper{position:relative;z-index:1;background:var(--bg)}
.duendes-shop-magic .shop a,.duendes-shop-magic .hero a,.duendes-shop-magic .fbar a{text-decoration:none;color:inherit}
.reveal{opacity:0;transform:translateY(22px);transition:opacity .7s var(--ease),transform .7s var(--ease)}
.reveal.vis{opacity:1;transform:translateY(0)}
#particles{position:fixed;inset:0;z-index:0;pointer-events:none;opacity:.55}
@media(max-width:768px){#particles{display:none}#cursor-glow{display:none}}
#cursor-glow{position:fixed;width:320px;height:320px;border-radius:50%;background:radial-gradient(circle,rgba(184,151,58,0.045) 0%,transparent 70%);pointer-events:none;z-index:0;transform:translate(-50%,-50%);transition:left .2s ease-out,top .2s ease-out}

/* ANNOUNCEMENT */
.ann{background:#0a0c08;border-bottom:1px solid rgba(184,151,58,0.15);padding:12px 20px;text-align:center;position:relative;z-index:1000;overflow:hidden}
.ann-track{display:inline-flex;animation:scroll 30s linear infinite;white-space:nowrap}
.ann-item{font-family:var(--font-h);font-size:10px;letter-spacing:2.5px;color:var(--gold);text-transform:uppercase;padding:0 30px;opacity:.7}
.ann-item::before{content:"✦";margin-right:12px;opacity:.4}
@keyframes scroll{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}

/* HERO */
.hero{position:relative;height:75vh;min-height:500px;max-height:750px;display:flex;align-items:flex-start;justify-content:center;overflow:hidden;z-index:1;padding-top:8vh;margin-top:0!important}
.hero-bg{position:absolute;inset:0;background:url("https://duendesdeluruguay.com/wp-content/uploads/2025/12/gemini-image-2_A_cinematic_portrait_photograph_of_the_exact_gnome_characters_no_duplicates._A_l-1-scaled.jpg") center bottom/cover no-repeat;filter:brightness(.45) saturate(1.1)}
.hero-vig{position:absolute;inset:0;background:linear-gradient(to bottom,rgba(7,9,6,0.4) 0%,transparent 30%,transparent 70%,var(--bg) 100%)}
.hero-ring{display:none}
.hero-c{position:relative;z-index:2;text-align:center;padding:0 20px;margin-top:20px}
.hero-rune{font-family:var(--font-display);font-size:24px;color:var(--gold);opacity:.8;margin-bottom:20px;text-shadow:0 0 30px var(--gold-glow);animation:fU 1s ease .2s both}
.hero h1{font-family:var(--font-h);font-size:clamp(28px,5.5vw,56px);font-weight:400;letter-spacing:6px;color:#fff;line-height:1.3;margin-bottom:18px;text-shadow:0 4px 40px rgba(0,0,0,.8),0 2px 10px rgba(0,0,0,.9);animation:fU 1s ease .4s both}
.hero h1 em{font-style:normal;color:var(--gold);text-shadow:0 0 40px var(--gold-glow)}
.hero-sub{font-family:var(--font-b);font-size:clamp(17px,2.6vw,24px);font-style:italic;color:#fff;max-width:520px;margin:0 auto;animation:fU 1s ease .6s both;text-shadow:0 2px 15px rgba(0,0,0,.7)}
.hero-scroll{position:absolute;bottom:28px;left:50%;transform:translateX(-50%);font-family:var(--font-h);font-size:9px;letter-spacing:3px;color:#fff;animation:bounce 2.5s ease infinite;z-index:2;text-shadow:0 2px 10px rgba(0,0,0,.8)}
.hero-scroll::after{content:"";display:block;width:1px;height:28px;background:linear-gradient(var(--gold),transparent);margin:7px auto 0}
@keyframes bounce{0%,100%{transform:translateX(-50%) translateY(0)}50%{transform:translateX(-50%) translateY(7px)}}
@keyframes fU{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}

/* GUARANTEE */
.gstrip{display:flex;justify-content:center;flex-wrap:wrap;gap:28px;padding:18px 20px;background:rgba(212,175,55,0.03);border-bottom:1px solid rgba(212,175,55,0.1);position:relative;z-index:1}
.gs{display:flex;align-items:center;gap:8px}
.gs-i{font-size:18px}
.gs-t{font-family:var(--font-h);font-size:9px;letter-spacing:1.5px;color:#fff;text-transform:uppercase}

/* FILTER BAR */
.fbar{position:sticky;top:0;z-index:100;background:rgba(7,9,6,0.95);backdrop-filter:blur(20px);border-bottom:1px solid rgba(212,175,55,0.15);padding:14px 0;transition:box-shadow .3s}
.fbar.scrolled{box-shadow:0 4px 30px rgba(0,0,0,.5)}
.fbar-in{max-width:1320px;margin:0 auto;padding:0 20px;display:flex;align-items:center;justify-content:center;gap:8px;flex-wrap:wrap}
.fpill{font-family:var(--font-h);font-size:9px;letter-spacing:2px;color:#fff;padding:10px 18px;border:1px solid rgba(212,175,55,0.2);background:transparent;cursor:pointer;transition:all .4s;text-transform:uppercase;position:relative;overflow:hidden}
.fpill::before{content:"";position:absolute;inset:0;background:linear-gradient(135deg,rgba(212,175,55,0.3),transparent);opacity:0;transition:opacity .4s}
.fpill:hover::before,.fpill.on::before{opacity:1}
.fpill:hover,.fpill.on{color:#fff;border-color:var(--gold);background:rgba(212,175,55,0.15)}
.fpill .em{margin-right:5px;font-size:12px}
.srch-box{display:flex;flex-direction:column;align-items:flex-start;gap:6px;margin-left:25px;padding:10px 15px;background:rgba(212,175,55,0.05);border:1px solid rgba(212,175,55,0.2);border-radius:8px}
.srch-label{font-family:var(--font-h);font-size:10px;letter-spacing:2px;color:var(--gold);text-transform:uppercase}
.srch{font-family:var(--font-b);font-size:15px;color:#fff;background:rgba(0,0,0,0.4);border:1px solid rgba(212,175,55,0.3);border-radius:4px;padding:10px 15px;width:200px;outline:none;transition:all .3s}
.srch::placeholder{color:rgba(255,255,255,0.5);font-style:italic}
.srch:focus{border-color:var(--gold);background:rgba(0,0,0,0.6);box-shadow:0 0 15px rgba(212,175,55,0.2)}
.live{font-family:var(--font-b);font-size:13px;color:#fff;display:flex;align-items:center;gap:6px;margin-left:15px}
.live-dot{width:6px;height:6px;border-radius:50%;background:var(--green);animation:pls 2s infinite}
@keyframes pls{0%,100%{opacity:1}50%{opacity:.25}}

.shop{position:relative;z-index:1;max-width:1340px;margin:0 auto;padding:25px 20px 80px}

/* SECTION DIVIDER */
.sec-div{text-align:center;padding:70px 20px 35px;position:relative;overflow:hidden;content-visibility:auto;contain-intrinsic-size:0 600px}
.sec-fog{position:absolute;inset:0;background:
  radial-gradient(ellipse 80% 40% at 20% 60%,rgba(100,140,70,0.06),transparent),
  radial-gradient(ellipse 60% 50% at 80% 50%,rgba(212,175,55,0.05),transparent),
  radial-gradient(ellipse 100% 30% at 50% 100%,rgba(100,140,70,0.08),transparent);
  pointer-events:none;animation:fogD 12s ease-in-out infinite alternate}
@keyframes fogD{0%{opacity:.5;transform:translateX(-8px)}100%{opacity:1;transform:translateX(8px)}}
.sec-vine-l,.sec-vine-r{position:absolute;top:0;width:80px;height:100%;opacity:.08;pointer-events:none}
.sec-vine-l{left:0;background:linear-gradient(90deg,rgba(100,140,70,0.4),transparent)}
.sec-vine-r{right:0;background:linear-gradient(-90deg,rgba(100,140,70,0.4),transparent)}
.sd-line{width:50px;height:2px;background:linear-gradient(90deg,transparent,var(--gold),transparent);margin:0 auto 16px}
.sd-rune{font-family:var(--font-display);font-size:22px;color:var(--gold);opacity:.7;margin-bottom:10px;text-shadow:0 0 25px var(--gold-glow)}
.sd-title{font-family:var(--font-h);font-size:clamp(18px,3.5vw,30px);font-weight:400;letter-spacing:6px;color:#fff;margin-bottom:8px}
.sd-title em{color:var(--gold);font-style:normal}
.sd-flavor{font-family:var(--font-b);font-size:clamp(15px,2.2vw,19px);color:rgba(255,255,255,0.85);font-style:italic;max-width:520px;margin:0 auto 10px;line-height:1.65}
.sd-price{font-family:var(--font-h);font-size:13px;letter-spacing:2px;color:var(--gold);margin-top:6px}
.sd-count{font-family:var(--font-h);font-size:9px;letter-spacing:3px;color:rgba(255,255,255,0.6);margin-top:6px}

/* GRID */
.grid{display:grid;grid-template-columns:repeat(4,1fr);gap:18px;content-visibility:auto;contain-intrinsic-size:0 800px}

/* CARD TAROT */
.card{position:relative;display:block;background:var(--bg-card);border:1px solid rgba(212,175,55,0.15);border-radius:4px;overflow:hidden;transition:all .55s var(--ease)}
.card::before{content:"";position:absolute;inset:6px;border:1px solid rgba(212,175,55,0.2);border-radius:3px;z-index:3;pointer-events:none;transition:border-color .5s,box-shadow .5s}
.card::after{content:"";position:absolute;inset:0;border-radius:4px;background:linear-gradient(135deg,rgba(212,175,55,0.6) 0%,transparent 30%,transparent 70%,rgba(212,175,55,0.4) 100%);-webkit-mask:linear-gradient(#fff 0 0) content-box,linear-gradient(#fff 0 0);mask:linear-gradient(#fff 0 0) content-box,linear-gradient(#fff 0 0);-webkit-mask-composite:xor;mask-composite:exclude;padding:1px;opacity:.5;transition:opacity .5s;z-index:4;pointer-events:none}
.card:hover::before{border-color:rgba(212,175,55,0.4);box-shadow:inset 0 0 25px rgba(212,175,55,0.08)}
.card:hover::after{opacity:1}
.card:hover{transform:translateY(-6px);box-shadow:0 25px 60px rgba(0,0,0,.4),0 0 45px rgba(212,175,55,0.08);border-color:rgba(212,175,55,0.3)}
.card-corner{position:absolute;width:18px;height:18px;z-index:5;pointer-events:none;opacity:.5;transition:opacity .5s}
.card:hover .card-corner{opacity:.9}
.card-corner::before,.card-corner::after{content:"";position:absolute;background:var(--gold)}
.cc-tl{top:10px;left:10px}.cc-tl::before{top:0;left:0;width:18px;height:2px}.cc-tl::after{top:0;left:0;width:2px;height:18px}
.cc-tr{top:10px;right:10px}.cc-tr::before{top:0;right:0;width:18px;height:2px}.cc-tr::after{top:0;right:0;width:2px;height:18px}
.cc-bl{bottom:10px;left:10px}.cc-bl::before{bottom:0;left:0;width:18px;height:2px}.cc-bl::after{bottom:0;left:0;width:2px;height:18px}
.cc-br{bottom:10px;right:10px}.cc-br::before{bottom:0;right:0;width:18px;height:2px}.cc-br::after{bottom:0;right:0;width:2px;height:18px}
.card-img{position:relative;aspect-ratio:3/4;overflow:hidden}
.card-img img{width:100%;height:100%;object-fit:cover;transition:transform .8s var(--ease),filter .5s;filter:brightness(.88) saturate(.95)}
.card:hover .card-img img{transform:scale(1.05);filter:brightness(1) saturate(1.1)}
.card-img::after{content:"";position:absolute;inset:0;background:radial-gradient(ellipse at center bottom,rgba(212,175,55,0.35),transparent 55%);opacity:0;transition:opacity .5s;z-index:1;pointer-events:none}
.card:hover .card-img::after{opacity:1}
.b-size{position:absolute;top:12px;left:12px;font-family:var(--font-h);font-size:8px;letter-spacing:1.5px;color:var(--gold);background:rgba(7,9,6,0.85);backdrop-filter:blur(8px);padding:5px 10px;border:1px solid rgba(212,175,55,0.25);z-index:6;text-transform:uppercase}
.b-cat{position:absolute;top:12px;right:12px;font-size:16px;z-index:6;filter:drop-shadow(0 2px 4px rgba(0,0,0,.6))}
.b-unico{position:absolute;bottom:12px;left:12px;z-index:6;font-family:var(--font-h);font-size:8px;letter-spacing:2px;color:var(--gold-bright);background:rgba(7,9,6,0.85);backdrop-filter:blur(8px);padding:5px 12px;border:1px solid rgba(212,175,55,0.3);text-transform:uppercase;animation:uPulse 3s ease-in-out infinite}
@keyframes uPulse{0%,100%{box-shadow:0 0 0 rgba(212,175,55,0)}50%{box-shadow:0 0 15px rgba(212,175,55,0.25)}}
.b-new{position:absolute;top:12px;left:12px;z-index:7;font-family:var(--font-h);font-size:8px;letter-spacing:1.5px;color:#fff;background:linear-gradient(135deg,#3a8f3e,#2a6d2e);padding:5px 12px;border:1px solid rgba(100,200,100,0.2);text-transform:uppercase}
.b-new~.b-size{top:38px}
.card-cta{position:absolute;bottom:0;left:0;right:0;padding:50px 14px 16px;background:linear-gradient(transparent,rgba(7,9,6,0.98));opacity:0;transform:translateY(5px);transition:all .4s;z-index:8;text-align:center}
.card:hover .card-cta{opacity:1;transform:translateY(0)}
.cta-b{display:inline-block;font-family:var(--font-h);font-size:9px;letter-spacing:2px;color:var(--bg);background:var(--gold);padding:10px 20px;transition:all .3s;border-radius:2px}
.cta-b:hover{background:#fff}
.card-info{padding:14px 14px 16px;border-top:1px solid rgba(212,175,55,0.1);position:relative;background:rgba(0,0,0,0.3)}
.card-info::before{content:"";position:absolute;top:0;left:15%;right:15%;height:1px;background:linear-gradient(90deg,transparent,rgba(212,175,55,0.2),transparent)}
.c-type{font-family:var(--font-h);font-size:8px;letter-spacing:2.5px;color:rgba(255,255,255,0.6);text-transform:uppercase;margin-bottom:4px}
.c-name{font-family:var(--font-h);font-size:15px;font-weight:500;color:var(--gold);letter-spacing:1px;margin-bottom:5px;line-height:1.3}
.c-price{font-family:var(--font-b);font-size:16px;color:#fff;font-weight:500}
.c-link{font-family:var(--font-h);font-size:8px;letter-spacing:1.5px;color:rgba(255,255,255,0.5);text-transform:uppercase;margin-top:4px;transition:color .3s}
.card:hover .c-link{color:var(--gold)}

/* ADOPTADO */
.card.adp{opacity:.38;pointer-events:none}
.card.adp .card-img img{filter:grayscale(.7) brightness(.4)}
.card.adp .stamp{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%) rotate(-12deg);font-family:var(--font-h);font-size:9px;font-weight:600;letter-spacing:3px;color:rgba(255,255,255,.8);background:var(--danger);padding:6px 16px;border:1px solid rgba(255,200,200,.1);backdrop-filter:blur(4px);z-index:10}
.card.adp::before,.card.adp::after,.card.adp .card-cta,.card.adp .card-corner{display:none}

/* AGOTADO SECTION */
.sec-agotado{opacity:.35}
.sec-agotado .sd-title{color:var(--text-muted)}
.agotado-notice{font-family:var(--font-h);font-size:9px;letter-spacing:2px;color:var(--gold);opacity:.5;margin-top:8px;padding:8px 20px;border:1px solid rgba(184,151,58,0.08);display:inline-block;text-transform:uppercase}
.agotado-sub{font-family:var(--font-b);font-size:14px;color:var(--text-dim);font-style:italic;margin-top:8px}

/* TESTIMONIAL */
.testi{position:relative;padding:40px 20px;margin:25px 0;text-align:center;border-top:1px solid rgba(184,151,58,0.03);border-bottom:1px solid rgba(184,151,58,0.03);background:rgba(184,151,58,0.008)}
.t-stars{color:var(--gold);font-size:13px;letter-spacing:4px;margin-bottom:12px}
.t-q{font-family:var(--font-b);font-size:clamp(16px,2.3vw,20px);font-style:italic;color:var(--text);max-width:560px;margin:0 auto 12px;line-height:1.6}
.t-a{font-family:var(--font-h);font-size:9px;letter-spacing:2px;color:var(--text-muted);text-transform:uppercase}
.t-a em{font-style:normal;color:var(--gold);opacity:.65}

/* INTERLUDE */
.inter{position:relative;text-align:center;padding:65px 20px;margin:25px 0;overflow:hidden}
.inter::before{content:"";position:absolute;inset:0;background:radial-gradient(ellipse at center,rgba(184,151,58,0.03) 0%,transparent 55%)}
.inter-rune{font-family:var(--font-display);font-size:26px;color:var(--gold);opacity:.25;margin-bottom:16px}
.inter h2{font-family:var(--font-h);font-size:clamp(17px,3.2vw,30px);font-weight:400;letter-spacing:4px;color:var(--text);margin-bottom:9px}
.inter p{font-family:var(--font-b);font-size:17px;color:var(--text-dim);font-style:italic;max-width:440px;margin:0 auto 22px}
.inter-btn{display:inline-block;font-family:var(--font-h);font-size:9px;letter-spacing:3px;color:var(--bg);background:var(--gold);padding:13px 32px;transition:all .3s}
.inter-btn:hover{background:#fff}

/* UGC */
.ugc{padding:45px 20px;text-align:center}
.ugc-t{font-family:var(--font-h);font-size:clamp(14px,2.2vw,22px);letter-spacing:5px;color:var(--text);margin-bottom:5px}
.ugc-s{font-family:var(--font-b);font-size:15px;color:var(--text-dim);font-style:italic;margin-bottom:25px}
.ugc-g{display:grid;grid-template-columns:repeat(5,1fr);gap:4px;max-width:960px;margin:0 auto}
.ugc-i{aspect-ratio:1;overflow:hidden;position:relative;cursor:pointer;border:1px solid rgba(184,151,58,0.03)}
.ugc-i img{width:100%;height:100%;object-fit:cover;transition:transform .5s,filter .3s;filter:brightness(.82)}
.ugc-i:hover img{transform:scale(1.06);filter:brightness(1)}

/* FAQ */
.faq{max-width:700px;margin:40px auto;padding:0 20px}
.faq-title{font-family:var(--font-h);font-size:clamp(14px,2vw,20px);letter-spacing:4px;color:var(--text);text-align:center;margin-bottom:25px}
.faq-item{border-bottom:1px solid rgba(184,151,58,0.05);overflow:hidden}
.faq-q{font-family:var(--font-h);font-size:12px;letter-spacing:1px;color:var(--text);padding:16px 0;cursor:pointer;display:flex;justify-content:space-between;align-items:center;transition:color .3s}
.faq-q:hover{color:var(--gold)}
.faq-q::after{content:"+";font-size:16px;color:var(--gold);opacity:.4;transition:transform .3s}
.faq-item.open .faq-q::after{transform:rotate(45deg)}
.faq-a{font-family:var(--font-b);font-size:15px;color:var(--text-muted);line-height:1.7;max-height:0;overflow:hidden;transition:max-height .4s ease,padding .4s}
.faq-item.open .faq-a{max-height:200px;padding:0 0 16px}

/* TRUST */
.trust{display:flex;justify-content:center;flex-wrap:wrap;gap:35px;padding:45px 20px;border-top:1px solid rgba(184,151,58,0.04)}
.trust-i{text-align:center}
.trust-n{font-family:var(--font-display);font-size:24px;color:var(--gold);opacity:.65}
.trust-l{font-family:var(--font-h);font-size:7px;letter-spacing:2px;color:var(--text-dim);text-transform:uppercase;margin-top:3px}

/* TOAST */
#toast{position:fixed;bottom:80px;left:20px;z-index:998;background:#131812;border:1px solid rgba(184,151,58,0.08);border-radius:3px;padding:11px 15px;box-shadow:0 8px 30px rgba(0,0,0,.4);display:flex;align-items:center;gap:9px;max-width:310px;transform:translateX(-120%);transition:transform .5s var(--ease)}
#toast.show{transform:translateX(0)}
.toast-dot{width:6px;height:6px;border-radius:50%;background:var(--green);flex-shrink:0;animation:pls 2s infinite}
.toast-t{font-family:var(--font-b);font-size:13px;color:var(--text);line-height:1.3}
.toast-t strong{color:var(--gold)}
.toast-tm{font-size:11px;color:var(--text-dim);margin-top:1px}

/* RESPONSIVE */
@media(max-width:1100px){.grid{grid-template-columns:repeat(3,1fr)}}
@media(max-width:768px){
  .grid{grid-template-columns:repeat(2,1fr);gap:10px}
  .card-cta{display:none}
  .hero{height:50vh;min-height:320px;padding-top:5vh}
  .hero h1{font-size:clamp(22px,5vw,36px);letter-spacing:3px}
  .hero-sub{font-size:clamp(14px,2.5vw,18px)}
  .fbar{padding:10px 0}
  .fbar-in{gap:4px;padding:0 10px}
  .fpill{padding:8px 12px;font-size:8px;letter-spacing:1px}
  .live{display:none}
  .srch-box{width:100%;margin:10px 0 0 0;padding:12px;flex-direction:row;align-items:center;gap:10px}
  .srch-label{font-size:9px;white-space:nowrap}
  .srch{flex:1;width:auto;font-size:16px;padding:12px}
  .sec-div{padding:40px 15px 20px}
  .sd-title{font-size:clamp(16px,4vw,24px)}
  .sd-flavor{font-size:clamp(13px,2vw,16px)}
  .card-info{padding:10px 10px 12px}
  .c-type{font-size:7px}
  .c-name{font-size:13px}
  .c-price{font-size:15px}
  .ugc-g{grid-template-columns:repeat(3,1fr)}
  .gstrip{gap:15px;padding:14px 16px}.gs-t{font-size:8px}
  #toast{left:10px;right:10px;max-width:none;bottom:90px}
  .card-corner{display:none}
}
@media(max-width:480px){
  .grid{gap:8px}
  .fpill{padding:7px 10px;font-size:7px}
  .srch-box{flex-direction:column;align-items:stretch}
  .srch-label{text-align:center}
  .b-size{font-size:6px;padding:3px 6px;top:8px;left:8px}
  .b-cat{font-size:12px;top:8px;right:8px}
  .b-unico{font-size:6px;padding:3px 8px;bottom:8px;left:8px}
  .c-link{display:none}
  .ugc-g{grid-template-columns:repeat(2,1fr)}
  .card-info{padding:8px}
  .c-name{font-size:12px}
}

/* Hide WooCommerce defaults but keep header/menu */
.woocommerce-products-header,
.woocommerce-result-count,
.woocommerce-ordering,
.elementor-widget-woocommerce-products,
.page-title,
.entry-title{display:none!important}

/* Ensure header/menu displays correctly */
.elementor-location-header,
#masthead,
.site-header,
header.header{display:block!important;position:relative;z-index:9999}
.duendes-shop-magic .elementor-location-header{background:var(--bg)!important}

/* CRITICAL: Elementor mobile menu must work */
.elementor-menu-toggle,
.elementor-nav-menu__toggle,
.eicon-menu-bar{pointer-events:auto!important;cursor:pointer!important;z-index:99999!important;position:relative!important}
.elementor-nav-menu--dropdown,
.elementor-nav-menu__container,
.elementor-nav-menu--main{z-index:99998!important}
.elementor-nav-menu--dropdown.elementor-nav-menu__container{position:absolute!important;display:none}
.elementor-nav-menu--dropdown.elementor-nav-menu__container.elementor-nav-menu--toggle-dropdown{display:block!important}
body.elementor-nav-menu--dropdown .elementor-nav-menu__container{display:block!important}

/* Mobile menu overlay */
.elementor-location-popup,
.dialog-widget-content,
.elementor-popup-modal{z-index:999999!important}
.elementor-menu-toggle__icon--open,.elementor-menu-toggle__icon--close{display:block!important}

/* Make sure clicks work on header */
.duendes-shop-magic .elementor-location-header *{pointer-events:auto}
.duendes-shop-magic .elementor-location-header a{color:inherit;text-decoration:none}

/* Hide any conflicting Elementor banners/announcement bars */
.duendes-shop-magic .elementor-section[data-id*="banner"],
.duendes-shop-magic .elementor-widget-text-editor .marquee,
.duendes-shop-magic .announcement-bar,
.duendes-shop-magic .topbar,
.duendes-shop-magic .top-bar,
.duendes-shop-magic [class*="announcement"],
.duendes-shop-magic [class*="ticker"]{display:none!important}

/* ═══ BOTONES - Solo dorado, negro y blanco, CERO verde ═══ */
/* Botón primario */
.duendes-shop-magic .elementor-button,
.duendes-shop-magic .e-button,
.duendes-shop-magic button,
.duendes-shop-magic .btn,
.duendes-shop-magic .button,
.duendes-shop-magic input[type="submit"],
.duendes-shop-magic input[type="button"],
.duendes-shop-magic .wp-block-button__link,
.duendes-shop-magic .woocommerce a.button,
.duendes-shop-magic .woocommerce button.button,
.duendes-shop-magic .woocommerce input.button,
.duendes-shop-magic .elementor-widget-button .elementor-button{
  background:#B8973A!important;
  background-color:#B8973A!important;
  color:#070906!important;
  border:none!important;
  border-color:#B8973A!important;
}
.duendes-shop-magic .elementor-button:hover,
.duendes-shop-magic .e-button:hover,
.duendes-shop-magic button:hover,
.duendes-shop-magic .btn:hover,
.duendes-shop-magic .button:hover,
.duendes-shop-magic input[type="submit"]:hover,
.duendes-shop-magic input[type="button"]:hover,
.duendes-shop-magic .wp-block-button__link:hover,
.duendes-shop-magic .woocommerce a.button:hover,
.duendes-shop-magic .woocommerce button.button:hover,
.duendes-shop-magic .woocommerce input.button:hover,
.duendes-shop-magic .elementor-widget-button .elementor-button:hover{
  background:#fff!important;
  background-color:#fff!important;
  color:#070906!important;
}

/* Botón secundario / outline */
.duendes-shop-magic .elementor-button.elementor-button--outline,
.duendes-shop-magic .btn-outline,
.duendes-shop-magic .button-outline,
.duendes-shop-magic .btn-secondary,
.duendes-shop-magic .button-secondary{
  background:transparent!important;
  background-color:transparent!important;
  border:1px solid rgba(184,151,58,0.35)!important;
  color:#B8973A!important;
}
.duendes-shop-magic .elementor-button.elementor-button--outline:hover,
.duendes-shop-magic .btn-outline:hover,
.duendes-shop-magic .button-outline:hover,
.duendes-shop-magic .btn-secondary:hover,
.duendes-shop-magic .button-secondary:hover{
  background:#fff!important;
  background-color:#fff!important;
  color:#070906!important;
  border-color:#fff!important;
}

/* Asegurar que NO haya verde en ningún lado */
.duendes-shop-magic [style*="green"],
.duendes-shop-magic [style*="#5eb"]{
  background:#B8973A!important;
  background-color:#B8973A!important;
}
';
}

// ════════════════════════════════════════════════════════════════════════════
// JAVASCRIPT COMPLETO
// ════════════════════════════════════════════════════════════════════════════
function duendes_shop_magic_get_js() {
    return '
// PARTICLES
(function(){const c=document.getElementById("particles");if(!c)return;const x=c.getContext("2d");let W,H;function rz(){W=c.width=innerWidth;H=c.height=document.body.scrollHeight}rz();addEventListener("resize",rz);const ps=[];class P{constructor(){this.x=Math.random()*W;this.y=Math.random()*H;this.r=Math.random()*1.4+.3;this.s=Math.random()*0.2+.05;this.d=(Math.random()-.5)*.16;this.a=Math.random()*.35+.1;this.p=Math.random()*Math.PI*2;this.g=Math.random()>.48}update(){this.y-=this.s;this.x+=this.d+Math.sin(this.p*.3)*.1;this.p+=.011;if(this.y<-10){this.y=H+10;this.x=Math.random()*W}}draw(){const a=this.a*(.5+.5*Math.sin(this.p));x.beginPath();x.arc(this.x,this.y,this.r,0,Math.PI*2);x.fillStyle=this.g?"rgba(184,151,58,"+a+")":"rgba(140,170,100,"+(a*.3)+")";x.fill();if(this.r>1&&this.g){x.beginPath();x.arc(this.x,this.y,this.r*3,0,Math.PI*2);x.fillStyle="rgba(184,151,58,"+(a*.06)+")";x.fill()}}}for(let i=0;i<25;i++)ps.push(new P());function an(){x.clearRect(0,0,W,H);ps.forEach(p=>{p.update();p.draw()});requestAnimationFrame(an)}an();let rt;addEventListener("scroll",()=>{clearTimeout(rt);rt=setTimeout(rz,200)})})();

// CURSOR GLOW
const gl=document.getElementById("cursor-glow");
if(gl&&matchMedia("(hover:hover)").matches){document.addEventListener("mousemove",e=>{gl.style.left=e.clientX+"px";gl.style.top=e.clientY+"px"})}

// SCROLL REVEAL
const io=new IntersectionObserver(es=>{es.forEach(e=>{if(e.isIntersecting)e.target.classList.add("vis")})},{threshold:.04,rootMargin:"0px 0px -25px 0px"});
document.querySelectorAll(".reveal").forEach((el,i)=>{el.style.transitionDelay=(i%8)*.055+"s";io.observe(el)});

// STICKY FILTER
addEventListener("scroll",()=>{document.getElementById("fbar").classList.toggle("scrolled",scrollY>100)});

// FILTER BY CATEGORY
document.querySelectorAll(".fpill").forEach(p=>{p.addEventListener("click",()=>{document.querySelectorAll(".fpill").forEach(x=>x.classList.remove("on"));p.classList.add("on");const f=p.dataset.f;document.querySelectorAll(".card:not(.adp)").forEach(c=>{c.style.display=(f==="all"||c.dataset.cat===f)?"":"none"});document.querySelectorAll(".sec-div, .testi, .inter").forEach(s=>{s.style.display=(f==="all")?"":"none"})})});

// SEARCH
document.getElementById("srch").addEventListener("input",function(){const q=this.value.toLowerCase().trim();document.querySelectorAll(".card").forEach(c=>{const n=c.dataset.name||c.querySelector(".c-name")?.textContent||"";c.style.display=n.toLowerCase().includes(q)?"":"none"})});

// FAQ TOGGLE
document.querySelectorAll(".faq-q").forEach(q=>{q.addEventListener("click",()=>{q.parentElement.classList.toggle("open")})});

// LIVE VISITORS
setInterval(()=>{document.getElementById("vc").textContent=(Math.floor(Math.random()*16)+14)+" explorando ahora"},22000);

// TOAST — nombres miticos que NO existen en el catalogo
const toast=document.getElementById("toast"),tt=document.getElementById("tt"),ttm=document.getElementById("ttm");
const td=[
  {n:"Valentina",c:"Buenos Aires",p:"Ailín",t:"hace 2 min"},
  {n:"Sofía",c:"Madrid",p:"Theron",t:"hace 5 min"},
  {n:"Camila",c:"Ciudad de México",p:"Nimue",t:"hace 9 min"},
  {n:"Lucía",c:"Santiago",p:"Oberón",t:"hace 14 min"},
  {n:"Florencia",c:"Montevideo",p:"Lysander",t:"hace 20 min"},
  {n:"Ana Paula",c:"São Paulo",p:"Cerridwen",t:"hace 26 min"},
  {n:"Isabella",c:"Bogotá",p:"Arianwen",t:"hace 33 min"},
];
let ti=0;
function showT(){const d=td[ti%td.length];tt.innerHTML="<strong>"+d.n+"</strong> de "+d.c+" adoptó a <strong>"+d.p+"</strong>";ttm.textContent=d.t;toast.classList.add("show");setTimeout(()=>{toast.classList.remove("show");ti++},4200)}
setTimeout(()=>{showT();setInterval(()=>setTimeout(showT,Math.random()*10e3+16e3),24e3)},6e3);
';
}
