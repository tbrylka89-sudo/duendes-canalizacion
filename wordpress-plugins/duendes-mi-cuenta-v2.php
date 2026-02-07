<?php
/**
 * Plugin Name: Duendes - Mi Cuenta v2
 * Description: Traducciones y estilos para Mi Cuenta de WooCommerce
 * Version: 2.1.0
 */

if (!defined('ABSPATH')) exit;

// ═══════════════════════════════════════════════════════════════════════════
// TRADUCCIONES COMPLETAS
// ═══════════════════════════════════════════════════════════════════════════

add_filter('gettext', 'duendes_traducir_wc', 99, 3);

function duendes_traducir_wc($translated, $text, $domain) {
    static $t = null;

    if ($t === null) {
        $t = [
            // ═══ MENÚ MI CUENTA ═══
            'Dashboard' => 'Panel',
            'Orders' => 'Mis Pedidos',
            'Downloads' => 'Descargas',
            'Addresses' => 'Direcciones',
            'Account details' => 'Mis Datos',
            'Account Details' => 'Mis Datos',
            'Logout' => 'Cerrar Sesión',
            'Log out' => 'Cerrar Sesión',

            // ═══ DASHBOARD ═══
            'Hello %1$s (not %2$s? %3$s)' => 'Hola %1$s (¿no sos %2$s? %3$s)',
            'From your account dashboard you can view your <a href="%1$s">recent orders</a>, manage your <a href="%2$s">shipping and billing addresses</a>, and <a href="%3$s">edit your password and account details</a>.'
                => 'Desde tu panel podés ver tus <a href="%1$s">pedidos recientes</a>, administrar tus <a href="%2$s">direcciones de envío y facturación</a>, y <a href="%3$s">editar tu contraseña y datos de cuenta</a>.',
            'recent orders' => 'pedidos recientes',
            'shipping and billing addresses' => 'direcciones de envío y facturación',
            'edit your password and account details' => 'editar tu contraseña y datos de cuenta',

            // ═══ PEDIDOS ═══
            'Order' => 'Pedido',
            'Date' => 'Fecha',
            'Status' => 'Estado',
            'Total' => 'Total',
            'Actions' => 'Acciones',
            'View' => 'Ver',
            'No order has been made yet.' => 'Todavía no hiciste ningún pedido.',
            'Browse products' => 'Ver productos',

            // ═══ ESTADOS DE PEDIDO ═══
            'Pending payment' => 'Pago pendiente',
            'Processing' => 'Procesando',
            'On hold' => 'En espera',
            'Completed' => 'Completado',
            'Cancelled' => 'Cancelado',
            'Refunded' => 'Reembolsado',
            'Failed' => 'Fallido',

            // ═══ DIRECCIONES ═══
            'Billing address' => 'Dirección de facturación',
            'Shipping address' => 'Dirección de envío',
            'Edit' => 'Editar',
            'Add' => 'Agregar',

            // ═══ FORMULARIOS ═══
            'First name' => 'Nombre',
            'Last name' => 'Apellido',
            'Display name' => 'Nombre visible',
            'Email address' => 'Email',
            'Current password (leave blank to leave unchanged)' => 'Contraseña actual (dejá en blanco para no cambiar)',
            'New password (leave blank to leave unchanged)' => 'Nueva contraseña (dejá en blanco para no cambiar)',
            'Confirm new password' => 'Confirmar contraseña',
            'Save changes' => 'Guardar',
            'Save' => 'Guardar',

            // ═══ LOGIN ═══
            'Username or email address' => 'Email',
            'Username or email' => 'Email',
            'Password' => 'Contraseña',
            'Remember me' => 'Recordarme',
            'Lost your password?' => '¿Olvidaste tu contraseña?',
            'Log in' => 'Acceder',
            'Login' => 'Acceder',

            // ═══ RESET PASSWORD ═══
            'Reset password' => 'Restablecer contraseña',
            'Reset your password' => 'Restablecer tu contraseña',
            'Enter a new password below.' => 'Ingresá una nueva contraseña.',
            'New password' => 'Nueva contraseña',
            'Re-enter new password' => 'Repetir contraseña',
            'Your password has been reset successfully.' => 'Tu contraseña fue restablecida correctamente.',
            'Password reset email has been sent.' => 'Te enviamos un email para restablecer tu contraseña.',
            'Lost your password? Please enter your username or email address. You will receive a link to create a new password via email.'
                => '¿Olvidaste tu contraseña? Ingresá tu email y te enviaremos un link para crear una nueva.',

            // ═══ PASSWORD STRENGTH ═══
            'Very weak' => 'Muy débil',
            'Weak' => 'Débil',
            'Medium' => 'Media',
            'Strong' => 'Fuerte',
            'Very strong' => 'Muy fuerte',
            'Please enter a stronger password.' => 'Por favor usá una contraseña más segura.',
            'Hint: The password should be at least twelve characters long. To make it stronger, use upper and lower case letters, numbers, and symbols like ! " ? $ % ^ & ).'
                => 'Sugerencia: La contraseña debe ser de al menos doce caracteres. Para hacerla más fuerte usa mayúsculas y minúsculas, números y símbolos como ! " ? $ % ^ y ).',

            // ═══ MENSAJES ═══
            'Account details changed successfully.' => 'Datos actualizados correctamente.',
            'Address changed successfully.' => 'Dirección actualizada correctamente.',
            'Invalid username or email.' => 'Email inválido.',
            'Invalid email address.' => 'Email inválido.',

            // ═══ EMAILS ═══
            'Hi %s,' => 'Hola %s,',
            'Thanks for reading.' => 'Gracias.',
            'Someone has requested a new password for the following account on %1$s:' => 'Alguien solicitó restablecer la contraseña de la siguiente cuenta en %1$s:',
            'Username: %s' => 'Usuario: %s',
            'If you didn\'t make this request, just ignore this email. If you\'d like to proceed:' => 'Si no fuiste vos, ignorá este email. Si querés continuar:',

            // ═══ OTROS ═══
            'required' => 'requerido',
            'optional' => 'opcional',
            'Show password' => 'Mostrar',
            'Hide password' => 'Ocultar',

            // ═══ DIRECCIONES ═══
            'The following addresses will be used on the checkout page by default.'
                => 'Estas direcciones se usarán en el checkout.',
            'Billing Address' => 'Facturación',
            'Shipping Address' => 'Envío',

            // ═══ MIS DATOS ═══
            'This will be how your name will be displayed in the account section and in reviews'
                => 'Así aparecerá tu nombre en la cuenta y en las reseñas',
            'Password change' => 'Cambiar contraseña',
            'Current password' => 'Contraseña actual',
            'leave blank to leave unchanged' => 'dejá en blanco para no cambiar',
        ];
    }

    if (isset($t[$text])) {
        return $t[$text];
    }

    return $translated;
}

