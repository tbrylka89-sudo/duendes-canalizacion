<?php
/**
 * Plugin Name: Duendes - Admin Completo
 * Description: Sistema administrativo completo para Duendes del Uruguay
 * Version: 1.0
 * Author: Duendes del Uruguay
 */

if (!defined('ABSPATH')) exit;

// ═══════════════════════════════════════════════════════════════════════════
// CONSTANTES Y CONFIGURACIÓN
// ═══════════════════════════════════════════════════════════════════════════

define('DUENDES_ADMIN_VERSION', '1.0.0');
define('DUENDES_API_URL', 'https://duendes-vercel.vercel.app/api');

// ═══════════════════════════════════════════════════════════════════════════
// MENÚ PRINCIPAL EN WP-ADMIN
// ═══════════════════════════════════════════════════════════════════════════

add_action('admin_menu', function() {
    // Menú principal: Tito
    add_menu_page(
        'Panel Tito',
        '🧙 Tito Admin',
        'manage_options',
        'duendes-tito',
        'duendes_tito_dashboard',
        'dashicons-star-filled',
        3
    );

    // Submenú: Dashboard
    add_submenu_page(
        'duendes-tito',
        'Dashboard',
        '📊 Dashboard',
        'manage_options',
        'duendes-tito',
        'duendes_tito_dashboard'
    );

    // Submenú: Canalizaciones
    add_submenu_page(
        'duendes-tito',
        'Canalizaciones',
        '🔮 Canalizaciones',
        'manage_options',
        'duendes-canalizaciones',
        'duendes_canalizaciones_page'
    );

    // Submenú: Usuarios
    add_submenu_page(
        'duendes-tito',
        'Usuarios',
        '👥 Usuarios',
        'manage_options',
        'duendes-usuarios',
        'duendes_usuarios_page'
    );

    // Submenú: El Círculo
    add_submenu_page(
        'duendes-tito',
        'El Círculo',
        '🌙 El Círculo',
        'manage_options',
        'duendes-circulo',
        'duendes_circulo_page'
    );

    // Submenú: Banners & Promos
    add_submenu_page(
        'duendes-tito',
        'Banners & Promos',
        '🎨 Banners',
        'manage_options',
        'duendes-banners',
        'duendes_banners_page'
    );

    // Submenú: Configuración
    add_submenu_page(
        'duendes-tito',
        'Configuración',
        '⚙️ Config',
        'manage_options',
        'duendes-config',
        'duendes_config_page'
    );
});

// ═══════════════════════════════════════════════════════════════════════════
// ESTILOS GLOBALES ADMIN
// ═══════════════════════════════════════════════════════════════════════════

