<?php
/**
 * Plugin Name: Duendes - Formulario de Canalización
 * Description: Sistema de formulario para canalizaciones con 4 vías
 * Version: 1.0
 * Author: Duendes del Uruguay
 */

if (!defined('ABSPATH')) exit;

// ═══════════════════════════════════════════════════════════════════════════
// CONFIGURACIÓN RESEND
// ═══════════════════════════════════════════════════════════════════════════

define('DUENDES_RESEND_API_KEY', 're_Gp1e1MvT_MvQdCA8humB5zMdSFxkka3hz');
define('DUENDES_EMAIL_FROM', 'Duendes del Uruguay <hola@duendesdeluruguay.com>');

/**
 * Enviar email usando Resend API
 */
function duendes_enviar_email_resend($to, $subject, $html, $from = null) {
    $from = $from ?: DUENDES_EMAIL_FROM;

    $response = wp_remote_post('https://api.resend.com/emails', [
        'headers' => [
            'Authorization' => 'Bearer ' . DUENDES_RESEND_API_KEY,
            'Content-Type' => 'application/json',
        ],
        'body' => json_encode([
            'from' => $from,
            'to' => [$to],
            'subject' => $subject,
            'html' => $html,
        ]),
        'timeout' => 30,
    ]);

    if (is_wp_error($response)) {
        return ['success' => false, 'error' => $response->get_error_message()];
    }

    $body = json_decode(wp_remote_retrieve_body($response), true);
    $code = wp_remote_retrieve_response_code($response);

    if ($code === 200 || $code === 201) {
        return ['success' => true, 'id' => $body['id'] ?? null];
    }

    return ['success' => false, 'error' => $body['message'] ?? 'Error desconocido'];
}

// ═══════════════════════════════════════════════════════════════════════════
// TEST EMAIL
// ═══════════════════════════════════════════════════════════════════════════

add_action('wp_ajax_duendes_test_email_canalizacion', 'duendes_test_email_canalizacion');
add_action('wp_ajax_nopriv_duendes_test_email_canalizacion', 'duendes_test_email_canalizacion');

function duendes_test_email_canalizacion() {
    if (($_GET['token'] ?? '') !== 'duendes2026secreto') {
        wp_send_json_error('No autorizado');
    }

    $email = sanitize_email($_GET['email'] ?? 'tbrylka89@gmail.com');
    $nombre = sanitize_text_field($_GET['nombre'] ?? 'Thibisay');

    $link = home_url('/mi-conexion/?duendes_form=PRUEBA123&order=999');
    $asunto = "Alguien te regaló una experiencia mágica";

    $html = '
    <div style="max-width:600px;margin:0 auto;background:#0a0a0a;color:#fff;font-family:Georgia,serif;padding:40px;">
        <div style="text-align:center;margin-bottom:30px;">
            <h1 style="color:#c9a227;font-size:28px;margin:0 0 10px;">Hola ' . esc_html($nombre) . '</h1>
            <p style="color:rgba(255,255,255,0.7);font-size:18px;margin:0;font-style:italic;">Alguien que te quiere te regaló algo especial.</p>
        </div>
        <div style="background:rgba(201,162,39,0.1);border-left:3px solid #c9a227;padding:20px;margin:25px 0;">
            <p style="color:rgba(255,255,255,0.8);font-size:16px;margin:0;font-style:italic;">"Este es un email de PRUEBA del sistema de canalización."</p>
        </div>
        <p style="color:rgba(255,255,255,0.8);font-size:16px;line-height:1.7;">Un guardián está esperando conocerte.</p>
        <div style="text-align:center;margin:35px 0;">
            <a href="' . esc_url($link) . '" style="display:inline-block;background:linear-gradient(135deg,#c9a227,#8b6914);color:#0a0a0a;text-decoration:none;padding:16px 40px;border-radius:25px;font-size:14px;font-weight:bold;">COMPLETAR MI CONEXIÓN</a>
        </div>
        <p style="color:rgba(255,255,255,0.4);font-size:12px;text-align:center;margin-top:30px;">EMAIL DE PRUEBA via Resend - ' . date('d/m/Y H:i') . '</p>
    </div>';

    $result = duendes_enviar_email_resend($email, $asunto, $html);

    if ($result['success']) {
        wp_send_json_success('Email enviado a ' . $email . ' (ID: ' . $result['id'] . ')');
    } else {
        wp_send_json_error('Error: ' . $result['error']);
    }
}

// ═══════════════════════════════════════════════════════════════════════════
// PARTE 1: PREGUNTA DE SEGMENTACIÓN EN CHECKOUT
// ═══════════════════════════════════════════════════════════════════════════

add_action('woocommerce_after_order_notes', 'duendes_mostrar_pregunta_destinatario');

function duendes_mostrar_pregunta_destinatario($checkout) {
    ?>
    <div id="duendes-destinatario-section" style="margin:30px 0;background:linear-gradient(145deg,#0a0a0a,#1a1a1a);border:1px solid rgba(201,162,39,0.3);border-radius:16px;padding:30px;">
        <h3 style="color:#c9a227;margin:0 0 8px;font-family:'Cinzel',serif;font-size:18px;font-weight:500;letter-spacing:1px;text-align:center;">
            ¿Quién recibirá la magia de este guardián?
        </h3>
        <p style="color:rgba(255,255,255,0.6);font-size:14px;text-align:center;margin:0 0 20px;font-family:'Cormorant Garamond',serif;">
            Esto nos ayuda a personalizar la experiencia
        </p>

        <div style="display:flex;flex-direction:column;gap:12px;">
            <?php
            $opciones = [
                'para_mi' => ['Soy yo', 'este guardián viene a acompañarme'],
                'regalo_sabe' => ['Es un regalo', 'y la persona lo sabe'],
                'regalo_sorpresa' => ['Es un regalo sorpresa', 'quiero que sea inesperado'],
                'para_nino' => ['Es para un niño/a', 'menor de 18 años'],
            ];

            foreach ($opciones as $valor => $textos):
            ?>
            <label class="duendes-opcion-destinatario" style="display:flex;align-items:center;gap:15px;padding:15px 20px;background:rgba(201,162,39,0.05);border:1px solid rgba(201,162,39,0.2);border-radius:12px;cursor:pointer;transition:all 0.3s;">
                <input type="radio" name="duendes_tipo_destinatario" value="<?php echo esc_attr($valor); ?>" style="width:20px;height:20px;accent-color:#c9a227;" <?php echo $valor === 'para_mi' ? 'checked' : ''; ?>>
                <div>
                    <span style="display:block;color:#fff;font-family:'Cinzel',serif;font-size:14px;font-weight:500;"><?php echo esc_html($textos[0]); ?></span>
                    <span style="display:block;color:rgba(255,255,255,0.5);font-family:'Cormorant Garamond',serif;font-size:13px;font-style:italic;"><?php echo esc_html($textos[1]); ?></span>
                </div>
            </label>
            <?php endforeach; ?>
        </div>
    </div>

    <style>
    .duendes-opcion-destinatario:hover,
    .duendes-opcion-destinatario:has(input:checked) {
        border-color: #c9a227 !important;
        background: rgba(201,162,39,0.15) !important;
        box-shadow: 0 0 15px rgba(201,162,39,0.2);
    }
    </style>
    <?php
}

// Guardar en order meta
add_action('woocommerce_checkout_update_order_meta', 'duendes_guardar_tipo_destinatario');

function duendes_guardar_tipo_destinatario($order_id) {
    if (!empty($_POST['duendes_tipo_destinatario'])) {
        $tipo = sanitize_text_field($_POST['duendes_tipo_destinatario']);
        $tipos_validos = ['para_mi', 'regalo_sabe', 'regalo_sorpresa', 'para_nino'];
        if (in_array($tipo, $tipos_validos)) {
            update_post_meta($order_id, '_duendes_tipo_destinatario', $tipo);
            update_post_meta($order_id, '_duendes_formulario_completado', 'no');
        }
    }
}

// ═══════════════════════════════════════════════════════════════════════════
// PARTE 2: FORMULARIO EN THANK YOU PAGE
// ═══════════════════════════════════════════════════════════════════════════

add_action('woocommerce_thankyou', 'duendes_mostrar_formulario_canalizacion', 5);

function duendes_mostrar_formulario_canalizacion($order_id) {
    if (!$order_id) return;

    $tipo = get_post_meta($order_id, '_duendes_tipo_destinatario', true);
    if (!$tipo) $tipo = 'para_mi';

    $completado = get_post_meta($order_id, '_duendes_formulario_completado', true);
    if ($completado === 'yes') {
        duendes_mostrar_mensaje_completado();
        return;
    }

    // Obtener nombre del guardián de la orden
    $order = wc_get_order($order_id);
    $nombre_guardian = 'Tu guardián';
    foreach ($order->get_items() as $item) {
        $nombre_guardian = $item->get_name();
        break;
    }

    // Mostrar mensaje y formulario según tipo
    switch ($tipo) {
        case 'para_mi':
            duendes_formulario_para_mi($order_id, $nombre_guardian);
            break;
        case 'regalo_sabe':
            duendes_formulario_regalo_sabe($order_id, $nombre_guardian);
            break;
        case 'regalo_sorpresa':
            duendes_formulario_regalo_sorpresa($order_id, $nombre_guardian);
            break;
        case 'para_nino':
            duendes_formulario_para_nino($order_id, $nombre_guardian);
            break;
    }
}

