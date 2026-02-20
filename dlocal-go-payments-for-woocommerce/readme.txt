=== dLocal Go Payments ===
Contributors: dlocalgo, prointernacional
Tags: ecommerce, e-commerce, commerce, woothemes, wordpress ecommerce, store, sales, sell, shop, shopping, cart, checkout, configurable, dlocalgo
Requires at least: 5.8
Tested up to: 6.9
Requires PHP: 7.4
Stable tag: 2.0.5
License: GPLv3
License URI: http://www.gnu.org/licenses/gpl-3.0.html

Accept dLocal Go payment methods in your WooCommerce store.

== Description ==

This plugin adds dLocal Go Payment Gateway for WooCommerce to allow customers access to multiple local payment methods.

= Requirements =

* WordPress 5.8 or higher
* WooCommerce 5.0 or higher
* PHP 7.4 or higher
* Active dLocal Go account (Sandbox or Production)
* SSL enabled (HTTPS)

== Installation ==

= Automatic Installation =

1. Go to WordPress Admin → Plugins → Add New
2. Search for "dLocal Go Payments"
3. Click "Install Now" and then "Activate"

= Manual Installation =

1. Download the plugin ZIP file
2. Go to WordPress Admin → Plugins → Add New → Upload Plugin
3. Select the ZIP file and click "Install Now"
4. Activate the plugin

= Configuration =

1. Go to WooCommerce → Settings → Payments
2. Click on "dLocal Go"
3. Configure the following fields:
   * **Enable**: Activate the gateway
   * **Title**: Text that customers see at checkout
   * **Description**: Payment method description
   * **Environment**: Sandbox (testing) or Production
   * **API Key**: Your dLocal Go API Key
   * **API Secret**: Your dLocal Go API Secret
   * **Default Country**: Country for payments when not specified
   * **Debug Mode**: Enable logs for debugging

== Privacy ==

This plugin does not:
* Store any personal data on your server
* Share customer data with third parties (except dLocal for payment processing)
* Track user behavior

Data transmitted to dLocal Go:
* Order details (amount, currency, items)
* Customer information (name, email, country)
* Payment information (processed securely by dLocal)

All data transmission is encrypted via HTTPS.

== Changelog ==

= 2.0.5 =
* Fixed assets

= 2.0.4 =
* New version released
* Support for redirect payments
* IPN/Webhook for status updates
* Support for refunds
* Checkout Blocks compatibility
* Added plugin logos

= Troubleshooting =

1. **Enable debug mode** in the gateway configuration
2. Check logs in WooCommerce → Status → Logs → dlocal-go
3. Verify that your site has SSL enabled (HTTPS)
4. Confirm that credentials are correct for the selected environment

== Support ==

For technical support, contact through [dLocal](https://dlocal.com) or create a ticket in the GitHub repository.
