<?php
/**
 * Script temporal para generar reviews
 * ELIMINAR DESPUÉS DE USAR
 */

// Cargar WordPress
require_once(dirname(__FILE__) . '/../../../wp-load.php');

// Verificar token de seguridad
if (!isset($_GET['token']) || $_GET['token'] !== 'duendes2026generar') {
    die('Acceso denegado');
}

// Aumentar límites
@set_time_limit(900);
@ini_set('memory_limit', '1024M');
ignore_user_abort(true);

header('Content-Type: text/plain; charset=utf-8');
echo "=== GENERADOR DE REVIEWS DUENDES ===\n\n";
flush();

// Verificar que las funciones existan
if (!function_exists('duendes_generar_reviews_para_producto')) {
    die('Error: Plugin de reviews no cargado');
}

if (!defined('DUENDES_MINIS_REVIEWS')) {
    die('Error: Constantes no definidas');
}

$total_generados = 0;
$log = [];

foreach (DUENDES_MINIS_REVIEWS as $slug => $data) {
    echo "Procesando: {$data['nombre']}... ";
    flush();

    $product_id = duendes_buscar_producto_mini($slug, $data['nombre']);

    if (!$product_id) {
        echo "❌ No encontrado\n";
        $log[] = "❌ {$data['nombre']}: No encontrado";
        flush();
        continue;
    }

    // Verificar si ya tiene reviews
    $reviews_actuales = duendes_contar_reviews($product_id);
    if ($reviews_actuales >= 150) {
        echo "⏭️ Ya tiene $reviews_actuales reviews\n";
        $log[] = "⏭️ {$data['nombre']}: Ya tiene $reviews_actuales reviews";
        flush();
        continue;
    }

    // Cantidad aleatoria entre 200-350
    $cantidad = mt_rand(200, 350);
    echo "generando $cantidad reviews... ";
    flush();

    $resultado = duendes_generar_reviews_para_producto($product_id, $cantidad);
    $total_generados += $resultado['generados'];

    echo "✅ {$resultado['generados']} generados\n";
    $log[] = "✅ {$data['nombre']}: {$resultado['generados']} reviews (ID: $product_id)";
    flush();

    // Pequeña pausa para no sobrecargar
    usleep(100000); // 0.1 segundos
}

echo "\n=== RESUMEN ===\n";
echo "Total de reviews generados: $total_generados\n\n";

// Guardar log
update_option('duendes_reviews_generados_v1', 'done');
update_option('duendes_reviews_log', $log);
update_option('duendes_reviews_total', $total_generados);

echo "Log guardado en opciones de WordPress.\n";
echo "\n⚠️ IMPORTANTE: Eliminar este archivo después de usar.\n";
