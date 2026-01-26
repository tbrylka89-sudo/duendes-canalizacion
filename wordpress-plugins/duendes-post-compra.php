<?php
/**
 * Plugin Name: Duendes - Sistema Post-Compra v3
 * Description: Emails de conversión con sincronicidad, ritual y Mi Magia
 * Version: 3.1
 * Author: Duendes del Uruguay
 */

if (!defined('ABSPATH')) exit;

// ═══════════════════════════════════════════════════════════════════════════
// SISTEMA DE GÉNERO PARA GUARDIANES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Obtener género del guardián (de meta del producto o inferido del nombre)
 * Devuelve 'f' para femenino, 'm' para masculino
 */
if (!function_exists('duendes_get_genero_guardian')) {
function duendes_get_genero_guardian($product_id, $nombre_guardian = '') {
    // Primero intentar obtener del meta del producto
    $genero = get_post_meta($product_id, '_guardian_genero', true);
    if ($genero) return $genero;

    // Inferir del nombre si termina en 'a' (excepto algunas excepciones)
    $nombre = strtolower(trim($nombre_guardian));
    $excepciones_masculinas = ['karma', 'lama', 'yoga', 'enigma', 'plasma'];
    $excepciones_femeninas = ['sol', 'luz', 'flor', 'paz'];

    if (in_array($nombre, $excepciones_masculinas)) return 'm';
    if (in_array($nombre, $excepciones_femeninas)) return 'f';

    // Nombres que terminan en 'a' o 'eta' suelen ser femeninos
    if (preg_match('/(a|eta|ina|ela|ita)$/i', $nombre)) return 'f';

    // Por defecto masculino
    return 'm';
}
} // end if !function_exists

/**
 * Obtener pronombres según género
 */
if (!function_exists('duendes_pronombres')) {
function duendes_pronombres($genero) {
    if ($genero === 'f') {
        return [
            'el_ella' => 'ella',
            'lo_la' => 'la',
            'El_Ella' => 'Ella',
            'un_una' => 'una',
            'este_esta' => 'esta',
            'listo_lista' => 'lista',
            'él_ella' => 'ella',
            'lo_la_mayus' => 'La',
            'solo_sola' => 'sola',
            'mismo_misma' => 'misma',
            'preparado_a' => 'preparada',
            'único_a' => 'única',
            'esperando' => 'esperando',
        ];
    }
    return [
        'el_ella' => 'él',
        'lo_la' => 'lo',
        'El_Ella' => 'Él',
        'un_una' => 'un',
        'este_esta' => 'este',
        'listo_lista' => 'listo',
        'él_ella' => 'él',
        'lo_la_mayus' => 'Lo',
        'solo_sola' => 'solo',
        'mismo_misma' => 'mismo',
        'preparado_a' => 'preparado',
        'único_a' => 'único',
        'esperando' => 'esperando',
    ];
}
} // end if !function_exists

// ═══════════════════════════════════════════════════════════════════════════
// MOTOR DE SINCRONICIDAD
// ═══════════════════════════════════════════════════════════════════════════

function duendes_sincronicidad($nombre_cliente, $nombre_guardian, $fecha = null) {
    $fecha = $fecha ?: time();
    $sincros = [];

    // Día de la semana
    $dias = [
        0 => ['nombre' => 'domingo', 'energia' => 'del Sol, de nuevos comienzos', 'accion' => 'Es día de claridad'],
        1 => ['nombre' => 'lunes', 'energia' => 'de la Luna, de intuición', 'accion' => 'Tu intuición está amplificada'],
        2 => ['nombre' => 'martes', 'energia' => 'de Marte, de acción', 'accion' => 'Es momento de moverte'],
        3 => ['nombre' => 'miércoles', 'energia' => 'de Mercurio, de comunicación', 'accion' => 'Las palabras tienen poder hoy'],
        4 => ['nombre' => 'jueves', 'energia' => 'de Júpiter, de expansión', 'accion' => 'Todo se amplifica'],
        5 => ['nombre' => 'viernes', 'energia' => 'de Venus, de amor', 'accion' => 'El amor guía el camino'],
        6 => ['nombre' => 'sábado', 'energia' => 'de Saturno, de estructura', 'accion' => 'Es día de construir bases']
    ];
    $dia = $dias[date('w', $fecha)];
    $sincros['dia'] = "Te escribimos un {$dia['nombre']}, día {$dia['energia']}. {$dia['accion']}.";

    // Letras del nombre
    $letras_cliente = strlen(preg_replace('/[^a-zA-Z]/', '', $nombre_cliente));
    $letras_guardian = strlen(preg_replace('/[^a-zA-Z]/', '', $nombre_guardian));
    if ($letras_cliente === $letras_guardian) {
        $sincros['nombre'] = "Tu nombre y el de {$nombre_guardian} tienen la misma cantidad de letras ({$letras_cliente}). Los números no mienten.";
    } elseif (abs($letras_cliente - $letras_guardian) === 1) {
        $sincros['nombre'] = "Tu nombre tiene {$letras_cliente} letras, {$nombre_guardian} tiene {$letras_guardian}. Números consecutivos: conexión en proceso.";
    }

    // Hora
    $hora = (int)date('G', $fecha);
    if ($hora >= 0 && $hora < 6) {
        $sincros['hora'] = "Este mensaje llega en la madrugada, cuando el velo es más fino.";
    } elseif ($hora >= 6 && $hora < 12) {
        $sincros['hora'] = "La mañana es momento de siembra. Lo que empieza ahora, crece.";
    } elseif ($hora >= 12 && $hora < 18) {
        $sincros['hora'] = "La tarde es de cosecha. Algo que sembraste antes está dando frutos.";
    } else {
        $sincros['hora'] = "La noche guarda secretos. Prestá atención a tus sueños.";
    }

    // Día del mes
    $dia_mes = (int)date('j', $fecha);
    $significados = [
        1 => 'nuevos comienzos', 2 => 'dualidad y equilibrio', 3 => 'creatividad y expresión',
        4 => 'estructura y fundamentos', 5 => 'cambio y libertad', 6 => 'amor y responsabilidad',
        7 => 'introspección y sabiduría', 8 => 'abundancia y poder', 9 => 'cierre y culminación',
        11 => 'intuición elevada', 22 => 'maestría constructora', 33 => 'sanación profunda'
    ];
    $num = $dia_mes;
    while ($num > 9 && !in_array($num, [11, 22, 33])) {
        $num = array_sum(str_split($num));
    }
    if (isset($significados[$num])) {
        $sincros['numero'] = "Hoy es {$dia_mes}, que reduce a {$num}: {$significados[$num]}.";
    }

    return $sincros;
}

