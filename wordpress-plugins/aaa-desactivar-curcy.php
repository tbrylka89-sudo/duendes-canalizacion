<?php
/**
 * Plugin Name: AAA - Desactivar Curcy Emergency
 * Description: Fuerza desactivacion de plugins de currency
 * Version: 1.1
 */

// Correr inmediatamente sin esperar hooks
global $wpdb;
if (!isset($wpdb)) return;

$option_name = 'active_plugins';
$row = $wpdb->get_row($wpdb->prepare("SELECT option_value FROM {$wpdb->options} WHERE option_name = %s LIMIT 1", $option_name));

if ($row) {
    $active_plugins = maybe_unserialize($row->option_value);
    if (is_array($active_plugins)) {
        $plugins_to_disable = array(
            'woo-multi-currency/woo-multi-currency.php',
            'woo-multi-currency-premium/woo-multi-currency.php',
            'curcy/curcy.php',
            'curcy-premium/curcy.php',
            'woocommerce-multi-currency/woocommerce-multi-currency.php',
        );

        $changed = false;
        foreach ($plugins_to_disable as $plugin) {
            $key = array_search($plugin, $active_plugins);
            if ($key !== false) {
                unset($active_plugins[$key]);
                $changed = true;
            }
        }

        if ($changed) {
            $wpdb->update(
                $wpdb->options,
                array('option_value' => serialize(array_values($active_plugins))),
                array('option_name' => $option_name)
            );
        }
    }
}
