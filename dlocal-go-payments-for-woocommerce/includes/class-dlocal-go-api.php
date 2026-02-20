<?php
/**
 * DLocal Go API Client.
 *
 * Handles all communication with the dLocal Go API including payments,
 * refunds, and signature verification.
 *
 * @package DLocal_Go_Payments
 */

defined('ABSPATH') || exit;

/**
 * Class DLocal_Go_API
 *
 * API client for dLocal Go payment gateway.
 *
 */
class DLocal_Go_API
{

	use DLocal_Go_Logger;

	/**
	 * Sandbox API base URL.
	 *
	 * @var string
	 */
	const SANDBOX_API_URL = 'https://api-sbx.dlocalgo.com';

	/**
	 * Production API base URL.
	 *
	 * @var string
	 */
	const LIVE_API_URL = 'https://api.dlocalgo.com';

	/**
	 * API request timeout in seconds.
	 *
	 * @var int
	 */
	const API_TIMEOUT = 30;

	/**
	 * API key for authentication.
	 *
	 * @var string
	 */
	private $api_key;

	/**
	 * API secret for authentication and signature verification.
	 *
	 * @var string
	 */
	private $api_secret;

	/**
	 * Current environment ('sandbox' or 'live').
	 *
	 * @var string
	 */
	private $environment;

	/**
	 * Default country code (ISO 3166-1 alpha-2).
	 *
	 * @var string
	 */
	private $default_country;

	/**
	 * Constructor.
	 *
	 * @param string $api_key         The API key.
	 * @param string $api_secret      The API secret.
	 * @param string $environment     The environment ('sandbox' or 'live').
	 * @param string $default_country The default country code.
	 * @param bool   $debug           Whether to enable debug logging.
	 */
	public function __construct(
		$api_key,
		$api_secret,
		$environment = 'sandbox',
		$default_country = 'UY',
		$debug = false
	) {
		$this->api_key = $api_key;
		$this->api_secret = $api_secret;
		$this->environment = $environment;
		$this->default_country = $default_country;

		$this->init_logger('API', $debug);
	}

	/**
	 * Get the API URL based on the environment.
	 *
	 * @return string The API base URL.
	 */
	public function get_api_url()
	{
		return 'live' === $this->environment ? self::LIVE_API_URL : self::SANDBOX_API_URL;
	}

	/**
	 * Get the payments endpoint URL.
	 *
	 * @return string The full payments endpoint URL.
	 */
	public function get_payments_endpoint()
	{
		return $this->get_api_url() . '/v1/payments/';
	}

	/**
	 * Get the refunds endpoint URL.
	 *
	 * @return string The full refunds endpoint URL.
	 */
	public function get_refunds_endpoint()
	{
		return $this->get_api_url() . '/v1/refunds/';
	}

	/**
	 * Get the default country code.
	 *
	 * @return string The default country code (ISO 3166-1 alpha-2).
	 */
	public function get_default_country()
	{
		return $this->default_country;
	}

	/**
	 * Get the authentication header value.
	 *
	 * @return string The Bearer token for API authentication.
	 */
	public function get_auth_header()
	{
		return 'Bearer ' . $this->api_key . ':' . $this->api_secret;
	}

	/**
	 * Force HTTPS on URLs except for localhost.
	 *
	 * @param string $url The URL to convert.
	 * @return string The URL with HTTPS protocol (or unchanged for localhost).
	 */
	private function force_https($url)
	{
		if (strpos($url, 'localhost') !== false || strpos($url, '127.0.0.1') !== false) {
			return $url;
		}
		return preg_replace('/^http:/i', 'https:', $url);
	}