// ═══════════════════════════════════════════════════════════════════════════
// VÍA 1: PARA MÍ
// ═══════════════════════════════════════════════════════════════════════════

function duendes_formulario_para_mi($order_id, $nombre_guardian) {
    ?>
    <div id="duendes-canalizacion-form" style="margin:30px 0;background:linear-gradient(145deg,#0a0a0a,#1a1a1a);border:1px solid rgba(201,162,39,0.3);border-radius:20px;padding:40px;text-align:center;">
        <div style="position:relative;">
            <div style="position:absolute;top:-40px;left:0;right:0;height:2px;background:linear-gradient(90deg,transparent,#c9a227,transparent);"></div>
        </div>

        <h2 style="color:#c9a227;margin:0 0 10px;font-family:'Cinzel',serif;font-size:24px;font-weight:500;letter-spacing:2px;">
            <?php echo esc_html($nombre_guardian); ?> ya es tuyo
        </h2>
        <p style="color:rgba(255,255,255,0.7);font-size:16px;margin:0 0 30px;font-family:'Cormorant Garamond',serif;font-style:italic;">
            Ahora falta lo más importante: que se conozcan.
        </p>

        <!-- Pantallas del formulario -->
        <div id="duendes-pantallas" data-pantalla="1">

            <!-- Pantalla 1 -->
            <div class="duendes-pantalla" data-num="1" style="display:block;">
                <p style="color:rgba(255,255,255,0.6);font-size:15px;margin:0 0 25px;font-family:'Cormorant Garamond',serif;">
                    Tu guardián quiere conocerte. No hay respuestas correctas - solo tu verdad.
                </p>

                <div style="text-align:left;margin-bottom:20px;">
                    <label style="display:block;color:#c9a227;font-family:'Cinzel',serif;font-size:13px;margin-bottom:8px;">¿Cómo te llamás? (o cómo te gustaría que te llame)</label>
                    <input type="text" name="nombre_persona" required style="width:100%;padding:14px 18px;background:rgba(0,0,0,0.4);border:1px solid rgba(201,162,39,0.3);border-radius:10px;color:#fff;font-family:'Cormorant Garamond',serif;font-size:16px;">
                </div>

                <div style="text-align:left;margin-bottom:25px;">
                    <label style="display:block;color:#c9a227;font-family:'Cinzel',serif;font-size:13px;margin-bottom:8px;">¿Qué momento de tu vida estás atravesando?</label>
                    <textarea name="momento_vida" rows="3" placeholder="Un cambio, una pérdida, un nuevo comienzo, una búsqueda..." style="width:100%;padding:14px 18px;background:rgba(0,0,0,0.4);border:1px solid rgba(201,162,39,0.3);border-radius:10px;color:#fff;font-family:'Cormorant Garamond',serif;font-size:16px;resize:none;"></textarea>
                </div>

                <button type="button" onclick="duendesSiguiente(2)" style="background:linear-gradient(135deg,#c9a227,#8b6914);color:#0a0a0a;border:none;padding:14px 40px;border-radius:25px;font-family:'Cinzel',serif;font-size:13px;font-weight:600;letter-spacing:1.5px;text-transform:uppercase;cursor:pointer;">
                    Continuar
                </button>
            </div>

            <!-- Pantalla 2 -->
            <div class="duendes-pantalla" data-num="2" style="display:none;">
                <p style="color:rgba(255,255,255,0.6);font-size:15px;margin:0 0 25px;font-family:'Cormorant Garamond',serif;">
                    A veces lo que más necesitamos es lo que más nos cuesta pedir.
                </p>

                <div style="text-align:left;margin-bottom:25px;">
                    <label style="display:block;color:#c9a227;font-family:'Cinzel',serif;font-size:13px;margin-bottom:12px;">¿Qué necesitás en este momento? (podés elegir varios)</label>

                    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
                        <?php
                        $necesidades = [
                            'proteccion' => 'Protección / Sentirme segura',
                            'claridad' => 'Claridad / Saber qué hacer',
                            'abundancia' => 'Abundancia / Desbloquear lo que merezco',
                            'sanacion' => 'Sanación / Soltar lo que me pesa',
                            'amor' => 'Amor / Conexión genuina',
                            'fuerza' => 'Fuerza / Seguir adelante',
                        ];
                        foreach ($necesidades as $val => $texto):
                        ?>
                        <label style="display:flex;align-items:center;gap:10px;padding:12px;background:rgba(201,162,39,0.05);border:1px solid rgba(201,162,39,0.2);border-radius:8px;cursor:pointer;transition:all 0.3s;" class="duendes-necesidad-opt">
                            <input type="checkbox" name="necesidades[]" value="<?php echo esc_attr($val); ?>" style="width:18px;height:18px;accent-color:#c9a227;">
                            <span style="color:#fff;font-family:'Cormorant Garamond',serif;font-size:14px;"><?php echo esc_html($texto); ?></span>
                        </label>
                        <?php endforeach; ?>
                    </div>

                    <div style="margin-top:15px;">
                        <input type="text" name="necesidad_otro" placeholder="Otro: escribí acá si querés..." style="width:100%;padding:12px 18px;background:rgba(0,0,0,0.4);border:1px solid rgba(201,162,39,0.2);border-radius:10px;color:#fff;font-family:'Cormorant Garamond',serif;font-size:14px;">
                    </div>
                </div>

                <div style="display:flex;gap:15px;justify-content:center;">
                    <button type="button" onclick="duendesAnterior(1)" style="background:transparent;color:#c9a227;border:1px solid rgba(201,162,39,0.4);padding:14px 30px;border-radius:25px;font-family:'Cinzel',serif;font-size:12px;cursor:pointer;">Atrás</button>
                    <button type="button" onclick="duendesSiguiente(3)" style="background:linear-gradient(135deg,#c9a227,#8b6914);color:#0a0a0a;border:none;padding:14px 40px;border-radius:25px;font-family:'Cinzel',serif;font-size:13px;font-weight:600;letter-spacing:1.5px;text-transform:uppercase;cursor:pointer;">Continuar</button>
                </div>
            </div>

            <!-- Pantalla 3 -->
            <div class="duendes-pantalla" data-num="3" style="display:none;">
                <p style="color:rgba(255,255,255,0.6);font-size:15px;margin:0 0 25px;font-family:'Cormorant Garamond',serif;">
                    Si pudieras decirle algo a alguien que realmente te escucha...
                </p>

                <div style="text-align:left;margin-bottom:25px;">
                    <label style="display:block;color:#c9a227;font-family:'Cinzel',serif;font-size:13px;margin-bottom:8px;">¿Hay algo que tu guardián debería saber? <span style="color:rgba(255,255,255,0.4);">(opcional)</span></label>
                    <textarea name="mensaje_guardian" rows="4" placeholder="Algo que no le contás a nadie, algo que te pesa, algo que soñás..." style="width:100%;padding:14px 18px;background:rgba(0,0,0,0.4);border:1px solid rgba(201,162,39,0.3);border-radius:10px;color:#fff;font-family:'Cormorant Garamond',serif;font-size:16px;resize:none;"></textarea>
                </div>

                <div style="display:flex;gap:15px;justify-content:center;">
                    <button type="button" onclick="duendesAnterior(2)" style="background:transparent;color:#c9a227;border:1px solid rgba(201,162,39,0.4);padding:14px 30px;border-radius:25px;font-family:'Cinzel',serif;font-size:12px;cursor:pointer;">Atrás</button>
                    <button type="button" onclick="duendesSiguiente(4)" style="background:linear-gradient(135deg,#c9a227,#8b6914);color:#0a0a0a;border:none;padding:14px 40px;border-radius:25px;font-family:'Cinzel',serif;font-size:13px;font-weight:600;letter-spacing:1.5px;text-transform:uppercase;cursor:pointer;">Continuar</button>
                </div>
            </div>

            <!-- Pantalla 4 (final) -->
            <div class="duendes-pantalla" data-num="4" style="display:none;">
                <p style="color:rgba(255,255,255,0.6);font-size:15px;margin:0 0 25px;font-family:'Cormorant Garamond',serif;">
                    Una imagen ayuda a tu guardián a reconocerte energéticamente.
                </p>

                <div style="text-align:left;margin-bottom:20px;">
                    <label style="display:block;color:#c9a227;font-family:'Cinzel',serif;font-size:13px;margin-bottom:8px;">Subir foto <span style="color:rgba(255,255,255,0.4);">(opcional pero recomendado)</span></label>
                    <input type="file" name="foto_persona" accept="image/*" style="width:100%;padding:14px;background:rgba(0,0,0,0.4);border:1px solid rgba(201,162,39,0.3);border-radius:10px;color:#fff;">
                    <p style="color:rgba(255,255,255,0.4);font-size:12px;margin:8px 0 0;font-family:'Cormorant Garamond',serif;">No es obligatorio, pero hace la conexión más profunda.</p>
                </div>

                <div style="text-align:left;margin-bottom:25px;">
                    <label style="display:flex;align-items:center;gap:10px;cursor:pointer;">
                        <input type="checkbox" name="confirma_mayor" required style="width:20px;height:20px;accent-color:#c9a227;">
                        <span style="color:#fff;font-family:'Cormorant Garamond',serif;font-size:14px;">Confirmo que soy mayor de 18 años</span>
                    </label>
                </div>

                <div style="display:flex;gap:15px;justify-content:center;">
                    <button type="button" onclick="duendesAnterior(3)" style="background:transparent;color:#c9a227;border:1px solid rgba(201,162,39,0.4);padding:14px 30px;border-radius:25px;font-family:'Cinzel',serif;font-size:12px;cursor:pointer;">Atrás</button>
                    <button type="submit" id="duendes-btn-enviar" style="background:linear-gradient(135deg,#c9a227,#8b6914);color:#0a0a0a;border:none;padding:14px 40px;border-radius:25px;font-family:'Cinzel',serif;font-size:13px;font-weight:600;letter-spacing:1.5px;text-transform:uppercase;cursor:pointer;">Completar conexión</button>
                </div>
            </div>
        </div>

        <input type="hidden" name="order_id" value="<?php echo esc_attr($order_id); ?>">
        <input type="hidden" name="tipo_formulario" value="para_mi">
        <input type="hidden" name="action" value="duendes_guardar_canalizacion">
        <input type="hidden" name="nonce" value="<?php echo wp_create_nonce('duendes_canalizacion'); ?>">
    </div>

    <?php duendes_scripts_formulario(); ?>
    <?php
}

