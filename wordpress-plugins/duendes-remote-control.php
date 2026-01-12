<?php
/**
 * Plugin Name: Duendes Remote Control
 * Description: API para control remoto desde Vercel - Gestiona snippets WPCode y más
 * Version: 1.0.0
 * Author: Duendes del Uruguay
 */

if (!defined('ABSPATH')) {
    exit;
}

// Clave secreta para autenticación (CAMBIAR EN PRODUCCIÓN)
define('DUENDES_REMOTE_SECRET', 'duendes_vercel_2026_secretkey_XkJ9mN2pL5qR8sT1');

/**
 * Registrar endpoints REST API
 */
add_action('rest_api_init', function () {
    // Endpoint principal de control
    register_rest_route('duendes/v1', '/control', [
        'methods' => ['GET', 'POST'],
        'callback' => 'duendes_remote_control_handler',
        'permission_callback' => 'duendes_verify_secret'
    ]);

    // Endpoint para snippets WPCode
    register_rest_route('duendes/v1', '/snippets', [
        'methods' => ['GET', 'POST'],
        'callback' => 'duendes_snippets_handler',
        'permission_callback' => 'duendes_verify_secret'
    ]);

    // Endpoint para limpiar caché
    register_rest_route('duendes/v1', '/cache', [
        'methods' => 'POST',
        'callback' => 'duendes_cache_handler',
        'permission_callback' => 'duendes_verify_secret'
    ]);

    // Endpoint de estado/health check
    register_rest_route('duendes/v1', '/status', [
        'methods' => 'GET',
        'callback' => 'duendes_status_handler',
        'permission_callback' => 'duendes_verify_secret'
    ]);
});

/**
 * Verificar clave secreta
 */
function duendes_verify_secret($request) {
    $secret = $request->get_header('X-Duendes-Secret');
    if (empty($secret)) {
        $secret = $request->get_param('secret');
    }
    return $secret === DUENDES_REMOTE_SECRET;
}

/**
 * Handler de control general
 */
function duendes_remote_control_handler($request) {
    $action = $request->get_param('action');

    switch ($action) {
        case 'info':
            return duendes_get_site_info();
        case 'plugins':
            return duendes_get_plugins_list();
        default:
            return new WP_REST_Response([
                'success' => true,
                'message' => 'Duendes Remote Control activo',
                'version' => '1.0.0',
                'actions' => ['info', 'plugins']
            ], 200);
    }
}

/**
 * Handler de snippets WPCode
 */
function duendes_snippets_handler($request) {
    global $wpdb;

    $action = $request->get_param('action');
    $snippet_id = $request->get_param('id');

    // Verificar si WPCode está instalado
    if (!class_exists('WPCode_Snippet') && !defined('WPCODE_VERSION')) {
        // Intentar buscar directamente en la base de datos
        $table_name = $wpdb->prefix . 'wpcode_snippets';
        $table_exists = $wpdb->get_var("SHOW TABLES LIKE '$table_name'") === $table_name;

        if (!$table_exists) {
            // WPCode usa custom post type en versiones recientes
            return duendes_snippets_via_cpt($request);
        }
    }

    switch ($action) {
        case 'list':
            return duendes_list_snippets();

        case 'activate':
            if (!$snippet_id) {
                return new WP_REST_Response(['success' => false, 'error' => 'ID requerido'], 400);
            }
            return duendes_toggle_snippet($snippet_id, true);

        case 'deactivate':
            if (!$snippet_id) {
                return new WP_REST_Response(['success' => false, 'error' => 'ID requerido'], 400);
            }
            return duendes_toggle_snippet($snippet_id, false);

        case 'get':
            if (!$snippet_id) {
                return new WP_REST_Response(['success' => false, 'error' => 'ID requerido'], 400);
            }
            return duendes_get_snippet($snippet_id);

        case 'delete':
            if (!$snippet_id) {
                return new WP_REST_Response(['success' => false, 'error' => 'ID requerido'], 400);
            }
            return duendes_delete_snippet($snippet_id);

        case 'create':
            $title = $request->get_param('title');
            $code = $request->get_param('code');
            $code_type = $request->get_param('code_type') ?: 'html';
            $location = $request->get_param('location') ?: 'site_wide_footer';
            $activate = $request->get_param('activate') === 'true' || $request->get_param('activate') === true;

            if (!$title || !$code) {
                return new WP_REST_Response(['success' => false, 'error' => 'title y code requeridos'], 400);
            }
            return duendes_create_snippet($title, $code, $code_type, $location, $activate);

        default:
            return duendes_list_snippets();
    }
}

/**
 * Listar snippets de WPCode
 */
