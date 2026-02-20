<?php
/**
 * @package DLocal_Go_Payments
 */

defined('ABSPATH') || exit;

class WC_Gateway_DLocal_Go extends WC_Payment_Gateway
{

	use DLocal_Go_Logger;

	/*
	 * DlocalGo Statuses.
	 */
	const STATUS_PENDING = 'PENDING';
	const STATUS_PAID = 'PAID';
	const STATUS_REJECTED = 'REJECTED';
	const STATUS_CANCELLED = 'CANCELLED';
	const STATUS_EXPIRED = 'EXPIRED';
	
	const REFUND_PENDING = 'PENDING';
	const REFUND_SUCCESS = 'SUCCESS';
	const REFUND_REJECTED = 'REJECTED';
	const REFUND_CANCELLED = 'CANCELLED';

	private DLocal_Go_API $api;
	private bool $production;
	private string $api_key_sandbox;
	private string $api_secret_sandbox;
	private string $api_key_production;
	private string $api_secret_production;
	private string $default_country;
	private bool $autocomplete_paid_orders;
	private bool $debug_mode;

	public function __construct()
	{
		$this->id = 'dlocal_go';
		$this->icon = 'https://dashboard.dlocalgo.com/favicon.svg';
		$this->has_fields = false;
		$this->method_title = __('dLocal Go', 'dlocal-go-payments-for-woocommerce');
		$this->method_description = __('Pay using dLocal Go Checkout.', 'dlocal-go-payments-for-woocommerce');
		
		$this->supports = array('products', 'refunds');

		$this->init_form_fields();
		$this->init_settings();

		// Initialize the settings.
		$this->title = $this->get_option('title', __('dLocal Go', 'dlocal-go-payments-for-woocommerce'));
		$this->description = $this->get_option('description', __('Pay using dLocal Go Checkout.', 'dlocal-go-payments-for-woocommerce'));
		$this->enabled = $this->get_option('enabled');
		$this->production = 'yes' === $this->get_option('production');
		$this->api_key_sandbox = $this->get_option('api_key_sandbox', '');
		$this->api_secret_sandbox = $this->get_option('api_secret_sandbox', '');
		$this->api_key_production = $this->get_option('api_key', '');
		$this->api_secret_production = $this->get_option('api_secret', '');
		$this->default_country = $this->get_option('default_country', 'UY');
		$this->autocomplete_paid_orders = 'yes' === $this->get_option('autocomplete_paid_orders');
		$this->debug_mode = 'yes' === $this->get_option('debug', 'no');

		$this->init_logger('Gateway', $this->debug_mode);
		$this->load_api_client();
		
		add_action('woocommerce_update_options_payment_gateways_' . $this->id, array($this, 'process_admin_options'));
		add_action('woocommerce_api_dlocal_go_ipn', array($this, 'check_ipn_response'));
		add_action('woocommerce_api_dlocal_go_back', array($this, 'handle_payment_back'));
		add_action('woocommerce_cancelled_order', array($this, 'cancel_order'));
		add_action('woocommerce_api_dlocal_go_refund_ipn', array($this, 'check_refund_ipn_response'));
		add_action('woocommerce_thankyou_' . $this->id, array($this, 'check_payment_status_on_return'));
		add_action('template_redirect', array($this, 'maybe_restore_cancelled_order_on_return'));
		if ($this->autocomplete_paid_orders) {
			add_action('woocommerce_payment_complete_order_status', array($this, 'auto_complete_paid_order'), 10, 3);
		}
	}

	/**
	 * Load the API client. Dynamically loads the API key and secret based on the environment.
	 */
	private function load_api_client()
	{
		$api_key = $this->production ? $this->api_key_production : $this->api_key_sandbox;
		$api_secret = $this->production ? $this->api_secret_production : $this->api_secret_sandbox;
		$environment = $this->production ? 'live' : 'sandbox';

		$this->api = new DLocal_Go_API(
			$api_key,
			$api_secret,
			$environment,
			$this->default_country,
			$this->debug_mode
		);
	}

