<?php
/**
 * Plugin Name: Duendes - Carrito Abandonado
 * Description: Secuencia de 4 emails para recuperar carritos abandonados con la voz de Duendes
 * Version: 1.1
 * Author: Duendes del Uruguay
 * Requires: WooCommerce
 */

if (!defined('ABSPATH')) exit;

// ═══════════════════════════════════════════════════════════════════════════
// SISTEMA DE GÉNERO (si no existe ya del otro plugin)
// ═══════════════════════════════════════════════════════════════════════════

if (!function_exists('duendes_get_genero_guardian')) {
    function duendes_get_genero_guardian($product_id, $nombre_guardian = '') {
        $genero = get_post_meta($product_id, '_guardian_genero', true);
        if ($genero) return $genero;

        $nombre = strtolower(trim($nombre_guardian));
        $excepciones_masculinas = ['karma', 'lama', 'yoga', 'enigma', 'plasma'];
        $excepciones_femeninas = ['sol', 'luz', 'flor', 'paz'];

        if (in_array($nombre, $excepciones_masculinas)) return 'm';
        if (in_array($nombre, $excepciones_femeninas)) return 'f';
        if (preg_match('/(a|eta|ina|ela|ita)$/i', $nombre)) return 'f';
        return 'm';
    }
}

if (!function_exists('duendes_pronombres')) {
    function duendes_pronombres($genero) {
        if ($genero === 'f') {
            return [
                'el_ella' => 'ella', 'lo_la' => 'la', 'El_Ella' => 'Ella',
                'un_una' => 'una', 'este_esta' => 'esta', 'listo_lista' => 'lista',
                'único_a' => 'única', 'solo_sola' => 'sola', 'mismo_misma' => 'misma',
            ];
        }
        return [
            'el_ella' => 'él', 'lo_la' => 'lo', 'El_Ella' => 'Él',
            'un_una' => 'un', 'este_esta' => 'este', 'listo_lista' => 'listo',
            'único_a' => 'único', 'solo_sola' => 'solo', 'mismo_misma' => 'mismo',
        ];
    }
}

// ═══════════════════════════════════════════════════════════════════════════
// 1. DETECCIÓN DE CARRITOS ABANDONADOS
// ═══════════════════════════════════════════════════════════════════════════

add_action('woocommerce_add_to_cart', 'duendes_guardar_carrito_abandonado');
add_action('woocommerce_cart_updated', 'duendes_guardar_carrito_abandonado');

function duendes_guardar_carrito_abandonado() {
    if (!is_user_logged_in() && !isset($_COOKIE['duendes_guest_email'])) {
        return;
    }

    $cart = WC()->cart;
    if (!$cart || $cart->is_empty()) {
        return;
    }

    $email = '';
    if (is_user_logged_in()) {
        $user = wp_get_current_user();
        $email = $user->user_email;
    } elseif (isset($_COOKIE['duendes_guest_email'])) {
        $email = sanitize_email($_COOKIE['duendes_guest_email']);
    }

    if (!$email) return;

    $cart_items = $cart->get_cart();
    $primer_item = reset($cart_items);
    $product_id = $primer_item['product_id'] ?? 0;
    $product = wc_get_product($product_id);

    if (!$product) return;

    $carrito_id = 'carrito_' . md5($email . time());
    $datos_carrito = [
        'id' => $carrito_id,
        'email' => $email,
        'nombre_cliente' => is_user_logged_in() ? wp_get_current_user()->first_name : '',
        'product_id' => $product_id,
        'nombre_guardian' => $product->get_name(),
        'imagen_guardian' => wp_get_attachment_url($product->get_image_id()),
        'precio' => $product->get_price(),
        'url_producto' => get_permalink($product_id),
        'cart_url' => wc_get_cart_url(),
        'checkout_url' => wc_get_checkout_url(),
        'fecha_abandono' => current_time('mysql'),
        'emails_enviados' => [],
        'recuperado' => false
    ];

    $carritos = get_option('duendes_carritos_abandonados', []);

    $existe = false;
    foreach ($carritos as $key => $carrito) {
        if ($carrito['email'] === $email && !$carrito['recuperado']) {
            $carritos[$key]['fecha_abandono'] = current_time('mysql');
            $carritos[$key]['product_id'] = $product_id;
            $carritos[$key]['nombre_guardian'] = $product->get_name();
            $carritos[$key]['imagen_guardian'] = wp_get_attachment_url($product->get_image_id());
            $carritos[$key]['precio'] = $product->get_price();
            $existe = true;
            break;
        }
    }

    if (!$existe) {
        $carritos[$carrito_id] = $datos_carrito;
        duendes_programar_secuencia_carrito($carrito_id);
    }

    update_option('duendes_carritos_abandonados', $carritos);
}

