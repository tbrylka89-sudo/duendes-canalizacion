<?php
/**
 * Plugin Name: Duendes - Promoción 3x2
 * Description: Comprá 2 guardianes y llevate un mini de regalo a elección
 * Version: 1.0
 * Author: Duendes del Uruguay
 */

if (!defined('ABSPATH')) exit;

// ═══════════════════════════════════════════════════════════════════════════
// CONFIGURACIÓN DE LA PROMOCIÓN
// ═══════════════════════════════════════════════════════════════════════════

define('DUENDES_PROMO_3X2_ACTIVA', true);
define('DUENDES_PROMO_GUARDIANES_REQUERIDOS', 2); // Comprar 2
define('DUENDES_PROMO_CATEGORIA_MINI', 'mini'); // Slug de categoría de minis
define('DUENDES_PROMO_MENSAJE', '🎁 ¡Llevás 2 guardianes! Elegí tu mini de regalo');

// ═══════════════════════════════════════════════════════════════════════════
// DETECTAR CUANDO HAY 2+ GUARDIANES EN EL CARRITO
// ═══════════════════════════════════════════════════════════════════════════

add_action('woocommerce_before_cart', 'duendes_verificar_promo_3x2');
add_action('woocommerce_before_checkout_form', 'duendes_verificar_promo_3x2');

function duendes_verificar_promo_3x2() {
    if (!DUENDES_PROMO_3X2_ACTIVA) return;

    $guardianes_en_carrito = duendes_contar_guardianes_carrito();
    $tiene_mini_gratis = duendes_tiene_mini_gratis_en_carrito();

    if ($guardianes_en_carrito >= DUENDES_PROMO_GUARDIANES_REQUERIDOS && !$tiene_mini_gratis) {
        duendes_mostrar_selector_mini();
    }
}

function duendes_contar_guardianes_carrito() {
    if (!WC()->cart) return 0;

    $count = 0;
    foreach (WC()->cart->get_cart() as $cart_item) {
        $product_id = $cart_item['product_id'];

        // No contar los minis gratis
        if (isset($cart_item['duendes_mini_gratis']) && $cart_item['duendes_mini_gratis']) {
            continue;
        }

        // Verificar si es un guardián (no es mini)
        if (!has_term(DUENDES_PROMO_CATEGORIA_MINI, 'product_cat', $product_id)) {
            $count += $cart_item['quantity'];
        }
    }

    return $count;
}

function duendes_tiene_mini_gratis_en_carrito() {
    if (!WC()->cart) return false;

    foreach (WC()->cart->get_cart() as $cart_item) {
        if (isset($cart_item['duendes_mini_gratis']) && $cart_item['duendes_mini_gratis']) {
            return true;
        }
    }

    return false;
}

// ═══════════════════════════════════════════════════════════════════════════
// SELECTOR DE MINI GRATIS
// ═══════════════════════════════════════════════════════════════════════════

