<?php
/**
 * Plugin Name: Duendes - Emails Extras
 * Description: Emails automáticos para Mi Magia, El Círculo, estudios/lecturas y membresías
 * Version: 1.0
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
                'preparado_a' => 'preparada', 'esperando' => 'esperando',
            ];
        }
        return [
            'el_ella' => 'él', 'lo_la' => 'lo', 'El_Ella' => 'Él',
            'un_una' => 'un', 'este_esta' => 'este', 'listo_lista' => 'listo',
            'único_a' => 'único', 'solo_sola' => 'solo', 'mismo_misma' => 'mismo',
            'preparado_a' => 'preparado', 'esperando' => 'esperando',
        ];
    }
}

// ═══════════════════════════════════════════════════════════════════════════
// FUNCIÓN DE ENVÍO DE EMAILS (si no existe)
// ═══════════════════════════════════════════════════════════════════════════

if (!function_exists('duendes_enviar_email')) {
    function duendes_enviar_email($to, $subject, $contenido, $titulo_header = '', $subtitulo_header = '') {
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
}

// ═══════════════════════════════════════════════════════════════════════════
// 1. EMAIL: CONFIRMACIÓN DE ACCESO A MI MAGIA
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Se dispara cuando el cliente obtiene acceso a Mi Magia (después de primera compra)
 * Hook: duendes_acceso_mi_magia_activado
 * Uso: do_action('duendes_acceso_mi_magia_activado', $user_id, $order_id);
 */
add_action('duendes_acceso_mi_magia_activado', function($user_id, $order_id = null) {
    $user = get_user_by('ID', $user_id);
    if (!$user) return;

    $email = $user->user_email;
    $nombre = $user->first_name ?: 'Alma Mágica';

    // Obtener guardián de la orden si existe
    $nombre_guardian = '';
    if ($order_id) {
        $order = wc_get_order($order_id);
        if ($order) {
            $items = $order->get_items();
            $primer_item = reset($items);
            if ($primer_item) {
                $nombre_guardian = $primer_item->get_name();
            }
        }
    }

    $contenido = '
        <p style="font-size:22px;color:#C6A962;margin-bottom:20px;">' . esc_html($nombre) . ', se abrió algo para vos.</p>

        <p style="color:rgba(255,255,255,0.85);line-height:1.8;">
            A partir de ahora tenés acceso a <strong style="color:#C6A962;">Mi Magia</strong>,
            tu portal personal donde todo lo que pasa entre vos y tus guardianes queda registrado.
        </p>

        <p style="color:rgba(255,255,255,0.85);line-height:1.8;margin-top:15px;">
            No es una página más. Es tu espacio privado, donde la magia se vuelve tangible.
        </p>

        <div style="background:rgba(198,169,98,0.08);padding:25px;border-radius:15px;margin:30px 0;border:1px solid rgba(198,169,98,0.15);">
            <p style="color:#C6A962;font-size:17px;margin:0 0 20px 0;text-align:center;">Lo que vas a encontrar adentro:</p>

            <div style="margin-bottom:20px;padding-bottom:18px;border-bottom:1px solid rgba(198,169,98,0.15);">
                <p style="color:#C6A962;font-size:15px;margin:0 0 6px 0;">Tu Grimorio Personal</p>
                <p style="color:rgba(255,255,255,0.75);font-size:14px;margin:0;line-height:1.6;">
                    El historial completo de tus guardianes. Cada canalización, cada mensaje,
                    cada conexión que estableciste. Todo en un solo lugar, ordenado y accesible.
                </p>
            </div>

            <div style="margin-bottom:20px;padding-bottom:18px;border-bottom:1px solid rgba(198,169,98,0.15);">
                <p style="color:#C6A962;font-size:15px;margin:0 0 6px 0;">Cofre Diario</p>
                <p style="color:rgba(255,255,255,0.75);font-size:14px;margin:0;line-height:1.6;">
                    Cada día que entrás, un regalo te espera. Mensajes de tus guardianes,
                    runas, sorpresas. Mantené tu racha y los regalos se vuelven más especiales.
                </p>
            </div>

            <div style="margin-bottom:20px;padding-bottom:18px;border-bottom:1px solid rgba(198,169,98,0.15);">
                <p style="color:#C6A962;font-size:15px;margin:0 0 6px 0;">Experiencias Mágicas</p>
                <p style="color:rgba(255,255,255,0.75);font-size:14px;margin:0;line-height:1.6;">
                    Estudios energéticos, lecturas de runas, canalizaciones especiales.
                    Todo lo que pediste o que tus guardianes prepararon para vos, aparece acá.
                </p>
            </div>

            <div>
                <p style="color:#C6A962;font-size:15px;margin:0 0 6px 0;">Sistema de Tréboles</p>
                <p style="color:rgba(255,255,255,0.75);font-size:14px;margin:0;line-height:1.6;">
                    Cada compra, cada visita, cada interacción te da tréboles.
                    Canjealos por descuentos, experiencias exclusivas o beneficios especiales.
                </p>
            </div>
        </div>

        <div style="background:rgba(100,180,100,0.08);padding:20px;border-radius:12px;margin:25px 0;border:1px solid rgba(100,180,100,0.15);">
            <p style="color:#8fbc8f;font-size:15px;margin:0 0 10px 0;">Un consejo</p>
            <p style="color:rgba(255,255,255,0.75);font-size:14px;margin:0;line-height:1.7;">
                Entrá todos los días, aunque sea un minuto. Las rachas importan.
                En el día 7 pasan cosas especiales. Y en el día 30... bueno, mejor que lo descubras vos.
            </p>
        </div>

        <p style="text-align:center;margin:30px 0;">
            <a href="https://mi-magia.duendesdeluruguay.com" style="display:inline-block;padding:16px 35px;background:linear-gradient(135deg,#C6A962,#a88a42);color:#000;text-decoration:none;border-radius:25px;font-weight:600;font-size:16px;">
                Entrar a Mi Magia
            </a>
        </p>

        <p style="color:rgba(255,255,255,0.6);font-size:14px;text-align:center;font-style:italic;">
            Usá el mismo email con el que compraste para acceder.
        </p>

        <p style="color:rgba(255,255,255,0.5);font-size:13px;margin-top:35px;text-align:center;">
            Con amor,<br>
            Thibisay & Gabriel
        </p>
    ';

    duendes_enviar_email($email, 'Se abrió Mi Magia para vos', $contenido, 'Bienvenida a Mi Magia', 'Tu portal personal está activo');
}, 10, 2);

