<?php
/**
 * Plugin Name: ZZZ Duendes Precios Final
 * Description: Sistema de precios definitivo - Se carga último
 * Version: 1.0.0
 */

if (!defined('ABSPATH')) exit;

// ═══════════════════════════════════════════════════════════════════════════
// 1. MOSTRAR TODOS LOS PRODUCTOS
// ═══════════════════════════════════════════════════════════════════════════

add_action('pre_get_posts', function($query) {
    if (is_admin()) return;

    if ($query->is_main_query() && (is_shop() || is_product_category() || is_product_tag())) {
        $query->set('posts_per_page', -1); // -1 = TODOS
    }
}, 99999);

add_filter('loop_shop_per_page', function() {
    return 9999;
}, 99999);

// ═══════════════════════════════════════════════════════════════════════════
// 2. DETECTAR PAÍS
// ═══════════════════════════════════════════════════════════════════════════

function zzz_obtener_pais() {
    // Primero revisar cookie
    if (!empty($_COOKIE['duendes_pais'])) {
        return strtoupper(sanitize_text_field($_COOKIE['duendes_pais']));
    }

    // Detectar por IP
    $ip = '';
    foreach (['HTTP_CF_CONNECTING_IP', 'HTTP_X_FORWARDED_FOR', 'HTTP_X_REAL_IP', 'REMOTE_ADDR'] as $key) {
        if (!empty($_SERVER[$key])) {
            $ip = explode(',', $_SERVER[$key])[0];
            $ip = trim($ip);
            break;
        }
    }

    if ($ip && $ip !== '127.0.0.1') {
        $cached = get_transient('zzz_pais_' . md5($ip));
        if ($cached) return $cached;

        $response = @file_get_contents("http://ip-api.com/json/{$ip}?fields=countryCode");
        if ($response) {
            $data = json_decode($response, true);
            if (!empty($data['countryCode'])) {
                $pais = strtoupper($data['countryCode']);
                set_transient('zzz_pais_' . md5($ip), $pais, DAY_IN_SECONDS);
                return $pais;
            }
        }
    }

    return 'US'; // Default
}

function zzz_es_uruguay() {
    return zzz_obtener_pais() === 'UY';
}

// ═══════════════════════════════════════════════════════════════════════════
// 3. TABLA DE PRECIOS FIJOS PARA URUGUAY
// ═══════════════════════════════════════════════════════════════════════════

function zzz_precio_uyu_fijo($precio_base) {
    // Si el precio es muy alto (>1000), probablemente está en UYU, convertir a USD primero
    if ($precio_base > 1000) {
        $precio_base = round($precio_base / 43);
    }

    // Tabla de precios fijos
    if ($precio_base <= 100) return 2500;      // Mini clásicos ($70 USD)
    if ($precio_base <= 175) return 5500;      // Pixies, Mini especiales ($150 USD)
    if ($precio_base <= 350) return 8000;      // Medianos ($200 USD)
    if ($precio_base <= 800) return 16500;     // Grandes ($450 USD)
    return 39800;                               // Gigantes ($1050 USD)
}

function zzz_precio_usd($precio_base) {
    // Si el precio es muy alto (>1000), convertir de UYU a USD
    if ($precio_base > 1000) {
        $precio_base = round($precio_base / 43);
    }

    // Normalizar a precios estándar
    if ($precio_base <= 100) return 70;
    if ($precio_base <= 175) return 150;
    if ($precio_base <= 350) return 200;
    if ($precio_base <= 800) return 450;
    return 1050;
}

// ═══════════════════════════════════════════════════════════════════════════
// MONEDAS LOCALES PARA APROXIMADO
// ═══════════════════════════════════════════════════════════════════════════

