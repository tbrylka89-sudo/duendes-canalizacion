<?php
/**
 * Plugin Name: Duendes - Sistema de Emails Unificado
 * Description: Sistema centralizado de emails usando Vercel API + Resend
 * Version: 2.0
 *
 * Este plugin reemplaza y unifica:
 * - duendes-emails-magicos.php
 * - duendes-emails-extras.php
 * - duendes-carrito-abandonado.php (parcial)
 * - duendes-elementor-emails.php
 *
 * Todos los emails pasan por la API de Vercel que usa Resend.
 */

if (!defined('ABSPATH')) exit;

// =============================================================================
// CONFIGURACIÓN
// =============================================================================

define('DUENDES_EMAIL_API_URL', 'https://duendes-vercel.vercel.app/api/email/send');
define('DUENDES_EMAIL_API_TOKEN', 'tyA60hi6sNH1Ftfc1jagbxKkPC35zCCl');
define('DUENDES_ADMIN_EMAIL', 'duendesdeluruguay@gmail.com');

// =============================================================================
// FUNCIÓN PRINCIPAL DE ENVÍO
// =============================================================================

/**
 * Enviar email via Vercel API
 *
 * @param string $to Email destinatario
 * @param string $subject Asunto
 * @param string $template Nombre del template (opcional)
 * @param array $data Datos para el template
 * @param string $html HTML directo (si no usa template)
 * @return bool
 */
function duendes_enviar_email_v2($to, $subject, $template = null, $data = [], $html = null) {
    $body = [
        'to' => $to,
        'subject' => $subject,
    ];

    if ($template) {
        $body['template'] = $template;
        $body['data'] = $data;
    } elseif ($html) {
        $body['html'] = $html;
    } else {
        error_log('Duendes Email: No se especificó template ni html');
        return false;
    }

    $response = wp_remote_post(DUENDES_EMAIL_API_URL, [
        'headers' => [
            'Content-Type' => 'application/json',
            'Authorization' => 'Bearer ' . DUENDES_EMAIL_API_TOKEN,
        ],
        'body' => json_encode($body),
        'timeout' => 15,
    ]);

    if (is_wp_error($response)) {
        error_log('Duendes Email Error: ' . $response->get_error_message());
        // Fallback a wp_mail
        return duendes_enviar_email_fallback($to, $subject, $html ?: $template);
    }

    $result = json_decode(wp_remote_retrieve_body($response), true);

    if (isset($result['success']) && $result['success']) {
        error_log("Duendes Email: Enviado a $to - Template: $template");
        return true;
    }

    error_log('Duendes Email Error: ' . ($result['error'] ?? 'Unknown error'));
    return false;
}

/**
 * Fallback usando wp_mail si la API falla
 */
function duendes_enviar_email_fallback($to, $subject, $content) {
    $html = duendes_email_template_fallback($content);
    $headers = [
        'Content-Type: text/html; charset=UTF-8',
        'From: Duendes del Uruguay <hola@duendesdeluruguay.com>',
    ];
    return wp_mail($to, $subject, $html, $headers);
}

/**
 * Template de fallback simple
 */
function duendes_email_template_fallback($content) {
    return '<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:20px;background:#000;font-family:Georgia,serif;">
<div style="max-width:600px;margin:0 auto;background:#0a0a0a;padding:40px;border-radius:10px;">
<h1 style="color:#c9a227 !important;text-align:center;font-size:24px;margin:0 0 30px;">Duendes del Uruguay</h1>
<div style="color:#fff !important;">' . $content . '</div>
<p style="color:#c9a227 !important;text-align:center;margin-top:30px;font-size:13px;">duendesdeluruguay.com</p>
</div>
</body>
</html>';
}

// =============================================================================
// HELPERS
// =============================================================================

/**
 * Obtener datos del guardián desde un producto
 */
function duendes_get_guardian_data($product_id) {
    $product = wc_get_product($product_id);
    if (!$product) return null;

    $image_id = $product->get_image_id();
    $image_url = $image_id ? wp_get_attachment_image_url($image_id, 'medium') : '';

    // Obtener categoría
    $terms = get_the_terms($product_id, 'product_cat');
    $categoria = '';
    if ($terms && !is_wp_error($terms)) {
        foreach ($terms as $term) {
            if ($term->parent > 0) {
                $categoria = $term->name;
                break;
            }
        }
        if (!$categoria && count($terms) > 0) {
            $categoria = $terms[0]->name;
        }
    }

    // Obtener tipo/especie
    $tipo = get_post_meta($product_id, '_duendes_especie', true) ?: 'Guardián';

    return [
        'nombre' => $product->get_name(),
        'imagen' => $image_url,
        'tipo' => $tipo,
        'categoria' => $categoria,
        'precio' => $product->get_price(),
        'url' => get_permalink($product_id),
    ];
}