// También disparar cuando se completa primera compra
add_action('woocommerce_order_status_completed', function($order_id) {
    $order = wc_get_order($order_id);
    if (!$order) return;

    $user_id = $order->get_user_id();
    if (!$user_id) return;

    // Verificar si es primera compra
    $customer = new WC_Customer($user_id);
    $order_count = $customer->get_order_count();

    if ($order_count == 1) {
        // Es la primera compra completada - activar Mi Magia
        do_action('duendes_acceso_mi_magia_activado', $user_id, $order_id);
    }
}, 20);


// ═══════════════════════════════════════════════════════════════════════════
// 2. EMAIL: ESTUDIO/LECTURA/CANALIZACIÓN LISTA
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Se dispara cuando se completa un estudio, lectura de runas o canalización especial
 * Hook: duendes_experiencia_lista
 * Uso: do_action('duendes_experiencia_lista', $user_id, $tipo, $titulo, $seccion);
 *
 * $tipo: 'estudio_energetico', 'lectura_runas', 'canalizacion'
 * $seccion: 'experiencias-magicas', 'grimorio', etc.
 */
add_action('duendes_experiencia_lista', function($user_id, $tipo, $titulo, $seccion = 'experiencias-magicas') {
    $user = get_user_by('ID', $user_id);
    if (!$user) return;

    $email = $user->user_email;
    $nombre = $user->first_name ?: 'Alma Mágica';

    // Textos según tipo
    $textos = [
        'estudio_energetico' => [
            'titulo_email' => 'Tu estudio energético está listo',
            'header' => 'Estudio Energético Listo',
            'subtitulo' => 'Los guardianes terminaron de analizar',
            'intro' => 'Trabajamos en algo especial para vos. Tu estudio energético ya está completo y te espera.',
            'descripcion' => 'Es un análisis profundo de tu campo energético, tus bloqueos y tus potenciales. No es algo genérico, es específico para lo que estás viviendo ahora.',
            'anticipacion' => 'Hay cosas que preferimos que descubras por tu cuenta. Lo que podemos adelantarte es que encontramos patrones que explican mucho de lo que venís sintiendo.'
        ],
        'lectura_runas' => [
            'titulo_email' => 'Tu lectura de runas está lista',
            'header' => 'Lectura de Runas Lista',
            'subtitulo' => 'Las piedras hablaron',
            'intro' => 'Las runas cayeron y tienen algo que decirte. Tu lectura ya está disponible.',
            'descripcion' => 'No es una lectura automática. Cada runa fue interpretada en el contexto de lo que compartiste con nosotros. El mensaje es para vos, específicamente.',
            'anticipacion' => 'Hay una runa que apareció de forma inesperada. Cuando la veas, vas a entender por qué.'
        ],
        'canalizacion' => [
            'titulo_email' => 'Tu canalización especial está lista',
            'header' => 'Canalización Lista',
            'subtitulo' => 'El mensaje llegó',
            'intro' => 'Algo importante quiere ser comunicado. Tu canalización ya está lista.',
            'descripcion' => 'Esto no es algo que forzamos. Esperamos hasta que el mensaje se formó completo. Lo que vas a leer viene de un lugar profundo.',
            'anticipacion' => 'Hay una parte del mensaje que probablemente te sorprenda. No porque sea malo, sino porque toca algo que no esperabas.'
        ]
    ];

    $texto = $textos[$tipo] ?? $textos['canalizacion'];

    $secciones = [
        'experiencias-magicas' => 'Experiencias Mágicas',
        'grimorio' => 'Tu Grimorio',
        'cofre' => 'Tu Cofre',
    ];
    $nombre_seccion = $secciones[$seccion] ?? 'Experiencias Mágicas';

    $url_destino = 'https://mi-magia.duendesdeluruguay.com/' . $seccion;

    $contenido = '
        <p style="font-size:22px;color:#C6A962;margin-bottom:20px;">' . esc_html($nombre) . ', ya está.</p>

        <p style="color:rgba(255,255,255,0.85);line-height:1.8;">
            ' . esc_html($texto['intro']) . '
        </p>

        <div style="background:linear-gradient(135deg, rgba(198,169,98,0.12), rgba(198,169,98,0.05));padding:25px;border-radius:15px;margin:25px 0;border:1px solid rgba(198,169,98,0.25);">
            <p style="color:#C6A962;font-size:13px;letter-spacing:2px;margin:0 0 12px 0;text-transform:uppercase;">
                ' . esc_html($titulo) . '
            </p>
            <p style="color:rgba(255,255,255,0.85);font-size:15px;line-height:1.7;margin:0;">
                ' . esc_html($texto['descripcion']) . '
            </p>
        </div>

        <p style="color:rgba(255,255,255,0.85);line-height:1.8;">
            ' . esc_html($texto['anticipacion']) . '
        </p>

        <div style="background:rgba(198,169,98,0.06);padding:18px;border-radius:12px;margin:25px 0;text-align:center;">
            <p style="color:rgba(255,255,255,0.6);font-size:14px;margin:0 0 5px 0;">
                Lo encontrás en Mi Magia, sección:
            </p>
            <p style="color:#C6A962;font-size:18px;margin:0;font-weight:600;">
                ' . esc_html($nombre_seccion) . '
            </p>
        </div>

        <p style="text-align:center;margin:30px 0;">
            <a href="' . esc_url($url_destino) . '" style="display:inline-block;padding:16px 35px;background:linear-gradient(135deg,#C6A962,#a88a42);color:#000;text-decoration:none;border-radius:25px;font-weight:600;font-size:16px;">
                Ver ahora
            </a>
        </p>

        <p style="color:rgba(255,255,255,0.6);font-size:14px;text-align:center;font-style:italic;margin-top:25px;">
            Tomate tu tiempo para leerlo. No hay apuro.
        </p>

        <p style="color:rgba(255,255,255,0.5);font-size:13px;margin-top:35px;text-align:center;">
            Thibisay & Gabriel
        </p>
    ';

    duendes_enviar_email($email, $texto['titulo_email'], $contenido, $texto['header'], $texto['subtitulo']);
}, 10, 4);


