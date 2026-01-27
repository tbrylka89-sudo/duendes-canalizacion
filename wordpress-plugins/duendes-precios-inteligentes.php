<?php
/**
 * Plugin Name: Duendes - Precios Inteligentes
 * Description: Uruguay ve precios fijos en UYU, resto del mundo ve USD + aproximado en moneda local
 * Version: 1.0.0
 * Author: Duendes del Uruguay
 */

if (!defined('ABSPATH')) exit;

// ═══════════════════════════════════════════════════════════════════════════
// DESACTIVAR OTROS PLUGINS DE MONEDA
// ═══════════════════════════════════════════════════════════════════════════

// Desactivar Multi Currency (WooCommerce Multi Currency)
add_filter('wmc_get_price', function($price) { return $price; }, 999999);
add_filter('wmc_raw_price_filter', function($price) { return $price; }, 999999);
add_filter('wmc_change_raw_price', function($price) { return $price; }, 999999);

// Desactivar CURCY
add_filter('wmc_enable', '__return_false', 999999);
add_filter('curcy_enable', '__return_false', 999999);

// Remover filtros de precio de otros plugins
add_action('init', function() {
    // Remover filtros de WMC si existe
    remove_all_filters('woocommerce_product_get_price', 10);
    remove_all_filters('woocommerce_product_get_regular_price', 10);
    remove_all_filters('woocommerce_product_get_sale_price', 10);
}, 1);

// ═══════════════════════════════════════════════════════════════════════════
// CONFIGURACIÓN
// ═══════════════════════════════════════════════════════════════════════════

define('DUENDES_COTIZACIONES_CACHE', 6 * HOUR_IN_SECONDS); // Cachear cotizaciones 6 horas

// Tabla de precios fijos USD → UYU para Uruguay
// Basado en rangos de precio USD
$GLOBALS['duendes_precios_uyu'] = [
    // [precio_usd_min, precio_usd_max, precio_uyu_fijo]
    [0, 100, 2500],        // Mini clásicos ($70 USD)
    [100, 175, 5500],      // Mini especiales y Pixies ($150 USD)
    [175, 350, 8000],      // Medianos especiales ($200 USD)
    [350, 800, 16500],     // Grandes ($450 USD)
    [800, 99999, 39800],   // Gigantes ($1050 USD)
];

function duendes_obtener_precio_uyu_fijo($precio_usd) {
    global $duendes_precios_uyu;

    foreach ($duendes_precios_uyu as $rango) {
        if ($precio_usd >= $rango[0] && $precio_usd < $rango[1]) {
            return $rango[2];
        }
    }

    // Si no encaja en ningún rango, calcular con tasa 36
    return round($precio_usd * 36);
}