function zzz_obtener_moneda_local($pais) {
    $monedas = [
        // Latinoamérica
        'AR' => ['codigo' => 'ARS', 'nombre' => 'pesos argentinos', 'simbolo' => '$', 'tasa' => 1000],
        'MX' => ['codigo' => 'MXN', 'nombre' => 'pesos mexicanos', 'simbolo' => '$', 'tasa' => 17],
        'CO' => ['codigo' => 'COP', 'nombre' => 'pesos colombianos', 'simbolo' => '$', 'tasa' => 4200],
        'CL' => ['codigo' => 'CLP', 'nombre' => 'pesos chilenos', 'simbolo' => '$', 'tasa' => 950],
        'PE' => ['codigo' => 'PEN', 'nombre' => 'soles', 'simbolo' => 'S/', 'tasa' => 3.7],
        'BR' => ['codigo' => 'BRL', 'nombre' => 'reales', 'simbolo' => 'R$', 'tasa' => 5.5],
        'VE' => ['codigo' => 'VES', 'nombre' => 'bolívares', 'simbolo' => 'Bs.', 'tasa' => 40],
        'BO' => ['codigo' => 'BOB', 'nombre' => 'bolivianos', 'simbolo' => 'Bs', 'tasa' => 6.9],
        'PY' => ['codigo' => 'PYG', 'nombre' => 'guaraníes', 'simbolo' => '₲', 'tasa' => 7500],
        'CR' => ['codigo' => 'CRC', 'nombre' => 'colones', 'simbolo' => '₡', 'tasa' => 510],
        'GT' => ['codigo' => 'GTQ', 'nombre' => 'quetzales', 'simbolo' => 'Q', 'tasa' => 7.8],
        'DO' => ['codigo' => 'DOP', 'nombre' => 'pesos dominicanos', 'simbolo' => 'RD$', 'tasa' => 58],
        'HN' => ['codigo' => 'HNL', 'nombre' => 'lempiras', 'simbolo' => 'L', 'tasa' => 25],
        'NI' => ['codigo' => 'NIO', 'nombre' => 'córdobas', 'simbolo' => 'C$', 'tasa' => 37],
        // Europa
        'ES' => ['codigo' => 'EUR', 'nombre' => 'euros', 'simbolo' => '€', 'tasa' => 0.92],
        'FR' => ['codigo' => 'EUR', 'nombre' => 'euros', 'simbolo' => '€', 'tasa' => 0.92],
        'DE' => ['codigo' => 'EUR', 'nombre' => 'euros', 'simbolo' => '€', 'tasa' => 0.92],
        'IT' => ['codigo' => 'EUR', 'nombre' => 'euros', 'simbolo' => '€', 'tasa' => 0.92],
        'PT' => ['codigo' => 'EUR', 'nombre' => 'euros', 'simbolo' => '€', 'tasa' => 0.92],
        'GB' => ['codigo' => 'GBP', 'nombre' => 'libras', 'simbolo' => '£', 'tasa' => 0.79],
        // Norteamérica
        'CA' => ['codigo' => 'CAD', 'nombre' => 'dólares canadienses', 'simbolo' => 'CA$', 'tasa' => 1.36],
        // Otros
        'AU' => ['codigo' => 'AUD', 'nombre' => 'dólares australianos', 'simbolo' => 'A$', 'tasa' => 1.55],
        'IL' => ['codigo' => 'ILS', 'nombre' => 'shekels', 'simbolo' => '₪', 'tasa' => 3.6],
    ];

    return isset($monedas[$pais]) ? $monedas[$pais] : null;
}

function zzz_precio_aproximado_local($precio_usd, $pais) {
    $moneda = zzz_obtener_moneda_local($pais);
    if (!$moneda || $pais === 'US' || $pais === 'UY') return '';

    $precio_local = round($precio_usd * $moneda['tasa']);
    $formateado = number_format($precio_local, 0, ',', '.');

    return '<span class="zzz-aprox">(aprox. ' . $moneda['simbolo'] . $formateado . ' ' . $moneda['nombre'] . ')</span>';
}