// ═══════════════════════════════════════════════════════════════════════════
// MENÚ EN ESPAÑOL
// ═══════════════════════════════════════════════════════════════════════════

add_filter('woocommerce_account_menu_items', 'duendes_menu_items_espanol', 99);

function duendes_menu_items_espanol($items) {
    $nuevos = [
        'dashboard' => 'Panel',
        'orders' => 'Mis Pedidos',
        'edit-address' => 'Direcciones',
        'edit-account' => 'Mis Datos',
        'customer-logout' => 'Cerrar Sesión',
    ];

    // Reemplazar completamente
    $resultado = [];
    foreach ($nuevos as $key => $label) {
        if (isset($items[$key])) {
            $resultado[$key] = $label;
        }
    }

    return $resultado;
}

// ═══════════════════════════════════════════════════════════════════════════
// TRADUCIR EMAILS DE WOOCOMMERCE
// ═══════════════════════════════════════════════════════════════════════════

// Cambiar asunto del email de reset (WooCommerce)
add_filter('woocommerce_reset_password_notification_email_subject', function($subject) {
    return 'Restablecer tu contraseña - Duendes del Uruguay';
});

// Cambiar contenido del email de reset password (WooCommerce)
add_filter('woocommerce_mail_content', 'duendes_traducir_email_content', 99);