function duendes_mostrar_selector_mini() {
    // Obtener minis disponibles
    $minis = wc_get_products([
        'status' => 'publish',
        'limit' => -1,
        'stock_status' => 'instock',
        'category' => [DUENDES_PROMO_CATEGORIA_MINI],
    ]);

    if (empty($minis)) return;

    ?>
    <style>
        @keyframes dfb-selector-fade {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        @keyframes dfb-selector-glow {
            0%, 100% { box-shadow: 0 0 25px rgba(198,169,98,0.15); }
            50% { box-shadow: 0 0 40px rgba(198,169,98,0.25); }
        }
        @keyframes dfb-card-appear {
            from { opacity: 0; transform: scale(0.9); }
            to { opacity: 1; transform: scale(1); }
        }
        .duendes-selector-3x2 {
            background: linear-gradient(135deg, #0d0d14 0%, #1a1525 50%, #0d0d14 100%);
            border: 1px solid rgba(198,169,98,0.3);
            border-radius: 24px;
            padding: 40px;
            margin-bottom: 35px;
            text-align: center;
            position: relative;
            overflow: hidden;
            animation: dfb-selector-fade 0.6s ease-out, dfb-selector-glow 4s ease-in-out infinite;
        }
        .duendes-selector-3x2::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 1px;
            background: linear-gradient(90deg, transparent, rgba(198,169,98,0.5), transparent);
        }
        .dfb-selector-titulo {
            color: #C6A962;
            margin: 0 0 8px 0;
            font-family: 'Cinzel', Georgia, serif;
            font-size: 24px;
            font-weight: 500;
            letter-spacing: 3px;
            text-transform: uppercase;
        }
        .dfb-selector-subtitulo {
            color: rgba(255,255,255,0.7);
            margin: 0 0 30px 0;
            font-family: 'Cormorant Garamond', Georgia, serif;
            font-size: 17px;
            font-style: italic;
        }
        .dfb-minis-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
            gap: 20px;
            max-width: 700px;
            margin: 0 auto 30px auto;
        }
        .dfb-mini-card {
            background: linear-gradient(135deg, rgba(198,169,98,0.08) 0%, rgba(198,169,98,0.02) 100%);
            border: 1px solid rgba(198,169,98,0.2);
            border-radius: 16px;
            padding: 18px;
            cursor: pointer;
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            animation: dfb-card-appear 0.5s ease-out backwards;
        }
        .dfb-mini-card:hover {
            border-color: rgba(198,169,98,0.5);
            transform: translateY(-5px);
            box-shadow: 0 15px 40px rgba(0,0,0,0.3), 0 0 20px rgba(198,169,98,0.1);
        }
        .dfb-mini-card.selected {
            border-color: #C6A962;
            background: linear-gradient(135deg, rgba(198,169,98,0.2) 0%, rgba(198,169,98,0.08) 100%);
            box-shadow: 0 0 30px rgba(198,169,98,0.3), inset 0 0 20px rgba(198,169,98,0.05);
        }
        .dfb-mini-card img {
            width: 100px;
            height: 100px;
            object-fit: cover;
            border-radius: 12px;
            margin-bottom: 12px;
            transition: transform 0.3s ease;
        }
        .dfb-mini-card:hover img {
            transform: scale(1.05);
        }
        .dfb-mini-card p {
            color: rgba(255,255,255,0.85);
            margin: 0;
            font-family: 'Cormorant Garamond', Georgia, serif;
            font-size: 15px;
            line-height: 1.4;
        }
        .dfb-selector-btn {
            background: linear-gradient(135deg, #C6A962 0%, #a88a42 100%);
            color: #0d0d14;
            border: none;
            padding: 16px 40px;
            border-radius: 30px;
            font-family: 'Cinzel', Georgia, serif;
            font-size: 15px;
            font-weight: 600;
            letter-spacing: 2px;
            text-transform: uppercase;
            cursor: pointer;
            opacity: 0.4;
            transition: all 0.4s ease;
        }
        .dfb-selector-btn:not(:disabled) {
            opacity: 1;
        }
        .dfb-selector-btn:not(:disabled):hover {
            transform: scale(1.05);
            box-shadow: 0 10px 30px rgba(198,169,98,0.3);
        }
        .dfb-selector-nota {
            color: rgba(255,255,255,0.4);
            font-size: 12px;
            margin: 20px 0 0 0;
            font-family: 'Cormorant Garamond', Georgia, serif;
            font-style: italic;
        }
    </style>

    <div class="duendes-selector-3x2">
        <h3 class="dfb-selector-titulo">Tu regalo te espera</h3>
        <p class="dfb-selector-subtitulo">
            Elegí el mini guardián que querés llevarte
        </p>

        <div class="dfb-minis-grid">
            <?php $delay = 0; foreach ($minis as $mini):
                $imagen = wp_get_attachment_image_url($mini->get_image_id(), 'thumbnail') ?: wc_placeholder_img_src();
                $delay += 0.1;
            ?>
            <div class="dfb-mini-card" style="animation-delay: <?php echo $delay; ?>s;" onclick="duendesSeleccionarMini(<?php echo $mini->get_id(); ?>, this)">
                <img src="<?php echo esc_url($imagen); ?>" alt="<?php echo esc_attr($mini->get_name()); ?>">
                <p><?php echo esc_html($mini->get_name()); ?></p>
            </div>
            <?php endforeach; ?>
        </div>

        <button id="duendes-agregar-mini-btn" class="dfb-selector-btn" disabled onclick="duendesAgregarMiniGratis()">
            Elegir este regalo
        </button>

        <p class="dfb-selector-nota">
            Por tu compra de <?php echo DUENDES_PROMO_GUARDIANES_REQUERIDOS; ?> o más guardianes
        </p>
    </div>

    <script>
    var duendesMiniSeleccionado = null;

    function duendesSeleccionarMini(productId, element) {
        // Quitar selección anterior
        document.querySelectorAll('.duendes-mini-option').forEach(function(el) {
            el.classList.remove('selected');
        });

        // Seleccionar este
        element.classList.add('selected');
        duendesMiniSeleccionado = productId;

        // Habilitar botón
        document.getElementById('duendes-agregar-mini-btn').disabled = false;
    }

    function duendesAgregarMiniGratis() {
        if (!duendesMiniSeleccionado) return;

        var btn = document.getElementById('duendes-agregar-mini-btn');
        btn.textContent = 'Agregando...';
        btn.disabled = true;

        // Llamar AJAX para agregar el mini gratis
        fetch('<?php echo admin_url('admin-ajax.php'); ?>', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: 'action=duendes_agregar_mini_gratis&product_id=' + duendesMiniSeleccionado + '&nonce=<?php echo wp_create_nonce('duendes_mini_gratis'); ?>'
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Recargar página para mostrar el mini en el carrito
                location.reload();
            } else {
                alert(data.data || 'Error al agregar el regalo');
                btn.textContent = 'Agregar mi regalo';
                btn.disabled = false;
            }
        })
        .catch(error => {
            alert('Error de conexión');
            btn.textContent = 'Agregar mi regalo';
            btn.disabled = false;
        });
    }
    </script>
    <?php
}

