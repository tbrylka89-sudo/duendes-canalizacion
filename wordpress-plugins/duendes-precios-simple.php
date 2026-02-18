<?php
/**
 * Plugin Name: Duendes - Precios Simple
 * Description: Precios fijos UYU para Uruguay, USD + aproximado para resto del mundo
 * Version: 1.0
 */

if (!defined('ABSPATH')) exit;

// Tabla de precios fijos para Uruguay
if (!defined('DUENDES_PRECIOS_UYU')) {
define('DUENDES_PRECIOS_UYU', array(
    75 => 2500,     // Mini Clasico ($70 USD)
    160 => 5500,    // Mini Especial / Pixie ($150 USD)
    210 => 8000,    // Mediano Especial ($200 USD)
    500 => 16500,   // Grande Especial ($450 USD)
    9999 => 39800   // Gigante ($1050 USD)
));
}

// Tasas aproximadas para mostrar moneda local (solo referencia)
if (!defined('DUENDES_TASAS')) {
define('DUENDES_TASAS', array(
    'ARS' => 1350,
    'MXN' => 21,
    'COP' => 4400,
    'CLP' => 1000,
    'PEN' => 3.80,
    'EUR' => 0.95
));
}

// Convertir USD a UYU fijo
if (!function_exists('duendes_usd_a_uyu')) {
function duendes_usd_a_uyu($precio_usd) {
    $tabla = DUENDES_PRECIOS_UYU;
    foreach ($tabla as $limite => $precio_uyu) {
        if ($precio_usd <= $limite) {
            return $precio_uyu;
        }
    }
    return 39800; // Maximo
}
}

// Detectar pais del visitante
if (!function_exists('duendes_detectar_pais')) {
function duendes_detectar_pais() {
    // Primero revisar cookie/session
    if (isset($_COOKIE['duendes_pais'])) {
        return sanitize_text_field($_COOKIE['duendes_pais']);
    }
    
    // Revisar WooCommerce geolocation
    if (class_exists('WC_Geolocation')) {
        $geo = WC_Geolocation::geolocate_ip();
        if (!empty($geo['country'])) {
            return $geo['country'];
        }
    }
    
    return ''; // No detectado
}
}

// Guardar pais seleccionado
if (!function_exists('duendes_set_pais')) {
add_action('wp_ajax_duendes_set_pais', 'duendes_set_pais');
add_action('wp_ajax_nopriv_duendes_set_pais', 'duendes_set_pais');
function duendes_set_pais() {
    $pais = isset($_POST['pais']) ? sanitize_text_field($_POST['pais']) : '';
    if ($pais) {
        setcookie('duendes_pais', $pais, time() + (365 * 24 * 60 * 60), '/');
        wp_send_json_success(array('pais' => $pais));
    }
    wp_send_json_error();
}
}

// Modificar precios mostrados
if (!function_exists('duendes_modificar_precio_html')) {
add_filter('woocommerce_get_price_html', 'duendes_modificar_precio_html', 100, 2);
function duendes_modificar_precio_html($price_html, $product) {
    $pais = duendes_detectar_pais();
    $precio_usd = floatval($product->get_price());
    
    if (empty($precio_usd)) return $price_html;
    
    // Uruguay: precio fijo en UYU
    if ($pais === 'UY') {
        $precio_uyu = duendes_usd_a_uyu($precio_usd);
        return '<span class="woocommerce-Price-amount amount">$' . number_format($precio_uyu, 0, ',', '.') . ' <span class="woocommerce-Price-currencySymbol">UYU</span></span>';
    }
    
    // Resto del mundo: USD + aproximado en moneda local
    $tasas = DUENDES_TASAS;
    $monedas = array(
        'AR' => array('codigo' => 'ARS', 'nombre' => 'pesos argentinos'),
        'MX' => array('codigo' => 'MXN', 'nombre' => 'pesos mexicanos'),
        'CO' => array('codigo' => 'COP', 'nombre' => 'pesos colombianos'),
        'CL' => array('codigo' => 'CLP', 'nombre' => 'pesos chilenos'),
        'PE' => array('codigo' => 'PEN', 'nombre' => 'soles'),
        'ES' => array('codigo' => 'EUR', 'nombre' => 'euros'),
    );
    
    $precio_base = '<span class="woocommerce-Price-amount amount">$' . number_format($precio_usd, 0) . ' <span class="woocommerce-Price-currencySymbol">USD</span></span>';
    
    // Si hay pais conocido, agregar aproximado
    if ($pais && isset($monedas[$pais])) {
        $info = $monedas[$pais];
        $tasa = $tasas[$info['codigo']] ?? 1;
        $precio_local = round($precio_usd * $tasa);
        $precio_base .= '<br><small style="color:#888; font-size:12px;">(aprox. $' . number_format($precio_local, 0, ',', '.') . ' ' . $info['nombre'] . ')</small>';
    }
    
    return $precio_base;
}
}

// Selector de pais en el header
if (!function_exists('duendes_selector_pais')) {
add_action('wp_footer', 'duendes_selector_pais');
function duendes_selector_pais() {
    if (is_admin()) return;
    
    $pais_actual = duendes_detectar_pais();
    ?>
    <style>
    .duendes-pais-selector {
        position: fixed;
        bottom: 20px;
        left: 20px;
        background: #1a1a1a;
        border: 1px solid rgba(201,162,39,0.3);
        border-radius: 8px;
        padding: 10px 15px;
        z-index: 9999;
        font-family: 'Cormorant Garamond', serif;
        box-shadow: 0 4px 15px rgba(0,0,0,0.3);
    }
    .duendes-pais-selector select {
        background: transparent;
        border: none;
        color: #c9a227;
        font-size: 14px;
        cursor: pointer;
        font-family: inherit;
    }
    .duendes-pais-selector select option {
        background: #1a1a1a;
        color: #fff;
    }
    .duendes-pais-label {
        color: rgba(255,255,255,0.6);
        font-size: 11px;
        display: block;
        margin-bottom: 3px;
    }
    </style>
    
    <div class="duendes-pais-selector">
        <span class="duendes-pais-label">Ver precios en:</span>
        <select id="duendes-pais-select" onchange="duendesCambiarPais(this.value)">
            <option value="" <?php echo $pais_actual === '' ? 'selected' : ''; ?>>USD (Internacional)</option>
            <option value="UY" <?php echo $pais_actual === 'UY' ? 'selected' : ''; ?>>Uruguay (UYU)</option>
            <option value="AR" <?php echo $pais_actual === 'AR' ? 'selected' : ''; ?>>Argentina (ARS)</option>
            <option value="MX" <?php echo $pais_actual === 'MX' ? 'selected' : ''; ?>>Mexico (MXN)</option>
            <option value="CO" <?php echo $pais_actual === 'CO' ? 'selected' : ''; ?>>Colombia (COP)</option>
            <option value="CL" <?php echo $pais_actual === 'CL' ? 'selected' : ''; ?>>Chile (CLP)</option>
            <option value="PE" <?php echo $pais_actual === 'PE' ? 'selected' : ''; ?>>Peru (PEN)</option>
            <option value="ES" <?php echo $pais_actual === 'ES' ? 'selected' : ''; ?>>Espana (EUR)</option>
        </select>
    </div>
    
    <script>
    function duendesCambiarPais(pais) {
        document.cookie = 'duendes_pais=' + pais + ';path=/;max-age=31536000';
        location.reload();
    }
    </script>
    <?php
}
}