/**
 * Obtener productos de una orden
 */
function duendes_get_order_products($order) {
    $productos = [];
    foreach ($order->get_items() as $item) {
        $product_id = $item->get_product_id();
        $guardian = duendes_get_guardian_data($product_id);
        if ($guardian) {
            $guardian['precio'] = $item->get_total();
            $productos[] = $guardian;
        }
    }
    return $productos;
}

// =============================================================================
// EMAILS DE COMPRA
// =============================================================================

/**
 * 1. Confirmación de compra (inmediato)
 */
add_action('woocommerce_thankyou', 'duendes_email_confirmacion_compra', 10, 1);
function duendes_email_confirmacion_compra($order_id) {
    $order = wc_get_order($order_id);
    if (!$order || $order->get_meta('_duendes_email_confirmacion_sent')) return;

    $email = $order->get_billing_email();
    $nombre = $order->get_billing_first_name();
    $productos = duendes_get_order_products($order);
    $primer_guardian = $productos[0] ?? null;

    // Link al formulario de canalización
    $form_token = md5($order_id . 'duendes' . $email);
    $link_formulario = home_url('/mi-conexion/?order=' . $order_id . '&token=' . $form_token);

    $enviado = duendes_enviar_email_v2(
        $email,
        '✨ ¡Gracias por tu compra! - Pedido #' . $order->get_order_number(),
        'emailConfirmacionCompra',
        [
            'nombreCliente' => $nombre,
            'numeroOrden' => $order->get_order_number(),
            'productos' => $productos,
            'total' => $order->get_total(),
            'linkFormulario' => $link_formulario,
            'linkMiMagia' => home_url('/mi-magia'),
        ]
    );

    if ($enviado) {
        $order->update_meta_data('_duendes_email_confirmacion_sent', true);
        $order->save();
    }
}

/**
 * 2. Pedido enviado
 */
add_action('woocommerce_order_status_completed', 'duendes_email_pedido_enviado', 10, 1);
function duendes_email_pedido_enviado($order_id) {
    $order = wc_get_order($order_id);
    if (!$order || $order->get_meta('_duendes_email_enviado_sent')) return;

    $email = $order->get_billing_email();
    $nombre = $order->get_billing_first_name();
    $productos = duendes_get_order_products($order);

    // Obtener tracking si existe
    $tracking = $order->get_meta('_tracking_number') ?: $order->get_meta('_wc_shipment_tracking_items');
    $tracking_code = '';
    $tracking_url = '';
    $carrier = 'Correo';

    if (is_array($tracking) && !empty($tracking)) {
        $tracking_code = $tracking[0]['tracking_number'] ?? '';
        $tracking_url = $tracking[0]['tracking_link'] ?? '';
        $carrier = $tracking[0]['tracking_provider'] ?? 'Correo';
    } elseif (is_string($tracking)) {
        $tracking_code = $tracking;
    }

    $enviado = duendes_enviar_email_v2(
        $email,
        '📦 ¡Tu guardián está en camino! - Pedido #' . $order->get_order_number(),
        'emailPedidoEnviado',
        [
            'nombreCliente' => $nombre,
            'numeroOrden' => $order->get_order_number(),
            'productos' => $productos,
            'codigoSeguimiento' => $tracking_code,
            'empresaEnvio' => $carrier,
            'linkSeguimiento' => $tracking_url,
        ]
    );

    if ($enviado) {
        $order->update_meta_data('_duendes_email_enviado_sent', true);
        $order->save();
    }
}

// =============================================================================
// EMAILS DE CARRITO ABANDONADO
// =============================================================================

/**
 * Guardar carrito en sesión para usuarios
 */
add_action('woocommerce_cart_updated', 'duendes_guardar_carrito_session');
function duendes_guardar_carrito_session() {
    if (!is_user_logged_in()) return;

    $cart = WC()->cart;
    if ($cart->is_empty()) {
        delete_user_meta(get_current_user_id(), '_duendes_abandoned_cart');
        return;
    }

    $cart_data = [
        'items' => [],
        'total' => $cart->get_total('edit'),
        'updated' => time(),
    ];

    foreach ($cart->get_cart() as $item) {
        $product_id = $item['product_id'];
        $guardian = duendes_get_guardian_data($product_id);
        if ($guardian) {
            $cart_data['items'][] = $guardian;
        }
    }

    update_user_meta(get_current_user_id(), '_duendes_abandoned_cart', $cart_data);
}

/**
 * Cron: Enviar emails de carrito abandonado
 */