// Monedas soportadas para mostrar aproximado
$GLOBALS['duendes_monedas'] = [
    // Latinoamérica
    'AR' => ['codigo' => 'ARS', 'nombre' => 'pesos argentinos', 'simbolo' => '$'],
    'MX' => ['codigo' => 'MXN', 'nombre' => 'pesos mexicanos', 'simbolo' => '$'],
    'CO' => ['codigo' => 'COP', 'nombre' => 'pesos colombianos', 'simbolo' => '$'],
    'CL' => ['codigo' => 'CLP', 'nombre' => 'pesos chilenos', 'simbolo' => '$'],
    'PE' => ['codigo' => 'PEN', 'nombre' => 'soles', 'simbolo' => 'S/'],
    'BR' => ['codigo' => 'BRL', 'nombre' => 'reales', 'simbolo' => 'R$'],
    'EC' => ['codigo' => 'USD', 'nombre' => 'dólares', 'simbolo' => '$'], // Ecuador usa USD
    'VE' => ['codigo' => 'VES', 'nombre' => 'bolívares', 'simbolo' => 'Bs.'],
    'BO' => ['codigo' => 'BOB', 'nombre' => 'bolivianos', 'simbolo' => 'Bs'],
    'PY' => ['codigo' => 'PYG', 'nombre' => 'guaraníes', 'simbolo' => '₲'],
    'CR' => ['codigo' => 'CRC', 'nombre' => 'colones', 'simbolo' => '₡'],
    'PA' => ['codigo' => 'USD', 'nombre' => 'dólares', 'simbolo' => '$'], // Panamá usa USD
    'GT' => ['codigo' => 'GTQ', 'nombre' => 'quetzales', 'simbolo' => 'Q'],
    'DO' => ['codigo' => 'DOP', 'nombre' => 'pesos dominicanos', 'simbolo' => 'RD$'],
    'PR' => ['codigo' => 'USD', 'nombre' => 'dólares', 'simbolo' => '$'], // Puerto Rico usa USD
    'CU' => ['codigo' => 'CUP', 'nombre' => 'pesos cubanos', 'simbolo' => '$'],
    'HN' => ['codigo' => 'HNL', 'nombre' => 'lempiras', 'simbolo' => 'L'],
    'SV' => ['codigo' => 'USD', 'nombre' => 'dólares', 'simbolo' => '$'], // El Salvador usa USD
    'NI' => ['codigo' => 'NIO', 'nombre' => 'córdobas', 'simbolo' => 'C$'],

    // Europa
    'ES' => ['codigo' => 'EUR', 'nombre' => 'euros', 'simbolo' => '€'],
    'FR' => ['codigo' => 'EUR', 'nombre' => 'euros', 'simbolo' => '€'],
    'DE' => ['codigo' => 'EUR', 'nombre' => 'euros', 'simbolo' => '€'],
    'IT' => ['codigo' => 'EUR', 'nombre' => 'euros', 'simbolo' => '€'],
    'PT' => ['codigo' => 'EUR', 'nombre' => 'euros', 'simbolo' => '€'],
    'NL' => ['codigo' => 'EUR', 'nombre' => 'euros', 'simbolo' => '€'],
    'BE' => ['codigo' => 'EUR', 'nombre' => 'euros', 'simbolo' => '€'],
    'AT' => ['codigo' => 'EUR', 'nombre' => 'euros', 'simbolo' => '€'],
    'IE' => ['codigo' => 'EUR', 'nombre' => 'euros', 'simbolo' => '€'],
    'GB' => ['codigo' => 'GBP', 'nombre' => 'libras', 'simbolo' => '£'],
    'CH' => ['codigo' => 'CHF', 'nombre' => 'francos suizos', 'simbolo' => 'CHF'],

    // Norteamérica
    'US' => ['codigo' => 'USD', 'nombre' => 'dólares', 'simbolo' => '$'],
    'CA' => ['codigo' => 'CAD', 'nombre' => 'dólares canadienses', 'simbolo' => 'CA$'],

    // Otros
    'AU' => ['codigo' => 'AUD', 'nombre' => 'dólares australianos', 'simbolo' => 'A$'],
    'NZ' => ['codigo' => 'NZD', 'nombre' => 'dólares neozelandeses', 'simbolo' => 'NZ$'],
    'JP' => ['codigo' => 'JPY', 'nombre' => 'yenes', 'simbolo' => '¥'],
    'IL' => ['codigo' => 'ILS', 'nombre' => 'shekels', 'simbolo' => '₪'],
];

// ═══════════════════════════════════════════════════════════════════════════
// DETECCIÓN DE PAÍS
// ═══════════════════════════════════════════════════════════════════════════

function duendes_detectar_pais() {
    // 1. Verificar si hay país guardado en sesión/cookie
    if (isset($_COOKIE['duendes_pais'])) {
        return sanitize_text_field($_COOKIE['duendes_pais']);
    }

    // 2. Intentar detectar por IP usando servicio gratuito
    $pais = get_transient('duendes_pais_' . duendes_get_client_ip_hash());
    if ($pais) {
        return $pais;
    }

    // 3. Detectar por IP
    $ip = duendes_get_client_ip();
    if ($ip && $ip !== '127.0.0.1') {
        // Usar ip-api.com (gratis, 45 requests/min)
        $response = wp_remote_get("http://ip-api.com/json/{$ip}?fields=countryCode", [
            'timeout' => 3,
            'sslverify' => false
        ]);

        if (!is_wp_error($response)) {
            $body = json_decode(wp_remote_retrieve_body($response), true);
            if (!empty($body['countryCode'])) {
                $pais = $body['countryCode'];
                set_transient('duendes_pais_' . duendes_get_client_ip_hash(), $pais, DAY_IN_SECONDS);
                return $pais;
            }
        }
    }

    // 4. Default: mostrar USD
    return 'US';
}

