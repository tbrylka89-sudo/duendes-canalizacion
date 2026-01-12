<?php
/**
 * Plugin Name: Duendes Domain Redirect
 * Description: Redirige el dominio antiguo al nuevo manteniendo SEO
 * Version: 1.0
 * Author: Duendes del Uruguay
 */

if (!defined('ABSPATH')) exit;

/**
 * Redirect 301 del dominio antiguo al nuevo
 * Esto mantiene el SEO ya que Google entiende que el contenido se mudó
 */
add_action('init', 'duendes_redirect_old_domain', 1);

function duendes_redirect_old_domain() {
    // Dominios antiguos que deben redirigir
    $old_domains = array(
        'duendesdeluruguay.com',
        'www.duendesdeluruguay.com',
    );

    // Dominio nuevo (canónico)
    $new_domain = 'duendesuy.10web.cloud';

    // Obtener el host actual
    $current_host = isset($_SERVER['HTTP_HOST']) ? $_SERVER['HTTP_HOST'] : '';

    // Si estamos en un dominio antiguo, redirigir
    if (in_array($current_host, $old_domains)) {
        // Obtener la URI actual
        $request_uri = isset($_SERVER['REQUEST_URI']) ? $_SERVER['REQUEST_URI'] : '/';

        // Construir URL nueva
        $new_url = 'https://' . $new_domain . $request_uri;

        // Redirect 301 permanente (bueno para SEO)
        header('HTTP/1.1 301 Moved Permanently');
        header('Location: ' . $new_url);
        header('Connection: close');
        exit();
    }
}

/**
 * Asegurar que las URLs canónicas apunten al dominio nuevo
 */
add_filter('wpseo_canonical', 'duendes_fix_canonical');
add_filter('get_canonical_url', 'duendes_fix_canonical');

function duendes_fix_canonical($url) {
    $old_domains = array(
        'duendesdeluruguay.com',
        'www.duendesdeluruguay.com',
    );
    $new_domain = 'duendesuy.10web.cloud';

    foreach ($old_domains as $old) {
        $url = str_replace($old, $new_domain, $url);
    }

    return $url;
}

/**
 * Agregar meta tag para indicar a Google el cambio
 */
add_action('wp_head', 'duendes_add_seo_meta', 1);

function duendes_add_seo_meta() {
    $canonical = 'https://duendesuy.10web.cloud' . $_SERVER['REQUEST_URI'];
    echo '<link rel="canonical" href="' . esc_url($canonical) . '" />' . "\n";
}
?>