	/**
	 * Initialize the form fields. Defines the fields that will be displayed in the gateway settings page.
	 */
	public function init_form_fields()
	{
		$countries_obj = new WC_Countries();
		$countries = $countries_obj->get_countries();

		$this->form_fields = array(
			'enabled' => array(
				'title' => __('Enable/Disable', 'dlocal-go-payments-for-woocommerce'),
				'type' => 'checkbox',
				'label' => __('Enable dLocal Go', 'dlocal-go-payments-for-woocommerce'),
				'default' => 'no',
			),
			'production' => array(
				'title' => __('Environment', 'dlocal-go-payments-for-woocommerce'),
				'type' => 'checkbox',
				'label' => __('Enable production mode', 'dlocal-go-payments-for-woocommerce'),
				'default' => 'no',
				'description' => __('When disabled, sandbox mode is used for testing.', 'dlocal-go-payments-for-woocommerce'),
			),
			'title' => array(
				'title' => __('Title', 'dlocal-go-payments-for-woocommerce'),
				'type' => 'text',
				'description' => __('Title shown to the customer during checkout.', 'dlocal-go-payments-for-woocommerce'),
				'default' => __('dLocal Go', 'dlocal-go-payments-for-woocommerce'),
				'desc_tip' => true,
			),
			'description' => array(
				'title' => __('Description', 'dlocal-go-payments-for-woocommerce'),
				'type' => 'textarea',
				'description' => __('Description shown to the customer during checkout.', 'dlocal-go-payments-for-woocommerce'),
				'default' => __('Pay using dLocal Go Checkout.', 'dlocal-go-payments-for-woocommerce'),
				'desc_tip' => true,
			),
			'api_key_sandbox' => array(
				'title' => __('API Key', 'dlocal-go-payments-for-woocommerce'),
				'type' => 'password',
				'description' => __('Your dLocal Go API Key for sandbox.', 'dlocal-go-payments-for-woocommerce'),
				'default' => '',
				'desc_tip' => true,
			),
			'api_secret_sandbox' => array(
				'title' => __('API Secret', 'dlocal-go-payments-for-woocommerce'),
				'type' => 'password',
				'description' => __('Your dLocal Go API Secret for sandbox.', 'dlocal-go-payments-for-woocommerce'),
				'default' => '',
				'desc_tip' => true,
			),
			'api_key' => array(
				'title' => __('API Key', 'dlocal-go-payments-for-woocommerce'),
				'type' => 'password',
				'description' => __('Your dLocal Go API Key for production.', 'dlocal-go-payments-for-woocommerce'),
				'default' => '',
				'desc_tip' => true,
			),
			'api_secret' => array(
				'title' => __('API Secret', 'dlocal-go-payments-for-woocommerce'),
				'type' => 'password',
				'description' => __('Your dLocal Go API Secret for production.', 'dlocal-go-payments-for-woocommerce'),
				'default' => '',
				'desc_tip' => true,
			),
			'default_country' => array(
				'title' => __('Default country', 'dlocal-go-payments-for-woocommerce'),
				'type' => 'select',
				'description' => __('Country to use when it cannot be determined from billing or shipping address.', 'dlocal-go-payments-for-woocommerce'),
				'default' => 'UY',
				'desc_tip' => true,
				'options' => array('' => __('None', 'dlocal-go-payments-for-woocommerce')) + $countries,
			),
			'autocomplete_paid_orders' => array(
				'title' => __('Auto-complete orders', 'dlocal-go-payments-for-woocommerce'),
				'type' => 'checkbox',
				'label' => __('Automatically complete orders when payment is received', 'dlocal-go-payments-for-woocommerce'),
				'default' => 'no',
			),
			'debug' => array(
				'title' => __('Debug mode', 'dlocal-go-payments-for-woocommerce'),
				'type' => 'checkbox',
				'label' => __('Enable logging', 'dlocal-go-payments-for-woocommerce'),
				'default' => 'no',
				'description' => sprintf(
					__('Logs are saved in: %s', 'dlocal-go-payments-for-woocommerce'),
					'<code>' . WC_Log_Handler_File::get_log_file_path('dlocal-go') . '</code>'
				),
			),
		);
	}

