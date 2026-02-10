<?php
/**
 * Plugin Name: Duendes - Tags de Intención
 * Description: Sistema de tags de intención para guardianes (protección, abundancia, amor, sanación, paz)
 * Version: 1.0.0
 * Author: Duendes del Uruguay
 */

if (!defined('ABSPATH')) exit;

// ═══════════════════════════════════════════════════════════════
// REGISTRAR TAXONOMÍA CUSTOM "INTENCIÓN"
// ═══════════════════════════════════════════════════════════════

add_action('init', function() {
    register_taxonomy('intencion', 'product', [
        'label' => 'Intención',
        'labels' => [
            'name' => 'Intenciones',
            'singular_name' => 'Intención',
            'search_items' => 'Buscar Intenciones',
            'all_items' => 'Todas las Intenciones',
            'edit_item' => 'Editar Intención',
            'update_item' => 'Actualizar Intención',
            'add_new_item' => 'Agregar Nueva Intención',
            'new_item_name' => 'Nueva Intención',
            'menu_name' => 'Intenciones',
        ],
        'hierarchical' => false,
        'show_ui' => true,
        'show_admin_column' => true,
        'query_var' => true,
        'rewrite' => ['slug' => 'intencion'],
        'show_in_rest' => true, // Para que aparezca en API
    ]);

    // Crear las 5 intenciones base si no existen
    $intenciones = [
        'proteccion' => [
            'name' => 'Protección',
            'description' => 'Guardianes que protegen contra energías negativas, envidias y malas vibras'
        ],
        'abundancia' => [
            'name' => 'Abundancia',
            'description' => 'Guardianes que atraen prosperidad, dinero y éxito en negocios'
        ],
        'amor' => [
            'name' => 'Amor',
            'description' => 'Guardianes que ayudan con relaciones, pareja y amor propio'
        ],
        'sanacion' => [
            'name' => 'Sanación',
            'description' => 'Guardianes que apoyan procesos de salud y bienestar'
        ],
        'paz' => [
            'name' => 'Paz',
            'description' => 'Guardianes que traen calma, reducen ansiedad y equilibran'
        ],
    ];

    foreach ($intenciones as $slug => $data) {
        if (!term_exists($slug, 'intencion')) {
            wp_insert_term($data['name'], 'intencion', [
                'slug' => $slug,
                'description' => $data['description']
            ]);
        }
    }
});

// ═══════════════════════════════════════════════════════════════
// METABOX EN PRODUCTO PARA ASIGNAR INTENCIONES RÁPIDO
// ═══════════════════════════════════════════════════════════════

add_action('add_meta_boxes', function() {
    add_meta_box(
        'duendes_intenciones_box',
        '🔮 Intenciones del Guardián',
        'duendes_intenciones_metabox',
        'product',
        'side',
        'high'
    );
});

