<?php
/**
 * Plugin Name: Duendes - Pagina Formulario Canalizacion
 * Description: Pagina standalone para completar formulario de canalizacion
 * Version: 1.0
 * Author: Duendes del Uruguay
 */

if (!defined('ABSPATH')) exit;

// ═══════════════════════════════════════════════════════════════════════════
// INTERCEPTAR REQUEST - Detectar por URL directamente (mas robusto)
// ═══════════════════════════════════════════════════════════════════════════

add_action('template_redirect', function() {
    $uri = $_SERVER['REQUEST_URI'] ?? '';

    // Detectar si la URL contiene /formulario-canalizacion
    if (strpos($uri, 'formulario-canalizacion') === false) return;

    // Obtener order ID del parametro
    $order_id = isset($_GET['order']) ? intval($_GET['order']) : 0;

    // Mostrar pagina completa
    duendes_render_pagina_formulario($order_id);
    exit;
});

// ═══════════════════════════════════════════════════════════════════════════
// RENDER PAGINA COMPLETA
// ═══════════════════════════════════════════════════════════════════════════

function duendes_render_pagina_formulario($order_id) {
    // Validar order
    $order = $order_id ? wc_get_order($order_id) : null;
    $error = null;
    $datos_order = null;
    $tipo_destinatario = 'para_mi';
    $nombre_guardian = 'tu guardian';
    $ya_completado = false;

    if (!$order_id) {
        $error = 'No se especifico un numero de orden.';
    } elseif (!$order) {
        $error = 'Orden no encontrada. Verifica el numero de orden.';
    } else {
        // Verificar si ya completo el formulario
        $ya_completado = get_post_meta($order_id, '_duendes_formulario_completado', true) === 'yes';

        // Obtener tipo de destinatario
        $tipo_destinatario = get_post_meta($order_id, '_duendes_tipo_destinatario', true) ?: 'para_mi';

        // Obtener nombre del guardian
        foreach ($order->get_items() as $item) {
            $nombre_guardian = $item->get_name();
            break;
        }

        // Datos precargados del order
        $datos_order = [
            'nombre' => $order->get_billing_first_name(),
            'email' => $order->get_billing_email(),
            'telefono' => $order->get_billing_phone(),
        ];
    }

    ?>
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Formulario de Canalizacion - Duendes del Uruguay</title>
        <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600&family=Cormorant+Garamond:ital,wght@0,400;0,500;1,400&display=swap" rel="stylesheet">
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }

            body {
                background: #070906;
                color: #e8e0d0;
                font-family: 'Cormorant Garamond', Georgia, serif;
                min-height: 100vh;
                line-height: 1.7;
            }

            .page-container {
                max-width: 680px;
                margin: 0 auto;
                padding: 40px 20px;
            }

            /* Header */
            .form-header {
                text-align: center;
                margin-bottom: 40px;
            }

            .form-header h1 {
                font-family: 'Cinzel', serif;
                font-size: 28px;
                font-weight: 500;
                color: #B8973A;
                letter-spacing: 3px;
                margin-bottom: 15px;
            }

            .form-header p {
                color: rgba(232, 224, 208, 0.7);
                font-size: 18px;
                font-style: italic;
            }

            /* Card principal */
            .form-card {
                background: rgba(255, 255, 255, 0.03);
                border: 1px solid rgba(184, 151, 58, 0.3);
                border-radius: 16px;
                padding: 40px 35px;
            }

            /* Error */
            .error-msg {
                text-align: center;
                padding: 60px 30px;
            }

            .error-msg h2 {
                font-family: 'Cinzel', serif;
                color: #B8973A;
                font-size: 22px;
                margin-bottom: 15px;
            }

            .error-msg p {
                color: rgba(232, 224, 208, 0.6);
            }

            /* Completado */
            .completado-msg {
                text-align: center;
                padding: 60px 30px;
            }

            .completado-msg h2 {
                font-family: 'Cinzel', serif;
                color: #B8973A;
                font-size: 24px;
                margin-bottom: 15px;
            }

            .completado-msg p {
                color: rgba(232, 224, 208, 0.7);
                font-size: 17px;
            }

            /* Formulario */
            .form-section {
                margin-bottom: 30px;
            }

            .form-section-title {
                font-family: 'Cinzel', serif;
                font-size: 16px;
                color: #B8973A;
                letter-spacing: 1px;
                margin-bottom: 20px;
                padding-bottom: 10px;
                border-bottom: 1px solid rgba(184, 151, 58, 0.2);
            }

            .form-group {
                margin-bottom: 22px;
            }

            .form-group label {
                display: block;
                font-family: 'Cinzel', serif;
                font-size: 13px;
                color: #B8973A;
                letter-spacing: 0.5px;
                margin-bottom: 8px;
            }

            .form-group label .optional {
                color: rgba(232, 224, 208, 0.4);
                font-family: 'Cormorant Garamond', serif;
                font-style: italic;
            }

            .form-group input[type="text"],
            .form-group input[type="email"],
            .form-group input[type="date"],
            .form-group textarea,
            .form-group select {
                width: 100%;
                padding: 14px 18px;
                background: rgba(255, 255, 255, 0.05);
                border: 1px solid rgba(184, 151, 58, 0.3);
                border-radius: 10px;
                color: #e8e0d0;
                font-family: 'Cormorant Garamond', serif;
                font-size: 16px;
                transition: all 0.3s;
            }

            .form-group input:focus,
            .form-group textarea:focus,
            .form-group select:focus {
                outline: none;
                border-color: #B8973A;
                box-shadow: 0 0 15px rgba(184, 151, 58, 0.2);
            }

            .form-group input::placeholder,
            .form-group textarea::placeholder {
                color: rgba(232, 224, 208, 0.35);
            }

            .form-group textarea {
                min-height: 100px;
                resize: vertical;
            }

            .form-group select {
                cursor: pointer;
            }

            .form-group select option {
                background: #1a1a1a;
                color: #e8e0d0;
            }

            /* Checkboxes grid */
            .checkbox-grid {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 10px;
            }

            @media (max-width: 500px) {
                .checkbox-grid {
                    grid-template-columns: 1fr;
                }
            }

            .checkbox-option {
                display: flex;
                align-items: center;
                gap: 10px;
                padding: 12px 15px;
                background: rgba(255, 255, 255, 0.03);
                border: 1px solid rgba(184, 151, 58, 0.25);
                border-radius: 8px;
                cursor: pointer;
                transition: all 0.3s;
            }

            .checkbox-option:hover,
            .checkbox-option:has(input:checked) {
                border-color: #B8973A;
                background: rgba(184, 151, 58, 0.1);
            }

            .checkbox-option input {
                width: 18px;
                height: 18px;
                accent-color: #B8973A;
            }

            .checkbox-option span {
                font-size: 14px;
                color: #e8e0d0;
            }

            /* Radio options */
            .radio-grid {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: 10px;
            }

            @media (max-width: 500px) {
                .radio-grid {
                    grid-template-columns: repeat(2, 1fr);
                }
            }

            .radio-option {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
                padding: 12px;
                background: rgba(255, 255, 255, 0.03);
                border: 1px solid rgba(184, 151, 58, 0.25);
                border-radius: 8px;
                cursor: pointer;
                transition: all 0.3s;
            }

            .radio-option:hover,
            .radio-option:has(input:checked) {
                border-color: #B8973A;
                background: rgba(184, 151, 58, 0.1);
            }

            .radio-option input {
                width: 16px;
                height: 16px;
                accent-color: #B8973A;
            }

            /* Conditional section */
            .conditional-section {
                display: none;
                padding: 20px;
                margin: 20px 0;
                background: rgba(184, 151, 58, 0.05);
                border: 1px solid rgba(184, 151, 58, 0.2);
                border-radius: 12px;
            }

            .conditional-section.active {
                display: block;
            }

            .conditional-section h4 {
                font-family: 'Cinzel', serif;
                font-size: 14px;
                color: #B8973A;
                margin-bottom: 15px;
            }

            /* Submit button */
            .submit-btn {
                display: block;
                width: 100%;
                padding: 16px 40px;
                background: linear-gradient(135deg, #B8973A 0%, #8b6914 100%);
                border: none;
                border-radius: 30px;
                color: #070906;
                font-family: 'Cinzel', serif;
                font-size: 14px;
                font-weight: 600;
                letter-spacing: 2px;
                text-transform: uppercase;
                cursor: pointer;
                transition: all 0.3s;
                margin-top: 30px;
            }

            .submit-btn:hover {
                background: linear-gradient(135deg, #c9a227 0%, #B8973A 100%);
                box-shadow: 0 0 25px rgba(184, 151, 58, 0.4);
            }

            .submit-btn:disabled {
                opacity: 0.6;
                cursor: not-allowed;
            }

            /* Nota de privacidad */
            .privacy-note {
                text-align: center;
                margin-top: 25px;
                padding-top: 20px;
                border-top: 1px solid rgba(184, 151, 58, 0.15);
            }

            .privacy-note p {
                font-size: 13px;
                color: rgba(232, 224, 208, 0.4);
                font-style: italic;
            }

            /* Ornamento */
            .ornament {
                text-align: center;
                margin: 30px 0;
                color: rgba(184, 151, 58, 0.3);
                font-size: 20px;
                letter-spacing: 10px;
            }

            /* Success message */
            .success-msg {
                display: none;
                text-align: center;
                padding: 50px 20px;
            }

            .success-msg.active {
                display: block;
            }

            .success-msg h2 {
                font-family: 'Cinzel', serif;
                color: #B8973A;
                font-size: 26px;
                margin-bottom: 20px;
            }

            .success-msg p {
                color: rgba(232, 224, 208, 0.7);
                font-size: 17px;
                line-height: 1.8;
            }

            /* Hide form when success */
            .form-content.hidden {
                display: none;
            }
        </style>
    </head>
    <body>
        <div class="page-container">
            <div class="form-header">
                <h1>Formulario de Canalizacion</h1>
                <p>Completa este formulario para que tu guardian pueda conocerte</p>
            </div>

            <div class="form-card">
                <?php if ($error): ?>
                    <div class="error-msg">
                        <h2>Algo no esta bien</h2>
                        <p><?php echo esc_html($error); ?></p>
                    </div>
                <?php elseif ($ya_completado): ?>
                    <div class="completado-msg">
                        <h2>Conexion ya establecida</h2>
                        <p>Ya completaste este formulario. Tu guardian te conoce y pronto recibiras su mensaje personal.</p>
                    </div>
                <?php else: ?>
                    <div class="success-msg" id="success-msg">
                        <h2>Conexion establecida</h2>
                        <p>
                            Tu guardian ahora te conoce.<br>
                            Pronto recibiras su mensaje personal.
                        </p>
                        <div class="ornament">* * *</div>
                    </div>

                    <div class="form-content" id="form-content">
                        <form id="canalizacion-form">
                            <input type="hidden" name="order_id" value="<?php echo esc_attr($order_id); ?>">
                            <input type="hidden" name="tipo_destinatario" value="<?php echo esc_attr($tipo_destinatario); ?>">
                            <input type="hidden" name="action" value="duendes_guardar_formulario_standalone">
                            <input type="hidden" name="nonce" value="<?php echo wp_create_nonce('duendes_formulario_standalone'); ?>">

                            <!-- Guardian info -->
                            <div style="text-align:center;margin-bottom:30px;padding:20px;background:rgba(184,151,58,0.08);border-radius:12px;">
                                <p style="color:rgba(232,224,208,0.6);font-size:14px;margin-bottom:5px;">Guardian seleccionado</p>
                                <p style="font-family:'Cinzel',serif;font-size:20px;color:#B8973A;letter-spacing:2px;"><?php echo esc_html($nombre_guardian); ?></p>
                            </div>

                            <!-- Seccion: Datos personales -->
                            <div class="form-section">
                                <h3 class="form-section-title">Tus datos</h3>

                                <div class="form-group">
                                    <label>Como te llamas? (o como te gustaria que te llame)</label>
                                    <input type="text" name="nombre" required value="<?php echo esc_attr($datos_order['nombre'] ?? ''); ?>" placeholder="Tu nombre o apodo...">
                                </div>

                                <div class="form-group">
                                    <label>Fecha de nacimiento <span class="optional">(opcional)</span></label>
                                    <input type="date" name="fecha_nacimiento">
                                </div>
                            </div>

                            <!-- Seccion: Momento de vida -->
                            <div class="form-section">
                                <h3 class="form-section-title">Tu momento</h3>

                                <div class="form-group">
                                    <label>Que momento de tu vida estas atravesando?</label>
                                    <textarea name="momento_vida" placeholder="Un cambio, una perdida, un nuevo comienzo, una busqueda..."></textarea>
                                </div>
                            </div>

                            <!-- Seccion: Para quien -->
                            <div class="form-section">
                                <h3 class="form-section-title">Para quien es?</h3>

                                <div class="form-group">
                                    <div class="radio-grid" style="grid-template-columns: 1fr 1fr;">
                                        <label class="radio-option">
                                            <input type="radio" name="para_quien" value="para_mi" checked>
                                            <span>Para mi</span>
                                        </label>
                                        <label class="radio-option">
                                            <input type="radio" name="para_quien" value="para_regalar">
                                            <span>Para regalar</span>
                                        </label>
                                    </div>
                                </div>

                                <!-- Condicional: Para regalar -->
                                <div class="conditional-section" id="section-regalo">
                                    <h4>Datos de la persona que lo recibira</h4>

                                    <div class="form-group">
                                        <label>Nombre de la persona</label>
                                        <input type="text" name="nombre_destinatario" placeholder="Como se llama?">
                                    </div>

                                    <div class="form-group">
                                        <label>Tu relacion con ella/el</label>
                                        <select name="relacion_destinatario">
                                            <option value="">Seleccionar...</option>
                                            <option value="pareja">Pareja</option>
                                            <option value="mama">Mama</option>
                                            <option value="papa">Papa</option>
                                            <option value="hermana">Hermana/o</option>
                                            <option value="hija">Hija/o</option>
                                            <option value="amiga">Amiga/o</option>
                                            <option value="otro">Otro</option>
                                        </select>
                                    </div>

                                    <div class="form-group">
                                        <label>Que momento esta atravesando? <span class="optional">(opcional)</span></label>
                                        <textarea name="momento_destinatario" placeholder="Si sabes algo sobre su situacion actual..."></textarea>
                                    </div>
                                </div>
                            </div>

                            <!-- Seccion: Que necesitas -->
                            <div class="form-section">
                                <h3 class="form-section-title">Que necesitas?</h3>

                                <div class="form-group">
                                    <label>Que esperas recibir de tu guardian? <span class="optional">(podes elegir varios)</span></label>
                                    <div class="checkbox-grid">
                                        <label class="checkbox-option">
                                            <input type="checkbox" name="expectativas[]" value="proteccion">
                                            <span>Proteccion</span>
                                        </label>
                                        <label class="checkbox-option">
                                            <input type="checkbox" name="expectativas[]" value="claridad">
                                            <span>Claridad</span>
                                        </label>
                                        <label class="checkbox-option">
                                            <input type="checkbox" name="expectativas[]" value="abundancia">
                                            <span>Abundancia</span>
                                        </label>
                                        <label class="checkbox-option">
                                            <input type="checkbox" name="expectativas[]" value="sanacion">
                                            <span>Sanacion</span>
                                        </label>
                                        <label class="checkbox-option">
                                            <input type="checkbox" name="expectativas[]" value="amor">
                                            <span>Amor</span>
                                        </label>
                                        <label class="checkbox-option">
                                            <input type="checkbox" name="expectativas[]" value="fuerza">
                                            <span>Fuerza</span>
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <!-- Seccion: Guardianes existentes -->
                            <div class="form-section">
                                <h3 class="form-section-title">Tu conexion con los guardianes</h3>

                                <div class="form-group">
                                    <label>Tenes otros guardianes? <span class="optional">(opcional)</span></label>
                                    <textarea name="guardianes_existentes" placeholder="Contanos si ya tenes otros duendes, cuales son, como te fue con ellos..."></textarea>
                                </div>
                            </div>

                            <!-- Seccion: Mensaje adicional -->
                            <div class="form-section">
                                <h3 class="form-section-title">Algo mas?</h3>

                                <div class="form-group">
                                    <label>Hay algo que tu guardian deberia saber? <span class="optional">(opcional)</span></label>
                                    <textarea name="notas_adicionales" placeholder="Algo que no le contas a nadie, algo que te pesa, algo que sonas..."></textarea>
                                </div>
                            </div>

                            <button type="submit" class="submit-btn" id="submit-btn">
                                Completar mi conexion
                            </button>

                            <div class="privacy-note">
                                <p>Tu informacion es confidencial y solo sera usada para personalizar tu canalizacion.</p>
                            </div>
                        </form>
                    </div>
                <?php endif; ?>
            </div>

            <div class="ornament">* * *</div>
        </div>

        <script>
        document.addEventListener('DOMContentLoaded', function() {
            // Toggle seccion regalo
            document.querySelectorAll('[name="para_quien"]').forEach(function(radio) {
                radio.addEventListener('change', function() {
                    var seccionRegalo = document.getElementById('section-regalo');
                    if (this.value === 'para_regalar') {
                        seccionRegalo.classList.add('active');
                    } else {
                        seccionRegalo.classList.remove('active');
                    }
                });
            });

            // Submit form
            var form = document.getElementById('canalizacion-form');
            if (form) {
                form.addEventListener('submit', function(e) {
                    e.preventDefault();

                    var btn = document.getElementById('submit-btn');
                    btn.disabled = true;
                    btn.textContent = 'Enviando...';

                    var formData = new FormData(form);

                    // Convertir checkboxes a JSON
                    var expectativas = [];
                    form.querySelectorAll('[name="expectativas[]"]:checked').forEach(function(cb) {
                        expectativas.push(cb.value);
                    });
                    formData.set('expectativas', JSON.stringify(expectativas));

                    fetch('<?php echo admin_url('admin-ajax.php'); ?>', {
                        method: 'POST',
                        body: formData
                    })
                    .then(function(response) { return response.json(); })
                    .then(function(data) {
                        if (data.success) {
                            document.getElementById('form-content').classList.add('hidden');
                            document.getElementById('success-msg').classList.add('active');
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                        } else {
                            alert(data.data || 'Error al enviar el formulario');
                            btn.disabled = false;
                            btn.textContent = 'Completar mi conexion';
                        }
                    })
                    .catch(function(error) {
                        alert('Error de conexion. Intenta nuevamente.');
                        btn.disabled = false;
                        btn.textContent = 'Completar mi conexion';
                    });
                });
            }
        });
        </script>
    </body>
    </html>
    <?php
}

// ═══════════════════════════════════════════════════════════════════════════
// AJAX HANDLER PARA GUARDAR
// ═══════════════════════════════════════════════════════════════════════════

add_action('wp_ajax_duendes_guardar_formulario_standalone', 'duendes_ajax_guardar_formulario_standalone');
add_action('wp_ajax_nopriv_duendes_guardar_formulario_standalone', 'duendes_ajax_guardar_formulario_standalone');

function duendes_ajax_guardar_formulario_standalone() {
    // Verificar nonce
    if (!wp_verify_nonce($_POST['nonce'] ?? '', 'duendes_formulario_standalone')) {
        wp_send_json_error('Sesion expirada. Recarga la pagina.');
    }

    $order_id = intval($_POST['order_id'] ?? 0);
    if (!$order_id) {
        wp_send_json_error('Orden invalida');
    }

    $order = wc_get_order($order_id);
    if (!$order) {
        wp_send_json_error('Orden no encontrada');
    }

    // Recopilar todos los datos
    $datos = [
        'fecha' => current_time('mysql'),
        'tipo_destinatario' => sanitize_text_field($_POST['tipo_destinatario'] ?? 'para_mi'),
        'nombre' => sanitize_text_field($_POST['nombre'] ?? ''),
        'fecha_nacimiento' => sanitize_text_field($_POST['fecha_nacimiento'] ?? ''),
        'momento_vida' => sanitize_textarea_field($_POST['momento_vida'] ?? ''),
        'para_quien' => sanitize_text_field($_POST['para_quien'] ?? 'para_mi'),
        'expectativas' => json_decode(stripslashes($_POST['expectativas'] ?? '[]'), true),
        'guardianes_existentes' => sanitize_textarea_field($_POST['guardianes_existentes'] ?? ''),
        'notas_adicionales' => sanitize_textarea_field($_POST['notas_adicionales'] ?? ''),
    ];

    // Si es para regalar, agregar datos del destinatario
    if ($datos['para_quien'] === 'para_regalar') {
        $datos['destinatario'] = [
            'nombre' => sanitize_text_field($_POST['nombre_destinatario'] ?? ''),
            'relacion' => sanitize_text_field($_POST['relacion_destinatario'] ?? ''),
            'momento' => sanitize_textarea_field($_POST['momento_destinatario'] ?? ''),
        ];
    }

    // Guardar en order meta
    update_post_meta($order_id, '_duendes_datos_canalizacion', json_encode($datos, JSON_UNESCAPED_UNICODE));
    update_post_meta($order_id, '_duendes_formulario_completado', 'yes');

    // Obtener nombre del guardian
    $nombre_guardian = 'Guardian';
    foreach ($order->get_items() as $item) {
        $nombre_guardian = $item->get_name();
        break;
    }

    // Enviar email de notificacion
    duendes_enviar_email_notificacion_formulario($order_id, $order, $datos, $nombre_guardian);

    wp_send_json_success(['mensaje' => 'Formulario guardado correctamente']);
}

// ═══════════════════════════════════════════════════════════════════════════
// ENVIAR EMAIL DE NOTIFICACION
// ═══════════════════════════════════════════════════════════════════════════

function duendes_enviar_email_notificacion_formulario($order_id, $order, $datos, $nombre_guardian) {
    $to = 'tbrylka89@gmail.com';
    $subject = "Formulario de Canalizacion Completado - Orden #{$order_id}";

    // Formatear expectativas
    $expectativas_texto = !empty($datos['expectativas']) ? implode(', ', $datos['expectativas']) : 'No especificado';

    $html = '
    <div style="max-width:600px;margin:0 auto;font-family:Georgia,serif;background:#0a0a0a;color:#fff;padding:30px;">
        <h1 style="color:#c9a227;font-size:22px;margin:0 0 20px;border-bottom:1px solid rgba(201,162,39,0.3);padding-bottom:15px;">
            Nuevo Formulario de Canalizacion
        </h1>

        <div style="background:rgba(201,162,39,0.1);padding:15px;border-radius:8px;margin-bottom:20px;">
            <p style="margin:0;color:#c9a227;">Orden #' . $order_id . ' - ' . esc_html($nombre_guardian) . '</p>
        </div>

        <h3 style="color:#c9a227;font-size:16px;margin:25px 0 10px;">Datos del cliente</h3>
        <table style="width:100%;color:rgba(255,255,255,0.8);font-size:14px;">
            <tr>
                <td style="padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.1);"><strong>Nombre:</strong></td>
                <td style="padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.1);">' . esc_html($datos['nombre']) . '</td>
            </tr>
            <tr>
                <td style="padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.1);"><strong>Email:</strong></td>
                <td style="padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.1);">' . esc_html($order->get_billing_email()) . '</td>
            </tr>
            <tr>
                <td style="padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.1);"><strong>Fecha nacimiento:</strong></td>
                <td style="padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.1);">' . esc_html($datos['fecha_nacimiento'] ?: 'No especificado') . '</td>
            </tr>
            <tr>
                <td style="padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.1);"><strong>Para quien:</strong></td>
                <td style="padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.1);">' . esc_html($datos['para_quien'] === 'para_mi' ? 'Para si mismo/a' : 'Para regalar') . '</td>
            </tr>
        </table>

        <h3 style="color:#c9a227;font-size:16px;margin:25px 0 10px;">Momento de vida</h3>
        <div style="background:rgba(255,255,255,0.05);padding:15px;border-radius:8px;color:rgba(255,255,255,0.8);">
            ' . nl2br(esc_html($datos['momento_vida'] ?: 'No especificado')) . '
        </div>

        <h3 style="color:#c9a227;font-size:16px;margin:25px 0 10px;">Expectativas</h3>
        <p style="color:rgba(255,255,255,0.8);">' . esc_html($expectativas_texto) . '</p>

        <h3 style="color:#c9a227;font-size:16px;margin:25px 0 10px;">Guardianes existentes</h3>
        <div style="background:rgba(255,255,255,0.05);padding:15px;border-radius:8px;color:rgba(255,255,255,0.8);">
            ' . nl2br(esc_html($datos['guardianes_existentes'] ?: 'No tiene')) . '
        </div>

        <h3 style="color:#c9a227;font-size:16px;margin:25px 0 10px;">Notas adicionales</h3>
        <div style="background:rgba(255,255,255,0.05);padding:15px;border-radius:8px;color:rgba(255,255,255,0.8);">
            ' . nl2br(esc_html($datos['notas_adicionales'] ?: 'Sin notas adicionales')) . '
        </div>';

    // Si es para regalar, agregar datos del destinatario
    if (!empty($datos['destinatario'])) {
        $html .= '
        <h3 style="color:#c9a227;font-size:16px;margin:25px 0 10px;">Datos del destinatario (regalo)</h3>
        <table style="width:100%;color:rgba(255,255,255,0.8);font-size:14px;">
            <tr>
                <td style="padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.1);"><strong>Nombre:</strong></td>
                <td style="padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.1);">' . esc_html($datos['destinatario']['nombre']) . '</td>
            </tr>
            <tr>
                <td style="padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.1);"><strong>Relacion:</strong></td>
                <td style="padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.1);">' . esc_html($datos['destinatario']['relacion']) . '</td>
            </tr>
        </table>
        <div style="background:rgba(255,255,255,0.05);padding:15px;border-radius:8px;color:rgba(255,255,255,0.8);margin-top:10px;">
            <strong>Su momento:</strong><br>
            ' . nl2br(esc_html($datos['destinatario']['momento'] ?: 'No especificado')) . '
        </div>';
    }

    $html .= '
        <p style="color:rgba(255,255,255,0.4);font-size:12px;margin-top:30px;padding-top:20px;border-top:1px solid rgba(255,255,255,0.1);text-align:center;">
            Formulario completado el ' . current_time('d/m/Y H:i') . '
        </p>
    </div>';

    // Headers
    $headers = [
        'Content-Type: text/html; charset=UTF-8',
        'From: Duendes del Uruguay <hola@duendesdeluruguay.com>',
    ];

    // Intentar enviar con wp_mail
    $sent = wp_mail($to, $subject, $html, $headers);

    // Si wp_mail falla, intentar con Resend
    if (!$sent && defined('DUENDES_RESEND_API_KEY')) {
        $response = wp_remote_post('https://api.resend.com/emails', [
            'headers' => [
                'Authorization' => 'Bearer ' . DUENDES_RESEND_API_KEY,
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
    }
}