// ═══════════════════════════════════════════════════════════════════════════
// SCRIPTS Y ESTILOS COMUNES
// ═══════════════════════════════════════════════════════════════════════════

function duendes_scripts_formulario() {
    ?>
    <style>
    .duendes-necesidad-opt:hover,
    .duendes-necesidad-opt:has(input:checked) {
        border-color: #c9a227 !important;
        background: rgba(201,162,39,0.15) !important;
    }
    #duendes-canalizacion-form input:focus,
    #duendes-canalizacion-form textarea:focus {
        outline: none;
        border-color: #c9a227 !important;
        box-shadow: 0 0 10px rgba(201,162,39,0.3);
    }
    </style>

    <script>
    function duendesSiguiente(num) {
        document.querySelectorAll('.duendes-pantalla').forEach(p => p.style.display = 'none');
        document.querySelector('.duendes-pantalla[data-num="'+num+'"]').style.display = 'block';
        window.scrollTo({top: document.getElementById('duendes-canalizacion-form').offsetTop - 50, behavior: 'smooth'});
    }
    function duendesAnterior(num) {
        document.querySelectorAll('.duendes-pantalla').forEach(p => p.style.display = 'none');
        document.querySelector('.duendes-pantalla[data-num="'+num+'"]').style.display = 'block';
    }

    document.getElementById('duendes-btn-enviar')?.addEventListener('click', function(e) {
        e.preventDefault();
        var form = document.getElementById('duendes-canalizacion-form');
        var btn = this;

        // Validar checkbox mayor de edad
        if (!form.querySelector('[name="confirma_mayor"]').checked) {
            alert('Debés confirmar que sos mayor de 18 años');
            return;
        }

        btn.textContent = 'Enviando...';
        btn.style.opacity = '0.5';

        var formData = new FormData();
        formData.append('action', 'duendes_guardar_canalizacion');
        formData.append('nonce', form.querySelector('[name="nonce"]').value);
        formData.append('order_id', form.querySelector('[name="order_id"]').value);
        formData.append('tipo_formulario', form.querySelector('[name="tipo_formulario"]').value);
        formData.append('nombre_persona', form.querySelector('[name="nombre_persona"]')?.value || '');
        formData.append('momento_vida', form.querySelector('[name="momento_vida"]')?.value || '');
        formData.append('mensaje_guardian', form.querySelector('[name="mensaje_guardian"]')?.value || '');
        formData.append('necesidad_otro', form.querySelector('[name="necesidad_otro"]')?.value || '');

        var necesidades = [];
        form.querySelectorAll('[name="necesidades[]"]:checked').forEach(function(cb) {
            necesidades.push(cb.value);
        });
        formData.append('necesidades', JSON.stringify(necesidades));

        var foto = form.querySelector('[name="foto_persona"]');
        if (foto && foto.files[0]) {
            formData.append('foto_persona', foto.files[0]);
        }

        fetch('<?php echo admin_url('admin-ajax.php'); ?>', {
            method: 'POST',
            body: formData
        })
        .then(r => r.json())
        .then(data => {
            if (data.success) {
                form.innerHTML = '<div style="text-align:center;padding:40px 0;"><h3 style="color:#c9a227;font-family:Cinzel,serif;font-size:22px;margin:0 0 15px;">¡Conexión establecida!</h3><p style="color:rgba(255,255,255,0.7);font-family:Cormorant Garamond,serif;font-size:16px;">Tu guardián ahora te conoce. Pronto recibirás su mensaje personal.</p></div>';
            } else {
                alert(data.data || 'Error al enviar');
                btn.textContent = 'Completar conexión';
                btn.style.opacity = '1';
            }
        });
    });
    </script>
    <?php
}

// ═══════════════════════════════════════════════════════════════════════════
// AJAX HANDLER
// ═══════════════════════════════════════════════════════════════════════════

add_action('wp_ajax_duendes_guardar_canalizacion', 'duendes_ajax_guardar_canalizacion');
add_action('wp_ajax_nopriv_duendes_guardar_canalizacion', 'duendes_ajax_guardar_canalizacion');

function duendes_ajax_guardar_canalizacion() {
    if (!wp_verify_nonce($_POST['nonce'] ?? '', 'duendes_canalizacion')) {
        wp_send_json_error('Sesión expirada');
    }

    $order_id = intval($_POST['order_id'] ?? 0);
    if (!$order_id) wp_send_json_error('Orden inválida');

    $tipo = sanitize_text_field($_POST['tipo_formulario'] ?? 'para_mi');

    $datos = [
        'tipo' => $tipo,
        'fecha' => current_time('mysql'),
    ];

    // Datos comunes
    if (!empty($_POST['nombre_persona'])) {
        $datos['nombre'] = sanitize_text_field($_POST['nombre_persona']);
    }
    if (!empty($_POST['momento_vida'])) {
        $datos['momento'] = sanitize_textarea_field($_POST['momento_vida']);
    }
    if (!empty($_POST['mensaje_guardian'])) {
        $datos['mensaje'] = sanitize_textarea_field($_POST['mensaje_guardian']);
    }
    if (!empty($_POST['necesidades'])) {
        $datos['necesidades'] = json_decode(stripslashes($_POST['necesidades']), true);
    }
    if (!empty($_POST['necesidad_otro'])) {
        $datos['necesidad_otro'] = sanitize_text_field($_POST['necesidad_otro']);
    }

    // Datos para regalo sorpresa
    if (!empty($_POST['relacion'])) {
        $datos['relacion'] = sanitize_text_field($_POST['relacion']);
    }
    if (!empty($_POST['que_necesita'])) {
        $datos['que_necesita'] = sanitize_textarea_field($_POST['que_necesita']);
    }
    if (!empty($_POST['personalidad'])) {
        $datos['personalidad'] = json_decode(stripslashes($_POST['personalidad']), true);
    }
    if (!empty($_POST['que_le_gusta'])) {
        $datos['que_le_gusta'] = sanitize_textarea_field($_POST['que_le_gusta']);
    }
    if (!empty($_POST['mensaje_personal'])) {
        $datos['mensaje_personal'] = sanitize_textarea_field($_POST['mensaje_personal']);
    }
    if (!empty($_POST['es_anonimo'])) {
        $datos['es_anonimo'] = true;
    }

    // Datos para niño
    if (!empty($_POST['edad_nino'])) {
        $datos['edad_nino'] = sanitize_text_field($_POST['edad_nino']);
    }
    if (!empty($_POST['que_le_gusta_nino'])) {
        $datos['que_le_gusta'] = sanitize_textarea_field($_POST['que_le_gusta_nino']);
    }
    if (!empty($_POST['situacion_nino'])) {
        $datos['situacion'] = json_decode(stripslashes($_POST['situacion_nino']), true);
    }

    // Datos para regalo que sabe
    if (!empty($_POST['email_destinatario'])) {
        $datos['email_destinatario'] = sanitize_email($_POST['email_destinatario']);
    }

    // Manejar foto
    if (!empty($_FILES['foto_persona']['tmp_name'])) {
        require_once(ABSPATH . 'wp-admin/includes/file.php');
        require_once(ABSPATH . 'wp-admin/includes/media.php');
        require_once(ABSPATH . 'wp-admin/includes/image.php');

        $upload = wp_handle_upload($_FILES['foto_persona'], ['test_form' => false]);
        if (!empty($upload['url'])) {
            $datos['foto_url'] = $upload['url'];
        }
    }

    // Guardar
    update_post_meta($order_id, '_duendes_datos_canalizacion', json_encode($datos, JSON_UNESCAPED_UNICODE));
    update_post_meta($order_id, '_duendes_formulario_completado', 'yes');

    // Si es regalo que sabe, enviar email al destinatario
    if ($tipo === 'regalo_sabe' && !empty($datos['email_destinatario'])) {
        duendes_enviar_email_destinatario($order_id, $datos);
    }

    wp_send_json_success(['mensaje' => 'Guardado correctamente']);
}