function duendes_intenciones_metabox($post) {
    $intenciones = get_terms(['taxonomy' => 'intencion', 'hide_empty' => false]);
    $asignadas = wp_get_post_terms($post->ID, 'intencion', ['fields' => 'slugs']);

    wp_nonce_field('duendes_intenciones_nonce', 'duendes_intenciones_nonce');

    echo '<style>
        .intencion-checkbox { display: block; margin: 8px 0; padding: 8px 12px; background: #f9f9f9; border-radius: 4px; cursor: pointer; }
        .intencion-checkbox:hover { background: #f0f0f0; }
        .intencion-checkbox input { margin-right: 8px; }
        .intencion-checkbox.checked { background: #e8f5e9; border-left: 3px solid #4caf50; }
    </style>';

    foreach ($intenciones as $intencion) {
        $checked = in_array($intencion->slug, $asignadas) ? 'checked' : '';
        $class = $checked ? 'intencion-checkbox checked' : 'intencion-checkbox';
        $emoji = '';
        switch($intencion->slug) {
            case 'proteccion': $emoji = '🛡️'; break;
            case 'abundancia': $emoji = '💰'; break;
            case 'amor': $emoji = '💕'; break;
            case 'sanacion': $emoji = '💚'; break;
            case 'paz': $emoji = '☮️'; break;
        }
        echo "<label class='$class'>
            <input type='checkbox' name='intenciones[]' value='{$intencion->slug}' $checked>
            $emoji {$intencion->name}
        </label>";
    }

    echo '<p style="margin-top:12px;font-size:11px;color:#666;">
        Seleccioná las intenciones que mejor describen a este guardián.
    </p>';
}

add_action('save_post_product', function($post_id) {
    if (!isset($_POST['duendes_intenciones_nonce']) ||
        !wp_verify_nonce($_POST['duendes_intenciones_nonce'], 'duendes_intenciones_nonce')) {
        return;
    }

    if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) return;
    if (!current_user_can('edit_post', $post_id)) return;

    $intenciones = isset($_POST['intenciones']) ? array_map('sanitize_text_field', $_POST['intenciones']) : [];
    wp_set_post_terms($post_id, $intenciones, 'intencion');
});

// ═══════════════════════════════════════════════════════════════
// API ENDPOINT PARA TITO
// ═══════════════════════════════════════════════════════════════

add_action('rest_api_init', function() {
    // Endpoint para obtener intenciones de un producto
    register_rest_route('duendes/v1', '/intenciones/(?P<id>\d+)', [
        'methods' => 'GET',
        'callback' => function($request) {
            $product_id = $request['id'];
            $intenciones = wp_get_post_terms($product_id, 'intencion', ['fields' => 'slugs']);
            return ['intenciones' => $intenciones];
        },
        'permission_callback' => '__return_true'
    ]);

    // Endpoint para buscar productos por intención
    register_rest_route('duendes/v1', '/productos-por-intencion/(?P<slug>[a-z]+)', [
        'methods' => 'GET',
        'callback' => function($request) {
            $slug = $request['slug'];
            $productos = get_posts([
                'post_type' => 'product',
                'posts_per_page' => 50,
                'tax_query' => [
                    [
                        'taxonomy' => 'intencion',
                        'field' => 'slug',
                        'terms' => $slug
                    ]
                ],
                'meta_query' => [
                    [
                        'key' => '_stock_status',
                        'value' => 'instock'
                    ]
                ]
            ]);

            return array_map(function($p) {
                return [
                    'id' => $p->ID,
                    'nombre' => $p->post_title,
                    'slug' => $p->post_name
                ];
            }, $productos);
        },
        'permission_callback' => '__return_true'
    ]);

    // Endpoint para ejecutar asignación automática (protegido con secret)
    register_rest_route('duendes/v1', '/auto-asignar-intenciones', [
        'methods' => 'POST',
        'callback' => function($request) {
            $secret = $request->get_param('secret');
            $expected = 'duendes_intenciones_2026_xK9pL2mN';

            if ($secret !== $expected) {
                return new WP_Error('forbidden', 'Secret inválido', ['status' => 403]);
            }

            $solo_sin = $request->get_param('solo_sin_intencion') !== false;

            $args = [
                'post_type' => 'product',
                'posts_per_page' => -1,
                'post_status' => 'publish'
            ];

            if ($solo_sin) {
                $args['tax_query'] = [
                    [
                        'taxonomy' => 'intencion',
                        'operator' => 'NOT EXISTS'
                    ]
                ];
            }

            $productos = get_posts($args);
            $asignados = 0;
            $detalles = [];

            $patrones = [
                'proteccion' => '/protecci[oó]n|proteger|protector|escudo|defensa|negativ|envidia|mal de ojo/i',
                'abundancia' => '/abundancia|prosperidad|dinero|riqueza|emprendedor|abrecaminos|fortuna|suerte|negocio/i',
                'amor' => '/amor|coraz[oó]n|pareja|relaci[oó]n|romanc/i',
                'sanacion' => '/sanaci[oó]n|sanar|salud|bienestar|curar|curaci[oó]n/i',
                'paz' => '/paz|calma|tranquil|armon[ií]a|ansiedad|estr[eé]s|equilibrio/i',
            ];

            foreach ($productos as $producto) {
                $texto = strtolower($producto->post_title . ' ' . $producto->post_name . ' ' . $producto->post_content);
                $intenciones_detectadas = [];

                foreach ($patrones as $slug => $patron) {
                    if (preg_match($patron, $texto)) {
                        $intenciones_detectadas[] = $slug;
                    }
                }

                if (!empty($intenciones_detectadas)) {
                    wp_set_post_terms($producto->ID, $intenciones_detectadas, 'intencion', true);
                    $asignados++;
                    $detalles[] = [
                        'id' => $producto->ID,
                        'nombre' => $producto->post_title,
                        'intenciones' => $intenciones_detectadas
                    ];
                }
            }

            return [
                'success' => true,
                'productos_analizados' => count($productos),
                'productos_asignados' => $asignados,
                'detalles' => $detalles
            ];
        },
        'permission_callback' => '__return_true'
    ]);
});

// ═══════════════════════════════════════════════════════════════
// INCLUIR INTENCIONES EN API DE WOOCOMMERCE
// ═══════════════════════════════════════════════════════════════

add_filter('woocommerce_rest_prepare_product_object', function($response, $product, $request) {
    $data = $response->get_data();
    $intenciones = wp_get_post_terms($product->get_id(), 'intencion', ['fields' => 'all']);

    $data['intenciones'] = array_map(function($t) {
        return [
            'id' => $t->term_id,
            'name' => $t->name,
            'slug' => $t->slug
        ];
    }, $intenciones);

    $response->set_data($data);
    return $response;
}, 10, 3);

// ═══════════════════════════════════════════════════════════════
// PÁGINA DE ADMIN PARA ASIGNACIÓN MASIVA
// ═══════════════════════════════════════════════════════════════

add_action('admin_menu', function() {
    add_submenu_page(
        'edit.php?post_type=product',
        'Asignar Intenciones',
        '🔮 Asignar Intenciones',
        'manage_woocommerce',
        'duendes-intenciones',
        'duendes_pagina_intenciones'
    );
});

function duendes_pagina_intenciones() {
    // Procesar asignación automática
    if (isset($_POST['auto_asignar']) && check_admin_referer('duendes_auto_asignar')) {
        $resultado = duendes_auto_asignar_intenciones();
        echo '<div class="notice notice-success"><p>✅ ' . esc_html($resultado) . '</p></div>';
    }

    // Estadísticas
    $stats = duendes_estadisticas_intenciones();

    ?>
    <div class="wrap">
        <h1>🔮 Intenciones de Guardianes</h1>

        <div style="display: flex; gap: 20px; margin-top: 20px;">
            <!-- Stats -->
            <div style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); flex: 1;">
                <h2 style="margin-top:0;">📊 Estadísticas</h2>
                <table class="widefat" style="border: none;">
                    <tr><td>🛡️ Protección</td><td><strong><?php echo $stats['proteccion']; ?></strong> productos</td></tr>
                    <tr><td>💰 Abundancia</td><td><strong><?php echo $stats['abundancia']; ?></strong> productos</td></tr>
                    <tr><td>💕 Amor</td><td><strong><?php echo $stats['amor']; ?></strong> productos</td></tr>
                    <tr><td>💚 Sanación</td><td><strong><?php echo $stats['sanacion']; ?></strong> productos</td></tr>
                    <tr><td>☮️ Paz</td><td><strong><?php echo $stats['paz']; ?></strong> productos</td></tr>
                    <tr style="border-top: 2px solid #ddd;"><td>📦 Sin intención</td><td><strong><?php echo $stats['sin_intencion']; ?></strong> productos</td></tr>
                </table>
            </div>

            <!-- Auto-asignación -->
            <div style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); flex: 1;">
                <h2 style="margin-top:0;">⚡ Asignación Automática</h2>
                <p>Analiza nombre, slug y descripción de cada producto para detectar intenciones automáticamente.</p>

                <form method="post">
                    <?php wp_nonce_field('duendes_auto_asignar'); ?>
                    <p><label>
                        <input type="checkbox" name="solo_sin_intencion" checked>
                        Solo productos SIN intención asignada
                    </label></p>
                    <button type="submit" name="auto_asignar" class="button button-primary button-hero">
                        🔮 Asignar Intenciones Automáticamente
                    </button>
                </form>

                <h3 style="margin-top:20px;">Patrones de detección:</h3>
                <ul style="font-size:12px; color:#666;">
                    <li><strong>Protección:</strong> protección, proteger, escudo, defensa, negativo, envidia</li>
                    <li><strong>Abundancia:</strong> abundancia, prosperidad, dinero, riqueza, fortuna, suerte</li>
                    <li><strong>Amor:</strong> amor, corazón, pareja, relación</li>
                    <li><strong>Sanación:</strong> sanación, sanar, salud, bienestar, curar</li>
                    <li><strong>Paz:</strong> paz, calma, tranquilidad, armonía, ansiedad, estrés</li>
                </ul>
            </div>
        </div>

        <!-- Lista de productos sin intención -->
        <?php if ($stats['sin_intencion'] > 0): ?>
        <div style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); margin-top: 20px;">
            <h2 style="margin-top:0;">⚠️ Productos sin intención (<?php echo $stats['sin_intencion']; ?>)</h2>
            <table class="widefat striped">
                <thead>
                    <tr>
                        <th>Producto</th>
                        <th>Slug</th>
                        <th>Acción</th>
                    </tr>
                </thead>
                <tbody>
                    <?php
                    $sin_intencion = get_posts([
                        'post_type' => 'product',
                        'posts_per_page' => 20,
                        'tax_query' => [
                            [
                                'taxonomy' => 'intencion',
                                'operator' => 'NOT EXISTS'
                            ]
                        ]
                    ]);
                    foreach ($sin_intencion as $p): ?>
                    <tr>
                        <td><strong><?php echo esc_html($p->post_title); ?></strong></td>
                        <td><code><?php echo esc_html($p->post_name); ?></code></td>
                        <td><a href="<?php echo get_edit_post_link($p->ID); ?>" class="button">Editar</a></td>
                    </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
        </div>
        <?php endif; ?>
    </div>
    <?php
}