	/**
	 * Display the gateway settings page. UI elements are styled using CSS.
	 */
	public function admin_options()
	{
		wp_enqueue_style('dlocal-go-admin', DLOCAL_GO_PLUGIN_URL . 'assets/css/admin.css', array(), DLOCAL_GO_VERSION);
		wp_enqueue_script('dlocal-go-admin', DLOCAL_GO_PLUGIN_URL . 'assets/js/admin.js', array('jquery'), DLOCAL_GO_VERSION, true);

		$env_class = $this->production ? 'production' : 'sandbox';
		$env_text = $this->production ? __('Production', 'dlocal-go-payments-for-woocommerce') : __('Sandbox', 'dlocal-go-payments-for-woocommerce');
		?>
		<div class="dlocal-go-admin-wrap">
			<div class="dlocal-go-admin-header">
				<img
					src="https://docs.dlocalgo.com/integration-api/~gitbook/image?url=https%3A%2F%2F1358172413-files.gitbook.io%2F%7E%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252FBY3HUq038UcwcSNNW0jr%252Ficon%252FDzrRJtlRP6ne4MjYXb5w%252Fdgo%2520%282%29.png%3Falt%3Dmedia%26token%3Dd85589b1-d267-41d8-a03b-35ed06d81826&width=32&dpr=4&quality=100&sign=34b68cc4&sv=2"
					alt="dLocal Go">
				<div>
					<h2>dLocal Go <span
							class="dlocal-go-environment-badge <?php echo esc_attr($env_class); ?>"><?php echo esc_html($env_text); ?></span>
					</h2>
					<p><?php esc_html_e('Payment gateway for growing businesses', 'dlocal-go-payments-for-woocommerce'); ?></p>
				</div>
			</div>

			<div class="dlocal-go-tabs">
				<div class="dlocal-go-tab active" data-tab="general">
					<?php esc_html_e('General', 'dlocal-go-payments-for-woocommerce'); ?></div>
				<div class="dlocal-go-tab" data-tab="credentials">
					<?php esc_html_e('API Credentials', 'dlocal-go-payments-for-woocommerce'); ?></div>
				<div class="dlocal-go-tab" data-tab="advanced">
					<?php esc_html_e('Advanced', 'dlocal-go-payments-for-woocommerce'); ?></div>
			</div>

			<div id="dlocal-go-tab-general" class="dlocal-go-tab-content active">
				<table class="form-table">
					<?php
					$this->generate_settings_html(array(
						'enabled' => $this->form_fields['enabled'],
						'production' => $this->form_fields['production'],
						'title' => $this->form_fields['title'],
						'description' => $this->form_fields['description'],
					));
					?>
				</table>
				<p class="dlocal-go-faq-link">
					<a href="https://helpcenter.dlocalgo.com/es/" target="_blank" rel="noopener noreferrer">
						<?php esc_html_e('Frequently Asked Questions', 'dlocal-go-payments-for-woocommerce'); ?>
					</a>
				</p>
			</div>

			<div id="dlocal-go-tab-credentials" class="dlocal-go-tab-content">
				<h3 class="dlocal-go-section-title">
					<?php esc_html_e('Sandbox Credentials', 'dlocal-go-payments-for-woocommerce'); ?></h3>
				<div class="dlocal-go-info-box">
					<a href="https://dashboard-sbx.dlocalgo.com/payment-integration" target="_blank" rel="noopener noreferrer">
						<?php esc_html_e('Get your Sandbox API credentials', 'dlocal-go-payments-for-woocommerce'); ?>
					</a>
					<br>
					<p>
						<?php esc_html_e('Use sandbox credentials for testing. No real transactions will be processed.', 'dlocal-go-payments-for-woocommerce'); ?>
					</p>
				</div>
				<table class="form-table">
					<?php
					$this->generate_settings_html(array(
						'api_key_sandbox' => $this->form_fields['api_key_sandbox'],
						'api_secret_sandbox' => $this->form_fields['api_secret_sandbox'],
					));
					?>
				</table>

				<h3 class="dlocal-go-section-title">
					<?php esc_html_e('Production Credentials', 'dlocal-go-payments-for-woocommerce'); ?></h3>
				<div class="dlocal-go-info-box">
					<p>
						<a href="https://dashboard.dlocalgo.com/payment-integration" target="_blank" rel="noopener noreferrer">
							<?php esc_html_e('Get your Production API credentials', 'dlocal-go-payments-for-woocommerce'); ?>
						</a>
						<br>
						<?php esc_html_e('Use production credentials for live transactions. Make sure to enable Production mode in the General tab.', 'dlocal-go-payments-for-woocommerce'); ?>
					</p>
				</div>
				<table class="form-table">
					<?php
					$this->generate_settings_html(array(
						'api_key' => $this->form_fields['api_key'],
						'api_secret' => $this->form_fields['api_secret'],
					));
					?>
				</table>
			</div>

			<div id="dlocal-go-tab-advanced" class="dlocal-go-tab-content">
				<table class="form-table">
					<?php
					$this->generate_settings_html(array(
						'default_country' => $this->form_fields['default_country'],
						'autocomplete_paid_orders' => $this->form_fields['autocomplete_paid_orders'],
						'debug' => $this->form_fields['debug'],
					));
					?>
				</table>

			</div>
		</div>
		<?php
	}

	/**
	 * Check if the payment method is available.
	 *
	 * @return bool True if the payment method is available, false otherwise.
	 */
	public function is_available()
	{
		if ('yes' !== $this->enabled) {
			return false;
		}

		$has_sandbox = !empty($this->api_key_sandbox) && !empty($this->api_secret_sandbox);
		$has_production = !empty($this->api_key_production) && !empty($this->api_secret_production);

		return $this->production ? $has_production : $has_sandbox;
	}

	/**
	 * Check if the order can be refunded.
	 *
	 * @param WC_Order $order The order to check.
	 * @return bool True if the order can be refunded, false otherwise.
	 */
	public function can_refund_order($order)
	{
		if (null === $order || $order->get_payment_method() !== $this->id) {
			return false;
		}

		return !empty($this->get_payment_id_for_refund($order));
	}

	/**
	 * Get the payment ID for a refund.
	 *
	 * @param WC_Order $order The order to get the payment ID for.
	 * @return string The payment ID.
	 */
	private function get_payment_id_for_refund($order)
	{
		$transaction_id = $order->get_transaction_id();
		if (!empty($transaction_id)) {
			return $transaction_id;
		}

		$payment_id = $order->get_meta('_dlocal_go_payment_id');
		if (!empty($payment_id)) {
			return (string) $payment_id;
		}

		// Fallback: search in post meta directly (compatibility)
		$payment_id = get_post_meta($order->get_id(), '_dlocal_go_payment_id', true);
		return (string) $payment_id;
	}

	/**
	 * Extract signature from Authorization header sent by dLocal Go.
	 * Format: "V2-HMAC-SHA256, Signature: <signature>"
	 *
	 * @return string The signature or empty string if not found.
	 */
	private function extract_signature_from_authorization_header()
	{
		$auth_header = '';

		// Try to get Authorization header from different sources.
		if (isset($_SERVER['HTTP_AUTHORIZATION'])) {
			$auth_header = sanitize_text_field(wp_unslash($_SERVER['HTTP_AUTHORIZATION']));
		} elseif (function_exists('getallheaders')) {
			$headers = getallheaders();
			if (isset($headers['Authorization'])) {
				$auth_header = sanitize_text_field($headers['Authorization']);
			}
		}

		if (empty($auth_header)) {
			return '';
		}

		// Extract signature from format: "V2-HMAC-SHA256, Signature: <signature>"
		if (preg_match('/Signature:\s*([a-f0-9]+)/i', $auth_header, $matches)) {
			return $matches[1];
		}

		return '';
	}

