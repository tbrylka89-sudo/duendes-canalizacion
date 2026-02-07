<?php
/**
 * Plugin Name: Duendes - Fix Emails Formulario
 * Description: Arregla el envío de emails de formulario (envío inmediato + botón manual)
 * Version: 1.0
 *
 * ESTE PLUGIN:
 * 1. Envía el email INMEDIATAMENTE cuando cambia el estado de la orden (no espera cron)
 * 2. Agrega botón para enviar emails manualmente desde el admin
 * 3. Permite procesar órdenes pendientes en lote
 */

if (!defined('ABSPATH')) exit;

// =============================================================================
// ENVÍO INMEDIATO (sin depender de WP-Cron)
// =============================================================================

// Cuando la orden pasa a processing o completed, enviar email inmediatamente
add_action('woocommerce_order_status_processing', 'duendes_fix_enviar_email_ahora', 15, 1);
add_action('woocommerce_order_status_completed', 'duendes_fix_enviar_email_ahora', 15, 1);

function duendes_fix_enviar_email_ahora($order_id) {
    $order = wc_get_order($order_id);
    if (!$order) return;

    // Si ya se envió el email o ya completó formulario, no hacer nada
    if ($order->get_meta('_duendes_email_formulario_enviado')) return;
    if ($order->get_meta('_duendes_formulario_completado') === 'yes') return;

    // Enviar email inmediatamente
    duendes_fix_enviar_email_formulario($order_id);
}

function duendes_fix_enviar_email_formulario($order_id) {
    $order = wc_get_order($order_id);
    if (!$order) return false;

    $email = $order->get_billing_email();
    $nombre = $order->get_billing_first_name();

    if (!$email) return false;

    // Obtener nombre del guardián
    $nombre_guardian = 'tu guardián';
    foreach ($order->get_items() as $item) {
        $nombre_guardian = $item->get_name();
        break;
    }

    // Crear token
    $token = md5($order_id . 'duendes_form_2026' . $email);
    update_post_meta($order_id, '_duendes_form_token', $token);

    // Link al formulario
    $link = add_query_arg([
        'duendes_completar' => $token,
        'order' => $order_id
    ], home_url('/mi-conexion/'));

    $asunto = "Solo falta un paso para conectar con $nombre_guardian";

    $html = duendes_fix_email_html($nombre, $nombre_guardian, $link, 'inicial');

    // Enviar via Brevo
    $enviado = duendes_fix_enviar_brevo($email, $nombre, $asunto, $html);

    if ($enviado) {
        $order->update_meta_data('_duendes_email_formulario_enviado', current_time('mysql'));
        $order->save();
        error_log("Duendes Fix: Email formulario enviado a $email (orden #$order_id)");
        return true;
    } else {
        error_log("Duendes Fix: ERROR enviando email a $email (orden #$order_id)");
        return false;
    }
}

// =============================================================================
// FUNCIÓN DE ENVÍO VIA BREVO
// =============================================================================

function duendes_fix_enviar_brevo($to_email, $to_name, $subject, $html) {
    $api_key = defined('DUENDES_BREVO_API_KEY_FORM')
        ? DUENDES_BREVO_API_KEY_FORM
        : 'BREVO_API_KEY_PLACEHOLDER';

    $response = wp_remote_post('https://api.brevo.com/v3/smtp/email', [
        'headers' => [
            'accept' => 'application/json',
            'api-key' => $api_key,
            'content-type' => 'application/json',
        ],
        'body' => json_encode([
            'sender' => [
                'name' => 'Duendes del Uruguay',
                'email' => 'info@duendesdeluruguay.com',
            ],
            'to' => [
                ['email' => $to_email, 'name' => $to_name]
            ],
            'subject' => $subject,
            'htmlContent' => $html,
        ]),
        'timeout' => 30,
    ]);

    if (is_wp_error($response)) {
        error_log('Duendes Fix Brevo Error: ' . $response->get_error_message());
        return false;
    }

    $code = wp_remote_retrieve_response_code($response);
    $body = wp_remote_retrieve_body($response);

    if ($code >= 200 && $code < 300) {
        return true;
    }

    error_log("Duendes Fix Brevo Error [$code]: $body");
    return false;
}

// =============================================================================
// TEMPLATE DE EMAIL
// =============================================================================