	/**
	 * Make a request to the dLocal Go API.
	 *
	 * @param string $endpoint The endpoint to request.
	 * @param string $method The HTTP method to use.
	 * @param array $body The body of the request.
	 * @return array|WP_Error The response from the API.
	 */
	private function request($endpoint, $method = 'POST', $body = array())
	{
		try {
			$args = array(
				'headers' => array(
					'Content-Type' => 'application/json; charset=utf-8',
					'Authorization' => $this->get_auth_header(),
					'Referer' => get_site_url(),
				),
				'method' => $method,
				'user-agent' => __CLASS__,
				'httpversion' => '1.1',
				'timeout' => self::API_TIMEOUT,
			);

			if ('POST' === $method && !empty($body)) {
				$args['body'] = wp_json_encode($body, JSON_UNESCAPED_UNICODE);
				$this->log('Request body: ' . $this->sanitize_for_log($body));
			}

			$this->log(sprintf('Request %s %s', $method, $endpoint));

			// Execute the request.
			$response = 'POST' === $method ? wp_safe_remote_post($endpoint, $args) : wp_safe_remote_get($endpoint, $args);

			if (is_wp_error($response)) {
				$this->log('Connection error: ' . $response->get_error_message(), 'error');
				return new WP_Error('connection_error', __('Error connecting to dLocal Go.', 'dlocal-go-payments-for-woocommerce'));
			}

			// Get the response body and code.
			$response_body = wp_remote_retrieve_body($response);
			$code = wp_remote_retrieve_response_code($response);

			$this->log('Response code: ' . $code);

			if (empty($response_body)) {
				$this->log('Empty response from dLocal Go', 'error');
				return new WP_Error('empty_response', __('dLocal Go returned no data.', 'dlocal-go-payments-for-woocommerce'));
			}

			$result = json_decode($response_body, true);

			if (json_last_error() !== JSON_ERROR_NONE) {
				$this->log('Invalid JSON response: ' . json_last_error_msg(), 'error');
				return new WP_Error('invalid_response', __('Invalid response from dLocal Go.', 'dlocal-go-payments-for-woocommerce'));
			}

			if (is_array($result)) {
				$this->log('Response: ' . $this->sanitize_for_log($result));
			}

			if ($code < 200 || $code >= 300) {
				$error_message = $this->parse_error_message($result);
				$this->log('API error (' . $code . '): ' . $error_message, 'error');
				return new WP_Error('api_error', $error_message);
			}

			return is_array($result) ? $result : array();

		} catch (Throwable $e) {
			$this->log('Critical error in API request: ' . $e->getMessage(), 'error');
			return new WP_Error('request_error', __('An error occurred while communicating with the payment gateway.', 'dlocal-go-payments-for-woocommerce'));
		}
	}

	/**
	 * Get the checkout URL for an order.
	 *
	 * @param int $order_id The ID of the order.
	 * @return array|WP_Error The response array or an error.
	 */
	public function get_checkout_url($order_id)
	{
		$order = wc_get_order($order_id);

		if (!$order) {
			return new WP_Error('invalid_order', __('Invalid order.', 'dlocal-go-payments-for-woocommerce'));
		}


		$success_url = $this->force_https($order->get_checkout_order_received_url());
		// https://mitienda.com/?wc-api=dlocal_go_back&order_id=1234&key=wc_order_abcd1234
		$back_url = $this->force_https(
			add_query_arg(
				array(
					'wc-api' => 'dlocal_go_back',
					'order_id' => $order->get_id(),
					'key' => $order->get_order_key(),
				),
				home_url('/')
			)
		);

		$body = array(
			'country' => $this->get_country_code($order),
			'currency' => $order->get_currency(),
			'amount' => (float) $order->get_total(),
			'order_id' => (string) $order->get_id(),
			'payer' => array_filter(array(
				'id' => $order->get_customer_id() > 0 ? (string) $order->get_customer_id() : null,
				'first_name' => $order->get_billing_first_name(),
				'last_name' => $order->get_billing_last_name(),
				'email' => $order->get_billing_email(),
				'phone' => $order->get_billing_phone(),
				'user_reference' => $order->get_customer_id() > 0 ? (string) $order->get_customer_id() : null,
			), function($v) { return null !== $v && '' !== $v; }),
			'description' => sprintf('Order #%s', $order->get_id()),
			'success_url' => $success_url,
			'notification_url' => $this->force_https(add_query_arg('wc-api', 'dlocal_go_ipn', home_url('/'))),
			'back_url' => $back_url,
			// 'sub_type' => 'WOO_COMMERCE',
			'url_source' => get_site_url(),
		);

		$this->log('dLocal Go Request for order #' . $order_id);

		$response = $this->request($this->get_payments_endpoint(), 'POST', $body);

		if (is_wp_error($response)) {
			return $response;
		}

		if (empty($response['redirect_url'])) {
			return new WP_Error('no_redirect', __('No redirect URL received.', 'dlocal-go-payments-for-woocommerce'));
		}

		return $response;
	}

	/**
	 * Get the country code for an order.
	 *
	 * Attempts to determine the country from billing address, then shipping,
	 * then falls back to default country or customer country.
	 *
	 * @param WC_Order $order The WooCommerce order.
	 * @return string The country code.
	 */
	public function get_country_code($order)
	{
		$country_code = $order->get_billing_country();

		if (empty($country_code)) {
			$country_code = $order->get_shipping_country();
		}

		if (empty($country_code)) {
			$country_code = $this->get_default_country();
		}

		if (empty($country_code)) {
			$country_code = WC()->customer ? WC()->customer->get_billing_country() : 'UY';
		}

		return $country_code;
	}

