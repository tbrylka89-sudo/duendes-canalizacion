<?php
/**
 * Plugin Name: Duendes - Clasificación de Productos
 * Description: Sistema de categorías por tamaño, tipo de ser, campo es_unico y ordenamiento premium
 * Version: 1.0.0
 * Author: Duendes del Uruguay
 *
 * BLOQUE 1 del documento de tareas:
 * - 1.1 Categorías por tamaño
 * - 1.2 Auto-clasificar por tamaño
 * - 1.3 Categorías por tipo de ser
 * - 1.4 Campo es_unico
 * - 1.5 Ordenamiento precio descendente
 */

if (!defined('ABSPATH')) exit;

// =============================================================================
// CONSTANTES Y CONFIGURACIÓN
// =============================================================================

define('DUENDES_TAMANOS', [
    'mini' => [
        'nombre' => 'Mini',
        'descripcion' => 'Guardianes compactos (~8-10cm)',
        'precio_usd' => 70,
        'precio_usd_max' => 79,
        'cm_min' => 0,
        'cm_max' => 10
    ],
    'pixie' => [
        'nombre' => 'Pixie',
        'descripcion' => 'Seres delicados (~12cm)',
        'precio_usd' => 150,
        'precio_usd_max' => 159,
        'cm_min' => 10,
        'cm_max' => 15
    ],
    'mediano' => [
        'nombre' => 'Mediano',
        'descripcion' => 'Presencia notable (~20cm)',
        'precio_usd' => 200,
        'precio_usd_max' => 399,
        'cm_min' => 15,
        'cm_max' => 25
    ],
    'grande' => [
        'nombre' => 'Grande',
        'descripcion' => 'Imponente presencia (~30cm)',
        'precio_usd' => 450,
        'precio_usd_max' => 899,
        'cm_min' => 25,
        'cm_max' => 35
    ],
    'gigante' => [
        'nombre' => 'Gigante',
        'descripcion' => 'Pieza monumental (~45cm)',
        'precio_usd' => 1050,
        'precio_usd_max' => 9999,
        'cm_min' => 35,
        'cm_max' => 100
    ]
]);

define('DUENDES_TIPOS_SER', [
    'duende' => [
        'nombre' => 'Duende',
        'keywords' => ['duende', 'gnome', 'duendecillo']
    ],
    'bruja' => [
        'nombre' => 'Bruja/Brujo',
        'keywords' => ['bruja', 'brujo', 'witch', 'hechicera', 'hechicero']
    ],
    'elfo' => [
        'nombre' => 'Elfo/Elfa',
        'keywords' => ['elfo', 'elfa', 'elf', 'élfico']
    ],
    'hada' => [
        'nombre' => 'Hada',
        'keywords' => ['hada', 'fairy', 'fae', 'faerie']
    ],
    'pixie' => [
        'nombre' => 'Pixie',
        'keywords' => ['pixie'] // Cuidado: también es tamaño
    ],
    'gnomo' => [
        'nombre' => 'Gnomo',
        'keywords' => ['gnomo', 'gnome']
    ],
    'mago' => [
        'nombre' => 'Mago/Maga',
        'keywords' => ['mago', 'maga', 'wizard', 'merlín', 'merlin', 'gandalf']
    ],
    'leprechaun' => [
        'nombre' => 'Leprechaun',
        'keywords' => ['leprechaun', 'leprecán']
    ]
]);

// Los 11 Minis clásicos que se recrean (NO son únicos)
define('DUENDES_MINIS_CLASICOS', [
    'luke', 'dani', 'cash', 'trévor', 'trevor', 'lil',
    'sanación', 'sanacion', 'yrvin', 'estelar',
    'compañero', 'companero', 'matheo', 'leo'
]);

// Personajes no propios que se recrean
define('DUENDES_PERSONAJES_RECREABLES', [
    'merlín', 'merlin', 'gandalf', 'leprechaun'
]);

// =============================================================================
// 1.1 y 1.3 - REGISTRAR TAXONOMÍAS CUSTOM
// =============================================================================

add_action('init', 'duendes_registrar_taxonomias', 5);