function duendes_sincronicidad_html($sincros) {
    if (empty($sincros)) return '';

    $texto = array_values($sincros)[0]; // Usar solo una para no saturar

    return '
    <div style="background:rgba(198,169,98,0.08);padding:15px 20px;border-radius:12px;margin:20px 0;border-left:3px solid #C6A962;">
        <p style="color:rgba(255,255,255,0.8);font-size:14px;margin:0;font-style:italic;">
            ✨ ' . esc_html($texto) . '
        </p>
    </div>';
}

// ═══════════════════════════════════════════════════════════════════════════
// CROSS-SELL ESPIRITUAL
// ═══════════════════════════════════════════════════════════════════════════

function duendes_crosssell_espiritual($product_id, $nombre_guardian) {
    if (!$product_id) return '';

    $args = [
        'post_type' => 'product',
        'posts_per_page' => 2,
        'post__not_in' => [$product_id],
        'post_status' => 'publish',
        'orderby' => 'rand'
    ];

    $complementarios = [];
    $query = new WP_Query($args);
    if ($query->have_posts()) {
        while ($query->have_posts()) {
            $query->the_post();
            $prod = wc_get_product(get_the_ID());
            if ($prod) {
                $complementarios[] = [
                    'nombre' => $prod->get_name(),
                    'imagen' => wp_get_attachment_url($prod->get_image_id()),
                    'url' => get_permalink(),
                    'precio' => $prod->get_price()
                ];
            }
        }
        wp_reset_postdata();
    }

    if (empty($complementarios)) return '';

    $html = '
    <div style="margin:30px 0;padding:25px;background:rgba(198,169,98,0.05);border-radius:15px;border:1px solid rgba(198,169,98,0.15);">
        <p style="color:rgba(255,255,255,0.7);font-size:15px;margin:0 0 8px 0;text-align:center;">
            Los duendes somos seres sociables.
        </p>
        <p style="color:#C6A962;font-size:14px;margin:0 0 20px 0;text-align:center;font-style:italic;">
            ' . esc_html($nombre_guardian) . ' nos contó que estos complementarían su energía:
        </p>
        <table width="100%" cellpadding="0" cellspacing="0"><tr>';

    foreach ($complementarios as $comp) {
        $html .= '
            <td style="text-align:center;padding:10px;width:50%;">
                <a href="' . esc_url($comp['url']) . '" style="text-decoration:none;">
                    <img src="' . esc_url($comp['imagen']) . '" style="width:90px;height:90px;border-radius:50%;object-fit:cover;border:2px solid rgba(198,169,98,0.3);">
                    <p style="color:#fff;font-size:14px;margin:10px 0 4px 0;">' . esc_html($comp['nombre']) . '</p>
                    <p style="color:#C6A962;font-size:13px;margin:0;">$' . esc_html($comp['precio']) . ' USD</p>
                </a>
            </td>';
    }

    $html .= '</tr></table>
        <p style="text-align:center;margin:20px 0 0 0;font-size:13px;color:rgba(255,255,255,0.5);">
            ¿Sabías que trabajamos mejor en tríadas?
        </p>
    </div>';

    return $html;
}

// ═══════════════════════════════════════════════════════════════════════════
// CERTIFICADO DIGITAL
// ═══════════════════════════════════════════════════════════════════════════