	/**
	 * Process the payment and return the result.
	 *
	 * @param int $order_id The ID of the order.
	 * @return array The result of the payment.
	 */
	public function process_payment($order_id)
	{
		try {
			$order = wc_get_order($order_id);

			if (!$order) {
				wc_add_notice(__('Invalid order.', 'dlocal-go-payments-for-woocommerce'), 'error');
				return array('result' => 'failure');
			}

			$response = $this->api->get_checkout_url((int) $order_id);

			if (is_wp_error($response)) {
				$this->log('API Error: ' . $response->get_error_message(), 'error');
				wc_add_notice($this->get_user_friendly_error($response->get_error_message()), 'error');
				return array('result' => 'failure');
			}

			$redirect_url = isset($response['redirect_url']) ? $response['redirect_url'] : '';

			if (empty($redirect_url)) {
				$this->log('No redirect URL in response', 'error');
				wc_add_notice(__('Payment gateway error. Please try again or choose another payment method.', 'dlocal-go-payments-for-woocommerce'), 'error');
				return array('result' => 'failure');
			}

			if (isset($response['id'])) {
				$order->update_meta_data('_dlocal_go_payment_id', $response['id']);
				$order->update_meta_data('_dlocal_go_environment', $this->production ? 'live' : 'sandbox');
				$order->add_order_note(sprintf(__('Payment initiated in dLocal Go. Payment ID: %s', 'dlocal-go-payments-for-woocommerce'), $response['id']));
				$order->save();
			}

			WC()->cart->empty_cart();

			return array(
				'result' => 'success',
				'redirect' => $redirect_url,
			);

		} catch (Throwable $e) {
			$this->log(sprintf('Critical error: %s | File: %s:%d', $e->getMessage(), $e->getFile(), $e->getLine()), 'critical');

			if (defined('WP_DEBUG') && WP_DEBUG) {
				wc_add_notice(sprintf('Debug: %s in %s:%d', $e->getMessage(), basename($e->getFile()), $e->getLine()), 'error');
			} else {
				wc_add_notice(__('An error occurred while processing your payment. Please try again.', 'dlocal-go-payments-for-woocommerce'), 'error');
			}

			return array('result' => 'failure');
		}
	}

	/*
	 * Get a user-friendly error message for an API error.
	 *
	 * @param string $api_error The API error message.
	 * @return string The user-friendly error message.
	 */
	private function get_user_friendly_error($api_error)
	{
		$api_error_lower = strtolower($api_error);

		if (strpos($api_error_lower, 'amount') !== false && (strpos($api_error_lower, 'minimum') !== false || strpos($api_error_lower, 'low') !== false || strpos($api_error_lower, 'small') !== false)) {
			return __('The order amount is too low for this payment method. Please add more items to your cart.', 'dlocal-go-payments-for-woocommerce');
		}

		if (strpos($api_error_lower, 'currency') !== false) {
			return __('The selected currency is not supported by this payment method.', 'dlocal-go-payments-for-woocommerce');
		}

		if (strpos($api_error_lower, 'country') !== false) {
			return __('This payment method is not available for your country.', 'dlocal-go-payments-for-woocommerce');
		}

		if (strpos($api_error_lower, 'unauthorized') !== false || strpos($api_error_lower, 'authentication') !== false) {
			return __('Payment gateway configuration error. Please contact support.', 'dlocal-go-payments-for-woocommerce');
		}

		return __('Payment could not be processed. Please try again or choose another payment method.', 'dlocal-go-payments-for-woocommerce');
	}

	/**
	 * Cancel the order.
	 *
	 * @param int $order_id The ID of the order.
	 */
	public function cancel_order($order_id)
	{
		$order = wc_get_order($order_id);

		if (!$order || $order->get_payment_method() !== $this->id) {
			return;
		}

		$this->log('Order cancelled: #' . $order_id);

		foreach ($order->get_items() as $item) {
			if (!$item instanceof WC_Order_Item_Product) {
				continue;
			}

			$product_id = $item->get_product_id();
			$quantity = $item->get_quantity();
			$variation_id = $item->get_variation_id();
			$variation = $variation_id ? wc_get_product_variation_attributes($variation_id) : array();

			WC()->cart->add_to_cart($product_id, $quantity, $variation_id, $variation);
		}

		if (!wp_doing_ajax()) {
			wp_safe_redirect(wc_get_checkout_url());
			exit;
		}
	}