function duendes_registrar_taxonomias() {
    // Taxonomía: Tamaño del Guardián
    register_taxonomy('tamano_guardian', 'product', [
        'labels' => [
            'name' => 'Tamaño',
            'singular_name' => 'Tamaño',
            'search_items' => 'Buscar tamaños',
            'all_items' => 'Todos los tamaños',
            'edit_item' => 'Editar tamaño',
            'update_item' => 'Actualizar tamaño',
            'add_new_item' => 'Agregar tamaño',
            'new_item_name' => 'Nuevo tamaño',
            'menu_name' => 'Tamaño'
        ],
        'hierarchical' => true,
        'show_ui' => true,
        'show_admin_column' => true,
        'query_var' => true,
        'rewrite' => ['slug' => 'tamano'],
        'show_in_rest' => true
    ]);

    // Taxonomía: Tipo de Ser
    register_taxonomy('tipo_ser', 'product', [
        'labels' => [
            'name' => 'Tipo de Ser',
            'singular_name' => 'Tipo de Ser',
            'search_items' => 'Buscar tipos',
            'all_items' => 'Todos los tipos',
            'edit_item' => 'Editar tipo',
            'update_item' => 'Actualizar tipo',
            'add_new_item' => 'Agregar tipo',
            'new_item_name' => 'Nuevo tipo',
            'menu_name' => 'Tipo de Ser'
        ],
        'hierarchical' => true,
        'show_ui' => true,
        'show_admin_column' => true,
        'query_var' => true,
        'rewrite' => ['slug' => 'tipo-de-ser'],
        'show_in_rest' => true
    ]);

    // Crear términos si no existen
    duendes_crear_terminos_taxonomias();
}

function duendes_crear_terminos_taxonomias() {
    // Crear términos de tamaño
    foreach (DUENDES_TAMANOS as $slug => $data) {
        if (!term_exists($slug, 'tamano_guardian')) {
            wp_insert_term($data['nombre'], 'tamano_guardian', [
                'slug' => $slug,
                'description' => $data['descripcion'] . ' — $' . $data['precio_usd'] . ' USD'
            ]);
        }
    }

    // Crear términos de tipo de ser
    foreach (DUENDES_TIPOS_SER as $slug => $data) {
        if (!term_exists($slug, 'tipo_ser')) {
            wp_insert_term($data['nombre'], 'tipo_ser', [
                'slug' => $slug
            ]);
        }
    }
}

// =============================================================================
// 1.4 - CAMPO ES_UNICO (Meta Field)
// =============================================================================

// Agregar campo en el editor de producto
add_action('woocommerce_product_options_general_product_data', 'duendes_campo_es_unico');

function duendes_campo_es_unico() {
    global $post;

    echo '<div class="options_group" style="border-top: 1px solid #eee; padding-top: 10px;">';

    echo '<h4 style="padding-left: 12px; color: #c9a227;">🧚 Clasificación del Guardián</h4>';

    // Campo es_unico
    woocommerce_wp_checkbox([
        'id' => '_es_unico',
        'label' => '¿Es guardián único?',
        'description' => 'Marcar si este guardián es pieza única e irrepetible. Los Minis clásicos y personajes recreables NO son únicos.',
        'desc_tip' => true
    ]);

    // Mostrar info de clasificación automática
    $es_unico = get_post_meta($post->ID, '_es_unico', true);
    $tamano = wp_get_post_terms($post->ID, 'tamano_guardian', ['fields' => 'names']);
    $tipo = wp_get_post_terms($post->ID, 'tipo_ser', ['fields' => 'names']);

    echo '<p class="form-field" style="padding-left: 12px; color: #666; font-size: 12px;">';
    echo '<strong>Clasificación actual:</strong><br>';
    echo 'Tamaño: ' . (!empty($tamano) ? implode(', ', $tamano) : '<em>Sin clasificar</em>') . '<br>';
    echo 'Tipo: ' . (!empty($tipo) ? implode(', ', $tipo) : '<em>Sin clasificar</em>') . '<br>';
    echo 'Único: ' . ($es_unico === 'yes' ? 'Sí' : 'No');
    echo '</p>';

    echo '</div>';
}

// Guardar campo es_unico
add_action('woocommerce_process_product_meta', 'duendes_guardar_es_unico');

function duendes_guardar_es_unico($post_id) {
    $es_unico = isset($_POST['_es_unico']) ? 'yes' : 'no';
    update_post_meta($post_id, '_es_unico', $es_unico);
}

// =============================================================================
// 1.2 - AUTO-CLASIFICAR POR TAMAÑO
// =============================================================================

