<?php
/**
 * Plugin Name: Duendes Categorizador
 * Description: Reorganiza productos en categorias correctas
 * Version: 1.0
 */

if (!defined('ABSPATH')) exit;

// Solo ejecutar una vez cuando se acceda con parametro especial
add_action('init', function() {
    if (!isset($_GET['duendes_categorizar']) || $_GET['duendes_categorizar'] !== 'ejecutar2026secret') {
        return;
    }

    $resultados = duendes_reorganizar_categorias();

    header('Content-Type: application/json');
    echo json_encode($resultados, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    exit;
});

function duendes_reorganizar_categorias() {
    $log = [];

    // 1. Crear categoria Sabiduria si no existe
    $sabiduria_cat = get_term_by('name', 'Sabiduría - Guía - Claridad', 'product_cat');
    if (!$sabiduria_cat) {
        $result = wp_insert_term('Sabiduría - Guía - Claridad', 'product_cat', [
            'description' => 'Guardianes que iluminan tu camino y te susurran respuestas',
            'slug' => 'sabiduria-guia-claridad'
        ]);
        if (!is_wp_error($result)) {
            $sabiduria_id = $result['term_id'];
            $log[] = "✅ Categoría 'Sabiduría' creada con ID: $sabiduria_id";
        } else {
            $log[] = "❌ Error creando Sabiduría: " . $result->get_error_message();
            $sabiduria_id = null;
        }
    } else {
        $sabiduria_id = $sabiduria_cat->term_id;
        $log[] = "ℹ️ Categoría 'Sabiduría' ya existe con ID: $sabiduria_id";
    }

    // Usar IDs directamente (conocidos de la API)
    $cat_ids = [
        'proteccion' => 16,
        'amor' => 35,
        'dinero' => 49,
        'salud' => 36,
        'sabiduria' => 103
    ];

    $log[] = "📁 IDs de categorías: " . json_encode($cat_ids);

    // Palabras clave para cada categoria
    $keywords = [
        'dinero' => ['dinero', 'abundancia', 'negocios', 'emprendedor', 'suerte', 'cash', 'fortuna', 'prosperidad', 'riqueza', 'oro', 'moneda', 'trevor', 'leo', 'yrvin', 'abrecaminos'],
        'amor' => ['amor', 'corazón', 'corazon', 'armonía', 'armonia', 'pareja', 'romanc', 'cupido', 'afecto', 'cariño', 'valentina', 'tomasin', 'deseos', 'estelar'],
        'salud' => ['salud', 'sanación', 'sanacion', 'vitalidad', 'curación', 'curacion', 'bienestar', 'energia', 'energía', 'ansiedad', 'calma', 'paz', 'dani', 'serenidad', 'duende de la sanación'],
        'sabiduria' => ['sabiduría', 'sabiduria', 'guía', 'guia', 'claridad', 'conocimiento', 'oráculo', 'oraculo', 'vidente', 'misterio', 'transformación', 'transformacion', 'rasiel', 'altair', 'viajero', 'estelar', 'oberón', 'oberon', 'morgana', 'mago', 'bruja', 'hechicera']
    ];

    // Obtener todos los productos en Protección
    $args = [
        'post_type' => 'product',
        'posts_per_page' => -1,
        'post_status' => 'publish',
        'tax_query' => [
            [
                'taxonomy' => 'product_cat',
                'field' => 'term_id',
                'terms' => $cat_ids['proteccion']
            ]
        ]
    ];

    $products = new WP_Query($args);
    $moved = ['dinero' => 0, 'amor' => 0, 'salud' => 0, 'sabiduria' => 0];
    $details = [];

    while ($products->have_posts()) {
        $products->the_post();
        $product_id = get_the_ID();
        $product_name = strtolower(get_the_title());
        $new_cat = null;

        // Buscar match con palabras clave
        foreach ($keywords as $cat_key => $words) {
            foreach ($words as $word) {
                if (strpos($product_name, $word) !== false) {
                    $new_cat = $cat_key;
                    break 2;
                }
            }
        }

        // Si encontramos una nueva categoria, mover el producto
        if ($new_cat && $cat_ids[$new_cat]) {
            // Quitar de protección y agregar a nueva categoria
            wp_remove_object_terms($product_id, $cat_ids['proteccion'], 'product_cat');
            wp_set_object_terms($product_id, [$cat_ids[$new_cat]], 'product_cat');
            $moved[$new_cat]++;
            $details[] = get_the_title() . " → " . ucfirst($new_cat);
        }
    }
    wp_reset_postdata();

    $log[] = "📦 Productos movidos:";
    $log[] = "  - A Dinero: " . $moved['dinero'];
    $log[] = "  - A Amor: " . $moved['amor'];
    $log[] = "  - A Salud: " . $moved['salud'];
    $log[] = "  - A Sabiduría: " . $moved['sabiduria'];
    $log[] = "";
    $log[] = "📝 Detalle de movimientos:";
    foreach ($details as $d) {
        $log[] = "  • " . $d;
    }

    // Distribuir algunos productos aleatorios para balancear
    // Si una categoria tiene muy pocos, mover algunos de proteccion
    $balance_cats = ['amor', 'dinero', 'salud', 'sabiduria'];

    foreach ($balance_cats as $cat_key) {
        $cat_count = wp_count_terms('product_cat', ['include' => [$cat_ids[$cat_key]]]);

        // Si tiene menos de 10 productos, mover algunos de protección
        if ($cat_count < 10 && $cat_ids['proteccion']) {
            $needed = 10 - $cat_count;

            $args = [
                'post_type' => 'product',
                'posts_per_page' => $needed,
                'post_status' => 'publish',
                'orderby' => 'rand',
                'tax_query' => [
                    [
                        'taxonomy' => 'product_cat',
                        'field' => 'term_id',
                        'terms' => $cat_ids['proteccion']
                    ]
                ]
            ];

            $to_move = new WP_Query($args);
            $extra_moved = 0;

            while ($to_move->have_posts()) {
                $to_move->the_post();
                $pid = get_the_ID();
                wp_remove_object_terms($pid, $cat_ids['proteccion'], 'product_cat');
                wp_set_object_terms($pid, [$cat_ids[$cat_key]], 'product_cat');
                $extra_moved++;
                $details[] = get_the_title() . " → " . ucfirst($cat_key) . " (balanceo)";
            }
            wp_reset_postdata();

            if ($extra_moved > 0) {
                $log[] = "⚖️ Balanceo: $extra_moved productos movidos a " . ucfirst($cat_key);
            }
        }
    }

    // Reporte final
    $log[] = "";
    $log[] = "📊 DISTRIBUCIÓN FINAL:";

    $final_cats = get_terms([
        'taxonomy' => 'product_cat',
        'hide_empty' => false
    ]);

    foreach ($final_cats as $cat) {
        if ($cat->count > 0) {
            $log[] = "  {$cat->name}: {$cat->count} productos";
        }
    }

    return [
        'success' => true,
        'log' => $log,
        'details' => $details
    ];
}
