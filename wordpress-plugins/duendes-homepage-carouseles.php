<?php
/**
 * Plugin Name: Duendes Homepage Carouseles
 * Description: Carouseles de productos para la homepage - Estilo Neon
 * Version: 2.0
 * Author: Claude Code
 */

if (!defined('ABSPATH')) exit;

// Shortcode: Recién llegados
add_shortcode('duendes_recien_llegados', function($atts) {
    $atts = shortcode_atts(['limit' => 12], $atts);
    return duendes_carousel_html('recien_llegados', $atts['limit'], 'Recién Llegados', 'date', 'Llegaron esta semana. Algunos ya están reservados.');
});

// Shortcode: Más adoptados
add_shortcode('duendes_mas_adoptados', function($atts) {
    $atts = shortcode_atts(['limit' => 12], $atts);
    return duendes_carousel_html('mas_adoptados', $atts['limit'], 'Los Más Vistos', 'popularity', 'Varios ya fueron adoptados esta semana');
});

// Shortcode: Adoptados recientemente
add_shortcode('duendes_adoptados_recientemente', function($atts) {
    return duendes_adoptados_feed_html();
});

// Generar HTML del carousel
function duendes_carousel_html($id, $limit, $titulo, $orderby, $subtitulo = '') {
    $args = [
        'post_type' => 'product',
        'posts_per_page' => intval($limit),
        'post_status' => 'publish',
        'orderby' => $orderby === 'popularity' ? 'meta_value_num' : 'date',
        'order' => 'DESC',
    ];

    if ($orderby === 'popularity') {
        $args['meta_key'] = 'total_sales';
    }

    $query = new WP_Query($args);

    if (!$query->have_posts()) return '';

    $productos = [];
    while ($query->have_posts()) {
        $query->the_post();
        $product = wc_get_product(get_the_ID());
        if (!$product) continue;

        $cats = wp_get_post_terms(get_the_ID(), 'product_cat');
        $cat_nombres = [];
        foreach ($cats as $cat) {
            if (in_array($cat->slug, ['proteccion', 'amor', 'dinero-abundancia-negocios', 'salud', 'sabiduria-guia-claridad'])) {
                $cat_nombres[] = ucfirst(str_replace('-', ' ', $cat->slug));
            }
        }

        $productos[] = [
            'id' => get_the_ID(),
            'nombre' => $product->get_name(),
            'precio_html' => $product->get_price_html(),
            'imagen' => get_the_post_thumbnail_url(get_the_ID(), 'large'),
            'url' => get_permalink(),
            'intencion' => !empty($cat_nombres) ? $cat_nombres[0] : 'Guardián',
        ];
    }
    wp_reset_postdata();

    $total = count($productos);

    ob_start();
    ?>
    <div class="dhc-section" data-id="<?php echo esc_attr($id); ?>">
        <div class="dhc-header">
            <h2 class="dhc-titulo"><?php echo esc_html($titulo); ?></h2>
            <?php if ($subtitulo): ?>
            <p class="dhc-subtitulo"><?php echo esc_html($subtitulo); ?></p>
            <?php endif; ?>
        </div>

        <!-- Vista Carrusel -->
        <div class="dhc-carousel-view">
            <div class="dhc-carousel-wrap">
                <div class="dhc-track" id="dhc-track-<?php echo esc_attr($id); ?>">
                    <?php foreach ($productos as $prod): ?>
                    <a href="<?php echo esc_url($prod['url']); ?>" class="dhc-card">
                        <div class="dhc-card-img">
                            <?php if ($prod['imagen']): ?>
                            <img src="<?php echo esc_url($prod['imagen']); ?>" alt="<?php echo esc_attr($prod['nombre']); ?>" loading="lazy">
                            <?php endif; ?>
                        </div>
                        <div class="dhc-card-info">
                            <span class="dhc-card-intencion"><?php echo esc_html(strtoupper($prod['intencion'])); ?></span>
                            <h3 class="dhc-card-nombre"><?php echo esc_html($prod['nombre']); ?></h3>
                            <div class="dhc-card-precio"><?php echo $prod['precio_html']; ?></div>
                        </div>
                    </a>
                    <?php endforeach; ?>
                </div>
                <span class="dhc-desliza">Desliza →→</span>
            </div>

            <!-- Controles DEBAJO del carrusel -->
            <div class="dhc-nav-controles">
                <button class="dhc-flecha" onclick="dhcScroll('<?php echo esc_attr($id); ?>', -1)">‹</button>
                <span class="dhc-contador"><?php echo $total; ?> guardianes</span>
                <button class="dhc-flecha" onclick="dhcScroll('<?php echo esc_attr($id); ?>', 1)">›</button>
            </div>

            <div class="dhc-ver-todos-wrap">
                <button class="dhc-ver-todos-btn" onclick="dhcMostrarTodos('<?php echo esc_attr($id); ?>')">Ver todos ↓</button>
            </div>
        </div>

        <!-- Vista Grilla (oculta por defecto) -->
        <div class="dhc-grid-view" id="dhc-grid-<?php echo esc_attr($id); ?>" style="display:none;">
            <button class="dhc-volver-btn" onclick="dhcVolverCarrusel('<?php echo esc_attr($id); ?>')">← Volver al carrusel</button>
            <div class="dhc-grid">
                <?php foreach ($productos as $prod): ?>
                <a href="<?php echo esc_url($prod['url']); ?>" class="dhc-grid-card">
                    <div class="dhc-grid-img">
                        <?php if ($prod['imagen']): ?>
                        <img src="<?php echo esc_url($prod['imagen']); ?>" alt="<?php echo esc_attr($prod['nombre']); ?>" loading="lazy">
                        <?php endif; ?>
                    </div>
                    <div class="dhc-card-info">
                        <span class="dhc-card-intencion"><?php echo esc_html(strtoupper($prod['intencion'])); ?></span>
                        <h3 class="dhc-card-nombre"><?php echo esc_html($prod['nombre']); ?></h3>
                        <div class="dhc-card-precio"><?php echo $prod['precio_html']; ?></div>
                    </div>
                </a>
                <?php endforeach; ?>
            </div>
        </div>
    </div>
    <?php
    return ob_get_clean();
}