function duendes_detectar_tamano_producto($product_id) {
    $product = wc_get_product($product_id);
    if (!$product) return null;

    $precio = floatval($product->get_price());
    $nombre = strtolower($product->get_name());
    $descripcion = strtolower($product->get_description() . ' ' . $product->get_short_description());

    // Buscar tamaño en atributos
    $atributos = $product->get_attributes();
    $tamano_cm = null;

    foreach ($atributos as $attr) {
        $attr_name = strtolower(is_object($attr) ? $attr->get_name() : $attr['name']);
        if (strpos($attr_name, 'tama') !== false || strpos($attr_name, 'size') !== false) {
            $valor = is_object($attr) ? $attr->get_options() : $attr['options'];
            if (is_array($valor)) {
                $valor = implode(' ', $valor);
            }
            // Extraer número de cm
            if (preg_match('/(\d+)\s*cm/i', $valor, $matches)) {
                $tamano_cm = intval($matches[1]);
            }
        }
    }

    // También buscar en meta _duendes_ficha
    $ficha = get_post_meta($product_id, '_duendes_ficha', true);
    if ($ficha && is_array($ficha) && isset($ficha['tamano_cm'])) {
        $tamano_cm = intval($ficha['tamano_cm']);
    }

    // Método 1: Por centímetros si tenemos el dato
    if ($tamano_cm) {
        foreach (DUENDES_TAMANOS as $slug => $data) {
            if ($tamano_cm >= $data['cm_min'] && $tamano_cm < $data['cm_max']) {
                return $slug;
            }
        }
    }

    // Método 2: Por precio USD
    if ($precio > 0) {
        foreach (DUENDES_TAMANOS as $slug => $data) {
            if ($precio >= $data['precio_usd'] && $precio <= $data['precio_usd_max']) {
                return $slug;
            }
        }
    }

    // Método 3: Por palabras clave en nombre/descripción
    $texto = $nombre . ' ' . $descripcion;
    if (preg_match('/\bmini\b/i', $texto)) return 'mini';
    if (preg_match('/\bpixie\b/i', $texto) && strpos($texto, 'tipo') === false) return 'pixie';
    if (preg_match('/\bmedian[oa]\b/i', $texto)) return 'mediano';
    if (preg_match('/\bgrand[ea]\b/i', $texto)) return 'grande';
    if (preg_match('/\bgigante\b/i', $texto)) return 'gigante';

    return null;
}

// =============================================================================
// 1.3 - AUTO-CLASIFICAR POR TIPO DE SER
// =============================================================================

function duendes_detectar_tipo_ser($product_id) {
    $product = wc_get_product($product_id);
    if (!$product) return null;

    $nombre = strtolower($product->get_name());
    $descripcion = strtolower($product->get_description() . ' ' . $product->get_short_description());
    $texto = $nombre . ' ' . $descripcion;

    // Buscar en meta _duendes_ficha
    $ficha = get_post_meta($product_id, '_duendes_ficha', true);
    if ($ficha && is_array($ficha) && isset($ficha['especie'])) {
        $especie = strtolower($ficha['especie']);
        foreach (DUENDES_TIPOS_SER as $slug => $data) {
            foreach ($data['keywords'] as $keyword) {
                if (strpos($especie, $keyword) !== false) {
                    return $slug;
                }
            }
        }
    }

    // Buscar por keywords en texto
    // Prioridad: más específicos primero
    $prioridad = ['leprechaun', 'mago', 'hada', 'elfo', 'bruja', 'pixie', 'gnomo', 'duende'];

    foreach ($prioridad as $slug) {
        $data = DUENDES_TIPOS_SER[$slug];
        foreach ($data['keywords'] as $keyword) {
            // Para "pixie", verificar que no sea solo el tamaño
            if ($slug === 'pixie') {
                // Si dice "pixie" pero NO está cerca de "cm" o "tamaño", es tipo
                if (preg_match('/\bpixie\b/i', $texto)) {
                    // Verificar contexto - si está en el nombre, probablemente es tipo
                    if (preg_match('/\bpixie\b/i', $nombre)) {
                        return 'pixie';
                    }
                }
            } else {
                if (strpos($texto, $keyword) !== false) {
                    return $slug;
                }
            }
        }
    }

    // Default: Duende
    return 'duende';
}

// =============================================================================
// 1.4 - AUTO-DETECTAR SI ES ÚNICO
// =============================================================================

