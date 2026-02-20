<?php
/**
 * @package DLocal_Go_Payments
 */

defined( 'ABSPATH' ) || exit;

trait DLocal_Go_Logger {

	/** @var WC_Logger|null */
	private $logger = null;
	/** @var string */
	private $log_context = 'General';
	/** @var bool */
	private $debug_enabled = false;

	/** @var array */
	private static $sensitive_keys = array(
		'card_number', 'cvv', 'cvc', 'cvn', 'security_code', 'expiration_month', 'expiration_year',
		'exp_month', 'exp_year', 'card_holder', 'holder_name', 'api_key', 'api_secret', 'secret',
		'secret_key', 'token', 'access_token', 'refresh_token', 'password', 'auth', 'authorization',
		'signature', 'document', 'document_number', 'cpf', 'cnpj', 'rut', 'dni', 'ci', 'tax_id',
		'national_id', 'ssn', 'passport', 'phone', 'phone_number', 'mobile', 'cellphone', 'address',
		'street', 'address_line_1', 'address_line_2', 'zip_code', 'postal_code', 'zip',
		'account_number', 'routing_number', 'iban', 'swift', 'bic',
	);

	/** @var array */
	private static $allowed_payer_keys = array( 'id', 'first_name', 'last_name', 'user_reference', 'country' );

	protected function init_logger( $context, $debug ) {
		$this->log_context   = $context;
		$this->debug_enabled = $debug;
	}

	protected function log( $message, $level = 'info' ) {
		if ( ! $this->debug_enabled ) {
			return;
		}

		if ( null === $this->logger ) {
			$this->logger = wc_get_logger();
		}

		$this->logger->log( $level, '[' . $this->log_context . '] ' . $this->sanitize_string_message( $message ), array( 'source' => 'dlocal-go' ) );
	}

	/**
	 * Sanitize data for logging.
	 *
	 * @param mixed $data Data to sanitize.
	 * @return string Sanitized data.
	 */
	protected function sanitize_for_log( $data ) {
		if ( ! is_array( $data ) ) {
			return $this->sanitize_string_message( (string) $data );
		}
		return wp_json_encode( $this->sanitize_array_recursive( $data ) ) ?: '{}';
	}

	private function sanitize_array_recursive( $data, $depth = 0 ) {
		if ( $depth > 10 ) {
			return array( '[MAX_DEPTH_EXCEEDED]' );
		}

		$sanitized = array();

		foreach ( $data as $key => $value ) {
			$key_lower = strtolower( (string) $key );

			if ( 'email' === $key_lower && is_string( $value ) ) {
				$sanitized[ $key ] = $this->mask_email( $value );
			} elseif ( in_array( $key_lower, self::$sensitive_keys, true ) ) {
				$sanitized[ $key ] = '[REDACTED]';
			} elseif ( 'payer' === $key_lower && is_array( $value ) ) {
				$sanitized[ $key ] = $this->sanitize_payer_data( $value );
			} elseif ( is_array( $value ) ) {
				$sanitized[ $key ] = $this->sanitize_array_recursive( $value, $depth + 1 );
			} else {
				$sanitized[ $key ] = $value;
			}
		}

		return $sanitized;
	}

	/**
	 * Sanitize payer data.
	 *
	 * @param array $payer Payer data.
	 * @return array Sanitized payer data.
	 */
	private function sanitize_payer_data( $payer ) {
		$sanitized = array();
		foreach ( $payer as $key => $value ) {
			$key_lower = strtolower( (string) $key );
			
			if ( 'email' === $key_lower && is_string( $value ) ) {
				$sanitized[ $key ] = $this->mask_email( $value );
			} elseif ( in_array( $key_lower, self::$allowed_payer_keys, true ) ) {
				$sanitized[ $key ] = $value;
			} else {
				$sanitized[ $key ] = '[REDACTED]';
			}
		}
		return $sanitized;
	}

	private function mask_email( $email ) {
		$parts = explode( '@', $email );
		if ( count( $parts ) !== 2 ) {
			return '[INVALID_EMAIL]';
		}
		return substr( $parts[0], 0, 2 ) . str_repeat( '*', max( 0, strlen( $parts[0] ) - 2 ) ) . '@' . $parts[1];
	}

	private function sanitize_string_message( $message ) {
		$message = preg_replace( '/\b\d{13,19}\b/', '[CARD_REDACTED]', $message );
		$message = preg_replace( '/("cvv"|"cvc"|"cvn"|"security_code")\s*:\s*"?\d{3,4}"?/i', '$1: "[REDACTED]"', $message );
		$message = preg_replace( '/(secret|token|password|api_key|api_secret|authorization)\s*[":=]\s*["\']?[a-zA-Z0-9_\-]{20,}["\']?/i', '$1: "[REDACTED]"', $message );
		$message = preg_replace( '/(cpf|rut|dni|document|tax_id)\s*[":=]\s*["\']?[\d\.\-]{8,20}["\']?/i', '$1: "[REDACTED]"', $message );
		return $message;
	}
}