add_action('duendes_check_abandoned_carts_v2', 'duendes_procesar_carritos_abandonados');
function duendes_procesar_carritos_abandonados() {
    $users = get_users([
        'meta_key' => '_duendes_abandoned_cart',
        'meta_compare' => 'EXISTS',
    ]);

    foreach ($users as $user) {
        $cart_data = get_user_meta($user->ID, '_duendes_abandoned_cart', true);
        if (!$cart_data || empty($cart_data['items'])) continue;

        $tiempo_abandonado = time() - $cart_data['updated'];
        $emails_enviados = get_user_meta($user->ID, '_duendes_cart_emails_sent', true) ?: 0;

        // No enviar si ya compró
        $orders = wc_get_orders([
            'customer' => $user->ID,
            'date_created' => '>' . $cart_data['updated'],
            'limit' => 1,
        ]);
        if (!empty($orders)) {
            delete_user_meta($user->ID, '_duendes_abandoned_cart');
            delete_user_meta($user->ID, '_duendes_cart_emails_sent');
            continue;
        }

        $primer_producto = $cart_data['items'][0];
        $link_carrito = wc_get_cart_url();

        // Email 1: 1 hora después
        if ($tiempo_abandonado >= HOUR_IN_SECONDS && $emails_enviados < 1) {
            duendes_enviar_email_v2(
                $user->user_email,
                '¿Te olvidaste de algo? ' . $primer_producto['nombre'] . ' te espera',
                'emailCarritoAbandonado1h',
                [
                    'nombreCliente' => $user->first_name ?: $user->display_name,
                    'productos' => $cart_data['items'],
                    'linkCarrito' => $link_carrito,
                ]
            );
            update_user_meta($user->ID, '_duendes_cart_emails_sent', 1);
        }

        // Email 2: 24 horas después
        elseif ($tiempo_abandonado >= DAY_IN_SECONDS && $emails_enviados < 2) {
            duendes_enviar_email_v2(
                $user->user_email,
                $primer_producto['nombre'] . ' sigue esperando...',
                'emailCarritoAbandonado24h',
                [
                    'nombreCliente' => $user->first_name ?: $user->display_name,
                    'productos' => $cart_data['items'],
                    'linkCarrito' => $link_carrito,
                ]
            );
            update_user_meta($user->ID, '_duendes_cart_emails_sent', 2);
        }

        // Email 3: 72 horas después con descuento
        elseif ($tiempo_abandonado >= (3 * DAY_IN_SECONDS) && $emails_enviados < 3) {
            // Generar código de descuento único
            $codigo = 'VUELVE' . strtoupper(substr(md5($user->ID . time()), 0, 6));

            // Crear cupón
            $coupon = new WC_Coupon();
            $coupon->set_code($codigo);
            $coupon->set_discount_type('percent');
            $coupon->set_amount(10);
            $coupon->set_individual_use(true);
            $coupon->set_usage_limit(1);
            $coupon->set_usage_limit_per_user(1);
            $coupon->set_date_expires(strtotime('+24 hours'));
            $coupon->set_email_restrictions([$user->user_email]);
            $coupon->save();

            duendes_enviar_email_v2(
                $user->user_email,
                'Última oportunidad: 10% OFF para ' . $primer_producto['nombre'],
                'emailCarritoAbandonado72h',
                [
                    'nombreCliente' => $user->first_name ?: $user->display_name,
                    'productos' => $cart_data['items'],
                    'linkCarrito' => add_query_arg('coupon', $codigo, $link_carrito),
                    'codigoDescuento' => $codigo,
                    'porcentajeDescuento' => 10,
                ]
            );
            update_user_meta($user->ID, '_duendes_cart_emails_sent', 3);
        }

        // Limpiar después de 7 días
        elseif ($tiempo_abandonado >= (7 * DAY_IN_SECONDS)) {
            delete_user_meta($user->ID, '_duendes_abandoned_cart');
            delete_user_meta($user->ID, '_duendes_cart_emails_sent');
        }
    }
}

// Programar cron
if (!wp_next_scheduled('duendes_check_abandoned_carts_v2')) {
    wp_schedule_event(time(), 'hourly', 'duendes_check_abandoned_carts_v2');
}

// =============================================================================
// EMAILS DE CUMPLEAÑOS
// =============================================================================

/**
 * Guardar fecha de cumpleaños del usuario
 */
add_action('woocommerce_edit_account_form', 'duendes_birthday_field');
function duendes_birthday_field() {
    $user_id = get_current_user_id();
    $birthday = get_user_meta($user_id, '_duendes_birthday', true);
    ?>
    <p class="woocommerce-form-row woocommerce-form-row--wide form-row form-row-wide">
        <label for="duendes_birthday">Fecha de cumpleaños <span class="optional">(opcional)</span></label>
        <input type="date" class="woocommerce-Input woocommerce-Input--text input-text"
               name="duendes_birthday" id="duendes_birthday" value="<?php echo esc_attr($birthday); ?>">
        <span class="description" style="color:#888;font-size:12px;">
            Te enviaremos un regalo especial en tu día 🎁
        </span>
    </p>
    <?php
}