function duendes_fix_email_html($nombre, $guardian, $link, $tipo = 'inicial') {
    $nombre = esc_html($nombre);
    $guardian = esc_html($guardian);
    $link = esc_url($link);

    if ($tipo === 'recordatorio') {
        $titulo = "$guardian está esperando...";
        $mensaje = "
            <p style='color:#fff;font-size:16px;line-height:1.7;margin:0 0 20px 0;'>
                $nombre, tu guardián ya está en camino pero todavía no sabe nada de vos.
            </p>
            <p style='color:rgba(255,255,255,0.8);font-size:15px;line-height:1.7;margin:0 0 20px 0;'>
                Sin esta información, la canalización será genérica.
                Con ella, será un mensaje escrito <strong style='color:#c9a227;'>específicamente para vos</strong>.
            </p>
        ";
        $boton = "COMPLETAR AHORA";
    } else {
        $titulo = "Solo falta un paso";
        $mensaje = "
            <p style='color:#fff;font-size:16px;line-height:1.7;margin:0 0 20px 0;'>
                <strong style='color:#c9a227;'>$guardian</strong> ya sabe que lo elegiste.
                Ahora necesita conocerte para poder escribirte un mensaje personal.
            </p>
            <p style='color:rgba(255,255,255,0.8);font-size:15px;line-height:1.7;margin:0 0 25px 0;'>
                Solo toma 2 minutos. Contale quién sos, qué estás atravesando,
                en qué necesitás que te acompañe.
            </p>
        ";
        $boton = "COMPLETAR MI CONEXIÓN";
    }

    return '<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:#0a0a0a;font-family:Georgia,serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0a0a0a;padding:30px 15px;">
        <tr>
            <td align="center">
                <table width="100%" cellpadding="0" cellspacing="0" style="max-width:550px;background:#1a1a1a;border:1px solid rgba(201,162,39,0.3);border-radius:16px;overflow:hidden;">
                    <tr><td style="height:4px;background:linear-gradient(90deg,transparent,#c9a227,transparent);"></td></tr>
                    <tr>
                        <td style="padding:30px 30px 20px 30px;text-align:center;">
                            <img src="https://duendesdeluruguay.com/wp-content/uploads/2024/01/logo-duendes-email.png" alt="Duendes" style="max-width:140px;">
                        </td>
                    </tr>
                    <tr>
                        <td style="padding:0 30px 25px 30px;text-align:center;">
                            <h1 style="margin:0;font-size:24px;color:#c9a227;font-family:Georgia,serif;">' . $titulo . '</h1>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding:0 30px 30px 30px;">
                            ' . $mensaje . '
                            <table width="100%" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td align="center" style="padding:10px 0 30px 0;">
                                        <a href="' . $link . '" style="display:inline-block;background:linear-gradient(135deg,#c9a227,#a88a42);color:#0a0a0a;text-decoration:none;padding:18px 45px;border-radius:30px;font-size:15px;font-weight:bold;letter-spacing:1px;">' . $boton . '</a>
                                    </td>
                                </tr>
                            </table>
                            <p style="color:rgba(255,255,255,0.4);font-size:12px;text-align:center;margin:0;">
                                Si el botón no funciona, copiá este link:<br>
                                <a href="' . $link . '" style="color:#c9a227;word-break:break-all;">' . $link . '</a>
                            </p>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding:20px 30px;border-top:1px solid rgba(201,162,39,0.15);text-align:center;">
                            <p style="margin:0;color:rgba(255,255,255,0.4);font-size:12px;">Con amor desde el bosque - Duendes del Uruguay</p>
                        </td>
                    </tr>
                    <tr><td style="height:3px;background:linear-gradient(90deg,transparent,#c9a227,transparent);"></td></tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>';
}

// =============================================================================
// ADMIN: BOTÓN PARA ENVIAR EMAIL MANUALMENTE
// =============================================================================

add_action('add_meta_boxes', 'duendes_fix_add_metabox');
function duendes_fix_add_metabox() {
    add_meta_box(
        'duendes_fix_email_formulario',
        '📧 Email Formulario',
        'duendes_fix_metabox_html',
        'shop_order',
        'side',
        'high'
    );
}

