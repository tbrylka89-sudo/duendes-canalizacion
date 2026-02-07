<?php
/**
 * Plugin Name: Duendes Producto Adoptado
 * Description: Mensaje especial para productos sin stock - muestra quién lo adoptó
 * Version: 2.0
 */

if (!defined('ABSPATH')) exit;

/**
 * Buscar quién compró este producto
 */
function duendes_obtener_adoptante($product_id) {
    global $wpdb;

    $result = $wpdb->get_row($wpdb->prepare("
        SELECT pm.meta_value as nombre
        FROM {$wpdb->prefix}woocommerce_order_items oi
        JOIN {$wpdb->prefix}woocommerce_order_itemmeta oim ON oi.order_item_id = oim.order_item_id
        JOIN {$wpdb->posts} o ON oi.order_id = o.ID
        JOIN {$wpdb->postmeta} pm ON o.ID = pm.post_id AND pm.meta_key = '_billing_first_name'
        WHERE oim.meta_key = '_product_id'
        AND oim.meta_value = %d
        AND o.post_status IN ('wc-completed', 'wc-processing')
        ORDER BY o.ID DESC
        LIMIT 1
    ", $product_id));

    if ($result && !empty($result->nombre)) {
        return ucfirst(strtolower($result->nombre));
    }
    return null;
}

/**
 * Verificar si producto está agotado y agregar datos al footer
 */
add_action('wp_footer', function() {
    // Debug: siempre mostrar en páginas de producto
    if (!is_product() && !is_singular('product')) return;

    global $product;
    if (!$product) {
        $product = wc_get_product(get_the_ID());
    }

    // Si aún no hay producto, intentar obtenerlo del query
    if (!$product) {
        global $post;
        if ($post && $post->post_type === 'product') {
            $product = wc_get_product($post->ID);
        }
    }

    if (!$product) return;

    // Verificar stock status
    $stock_status = $product->get_stock_status();
    $is_in_stock = $product->is_in_stock();
    $meta_status = get_post_meta($product->get_id(), '_stock_status', true);

    $is_outofstock = ($stock_status === 'outofstock' || !$is_in_stock || $meta_status === 'outofstock');

    if (!$is_outofstock) return;

    // Obtener datos
    $nombre_guardian = $product->get_name();
    $nombre_guardian = preg_replace('/^(Guardián|Guardian|Pixie|Duende)\s*[-–]\s*/i', '', $nombre_guardian);
    $nombre_guardian = trim($nombre_guardian);

    $adoptante = duendes_obtener_adoptante($product->get_id());

    if ($adoptante) {
        $mensaje = $adoptante . ' ya selló su pacto con ' . $nombre_guardian;
    } else {
        $mensaje = 'Alguien ya selló su pacto con ' . $nombre_guardian;
    }
    ?>
    <script>
    document.addEventListener('DOMContentLoaded', function() {
        // Ocultar botones de compra
        var selectoresBotones = [
            '.prod-btn', '.prod-cta-btn', '.single_add_to_cart_button',
            'form.cart', '.quantity', '[class*="add-to-cart"]',
            '.elementor-add-to-cart', '.elementor-widget-woocommerce-product-add-to-cart',
            '.woocommerce-variation-add-to-cart', 'button[name="add-to-cart"]'
        ];
        selectoresBotones.forEach(function(sel) {
            document.querySelectorAll(sel).forEach(function(el) {
                el.style.display = 'none';
            });
        });

        // Crear mensaje de adoptado
        var mensaje = document.createElement('div');
        mensaje.className = 'duendes-adoptado-mensaje';
        mensaje.innerHTML = '<span class="adoptado-texto"><?php echo esc_js($mensaje); ?></span>' +
            '<span class="adoptado-subtexto">Este guardián ya encontró su hogar</span>';

        // Buscar dónde insertar - múltiples opciones
        var insertado = false;

        // Opción 1: Después del widget de precio de Elementor
        var precioWidget = document.querySelector('.elementor-widget-woocommerce-product-price');
        if (precioWidget && !insertado) {
            precioWidget.after(mensaje);
            insertado = true;
        }

        // Opción 2: Después de cualquier contenedor de precio
        if (!insertado) {
            var precio = document.querySelector('.price, .product-price, .woocommerce-Price-amount');
            if (precio) {
                var contenedor = precio.closest('.elementor-widget') || precio.parentNode;
                contenedor.after(mensaje);
                insertado = true;
            }
        }

        // Opción 3: Después del título
        if (!insertado) {
            var titulo = document.querySelector('.elementor-widget-woocommerce-product-title, .product_title, h1.entry-title, h1');
            if (titulo) {
                var contenedorTitulo = titulo.closest('.elementor-widget') || titulo.parentNode;
                contenedorTitulo.after(mensaje);
                insertado = true;
            }
        }

        // Opción 4: Al principio del contenido principal
        if (!insertado) {
            var main = document.querySelector('.elementor-location-single, .product, main, #content');
            if (main) {
                main.prepend(mensaje);
                insertado = true;
            }
        }

        // Opción 5: Después de la imagen del producto
        if (!insertado) {
            var imagen = document.querySelector('.woocommerce-product-gallery, .elementor-widget-woocommerce-product-images, [class*="product-image"]');
            if (imagen) {
                imagen.after(mensaje);
                insertado = true;
            }
        }

        // Opción 6: En el body como último recurso
        if (!insertado) {
            document.body.appendChild(mensaje);
            mensaje.style.position = 'fixed';
            mensaje.style.bottom = '20px';
            mensaje.style.left = '50%';
            mensaje.style.transform = 'translateX(-50%)';
            mensaje.style.zIndex = '99999';
        }

        // Forzar visibilidad
        mensaje.style.display = 'block';
        mensaje.style.visibility = 'visible';
        mensaje.style.opacity = '1';

        // Ocultar mensaje de stock original
        var stockMsg = document.querySelector('.stock.out-of-stock');
        if (stockMsg) stockMsg.style.display = 'none';
    });
    </script>
    <?php
});

/**
 * Estilos CSS
 */
add_action('wp_head', function() {
    if (!is_product()) return;
    ?>
    <style id="duendes-adoptado-css">
    .duendes-adoptado-mensaje {
        background: linear-gradient(145deg, #1a1510 0%, #0d0a05 100%) !important;
        border: 2px solid #C6A962 !important;
        border-radius: 8px !important;
        padding: 15px 20px !important;
        text-align: center !important;
        margin: 15px auto !important;
        box-shadow: 0 5px 20px rgba(0,0,0,0.4) !important;
        display: block !important;
        visibility: visible !important;
        opacity: 1 !important;
        width: calc(100% - 30px) !important;
        max-width: 350px !important;
        z-index: 9999 !important;
        position: relative !important;
        box-sizing: border-box !important;
    }
    .adoptado-texto {
        display: block !important;
        font-family: 'Cinzel', serif !important;
        font-size: 15px !important;
        color: #C6A962 !important;
        font-weight: 600 !important;
        letter-spacing: 0.5px !important;
        margin-bottom: 5px !important;
        line-height: 1.4 !important;
    }
    .adoptado-subtexto {
        display: block !important;
        font-family: 'Cormorant Garamond', serif !important;
        font-size: 13px !important;
        color: rgba(255,255,255,0.6) !important;
        font-style: italic !important;
    }
    .stock.out-of-stock {
        display: none !important;
    }
    @media (max-width: 480px) {
        .duendes-adoptado-mensaje {
            padding: 12px 15px !important;
            margin: 10px auto !important;
            border-radius: 6px !important;
        }
        .adoptado-texto {
            font-size: 14px !important;
        }
        .adoptado-subtexto {
            font-size: 12px !important;
        }
    }
    </style>
    <?php
});
