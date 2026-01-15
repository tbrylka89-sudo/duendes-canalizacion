<?php
/**
 * Plugin Name: Mi Magia - Sistema de Solicitudes
 * Description: Gestiona solicitudes de acceso al portal Mi Magia con aprobación desde el admin
 * Version: 1.0.0
 * Author: Duendes del Uruguay
 */

if (!defined('ABSPATH')) exit;

class MiMagiaSolicitudes {

    private $table_name;

    public function __construct() {
        global $wpdb;
        $this->table_name = $wpdb->prefix . 'mi_magia_solicitudes';

        // Hooks de instalación
        register_activation_hook(__FILE__, [$this, 'crear_tabla']);

        // API REST
        add_action('rest_api_init', [$this, 'registrar_endpoints']);

        // Admin
        add_action('admin_menu', [$this, 'agregar_menu_admin']);
        add_action('admin_enqueue_scripts', [$this, 'admin_styles']);

        // AJAX
        add_action('wp_ajax_aprobar_solicitud_mi_magia', [$this, 'aprobar_solicitud']);
        add_action('wp_ajax_rechazar_solicitud_mi_magia', [$this, 'rechazar_solicitud']);
        add_action('wp_ajax_eliminar_solicitud_mi_magia', [$this, 'eliminar_solicitud']);
    }

    /**
     * Crear tabla en la base de datos
     */
    public function crear_tabla() {
        global $wpdb;
        $charset_collate = $wpdb->get_charset_collate();

        $sql = "CREATE TABLE IF NOT EXISTS {$this->table_name} (
            id bigint(20) NOT NULL AUTO_INCREMENT,
            nombre varchar(255) NOT NULL,
            email varchar(255) NOT NULL,
            tipo_acceso varchar(50) NOT NULL DEFAULT 'individual',
            mensaje text,
            estado varchar(50) NOT NULL DEFAULT 'pendiente',
            fecha_solicitud datetime DEFAULT CURRENT_TIMESTAMP,
            fecha_aprobacion datetime DEFAULT NULL,
            notas_admin text,
            PRIMARY KEY (id),
            KEY estado (estado),
            KEY email (email)
        ) $charset_collate;";