// Feed de adoptados recientemente
function duendes_adoptados_feed_html() {
    $orders = wc_get_orders([
        'status' => ['completed', 'processing'],
        'limit' => 10,
        'orderby' => 'date',
        'order' => 'DESC',
    ]);

    $adoptados = [];
    foreach ($orders as $order) {
        $billing = $order->get_billing_first_name();
        $ciudad = $order->get_billing_city();
        $pais = WC()->countries->countries[$order->get_billing_country()] ?? '';

        foreach ($order->get_items() as $item) {
            $product = $item->get_product();
            if (!$product) continue;

            $fecha = $order->get_date_completed() ?: $order->get_date_created();
            $dias_hace = floor((time() - $fecha->getTimestamp()) / 86400);

            if ($dias_hace == 0) $tiempo = 'hoy';
            elseif ($dias_hace == 1) $tiempo = 'ayer';
            elseif ($dias_hace < 7) $tiempo = "hace $dias_hace días";
            else continue;

            $adoptados[] = [
                'nombre_cliente' => $billing,
                'ubicacion' => $ciudad ? "$ciudad, $pais" : $pais,
                'guardian' => $product->get_name(),
                'tiempo' => $tiempo,
            ];

            if (count($adoptados) >= 4) break 2;
        }
    }

    if (empty($adoptados)) return '';

    ob_start();
    ?>
    <div class="dhc-adoptados-section">
        <h2 class="dhc-titulo-adoptados">Adoptados Recientemente</h2>
        <div class="dhc-adoptados-feed">
            <?php foreach ($adoptados as $a): ?>
            <div class="dhc-adoptado-item">
                <span class="dhc-adoptado-icono">✦</span>
                <span class="dhc-adoptado-texto">
                    <strong><?php echo esc_html($a['nombre_cliente']); ?></strong> de <?php echo esc_html($a['ubicacion']); ?>
                    adoptó a <strong><?php echo esc_html($a['guardian']); ?></strong>
                    <span class="dhc-adoptado-tiempo"><?php echo esc_html($a['tiempo']); ?></span>
                </span>
            </div>
            <?php endforeach; ?>
        </div>
    </div>
    <?php
    return ob_get_clean();
}

