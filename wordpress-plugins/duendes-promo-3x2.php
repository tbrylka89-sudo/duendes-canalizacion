<?php
/**
 * Plugin Name: Duendes - Promoción 3x2
 * Description: Promo 3x2 - SIN modificar estilos del carrito
 * Version: 3.0
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
        'posts_per_page' => 8,
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
    <div id="duendes-promo-3x2" style="margin:30px 0;background:linear-gradient(145deg,#0a0a0a,#1a1a1a);border:1px solid rgba(201,162,39,0.3);border-radius:20px;padding:35px;text-align:center;position:relative;">
        <div style="position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,transparent,#c9a227,transparent);"></div>

        <h3 style="color:#c9a227;margin:0 0 8px;font-family:'Cinzel',serif;font-size:22px;font-weight:500;letter-spacing:2px;text-transform:uppercase;">
            <?php echo $minis_pendientes > 1 ? "Elegí tus {$minis_pendientes} regalos" : "Tu regalo te espera"; ?>
        </h3>
        <p style="color:rgba(255,255,255,0.7);margin:0 0 25px;font-family:'Cormorant Garamond',serif;font-size:16px;font-style:italic;">
            <?php echo $minis_pendientes > 1 ? "Seleccioná {$minis_pendientes} mini guardianes" : "Seleccioná el mini guardián que querés llevarte"; ?>
        </p>

        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(100px,1fr));gap:12px;max-width:500px;margin:0 auto 25px;">
            <?php foreach ($minis as $mini):
                $img = wp_get_attachment_image_url($mini->get_image_id(), 'thumbnail') ?: wc_placeholder_img_src();
            ?>
            <div class="duendes-mini-item" data-id="<?php echo $mini->get_id(); ?>" style="background:rgba(201,162,39,0.05);border:1px solid rgba(201,162,39,0.2);border-radius:12px;padding:15px 10px;cursor:pointer;transition:all 0.3s;">
                <img src="<?php echo esc_url($img); ?>" style="width:70px;height:70px;object-fit:cover;border-radius:10px;display:block;margin:0 auto 8px;">
                <span style="display:block;color:#fff;font-family:'Cormorant Garamond',serif;font-size:13px;line-height:1.3;"><?php echo esc_html($mini->get_name()); ?></span>
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
    (function() {
        var elegido = null;
        var items = document.querySelectorAll('.duendes-mini-item');
        var btn = document.getElementById('duendes-btn-agregar');

        items.forEach(function(item) {
            item.addEventListener('click', function() {
                items.forEach(function(i) {
                    i.style.borderColor = 'rgba(201,162,39,0.2)';
                    i.style.background = 'rgba(201,162,39,0.05)';
                    i.style.boxShadow = 'none';
                });
                this.style.borderColor = '#c9a227';
                this.style.background = 'rgba(201,162,39,0.15)';
                this.style.boxShadow = '0 0 20px rgba(201,162,39,0.3)';
                elegido = this.getAttribute('data-id');
                btn.style.opacity = '1';
            });
        });

        btn.addEventListener('click', function() {
            if (!elegido || btn.style.opacity !== '1') return;
            btn.textContent = 'Agregando...';
            btn.style.opacity = '0.5';

            fetch('<?php echo admin_url('admin-ajax.php'); ?>', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: 'action=duendes_agregar_mini_gratis&product_id=' + elegido + '&nonce=<?php echo wp_create_nonce('duendes_mini_gratis'); ?>'
            })
            .then(function(r) { return r.json(); })
            .then(function(data) {
                if (data.success) {
                    location.reload();
                } else {
                    alert(data.data || 'Error');
                    btn.textContent = 'Agregar mi regalo';
                    btn.style.opacity = '1';
                }
            });
        });
    })();
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
