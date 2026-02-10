<?php
/**
 * Panel de Administracion PRO para Canalizaciones
 */

if (!defined('ABSPATH')) exit;

class Duendes_Canal_Admin_Panel {

    public function __construct() {
        add_action('admin_menu', [$this, 'add_menu']);
        add_filter('manage_duendes_canalizacion_posts_columns', [$this, 'custom_columns']);
        add_action('manage_duendes_canalizacion_posts_custom_column', [$this, 'column_content'], 10, 2);
        add_filter('manage_edit-duendes_canalizacion_sortable_columns', [$this, 'sortable_columns']);
        add_action('admin_footer', [$this, 'modal_template']);
        add_filter('post_row_actions', [$this, 'row_actions'], 10, 2);
    }

    /**
     * Agregar menu personalizado
     */
    public function add_menu() {
        // Menu principal
        add_menu_page(
            'Canalizaciones',
            'Canalizaciones',
            'manage_woocommerce',
            'duendes-canalizaciones',
            [$this, 'render_dashboard'],
            'dashicons-star-filled',
            56
        );

        // Submenus
        add_submenu_page(
            'duendes-canalizaciones',
            'Dashboard',
            'Dashboard',
            'manage_woocommerce',
            'duendes-canalizaciones',
            [$this, 'render_dashboard']
        );

        add_submenu_page(
            'duendes-canalizaciones',
            'Pendientes',
            'Pendientes',
            'manage_woocommerce',
            'edit.php?post_type=duendes_canalizacion&estado=pendiente'
        );

        add_submenu_page(
            'duendes-canalizaciones',
            'Listas',
            'Listas para Enviar',
            'manage_woocommerce',
            'edit.php?post_type=duendes_canalizacion&estado=lista'
        );

        add_submenu_page(
            'duendes-canalizaciones',
            'Enviadas',
            'Enviadas',
            'manage_woocommerce',
            'edit.php?post_type=duendes_canalizacion&estado=enviada'
        );

        add_submenu_page(
            'duendes-canalizaciones',
            'Configuracion',
            'Configuracion',
            'manage_options',
            'duendes-canalizaciones-config',
            [$this, 'render_config']
        );
    }

    /**
     * Dashboard principal
     */
    public function render_dashboard() {
        $stats = Duendes_Canal_CPT::obtener_estadisticas();
        $pendientes = Duendes_Canal_CPT::obtener_por_estado('pendiente', ['posts_per_page' => 10]);
        $listas = Duendes_Canal_CPT::obtener_por_estado('lista', ['posts_per_page' => 10]);
        ?>
        <div class="wrap duendes-admin-dashboard">
            <h1>Canalizaciones</h1>

            <div class="duendes-stats-grid">
                <div class="stat-card stat-pendientes">
                    <span class="stat-number"><?php echo $stats['pendientes']; ?></span>
                    <span class="stat-label">Pendientes</span>
                    <?php if ($stats['pendientes'] > 0): ?>
                        <span class="stat-alert">Requieren atencion</span>
                    <?php endif; ?>
                </div>
                <div class="stat-card stat-generando">
                    <span class="stat-number"><?php echo $stats['generando']; ?></span>
                    <span class="stat-label">Generando</span>
                </div>
                <div class="stat-card stat-listas">
                    <span class="stat-number"><?php echo $stats['listas']; ?></span>
                    <span class="stat-label">Listas para Enviar</span>
                </div>
                <div class="stat-card stat-enviadas">
                    <span class="stat-number"><?php echo $stats['enviadas']; ?></span>
                    <span class="stat-label">Enviadas</span>
                </div>
            </div>

            <?php if (!empty($pendientes)): ?>
            <div class="duendes-section">
                <h2>Pendientes de Formulario</h2>
                <table class="wp-list-table widefat fixed striped">
                    <thead>
                        <tr>
                            <th>Orden</th>
                            <th>Cliente</th>
                            <th>Guardian</th>
                            <th>Hace</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php foreach ($pendientes as $canal): ?>
                        <tr>
                            <td>#<?php echo get_post_meta($canal->ID, '_orden_id', true); ?></td>
                            <td>
                                <?php echo esc_html(get_post_meta($canal->ID, '_nombre_cliente', true)); ?>
                                <br><small><?php echo esc_html(get_post_meta($canal->ID, '_email', true)); ?></small>
                            </td>
                            <td><?php echo esc_html(get_post_meta($canal->ID, '_guardian_nombre', true)); ?></td>
                            <td><?php echo human_time_diff(strtotime($canal->post_date), current_time('timestamp')); ?></td>
                            <td>
                                <button class="button btn-generar" data-id="<?php echo $canal->ID; ?>">Generar</button>
                            </td>
                        </tr>
                        <?php endforeach; ?>
                    </tbody>
                </table>
            </div>
            <?php endif; ?>

            <?php if (!empty($listas)): ?>
            <div class="duendes-section">
                <h2>Listas para Enviar</h2>
                <table class="wp-list-table widefat fixed striped">
                    <thead>
                        <tr>
                            <th>Orden</th>
                            <th>Cliente</th>
                            <th>Guardian</th>
                            <th>Generada</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php foreach ($listas as $canal): ?>
                        <tr>
                            <td>#<?php echo get_post_meta($canal->ID, '_orden_id', true); ?></td>
                            <td>
                                <?php echo esc_html(get_post_meta($canal->ID, '_nombre_cliente', true)); ?>
                                <br><small><?php echo esc_html(get_post_meta($canal->ID, '_email', true)); ?></small>
                            </td>
                            <td><?php echo esc_html(get_post_meta($canal->ID, '_guardian_nombre', true)); ?></td>
                            <td><?php echo human_time_diff(strtotime(get_post_meta($canal->ID, '_fecha_generada', true)), current_time('timestamp')); ?></td>
                            <td>
                                <button class="button btn-ver" data-id="<?php echo $canal->ID; ?>">Ver</button>
                                <button class="button button-primary btn-enviar" data-id="<?php echo $canal->ID; ?>">Enviar</button>
                            </td>
                        </tr>
                        <?php endforeach; ?>
                    </tbody>
                </table>
            </div>
            <?php endif; ?>
        </div>
        <?php
    }