function duendes_get_client_ip() {
    $ip_keys = ['HTTP_CF_CONNECTING_IP', 'HTTP_X_FORWARDED_FOR', 'HTTP_X_REAL_IP', 'REMOTE_ADDR'];
    foreach ($ip_keys as $key) {
        if (!empty($_SERVER[$key])) {
            $ip = explode(',', $_SERVER[$key])[0];
            $ip = trim($ip);
            if (filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE)) {
                return $ip;
            }
        }
    }
    return $_SERVER['REMOTE_ADDR'] ?? '';
}

function duendes_get_client_ip_hash() {
    return md5(duendes_get_client_ip());
}

function duendes_es_uruguay() {
    return duendes_detectar_pais() === 'UY';
}

// ═══════════════════════════════════════════════════════════════════════════
// COTIZACIONES EN TIEMPO REAL
// ═══════════════════════════════════════════════════════════════════════════

function duendes_obtener_cotizaciones() {
    $cached = get_transient('duendes_cotizaciones');
    if ($cached) {
        return $cached;
    }

    // Obtener de exchangerate-api.com (gratis)
    $response = wp_remote_get('https://api.exchangerate-api.com/v4/latest/USD', [
        'timeout' => 5
    ]);

    $cotizaciones = [
        'ARS' => 1000,  // Fallback
        'MXN' => 17,
        'COP' => 4000,
        'CLP' => 900,
        'PEN' => 3.7,
        'BRL' => 5,
        'EUR' => 0.92,
        'UYU' => 40,
    ];

    if (!is_wp_error($response)) {
        $body = json_decode(wp_remote_retrieve_body($response), true);
        if (!empty($body['rates'])) {
            foreach ($cotizaciones as $moneda => $fallback) {
                if (isset($body['rates'][$moneda])) {
                    $cotizaciones[$moneda] = $body['rates'][$moneda];
                }
            }
        }
    }

    set_transient('duendes_cotizaciones', $cotizaciones, DUENDES_COTIZACIONES_CACHE);
    return $cotizaciones;
}

function duendes_convertir_usd_a_moneda($usd, $moneda) {
    $cotizaciones = duendes_obtener_cotizaciones();
    if (isset($cotizaciones[$moneda])) {
        return round($usd * $cotizaciones[$moneda]);
    }
    return null;
}

// ═══════════════════════════════════════════════════════════════════════════
// CAMPO PRECIO UYU EN PRODUCTOS
// ═══════════════════════════════════════════════════════════════════════════

// Agregar campo en el admin de productos
add_action('woocommerce_product_options_pricing', 'duendes_campo_precio_uyu');
function duendes_campo_precio_uyu() {
    echo '<div class="options_group" style="border-top: 1px solid #eee; padding-top: 10px; margin-top: 10px;">';
    echo '<p style="padding-left: 12px; font-weight: bold; color: #0073aa;">🇺🇾 Precio para Uruguay (fijo)</p>';

    woocommerce_wp_text_input([
        'id' => '_precio_uyu',
        'label' => 'Precio UYU (opcional)',
        'description' => 'Solo si necesitás un precio diferente al automático. Dejalo vacío para usar: Mini $2.500 / Mini Esp. $5.500 / Mediano $8.000 / Grande $16.500 / Gigante $39.800',
        'desc_tip' => true,
        'type' => 'number',
        'custom_attributes' => [
            'step' => '1',
            'min' => '0'
        ]
    ]);

    echo '</div>';
}

// Guardar campo
add_action('woocommerce_process_product_meta', 'duendes_guardar_precio_uyu');
function duendes_guardar_precio_uyu($post_id) {
    if (isset($_POST['_precio_uyu'])) {
        update_post_meta($post_id, '_precio_uyu', sanitize_text_field($_POST['_precio_uyu']));
    }
}

// ═══════════════════════════════════════════════════════════════════════════
// MODIFICAR DISPLAY DE PRECIOS
// ═══════════════════════════════════════════════════════════════════════════

// Filtrar el precio HTML en TODOS los contextos con máxima prioridad
add_filter('woocommerce_get_price_html', 'duendes_precio_inteligente_html', 999999, 2);
add_filter('woocommerce_variable_price_html', 'duendes_precio_inteligente_html', 999999, 2);
add_filter('woocommerce_variable_sale_price_html', 'duendes_precio_inteligente_html', 999999, 2);
add_filter('woocommerce_grouped_price_html', 'duendes_precio_inteligente_html', 999999, 2);

