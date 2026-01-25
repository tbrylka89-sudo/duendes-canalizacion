<?php
/**
 * Plugin Name: Duendes - Promoción 3x2
 * Description: Promo 3x2 con banner en inicio/tienda y notificación al agregar
 * Version: 4.0
 * Author: Duendes del Uruguay
 */

if (!defined('ABSPATH')) exit;

define('DUENDES_PROMO_3X2_ACTIVA', true);
define('DUENDES_PROMO_GUARDIANES_REQUERIDOS', 2);
define('DUENDES_PROMO_CATEGORIA_MINI', 'mini');

// ═══════════════════════════════════════════════════════════════════════════
// HOOKS PARA LA PROMO 3x2
// ═══════════════════════════════════════════════════════════════════════════

add_action('woocommerce_after_cart_table', 'duendes_verificar_promo_3x2');
add_action('woocommerce_before_checkout_form', 'duendes_verificar_promo_3x2', 5);

// ═══════════════════════════════════════════════════════════════════════════
// BANNER FIJO PROMOCIONAL EN INICIO Y TIENDA (con carrusel de minis)
// ═══════════════════════════════════════════════════════════════════════════

// Shortcode para el banner con carrusel de minis
// Uso: [duendes_banner_3x2] en Elementor o cualquier página
add_shortcode('duendes_banner_3x2', 'duendes_banner_fijo_3x2');

// MOSTRAR AUTOMÁTICAMENTE EN LA TIENDA (antes de los productos)
add_action('woocommerce_before_shop_loop', 'duendes_banner_tienda_automatico', 5);

function duendes_banner_tienda_automatico() {
    if (!DUENDES_PROMO_3X2_ACTIVA) return;
    // Solo en la página principal de tienda, no en categorías
    if (!is_shop()) return;

    echo duendes_banner_fijo_3x2();
}

