<?php
/**
 * Plugin Name: Duendes - Emails Mágicos
 * Description: Sistema completo de emails automáticos con plantillas hermosas
 * Version: 1.0
 * Author: Duendes del Uruguay
 */

if (!defined('ABSPATH')) exit;

// ═══════════════════════════════════════════════════════════════════════════
// CONFIGURACIÓN DE EMAIL
// ═══════════════════════════════════════════════════════════════════════════

// Configurar el "From" de los emails
add_filter('wp_mail_from', function($email) {
    return 'hola@duendesdeluruguay.com';
});

add_filter('wp_mail_from_name', function($name) {
    return 'Duendes del Uruguay';
});

// Configurar contenido HTML por defecto
add_filter('wp_mail_content_type', function() {
    return 'text/html';
});

// ═══════════════════════════════════════════════════════════════════════════
// PLANTILLA BASE DE EMAIL
// ═══════════════════════════════════════════════════════════════════════════

function duendes_email_template($contenido, $titulo = '', $subtitulo = '', $cta_texto = '', $cta_url = '') {
    $logo_url = 'https://duendesdeluruguay.com/wp-content/uploads/2024/logo-duendes.png';

    return '<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>' . esc_html($titulo) . '</title>
    <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600&display=swap" rel="stylesheet">
</head>
<body style="margin:0;padding:0;background-color:#0a0a0f;font-family:Georgia,serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0a0a0f;padding:40px 20px;">
        <tr>
            <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
                    <!-- Header -->
                    <tr>
                        <td align="center" style="padding:30px 0;">
                            <img src="' . esc_url($logo_url) . '" alt="Duendes del Uruguay" style="max-width:180px;height:auto;">
                        </td>
                    </tr>

                    <!-- Main Content -->
                    <tr>
                        <td style="background:linear-gradient(180deg,#1a1a28 0%,#0f0f18 100%);border-radius:20px;border:1px solid rgba(198,169,98,0.3);overflow:hidden;">
                            <!-- Decorative top border -->
                            <div style="height:4px;background:linear-gradient(90deg,#C6A962,#8B7355,#C6A962);"></div>

                            <div style="padding:40px 35px;">
                                ' . ($titulo ? '<h1 style="font-family:Cinzel,Georgia,serif;color:#C6A962;font-size:28px;margin:0 0 10px 0;text-align:center;letter-spacing:2px;">' . esc_html($titulo) . '</h1>' : '') . '
                                ' . ($subtitulo ? '<p style="color:rgba(255,255,255,0.6);font-size:16px;margin:0 0 30px 0;text-align:center;font-style:italic;">' . esc_html($subtitulo) . '</p>' : '') . '

                                <div style="color:rgba(255,255,255,0.85);font-size:16px;line-height:1.8;">
                                    ' . $contenido . '
                                </div>

                                ' . ($cta_texto && $cta_url ? '
                                <div style="text-align:center;margin-top:35px;">
                                    <a href="' . esc_url($cta_url) . '" style="display:inline-block;padding:16px 40px;background:linear-gradient(135deg,#C6A962 0%,#a88a42 100%);color:#000;text-decoration:none;font-family:Cinzel,Georgia,serif;font-size:15px;font-weight:600;border-radius:30px;letter-spacing:1px;">' . esc_html($cta_texto) . '</a>
                                </div>
                                ' : '') . '
                            </div>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="padding:30px 20px;text-align:center;">
                            <p style="color:rgba(255,255,255,0.4);font-size:13px;margin:0 0 15px 0;">
                                Con amor desde el bosque ancestral
                            </p>
                            <p style="color:rgba(255,255,255,0.3);font-size:12px;margin:0;">
                                <a href="https://duendesdeluruguay.com" style="color:#C6A962;text-decoration:none;">duendesdeluruguay.com</a>
                                &nbsp;•&nbsp;
                                <a href="https://instagram.com/duendesdeluruguay" style="color:#C6A962;text-decoration:none;">@duendesdeluruguay</a>
                            </p>
                            <p style="color:rgba(255,255,255,0.2);font-size:11px;margin:20px 0 0 0;">
                                Si no querés recibir más emails, <a href="#" style="color:rgba(255,255,255,0.3);">cancelá tu suscripción</a>
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>';
}

// ═══════════════════════════════════════════════════════════════════════════
// FUNCIÓN PARA ENVIAR EMAIL CON LOG
// ═══════════════════════════════════════════════════════════════════════════

function duendes_enviar_email($para, $asunto, $contenido, $titulo = '', $subtitulo = '', $cta_texto = '', $cta_url = '') {
    $html = duendes_email_template($contenido, $titulo, $subtitulo, $cta_texto, $cta_url);

    $headers = array(
        'Content-Type: text/html; charset=UTF-8',
        'From: Duendes del Uruguay <hola@duendesdeluruguay.com>'
    );

    // Log del email antes de enviar
    $log = get_option('duendes_email_log', array());
    $log_entry = array(
        'fecha' => current_time('mysql'),
        'para' => $para,
        'asunto' => $asunto,
        'estado' => 'enviando'
    );

    $enviado = wp_mail($para, $asunto, $html, $headers);

    $log_entry['estado'] = $enviado ? 'enviado' : 'fallido';
    $log_entry['error'] = $enviado ? '' : 'wp_mail() retornó false';

    array_unshift($log, $log_entry);
    $log = array_slice($log, 0, 100); // Mantener últimos 100
    update_option('duendes_email_log', $log);

    return $enviado;
}

// ═══════════════════════════════════════════════════════════════════════════
// DEBUG: LOG DE HOOKS WOOCOMMERCE
// ═══════════════════════════════════════════════════════════════════════════

function duendes_log_hook($hook_name, $order_id) {
    $log = get_option('duendes_hooks_log', array());
    array_unshift($log, array(
        'fecha' => current_time('mysql'),
        'hook' => $hook_name,
        'order_id' => $order_id
    ));
    $log = array_slice($log, 0, 50);
    update_option('duendes_hooks_log', $log);
}

// ═══════════════════════════════════════════════════════════════════════════
// 1. EMAIL DE COMPRA NUEVA
// ═══════════════════════════════════════════════════════════════════════════