function duendes_estadisticas_intenciones() {
    $stats = [];
    $intenciones = ['proteccion', 'abundancia', 'amor', 'sanacion', 'paz'];

    foreach ($intenciones as $slug) {
        $term = get_term_by('slug', $slug, 'intencion');
        $stats[$slug] = $term ? $term->count : 0;
    }

    // Productos sin intención
    $sin = get_posts([
        'post_type' => 'product',
        'posts_per_page' => -1,
        'fields' => 'ids',
        'tax_query' => [
            [
                'taxonomy' => 'intencion',
                'operator' => 'NOT EXISTS'
            ]
        ]
    ]);
    $stats['sin_intencion'] = count($sin);

    return $stats;
}

function duendes_auto_asignar_intenciones() {
    $solo_sin = isset($_POST['solo_sin_intencion']);

    $args = [
        'post_type' => 'product',
        'posts_per_page' => -1,
        'post_status' => 'publish'
    ];

    if ($solo_sin) {
        $args['tax_query'] = [
            [
                'taxonomy' => 'intencion',
                'operator' => 'NOT EXISTS'
            ]
        ];
    }

    $productos = get_posts($args);
    $asignados = 0;

    $patrones = [
        'proteccion' => '/protecci[oó]n|proteger|protector|escudo|defensa|negativ|envidia|mal de ojo/i',
        'abundancia' => '/abundancia|prosperidad|dinero|riqueza|emprendedor|abrecaminos|fortuna|suerte|negocio/i',
        'amor' => '/amor|coraz[oó]n|pareja|relaci[oó]n|romanc/i',
        'sanacion' => '/sanaci[oó]n|sanar|salud|bienestar|curar|curación/i',
        'paz' => '/paz|calma|tranquil|armon[ií]a|ansiedad|estr[eé]s|equilibrio/i',
    ];

    foreach ($productos as $producto) {
        $texto = strtolower($producto->post_title . ' ' . $producto->post_name . ' ' . $producto->post_content);
        $intenciones_detectadas = [];

        foreach ($patrones as $slug => $patron) {
            if (preg_match($patron, $texto)) {
                $intenciones_detectadas[] = $slug;
            }
        }

        if (!empty($intenciones_detectadas)) {
            wp_set_post_terms($producto->ID, $intenciones_detectadas, 'intencion', true);
            $asignados++;
        }
    }

    return "Se asignaron intenciones a $asignados productos";
}