// ═══════════════════════════════════════════════════════════════════════════
// 3. EMAIL: PRUEBA GRATUITA EL CÍRCULO (15 días)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Se dispara cuando alguien activa la prueba gratuita de El Círculo
 * Hook: duendes_circulo_trial_iniciado
 * Uso: do_action('duendes_circulo_trial_iniciado', $user_id);
 */
add_action('duendes_circulo_trial_iniciado', function($user_id) {
    $user = get_user_by('ID', $user_id);
    if (!$user) return;

    $email = $user->user_email;
    $nombre = $user->first_name ?: 'Alma Mágica';

    $fecha_fin = date('d/m/Y', strtotime('+15 days'));

    $contenido = '
        <p style="font-size:22px;color:#C6A962;margin-bottom:20px;">' . esc_html($nombre) . ', bienvenida al Círculo.</p>

        <p style="color:rgba(255,255,255,0.85);line-height:1.8;">
            A partir de ahora tenés 15 días para explorar lo que muy pocos conocen.
            El Círculo de Duendes es nuestra comunidad más íntima, donde compartimos
            cosas que no publicamos en ningún otro lado.
        </p>

        <p style="color:rgba(255,255,255,0.85);line-height:1.8;margin-top:15px;">
            No es solo una membresía. Es un grupo de personas que eligieron conectar diferente.
        </p>

        <div style="background:rgba(198,169,98,0.08);padding:25px;border-radius:15px;margin:30px 0;border:1px solid rgba(198,169,98,0.15);">
            <p style="color:#C6A962;font-size:17px;margin:0 0 20px 0;text-align:center;">Lo que tenés durante estos 15 días:</p>

            <div style="margin-bottom:18px;padding-bottom:16px;border-bottom:1px solid rgba(198,169,98,0.15);">
                <p style="color:#C6A962;font-size:15px;margin:0 0 5px 0;">Canalizaciones Exclusivas</p>
                <p style="color:rgba(255,255,255,0.75);font-size:14px;margin:0;line-height:1.6;">
                    Mensajes mensuales que solo reciben los miembros. No son genéricos,
                    están pensados para el momento que está viviendo la comunidad.
                </p>
            </div>

            <div style="margin-bottom:18px;padding-bottom:16px;border-bottom:1px solid rgba(198,169,98,0.15);">
                <p style="color:#C6A962;font-size:15px;margin:0 0 5px 0;">Tito Premium</p>
                <p style="color:rgba(255,255,255,0.75);font-size:14px;margin:0;line-height:1.6;">
                    Acceso completo a Tito, sin límites. Conversaciones más profundas,
                    respuestas más detalladas, conexión más directa.
                </p>
            </div>

            <div style="margin-bottom:18px;padding-bottom:16px;border-bottom:1px solid rgba(198,169,98,0.15);">
                <p style="color:#C6A962;font-size:15px;margin:0 0 5px 0;">Comunidad Privada</p>
                <p style="color:rgba(255,255,255,0.75);font-size:14px;margin:0;line-height:1.6;">
                    Un espacio donde compartir experiencias con otras personas que entienden.
                    Sin juicios, sin explicaciones. Solo conexión.
                </p>
            </div>

            <div>
                <p style="color:#C6A962;font-size:15px;margin:0 0 5px 0;">Descuentos Especiales</p>
                <p style="color:rgba(255,255,255,0.75);font-size:14px;margin:0;line-height:1.6;">
                    Los miembros del Círculo acceden primero a guardianes nuevos,
                    y con descuentos que no publicamos en la tienda.
                </p>
            </div>
        </div>

        <div style="background:rgba(255,200,100,0.08);padding:20px;border-radius:12px;margin:25px 0;border:1px solid rgba(255,200,100,0.2);">
            <p style="color:rgba(255,220,150,0.9);font-size:15px;margin:0 0 8px 0;">Importante</p>
            <p style="color:rgba(255,255,255,0.75);font-size:14px;margin:0;line-height:1.7;">
                Tu prueba termina el <strong style="color:#C6A962;">' . esc_html($fecha_fin) . '</strong>.
                Después de eso, el acceso se cierra automáticamente.
                Si querés quedarte, podés activar la membresía en cualquier momento durante el trial.
            </p>
        </div>

        <p style="color:rgba(255,255,255,0.8);line-height:1.8;margin:20px 0;">
            Un consejo: no dejes para el último día.
            Explorá todo lo que puedas en estos 15 días para saber si esto es para vos.
        </p>

        <p style="text-align:center;margin:30px 0;">
            <a href="https://mi-magia.duendesdeluruguay.com/circulo" style="display:inline-block;padding:16px 35px;background:linear-gradient(135deg,#C6A962,#a88a42);color:#000;text-decoration:none;border-radius:25px;font-weight:600;font-size:16px;">
                Explorar El Círculo
            </a>
        </p>

        <p style="color:rgba(255,255,255,0.5);font-size:13px;margin-top:35px;text-align:center;">
            Nos vemos adentro,<br>
            Thibisay & Gabriel
        </p>
    ';

    duendes_enviar_email($email, 'Bienvenida al Círculo de Duendes', $contenido, 'El Círculo', '15 días para explorar');
});

// Programar email de recordatorio 3 días antes de que termine el trial
add_action('duendes_circulo_trial_iniciado', function($user_id) {
    wp_schedule_single_event(time() + (12 * DAY_IN_SECONDS), 'duendes_circulo_trial_por_vencer', [$user_id]);
});


// ═══════════════════════════════════════════════════════════════════════════
// 4. EMAIL: CONFIRMACIÓN DE MEMBRESÍA EL CÍRCULO
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Se dispara cuando alguien paga la membresía de El Círculo
 * Hook: duendes_circulo_membresia_activada
 * Uso: do_action('duendes_circulo_membresia_activada', $user_id, $subscription_id);
 */
