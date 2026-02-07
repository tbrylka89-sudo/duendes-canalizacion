<?php
/**
 * Plugin Name: Duendes - Emails Formulario Canalización
 * Description: Envía emails para que completen el formulario de canalización
 * Version: 1.0
 *
 * ESTE PLUGIN HACE UNA SOLA COSA:
 * Asegurarse de que el cliente reciba el link para completar el formulario
 */

if (!defined('ABSPATH')) exit;

// =============================================================================
// CONFIGURACIÓN
// =============================================================================

// Usar Resend (más confiable que wp_mail)
define('DUENDES_FORM_RESEND_KEY', 're_Gp1e1MvT_MvQdCA8humB5zMdSFxkka3hz');

// =============================================================================
// EMAIL 1: INMEDIATO - "Solo falta un paso"
// Se envía 5 minutos después de la compra (para que no se solape con otros emails)
// =============================================================================

add_action('woocommerce_thankyou', 'duendes_programar_email_formulario', 20, 1);
function duendes_programar_email_formulario($order_id) {
    $order = wc_get_order($order_id);
    if (!$order) return;

    // Si ya programamos o enviamos, no hacer nada
    if ($order->get_meta('_duendes_form_email_scheduled')) return;

    // Programar email para 5 minutos después
    wp_schedule_single_event(time() + 300, 'duendes_enviar_email_formulario', [$order_id]);

    // Programar recordatorio 24h
    wp_schedule_single_event(time() + (24 * HOUR_IN_SECONDS), 'duendes_recordatorio_formulario', [$order_id, '24h']);

    // Programar recordatorio 72h
    wp_schedule_single_event(time() + (72 * HOUR_IN_SECONDS), 'duendes_recordatorio_formulario', [$order_id, '72h']);

    $order->update_meta_data('_duendes_form_email_scheduled', time());
    $order->save();

    error_log("Duendes Form: Emails programados para orden $order_id");
}

// Hook para el email inicial
add_action('duendes_enviar_email_formulario', 'duendes_email_formulario_inicial', 10, 1);
function duendes_email_formulario_inicial($order_id) {
    $order = wc_get_order($order_id);
    if (!$order) return;

    // Si ya completó el formulario, no enviar
    if ($order->get_meta('_duendes_formulario_completado') === 'yes') {
        error_log("Duendes Form: Orden $order_id ya completó formulario, no enviar email");
        return;
    }

    // Si ya enviamos este email, no repetir
    if ($order->get_meta('_duendes_form_email_sent')) return;

    $email = $order->get_billing_email();
    $nombre = $order->get_billing_first_name();

    // Obtener nombre del guardián
    $nombre_guardian = 'Tu guardián';
    foreach ($order->get_items() as $item) {
        $nombre_guardian = $item->get_name();
        break;
    }

    // Generar link al formulario
    $token = md5($order_id . 'duendes_form_2026' . $email);
    $link = home_url('/mi-conexion/?order=' . $order_id . '&token=' . $token);

    $asunto = "Solo falta un paso para conectar con $nombre_guardian";

    $html = duendes_email_template_formulario([
        'nombre' => $nombre,
        'guardian' => $nombre_guardian,
        'link' => $link,
        'tipo' => 'inicial'
    ]);

    $enviado = duendes_enviar_email_resend_form($email, $asunto, $html);

    if ($enviado) {
        $order->update_meta_data('_duendes_form_email_sent', time());
        $order->save();
        error_log("Duendes Form: Email inicial enviado a $email para orden $order_id");
    }
}

