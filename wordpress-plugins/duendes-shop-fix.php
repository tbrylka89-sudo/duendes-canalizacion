<?php
/**
 * Plugin Name: Duendes - Shop Fix
 * Description: Muestra TODOS los productos en /shop/ y corrige precios
 * Version: 1.0.0
 */

if (!defined('ABSPATH')) exit;

// ═══════════════════════════════════════════════════════════════════════════
// MOSTRAR TODOS LOS PRODUCTOS EN /SHOP/
// ═══════════════════════════════════════════════════════════════════════════

// Aumentar productos por página a un número muy alto
add_filter('loop_shop_per_page', function($cols) {
    return 999; // Mostrar hasta 999 productos
}, 999);

// También modificar la query de WooCommerce
add_action('pre_get_posts', function($query) {
    if (!is_admin() && $query->is_main_query()) {
        if (is_shop() || is_product_category()) {
            $query->set('posts_per_page', 999);
            $query->set('nopaging', true);
        }
    }
}, 999);

// Asegurar que WooCommerce muestre todos
add_filter('woocommerce_product_query', function($query) {
    $query->set('posts_per_page', 999);
    return $query;
}, 999);

// ═══════════════════════════════════════════════════════════════════════════
// FORZAR PRECIOS CORRECTOS EN FRONTEND (JavaScript)
// ═══════════════════════════════════════════════════════════════════════════

add_action('wp_footer', 'duendes_forzar_precios_js', 99999);
function duendes_forzar_precios_js() {
    // Detectar país
    $pais = 'US';
    if (isset($_COOKIE['duendes_pais'])) {
        $pais = sanitize_text_field($_COOKIE['duendes_pais']);
    } elseif (function_exists('duendes_detectar_pais')) {
        $pais = duendes_detectar_pais();
    }

    $es_uruguay = ($pais === 'UY');
    ?>
    <script id="duendes-forzar-precios">
    (function() {
        var esUruguay = <?php echo $es_uruguay ? 'true' : 'false'; ?>;
        var paisActual = '<?php echo esc_js($pais); ?>';

        // Tabla de conversión: precio en UYU → precio correcto
        // Los productos tienen precios en UYU ($6,450), necesitamos mostrar los correctos
        var tablaConversion = {
            // Precio UYU aproximado → [precio USD, precio UYU fijo]
            // $70 USD = ~$3,010 UYU (con tasa 43)
            // $150 USD = ~$6,450 UYU
            // $200 USD = ~$8,600 UYU
            // $450 USD = ~$19,350 UYU
            // $1050 USD = ~$45,150 UYU
        };

        // Función para convertir precio UYU a precio correcto
        function convertirPrecio(precioUYU) {
            var tasa = 43;
            var usdAprox = Math.round(precioUYU / tasa);

            // Determinar categoría basada en USD aproximado
            if (usdAprox <= 100) {
                return { usd: 70, uyu: 2500, tipo: 'Mini Clásico' };
            } else if (usdAprox <= 175) {
                return { usd: 150, uyu: 5500, tipo: 'Pixie/Mini Especial' };
            } else if (usdAprox <= 350) {
                return { usd: 200, uyu: 8000, tipo: 'Mediano' };
            } else if (usdAprox <= 800) {
                return { usd: 450, uyu: 16500, tipo: 'Grande' };
            } else {
                return { usd: 1050, uyu: 39800, tipo: 'Gigante' };
            }
        }

        function formatearNumero(num) {
            return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        }

        function corregirPrecios() {
            // Buscar todos los elementos de precio
            var selectores = [
                '.price',
                '.woocommerce-Price-amount',
                '[class*="price"]',
                '.elementor-widget-woocommerce-products .price'
            ];

            selectores.forEach(function(sel) {
                document.querySelectorAll(sel).forEach(function(el) {
                    // Evitar procesar dos veces
                    if (el.dataset.duendesCorregido) return;

                    var texto = el.textContent || el.innerText || '';

                    // Detectar precio en formato "$X.XXX" o "$X,XXX" con "PESOS" o "UYU"
                    var match = texto.match(/\$\s*([\d.,]+)/);
                    if (!match) return;

                    // Verificar si dice PESOS o UYU (indica que está en pesos uruguayos)
                    var esPesos = /PESOS|UYU|pesos/i.test(texto);
                    if (!esPesos) return; // Solo corregir si está en pesos

                    // Extraer número
                    var numStr = match[1].replace(/\./g, '').replace(/,/g, '');
                    var precioUYU = parseInt(numStr);

                    if (isNaN(precioUYU) || precioUYU < 1000) return;

                    // Convertir a precio correcto
                    var conversion = convertirPrecio(precioUYU);

                    // Crear HTML nuevo
                    var nuevoHTML;
                    if (esUruguay) {
                        nuevoHTML = '<span class="duendes-precio duendes-precio-uy">' +
                            '<span class="precio-principal">$' + formatearNumero(conversion.uyu) + ' <small>UYU</small></span>' +
                            '</span>';
                    } else {
                        nuevoHTML = '<span class="duendes-precio duendes-precio-usd">' +
                            '<span class="precio-principal">$' + conversion.usd + ' <small>USD</small></span>' +
                            '</span>';
                    }

                    el.innerHTML = nuevoHTML;
                    el.dataset.duendesCorregido = 'true';
                });
            });
        }

        // Ejecutar múltiples veces para elementos dinámicos
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', corregirPrecios);
        } else {
            corregirPrecios();
        }

        setTimeout(corregirPrecios, 100);
        setTimeout(corregirPrecios, 500);
        setTimeout(corregirPrecios, 1000);
        setTimeout(corregirPrecios, 2000);
        setTimeout(corregirPrecios, 3000);

        // Observer para elementos nuevos
        if (typeof MutationObserver !== 'undefined') {
            var observer = new MutationObserver(function() {
                corregirPrecios();
            });
            observer.observe(document.body, { childList: true, subtree: true });
        }
    })();
    </script>

    <style>
    /* Estilos para precios corregidos */
    .duendes-precio {
        display: inline-flex !important;
        flex-direction: column !important;
        gap: 2px !important;
    }
    .duendes-precio .precio-principal {
        font-size: 1.1em !important;
        font-weight: 600 !important;
        color: #d4af37 !important;
    }
    .duendes-precio .precio-principal small {
        font-size: 0.7em !important;
        font-weight: 400 !important;
        opacity: 0.8 !important;
    }
    </style>
    <?php
}
