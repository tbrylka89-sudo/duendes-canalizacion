<?php
/**
 * Plugin Name: Duendes - Carriers Uruguay
 * Description: Agrega DAC y Correo Uruguayo como carriers en Advanced Shipment Tracking
 * Version: 1.2
 */

if (!defined('ABSPATH')) exit;

/**
 * Insertar carriers en la tabla del plugin AST
 */
add_action('init', function() {
    if (get_transient('duendes_carriers_checked_v3')) return;

    global $wpdb;
    $table = $wpdb->prefix . 'woo_shippment_provider';

    // Verificar si la tabla existe
    if ($wpdb->get_var("SHOW TABLES LIKE '$table'") !== $table) {
        return;
    }

    // Obtener columnas reales de la tabla
    $columns = $wpdb->get_col("SHOW COLUMNS FROM $table", 0);

    // Carriers a agregar
    $carriers = array(
        array('name' => 'DAC (Uruguay)', 'slug' => 'dac-uruguay'),
        array('name' => 'Correo Uruguayo', 'slug' => 'correo-uruguayo')
    );

    foreach ($carriers as $carrier) {
        // Verificar si ya existe
        $exists = $wpdb->get_var($wpdb->prepare(
            "SELECT COUNT(*) FROM $table WHERE provider_name = %s",
            $carrier['name']
        ));

        if (!$exists) {
            // Construir datos solo con columnas que existen
            $data = array('provider_name' => $carrier['name']);

            if (in_array('ts_slug', $columns)) {
                $data['ts_slug'] = $carrier['slug'];
            }
            if (in_array('provider_url', $columns)) {
                $data['provider_url'] = '';
            }
            if (in_array('shipping_country', $columns)) {
                $data['shipping_country'] = 'Uruguay';
            }
            if (in_array('display_in_order', $columns)) {
                $data['display_in_order'] = 1;
            }
            if (in_array('sort_order', $columns)) {
                $data['sort_order'] = 999;
            }

            $wpdb->insert($table, $data);
        }
    }

    set_transient('duendes_carriers_checked_v3', true, DAY_IN_SECONDS);
}, 5);

/**
 * Limpiar errores mostrados
 */
add_action('admin_init', function() {
    if (!get_transient('duendes_carriers_errors_cleared')) {
        // Limpiar cualquier transient de error
        delete_transient('duendes_carriers_refreshed_v2');
        delete_transient('duendes_carriers_checked');
        set_transient('duendes_carriers_errors_cleared', true, HOUR_IN_SECONDS);
    }
}, 1);