function duendes_list_snippets() {
    // WPCode usa custom post type 'wpcode'
    $args = [
        'post_type' => 'wpcode',
        'posts_per_page' => -1,
        'post_status' => ['publish', 'draft']
    ];

    $snippets = get_posts($args);
    $result = [];

    foreach ($snippets as $snippet) {
        $is_active = get_post_meta($snippet->ID, '_wpcode_active', true);
        $code_type = get_post_meta($snippet->ID, '_wpcode_code_type', true);
        $location = get_post_meta($snippet->ID, '_wpcode_location', true);

        $result[] = [
            'id' => $snippet->ID,
            'title' => $snippet->post_title,
            'status' => $snippet->post_status,
            'active' => $is_active === '1' || $is_active === 'yes' || $is_active === true,
            'type' => $code_type ?: 'html',
            'location' => $location,
            'modified' => $snippet->post_modified
        ];
    }

    return new WP_REST_Response([
        'success' => true,
        'total' => count($result),
        'snippets' => $result
    ], 200);
}

/**
 * Activar/Desactivar snippet
 */
function duendes_toggle_snippet($snippet_id, $activate) {
    $snippet = get_post($snippet_id);

    if (!$snippet || $snippet->post_type !== 'wpcode') {
        return new WP_REST_Response([
            'success' => false,
            'error' => 'Snippet no encontrado'
        ], 404);
    }

    // Actualizar estado activo
    update_post_meta($snippet_id, '_wpcode_active', $activate ? '1' : '0');

    // También actualizar el estado del post si corresponde
    if ($activate) {
        wp_update_post(['ID' => $snippet_id, 'post_status' => 'publish']);
    }

    // Limpiar caché de WPCode si existe
    if (function_exists('wpcode_clear_snippet_cache')) {
        wpcode_clear_snippet_cache();
    }

    return new WP_REST_Response([
        'success' => true,
        'message' => $activate ? 'Snippet activado' : 'Snippet desactivado',
        'snippet_id' => $snippet_id,
        'active' => $activate
    ], 200);
}

/**
 * Obtener snippet específico
 */
function duendes_get_snippet($snippet_id) {
    $snippet = get_post($snippet_id);

    if (!$snippet || $snippet->post_type !== 'wpcode') {
        return new WP_REST_Response([
            'success' => false,
            'error' => 'Snippet no encontrado'
        ], 404);
    }

    $is_active = get_post_meta($snippet_id, '_wpcode_active', true);
    $code_type = get_post_meta($snippet_id, '_wpcode_code_type', true);
    $location = get_post_meta($snippet_id, '_wpcode_location', true);
    $code = get_post_meta($snippet_id, '_wpcode_code', true);

    return new WP_REST_Response([
        'success' => true,
        'snippet' => [
            'id' => $snippet->ID,
            'title' => $snippet->post_title,
            'status' => $snippet->post_status,
            'active' => $is_active === '1' || $is_active === 'yes',
            'type' => $code_type ?: 'html',
            'location' => $location,
            'code' => $code,
            'modified' => $snippet->post_modified,
            'created' => $snippet->post_date
        ]
    ], 200);
}

/**
 * Handler alternativo si WPCode usa otra estructura
 */
function duendes_snippets_via_cpt($request) {
    return duendes_list_snippets();
}

/**
 * Eliminar snippet
 */
function duendes_delete_snippet($snippet_id) {
    $snippet = get_post($snippet_id);

    if (!$snippet || $snippet->post_type !== 'wpcode') {
        return new WP_REST_Response([
            'success' => false,
            'error' => 'Snippet no encontrado'
        ], 404);
    }

    $title = $snippet->post_title;
    $result = wp_delete_post($snippet_id, true); // true = forzar eliminación permanente

    if ($result) {
        return new WP_REST_Response([
            'success' => true,
            'message' => 'Snippet eliminado',
            'deleted_id' => $snippet_id,
            'deleted_title' => $title
        ], 200);
    }

    return new WP_REST_Response([
        'success' => false,
        'error' => 'No se pudo eliminar el snippet'
    ], 500);
}

/**
 * Crear nuevo snippet
 */
function duendes_create_snippet($title, $code, $code_type = 'html', $location = 'site_wide_footer', $activate = false) {
    // Crear el post
    $post_data = [
        'post_title' => $title,
        'post_type' => 'wpcode',
        'post_status' => 'publish',
        'post_content' => ''
    ];

    $post_id = wp_insert_post($post_data);

    if (is_wp_error($post_id)) {
        return new WP_REST_Response([
            'success' => false,
            'error' => $post_id->get_error_message()
        ], 500);
    }

    // Guardar meta datos de WPCode
    update_post_meta($post_id, '_wpcode_code', $code);
    update_post_meta($post_id, '_wpcode_code_type', $code_type);
    update_post_meta($post_id, '_wpcode_location', $location);
    update_post_meta($post_id, '_wpcode_active', $activate ? '1' : '0');
    update_post_meta($post_id, '_wpcode_auto_insert', '1');

    // Configurar para que se ejecute en el footer del sitio
    if ($location === 'site_wide_footer') {
        update_post_meta($post_id, '_wpcode_location', 'site_wide_footer');
    } elseif ($location === 'site_wide_header') {
        update_post_meta($post_id, '_wpcode_location', 'site_wide_header');
    } elseif ($location === 'woocommerce_single_product') {
        update_post_meta($post_id, '_wpcode_location', 'woocommerce_single_product');
        update_post_meta($post_id, '_wpcode_auto_insert_location', 'woocommerce_after_single_product');
    }

    // Limpiar caché
    if (function_exists('wpcode_clear_snippet_cache')) {
        wpcode_clear_snippet_cache();
    }

    return new WP_REST_Response([
        'success' => true,
        'message' => 'Snippet creado',
        'snippet_id' => $post_id,
        'title' => $title,
        'active' => $activate
    ], 200);
}