add_action('duendes_circulo_membresia_activada', function($user_id, $subscription_id = null) {
    $user = get_user_by('ID', $user_id);
    if (!$user) return;

    $email = $user->user_email;
    $nombre = $user->first_name ?: 'Alma Mágica';

    // Limpiar cualquier hook de trial pendiente
    wp_clear_scheduled_hook('duendes_circulo_trial_por_vencer', [$user_id]);

    $contenido = '
        <p style="font-size:22px;color:#C6A962;margin-bottom:20px;">' . esc_html($nombre) . ', ahora sos parte.</p>

        <p style="color:rgba(255,255,255,0.85);line-height:1.8;">
            Bienvenida oficialmente al Círculo de Duendes.
            No es solo una membresía, es una forma de conectar con nosotros y con una comunidad
            que elige vivir las cosas de otra manera.
        </p>

        <p style="color:rgba(255,255,255,0.85);line-height:1.8;margin-top:15px;">
            A partir de ahora, tenés acceso a todo. Sin restricciones, sin límites de tiempo.
        </p>

        <div style="background:rgba(198,169,98,0.08);padding:25px;border-radius:15px;margin:30px 0;border:1px solid rgba(198,169,98,0.15);">
            <p style="color:#C6A962;font-size:17px;margin:0 0 25px 0;text-align:center;">Tu membresía incluye:</p>

            <div style="margin-bottom:22px;padding-bottom:20px;border-bottom:1px solid rgba(198,169,98,0.15);">
                <p style="color:#C6A962;font-size:16px;margin:0 0 8px 0;">Canalizaciones Mensuales Exclusivas</p>
                <p style="color:rgba(255,255,255,0.75);font-size:14px;margin:0;line-height:1.7;">
                    Cada mes, un mensaje nuevo que solo reciben los miembros del Círculo.
                    No es contenido reciclado, es algo que canalizamos específicamente para la comunidad.
                    Te avisamos por email cuando esté disponible.
                </p>
            </div>

            <div style="margin-bottom:22px;padding-bottom:20px;border-bottom:1px solid rgba(198,169,98,0.15);">
                <p style="color:#C6A962;font-size:16px;margin:0 0 8px 0;">Acceso Completo a Tito Premium</p>
                <p style="color:rgba(255,255,255,0.75);font-size:14px;margin:0;line-height:1.7;">
                    Conversaciones sin límite, respuestas más profundas, acceso a funciones que
                    los usuarios normales no tienen. Tito te reconoce como miembro y te trata diferente.
                </p>
            </div>

            <div style="margin-bottom:22px;padding-bottom:20px;border-bottom:1px solid rgba(198,169,98,0.15);">
                <p style="color:#C6A962;font-size:16px;margin:0 0 8px 0;">Comunidad Privada de Elegidos</p>
                <p style="color:rgba(255,255,255,0.75);font-size:14px;margin:0;line-height:1.7;">
                    Un espacio donde compartir experiencias, hacer preguntas, conectar con
                    otras personas que viven las cosas de manera similar. Moderado con cuidado
                    para que sea un lugar seguro.
                </p>
            </div>

            <div style="margin-bottom:22px;padding-bottom:20px;border-bottom:1px solid rgba(198,169,98,0.15);">
                <p style="color:#C6A962;font-size:16px;margin:0 0 8px 0;">Descuentos Permanentes en la Tienda</p>
                <p style="color:rgba(255,255,255,0.75);font-size:14px;margin:0;line-height:1.7;">
                    15% de descuento en todos los guardianes. Acceso anticipado a piezas nuevas
                    antes de que se publiquen. Ofertas especiales solo para miembros.
                </p>
            </div>

            <div style="margin-bottom:22px;padding-bottom:20px;border-bottom:1px solid rgba(198,169,98,0.15);">
                <p style="color:#C6A962;font-size:16px;margin:0 0 8px 0;">Contenido Exclusivo</p>
                <p style="color:rgba(255,255,255,0.75);font-size:14px;margin:0;line-height:1.7;">
                    Rituales guiados, meditaciones, lecturas especiales, behind the scenes
                    de cómo creamos los guardianes. Cosas que no publicamos en ningún otro lado.
                </p>
            </div>

            <div>
                <p style="color:#C6A962;font-size:16px;margin:0 0 8px 0;">Eventos y Encuentros</p>
                <p style="color:rgba(255,255,255,0.75);font-size:14px;margin:0;line-height:1.7;">
                    Cuando organizamos algo especial (online o presencial), los miembros del
                    Círculo son los primeros en enterarse y tienen prioridad.
                </p>
            </div>
        </div>

        <div style="background:rgba(100,180,100,0.08);padding:20px;border-radius:12px;margin:25px 0;border:1px solid rgba(100,180,100,0.15);">
            <p style="color:#8fbc8f;font-size:15px;margin:0 0 10px 0;">Próximos pasos</p>
            <p style="color:rgba(255,255,255,0.75);font-size:14px;margin:0;line-height:1.7;">
                1. Entrá al Círculo y presentate en la comunidad<br>
                2. Explorá el contenido exclusivo disponible<br>
                3. Si tenés guardianes, contá cómo va la conexión<br>
                4. Estate atenta al próximo email con la canalización mensual
            </p>
        </div>

        <p style="text-align:center;margin:30px 0;">
            <a href="https://mi-magia.duendesdeluruguay.com/circulo" style="display:inline-block;padding:16px 35px;background:linear-gradient(135deg,#C6A962,#a88a42);color:#000;text-decoration:none;border-radius:25px;font-weight:600;font-size:16px;">
                Entrar al Círculo
            </a>
        </p>

        <p style="color:rgba(255,255,255,0.6);font-size:14px;text-align:center;font-style:italic;">
            Tu membresía se renueva automáticamente cada mes.<br>
            Podés cancelar cuando quieras desde tu perfil.
        </p>

        <p style="color:rgba(255,255,255,0.5);font-size:13px;margin-top:35px;text-align:center;">
            Gracias por confiar en nosotros,<br>
            Thibisay & Gabriel
        </p>
    ';

    duendes_enviar_email($email, 'Bienvenida oficial al Círculo de Duendes', $contenido, 'Sos parte del Círculo', 'Tu membresía está activa');
}, 10, 2);


