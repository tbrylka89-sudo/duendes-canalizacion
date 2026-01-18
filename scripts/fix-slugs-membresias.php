<?php
/**
 * Script para corregir slugs de membresías del Círculo
 * Ejecutar agregando ?fix_slugs=duendes2026
 */

add_action('template_redirect', 'duendes_fix_slugs_membresias', 1);

function duendes_fix_slugs_membresias() {
    if (!isset($_GET['fix_slugs']) || $_GET['fix_slugs'] !== 'duendes2026') return;
    if (!function_exists('wc_get_product')) return;

    $cambios = [];

    // Mapeo de SKU a slug deseado
    $skus_slugs = [
        'CIRCULO-1M' => 'circulo-mensual',
        'CIRCULO-6M' => 'circulo-seis-meses',
        'CIRCULO-12M' => 'circulo-anual'
    ];

    foreach ($skus_slugs as $sku => $slug_deseado) {
        $product_id = wc_get_product_id_by_sku($sku);
        if (!$product_id) continue;

        $product = wc_get_product($product_id);
        $slug_actual = $product->get_slug();

        if ($slug_actual !== $slug_deseado) {
            // Actualizar el slug
            wp_update_post([
                'ID' => $product_id,
                'post_name' => $slug_deseado
            ]);

            $cambios[] = [
                'sku' => $sku,
                'nombre' => $product->get_name(),
                'antes' => $slug_actual,
                'despues' => $slug_deseado
            ];
        }
    }

    // Mostrar resultado
    header('Content-Type: text/html; charset=utf-8');
    ?>
    <!DOCTYPE html>
    <html>
    <head>
        <title>Slugs Corregidos</title>
        <style>
            body { font-family: Georgia, serif; background: #0a0a0a; color: #f5f5f5; padding: 40px; }
            .container { max-width: 700px; margin: 0 auto; background: #141420; padding: 40px; border-radius: 15px; border: 1px solid rgba(212,175,55,0.3); }
            h1 { color: #d4af37; text-align: center; }
            .box { padding: 15px; border-radius: 10px; margin: 15px 0; }
            .success { background: rgba(46,204,113,0.2); }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            th, td { padding: 10px; text-align: left; border-bottom: 1px solid rgba(212,175,55,0.2); font-size: 14px; }
            th { color: #d4af37; }
            a { color: #d4af37; }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>🔧 Slugs Corregidos</h1>

            <div class="box success">
                <strong>✅ Corregidos:</strong> <?php echo count($cambios); ?> slugs
            </div>

            <?php if (!empty($cambios)): ?>
            <table>
                <tr>
                    <th>Producto</th>
                    <th>Antes</th>
                    <th>Ahora</th>
                </tr>
                <?php foreach ($cambios as $c): ?>
                <tr>
                    <td><?php echo esc_html($c['nombre']); ?></td>
                    <td>/product/<?php echo esc_html($c['antes']); ?>/</td>
                    <td>/product/<?php echo esc_html($c['despues']); ?>/</td>
                </tr>
                <?php endforeach; ?>
            </table>
            <?php else: ?>
            <p style="text-align: center; color: rgba(255,255,255,0.6);">Todos los slugs ya estaban correctos.</p>
            <?php endif; ?>

            <p style="text-align: center; margin-top: 30px;">
                <a href="/wp-admin/edit.php?post_type=product&product_cat=membresias">Ver membresías →</a>
            </p>
        </div>
    </body>
    </html>
    <?php
    exit;
}
