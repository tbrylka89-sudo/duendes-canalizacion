<?php
/**
 * Plugin Name: Duendes - Mi Cuenta
 * Description: Estilos y traducciones para la página Mi Cuenta de WooCommerce
 * Version: 1.0.1
 * Author: Duendes del Uruguay
 */

if (!defined('ABSPATH')) exit;

// ═══════════════════════════════════════════════════════════════════════════
// 1. TRADUCCIONES ADICIONALES
// ═══════════════════════════════════════════════════════════════════════════

add_filter('gettext', 'duendes_mi_cuenta_traducciones', 25, 3);

function duendes_mi_cuenta_traducciones($translated, $text, $domain) {
    static $traducciones = null;

    if ($traducciones === null) {
        $traducciones = array(
            // Menu lateral
            'Dashboard' => 'Panel',
            'Orders' => 'Mis Pedidos',
            'Downloads' => 'Descargas',
            'Addresses' => 'Direcciones',
            'Account details' => 'Mis Datos',
            'Logout' => 'Cerrar sesion',
            'Log out' => 'Cerrar sesion',
            'Edit' => 'Editar',
            // Saludo
            'Hello %s (not %s? %sLog out%s)' => 'Hola %s (no sos %s? %sCerrar sesion%s)',
            // Texto dashboard
            'From your account dashboard you can view your recent orders, manage your shipping and billing addresses, and edit your password and account details.' => 'Desde aca podes ver tus pedidos, gestionar tus direcciones y actualizar tus datos.',
            // Tabla pedidos
            'Order' => 'Pedido',
            'Date' => 'Fecha',
            'Status' => 'Estado',
            'Total' => 'Total',
            'Actions' => 'Acciones',
            'View' => 'Ver',
            'No order has been made yet.' => 'Todavia no tenes pedidos.',
            'Browse products' => 'Explorar guardianes',
            // Estados
            'Processing' => 'En preparacion',
            'Completed' => 'Completado',
            'On hold' => 'En espera',
            'Pending' => 'Pendiente',
            'Pending payment' => 'Pendiente de pago',
            'Cancelled' => 'Cancelado',
            'Refunded' => 'Reembolsado',
            'Failed' => 'Fallido',
            // Direcciones
            'Billing address' => 'Direccion de facturacion',
            'Shipping address' => 'Direccion de envio',
            'Add' => 'Agregar',
            'You have not set up this type of address yet.' => 'Todavia no configuraste esta direccion.',
            'The following addresses will be used on the checkout page by default.' => 'Estas direcciones se usaran en el checkout.',
            // Datos cuenta
            'Display name' => 'Nombre a mostrar',
            'First name' => 'Nombre',
            'Last name' => 'Apellido',
            'Email address' => 'Email',
            'Current password (leave blank to leave unchanged)' => 'Contrasena actual (deja en blanco si no queres cambiarla)',
            'New password (leave blank to leave unchanged)' => 'Nueva contrasena (deja en blanco si no queres cambiarla)',
            'Confirm new password' => 'Confirmar nueva contrasena',
            'Save changes' => 'Guardar cambios',
            'Password change' => 'Cambiar contrasena',
            // Mensajes
            'Account details changed successfully.' => 'Datos actualizados correctamente',
            'Address changed successfully.' => 'Direccion actualizada',
            // Links
            'recent orders' => 'pedidos recientes',
            'shipping and billing addresses' => 'direcciones de envio y facturacion',
            'edit your password and account details' => 'editar tu contrasena y datos',
        );
    }

    if (isset($traducciones[$text])) {
        return $traducciones[$text];
    }

    return $translated;
}

// ═══════════════════════════════════════════════════════════════════════════
// 2. ESTILOS CSS
// ═══════════════════════════════════════════════════════════════════════════

add_action('wp_head', 'duendes_mi_cuenta_estilos', 50);