// ═══════════════════════════════════════════════════════════════════════════
// 5. EMAIL: RENOVACIÓN DE MEMBRESÍA
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Se dispara cuando se renueva la membresía (automática o manual)
 * Hook: duendes_circulo_renovacion
 * Uso: do_action('duendes_circulo_renovacion', $user_id, $meses_miembro);
 */
add_action('duendes_circulo_renovacion', function($user_id, $meses_miembro = 1) {
    $user = get_user_by('ID', $user_id);
    if (!$user) return;

    $email = $user->user_email;
    $nombre = $user->first_name ?: 'Alma Mágica';

    // Mensaje personalizado según tiempo como miembro
    $mensaje_tiempo = '';
    if ($meses_miembro >= 12) {
        $mensaje_tiempo = 'Ya llevás más de un año con nosotros. Eso significa mucho.';
    } elseif ($meses_miembro >= 6) {
        $mensaje_tiempo = 'Medio año juntos. Gracias por seguir eligiendo estar.';
    } elseif ($meses_miembro >= 3) {
        $mensaje_tiempo = 'Tres meses de conexión. Ya sos parte de la historia.';
    } else {
        $mensaje_tiempo = 'Gracias por renovar tu confianza en nosotros.';
    }

    $contenido = '
        <p style="font-size:22px;color:#C6A962;margin-bottom:20px;">' . esc_html($nombre) . ', seguimos juntos.</p>

        <p style="color:rgba(255,255,255,0.85);line-height:1.8;">
            Tu membresía en El Círculo se renovó. ' . esc_html($mensaje_tiempo) . '
        </p>

        <div style="background:rgba(198,169,98,0.08);padding:20px;border-radius:12px;margin:25px 0;text-align:center;border:1px solid rgba(198,169,98,0.15);">
            <p style="color:rgba(255,255,255,0.6);font-size:13px;margin:0 0 5px 0;">Meses como miembro</p>
            <p style="color:#C6A962;font-size:32px;margin:0;font-weight:600;">' . esc_html($meses_miembro) . '</p>
        </div>

        <p style="color:rgba(255,255,255,0.85);line-height:1.8;">
            Todo sigue igual: tus beneficios, tu acceso, tu lugar en la comunidad.
            Y si hay algo nuevo este mes, te lo contamos apenas esté listo.
        </p>

        <div style="background:rgba(100,180,100,0.08);padding:18px;border-radius:12px;margin:25px 0;border:1px solid rgba(100,180,100,0.15);">
            <p style="color:#8fbc8f;font-size:14px;margin:0;line-height:1.7;">
                Si en algún momento necesitás pausar o cancelar, podés hacerlo desde tu perfil.
                Sin vueltas, sin preguntas. Aunque nos encantaría que te quedes.
            </p>
        </div>

        <p style="text-align:center;margin:30px 0;">
            <a href="https://mi-magia.duendesdeluruguay.com/circulo" style="display:inline-block;padding:14px 30px;background:rgba(198,169,98,0.15);color:#C6A962;text-decoration:none;border-radius:25px;border:1px solid rgba(198,169,98,0.3);">
                Ir al Círculo
            </a>
        </p>

        <p style="color:rgba(255,255,255,0.5);font-size:13px;margin-top:35px;text-align:center;">
            Gracias por estar,<br>
            Thibisay & Gabriel
        </p>
    ';

    duendes_enviar_email($email, 'Tu membresía se renovó', $contenido, 'Renovación del Círculo', 'Seguimos juntos');
}, 10, 2);


// ═══════════════════════════════════════════════════════════════════════════
// 6. EMAIL: MEMBRESÍA POR VENCER (Trial)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Se dispara 3 días antes de que termine el trial
 */
add_action('duendes_circulo_trial_por_vencer', function($user_id) {
    $user = get_user_by('ID', $user_id);
    if (!$user) return;

    // Verificar si ya tiene membresía paga (no enviar si ya convirtió)
    $tiene_membresia = get_user_meta($user_id, 'duendes_circulo_membresia_activa', true);
    if ($tiene_membresia) return;

    $email = $user->user_email;
    $nombre = $user->first_name ?: 'Alma Mágica';

    $fecha_fin = date('d/m/Y', strtotime('+3 days'));

    $contenido = '
        <p style="font-size:22px;color:#C6A962;margin-bottom:20px;">' . esc_html($nombre) . ', quedan 3 días.</p>

        <p style="color:rgba(255,255,255,0.85);line-height:1.8;">
            Tu prueba gratuita del Círculo termina el <strong style="color:#C6A962;">' . esc_html($fecha_fin) . '</strong>.
        </p>

        <p style="color:rgba(255,255,255,0.85);line-height:1.8;margin-top:15px;">
            No te escribimos para presionarte. Te escribimos porque hay cosas que
            quizás todavía no exploraste y que vale la pena ver antes de que se cierre el acceso.
        </p>

        <div style="background:rgba(198,169,98,0.08);padding:25px;border-radius:15px;margin:30px 0;border:1px solid rgba(198,169,98,0.15);">
            <p style="color:#C6A962;font-size:16px;margin:0 0 18px 0;">Lo que perdés si no continuás:</p>

            <p style="color:rgba(255,255,255,0.8);line-height:1.9;margin:0;">
                <span style="color:#C6A962;">•</span> Acceso a Tito Premium (volvés al modo básico)<br>
                <span style="color:#C6A962;">•</span> Canalizaciones mensuales exclusivas<br>
                <span style="color:#C6A962;">•</span> La comunidad privada de Elegidos<br>
                <span style="color:#C6A962;">•</span> Descuentos permanentes en la tienda<br>
                <span style="color:#C6A962;">•</span> Todo el contenido exclusivo que no publicamos en otro lado
            </p>
        </div>

        <div style="background:rgba(255,200,100,0.08);padding:20px;border-radius:12px;margin:25px 0;border:1px solid rgba(255,200,100,0.2);">
            <p style="color:rgba(255,220,150,0.9);font-size:15px;margin:0 0 10px 0;">Si el Círculo no es para vos, está bien</p>
            <p style="color:rgba(255,255,255,0.75);font-size:14px;margin:0;line-height:1.7;">
                No queremos que te suscribas por compromiso. Si probaste y no te cerró,
                no pasa nada. Seguís teniendo acceso a Mi Magia con tus guardianes.
            </p>
        </div>

        <p style="color:rgba(255,255,255,0.85);line-height:1.8;">
            Pero si algo de lo que viste te gustó, si sentiste que es un espacio donde
            querés estar... este es el momento de decidir.
        </p>

        <p style="text-align:center;margin:30px 0;">
            <a href="https://mi-magia.duendesdeluruguay.com/circulo/activar" style="display:inline-block;padding:16px 35px;background:linear-gradient(135deg,#C6A962,#a88a42);color:#000;text-decoration:none;border-radius:25px;font-weight:600;font-size:16px;">
                Activar mi membresía
            </a>
        </p>

        <p style="color:rgba(255,255,255,0.5);font-size:13px;text-align:center;margin-top:10px;">
            O seguí disfrutando los días que quedan. Sin presión.
        </p>

        <p style="color:rgba(255,255,255,0.5);font-size:13px;margin-top:35px;text-align:center;">
            Thibisay & Gabriel
        </p>
    ';

    duendes_enviar_email($email, 'Tu prueba del Círculo termina en 3 días', $contenido, 'Se termina el trial', 'Quedan 3 días');
});


