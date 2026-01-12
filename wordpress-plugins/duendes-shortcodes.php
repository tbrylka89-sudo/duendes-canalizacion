<?php
/**
 * Plugin Name: Duendes Shortcodes & Cart Sound
 * Description: Shortcodes de productos y sonido mágico al agregar al carrito
 * Version: 2.0
 * Author: Duendes del Uruguay
 */

if (!defined('ABSPATH')) exit;

// ═══════════════════════════════════════════════════════════════════════════
// SHORTCODE [duendes_grid] - Grid de productos estilo cartas de tarot
// ═══════════════════════════════════════════════════════════════════════════
add_shortcode('duendes_grid', 'duendes_grid_shortcode');

function duendes_grid_shortcode($atts) {
    $atts = shortcode_atts(array(
        'cantidad' => 8,
        'categoria' => '',
        'orden' => 'rand',
        'columnas' => 4
    ), $atts);

    // Query productos
    $args = array(
        'post_type' => 'product',
        'posts_per_page' => intval($atts['cantidad']),
        'post_status' => 'publish',
        'orderby' => $atts['orden'] === 'rand' ? 'rand' : 'date',
        'order' => 'DESC'
    );

    if (!empty($atts['categoria'])) {
        $args['tax_query'] = array(array(
            'taxonomy' => 'product_cat',
            'field' => 'slug',
            'terms' => $atts['categoria']
        ));
    }

    $products = new WP_Query($args);

    if (!$products->have_posts()) {
        return '<p style="text-align:center;color:#888;">No hay guardianes disponibles en este momento.</p>';
    }

    // Generar HTML
    $html = '<div class="duendes-tarot-grid" data-columnas="' . esc_attr($atts['columnas']) . '">';

    while ($products->have_posts()) {
        $products->the_post();
        global $product;

        $id = get_the_ID();
        $nombre = get_the_title();
        $precio = $product->get_price();
        $precio_regular = $product->get_regular_price();
        $imagen = get_the_post_thumbnail_url($id, 'medium') ?: 'https://duendesuy.10web.cloud/wp-content/uploads/placeholder-guardian.jpg';
        $link = get_permalink();

        // Categorías para el aura
        $cats = wp_get_post_terms($id, 'product_cat', array('fields' => 'names'));
        $tipo = !empty($cats) ? $cats[0] : 'Guardián';

        $html .= '
        <a href="' . esc_url($link) . '" class="duendes-tarot-card">
            <div class="dtc-orbes">
                <div class="dtc-orbe dtc-orbe-1"></div>
                <div class="dtc-orbe dtc-orbe-2"></div>
                <div class="dtc-orbe dtc-orbe-3"></div>
            </div>
            <div class="dtc-imagen-wrap">
                <img src="' . esc_url($imagen) . '" alt="' . esc_attr($nombre) . '" class="dtc-imagen" loading="lazy">
                <div class="dtc-aura"></div>
            </div>
            <div class="dtc-info">
                <span class="dtc-tipo">' . esc_html($tipo) . '</span>
                <h3 class="dtc-nombre">' . esc_html($nombre) . '</h3>
                <div class="dtc-precio">
                    <span class="dtc-precio-actual">$' . number_format($precio, 0, ',', '.') . ' USD</span>
                </div>
            </div>
            <div class="dtc-shine"></div>
        </a>';
    }

    wp_reset_postdata();
    $html .= '</div>';

    return $html;
}

// ═══════════════════════════════════════════════════════════════════════════
// ESTILOS Y SCRIPTS
// ═══════════════════════════════════════════════════════════════════════════
add_action('wp_head', 'duendes_shortcodes_styles');

function duendes_shortcodes_styles() {
?>
<style>
/* ═══════════════════════════════════════════════════════════════
   GRID DE CARTAS DE TAROT - Duendes del Uruguay
═══════════════════════════════════════════════════════════════ */
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400&display=swap');

.duendes-tarot-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 30px;
    padding: 40px 20px;
    max-width: 1400px;
    margin: 0 auto;
}

.duendes-tarot-grid[data-columnas="3"] {
    grid-template-columns: repeat(3, 1fr);
}

.duendes-tarot-grid[data-columnas="2"] {
    grid-template-columns: repeat(2, 1fr);
}

@media (max-width: 1200px) {
    .duendes-tarot-grid { grid-template-columns: repeat(3, 1fr); }
}
@media (max-width: 900px) {
    .duendes-tarot-grid { grid-template-columns: repeat(2, 1fr); gap: 20px; }
}
@media (max-width: 600px) {
    .duendes-tarot-grid { grid-template-columns: repeat(2, 1fr); gap: 15px; padding: 20px 10px; }
}

/* CARTA DE TAROT */
.duendes-tarot-card {
    position: relative;
    display: flex;
    flex-direction: column;
    background: linear-gradient(180deg, #0a0a0a 0%, #1a1a1a 100%);
    border: 2px solid #2a2a2a;
    border-radius: 20px;
    overflow: hidden;
    text-decoration: none;
    color: #fff;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    aspect-ratio: 2/3;
}

.duendes-tarot-card::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 18px;
    padding: 2px;
    background: linear-gradient(135deg, transparent 0%, rgba(198, 169, 98, 0.3) 50%, transparent 100%);
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    opacity: 0;
    transition: opacity 0.4s;
}

.duendes-tarot-card:hover::before {
    opacity: 1;
}

.duendes-tarot-card:hover {
    transform: translateY(-10px) scale(1.02);
    border-color: #C6A962;
    box-shadow:
        0 20px 40px rgba(0, 0, 0, 0.5),
        0 0 60px rgba(198, 169, 98, 0.15),
        inset 0 0 30px rgba(198, 169, 98, 0.05);
}

