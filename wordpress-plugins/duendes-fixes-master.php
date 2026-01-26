<?php
/**
 * Plugin Name: Duendes Fixes Master
 * Description: Plugin maestro que arregla todos los problemas de confianza del sitio
 * Version: 1.0.0
 * Author: Duendes del Uruguay
 */

if (!defined('ABSPATH')) exit;

// ═══════════════════════════════════════════════════════════════════════════
// 1. ELIMINAR PRODUCTO "PRUEBA" (USD 1)
// ═══════════════════════════════════════════════════════════════════════════

// Ocultar de tienda y categorias
add_action('pre_get_posts', function($query) {
    if (is_admin()) return;
    if (!$query->is_main_query()) return;

    if (is_shop() || is_product_category() || is_product_tag() || is_search()) {
        $prueba = get_page_by_path('prueba', OBJECT, 'product');
        if ($prueba) {
            $exclude = $query->get('post__not_in') ?: [];
            $exclude[] = $prueba->ID;
            $query->set('post__not_in', $exclude);
        }
    }
});

// Redirigir acceso directo
add_action('template_redirect', function() {
    if (!is_product()) return;
    global $post;
    if ($post && ($post->post_name === 'prueba' || stripos($post->post_title, 'prueba') !== false)) {
        wp_redirect(home_url('/shop/'), 301);
        exit;
    }
});

// ═══════════════════════════════════════════════════════════════════════════
// 2. ELIMINAR GRIMORIO PUBLICO DE TODO EL SITIO
// ═══════════════════════════════════════════════════════════════════════════

// CSS global para ocultar enlaces al Grimorio
add_action('wp_head', function() {
    ?>
    <style id="duendes-ocultar-grimorio">
    /* Ocultar Grimorio en menus y enlaces */
    .menu-item a[href*="grimorio"],
    .menu-item a[href*="Grimorio"],
    nav a[href*="grimorio"],
    footer a[href*="grimorio"],
    .widget a[href*="grimorio"],
    a[href*="/grimorio/"],
    a[href*="/el-grimorio/"],
    [class*="grimorio"],
    .grimorio-section,
    .grimorio-home,
    section[class*="grimorio"],
    .duendes-ocultar-grimorio {
        display: none !important;
    }
    </style>
    <?php
}, 1);

// JavaScript para ocultar sección Grimorio en homepage (busca por texto)
add_action('wp_footer', function() {
    if (!is_front_page() && !is_home()) return;
    ?>
    <script id="duendes-ocultar-grimorio-js">
    (function() {
        function ocultarGrimorio() {
            // Buscar elementos que contengan "El Grimorio" o "Grimorio"
            var elementos = document.querySelectorAll('h1, h2, h3, h4, .elementor-heading-title, .elementor-widget-heading');
            elementos.forEach(function(el) {
                var texto = el.textContent || el.innerText;
                if (texto && (texto.indexOf('Grimorio') !== -1 || texto.indexOf('GRIMORIO') !== -1)) {
                    // Subir hasta encontrar la sección padre
                    var parent = el.closest('.elementor-section') ||
                                 el.closest('.elementor-element') ||
                                 el.closest('section') ||
                                 el.parentElement.parentElement.parentElement.parentElement;
                    if (parent) {
                        parent.style.display = 'none';
                        parent.classList.add('duendes-ocultar-grimorio');
                    }
                }
            });
        }
        // Ejecutar al cargar y después de un pequeño delay (para Elementor)
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', ocultarGrimorio);
        } else {
            ocultarGrimorio();
        }
        setTimeout(ocultarGrimorio, 500);
        setTimeout(ocultarGrimorio, 1500);
    })();
    </script>
    <?php
}, 99);

// Filtrar enlaces del Grimorio de los menus
add_filter('wp_nav_menu_items', function($items) {
    $items = preg_replace('/<li[^>]*class="[^"]*menu-item[^"]*"[^>]*>\s*<a[^>]*href="[^"]*grimorio[^"]*"[^>]*>.*?<\/a>\s*<\/li>/is', '', $items);
    return $items;
}, 999);

// Redirigir paginas del Grimorio a home
add_action('template_redirect', function() {
    $uri = $_SERVER['REQUEST_URI'] ?? '';
    if (stripos($uri, 'grimorio') !== false) {
        wp_redirect(home_url('/'), 301);
        exit;
    }
});

// ═══════════════════════════════════════════════════════════════════════════
// 3. REPARAR /NOSOTROS/ - OCULTAR PLACEHOLDERS ROJOS
// ═══════════════════════════════════════════════════════════════════════════