// ═══════════════════════════════════════════════════════════════════════════
// VÍA 2: REGALO - LA PERSONA LO SABE
// ═══════════════════════════════════════════════════════════════════════════

function duendes_formulario_regalo_sabe($order_id, $nombre_guardian) {
    ?>
    <div id="duendes-canalizacion-form" style="margin:30px 0;background:linear-gradient(145deg,#0a0a0a,#1a1a1a);border:1px solid rgba(201,162,39,0.3);border-radius:20px;padding:40px;text-align:center;">
        <div style="position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,transparent,#c9a227,transparent);"></div>

        <h2 style="color:#c9a227;margin:0 0 10px;font-family:'Cinzel',serif;font-size:24px;font-weight:500;letter-spacing:2px;">
            Qué lindo regalar magia
        </h2>
        <p style="color:rgba(255,255,255,0.7);font-size:16px;margin:0 0 30px;font-family:'Cormorant Garamond',serif;font-style:italic;">
            <?php echo esc_html($nombre_guardian); ?> está listo para conocer a quien lo recibirá.
        </p>

        <p style="color:rgba(255,255,255,0.6);font-size:14px;margin:0 0 25px;font-family:'Cormorant Garamond',serif;max-width:500px;margin-left:auto;margin-right:auto;">
            Para que la canalización sea realmente personal, necesitamos que esa persona nos cuente un poco de sí. Le enviaremos un formulario especial - no le diremos qué guardián elegiste.
        </p>

        <div id="duendes-pantallas">
            <div class="duendes-pantalla" data-num="1" style="display:block;">
                <div style="text-align:left;margin-bottom:20px;">
                    <label style="display:block;color:#c9a227;font-family:'Cinzel',serif;font-size:13px;margin-bottom:8px;">¿Cómo se llama la persona que lo recibirá?</label>
                    <input type="text" name="nombre_persona" required style="width:100%;padding:14px 18px;background:rgba(0,0,0,0.4);border:1px solid rgba(201,162,39,0.3);border-radius:10px;color:#fff;font-family:'Cormorant Garamond',serif;font-size:16px;">
                </div>

                <div style="text-align:left;margin-bottom:20px;">
                    <label style="display:block;color:#c9a227;font-family:'Cinzel',serif;font-size:13px;margin-bottom:8px;">¿Cuál es su email?</label>
                    <input type="email" name="email_destinatario" required style="width:100%;padding:14px 18px;background:rgba(0,0,0,0.4);border:1px solid rgba(201,162,39,0.3);border-radius:10px;color:#fff;font-family:'Cormorant Garamond',serif;font-size:16px;">
                    <p style="color:rgba(255,255,255,0.4);font-size:12px;margin:8px 0 0;font-family:'Cormorant Garamond',serif;">Le enviaremos un formulario después de tu compra.</p>
                </div>

                <div style="text-align:left;margin-bottom:25px;">
                    <label style="display:block;color:#c9a227;font-family:'Cinzel',serif;font-size:13px;margin-bottom:8px;">¿Querés incluir un mensaje personal? <span style="color:rgba(255,255,255,0.4);">(opcional)</span></label>
                    <textarea name="mensaje_personal" rows="3" placeholder="Un mensaje que quieras que reciba junto con el formulario..." style="width:100%;padding:14px 18px;background:rgba(0,0,0,0.4);border:1px solid rgba(201,162,39,0.3);border-radius:10px;color:#fff;font-family:'Cormorant Garamond',serif;font-size:16px;resize:none;"></textarea>
                </div>

                <button type="submit" id="duendes-btn-enviar" style="background:linear-gradient(135deg,#c9a227,#8b6914);color:#0a0a0a;border:none;padding:14px 40px;border-radius:25px;font-family:'Cinzel',serif;font-size:13px;font-weight:600;letter-spacing:1.5px;text-transform:uppercase;cursor:pointer;">
                    Enviar invitación mágica
                </button>
            </div>
        </div>

        <input type="hidden" name="order_id" value="<?php echo esc_attr($order_id); ?>">
        <input type="hidden" name="tipo_formulario" value="regalo_sabe">
        <input type="hidden" name="action" value="duendes_guardar_canalizacion">
        <input type="hidden" name="nonce" value="<?php echo wp_create_nonce('duendes_canalizacion'); ?>">
    </div>

    <?php duendes_scripts_formulario_regalo(); ?>
    <?php
}

function duendes_scripts_formulario_regalo() {
    ?>
    <style>
    #duendes-canalizacion-form input:focus,
    #duendes-canalizacion-form textarea:focus {
        outline: none;
        border-color: #c9a227 !important;
        box-shadow: 0 0 10px rgba(201,162,39,0.3);
    }
    </style>

    <script>
    document.getElementById('duendes-btn-enviar')?.addEventListener('click', function(e) {
        e.preventDefault();
        var form = document.getElementById('duendes-canalizacion-form');
        var btn = this;

        var email = form.querySelector('[name="email_destinatario"]')?.value;
        var nombre = form.querySelector('[name="nombre_persona"]')?.value;

        if (!email || !nombre) {
            alert('Completá el nombre y email del destinatario');
            return;
        }

        btn.textContent = 'Enviando...';
        btn.style.opacity = '0.5';

        var formData = new FormData();
        formData.append('action', 'duendes_guardar_canalizacion');
        formData.append('nonce', form.querySelector('[name="nonce"]').value);
        formData.append('order_id', form.querySelector('[name="order_id"]').value);
        formData.append('tipo_formulario', form.querySelector('[name="tipo_formulario"]').value);
        formData.append('nombre_persona', nombre);
        formData.append('email_destinatario', email);
        formData.append('mensaje_personal', form.querySelector('[name="mensaje_personal"]')?.value || '');

        fetch('<?php echo admin_url('admin-ajax.php'); ?>', {
            method: 'POST',
            body: formData
        })
        .then(r => r.json())
        .then(data => {
            if (data.success) {
                form.innerHTML = '<div style="text-align:center;padding:40px 0;"><h3 style="color:#c9a227;font-family:Cinzel,serif;font-size:22px;margin:0 0 15px;">¡Invitación enviada!</h3><p style="color:rgba(255,255,255,0.7);font-family:Cormorant Garamond,serif;font-size:16px;">' + nombre + ' recibirá un email mágico para completar su conexión con el guardián.</p></div>';
            } else {
                alert(data.data || 'Error al enviar');
                btn.textContent = 'Enviar invitación mágica';
                btn.style.opacity = '1';
            }
        });
    });
    </script>
    <?php
}

// ═══════════════════════════════════════════════════════════════════════════
// VÍA 3: REGALO SORPRESA
// ═══════════════════════════════════════════════════════════════════════════