function duendes_banner_fijo_3x2() {
    if (!DUENDES_PROMO_3X2_ACTIVA) return '';

    ob_start(); // Para que el shortcode funcione

    // Obtener productos mini para el carrusel
    $categoria = get_term_by('slug', DUENDES_PROMO_CATEGORIA_MINI, 'product_cat');
    $minis_images = [];

    if ($categoria) {
        $query = new WP_Query([
            'post_type' => 'product',
            'post_status' => 'publish',
            'posts_per_page' => 6,
            'orderby' => 'rand',
            'tax_query' => [[
                'taxonomy' => 'product_cat',
                'field' => 'term_id',
                'terms' => $categoria->term_id,
            ]]
        ]);

        if ($query->have_posts()) {
            while ($query->have_posts()) {
                $query->the_post();
                $product = wc_get_product(get_the_ID());
                if ($product) {
                    $img = wp_get_attachment_image_url($product->get_image_id(), 'thumbnail');
                    if ($img) $minis_images[] = $img;
                }
            }
            wp_reset_postdata();
        }
    }

    // Si no hay imágenes, usar placeholder
    if (empty($minis_images)) {
        $minis_images = [
            wc_placeholder_img_src(),
            wc_placeholder_img_src(),
            wc_placeholder_img_src(),
        ];
    }
    ?>
    <div id="duendes-banner-3x2-fijo">
        <style>
            /* === BANNER 3x2 - ESTILOS BASE === */
            #duendes-banner-3x2-fijo {
                background: #0a0a0a;
                border: 2px solid rgba(201, 162, 39, 0.4);
                border-radius: 25px;
                padding: 40px 50px;
                margin: 30px auto;
                width: 100%;
                max-width: 1000px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 40px;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(201, 162, 39, 0.1);
                position: relative;
                overflow: hidden;
                box-sizing: border-box;
            }

            /* === ANIMACIONES === */
            @keyframes rotateCircle {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
            }
            @keyframes floatMini {
                0%, 100% { transform: translateY(0) scale(1); }
                50% { transform: translateY(-8px) scale(1.05); }
            }
            @keyframes shimmer {
                0% { background-position: -200% center; }
                100% { background-position: 200% center; }
            }
            @keyframes pulse3x2 {
                0%, 100% { box-shadow: 0 0 30px rgba(201, 162, 39, 0.5); }
                50% { box-shadow: 0 0 50px rgba(201, 162, 39, 0.8); }
            }

            /* === LINEA DORADA SUPERIOR === */
            #duendes-banner-3x2-fijo::before {
                content: '';
                position: absolute;
                top: 0; left: 0; right: 0;
                height: 2px;
                background: linear-gradient(90deg, transparent, #c9a227, transparent);
            }

            /* === CARRUSEL DE MINIS === */
            #duendes-banner-3x2-fijo .carousel-container {
                position: relative;
                width: 220px;
                height: 220px;
                min-width: 220px;
                flex-shrink: 0;
            }
            #duendes-banner-3x2-fijo .carousel-orbit {
                position: absolute;
                width: 100%;
                height: 100%;
                animation: rotateCircle 20s linear infinite;
            }
            #duendes-banner-3x2-fijo .mini-img {
                position: absolute;
                width: 65px;
                height: 65px;
                border-radius: 50%;
                border: 3px solid #c9a227;
                object-fit: cover;
                box-shadow: 0 5px 20px rgba(201, 162, 39, 0.4);
                animation: floatMini 3s ease-in-out infinite;
                background: #1a1a1a;
            }
            #duendes-banner-3x2-fijo .mini-img:nth-child(1) { top: 0; left: 50%; transform: translateX(-50%); animation-delay: 0s; }
            #duendes-banner-3x2-fijo .mini-img:nth-child(2) { top: 25%; right: 0; animation-delay: 0.5s; }
            #duendes-banner-3x2-fijo .mini-img:nth-child(3) { bottom: 25%; right: 0; animation-delay: 1s; }
            #duendes-banner-3x2-fijo .mini-img:nth-child(4) { bottom: 0; left: 50%; transform: translateX(-50%); animation-delay: 1.5s; }
            #duendes-banner-3x2-fijo .mini-img:nth-child(5) { bottom: 25%; left: 0; animation-delay: 2s; }
            #duendes-banner-3x2-fijo .mini-img:nth-child(6) { top: 25%; left: 0; animation-delay: 2.5s; }

            /* === BADGE 3x2 CENTRAL === */
            #duendes-banner-3x2-fijo .center-gift {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 70px;
                height: 70px;
                background: linear-gradient(135deg, #c9a227 0%, #8b6914 100%);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                animation: pulse3x2 2s ease-in-out infinite;
            }
            #duendes-banner-3x2-fijo .center-gift span {
                color: #0a0a0a;
                font-family: 'Cinzel', serif;
                font-size: 24px;
                font-weight: 700;
            }

            /* === CONTENIDO TEXTO === */
            #duendes-banner-3x2-fijo .banner-content {
                flex: 1;
                text-align: center;
            }
            #duendes-banner-3x2-fijo .banner-subtitle {
                color: rgba(255,255,255,0.6);
                font-family: 'Cormorant Garamond', serif;
                font-size: 14px;
                text-transform: uppercase;
                letter-spacing: 3px;
                margin: 0 0 10px 0;
            }
            #duendes-banner-3x2-fijo .banner-title {
                color: #c9a227;
                font-family: 'Cinzel', serif;
                font-size: clamp(22px, 4vw, 36px);
                margin: 0 0 15px 0;
                letter-spacing: 3px;
                text-shadow: 0 2px 20px rgba(201, 162, 39, 0.3);
                line-height: 1.2;
            }
            #duendes-banner-3x2-fijo .banner-desc {
                color: rgba(255,255,255,0.85);
                font-family: 'Cormorant Garamond', serif;
                font-size: clamp(16px, 2.5vw, 20px);
                margin: 0 0 25px 0;
                line-height: 1.5;
            }
            #duendes-banner-3x2-fijo .banner-desc strong {
                color: #c9a227;
            }

            /* === BOTON === */
            #duendes-banner-3x2-fijo .btn-regalo {
                display: inline-block;
                background: linear-gradient(135deg, #c9a227 0%, #a88a42 100%);
                color: #0a0a0a;
                padding: 18px 45px;
                border-radius: 50px;
                text-decoration: none;
                font-family: 'Cinzel', serif;
                font-size: 15px;
                font-weight: 700;
                text-transform: uppercase;
                letter-spacing: 2px;
                box-shadow: 0 10px 30px rgba(201, 162, 39, 0.5);
                transition: all 0.3s ease;
                position: relative;
                overflow: hidden;
            }
            #duendes-banner-3x2-fijo .btn-regalo::before {
                content: '';
                position: absolute;
                top: 0; left: 0; right: 0; bottom: 0;
                background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
                background-size: 200% 100%;
                animation: shimmer 3s infinite;
            }
            #duendes-banner-3x2-fijo .btn-regalo:hover {
                transform: translateY(-3px) scale(1.02);
                box-shadow: 0 15px 40px rgba(201, 162, 39, 0.6);
                color: #0a0a0a;
                text-decoration: none;
            }

            /* === TABLET (768px - 1024px) === */
            @media (max-width: 1024px) {
                #duendes-banner-3x2-fijo {
                    padding: 35px 30px;
                    gap: 30px;
                    margin: 25px 15px;
                    width: calc(100% - 30px);
                }
                #duendes-banner-3x2-fijo .carousel-container {
                    width: 180px;
                    height: 180px;
                    min-width: 180px;
                }
                #duendes-banner-3x2-fijo .mini-img {
                    width: 55px;
                    height: 55px;
                }
                #duendes-banner-3x2-fijo .center-gift {
                    width: 60px;
                    height: 60px;
                }
                #duendes-banner-3x2-fijo .center-gift span {
                    font-size: 20px;
                }
            }

            /* === MOBILE (menos de 768px) === */
            @media (max-width: 768px) {
                #duendes-banner-3x2-fijo {
                    flex-direction: column;
                    text-align: center;
                    padding: 30px 20px;
                    gap: 25px;
                    margin: 20px 10px;
                    width: calc(100% - 20px);
                    border-radius: 20px;
                }
                #duendes-banner-3x2-fijo .carousel-container {
                    width: 160px;
                    height: 160px;
                    min-width: 160px;
                    margin: 0 auto;
                }
                #duendes-banner-3x2-fijo .mini-img {
                    width: 48px;
                    height: 48px;
                    border-width: 2px;
                }
                #duendes-banner-3x2-fijo .center-gift {
                    width: 55px;
                    height: 55px;
                }
                #duendes-banner-3x2-fijo .center-gift span {
                    font-size: 18px;
                }
                #duendes-banner-3x2-fijo .banner-subtitle {
                    font-size: 12px;
                    letter-spacing: 2px;
                }
                #duendes-banner-3x2-fijo .btn-regalo {
                    padding: 15px 35px;
                    font-size: 13px;
                    letter-spacing: 1.5px;
                }
            }

            /* === MOBILE PEQUEÑO (menos de 480px) === */
            @media (max-width: 480px) {
                #duendes-banner-3x2-fijo {
                    padding: 25px 15px;
                    margin: 15px 8px;
                    width: calc(100% - 16px);
                    border-radius: 15px;
                }
                #duendes-banner-3x2-fijo .carousel-container {
                    width: 140px;
                    height: 140px;
                    min-width: 140px;
                }
                #duendes-banner-3x2-fijo .mini-img {
                    width: 42px;
                    height: 42px;
                }
                #duendes-banner-3x2-fijo .center-gift {
                    width: 50px;
                    height: 50px;
                }
                #duendes-banner-3x2-fijo .center-gift span {
                    font-size: 16px;
                }
                #duendes-banner-3x2-fijo .btn-regalo {
                    padding: 14px 30px;
                    font-size: 12px;
                    width: 100%;
                    max-width: 280px;
                }
            }
        </style>

        <!-- Carrusel circular de minis -->
        <div class="carousel-container">
            <div class="carousel-orbit">
                <?php
                $i = 0;
                foreach ($minis_images as $img):
                    if ($i >= 6) break;
                ?>
                    <img src="<?php echo esc_url($img); ?>" class="mini-img" alt="Mini guardián">
                <?php
                    $i++;
                endforeach;
                ?>
            </div>
            <div class="center-gift">
                <span>3x2</span>
            </div>
        </div>

        <!-- Contenido -->
        <div class="banner-content">
            <p class="banner-subtitle">Promo 3x2</p>
            <h3 class="banner-title">LLEVAS 3 Y PAGAS 2</h3>
            <p class="banner-desc">Te regalamos un <strong>duende mini</strong></p>
            <a href="<?php echo esc_url(get_permalink(wc_get_page_id('shop'))); ?>" class="btn-regalo">
                VER GUARDIANES
            </a>
        </div>
    </div>
    <?php
    return ob_get_clean();
}

