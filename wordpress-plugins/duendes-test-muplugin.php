<?php
/**
 * Plugin Name: TEST - Verificar MU-Plugins
 * Description: Plugin de prueba para verificar que mu-plugins cargan
 * Version: 1.0
 */

if (!defined('ABSPATH')) exit;

// Añadir comentario HTML simple al footer para verificar carga
add_action('wp_footer', function() {
    echo '<!-- TITO MU-PLUGIN TEST LOADED AT ' . date('Y-m-d H:i:s') . ' -->';
}, 1);