add_action('woocommerce_save_account_details', 'duendes_save_birthday_field');
function duendes_save_birthday_field($user_id) {
    if (isset($_POST['duendes_birthday'])) {
        update_user_meta($user_id, '_duendes_birthday', sanitize_text_field($_POST['duendes_birthday']));
    }
}

/**
 * Cron: Enviar emails de cumpleaños
 */
add_action('duendes_check_birthdays', 'duendes_enviar_emails_cumpleanos');
function duendes_enviar_emails_cumpleanos() {
    $hoy = date('m-d');

    $users = get_users([
        'meta_key' => '_duendes_birthday',
        'meta_compare' => 'EXISTS',
    ]);

    foreach ($users as $user) {
        $birthday = get_user_meta($user->ID, '_duendes_birthday', true);
        if (!$birthday) continue;

        $birthday_md = date('m-d', strtotime($birthday));
        $year = date('Y');

        // Verificar si es el día del cumpleaños y no se envió este año
        $last_sent = get_user_meta($user->ID, '_duendes_birthday_email_sent', true);

        if ($birthday_md === $hoy && $last_sent !== $year) {
            // Generar código de descuento de cumpleaños
            $codigo = 'CUMPLE' . strtoupper(substr(md5($user->ID . $year), 0, 6));

            // Crear cupón
            $coupon = new WC_Coupon();
            $coupon->set_code($codigo);
            $coupon->set_discount_type('percent');
            $coupon->set_amount(15);
            $coupon->set_individual_use(true);
            $coupon->set_usage_limit(1);
            $coupon->set_usage_limit_per_user(1);
            $coupon->set_date_expires(strtotime('+7 days'));
            $coupon->set_email_restrictions([$user->user_email]);
            $coupon->save();

            // Calcular fecha de expiración
            $fecha_expiracion = date('d/m/Y', strtotime('+7 days'));

            duendes_enviar_email_v2(
                $user->user_email,
                '🎂 ¡Feliz cumpleaños, ' . ($user->first_name ?: $user->display_name) . '! 15% OFF para vos',
                'emailCumpleanos',
                [
                    'nombreCliente' => $user->first_name ?: $user->display_name,
                    'codigoDescuento' => $codigo,
                    'porcentajeDescuento' => 15,
                    'fechaExpiracion' => $fecha_expiracion,
                ]
            );

            update_user_meta($user->ID, '_duendes_birthday_email_sent', $year);
        }
    }
}

// Programar cron diario para cumpleaños
if (!wp_next_scheduled('duendes_check_birthdays')) {
    wp_schedule_event(strtotime('09:00:00'), 'daily', 'duendes_check_birthdays');
}

// =============================================================================
// EMAILS DE CANALIZACIÓN
// =============================================================================

/**
 * Email: Recordatorio de formulario (24h)
 */
add_action('duendes_recordatorio_formulario_24h', 'duendes_enviar_recordatorio_24h', 10, 1);
function duendes_enviar_recordatorio_24h($order_id) {
    $order = wc_get_order($order_id);
    if (!$order) return;

    // Verificar si ya completó el formulario
    if ($order->get_meta('_duendes_formulario_completado')) return;

    $email = $order->get_billing_email();
    $nombre = $order->get_billing_first_name();
    $productos = duendes_get_order_products($order);
    $primer_guardian = $productos[0] ?? null;

    $form_token = md5($order_id . 'duendes' . $email);
    $link_formulario = home_url('/mi-conexion/?order=' . $order_id . '&token=' . $form_token);

    duendes_enviar_email_v2(
        $email,
        ($primer_guardian['nombre'] ?? 'Tu guardián') . ' está esperando...',
        'emailRecordatorio24h',
        [
            'nombreCliente' => $nombre,
            'nombreGuardian' => $primer_guardian['nombre'] ?? 'Tu guardián',
            'imagenGuardian' => $primer_guardian['imagen'] ?? '',
            'linkFormulario' => $link_formulario,
        ]
    );
}

/**
 * Email: Recordatorio urgente (72h)
 */
