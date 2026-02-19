<?php
/**
 * Plugin Name: Duendes - Bloquear Emails de Canalizacion
 * Description: Bloquea emails enviados por el sistema de canalizaciones (FunnelKit los maneja)
 * Version: 1.0
 */

if (!defined('ABSPATH')) exit;

/**
 * Interceptar wp_mail y bloquear emails del sistema de canalizaciones
 */
add_filter('pre_wp_mail', function($null, $atts) {
    // Asuntos que vienen del sistema de canalizaciones
    $asuntos_bloqueados = [
        'tiene un mensaje para vos',
        'Hay mensajes que esperan',
        'esperan ser recibidos',
        'Formulario de Canalizacion',
        'Tu guardián quiere',
        'COMPLETAR MI CONEXIÓN',
        'completar mi conexion',
        'Nuevo Formulario de Canalizacion',
    ];

    $asunto = $atts['subject'] ?? '';

    foreach ($asuntos_bloqueados as $bloqueado) {
        if (stripos($asunto, $bloqueado) !== false) {
            // Loguear que se bloqueó
            error_log("[Duendes] Email bloqueado (FunnelKit maneja): " . $asunto);
            // Retornar true para indicar que el email "se envió" (pero no se envía)
            return true;
        }
    }

    // Si no está en la lista, dejar pasar
    return $null;
}, 10, 2);

/**
 * También bloquear por remitente si es del sistema de canalizaciones
 */
add_filter('wp_mail', function($args) {
    // Si el email viene de una función de canalizaciones, podemos detectarlo
    // por el backtrace o por contenido específico

    $asuntos_bloqueados = [
        'tiene un mensaje para vos',
        'Hay mensajes que esperan',
        'esperan ser recibidos',
        'Formulario de Canalizacion',
        'Tu guardián quiere',
    ];

    foreach ($asuntos_bloqueados as $bloqueado) {
        if (stripos($args['subject'], $bloqueado) !== false) {
            // Cambiar el destinatario a vacío para que no se envíe
            $args['to'] = '';
            error_log("[Duendes] Email de canalizacion bloqueado: " . $args['subject']);
            break;
        }
    }

    return $args;
}, 1);