	/**
	 * Process the refund.
	 *
	 * @param int $order_id The ID of the order.
	 * @param float|null $amount The amount to refund.
	 * @param string $reason The reason for the refund.
	 * @return WP_Error|bool The result of the refund.
	 */
	public function process_refund($order_id, $amount = null, $reason = '')
	{
		try {
			$order = wc_get_order($order_id);

			if (!$order || $order->get_payment_method() !== $this->id) {
				return new WP_Error('error', __('Refund failed: Invalid order.', 'dlocal-go-payments-for-woocommerce'));
			}

			$payment_id = $this->get_payment_id_for_refund($order);

			if (empty($payment_id)) {
				return new WP_Error('error', __('Refund failed: Payment ID not found.', 'dlocal-go-payments-for-woocommerce'));
			}

			// Verify payment status in dLocal before attempting refund.
			$payment_info = $this->api->get_payment_info($payment_id);

			if (is_wp_error($payment_info)) {
				return new WP_Error('error', __('Refund failed: Could not verify payment status.', 'dlocal-go-payments-for-woocommerce'));
			}

			if (!isset($payment_info['status']) || self::STATUS_PAID !== $payment_info['status']) {
				return new WP_Error('not_completed', __('Refund failed: The payment has not been completed yet. Wait for the payment to be confirmed by dLocal.', 'dlocal-go-payments-for-woocommerce'));
			}

			if (null !== $amount) {
				$amount = (float) $amount;

				if ($amount <= 0) {
					return new WP_Error('invalid_amount', __('Refund amount must be greater than zero.', 'dlocal-go-payments-for-woocommerce'));
				}
			}

			$refund = $this->api->refund($payment_id, $order->get_currency(), $amount);

			if (is_wp_error($refund)) {
				$order->add_order_note(sprintf(__('Refund failed: %s', 'dlocal-go-payments-for-woocommerce'), $refund->get_error_message()));
				return $refund;
			}

			$order->add_order_note(sprintf(
				__('Refund processed via dLocal Go. Refund ID: %1$s - Amount: %2$s - Status: %3$s - Reason: %4$s', 'dlocal-go-payments-for-woocommerce'),
				$refund['refund_id'],
				wc_price($amount),
				$refund['status'],
				$reason
			));

			if (self::REFUND_PENDING === $refund['status']) {
				return new WP_Error('pending', __('Refund created successfully, pending confirmation.', 'dlocal-go-payments-for-woocommerce'));
			}

			return self::REFUND_SUCCESS === $refund['status'];

		} catch (Exception $e) {
			$this->log('Error in refund: ' . $e->getMessage(), 'error');
			return new WP_Error('refund_error', __('Error processing refund.', 'dlocal-go-payments-for-woocommerce'));
		}
	}

	/**
	 * Handle IPN (Instant Payment Notification) from dLocal.
	 */
	public function check_ipn_response()
	{
		$body = file_get_contents('php://input');
		$this->validate_ipn_request($body);

		$payment_id = $this->extract_payment_id_from_body($body);
		$this->log('IPN received for payment_id: ' . $payment_id);

		$payment_info = $this->api->get_payment_info($payment_id);
		if (is_wp_error($payment_info)) {
			$this->log('Error getting payment info: ' . $payment_info->get_error_message(), 'error');
			$this->ipn_exit(400);
		}

		$order = $this->find_order_by_payment($payment_info['order_id'], $payment_id);
		if (!$order) {
			$this->log('Order not found for payment_id: ' . $payment_id, 'error');
			$this->ipn_exit(404, 'Order not found');
		}

		$status = $payment_info['status'];

		if ($this->is_ipn_already_processed($order, $payment_id, $status)) {
			$this->ipn_exit(200, 'Already processed');
		}

		$this->process_ipn_status($order, $status, $payment_id);
		$this->ipn_exit(200, 'OK');
	}

	/**
	 * Validate IPN request body and signature.
	 *
	 * @param string $body Raw request body.
	 */
	private function validate_ipn_request($body)
	{
		if (empty($body)) {
			$this->log('IPN received with empty body', 'error');
			$this->ipn_exit(400, 'Empty body');
		}

		$signature = $this->extract_signature_from_authorization_header();

		if (empty($signature)) {
			$this->log('IPN rejected: Missing signature in production mode', 'error');
			$this->ipn_exit(401, 'Missing signature');
		}

		if (!empty($signature) && !$this->api->verify_signature($body, $signature)) {
			$this->log('IPN signature verification failed', 'error');
			$this->ipn_exit(403, 'Invalid signature');
		}
	}

	/**
	 * Extract and validate payment ID from IPN body.
	 *
	 * @param string $body Raw request body.
	 * @return string Payment ID.
	 */
	private function extract_payment_id_from_body($body)
	{
		$params = json_decode($body, true);

		if (json_last_error() !== JSON_ERROR_NONE || !is_array($params)) {
			$this->log('IPN received with invalid JSON', 'error');
			$this->ipn_exit(400, 'Invalid JSON');
		}

		$payment_id = sanitize_text_field($params['payment_id'] ?? $params['id'] ?? '');

		if (empty($payment_id) || !preg_match('/^[A-Za-z0-9_-]+$/', $payment_id)) {
			$this->log('IPN received with invalid payment_id', 'error');
			$this->ipn_exit(400, 'Invalid payment_id');
		}

		return $payment_id;
	}

	/**
	 * Find order by order ID or payment ID meta.
	 *
	 * @param string $order_id   Order ID from payment info.
	 * @param string $payment_id Payment ID to search by meta.
	 * @return WC_Order|null
	 */
	private function find_order_by_payment($order_id, $payment_id)
	{
		$order = wc_get_order($order_id);

		if (!$order) {
			$orders = wc_get_orders(array(
				'meta_key' => '_dlocal_go_payment_id',
				'meta_value' => $payment_id,
				'limit' => 1,
			));
			$order = !empty($orders) ? $orders[0] : null;
		}

		return $order;
	}

