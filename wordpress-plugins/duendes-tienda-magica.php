<?php
/**
 * Plugin Name: Duendes Tienda Magica
 * Description: Pagina de tienda elegante
 * Version: 2.0
 */

if (!defined('ABSPATH')) exit;

// Estilos en la tienda
add_action('wp_head', function() {
    if (is_shop() || is_product_category()) {
        echo '<style>' . duendes_tienda_styles_v2() . '</style>';
    }
}, 99);

// Reemplazar el header de la tienda
add_action('woocommerce_before_shop_loop', 'duendes_tienda_header_v2', 5);

function duendes_tienda_header_v2() {
    if (!is_shop()) return;

    // Ocultar el titulo duplicado
    remove_action('woocommerce_archive_description', 'woocommerce_taxonomy_archive_description', 10);

    $categorias = [
        ['slug' => 'proteccion', 'nombre' => 'Proteccion', 'emoji' => '🛡️'],
        ['slug' => 'amor', 'nombre' => 'Amor', 'emoji' => '💜'],
        ['slug' => 'dinero-abundancia-negocios', 'nombre' => 'Abundancia', 'emoji' => '✨'],
        ['slug' => 'salud', 'nombre' => 'Sanacion', 'emoji' => '🌿'],
        ['slug' => 'sabiduria-guia-claridad', 'nombre' => 'Sabiduria', 'emoji' => '🔮'],
    ];

    echo '<div class="duendes-shop-hero">
        <div class="hero-orbs">
            <div class="orb orb-1"></div>
            <div class="orb orb-2"></div>
            <div class="orb orb-3"></div>
        </div>
        <h1>Guardianes Disponibles</h1>
        <p class="hero-sub">Seres unicos. Cuando uno se va, desaparece para siempre.</p>
        <div class="cat-pills">';

    foreach ($categorias as $cat) {
        $term = get_term_by('slug', $cat['slug'], 'product_cat');
        $count = $term ? $term->count : 0;
        $link = $term ? get_term_link($term) : '#';
        echo '<a href="' . esc_url($link) . '" class="cat-pill">' . $cat['emoji'] . ' ' . $cat['nombre'] . ' <span>(' . $count . ')</span></a>';
    }

    echo '</div></div>';
}