function duendes_fix_metabox_html($post) {
    $order_id = $post->ID;
    $order = wc_get_order($order_id);
    if (!$order) return;

    $email_enviado = $order->get_meta('_duendes_email_formulario_enviado');
    $formulario_completado = $order->get_meta('_duendes_formulario_completado') === 'yes';

    echo '<div style="padding:5px 0;">';

    if ($formulario_completado) {
        echo '<p style="color:green;margin:0 0 10px 0;">✅ Formulario COMPLETADO</p>';
        $datos = $order->get_meta('_duendes_datos_canalizacion');
        if ($datos) {
            $datos = json_decode($datos, true);
            if (!empty($datos['nombre'])) {
                echo '<p style="margin:5px 0;font-size:12px;"><strong>Nombre:</strong> ' . esc_html($datos['nombre']) . '</p>';
            }
        }
    } else {
        echo '<p style="color:orange;margin:0 0 10px 0;">⏳ Pendiente de completar</p>';

        if ($email_enviado) {
            echo '<p style="font-size:11px;color:#666;margin:5px 0;">Email enviado: ' . esc_html($email_enviado) . '</p>';
        } else {
            echo '<p style="font-size:11px;color:#666;margin:5px 0;">Email NO enviado</p>';
        }

        // Botón para enviar/reenviar
        $nonce = wp_create_nonce('duendes_fix_email');
        $texto_boton = $email_enviado ? 'Reenviar Email' : 'Enviar Email';

        echo '<button type="button" class="button button-primary" style="width:100%;margin-top:8px;"
              onclick="duendesFixEnviarEmail(' . $order_id . ', \'' . $nonce . '\', this)">' . $texto_boton . '</button>';
    }

    // Link al formulario para ver
    $email = $order->get_billing_email();
    $token = md5($order_id . 'duendes_form_2026' . $email);
    $link = add_query_arg(['duendes_completar' => $token, 'order' => $order_id], home_url('/mi-conexion/'));

    echo '<p style="margin:10px 0 0 0;font-size:11px;"><a href="' . esc_url($link) . '" target="_blank">Ver formulario →</a></p>';

    echo '</div>';

    // JavaScript para el botón
    echo '<script>
    function duendesFixEnviarEmail(orderId, nonce, btn) {
        btn.disabled = true;
        btn.textContent = "Enviando...";

        jQuery.post(ajaxurl, {
            action: "duendes_fix_enviar_email",
            order_id: orderId,
            nonce: nonce
        }, function(response) {
            if (response.success) {
                btn.textContent = "✓ Enviado";
                btn.style.background = "#4CAF50";
            } else {
                btn.textContent = "Error";
                btn.style.background = "#f44336";
                alert(response.data || "Error al enviar");
            }
            setTimeout(function() { location.reload(); }, 1500);
        });
    }
    </script>';
}

// AJAX handler
add_action('wp_ajax_duendes_fix_enviar_email', 'duendes_fix_ajax_enviar');
function duendes_fix_ajax_enviar() {
    check_ajax_referer('duendes_fix_email', 'nonce');

    if (!current_user_can('edit_shop_orders')) {
        wp_send_json_error('Sin permisos');
    }

    $order_id = intval($_POST['order_id']);
    $order = wc_get_order($order_id);

    if (!$order) {
        wp_send_json_error('Orden no encontrada');
    }

    // Limpiar el meta para poder reenviar
    $order->delete_meta_data('_duendes_email_formulario_enviado');
    $order->save();

    // Enviar
    $enviado = duendes_fix_enviar_email_formulario($order_id);

    if ($enviado) {
        wp_send_json_success('Email enviado a ' . $order->get_billing_email());
    } else {
        wp_send_json_error('Error al enviar el email');
    }
}

// =============================================================================
// ADMIN: PÁGINA PARA PROCESAR ÓRDENES PENDIENTES
// =============================================================================

add_action('admin_menu', 'duendes_fix_admin_menu');
function duendes_fix_admin_menu() {
    add_submenu_page(
        'woocommerce',
        'Emails Pendientes',
        '📧 Emails Pendientes',
        'manage_woocommerce',
        'duendes-emails-pendientes',
        'duendes_fix_admin_page'
    );
}