/**
 * Handler de caché
 */
function duendes_cache_handler($request) {
    $cleared = [];

    // Limpiar caché de 10Web si existe
    if (function_exists('tenweb_clear_all_cache')) {
        tenweb_clear_all_cache();
        $cleared[] = '10web';
    }

    // Limpiar caché de W3 Total Cache
    if (function_exists('w3tc_flush_all')) {
        w3tc_flush_all();
        $cleared[] = 'w3tc';
    }

    // Limpiar caché de WP Super Cache
    if (function_exists('wp_cache_clear_cache')) {
        wp_cache_clear_cache();
        $cleared[] = 'wp-super-cache';
    }

    // Limpiar caché de LiteSpeed
    if (class_exists('LiteSpeed_Cache_API')) {
        LiteSpeed_Cache_API::purge_all();
        $cleared[] = 'litespeed';
    }

    // Limpiar object cache
    wp_cache_flush();
    $cleared[] = 'object-cache';

    // Limpiar transients
    global $wpdb;
    $wpdb->query("DELETE FROM {$wpdb->options} WHERE option_name LIKE '_transient_%'");
    $cleared[] = 'transients';

    return new WP_REST_Response([
        'success' => true,
        'message' => 'Caché limpiado',
        'cleared' => $cleared
    ], 200);
}

/**
 * Handler de estado
 */
function duendes_status_handler($request) {
    global $wpdb;

    return new WP_REST_Response([
        'success' => true,
        'status' => 'online',
        'wordpress' => [
            'version' => get_bloginfo('version'),
            'site_url' => get_site_url(),
            'home_url' => get_home_url(),
            'is_multisite' => is_multisite()
        ],
        'woocommerce' => [
            'active' => class_exists('WooCommerce'),
            'version' => defined('WC_VERSION') ? WC_VERSION : null
        ],
        'wpcode' => [
            'active' => defined('WPCODE_VERSION') || post_type_exists('wpcode'),
            'version' => defined('WPCODE_VERSION') ? WPCODE_VERSION : 'CPT mode'
        ],
        'php' => [
            'version' => phpversion()
        ],
        'database' => [
            'prefix' => $wpdb->prefix
        ],
        'timestamp' => current_time('mysql'),
        'timezone' => wp_timezone_string()
    ], 200);
}

/**
 * Obtener información del sitio
 */
function duendes_get_site_info() {
    return new WP_REST_Response([
        'success' => true,
        'site' => [
            'name' => get_bloginfo('name'),
            'description' => get_bloginfo('description'),
            'url' => get_site_url(),
            'admin_email' => get_option('admin_email'),
            'language' => get_locale(),
            'posts_count' => wp_count_posts()->publish,
            'products_count' => class_exists('WooCommerce') ? wp_count_posts('product')->publish : 0
        ]
    ], 200);
}

/**
 * Obtener lista de plugins
 */
function duendes_get_plugins_list() {
    if (!function_exists('get_plugins')) {
        require_once ABSPATH . 'wp-admin/includes/plugin.php';
    }

    $all_plugins = get_plugins();
    $active_plugins = get_option('active_plugins', []);

    $result = [];
    foreach ($all_plugins as $path => $plugin) {
        $result[] = [
            'name' => $plugin['Name'],
            'version' => $plugin['Version'],
            'active' => in_array($path, $active_plugins),
            'path' => $path
        ];
    }

    return new WP_REST_Response([
        'success' => true,
        'total' => count($result),
        'plugins' => $result
    ], 200);
}

// Log de activación para debug
add_action('init', function() {
    if (defined('WP_DEBUG') && WP_DEBUG) {
        error_log('Duendes Remote Control: Plugin cargado correctamente');
    }
});

/**
 * PÁGINA DE PRODUCTO MÁGICA
 * Inyecta el HTML/CSS/JS en páginas de producto de WooCommerce
 */
add_action('wp_footer', function() {
    // Solo en páginas de producto individuales
    if (!function_exists('is_product') || !is_product()) {
        return;
    }

    $file_path = WP_CONTENT_DIR . '/duendes-magic/producto-magico.html';

    if (file_exists($file_path)) {
        echo "\n<!-- Duendes Magic Product Page -->\n";
        readfile($file_path);
        echo "\n<!-- /Duendes Magic Product Page -->\n";
    }
}, 999); // Prioridad alta para que se ejecute al final
