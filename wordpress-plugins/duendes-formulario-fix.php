<?php
/**
 * Fix para URL de formulario de canalizacion
 * Registra la rewrite rule necesaria
 */

if (!defined('ABSPATH')) exit;

// Registrar rewrite rule
add_action('init', function() {
    add_rewrite_rule(
        '^formulario-canalizacion/?$',
        'index.php?duendes_formulario_canalizacion=1',
        'top'
    );
});

// Registrar query var
add_filter('query_vars', function($vars) {
    $vars[] = 'duendes_formulario_canalizacion';
    return $vars;
});

// Flush rules si es necesario
add_action('init', function() {
    if (get_option('duendes_formulario_rules_flushed_v2') !== 'yes') {
        flush_rewrite_rules();
        update_option('duendes_formulario_rules_flushed_v2', 'yes');
    }
}, 999);