// ═══════════════════════════════════════════════════════════════════════════
// 4. FILTRAR PRECIO HTML - PRIORIDAD MÁXIMA
// ═══════════════════════════════════════════════════════════════════════════

function zzz_precio_html($price_html, $product) {
    if (is_admin() && !wp_doing_ajax()) return $price_html;

    static $procesando = [];
    $id = $product->get_id();
    if (isset($procesando[$id])) return $price_html;
    $procesando[$id] = true;

    $precio_base = floatval($product->get_price());
    if ($precio_base <= 0) {
        unset($procesando[$id]);
        return $price_html;
    }

    $pais = zzz_obtener_pais();

    if ($pais === 'UY') {
        $precio = zzz_precio_uyu_fijo($precio_base);
        $html = '<span class="zzz-precio zzz-uy">$' . number_format($precio, 0, ',', '.') . ' <small>UYU</small></span>';
    } else {
        $precio = zzz_precio_usd($precio_base);
        $aprox = zzz_precio_aproximado_local($precio, $pais);
        $html = '<span class="zzz-precio zzz-usd">$' . $precio . ' <small>USD</small>';
        if ($aprox) {
            $html .= ' ' . $aprox;
        }
        $html .= '</span>';
    }

    unset($procesando[$id]);
    return $html;
}

// Registrar filtros con prioridad máxima
add_filter('woocommerce_get_price_html', 'zzz_precio_html', 999999, 2);
add_filter('woocommerce_variable_price_html', 'zzz_precio_html', 999999, 2);
add_filter('woocommerce_grouped_price_html', 'zzz_precio_html', 999999, 2);

// ═══════════════════════════════════════════════════════════════════════════
// 5. ESTILOS Y JAVASCRIPT DE RESPALDO
// ═══════════════════════════════════════════════════════════════════════════