function duendes_precio_inteligente_html($price_html, $product) {
    // No modificar en admin (excepto AJAX)
    if (is_admin() && !wp_doing_ajax()) {
        return $price_html;
    }

    // Evitar recursión
    static $procesando = [];
    $product_id = $product->get_id();
    if (isset($procesando[$product_id])) {
        return $price_html;
    }
    $procesando[$product_id] = true;

    // Obtener precio base en USD
    $precio_usd = floatval($product->get_price());
    if ($precio_usd <= 0) {
        unset($procesando[$product_id]);
        return $price_html;
    }

    $pais = duendes_detectar_pais();

    // ═══════════════════════════════════════════════════════════════
    // URUGUAY - Precio fijo en UYU (según tabla de precios)
    // ═══════════════════════════════════════════════════════════════
    if ($pais === 'UY') {
        // Primero verificar si hay precio UYU personalizado guardado
        $precio_uyu = get_post_meta($product_id, '_precio_uyu', true);

        // Si no hay, usar la tabla de precios fijos
        if (empty($precio_uyu)) {
            $precio_uyu = duendes_obtener_precio_uyu_fijo($precio_usd);
        }

        $precio_formateado = number_format($precio_uyu, 0, ',', '.');

        unset($procesando[$product_id]);
        return '<span class="duendes-precio duendes-precio-uy">
            <span class="precio-principal">$' . $precio_formateado . ' <small>UYU</small></span>
        </span>';
    }

    // ═══════════════════════════════════════════════════════════════
    // RESTO DEL MUNDO - USD + aproximado en moneda local
    // ═══════════════════════════════════════════════════════════════
    $precio_usd_formateado = number_format($precio_usd, 0, ',', '.');
    $html = '<span class="duendes-precio duendes-precio-usd">';
    $html .= '<span class="precio-principal">$' . $precio_usd_formateado . ' <small>USD</small></span>';

    // Agregar aproximado si tenemos la moneda del país
    global $duendes_monedas;
    if (isset($duendes_monedas[$pais]) && $pais !== 'US') {
        $moneda_info = $duendes_monedas[$pais];
        $precio_local = duendes_convertir_usd_a_moneda($precio_usd, $moneda_info['codigo']);

        if ($precio_local) {
            $precio_local_formateado = number_format($precio_local, 0, ',', '.');
            $html .= '<span class="precio-aproximado">';
            $html .= '(aprox. ' . $moneda_info['simbolo'] . $precio_local_formateado . ' ' . $moneda_info['nombre'] . ')';
            $html .= '</span>';
        }
    }

    $html .= '</span>';
    unset($procesando[$product_id]);
    return $html;
}

// ═══════════════════════════════════════════════════════════════════════════
// MODIFICAR PRECIO EN CARRITO Y CHECKOUT
// ═══════════════════════════════════════════════════════════════════════════

add_filter('woocommerce_cart_item_price', 'duendes_precio_carrito', 100, 3);
function duendes_precio_carrito($price, $cart_item, $cart_item_key) {
    if (duendes_es_uruguay()) {
        $product = $cart_item['data'];
        $precio_usd = floatval($product->get_price());
        $precio_uyu = get_post_meta($product->get_id(), '_precio_uyu', true);

        if (empty($precio_uyu)) {
            $precio_uyu = duendes_obtener_precio_uyu_fijo($precio_usd);
        }

        return '<span class="duendes-precio-uy">$' . number_format($precio_uyu, 0, ',', '.') . ' UYU</span>';
    }
    return $price;
}

add_filter('woocommerce_cart_item_subtotal', 'duendes_subtotal_carrito', 100, 3);
function duendes_subtotal_carrito($subtotal, $cart_item, $cart_item_key) {
    if (duendes_es_uruguay()) {
        $product = $cart_item['data'];
        $precio_usd = floatval($product->get_price());
        $precio_uyu = get_post_meta($product->get_id(), '_precio_uyu', true);

        if (empty($precio_uyu)) {
            $precio_uyu = duendes_obtener_precio_uyu_fijo($precio_usd);
        }

        $subtotal_uyu = $precio_uyu * $cart_item['quantity'];
        return '<span class="duendes-precio-uy">$' . number_format($subtotal_uyu, 0, ',', '.') . ' UYU</span>';
    }
    return $subtotal;
}

