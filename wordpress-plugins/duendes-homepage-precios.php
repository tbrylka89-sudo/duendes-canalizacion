<?php
/**
 * Plugin Name: Duendes - Homepage Precios
 * Description: Convierte precios del homepage segun pais
 * Version: 1.0
 */

if (!defined('ABSPATH')) exit;

// Solo en el inicio
add_action('wp_footer', function() {
    if (!is_front_page() && !is_home()) return;
    
    // Tabla de precios Uruguay
    $precios_uyu = array(
        70 => 2500,
        150 => 5500,
        200 => 8000,
        450 => 16500,
        1050 => 39800
    );
    ?>
    <script>
    (function() {
        var preciosUYU = <?php echo json_encode($precios_uyu); ?>;
        
        function obtenerPais() {
            var match = document.cookie.match(/duendes_pais=([^;]+)/);
            return match ? match[1] : '';
        }
        
        function convertirPreciosHomepage() {
            var pais = obtenerPais();
            if (pais !== 'UY') return;
            
            // Buscar todos los elementos con precios
            document.querySelectorAll('.price, .product-card-info .price, [class*="price"]').forEach(function(el) {
                var texto = el.textContent.trim();
                var match = texto.match(/\$(\d+)/);
                if (match) {
                    var precioUSD = parseInt(match[1]);
                    var precioUYU = preciosUYU[precioUSD];
                    if (precioUYU) {
                        el.textContent = '$' + precioUYU.toLocaleString('es-UY') + ' UYU';
                        el.style.color = '#B8973A';
                    }
                }
            });
            
            // Buscar precios en spans dentro de product-card-info
            document.querySelectorAll('.product-card-info').forEach(function(card) {
                var priceEl = card.querySelector('.price');
                if (!priceEl) {
                    // Buscar span con precio
                    card.querySelectorAll('span').forEach(function(span) {
                        var texto = span.textContent.trim();
                        if (texto.match(/^\$\d+$/)) {
                            var precioUSD = parseInt(texto.replace('$', ''));
                            var precioUYU = preciosUYU[precioUSD];
                            if (precioUYU) {
                                span.textContent = '$' + precioUYU.toLocaleString('es-UY') + ' UYU';
                            }
                        }
                    });
                }
            });
        }
        
        // Ejecutar cuando cargue y cuando cambie el selector
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', convertirPreciosHomepage);
        } else {
            convertirPreciosHomepage();
        }
        
        // Re-ejecutar si cambia la cookie (por el selector)
        var lastPais = obtenerPais();
        setInterval(function() {
            var pais = obtenerPais();
            if (pais !== lastPais) {
                lastPais = pais;
                location.reload();
            }
        }, 500);
    })();
    </script>
    <?php
});