add_action('woocommerce_new_order', function($order_id) {
    duendes_log_hook('woocommerce_new_order', $order_id);
    $order = wc_get_order($order_id);
    if (!$order) return;

    $email = $order->get_billing_email();
    $nombre = $order->get_billing_first_name();
    $items = $order->get_items();

    // Obtener nombres de productos
    $productos = array();
    foreach ($items as $item) {
        $productos[] = $item->get_name();
    }
    $productos_texto = implode(', ', $productos);

    $contenido = '
        <p style="font-size:20px;color:#C6A962;margin-bottom:20px;">¡Hola ' . esc_html($nombre) . '! ✨</p>

        <p>¡Qué emoción! Tu pedido acaba de llegar al bosque y ya estamos preparando todo para vos.</p>

        <div style="background:rgba(198,169,98,0.1);border-left:3px solid #C6A962;padding:20px;margin:25px 0;border-radius:0 10px 10px 0;">
            <p style="margin:0;color:#C6A962;font-weight:600;">Tu pedido incluye:</p>
            <p style="margin:10px 0 0 0;color:rgba(255,255,255,0.8);">' . esc_html($productos_texto) . '</p>
        </div>

        <p>En las próximas horas vas a recibir más noticias nuestras. Mientras tanto, tu guardián ya sabe que lo elegiste... y está ansioso por conocerte. 🌟</p>

        <p style="margin-top:25px;">
            <span style="color:#C6A962;">Número de pedido:</span> #' . $order_id . '<br>
            <span style="color:#C6A962;">Total:</span> $' . $order->get_total() . ' USD
        </p>
    ';

    duendes_enviar_email(
        $email,
        '✨ ¡Tu pedido mágico está en camino! - Pedido #' . $order_id,
        $contenido,
        '¡Gracias por tu compra!',
        'Tu guardián te está esperando',
        'Ver mi pedido',
        $order->get_view_order_url()
    );

    // Programar email de seguimiento para 2 días después
    wp_schedule_single_event(
        time() + (2 * DAY_IN_SECONDS),
        'duendes_email_seguimiento_2dias',
        array($order_id)
    );

}, 10, 1);

// ═══════════════════════════════════════════════════════════════════════════
// 2. EMAIL DE PAGO CONFIRMADO
// ═══════════════════════════════════════════════════════════════════════════

add_action('woocommerce_payment_complete', function($order_id) {
    duendes_log_hook('woocommerce_payment_complete', $order_id);
    $order = wc_get_order($order_id);
    if (!$order) return;

    $email = $order->get_billing_email();
    $nombre = $order->get_billing_first_name();

    $contenido = '
        <p style="font-size:20px;color:#C6A962;margin-bottom:20px;">¡' . esc_html($nombre) . ', tu pago fue confirmado! 🎉</p>

        <p>Todo está en orden. Ahora sí, la magia comienza oficialmente.</p>

        <div style="text-align:center;padding:30px 0;">
            <div style="font-size:60px;margin-bottom:15px;">🌟</div>
            <p style="color:#C6A962;font-size:18px;margin:0;">Tu canalización está siendo preparada</p>
        </div>

        <p>Un proceso especial está iniciando... Tu guardián está siendo conectado con tu energía para crear una canalización única, solo para vos.</p>

        <p><strong style="color:#C6A962;">¿Qué sigue?</strong></p>
        <ul style="color:rgba(255,255,255,0.8);padding-left:20px;">
            <li style="margin-bottom:10px;">En las próximas 24-48 horas recibirás tu canalización personalizada</li>
            <li style="margin-bottom:10px;">Te enviaremos un email cuando esté lista</li>
            <li>Podrás acceder a ella desde Mi Magia con tu código QR</li>
        </ul>
    ';

    duendes_enviar_email(
        $email,
        '💫 ¡Pago confirmado! Tu canalización está en proceso',
        $contenido,
        'Pago Confirmado',
        'La magia está en marcha'
    );
});

// ═══════════════════════════════════════════════════════════════════════════
// 3. EMAIL DE PEDIDO COMPLETADO
// ═══════════════════════════════════════════════════════════════════════════

add_action('woocommerce_order_status_completed', function($order_id) {
    duendes_log_hook('woocommerce_order_status_completed', $order_id);
    $order = wc_get_order($order_id);
    if (!$order) return;

    $email = $order->get_billing_email();
    $nombre = $order->get_billing_first_name();

    $contenido = '
        <p style="font-size:20px;color:#C6A962;margin-bottom:20px;">¡' . esc_html($nombre) . ', está todo listo! ✨</p>

        <div style="text-align:center;padding:25px 0;">
            <div style="font-size:70px;margin-bottom:15px;">🎁</div>
        </div>

        <p>Tu pedido ha sido completado y todo está disponible para vos.</p>

        <p><strong style="color:#C6A962;">¿Cómo acceder a tu canalización?</strong></p>
        <ol style="color:rgba(255,255,255,0.8);padding-left:20px;">
            <li style="margin-bottom:12px;">Entrá a <a href="https://duendesdeluruguay.com/mi-magia" style="color:#C6A962;">Mi Magia</a></li>
            <li style="margin-bottom:12px;">Ingresá el código que viene en tu tarjeta o usá el QR</li>
            <li style="margin-bottom:12px;">Verificá tu email para ver tu canalización personal</li>
            <li>¡Disfrutá de la conexión con tu guardián!</li>
        </ol>

        <p style="margin-top:25px;padding:20px;background:rgba(198,169,98,0.1);border-radius:10px;text-align:center;">
            <span style="color:rgba(255,255,255,0.6);">¿Tenés preguntas?</span><br>
            <a href="mailto:hola@duendesdeluruguay.com" style="color:#C6A962;">hola@duendesdeluruguay.com</a>
        </p>
    ';

    duendes_enviar_email(
        $email,
        '🎉 ¡Tu pedido está completo! Accedé a tu canalización',
        $contenido,
        '¡Todo Listo!',
        'Tu guardián te espera',
        'Ir a Mi Magia',
        'https://duendesdeluruguay.com/mi-magia'
    );
});

// ═══════════════════════════════════════════════════════════════════════════
// 4. EMAIL DE SEGUIMIENTO (2 DÍAS DESPUÉS)
// ═══════════════════════════════════════════════════════════════════════════