function duendes_detectar_es_unico($product_id) {
    $product = wc_get_product($product_id);
    if (!$product) return true; // Default: único

    $nombre = strtolower($product->get_name());
    $slug = $product->get_slug();

    // Verificar si es Mini clásico
    foreach (DUENDES_MINIS_CLASICOS as $mini) {
        if (strpos($nombre, $mini) !== false || strpos($slug, $mini) !== false) {
            return false; // NO es único, se recrea
        }
    }

    // Verificar si es personaje recreable
    foreach (DUENDES_PERSONAJES_RECREABLES as $personaje) {
        if (strpos($nombre, $personaje) !== false || strpos($slug, $personaje) !== false) {
            return false; // NO es único, se recrea
        }
    }

    // Por precio: los de $70 probablemente son Minis clásicos
    $precio = floatval($product->get_price());
    if ($precio > 0 && $precio <= 79) {
        return false; // Mini clásico, NO único
    }

    return true; // Por defecto: único
}

// =============================================================================
// AUTO-CLASIFICAR AL GUARDAR PRODUCTO
// =============================================================================

add_action('woocommerce_process_product_meta', 'duendes_auto_clasificar_producto', 20);
add_action('save_post_product', 'duendes_auto_clasificar_producto', 20);

function duendes_auto_clasificar_producto($post_id) {
    // Evitar auto-save y revisiones
    if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) return;
    if (wp_is_post_revision($post_id)) return;
    if (get_post_type($post_id) !== 'product') return;

    // Auto-clasificar tamaño si no tiene
    $tamanos_actuales = wp_get_post_terms($post_id, 'tamano_guardian', ['fields' => 'slugs']);
    if (empty($tamanos_actuales)) {
        $tamano = duendes_detectar_tamano_producto($post_id);
        if ($tamano) {
            wp_set_object_terms($post_id, $tamano, 'tamano_guardian');
        }
    }

    // Auto-clasificar tipo de ser si no tiene
    $tipos_actuales = wp_get_post_terms($post_id, 'tipo_ser', ['fields' => 'slugs']);
    if (empty($tipos_actuales)) {
        $tipo = duendes_detectar_tipo_ser($post_id);
        if ($tipo) {
            wp_set_object_terms($post_id, $tipo, 'tipo_ser');
        }
    }

    // Auto-detectar es_unico si no está seteado
    $es_unico_actual = get_post_meta($post_id, '_es_unico', true);
    if ($es_unico_actual === '') {
        $es_unico = duendes_detectar_es_unico($post_id) ? 'yes' : 'no';
        update_post_meta($post_id, '_es_unico', $es_unico);
    }
}

// =============================================================================
// 1.5 - ORDENAMIENTO POR PRECIO DESCENDENTE
// =============================================================================

// Cambiar orden default de la tienda
add_filter('woocommerce_default_catalog_orderby', 'duendes_orden_precio_desc');

function duendes_orden_precio_desc($default) {
    return 'price-desc';
}

// Asegurar que price-desc esté disponible
add_filter('woocommerce_catalog_orderby', 'duendes_agregar_orden_precio_desc');

function duendes_agregar_orden_precio_desc($options) {
    $options['price-desc'] = 'Precio: mayor a menor';
    return $options;
}

// =============================================================================
// HERRAMIENTA ADMIN: CLASIFICAR TODOS LOS PRODUCTOS
// =============================================================================

add_action('admin_menu', 'duendes_menu_clasificacion');

function duendes_menu_clasificacion() {
    add_submenu_page(
        'woocommerce',
        'Clasificar Guardianes',
        '🧚 Clasificar Guardianes',
        'manage_woocommerce',
        'duendes-clasificacion',
        'duendes_pagina_clasificacion'
    );
}