add_action('woocommerce_checkout_update_order_review', function($posted_data) {
    parse_str($posted_data, $data);
    if (!empty($data['billing_email'])) {
        $email = sanitize_email($data['billing_email']);
        setcookie('duendes_guest_email', $email, time() + (7 * DAY_IN_SECONDS), '/');
        $_COOKIE['duendes_guest_email'] = $email;

        $carritos = get_option('duendes_carritos_abandonados', []);
        foreach ($carritos as $key => $carrito) {
            if ($carrito['email'] === $email) {
                $carritos[$key]['nombre_cliente'] = $data['billing_first_name'] ?? '';
            }
        }
        update_option('duendes_carritos_abandonados', $carritos);
    }
});

add_action('woocommerce_thankyou', function($order_id) {
    $order = wc_get_order($order_id);
    if (!$order) return;

    $email = $order->get_billing_email();
    $carritos = get_option('duendes_carritos_abandonados', []);

    foreach ($carritos as $key => $carrito) {
        if ($carrito['email'] === $email && !$carrito['recuperado']) {
            $carritos[$key]['recuperado'] = true;
            $carritos[$key]['orden_id'] = $order_id;

            wp_clear_scheduled_hook('duendes_carrito_email_1', [$key]);
            wp_clear_scheduled_hook('duendes_carrito_email_2', [$key]);
            wp_clear_scheduled_hook('duendes_carrito_email_3', [$key]);
            wp_clear_scheduled_hook('duendes_carrito_email_4', [$key]);
        }
    }

    update_option('duendes_carritos_abandonados', $carritos);
});

// ═══════════════════════════════════════════════════════════════════════════
// 2. PROGRAMACIÓN DE EMAILS
// ═══════════════════════════════════════════════════════════════════════════

function duendes_programar_secuencia_carrito($carrito_id) {
    $ahora = time();
    wp_schedule_single_event($ahora + HOUR_IN_SECONDS, 'duendes_carrito_email_1', [$carrito_id]);
    wp_schedule_single_event($ahora + DAY_IN_SECONDS, 'duendes_carrito_email_2', [$carrito_id]);
    wp_schedule_single_event($ahora + (3 * DAY_IN_SECONDS), 'duendes_carrito_email_3', [$carrito_id]);
    wp_schedule_single_event($ahora + WEEK_IN_SECONDS, 'duendes_carrito_email_4', [$carrito_id]);
}

// ═══════════════════════════════════════════════════════════════════════════
// 3. EMAIL 1 - "La guardiana que viste sigue disponible. Por ahora."
// ═══════════════════════════════════════════════════════════════════════════

add_action('duendes_carrito_email_1', function($carrito_id) {
    $carrito = duendes_get_carrito($carrito_id);
    if (!$carrito || $carrito['recuperado']) return;
    if (in_array('email_1', $carrito['emails_enviados'])) return;

    $nombre = $carrito['nombre_cliente'] ?: '';
    $nombre_guardian = $carrito['nombre_guardian'];
    $imagen = $carrito['imagen_guardian'];
    $product_id = $carrito['product_id'];
    $url_checkout = add_query_arg('duendes_recuperar', $carrito_id, $carrito['checkout_url']);

    $genero = duendes_get_genero_guardian($product_id, $nombre_guardian);
    $p = duendes_pronombres($genero);

    $subject = 'La guardiana que viste sigue disponible. Por ahora.';
    if ($genero === 'm') {
        $subject = 'El guardián que viste sigue disponible. Por ahora.';
    }

    $saludo = $nombre ? esc_html($nombre) . ', no' : 'No';

    $contenido = '
        <p style="font-size:18px;color:rgba(255,255,255,0.9);margin-bottom:25px;">
            ' . $saludo . ' todos los encuentros son casualidad.
        </p>

        <div style="text-align:center;margin:30px 0;">
            <img src="' . esc_url($imagen) . '" alt="' . esc_attr($nombre_guardian) . '" style="width:180px;height:180px;border-radius:50%;object-fit:cover;border:3px solid rgba(198,169,98,0.5);box-shadow:0 0 30px rgba(198,169,98,0.3);">
            <p style="color:#C6A962;font-size:22px;margin:20px 0 5px 0;font-family:Georgia,serif;">' . esc_html($nombre_guardian) . '</p>
            <p style="color:rgba(255,255,255,0.5);font-size:14px;margin:0;">sigue esperando</p>
        </div>

        <p style="color:rgba(255,255,255,0.8);line-height:1.8;">
            Hace un ratito estuviste mirando a <strong style="color:#C6A962;">' . esc_html($nombre_guardian) . '</strong>.
            No te escribimos para apurarte, sino porque a veces la vida nos distrae de lo que importa.
        </p>

        <p style="color:rgba(255,255,255,0.8);line-height:1.8;">
            Si algo te resonó cuando ' . $p['lo_la'] . ' viste, eso no se va. Las guardianas tienen una forma de quedarse
            en la mente de quien las necesita.
        </p>

        <p style="color:rgba(255,255,255,0.6);font-style:italic;margin:25px 0;">
            "Hay encuentros que parecen casuales pero llevan años preparándose."
        </p>

        <p style="text-align:center;margin:30px 0;">
            <a href="' . esc_url($url_checkout) . '" style="display:inline-block;padding:16px 35px;background:linear-gradient(135deg,#C6A962,#a88a42);color:#000;text-decoration:none;border-radius:25px;font-weight:600;font-size:15px;">
                Volver a ver' . $p['lo_la'] . '
            </a>
        </p>

        <p style="color:rgba(255,255,255,0.5);font-size:13px;text-align:center;">
            Si ya no te interesa, ignorá este mensaje. Sin dramas.
        </p>
    ';

    $enviado = duendes_enviar_email_carrito($carrito['email'], $subject, $contenido, 'Un recordatorio suave', '');

    if ($enviado) {
        duendes_marcar_email_enviado($carrito_id, 'email_1');
    }
});