add_action('wp_head', function() {
    $uri = $_SERVER['REQUEST_URI'] ?? '';
    if (stripos($uri, 'nosotros') === false && stripos($uri, 'sobre-nosotros') === false) return;
    ?>
    <style id="duendes-fix-nosotros">
    /* Ocultar placeholders y elementos rotos en Nosotros */
    .elementor-widget-container:empty,
    .elementor-shortcode:empty,
    img[src=""],
    img:not([src]),
    [style*="background-color: red"],
    [style*="background-color:#ff0000"],
    [style*="background:red"],
    [style*="border-color:red"],
    [style*="border-color:#ff0000"],
    .placeholder-image,
    [class*="placeholder"],
    .elementor-widget-image:has(img[src*="placeholder"]),
    .elementor-widget-image:has(img[src=""]),
    .elementor-icon-box-wrapper:has(.elementor-icon:empty) {
        display: none !important;
        visibility: hidden !important;
        height: 0 !important;
        overflow: hidden !important;
    }
    </style>
    <?php
}, 9999);

// JavaScript para ocultar placeholders dinamicos
add_action('wp_footer', function() {
    $uri = $_SERVER['REQUEST_URI'] ?? '';
    if (stripos($uri, 'nosotros') === false && stripos($uri, 'sobre-nosotros') === false) return;
    ?>
    <script id="duendes-fix-nosotros-js">
    document.addEventListener('DOMContentLoaded', function() {
        // Ocultar imagenes sin src o placeholder
        document.querySelectorAll('img').forEach(function(img) {
            if (!img.src || img.src === window.location.href ||
                img.src.includes('placeholder') || img.src === '') {
                var widget = img.closest('.elementor-widget');
                if (widget) widget.style.display = 'none';
            }
        });

        // Ocultar elementos con fondo rojo
        document.querySelectorAll('*').forEach(function(el) {
            var style = window.getComputedStyle(el);
            if (style.backgroundColor === 'rgb(255, 0, 0)' ||
                style.borderColor === 'rgb(255, 0, 0)') {
                el.style.display = 'none';
            }
        });
    });
    </script>
    <?php
});

// ═══════════════════════════════════════════════════════════════════════════
// 4. OCULTAR PRODUCTOS SIN IMAGEN
// ═══════════════════════════════════════════════════════════════════════════

// Excluir productos sin thumbnail del loop de tienda
add_action('pre_get_posts', function($query) {
    if (is_admin()) return;
    if (!$query->is_main_query()) return;

    if (is_shop() || is_product_category() || is_product_tag()) {
        $meta_query = $query->get('meta_query') ?: [];
        $meta_query[] = [
            'key' => '_thumbnail_id',
            'compare' => 'EXISTS'
        ];
        $query->set('meta_query', $meta_query);
    }
});

// Excluir de productos relacionados
add_filter('woocommerce_product_related_posts', function($related) {
    return array_filter($related, function($id) {
        return has_post_thumbnail($id);
    });
});

// CSS de respaldo
add_action('wp_head', function() {
    if (!is_shop() && !is_product_category()) return;
    ?>
    <style id="duendes-ocultar-sin-imagen">
    li.product:has(img[src*="woocommerce-placeholder"]),
    li.product:has(.tarot-no-image),
    .tarot-card:has(.tarot-no-image) {
        display: none !important;
    }
    </style>
    <?php
});

// ═══════════════════════════════════════════════════════════════════════════
// 5. CORREGIR FOOTER/TAG LINKS VACIOS (No products found)
// ═══════════════════════════════════════════════════════════════════════════

// Redirigir categorias/tags sin productos
add_action('template_redirect', function() {
    if (!is_product_tag() && !is_product_category()) return;
    global $wp_query;
    if (!$wp_query->have_posts() || $wp_query->found_posts === 0) {
        wp_redirect(home_url('/shop/'), 302);
        exit;
    }
});

// CSS para ocultar mensaje "No products found"
add_action('wp_head', function() {
    ?>
    <style id="duendes-ocultar-no-products">
    .woocommerce-info:empty,
    .woocommerce-no-products-found,
    .no-products-found,
    p:contains("No products were found"),
    p:contains("No se encontraron productos") {
        display: none !important;
    }
    </style>
    <?php
});

// ═══════════════════════════════════════════════════════════════════════════
// 6. UNIFICAR MENU Y URLs (shop -> tienda)
// ═══════════════════════════════════════════════════════════════════════════

// NOTA: Redirección shop->tienda DESACTIVADA porque WordPress ya redirige tienda->shop
// Esto causaba loop infinito
// add_action('template_redirect', function() {
//     $uri = $_SERVER['REQUEST_URI'] ?? '';
//     if (strpos($uri, '/tienda') === 0 && strpos($uri, '/shop') === false) {
//         $new_url = str_replace('/tienda', '/shop', $uri);
//         wp_redirect(home_url($new_url), 301);
//         exit;
//     }
// });

