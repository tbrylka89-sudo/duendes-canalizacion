<?php
/**
 * Plugin Name: Duendes - Sistema de Precios v4
 * Description: Sistema con moneda REAL por pais - Uruguay = UYU, Exterior = USD
 * Version: 4.0.0
 * Author: Duendes del Uruguay
 *
 * CAMBIO PRINCIPAL:
 * - Ya NO es solo visual, WooCommerce cambia moneda real
 * - Uruguay: checkout en UYU (Plexo cobra en pesos)
 * - Exterior: checkout en USD (Plexo cobra en dolares)
 */

if (!defined('ABSPATH')) exit;

// ============================================================================
// CONSTANTES
// ============================================================================

// Precios fijos USD -> UYU para Uruguay
define('DUENDES_PRECIOS_UYU', [
    70 => 2500,
    150 => 5500,
    200 => 8000,
    450 => 16500,
    1050 => 39800,
]);

// Rangos para normalizar
define('DUENDES_RANGOS', [
    [0, 100, 70, 2500],
    [100, 175, 150, 5500],
    [175, 350, 200, 8000],
    [350, 800, 450, 16500],
    [800, 99999, 1050, 39800],
]);

// Monedas para aproximado internacional (solo visual)
define('DUENDES_MONEDAS', [
    'AR' => ['simbolo' => '$', 'nombre' => 'pesos argentinos', 'tasa' => 1450],
    'MX' => ['simbolo' => '$', 'nombre' => 'pesos mexicanos', 'tasa' => 20.5],
    'CO' => ['simbolo' => '$', 'nombre' => 'pesos colombianos', 'tasa' => 4400],
    'CL' => ['simbolo' => '$', 'nombre' => 'pesos chilenos', 'tasa' => 990],
    'PE' => ['simbolo' => 'S/', 'nombre' => 'soles', 'tasa' => 3.75],
    'BR' => ['simbolo' => 'R$', 'nombre' => 'reales', 'tasa' => 6.1],
    'ES' => ['simbolo' => '€', 'nombre' => 'euros', 'tasa' => 0.92],
    'FR' => ['simbolo' => '€', 'nombre' => 'euros', 'tasa' => 0.92],
    'DE' => ['simbolo' => '€', 'nombre' => 'euros', 'tasa' => 0.92],
    'GB' => ['simbolo' => '£', 'nombre' => 'libras', 'tasa' => 0.79],
]);

// ============================================================================
// DETECCION DE PAIS
// ============================================================================

function duendes_get_pais() {
    static $pais_cache = null;
    if ($pais_cache !== null) return $pais_cache;

    // 1. Cookie
    if (!empty($_COOKIE['duendes_pais'])) {
        $pais_cache = strtoupper(sanitize_text_field($_COOKIE['duendes_pais']));
        return $pais_cache;
    }

    // 2. Sesion
    if (session_status() !== PHP_SESSION_ACTIVE) {
        @session_start();
    }
    if (!empty($_SESSION['duendes_pais'])) {
        $pais_cache = $_SESSION['duendes_pais'];
        return $pais_cache;
    }

    // 3. Detectar por IP
    $ip = duendes_get_ip();
    if ($ip) {
        $cache_key = 'duendes_pais_' . md5($ip);
        $cached = get_transient($cache_key);
        if ($cached) {
            $pais_cache = $cached;
            return $pais_cache;
        }

        if (filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE)) {
            $response = @wp_remote_get("http://ip-api.com/json/{$ip}?fields=countryCode", [
                'timeout' => 2,
                'sslverify' => false
            ]);

            if (!is_wp_error($response)) {
                $body = json_decode(wp_remote_retrieve_body($response), true);
                if (!empty($body['countryCode'])) {
                    $pais = strtoupper($body['countryCode']);
                    set_transient($cache_key, $pais, DAY_IN_SECONDS);
                    $pais_cache = $pais;
                    return $pais_cache;
                }
            }
        }
    }

    $pais_cache = 'US';
    return $pais_cache;
}

function duendes_get_ip() {
    $headers = ['HTTP_CF_CONNECTING_IP', 'HTTP_X_FORWARDED_FOR', 'HTTP_X_REAL_IP', 'REMOTE_ADDR'];
    foreach ($headers as $header) {
        if (!empty($_SERVER[$header])) {
            $ip = trim(explode(',', $_SERVER[$header])[0]);
            if (filter_var($ip, FILTER_VALIDATE_IP)) {
                return $ip;
            }
        }
    }
    return '';
}

function duendes_es_uruguay() {
    return duendes_get_pais() === 'UY';
}

// ============================================================================
// FUNCIONES DE PRECIO
// ============================================================================

/**
 * Obtener precio USD base del producto (desde meta)
 */
