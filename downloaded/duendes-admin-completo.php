<?php
/**
 * Plugin Name: Duendes - Admin Completo
 * Description: Sistema administrativo con Tito AI Chat
 * Version: 2.0
 * Author: Duendes del Uruguay
 */

if (!defined('ABSPATH')) exit;

define('DUENDES_ADMIN_VERSION', '2.1.0');
define('DUENDES_API_URL', 'https://duendes-vercel.vercel.app/api');

// ═══════════════════════════════════════════════════════════════════════════
// AJAX HANDLERS
// ═══════════════════════════════════════════════════════════════════════════

add_action('wp_ajax_duendes_regalar_runas', function() {
    check_ajax_referer('duendes_admin', 'nonce');
    $user_id = intval($_POST['user_id']);
    $cantidad = intval($_POST['cantidad']);
    $actual = intval(get_user_meta($user_id, 'runas_poder', true));
    update_user_meta($user_id, 'runas_poder', $actual + $cantidad);
    wp_send_json_success(['nueva_cantidad' => $actual + $cantidad]);
});

add_action('wp_ajax_duendes_toggle_mi_magia', function() {
    check_ajax_referer('duendes_admin', 'nonce');
    $user_id = intval($_POST['user_id']);
    $actual = get_user_meta($user_id, 'mi_magia_active', true);
    $nuevo = $actual ? '' : '1';
    update_user_meta($user_id, 'mi_magia_active', $nuevo);
    wp_send_json_success(['activo' => !empty($nuevo)]);
});

add_action('wp_ajax_duendes_crear_usuario', function() {
    check_ajax_referer('duendes_admin', 'nonce');
    $email = sanitize_email($_POST['email']);
    $nombre = sanitize_text_field($_POST['nombre']);

    if (!is_email($email)) {
        wp_send_json_error(['message' => 'Email inválido']);
        return;
    }

    $password = wp_generate_password(12);
    $user_id = wp_create_user($email, $password, $email);

    if (is_wp_error($user_id)) {
        wp_send_json_error(['message' => $user_id->get_error_message()]);
        return;
    }

    wp_update_user(['ID' => $user_id, 'display_name' => $nombre]);
    update_user_meta($user_id, 'runas_poder', 50);

    wp_send_json_success(['user_id' => $user_id, 'password' => $password]);
});

// ═══════════════════════════════════════════════════════════════════════════
// TITO SUPERPODERES - ACCIONES REALES
// ═══════════════════════════════════════════════════════════════════════════

// Crear cupón WooCommerce REAL
add_action('wp_ajax_tito_crear_cupon', function() {
    check_ajax_referer('duendes_admin', 'nonce');

    $codigo = sanitize_text_field($_POST['codigo']) ?: 'DUENDE' . strtoupper(wp_generate_password(6, false));
    $descuento = floatval($_POST['descuento']);
    $tipo = sanitize_text_field($_POST['tipo']) ?: 'percent'; // percent o fixed_cart
    $expira = sanitize_text_field($_POST['expira']);
    $uso_limite = intval($_POST['uso_limite']) ?: 0;
    $productos = isset($_POST['productos']) ? array_map('intval', $_POST['productos']) : [];

    $coupon = new WC_Coupon();
    $coupon->set_code($codigo);
    $coupon->set_discount_type($tipo);
    $coupon->set_amount($descuento);

    if ($expira) {
        $coupon->set_date_expires(strtotime($expira));
    }
    if ($uso_limite > 0) {
        $coupon->set_usage_limit($uso_limite);
    }
    if (!empty($productos)) {
        $coupon->set_product_ids($productos);
    }

    $coupon->save();

    wp_send_json_success([
        'id' => $coupon->get_id(),
        'codigo' => $codigo,
        'descuento' => $descuento,
        'tipo' => $tipo,
        'mensaje' => "Cupón $codigo creado: {$descuento}" . ($tipo == 'percent' ? '%' : ' USD') . " de descuento"
    ]);
});

// Enviar email
add_action('wp_ajax_tito_enviar_email', function() {
    check_ajax_referer('duendes_admin', 'nonce');

    $para = sanitize_email($_POST['para']);
    $asunto = sanitize_text_field($_POST['asunto']);
    $mensaje = wp_kses_post($_POST['mensaje']);
    $from_name = 'Duendes del Uruguay';

    $headers = [
        'Content-Type: text/html; charset=UTF-8',
        "From: $from_name <hola@duendesdeluruguay.com>"
    ];

    $enviado = wp_mail($para, $asunto, $mensaje, $headers);

    if ($enviado) {
        wp_send_json_success(['mensaje' => "Email enviado a $para"]);
    } else {
        wp_send_json_error(['mensaje' => 'Error al enviar email']);
    }
});

// Enviar email masivo
add_action('wp_ajax_tito_email_masivo', function() {
    check_ajax_referer('duendes_admin', 'nonce');

    $grupo = sanitize_text_field($_POST['grupo']); // todos, mi_magia, circulo
    $asunto = sanitize_text_field($_POST['asunto']);
    $mensaje = wp_kses_post($_POST['mensaje']);

    $args = ['number' => -1];

    if ($grupo === 'mi_magia') {
        $args['meta_key'] = 'mi_magia_active';
        $args['meta_value'] = '1';
    } elseif ($grupo === 'circulo') {
        $args['meta_key'] = 'circulo_member';
        $args['meta_value'] = '1';
    }

    $users = get_users($args);
    $enviados = 0;

    $headers = [
        'Content-Type: text/html; charset=UTF-8',
        'From: Duendes del Uruguay <hola@duendesdeluruguay.com>'
    ];

    foreach ($users as $user) {
        if (wp_mail($user->user_email, $asunto, $mensaje, $headers)) {
            $enviados++;
        }
    }

    wp_send_json_success(['mensaje' => "Emails enviados: $enviados de " . count($users)]);
});

// Crear automatización de email (guardar para envío programado)
add_action('wp_ajax_tito_crear_automatizacion', function() {
    check_ajax_referer('duendes_admin', 'nonce');

    $nombre = sanitize_text_field($_POST['nombre']);
    $trigger = sanitize_text_field($_POST['trigger']); // compra, registro, abandono, fecha
    $delay = intval($_POST['delay']); // minutos después del trigger
    $asunto = sanitize_text_field($_POST['asunto']);
    $mensaje = wp_kses_post($_POST['mensaje']);
    $grupo = sanitize_text_field($_POST['grupo']);

    $automatizaciones = get_option('duendes_automatizaciones', []);

    $nueva = [
        'id' => uniqid('auto_'),
        'nombre' => $nombre,
        'trigger' => $trigger,
        'delay' => $delay,
        'asunto' => $asunto,
        'mensaje' => $mensaje,
        'grupo' => $grupo,
        'activa' => true,
        'creada' => current_time('mysql')
    ];

    $automatizaciones[] = $nueva;
    update_option('duendes_automatizaciones', $automatizaciones);

    wp_send_json_success([
        'id' => $nueva['id'],
        'mensaje' => "Automatización '$nombre' creada. Se enviará $delay minutos después de: $trigger"
    ]);
});

