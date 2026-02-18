<?php
/**
 * Plugin Name: Duendes - Desactivar Emails WooCommerce
 * Description: Desactiva TODOS los emails nativos de WooCommerce para usar FunnelKit
 * Version: 1.0
 */

if (!defined('ABSPATH')) exit;

// Desactivar TODOS los emails de WooCommerce
add_action('woocommerce_email', function($email_class) {
    // Remover todos los hooks de emails
    remove_action('woocommerce_low_stock_notification', array($email_class, 'low_stock'));
    remove_action('woocommerce_no_stock_notification', array($email_class, 'no_stock'));
    remove_action('woocommerce_product_on_backorder_notification', array($email_class, 'backorder'));

    // Desactivar emails de pedidos
    remove_action('woocommerce_order_status_pending_to_processing_notification', array($email_class->emails['WC_Email_New_Order'], 'trigger'));
    remove_action('woocommerce_order_status_pending_to_completed_notification', array($email_class->emails['WC_Email_New_Order'], 'trigger'));
    remove_action('woocommerce_order_status_pending_to_on-hold_notification', array($email_class->emails['WC_Email_New_Order'], 'trigger'));
    remove_action('woocommerce_order_status_failed_to_processing_notification', array($email_class->emails['WC_Email_New_Order'], 'trigger'));
    remove_action('woocommerce_order_status_failed_to_completed_notification', array($email_class->emails['WC_Email_New_Order'], 'trigger'));
    remove_action('woocommerce_order_status_failed_to_on-hold_notification', array($email_class->emails['WC_Email_New_Order'], 'trigger'));

    // Emails de cliente
    if (isset($email_class->emails['WC_Email_Customer_Processing_Order'])) {
        remove_action('woocommerce_order_status_pending_to_processing_notification', array($email_class->emails['WC_Email_Customer_Processing_Order'], 'trigger'));
        remove_action('woocommerce_order_status_pending_to_on-hold_notification', array($email_class->emails['WC_Email_Customer_Processing_Order'], 'trigger'));
    }

    if (isset($email_class->emails['WC_Email_Customer_Completed_Order'])) {
        remove_action('woocommerce_order_status_completed_notification', array($email_class->emails['WC_Email_Customer_Completed_Order'], 'trigger'));
    }

    if (isset($email_class->emails['WC_Email_Customer_On_Hold_Order'])) {
        remove_action('woocommerce_order_status_pending_to_on-hold_notification', array($email_class->emails['WC_Email_Customer_On_Hold_Order'], 'trigger'));
        remove_action('woocommerce_order_status_failed_to_on-hold_notification', array($email_class->emails['WC_Email_Customer_On_Hold_Order'], 'trigger'));
    }
});

// Método alternativo: filtrar la lista de emails habilitados
add_filter('woocommerce_email_enabled_new_order', '__return_false');
add_filter('woocommerce_email_enabled_cancelled_order', '__return_false');
add_filter('woocommerce_email_enabled_failed_order', '__return_false');
add_filter('woocommerce_email_enabled_customer_on_hold_order', '__return_false');
add_filter('woocommerce_email_enabled_customer_processing_order', '__return_false');
add_filter('woocommerce_email_enabled_customer_completed_order', '__return_false');
add_filter('woocommerce_email_enabled_customer_refunded_order', '__return_false');
add_filter('woocommerce_email_enabled_customer_invoice', '__return_false');
add_filter('woocommerce_email_enabled_customer_note', '__return_false');
add_filter('woocommerce_email_enabled_customer_reset_password', '__return_false');
add_filter('woocommerce_email_enabled_customer_new_account', '__return_false');

// Log para debug (opcional)
add_action('init', function() {
    if (defined('WP_DEBUG') && WP_DEBUG) {
        error_log('Duendes: Emails de WooCommerce DESACTIVADOS - Usando FunnelKit');
    }
});