function duendes_get_precio_base_usd($product) {
    if (!$product) return 0;
    $id = $product->get_id();

    // Leer precio de meta directo (evita filtros)
    $precio = floatval(get_post_meta($id, '_price', true));
    if ($precio <= 0) {
        $precio = floatval(get_post_meta($id, '_regular_price', true));
    }

    // Corregir si esta en UYU por error
    if ($precio > 1500) {
        $precio = round($precio / 43);
    }

    return $precio;
}

/**
 * Normalizar precio USD
 */
function duendes_normalizar_usd($precio) {
    foreach (DUENDES_RANGOS as $rango) {
        if ($precio >= $rango[0] && $precio < $rango[1]) {
            return $rango[2];
        }
    }
    return 70;
}

/**
 * USD a UYU fijo
 */
function duendes_usd_a_uyu($usd) {
    foreach (DUENDES_RANGOS as $rango) {
        if ($usd >= $rango[0] && $usd < $rango[1]) {
            return $rango[3];
        }
    }
    return 2500;
}

function duendes_formatear($numero) {
    return number_format($numero, 0, ',', '.');
}

// ============================================================================
// CAMBIAR MONEDA REAL DE WOOCOMMERCE
// ============================================================================

/**
 * CRITICO: Cambiar la moneda segun el pais
 */
add_filter('woocommerce_currency', 'duendes_cambiar_moneda', 999);
function duendes_cambiar_moneda($currency) {
    // No cambiar en admin (para no confundir al editar productos)
    if (is_admin() && !wp_doing_ajax()) {
        return 'USD';
    }

    return duendes_es_uruguay() ? 'UYU' : 'USD';
}

/**
 * Simbolo de moneda
 */
add_filter('woocommerce_currency_symbol', 'duendes_cambiar_simbolo', 999, 2);
function duendes_cambiar_simbolo($symbol, $currency) {
    if ($currency === 'UYU') {
        return '$';
    }
    return '$';
}

// ============================================================================
// CAMBIAR PRECIOS REALES DE PRODUCTOS
// ============================================================================

/**
 * CRITICO: Modificar el precio REAL del producto segun moneda
 * Esto afecta el carrito y checkout
 */
add_filter('woocommerce_product_get_price', 'duendes_modificar_precio', 999, 2);
add_filter('woocommerce_product_get_regular_price', 'duendes_modificar_precio', 999, 2);
add_filter('woocommerce_product_get_sale_price', 'duendes_modificar_precio_sale', 999, 2);

function duendes_modificar_precio($price, $product) {
    // No modificar en admin
    if (is_admin() && !wp_doing_ajax()) {
        return $price;
    }

    // Evitar recursion
    static $procesando = [];
    $id = $product->get_id();
    if (isset($procesando[$id])) {
        return $price;
    }
    $procesando[$id] = true;

    // Obtener precio USD base
    $precio_usd = duendes_get_precio_base_usd($product);

    if (duendes_es_uruguay()) {
        // Uruguay: devolver precio en UYU
        $precio_uyu = duendes_usd_a_uyu($precio_usd);
        unset($procesando[$id]);
        return $precio_uyu;
    }

    // Internacional: devolver USD normalizado
    $usd_normalizado = duendes_normalizar_usd($precio_usd);
    unset($procesando[$id]);
    return $usd_normalizado;
}

function duendes_modificar_precio_sale($price, $product) {
    // Si no hay precio de oferta, no modificar
    if (empty($price)) {
        return $price;
    }
    return duendes_modificar_precio($price, $product);
}

// ============================================================================
// PRECIO HTML VISUAL
// ============================================================================

add_filter('woocommerce_get_price_html', 'duendes_precio_html', 100, 2);
function duendes_precio_html($price_html, $product) {
    if (is_admin() && !wp_doing_ajax()) {
        return $price_html;
    }

    if (!$product) {
        return $price_html;
    }

    $pais = duendes_get_pais();
    $precio_usd_base = duendes_get_precio_base_usd($product);

    if ($pais === 'UY') {
        // Uruguay: solo mostrar precio en UYU
        $precio_uyu = duendes_usd_a_uyu($precio_usd_base);
        return sprintf(
            '<span class="duendes-precio duendes-uy">' .
            '<span class="precio-principal">$%s</span>' .
            '</span>',
            duendes_formatear($precio_uyu)
        );
    }

    // Internacional: USD + aproximado si aplica
    $precio_usd = duendes_normalizar_usd($precio_usd_base);
    $html = sprintf(
        '<span class="duendes-precio duendes-int" data-pais="%s">' .
        '<span class="precio-principal">$%d USD</span>',
        esc_attr($pais),
        $precio_usd
    );

    // Aproximado en moneda local (solo en pagina de producto)
    if (is_product() && isset(DUENDES_MONEDAS[$pais])) {
        $info = DUENDES_MONEDAS[$pais];
        $precio_local = round($precio_usd * $info['tasa']);
        $html .= sprintf(
            '<span class="precio-aprox">(aprox. %s%s %s)</span>',
            $info['simbolo'],
            duendes_formatear($precio_local),
            $info['nombre']
        );
    }

    $html .= '</span>';
    return $html;
}