// ═══════════════════════════════════════════════════════════════════════════
// 7. EMAIL: MEMBRESÍA POR VENCER (Paga)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Se dispara X días antes de que venza la membresía paga (si el pago falla o está por vencer)
 * Hook: duendes_circulo_membresia_por_vencer
 * Uso: do_action('duendes_circulo_membresia_por_vencer', $user_id, $dias_restantes, $razon);
 *
 * $razon: 'pago_fallido', 'cancelacion_programada', 'expiracion'
 */
add_action('duendes_circulo_membresia_por_vencer', function($user_id, $dias_restantes = 7, $razon = 'expiracion') {
    $user = get_user_by('ID', $user_id);
    if (!$user) return;

    $email = $user->user_email;
    $nombre = $user->first_name ?: 'Alma Mágica';

    $fecha_fin = date('d/m/Y', strtotime("+{$dias_restantes} days"));

    // Contenido según razón
    $intro = '';
    $accion = '';

    switch ($razon) {
        case 'pago_fallido':
            $intro = 'Hubo un problema con el pago de tu membresía. No pudimos renovarla automáticamente.';
            $accion = 'Actualizar método de pago';
            $url_accion = 'https://mi-magia.duendesdeluruguay.com/perfil/pagos';
            break;
        case 'cancelacion_programada':
            $intro = 'Programaste la cancelación de tu membresía. El acceso se cierra el ' . $fecha_fin . '.';
            $accion = 'Cancelar la cancelación';
            $url_accion = 'https://mi-magia.duendesdeluruguay.com/circulo/reactivar';
            break;
        default:
            $intro = 'Tu membresía del Círculo está por vencer.';
            $accion = 'Renovar membresía';
            $url_accion = 'https://mi-magia.duendesdeluruguay.com/circulo/renovar';
    }

    $contenido = '
        <p style="font-size:22px;color:#C6A962;margin-bottom:20px;">' . esc_html($nombre) . ', queríamos avisarte.</p>

        <p style="color:rgba(255,255,255,0.85);line-height:1.8;">
            ' . esc_html($intro) . '
        </p>

        <div style="background:rgba(255,150,100,0.1);padding:20px;border-radius:12px;margin:25px 0;border:1px solid rgba(255,150,100,0.25);text-align:center;">
            <p style="color:rgba(255,200,150,0.9);font-size:14px;margin:0 0 5px 0;">Tu acceso al Círculo termina en</p>
            <p style="color:#C6A962;font-size:28px;margin:0;font-weight:600;">' . esc_html($dias_restantes) . ' días</p>
            <p style="color:rgba(255,255,255,0.5);font-size:13px;margin:8px 0 0 0;">(' . esc_html($fecha_fin) . ')</p>
        </div>

        <p style="color:rgba(255,255,255,0.85);line-height:1.8;">
            No queremos perderte. Pero si es momento de hacer una pausa, lo entendemos.
        </p>

        <p style="color:rgba(255,255,255,0.8);line-height:1.8;">
            Si querés seguir siendo parte del Círculo, solo necesitás resolver esto antes de la fecha.
            Después de eso, el acceso se cierra automáticamente.
        </p>

        <p style="text-align:center;margin:30px 0;">
            <a href="' . esc_url($url_accion) . '" style="display:inline-block;padding:16px 35px;background:linear-gradient(135deg,#C6A962,#a88a42);color:#000;text-decoration:none;border-radius:25px;font-weight:600;font-size:16px;">
                ' . esc_html($accion) . '
            </a>
        </p>

        <p style="color:rgba(255,255,255,0.6);font-size:14px;text-align:center;font-style:italic;">
            Si tenés algún problema o necesitás ayuda, respondé a este email.
        </p>

        <p style="color:rgba(255,255,255,0.5);font-size:13px;margin-top:35px;text-align:center;">
            Thibisay & Gabriel
        </p>
    ';

    $subject = $razon === 'pago_fallido'
        ? 'Problema con tu membresía del Círculo'
        : 'Tu membresía del Círculo vence pronto';

    duendes_enviar_email($email, $subject, $contenido, 'Aviso del Círculo', 'Tu membresía necesita atención');
}, 10, 3);


// ═══════════════════════════════════════════════════════════════════════════
// 8. EMAIL: CANALIZACIÓN MENSUAL DEL CÍRCULO
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Se dispara cuando hay una nueva canalización mensual para el Círculo
 * Hook: duendes_circulo_canalizacion_mensual
 * Uso: do_action('duendes_circulo_canalizacion_mensual', $titulo, $preview);
 */