add_action('duendes_recordatorio_formulario_72h', 'duendes_enviar_recordatorio_72h', 10, 1);
function duendes_enviar_recordatorio_72h($order_id) {
    $order = wc_get_order($order_id);
    if (!$order) return;

    if ($order->get_meta('_duendes_formulario_completado')) return;

    $email = $order->get_billing_email();
    $nombre = $order->get_billing_first_name();
    $productos = duendes_get_order_products($order);
    $primer_guardian = $productos[0] ?? null;

    $form_token = md5($order_id . 'duendes' . $email);
    $link_formulario = home_url('/mi-conexion/?order=' . $order_id . '&token=' . $form_token);

    duendes_enviar_email_v2(
        $email,
        'Última oportunidad para tu canalización personal',
        'emailRecordatorio72h',
        [
            'nombreCliente' => $nombre,
            'nombreGuardian' => $primer_guardian['nombre'] ?? 'Tu guardián',
            'linkFormulario' => $link_formulario,
        ]
    );
}

/**
 * Programar recordatorios al confirmar compra
 */
add_action('woocommerce_thankyou', 'duendes_programar_recordatorios', 20, 1);
function duendes_programar_recordatorios($order_id) {
    // 24 horas después
    wp_schedule_single_event(time() + DAY_IN_SECONDS, 'duendes_recordatorio_formulario_24h', [$order_id]);
    // 72 horas después
    wp_schedule_single_event(time() + (3 * DAY_IN_SECONDS), 'duendes_recordatorio_formulario_72h', [$order_id]);
}

/**
 * Email: Canalización lista
 */
function duendes_email_canalizacion_lista_v2($order_id) {
    $order = wc_get_order($order_id);
    if (!$order) return false;

    $email = $order->get_billing_email();
    $nombre = $order->get_billing_first_name();
    $productos = duendes_get_order_products($order);
    $primer_guardian = $productos[0] ?? null;

    $link_canalizacion = home_url('/mi-magia/?order=' . $order_id);

    return duendes_enviar_email_v2(
        $email,
        '🔮 Tu canalización está lista - ' . ($primer_guardian['nombre'] ?? 'Tu guardián') . ' tiene un mensaje para vos',
        'emailCanalizacionLista',
        [
            'nombreCliente' => $nombre,
            'nombreGuardian' => $primer_guardian['nombre'] ?? 'Tu guardián',
            'imagenGuardian' => $primer_guardian['imagen'] ?? '',
            'linkCanalizacion' => $link_canalizacion,
        ]
    );
}

// =============================================================================
// EMAILS DE MI MAGIA Y CÍRCULO
// =============================================================================

/**
 * Email: Bienvenida a Mi Magia
 */
add_action('duendes_mi_magia_activado', 'duendes_email_bienvenida_mi_magia', 10, 1);
function duendes_email_bienvenida_mi_magia($user_id) {
    $user = get_userdata($user_id);
    if (!$user) return;

    // Verificar si ya se envió
    if (get_user_meta($user_id, '_duendes_mi_magia_welcome_sent', true)) return;

    duendes_enviar_email_v2(
        $user->user_email,
        '✨ Bienvenida a Mi Magia - Tu portal personal está listo',
        'emailBienvenidaMiMagia',
        [
            'nombreCliente' => $user->first_name ?: $user->display_name,
            'linkMiMagia' => home_url('/mi-magia'),
            'linkPrimerGuardian' => home_url('/mi-magia'),
        ]
    );

    update_user_meta($user_id, '_duendes_mi_magia_welcome_sent', true);
}

/**
 * Email: Bienvenida al Círculo
 */
add_action('duendes_circulo_activado', 'duendes_email_bienvenida_circulo', 10, 1);
function duendes_email_bienvenida_circulo($user_id) {
    $user = get_userdata($user_id);
    if (!$user) return;

    duendes_enviar_email_v2(
        $user->user_email,
        '🌙 Bienvenida al Círculo de Duendes del Uruguay',
        'emailBienvenidaCirculo',
        [
            'nombreCliente' => $user->first_name ?: $user->display_name,
            'linkCirculo' => home_url('/circulo'),
        ]
    );
}

// =============================================================================
// EMAILS DE POST-VENTA
// =============================================================================

/**
 * Email: Seguimiento 7 días después
 */
add_action('duendes_post_compra_7dias', 'duendes_email_post_compra_7dias', 10, 1);
function duendes_email_post_compra_7dias($order_id) {
    $order = wc_get_order($order_id);
    if (!$order || $order->get_meta('_duendes_post_7dias_sent')) return;

    $email = $order->get_billing_email();
    $nombre = $order->get_billing_first_name();
    $productos = duendes_get_order_products($order);
    $primer_guardian = $productos[0] ?? null;

    $link_resena = $primer_guardian['url'] ?? home_url('/tienda');

    duendes_enviar_email_v2(
        $email,
        '¿Cómo va todo con ' . ($primer_guardian['nombre'] ?? 'tu guardián') . '?',
        'emailPostCompra7dias',
        [
            'nombreCliente' => $nombre,
            'nombreGuardian' => $primer_guardian['nombre'] ?? 'tu guardián',
            'imagenGuardian' => $primer_guardian['imagen'] ?? '',
            'linkResena' => $link_resena . '#reviews',
            'linkMiMagia' => home_url('/mi-magia'),
        ]
    );

    $order->update_meta_data('_duendes_post_7dias_sent', true);
    $order->save();
}

