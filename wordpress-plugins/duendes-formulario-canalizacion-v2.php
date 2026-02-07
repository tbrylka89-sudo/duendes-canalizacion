<?php
/**
 * Plugin Name: Duendes - Formulario de Canalización v2
 * Description: Sistema completo de formularios para canalizaciones con email automático
 * Version: 2.0
 * Author: Duendes del Uruguay
 */

if (!defined('ABSPATH')) exit;

// ═══════════════════════════════════════════════════════════════════════════
// CONFIGURACIÓN
// ═══════════════════════════════════════════════════════════════════════════

define('DUENDES_BREVO_API_KEY_FORM', 'BREVO_API_KEY_PLACEHOLDER');
define('DUENDES_FORM_SENDER_EMAIL', 'info@duendesdeluruguay.com');
define('DUENDES_FORM_SENDER_NAME', 'Duendes del Uruguay');

// ═══════════════════════════════════════════════════════════════════════════
// FUNCIÓN PARA ENVIAR EMAIL VIA BREVO
// ═══════════════════════════════════════════════════════════════════════════

function duendes_form_enviar_email_brevo($to_email, $to_name, $subject, $html_content) {
    $response = wp_remote_post('https://api.brevo.com/v3/smtp/email', [
        'headers' => [
            'accept' => 'application/json',
            'api-key' => DUENDES_BREVO_API_KEY_FORM,
            'content-type' => 'application/json',
        ],
        'body' => json_encode([
            'sender' => [
                'name' => DUENDES_FORM_SENDER_NAME,
                'email' => DUENDES_FORM_SENDER_EMAIL,
            ],
            'to' => [
                ['email' => $to_email, 'name' => $to_name]
            ],
            'subject' => $subject,
            'htmlContent' => $html_content,
        ]),
        'timeout' => 30,
    ]);

    if (is_wp_error($response)) {
        error_log('Duendes Form Email Error: ' . $response->get_error_message());
        return false;
    }

    $code = wp_remote_retrieve_response_code($response);
    return ($code >= 200 && $code < 300);
}

// ═══════════════════════════════════════════════════════════════════════════
// EMAIL AUTOMÁTICO CUANDO SE CREA/PAGA UNA ORDEN
// ═══════════════════════════════════════════════════════════════════════════

// Disparar cuando el pago se confirma (cubre compras online y manuales)
add_action('woocommerce_order_status_processing', 'duendes_enviar_email_formulario_canalizacion', 20, 1);
add_action('woocommerce_order_status_completed', 'duendes_enviar_email_formulario_canalizacion', 20, 1);

// También cuando se crea orden manual desde admin
add_action('woocommerce_new_order', 'duendes_programar_email_formulario', 10, 1);

function duendes_programar_email_formulario($order_id) {
    // Programar para 5 minutos después (para que se completen los datos)
    wp_schedule_single_event(time() + 300, 'duendes_enviar_email_formulario_cron', [$order_id]);
}

add_action('duendes_enviar_email_formulario_cron', 'duendes_enviar_email_formulario_canalizacion', 10, 1);

function duendes_enviar_email_formulario_canalizacion($order_id) {
    $order = wc_get_order($order_id);
    if (!$order) return;

    // Evitar duplicados
    if ($order->get_meta('_duendes_email_formulario_enviado')) return;

    // Si ya completó el formulario, no enviar
    if ($order->get_meta('_duendes_formulario_completado') === 'yes') return;

    $email = $order->get_billing_email();
    $nombre = $order->get_billing_first_name();

    if (!$email) return;

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

    if (empty($guardianes)) return;

    // Crear token único para el formulario
    $token = wp_generate_password(32, false);
    update_post_meta($order_id, '_duendes_form_token', $token);

    // Link al formulario
    $link_formulario = add_query_arg([
        'duendes_completar' => $token,
        'order' => $order_id
    ], home_url('/mi-conexion/'));

    // Generar HTML del email
    $html = duendes_generar_email_formulario($nombre, $guardianes, $link_formulario, count($guardianes) > 1);

    // Asunto según cantidad de guardianes
    if (count($guardianes) > 1) {
        $asunto = $nombre . ', tus guardianes necesitan conocerte';
    } else {
        $asunto = $nombre . ', tu guardián necesita conocerte';
    }

    // Enviar
    $enviado = duendes_form_enviar_email_brevo($email, $nombre, $asunto, $html);

    if ($enviado) {
        $order->update_meta_data('_duendes_email_formulario_enviado', current_time('mysql'));
        $order->save();

        // Programar recordatorios
        wp_schedule_single_event(time() + (24 * 60 * 60), 'duendes_recordatorio_formulario', [$order_id, 1]);
        wp_schedule_single_event(time() + (72 * 60 * 60), 'duendes_recordatorio_formulario', [$order_id, 2]);

        error_log("Duendes: Email formulario enviado a $email para orden #$order_id");
    }
}

// ═══════════════════════════════════════════════════════════════════════════
// RECORDATORIOS
// ═══════════════════════════════════════════════════════════════════════════

add_action('duendes_recordatorio_formulario', 'duendes_enviar_recordatorio_formulario', 10, 2);

