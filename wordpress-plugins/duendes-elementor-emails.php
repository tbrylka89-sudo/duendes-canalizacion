<?php
/**
 * Plugin Name: Duendes - Emails Hermosos para Elementor
 * Description: Intercepta formularios de Elementor y envía emails estéticos
 * Version: 1.0
 */

if (!defined('ABSPATH')) exit;

/**
 * Hook en el envío de formularios de Elementor
 */
add_action('elementor_pro/forms/new_record', 'duendes_elementor_email_hermoso', 10, 2);

function duendes_elementor_email_hermoso($record, $handler) {
    // Obtener datos del formulario
    $form_name = $record->get_form_settings('form_name');
    $raw_fields = $record->get('fields');

    // Convertir campos a array simple
    $fields = [];
    foreach ($raw_fields as $id => $field) {
        $fields[$id] = [
            'label' => $field['title'] ?? $id,
            'value' => $field['value'] ?? '',
        ];
    }

    // Obtener email del usuario (buscar campo email)
    $user_email = '';
    $user_name = '';
    foreach ($fields as $id => $field) {
        $label_lower = strtolower($field['label']);
        $id_lower = strtolower($id);

        if (strpos($label_lower, 'email') !== false || strpos($id_lower, 'email') !== false) {
            $user_email = $field['value'];
        }
        if (strpos($label_lower, 'nombre') !== false || strpos($id_lower, 'name') !== false) {
            $user_name = $field['value'];
        }
    }

    // Preparar HTML de los campos
    $campos_html = '';
    foreach ($fields as $id => $field) {
        if (!empty($field['value'])) {
            $campos_html .= '
            <tr>
                <td style="padding: 12px 15px; border-bottom: 1px solid rgba(201,162,39,0.2); color: #c9a227; font-weight: 500; width: 35%; vertical-align: top;">
                    ' . esc_html($field['label']) . '
                </td>
                <td style="padding: 12px 15px; border-bottom: 1px solid rgba(201,162,39,0.2); color: rgba(255,255,255,0.85);">
                    ' . nl2br(esc_html($field['value'])) . '
                </td>
            </tr>';
        }
    }

    // Determinar tipo de formulario por nombre o URL
    $page_url = $_SERVER['HTTP_REFERER'] ?? '';
    $form_type = 'general';
    $emoji = '✨';
    $titulo = 'Nueva respuesta de formulario';

    if (stripos($form_name, 'test') !== false || stripos($page_url, 'descubri') !== false) {
        $form_type = 'test_guardian';
        $emoji = '🔮';
        $titulo = 'Alguien quiere descubrir su guardián';
    } elseif (stripos($form_name, 'contacto') !== false || stripos($form_name, 'contact') !== false) {
        $form_type = 'contacto';
        $emoji = '💌';
        $titulo = 'Nuevo mensaje de contacto';
    } elseif (stripos($form_name, 'newsletter') !== false || stripos($form_name, 'suscri') !== false) {
        $form_type = 'newsletter';
        $emoji = '📬';
        $titulo = 'Nueva suscripción';
    }

    // Construir email hermoso
    $html = '
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 20px; background-color: #000000; font-family: Georgia, serif;">
    <div style="max-width: 600px; margin: 0 auto; background: linear-gradient(180deg, #0a0a0a 0%, #111111 100%);">

        <!-- Header -->
        <div style="text-align: center; padding: 40px 30px 30px; border-bottom: 1px solid rgba(201, 162, 39, 0.2);">
            <h1 style="font-family: Georgia, serif; font-size: 24px; color: #c9a227; letter-spacing: 3px; margin: 0; text-transform: uppercase;">
                Duendes del Uruguay
            </h1>
        </div>

        <!-- Body -->
        <div style="padding: 40px 30px;">
            <h2 style="font-family: Georgia, serif; font-size: 28px; color: #c9a227; text-align: center; margin: 0 0 10px; letter-spacing: 1px;">
                ' . $emoji . ' ' . $titulo . '
            </h2>

            <p style="font-family: Georgia, serif; font-size: 16px; color: rgba(255, 255, 255, 0.7); text-align: center; margin: 0 0 30px; font-style: italic;">
                Formulario: ' . esc_html($form_name ?: 'Sin nombre') . '
            </p>

            <!-- Tabla de campos -->
            <table style="width: 100%; border-collapse: collapse; background: rgba(201,162,39,0.05); border-radius: 8px; overflow: hidden;">
                ' . $campos_html . '
            </table>

            <!-- Metadata -->
            <div style="margin-top: 30px; padding: 20px; background: rgba(0,0,0,0.3); border-radius: 8px;">
                <p style="font-family: Georgia, serif; font-size: 13px; color: rgba(255,255,255,0.4); margin: 0 0 8px;">
                    <strong style="color: rgba(255,255,255,0.6);">Página:</strong> ' . esc_html($page_url ?: 'No disponible') . '
                </p>
                <p style="font-family: Georgia, serif; font-size: 13px; color: rgba(255,255,255,0.4); margin: 0 0 8px;">
                    <strong style="color: rgba(255,255,255,0.6);">Fecha:</strong> ' . date('d/m/Y H:i:s') . '
                </p>
                <p style="font-family: Georgia, serif; font-size: 13px; color: rgba(255,255,255,0.4); margin: 0;">
                    <strong style="color: rgba(255,255,255,0.6);">IP:</strong> ' . ($_SERVER['REMOTE_ADDR'] ?? 'No disponible') . '
                </p>
            </div>

            ' . ($user_email ? '
            <!-- Botón responder -->
            <div style="text-align: center; margin-top: 30px;">
                <a href="mailto:' . esc_attr($user_email) . '" style="display: inline-block; background: linear-gradient(135deg, #c9a227 0%, #8b6914 100%); color: #0a0a0a; text-decoration: none; padding: 14px 35px; border-radius: 30px; font-family: Georgia, serif; font-size: 13px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase;">
                    Responder a ' . esc_html($user_name ?: $user_email) . '
                </a>
            </div>
            ' : '') . '
        </div>

        <!-- Footer -->
        <div style="text-align: center; padding: 30px; border-top: 1px solid rgba(201, 162, 39, 0.2);">
            <p style="font-family: Georgia, serif; font-size: 13px; color: rgba(255, 255, 255, 0.4); margin: 0;">
                Notificación automática del sistema
            </p>
        </div>
    </div>
</body>
</html>';

    // Enviar email hermoso a Thibisay
    $to = 'duendesdeluruguay@gmail.com';
    $subject = $emoji . ' ' . $titulo . ($user_name ? ' - ' . $user_name : ($user_email ? ' - ' . $user_email : ''));

    $headers = [
        'Content-Type: text/html; charset=UTF-8',
        'From: Duendes del Uruguay <notificaciones@duendesdeluruguay.com>',
    ];

    // Intentar enviar via wp_mail (usa SMTP configurado)
    wp_mail($to, $subject, $html, $headers);

    // También intentar via Resend API (backup)
    duendes_enviar_via_resend($to, $subject, $html);

    // Log para debug
    error_log('Duendes Elementor Email: Enviado para formulario ' . $form_name);
}

/**
 * Enviar via Resend API como backup
 */
function duendes_enviar_via_resend($to, $subject, $html) {
    $api_url = 'https://duendes-vercel.vercel.app/api/email/send';
    $api_token = 'tyA60hi6sNH1Ftfc1jagbxKkPC35zCCl';

    $response = wp_remote_post($api_url, [
        'headers' => [
            'Content-Type' => 'application/json',
            'Authorization' => 'Bearer ' . $api_token,
        ],
        'body' => json_encode([
            'to' => $to,
            'subject' => $subject,
            'html' => $html,
            'from' => 'Duendes del Uruguay <hola@duendesdeluruguay.com>',
        ]),
        'timeout' => 10,
    ]);

    if (is_wp_error($response)) {
        error_log('Duendes Resend Error: ' . $response->get_error_message());
    }
}

/**
 * Desactivar emails por defecto de Elementor (opcional)
 * Descomentar si querés que SOLO se envíen nuestros emails hermosos
 */
// add_filter('elementor_pro/forms/actions/email/send', '__return_false');