// Obtener estadísticas del negocio
add_action('wp_ajax_tito_estadisticas', function() {
    check_ajax_referer('duendes_admin', 'nonce');

    global $wpdb;

    // Ventas del mes
    $ventas_mes = $wpdb->get_var("
        SELECT SUM(meta_value) FROM {$wpdb->postmeta} pm
        JOIN {$wpdb->posts} p ON p.ID = pm.post_id
        WHERE pm.meta_key = '_order_total'
        AND p.post_type = 'shop_order'
        AND p.post_status IN ('wc-completed', 'wc-processing')
        AND p.post_date >= DATE_FORMAT(NOW(), '%Y-%m-01')
    ");

    // Pedidos del mes
    $pedidos_mes = $wpdb->get_var("
        SELECT COUNT(*) FROM {$wpdb->posts}
        WHERE post_type = 'shop_order'
        AND post_status IN ('wc-completed', 'wc-processing')
        AND post_date >= DATE_FORMAT(NOW(), '%Y-%m-01')
    ");

    // Usuarios totales
    $usuarios_total = count_users();

    // Usuarios Mi Magia
    $mi_magia_count = $wpdb->get_var("
        SELECT COUNT(*) FROM {$wpdb->usermeta}
        WHERE meta_key = 'mi_magia_active' AND meta_value = '1'
    ");

    // Productos más vendidos
    $top_productos = $wpdb->get_results("
        SELECT p.post_title, SUM(oim.meta_value) as cantidad
        FROM {$wpdb->prefix}woocommerce_order_itemmeta oim
        JOIN {$wpdb->prefix}woocommerce_order_items oi ON oi.order_item_id = oim.order_item_id
        JOIN {$wpdb->posts} p ON p.ID = oim.meta_value
        WHERE oim.meta_key = '_product_id'
        AND oi.order_item_type = 'line_item'
        GROUP BY oim.meta_value
        ORDER BY cantidad DESC
        LIMIT 5
    ", ARRAY_A);

    wp_send_json_success([
        'ventas_mes' => floatval($ventas_mes) ?: 0,
        'pedidos_mes' => intval($pedidos_mes),
        'usuarios_total' => $usuarios_total['total_users'],
        'mi_magia_activos' => intval($mi_magia_count),
        'top_productos' => $top_productos ?: []
    ]);
});

// Ejecutar acción de Tito (dispatcher)
add_action('wp_ajax_tito_ejecutar_accion', function() {
    check_ajax_referer('duendes_admin', 'nonce');

    $accion = sanitize_text_field($_POST['accion']);
    $params = isset($_POST['params']) ? $_POST['params'] : [];

    switch ($accion) {
        case 'crear_cupon':
            $_POST = array_merge($_POST, $params);
            do_action('wp_ajax_tito_crear_cupon');
            break;

        case 'enviar_email':
            $_POST = array_merge($_POST, $params);
            do_action('wp_ajax_tito_enviar_email');
            break;

        case 'estadisticas':
            do_action('wp_ajax_tito_estadisticas');
            break;

        default:
            wp_send_json_error(['mensaje' => 'Acción no reconocida']);
    }
});

// ═══════════════════════════════════════════════════════════════════════════
// RECANALIZACIONES
// ═══════════════════════════════════════════════════════════════════════════

// Guardar solicitud de recanalización
add_action('wp_ajax_duendes_solicitar_recanalizacion', function() {
    check_ajax_referer('duendes_public', 'nonce');

    $user_id = get_current_user_id();
    $tipo = sanitize_text_field($_POST['tipo']); // nuestro o ajeno
    $nombre_duende = sanitize_text_field($_POST['nombre_duende']);
    $historia = sanitize_textarea_field($_POST['historia']);
    $momento_actual = sanitize_textarea_field($_POST['momento_actual']);

    // Manejar foto
    $foto_url = '';
    if (!empty($_FILES['foto'])) {
        require_once(ABSPATH . 'wp-admin/includes/image.php');
        require_once(ABSPATH . 'wp-admin/includes/file.php');
        require_once(ABSPATH . 'wp-admin/includes/media.php');

        $attachment_id = media_handle_upload('foto', 0);
        if (!is_wp_error($attachment_id)) {
            $foto_url = wp_get_attachment_url($attachment_id);
        }
    }

    $solicitud = [
        'id' => uniqid('recan_'),
        'user_id' => $user_id,
        'tipo' => $tipo,
        'nombre_duende' => $nombre_duende,
        'foto_url' => $foto_url,
        'historia' => $historia,
        'momento_actual' => $momento_actual,
        'estado' => 'pendiente', // pendiente, aprobado, rechazado, completado
        'precio' => $tipo === 'ajeno' ? 7 : 0,
        'pagado' => $tipo === 'nuestro', // Si es nuestro, no requiere pago
        'fecha' => current_time('mysql')
    ];

    $solicitudes = get_option('duendes_recanalizaciones', []);
    $solicitudes[] = $solicitud;
    update_option('duendes_recanalizaciones', $solicitudes);

    // Notificar admin
    wp_mail(
        get_option('admin_email'),
        'Nueva solicitud de Recanalización',
        "Nueva solicitud de recanalización:\n\nTipo: $tipo\nDuende: $nombre_duende\nUsuario ID: $user_id",
        ['Content-Type: text/plain; charset=UTF-8']
    );

    wp_send_json_success([
        'id' => $solicitud['id'],
        'mensaje' => $tipo === 'nuestro'
            ? 'Solicitud enviada. La revisaremos y te contactaremos pronto.'
            : 'Solicitud enviada. Una vez aprobada, podrás proceder al pago de $7 USD.'
    ]);
});

// Admin: Aprobar/rechazar recanalización
add_action('wp_ajax_duendes_gestionar_recanalizacion', function() {
    check_ajax_referer('duendes_admin', 'nonce');

    $id = sanitize_text_field($_POST['id']);
    $accion = sanitize_text_field($_POST['accion_recan']); // aprobar, rechazar
    $notas = sanitize_textarea_field($_POST['notas']);

    $solicitudes = get_option('duendes_recanalizaciones', []);

    foreach ($solicitudes as &$sol) {
        if ($sol['id'] === $id) {
            $sol['estado'] = $accion === 'aprobar' ? 'aprobado' : 'rechazado';
            $sol['notas_admin'] = $notas;
            $sol['fecha_revision'] = current_time('mysql');

            // Notificar usuario
            $user = get_user_by('ID', $sol['user_id']);
            if ($user) {
                $asunto = $accion === 'aprobar'
                    ? '¡Tu recanalización fue aprobada!'
                    : 'Sobre tu solicitud de recanalización';

                $mensaje = $accion === 'aprobar'
                    ? "¡Hola! Tu solicitud de recanalización para {$sol['nombre_duende']} fue aprobada."
                    : "Hola, lamentablemente no pudimos aprobar tu solicitud. $notas";

                if ($sol['tipo'] === 'ajeno' && $accion === 'aprobar') {
                    $mensaje .= "\n\nPara continuar, necesitás realizar el pago de $7 USD.";
                }

                wp_mail($user->user_email, $asunto, $mensaje);
            }
            break;
        }
    }

    update_option('duendes_recanalizaciones', $solicitudes);
    wp_send_json_success(['mensaje' => 'Solicitud ' . ($accion === 'aprobar' ? 'aprobada' : 'rechazada')]);
});

// ═══════════════════════════════════════════════════════════════════════════
// MENÚ PRINCIPAL
// ═══════════════════════════════════════════════════════════════════════════

add_action('admin_menu', function() {
    add_menu_page('Tito Admin', '🧙 Tito Admin', 'manage_options', 'duendes-tito', 'duendes_tito_chat_page', 'dashicons-star-filled', 3);
    add_submenu_page('duendes-tito', 'Chat con Tito', '💬 Chat', 'manage_options', 'duendes-tito', 'duendes_tito_chat_page');
    add_submenu_page('duendes-tito', 'Canalizaciones', '🔮 Canalizaciones', 'manage_options', 'duendes-canalizaciones', 'duendes_canalizaciones_page');
    add_submenu_page('duendes-tito', 'Recanalizaciones', '✨ Recanalizaciones', 'manage_options', 'duendes-recanalizaciones', 'duendes_recanalizaciones_page');
    add_submenu_page('duendes-tito', 'Usuarios', '👥 Usuarios', 'manage_options', 'duendes-usuarios', 'duendes_usuarios_page');
    add_submenu_page('duendes-tito', 'El Círculo', '🌙 El Círculo', 'manage_options', 'duendes-circulo', 'duendes_circulo_page');
    add_submenu_page('duendes-tito', 'Banners', '🎨 Banners', 'manage_options', 'duendes-banners', 'duendes_banners_page');
});

// ═══════════════════════════════════════════════════════════════════════════
// ESTILOS GLOBALES - TEMA NEON
// ═══════════════════════════════════════════════════════════════════════════

add_action('admin_head', function() {
    $screen = get_current_screen();
    if (strpos($screen->id, 'duendes') === false) return;
    ?>
    <style>
    /* Hide WordPress notices in our pages */
    .duendes-wrap .notice,
    .duendes-wrap .updated,
    .duendes-wrap .error,
    .duendes-wrap .update-nag,
    .duendes-wrap #message,
    .wrap > .notice,
    .wrap > .updated,
    #wpbody-content > .notice,
    #wpbody-content > .updated {
        display: none !important;
    }

    /* Reset WordPress admin styles for our pages - TEMA CREMITA */
    .duendes-wrap {
        margin: 0 !important;
        padding: 0 !important;
        max-width: 100% !important;
        background: #FDF8F3;
        min-height: 100vh;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    }

    /* Header con colores neon pero fondo claro */
    .duendes-header {
        background: linear-gradient(135deg, #fff9f0 0%, #fff5e6 100%);
        padding: 24px 30px;
        border-bottom: 2px solid #00b8a9;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .duendes-header h1 {
        margin: 0;
        font-size: 24px;
        font-weight: 700;
        background: linear-gradient(90deg, #00b8a9, #00d4aa);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
    }

    .duendes-header p {
        margin: 4px 0 0 0;
        color: #666;
        font-size: 14px;
    }

    /* Colores Neon sobre fondo claro */
    .neon-cyan { color: #00a8a8; }
    .neon-green { color: #00b060; }
    .neon-magenta { color: #d000d0; }
    .neon-orange { color: #e07000; }
    .neon-purple { color: #8800cc; }

    .bg-neon-cyan { background: #e6fffe; border: 2px solid #00b8a9; }
    .bg-neon-green { background: #e6fff0; border: 2px solid #00c070; }
    .bg-neon-magenta { background: #ffe6ff; border: 2px solid #d000d0; }
    .bg-neon-orange { background: #fff5e6; border: 2px solid #e08000; }
    .bg-neon-purple { background: #f5e6ff; border: 2px solid #9900dd; }

    /* Main Content */
    .duendes-content {
        padding: 30px;
        background: #FDF8F3;
    }

    /* Cards - Fondo cremita */
    .duendes-card {
        background: #FFFCF8;
        border: 1px solid #e8ddd0;
        border-radius: 16px;
        padding: 24px;
        margin-bottom: 24px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.05);
    }

    .duendes-card-header {
        display: flex;
        align-items: center;
        gap: 16px;
        margin-bottom: 20px;
        padding-bottom: 16px;
        border-bottom: 1px solid #e8ddd0;
    }

    .duendes-card-icon {
        width: 50px;
        height: 50px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 24px;
    }

    .duendes-card-title {
        font-size: 18px;
        font-weight: 600;
        color: #333;
        margin: 0;
    }

    /* Grid */
    .duendes-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 24px;
    }

    @media (max-width: 782px) {
        .duendes-grid { grid-template-columns: 1fr; }
    }

    /* Stats */
    .duendes-stat {
        text-align: center;
        padding: 24px;
    }

    .duendes-stat-value {
        font-size: 42px;
        font-weight: 800;
        color: #00a8a8;
    }

    .duendes-stat-label {
        font-size: 14px;
        color: #666;
        margin-top: 8px;
    }

    /* Buttons */
    .duendes-btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        padding: 14px 28px;
        border-radius: 10px;
        font-size: 14px;
        font-weight: 600;
        cursor: pointer;
        border: none;
        transition: all 0.3s;
        text-decoration: none;
    }

    .duendes-btn-primary {
        background: linear-gradient(135deg, #00b8a9 0%, #00d4aa 100%);
        color: #fff;
    }

    .duendes-btn-primary:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(0, 184, 169, 0.4);
        color: #fff;
    }

    .duendes-btn-secondary {
        background: #fff;
        color: #333;
        border: 1px solid #ddd;
    }

    .duendes-btn-secondary:hover {
        background: #f5f5f5;
        color: #333;
    }

    .duendes-btn-magenta {
        background: linear-gradient(135deg, #d000d0 0%, #e040e0 100%);
        color: #fff;
    }

    .duendes-btn-orange {
        background: linear-gradient(135deg, #e08000 0%, #f0a000 100%);
        color: #fff;
    }

    /* Forms */
    .duendes-form-group {
        margin-bottom: 20px;
    }

    .duendes-label {
        display: block;
        font-size: 12px;
        font-weight: 600;
        color: #666;
        margin-bottom: 8px;
        text-transform: uppercase;
        letter-spacing: 1px;
    }

    .duendes-input,
    .duendes-select,
    .duendes-textarea {
        width: 100%;
        padding: 14px 18px;
        background: #fff;
        border: 2px solid #e0d5c8;
        border-radius: 10px;
        font-size: 15px;
        color: #333;
        transition: all 0.3s;
        box-sizing: border-box;
    }

    .duendes-input:focus,
    .duendes-select:focus,
    .duendes-textarea:focus {
        outline: none;
        border-color: #00b8a9;
        box-shadow: 0 0 10px rgba(0, 184, 169, 0.2);
    }

    .duendes-textarea {
        min-height: 120px;
        resize: vertical;
    }

    .duendes-select option {
        background: #fff;
        color: #333;
    }

    /* Tables */
    .duendes-table {
        width: 100%;
        border-collapse: collapse;
    }

    .duendes-table th,
    .duendes-table td {
        padding: 14px 18px;
        text-align: left;
        border-bottom: 1px solid #e8ddd0;
        color: #333;
    }

    .duendes-table th {
        background: #f5f0ea;
        font-weight: 600;
        font-size: 12px;
        text-transform: uppercase;
        letter-spacing: 1px;
        color: #666;
    }

    .duendes-table tr:hover {
        background: #faf8f5;
    }

    /* Badges */
    .duendes-badge {
        display: inline-block;
        padding: 6px 14px;
        border-radius: 20px;
        font-size: 12px;
        font-weight: 600;
    }

    .duendes-badge-cyan { background: #e0f7f5; color: #008080; }
    .duendes-badge-green { background: #e0f5e8; color: #008050; }
    .duendes-badge-magenta { background: #f5e0f5; color: #a000a0; }
    .duendes-badge-orange { background: #f5ece0; color: #c06000; }

    /* Tabs */
    .duendes-tabs {
        display: flex;
        gap: 4px;
        margin-bottom: 24px;
        border-bottom: 2px solid #e8ddd0;
        flex-wrap: wrap;
    }

    .duendes-tab {
        padding: 14px 24px;
        background: none;
        border: none;
        font-size: 14px;
        font-weight: 600;
        color: #999;
        cursor: pointer;
        border-bottom: 3px solid transparent;
        margin-bottom: -2px;
        transition: all 0.3s;
    }

    .duendes-tab:hover {
        color: #00a8a8;
    }

    .duendes-tab.active {
        color: #00a8a8;
        border-bottom-color: #00b8a9;
    }

    .duendes-tab-content {
        display: none;
    }

    .duendes-tab-content.active {
        display: block;
    }

    /* ═══════════════════════════════════════════════════════════════════════
       CHAT INTERFACE - TITO - TEMA CREMITA
       ═══════════════════════════════════════════════════════════════════════ */

    .tito-chat-container {
        display: flex;
        flex-direction: column;
        height: calc(100vh - 200px);
        min-height: 500px;
        background: #FFFCF8;
        border-radius: 20px;
        border: 2px solid #e8ddd0;
        overflow: hidden;
        box-shadow: 0 4px 20px rgba(0,0,0,0.08);
    }

    .tito-chat-header {
        padding: 20px 24px;
        background: linear-gradient(135deg, #e6fffe 0%, #e0fff5 100%);
        border-bottom: 2px solid #00b8a9;
        display: flex;
        align-items: center;
        gap: 16px;
    }

    .tito-avatar {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: linear-gradient(135deg, #00b8a9, #00d4aa);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 28px;
        box-shadow: 0 4px 15px rgba(0, 184, 169, 0.3);
    }

    .tito-status {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 13px;
        color: #00a080;
    }

    .tito-status-dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: #00c080;
        box-shadow: 0 0 8px #00c080;
        animation: pulse 2s infinite;
    }

    @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.5; }
    }

    .tito-chat-messages {
        flex: 1;
        overflow-y: auto;
        padding: 24px;
        display: flex;
        flex-direction: column;
        gap: 16px;
        background: #FDF8F3;
    }

    .tito-message {
        max-width: 80%;
        padding: 16px 20px;
        border-radius: 16px;
        line-height: 1.6;
        animation: fadeIn 0.3s ease;
    }

    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
    }

    .tito-message-tito {
        align-self: flex-start;
        background: #fff;
        border: 1px solid #e0d5c8;
        color: #333;
        box-shadow: 0 2px 8px rgba(0,0,0,0.05);
    }

    .tito-message-user {
        align-self: flex-end;
        background: linear-gradient(135deg, #00b8a9 0%, #00d4aa 100%);
        color: #fff;
    }

    .tito-message-actions {
        margin-top: 12px;
        display: flex;
        gap: 8px;
        flex-wrap: wrap;
    }

    .tito-action-btn {
        padding: 8px 16px;
        background: #e6fffe;
        border: 1px solid #00b8a9;
        border-radius: 8px;
        color: #008080;
        font-size: 13px;
        cursor: pointer;
        transition: all 0.2s;
    }

    .tito-action-btn:hover {
        background: #00b8a9;
        color: #fff;
    }

    .tito-chat-input-container {
        padding: 20px 24px;
        background: #fff;
        border-top: 2px solid #e8ddd0;
    }

    .tito-chat-input-wrapper {
        display: flex;
        gap: 12px;
    }

    .tito-chat-input {
        flex: 1;
        padding: 16px 20px;
        background: #FFFCF8;
        border: 2px solid #e0d5c8;
        border-radius: 12px;
        font-size: 15px;
        color: #333;
        resize: none;
        min-height: 50px;
        max-height: 150px;
    }

    .tito-chat-input:focus {
        outline: none;
        border-color: #00b8a9;
        box-shadow: 0 0 10px rgba(0, 184, 169, 0.2);
    }

    .tito-chat-input::placeholder {
        color: #999;
    }

    .tito-send-btn {
        padding: 16px 24px;
        background: linear-gradient(135deg, #00b8a9 0%, #00d4aa 100%);
        border: none;
        border-radius: 12px;
        color: #fff;
        font-weight: 700;
        font-size: 16px;
        cursor: pointer;
        transition: all 0.3s;
    }

    .tito-send-btn:hover {
        transform: scale(1.05);
        box-shadow: 0 4px 20px rgba(0, 184, 169, 0.4);
    }

    .tito-quick-actions {
        display: flex;
        gap: 8px;
        margin-top: 12px;
        flex-wrap: wrap;
    }

    .tito-quick-btn {
        padding: 8px 16px;
        background: #f5f0ea;
        border: 1px solid #e0d5c8;
        border-radius: 20px;
        color: #666;
        font-size: 13px;
        cursor: pointer;
        transition: all 0.2s;
    }

    .tito-quick-btn:hover {
        background: #e6fffe;
        border-color: #00b8a9;
        color: #008080;
    }

    /* Loading */
    .tito-typing {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 16px 20px;
        background: #fff;
        border: 1px solid #e0d5c8;
        border-radius: 16px;
        max-width: 200px;
    }

    .tito-typing-dots {
        display: flex;
        gap: 4px;
    }

    .tito-typing-dot {
        width: 8px;
        height: 8px;
        background: #00b8a9;
        border-radius: 50%;
        animation: typing 1.4s infinite;
    }

    .tito-typing-dot:nth-child(2) { animation-delay: 0.2s; }
    .tito-typing-dot:nth-child(3) { animation-delay: 0.4s; }

    @keyframes typing {
        0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
        30% { transform: translateY(-8px); opacity: 1; }
    }

    /* Result Cards */
    .tito-result-card {
        background: #f5f0ea;
        border: 1px solid #e0d5c8;
        border-radius: 12px;
        padding: 16px;
        margin-top: 12px;
    }

    .tito-result-card h4 {
        margin: 0 0 8px 0;
        color: #00a8a8;
        font-size: 14px;
    }

    .tito-result-card pre {
        margin: 0;
        white-space: pre-wrap;
        color: #333;
        font-size: 14px;
        line-height: 1.6;
    }

    /* User Avatar */
    .duendes-user-avatar {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: linear-gradient(135deg, #d000d0, #e040e0);
        color: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 600;
        font-size: 14px;
    }

    /* Responsive */
    @media (max-width: 782px) {
        .tito-chat-container {
            height: calc(100vh - 150px);
            border-radius: 0;
        }
        .tito-message {
            max-width: 90%;
        }
        .duendes-content {
            padding: 16px;
        }
    }
    </style>
    <?php
});

// ═══════════════════════════════════════════════════════════════════════════
// 1. TITO CHAT - PÁGINA PRINCIPAL
// ═══════════════════════════════════════════════════════════════════════════

function duendes_tito_chat_page() {
    ?>
    <div class="wrap duendes-wrap">
        <div class="duendes-header">
            <div>
                <h1>🧙 Tito Admin</h1>
                <p>Tu asistente mágico sin límites</p>
            </div>
            <div style="display: flex; gap: 12px;">
                <a href="<?php echo admin_url('admin.php?page=duendes-canalizaciones'); ?>" class="duendes-btn duendes-btn-secondary">🔮 Canalizaciones</a>
                <a href="<?php echo admin_url('admin.php?page=duendes-circulo'); ?>" class="duendes-btn duendes-btn-secondary">🌙 El Círculo</a>
            </div>
        </div>

        <div class="duendes-content">
            <div class="tito-chat-container">
                <div class="tito-chat-header">
                    <div class="tito-avatar">🧙</div>
                    <div>
                        <strong style="color: #333; font-size: 16px;">Tito</strong>
                        <div class="tito-status">
                            <span class="tito-status-dot"></span>
                            Listo para ayudarte
                        </div>
                    </div>
                </div>

                <div class="tito-chat-messages" id="tito-messages">
                    <div class="tito-message tito-message-tito">
                        <strong>¡Hola! 🌟</strong><br><br>
                        Soy Tito, tu asistente mágico. Puedo hacer <strong>absolutamente todo</strong> por vos:<br><br>
                        • Crear productos completos desde fotos<br>
                        • Generar canalizaciones personalizadas<br>
                        • Crear contenido para El Círculo<br>
                        • Gestionar usuarios y runas<br>
                        • Generar imágenes con IA<br>
                        • Crear cupones, descuentos, promociones<br>
                        • Analizar ventas y sugerirte mejoras<br>
                        • Lo que me pidas... sin límites<br><br>
                        <strong>¿Qué necesitás?</strong>

                        <div class="tito-message-actions">
                            <button class="tito-action-btn" onclick="TitoChat.quickAction('crear producto')">✨ Crear producto</button>
                            <button class="tito-action-btn" onclick="TitoChat.quickAction('generar canalizacion')">🔮 Canalización</button>
                            <button class="tito-action-btn" onclick="TitoChat.quickAction('ver estadisticas')">📊 Estadísticas</button>
                        </div>
                    </div>
                </div>

                <div class="tito-chat-input-container">
                    <div class="tito-chat-input-wrapper">
                        <textarea class="tito-chat-input" id="tito-input" placeholder="Escribí lo que necesitás... (Ej: 'creame un producto con estas fotos', 'generá el contenido de febrero')" rows="1"></textarea>
                        <button class="tito-send-btn" onclick="TitoChat.send()">Enviar</button>
                    </div>
                    <div class="tito-quick-actions">
                        <button class="tito-quick-btn" onclick="TitoChat.quickAction('crear cupon 20%')">🎟️ Crear cupón</button>
                        <button class="tito-quick-btn" onclick="TitoChat.quickAction('regalar 100 runas a')">💎 Regalar runas</button>
                        <button class="tito-quick-btn" onclick="TitoChat.quickAction('generar semana del circulo')">📅 Generar semana</button>
                        <button class="tito-quick-btn" onclick="TitoChat.quickAction('ver usuarios mi magia')">👥 Usuarios</button>
                        <button class="tito-quick-btn" onclick="TitoChat.quickAction('crear banner promocional')">🎨 Crear banner</button>
                        <button class="tito-quick-btn" onclick="TitoChat.quickAction('analizar ventas del mes')">📈 Ventas</button>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script>
    var titoNonce = '<?php echo wp_create_nonce('duendes_admin'); ?>';
    var titoAjaxUrl = '<?php echo admin_url('admin-ajax.php'); ?>';

    var TitoChat = {
        messagesContainer: null,
        input: null,
        conversationHistory: [],

        init: function() {
            this.messagesContainer = document.getElementById('tito-messages');
            this.input = document.getElementById('tito-input');

            // Auto-resize textarea
            this.input.addEventListener('input', function() {
                this.style.height = 'auto';
                this.style.height = Math.min(this.scrollHeight, 150) + 'px';
            });

            // Enter to send
            this.input.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    TitoChat.send();
                }
            });
        },

        send: function() {
            var message = this.input.value.trim();
            if (!message) return;

            // Add user message
            this.addMessage(message, 'user');
            this.conversationHistory.push({ role: 'user', content: message });
            this.input.value = '';
            this.input.style.height = 'auto';

            // Show typing indicator
            this.showTyping();

            // Send to API
            fetch('<?php echo DUENDES_API_URL; ?>/admin/tito-chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: message,
                    context: 'admin_full_access',
                    conversationHistory: this.conversationHistory.slice(-10) // Últimos 10 mensajes
                })
            })
            .then(r => r.json())
            .then(result => {
                this.hideTyping();
                if (result.success) {
                    // Execute any actions Tito returned
                    if (result.actions && result.actions.length > 0) {
                        this.executeActions(result.actions);
                    }

                    this.addMessage(result.response, 'tito');
                    this.conversationHistory.push({ role: 'assistant', content: result.response });
                } else {
                    this.addMessage('Hubo un error: ' + (result.error || 'Error desconocido'), 'tito');
                }
            })
            .catch(err => {
                this.hideTyping();
                this.addMessage('Error de conexión. Reintentá en unos segundos.', 'tito');
            });
        },

        quickAction: function(action) {
            this.input.value = action;
            this.input.focus();
        },

        addMessage: function(content, type) {
            var div = document.createElement('div');
            div.className = 'tito-message tito-message-' + type;
            div.innerHTML = content.replace(/\n/g, '<br>');
            this.messagesContainer.appendChild(div);
            this.scrollToBottom();
        },

        showTyping: function() {
            var typing = document.createElement('div');
            typing.className = 'tito-typing';
            typing.id = 'tito-typing';
            typing.innerHTML = '<div class="tito-typing-dots"><span class="tito-typing-dot"></span><span class="tito-typing-dot"></span><span class="tito-typing-dot"></span></div><span style="color: #666;">Tito está trabajando...</span>';
            this.messagesContainer.appendChild(typing);
            this.scrollToBottom();
        },

        hideTyping: function() {
            var typing = document.getElementById('tito-typing');
            if (typing) typing.remove();
        },

        scrollToBottom: function() {
            this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
        },

        // Execute actions from Tito (create coupons, send emails, etc.)
        executeActions: function(actions) {
            var self = this;
            actions.forEach(function(action) {
                var wpAction = '';
                var params = new URLSearchParams();
                params.append('nonce', titoNonce);

                switch (action.type) {
                    case 'crear_cupon':
                        wpAction = 'tito_crear_cupon';
                        if (action.codigo) params.append('codigo', action.codigo);
                        if (action.descuento) params.append('descuento', action.descuento);
                        if (action.tipo) params.append('tipo', action.tipo);
                        if (action.expira) params.append('expira', action.expira);
                        if (action.uso_limite) params.append('uso_limite', action.uso_limite);
                        break;

                    case 'enviar_email':
                        wpAction = 'tito_enviar_email';
                        params.append('para', action.para);
                        params.append('asunto', action.asunto);
                        params.append('mensaje', action.mensaje);
                        break;

                    case 'email_masivo':
                        wpAction = 'tito_email_masivo';
                        params.append('grupo', action.grupo);
                        params.append('asunto', action.asunto);
                        params.append('mensaje', action.mensaje);
                        break;

                    case 'automatizacion':
                        wpAction = 'tito_crear_automatizacion';
                        params.append('nombre', action.nombre);
                        params.append('trigger', action.trigger);
                        params.append('delay', action.delay);
                        params.append('asunto', action.asunto);
                        params.append('mensaje', action.mensaje);
                        if (action.grupo) params.append('grupo', action.grupo);
                        break;

                    case 'estadisticas':
                        wpAction = 'tito_estadisticas';
                        break;
                }

                if (wpAction) {
                    params.append('action', wpAction);
                    fetch(titoAjaxUrl, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                        body: params.toString()
                    })
                    .then(r => r.json())
                    .then(result => {
                        if (result.success) {
                            // Show success notification
                            self.addMessage('✅ <strong>Acción completada:</strong> ' + (result.data.mensaje || 'Listo!'), 'tito');
                        } else {
                            self.addMessage('❌ Error: ' + (result.data?.mensaje || 'Error al ejecutar acción'), 'tito');
                        }
                    })
                    .catch(err => {
                        console.error('Error executing action:', err);
                    });
                }
            });
        }
    };

    document.addEventListener('DOMContentLoaded', function() {
        TitoChat.init();
    });
    </script>
    <?php
}

// ═══════════════════════════════════════════════════════════════════════════
// 2. CANALIZACIONES
// ═══════════════════════════════════════════════════════════════════════════

function duendes_canalizaciones_page() {
    $products = wc_get_products(['status' => 'publish', 'limit' => -1, 'orderby' => 'title', 'order' => 'ASC']);
    ?>
    <div class="wrap duendes-wrap">
        <div class="duendes-header" style="background: linear-gradient(135deg, #ffe6ff 0%, #fff0ff 100%); border-bottom: 2px solid #d000d0;">
            <div>
                <h1 style="background: linear-gradient(90deg, #d000d0, #e040e0); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">🔮 Canalizaciones</h1>
                <p>Genera canalizaciones personalizadas</p>
            </div>
        </div>

        <div class="duendes-content">
            <div class="duendes-grid" style="grid-template-columns: 1.5fr 1fr;">
                <div class="duendes-card">
                    <div class="duendes-card-header">
                        <div class="duendes-card-icon" style="background: rgba(255, 0, 255, 0.2);">🔮</div>
                        <h3 class="duendes-card-title">Nueva Canalización</h3>
                    </div>

                    <form id="canalizacion-form">
                        <div class="duendes-grid" style="grid-template-columns: 1fr 1fr;">
                            <div class="duendes-form-group">
                                <label class="duendes-label">Guardián / Duende</label>
                                <select name="producto_id" class="duendes-select" required>
                                    <option value="">Seleccionar...</option>
                                    <?php foreach ($products as $p): ?>
                                    <option value="<?php echo $p->get_id(); ?>"><?php echo esc_html($p->get_name()); ?></option>
                                    <?php endforeach; ?>
                                </select>
                            </div>
                            <div class="duendes-form-group">
                                <label class="duendes-label">Nombre del Cliente</label>
                                <input type="text" name="cliente_nombre" class="duendes-input" required>
                            </div>
                        </div>

                        <div class="duendes-grid" style="grid-template-columns: 1fr 1fr;">
                            <div class="duendes-form-group">
                                <label class="duendes-label">Email</label>
                                <input type="email" name="cliente_email" class="duendes-input">
                            </div>
                            <div class="duendes-form-group">
                                <label class="duendes-label">País</label>
                                <input type="text" name="cliente_pais" class="duendes-input">
                            </div>
                        </div>

                        <div class="duendes-form-group">
                            <label class="duendes-label">Momento que atraviesa</label>
                            <textarea name="momento_vida" class="duendes-textarea" placeholder="Describe la situación..."></textarea>
                        </div>

                        <div class="duendes-form-group">
                            <label class="duendes-label">Qué busca / necesita</label>
                            <textarea name="necesidad" class="duendes-textarea" placeholder="Protección, claridad, abundancia..."></textarea>
                        </div>

                        <div class="duendes-form-group">
                            <label class="duendes-label">Foto del Cliente (opcional)</label>
                            <input type="file" name="foto" class="duendes-input" accept="image/*">
                        </div>

                        <button type="submit" class="duendes-btn duendes-btn-magenta">
                            🔮 Generar Canalización
                        </button>
                    </form>
                </div>

                <div class="duendes-card">
                    <div class="duendes-card-header">
                        <div class="duendes-card-icon" style="background: rgba(0, 255, 136, 0.2);">👁️</div>
                        <h3 class="duendes-card-title">Vista Previa</h3>
                    </div>
                    <div id="canalizacion-preview" style="color: #888; text-align: center; padding: 40px;">
                        La canalización aparecerá aquí...
                    </div>
                    <div id="canalizacion-actions" style="display: none; margin-top: 20px; gap: 12px;">
                        <button class="duendes-btn duendes-btn-primary" onclick="copiarCanalizacion()">📋 Copiar</button>
                        <button class="duendes-btn duendes-btn-secondary" onclick="enviarEmail()">📧 Enviar Email</button>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script>
    document.getElementById('canalizacion-form').addEventListener('submit', function(e) {
        e.preventDefault();
        var preview = document.getElementById('canalizacion-preview');
        var actions = document.getElementById('canalizacion-actions');
        var formData = new FormData(this);

        preview.innerHTML = '<div style="color: #ff00ff;">🔮 Generando canalización...</div>';

        fetch('<?php echo DUENDES_API_URL; ?>/admin/canalizacion-manual', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                producto_id: formData.get('producto_id'),
                cliente_nombre: formData.get('cliente_nombre'),
                cliente_email: formData.get('cliente_email'),
                cliente_pais: formData.get('cliente_pais'),
                momento_vida: formData.get('momento_vida'),
                necesidad: formData.get('necesidad')
            })
        })
        .then(r => r.json())
        .then(result => {
            if (result.success) {
                preview.innerHTML = '<div style="white-space: pre-wrap; line-height: 1.8; color: #333;">' + result.canalizacion + '</div>';
                actions.style.display = 'flex';
            } else {
                preview.innerHTML = '<div style="color: #ff4444;">Error: ' + result.error + '</div>';
            }
        })
        .catch(err => {
            preview.innerHTML = '<div style="color: #ff4444;">Error de conexión</div>';
        });
    });

    function copiarCanalizacion() {
        var text = document.getElementById('canalizacion-preview').innerText;
        navigator.clipboard.writeText(text);
        alert('Copiado!');
    }
    </script>
    <?php
}

// ═══════════════════════════════════════════════════════════════════════════
// 3. USUARIOS
// ═══════════════════════════════════════════════════════════════════════════

function duendes_usuarios_page() {
    $all_users = get_users(['number' => 100, 'orderby' => 'registered', 'order' => 'DESC']);
    ?>
    <div class="wrap duendes-wrap">
        <div class="duendes-header" style="background: linear-gradient(135deg, #e6fff0 0%, #f0fff5 100%); border-bottom: 2px solid #00c070;">
            <div>
                <h1 style="background: linear-gradient(90deg, #00a060, #00c080); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">👥 Usuarios</h1>
                <p>Gestión completa de usuarios</p>
            </div>
            <button class="duendes-btn duendes-btn-primary" onclick="mostrarCrearUsuario()">➕ Crear Usuario</button>
        </div>

        <div class="duendes-content">
            <div class="duendes-tabs">
                <button class="duendes-tab active" onclick="showUserTab('todos')">👥 Todos</button>
                <button class="duendes-tab" onclick="showUserTab('mimagia')">✨ Mi Magia</button>
                <button class="duendes-tab" onclick="showUserTab('circulo')">🌙 El Círculo</button>
            </div>

            <div id="tab-todos" class="duendes-tab-content active">
                <div class="duendes-card">
                    <table class="duendes-table">
                        <thead>
                            <tr>
                                <th>Usuario</th>
                                <th>Email</th>
                                <th>Registro</th>
                                <th>Mi Magia</th>
                                <th>Runas</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php foreach ($all_users as $user):
                                $mi_magia = get_user_meta($user->ID, 'mi_magia_active', true);
                                $runas = get_user_meta($user->ID, 'runas_poder', true) ?: 0;
                            ?>
                            <tr>
                                <td>
                                    <div style="display: flex; align-items: center; gap: 12px;">
                                        <div class="duendes-user-avatar"><?php echo strtoupper(substr($user->display_name, 0, 2)); ?></div>
                                        <div>
                                            <strong><?php echo esc_html($user->display_name); ?></strong><br>
                                            <small style="color: #888;">@<?php echo esc_html($user->user_login); ?></small>
                                        </div>
                                    </div>
                                </td>
                                <td><?php echo esc_html($user->user_email); ?></td>
                                <td><?php echo date('d/m/Y', strtotime($user->user_registered)); ?></td>
                                <td>
                                    <?php if ($mi_magia): ?>
                                        <span class="duendes-badge duendes-badge-magenta">Activo</span>
                                    <?php else: ?>
                                        <span class="duendes-badge" style="background: #f0ebe5; color: #aaa;">-</span>
                                    <?php endif; ?>
                                </td>
                                <td><span class="neon-cyan"><?php echo $runas; ?></span> 💎</td>
                                <td>
                                    <button class="duendes-btn duendes-btn-secondary" style="padding: 8px 12px;" onclick="regalarRunas(<?php echo $user->ID; ?>)">💎</button>
                                    <button class="duendes-btn duendes-btn-secondary" style="padding: 8px 12px;" onclick="toggleMiMagia(<?php echo $user->ID; ?>)">✨</button>
                                </td>
                            </tr>
                            <?php endforeach; ?>
                        </tbody>
                    </table>
                </div>
            </div>

            <div id="tab-mimagia" class="duendes-tab-content">
                <div class="duendes-card">
                    <p style="color: #888; text-align: center; padding: 40px;">Usuarios con Mi Magia activo</p>
                </div>
            </div>

            <div id="tab-circulo" class="duendes-tab-content">
                <div class="duendes-card">
                    <p style="color: #888; text-align: center; padding: 40px;">Miembros de El Círculo</p>
                </div>
            </div>
        </div>
    </div>

    <script>
    var duendesNonce = '<?php echo wp_create_nonce('duendes_admin'); ?>';
    var ajaxUrl = '<?php echo admin_url('admin-ajax.php'); ?>';

    function showUserTab(tab) {
        document.querySelectorAll('.duendes-tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.duendes-tab-content').forEach(c => c.classList.remove('active'));
        event.target.classList.add('active');
        document.getElementById('tab-' + tab).classList.add('active');
    }

    function regalarRunas(userId) {
        var cantidad = prompt('¿Cuántas runas querés regalar?', '50');
        if (cantidad) {
            fetch(ajaxUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: 'action=duendes_regalar_runas&nonce=' + duendesNonce + '&user_id=' + userId + '&cantidad=' + cantidad
            })
            .then(r => r.json())
            .then(result => {
                if (result.success) {
                    alert('✅ Runas regaladas! Nueva cantidad: ' + result.data.nueva_cantidad);
                    location.reload();
                } else {
                    alert('Error: ' + (result.data?.message || 'Error desconocido'));
                }
            });
        }
    }

    function toggleMiMagia(userId) {
        if (confirm('¿Activar/desactivar Mi Magia para este usuario?')) {
            fetch(ajaxUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: 'action=duendes_toggle_mi_magia&nonce=' + duendesNonce + '&user_id=' + userId
            })
            .then(r => r.json())
            .then(result => {
                if (result.success) {
                    alert('✅ Mi Magia ' + (result.data.activo ? 'ACTIVADO' : 'DESACTIVADO'));
                    location.reload();
                } else {
                    alert('Error');
                }
            });
        }
    }

    function mostrarCrearUsuario() {
        var modal = document.createElement('div');
        modal.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.8);display:flex;align-items:center;justify-content:center;z-index:99999;';
        modal.innerHTML = '<div style="background:#1a1a28;padding:30px;border-radius:16px;max-width:400px;width:90%;border:1px solid rgba(0,255,136,0.3);">' +
            '<h3 style="color:#00ff88;margin-bottom:20px;">Crear Usuario</h3>' +
            '<input type="text" id="nuevo-nombre" placeholder="Nombre" style="width:100%;padding:12px;margin-bottom:12px;background:#0a0a0f;border:1px solid rgba(255,255,255,0.2);border-radius:8px;color:#fff;box-sizing:border-box;">' +
            '<input type="email" id="nuevo-email" placeholder="Email" style="width:100%;padding:12px;margin-bottom:12px;background:#0a0a0f;border:1px solid rgba(255,255,255,0.2);border-radius:8px;color:#fff;box-sizing:border-box;">' +
            '<div style="display:flex;gap:12px;margin-top:20px;">' +
            '<button onclick="crearUsuario()" style="flex:1;padding:12px;background:linear-gradient(135deg,#00ff88,#00ffaa);border:none;border-radius:8px;color:#000;font-weight:600;cursor:pointer;">Crear</button>' +
            '<button onclick="this.parentElement.parentElement.parentElement.remove()" style="flex:1;padding:12px;background:rgba(255,255,255,0.1);border:1px solid rgba(255,255,255,0.2);border-radius:8px;color:#fff;cursor:pointer;">Cancelar</button>' +
            '</div></div>';
        document.body.appendChild(modal);
    }

    function crearUsuario() {
        var nombre = document.getElementById('nuevo-nombre').value;
        var email = document.getElementById('nuevo-email').value;

        fetch(ajaxUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: 'action=duendes_crear_usuario&nonce=' + duendesNonce + '&nombre=' + encodeURIComponent(nombre) + '&email=' + encodeURIComponent(email)
        })
        .then(r => r.json())
        .then(result => {
            if (result.success) {
                alert('✅ Usuario creado!\nPassword temporal: ' + result.data.password);
                location.reload();
            } else {
                alert('Error: ' + result.data.message);
            }
        });
    }
    </script>
    <?php
}

// ═══════════════════════════════════════════════════════════════════════════
// 4. EL CÍRCULO
// ═══════════════════════════════════════════════════════════════════════════

function duendes_circulo_page() {
    ?>
    <div class="wrap duendes-wrap">
        <div class="duendes-header" style="background: linear-gradient(135deg, #f5e6ff 0%, #fff0ff 100%); border-bottom: 2px solid #9900dd;">
            <div>
                <h1 style="background: linear-gradient(90deg, #8800cc, #aa00ff); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">🌙 El Círculo</h1>
                <p>Generador de contenido mágico</p>
            </div>
        </div>

        <div class="duendes-content">
            <div class="duendes-tabs">
                <button class="duendes-tab active" onclick="showCirculoTab('generar')">🪄 Generar</button>
                <button class="duendes-tab" onclick="showCirculoTab('calendario')">📅 Calendario</button>
                <button class="duendes-tab" onclick="showCirculoTab('miembros')">👥 Miembros</button>
                <button class="duendes-tab" onclick="showCirculoTab('promos')">🎁 Promos</button>
            </div>

            <!-- Tab: Generar -->
            <div id="tab-generar" class="duendes-tab-content active">
                <div class="duendes-grid" style="grid-template-columns: 1fr 1fr;">
                    <div class="duendes-card">
                        <div class="duendes-card-header">
                            <div class="duendes-card-icon" style="background: rgba(170, 0, 255, 0.2);">🪄</div>
                            <h3 class="duendes-card-title">Generar Contenido</h3>
                        </div>

                        <form id="circulo-generar-form">
                            <div class="duendes-form-group">
                                <label class="duendes-label">Período a generar</label>
                                <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-top: 10px;">
                                    <label style="display: flex; align-items: center; gap: 8px; padding: 12px; background: rgba(255,255,255,0.05); border-radius: 8px; cursor: pointer; border: 2px solid transparent;" class="periodo-option">
                                        <input type="radio" name="periodo" value="dia" style="accent-color: #aa00ff;"> Día
                                    </label>
                                    <label style="display: flex; align-items: center; gap: 8px; padding: 12px; background: rgba(255,255,255,0.05); border-radius: 8px; cursor: pointer; border: 2px solid transparent;" class="periodo-option">
                                        <input type="radio" name="periodo" value="semana" checked style="accent-color: #aa00ff;"> Semana
                                    </label>
                                    <label style="display: flex; align-items: center; gap: 8px; padding: 12px; background: rgba(255,255,255,0.05); border-radius: 8px; cursor: pointer; border: 2px solid transparent;" class="periodo-option">
                                        <input type="radio" name="periodo" value="quincena" style="accent-color: #aa00ff;"> Quincena
                                    </label>
                                    <label style="display: flex; align-items: center; gap: 8px; padding: 12px; background: rgba(255,255,255,0.05); border-radius: 8px; cursor: pointer; border: 2px solid transparent;" class="periodo-option">
                                        <input type="radio" name="periodo" value="mes" style="accent-color: #aa00ff;"> Mes
                                    </label>
                                </div>
                            </div>

                            <div class="duendes-grid" style="grid-template-columns: 1fr 1fr;">
                                <div class="duendes-form-group">
                                    <label class="duendes-label">Mes</label>
                                    <select name="mes" class="duendes-select">
                                        <option value="1">Enero</option>
                                        <option value="2">Febrero</option>
                                        <option value="3">Marzo</option>
                                        <option value="4">Abril</option>
                                        <option value="5">Mayo</option>
                                        <option value="6">Junio</option>
                                        <option value="7">Julio</option>
                                        <option value="8">Agosto</option>
                                        <option value="9">Septiembre</option>
                                        <option value="10">Octubre</option>
                                        <option value="11">Noviembre</option>
                                        <option value="12">Diciembre</option>
                                    </select>
                                </div>
                                <div class="duendes-form-group">
                                    <label class="duendes-label">Año</label>
                                    <select name="ano" class="duendes-select">
                                        <option value="2025">2025</option>
                                        <option value="2026" selected>2026</option>
                                    </select>
                                </div>
                            </div>

                            <div class="duendes-form-group">
                                <label class="duendes-label">Tipo de contenido</label>
                                <div style="display: flex; flex-direction: column; gap: 10px; margin-top: 10px;">
                                    <label style="display: flex; align-items: center; gap: 10px; color: #333; cursor: pointer;">
                                        <input type="checkbox" name="tipos[]" value="meditacion" checked style="accent-color: #aa00ff;"> 🧘 Meditaciones
                                    </label>
                                    <label style="display: flex; align-items: center; gap: 10px; color: #333; cursor: pointer;">
                                        <input type="checkbox" name="tipos[]" value="ritual" checked style="accent-color: #aa00ff;"> 🕯️ Rituales
                                    </label>
                                    <label style="display: flex; align-items: center; gap: 10px; color: #333; cursor: pointer;">
                                        <input type="checkbox" name="tipos[]" value="lectura" checked style="accent-color: #aa00ff;"> 🔮 Lecturas de energía
                                    </label>
                                    <label style="display: flex; align-items: center; gap: 10px; color: #333; cursor: pointer;">
                                        <input type="checkbox" name="tipos[]" value="guardian" checked style="accent-color: #aa00ff;"> 🧙 Mensaje del guardián
                                    </label>
                                    <label style="display: flex; align-items: center; gap: 10px; color: #333; cursor: pointer;">
                                        <input type="checkbox" name="tipos[]" value="cristal" checked style="accent-color: #aa00ff;"> 💎 Cristal del período
                                    </label>
                                </div>
                            </div>

                            <div class="duendes-form-group">
                                <label class="duendes-label">Generar imágenes (OpenAI)</label>
                                <select name="imagenes" class="duendes-select">
                                    <option value="todas">Todas las imágenes</option>
                                    <option value="principales">Solo principales</option>
                                    <option value="ninguna">Sin imágenes</option>
                                </select>
                            </div>

                            <div class="duendes-form-group">
                                <label class="duendes-label">Tema especial (opcional)</label>
                                <input type="text" name="tema" class="duendes-input" placeholder="Ej: Luna de cosecha, Equinoccio...">
                            </div>

                            <div class="duendes-form-group">
                                <label class="duendes-label">Extras opcionales</label>
                                <div style="display: flex; flex-direction: column; gap: 10px; margin-top: 10px;">
                                    <label style="display: flex; align-items: center; gap: 10px; color: #333; cursor: pointer;">
                                        <input type="checkbox" name="extras[]" value="test_interactivo" style="accent-color: #aa00ff;"> 📝 Test interactivo para la comunidad
                                    </label>
                                    <label style="display: flex; align-items: center; gap: 10px; color: #333; cursor: pointer;">
                                        <input type="checkbox" name="extras[]" value="quiz_energia" style="accent-color: #aa00ff;"> 🔮 Quiz de energía personal
                                    </label>
                                    <label style="display: flex; align-items: center; gap: 10px; color: #333; cursor: pointer;">
                                        <input type="checkbox" name="extras[]" value="incluir_video" style="accent-color: #aa00ff;"> 🎬 Espacio para video personalizado
                                    </label>
                                </div>
                            </div>

                            <div class="duendes-form-group">
                                <label class="duendes-label">📤 Subir video (opcional)</label>
                                <input type="file" name="video" class="duendes-input" accept="video/mp4,video/webm,video/mov" style="padding: 10px;">
                                <small style="color: #888; display: block; margin-top: 6px;">Formatos: MP4, WebM, MOV. Max 100MB</small>
                            </div>

                            <div class="duendes-form-group">
                                <label class="duendes-label">✏️ Instrucciones para Claude (opcional)</label>
                                <textarea name="instrucciones_claude" class="duendes-input" rows="3" placeholder="Ej: Enfocate en la energía del solsticio, mencioná el cristal cuarzo rosa, el tono debe ser más directo y menos poético..."></textarea>
                                <small style="color: #888; display: block; margin-top: 6px;">Dale indicaciones específicas a Claude para este contenido</small>
                            </div>

                            <button type="submit" class="duendes-btn" style="background: linear-gradient(135deg, #8800cc, #aa00ff); color: #fff; width: 100%;">
                                🪄 Generar Contenido
                            </button>
                        </form>
                    </div>

                    <div class="duendes-card">
                        <div class="duendes-card-header">
                            <div class="duendes-card-icon" style="background: rgba(0, 255, 255, 0.2);">👁️</div>
                            <h3 class="duendes-card-title">Vista Previa</h3>
                        </div>
                        <div id="circulo-preview" style="color: #888; text-align: center; padding: 40px; max-height: 500px; overflow-y: auto;">
                            El contenido generado aparecerá aquí...
                        </div>
                    </div>
                </div>
            </div>

            <!-- Tab: Calendario -->
            <div id="tab-calendario" class="duendes-tab-content">
                <div class="duendes-card">
                    <div class="duendes-card-header">
                        <div class="duendes-card-icon" style="background: rgba(255, 136, 0, 0.2);">📅</div>
                        <h3 class="duendes-card-title">Calendario de Contenido</h3>
                    </div>
                    <div id="calendario-container" style="min-height: 400px;">
                        <!-- Calendario aquí -->
                        <p style="color: #888; text-align: center; padding: 60px;">Cargando calendario...</p>
                    </div>
                </div>
            </div>

            <!-- Tab: Miembros -->
            <div id="tab-miembros" class="duendes-tab-content">
                <div class="duendes-card">
                    <div class="duendes-card-header">
                        <div class="duendes-card-icon" style="background: rgba(0, 255, 136, 0.2);">👥</div>
                        <h3 class="duendes-card-title">Gestión de Miembros</h3>
                    </div>
                    <div style="display: flex; gap: 12px; margin-bottom: 20px; flex-wrap: wrap;">
                        <button class="duendes-btn duendes-btn-primary" onclick="habilitarRegistros()">✅ Habilitar Registros</button>
                        <button class="duendes-btn duendes-btn-secondary" onclick="regalarTiempoGratis()">🎁 Regalar Tiempo Gratis</button>
                        <button class="duendes-btn duendes-btn-secondary" onclick="regalarRunasMasivo()">💎 Regalar Runas</button>
                        <button class="duendes-btn duendes-btn-secondary" onclick="crearCupon()">🎟️ Crear Cupón</button>
                    </div>
                    <p style="color: #888;">Lista de miembros del Círculo...</p>
                </div>
            </div>

            <!-- Tab: Promos -->
            <div id="tab-promos" class="duendes-tab-content">
                <div class="duendes-card">
                    <div class="duendes-card-header">
                        <div class="duendes-card-icon" style="background: rgba(255, 0, 255, 0.2);">🎁</div>
                        <h3 class="duendes-card-title">Promociones y Competencias</h3>
                    </div>
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 16px;">
                        <div style="background: #fff5e6; border: 2px solid #e08000; border-radius: 12px; padding: 20px; cursor: pointer;" onclick="crearPromo('descuento')">
                            <div style="font-size: 32px; margin-bottom: 10px;">🏷️</div>
                            <strong style="color: #c06000;">Crear Descuento</strong>
                            <p style="color: #888; font-size: 13px; margin-top: 8px;">Porcentaje o monto fijo</p>
                        </div>
                        <div style="background: #e6fffe; border: 2px solid #00b8a9; border-radius: 12px; padding: 20px; cursor: pointer;" onclick="crearPromo('cupon')">
                            <div style="font-size: 32px; margin-bottom: 10px;">🎟️</div>
                            <strong style="color: #008080;">Crear Cupón</strong>
                            <p style="color: #888; font-size: 13px; margin-top: 8px;">Código promocional</p>
                        </div>
                        <div style="background: #e6fff0; border: 2px solid #00c070; border-radius: 12px; padding: 20px; cursor: pointer;" onclick="crearPromo('competencia')">
                            <div style="font-size: 32px; margin-bottom: 10px;">🏆</div>
                            <strong style="color: #008050;">Crear Competencia</strong>
                            <p style="color: #888; font-size: 13px; margin-top: 8px;">Retos y premios</p>
                        </div>
                        <div style="background: #ffe6ff; border: 2px solid #d000d0; border-radius: 12px; padding: 20px; cursor: pointer;" onclick="crearPromo('regalo')">
                            <div style="font-size: 32px; margin-bottom: 10px;">🎁</div>
                            <strong style="color: #a000a0;">Regalo Masivo</strong>
                            <p style="color: #888; font-size: 13px; margin-top: 8px;">Runas, lecturas, tiempo</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script>
    function showCirculoTab(tab) {
        document.querySelectorAll('.duendes-tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.duendes-tab-content').forEach(c => c.classList.remove('active'));
        event.target.classList.add('active');
        document.getElementById('tab-' + tab).classList.add('active');
    }

    function habilitarRegistros() {
        if (confirm('¿Habilitar inscripciones a El Círculo?')) {
            alert('✅ Registros habilitados');
        }
    }

    function regalarTiempoGratis() {
        var dias = prompt('¿Cuántos días de acceso gratis?', '7');
        if (dias) {
            alert('✅ Se regalará ' + dias + ' días de acceso gratis a los miembros');
        }
    }

    function regalarRunasMasivo() {
        var cantidad = prompt('¿Cuántas runas regalar a cada miembro?', '100');
        if (cantidad) {
            alert('✅ Se regalarán ' + cantidad + ' runas a todos los miembros');
        }
    }

    function crearCupon() {
        var descuento = prompt('¿Qué descuento (porcentaje)?', '20');
        if (descuento) {
            fetch('<?php echo DUENDES_API_URL; ?>/admin/promociones', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    tipo: 'cupon',
                    datos: {
                        descuento: descuento,
                        tipo_descuento: 'porcentaje'
                    }
                })
            })
            .then(r => r.json())
            .then(result => {
                if (result.success) {
                    alert('✅ Cupón creado: ' + result.cupon.codigo + '\n\n' + result.cupon.mensaje_promocional);
                }
            });
        }
    }

    // Plantillas de competencias pre-hechas
    var plantillasCompetencias = [
        {
            id: 'foto_altar',
            nombre: '📸 Mejor Foto de Altar',
            descripcion: 'Los participantes comparten fotos de sus altares con duendes',
            duracion: '7 días',
            premio: 'Canalización gratis',
            mecanica: 'Subir foto del altar, votos de la comunidad'
        },
        {
            id: 'historia_duende',
            nombre: '📖 Mi Historia con mi Duende',
            descripcion: 'Contar cómo conocieron a su duende y qué cambió',
            duracion: '5 días',
            premio: '100 Runas + Lectura especial',
            mecanica: 'Escribir historia de máx. 300 palabras'
        },
        {
            id: 'ritual_creativo',
            nombre: '🕯️ Ritual Creativo',
            descripcion: 'Crear un ritual personal con su duende guardián',
            duracion: '10 días',
            premio: 'Producto gratis + Recanalización',
            mecanica: 'Describir ritual + foto opcional'
        },
        {
            id: 'reto_7_dias',
            nombre: '✨ Reto 7 Días de Magia',
            descripcion: 'Completar una actividad diaria durante 7 días',
            duracion: '7 días',
            premio: '50 Runas por día completado',
            mecanica: 'Marcar actividad completada cada día'
        },
        {
            id: 'dibujo_guardian',
            nombre: '🎨 Dibujá a tu Guardián',
            descripcion: 'Ilustraciones artísticas de los guardianes',
            duracion: '14 días',
            premio: 'Duende físico + 200 Runas',
            mecanica: 'Subir ilustración, votos de la comunidad'
        },
        {
            id: 'meditacion_compartida',
            nombre: '🧘 Meditación Compartida',
            descripcion: 'Participar en meditaciones grupales en vivo',
            duracion: '3 días',
            premio: 'Acceso El Círculo 1 mes gratis',
            mecanica: 'Asistir a sesión en vivo + reflexión'
        },
        {
            id: 'referidos_magicos',
            nombre: '💫 Referidos Mágicos',
            descripcion: 'Traer amigos a la comunidad',
            duracion: '30 días',
            premio: '20% comisión en Runas + premios extra',
            mecanica: 'Código personal de referido'
        }
    ];

    function crearPromo(tipo) {
        var modal = document.createElement('div');
        modal.id = 'promo-modal';
        modal.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.6);display:flex;align-items:center;justify-content:center;z-index:99999;overflow-y:auto;padding:20px;';

        var content = '<div style="background:#FFFCF8;padding:30px;border-radius:16px;max-width:600px;width:100%;border:2px solid #e8ddd0;max-height:90vh;overflow-y:auto;">';
        content += '<h3 style="color:#333;margin-bottom:20px;font-size:20px;">✨ Crear ' + tipo.charAt(0).toUpperCase() + tipo.slice(1) + '</h3>';

        if (tipo === 'descuento' || tipo === 'cupon') {
            content += '<div style="margin-bottom:15px;"><label style="display:block;margin-bottom:6px;color:#666;font-size:13px;">Nombre del cupón</label>';
            content += '<input type="text" id="promo-nombre" placeholder="Ej: DUENDE20" style="width:100%;padding:12px;background:#fff;border:1px solid #ddd;border-radius:8px;color:#333;box-sizing:border-box;"></div>';
            content += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:15px;">';
            content += '<div><label style="display:block;margin-bottom:6px;color:#666;font-size:13px;">Valor</label>';
            content += '<input type="number" id="promo-valor" placeholder="20" style="width:100%;padding:12px;background:#fff;border:1px solid #ddd;border-radius:8px;color:#333;box-sizing:border-box;"></div>';
            content += '<div><label style="display:block;margin-bottom:6px;color:#666;font-size:13px;">Tipo</label>';
            content += '<select id="promo-tipo-desc" style="width:100%;padding:12px;background:#fff;border:1px solid #ddd;border-radius:8px;color:#333;box-sizing:border-box;">';
            content += '<option value="percent">Porcentaje (%)</option><option value="fixed">Monto fijo (USD)</option></select></div></div>';
            content += '<div style="margin-bottom:15px;"><label style="display:block;margin-bottom:6px;color:#666;font-size:13px;">Fecha expiración (opcional)</label>';
            content += '<input type="date" id="promo-expira" style="width:100%;padding:12px;background:#fff;border:1px solid #ddd;border-radius:8px;color:#333;box-sizing:border-box;"></div>';

        } else if (tipo === 'competencia') {
            content += '<div style="margin-bottom:20px;"><label style="display:block;margin-bottom:10px;color:#666;font-size:14px;font-weight:600;">🎯 Elegí una plantilla o creá una personalizada:</label>';
            content += '<div style="display:grid;gap:10px;max-height:250px;overflow-y:auto;padding-right:8px;">';

            plantillasCompetencias.forEach(function(p) {
                content += '<div onclick="seleccionarPlantilla(\'' + p.id + '\')" id="plantilla-' + p.id + '" style="background:#fff;border:2px solid #e8ddd0;border-radius:10px;padding:14px;cursor:pointer;transition:all 0.2s;">';
                content += '<div style="font-weight:600;color:#333;margin-bottom:4px;">' + p.nombre + '</div>';
                content += '<div style="font-size:12px;color:#888;">' + p.descripcion + '</div>';
                content += '<div style="display:flex;gap:12px;margin-top:8px;font-size:11px;">';
                content += '<span style="color:#00a8a8;">⏱️ ' + p.duracion + '</span>';
                content += '<span style="color:#d000d0;">🎁 ' + p.premio + '</span>';
                content += '</div></div>';
            });

            content += '<div onclick="seleccionarPlantilla(\'custom\')" id="plantilla-custom" style="background:#f5f0e8;border:2px dashed #ccc;border-radius:10px;padding:14px;cursor:pointer;text-align:center;">';
            content += '<div style="font-weight:600;color:#666;">➕ Crear personalizada</div>';
            content += '</div></div></div>';

            content += '<div id="competencia-form-fields" style="display:none;">';
            content += '<div style="margin-bottom:15px;"><label style="display:block;margin-bottom:6px;color:#666;font-size:13px;">Nombre de la competencia</label>';
            content += '<input type="text" id="promo-nombre" style="width:100%;padding:12px;background:#fff;border:1px solid #ddd;border-radius:8px;color:#333;box-sizing:border-box;"></div>';
            content += '<div style="margin-bottom:15px;"><label style="display:block;margin-bottom:6px;color:#666;font-size:13px;">Premio</label>';
            content += '<input type="text" id="promo-premio" style="width:100%;padding:12px;background:#fff;border:1px solid #ddd;border-radius:8px;color:#333;box-sizing:border-box;"></div>';
            content += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:15px;">';
            content += '<div><label style="display:block;margin-bottom:6px;color:#666;font-size:13px;">Duración</label>';
            content += '<input type="text" id="promo-duracion" placeholder="7 días" style="width:100%;padding:12px;background:#fff;border:1px solid #ddd;border-radius:8px;color:#333;box-sizing:border-box;"></div>';
            content += '<div><label style="display:block;margin-bottom:6px;color:#666;font-size:13px;">Fecha inicio</label>';
            content += '<input type="date" id="promo-fecha-inicio" style="width:100%;padding:12px;background:#fff;border:1px solid #ddd;border-radius:8px;color:#333;box-sizing:border-box;"></div></div>';
            content += '<div style="margin-bottom:15px;"><label style="display:block;margin-bottom:6px;color:#666;font-size:13px;">Mecánica</label>';
            content += '<textarea id="promo-mecanica" rows="2" style="width:100%;padding:12px;background:#fff;border:1px solid #ddd;border-radius:8px;color:#333;box-sizing:border-box;resize:vertical;"></textarea></div>';
            content += '</div>';

        } else if (tipo === 'regalo') {
            content += '<div style="margin-bottom:20px;"><label style="display:block;margin-bottom:10px;color:#666;font-size:14px;font-weight:600;">🎁 Tipo de regalo:</label>';
            content += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">';

            content += '<div onclick="seleccionarTipoRegalo(\'runas\')" id="regalo-runas" class="regalo-option" style="background:#e6fffe;border:2px solid #00b8a9;border-radius:10px;padding:16px;cursor:pointer;text-align:center;">';
            content += '<div style="font-size:28px;margin-bottom:6px;">💎</div><div style="font-weight:600;color:#008080;">Runas</div></div>';

            content += '<div onclick="seleccionarTipoRegalo(\'tiempo\')" id="regalo-tiempo" class="regalo-option" style="background:#fff;border:2px solid #e8ddd0;border-radius:10px;padding:16px;cursor:pointer;text-align:center;">';
            content += '<div style="font-size:28px;margin-bottom:6px;">⏰</div><div style="font-weight:600;color:#666;">Tiempo Gratis</div></div>';

            content += '<div onclick="seleccionarTipoRegalo(\'lectura\')" id="regalo-lectura" class="regalo-option" style="background:#fff;border:2px solid #e8ddd0;border-radius:10px;padding:16px;cursor:pointer;text-align:center;">';
            content += '<div style="font-size:28px;margin-bottom:6px;">🔮</div><div style="font-weight:600;color:#666;">Lectura Gratis</div></div>';

            content += '<div onclick="seleccionarTipoRegalo(\'descuento\')" id="regalo-descuento" class="regalo-option" style="background:#fff;border:2px solid #e8ddd0;border-radius:10px;padding:16px;cursor:pointer;text-align:center;">';
            content += '<div style="font-size:28px;margin-bottom:6px;">🏷️</div><div style="font-weight:600;color:#666;">Descuento</div></div>';

            content += '<div onclick="seleccionarTipoRegalo(\'producto\')" id="regalo-producto" class="regalo-option" style="background:#fff;border:2px solid #e8ddd0;border-radius:10px;padding:16px;cursor:pointer;text-align:center;">';
            content += '<div style="font-size:28px;margin-bottom:6px;">🧙</div><div style="font-weight:600;color:#666;">Producto Gratis</div></div>';

            content += '<div onclick="seleccionarTipoRegalo(\'circulo\')" id="regalo-circulo" class="regalo-option" style="background:#fff;border:2px solid #e8ddd0;border-radius:10px;padding:16px;cursor:pointer;text-align:center;">';
            content += '<div style="font-size:28px;margin-bottom:6px;">🌙</div><div style="font-weight:600;color:#666;">Acceso Círculo</div></div>';

            content += '</div></div>';

            content += '<input type="hidden" id="promo-tipo-regalo" value="runas">';

            content += '<div id="regalo-runas-fields">';
            content += '<div style="margin-bottom:15px;"><label style="display:block;margin-bottom:6px;color:#666;font-size:13px;">Cantidad de Runas</label>';
            content += '<select id="promo-cantidad-runas" style="width:100%;padding:12px;background:#fff;border:1px solid #ddd;border-radius:8px;color:#333;box-sizing:border-box;">';
            content += '<option value="25">25 Runas</option><option value="50" selected>50 Runas</option><option value="100">100 Runas</option><option value="200">200 Runas</option><option value="500">500 Runas</option><option value="custom">Cantidad personalizada</option></select></div>';
            content += '<div id="runas-custom" style="display:none;margin-bottom:15px;"><input type="number" id="promo-runas-custom" placeholder="Cantidad exacta" style="width:100%;padding:12px;background:#fff;border:1px solid #ddd;border-radius:8px;color:#333;box-sizing:border-box;"></div></div>';

            content += '<div id="regalo-tiempo-fields" style="display:none;">';
            content += '<div style="margin-bottom:15px;"><label style="display:block;margin-bottom:6px;color:#666;font-size:13px;">Días de acceso gratis</label>';
            content += '<select id="promo-dias" style="width:100%;padding:12px;background:#fff;border:1px solid #ddd;border-radius:8px;color:#333;box-sizing:border-box;">';
            content += '<option value="3">3 días</option><option value="7" selected>7 días</option><option value="14">14 días</option><option value="30">1 mes</option><option value="60">2 meses</option></select></div></div>';

            content += '<div id="regalo-lectura-fields" style="display:none;">';
            content += '<div style="margin-bottom:15px;"><label style="display:block;margin-bottom:6px;color:#666;font-size:13px;">Tipo de lectura</label>';
            content += '<select id="promo-tipo-lectura" style="width:100%;padding:12px;background:#fff;border:1px solid #ddd;border-radius:8px;color:#333;box-sizing:border-box;">';
            content += '<option value="energia">Lectura de Energía</option><option value="tarot">Tirada de Tarot (3 cartas)</option><option value="runas">Lectura de Runas</option><option value="guardian">Mensaje del Guardián</option></select></div></div>';

            content += '<div id="regalo-descuento-fields" style="display:none;">';
            content += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:15px;">';
            content += '<div><label style="display:block;margin-bottom:6px;color:#666;font-size:13px;">Porcentaje</label>';
            content += '<select id="promo-porcentaje" style="width:100%;padding:12px;background:#fff;border:1px solid #ddd;border-radius:8px;color:#333;box-sizing:border-box;">';
            content += '<option value="10">10%</option><option value="15">15%</option><option value="20" selected>20%</option><option value="25">25%</option><option value="30">30%</option><option value="50">50%</option></select></div>';
            content += '<div><label style="display:block;margin-bottom:6px;color:#666;font-size:13px;">Válido en</label>';
            content += '<select id="promo-valido-en" style="width:100%;padding:12px;background:#fff;border:1px solid #ddd;border-radius:8px;color:#333;box-sizing:border-box;">';
            content += '<option value="todo">Toda la tienda</option><option value="duendes">Solo duendes</option><option value="circulo">Solo El Círculo</option></select></div></div></div>';

            content += '<div id="regalo-producto-fields" style="display:none;">';
            content += '<div style="margin-bottom:15px;"><label style="display:block;margin-bottom:6px;color:#666;font-size:13px;">Producto a regalar</label>';
            content += '<select id="promo-producto" style="width:100%;padding:12px;background:#fff;border:1px solid #ddd;border-radius:8px;color:#333;box-sizing:border-box;">';
            content += '<option value="mini_guardian">Mini Guardián Digital</option><option value="meditacion">Meditación Premium</option><option value="ritual">Kit de Ritual</option></select></div></div>';

            content += '<div id="regalo-circulo-fields" style="display:none;">';
            content += '<div style="margin-bottom:15px;"><label style="display:block;margin-bottom:6px;color:#666;font-size:13px;">Duración de membresía</label>';
            content += '<select id="promo-circulo-duracion" style="width:100%;padding:12px;background:#fff;border:1px solid #ddd;border-radius:8px;color:#333;box-sizing:border-box;">';
            content += '<option value="7">7 días de prueba</option><option value="30" selected>1 mes</option><option value="90">3 meses</option></select></div></div>';

            content += '<hr style="border:none;border-top:1px solid #e8ddd0;margin:20px 0;">';

            content += '<div style="margin-bottom:15px;"><label style="display:block;margin-bottom:6px;color:#666;font-size:13px;">Destinatarios</label>';
            content += '<select id="promo-destinatarios" style="width:100%;padding:12px;background:#fff;border:1px solid #ddd;border-radius:8px;color:#333;box-sizing:border-box;">';
            content += '<option value="todos">Todos los usuarios</option><option value="circulo">Miembros del Círculo</option><option value="mi_magia">Usuarios Mi Magia</option><option value="nuevos">Usuarios nuevos (último mes)</option><option value="inactivos">Usuarios inactivos (+3 meses)</option><option value="cumpleaneros">Cumpleañeros del mes</option></select></div>';

            content += '<div style="margin-bottom:15px;"><label style="display:block;margin-bottom:6px;color:#666;font-size:13px;">Mensaje personalizado (opcional)</label>';
            content += '<textarea id="promo-mensaje" rows="2" placeholder="Este mensaje aparecerá en el email del regalo..." style="width:100%;padding:12px;background:#fff;border:1px solid #ddd;border-radius:8px;color:#333;box-sizing:border-box;resize:vertical;"></textarea></div>';
        }

        content += '<div style="display:flex;gap:12px;margin-top:20px;">';
        content += '<button onclick="ejecutarPromo(\'' + tipo + '\')" style="flex:1;padding:14px;background:linear-gradient(135deg,#00b8a9,#00d4aa);border:none;border-radius:8px;color:#fff;font-weight:600;cursor:pointer;font-size:15px;">✨ Crear</button>';
        content += '<button onclick="document.getElementById(\'promo-modal\').remove()" style="flex:1;padding:14px;background:#f5f0e8;border:1px solid #ddd;border-radius:8px;color:#666;cursor:pointer;font-size:15px;">Cancelar</button>';
        content += '</div></div>';

        modal.innerHTML = content;
        document.body.appendChild(modal);

        // Event listener para cantidad runas custom
        var selectRunas = document.getElementById('promo-cantidad-runas');
        if (selectRunas) {
            selectRunas.addEventListener('change', function() {
                document.getElementById('runas-custom').style.display = this.value === 'custom' ? 'block' : 'none';
            });
        }
    }

    var plantillaSeleccionada = null;

    function seleccionarPlantilla(id) {
        // Reset all
        document.querySelectorAll('[id^="plantilla-"]').forEach(function(el) {
            el.style.borderColor = '#e8ddd0';
            el.style.background = el.id === 'plantilla-custom' ? '#f5f0e8' : '#fff';
        });

        var el = document.getElementById('plantilla-' + id);
        if (el) {
            el.style.borderColor = '#00b8a9';
            el.style.background = '#e6fffe';
        }

        var formFields = document.getElementById('competencia-form-fields');

        if (id === 'custom') {
            plantillaSeleccionada = null;
            formFields.style.display = 'block';
            document.getElementById('promo-nombre').value = '';
            document.getElementById('promo-premio').value = '';
            document.getElementById('promo-duracion').value = '';
            document.getElementById('promo-mecanica').value = '';
        } else {
            var plantilla = plantillasCompetencias.find(function(p) { return p.id === id; });
            if (plantilla) {
                plantillaSeleccionada = plantilla;
                formFields.style.display = 'block';
                document.getElementById('promo-nombre').value = plantilla.nombre.replace(/^[^\s]+\s/, '');
                document.getElementById('promo-premio').value = plantilla.premio;
                document.getElementById('promo-duracion').value = plantilla.duracion;
                document.getElementById('promo-mecanica').value = plantilla.mecanica;
            }
        }
    }

    function seleccionarTipoRegalo(tipo) {
        // Reset all
        document.querySelectorAll('.regalo-option').forEach(function(el) {
            el.style.borderColor = '#e8ddd0';
            el.style.background = '#fff';
        });

        var el = document.getElementById('regalo-' + tipo);
        if (el) {
            el.style.borderColor = '#00b8a9';
            el.style.background = '#e6fffe';
        }

        document.getElementById('promo-tipo-regalo').value = tipo;

        // Hide all fields
        ['runas', 'tiempo', 'lectura', 'descuento', 'producto', 'circulo'].forEach(function(t) {
            var fields = document.getElementById('regalo-' + t + '-fields');
            if (fields) fields.style.display = 'none';
        });

        // Show selected
        var selectedFields = document.getElementById('regalo-' + tipo + '-fields');
        if (selectedFields) selectedFields.style.display = 'block';
    }

    function ejecutarPromo(tipo) {
        var datos = {};

        if (tipo === 'descuento' || tipo === 'cupon') {
            datos = {
                nombre: document.getElementById('promo-nombre').value,
                descuento: document.getElementById('promo-valor').value,
                tipo_descuento: document.getElementById('promo-tipo-desc').value,
                expira: document.getElementById('promo-expira').value
            };
        } else if (tipo === 'competencia') {
            datos = {
                nombre: document.getElementById('promo-nombre').value,
                premio: document.getElementById('promo-premio').value,
                duracion: document.getElementById('promo-duracion').value,
                fecha_inicio: document.getElementById('promo-fecha-inicio').value,
                mecanica: document.getElementById('promo-mecanica').value,
                plantilla_id: plantillaSeleccionada ? plantillaSeleccionada.id : null
            };
        } else if (tipo === 'regalo') {
            var tipoRegalo = document.getElementById('promo-tipo-regalo').value;
            datos = {
                tipo_regalo: tipoRegalo,
                destinatarios: document.getElementById('promo-destinatarios').value,
                mensaje: document.getElementById('promo-mensaje').value
            };

            // Agregar datos específicos según tipo de regalo
            if (tipoRegalo === 'runas') {
                var cantidadRunas = document.getElementById('promo-cantidad-runas').value;
                datos.cantidad = cantidadRunas === 'custom'
                    ? document.getElementById('promo-runas-custom').value
                    : cantidadRunas;
            } else if (tipoRegalo === 'tiempo') {
                datos.dias = document.getElementById('promo-dias').value;
            } else if (tipoRegalo === 'lectura') {
                datos.tipo_lectura = document.getElementById('promo-tipo-lectura').value;
            } else if (tipoRegalo === 'descuento') {
                datos.porcentaje = document.getElementById('promo-porcentaje').value;
                datos.valido_en = document.getElementById('promo-valido-en').value;
            } else if (tipoRegalo === 'producto') {
                datos.producto = document.getElementById('promo-producto').value;
            } else if (tipoRegalo === 'circulo') {
                datos.duracion_circulo = document.getElementById('promo-circulo-duracion').value;
            }
        }

        // Mostrar loading
        var btn = event.target;
        var originalText = btn.innerHTML;
        btn.innerHTML = '⏳ Creando...';
        btn.disabled = true;

        fetch('<?php echo DUENDES_API_URL; ?>/admin/promociones', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ tipo: tipo === 'descuento' ? 'cupon' : tipo, datos: datos })
        })
        .then(r => r.json())
        .then(result => {
            btn.innerHTML = originalText;
            btn.disabled = false;

            if (result.success) {
                var mensaje = '✅ ' + tipo.charAt(0).toUpperCase() + tipo.slice(1) + ' creado exitosamente!';

                if (result.cupon) {
                    mensaje += '\n\nCódigo: ' + result.cupon.codigo;
                }
                if (result.competencia) {
                    mensaje += '\n\n' + result.competencia.contenido.substring(0, 200) + '...';
                }
                if (result.regalo) {
                    mensaje += '\n\n' + result.regalo.contenido.substring(0, 200) + '...';
                }

                alert(mensaje);
                document.getElementById('promo-modal').remove();
            } else {
                alert('Error: ' + result.error);
            }
        })
        .catch(err => {
            btn.innerHTML = originalText;
            btn.disabled = false;
            alert('Error de conexión');
        });
    }

    document.getElementById('circulo-generar-form').addEventListener('submit', function(e) {
        e.preventDefault();
        var preview = document.getElementById('circulo-preview');
        var formData = new FormData(this);
        var periodo = formData.get('periodo');
        var mes = formData.get('mes');
        var ano = formData.get('ano');
        var tema = formData.get('tema');
        var instrucciones = formData.get('instrucciones_claude');
        var extras = formData.getAll('extras[]');

        preview.innerHTML = '<div style="color: #aa00ff;">🪄 Generando contenido mágico para ' + periodo + '...</div><div style="margin-top: 10px; color: #888; font-size: 13px;">Esto puede tomar hasta 30 segundos</div>';

        fetch('<?php echo DUENDES_API_URL; ?>/admin/circulo-content', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                periodo: periodo,
                fecha_inicio: ano + '-' + mes.padStart(2, '0') + '-01',
                tema_especial: tema,
                instrucciones_claude: instrucciones,
                extras: extras,
                notas: ''
            })
        })
        .then(r => r.json())
        .then(result => {
            if (result.success) {
                preview.innerHTML = '<div style="text-align: left; color: #333; white-space: pre-wrap; line-height: 1.8;">' + result.contenido + '</div>';
            } else {
                preview.innerHTML = '<div style="color: #ff4444;">Error: ' + result.error + '</div>';
            }
        })
        .catch(err => {
            preview.innerHTML = '<div style="color: #ff4444;">Error de conexión</div>';
        });
    });
    </script>
    <?php
}

