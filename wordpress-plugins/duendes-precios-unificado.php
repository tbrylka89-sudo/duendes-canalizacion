<?php
/**
 * Plugin Name: Duendes - Precios Unificado
 * Description: Sistema de precios DEFINITIVO - Uruguay ve precios fijos, resto ve USD + aproximado
 * Version: 2.0.0
 * Author: Duendes del Uruguay
 */

if (!defined('ABSPATH')) exit;

// ═══════════════════════════════════════════════════════════════════════════
// 1. DESACTIVAR COMPLETAMENTE OTROS PLUGINS DE MONEDA
// ═══════════════════════════════════════════════════════════════════════════

// Muy temprano, antes de que carguen
add_action('plugins_loaded', function() {
    // Desactivar Multi Currency
    add_filter('wmc_enable', '__return_false', 1);
    add_filter('curcy_enable', '__return_false', 1);
    add_filter('wmc_get_price', function($p) { return $p; }, 1);
}, 1);

// ═══════════════════════════════════════════════════════════════════════════
// 2. CONFIGURACIÓN - TABLA DE PRECIOS FIJOS URUGUAY
// ═══════════════════════════════════════════════════════════════════════════

// Los precios base en WooCommerce están en USD
// Esta tabla convierte USD → UYU fijo para Uruguay
define('DUENDES_PRECIOS_UYU', [
    // [min_usd, max_usd, precio_uyu_fijo]
    [0, 100, 2500],        // Mini clásicos ($70 USD)
    [100, 175, 5500],      // Mini especiales, Pixies ($150 USD)
    [175, 350, 8000],      // Medianos ($200 USD)
    [350, 800, 16500],     // Grandes ($450 USD)
    [800, 99999, 39800],   // Gigantes ($1050 USD)
]);

// Monedas para aproximado en cada país
define('DUENDES_MONEDAS', [
    'AR' => ['codigo' => 'ARS', 'nombre' => 'pesos argentinos', 'simbolo' => '$', 'tasa' => 1200],
    'MX' => ['codigo' => 'MXN', 'nombre' => 'pesos mexicanos', 'simbolo' => '$', 'tasa' => 17.5],
    'CO' => ['codigo' => 'COP', 'nombre' => 'pesos colombianos', 'simbolo' => '$', 'tasa' => 4300],
    'CL' => ['codigo' => 'CLP', 'nombre' => 'pesos chilenos', 'simbolo' => '$', 'tasa' => 980],
    'PE' => ['codigo' => 'PEN', 'nombre' => 'soles', 'simbolo' => 'S/', 'tasa' => 3.8],
    'BR' => ['codigo' => 'BRL', 'nombre' => 'reales', 'simbolo' => 'R$', 'tasa' => 5.6],
    'ES' => ['codigo' => 'EUR', 'nombre' => 'euros', 'simbolo' => '€', 'tasa' => 0.93],
    'FR' => ['codigo' => 'EUR', 'nombre' => 'euros', 'simbolo' => '€', 'tasa' => 0.93],
    'DE' => ['codigo' => 'EUR', 'nombre' => 'euros', 'simbolo' => '€', 'tasa' => 0.93],
    'IT' => ['codigo' => 'EUR', 'nombre' => 'euros', 'simbolo' => '€', 'tasa' => 0.93],
    'PT' => ['codigo' => 'EUR', 'nombre' => 'euros', 'simbolo' => '€', 'tasa' => 0.93],
    'GB' => ['codigo' => 'GBP', 'nombre' => 'libras', 'simbolo' => '£', 'tasa' => 0.80],
    'CA' => ['codigo' => 'CAD', 'nombre' => 'dólares canadienses', 'simbolo' => 'CA$', 'tasa' => 1.38],
    'VE' => ['codigo' => 'USD', 'nombre' => 'dólares', 'simbolo' => '$', 'tasa' => 1], // Venezuela usa USD
    'EC' => ['codigo' => 'USD', 'nombre' => 'dólares', 'simbolo' => '$', 'tasa' => 1], // Ecuador usa USD
    'PA' => ['codigo' => 'USD', 'nombre' => 'dólares', 'simbolo' => '$', 'tasa' => 1], // Panamá usa USD
]);