/**
 * Email: Seguimiento 30 días después
 */
add_action('duendes_post_compra_30dias', 'duendes_email_post_compra_30dias', 10, 1);
function duendes_email_post_compra_30dias($order_id) {
    $order = wc_get_order($order_id);
    if (!$order || $order->get_meta('_duendes_post_30dias_sent')) return;

    $email = $order->get_billing_email();
    $nombre = $order->get_billing_first_name();
    $productos = duendes_get_order_products($order);
    $primer_guardian = $productos[0] ?? null;

    // Generar código de agradecimiento
    $codigo = 'GRACIAS' . strtoupper(substr(md5($order_id . time()), 0, 4));

    $coupon = new WC_Coupon();
    $coupon->set_code($codigo);
    $coupon->set_discount_type('percent');
    $coupon->set_amount(10);
    $coupon->set_individual_use(true);
    $coupon->set_usage_limit(1);
    $coupon->set_date_expires(strtotime('+30 days'));
    $coupon->set_email_restrictions([$email]);
    $coupon->save();

    duendes_enviar_email_v2(
        $email,
        'Un mes de magia con ' . ($primer_guardian['nombre'] ?? 'tu guardián'),
        'emailPostCompra30dias',
        [
            'nombreCliente' => $nombre,
            'nombreGuardian' => $primer_guardian['nombre'] ?? 'tu guardián',
            'linkTienda' => home_url('/tienda'),
            'codigoDescuento' => $codigo,
        ]
    );

    $order->update_meta_data('_duendes_post_30dias_sent', true);
    $order->save();
}

/**
 * Programar emails post-venta
 */
add_action('woocommerce_order_status_completed', 'duendes_programar_post_venta', 20, 1);
function duendes_programar_post_venta($order_id) {
    // 7 días después
    wp_schedule_single_event(time() + (7 * DAY_IN_SECONDS), 'duendes_post_compra_7dias', [$order_id]);
    // 30 días después
    wp_schedule_single_event(time() + (30 * DAY_IN_SECONDS), 'duendes_post_compra_30dias', [$order_id]);
}

// =============================================================================
// EMAILS DE PROMOCIONES
// =============================================================================

/**
 * Enviar email de promoción a todos o segmento
 */
function duendes_enviar_promo($template, $data, $segmento = 'todos') {
    $args = ['role__in' => ['customer', 'subscriber']];

    switch ($segmento) {
        case 'circulo':
            $args['meta_key'] = '_duendes_circulo_activo';
            $args['meta_value'] = '1';
            break;
        case 'compradores':
            // Usuarios que han comprado
            break;
    }

    $users = get_users($args);
    $enviados = 0;

    foreach ($users as $user) {
        $data['nombreCliente'] = $user->first_name ?: $user->display_name;

        $asunto = $data['titulo'] ?? '✨ Promoción especial de Duendes del Uruguay';

        if (duendes_enviar_email_v2($user->user_email, $asunto, $template, $data)) {
            $enviados++;
        }

        // Rate limiting
        if ($enviados % 10 === 0) {
            sleep(1);
        }
    }

    return $enviados;
}

// =============================================================================
// EMAILS ADMIN
// =============================================================================

/**
 * Notificar admin de nuevo pedido
 */
add_action('woocommerce_new_order', 'duendes_notificar_admin_nuevo_pedido', 10, 1);
function duendes_notificar_admin_nuevo_pedido($order_id) {
    $order = wc_get_order($order_id);
    if (!$order) return;

    $productos = duendes_get_order_products($order);

    duendes_enviar_email_v2(
        DUENDES_ADMIN_EMAIL,
        '🎉 Nuevo Pedido #' . $order->get_order_number() . ' - ' . $order->get_billing_first_name(),
        'emailNuevoPedidoAdmin',
        [
            'numeroOrden' => $order->get_order_number(),
            'nombreCliente' => $order->get_billing_first_name() . ' ' . $order->get_billing_last_name(),
            'emailCliente' => $order->get_billing_email(),
            'productos' => $productos,
            'total' => $order->get_total(),
            'direccion' => $order->get_formatted_billing_address(),
            'linkAdmin' => admin_url('post.php?post=' . $order_id . '&action=edit'),
        ]
    );
}

/**
 * Notificar admin cuando se completa formulario
 */