    /**
     * Pagina de configuracion
     */
    public function render_config() {
        if (isset($_POST['guardar_config']) && wp_verify_nonce($_POST['_wpnonce'], 'duendes_config')) {
            update_option('duendes_anthropic_key', sanitize_text_field($_POST['anthropic_key']));
            update_option('duendes_admin_email', sanitize_email($_POST['admin_email']));
            echo '<div class="notice notice-success"><p>Configuracion guardada.</p></div>';
        }

        $api_key = get_option('duendes_anthropic_key', '');
        $admin_email = get_option('duendes_admin_email', get_option('admin_email'));
        ?>
        <div class="wrap">
            <h1>Configuracion de Canalizaciones</h1>
            <form method="post">
                <?php wp_nonce_field('duendes_config'); ?>
                <table class="form-table">
                    <tr>
                        <th><label for="anthropic_key">Anthropic API Key</label></th>
                        <td>
                            <input type="password" id="anthropic_key" name="anthropic_key"
                                   value="<?php echo esc_attr($api_key); ?>" class="regular-text">
                            <p class="description">
                                Si no se configura aca, usa ANTHROPIC_API_KEY de wp-config.php
                                <?php if (defined('ANTHROPIC_API_KEY')): ?>
                                    <br><strong>Configurada en wp-config.php</strong>
                                <?php endif; ?>
                            </p>
                        </td>
                    </tr>
                    <tr>
                        <th><label for="admin_email">Email de Notificaciones</label></th>
                        <td>
                            <input type="email" id="admin_email" name="admin_email"
                                   value="<?php echo esc_attr($admin_email); ?>" class="regular-text">
                        </td>
                    </tr>
                </table>
                <p class="submit">
                    <button type="submit" name="guardar_config" class="button button-primary">Guardar</button>
                </p>
            </form>
        </div>
        <?php
    }

    /**
     * Columnas personalizadas
     */
    public function custom_columns($columns) {
        return [
            'cb' => $columns['cb'],
            'orden' => 'Orden',
            'cliente' => 'Cliente',
            'guardian' => 'Guardian',
            'estado' => 'Estado',
            'fecha' => 'Fecha',
        ];
    }