// ═══════════════════════════════════════════════════════════════════════════
// 3. FUNCIONES AUXILIARES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Obtener país del usuario (cookie primero, luego IP)
 */
function duendes_obtener_pais() {
    // 1. Cookie
    if (!empty($_COOKIE['duendes_pais'])) {
        return strtoupper(sanitize_text_field($_COOKIE['duendes_pais']));
    }

    // 2. Caché de IP
    $ip = duendes_get_client_ip();
    $cache_key = 'duendes_pais_' . md5($ip);
    $cached = get_transient($cache_key);
    if ($cached) {
        return $cached;
    }

    // 3. Detectar por IP (solo si es IP pública)
    if ($ip && !in_array($ip, ['127.0.0.1', '::1']) && filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_NO_PRIV_RANGE)) {
        $response = @wp_remote_get("http://ip-api.com/json/{$ip}?fields=countryCode", [
            'timeout' => 2,
            'sslverify' => false
        ]);

        if (!is_wp_error($response)) {
            $body = json_decode(wp_remote_retrieve_body($response), true);
            if (!empty($body['countryCode'])) {
                $pais = strtoupper($body['countryCode']);
                set_transient($cache_key, $pais, DAY_IN_SECONDS);
                return $pais;
            }
        }
    }

    return 'US'; // Default
}

function duendes_get_client_ip() {
    foreach (['HTTP_CF_CONNECTING_IP', 'HTTP_X_FORWARDED_FOR', 'HTTP_X_REAL_IP', 'REMOTE_ADDR'] as $key) {
        if (!empty($_SERVER[$key])) {
            return trim(explode(',', $_SERVER[$key])[0]);
        }
    }
    return '';
}

function duendes_es_uruguay() {
    return duendes_obtener_pais() === 'UY';
}

/**
 * Obtener precio USD del producto (RAW, sin filtros de otros plugins)
 */
function duendes_get_precio_usd($product) {
    // Obtener precio directo del post meta, saltando todos los filtros
    $precio_raw = floatval(get_post_meta($product->get_id(), '_price', true));

    if ($precio_raw <= 0) {
        // Fallback al precio regular
        $precio_raw = floatval(get_post_meta($product->get_id(), '_regular_price', true));
    }

    // Si el precio es mayor a 1500, probablemente está en UYU
    // (algunos productos pueden tener precios en UYU por error)
    if ($precio_raw > 1500) {
        $precio_raw = round($precio_raw / 43);
    }

    return $precio_raw;
}

/**
 * Convertir USD a UYU fijo según tabla
 */
function duendes_usd_a_uyu_fijo($usd) {
    foreach (DUENDES_PRECIOS_UYU as $rango) {
        if ($usd >= $rango[0] && $usd < $rango[1]) {
            return $rango[2];
        }
    }
    // Fallback: multiplicar por tasa
    return round($usd * 40);
}

/**
 * Formatear número con puntos de miles
 */
function duendes_format_numero($n) {
    return number_format($n, 0, ',', '.');
}

/**
 * FUNCIÓN CLAVE - Usada por duendes-producto-epico.php y duendes-tienda-tarot.php
 * Devuelve array con precios USD y UYU correctos
 */
function duendes_obtener_precio_fijo($product) {
    // Obtener precio USD del producto
    $precio_usd = duendes_get_precio_usd($product);

    // Normalizar a precios estándar
    if ($precio_usd <= 100) {
        $usd = 70;
        $uyu = 2500;
    } elseif ($precio_usd <= 175) {
        $usd = 150;
        $uyu = 5500;
    } elseif ($precio_usd <= 350) {
        $usd = 200;
        $uyu = 8000;
    } elseif ($precio_usd <= 800) {
        $usd = 450;
        $uyu = 16500;
    } else {
        $usd = 1050;
        $uyu = 39800;
    }

    return [
        'usd' => $usd,
        'uyu' => $uyu
    ];
}

// ═══════════════════════════════════════════════════════════════════════════
// 4. FILTRO PRINCIPAL DE PRECIOS - HTML
// ═══════════════════════════════════════════════════════════════════════════