add_action('duendes_email_seguimiento_2dias', function($order_id) {
    $order = wc_get_order($order_id);
    if (!$order) return;

    $email = $order->get_billing_email();
    $nombre = $order->get_billing_first_name();

    $contenido = '
        <p style="font-size:20px;color:#C6A962;margin-bottom:20px;">Hola ' . esc_html($nombre) . ' 💫</p>

        <p>Han pasado un par de días desde que tu guardián llegó a tu vida y queríamos saber... ¿cómo va todo?</p>

        <div style="background:rgba(198,169,98,0.1);padding:25px;border-radius:12px;margin:25px 0;">
            <p style="margin:0;color:#C6A962;font-size:17px;">Algunas cosas que podés hacer:</p>
            <ul style="color:rgba(255,255,255,0.8);margin:15px 0 0 0;padding-left:20px;">
                <li style="margin-bottom:10px;">Releer tu canalización en un momento tranquilo</li>
                <li style="margin-bottom:10px;">Hacer el ritual de conexión que viene incluido</li>
                <li style="margin-bottom:10px;">Buscar un lugar especial para tu guardián</li>
                <li>Hablarle, aunque sea en tu mente 🌟</li>
            </ul>
        </div>

        <p>Si tenés alguna duda o querés compartir tu experiencia, respondé este email. Nos encanta saber cómo le va a cada guardián en su nuevo hogar.</p>

        <p style="color:rgba(255,255,255,0.6);font-style:italic;margin-top:25px;">
            Los primeros días son los más mágicos. Prestá atención a las señales. ✨
        </p>
    ';

    duendes_enviar_email(
        $email,
        '💭 ¿Cómo va todo con tu guardián?',
        $contenido,
        '¿Todo bien?',
        'Solo queríamos saber de vos'
    );
});

// ═══════════════════════════════════════════════════════════════════════════
// 5. EMAIL DE CARRITO ABANDONADO
// ═══════════════════════════════════════════════════════════════════════════

// Guardar carritos para seguimiento
add_action('woocommerce_add_to_cart', function() {
    if (!is_user_logged_in()) return;

    $user_id = get_current_user_id();
    $cart = WC()->cart->get_cart();

    if (!empty($cart)) {
        update_user_meta($user_id, 'duendes_cart_saved', array(
            'timestamp' => time(),
            'cart' => $cart,
            'notified' => false
        ));
    }
});

// Cron para verificar carritos abandonados
add_action('duendes_check_abandoned_carts', function() {
    $users = get_users(array(
        'meta_key' => 'duendes_cart_saved',
        'meta_compare' => 'EXISTS'
    ));

    foreach ($users as $user) {
        $cart_data = get_user_meta($user->ID, 'duendes_cart_saved', true);

        if (empty($cart_data) || $cart_data['notified']) continue;

        // Si pasaron más de 2 horas
        if (time() - $cart_data['timestamp'] > 2 * HOUR_IN_SECONDS) {
            $productos = array();
            foreach ($cart_data['cart'] as $item) {
                if (isset($item['data'])) {
                    $product = $item['data'];
                    if ($product) {
                        $productos[] = $product->get_name();
                    }
                }
            }

            if (!empty($productos)) {
                $contenido = '
                    <p style="font-size:20px;color:#C6A962;margin-bottom:20px;">Hola ' . esc_html($user->display_name) . ' 🌙</p>

                    <p>Notamos que dejaste algo especial en tu carrito... y queríamos que supieras que todavía está ahí, esperándote.</p>

                    <div style="background:rgba(198,169,98,0.15);border:1px solid rgba(198,169,98,0.3);padding:25px;border-radius:12px;margin:25px 0;">
                        <p style="margin:0 0 15px 0;color:#C6A962;font-weight:600;">En tu carrito:</p>
                        <p style="margin:0;color:rgba(255,255,255,0.85);">' . esc_html(implode(', ', $productos)) . '</p>
                    </div>

                    <p>Los guardianes eligen a sus humanos tanto como los humanos los eligen a ellos. Si sentiste una conexión, quizás sea por algo...</p>

                    <p style="color:rgba(255,255,255,0.6);font-style:italic;">
                        No hay presión. Solo queríamos recordarte que la magia sigue ahí. ✨
                    </p>
                ';

                duendes_enviar_email(
                    $user->user_email,
                    '🛒 Tu carrito te extraña...',
                    $contenido,
                    'Dejaste algo pendiente',
                    'Tu guardián sigue esperando',
                    'Volver al carrito',
                    wc_get_cart_url()
                );

                // Marcar como notificado
                $cart_data['notified'] = true;
                update_user_meta($user->ID, 'duendes_cart_saved', $cart_data);
            }
        }
    }
});

// Programar verificación de carritos abandonados cada hora
if (!wp_next_scheduled('duendes_check_abandoned_carts')) {
    wp_schedule_event(time(), 'hourly', 'duendes_check_abandoned_carts');
}

// ═══════════════════════════════════════════════════════════════════════════
// 6. EMAIL DE CANALIZACIÓN LISTA
// ═══════════════════════════════════════════════════════════════════════════