// ═══════════════════════════════════════════════════════════════════════════
// NOTIFICACIÓN POPUP AL AGREGAR 2DO GUARDIÁN
// ═══════════════════════════════════════════════════════════════════════════

add_action('wp_footer', 'duendes_popup_segundo_guardian_script');

function duendes_popup_segundo_guardian_script() {
    if (!DUENDES_PROMO_3X2_ACTIVA) return;
    if (is_cart() || is_checkout()) return;
    ?>
    <div id="duendes-popup-3x2" style="
        display: none;
        position: fixed;
        top: 0; left: 0; right: 0; bottom: 0;
        background: rgba(0,0,0,0.85);
        z-index: 99999;
        justify-content: center;
        align-items: center;
        padding: 20px;
    ">
        <div style="
            background: linear-gradient(145deg, #0a0a0a 0%, #1a1a2e 100%);
            border: 2px solid rgba(201, 162, 39, 0.5);
            border-radius: 25px;
            padding: 45px 40px;
            max-width: 450px;
            text-align: center;
            position: relative;
            animation: popIn 0.4s ease-out;
        ">
            <style>
                @keyframes popIn {
                    from { transform: scale(0.8); opacity: 0; }
                    to { transform: scale(1); opacity: 1; }
                }
                @keyframes confettiPop {
                    0% { transform: translateY(0) rotate(0deg); opacity: 1; }
                    100% { transform: translateY(-100px) rotate(720deg); opacity: 0; }
                }
            </style>

            <!-- Badge 3x2 -->
            <div style="position: absolute; top: -25px; left: 50%; transform: translateX(-50%); width: 50px; height: 50px; background: linear-gradient(135deg, #c9a227 0%, #8b6914 100%); border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 5px 20px rgba(201, 162, 39, 0.5);">
                <span style="color: #0a0a0a; font-family: 'Cinzel', serif; font-size: 14px; font-weight: 700;">3x2</span>
            </div>

            <h3 style="
                color: #c9a227;
                font-family: 'Cinzel', serif;
                font-size: 26px;
                margin: 20px 0 15px;
                letter-spacing: 2px;
            ">PROMO 3x2 ACTIVADA</h3>

            <p style="
                color: rgba(255,255,255,0.9);
                font-family: 'Cormorant Garamond', serif;
                font-size: 20px;
                margin: 0 0 25px;
                line-height: 1.5;
            ">
                Llevás 3 y pagás 2<br>
                <span style="font-size: 18px; color: rgba(255,255,255,0.7);">Elegí tu <strong style="color:#c9a227;">duende mini de regalo</strong></span>
            </p>

            <a href="<?php echo wc_get_cart_url(); ?>" style="
                display: inline-block;
                background: linear-gradient(135deg, #c9a227 0%, #a88a42 100%);
                color: #0a0a0a;
                padding: 16px 35px;
                border-radius: 30px;
                text-decoration: none;
                font-family: 'Cinzel', serif;
                font-size: 14px;
                font-weight: 600;
                text-transform: uppercase;
                letter-spacing: 1.5px;
                transition: all 0.3s;
                box-shadow: 0 8px 25px rgba(201, 162, 39, 0.4);
            ">Elegir mi regalo</a>

            <button onclick="cerrarPopup3x2()" style="
                display: block;
                margin: 20px auto 0;
                background: none;
                border: none;
                color: rgba(255,255,255,0.5);
                font-family: 'Cormorant Garamond', serif;
                font-size: 14px;
                cursor: pointer;
            ">Seguir comprando</button>
        </div>
    </div>

    <script>
    (function() {
        // Interceptar el evento add_to_cart de WooCommerce
        jQuery(document.body).on('added_to_cart', function(e, fragments, cart_hash, button) {
            // Hacer petición AJAX para verificar si ahora tiene 2+ guardianes
            jQuery.post('<?php echo admin_url('admin-ajax.php'); ?>', {
                action: 'duendes_check_promo_3x2'
            }, function(response) {
                if (response.success && response.data.mostrar_popup) {
                    document.getElementById('duendes-popup-3x2').style.display = 'flex';
                    // Ocultar el banner inferior si existe
                    var banner = document.getElementById('duendes-banner-3x2');
                    if (banner) banner.style.display = 'none';
                }
            });
        });
    })();

    function cerrarPopup3x2() {
        document.getElementById('duendes-popup-3x2').style.display = 'none';
    }

    // Cerrar con ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') cerrarPopup3x2();
    });
    </script>
    <?php
}