// ═══════════════════════════════════════════════════════════════════════════
// ESTILOS
// ═══════════════════════════════════════════════════════════════════════════

add_action('wp_head', 'duendes_precios_estilos');
function duendes_precios_estilos() {
    $pais = duendes_detectar_pais();
    $es_uruguay = ($pais === 'UY');
    ?>
    <script>
    // Datos de precios para JavaScript
    window.DUENDES_PRECIOS = {
        pais: '<?php echo esc_js($pais); ?>',
        esUruguay: <?php echo $es_uruguay ? 'true' : 'false'; ?>,
        tablaUYU: {
            70: 2500,
            150: 5500,
            200: 8000,
            450: 16500,
            1050: 39800
        }
    };
    </script>
    <style id="duendes-precios-inteligentes">
    .duendes-precio {
        display: flex;
        flex-direction: column;
        gap: 2px;
    }

    .duendes-precio .precio-principal {
        font-size: 1.1em;
        font-weight: 600;
        color: #d4af37;
    }

    .duendes-precio .precio-principal small {
        font-size: 0.7em;
        font-weight: 400;
        opacity: 0.8;
    }

    .duendes-precio .precio-aproximado {
        font-size: 0.8em;
        color: rgba(255,255,255,0.6);
        font-style: italic;
    }

    /* En tienda/catálogo */
    .products .duendes-precio .precio-aproximado {
        font-size: 0.75em;
    }

    /* En página de producto */
    .single-product .duendes-precio .precio-principal {
        font-size: 1.4em;
    }

    /* Carrito */
    .woocommerce-cart .duendes-precio-uy,
    .woocommerce-checkout .duendes-precio-uy {
        color: #d4af37;
        font-weight: 600;
    }
    </style>
    <?php
}

// ═══════════════════════════════════════════════════════════════════════════
// SELECTOR DE PAÍS (OPCIONAL - para que el usuario cambie manualmente)
// ═══════════════════════════════════════════════════════════════════════════

// Selector de país desactivado del footer - ahora va en el header
// add_action('wp_footer', 'duendes_selector_pais_widget');
function duendes_selector_pais_widget() {
    $pais_actual = duendes_detectar_pais();
    $banderas = [
        'UY' => '🇺🇾',
        'AR' => '🇦🇷',
        'MX' => '🇲🇽',
        'CO' => '🇨🇴',
        'CL' => '🇨🇱',
        'PE' => '🇵🇪',
        'BR' => '🇧🇷',
        'ES' => '🇪🇸',
        'US' => '🇺🇸',
    ];
    $nombres = [
        'UY' => 'Uruguay',
        'AR' => 'Argentina',
        'MX' => 'México',
        'CO' => 'Colombia',
        'CL' => 'Chile',
        'PE' => 'Perú',
        'BR' => 'Brasil',
        'ES' => 'España',
        'US' => 'Estados Unidos',
    ];
    ?>
    <div class="duendes-pais-selector" id="duendesPaisSelector">
        <button class="duendes-pais-btn" id="duendesPaisBtn" title="Cambiar país">
            <?php echo $banderas[$pais_actual] ?? '🌎'; ?>
        </button>
        <div class="duendes-pais-dropdown" id="duendesPaisDropdown">
            <div class="duendes-pais-titulo">Elegí tu país</div>
            <?php foreach ($banderas as $codigo => $bandera): ?>
                <a href="#" data-pais="<?php echo $codigo; ?>" class="<?php echo $codigo === $pais_actual ? 'active' : ''; ?>">
                    <?php echo $bandera . ' ' . $nombres[$codigo]; ?>
                </a>
            <?php endforeach; ?>
        </div>
    </div>

    <style>
    .duendes-pais-selector {
        position: fixed;
        bottom: 25px;
        left: 20px;
        z-index: 99999;
    }

    .duendes-pais-btn {
        width: 40px;
        height: 40px;
        background: #0a0a0a;
        border: 1px solid rgba(212,175,55,0.4);
        border-radius: 50%;
        cursor: pointer;
        font-size: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s;
        padding: 0;
        line-height: 1;
    }

    .duendes-pais-btn:hover {
        border-color: #d4af37;
        transform: scale(1.1);
    }

    .duendes-pais-dropdown {
        position: absolute;
        bottom: 50px;
        left: 0;
        background: #0a0a0a;
        border: 1px solid rgba(212,175,55,0.4);
        border-radius: 12px;
        padding: 10px 0;
        display: none;
        min-width: 160px;
        box-shadow: 0 10px 40px rgba(0,0,0,0.5);
    }

    .duendes-pais-dropdown.visible {
        display: block;
    }

    .duendes-pais-titulo {
        padding: 8px 15px 10px;
        font-size: 11px;
        color: rgba(255,255,255,0.5);
        letter-spacing: 1px;
        border-bottom: 1px solid rgba(255,255,255,0.1);
        margin-bottom: 5px;
    }

    .duendes-pais-dropdown a {
        display: block;
        padding: 8px 15px;
        color: rgba(255,255,255,0.85);
        text-decoration: none;
        font-size: 14px;
        transition: all 0.2s;
    }

    .duendes-pais-dropdown a:hover {
        background: rgba(212,175,55,0.15);
        color: #d4af37;
    }

    .duendes-pais-dropdown a.active {
        color: #d4af37;
        font-weight: 600;
    }

    @media (max-width: 768px) {
        .duendes-pais-selector {
            bottom: 20px;
            left: 15px;
        }

        .duendes-pais-btn {
            width: 36px;
            height: 36px;
            font-size: 18px;
        }
    }
    </style>

    <script>
    (function() {
        var btn = document.getElementById('duendesPaisBtn');
        var dropdown = document.getElementById('duendesPaisDropdown');

        if (!btn || !dropdown) return;

        btn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            dropdown.classList.toggle('visible');
        });

        dropdown.querySelectorAll('a').forEach(function(link) {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                var pais = this.dataset.pais;
                document.cookie = 'duendes_pais=' + pais + '; path=/; max-age=' + (365*24*60*60);
                location.reload();
            });
        });

        document.addEventListener('click', function(e) {
            if (!e.target.closest('.duendes-pais-selector')) {
                dropdown.classList.remove('visible');
            }
        });
    })();
    </script>
    <?php
}