add_action('duendes_circulo_canalizacion_mensual', function($titulo, $preview = '') {
    // Obtener todos los miembros activos del Círculo
    $args = [
        'meta_key' => 'duendes_circulo_membresia_activa',
        'meta_value' => '1',
    ];
    $miembros = get_users($args);

    foreach ($miembros as $miembro) {
        duendes_enviar_canalizacion_mensual_individual($miembro->ID, $titulo, $preview);
    }
}, 10, 2);

function duendes_enviar_canalizacion_mensual_individual($user_id, $titulo, $preview) {
    $user = get_user_by('ID', $user_id);
    if (!$user) return;

    $email = $user->user_email;
    $nombre = $user->first_name ?: 'Alma Mágica';

    $mes = ucfirst(strftime('%B', time())); // Nombre del mes en español

    $contenido = '
        <p style="font-size:22px;color:#C6A962;margin-bottom:20px;">' . esc_html($nombre) . ', llegó la canalización de ' . esc_html($mes) . '.</p>

        <p style="color:rgba(255,255,255,0.85);line-height:1.8;">
            Hay algo nuevo esperándote en El Círculo. La canalización mensual ya está disponible.
        </p>

        <div style="background:linear-gradient(135deg, rgba(198,169,98,0.15), rgba(198,169,98,0.05));padding:30px;border-radius:15px;margin:30px 0;border:1px solid rgba(198,169,98,0.3);">
            <p style="color:#C6A962;font-size:13px;letter-spacing:2px;margin:0 0 15px 0;text-transform:uppercase;">
                Canalización de ' . esc_html($mes) . '
            </p>
            <p style="color:#fff;font-size:20px;margin:0 0 15px 0;font-family:Georgia,serif;">
                ' . esc_html($titulo) . '
            </p>
            ' . ($preview ? '<p style="color:rgba(255,255,255,0.7);font-size:15px;line-height:1.7;margin:0;font-style:italic;">"' . esc_html($preview) . '..."</p>' : '') . '
        </div>

        <p style="color:rgba(255,255,255,0.8);line-height:1.8;">
            El mensaje completo te espera adentro. Tomate tu tiempo para leerlo,
            no hay apuro.
        </p>

        <p style="text-align:center;margin:30px 0;">
            <a href="https://mi-magia.duendesdeluruguay.com/circulo/canalizaciones" style="display:inline-block;padding:16px 35px;background:linear-gradient(135deg,#C6A962,#a88a42);color:#000;text-decoration:none;border-radius:25px;font-weight:600;font-size:16px;">
                Leer la canalización
            </a>
        </p>

        <p style="color:rgba(255,255,255,0.5);font-size:13px;margin-top:35px;text-align:center;">
            Exclusivo para miembros del Círculo
        </p>
    ';

    duendes_enviar_email($email, 'Nueva canalización: ' . $titulo, $contenido, 'Canalización de ' . $mes, 'Exclusivo para el Círculo');
}


// ═══════════════════════════════════════════════════════════════════════════
// INTEGRACIÓN CON WOOCOMMERCE SUBSCRIPTIONS (si está instalado)
// ═══════════════════════════════════════════════════════════════════════════

// Detectar cuando se activa una suscripción del Círculo
add_action('woocommerce_subscription_status_active', function($subscription) {
    $product_ids = [];
    foreach ($subscription->get_items() as $item) {
        $product_ids[] = $item->get_product_id();
    }

    // Verificar si es producto del Círculo (ajustar el ID según corresponda)
    $circulo_product_ids = get_option('duendes_circulo_product_ids', []);
    if (empty($circulo_product_ids)) {
        // Fallback: buscar por slug o categoria
        $circulo_product_ids = [];
    }

    $es_circulo = !empty(array_intersect($product_ids, $circulo_product_ids));

    if ($es_circulo) {
        $user_id = $subscription->get_user_id();
        update_user_meta($user_id, 'duendes_circulo_membresia_activa', true);
        update_user_meta($user_id, 'duendes_circulo_fecha_inicio', current_time('mysql'));

        // Disparar email de bienvenida
        do_action('duendes_circulo_membresia_activada', $user_id, $subscription->get_id());
    }
});

// Detectar renovación
add_action('woocommerce_subscription_renewal_payment_complete', function($subscription) {
    $product_ids = [];
    foreach ($subscription->get_items() as $item) {
        $product_ids[] = $item->get_product_id();
    }

    $circulo_product_ids = get_option('duendes_circulo_product_ids', []);
    $es_circulo = !empty(array_intersect($product_ids, $circulo_product_ids));

    if ($es_circulo) {
        $user_id = $subscription->get_user_id();

        // Calcular meses como miembro
        $fecha_inicio = get_user_meta($user_id, 'duendes_circulo_fecha_inicio', true);
        $meses = 1;
        if ($fecha_inicio) {
            $diff = date_diff(new DateTime($fecha_inicio), new DateTime());
            $meses = ($diff->y * 12) + $diff->m + 1;
        }

        do_action('duendes_circulo_renovacion', $user_id, $meses);
    }
});

// Detectar pago fallido
add_action('woocommerce_subscription_payment_failed', function($subscription) {
    $product_ids = [];
    foreach ($subscription->get_items() as $item) {
        $product_ids[] = $item->get_product_id();
    }

    $circulo_product_ids = get_option('duendes_circulo_product_ids', []);
    $es_circulo = !empty(array_intersect($product_ids, $circulo_product_ids));

    if ($es_circulo) {
        $user_id = $subscription->get_user_id();
        do_action('duendes_circulo_membresia_por_vencer', $user_id, 7, 'pago_fallido');
    }
});


// ═══════════════════════════════════════════════════════════════════════════
// ADMIN: PÁGINA DE CONFIGURACIÓN
// ═══════════════════════════════════════════════════════════════════════════

add_action('admin_menu', function() {
    add_submenu_page(
        'woocommerce',
        'Duendes Emails Extras',
        'Emails Extras',
        'manage_woocommerce',
        'duendes-emails-extras',
        'duendes_emails_extras_admin_page'
    );
});