function duendes_formulario_regalo_sorpresa($order_id, $nombre_guardian) {
    ?>
    <div id="duendes-canalizacion-form" style="margin:30px 0;background:linear-gradient(145deg,#0a0a0a,#1a1a1a);border:1px solid rgba(201,162,39,0.3);border-radius:20px;padding:40px;text-align:center;">

        <h2 style="color:#c9a227;margin:0 0 10px;font-family:'Cinzel',serif;font-size:24px;font-weight:500;letter-spacing:2px;">
            Una sorpresa mágica está en camino
        </h2>
        <p style="color:rgba(255,255,255,0.7);font-size:16px;margin:0 0 10px;font-family:'Cormorant Garamond',serif;font-style:italic;">
            Como es sorpresa, no podemos preguntarle directamente.
        </p>
        <p style="color:rgba(255,255,255,0.6);font-size:14px;margin:0 0 30px;font-family:'Cormorant Garamond',serif;">
            Pero vos la conocés - y eso es valioso. Tu guardián usará tu amor como puente para conectar.
        </p>

        <div id="duendes-pantallas" data-pantalla="1">

            <!-- Pantalla 1: El vínculo -->
            <div class="duendes-pantalla" data-num="1" style="display:block;">
                <p style="color:rgba(255,255,255,0.5);font-size:14px;margin:0 0 20px;font-family:'Cormorant Garamond',serif;font-style:italic;">Conocés a esta persona. Eso es valioso.</p>

                <div style="text-align:left;margin-bottom:20px;">
                    <label style="display:block;color:#c9a227;font-family:'Cinzel',serif;font-size:13px;margin-bottom:8px;">¿Cómo se llama?</label>
                    <input type="text" name="nombre_persona" required style="width:100%;padding:14px 18px;background:rgba(0,0,0,0.4);border:1px solid rgba(201,162,39,0.3);border-radius:10px;color:#fff;font-family:'Cormorant Garamond',serif;font-size:16px;">
                </div>

                <div style="text-align:left;margin-bottom:25px;">
                    <label style="display:block;color:#c9a227;font-family:'Cinzel',serif;font-size:13px;margin-bottom:12px;">¿Cuál es tu relación con ella/él?</label>
                    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;">
                        <?php
                        $relaciones = ['Pareja', 'Mamá', 'Papá', 'Hermana/o', 'Hija/o', 'Amiga/o', 'Otro'];
                        foreach ($relaciones as $rel):
                        ?>
                        <label style="display:flex;align-items:center;justify-content:center;gap:8px;padding:12px;background:rgba(201,162,39,0.05);border:1px solid rgba(201,162,39,0.2);border-radius:8px;cursor:pointer;transition:all 0.3s;" class="duendes-rel-opt">
                            <input type="radio" name="relacion" value="<?php echo esc_attr(strtolower($rel)); ?>" style="width:16px;height:16px;accent-color:#c9a227;">
                            <span style="color:#fff;font-family:'Cormorant Garamond',serif;font-size:14px;"><?php echo esc_html($rel); ?></span>
                        </label>
                        <?php endforeach; ?>
                    </div>
                </div>

                <button type="button" onclick="duendesSiguiente(2)" style="background:linear-gradient(135deg,#c9a227,#8b6914);color:#0a0a0a;border:none;padding:14px 40px;border-radius:25px;font-family:'Cinzel',serif;font-size:13px;font-weight:600;letter-spacing:1.5px;text-transform:uppercase;cursor:pointer;">Continuar</button>
            </div>

            <!-- Pantalla 2: Su momento -->
            <div class="duendes-pantalla" data-num="2" style="display:none;">
                <p style="color:rgba(255,255,255,0.5);font-size:14px;margin:0 0 20px;font-family:'Cormorant Garamond',serif;font-style:italic;">Pensá en <span id="nombre-destino">esta persona</span>. ¿Qué ves?</p>

                <div style="text-align:left;margin-bottom:20px;">
                    <label style="display:block;color:#c9a227;font-family:'Cinzel',serif;font-size:13px;margin-bottom:8px;">¿Qué momento está atravesando?</label>
                    <textarea name="momento_vida" rows="3" placeholder="Una separación, un duelo, un logro, una crisis..." style="width:100%;padding:14px 18px;background:rgba(0,0,0,0.4);border:1px solid rgba(201,162,39,0.3);border-radius:10px;color:#fff;font-family:'Cormorant Garamond',serif;font-size:16px;resize:none;"></textarea>
                </div>

                <div style="text-align:left;margin-bottom:25px;">
                    <label style="display:block;color:#c9a227;font-family:'Cinzel',serif;font-size:13px;margin-bottom:8px;">¿Qué creés que necesita escuchar?</label>
                    <textarea name="que_necesita" rows="3" placeholder="Algo que vos le dirías si pudieras..." style="width:100%;padding:14px 18px;background:rgba(0,0,0,0.4);border:1px solid rgba(201,162,39,0.3);border-radius:10px;color:#fff;font-family:'Cormorant Garamond',serif;font-size:16px;resize:none;"></textarea>
                </div>

                <div style="display:flex;gap:15px;justify-content:center;">
                    <button type="button" onclick="duendesAnterior(1)" style="background:transparent;color:#c9a227;border:1px solid rgba(201,162,39,0.4);padding:14px 30px;border-radius:25px;font-family:'Cinzel',serif;font-size:12px;cursor:pointer;">Atrás</button>
                    <button type="button" onclick="duendesSiguiente(3)" style="background:linear-gradient(135deg,#c9a227,#8b6914);color:#0a0a0a;border:none;padding:14px 40px;border-radius:25px;font-family:'Cinzel',serif;font-size:13px;font-weight:600;letter-spacing:1.5px;text-transform:uppercase;cursor:pointer;">Continuar</button>
                </div>
            </div>

            <!-- Pantalla 3: Su esencia -->
            <div class="duendes-pantalla" data-num="3" style="display:none;">
                <p style="color:rgba(255,255,255,0.5);font-size:14px;margin:0 0 20px;font-family:'Cormorant Garamond',serif;font-style:italic;">Ayudanos a conocerla/o un poco más.</p>

                <div style="text-align:left;margin-bottom:20px;">
                    <label style="display:block;color:#c9a227;font-family:'Cinzel',serif;font-size:13px;margin-bottom:12px;">¿Cómo describirías su personalidad? (elegí hasta 3)</label>
                    <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:10px;">
                        <?php
                        $personalidades = ['Sensible', 'Fuerte', 'Soñadora', 'Práctica', 'Reservada', 'Expresiva', 'Luchadora', 'Tranquila'];
                        foreach ($personalidades as $pers):
                        ?>
                        <label style="display:flex;align-items:center;gap:10px;padding:12px;background:rgba(201,162,39,0.05);border:1px solid rgba(201,162,39,0.2);border-radius:8px;cursor:pointer;transition:all 0.3s;" class="duendes-pers-opt">
                            <input type="checkbox" name="personalidad[]" value="<?php echo esc_attr(strtolower($pers)); ?>" style="width:18px;height:18px;accent-color:#c9a227;">
                            <span style="color:#fff;font-family:'Cormorant Garamond',serif;font-size:14px;"><?php echo esc_html($pers); ?></span>
                        </label>
                        <?php endforeach; ?>
                    </div>
                </div>

                <div style="text-align:left;margin-bottom:25px;">
                    <label style="display:block;color:#c9a227;font-family:'Cinzel',serif;font-size:13px;margin-bottom:8px;">¿Qué le hace brillar los ojos?</label>
                    <textarea name="que_le_gusta" rows="2" placeholder="¿Qué la apasiona, qué la hace feliz?" style="width:100%;padding:14px 18px;background:rgba(0,0,0,0.4);border:1px solid rgba(201,162,39,0.3);border-radius:10px;color:#fff;font-family:'Cormorant Garamond',serif;font-size:16px;resize:none;"></textarea>
                </div>

                <div style="display:flex;gap:15px;justify-content:center;">
                    <button type="button" onclick="duendesAnterior(2)" style="background:transparent;color:#c9a227;border:1px solid rgba(201,162,39,0.4);padding:14px 30px;border-radius:25px;font-family:'Cinzel',serif;font-size:12px;cursor:pointer;">Atrás</button>
                    <button type="button" onclick="duendesSiguiente(4)" style="background:linear-gradient(135deg,#c9a227,#8b6914);color:#0a0a0a;border:none;padding:14px 40px;border-radius:25px;font-family:'Cinzel',serif;font-size:13px;font-weight:600;letter-spacing:1.5px;text-transform:uppercase;cursor:pointer;">Continuar</button>
                </div>
            </div>

            <!-- Pantalla 4: Foto y mensaje -->
            <div class="duendes-pantalla" data-num="4" style="display:none;">
                <p style="color:rgba(255,255,255,0.5);font-size:14px;margin:0 0 20px;font-family:'Cormorant Garamond',serif;font-style:italic;">Si tenés una foto, ayuda. Si no, el amor que ponés ya dice mucho.</p>

                <div style="text-align:left;margin-bottom:20px;">
                    <label style="display:block;color:#c9a227;font-family:'Cinzel',serif;font-size:13px;margin-bottom:8px;">Subir foto <span style="color:rgba(255,255,255,0.4);">(opcional)</span></label>
                    <input type="file" name="foto_persona" accept="image/*" style="width:100%;padding:14px;background:rgba(0,0,0,0.4);border:1px solid rgba(201,162,39,0.3);border-radius:10px;color:#fff;">
                </div>

                <div id="duendes-check-mayor" style="text-align:left;margin-bottom:20px;display:none;">
                    <label style="display:flex;align-items:center;gap:10px;cursor:pointer;">
                        <input type="checkbox" name="confirma_mayor" style="width:20px;height:20px;accent-color:#c9a227;">
                        <span style="color:#fff;font-family:'Cormorant Garamond',serif;font-size:14px;">Confirmo que la persona es mayor de 18 años</span>
                    </label>
                </div>

                <div style="text-align:left;margin-bottom:20px;">
                    <label style="display:block;color:#c9a227;font-family:'Cinzel',serif;font-size:13px;margin-bottom:8px;">¿Querés incluir un mensaje tuyo? <span style="color:rgba(255,255,255,0.4);">(opcional)</span></label>
                    <textarea name="mensaje_personal" rows="3" style="width:100%;padding:14px 18px;background:rgba(0,0,0,0.4);border:1px solid rgba(201,162,39,0.3);border-radius:10px;color:#fff;font-family:'Cormorant Garamond',serif;font-size:16px;resize:none;"></textarea>
                </div>

                <div style="text-align:left;margin-bottom:25px;">
                    <label style="display:flex;align-items:center;gap:10px;cursor:pointer;">
                        <input type="checkbox" name="es_anonimo" style="width:18px;height:18px;accent-color:#c9a227;">
                        <span style="color:rgba(255,255,255,0.7);font-family:'Cormorant Garamond',serif;font-size:14px;">Prefiero que sea anónimo</span>
                    </label>
                </div>

                <div style="display:flex;gap:15px;justify-content:center;">
                    <button type="button" onclick="duendesAnterior(3)" style="background:transparent;color:#c9a227;border:1px solid rgba(201,162,39,0.4);padding:14px 30px;border-radius:25px;font-family:'Cinzel',serif;font-size:12px;cursor:pointer;">Atrás</button>
                    <button type="submit" id="duendes-btn-enviar" style="background:linear-gradient(135deg,#c9a227,#8b6914);color:#0a0a0a;border:none;padding:14px 40px;border-radius:25px;font-family:'Cinzel',serif;font-size:13px;font-weight:600;letter-spacing:1.5px;text-transform:uppercase;cursor:pointer;">Completar conexión</button>
                </div>
            </div>
        </div>

        <input type="hidden" name="order_id" value="<?php echo esc_attr($order_id); ?>">
        <input type="hidden" name="tipo_formulario" value="regalo_sorpresa">
        <input type="hidden" name="action" value="duendes_guardar_canalizacion">
        <input type="hidden" name="nonce" value="<?php echo wp_create_nonce('duendes_canalizacion'); ?>">
    </div>

    <?php duendes_scripts_formulario_sorpresa(); ?>
    <?php
}