add_action('duendes_formulario_completado', 'duendes_notificar_admin_formulario', 10, 2);
function duendes_notificar_admin_formulario($order_id, $tipo_formulario) {
    $order = wc_get_order($order_id);
    if (!$order) return;

    duendes_enviar_email_v2(
        DUENDES_ADMIN_EMAIL,
        '📝 Formulario Completado - Pedido #' . $order->get_order_number(),
        'emailFormularioCompletadoAdmin',
        [
            'numeroOrden' => $order->get_order_number(),
            'nombreCliente' => $order->get_billing_first_name(),
            'tipoFormulario' => $tipo_formulario,
            'linkAdmin' => admin_url('post.php?post=' . $order_id . '&action=edit'),
        ]
    );
}

// =============================================================================
// AJAX PARA TESTING
// =============================================================================

add_action('wp_ajax_duendes_test_email_v2', 'duendes_ajax_test_email_v2');
function duendes_ajax_test_email_v2() {
    if (!current_user_can('manage_options')) {
        wp_send_json_error('No autorizado');
    }

    check_ajax_referer('duendes_admin', 'nonce');

    $email = sanitize_email($_POST['email']);
    $template = sanitize_text_field($_POST['template']);

    if (!$email || !$template) {
        wp_send_json_error('Faltan datos');
    }

    // Datos de prueba según template
    $test_data = [
        'emailTest' => ['nombre' => 'Thibisay'],
        'emailConfirmacionCompra' => [
            'nombreCliente' => 'Usuario Test',
            'numeroOrden' => '12345',
            'productos' => [[
                'nombre' => 'Guardián de Prueba',
                'imagen' => 'https://duendesdeluruguay.com/wp-content/uploads/2024/01/guardian-test.jpg',
                'tipo' => 'Duende místico',
                'precio' => 99,
            ]],
            'total' => 99,
            'linkFormulario' => home_url('/mi-conexion/?test=1'),
            'linkMiMagia' => home_url('/mi-magia'),
        ],
        'emailCumpleanos' => [
            'nombreCliente' => 'Usuario Test',
            'codigoDescuento' => 'CUMPLETEST',
            'porcentajeDescuento' => 15,
            'fechaExpiracion' => date('d/m/Y', strtotime('+7 days')),
        ],
        'emailCarritoAbandonado1h' => [
            'nombreCliente' => 'Usuario Test',
            'productos' => [[
                'nombre' => 'Guardián Abandonado',
                'imagen' => 'https://duendesdeluruguay.com/wp-content/uploads/2024/01/guardian-test.jpg',
                'tipo' => 'Pixie protector',
            ]],
            'linkCarrito' => wc_get_cart_url(),
        ],
    ];

    $data = $test_data[$template] ?? ['nombre' => 'Test'];

    $enviado = duendes_enviar_email_v2(
        $email,
        '🧪 [TEST] ' . $template,
        $template,
        $data
    );

    if ($enviado) {
        wp_send_json_success(['mensaje' => "Email de prueba enviado a $email"]);
    } else {
        wp_send_json_error(['mensaje' => 'Error al enviar email']);
    }
}

// =============================================================================
// ADMIN PAGE
// =============================================================================

add_action('admin_menu', 'duendes_emails_admin_menu');
function duendes_emails_admin_menu() {
    add_submenu_page(
        'woocommerce',
        'Emails Duendes',
        '📧 Emails',
        'manage_options',
        'duendes-emails',
        'duendes_emails_admin_page'
    );
}