// Estilos y JS
add_action('wp_head', function() {
    if (!is_front_page() && !is_page('inicio')) return;
    ?>
    <style>
    /* =====================================================
       DUENDES HOMEPAGE CAROUSELES v2 - ESTILO NEON
       ===================================================== */

    .dhc-section {
        max-width: 1400px !important;
        margin: 70px auto !important;
        padding: 0 20px !important;
    }

    .dhc-header {
        display: flex !important;
        flex-direction: column !important;
        justify-content: center !important;
        align-items: center !important;
        margin-bottom: 25px !important;
        gap: 8px !important;
    }

    .dhc-subtitulo {
        font-family: "Cormorant Garamond", serif !important;
        font-size: 14px !important;
        color: rgba(255, 0, 255, 0.7) !important;
        font-style: italic !important;
        margin: 0 !important;
        letter-spacing: 1px !important;
    }

    .dhc-titulo {
        font-family: "Cinzel", serif !important;
        font-size: 18px !important;
        letter-spacing: 5px !important;
        color: #fff !important;
        margin: 0 !important;
        text-transform: uppercase !important;
        position: relative !important;
        padding-left: 20px !important;
    }

    .dhc-titulo::before {
        content: '' !important;
        position: absolute !important;
        left: 0 !important;
        top: 50% !important;
        transform: translateY(-50%) !important;
        width: 4px !important;
        height: 24px !important;
        background: linear-gradient(to bottom, #ff00ff, #00f5ff) !important;
        box-shadow: 0 0 10px #ff00ff !important;
    }

    /* =====================================================
       CARRUSEL CON FADES
       ===================================================== */
    .dhc-carousel-wrap {
        position: relative !important;
    }

    .dhc-carousel-wrap::before,
    .dhc-carousel-wrap::after {
        content: '' !important;
        position: absolute !important;
        top: 0 !important;
        bottom: 0 !important;
        width: 80px !important;
        z-index: 5 !important;
        pointer-events: none !important;
    }

    .dhc-carousel-wrap::before {
        left: 0 !important;
        background: linear-gradient(to right, #0a0a0a 0%, transparent 100%) !important;
        opacity: 0 !important;
        transition: opacity 0.3s !important;
    }

    .dhc-carousel-wrap::after {
        right: 0 !important;
        background: linear-gradient(to left, #0a0a0a 0%, transparent 100%) !important;
    }

    .dhc-carousel-wrap.scrolled::before {
        opacity: 1 !important;
    }

    .dhc-track {
        display: flex !important;
        gap: 20px !important;
        overflow-x: auto !important;
        scroll-behavior: smooth !important;
        scrollbar-width: none !important;
        -ms-overflow-style: none !important;
        padding: 15px 0 25px !important;
    }

    .dhc-track::-webkit-scrollbar { display: none !important; }

    /* Indicador DESLIZA */
    .dhc-desliza {
        position: absolute !important;
        right: 20px !important;
        bottom: 0 !important;
        font-family: "Cinzel", serif !important;
        font-size: 11px !important;
        letter-spacing: 2px !important;
        color: #00f5ff !important;
        text-transform: uppercase !important;
        animation: deslizaPulse 2s ease-in-out infinite !important;
        text-shadow: 0 0 10px #00f5ff, 0 0 20px #00f5ff !important;
        z-index: 6 !important;
    }

    @keyframes deslizaPulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.4; }
    }

    /* =====================================================
       CARDS
       ===================================================== */
    .dhc-card {
        flex: 0 0 180px !important;
        text-decoration: none !important;
        display: block !important;
        transition: transform 0.3s !important;
    }

    .dhc-card:hover {
        transform: scale(1.05) !important;
    }

    .dhc-card-img {
        width: 160px !important;
        height: 160px !important;
        border-radius: 50% !important;
        overflow: hidden !important;
        background: #111 !important;
        margin: 0 auto 15px !important;
        border: 2px solid transparent !important;
        transition: all 0.4s !important;
    }

    .dhc-card:hover .dhc-card-img {
        border-color: #ff00ff !important;
        box-shadow: 0 0 30px rgba(255,0,255,0.5) !important;
    }

    .dhc-card-img img {
        width: 100% !important;
        height: 100% !important;
        object-fit: cover !important;
        transition: transform 0.4s !important;
    }

    .dhc-card:hover .dhc-card-img img {
        transform: scale(1.1) !important;
    }

    .dhc-card-info {
        padding: 0 5px !important;
        text-align: center !important;
    }

    .dhc-card-intencion {
        font-family: "Cinzel", serif !important;
        font-size: 9px !important;
        letter-spacing: 2px !important;
        color: rgba(255,0,255,0.8) !important;
        display: block !important;
        margin-bottom: 8px !important;
    }

    .dhc-card-nombre {
        font-family: "Cinzel", serif !important;
        font-size: 14px !important;
        color: #fff !important;
        margin: 0 0 8px 0 !important;
        font-weight: 400 !important;
    }

    .dhc-card-precio {
        font-family: "Cormorant Garamond", serif !important;
        font-size: 14px !important;
        color: #00f5ff !important;
        text-shadow: 0 0 8px rgba(0,245,255,0.5) !important;
    }

    /* =====================================================
       CONTROLES DE NAVEGACION - DEBAJO
       ===================================================== */
    .dhc-nav-controles {
        display: flex !important;
        justify-content: center !important;
        align-items: center !important;
        gap: 25px !important;
        margin-top: 25px !important;
    }

    .dhc-flecha {
        width: 60px !important;
        height: 60px !important;
        background: rgba(0,0,0,0.9) !important;
        border: 2px solid #00f5ff !important;
        border-radius: 50% !important;
        color: #00f5ff !important;
        font-size: 28px !important;
        cursor: pointer !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        transition: all 0.3s !important;
        box-shadow: 0 0 20px rgba(0,245,255,0.3) !important;
    }

    .dhc-flecha:hover {
        background: #00f5ff !important;
        color: #0a0a0a !important;
        box-shadow: 0 0 40px rgba(0,245,255,0.6) !important;
        transform: scale(1.1) !important;
    }

    .dhc-contador {
        font-family: "Cormorant Garamond", serif !important;
        font-size: 14px !important;
        color: rgba(255,255,255,0.5) !important;
        font-style: italic !important;
        min-width: 110px !important;
        text-align: center !important;
    }

    /* =====================================================
       BOTON VER TODOS
       ===================================================== */
    .dhc-ver-todos-wrap {
        text-align: center !important;
        margin-top: 20px !important;
    }

    .dhc-ver-todos-btn {
        font-family: "Cinzel", serif !important;
        font-size: 12px !important;
        letter-spacing: 2px !important;
        text-transform: uppercase !important;
        color: #ff00ff !important;
        background: transparent !important;
        border: 1px solid rgba(255,0,255,0.4) !important;
        padding: 12px 30px !important;
        cursor: pointer !important;
        transition: all 0.3s !important;
    }

    .dhc-ver-todos-btn:hover {
        background: rgba(255,0,255,0.15) !important;
        box-shadow: 0 0 25px rgba(255,0,255,0.3) !important;
        border-color: #ff00ff !important;
    }

    /* =====================================================
       VISTA GRILLA
       ===================================================== */
    .dhc-volver-btn {
        font-family: "Cormorant Garamond", serif !important;
        font-size: 16px !important;
        color: #00f5ff !important;
        background: transparent !important;
        border: none !important;
        cursor: pointer !important;
        margin-bottom: 25px !important;
        transition: color 0.3s !important;
    }

    .dhc-volver-btn:hover {
        color: #fff !important;
        text-shadow: 0 0 10px #00f5ff !important;
    }

    .dhc-grid {
        display: grid !important;
        grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)) !important;
        gap: 30px !important;
    }

    .dhc-grid-card {
        text-decoration: none !important;
        display: block !important;
        transition: transform 0.3s !important;
    }

    .dhc-grid-card:hover {
        transform: scale(1.05) !important;
    }

    .dhc-grid-img {
        width: 100% !important;
        aspect-ratio: 1/1 !important;
        max-width: 180px !important;
        margin: 0 auto 15px !important;
        border-radius: 50% !important;
        overflow: hidden !important;
        border: 2px solid transparent !important;
        transition: all 0.4s !important;
    }

    .dhc-grid-card:hover .dhc-grid-img {
        border-color: #ff00ff !important;
        box-shadow: 0 0 30px rgba(255,0,255,0.5) !important;
    }

    .dhc-grid-img img {
        width: 100% !important;
        height: 100% !important;
        object-fit: cover !important;
    }

    /* =====================================================
       ADOPTADOS RECIENTEMENTE
       ===================================================== */
    .dhc-adoptados-section {
        max-width: 800px !important;
        margin: 70px auto !important;
        padding: 0 20px !important;
        text-align: center !important;
    }

    .dhc-titulo-adoptados {
        font-family: "Cinzel", serif !important;
        font-size: 16px !important;
        letter-spacing: 4px !important;
        color: #fff !important;
        margin: 0 0 30px 0 !important;
        text-transform: uppercase !important;
        position: relative !important;
        display: inline-block !important;
        padding: 0 20px !important;
    }

    .dhc-titulo-adoptados::before,
    .dhc-titulo-adoptados::after {
        content: '✦' !important;
        color: #ff00ff !important;
        position: absolute !important;
        top: 50% !important;
        transform: translateY(-50%) !important;
        text-shadow: 0 0 10px #ff00ff !important;
    }

    .dhc-titulo-adoptados::before { left: 0 !important; }
    .dhc-titulo-adoptados::after { right: 0 !important; }

    .dhc-adoptados-feed {
        display: flex !important;
        flex-direction: column !important;
        gap: 15px !important;
    }

    .dhc-adoptado-item {
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        gap: 12px !important;
        padding: 15px 20px !important;
        background: rgba(0,245,255,0.03) !important;
        border-left: 2px solid rgba(0,245,255,0.4) !important;
        border-radius: 0 4px 4px 0 !important;
    }

    .dhc-adoptado-icono {
        color: #00f5ff !important;
        font-size: 14px !important;
        text-shadow: 0 0 8px #00f5ff !important;
    }

    .dhc-adoptado-texto {
        font-family: "Cormorant Garamond", serif !important;
        font-size: 15px !important;
        color: rgba(255,255,255,0.7) !important;
    }

    .dhc-adoptado-texto strong {
        color: #fff !important;
    }

    .dhc-adoptado-tiempo {
        font-size: 13px !important;
        color: rgba(255,0,255,0.7) !important;
        margin-left: 5px !important;
    }

    /* =====================================================
       RESPONSIVE - MOBILE: 1 card a la vez
       ===================================================== */
    @media (max-width: 768px) {
        /* Carrusel: 1 card centrada, snap scroll */
        .dhc-track {
            scroll-snap-type: x mandatory !important;
            padding: 15px 20px 25px !important;
        }
        .dhc-card {
            flex: 0 0 85% !important;
            max-width: 280px !important;
            scroll-snap-align: center !important;
        }
        .dhc-card-img {
            width: 200px !important;
            height: 200px !important;
        }
        .dhc-card-nombre { font-size: 14px !important; }
        .dhc-card-precio { font-size: 13px !important; }

        .dhc-flecha {
            width: 55px !important;
            height: 55px !important;
            font-size: 24px !important;
        }

        .dhc-nav-controles {
            gap: 15px !important;
        }

        .dhc-contador {
            font-size: 12px !important;
            min-width: 90px !important;
        }

        .dhc-desliza {
            font-size: 10px !important;
            right: 10px !important;
        }

        .dhc-titulo {
            font-size: 14px !important;
            letter-spacing: 3px !important;
        }

        /* Grilla ver todos: 2 columnas */
        .dhc-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 20px !important;
        }

        .dhc-grid-img {
            max-width: 140px !important;
        }

        .dhc-grid-card .dhc-card-nombre {
            font-size: 12px !important;
        }

        .dhc-grid-card .dhc-card-precio {
            font-size: 11px !important;
        }

        .dhc-ver-todos-btn {
            font-size: 11px !important;
            padding: 10px 20px !important;
        }
    }
    </style>

    <script>
    function dhcScroll(id, direction) {
        var track = document.getElementById('dhc-track-' + id);
        if (!track) return;
        // En mobile, mover de a 1 card
        var card = track.querySelector('.dhc-card');
        var cardWidth = card ? card.offsetWidth + 20 : 200;
        track.scrollBy({ left: cardWidth * direction, behavior: 'smooth' });
    }

    function dhcMostrarTodos(id) {
        var section = document.querySelector('.dhc-section[data-id="' + id + '"]');
        if (!section) return;
        var carouselView = section.querySelector('.dhc-carousel-view');
        var gridView = section.querySelector('.dhc-grid-view');
        if (carouselView) carouselView.style.display = 'none';
        if (gridView) gridView.style.display = 'block';
    }

    function dhcVolverCarrusel(id) {
        var section = document.querySelector('.dhc-section[data-id="' + id + '"]');
        if (!section) return;
        var carouselView = section.querySelector('.dhc-carousel-view');
        var gridView = section.querySelector('.dhc-grid-view');
        if (carouselView) carouselView.style.display = 'block';
        if (gridView) gridView.style.display = 'none';
    }

    // Detectar scroll para mostrar fade izquierdo
    document.addEventListener('DOMContentLoaded', function() {
        var tracks = document.querySelectorAll('.dhc-track');
        tracks.forEach(function(track) {
            track.addEventListener('scroll', function() {
                var wrap = this.closest('.dhc-carousel-wrap');
                if (!wrap) return;
                if (this.scrollLeft > 30) {
                    wrap.classList.add('scrolled');
                } else {
                    wrap.classList.remove('scrolled');
                }
                // Ocultar desliza si ya scrollearon
                var desliza = wrap.querySelector('.dhc-desliza');
                if (desliza) {
                    desliza.style.opacity = this.scrollLeft > 50 ? '0' : '1';
                }
            });
        });
    });
    </script>
    <?php
});
