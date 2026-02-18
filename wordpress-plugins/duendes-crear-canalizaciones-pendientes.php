<?php
/**
 * Plugin Name: Duendes - Crear Canalizaciones Pendientes (TEMPORAL)
 * Description: Crea canalizaciones para ordenes que no tienen, usando datos del sistema viejo. BORRAR DESPUES DE USAR.
 * Version: 1.1
 */

if (!defined('ABSPATH')) exit;

// Solo ejecutar una vez al cargar admin
add_action('admin_init', 'duendes_crear_canalizaciones_pendientes_una_vez');

function duendes_crear_canalizaciones_pendientes_una_vez() {
    // Verificar si ya se ejecuto
    if (get_option('duendes_canalizaciones_creadas_v2_2026_02_11')) {
        return;
    }

    // Ordenes que necesitan canalizaciones
    $ordenes_pendientes = [
        5802, // Gabriella - Dani (NO lleno formulario)
        5793, // Marjorie - Lil (NO lleno formulario)
        5791, // Sandra - Daisy (SI lleno formulario)
        5773, // Joel - Thomas (SI lleno formulario)
        5677, // Luisa - Susana (SI lleno formulario)
        5365, // Ana Laura - 4 guardianes (NO lleno formulario)
    ];

    $creadas = 0;
    $log = [];

    foreach ($ordenes_pendientes as $orden_id) {
        $order = wc_get_order($orden_id);
        if (!$order) {
            $log[] = "Orden $orden_id: No encontrada";
            continue;
        }

        // Verificar si ya tiene canalizaciones
        $existentes = get_posts([
            'post_type' => 'duendes_canalizacion',
            'meta_query' => [
                ['key' => '_orden_id', 'value' => $orden_id],
            ],
            'posts_per_page' => 1,
        ]);

        if (!empty($existentes)) {
            $log[] = "Orden $orden_id: Ya tiene canalizacion";
            continue;
        }

        // Obtener datos del formulario viejo
        $datos_formulario_json = get_post_meta($orden_id, '_duendes_datos_canalizacion', true);
        $formulario_completado = get_post_meta($orden_id, '_duendes_formulario_completado', true) === 'yes';

        $datos_formulario = [];
        if ($datos_formulario_json) {
            $datos_formulario = json_decode($datos_formulario_json, true) ?: [];
        }

        $tipo_destinatario = $datos_formulario['tipo'] ?? get_post_meta($orden_id, '_duendes_tipo_destinatario', true) ?: 'para_mi';

        // Obtener guardianes de la orden
        foreach ($order->get_items() as $item) {
            $product_id = $item->get_product_id();
            $product = wc_get_product($product_id);
            if (!$product) continue;

            $nombre = $product->get_name();
            $categorias = wp_get_post_terms($product_id, 'product_cat', ['fields' => 'slugs']);

            // Verificar si es guardian
            $es_guardian = false;
            $cats_guardian = ['guardianes', 'duendes', 'hadas', 'pixies', 'brujos', 'elfos', 'gnomos', 'proteccion', 'abundancia', 'sanacion', 'amor'];

            foreach ($cats_guardian as $cat) {
                if (in_array($cat, $categorias)) {
                    $es_guardian = true;
                    break;
                }
            }

            // Verificar por nombre
            $patrones = ['pixie', 'duende', 'hada', 'brujo', 'elfo', 'gnomo'];
            foreach ($patrones as $patron) {
                if (stripos($nombre, $patron) !== false) {
                    $es_guardian = true;
                    break;
                }
            }

            // Mini guardians (precio bajo, nombre corto, no es altar/runas)
            if (!$es_guardian && $product->get_price() <= 3000 && strlen($nombre) < 20) {
                if (stripos($nombre, 'altar') === false && stripos($nombre, 'runa') === false && stripos($nombre, 'paquete') === false) {
                    $es_guardian = true;
                }
            }

            if (!$es_guardian) {
                $log[] = "Orden $orden_id: $nombre NO es guardian";
                continue;
            }

            // Detectar categoria
            $guardian_categoria = 'proteccion';
            $mapeo_cats = ['proteccion', 'abundancia', 'sanacion', 'amor', 'sabiduria'];
            foreach ($mapeo_cats as $cat) {
                if (in_array($cat, $categorias)) {
                    $guardian_categoria = $cat;
                    break;
                }
            }

            // Determinar estado segun si tiene datos del formulario
            $estado = $formulario_completado ? 'pendiente' : 'borrador';

            // Crear canalizacion
            $post_id = wp_insert_post([
                'post_type' => 'duendes_canalizacion',
                'post_title' => "Canalizacion #{$orden_id} - {$nombre} - " . $order->get_billing_first_name(),
                'post_status' => 'publish',
                'post_content' => '',
            ]);

            if (is_wp_error($post_id)) {
                $log[] = "Orden $orden_id: Error creando canalizacion para $nombre";
                continue;
            }

            // Guardar meta
            update_post_meta($post_id, '_orden_id', $orden_id);
            update_post_meta($post_id, '_guardian_id', $product_id);
            update_post_meta($post_id, '_guardian_nombre', $nombre);
            update_post_meta($post_id, '_guardian_imagen', wp_get_attachment_url($product->get_image_id()));
            update_post_meta($post_id, '_guardian_categoria', $guardian_categoria);
            update_post_meta($post_id, '_email', $order->get_billing_email());
            update_post_meta($post_id, '_nombre_cliente', $order->get_billing_first_name());
            update_post_meta($post_id, '_tipo_destinatario', $tipo_destinatario);
            update_post_meta($post_id, '_datos_formulario', $datos_formulario);
            update_post_meta($post_id, '_estado', $estado);
            update_post_meta($post_id, '_fecha_formulario', $order->get_date_created()->format('Y-m-d H:i:s'));
            update_post_meta($post_id, '_versiones', []);
            update_post_meta($post_id, '_formulario_completado', $formulario_completado ? 'yes' : 'no');

            $estado_txt = $formulario_completado ? 'LISTA para generar' : 'ESPERANDO formulario';
            $log[] = "Orden $orden_id: Creada canalizacion para $nombre ($estado_txt)";
            $creadas++;
        }
    }

    // Marcar como ejecutado
    update_option('duendes_canalizaciones_creadas_v2_2026_02_11', true);
    update_option('duendes_canalizaciones_log_2026_02_11', $log);

    // Mostrar aviso
    add_action('admin_notices', function() use ($creadas, $log) {
        echo '<div class="notice notice-success"><p><strong>Duendes:</strong> Se crearon ' . $creadas . ' canalizaciones.</p>';
        echo '<ul style="margin-left:20px;">';
        foreach ($log as $linea) {
            echo '<li>' . esc_html($linea) . '</li>';
        }
        echo '</ul></div>';
    });
}