// ═══════════════════════════════════════════════════════════════════════════
// AJAX: AGREGAR MINI GRATIS AL CARRITO
// ═══════════════════════════════════════════════════════════════════════════

add_action('wp_ajax_duendes_agregar_mini_gratis', 'duendes_ajax_agregar_mini_gratis');
add_action('wp_ajax_nopriv_duendes_agregar_mini_gratis', 'duendes_ajax_agregar_mini_gratis');

function duendes_ajax_agregar_mini_gratis() {
    // Verificar nonce
    if (!wp_verify_nonce($_POST['nonce'] ?? '', 'duendes_mini_gratis')) {
        wp_send_json_error('Sesión expirada. Recargá la página.');
    }

    $product_id = intval($_POST['product_id'] ?? 0);
    if (!$product_id) {
        wp_send_json_error('Producto no válido');
    }

    // Verificar que sigue teniendo 2+ guardianes
    $guardianes = duendes_contar_guardianes_carrito();
    if ($guardianes < DUENDES_PROMO_GUARDIANES_REQUERIDOS) {
        wp_send_json_error('Necesitás ' . DUENDES_PROMO_GUARDIANES_REQUERIDOS . ' guardianes para el regalo');
    }

    // Verificar que no tenga ya un mini gratis
    if (duendes_tiene_mini_gratis_en_carrito()) {
        wp_send_json_error('Ya tenés un mini de regalo en el carrito');
    }

    // Verificar que el producto es un mini válido
    if (!has_term(DUENDES_PROMO_CATEGORIA_MINI, 'product_cat', $product_id)) {
        wp_send_json_error('Este producto no es un mini válido');
    }

    // Agregar al carrito con precio 0 y marca especial
    $cart_item_data = [
        'duendes_mini_gratis' => true,
        'duendes_promo_3x2' => true,
    ];

    $cart_item_key = WC()->cart->add_to_cart($product_id, 1, 0, [], $cart_item_data);

    if ($cart_item_key) {
        wp_send_json_success(['message' => '¡Mini agregado!', 'cart_item_key' => $cart_item_key]);
    } else {
        wp_send_json_error('No se pudo agregar el mini');
    }
}

// ═══════════════════════════════════════════════════════════════════════════
// PRECIO 0 PARA MINI GRATIS
// ═══════════════════════════════════════════════════════════════════════════

add_action('woocommerce_before_calculate_totals', 'duendes_precio_mini_gratis', 99);

function duendes_precio_mini_gratis($cart) {
    if (is_admin() && !defined('DOING_AJAX')) return;
    if (did_action('woocommerce_before_calculate_totals') >= 2) return;

    foreach ($cart->get_cart() as $cart_item_key => $cart_item) {
        if (isset($cart_item['duendes_mini_gratis']) && $cart_item['duendes_mini_gratis']) {
            $cart_item['data']->set_price(0);
        }
    }
}

