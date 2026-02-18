<?php
/**
 * Plugin Name: Duendes Guardian Suite
 * Description: Sistema completo para guardianes: Ficha + Historias + IA. Sin dependencias externas.
 * Version: 2.0.0
 * Author: Duendes del Uruguay
 * Requires: WooCommerce
 */

if (!defined('ABSPATH')) exit;

// ═══════════════════════════════════════════════════════════════════════════
// CLASE PRINCIPAL
// ═══════════════════════════════════════════════════════════════════════════

class DuendesGuardianSuite {

    private static $instance = null;
    private $version = '2.0.0';

    public static function instance() {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    public function __construct() {
        // Admin
        add_action('admin_menu', [$this, 'agregar_menu_admin']);
        add_action('admin_init', [$this, 'registrar_settings']);
        add_action('add_meta_boxes', [$this, 'agregar_metabox']);
        add_action('save_post_product', [$this, 'guardar_ficha']);
        add_action('admin_enqueue_scripts', [$this, 'admin_scripts']);

        // Frontend
        add_filter('woocommerce_product_tabs', [$this, 'agregar_tab_ficha']);
        add_action('woocommerce_single_product_summary', [$this, 'mostrar_subtitulo'], 6);
        add_action('wp_enqueue_scripts', [$this, 'frontend_scripts']);

        // AJAX
        add_action('wp_ajax_duendes_generar_historia', [$this, 'ajax_generar_historia']);
        add_action('wp_ajax_duendes_generar_ficha_ia', [$this, 'ajax_generar_ficha_ia']);
        add_action('wp_ajax_duendes_auto_completar', [$this, 'ajax_auto_completar']);
        add_action('wp_ajax_duendes_guardar_ficha_ajax', [$this, 'ajax_guardar_ficha']);

        // Limpiar metaboxes viejos
        add_action('add_meta_boxes', [$this, 'limpiar_metaboxes_viejos'], 99);
    }

    // ═══════════════════════════════════════════════════════════════════════
    // CONFIGURACIÓN Y DATOS
    // ═══════════════════════════════════════════════════════════════════════

    public function get_api_key() {
        // Primero buscar en opciones de WP
        $key = get_option('duendes_anthropic_api_key', '');

        // Si no hay, buscar en wp-config.php
        if (empty($key) && defined('ANTHROPIC_API_KEY')) {
            $key = ANTHROPIC_API_KEY;
        }

        return $key;
    }

    public function get_especies() {
        return [
            'clasicas' => [
                'duende' => ['nombre' => 'Duende', 'fem' => 'Duenda', 'desc' => 'Seres ancestrales protectores del hogar.'],
                'pixie' => ['nombre' => 'Pixie', 'fem' => 'Pixie', 'desc' => 'Almas salvajes de la naturaleza. Siempre únicas.'],
                'leprechaun' => ['nombre' => 'Leprechaun', 'fem' => 'Leprechaun', 'desc' => 'Guardianes irlandeses de la fortuna.'],
                'elfo' => ['nombre' => 'Elfo', 'fem' => 'Elfa', 'desc' => 'Seres de luz y sabiduría.'],
                'hada' => ['nombre' => 'Hada', 'fem' => 'Hada', 'desc' => 'Seres etéreos entre mundos.'],
                'bruja' => ['nombre' => 'Brujo', 'fem' => 'Bruja', 'desc' => 'Conocedores de artes antiguas.'],
                'vikingo' => ['nombre' => 'Vikingo', 'fem' => 'Vikinga', 'desc' => 'Guerreros del norte.'],
                'chaman' => ['nombre' => 'Chamán', 'fem' => 'Chamana', 'desc' => 'Puentes entre mundos.'],
                'sanador' => ['nombre' => 'Sanador', 'fem' => 'Sanadora', 'desc' => 'Canalizadores de energía curativa.'],
                'guerrero' => ['nombre' => 'Guerrero', 'fem' => 'Guerrera', 'desc' => 'Protectores fieros.'],
                'hechicero' => ['nombre' => 'Hechicero', 'fem' => 'Hechicera', 'desc' => 'Manipuladores de energías.'],
            ],
            'exclusivas' => [
                'luminide' => ['nombre' => 'Lumínide', 'fem' => 'Lumínide', 'desc' => 'Nacidos de la primera luz del amanecer.'],
                'terralma' => ['nombre' => 'Terralma', 'fem' => 'Terralma', 'desc' => 'Fusionan tierra y alma.'],
                'velarian' => ['nombre' => 'Velarián', 'fem' => 'Velariana', 'desc' => 'Custodios de los velos entre mundos.'],
            ],
            'arquetipos' => [
                'merlin' => ['nombre' => 'Merlín', 'desc' => 'El arquetipo del mago sabio.'],
                'gandalf' => ['nombre' => 'Gandalf', 'desc' => 'El caminante gris.'],
                'morgana' => ['nombre' => 'Morgana', 'desc' => 'La hechicera de los misterios.'],
            ]
        ];
    }

    public function get_categorias() {
        return [
            'proteccion' => ['nombre' => 'Protección', 'subs' => ['hogar', 'personal', 'familiar', 'envidias', 'energetica']],
            'abundancia' => ['nombre' => 'Abundancia', 'subs' => ['dinero', 'oportunidades', 'negocios', 'trabajo', 'bloqueos']],
            'amor' => ['nombre' => 'Amor', 'subs' => ['pareja', 'autoamor', 'familia', 'amistades', 'fertilidad']],
            'sanacion' => ['nombre' => 'Sanación', 'subs' => ['emocional', 'generacional', 'fisica', 'trauma', 'duelo']],
            'salud' => ['nombre' => 'Salud', 'subs' => ['fisica', 'mental', 'sueno', 'habitos', 'vitalidad']],
            'sabiduria' => ['nombre' => 'Sabiduría', 'subs' => ['estudios', 'decisiones', 'intuicion', 'creatividad', 'proposito']],
            'conexion_espiritual' => ['nombre' => 'Conexión Espiritual', 'subs' => ['ancestros', 'guias', 'meditacion', 'despertar']],
            'transformacion' => ['nombre' => 'Transformación', 'subs' => ['crisis', 'renacimiento', 'soltar', 'empoderamiento']],
        ];
    }

    public function get_tamanos() {
        return [
            'mini' => ['nombre' => 'Mini', 'cm' => '8-12', 'recreable' => true],
            'mini_especial' => ['nombre' => 'Mini Especial', 'cm' => '12-14', 'recreable' => true],
            'mediano' => ['nombre' => 'Mediano', 'cm' => '15-20', 'recreable' => false],
            'mediano_especial' => ['nombre' => 'Mediano Especial', 'cm' => '20-25', 'recreable' => false],
            'grande' => ['nombre' => 'Grande', 'cm' => '25-30', 'recreable' => false],
            'grande_especial' => ['nombre' => 'Grande Especial', 'cm' => '30-35', 'recreable' => false],
            'gigante' => ['nombre' => 'Gigante', 'cm' => '35+', 'recreable' => false],
        ];
    }

    public function get_personalidades() {
        return [
            'amoroso' => 'Amoroso/a', 'protector' => 'Protector/a', 'sabio' => 'Sabio/a',
            'jugueton' => 'Juguetón/a', 'serio' => 'Serio/a', 'misterioso' => 'Misterioso/a',
            'dulce' => 'Dulce', 'intenso' => 'Intenso/a', 'tranquilo' => 'Tranquilo/a',
            'gruñon' => 'Gruñón/a', 'simpatico' => 'Simpático/a', 'bondadoso' => 'Bondadoso/a',
            'firme' => 'Firme', 'leal' => 'Leal', 'aventurero' => 'Aventurero/a',
            'nostalgico' => 'Nostálgico/a', 'optimista' => 'Optimista', 'rebelde' => 'Rebelde',
        ];
    }

    // ═══════════════════════════════════════════════════════════════════════
    // MENÚ DE ADMINISTRACIÓN Y SETTINGS
    // ═══════════════════════════════════════════════════════════════════════

    public function agregar_menu_admin() {
        add_submenu_page(
            'woocommerce',
            'Guardian Suite',
            '🧚 Guardian Suite',
            'manage_options',
            'duendes-guardian-suite',
            [$this, 'render_pagina_settings']
        );
    }

    public function registrar_settings() {
        register_setting('duendes_guardian_suite', 'duendes_anthropic_api_key');
        register_setting('duendes_guardian_suite', 'duendes_modelo_ia');
    }

    public function render_pagina_settings() {
        $api_key = $this->get_api_key();
        $modelo = get_option('duendes_modelo_ia', 'claude-sonnet-4-20250514');
        $api_status = $this->verificar_api();
        ?>
        <div class="wrap" style="max-width: 800px;">
            <h1>🧚 Duendes Guardian Suite</h1>
            <p style="font-size: 14px; color: #666;">
                Sistema completo para gestionar fichas y historias de guardianes con IA integrada.
            </p>

            <!-- Estado de la API -->
            <div style="background: <?php echo $api_status ? '#d4edda' : '#f8d7da'; ?>;
                        border: 1px solid <?php echo $api_status ? '#c3e6cb' : '#f5c6cb'; ?>;
                        padding: 15px; border-radius: 8px; margin: 20px 0;">
                <strong><?php echo $api_status ? '✅ API Conectada' : '❌ API No Conectada'; ?></strong>
                <?php if (!$api_status): ?>
                    <p style="margin: 5px 0 0;">Configurá tu API Key de Anthropic para habilitar la generación con IA.</p>
                <?php endif; ?>
            </div>

            <form method="post" action="options.php">
                <?php settings_fields('duendes_guardian_suite'); ?>

                <table class="form-table">
                    <tr>
                        <th scope="row">API Key de Anthropic</th>
                        <td>
                            <input type="password" name="duendes_anthropic_api_key"
                                   value="<?php echo esc_attr($api_key); ?>"
                                   class="regular-text" style="width: 400px;">
                            <p class="description">
                                Obtené tu API key en <a href="https://console.anthropic.com/" target="_blank">console.anthropic.com</a>
                            </p>
                        </td>
                    </tr>
                    <tr>
                        <th scope="row">Modelo de IA</th>
                        <td>
                            <select name="duendes_modelo_ia">
                                <option value="claude-sonnet-4-20250514" <?php selected($modelo, 'claude-sonnet-4-20250514'); ?>>
                                    Claude Sonnet 4 (Recomendado)
                                </option>
                                <option value="claude-3-5-sonnet-20241022" <?php selected($modelo, 'claude-3-5-sonnet-20241022'); ?>>
                                    Claude 3.5 Sonnet
                                </option>
                                <option value="claude-3-haiku-20240307" <?php selected($modelo, 'claude-3-haiku-20240307'); ?>>
                                    Claude 3 Haiku (Más rápido/barato)
                                </option>
                            </select>
                        </td>
                    </tr>
                </table>

                <?php submit_button('Guardar Configuración'); ?>
            </form>

            <hr style="margin: 30px 0;">

            <h2>📊 Estadísticas</h2>
            <?php $this->mostrar_estadisticas(); ?>

            <hr style="margin: 30px 0;">

            <h2>📖 Cómo usar</h2>
            <ol style="line-height: 2;">
                <li>Configurá tu API Key de Anthropic arriba</li>
                <li>Andá a editar cualquier producto de WooCommerce</li>
                <li>Buscá el metabox "🧚 Guardian Suite"</li>
                <li>Usá los botones para generar historia y ficha automáticamente</li>
                <li>La ficha aparece en la página del producto como pestaña</li>
            </ol>
        </div>
        <?php
    }

    private function verificar_api() {
        $api_key = $this->get_api_key();
        return !empty($api_key) && strlen($api_key) > 20;
    }

    private function mostrar_estadisticas() {
        global $wpdb;

        // Contar productos con ficha
        $con_ficha = $wpdb->get_var("
            SELECT COUNT(DISTINCT post_id)
            FROM {$wpdb->postmeta}
            WHERE meta_key = '_duendes_ficha'
            AND meta_value != ''
            AND meta_value != 'a:0:{}'
        ");

        // Total productos
        $total = $wpdb->get_var("
            SELECT COUNT(*) FROM {$wpdb->posts}
            WHERE post_type = 'product' AND post_status = 'publish'
        ");

        echo "<p><strong>Productos con ficha:</strong> {$con_ficha} de {$total}</p>";
    }

    // ═══════════════════════════════════════════════════════════════════════
    // LIMPIAR METABOXES VIEJOS
    // ═══════════════════════════════════════════════════════════════════════

    public function limpiar_metaboxes_viejos() {
        $viejos = ['duendes_ficha_guardian', 'duendes_generador_historias', 'duendes_canalizado_meta_box'];
        foreach ($viejos as $id) {
            remove_meta_box($id, 'product', 'normal');
            remove_meta_box($id, 'product', 'side');
            remove_meta_box($id, 'product', 'advanced');
        }
    }

    // ═══════════════════════════════════════════════════════════════════════
    // METABOX PRINCIPAL UNIFICADO
    // ═══════════════════════════════════════════════════════════════════════

    public function agregar_metabox() {
        add_meta_box(
            'duendes_guardian_suite',
            '🧚 Guardian Suite - Ficha + Historia',
            [$this, 'render_metabox'],
            'product',
            'normal',
            'high'
        );
    }

    public function render_metabox($post) {
        wp_nonce_field('duendes_guardian_suite', 'duendes_suite_nonce');

        $ficha = get_post_meta($post->ID, '_duendes_ficha', true) ?: [];
        $product = wc_get_product($post->ID);
        $historia = $product ? $product->get_description() : '';

        $especies = $this->get_especies();
        $categorias = $this->get_categorias();
        $tamanos = $this->get_tamanos();
        $personalidades = $this->get_personalidades();
        $api_ok = $this->verificar_api();
        ?>

        <style>
            .dgs-container { background: #1a1a2e; padding: 20px; border-radius: 12px; color: #fff; }
            .dgs-section { margin-bottom: 20px; padding: 15px; background: rgba(255,255,255,0.05); border-radius: 8px; }
            .dgs-section h3 { margin: 0 0 15px; color: #c9a962; font-size: 15px; border-bottom: 1px solid rgba(201,169,98,0.3); padding-bottom: 8px; }
            .dgs-row { display: flex; gap: 15px; margin-bottom: 12px; flex-wrap: wrap; }
            .dgs-field { flex: 1; min-width: 180px; }
            .dgs-field label { display: block; margin-bottom: 5px; color: #aaa; font-size: 11px; text-transform: uppercase; }
            .dgs-field input, .dgs-field select, .dgs-field textarea {
                width: 100%; padding: 8px 10px; border: 1px solid #333; border-radius: 6px;
                background: #0d0d1a; color: #fff; font-size: 13px;
            }
            .dgs-field input:focus, .dgs-field select:focus, .dgs-field textarea:focus { border-color: #c9a962; outline: none; }
            .dgs-btn {
                background: linear-gradient(135deg, #c9a962, #a08030); color: #1a1a2e;
                border: none; padding: 12px 20px; border-radius: 8px; cursor: pointer;
                font-weight: bold; font-size: 14px; transition: all 0.2s;
            }
            .dgs-btn:hover { transform: translateY(-2px); box-shadow: 0 5px 20px rgba(201,169,98,0.3); }
            .dgs-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
            .dgs-btn-secondary { background: linear-gradient(135deg, #4a9962, #2d7a4a); }
            .dgs-btn-outline { background: transparent; border: 2px solid #c9a962; color: #c9a962; }
            .dgs-checkbox-group { display: flex; flex-wrap: wrap; gap: 6px; }
            .dgs-checkbox-item {
                padding: 5px 10px; background: #0d0d1a; border-radius: 15px; cursor: pointer;
                border: 1px solid #333; font-size: 12px; transition: all 0.2s;
            }
            .dgs-checkbox-item:hover { border-color: #c9a962; }
            .dgs-checkbox-item.selected { background: #c9a962; color: #1a1a2e; border-color: #c9a962; }
            .dgs-checkbox-item input { display: none; }
            .dgs-alert { padding: 10px 15px; border-radius: 6px; margin: 10px 0; font-size: 13px; }
            .dgs-alert-warning { background: rgba(255,193,7,0.2); border: 1px solid rgba(255,193,7,0.3); color: #ffc107; }
            .dgs-alert-success { background: rgba(74,153,98,0.2); border: 1px solid rgba(74,153,98,0.3); color: #4a9962; }
            .dgs-alert-error { background: rgba(220,53,69,0.2); border: 1px solid rgba(220,53,69,0.3); color: #dc3545; }
            .dgs-tabs { display: flex; gap: 5px; margin-bottom: 15px; }
            .dgs-tab { padding: 10px 20px; background: rgba(255,255,255,0.05); border-radius: 8px 8px 0 0; cursor: pointer; border: none; color: #aaa; }
            .dgs-tab.active { background: rgba(201,169,98,0.2); color: #c9a962; }
            .dgs-tab-content { display: none; }
            .dgs-tab-content.active { display: block; }
            .dgs-historia-preview { background: #0d0d1a; padding: 15px; border-radius: 8px; max-height: 200px; overflow-y: auto; font-size: 13px; line-height: 1.6; }
            .dgs-small { font-size: 11px; color: #666; margin-top: 3px; }
        </style>

        <div class="dgs-container">

            <?php if (!$api_ok): ?>
            <div class="dgs-alert dgs-alert-warning">
                ⚠️ <strong>API no configurada.</strong>
                <a href="<?php echo admin_url('admin.php?page=duendes-guardian-suite'); ?>" style="color: #ffc107;">
                    Configurá tu API Key
                </a> para habilitar la generación con IA.
            </div>
            <?php endif; ?>

            <!-- TABS -->
            <div class="dgs-tabs">
                <button type="button" class="dgs-tab active" data-tab="ficha">📋 Ficha del Guardián</button>
                <button type="button" class="dgs-tab" data-tab="historia">📖 Historia</button>
                <button type="button" class="dgs-tab" data-tab="ia">✨ Generar con IA</button>
            </div>

            <!-- TAB: FICHA -->
            <div id="tab-ficha" class="dgs-tab-content active">

                <!-- Datos Básicos -->
                <div class="dgs-section">
                    <h3>Datos Básicos</h3>
                    <div class="dgs-row">
                        <div class="dgs-field" style="max-width: 150px;">
                            <label>Género</label>
                            <select name="duendes_ficha[genero]" id="df_genero">
                                <option value="M" <?php selected($ficha['genero'] ?? '', 'M'); ?>>Masculino</option>
                                <option value="F" <?php selected($ficha['genero'] ?? '', 'F'); ?>>Femenino</option>
                            </select>
                        </div>
                        <div class="dgs-field">
                            <label>Especie</label>
                            <select name="duendes_ficha[especie]" id="df_especie">
                                <option value="">Seleccionar...</option>
                                <optgroup label="Clásicas">
                                <?php foreach ($especies['clasicas'] as $id => $esp): ?>
                                    <option value="<?php echo $id; ?>" <?php selected($ficha['especie'] ?? '', $id); ?>><?php echo $esp['nombre']; ?></option>
                                <?php endforeach; ?>
                                </optgroup>
                                <optgroup label="Exclusivas">
                                <?php foreach ($especies['exclusivas'] as $id => $esp): ?>
                                    <option value="<?php echo $id; ?>" <?php selected($ficha['especie'] ?? '', $id); ?>><?php echo $esp['nombre']; ?></option>
                                <?php endforeach; ?>
                                </optgroup>
                                <optgroup label="Arquetipos">
                                <?php foreach ($especies['arquetipos'] as $id => $esp): ?>
                                    <option value="<?php echo $id; ?>" <?php selected($ficha['especie'] ?? '', $id); ?>><?php echo $esp['nombre']; ?></option>
                                <?php endforeach; ?>
                                </optgroup>
                            </select>
                        </div>
                        <div class="dgs-field">
                            <label>Familia/Estilo</label>
                            <input type="text" name="duendes_ficha[familia]" value="<?php echo esc_attr($ficha['familia'] ?? ''); ?>" placeholder="Ej: Leprechaun">
                        </div>
                    </div>
                    <div class="dgs-row">
                        <div class="dgs-field">
                            <label>Categoría</label>
                            <select name="duendes_ficha[categoria]" id="df_categoria">
                                <option value="">Seleccionar...</option>
                                <?php foreach ($categorias as $id => $cat): ?>
                                    <option value="<?php echo $id; ?>" <?php selected($ficha['categoria'] ?? '', $id); ?>><?php echo $cat['nombre']; ?></option>
                                <?php endforeach; ?>
                            </select>
                        </div>
                        <div class="dgs-field">
                            <label>Tipo Tamaño</label>
                            <select name="duendes_ficha[tipo_tamano]" id="df_tipo_tamano">
                                <option value="">Seleccionar...</option>
                                <?php foreach ($tamanos as $id => $tam): ?>
                                    <option value="<?php echo $id; ?>" <?php selected($ficha['tipo_tamano'] ?? '', $id); ?>>
                                        <?php echo $tam['nombre']; ?> (<?php echo $tam['cm']; ?> cm)
                                    </option>
                                <?php endforeach; ?>
                            </select>
                        </div>
                        <div class="dgs-field" style="max-width: 100px;">
                            <label>Tamaño (cm)</label>
                            <input type="number" name="duendes_ficha[tamano_cm]" id="df_tamano_cm" value="<?php echo esc_attr($ficha['tamano_cm'] ?? ''); ?>" placeholder="25">
                        </div>
                        <div class="dgs-field" style="max-width: 150px;">
                            <label>¿Único?</label>
                            <select name="duendes_ficha[es_unico]" id="df_es_unico">
                                <option value="unico" <?php selected($ficha['es_unico'] ?? '', 'unico'); ?>>Ser Único</option>
                                <option value="recreable" <?php selected($ficha['es_unico'] ?? '', 'recreable'); ?>>Recreable</option>
                            </select>
                        </div>
                    </div>
                </div>

                <!-- Personalidad -->
                <div class="dgs-section">
                    <h3>Personalidad (hasta 3)</h3>
                    <div class="dgs-checkbox-group">
                        <?php
                        $pers_sel = $ficha['personalidad'] ?? [];
                        foreach ($personalidades as $id => $nombre):
                            $checked = in_array($id, $pers_sel);
                        ?>
                            <label class="dgs-checkbox-item <?php echo $checked ? 'selected' : ''; ?>">
                                <input type="checkbox" name="duendes_ficha[personalidad][]" value="<?php echo $id; ?>" <?php checked($checked); ?>>
                                <?php echo $nombre; ?>
                            </label>
                        <?php endforeach; ?>
                    </div>
                </div>

                <!-- Accesorios -->
                <div class="dgs-section">
                    <h3>Accesorios</h3>
                    <div class="dgs-field">
                        <textarea name="duendes_ficha[accesorios]" rows="2" placeholder="Ej: Moneda dorada, capa verde, bastón de roble..."><?php echo esc_textarea($ficha['accesorios'] ?? ''); ?></textarea>
                    </div>
                </div>

                <!-- Ficha Personal IA -->
                <div class="dgs-section">
                    <h3>Ficha Personal (generada por IA)</h3>
                    <div class="dgs-row">
                        <div class="dgs-field">
                            <label>Flor Favorita</label>
                            <input type="text" name="duendes_ficha[flor_favorita]" value="<?php echo esc_attr($ficha['flor_favorita'] ?? ''); ?>">
                        </div>
                        <div class="dgs-field">
                            <label>Piedra/Cristal</label>
                            <input type="text" name="duendes_ficha[piedra_favorita]" value="<?php echo esc_attr($ficha['piedra_favorita'] ?? ''); ?>">
                        </div>
                        <div class="dgs-field">
                            <label>Color Favorito</label>
                            <input type="text" name="duendes_ficha[color_favorito]" value="<?php echo esc_attr($ficha['color_favorito'] ?? ''); ?>">
                        </div>
                    </div>
                    <div class="dgs-row">
                        <div class="dgs-field">
                            <label>Espacio de la Casa</label>
                            <input type="text" name="duendes_ficha[espacio_casa]" value="<?php echo esc_attr($ficha['espacio_casa'] ?? ''); ?>">
                        </div>
                        <div class="dgs-field">
                            <label>Elemento</label>
                            <select name="duendes_ficha[elemento]">
                                <option value="">Seleccionar...</option>
                                <?php foreach (['Fuego', 'Agua', 'Tierra', 'Aire', 'Éter'] as $elem): ?>
                                    <option value="<?php echo $elem; ?>" <?php selected($ficha['elemento'] ?? '', $elem); ?>><?php echo $elem; ?></option>
                                <?php endforeach; ?>
                            </select>
                        </div>
                        <div class="dgs-field">
                            <label>Estación</label>
                            <select name="duendes_ficha[estacion]">
                                <option value="">Seleccionar...</option>
                                <?php foreach (['Primavera', 'Verano', 'Otoño', 'Invierno'] as $est): ?>
                                    <option value="<?php echo $est; ?>" <?php selected($ficha['estacion'] ?? '', $est); ?>><?php echo $est; ?></option>
                                <?php endforeach; ?>
                            </select>
                        </div>
                    </div>
                    <div class="dgs-row">
                        <div class="dgs-field">
                            <label>Momento del Día</label>
                            <input type="text" name="duendes_ficha[momento_dia]" value="<?php echo esc_attr($ficha['momento_dia'] ?? ''); ?>" placeholder="Ej: El amanecer">
                        </div>
                        <div class="dgs-field">
                            <label>¿Le gusta pasear?</label>
                            <select name="duendes_ficha[le_gusta_pasear]">
                                <option value="">Seleccionar...</option>
                                <option value="si" <?php selected($ficha['le_gusta_pasear'] ?? '', 'si'); ?>>Sí, le encanta</option>
                                <option value="no" <?php selected($ficha['le_gusta_pasear'] ?? '', 'no'); ?>>Prefiere quedarse</option>
                                <option value="preguntar" <?php selected($ficha['le_gusta_pasear'] ?? '', 'preguntar'); ?>>Que le pregunte primero</option>
                            </select>
                        </div>
                    </div>
                    <div class="dgs-row">
                        <div class="dgs-field">
                            <label>Qué le gusta (3 cosas)</label>
                            <textarea name="duendes_ficha[le_gusta]" rows="2" placeholder="Separado por comas"><?php echo esc_textarea($ficha['le_gusta'] ?? ''); ?></textarea>
                        </div>
                        <div class="dgs-field">
                            <label>Qué NO le gusta (3 cosas)</label>
                            <textarea name="duendes_ficha[no_le_gusta]" rows="2" placeholder="Separado por comas"><?php echo esc_textarea($ficha['no_le_gusta'] ?? ''); ?></textarea>
                        </div>
                    </div>
                    <div class="dgs-row">
                        <div class="dgs-field">
                            <label>Frase/Lema</label>
                            <input type="text" name="duendes_ficha[frase_lema]" value="<?php echo esc_attr($ficha['frase_lema'] ?? ''); ?>" placeholder="Algo que diría este guardián">
                        </div>
                    </div>
                    <div class="dgs-row">
                        <div class="dgs-field">
                            <label>Dato Curioso (el que hace decir "ayyy es como yo")</label>
                            <textarea name="duendes_ficha[dato_curioso]" rows="2"><?php echo esc_textarea($ficha['dato_curioso'] ?? ''); ?></textarea>
                        </div>
                    </div>
                </div>
            </div>

            <!-- TAB: HISTORIA -->
            <div id="tab-historia" class="dgs-tab-content">
                <div class="dgs-section">
                    <h3>Historia Actual</h3>
                    <?php if (!empty($historia)): ?>
                        <div class="dgs-historia-preview">
                            <?php echo wp_kses_post(wpautop($historia)); ?>
                        </div>
                        <p class="dgs-small" style="margin-top: 10px;">
                            Esta historia está en la descripción del producto. Para editarla, usá el editor de descripción de WooCommerce.
                        </p>
                    <?php else: ?>
                        <div class="dgs-alert dgs-alert-warning">
                            Este producto no tiene historia. Generá una con IA en la pestaña "✨ Generar con IA".
                        </div>
                    <?php endif; ?>
                </div>
            </div>

            <!-- TAB: IA -->
            <div id="tab-ia" class="dgs-tab-content">
                <div class="dgs-section">
                    <h3>Generación con IA</h3>

                    <div style="display: flex; gap: 15px; flex-wrap: wrap; margin-bottom: 20px;">
                        <button type="button" class="dgs-btn dgs-btn-secondary" id="btn-auto-completar" <?php echo !$api_ok ? 'disabled' : ''; ?>>
                            🔄 Auto-completar TODO
                        </button>
                        <button type="button" class="dgs-btn" id="btn-solo-ficha-ia" <?php echo !$api_ok ? 'disabled' : ''; ?>>
                            ✨ Solo Ficha IA
                        </button>
                        <button type="button" class="dgs-btn dgs-btn-outline" id="btn-generar-historia" <?php echo !$api_ok ? 'disabled' : ''; ?>>
                            📖 Generar Historia
                        </button>
                    </div>

                    <div class="dgs-small">
                        <strong>Auto-completar TODO:</strong> Infiere datos básicos + genera ficha IA (necesita historia)<br>
                        <strong>Solo Ficha IA:</strong> Genera solo la personalidad (flor, piedra, gustos...)<br>
                        <strong>Generar Historia:</strong> Crea una historia para el producto
                    </div>

                    <div id="ia-resultado" style="margin-top: 15px;"></div>
                </div>

                <!-- Generador de Historia -->
                <div class="dgs-section" id="seccion-generar-historia" style="display: none;">
                    <h3>📖 Generar Historia</h3>

                    <div class="dgs-row">
                        <div class="dgs-field">
                            <label>Contexto adicional (opcional)</label>
                            <textarea id="historia-contexto" rows="3" placeholder="Contá algo sobre este guardián que quieras incluir en la historia..."></textarea>
                        </div>
                    </div>

                    <div class="dgs-row">
                        <div class="dgs-field" style="max-width: 200px;">
                            <label>Largo de la historia</label>
                            <select id="historia-largo">
                                <option value="corta">Corta (~150 palabras)</option>
                                <option value="media" selected>Media (~250 palabras)</option>
                                <option value="larga">Larga (~400 palabras)</option>
                            </select>
                        </div>
                    </div>

                    <button type="button" class="dgs-btn" id="btn-ejecutar-historia">
                        ✨ Generar Historia Ahora
                    </button>

                    <div id="historia-preview" style="margin-top: 15px;"></div>
                </div>
            </div>

            <div id="dgs-mensaje-guardado" style="display: none; margin-top: 15px;"></div>
        </div>

        <script>
        jQuery(document).ready(function($) {
            var postId = <?php echo $post->ID; ?>;
            var ajaxurl = '<?php echo admin_url('admin-ajax.php'); ?>';
            var nonce = '<?php echo wp_create_nonce('duendes_guardian_suite'); ?>';

            // Tabs
            $('.dgs-tab').click(function() {
                $('.dgs-tab').removeClass('active');
                $(this).addClass('active');
                $('.dgs-tab-content').removeClass('active');
                $('#tab-' + $(this).data('tab')).addClass('active');
            });

            // Checkboxes de personalidad
            $('.dgs-checkbox-item').click(function(e) {
                if (e.target.tagName !== 'INPUT') {
                    var checkbox = $(this).find('input');
                    var selected = $('.dgs-checkbox-item.selected').length;

                    if (checkbox.is(':checked')) {
                        checkbox.prop('checked', false);
                        $(this).removeClass('selected');
                    } else if (selected < 3) {
                        checkbox.prop('checked', true);
                        $(this).addClass('selected');
                    } else {
                        alert('Máximo 3 rasgos de personalidad');
                    }
                }
            });

            // Inferir tipo de tamaño desde cm
            $('#df_tamano_cm').on('change', function() {
                var cm = parseInt($(this).val()) || 0;
                var tipo = '';
                if (cm <= 12) tipo = 'mini';
                else if (cm <= 14) tipo = 'mini_especial';
                else if (cm <= 20) tipo = 'mediano';
                else if (cm <= 25) tipo = 'mediano_especial';
                else if (cm <= 30) tipo = 'grande';
                else if (cm <= 35) tipo = 'grande_especial';
                else tipo = 'gigante';
                $('#df_tipo_tamano').val(tipo);
            });

            // Recoger datos del formulario
            function recogerDatos() {
                var ficha = {
                    genero: $('#df_genero').val(),
                    especie: $('#df_especie').val(),
                    familia: $('input[name="duendes_ficha[familia]"]').val(),
                    categoria: $('#df_categoria').val(),
                    tipo_tamano: $('#df_tipo_tamano').val(),
                    tamano_cm: $('#df_tamano_cm').val(),
                    es_unico: $('#df_es_unico').val(),
                    accesorios: $('textarea[name="duendes_ficha[accesorios]"]').val(),
                    flor_favorita: $('input[name="duendes_ficha[flor_favorita]"]').val(),
                    piedra_favorita: $('input[name="duendes_ficha[piedra_favorita]"]').val(),
                    color_favorito: $('input[name="duendes_ficha[color_favorito]"]').val(),
                    espacio_casa: $('input[name="duendes_ficha[espacio_casa]"]').val(),
                    elemento: $('select[name="duendes_ficha[elemento]"]').val(),
                    estacion: $('select[name="duendes_ficha[estacion]"]').val(),
                    momento_dia: $('input[name="duendes_ficha[momento_dia]"]').val(),
                    le_gusta_pasear: $('select[name="duendes_ficha[le_gusta_pasear]"]').val(),
                    le_gusta: $('textarea[name="duendes_ficha[le_gusta]"]').val(),
                    no_le_gusta: $('textarea[name="duendes_ficha[no_le_gusta]"]').val(),
                    frase_lema: $('input[name="duendes_ficha[frase_lema]"]').val(),
                    dato_curioso: $('textarea[name="duendes_ficha[dato_curioso]"]').val(),
                    personalidad: []
                };
                $('.dgs-checkbox-item.selected input').each(function() {
                    ficha.personalidad.push($(this).val());
                });
                return ficha;
            }

            // Llenar campos desde respuesta IA
            function llenarCampos(data) {
                if (data.datosBasicos) {
                    var db = data.datosBasicos;
                    if (db.genero) $('#df_genero').val(db.genero);
                    if (db.especie) $('#df_especie').val(db.especie);
                    if (db.familia) $('input[name="duendes_ficha[familia]"]').val(db.familia);
                    if (db.categoria) $('#df_categoria').val(db.categoria);
                    if (db.tipo_tamano) $('#df_tipo_tamano').val(db.tipo_tamano);
                    if (db.tamano_cm) $('#df_tamano_cm').val(db.tamano_cm);
                    if (db.es_unico) $('#df_es_unico').val(db.es_unico);
                    if (db.accesorios) $('textarea[name="duendes_ficha[accesorios]"]').val(db.accesorios);
                }
                if (data.fichaIA) {
                    var f = data.fichaIA;
                    if (f.flor_favorita) $('input[name="duendes_ficha[flor_favorita]"]').val(f.flor_favorita);
                    if (f.piedra_favorita) $('input[name="duendes_ficha[piedra_favorita]"]').val(f.piedra_favorita);
                    if (f.color_favorito) $('input[name="duendes_ficha[color_favorito]"]').val(f.color_favorito);
                    if (f.espacio_casa) $('input[name="duendes_ficha[espacio_casa]"]').val(f.espacio_casa);
                    if (f.elemento) $('select[name="duendes_ficha[elemento]"]').val(f.elemento);
                    if (f.estacion) $('select[name="duendes_ficha[estacion]"]').val(f.estacion);
                    if (f.momento_dia) $('input[name="duendes_ficha[momento_dia]"]').val(f.momento_dia);

                    var paseoMap = {'Sí, le encanta': 'si', 'No, prefiere quedarse': 'no', 'Que le pregunte primero': 'preguntar'};
                    var paseoVal = paseoMap[f.le_gusta_pasear] || f.le_gusta_pasear || '';
                    if (paseoVal) $('select[name="duendes_ficha[le_gusta_pasear]"]').val(paseoVal);

                    var leGusta = Array.isArray(f.le_gusta) ? f.le_gusta.join(', ') : (f.le_gusta || '');
                    var noLeGusta = Array.isArray(f.no_le_gusta) ? f.no_le_gusta.join(', ') : (f.no_le_gusta || '');
                    $('textarea[name="duendes_ficha[le_gusta]"]').val(leGusta);
                    $('textarea[name="duendes_ficha[no_le_gusta]"]').val(noLeGusta);
                    if (f.frase_lema) $('input[name="duendes_ficha[frase_lema]"]').val(f.frase_lema);
                    if (f.dato_curioso) $('textarea[name="duendes_ficha[dato_curioso]"]').val(f.dato_curioso);
                }
            }

            // Guardar via AJAX
            function guardarFicha(callback) {
                $.ajax({
                    url: ajaxurl,
                    type: 'POST',
                    data: {
                        action: 'duendes_guardar_ficha_ajax',
                        post_id: postId,
                        nonce: nonce,
                        ficha: recogerDatos()
                    },
                    success: function(r) { if (callback) callback(r.success); },
                    error: function() { if (callback) callback(false); }
                });
            }

            // Mostrar mensaje
            function mostrarMensaje(tipo, texto) {
                var clase = tipo === 'success' ? 'dgs-alert-success' : (tipo === 'error' ? 'dgs-alert-error' : 'dgs-alert-warning');
                $('#ia-resultado').html('<div class="dgs-alert ' + clase + '">' + texto + '</div>');
            }

            // AUTO-COMPLETAR TODO
            $('#btn-auto-completar').click(function() {
                var btn = $(this);
                btn.prop('disabled', true).text('Procesando...');

                $.ajax({
                    url: ajaxurl,
                    type: 'POST',
                    data: { action: 'duendes_auto_completar', post_id: postId, nonce: nonce },
                    success: function(r) {
                        if (r.success && r.data) {
                            llenarCampos(r.data);
                            btn.text('Guardando...');
                            guardarFicha(function(ok) {
                                if (ok) {
                                    mostrarMensaje('success', '✅ Ficha completada y guardada correctamente');
                                    $('.dgs-tab[data-tab="ficha"]').click();
                                } else {
                                    mostrarMensaje('error', '❌ Error al guardar');
                                }
                                btn.prop('disabled', false).text('🔄 Auto-completar TODO');
                            });
                        } else {
                            mostrarMensaje('error', '❌ ' + (r.data?.error || 'Error desconocido'));
                            btn.prop('disabled', false).text('🔄 Auto-completar TODO');
                        }
                    },
                    error: function() {
                        mostrarMensaje('error', '❌ Error de conexión');
                        btn.prop('disabled', false).text('🔄 Auto-completar TODO');
                    }
                });
            });

            // SOLO FICHA IA
            $('#btn-solo-ficha-ia').click(function() {
                var btn = $(this);
                btn.prop('disabled', true).text('Generando...');

                $.ajax({
                    url: ajaxurl,
                    type: 'POST',
                    data: { action: 'duendes_generar_ficha_ia', post_id: postId, nonce: nonce },
                    success: function(r) {
                        if (r.success && r.data?.ficha) {
                            llenarCampos({ fichaIA: r.data.ficha });
                            btn.text('Guardando...');
                            guardarFicha(function(ok) {
                                if (ok) {
                                    mostrarMensaje('success', '✅ Ficha IA generada y guardada');
                                    $('.dgs-tab[data-tab="ficha"]').click();
                                } else {
                                    mostrarMensaje('error', '❌ Error al guardar');
                                }
                                btn.prop('disabled', false).text('✨ Solo Ficha IA');
                            });
                        } else {
                            mostrarMensaje('error', '❌ ' + (r.data?.error || 'Error generando ficha'));
                            btn.prop('disabled', false).text('✨ Solo Ficha IA');
                        }
                    },
                    error: function() {
                        mostrarMensaje('error', '❌ Error de conexión');
                        btn.prop('disabled', false).text('✨ Solo Ficha IA');
                    }
                });
            });

            // GENERAR HISTORIA - Mostrar formulario
            $('#btn-generar-historia').click(function() {
                $('#seccion-generar-historia').slideToggle();
            });

            // EJECUTAR GENERACIÓN DE HISTORIA
            $('#btn-ejecutar-historia').click(function() {
                var btn = $(this);
                btn.prop('disabled', true).text('Generando historia...');

                $.ajax({
                    url: ajaxurl,
                    type: 'POST',
                    data: {
                        action: 'duendes_generar_historia',
                        post_id: postId,
                        nonce: nonce,
                        contexto: $('#historia-contexto').val(),
                        largo: $('#historia-largo').val(),
                        ficha: recogerDatos()
                    },
                    success: function(r) {
                        if (r.success && r.data?.historia) {
                            $('#historia-preview').html(
                                '<div class="dgs-alert dgs-alert-success">' +
                                '<strong>Historia generada:</strong><br><br>' +
                                r.data.historia.replace(/\n/g, '<br>') +
                                '<br><br><button type="button" class="dgs-btn" id="btn-guardar-historia">📝 Guardar como descripción</button>' +
                                '</div>'
                            );

                            $('#btn-guardar-historia').click(function() {
                                // Guardar historia en la descripción del producto via AJAX
                                $.ajax({
                                    url: ajaxurl,
                                    type: 'POST',
                                    data: {
                                        action: 'duendes_guardar_historia',
                                        post_id: postId,
                                        nonce: nonce,
                                        historia: r.data.historia
                                    },
                                    success: function(r2) {
                                        if (r2.success) {
                                            mostrarMensaje('success', '✅ Historia guardada en la descripción del producto');
                                            location.reload();
                                        } else {
                                            mostrarMensaje('error', '❌ Error al guardar historia');
                                        }
                                    }
                                });
                            });
                        } else {
                            $('#historia-preview').html('<div class="dgs-alert dgs-alert-error">❌ ' + (r.data?.error || 'Error') + '</div>');
                        }
                        btn.prop('disabled', false).text('✨ Generar Historia Ahora');
                    },
                    error: function() {
                        $('#historia-preview').html('<div class="dgs-alert dgs-alert-error">❌ Error de conexión</div>');
                        btn.prop('disabled', false).text('✨ Generar Historia Ahora');
                    }
                });
            });
        });
        </script>
        <?php
    }

    // ═══════════════════════════════════════════════════════════════════════
    // GUARDAR FICHA
    // ═══════════════════════════════════════════════════════════════════════

    public function guardar_ficha($post_id) {
        if (!isset($_POST['duendes_suite_nonce']) || !wp_verify_nonce($_POST['duendes_suite_nonce'], 'duendes_guardian_suite')) {
            return;
        }
        if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) return;
        if (!current_user_can('edit_post', $post_id)) return;

        if (isset($_POST['duendes_ficha'])) {
            $ficha_existente = get_post_meta($post_id, '_duendes_ficha', true) ?: [];

            $ficha_nueva = array_map(function($v) {
                if (is_array($v)) return array_map('sanitize_text_field', $v);
                return sanitize_text_field($v);
            }, $_POST['duendes_ficha']);

            // Merge: solo sobrescribir campos con valor
            foreach ($ficha_nueva as $key => $valor) {
                if ($valor !== '' && $valor !== null && (!is_array($valor) || !empty($valor))) {
                    $ficha_existente[$key] = $valor;
                }
            }

            update_post_meta($post_id, '_duendes_ficha', $ficha_existente);
        }
    }

    // ═══════════════════════════════════════════════════════════════════════
    // AJAX HANDLERS
    // ═══════════════════════════════════════════════════════════════════════

    public function ajax_guardar_ficha() {
        check_ajax_referer('duendes_guardian_suite', 'nonce');

        $post_id = intval($_POST['post_id']);
        if (!current_user_can('edit_post', $post_id)) {
            wp_send_json_error(['error' => 'Sin permisos']);
        }

        $ficha = isset($_POST['ficha']) ? $_POST['ficha'] : [];
        $ficha_limpia = [];
        foreach ($ficha as $key => $value) {
            if (is_array($value)) {
                $ficha_limpia[$key] = array_map('sanitize_text_field', $value);
            } else {
                $ficha_limpia[$key] = sanitize_text_field($value);
            }
        }

        update_post_meta($post_id, '_duendes_ficha', $ficha_limpia);
        wp_send_json_success(['message' => 'Ficha guardada']);
    }

    public function ajax_auto_completar() {
        check_ajax_referer('duendes_guardian_suite', 'nonce');

        $post_id = intval($_POST['post_id']);
        $product = wc_get_product($post_id);

        if (!$product) {
            wp_send_json_error(['error' => 'Producto no encontrado']);
        }

        $nombre = $product->get_name();
        $historia = $product->get_description();
        $ficha_existente = get_post_meta($post_id, '_duendes_ficha', true) ?: [];

        // Inferir datos básicos del nombre
        $nombre_lower = strtolower($nombre);

        $genero = 'M';
        if (strpos($nombre_lower, 'pixie') !== false || preg_match('/(a|ina)$/i', $nombre)) {
            $genero = 'F';
        }

        $especie = 'duende';
        if (strpos($nombre_lower, 'pixie') !== false) $especie = 'pixie';
        elseif (strpos($nombre_lower, 'vikingo') !== false || strpos($nombre_lower, 'vikinga') !== false) $especie = 'vikingo';
        elseif (strpos($nombre_lower, 'bruja') !== false || strpos($nombre_lower, 'brujo') !== false) $especie = 'bruja';
        elseif (strpos($nombre_lower, 'hada') !== false) $especie = 'hada';
        elseif (strpos($nombre_lower, 'elfo') !== false || strpos($nombre_lower, 'elfa') !== false) $especie = 'elfo';
        elseif (strpos($nombre_lower, 'merlin') !== false) $especie = 'merlin';
        elseif (strpos($nombre_lower, 'morgana') !== false) $especie = 'morgana';

        // Inferir categoría y tamaño de la historia
        $categoria = 'proteccion';
        $tamano_cm = null;

        if ($historia) {
            $historia_lower = strtolower($historia);
            if (strpos($historia_lower, 'abundancia') !== false || strpos($historia_lower, 'prosperidad') !== false) $categoria = 'abundancia';
            elseif (strpos($historia_lower, 'amor') !== false) $categoria = 'amor';
            elseif (strpos($historia_lower, 'sanación') !== false || strpos($historia_lower, 'sanar') !== false) $categoria = 'sanacion';
            elseif (strpos($historia_lower, 'sabiduría') !== false) $categoria = 'sabiduria';

            if (preg_match('/(\d{1,2})\s*(?:centímetros|centimetros|cm)/i', $historia, $m)) {
                $tamano_cm = intval($m[1]);
            }
        }

        // Determinar tipo de tamaño
        $tipo_tamano = 'mediano';
        if ($tamano_cm) {
            if ($tamano_cm <= 12) $tipo_tamano = 'mini';
            elseif ($tamano_cm <= 14) $tipo_tamano = 'mini_especial';
            elseif ($tamano_cm <= 20) $tipo_tamano = 'mediano';
            elseif ($tamano_cm <= 25) $tipo_tamano = 'mediano_especial';
            elseif ($tamano_cm <= 30) $tipo_tamano = 'grande';
            else $tipo_tamano = 'gigante';
        }

        $datosBasicos = [
            'genero' => $ficha_existente['genero'] ?? $genero,
            'especie' => $ficha_existente['especie'] ?? $especie,
            'familia' => $ficha_existente['familia'] ?? '',
            'categoria' => $ficha_existente['categoria'] ?? $categoria,
            'tipo_tamano' => $ficha_existente['tipo_tamano'] ?? $tipo_tamano,
            'tamano_cm' => $ficha_existente['tamano_cm'] ?? $tamano_cm,
            'es_unico' => $ficha_existente['es_unico'] ?? ($especie === 'pixie' ? 'unico' : ($tipo_tamano === 'mini' ? 'recreable' : 'unico')),
            'accesorios' => $ficha_existente['accesorios'] ?? ''
        ];

        // Generar ficha IA si hay historia
        $fichaIA = null;
        if (!empty($historia)) {
            $fichaIA = $this->generar_ficha_con_anthropic($nombre, $historia, $datosBasicos);
        }

        wp_send_json_success([
            'datosBasicos' => $datosBasicos,
            'fichaIA' => $fichaIA,
            'mensaje' => $fichaIA ? 'Datos inferidos + Ficha IA generada' : 'Datos inferidos (sin historia para ficha IA)'
        ]);
    }

    public function ajax_generar_ficha_ia() {
        check_ajax_referer('duendes_guardian_suite', 'nonce');

        $post_id = intval($_POST['post_id']);
        $product = wc_get_product($post_id);

        if (!$product) {
            wp_send_json_error(['error' => 'Producto no encontrado']);
        }

        $historia = $product->get_description();
        if (empty($historia)) {
            wp_send_json_error(['error' => 'El producto no tiene historia. Generá una primero.']);
        }

        $nombre = $product->get_name();
        $ficha = get_post_meta($post_id, '_duendes_ficha', true) ?: [];

        $fichaIA = $this->generar_ficha_con_anthropic($nombre, $historia, $ficha);

        if ($fichaIA) {
            wp_send_json_success(['ficha' => $fichaIA]);
        } else {
            wp_send_json_error(['error' => 'Error generando ficha con IA']);
        }
    }

    public function ajax_generar_historia() {
        check_ajax_referer('duendes_guardian_suite', 'nonce');

        $post_id = intval($_POST['post_id']);
        $product = wc_get_product($post_id);

        if (!$product) {
            wp_send_json_error(['error' => 'Producto no encontrado']);
        }

        $nombre = $product->get_name();
        $contexto = sanitize_textarea_field($_POST['contexto'] ?? '');
        $largo = sanitize_text_field($_POST['largo'] ?? 'media');
        $ficha = isset($_POST['ficha']) ? $_POST['ficha'] : [];

        $historia = $this->generar_historia_con_anthropic($nombre, $ficha, $contexto, $largo);

        if ($historia) {
            wp_send_json_success(['historia' => $historia]);
        } else {
            wp_send_json_error(['error' => 'Error generando historia']);
        }
    }

    // ═══════════════════════════════════════════════════════════════════════
    // ANTHROPIC API
    // ═══════════════════════════════════════════════════════════════════════

    private function llamar_anthropic($prompt, $max_tokens = 1024) {
        $api_key = $this->get_api_key();
        if (empty($api_key)) {
            error_log('[Guardian Suite] API Key no configurada');
            return null;
        }

        $modelo = get_option('duendes_modelo_ia', 'claude-sonnet-4-20250514');

        $response = wp_remote_post('https://api.anthropic.com/v1/messages', [
            'timeout' => 120,
            'headers' => [
                'Content-Type' => 'application/json',
                'x-api-key' => $api_key,
                'anthropic-version' => '2023-06-01'
            ],
            'body' => json_encode([
                'model' => $modelo,
                'max_tokens' => $max_tokens,
                'messages' => [['role' => 'user', 'content' => $prompt]]
            ])
        ]);

        if (is_wp_error($response)) {
            error_log('[Guardian Suite] Error API: ' . $response->get_error_message());
            return null;
        }

        $body = json_decode(wp_remote_retrieve_body($response), true);

        if (!isset($body['content'][0]['text'])) {
            error_log('[Guardian Suite] Respuesta inesperada: ' . print_r($body, true));
            return null;
        }

        return $body['content'][0]['text'];
    }

    private function generar_ficha_con_anthropic($nombre, $historia, $ficha) {
        $especie = $ficha['especie'] ?? 'duende';
        $categoria = $ficha['categoria'] ?? 'proteccion';
        $genero = ($ficha['genero'] ?? 'M') === 'F' ? 'Femenino' : 'Masculino';
        $tamano = $ficha['tamano_cm'] ?? '?';
        $accesorios = $ficha['accesorios'] ?? 'No especificados';

        $prompt = "Sos un experto en crear fichas de personalidad para guardianes místicos de \"Duendes del Uruguay\".

GUARDIÁN:
- Nombre: {$nombre}
- Especie: {$especie}
- Categoría: {$categoria}
- Género: {$genero}
- Tamaño: {$tamano} cm
- Accesorios: {$accesorios}

HISTORIA:
{$historia}

INSTRUCCIONES:
Generá una ficha COHERENTE con la historia y personalidad. Que sea ESPECÍFICA para este guardián, no genérica.

FORMATO JSON EXACTO:
{
  \"flor_favorita\": \"nombre de la flor\",
  \"piedra_favorita\": \"nombre del cristal/piedra\",
  \"color_favorito\": \"color específico\",
  \"espacio_casa\": \"lugar de la casa\",
  \"elemento\": \"Fuego|Agua|Tierra|Aire|Éter\",
  \"estacion\": \"Primavera|Verano|Otoño|Invierno\",
  \"momento_dia\": \"momento específico\",
  \"le_gusta_pasear\": \"Sí, le encanta|No, prefiere quedarse|Que le pregunte primero\",
  \"le_gusta\": [\"cosa1\", \"cosa2\", \"cosa3\"],
  \"no_le_gusta\": [\"cosa1\", \"cosa2\", \"cosa3\"],
  \"frase_lema\": \"frase que diría este guardián\",
  \"dato_curioso\": \"algo único que hace decir 'ayyy es como yo'\"
}

Respondé SOLO con el JSON.";

        $texto = $this->llamar_anthropic($prompt);
        if (!$texto) return null;

        if (preg_match('/\{[\s\S]*\}/', $texto, $matches)) {
            $fichaIA = json_decode($matches[0], true);
            if ($fichaIA) {
                if (!is_array($fichaIA['le_gusta'] ?? null)) {
                    $fichaIA['le_gusta'] = [$fichaIA['le_gusta'] ?? ''];
                }
                if (!is_array($fichaIA['no_le_gusta'] ?? null)) {
                    $fichaIA['no_le_gusta'] = [$fichaIA['no_le_gusta'] ?? ''];
                }
                return $fichaIA;
            }
        }

        return null;
    }

    private function generar_historia_con_anthropic($nombre, $ficha, $contexto, $largo) {
        $especie = $ficha['especie'] ?? 'duende';
        $categoria = $ficha['categoria'] ?? 'proteccion';
        $genero = ($ficha['genero'] ?? 'M') === 'F' ? 'Femenino' : 'Masculino';
        $tamano = $ficha['tamano_cm'] ?? '';
        $accesorios = $ficha['accesorios'] ?? '';

        $palabras = ['corta' => 150, 'media' => 250, 'larga' => 400];
        $num_palabras = $palabras[$largo] ?? 250;

        $categorias = $this->get_categorias();
        $cat_nombre = $categorias[$categoria]['nombre'] ?? 'Protección';

        $prompt = "Escribí una historia para un guardián místico de \"Duendes del Uruguay\".

DATOS DEL GUARDIÁN:
- Nombre: {$nombre}
- Especie: {$especie}
- Categoría: {$cat_nombre}
- Género: {$genero}
" . ($tamano ? "- Tamaño: {$tamano} cm\n" : "") . "
" . ($accesorios ? "- Accesorios: {$accesorios}\n" : "") . "
" . ($contexto ? "CONTEXTO ADICIONAL:\n{$contexto}\n" : "") . "

INSTRUCCIONES:
1. La historia debe conectar emocionalmente con quien la lee
2. NO uses frases genéricas de IA como \"desde tiempos inmemoriales\", \"brumas ancestrales\", etc.
3. La primera frase debe generar impacto emocional inmediato
4. Incluí UN sincrodestino sutil (algo que pasó mientras se creaba el guardián)
5. La historia debe reflejar la categoría ({$cat_nombre})
6. Escribí en segunda persona, hablándole al futuro dueño
7. Aproximadamente {$num_palabras} palabras

Escribí SOLO la historia, sin explicaciones.";

        return $this->llamar_anthropic($prompt, 2000);
    }

    // ═══════════════════════════════════════════════════════════════════════
    // FRONTEND: SUBTÍTULO Y TAB
    // ═══════════════════════════════════════════════════════════════════════

    public function mostrar_subtitulo() {
        global $product;
        $ficha = get_post_meta($product->get_id(), '_duendes_ficha', true);
        if (!$ficha || empty($ficha['especie'])) return;

        $especies = $this->get_especies();
        $categorias = $this->get_categorias();

        $genero = $ficha['genero'] ?? 'M';
        $titulo = ($genero === 'F') ? 'GUARDIANA' : 'GUARDIÁN';

        $especie_id = $ficha['especie'];
        $especie_nombre = '';
        foreach (['clasicas', 'exclusivas', 'arquetipos'] as $grupo) {
            if (isset($especies[$grupo][$especie_id])) {
                $esp = $especies[$grupo][$especie_id];
                $especie_nombre = ($genero === 'F' && isset($esp['fem'])) ? strtoupper($esp['fem']) : strtoupper($esp['nombre']);
                break;
            }
        }

        if (!empty($ficha['familia'])) {
            $especie_nombre = strtoupper($ficha['familia']);
        }

        $cat_id = $ficha['categoria'] ?? '';
        $cat_nombre = isset($categorias[$cat_id]) ? strtoupper($categorias[$cat_id]['nombre']) : '';

        $partes = array_filter([$titulo, $especie_nombre, $cat_nombre]);
        $subtitulo = implode(' · ', $partes);

        echo '<div class="duendes-subtitulo" style="color: #c9a962; font-size: 13px; letter-spacing: 2px; margin-bottom: 15px; font-weight: 500;">' . esc_html($subtitulo) . '</div>';
    }

    public function agregar_tab_ficha($tabs) {
        global $product;
        $ficha = get_post_meta($product->get_id(), '_duendes_ficha', true);
        if (!$ficha || empty($ficha['especie'])) return $tabs;

        $tabs['ficha_guardian'] = [
            'title' => 'Ficha del Guardián',
            'priority' => 15,
            'callback' => [$this, 'render_tab_ficha']
        ];

        return $tabs;
    }

    public function render_tab_ficha() {
        global $product;
        $ficha = get_post_meta($product->get_id(), '_duendes_ficha', true);
        $especies = $this->get_especies();
        $categorias = $this->get_categorias();
        $tamanos = $this->get_tamanos();
        $personalidades = $this->get_personalidades();

        $genero = $ficha['genero'] ?? 'M';
        $especie_id = $ficha['especie'] ?? '';
        $especie_info = null;
        foreach (['clasicas', 'exclusivas', 'arquetipos'] as $grupo) {
            if (isset($especies[$grupo][$especie_id])) {
                $especie_info = $especies[$grupo][$especie_id];
                break;
            }
        }

        $tipo_tamano = $ficha['tipo_tamano'] ?? '';
        $es_unico = $ficha['es_unico'] ?? 'unico';
        if ($especie_id === 'pixie') $es_unico = 'unico';
        ?>
        <style>
            .df-container { background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); padding: 30px; border-radius: 16px; color: #fff; }
            .df-header { text-align: center; margin-bottom: 25px; padding-bottom: 20px; border-bottom: 1px solid rgba(201,169,98,0.3); }
            .df-header h3 { color: #c9a962; font-size: 22px; margin: 0 0 10px; }
            .df-badge { display: inline-block; padding: 5px 15px; border-radius: 20px; font-size: 11px; font-weight: bold; letter-spacing: 1px; }
            .df-badge.unico { background: #c9a962; color: #1a1a2e; }
            .df-badge.recreable { background: #4a9962; color: #fff; }
            .df-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 15px; }
            .df-item { background: rgba(255,255,255,0.05); padding: 12px 15px; border-radius: 10px; }
            .df-label { color: #c9a962; font-size: 10px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px; }
            .df-value { color: #fff; font-size: 15px; }
            .df-frase { text-align: center; font-style: italic; font-size: 17px; color: #c9a962; margin: 25px 0; padding: 20px; }
            .df-curioso { background: rgba(255,255,255,0.03); padding: 15px 20px; border-radius: 10px; margin-top: 20px; }
            .df-curioso-title { color: #c9a962; font-size: 13px; margin-bottom: 8px; }
            .df-especie-desc { background: rgba(201,169,98,0.1); padding: 15px 20px; border-radius: 10px; margin-top: 20px; border-left: 3px solid #c9a962; }
        </style>

        <div class="df-container">
            <div class="df-header">
                <h3>Conocé a <?php echo esc_html($product->get_name()); ?></h3>
                <span class="df-badge <?php echo $es_unico === 'unico' ? 'unico' : 'recreable'; ?>">
                    <?php echo $es_unico === 'unico' ? 'SER ÚNICO' : 'SER RECREABLE'; ?>
                </span>
            </div>

            <div class="df-grid">
                <?php if ($especie_info): ?>
                <div class="df-item">
                    <div class="df-label">Especie</div>
                    <div class="df-value"><?php echo ($genero === 'F' && isset($especie_info['fem'])) ? $especie_info['fem'] : $especie_info['nombre']; ?></div>
                </div>
                <?php endif; ?>

                <?php if (!empty($ficha['tipo_tamano']) && !empty($ficha['tamano_cm'])): ?>
                <div class="df-item">
                    <div class="df-label">Tamaño</div>
                    <div class="df-value"><?php echo esc_html($tamanos[$ficha['tipo_tamano']]['nombre'] ?? ''); ?> (<?php echo esc_html($ficha['tamano_cm']); ?> cm)</div>
                </div>
                <?php endif; ?>

                <?php if (!empty($ficha['personalidad'])): ?>
                <div class="df-item">
                    <div class="df-label">Personalidad</div>
                    <div class="df-value">
                        <?php
                        $rasgos = array_map(function($p) use ($personalidades) {
                            return $personalidades[$p] ?? $p;
                        }, $ficha['personalidad']);
                        echo esc_html(implode(', ', $rasgos));
                        ?>
                    </div>
                </div>
                <?php endif; ?>

                <?php if (!empty($ficha['elemento'])): ?>
                <div class="df-item">
                    <div class="df-label">Elemento</div>
                    <div class="df-value"><?php echo esc_html($ficha['elemento']); ?></div>
                </div>
                <?php endif; ?>

                <?php if (!empty($ficha['flor_favorita'])): ?>
                <div class="df-item">
                    <div class="df-label">Flor Favorita</div>
                    <div class="df-value"><?php echo esc_html($ficha['flor_favorita']); ?></div>
                </div>
                <?php endif; ?>

                <?php if (!empty($ficha['piedra_favorita'])): ?>
                <div class="df-item">
                    <div class="df-label">Cristal Favorito</div>
                    <div class="df-value"><?php echo esc_html($ficha['piedra_favorita']); ?></div>
                </div>
                <?php endif; ?>

                <?php if (!empty($ficha['color_favorito'])): ?>
                <div class="df-item">
                    <div class="df-label">Color Favorito</div>
                    <div class="df-value"><?php echo esc_html($ficha['color_favorito']); ?></div>
                </div>
                <?php endif; ?>

                <?php if (!empty($ficha['espacio_casa'])): ?>
                <div class="df-item">
                    <div class="df-label">Espacio de la Casa</div>
                    <div class="df-value"><?php echo esc_html($ficha['espacio_casa']); ?></div>
                </div>
                <?php endif; ?>

                <?php if (!empty($ficha['momento_dia'])): ?>
                <div class="df-item">
                    <div class="df-label">Momento del Día</div>
                    <div class="df-value"><?php echo esc_html($ficha['momento_dia']); ?></div>
                </div>
                <?php endif; ?>

                <?php if (!empty($ficha['estacion'])): ?>
                <div class="df-item">
                    <div class="df-label">Estación Favorita</div>
                    <div class="df-value"><?php echo esc_html($ficha['estacion']); ?></div>
                </div>
                <?php endif; ?>

                <?php if (!empty($ficha['le_gusta_pasear'])): ?>
                <div class="df-item">
                    <div class="df-label">¿Le gusta pasear?</div>
                    <div class="df-value">
                        <?php
                        $paseo = ['si' => 'Sí, le encanta', 'no' => 'Prefiere quedarse', 'preguntar' => 'Que le pregunte primero'];
                        echo esc_html($paseo[$ficha['le_gusta_pasear']] ?? '');
                        ?>
                    </div>
                </div>
                <?php endif; ?>
            </div>

            <?php if (!empty($ficha['le_gusta'])): ?>
            <div class="df-item" style="margin-top: 15px;">
                <div class="df-label">Lo que le gusta</div>
                <div class="df-value"><?php echo esc_html($ficha['le_gusta']); ?></div>
            </div>
            <?php endif; ?>

            <?php if (!empty($ficha['no_le_gusta'])): ?>
            <div class="df-item" style="margin-top: 10px;">
                <div class="df-label">Lo que no le gusta</div>
                <div class="df-value"><?php echo esc_html($ficha['no_le_gusta']); ?></div>
            </div>
            <?php endif; ?>

            <?php if (!empty($ficha['frase_lema'])): ?>
            <div class="df-frase">"<?php echo esc_html($ficha['frase_lema']); ?>"</div>
            <?php endif; ?>

            <?php if (!empty($ficha['dato_curioso'])): ?>
            <div class="df-curioso">
                <div class="df-curioso-title">✨ Dato curioso</div>
                <div><?php echo esc_html($ficha['dato_curioso']); ?></div>
            </div>
            <?php endif; ?>

            <?php if ($especie_info && !empty($especie_info['desc'])): ?>
            <div class="df-especie-desc">
                <strong>Sobre los <?php echo esc_html($especie_info['nombre']); ?>:</strong><br>
                <?php echo esc_html($especie_info['desc']); ?>
            </div>
            <?php endif; ?>
        </div>
        <?php
    }

    // ═══════════════════════════════════════════════════════════════════════
    // SCRIPTS
    // ═══════════════════════════════════════════════════════════════════════

    public function admin_scripts($hook) {
        if (!in_array($hook, ['post.php', 'post-new.php'])) return;
    }

    public function frontend_scripts() {
        // CSS ya está inline
    }
}

// Agregar AJAX para guardar historia
add_action('wp_ajax_duendes_guardar_historia', function() {
    check_ajax_referer('duendes_guardian_suite', 'nonce');

    $post_id = intval($_POST['post_id']);
    if (!current_user_can('edit_post', $post_id)) {
        wp_send_json_error(['error' => 'Sin permisos']);
    }

    $historia = wp_kses_post($_POST['historia'] ?? '');

    wp_update_post([
        'ID' => $post_id,
        'post_content' => $historia
    ]);

    wp_send_json_success(['message' => 'Historia guardada']);
});

// Inicializar
DuendesGuardianSuite::instance();