add_action('wp_head', function() {
    $pais = zzz_obtener_pais();
    ?>
    <style>
    .zzz-precio { color: #d4af37 !important; font-weight: 600 !important; display: inline-flex !important; flex-direction: column !important; gap: 2px !important; }
    .zzz-precio small { font-size: 0.75em !important; opacity: 0.8 !important; }
    .zzz-aprox { font-size: 0.75em !important; color: #9a8866 !important; font-style: italic !important; font-weight: 400 !important; display: block !important; }
    </style>
    <script>
    window.DUENDES_PAIS = '<?php echo esc_js($pais); ?>';
    window.DUENDES_ES_UY = <?php echo zzz_es_uruguay() ? 'true' : 'false'; ?>;

    // Actualizar bandera del header según geolocalización
    document.addEventListener('DOMContentLoaded', function() {
        var banderas = {
            'UY': '🇺🇾', 'AR': '🇦🇷', 'MX': '🇲🇽', 'CO': '🇨🇴', 'CL': '🇨🇱',
            'PE': '🇵🇪', 'BR': '🇧🇷', 'ES': '🇪🇸', 'US': '🇺🇸', 'CA': '🇨🇦',
            'GB': '🇬🇧', 'FR': '🇫🇷', 'DE': '🇩🇪', 'IT': '🇮🇹', 'PT': '🇵🇹',
            'EC': '🇪🇨', 'VE': '🇻🇪', 'BO': '🇧🇴', 'PY': '🇵🇾', 'CR': '🇨🇷',
            'PA': '🇵🇦', 'GT': '🇬🇹', 'DO': '🇩🇴', 'PR': '🇵🇷', 'CU': '🇨🇺',
            'AU': '🇦🇺', 'IL': '🇮🇱'
        };
        var btn = document.getElementById('dhPaisBtn');
        if (btn) {
            var emoji = btn.querySelector('.dh-bandera-emoji');
            if (emoji) {
                emoji.textContent = banderas[window.DUENDES_PAIS] || '🌎';
            }
        }
    });
    </script>
    <?php
}, 1);

add_action('wp_footer', function() {
    ?>
    <script>
    (function() {
        var esUY = window.DUENDES_ES_UY;

        function precioUYU(base) {
            if (base > 1000) base = Math.round(base / 43);
            if (base <= 100) return 2500;
            if (base <= 175) return 5500;
            if (base <= 350) return 8000;
            if (base <= 800) return 16500;
            return 39800;
        }

        function precioUSD(base) {
            if (base > 1000) base = Math.round(base / 43);
            if (base <= 100) return 70;
            if (base <= 175) return 150;
            if (base <= 350) return 200;
            if (base <= 800) return 450;
            return 1050;
        }

        function fmt(n) { return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "."); }

        function fix() {
            document.querySelectorAll('.price, .woocommerce-Price-amount, [class*="price"]').forEach(function(el) {
                if (el.classList.contains('zzz-precio') || el.dataset.zzzFixed) return;

                var txt = el.textContent || '';
                var m = txt.match(/\$\s*([\d.,]+)/);
                if (!m) return;

                var num = parseInt(m[1].replace(/[.,]/g, ''));
                if (isNaN(num) || num < 50) return;

                // Solo corregir si dice PESOS o si el número es muy alto
                if (!/pesos/i.test(txt) && num < 1500) return;

                if (esUY) {
                    el.innerHTML = '<span class="zzz-precio zzz-uy">$' + fmt(precioUYU(num)) + ' <small>UYU</small></span>';
                } else {
                    el.innerHTML = '<span class="zzz-precio zzz-usd">$' + precioUSD(num) + ' <small>USD</small></span>';
                }
                el.dataset.zzzFixed = '1';
            });
        }

        fix();
        setTimeout(fix, 500);
        setTimeout(fix, 1500);
        setTimeout(fix, 3000);

        if (typeof MutationObserver !== 'undefined') {
            new MutationObserver(fix).observe(document.body, {childList: true, subtree: true});
        }
    })();
    </script>
    <?php
}, 999999);

// ═══════════════════════════════════════════════════════════════════════════
// 6. SELECTOR DE PAÍS - GUARDAR COOKIE VIA AJAX
// ═══════════════════════════════════════════════════════════════════════════

add_action('wp_ajax_zzz_cambiar_pais', 'zzz_ajax_cambiar_pais');
add_action('wp_ajax_nopriv_zzz_cambiar_pais', 'zzz_ajax_cambiar_pais');
function zzz_ajax_cambiar_pais() {
    $pais = strtoupper(sanitize_text_field($_POST['pais'] ?? 'US'));
    setcookie('duendes_pais', $pais, time() + (365 * 24 * 60 * 60), '/');
    wp_send_json_success(['pais' => $pais]);
}

// JavaScript para el selector de país
add_action('wp_footer', function() {
    ?>
    <script>
    document.addEventListener('DOMContentLoaded', function() {
        // Selector de país en header
        var btn = document.getElementById('dhPaisBtn');
        var dropdown = document.getElementById('dhPaisDropdown');

        if (btn && dropdown) {
            btn.onclick = function(e) {
                e.preventDefault();
                e.stopPropagation();
                dropdown.classList.toggle('visible');
                console.log('Toggle dropdown', dropdown.classList.contains('visible'));
            };

            dropdown.querySelectorAll('a').forEach(function(link) {
                link.onclick = function(e) {
                    e.preventDefault();
                    var pais = this.dataset.pais;
                    console.log('Cambiando a país:', pais);

                    // Guardar cookie directamente
                    document.cookie = 'duendes_pais=' + pais + '; path=/; max-age=' + (365*24*60*60) + '; SameSite=Lax';

                    // Recargar página
                    window.location.reload();
                };
            });

            document.onclick = function(e) {
                if (!e.target.closest('.dh-pais-selector')) {
                    dropdown.classList.remove('visible');
                }
            };
        }
    });
    </script>
    <?php
}, 999999);