// ═══════════════════════════════════════════════════════════════════════════
// MOSTRAR "REGALO" EN EL CARRITO
// ═══════════════════════════════════════════════════════════════════════════

add_filter('woocommerce_cart_item_name', 'duendes_nombre_mini_gratis', 10, 3);

function duendes_nombre_mini_gratis($name, $cart_item, $cart_item_key) {
    if (isset($cart_item['duendes_mini_gratis']) && $cart_item['duendes_mini_gratis']) {
        $name .= ' <span style="background: linear-gradient(135deg, #C6A962, #a88a42); color: #000; padding: 3px 10px; border-radius: 12px; font-size: 11px; font-weight: 600; margin-left: 8px;">🎁 REGALO</span>';
    }
    return $name;
}

add_filter('woocommerce_cart_item_price', 'duendes_precio_display_mini_gratis', 10, 3);

function duendes_precio_display_mini_gratis($price, $cart_item, $cart_item_key) {
    if (isset($cart_item['duendes_mini_gratis']) && $cart_item['duendes_mini_gratis']) {
        return '<span style="color: #C6A962; font-weight: 600;">¡Gratis!</span>';
    }
    return $price;
}

// ═══════════════════════════════════════════════════════════════════════════
// VALIDAR QUE SIGUE TENIENDO 2+ GUARDIANES AL ACTUALIZAR CARRITO
// ═══════════════════════════════════════════════════════════════════════════

add_action('woocommerce_cart_updated', 'duendes_validar_promo_3x2');

function duendes_validar_promo_3x2() {
    if (!WC()->cart) return;

    $guardianes = duendes_contar_guardianes_carrito();

    // Si ya no tiene suficientes guardianes, quitar el mini gratis
    if ($guardianes < DUENDES_PROMO_GUARDIANES_REQUERIDOS) {
        foreach (WC()->cart->get_cart() as $cart_item_key => $cart_item) {
            if (isset($cart_item['duendes_mini_gratis']) && $cart_item['duendes_mini_gratis']) {
                WC()->cart->remove_cart_item($cart_item_key);
                wc_add_notice('El mini de regalo fue removido porque ya no tenés ' . DUENDES_PROMO_GUARDIANES_REQUERIDOS . ' guardianes en el carrito.', 'notice');
            }
        }
    }
}

// ═══════════════════════════════════════════════════════════════════════════
// NO PERMITIR EDITAR CANTIDAD DEL MINI GRATIS
// ═══════════════════════════════════════════════════════════════════════════

add_filter('woocommerce_cart_item_quantity', 'duendes_cantidad_mini_gratis', 10, 3);

function duendes_cantidad_mini_gratis($product_quantity, $cart_item_key, $cart_item) {
    if (isset($cart_item['duendes_mini_gratis']) && $cart_item['duendes_mini_gratis']) {
        return '<span style="color: #C6A962;">1</span>';
    }
    return $product_quantity;
}

// ═══════════════════════════════════════════════════════════════════════════
// GUARDAR INFO EN LA ORDEN
// ═══════════════════════════════════════════════════════════════════════════

add_action('woocommerce_checkout_create_order_line_item', 'duendes_guardar_mini_gratis_orden', 10, 4);

function duendes_guardar_mini_gratis_orden($item, $cart_item_key, $values, $order) {
    if (isset($values['duendes_mini_gratis']) && $values['duendes_mini_gratis']) {
        $item->add_meta_data('_duendes_mini_gratis', 'yes', true);
        $item->add_meta_data('Mini de Regalo (Promo 3x2)', '¡Sí!', true);
    }
}

// ═══════════════════════════════════════════════════════════════════════════
// BANNER PROMOCIONAL PARA LA TIENDA
// ═══════════════════════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════════════════════
// UBICACIONES DEL BANNER
// ═══════════════════════════════════════════════════════════════════════════

// 1. Tienda (página de productos)
add_action('woocommerce_before_shop_loop', 'duendes_banner_promo_3x2', 5);

// 2. Página de producto individual (arriba de productos relacionados)
add_action('woocommerce_after_single_product_summary', 'duendes_banner_promo_3x2_producto', 15);