function duendes_mi_cuenta_estilos() {
    if (!function_exists('is_account_page')) return;
    if (!is_account_page()) return;

    echo '<style id="duendes-mi-cuenta-css">
    body.woocommerce-account {
        background: #0a0a0a !important;
    }
    body.woocommerce-account .woocommerce {
        max-width: 1100px;
        margin: 0 auto;
        padding: 40px 20px;
    }
    body.woocommerce-account .woocommerce-MyAccount-navigation {
        background: linear-gradient(145deg, #1a1a1a, #0f0f0f) !important;
        border: 1px solid rgba(201, 162, 39, 0.3) !important;
        border-radius: 15px !important;
        padding: 25px !important;
        margin-bottom: 30px;
    }
    body.woocommerce-account .woocommerce-MyAccount-navigation ul {
        list-style: none !important;
        margin: 0 !important;
        padding: 0 !important;
        background: transparent !important;
    }
    body.woocommerce-account .woocommerce-MyAccount-navigation ul li {
        margin: 0 !important;
        padding: 0 !important;
        border-bottom: 1px solid rgba(255, 255, 255, 0.05) !important;
        background: transparent !important;
    }
    body.woocommerce-account .woocommerce-MyAccount-navigation ul li:last-child {
        border-bottom: none !important;
    }
    body.woocommerce-account .woocommerce-MyAccount-navigation ul li::before {
        display: none !important;
    }
    body.woocommerce-account .woocommerce-MyAccount-navigation ul li a {
        display: block !important;
        padding: 14px 18px !important;
        color: rgba(255, 255, 255, 0.75) !important;
        text-decoration: none !important;
        font-family: Cinzel, serif !important;
        font-size: 14px !important;
        letter-spacing: 1px !important;
        transition: all 0.3s ease !important;
        border-radius: 8px !important;
        background: transparent !important;
    }
    body.woocommerce-account .woocommerce-MyAccount-navigation ul li a:hover {
        color: #c9a227 !important;
        background: rgba(201, 162, 39, 0.1) !important;
        padding-left: 22px !important;
    }
    body.woocommerce-account .woocommerce-MyAccount-navigation ul li.is-active a {
        color: #c9a227 !important;
        background: rgba(201, 162, 39, 0.15) !important;
        border-left: 3px solid #c9a227 !important;
    }
    body.woocommerce-account .woocommerce-MyAccount-content {
        background: linear-gradient(145deg, #1a1a1a, #0f0f0f) !important;
        border: 1px solid rgba(201, 162, 39, 0.2) !important;
        border-radius: 15px !important;
        padding: 35px !important;
        color: rgba(255, 255, 255, 0.85) !important;
        font-family: Cormorant Garamond, Georgia, serif !important;
        font-size: 16px !important;
        line-height: 1.7 !important;
    }
    body.woocommerce-account .woocommerce-MyAccount-content p {
        color: rgba(255, 255, 255, 0.75) !important;
        margin-bottom: 20px !important;
        background: transparent !important;
    }
    body.woocommerce-account .woocommerce-MyAccount-content a {
        color: #c9a227 !important;
        text-decoration: none !important;
    }
    body.woocommerce-account .woocommerce-MyAccount-content a:hover {
        color: #e8d48b !important;
        text-decoration: underline !important;
    }
    body.woocommerce-account .woocommerce-MyAccount-content mark {
        background: transparent !important;
        color: inherit !important;
    }
    body.woocommerce-account h2,
    body.woocommerce-account h3 {
        color: #c9a227 !important;
        font-family: Cinzel, serif !important;
        font-weight: 500 !important;
        letter-spacing: 1px;
        margin-bottom: 20px;
    }
    body.woocommerce-account table.woocommerce-orders-table,
    body.woocommerce-account table.shop_table {
        width: 100%;
        border-collapse: collapse;
        background: transparent;
        border: 1px solid rgba(201, 162, 39, 0.2);
        border-radius: 10px;
        overflow: hidden;
    }
    body.woocommerce-account table.woocommerce-orders-table th,
    body.woocommerce-account table.shop_table th {
        background: rgba(201, 162, 39, 0.1);
        color: #c9a227;
        font-family: Cinzel, serif;
        font-size: 13px;
        font-weight: 500;
        letter-spacing: 1px;
        text-transform: uppercase;
        padding: 15px;
        text-align: left;
        border-bottom: 1px solid rgba(201, 162, 39, 0.2);
    }
    body.woocommerce-account table.woocommerce-orders-table td,
    body.woocommerce-account table.shop_table td {
        padding: 15px;
        color: rgba(255, 255, 255, 0.8);
        font-family: Cormorant Garamond, serif;
        font-size: 15px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        background: transparent;
    }
    body.woocommerce-account table tr:hover td {
        background: rgba(201, 162, 39, 0.05);
    }
    body.woocommerce-account .woocommerce-Button,
    body.woocommerce-account .button,
    body.woocommerce-account button[type="submit"],
    body.woocommerce-account input[type="submit"] {
        background: linear-gradient(135deg, #c9a227 0%, #8b6914 100%) !important;
        color: #0a0a0a !important;
        border: none !important;
        padding: 14px 28px !important;
        border-radius: 25px !important;
        font-family: Cinzel, serif !important;
        font-size: 13px !important;
        font-weight: 600 !important;
        letter-spacing: 1px !important;
        text-transform: uppercase !important;
        cursor: pointer !important;
        transition: all 0.3s ease !important;
        box-shadow: 0 4px 15px rgba(201, 162, 39, 0.3) !important;
    }
    body.woocommerce-account .woocommerce-Button:hover,
    body.woocommerce-account .button:hover {
        transform: translateY(-2px) !important;
        box-shadow: 0 6px 20px rgba(201, 162, 39, 0.4) !important;
    }
    body.woocommerce-account .woocommerce-orders-table .button {
        background: transparent !important;
        color: #c9a227 !important;
        border: 1px solid #c9a227 !important;
        padding: 8px 18px !important;
        font-size: 11px !important;
        box-shadow: none !important;
    }
    body.woocommerce-account input[type="text"],
    body.woocommerce-account input[type="email"],
    body.woocommerce-account input[type="password"],
    body.woocommerce-account input[type="tel"],
    body.woocommerce-account select,
    body.woocommerce-account textarea {
        background: rgba(255, 255, 255, 0.05) !important;
        border: 1px solid rgba(201, 162, 39, 0.3) !important;
        border-radius: 8px !important;
        padding: 12px 15px !important;
        color: rgba(255, 255, 255, 0.9) !important;
        font-family: Cormorant Garamond, serif !important;
        font-size: 15px !important;
        width: 100% !important;
        box-sizing: border-box !important;
    }
    body.woocommerce-account input:focus,
    body.woocommerce-account select:focus,
    body.woocommerce-account textarea:focus {
        outline: none !important;
        border-color: #c9a227 !important;
        box-shadow: 0 0 0 2px rgba(201, 162, 39, 0.2) !important;
    }
    body.woocommerce-account label {
        color: rgba(255, 255, 255, 0.7) !important;
        font-family: Cinzel, serif !important;
        font-size: 13px !important;
        letter-spacing: 0.5px !important;
        margin-bottom: 8px !important;
        display: block !important;
    }
    body.woocommerce-account .woocommerce-Addresses {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: 25px;
    }
    body.woocommerce-account .woocommerce-Address {
        background: rgba(0, 0, 0, 0.3);
        border: 1px solid rgba(201, 162, 39, 0.15);
        border-radius: 12px;
        padding: 25px;
    }
    body.woocommerce-account .woocommerce-Address-title {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 15px;
        padding-bottom: 12px;
        border-bottom: 1px solid rgba(201, 162, 39, 0.15);
    }
    body.woocommerce-account .woocommerce-Address address {
        font-style: normal;
        color: rgba(255, 255, 255, 0.7);
        line-height: 1.8;
    }
    body.woocommerce-account .u-columns {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 40px;
    }
    body.woocommerce-account .u-column1,
    body.woocommerce-account .u-column2 {
        background: linear-gradient(145deg, #1a1a1a, #0f0f0f);
        border: 1px solid rgba(201, 162, 39, 0.2);
        border-radius: 15px;
        padding: 35px;
    }
    body.woocommerce-account .woocommerce-message,
    body.woocommerce-account .woocommerce-info {
        background: rgba(201, 162, 39, 0.1) !important;
        border: 1px solid rgba(201, 162, 39, 0.3) !important;
        border-left: 4px solid #c9a227 !important;
        color: rgba(255, 255, 255, 0.9) !important;
        padding: 15px 20px !important;
        border-radius: 8px !important;
        margin-bottom: 25px !important;
    }
    body.woocommerce-account .woocommerce-error {
        background: rgba(180, 50, 50, 0.1) !important;
        border: 1px solid rgba(180, 50, 50, 0.3) !important;
        border-left: 4px solid #b43232 !important;
        color: rgba(255, 255, 255, 0.9) !important;
        padding: 15px 20px !important;
        border-radius: 8px !important;
    }
    body.woocommerce-account .woocommerce-MyAccount-navigation ul li.woocommerce-MyAccount-navigation-link--downloads {
        display: none;
    }
    @media (min-width: 769px) {
        body.woocommerce-account .woocommerce {
            display: grid;
            grid-template-columns: 250px 1fr;
            gap: 30px;
            align-items: start;
        }
        body.woocommerce-account .woocommerce-MyAccount-navigation {
            position: sticky;
            top: 100px;
            margin-bottom: 0;
        }
    }
    @media (max-width: 768px) {
        body.woocommerce-account .woocommerce {
            padding: 20px 15px;
        }
        body.woocommerce-account .woocommerce-MyAccount-navigation {
            padding: 15px;
        }
        body.woocommerce-account .woocommerce-MyAccount-content {
            padding: 25px 20px;
        }
    }
    </style>';
}