function duendes_enviar_recordatorio_formulario($order_id, $numero_recordatorio) {
    $order = wc_get_order($order_id);
    if (!$order) return;

    // Si ya completó, no enviar
    if ($order->get_meta('_duendes_formulario_completado') === 'yes') return;

    $email = $order->get_billing_email();
    $nombre = $order->get_billing_first_name();
    $token = $order->get_meta('_duendes_form_token');

    if (!$email || !$token) return;

    $link_formulario = add_query_arg([
        'duendes_completar' => $token,
        'order' => $order_id
    ], home_url('/mi-conexion/'));

    // Obtener nombre del guardián
    $nombre_guardian = 'Tu guardián';
    foreach ($order->get_items() as $item) {
        $nombre_guardian = $item->get_name();
        break;
    }

    if ($numero_recordatorio === 1) {
        $asunto = $nombre_guardian . ' está esperando conocerte...';
        $mensaje_intro = 'Tu guardián ya está listo, pero aún no sabe nada de vos.';
        $mensaje_cuerpo = 'Sin esta información, la canalización que recibas será genérica en lugar de las palabras exactas que necesitás escuchar.';
    } else {
        $asunto = 'Última oportunidad: ' . $nombre_guardian . ' te espera';
        $mensaje_intro = 'En las próximas horas prepararemos tu canalización.';
        $mensaje_cuerpo = 'Si no completás el formulario, escribiremos algo bonito pero general. Si lo completás, escribiremos algo que te va a tocar el alma. La diferencia es enorme.';
    }

    $html = '
    <div style="max-width:600px;margin:0 auto;background:#0a0a0a;color:#fff;font-family:Georgia,serif;padding:40px;">
        <div style="text-align:center;margin-bottom:30px;">
            <h1 style="color:#c9a227;font-size:24px;margin:0 0 10px;font-family:Cinzel,serif;">' . esc_html($mensaje_intro) . '</h1>
        </div>

        <p style="color:rgba(255,255,255,0.8);font-size:16px;line-height:1.7;margin-bottom:25px;">
            Hola ' . esc_html($nombre) . ',
        </p>

        <p style="color:rgba(255,255,255,0.8);font-size:16px;line-height:1.7;margin-bottom:25px;">
            ' . esc_html($mensaje_cuerpo) . '
        </p>

        <div style="text-align:center;margin:35px 0;">
            <a href="' . esc_url($link_formulario) . '" style="display:inline-block;background:linear-gradient(135deg,#c9a227,#8b6914);color:#0a0a0a;text-decoration:none;padding:16px 40px;border-radius:25px;font-size:14px;font-weight:bold;font-family:Cinzel,serif;letter-spacing:1px;">COMPLETAR MI CONEXIÓN</a>
        </div>

        <p style="color:rgba(255,255,255,0.5);font-size:14px;text-align:center;margin-top:30px;">
            Solo toma 2 minutos. Tu guardián merece conocerte.
        </p>

        <div style="border-top:1px solid rgba(201,162,39,0.3);margin-top:40px;padding-top:20px;text-align:center;">
            <p style="color:rgba(255,255,255,0.4);font-size:12px;margin:0;">Duendes del Uruguay</p>
        </div>
    </div>';

    duendes_form_enviar_email_brevo($email, $nombre, $asunto, $html);
    error_log("Duendes: Recordatorio #$numero_recordatorio enviado a $email para orden #$order_id");
}

// ═══════════════════════════════════════════════════════════════════════════
// GENERAR HTML DEL EMAIL PRINCIPAL
// ═══════════════════════════════════════════════════════════════════════════

function duendes_generar_email_formulario($nombre, $guardianes, $link_formulario, $es_multiple) {
    $guardians_html = '';
    foreach ($guardianes as $g) {
        $guardians_html .= '
        <div style="display:inline-block;text-align:center;margin:10px 15px;">
            ' . ($g['imagen'] ? '<img src="' . esc_url($g['imagen']) . '" style="width:80px;height:80px;border-radius:50%;border:2px solid #c9a227;object-fit:cover;">' : '') . '
            <p style="color:#c9a227;font-size:14px;margin:8px 0 0;font-family:Cinzel,serif;">' . esc_html($g['nombre']) . '</p>
        </div>';
    }

    if ($es_multiple) {
        $titulo = 'Tus guardianes quieren conocerte';
        $mensaje = 'Elegiste ' . count($guardianes) . ' guardianes y cada uno quiere hablarte de forma personal. Para que sus mensajes sean realmente para vos (y no frases genéricas), necesitamos conocerte un poco.';
    } else {
        $titulo = 'Tu guardián quiere conocerte';
        $mensaje = 'Para que tu guardián pueda escribirte un mensaje que realmente sea para vos (y no frases genéricas), necesita saber un poco de tu vida, de lo que estás atravesando, de lo que necesitás.';
    }

    return '
    <div style="max-width:600px;margin:0 auto;background:#0a0a0a;color:#fff;font-family:Georgia,serif;">
        <!-- Header con gradiente -->
        <div style="background:linear-gradient(180deg,#1a1510 0%,#0a0a0a 100%);padding:40px 30px;text-align:center;border-bottom:2px solid #c9a227;">
            <h1 style="color:#c9a227;font-size:28px;margin:0 0 10px;font-family:Cinzel,serif;letter-spacing:2px;">' . esc_html($titulo) . '</h1>
            <p style="color:rgba(255,255,255,0.7);font-size:16px;margin:0;font-style:italic;">Hola ' . esc_html($nombre) . ', tenemos algo importante que pedirte</p>
        </div>

        <!-- Guardianes -->
        <div style="background:rgba(201,162,39,0.05);padding:30px;text-align:center;">
            ' . $guardians_html . '
        </div>

        <!-- Contenido principal -->
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

        <!-- Footer -->
        <div style="background:#0d0a05;padding:30px;text-align:center;border-top:1px solid rgba(201,162,39,0.2);">
            <p style="color:rgba(255,255,255,0.4);font-size:13px;margin:0 0 10px;">
                Este email es parte de tu compra en Duendes del Uruguay
            </p>
            <p style="color:rgba(255,255,255,0.3);font-size:12px;margin:0;">
                Si tenés dudas, respondé a este email o escribinos por Instagram @duendesdeluruguay
            </p>
        </div>
    </div>';
}

