<?php
/**
 * Plugin Name: Duendes - Formulario Canalizacion V2
 * Description: Pagina para completar formularios de canalizacion por email
 * Version: 2.0
 */

if (!defined('ABSPATH')) exit;

// Registrar endpoint
add_action('init', function() {
    add_rewrite_rule('^completar-canalizacion/?$', 'index.php?duendes_canalizacion=1', 'top');
    add_rewrite_tag('%duendes_canalizacion%', '1');
});

// Flush rewrite rules
add_action('init', function() {
    if (get_option('duendes_canalizacion_flush') != '3') {
        flush_rewrite_rules();
        update_option('duendes_canalizacion_flush', '3');
    }
});

// Manejar la pagina
add_action('template_redirect', function() {
    if (!get_query_var('duendes_canalizacion')) return;

    if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['guardar_canalizacion'])) {
        duendes_guardar_canalizacion();
    }

    duendes_mostrar_pagina_canalizacion();
    exit;
});

function duendes_guardar_canalizacion() {
    if (!isset($_POST['order_id']) || !isset($_POST['product_id'])) return;

    $order_id = intval($_POST['order_id']);
    $product_id = intval($_POST['product_id']);

    $datos = array(
        'nombre_receptor' => sanitize_text_field($_POST['nombre_receptor'] ?? ''),
        'fecha_nacimiento' => sanitize_text_field($_POST['fecha_nacimiento'] ?? ''),
        'signo' => sanitize_text_field($_POST['signo'] ?? ''),
        'intencion' => sanitize_textarea_field($_POST['intencion'] ?? ''),
        'info_adicional' => sanitize_textarea_field($_POST['info_adicional'] ?? ''),
        'completado_en' => current_time('mysql'),
        'product_id' => $product_id
    );

    update_post_meta($order_id, '_duendes_canalizacion_' . $product_id, $datos);

    $completados = get_post_meta($order_id, '_duendes_canalizaciones_completadas', true);
    if (!is_array($completados)) $completados = array();
    $completados[] = $product_id;
    update_post_meta($order_id, '_duendes_canalizaciones_completadas', array_unique($completados));

    wp_redirect(add_query_arg(array(
        'email' => urlencode($_POST['email'] ?? ''),
        'guardado' => $product_id
    ), home_url('/completar-canalizacion/')));
    exit;
}

