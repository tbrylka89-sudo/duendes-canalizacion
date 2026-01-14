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

// ═══════════════════════════════════════════════════════════════════════════════════════
// TEST DEL GUARDIAN v3.0 - EMBUDO EMOCIONAL PRINCIPAL
// Estética premium oscura + IA inteligente + Sistema de memoria
// ═══════════════════════════════════════════════════════════════════════════════════════

add_action('wp_footer', 'duendes_test_guardian_v3');

function duendes_test_guardian_v3() {
    if (strpos($_SERVER['REQUEST_URI'], 'descubri') === false) return;
    $ajax_url = admin_url('admin-ajax.php');
    ?>
    <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400&display=swap" rel="stylesheet">

    <style id="tg-v3-styles">
    /* ═══════════════════════════════════════════════════════════════════════════
       VARIABLES Y RESET
       ═══════════════════════════════════════════════════════════════════════════ */
    :root {
        --tg-bg: #05060A;
        --tg-text: #F5F7FF;
        --tg-text-soft: rgba(245, 247, 255, 0.7);
        --tg-neon: #3B82F6;
        --tg-neon-glow: rgba(59, 130, 246, 0.4);
        --tg-gold: #D4AF37;
        --tg-gold-soft: rgba(212, 175, 55, 0.6);
        --tg-glass: rgba(255, 255, 255, 0.03);
        --tg-border: rgba(59, 130, 246, 0.3);
    }

    #tg-app {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: var(--tg-bg);
        z-index: 2147483647;
        font-family: 'Cormorant Garamond', Georgia, serif;
        overflow-y: auto;
        overflow-x: hidden;
    }

    #tg-app * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
    }

    /* ═══════════════════════════════════════════════════════════════════════════
       FONDO CINEMATOGRÁFICO
       ═══════════════════════════════════════════════════════════════════════════ */
    .tg-bg {
        position: fixed;
        inset: 0;
        overflow: hidden;
        pointer-events: none;
        z-index: 1;
    }

    .tg-orb {
        position: absolute;
        border-radius: 50%;
        filter: blur(120px);
        animation: tgOrbFloat 25s ease-in-out infinite;
    }

    .tg-orb-1 {
        width: 600px;
        height: 600px;
        background: radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 70%);
        top: -200px;
        left: -200px;
    }

    .tg-orb-2 {
        width: 500px;
        height: 500px;
        background: radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%);
        bottom: -150px;
        right: -150px;
        animation-delay: -8s;
    }

    .tg-orb-3 {
        width: 400px;
        height: 400px;
        background: radial-gradient(circle, rgba(212, 175, 55, 0.08) 0%, transparent 70%);
        top: 40%;
        left: 60%;
        animation-delay: -15s;
    }

    @keyframes tgOrbFloat {
        0%, 100% { transform: translate(0, 0) scale(1); }
        33% { transform: translate(30px, -40px) scale(1.1); }
        66% { transform: translate(-20px, 30px) scale(0.9); }
    }

    /* Partículas sutiles */
    .tg-particles {
        position: absolute;
        inset: 0;
    }

    .tg-particle {
        position: absolute;
        width: 2px;
        height: 2px;
        background: var(--tg-neon);
        border-radius: 50%;
        opacity: 0;
        animation: tgParticleRise 18s linear infinite;
    }

    @keyframes tgParticleRise {
        0% { opacity: 0; transform: translateY(100vh) scale(0); }
        10% { opacity: 0.6; }
        90% { opacity: 0.3; }
        100% { opacity: 0; transform: translateY(-10vh) scale(1); }
    }

    /* ═══════════════════════════════════════════════════════════════════════════
       CONTENIDO PRINCIPAL
       ═══════════════════════════════════════════════════════════════════════════ */
    .tg-content {
        position: relative;
        z-index: 10;
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 40px 20px;
    }

    .tg-screen {
        display: none;
        width: 100%;
        max-width: 650px;
        text-align: center;
    }

    .tg-screen.active {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    /* ═══════════════════════════════════════════════════════════════════════════
       TIPOGRAFÍA
       ═══════════════════════════════════════════════════════════════════════════ */
    .tg-title {
        font-family: 'Cinzel', serif !important;
        color: var(--tg-gold) !important;
        font-size: clamp(1.8rem, 5vw, 2.5rem) !important;
        font-weight: 600 !important;
        letter-spacing: 3px !important;
        text-transform: uppercase !important;
        margin-bottom: 20px !important;
        text-shadow: 0 0 40px var(--tg-gold-soft) !important;
        background: none !important;
    }

    .tg-subtitle {
        color: var(--tg-text-soft) !important;
        font-size: 1.15rem !important;
        font-style: italic;
        margin-bottom: 35px;
        line-height: 1.6;
    }

    /* ═══════════════════════════════════════════════════════════════════════════
       INDICADOR DE PROGRESO (Runas)
       ═══════════════════════════════════════════════════════════════════════════ */
    .tg-progress {
        position: fixed;
        top: 25px;
        left: 50%;
        transform: translateX(-50%);
        display: flex;
        gap: 12px;
        z-index: 100;
    }

    .tg-rune {
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background: rgba(59, 130, 246, 0.2);
        border: 1px solid var(--tg-border);
        transition: all 0.5s ease;
    }

    .tg-rune.active {
        background: var(--tg-neon);
        box-shadow: 0 0 15px var(--tg-neon-glow);
    }

    .tg-rune.completed {
        background: var(--tg-gold);
        border-color: var(--tg-gold);
        box-shadow: 0 0 10px var(--tg-gold-soft);
    }

    /* ═══════════════════════════════════════════════════════════════════════════
       PREGUNTAS
       ═══════════════════════════════════════════════════════════════════════════ */
    .tg-question {
        text-align: center;
        margin-bottom: 45px;
    }

    .tg-question-num {
        color: var(--tg-neon);
        font-family: 'Cinzel', serif;
        font-size: 0.75rem;
        letter-spacing: 4px;
        margin-bottom: 20px;
        opacity: 0.7;
    }

    .tg-question-text {
        color: var(--tg-text);
        font-family: 'Cormorant Garamond', serif;
        font-size: clamp(1.4rem, 4vw, 1.9rem);
        font-style: italic;
        font-weight: 500;
        line-height: 1.5;
        max-width: 580px;
        margin: 0 auto;
    }

    /* Animación letra por letra */
    .tg-letter {
        display: inline-block;
        opacity: 0;
        animation: tgLetterIn 0.3s ease forwards;
    }

    @keyframes tgLetterIn {
        from { opacity: 0; transform: translateY(12px); }
        to { opacity: 1; transform: translateY(0); }
    }

    /* ═══════════════════════════════════════════════════════════════════════════
       MYSTIC BUBBLE BUTTONS - ESTILO NEÓN AZUL OBLIGATORIO
       ═══════════════════════════════════════════════════════════════════════════ */
    .tg-options {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 14px;
        width: 100%;
        max-width: 480px;
        margin: 0 auto;
    }

    #tg-app .tg-bubble,
    #tg-app button.tg-bubble {
        background: #000000 !important;
        color: var(--tg-text) !important;
        border: 2px solid var(--tg-neon) !important;
        border-radius: 50px !important;
        padding: 16px 32px !important;
        font-family: 'Cormorant Garamond', serif !important;
        font-size: 1.05rem !important;
        font-weight: 500 !important;
        letter-spacing: 0.3px !important;
        cursor: pointer !important;
        width: 100% !important;
        max-width: 400px !important;
        text-align: center !important;
        opacity: 0;
        transform: translateY(18px);
        transition: all 0.25s ease !important;
        box-shadow:
            0 0 15px var(--tg-neon-glow),
            0 0 30px rgba(59, 130, 246, 0.15),
            inset 0 0 20px rgba(59, 130, 246, 0.05) !important;
        outline: none !important;
    }

    #tg-app .tg-bubble.visible {
        animation: tgBubbleAppear 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }

    @keyframes tgBubbleAppear {
        0% { opacity: 0; transform: translateY(18px); }
        100% { opacity: 1; transform: translateY(0); }
    }

    #tg-app .tg-bubble:hover {
        background: rgba(59, 130, 246, 0.1) !important;
        transform: scale(1.02) !important;
        box-shadow:
            0 0 25px var(--tg-neon-glow),
            0 0 50px rgba(59, 130, 246, 0.2),
            inset 0 0 30px rgba(59, 130, 246, 0.1) !important;
    }

    #tg-app .tg-bubble:active {
        transform: scale(0.98) !important;
    }

    #tg-app .tg-bubble.selected {
        background: var(--tg-neon) !important;
        color: #000 !important;
        animation: tgBubblePop 0.4s ease forwards;
    }

    @keyframes tgBubblePop {
        0% { transform: scale(1); }
        30% { transform: scale(1.08); }
        100% { transform: scale(0); opacity: 0; }
    }

    /* ═══════════════════════════════════════════════════════════════════════════
       TEXTO LIBRE
       ═══════════════════════════════════════════════════════════════════════════ */
    .tg-freetext {
        width: 100%;
        max-width: 500px;
        margin: 0 auto;
    }

    .tg-freetext textarea {
        width: 100%;
        min-height: 120px;
        background: var(--tg-glass);
        border: 1px solid var(--tg-border);
        border-radius: 16px;
        color: var(--tg-text);
        font-family: 'Cormorant Garamond', serif;
        font-size: 1.15rem;
        font-style: italic;
        padding: 20px;
        resize: none;
        outline: none;
        transition: all 0.3s ease;
    }

    .tg-freetext textarea:focus {
        border-color: var(--tg-neon);
        box-shadow: 0 0 20px var(--tg-neon-glow);
    }

    .tg-freetext textarea::placeholder {
        color: rgba(245, 247, 255, 0.35);
    }

    .tg-freetext-hint {
        color: var(--tg-text-soft);
        font-size: 0.9rem;
        margin-top: 12px;
        font-style: italic;
    }

    /* ═══════════════════════════════════════════════════════════════════════════
       BOTÓN CONTINUAR (para texto libre)
       ═══════════════════════════════════════════════════════════════════════════ */
    #tg-app .tg-continue {
        background: transparent !important;
        border: 2px solid var(--tg-gold) !important;
        color: var(--tg-gold) !important;
        padding: 16px 50px !important;
        border-radius: 50px !important;
        font-family: 'Cinzel', serif !important;
        font-size: 0.9rem !important;
        font-weight: 600 !important;
        letter-spacing: 2px !important;
        text-transform: uppercase !important;
        cursor: pointer !important;
        margin-top: 30px !important;
        transition: all 0.3s ease !important;
        outline: none !important;
    }

    #tg-app .tg-continue:hover {
        background: rgba(212, 175, 55, 0.1) !important;
        box-shadow: 0 0 25px var(--tg-gold-soft) !important;
    }

    /* ═══════════════════════════════════════════════════════════════════════════
       FORMULARIO IDENTIDAD (Q7)
       ═══════════════════════════════════════════════════════════════════════════ */
    .tg-identity {
        width: 100%;
        max-width: 450px;
        margin: 0 auto;
    }

    .tg-identity-title {
        font-family: 'Cinzel', serif;
        color: var(--tg-gold);
        font-size: 1.1rem;
        letter-spacing: 2px;
        margin-bottom: 30px;
        text-transform: uppercase;
    }

    .tg-field {
        margin-bottom: 25px;
        text-align: left;
    }

    .tg-field label {
        display: block;
        color: var(--tg-text);
        font-family: 'Cinzel', serif;
        font-size: 0.8rem;
        letter-spacing: 1.5px;
        text-transform: uppercase;
        margin-bottom: 10px;
    }

    .tg-field input,
    .tg-field select {
        width: 100%;
        background: var(--tg-glass);
        border: 1px solid var(--tg-border);
        border-radius: 12px;
        color: var(--tg-text);
        font-family: 'Cormorant Garamond', serif;
        font-size: 1.1rem;
        padding: 14px 18px;
        outline: none;
        transition: all 0.3s ease;
    }

    .tg-field input:focus,
    .tg-field select:focus {
        border-color: var(--tg-neon);
        box-shadow: 0 0 15px var(--tg-neon-glow);
    }

    .tg-field input::placeholder {
        color: rgba(245, 247, 255, 0.3);
    }

    .tg-field .optional {
        color: var(--tg-text-soft);
        font-size: 0.75rem;
        font-style: italic;
        margin-left: 8px;
    }

    .tg-identity-disclaimer {
        color: var(--tg-text-soft);
        font-size: 0.9rem;
        font-style: italic;
        margin-top: 25px;
        padding: 15px;
        background: var(--tg-glass);
        border-radius: 12px;
        border: 1px solid rgba(59, 130, 246, 0.1);
    }

    #tg-app .tg-reveal-btn {
        background: linear-gradient(135deg, var(--tg-neon), #2563EB) !important;
        color: #fff !important;
        border: none !important;
        padding: 18px 45px !important;
        border-radius: 50px !important;
        font-family: 'Cinzel', serif !important;
        font-size: 0.95rem !important;
        font-weight: 600 !important;
        letter-spacing: 2px !important;
        text-transform: uppercase !important;
        cursor: pointer !important;
        margin-top: 35px !important;
        transition: all 0.3s ease !important;
        box-shadow: 0 0 30px var(--tg-neon-glow) !important;
        outline: none !important;
    }

    #tg-app .tg-reveal-btn:hover {
        transform: translateY(-2px) !important;
        box-shadow: 0 0 50px var(--tg-neon-glow) !important;
    }

    /* ═══════════════════════════════════════════════════════════════════════════
       LOADER DE CANALIZACIÓN
       ═══════════════════════════════════════════════════════════════════════════ */
    .tg-loader {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 25px;
    }

    .tg-loader-spinner {
        width: 60px;
        height: 60px;
        border: 2px solid var(--tg-border);
        border-top-color: var(--tg-neon);
        border-radius: 50%;
        animation: tgSpin 1s linear infinite;
    }

    @keyframes tgSpin {
        to { transform: rotate(360deg); }
    }

    .tg-loader-text {
        color: var(--tg-text);
        font-size: 1.2rem;
        font-style: italic;
        animation: tgPulse 2s ease-in-out infinite;
    }

    @keyframes tgPulse {
        0%, 100% { opacity: 0.6; }
        50% { opacity: 1; }
    }

    .tg-loader-sub {
        color: var(--tg-neon);
        font-size: 0.95rem;
    }

    /* ═══════════════════════════════════════════════════════════════════════════
       PANTALLA FINAL - RESULTADO PREMIUM
       ═══════════════════════════════════════════════════════════════════════════ */
    .tg-result {
        width: 100%;
        max-width: 700px;
        text-align: center;
        padding: 20px 0;
    }

    .tg-result-title {
        font-family: 'Cinzel', serif;
        color: var(--tg-gold);
        font-size: clamp(1.6rem, 5vw, 2.2rem);
        font-weight: 600;
        margin-bottom: 10px;
        text-shadow: 0 0 40px var(--tg-gold-soft);
    }

    .tg-result-subtitle {
        color: var(--tg-text-soft);
        font-size: 1.1rem;
        font-style: italic;
        margin-bottom: 35px;
    }

    /* Bloque Revelación Emocional */
    .tg-revelation {
        background: var(--tg-glass);
        border: 1px solid var(--tg-border);
        border-radius: 20px;
        padding: 30px;
        margin-bottom: 40px;
        text-align: left;
    }

    .tg-revelation p {
        color: var(--tg-text);
        font-size: 1.1rem;
        line-height: 1.8;
        margin-bottom: 15px;
    }

    .tg-revelation p:last-child {
        margin-bottom: 0;
    }

    .tg-revelation .highlight {
        color: var(--tg-neon);
        font-weight: 500;
    }

    /* Círculo de Guardianes */
    .tg-guardians {
        margin: 40px 0;
    }

    .tg-guardians-title {
        font-family: 'Cinzel', serif;
        color: var(--tg-text);
        font-size: 0.85rem;
        letter-spacing: 3px;
        text-transform: uppercase;
        margin-bottom: 30px;
        opacity: 0.7;
    }

    .tg-guardians-grid {
        display: flex;
        justify-content: center;
        align-items: flex-end;
        gap: 25px;
        flex-wrap: wrap;
    }

    /* Duende Principal */
    .tg-guardian-main {
        display: flex;
        flex-direction: column;
        align-items: center;
        max-width: 280px;
    }

    .tg-guardian-main .tg-guardian-img {
        width: 200px;
        height: 200px;
        border-radius: 50%;
        object-fit: cover;
        border: 3px solid var(--tg-neon);
        box-shadow:
            0 0 30px var(--tg-neon-glow),
            0 0 60px rgba(59, 130, 246, 0.2);
        margin-bottom: 20px;
        transition: all 0.3s ease;
    }

    .tg-guardian-main:hover .tg-guardian-img {
        box-shadow:
            0 0 40px var(--tg-neon-glow),
            0 0 80px rgba(59, 130, 246, 0.3);
    }

    .tg-guardian-main .tg-guardian-name {
        font-family: 'Cinzel', serif;
        color: var(--tg-text);
        font-size: 1.3rem;
        font-weight: 600;
        margin-bottom: 8px;
    }

    .tg-guardian-main .tg-guardian-price {
        color: var(--tg-gold);
        font-family: 'Cinzel', serif;
        font-size: 1.2rem;
        font-weight: 600;
        margin-bottom: 10px;
    }

    .tg-guardian-main .tg-guardian-scarcity {
        color: var(--tg-text-soft);
        font-size: 0.85rem;
        font-style: italic;
        margin-bottom: 18px;
    }

    .tg-guardian-main .tg-cta-primary {
        background: linear-gradient(135deg, var(--tg-neon), #2563EB) !important;
        color: #fff !important;
        border: none !important;
        padding: 14px 28px !important;
        border-radius: 50px !important;
        font-family: 'Cinzel', serif !important;
        font-size: 0.8rem !important;
        font-weight: 600 !important;
        letter-spacing: 1px !important;
        text-transform: uppercase !important;
        text-decoration: none !important;
        display: inline-block !important;
        transition: all 0.3s ease !important;
        box-shadow: 0 0 25px var(--tg-neon-glow) !important;
    }

    .tg-guardian-main .tg-cta-primary:hover {
        transform: translateY(-2px) !important;
        box-shadow: 0 0 40px var(--tg-neon-glow) !important;
    }

    .tg-guardian-main .tg-cta-secondary {
        color: var(--tg-text-soft) !important;
        font-size: 0.8rem !important;
        text-decoration: underline !important;
        margin-top: 12px !important;
        display: inline-block !important;
        transition: color 0.2s !important;
    }

    .tg-guardian-main .tg-cta-secondary:hover {
        color: var(--tg-text) !important;
    }

    /* Duendes Alternativos */
    .tg-guardian-alt {
        display: flex;
        flex-direction: column;
        align-items: center;
        max-width: 150px;
        opacity: 0.85;
        transition: all 0.3s ease;
    }

    .tg-guardian-alt:hover {
        opacity: 1;
    }

    .tg-guardian-alt .tg-guardian-img {
        width: 120px;
        height: 120px;
        border-radius: 50%;
        object-fit: cover;
        border: 2px solid var(--tg-border);
        box-shadow: 0 0 20px rgba(59, 130, 246, 0.15);
        margin-bottom: 12px;
        transition: all 0.3s ease;
    }

    .tg-guardian-alt:hover .tg-guardian-img {
        border-color: var(--tg-neon);
        box-shadow: 0 0 30px var(--tg-neon-glow);
    }

    .tg-guardian-alt .tg-guardian-name {
        font-family: 'Cinzel', serif;
        color: var(--tg-text);
        font-size: 0.95rem;
        font-weight: 500;
        margin-bottom: 5px;
    }

    .tg-guardian-alt .tg-guardian-price {
        color: var(--tg-gold-soft);
        font-size: 0.9rem;
    }

    .tg-guardian-alt a {
        text-decoration: none;
    }

    /* Por qué estos guardianes */
    .tg-why {
        background: var(--tg-glass);
        border: 1px solid rgba(59, 130, 246, 0.15);
        border-radius: 16px;
        padding: 25px;
        margin: 35px 0;
        text-align: left;
    }

    .tg-why h4 {
        font-family: 'Cinzel', serif;
        color: var(--tg-text);
        font-size: 0.85rem;
        letter-spacing: 2px;
        text-transform: uppercase;
        margin-bottom: 18px;
        opacity: 0.8;
    }

    .tg-why ul {
        list-style: none;
        padding: 0;
    }

    .tg-why li {
        color: var(--tg-text-soft);
        font-size: 1rem;
        line-height: 1.6;
        padding-left: 25px;
        margin-bottom: 12px;
        position: relative;
    }

    .tg-why li::before {
        content: '✦';
        position: absolute;
        left: 0;
        color: var(--tg-neon);
        font-size: 0.8rem;
    }

    /* Ritual */
    .tg-ritual {
        background: var(--tg-glass);
        border: 1px solid var(--tg-border);
        border-radius: 16px;
        padding: 25px 30px;
        margin: 35px 0;
    }

    .tg-ritual h4 {
        font-family: 'Cinzel', serif;
        color: var(--tg-neon);
        font-size: 0.9rem;
        letter-spacing: 2px;
        text-transform: uppercase;
        margin-bottom: 15px;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
    }

    .tg-ritual p {
        color: var(--tg-text);
        font-size: 1.1rem;
        line-height: 1.7;
        font-style: italic;
    }

    /* Frase Sellada */
    .tg-sealed {
        margin: 40px 0 30px;
        padding: 25px;
        background: linear-gradient(135deg, rgba(59, 130, 246, 0.08), transparent);
        border: 1px solid var(--tg-border);
        border-radius: 16px;
    }

    .tg-sealed-phrase {
        font-family: 'Cinzel', serif;
        color: var(--tg-gold);
        font-size: 1.3rem;
        font-weight: 500;
        line-height: 1.5;
        margin-bottom: 20px;
    }

    .tg-sealed-btn {
        background: transparent !important;
        border: 1px solid var(--tg-gold-soft) !important;
        color: var(--tg-gold) !important;
        padding: 10px 25px !important;
        border-radius: 50px !important;
        font-family: 'Cinzel', serif !important;
        font-size: 0.75rem !important;
        letter-spacing: 1px !important;
        text-transform: uppercase !important;
        cursor: pointer !important;
        transition: all 0.3s !important;
    }

    .tg-sealed-btn:hover {
        background: rgba(212, 175, 55, 0.1) !important;
        box-shadow: 0 0 20px var(--tg-gold-soft) !important;
    }

    /* Restart */
    .tg-restart {
        color: var(--tg-text-soft);
        font-size: 0.9rem;
        background: none;
        border: none;
        cursor: pointer;
        margin-top: 30px;
        text-decoration: underline;
        transition: color 0.2s;
    }

    .tg-restart:hover {
        color: var(--tg-text);
    }

    /* ═══════════════════════════════════════════════════════════════════════════
       PANTALLA MÚSICA
       ═══════════════════════════════════════════════════════════════════════════ */
    .tg-music-activator {
        width: 150px;
        height: 150px;
        margin: 40px auto;
        position: relative;
        cursor: pointer;
    }

    .tg-music-icon {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }

    .tg-music-icon svg {
        width: 50px;
        height: 50px;
        stroke: var(--tg-neon);
        fill: none;
        stroke-width: 1.5;
        filter: drop-shadow(0 0 15px var(--tg-neon-glow));
    }

    .tg-music-ring {
        position: absolute;
        border: 1px solid var(--tg-border);
        border-radius: 50%;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        animation: tgRingExpand 3s ease-out infinite;
    }

    .tg-music-ring:nth-child(1) { width: 80px; height: 80px; }
    .tg-music-ring:nth-child(2) { width: 110px; height: 110px; animation-delay: 1s; }
    .tg-music-ring:nth-child(3) { width: 140px; height: 140px; animation-delay: 2s; }

    @keyframes tgRingExpand {
        0% { opacity: 0.6; transform: translate(-50%, -50%) scale(0.8); }
        100% { opacity: 0; transform: translate(-50%, -50%) scale(1.3); }
    }

    .tg-skip-music {
        background: transparent !important;
        border: 1px solid var(--tg-border) !important;
        color: var(--tg-text-soft) !important;
        padding: 12px 30px !important;
        border-radius: 50px !important;
        font-family: 'Cinzel', serif !important;
        font-size: 0.8rem !important;
        letter-spacing: 1px !important;
        cursor: pointer !important;
        margin-top: 40px !important;
        transition: all 0.3s !important;
    }

    .tg-skip-music:hover {
        border-color: var(--tg-neon) !important;
        color: var(--tg-text) !important;
    }

    /* ═══════════════════════════════════════════════════════════════════════════
       RESPONSIVE
       ═══════════════════════════════════════════════════════════════════════════ */
    @media (max-width: 768px) {
        .tg-content {
            padding: 30px 15px;
        }

        .tg-guardians-grid {
            flex-direction: column;
            align-items: center;
        }

        .tg-guardian-alt {
            max-width: none;
            flex-direction: row;
            gap: 15px;
            width: 100%;
            justify-content: center;
        }

        .tg-guardian-alt .tg-guardian-img {
            width: 80px;
            height: 80px;
        }
    }

    @media (max-width: 480px) {
        .tg-title {
            font-size: 1.5rem !important;
        }

        .tg-question-text {
            font-size: 1.3rem;
        }

        #tg-app .tg-bubble {
            padding: 14px 24px !important;
            font-size: 1rem !important;
        }
    }
    </style>

    <!-- HTML STRUCTURE -->
    <div id="tg-app">
        <div class="tg-bg">
            <div class="tg-orb tg-orb-1"></div>
            <div class="tg-orb tg-orb-2"></div>
            <div class="tg-orb tg-orb-3"></div>
            <div class="tg-particles" id="tg-particles"></div>
        </div>

        <div class="tg-content">
            <!-- Progress -->
            <div class="tg-progress" id="tg-progress"></div>

            <!-- Screen: Music -->
            <div class="tg-screen active" id="screen-music">
                <p class="tg-subtitle">Experiencia inmersiva</p>
                <div class="tg-music-activator" onclick="TG.startWithMusic()">
                    <div class="tg-music-ring"></div>
                    <div class="tg-music-ring"></div>
                    <div class="tg-music-ring"></div>
                    <div class="tg-music-icon">
                        <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polygon points="10,8 16,12 10,16"/></svg>
                    </div>
                </div>
                <p style="color: var(--tg-text-soft); font-size: 0.9rem;">Tocá para activar el sonido</p>
                <button class="tg-skip-music" onclick="TG.startWithoutMusic()">Continuar en silencio</button>
            </div>

            <!-- Screen: Intro -->
            <div class="tg-screen" id="screen-intro">
                <h1 class="tg-title">El Test del Guardián</h1>
                <p class="tg-subtitle">El guardián te elige a vos.<br>Descubrí cuál está esperándote.</p>
                <button class="tg-bubble visible" onclick="TG.begin()" style="opacity:1;transform:none;">Comenzar</button>
            </div>

            <!-- Screen: Questions -->
            <div class="tg-screen" id="screen-questions">
                <div class="tg-question">
                    <div class="tg-question-num" id="q-num"></div>
                    <div class="tg-question-text" id="q-text"></div>
                </div>
                <div class="tg-options" id="q-options"></div>
                <div class="tg-freetext" id="q-freetext" style="display:none;">
                    <textarea id="q-textarea" placeholder=""></textarea>
                    <p class="tg-freetext-hint">Escribí lo que sientas. No hay respuesta incorrecta.</p>
                    <button class="tg-continue" onclick="TG.submitFreetext()">Continuar</button>
                </div>
            </div>

            <!-- Screen: Identity (Q7) -->
            <div class="tg-screen" id="screen-identity">
                <h2 class="tg-title" style="font-size:1.4rem !important;">Último paso</h2>
                <p class="tg-identity-title">El portal necesita tu llave</p>

                <div class="tg-identity">
                    <div class="tg-field">
                        <label>Nombre completo</label>
                        <input type="text" id="id-name" placeholder="Tu nombre...">
                    </div>
                    <div class="tg-field">
                        <label>Fecha de nacimiento</label>
                        <input type="date" id="id-birth">
                    </div>
                    <div class="tg-field">
                        <label>País</label>
                        <select id="id-country">
                            <option value="">Seleccioná tu país...</option>
                            <option value="AR">Argentina</option>
                            <option value="UY">Uruguay</option>
                            <option value="CL">Chile</option>
                            <option value="MX">México</option>
                            <option value="CO">Colombia</option>
                            <option value="PE">Perú</option>
                            <option value="ES">España</option>
                            <option value="US">Estados Unidos</option>
                            <option value="OT">Otro</option>
                        </select>
                    </div>
                    <div class="tg-field">
                        <label>Email</label>
                        <input type="email" id="id-email" placeholder="tu@email.com">
                    </div>
                    <div class="tg-field">
                        <label>WhatsApp <span class="optional">(opcional)</span></label>
                        <input type="tel" id="id-whatsapp" placeholder="+54 9 11...">
                    </div>

                    <p class="tg-identity-disclaimer">
                        Esto no es un formulario. Es el momento en que tu energía queda marcada.
                    </p>

                    <button class="tg-reveal-btn" onclick="TG.reveal()">Revelar mi Guardián</button>
                </div>
            </div>

            <!-- Screen: Loading -->
            <div class="tg-screen" id="screen-loading">
                <div class="tg-loader">
                    <div class="tg-loader-spinner"></div>
                    <p class="tg-loader-text" id="loader-text">Leyendo tu señal...</p>
                    <p class="tg-loader-sub">Tu guardián está siendo revelado</p>
                </div>
            </div>

            <!-- Screen: Result -->
            <div class="tg-screen" id="screen-result">
                <div class="tg-result" id="result-content">
                    <!-- Populated by JS -->
                </div>
            </div>
        </div>
    </div>

    <audio id="tg-audio" loop src="https://duendesuy.10web.cloud/wp-content/uploads/2026/01/ES_Words-of-an-Angel-Kikoru.mp3"></audio>

    <script>
    var TG = {
        ajaxUrl: '<?php echo $ajax_url; ?>',
        vercelApi: 'https://duendes-vercel.vercel.app/api',
        audio: null,
        currentQ: 0,
        answers: {},
        identity: {},
        visitorId: null,

        // 7 Preguntas obligatorias
        questions: [
            {
                id: 'q1_for_whom',
                type: 'options',
                text: '¿Este guardián es para vos o para alguien especial?',
                options: [
                    {id: 'self', text: 'Es para mí'},
                    {id: 'gift', text: 'Es un regalo'}
                ]
            },
            {
                id: 'q2_pain',
                type: 'options',
                text: '¿Qué sentís que más estás sosteniendo sola últimamente?',
                options: [
                    {id: 'exhausted', text: 'Estoy agotada de ser la fuerte', pain: 'agotamiento'},
                    {id: 'protection', text: 'Necesito protección (me estoy cargando de todo)', pain: 'proteccion'},
                    {id: 'lonely', text: 'Me siento sola aunque esté con gente', pain: 'soledad'},
                    {id: 'patterns', text: 'Repito patrones y no sé cómo cortarlos', pain: 'patrones'},
                    {id: 'love', text: 'Quiero amor, pero me cuesta confiar', pain: 'amor'}
                ]
            },
            {
                id: 'q3_body',
                type: 'options',
                text: '¿Dónde lo sentís primero en el cuerpo?',
                options: [
                    {id: 'chest', text: 'Pecho apretado', body: 'pecho'},
                    {id: 'throat', text: 'Nudo en la garganta', body: 'garganta'},
                    {id: 'fatigue', text: 'Cansancio que no se va', body: 'cansancio'},
                    {id: 'anxiety', text: 'Ansiedad en la cabeza', body: 'cabeza'},
                    {id: 'gut', text: 'Panza/intuición cargada', body: 'intuicion'}
                ]
            },
            {
                id: 'q4_soul',
                type: 'freetext',
                text: '¿Qué te está pidiendo tu alma hace rato?',
                placeholder: 'Mi alma me pide…'
            },
            {
                id: 'q5_universe',
                type: 'freetext',
                text: 'Si el universo hoy te diera una sola respuesta… ¿qué te gustaría escuchar?',
                placeholder: 'Me gustaría que me diga…'
            },
            {
                id: 'q6_magic_style',
                type: 'options',
                text: '¿Cómo te gusta recibir la magia?',
                options: [
                    {id: 'fast', text: 'Directa y rápida (necesito alivio ya)', style: 'rapida'},
                    {id: 'deep', text: 'Profunda y transformadora', style: 'profunda'},
                    {id: 'soft', text: 'Suave y amorosa', style: 'suave'},
                    {id: 'firm', text: 'Firme y protectora', style: 'protectora'},
                    {id: 'signal', text: 'Como señal para volver a mí', style: 'señal'}
                ]
            }
        ],

        loaderPhrases: [
            'Leyendo tu señal...',
            'Conectando con los portales...',
            'Tu energía está siendo escuchada...',
            'Buscando a quien te espera...',
            'El guardián se acerca...'
        ],

        init: function() {
            this.createParticles();
            this.createProgress();
            this.loadVisitorId();
            this.trackEvent('tg_start');
        },

        createParticles: function() {
            var container = document.getElementById('tg-particles');
            if (!container) return;
            for (var i = 0; i < 20; i++) {
                var p = document.createElement('div');
                p.className = 'tg-particle';
                p.style.left = Math.random() * 100 + '%';
                p.style.animationDelay = Math.random() * 18 + 's';
                container.appendChild(p);
            }
        },

        createProgress: function() {
            var container = document.getElementById('tg-progress');
            if (!container) return;
            for (var i = 0; i < 7; i++) {
                var rune = document.createElement('div');
                rune.className = 'tg-rune';
                rune.dataset.index = i;
                container.appendChild(rune);
            }
        },

        updateProgress: function(index) {
            var runes = document.querySelectorAll('.tg-rune');
            runes.forEach(function(r, i) {
                r.classList.remove('active', 'completed');
                if (i < index) r.classList.add('completed');
                if (i === index) r.classList.add('active');
            });
        },

        loadVisitorId: function() {
            var stored = localStorage.getItem('duendes_visitor_id');
            if (stored) {
                this.visitorId = stored;
            } else {
                this.visitorId = 'v_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
                localStorage.setItem('duendes_visitor_id', this.visitorId);
            }
        },

        show: function(screenId) {
            document.querySelectorAll('.tg-screen').forEach(function(s) {
                s.classList.remove('active');
            });
            document.getElementById(screenId).classList.add('active');
        },

        startWithMusic: function() {
            this.audio = document.getElementById('tg-audio');
            if (this.audio) {
                this.audio.volume = 0.3;
                this.audio.play().catch(function() {});
            }
            this.show('screen-intro');
        },

        startWithoutMusic: function() {
            this.show('screen-intro');
        },

        begin: function() {
            this.currentQ = 0;
            this.answers = {};
            this.show('screen-questions');
            this.showQuestion();
        },

        animateText: function(text, container, callback) {
            container.innerHTML = '';
            var words = text.split(' ');
            var delay = 0;

            words.forEach(function(word, wi) {
                var wordSpan = document.createElement('span');
                wordSpan.style.display = 'inline-block';
                wordSpan.style.marginRight = '0.25em';

                word.split('').forEach(function(char) {
                    var charSpan = document.createElement('span');
                    charSpan.className = 'tg-letter';
                    charSpan.textContent = char;
                    charSpan.style.animationDelay = delay + 's';
                    wordSpan.appendChild(charSpan);
                    delay += 0.02;
                });

                container.appendChild(wordSpan);
            });

            if (callback) setTimeout(callback, delay * 1000 + 300);
        },

        showQuestion: function() {
            var q = this.questions[this.currentQ];
            var numEl = document.getElementById('q-num');
            var textEl = document.getElementById('q-text');
            var optionsEl = document.getElementById('q-options');
            var freetextEl = document.getElementById('q-freetext');

            numEl.textContent = (this.currentQ + 1) + ' / 7';
            this.updateProgress(this.currentQ);

            optionsEl.innerHTML = '';
            optionsEl.style.display = 'none';
            freetextEl.style.display = 'none';

            var self = this;
            this.animateText(q.text, textEl, function() {
                if (q.type === 'options') {
                    optionsEl.style.display = 'flex';
                    q.options.forEach(function(opt, i) {
                        var btn = document.createElement('button');
                        btn.className = 'tg-bubble';
                        btn.textContent = opt.text;
                        btn.onclick = function() { self.selectOption(opt, btn); };
                        optionsEl.appendChild(btn);

                        // Stagger animation 100ms
                        setTimeout(function() {
                            btn.classList.add('visible');
                        }, i * 100);
                    });
                } else {
                    freetextEl.style.display = 'block';
                    var textarea = document.getElementById('q-textarea');
                    textarea.value = '';
                    textarea.placeholder = q.placeholder || '';
                    setTimeout(function() { textarea.focus(); }, 300);
                }
            });

            this.trackEvent('tg_question_answered', {question: q.id, index: this.currentQ});
        },

        selectOption: function(opt, btn) {
            var q = this.questions[this.currentQ];
            this.answers[q.id] = opt;

            btn.classList.add('selected');
            document.querySelectorAll('.tg-bubble').forEach(function(b) {
                if (b !== btn) b.style.opacity = '0';
            });

            var self = this;
            setTimeout(function() {
                self.nextQuestion();
            }, 450);
        },

        submitFreetext: function() {
            var q = this.questions[this.currentQ];
            var text = document.getElementById('q-textarea').value.trim();

            if (!text) {
                alert('Por favor escribí algo antes de continuar');
                return;
            }

            this.answers[q.id] = {text: text};
            this.nextQuestion();
        },

        nextQuestion: function() {
            this.currentQ++;

            if (this.currentQ < this.questions.length) {
                this.showQuestion();
            } else {
                this.updateProgress(7);
                this.show('screen-identity');
            }
        },

        reveal: function() {
            var name = document.getElementById('id-name').value.trim();
            var birth = document.getElementById('id-birth').value;
            var country = document.getElementById('id-country').value;
            var email = document.getElementById('id-email').value.trim();
            var whatsapp = document.getElementById('id-whatsapp').value.trim();

            if (!name) { alert('Por favor ingresá tu nombre'); return; }
            if (!birth) { alert('Por favor ingresá tu fecha de nacimiento'); return; }
            if (!country) { alert('Por favor seleccioná tu país'); return; }
            if (!email) { alert('Por favor ingresá tu email'); return; }

            this.identity = {
                name: name,
                birth: birth,
                country: country,
                email: email,
                whatsapp: whatsapp
            };

            this.show('screen-loading');
            this.animateLoader();
            this.processResult();
        },

        animateLoader: function() {
            var self = this;
            var textEl = document.getElementById('loader-text');
            var index = 0;

            var interval = setInterval(function() {
                index = (index + 1) % self.loaderPhrases.length;
                textEl.textContent = self.loaderPhrases[index];
            }, 2000);

            setTimeout(function() {
                clearInterval(interval);
            }, 10000);
        },

        processResult: function() {
            var self = this;

            // Preparar datos
            var testData = {
                visitor_id: this.visitorId,
                identity: this.identity,
                answers: this.answers,
                timestamp: new Date().toISOString()
            };

            // Guardar en localStorage
            localStorage.setItem('duendes_test_data', JSON.stringify(testData));

            // 1. Llamar a IA para interpretación
            // 2. Cargar productos
            // 3. Mostrar resultado

            Promise.all([
                this.callInterpretation(testData),
                this.loadProducts()
            ]).then(function(results) {
                var interpretation = results[0];
                var products = results[1];

                self.renderResult(interpretation, products);
                self.saveProfile(testData, interpretation);
                self.trackEvent('tg_completed');

            }).catch(function(err) {
                console.error('Error:', err);
                // Fallback
                self.renderFallbackResult();
            });
        },

        callInterpretation: function(data) {
            return fetch(this.vercelApi + '/guardian/interpret', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(data)
            })
            .then(function(r) { return r.json(); })
            .catch(function() {
                // Fallback interpretation
                return {
                    summary_emotional: 'Tu energía habla de alguien que ha sostenido demasiado. Pero hay una parte de vos que todavía cree... y esa parte te trajo hasta acá.',
                    mirror_lines: [
                        'Leí tu señal con respeto.',
                        'Sentí algo claro: estás lista para soltar lo que ya no es tuyo.'
                    ],
                    intent: 'proteccion',
                    ritual_text: 'Esta noche, apoyá la mano en tu pecho y decí: "Hoy me elijo. Hoy vuelvo a mí."',
                    sealed_phrase: 'Tu energía no está rota. Está despertando.',
                    why_reasons: [
                        'Porque tu energía pidió protección sin palabras',
                        'Porque sentí el cansancio de quien ha dado demasiado',
                        'Porque el guardián que te eligió sabe sostenerte'
                    ]
                };
            });
        },

        loadProducts: function() {
            var self = this;
            var intent = 'proteccion';

            // Detectar intención desde respuestas
            if (this.answers.q2_pain) {
                var pain = this.answers.q2_pain.pain;
                if (pain === 'amor') intent = 'amor';
                else if (pain === 'agotamiento' || pain === 'patrones') intent = 'sanacion';
                else intent = 'proteccion';
            }

            var formData = new FormData();
            formData.append('action', 'duendes_get_productos');
            formData.append('categoria', intent);
            formData.append('limite', 3);

            return fetch(this.ajaxUrl, {
                method: 'POST',
                body: formData
            })
            .then(function(r) { return r.json(); })
            .then(function(data) {
                if (data.success && data.data.length > 0) {
                    return data.data;
                }
                // Fallback sin categoría
                var fd2 = new FormData();
                fd2.append('action', 'duendes_get_productos');
                fd2.append('limite', 3);
                return fetch(self.ajaxUrl, {method: 'POST', body: fd2})
                    .then(function(r) { return r.json(); })
                    .then(function(d) { return d.success ? d.data : []; });
            });
        },

        renderResult: function(interpretation, products) {
            var name = this.identity.name.split(' ')[0];
            var container = document.getElementById('result-content');

            var mainProduct = products[0] || null;
            var altProducts = products.slice(1, 3);

            var html = '';

            // Título
            html += '<h2 class="tg-result-title">' + name + ', tu guardián te encontró.</h2>';
            html += '<p class="tg-result-subtitle">No llegaste por casualidad.</p>';

            // Revelación emocional
            html += '<div class="tg-revelation">';
            if (interpretation.mirror_lines) {
                interpretation.mirror_lines.forEach(function(line) {
                    html += '<p>' + line + '</p>';
                });
            }
            html += '<p>' + (interpretation.summary_emotional || '') + '</p>';
            html += '</div>';

            // Círculo de Guardianes
            html += '<div class="tg-guardians">';
            html += '<p class="tg-guardians-title">Tu círculo de guardianes</p>';
            html += '<div class="tg-guardians-grid">';

            // Alternativo izquierdo
            if (altProducts[0]) {
                html += '<div class="tg-guardian-alt">';
                html += '<a href="' + altProducts[0].url + '" onclick="TG.trackEvent(\'tg_product_clicked\', {id:\'' + altProducts[0].id + '\'})">';
                html += '<img class="tg-guardian-img" src="' + altProducts[0].imagen + '" alt="' + altProducts[0].nombre + '">';
                html += '</a>';
                html += '<div class="tg-guardian-name">' + altProducts[0].nombre + '</div>';
                html += '<div class="tg-guardian-price">' + altProducts[0].precio + '</div>';
                html += '</div>';
            }

            // Principal
            if (mainProduct) {
                var mainName = mainProduct.nombre.split(' ')[0];
                html += '<div class="tg-guardian-main">';
                html += '<img class="tg-guardian-img" src="' + mainProduct.imagen + '" alt="' + mainProduct.nombre + '">';
                html += '<div class="tg-guardian-name">' + mainProduct.nombre + '</div>';
                html += '<div class="tg-guardian-price">' + mainProduct.precio + '</div>';
                html += '<div class="tg-guardian-scarcity">Pieza única. Si se adopta, no vuelve.</div>';
                html += '<a href="' + mainProduct.url + '" class="tg-cta-primary" onclick="TG.trackEvent(\'tg_cta_pacto_clicked\', {id:\'' + mainProduct.id + '\'})">Sellar mi pacto con ' + mainName + '</a>';
                html += '<a href="' + mainProduct.url + '" class="tg-cta-secondary">Ver detalles</a>';
                html += '</div>';
            }

            // Alternativo derecho
            if (altProducts[1]) {
                html += '<div class="tg-guardian-alt">';
                html += '<a href="' + altProducts[1].url + '" onclick="TG.trackEvent(\'tg_product_clicked\', {id:\'' + altProducts[1].id + '\'})">';
                html += '<img class="tg-guardian-img" src="' + altProducts[1].imagen + '" alt="' + altProducts[1].nombre + '">';
                html += '</a>';
                html += '<div class="tg-guardian-name">' + altProducts[1].nombre + '</div>';
                html += '<div class="tg-guardian-price">' + altProducts[1].precio + '</div>';
                html += '</div>';
            }

            html += '</div>'; // grid
            html += '</div>'; // guardians

            // Por qué estos guardianes
            if (interpretation.why_reasons && interpretation.why_reasons.length > 0) {
                html += '<div class="tg-why">';
                html += '<h4>Por qué estos guardianes</h4>';
                html += '<ul>';
                interpretation.why_reasons.forEach(function(reason) {
                    html += '<li>' + reason + '</li>';
                });
                html += '</ul>';
                html += '</div>';
            }

            // Ritual
            if (interpretation.ritual_text) {
                html += '<div class="tg-ritual">';
                html += '<h4><span>✦</span> Tu ritual de conexión</h4>';
                html += '<p>' + interpretation.ritual_text + '</p>';
                html += '</div>';
            }

            // Frase sellada
            if (interpretation.sealed_phrase) {
                html += '<div class="tg-sealed">';
                html += '<p class="tg-sealed-phrase">"' + interpretation.sealed_phrase + '"</p>';
                html += '<button class="tg-sealed-btn" onclick="TG.saveSignal()">Guardar mi señal</button>';
                html += '</div>';
            }

            html += '<button class="tg-restart" onclick="TG.restart()">Hacer el test de nuevo</button>';

            container.innerHTML = html;
            this.show('screen-result');
        },

        renderFallbackResult: function() {
            this.renderResult({
                summary_emotional: 'Tu energía habla de alguien que busca. Y el hecho de estar acá dice mucho.',
                mirror_lines: ['Leí tu señal.', 'Algo en vos sabe que es momento de cambiar.'],
                ritual_text: 'Esta noche, apoyá la mano en tu pecho y respirá profundo tres veces.',
                sealed_phrase: 'Lo que te eligió no se equivoca.',
                why_reasons: [
                    'Porque tu energía lo llamó',
                    'Porque llegaste hasta acá',
                    'Porque estás lista'
                ]
            }, []);
        },

        saveProfile: function(testData, interpretation) {
            // Guardar en Vercel KV
            fetch(this.vercelApi + '/guardian/profile', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    visitor_id: this.visitorId,
                    identity: this.identity,
                    answers: this.answers,
                    interpretation: interpretation,
                    timestamp: new Date().toISOString()
                })
            }).catch(function(e) { console.log('Profile save error:', e); });
        },

        saveSignal: function() {
            // Opción simple: copiar al portapapeles o mostrar modal
            var phrase = document.querySelector('.tg-sealed-phrase');
            if (phrase) {
                var text = phrase.textContent;
                if (navigator.clipboard) {
                    navigator.clipboard.writeText(text);
                    alert('Frase copiada. Guardala en un lugar especial.');
                }
            }
        },

        restart: function() {
            if (this.audio) {
                this.audio.pause();
                this.audio.currentTime = 0;
            }
            this.currentQ = 0;
            this.answers = {};
            this.identity = {};
            this.show('screen-music');
        },

        trackEvent: function(event, data) {
            console.log('[TG Event]', event, data || {});
            // Aquí se puede integrar con analytics
            if (window.gtag) {
                gtag('event', event, data || {});
            }
        }
    };

    // Initialize
    TG.init();
    </script>
    <?php
}

// Shortcode vacío para compatibilidad
add_shortcode('duendes_test_guardian', function(){ return ''; });

// FIN TEST DEL GUARDIAN v3.0