function duendes_email_canalizacion_lista($email, $nombre, $nombre_guardian, $codigo = '') {
    $contenido = '
        <p style="font-size:20px;color:#C6A962;margin-bottom:20px;">¡' . esc_html($nombre) . ', tu canalización está lista! ✨</p>

        <div style="text-align:center;padding:30px 0;">
            <div style="font-size:80px;margin-bottom:20px;">🔮</div>
            <p style="color:#C6A962;font-size:22px;margin:0;font-family:Cinzel,Georgia,serif;">' . esc_html($nombre_guardian) . '</p>
            <p style="color:rgba(255,255,255,0.6);font-style:italic;margin:10px 0 0 0;">ha canalizado un mensaje especial para vos</p>
        </div>

        <p>Este no es un texto genérico. Es una conexión única entre vos y tu guardián, basada en tu energía, tu momento y tu camino.</p>

        <p><strong style="color:#C6A962;">Para leer tu canalización:</strong></p>
        <ol style="color:rgba(255,255,255,0.8);padding-left:20px;">
            <li style="margin-bottom:10px;">Buscá un momento tranquilo</li>
            <li style="margin-bottom:10px;">Entrá a Mi Magia</li>
            <li style="margin-bottom:10px;">Ingresá tu código: <span style="color:#C6A962;font-family:monospace;">' . esc_html($codigo ?: 'el de tu tarjeta') . '</span></li>
            <li>Verificá tu email para acceder</li>
        </ol>

        <div style="background:rgba(198,169,98,0.1);padding:20px;border-radius:10px;margin-top:25px;text-align:center;">
            <p style="margin:0;color:rgba(255,255,255,0.7);font-style:italic;">
                "Leé despacio. Cada palabra fue elegida para vos."
            </p>
        </div>
    ';

    return duendes_enviar_email(
        $email,
        '🔮 ¡Tu canalización personal está lista!',
        $contenido,
        '¡Llegó tu canalización!',
        $nombre_guardian . ' tiene un mensaje para vos',
        'Leer mi canalización',
        'https://duendesdeluruguay.com/mi-magia' . ($codigo ? '?codigo=' . $codigo : '')
    );
}

// ═══════════════════════════════════════════════════════════════════════════
// 7. EMAIL DE NUEVO PRODUCTO
// ═══════════════════════════════════════════════════════════════════════════

function duendes_email_nuevo_producto($nombre_producto, $descripcion, $imagen_url, $precio, $url_producto) {
    // Obtener todos los usuarios con Mi Magia activo
    $usuarios = get_users(array(
        'meta_key' => 'mi_magia_active',
        'meta_value' => '1'
    ));

    $enviados = 0;

    foreach ($usuarios as $user) {
        $contenido = '
            <p style="font-size:20px;color:#C6A962;margin-bottom:20px;">¡Hola ' . esc_html($user->display_name) . '! 🌟</p>

            <p>Un nuevo guardián ha llegado al bosque y queríamos que fueras de las primeras en conocerlo...</p>

            <div style="text-align:center;padding:30px 0;">
                <img src="' . esc_url($imagen_url) . '" alt="' . esc_attr($nombre_producto) . '" style="max-width:250px;border-radius:15px;border:2px solid rgba(198,169,98,0.3);">
            </div>

            <h2 style="color:#C6A962;text-align:center;font-family:Cinzel,Georgia,serif;font-size:24px;margin:0 0 15px 0;">' . esc_html($nombre_producto) . '</h2>

            <p style="text-align:center;color:rgba(255,255,255,0.8);">' . esc_html($descripcion) . '</p>

            <p style="text-align:center;font-size:24px;color:#C6A962;margin:20px 0;">$' . esc_html($precio) . ' USD</p>
        ';

        $enviado = duendes_enviar_email(
            $user->user_email,
            '✨ Nuevo guardián disponible: ' . $nombre_producto,
            $contenido,
            '¡Recién llegado!',
            'Un nuevo guardián busca su hogar',
            'Conocer a ' . $nombre_producto,
            $url_producto
        );

        if ($enviado) $enviados++;

        // Pequeña pausa para no saturar
        usleep(100000); // 0.1 segundos
    }

    return $enviados;
}

// ═══════════════════════════════════════════════════════════════════════════
// 8. EMAIL DE BIENVENIDA (REGISTRO)
// ═══════════════════════════════════════════════════════════════════════════

add_action('user_register', function($user_id) {
    $user = get_user_by('ID', $user_id);
    if (!$user) return;

    $contenido = '
        <p style="font-size:20px;color:#C6A962;margin-bottom:20px;">¡Bienvenida al bosque, ' . esc_html($user->display_name ?: $user->user_login) . '! 🌳✨</p>

        <p>Acabás de dar el primer paso hacia un mundo donde la magia es real y los guardianes ancestrales esperan conectar con vos.</p>

        <div style="background:rgba(198,169,98,0.1);padding:25px;border-radius:12px;margin:25px 0;">
            <p style="color:#C6A962;margin:0 0 15px 0;font-weight:600;">¿Qué podés hacer ahora?</p>
            <ul style="color:rgba(255,255,255,0.8);margin:0;padding-left:20px;">
                <li style="margin-bottom:10px;">Explorar nuestros guardianes en la tienda</li>
                <li style="margin-bottom:10px;">Hacer el Test del Guardián para descubrir cuál te elige</li>
                <li style="margin-bottom:10px;">Conocer más sobre El Círculo, nuestra comunidad</li>
            </ul>
        </div>

        <p>Cada guardián tiene una historia de miles de años y un mensaje único para quien lo adopta. Cuando sientas la conexión, vas a saberlo.</p>

        <p style="color:rgba(255,255,255,0.6);font-style:italic;margin-top:25px;">
            El bosque te da la bienvenida. 🌙
        </p>
    ';

    duendes_enviar_email(
        $user->user_email,
        '🌳 ¡Bienvenida a Duendes del Uruguay!',
        $contenido,
        '¡Bienvenida!',
        'El bosque te estaba esperando',
        'Explorar guardianes',
        'https://duendesdeluruguay.com/tienda'
    );

    // Regalar runas de bienvenida
    update_user_meta($user_id, 'runas_poder', 25);
});

// ═══════════════════════════════════════════════════════════════════════════
// 9. EMAIL DE RECORDATORIO (PRODUCTO VISTO)
// ═══════════════════════════════════════════════════════════════════════════

// Guardar productos vistos
add_action('woocommerce_after_single_product', function() {
    global $product;
    if (!$product || !is_user_logged_in()) return;

    $user_id = get_current_user_id();
    $viewed = get_user_meta($user_id, 'duendes_productos_vistos', true) ?: array();

    $viewed[$product->get_id()] = array(
        'id' => $product->get_id(),
        'nombre' => $product->get_name(),
        'imagen' => wp_get_attachment_url($product->get_image_id()),
        'precio' => $product->get_price(),
        'url' => get_permalink($product->get_id()),
        'fecha' => time()
    );

    // Mantener últimos 10
    $viewed = array_slice($viewed, -10, 10, true);
    update_user_meta($user_id, 'duendes_productos_vistos', $viewed);
});

