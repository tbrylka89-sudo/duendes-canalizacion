<?php
/**
 * Crear orden de prueba - Se auto-elimina
 * Dispara todos los hooks como una compra real
 */

if (!defined('ABSPATH')) exit;

add_action('init', function() {
    // Solo ejecutar una vez
    if (get_transient('duendes_orden_prueba_creada')) return;
    set_transient('duendes_orden_prueba_creada', true, 3600);

    // Esperar a que WooCommerce esté listo
    if (!function_exists('wc_create_order')) return;

    // Buscar un producto para la orden (cualquier guardian)
    $products = wc_get_products([
        'status' => 'publish',
        'limit' => 1,
        'orderby' => 'rand'
    ]);

    if (empty($products)) {
        error_log('[Duendes Prueba] No hay productos disponibles');
        @unlink(__FILE__);
        return;
    }

    $product = $products[0];

    // Crear la orden
    $order = wc_create_order([
        'status' => 'pending',
        'customer_id' => 0,
    ]);

    if (is_wp_error($order)) {
        error_log('[Duendes Prueba] Error creando orden: ' . $order->get_error_message());
        @unlink(__FILE__);
        return;
    }

    // Agregar producto
    $order->add_product($product, 1);

    // Datos de facturación
    $order->set_billing_first_name('Thibisay');
    $order->set_billing_last_name('Prueba');
    $order->set_billing_email('tbrylka89@gmail.com');
    $order->set_billing_phone('099999999');
    $order->set_billing_country('UY');
    $order->set_billing_city('Piriápolis');
    $order->set_billing_address_1('Calle de Prueba 123');

    // Datos de envío
    $order->set_shipping_first_name('Thibisay');
    $order->set_shipping_last_name('Prueba');
    $order->set_shipping_country('UY');
    $order->set_shipping_city('Piriápolis');
    $order->set_shipping_address_1('Calle de Prueba 123');

    // Calcular totales
    $order->calculate_totals();

    // Agregar nota
    $order->add_order_note('Orden de PRUEBA creada automáticamente para testing de automatizaciones');

    // Guardar
    $order->save();

    $order_id = $order->get_id();
    error_log("[Duendes Prueba] Orden de prueba creada: #{$order_id}");

    // Cambiar estado a processing (pagada) para disparar automatizaciones
    $order->update_status('processing', 'Pago de prueba simulado');

    // Disparar hooks adicionales que algunas automatizaciones esperan
    do_action('woocommerce_order_status_pending_to_processing', $order_id, $order);
    do_action('woocommerce_payment_complete', $order_id);
    do_action('woocommerce_thankyou', $order_id);

    error_log("[Duendes Prueba] Orden #{$order_id} procesada - automatizaciones disparadas");
    error_log("[Duendes Prueba] Email: tbrylka89@gmail.com");
    error_log("[Duendes Prueba] Producto: " . $product->get_name());
    error_log("[Duendes Prueba] URL formulario: " . home_url("/formulario-canalizacion?order={$order_id}"));

    // Auto-eliminar
    @unlink(__FILE__);

}, 99);
