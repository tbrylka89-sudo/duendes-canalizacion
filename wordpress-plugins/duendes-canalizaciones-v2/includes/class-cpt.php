<?php
/**
 * Custom Post Type para Canalizaciones
 */

if (!defined('ABSPATH')) exit;

class Duendes_Canal_CPT {

    /**
     * Registrar el CPT
     */
    public static function register() {
        register_post_type('duendes_canalizacion', [
            'labels' => [
                'name' => 'Canalizaciones',
                'singular_name' => 'Canalizacion',
                'menu_name' => 'Canalizaciones',
                'add_new' => 'Nueva Canalizacion',
                'add_new_item' => 'Nueva Canalizacion',
                'edit_item' => 'Editar Canalizacion',
                'view_item' => 'Ver Canalizacion',
                'all_items' => 'Todas las Canalizaciones',
                'search_items' => 'Buscar Canalizaciones',
                'not_found' => 'No se encontraron canalizaciones',
            ],
            'public' => false,
            'show_ui' => true,
            'show_in_menu' => true,
            'show_in_rest' => true,
            'rest_base' => 'canalizaciones',
            'menu_icon' => 'dashicons-star-filled',
            'menu_position' => 56,
            'supports' => ['title', 'editor', 'custom-fields'],
            'capability_type' => 'post',
            'capabilities' => [
                'create_posts' => 'manage_woocommerce',
            ],
            'map_meta_cap' => true,
        ]);

        // Registrar estados personalizados
        register_post_status('canal_borrador', [
            'label' => 'Borrador',
            'public' => false,
            'internal' => true,
            'label_count' => _n_noop('Borrador <span class="count">(%s)</span>', 'Borradores <span class="count">(%s)</span>'),
        ]);

        register_post_status('canal_pendiente', [
            'label' => 'Pendiente',
            'public' => false,
            'internal' => true,
            'label_count' => _n_noop('Pendiente <span class="count">(%s)</span>', 'Pendientes <span class="count">(%s)</span>'),
        ]);

        register_post_status('canal_generando', [
            'label' => 'Generando',
            'public' => false,
            'internal' => true,
            'label_count' => _n_noop('Generando <span class="count">(%s)</span>', 'Generando <span class="count">(%s)</span>'),
        ]);

        register_post_status('canal_lista', [
            'label' => 'Lista',
            'public' => false,
            'internal' => true,
            'label_count' => _n_noop('Lista <span class="count">(%s)</span>', 'Listas <span class="count">(%s)</span>'),
        ]);

        register_post_status('canal_enviada', [
            'label' => 'Enviada',
            'public' => false,
            'internal' => true,
            'label_count' => _n_noop('Enviada <span class="count">(%s)</span>', 'Enviadas <span class="count">(%s)</span>'),
        ]);
    }

    /**
     * Crear una nueva canalizacion
     */
    public static function crear_canalizacion($args) {
        $defaults = [
            'orden_id' => 0,
            'guardian_id' => 0,
            'email' => '',
            'nombre_cliente' => '',
            'datos_formulario' => [],
            'tipo_destinatario' => 'para_mi',
        ];

        $args = wp_parse_args($args, $defaults);

        // Obtener datos del guardian
        $product = wc_get_product($args['guardian_id']);
        $guardian_nombre = $product ? $product->get_name() : 'Guardian';
        $guardian_imagen = $product ? wp_get_attachment_url($product->get_image_id()) : '';

        // Detectar categoria
        $guardian_categoria = 'proteccion';
        if ($product) {
            $cats = wp_get_post_terms($args['guardian_id'], 'product_cat', ['fields' => 'slugs']);
            $mapeo = ['proteccion', 'abundancia', 'sanacion', 'amor', 'sabiduria'];
            foreach ($mapeo as $cat) {
                if (in_array($cat, $cats)) {
                    $guardian_categoria = $cat;
                    break;
                }
            }
        }

        // Crear post
        $post_id = wp_insert_post([
            'post_type' => 'duendes_canalizacion',
            'post_title' => "Canalizacion #{$args['orden_id']} - $guardian_nombre - {$args['nombre_cliente']}",
            'post_status' => 'publish',
            'post_content' => '', // Se llena cuando se genera
        ]);

        if (is_wp_error($post_id)) {
            return $post_id;
        }

        // Guardar meta
        update_post_meta($post_id, '_orden_id', $args['orden_id']);
        update_post_meta($post_id, '_guardian_id', $args['guardian_id']);
        update_post_meta($post_id, '_guardian_nombre', $guardian_nombre);
        update_post_meta($post_id, '_guardian_imagen', $guardian_imagen);
        update_post_meta($post_id, '_guardian_categoria', $guardian_categoria);
        update_post_meta($post_id, '_email', sanitize_email($args['email']));
        update_post_meta($post_id, '_nombre_cliente', sanitize_text_field($args['nombre_cliente']));
        update_post_meta($post_id, '_tipo_destinatario', $args['tipo_destinatario']);
        update_post_meta($post_id, '_datos_formulario', $args['datos_formulario']);
        update_post_meta($post_id, '_estado', 'pendiente');
        update_post_meta($post_id, '_fecha_formulario', current_time('mysql'));
        update_post_meta($post_id, '_versiones', []);

        return $post_id;
    }

