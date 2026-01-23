<?php
/**
 * Plugin Name: Duendes - Fabrica de Banners Inteligente
 * Description: Sistema completo de gestion de banners promocionales con recomendaciones inteligentes basadas en datos
 * Version: 1.0.0
 * Author: Duendes del Uruguay
 * Requires PHP: 7.4
 * WC requires at least: 5.0
 */

if (!defined('ABSPATH')) exit;

// =====================================================
// CLASE PRINCIPAL DEL PLUGIN
// =====================================================
class Duendes_Fabrica_Banners {

    private static $instance = null;
    private $table_banners;
    private $table_metrics;

    public static function instance() {
        if (null === self::$instance) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    public function __construct() {
        global $wpdb;
        $this->table_banners = $wpdb->prefix . 'duendes_banners';
        $this->table_metrics = $wpdb->prefix . 'duendes_banner_metrics';

        // Hooks de inicializacion
        add_action('admin_menu', [$this, 'add_admin_menu']);
        add_action('admin_enqueue_scripts', [$this, 'admin_scripts']);
        add_action('wp_enqueue_scripts', [$this, 'frontend_scripts']);
        add_action('wp_ajax_dfb_save_banner', [$this, 'ajax_save_banner']);
        add_action('wp_ajax_dfb_delete_banner', [$this, 'ajax_delete_banner']);
        add_action('wp_ajax_dfb_toggle_banner', [$this, 'ajax_toggle_banner']);
        add_action('wp_ajax_dfb_get_ideas', [$this, 'ajax_get_ideas']);
        add_action('wp_ajax_dfb_track_impression', [$this, 'ajax_track_impression']);
        add_action('wp_ajax_nopriv_dfb_track_impression', [$this, 'ajax_track_impression']);
        add_action('wp_ajax_dfb_track_click', [$this, 'ajax_track_click']);
        add_action('wp_ajax_nopriv_dfb_track_click', [$this, 'ajax_track_click']);
        add_action('wp_ajax_dfb_dismiss_banner', [$this, 'ajax_dismiss_banner']);
        add_action('wp_ajax_nopriv_dfb_dismiss_banner', [$this, 'ajax_dismiss_banner']);

        // Shortcodes
        add_shortcode('duendes_banner', [$this, 'shortcode_banner']);
        add_shortcode('duendes_banners_ubicacion', [$this, 'shortcode_ubicacion']);

        // Hooks de frontend para mostrar banners
        add_action('wp_footer', [$this, 'render_popup_banners']);

        // Activacion
        register_activation_hook(__FILE__, [$this, 'activate']);
    }

    // =====================================================
    // ACTIVACION - CREAR TABLAS
    // =====================================================
    public function activate() {
        global $wpdb;
        $charset = $wpdb->get_charset_collate();

        // Tabla de banners
        $sql_banners = "CREATE TABLE IF NOT EXISTS {$this->table_banners} (
            id bigint(20) NOT NULL AUTO_INCREMENT,
            titulo varchar(255) NOT NULL,
            subtitulo text,
            imagen_url varchar(500),
            cta_texto varchar(100),
            cta_url varchar(500),
            codigo_descuento varchar(50),
            descuento_porcentaje int(3),
            fecha_inicio datetime,
            fecha_fin datetime,
            ubicaciones text,
            tipo varchar(50) DEFAULT 'promocion',
            prioridad int(3) DEFAULT 10,
            activo tinyint(1) DEFAULT 1,
            estilo text,
            condiciones text,
            created_at datetime DEFAULT CURRENT_TIMESTAMP,
            updated_at datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            PRIMARY KEY (id),
            KEY idx_activo (activo),
            KEY idx_fechas (fecha_inicio, fecha_fin)
        ) $charset;";

        // Tabla de metricas
        $sql_metrics = "CREATE TABLE IF NOT EXISTS {$this->table_metrics} (
            id bigint(20) NOT NULL AUTO_INCREMENT,
            banner_id bigint(20) NOT NULL,
            tipo_evento varchar(20) NOT NULL,
            user_id bigint(20),
            session_id varchar(100),
            ubicacion varchar(50),
            codigo_usado varchar(50),
            valor_conversion decimal(10,2),
            created_at datetime DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (id),
            KEY idx_banner (banner_id),
            KEY idx_tipo (tipo_evento),
            KEY idx_fecha (created_at)
        ) $charset;";

        require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
        dbDelta($sql_banners);
        dbDelta($sql_metrics);