// Cron para enviar recordatorios de productos vistos
add_action('duendes_email_productos_vistos', function() {
    $users = get_users(array(
        'meta_key' => 'duendes_productos_vistos',
        'meta_compare' => 'EXISTS'
    ));

    foreach ($users as $user) {
        $viewed = get_user_meta($user->ID, 'duendes_productos_vistos', true);
        if (empty($viewed)) continue;

        // Buscar producto visto hace 24-48 horas y no comprado
        foreach ($viewed as $product_id => $data) {
            $tiempo_pasado = time() - $data['fecha'];

            // Entre 24 y 48 horas
            if ($tiempo_pasado > DAY_IN_SECONDS && $tiempo_pasado < 2 * DAY_IN_SECONDS) {
                // Verificar si ya compró este producto
                $orders = wc_get_orders(array(
                    'customer' => $user->user_email,
                    'limit' => -1
                ));

                $ya_compro = false;
                foreach ($orders as $order) {
                    foreach ($order->get_items() as $item) {
                        if ($item->get_product_id() == $product_id) {
                            $ya_compro = true;
                            break 2;
                        }
                    }
                }

                if (!$ya_compro) {
                    $contenido = '
                        <p style="font-size:20px;color:#C6A962;margin-bottom:20px;">Hola ' . esc_html($user->display_name) . ' 🌙</p>

                        <p>Ayer estuviste conociendo a alguien especial...</p>

                        <div style="text-align:center;padding:25px 0;">
                            <img src="' . esc_url($data['imagen']) . '" alt="' . esc_attr($data['nombre']) . '" style="max-width:200px;border-radius:12px;border:2px solid rgba(198,169,98,0.3);">
                            <h3 style="color:#C6A962;margin:20px 0 10px 0;font-family:Cinzel,Georgia,serif;">' . esc_html($data['nombre']) . '</h3>
                            <p style="color:rgba(255,255,255,0.6);margin:0;">$' . esc_html($data['precio']) . ' USD</p>
                        </div>

                        <p>No sé si lo sabías, pero los guardianes perciben cuando alguien los mira con interés. Si sentiste algo especial, quizás no fue casualidad...</p>

                        <p style="color:rgba(255,255,255,0.6);font-style:italic;">
                            Sin presiones. Solo un recordatorio de que sigue ahí. ✨
                        </p>
                    ';

                    duendes_enviar_email(
                        $user->user_email,
                        '👀 ¿Todavía pensando en ' . $data['nombre'] . '?',
                        $contenido,
                        '¿Te acordás?',
                        'Ayer conociste a alguien especial',
                        'Volver a verlo',
                        $data['url']
                    );

                    // Marcar como notificado
                    unset($viewed[$product_id]);
                    update_user_meta($user->ID, 'duendes_productos_vistos', $viewed);

                    break; // Solo un email por usuario por día
                }
            }
        }
    }
});

// Programar verificación diaria
if (!wp_next_scheduled('duendes_email_productos_vistos')) {
    wp_schedule_event(time(), 'daily', 'duendes_email_productos_vistos');
}

// ═══════════════════════════════════════════════════════════════════════════
// 10. EMAIL DE REVIEW REQUEST (7 DÍAS DESPUÉS)
// ═══════════════════════════════════════════════════════════════════════════

add_action('woocommerce_order_status_completed', function($order_id) {
    // Programar pedido de review para 7 días después
    wp_schedule_single_event(
        time() + (7 * DAY_IN_SECONDS),
        'duendes_email_pedir_review',
        array($order_id)
    );
}, 20);

add_action('duendes_email_pedir_review', function($order_id) {
    $order = wc_get_order($order_id);
    if (!$order) return;

    $email = $order->get_billing_email();
    $nombre = $order->get_billing_first_name();

    // Obtener primer producto
    $items = $order->get_items();
    $primer_item = reset($items);
    $producto_nombre = $primer_item ? $primer_item->get_name() : 'tu guardián';

    $contenido = '
        <p style="font-size:20px;color:#C6A962;margin-bottom:20px;">Hola ' . esc_html($nombre) . ' ✨</p>

        <p>Ya pasó una semana desde que ' . esc_html($producto_nombre) . ' llegó a tu vida. ¿Cómo va la conexión?</p>

        <p>Nos encantaría saber cómo te está yendo. Tu experiencia puede ayudar a otras personas que están buscando su guardián perfecto.</p>

        <div style="background:rgba(198,169,98,0.1);padding:25px;border-radius:12px;margin:25px 0;text-align:center;">
            <p style="color:#C6A962;margin:0 0 15px 0;">¿Nos dejás una reseña?</p>
            <p style="color:rgba(255,255,255,0.6);margin:0;font-size:14px;">Solo toma un minuto y significa muchísimo para nosotras 💛</p>
        </div>

        <p style="color:rgba(255,255,255,0.6);font-style:italic;">
            Gracias por ser parte de esta comunidad mágica. 🌙
        </p>
    ';

    duendes_enviar_email(
        $email,
        '💬 ¿Cómo va todo con ' . $producto_nombre . '?',
        $contenido,
        'Una semanita después...',
        'Nos encantaría saber de vos',
        'Dejar mi reseña',
        'https://duendesdeluruguay.com/mi-cuenta/orders/'
    );
});

// ═══════════════════════════════════════════════════════════════════════════
// ADMIN: VER LOG DE EMAILS
// ═══════════════════════════════════════════════════════════════════════════

add_action('admin_menu', function() {
    add_submenu_page(
        'duendes-tito',
        'Log de Emails',
        '📧 Emails',
        'manage_options',
        'duendes-emails',
        'duendes_emails_page'
    );
});