    /**
     * Obtener canalizaciones por estado
     */
    public static function obtener_por_estado($estado, $args = []) {
        $defaults = [
            'posts_per_page' => 20,
            'paged' => 1,
            'orderby' => 'date',
            'order' => 'DESC',
        ];

        $args = wp_parse_args($args, $defaults);

        return get_posts([
            'post_type' => 'duendes_canalizacion',
            'post_status' => 'publish',
            'meta_query' => [
                ['key' => '_estado', 'value' => $estado],
            ],
            'posts_per_page' => $args['posts_per_page'],
            'paged' => $args['paged'],
            'orderby' => $args['orderby'],
            'order' => $args['order'],
        ]);
    }

    /**
     * Contar canalizaciones por estado
     */
    public static function contar_por_estado($estado) {
        global $wpdb;

        return (int) $wpdb->get_var($wpdb->prepare(
            "SELECT COUNT(*) FROM {$wpdb->posts} p
             INNER JOIN {$wpdb->postmeta} pm ON p.ID = pm.post_id
             WHERE p.post_type = 'duendes_canalizacion'
             AND p.post_status = 'publish'
             AND pm.meta_key = '_estado'
             AND pm.meta_value = %s",
            $estado
        ));
    }

    /**
     * Obtener canalizaciones de una orden
     */
    public static function obtener_por_orden($orden_id) {
        return get_posts([
            'post_type' => 'duendes_canalizacion',
            'post_status' => 'publish',
            'meta_query' => [
                ['key' => '_orden_id', 'value' => $orden_id],
            ],
            'posts_per_page' => -1,
        ]);
    }

    /**
     * Obtener canalizaciones de un cliente por email
     */
    public static function obtener_por_email($email) {
        return get_posts([
            'post_type' => 'duendes_canalizacion',
            'post_status' => 'publish',
            'meta_query' => [
                ['key' => '_email', 'value' => sanitize_email($email)],
                ['key' => '_estado', 'value' => 'enviada'],
            ],
            'posts_per_page' => -1,
            'orderby' => 'date',
            'order' => 'DESC',
        ]);
    }

    /**
     * Guardar version anterior
     */
    public static function guardar_version($post_id, $motivo = '') {
        $post = get_post($post_id);
        if (!$post) return false;

        $versiones = get_post_meta($post_id, '_versiones', true) ?: [];

        $versiones[] = [
            'contenido' => $post->post_content,
            'fecha' => current_time('mysql'),
            'motivo' => $motivo,
            'numero' => count($versiones) + 1,
        ];

        update_post_meta($post_id, '_versiones', $versiones);

        return count($versiones);
    }

    /**
     * Restaurar version anterior
     */
    public static function restaurar_version($post_id, $version_numero) {
        $versiones = get_post_meta($post_id, '_versiones', true) ?: [];

        if (!isset($versiones[$version_numero - 1])) {
            return new WP_Error('version_no_existe', 'La version no existe');
        }

        $version = $versiones[$version_numero - 1];

        // Guardar la actual primero
        self::guardar_version($post_id, "Antes de restaurar a v$version_numero");

        // Restaurar
        wp_update_post([
            'ID' => $post_id,
            'post_content' => $version['contenido'],
        ]);

        return true;
    }

    /**
     * Estadisticas del dashboard
     */
    public static function obtener_estadisticas() {
        return [
            'pendientes' => self::contar_por_estado('pendiente'),
            'generando' => self::contar_por_estado('generando'),
            'listas' => self::contar_por_estado('lista'),
            'enviadas' => self::contar_por_estado('enviada'),
            'total' => self::contar_por_estado('pendiente') +
                       self::contar_por_estado('generando') +
                       self::contar_por_estado('lista') +
                       self::contar_por_estado('enviada'),
        ];
    }
}