    public function column_content($column, $post_id) {
        switch ($column) {
            case 'orden':
                $orden_id = get_post_meta($post_id, '_orden_id', true);
                echo "<a href='" . admin_url("post.php?post=$orden_id&action=edit") . "'>#$orden_id</a>";
                break;

            case 'cliente':
                $nombre = get_post_meta($post_id, '_nombre_cliente', true);
                $email = get_post_meta($post_id, '_email', true);
                echo "<strong>" . esc_html($nombre) . "</strong><br>";
                echo "<small>" . esc_html($email) . "</small>";
                break;

            case 'guardian':
                $nombre = get_post_meta($post_id, '_guardian_nombre', true);
                $categoria = get_post_meta($post_id, '_guardian_categoria', true);
                echo esc_html($nombre) . "<br>";
                echo "<span class='categoria categoria-$categoria'>$categoria</span>";
                break;

            case 'estado':
                $estado = get_post_meta($post_id, '_estado', true);
                $clases = [
                    'pendiente' => 'estado-amarillo',
                    'generando' => 'estado-azul',
                    'lista' => 'estado-verde',
                    'enviada' => 'estado-gris',
                ];
                $clase = $clases[$estado] ?? '';
                echo "<span class='estado-badge $clase'>" . ucfirst($estado) . "</span>";
                break;

            case 'fecha':
                $post = get_post($post_id);
                echo human_time_diff(strtotime($post->post_date), current_time('timestamp')) . ' atras';
                break;
        }
    }

    public function sortable_columns($columns) {
        $columns['orden'] = 'orden';
        $columns['fecha'] = 'date';
        return $columns;
    }

    /**
     * Acciones de fila
     */
    public function row_actions($actions, $post) {
        if ($post->post_type !== 'duendes_canalizacion') {
            return $actions;
        }

        $estado = get_post_meta($post->ID, '_estado', true);

        $new_actions = [];

        // Ver siempre disponible
        $new_actions['ver'] = sprintf(
            '<a href="#" class="btn-ver-modal" data-id="%d">Ver</a>',
            $post->ID
        );

        // Acciones segun estado
        switch ($estado) {
            case 'pendiente':
                $new_actions['generar'] = sprintf(
                    '<a href="#" class="btn-generar-modal" data-id="%d">Generar</a>',
                    $post->ID
                );
                break;

            case 'lista':
                $new_actions['regenerar'] = sprintf(
                    '<a href="#" class="btn-regenerar-modal" data-id="%d">Regenerar</a>',
                    $post->ID
                );
                $new_actions['enviar'] = sprintf(
                    '<a href="#" class="btn-enviar-modal" data-id="%d" style="color:#46b450;font-weight:bold;">Enviar</a>',
                    $post->ID
                );
                break;
        }

        return $new_actions;
    }

