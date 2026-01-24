<?php
/**
 * Plugin Name: Duendes - Fix Email From Name
 * Description: Fuerza que todos los emails salgan como "Duendes del Uruguay"
 * Version: 1.0
 */

if (!defined('ABSPATH')) exit;

// Cambiar el nombre del remitente
add_filter('wp_mail_from_name', function($name) {
    return 'Duendes del Uruguay';
});

// Cambiar el email del remitente (opcional, si querés)
add_filter('wp_mail_from', function($email) {
    // Usar el email configurado en WordPress o uno personalizado
    return 'hola@duendesdeluruguay.com';
});

// También forzar en los headers si es necesario
add_filter('wp_mail', function($args) {
    // Si no hay headers de From, agregarlos
    if (empty($args['headers'])) {
        $args['headers'] = [];
    }

    if (is_string($args['headers'])) {
        $args['headers'] = explode("\n", $args['headers']);
    }

    // Verificar si ya tiene From header
    $has_from = false;
    foreach ($args['headers'] as $header) {
        if (stripos($header, 'from:') !== false) {
            $has_from = true;
            break;
        }
    }

    // Si no tiene, agregar el correcto
    if (!$has_from) {
        $args['headers'][] = 'From: Duendes del Uruguay <hola@duendesdeluruguay.com>';
    }

    return $args;
});