	/**
	 * Get the payment information for a payment ID.
	 *
	 * @param string $payment_id The ID of the payment.
	 * @return array|WP_Error The payment information or an error if the payment ID is invalid.
	 */
	public function get_payment_info($payment_id)
	{
		$response = $this->request($this->get_payments_endpoint() . $payment_id, 'GET');

		if (is_wp_error($response)) {
			return $response;
		}

		return array(
			'status' => isset($response['status']) ? $response['status'] : '',
			'order_id' => isset($response['order_id']) ? $response['order_id'] : '',
			'id' => isset($response['id']) ? $response['id'] : $payment_id,
		);
	}

	/**
	 * Refund a payment.
	 *
	 * @param string $transaction_id The ID of the payment.
	 * @param string $currency_code The currency code of the payment.
	 * @param float|null $amount The amount to refund.
	 * @return array|WP_Error The refund information or an error if the refund is invalid.
	 */
	public function refund($transaction_id, $currency_code, $amount = null)
	{
		if (empty($transaction_id)) {
			return new WP_Error('invalid_transaction', __('Invalid transaction ID.', 'dlocal-go-payments-for-woocommerce'));
		}

		if (null !== $amount && $amount <= 0) {
			return new WP_Error('invalid_amount', __('Refund amount must be greater than zero.', 'dlocal-go-payments-for-woocommerce'));
		}

		if (empty($currency_code)) {
			return new WP_Error('invalid_currency', __('Invalid currency code.', 'dlocal-go-payments-for-woocommerce'));
		}


		$body = array(
			'payment_id' => $transaction_id,
			'notification_url' => $this->force_https(add_query_arg('wc-api', 'dlocal_go_refund_ipn', home_url('/'))),
			'sub_type' => 'WOO_COMMERCE',
			'url_source' => get_site_url(),
			'currency' => $currency_code,
		);

		if (null !== $amount) {
			$body['amount'] = $amount;
		}

		$this->log(sprintf(
			'Refund request | Payment: %s | Amount: %s | Currency: %s',
			$transaction_id,
			$amount ?? 'FULL',
			$currency_code
		));

		$response = $this->request($this->get_refunds_endpoint(), 'POST', $body);

		if (is_wp_error($response)) {
			return $response;
		}

		if (empty($response['id'])) {
			return new WP_Error('invalid_refund_response', __('Invalid refund response.', 'dlocal-go-payments-for-woocommerce'));
		}

		return array(
			'status' => isset($response['status']) ? $response['status'] : '',
			'refund_id' => isset($response['id']) ? $response['id'] : '',
		);
	}


	/**
	 * Get a refund status by its ID.
	 *
	 * @param string $refund_id The ID of the refund.
	 * @return array|WP_Error The refund information or an error if the refund ID is invalid.
	 */
	public function get_refund($refund_id)
	{
		return $this->request($this->get_refunds_endpoint() . $refund_id, 'GET');
	}

	/**
	 * Parse error message from API response.
	 *
	 * Extracts the error message from various response formats.
	 *
	 * @param array|mixed $body The API response body.
	 * @return string The error message.
	 */
	private function parse_error_message($body)
	{
		if (!is_array($body)) {
			return __('Unknown error', 'dlocal-go-payments-for-woocommerce');
		}

		if (isset($body['message'])) {
			return $body['message'];
		}

		if (isset($body['error']['message'])) {
			return $body['error']['message'];
		}

		if (isset($body['error_description'])) {
			return $body['error_description'];
		}

		if (isset($body['error']) && is_string($body['error'])) {
			return $body['error'];
		}

		return __('Unknown error', 'dlocal-go-payments-for-woocommerce');
	}

	/**
	 * Verify the signature of an IPN notification.
	 *
	 * Uses HMAC-SHA256 to verify that the notification came from dLocal.
	 * Formula: HMAC('sha256', ApiKey + Payload, SecretKey)
	 *
	 * @param string $payload   The raw request body.
	 * @param string $signature The signature from the Authorization header.
	 * @return bool True if signature is valid, false otherwise.
	 */
	public function verify_signature($payload, $signature)
	{
		if (empty($signature) || empty($this->api_secret) || empty($this->api_key)) {
			return false;
		}

		// Signature = HMAC('sha256', ApiKey + Payload, SecretKey)
		$calculated_signature = hash_hmac('sha256', $this->api_key . $payload, $this->api_secret);

		return hash_equals($calculated_signature, $signature);
	}
}
