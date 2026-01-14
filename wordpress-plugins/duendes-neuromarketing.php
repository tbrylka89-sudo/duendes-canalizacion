<?php
/**
 * Plugin Name: Duendes Neuromarketing
 * Description: Neuromarketing emocional completo - intro, hero, categorias por dolor, cofre de tesoros
 * Version: 6.0.0
 * Author: Duendes del Uruguay
 */

if (!defined('ABSPATH')) exit;

add_action('wp_head', 'duendes_neuro_css', 9999);
add_action('wp_footer', 'duendes_neuro_js', 9999);
add_action('wp_footer', 'duendes_intro_cinematica', 1);

// ═══════════════════════════════════════════════════════════════════════════
// AJAX ENDPOINT: PRODUCTOS REALES DE WOOCOMMERCE
// ═══════════════════════════════════════════════════════════════════════════
add_action('wp_ajax_duendes_get_productos', 'duendes_get_productos_ajax');
add_action('wp_ajax_nopriv_duendes_get_productos', 'duendes_get_productos_ajax');

function duendes_get_productos_ajax() {
    $categoria = isset($_POST['categoria']) ? sanitize_text_field($_POST['categoria']) : 'proteccion';
    $limite = isset($_POST['limite']) ? intval($_POST['limite']) : 3;

    $args = array(
        'status' => 'publish',
        'limit' => $limite,
        'orderby' => 'rand',
        'stock_status' => 'instock',
        'category' => array($categoria)
    );

    $products = wc_get_products($args);
    $resultado = array();

    foreach ($products as $product) {
        $image_id = $product->get_image_id();
        $image_url = $image_id ? wp_get_attachment_image_url($image_id, 'medium_large') : '';

        $resultado[] = array(
            'id' => $product->get_id(),
            'nombre' => $product->get_name(),
            'precio' => $product->get_price_html(),
            'precio_num' => $product->get_price(),
            'imagen' => $image_url,
            'url' => $product->get_permalink(),
            'stock' => $product->get_stock_status(),
            'descripcion' => wp_trim_words($product->get_short_description(), 15, '...')
        );
    }

    // Si no hay productos en la categoría, buscar cualquiera
    if (empty($resultado)) {
        $args['category'] = array();
        $products = wc_get_products($args);
        foreach ($products as $product) {
            $image_id = $product->get_image_id();
            $image_url = $image_id ? wp_get_attachment_image_url($image_id, 'medium_large') : '';
            $resultado[] = array(
                'id' => $product->get_id(),
                'nombre' => $product->get_name(),
                'precio' => $product->get_price_html(),
                'precio_num' => $product->get_price(),
                'imagen' => $image_url,
                'url' => $product->get_permalink(),
                'stock' => $product->get_stock_status(),
                'descripcion' => wp_trim_words($product->get_short_description(), 15, '...')
            );
        }
    }

    wp_send_json_success($resultado);
}

// Registrar shortcodes
add_shortcode('duendes_hero', 'duendes_hero_emocional_shortcode');
add_shortcode('duendes_categorias', 'duendes_categorias_dolor_shortcode');
add_shortcode('duendes_cofre', 'duendes_cofre_tesoros_shortcode');