// Hook para recordatorios
add_action('duendes_recordatorio_formulario', 'duendes_email_recordatorio', 10, 2);
function duendes_email_recordatorio($order_id, $tipo) {
    $order = wc_get_order($order_id);
    if (!$order) return;

    // Si ya completó el formulario, no enviar
    if ($order->get_meta('_duendes_formulario_completado') === 'yes') {
        error_log("Duendes Form: Orden $order_id ya completó, cancelando recordatorio $tipo");
        return;
    }

    // Si ya enviamos este recordatorio, no repetir
    $meta_key = '_duendes_form_recordatorio_' . $tipo;
    if ($order->get_meta($meta_key)) return;

    $email = $order->get_billing_email();
    $nombre = $order->get_billing_first_name();

    // Obtener nombre del guardián
    $nombre_guardian = 'Tu guardián';
    foreach ($order->get_items() as $item) {
        $nombre_guardian = $item->get_name();
        break;
    }

    // Generar link
    $token = md5($order_id . 'duendes_form_2026' . $email);
    $link = home_url('/mi-conexion/?order=' . $order_id . '&token=' . $token);

    if ($tipo === '24h') {
        $asunto = "$nombre_guardian está esperando conocerte...";
    } else {
        $asunto = "Última oportunidad: tu canalización personal";
    }

    $html = duendes_email_template_formulario([
        'nombre' => $nombre,
        'guardian' => $nombre_guardian,
        'link' => $link,
        'tipo' => $tipo
    ]);

    $enviado = duendes_enviar_email_resend_form($email, $asunto, $html);

    if ($enviado) {
        $order->update_meta_data($meta_key, time());
        $order->save();
        error_log("Duendes Form: Recordatorio $tipo enviado a $email para orden $order_id");
    }
}

// =============================================================================
// TEMPLATE DE EMAIL
// =============================================================================

function duendes_email_template_formulario($data) {
    $nombre = esc_html($data['nombre']);
    $guardian = esc_html($data['guardian']);
    $link = esc_url($data['link']);
    $tipo = $data['tipo'];

    // Contenido según tipo
    if ($tipo === 'inicial') {
        $titulo = "Solo falta un paso";
        $mensaje = "
            <p style='color:rgba(255,255,255,0.85);font-size:16px;line-height:1.7;margin:0 0 20px 0;'>
                <strong style='color:#c9a227;'>$guardian</strong> ya sabe que lo elegiste.
                Ahora necesita conocerte para poder escribirte un mensaje personal -
                no algo genérico, sino palabras que solo vos necesitás escuchar.
            </p>
            <p style='color:rgba(255,255,255,0.7);font-size:15px;line-height:1.7;margin:0 0 25px 0;'>
                Solo toma 2 minutos. Contale quién sos, qué estás atravesando,
                en qué necesitás que te acompañe.
            </p>
        ";
        $boton_texto = "COMPLETAR MI CONEXIÓN";
    } elseif ($tipo === '24h') {
        $titulo = "$guardian está esperando...";
        $mensaje = "
            <p style='color:rgba(255,255,255,0.85);font-size:16px;line-height:1.7;margin:0 0 20px 0;'>
                $nombre, tu guardián ya está en camino pero todavía no sabe nada de vos.
            </p>
            <p style='color:rgba(255,255,255,0.7);font-size:15px;line-height:1.7;margin:0 0 25px 0;'>
                Sin esta información, la canalización que recibas será genérica.
                Con ella, será un mensaje escrito <strong style='color:#c9a227;'>específicamente para vos</strong>.
            </p>
            <p style='color:rgba(255,255,255,0.6);font-size:14px;margin:0 0 25px 0;font-style:italic;'>
                La diferencia es enorme. Solo toma 2 minutos.
            </p>
        ";
        $boton_texto = "COMPLETAR AHORA";
    } else { // 72h
        $titulo = "Última oportunidad";
        $mensaje = "
            <p style='color:rgba(255,255,255,0.85);font-size:16px;line-height:1.7;margin:0 0 20px 0;'>
                $nombre, en las próximas horas enviaremos tu guardián con su canalización.
            </p>
            <p style='color:#c9a227;font-size:15px;line-height:1.7;margin:0 0 20px 0;font-weight:bold;'>
                Si no completás el formulario, escribiremos algo bonito pero general.
                Si lo completás, escribiremos algo que te va a tocar el alma.
            </p>
            <p style='color:rgba(255,255,255,0.6);font-size:14px;margin:0 0 25px 0;'>
                Solo vos decidís. Son 2 minutos.
            </p>
        ";
        $boton_texto = "ÚLTIMA OPORTUNIDAD";
    }

    return '<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:#0a0a0a;font-family:Georgia,serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0a0a0a;padding:30px 15px;">
        <tr>
            <td align="center">
                <table width="100%" cellpadding="0" cellspacing="0" style="max-width:550px;background:#1a1a1a;border:1px solid rgba(201,162,39,0.3);border-radius:16px;overflow:hidden;">

                    <!-- Barra dorada superior -->
                    <tr>
                        <td style="height:4px;background:linear-gradient(90deg,transparent,#c9a227,transparent);"></td>
                    </tr>

                    <!-- Logo -->
                    <tr>
                        <td style="padding:30px 30px 20px 30px;text-align:center;">
                            <img src="https://duendesdeluruguay.com/wp-content/uploads/2024/01/logo-duendes-email.png" alt="Duendes del Uruguay" style="max-width:140px;height:auto;">
                        </td>
                    </tr>

                    <!-- Título -->
                    <tr>
                        <td style="padding:0 30px 25px 30px;text-align:center;">
                            <h1 style="margin:0;font-size:24px;color:#c9a227;font-family:Georgia,serif;font-weight:normal;">
                                ' . $titulo . '
                            </h1>
                        </td>
                    </tr>

                    <!-- Contenido -->
                    <tr>
                        <td style="padding:0 30px 30px 30px;">
                            ' . $mensaje . '

                            <!-- BOTÓN PRINCIPAL - MUY VISIBLE -->
                            <table width="100%" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td align="center" style="padding:10px 0 30px 0;">
                                        <a href="' . $link . '" style="display:inline-block;background:linear-gradient(135deg,#c9a227,#a88a42);color:#0a0a0a;text-decoration:none;padding:18px 45px;border-radius:30px;font-size:15px;font-weight:bold;letter-spacing:1px;">
                                            ' . $boton_texto . '
                                        </a>
                                    </td>
                                </tr>
                            </table>

                            <p style="color:rgba(255,255,255,0.4);font-size:12px;text-align:center;margin:0;">
                                Si el botón no funciona, copiá este link:<br>
                                <a href="' . $link . '" style="color:#c9a227;word-break:break-all;">' . $link . '</a>
                            </p>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="padding:20px 30px;border-top:1px solid rgba(201,162,39,0.15);text-align:center;">
                            <p style="margin:0;color:rgba(255,255,255,0.4);font-size:12px;">
                                Con amor desde el bosque<br>
                                Duendes del Uruguay
                            </p>
                        </td>
                    </tr>

                    <!-- Barra dorada inferior -->
                    <tr>
                        <td style="height:3px;background:linear-gradient(90deg,transparent,#c9a227,transparent);"></td>
                    </tr>

                </table>
            </td>
        </tr>
    </table>
</body>
</html>';
}