function duendes_emails_page() {
    $log = get_option('duendes_email_log', array());
    $hooks_log = get_option('duendes_hooks_log', array());
    ?>
    <div class="wrap duendes-wrap">
        <div class="duendes-header" style="background: linear-gradient(135deg, #fff0e6 0%, #fffaf0 100%); border-bottom: 2px solid #e08000;">
            <div>
                <h1 style="background: linear-gradient(90deg, #d07000, #e09000); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">📧 Emails Mágicos</h1>
                <p>Sistema de emails automáticos</p>
            </div>
            <button onclick="enviarEmailPrueba()" class="duendes-btn duendes-btn-primary">📨 Email de Prueba</button>
        </div>

        <div class="duendes-content">
            <!-- Probar emails específicos -->
            <div class="duendes-card" style="margin-bottom: 20px;">
                <div class="duendes-card-header">
                    <div class="duendes-card-icon" style="background: rgba(0, 200, 100, 0.2);">🧪</div>
                    <h3 class="duendes-card-title">Probar Emails Específicos</h3>
                </div>
                <p style="color: #666; margin-bottom: 15px;">Enviá un email de prueba de cada tipo para verificar que funcionen:</p>
                <div style="display: flex; gap: 10px; flex-wrap: wrap;">
                    <button onclick="probarEmail('compra')" class="duendes-btn duendes-btn-secondary">🛒 Compra Nueva</button>
                    <button onclick="probarEmail('pago')" class="duendes-btn duendes-btn-secondary">💳 Pago Confirmado</button>
                    <button onclick="probarEmail('completado')" class="duendes-btn duendes-btn-secondary">✅ Pedido Completado</button>
                    <button onclick="probarEmail('seguimiento')" class="duendes-btn duendes-btn-secondary">💭 Seguimiento 2 días</button>
                    <button onclick="probarEmail('bienvenida')" class="duendes-btn duendes-btn-secondary">👋 Bienvenida</button>
                    <button onclick="probarEmail('canalizacion')" class="duendes-btn duendes-btn-secondary">🔮 Canalización Lista</button>
                </div>
            </div>

            <!-- Log de Hooks WooCommerce -->
            <div class="duendes-card" style="margin-bottom: 20px;">
                <div class="duendes-card-header">
                    <div class="duendes-card-icon" style="background: rgba(100, 100, 255, 0.2);">🔗</div>
                    <h3 class="duendes-card-title">Hooks de WooCommerce (Debug)</h3>
                </div>
                <?php if (empty($hooks_log)): ?>
                    <p style="color: #888; text-align: center; padding: 20px;">
                        No hay hooks registrados aún.<br>
                        <small>Cuando se cree un pedido real, aparecerá aquí.</small>
                    </p>
                <?php else: ?>
                    <table class="duendes-table">
                        <thead>
                            <tr>
                                <th>Fecha</th>
                                <th>Hook</th>
                                <th>Order ID</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php foreach (array_slice($hooks_log, 0, 10) as $entry): ?>
                            <tr>
                                <td><?php echo esc_html($entry['fecha']); ?></td>
                                <td><code><?php echo esc_html($entry['hook']); ?></code></td>
                                <td>#<?php echo esc_html($entry['order_id']); ?></td>
                            </tr>
                            <?php endforeach; ?>
                        </tbody>
                    </table>
                <?php endif; ?>
            </div>

            <div class="duendes-card">
                <div class="duendes-card-header">
                    <div class="duendes-card-icon" style="background: rgba(255, 136, 0, 0.2);">📋</div>
                    <h3 class="duendes-card-title">Últimos 100 emails</h3>
                </div>

                <?php if (empty($log)): ?>
                    <p style="color: #888; text-align: center; padding: 40px;">No hay emails registrados aún</p>
                <?php else: ?>
                    <table class="duendes-table">
                        <thead>
                            <tr>
                                <th>Fecha</th>
                                <th>Para</th>
                                <th>Asunto</th>
                                <th>Estado</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php foreach ($log as $entry): ?>
                            <tr>
                                <td><?php echo esc_html($entry['fecha']); ?></td>
                                <td><?php echo esc_html($entry['para']); ?></td>
                                <td><?php echo esc_html(substr($entry['asunto'], 0, 50)); ?>...</td>
                                <td>
                                    <?php if ($entry['estado'] === 'enviado'): ?>
                                        <span style="color: #00c070;">✓ Enviado</span>
                                    <?php else: ?>
                                        <span style="color: #ff4444;">✗ Fallido</span>
                                        <?php if (!empty($entry['error'])): ?>
                                            <br><small style="color:#888;"><?php echo esc_html($entry['error']); ?></small>
                                        <?php endif; ?>
                                    <?php endif; ?>
                                </td>
                            </tr>
                            <?php endforeach; ?>
                        </tbody>
                    </table>
                <?php endif; ?>

                <div style="margin-top: 30px; padding: 20px; background: #fff5e6; border-radius: 12px; border: 1px solid #e8ddd0;">
                    <h4 style="color: #c06000; margin: 0 0 15px 0;">⚠️ ¿Los emails no llegan?</h4>
                    <p style="color: #666; margin: 0 0 15px 0;">Si los emails aparecen como "enviados" pero no llegan, probablemente necesitás configurar SMTP. Opciones recomendadas:</p>
                    <ul style="color: #666; margin: 0; padding-left: 20px;">
                        <li><strong>WP Mail SMTP</strong> - Plugin gratuito, fácil de configurar</li>
                        <li><strong>Brevo (ex Sendinblue)</strong> - 300 emails/día gratis</li>
                        <li><strong>Mailgun</strong> - 5,000 emails/mes gratis</li>
                    </ul>
                </div>
            </div>
        </div>
    </div>

    <script>
    function enviarEmailPrueba() {
        var email = prompt('¿A qué email querés enviar la prueba?', '<?php echo wp_get_current_user()->user_email; ?>');
        if (email) {
            fetch('<?php echo admin_url('admin-ajax.php'); ?>', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: 'action=duendes_email_prueba&nonce=<?php echo wp_create_nonce('duendes_admin'); ?>&email=' + encodeURIComponent(email)
            })
            .then(r => r.json())
            .then(result => {
                if (result.success) {
                    alert('✅ Email de prueba enviado a ' + email + '\n\nRevisá tu bandeja de entrada (y spam).');
                    location.reload();
                } else {
                    alert('❌ Error: ' + (result.data?.message || 'Error desconocido'));
                }
            });
        }
    }

    function probarEmail(tipo) {
        var email = prompt('¿A qué email querés enviar el email de ' + tipo + '?', '<?php echo wp_get_current_user()->user_email; ?>');
        if (email) {
            fetch('<?php echo admin_url('admin-ajax.php'); ?>', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: 'action=duendes_email_probar_tipo&nonce=<?php echo wp_create_nonce('duendes_admin'); ?>&email=' + encodeURIComponent(email) + '&tipo=' + encodeURIComponent(tipo)
            })
            .then(r => r.json())
            .then(result => {
                if (result.success) {
                    alert('✅ Email de "' + tipo + '" enviado a ' + email + '\n\n' + (result.data?.message || 'Revisá tu bandeja de entrada.'));
                    location.reload();
                } else {
                    alert('❌ Error: ' + (result.data?.message || 'Error desconocido'));
                }
            });
        }
    }
    </script>
    <?php
}

