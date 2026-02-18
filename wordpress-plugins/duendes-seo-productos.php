<?php
/**
 * Plugin Name: Duendes SEO Productos
 * Description: SEO automático para productos (meta títulos, descripciones, alt text)
 * Version: 1.0
 * Author: Duendes del Uruguay
 */

if (!defined('ABSPATH')) exit;

// =============================================================================
// META TÍTULO PARA PRODUCTOS
// =============================================================================

add_filter('wpseo_title', 'duendes_seo_titulo_producto', 10, 1);
add_filter('rank_math/frontend/title', 'duendes_seo_titulo_producto', 10, 1);
add_filter('document_title_parts', 'duendes_seo_titulo_producto_parts', 10, 1);

function duendes_seo_titulo_producto($title) {
    if (!is_product()) return $title;

    global $post;
    if (!$post) return $title;

    $producto = wc_get_product($post->ID);
    if (!$producto) return $title;

    $nombre = $producto->get_name();
    $intencion = duendes_get_intencion_principal($post->ID);

    // Formato: "[Nombre] — Guardián de [Intención] | Duendes del Uruguay"
    return "$nombre — Guardián de $intencion | Duendes del Uruguay";
}

function duendes_seo_titulo_producto_parts($title_parts) {
    if (!is_product()) return $title_parts;

    global $post;
    if (!$post) return $title_parts;

    $producto = wc_get_product($post->ID);
    if (!$producto) return $title_parts;

    $nombre = $producto->get_name();
    $intencion = duendes_get_intencion_principal($post->ID);

    $title_parts['title'] = "$nombre — Guardián de $intencion";
    $title_parts['site'] = 'Duendes del Uruguay';

    return $title_parts;
}

// =============================================================================
// META DESCRIPCIÓN PARA PRODUCTOS
// =============================================================================

add_filter('wpseo_metadesc', 'duendes_seo_descripcion_producto', 10, 1);
add_filter('rank_math/frontend/description', 'duendes_seo_descripcion_producto', 10, 1);
add_action('wp_head', 'duendes_seo_meta_descripcion', 1);

function duendes_seo_descripcion_producto($desc) {
    if (!is_product()) return $desc;

    global $post;
    if (!$post) return $desc;

    $producto = wc_get_product($post->ID);
    if (!$producto) return $desc;

    return duendes_generar_meta_descripcion($post->ID, $producto);
}

function duendes_seo_meta_descripcion() {
    if (!is_product()) return;

    global $post;
    if (!$post) return;

    $producto = wc_get_product($post->ID);
    if (!$producto) return;

    $descripcion = duendes_generar_meta_descripcion($post->ID, $producto);

    // Solo agregar si no hay otro plugin SEO activo
    if (!function_exists('wpseo_get_value') && !class_exists('RankMath')) {
        echo '<meta name="description" content="' . esc_attr($descripcion) . '">' . "\n";
    }
}

function duendes_generar_meta_descripcion($product_id, $producto) {
    $nombre = $producto->get_name();
    $intencion = duendes_get_intencion_principal($product_id);
    $tipo_ser = duendes_get_tipo_ser($product_id);

    // Obtener primeras palabras de la descripción corta
    $short_desc = $producto->get_short_description();
    $esencia = '';

    if ($short_desc) {
        // Extraer primera oración o primeros 100 caracteres
        $primera_oracion = strtok($short_desc, '.');
        if (strlen($primera_oracion) < 160) {
            $esencia = strip_tags($primera_oracion) . '.';
        }
    }

    if (!$esencia) {
        // Generar una esencia básica
        $esencia = "$nombre es un guardián de $intencion que busca a quien está listo para recibirlo.";
    }

    // Formato: "[Esencia]. Guardián canalizado, artesanal y único. Adoptalo en Duendes del Uruguay."
    $descripcion = trim($esencia) . ' Guardián canalizado, artesanal y único. Adoptalo en Duendes del Uruguay.';

    // Limitar a 160 caracteres
    if (strlen($descripcion) > 160) {
        $descripcion = substr($descripcion, 0, 157) . '...';
    }

    return $descripcion;
}