function duendes_generar_certificado($datos) {
    $nombre_cliente = $datos['nombre_cliente'] ?? 'Alma Mágica';
    $nombre_guardian = $datos['nombre_guardian'] ?? 'Guardián';
    $fecha_compra = $datos['fecha_compra'] ?? date('d/m/Y');
    $numero_pedido = $datos['numero_pedido'] ?? '0000';
    $categoria = $datos['categoria'] ?? 'Protección';
    $codigo_unico = $datos['codigo_unico'] ?? strtoupper(substr(md5($numero_pedido . $nombre_guardian), 0, 8));
    $imagen_guardian = $datos['imagen_guardian'] ?? '';

    $share_url = home_url('/certificado/' . $numero_pedido);
    $share_text = urlencode("Mi guardiana " . $nombre_guardian . " ya está conmigo. Mirá mi certificado:");

    return '<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Certificado de ' . esc_html($nombre_guardian) . '</title>
    <meta property="og:title" content="Mi guardiana ' . esc_html($nombre_guardian) . '">
    <meta property="og:description" content="' . esc_html($nombre_cliente) . ' recibió una canalización original">
    <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600&family=Cormorant+Garamond:ital,wght@0,400;1,400&display=swap" rel="stylesheet">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: "Cormorant Garamond", Georgia, serif; background: #0a0a0f; min-height: 100vh; padding: 20px; }
        .container { max-width: 800px; margin: 0 auto; }
        .certificado { background: linear-gradient(180deg, #1a1a28 0%, #0f0f18 100%); border: 2px solid rgba(198,169,98,0.4); border-radius: 20px; overflow: hidden; }
        .barra-top { height: 6px; background: linear-gradient(90deg, transparent, #C6A962, #8B7355, #C6A962, transparent); }
        .contenido { padding: 50px 40px; text-align: center; }
        .label { font-size: 11px; letter-spacing: 4px; color: rgba(198,169,98,0.6); text-transform: uppercase; }
        .titulo { font-family: "Cinzel", serif; font-size: 26px; color: #C6A962; letter-spacing: 2px; margin: 8px 0; }
        .subtitulo { color: rgba(255,255,255,0.5); font-style: italic; font-size: 14px; }
        .separador { width: 120px; height: 1px; background: linear-gradient(90deg, transparent, rgba(198,169,98,0.5), transparent); margin: 25px auto; }
        .imagen-guardian img { width: 140px; height: 140px; border-radius: 50%; object-fit: cover; border: 3px solid rgba(198,169,98,0.4); box-shadow: 0 0 30px rgba(198,169,98,0.2); }
        .nombre-guardian { font-family: "Cinzel", serif; font-size: 36px; color: #fff; margin: 20px 0 8px 0; text-shadow: 0 0 20px rgba(198,169,98,0.2); }
        .categoria { display: inline-block; padding: 6px 18px; background: rgba(198,169,98,0.12); border: 1px solid rgba(198,169,98,0.25); border-radius: 20px; color: #C6A962; font-size: 12px; letter-spacing: 2px; }
        .cliente-section { margin: 30px 0; padding: 20px; background: rgba(198,169,98,0.04); border-radius: 12px; }
        .cliente-nombre { font-family: "Cinzel", serif; font-size: 22px; color: #fff; margin: 8px 0; }
        .mensaje { color: rgba(255,255,255,0.65); font-size: 15px; line-height: 1.6; max-width: 400px; margin: 0 auto; font-style: italic; }
        .footer-data { display: flex; justify-content: center; gap: 35px; flex-wrap: wrap; margin-top: 25px; padding-top: 20px; border-top: 1px solid rgba(198,169,98,0.15); }
        .dato { text-align: center; }
        .dato .label { font-size: 9px; margin-bottom: 4px; }
        .dato .valor { font-family: "Cinzel", serif; font-size: 13px; color: rgba(255,255,255,0.8); }
        .codigo { font-family: monospace; color: #C6A962; letter-spacing: 2px; }
        .firma { margin-top: 25px; color: rgba(255,255,255,0.5); font-size: 13px; }
        .firma span { color: #C6A962; font-family: "Cinzel", serif; }
        .share-section { margin-top: 25px; padding: 20px; background: rgba(198,169,98,0.06); border-radius: 12px; }
        .share-titulo { color: #C6A962; font-size: 15px; margin-bottom: 12px; }
        .share-buttons { display: flex; justify-content: center; gap: 10px; flex-wrap: wrap; }
        .share-btn { padding: 8px 16px; border-radius: 20px; text-decoration: none; font-size: 13px; transition: transform 0.2s; }
        .share-btn:hover { transform: translateY(-2px); }
        .share-btn.whatsapp { background: #25D366; color: #fff; }
        .share-btn.copy { background: rgba(198,169,98,0.15); color: #C6A962; border: 1px solid rgba(198,169,98,0.3); cursor: pointer; }
        .acciones { margin-top: 20px; display: flex; gap: 10px; justify-content: center; }
        .btn-accion { padding: 8px 20px; border: 1px solid rgba(198,169,98,0.4); background: rgba(198,169,98,0.08); color: #C6A962; font-size: 13px; cursor: pointer; border-radius: 20px; }
        .btn-accion:hover { background: rgba(198,169,98,0.15); }
        @media (max-width: 500px) { .contenido { padding: 30px 20px; } .nombre-guardian { font-size: 28px; } }
        @media print { .share-section, .acciones { display: none !important; } }
    </style>
</head>
<body>
    <div class="container">
        <div class="certificado">
            <div class="barra-top"></div>
            <div class="contenido">
                <div class="label">Certificado Oficial</div>
                <h1 class="titulo">Canalización Original</h1>
                <p class="subtitulo">Duendes del Uruguay</p>
                <div class="separador"></div>
                ' . ($imagen_guardian ? '<div class="imagen-guardian"><img src="' . esc_url($imagen_guardian) . '" alt="' . esc_attr($nombre_guardian) . '"></div>' : '') . '
                <div class="label" style="margin-top:20px;">Guardiana Canalizada</div>
                <h2 class="nombre-guardian">' . esc_html($nombre_guardian) . '</h2>
                <span class="categoria">' . esc_html($categoria) . '</span>
                <div class="cliente-section">
                    <p style="color:rgba(255,255,255,0.5);font-size:13px;">Este certificado acredita que</p>
                    <h3 class="cliente-nombre">' . esc_html($nombre_cliente) . '</h3>
                    <p class="mensaje">estableció una conexión única con esta guardiana, quien canalizó un mensaje exclusivo para acompañar su camino.</p>
                </div>
                <div class="footer-data">
                    <div class="dato"><div class="label">Fecha</div><div class="valor">' . esc_html($fecha_compra) . '</div></div>
                    <div class="dato"><div class="label">Código</div><div class="codigo">' . esc_html($codigo_unico) . '</div></div>
                    <div class="dato"><div class="label">Pedido</div><div class="valor">#' . esc_html($numero_pedido) . '</div></div>
                </div>
                <div class="firma">Con amor desde el bosque<br><span>Thibisay & Gabriel</span></div>
            </div>
        </div>
        <div class="share-section">
            <p class="share-titulo">Compartí tu conexión</p>
            <div class="share-buttons">
                <a href="https://wa.me/?text=' . $share_text . '%20' . urlencode($share_url) . '" target="_blank" class="share-btn whatsapp">WhatsApp</a>
                <button class="share-btn copy" onclick="navigator.clipboard.writeText(\'' . esc_js($share_url) . '\');alert(\'Link copiado!\')">Copiar link</button>
            </div>
        </div>
        <div class="acciones">
            <button class="btn-accion" onclick="window.print()">Imprimir</button>
            <button class="btn-accion" onclick="descargarImagen()">Descargar</button>
        </div>
    </div>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>
    <script>
    function descargarImagen() {
        const btn = event.target;
        btn.textContent = "Generando...";
        btn.disabled = true;
        html2canvas(document.querySelector(".certificado"), { scale: 2, backgroundColor: "#0a0a0f", useCORS: true }).then(canvas => {
            const link = document.createElement("a");
            link.download = "certificado-' . sanitize_title($nombre_guardian) . '.png";
            link.href = canvas.toDataURL("image/png");
            link.click();
            btn.textContent = "Descargar";
            btn.disabled = false;
        }).catch(() => {
            alert("Error. Usá Imprimir como alternativa.");
            btn.textContent = "Descargar";
            btn.disabled = false;
        });
    }
    </script>
</body>
</html>';
}

// Endpoint certificado
add_action('init', function() {
    add_rewrite_rule('^certificado/([0-9]+)/?$', 'index.php?certificado_order=$matches[1]', 'top');
});

add_filter('query_vars', function($vars) {
    $vars[] = 'certificado_order';
    return $vars;
});

add_action('template_redirect', function() {
    $order_id = get_query_var('certificado_order');
    if (!$order_id) return;

    $order = wc_get_order($order_id);
    if (!$order) { wp_die('Certificado no encontrado'); }

    $items = $order->get_items();
    $primer_item = reset($items);
    $product_id = $primer_item ? $primer_item->get_product_id() : 0;
    $product = wc_get_product($product_id);

    $categoria = 'Guardiana';
    $imagen_guardian = '';
    if ($product) {
        $terms = get_the_terms($product_id, 'product_cat');
        if ($terms && !is_wp_error($terms)) $categoria = $terms[0]->name;
        $imagen_id = $product->get_image_id();
        if ($imagen_id) $imagen_guardian = wp_get_attachment_url($imagen_id);
    }

    echo duendes_generar_certificado([
        'nombre_cliente' => $order->get_billing_first_name() . ' ' . $order->get_billing_last_name(),
        'nombre_guardian' => $primer_item ? $primer_item->get_name() : 'Guardiana',
        'fecha_compra' => $order->get_date_created()->date('d/m/Y'),
        'numero_pedido' => $order_id,
        'categoria' => $categoria,
        'codigo_unico' => strtoupper(substr(md5($order_id . $order->get_order_key()), 0, 8)),
        'imagen_guardian' => $imagen_guardian
    ]);
    exit;
});

register_activation_hook(__FILE__, function() { flush_rewrite_rules(); });

// ═══════════════════════════════════════════════════════════════════════════
// EMAIL 1: EN PREPARACIÓN
// ═══════════════════════════════════════════════════════════════════════════

add_action('woocommerce_order_status_processing', function($order_id) {
    $order = wc_get_order($order_id);
    if (!$order) return;

    $email = $order->get_billing_email();
    $nombre = $order->get_billing_first_name();

    $items = $order->get_items();
    $primer_item = reset($items);
    $nombre_guardian = $primer_item ? $primer_item->get_name() : 'tu guardiana';
    $product_id = $primer_item ? $primer_item->get_product_id() : 0;

    // Obtener género y pronombres
    $genero = duendes_get_genero_guardian($product_id, $nombre_guardian);
    $p = duendes_pronombres($genero);

    $sincros = duendes_sincronicidad($nombre, $nombre_guardian);
    $sincro_html = duendes_sincronicidad_html($sincros);
    $crosssell = duendes_crosssell_espiritual($product_id, $nombre_guardian);

    $contenido = '
        <p style="font-size:18px;color:#C6A962;margin-bottom:5px;">' . esc_html($nombre) . ',</p>
        <p style="font-size:22px;color:#fff;margin-bottom:20px;">' . esc_html($nombre_guardian) . ' sabe que la elegiste.</p>

        <p style="color:rgba(255,255,255,0.85);line-height:1.7;">
            En este momento está recibiendo los últimos toques antes de viajar hacia vos.
            No es un proceso mecánico: cada guardiana se prepara de forma única para quien la espera.
        </p>

        ' . $sincro_html . '

        <div style="background:rgba(198,169,98,0.08);padding:20px;border-radius:12px;margin:25px 0;">
            <p style="color:#C6A962;margin:0 0 12px 0;font-size:15px;">Mientras tanto:</p>
            <p style="color:rgba(255,255,255,0.8);margin:0;line-height:1.8;">
                • Pensá dónde va a vivir<br>
                • Si tenés cristales, podés dejarlos cerca de ese lugar<br>
                • Simplemente... esperala
            </p>
        </div>

        <p style="color:rgba(255,255,255,0.7);font-size:14px;margin-top:25px;">
            Te escribimos apenas salga del bosque.
        </p>

        ' . $crosssell . '

        <p style="color:rgba(255,255,255,0.5);font-size:13px;margin-top:30px;text-align:center;">
            — Thibisay & Gabriel<br>
            <span style="font-size:12px;">Duendes del Uruguay</span>
        </p>
    ';

    duendes_enviar_email($email, $nombre_guardian . ' está siendo preparada', $contenido, 'En Preparación', 'Tu guardiana casi está lista');
});

// ═══════════════════════════════════════════════════════════════════════════
// EMAIL 2: EN CAMINO
// ═══════════════════════════════════════════════════════════════════════════

add_action('woocommerce_order_status_completed', function($order_id) {
    $order = wc_get_order($order_id);
    if (!$order || $order->get_meta('_email_encamino_sent')) return;

    $email = $order->get_billing_email();
    $nombre = $order->get_billing_first_name();

    $items = $order->get_items();
    $primer_item = reset($items);
    $nombre_guardian = $primer_item ? $primer_item->get_name() : 'tu guardiana';
    $product_id = $primer_item ? $primer_item->get_product_id() : 0;

    // Obtener género y pronombres
    $genero = duendes_get_genero_guardian($product_id, $nombre_guardian);
    $p = duendes_pronombres($genero);

    $tracking = $order->get_meta('_tracking_number') ?: $order->get_meta('tracking_number') ?: '';
    $tracking_url = $order->get_meta('_tracking_url') ?: '';

    $tracking_html = '';
    if ($tracking) {
        $tracking_html = '
        <div style="background:rgba(198,169,98,0.12);padding:20px;border-radius:12px;margin:20px 0;text-align:center;">
            <p style="color:rgba(255,255,255,0.6);margin:0 0 6px 0;font-size:12px;">Número de seguimiento</p>
            <p style="color:#C6A962;font-size:18px;font-family:monospace;margin:0;letter-spacing:1px;">' . esc_html($tracking) . '</p>
            ' . ($tracking_url ? '<p style="margin:12px 0 0 0;"><a href="' . esc_url($tracking_url) . '" style="color:#C6A962;font-size:14px;">Seguir envío →</a></p>' : '') . '
        </div>';
    }

    $crosssell = duendes_crosssell_espiritual($product_id, $nombre_guardian);

    $contenido = '
        <p style="font-size:22px;color:#C6A962;margin-bottom:20px;">' . esc_html($nombre) . ', salió.</p>

        <p style="color:rgba(255,255,255,0.85);line-height:1.7;">
            <strong style="color:#fff;">' . esc_html($nombre_guardian) . '</strong> acaba de salir del bosque y está viajando hacia vos.
        </p>

        ' . $tracking_html . '

        <div style="background:rgba(198,169,98,0.08);padding:20px;border-radius:12px;margin:25px 0;">
            <p style="color:#C6A962;margin:0 0 12px 0;font-size:15px;">Cuando llegue:</p>
            <p style="color:rgba(255,255,255,0.8);margin:0;line-height:1.8;">
                • No la abras apurada<br>
                • Buscá un momento tranquilo<br>
                • Te vamos a mandar el ritual de activación
            </p>
        </div>

        <p style="color:rgba(255,255,255,0.85);margin:20px 0;">
            Tu certificado de canalización ya está disponible en <strong style="color:#C6A962;">Mi Magia</strong>,
            tu portal personal donde vas a encontrar todo sobre tu guardiana.
        </p>

        <p style="text-align:center;margin:25px 0;">
            <a href="' . home_url('/certificado/' . $order_id) . '" style="display:inline-block;padding:14px 28px;background:linear-gradient(135deg,#C6A962,#a88a42);color:#000;text-decoration:none;border-radius:25px;font-weight:600;">Ver mi certificado</a>
        </p>

        ' . $crosssell . '

        <p style="color:rgba(255,255,255,0.5);font-size:13px;margin-top:30px;text-align:center;">
            — Thibisay & Gabriel
        </p>
    ';

    $enviado = duendes_enviar_email($email, '¡' . $nombre_guardian . ' está en camino!', $contenido, 'En Camino', 'Tu guardiana ya salió del bosque');

    if ($enviado) {
        $order->update_meta_data('_email_encamino_sent', true);
        $order->save();
    }

    // Programar ritual
    $pais = $order->get_shipping_country() ?: $order->get_billing_country();
    $dias = ($pais === 'UY') ? 2 : 5;
    wp_schedule_single_event(time() + ($dias * DAY_IN_SECONDS), 'duendes_enviar_ritual_v3', [$order_id]);
}, 5);

// ═══════════════════════════════════════════════════════════════════════════
// EMAIL 3: RITUAL DE ACTIVACIÓN
// ═══════════════════════════════════════════════════════════════════════════

add_action('duendes_enviar_ritual_v3', function($order_id) {
    $order = wc_get_order($order_id);
    if (!$order || $order->get_meta('_ritual_v3_sent')) return;

    $email = $order->get_billing_email();
    $nombre = $order->get_billing_first_name();

    $items = $order->get_items();
    $primer_item = reset($items);
    $nombre_guardian = $primer_item ? $primer_item->get_name() : 'tu guardiana';
    $product_id = $primer_item ? $primer_item->get_product_id() : 0;

    // Obtener género y pronombres
    $genero = duendes_get_genero_guardian($product_id, $nombre_guardian);
    $p = duendes_pronombres($genero);

    $sincros = duendes_sincronicidad($nombre, $nombre_guardian);
    $dia_info = $sincros['dia'] ?? '';

    $contenido = '
        <p style="font-size:22px;color:#C6A962;margin-bottom:8px;">' . esc_html($nombre) . ', llegó el momento.</p>

        <p style="color:rgba(255,255,255,0.6);font-size:14px;margin-bottom:20px;font-style:italic;">
            ' . esc_html($dia_info) . '
        </p>

        <p style="color:rgba(255,255,255,0.85);line-height:1.7;">
            Si <strong style="color:#C6A962;">' . esc_html($nombre_guardian) . '</strong> ya llegó, este es el momento de conectar.
            Si todavía no, guardá este mail. ' . $p['El_Ella'] . ' sabe esperar.
        </p>

        <div style="background:rgba(198,169,98,0.08);padding:25px;border-radius:15px;margin:25px 0;border:1px solid rgba(198,169,98,0.15);">
            <p style="color:#C6A962;font-size:18px;margin:0 0 20px 0;text-align:center;">El Ritual</p>

            <p style="color:rgba(255,255,255,0.85);line-height:1.9;margin:0;">
                <strong style="color:#C6A962;">Apagá el celular.</strong> Este momento es tuyo.<br><br>

                Abrí el paquete despacio. No hay apuro. Mirala a los ojos antes de sacarla.<br><br>

                <strong style="color:#C6A962;">Sostenela entre tus manos.</strong> Cerrá los ojos. Respirá tres veces, profundo.<br><br>

                Decile tu nombre. Contale quién sos, qué estás atravesando, en qué necesitás que te acompañe.
                No hace falta que sea perfecto. ' . $p['El_Ella'] . ' entiende.<br><br>

                <strong style="color:#C6A962;">Elegí su lugar.</strong> Donde va a vivir en tu espacio. ' . $p['El_Ella'] . ' te va a mostrar dónde.<br><br>

                Por último, leé la canalización que viene en la caja. Es el mensaje que canalizó específicamente para vos.
            </p>
        </div>

        <div style="background:rgba(100,180,100,0.08);padding:20px;border-radius:12px;margin:25px 0;border:1px solid rgba(100,180,100,0.15);">
            <p style="color:#8fbc8f;font-size:16px;margin:0 0 10px 0;">El Grimorio de Mi Magia</p>
            <p style="color:rgba(255,255,255,0.75);font-size:14px;margin:0;line-height:1.7;">
                A partir de hoy, prestá atención. Sueños, coincidencias, sensaciones.
                Las guardianas se comunican de formas sutiles. Anotá todo en tu <strong>Grimorio</strong> dentro de Mi Magia.
                En una semana te escribimos para saber qué notaste.
            </p>
        </div>

        <div style="background:rgba(198,169,98,0.06);padding:20px;border-radius:12px;margin:25px 0;text-align:center;">
            <p style="color:#C6A962;font-size:15px;margin:0 0 8px 0;">15 días gratis en El Círculo</p>
            <p style="color:rgba(255,255,255,0.7);font-size:14px;margin:0 0 15px 0;">
                Comunidad de Elegidos. Contenido exclusivo, foro privado, descuentos únicos.
            </p>
            <a href="https://mi-magia.duendesdeluruguay.com/circulo" style="color:#C6A962;font-size:14px;">Activar mi trial →</a>
        </div>

        <p style="text-align:center;margin:25px 0;">
            <a href="' . home_url('/certificado/' . $order_id) . '" style="display:inline-block;padding:14px 28px;background:linear-gradient(135deg,#C6A962,#a88a42);color:#000;text-decoration:none;border-radius:25px;font-weight:600;">Ver mi certificado</a>
        </p>

        <p style="color:rgba(255,255,255,0.5);font-size:13px;margin-top:30px;text-align:center;">
            Con todo el cariño,<br>
            — Thibisay & Gabriel
        </p>
    ';

    $enviado = duendes_enviar_email($email, 'Ritual de Activación para ' . $nombre_guardian, $contenido, 'Ritual de Activación', 'Es momento de conectar');

    if ($enviado) {
        $order->update_meta_data('_ritual_v3_sent', true);
        $order->save();
    }

    // Programar email Mi Magia (1 día después)
    wp_schedule_single_event(time() + DAY_IN_SECONDS, 'duendes_email_portal_v3', [$order_id]);
});

// ═══════════════════════════════════════════════════════════════════════════
// EMAIL 4: TU PORTAL SE ACTIVÓ (Mi Magia) - MÁS TENTADOR
// ═══════════════════════════════════════════════════════════════════════════

add_action('duendes_email_portal_v3', function($order_id) {
    $order = wc_get_order($order_id);
    if (!$order || $order->get_meta('_email_portal_sent')) return;

    $email = $order->get_billing_email();
    $nombre = $order->get_billing_first_name();

    $items = $order->get_items();
    $primer_item = reset($items);
    $nombre_guardian = $primer_item ? $primer_item->get_name() : 'tu guardiana';
    $product_id = $primer_item ? $primer_item->get_product_id() : 0;

    // Obtener género y pronombres
    $genero = duendes_get_genero_guardian($product_id, $nombre_guardian);
    $p = duendes_pronombres($genero);

    $contenido = '
        <p style="font-size:22px;color:#C6A962;margin-bottom:20px;">' . esc_html($nombre) . ', desbloqueaste algo.</p>

        <p style="color:rgba(255,255,255,0.85);line-height:1.7;">
            Ahora que <strong style="color:#C6A962;">' . esc_html($nombre_guardian) . '</strong> está con vos,
            se te abrió <strong>Mi Magia</strong>: un portal que muy pocas personas conocen.
        </p>

        <p style="color:rgba(255,255,255,0.85);line-height:1.7;margin-top:15px;">
            No es una página web más. Es tu espacio privado para conectar con lo que no se ve.
        </p>

        <div style="background:rgba(198,169,98,0.08);padding:25px;border-radius:15px;margin:25px 0;">
            <p style="color:#C6A962;font-size:16px;margin:0 0 18px 0;">Lo que te espera adentro:</p>

            <div style="margin-bottom:18px;padding-bottom:18px;border-bottom:1px solid rgba(198,169,98,0.15);">
                <p style="color:#C6A962;font-size:14px;margin:0 0 4px 0;">📔 Tu Grimorio Secreto</p>
                <p style="color:rgba(255,255,255,0.75);font-size:13px;margin:0;">Anotá cada sueño, cada coincidencia, cada señal. Con el tiempo vas a ver patrones que hoy no ves.</p>
            </div>

            <div style="margin-bottom:18px;padding-bottom:18px;border-bottom:1px solid rgba(198,169,98,0.15);">
                <p style="color:#C6A962;font-size:14px;margin:0 0 4px 0;">🎁 Cofre Diario</p>
                <p style="color:rgba(255,255,255,0.75);font-size:13px;margin:0;">Cada día que entrás, un regalo. Runas, mensajes, sorpresas. Mantené tu racha y los regalos mejoran.</p>
            </div>

            <div style="margin-bottom:18px;padding-bottom:18px;border-bottom:1px solid rgba(198,169,98,0.15);">
                <p style="color:#C6A962;font-size:14px;margin:0 0 4px 0;">✨ Experiencias Mágicas</p>
                <p style="color:rgba(255,255,255,0.75);font-size:13px;margin:0;">Tiradas de runas, lecturas personalizadas, rituales guiados. Cosas que no vas a encontrar en otro lado.</p>
            </div>

            <div style="margin-bottom:18px;padding-bottom:18px;border-bottom:1px solid rgba(198,169,98,0.15);">
                <p style="color:#C6A962;font-size:14px;margin:0 0 4px 0;">🍀 Tus Tréboles</p>
                <p style="color:rgba(255,255,255,0.75);font-size:13px;margin:0;">Ya ganaste tréboles con tu compra. Canjealos por descuentos, experiencias y beneficios exclusivos.</p>
            </div>

            <div>
                <p style="color:#C6A962;font-size:14px;margin:0 0 4px 0;">🌿 15 días de El Círculo</p>
                <p style="color:rgba(255,255,255,0.75);font-size:13px;margin:0;">Acceso gratis a nuestra comunidad secreta de Elegidos. Contenido que no publicamos en ningún otro lado.</p>
            </div>
        </div>

        <p style="text-align:center;margin:25px 0;">
            <a href="https://mi-magia.duendesdeluruguay.com" style="display:inline-block;padding:16px 32px;background:linear-gradient(135deg,#C6A962,#a88a42);color:#000;text-decoration:none;border-radius:25px;font-weight:600;font-size:16px;">Entrar a Mi Magia</a>
        </p>

        <p style="color:rgba(255,255,255,0.6);font-size:14px;margin:20px 0;text-align:center;font-style:italic;">
            Entrá todos los días para mantener tu racha activa.<br>
            Los regalos del día 7 son especiales.
        </p>

        <p style="color:rgba(255,255,255,0.5);font-size:13px;margin-top:30px;text-align:center;">
            — Thibisay & Gabriel
        </p>
    ';

    $enviado = duendes_enviar_email($email, 'Desbloqueaste Mi Magia', $contenido, 'Mi Magia', 'Tu portal secreto está activo');

    if ($enviado) {
        $order->update_meta_data('_email_portal_sent', true);
        $order->save();
    }

    // Programar email de señales (6 días después)
    wp_schedule_single_event(time() + (6 * DAY_IN_SECONDS), 'duendes_email_senales_v3', [$order_id]);
});

// ═══════════════════════════════════════════════════════════════════════════
// EMAIL 5: SEÑALES Y REVIEW
// ═══════════════════════════════════════════════════════════════════════════

add_action('duendes_email_senales_v3', function($order_id) {
    $order = wc_get_order($order_id);
    if (!$order || $order->get_meta('_email_senales_sent')) return;

    $email = $order->get_billing_email();
    $nombre = $order->get_billing_first_name();

    $items = $order->get_items();
    $primer_item = reset($items);
    $nombre_guardian = $primer_item ? $primer_item->get_name() : 'tu guardiana';
    $product_id = $primer_item ? $primer_item->get_product_id() : 0;
    $product_url = $product_id ? get_permalink($product_id) : home_url('/shop');

    // Obtener género y pronombres
    $genero = duendes_get_genero_guardian($product_id, $nombre_guardian);
    $p = duendes_pronombres($genero);

    $crosssell = duendes_crosssell_espiritual($product_id, $nombre_guardian);

    $contenido = '
        <p style="font-size:22px;color:#C6A962;margin-bottom:20px;">' . esc_html($nombre) . ', ¿qué notaste?</p>

        <p style="color:rgba(255,255,255,0.85);line-height:1.7;">
            Ya pasó una semana desde que <strong style="color:#C6A962;">' . esc_html($nombre_guardian) . '</strong> llegó a tu vida.
            Quisiéramos saber cómo están conectando.
        </p>

        <div style="background:rgba(198,169,98,0.08);padding:20px;border-radius:12px;margin:25px 0;">
            <p style="color:#C6A962;margin:0 0 12px 0;font-size:15px;">Algunas preguntas:</p>
            <p style="color:rgba(255,255,255,0.8);margin:0;line-height:1.9;">
                • ¿Soñaste algo diferente?<br>
                • ¿Notaste alguna coincidencia rara?<br>
                • ¿Cómo te sentís cuando la mirás?<br>
                • ¿Cambió algo, aunque sea sutil?
            </p>
        </div>

        <p style="color:rgba(255,255,255,0.85);line-height:1.7;">
            Si notaste algo, anotalo en tu <strong style="color:#C6A962;">Grimorio</strong>.
            Esas "casualidades" son mensajes. El Grimorio te ayuda a verlos con perspectiva.
        </p>

        <p style="text-align:center;margin:25px 0;">
            <a href="https://mi-magia.duendesdeluruguay.com" style="display:inline-block;padding:12px 24px;background:rgba(198,169,98,0.15);color:#C6A962;text-decoration:none;border-radius:25px;border:1px solid rgba(198,169,98,0.3);">Abrir mi Grimorio</a>
        </p>

        <div style="background:rgba(198,169,98,0.05);padding:20px;border-radius:12px;margin:25px 0;text-align:center;">
            <p style="color:rgba(255,255,255,0.8);font-size:15px;margin:0 0 10px 0;">
                Tu experiencia puede ayudar a otras personas que están buscando su guardiana.
            </p>
            <p style="margin:15px 0 0 0;">
                <a href="' . esc_url($product_url) . '#reviews" style="display:inline-block;padding:12px 24px;background:linear-gradient(135deg,#C6A962,#a88a42);color:#000;text-decoration:none;border-radius:25px;font-weight:600;">Compartir mi experiencia</a>
            </p>
            <p style="color:rgba(255,255,255,0.5);font-size:13px;margin:12px 0 0 0;">
                Solo toma un minuto
            </p>
        </div>

        ' . $crosssell . '

        <p style="color:rgba(255,255,255,0.5);font-size:13px;margin-top:30px;text-align:center;">
            — Thibisay & Gabriel
        </p>
    ';

    $enviado = duendes_enviar_email($email, '¿Qué señales notaste con ' . $nombre_guardian . '?', $contenido, 'Una semana después', '¿Cómo va la conexión?');

    if ($enviado) {
        $order->update_meta_data('_email_senales_sent', true);
        $order->save();
    }
});

// ═══════════════════════════════════════════════════════════════════════════
// ADMIN METABOX
// ═══════════════════════════════════════════════════════════════════════════

add_action('add_meta_boxes', function() {
    add_meta_box('duendes_post_compra_v3', 'Post-Compra Duendes', 'duendes_metabox_v3', 'shop_order', 'side', 'default');
});

function duendes_metabox_v3($post) {
    $order = wc_get_order($post->ID);
    if (!$order) return;

    $estados = [
        '_email_encamino_sent' => 'En Camino',
        '_ritual_v3_sent' => 'Ritual',
        '_email_portal_sent' => 'Mi Magia',
        '_email_senales_sent' => 'Señales'
    ];

    echo '<div style="padding:8px 0;">';
    echo '<p><strong>Emails enviados:</strong></p>';
    echo '<ul style="margin:8px 0;padding-left:18px;">';
    foreach ($estados as $meta => $label) {
        $sent = $order->get_meta($meta) ? '✅' : '⏳';
        echo "<li>{$sent} {$label}</li>";
    }
    echo '</ul>';
    echo '<p style="margin-top:12px;"><a href="' . home_url('/certificado/' . $post->ID) . '" target="_blank" class="button">Ver Certificado</a></p>';
    echo '<p style="margin-top:8px;"><button type="button" class="button" onclick="if(confirm(\'Enviar ritual ahora?\')){jQuery.post(ajaxurl,{action:\'duendes_ritual_manual_v3\',order_id:' . $post->ID . ',nonce:\'' . wp_create_nonce('duendes_admin') . '\'},function(r){alert(r.success?\'Enviado!\':\'Error\');location.reload();})}">Enviar Ritual Manual</button></p>';
    echo '</div>';
}

add_action('wp_ajax_duendes_ritual_manual_v3', function() {
    check_ajax_referer('duendes_admin', 'nonce');
    do_action('duendes_enviar_ritual_v3', intval($_POST['order_id']));
    wp_send_json_success();
});

// ═══════════════════════════════════════════════════════════════════════════
// FUNCIÓN DE ENVÍO DE EMAILS
// ═══════════════════════════════════════════════════════════════════════════

// Solo declarar si no existe (puede estar en mu-plugins/duendes-emails-magicos.php)
if (!function_exists('duendes_enviar_email')) {
function duendes_enviar_email($to, $subject, $contenido, $titulo_header = '', $subtitulo_header = '') {
    // URL del logo verificada
    $logo_url = 'https://duendesdeluruguay.com/wp-content/uploads/2024/01/logo-duendes-email.png';

    $html = '<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:#0a0a0f;font-family:Georgia,serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0a0a0f;padding:20px 0;">
        <tr>
            <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:linear-gradient(180deg,#1a1a28 0%,#0f0f18 100%);border:1px solid rgba(198,169,98,0.25);border-radius:16px;overflow:hidden;">
                    <tr><td style="height:5px;background:linear-gradient(90deg,transparent,#C6A962,#8B7355,#C6A962,transparent);"></td></tr>
                    <tr>
                        <td style="padding:25px 35px 15px 35px;text-align:center;">
                            <img src="' . esc_url($logo_url) . '" alt="Duendes del Uruguay" style="max-width:160px;height:auto;">
                        </td>
                    </tr>';

    if ($titulo_header) {
        $html .= '
                    <tr>
                        <td style="padding:0 35px 20px 35px;text-align:center;">
                            <h1 style="margin:0;font-size:22px;color:#C6A962;font-family:Georgia,serif;letter-spacing:1px;">' . esc_html($titulo_header) . '</h1>
                            ' . ($subtitulo_header ? '<p style="margin:6px 0 0 0;font-size:13px;color:rgba(255,255,255,0.45);font-style:italic;">' . esc_html($subtitulo_header) . '</p>' : '') . '
                        </td>
                    </tr>
                    <tr>
                        <td style="padding:0 35px;">
                            <div style="height:1px;background:linear-gradient(90deg,transparent,rgba(198,169,98,0.35),transparent);"></div>
                        </td>
                    </tr>';
    }

    $html .= '
                    <tr>
                        <td style="padding:25px 35px;color:rgba(255,255,255,0.85);font-size:15px;line-height:1.65;">
                            ' . $contenido . '
                        </td>
                    </tr>
                    <tr>
                        <td style="padding:25px 35px;border-top:1px solid rgba(198,169,98,0.15);text-align:center;">
                            <p style="margin:0 0 8px 0;color:#C6A962;font-size:13px;">Con amor desde el bosque</p>
                            <p style="margin:0;color:rgba(255,255,255,0.4);font-size:12px;">Duendes del Uruguay</p>
                        </td>
                    </tr>
                    <tr><td style="height:3px;background:linear-gradient(90deg,transparent,#C6A962,#8B7355,#C6A962,transparent);"></td></tr>
                </table>
                <table width="600" style="max-width:600px;width:100%;">
                    <tr>
                        <td style="padding:15px 35px;text-align:center;">
                            <p style="margin:0;font-size:11px;color:rgba(255,255,255,0.25);">
                                Este email fue enviado porque realizaste una compra en Duendes del Uruguay
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>';

    $headers = [
        'Content-Type: text/html; charset=UTF-8',
        'From: Duendes del Uruguay <hola@duendesdeluruguay.com>'
    ];

    return wp_mail($to, $subject, $html, $headers);
}
} // end if function_exists