function duendes_neuro_css() {
    if (is_admin()) return;
    ?>
    <style id="duendes-neuro-v5">
    /* ═══════════════════════════════════════════════════════════════════════════
       DUENDES NEUROMARKETING v5.0 - MEJORAS SUTILES
       Respeta la estética actual, solo mejora la conversión
       ═══════════════════════════════════════════════════════════════════════════ */

    /* OCULTAR SHORTCODES ROTOS */
    .elementor-shortcode:has([duendes_grid]),
    .elementor-shortcode:has([grimorio_ultimas]),
    .elementor-widget-shortcode:has(.elementor-shortcode:empty):not(:has(#tg-portal)),
    .elementor-shortcode:empty:not(:has(#tg-portal)) {
        display: none !important;
        height: 0 !important;
        overflow: hidden !important;
    }

    /* EXCEPCIÓN: Test del Guardián siempre visible */
    .elementor-shortcode:has(#tg-portal),
    .elementor-widget:has(#tg-portal) {
        display: block !important;
        visibility: visible !important;
        opacity: 1 !important;
        height: auto !important;
        overflow: visible !important;
    }

    /* Fallback para navegadores sin :has() */
    .elementor-shortcode {
        min-height: 0 !important;
    }

    /* PARTÍCULAS MÁGICAS - MUY SUTILES */
    .neuro-particulas {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 9990;
        overflow: hidden;
    }
    .neuro-particula {
        position: absolute;
        width: 3px;
        height: 3px;
        background: #d4af37;
        border-radius: 50%;
        opacity: 0;
        animation: particFloat 20s infinite ease-in-out;
        box-shadow: 0 0 6px rgba(212,175,55,0.4);
    }
    @keyframes particFloat {
        0%, 100% { opacity: 0; transform: translateY(100vh) scale(0.5); }
        15% { opacity: 0.5; }
        50% { opacity: 0.25; }
        85% { opacity: 0.5; }
        95% { opacity: 0; transform: translateY(-5vh) scale(1); }
    }

    /* MEJORA: Añadir glow sutil a elementos dorados al hover */
    .cat-card-def:hover,
    .que-es-card-v4:hover {
        box-shadow: 0 15px 40px rgba(212,175,55,0.15) !important;
    }

    /* MEJORA: CTA más atractivo */
    .test-guardian__cta,
    a[href*="test-guardian"] {
        position: relative;
        overflow: hidden;
    }
    .test-guardian__cta::after,
    a[href*="test-guardian"]::after {
        content: '';
        position: absolute;
        top: -50%;
        left: -50%;
        width: 200%;
        height: 200%;
        background: linear-gradient(45deg, transparent 40%, rgba(255,255,255,0.1) 50%, transparent 60%);
        animation: shimmer 3s infinite;
    }
    @keyframes shimmer {
        0% { transform: translateX(-100%) rotate(45deg); }
        100% { transform: translateX(100%) rotate(45deg); }
    }

    /* BANNER SUPERIOR SUTIL - NO TAPA NADA */
    .neuro-banner-top {
        background: linear-gradient(90deg, #0a0a0a, #151515, #0a0a0a);
        color: #fff;
        text-align: center;
        padding: 10px 20px;
        font-family: 'Cormorant Garamond', Georgia, serif;
        font-size: 0.95rem;
        border-bottom: 1px solid rgba(212,175,55,0.15);
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 30px;
    }
    .neuro-banner-top .gold { color: #d4af37; }
    .neuro-banner-top .sep { opacity: 0.2; }

    /* TOOLTIP DE URGENCIA - APARECE EN CARDS */
    .neuro-urgencia {
        position: absolute;
        top: 10px;
        right: 10px;
        background: linear-gradient(135deg, #d4af37, #c9a227);
        color: #0a0a0a;
        padding: 5px 12px;
        border-radius: 20px;
        font-family: 'Cinzel', serif;
        font-size: 0.7rem;
        font-weight: 600;
        letter-spacing: 0.5px;
        text-transform: uppercase;
        box-shadow: 0 4px 15px rgba(212,175,55,0.3);
        animation: pulseUrgencia 2s infinite;
        z-index: 10;
    }
    @keyframes pulseUrgencia {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.05); }
    }

    /* MEJORA: Texto de validación debajo del hero */
    .neuro-validacion {
        text-align: center;
        padding: 30px 20px;
        background: linear-gradient(180deg, transparent, rgba(0,0,0,0.03));
    }
    .neuro-validacion p {
        font-family: 'Cormorant Garamond', Georgia, serif;
        font-size: 1.2rem;
        color: #666;
        font-style: italic;
        margin: 0;
    }
    .neuro-validacion .gold { color: #d4af37; font-weight: 500; }

    /* CONTADOR FLOTANTE - PRUEBA SOCIAL */
    .neuro-social-proof {
        position: fixed;
        bottom: 20px;
        left: 20px;
        background: linear-gradient(135deg, #1a1a1a, #222);
        color: #fff;
        padding: 15px 20px;
        border-radius: 12px;
        font-family: 'Cormorant Garamond', Georgia, serif;
        font-size: 0.9rem;
        box-shadow: 0 10px 40px rgba(0,0,0,0.3);
        border: 1px solid rgba(212,175,55,0.15);
        z-index: 9999;
        transform: translateX(-120%);
        opacity: 0;
        transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        max-width: 280px;
    }
    .neuro-social-proof.visible {
        transform: translateX(0);
        opacity: 1;
    }
    .neuro-social-proof .nombre { color: #d4af37; font-weight: 500; }
    .neuro-social-proof .accion { color: rgba(255,255,255,0.7); }
    .neuro-social-proof .tiempo { color: rgba(255,255,255,0.4); font-size: 0.8rem; }
    .neuro-social-proof-close {
        position: absolute;
        top: 5px;
        right: 8px;
        background: none;
        border: none;
        color: rgba(255,255,255,0.3);
        cursor: pointer;
        font-size: 1rem;
    }

    /* RESPONSIVE */
    @media (max-width: 768px) {
        .neuro-banner-top { font-size: 0.8rem; gap: 15px; padding: 8px 15px; }
        .neuro-social-proof { left: 10px; right: 10px; max-width: none; bottom: 10px; }
    }
    @media (max-width: 480px) {
        .neuro-banner-top .hide-mobile { display: none; }
    }
    </style>
    <?php
}

function duendes_neuro_js() {
    if (is_admin()) return;
    $uri = isset($_SERVER['REQUEST_URI']) ? $_SERVER['REQUEST_URI'] : '';
    $es_home = ($uri === '/' || $uri === '' || strpos($uri, '?') === 0 || is_front_page() || is_home());
    ?>
    <script id="duendes-neuro-v5">
    (function() {
        'use strict';

        var esHome = <?php echo $es_home ? 'true' : 'false'; ?>;
        if (window.location.pathname === '/' || window.location.pathname === '') esHome = true;

        function init() {
            ocultarShortcodesRotos();
            crearParticulas();

            if (esHome) {
                agregarBannerTop();
                agregarValidacion();
                mostrarSocialProof();
            }
        }

        function ocultarShortcodesRotos() {
            // Buscar y ocultar cualquier shortcode que aparezca como texto
            // EXCEPCIÓN: No ocultar si contiene el Test del Guardián (#tg-portal)
            document.querySelectorAll('.elementor-shortcode').forEach(function(el) {
                // Si contiene el test guardian, no tocar
                if (el.querySelector('#tg-portal')) return;

                var texto = el.textContent || '';
                if (texto.includes('[') && texto.includes(']')) {
                    el.style.display = 'none';
                    // También ocultar el widget padre
                    var padre = el.closest('.elementor-widget');
                    if (padre && !padre.querySelector('#tg-portal')) padre.style.display = 'none';
                }
            });
        }

        function crearParticulas() {
            if (document.querySelector('.neuro-particulas')) return;

            var contenedor = document.createElement('div');
            contenedor.className = 'neuro-particulas';

            for (var i = 0; i < 12; i++) {
                var p = document.createElement('div');
                p.className = 'neuro-particula';
                p.style.left = Math.random() * 100 + '%';
                p.style.animationDelay = (Math.random() * 20) + 's';
                p.style.animationDuration = (15 + Math.random() * 10) + 's';
                contenedor.appendChild(p);
            }

            document.body.appendChild(contenedor);
        }

        function agregarBannerTop() {
            if (document.querySelector('.neuro-banner-top')) return;

            var header = document.querySelector('header, .elementor-location-header');
            if (!header) return;

            var banner = document.createElement('div');
            banner.className = 'neuro-banner-top';
            banner.innerHTML = '\
                <span><span class="gold">✦</span> Si llegaste hasta acá, <span class="gold">no fue casualidad</span></span>\
                <span class="sep hide-mobile">•</span>\
                <span class="hide-mobile"><span class="gold">12,847</span> guardianes adoptados</span>\
                <span class="sep">•</span>\
                <span>Envíos a <span class="gold">45+ países</span></span>\
            ';

            header.parentNode.insertBefore(banner, header);
        }

        function agregarValidacion() {
            if (document.querySelector('.neuro-validacion')) return;

            // Buscar el test del guardián
            var testSection = document.querySelector('.test-guardian, [class*="test-guardian"]');
            if (!testSection) {
                // Buscar por texto
                var h2s = document.querySelectorAll('h2');
                for (var i = 0; i < h2s.length; i++) {
                    if (h2s[i].textContent.includes('Qué Duende Te Está')) {
                        testSection = h2s[i].closest('section') || h2s[i].closest('[class*="elementor"]');
                        break;
                    }
                }
            }

            if (!testSection) return;

            var validacion = document.createElement('div');
            validacion.className = 'neuro-validacion';
            validacion.innerHTML = '<p>No elegís al guardián. <span class="gold">El guardián te elige a vos</span>.</p>';

            // Insertar después del test
            if (testSection.nextSibling) {
                testSection.parentNode.insertBefore(validacion, testSection.nextSibling);
            }
        }

        function mostrarSocialProof() {
            if (document.querySelector('.neuro-social-proof')) return;
            if (sessionStorage.getItem('neuroSocialVisto')) return;

            var nombres = ['María de Buenos Aires', 'Josefina de Montevideo', 'Patricia de Costa Rica', 'Carolina de Santiago', 'Lucía de Lima', 'Valentina de Bogotá'];
            var acciones = ['adoptó su guardián', 'encontró a su protector', 'adoptó su 2do guardián'];
            var tiempos = ['hace 3 minutos', 'hace 12 minutos', 'hace 27 minutos'];

            var nombre = nombres[Math.floor(Math.random() * nombres.length)];
            var accion = acciones[Math.floor(Math.random() * acciones.length)];
            var tiempo = tiempos[Math.floor(Math.random() * tiempos.length)];

            var popup = document.createElement('div');
            popup.className = 'neuro-social-proof';
            popup.innerHTML = '\
                <button class="neuro-social-proof-close">×</button>\
                <span class="nombre">' + nombre + '</span>\
                <span class="accion"> ' + accion + '</span>\
                <div class="tiempo">' + tiempo + '</div>\
            ';

            document.body.appendChild(popup);

            popup.querySelector('.neuro-social-proof-close').onclick = function() {
                popup.classList.remove('visible');
                setTimeout(function() { popup.remove(); }, 500);
            };

            // Mostrar después de 8 segundos
            setTimeout(function() {
                popup.classList.add('visible');
            }, 8000);

            // Ocultar después de 20 segundos
            setTimeout(function() {
                if (popup.parentNode) {
                    popup.classList.remove('visible');
                    setTimeout(function() { popup.remove(); }, 500);
                }
            }, 20000);

            sessionStorage.setItem('neuroSocialVisto', '1');
        }

        // Ejecutar
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
        } else {
            init();
        }
        window.addEventListener('load', function() {
            setTimeout(init, 500);
        });

    })();
    </script>
    <?php
}

// ═══════════════════════════════════════════════════════════════════════════
// INTRO CINEMATICA 3 SEGUNDOS (PRIMERA VISITA)
// ═══════════════════════════════════════════════════════════════════════════

function duendes_intro_cinematica() {
    // Solo en homepage
    if (!is_front_page() && !is_home()) return;
    ?>
    <div id="duendes-intro-overlay" style="
        position: fixed;
        inset: 0;
        background: #0a0a0a;
        z-index: 999999;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        opacity: 1;
        transition: opacity 0.8s ease;
    ">
        <div style="text-align: center; padding: 40px; max-width: 600px;">
            <p style="
                color: #d4af37;
                font-family: 'Cormorant Garamond', Georgia, serif;
                font-size: clamp(1.3rem, 4vw, 2.2rem);
                font-style: italic;
                margin: 0;
                opacity: 0;
                animation: introFadeIn 1s ease 0.3s forwards;
            ">El universo no te trajo aca por casualidad.</p>
            <p style="
                color: rgba(255,255,255,0.8);
                font-family: 'Cormorant Garamond', Georgia, serif;
                font-size: clamp(1rem, 2.5vw, 1.3rem);
                margin-top: 25px;
                opacity: 0;
                animation: introFadeIn 1s ease 1.2s forwards;
            ">Algo te estaba esperando...</p>
        </div>
    </div>
    <style>
        @keyframes introFadeIn {
            from { opacity: 0; transform: translateY(15px); }
            to { opacity: 1; transform: translateY(0); }
        }
    </style>
    <script>
    (function() {
        // Verificar si ya visito (cookie)
        if (document.cookie.indexOf('duendes_intro_visto=1') !== -1) {
            var overlay = document.getElementById('duendes-intro-overlay');
            if (overlay) overlay.style.display = 'none';
            return;
        }

        // Marcar como visitado
        document.cookie = 'duendes_intro_visto=1; path=/; max-age=' + (60*60*24*7); // 7 dias

        // Fade out despues de 3.5 segundos
        setTimeout(function() {
            var overlay = document.getElementById('duendes-intro-overlay');
            if (overlay) {
                overlay.style.opacity = '0';
                setTimeout(function() {
                    overlay.style.display = 'none';
                }, 800);
            }
        }, 3500);
    })();
    </script>
    <?php
}

// ═══════════════════════════════════════════════════════════════════════════
// SHORTCODE: HERO EMOCIONAL [duendes_hero]
// ═══════════════════════════════════════════════════════════════════════════

function duendes_hero_emocional_shortcode($atts) {
    $atts = shortcode_atts(array(
        'titulo' => 'No buscas un objeto. Buscas un companero del alma.',
        'subtitulo' => 'Un ser que entienda sin palabras, que proteja sin pedir nada, que este ahi cuando nadie mas esta.',
        'cta_texto' => 'Encontrar mi Guardian',
        'cta_url' => '/tienda/'
    ), $atts);

    ob_start();
    ?>
    <section class="duendes-hero-emocional">
        <div class="hero-particulas"></div>
        <div class="hero-contenido">
            <h2><?php echo esc_html($atts['titulo']); ?></h2>
            <p class="hero-subtitulo"><?php echo esc_html($atts['subtitulo']); ?></p>
            <a href="<?php echo esc_url($atts['cta_url']); ?>" class="hero-cta">
                <?php echo esc_html($atts['cta_texto']); ?> <span class="cta-arrow">→</span>
            </a>
        </div>
        <div class="hero-badge">
            <span class="badge-icon">★</span>
            <span>Ahora formas parte de Los Elegidos</span>
        </div>
    </section>
    <style>
        .duendes-hero-emocional {
            background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #0a0a0a 100%);
            padding: 80px 30px;
            text-align: center;
            position: relative;
            overflow: hidden;
            border-radius: 0;
            margin: 0;
        }
        .duendes-hero-emocional .hero-particulas {
            position: absolute;
            inset: 0;
            background-image: radial-gradient(circle at 20% 30%, rgba(212,175,55,0.08) 0%, transparent 50%),
                              radial-gradient(circle at 80% 70%, rgba(155,89,182,0.08) 0%, transparent 50%);
            pointer-events: none;
        }
        .duendes-hero-emocional .hero-contenido {
            position: relative;
            z-index: 2;
            max-width: 750px;
            margin: 0 auto;
        }
        .duendes-hero-emocional h2 {
            font-family: 'Cinzel', serif;
            color: #fff;
            font-size: clamp(1.6rem, 4.5vw, 2.8rem);
            font-weight: 400;
            line-height: 1.35;
            margin: 0 0 25px;
        }
        .duendes-hero-emocional .hero-subtitulo {
            font-family: 'Cormorant Garamond', Georgia, serif;
            color: rgba(255,255,255,0.75);
            font-size: clamp(1.05rem, 2.2vw, 1.35rem);
            margin: 0 0 40px;
            line-height: 1.7;
        }
        .duendes-hero-emocional .hero-cta {
            display: inline-flex;
            align-items: center;
            gap: 10px;
            background: linear-gradient(135deg, #d4af37, #c9a227);
            color: #0a0a0a;
            padding: 18px 45px;
            border-radius: 50px;
            text-decoration: none;
            font-family: 'Cinzel', serif;
            font-weight: 600;
            font-size: 1rem;
            text-transform: uppercase;
            letter-spacing: 1px;
            transition: all 0.4s;
            box-shadow: 0 10px 35px rgba(212,175,55,0.25);
        }
        .duendes-hero-emocional .hero-cta:hover {
            transform: translateY(-3px);
            box-shadow: 0 15px 45px rgba(212,175,55,0.4);
        }
        .duendes-hero-emocional .cta-arrow {
            transition: transform 0.3s;
        }
        .duendes-hero-emocional .hero-cta:hover .cta-arrow {
            transform: translateX(5px);
        }
        .duendes-hero-emocional .hero-badge {
            position: absolute;
            bottom: 25px;
            right: 30px;
            background: rgba(212,175,55,0.1);
            border: 1px solid rgba(212,175,55,0.25);
            padding: 10px 20px;
            border-radius: 25px;
            display: flex;
            align-items: center;
            gap: 10px;
            color: #d4af37;
            font-family: 'Cormorant Garamond', Georgia, serif;
            font-size: 0.9rem;
        }
        .duendes-hero-emocional .badge-icon {
            font-size: 1.1rem;
        }
        @media (max-width: 768px) {
            .duendes-hero-emocional { padding: 60px 20px; }
            .duendes-hero-emocional .hero-badge { position: static; margin-top: 40px; justify-content: center; }
        }
    </style>
    <?php
    return ob_get_clean();
}

// ═══════════════════════════════════════════════════════════════════════════
// SHORTCODE: CATEGORIAS POR DOLOR [duendes_categorias]
// ═══════════════════════════════════════════════════════════════════════════

function duendes_categorias_dolor_shortcode() {
    $categorias = array(
        array(
            'icono' => '🛡️',
            'titulo' => 'Te sentis desprotegida',
            'dolor' => 'Algo o alguien te esta drenando. La energia pesada te persigue.',
            'solucion' => 'Guardianes de Proteccion',
            'url' => '/categoria-producto/proteccion/',
            'color' => '#4a90a4'
        ),
        array(
            'icono' => '💰',
            'titulo' => 'El dinero no fluye',
            'dolor' => 'Trabajas tanto y nunca alcanza. Sentis bloqueos invisibles.',
            'solucion' => 'Guardianes de Abundancia',
            'url' => '/categoria-producto/abundancia/',
            'color' => '#d4af37'
        ),
        array(
            'icono' => '💔',
            'titulo' => 'El amor te esquiva',
            'dolor' => 'Relaciones que lastiman o soledad que pesa. Mereces mas.',
            'solucion' => 'Guardianes del Amor',
            'url' => '/categoria-producto/amor/',
            'color' => '#e75480'
        ),
        array(
            'icono' => '🌿',
            'titulo' => 'Tu cuerpo o alma duelen',
            'dolor' => 'Cansancio cronico, ansiedad, heridas que no cierran.',
            'solucion' => 'Guardianes de Sanacion',
            'url' => '/categoria-producto/sanacion/',
            'color' => '#56ab91'
        )
    );

    ob_start();
    ?>
    <section class="duendes-categorias-dolor">
        <h2 class="categorias-titulo">¿Que te trajo hasta aca?</h2>
        <p class="categorias-subtitulo">Tu guardian ya sabe. Ahora te toca elegir.</p>
        <div class="categorias-grid">
            <?php foreach ($categorias as $cat): ?>
            <a href="<?php echo esc_url($cat['url']); ?>" class="categoria-card" style="--accent: <?php echo $cat['color']; ?>">
                <span class="cat-icono"><?php echo $cat['icono']; ?></span>
                <h3><?php echo esc_html($cat['titulo']); ?></h3>
                <p class="cat-dolor"><?php echo esc_html($cat['dolor']); ?></p>
                <span class="cat-solucion"><?php echo esc_html($cat['solucion']); ?> →</span>
            </a>
            <?php endforeach; ?>
        </div>
    </section>
    <style>
        .duendes-categorias-dolor {
            padding: 70px 30px;
            background: #0a0a0a;
        }
        .duendes-categorias-dolor .categorias-titulo {
            text-align: center;
            font-family: 'Cinzel', serif;
            color: #fff;
            font-size: clamp(1.5rem, 4vw, 2.2rem);
            margin: 0 0 12px;
            font-weight: 400;
        }
        .duendes-categorias-dolor .categorias-subtitulo {
            text-align: center;
            font-family: 'Cormorant Garamond', Georgia, serif;
            color: rgba(255,255,255,0.6);
            font-size: 1.1rem;
            margin: 0 0 45px;
        }
        .duendes-categorias-dolor .categorias-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
            gap: 22px;
            max-width: 1150px;
            margin: 0 auto;
        }
        .duendes-categorias-dolor .categoria-card {
            background: linear-gradient(135deg, #1a1a1a, #151515);
            border-radius: 18px;
            padding: 35px 28px;
            text-decoration: none;
            transition: all 0.35s;
            border: 1px solid transparent;
            position: relative;
            overflow: hidden;
        }
        .duendes-categorias-dolor .categoria-card::before {
            content: '';
            position: absolute;
            inset: 0;
            background: radial-gradient(circle at 50% 0%, var(--accent), transparent 70%);
            opacity: 0;
            transition: opacity 0.35s;
        }
        .duendes-categorias-dolor .categoria-card:hover {
            border-color: var(--accent);
            transform: translateY(-6px);
            box-shadow: 0 15px 45px rgba(0,0,0,0.4);
        }
        .duendes-categorias-dolor .categoria-card:hover::before {
            opacity: 0.08;
        }
        .duendes-categorias-dolor .cat-icono {
            font-size: 2.8rem;
            display: block;
            margin-bottom: 18px;
            position: relative;
        }
        .duendes-categorias-dolor .categoria-card h3 {
            font-family: 'Cinzel', serif;
            color: #fff;
            font-size: 1.15rem;
            margin: 0 0 14px;
            font-weight: 500;
            position: relative;
        }
        .duendes-categorias-dolor .cat-dolor {
            font-family: 'Cormorant Garamond', Georgia, serif;
            color: rgba(255,255,255,0.65);
            font-size: 1rem;
            line-height: 1.55;
            margin: 0 0 20px;
            position: relative;
        }
        .duendes-categorias-dolor .cat-solucion {
            font-family: 'Cinzel', serif;
            color: var(--accent);
            font-weight: 600;
            font-size: 0.85rem;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            position: relative;
        }
    </style>
    <?php
    return ob_get_clean();
}

// ═══════════════════════════════════════════════════════════════════════════
// SHORTCODE: COFRE DE TESOROS [duendes_cofre]
// ═══════════════════════════════════════════════════════════════════════════

function duendes_cofre_tesoros_shortcode() {
    ob_start();
    ?>
    <section class="duendes-cofre">
        <div class="cofre-header">
            <span class="cofre-icono">📦✨</span>
            <h2>Tu Cofre de Tesoros</h2>
            <p>Todo lo que recibis al adoptar un guardian</p>
        </div>
        <div class="cofre-contenido">
            <div class="tesoro">
                <span class="tesoro-icono">🌟</span>
                <div class="tesoro-info">
                    <h4>Portal Mi Magia</h4>
                    <p>Tu espacio sagrado digital. Acceso de por vida a experiencias exclusivas.</p>
                </div>
            </div>
            <div class="tesoro">
                <span class="tesoro-icono">📜</span>
                <div class="tesoro-info">
                    <h4>Canalizacion Personalizada</h4>
                    <p>Historia unica de tu guardian, su mensaje y ritual. Solo para vos.</p>
                </div>
            </div>
            <div class="tesoro">
                <span class="tesoro-icono">🏅</span>
                <div class="tesoro-info">
                    <h4>Certificado de Adopcion</h4>
                    <p>Documento oficial con QR de autenticidad. Tu guardian es unico.</p>
                </div>
            </div>
            <div class="tesoro">
                <span class="tesoro-icono">🎁</span>
                <div class="tesoro-info">
                    <h4>Regalos Sorpresa</h4>
                    <p>Runas de poder, treboles y mas segun la energia de tu guardian.</p>
                </div>
            </div>
            <div class="tesoro destacado">
                <span class="tesoro-icono">👑</span>
                <div class="tesoro-info">
                    <h4>15 Dias de Circulo GRATIS</h4>
                    <p>Acceso VIP a rituales, tiradas y comunidad exclusiva. Sin compromiso.</p>
                </div>
            </div>
        </div>
        <div class="cofre-footer">
            <p>No compras una pieza. <strong>Entras al mundo.</strong></p>
        </div>
    </section>
    <style>
        .duendes-cofre {
            padding: 70px 30px;
            background: linear-gradient(180deg, #0a0a0a, #1a1a2e);
        }
        .duendes-cofre .cofre-header {
            text-align: center;
            margin-bottom: 45px;
        }
        .duendes-cofre .cofre-icono {
            font-size: 3.5rem;
            display: block;
            margin-bottom: 18px;
        }
        .duendes-cofre .cofre-header h2 {
            font-family: 'Cinzel', serif;
            color: #d4af37;
            font-size: clamp(1.5rem, 4vw, 2rem);
            margin: 0 0 10px;
            font-weight: 500;
        }
        .duendes-cofre .cofre-header p {
            font-family: 'Cormorant Garamond', Georgia, serif;
            color: rgba(255,255,255,0.6);
            font-size: 1.1rem;
            margin: 0;
        }
        .duendes-cofre .cofre-contenido {
            max-width: 650px;
            margin: 0 auto;
            display: flex;
            flex-direction: column;
            gap: 18px;
        }
        .duendes-cofre .tesoro {
            display: flex;
            align-items: flex-start;
            gap: 18px;
            background: linear-gradient(135deg, #1a1a1a, #151515);
            padding: 24px;
            border-radius: 14px;
            border: 1px solid rgba(255,255,255,0.06);
            transition: all 0.3s;
        }
        .duendes-cofre .tesoro:hover {
            border-color: rgba(212,175,55,0.2);
            transform: translateX(5px);
        }
        .duendes-cofre .tesoro.destacado {
            background: linear-gradient(135deg, rgba(212,175,55,0.12), #1a1a1a);
            border-color: rgba(212,175,55,0.3);
        }
        .duendes-cofre .tesoro-icono {
            font-size: 1.8rem;
            flex-shrink: 0;
            margin-top: 2px;
        }
        .duendes-cofre .tesoro-info h4 {
            font-family: 'Cinzel', serif;
            color: #fff;
            margin: 0 0 6px;
            font-size: 1.05rem;
            font-weight: 500;
        }
        .duendes-cofre .tesoro.destacado h4 {
            color: #d4af37;
        }
        .duendes-cofre .tesoro-info p {
            font-family: 'Cormorant Garamond', Georgia, serif;
            color: rgba(255,255,255,0.65);
            margin: 0;
            font-size: 0.95rem;
            line-height: 1.5;
        }
        .duendes-cofre .cofre-footer {
            text-align: center;
            margin-top: 45px;
        }
        .duendes-cofre .cofre-footer p {
            font-family: 'Cormorant Garamond', Georgia, serif;
            color: rgba(255,255,255,0.5);
            font-size: 1.2rem;
            font-style: italic;
            margin: 0;
        }
        .duendes-cofre .cofre-footer strong {
            color: #d4af37;
        }
    </style>
    <?php
    return ob_get_clean();
}
// FIN - Test v3 eliminado, usar test-guardian-v9.php