// Cambiar titulo de pagina Shop
add_filter('woocommerce_page_title', function($title) {
    if ($title === 'Shop' || $title === 'shop') {
        return 'Tienda Magica';
    }
    return $title;
});

// ═══════════════════════════════════════════════════════════════════════════
// 7. TRADUCIR TODO A ESPANOL RIOPLATENSE (VOSEO)
// ═══════════════════════════════════════════════════════════════════════════

add_filter('gettext', function($translated, $text, $domain) {
    $traducciones = [
        // Navegacion
        'Home' => 'Inicio',
        'Shop' => 'Tienda Magica',
        'Cart' => 'Carrito',
        'Checkout' => 'Finalizar Compra',
        'My Account' => 'Mi Cuenta',
        'Search' => 'Buscar',
        'Menu' => 'Menu',
        'Close' => 'Cerrar',
        'Close menu' => 'Cerrar menu',

        // Productos
        'Add to cart' => 'Sellar el Pacto',
        'Add to Cart' => 'Sellar el Pacto',
        'View cart' => 'Ver Carrito',
        'Buy now' => 'Adoptar Ahora',
        'Read more' => 'Conocer mas',
        'Select options' => 'Ver Opciones',
        'Out of stock' => 'Ya fue adoptado',
        'In stock' => 'Disponible',
        'Available' => 'Disponible',
        'Sale!' => 'Oportunidad',
        'Sale' => 'Oportunidad',
        'New!' => 'Recien llegado',
        'SKU:' => 'Codigo:',
        'SKU' => 'Codigo',
        'Category:' => 'Intencion:',
        'Categories:' => 'Intenciones:',
        'Tag:' => 'Energia:',
        'Tags:' => 'Energias:',
        'Product' => 'Guardian',
        'Products' => 'Guardianes',
        'product' => 'guardian',
        'products' => 'guardianes',

        // Carrito
        'Your cart is empty' => 'Tu carrito esta vacio',
        'Your cart is currently empty.' => 'Tu carrito esta vacio. Los guardianes te esperan.',
        'Return to shop' => 'Volver a la Tienda',
        'Continue shopping' => 'Seguir explorando',
        'Update cart' => 'Actualizar',
        'Apply coupon' => 'Aplicar',
        'Coupon code' => 'Codigo de descuento',
        'Remove this item' => 'Quitar',
        'Cart totals' => 'Total del Carrito',
        'Cart Totals' => 'Total del Carrito',
        'Subtotal' => 'Subtotal',
        'Total' => 'Total',
        'Proceed to checkout' => 'Ir a la Caja',
        'Proceed to Checkout' => 'Ir a la Caja',

        // Checkout
        'Billing details' => 'Datos de Facturacion',
        'Billing Details' => 'Datos de Facturacion',
        'Shipping details' => 'Datos de Envio',
        'First name' => 'Nombre',
        'Last name' => 'Apellido',
        'Company name' => 'Empresa (opcional)',
        'Country / Region' => 'Pais',
        'Country' => 'Pais',
        'Street address' => 'Direccion',
        'House number and street name' => 'Calle y numero',
        'Apartment, suite, unit, etc.' => 'Apartamento, oficina, etc.',
        'Apartment, suite, unit, etc. (optional)' => 'Apto, oficina (opcional)',
        'Town / City' => 'Ciudad',
        'City' => 'Ciudad',
        'State / County' => 'Departamento',
        'State' => 'Departamento',
        'Postcode / ZIP' => 'Codigo Postal',
        'Postcode' => 'Codigo Postal',
        'ZIP' => 'Codigo Postal',
        'Phone' => 'Telefono',
        'Email address' => 'Email',
        'Email' => 'Email',
        'Order notes' => 'Notas del pedido',
        'Notes about your order' => 'Alguna nota especial para nosotros',
        'Your order' => 'Tu Pedido',
        'Place order' => 'Confirmar Pedido',
        'Place Order' => 'Confirmar Pedido',
        'Have a coupon?' => 'Tenes un codigo?',
        'Click here to enter your code' => 'Ingresalo aca',
        'Ship to a different address?' => 'Enviar a otra direccion?',

        // Envio y Pago
        'Shipping' => 'Envio',
        'Shipping method' => 'Metodo de Envio',
        'Shipping Method' => 'Metodo de Envio',
        'Payment' => 'Pago',
        'Payment method' => 'Forma de Pago',
        'Payment Method' => 'Forma de Pago',
        'Free shipping' => 'Envio Gratis',
        'Free Shipping' => 'Envio Gratis',
        'Flat rate' => 'Tarifa Fija',
        'Local pickup' => 'Retiro en Persona',

        // Mi Cuenta
        'Dashboard' => 'Panel',
        'Orders' => 'Mis Pedidos',
        'Downloads' => 'Descargas',
        'Addresses' => 'Direcciones',
        'Account details' => 'Mis Datos',
        'Logout' => 'Cerrar Sesion',
        'Log out' => 'Cerrar Sesion',
        'Login' => 'Iniciar Sesion',
        'Log in' => 'Iniciar Sesion',
        'Register' => 'Registrarme',
        'Lost your password?' => 'Olvidaste tu clave?',
        'Remember me' => 'Recordarme',
        'Username or email address' => 'Email o usuario',
        'Username or email' => 'Email o usuario',
        'Password' => 'Contrasena',

        // Mensajes
        'has been added to your cart' => 'fue agregado a tu carrito',
        'has been added to your cart.' => 'fue agregado a tu carrito.',
        'Order received' => 'Pedido recibido',
        'Thank you. Your order has been received.' => 'Gracias! Tu pedido fue recibido. Pronto recibiras tu guardian.',
        'Order details' => 'Detalles del pedido',
        'This product is currently out of stock and unavailable.' => 'Este guardian ya fue adoptado por alguien mas.',
        'Sorry, this product cannot be purchased.' => 'Este guardian ya encontro su hogar.',

        // Reviews
        'Reviews' => 'Experiencias',
        'Review' => 'Experiencia',
        'reviews' => 'experiencias',
        'There are no reviews yet.' => 'Aun no hay experiencias compartidas.',
        'Be the first to review' => 'Comparti tu experiencia con',
        'Your review' => 'Tu experiencia',
        'Your rating' => 'Tu valoracion',
        'Submit' => 'Enviar',

        // Relacionados
        'Related products' => 'Guardianes que Resuenan',
        'Related Products' => 'Guardianes que Resuenan',
        'You may also like' => 'Tambien podrian llamarte',
        'You may also like...' => 'Tambien podrian llamarte...',

        // Busqueda
        'Search results' => 'Resultados',
        'Search Results' => 'Resultados',
        'Search results for' => 'Resultados para',
        'No products were found matching your selection.' => 'No encontramos guardianes con esa busqueda. Proba con otras palabras.',
        'No products found' => 'No hay guardianes disponibles',
        'Search for:' => 'Buscar:',

        // Formularios
        'Subscribe' => 'Suscribirme',
        'Suscribete' => 'Suscribirme',
        'Suscribirse' => 'Suscribirme',
        'Newsletter' => 'Novedades',
        'Enter your email' => 'Tu email',
        'Your email' => 'Tu email',
        'Required' => 'Obligatorio',
        'optional' => 'opcional',
        'Optional' => 'Opcional',

        // Filtros
        'Filter' => 'Filtrar',
        'Filters' => 'Filtros',
        'Sort by' => 'Ordenar por',
        'Default sorting' => 'Orden predeterminado',
        'Sort by popularity' => 'Mas populares',
        'Sort by average rating' => 'Mejor valorados',
        'Sort by latest' => 'Mas recientes',
        'Sort by price: low to high' => 'Precio: menor a mayor',
        'Sort by price: high to low' => 'Precio: mayor a menor',

        // Paginacion
        'Previous' => 'Anterior',
        'Next' => 'Siguiente',
        'Page' => 'Pagina',

        // Errores
        'Error' => 'Error',
        'An error occurred' => 'Ocurrio un error',
        'Please try again' => 'Por favor intenta de nuevo',
        'Something went wrong' => 'Algo salio mal',
    ];

    return $traducciones[$text] ?? $translated;
}, 20, 3);