// AJAX para email de prueba
add_action('wp_ajax_duendes_email_prueba', function() {
    check_ajax_referer('duendes_admin', 'nonce');

    $email = sanitize_email($_POST['email']);

    $contenido = '
        <p style="font-size:20px;color:#C6A962;margin-bottom:20px;">¡Este es un email de prueba! 🧪</p>

        <p>Si estás leyendo esto, significa que los emails de Duendes del Uruguay están funcionando correctamente.</p>

        <div style="background:rgba(198,169,98,0.1);padding:25px;border-radius:12px;margin:25px 0;text-align:center;">
            <p style="color:#C6A962;margin:0;">✓ El sistema de emails está activo</p>
        </div>

        <p><strong style="color:#C6A962;">Información técnica:</strong></p>
        <ul style="color:rgba(255,255,255,0.8);padding-left:20px;">
            <li>Fecha: ' . current_time('d/m/Y H:i:s') . '</li>
            <li>Servidor: ' . gethostname() . '</li>
            <li>WordPress: ' . get_bloginfo('version') . '</li>
        </ul>

        <p style="color:rgba(255,255,255,0.6);font-style:italic;margin-top:25px;">
            Si recibiste este email, todo está funcionando. ✨
        </p>
    ';

    $enviado = duendes_enviar_email(
        $email,
        '🧪 Email de prueba - Duendes del Uruguay',
        $contenido,
        'Email de Prueba',
        'Verificación del sistema de emails'
    );

    if ($enviado) {
        wp_send_json_success(['message' => 'Email enviado']);
    } else {
        wp_send_json_error(['message' => 'wp_mail() falló. Revisá la configuración SMTP.']);
    }
});

// ═══════════════════════════════════════════════════════════════════════════
// FUNCIONES AUXILIARES PARA TITO
// ═══════════════════════════════════════════════════════════════════════════

// Tito puede enviar email a canalización lista
add_action('wp_ajax_tito_enviar_canalizacion_lista', function() {
    check_ajax_referer('duendes_admin', 'nonce');

    $email = sanitize_email($_POST['email']);
    $nombre = sanitize_text_field($_POST['nombre']);
    $nombre_guardian = sanitize_text_field($_POST['nombre_guardian']);
    $codigo = sanitize_text_field($_POST['codigo']);

    $enviado = duendes_email_canalizacion_lista($email, $nombre, $nombre_guardian, $codigo);

    if ($enviado) {
        wp_send_json_success(['mensaje' => "Email de canalización lista enviado a $email"]);
    } else {
        wp_send_json_error(['mensaje' => 'Error al enviar email']);
    }
});

// Tito puede enviar notificación de nuevo producto
add_action('wp_ajax_tito_notificar_nuevo_producto', function() {
    check_ajax_referer('duendes_admin', 'nonce');

    $nombre = sanitize_text_field($_POST['nombre_producto']);
    $descripcion = sanitize_text_field($_POST['descripcion']);
    $imagen = esc_url($_POST['imagen_url']);
    $precio = floatval($_POST['precio']);
    $url = esc_url($_POST['url_producto']);

    $enviados = duendes_email_nuevo_producto($nombre, $descripcion, $imagen, $precio, $url);

    wp_send_json_success(['mensaje' => "Notificación enviada a $enviados usuarios"]);
});

// ═══════════════════════════════════════════════════════════════════════════
// AJAX PARA PROBAR EMAILS ESPECÍFICOS
// ═══════════════════════════════════════════════════════════════════════════