        // Insertar banners de ejemplo
        $this->insert_sample_banners();
    }

    // =====================================================
    // BANNERS DE EJEMPLO
    // =====================================================
    private function insert_sample_banners() {
        global $wpdb;

        $count = $wpdb->get_var("SELECT COUNT(*) FROM {$this->table_banners}");
        if ($count > 0) return;

        $samples = [
            [
                'titulo' => 'Tu Guardian Te Espera',
                'subtitulo' => 'Descubri cual es el guardian que resuena con tu energia. Hace el test gratuito.',
                'cta_texto' => 'Hacer el Test',
                'cta_url' => '/test-del-guardian/',
                'tipo' => 'test',
                'ubicaciones' => json_encode(['homepage', 'tienda']),
                'prioridad' => 20,
                'activo' => 1
            ],
            [
                'titulo' => 'Envio Gratis en Compras +$100',
                'subtitulo' => 'Por tiempo limitado, tu guardian viaja sin costo a cualquier parte del mundo.',
                'cta_texto' => 'Ver Guardianes',
                'cta_url' => '/tienda/',
                'codigo_descuento' => 'ENVIOGRATIS100',
                'tipo' => 'envio',
                'ubicaciones' => json_encode(['tienda', 'carrito']),
                'prioridad' => 15,
                'activo' => 0
            ],
            [
                'titulo' => 'Nueva Canalizacion Disponible',
                'subtitulo' => 'Los guardianes tienen un mensaje especial para vos este mes.',
                'cta_texto' => 'Ir a Mi Magia',
                'cta_url' => '/mi-magia/',
                'tipo' => 'circulo',
                'ubicaciones' => json_encode(['mi_magia']),
                'prioridad' => 25,
                'activo' => 1
            ]
        ];

        foreach ($samples as $banner) {
            $wpdb->insert($this->table_banners, $banner);
        }
    }

    // =====================================================
    // MENU DE ADMINISTRACION
    // =====================================================
    public function add_admin_menu() {
        add_submenu_page(
            'woocommerce',
            'Fabrica de Banners',
            'Fabrica de Banners',
            'manage_woocommerce',
            'duendes-fabrica-banners',
            [$this, 'render_admin_page']
        );
    }

    // =====================================================
    // SCRIPTS DE ADMIN
    // =====================================================
    public function admin_scripts($hook) {
        if (strpos($hook, 'duendes-fabrica-banners') === false) return;

        wp_enqueue_media();
        wp_enqueue_script('jquery');
    }

    // =====================================================
    // SCRIPTS DE FRONTEND
    // =====================================================
    public function frontend_scripts() {
        // Los estilos y scripts se cargan inline para evitar dependencias
    }

    // =====================================================
    // PAGINA DE ADMINISTRACION
    // =====================================================
    public function render_admin_page() {
        global $wpdb;

        // Obtener banners existentes
        $banners = $wpdb->get_results("SELECT * FROM {$this->table_banners} ORDER BY prioridad DESC, created_at DESC");

        // Obtener metricas generales
        $metricas = $this->get_general_metrics();

        // Generar ideas inteligentes
        $ideas = $this->generate_smart_ideas();

        ?>
        <style>
            /* ===== ESTILOS DEL PANEL ===== */
            .dfb-wrap {
                max-width: 1400px;
                margin: 20px auto;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            }
            .dfb-header {
                background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
                padding: 30px;
                border-radius: 12px;
                margin-bottom: 25px;
                color: #fff;
            }
            .dfb-header h1 {
                margin: 0 0 10px 0;
                font-size: 28px;
                color: #d4af37;
            }
            .dfb-header p {
                margin: 0;
                opacity: 0.8;
                font-size: 14px;
            }

            /* Tabs */
            .dfb-tabs {
                display: flex;
                gap: 5px;
                margin-bottom: 20px;
                border-bottom: 2px solid #e0e0e0;
                padding-bottom: 0;
            }
            .dfb-tab {
                padding: 12px 24px;
                background: #f5f5f5;
                border: none;
                border-radius: 8px 8px 0 0;
                cursor: pointer;
                font-size: 14px;
                font-weight: 500;
                color: #666;
                transition: all 0.3s;
            }
            .dfb-tab:hover {
                background: #e8e8e8;
            }
            .dfb-tab.active {
                background: #1a1a2e;
                color: #d4af37;
            }

            .dfb-tab-content {
                display: none;
                animation: fadeIn 0.3s ease;
            }
            .dfb-tab-content.active {
                display: block;
            }
            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(10px); }
                to { opacity: 1; transform: translateY(0); }
            }

            /* Cards de metricas */
            .dfb-metrics-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 20px;
                margin-bottom: 30px;
            }
            .dfb-metric-card {
                background: #fff;
                border-radius: 12px;
                padding: 20px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.08);
                text-align: center;
            }
            .dfb-metric-card .number {
                font-size: 36px;
                font-weight: 700;
                color: #1a1a2e;
                line-height: 1;
            }
            .dfb-metric-card .label {
                font-size: 13px;
                color: #888;
                margin-top: 8px;
            }
            .dfb-metric-card.gold .number {
                color: #d4af37;
            }
            .dfb-metric-card.green .number {
                color: #28a745;
            }

            /* Ideas inteligentes */
            .dfb-ideas-container {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
                gap: 20px;
            }
            .dfb-idea-card {
                background: #fff;
                border-radius: 12px;
                padding: 20px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.08);
                border-left: 4px solid #d4af37;
                transition: transform 0.2s, box-shadow 0.2s;
            }
            .dfb-idea-card:hover {
                transform: translateY(-3px);
                box-shadow: 0 4px 16px rgba(0,0,0,0.12);
            }
            .dfb-idea-card .idea-category {
                font-size: 11px;
                text-transform: uppercase;
                letter-spacing: 1px;
                color: #888;
                margin-bottom: 8px;
            }
            .dfb-idea-card .idea-title {
                font-size: 16px;
                font-weight: 600;
                color: #1a1a2e;
                margin-bottom: 10px;
            }
            .dfb-idea-card .idea-description {
                font-size: 13px;
                color: #666;
                line-height: 1.5;
                margin-bottom: 15px;
            }
            .dfb-idea-card .idea-action {
                display: inline-block;
                padding: 8px 16px;
                background: linear-gradient(135deg, #d4af37, #b8960c);
                color: #fff;
                border-radius: 6px;
                font-size: 12px;
                font-weight: 600;
                cursor: pointer;
                border: none;
                transition: opacity 0.2s;
            }
            .dfb-idea-card .idea-action:hover {
                opacity: 0.9;
            }

            .dfb-idea-card.urgente {
                border-left-color: #dc3545;
            }
            .dfb-idea-card.oportunidad {
                border-left-color: #28a745;
            }
            .dfb-idea-card.fecha {
                border-left-color: #6f42c1;
            }
            .dfb-idea-card.circulo {
                border-left-color: #17a2b8;
            }

            /* Lista de banners */
            .dfb-banners-list {
                background: #fff;
                border-radius: 12px;
                overflow: hidden;
                box-shadow: 0 2px 8px rgba(0,0,0,0.08);
            }
            .dfb-banner-item {
                display: grid;
                grid-template-columns: 60px 1fr 150px 120px 100px 120px;
                align-items: center;
                padding: 15px 20px;
                border-bottom: 1px solid #f0f0f0;
                gap: 15px;
            }
            .dfb-banner-item:last-child {
                border-bottom: none;
            }
            .dfb-banner-item.header {
                background: #f8f9fa;
                font-weight: 600;
                font-size: 12px;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                color: #666;
            }
            .dfb-banner-preview {
                width: 60px;
                height: 40px;
                background: linear-gradient(135deg, #1a1a2e, #0f3460);
                border-radius: 6px;
                display: flex;
                align-items: center;
                justify-content: center;
                color: #d4af37;
                font-size: 10px;
                text-align: center;
                overflow: hidden;
            }
            .dfb-banner-preview img {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }
            .dfb-banner-title {
                font-weight: 500;
                color: #1a1a2e;
            }
            .dfb-banner-subtitle {
                font-size: 12px;
                color: #888;
                margin-top: 3px;
            }
            .dfb-banner-ubicaciones {
                display: flex;
                flex-wrap: wrap;
                gap: 5px;
            }
            .dfb-ubicacion-tag {
                font-size: 10px;
                padding: 3px 8px;
                background: #e8e8e8;
                border-radius: 10px;
                color: #666;
            }
            .dfb-banner-status {
                display: flex;
                align-items: center;
                gap: 8px;
            }
            .dfb-status-dot {
                width: 10px;
                height: 10px;
                border-radius: 50%;
                background: #ccc;
            }
            .dfb-status-dot.active {
                background: #28a745;
            }
            .dfb-banner-metrics {
                font-size: 12px;
                color: #666;
            }
            .dfb-banner-metrics strong {
                color: #1a1a2e;
            }
            .dfb-banner-actions {
                display: flex;
                gap: 8px;
            }
            .dfb-btn-icon {
                width: 32px;
                height: 32px;
                border: none;
                border-radius: 6px;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: opacity 0.2s;
            }
            .dfb-btn-icon:hover {
                opacity: 0.8;
            }
            .dfb-btn-edit {
                background: #e8e8e8;
                color: #666;
            }
            .dfb-btn-toggle {
                background: #e3f2fd;
                color: #1976d2;
            }
            .dfb-btn-delete {
                background: #ffebee;
                color: #c62828;
            }

            /* Formulario de creacion */
            .dfb-form-container {
                background: #fff;
                border-radius: 12px;
                padding: 30px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.08);
            }
            .dfb-form-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 25px;
            }
            .dfb-form-group {
                margin-bottom: 20px;
            }
            .dfb-form-group.full-width {
                grid-column: span 2;
            }
            .dfb-form-group label {
                display: block;
                font-weight: 500;
                margin-bottom: 8px;
                color: #333;
                font-size: 14px;
            }
            .dfb-form-group input,
            .dfb-form-group textarea,
            .dfb-form-group select {
                width: 100%;
                padding: 12px 15px;
                border: 1px solid #ddd;
                border-radius: 8px;
                font-size: 14px;
                transition: border-color 0.2s, box-shadow 0.2s;
            }
            .dfb-form-group input:focus,
            .dfb-form-group textarea:focus,
            .dfb-form-group select:focus {
                outline: none;
                border-color: #d4af37;
                box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.1);
            }
            .dfb-form-group textarea {
                resize: vertical;
                min-height: 80px;
            }
            .dfb-form-group .help-text {
                font-size: 12px;
                color: #888;
                margin-top: 5px;
            }

            /* Checkboxes de ubicaciones */
            .dfb-ubicaciones-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
                gap: 10px;
            }
            .dfb-ubicacion-checkbox {
                display: flex;
                align-items: center;
                gap: 10px;
                padding: 12px 15px;
                background: #f8f9fa;
                border-radius: 8px;
                cursor: pointer;
                transition: background 0.2s;
            }
            .dfb-ubicacion-checkbox:hover {
                background: #e8e8e8;
            }
            .dfb-ubicacion-checkbox input {
                width: auto;
            }
            .dfb-ubicacion-checkbox.checked {
                background: #e8f4e8;
                border: 1px solid #28a745;
            }

            /* Botones */
            .dfb-btn {
                padding: 12px 24px;
                border: none;
                border-radius: 8px;
                font-size: 14px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.2s;
            }
            .dfb-btn-primary {
                background: linear-gradient(135deg, #d4af37, #b8960c);
                color: #fff;
            }
            .dfb-btn-primary:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(212, 175, 55, 0.3);
            }
            .dfb-btn-secondary {
                background: #e8e8e8;
                color: #666;
            }
            .dfb-btn-secondary:hover {
                background: #ddd;
            }

            /* Preview del banner */
            .dfb-preview-container {
                margin-top: 30px;
                padding-top: 30px;
                border-top: 1px solid #e0e0e0;
            }
            .dfb-preview-container h3 {
                margin: 0 0 20px 0;
                font-size: 16px;
                color: #666;
            }
            .dfb-banner-preview-full {
                background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
                padding: 30px;
                border-radius: 12px;
                text-align: center;
                color: #fff;
                position: relative;
                overflow: hidden;
            }
            .dfb-banner-preview-full::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="none" stroke="%23d4af37" stroke-width="0.5" opacity="0.1"/></svg>');
                background-size: 100px;
                opacity: 0.3;
            }
            .dfb-banner-preview-full .preview-title {
                font-size: 24px;
                font-weight: 700;
                color: #d4af37;
                margin-bottom: 10px;
                position: relative;
            }
            .dfb-banner-preview-full .preview-subtitle {
                font-size: 14px;
                opacity: 0.9;
                margin-bottom: 20px;
                position: relative;
            }
            .dfb-banner-preview-full .preview-cta {
                display: inline-block;
                padding: 12px 30px;
                background: #d4af37;
                color: #1a1a2e;
                border-radius: 25px;
                font-weight: 600;
                position: relative;
            }

            /* Modal */
            .dfb-modal-overlay {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0,0,0,0.6);
                display: none;
                align-items: center;
                justify-content: center;
                z-index: 99999;
            }
            .dfb-modal-overlay.active {
                display: flex;
            }
            .dfb-modal {
                background: #fff;
                border-radius: 12px;
                max-width: 800px;
                width: 90%;
                max-height: 90vh;
                overflow-y: auto;
                position: relative;
            }
            .dfb-modal-header {
                padding: 20px 25px;
                border-bottom: 1px solid #e0e0e0;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            .dfb-modal-header h2 {
                margin: 0;
                font-size: 18px;
            }
            .dfb-modal-close {
                width: 36px;
                height: 36px;
                border: none;
                background: #f0f0f0;
                border-radius: 50%;
                cursor: pointer;
                font-size: 20px;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .dfb-modal-body {
                padding: 25px;
            }
            .dfb-modal-footer {
                padding: 20px 25px;
                border-top: 1px solid #e0e0e0;
                display: flex;
                justify-content: flex-end;
                gap: 10px;
            }

            /* Notificaciones */
            .dfb-toast {
                position: fixed;
                bottom: 30px;
                right: 30px;
                padding: 15px 25px;
                background: #1a1a2e;
                color: #fff;
                border-radius: 8px;
                box-shadow: 0 4px 20px rgba(0,0,0,0.2);
                z-index: 999999;
                animation: slideIn 0.3s ease;
            }
            .dfb-toast.success {
                background: #28a745;
            }
            .dfb-toast.error {
                background: #dc3545;
            }
            @keyframes slideIn {
                from { transform: translateX(100px); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }

            /* Responsive */
            @media (max-width: 768px) {
                .dfb-form-grid {
                    grid-template-columns: 1fr;
                }
                .dfb-form-group.full-width {
                    grid-column: span 1;
                }
                .dfb-banner-item {
                    grid-template-columns: 1fr;
                    gap: 10px;
                }
                .dfb-banner-item.header {
                    display: none;
                }
            }
        </style>

        <div class="dfb-wrap">
            <div class="dfb-header">
                <h1>Fabrica de Banners</h1>
                <p>Crea promociones inteligentes basadas en datos reales de tu tienda</p>
            </div>

            <!-- Tabs -->
            <div class="dfb-tabs">
                <button class="dfb-tab active" data-tab="ideas">Ideas Inteligentes</button>
                <button class="dfb-tab" data-tab="banners">Mis Banners</button>
                <button class="dfb-tab" data-tab="crear">Crear Banner</button>
                <button class="dfb-tab" data-tab="metricas">Metricas</button>
            </div>

            <!-- Tab: Ideas Inteligentes -->
            <div id="tab-ideas" class="dfb-tab-content active">
                <div class="dfb-metrics-grid">
                    <div class="dfb-metric-card">
                        <div class="number"><?php echo intval($metricas['total_impresiones']); ?></div>
                        <div class="label">Impresiones Totales</div>
                    </div>
                    <div class="dfb-metric-card gold">
                        <div class="number"><?php echo intval($metricas['total_clicks']); ?></div>
                        <div class="label">Clicks Totales</div>
                    </div>
                    <div class="dfb-metric-card green">
                        <div class="number"><?php echo number_format($metricas['ctr'], 1); ?>%</div>
                        <div class="label">CTR Promedio</div>
                    </div>
                    <div class="dfb-metric-card">
                        <div class="number"><?php echo intval($metricas['conversiones']); ?></div>
                        <div class="label">Conversiones</div>
                    </div>
                </div>

                <h3 style="margin-bottom: 20px; color: #333;">Recomendaciones para tu tienda</h3>
                <div class="dfb-ideas-container">
                    <?php foreach ($ideas as $idea): ?>
                    <div class="dfb-idea-card <?php echo esc_attr($idea['tipo']); ?>">
                        <div class="idea-category"><?php echo esc_html($idea['categoria']); ?></div>
                        <div class="idea-title"><?php echo esc_html($idea['titulo']); ?></div>
                        <div class="idea-description"><?php echo esc_html($idea['descripcion']); ?></div>
                        <button class="idea-action" onclick="dfbUsarIdea(<?php echo htmlspecialchars(json_encode($idea), ENT_QUOTES); ?>)">
                            Crear Banner
                        </button>
                    </div>
                    <?php endforeach; ?>
                </div>
            </div>

            <!-- Tab: Mis Banners -->
            <div id="tab-banners" class="dfb-tab-content">
                <div class="dfb-banners-list">
                    <div class="dfb-banner-item header">
                        <div>Preview</div>
                        <div>Banner</div>
                        <div>Ubicaciones</div>
                        <div>Estado</div>
                        <div>Metricas</div>
                        <div>Acciones</div>
                    </div>
                    <?php foreach ($banners as $banner):
                        $ubicaciones = json_decode($banner->ubicaciones, true) ?: [];
                        $banner_metrics = $this->get_banner_metrics($banner->id);
                    ?>
                    <div class="dfb-banner-item" data-id="<?php echo $banner->id; ?>">
                        <div class="dfb-banner-preview">
                            <?php if ($banner->imagen_url): ?>
                                <img src="<?php echo esc_url($banner->imagen_url); ?>" alt="">
                            <?php else: ?>
                                Banner
                            <?php endif; ?>
                        </div>
                        <div>
                            <div class="dfb-banner-title"><?php echo esc_html($banner->titulo); ?></div>
                            <div class="dfb-banner-subtitle"><?php echo esc_html(wp_trim_words($banner->subtitulo, 10)); ?></div>
                        </div>
                        <div class="dfb-banner-ubicaciones">
                            <?php foreach ($ubicaciones as $ubi): ?>
                                <span class="dfb-ubicacion-tag"><?php echo esc_html($ubi); ?></span>
                            <?php endforeach; ?>
                        </div>
                        <div class="dfb-banner-status">
                            <span class="dfb-status-dot <?php echo $banner->activo ? 'active' : ''; ?>"></span>
                            <?php echo $banner->activo ? 'Activo' : 'Inactivo'; ?>
                        </div>
                        <div class="dfb-banner-metrics">
                            <strong><?php echo intval($banner_metrics['impresiones']); ?></strong> imp<br>
                            <strong><?php echo intval($banner_metrics['clicks']); ?></strong> clicks
                        </div>
                        <div class="dfb-banner-actions">
                            <button class="dfb-btn-icon dfb-btn-edit" onclick="dfbEditBanner(<?php echo $banner->id; ?>)" title="Editar">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                            </button>
                            <button class="dfb-btn-icon dfb-btn-toggle" onclick="dfbToggleBanner(<?php echo $banner->id; ?>)" title="Activar/Desactivar">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                            </button>
                            <button class="dfb-btn-icon dfb-btn-delete" onclick="dfbDeleteBanner(<?php echo $banner->id; ?>)" title="Eliminar">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                            </button>
                        </div>
                    </div>
                    <?php endforeach; ?>

                    <?php if (empty($banners)): ?>
                    <div style="padding: 40px; text-align: center; color: #888;">
                        No hay banners creados todavia. Usa las Ideas Inteligentes o crea uno desde cero.
                    </div>
                    <?php endif; ?>
                </div>
            </div>

            <!-- Tab: Crear Banner -->
            <div id="tab-crear" class="dfb-tab-content">
                <div class="dfb-form-container">
                    <form id="dfb-banner-form">
                        <input type="hidden" name="banner_id" id="banner_id" value="">

                        <div class="dfb-form-grid">
                            <div class="dfb-form-group">
                                <label>Titulo Principal *</label>
                                <input type="text" name="titulo" id="banner_titulo" required placeholder="ej: Envio Gratis Este Fin de Semana">
                            </div>

                            <div class="dfb-form-group">
                                <label>Tipo de Promocion</label>
                                <select name="tipo" id="banner_tipo">
                                    <option value="promocion">Promocion General</option>
                                    <option value="descuento">Descuento</option>
                                    <option value="envio">Envio Gratis</option>
                                    <option value="test">Test del Guardian</option>
                                    <option value="circulo">El Circulo</option>
                                    <option value="fecha">Fecha Especial</option>
                                    <option value="urgencia">Urgencia/Escasez</option>
                                    <option value="nuevo">Nuevo Producto</option>
                                </select>
                            </div>

                            <div class="dfb-form-group full-width">
                                <label>Subtitulo / Descripcion</label>
                                <textarea name="subtitulo" id="banner_subtitulo" placeholder="Describe brevemente la promocion..."></textarea>
                            </div>

                            <div class="dfb-form-group">
                                <label>Texto del Boton (CTA)</label>
                                <input type="text" name="cta_texto" id="banner_cta_texto" placeholder="ej: Ver Guardianes">
                            </div>

                            <div class="dfb-form-group">
                                <label>URL del Boton</label>
                                <input type="url" name="cta_url" id="banner_cta_url" placeholder="ej: /tienda/">
                            </div>

                            <div class="dfb-form-group">
                                <label>Codigo de Descuento (opcional)</label>
                                <input type="text" name="codigo_descuento" id="banner_codigo" placeholder="ej: MAGIA20">
                                <span class="help-text">Si existe en WooCommerce, se trackearan las conversiones</span>
                            </div>

                            <div class="dfb-form-group">
                                <label>Porcentaje de Descuento</label>
                                <input type="number" name="descuento_porcentaje" id="banner_descuento" min="0" max="100" placeholder="ej: 20">
                            </div>

                            <div class="dfb-form-group">
                                <label>Fecha de Inicio</label>
                                <input type="datetime-local" name="fecha_inicio" id="banner_fecha_inicio">
                            </div>

                            <div class="dfb-form-group">
                                <label>Fecha de Fin</label>
                                <input type="datetime-local" name="fecha_fin" id="banner_fecha_fin">
                            </div>

                            <div class="dfb-form-group">
                                <label>Prioridad (mayor = mas importante)</label>
                                <input type="number" name="prioridad" id="banner_prioridad" min="1" max="100" value="10">
                            </div>

                            <div class="dfb-form-group">
                                <label>Imagen de Fondo</label>
                                <input type="hidden" name="imagen_url" id="banner_imagen_url">
                                <button type="button" class="dfb-btn dfb-btn-secondary" onclick="dfbSelectImage()">
                                    Seleccionar Imagen
                                </button>
                                <div id="imagen-preview" style="margin-top: 10px;"></div>
                            </div>

                            <div class="dfb-form-group full-width">
                                <label>Ubicaciones donde mostrar</label>
                                <div class="dfb-ubicaciones-grid">
                                    <label class="dfb-ubicacion-checkbox">
                                        <input type="checkbox" name="ubicaciones[]" value="homepage"> Homepage
                                    </label>
                                    <label class="dfb-ubicacion-checkbox">
                                        <input type="checkbox" name="ubicaciones[]" value="tienda"> Tienda
                                    </label>
                                    <label class="dfb-ubicacion-checkbox">
                                        <input type="checkbox" name="ubicaciones[]" value="producto"> Pagina de Producto
                                    </label>
                                    <label class="dfb-ubicacion-checkbox">
                                        <input type="checkbox" name="ubicaciones[]" value="carrito"> Carrito
                                    </label>
                                    <label class="dfb-ubicacion-checkbox">
                                        <input type="checkbox" name="ubicaciones[]" value="checkout"> Checkout
                                    </label>
                                    <label class="dfb-ubicacion-checkbox">
                                        <input type="checkbox" name="ubicaciones[]" value="mi_magia"> Mi Magia
                                    </label>
                                    <label class="dfb-ubicacion-checkbox">
                                        <input type="checkbox" name="ubicaciones[]" value="popup"> Popup Global
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div style="display: flex; gap: 15px; margin-top: 20px;">
                            <button type="submit" class="dfb-btn dfb-btn-primary">Guardar Banner</button>
                            <button type="button" class="dfb-btn dfb-btn-secondary" onclick="dfbResetForm()">Limpiar</button>
                        </div>

                        <!-- Preview -->
                        <div class="dfb-preview-container">
                            <h3>Vista Previa</h3>
                            <div class="dfb-banner-preview-full" id="banner-preview">
                                <div class="preview-title">Tu titulo aparecera aqui</div>
                                <div class="preview-subtitle">Y tu descripcion aqui...</div>
                                <span class="preview-cta">Boton</span>
                            </div>
                        </div>
                    </form>
                </div>
            </div>

            <!-- Tab: Metricas -->
            <div id="tab-metricas" class="dfb-tab-content">
                <div class="dfb-metrics-grid">
                    <div class="dfb-metric-card">
                        <div class="number"><?php echo intval($metricas['total_impresiones']); ?></div>
                        <div class="label">Impresiones Totales</div>
                    </div>
                    <div class="dfb-metric-card gold">
                        <div class="number"><?php echo intval($metricas['total_clicks']); ?></div>
                        <div class="label">Clicks Totales</div>
                    </div>
                    <div class="dfb-metric-card green">
                        <div class="number"><?php echo number_format($metricas['ctr'], 1); ?>%</div>
                        <div class="label">CTR Promedio</div>
                    </div>
                    <div class="dfb-metric-card">
                        <div class="number"><?php echo intval($metricas['conversiones']); ?></div>
                        <div class="label">Conversiones</div>
                    </div>
                    <div class="dfb-metric-card">
                        <div class="number">$<?php echo number_format($metricas['valor_conversiones'], 0); ?></div>
                        <div class="label">Valor Conversiones</div>
                    </div>
                </div>

                <h3 style="margin: 30px 0 20px 0; color: #333;">Rendimiento por Banner</h3>
                <div class="dfb-banners-list">
                    <div class="dfb-banner-item header">
                        <div>Banner</div>
                        <div>Impresiones</div>
                        <div>Clicks</div>
                        <div>CTR</div>
                        <div>Conversiones</div>
                        <div>Valor</div>
                    </div>
                    <?php
                    foreach ($banners as $banner):
                        $bm = $this->get_banner_metrics($banner->id);
                        $ctr = $bm['impresiones'] > 0 ? ($bm['clicks'] / $bm['impresiones']) * 100 : 0;
                    ?>
                    <div class="dfb-banner-item" style="grid-template-columns: 1fr repeat(5, 100px);">
                        <div class="dfb-banner-title"><?php echo esc_html($banner->titulo); ?></div>
                        <div style="text-align: center;"><strong><?php echo intval($bm['impresiones']); ?></strong></div>
                        <div style="text-align: center;"><strong><?php echo intval($bm['clicks']); ?></strong></div>
                        <div style="text-align: center;"><strong><?php echo number_format($ctr, 1); ?>%</strong></div>
                        <div style="text-align: center;"><strong><?php echo intval($bm['conversiones']); ?></strong></div>
                        <div style="text-align: center;"><strong>$<?php echo number_format($bm['valor'], 0); ?></strong></div>
                    </div>
                    <?php endforeach; ?>
                </div>

                <div style="margin-top: 30px; padding: 20px; background: #f8f9fa; border-radius: 12px;">
                    <h4 style="margin: 0 0 15px 0;">Shortcodes Disponibles</h4>
                    <p style="margin: 5px 0; font-family: monospace; background: #fff; padding: 10px; border-radius: 6px;">
                        [duendes_banner id="X"] - Muestra un banner especifico
                    </p>
                    <p style="margin: 5px 0; font-family: monospace; background: #fff; padding: 10px; border-radius: 6px;">
                        [duendes_banners_ubicacion ubicacion="homepage"] - Muestra banners de una ubicacion
                    </p>
                </div>
            </div>
        </div>

        <script>
        (function($) {
            // Cambio de tabs
            $('.dfb-tab').on('click', function() {
                var tab = $(this).data('tab');
                $('.dfb-tab').removeClass('active');
                $(this).addClass('active');
                $('.dfb-tab-content').removeClass('active');
                $('#tab-' + tab).addClass('active');
            });

            // Checkboxes de ubicaciones
            $('.dfb-ubicacion-checkbox input').on('change', function() {
                $(this).closest('.dfb-ubicacion-checkbox').toggleClass('checked', this.checked);
            });

            // Preview en tiempo real
            $('#banner_titulo, #banner_subtitulo, #banner_cta_texto').on('input', function() {
                var titulo = $('#banner_titulo').val() || 'Tu titulo aparecera aqui';
                var subtitulo = $('#banner_subtitulo').val() || 'Y tu descripcion aqui...';
                var cta = $('#banner_cta_texto').val() || 'Boton';

                $('#banner-preview .preview-title').text(titulo);
                $('#banner-preview .preview-subtitle').text(subtitulo);
                $('#banner-preview .preview-cta').text(cta);
            });

            // Guardar banner
            $('#dfb-banner-form').on('submit', function(e) {
                e.preventDefault();

                var formData = {
                    action: 'dfb_save_banner',
                    nonce: '<?php echo wp_create_nonce('dfb_nonce'); ?>',
                    id: $('#banner_id').val(),
                    titulo: $('#banner_titulo').val(),
                    subtitulo: $('#banner_subtitulo').val(),
                    tipo: $('#banner_tipo').val(),
                    cta_texto: $('#banner_cta_texto').val(),
                    cta_url: $('#banner_cta_url').val(),
                    codigo_descuento: $('#banner_codigo').val(),
                    descuento_porcentaje: $('#banner_descuento').val(),
                    fecha_inicio: $('#banner_fecha_inicio').val(),
                    fecha_fin: $('#banner_fecha_fin').val(),
                    prioridad: $('#banner_prioridad').val(),
                    imagen_url: $('#banner_imagen_url').val(),
                    ubicaciones: []
                };

                $('input[name="ubicaciones[]"]:checked').each(function() {
                    formData.ubicaciones.push($(this).val());
                });

                $.post(ajaxurl, formData, function(response) {
                    if (response.success) {
                        dfbToast('Banner guardado correctamente', 'success');
                        setTimeout(function() { location.reload(); }, 1000);
                    } else {
                        dfbToast('Error: ' + response.data, 'error');
                    }
                });
            });
        })(jQuery);

        // Funciones globales
        function dfbToast(message, type) {
            var toast = document.createElement('div');
            toast.className = 'dfb-toast ' + (type || '');
            toast.textContent = message;
            document.body.appendChild(toast);
            setTimeout(function() { toast.remove(); }, 3000);
        }

        function dfbUsarIdea(idea) {
            document.getElementById('banner_titulo').value = idea.titulo_sugerido || idea.titulo;
            document.getElementById('banner_subtitulo').value = idea.descripcion_sugerida || idea.descripcion;
            document.getElementById('banner_cta_texto').value = idea.cta_sugerido || 'Ver mas';
            document.getElementById('banner_cta_url').value = idea.url_sugerida || '/tienda/';
            document.getElementById('banner_tipo').value = idea.tipo || 'promocion';

            // Trigger preview update
            document.getElementById('banner_titulo').dispatchEvent(new Event('input'));

            // Cambiar a tab de crear
            document.querySelector('[data-tab="crear"]').click();

            dfbToast('Idea cargada. Personaliza y guarda tu banner.', 'success');
        }

        function dfbEditBanner(id) {
            jQuery.post(ajaxurl, {
                action: 'dfb_get_banner',
                nonce: '<?php echo wp_create_nonce('dfb_nonce'); ?>',
                id: id
            }, function(response) {
                if (response.success) {
                    var b = response.data;
                    document.getElementById('banner_id').value = b.id;
                    document.getElementById('banner_titulo').value = b.titulo;
                    document.getElementById('banner_subtitulo').value = b.subtitulo || '';
                    document.getElementById('banner_tipo').value = b.tipo || 'promocion';
                    document.getElementById('banner_cta_texto').value = b.cta_texto || '';
                    document.getElementById('banner_cta_url').value = b.cta_url || '';
                    document.getElementById('banner_codigo').value = b.codigo_descuento || '';
                    document.getElementById('banner_descuento').value = b.descuento_porcentaje || '';
                    document.getElementById('banner_prioridad').value = b.prioridad || 10;
                    document.getElementById('banner_imagen_url').value = b.imagen_url || '';

                    // Ubicaciones
                    var ubicaciones = JSON.parse(b.ubicaciones || '[]');
                    jQuery('input[name="ubicaciones[]"]').each(function() {
                        this.checked = ubicaciones.includes(this.value);
                        jQuery(this).closest('.dfb-ubicacion-checkbox').toggleClass('checked', this.checked);
                    });

                    // Trigger preview
                    document.getElementById('banner_titulo').dispatchEvent(new Event('input'));

                    document.querySelector('[data-tab="crear"]').click();
                }
            });
        }

        function dfbToggleBanner(id) {
            jQuery.post(ajaxurl, {
                action: 'dfb_toggle_banner',
                nonce: '<?php echo wp_create_nonce('dfb_nonce'); ?>',
                id: id
            }, function(response) {
                if (response.success) {
                    location.reload();
                }
            });
        }

        function dfbDeleteBanner(id) {
            if (!confirm('Seguro que queres eliminar este banner?')) return;

            jQuery.post(ajaxurl, {
                action: 'dfb_delete_banner',
                nonce: '<?php echo wp_create_nonce('dfb_nonce'); ?>',
                id: id
            }, function(response) {
                if (response.success) {
                    dfbToast('Banner eliminado', 'success');
                    jQuery('[data-id="' + id + '"]').fadeOut();
                }
            });
        }

        function dfbResetForm() {
            document.getElementById('dfb-banner-form').reset();
            document.getElementById('banner_id').value = '';
            jQuery('.dfb-ubicacion-checkbox').removeClass('checked');
            document.getElementById('imagen-preview').innerHTML = '';
            document.getElementById('banner_titulo').dispatchEvent(new Event('input'));
        }

        function dfbSelectImage() {
            var mediaUploader = wp.media({
                title: 'Seleccionar Imagen',
                button: { text: 'Usar esta imagen' },
                multiple: false
            });

            mediaUploader.on('select', function() {
                var attachment = mediaUploader.state().get('selection').first().toJSON();
                document.getElementById('banner_imagen_url').value = attachment.url;
                document.getElementById('imagen-preview').innerHTML = '<img src="' + attachment.url + '" style="max-width: 200px; border-radius: 8px;">';
            });

            mediaUploader.open();
        }
        </script>
        <?php
    }

    // =====================================================
    // GENERADOR DE IDEAS INTELIGENTES
    // =====================================================
    public function generate_smart_ideas() {
        global $wpdb;
        $ideas = [];

        // 1. Productos mas vistos que no convierten
        if (class_exists('WooCommerce')) {
            $productos_vistos = $wpdb->get_results("
                SELECT p.ID, p.post_title, pm.meta_value as total_sales
                FROM {$wpdb->posts} p
                LEFT JOIN {$wpdb->postmeta} pm ON p.ID = pm.post_id AND pm.meta_key = 'total_sales'
                WHERE p.post_type = 'product' AND p.post_status = 'publish'
                ORDER BY CAST(pm.meta_value AS UNSIGNED) ASC
                LIMIT 5
            ");

            foreach ($productos_vistos as $prod) {
                if (intval($prod->total_sales) == 0) {
                    $ideas[] = [
                        'tipo' => 'urgente',
                        'categoria' => 'Producto sin ventas',
                        'titulo' => '"' . $prod->post_title . '" lleva tiempo esperando un hogar',
                        'descripcion' => 'Este guardian no ha encontrado su persona todavia. Podrias destacarlo con un banner especial o crear urgencia.',
                        'titulo_sugerido' => $prod->post_title . ' te esta buscando',
                        'descripcion_sugerida' => 'Hay guardianes que esperan a su persona por mucho tiempo. ' . $prod->post_title . ' siente que es hora de encontrarte.',
                        'cta_sugerido' => 'Conocer a ' . $prod->post_title,
                        'url_sugerida' => get_permalink($prod->ID)
                    ];
                }
            }
        }

        // 2. Fechas especiales proximas
        $fechas_especiales = [
            ['fecha' => '02-14', 'nombre' => 'San Valentin', 'icono' => 'heart'],
            ['fecha' => '05-10', 'nombre' => 'Dia de la Madre', 'icono' => 'flower'],
            ['fecha' => '06-16', 'nombre' => 'Dia del Padre', 'icono' => 'star'],
            ['fecha' => '12-25', 'nombre' => 'Navidad', 'icono' => 'gift'],
            ['fecha' => '10-31', 'nombre' => 'Halloween / Samhain', 'icono' => 'moon'],
            ['fecha' => '03-21', 'nombre' => 'Equinoccio de Otono', 'icono' => 'leaf'],
            ['fecha' => '06-21', 'nombre' => 'Solsticio de Invierno', 'icono' => 'snowflake'],
            ['fecha' => '09-21', 'nombre' => 'Equinoccio de Primavera', 'icono' => 'sun'],
            ['fecha' => '12-21', 'nombre' => 'Solsticio de Verano', 'icono' => 'sun'],
        ];

        $hoy = new DateTime();
        foreach ($fechas_especiales as $fecha) {
            $fecha_obj = DateTime::createFromFormat('m-d', $fecha['fecha']);
            $fecha_obj->setDate($hoy->format('Y'), $fecha_obj->format('m'), $fecha_obj->format('d'));

            if ($fecha_obj < $hoy) {
                $fecha_obj->modify('+1 year');
            }

            $dias_para = $hoy->diff($fecha_obj)->days;

            if ($dias_para <= 30 && $dias_para > 0) {
                $ideas[] = [
                    'tipo' => 'fecha',
                    'categoria' => 'Fecha especial en ' . $dias_para . ' dias',
                    'titulo' => $fecha['nombre'] . ' se acerca',
                    'descripcion' => 'Faltan ' . $dias_para . ' dias para ' . $fecha['nombre'] . '. Es el momento perfecto para crear una promocion especial o pack de regalo.',
                    'titulo_sugerido' => 'Guardianes para ' . $fecha['nombre'],
                    'descripcion_sugerida' => 'El regalo perfecto viene de otro mundo. Un guardian que acompane a quien amas.',
                    'cta_sugerido' => 'Ver Guardianes de Regalo',
                    'url_sugerida' => '/tienda/'
                ];
            }
        }

        // 3. Carritos abandonados (si existe la tabla)
        $tabla_carritos = $wpdb->prefix . 'duendes_carritos_abandonados';
        $carritos_existen = $wpdb->get_var("SHOW TABLES LIKE '{$tabla_carritos}'");

        if ($carritos_existen) {
            $carritos_altos = $wpdb->get_var("
                SELECT COUNT(*) FROM {$tabla_carritos}
                WHERE total > 100 AND recovered = 0 AND created_at > DATE_SUB(NOW(), INTERVAL 7 DAY)
            ");

            if ($carritos_altos > 5) {
                $ideas[] = [
                    'tipo' => 'oportunidad',
                    'categoria' => 'Carritos abandonados',
                    'titulo' => $carritos_altos . ' personas abandonaron carritos de mas de $100',
                    'descripcion' => 'Podrias ofrecer envio gratis o un descuento especial para recuperar estas ventas perdidas.',
                    'titulo_sugerido' => 'Envio Gratis en Compras +$100',
                    'descripcion_sugerida' => 'Tu guardian quiere viajar a encontrarte. Por tiempo limitado, viaja sin costo.',
                    'cta_sugerido' => 'Completar mi Compra',
                    'url_sugerida' => '/carrito/'
                ];
            }
        }

        // 4. Test del Guardian
        $visitas_test = get_option('duendes_test_visitas', 0);
        $completados_test = get_option('duendes_test_completados', 0);

        if ($visitas_test > 100 && $completados_test < ($visitas_test * 0.3)) {
            $ideas[] = [
                'tipo' => 'oportunidad',
                'categoria' => 'Conversion del Test',
                'titulo' => 'El Test del Guardian tiene muchas visitas pero pocas conversiones',
                'descripcion' => 'Solo el ' . round(($completados_test/$visitas_test)*100) . '% completa el test. Podrias incentivarlo con un descuento al finalizar.',
                'titulo_sugerido' => 'Descubri tu Guardian + Regalo',
                'descripcion_sugerida' => 'Hace el test y recibiras un codigo especial de bienvenida.',
                'cta_sugerido' => 'Hacer el Test',
                'url_sugerida' => '/test-del-guardian/'
            ];
        }

        // 5. El Circulo - conversiones
        $trials_por_vencer = get_option('duendes_circulo_trials', 0);
        if ($trials_por_vencer > 10) {
            $ideas[] = [
                'tipo' => 'circulo',
                'categoria' => 'El Circulo',
                'titulo' => $trials_por_vencer . ' usuarios con trial por vencer',
                'descripcion' => 'Es el momento de mostrarles el valor del Circulo antes de que pierdan acceso.',
                'titulo_sugerido' => 'Tu acceso al Circulo termina pronto',
                'descripcion_sugerida' => 'No pierdas la conexion con tu guardian. Asegura tu lugar en el Circulo.',
                'cta_sugerido' => 'Unirme al Circulo',
                'url_sugerida' => '/mi-magia/circulo/'
            ];
        }

        // 6. Categorias poco exploradas
        if (class_exists('WooCommerce')) {
            $categorias = get_terms([
                'taxonomy' => 'product_cat',
                'hide_empty' => true
            ]);

            foreach ($categorias as $cat) {
                $productos_cat = new WP_Query([
                    'post_type' => 'product',
                    'posts_per_page' => -1,
                    'tax_query' => [
                        ['taxonomy' => 'product_cat', 'field' => 'term_id', 'terms' => $cat->term_id]
                    ]
                ]);

                if ($productos_cat->post_count > 5) {
                    // Verificar ventas de la categoria
                    $ventas_cat = 0;
                    while ($productos_cat->have_posts()) {
                        $productos_cat->the_post();
                        $ventas_cat += intval(get_post_meta(get_the_ID(), 'total_sales', true));
                    }
                    wp_reset_postdata();

                    if ($ventas_cat < 3) {
                        $ideas[] = [
                            'tipo' => 'oportunidad',
                            'categoria' => 'Categoria poco explorada',
                            'titulo' => 'Los guardianes de "' . $cat->name . '" necesitan visibilidad',
                            'descripcion' => 'Tenes ' . $productos_cat->post_count . ' guardianes en esta categoria con pocas ventas. Un banner dedicado podria cambiar eso.',
                            'titulo_sugerido' => 'Descubri los Guardianes de ' . $cat->name,
                            'descripcion_sugerida' => 'Energia unica para momentos especiales. Conoce a estos seres extraordinarios.',
                            'cta_sugerido' => 'Explorar ' . $cat->name,
                            'url_sugerida' => get_term_link($cat)
                        ];
                        break; // Solo una idea de categoria
                    }
                }
            }
        }

        // 7. Nueva canalizacion (idea generica)
        $ideas[] = [
            'tipo' => 'circulo',
            'categoria' => 'Contenido Nuevo',
            'titulo' => 'Anuncia contenido nuevo en Mi Magia',
            'descripcion' => 'Cada vez que publiques una nueva canalizacion o contenido exclusivo, avisales a todos con un banner.',
            'titulo_sugerido' => 'Nueva Canalizacion Disponible',
            'descripcion_sugerida' => 'Los guardianes tienen un mensaje especial para vos este mes. Entrá a Mi Magia para recibirlo.',
            'cta_sugerido' => 'Ir a Mi Magia',
            'url_sugerida' => '/mi-magia/'
        ];

        // 8. Envio gratis (idea generica)
        $ideas[] = [
            'tipo' => 'envio',
            'categoria' => 'Promocion de Envio',
            'titulo' => 'Ofrece envio gratis para aumentar conversiones',
            'descripcion' => 'El envio gratis es uno de los incentivos mas efectivos. Considera ofrecerlo por tiempo limitado o sobre cierto monto.',
            'titulo_sugerido' => 'Envio Gratis a Todo el Mundo',
            'descripcion_sugerida' => 'Tu guardian viaja sin costo hasta donde estes. Promocion por tiempo limitado.',
            'cta_sugerido' => 'Ver Guardianes',
            'url_sugerida' => '/tienda/'
        ];

        // Limitar a 8 ideas maximo
        return array_slice($ideas, 0, 8);
    }

    // =====================================================
    // METRICAS
    // =====================================================
    public function get_general_metrics() {
        global $wpdb;

        $impresiones = $wpdb->get_var("SELECT COUNT(*) FROM {$this->table_metrics} WHERE tipo_evento = 'impresion'") ?: 0;
        $clicks = $wpdb->get_var("SELECT COUNT(*) FROM {$this->table_metrics} WHERE tipo_evento = 'click'") ?: 0;
        $conversiones = $wpdb->get_var("SELECT COUNT(*) FROM {$this->table_metrics} WHERE tipo_evento = 'conversion'") ?: 0;
        $valor = $wpdb->get_var("SELECT SUM(valor_conversion) FROM {$this->table_metrics} WHERE tipo_evento = 'conversion'") ?: 0;

        return [
            'total_impresiones' => $impresiones,
            'total_clicks' => $clicks,
            'ctr' => $impresiones > 0 ? ($clicks / $impresiones) * 100 : 0,
            'conversiones' => $conversiones,
            'valor_conversiones' => $valor
        ];
    }

    public function get_banner_metrics($banner_id) {
        global $wpdb;

        $impresiones = $wpdb->get_var($wpdb->prepare(
            "SELECT COUNT(*) FROM {$this->table_metrics} WHERE banner_id = %d AND tipo_evento = 'impresion'",
            $banner_id
        )) ?: 0;

        $clicks = $wpdb->get_var($wpdb->prepare(
            "SELECT COUNT(*) FROM {$this->table_metrics} WHERE banner_id = %d AND tipo_evento = 'click'",
            $banner_id
        )) ?: 0;

        $conversiones = $wpdb->get_var($wpdb->prepare(
            "SELECT COUNT(*) FROM {$this->table_metrics} WHERE banner_id = %d AND tipo_evento = 'conversion'",
            $banner_id
        )) ?: 0;

        $valor = $wpdb->get_var($wpdb->prepare(
            "SELECT SUM(valor_conversion) FROM {$this->table_metrics} WHERE banner_id = %d AND tipo_evento = 'conversion'",
            $banner_id
        )) ?: 0;

        return [
            'impresiones' => $impresiones,
            'clicks' => $clicks,
            'conversiones' => $conversiones,
            'valor' => $valor
        ];
    }

    // =====================================================
    // AJAX HANDLERS
    // =====================================================
    public function ajax_save_banner() {
        check_ajax_referer('dfb_nonce', 'nonce');

        if (!current_user_can('manage_woocommerce')) {
            wp_send_json_error('Sin permisos');
        }

        global $wpdb;

        $data = [
            'titulo' => sanitize_text_field($_POST['titulo']),
            'subtitulo' => sanitize_textarea_field($_POST['subtitulo']),
            'tipo' => sanitize_text_field($_POST['tipo']),
            'cta_texto' => sanitize_text_field($_POST['cta_texto']),
            'cta_url' => esc_url_raw($_POST['cta_url']),
            'codigo_descuento' => sanitize_text_field($_POST['codigo_descuento']),
            'descuento_porcentaje' => intval($_POST['descuento_porcentaje']),
            'fecha_inicio' => $_POST['fecha_inicio'] ? sanitize_text_field($_POST['fecha_inicio']) : null,
            'fecha_fin' => $_POST['fecha_fin'] ? sanitize_text_field($_POST['fecha_fin']) : null,
            'prioridad' => intval($_POST['prioridad']),
            'imagen_url' => esc_url_raw($_POST['imagen_url']),
            'ubicaciones' => json_encode(array_map('sanitize_text_field', $_POST['ubicaciones'] ?? [])),
            'activo' => 1
        ];

        $id = intval($_POST['id']);

        if ($id) {
            $wpdb->update($this->table_banners, $data, ['id' => $id]);
        } else {
            $wpdb->insert($this->table_banners, $data);
            $id = $wpdb->insert_id;
        }

        wp_send_json_success(['id' => $id]);
    }

    public function ajax_delete_banner() {
        check_ajax_referer('dfb_nonce', 'nonce');

        if (!current_user_can('manage_woocommerce')) {
            wp_send_json_error('Sin permisos');
        }

        global $wpdb;
        $id = intval($_POST['id']);

        $wpdb->delete($this->table_banners, ['id' => $id]);
        $wpdb->delete($this->table_metrics, ['banner_id' => $id]);

        wp_send_json_success();
    }

    public function ajax_toggle_banner() {
        check_ajax_referer('dfb_nonce', 'nonce');

        if (!current_user_can('manage_woocommerce')) {
            wp_send_json_error('Sin permisos');
        }

        global $wpdb;
        $id = intval($_POST['id']);

        $actual = $wpdb->get_var($wpdb->prepare(
            "SELECT activo FROM {$this->table_banners} WHERE id = %d",
            $id
        ));

        $wpdb->update($this->table_banners, ['activo' => !$actual], ['id' => $id]);

        wp_send_json_success();
    }

    public function ajax_track_impression() {
        global $wpdb;

        $banner_id = intval($_POST['banner_id']);
        $ubicacion = sanitize_text_field($_POST['ubicacion'] ?? '');

        $wpdb->insert($this->table_metrics, [
            'banner_id' => $banner_id,
            'tipo_evento' => 'impresion',
            'user_id' => get_current_user_id(),
            'session_id' => session_id() ?: wp_generate_uuid4(),
            'ubicacion' => $ubicacion
        ]);

        wp_send_json_success();
    }

    public function ajax_track_click() {
        global $wpdb;

        $banner_id = intval($_POST['banner_id']);
        $ubicacion = sanitize_text_field($_POST['ubicacion'] ?? '');

        $wpdb->insert($this->table_metrics, [
            'banner_id' => $banner_id,
            'tipo_evento' => 'click',
            'user_id' => get_current_user_id(),
            'session_id' => session_id() ?: wp_generate_uuid4(),
            'ubicacion' => $ubicacion
        ]);

        wp_send_json_success();
    }

    public function ajax_dismiss_banner() {
        $banner_id = intval($_POST['banner_id']);

        // Guardar en cookie que el usuario cerro este banner
        $dismissed = isset($_COOKIE['dfb_dismissed']) ? json_decode(stripslashes($_COOKIE['dfb_dismissed']), true) : [];
        $dismissed[] = $banner_id;

        setcookie('dfb_dismissed', json_encode($dismissed), time() + (86400 * 7), '/');

        wp_send_json_success();
    }

    // =====================================================
    // SHORTCODES
    // =====================================================
    public function shortcode_banner($atts) {
        $atts = shortcode_atts(['id' => 0], $atts);

        global $wpdb;
        $banner = $wpdb->get_row($wpdb->prepare(
            "SELECT * FROM {$this->table_banners} WHERE id = %d AND activo = 1",
            intval($atts['id'])
        ));

        if (!$banner) return '';

        return $this->render_banner($banner, 'shortcode');
    }

    public function shortcode_ubicacion($atts) {
        $atts = shortcode_atts(['ubicacion' => 'homepage', 'limite' => 1], $atts);

        $banners = $this->get_active_banners($atts['ubicacion'], intval($atts['limite']));

        $output = '';
        foreach ($banners as $banner) {
            $output .= $this->render_banner($banner, $atts['ubicacion']);
        }

        return $output;
    }

    // =====================================================
    // OBTENER BANNERS ACTIVOS
    // =====================================================
    public function get_active_banners($ubicacion, $limite = 1) {
        global $wpdb;

        $now = current_time('mysql');
        $dismissed = isset($_COOKIE['dfb_dismissed']) ? json_decode(stripslashes($_COOKIE['dfb_dismissed']), true) : [];

        $banners = $wpdb->get_results($wpdb->prepare("
            SELECT * FROM {$this->table_banners}
            WHERE activo = 1
            AND (fecha_inicio IS NULL OR fecha_inicio <= %s)
            AND (fecha_fin IS NULL OR fecha_fin >= %s)
            ORDER BY prioridad DESC
        ", $now, $now));

        $resultado = [];
        foreach ($banners as $banner) {
            // Verificar si el usuario lo cerro
            if (in_array($banner->id, $dismissed)) continue;

            // Verificar ubicacion
            $ubicaciones = json_decode($banner->ubicaciones, true) ?: [];
            if (in_array($ubicacion, $ubicaciones) || in_array('todas', $ubicaciones)) {
                $resultado[] = $banner;
                if (count($resultado) >= $limite) break;
            }
        }

        return $resultado;
    }

    // =====================================================
    // RENDERIZAR BANNER
    // =====================================================
    public function render_banner($banner, $ubicacion = '') {
        $tiene_imagen = !empty($banner->imagen_url);

        ob_start();
        ?>
        <div class="dfb-banner-display" data-banner-id="<?php echo $banner->id; ?>" data-ubicacion="<?php echo esc_attr($ubicacion); ?>">
            <style>
                .dfb-banner-display {
                    position: relative;
                    background: <?php echo $tiene_imagen ? 'url(' . esc_url($banner->imagen_url) . ')' : 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)'; ?>;
                    background-size: cover;
                    background-position: center;
                    padding: 40px 30px;
                    border-radius: 12px;
                    text-align: center;
                    color: #fff;
                    margin: 20px 0;
                    overflow: hidden;
                    animation: dfbFadeIn 0.5s ease;
                }
                @keyframes dfbFadeIn {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .dfb-banner-display::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(26, 26, 46, 0.7);
                    z-index: 1;
                }
                .dfb-banner-display * {
                    position: relative;
                    z-index: 2;
                }
                .dfb-banner-display .dfb-titulo {
                    font-size: 28px;
                    font-weight: 700;
                    color: #d4af37;
                    margin-bottom: 10px;
                    text-shadow: 0 2px 10px rgba(0,0,0,0.3);
                }
                .dfb-banner-display .dfb-subtitulo {
                    font-size: 16px;
                    opacity: 0.95;
                    margin-bottom: 20px;
                    max-width: 600px;
                    margin-left: auto;
                    margin-right: auto;
                }
                .dfb-banner-display .dfb-cta {
                    display: inline-block;
                    padding: 14px 35px;
                    background: linear-gradient(135deg, #d4af37, #b8960c);
                    color: #1a1a2e;
                    text-decoration: none;
                    border-radius: 30px;
                    font-weight: 600;
                    font-size: 15px;
                    transition: transform 0.3s, box-shadow 0.3s;
                    box-shadow: 0 4px 15px rgba(212, 175, 55, 0.3);
                }
                .dfb-banner-display .dfb-cta:hover {
                    transform: translateY(-3px);
                    box-shadow: 0 6px 25px rgba(212, 175, 55, 0.4);
                }
                .dfb-banner-display .dfb-close {
                    position: absolute;
                    top: 15px;
                    right: 15px;
                    width: 30px;
                    height: 30px;
                    background: rgba(255,255,255,0.2);
                    border: none;
                    border-radius: 50%;
                    color: #fff;
                    cursor: pointer;
                    font-size: 18px;
                    line-height: 30px;
                    z-index: 10;
                    transition: background 0.2s;
                }
                .dfb-banner-display .dfb-close:hover {
                    background: rgba(255,255,255,0.3);
                }
                .dfb-banner-display .dfb-codigo {
                    margin-top: 15px;
                    padding: 8px 20px;
                    background: rgba(255,255,255,0.15);
                    border-radius: 20px;
                    display: inline-block;
                    font-family: monospace;
                    font-size: 14px;
                    letter-spacing: 2px;
                }
                @media (max-width: 768px) {
                    .dfb-banner-display {
                        padding: 30px 20px;
                    }
                    .dfb-banner-display .dfb-titulo {
                        font-size: 22px;
                    }
                    .dfb-banner-display .dfb-subtitulo {
                        font-size: 14px;
                    }
                }
            </style>

            <button class="dfb-close" onclick="dfbDismissBanner(<?php echo $banner->id; ?>, this)">&times;</button>

            <div class="dfb-titulo"><?php echo esc_html($banner->titulo); ?></div>

            <?php if ($banner->subtitulo): ?>
            <div class="dfb-subtitulo"><?php echo esc_html($banner->subtitulo); ?></div>
            <?php endif; ?>

            <?php if ($banner->cta_texto && $banner->cta_url): ?>
            <a href="<?php echo esc_url($banner->cta_url); ?>" class="dfb-cta" onclick="dfbTrackClick(<?php echo $banner->id; ?>, '<?php echo esc_js($ubicacion); ?>')">
                <?php echo esc_html($banner->cta_texto); ?>
            </a>
            <?php endif; ?>

            <?php if ($banner->codigo_descuento): ?>
            <div class="dfb-codigo">
                Codigo: <?php echo esc_html($banner->codigo_descuento); ?>
            </div>
            <?php endif; ?>
        </div>

        <script>
        (function() {
            // Track impression
            var xhr = new XMLHttpRequest();
            xhr.open('POST', '<?php echo admin_url('admin-ajax.php'); ?>', true);
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            xhr.send('action=dfb_track_impression&banner_id=<?php echo $banner->id; ?>&ubicacion=<?php echo esc_js($ubicacion); ?>');
        })();

        function dfbTrackClick(bannerId, ubicacion) {
            var xhr = new XMLHttpRequest();
            xhr.open('POST', '<?php echo admin_url('admin-ajax.php'); ?>', true);
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            xhr.send('action=dfb_track_click&banner_id=' + bannerId + '&ubicacion=' + ubicacion);
        }

        function dfbDismissBanner(bannerId, btn) {
            var banner = btn.closest('.dfb-banner-display');
            banner.style.opacity = '0';
            banner.style.transform = 'translateY(-20px)';
            setTimeout(function() { banner.remove(); }, 300);

            var xhr = new XMLHttpRequest();
            xhr.open('POST', '<?php echo admin_url('admin-ajax.php'); ?>', true);
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            xhr.send('action=dfb_dismiss_banner&banner_id=' + bannerId);
        }
        </script>
        <?php
        return ob_get_clean();
    }

    // =====================================================
    // POPUP BANNERS (en footer)
    // =====================================================
    public function render_popup_banners() {
        // No mostrar en admin
        if (is_admin()) return;

        $banners = $this->get_active_banners('popup', 1);
        if (empty($banners)) return;

        $banner = $banners[0];
        ?>
        <style>
            .dfb-popup-overlay {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0,0,0,0.7);
                z-index: 999998;
                display: flex;
                align-items: center;
                justify-content: center;
                animation: dfbPopupFadeIn 0.3s ease;
            }
            @keyframes dfbPopupFadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            .dfb-popup-content {
                max-width: 500px;
                width: 90%;
                background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
                border-radius: 16px;
                padding: 40px;
                text-align: center;
                color: #fff;
                position: relative;
                animation: dfbPopupSlideIn 0.4s ease;
                box-shadow: 0 20px 60px rgba(0,0,0,0.5);
            }
            @keyframes dfbPopupSlideIn {
                from { transform: scale(0.9) translateY(20px); }
                to { transform: scale(1) translateY(0); }
            }
            .dfb-popup-close {
                position: absolute;
                top: 15px;
                right: 15px;
                width: 36px;
                height: 36px;
                background: rgba(255,255,255,0.15);
                border: none;
                border-radius: 50%;
                color: #fff;
                cursor: pointer;
                font-size: 20px;
                transition: background 0.2s;
            }
            .dfb-popup-close:hover {
                background: rgba(255,255,255,0.25);
            }
            .dfb-popup-titulo {
                font-size: 26px;
                font-weight: 700;
                color: #d4af37;
                margin-bottom: 15px;
            }
            .dfb-popup-subtitulo {
                font-size: 15px;
                opacity: 0.9;
                margin-bottom: 25px;
                line-height: 1.6;
            }
            .dfb-popup-cta {
                display: inline-block;
                padding: 14px 35px;
                background: linear-gradient(135deg, #d4af37, #b8960c);
                color: #1a1a2e;
                text-decoration: none;
                border-radius: 30px;
                font-weight: 600;
                font-size: 15px;
                transition: transform 0.3s, box-shadow 0.3s;
            }
            .dfb-popup-cta:hover {
                transform: translateY(-2px);
                box-shadow: 0 6px 25px rgba(212, 175, 55, 0.4);
                color: #1a1a2e;
            }
        </style>

        <div class="dfb-popup-overlay" id="dfb-popup" data-banner-id="<?php echo $banner->id; ?>">
            <div class="dfb-popup-content">
                <button class="dfb-popup-close" onclick="dfbClosePopup(<?php echo $banner->id; ?>)">&times;</button>

                <div class="dfb-popup-titulo"><?php echo esc_html($banner->titulo); ?></div>

                <?php if ($banner->subtitulo): ?>
                <div class="dfb-popup-subtitulo"><?php echo esc_html($banner->subtitulo); ?></div>
                <?php endif; ?>

                <?php if ($banner->cta_texto && $banner->cta_url): ?>
                <a href="<?php echo esc_url($banner->cta_url); ?>" class="dfb-popup-cta" onclick="dfbTrackClick(<?php echo $banner->id; ?>, 'popup')">
                    <?php echo esc_html($banner->cta_texto); ?>
                </a>
                <?php endif; ?>
            </div>
        </div>

        <script>
        (function() {
            // Track impression
            var xhr = new XMLHttpRequest();
            xhr.open('POST', '<?php echo admin_url('admin-ajax.php'); ?>', true);
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            xhr.send('action=dfb_track_impression&banner_id=<?php echo $banner->id; ?>&ubicacion=popup');

            // Cerrar al hacer click fuera
            document.getElementById('dfb-popup').addEventListener('click', function(e) {
                if (e.target === this) {
                    dfbClosePopup(<?php echo $banner->id; ?>);
                }
            });
        })();

        function dfbClosePopup(bannerId) {
            var popup = document.getElementById('dfb-popup');
            popup.style.opacity = '0';
            setTimeout(function() { popup.remove(); }, 300);

            var xhr = new XMLHttpRequest();
            xhr.open('POST', '<?php echo admin_url('admin-ajax.php'); ?>', true);
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            xhr.send('action=dfb_dismiss_banner&banner_id=' + bannerId);
        }

        function dfbTrackClick(bannerId, ubicacion) {
            var xhr = new XMLHttpRequest();
            xhr.open('POST', '<?php echo admin_url('admin-ajax.php'); ?>', true);
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            xhr.send('action=dfb_track_click&banner_id=' + bannerId + '&ubicacion=' + ubicacion);
        }
        </script>
        <?php
    }
}

// =====================================================
// AJAX HANDLER PARA OBTENER BANNER (edicion)
// =====================================================
add_action('wp_ajax_dfb_get_banner', function() {
    check_ajax_referer('dfb_nonce', 'nonce');

    if (!current_user_can('manage_woocommerce')) {
        wp_send_json_error('Sin permisos');
    }

    global $wpdb;
    $table = $wpdb->prefix . 'duendes_banners';
    $id = intval($_POST['id']);

    $banner = $wpdb->get_row($wpdb->prepare("SELECT * FROM {$table} WHERE id = %d", $id), ARRAY_A);

    if ($banner) {
        wp_send_json_success($banner);
    } else {
        wp_send_json_error('Banner no encontrado');
    }
});

// =====================================================
// TRACKING DE CONVERSIONES (cuando se usa un cupon)
// =====================================================
add_action('woocommerce_order_status_completed', function($order_id) {
    $order = wc_get_order($order_id);
    if (!$order) return;

    $coupons = $order->get_coupon_codes();
    if (empty($coupons)) return;

    global $wpdb;
    $table_banners = $wpdb->prefix . 'duendes_banners';
    $table_metrics = $wpdb->prefix . 'duendes_banner_metrics';

    foreach ($coupons as $coupon_code) {
        // Buscar banner con este codigo
        $banner = $wpdb->get_row($wpdb->prepare(
            "SELECT id FROM {$table_banners} WHERE codigo_descuento = %s",
            $coupon_code
        ));

        if ($banner) {
            $wpdb->insert($table_metrics, [
                'banner_id' => $banner->id,
                'tipo_evento' => 'conversion',
                'user_id' => $order->get_customer_id(),
                'codigo_usado' => $coupon_code,
                'valor_conversion' => $order->get_total()
            ]);
        }
    }
});

// =====================================================
// INICIALIZAR PLUGIN
// =====================================================
function duendes_fabrica_banners_init() {
    return Duendes_Fabrica_Banners::instance();
}
add_action('plugins_loaded', 'duendes_fabrica_banners_init');

// =====================================================
// FUNCIONES HELPER PARA OTROS PLUGINS
// =====================================================

/**
 * Muestra banners de una ubicacion especifica
 * Uso: duendes_mostrar_banners('homepage');
 */
function duendes_mostrar_banners($ubicacion, $limite = 1) {
    $plugin = Duendes_Fabrica_Banners::instance();
    $banners = $plugin->get_active_banners($ubicacion, $limite);

    foreach ($banners as $banner) {
        echo $plugin->render_banner($banner, $ubicacion);
    }
}

/**
 * Obtiene banners activos sin renderizar
 * Uso: $banners = duendes_get_banners('tienda');
 */
function duendes_get_banners($ubicacion, $limite = 5) {
    $plugin = Duendes_Fabrica_Banners::instance();
    return $plugin->get_active_banners($ubicacion, $limite);
}

// =====================================================
// AUTO-INYECCIÓN DE BANNERS EN UBICACIONES
// =====================================================

// TIENDA: Banner antes de los productos
add_action('woocommerce_before_shop_loop', function() {
    duendes_mostrar_banners('tienda', 1);
}, 15);

// PRODUCTO: Banner en página de producto
add_action('woocommerce_before_single_product', function() {
    duendes_mostrar_banners('producto', 1);
}, 5);

// CARRITO: Banner antes del carrito
add_action('woocommerce_before_cart', function() {
    duendes_mostrar_banners('carrito', 1);
}, 5);

// CHECKOUT: Banner antes del checkout
add_action('woocommerce_before_checkout_form', function() {
    duendes_mostrar_banners('checkout', 1);
}, 5);

// HOMEPAGE: Banner en el footer (se inyecta en todas las páginas pero solo muestra si es front_page)
add_action('wp_footer', function() {
    if (is_front_page() || is_home()) {
        echo '<div id="dfb-homepage-banners" style="position:fixed;bottom:20px;left:20px;right:20px;z-index:9998;pointer-events:none;">';
        echo '<div style="max-width:600px;margin:0 auto;pointer-events:auto;">';
        duendes_mostrar_banners('homepage', 1);
        echo '</div></div>';
    }
});

// POPUP GLOBAL: Se muestra en cualquier página
add_action('wp_footer', function() {
    if (is_admin()) return;

    $plugin = Duendes_Fabrica_Banners::instance();
    $popups = $plugin->get_active_banners('popup', 1);

    foreach ($popups as $popup) {
        $plugin->render_popup($popup);
    }
});

// MI MAGIA: Shortcode especial que se puede usar en Vercel o WordPress
add_shortcode('duendes_banners_mi_magia', function() {
    ob_start();
    duendes_mostrar_banners('mi-magia', 2);
    return ob_get_clean();
});

// API REST para obtener banners desde Vercel/Mi Magia
add_action('rest_api_init', function() {
    register_rest_route('duendes/v1', '/banners/(?P<ubicacion>[a-zA-Z0-9_-]+)', [
        'methods' => 'GET',
        'callback' => function($request) {
            $ubicacion = $request['ubicacion'];
            $limite = $request->get_param('limite') ?: 3;

            $plugin = Duendes_Fabrica_Banners::instance();
            $banners = $plugin->get_active_banners($ubicacion, $limite);

            $result = [];
            foreach ($banners as $banner) {
                $result[] = [
                    'id' => $banner->id,
                    'titulo' => $banner->titulo,
                    'subtitulo' => $banner->subtitulo,
                    'tipo' => $banner->tipo,
                    'cta_texto' => $banner->cta_texto,
                    'cta_url' => $banner->cta_url,
                    'imagen_url' => $banner->imagen_url,
                    'codigo_descuento' => $banner->codigo_descuento,
                ];
            }

            return rest_ensure_response($result);
        },
        'permission_callback' => '__return_true',
    ]);
});