    /**
     * Template del modal
     */
    public function modal_template() {
        $screen = get_current_screen();
        if (!$screen || strpos($screen->id, 'duendes_canalizacion') === false &&
            strpos($screen->id, 'duendes-canalizaciones') === false) {
            return;
        }
        ?>
        <div id="duendes-modal-overlay" style="display:none;">
            <div id="duendes-modal">
                <div class="modal-header">
                    <h2 class="modal-titulo">Canalizacion</h2>
                    <button class="modal-cerrar">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="modal-loading">
                        <span class="spinner is-active"></span>
                        <p>Cargando...</p>
                    </div>
                    <div class="modal-content" style="display:none;">
                        <!-- Datos -->
                        <div class="modal-datos">
                            <div class="dato">
                                <label>Cliente:</label>
                                <span class="dato-cliente"></span>
                            </div>
                            <div class="dato">
                                <label>Email:</label>
                                <span class="dato-email"></span>
                            </div>
                            <div class="dato">
                                <label>Guardian:</label>
                                <span class="dato-guardian"></span>
                            </div>
                            <div class="dato">
                                <label>Categoria:</label>
                                <span class="dato-categoria"></span>
                            </div>
                            <div class="dato">
                                <label>Tipo:</label>
                                <span class="dato-tipo"></span>
                            </div>
                        </div>

                        <!-- Formulario compartido -->
                        <div class="modal-formulario" style="display:none;">
                            <h4>Lo que compartio:</h4>
                            <div class="formulario-datos"></div>
                        </div>

                        <!-- Contenido de la canalizacion -->
                        <div class="modal-canalizacion">
                            <h4>Canalizacion <span class="version-num"></span></h4>
                            <div class="canalizacion-contenido" contenteditable="true"></div>
                            <div class="canalizacion-palabras">0 palabras</div>
                        </div>

                        <!-- Regenerar con instrucciones -->
                        <div class="modal-regenerar" style="display:none;">
                            <h4>Regenerar con instrucciones</h4>
                            <textarea class="instrucciones-regen" rows="3"
                                      placeholder="Ej: Hace mas enfasis en X, menciona Y, que sea mas corto..."></textarea>
                            <button class="button btn-ejecutar-regen">Regenerar</button>
                        </div>

                        <!-- Historial -->
                        <div class="modal-historial" style="display:none;">
                            <h4>Historial de versiones</h4>
                            <ul class="historial-lista"></ul>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="button modal-cancelar">Cancelar</button>
                    <button class="button btn-toggle-regen">Regenerar</button>
                    <button class="button button-primary btn-guardar">Guardar cambios</button>
                    <button class="button button-primary btn-enviar-final" style="background:#46b450;border-color:#46b450;">Enviar al cliente</button>
                </div>
            </div>
        </div>

        <style>
        #duendes-modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.7);
            z-index: 100000;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        #duendes-modal {
            background: #fff;
            width: 90%;
            max-width: 900px;
            max-height: 90vh;
            border-radius: 8px;
            display: flex;
            flex-direction: column;
        }
        .modal-header {
            padding: 15px 20px;
            border-bottom: 1px solid #ddd;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .modal-header h2 { margin: 0; }
        .modal-cerrar {
            background: none;
            border: none;
            font-size: 24px;
            cursor: pointer;
            color: #666;
        }
        .modal-body {
            padding: 20px;
            overflow-y: auto;
            flex: 1;
        }
        .modal-loading {
            text-align: center;
            padding: 40px;
        }
        .modal-datos {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 10px;
            margin-bottom: 20px;
            background: #f5f5f5;
            padding: 15px;
            border-radius: 5px;
        }
        .modal-datos .dato label {
            font-weight: bold;
            display: block;
            font-size: 12px;
            color: #666;
        }
        .modal-formulario {
            background: #fff8e5;
            padding: 15px;
            border-radius: 5px;
            margin-bottom: 20px;
        }
        .modal-canalizacion h4 {
            margin-bottom: 10px;
        }
        .canalizacion-contenido {
            border: 1px solid #ddd;
            padding: 15px;
            min-height: 300px;
            max-height: 400px;
            overflow-y: auto;
            background: #fafafa;
            white-space: pre-wrap;
            font-family: Georgia, serif;
            line-height: 1.6;
        }
        .canalizacion-palabras {
            text-align: right;
            font-size: 12px;
            color: #666;
            margin-top: 5px;
        }
        .modal-regenerar {
            background: #e7f3ff;
            padding: 15px;
            border-radius: 5px;
            margin-top: 20px;
        }
        .instrucciones-regen {
            width: 100%;
            margin-bottom: 10px;
        }
        .modal-footer {
            padding: 15px 20px;
            border-top: 1px solid #ddd;
            display: flex;
            justify-content: flex-end;
            gap: 10px;
        }
        .estado-badge {
            padding: 3px 8px;
            border-radius: 3px;
            font-size: 12px;
        }
        .estado-amarillo { background: #fff3cd; color: #856404; }
        .estado-azul { background: #cce5ff; color: #004085; }
        .estado-verde { background: #d4edda; color: #155724; }
        .estado-gris { background: #e2e3e5; color: #383d41; }

        .duendes-stats-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 20px;
            margin-bottom: 30px;
        }
        .stat-card {
            background: #fff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            text-align: center;
        }
        .stat-number {
            font-size: 48px;
            font-weight: bold;
            display: block;
        }
        .stat-label {
            color: #666;
            display: block;
        }
        .stat-alert {
            background: #ff6b6b;
            color: #fff;
            padding: 2px 8px;
            border-radius: 3px;
            font-size: 11px;
            margin-top: 5px;
            display: inline-block;
        }
        .stat-pendientes .stat-number { color: #f0ad4e; }
        .stat-generando .stat-number { color: #5bc0de; }
        .stat-listas .stat-number { color: #5cb85c; }
        .stat-enviadas .stat-number { color: #777; }

        .duendes-section {
            background: #fff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            margin-bottom: 20px;
        }
        .duendes-section h2 {
            margin-top: 0;
            padding-bottom: 10px;
            border-bottom: 1px solid #eee;
        }
        </style>
        <?php
    }
}