// AJAX para verificar si mostrar popup
add_action('wp_ajax_duendes_check_promo_3x2', 'duendes_ajax_check_promo_3x2');
add_action('wp_ajax_nopriv_duendes_check_promo_3x2', 'duendes_ajax_check_promo_3x2');

function duendes_ajax_check_promo_3x2() {
    if (!WC()->cart) {
        wp_send_json_success(['mostrar_popup' => false]);
        return;
    }

    $guardianes = duendes_contar_guardianes_carrito();
    $minis_actuales = duendes_contar_minis_gratis_en_carrito();

    // Mostrar popup solo si:
    // 1. Tiene exactamente 2 guardianes (primer umbral alcanzado)
    // 2. O tiene 4, 6, etc. (nuevos umbrales)
    // 3. Y aún no tiene todos sus minis
    $minis_merecidos = floor($guardianes / DUENDES_PROMO_GUARDIANES_REQUERIDOS);
    $mostrar = ($guardianes >= 2) && ($minis_actuales < $minis_merecidos);

    wp_send_json_success(['mostrar_popup' => $mostrar, 'guardianes' => $guardianes]);
}

function duendes_verificar_promo_3x2() {
    if (!DUENDES_PROMO_3X2_ACTIVA) return;
    if (!WC()->cart) return;

    $guardianes = duendes_contar_guardianes_carrito();
    $minis_actuales = duendes_contar_minis_gratis_en_carrito();
    $minis_merecidos = floor($guardianes / DUENDES_PROMO_GUARDIANES_REQUERIDOS);
    $minis_pendientes = $minis_merecidos - $minis_actuales;

    if ($minis_pendientes > 0) {
        duendes_mostrar_selector_mini($minis_pendientes, $minis_merecidos);
    }
}