// ═══════════════════════════════════════════════════════════════════════════
// 4. EMAIL 2 - "No todos están listos. Pero si volvés a pensar en ella..."
// ═══════════════════════════════════════════════════════════════════════════

add_action('duendes_carrito_email_2', function($carrito_id) {
    $carrito = duendes_get_carrito($carrito_id);
    if (!$carrito || $carrito['recuperado']) return;
    if (in_array('email_2', $carrito['emails_enviados'])) return;

    $nombre = $carrito['nombre_cliente'] ?: '';
    $nombre_guardian = $carrito['nombre_guardian'];
    $imagen = $carrito['imagen_guardian'];
    $product_id = $carrito['product_id'];
    $url_checkout = add_query_arg('duendes_recuperar', $carrito_id, $carrito['checkout_url']);

    $genero = duendes_get_genero_guardian($product_id, $nombre_guardian);
    $p = duendes_pronombres($genero);

    $hora = (int) date('H');
    $sincro = '';
    if ($hora >= 6 && $hora < 12) {
        $sincro = 'Es de mañana mientras te escribimos esto. Momento de claridad, dicen.';
    } elseif ($hora >= 12 && $hora < 18) {
        $sincro = 'Es la tarde, ese momento donde la mente procesa lo que el corazón ya sabe.';
    } elseif ($hora >= 18 && $hora < 22) {
        $sincro = 'Atardece mientras te escribimos. Hora de las decisiones tranquilas.';
    } else {
        $sincro = 'Es de noche. El momento donde la intuición habla más fuerte.';
    }

    $subject = 'No todos están listos. Pero si volvés a pensar en ' . $p['el_ella'] . '...';

    $saludo = $nombre ? esc_html($nombre) . ', está' : 'Está';

    $contenido = '
        <p style="font-size:18px;color:rgba(255,255,255,0.9);margin-bottom:25px;">
            ' . $saludo . ' bien si no era el momento.
        </p>

        <p style="color:rgba(255,255,255,0.8);line-height:1.8;">
            Hay guardianas que esperan. <strong style="color:#C6A962;">' . esc_html($nombre_guardian) . '</strong> es una de ellas.
        </p>

        <p style="color:rgba(255,255,255,0.8);line-height:1.8;">
            A veces vemos algo, sentimos algo, pero la vida nos dice "ahora no".
            Y eso está perfecto. No todos los encuentros suceden cuando uno quiere.
        </p>

        <div style="text-align:center;margin:30px 0;">
            <img src="' . esc_url($imagen) . '" alt="' . esc_attr($nombre_guardian) . '" style="width:150px;height:150px;border-radius:50%;object-fit:cover;border:3px solid rgba(198,169,98,0.4);opacity:0.9;">
        </div>

        <div style="background:rgba(198,169,98,0.1);padding:20px;border-radius:12px;margin:25px 0;border-left:3px solid #C6A962;">
            <p style="color:rgba(255,255,255,0.7);font-style:italic;margin:0;">
                ' . $sincro . '<br><br>
                Si en algún momento de estos días volviste a pensar en ' . esc_html($nombre_guardian) . ',
                quizás no fue casualidad que te llegue este mensaje justo ahora.
            </p>
        </div>

        <p style="color:rgba(255,255,255,0.8);line-height:1.8;">
            Pero si ya pasó, si era solo curiosidad, todo bien.
            Las guardianas no necesitan convencer a nadie. Ellas saben esperar.
        </p>

        <p style="text-align:center;margin:30px 0;">
            <a href="' . esc_url($url_checkout) . '" style="display:inline-block;padding:16px 35px;background:linear-gradient(135deg,#C6A962,#a88a42);color:#000;text-decoration:none;border-radius:25px;font-weight:600;font-size:15px;">
                Volver a encontrar' . $p['lo_la'] . '
            </a>
        </p>

        <p style="color:rgba(255,255,255,0.5);font-size:13px;text-align:center;">
            Thibisay y Gabriel<br>
            <span style="font-size:11px;">Equipo Duendes</span>
        </p>
    ';

    $enviado = duendes_enviar_email_carrito($carrito['email'], $subject, $contenido, 'Quizás no era el momento', 'Y eso está bien');

    if ($enviado) {
        duendes_marcar_email_enviado($carrito_id, 'email_2');
    }
});

