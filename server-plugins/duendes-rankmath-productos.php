<?php
/**
 * Plugin Name: Duendes - RankMath Productos
 * Description: Habilita RankMath SEO en productos WooCommerce
 * Version: 1.0
 * Author: Duendes del Uruguay
 */

if (!defined('ABSPATH')) exit;

// ═══════════════════════════════════════════════════════════════
// CONFIGURAR RANKMATH PARA PRODUCTOS
// ═══════════════════════════════════════════════════════════════

// Habilitar RankMath en productos de WooCommerce
add_filter('rank_math/sitemap/post_types', function($post_types) {
    $post_types[] = 'product';
    return array_unique($post_types);
});

// Forzar que RankMath muestre su metabox en productos
add_filter('rank_math/metabox/priority', function($priority) {
    return 'high';
});

// Habilitar SEO para productos si RankMath está activo
add_action('init', function() {
    // Verificar si RankMath está activo
    if (!class_exists('RankMath')) return;

    // Obtener opciones actuales de RankMath
    $titles = get_option('rank-math-options-titles', []);

    // Habilitar para productos si no está configurado
    if (!isset($titles['pt_product_add_meta_box']) || $titles['pt_product_add_meta_box'] !== 'on') {
        $titles['pt_product_add_meta_box'] = 'on';
        $titles['pt_product_bulk_editing'] = 'on';
        $titles['pt_product_link_suggestions'] = 'on';
        update_option('rank-math-options-titles', $titles);
    }
}, 5);

// Asegurar que el metabox de RankMath aparezca en productos
add_filter('rank_math/metabox/post_types', function($post_types) {
    if (!in_array('product', $post_types)) {
        $post_types[] = 'product';
    }
    return $post_types;
});
