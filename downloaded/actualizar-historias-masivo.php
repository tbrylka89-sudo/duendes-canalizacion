<?php
/**
 * Script para actualizar historias masivamente en WooCommerce
 * Ejecutar una sola vez y luego eliminar
 */

if (!defined('ABSPATH')) {
    // Cargar WordPress
    require_once dirname(__FILE__) . '/../../../wp-load.php';
}

// Solo admins
if (!current_user_can('manage_options')) {
    die('No autorizado');
}

// Las historias en formato JSON
$historias_json = <<<'HISTORIAS'
PLACEHOLDER_HISTORIAS
HISTORIAS;

$historias = json_decode($historias_json, true);

if (!$historias) {
    echo "Error: No se pudieron cargar las historias\n";
    exit;
}

echo "<h1>Actualizando Historias de Guardianes</h1>";
echo "<p>Total: " . count($historias) . " historias</p>";
echo "<hr>";

$actualizados = 0;
$errores = 0;

foreach ($historias as $nombre => $historia) {
    // Buscar producto por nombre
    $args = array(
        'post_type' => 'product',
        'posts_per_page' => 1,
        'title' => $nombre,
        'post_status' => 'publish'
    );

    $products = get_posts($args);

    if (empty($products)) {
        // Intentar búsqueda más flexible
        $args['s'] = $nombre;
        unset($args['title']);
        $products = get_posts($args);
    }

    if (!empty($products)) {
        $product = $products[0];

        // Convertir markdown a HTML
        $historia_html = convertir_markdown_a_html($historia);

        // Actualizar
        $result = wp_update_post(array(
            'ID' => $product->ID,
            'post_content' => $historia_html
        ));

        if ($result && !is_wp_error($result)) {
            echo "✅ <strong>{$nombre}</strong> (ID: {$product->ID}) - Actualizado<br>";
            $actualizados++;
        } else {
            echo "❌ <strong>{$nombre}</strong> - Error al actualizar<br>";
            $errores++;
        }
    } else {
        echo "⚠️ <strong>{$nombre}</strong> - Producto no encontrado<br>";
        $errores++;
    }

    flush();
}

echo "<hr>";
echo "<h2>Resumen</h2>";
echo "<p>✅ Actualizados: {$actualizados}</p>";
echo "<p>❌ Errores: {$errores}</p>";

function convertir_markdown_a_html($texto) {
    // Negrita
    $texto = preg_replace('/\*\*([^*]+)\*\*/', '<strong>$1</strong>', $texto);

    // Cursiva con comillas
    $texto = preg_replace('/\*"([^"]+)"\*/', '<em>"$1"</em>', $texto);

    // Cursiva normal
    $texto = preg_replace('/\*([^*\n]+)\*/', '<em>$1</em>', $texto);

    // Separar en párrafos
    $parrafos = preg_split('/\n\n+/', $texto);
    $html = '';

    foreach ($parrafos as $p) {
        $p = trim($p);
        if (empty($p)) continue;

        // Listas
        if (preg_match('/^- /', $p)) {
            $lineas = explode("\n", $p);
            $html .= '<ul>';
            foreach ($lineas as $linea) {
                $linea = preg_replace('/^- /', '', trim($linea));
                if ($linea) $html .= '<li>' . $linea . '</li>';
            }
            $html .= '</ul>';
        } else {
            $html .= '<p>' . nl2br($p) . '</p>';
        }
    }

    return $html;
}