add_filter('woocommerce_get_price_html', 'duendes_precio_html_filtro', 999999, 2);
add_filter('woocommerce_variable_price_html', 'duendes_precio_html_filtro', 999999, 2);
add_filter('woocommerce_grouped_price_html', 'duendes_precio_html_filtro', 999999, 2);

function duendes_precio_html_filtro($price_html, $product) {
    // No modificar en admin (excepto AJAX)
    if (is_admin() && !wp_doing_ajax()) {
        return $price_html;
    }

    // Evitar recursión
    static $procesando = [];
    $id = $product->get_id();
    if (isset($procesando[$id])) {
        return $price_html;
    }
    $procesando[$id] = true;

    // Obtener precio USD
    $precio_usd = duendes_get_precio_usd($product);
    if ($precio_usd <= 0) {
        unset($procesando[$id]);
        return $price_html;
    }

    $pais = duendes_obtener_pais();

    // ═══════════════════════════════════════════════════════════════
    // URUGUAY - Precio fijo en UYU
    // ═══════════════════════════════════════════════════════════════
    if ($pais === 'UY') {
        $precio_uyu = duendes_usd_a_uyu_fijo($precio_usd);
        $html = '<span class="duendes-precio duendes-uy">';
        $html .= '<span class="precio-principal">$' . duendes_format_numero($precio_uyu) . ' <small>UYU</small></span>';
        $html .= '</span>';
        unset($procesando[$id]);
        return $html;
    }

    // ═══════════════════════════════════════════════════════════════
    // RESTO DEL MUNDO - USD + aproximado en moneda local
    // ═══════════════════════════════════════════════════════════════
    $html = '<span class="duendes-precio duendes-usd">';
    $html .= '<span class="precio-principal">$' . $precio_usd . ' <small>USD</small></span>';

    // Agregar aproximado si tenemos la moneda
    $monedas = DUENDES_MONEDAS;
    if (isset($monedas[$pais]) && $monedas[$pais]['tasa'] != 1) {
        $info = $monedas[$pais];
        $precio_local = round($precio_usd * $info['tasa']);
        $html .= '<span class="precio-aprox">(aprox. ' . $info['simbolo'] . duendes_format_numero($precio_local) . ' ' . $info['nombre'] . ')</span>';
    }

    $html .= '</span>';
    unset($procesando[$id]);
    return $html;
}

// ═══════════════════════════════════════════════════════════════════════════
// 5. ESTILOS CSS
// ═══════════════════════════════════════════════════════════════════════════

add_action('wp_head', function() {
    $pais = duendes_obtener_pais();
    ?>
    <style id="duendes-precios-css">
    .duendes-precio {
        display: inline-flex !important;
        flex-direction: column !important;
        gap: 3px !important;
    }
    .duendes-precio .precio-principal {
        color: #d4af37 !important;
        font-weight: 600 !important;
        font-size: 1.1em !important;
    }
    .duendes-precio .precio-principal small {
        font-size: 0.7em !important;
        font-weight: 400 !important;
        opacity: 0.85 !important;
    }
    .duendes-precio .precio-aprox {
        font-size: 0.75em !important;
        color: #9a8866 !important;
        font-style: italic !important;
        font-weight: 400 !important;
    }
    /* En página de producto individual */
    .single-product .duendes-precio .precio-principal {
        font-size: 1.4em !important;
    }
    /* En carrito */
    .woocommerce-cart .duendes-precio,
    .woocommerce-checkout .duendes-precio {
        flex-direction: row !important;
        gap: 8px !important;
        align-items: baseline !important;
    }
    </style>
    <script>
    // Exponer datos de país para otros scripts
    window.DUENDES = {
        pais: '<?php echo esc_js($pais); ?>',
        esUruguay: <?php echo duendes_es_uruguay() ? 'true' : 'false'; ?>,
        preciosUYU: {70:2500, 150:5500, 200:8000, 450:16500, 1050:39800}
    };
    </script>
    <?php
}, 1);

// ═══════════════════════════════════════════════════════════════════════════
// 6. JAVASCRIPT DE RESPALDO (para contenido dinámico/Elementor)
// ═══════════════════════════════════════════════════════════════════════════