// =============================================================================
// ENVÍO CON RESEND (más confiable)
// =============================================================================

function duendes_enviar_email_resend_form($to, $subject, $html) {
    $response = wp_remote_post('https://api.resend.com/emails', [
        'headers' => [
            'Authorization' => 'Bearer ' . DUENDES_FORM_RESEND_KEY,
            'Content-Type' => 'application/json',
        ],
        'body' => json_encode([
            'from' => 'Duendes del Uruguay <hola@duendesdeluruguay.com>',
            'to' => [$to],
            'subject' => $subject,
            'html' => $html,
        ]),
        'timeout' => 30,
    ]);

    if (is_wp_error($response)) {
        error_log('Duendes Form Email Error: ' . $response->get_error_message());
        // Fallback a wp_mail
        $headers = ['Content-Type: text/html; charset=UTF-8', 'From: Duendes del Uruguay <hola@duendesdeluruguay.com>'];
        return wp_mail($to, $subject, $html, $headers);
    }

    $code = wp_remote_retrieve_response_code($response);
    if ($code >= 200 && $code < 300) {
        return true;
    }

    error_log('Duendes Form Email Error: ' . wp_remote_retrieve_body($response));
    return false;
}

// =============================================================================
// PÁGINA DEL FORMULARIO - /mi-conexion/
// =============================================================================

add_action('init', function() {
    add_rewrite_rule('^mi-conexion/?$', 'index.php?duendes_form_page=1', 'top');
});

add_filter('query_vars', function($vars) {
    $vars[] = 'duendes_form_page';
    return $vars;
});