function duendes_banner_promo_3x2_producto() {
    // Solo mostrar si NO es un mini (no tiene sentido en la página del mini)
    global $product;
    if ($product && has_term(DUENDES_PROMO_CATEGORIA_MINI, 'product_cat', $product->get_id())) {
        return;
    }
    duendes_banner_promo_3x2();
}

// 3. Homepage (si usa widgets o shortcode)
add_shortcode('duendes_promo_3x2', function() {
    if (!DUENDES_PROMO_3X2_ACTIVA) return '';
    ob_start();
    duendes_banner_promo_3x2();
    return ob_get_clean();
});

// 4. Widget para Elementor/Homepage
add_action('woocommerce_before_main_content', function() {
    if (is_front_page() || is_home()) {
        duendes_banner_promo_3x2();
    }
}, 5);

function duendes_banner_promo_3x2() {
    if (!DUENDES_PROMO_3X2_ACTIVA) return;

    // Obtener 3 minis aleatorios para mostrar
    $minis = wc_get_products([
        'status' => 'publish',
        'limit' => 3,
        'orderby' => 'rand',
        'category' => [DUENDES_PROMO_CATEGORIA_MINI],
    ]);

    ?>
    <style>
        @keyframes dfb-float {
            0%, 100% { transform: translateY(0) rotate(0deg); }
            50% { transform: translateY(-8px) rotate(2deg); }
        }
        @keyframes dfb-float-delayed {
            0%, 100% { transform: translateY(0) rotate(0deg); }
            50% { transform: translateY(-10px) rotate(-2deg); }
        }
        @keyframes dfb-glow {
            0%, 100% { box-shadow: 0 5px 30px rgba(198,169,98,0.2); }
            50% { box-shadow: 0 8px 40px rgba(198,169,98,0.35); }
        }
        @keyframes dfb-shimmer {
            0% { left: -100%; }
            100% { left: 100%; }
        }
        @keyframes dfb-pulse-soft {
            0%, 100% { opacity: 0.6; }
            50% { opacity: 1; }
        }
        .duendes-banner-3x2 {
            position: relative;
            background: linear-gradient(135deg, #0a0a10 0%, #12101a 100%);
            border: 1px solid rgba(198,169,98,0.2);
            border-radius: 16px;
            padding: 0;
            margin-bottom: 30px;
            display: grid;
            grid-template-columns: 1fr auto;
            overflow: hidden;
        }
        .duendes-banner-3x2::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 1px;
            background: linear-gradient(90deg, transparent, rgba(198,169,98,0.5), transparent);
        }

        /* Contenido principal */
        .dfb-3x2-main {
            padding: 35px 40px;
            display: flex;
            flex-direction: column;
            justify-content: center;
        }
        .dfb-3x2-eyebrow {
            color: #C6A962;
            font-family: 'Cinzel', serif;
            font-size: 11px;
            letter-spacing: 3px;
            text-transform: uppercase;
            margin: 0 0 10px 0;
            opacity: 0.8;
        }
        .dfb-3x2-titulo {
            color: #fff;
            margin: 0 0 8px 0;
            font-family: 'Cormorant Garamond', Georgia, serif;
            font-size: 26px;
            font-weight: 500;
            line-height: 1.2;
        }
        .dfb-3x2-titulo em {
            color: #C6A962;
            font-style: normal;
        }
        .dfb-3x2-desc {
            color: rgba(255,255,255,0.6);
            margin: 0;
            font-family: 'Cormorant Garamond', Georgia, serif;
            font-size: 15px;
            font-style: italic;
        }

        /* Área visual con minis */
        .dfb-3x2-visual {
            position: relative;
            width: 280px;
            background: linear-gradient(135deg, rgba(198,169,98,0.08) 0%, rgba(198,169,98,0.02) 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
            overflow: hidden;
        }
        .dfb-3x2-visual::before {
            content: '';
            position: absolute;
            top: 0;
            bottom: 0;
            left: 0;
            width: 1px;
            background: linear-gradient(180deg, transparent, rgba(198,169,98,0.3), transparent);
        }
        .dfb-3x2-visual::after {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 60%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.03), transparent);
            animation: dfb-shimmer 4s ease-in-out infinite;
        }

        /* Minis flotantes */
        .dfb-3x2-minis {
            display: flex;
            align-items: center;
            gap: 8px;
            position: relative;
            z-index: 1;
        }
        .dfb-3x2-mini {
            width: 65px;
            height: 65px;
            border-radius: 50%;
            overflow: hidden;
            border: 2px solid rgba(198,169,98,0.3);
            animation: dfb-float 4s ease-in-out infinite, dfb-glow 3s ease-in-out infinite;
            transition: all 0.3s ease;
        }
        .dfb-3x2-mini:nth-child(1) { animation-delay: 0s; }
        .dfb-3x2-mini:nth-child(2) {
            animation: dfb-float-delayed 4.5s ease-in-out infinite, dfb-glow 3s ease-in-out infinite;
            animation-delay: 0.5s;
            width: 75px;
            height: 75px;
        }
        .dfb-3x2-mini:nth-child(3) { animation-delay: 1s; }
        .dfb-3x2-mini:hover {
            transform: scale(1.1);
            border-color: #C6A962;
        }
        .dfb-3x2-mini img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }

        /* Badge de regalo - PROMINENTE */
        .dfb-3x2-gift {
            position: absolute;
            top: 50%;
            right: 15px;
            transform: translateY(-50%);
            background: linear-gradient(135deg, #C6A962 0%, #d4b86a 50%, #C6A962 100%);
            background-size: 200% 200%;
            color: #0a0a10;
            font-family: 'Cinzel', serif;
            font-size: 14px;
            font-weight: 700;
            letter-spacing: 2px;
            text-transform: uppercase;
            padding: 15px 20px;
            border-radius: 8px;
            animation: dfb-pulse-soft 2s ease-in-out infinite, dfb-gradient-shift 3s ease infinite;
            box-shadow: 0 4px 20px rgba(198,169,98,0.4), 0 0 30px rgba(198,169,98,0.2);
        }
        @keyframes dfb-gradient-shift {
            0%, 100% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
        }

        /* Sin minis - mostrar texto */
        .dfb-3x2-no-minis {
            color: rgba(255,255,255,0.5);
            font-family: 'Cormorant Garamond', serif;
            font-size: 14px;
            font-style: italic;
            text-align: center;
            padding: 20px;
        }

        @media (max-width: 700px) {
            .duendes-banner-3x2 {
                grid-template-columns: 1fr;
            }
            .dfb-3x2-main {
                padding: 28px 25px;
                text-align: center;
            }
            .dfb-3x2-visual {
                width: 100%;
                padding: 25px;
                justify-content: center;
            }
            .dfb-3x2-visual::before {
                display: none;
            }
            .dfb-3x2-titulo {
                font-size: 22px;
            }
        }
    </style>

    <div class="duendes-banner-3x2">
        <div class="dfb-3x2-main">
            <p class="dfb-3x2-eyebrow">Promo especial</p>
            <h3 class="dfb-3x2-titulo">
                Llevás dos guardianes,<br>
                <em>un mini te elige a vos</em>
            </h3>
            <p class="dfb-3x2-desc">El tercero va de regalo</p>
        </div>

        <div class="dfb-3x2-visual">
            <?php if (!empty($minis)): ?>
            <div class="dfb-3x2-minis">
                <?php foreach ($minis as $mini):
                    $img = wp_get_attachment_image_url($mini->get_image_id(), 'thumbnail');
                    if (!$img) $img = wc_placeholder_img_src('thumbnail');
                ?>
                <div class="dfb-3x2-mini">
                    <img src="<?php echo esc_url($img); ?>" alt="<?php echo esc_attr($mini->get_name()); ?>">
                </div>
                <?php endforeach; ?>
            </div>
            <?php else: ?>
            <p class="dfb-3x2-no-minis">Elegí tu mini<br>favorito</p>
            <?php endif; ?>
            <span class="dfb-3x2-gift">Regalo</span>
        </div>
    </div>
    <?php
}