function duendes_emails_admin_page() {
    $templates = [
        'emailTest' => 'Email de Prueba',
        'emailConfirmacionCompra' => 'Confirmación de Compra',
        'emailPedidoEnviado' => 'Pedido Enviado',
        'emailCarritoAbandonado1h' => 'Carrito Abandonado (1h)',
        'emailCarritoAbandonado24h' => 'Carrito Abandonado (24h)',
        'emailCarritoAbandonado72h' => 'Carrito Abandonado (72h)',
        'emailRecordatorio24h' => 'Recordatorio Formulario (24h)',
        'emailRecordatorio72h' => 'Recordatorio Formulario (72h)',
        'emailCanalizacionLista' => 'Canalización Lista',
        'emailCumpleanos' => 'Cumpleaños',
        'emailBienvenidaMiMagia' => 'Bienvenida Mi Magia',
        'emailBienvenidaCirculo' => 'Bienvenida Círculo',
        'emailPostCompra7dias' => 'Post-Compra (7 días)',
        'emailPostCompra30dias' => 'Post-Compra (30 días)',
    ];
    ?>
    <div class="wrap">
        <h1>📧 Sistema de Emails - Duendes del Uruguay</h1>

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-top:20px;">
            <!-- Test de emails -->
            <div style="background:#fff;padding:20px;border-radius:8px;box-shadow:0 1px 3px rgba(0,0,0,0.1);">
                <h2>🧪 Enviar Email de Prueba</h2>
                <form id="duendes-test-email-form">
                    <table class="form-table">
                        <tr>
                            <th>Email destino</th>
                            <td><input type="email" name="email" value="<?php echo wp_get_current_user()->user_email; ?>" class="regular-text"></td>
                        </tr>
                        <tr>
                            <th>Template</th>
                            <td>
                                <select name="template">
                                    <?php foreach ($templates as $key => $label): ?>
                                        <option value="<?php echo esc_attr($key); ?>"><?php echo esc_html($label); ?></option>
                                    <?php endforeach; ?>
                                </select>
                            </td>
                        </tr>
                    </table>
                    <?php wp_nonce_field('duendes_admin', 'nonce'); ?>
                    <button type="submit" class="button button-primary">Enviar Email de Prueba</button>
                    <span id="test-result" style="margin-left:10px;"></span>
                </form>
            </div>

            <!-- Stats -->
            <div style="background:#fff;padding:20px;border-radius:8px;box-shadow:0 1px 3px rgba(0,0,0,0.1);">
                <h2>📊 Estadísticas</h2>
                <?php
                global $wpdb;
                $carritos_abandonados = $wpdb->get_var("SELECT COUNT(*) FROM {$wpdb->usermeta} WHERE meta_key = '_duendes_abandoned_cart'");
                $cumpleanos_hoy = $wpdb->get_var($wpdb->prepare(
                    "SELECT COUNT(*) FROM {$wpdb->usermeta} WHERE meta_key = '_duendes_birthday' AND meta_value LIKE %s",
                    '%-' . date('m-d')
                ));
                ?>
                <table class="widefat" style="margin-top:15px;">
                    <tr><td>Carritos abandonados pendientes</td><td><strong><?php echo $carritos_abandonados; ?></strong></td></tr>
                    <tr><td>Cumpleaños hoy</td><td><strong><?php echo $cumpleanos_hoy; ?></strong></td></tr>
                </table>
            </div>
        </div>

        <div style="background:#fff;padding:20px;border-radius:8px;box-shadow:0 1px 3px rgba(0,0,0,0.1);margin-top:20px;">
            <h2>📋 Templates Disponibles</h2>
            <table class="widefat striped" style="margin-top:15px;">
                <thead>
                    <tr>
                        <th>Template</th>
                        <th>Descripción</th>
                        <th>Trigger</th>
                    </tr>
                </thead>
                <tbody>
                    <tr><td>emailConfirmacionCompra</td><td>Confirmación de compra</td><td>woocommerce_thankyou</td></tr>
                    <tr><td>emailPedidoEnviado</td><td>Pedido en camino</td><td>order_status_completed</td></tr>
                    <tr><td>emailCarritoAbandonado*</td><td>Secuencia carrito abandonado</td><td>Cron (1h, 24h, 72h)</td></tr>
                    <tr><td>emailRecordatorio*</td><td>Recordatorio formulario</td><td>Cron (24h, 72h)</td></tr>
                    <tr><td>emailCanalizacionLista</td><td>Canalización disponible</td><td>Manual</td></tr>
                    <tr><td>emailCumpleanos</td><td>Felicitación con 15% OFF</td><td>Cron diario</td></tr>
                    <tr><td>emailBienvenidaMiMagia</td><td>Acceso a Mi Magia</td><td>duendes_mi_magia_activado</td></tr>
                    <tr><td>emailBienvenidaCirculo</td><td>Membresía Círculo</td><td>duendes_circulo_activado</td></tr>
                    <tr><td>emailPostCompra*</td><td>Seguimiento post-venta</td><td>Cron (7d, 30d)</td></tr>
                </tbody>
            </table>
        </div>
    </div>

    <script>
    jQuery(function($) {
        $('#duendes-test-email-form').on('submit', function(e) {
            e.preventDefault();
            var $form = $(this);
            var $result = $('#test-result');

            $result.text('Enviando...');

            $.post(ajaxurl, {
                action: 'duendes_test_email_v2',
                email: $form.find('[name="email"]').val(),
                template: $form.find('[name="template"]').val(),
                nonce: $form.find('[name="nonce"]').val()
            }, function(response) {
                if (response.success) {
                    $result.html('<span style="color:green;">✅ ' + response.data.mensaje + '</span>');
                } else {
                    $result.html('<span style="color:red;">❌ ' + (response.data.mensaje || 'Error') + '</span>');
                }
            });
        });
    });
    </script>
    <?php
}

// =============================================================================
// CLEANUP AL DESACTIVAR
// =============================================================================

register_deactivation_hook(__FILE__, 'duendes_emails_deactivate');
function duendes_emails_deactivate() {
    wp_clear_scheduled_hook('duendes_check_abandoned_carts_v2');
    wp_clear_scheduled_hook('duendes_check_birthdays');
}