// ============================================================================
// DESACTIVAR PLUGINS DE MULTI-CURRENCY
// ============================================================================

add_action('plugins_loaded', function() {
    add_filter('wmc_enable', '__return_false', 1);
    add_filter('curcy_enable', '__return_false', 1);
}, 1);

// ============================================================================
// ESTILOS CSS
// ============================================================================

add_action('wp_head', function() {
    ?>
    <style id="duendes-precios-v4-css">
    .duendes-precio {
        display: inline-flex !important;
        flex-direction: column !important;
        gap: 2px !important;
        line-height: 1.3 !important;
    }
    .duendes-precio .precio-principal {
        color: #d4af37 !important;
        font-weight: 600 !important;
        font-size: 1.1em !important;
    }
    .duendes-precio .precio-aprox {
        font-size: 0.72em !important;
        color: #9a8866 !important;
        font-style: italic !important;
    }
    .single-product .duendes-precio .precio-principal {
        font-size: 1.5em !important;
    }
    .woocommerce-cart .duendes-precio,
    .woocommerce-checkout .duendes-precio {
        flex-direction: row !important;
        gap: 6px !important;
        align-items: baseline !important;
    }
    </style>
    <?php
}, 5);

// ============================================================================
// DATOS JAVASCRIPT
// ============================================================================

add_action('wp_head', function() {
    $pais = duendes_get_pais();
    ?>
    <script id="duendes-precios-v4-data">
    window.DUENDES = window.DUENDES || {};
    window.DUENDES.pais = '<?php echo esc_js($pais); ?>';
    window.DUENDES.esUruguay = <?php echo duendes_es_uruguay() ? 'true' : 'false'; ?>;
    window.DUENDES.moneda = '<?php echo duendes_es_uruguay() ? 'UYU' : 'USD'; ?>';
    window.DUENDES.preciosUYU = {70:2500, 150:5500, 200:8000, 450:16500, 1050:39800};
    </script>
    <?php
}, 1);

// ============================================================================
// FUNCION PUBLICA PARA OTROS PLUGINS
// ============================================================================

function duendes_obtener_precio_fijo($product) {
    $precio_usd = duendes_get_precio_base_usd($product);
    $usd_normalizado = duendes_normalizar_usd($precio_usd);
    $uyu = duendes_usd_a_uyu($precio_usd);

    return [
        'usd' => $usd_normalizado,
        'uyu' => $uyu
    ];
}

// ============================================================================
// AJAX PARA CAMBIAR PAIS
// ============================================================================

add_action('wp_ajax_duendes_cambiar_pais', 'duendes_ajax_cambiar_pais');
add_action('wp_ajax_nopriv_duendes_cambiar_pais', 'duendes_ajax_cambiar_pais');

function duendes_ajax_cambiar_pais() {
    $pais = strtoupper(sanitize_text_field($_POST['pais'] ?? 'US'));

    // Setear cookie
    setcookie('duendes_pais', $pais, time() + YEAR_IN_SECONDS, '/', '', true, false);

    // Sesion
    if (session_status() !== PHP_SESSION_ACTIVE) {
        @session_start();
    }
    $_SESSION['duendes_pais'] = $pais;

    // Limpiar cache de WooCommerce para que recalcule carrito
    if (function_exists('WC') && WC()->cart) {
        WC()->cart->calculate_totals();
    }

    wp_send_json_success([
        'pais' => $pais,
        'esUruguay' => $pais === 'UY',
        'moneda' => $pais === 'UY' ? 'UYU' : 'USD'
    ]);
}

// ============================================================================
// VACIAR CARRITO AL CAMBIAR PAIS (para evitar precios mixtos)
// ============================================================================

add_action('init', function() {
    // Si cambio el pais y habia carrito, hay que recalcular
    if (isset($_COOKIE['duendes_pais_changed']) && function_exists('WC') && WC()->cart) {
        WC()->cart->calculate_totals();
        setcookie('duendes_pais_changed', '', time() - 3600, '/');
    }
});

// ============================================================================
// DEBUG
// ============================================================================

add_action('wp_footer', function() {
    if (!current_user_can('administrator')) return;
    if (!isset($_GET['debug_precios'])) return;

    $pais = duendes_get_pais();
    $moneda = duendes_es_uruguay() ? 'UYU' : 'USD';
    $cookie = $_COOKIE['duendes_pais'] ?? 'no definida';

    echo "<!-- DUENDES V4 DEBUG
    Pais: {$pais}
    Moneda: {$moneda}
    Cookie: {$cookie}
    Es Uruguay: " . (duendes_es_uruguay() ? 'SI' : 'NO') . "
    -->";
});