// ═══════════════════════════════════════════════════════════════════════════
// PÁGINA DE FORMULARIO (mi-conexion)
// ═══════════════════════════════════════════════════════════════════════════

add_action('template_redirect', 'duendes_manejar_pagina_formulario');

function duendes_manejar_pagina_formulario() {
    // Verificar si es la página de formulario
    if (!isset($_GET['duendes_completar']) || !isset($_GET['order'])) return;

    $token = sanitize_text_field($_GET['duendes_completar']);
    $order_id = intval($_GET['order']);

    $order = wc_get_order($order_id);
    if (!$order) {
        wp_die('Orden no encontrada');
    }

    // Verificar token
    $token_guardado = $order->get_meta('_duendes_form_token');
    if ($token !== $token_guardado) {
        wp_die('Link inválido o expirado');
    }

    // Si ya completó, mostrar mensaje
    if ($order->get_meta('_duendes_formulario_completado') === 'yes') {
        duendes_mostrar_pagina_ya_completado();
        exit;
    }

    // Mostrar página con formulario
    duendes_mostrar_pagina_formulario($order);
    exit;
}

function duendes_mostrar_pagina_formulario($order) {
    $order_id = $order->get_id();
    $nombre_cliente = $order->get_billing_first_name();

    // Obtener guardianes
    $guardianes = [];
    foreach ($order->get_items() as $item) {
        $product = $item->get_product();
        $guardianes[] = [
            'id' => $item->get_product_id(),
            'nombre' => $item->get_name(),
            'imagen' => $product ? wp_get_attachment_image_url($product->get_image_id(), 'medium') : '',
        ];
    }

    $es_multiple = count($guardianes) > 1;
    ?>
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Completar conexión - Duendes del Uruguay</title>
        <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600&family=Cormorant+Garamond:ital,wght@0,400;0,500;1,400&display=swap" rel="stylesheet">
        <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body {
                background: #0a0a0a;
                color: #fff;
                font-family: 'Cormorant Garamond', Georgia, serif;
                min-height: 100vh;
                padding: 20px;
            }
            .container {
                max-width: 600px;
                margin: 0 auto;
            }
            .header {
                text-align: center;
                padding: 40px 0;
                border-bottom: 1px solid rgba(201,162,39,0.3);
                margin-bottom: 30px;
            }
            .header h1 {
                color: #c9a227;
                font-family: 'Cinzel', serif;
                font-size: 24px;
                font-weight: 500;
                letter-spacing: 2px;
                margin-bottom: 10px;
            }
            .header p {
                color: rgba(255,255,255,0.6);
                font-style: italic;
                font-size: 16px;
            }
            .guardianes {
                display: flex;
                justify-content: center;
                flex-wrap: wrap;
                gap: 20px;
                margin-bottom: 30px;
            }
            .guardian {
                text-align: center;
            }
            .guardian img {
                width: 80px;
                height: 80px;
                border-radius: 50%;
                border: 2px solid #c9a227;
                object-fit: cover;
            }
            .guardian-nombre {
                color: #c9a227;
                font-family: 'Cinzel', serif;
                font-size: 13px;
                margin-top: 8px;
            }
            .pregunta-tipo {
                background: linear-gradient(145deg, #1a1510, #0d0a05);
                border: 1px solid rgba(201,162,39,0.3);
                border-radius: 16px;
                padding: 30px;
                margin-bottom: 30px;
            }
            .pregunta-tipo h2 {
                color: #c9a227;
                font-family: 'Cinzel', serif;
                font-size: 18px;
                text-align: center;
                margin-bottom: 20px;
            }
            .opcion {
                display: flex;
                align-items: center;
                gap: 15px;
                padding: 15px 20px;
                background: rgba(255,255,255,0.03);
                border: 1px solid rgba(201,162,39,0.2);
                border-radius: 12px;
                margin-bottom: 12px;
                cursor: pointer;
                transition: all 0.3s;
            }
            .opcion:hover, .opcion.selected {
                border-color: #c9a227;
                background: rgba(201,162,39,0.1);
            }
            .opcion input[type="radio"] {
                width: 20px;
                height: 20px;
                accent-color: #c9a227;
            }
            .opcion-texto strong {
                display: block;
                color: #fff;
                font-family: 'Cinzel', serif;
                font-size: 14px;
            }
            .opcion-texto span {
                color: rgba(255,255,255,0.5);
                font-size: 13px;
                font-style: italic;
            }
            .form-section {
                display: none;
                background: linear-gradient(145deg, #1a1510, #0d0a05);
                border: 1px solid rgba(201,162,39,0.3);
                border-radius: 16px;
                padding: 30px;
                margin-bottom: 20px;
            }
            .form-section.active { display: block; }
            .form-section h3 {
                color: #c9a227;
                font-family: 'Cinzel', serif;
                font-size: 16px;
                margin-bottom: 20px;
                text-align: center;
            }
            .form-section p.intro {
                color: rgba(255,255,255,0.6);
                font-style: italic;
                text-align: center;
                margin-bottom: 25px;
            }
            label.campo {
                display: block;
                color: rgba(255,255,255,0.7);
                font-size: 14px;
                margin-bottom: 8px;
            }
            input[type="text"], input[type="email"], textarea {
                width: 100%;
                padding: 14px 18px;
                background: rgba(255,255,255,0.05);
                border: 1px solid rgba(201,162,39,0.3);
                border-radius: 10px;
                color: #fff;
                font-family: 'Cormorant Garamond', serif;
                font-size: 16px;
                margin-bottom: 20px;
            }
            input:focus, textarea:focus {
                outline: none;
                border-color: #c9a227;
                box-shadow: 0 0 15px rgba(201,162,39,0.2);
            }
            textarea { resize: none; }
            .checkbox-group {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 10px;
                margin-bottom: 20px;
            }
            .checkbox-item {
                display: flex;
                align-items: center;
                gap: 10px;
                padding: 12px;
                background: rgba(255,255,255,0.03);
                border: 1px solid rgba(201,162,39,0.2);
                border-radius: 8px;
                cursor: pointer;
            }
            .checkbox-item:hover, .checkbox-item.selected {
                border-color: #c9a227;
                background: rgba(201,162,39,0.1);
            }
            .checkbox-item input { accent-color: #c9a227; }
            .btn {
                display: inline-block;
                padding: 14px 40px;
                background: linear-gradient(135deg, #c9a227, #8b6914);
                color: #0a0a0a;
                border: none;
                border-radius: 25px;
                font-family: 'Cinzel', serif;
                font-size: 13px;
                font-weight: 600;
                letter-spacing: 1.5px;
                text-transform: uppercase;
                cursor: pointer;
                transition: all 0.3s;
            }
            .btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 5px 20px rgba(201,162,39,0.3);
            }
            .btn-secundario {
                background: transparent;
                border: 1px solid rgba(201,162,39,0.5);
                color: #c9a227;
            }
            .btns {
                display: flex;
                gap: 15px;
                justify-content: center;
                margin-top: 30px;
            }
            .mensaje-exito {
                display: none;
                text-align: center;
                padding: 60px 30px;
            }
            .mensaje-exito h2 {
                color: #c9a227;
                font-family: 'Cinzel', serif;
                font-size: 28px;
                margin-bottom: 20px;
            }
            .mensaje-exito p {
                color: rgba(255,255,255,0.7);
                font-size: 18px;
                line-height: 1.7;
            }
            @media (max-width: 480px) {
                .checkbox-group { grid-template-columns: 1fr; }
                .btns { flex-direction: column; }
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1><?php echo $es_multiple ? 'Tus guardianes quieren conocerte' : 'Tu guardián quiere conocerte'; ?></h1>
                <p>Hola <?php echo esc_html($nombre_cliente); ?>, completá este formulario para recibir tu canalización personalizada</p>
            </div>

            <div class="guardianes">
                <?php foreach ($guardianes as $g): ?>
                <div class="guardian">
                    <?php if ($g['imagen']): ?>
                    <img src="<?php echo esc_url($g['imagen']); ?>" alt="<?php echo esc_attr($g['nombre']); ?>">
                    <?php endif; ?>
                    <div class="guardian-nombre"><?php echo esc_html($g['nombre']); ?></div>
                </div>
                <?php endforeach; ?>
            </div>

            <form id="formulario-canalizacion">
                <!-- Paso 1: ¿Para quién es? -->
                <div class="pregunta-tipo" id="paso-tipo">
                    <h2>¿Quién recibirá la magia de <?php echo $es_multiple ? 'estos guardianes' : 'este guardián'; ?>?</h2>

                    <label class="opcion">
                        <input type="radio" name="tipo" value="para_mi" checked>
                        <div class="opcion-texto">
                            <strong>Soy yo</strong>
                            <span><?php echo $es_multiple ? 'estos guardianes vienen' : 'este guardián viene'; ?> a acompañarme</span>
                        </div>
                    </label>

                    <label class="opcion">
                        <input type="radio" name="tipo" value="regalo_sabe">
                        <div class="opcion-texto">
                            <strong>Es un regalo</strong>
                            <span>y la persona lo sabe</span>
                        </div>
                    </label>

                    <label class="opcion">
                        <input type="radio" name="tipo" value="regalo_sorpresa">
                        <div class="opcion-texto">
                            <strong>Es un regalo sorpresa</strong>
                            <span>quiero que sea inesperado</span>
                        </div>
                    </label>

                    <label class="opcion">
                        <input type="radio" name="tipo" value="para_nino">
                        <div class="opcion-texto">
                            <strong>Es para un niño/a</strong>
                            <span>menor de 18 años</span>
                        </div>
                    </label>

                    <div class="btns">
                        <button type="button" class="btn" onclick="mostrarFormulario()">Continuar</button>
                    </div>
                </div>

                <!-- Formularios según tipo (se muestran dinámicamente) -->
                <div id="contenedor-formulario"></div>

                <input type="hidden" name="order_id" value="<?php echo esc_attr($order_id); ?>">
                <input type="hidden" name="action" value="duendes_guardar_formulario_externo">
                <input type="hidden" name="nonce" value="<?php echo wp_create_nonce('duendes_form_externo'); ?>">
            </form>

            <div class="mensaje-exito" id="mensaje-exito">
                <h2>¡Conexión establecida!</h2>
                <p><?php echo $es_multiple ? 'Tus guardianes ahora te conocen.' : 'Tu guardián ahora te conoce.'; ?><br>Pronto recibirás <?php echo $es_multiple ? 'sus mensajes personales' : 'su mensaje personal'; ?>.</p>
            </div>
        </div>

        <script>
        function mostrarFormulario() {
            var tipo = document.querySelector('input[name="tipo"]:checked').value;
            var contenedor = document.getElementById('contenedor-formulario');
            document.getElementById('paso-tipo').style.display = 'none';

            var html = '';

            if (tipo === 'para_mi') {
                html = generarFormularioParaMi();
            } else if (tipo === 'regalo_sabe') {
                html = generarFormularioRegaloSabe();
            } else if (tipo === 'regalo_sorpresa') {
                html = generarFormularioRegaloSorpresa();
            } else if (tipo === 'para_nino') {
                html = generarFormularioParaNino();
            }

            contenedor.innerHTML = html;
            contenedor.querySelector('.form-section').classList.add('active');
        }

        function generarFormularioParaMi() {
            return `
            <div class="form-section">
                <h3>Contanos sobre vos</h3>
                <p class="intro">No hay respuestas correctas - solo tu verdad.</p>

                <label class="campo">¿Cómo te llamás? (o cómo te gustaría que te llame)</label>
                <input type="text" name="nombre_persona" required>

                <label class="campo">¿Qué momento de tu vida estás atravesando?</label>
                <textarea name="momento_vida" rows="3" placeholder="Un cambio, una pérdida, un nuevo comienzo, una búsqueda..."></textarea>

                <label class="campo">¿Qué necesitás en este momento? (elegí los que resuenen)</label>
                <div class="checkbox-group">
                    <label class="checkbox-item"><input type="checkbox" name="necesidades[]" value="proteccion"> Protección</label>
                    <label class="checkbox-item"><input type="checkbox" name="necesidades[]" value="claridad"> Claridad</label>
                    <label class="checkbox-item"><input type="checkbox" name="necesidades[]" value="abundancia"> Abundancia</label>
                    <label class="checkbox-item"><input type="checkbox" name="necesidades[]" value="sanacion"> Sanación</label>
                    <label class="checkbox-item"><input type="checkbox" name="necesidades[]" value="amor"> Amor</label>
                    <label class="checkbox-item"><input type="checkbox" name="necesidades[]" value="fuerza"> Fuerza</label>
                </div>

                <label class="campo">¿Hay algo que tu guardián debería saber? (opcional)</label>
                <textarea name="mensaje_guardian" rows="3" placeholder="Algo que no le contás a nadie, algo que te pesa, algo que soñás..."></textarea>

                <label class="checkbox-item" style="margin-top:20px;">
                    <input type="checkbox" name="confirma_mayor" required>
                    <span>Confirmo que soy mayor de 18 años</span>
                </label>

                <div class="btns">
                    <button type="button" class="btn btn-secundario" onclick="volverAtras()">Atrás</button>
                    <button type="submit" class="btn">Completar conexión</button>
                </div>
            </div>`;
        }

        function generarFormularioRegaloSabe() {
            return `
            <div class="form-section">
                <h3>Qué lindo regalar magia</h3>
                <p class="intro">Le enviaremos un formulario a esa persona para que nos cuente sobre sí.</p>

                <label class="campo">¿Cómo se llama la persona que lo recibirá?</label>
                <input type="text" name="nombre_persona" required>

                <label class="campo">¿Cuál es su email?</label>
                <input type="email" name="email_destinatario" required>
                <p style="color:rgba(255,255,255,0.4);font-size:12px;margin-top:-15px;margin-bottom:20px;">Le enviaremos un formulario especial.</p>

                <label class="campo">¿Querés incluir un mensaje personal? (opcional)</label>
                <textarea name="mensaje_personal" rows="3" placeholder="Un mensaje que quieras que reciba..."></textarea>

                <div class="btns">
                    <button type="button" class="btn btn-secundario" onclick="volverAtras()">Atrás</button>
                    <button type="submit" class="btn">Enviar invitación</button>
                </div>
            </div>`;
        }

        function generarFormularioRegaloSorpresa() {
            return `
            <div class="form-section">
                <h3>Una sorpresa mágica</h3>
                <p class="intro">Como es sorpresa, contanos vos sobre esa persona.</p>

                <label class="campo">¿Cómo se llama?</label>
                <input type="text" name="nombre_persona" required>

                <label class="campo">¿Cuál es tu relación?</label>
                <div class="checkbox-group">
                    <label class="checkbox-item"><input type="radio" name="relacion" value="pareja"> Pareja</label>
                    <label class="checkbox-item"><input type="radio" name="relacion" value="familiar"> Familiar</label>
                    <label class="checkbox-item"><input type="radio" name="relacion" value="amigo"> Amigo/a</label>
                    <label class="checkbox-item"><input type="radio" name="relacion" value="otro"> Otro</label>
                </div>

                <label class="campo">¿Qué momento está atravesando?</label>
                <textarea name="momento_vida" rows="3" placeholder="Una separación, un duelo, un logro, una crisis..."></textarea>

                <label class="campo">¿Qué creés que necesita escuchar?</label>
                <textarea name="que_necesita" rows="3" placeholder="Algo que vos le dirías si pudieras..."></textarea>

                <label class="campo">¿Querés incluir un mensaje tuyo? (opcional)</label>
                <textarea name="mensaje_personal" rows="2"></textarea>

                <label class="checkbox-item" style="margin-top:10px;">
                    <input type="checkbox" name="es_anonimo">
                    <span>Prefiero que sea anónimo</span>
                </label>

                <div class="btns">
                    <button type="button" class="btn btn-secundario" onclick="volverAtras()">Atrás</button>
                    <button type="submit" class="btn">Completar conexión</button>
                </div>
            </div>`;
        }

        function generarFormularioParaNino() {
            return `
            <div class="form-section">
                <h3>Los guardianes aman a los pequeños</h3>
                <p class="intro">Tienen una forma especial de hablarles.</p>

                <label class="campo">¿Cómo se llama el niño/a?</label>
                <input type="text" name="nombre_persona" required>

                <label class="campo">¿Qué edad tiene?</label>
                <div class="checkbox-group">
                    <label class="checkbox-item"><input type="radio" name="edad_nino" value="3-6"> 3-6 años</label>
                    <label class="checkbox-item"><input type="radio" name="edad_nino" value="7-10"> 7-10 años</label>
                    <label class="checkbox-item"><input type="radio" name="edad_nino" value="11-14"> 11-14 años</label>
                    <label class="checkbox-item"><input type="radio" name="edad_nino" value="15-17"> 15-17 años</label>
                </div>

                <label class="campo">¿Cuál es tu relación?</label>
                <div class="checkbox-group">
                    <label class="checkbox-item"><input type="radio" name="relacion" value="mama"> Mamá</label>
                    <label class="checkbox-item"><input type="radio" name="relacion" value="papa"> Papá</label>
                    <label class="checkbox-item"><input type="radio" name="relacion" value="abuelo"> Abuelo/a</label>
                    <label class="checkbox-item"><input type="radio" name="relacion" value="otro"> Otro</label>
                </div>

                <label class="campo">¿Qué le gusta hacer?</label>
                <textarea name="que_le_gusta" rows="2" placeholder="Dibujar, jugar, leer, los animales..."></textarea>

                <label class="campo">¿Hay algo que esté atravesando? (opcional)</label>
                <textarea name="mensaje_guardian" rows="2" placeholder="Miedos, cambios en la familia, necesita confianza..."></textarea>

                <div style="background:rgba(201,162,39,0.1);border:1px solid rgba(201,162,39,0.3);border-radius:10px;padding:15px;margin:20px 0;">
                    <p style="color:rgba(255,255,255,0.7);font-size:13px;margin:0;">
                        <strong style="color:#c9a227;">Nota:</strong> Por protección, no pedimos fotos de menores. El guardián se conectará a través de tu amor.
                    </p>
                </div>

                <label class="checkbox-item">
                    <input type="checkbox" name="confirma_entendido" required>
                    <span>Entiendo y confirmo</span>
                </label>

                <div class="btns">
                    <button type="button" class="btn btn-secundario" onclick="volverAtras()">Atrás</button>
                    <button type="submit" class="btn">Completar conexión</button>
                </div>
            </div>`;
        }

        function volverAtras() {
            document.getElementById('paso-tipo').style.display = 'block';
            document.getElementById('contenedor-formulario').innerHTML = '';
        }

        // Manejar envío del formulario
        document.getElementById('formulario-canalizacion').addEventListener('submit', function(e) {
            e.preventDefault();

            var formData = new FormData(this);
            formData.append('tipo', document.querySelector('input[name="tipo"]:checked').value);

            // Recolectar necesidades
            var necesidades = [];
            document.querySelectorAll('input[name="necesidades[]"]:checked').forEach(function(cb) {
                necesidades.push(cb.value);
            });
            formData.append('necesidades_json', JSON.stringify(necesidades));

            var btn = this.querySelector('button[type="submit"]');
            btn.textContent = 'Enviando...';
            btn.disabled = true;

            fetch('<?php echo admin_url('admin-ajax.php'); ?>', {
                method: 'POST',
                body: formData
            })
            .then(r => r.json())
            .then(data => {
                if (data.success) {
                    document.getElementById('contenedor-formulario').style.display = 'none';
                    document.getElementById('mensaje-exito').style.display = 'block';
                    window.scrollTo({top: 0, behavior: 'smooth'});
                } else {
                    alert(data.data || 'Error al enviar. Intentá de nuevo.');
                    btn.textContent = 'Completar conexión';
                    btn.disabled = false;
                }
            })
            .catch(err => {
                alert('Error de conexión. Intentá de nuevo.');
                btn.textContent = 'Completar conexión';
                btn.disabled = false;
            });
        });

        // Highlight opciones seleccionadas
        document.querySelectorAll('.opcion, .checkbox-item').forEach(function(el) {
            el.addEventListener('click', function() {
                var input = this.querySelector('input');
                if (input.type === 'radio') {
                    this.closest('.pregunta-tipo, .form-section').querySelectorAll('.opcion, .checkbox-item').forEach(function(o) {
                        if (o.querySelector('input[name="' + input.name + '"]')) {
                            o.classList.remove('selected');
                        }
                    });
                }
                if (input.checked || input.type === 'checkbox') {
                    this.classList.toggle('selected', input.checked);
                } else {
                    this.classList.add('selected');
                }
            });
        });
        </script>
    </body>
    </html>
    <?php
}

function duendes_mostrar_pagina_ya_completado() {
    ?>
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Conexión completada - Duendes del Uruguay</title>
        <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500&family=Cormorant+Garamond&display=swap" rel="stylesheet">
        <style>
            body {
                background: #0a0a0a;
                color: #fff;
                font-family: 'Cormorant Garamond', serif;
                min-height: 100vh;
                display: flex;
                align-items: center;
                justify-content: center;
                text-align: center;
                padding: 20px;
            }
            h1 { color: #c9a227; font-family: 'Cinzel', serif; font-size: 28px; margin-bottom: 20px; }
            p { color: rgba(255,255,255,0.7); font-size: 18px; line-height: 1.7; }
            a { color: #c9a227; }
        </style>
    </head>
    <body>
        <div>
            <h1>Conexión ya establecida</h1>
            <p>Ya completaste el formulario anteriormente.<br>Tu guardián te conoce y pronto recibirás su mensaje.</p>
            <p style="margin-top:30px;"><a href="https://duendesdeluruguay.com">Volver a la tienda</a></p>
        </div>
    </body>
    </html>
    <?php
}

// ═══════════════════════════════════════════════════════════════════════════
// AJAX HANDLER PARA FORMULARIO EXTERNO
// ═══════════════════════════════════════════════════════════════════════════

add_action('wp_ajax_duendes_guardar_formulario_externo', 'duendes_ajax_guardar_formulario_externo');
add_action('wp_ajax_nopriv_duendes_guardar_formulario_externo', 'duendes_ajax_guardar_formulario_externo');

function duendes_ajax_guardar_formulario_externo() {
    if (!wp_verify_nonce($_POST['nonce'] ?? '', 'duendes_form_externo')) {
        wp_send_json_error('Sesión expirada');
    }

    $order_id = intval($_POST['order_id'] ?? 0);
    if (!$order_id) {
        wp_send_json_error('Orden inválida');
    }

    $order = wc_get_order($order_id);
    if (!$order) {
        wp_send_json_error('Orden no encontrada');
    }

    $tipo = sanitize_text_field($_POST['tipo'] ?? 'para_mi');

    $datos = [
        'tipo' => $tipo,
        'fecha' => current_time('mysql'),
        'nombre' => sanitize_text_field($_POST['nombre_persona'] ?? ''),
        'momento' => sanitize_textarea_field($_POST['momento_vida'] ?? ''),
        'mensaje' => sanitize_textarea_field($_POST['mensaje_guardian'] ?? ''),
        'necesidades' => json_decode(stripslashes($_POST['necesidades_json'] ?? '[]'), true),
        'relacion' => sanitize_text_field($_POST['relacion'] ?? ''),
        'que_necesita' => sanitize_textarea_field($_POST['que_necesita'] ?? ''),
        'que_le_gusta' => sanitize_textarea_field($_POST['que_le_gusta'] ?? ''),
        'mensaje_personal' => sanitize_textarea_field($_POST['mensaje_personal'] ?? ''),
        'es_anonimo' => !empty($_POST['es_anonimo']),
        'edad_nino' => sanitize_text_field($_POST['edad_nino'] ?? ''),
        'email_destinatario' => sanitize_email($_POST['email_destinatario'] ?? ''),
    ];

    // Guardar datos
    update_post_meta($order_id, '_duendes_tipo_destinatario', $tipo);
    update_post_meta($order_id, '_duendes_datos_canalizacion', json_encode($datos, JSON_UNESCAPED_UNICODE));
    update_post_meta($order_id, '_duendes_formulario_completado', 'yes');
    update_post_meta($order_id, '_duendes_formulario_fecha', current_time('mysql'));

    // Cancelar recordatorios programados
    wp_clear_scheduled_hook('duendes_recordatorio_formulario', [$order_id, 1]);
    wp_clear_scheduled_hook('duendes_recordatorio_formulario', [$order_id, 2]);

    // Si es regalo que sabe, enviar email al destinatario
    if ($tipo === 'regalo_sabe' && !empty($datos['email_destinatario'])) {
        duendes_enviar_email_destinatario_v2($order_id, $datos);
    }

    // Notificar a admin (opcional)
    do_action('duendes_formulario_completado', $order_id, $datos);

    wp_send_json_success(['mensaje' => 'Guardado correctamente']);
}

// ═══════════════════════════════════════════════════════════════════════════
// EMAIL PARA DESTINATARIO (REGALO QUE SABE)
// ═══════════════════════════════════════════════════════════════════════════

function duendes_enviar_email_destinatario_v2($order_id, $datos) {
    $nombre_destinatario = $datos['nombre'] ?? 'Alguien especial';
    $email_destinatario = $datos['email_destinatario'] ?? '';
    $mensaje_personal = $datos['mensaje_personal'] ?? '';

    if (!$email_destinatario) return;

    // Crear token para el destinatario
    $token = wp_generate_password(32, false);
    update_post_meta($order_id, '_duendes_token_destinatario', $token);

    $link = add_query_arg([
        'duendes_completar' => $token,
        'order' => $order_id,
        'destinatario' => '1'
    ], home_url('/mi-conexion/'));

    $html = '
    <div style="max-width:600px;margin:0 auto;background:#0a0a0a;color:#fff;font-family:Georgia,serif;padding:40px;">
        <div style="text-align:center;margin-bottom:30px;">
            <h1 style="color:#c9a227;font-size:28px;margin:0 0 10px;font-family:serif;">Hola ' . esc_html($nombre_destinatario) . '</h1>
            <p style="color:rgba(255,255,255,0.7);font-size:18px;margin:0;font-style:italic;">Alguien que te quiere te regaló algo especial.</p>
        </div>

        ' . ($mensaje_personal ? '
        <div style="background:rgba(201,162,39,0.1);border-left:3px solid #c9a227;padding:20px;margin:25px 0;">
            <p style="color:rgba(255,255,255,0.8);font-size:16px;margin:0;font-style:italic;">"' . esc_html($mensaje_personal) . '"</p>
        </div>' : '') . '

        <p style="color:rgba(255,255,255,0.8);font-size:16px;line-height:1.7;">
            Un guardián está esperando conocerte. Para que pueda hablarte de verdad - con palabras que solo vos necesitás escuchar - necesita saber un poco de vos.
        </p>

        <div style="text-align:center;margin:35px 0;">
            <a href="' . esc_url($link) . '" style="display:inline-block;background:linear-gradient(135deg,#c9a227,#8b6914);color:#0a0a0a;text-decoration:none;padding:16px 40px;border-radius:25px;font-size:14px;font-weight:bold;letter-spacing:1px;">COMPLETAR MI CONEXIÓN</a>
        </div>

        <p style="color:rgba(255,255,255,0.5);font-size:14px;text-align:center;">
            Solo toma 2 minutos. Tu guardián te espera.
        </p>

        <div style="border-top:1px solid rgba(201,162,39,0.3);margin-top:40px;padding-top:20px;text-align:center;">
            <p style="color:rgba(255,255,255,0.4);font-size:12px;margin:0;">Duendes del Uruguay</p>
        </div>
    </div>';

    duendes_form_enviar_email_brevo($email_destinatario, $nombre_destinatario, 'Alguien te regaló una experiencia mágica', $html);
}

// ═══════════════════════════════════════════════════════════════════════════
// MANTENER COMPATIBILIDAD CON SISTEMA ANTERIOR (Thank You page)
// ═══════════════════════════════════════════════════════════════════════════

// El formulario en Thank You page sigue funcionando como antes
// Solo agregamos que también envíe el email si no lo completaron ahí

add_action('woocommerce_thankyou', 'duendes_check_formulario_thankyou', 100);

function duendes_check_formulario_thankyou($order_id) {
    // Si completaron el formulario en Thank You, marcar como completado
    // y cancelar el email automático
    if (get_post_meta($order_id, '_duendes_formulario_completado', true) === 'yes') {
        // Cancelar envío de email programado
        wp_clear_scheduled_hook('duendes_enviar_email_formulario_cron', [$order_id]);
        wp_clear_scheduled_hook('duendes_recordatorio_formulario', [$order_id, 1]);
        wp_clear_scheduled_hook('duendes_recordatorio_formulario', [$order_id, 2]);
    }
}