function duendes_traducir_email_content($content) {
    $reemplazos = [
        'Reset your password' => 'Restablecer tu contraseña',
        'Hi ' => 'Hola ',
        'Someone has requested a new password for the following account on Duendes del Uruguay:'
            => 'Alguien solicitó restablecer la contraseña de esta cuenta en Duendes del Uruguay:',
        'Username:' => 'Usuario:',
        'If you didn\'t make this request, just ignore this email. If you\'d like to proceed, reset your password via the link below:'
            => 'Si no fuiste vos, ignorá este email. Si querés restablecer tu contraseña, hacé click acá:',
        'If you didn\'t make this request, just ignore this email. If you\'d like to proceed:'
            => 'Si no fuiste vos, ignorá este email. Si querés continuar:',
        'reset your password via the link below' => 'restablecé tu contraseña con este link',
        'Thanks for reading.' => 'Gracias.',
        'Reset your password' => 'Restablecer contraseña',
    ];

    foreach ($reemplazos as $en => $es) {
        $content = str_replace($en, $es, $content);
    }

    return $content;
}

// ═══════════════════════════════════════════════════════════════════════════
// TRADUCIR EMAIL DE RECUPERAR CONTRASEÑA DE WORDPRESS CORE
// ═══════════════════════════════════════════════════════════════════════════

// Asunto del email de WordPress core
add_filter('retrieve_password_title', function($title, $user_login, $user_data) {
    return 'Restablecer tu contraseña - Duendes del Uruguay';
}, 10, 3);

// Contenido del email de WordPress core
add_filter('retrieve_password_message', function($message, $key, $user_login, $user_data) {
    $site_name = 'Duendes del Uruguay';
    $reset_url = network_site_url("wp-login.php?action=rp&key=$key&login=" . rawurlencode($user_login), 'login');

    $nuevo_mensaje = "Hola,\n\n";
    $nuevo_mensaje .= "Alguien solicitó restablecer la contraseña de esta cuenta en $site_name.\n\n";
    $nuevo_mensaje .= "Si no fuiste vos, ignorá este email.\n\n";
    $nuevo_mensaje .= "Para restablecer tu contraseña, hacé click acá:\n\n";
    $nuevo_mensaje .= $reset_url . "\n\n";
    $nuevo_mensaje .= "Este link es válido por 24 horas.\n\n";
    $nuevo_mensaje .= "Gracias,\n";
    $nuevo_mensaje .= "Duendes del Uruguay\n";

    return $nuevo_mensaje;
}, 10, 4);

// Forzar remitente correcto para todos los emails de WordPress
add_filter('wp_mail_from', function($email) {
    return 'info@duendesdeluruguay.com';
});

add_filter('wp_mail_from_name', function($name) {
    return 'Duendes del Uruguay';
});

// ═══════════════════════════════════════════════════════════════════════════
// ESTILOS MI CUENTA
// ═══════════════════════════════════════════════════════════════════════════

add_action('wp_head', 'duendes_mi_cuenta_css', 99);