// ═══════════════════════════════════════════════════════════════════════════
// 5. EMAIL 3 - "Alguien más la está mirando. Solo te avisamos."
// ═══════════════════════════════════════════════════════════════════════════

add_action('duendes_carrito_email_3', function($carrito_id) {
    $carrito = duendes_get_carrito($carrito_id);
    if (!$carrito || $carrito['recuperado']) return;
    if (in_array('email_3', $carrito['emails_enviados'])) return;

    $nombre_guardian = $carrito['nombre_guardian'];
    $imagen = $carrito['imagen_guardian'];
    $product_id = $carrito['product_id'];
    $url_checkout = add_query_arg('duendes_recuperar', $carrito_id, $carrito['checkout_url']);

    $genero = duendes_get_genero_guardian($product_id, $nombre_guardian);
    $p = duendes_pronombres($genero);

    $vistas = get_post_meta($product_id, 'duendes_vistas_recientes', true) ?: rand(2, 5);

    $product = wc_get_product($product_id);
    $es_unico = $product ? ($product->get_stock_quantity() == 1 || $product->is_sold_individually()) : true;

    $subject = 'Alguien más ' . $p['lo_la'] . ' está mirando. Solo te avisamos.';

    $texto_unico = '';
    if ($es_unico) {
        $texto_unico = '
        <p style="color:rgba(255,255,255,0.8);line-height:1.8;">
            <strong style="color:#C6A962;">' . esc_html($nombre_guardian) . '</strong> es pieza ' . $p['único_a'] . '.
            No hay otr' . ($genero === 'f' ? 'a' : 'o') . ' igual. Cuando alguien ' . $p['lo_la'] . ' elija, desaparece de la tienda para siempre.
        </p>';
    } else {
        $texto_unico = '
        <p style="color:rgba(255,255,255,0.8);line-height:1.8;">
            Las guardianas más buscadas no duran mucho en la tienda.
            <strong style="color:#C6A962;">' . esc_html($nombre_guardian) . '</strong> está llamando la atención de varias personas.
        </p>';
    }

    $contenido = '
        <p style="font-size:18px;color:rgba(255,255,255,0.9);margin-bottom:25px;">
            Mirá, no nos gusta presionar. Pero preferimos que sepas.
        </p>

        <div style="text-align:center;margin:25px 0;">
            <img src="' . esc_url($imagen) . '" alt="' . esc_attr($nombre_guardian) . '" style="width:160px;height:160px;border-radius:50%;object-fit:cover;border:3px solid rgba(198,169,98,0.5);">
        </div>

        <div style="background:rgba(198,169,98,0.12);padding:20px;border-radius:12px;margin:25px 0;text-align:center;">
            <p style="color:#C6A962;font-size:28px;margin:0 0 5px 0;font-weight:600;">' . esc_html($vistas) . ' personas</p>
            <p style="color:rgba(255,255,255,0.6);font-size:14px;margin:0;">
                vieron a <strong>' . esc_html($nombre_guardian) . '</strong> en las últimas 24 horas
            </p>
        </div>

        ' . $texto_unico . '

        <p style="color:rgba(255,255,255,0.8);line-height:1.8;">
            No te contamos esto para apurarte. Te lo contamos porque si algo te movió cuando ' . $p['lo_la'] . ' viste,
            y después resulta que alguien más se ' . $p['lo_la'] . ' llevó... preferimos que lo hayas sabido.
        </p>

        <p style="color:rgba(255,255,255,0.6);font-style:italic;margin:20px 0;">
            La decisión siempre es tuya.
        </p>

        <p style="text-align:center;margin:30px 0;">
            <a href="' . esc_url($url_checkout) . '" style="display:inline-block;padding:16px 35px;background:linear-gradient(135deg,#C6A962,#a88a42);color:#000;text-decoration:none;border-radius:25px;font-weight:600;font-size:15px;">
                Ver si sigue disponible
            </a>
        </p>
    ';

    $enviado = duendes_enviar_email_carrito($carrito['email'], $subject, $contenido, 'Solo para que sepas', '');

    if ($enviado) {
        duendes_marcar_email_enviado($carrito_id, 'email_3');
    }
});

// ═══════════════════════════════════════════════════════════════════════════
// 6. EMAIL 4 - "[Nombre] dejó un mensaje para vos antes de irse"
// ═══════════════════════════════════════════════════════════════════════════