// ═══════════════════════════════════════════════════════════════════════════
// PANEL DE ADMIN SIMPLE
// ═══════════════════════════════════════════════════════════════════════════

add_action('admin_menu', function() {
    add_submenu_page(
        'woocommerce',
        'Promoción 3x2',
        'Promo 3x2',
        'manage_woocommerce',
        'duendes-promo-3x2',
        'duendes_admin_promo_3x2'
    );
});

function duendes_admin_promo_3x2() {
    // Guardar configuración
    if (isset($_POST['duendes_save_promo']) && wp_verify_nonce($_POST['_wpnonce'], 'duendes_promo_3x2')) {
        update_option('duendes_promo_3x2_activa', isset($_POST['promo_activa']) ? 1 : 0);
        update_option('duendes_promo_3x2_guardianes', intval($_POST['guardianes_requeridos']));
        update_option('duendes_promo_3x2_categoria', sanitize_text_field($_POST['categoria_mini']));
        echo '<div class="notice notice-success"><p>Configuración guardada.</p></div>';
    }

    $activa = get_option('duendes_promo_3x2_activa', 1);
    $guardianes = get_option('duendes_promo_3x2_guardianes', 2);
    $categoria = get_option('duendes_promo_3x2_categoria', 'mini');

    // Contar órdenes con promo
    global $wpdb;
    $ordenes_con_promo = $wpdb->get_var("
        SELECT COUNT(DISTINCT order_id)
        FROM {$wpdb->prefix}woocommerce_order_itemmeta
        WHERE meta_key = '_duendes_mini_gratis' AND meta_value = 'yes'
    ");

    ?>
    <div class="wrap">
        <h1>🎁 Promoción 3x2</h1>

        <div style="display: grid; grid-template-columns: 1fr 300px; gap: 20px; margin-top: 20px;">
            <div style="background: #fff; padding: 25px; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                <h2 style="margin-top: 0;">Configuración</h2>

                <form method="post">
                    <?php wp_nonce_field('duendes_promo_3x2'); ?>

                    <table class="form-table">
                        <tr>
                            <th>Estado</th>
                            <td>
                                <label>
                                    <input type="checkbox" name="promo_activa" value="1" <?php checked($activa, 1); ?>>
                                    Promoción activa
                                </label>
                            </td>
                        </tr>
                        <tr>
                            <th>Guardianes requeridos</th>
                            <td>
                                <input type="number" name="guardianes_requeridos" value="<?php echo esc_attr($guardianes); ?>" min="1" max="10" style="width: 80px;">
                                <p class="description">Cantidad de guardianes necesarios para obtener el regalo</p>
                            </td>
                        </tr>
                        <tr>
                            <th>Categoría de minis</th>
                            <td>
                                <input type="text" name="categoria_mini" value="<?php echo esc_attr($categoria); ?>" class="regular-text">
                                <p class="description">Slug de la categoría de productos que se ofrecen como regalo</p>
                            </td>
                        </tr>
                    </table>

                    <p class="submit">
                        <input type="submit" name="duendes_save_promo" class="button-primary" value="Guardar cambios">
                    </p>
                </form>
            </div>

            <div style="background: linear-gradient(135deg, #1a1a28, #2a1a2a); padding: 25px; border-radius: 8px; color: #fff;">
                <h3 style="color: #C6A962; margin-top: 0;">📊 Estadísticas</h3>

                <div style="text-align: center; padding: 20px 0;">
                    <p style="color: rgba(255,255,255,0.6); margin: 0 0 5px 0; font-size: 12px;">
                        Órdenes con promoción
                    </p>
                    <p style="color: #C6A962; font-size: 48px; margin: 0; font-weight: 700;">
                        <?php echo intval($ordenes_con_promo); ?>
                    </p>
                </div>

                <hr style="border-color: rgba(198,169,98,0.2); margin: 20px 0;">

                <p style="color: rgba(255,255,255,0.7); font-size: 14px; line-height: 1.6;">
                    <strong style="color: #C6A962;">Cómo funciona:</strong><br>
                    1. Cliente agrega 2+ guardianes<br>
                    2. Aparece selector de minis<br>
                    3. Elige su regalo<br>
                    4. Mini se agrega gratis
                </p>
            </div>
        </div>

        <div style="background: #fff; padding: 25px; border-radius: 8px; margin-top: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
            <h3>Preview del Banner</h3>
            <div style="background: #0a0a0f; padding: 30px; border-radius: 8px;">
                <?php duendes_banner_promo_3x2(); ?>
            </div>
        </div>
    </div>
    <?php
}