function duendes_scripts_formulario_sorpresa() {
    ?>
    <style>
    .duendes-rel-opt:hover, .duendes-rel-opt:has(input:checked),
    .duendes-pers-opt:hover, .duendes-pers-opt:has(input:checked) {
        border-color: #c9a227 !important;
        background: rgba(201,162,39,0.15) !important;
    }
    #duendes-canalizacion-form input:focus,
    #duendes-canalizacion-form textarea:focus {
        outline: none;
        border-color: #c9a227 !important;
        box-shadow: 0 0 10px rgba(201,162,39,0.3);
    }
    </style>

    <script>
    function duendesSiguiente(num) {
        // Actualizar nombre si existe
        var nombre = document.querySelector('[name="nombre_persona"]')?.value;
        if (nombre && document.getElementById('nombre-destino')) {
            document.getElementById('nombre-destino').textContent = nombre;
        }

        document.querySelectorAll('.duendes-pantalla').forEach(p => p.style.display = 'none');
        document.querySelector('.duendes-pantalla[data-num="'+num+'"]').style.display = 'block';
        window.scrollTo({top: document.getElementById('duendes-canalizacion-form').offsetTop - 50, behavior: 'smooth'});
    }
    function duendesAnterior(num) {
        document.querySelectorAll('.duendes-pantalla').forEach(p => p.style.display = 'none');
        document.querySelector('.duendes-pantalla[data-num="'+num+'"]').style.display = 'block';
    }

    // Mostrar checkbox de mayor de edad si sube foto
    document.querySelector('[name="foto_persona"]')?.addEventListener('change', function() {
        document.getElementById('duendes-check-mayor').style.display = this.files.length ? 'block' : 'none';
    });

    // Limitar a 3 personalidades
    document.querySelectorAll('[name="personalidad[]"]').forEach(function(cb) {
        cb.addEventListener('change', function() {
            var checked = document.querySelectorAll('[name="personalidad[]"]:checked');
            if (checked.length > 3) {
                this.checked = false;
            }
        });
    });

    document.getElementById('duendes-btn-enviar')?.addEventListener('click', function(e) {
        e.preventDefault();
        var form = document.getElementById('duendes-canalizacion-form');
        var btn = this;

        // Validar foto + checkbox
        var foto = form.querySelector('[name="foto_persona"]');
        var checkMayor = form.querySelector('[name="confirma_mayor"]');
        if (foto && foto.files.length && checkMayor && !checkMayor.checked) {
            alert('Confirmá que la persona es mayor de 18 años');
            return;
        }

        btn.textContent = 'Enviando...';
        btn.style.opacity = '0.5';

        var formData = new FormData();
        formData.append('action', 'duendes_guardar_canalizacion');
        formData.append('nonce', form.querySelector('[name="nonce"]').value);
        formData.append('order_id', form.querySelector('[name="order_id"]').value);
        formData.append('tipo_formulario', form.querySelector('[name="tipo_formulario"]').value);
        formData.append('nombre_persona', form.querySelector('[name="nombre_persona"]')?.value || '');
        formData.append('relacion', form.querySelector('[name="relacion"]:checked')?.value || '');
        formData.append('momento_vida', form.querySelector('[name="momento_vida"]')?.value || '');
        formData.append('que_necesita', form.querySelector('[name="que_necesita"]')?.value || '');
        formData.append('que_le_gusta', form.querySelector('[name="que_le_gusta"]')?.value || '');
        formData.append('mensaje_personal', form.querySelector('[name="mensaje_personal"]')?.value || '');
        formData.append('es_anonimo', form.querySelector('[name="es_anonimo"]')?.checked ? '1' : '0');

        var personalidad = [];
        form.querySelectorAll('[name="personalidad[]"]:checked').forEach(function(cb) {
            personalidad.push(cb.value);
        });
        formData.append('personalidad', JSON.stringify(personalidad));

        if (foto && foto.files[0]) {
            formData.append('foto_persona', foto.files[0]);
        }

        fetch('<?php echo admin_url('admin-ajax.php'); ?>', {
            method: 'POST',
            body: formData
        })
        .then(r => r.json())
        .then(data => {
            if (data.success) {
                var nombre = form.querySelector('[name="nombre_persona"]')?.value || 'esa persona';
                form.innerHTML = '<div style="text-align:center;padding:40px 0;"><h3 style="color:#c9a227;font-family:Cinzel,serif;font-size:22px;margin:0 0 15px;">¡Conexión establecida!</h3><p style="color:rgba(255,255,255,0.7);font-family:Cormorant Garamond,serif;font-size:16px;">Tu amor será el puente. El guardián ahora puede conectar con ' + nombre + '.</p></div>';
            } else {
                alert(data.data || 'Error al enviar');
                btn.textContent = 'Completar conexión';
                btn.style.opacity = '1';
            }
        });
    });
    </script>
    <?php
}

// ═══════════════════════════════════════════════════════════════════════════
// VÍA 4: PARA UN NIÑO/A
// ═══════════════════════════════════════════════════════════════════════════