// ═══════════════════════════════════════════════════════════════════════════
// 5. BANNERS
// ═══════════════════════════════════════════════════════════════════════════

function duendes_banners_page() {
    ?>
    <div class="wrap duendes-wrap">
        <div class="duendes-header" style="background: linear-gradient(135deg, #fff5e6 0%, #fffaf0 100%); border-bottom: 2px solid #e08000;">
            <div>
                <h1 style="background: linear-gradient(90deg, #d07000, #e09000); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">🎨 Banners & Promos</h1>
                <p>Crea banners promocionales</p>
            </div>
        </div>

        <div class="duendes-content">
            <div class="duendes-grid">
                <div class="duendes-card">
                    <div class="duendes-card-header">
                        <div class="duendes-card-icon" style="background: rgba(255, 136, 0, 0.2);">🖼️</div>
                        <h3 class="duendes-card-title">Crear Banner</h3>
                    </div>

                    <form id="banner-form">
                        <div class="duendes-form-group">
                            <label class="duendes-label">Título</label>
                            <input type="text" name="titulo" class="duendes-input" placeholder="¡50% OFF!">
                        </div>
                        <div class="duendes-form-group">
                            <label class="duendes-label">Subtítulo</label>
                            <input type="text" name="subtitulo" class="duendes-input" placeholder="Solo por tiempo limitado">
                        </div>
                        <div class="duendes-form-group">
                            <label class="duendes-label">Imagen</label>
                            <input type="file" name="imagen" class="duendes-input" accept="image/*">
                        </div>
                        <div class="duendes-form-group">
                            <label class="duendes-label">Ubicación</label>
                            <select name="ubicacion" class="duendes-select">
                                <option value="mi_magia">Mi Magia - Home</option>
                                <option value="tienda">Tienda</option>
                                <option value="checkout">Checkout</option>
                            </select>
                        </div>
                        <button type="submit" class="duendes-btn duendes-btn-orange">🎨 Crear Banner</button>
                    </form>
                </div>

                <div class="duendes-card">
                    <div class="duendes-card-header">
                        <div class="duendes-card-icon" style="background: rgba(0, 255, 255, 0.2);">📋</div>
                        <h3 class="duendes-card-title">Banners Activos</h3>
                    </div>
                    <p style="color: #888; text-align: center; padding: 40px;">No hay banners activos</p>
                </div>
            </div>
        </div>
    </div>
    <?php
}