function duendes_contar_guardianes_carrito() {
    if (!WC()->cart) return 0;
    $count = 0;
    foreach (WC()->cart->get_cart() as $cart_item) {
        if (!empty($cart_item['duendes_mini_gratis'])) continue;
        if (!has_term(DUENDES_PROMO_CATEGORIA_MINI, 'product_cat', $cart_item['product_id'])) {
            $count += $cart_item['quantity'];
        }
    }
    return $count;
}

function duendes_contar_minis_gratis_en_carrito() {
    if (!WC()->cart) return 0;
    $count = 0;
    foreach (WC()->cart->get_cart() as $cart_item) {
        if (!empty($cart_item['duendes_mini_gratis'])) {
            $count += $cart_item['quantity'];
        }
    }
    return $count;
}

// ═══════════════════════════════════════════════════════════════════════════
// SELECTOR DE MINI GRATIS
// ═══════════════════════════════════════════════════════════════════════════

function duendes_mostrar_selector_mini($minis_pendientes = 1, $minis_totales = 1) {
    $categoria = get_term_by('slug', DUENDES_PROMO_CATEGORIA_MINI, 'product_cat');
    if (!$categoria) return;

    $query = new WP_Query([
        'post_type' => 'product',
        'post_status' => 'publish',
        'posts_per_page' => -1, // TODOS los minis (11)
        'tax_query' => [[
            'taxonomy' => 'product_cat',
            'field' => 'term_id',
            'terms' => $categoria->term_id,
        ]]
    ]);

    $minis = [];
    if ($query->have_posts()) {
        while ($query->have_posts()) {
            $query->the_post();
            $product = wc_get_product(get_the_ID());
            if ($product && $product->is_in_stock()) {
                $minis[] = $product;
            }
        }
        wp_reset_postdata();
    }

    if (empty($minis)) return;
    ?>
    <style>
        .duendes-mini-item {
            background: rgba(201,162,39,0.05);
            border: 2px solid rgba(201,162,39,0.2);
            border-radius: 15px;
            padding: 15px 10px 12px;
            cursor: pointer;
            transition: all 0.3s ease;
            text-align: center;
        }
        .duendes-mini-item:hover {
            border-color: rgba(201,162,39,0.5);
            transform: translateY(-3px);
        }
        .duendes-mini-item.selected {
            border-color: #c9a227 !important;
            background: rgba(201,162,39,0.15) !important;
            box-shadow: 0 0 25px rgba(201,162,39,0.4) !important;
        }
        .duendes-mini-item img {
            width: 80px;
            height: 80px;
            object-fit: cover;
            border-radius: 50%;
            display: block;
            margin: 0 auto 10px;
            border: 3px solid #c9a227;
            box-shadow: 0 4px 15px rgba(201,162,39,0.3);
            transition: all 0.3s ease;
        }
        .duendes-mini-item:hover img {
            transform: scale(1.05);
            box-shadow: 0 6px 20px rgba(201,162,39,0.5);
        }
        .duendes-mini-item .mini-nombre {
            display: block;
            color: #fff;
            font-family: 'Cinzel', serif;
            font-size: 12px;
            font-weight: 500;
            line-height: 1.3;
            letter-spacing: 0.5px;
            margin-top: 8px;
        }
        @media (max-width: 600px) {
            .duendes-mini-item img {
                width: 65px;
                height: 65px;
            }
            .duendes-mini-item .mini-nombre {
                font-size: 11px;
            }
        }
    </style>
    <div id="duendes-promo-3x2" style="margin:30px 0;background:linear-gradient(145deg,#0a0a0a,#1a1a1a);border:1px solid rgba(201,162,39,0.3);border-radius:20px;padding:35px;text-align:center;position:relative;">
        <div style="position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,transparent,#c9a227,transparent);"></div>

        <h3 style="color:#c9a227;margin:0 0 8px;font-family:'Cinzel',serif;font-size:22px;font-weight:500;letter-spacing:2px;text-transform:uppercase;">
            <?php echo $minis_pendientes > 1 ? "Elegí tus {$minis_pendientes} regalos" : "PROMO 3x2 - Elegí tu regalo"; ?>
        </h3>
        <p style="color:rgba(255,255,255,0.7);margin:0 0 25px;font-family:'Cormorant Garamond',serif;font-size:16px;font-style:italic;">
            <?php echo $minis_pendientes > 1 ? "Seleccioná {$minis_pendientes} duendes mini" : "Seleccioná el duende mini que querés de regalo"; ?>
        </p>

        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(95px,1fr));gap:15px;max-width:700px;margin:0 auto 25px;">
            <?php foreach ($minis as $mini):
                $img = wp_get_attachment_image_url($mini->get_image_id(), 'medium') ?: wc_placeholder_img_src();
            ?>
            <div class="duendes-mini-item" data-id="<?php echo $mini->get_id(); ?>">
                <img src="<?php echo esc_url($img); ?>" alt="<?php echo esc_attr($mini->get_name()); ?>">
                <span class="mini-nombre"><?php echo esc_html($mini->get_name()); ?></span>
            </div>
            <?php endforeach; ?>
        </div>

        <button id="duendes-btn-agregar" type="button" style="background:linear-gradient(135deg,#c9a227,#8b6914);color:#0a0a0a;border:none;padding:14px 35px;border-radius:25px;font-family:'Cinzel',serif;font-size:13px;font-weight:600;letter-spacing:1.5px;text-transform:uppercase;cursor:pointer;opacity:0.35;transition:all 0.3s;">
            Agregar mi regalo
        </button>

        <p style="color:rgba(255,255,255,0.4);font-size:12px;margin:18px 0 0;font-family:'Cormorant Garamond',serif;font-style:italic;">
            Promo 3x2: Por cada 2 guardianes, un mini de regalo
            <?php if ($minis_totales > 1): ?> • Te corresponden <?php echo $minis_totales; ?> minis<?php endif; ?>
        </p>
    </div>

    <script>
    jQuery(function($) {
        var elegido = null;

        // Event delegation - funciona aunque el contenido se actualice
        $(document).on('click', '.duendes-mini-item', function(e) {
            e.preventDefault();
            e.stopPropagation();

            // Quitar selección de todos
            $('.duendes-mini-item').removeClass('selected');

            // Agregar selección al clickeado
            $(this).addClass('selected');

            // Guardar ID del mini elegido
            elegido = $(this).data('id');

            // Activar botón
            $('#duendes-btn-agregar').css('opacity', '1').prop('disabled', false);

            console.log('Mini seleccionado:', elegido);
        });

        // Click en botón agregar
        $(document).on('click', '#duendes-btn-agregar', function(e) {
            e.preventDefault();

            if (!elegido) {
                alert('Seleccioná un mini guardián primero');
                return;
            }

            var $btn = $(this);
            $btn.text('Agregando...').css('opacity', '0.5').prop('disabled', true);

            $.ajax({
                url: '<?php echo admin_url('admin-ajax.php'); ?>',
                type: 'POST',
                data: {
                    action: 'duendes_agregar_mini_gratis',
                    product_id: elegido,
                    nonce: '<?php echo wp_create_nonce('duendes_mini_gratis'); ?>'
                },
                success: function(response) {
                    console.log('Respuesta:', response);
                    if (response.success) {
                        location.reload();
                    } else {
                        alert(response.data || 'Error al agregar');
                        $btn.text('Agregar mi regalo').css('opacity', '1').prop('disabled', false);
                    }
                },
                error: function(xhr, status, error) {
                    console.error('Error AJAX:', error);
                    alert('Error de conexión. Intentá de nuevo.');
                    $btn.text('Agregar mi regalo').css('opacity', '1').prop('disabled', false);
                }
            });
        });
    });
    </script>
    <?php
}

