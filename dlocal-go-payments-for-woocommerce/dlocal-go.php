<?php
/**
 * Plugin Name: dLocal Go Payments
 * Description: This plugin adds dLocal Go Payment Gateway for WooCommerce to allow customers access to multiple local payment methods in LATAM.
 * Version: 2.0.5
 * Author: dLocal
 * Text Domain: dlocal-go-payments-for-woocommerce
 * Domain Path: /languages
 * Requires at least: 5.8
 * Requires PHP: 7.0
 * WC requires at least: 5.0
 * WC tested up to: 8.4
 *
 * @package DLocal_Go_Payments
 */

defined( 'ABSPATH' ) || exit;

define( 'DLOCAL_GO_VERSION', '2.0.5' );
define( 'DLOCAL_GO_PLUGIN_FILE', __FILE__ );
define( 'DLOCAL_GO_PLUGIN_PATH', plugin_dir_path( __FILE__ ) );
define( 'DLOCAL_GO_PLUGIN_URL', plugin_dir_url( __FILE__ ) );

/**
 * Check if WooCommerce is installed and activated.
 *
 * @return bool True if WooCommerce is installed and activated, false otherwise.
 */
function dlocal_go_check_woocommerce() {
	if ( ! class_exists( 'WooCommerce' ) ) {
		add_action( 'admin_notices', 'dlocal_go_woocommerce_missing_notice' );
		return false;
	}
	return true;
}

/**
 * Display a notice if WooCommerce is not installed or activated.
 *
 */
function dlocal_go_woocommerce_missing_notice() {
	echo '<div class="error"><p>' . esc_html__( 'dLocal Go Payments requires WooCommerce to work. Please install and activate WooCommerce.', 'dlocal-go-payments-for-woocommerce' ) . '</p></div>';
}


/**
 * Initialize the plugin.
 *
 * Loads required files and initializes the payment gateway.
 *
 */
function dlocal_go_init() {
	if ( ! dlocal_go_check_woocommerce() ) {
		return;
	}

	require_once DLOCAL_GO_PLUGIN_PATH . 'includes/trait-dlocal-go-logger.php';
	require_once DLOCAL_GO_PLUGIN_PATH . 'includes/class-dlocal-go-api.php';
	require_once DLOCAL_GO_PLUGIN_PATH . 'includes/class-wc-gateway-dlocal-go.php';
}
// Priority 11 to ensure WooCommerce is loaded first.
add_action( 'plugins_loaded', 'dlocal_go_init', 11 );


/**
 * Add the dLocal Go gateway to WooCommerce.
 *
 *
 * @param array $gateways List of registered payment gateways.
 * @return array Modified list of payment gateways.
 */
function dlocal_go_add_gateway( $gateways ) {
	$gateways[] = 'WC_Gateway_DLocal_Go';
	return $gateways;
}
add_filter( 'woocommerce_payment_gateways', 'dlocal_go_add_gateway' );

/**
 * Declare compatibility with WooCommerce Custom Order Tables.
 */
add_action( 'before_woocommerce_init', function() {
	if ( class_exists( \Automattic\WooCommerce\Utilities\FeaturesUtil::class ) ) {
		\Automattic\WooCommerce\Utilities\FeaturesUtil::declare_compatibility( 'custom_order_tables', __FILE__, true );
	}
} );

/**
 * Declare compatibility with WooCommerce Checkout Blocks.
 */
function dlocal_go_blocks_support() {
	if ( class_exists( 'Automattic\WooCommerce\Blocks\Payments\Integrations\AbstractPaymentMethodType' ) ) {
		require_once DLOCAL_GO_PLUGIN_PATH . 'includes/class-dlocal-go-blocks.php';

		add_action( 'woocommerce_blocks_payment_method_type_registration', function( $registry ) {
			$registry->register( new DLocal_Go_Blocks() );
		} );
	}
}
add_action( 'woocommerce_blocks_loaded', 'dlocal_go_blocks_support' );


/**
 * Add settings link to plugin action links.
 *
 *
 * @param array $links Plugin action links.
 * @return array Modified plugin action links.
 */
function dlocal_go_plugin_links( $links ) {
	$settings_link = sprintf( '<a href="%s">%s</a>', admin_url( 'admin.php?page=wc-settings&tab=checkout&section=dlocal_go' ), __( 'Settings', 'dlocal-go-payments-for-woocommerce' ) );
	array_unshift( $links, $settings_link );
	return $links;
}
add_filter( 'plugin_action_links_' . plugin_basename( __FILE__ ), 'dlocal_go_plugin_links' );


/**
 * Load plugin text domain for translations.
 *
 */
function dlocal_go_load_textdomain() {
	load_plugin_textdomain( 'dlocal-go-payments-for-woocommerce', false, dirname( plugin_basename( __FILE__ ) ) . '/languages' );
}
add_action( 'init', 'dlocal_go_load_textdomain' );


/**
 * Display admin notice if store is not using HTTPS.
 *
 * Production payments require HTTPS. This notice warns administrators
 * when the store is not properly configured.
 *
 */
function dlocal_go_https_notice() {
	if ( is_ssl() ) {
		return;
	}

	$host = isset( $_SERVER['HTTP_HOST'] ) ? sanitize_text_field( wp_unslash( $_SERVER['HTTP_HOST'] ) ) : '';
	if ( strpos( $host, 'localhost' ) !== false || strpos( $host, '127.0.0.1' ) !== false ) {
		return;
	}

	echo '<div class="notice notice-error"><p>' . esc_html__( 'dLocal Go Payments: Your store must have HTTPS enabled to process payments in production.', 'dlocal-go-payments-for-woocommerce' ) . '</p></div>';
}
add_action( 'admin_notices', 'dlocal_go_https_notice' );