add_action('wp_ajax_duendes_email_probar_tipo', function() {
    check_ajax_referer('duendes_admin', 'nonce');

    $email = sanitize_email($_POST['email']);
    $tipo = sanitize_text_field($_POST['tipo']);
    $enviado = false;
    $mensaje = '';

    switch ($tipo) {
        case 'compra':
            $contenido = '
                <p style="font-size:20px;color:#C6A962;margin-bottom:20px;">¡Hola Usuario de Prueba! ✨</p>
                <p>¡Qué emoción! Tu pedido acaba de llegar al bosque y ya estamos preparando todo para vos.</p>
                <div style="background:rgba(198,169,98,0.1);border-left:3px solid #C6A962;padding:20px;margin:25px 0;border-radius:0 10px 10px 0;">
                    <p style="margin:0;color:#C6A962;font-weight:600;">Tu pedido incluye:</p>
                    <p style="margin:10px 0 0 0;color:rgba(255,255,255,0.8);">Guardián de Prueba, Canalización Personalizada</p>
                </div>
                <p>En las próximas horas vas a recibir más noticias nuestras. Mientras tanto, tu guardián ya sabe que lo elegiste... y está ansioso por conocerte. 🌟</p>
                <p style="margin-top:25px;">
                    <span style="color:#C6A962;">Número de pedido:</span> #TEST-001<br>
                    <span style="color:#C6A962;">Total:</span> $99 USD
                </p>
            ';
            $enviado = duendes_enviar_email($email, '✨ [PRUEBA] ¡Tu pedido mágico está en camino!', $contenido, '¡Gracias por tu compra!', 'Tu guardián te está esperando');
            $mensaje = 'Email de compra nueva enviado';
            break;

        case 'pago':
            $contenido = '
                <p style="font-size:20px;color:#C6A962;margin-bottom:20px;">¡Usuario de Prueba, tu pago fue confirmado! 🎉</p>
                <p>Todo está en orden. Ahora sí, la magia comienza oficialmente.</p>
                <div style="text-align:center;padding:30px 0;">
                    <div style="font-size:60px;margin-bottom:15px;">🌟</div>
                    <p style="color:#C6A962;font-size:18px;margin:0;">Tu canalización está siendo preparada</p>
                </div>
                <p>Un proceso especial está iniciando... Tu guardián está siendo conectado con tu energía para crear una canalización única, solo para vos.</p>
            ';
            $enviado = duendes_enviar_email($email, '💫 [PRUEBA] ¡Pago confirmado!', $contenido, 'Pago Confirmado', 'La magia está en marcha');
            $mensaje = 'Email de pago confirmado enviado';
            break;

        case 'completado':
            $contenido = '
                <p style="font-size:20px;color:#C6A962;margin-bottom:20px;">¡Usuario de Prueba, está todo listo! ✨</p>
                <div style="text-align:center;padding:25px 0;">
                    <div style="font-size:70px;margin-bottom:15px;">🎁</div>
                </div>
                <p>Tu pedido ha sido completado y todo está disponible para vos.</p>
                <p><strong style="color:#C6A962;">¿Cómo acceder a tu canalización?</strong></p>
                <ol style="color:rgba(255,255,255,0.8);padding-left:20px;">
                    <li style="margin-bottom:12px;">Entrá a Mi Magia</li>
                    <li style="margin-bottom:12px;">Ingresá el código que viene en tu tarjeta</li>
                    <li>¡Disfrutá de la conexión con tu guardián!</li>
                </ol>
            ';
            $enviado = duendes_enviar_email($email, '🎉 [PRUEBA] ¡Tu pedido está completo!', $contenido, '¡Todo Listo!', 'Tu guardián te espera', 'Ir a Mi Magia', 'https://duendesdeluruguay.com/mi-magia');
            $mensaje = 'Email de pedido completado enviado';
            break;

        case 'seguimiento':
            $contenido = '
                <p style="font-size:20px;color:#C6A962;margin-bottom:20px;">Hola Usuario de Prueba 💫</p>
                <p>Han pasado un par de días desde que tu guardián llegó a tu vida y queríamos saber... ¿cómo va todo?</p>
                <div style="background:rgba(198,169,98,0.1);padding:25px;border-radius:12px;margin:25px 0;">
                    <p style="margin:0;color:#C6A962;font-size:17px;">Algunas cosas que podés hacer:</p>
                    <ul style="color:rgba(255,255,255,0.8);margin:15px 0 0 0;padding-left:20px;">
                        <li style="margin-bottom:10px;">Releer tu canalización en un momento tranquilo</li>
                        <li style="margin-bottom:10px;">Hacer el ritual de conexión que viene incluido</li>
                        <li>Hablarle, aunque sea en tu mente 🌟</li>
                    </ul>
                </div>
                <p style="color:rgba(255,255,255,0.6);font-style:italic;margin-top:25px;">
                    Los primeros días son los más mágicos. Prestá atención a las señales. ✨
                </p>
            ';
            $enviado = duendes_enviar_email($email, '💭 [PRUEBA] ¿Cómo va todo con tu guardián?', $contenido, '¿Todo bien?', 'Solo queríamos saber de vos');
            $mensaje = 'Email de seguimiento enviado';
            break;

        case 'bienvenida':
            $contenido = '
                <p style="font-size:20px;color:#C6A962;margin-bottom:20px;">¡Bienvenida al bosque, Usuario de Prueba! 🌳✨</p>
                <p>Acabás de dar el primer paso hacia un mundo donde la magia es real y los guardianes ancestrales esperan conectar con vos.</p>
                <div style="background:rgba(198,169,98,0.1);padding:25px;border-radius:12px;margin:25px 0;">
                    <p style="color:#C6A962;margin:0 0 15px 0;font-weight:600;">¿Qué podés hacer ahora?</p>
                    <ul style="color:rgba(255,255,255,0.8);margin:0;padding-left:20px;">
                        <li style="margin-bottom:10px;">Explorar nuestros guardianes en la tienda</li>
                        <li style="margin-bottom:10px;">Hacer el Test del Guardián</li>
                        <li>Conocer más sobre El Círculo</li>
                    </ul>
                </div>
                <p style="color:rgba(255,255,255,0.6);font-style:italic;margin-top:25px;">
                    El bosque te da la bienvenida. 🌙
                </p>
            ';
            $enviado = duendes_enviar_email($email, '🌳 [PRUEBA] ¡Bienvenida a Duendes del Uruguay!', $contenido, '¡Bienvenida!', 'El bosque te estaba esperando', 'Explorar guardianes', 'https://duendesdeluruguay.com/tienda');
            $mensaje = 'Email de bienvenida enviado';
            break;

        case 'canalizacion':
            $contenido = '
                <p style="font-size:20px;color:#C6A962;margin-bottom:20px;">¡Usuario de Prueba, tu canalización está lista! ✨</p>
                <div style="text-align:center;padding:30px 0;">
                    <div style="font-size:80px;margin-bottom:20px;">🔮</div>
                    <p style="color:#C6A962;font-size:22px;margin:0;font-family:Cinzel,Georgia,serif;">Guardián de Prueba</p>
                    <p style="color:rgba(255,255,255,0.6);font-style:italic;margin:10px 0 0 0;">ha canalizado un mensaje especial para vos</p>
                </div>
                <p>Este no es un texto genérico. Es una conexión única entre vos y tu guardián, basada en tu energía, tu momento y tu camino.</p>
                <div style="background:rgba(198,169,98,0.1);padding:20px;border-radius:10px;margin-top:25px;text-align:center;">
                    <p style="margin:0;color:rgba(255,255,255,0.7);font-style:italic;">
                        "Leé despacio. Cada palabra fue elegida para vos."
                    </p>
                </div>
            ';
            $enviado = duendes_enviar_email($email, '🔮 [PRUEBA] ¡Tu canalización personal está lista!', $contenido, '¡Llegó tu canalización!', 'Guardián de Prueba tiene un mensaje para vos', 'Leer mi canalización', 'https://duendesdeluruguay.com/mi-magia');
            $mensaje = 'Email de canalización lista enviado';
            break;

        default:
            wp_send_json_error(['message' => 'Tipo de email no reconocido: ' . $tipo]);
            return;
    }

    if ($enviado) {
        wp_send_json_success(['message' => $mensaje]);
    } else {
        wp_send_json_error(['message' => 'wp_mail() falló. Revisá la configuración SMTP.']);
    }
});