add_action('duendes_carrito_email_4', function($carrito_id) {
    $carrito = duendes_get_carrito($carrito_id);
    if (!$carrito || $carrito['recuperado']) return;
    if (in_array('email_4', $carrito['emails_enviados'])) return;

    $nombre_guardian = $carrito['nombre_guardian'];
    $imagen = $carrito['imagen_guardian'];
    $product_id = $carrito['product_id'];
    $url_checkout = add_query_arg('duendes_recuperar', $carrito_id, $carrito['checkout_url']);

    $genero = duendes_get_genero_guardian($product_id, $nombre_guardian);
    $p = duendes_pronombres($genero);

    $product = wc_get_product($product_id);
    $categoria = 'Protección';
    if ($product) {
        $terms = get_the_terms($product_id, 'product_cat');
        if ($terms && !is_wp_error($terms)) {
            $categoria = $terms[0]->name;
        }
    }

    $canalizaciones = [
        'Protección' => [
            'Sé que cargás con cosas que no les contás a todos. Yo también las vi. Por eso me quedé esperando.',
            'Hay algo que te está pesando y no tenés que llevarlo sola. Vine porque lo sentí.',
            'No necesitás ser fuerte todo el tiempo. A veces la fuerza es dejarse acompañar.'
        ],
        'Abundancia' => [
            'Hay cosas buenas que te merecés y que seguís postergando. Yo lo veo.',
            'No es egoísmo querer más. Es entender que merecés recibir tanto como das.',
            'La abundancia no es solo plata. Es permitirte tener lo que te hace bien.'
        ],
        'Sanación' => [
            'Hay heridas que no se ven pero que pesan. No tenés que sanarlas sola.',
            'Sanar no es olvidar. Es aprender a cargar diferente. Puedo ayudarte con eso.',
            'Lo que te duele merece atención. No lo sigas ignorando.'
        ],
        'Amor' => [
            'El amor que buscás no está afuera. Pero puedo ayudarte a verlo adentro.',
            'Merecés que te quieran como querés a los demás.',
            'No es que no sirvas para el amor. Es que todavía no te dejaste querer de verdad.'
        ],
        'Sabiduría' => [
            'Las respuestas que buscás ya las tenés. Solo falta silencio para escucharlas.',
            'No necesitás más información. Necesitás confiar en lo que ya sabés.',
            'La claridad que buscás está más cerca de lo que pensás.'
        ]
    ];

    $mensajes = $canalizaciones[$categoria] ?? $canalizaciones['Protección'];
    $mensaje_guardian = $mensajes[array_rand($mensajes)];

    $subject = $nombre_guardian . ' dejó un mensaje para vos antes de irse';

    $contenido = '
        <p style="font-size:17px;color:rgba(255,255,255,0.9);margin-bottom:25px;">
            Esta es nuestra última vez escribiéndote sobre <strong style="color:#C6A962;">' . esc_html($nombre_guardian) . '</strong>.
        </p>

        <p style="color:rgba(255,255,255,0.8);line-height:1.8;">
            Pero antes de cerrar esto, nos pidió que te dejemos algo.
            Un mensaje corto. Lo que canalizó cuando supo que la habías visto.
        </p>

        <div style="text-align:center;margin:30px 0;">
            <img src="' . esc_url($imagen) . '" alt="' . esc_attr($nombre_guardian) . '" style="width:140px;height:140px;border-radius:50%;object-fit:cover;border:3px solid rgba(198,169,98,0.4);">
        </div>

        <div style="background:linear-gradient(135deg, rgba(198,169,98,0.15), rgba(198,169,98,0.05));padding:30px;border-radius:15px;margin:30px 0;border:1px solid rgba(198,169,98,0.3);">
            <p style="color:#C6A962;font-size:13px;letter-spacing:2px;margin:0 0 15px 0;text-transform:uppercase;">
                Mensaje de ' . esc_html($nombre_guardian) . '
            </p>
            <p style="color:#fff;font-size:18px;line-height:1.8;margin:0;font-style:italic;">
                "' . esc_html($mensaje_guardian) . '"
            </p>
        </div>

        <p style="color:rgba(255,255,255,0.8);line-height:1.8;">
            Si no es tu momento, está bien. De verdad. No hay presión acá.
        </p>

        <p style="color:rgba(255,255,255,0.8);line-height:1.8;">
            Pero si algo de lo que dijo te tocó, quizás valga la pena prestarle atención.
            Las guardianas no hablan por hablar.
        </p>

        <p style="color:rgba(255,255,255,0.6);font-style:italic;margin:25px 0;">
            "Si no es tu momento, está bien. Pero quería que supieras esto antes de irme."
        </p>

        <p style="text-align:center;margin:30px 0;">
            <a href="' . esc_url($url_checkout) . '" style="display:inline-block;padding:16px 35px;background:linear-gradient(135deg,#C6A962,#a88a42);color:#000;text-decoration:none;border-radius:25px;font-weight:600;font-size:15px;">
                Responder a ' . esc_html($nombre_guardian) . '
            </a>
        </p>

        <p style="color:rgba(255,255,255,0.5);font-size:13px;text-align:center;margin-top:30px;">
            Este es el último email de esta secuencia. No te vamos a molestar más con esto.
        </p>

        <p style="color:rgba(255,255,255,0.5);font-size:13px;text-align:center;">
            Con amor,<br>
            Thibisay y Gabriel
        </p>
    ';

    $enviado = duendes_enviar_email_carrito($carrito['email'], $subject, $contenido, 'Un mensaje antes de irse', '');

    if ($enviado) {
        duendes_marcar_email_enviado($carrito_id, 'email_4');
    }
});