function duendes_tienda_styles_v2() {
    return '
    @import url("https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400&display=swap");

    /* Ocultar header duplicado */
    .woocommerce-products-header { display: none !important; }

    /* Hero de la tienda */
    .duendes-shop-hero {
        text-align: center;
        padding: 80px 20px 60px;
        position: relative;
        overflow: hidden;
    }

    .duendes-shop-hero h1 {
        font-family: "Cinzel", serif;
        font-size: clamp(36px, 6vw, 56px);
        color: #C6A962;
        margin: 0 0 15px 0;
        font-weight: 400;
        letter-spacing: 2px;
    }

    .hero-sub {
        font-family: "Cormorant Garamond", serif;
        font-size: clamp(16px, 4vw, 20px);
        color: rgba(255,255,255,0.6);
        font-style: italic;
        margin: 0 0 40px 0;
    }

    /* Orbes flotantes */
    .hero-orbs {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        pointer-events: none;
        overflow: hidden;
    }

    .orb {
        position: absolute;
        border-radius: 50%;
        filter: blur(60px);
        opacity: 0.3;
        animation: float 8s ease-in-out infinite;
    }

    .orb-1 {
        width: 300px;
        height: 300px;
        background: #C6A962;
        top: -100px;
        left: 10%;
        animation-delay: 0s;
    }

    .orb-2 {
        width: 200px;
        height: 200px;
        background: #E879F9;
        top: 50%;
        right: 5%;
        animation-delay: -3s;
    }

    .orb-3 {
        width: 250px;
        height: 250px;
        background: #818CF8;
        bottom: -50px;
        left: 30%;
        animation-delay: -5s;
    }

    @keyframes float {
        0%, 100% { transform: translateY(0) scale(1); }
        50% { transform: translateY(-30px) scale(1.1); }
    }

    /* Pills de categorias */
    .cat-pills {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 12px;
        position: relative;
        z-index: 1;
    }

    .cat-pill {
        background: rgba(255,255,255,0.05);
        border: 1px solid rgba(198, 169, 98, 0.3);
        color: #fff;
        padding: 12px 24px;
        border-radius: 50px;
        font-family: "Cinzel", serif;
        font-size: 14px;
        text-decoration: none;
        transition: all 0.3s;
        backdrop-filter: blur(10px);
    }

    .cat-pill:hover {
        background: rgba(198, 169, 98, 0.2);
        border-color: #C6A962;
        transform: translateY(-2px);
        color: #C6A962;
    }

    .cat-pill span {
        opacity: 0.5;
        font-size: 12px;
    }

    /* Grid de productos */
    ul.products {
        display: grid !important;
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)) !important;
        gap: 30px !important;
        padding: 40px 20px !important;
        max-width: 1400px !important;
        margin: 0 auto !important;
    }

    ul.products li.product {
        background: linear-gradient(145deg, rgba(30,30,30,0.9) 0%, rgba(15,15,15,0.95) 100%) !important;
        border: 1px solid rgba(198, 169, 98, 0.1) !important;
        border-radius: 20px !important;
        overflow: hidden !important;
        transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1) !important;
        padding: 0 !important;
        position: relative !important;
        box-shadow: 0 10px 40px rgba(0,0,0,0.3) !important;
    }

    ul.products li.product:hover {
        transform: translateY(-12px) !important;
        border-color: rgba(198, 169, 98, 0.4) !important;
        box-shadow: 0 25px 60px rgba(0,0,0,0.5), 0 0 30px rgba(198, 169, 98, 0.1) !important;
    }

    ul.products li.product a.woocommerce-LoopProduct-link {
        display: block;
    }

    ul.products li.product a img {
        width: 100% !important;
        height: 300px !important;
        object-fit: cover !important;
        margin: 0 !important;
        border-radius: 0 !important;
        transition: transform 0.5s !important;
    }

    ul.products li.product:hover a img {
        transform: scale(1.05) !important;
    }

    ul.products li.product .woocommerce-loop-product__title {
        font-family: "Cinzel", serif !important;
        font-size: 20px !important;
        color: #fff !important;
        padding: 20px 20px 8px !important;
        margin: 0 !important;
        font-weight: 400 !important;
    }

    ul.products li.product .price {
        font-family: "Cormorant Garamond", serif !important;
        color: #C6A962 !important;
        font-size: 18px !important;
        padding: 0 20px 20px !important;
    }

    ul.products li.product .button,
    ul.products li.product .add_to_cart_button {
        background: transparent !important;
        color: #C6A962 !important;
        border: 1px solid rgba(198, 169, 98, 0.3) !important;
        border-radius: 0 !important;
        padding: 16px !important;
        font-family: "Cinzel", serif !important;
        font-weight: 500 !important;
        width: 100% !important;
        margin: 0 !important;
        text-transform: uppercase !important;
        font-size: 12px !important;
        letter-spacing: 2px !important;
        transition: all 0.3s !important;
        border-left: none !important;
        border-right: none !important;
        border-bottom: none !important;
    }

    ul.products li.product .button:hover,
    ul.products li.product .add_to_cart_button:hover {
        background: #C6A962 !important;
        color: #0a0a0a !important;
    }

    /* Sidebar filters */
    .woocommerce-sidebar,
    .widget-area {
        background: rgba(15,15,15,0.5) !important;
        border-radius: 16px !important;
        padding: 20px !important;
        border: 1px solid rgba(198, 169, 98, 0.1) !important;
    }

    /* Responsive */
    @media (max-width: 768px) {
        .duendes-shop-hero {
            padding: 60px 15px 40px;
        }

        .cat-pills {
            gap: 8px;
        }

        .cat-pill {
            padding: 10px 16px;
            font-size: 12px;
        }

        ul.products {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 15px !important;
            padding: 20px 15px !important;
        }

        ul.products li.product a img {
            height: 200px !important;
        }

        ul.products li.product .woocommerce-loop-product__title {
            font-size: 16px !important;
            padding: 15px 15px 5px !important;
        }
    }

    /* Tablet */
    @media (max-width: 1024px) {
        ul.products {
            grid-template-columns: repeat(3, 1fr) !important;
        }
    }

    /* Móviles pequeños */
    @media (max-width: 600px) {
        ul.products {
            grid-template-columns: 1fr !important;
        }

        ul.products li.product .button,
        ul.products li.product .add_to_cart_button {
            padding: 18px !important;
            min-height: 48px !important;
        }

        .cat-pill {
            padding: 12px 20px;
            font-size: 13px;
        }
    }
    ';
}

