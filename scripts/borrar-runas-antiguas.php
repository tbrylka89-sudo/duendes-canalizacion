<?php
/**
 * Script para borrar productos antiguos de Runas en WooCommerce
 * Ejecutar agregando ?borrar_runas=duendes2026
 */

add_action('template_redirect', 'duendes_borrar_runas_v2', 1);

function duendes_borrar_runas_v2() {
    if (!isset($_GET['borrar_runas']) || $_GET['borrar_runas'] !== 'duendes2026') return;
    if (!function_exists('wc_get_product')) return;

    global $wpdb;

    // Buscar TODOS los productos que contengan "runas" en título o slug
    $productos = $wpdb->get_results("
        SELECT ID, post_title, post_name
        FROM {$wpdb->posts}
        WHERE post_type = 'product'
        AND post_status IN ('publish', 'draft', 'pending', 'private', 'trash')
        AND (
            post_name LIKE '%runas%'
            OR post_title LIKE '%runas%'
            OR post_title LIKE '%Runas%'
        )
    ");

    // SKUs de los nuevos productos (NO borrar estos)
    $skus_nuevos = ['runas-30', 'runas-80', 'runas-200', 'runas-550', 'runas-1200'];
    $slugs_nuevos = ['paquete-runas-30', 'paquete-runas-80', 'paquete-runas-200', 'paquete-runas-550', 'paquete-runas-1200'];

    $borrados = [];
    $mantenidos = [];

    foreach ($productos as $p) {
        $product = wc_get_product($p->ID);
        $sku = $product ? strtolower($product->get_sku()) : '';

        // Si es uno de los nuevos paquetes, mantener
        if (in_array($p->post_name, $slugs_nuevos) || in_array($sku, $skus_nuevos)) {
            $mantenidos[] = $p->post_title . ' (' . $p->post_name . ')';
            continue;
        }

        // Borrar el producto antiguo
        $borrados[] = [
            'id' => $p->ID,
            'nombre' => $p->post_title,
            'slug' => $p->post_name,
            'sku' => $sku
        ];

        // Eliminar permanentemente
        wp_delete_post($p->ID, true);
    }

    // Guardar registro
    update_option('duendes_runas_limpieza_v2', [
        'fecha' => current_time('mysql'),
        'borrados' => count($borrados),
        'lista' => $borrados
    ]);

    // Mostrar resultado
    header('Content-Type: text/html; charset=utf-8');
    ?>
    <!DOCTYPE html>
    <html>
    <head>
        <title>Limpieza Runas Antiguas</title>
        <style>
            body { font-family: Georgia, serif; background: #0a0a0a; color: #f5f5f5; padding: 40px; }
            .container { max-width: 700px; margin: 0 auto; background: #141420; padding: 40px; border-radius: 15px; border: 1px solid rgba(212,175,55,0.3); }
            h1 { color: #d4af37; text-align: center; }
            .box { padding: 15px; border-radius: 10px; margin: 15px 0; }
            .success { background: rgba(46,204,113,0.2); }
            .info { background: rgba(212,175,55,0.2); }
            ul { margin: 10px 0; padding-left: 20px; }
            li { margin: 5px 0; font-size: 14px; }
            a { color: #d4af37; }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>🗑️ Limpieza Completada</h1>

            <div class="box success">
                <strong>✅ Borrados:</strong> <?php echo count($borrados); ?> productos antiguos
            </div>

            <?php if (!empty($borrados)): ?>
            <div class="box" style="background: rgba(231,76,60,0.2);">
                <strong>Eliminados:</strong>
                <ul>
                <?php foreach ($borrados as $b): ?>
                    <li><?php echo esc_html($b['nombre']); ?> → /product/<?php echo esc_html($b['slug']); ?>/</li>
                <?php endforeach; ?>
                </ul>
            </div>
            <?php endif; ?>

            <?php if (!empty($mantenidos)): ?>
            <div class="box info">
                <strong>✓ Mantenidos (nuevos):</strong>
                <ul>
                <?php foreach ($mantenidos as $m): ?>
                    <li><?php echo esc_html($m); ?></li>
                <?php endforeach; ?>
                </ul>
            </div>
            <?php endif; ?>

            <p style="text-align: center; margin-top: 30px;">
                <a href="/wp-admin/edit.php?post_type=product">Ver productos →</a>
            </p>
        </div>
    </body>
    </html>
    <?php
    exit;
}
