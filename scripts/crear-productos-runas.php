<?php
/**
 * Script para crear productos de Runas en WooCommerce
 * Ejecutar una sola vez agregando ?crear_runas=duendes2026 a cualquier URL
 */

// Ejecutar en el hook correcto cuando WooCommerce ya esté cargado
add_action('woocommerce_init', 'duendes_crear_productos_runas');

function duendes_crear_productos_runas() {
    // Solo ejecutar con el parámetro secreto
    if (!isset($_GET['crear_runas']) || $_GET['crear_runas'] !== 'duendes2026') return;

    // Verificar si ya se ejecutó
    if (get_option('duendes_runas_creadas')) {
        wp_die('Los productos de Runas ya fueron creados anteriormente. Revisa WooCommerce > Productos.', 'Ya creados', ['response' => 200]);
    }

    // Paquetes de runas según config de gamificación
    $paquetes = [
        [
            'nombre' => 'Paquete Chispa - 30 Runas',
            'slug' => 'paquete-runas-30',
            'sku' => 'RUNAS-30',
            'precio' => 5,
            'runas' => 30,
            'bonus' => 0,
            'descripcion_corta' => '30 Runas de Poder para experiencias mágicas.',
            'descripcion' => 'El paquete perfecto para empezar tu camino mágico. Con 30 Runas podés acceder a lecturas básicas como el Consejo del Bosque o la Energía del Día.',
            'orden' => 1
        ],
        [
            'nombre' => 'Paquete Destello - 90 Runas',
            'slug' => 'paquete-runas-80',
            'sku' => 'RUNAS-80',
            'precio' => 10,
            'runas' => 80,
            'bonus' => 10,
            'descripcion_corta' => '80 Runas + 10 de regalo = 90 Runas totales.',
            'descripcion' => '¡El más popular! Recibís 80 Runas más 10 de regalo. Ideal para explorar lecturas estándar como Tiradas de Runas y Oráculos Elementales.',
            'orden' => 2,
            'destacado' => true
        ],
        [
            'nombre' => 'Paquete Resplandor - 240 Runas',
            'slug' => 'paquete-runas-200',
            'sku' => 'RUNAS-200',
            'precio' => 20,
            'runas' => 200,
            'bonus' => 40,
            'descripcion_corta' => '200 Runas + 40 de regalo = 240 Runas totales.',
            'descripcion' => 'Para quienes quieren profundizar. 200 Runas más 40 de regalo te dan acceso a lecturas premium como Tarot Profundo y Conexión con tu Guardián.',
            'orden' => 3
        ],
        [
            'nombre' => 'Paquete Fulgor - 700 Runas',
            'slug' => 'paquete-runas-550',
            'sku' => 'RUNAS-550',
            'precio' => 50,
            'runas' => 550,
            'bonus' => 150,
            'descripcion_corta' => '550 Runas + 150 de regalo = 700 Runas totales.',
            'descripcion' => 'El paquete de los buscadores serios. 550 Runas más 150 de regalo. Accedé a estudios profundos como Conexión con Ancestros y Mapa de Vidas Pasadas.',
            'orden' => 4
        ],
        [
            'nombre' => 'Paquete Aurora - 1600 Runas',
            'slug' => 'paquete-runas-1200',
            'sku' => 'RUNAS-1200',
            'precio' => 100,
            'runas' => 1200,
            'bonus' => 400,
            'descripcion_corta' => '1200 Runas + 400 de regalo = 1600 Runas totales.',
            'descripcion' => 'El tesoro completo del bosque. 1200 Runas más 400 de regalo. Libertad total para explorar todas las experiencias mágicas sin límites.',
            'orden' => 5
        ]
    ];

    // Crear o obtener categoría "Runas"
    $cat_runas = get_term_by('slug', 'runas', 'product_cat');
    if (!$cat_runas) {
        $cat_result = wp_insert_term(
            'Runas de Poder',
            'product_cat',
            [
                'slug' => 'runas',
                'description' => 'Paquetes de Runas de Poder para experiencias mágicas'
            ]
        );
        $cat_id = is_array($cat_result) ? $cat_result['term_id'] : 0;
    } else {
        $cat_id = $cat_runas->term_id;
    }

    // Crear cada producto
    $creados = 0;
    $existentes = 0;
    $errores = [];

    foreach ($paquetes as $paquete) {
        // Verificar si ya existe por SKU
        $existing_id = wc_get_product_id_by_sku($paquete['sku']);
        if ($existing_id) {
            $existentes++;
            continue;
        }

        // Crear producto
        $product = new WC_Product_Simple();

        $product->set_name($paquete['nombre']);
        $product->set_slug($paquete['slug']);
        $product->set_sku($paquete['sku']);
        $product->set_regular_price($paquete['precio']);
        $product->set_short_description($paquete['descripcion_corta']);
        $product->set_description($paquete['descripcion']);
        $product->set_catalog_visibility('visible');
        $product->set_status('publish');
        $product->set_virtual(true);
        $product->set_downloadable(false);
        $product->set_sold_individually(false);
        $product->set_menu_order($paquete['orden']);

        // Categoría
        if ($cat_id) {
            $product->set_category_ids([$cat_id]);
        }

        // Destacado
        if (!empty($paquete['destacado'])) {
            $product->set_featured(true);
        }

        try {
            $product_id = $product->save();

            if ($product_id) {
                update_post_meta($product_id, '_runas_cantidad', $paquete['runas']);
                update_post_meta($product_id, '_runas_bonus', $paquete['bonus']);
                update_post_meta($product_id, '_runas_total', $paquete['runas'] + $paquete['bonus']);
                $creados++;
            }
        } catch (Exception $e) {
            $errores[] = $paquete['nombre'] . ': ' . $e->getMessage();
        }
    }

    // Marcar como ejecutado
    update_option('duendes_runas_creadas', true);
    update_option('duendes_runas_creadas_fecha', current_time('mysql'));

    // Mostrar resultado
    header('Content-Type: text/html; charset=utf-8');
    ?>
    <!DOCTYPE html>
    <html>
    <head>
        <title>Productos de Runas Creados</title>
        <style>
            body { font-family: Georgia, serif; background: #0a0a0a; color: #f5f5f5; padding: 40px; }
            .container { max-width: 600px; margin: 0 auto; background: #141420; padding: 40px; border-radius: 15px; border: 1px solid rgba(212,175,55,0.3); }
            h1 { color: #d4af37; text-align: center; }
            .success { background: rgba(46,204,113,0.2); padding: 15px; border-radius: 10px; margin: 20px 0; }
            .info { background: rgba(212,175,55,0.2); padding: 15px; border-radius: 10px; margin: 20px 0; }
            .error { background: rgba(231,76,60,0.2); padding: 15px; border-radius: 10px; margin: 20px 0; }
            a { color: #d4af37; }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>✨ Productos de Runas</h1>

            <div class="success">
                <strong>✅ Creados:</strong> <?php echo $creados; ?> productos nuevos
            </div>

            <?php if ($existentes > 0): ?>
            <div class="info">
                <strong>ℹ️ Ya existían:</strong> <?php echo $existentes; ?> productos
            </div>
            <?php endif; ?>

            <?php if (!empty($errores)): ?>
            <div class="error">
                <strong>❌ Errores:</strong><br>
                <?php echo implode('<br>', $errores); ?>
            </div>
            <?php endif; ?>

            <p style="text-align: center; margin-top: 30px;">
                <a href="/wp-admin/edit.php?post_type=product&product_cat=runas">Ver productos en WooCommerce →</a>
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