// Agregar sonidos mágicos a la tienda
add_action('wp_footer', function() {
    if (!is_shop() && !is_product_category() && !is_product()) return;
    ?>
    <script>
    (function() {
        // Sistema de sonidos mágicos - suaves como una caricia
        let audioContext = null;

        // 1. Validar que AudioContext existe antes de usarlo
        function getAudioContext() {
            if (!audioContext) {
                if (typeof window !== 'undefined' && (window.AudioContext || window.webkitAudioContext)) {
                    audioContext = new (window.AudioContext || window.webkitAudioContext)();
                }
            }
            return audioContext;
        }

        // 4. Detectar si es dispositivo tactil
        const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

        // 3. Throttle para sonido de carrito (500ms)
        let lastCartSound = 0;
        function throttledCartSound() {
            const now = Date.now();
            if (now - lastCartSound > 500) {
                lastCartSound = now;
                playAddToCartSound();
            }
        }

        // Sonido etéreo al hover - como brisa mágica, muy sutil
        function playSelectSound() {
            try {
                const ctx = getAudioContext();
                // 2. Si no hay AudioContext, salir
                if (!ctx) return;

                // 2. Manejar ctx.resume() como Promise
                if (ctx.state === 'suspended') {
                    ctx.resume().catch(() => {});
                }

                // Nota base muy suave y baja
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                const filter = ctx.createBiquadFilter();

                osc.connect(filter);
                filter.connect(gain);
                gain.connect(ctx.destination);

                // Filtro para suavizar
                filter.type = 'lowpass';
                filter.frequency.setValueAtTime(800, ctx.currentTime);

                // Tono suave, frecuencia media-baja
                osc.type = 'sine';
                osc.frequency.setValueAtTime(392, ctx.currentTime); // Sol4
                osc.frequency.linearRampToValueAtTime(523, ctx.currentTime + 0.3); // Do5

                // Volumen MUY bajo, fade in largo
                gain.gain.setValueAtTime(0, ctx.currentTime);
                gain.gain.linearRampToValueAtTime(0.015, ctx.currentTime + 0.15); // muy suave
                gain.gain.linearRampToValueAtTime(0.012, ctx.currentTime + 0.4);
                gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.2);

                osc.start(ctx.currentTime);
                osc.stop(ctx.currentTime + 1.2);

                // Armónico etéreo muy sutil
                const osc2 = ctx.createOscillator();
                const gain2 = ctx.createGain();
                const filter2 = ctx.createBiquadFilter();
                osc2.connect(filter2);
                filter2.connect(gain2);
                gain2.connect(ctx.destination);
                filter2.type = 'lowpass';
                filter2.frequency.setValueAtTime(600, ctx.currentTime);
                osc2.type = 'sine';
                osc2.frequency.setValueAtTime(784, ctx.currentTime); // Sol5
                gain2.gain.setValueAtTime(0, ctx.currentTime);
                gain2.gain.linearRampToValueAtTime(0.008, ctx.currentTime + 0.2);
                gain2.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.8);
                osc2.start(ctx.currentTime);
                osc2.stop(ctx.currentTime + 0.8);
            } catch(e) { console.log('Sound error:', e); }
        }

        // Sonido mágico al agregar al carrito - acordecito celestial
        function playAddToCartSound() {
            try {
                const ctx = getAudioContext();
                // 2. Si no hay AudioContext, salir
                if (!ctx) return;

                // 2. Manejar ctx.resume() como Promise
                if (ctx.state === 'suspended') {
                    ctx.resume().catch(() => {});
                }

                console.log('Playing add to cart sound');

                // Acorde suave tipo arpa celestial
                const frequencies = [392, 493.88, 587.33, 783.99]; // Sol4, Si4, Re5, Sol5
                const delays = [0, 0.12, 0.24, 0.36];

                frequencies.forEach((freq, i) => {
                    const osc = ctx.createOscillator();
                    const gain = ctx.createGain();
                    const filter = ctx.createBiquadFilter();

                    osc.connect(filter);
                    filter.connect(gain);
                    gain.connect(ctx.destination);

                    filter.type = 'lowpass';
                    filter.frequency.setValueAtTime(1200, ctx.currentTime);

                    osc.type = 'sine';
                    osc.frequency.setValueAtTime(freq, ctx.currentTime + delays[i]);

                    // Volumen suave pero audible
                    gain.gain.setValueAtTime(0, ctx.currentTime + delays[i]);
                    gain.gain.linearRampToValueAtTime(0.04, ctx.currentTime + delays[i] + 0.08);
                    gain.gain.linearRampToValueAtTime(0.03, ctx.currentTime + delays[i] + 0.3);
                    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + delays[i] + 1.5);

                    osc.start(ctx.currentTime + delays[i]);
                    osc.stop(ctx.currentTime + delays[i] + 1.5);
                });

                // Shimmer final muy sutil
                setTimeout(() => {
                    try {
                        const currentCtx = getAudioContext();
                        if (!currentCtx) return;

                        const shimmer = currentCtx.createOscillator();
                        const shimmerGain = currentCtx.createGain();
                        const shimmerFilter = currentCtx.createBiquadFilter();
                        shimmer.connect(shimmerFilter);
                        shimmerFilter.connect(shimmerGain);
                        shimmerGain.connect(currentCtx.destination);
                        shimmerFilter.type = 'lowpass';
                        shimmerFilter.frequency.setValueAtTime(2000, currentCtx.currentTime);
                        shimmer.type = 'sine';
                        shimmer.frequency.setValueAtTime(1567.98, currentCtx.currentTime); // Sol6
                        shimmerGain.gain.setValueAtTime(0, currentCtx.currentTime);
                        shimmerGain.gain.linearRampToValueAtTime(0.015, currentCtx.currentTime + 0.1);
                        shimmerGain.gain.exponentialRampToValueAtTime(0.0001, currentCtx.currentTime + 0.8);
                        shimmer.start(currentCtx.currentTime);
                        shimmer.stop(currentCtx.currentTime + 0.8);
                    } catch(e) { /* silenciar errores del shimmer */ }
                }, 450);

            } catch(e) { console.log('Cart sound error:', e); }
        }

        // Throttle para hover
        let lastSelectSound = 0;
        function throttledSelectSound() {
            const now = Date.now();
            if (now - lastSelectSound > 300) {
                lastSelectSound = now;
                playSelectSound();
            }
        }

        // Event listeners
        document.addEventListener('DOMContentLoaded', function() {
            console.log('Duendes sounds initialized');

            // 4. Para productos, usar click en movil en lugar de mouseenter
            document.querySelectorAll('ul.products li.product').forEach(function(product) {
                if (isTouchDevice) {
                    product.addEventListener('click', throttledSelectSound, { once: false, passive: true });
                } else {
                    product.addEventListener('mouseenter', throttledSelectSound);
                }
            });

            // 3. Click en cualquier boton de agregar al carrito - usar throttledCartSound
            document.body.addEventListener('click', function(e) {
                const btn = e.target.closest('button, a');
                if (btn) {
                    const classes = btn.className || '';
                    const text = (btn.textContent || '').toLowerCase();
                    if (classes.includes('add_to_cart') ||
                        classes.includes('single_add_to_cart') ||
                        classes.includes('cart') ||
                        text.includes('carrito') ||
                        text.includes('cart') ||
                        text.includes('pacto') ||
                        text.includes('comprar') ||
                        text.includes('añadir')) {
                        console.log('Cart button clicked:', btn);
                        throttledCartSound();
                    }
                }
            });

            // 3. Evento WooCommerce AJAX - usar throttledCartSound
            if (typeof jQuery !== 'undefined') {
                jQuery(document.body).on('added_to_cart', function() {
                    console.log('WC added_to_cart event');
                    throttledCartSound();
                });
                jQuery(document.body).on('wc_fragments_refreshed', function() {
                    console.log('WC fragments refreshed');
                });
            }
        });

        // Exponer globalmente
        window.duendesSounds = {
            select: throttledSelectSound,
            addToCart: throttledCartSound
        };
    })();
    </script>
    <?php
}, 99);