// Convertir tuteo a voseo en textos dinamicos
add_filter('gettext', function($translated) {
    $reemplazos = [
        'tienes' => 'tenes',
        'Tienes' => 'Tenes',
        'puedes' => 'podes',
        'Puedes' => 'Podes',
        'quieres' => 'queres',
        'Quieres' => 'Queres',
        'debes' => 'debes',
        'eres' => 'sos',
        'Eres' => 'Sos',
        'Haz ' => 'Hace ',
        'haz ' => 'hace ',
        ' tu ' => ' tu ', // mantener posesivo
        'sabes' => 'sabes',
        'vienes' => 'venis',
        'Vienes' => 'Venis',
    ];

    foreach ($reemplazos as $tuteo => $voseo) {
        $translated = str_replace($tuteo, $voseo, $translated);
    }

    return $translated;
}, 21);

// ═══════════════════════════════════════════════════════════════════════════
// 8. CORREGIR CHECHU (NO MENCIONAR MACA)
// ═══════════════════════════════════════════════════════════════════════════

add_filter('the_content', function($content) {
    if (!is_product()) return $content;
    global $post;
    if (!$post) return $content;

    // Si es Chechu, remover referencias a Maca
    if (stripos($post->post_title, 'chechu') !== false) {
        $content = preg_replace('/\b[Mm]aca\b/', '', $content);
        $content = preg_replace('/junto a Maca/i', '', $content);
        $content = preg_replace('/con Maca/i', '', $content);
        $content = preg_replace('/y Maca/i', '', $content);
        $content = preg_replace('/de Maca/i', '', $content);
        // Limpiar espacios dobles
        $content = preg_replace('/\s+/', ' ', $content);
    }

    return $content;
});