/* ORBES FLOTANTES */
.dtc-orbes {
    position: absolute;
    inset: 0;
    pointer-events: none;
    overflow: hidden;
    opacity: 0;
    transition: opacity 0.5s;
}

.duendes-tarot-card:hover .dtc-orbes {
    opacity: 1;
}

.dtc-orbe {
    position: absolute;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(198, 169, 98, 0.4) 0%, transparent 70%);
    animation: floatOrbe 4s ease-in-out infinite;
}

.dtc-orbe-1 {
    width: 80px;
    height: 80px;
    top: 10%;
    left: -20px;
    animation-delay: 0s;
}

.dtc-orbe-2 {
    width: 60px;
    height: 60px;
    top: 40%;
    right: -15px;
    animation-delay: 1.5s;
}

.dtc-orbe-3 {
    width: 40px;
    height: 40px;
    bottom: 20%;
    left: 10%;
    animation-delay: 3s;
}

@keyframes floatOrbe {
    0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.6; }
    50% { transform: translate(10px, -10px) scale(1.1); opacity: 1; }
}

/* IMAGEN */
.dtc-imagen-wrap {
    position: relative;
    flex: 1;
    overflow: hidden;
}

.dtc-imagen {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.duendes-tarot-card:hover .dtc-imagen {
    transform: scale(1.08);
}

.dtc-aura {
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse at center bottom, rgba(198, 169, 98, 0.2) 0%, transparent 60%);
    opacity: 0;
    transition: opacity 0.5s;
}

.duendes-tarot-card:hover .dtc-aura {
    opacity: 1;
}

/* INFO */
.dtc-info {
    padding: 20px;
    background: linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.9) 30%);
    position: relative;
    z-index: 2;
}

.dtc-tipo {
    display: inline-block;
    font-family: 'Cormorant Garamond', serif;
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 2px;
    color: #C6A962;
    margin-bottom: 8px;
}

.dtc-nombre {
    font-family: 'Cinzel', serif;
    font-size: 18px;
    font-weight: 500;
    color: #fff;
    margin: 0 0 12px 0;
    line-height: 1.3;
}

@media (max-width: 600px) {
    .dtc-nombre { font-size: 14px; }
    .dtc-info { padding: 12px; }
}

.dtc-precio {
    display: flex;
    align-items: center;
    gap: 10px;
}

.dtc-precio-actual {
    font-family: 'Cinzel', serif;
    font-size: 16px;
    color: #C6A962;
    font-weight: 600;
}

@media (max-width: 600px) {
    .dtc-precio-actual { font-size: 13px; }
}

/* SHINE EFFECT */
.dtc-shine {
    position: absolute;
    top: -100%;
    left: -100%;
    width: 50%;
    height: 200%;
    background: linear-gradient(
        90deg,
        transparent,
        rgba(255, 255, 255, 0.1),
        transparent
    );
    transform: rotate(25deg);
    transition: all 0.7s;
    pointer-events: none;
}

.duendes-tarot-card:hover .dtc-shine {
    left: 150%;
}

/* ═══════════════════════════════════════════════════════════════
   SONIDO AL AGREGAR AL CARRITO
═══════════════════════════════════════════════════════════════ */
#duendes-cart-sound {
    display: none;
}
</style>
<?php
}

// ═══════════════════════════════════════════════════════════════════════════
// SONIDO MÁGICO AL AGREGAR AL CARRITO
// ═══════════════════════════════════════════════════════════════════════════
add_action('wp_footer', 'duendes_cart_sound_script');

function duendes_cart_sound_script() {
?>
<audio id="duendes-cart-sound" preload="auto">
    <source src="https://duendes-vercel.vercel.app/sounds/magic-add-cart.mp3" type="audio/mpeg">
</audio>

<script>
(function() {
    'use strict';

    // Sonido mágico al agregar al carrito
    const cartSound = document.getElementById('duendes-cart-sound');
    if (!cartSound) return;

    // Configurar volumen
    cartSound.volume = 0.4;

    // Escuchar evento de WooCommerce
    jQuery(document.body).on('added_to_cart', function(e, fragments, cart_hash, $button) {
        playMagicSound();
    });

    // También para botones de agregar directos
    document.addEventListener('click', function(e) {
        const btn = e.target.closest('.add_to_cart_button, .single_add_to_cart_button, .dm-btn-comprar, [data-add-to-cart]');
        if (btn) {
            // Pequeño delay para que coincida con la acción
            setTimeout(playMagicSound, 200);
        }
    });

    function playMagicSound() {
        if (!cartSound) return;

        // Reset y play
        cartSound.currentTime = 0;
        cartSound.volume = 0.4;

        const playPromise = cartSound.play();
        if (playPromise !== undefined) {
            playPromise.catch(err => console.log('Audio blocked:', err));
        }

        // Fadeout suave
        setTimeout(function() {
            fadeOut(cartSound, 1000);
        }, 1500);
    }

    function fadeOut(audio, duration) {
        const startVolume = audio.volume;
        const steps = 20;
        const stepTime = duration / steps;
        const volumeStep = startVolume / steps;

        let currentStep = 0;
        const fadeInterval = setInterval(function() {
            currentStep++;
            audio.volume = Math.max(0, startVolume - (volumeStep * currentStep));

            if (currentStep >= steps) {
                clearInterval(fadeInterval);
                audio.pause();
                audio.volume = startVolume;
            }
        }, stepTime);
    }
})();
</script>
<?php
}
?>
