<?php
/**
 * Plugin Name: Duendes - Google Analytics 4
 * Description: GA4 tracking con eventos de WooCommerce
 */

if (!defined('ABSPATH')) exit;

define('DUENDES_GA4_ID', 'G-XY1TERVX1M');

// No trackear admins ni bots
function duendes_ga4_should_track() {
    if (is_admin()) return false;
    if (current_user_can('manage_options')) return false;
    if (defined('DOING_CRON') && DOING_CRON) return false;
    return true;
}

// ══════════════════════════════════════
// SCRIPT BASE DE GA4
// ══════════════════════════════════════
add_action('wp_head', function() {
    if (!duendes_ga4_should_track()) return;
    $id = DUENDES_GA4_ID;
    ?>
    <!-- Google Analytics 4 -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=<?php echo esc_attr($id); ?>"></script>
    <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', '<?php echo esc_js($id); ?>', {
        page_title: document.title,
        send_page_view: true
    });
    </script>
    <?php
}, 1);

// ══════════════════════════════════════
// EVENTO: view_item (página de producto)
// ══════════════════════════════════════
add_action('wp_footer', function() {
    if (!duendes_ga4_should_track()) return;
    if (!is_product()) return;

    global $product;
    if (!$product) return;

    $cats = wp_get_post_terms($product->get_id(), 'product_cat', ['fields' => 'names']);
    ?>
    <script>
    gtag('event', 'view_item', {
        currency: 'USD',
        value: <?php echo (float)$product->get_price(); ?>,
        items: [{
            item_id: '<?php echo esc_js($product->get_id()); ?>',
            item_name: '<?php echo esc_js($product->get_name()); ?>',
            item_category: '<?php echo esc_js($cats[0] ?? ''); ?>',
            price: <?php echo (float)$product->get_price(); ?>,
            quantity: 1
        }]
    });
    </script>
    <?php
});

// ══════════════════════════════════════
// EVENTO: add_to_cart
// ══════════════════════════════════════
add_action('wp_footer', function() {
    if (!duendes_ga4_should_track()) return;
    if (!is_product() && !is_shop() && !is_product_category()) return;
    ?>
    <script>
    jQuery(document.body).on('added_to_cart', function(e, fragments, hash, button) {
        var prodName = button.closest('.product')?.querySelector('.woocommerce-loop-product__title')?.textContent
                    || button.closest('.product')?.querySelector('h2')?.textContent
                    || 'Guardián';
        gtag('event', 'add_to_cart', {
            currency: 'USD',
            items: [{ item_name: prodName, quantity: 1 }]
        });
    });
    </script>
    <?php
});

// ══════════════════════════════════════
// EVENTO: begin_checkout
// ══════════════════════════════════════
add_action('wp_footer', function() {
    if (!duendes_ga4_should_track()) return;
    if (!is_checkout()) return;

    $cart = WC()->cart;
    if (!$cart) return;

    $items = [];
    foreach ($cart->get_cart() as $item) {
        $product = $item['data'];
        $items[] = [
            'item_id' => $product->get_id(),
            'item_name' => $product->get_name(),
            'price' => (float)$product->get_price(),
            'quantity' => $item['quantity']
        ];
    }
    ?>
    <script>
    gtag('event', 'begin_checkout', {
        currency: 'USD',
        value: <?php echo (float)$cart->get_total('raw'); ?>,
        items: <?php echo json_encode($items); ?>
    });
    </script>
    <?php
});

// ══════════════════════════════════════
// EVENTO: purchase (Thank You page)
// ══════════════════════════════════════
add_action('woocommerce_thankyou', function($order_id) {
    if (!duendes_ga4_should_track()) return;

    $order = wc_get_order($order_id);
    if (!$order) return;

    // Evitar trackear dos veces
    if ($order->get_meta('_ga4_tracked')) return;
    $order->update_meta_data('_ga4_tracked', 'yes');
    $order->save();

    $items = [];
    foreach ($order->get_items() as $item) {
        $product = $item->get_product();
        $cats = $product ? wp_get_post_terms($product->get_id(), 'product_cat', ['fields' => 'names']) : [];
        $items[] = [
            'item_id' => $product ? $product->get_id() : '',
            'item_name' => $item->get_name(),
            'item_category' => $cats[0] ?? '',
            'price' => (float)$order->get_item_total($item),
            'quantity' => $item->get_quantity()
        ];
    }
    ?>
    <script>
    gtag('event', 'purchase', {
        transaction_id: '<?php echo esc_js($order_id); ?>',
        value: <?php echo (float)$order->get_total(); ?>,
        currency: '<?php echo esc_js($order->get_currency()); ?>',
        shipping: <?php echo (float)$order->get_shipping_total(); ?>,
        items: <?php echo json_encode($items); ?>
    });
    </script>
    <?php
}, 10, 1);