	/**
	 * Check if IPN was already processed. Prevents duplicate processing of the same IPN.
	 *
	 * @param WC_Order $order      The order.
	 * @param string   $payment_id Payment ID.
	 * @param string   $status     Payment status.
	 * @return bool
	 */
	private function is_ipn_already_processed($order, $payment_id, $status)
	{
		$lock_key = '_dlocal_go_ipn_lock_' . $payment_id;
		$should_reprocess = self::STATUS_PAID === $status && $order->has_status('cancelled');

		if ($order->get_meta($lock_key) === $status && !$should_reprocess) {
			return true;
		}

		$order->update_meta_data($lock_key, $status);
		$order->save();

		return false;
	}

	/**
	 * Process order based on payment status.
	 *
	 * @param WC_Order $order      The order.
	 * @param string   $status     Payment status from dLocal.
	 * @param string   $payment_id Payment ID.
	 */
	private function process_ipn_status($order, $status, $payment_id)
	{
		switch ($status) {
			case self::STATUS_PAID:
				$this->handle_paid_status($order, $payment_id);
				break;

			case self::STATUS_REJECTED:
				if (!$order->has_status('failed')) {
					$order->update_status('failed', __('Payment rejected via dLocal Go.', 'dlocal-go-payments-for-woocommerce'));
				}
				break;

			case self::STATUS_CANCELLED:
				if (!$order->has_status('cancelled')) {
					$order->update_status('cancelled', __('Payment cancelled via dLocal Go.', 'dlocal-go-payments-for-woocommerce'));
				}
				break;

			case self::STATUS_EXPIRED:
				if (!$order->has_status('failed')) {
					$order->update_status('failed', __('Payment expired via dLocal Go.', 'dlocal-go-payments-for-woocommerce'));
				}
				break;
		}
	}

	/**
	 * Handle PAID status from IPN.
	 *
	 * @param WC_Order $order      The order.
	 * @param string   $payment_id Payment ID.
	 */
	private function handle_paid_status($order, $payment_id)
	{
		if ($order->has_status('cancelled')) {
			$this->restore_cancelled_order($order, $payment_id);
		} elseif (!$order->is_paid()) {
			$order->payment_complete($payment_id);
			$order->add_order_note(__('Payment completed via dLocal Go.', 'dlocal-go-payments-for-woocommerce'));
		}
	}

	/**
	 * Restore a cancelled order that received payment.
	 *
	 * @param WC_Order $order      The order.
	 * @param string   $payment_id Payment ID.
	 */
	private function restore_cancelled_order($order, $payment_id)
	{
		$this->log("Payment received for cancelled order #{$order->get_id()}. Restoring to processing.", 'warning');

		$order->set_transaction_id($payment_id);
		$order->set_date_paid(current_time('timestamp', true));
		$order->set_status('processing', __('Payment completed via dLocal Go. Order restored from cancelled status.', 'dlocal-go-payments-for-woocommerce'));
		$order->save();

		$this->log("Order #{$order->get_id()} status after restore: " . $order->get_status());

		do_action('woocommerce_payment_complete', $order->get_id());
	}

	/**
	 * Exit IPN request with status code and message.
	 *
	 * @param int    $code    HTTP status code.
	 * @param string $message Response message.
	 */
	private function ipn_exit($code, $message = '')
	{
		status_header($code);
		exit($message);
	}

	/**
	 * Check the refund IPN response.
	 *
	 * @return void
	 */
	public function check_refund_ipn_response()
	{
		$body = file_get_contents('php://input');

		if (empty($body)) {
			$this->log('Refund IPN received with empty body', 'error');
			status_header(400);
			exit('Empty body');
		}

		$signature = $this->extract_signature_from_authorization_header();

		if ($this->production && empty($signature)) {
			$this->log('Refund IPN rejected: Missing signature in production mode', 'error');
			status_header(401);
			exit('Missing signature');
		}

		if (!empty($signature) && !$this->api->verify_signature($body, $signature)) {
			$this->log('Refund IPN signature verification failed', 'error');
			status_header(403);
			exit('Invalid signature');
		}

		$params = json_decode($body, true);

		if (json_last_error() !== JSON_ERROR_NONE || !is_array($params)) {
			$this->log('Refund IPN received with invalid JSON', 'error');
			status_header(400);
			exit('Invalid JSON');
		}

		$refund_id = isset($params['id']) ? sanitize_text_field($params['id']) : '';

		if (empty($refund_id)) {
			$this->log('Refund IPN received without refund_id', 'error');
			status_header(400);
			exit('Missing refund_id');
		}

		$this->log('Refund IPN received for refund_id: ' . $refund_id);

		$refund = $this->api->get_refund($refund_id);

		if (is_wp_error($refund)) {
			$this->log('Error getting refund info: ' . $refund->get_error_message(), 'error');
			status_header(400);
			exit;
		}

		$order = wc_get_order(isset($refund['order_id']) ? $refund['order_id'] : '');

		if (!$order) {
			$this->log('Order not found for refund_id: ' . $refund_id, 'error');
			status_header(404);
			exit('Order not found');
		}

		$existing_refunds = $order->get_meta('_dlocal_go_processed_refunds');
		if (!is_array($existing_refunds)) {
			$existing_refunds = array();
		}

		if (in_array($refund_id, $existing_refunds, true)) {
			status_header(200);
			exit('Already processed');
		}

		$refund_status = isset($refund['status']) ? $refund['status'] : '';
		$refund_amount = isset($refund['amount']) ? (float) $refund['amount'] : 0.0;

		$order->add_order_note(sprintf(
			__('Refund ID: %1$s - Status: %2$s - Amount: %3$s', 'dlocal-go-payments-for-woocommerce'),
			$refund_id,
			$refund_status,
			wc_price($refund_amount)
		));

		if (self::REFUND_SUCCESS === $refund_status && $refund_amount > 0) {
			wc_create_refund(array(
				'amount' => $refund_amount,
				'reason' => __('Refund via dLocal Go', 'dlocal-go-payments-for-woocommerce'),
				'order_id' => $order->get_id(),
				'line_items' => array(),
				'refund_payment' => false,
			));

			$existing_refunds[] = $refund_id;
			$order->update_meta_data('_dlocal_go_processed_refunds', $existing_refunds);
			$order->save();
		}

		status_header(200);
		exit('OK');
	}