// ═══════════════════════════════════════════════════════════════════════════
// AJAX PARA OBTENER PRECIO (para usar desde JS si es necesario)
// ═══════════════════════════════════════════════════════════════════════════

add_action('wp_ajax_duendes_get_precio', 'duendes_ajax_get_precio');
add_action('wp_ajax_nopriv_duendes_get_precio', 'duendes_ajax_get_precio');
function duendes_ajax_get_precio() {
    $product_id = intval($_GET['product_id'] ?? 0);
    if (!$product_id) {
        wp_send_json_error('No product ID');
    }

    $product = wc_get_product($product_id);
    if (!$product) {
        wp_send_json_error('Product not found');
    }

    $pais = duendes_detectar_pais();
    $precio_usd = floatval($product->get_price());

    $response = [
        'pais' => $pais,
        'es_uruguay' => $pais === 'UY',
        'precio_usd' => $precio_usd,
    ];

    if ($pais === 'UY') {
        $precio_uyu = get_post_meta($product_id, '_precio_uyu', true);
        if (empty($precio_uyu)) {
            $precio_uyu = duendes_obtener_precio_uyu_fijo($precio_usd);
        }
        $response['precio_uyu'] = intval($precio_uyu);
        $response['precio_mostrar'] = '$' . number_format($precio_uyu, 0, ',', '.') . ' UYU';
    } else {
        $response['precio_mostrar'] = '$' . number_format($precio_usd, 0) . ' USD';

        global $duendes_monedas;
        if (isset($duendes_monedas[$pais]) && $pais !== 'US') {
            $moneda_info = $duendes_monedas[$pais];
            $precio_local = duendes_convertir_usd_a_moneda($precio_usd, $moneda_info['codigo']);
            if ($precio_local) {
                $response['precio_local'] = $precio_local;
                $response['moneda_local'] = $moneda_info['codigo'];
                $response['precio_aproximado'] = 'aprox. ' . $moneda_info['simbolo'] . number_format($precio_local, 0, ',', '.') . ' ' . $moneda_info['nombre'];
            }
        }
    }

    wp_send_json_success($response);
}

// ═══════════════════════════════════════════════════════════════════════════
// SOBRESCRIBIR PRECIOS DE ELEMENTOR (que muestran "$X PESOS")
// ═══════════════════════════════════════════════════════════════════════════