// ═══════════════════════════════════════════════════════════════════════════
// AJAX
// ═══════════════════════════════════════════════════════════════════════════

add_action('wp_ajax_duendes_agregar_mini_gratis', 'duendes_ajax_agregar_mini_gratis');
add_action('wp_ajax_nopriv_duendes_agregar_mini_gratis', 'duendes_ajax_agregar_mini_gratis');

function duendes_ajax_agregar_mini_gratis() {
    if (!wp_verify_nonce($_POST['nonce'] ?? '', 'duendes_mini_gratis')) {
        wp_send_json_error('Sesión expirada');
    }

    $product_id = intval($_POST['product_id'] ?? 0);
    if (!$product_id) wp_send_json_error('Producto inválido');

    $guardianes = duendes_contar_guardianes_carrito();
    $merecidos = floor($guardianes / DUENDES_PROMO_GUARDIANES_REQUERIDOS);
    $actuales = duendes_contar_minis_gratis_en_carrito();

    if ($guardianes < DUENDES_PROMO_GUARDIANES_REQUERIDOS) wp_send_json_error('Necesitás 2 guardianes');
    if ($actuales >= $merecidos) wp_send_json_error('Ya tenés todos tus regalos');
    if (!has_term(DUENDES_PROMO_CATEGORIA_MINI, 'product_cat', $product_id)) wp_send_json_error('Producto no válido');

    $key = WC()->cart->add_to_cart($product_id, 1, 0, [], [
        'duendes_mini_gratis' => true,
        'duendes_promo_3x2' => true,
    ]);

    $key ? wp_send_json_success() : wp_send_json_error('Error al agregar');
}

