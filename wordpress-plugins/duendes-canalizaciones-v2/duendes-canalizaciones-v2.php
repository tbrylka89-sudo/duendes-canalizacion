<?php
/**
 * Plugin Name: Duendes Canalizaciones V2
 * Description: Sistema completo de canalizaciones para Duendes del Uruguay - 100% WordPress
 * Version: 2.0.0
 * Author: Duendes del Uruguay
 * Text Domain: duendes-canalizaciones
 */

if (!defined('ABSPATH')) exit;

define('DUENDES_CANAL_VERSION', '2.0.0');
define('DUENDES_CANAL_PATH', plugin_dir_path(__FILE__));
define('DUENDES_CANAL_URL', plugin_dir_url(__FILE__));

class Duendes_Canalizaciones_V2 {

    private static $instance = null;

    public static function instance() {
        if (is_null(self::$instance)) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    public function __construct() {
        $this->includes();
        $this->init_hooks();
    }

    private function includes() {
        require_once DUENDES_CANAL_PATH . 'includes/class-cpt.php';
        require_once DUENDES_CANAL_PATH . 'includes/class-formulario.php';
        require_once DUENDES_CANAL_PATH . 'includes/class-claude-generator.php';
        require_once DUENDES_CANAL_PATH . 'includes/class-admin-panel.php';
    }

    private function init_hooks() {
        add_action('init', [$this, 'init']);
        add_action('wp_enqueue_scripts', [$this, 'enqueue_frontend_assets']);
        add_action('admin_enqueue_scripts', [$this, 'enqueue_admin_assets']);

        // AJAX handlers
        add_action('wp_ajax_duendes_guardar_formulario_v2', [$this, 'ajax_guardar_formulario']);
        add_action('wp_ajax_nopriv_duendes_guardar_formulario_v2', [$this, 'ajax_guardar_formulario']);
        add_action('wp_ajax_duendes_generar_canalizacion', [$this, 'ajax_generar_canalizacion']);
        add_action('wp_ajax_duendes_regenerar_canalizacion', [$this, 'ajax_regenerar_canalizacion']);
        add_action('wp_ajax_duendes_enviar_canalizacion', [$this, 'ajax_enviar_canalizacion']);
        add_action('wp_ajax_duendes_obtener_canalizacion', [$this, 'ajax_obtener_canalizacion']);

        // WooCommerce hooks
        add_action('woocommerce_thankyou', [$this, 'mostrar_formulario_thankyou'], 5);
        add_action('woocommerce_order_status_completed', [$this, 'orden_completada']);

        // Shortcodes
        add_shortcode('duendes_formulario_canalizacion', [$this, 'shortcode_formulario']);
        add_shortcode('duendes_completar_canalizacion', [$this, 'shortcode_completar']);
    }

    public function init() {
        // Registrar CPT
        Duendes_Canal_CPT::register();

        // Inicializar admin panel
        if (is_admin()) {
            new Duendes_Canal_Admin_Panel();
        }
    }

    public function enqueue_frontend_assets() {
        if ($this->is_canalizacion_page()) {
            wp_enqueue_style(
                'duendes-canal-form',
                DUENDES_CANAL_URL . 'assets/css/formulario.css',
                [],
                DUENDES_CANAL_VERSION
            );

            wp_enqueue_script(
                'duendes-canal-form',
                DUENDES_CANAL_URL . 'assets/js/formulario.js',
                ['jquery'],
                DUENDES_CANAL_VERSION,
                true
            );

            wp_localize_script('duendes-canal-form', 'duendesCanal', [
                'ajaxUrl' => admin_url('admin-ajax.php'),
                'nonce' => wp_create_nonce('duendes_canal_nonce'),
                'strings' => [
                    'cargando' => 'Cargando...',
                    'guardando' => 'Guardando tu conexion...',
                    'error' => 'Hubo un error. Por favor intenta de nuevo.',
                    'exito' => 'Tus respuestas fueron guardadas.',
                ]
            ]);
        }
    }

    public function enqueue_admin_assets($hook) {
        if (strpos($hook, 'duendes_canalizacion') !== false ||
            strpos($hook, 'duendes-canalizaciones') !== false) {

            wp_enqueue_style(
                'duendes-canal-admin',
                DUENDES_CANAL_URL . 'assets/css/admin.css',
                [],
                DUENDES_CANAL_VERSION
            );

            wp_enqueue_script(
                'duendes-canal-admin',
                DUENDES_CANAL_URL . 'assets/js/admin.js',
                ['jquery', 'wp-util'],
                DUENDES_CANAL_VERSION,
                true
            );

            wp_localize_script('duendes-canal-admin', 'duendesCanalAdmin', [
                'ajaxUrl' => admin_url('admin-ajax.php'),
                'nonce' => wp_create_nonce('duendes_canal_admin_nonce'),
                'strings' => [
                    'generando' => 'Generando canalizacion con IA...',
                    'regenerando' => 'Regenerando con tus instrucciones...',
                    'enviando' => 'Enviando al cliente...',
                    'confirmEnviar' => 'Seguro que queres enviar esta canalizacion?',
                    'exito' => 'Operacion completada!',
                    'error' => 'Error en la operacion.',
                ]
            ]);
        }
    }

    private function is_canalizacion_page() {
        // Thank you page de WooCommerce
        if (is_wc_endpoint_url('order-received')) {
            return true;
        }

        // Pagina de completar canalizacion
        if (is_page('completar-canalizacion')) {
            return true;
        }

        // Shortcode presente
        global $post;
        if ($post && has_shortcode($post->post_content, 'duendes_formulario_canalizacion')) {
            return true;
        }

        return false;
    }

    /**
     * Mostrar formulario en Thank You page
     */
    public function mostrar_formulario_thankyou($order_id) {
        $order = wc_get_order($order_id);
        if (!$order) return;

        // Verificar si tiene guardianes
        $guardianes = $this->obtener_guardianes_orden($order);
        if (empty($guardianes)) return;

        // Obtener tipo de destinatario del checkout
        $tipo = get_post_meta($order_id, '_duendes_tipo_destinatario', true);

        // Verificar si ya completo el formulario
        $completado = get_post_meta($order_id, '_duendes_formulario_completado_v2', true);
        if ($completado === 'yes') {
            echo $this->render_mensaje_completado($order);
            return;
        }

        // Mostrar opciones: ahora o despues
        echo $this->render_opciones_formulario($order, $guardianes, $tipo);
    }

    /**
     * Obtener guardianes de una orden
     */
    private function obtener_guardianes_orden($order) {
        $guardianes = [];

        foreach ($order->get_items() as $item) {
            $product_id = $item->get_product_id();
            $product = wc_get_product($product_id);

            if (!$product) continue;

            // Detectar si es guardian (categoria guardian, duende, hada, etc)
            $categorias = wp_get_post_terms($product_id, 'product_cat', ['fields' => 'slugs']);
            $es_guardian = array_intersect($categorias, [
                'guardianes', 'duendes', 'hadas', 'pixies', 'brujos',
                'elfos', 'gnomos', 'proteccion', 'abundancia', 'sanacion', 'amor'
            ]);

            if (!empty($es_guardian) || $this->es_guardian_por_nombre($product->get_name())) {
                $guardianes[] = [
                    'id' => $product_id,
                    'nombre' => $product->get_name(),
                    'imagen' => wp_get_attachment_url($product->get_image_id()),
                    'categoria' => $this->detectar_categoria_guardian($product_id),
                    'item_id' => $item->get_id(),
                ];
            }
        }

        return $guardianes;
    }

    private function es_guardian_por_nombre($nombre) {
        // Nombres comunes de guardianes
        $patrones = ['pixie', 'duende', 'hada', 'brujo', 'elfo', 'gnomo'];
        $nombre_lower = strtolower($nombre);

        foreach ($patrones as $patron) {
            if (strpos($nombre_lower, $patron) !== false) {
                return true;
            }
        }

        return false;
    }

    private function detectar_categoria_guardian($product_id) {
        $categorias = wp_get_post_terms($product_id, 'product_cat', ['fields' => 'slugs']);

        $mapeo = [
            'proteccion' => 'proteccion',
            'abundancia' => 'abundancia',
            'sanacion' => 'sanacion',
            'amor' => 'amor',
            'sabiduria' => 'sabiduria',
        ];

        foreach ($mapeo as $slug => $categoria) {
            if (in_array($slug, $categorias)) {
                return $categoria;
            }
        }

        return 'proteccion'; // default
    }

    /**
     * Render opciones: completar ahora o despues
     */
    private function render_opciones_formulario($order, $guardianes, $tipo) {
        $order_id = $order->get_id();
        $es_multi = count($guardianes) > 1;

        ob_start();
        include DUENDES_CANAL_PATH . 'templates/opciones-formulario.php';
        return ob_get_clean();
    }

    private function render_mensaje_completado($order) {
        ob_start();
        include DUENDES_CANAL_PATH . 'templates/formulario-completado.php';
        return ob_get_clean();
    }

    /**
     * AJAX: Guardar formulario
     */
    public function ajax_guardar_formulario() {
        check_ajax_referer('duendes_canal_nonce', 'nonce');

        $order_id = absint($_POST['order_id'] ?? 0);
        $guardian_id = absint($_POST['guardian_id'] ?? 0);
        $datos = $_POST['datos'] ?? [];

        if (!$order_id) {
            wp_send_json_error(['message' => 'Orden no valida']);
        }

        $order = wc_get_order($order_id);
        if (!$order) {
            wp_send_json_error(['message' => 'Orden no encontrada']);
        }

        // Sanitizar datos
        $datos_limpios = $this->sanitizar_datos_formulario($datos);

        // Crear canalizacion en CPT
        $canalizacion_id = Duendes_Canal_CPT::crear_canalizacion([
            'orden_id' => $order_id,
            'guardian_id' => $guardian_id,
            'email' => $order->get_billing_email(),
            'nombre_cliente' => $order->get_billing_first_name(),
            'datos_formulario' => $datos_limpios,
            'tipo_destinatario' => $datos_limpios['tipo'] ?? 'para_mi',
        ]);

        if (is_wp_error($canalizacion_id)) {
            wp_send_json_error(['message' => $canalizacion_id->get_error_message()]);
        }

        // Marcar formulario como completado
        update_post_meta($order_id, '_duendes_formulario_completado_v2', 'yes');

        // Disparar accion para FunnelKit
        do_action('duendes_formulario_completado', $canalizacion_id, $order_id);

        // Iniciar generacion en background
        $this->programar_generacion($canalizacion_id);

        wp_send_json_success([
            'message' => 'Formulario guardado correctamente',
            'canalizacion_id' => $canalizacion_id,
        ]);
    }

    private function sanitizar_datos_formulario($datos) {
        $limpios = [];

        $campos_texto = ['nombre', 'momento', 'mensaje', 'relacion', 'nombre_destinatario', 'email_destinatario'];
        $campos_array = ['necesidades', 'personalidad'];

        foreach ($campos_texto as $campo) {
            if (isset($datos[$campo])) {
                $limpios[$campo] = sanitize_textarea_field($datos[$campo]);
            }
        }

        foreach ($campos_array as $campo) {
            if (isset($datos[$campo]) && is_array($datos[$campo])) {
                $limpios[$campo] = array_map('sanitize_text_field', $datos[$campo]);
            }
        }

        // Campos especiales
        if (isset($datos['tipo'])) {
            $tipos_validos = ['para_mi', 'regalo_sabe', 'regalo_sorpresa', 'para_nino'];
            $limpios['tipo'] = in_array($datos['tipo'], $tipos_validos) ? $datos['tipo'] : 'para_mi';
        }

        if (isset($datos['edad_nino'])) {
            $limpios['edad_nino'] = sanitize_text_field($datos['edad_nino']);
        }

        if (isset($datos['foto_url'])) {
            $limpios['foto_url'] = esc_url_raw($datos['foto_url']);
        }

        if (isset($datos['es_mayor_18'])) {
            $limpios['es_mayor_18'] = (bool) $datos['es_mayor_18'];
        }

        return $limpios;
    }

    /**
     * Programar generacion con Action Scheduler
     */
    private function programar_generacion($canalizacion_id) {
        // Intentar con Action Scheduler (viene con WooCommerce)
        if (function_exists('as_schedule_single_action')) {
            as_schedule_single_action(
                time() + 5, // 5 segundos delay
                'duendes_generar_canalizacion_background',
                [$canalizacion_id],
                'duendes-canalizaciones'
            );
        } else {
            // Fallback: generar inmediatamente
            $generator = new Duendes_Claude_Generator();
            $generator->generar($canalizacion_id);
        }
    }

    /**
     * AJAX: Generar canalizacion (admin)
     */
    public function ajax_generar_canalizacion() {
        check_ajax_referer('duendes_canal_admin_nonce', 'nonce');

        if (!current_user_can('manage_woocommerce')) {
            wp_send_json_error(['message' => 'Sin permisos']);
        }

        $canalizacion_id = absint($_POST['canalizacion_id'] ?? 0);

        $generator = new Duendes_Claude_Generator();
        $resultado = $generator->generar($canalizacion_id);

        if (is_wp_error($resultado)) {
            wp_send_json_error(['message' => $resultado->get_error_message()]);
        }

        wp_send_json_success([
            'message' => 'Canalizacion generada',
            'contenido' => $resultado['contenido'],
            'version' => $resultado['version'],
        ]);
    }

    /**
     * AJAX: Regenerar con instrucciones
     */
    public function ajax_regenerar_canalizacion() {
        check_ajax_referer('duendes_canal_admin_nonce', 'nonce');

        if (!current_user_can('manage_woocommerce')) {
            wp_send_json_error(['message' => 'Sin permisos']);
        }

        $canalizacion_id = absint($_POST['canalizacion_id'] ?? 0);
        $instrucciones = sanitize_textarea_field($_POST['instrucciones'] ?? '');

        $generator = new Duendes_Claude_Generator();
        $resultado = $generator->regenerar($canalizacion_id, $instrucciones);

        if (is_wp_error($resultado)) {
            wp_send_json_error(['message' => $resultado->get_error_message()]);
        }

        wp_send_json_success([
            'message' => 'Canalizacion regenerada',
            'contenido' => $resultado['contenido'],
            'version' => $resultado['version'],
        ]);
    }

    /**
     * AJAX: Enviar canalizacion al cliente
     */
    public function ajax_enviar_canalizacion() {
        check_ajax_referer('duendes_canal_admin_nonce', 'nonce');

        if (!current_user_can('manage_woocommerce')) {
            wp_send_json_error(['message' => 'Sin permisos']);
        }

        $canalizacion_id = absint($_POST['canalizacion_id'] ?? 0);

        // Cambiar estado a enviada
        update_post_meta($canalizacion_id, '_estado', 'enviada');
        update_post_meta($canalizacion_id, '_fecha_enviada', current_time('mysql'));

        // Obtener datos
        $email = get_post_meta($canalizacion_id, '_email', true);
        $guardian_nombre = get_post_meta($canalizacion_id, '_guardian_nombre', true);
        $orden_id = get_post_meta($canalizacion_id, '_orden_id', true);

        // Enviar email
        $this->enviar_email_canalizacion($canalizacion_id);

        // Disparar accion para FunnelKit
        do_action('duendes_canalizacion_enviada', $canalizacion_id, $orden_id);

        wp_send_json_success([
            'message' => "Canalizacion enviada a $email",
        ]);
    }

    /**
     * AJAX: Obtener datos de canalizacion
     */
    public function ajax_obtener_canalizacion() {
        check_ajax_referer('duendes_canal_admin_nonce', 'nonce');

        if (!current_user_can('manage_woocommerce')) {
            wp_send_json_error(['message' => 'Sin permisos']);
        }

        $canalizacion_id = absint($_POST['canalizacion_id'] ?? 0);
        $post = get_post($canalizacion_id);

        if (!$post || $post->post_type !== 'duendes_canalizacion') {
            wp_send_json_error(['message' => 'Canalizacion no encontrada']);
        }

        $datos = [
            'id' => $canalizacion_id,
            'contenido' => $post->post_content,
            'estado' => get_post_meta($canalizacion_id, '_estado', true),
            'orden_id' => get_post_meta($canalizacion_id, '_orden_id', true),
            'email' => get_post_meta($canalizacion_id, '_email', true),
            'nombre_cliente' => get_post_meta($canalizacion_id, '_nombre_cliente', true),
            'guardian_nombre' => get_post_meta($canalizacion_id, '_guardian_nombre', true),
            'guardian_categoria' => get_post_meta($canalizacion_id, '_guardian_categoria', true),
            'tipo_destinatario' => get_post_meta($canalizacion_id, '_tipo_destinatario', true),
            'datos_formulario' => get_post_meta($canalizacion_id, '_datos_formulario', true),
            'versiones' => get_post_meta($canalizacion_id, '_versiones', true) ?: [],
            'fecha_formulario' => get_post_meta($canalizacion_id, '_fecha_formulario', true),
            'fecha_generada' => get_post_meta($canalizacion_id, '_fecha_generada', true),
            'fecha_enviada' => get_post_meta($canalizacion_id, '_fecha_enviada', true),
        ];

        wp_send_json_success($datos);
    }

    /**
     * Enviar email con canalizacion
     */
    private function enviar_email_canalizacion($canalizacion_id) {
        $email = get_post_meta($canalizacion_id, '_email', true);
        $guardian_nombre = get_post_meta($canalizacion_id, '_guardian_nombre', true);
        $nombre_cliente = get_post_meta($canalizacion_id, '_nombre_cliente', true);
        $contenido = get_post($canalizacion_id)->post_content;
        $orden_id = get_post_meta($canalizacion_id, '_orden_id', true);

        $asunto = "$guardian_nombre tiene un mensaje para vos";

        // Template del email
        ob_start();
        include DUENDES_CANAL_PATH . 'templates/email-canalizacion.php';
        $body = ob_get_clean();

        $headers = [
            'Content-Type: text/html; charset=UTF-8',
            'From: Duendes del Uruguay <hola@duendesdeluruguay.com>',
        ];

        wp_mail($email, $asunto, $body, $headers);
    }

    /**
     * Shortcode para mostrar formulario
     */
    public function shortcode_formulario($atts) {
        $atts = shortcode_atts([
            'order_id' => 0,
        ], $atts);

        if (!$atts['order_id']) {
            return '<p>No se especifico orden.</p>';
        }

        $order = wc_get_order($atts['order_id']);
        if (!$order) {
            return '<p>Orden no encontrada.</p>';
        }

        $guardianes = $this->obtener_guardianes_orden($order);
        $tipo = get_post_meta($atts['order_id'], '_duendes_tipo_destinatario', true);

        return $this->render_opciones_formulario($order, $guardianes, $tipo);
    }

    /**
     * Shortcode para pagina de completar canalizacion (link desde email)
     */
    public function shortcode_completar($atts) {
        $token = sanitize_text_field($_GET['token'] ?? '');

        if (!$token) {
            return '<p>Link invalido o expirado.</p>';
        }

        // Buscar orden por token
        global $wpdb;
        $order_id = $wpdb->get_var($wpdb->prepare(
            "SELECT post_id FROM {$wpdb->postmeta}
             WHERE meta_key = '_duendes_form_token' AND meta_value = %s",
            $token
        ));

        if (!$order_id) {
            return '<p>Link invalido o expirado.</p>';
        }

        $order = wc_get_order($order_id);
        if (!$order) {
            return '<p>Orden no encontrada.</p>';
        }

        $guardianes = $this->obtener_guardianes_orden($order);
        $tipo = get_post_meta($order_id, '_duendes_tipo_destinatario', true);

        return $this->render_opciones_formulario($order, $guardianes, $tipo);
    }

    /**
     * Cuando una orden se completa
     */
    public function orden_completada($order_id) {
        // Verificar si hay canalizaciones pendientes de esta orden
        $canalizaciones = get_posts([
            'post_type' => 'duendes_canalizacion',
            'meta_query' => [
                ['key' => '_orden_id', 'value' => $order_id],
                ['key' => '_estado', 'value' => 'pendiente'],
            ],
            'posts_per_page' => -1,
        ]);

        // Generar las que esten pendientes
        foreach ($canalizaciones as $canal) {
            $this->programar_generacion($canal->ID);
        }
    }
}

// Hook para Action Scheduler
add_action('duendes_generar_canalizacion_background', function($canalizacion_id) {
    $generator = new Duendes_Claude_Generator();
    $generator->generar($canalizacion_id);
});

// Inicializar plugin
function duendes_canalizaciones_v2() {
    return Duendes_Canalizaciones_V2::instance();
}

add_action('plugins_loaded', 'duendes_canalizaciones_v2');