// ═══════════════════════════════════════════════════════════════════════════
// 6. RECANALIZACIONES - ADMIN
// ═══════════════════════════════════════════════════════════════════════════

function duendes_recanalizaciones_page() {
    $solicitudes = get_option('duendes_recanalizaciones', []);
    $solicitudes = array_reverse($solicitudes); // Más recientes primero
    ?>
    <div class="wrap duendes-wrap">
        <div class="duendes-header" style="background: linear-gradient(135deg, #fff0e6 0%, #fffaf0 100%); border-bottom: 2px solid #e09000;">
            <div>
                <h1 style="background: linear-gradient(90deg, #d08000, #e0a000); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">✨ Recanalizaciones</h1>
                <p>Solicitudes de clientes con duendes existentes</p>
            </div>
            <a href="<?php echo admin_url('admin.php?page=duendes-canalizaciones'); ?>" class="duendes-btn duendes-btn-secondary">🔮 Nueva Canalización</a>
        </div>

        <div class="duendes-content">
            <div class="duendes-tabs">
                <button class="duendes-tab active" onclick="showRecanTab('pendientes')">⏳ Pendientes</button>
                <button class="duendes-tab" onclick="showRecanTab('aprobadas')">✅ Aprobadas</button>
                <button class="duendes-tab" onclick="showRecanTab('nueva')">➕ Nueva Manual</button>
            </div>

            <!-- Tab: Pendientes -->
            <div id="tab-pendientes" class="duendes-tab-content active">
                <div class="duendes-card">
                    <div class="duendes-card-header">
                        <div class="duendes-card-icon" style="background: #fff5e6;">⏳</div>
                        <h3 class="duendes-card-title">Solicitudes Pendientes</h3>
                    </div>

                    <?php
                    $pendientes = array_filter($solicitudes, fn($s) => $s['estado'] === 'pendiente');
                    if (empty($pendientes)): ?>
                        <p style="color: #888; text-align: center; padding: 40px;">No hay solicitudes pendientes</p>
                    <?php else: ?>
                        <div style="display: flex; flex-direction: column; gap: 16px;">
                            <?php foreach ($pendientes as $sol):
                                $user = get_user_by('ID', $sol['user_id']);
                            ?>
                            <div style="background: #FFFCF8; border: 2px solid <?php echo $sol['tipo'] === 'nuestro' ? '#00c070' : '#e08000'; ?>; border-radius: 12px; padding: 20px;">
                                <div style="display: flex; justify-content: space-between; align-items: start; flex-wrap: wrap; gap: 16px;">
                                    <div style="flex: 1; min-width: 200px;">
                                        <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px;">
                                            <?php if ($sol['foto_url']): ?>
                                                <img src="<?php echo esc_url($sol['foto_url']); ?>" style="width: 60px; height: 60px; border-radius: 8px; object-fit: cover;">
                                            <?php endif; ?>
                                            <div>
                                                <strong style="font-size: 16px; color: #333;"><?php echo esc_html($sol['nombre_duende']); ?></strong>
                                                <span class="duendes-badge <?php echo $sol['tipo'] === 'nuestro' ? 'duendes-badge-green' : 'duendes-badge-orange'; ?>" style="margin-left: 8px;">
                                                    <?php echo $sol['tipo'] === 'nuestro' ? 'NUESTRO - GRATIS' : 'AJENO - $7 USD'; ?>
                                                </span>
                                                <br>
                                                <small style="color: #888;">De: <?php echo $user ? esc_html($user->display_name . ' (' . $user->user_email . ')') : 'Usuario #' . $sol['user_id']; ?></small>
                                            </div>
                                        </div>

                                        <?php if ($sol['historia']): ?>
                                            <p style="color: #555; margin: 8px 0;"><strong>Historia:</strong> <?php echo esc_html($sol['historia']); ?></p>
                                        <?php endif; ?>

                                        <?php if ($sol['momento_actual']): ?>
                                            <p style="color: #555; margin: 8px 0;"><strong>Momento actual:</strong> <?php echo esc_html($sol['momento_actual']); ?></p>
                                        <?php endif; ?>

                                        <small style="color: #aaa;">Solicitado: <?php echo date('d/m/Y H:i', strtotime($sol['fecha'])); ?></small>
                                    </div>

                                    <div style="display: flex; gap: 8px;">
                                        <button class="duendes-btn duendes-btn-primary" style="padding: 10px 16px;" onclick="gestionarRecan('<?php echo $sol['id']; ?>', 'aprobar')">✅ Aprobar</button>
                                        <button class="duendes-btn duendes-btn-secondary" style="padding: 10px 16px;" onclick="gestionarRecan('<?php echo $sol['id']; ?>', 'rechazar')">❌ Rechazar</button>
                                        <?php if ($sol['tipo'] === 'nuestro'): ?>
                                            <button class="duendes-btn duendes-btn-magenta" style="padding: 10px 16px;" onclick="generarRecanalizacion('<?php echo $sol['id']; ?>')">🔮 Generar</button>
                                        <?php endif; ?>
                                    </div>
                                </div>
                            </div>
                            <?php endforeach; ?>
                        </div>
                    <?php endif; ?>
                </div>
            </div>

            <!-- Tab: Aprobadas -->
            <div id="tab-aprobadas" class="duendes-tab-content">
                <div class="duendes-card">
                    <div class="duendes-card-header">
                        <div class="duendes-card-icon" style="background: #e6fff0;">✅</div>
                        <h3 class="duendes-card-title">Solicitudes Aprobadas</h3>
                    </div>

                    <?php
                    $aprobadas = array_filter($solicitudes, fn($s) => $s['estado'] === 'aprobado' || $s['estado'] === 'completado');
                    if (empty($aprobadas)): ?>
                        <p style="color: #888; text-align: center; padding: 40px;">No hay solicitudes aprobadas</p>
                    <?php else: ?>
                        <table class="duendes-table">
                            <thead>
                                <tr>
                                    <th>Duende</th>
                                    <th>Tipo</th>
                                    <th>Usuario</th>
                                    <th>Estado</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                <?php foreach ($aprobadas as $sol):
                                    $user = get_user_by('ID', $sol['user_id']);
                                ?>
                                <tr>
                                    <td>
                                        <div style="display: flex; align-items: center; gap: 10px;">
                                            <?php if ($sol['foto_url']): ?>
                                                <img src="<?php echo esc_url($sol['foto_url']); ?>" style="width: 40px; height: 40px; border-radius: 6px; object-fit: cover;">
                                            <?php endif; ?>
                                            <?php echo esc_html($sol['nombre_duende']); ?>
                                        </div>
                                    </td>
                                    <td>
                                        <span class="duendes-badge <?php echo $sol['tipo'] === 'nuestro' ? 'duendes-badge-green' : 'duendes-badge-orange'; ?>">
                                            <?php echo $sol['tipo'] === 'nuestro' ? 'Nuestro' : 'Ajeno'; ?>
                                        </span>
                                    </td>
                                    <td><?php echo $user ? esc_html($user->user_email) : '#' . $sol['user_id']; ?></td>
                                    <td>
                                        <?php if ($sol['estado'] === 'completado'): ?>
                                            <span class="duendes-badge duendes-badge-cyan">Completado</span>
                                        <?php elseif ($sol['tipo'] === 'ajeno' && empty($sol['pagado'])): ?>
                                            <span class="duendes-badge duendes-badge-orange">Pendiente pago</span>
                                        <?php else: ?>
                                            <span class="duendes-badge duendes-badge-green">Listo</span>
                                        <?php endif; ?>
                                    </td>
                                    <td>
                                        <button class="duendes-btn duendes-btn-magenta" style="padding: 8px 12px;" onclick="generarRecanalizacion('<?php echo $sol['id']; ?>')">🔮 Generar</button>
                                    </td>
                                </tr>
                                <?php endforeach; ?>
                            </tbody>
                        </table>
                    <?php endif; ?>
                </div>
            </div>

            <!-- Tab: Nueva Manual -->
            <div id="tab-nueva" class="duendes-tab-content">
                <div class="duendes-grid" style="grid-template-columns: 1fr 1fr;">
                    <div class="duendes-card">
                        <div class="duendes-card-header">
                            <div class="duendes-card-icon" style="background: #ffe6ff;">✨</div>
                            <h3 class="duendes-card-title">Recanalización Manual</h3>
                        </div>
                        <p style="color: #666; margin-bottom: 20px;">Para duendes que no están subidos a la web todavía.</p>

                        <form id="recanalizacion-manual-form" enctype="multipart/form-data">
                            <div class="duendes-form-group">
                                <label class="duendes-label">Nombre del Duende</label>
                                <input type="text" name="nombre_duende" class="duendes-input" required placeholder="Ej: Guardián de la Abundancia">
                            </div>

                            <div class="duendes-form-group">
                                <label class="duendes-label">Foto del Duende</label>
                                <input type="file" name="foto_duende" class="duendes-input" accept="image/*" required>
                            </div>

                            <div class="duendes-grid" style="grid-template-columns: 1fr 1fr;">
                                <div class="duendes-form-group">
                                    <label class="duendes-label">Nombre Cliente</label>
                                    <input type="text" name="cliente_nombre" class="duendes-input" required>
                                </div>
                                <div class="duendes-form-group">
                                    <label class="duendes-label">Email Cliente</label>
                                    <input type="email" name="cliente_email" class="duendes-input">
                                </div>
                            </div>

                            <div class="duendes-form-group">
                                <label class="duendes-label">País</label>
                                <input type="text" name="cliente_pais" class="duendes-input">
                            </div>

                            <div class="duendes-form-group">
                                <label class="duendes-label">Historia / Contexto del duende</label>
                                <textarea name="historia" class="duendes-textarea" placeholder="Cuéntame sobre este duende..."></textarea>
                            </div>

                            <div class="duendes-form-group">
                                <label class="duendes-label">Momento actual de la persona</label>
                                <textarea name="momento_vida" class="duendes-textarea" placeholder="¿Qué está atravesando?"></textarea>
                            </div>

                            <div class="duendes-form-group">
                                <label class="duendes-label">Lo que busca/necesita</label>
                                <textarea name="necesidad" class="duendes-textarea" placeholder="Protección, abundancia, claridad..."></textarea>
                            </div>

                            <button type="submit" class="duendes-btn duendes-btn-magenta" style="width: 100%;">
                                ✨ Generar Recanalización
                            </button>
                        </form>
                    </div>

                    <div class="duendes-card">
                        <div class="duendes-card-header">
                            <div class="duendes-card-icon" style="background: #e6fffe;">👁️</div>
                            <h3 class="duendes-card-title">Vista Previa</h3>
                        </div>
                        <div id="recanalizacion-preview" style="color: #888; text-align: center; padding: 40px;">
                            La recanalización aparecerá aquí...
                        </div>
                        <div id="recanalizacion-actions" style="display: none; margin-top: 20px; gap: 12px;">
                            <button class="duendes-btn duendes-btn-primary" onclick="copiarRecanalizacion()">📋 Copiar</button>
                            <button class="duendes-btn duendes-btn-secondary" onclick="enviarRecanalizacion()">📧 Enviar al cliente</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script>
    var duendesNonce = '<?php echo wp_create_nonce('duendes_admin'); ?>';
    var ajaxUrl = '<?php echo admin_url('admin-ajax.php'); ?>';

    function showRecanTab(tab) {
        document.querySelectorAll('.duendes-tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.duendes-tab-content').forEach(c => c.classList.remove('active'));
        event.target.classList.add('active');
        document.getElementById('tab-' + tab).classList.add('active');
    }

    function gestionarRecan(id, accion) {
        var notas = '';
        if (accion === 'rechazar') {
            notas = prompt('Motivo del rechazo (opcional):');
        }

        fetch(ajaxUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: 'action=duendes_gestionar_recanalizacion&nonce=' + duendesNonce + '&id=' + id + '&accion_recan=' + accion + '&notas=' + encodeURIComponent(notas || '')
        })
        .then(r => r.json())
        .then(result => {
            if (result.success) {
                alert('✅ ' + result.data.mensaje);
                location.reload();
            }
        });
    }

    function generarRecanalizacion(id) {
        alert('Generando recanalización para solicitud ' + id + '...');
        // Aquí llamaría a la API de Claude para generar
    }

    document.getElementById('recanalizacion-manual-form').addEventListener('submit', function(e) {
        e.preventDefault();
        var preview = document.getElementById('recanalizacion-preview');
        var actions = document.getElementById('recanalizacion-actions');
        var formData = new FormData(this);

        preview.innerHTML = '<div style="color: #d000d0;">✨ Generando recanalización...</div>';

        // Para la imagen, primero la subimos, luego generamos
        fetch('<?php echo DUENDES_API_URL; ?>/admin/canalizacion-manual', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                cliente_nombre: formData.get('cliente_nombre'),
                cliente_email: formData.get('cliente_email'),
                cliente_pais: formData.get('cliente_pais'),
                momento_vida: formData.get('momento_vida'),
                necesidad: formData.get('necesidad'),
                notas: 'Duende: ' + formData.get('nombre_duende') + '. Historia: ' + formData.get('historia')
            })
        })
        .then(r => r.json())
        .then(result => {
            if (result.success) {
                preview.innerHTML = '<div style="white-space: pre-wrap; line-height: 1.8; color: #333;">' + result.canalizacion + '</div>';
                actions.style.display = 'flex';
            } else {
                preview.innerHTML = '<div style="color: #ff4444;">Error: ' + result.error + '</div>';
            }
        })
        .catch(err => {
            preview.innerHTML = '<div style="color: #ff4444;">Error de conexión</div>';
        });
    });

    function copiarRecanalizacion() {
        var text = document.getElementById('recanalizacion-preview').innerText;
        navigator.clipboard.writeText(text);
        alert('✅ Copiado!');
    }
    </script>
    <?php
}