// ═══════════════════════════════════════════════════════════════════════════
// PRECIO 0 Y DISPLAY
// ═══════════════════════════════════════════════════════════════════════════

add_action('woocommerce_before_calculate_totals', function($cart) {
    if (is_admin() && !defined('DOING_AJAX')) return;
    if (did_action('woocommerce_before_calculate_totals') >= 2) return;
    foreach ($cart->get_cart() as $item) {
        if (!empty($item['duendes_mini_gratis'])) {
            $item['data']->set_price(0);
        }
    }
}, 99);

add_filter('woocommerce_cart_item_name', function($name, $item, $key) {
    if (!empty($item['duendes_mini_gratis'])) {
        $name .= ' <span style="background:#c9a227;color:#0a0a0a;padding:2px 8px;border-radius:8px;font-size:10px;font-weight:600;margin-left:8px;">REGALO</span>';
    }
    return $name;
}, 10, 3);

add_filter('woocommerce_cart_item_price', function($price, $item, $key) {
    if (!empty($item['duendes_mini_gratis'])) {
        return '<span style="color:#c9a227;font-weight:600;">¡Gratis!</span>';
    }
    return $price;
}, 10, 3);

add_filter('woocommerce_cart_item_quantity', function($qty, $key, $item) {
    if (!empty($item['duendes_mini_gratis'])) {
        return '1';
    }
    return $qty;
}, 10, 3);

// ═══════════════════════════════════════════════════════════════════════════
// VALIDACIÓN
// ═══════════════════════════════════════════════════════════════════════════

add_action('woocommerce_cart_updated', function() {
    if (!WC()->cart) return;
    $guardianes = duendes_contar_guardianes_carrito();
    $merecidos = floor($guardianes / DUENDES_PROMO_GUARDIANES_REQUERIDOS);
    $actuales = duendes_contar_minis_gratis_en_carrito();

    if ($actuales > $merecidos) {
        $remover = $actuales - $merecidos;
        foreach (WC()->cart->get_cart() as $key => $item) {
            if ($remover <= 0) break;
            if (!empty($item['duendes_mini_gratis'])) {
                WC()->cart->remove_cart_item($key);
                $remover--;
            }
        }
    }
});

add_action('woocommerce_checkout_create_order_line_item', function($item, $key, $values, $order) {
    if (!empty($values['duendes_mini_gratis'])) {
        $item->add_meta_data('Regalo Promo 3x2', 'Sí', true);
    }
}, 10, 4);

// ═══════════════════════════════════════════════════════════════════════════
// SHORTCODE PARA INSERTAR BANNER MANUALMENTE
// ═══════════════════════════════════════════════════════════════════════════
// Uso: [duendes_promo_3x2] o [duendes_promo_3x2 estilo="horizontal"]