function duendes_pagina_clasificacion() {
    ?>
    <div class="wrap">
        <h1>🧚 Clasificación de Guardianes</h1>

        <div class="card" style="max-width: 800px; padding: 20px; margin-top: 20px;">
            <h2>Estado Actual</h2>
            <?php
            $total_productos = wp_count_posts('product')->publish;

            // Contar por tamaño
            $sin_tamano = new WP_Query([
                'post_type' => 'product',
                'post_status' => 'publish',
                'posts_per_page' => -1,
                'fields' => 'ids',
                'tax_query' => [
                    [
                        'taxonomy' => 'tamano_guardian',
                        'operator' => 'NOT EXISTS'
                    ]
                ]
            ]);
            $sin_tamano_count = $sin_tamano->found_posts;

            // Contar por tipo
            $sin_tipo = new WP_Query([
                'post_type' => 'product',
                'post_status' => 'publish',
                'posts_per_page' => -1,
                'fields' => 'ids',
                'tax_query' => [
                    [
                        'taxonomy' => 'tipo_ser',
                        'operator' => 'NOT EXISTS'
                    ]
                ]
            ]);
            $sin_tipo_count = $sin_tipo->found_posts;

            // Contar sin es_unico
            global $wpdb;
            $sin_unico = $wpdb->get_var("
                SELECT COUNT(*) FROM {$wpdb->posts} p
                LEFT JOIN {$wpdb->postmeta} pm ON p.ID = pm.post_id AND pm.meta_key = '_es_unico'
                WHERE p.post_type = 'product'
                AND p.post_status = 'publish'
                AND pm.meta_value IS NULL
            ");
            ?>

            <table class="wp-list-table widefat fixed striped">
                <tr>
                    <td><strong>Total de guardianes publicados:</strong></td>
                    <td><?php echo $total_productos; ?></td>
                </tr>
                <tr>
                    <td><strong>Sin clasificar por tamaño:</strong></td>
                    <td style="color: <?php echo $sin_tamano_count > 0 ? '#d63638' : '#00a32a'; ?>">
                        <?php echo $sin_tamano_count; ?>
                    </td>
                </tr>
                <tr>
                    <td><strong>Sin clasificar por tipo de ser:</strong></td>
                    <td style="color: <?php echo $sin_tipo_count > 0 ? '#d63638' : '#00a32a'; ?>">
                        <?php echo $sin_tipo_count; ?>
                    </td>
                </tr>
                <tr>
                    <td><strong>Sin campo es_unico:</strong></td>
                    <td style="color: <?php echo $sin_unico > 0 ? '#d63638' : '#00a32a'; ?>">
                        <?php echo $sin_unico; ?>
                    </td>
                </tr>
            </table>

            <h3 style="margin-top: 30px;">Distribución por Tamaño</h3>
            <table class="wp-list-table widefat fixed striped">
                <thead>
                    <tr>
                        <th>Tamaño</th>
                        <th>Precio USD</th>
                        <th>Cantidad</th>
                    </tr>
                </thead>
                <tbody>
                    <?php foreach (DUENDES_TAMANOS as $slug => $data):
                        $term = get_term_by('slug', $slug, 'tamano_guardian');
                        $count = $term ? $term->count : 0;
                    ?>
                    <tr>
                        <td><?php echo $data['nombre']; ?></td>
                        <td>$<?php echo $data['precio_usd']; ?></td>
                        <td><?php echo $count; ?></td>
                    </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>

            <h3 style="margin-top: 30px;">Distribución por Tipo de Ser</h3>
            <table class="wp-list-table widefat fixed striped">
                <thead>
                    <tr>
                        <th>Tipo</th>
                        <th>Cantidad</th>
                    </tr>
                </thead>
                <tbody>
                    <?php foreach (DUENDES_TIPOS_SER as $slug => $data):
                        $term = get_term_by('slug', $slug, 'tipo_ser');
                        $count = $term ? $term->count : 0;
                    ?>
                    <tr>
                        <td><?php echo $data['nombre']; ?></td>
                        <td><?php echo $count; ?></td>
                    </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
        </div>

        <div class="card" style="max-width: 800px; padding: 20px; margin-top: 20px;">
            <h2>Clasificar Productos</h2>
            <p>Esta herramienta clasificará automáticamente todos los productos que aún no tienen categoría asignada.</p>

            <form method="post" action="">
                <?php wp_nonce_field('duendes_clasificar_todos', 'duendes_nonce'); ?>

                <p>
                    <label>
                        <input type="checkbox" name="clasificar_tamano" value="1" checked>
                        Clasificar por tamaño (basado en precio y atributos)
                    </label>
                </p>
                <p>
                    <label>
                        <input type="checkbox" name="clasificar_tipo" value="1" checked>
                        Clasificar por tipo de ser (basado en nombre y descripción)
                    </label>
                </p>
                <p>
                    <label>
                        <input type="checkbox" name="clasificar_unico" value="1" checked>
                        Detectar es_unico (Minis clásicos = NO único, resto = único)
                    </label>
                </p>
                <p>
                    <label>
                        <input type="checkbox" name="forzar_reclasificar" value="1">
                        <strong>Forzar reclasificación</strong> (sobrescribir clasificaciones existentes)
                    </label>
                </p>

                <p>
                    <input type="submit" name="duendes_clasificar_submit" class="button button-primary button-hero" value="🚀 Clasificar Todos los Guardianes">
                </p>
            </form>

            <?php
            // Procesar clasificación
            if (isset($_POST['duendes_clasificar_submit']) && wp_verify_nonce($_POST['duendes_nonce'], 'duendes_clasificar_todos')) {
                $clasificar_tamano = isset($_POST['clasificar_tamano']);
                $clasificar_tipo = isset($_POST['clasificar_tipo']);
                $clasificar_unico = isset($_POST['clasificar_unico']);
                $forzar = isset($_POST['forzar_reclasificar']);

                $productos = get_posts([
                    'post_type' => 'product',
                    'post_status' => 'publish',
                    'posts_per_page' => -1,
                    'fields' => 'ids'
                ]);

                $stats = [
                    'tamano' => 0,
                    'tipo' => 0,
                    'unico' => 0,
                    'errores' => []
                ];

                foreach ($productos as $product_id) {
                    // Tamaño
                    if ($clasificar_tamano) {
                        $tamanos = wp_get_post_terms($product_id, 'tamano_guardian', ['fields' => 'slugs']);
                        if (empty($tamanos) || $forzar) {
                            $tamano = duendes_detectar_tamano_producto($product_id);
                            if ($tamano) {
                                wp_set_object_terms($product_id, $tamano, 'tamano_guardian');
                                $stats['tamano']++;
                            }
                        }
                    }

                    // Tipo de ser
                    if ($clasificar_tipo) {
                        $tipos = wp_get_post_terms($product_id, 'tipo_ser', ['fields' => 'slugs']);
                        if (empty($tipos) || $forzar) {
                            $tipo = duendes_detectar_tipo_ser($product_id);
                            if ($tipo) {
                                wp_set_object_terms($product_id, $tipo, 'tipo_ser');
                                $stats['tipo']++;
                            }
                        }
                    }

                    // Es único
                    if ($clasificar_unico) {
                        $unico_actual = get_post_meta($product_id, '_es_unico', true);
                        if ($unico_actual === '' || $forzar) {
                            $es_unico = duendes_detectar_es_unico($product_id) ? 'yes' : 'no';
                            update_post_meta($product_id, '_es_unico', $es_unico);
                            $stats['unico']++;
                        }
                    }
                }

                echo '<div class="notice notice-success" style="margin-top: 20px; padding: 15px;">';
                echo '<h3>✅ Clasificación completada</h3>';
                echo '<ul>';
                echo '<li>Productos clasificados por tamaño: <strong>' . $stats['tamano'] . '</strong></li>';
                echo '<li>Productos clasificados por tipo: <strong>' . $stats['tipo'] . '</strong></li>';
                echo '<li>Productos con es_unico actualizado: <strong>' . $stats['unico'] . '</strong></li>';
                echo '</ul>';
                echo '<p><a href="' . admin_url('admin.php?page=duendes-clasificacion') . '">Recargar página para ver estadísticas actualizadas</a></p>';
                echo '</div>';
            }
            ?>
        </div>

        <div class="card" style="max-width: 800px; padding: 20px; margin-top: 20px;">
            <h2>Configuración</h2>

            <h3>Minis Clásicos (NO únicos, se recrean)</h3>
            <p style="color: #666;">Estos guardianes tienen es_unico = NO:</p>
            <code><?php echo implode(', ', DUENDES_MINIS_CLASICOS); ?></code>

            <h3 style="margin-top: 20px;">Personajes Recreables</h3>
            <code><?php echo implode(', ', DUENDES_PERSONAJES_RECREABLES); ?></code>

            <h3 style="margin-top: 20px;">Orden de la Tienda</h3>
            <p>✅ El orden default de la tienda está configurado como <strong>precio descendente</strong> (los más caros primero).</p>
            <p>Cuando se publiquen los Gigantes ($1,050), automáticamente aparecerán primero.</p>
        </div>
    </div>
    <?php
}

// =============================================================================
// MOSTRAR BADGES EN LA TIENDA
// =============================================================================

// Badge de "Guardián Único" o "Recreable" en las cards
add_action('woocommerce_before_shop_loop_item_title', 'duendes_badge_unico', 15);

function duendes_badge_unico() {
    global $product;

    $es_unico = get_post_meta($product->get_id(), '_es_unico', true);

    if ($es_unico === 'no') {
        // Es recreable (Mini clásico o personaje)
        return; // No mostrar badge para recreables
    }

    // Es único - mostrar badge sutil
    echo '<span class="duendes-badge-unico">Guardián único</span>';
}

// CSS para badges
add_action('wp_head', 'duendes_estilos_clasificacion');

function duendes_estilos_clasificacion() {
    if (!is_shop() && !is_product_category() && !is_product()) return;
    ?>
    <style>
    .duendes-badge-unico {
        position: absolute;
        top: 10px;
        right: 10px;
        background: rgba(0, 0, 0, 0.7);
        color: rgba(255, 255, 255, 0.8);
        font-size: 10px;
        font-family: 'Cinzel', serif;
        text-transform: uppercase;
        letter-spacing: 1px;
        padding: 4px 8px;
        z-index: 10;
    }

    .duendes-badge-tamano {
        position: absolute;
        top: 10px;
        left: 10px;
        background: rgba(201, 162, 39, 0.9);
        color: #0a0a0a;
        font-size: 10px;
        font-family: 'Cinzel', serif;
        text-transform: uppercase;
        letter-spacing: 1px;
        padding: 4px 8px;
        z-index: 10;
    }

    /* Asegurar position relative en el contenedor de imagen */
    .woocommerce ul.products li.product .woocommerce-loop-product__link,
    .woocommerce ul.products li.product a img {
        position: relative;
    }

    .woocommerce ul.products li.product {
        position: relative;
    }
    </style>
    <?php
}

// =============================================================================
// FILTROS EN LA TIENDA POR TAXONOMÍAS
// =============================================================================

// Widget de filtro por tamaño
add_action('woocommerce_before_shop_loop', 'duendes_filtros_tienda', 15);

function duendes_filtros_tienda() {
    if (!is_shop() && !is_product_category()) return;

    $current_tamano = isset($_GET['tamano']) ? sanitize_text_field($_GET['tamano']) : '';
    $current_tipo = isset($_GET['tipo-ser']) ? sanitize_text_field($_GET['tipo-ser']) : '';

    ?>
    <div class="duendes-filtros-tienda" style="margin-bottom: 30px; padding: 20px 0; border-bottom: 1px solid rgba(201, 162, 39, 0.2);">

        <!-- Filtro por Tamaño -->
        <div class="duendes-filtro-grupo" style="margin-bottom: 15px;">
            <span style="font-family: 'Cinzel', serif; text-transform: uppercase; font-size: 11px; letter-spacing: 2px; color: rgba(255,255,255,0.5); margin-right: 15px;">Tamaño:</span>

            <a href="<?php echo remove_query_arg('tamano'); ?>"
               class="duendes-filtro-link <?php echo empty($current_tamano) ? 'active' : ''; ?>"
               style="<?php echo empty($current_tamano) ? 'color: #c9a227;' : ''; ?>">
                Todos
            </a>

            <?php foreach (DUENDES_TAMANOS as $slug => $data): ?>
                <a href="<?php echo add_query_arg('tamano', $slug); ?>"
                   class="duendes-filtro-link <?php echo $current_tamano === $slug ? 'active' : ''; ?>"
                   style="<?php echo $current_tamano === $slug ? 'color: #c9a227;' : ''; ?>">
                    <?php echo $data['nombre']; ?>
                    <span style="opacity: 0.5; font-size: 10px;">$<?php echo $data['precio_usd']; ?></span>
                </a>
            <?php endforeach; ?>
        </div>

        <!-- Filtro por Tipo de Ser -->
        <div class="duendes-filtro-grupo">
            <span style="font-family: 'Cinzel', serif; text-transform: uppercase; font-size: 11px; letter-spacing: 2px; color: rgba(255,255,255,0.5); margin-right: 15px;">Tipo:</span>

            <a href="<?php echo remove_query_arg('tipo-ser'); ?>"
               class="duendes-filtro-link <?php echo empty($current_tipo) ? 'active' : ''; ?>"
               style="<?php echo empty($current_tipo) ? 'color: #c9a227;' : ''; ?>">
                Todos
            </a>

            <?php foreach (DUENDES_TIPOS_SER as $slug => $data): ?>
                <a href="<?php echo add_query_arg('tipo-ser', $slug); ?>"
                   class="duendes-filtro-link <?php echo $current_tipo === $slug ? 'active' : ''; ?>"
                   style="<?php echo $current_tipo === $slug ? 'color: #c9a227;' : ''; ?>">
                    <?php echo $data['nombre']; ?>
                </a>
            <?php endforeach; ?>
        </div>
    </div>

    <style>
    .duendes-filtro-link {
        font-family: 'Cinzel', serif;
        text-transform: uppercase;
        font-size: 11px;
        letter-spacing: 1px;
        color: rgba(255, 255, 255, 0.7);
        text-decoration: none;
        margin-right: 20px;
        padding-bottom: 5px;
        border-bottom: 1px solid transparent;
        transition: all 0.3s ease;
    }

    .duendes-filtro-link:hover,
    .duendes-filtro-link.active {
        color: #c9a227;
        border-bottom-color: #c9a227;
    }
    </style>
    <?php
}

// Aplicar filtros a la query
add_action('woocommerce_product_query', 'duendes_aplicar_filtros_tienda');

function duendes_aplicar_filtros_tienda($q) {
    $tax_query = $q->get('tax_query') ?: [];

    // Filtro por tamaño
    if (!empty($_GET['tamano'])) {
        $tax_query[] = [
            'taxonomy' => 'tamano_guardian',
            'field' => 'slug',
            'terms' => sanitize_text_field($_GET['tamano'])
        ];
    }

    // Filtro por tipo de ser
    if (!empty($_GET['tipo-ser'])) {
        $tax_query[] = [
            'taxonomy' => 'tipo_ser',
            'field' => 'slug',
            'terms' => sanitize_text_field($_GET['tipo-ser'])
        ];
    }

    if (!empty($tax_query)) {
        $q->set('tax_query', $tax_query);
    }
}

// =============================================================================
// API REST PARA VERCEL
// =============================================================================

add_action('rest_api_init', 'duendes_registrar_api_clasificacion');

function duendes_registrar_api_clasificacion() {
    register_rest_route('duendes/v1', '/clasificacion/(?P<id>\d+)', [
        'methods' => 'GET',
        'callback' => 'duendes_api_get_clasificacion',
        'permission_callback' => '__return_true'
    ]);

    register_rest_route('duendes/v1', '/clasificacion/stats', [
        'methods' => 'GET',
        'callback' => 'duendes_api_get_stats',
        'permission_callback' => '__return_true'
    ]);
}

function duendes_api_get_clasificacion($request) {
    $product_id = $request['id'];

    $tamano = wp_get_post_terms($product_id, 'tamano_guardian', ['fields' => 'slugs']);
    $tipo = wp_get_post_terms($product_id, 'tipo_ser', ['fields' => 'slugs']);
    $es_unico = get_post_meta($product_id, '_es_unico', true);

    return [
        'product_id' => $product_id,
        'tamano' => !empty($tamano) ? $tamano[0] : null,
        'tipo_ser' => !empty($tipo) ? $tipo[0] : null,
        'es_unico' => $es_unico === 'yes'
    ];
}

function duendes_api_get_stats($request) {
    $stats = [];

    // Por tamaño
    foreach (DUENDES_TAMANOS as $slug => $data) {
        $term = get_term_by('slug', $slug, 'tamano_guardian');
        $stats['tamanos'][$slug] = [
            'nombre' => $data['nombre'],
            'precio_usd' => $data['precio_usd'],
            'cantidad' => $term ? $term->count : 0
        ];
    }

    // Por tipo
    foreach (DUENDES_TIPOS_SER as $slug => $data) {
        $term = get_term_by('slug', $slug, 'tipo_ser');
        $stats['tipos'][$slug] = [
            'nombre' => $data['nombre'],
            'cantidad' => $term ? $term->count : 0
        ];
    }

    // Únicos vs recreables
    global $wpdb;
    $unicos = $wpdb->get_var("
        SELECT COUNT(*) FROM {$wpdb->postmeta}
        WHERE meta_key = '_es_unico' AND meta_value = 'yes'
    ");
    $recreables = $wpdb->get_var("
        SELECT COUNT(*) FROM {$wpdb->postmeta}
        WHERE meta_key = '_es_unico' AND meta_value = 'no'
    ");

    $stats['unicidad'] = [
        'unicos' => intval($unicos),
        'recreables' => intval($recreables)
    ];

    return $stats;
}

// =============================================================================
// ACTIVACIÓN DEL PLUGIN
// =============================================================================

register_activation_hook(__FILE__, 'duendes_clasificacion_activar');

function duendes_clasificacion_activar() {
    // Registrar taxonomías
    duendes_registrar_taxonomias();

    // Flush rewrite rules
    flush_rewrite_rules();
}

register_deactivation_hook(__FILE__, 'duendes_clasificacion_desactivar');

function duendes_clasificacion_desactivar() {
    flush_rewrite_rules();
}
