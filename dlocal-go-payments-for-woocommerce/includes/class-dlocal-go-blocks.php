<?php
/**
 * @package DLocal_Go_Payments
 */

defined( 'ABSPATH' ) || exit;

use Automattic\WooCommerce\Blocks\Payments\Integrations\AbstractPaymentMethodType;

final class DLocal_Go_Blocks extends AbstractPaymentMethodType {

	const ICON_URL = 'https://dashboard.dlocalgo.com/favicon.svg';

	protected $name = 'dlocal_go';
	protected $settings = array();
	/** @var WC_Gateway_DLocal_Go|null */
	private $gateway = null;

	public function initialize() {
		$this->settings = get_option( 'woocommerce_dlocal_go_settings', array() );

		$gateways      = WC()->payment_gateways->payment_gateways();
		$this->gateway = isset( $gateways['dlocal_go'] ) ? $gateways['dlocal_go'] : null;
	}

	public function is_active() {
		return ! empty( $this->settings['enabled'] ) && 'yes' === $this->settings['enabled'];
	}

	public function get_payment_method_script_handles() {
		$asset_path   = DLOCAL_GO_PLUGIN_PATH . 'assets/js/blocks.asset.php';
		$version      = DLOCAL_GO_VERSION;
		$dependencies = array( 'wc-blocks-registry', 'wc-settings', 'wp-element', 'wp-html-entities', 'wp-i18n' );

		if ( file_exists( $asset_path ) ) {
			$asset        = require $asset_path;
			$version      = isset( $asset['version'] ) ? $asset['version'] : $version;
			$dependencies = isset( $asset['dependencies'] ) ? $asset['dependencies'] : $dependencies;
		}

		wp_register_script( 'dlocal-go-blocks', DLOCAL_GO_PLUGIN_URL . 'assets/js/blocks.js', $dependencies, $version, true );

		wp_register_style( 'dlocal-go-blocks-style', false );
		wp_enqueue_style( 'dlocal-go-blocks-style' );
		wp_add_inline_style( 'dlocal-go-blocks-style', '
			.dlocal-go-icon,
			.wc-block-components-payment-method-label img.dlocal-go-icon {
				max-height: 70px !important;
				width: 70px !important;
				height: auto !important;
			}
			.dlocal-go-payment-label {
				display: flex !important;
				align-items: center !important;
				gap: 8px !important;
			}
		' );

		$title       = ! empty( $this->settings['title'] ) ? $this->settings['title'] : __( 'dLocal Go', 'dlocal-go-payments-for-woocommerce' );
		$description = ! empty( $this->settings['description'] ) ? $this->settings['description'] : __( 'Pay using dLocal Go Checkout.', 'dlocal-go-payments-for-woocommerce' );

		wp_localize_script( 'dlocal-go-blocks', 'dlocal_go_data', array(
			'title'       => $title,
			'description' => $description,
			'icon'        => self::ICON_URL,
			'supports'    => array( 'products' ),
		) );

		if ( function_exists( 'wp_set_script_translations' ) ) {
			wp_set_script_translations( 'dlocal-go-blocks', 'dlocal-go-payments-for-woocommerce', DLOCAL_GO_PLUGIN_PATH . 'languages' );
		}

		return array( 'dlocal-go-blocks' );
	}

	public function get_payment_method_data() {
		$title       = ! empty( $this->settings['title'] ) ? $this->settings['title'] : __( 'dLocal Go', 'dlocal-go-payments-for-woocommerce' );
		$description = ! empty( $this->settings['description'] ) ? $this->settings['description'] : __( 'Pay using dLocal Go Checkout.', 'dlocal-go-payments-for-woocommerce' );

		return array(
			'title'       => $title,
			'description' => $description,
			'supports'    => $this->get_supported_features(),
			'icon'        => self::ICON_URL,
		);
	}

	public function get_supported_features() {
		if ( null !== $this->gateway && is_array( $this->gateway->supports ) ) {
			return $this->gateway->supports;
		}
		return array( 'products' );
	}
}
