<?php
/**
 * Plugin Name: Duendes - Enviar Formularios Pendientes
 * Description: Herramienta para enviar emails de formulario a pedidos que no lo recibieron
 * Version: 1.0
 */

if (!defined('ABSPATH')) exit;

// Agregar página en admin
add_action('admin_menu', function() {
    add_submenu_page(
        'woocommerce',
        'Enviar Formularios Pendientes',
        'Formularios Pendientes',
        'manage_options',
        'duendes-formularios-pendientes',
        'duendes_pagina_formularios_pendientes'
    );
});

function duendes_pagina_formularios_pendientes() {
    // Procesar envío masivo
    if (isset($_POST['enviar_todos']) && wp_verify_nonce($_POST['_wpnonce'], 'duendes_enviar_forms')) {
        $enviados = duendes_enviar_formularios_masivo();
        echo '<div class="notice notice-success"><p>Se enviaron ' . count($enviados) . ' emails.</p></div>';
    }

    // Procesar envío individual
    if (isset($_POST['enviar_individual']) && wp_verify_nonce($_POST['_wpnonce'], 'duendes_enviar_forms')) {
        $order_id = intval($_POST['order_id']);
        $resultado = duendes_enviar_email_formulario_manual($order_id);
        if ($resultado) {
            echo '<div class="notice notice-success"><p>Email enviado para pedido #' . $order_id . '</p></div>';
        } else {
            echo '<div class="notice notice-error"><p>Error al enviar email para pedido #' . $order_id . '</p></div>';
        }
    }

    // Obtener pedidos sin formulario completado
    $args = [
        'status' => ['processing', 'completed', 'on-hold'],
        'limit' => 100,
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
        <h1>Formularios de Canalización Pendientes</h1>

        <div style="background:#fff;padding:20px;border-radius:8px;margin:20px 0;box-shadow:0 1px 3px rgba(0,0,0,0.1);">
            <h2>Pedidos sin formulario completado</h2>
            <p>Estos pedidos no tienen el formulario de canalización completado. Podés enviarles el email con el link al formulario.</p>

            <?php if (empty($orders)): ?>
                <p style="color:green;font-weight:bold;">¡Todos los pedidos tienen el formulario completado!</p>
            <?php else: ?>
                <form method="post">
                    <?php wp_nonce_field('duendes_enviar_forms'); ?>
                    <table class="widefat striped" style="margin-top:15px;">
                        <thead>
                            <tr>
                                <th>Pedido</th>
                                <th>Cliente</th>
                                <th>Email</th>
                                <th>Fecha</th>
                                <th>Productos</th>
                                <th>Email enviado</th>
                                <th>Acción</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php foreach ($orders as $order):
                                $email_enviado = $order->get_meta('_duendes_email_formulario_enviado');
                                $productos = [];
                                foreach ($order->get_items() as $item) {
                                    $productos[] = $item->get_name();
                                }
                            ?>
                            <tr>
                                <td><strong>#<?php echo $order->get_id(); ?></strong></td>
                                <td><?php echo esc_html($order->get_billing_first_name() . ' ' . $order->get_billing_last_name()); ?></td>
                                <td><?php echo esc_html($order->get_billing_email()); ?></td>
                                <td><?php echo $order->get_date_created()->date_i18n('d/m/Y H:i'); ?></td>
                                <td style="max-width:200px;font-size:12px;"><?php echo esc_html(implode(', ', $productos)); ?></td>
                                <td>
                                    <?php if ($email_enviado): ?>
                                        <span style="color:green;">✓ <?php echo date('d/m H:i', strtotime($email_enviado)); ?></span>
                                    <?php else: ?>
                                        <span style="color:orange;">No enviado</span>
                                    <?php endif; ?>
                                </td>
                                <td>
                                    <button type="submit" name="enviar_individual" value="1" class="button button-small" onclick="this.form.order_id.value=<?php echo $order->get_id(); ?>">
                                        Enviar email
                                    </button>
                                </td>
                            </tr>
                            <?php endforeach; ?>
                        </tbody>
                    </table>
                    <input type="hidden" name="order_id" value="">

                    <div style="margin-top:20px;padding:15px;background:#f0f0f0;border-radius:5px;">
                        <button type="submit" name="enviar_todos" value="1" class="button button-primary button-large" onclick="return confirm('¿Enviar email a TODOS los pedidos sin formulario?');">
                            Enviar a TODOS los pendientes (<?php echo count($orders); ?> pedidos)
                        </button>
                    </div>
                </form>
            <?php endif; ?>
        </div>

        <div style="background:#fff;padding:20px;border-radius:8px;margin:20px 0;box-shadow:0 1px 3px rgba(0,0,0,0.1);">
            <h2>Excluir pedido de Ericka</h2>
            <p>Si ya tiene el formulario completado, marcalo aquí:</p>
            <form method="post" action="">
                <?php wp_nonce_field('duendes_marcar_completado'); ?>
                <input type="number" name="order_id_completado" placeholder="ID del pedido" style="width:150px;">
                <button type="submit" name="marcar_completado" class="button">Marcar como completado</button>
            </form>
            <?php
            if (isset($_POST['marcar_completado']) && wp_verify_nonce($_POST['_wpnonce'], 'duendes_marcar_completado')) {
                $order_id = intval($_POST['order_id_completado']);
                update_post_meta($order_id, '_duendes_formulario_completado', 'yes');
                echo '<p style="color:green;">Pedido #' . $order_id . ' marcado como completado.</p>';
            }
            ?>
        </div>
    </div>
    <?php
}

// Función para enviar email manual a un pedido
function duendes_enviar_email_formulario_manual($order_id) {
    $order = wc_get_order($order_id);
    if (!$order) return false;

    $email = $order->get_billing_email();
    $nombre = $order->get_billing_first_name();

    if (!$email) return false;

    // Obtener guardianes del pedido
    $guardianes = [];
    foreach ($order->get_items() as $item) {
        $product = $item->get_product();
        if ($product) {
            $guardianes[] = [
                'nombre' => $item->get_name(),
                'imagen' => wp_get_attachment_image_url($product->get_image_id(), 'thumbnail') ?: '',
            ];
        }
    }

    if (empty($guardianes)) return false;

    // Crear token único para el formulario
    $token = wp_generate_password(32, false);
    update_post_meta($order_id, '_duendes_form_token', $token);

    // Link al formulario
    $link_formulario = add_query_arg([
        'duendes_completar' => $token,
        'order' => $order_id
    ], home_url('/mi-conexion/'));

    // Generar HTML del email
    $guardians_html = '';
    foreach ($guardianes as $g) {
        $guardians_html .= '
        <div style="display:inline-block;text-align:center;margin:10px 15px;">
            ' . ($g['imagen'] ? '<img src="' . esc_url($g['imagen']) . '" style="width:80px;height:80px;border-radius:50%;border:2px solid #c9a227;object-fit:cover;">' : '') . '
            <p style="color:#c9a227;font-size:14px;margin:8px 0 0;font-family:Cinzel,serif;">' . esc_html($g['nombre']) . '</p>
        </div>';
    }

    $es_multiple = count($guardianes) > 1;
    if ($es_multiple) {
        $titulo = 'Tus guardianes quieren conocerte';
        $mensaje = 'Elegiste ' . count($guardianes) . ' guardianes y cada uno quiere hablarte de forma personal. Para que sus mensajes sean realmente para vos (y no frases genéricas), necesitamos conocerte un poco.';
    } else {
        $titulo = 'Tu guardián quiere conocerte';
        $mensaje = 'Para que tu guardián pueda escribirte un mensaje que realmente sea para vos (y no frases genéricas), necesita saber un poco de tu vida, de lo que estás atravesando, de lo que necesitás.';
    }

    $html = '
    <div style="max-width:600px;margin:0 auto;background:#0a0a0a;color:#fff;font-family:Georgia,serif;">
        <div style="background:linear-gradient(180deg,#1a1510 0%,#0a0a0a 100%);padding:40px 30px;text-align:center;border-bottom:2px solid #c9a227;">
            <h1 style="color:#c9a227;font-size:28px;margin:0 0 10px;font-family:Cinzel,serif;letter-spacing:2px;">' . esc_html($titulo) . '</h1>
            <p style="color:rgba(255,255,255,0.7);font-size:16px;margin:0;font-style:italic;">Hola ' . esc_html($nombre) . ', tenemos algo importante que pedirte</p>
        </div>

        <div style="background:rgba(201,162,39,0.05);padding:30px;text-align:center;">
            ' . $guardians_html . '
        </div>

        <div style="padding:40px 30px;">
            <p style="color:rgba(255,255,255,0.9);font-size:17px;line-height:1.8;margin:0 0 25px;">
                ' . esc_html($mensaje) . '
            </p>

            <div style="background:rgba(201,162,39,0.1);border-left:4px solid #c9a227;padding:20px;margin:25px 0;border-radius:0 10px 10px 0;">
                <p style="color:#c9a227;font-size:15px;margin:0 0 10px;font-weight:bold;">¿Por qué es importante?</p>
                <p style="color:rgba(255,255,255,0.8);font-size:15px;margin:0;line-height:1.6;">
                    La canalización que vas a recibir es un mensaje personal de tu guardián.
                    Cuanto más nos cuentes, más profundo y certero será ese mensaje.
                </p>
            </div>

            <div style="text-align:center;margin:40px 0;">
                <a href="' . esc_url($link_formulario) . '" style="display:inline-block;background:linear-gradient(135deg,#c9a227,#8b6914);color:#0a0a0a;text-decoration:none;padding:18px 50px;border-radius:30px;font-size:15px;font-weight:bold;font-family:Cinzel,serif;letter-spacing:1.5px;box-shadow:0 4px 20px rgba(201,162,39,0.3);">COMPLETAR FORMULARIO</a>
            </div>

            <p style="color:rgba(255,255,255,0.5);font-size:14px;text-align:center;">
                Solo toma 2-3 minutos. No hay respuestas correctas, solo tu verdad.
            </p>
        </div>

        <div style="background:#0d0a05;padding:30px;text-align:center;border-top:1px solid rgba(201,162,39,0.2);">
            <p style="color:rgba(255,255,255,0.4);font-size:13px;margin:0 0 10px;">
                Este email es parte de tu compra en Duendes del Uruguay
            </p>
            <p style="color:rgba(255,255,255,0.3);font-size:12px;margin:0;">
                Si tenés dudas, respondé a este email o escribinos por Instagram @duendesdeluruguay
            </p>
        </div>
    </div>';

    // Asunto
    if (count($guardianes) > 1) {
        $asunto = $nombre . ', tus guardianes necesitan conocerte';
    } else {
        $asunto = $nombre . ', tu guardián necesita conocerte';
    }

    // Enviar via Brevo
    $response = wp_remote_post('https://api.brevo.com/v3/smtp/email', [
        'headers' => [
            'accept' => 'application/json',
            'api-key' => 'BREVO_API_KEY_PLACEHOLDER',
            'content-type' => 'application/json',
        ],
        'body' => json_encode([
            'sender' => [
                'name' => 'Duendes del Uruguay',
                'email' => 'info@duendesdeluruguay.com',
            ],
            'to' => [
                ['email' => $email, 'name' => $nombre]
            ],
            'subject' => $asunto,
            'htmlContent' => $html,
        ]),
        'timeout' => 30,
    ]);

    if (is_wp_error($response)) {
        error_log('Duendes Form Email Error: ' . $response->get_error_message());
        return false;
    }

    $code = wp_remote_retrieve_response_code($response);
    if ($code >= 200 && $code < 300) {
        $order->update_meta_data('_duendes_email_formulario_enviado', current_time('mysql'));
        $order->save();
        return true;
    }

    return false;
}

// Función para envío masivo
function duendes_enviar_formularios_masivo() {
    $args = [
        'status' => ['processing', 'completed', 'on-hold'],
        'limit' => 100,
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
    $enviados = [];

    foreach ($orders as $order) {
        // No reenviar si ya se envió en las últimas 24 horas
        $ultimo_envio = $order->get_meta('_duendes_email_formulario_enviado');
        if ($ultimo_envio && strtotime($ultimo_envio) > strtotime('-24 hours')) {
            continue;
        }

        if (duendes_enviar_email_formulario_manual($order->get_id())) {
            $enviados[] = $order->get_id();
        }

        // Pequeña pausa para no sobrecargar
        usleep(500000); // 0.5 segundos
    }

    return $enviados;
}
