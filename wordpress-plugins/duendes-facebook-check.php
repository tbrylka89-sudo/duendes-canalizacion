<?php
/**
 * Plugin Name: Duendes - Check Facebook Options
 * Description: Muestra estado de opciones Facebook
 */

if (!defined('ABSPATH')) exit;

add_action('admin_notices', function() {
    global $wpdb;

    // Buscar opciones con "facebook"
    $opciones = $wpdb->get_results("SELECT option_name, option_value FROM {$wpdb->options} WHERE option_name LIKE '%facebook%'");

    // Verificar si se ejecutó el borrador
    $ya_borrado = get_option('duendes_facebook_deleted');

    echo '<div class="notice notice-info" style="padding: 15px;">';
    echo '<h3>🔍 Diagnóstico Facebook - Duendes</h3>';

    if ($ya_borrado) {
        echo '<p>✅ El plugin de borrado se ejecutó el: <strong>' . $ya_borrado . '</strong></p>';
    } else {
        echo '<p>⚠️ El plugin de borrado NO se ejecutó todavía</p>';
    }

    echo '<p><strong>Opciones con "facebook" encontradas: ' . count($opciones) . '</strong></p>';

    if (count($opciones) > 0) {
        echo '<table style="background:#fff; border-collapse:collapse; margin-top:10px;">';
        echo '<tr style="background:#f0f0f0;"><th style="padding:8px; border:1px solid #ccc;">Opción</th><th style="padding:8px; border:1px solid #ccc;">Valor (truncado)</th></tr>';
        foreach ($opciones as $op) {
            $valor = substr($op->option_value, 0, 100);
            if (strlen($op->option_value) > 100) $valor .= '...';
            echo '<tr><td style="padding:8px; border:1px solid #ccc;">' . esc_html($op->option_name) . '</td>';
            echo '<td style="padding:8px; border:1px solid #ccc;">' . esc_html($valor) . '</td></tr>';
        }
        echo '</table>';
    } else {
        echo '<p>✅ No hay opciones de Facebook en la base de datos</p>';
    }

    echo '</div>';
});
