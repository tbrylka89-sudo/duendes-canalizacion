<?php
/**
 * Plugin Name: Duendes - Sistema de Precios v3
 * Description: Sistema de precios LIMPIO - Sin MutationObserver, sin loops, sin trabar el carrito
 * Version: 3.0.0
 * Author: Duendes del Uruguay
 *
 * FILOSOFIA:
 * - WooCommerce SIEMPRE opera en USD internamente
 * - Los precios visuales se modifican SOLO via PHP en woocommerce_get_price_html
 * - El carrito y checkout NUNCA se tocan con JS de precios
 * - JavaScript SOLO para contenido de Elementor cargado via AJAX (si es necesario)
 */

if (!defined('ABSPATH')) exit;

// ============================================================================
// CONSTANTES Y CONFIGURACION
// ============================================================================

// Precios fijos USD -> UYU para Uruguay
define('DUENDES_V3_PRECIOS_UYU', [
    70 => 2500,      // Mini clasicos
    150 => 5500,     // Mini especiales, Pixies
    200 => 8000,     // Medianos
    450 => 16500,    // Grandes
    1050 => 39800,   // Gigantes
]);

// Rangos para normalizar precios
define('DUENDES_V3_RANGOS', [
    [0, 100, 70, 2500],       // [min, max, usd_normalizado, uyu_fijo]
    [100, 175, 150, 5500],
    [175, 350, 200, 8000],
    [350, 800, 450, 16500],
    [800, 99999, 1050, 39800],
]);

