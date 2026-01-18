<?php
/**
 * Script para crear productos de Membresías del Círculo en WooCommerce
 * Ejecutar agregando ?crear_membresias=duendes2026 a cualquier URL
 */

add_action('template_redirect', 'duendes_crear_membresias_circulo', 1);

function duendes_crear_membresias_circulo() {
    if (!isset($_GET['crear_membresias']) || $_GET['crear_membresias'] !== 'duendes2026') return;
    if (!function_exists('wc_get_product')) return;

    // Verificar si ya se ejecutó
    if (get_option('duendes_membresias_creadas')) {
        wp_die('Las membresías del Círculo ya fueron creadas anteriormente. Revisa WooCommerce > Productos.', 'Ya creadas', ['response' => 200]);
    }

    // Membresías del Círculo según config de gamificación
    $membresias = [
        [
            'nombre' => 'Círculo Mensual',
            'slug' => 'circulo-mensual',
            'sku' => 'CIRCULO-1M',
            'precio' => 15,
            'meses' => 1,
            'runas_bienvenida' => 20,
            'runas_mensuales' => 12,
            'descripcion_corta' => 'Acceso mensual al Círculo de Duendes. Incluye 20 runas de bienvenida.',
            'descripcion' => 'Únete al Círculo de Duendes por un mes. Acceso completo al Santuario, contenido exclusivo semanal, foro privado de la comunidad, y 12 runas cada mes mientras tu membresía esté activa. Incluye 20 runas de bienvenida al unirte.',
            'orden' => 1
        ],
        [
            'nombre' => 'Círculo Seis Meses',
            'slug' => 'circulo-seis-meses',
            'sku' => 'CIRCULO-6M',
            'precio' => 50,
            'meses' => 6,
            'runas_bienvenida' => 60,
            'runas_mensuales' => 15,
            'descripcion_corta' => '6 meses de Círculo. Incluye 60 runas de bienvenida + 15 runas/mes.',
            'descripcion' => 'Seis meses de acceso al Círculo de Duendes. Ahorrás $40 comparado con el plan mensual. Acceso completo al Santuario, contenido exclusivo, foro privado, y 15 runas cada mes. Incluye 60 runas de bienvenida al unirte.',
            'orden' => 2,
            'popular' => true
        ],
        [
            'nombre' => 'Año del Guardián - Círculo Anual',
            'slug' => 'circulo-anual',
            'sku' => 'CIRCULO-12M',
            'precio' => 80,
            'meses' => 12,
            'runas_bienvenida' => 120,
            'runas_mensuales' => 25,
            'descripcion_corta' => '12 meses de Círculo. Incluye 120 runas de bienvenida + 25 runas/mes.',
            'descripcion' => 'Un año completo en el Círculo de Duendes. El mejor valor: ahorrás $100 comparado con el plan mensual. Acceso completo al Santuario, contenido exclusivo, foro privado, acceso anticipado a nuevos guardianes, y 25 runas cada mes. Incluye 120 runas de bienvenida al unirte.',
            'orden' => 3,
            'destacado' => true
        ]
    ];

    // Crear o obtener categoría "Membresías"
    $cat_membresias = get_term_by('slug', 'membresias', 'product_cat');
    if (!$cat_membresias) {
        $cat_result = wp_insert_term(
            'Membresías del Círculo',
            'product_cat',
            [
                'slug' => 'membresias',
                'description' => 'Planes de membresía para el Círculo de Duendes'
            ]
        );
        $cat_id = is_array($cat_result) ? $cat_result['term_id'] : 0;
    } else {
        $cat_id = $cat_membresias->term_id;
    }

    // Crear cada producto
    $creados = 0;
    $existentes = 0;
    $errores = [];

    foreach ($membresias as $membresia) {
        // Verificar si ya existe por SKU
        $existing_id = wc_get_product_id_by_sku($membresia['sku']);
        if ($existing_id) {
            $existentes++;
            continue;
        }

        // Crear producto
        $product = new WC_Product_Simple();

        $product->set_name($membresia['nombre']);
        $product->set_slug($membresia['slug']);
        $product->set_sku($membresia['sku']);
        $product->set_regular_price($membresia['precio']);
        $product->set_short_description($membresia['descripcion_corta']);
        $product->set_description($membresia['descripcion']);
        $product->set_catalog_visibility('visible');
        $product->set_status('publish');
        $product->set_virtual(true);
        $product->set_downloadable(false);
        $product->set_sold_individually(true); // Solo una membresía a la vez
        $product->set_menu_order($membresia['orden']);

        // Categoría
        if ($cat_id) {
            $product->set_category_ids([$cat_id]);
        }

        // Destacado/Popular
        if (!empty($membresia['destacado']) || !empty($membresia['popular'])) {
            $product->set_featured(true);
        }

        try {
            $product_id = $product->save();

            if ($product_id) {
                // Guardar metadata personalizada
                update_post_meta($product_id, '_membresia_meses', $membresia['meses']);
                update_post_meta($product_id, '_membresia_runas_bienvenida', $membresia['runas_bienvenida']);
                update_post_meta($product_id, '_membresia_runas_mensuales', $membresia['runas_mensuales']);
                update_post_meta($product_id, '_es_membresia_circulo', 'yes');
                $creados++;
            }
        } catch (Exception $e) {
            $errores[] = $membresia['nombre'] . ': ' . $e->getMessage();
        }
    }

    // Marcar como ejecutado
    update_option('duendes_membresias_creadas', true);
    update_option('duendes_membresias_creadas_fecha', current_time('mysql'));

    // Mostrar resultado
    header('Content-Type: text/html; charset=utf-8');
    ?>
    <!DOCTYPE html>
    <html>
    <head>
        <title>Membresías del Círculo Creadas</title>
        <style>
            body { font-family: Georgia, serif; background: #0a0a0a; color: #f5f5f5; padding: 40px; }
            .container { max-width: 600px; margin: 0 auto; background: #141420; padding: 40px; border-radius: 15px; border: 1px solid rgba(212,175,55,0.3); }
            h1 { color: #d4af37; text-align: center; }
            .success { background: rgba(46,204,113,0.2); padding: 15px; border-radius: 10px; margin: 20px 0; }
            .info { background: rgba(212,175,55,0.2); padding: 15px; border-radius: 10px; margin: 20px 0; }
            .error { background: rgba(231,76,60,0.2); padding: 15px; border-radius: 10px; margin: 20px 0; }
            a { color: #d4af37; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            th, td { padding: 10px; text-align: left; border-bottom: 1px solid rgba(212,175,55,0.2); }
            th { color: #d4af37; }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>⭐ Membresías del Círculo</h1>

            <div class="success">
                <strong>✅ Creadas:</strong> <?php echo $creados; ?> membresías nuevas
            </div>

            <?php if ($existentes > 0): ?>
            <div class="info">
                <strong>ℹ️ Ya existían:</strong> <?php echo $existentes; ?> membresías
            </div>
            <?php endif; ?>

            <?php if (!empty($errores)): ?>
            <div class="error">
                <strong>❌ Errores:</strong><br>
                <?php echo implode('<br>', $errores); ?>
            </div>
            <?php endif; ?>

            <table>
                <tr>
                    <th>Plan</th>
                    <th>Precio</th>
                    <th>Runas Bienvenida</th>
                    <th>Runas/Mes</th>
                </tr>
                <?php foreach ($membresias as $m): ?>
                <tr>
                    <td><?php echo esc_html($m['nombre']); ?></td>
                    <td>$<?php echo $m['precio']; ?></td>
                    <td><?php echo $m['runas_bienvenida']; ?> ᚱ</td>
                    <td><?php echo $m['runas_mensuales']; ?> ᚱ</td>
                </tr>
                <?php endforeach; ?>
            </table>

            <p style="text-align: center; margin-top: 30px;">
                <a href="/wp-admin/edit.php?post_type=product&product_cat=membresias">Ver membresías en WooCommerce →</a>
            </p>

            <p style="color: rgba(255,255,255,0.5); font-size: 12px; text-align: center; margin-top: 20px;">
                Ahora podés eliminar este archivo del servidor.
            </p>
        </div>
    </body>
    </html>
    <?php
    exit;
}