add_action('template_redirect', function() {
    if (!get_query_var('duendes_form_page')) return;

    // Obtener orden
    $order_id = isset($_GET['order']) ? intval($_GET['order']) : 0;
    $token = isset($_GET['token']) ? sanitize_text_field($_GET['token']) : '';

    if (!$order_id) {
        wp_die('Link inválido. Por favor usá el link que te enviamos por email.');
    }

    $order = wc_get_order($order_id);
    if (!$order) {
        wp_die('Orden no encontrada.');
    }

    // Verificar token
    $email = $order->get_billing_email();
    $expected_token = md5($order_id . 'duendes_form_2026' . $email);

    if ($token !== $expected_token) {
        wp_die('Link inválido o expirado.');
    }

    // Si ya completó, mostrar mensaje
    if ($order->get_meta('_duendes_formulario_completado') === 'yes') {
        wp_die('Ya completaste el formulario. Tu guardián te conoce y pronto recibirás su mensaje personal.');
    }

    // Mostrar formulario
    duendes_mostrar_pagina_formulario($order);
    exit;
});

function duendes_mostrar_pagina_formulario($order) {
    $order_id = $order->get_id();
    $nombre = $order->get_billing_first_name();

    // Obtener nombre del guardián
    $nombre_guardian = 'tu guardián';
    foreach ($order->get_items() as $item) {
        $nombre_guardian = $item->get_name();
        break;
    }

    ?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Conectar con <?php echo esc_html($nombre_guardian); ?> - Duendes del Uruguay</title>
    <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600&family=Cormorant+Garamond:ital,wght@0,400;0,500;1,400&display=swap" rel="stylesheet">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            background: #0a0a0a;
            color: #fff;
            font-family: 'Cormorant Garamond', Georgia, serif;
            min-height: 100vh;
            padding: 20px;
        }
        .container { max-width: 500px; margin: 0 auto; }
        .logo { text-align: center; margin-bottom: 30px; }
        .logo img { max-width: 150px; }
        .card {
            background: #1a1a1a;
            border: 1px solid rgba(201,162,39,0.3);
            border-radius: 16px;
            padding: 35px;
            position: relative;
        }
        .card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 3px;
            background: linear-gradient(90deg, transparent, #c9a227, transparent);
        }
        h1 {
            font-family: 'Cinzel', serif;
            font-size: 24px;
            color: #c9a227;
            text-align: center;
            margin-bottom: 10px;
            font-weight: 400;
        }
        .subtitle {
            text-align: center;
            color: rgba(255,255,255,0.6);
            font-size: 15px;
            margin-bottom: 30px;
            font-style: italic;
        }
        .step { display: none; }
        .step.active { display: block; }
        .step-indicator {
            text-align: center;
            margin-bottom: 25px;
            color: rgba(255,255,255,0.4);
            font-size: 13px;
        }
        .step-indicator span {
            display: inline-block;
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: rgba(201,162,39,0.3);
            margin: 0 4px;
        }
        .step-indicator span.active {
            background: #c9a227;
        }
        label {
            display: block;
            color: #c9a227;
            font-family: 'Cinzel', serif;
            font-size: 13px;
            margin-bottom: 8px;
            letter-spacing: 0.5px;
        }
        input[type="text"], textarea {
            width: 100%;
            padding: 14px 16px;
            background: #0f0f0f;
            border: 1px solid rgba(201,162,39,0.25);
            border-radius: 10px;
            color: #fff;
            font-family: 'Cormorant Garamond', serif;
            font-size: 16px;
            margin-bottom: 20px;
        }
        input:focus, textarea:focus {
            outline: none;
            border-color: #c9a227;
            box-shadow: 0 0 15px rgba(201,162,39,0.15);
        }
        ::placeholder { color: rgba(255,255,255,0.35); }
        textarea { resize: none; min-height: 100px; }
        .options {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 10px;
            margin-bottom: 20px;
        }
        .option {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 12px 14px;
            background: #0f0f0f;
            border: 1px solid rgba(201,162,39,0.2);
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.2s;
        }
        .option:hover, .option.selected {
            border-color: #c9a227;
            background: rgba(201,162,39,0.08);
        }
        .option input { display: none; }
        .option span { font-size: 14px; color: rgba(255,255,255,0.85); }
        .btn {
            display: block;
            width: 100%;
            padding: 16px;
            background: linear-gradient(135deg, #c9a227, #a88a42);
            border: none;
            border-radius: 25px;
            color: #0a0a0a;
            font-family: 'Cinzel', serif;
            font-size: 14px;
            font-weight: 600;
            letter-spacing: 1px;
            cursor: pointer;
            transition: transform 0.2s;
        }
        .btn:hover { transform: translateY(-2px); }
        .btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .btn-secondary {
            background: transparent;
            border: 1px solid rgba(201,162,39,0.4);
            color: #c9a227;
            margin-top: 12px;
        }
        .buttons { display: flex; gap: 12px; margin-top: 10px; }
        .buttons .btn { flex: 1; }
        .success {
            text-align: center;
            padding: 40px 20px;
        }
        .success h2 {
            font-family: 'Cinzel', serif;
            color: #c9a227;
            font-size: 26px;
            margin-bottom: 15px;
        }
        .success p {
            color: rgba(255,255,255,0.7);
            font-size: 16px;
            line-height: 1.6;
        }
        .hint {
            color: rgba(255,255,255,0.5);
            font-size: 13px;
            margin-bottom: 20px;
            font-style: italic;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="logo">
            <img src="https://duendesdeluruguay.com/wp-content/uploads/2024/01/logo-duendes-email.png" alt="Duendes del Uruguay">
        </div>

        <div class="card">
            <h1><?php echo esc_html($nombre_guardian); ?> quiere conocerte</h1>
            <p class="subtitle">Solo toma 2 minutos</p>

            <form id="formulario-conexion">
                <!-- Paso 1: Nombre -->
                <div class="step active" data-step="1">
                    <div class="step-indicator">
                        <span class="active"></span><span></span><span></span>
                    </div>
                    <label>¿Cómo te llamás? (o cómo te gustaría que te llame)</label>
                    <input type="text" name="nombre_persona" value="<?php echo esc_attr($nombre); ?>" required placeholder="Tu nombre...">

                    <label>¿Qué momento estás atravesando?</label>
                    <textarea name="momento_vida" placeholder="Un cambio, una búsqueda, algo que te pesa, algo que soñás..."></textarea>

                    <button type="button" class="btn" onclick="siguientePaso(2)">Continuar</button>
                </div>

                <!-- Paso 2: Necesidades -->
                <div class="step" data-step="2">
                    <div class="step-indicator">
                        <span class="active"></span><span class="active"></span><span></span>
                    </div>
                    <label>¿Qué necesitás en este momento? (elegí las que resuenen)</label>
                    <div class="options">
                        <label class="option"><input type="checkbox" name="necesidades[]" value="proteccion"><span>Protección</span></label>
                        <label class="option"><input type="checkbox" name="necesidades[]" value="claridad"><span>Claridad</span></label>
                        <label class="option"><input type="checkbox" name="necesidades[]" value="abundancia"><span>Abundancia</span></label>
                        <label class="option"><input type="checkbox" name="necesidades[]" value="sanacion"><span>Sanación</span></label>
                        <label class="option"><input type="checkbox" name="necesidades[]" value="amor"><span>Amor</span></label>
                        <label class="option"><input type="checkbox" name="necesidades[]" value="fuerza"><span>Fuerza</span></label>
                    </div>

                    <div class="buttons">
                        <button type="button" class="btn btn-secondary" onclick="anteriorPaso(1)">Atrás</button>
                        <button type="button" class="btn" onclick="siguientePaso(3)">Continuar</button>
                    </div>
                </div>

                <!-- Paso 3: Mensaje y confirmar -->
                <div class="step" data-step="3">
                    <div class="step-indicator">
                        <span class="active"></span><span class="active"></span><span class="active"></span>
                    </div>
                    <label>¿Hay algo más que tu guardián debería saber? (opcional)</label>
                    <p class="hint">Algo que no le contás a nadie, algo que te pesa, algo que soñás...</p>
                    <textarea name="mensaje_guardian" placeholder="Escribí lo que sientas..."></textarea>

                    <label class="option" style="margin-bottom: 25px;">
                        <input type="checkbox" name="confirma_mayor" required>
                        <span>Confirmo que soy mayor de 18 años</span>
                    </label>

                    <div class="buttons">
                        <button type="button" class="btn btn-secondary" onclick="anteriorPaso(2)">Atrás</button>
                        <button type="submit" class="btn" id="btn-enviar">Completar Conexión</button>
                    </div>
                </div>

                <!-- Éxito -->
                <div class="step" data-step="success">
                    <div class="success">
                        <h2>Conexión establecida</h2>
                        <p>
                            <?php echo esc_html($nombre_guardian); ?> ahora te conoce.<br>
                            Pronto recibirás su mensaje personal.
                        </p>
                    </div>
                </div>

                <input type="hidden" name="order_id" value="<?php echo esc_attr($order_id); ?>">
                <input type="hidden" name="action" value="duendes_guardar_form_conexion">
                <input type="hidden" name="nonce" value="<?php echo wp_create_nonce('duendes_form_conexion'); ?>">
            </form>
        </div>
    </div>

    <script>
    // Toggle opciones
    document.querySelectorAll('.option').forEach(opt => {
        opt.addEventListener('click', function() {
            const cb = this.querySelector('input[type="checkbox"]');
            if (cb) {
                cb.checked = !cb.checked;
                this.classList.toggle('selected', cb.checked);
            }
        });
    });

    function siguientePaso(n) {
        document.querySelectorAll('.step').forEach(s => s.classList.remove('active'));
        document.querySelector('.step[data-step="'+n+'"]').classList.add('active');
        window.scrollTo({top: 0, behavior: 'smooth'});
    }

    function anteriorPaso(n) {
        siguientePaso(n);
    }

    // Envío del formulario
    document.getElementById('formulario-conexion').addEventListener('submit', function(e) {
        e.preventDefault();

        const btn = document.getElementById('btn-enviar');
        const confirmaMayor = document.querySelector('[name="confirma_mayor"]');

        if (!confirmaMayor.checked) {
            alert('Debés confirmar que sos mayor de 18 años');
            return;
        }

        btn.textContent = 'Enviando...';
        btn.disabled = true;

        const formData = new FormData(this);

        fetch('<?php echo admin_url('admin-ajax.php'); ?>', {
            method: 'POST',
            body: formData
        })
        .then(r => r.json())
        .then(data => {
            if (data.success) {
                siguientePaso('success');
            } else {
                alert(data.data || 'Error al enviar. Intentá de nuevo.');
                btn.textContent = 'Completar Conexión';
                btn.disabled = false;
            }
        })
        .catch(err => {
            alert('Error de conexión. Intentá de nuevo.');
            btn.textContent = 'Completar Conexión';
            btn.disabled = false;
        });
    });
    </script>
</body>
</html>
    <?php
}

// =============================================================================
// AJAX HANDLER
// =============================================================================

add_action('wp_ajax_duendes_guardar_form_conexion', 'duendes_ajax_guardar_form');
add_action('wp_ajax_nopriv_duendes_guardar_form_conexion', 'duendes_ajax_guardar_form');

function duendes_ajax_guardar_form() {
    if (!wp_verify_nonce($_POST['nonce'] ?? '', 'duendes_form_conexion')) {
        wp_send_json_error('Sesión expirada. Recargá la página.');
    }

    $order_id = intval($_POST['order_id'] ?? 0);
    if (!$order_id) {
        wp_send_json_error('Orden inválida');
    }

    $order = wc_get_order($order_id);
    if (!$order) {
        wp_send_json_error('Orden no encontrada');
    }

    // Guardar datos
    $datos = [
        'fecha' => current_time('mysql'),
        'nombre' => sanitize_text_field($_POST['nombre_persona'] ?? ''),
        'momento' => sanitize_textarea_field($_POST['momento_vida'] ?? ''),
        'necesidades' => isset($_POST['necesidades']) ? array_map('sanitize_text_field', $_POST['necesidades']) : [],
        'mensaje' => sanitize_textarea_field($_POST['mensaje_guardian'] ?? ''),
    ];

    update_post_meta($order_id, '_duendes_datos_canalizacion', json_encode($datos, JSON_UNESCAPED_UNICODE));
    update_post_meta($order_id, '_duendes_formulario_completado', 'yes');

    // Disparar acción para otros plugins
    do_action('duendes_formulario_canalizacion_completado', $order_id);

    error_log("Duendes Form: Formulario completado para orden $order_id");

    wp_send_json_success(['mensaje' => 'Guardado correctamente']);
}

// =============================================================================
// FLUSH REWRITE RULES
// =============================================================================

register_activation_hook(__FILE__, function() {
    flush_rewrite_rules();
});