add_filter('woocommerce_short_description', function($desc) {
    global $post;
    if (!$post) return $desc;

    if (stripos($post->post_title, 'chechu') !== false) {
        $desc = preg_replace('/\b[Mm]aca\b/', '', $desc);
        $desc = preg_replace('/junto a Maca/i', '', $desc);
        $desc = preg_replace('/con Maca/i', '', $desc);
        $desc = preg_replace('/y Maca/i', '', $desc);
        $desc = preg_replace('/\s+/', ' ', $desc);
    }

    return $desc;
});

// ═══════════════════════════════════════════════════════════════════════════
// 9. TEMPLATE DIGITAL PARA CIRCULO Y LECTURA ANCESTRAL
// ═══════════════════════════════════════════════════════════════════════════

add_action('template_redirect', function() {
    if (!is_product()) return;

    global $post, $product;
    $product = wc_get_product($post->ID);
    if (!$product) return;

    // Detectar si es producto digital
    $es_digital = false;
    $titulo_lower = strtolower($post->post_title);
    $cats = wp_get_post_terms($post->ID, 'product_cat', ['fields' => 'slugs']);

    if (in_array('circulo', $cats) ||
        in_array('lectura-ancestral', $cats) ||
        in_array('digital', $cats) ||
        in_array('experiencia', $cats) ||
        $product->is_virtual() ||
        $product->is_downloadable() ||
        strpos($titulo_lower, 'circulo') !== false ||
        strpos($titulo_lower, 'lectura ancestral') !== false ||
        strpos($titulo_lower, 'experiencia') !== false) {
        $es_digital = true;
    }

    if ($es_digital) {
        duendes_render_producto_digital_template();
        exit;
    }
});