add_shortcode('duendes_promo_3x2', 'duendes_shortcode_banner_3x2');

function duendes_shortcode_banner_3x2($atts) {
    if (!DUENDES_PROMO_3X2_ACTIVA) return '';

    $atts = shortcode_atts([
        'estilo' => 'card', // card o horizontal
    ], $atts);

    ob_start();

    if ($atts['estilo'] === 'horizontal') {
        // Banner horizontal (tipo strip)
        ?>
        <div style="
            background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%);
            border: 1px solid rgba(201, 162, 39, 0.4);
            border-radius: 15px;
            padding: 20px 30px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 20px;
            margin: 20px 0;
            flex-wrap: wrap;
        ">
            <div style="display: flex; align-items: center; gap: 15px;">
                <div style="width: 45px; height: 45px; background: linear-gradient(135deg, #c9a227 0%, #8b6914 100%); border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 15px rgba(201, 162, 39, 0.4);">
                    <span style="color: #0a0a0a; font-family: 'Cinzel', serif; font-size: 12px; font-weight: 700;">3x2</span>
                </div>
                <div>
                    <h4 style="color: #c9a227; font-family: 'Cinzel', serif; font-size: 18px; margin: 0 0 5px;">PROMO 3x2</h4>
                    <p style="color: rgba(255,255,255,0.8); font-family: 'Cormorant Garamond', serif; font-size: 15px; margin: 0;">
                        Llevás 3 y pagás 2 - te regalamos un <strong style="color:#c9a227;">duende mini</strong>
                    </p>
                </div>
            </div>
            <a href="<?php echo esc_url(get_permalink(wc_get_page_id('shop'))); ?>" style="
                background: linear-gradient(135deg, #c9a227 0%, #a88a42 100%);
                color: #0a0a0a;
                padding: 12px 25px;
                border-radius: 25px;
                text-decoration: none;
                font-family: 'Cinzel', serif;
                font-size: 12px;
                font-weight: 600;
                text-transform: uppercase;
                letter-spacing: 1px;
                white-space: nowrap;
            ">Ver Guardianes</a>
        </div>
        <?php
    } else {
        // Banner tipo card (vertical)
        ?>
        <div style="
            background: linear-gradient(145deg, #0a0a0a 0%, #1a1a2e 100%);
            border: 1px solid rgba(201, 162, 39, 0.4);
            border-radius: 20px;
            padding: 35px;
            text-align: center;
            max-width: 400px;
            margin: 30px auto;
            box-shadow: 0 15px 50px rgba(0, 0, 0, 0.3);
        ">
            <div style="
                width: 80px;
                height: 80px;
                background: linear-gradient(135deg, #c9a227 0%, #8b6914 100%);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                margin: 0 auto 20px;
                box-shadow: 0 0 30px rgba(201, 162, 39, 0.4);
            "><span style="color: #0a0a0a; font-family: 'Cinzel', serif; font-size: 24px; font-weight: 700;">3x2</span></div>

            <h3 style="
                color: #c9a227;
                font-family: 'Cinzel', serif;
                font-size: 24px;
                margin: 0 0 12px;
                letter-spacing: 2px;
            ">LLEVÁS 3 Y PAGÁS 2</h3>

            <p style="
                color: rgba(255,255,255,0.85);
                font-family: 'Cormorant Garamond', serif;
                font-size: 18px;
                margin: 0 0 25px;
                line-height: 1.5;
            ">
                Te regalamos un <strong style="color:#c9a227;">duende mini</strong>
            </p>

            <a href="<?php echo esc_url(get_permalink(wc_get_page_id('shop'))); ?>" style="
                display: inline-block;
                background: linear-gradient(135deg, #c9a227 0%, #a88a42 100%);
                color: #0a0a0a;
                padding: 14px 30px;
                border-radius: 30px;
                text-decoration: none;
                font-family: 'Cinzel', serif;
                font-size: 13px;
                font-weight: 600;
                text-transform: uppercase;
                letter-spacing: 1.5px;
                box-shadow: 0 8px 25px rgba(201, 162, 39, 0.4);
                transition: all 0.3s;
            ">Ver Guardianes</a>

            <p style="
                color: rgba(255,255,255,0.4);
                font-size: 12px;
                margin: 20px 0 0;
                font-family: 'Cormorant Garamond', serif;
                font-style: italic;
            ">Promo 3x2 - Un duende mini de regalo</p>
        </div>
        <?php
    }

    return ob_get_clean();
}