add_action('wp_footer', 'duendes_corregir_precios_elementor', 999);
function duendes_corregir_precios_elementor() {
    $pais = duendes_detectar_pais();
    $es_uruguay = ($pais === 'UY');
    ?>
    <script>
    (function() {
        // Tabla de conversión USD → UYU
        var tablaUYU = [
            {min: 0, max: 100, uyu: 2500},      // Mini clásicos ($70)
            {min: 100, max: 175, uyu: 5500},    // Mini especiales y Pixies ($150)
            {min: 175, max: 350, uyu: 8000},    // Medianos especiales ($200)
            {min: 350, max: 800, uyu: 16500},   // Grandes ($450)
            {min: 800, max: 99999, uyu: 39800}  // Gigantes ($1050)
        ];

        function obtenerPrecioUYU(usd) {
            for (var i = 0; i < tablaUYU.length; i++) {
                if (usd >= tablaUYU[i].min && usd < tablaUYU[i].max) {
                    return tablaUYU[i].uyu;
                }
            }
            return Math.round(usd * 40);
        }

        function formatearNumero(num) {
            return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        }

        function corregirPrecios() {
            var esUruguay = <?php echo $es_uruguay ? 'true' : 'false'; ?>;

            // Buscar elementos con precios en formato "$X.XXX PESOS" o "$X,XXX PESOS"
            var elementos = document.querySelectorAll('*');
            elementos.forEach(function(el) {
                if (el.children.length === 0 || el.classList.contains('duendes-precio')) {
                    var texto = el.textContent || el.innerText;
                    // Detectar formato "$6.450 PESOS" o similar
                    var matchPesos = texto.match(/\$\s*([\d.,]+)\s*PESOS/i);
                    if (matchPesos) {
                        // Extraer el número
                        var numStr = matchPesos[1].replace(/\./g, '').replace(/,/g, '');
                        var num = parseInt(numStr);

                        // Esto viene del plugin Multi Currency que convierte USD a UYU con tasa incorrecta
                        // Necesitamos volver a USD y luego aplicar nuestra tabla
                        // Asumimos que usaban tasa ~43, entonces $6,450 / 43 ≈ $150 USD
                        var tasaAproximada = 43;
                        var usdAproximado = Math.round(num / tasaAproximada);

                        if (esUruguay) {
                            var precioUYU = obtenerPrecioUYU(usdAproximado);
                            el.innerHTML = '<span class="duendes-precio duendes-precio-uy"><span class="precio-principal">$' + formatearNumero(precioUYU) + ' <small>UYU</small></span></span>';
                        } else {
                            el.innerHTML = '<span class="duendes-precio duendes-precio-usd"><span class="precio-principal">$' + usdAproximado + ' <small>USD</small></span></span>';
                        }
                    }
                }
            });

            // También buscar elementos específicos de Elementor con clase de precio
            document.querySelectorAll('.elementor-widget-woocommerce-products .price, .woocommerce-Price-amount').forEach(function(el) {
                if (el.classList.contains('duendes-corregido')) return;

                var texto = el.textContent || el.innerText;
                var matchPesos = texto.match(/\$\s*([\d.,]+)\s*(?:PESOS|pesos)?/i);
                if (matchPesos && texto.toLowerCase().includes('pesos')) {
                    var numStr = matchPesos[1].replace(/\./g, '').replace(/,/g, '');
                    var num = parseInt(numStr);
                    var tasaAproximada = 43;
                    var usdAproximado = Math.round(num / tasaAproximada);

                    if (esUruguay) {
                        var precioUYU = obtenerPrecioUYU(usdAproximado);
                        el.innerHTML = '$' + formatearNumero(precioUYU) + ' <small>UYU</small>';
                    } else {
                        el.innerHTML = '$' + usdAproximado + ' <small>USD</small>';
                    }
                    el.classList.add('duendes-corregido');
                }
            });
        }

        // Ejecutar al cargar
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', corregirPrecios);
        } else {
            corregirPrecios();
        }

        // También ejecutar después de un delay para elementos cargados dinámicamente
        setTimeout(corregirPrecios, 500);
        setTimeout(corregirPrecios, 1500);
        setTimeout(corregirPrecios, 3000);

        // Observer para elementos nuevos
        if (typeof MutationObserver !== 'undefined') {
            var observer = new MutationObserver(function(mutations) {
                corregirPrecios();
            });
            observer.observe(document.body, { childList: true, subtree: true });
        }
    })();
    </script>
    <?php
}