function duendes_render_producto_digital_template() {
    global $post, $product;

    $nombre = $post->post_title;
    $precio = $product->get_price();
    $descripcion = $product->get_description();
    $short_desc = $product->get_short_description();
    $imagen = get_the_post_thumbnail_url($post->ID, 'full');

    // Detectar tipo
    $titulo_lower = strtolower($nombre);
    $es_circulo = strpos($titulo_lower, 'circulo') !== false;
    $es_lectura = strpos($titulo_lower, 'lectura') !== false;

    get_header();
    ?>
    <style>
    .digital-producto-hero {
        background: linear-gradient(135deg, #0a0a0a 0%, #1a0a2a 50%, #0a0a0a 100%);
        min-height: 85vh;
        display: flex;
        align-items: center;
        padding: 100px 40px 60px;
        position: relative;
        overflow: hidden;
    }
    .digital-producto-hero::before {
        content: '';
        position: absolute;
        inset: 0;
        background: radial-gradient(ellipse at center, rgba(155,89,182,0.15) 0%, transparent 70%);
        pointer-events: none;
    }
    .digital-container {
        max-width: 1200px;
        margin: 0 auto;
        display: grid;
        grid-template-columns: 1fr 1.2fr;
        gap: 60px;
        align-items: center;
        position: relative;
        z-index: 2;
    }
    .digital-visual {
        position: relative;
    }
    .digital-imagen {
        width: 100%;
        max-width: 450px;
        border-radius: 20px;
        box-shadow: 0 30px 80px rgba(155,89,182,0.25);
    }
    .digital-badge {
        position: absolute;
        top: -15px;
        right: 20px;
        background: linear-gradient(135deg, #9B59B6, #8E44AD);
        color: #fff;
        padding: 12px 24px;
        border-radius: 30px;
        font-family: 'Cinzel', serif;
        font-size: 11px;
        text-transform: uppercase;
        letter-spacing: 2px;
        box-shadow: 0 10px 30px rgba(155,89,182,0.4);
    }
    .digital-info h1 {
        font-family: 'Cinzel', serif;
        font-size: clamp(32px, 5vw, 48px);
        color: #fff;
        margin: 0 0 20px;
        line-height: 1.2;
    }
    .digital-info h1 span {
        color: #C6A962;
    }
    .digital-desc {
        font-family: 'Cormorant Garamond', serif;
        font-size: 20px;
        color: rgba(255,255,255,0.85);
        line-height: 1.7;
        margin-bottom: 35px;
    }
    .digital-beneficios {
        display: flex;
        flex-direction: column;
        gap: 16px;
        margin-bottom: 40px;
    }
    .digital-beneficio {
        display: flex;
        align-items: center;
        gap: 16px;
        color: rgba(255,255,255,0.9);
        font-size: 16px;
    }
    .digital-beneficio-icon {
        width: 44px;
        height: 44px;
        background: rgba(155,89,182,0.2);
        border: 1px solid rgba(155,89,182,0.3);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 20px;
        flex-shrink: 0;
    }
    .digital-precio {
        font-family: 'Cinzel', serif;
        font-size: 38px;
        color: #C6A962;
        margin-bottom: 30px;
    }
    .digital-precio small {
        font-size: 15px;
        color: rgba(255,255,255,0.5);
        display: block;
        margin-top: 5px;
    }
    .digital-cta {
        display: inline-flex;
        align-items: center;
        gap: 12px;
        padding: 22px 55px;
        background: linear-gradient(135deg, #C6A962, #a88a42);
        border: none;
        border-radius: 50px;
        color: #0a0a0a;
        font-family: 'Cinzel', serif;
        font-size: 17px;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 2px;
        text-decoration: none;
        cursor: pointer;
        transition: all 0.4s;
        box-shadow: 0 10px 40px rgba(198,169,98,0.3);
    }
    .digital-cta:hover {
        transform: translateY(-3px);
        box-shadow: 0 20px 50px rgba(198,169,98,0.45);
        color: #0a0a0a;
    }
    .digital-garantias {
        display: flex;
        flex-wrap: wrap;
        gap: 25px;
        margin-top: 35px;
    }
    .digital-garantia {
        display: flex;
        align-items: center;
        gap: 8px;
        color: rgba(255,255,255,0.55);
        font-size: 13px;
    }

    /* Seccion Que Incluye */
    .digital-includes {
        background: linear-gradient(180deg, #FAF8F5, #f5f0e8);
        padding: 80px 40px;
    }
    .digital-includes-header {
        text-align: center;
        margin-bottom: 50px;
    }
    .digital-includes-header h2 {
        font-family: 'Cinzel', serif;
        font-size: 32px;
        color: #1a1a1a;
        margin-bottom: 10px;
    }
    .digital-includes-header p {
        color: #666;
        font-size: 18px;
    }
    .includes-grid {
        max-width: 1000px;
        margin: 0 auto;
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: 25px;
    }
    .include-card {
        background: #fff;
        padding: 35px 30px;
        border-radius: 16px;
        text-align: center;
        border: 1px solid rgba(198,169,98,0.15);
        transition: all 0.3s;
    }
    .include-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 20px 50px rgba(0,0,0,0.08);
        border-color: rgba(198,169,98,0.4);
    }
    .include-icon {
        font-size: 45px;
        margin-bottom: 18px;
        display: block;
    }
    .include-title {
        font-family: 'Cinzel', serif;
        font-size: 18px;
        color: #1a1a1a;
        margin-bottom: 12px;
    }
    .include-desc {
        font-size: 14px;
        color: #666;
        line-height: 1.6;
    }

    /* FAQ Section */
    .digital-faq {
        background: #0a0a0a;
        padding: 80px 40px;
    }
    .digital-faq h2 {
        font-family: 'Cinzel', serif;
        font-size: 28px;
        color: #fff;
        text-align: center;
        margin-bottom: 50px;
    }
    .faq-list {
        max-width: 700px;
        margin: 0 auto;
    }
    .faq-item {
        border-bottom: 1px solid #333;
        padding: 25px 0;
    }
    .faq-question {
        color: #C6A962;
        font-size: 18px;
        margin-bottom: 12px;
        font-weight: 500;
    }
    .faq-answer {
        color: rgba(255,255,255,0.7);
        line-height: 1.6;
    }

    @media (max-width: 900px) {
        .digital-container {
            grid-template-columns: 1fr;
            gap: 40px;
        }
        .digital-visual {
            order: -1;
            text-align: center;
        }
        .digital-imagen {
            max-width: 350px;
        }
        .digital-producto-hero {
            padding: 80px 20px 50px;
        }
    }
    </style>

    <section class="digital-producto-hero">
        <div class="digital-container">
            <div class="digital-visual">
                <?php if ($imagen): ?>
                <img src="<?php echo esc_url($imagen); ?>" alt="<?php echo esc_attr($nombre); ?>" class="digital-imagen">
                <?php else: ?>
                <div style="width:100%;max-width:450px;aspect-ratio:1;background:linear-gradient(135deg,#1a0a2a,#2a1a3a);border-radius:20px;display:flex;align-items:center;justify-content:center;font-size:100px;">
                    <?php echo $es_circulo ? '👑' : ($es_lectura ? '📜' : '✨'); ?>
                </div>
                <?php endif; ?>
                <div class="digital-badge">Acceso Inmediato</div>
            </div>

            <div class="digital-info">
                <h1><?php echo esc_html($nombre); ?></h1>

                <div class="digital-desc">
                    <?php if ($es_circulo): ?>
                    Unite a la comunidad mas magica de Latinoamerica. Rituales semanales, lecturas exclusivas y conexion profunda con tu espiritualidad.
                    <?php elseif ($es_lectura): ?>
                    Una lectura profunda canalizada especialmente para vos. Conectamos con tu energia para revelarte mensajes que tu alma necesita escuchar.
                    <?php else: ?>
                    <?php echo wp_kses_post($short_desc ?: $descripcion); ?>
                    <?php endif; ?>
                </div>

                <div class="digital-beneficios">
                    <?php if ($es_circulo): ?>
                    <div class="digital-beneficio">
                        <span class="digital-beneficio-icon">🌙</span>
                        <span>Rituales guiados cada semana</span>
                    </div>
                    <div class="digital-beneficio">
                        <span class="digital-beneficio-icon">🔮</span>
                        <span>25 tiradas de runas al mes</span>
                    </div>
                    <div class="digital-beneficio">
                        <span class="digital-beneficio-icon">💜</span>
                        <span>Comunidad exclusiva de elegidos</span>
                    </div>
                    <div class="digital-beneficio">
                        <span class="digital-beneficio-icon">🎁</span>
                        <span>10% descuento en toda la tienda</span>
                    </div>
                    <?php elseif ($es_lectura): ?>
                    <div class="digital-beneficio">
                        <span class="digital-beneficio-icon">📜</span>
                        <span>Lectura personalizada y unica</span>
                    </div>
                    <div class="digital-beneficio">
                        <span class="digital-beneficio-icon">✨</span>
                        <span>Canalizada especificamente para vos</span>
                    </div>
                    <div class="digital-beneficio">
                        <span class="digital-beneficio-icon">⏱️</span>
                        <span>Recibirla en 24-48 horas</span>
                    </div>
                    <div class="digital-beneficio">
                        <span class="digital-beneficio-icon">🔒</span>
                        <span>Completamente confidencial</span>
                    </div>
                    <?php else: ?>
                    <div class="digital-beneficio">
                        <span class="digital-beneficio-icon">✨</span>
                        <span>Experiencia digital exclusiva</span>
                    </div>
                    <div class="digital-beneficio">
                        <span class="digital-beneficio-icon">⚡</span>
                        <span>Acceso inmediato</span>
                    </div>
                    <div class="digital-beneficio">
                        <span class="digital-beneficio-icon">💫</span>
                        <span>Contenido canalizado para vos</span>
                    </div>
                    <?php endif; ?>
                </div>

                <div class="digital-precio">
                    $<?php echo number_format($precio, 0); ?> USD
                    <?php if ($es_circulo): ?>
                    <small>por mes - Cancela cuando quieras</small>
                    <?php else: ?>
                    <small>pago unico</small>
                    <?php endif; ?>
                </div>

                <a href="?add-to-cart=<?php echo $post->ID; ?>" class="digital-cta">
                    <?php if ($es_circulo): ?>
                    ✨ Unirme al Circulo
                    <?php elseif ($es_lectura): ?>
                    🔮 Solicitar Mi Lectura
                    <?php else: ?>
                    💫 Obtener Acceso
                    <?php endif; ?>
                </a>

                <div class="digital-garantias">
                    <span class="digital-garantia">🔒 Pago 100% seguro</span>
                    <span class="digital-garantia">⚡ Acceso inmediato</span>
                    <span class="digital-garantia">💬 Soporte incluido</span>
                </div>
            </div>
        </div>
    </section>

    <?php if ($es_circulo): ?>
    <section class="digital-includes">
        <div class="digital-includes-header">
            <h2>Todo lo que recibis en El Circulo</h2>
            <p>Tu membresia incluye acceso completo a:</p>
        </div>
        <div class="includes-grid">
            <div class="include-card">
                <span class="include-icon">🌙</span>
                <div class="include-title">Rituales Semanales</div>
                <div class="include-desc">Cada semana recibis un ritual guiado para conectar con la magia de la luna y las estaciones.</div>
            </div>
            <div class="include-card">
                <span class="include-icon">🔮</span>
                <div class="include-title">Tiradas de Runas</div>
                <div class="include-desc">25 tiradas mensuales para consultar las runas cuando necesites orientacion.</div>
            </div>
            <div class="include-card">
                <span class="include-icon">📜</span>
                <div class="include-title">Contenido Exclusivo</div>
                <div class="include-desc">Articulos, meditaciones y ensenanzas que no estan disponibles en ningun otro lugar.</div>
            </div>
            <div class="include-card">
                <span class="include-icon">💜</span>
                <div class="include-title">Comunidad de Elegidos</div>
                <div class="include-desc">Conecta con otras almas que comparten tu camino espiritual.</div>
            </div>
        </div>
    </section>
    <?php endif; ?>

    <section class="digital-faq">
        <h2>Preguntas Frecuentes</h2>
        <div class="faq-list">
            <?php if ($es_circulo): ?>
            <div class="faq-item">
                <div class="faq-question">Como accedo al contenido?</div>
                <div class="faq-answer">Inmediatamente despues de tu compra recibis un email con acceso a tu portal privado Mi Magia, donde encontras todo el contenido exclusivo.</div>
            </div>
            <div class="faq-item">
                <div class="faq-question">Puedo cancelar cuando quiera?</div>
                <div class="faq-answer">Si, podes cancelar en cualquier momento. Sin preguntas, sin complicaciones. Tu acceso continua hasta el final del periodo pagado.</div>
            </div>
            <div class="faq-item">
                <div class="faq-question">Que pasa si ya tengo un guardian?</div>
                <div class="faq-answer">El Circulo complementa tu experiencia! Accedes a rituales especificos para conectar mas profundamente con tu guardian.</div>
            </div>
            <?php else: ?>
            <div class="faq-item">
                <div class="faq-question">Como recibo mi lectura?</div>
                <div class="faq-answer">Tu lectura personalizada llega a tu email en 24-48 horas. Tambien queda disponible en tu portal Mi Magia para que la consultes cuando quieras.</div>
            </div>
            <div class="faq-item">
                <div class="faq-question">Es realmente personalizada?</div>
                <div class="faq-answer">Absolutamente. Cada lectura se canaliza especificamente para vos, basada en tu energia y las preguntas que nos compartas.</div>
            </div>
            <div class="faq-item">
                <div class="faq-question">Puedo hacer preguntas especificas?</div>
                <div class="faq-answer">Si! Durante el proceso de compra podes compartir el tema o pregunta que mas te inquieta para que la lectura se enfoque en eso.</div>
            </div>
            <?php endif; ?>
        </div>
    </section>

    <?php
    get_footer();
}

// ═══════════════════════════════════════════════════════════════════════════
// 10. AGREGAR MI MAGIA AL MENÚ DE NAVEGACIÓN
// ═══════════════════════════════════════════════════════════════════════════

// Agregar Mi Magia al menú principal
add_filter('wp_nav_menu_items', function($items, $args) {
    // Solo agregar en menús principales
    $menus_principales = ['primary', 'main', 'main-menu', 'primary-menu', 'header-menu', 'menu-1'];

    $menu_location = $args->theme_location ?? '';
    $menu_slug = '';
    if (isset($args->menu) && is_object($args->menu)) {
        $menu_slug = $args->menu->slug ?? '';
    } elseif (isset($args->menu)) {
        $menu_slug = $args->menu;
    }

    $es_menu_principal = in_array($menu_location, $menus_principales) ||
                         in_array($menu_slug, $menus_principales) ||
                         strpos($menu_location, 'primary') !== false ||
                         strpos($menu_location, 'main') !== false ||
                         strpos($menu_location, 'header') !== false;

    // Si no identificamos el menú, agregarlo igual si parece menú de navegación principal
    if (!$es_menu_principal && strpos($items, 'tienda') !== false) {
        $es_menu_principal = true;
    }

    if ($es_menu_principal) {
        // Verificar que no esté ya agregado
        if (strpos($items, 'mi-magia') === false) {
            $mi_magia_item = '<li class="menu-item menu-item-mi-magia">';
            $mi_magia_item .= '<a href="/mi-magia/" class="menu-link-mi-magia" style="display:flex;align-items:center;gap:6px;">';
            $mi_magia_item .= '<span style="font-size:1.1em;">✨</span> Mi Magia';
            $mi_magia_item .= '</a></li>';

            // Agregar antes del último item (usualmente Mi Cuenta o Carrito)
            $last_li = strrpos($items, '<li');
            if ($last_li !== false) {
                $items = substr_replace($items, $mi_magia_item, $last_li, 0);
            } else {
                $items .= $mi_magia_item;
            }
        }
    }

    return $items;
}, 15, 2);

// Estilos para el item Mi Magia en el menú
add_action('wp_head', function() {
    ?>
    <style id="duendes-mi-magia-menu">
    /* Mi Magia en el menú - sutil pero visible */
    .menu-item-mi-magia a,
    .menu-link-mi-magia {
        position: relative;
    }
    .menu-item-mi-magia a::after {
        content: '';
        position: absolute;
        bottom: -2px;
        left: 50%;
        width: 0;
        height: 2px;
        background: linear-gradient(90deg, #9370db, #d4af37);
        transition: all 0.3s ease;
        transform: translateX(-50%);
    }
    .menu-item-mi-magia a:hover::after {
        width: 80%;
    }
    </style>
    <?php
}, 20);

// ═══════════════════════════════════════════════════════════════════════════
// FIN DEL PLUGIN
// ═══════════════════════════════════════════════════════════════════════════