function duendes_fix_admin_page() {
    // Procesar envío masivo
    if (isset($_POST['enviar_pendientes']) && wp_verify_nonce($_POST['_wpnonce'], 'duendes_enviar_pendientes')) {
        $ordenes = isset($_POST['ordenes']) ? array_map('intval', $_POST['ordenes']) : [];
        $enviados = 0;
        $errores = 0;

        foreach ($ordenes as $order_id) {
            $order = wc_get_order($order_id);
            if (!$order) continue;

            // Limpiar meta para poder enviar
            $order->delete_meta_data('_duendes_email_formulario_enviado');
            $order->save();

            if (duendes_fix_enviar_email_formulario($order_id)) {
                $enviados++;
            } else {
                $errores++;
            }

            // Pequeña pausa para no saturar
            usleep(500000); // 0.5 segundos
        }

        echo '<div class="notice notice-success"><p>✅ Enviados: ' . $enviados . ' | Errores: ' . $errores . '</p></div>';
    }

    // Obtener órdenes pendientes de formulario
    $args = [
        'limit' => 50,
        'status' => ['processing', 'completed'],
        'orderby' => 'date',
        'order' => 'DESC',
        'meta_query' => [
            'relation' => 'OR',
            [
                'key' => '_duendes_formulario_completado',
                'compare' => 'NOT EXISTS',
            ],
            [
                'key' => '_duendes_formulario_completado',
                'value' => 'yes',
                'compare' => '!=',
            ],
        ],
    ];

    $orders = wc_get_orders($args);

    ?>
    <div class="wrap">
        <h1>📧 Emails de Formulario Pendientes</h1>
        <p>Órdenes que NO han completado el formulario de canalización.</p>

        <?php if (empty($orders)): ?>
            <p>🎉 No hay órdenes pendientes.</p>
        <?php else: ?>
            <form method="post">
                <?php wp_nonce_field('duendes_enviar_pendientes'); ?>

                <table class="wp-list-table widefat fixed striped">
                    <thead>
                        <tr>
                            <th style="width:30px;"><input type="checkbox" onclick="jQuery('input[name=ordenes\\[\\]]').prop('checked', this.checked)"></th>
                            <th>Orden</th>
                            <th>Cliente</th>
                            <th>Email</th>
                            <th>Fecha</th>
                            <th>Email Enviado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php foreach ($orders as $order):
                            $email_enviado = $order->get_meta('_duendes_email_formulario_enviado');
                        ?>
                        <tr>
                            <td><input type="checkbox" name="ordenes[]" value="<?php echo $order->get_id(); ?>"></td>
                            <td><a href="<?php echo admin_url('post.php?post=' . $order->get_id() . '&action=edit'); ?>">#<?php echo $order->get_order_number(); ?></a></td>
                            <td><?php echo esc_html($order->get_billing_first_name() . ' ' . $order->get_billing_last_name()); ?></td>
                            <td><?php echo esc_html($order->get_billing_email()); ?></td>
                            <td><?php echo $order->get_date_created()->date_i18n('d/m/Y H:i'); ?></td>
                            <td>
                                <?php if ($email_enviado): ?>
                                    <span style="color:green;">✅ <?php echo esc_html($email_enviado); ?></span>
                                <?php else: ?>
                                    <span style="color:red;">❌ No</span>
                                <?php endif; ?>
                            </td>
                            <td>
                                <a href="<?php echo admin_url('post.php?post=' . $order->get_id() . '&action=edit'); ?>" class="button button-small">Ver</a>
                            </td>
                        </tr>
                        <?php endforeach; ?>
                    </tbody>
                </table>

                <p style="margin-top:20px;">
                    <button type="submit" name="enviar_pendientes" class="button button-primary button-large">
                        📧 Enviar Email a Seleccionados
                    </button>
                </p>
            </form>
        <?php endif; ?>
    </div>
    <?php
}

// =============================================================================
// NOTIFICACIÓN A ADMIN CUANDO COMPLETAN EL FORMULARIO
// =============================================================================