	/**
	 * Auto complete the paid order.
	 *
	 * @param string $status The status of the order.
	 * @param int $order_id The ID of the order.
	 * @param WC_Order $order The order.
	 * @return string The status of the order.
	 */
	public function auto_complete_paid_order($status, $order_id, $order)
	{
		if ($order->get_status() === 'cancelled') {
			return $status;
		}

		if ('processing' === $status && $order->get_payment_method() === $this->id) {
			return 'completed';
		}

		return $status;
	}

	public function check_payment_status_on_return($order_id)
	{
		$order = wc_get_order($order_id);

		if (!$order) {
			return;
		}

		// Skip if order is already paid (processing or completed).
		if ($order->is_paid()) {
			return;
		}

		$payment_id = $order->get_meta('_dlocal_go_payment_id');

		if (empty($payment_id)) {
			return;
		}

		$this->log('Checking payment status on return for order #' . $order_id . ' (current status: ' . $order->get_status() . ')');

		$payment_info = $this->api->get_payment_info($payment_id);

		if (is_wp_error($payment_info)) {
			$this->log('Error checking payment status: ' . $payment_info->get_error_message(), 'error');
			return;
		}

		$status = $payment_info['status'];
		$this->log('Payment status for order #' . $order_id . ': ' . $status);

		if (self::STATUS_PAID === $status) {
			// Handle cancelled orders that received payment.
			if ($order->has_status('cancelled')) {
				$this->log("Restoring cancelled order #{$order_id} to processing (payment completed).", 'warning');

				// Set transaction data first.
				$order->set_transaction_id($payment_id);
				$order->set_date_paid(current_time('timestamp', true));
				$order->save();

				// Force status change using direct database update if needed.
				global $wpdb;

				// Check if using HPOS (High-Performance Order Storage).
				if (class_exists('\Automattic\WooCommerce\Utilities\OrderUtil') && \Automattic\WooCommerce\Utilities\OrderUtil::custom_orders_table_usage_is_enabled()) {
					// HPOS enabled - use order object.
					$order->set_status('processing');
					$order->add_order_note(__('Payment completed via dLocal Go. Order restored from cancelled status.', 'dlocal-go-payments-for-woocommerce'));
					$order->save();
				} else {
					// Legacy post-based storage - update directly.
					$wpdb->update(
						$wpdb->posts,
						array('post_status' => 'wc-processing'),
						array('ID' => $order_id)
					);
					clean_post_cache($order_id);
					$order->add_order_note(__('Payment completed via dLocal Go. Order restored from cancelled status.', 'dlocal-go-payments-for-woocommerce'));
				}

				// Verify the change.
				$updated_order = wc_get_order($order_id);
				$this->log("Order #{$order_id} status after restore: " . $updated_order->get_status());

				do_action('woocommerce_payment_complete', $order_id);

				// Redirect to refresh the page with the new order status.
				wp_safe_redirect($updated_order->get_checkout_order_received_url());
				exit;
			} elseif (!$order->is_paid()) {
				$order->payment_complete($payment_id);
				$order->add_order_note(__('Payment confirmed via status check on return.', 'dlocal-go-payments-for-woocommerce'));
			}
		} elseif (self::STATUS_REJECTED === $status && !$order->has_status('failed')) {
			$order->update_status('failed', __('Payment rejected.', 'dlocal-go-payments-for-woocommerce'));
		} elseif (self::STATUS_CANCELLED === $status && !$order->has_status('cancelled')) {
			$order->update_status('cancelled', __('Payment cancelled.', 'dlocal-go-payments-for-woocommerce'));
		} elseif (self::STATUS_EXPIRED === $status && !$order->has_status('failed')) {
			$order->update_status('failed', __('Payment expired.', 'dlocal-go-payments-for-woocommerce'));
		}
	}