function duendes_formulario_para_nino($order_id, $nombre_guardian) {
    ?>
    <div id="duendes-canalizacion-form" style="margin:30px 0;background:linear-gradient(145deg,#0a0a0a,#1a1a1a);border:1px solid rgba(201,162,39,0.3);border-radius:20px;padding:40px;text-align:center;">

        <h2 style="color:#c9a227;margin:0 0 10px;font-family:'Cinzel',serif;font-size:24px;font-weight:500;letter-spacing:2px;">
            Los guardianes aman a los pequeños
        </h2>
        <p style="color:rgba(255,255,255,0.7);font-size:16px;margin:0 0 30px;font-family:'Cormorant Garamond',serif;font-style:italic;">
            Tienen una forma especial de hablarles - con ternura, con magia, con palabras que un niño puede entender.
        </p>

        <div id="duendes-pantallas" data-pantalla="1">

            <!-- Pantalla 1: Identificación -->
            <div class="duendes-pantalla" data-num="1" style="display:block;">
                <div style="text-align:left;margin-bottom:20px;">
                    <label style="display:block;color:#c9a227;font-family:'Cinzel',serif;font-size:13px;margin-bottom:8px;">¿Cómo se llama el niño/a?</label>
                    <input type="text" name="nombre_persona" required style="width:100%;padding:14px 18px;background:rgba(0,0,0,0.4);border:1px solid rgba(201,162,39,0.3);border-radius:10px;color:#fff;font-family:'Cormorant Garamond',serif;font-size:16px;">
                </div>

                <div style="text-align:left;margin-bottom:20px;">
                    <label style="display:block;color:#c9a227;font-family:'Cinzel',serif;font-size:13px;margin-bottom:12px;">¿Qué edad tiene?</label>
                    <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:10px;">
                        <?php
                        $edades = ['3-6 años', '7-10 años', '11-14 años', '15-17 años'];
                        foreach ($edades as $edad):
                        ?>
                        <label style="display:flex;align-items:center;justify-content:center;gap:8px;padding:12px;background:rgba(201,162,39,0.05);border:1px solid rgba(201,162,39,0.2);border-radius:8px;cursor:pointer;transition:all 0.3s;" class="duendes-edad-opt">
                            <input type="radio" name="edad_nino" value="<?php echo esc_attr($edad); ?>" style="width:16px;height:16px;accent-color:#c9a227;">
                            <span style="color:#fff;font-family:'Cormorant Garamond',serif;font-size:14px;"><?php echo esc_html($edad); ?></span>
                        </label>
                        <?php endforeach; ?>
                    </div>
                </div>

                <div style="text-align:left;margin-bottom:25px;">
                    <label style="display:block;color:#c9a227;font-family:'Cinzel',serif;font-size:13px;margin-bottom:12px;">¿Cuál es tu relación?</label>
                    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;">
                        <?php
                        $relaciones = ['Mamá', 'Papá', 'Abuela/o', 'Tía/o', 'Madrina/Padrino', 'Otro'];
                        foreach ($relaciones as $rel):
                        ?>
                        <label style="display:flex;align-items:center;justify-content:center;gap:8px;padding:12px;background:rgba(201,162,39,0.05);border:1px solid rgba(201,162,39,0.2);border-radius:8px;cursor:pointer;transition:all 0.3s;" class="duendes-rel-opt">
                            <input type="radio" name="relacion" value="<?php echo esc_attr(strtolower($rel)); ?>" style="width:16px;height:16px;accent-color:#c9a227;">
                            <span style="color:#fff;font-family:'Cormorant Garamond',serif;font-size:14px;"><?php echo esc_html($rel); ?></span>
                        </label>
                        <?php endforeach; ?>
                    </div>
                </div>

                <button type="button" onclick="duendesSiguiente(2)" style="background:linear-gradient(135deg,#c9a227,#8b6914);color:#0a0a0a;border:none;padding:14px 40px;border-radius:25px;font-family:'Cinzel',serif;font-size:13px;font-weight:600;letter-spacing:1.5px;text-transform:uppercase;cursor:pointer;">Continuar</button>
            </div>

            <!-- Pantalla 2: Su mundo -->
            <div class="duendes-pantalla" data-num="2" style="display:none;">
                <p style="color:rgba(255,255,255,0.5);font-size:14px;margin:0 0 20px;font-family:'Cormorant Garamond',serif;font-style:italic;">Contanos sobre <span id="nombre-nino">el niño/a</span>. ¿Cómo es su mundo?</p>

                <div style="text-align:left;margin-bottom:20px;">
                    <label style="display:block;color:#c9a227;font-family:'Cinzel',serif;font-size:13px;margin-bottom:12px;">¿Cómo describirías su personalidad?</label>
                    <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:10px;">
                        <?php
                        $personalidades = ['Tímido/a', 'Sociable', 'Sensible', 'Aventurero/a', 'Creativo/a', 'Curioso/a', 'Tranquilo/a'];
                        foreach ($personalidades as $pers):
                        ?>
                        <label style="display:flex;align-items:center;gap:10px;padding:12px;background:rgba(201,162,39,0.05);border:1px solid rgba(201,162,39,0.2);border-radius:8px;cursor:pointer;transition:all 0.3s;" class="duendes-pers-opt">
                            <input type="checkbox" name="personalidad[]" value="<?php echo esc_attr(strtolower($pers)); ?>" style="width:18px;height:18px;accent-color:#c9a227;">
                            <span style="color:#fff;font-family:'Cormorant Garamond',serif;font-size:14px;"><?php echo esc_html($pers); ?></span>
                        </label>
                        <?php endforeach; ?>
                    </div>
                </div>

                <div style="text-align:left;margin-bottom:25px;">
                    <label style="display:block;color:#c9a227;font-family:'Cinzel',serif;font-size:13px;margin-bottom:8px;">¿Qué le gusta hacer?</label>
                    <textarea name="que_le_gusta_nino" rows="2" placeholder="Dibujar, jugar, leer, los animales..." style="width:100%;padding:14px 18px;background:rgba(0,0,0,0.4);border:1px solid rgba(201,162,39,0.3);border-radius:10px;color:#fff;font-family:'Cormorant Garamond',serif;font-size:16px;resize:none;"></textarea>
                </div>

                <div style="display:flex;gap:15px;justify-content:center;">
                    <button type="button" onclick="duendesAnterior(1)" style="background:transparent;color:#c9a227;border:1px solid rgba(201,162,39,0.4);padding:14px 30px;border-radius:25px;font-family:'Cinzel',serif;font-size:12px;cursor:pointer;">Atrás</button>
                    <button type="button" onclick="duendesSiguiente(3)" style="background:linear-gradient(135deg,#c9a227,#8b6914);color:#0a0a0a;border:none;padding:14px 40px;border-radius:25px;font-family:'Cinzel',serif;font-size:13px;font-weight:600;letter-spacing:1.5px;text-transform:uppercase;cursor:pointer;">Continuar</button>
                </div>
            </div>

            <!-- Pantalla 3: Lo que necesita -->
            <div class="duendes-pantalla" data-num="3" style="display:none;">
                <p style="color:rgba(255,255,255,0.5);font-size:14px;margin:0 0 20px;font-family:'Cormorant Garamond',serif;font-style:italic;">A veces los adultos vemos cosas que los niños no saben expresar.</p>

                <div style="text-align:left;margin-bottom:20px;">
                    <label style="display:block;color:#c9a227;font-family:'Cinzel',serif;font-size:13px;margin-bottom:12px;">¿Hay algo que esté atravesando o necesite? <span style="color:rgba(255,255,255,0.4);">(podés elegir varios)</span></label>
                    <div style="display:grid;grid-template-columns:1fr;gap:10px;">
                        <?php
                        $situaciones = [
                            'miedos' => 'Miedos nocturnos',
                            'cambios' => 'Cambios en la familia',
                            'escuela' => 'Dificultades en la escuela',
                            'confianza' => 'Necesita confianza',
                            'sensible' => 'Está muy sensible',
                            'amigo' => 'Solo quiero que tenga un amigo mágico',
                        ];
                        foreach ($situaciones as $val => $texto):
                        ?>
                        <label style="display:flex;align-items:center;gap:10px;padding:12px;background:rgba(201,162,39,0.05);border:1px solid rgba(201,162,39,0.2);border-radius:8px;cursor:pointer;transition:all 0.3s;" class="duendes-sit-opt">
                            <input type="checkbox" name="situacion_nino[]" value="<?php echo esc_attr($val); ?>" style="width:18px;height:18px;accent-color:#c9a227;">
                            <span style="color:#fff;font-family:'Cormorant Garamond',serif;font-size:14px;"><?php echo esc_html($texto); ?></span>
                        </label>
                        <?php endforeach; ?>
                    </div>
                </div>

                <div style="text-align:left;margin-bottom:25px;">
                    <label style="display:block;color:#c9a227;font-family:'Cinzel',serif;font-size:13px;margin-bottom:8px;">¿Algo más que el guardián debería saber? <span style="color:rgba(255,255,255,0.4);">(opcional)</span></label>
                    <textarea name="mensaje_guardian" rows="2" style="width:100%;padding:14px 18px;background:rgba(0,0,0,0.4);border:1px solid rgba(201,162,39,0.3);border-radius:10px;color:#fff;font-family:'Cormorant Garamond',serif;font-size:16px;resize:none;"></textarea>
                </div>

                <div style="display:flex;gap:15px;justify-content:center;">
                    <button type="button" onclick="duendesAnterior(2)" style="background:transparent;color:#c9a227;border:1px solid rgba(201,162,39,0.4);padding:14px 30px;border-radius:25px;font-family:'Cinzel',serif;font-size:12px;cursor:pointer;">Atrás</button>
                    <button type="button" onclick="duendesSiguiente(4)" style="background:linear-gradient(135deg,#c9a227,#8b6914);color:#0a0a0a;border:none;padding:14px 40px;border-radius:25px;font-family:'Cinzel',serif;font-size:13px;font-weight:600;letter-spacing:1.5px;text-transform:uppercase;cursor:pointer;">Continuar</button>
                </div>
            </div>

            <!-- Pantalla 4: Confirmación (sin foto) -->
            <div class="duendes-pantalla" data-num="4" style="display:none;">
                <div style="background:rgba(201,162,39,0.1);border:1px solid rgba(201,162,39,0.3);border-radius:12px;padding:20px;margin-bottom:25px;">
                    <p style="color:#c9a227;font-family:'Cinzel',serif;font-size:14px;margin:0 0 10px;">Protección de menores</p>
                    <p style="color:rgba(255,255,255,0.7);font-family:'Cormorant Garamond',serif;font-size:14px;margin:0;">
                        Para proteger a los más pequeños, no pedimos fotos de menores.<br>
                        El guardián se conectará a través de tu amor y lo que nos contaste.
                    </p>
                </div>

                <div style="text-align:left;margin-bottom:25px;">
                    <label style="display:flex;align-items:center;gap:10px;cursor:pointer;">
                        <input type="checkbox" name="confirma_entendido" required style="width:20px;height:20px;accent-color:#c9a227;">
                        <span style="color:#fff;font-family:'Cormorant Garamond',serif;font-size:14px;">Entiendo y confirmo</span>
                    </label>
                </div>

                <div style="display:flex;gap:15px;justify-content:center;">
                    <button type="button" onclick="duendesAnterior(3)" style="background:transparent;color:#c9a227;border:1px solid rgba(201,162,39,0.4);padding:14px 30px;border-radius:25px;font-family:'Cinzel',serif;font-size:12px;cursor:pointer;">Atrás</button>
                    <button type="submit" id="duendes-btn-enviar" style="background:linear-gradient(135deg,#c9a227,#8b6914);color:#0a0a0a;border:none;padding:14px 40px;border-radius:25px;font-family:'Cinzel',serif;font-size:13px;font-weight:600;letter-spacing:1.5px;text-transform:uppercase;cursor:pointer;">Completar conexión</button>
                </div>
            </div>
        </div>

        <input type="hidden" name="order_id" value="<?php echo esc_attr($order_id); ?>">
        <input type="hidden" name="tipo_formulario" value="para_nino">
        <input type="hidden" name="action" value="duendes_guardar_canalizacion">
        <input type="hidden" name="nonce" value="<?php echo wp_create_nonce('duendes_canalizacion'); ?>">
    </div>

    <?php duendes_scripts_formulario_nino(); ?>
    <?php
}