function duendes_mostrar_pagina_canalizacion() {
    $email = isset($_GET['email']) ? sanitize_email($_GET['email']) : '';
    $guardado = isset($_GET['guardado']) ? intval($_GET['guardado']) : 0;
    ?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Completar Canalizacion - Duendes del Uruguay</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400&display=swap" rel="stylesheet">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Cormorant Garamond', Georgia, serif; background: #0a0a0a; color: #fff; min-height: 100vh; }
        .header { background: #000; padding: 20px; text-align: center; border-bottom: 1px solid rgba(201,162,39,0.3); }
        .header a { font-family: 'Cinzel', serif; color: #c9a227; text-decoration: none; font-size: 24px; letter-spacing: 3px; }
        .container { max-width: 700px; margin: 0 auto; padding: 40px 20px; }
        h1 { font-family: 'Cinzel', serif; color: #c9a227; font-size: 28px; text-align: center; margin-bottom: 15px; letter-spacing: 2px; }
        .subtitulo { text-align: center; color: rgba(255,255,255,0.7); font-size: 18px; margin-bottom: 40px; }
        .email-form { background: #1a1a1a; padding: 35px; border-radius: 12px; border: 1px solid rgba(201,162,39,0.3); margin-bottom: 30px; }
        .email-form label { display: block; font-size: 16px; margin-bottom: 10px; color: rgba(255,255,255,0.85); }
        .email-form input[type="email"] { width: 100%; padding: 15px; font-size: 16px; border: 1px solid rgba(201,162,39,0.3); border-radius: 8px; background: rgba(255,255,255,0.05); color: #fff; font-family: 'Cormorant Garamond', serif; margin-bottom: 20px; }
        .email-form input[type="email"]:focus { outline: none; border-color: #c9a227; box-shadow: 0 0 0 3px rgba(201,162,39,0.15); }
        .email-form input::placeholder { color: rgba(255,255,255,0.4); }
        .btn { display: inline-block; width: 100%; background: #000; color: #fff; padding: 16px 30px; font-family: 'Cinzel', serif; font-size: 14px; letter-spacing: 2px; text-transform: uppercase; border: 1px solid #c9a227; border-radius: 8px; cursor: pointer; transition: all 0.3s; text-align: center; text-decoration: none; }
        .btn:hover { background: #c9a227; color: #000; }
        .orden-card { background: #1a1a1a; border-radius: 12px; border: 1px solid rgba(201,162,39,0.3); margin-bottom: 25px; overflow: hidden; }
        .orden-header { background: rgba(201,162,39,0.1); padding: 15px 20px; border-bottom: 1px solid rgba(201,162,39,0.2); }
        .orden-header h3 { font-family: 'Cinzel', serif; color: #c9a227; font-size: 16px; margin: 0; }
        .orden-fecha { font-size: 14px; color: rgba(255,255,255,0.5); margin-top: 5px; }
        .producto-item { padding: 25px; border-bottom: 1px solid rgba(255,255,255,0.05); }
        .producto-item:last-child { border-bottom: none; }
        .producto-nombre { font-size: 20px; font-weight: 600; color: #fff; margin-bottom: 5px; }
        .producto-estado { font-size: 14px; margin-bottom: 20px; }
        .estado-pendiente { color: #f4a261; }
        .estado-completado { color: #4ade80; }
        .form-canalizacion { margin-top: 20px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.1); }
        .form-canalizacion label { display: block; font-size: 15px; margin-bottom: 8px; color: rgba(255,255,255,0.85); }
        .form-canalizacion input, .form-canalizacion select, .form-canalizacion textarea { width: 100%; padding: 14px; font-size: 16px; border: 1px solid rgba(201,162,39,0.3); border-radius: 8px; background: rgba(255,255,255,0.05); color: #fff; font-family: 'Cormorant Garamond', serif; margin-bottom: 18px; }
        .form-canalizacion textarea { min-height: 100px; resize: vertical; }
        .form-canalizacion input:focus, .form-canalizacion select:focus, .form-canalizacion textarea:focus { outline: none; border-color: #c9a227; }
        .form-canalizacion select { appearance: none; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='%23c9a227' viewBox='0 0 16 16'%3E%3Cpath d='M8 11L3 6h10l-5 5z'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 15px center; }
        .form-canalizacion select option { background: #1a1a1a; color: #fff; }
        .campo-requerido { color: #c9a227; }
        .mensaje-exito { background: rgba(74, 222, 128, 0.1); border: 1px solid rgba(74, 222, 128, 0.3); color: #4ade80; padding: 20px; border-radius: 8px; text-align: center; margin-bottom: 25px; }
        .mensaje-info { background: rgba(201,162,39,0.1); border: 1px solid rgba(201,162,39,0.3); color: #c9a227; padding: 20px; border-radius: 8px; text-align: center; margin-bottom: 25px; }
        .sin-ordenes { text-align: center; padding: 50px 20px; color: rgba(255,255,255,0.6); }
        .sin-ordenes p { margin-bottom: 20px; }
        .volver-link { display: inline-block; color: #c9a227; text-decoration: none; margin-top: 30px; font-size: 16px; }
        .volver-link:hover { text-decoration: underline; }
        @media (max-width: 600px) { .container { padding: 25px 15px; } h1 { font-size: 22px; } .email-form, .producto-item { padding: 20px; } }
    </style>
</head>
<body>
    <div class="header">
        <a href="<?php echo home_url(); ?>">DUENDES DEL URUGUAY</a>
    </div>

    <div class="container">
        <h1>COMPLETAR CANALIZACION</h1>
        <p class="subtitulo">Ingresa tu email para ver tus guardianes pendientes</p>

        <?php if ($guardado): ?>
            <div class="mensaje-exito">Formulario guardado correctamente! Tu guardian ya sabe de vos.</div>
        <?php endif; ?>

        <form class="email-form" method="GET" action="">
            <label>Tu correo electronico</label>
            <input type="email" name="email" value="<?php echo esc_attr($email); ?>" placeholder="El email que usaste en tu compra" required>
            <button type="submit" class="btn">BUSCAR MIS GUARDIANES</button>
        </form>

        <?php if ($email): ?>
            <?php
            $orders = wc_get_orders(array(
                'billing_email' => $email,
                'status' => array('completed', 'processing', 'on-hold'),
                'limit' => 20,
                'orderby' => 'date',
                'order' => 'DESC'
            ));

            if (empty($orders)): ?>
                <div class="sin-ordenes">
                    <p>No encontramos ordenes con el email <strong><?php echo esc_html($email); ?></strong></p>
                    <p>Verifica que sea el mismo email que usaste al comprar.</p>
                </div>
            <?php else: ?>
                <?php
                $tiene_pendientes = false;
                foreach ($orders as $order):
                    $order_id = $order->get_id();
                    $completados = get_post_meta($order_id, '_duendes_canalizaciones_completadas', true);
                    if (!is_array($completados)) $completados = array();

                    $items = $order->get_items();
                    $guardianes = array();

                    foreach ($items as $item) {
                        $product = $item->get_product();
                        if (!$product) continue;
                        $product_id = $product->get_id();
                        $nombre = $item->get_name();

                        $guardianes[] = array(
                            'product_id' => $product_id,
                            'nombre' => $nombre,
                            'completado' => in_array($product_id, $completados),
                            'datos' => get_post_meta($order_id, '_duendes_canalizacion_' . $product_id, true)
                        );
                    }

                    if (empty($guardianes)) continue;

                    foreach ($guardianes as $g) {
                        if (!$g['completado']) $tiene_pendientes = true;
                    }
                ?>
                    <div class="orden-card">
                        <div class="orden-header">
                            <h3>Pedido #<?php echo $order_id; ?></h3>
                            <div class="orden-fecha"><?php echo $order->get_date_created()->date_i18n('j \d\e F, Y'); ?></div>
                        </div>

                        <?php foreach ($guardianes as $guardian): ?>
                            <div class="producto-item">
                                <div class="producto-nombre"><?php echo esc_html($guardian['nombre']); ?></div>

                                <?php if ($guardian['completado']): ?>
                                    <div class="producto-estado estado-completado">Canalizacion completada</div>
                                    <?php if ($guardian['datos']): ?>
                                        <p style="color: rgba(255,255,255,0.5); font-size: 14px;">
                                            Completado el <?php echo date('j/n/Y', strtotime($guardian['datos']['completado_en'])); ?>
                                            para <strong><?php echo esc_html($guardian['datos']['nombre_receptor']); ?></strong>
                                        </p>
                                    <?php endif; ?>
                                <?php else: ?>
                                    <div class="producto-estado estado-pendiente">Pendiente de completar</div>

                                    <form class="form-canalizacion" method="POST" action="">
                                        <input type="hidden" name="guardar_canalizacion" value="1">
                                        <input type="hidden" name="order_id" value="<?php echo $order_id; ?>">
                                        <input type="hidden" name="product_id" value="<?php echo $guardian['product_id']; ?>">
                                        <input type="hidden" name="email" value="<?php echo esc_attr($email); ?>">

                                        <label>Nombre completo de quien recibe el guardian <span class="campo-requerido">*</span></label>
                                        <input type="text" name="nombre_receptor" required placeholder="Nombre y apellido">

                                        <label>Fecha de nacimiento <span class="campo-requerido">*</span></label>
                                        <input type="date" name="fecha_nacimiento" required>

                                        <label>Signo zodiacal</label>
                                        <select name="signo">
                                            <option value="">Seleccionar...</option>
                                            <option>Aries</option><option>Tauro</option><option>Geminis</option>
                                            <option>Cancer</option><option>Leo</option><option>Virgo</option>
                                            <option>Libra</option><option>Escorpio</option><option>Sagitario</option>
                                            <option>Capricornio</option><option>Acuario</option><option>Piscis</option>
                                        </select>

                                        <label>Intencion o deseo para tu guardian <span class="campo-requerido">*</span></label>
                                        <textarea name="intencion" required placeholder="Describi tu intencion, deseo o proposito para este guardian..."></textarea>

                                        <label>Informacion adicional (opcional)</label>
                                        <textarea name="info_adicional" placeholder="Cualquier otra informacion que quieras compartir..."></textarea>

                                        <button type="submit" class="btn">GUARDAR CANALIZACION</button>
                                    </form>
                                <?php endif; ?>
                            </div>
                        <?php endforeach; ?>
                    </div>
                <?php endforeach; ?>

                <?php if (!$tiene_pendientes): ?>
                    <div class="mensaje-info">Todas tus canalizaciones estan completas! Tu guardian ya te conoce.</div>
                <?php endif; ?>

            <?php endif; ?>
        <?php endif; ?>

        <a href="<?php echo home_url(); ?>" class="volver-link">Volver a la tienda</a>
    </div>
</body>
</html>
    <?php
}

// Mostrar datos en admin
add_action('woocommerce_admin_order_data_after_billing_address', function($order) {
    $order_id = $order->get_id();
    $items = $order->get_items();
    $tiene_canalizaciones = false;

    foreach ($items as $item) {
        $product = $item->get_product();
        if (!$product) continue;

        $product_id = $product->get_id();
        $datos = get_post_meta($order_id, '_duendes_canalizacion_' . $product_id, true);

        if ($datos) {
            if (!$tiene_canalizaciones) {
                echo '<div style="margin-top: 20px; padding: 15px; background: #f0f0f0; border-left: 4px solid #c9a227;">';
                echo '<h3 style="margin: 0 0 15px 0; color: #333;">Datos de Canalizacion</h3>';
                $tiene_canalizaciones = true;
            }

            echo '<div style="margin-bottom: 15px; padding-bottom: 15px; border-bottom: 1px solid #ddd;">';
            echo '<strong>' . esc_html($item->get_name()) . '</strong><br>';
            echo '<small style="color: #666;">Completado: ' . esc_html($datos['completado_en']) . '</small><br><br>';
            echo '<strong>Receptor:</strong> ' . esc_html($datos['nombre_receptor']) . '<br>';
            echo '<strong>Nacimiento:</strong> ' . esc_html($datos['fecha_nacimiento']) . '<br>';
            if (!empty($datos['signo'])) echo '<strong>Signo:</strong> ' . esc_html($datos['signo']) . '<br>';
            echo '<strong>Intencion:</strong><br>' . nl2br(esc_html($datos['intencion'])) . '<br>';
            if (!empty($datos['info_adicional'])) {
                echo '<strong>Info adicional:</strong><br>' . nl2br(esc_html($datos['info_adicional']));
            }
            echo '</div>';
        }
    }

    if ($tiene_canalizaciones) {
        echo '</div>';
    }
});