        require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
        dbDelta($sql);
    }

    /**
     * Registrar endpoints REST API
     */
    public function registrar_endpoints() {
        register_rest_route('duendes/v1', '/mi-magia-solicitud', [
            'methods' => 'POST',
            'callback' => [$this, 'procesar_solicitud'],
            'permission_callback' => '__return_true'
        ]);
    }

    /**
     * Procesar nueva solicitud
     */
    public function procesar_solicitud($request) {
        global $wpdb;

        $params = $request->get_json_params();

        $nombre = sanitize_text_field($params['nombre'] ?? '');
        $email = sanitize_email($params['email'] ?? '');
        $tipo_acceso = sanitize_text_field($params['tipo_acceso'] ?? 'individual');
        $mensaje = sanitize_textarea_field($params['mensaje'] ?? '');

        if (empty($nombre) || empty($email)) {
            return new WP_REST_Response([
                'success' => false,
                'message' => 'Nombre y email son requeridos'
            ], 400);
        }

        // Verificar si ya existe una solicitud pendiente
        $existente = $wpdb->get_var($wpdb->prepare(
            "SELECT id FROM {$this->table_name} WHERE email = %s AND estado = 'pendiente'",
            $email
        ));

        if ($existente) {
            return new WP_REST_Response([
                'success' => true,
                'message' => 'Ya tenés una solicitud pendiente. Te contactaremos pronto.'
            ], 200);
        }

        // Insertar nueva solicitud
        $resultado = $wpdb->insert($this->table_name, [
            'nombre' => $nombre,
            'email' => $email,
            'tipo_acceso' => $tipo_acceso,
            'mensaje' => $mensaje,
            'estado' => 'pendiente',
            'fecha_solicitud' => current_time('mysql')
        ]);

        if ($resultado) {
            // Enviar notificación al admin
            $this->notificar_admin_nueva_solicitud($nombre, $email, $tipo_acceso);

            return new WP_REST_Response([
                'success' => true,
                'message' => 'Solicitud enviada correctamente'
            ], 200);
        }

        return new WP_REST_Response([
            'success' => false,
            'message' => 'Error al procesar la solicitud'
        ], 500);
    }

    /**
     * Notificar al admin de nueva solicitud
     */
    private function notificar_admin_nueva_solicitud($nombre, $email, $tipo) {
        $admin_email = get_option('admin_email');
        $subject = "Nueva solicitud de acceso a Mi Magia - {$nombre}";
        $message = "
            <h2>Nueva Solicitud de Acceso a Mi Magia</h2>
            <p><strong>Nombre:</strong> {$nombre}</p>
            <p><strong>Email:</strong> {$email}</p>
            <p><strong>Tipo:</strong> " . ucfirst($tipo) . "</p>
            <p><a href='" . admin_url('admin.php?page=mi-magia-solicitudes') . "'>Ver solicitudes pendientes</a></p>
        ";

        wp_mail($admin_email, $subject, $message, ['Content-Type: text/html; charset=UTF-8']);
    }

    /**
     * Agregar menú en admin
     */
    public function agregar_menu_admin() {
        // Contar solicitudes pendientes
        global $wpdb;
        $pendientes = $wpdb->get_var("SELECT COUNT(*) FROM {$this->table_name} WHERE estado = 'pendiente'");
        $badge = $pendientes > 0 ? " <span class='awaiting-mod'>{$pendientes}</span>" : '';

        add_menu_page(
            'Mi Magia - Solicitudes',
            'Mi Magia' . $badge,
            'manage_options',
            'mi-magia-solicitudes',
            [$this, 'pagina_solicitudes'],
            'dashicons-star-filled',
            30
        );
    }

    /**
     * Estilos del admin
     */
    public function admin_styles($hook) {
        if ($hook !== 'toplevel_page_mi-magia-solicitudes') return;

        wp_add_inline_style('wp-admin', '
            .mi-magia-admin {
                max-width: 1200px;
                margin: 20px auto;
            }
            .mi-magia-header {
                background: linear-gradient(135deg, #0a0a0a, #1a1a2e);
                padding: 30px;
                border-radius: 15px;
                margin-bottom: 30px;
                color: #fff;
            }
            .mi-magia-header h1 {
                color: #d4af37;
                margin: 0 0 10px;
                font-size: 28px;
            }
            .mi-magia-header p {
                margin: 0;
                opacity: 0.8;
            }
            .mi-magia-stats {
                display: flex;
                gap: 20px;
                margin-bottom: 30px;
            }
            .stat-card {
                background: #fff;
                padding: 25px;
                border-radius: 12px;
                box-shadow: 0 2px 15px rgba(0,0,0,0.08);
                flex: 1;
                text-align: center;
            }
            .stat-card .numero {
                font-size: 36px;
                font-weight: bold;
                color: #0a0a0a;
            }
            .stat-card.pendientes .numero { color: #f59e0b; }
            .stat-card.aprobadas .numero { color: #10b981; }
            .stat-card.rechazadas .numero { color: #ef4444; }
            .stat-card .label {
                color: #666;
                font-size: 14px;
                margin-top: 5px;
            }
            .solicitudes-table {
                width: 100%;
                background: #fff;
                border-radius: 12px;
                overflow: hidden;
                box-shadow: 0 2px 15px rgba(0,0,0,0.08);
            }
            .solicitudes-table th {
                background: #0a0a0a;
                color: #d4af37;
                padding: 15px;
                text-align: left;
                font-weight: 500;
            }
            .solicitudes-table td {
                padding: 15px;
                border-bottom: 1px solid #eee;
            }
            .solicitudes-table tr:last-child td {
                border-bottom: none;
            }
            .badge {
                padding: 5px 12px;
                border-radius: 20px;
                font-size: 12px;
                font-weight: 500;
            }
            .badge-pendiente { background: #fef3c7; color: #92400e; }
            .badge-aprobada { background: #d1fae5; color: #065f46; }
            .badge-rechazada { background: #fee2e2; color: #991b1b; }
            .badge-individual { background: #e0e7ff; color: #3730a3; }
            .badge-grupal { background: #fae8ff; color: #86198f; }
            .acciones-btn {
                padding: 8px 16px;
                border: none;
                border-radius: 6px;
                cursor: pointer;
                font-size: 13px;
                margin-right: 5px;
                transition: all 0.2s;
            }
            .btn-aprobar {
                background: #10b981;
                color: #fff;
            }
            .btn-aprobar:hover { background: #059669; }
            .btn-rechazar {
                background: #ef4444;
                color: #fff;
            }
            .btn-rechazar:hover { background: #dc2626; }
            .btn-eliminar {
                background: #6b7280;
                color: #fff;
            }
            .btn-eliminar:hover { background: #4b5563; }
            .mensaje-preview {
                max-width: 250px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                color: #666;
                font-style: italic;
            }
            .tabs-nav {
                display: flex;
                gap: 10px;
                margin-bottom: 20px;
            }
            .tab-btn {
                padding: 10px 20px;
                background: #fff;
                border: 2px solid #e5e7eb;
                border-radius: 8px;
                cursor: pointer;
                font-weight: 500;
                transition: all 0.2s;
            }
            .tab-btn.active {
                background: #0a0a0a;
                color: #d4af37;
                border-color: #0a0a0a;
            }
        ');
    }

    /**
     * Página de solicitudes
     */
    public function pagina_solicitudes() {
        global $wpdb;

        $filtro = isset($_GET['estado']) ? sanitize_text_field($_GET['estado']) : 'pendiente';

        // Estadísticas
        $stats = [
            'pendientes' => $wpdb->get_var("SELECT COUNT(*) FROM {$this->table_name} WHERE estado = 'pendiente'"),
            'aprobadas' => $wpdb->get_var("SELECT COUNT(*) FROM {$this->table_name} WHERE estado = 'aprobada'"),
            'rechazadas' => $wpdb->get_var("SELECT COUNT(*) FROM {$this->table_name} WHERE estado = 'rechazada'")
        ];

        // Solicitudes
        $where = $filtro !== 'todas' ? $wpdb->prepare("WHERE estado = %s", $filtro) : '';
        $solicitudes = $wpdb->get_results("SELECT * FROM {$this->table_name} {$where} ORDER BY fecha_solicitud DESC");

        ?>
        <div class="mi-magia-admin">
            <div class="mi-magia-header">
                <h1>Mi Magia - Solicitudes de Acceso</h1>
                <p>Gestiona las solicitudes de acceso al portal exclusivo</p>
            </div>

            <div class="mi-magia-stats">
                <div class="stat-card pendientes">
                    <div class="numero"><?php echo $stats['pendientes']; ?></div>
                    <div class="label">Pendientes</div>
                </div>
                <div class="stat-card aprobadas">
                    <div class="numero"><?php echo $stats['aprobadas']; ?></div>
                    <div class="label">Aprobadas</div>
                </div>
                <div class="stat-card rechazadas">
                    <div class="numero"><?php echo $stats['rechazadas']; ?></div>
                    <div class="label">Rechazadas</div>
                </div>
            </div>

            <div class="tabs-nav">
                <a href="?page=mi-magia-solicitudes&estado=pendiente" class="tab-btn <?php echo $filtro === 'pendiente' ? 'active' : ''; ?>">
                    Pendientes (<?php echo $stats['pendientes']; ?>)
                </a>
                <a href="?page=mi-magia-solicitudes&estado=aprobada" class="tab-btn <?php echo $filtro === 'aprobada' ? 'active' : ''; ?>">
                    Aprobadas
                </a>
                <a href="?page=mi-magia-solicitudes&estado=rechazada" class="tab-btn <?php echo $filtro === 'rechazada' ? 'active' : ''; ?>">
                    Rechazadas
                </a>
                <a href="?page=mi-magia-solicitudes&estado=todas" class="tab-btn <?php echo $filtro === 'todas' ? 'active' : ''; ?>">
                    Todas
                </a>
            </div>

            <table class="solicitudes-table">
                <thead>
                    <tr>
                        <th>Fecha</th>
                        <th>Nombre</th>
                        <th>Email</th>
                        <th>Tipo</th>
                        <th>Mensaje</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    <?php if (empty($solicitudes)): ?>
                        <tr>
                            <td colspan="7" style="text-align: center; padding: 40px; color: #666;">
                                No hay solicitudes <?php echo $filtro !== 'todas' ? $filtro . 's' : ''; ?>
                            </td>
                        </tr>
                    <?php else: ?>
                        <?php foreach ($solicitudes as $sol): ?>
                            <tr id="solicitud-<?php echo $sol->id; ?>">
                                <td><?php echo date('d/m/Y H:i', strtotime($sol->fecha_solicitud)); ?></td>
                                <td><strong><?php echo esc_html($sol->nombre); ?></strong></td>
                                <td><a href="mailto:<?php echo esc_attr($sol->email); ?>"><?php echo esc_html($sol->email); ?></a></td>
                                <td>
                                    <span class="badge badge-<?php echo $sol->tipo_acceso; ?>">
                                        <?php echo ucfirst($sol->tipo_acceso); ?>
                                    </span>
                                </td>
                                <td class="mensaje-preview" title="<?php echo esc_attr($sol->mensaje); ?>">
                                    <?php echo esc_html($sol->mensaje ?: '-'); ?>
                                </td>
                                <td>
                                    <span class="badge badge-<?php echo $sol->estado; ?>">
                                        <?php echo ucfirst($sol->estado); ?>
                                    </span>
                                </td>
                                <td>
                                    <?php if ($sol->estado === 'pendiente'): ?>
                                        <button class="acciones-btn btn-aprobar" onclick="aprobarSolicitud(<?php echo $sol->id; ?>)">
                                            Aprobar
                                        </button>
                                        <button class="acciones-btn btn-rechazar" onclick="rechazarSolicitud(<?php echo $sol->id; ?>)">
                                            Rechazar
                                        </button>
                                    <?php else: ?>
                                        <button class="acciones-btn btn-eliminar" onclick="eliminarSolicitud(<?php echo $sol->id; ?>)">
                                            Eliminar
                                        </button>
                                    <?php endif; ?>
                                </td>
                            </tr>
                        <?php endforeach; ?>
                    <?php endif; ?>
                </tbody>
            </table>
        </div>

        <script>
        function aprobarSolicitud(id) {
            if (!confirm('¿Aprobar esta solicitud? Se enviará un email al usuario.')) return;

            jQuery.post(ajaxurl, {
                action: 'aprobar_solicitud_mi_magia',
                id: id,
                _ajax_nonce: '<?php echo wp_create_nonce('mi_magia_admin'); ?>'
            }, function(response) {
                if (response.success) {
                    location.reload();
                } else {
                    alert('Error: ' + response.data);
                }
            });
        }

        function rechazarSolicitud(id) {
            if (!confirm('¿Rechazar esta solicitud?')) return;

            jQuery.post(ajaxurl, {
                action: 'rechazar_solicitud_mi_magia',
                id: id,
                _ajax_nonce: '<?php echo wp_create_nonce('mi_magia_admin'); ?>'
            }, function(response) {
                if (response.success) {
                    location.reload();
                } else {
                    alert('Error: ' + response.data);
                }
            });
        }

        function eliminarSolicitud(id) {
            if (!confirm('¿Eliminar esta solicitud permanentemente?')) return;

            jQuery.post(ajaxurl, {
                action: 'eliminar_solicitud_mi_magia',
                id: id,
                _ajax_nonce: '<?php echo wp_create_nonce('mi_magia_admin'); ?>'
            }, function(response) {
                if (response.success) {
                    jQuery('#solicitud-' + id).fadeOut();
                } else {
                    alert('Error: ' + response.data);
                }
            });
        }
        </script>
        <?php
    }

    /**
     * Aprobar solicitud
     */
    public function aprobar_solicitud() {
        check_ajax_referer('mi_magia_admin');

        if (!current_user_can('manage_options')) {
            wp_send_json_error('Sin permisos');
        }

        global $wpdb;
        $id = intval($_POST['id']);

        // Obtener datos de la solicitud
        $solicitud = $wpdb->get_row($wpdb->prepare(
            "SELECT * FROM {$this->table_name} WHERE id = %d",
            $id
        ));

        if (!$solicitud) {
            wp_send_json_error('Solicitud no encontrada');
        }

        // Actualizar estado
        $wpdb->update(
            $this->table_name,
            [
                'estado' => 'aprobada',
                'fecha_aprobacion' => current_time('mysql')
            ],
            ['id' => $id]
        );

        // Enviar email de aprobación
        $this->enviar_email_aprobacion($solicitud);

        wp_send_json_success();
    }

    /**
     * Rechazar solicitud
     */
    public function rechazar_solicitud() {
        check_ajax_referer('mi_magia_admin');

        if (!current_user_can('manage_options')) {
            wp_send_json_error('Sin permisos');
        }

        global $wpdb;
        $id = intval($_POST['id']);

        $wpdb->update(
            $this->table_name,
            ['estado' => 'rechazada'],
            ['id' => $id]
        );

        wp_send_json_success();
    }

    /**
     * Eliminar solicitud
     */
    public function eliminar_solicitud() {
        check_ajax_referer('mi_magia_admin');

        if (!current_user_can('manage_options')) {
            wp_send_json_error('Sin permisos');
        }

        global $wpdb;
        $id = intval($_POST['id']);

        $wpdb->delete($this->table_name, ['id' => $id]);

        wp_send_json_success();
    }

    /**
     * Enviar email de aprobación
     */
    private function enviar_email_aprobacion($solicitud) {
        $subject = "Tu acceso a Mi Magia ha sido aprobado";
        $message = "
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: Georgia, serif; background: #0a0a0a; color: #fff; padding: 40px; }
                .container { max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #0a0a0a, #1a1a2e); padding: 50px; border-radius: 20px; border: 1px solid #d4af37; }
                h1 { color: #d4af37; font-size: 32px; text-align: center; margin-bottom: 30px; }
                p { line-height: 1.8; font-size: 16px; color: rgba(255,255,255,0.85); }
                .btn { display: inline-block; background: linear-gradient(135deg, #6b21a8, #7c3aed); color: #fff; padding: 18px 40px; border-radius: 50px; text-decoration: none; font-weight: bold; margin-top: 30px; }
                .footer { margin-top: 40px; text-align: center; font-size: 14px; color: rgba(255,255,255,0.5); }
            </style>
        </head>
        <body>
            <div class='container'>
                <h1>Bienvenido/a a Mi Magia</h1>
                <p>Hola <strong>{$solicitud->nombre}</strong>,</p>
                <p>Tu solicitud de acceso ha sido aprobada. Ya podés ingresar a tu portal exclusivo donde encontrarás:</p>
                <ul style='color: rgba(255,255,255,0.8); line-height: 2;'>
                    <li>Tus compras y canalizaciones</li>
                    <li>Tiradas de runas personalizadas</li>
                    <li>Estudios y lecturas exclusivas</li>
                    <li>Material solo para miembros</li>
                </ul>
                <p style='text-align: center;'>
                    <a href='" . home_url('/mi-magia/') . "' class='btn'>Ingresar a Mi Magia</a>
                </p>
                <div class='footer'>
                    Con amor y magia,<br>
                    Gabriel & Thibisay<br>
                    Duendes del Uruguay
                </div>
            </div>
        </body>
        </html>
        ";

        wp_mail($solicitud->email, $subject, $message, ['Content-Type: text/html; charset=UTF-8']);
    }
}

// Inicializar
new MiMagiaSolicitudes();