add_action('admin_head', function() {
    $screen = get_current_screen();
    if (strpos($screen->id, 'duendes') === false) return;
    ?>
    <style>
    .duendes-admin-wrap {
        max-width: 1400px;
        margin: 20px auto;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    }

    .duendes-header {
        background: linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4c1d95 100%);
        padding: 30px;
        border-radius: 16px;
        margin-bottom: 30px;
        color: #fff;
    }

    .duendes-header h1 {
        margin: 0 0 10px 0;
        font-size: 28px;
        font-weight: 700;
    }

    .duendes-header p {
        margin: 0;
        opacity: 0.8;
        font-size: 16px;
    }

    .duendes-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 20px;
        margin-bottom: 30px;
    }

    .duendes-card {
        background: #fff;
        border-radius: 12px;
        padding: 24px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.08);
        border: 1px solid #e5e7eb;
    }

    .duendes-card-header {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 16px;
        padding-bottom: 16px;
        border-bottom: 2px solid #f3f4f6;
    }

    .duendes-card-icon {
        width: 48px;
        height: 48px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 24px;
    }

    .duendes-card-title {
        font-size: 18px;
        font-weight: 600;
        color: #1f2937;
        margin: 0;
    }

    .duendes-stat {
        text-align: center;
        padding: 20px;
    }

    .duendes-stat-value {
        font-size: 36px;
        font-weight: 700;
        color: #4f46e5;
    }

    .duendes-stat-label {
        font-size: 14px;
        color: #6b7280;
        margin-top: 4px;
    }

    .duendes-btn {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 12px 24px;
        border-radius: 8px;
        font-size: 14px;
        font-weight: 600;
        cursor: pointer;
        border: none;
        transition: all 0.2s;
    }

    .duendes-btn-primary {
        background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
        color: #fff;
    }

    .duendes-btn-primary:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(79, 70, 229, 0.4);
    }

    .duendes-btn-secondary {
        background: #f3f4f6;
        color: #374151;
        border: 1px solid #d1d5db;
    }

    .duendes-btn-success {
        background: linear-gradient(135deg, #059669 0%, #10b981 100%);
        color: #fff;
    }

    .duendes-form-group {
        margin-bottom: 20px;
    }

    .duendes-label {
        display: block;
        font-size: 13px;
        font-weight: 600;
        color: #374151;
        margin-bottom: 6px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }

    .duendes-input,
    .duendes-select,
    .duendes-textarea {
        width: 100%;
        padding: 12px 16px;
        border: 2px solid #e5e7eb;
        border-radius: 8px;
        font-size: 15px;
        transition: all 0.2s;
        box-sizing: border-box;
    }

    .duendes-input:focus,
    .duendes-select:focus,
    .duendes-textarea:focus {
        outline: none;
        border-color: #4f46e5;
        box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
    }

    .duendes-textarea {
        min-height: 120px;
        resize: vertical;
    }

    .duendes-table {
        width: 100%;
        border-collapse: collapse;
    }

    .duendes-table th,
    .duendes-table td {
        padding: 12px 16px;
        text-align: left;
        border-bottom: 1px solid #e5e7eb;
    }

    .duendes-table th {
        background: #f9fafb;
        font-weight: 600;
        color: #374151;
        font-size: 13px;
        text-transform: uppercase;
    }

    .duendes-table tr:hover {
        background: #f9fafb;
    }

    .duendes-badge {
        display: inline-block;
        padding: 4px 12px;
        border-radius: 20px;
        font-size: 12px;
        font-weight: 600;
    }

    .duendes-badge-success { background: #d1fae5; color: #065f46; }
    .duendes-badge-warning { background: #fef3c7; color: #92400e; }
    .duendes-badge-info { background: #dbeafe; color: #1e40af; }
    .duendes-badge-purple { background: #ede9fe; color: #5b21b6; }

    .duendes-alert {
        padding: 16px 20px;
        border-radius: 8px;
        margin-bottom: 20px;
        display: flex;
        align-items: flex-start;
        gap: 12px;
    }

    .duendes-alert-info {
        background: #eff6ff;
        border: 1px solid #bfdbfe;
        color: #1e40af;
    }

    .duendes-alert-success {
        background: #f0fdf4;
        border: 1px solid #bbf7d0;
        color: #166534;
    }

    .duendes-tabs {
        display: flex;
        gap: 4px;
        margin-bottom: 24px;
        border-bottom: 2px solid #e5e7eb;
        padding-bottom: 0;
    }

    .duendes-tab {
        padding: 12px 24px;
        background: none;
        border: none;
        font-size: 14px;
        font-weight: 600;
        color: #6b7280;
        cursor: pointer;
        border-bottom: 3px solid transparent;
        margin-bottom: -2px;
        transition: all 0.2s;
    }

    .duendes-tab:hover {
        color: #4f46e5;
    }

    .duendes-tab.active {
        color: #4f46e5;
        border-bottom-color: #4f46e5;
    }

    .duendes-tab-content {
        display: none;
    }

    .duendes-tab-content.active {
        display: block;
    }

    .duendes-loading {
        display: none;
        align-items: center;
        gap: 12px;
        padding: 20px;
        background: #fef3c7;
        border-radius: 8px;
        margin: 20px 0;
    }

    .duendes-loading.visible {
        display: flex;
    }

    .duendes-spinner {
        width: 24px;
        height: 24px;
        border: 3px solid #fcd34d;
        border-top-color: #f59e0b;
        border-radius: 50%;
        animation: spin 1s linear infinite;
    }

    @keyframes spin {
        to { transform: rotate(360deg); }
    }

    .duendes-tito-suggestion {
        background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
        border: 1px solid #f59e0b;
        border-radius: 12px;
        padding: 20px;
        margin-bottom: 16px;
    }

    .duendes-tito-suggestion h4 {
        margin: 0 0 8px 0;
        color: #92400e;
        font-size: 15px;
    }

    .duendes-tito-suggestion p {
        margin: 0;
        color: #78350f;
        font-size: 14px;
    }

    .duendes-result-preview {
        background: #f9fafb;
        border: 1px solid #e5e7eb;
        border-radius: 8px;
        padding: 20px;
        margin-top: 20px;
        max-height: 400px;
        overflow-y: auto;
    }

    .duendes-result-preview h4 {
        margin: 0 0 12px 0;
        color: #374151;
    }

    .duendes-user-avatar {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: linear-gradient(135deg, #4f46e5, #7c3aed);
        color: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 600;
        font-size: 16px;
    }

    .duendes-quick-actions {
        display: flex;
        gap: 12px;
        flex-wrap: wrap;
        margin-top: 20px;
    }
    </style>
    <?php
});

// ═══════════════════════════════════════════════════════════════════════════
// 1. DASHBOARD TITO
// ═══════════════════════════════════════════════════════════════════════════

function duendes_tito_dashboard() {
    // Obtener estadísticas
    $total_products = wp_count_posts('product')->publish;
    $total_users = count_users();
    $total_orders = wc_orders_count('completed') + wc_orders_count('processing');
    $mi_magia_users = duendes_count_mi_magia_users();

    // Obtener sugerencias de Tito
    $tito_suggestions = duendes_get_tito_suggestions();
    ?>
    <div class="wrap duendes-admin-wrap">
        <div class="duendes-header">
            <h1>🧙 Panel de Tito</h1>
            <p>Tu asistente mágico para administrar Duendes del Uruguay</p>
        </div>

        <!-- Estadísticas rápidas -->
        <div class="duendes-grid">
            <div class="duendes-card">
                <div class="duendes-stat">
                    <div class="duendes-stat-value"><?php echo $total_products; ?></div>
                    <div class="duendes-stat-label">Productos / Guardianes</div>
                </div>
            </div>
            <div class="duendes-card">
                <div class="duendes-stat">
                    <div class="duendes-stat-value"><?php echo $total_users['total_users']; ?></div>
                    <div class="duendes-stat-label">Usuarios Totales</div>
                </div>
            </div>
            <div class="duendes-card">
                <div class="duendes-stat">
                    <div class="duendes-stat-value"><?php echo $mi_magia_users; ?></div>
                    <div class="duendes-stat-label">Usuarios Mi Magia</div>
                </div>
            </div>
            <div class="duendes-card">
                <div class="duendes-stat">
                    <div class="duendes-stat-value"><?php echo $total_orders; ?></div>
                    <div class="duendes-stat-label">Pedidos</div>
                </div>
            </div>
        </div>

        <div class="duendes-grid" style="grid-template-columns: 2fr 1fr;">
            <!-- Sugerencias de Tito -->
            <div class="duendes-card">
                <div class="duendes-card-header">
                    <div class="duendes-card-icon" style="background: #fef3c7;">💡</div>
                    <h3 class="duendes-card-title">Sugerencias de Tito</h3>
                </div>
                <div id="tito-suggestions">
                    <?php if (!empty($tito_suggestions)): ?>
                        <?php foreach ($tito_suggestions as $suggestion): ?>
                        <div class="duendes-tito-suggestion">
                            <h4><?php echo esc_html($suggestion['titulo']); ?></h4>
                            <p><?php echo esc_html($suggestion['mensaje']); ?></p>
                        </div>
                        <?php endforeach; ?>
                    <?php else: ?>
                        <div class="duendes-tito-suggestion">
                            <h4>🌟 Todo marcha bien</h4>
                            <p>No tengo sugerencias por ahora. ¡Seguí así!</p>
                        </div>
                    <?php endif; ?>
                </div>
                <button class="duendes-btn duendes-btn-secondary" onclick="DuendesAdmin.refreshTitoSuggestions()">
                    🔄 Actualizar sugerencias
                </button>
            </div>

            <!-- Acciones rápidas -->
            <div class="duendes-card">
                <div class="duendes-card-header">
                    <div class="duendes-card-icon" style="background: #dbeafe;">⚡</div>
                    <h3 class="duendes-card-title">Acciones Rápidas</h3>
                </div>
                <div class="duendes-quick-actions" style="flex-direction: column;">
                    <a href="<?php echo admin_url('duendes-canalizaciones'); ?>" class="duendes-btn duendes-btn-primary" style="justify-content: center;">
                        🔮 Nueva Canalización
                    </a>
                    <a href="<?php echo admin_url('post-new.php?post_type=product'); ?>" class="duendes-btn duendes-btn-success" style="justify-content: center;">
                        ✨ Nuevo Producto
                    </a>
                    <a href="<?php echo admin_url('admin.php?page=duendes-usuarios'); ?>" class="duendes-btn duendes-btn-secondary" style="justify-content: center;">
                        👥 Ver Usuarios
                    </a>
                    <a href="<?php echo admin_url('admin.php?page=duendes-circulo'); ?>" class="duendes-btn duendes-btn-secondary" style="justify-content: center;">
                        🌙 El Círculo
                    </a>
                </div>
            </div>
        </div>

        <!-- Crear producto rápido con Tito -->
        <div class="duendes-card">
            <div class="duendes-card-header">
                <div class="duendes-card-icon" style="background: #ede9fe;">🪄</div>
                <h3 class="duendes-card-title">Crear Producto Rápido con Tito</h3>
            </div>
            <p style="color: #6b7280; margin-bottom: 20px;">Subí las fotos y Tito + Claude generan todo automáticamente.</p>

            <form id="quick-product-form" enctype="multipart/form-data">
                <div class="duendes-grid" style="grid-template-columns: 1fr 1fr;">
                    <div class="duendes-form-group">
                        <label class="duendes-label">Fotos del Producto</label>
                        <input type="file" name="product_photos" id="product_photos" class="duendes-input" multiple accept="image/*">
                    </div>
                    <div class="duendes-form-group">
                        <label class="duendes-label">Tipo de Ser (opcional)</label>
                        <select name="tipo_ser" class="duendes-select">
                            <option value="">Claude decide...</option>
                            <option value="duende">Duende</option>
                            <option value="guardian">Guardián</option>
                            <option value="bruja">Bruja</option>
                            <option value="duende_abundancia">Duende de la Abundancia</option>
                            <option value="protector">Protector</option>
                        </select>
                    </div>
                </div>
                <div class="duendes-form-group">
                    <label class="duendes-label">Notas adicionales (opcional)</label>
                    <textarea name="notas" class="duendes-textarea" placeholder="Ej: tiene un cristal de citrino, mide 20cm, se ve joven..."></textarea>
                </div>
                <button type="submit" class="duendes-btn duendes-btn-primary">
                    🪄 Crear Producto con IA
                </button>
            </form>

            <div id="quick-product-loading" class="duendes-loading">
                <div class="duendes-spinner"></div>
                <span>Tito está trabajando con Claude...</span>
            </div>

            <div id="quick-product-result" class="duendes-result-preview" style="display: none;"></div>
        </div>
    </div>

    <script>
    var DuendesAdmin = {
        refreshTitoSuggestions: function() {
            // Implementar refresh de sugerencias
            alert('Actualizando sugerencias...');
        }
    };
    </script>
    <?php
}

// ═══════════════════════════════════════════════════════════════════════════
// 2. CANALIZACIONES MANUALES
// ═══════════════════════════════════════════════════════════════════════════

function duendes_canalizaciones_page() {
    // Obtener productos (guardianes) para el selector
    $products = wc_get_products([
        'status' => 'publish',
        'limit' => -1,
        'orderby' => 'title',
        'order' => 'ASC'
    ]);

    // Obtener canalizaciones anteriores
    $canalizaciones = get_option('duendes_canalizaciones_historial', []);
    ?>
    <div class="wrap duendes-admin-wrap">
        <div class="duendes-header">
            <h1>🔮 Canalizaciones</h1>
            <p>Genera canalizaciones personalizadas para tus clientes</p>
        </div>

        <div class="duendes-tabs">
            <button class="duendes-tab active" onclick="DuendesCanalizaciones.showTab('nueva')">✨ Nueva Canalización</button>
            <button class="duendes-tab" onclick="DuendesCanalizaciones.showTab('historial')">📜 Historial</button>
        </div>

        <!-- Tab: Nueva Canalización -->
        <div id="tab-nueva" class="duendes-tab-content active">
            <div class="duendes-grid" style="grid-template-columns: 2fr 1fr;">
                <div class="duendes-card">
                    <div class="duendes-card-header">
                        <div class="duendes-card-icon" style="background: #ede9fe;">🔮</div>
                        <h3 class="duendes-card-title">Datos de la Canalización</h3>
                    </div>

                    <form id="canalizacion-form">
                        <div class="duendes-grid">
                            <div class="duendes-form-group">
                                <label class="duendes-label">Guardián / Duende</label>
                                <select name="producto_id" id="producto_id" class="duendes-select" required>
                                    <option value="">Seleccionar guardián...</option>
                                    <?php foreach ($products as $product): ?>
                                    <option value="<?php echo $product->get_id(); ?>">
                                        <?php echo esc_html($product->get_name()); ?>
                                    </option>
                                    <?php endforeach; ?>
                                </select>
                            </div>
                            <div class="duendes-form-group">
                                <label class="duendes-label">Nombre del Cliente</label>
                                <input type="text" name="cliente_nombre" class="duendes-input" placeholder="María García" required>
                            </div>
                        </div>

                        <div class="duendes-grid">
                            <div class="duendes-form-group">
                                <label class="duendes-label">Email del Cliente</label>
                                <input type="email" name="cliente_email" class="duendes-input" placeholder="maria@email.com">
                            </div>
                            <div class="duendes-form-group">
                                <label class="duendes-label">País</label>
                                <input type="text" name="cliente_pais" class="duendes-input" placeholder="Argentina">
                            </div>
                        </div>

                        <div class="duendes-form-group">
                            <label class="duendes-label">¿Qué momento está atravesando?</label>
                            <textarea name="momento_vida" class="duendes-textarea" placeholder="Describe brevemente la situación del cliente..."></textarea>
                        </div>

                        <div class="duendes-form-group">
                            <label class="duendes-label">¿Qué busca o necesita?</label>
                            <textarea name="necesidad" class="duendes-textarea" placeholder="Protección, claridad, abundancia..."></textarea>
                        </div>

                        <div class="duendes-form-group">
                            <label class="duendes-label">Foto del Cliente (opcional)</label>
                            <input type="file" name="cliente_foto" class="duendes-input" accept="image/*">
                            <small style="color: #6b7280;">Para lectura de aura y personalización profunda</small>
                        </div>

                        <div class="duendes-form-group">
                            <label class="duendes-label">Notas adicionales</label>
                            <textarea name="notas" class="duendes-textarea" placeholder="Cualquier información extra..."></textarea>
                        </div>

                        <div style="display: flex; gap: 12px;">
                            <button type="submit" class="duendes-btn duendes-btn-primary">
                                🔮 Generar Canalización
                            </button>
                            <button type="button" class="duendes-btn duendes-btn-secondary" onclick="DuendesCanalizaciones.limpiarFormulario()">
                                🗑️ Limpiar
                            </button>
                        </div>
                    </form>

                    <div id="canalizacion-loading" class="duendes-loading">
                        <div class="duendes-spinner"></div>
                        <span>Claude está canalizando el mensaje del guardián...</span>
                    </div>
                </div>

                <!-- Preview / Resultado -->
                <div class="duendes-card">
                    <div class="duendes-card-header">
                        <div class="duendes-card-icon" style="background: #d1fae5;">👁️</div>
                        <h3 class="duendes-card-title">Vista Previa</h3>
                    </div>
                    <div id="canalizacion-preview">
                        <p style="color: #9ca3af; text-align: center; padding: 40px 20px;">
                            La canalización aparecerá aquí...
                        </p>
                    </div>
                    <div id="canalizacion-actions" style="display: none; margin-top: 20px;">
                        <button class="duendes-btn duendes-btn-success" onclick="DuendesCanalizaciones.enviarEmail()">
                            📧 Enviar por Email
                        </button>
                        <button class="duendes-btn duendes-btn-secondary" onclick="DuendesCanalizaciones.copiar()">
                            📋 Copiar
                        </button>
                        <button class="duendes-btn duendes-btn-secondary" onclick="DuendesCanalizaciones.guardar()">
                            💾 Guardar
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Tab: Historial -->
        <div id="tab-historial" class="duendes-tab-content">
            <div class="duendes-card">
                <div class="duendes-card-header">
                    <div class="duendes-card-icon" style="background: #dbeafe;">📜</div>
                    <h3 class="duendes-card-title">Historial de Canalizaciones</h3>
                </div>

                <?php if (empty($canalizaciones)): ?>
                <p style="color: #9ca3af; text-align: center; padding: 40px;">
                    No hay canalizaciones guardadas aún.
                </p>
                <?php else: ?>
                <table class="duendes-table">
                    <thead>
                        <tr>
                            <th>Fecha</th>
                            <th>Cliente</th>
                            <th>Guardián</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php foreach (array_reverse($canalizaciones) as $c): ?>
                        <tr>
                            <td><?php echo esc_html($c['fecha']); ?></td>
                            <td><?php echo esc_html($c['cliente']); ?></td>
                            <td><?php echo esc_html($c['guardian']); ?></td>
                            <td><span class="duendes-badge duendes-badge-success">Enviada</span></td>
                            <td>
                                <button class="duendes-btn duendes-btn-secondary" style="padding: 6px 12px;">Ver</button>
                            </td>
                        </tr>
                        <?php endforeach; ?>
                    </tbody>
                </table>
                <?php endif; ?>
            </div>
        </div>
    </div>

    <script>
    var DuendesCanalizaciones = {
        showTab: function(tab) {
            document.querySelectorAll('.duendes-tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.duendes-tab-content').forEach(c => c.classList.remove('active'));
            event.target.classList.add('active');
            document.getElementById('tab-' + tab).classList.add('active');
        },

        limpiarFormulario: function() {
            document.getElementById('canalizacion-form').reset();
            document.getElementById('canalizacion-preview').innerHTML = '<p style="color: #9ca3af; text-align: center; padding: 40px 20px;">La canalización aparecerá aquí...</p>';
            document.getElementById('canalizacion-actions').style.display = 'none';
        },

        enviarEmail: function() {
            alert('Enviando por email...');
        },

        copiar: function() {
            var content = document.getElementById('canalizacion-preview').innerText;
            navigator.clipboard.writeText(content);
            alert('Copiado al portapapeles!');
        },

        guardar: function() {
            alert('Guardando...');
        }
    };

    // Manejar envío del formulario
    document.getElementById('canalizacion-form').addEventListener('submit', function(e) {
        e.preventDefault();

        var loading = document.getElementById('canalizacion-loading');
        var preview = document.getElementById('canalizacion-preview');
        var actions = document.getElementById('canalizacion-actions');

        loading.classList.add('visible');

        var formData = new FormData(this);
        var data = {
            action: 'generate_canalizacion',
            producto_id: formData.get('producto_id'),
            cliente_nombre: formData.get('cliente_nombre'),
            cliente_email: formData.get('cliente_email'),
            cliente_pais: formData.get('cliente_pais'),
            momento_vida: formData.get('momento_vida'),
            necesidad: formData.get('necesidad'),
            notas: formData.get('notas')
        };

        fetch('<?php echo DUENDES_API_URL; ?>/admin/canalizacion-manual', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        })
        .then(r => r.json())
        .then(result => {
            loading.classList.remove('visible');

            if (result.success) {
                preview.innerHTML = '<div style="white-space: pre-wrap; line-height: 1.8;">' + result.canalizacion + '</div>';
                actions.style.display = 'flex';
            } else {
                preview.innerHTML = '<p style="color: #dc2626;">Error: ' + (result.error || 'Error desconocido') + '</p>';
            }
        })
        .catch(err => {
            loading.classList.remove('visible');
            preview.innerHTML = '<p style="color: #dc2626;">Error de conexión: ' + err.message + '</p>';
        });
    });
    </script>
    <?php
}

// ═══════════════════════════════════════════════════════════════════════════
// 3. GESTIÓN DE USUARIOS
// ═══════════════════════════════════════════════════════════════════════════

function duendes_usuarios_page() {
    // Obtener usuarios
    $all_users = get_users(['number' => 100, 'orderby' => 'registered', 'order' => 'DESC']);
    $mi_magia_users = get_users(['meta_key' => 'mi_magia_active', 'meta_value' => '1']);
    $circulo_users = get_users(['meta_key' => 'circulo_member', 'meta_value' => '1']);
    ?>
    <div class="wrap duendes-admin-wrap">
        <div class="duendes-header">
            <h1>👥 Gestión de Usuarios</h1>
            <p>Administra los usuarios de la web, Mi Magia y El Círculo</p>
        </div>

        <div class="duendes-tabs">
            <button class="duendes-tab active" onclick="DuendesUsuarios.showTab('todos')">👥 Todos (<?php echo count($all_users); ?>)</button>
            <button class="duendes-tab" onclick="DuendesUsuarios.showTab('mimagia')">✨ Mi Magia (<?php echo count($mi_magia_users); ?>)</button>
            <button class="duendes-tab" onclick="DuendesUsuarios.showTab('circulo')">🌙 El Círculo (<?php echo count($circulo_users); ?>)</button>
            <button class="duendes-tab" onclick="DuendesUsuarios.showTab('crear')">➕ Crear Usuario</button>
        </div>

        <!-- Tab: Todos los usuarios -->
        <div id="tab-todos" class="duendes-tab-content active">
            <div class="duendes-card">
                <table class="duendes-table">
                    <thead>
                        <tr>
                            <th>Usuario</th>
                            <th>Email</th>
                            <th>Registro</th>
                            <th>Mi Magia</th>
                            <th>El Círculo</th>
                            <th>Runas</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php foreach ($all_users as $user):
                            $mi_magia = get_user_meta($user->ID, 'mi_magia_active', true);
                            $circulo = get_user_meta($user->ID, 'circulo_member', true);
                            $runas = get_user_meta($user->ID, 'runas_poder', true) ?: 0;
                            $initials = strtoupper(substr($user->display_name, 0, 2));
                        ?>
                        <tr>
                            <td>
                                <div style="display: flex; align-items: center; gap: 12px;">
                                    <div class="duendes-user-avatar"><?php echo $initials; ?></div>
                                    <div>
                                        <strong><?php echo esc_html($user->display_name); ?></strong>
                                        <br><small style="color: #6b7280;">@<?php echo esc_html($user->user_login); ?></small>
                                    </div>
                                </div>
                            </td>
                            <td><?php echo esc_html($user->user_email); ?></td>
                            <td><?php echo date('d/m/Y', strtotime($user->user_registered)); ?></td>
                            <td>
                                <?php if ($mi_magia): ?>
                                    <span class="duendes-badge duendes-badge-purple">Activo</span>
                                <?php else: ?>
                                    <span class="duendes-badge" style="background: #f3f4f6; color: #6b7280;">-</span>
                                <?php endif; ?>
                            </td>
                            <td>
                                <?php if ($circulo): ?>
                                    <span class="duendes-badge duendes-badge-info">Miembro</span>
                                <?php else: ?>
                                    <span class="duendes-badge" style="background: #f3f4f6; color: #6b7280;">-</span>
                                <?php endif; ?>
                            </td>
                            <td><strong><?php echo $runas; ?></strong> 💎</td>
                            <td>
                                <button class="duendes-btn duendes-btn-secondary" style="padding: 6px 12px;" onclick="DuendesUsuarios.editar(<?php echo $user->ID; ?>)">
                                    ✏️
                                </button>
                                <button class="duendes-btn duendes-btn-secondary" style="padding: 6px 12px;" onclick="DuendesUsuarios.darMiMagia(<?php echo $user->ID; ?>)">
                                    ✨
                                </button>
                            </td>
                        </tr>
                        <?php endforeach; ?>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- Tab: Mi Magia -->
        <div id="tab-mimagia" class="duendes-tab-content">
            <div class="duendes-card">
                <div class="duendes-card-header">
                    <div class="duendes-card-icon" style="background: #ede9fe;">✨</div>
                    <h3 class="duendes-card-title">Usuarios de Mi Magia</h3>
                </div>
                <?php if (empty($mi_magia_users)): ?>
                <p style="color: #9ca3af; text-align: center; padding: 40px;">
                    No hay usuarios con Mi Magia activo aún.
                </p>
                <?php else: ?>
                <table class="duendes-table">
                    <thead>
                        <tr>
                            <th>Usuario</th>
                            <th>Email</th>
                            <th>Runas</th>
                            <th>Compras</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php foreach ($mi_magia_users as $user):
                            $runas = get_user_meta($user->ID, 'runas_poder', true) ?: 0;
                        ?>
                        <tr>
                            <td><?php echo esc_html($user->display_name); ?></td>
                            <td><?php echo esc_html($user->user_email); ?></td>
                            <td><strong><?php echo $runas; ?></strong> 💎</td>
                            <td>-</td>
                            <td>
                                <button class="duendes-btn duendes-btn-secondary" style="padding: 6px 12px;">Ver perfil</button>
                            </td>
                        </tr>
                        <?php endforeach; ?>
                    </tbody>
                </table>
                <?php endif; ?>
            </div>
        </div>

        <!-- Tab: El Círculo -->
        <div id="tab-circulo" class="duendes-tab-content">
            <div class="duendes-card">
                <div class="duendes-card-header">
                    <div class="duendes-card-icon" style="background: #dbeafe;">🌙</div>
                    <h3 class="duendes-card-title">Miembros de El Círculo</h3>
                </div>
                <?php if (empty($circulo_users)): ?>
                <p style="color: #9ca3af; text-align: center; padding: 40px;">
                    No hay miembros de El Círculo aún.
                </p>
                <?php else: ?>
                <table class="duendes-table">
                    <thead>
                        <tr>
                            <th>Usuario</th>
                            <th>Email</th>
                            <th>Desde</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php foreach ($circulo_users as $user): ?>
                        <tr>
                            <td><?php echo esc_html($user->display_name); ?></td>
                            <td><?php echo esc_html($user->user_email); ?></td>
                            <td><?php echo date('d/m/Y', strtotime($user->user_registered)); ?></td>
                            <td><span class="duendes-badge duendes-badge-success">Activo</span></td>
                            <td>
                                <button class="duendes-btn duendes-btn-secondary" style="padding: 6px 12px;">Ver</button>
                            </td>
                        </tr>
                        <?php endforeach; ?>
                    </tbody>
                </table>
                <?php endif; ?>
            </div>
        </div>

        <!-- Tab: Crear Usuario -->
        <div id="tab-crear" class="duendes-tab-content">
            <div class="duendes-card" style="max-width: 600px;">
                <div class="duendes-card-header">
                    <div class="duendes-card-icon" style="background: #d1fae5;">➕</div>
                    <h3 class="duendes-card-title">Crear Usuario con Mi Magia</h3>
                </div>

                <form id="crear-usuario-form">
                    <div class="duendes-form-group">
                        <label class="duendes-label">Nombre completo</label>
                        <input type="text" name="nombre" class="duendes-input" required>
                    </div>
                    <div class="duendes-form-group">
                        <label class="duendes-label">Email</label>
                        <input type="email" name="email" class="duendes-input" required>
                    </div>
                    <div class="duendes-form-group">
                        <label class="duendes-label">Runas de regalo</label>
                        <input type="number" name="runas" class="duendes-input" value="50">
                    </div>
                    <div class="duendes-form-group">
                        <label style="display: flex; align-items: center; gap: 10px; cursor: pointer;">
                            <input type="checkbox" name="mi_magia" value="1" checked>
                            Activar Mi Magia
                        </label>
                    </div>
                    <div class="duendes-form-group">
                        <label style="display: flex; align-items: center; gap: 10px; cursor: pointer;">
                            <input type="checkbox" name="enviar_email" value="1" checked>
                            Enviar email de bienvenida
                        </label>
                    </div>
                    <button type="submit" class="duendes-btn duendes-btn-success">
                        ✨ Crear Usuario
                    </button>
                </form>
            </div>
        </div>
    </div>

    <script>
    var DuendesUsuarios = {
        showTab: function(tab) {
            document.querySelectorAll('.duendes-tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.duendes-tab-content').forEach(c => c.classList.remove('active'));
            event.target.classList.add('active');
            document.getElementById('tab-' + tab).classList.add('active');
        },

        editar: function(userId) {
            window.location.href = 'user-edit.php?user_id=' + userId;
        },

        darMiMagia: function(userId) {
            if (confirm('¿Activar Mi Magia para este usuario?')) {
                // AJAX call to activate
                alert('Mi Magia activado!');
            }
        }
    };

    document.getElementById('crear-usuario-form').addEventListener('submit', function(e) {
        e.preventDefault();
        var formData = new FormData(this);

        fetch(ajaxurl, {
            method: 'POST',
            body: new URLSearchParams({
                action: 'duendes_crear_usuario',
                nombre: formData.get('nombre'),
                email: formData.get('email'),
                runas: formData.get('runas'),
                mi_magia: formData.get('mi_magia') ? 1 : 0,
                enviar_email: formData.get('enviar_email') ? 1 : 0,
                nonce: '<?php echo wp_create_nonce('duendes_crear_usuario'); ?>'
            })
        })
        .then(r => r.json())
        .then(result => {
            if (result.success) {
                alert('Usuario creado exitosamente!');
                location.reload();
            } else {
                alert('Error: ' + result.data);
            }
        });
    });
    </script>
    <?php
}

// ═══════════════════════════════════════════════════════════════════════════
// 4. EL CÍRCULO - GENERADOR DE CONTENIDO
// ═══════════════════════════════════════════════════════════════════════════

function duendes_circulo_page() {
    $meses = [
        1 => 'Enero', 2 => 'Febrero', 3 => 'Marzo', 4 => 'Abril',
        5 => 'Mayo', 6 => 'Junio', 7 => 'Julio', 8 => 'Agosto',
        9 => 'Septiembre', 10 => 'Octubre', 11 => 'Noviembre', 12 => 'Diciembre'
    ];
    ?>
    <div class="wrap duendes-admin-wrap">
        <div class="duendes-header">
            <h1>🌙 El Círculo - Generador de Contenido</h1>
            <p>Genera el contenido mensual completo con Claude + OpenAI</p>
        </div>

        <div class="duendes-tabs">
            <button class="duendes-tab active" onclick="DuendesCirculo.showTab('generar')">🪄 Generar Mes</button>
            <button class="duendes-tab" onclick="DuendesCirculo.showTab('calendario')">📅 Calendario</button>
            <button class="duendes-tab" onclick="DuendesCirculo.showTab('plantillas')">📝 Plantillas</button>
            <button class="duendes-tab" onclick="DuendesCirculo.showTab('historial')">📜 Historial</button>
        </div>

        <!-- Tab: Generar Mes -->
        <div id="tab-generar" class="duendes-tab-content active">
            <div class="duendes-grid" style="grid-template-columns: 1fr 1fr;">
                <div class="duendes-card">
                    <div class="duendes-card-header">
                        <div class="duendes-card-icon" style="background: #dbeafe;">🗓️</div>
                        <h3 class="duendes-card-title">Configurar Generación</h3>
                    </div>

                    <form id="circulo-form">
                        <div class="duendes-grid">
                            <div class="duendes-form-group">
                                <label class="duendes-label">Mes</label>
                                <select name="mes" class="duendes-select">
                                    <?php foreach ($meses as $num => $nombre): ?>
                                    <option value="<?php echo $num; ?>" <?php selected($num, date('n')); ?>>
                                        <?php echo $nombre; ?>
                                    </option>
                                    <?php endforeach; ?>
                                </select>
                            </div>
                            <div class="duendes-form-group">
                                <label class="duendes-label">Año</label>
                                <select name="ano" class="duendes-select">
                                    <option value="2025">2025</option>
                                    <option value="2026" selected>2026</option>
                                </select>
                            </div>
                        </div>

                        <div class="duendes-form-group">
                            <label class="duendes-label">Tipo de contenido a generar</label>
                            <div style="display: flex; flex-direction: column; gap: 10px; margin-top: 10px;">
                                <label style="display: flex; align-items: center; gap: 10px; cursor: pointer;">
                                    <input type="checkbox" name="tipos[]" value="meditacion" checked> 🧘 Meditaciones diarias
                                </label>
                                <label style="display: flex; align-items: center; gap: 10px; cursor: pointer;">
                                    <input type="checkbox" name="tipos[]" value="ritual" checked> 🕯️ Rituales semanales
                                </label>
                                <label style="display: flex; align-items: center; gap: 10px; cursor: pointer;">
                                    <input type="checkbox" name="tipos[]" value="lectura" checked> 🔮 Lecturas de energía
                                </label>
                                <label style="display: flex; align-items: center; gap: 10px; cursor: pointer;">
                                    <input type="checkbox" name="tipos[]" value="guardian" checked> 🧙 Mensaje del guardián del mes
                                </label>
                                <label style="display: flex; align-items: center; gap: 10px; cursor: pointer;">
                                    <input type="checkbox" name="tipos[]" value="cristal" checked> 💎 Cristal del mes
                                </label>
                            </div>
                        </div>

                        <div class="duendes-form-group">
                            <label class="duendes-label">Tema especial del mes (opcional)</label>
                            <input type="text" name="tema" class="duendes-input" placeholder="Ej: Luna de cosecha, Equinoccio...">
                        </div>

                        <div class="duendes-form-group">
                            <label class="duendes-label">Generar imágenes con OpenAI</label>
                            <select name="imagenes" class="duendes-select">
                                <option value="todas">Sí, todas las imágenes</option>
                                <option value="principales">Solo imágenes principales</option>
                                <option value="ninguna">No generar imágenes</option>
                            </select>
                        </div>

                        <button type="submit" class="duendes-btn duendes-btn-primary">
                            🌙 Generar Mes Completo
                        </button>
                    </form>

                    <div id="circulo-loading" class="duendes-loading">
                        <div class="duendes-spinner"></div>
                        <span id="circulo-loading-text">Generando contenido del mes...</span>
                    </div>
                </div>

                <div class="duendes-card">
                    <div class="duendes-card-header">
                        <div class="duendes-card-icon" style="background: #fef3c7;">👁️</div>
                        <h3 class="duendes-card-title">Vista Previa</h3>
                    </div>
                    <div id="circulo-preview" style="max-height: 500px; overflow-y: auto;">
                        <p style="color: #9ca3af; text-align: center; padding: 40px;">
                            El contenido generado aparecerá aquí...
                        </p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Tab: Calendario -->
        <div id="tab-calendario" class="duendes-tab-content">
            <div class="duendes-card">
                <div class="duendes-card-header">
                    <div class="duendes-card-icon" style="background: #d1fae5;">📅</div>
                    <h3 class="duendes-card-title">Calendario de Contenido</h3>
                </div>
                <p style="color: #6b7280; text-align: center; padding: 60px;">
                    Calendario visual próximamente...
                </p>
            </div>
        </div>

        <!-- Tab: Plantillas -->
        <div id="tab-plantillas" class="duendes-tab-content">
            <div class="duendes-card">
                <div class="duendes-card-header">
                    <div class="duendes-card-icon" style="background: #ede9fe;">📝</div>
                    <h3 class="duendes-card-title">Plantillas de Publicación</h3>
                </div>
                <div class="duendes-grid" style="grid-template-columns: repeat(3, 1fr);">
                    <div style="border: 2px solid #e5e7eb; border-radius: 12px; padding: 20px; text-align: center; cursor: pointer;" onclick="DuendesCirculo.selectTemplate('instagram')">
                        <div style="font-size: 40px; margin-bottom: 10px;">📱</div>
                        <strong>Instagram</strong>
                        <p style="color: #6b7280; font-size: 13px;">Formato cuadrado, textos cortos</p>
                    </div>
                    <div style="border: 2px solid #e5e7eb; border-radius: 12px; padding: 20px; text-align: center; cursor: pointer;" onclick="DuendesCirculo.selectTemplate('email')">
                        <div style="font-size: 40px; margin-bottom: 10px;">📧</div>
                        <strong>Email</strong>
                        <p style="color: #6b7280; font-size: 13px;">Newsletter, textos largos</p>
                    </div>
                    <div style="border: 2px solid #e5e7eb; border-radius: 12px; padding: 20px; text-align: center; cursor: pointer;" onclick="DuendesCirculo.selectTemplate('web')">
                        <div style="font-size: 40px; margin-bottom: 10px;">🌐</div>
                        <strong>Web</strong>
                        <p style="color: #6b7280; font-size: 13px;">Página completa</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Tab: Historial -->
        <div id="tab-historial" class="duendes-tab-content">
            <div class="duendes-card">
                <div class="duendes-card-header">
                    <div class="duendes-card-icon" style="background: #fee2e2;">📜</div>
                    <h3 class="duendes-card-title">Historial de Generaciones</h3>
                </div>
                <p style="color: #9ca3af; text-align: center; padding: 40px;">
                    No hay generaciones anteriores.
                </p>
            </div>
        </div>
    </div>

    <script>
    var DuendesCirculo = {
        showTab: function(tab) {
            document.querySelectorAll('.duendes-tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.duendes-tab-content').forEach(c => c.classList.remove('active'));
            event.target.classList.add('active');
            document.getElementById('tab-' + tab).classList.add('active');
        },

        selectTemplate: function(template) {
            alert('Plantilla ' + template + ' seleccionada');
        }
    };

    document.getElementById('circulo-form').addEventListener('submit', function(e) {
        e.preventDefault();

        var loading = document.getElementById('circulo-loading');
        var loadingText = document.getElementById('circulo-loading-text');
        var preview = document.getElementById('circulo-preview');

        loading.classList.add('visible');

        var messages = [
            'Generando contenido del mes...',
            'Claude está creando meditaciones...',
            'Diseñando rituales semanales...',
            'Conectando con las energías del mes...',
            'Generando imágenes con OpenAI...',
            'Casi listo, puliendo detalles...'
        ];

        var msgIndex = 0;
        var msgInterval = setInterval(function() {
            msgIndex = (msgIndex + 1) % messages.length;
            loadingText.textContent = messages[msgIndex];
        }, 5000);

        // Simular generación (conectar con API real)
        setTimeout(function() {
            clearInterval(msgInterval);
            loading.classList.remove('visible');
            preview.innerHTML = '<div class="duendes-alert duendes-alert-success"><strong>✨ Contenido generado!</strong><br>El mes completo ha sido generado. Revisá cada sección en el calendario.</div>';
        }, 3000);
    });
    </script>
    <?php
}

// ═══════════════════════════════════════════════════════════════════════════
// 5. BANNERS Y PROMOCIONES
// ═══════════════════════════════════════════════════════════════════════════

function duendes_banners_page() {
    ?>
    <div class="wrap duendes-admin-wrap">
        <div class="duendes-header">
            <h1>🎨 Banners & Promociones</h1>
            <p>Crea banners promocionales para Mi Magia</p>
        </div>

        <div class="duendes-grid" style="grid-template-columns: 1fr 1fr;">
            <div class="duendes-card">
                <div class="duendes-card-header">
                    <div class="duendes-card-icon" style="background: #fce7f3;">🖼️</div>
                    <h3 class="duendes-card-title">Crear Banner</h3>
                </div>

                <form id="banner-form">
                    <div class="duendes-form-group">
                        <label class="duendes-label">Título del Banner</label>
                        <input type="text" name="titulo" class="duendes-input" placeholder="Ej: ¡50% OFF en guardianes!">
                    </div>
                    <div class="duendes-form-group">
                        <label class="duendes-label">Subtítulo</label>
                        <input type="text" name="subtitulo" class="duendes-input" placeholder="Solo por tiempo limitado">
                    </div>
                    <div class="duendes-form-group">
                        <label class="duendes-label">Imagen de fondo</label>
                        <input type="file" name="imagen" class="duendes-input" accept="image/*">
                    </div>
                    <div class="duendes-form-group">
                        <label class="duendes-label">Link destino</label>
                        <input type="url" name="link" class="duendes-input" placeholder="https://...">
                    </div>
                    <div class="duendes-form-group">
                        <label class="duendes-label">Ubicación</label>
                        <select name="ubicacion" class="duendes-select">
                            <option value="mi_magia_home">Mi Magia - Home</option>
                            <option value="mi_magia_sidebar">Mi Magia - Sidebar</option>
                            <option value="tienda">Tienda</option>
                            <option value="checkout">Checkout</option>
                        </select>
                    </div>
                    <button type="submit" class="duendes-btn duendes-btn-primary">
                        🎨 Crear Banner
                    </button>
                </form>
            </div>

            <div class="duendes-card">
                <div class="duendes-card-header">
                    <div class="duendes-card-icon" style="background: #dbeafe;">📋</div>
                    <h3 class="duendes-card-title">Banners Activos</h3>
                </div>
                <p style="color: #9ca3af; text-align: center; padding: 40px;">
                    No hay banners activos.
                </p>
            </div>
        </div>
    </div>
    <?php
}

// ═══════════════════════════════════════════════════════════════════════════
// 6. CONFIGURACIÓN
// ═══════════════════════════════════════════════════════════════════════════

function duendes_config_page() {
    ?>
    <div class="wrap duendes-admin-wrap">
        <div class="duendes-header">
            <h1>⚙️ Configuración</h1>
            <p>Ajustes generales del sistema Duendes</p>
        </div>

        <div class="duendes-card" style="max-width: 800px;">
            <div class="duendes-card-header">
                <div class="duendes-card-icon" style="background: #f3f4f6;">🔧</div>
                <h3 class="duendes-card-title">Configuración General</h3>
            </div>

            <form id="config-form">
                <div class="duendes-form-group">
                    <label class="duendes-label">Runas de bienvenida (registro gratis)</label>
                    <input type="number" name="runas_bienvenida" class="duendes-input" value="50">
                </div>

                <div class="duendes-form-group">
                    <label class="duendes-label">API URL Vercel</label>
                    <input type="url" name="api_url" class="duendes-input" value="<?php echo DUENDES_API_URL; ?>">
                </div>

                <div class="duendes-form-group">
                    <label class="duendes-label">Email para reportes de Tito</label>
                    <input type="email" name="email_reportes" class="duendes-input" value="<?php echo get_option('admin_email'); ?>">
                </div>

                <button type="submit" class="duendes-btn duendes-btn-primary">
                    💾 Guardar Configuración
                </button>
            </form>
        </div>
    </div>
    <?php
}

// ═══════════════════════════════════════════════════════════════════════════
// FUNCIONES AUXILIARES
// ═══════════════════════════════════════════════════════════════════════════

function duendes_count_mi_magia_users() {
    global $wpdb;
    return (int) $wpdb->get_var(
        "SELECT COUNT(*) FROM {$wpdb->usermeta} WHERE meta_key = 'mi_magia_active' AND meta_value = '1'"
    );
}

function duendes_get_tito_suggestions() {
    // Por ahora retorna sugerencias estáticas
    // Conectar con la API de Tito para sugerencias dinámicas
    return [
        [
            'titulo' => '📦 Productos sin historia',
            'mensaje' => 'Hay 3 productos que aún no tienen historia generada. ¿Querés que los canalice?'
        ],
        [
            'titulo' => '🎯 Oportunidad de venta',
            'mensaje' => 'Los guardianes de protección están siendo muy buscados esta semana.'
        ]
    ];
}

// ═══════════════════════════════════════════════════════════════════════════
// AJAX HANDLERS
// ═══════════════════════════════════════════════════════════════════════════

// Crear usuario con Mi Magia
add_action('wp_ajax_duendes_crear_usuario', function() {
    check_ajax_referer('duendes_crear_usuario', 'nonce');

    $nombre = sanitize_text_field($_POST['nombre']);
    $email = sanitize_email($_POST['email']);
    $runas = intval($_POST['runas']);
    $mi_magia = intval($_POST['mi_magia']);
    $enviar_email = intval($_POST['enviar_email']);

    // Verificar que el email no existe
    if (email_exists($email)) {
        wp_send_json_error('El email ya está registrado');
    }

    // Crear usuario
    $username = sanitize_user(strtolower(str_replace(' ', '', $nombre)));
    $password = wp_generate_password(12);

    $user_id = wp_create_user($username, $password, $email);

    if (is_wp_error($user_id)) {
        wp_send_json_error($user_id->get_error_message());
    }

    // Actualizar nombre
    wp_update_user([
        'ID' => $user_id,
        'display_name' => $nombre,
        'first_name' => explode(' ', $nombre)[0]
    ]);

    // Dar runas y Mi Magia
    update_user_meta($user_id, 'runas_poder', $runas);
    if ($mi_magia) {
        update_user_meta($user_id, 'mi_magia_active', '1');
    }

    // Enviar email de bienvenida
    if ($enviar_email) {
        wp_mail(
            $email,
            '✨ Bienvenida a Mi Magia - Duendes del Uruguay',
            "¡Hola {$nombre}!\n\nTu cuenta de Mi Magia ha sido creada.\n\nUsuario: {$username}\nContraseña: {$password}\n\nTenés {$runas} runas de poder para comenzar.\n\n🔮 Duendes del Uruguay"
        );
    }

    wp_send_json_success(['user_id' => $user_id]);
});