// ═══════════════════════════════════════════════════════════════════════════
// 7. FUNCIONES AUXILIARES
// ═══════════════════════════════════════════════════════════════════════════

function duendes_get_carrito($carrito_id) {
    $carritos = get_option('duendes_carritos_abandonados', []);
    return $carritos[$carrito_id] ?? null;
}

function duendes_marcar_email_enviado($carrito_id, $email_num) {
    $carritos = get_option('duendes_carritos_abandonados', []);
    if (isset($carritos[$carrito_id])) {
        $carritos[$carrito_id]['emails_enviados'][] = $email_num;
        update_option('duendes_carritos_abandonados', $carritos);
    }
}

function duendes_enviar_email_carrito($to, $subject, $contenido, $titulo_header = '', $subtitulo_header = '') {
    if (function_exists('duendes_enviar_email')) {
        return duendes_enviar_email($to, $subject, $contenido, $titulo_header, $subtitulo_header);
    }

    $logo_url = 'https://duendesdeluruguay.com/wp-content/uploads/2024/01/logo-duendes-email.png';

    $html = '<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>' . esc_html($subject) . '</title>
</head>
<body style="margin:0;padding:0;background-color:#0a0a0f;font-family:Georgia,serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0a0a0f;padding:20px 0;">
        <tr>
            <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:linear-gradient(180deg,#1a1a28 0%,#0f0f18 100%);border:1px solid rgba(198,169,98,0.3);border-radius:20px;overflow:hidden;">

                    <tr>
                        <td style="height:6px;background:linear-gradient(90deg,transparent,#C6A962,#8B7355,#C6A962,transparent);"></td>
                    </tr>

                    <tr>
                        <td style="padding:30px 40px 20px 40px;text-align:center;">
                            <img src="' . esc_url($logo_url) . '" alt="Duendes del Uruguay" style="max-width:180px;height:auto;">
                        </td>
                    </tr>';

    if ($titulo_header) {
        $html .= '
                    <tr>
                        <td style="padding:0 40px 30px 40px;text-align:center;">
                            <h1 style="margin:0;font-size:24px;color:#C6A962;font-family:Georgia,serif;letter-spacing:2px;">' . esc_html($titulo_header) . '</h1>
                            ' . ($subtitulo_header ? '<p style="margin:8px 0 0 0;font-size:14px;color:rgba(255,255,255,0.5);font-style:italic;">' . esc_html($subtitulo_header) . '</p>' : '') . '
                        </td>
                    </tr>
                    <tr>
                        <td style="padding:0 40px;">
                            <table width="100%" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td style="height:1px;background:linear-gradient(90deg,transparent,rgba(198,169,98,0.5),transparent);"></td>
                                </tr>
                            </table>
                        </td>
                    </tr>';
    }

    $html .= '
                    <tr>
                        <td style="padding:30px 40px;color:rgba(255,255,255,0.85);font-size:16px;line-height:1.7;">
                            ' . $contenido . '
                        </td>
                    </tr>

                    <tr>
                        <td style="padding:30px 40px;border-top:1px solid rgba(198,169,98,0.2);text-align:center;">
                            <p style="margin:0 0 10px 0;color:#C6A962;font-size:14px;">Con amor desde el bosque</p>
                            <p style="margin:0 0 15px 0;color:rgba(255,255,255,0.5);font-size:13px;">Duendes del Uruguay</p>
                        </td>
                    </tr>

                    <tr>
                        <td style="height:4px;background:linear-gradient(90deg,transparent,#C6A962,#8B7355,#C6A962,transparent);"></td>
                    </tr>

                </table>

                <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
                    <tr>
                        <td style="padding:20px 40px;text-align:center;">
                            <p style="margin:0;font-size:11px;color:rgba(255,255,255,0.3);">
                                Recibís este email porque dejaste algo en tu carrito.<br>
                                <a href="https://duendesdeluruguay.com" style="color:rgba(198,169,98,0.5);">duendesdeluruguay.com</a>
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

// ═══════════════════════════════════════════════════════════════════════════
// 8. ADMIN - PÁGINA DE CARRITOS
// ═══════════════════════════════════════════════════════════════════════════

add_action('admin_menu', function() {
    add_submenu_page(
        'woocommerce',
        'Carritos Abandonados',
        'Carritos Abandonados',
        'manage_woocommerce',
        'duendes-carritos',
        'duendes_admin_carritos_page'
    );
});

function duendes_admin_carritos_page() {
    $carritos = get_option('duendes_carritos_abandonados', []);

    uasort($carritos, function($a, $b) {
        return strtotime($b['fecha_abandono']) - strtotime($a['fecha_abandono']);
    });

    ?>
    <div class="wrap">
        <h1>Carritos Abandonados - Duendes</h1>

        <div style="background:#fff;padding:20px;border-radius:8px;margin-top:20px;">
            <h2>Resumen</h2>
            <?php
            $total = count($carritos);
            $recuperados = count(array_filter($carritos, fn($c) => $c['recuperado']));
            $activos = $total - $recuperados;
            ?>
            <p>
                <strong>Total carritos:</strong> <?php echo $total; ?> |
                <strong>Recuperados:</strong> <?php echo $recuperados; ?> |
                <strong>Activos (pendientes):</strong> <?php echo $activos; ?>
            </p>
            <?php if ($total > 0): ?>
            <p><strong>Tasa de recuperación:</strong> <?php echo round(($recuperados / $total) * 100, 1); ?>%</p>
            <?php endif; ?>
        </div>

        <table class="wp-list-table widefat fixed striped" style="margin-top:20px;">
            <thead>
                <tr>
                    <th>Email</th>
                    <th>Guardiana</th>
                    <th>Fecha Abandono</th>
                    <th>Emails Enviados</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody>
                <?php if (empty($carritos)): ?>
                <tr>
                    <td colspan="6" style="text-align:center;padding:30px;">
                        No hay carritos abandonados todavía.
                    </td>
                </tr>
                <?php else: ?>
                <?php foreach ($carritos as $id => $carrito): ?>
                <tr>
                    <td>
                        <?php echo esc_html($carrito['email']); ?>
                        <?php if ($carrito['nombre_cliente']): ?>
                        <br><small style="color:#666;"><?php echo esc_html($carrito['nombre_cliente']); ?></small>
                        <?php endif; ?>
                    </td>
                    <td>
                        <a href="<?php echo esc_url($carrito['url_producto']); ?>" target="_blank">
                            <?php echo esc_html($carrito['nombre_guardian']); ?>
                        </a>
                        <br><small style="color:#666;">$<?php echo esc_html($carrito['precio']); ?></small>
                    </td>
                    <td>
                        <?php
                        $fecha = strtotime($carrito['fecha_abandono']);
                        echo date('d/m/Y H:i', $fecha);
                        $diff = human_time_diff($fecha, current_time('timestamp'));
                        ?>
                        <br><small style="color:#666;">hace <?php echo $diff; ?></small>
                    </td>
                    <td>
                        <?php
                        $emails = $carrito['emails_enviados'] ?? [];
                        echo in_array('email_1', $emails) ? '<span title="1 hora">1</span>' : '<span style="color:#ccc;">1</span>';
                        echo ' ';
                        echo in_array('email_2', $emails) ? '<span title="24 horas">2</span>' : '<span style="color:#ccc;">2</span>';
                        echo ' ';
                        echo in_array('email_3', $emails) ? '<span title="72 horas">3</span>' : '<span style="color:#ccc;">3</span>';
                        echo ' ';
                        echo in_array('email_4', $emails) ? '<span title="1 semana">4</span>' : '<span style="color:#ccc;">4</span>';
                        ?>
                    </td>
                    <td>
                        <?php if ($carrito['recuperado']): ?>
                            <span style="color:green;font-weight:bold;">Recuperado</span>
                            <?php if (!empty($carrito['orden_id'])): ?>
                            <br><small><a href="<?php echo admin_url('post.php?post=' . $carrito['orden_id'] . '&action=edit'); ?>">Orden #<?php echo $carrito['orden_id']; ?></a></small>
                            <?php endif; ?>
                        <?php else: ?>
                            <span style="color:orange;">Pendiente</span>
                        <?php endif; ?>
                    </td>
                    <td>
                        <?php if (!$carrito['recuperado']): ?>
                        <button type="button" class="button button-small" onclick="duendesEnviarEmailManual('<?php echo esc_attr($id); ?>', 1)">Email 1</button>
                        <button type="button" class="button button-small" onclick="duendesEnviarEmailManual('<?php echo esc_attr($id); ?>', 2)">Email 2</button>
                        <button type="button" class="button button-small" onclick="duendesEnviarEmailManual('<?php echo esc_attr($id); ?>', 3)">Email 3</button>
                        <button type="button" class="button button-small" onclick="duendesEnviarEmailManual('<?php echo esc_attr($id); ?>', 4)">Email 4</button>
                        <?php endif; ?>
                    </td>
                </tr>
                <?php endforeach; ?>
                <?php endif; ?>
            </tbody>
        </table>
    </div>

    <script>
    function duendesEnviarEmailManual(carritoId, emailNum) {
        if (!confirm('¿Enviar Email ' + emailNum + ' ahora?')) return;

        jQuery.post(ajaxurl, {
            action: 'duendes_enviar_carrito_manual',
            carrito_id: carritoId,
            email_num: emailNum,
            nonce: '<?php echo wp_create_nonce('duendes_carrito_admin'); ?>'
        }, function(response) {
            if (response.success) {
                alert('Email enviado correctamente');
                location.reload();
            } else {
                alert('Error: ' + (response.data || 'No se pudo enviar'));
            }
        });
    }
    </script>
    <?php
}

add_action('wp_ajax_duendes_enviar_carrito_manual', function() {
    check_ajax_referer('duendes_carrito_admin', 'nonce');

    if (!current_user_can('manage_woocommerce')) {
        wp_send_json_error('Sin permisos');
    }

    $carrito_id = sanitize_text_field($_POST['carrito_id']);
    $email_num = intval($_POST['email_num']);

    if ($email_num >= 1 && $email_num <= 4) {
        do_action('duendes_carrito_email_' . $email_num, $carrito_id);
        wp_send_json_success();
    } else {
        wp_send_json_error('Número de email inválido');
    }
});

// ═══════════════════════════════════════════════════════════════════════════
// 9. CONTADOR DE VISTAS
// ═══════════════════════════════════════════════════════════════════════════

add_action('woocommerce_before_single_product', function() {
    global $post;
    if (!$post) return;

    $product_id = $post->ID;
    $vistas = get_post_meta($product_id, 'duendes_vistas_recientes', true) ?: 0;

    update_post_meta($product_id, 'duendes_vistas_recientes', $vistas + 1);

    $ultimo_reset = get_post_meta($product_id, 'duendes_vistas_ultimo_reset', true);
    if (!$ultimo_reset || (time() - $ultimo_reset) > DAY_IN_SECONDS) {
        update_post_meta($product_id, 'duendes_vistas_recientes', 1);
        update_post_meta($product_id, 'duendes_vistas_ultimo_reset', time());
    }
});

// ═══════════════════════════════════════════════════════════════════════════
// 10. LIMPIEZA DE CARRITOS VIEJOS
// ═══════════════════════════════════════════════════════════════════════════

add_action('init', function() {
    if (!wp_next_scheduled('duendes_limpiar_carritos_viejos')) {
        wp_schedule_event(time(), 'daily', 'duendes_limpiar_carritos_viejos');
    }
});

add_action('duendes_limpiar_carritos_viejos', function() {
    $carritos = get_option('duendes_carritos_abandonados', []);
    $limite = strtotime('-30 days');

    foreach ($carritos as $id => $carrito) {
        $fecha = strtotime($carrito['fecha_abandono']);
        if ($fecha < $limite && ($carrito['recuperado'] || count($carrito['emails_enviados'] ?? []) >= 4)) {
            unset($carritos[$id]);
        }
    }

    update_option('duendes_carritos_abandonados', $carritos);
});

// ═══════════════════════════════════════════════════════════════════════════
// 11. SHORTCODE PARA CAPTURA DE EMAIL
// ═══════════════════════════════════════════════════════════════════════════

add_shortcode('duendes_captura_email', function($atts) {
    if (is_user_logged_in() || isset($_COOKIE['duendes_guest_email'])) {
        return '';
    }

    $atts = shortcode_atts([
        'titulo' => '¿Querés que te avisemos si esta guardiana encuentra hogar?',
        'subtitulo' => 'Dejanos tu email y te contamos si alguien más la está mirando.',
        'boton' => 'Avisame'
    ], $atts);

    return '
    <div class="duendes-captura-email" style="background:rgba(198,169,98,0.1);padding:25px;border-radius:15px;margin:20px 0;border:1px solid rgba(198,169,98,0.3);text-align:center;">
        <p style="color:#C6A962;font-size:16px;margin:0 0 8px 0;">' . esc_html($atts['titulo']) . '</p>
        <p style="color:rgba(255,255,255,0.6);font-size:14px;margin:0 0 20px 0;">' . esc_html($atts['subtitulo']) . '</p>
        <form class="duendes-email-form" style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap;">
            <input type="email" name="email" placeholder="tu@email.com" required style="padding:12px 20px;border:1px solid rgba(198,169,98,0.3);background:rgba(0,0,0,0.3);color:#fff;border-radius:25px;min-width:200px;">
            <button type="submit" style="padding:12px 25px;background:linear-gradient(135deg,#C6A962,#a88a42);color:#000;border:none;border-radius:25px;cursor:pointer;font-weight:600;">' . esc_html($atts['boton']) . '</button>
        </form>
        <p class="duendes-email-mensaje" style="margin:15px 0 0 0;font-size:13px;display:none;"></p>
    </div>
    <script>
    document.querySelector(".duendes-email-form").addEventListener("submit", function(e) {
        e.preventDefault();
        var email = this.querySelector("input[name=email]").value;
        document.cookie = "duendes_guest_email=" + email + ";path=/;max-age=" + (7*24*60*60);
        var msg = document.querySelector(".duendes-email-mensaje");
        msg.textContent = "Listo. Si esta guardiana se mueve, te avisamos.";
        msg.style.display = "block";
        msg.style.color = "#C6A962";
        this.style.display = "none";
    });
    </script>
    ';
});