// ═══════════════════════════════════════════════════════════════
// COLUMNA EN LISTA DE PRODUCTOS
// ═══════════════════════════════════════════════════════════════

add_filter('manage_edit-product_columns', function($columns) {
    $new_columns = [];
    foreach ($columns as $key => $value) {
        $new_columns[$key] = $value;
        if ($key === 'product_cat') {
            $new_columns['intenciones'] = '🔮 Intenciones';
        }
    }
    return $new_columns;
});

add_action('manage_product_posts_custom_column', function($column, $post_id) {
    if ($column === 'intenciones') {
        $intenciones = wp_get_post_terms($post_id, 'intencion', ['fields' => 'names']);
        if (!empty($intenciones)) {
            $emojis = [
                'Protección' => '🛡️',
                'Abundancia' => '💰',
                'Amor' => '💕',
                'Sanación' => '💚',
                'Paz' => '☮️'
            ];
            foreach ($intenciones as $int) {
                $emoji = isset($emojis[$int]) ? $emojis[$int] : '';
                echo "<span style='display:inline-block;background:#f0f0f0;padding:2px 8px;border-radius:12px;margin:2px;font-size:12px;'>$emoji $int</span>";
            }
        } else {
            echo '<span style="color:#999;">—</span>';
        }
    }
}, 10, 2);