// =============================================================================
// ALT TEXT AUTOMÁTICO PARA IMÁGENES DE PRODUCTO
// =============================================================================

// Al subir imagen de producto, generar alt text
add_action('add_attachment', 'duendes_seo_generar_alt_text');
add_filter('wp_get_attachment_image_attributes', 'duendes_seo_filtrar_alt', 10, 3);

function duendes_seo_generar_alt_text($attachment_id) {
    // Solo para imágenes
    if (!wp_attachment_is_image($attachment_id)) return;

    $parent_id = wp_get_post_parent_id($attachment_id);
    if (!$parent_id) return;

    // Solo para productos
    if (get_post_type($parent_id) !== 'product') return;

    $producto = wc_get_product($parent_id);
    if (!$producto) return;

    $alt_text = duendes_generar_alt_para_producto($parent_id, $producto);

    update_post_meta($attachment_id, '_wp_attachment_image_alt', $alt_text);
}

function duendes_seo_filtrar_alt($attr, $attachment, $size) {
    // Si es una página de producto, mejorar el alt
    if (!is_product()) return $attr;

    global $post;
    if (!$post) return $attr;

    $producto = wc_get_product($post->ID);
    if (!$producto) return $attr;

    // Si el alt está vacío o es genérico, generarlo
    if (empty($attr['alt']) || strlen($attr['alt']) < 10) {
        $attr['alt'] = duendes_generar_alt_para_producto($post->ID, $producto);
    }

    return $attr;
}

function duendes_generar_alt_para_producto($product_id, $producto) {
    $nombre = $producto->get_name();
    $tipo_ser = duendes_get_tipo_ser($product_id);
    $intencion = duendes_get_intencion_principal($product_id);

    // Formato: "[Nombre] — Guardián [tipo de ser] de [intención] — Duendes del Uruguay"
    return "$nombre — Guardián $tipo_ser de $intencion — Duendes del Uruguay";
}

// =============================================================================
// FUNCIONES AUXILIARES
// =============================================================================

function duendes_get_intencion_principal($product_id) {
    $categorias = wp_get_post_terms($product_id, 'product_cat', ['fields' => 'all']);

    $intenciones_map = [
        'proteccion' => 'Protección',
        'amor' => 'Amor',
        'dinero-abundancia-negocios' => 'Abundancia',
        'salud' => 'Sanación',
        'sabiduria-guia-claridad' => 'Sabiduría',
    ];

    foreach ($categorias as $cat) {
        if (isset($intenciones_map[$cat->slug])) {
            return $intenciones_map[$cat->slug];
        }
    }

    // Si no tiene categoría de intención, retornar genérico
    return 'Protección';
}

function duendes_get_tipo_ser($product_id) {
    $categorias = wp_get_post_terms($product_id, 'product_cat', ['fields' => 'slugs']);

    $tipos_map = [
        'duende' => 'Duende',
        'duendes' => 'Duende',
        'hada' => 'Hada',
        'hadas' => 'Hada',
        'pixie' => 'Pixie',
        'pixies' => 'Pixie',
        'elfo' => 'Elfo',
        'elfos' => 'Elfo',
        'gnomo' => 'Gnomo',
        'gnomos' => 'Gnomo',
        'dragon' => 'Dragón',
        'dragones' => 'Dragón',
    ];

    foreach ($categorias as $slug) {
        if (isset($tipos_map[$slug])) {
            return $tipos_map[$slug];
        }
    }

    // Detectar por nombre del producto
    $nombre = get_the_title($product_id);
    $nombre_lower = strtolower($nombre);

    if (strpos($nombre_lower, 'hada') !== false) return 'Hada';
    if (strpos($nombre_lower, 'pixie') !== false) return 'Pixie';
    if (strpos($nombre_lower, 'elfo') !== false) return 'Elfo';
    if (strpos($nombre_lower, 'gnomo') !== false) return 'Gnomo';
    if (strpos($nombre_lower, 'dragon') !== false) return 'Dragón';

    return 'artesanal';
}

