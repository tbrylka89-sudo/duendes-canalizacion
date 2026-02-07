<?php
/**
 * Plugin Name: Duendes - Borrar Facebook FINAL
 */

if (!defined('ABSPATH')) exit;

add_action('init', function() {
    global $wpdb;

    // Borrar directo en SQL para evitar cache
    $wpdb->query("DELETE FROM {$wpdb->options} WHERE option_name LIKE '%facebook%' AND option_name NOT LIKE 'duendes_%'");

    // Limpiar cache de opciones
    wp_cache_flush();
}, 1);

add_action('admin_notices', function() {
    global $wpdb;
    $count = $wpdb->get_var("SELECT COUNT(*) FROM {$wpdb->options} WHERE option_name LIKE '%facebook%' AND option_name NOT LIKE 'duendes_%'");
    echo '<div class="notice notice-success"><p><strong>🧹 Opciones Facebook restantes (sin contar duendes_): ' . $count . '</strong></p></div>';
});