function duendes_mi_cuenta_css() {
    if (!function_exists('is_account_page') || !is_account_page()) return;
    ?>
    <style>
    /* ═══════════════════════════════════════════════════════════
       PALETA: Crema, Verde bosque, Dorado - Letras claras
       ═══════════════════════════════════════════════════════════ */

    /* Contenedor navegación - Verde bosque */
    .woocommerce-MyAccount-navigation {
        background: linear-gradient(180deg, #2d4a3e, #1e3329) !important;
        border-radius: 15px !important;
        padding: 25px !important;
        margin-bottom: 20px !important;
        border: 1px solid #3d6b54 !important;
    }

    /* Contenedor contenido - Crema claro */
    .woocommerce-MyAccount-content {
        background: linear-gradient(180deg, #f5f0e6, #ebe4d4) !important;
        border-radius: 15px !important;
        padding: 25px !important;
        margin-bottom: 20px !important;
        border: 1px solid #d4c9a8 !important;
    }

    /* Menú lateral */
    .woocommerce-MyAccount-navigation ul {
        list-style: none !important;
        padding: 0 !important;
        margin: 0 !important;
    }
    .woocommerce-MyAccount-navigation-link {
        margin-bottom: 8px !important;
    }
    .woocommerce-MyAccount-navigation-link a {
        display: block !important;
        padding: 14px 20px !important;
        color: #ffffff !important;
        text-decoration: none !important;
        border-radius: 10px !important;
        transition: all 0.3s ease !important;
        font-family: 'Cormorant Garamond', Georgia, serif !important;
        font-size: 17px !important;
        font-weight: 500 !important;
        background: rgba(255,255,255,0.1) !important;
        border: 1px solid rgba(255,255,255,0.2) !important;
    }
    .woocommerce-MyAccount-navigation-link a:hover {
        background: rgba(201,162,39,0.3) !important;
        border-color: #c9a227 !important;
        color: #fff !important;
    }
    .woocommerce-MyAccount-navigation-link.is-active a {
        background: linear-gradient(135deg, #c9a227, #a88b1f) !important;
        color: #1a1a1a !important;
        border-color: #c9a227 !important;
        font-weight: 700 !important;
    }

    /* Contenido - textos oscuros sobre crema */
    .woocommerce-MyAccount-content,
    .woocommerce-MyAccount-content p,
    .woocommerce-MyAccount-content span {
        color: #2a2a2a !important;
    }
    .woocommerce-MyAccount-content p {
        line-height: 1.7 !important;
    }
    .woocommerce-MyAccount-content a {
        color: #2d4a3e !important;
        font-weight: 600 !important;
    }
    .woocommerce-MyAccount-content a:hover {
        color: #c9a227 !important;
    }
    .woocommerce-MyAccount-content strong {
        color: #1a1a1a !important;
    }

    /* Títulos en contenido */
    .woocommerce-MyAccount-content h2,
    .woocommerce-MyAccount-content h3 {
        color: #2d4a3e !important;
        font-family: 'Cinzel', serif !important;
    }

    /* Direcciones - cajas */
    .woocommerce-MyAccount-content .woocommerce-Address,
    .woocommerce-MyAccount-content address {
        background: #fff !important;
        padding: 20px !important;
        border-radius: 10px !important;
        border: 1px solid #d4c9a8 !important;
        color: #2a2a2a !important;
    }
    .woocommerce-MyAccount-content .woocommerce-Address-title h3 {
        color: #2d4a3e !important;
        border-bottom: 2px solid #c9a227 !important;
        padding-bottom: 10px !important;
        margin-bottom: 15px !important;
    }

    /* Tabla pedidos */
    .woocommerce-orders-table {
        width: 100% !important;
        border-collapse: collapse !important;
        background: #fff !important;
        border-radius: 10px !important;
        overflow: hidden !important;
    }
    .woocommerce-orders-table th {
        background: #2d4a3e !important;
        color: #fff !important;
        padding: 15px !important;
        font-family: 'Cinzel', serif !important;
        text-transform: uppercase !important;
        font-size: 12px !important;
        letter-spacing: 1px !important;
    }
    .woocommerce-orders-table td {
        padding: 15px !important;
        border-bottom: 1px solid #e8e0cc !important;
        color: #2a2a2a !important;
    }
    .woocommerce-orders-table tr:hover td {
        background: #f9f6ef !important;
    }

    /* Botones */
    .woocommerce-MyAccount-content .button,
    .woocommerce-MyAccount-content button,
    .woocommerce-MyAccount-content input[type="submit"],
    .woocommerce form .button {
        background: linear-gradient(135deg, #c9a227, #a88b1f) !important;
        color: #fff !important;
        border: none !important;
        padding: 14px 30px !important;
        border-radius: 25px !important;
        font-family: 'Cinzel', serif !important;
        font-weight: 600 !important;
        text-transform: uppercase !important;
        font-size: 13px !important;
        letter-spacing: 1px !important;
        cursor: pointer !important;
        text-shadow: 0 1px 2px rgba(0,0,0,0.2) !important;
    }
    .woocommerce-MyAccount-content .button:hover,
    .woocommerce form .button:hover {
        background: linear-gradient(135deg, #2d4a3e, #1e3329) !important;
        transform: translateY(-2px) !important;
        box-shadow: 0 5px 20px rgba(45,74,62,0.4) !important;
    }

    /* Inputs - fondo claro */
    .woocommerce-MyAccount-content input[type="text"],
    .woocommerce-MyAccount-content input[type="email"],
    .woocommerce-MyAccount-content input[type="password"],
    .woocommerce-MyAccount-content select,
    .woocommerce-MyAccount-content textarea,
    .woocommerce form input[type="text"],
    .woocommerce form input[type="email"],
    .woocommerce form input[type="password"] {
        background: #fff !important;
        border: 2px solid #d4c9a8 !important;
        color: #2a2a2a !important;
        padding: 14px 16px !important;
        border-radius: 10px !important;
        width: 100% !important;
        font-size: 16px !important;
        font-family: 'Cormorant Garamond', Georgia, serif !important;
    }
    .woocommerce-MyAccount-content input:focus,
    .woocommerce-MyAccount-content select:focus,
    .woocommerce form input:focus {
        outline: none !important;
        border-color: #2d4a3e !important;
        box-shadow: 0 0 10px rgba(45,74,62,0.2) !important;
    }
    .woocommerce-MyAccount-content label,
    .woocommerce form label {
        color: #2d4a3e !important;
        font-size: 15px !important;
        font-weight: 600 !important;
        margin-bottom: 8px !important;
        display: block !important;
    }

    /* Mensajes */
    .woocommerce-message, .woocommerce-info {
        background: linear-gradient(135deg, #d4edda, #c3e6cb) !important;
        border-left: 4px solid #2d4a3e !important;
        color: #1e3329 !important;
        padding: 15px 20px !important;
        border-radius: 0 10px 10px 0 !important;
    }
    .woocommerce-error {
        background: linear-gradient(135deg, #f8d7da, #f5c6cb) !important;
        border-left: 4px solid #dc3545 !important;
        color: #721c24 !important;
        padding: 15px 20px !important;
        border-radius: 0 10px 10px 0 !important;
    }

    /* Password strength meter */
    .woocommerce-password-strength {
        padding: 10px 15px !important;
        border-radius: 8px !important;
        margin-top: 8px !important;
        font-size: 14px !important;
        font-weight: 600 !important;
    }
    .woocommerce-password-strength.short,
    .woocommerce-password-strength.bad {
        background: #f8d7da !important;
        color: #721c24 !important;
    }
    .woocommerce-password-strength.good {
        background: #fff3cd !important;
        color: #856404 !important;
    }
    .woocommerce-password-strength.strong {
        background: #d4edda !important;
        color: #155724 !important;
    }
    .woocommerce-password-hint {
        color: #6c757d !important;
        font-size: 13px !important;
        margin-top: 8px !important;
    }

    /* Mobile */
    @media (max-width: 768px) {
        .woocommerce-MyAccount-navigation,
        .woocommerce-MyAccount-content {
            padding: 18px !important;
        }
        .woocommerce-MyAccount-navigation-link a {
            padding: 12px 16px !important;
            font-size: 15px !important;
        }
    }
    </style>
    <?php
}

// ═══════════════════════════════════════════════════════════════════════════
// JAVASCRIPT PARA TRADUCCIONES DINÁMICAS
// ═══════════════════════════════════════════════════════════════════════════

add_action('wp_footer', 'duendes_traducciones_js', 99);

function duendes_traducciones_js() {
    if (!function_exists('is_account_page') || !is_account_page()) return;
    ?>
    <script>
    document.addEventListener('DOMContentLoaded', function() {
        // Traducciones de texto
        var traducciones = {
            'Hello': 'Hola',
            '(not': '(¿no sos',
            'Log out': 'Cerrar sesión',
            'recent orders': 'pedidos recientes',
            'shipping and billing addresses': 'direcciones de envío y facturación',
            'edit your password and account details': 'editar tu contraseña y datos de cuenta',
            'Your password has been reset successfully.': 'Tu contraseña fue restablecida correctamente.',
            'Enter a new password below.': 'Ingresá una nueva contraseña.',
            'New password': 'Nueva contraseña',
            'Re-enter new password': 'Repetir contraseña',
            'Save': 'Guardar',
            'Please enter a stronger password.': 'Por favor usá una contraseña más segura.',
            'Very weak': 'Muy débil',
            'Weak': 'Débil',
            'Medium': 'Media',
            'Strong': 'Fuerte',
            'The following addresses will be used on the checkout page by default.': 'Estas direcciones se usarán en el checkout.',
            'Billing Address': 'Facturación',
            'Shipping Address': 'Envío',
            'This will be how your name will be displayed in the account section and in reviews': 'Así aparecerá tu nombre en la cuenta y en las reseñas',
            'Password change': 'Cambiar contraseña',
            'Current password': 'Contraseña actual',
            'leave blank to leave unchanged': 'dejá en blanco para no cambiar',
            '(leave blank to leave unchanged)': '(dejá en blanco para no cambiar)'
        };

        function traducirTexto(elemento) {
            if (!elemento) return;

            var html = elemento.innerHTML;

            // Reemplazar textos
            for (var en in traducciones) {
                if (traducciones.hasOwnProperty(en)) {
                    html = html.split(en).join(traducciones[en]);
                }
            }

            // Fix especial para "Hello X (not X? Log out)"
            html = html.replace(/Hola\s+<strong>([^<]+)<\/strong>\s+\(¿no sos\s+<strong>([^<]+)<\/strong>\?\s*<a([^>]*)>Cerrar sesión<\/a>\)/g,
                'Hola <strong>$1</strong> (¿no sos <strong>$2</strong>? <a$3>Cerrar sesión</a>)');

            elemento.innerHTML = html;
        }

        // Traducir contenido principal
        var content = document.querySelector('.woocommerce-MyAccount-content');
        if (content) {
            traducirTexto(content);
        }

        // Traducir mensajes
        var mensajes = document.querySelectorAll('.woocommerce-message, .woocommerce-info, .woocommerce-error');
        mensajes.forEach(function(msg) {
            traducirTexto(msg);
        });

        // Traducir labels
        var labels = document.querySelectorAll('label');
        labels.forEach(function(label) {
            traducirTexto(label);
        });

        // Traducir botones
        var botones = document.querySelectorAll('button, input[type="submit"]');
        botones.forEach(function(btn) {
            if (btn.value === 'Save') btn.value = 'Guardar';
            if (btn.textContent === 'Save') btn.textContent = 'Guardar';
        });

        // Observar cambios para password strength
        var observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.target.classList && mutation.target.classList.contains('woocommerce-password-strength')) {
                    traducirTexto(mutation.target);
                }
            });
        });

        var passwordFields = document.querySelectorAll('.woocommerce-password-strength');
        passwordFields.forEach(function(field) {
            observer.observe(field, { childList: true, characterData: true, subtree: true });
        });
    });
    </script>
    <?php
}