// =============================================================================
// SCHEMA MARKUP PARA PRODUCTOS
// =============================================================================

add_action('wp_head', 'duendes_seo_schema_producto', 5);

function duendes_seo_schema_producto() {
    if (!is_product()) return;

    global $post;
    if (!$post) return;

    $producto = wc_get_product($post->ID);
    if (!$producto) return;

    $nombre = $producto->get_name();
    $descripcion = duendes_generar_meta_descripcion($post->ID, $producto);
    $precio = $producto->get_price();
    $url = get_permalink($post->ID);
    $imagen = wp_get_attachment_url($producto->get_image_id());
    $stock = $producto->is_in_stock() ? 'InStock' : 'OutOfStock';

    $schema = [
        '@context' => 'https://schema.org/',
        '@type' => 'Product',
        'name' => $nombre,
        'description' => $descripcion,
        'image' => $imagen,
        'url' => $url,
        'brand' => [
            '@type' => 'Brand',
            'name' => 'Duendes del Uruguay'
        ],
        'offers' => [
            '@type' => 'Offer',
            'priceCurrency' => 'USD',
            'price' => $precio,
            'availability' => 'https://schema.org/' . $stock,
            'seller' => [
                '@type' => 'Organization',
                'name' => 'Duendes del Uruguay'
            ]
        ]
    ];

    // Solo agregar si no hay otro plugin manejando schema
    if (!has_action('wp_head', 'wpseo_json_ld_output') && !class_exists('RankMath')) {
        echo '<script type="application/ld+json">' . json_encode($schema, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES) . '</script>' . "\n";
    }
}

// =============================================================================
// OPEN GRAPH TAGS PARA PRODUCTOS
// =============================================================================

add_action('wp_head', 'duendes_seo_og_tags', 5);

function duendes_seo_og_tags() {
    if (!is_product()) return;

    global $post;
    if (!$post) return;

    $producto = wc_get_product($post->ID);
    if (!$producto) return;

    // Solo si no hay otro plugin SEO manejando OG
    if (function_exists('wpseo_get_value') || class_exists('RankMath')) return;

    $nombre = $producto->get_name();
    $descripcion = duendes_generar_meta_descripcion($post->ID, $producto);
    $url = get_permalink($post->ID);
    $imagen = wp_get_attachment_url($producto->get_image_id());
    $precio = $producto->get_price();

    echo '<meta property="og:type" content="product">' . "\n";
    echo '<meta property="og:title" content="' . esc_attr($nombre . ' | Duendes del Uruguay') . '">' . "\n";
    echo '<meta property="og:description" content="' . esc_attr($descripcion) . '">' . "\n";
    echo '<meta property="og:url" content="' . esc_url($url) . '">' . "\n";
    echo '<meta property="og:image" content="' . esc_url($imagen) . '">' . "\n";
    echo '<meta property="og:site_name" content="Duendes del Uruguay">' . "\n";
    echo '<meta property="product:price:amount" content="' . esc_attr($precio) . '">' . "\n";
    echo '<meta property="product:price:currency" content="USD">' . "\n";

    // Twitter Cards
    echo '<meta name="twitter:card" content="summary_large_image">' . "\n";
    echo '<meta name="twitter:title" content="' . esc_attr($nombre . ' | Duendes del Uruguay') . '">' . "\n";
    echo '<meta name="twitter:description" content="' . esc_attr($descripcion) . '">' . "\n";
    echo '<meta name="twitter:image" content="' . esc_url($imagen) . '">' . "\n";
}

// =============================================================================
// CANONICAL URL PARA PRODUCTOS
// =============================================================================

add_action('wp_head', 'duendes_seo_canonical', 1);

function duendes_seo_canonical() {
    if (!is_product()) return;

    // Solo si no hay otro plugin manejando canonical
    if (function_exists('wpseo_get_value') || class_exists('RankMath')) return;

    global $post;
    if (!$post) return;

    echo '<link rel="canonical" href="' . esc_url(get_permalink($post->ID)) . '">' . "\n";
}