	/**
	 * Restore cancelled orders on return from dLocal if payment was completed.
	 * This runs before the thank you page renders.
	 */
	public function maybe_restore_cancelled_order_on_return()
	{
		// Check if we're on the order-received page.
		if (!is_wc_endpoint_url('order-received')) {
			return;
		}

		// Get order ID from URL.
		global $wp;
		$order_id = isset($wp->query_vars['order-received']) ? absint($wp->query_vars['order-received']) : 0;

		if (!$order_id) {
			return;
		}

		$order = wc_get_order($order_id);

		if (!$order) {
			return;
		}

		// Only process cancelled orders paid with dLocal Go.
		if (!$order->has_status('cancelled') || $order->get_payment_method() !== $this->id) {
			return;
		}

		$payment_id = $order->get_meta('_dlocal_go_payment_id');

		if (empty($payment_id)) {
			return;
		}

		$this->log("Checking cancelled order #{$order_id} on return - payment_id: {$payment_id}");

		// Check payment status in dLocal.
		$payment_info = $this->api->get_payment_info($payment_id);

		if (is_wp_error($payment_info)) {
			$this->log('Error checking payment status: ' . $payment_info->get_error_message(), 'error');
			return;
		}

		$status = $payment_info['status'];
		$this->log("Payment status for cancelled order #{$order_id}: {$status}");

		// If payment is completed, restore the order.
		if (self::STATUS_PAID === $status) {
			$this->log("Restoring cancelled order #{$order_id} to processing.", 'warning');

			// Set transaction data.
			$order->set_transaction_id($payment_id);
			$order->set_date_paid(current_time('timestamp', true));
			$order->save();

			// Force status change.
			global $wpdb;

			if (class_exists('\Automattic\WooCommerce\Utilities\OrderUtil') && \Automattic\WooCommerce\Utilities\OrderUtil::custom_orders_table_usage_is_enabled()) {
				$order->set_status('processing');
				$order->add_order_note(__('Payment completed via dLocal Go. Order restored from cancelled status.', 'dlocal-go-payments-for-woocommerce'));
				$order->save();
			} else {
				$wpdb->update(
					$wpdb->posts,
					array('post_status' => 'wc-processing'),
					array('ID' => $order_id)
				);
				clean_post_cache($order_id);

				// Reload order and add note.
				$order = wc_get_order($order_id);
				$order->add_order_note(__('Payment completed via dLocal Go. Order restored from cancelled status.', 'dlocal-go-payments-for-woocommerce'));
			}

			do_action('woocommerce_payment_complete', $order_id);

			// Redirect to refresh with new status.
			wp_safe_redirect($order->get_checkout_order_received_url());
			exit;
		}
	}

	/**
	 * Handle when customer clicks back from dLocal payment page.
	 * Checks payment status first - if paid, redirects to success page.
	 * Otherwise restores the cart and redirects to checkout.
	 */
	public function handle_payment_back()
	{
		$order_id = isset($_GET['order_id']) ? absint($_GET['order_id']) : 0;
		$order_key = isset($_GET['key']) ? sanitize_text_field(wp_unslash($_GET['key'])) : '';

		if (!$order_id) {
			wp_safe_redirect(wc_get_cart_url());
			exit;
		}

		$order = wc_get_order($order_id);

		if (!$order || $order->get_order_key() !== $order_key) {
			wp_safe_redirect(wc_get_cart_url());
			exit;
		}

		// If order is already paid, redirect to success page.
		if ($order->is_paid()) {
			wp_safe_redirect($order->get_checkout_order_received_url());
			exit;
		}

		// Check payment status in dLocal before assuming customer didn't pay.
		$payment_id = $order->get_meta('_dlocal_go_payment_id');
		if (!empty($payment_id)) {
			$payment_info = $this->api->get_payment_info($payment_id);

			if (!is_wp_error($payment_info) && isset($payment_info['status'])) {
				if (self::STATUS_PAID === $payment_info['status']) {
					// Payment was completed - process it and redirect to success.
					$this->log("Payment completed for order #{$order_id} (detected on back URL). Redirecting to success.");
					$order->payment_complete($payment_id);
					$order->add_order_note(__('Payment completed via dLocal Go.', 'dlocal-go-payments-for-woocommerce'));
					wp_safe_redirect($order->get_checkout_order_received_url());
					exit;
				}
			}
		}

		// Only restore cart for pending orders.
		if (!$order->has_status('pending')) {
			wp_safe_redirect(wc_get_cart_url());
			exit;
		}

		$this->log("Customer returned without payment for order #{$order_id}. Restoring cart.");

		// Restore cart items from order.
		WC()->cart->empty_cart();

		foreach ($order->get_items() as $item) {
			$product_id = $item->get_product_id();
			$quantity = $item->get_quantity();
			$variation_id = $item->get_variation_id();
			$variations = array();

			if ($variation_id) {
				$variation = wc_get_product($variation_id);
				if ($variation) {
					$variations = $variation->get_variation_attributes();
				}
			}

			WC()->cart->add_to_cart($product_id, $quantity, $variation_id, $variations);
		}

		// Cancel the pending order.
		$order->update_status('cancelled', __('Customer returned from payment page without completing payment.', 'dlocal-go-payments-for-woocommerce'));

		// Add notice for customer.
		wc_add_notice(__('Payment was not completed. Your cart has been restored.', 'dlocal-go-payments-for-woocommerce'), 'notice');

		// Redirect to checkout.
		wp_safe_redirect(wc_get_checkout_url());
		exit;
	}

	/*
	 * Get the API client.
	 *
	 * @return DLocal_Go_API The API client.
	 */
	public function get_api()
	{
		return $this->api;
	}
}