function duendes_scripts_formulario_nino() {
    ?>
    <style>
    .duendes-edad-opt:hover, .duendes-edad-opt:has(input:checked),
    .duendes-rel-opt:hover, .duendes-rel-opt:has(input:checked),
    .duendes-pers-opt:hover, .duendes-pers-opt:has(input:checked),
    .duendes-sit-opt:hover, .duendes-sit-opt:has(input:checked) {
        border-color: #c9a227 !important;
        background: rgba(201,162,39,0.15) !important;
    }
    #duendes-canalizacion-form input:focus,
    #duendes-canalizacion-form textarea:focus {
        outline: none;
        border-color: #c9a227 !important;
        box-shadow: 0 0 10px rgba(201,162,39,0.3);
    }
    </style>

    <script>
    function duendesSiguiente(num) {
        var nombre = document.querySelector('[name="nombre_persona"]')?.value;
        if (nombre && document.getElementById('nombre-nino')) {
            document.getElementById('nombre-nino').textContent = nombre;
        }

        document.querySelectorAll('.duendes-pantalla').forEach(p => p.style.display = 'none');
        document.querySelector('.duendes-pantalla[data-num="'+num+'"]').style.display = 'block';
        window.scrollTo({top: document.getElementById('duendes-canalizacion-form').offsetTop - 50, behavior: 'smooth'});
    }
    function duendesAnterior(num) {
        document.querySelectorAll('.duendes-pantalla').forEach(p => p.style.display = 'none');
        document.querySelector('.duendes-pantalla[data-num="'+num+'"]').style.display = 'block';
    }

    document.getElementById('duendes-btn-enviar')?.addEventListener('click', function(e) {
        e.preventDefault();
        var form = document.getElementById('duendes-canalizacion-form');
        var btn = this;

        if (!form.querySelector('[name="confirma_entendido"]').checked) {
            alert('Confirmá que entendés la política de protección de menores');
            return;
        }

        btn.textContent = 'Enviando...';
        btn.style.opacity = '0.5';

        var formData = new FormData();
        formData.append('action', 'duendes_guardar_canalizacion');
        formData.append('nonce', form.querySelector('[name="nonce"]').value);
        formData.append('order_id', form.querySelector('[name="order_id"]').value);
        formData.append('tipo_formulario', form.querySelector('[name="tipo_formulario"]').value);
        formData.append('nombre_persona', form.querySelector('[name="nombre_persona"]')?.value || '');
        formData.append('edad_nino', form.querySelector('[name="edad_nino"]:checked')?.value || '');
        formData.append('relacion', form.querySelector('[name="relacion"]:checked')?.value || '');
        formData.append('que_le_gusta_nino', form.querySelector('[name="que_le_gusta_nino"]')?.value || '');
        formData.append('mensaje_guardian', form.querySelector('[name="mensaje_guardian"]')?.value || '');

        var personalidad = [];
        form.querySelectorAll('[name="personalidad[]"]:checked').forEach(function(cb) {
            personalidad.push(cb.value);
        });
        formData.append('personalidad', JSON.stringify(personalidad));

        var situaciones = [];
        form.querySelectorAll('[name="situacion_nino[]"]:checked').forEach(function(cb) {
            situaciones.push(cb.value);
        });
        formData.append('situacion_nino', JSON.stringify(situaciones));

        fetch('<?php echo admin_url('admin-ajax.php'); ?>', {
            method: 'POST',
            body: formData
        })
        .then(r => r.json())
        .then(data => {
            if (data.success) {
                var nombre = form.querySelector('[name="nombre_persona"]')?.value || 'el niño/a';
                form.innerHTML = '<div style="text-align:center;padding:40px 0;"><h3 style="color:#c9a227;font-family:Cinzel,serif;font-size:22px;margin:0 0 15px;">¡Conexión establecida!</h3><p style="color:rgba(255,255,255,0.7);font-family:Cormorant Garamond,serif;font-size:16px;">El guardián ahora conoce a ' + nombre + ' y pronto le escribirá su mensaje especial.</p></div>';
            } else {
                alert(data.data || 'Error al enviar');
                btn.textContent = 'Completar conexión';
                btn.style.opacity = '1';
            }
        });
    });
    </script>
    <?php
}

// ═══════════════════════════════════════════════════════════════════════════
// EMAIL PARA DESTINATARIO (VÍA 2)
// ═══════════════════════════════════════════════════════════════════════════

function duendes_enviar_email_destinatario($order_id, $datos) {
    $order = wc_get_order($order_id);
    if (!$order) return;

    $nombre_destinatario = $datos['nombre'] ?? 'Alguien especial';
    $email_destinatario = $datos['email_destinatario'] ?? '';
    $mensaje_personal = $datos['mensaje_personal'] ?? '';

    if (!$email_destinatario) return;

    // Crear token único para el formulario
    $token = wp_generate_password(32, false);
    update_post_meta($order_id, '_duendes_token_destinatario', $token);

    $link_formulario = add_query_arg([
        'duendes_form' => $token,
        'order' => $order_id
    ], home_url('/mi-conexion/'));

    $asunto = "Alguien te regaló una experiencia mágica";

    $html = '
    <div style="max-width:600px;margin:0 auto;background:#0a0a0a;color:#fff;font-family:Georgia,serif;padding:40px;">
        <div style="text-align:center;margin-bottom:30px;">
            <h1 style="color:#c9a227;font-size:28px;margin:0 0 10px;font-family:serif;">Hola ' . esc_html($nombre_destinatario) . '</h1>
            <p style="color:rgba(255,255,255,0.7);font-size:18px;margin:0;font-style:italic;">Alguien que te quiere te regaló algo especial.</p>
        </div>

        ' . ($mensaje_personal ? '<div style="background:rgba(201,162,39,0.1);border-left:3px solid #c9a227;padding:20px;margin:25px 0;"><p style="color:rgba(255,255,255,0.8);font-size:16px;margin:0;font-style:italic;">"' . esc_html($mensaje_personal) . '"</p></div>' : '') . '

        <p style="color:rgba(255,255,255,0.8);font-size:16px;line-height:1.7;">
            Un guardián está esperando conocerte. Para que pueda hablarte de verdad - no con frases genéricas sino con palabras que solo vos necesitás escuchar - necesita saber un poco de vos.
        </p>

        <div style="text-align:center;margin:35px 0;">
            <a href="' . esc_url($link_formulario) . '" style="display:inline-block;background:linear-gradient(135deg,#c9a227,#8b6914);color:#0a0a0a;text-decoration:none;padding:16px 40px;border-radius:25px;font-size:14px;font-weight:bold;letter-spacing:1px;">COMPLETAR MI CONEXIÓN</a>
        </div>

        <p style="color:rgba(255,255,255,0.5);font-size:14px;text-align:center;">
            Solo toma 2 minutos. Tu guardián te espera.
        </p>
    </div>';

    // Usar Resend en lugar de wp_mail
    duendes_enviar_email_resend($email_destinatario, $asunto, $html);
}

// Mensaje cuando ya completó
function duendes_mostrar_mensaje_completado() {
    ?>
    <div style="margin:30px 0;background:linear-gradient(145deg,#0a0a0a,#1a1a1a);border:1px solid rgba(201,162,39,0.3);border-radius:20px;padding:40px;text-align:center;">
        <h3 style="color:#c9a227;font-family:'Cinzel',serif;font-size:22px;margin:0 0 15px;">¡Conexión establecida!</h3>
        <p style="color:rgba(255,255,255,0.7);font-family:'Cormorant Garamond',serif;font-size:16px;">
            Ya completaste el formulario. Tu guardián te conoce y pronto recibirás su mensaje personal.
        </p>
    </div>
    <?php
}