add_action('wp_footer', function() {
    ?>
    <script>
    (function(){
        var D = window.DUENDES || {};
        var esUY = D.esUruguay;
        var tabla = D.preciosUYU || {70:2500, 150:5500, 200:8000, 450:16500, 1050:39800};

        function usdToUyu(usd) {
            if (usd <= 100) return 2500;
            if (usd <= 175) return 5500;
            if (usd <= 350) return 8000;
            if (usd <= 800) return 16500;
            return 39800;
        }

        function normalizeUsd(precio) {
            // Si es mayor a 1500, está en UYU, convertir
            if (precio > 1500) precio = Math.round(precio / 43);
            // Normalizar a precios estándar
            if (precio <= 100) return 70;
            if (precio <= 175) return 150;
            if (precio <= 350) return 200;
            if (precio <= 800) return 450;
            return 1050;
        }

        function fmt(n) {
            return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
        }

        function fixPrecios() {
            // Buscar elementos de precio que NO hayan sido procesados
            document.querySelectorAll('.price, .woocommerce-Price-amount').forEach(function(el) {
                if (el.classList.contains('duendes-precio') || el.dataset.duendesFixed) return;

                var txt = el.textContent || '';
                // Buscar patrón de precio: $X.XXX o $XXX
                var match = txt.match(/\$\s*([\d.,]+)/);
                if (!match) return;

                // Extraer número
                var numStr = match[1].replace(/\./g, '').replace(/,/g, '');
                var precio = parseInt(numStr);
                if (isNaN(precio) || precio < 50) return;

                // Convertir a USD normalizado
                var usd = normalizeUsd(precio);

                if (esUY) {
                    var uyu = usdToUyu(usd);
                    el.innerHTML = '<span class="duendes-precio duendes-uy"><span class="precio-principal">$'+fmt(uyu)+' <small>UYU</small></span></span>';
                } else {
                    el.innerHTML = '<span class="duendes-precio duendes-usd"><span class="precio-principal">$'+usd+' <small>USD</small></span></span>';
                }
                el.dataset.duendesFixed = '1';
            });
        }

        // Ejecutar múltiples veces para contenido dinámico
        fixPrecios();
        setTimeout(fixPrecios, 500);
        setTimeout(fixPrecios, 1500);
        setTimeout(fixPrecios, 3000);

        // Observer DESACTIVADO temporalmente para debug
        // Los precios se fijan con los setTimeout de arriba
    })();
    </script>
    <?php
}, 999999);

// ═══════════════════════════════════════════════════════════════════════════
// 7. FORZAR MONEDA BASE USD EN WOOCOMMERCE
// ═══════════════════════════════════════════════════════════════════════════

add_filter('woocommerce_currency', function() { return 'USD'; }, 999999);
add_filter('woocommerce_currency_symbol', function() { return '$'; }, 999999);

// ═══════════════════════════════════════════════════════════════════════════
// 8. AJAX PARA CAMBIAR PAÍS
// ═══════════════════════════════════════════════════════════════════════════

add_action('wp_ajax_duendes_cambiar_pais', 'duendes_ajax_cambiar_pais');
add_action('wp_ajax_nopriv_duendes_cambiar_pais', 'duendes_ajax_cambiar_pais');
function duendes_ajax_cambiar_pais() {
    $pais = strtoupper(sanitize_text_field($_POST['pais'] ?? 'US'));
    setcookie('duendes_pais', $pais, time() + YEAR_IN_SECONDS, '/');
    wp_send_json_success(['pais' => $pais]);
}

// ═══════════════════════════════════════════════════════════════════════════
// 9. DEBUG - Solo para administradores
// ═══════════════════════════════════════════════════════════════════════════

add_action('wp_footer', function() {
    if (!current_user_can('administrator')) return;
    if (!isset($_GET['debug_precios'])) return;

    $pais = duendes_obtener_pais();
    $cookie = $_COOKIE['duendes_pais'] ?? 'no hay';
    echo "<!-- DUENDES DEBUG
    País detectado: {$pais}
    Cookie: {$cookie}
    Es Uruguay: " . (duendes_es_uruguay() ? 'SÍ' : 'NO') . "
    -->";
});