// Monedas para aproximado internacional
define('DUENDES_V3_MONEDAS', [
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
// 1. DETECCION DE PAIS - SIMPLE Y EFICIENTE
// ============================================================================

/**
 * Obtener pais del usuario
 * Prioridad: 1) Cookie, 2) Cache IP, 3) API IP, 4) Default US
 */
function duendes_v3_get_pais() {
    static $pais_cache = null;
    if ($pais_cache !== null) return $pais_cache;

    // 1. Cookie (seteada por selector de pais o JS)
    if (!empty($_COOKIE['duendes_pais'])) {
        $pais_cache = strtoupper(sanitize_text_field($_COOKIE['duendes_pais']));
        return $pais_cache;
    }

    // 2. Cache de sesion
    if (isset($_SESSION['duendes_pais'])) {
        $pais_cache = $_SESSION['duendes_pais'];
        return $pais_cache;
    }

    // 3. Detectar por IP (con cache en transient)
    $ip = duendes_v3_get_ip();
    if ($ip) {
        $cache_key = 'duendes_pais_' . md5($ip);
        $cached = get_transient($cache_key);
        if ($cached) {
            $pais_cache = $cached;
            return $pais_cache;
        }

        // Solo llamar API si es IP publica
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

function duendes_v3_get_ip() {
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

function duendes_v3_es_uruguay() {
    return duendes_v3_get_pais() === 'UY';
}

// ============================================================================
// 2. FUNCIONES DE CONVERSION DE PRECIOS
// ============================================================================

/**
 * Obtener precio USD real del producto (saltando filtros)
 */
function duendes_v3_get_precio_usd($product) {
    if (!$product) return 0;

    $id = $product->get_id();
    $precio = floatval(get_post_meta($id, '_price', true));

    if ($precio <= 0) {
        $precio = floatval(get_post_meta($id, '_regular_price', true));
    }

    // Si el precio es muy alto, probablemente esta en UYU por error
    if ($precio > 1500) {
        $precio = round($precio / 43);
    }

    return $precio;
}

/**
 * Normalizar precio USD a valores estandar
 */
function duendes_v3_normalizar_usd($precio) {
    foreach (DUENDES_V3_RANGOS as $rango) {
        if ($precio >= $rango[0] && $precio < $rango[1]) {
            return $rango[2];
        }
    }
    return 70; // Default
}

/**
 * Obtener precio UYU fijo segun USD
 */
function duendes_v3_usd_a_uyu($usd) {
    foreach (DUENDES_V3_RANGOS as $rango) {
        if ($usd >= $rango[0] && $usd < $rango[1]) {
            return $rango[3];
        }
    }
    return 2500; // Default
}

/**
 * Formatear numero con separadores de miles
 */
function duendes_v3_formatear($numero) {
    return number_format($numero, 0, ',', '.');
}

// ============================================================================
// 3. FILTRO DE PRECIO HTML - EL CORAZON DEL SISTEMA
// ============================================================================

/**
 * IMPORTANTE: Este filtro SOLO modifica la visualizacion HTML
 * WooCommerce sigue operando internamente en USD
 */
add_filter('woocommerce_get_price_html', 'duendes_v3_precio_html', 100, 2);

function duendes_v3_precio_html($price_html, $product) {
    // No modificar en admin (excepto AJAX del frontend)
    if (is_admin() && !wp_doing_ajax()) {
        return $price_html;
    }

    // No modificar si no hay producto
    if (!$product) {
        return $price_html;
    }

    // Evitar recursion
    static $procesando = [];
    $id = $product->get_id();
    if (isset($procesando[$id])) {
        return $price_html;
    }
    $procesando[$id] = true;

    // Obtener precio USD normalizado
    $precio_raw = duendes_v3_get_precio_usd($product);
    if ($precio_raw <= 0) {
        unset($procesando[$id]);
        return $price_html;
    }

    $precio_usd = duendes_v3_normalizar_usd($precio_raw);
    $pais = duendes_v3_get_pais();

    // Construir HTML segun pais
    if ($pais === 'UY') {
        // URUGUAY: Precio fijo en UYU
        $precio_uyu = duendes_v3_usd_a_uyu($precio_raw);
        $html = sprintf(
            '<span class="duendes-precio duendes-uy" data-usd="%d" data-uyu="%d">' .
            '<span class="precio-principal">$%s <small>UYU</small></span>' .
            '</span>',
            $precio_usd,
            $precio_uyu,
            duendes_v3_formatear($precio_uyu)
        );
    } else {
        // INTERNACIONAL: USD + aproximado local (si aplica)
        $html = sprintf(
            '<span class="duendes-precio duendes-int" data-usd="%d" data-pais="%s">' .
            '<span class="precio-principal">$%d <small>USD</small></span>',
            $precio_usd,
            esc_attr($pais),
            $precio_usd
        );

        // Agregar aproximado si hay moneda configurada
        $monedas = DUENDES_V3_MONEDAS;
        if (isset($monedas[$pais])) {
            $info = $monedas[$pais];
            $precio_local = round($precio_usd * $info['tasa']);
            $html .= sprintf(
                '<span class="precio-aprox">(aprox. %s%s %s)</span>',
                $info['simbolo'],
                duendes_v3_formatear($precio_local),
                $info['nombre']
            );
        }

        $html .= '</span>';
    }

    unset($procesando[$id]);
    return $html;
}

// ============================================================================
// 3B. FILTROS DE CARRITO - CRITICO PARA URUGUAY
// ============================================================================

// Precio unitario en el carrito
add_filter('woocommerce_cart_item_price', 'duendes_v3_cart_item_price', 100, 3);
function duendes_v3_cart_item_price($price, $cart_item, $cart_item_key) {
    $pais = duendes_v3_get_pais();
    if ($pais !== 'UY') {
        return $price;
    }

    $product = $cart_item['data'];
    $precio_raw = duendes_v3_get_precio_usd($product);
    $precio_uyu = duendes_v3_usd_a_uyu($precio_raw);

    return '<span class="duendes-precio duendes-uy">$' . duendes_v3_formatear($precio_uyu) . ' <small>UYU</small></span>';
}

// Subtotal por item en el carrito
add_filter('woocommerce_cart_item_subtotal', 'duendes_v3_cart_item_subtotal', 100, 3);
function duendes_v3_cart_item_subtotal($subtotal, $cart_item, $cart_item_key) {
    $pais = duendes_v3_get_pais();
    if ($pais !== 'UY') {
        return $subtotal;
    }

    $product = $cart_item['data'];
    $precio_raw = duendes_v3_get_precio_usd($product);
    $precio_uyu = duendes_v3_usd_a_uyu($precio_raw);
    $subtotal_uyu = $precio_uyu * $cart_item['quantity'];

    return '<span class="duendes-precio duendes-uy">$' . duendes_v3_formatear($subtotal_uyu) . ' <small>UYU</small></span>';
}

// Subtotal del carrito completo
add_filter('woocommerce_cart_subtotal', 'duendes_v3_cart_subtotal', 100, 3);
function duendes_v3_cart_subtotal($subtotal, $compound, $cart) {
    $pais = duendes_v3_get_pais();
    if ($pais !== 'UY') {
        return $subtotal;
    }

    $total_uyu = 0;
    foreach ($cart->get_cart() as $cart_item) {
        $product = $cart_item['data'];
        $precio_raw = duendes_v3_get_precio_usd($product);
        $precio_uyu = duendes_v3_usd_a_uyu($precio_raw);
        $total_uyu += $precio_uyu * $cart_item['quantity'];
    }

    return '<span class="duendes-precio duendes-uy">$' . duendes_v3_formatear($total_uyu) . ' <small>UYU</small></span>';
}

// Total del carrito
add_filter('woocommerce_cart_total', 'duendes_v3_cart_total', 100);
function duendes_v3_cart_total($total) {
    $pais = duendes_v3_get_pais();
    if ($pais !== 'UY') {
        return $total;
    }

    $cart = WC()->cart;
    if (!$cart) {
        return $total;
    }

    $total_uyu = 0;
    foreach ($cart->get_cart() as $cart_item) {
        $product = $cart_item['data'];
        $precio_raw = duendes_v3_get_precio_usd($product);
        $precio_uyu = duendes_v3_usd_a_uyu($precio_raw);
        $total_uyu += $precio_uyu * $cart_item['quantity'];
    }

    // Agregar envio si hay
    $shipping_total = $cart->get_shipping_total();
    if ($shipping_total > 0) {
        // Convertir envio a UYU (aproximado con tasa 43)
        $total_uyu += round($shipping_total * 43);
    }

    return '<span class="duendes-precio duendes-uy">$' . duendes_v3_formatear($total_uyu) . ' <small>UYU</small></span>';
}

// ============================================================================
// 4. FORZAR MONEDA USD EN WOOCOMMERCE
// ============================================================================

add_filter('woocommerce_currency', function() { return 'USD'; }, 999);
add_filter('woocommerce_currency_symbol', function() { return '$'; }, 999);

// Desactivar plugins de multi-currency que puedan interferir
add_action('plugins_loaded', function() {
    add_filter('wmc_enable', '__return_false', 1);
    add_filter('curcy_enable', '__return_false', 1);
}, 1);

// ============================================================================
// 5. ESTILOS CSS - INYECTADOS EN HEAD
// ============================================================================

add_action('wp_head', function() {
    ?>
    <style id="duendes-precios-v3-css">
    /* Contenedor de precio */
    .duendes-precio {
        display: inline-flex !important;
        flex-direction: column !important;
        gap: 2px !important;
        line-height: 1.3 !important;
    }

    /* Precio principal */
    .duendes-precio .precio-principal {
        color: #d4af37 !important;
        font-weight: 600 !important;
        font-size: 1.1em !important;
    }

    .duendes-precio .precio-principal small {
        font-size: 0.7em !important;
        font-weight: 400 !important;
        opacity: 0.85 !important;
        margin-left: 2px !important;
    }

    /* Precio aproximado */
    .duendes-precio .precio-aprox {
        font-size: 0.72em !important;
        color: #9a8866 !important;
        font-style: italic !important;
        font-weight: 400 !important;
    }

    /* En pagina de producto */
    .single-product .duendes-precio .precio-principal {
        font-size: 1.5em !important;
    }

    /* En carrito y checkout - horizontal */
    .woocommerce-cart .duendes-precio,
    .woocommerce-checkout .duendes-precio,
    .widget_shopping_cart .duendes-precio {
        flex-direction: row !important;
        gap: 6px !important;
        align-items: baseline !important;
    }

    /* Ocultar precios originales de WooCommerce si aparecen */
    .woocommerce-Price-amount:not(.duendes-precio *) {
        /* No ocultar, puede romper cosas */
    }
    </style>
    <?php
}, 5);

// ============================================================================
// 6. JAVASCRIPT MINIMO - SOLO PARA DATOS GLOBALES
// ============================================================================

add_action('wp_head', function() {
    $pais = duendes_v3_get_pais();
    ?>
    <script id="duendes-precios-v3-data">
    window.DUENDES = window.DUENDES || {};
    window.DUENDES.pais = '<?php echo esc_js($pais); ?>';
    window.DUENDES.esUruguay = <?php echo duendes_v3_es_uruguay() ? 'true' : 'false'; ?>;
    window.DUENDES.preciosUYU = {70:2500, 150:5500, 200:8000, 450:16500, 1050:39800};
    </script>
    <?php
}, 1);

// ============================================================================
// 7. FUNCION PUBLICA PARA OTROS PLUGINS
// ============================================================================

/**
 * Funcion para que otros plugins obtengan precios correctos
 * Usada por duendes-producto-epico.php y duendes-tienda-tarot.php
 */
function duendes_obtener_precio_fijo($product) {
    $precio_usd = duendes_v3_get_precio_usd($product);
    $usd_normalizado = duendes_v3_normalizar_usd($precio_usd);
    $uyu = duendes_v3_usd_a_uyu($precio_usd);

    return [
        'usd' => $usd_normalizado,
        'uyu' => $uyu
    ];
}

// ============================================================================
// 8. AJAX PARA CAMBIAR PAIS
// ============================================================================

add_action('wp_ajax_duendes_cambiar_pais', 'duendes_v3_ajax_cambiar_pais');
add_action('wp_ajax_nopriv_duendes_cambiar_pais', 'duendes_v3_ajax_cambiar_pais');

function duendes_v3_ajax_cambiar_pais() {
    $pais = strtoupper(sanitize_text_field($_POST['pais'] ?? 'US'));

    // Setear cookie por 1 anio
    setcookie('duendes_pais', $pais, time() + YEAR_IN_SECONDS, '/');

    // Tambien en sesion para requests inmediatos
    if (!session_id()) {
        @session_start();
    }
    $_SESSION['duendes_pais'] = $pais;

    wp_send_json_success([
        'pais' => $pais,
        'esUruguay' => $pais === 'UY'
    ]);
}

// ============================================================================
// 9. DEBUG - SOLO PARA ADMINS
// ============================================================================

add_action('wp_footer', function() {
    if (!current_user_can('administrator')) return;
    if (!isset($_GET['debug_precios'])) return;

    $pais = duendes_v3_get_pais();
    $cookie = $_COOKIE['duendes_pais'] ?? 'no definida';
    $ip = duendes_v3_get_ip();

    echo "<!-- DUENDES V3 DEBUG
    Pais detectado: {$pais}
    Cookie duendes_pais: {$cookie}
    IP detectada: {$ip}
    Es Uruguay: " . (duendes_v3_es_uruguay() ? 'SI' : 'NO') . "
    Timestamp: " . date('Y-m-d H:i:s') . "
    -->";
});