function duendes_emails_extras_admin_page() {
    // Guardar configuración
    if (isset($_POST['duendes_save_emails_config']) && check_admin_referer('duendes_emails_config')) {
        $product_ids = array_filter(array_map('intval', explode(',', $_POST['circulo_product_ids'] ?? '')));
        update_option('duendes_circulo_product_ids', $product_ids);
        echo '<div class="notice notice-success"><p>Configuración guardada.</p></div>';
    }

    $circulo_ids = get_option('duendes_circulo_product_ids', []);
    ?>
    <div class="wrap">
        <h1>Duendes - Emails Extras</h1>

        <div style="background:#fff;padding:20px;border-radius:8px;margin-top:20px;max-width:800px;">
            <h2>Emails disponibles</h2>
            <table class="widefat" style="margin-top:15px;">
                <thead>
                    <tr>
                        <th>Email</th>
                        <th>Hook</th>
                        <th>Uso</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><strong>Acceso a Mi Magia</strong></td>
                        <td><code>duendes_acceso_mi_magia_activado</code></td>
                        <td>Automático en primera compra completada</td>
                    </tr>
                    <tr>
                        <td><strong>Experiencia Lista</strong></td>
                        <td><code>duendes_experiencia_lista</code></td>
                        <td><code>do_action('duendes_experiencia_lista', $user_id, $tipo, $titulo, $seccion)</code></td>
                    </tr>
                    <tr>
                        <td><strong>Trial El Círculo</strong></td>
                        <td><code>duendes_circulo_trial_iniciado</code></td>
                        <td><code>do_action('duendes_circulo_trial_iniciado', $user_id)</code></td>
                    </tr>
                    <tr>
                        <td><strong>Membresía Activada</strong></td>
                        <td><code>duendes_circulo_membresia_activada</code></td>
                        <td>Automático con WC Subscriptions</td>
                    </tr>
                    <tr>
                        <td><strong>Renovación</strong></td>
                        <td><code>duendes_circulo_renovacion</code></td>
                        <td>Automático con WC Subscriptions</td>
                    </tr>
                    <tr>
                        <td><strong>Por Vencer (Trial)</strong></td>
                        <td><code>duendes_circulo_trial_por_vencer</code></td>
                        <td>Automático 3 días antes del fin del trial</td>
                    </tr>
                    <tr>
                        <td><strong>Por Vencer (Pago)</strong></td>
                        <td><code>duendes_circulo_membresia_por_vencer</code></td>
                        <td><code>do_action('...', $user_id, $dias, $razon)</code></td>
                    </tr>
                    <tr>
                        <td><strong>Canalización Mensual</strong></td>
                        <td><code>duendes_circulo_canalizacion_mensual</code></td>
                        <td><code>do_action('...', $titulo, $preview)</code></td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div style="background:#fff;padding:20px;border-radius:8px;margin-top:20px;max-width:800px;">
            <h2>Configuración</h2>
            <form method="post">
                <?php wp_nonce_field('duendes_emails_config'); ?>
                <table class="form-table">
                    <tr>
                        <th scope="row">
                            <label for="circulo_product_ids">IDs de productos del Círculo</label>
                        </th>
                        <td>
                            <input type="text" name="circulo_product_ids" id="circulo_product_ids"
                                   value="<?php echo esc_attr(implode(',', $circulo_ids)); ?>"
                                   class="regular-text">
                            <p class="description">IDs de productos WooCommerce separados por coma (ej: 123,456)</p>
                        </td>
                    </tr>
                </table>
                <p class="submit">
                    <input type="submit" name="duendes_save_emails_config" class="button-primary" value="Guardar configuración">
                </p>
            </form>
        </div>

        <div style="background:#fff;padding:20px;border-radius:8px;margin-top:20px;max-width:800px;">
            <h2>Envío manual de prueba</h2>
            <p>Usá estos botones para enviar emails de prueba a tu email de admin.</p>

            <form method="post" style="margin-top:15px;">
                <?php wp_nonce_field('duendes_test_email'); ?>
                <input type="hidden" name="test_email_type" value="">

                <button type="submit" name="test_email_type" value="mi_magia" class="button">
                    Probar: Acceso Mi Magia
                </button>
                <button type="submit" name="test_email_type" value="experiencia" class="button">
                    Probar: Experiencia Lista
                </button>
                <button type="submit" name="test_email_type" value="trial" class="button">
                    Probar: Trial Círculo
                </button>
                <button type="submit" name="test_email_type" value="membresia" class="button">
                    Probar: Membresía Activada
                </button>
                <button type="submit" name="test_email_type" value="renovacion" class="button">
                    Probar: Renovación
                </button>
                <button type="submit" name="test_email_type" value="por_vencer" class="button">
                    Probar: Por Vencer
                </button>
            </form>
        </div>
    </div>
    <?php
}

// Procesar envío de pruebas
add_action('admin_init', function() {
    if (!isset($_POST['test_email_type']) || !check_admin_referer('duendes_test_email')) {
        return;
    }

    $current_user = wp_get_current_user();
    $user_id = $current_user->ID;
    $tipo = sanitize_text_field($_POST['test_email_type']);

    switch ($tipo) {
        case 'mi_magia':
            do_action('duendes_acceso_mi_magia_activado', $user_id, null);
            break;
        case 'experiencia':
            do_action('duendes_experiencia_lista', $user_id, 'lectura_runas', 'Lectura de Runas - Enero 2026', 'experiencias-magicas');
            break;
        case 'trial':
            do_action('duendes_circulo_trial_iniciado', $user_id);
            break;
        case 'membresia':
            do_action('duendes_circulo_membresia_activada', $user_id, null);
            break;
        case 'renovacion':
            do_action('duendes_circulo_renovacion', $user_id, 6);
            break;
        case 'por_vencer':
            do_action('duendes_circulo_membresia_por_vencer', $user_id, 3, 'pago_fallido');
            break;
    }

    add_action('admin_notices', function() {
        echo '<div class="notice notice-success"><p>Email de prueba enviado.</p></div>';
    });
});