add_action('duendes_formulario_completado', 'duendes_fix_notificar_admin', 10, 2);
function duendes_fix_notificar_admin($order_id, $datos) {
    $order = wc_get_order($order_id);
    if (!$order) return;

    // Email de admin
    $admin_email = 'duendesdeluruguay@gmail.com';

    // Datos del cliente
    $nombre_cliente = $order->get_billing_first_name() . ' ' . $order->get_billing_last_name();
    $email_cliente = $order->get_billing_email();

    // Nombre del guardián
    $nombre_guardian = 'Guardián';
    foreach ($order->get_items() as $item) {
        $nombre_guardian = $item->get_name();
        break;
    }

    // Datos del formulario
    $datos = is_array($datos) ? $datos : json_decode($datos, true);
    $nombre_form = $datos['nombre'] ?? $nombre_cliente;
    $momento = $datos['momento'] ?? 'No especificó';
    $necesidades = isset($datos['necesidades']) && is_array($datos['necesidades'])
        ? implode(', ', $datos['necesidades'])
        : 'No especificó';
    $mensaje = $datos['mensaje'] ?? 'No dejó mensaje adicional';

    $asunto = "✨ Formulario completado: $nombre_form - Orden #$order_id";

    $html = '<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:20px;background:#f5f5f5;font-family:Georgia,serif;">
    <div style="max-width:600px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 10px rgba(0,0,0,0.1);">
        <div style="background:linear-gradient(135deg,#1a1a1a,#2d2d2d);padding:25px;text-align:center;">
            <h1 style="margin:0;color:#c9a227;font-size:22px;">✨ Nuevo Formulario Completado</h1>
        </div>
        <div style="padding:25px;">
            <table style="width:100%;border-collapse:collapse;">
                <tr>
                    <td style="padding:10px 0;border-bottom:1px solid #eee;font-weight:bold;width:140px;">Orden:</td>
                    <td style="padding:10px 0;border-bottom:1px solid #eee;"><a href="' . admin_url('post.php?post=' . $order_id . '&action=edit') . '">#' . $order_id . '</a></td>
                </tr>
                <tr>
                    <td style="padding:10px 0;border-bottom:1px solid #eee;font-weight:bold;">Guardián:</td>
                    <td style="padding:10px 0;border-bottom:1px solid #eee;">' . esc_html($nombre_guardian) . '</td>
                </tr>
                <tr>
                    <td style="padding:10px 0;border-bottom:1px solid #eee;font-weight:bold;">Nombre:</td>
                    <td style="padding:10px 0;border-bottom:1px solid #eee;">' . esc_html($nombre_form) . '</td>
                </tr>
                <tr>
                    <td style="padding:10px 0;border-bottom:1px solid #eee;font-weight:bold;">Email:</td>
                    <td style="padding:10px 0;border-bottom:1px solid #eee;">' . esc_html($email_cliente) . '</td>
                </tr>
                <tr>
                    <td style="padding:10px 0;border-bottom:1px solid #eee;font-weight:bold;">Necesidades:</td>
                    <td style="padding:10px 0;border-bottom:1px solid #eee;">' . esc_html($necesidades) . '</td>
                </tr>
            </table>

            <div style="margin-top:20px;padding:15px;background:#f9f9f9;border-radius:8px;">
                <p style="margin:0 0 10px 0;font-weight:bold;color:#333;">Momento que atraviesa:</p>
                <p style="margin:0;color:#555;line-height:1.6;">' . nl2br(esc_html($momento)) . '</p>
            </div>

            <div style="margin-top:15px;padding:15px;background:#fff8e7;border-radius:8px;border-left:4px solid #c9a227;">
                <p style="margin:0 0 10px 0;font-weight:bold;color:#333;">Mensaje para el guardián:</p>
                <p style="margin:0;color:#555;line-height:1.6;font-style:italic;">' . nl2br(esc_html($mensaje)) . '</p>
            </div>

            <p style="margin-top:25px;text-align:center;">
                <a href="' . admin_url('post.php?post=' . $order_id . '&action=edit') . '" style="display:inline-block;padding:12px 30px;background:#c9a227;color:#fff;text-decoration:none;border-radius:25px;font-weight:bold;">Ver Orden Completa</a>
            </p>
        </div>
    </div>
</body>
</html>';

    // Enviar via Brevo
    duendes_fix_enviar_brevo($admin_email, 'Duendes Admin', $asunto, $html);

    error_log("Duendes Fix: Notificación enviada a admin para orden #$order_id");
}

// =============================================================================
// LOG DE ERRORES MEJORADO
// =============================================================================

add_action('init', function() {
    if (isset($_GET['duendes_test_email']) && current_user_can('manage_options')) {
        $order_id = intval($_GET['order_id'] ?? 0);
        if ($order_id) {
            $result = duendes_fix_enviar_email_formulario($order_id);
            wp_die($result ? 'Email enviado correctamente' : 'Error al enviar email. Revisá el log de errores.');
        }
    }
});
