<?php
/**
 * Plugin Name: Guardian Intelligence
 * Description: Panel de control de inteligencia artificial para Duendes del Uruguay
 * Version: 1.0
 * Author: Duendes del Uruguay
 */

if (!defined('ABSPATH')) exit;

// ═══════════════════════════════════════════════════════════════════════════
// CONFIGURACIÓN
// ═══════════════════════════════════════════════════════════════════════════

define('GI_API_BASE', 'https://duendes-vercel.vercel.app/api/guardian-intelligence');

// ═══════════════════════════════════════════════════════════════════════════
// MENÚ DE ADMINISTRACIÓN
// ═══════════════════════════════════════════════════════════════════════════

add_action('admin_menu', function() {
    add_menu_page(
        'Guardian Intelligence',
        '🧠 Inteligencia',
        'manage_woocommerce',
        'guardian-intelligence',
        'gi_dashboard_page',
        'dashicons-superhero-alt',
        56
    );

    add_submenu_page(
        'guardian-intelligence',
        'Dashboard',
        '📊 Dashboard',
        'manage_woocommerce',
        'guardian-intelligence',
        'gi_dashboard_page'
    );

    add_submenu_page(
        'guardian-intelligence',
        'Analizar Historias',
        '🔍 Analizar',
        'manage_woocommerce',
        'gi-analyze',
        'gi_analyze_page'
    );

    add_submenu_page(
        'guardian-intelligence',
        'Generar Contenido',
        '✨ Generar',
        'manage_woocommerce',
        'gi-generate',
        'gi_generate_page'
    );

    add_submenu_page(
        'guardian-intelligence',
        'SEO',
        '🎯 SEO',
        'manage_woocommerce',
        'gi-seo',
        'gi_seo_page'
    );

    add_submenu_page(
        'guardian-intelligence',
        'Configuración',
        '⚙️ Config',
        'manage_woocommerce',
        'gi-settings',
        'gi_settings_page'
    );
});

// ═══════════════════════════════════════════════════════════════════════════
// ESTILOS GLOBALES ADMIN
// ═══════════════════════════════════════════════════════════════════════════

add_action('admin_head', function() {
    $screen = get_current_screen();
    if (strpos($screen->id, 'guardian-intelligence') === false && $screen->id !== 'product') return;
    ?>
    <style>
        :root {
            --gi-gold: #C6A962;
            --gi-gold-dark: #a88a42;
            --gi-green: #1B4D3E;
            --gi-green-dark: #0d2d24;
            --gi-bg: #0f0f0f;
            --gi-bg-light: #1a1510;
            --gi-text: #e6edf3;
            --gi-text-muted: rgba(255,255,255,0.6);
            --gi-border: rgba(198,169,98,0.2);
            --gi-success: #22c55e;
            --gi-warning: #f59e0b;
            --gi-error: #ef4444;
            --gi-info: #3b82f6;
        }

        .gi-wrap {
            background: linear-gradient(180deg, var(--gi-bg) 0%, var(--gi-bg-light) 100%);
            color: var(--gi-text);
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            min-height: calc(100vh - 100px);
            margin: -10px -20px -10px -20px;
            padding: 0;
        }

        .gi-header {
            background: linear-gradient(135deg, var(--gi-green) 0%, var(--gi-green-dark) 100%);
            padding: 30px 40px;
            border-bottom: 3px solid var(--gi-gold);
        }

        .gi-header h1 {
            margin: 0;
            color: var(--gi-gold);
            font-family: 'Cinzel', serif;
            font-size: 28px;
            display: flex;
            align-items: center;
            gap: 15px;
        }

        .gi-header p {
            margin: 10px 0 0 0;
            color: var(--gi-text-muted);
            font-size: 14px;
        }

        .gi-content {
            padding: 30px 40px;
        }

        /* Status Indicator */
        .gi-status-bar {
            display: flex;
            gap: 20px;
            margin-bottom: 30px;
            flex-wrap: wrap;
        }

        .gi-status-item {
            background: rgba(0,0,0,0.3);
            border: 1px solid var(--gi-border);
            border-radius: 12px;
            padding: 20px 25px;
            display: flex;
            align-items: center;
            gap: 15px;
            min-width: 200px;
        }

        .gi-status-dot {
            width: 12px;
            height: 12px;
            border-radius: 50%;
            flex-shrink: 0;
        }

        .gi-status-dot.green { background: var(--gi-success); box-shadow: 0 0 10px var(--gi-success); }
        .gi-status-dot.yellow { background: var(--gi-warning); box-shadow: 0 0 10px var(--gi-warning); }
        .gi-status-dot.red { background: var(--gi-error); box-shadow: 0 0 10px var(--gi-error); }

        .gi-status-info h4 {
            margin: 0;
            color: var(--gi-text);
            font-size: 14px;
            font-weight: 600;
        }

        .gi-status-info span {
            color: var(--gi-text-muted);
            font-size: 12px;
        }

        /* Cards Grid */
        .gi-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 25px;
            margin-bottom: 30px;
        }

        .gi-card {
            background: rgba(255,255,255,0.03);
            border: 1px solid var(--gi-border);
            border-radius: 16px;
            overflow: hidden;
        }

        .gi-card-header {
            background: rgba(0,0,0,0.2);
            padding: 20px 25px;
            border-bottom: 1px solid var(--gi-border);
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .gi-card-header h3 {
            margin: 0;
            color: var(--gi-gold);
            font-size: 16px;
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .gi-card-body {
            padding: 25px;
        }

        /* Metrics */
        .gi-metric {
            text-align: center;
            padding: 15px;
        }

        .gi-metric-value {
            font-size: 42px;
            font-weight: 700;
            color: var(--gi-gold);
            line-height: 1;
            margin-bottom: 5px;
        }

        .gi-metric-label {
            color: var(--gi-text-muted);
            font-size: 13px;
        }

        .gi-metrics-row {
            display: flex;
            justify-content: space-around;
            flex-wrap: wrap;
        }

        /* Alerts */
        .gi-alert {
            padding: 15px 20px;
            border-radius: 10px;
            margin-bottom: 15px;
            display: flex;
            align-items: flex-start;
            gap: 12px;
        }

        .gi-alert.critical {
            background: rgba(239,68,68,0.1);
            border: 1px solid rgba(239,68,68,0.3);
        }

        .gi-alert.warning {
            background: rgba(245,158,11,0.1);
            border: 1px solid rgba(245,158,11,0.3);
        }

        .gi-alert.info {
            background: rgba(59,130,246,0.1);
            border: 1px solid rgba(59,130,246,0.3);
        }

        .gi-alert-icon {
            font-size: 18px;
            flex-shrink: 0;
        }

        .gi-alert-content {
            flex: 1;
        }

        .gi-alert-title {
            font-weight: 600;
            margin-bottom: 3px;
        }

        .gi-alert.critical .gi-alert-title { color: var(--gi-error); }
        .gi-alert.warning .gi-alert-title { color: var(--gi-warning); }
        .gi-alert.info .gi-alert-title { color: var(--gi-info); }

        .gi-alert-text {
            color: var(--gi-text-muted);
            font-size: 13px;
        }

        .gi-alert-time {
            color: var(--gi-text-muted);
            font-size: 11px;
            flex-shrink: 0;
        }

        /* Buttons */
        .gi-btn {
            padding: 12px 24px;
            border: none;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s;
            display: inline-flex;
            align-items: center;
            gap: 8px;
        }

        .gi-btn-primary {
            background: linear-gradient(135deg, var(--gi-gold) 0%, var(--gi-gold-dark) 100%);
            color: #000;
        }

        .gi-btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 30px rgba(198,169,98,0.4);
        }

        .gi-btn-secondary {
            background: rgba(255,255,255,0.1);
            color: var(--gi-text);
            border: 1px solid var(--gi-border);
        }

        .gi-btn-secondary:hover {
            background: rgba(255,255,255,0.15);
            border-color: var(--gi-gold);
        }

        .gi-btn-success {
            background: var(--gi-success);
            color: #fff;
        }

        .gi-btn-danger {
            background: var(--gi-error);
            color: #fff;
        }

        .gi-btn:disabled {
            opacity: 0.5;
            cursor: not-allowed;
            transform: none !important;
        }

        /* Toggle Switch */
        .gi-toggle {
            display: flex;
            align-items: center;
            gap: 10px;
            cursor: pointer;
        }

        .gi-toggle-switch {
            width: 50px;
            height: 26px;
            background: rgba(255,255,255,0.1);
            border-radius: 13px;
            position: relative;
            transition: all 0.3s;
        }

        .gi-toggle-switch::after {
            content: '';
            position: absolute;
            width: 22px;
            height: 22px;
            background: #fff;
            border-radius: 50%;
            top: 2px;
            left: 2px;
            transition: all 0.3s;
        }

        .gi-toggle.active .gi-toggle-switch {
            background: var(--gi-success);
        }

        .gi-toggle.active .gi-toggle-switch::after {
            left: 26px;
        }

        .gi-toggle-label {
            color: var(--gi-text);
            font-size: 14px;
        }

        /* Table */
        .gi-table {
            width: 100%;
            border-collapse: collapse;
        }

        .gi-table th {
            text-align: left;
            padding: 12px 15px;
            background: rgba(0,0,0,0.2);
            color: var(--gi-gold);
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            border-bottom: 1px solid var(--gi-border);
        }

        .gi-table td {
            padding: 15px;
            border-bottom: 1px solid rgba(255,255,255,0.05);
            color: var(--gi-text);
            font-size: 14px;
        }

        .gi-table tr:hover td {
            background: rgba(255,255,255,0.02);
        }

        /* Score Badge */
        .gi-score {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 45px;
            height: 45px;
            border-radius: 50%;
            font-weight: 700;
            font-size: 14px;
        }

        .gi-score.excellent {
            background: rgba(34,197,94,0.2);
            color: var(--gi-success);
            border: 2px solid var(--gi-success);
        }

        .gi-score.good {
            background: rgba(59,130,246,0.2);
            color: var(--gi-info);
            border: 2px solid var(--gi-info);
        }

        .gi-score.warning {
            background: rgba(245,158,11,0.2);
            color: var(--gi-warning);
            border: 2px solid var(--gi-warning);
        }

        .gi-score.critical {
            background: rgba(239,68,68,0.2);
            color: var(--gi-error);
            border: 2px solid var(--gi-error);
        }

        /* Progress Bar */
        .gi-progress {
            height: 8px;
            background: rgba(255,255,255,0.1);
            border-radius: 4px;
            overflow: hidden;
        }

        .gi-progress-bar {
            height: 100%;
            border-radius: 4px;
            transition: width 0.5s ease;
        }

        .gi-progress-bar.green { background: var(--gi-success); }
        .gi-progress-bar.yellow { background: var(--gi-warning); }
        .gi-progress-bar.red { background: var(--gi-error); }

        /* Loading */
        .gi-loading {
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 40px;
            color: var(--gi-gold);
        }

        .gi-spinner {
            width: 30px;
            height: 30px;
            border: 3px solid rgba(198,169,98,0.2);
            border-top-color: var(--gi-gold);
            border-radius: 50%;
            animation: gi-spin 1s linear infinite;
            margin-right: 15px;
        }

        @keyframes gi-spin {
            to { transform: rotate(360deg); }
        }

        /* Empty State */
        .gi-empty {
            text-align: center;
            padding: 40px;
            color: var(--gi-text-muted);
        }

        .gi-empty-icon {
            font-size: 48px;
            margin-bottom: 15px;
            opacity: 0.5;
        }

        /* Saldos API */
        .gi-saldo-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 12px 0;
            border-bottom: 1px solid rgba(255,255,255,0.05);
        }

        .gi-saldo-item:last-child {
            border-bottom: none;
        }

        .gi-saldo-name {
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .gi-saldo-logo {
            width: 24px;
            height: 24px;
            border-radius: 6px;
        }

        .gi-saldo-value {
            font-weight: 600;
        }

        .gi-saldo-value.low {
            color: var(--gi-warning);
        }

        .gi-saldo-value.critical {
            color: var(--gi-error);
        }

        /* Quick Actions */
        .gi-quick-actions {
            display: flex;
            gap: 15px;
            flex-wrap: wrap;
        }

        .gi-quick-action {
            flex: 1;
            min-width: 150px;
            background: rgba(0,0,0,0.3);
            border: 1px solid var(--gi-border);
            border-radius: 12px;
            padding: 20px;
            text-align: center;
            cursor: pointer;
            transition: all 0.2s;
        }

        .gi-quick-action:hover {
            border-color: var(--gi-gold);
            transform: translateY(-3px);
        }

        .gi-quick-action-icon {
            font-size: 32px;
            margin-bottom: 10px;
        }

        .gi-quick-action-label {
            color: var(--gi-text);
            font-size: 13px;
            font-weight: 500;
        }

        /* Tabs */
        .gi-tabs {
            display: flex;
            gap: 5px;
            background: rgba(0,0,0,0.2);
            padding: 5px;
            border-radius: 10px;
            margin-bottom: 20px;
        }

        .gi-tab {
            padding: 10px 20px;
            border: none;
            background: transparent;
            color: var(--gi-text-muted);
            font-size: 14px;
            cursor: pointer;
            border-radius: 6px;
            transition: all 0.2s;
        }

        .gi-tab:hover {
            color: var(--gi-text);
        }

        .gi-tab.active {
            background: var(--gi-gold);
            color: #000;
            font-weight: 600;
        }

        /* Font */
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600&display=swap');
    </style>
    <?php
});

// ═══════════════════════════════════════════════════════════════════════════
// PÁGINA: DASHBOARD
// ═══════════════════════════════════════════════════════════════════════════

function gi_dashboard_page() {
    ?>
    <div class="gi-wrap">
        <div class="gi-header">
            <h1>🧠 Guardian Intelligence</h1>
            <p>Centro de control de inteligencia artificial para Duendes del Uruguay</p>
        </div>

        <div class="gi-content">
            <!-- Status Bar -->
            <div class="gi-status-bar" id="gi-status-bar">
                <div class="gi-status-item">
                    <div class="gi-status-dot green" id="gi-status-monitor"></div>
                    <div class="gi-status-info">
                        <h4>Monitor 24/7</h4>
                        <span id="gi-status-monitor-text">Cargando...</span>
                    </div>
                </div>
                <div class="gi-status-item">
                    <div class="gi-status-dot green" id="gi-status-tito"></div>
                    <div class="gi-status-info">
                        <h4>Tito Chat</h4>
                        <span id="gi-status-tito-text">Verificando...</span>
                    </div>
                </div>
                <div class="gi-status-item">
                    <div class="gi-status-dot green" id="gi-status-woo"></div>
                    <div class="gi-status-info">
                        <h4>WooCommerce</h4>
                        <span id="gi-status-woo-text">Verificando...</span>
                    </div>
                </div>
                <div class="gi-status-item">
                    <div class="gi-status-dot green" id="gi-status-kv"></div>
                    <div class="gi-status-info">
                        <h4>Base de Datos</h4>
                        <span id="gi-status-kv-text">Verificando...</span>
                    </div>
                </div>
            </div>

            <!-- Quick Actions -->
            <div class="gi-card" style="margin-bottom: 25px;">
                <div class="gi-card-header">
                    <h3>⚡ Acciones Rápidas</h3>
                </div>
                <div class="gi-card-body">
                    <div class="gi-quick-actions">
                        <div class="gi-quick-action" onclick="giEjecutarMonitoreo()">
                            <div class="gi-quick-action-icon">🔍</div>
                            <div class="gi-quick-action-label">Ejecutar Monitoreo</div>
                        </div>
                        <div class="gi-quick-action" onclick="location.href='?page=gi-analyze'">
                            <div class="gi-quick-action-icon">📊</div>
                            <div class="gi-quick-action-label">Analizar Catálogo</div>
                        </div>
                        <div class="gi-quick-action" onclick="location.href='?page=gi-seo'">
                            <div class="gi-quick-action-icon">🎯</div>
                            <div class="gi-quick-action-label">Optimizar SEO</div>
                        </div>
                        <div class="gi-quick-action" onclick="giVerAlertas()">
                            <div class="gi-quick-action-icon">🔔</div>
                            <div class="gi-quick-action-label">Ver Alertas</div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="gi-grid">
                <!-- Métricas -->
                <div class="gi-card">
                    <div class="gi-card-header">
                        <h3>📈 Métricas del Sistema</h3>
                    </div>
                    <div class="gi-card-body">
                        <div class="gi-metrics-row" id="gi-metrics">
                            <div class="gi-metric">
                                <div class="gi-metric-value" id="gi-metric-historias">--</div>
                                <div class="gi-metric-label">Historias Generadas</div>
                            </div>
                            <div class="gi-metric">
                                <div class="gi-metric-value" id="gi-metric-corregidas">--</div>
                                <div class="gi-metric-label">Corregidas</div>
                            </div>
                            <div class="gi-metric">
                                <div class="gi-metric-value" id="gi-metric-seo">--</div>
                                <div class="gi-metric-label">Con SEO</div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Alertas -->
                <div class="gi-card">
                    <div class="gi-card-header">
                        <h3>🔔 Alertas Recientes</h3>
                        <span class="gi-badge" id="gi-alertas-count">0</span>
                    </div>
                    <div class="gi-card-body" id="gi-alertas-container">
                        <div class="gi-loading">
                            <div class="gi-spinner"></div>
                            <span>Cargando alertas...</span>
                        </div>
                    </div>
                </div>

                <!-- Saldos APIs -->
                <div class="gi-card">
                    <div class="gi-card-header">
                        <h3>💰 Saldos de APIs</h3>
                        <button class="gi-btn gi-btn-secondary" onclick="giActualizarSaldos()" style="padding: 8px 12px; font-size: 12px;">
                            🔄 Actualizar
                        </button>
                    </div>
                    <div class="gi-card-body" id="gi-saldos-container">
                        <div class="gi-saldo-item">
                            <div class="gi-saldo-name">
                                <span>Anthropic (Claude)</span>
                            </div>
                            <div class="gi-saldo-value" id="gi-saldo-anthropic">Verificar manualmente</div>
                        </div>
                        <div class="gi-saldo-item">
                            <div class="gi-saldo-name">
                                <span>OpenAI</span>
                            </div>
                            <div class="gi-saldo-value" id="gi-saldo-openai">Verificar manualmente</div>
                        </div>
                        <div class="gi-saldo-item">
                            <div class="gi-saldo-name">
                                <span>Vercel</span>
                            </div>
                            <div class="gi-saldo-value" id="gi-saldo-vercel">Plan Pro</div>
                        </div>
                        <div class="gi-saldo-item">
                            <div class="gi-saldo-name">
                                <span>Resend</span>
                            </div>
                            <div class="gi-saldo-value" id="gi-saldo-resend">Incluido</div>
                        </div>
                        <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid rgba(255,255,255,0.1);">
                            <small style="color: var(--gi-text-muted);">
                                Los saldos deben verificarse manualmente en cada plataforma por seguridad.
                            </small>
                            <div style="margin-top: 10px; display: flex; flex-wrap: wrap; gap: 8px;">
                                <a href="https://console.anthropic.com/settings/billing" target="_blank" class="gi-btn gi-btn-secondary" style="padding: 6px 12px; font-size: 11px;">Anthropic</a>
                                <a href="https://platform.openai.com/usage" target="_blank" class="gi-btn gi-btn-secondary" style="padding: 6px 12px; font-size: 11px;">OpenAI</a>
                                <a href="https://vercel.com/duendes-del-uruguay/~/usage" target="_blank" class="gi-btn gi-btn-secondary" style="padding: 6px 12px; font-size: 11px;">Vercel</a>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Configuración Rápida -->
                <div class="gi-card">
                    <div class="gi-card-header">
                        <h3>⚙️ Control de Funcionalidades</h3>
                    </div>
                    <div class="gi-card-body" id="gi-toggles-container">
                        <div class="gi-loading">
                            <div class="gi-spinner"></div>
                            <span>Cargando configuración...</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Último Monitoreo -->
            <div class="gi-card">
                <div class="gi-card-header">
                    <h3>📋 Último Monitoreo</h3>
                    <span id="gi-ultimo-monitoreo-fecha" style="color: var(--gi-text-muted); font-size: 12px;">--</span>
                </div>
                <div class="gi-card-body" id="gi-ultimo-monitoreo">
                    <div class="gi-empty">
                        <div class="gi-empty-icon">🔍</div>
                        <p>Ejecutá un monitoreo para ver los resultados aquí</p>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script>
    const GI_API = '<?php echo GI_API_BASE; ?>';

    // Cargar dashboard al iniciar
    document.addEventListener('DOMContentLoaded', () => {
        giCargarDashboard();
    });

    async function giCargarDashboard() {
        try {
            // Cargar stats
            const statsRes = await fetch(GI_API + '/stats');
            const statsData = await statsRes.json();

            if (statsData.success) {
                document.getElementById('gi-metric-historias').textContent = statsData.stats.historiasGeneradas || 0;
                document.getElementById('gi-metric-corregidas').textContent = statsData.stats.historiasCorregidas || 0;
                document.getElementById('gi-metric-seo').textContent = statsData.stats.productosConSEO || 0;
                document.getElementById('gi-alertas-count').textContent = statsData.stats.alertasPendientes || 0;

                // Estado monitor
                const monitorActivo = statsData.stats.monitorActivo;
                const statusDot = document.getElementById('gi-status-monitor');
                const statusText = document.getElementById('gi-status-monitor-text');
                statusDot.className = 'gi-status-dot ' + (monitorActivo ? 'green' : 'yellow');
                statusText.textContent = monitorActivo ? 'Activo' : 'Pausado';

                // Último monitoreo
                if (statsData.stats.ultimoMonitoreo) {
                    const ultimo = statsData.stats.ultimoMonitoreo;
                    document.getElementById('gi-ultimo-monitoreo-fecha').textContent =
                        new Date(ultimo.fecha).toLocaleString('es-UY');
                    giMostrarUltimoMonitoreo(ultimo);
                }
            }

            // Cargar toggles
            const toggleRes = await fetch(GI_API + '/toggle');
            const toggleData = await toggleRes.json();

            if (toggleData.success) {
                giMostrarToggles(toggleData.estado);
            }

            // Cargar alertas
            const monitorRes = await fetch(GI_API + '/monitor?accion=alertas');
            const monitorData = await monitorRes.json();

            if (monitorData.success) {
                giMostrarAlertas(monitorData.alertas || []);

                // Actualizar status
                if (monitorData.verificaciones) {
                    const v = monitorData.verificaciones;
                    actualizarStatus('tito', v.titoChat, v.titoChat ? 'Online' : 'Error');
                    actualizarStatus('woo', v.wooCommerce, v.wooCommerce ? 'Conectado' : 'Error');
                    actualizarStatus('kv', v.vercelKV, v.vercelKV ? 'Operativo' : 'Error');
                }
            }

        } catch (e) {
            console.error('Error cargando dashboard:', e);
        }
    }

    function actualizarStatus(id, ok, text) {
        const dot = document.getElementById('gi-status-' + id);
        const textEl = document.getElementById('gi-status-' + id + '-text');
        if (dot) dot.className = 'gi-status-dot ' + (ok ? 'green' : 'red');
        if (textEl) textEl.textContent = text;
    }

    function giMostrarToggles(estado) {
        const container = document.getElementById('gi-toggles-container');
        const toggles = {
            'monitor_24_7': { label: 'Monitor 24/7', desc: 'Monitoreo automático cada 15 min' },
            'seo_automatico': { label: 'SEO Automático', desc: 'Genera SEO al crear productos' },
            'alertas_email': { label: 'Alertas Email', desc: 'Envía alertas por email' },
            'alertas_whatsapp': { label: 'Alertas WhatsApp', desc: 'Solo alertas críticas' },
            'cross_selling': { label: 'Cross-Selling', desc: 'Muestra productos relacionados' }
        };

        let html = '';
        for (const [key, info] of Object.entries(toggles)) {
            const activo = estado[key];
            html += `
                <div class="gi-toggle ${activo ? 'active' : ''}" onclick="giToggle('${key}', this)">
                    <div class="gi-toggle-switch"></div>
                    <div>
                        <div class="gi-toggle-label">${info.label}</div>
                        <small style="color: var(--gi-text-muted);">${info.desc}</small>
                    </div>
                </div>
                <div style="height: 15px;"></div>
            `;
        }
        container.innerHTML = html;
    }

    async function giToggle(funcionalidad, element) {
        const activo = !element.classList.contains('active');
        element.classList.toggle('active');

        try {
            await fetch(GI_API + '/toggle', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ funcionalidad, activo })
            });
        } catch (e) {
            element.classList.toggle('active'); // Revertir si falla
            console.error('Error en toggle:', e);
        }
    }

    function giMostrarAlertas(alertas) {
        const container = document.getElementById('gi-alertas-container');

        if (!alertas || alertas.length === 0) {
            container.innerHTML = `
                <div class="gi-empty">
                    <div class="gi-empty-icon">✅</div>
                    <p>No hay alertas pendientes</p>
                </div>
            `;
            return;
        }

        let html = '';
        alertas.slice(0, 5).forEach(alerta => {
            const tipo = alerta.nivel === 'critico' ? 'critical' :
                        alerta.nivel === 'alto' ? 'warning' : 'info';
            const icono = tipo === 'critical' ? '🔴' : tipo === 'warning' ? '🟡' : '🔵';

            html += `
                <div class="gi-alert ${tipo}">
                    <div class="gi-alert-icon">${icono}</div>
                    <div class="gi-alert-content">
                        <div class="gi-alert-title">${alerta.titulo || 'Alerta'}</div>
                        <div class="gi-alert-text">${alerta.mensaje || ''}</div>
                    </div>
                    <div class="gi-alert-time">${alerta.fecha ? new Date(alerta.fecha).toLocaleString('es-UY') : ''}</div>
                </div>
            `;
        });

        container.innerHTML = html;
    }

    function giMostrarUltimoMonitoreo(monitoreo) {
        const container = document.getElementById('gi-ultimo-monitoreo');

        if (!monitoreo || !monitoreo.verificaciones) {
            return;
        }

        const v = monitoreo.verificaciones;
        let html = '<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px;">';

        const checks = [
            { key: 'titoChat', label: 'Tito Chat' },
            { key: 'wooCommerce', label: 'WooCommerce' },
            { key: 'vercelKV', label: 'Vercel KV' },
            { key: 'wordpress', label: 'WordPress' },
            { key: 'resend', label: 'Resend' }
        ];

        checks.forEach(check => {
            const ok = v[check.key];
            html += `
                <div style="display: flex; align-items: center; gap: 10px; padding: 10px; background: rgba(0,0,0,0.2); border-radius: 8px;">
                    <span style="font-size: 20px;">${ok ? '✅' : '❌'}</span>
                    <span>${check.label}</span>
                </div>
            `;
        });

        html += '</div>';
        container.innerHTML = html;
    }

    async function giEjecutarMonitoreo() {
        const btn = event.target.closest('.gi-quick-action');
        btn.style.opacity = '0.5';
        btn.style.pointerEvents = 'none';

        try {
            const res = await fetch(GI_API + '/monitor?accion=ejecutar');
            const data = await res.json();

            if (data.success) {
                alert('✅ Monitoreo ejecutado correctamente');
                giCargarDashboard(); // Recargar todo
            } else {
                alert('❌ Error: ' + (data.error || 'Error desconocido'));
            }
        } catch (e) {
            alert('❌ Error de conexión: ' + e.message);
        }

        btn.style.opacity = '1';
        btn.style.pointerEvents = 'auto';
    }

    function giVerAlertas() {
        const container = document.getElementById('gi-alertas-container');
        container.scrollIntoView({ behavior: 'smooth' });
    }

    function giActualizarSaldos() {
        alert('Los saldos deben verificarse manualmente en cada plataforma por seguridad.\n\nUsá los botones de acceso directo debajo.');
    }
    </script>
    <?php
}

// ═══════════════════════════════════════════════════════════════════════════
// PÁGINA: ANALIZAR
// ═══════════════════════════════════════════════════════════════════════════

function gi_analyze_page() {
    ?>
    <div class="gi-wrap">
        <div class="gi-header">
            <h1>🔍 Analizar Historias</h1>
            <p>Analiza la calidad y unicidad de las historias de guardianes</p>
        </div>

        <div class="gi-content">
            <div class="gi-card" style="margin-bottom: 25px;">
                <div class="gi-card-header">
                    <h3>Análisis del Catálogo</h3>
                    <button class="gi-btn gi-btn-primary" onclick="giAnalizarTodo()" id="btn-analizar">
                        🔍 Analizar Todo el Catálogo
                    </button>
                </div>
                <div class="gi-card-body">
                    <p style="color: var(--gi-text-muted); margin-bottom: 20px;">
                        El análisis revisa todas las historias de guardianes, detecta repeticiones,
                        sincrodestinos problemáticos y calcula un puntaje de calidad para cada una.
                    </p>

                    <div id="gi-analisis-status" style="display: none;">
                        <div class="gi-progress" style="margin-bottom: 15px;">
                            <div class="gi-progress-bar green" id="gi-analisis-progress" style="width: 0%;"></div>
                        </div>
                        <p id="gi-analisis-text" style="color: var(--gi-gold); text-align: center;"></p>
                    </div>
                </div>
            </div>

            <div class="gi-card">
                <div class="gi-card-header">
                    <h3>📊 Resultados del Análisis</h3>
                </div>
                <div class="gi-card-body" id="gi-analisis-resultados">
                    <div class="gi-empty">
                        <div class="gi-empty-icon">📊</div>
                        <p>Ejecutá un análisis para ver los resultados</p>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script>
    const GI_API = '<?php echo GI_API_BASE; ?>';

    // Cargar último análisis al iniciar
    document.addEventListener('DOMContentLoaded', () => {
        giCargarUltimoAnalisis();
    });

    async function giCargarUltimoAnalisis() {
        try {
            const res = await fetch(GI_API + '/analyze');
            const data = await res.json();

            if (data.success && data.analisis) {
                // Convertir formato si es necesario
                const analisis = data.analisis.productosAnalizados ? {
                    productos: data.analisis.productosAnalizados || data.analisis.productos,
                    total: data.analisis.totalProductos || data.analisis.total,
                    puntajeGlobal: data.analisis.puntajeGlobal,
                    resumen: data.analisis.resumen
                } : data.analisis;
                giMostrarResultados(analisis);
            }
        } catch (e) {
            console.error('Error cargando análisis:', e);
        }
    }

    async function giAnalizarTodo() {
        const btn = document.getElementById('btn-analizar');
        const status = document.getElementById('gi-analisis-status');
        const progress = document.getElementById('gi-analisis-progress');
        const text = document.getElementById('gi-analisis-text');

        btn.disabled = true;
        btn.textContent = '⏳ Analizando...';
        status.style.display = 'block';
        text.textContent = 'Iniciando análisis del catálogo completo...';

        let progreso = 0;
        const intervalo = setInterval(() => {
            progreso = Math.min(progreso + 5, 90);
            progress.style.width = progreso + '%';
        }, 500);

        try {
            const res = await fetch(GI_API + '/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ modo: 'completo' })
            });

            const data = await res.json();

            clearInterval(intervalo);
            progress.style.width = '100%';

            if (data.success) {
                text.textContent = '✅ Análisis completado';
                // API devuelve resultado.productosAnalizados, convertir a formato esperado
                const analisis = data.resultado ? {
                    productos: data.resultado.productosAnalizados || data.resultado.productos,
                    total: data.resultado.totalProductos || data.resultado.total,
                    puntajeGlobal: data.resultado.puntajeGlobal,
                    resumen: data.resultado.resumen
                } : data.analisis || data;
                giMostrarResultados(analisis);
            } else {
                throw new Error(data.error || 'Error en el análisis');
            }

        } catch (e) {
            clearInterval(intervalo);
            text.textContent = '❌ Error: ' + e.message;
            progress.className = 'gi-progress-bar red';
        }

        btn.disabled = false;
        btn.textContent = '🔍 Analizar Todo el Catálogo';
    }

    function giMostrarResultados(analisis) {
        const container = document.getElementById('gi-analisis-resultados');

        if (!analisis || !analisis.productos || analisis.productos.length === 0) {
            container.innerHTML = `
                <div class="gi-empty">
                    <div class="gi-empty-icon">📊</div>
                    <p>No se encontraron productos para analizar</p>
                </div>
            `;
            return;
        }

        // Resumen
        let html = `
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 20px; margin-bottom: 30px;">
                <div class="gi-metric">
                    <div class="gi-metric-value">${analisis.total || analisis.productos.length}</div>
                    <div class="gi-metric-label">Total Analizados</div>
                </div>
                <div class="gi-metric">
                    <div class="gi-metric-value" style="color: var(--gi-success);">${analisis.excelentes || 0}</div>
                    <div class="gi-metric-label">Excelentes (90+)</div>
                </div>
                <div class="gi-metric">
                    <div class="gi-metric-value" style="color: var(--gi-info);">${analisis.buenos || 0}</div>
                    <div class="gi-metric-label">Buenos (70-89)</div>
                </div>
                <div class="gi-metric">
                    <div class="gi-metric-value" style="color: var(--gi-warning);">${analisis.regulares || 0}</div>
                    <div class="gi-metric-label">Regulares (50-69)</div>
                </div>
                <div class="gi-metric">
                    <div class="gi-metric-value" style="color: var(--gi-error);">${analisis.criticos || 0}</div>
                    <div class="gi-metric-label">Críticos (<50)</div>
                </div>
            </div>
        `;

        // Tabla de productos
        html += `
            <h4 style="color: var(--gi-gold); margin-bottom: 15px;">Detalle por Producto</h4>
            <div style="overflow-x: auto;">
                <table class="gi-table">
                    <thead>
                        <tr>
                            <th>Puntaje</th>
                            <th>Producto</th>
                            <th>Problemas</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
        `;

        // Ordenar por puntaje (peores primero)
        const productos = [...analisis.productos].sort((a, b) => (a.puntaje || 0) - (b.puntaje || 0));

        productos.forEach(prod => {
            const puntaje = prod.puntaje || 0;
            const scoreClass = puntaje >= 90 ? 'excellent' :
                              puntaje >= 70 ? 'good' :
                              puntaje >= 50 ? 'warning' : 'critical';

            const problemas = prod.problemas || [];
            const problemasHtml = problemas.length > 0
                ? problemas.map(p => `<span style="display: inline-block; background: rgba(239,68,68,0.2); color: #ef4444; padding: 2px 8px; border-radius: 4px; font-size: 11px; margin: 2px;">${p}</span>`).join('')
                : '<span style="color: var(--gi-success);">✓ Sin problemas</span>';

            html += `
                <tr>
                    <td><div class="gi-score ${scoreClass}">${puntaje}</div></td>
                    <td>
                        <strong>${prod.nombre || 'Sin nombre'}</strong>
                        <br><small style="color: var(--gi-text-muted);">ID: ${prod.id}</small>
                    </td>
                    <td>${problemasHtml}</td>
                    <td>
                        ${puntaje < 70 ? `<button class="gi-btn gi-btn-secondary" onclick="giCorregirHistoria(${prod.id})" style="padding: 6px 12px; font-size: 12px;">✨ Corregir</button>` : ''}
                        <a href="/wp-admin/post.php?post=${prod.id}&action=edit" class="gi-btn gi-btn-secondary" style="padding: 6px 12px; font-size: 12px;">✏️ Editar</a>
                    </td>
                </tr>
            `;
        });

        html += `
                    </tbody>
                </table>
            </div>
        `;

        container.innerHTML = html;
    }

    async function giCorregirHistoria(productId) {
        if (!confirm('¿Generar nueva historia para este producto?')) return;

        alert('Funcionalidad en desarrollo. Por ahora, usá la página "Generar" para crear historias nuevas.');
    }
    </script>
    <?php
}

// ═══════════════════════════════════════════════════════════════════════════
// PÁGINA: GENERAR
// ═══════════════════════════════════════════════════════════════════════════

function gi_generate_page() {
    ?>
    <div class="gi-wrap">
        <div class="gi-header">
            <h1>✨ Generar Contenido</h1>
            <p>Genera historias únicas para guardianes con inteligencia artificial</p>
        </div>

        <div class="gi-content">
            <div class="gi-grid">
                <div class="gi-card">
                    <div class="gi-card-header">
                        <h3>📝 Datos del Guardián</h3>
                    </div>
                    <div class="gi-card-body">
                        <div style="margin-bottom: 20px;">
                            <label style="display: block; color: var(--gi-text-muted); font-size: 12px; margin-bottom: 8px;">Nombre *</label>
                            <input type="text" id="gi-gen-nombre" placeholder="Ej: Aurora" style="width: 100%; padding: 12px; background: rgba(0,0,0,0.3); border: 1px solid var(--gi-border); border-radius: 8px; color: #fff;">
                        </div>

                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px;">
                            <div>
                                <label style="display: block; color: var(--gi-text-muted); font-size: 12px; margin-bottom: 8px;">Tipo</label>
                                <select id="gi-gen-tipo" style="width: 100%; padding: 12px; background: rgba(0,0,0,0.3); border: 1px solid var(--gi-border); border-radius: 8px; color: #fff;">
                                    <option value="duende">Duende</option>
                                    <option value="bruja">Bruja</option>
                                    <option value="brujo">Brujo</option>
                                    <option value="hada">Hada</option>
                                    <option value="elfo">Elfo</option>
                                    <option value="gnomo">Gnomo</option>
                                    <option value="mago">Mago</option>
                                </select>
                            </div>
                            <div>
                                <label style="display: block; color: var(--gi-text-muted); font-size: 12px; margin-bottom: 8px;">Género</label>
                                <select id="gi-gen-genero" style="width: 100%; padding: 12px; background: rgba(0,0,0,0.3); border: 1px solid var(--gi-border); border-radius: 8px; color: #fff;">
                                    <option value="M">Masculino</option>
                                    <option value="F">Femenino</option>
                                    <option value="N">Neutro</option>
                                </select>
                            </div>
                        </div>

                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px;">
                            <div>
                                <label style="display: block; color: var(--gi-text-muted); font-size: 12px; margin-bottom: 8px;">Categoría</label>
                                <select id="gi-gen-categoria" style="width: 100%; padding: 12px; background: rgba(0,0,0,0.3); border: 1px solid var(--gi-border); border-radius: 8px; color: #fff;">
                                    <option value="proteccion">Protección</option>
                                    <option value="abundancia">Abundancia</option>
                                    <option value="amor">Amor</option>
                                    <option value="sanacion">Sanación</option>
                                    <option value="sabiduria">Sabiduría</option>
                                </select>
                            </div>
                            <div>
                                <label style="display: block; color: var(--gi-text-muted); font-size: 12px; margin-bottom: 8px;">Tamaño</label>
                                <select id="gi-gen-tamano" style="width: 100%; padding: 12px; background: rgba(0,0,0,0.3); border: 1px solid var(--gi-border); border-radius: 8px; color: #fff;">
                                    <option value="mini">Mini (10-15cm)</option>
                                    <option value="pequeno">Pequeño (15-20cm)</option>
                                    <option value="mediano">Mediano (20-25cm)</option>
                                    <option value="grande">Grande (25-30cm)</option>
                                </select>
                            </div>
                        </div>

                        <div style="margin-bottom: 20px;">
                            <label style="display: block; color: var(--gi-text-muted); font-size: 12px; margin-bottom: 8px;">Accesorios</label>
                            <textarea id="gi-gen-accesorios" placeholder="Ej: cuarzo rosa, capa verde, báculo de madera..." style="width: 100%; padding: 12px; background: rgba(0,0,0,0.3); border: 1px solid var(--gi-border); border-radius: 8px; color: #fff; min-height: 80px;"></textarea>
                        </div>

                        <button class="gi-btn gi-btn-primary" onclick="giGenerarHistoria()" id="btn-generar" style="width: 100%;">
                            ✨ Generar Historia Única
                        </button>
                    </div>
                </div>

                <div class="gi-card">
                    <div class="gi-card-header">
                        <h3>📜 Historia Generada</h3>
                        <button class="gi-btn gi-btn-secondary" onclick="giCopiarHistoria()" style="padding: 8px 15px; font-size: 12px;">
                            📋 Copiar
                        </button>
                    </div>
                    <div class="gi-card-body" id="gi-historia-resultado">
                        <div class="gi-empty">
                            <div class="gi-empty-icon">✨</div>
                            <p>Completá los datos y generá una historia única</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script>
    const GI_API = '<?php echo GI_API_BASE; ?>';
    let historiaGenerada = '';

    async function giGenerarHistoria() {
        const btn = document.getElementById('btn-generar');
        const resultado = document.getElementById('gi-historia-resultado');

        const nombre = document.getElementById('gi-gen-nombre').value;
        if (!nombre) {
            alert('Por favor ingresá un nombre para el guardián');
            return;
        }

        btn.disabled = true;
        btn.textContent = '⏳ Generando...';
        resultado.innerHTML = '<div class="gi-loading"><div class="gi-spinner"></div><span>Canalizando la historia de ' + nombre + '...</span></div>';

        try {
            const res = await fetch(GI_API + '/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    accion: 'generar',
                    datos: {
                        nombre: nombre,
                        tipo: document.getElementById('gi-gen-tipo').value,
                        genero: document.getElementById('gi-gen-genero').value,
                        categoria: document.getElementById('gi-gen-categoria').value,
                        tamano: document.getElementById('gi-gen-tamano').value,
                        accesorios: document.getElementById('gi-gen-accesorios').value.split(',').map(a => a.trim()).filter(a => a)
                    }
                })
            });

            const data = await res.json();

            if (data.success && data.historia) {
                historiaGenerada = data.historia;
                resultado.innerHTML = `
                    <div style="white-space: pre-wrap; line-height: 1.8; color: var(--gi-text);">
                        ${data.historia}
                    </div>
                `;
            } else {
                throw new Error(data.error || 'Error generando historia');
            }

        } catch (e) {
            resultado.innerHTML = `
                <div class="gi-alert critical">
                    <div class="gi-alert-icon">❌</div>
                    <div class="gi-alert-content">
                        <div class="gi-alert-title">Error</div>
                        <div class="gi-alert-text">${e.message}</div>
                    </div>
                </div>
            `;
        }

        btn.disabled = false;
        btn.textContent = '✨ Generar Historia Única';
    }

    function giCopiarHistoria() {
        if (!historiaGenerada) {
            alert('Primero generá una historia');
            return;
        }

        navigator.clipboard.writeText(historiaGenerada).then(() => {
            alert('✅ Historia copiada al portapapeles');
        });
    }
    </script>
    <?php
}

// ═══════════════════════════════════════════════════════════════════════════
// PÁGINA: SEO
// ═══════════════════════════════════════════════════════════════════════════

function gi_seo_page() {
    ?>
    <div class="gi-wrap">
        <div class="gi-header">
            <h1>🎯 SEO Automático</h1>
            <p>Genera y aplica SEO optimizado para Rank Math 100/100</p>
        </div>

        <div class="gi-content">
            <div class="gi-card" style="margin-bottom: 25px;">
                <div class="gi-card-header">
                    <h3>Estado SEO del Catálogo</h3>
                    <button class="gi-btn gi-btn-primary" onclick="giCargarEstadoSEO()">
                        🔄 Actualizar
                    </button>
                </div>
                <div class="gi-card-body" id="gi-seo-estado">
                    <div class="gi-loading">
                        <div class="gi-spinner"></div>
                        <span>Cargando estado SEO...</span>
                    </div>
                </div>
            </div>

            <div class="gi-card">
                <div class="gi-card-header">
                    <h3>Generar SEO para Producto</h3>
                </div>
                <div class="gi-card-body">
                    <div style="display: grid; grid-template-columns: 1fr auto; gap: 15px; align-items: end;">
                        <div>
                            <label style="display: block; color: var(--gi-text-muted); font-size: 12px; margin-bottom: 8px;">ID del Producto</label>
                            <input type="number" id="gi-seo-product-id" placeholder="Ej: 1234" style="width: 100%; padding: 12px; background: rgba(0,0,0,0.3); border: 1px solid var(--gi-border); border-radius: 8px; color: #fff;">
                        </div>
                        <button class="gi-btn gi-btn-primary" onclick="giGenerarSEO()">
                            🎯 Generar SEO
                        </button>
                    </div>

                    <div id="gi-seo-resultado" style="margin-top: 20px;"></div>
                </div>
            </div>
        </div>
    </div>

    <script>
    const GI_API = '<?php echo GI_API_BASE; ?>';

    document.addEventListener('DOMContentLoaded', () => {
        giCargarEstadoSEO();
    });

    async function giCargarEstadoSEO() {
        const container = document.getElementById('gi-seo-estado');
        container.innerHTML = '<div class="gi-loading"><div class="gi-spinner"></div><span>Cargando...</span></div>';

        try {
            const res = await fetch(GI_API + '/seo');
            const data = await res.json();

            if (data.success) {
                const stats = data.estadisticas || {};
                container.innerHTML = `
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 20px;">
                        <div class="gi-metric">
                            <div class="gi-metric-value">${stats.total || 0}</div>
                            <div class="gi-metric-label">Total Productos</div>
                        </div>
                        <div class="gi-metric">
                            <div class="gi-metric-value" style="color: var(--gi-success);">${stats.conSEO || 0}</div>
                            <div class="gi-metric-label">Con SEO</div>
                        </div>
                        <div class="gi-metric">
                            <div class="gi-metric-value" style="color: var(--gi-warning);">${stats.sinSEO || 0}</div>
                            <div class="gi-metric-label">Sin SEO</div>
                        </div>
                    </div>
                `;
            }
        } catch (e) {
            container.innerHTML = '<p style="color: var(--gi-error);">Error cargando estado: ' + e.message + '</p>';
        }
    }

    async function giGenerarSEO() {
        const productId = document.getElementById('gi-seo-product-id').value;
        const resultado = document.getElementById('gi-seo-resultado');

        if (!productId) {
            alert('Ingresá un ID de producto');
            return;
        }

        resultado.innerHTML = '<div class="gi-loading"><div class="gi-spinner"></div><span>Generando SEO...</span></div>';

        try {
            const res = await fetch(GI_API + '/seo', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    producto: { id: parseInt(productId) },
                    aplicar: false // Solo generar, no aplicar automáticamente
                })
            });

            const data = await res.json();

            if (data.success && data.seo) {
                const seo = data.seo;
                resultado.innerHTML = `
                    <div class="gi-alert info">
                        <div class="gi-alert-content">
                            <div class="gi-alert-title">SEO Generado</div>
                            <div style="margin-top: 15px;">
                                <strong>Título SEO:</strong><br>
                                <code style="display: block; background: rgba(0,0,0,0.3); padding: 10px; border-radius: 6px; margin: 5px 0 15px 0;">${seo.title || ''}</code>

                                <strong>Meta Descripción:</strong><br>
                                <code style="display: block; background: rgba(0,0,0,0.3); padding: 10px; border-radius: 6px; margin: 5px 0 15px 0;">${seo.description || ''}</code>

                                <strong>Palabra Clave:</strong><br>
                                <code style="display: block; background: rgba(0,0,0,0.3); padding: 10px; border-radius: 6px; margin: 5px 0;">${seo.focus_keyword || ''}</code>
                            </div>
                            <button class="gi-btn gi-btn-success" onclick="giAplicarSEO(${productId})" style="margin-top: 15px;">
                                ✅ Aplicar a WooCommerce
                            </button>
                        </div>
                    </div>
                `;
            } else {
                throw new Error(data.error || 'Error generando SEO');
            }
        } catch (e) {
            resultado.innerHTML = '<div class="gi-alert critical"><div class="gi-alert-content"><div class="gi-alert-title">Error</div><div class="gi-alert-text">' + e.message + '</div></div></div>';
        }
    }

    async function giAplicarSEO(productId) {
        if (!confirm('¿Aplicar SEO generado al producto?')) return;

        try {
            const res = await fetch(GI_API + '/seo', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    producto: { id: productId },
                    aplicar: true
                })
            });

            const data = await res.json();

            if (data.success) {
                alert('✅ SEO aplicado correctamente');
            } else {
                throw new Error(data.error || 'Error aplicando SEO');
            }
        } catch (e) {
            alert('❌ Error: ' + e.message);
        }
    }
    </script>
    <?php
}

// ═══════════════════════════════════════════════════════════════════════════
// PÁGINA: CONFIGURACIÓN
// ═══════════════════════════════════════════════════════════════════════════

function gi_settings_page() {
    ?>
    <div class="gi-wrap">
        <div class="gi-header">
            <h1>⚙️ Configuración</h1>
            <p>Ajustes del sistema Guardian Intelligence</p>
        </div>

        <div class="gi-content">
            <div class="gi-grid">
                <div class="gi-card">
                    <div class="gi-card-header">
                        <h3>🔧 Funcionalidades</h3>
                    </div>
                    <div class="gi-card-body" id="gi-config-toggles">
                        <div class="gi-loading">
                            <div class="gi-spinner"></div>
                            <span>Cargando configuración...</span>
                        </div>
                    </div>
                </div>

                <div class="gi-card">
                    <div class="gi-card-header">
                        <h3>📡 API Base</h3>
                    </div>
                    <div class="gi-card-body">
                        <p style="color: var(--gi-text-muted); margin-bottom: 15px;">
                            URL del servidor Guardian Intelligence:
                        </p>
                        <code style="display: block; background: rgba(0,0,0,0.3); padding: 15px; border-radius: 8px; color: var(--gi-gold);">
                            <?php echo GI_API_BASE; ?>
                        </code>
                    </div>
                </div>

                <div class="gi-card">
                    <div class="gi-card-header">
                        <h3>📋 Logs del CRON</h3>
                    </div>
                    <div class="gi-card-body" id="gi-cron-logs">
                        <p style="color: var(--gi-text-muted);">
                            El CRON se ejecuta cada 15 minutos automáticamente.
                        </p>
                    </div>
                </div>

                <div class="gi-card">
                    <div class="gi-card-header">
                        <h3>🔗 Enlaces Útiles</h3>
                    </div>
                    <div class="gi-card-body">
                        <div style="display: flex; flex-direction: column; gap: 10px;">
                            <a href="https://console.anthropic.com/settings/billing" target="_blank" class="gi-btn gi-btn-secondary">
                                💳 Anthropic Billing
                            </a>
                            <a href="https://platform.openai.com/usage" target="_blank" class="gi-btn gi-btn-secondary">
                                💳 OpenAI Usage
                            </a>
                            <a href="https://vercel.com/duendes-del-uruguay/~/usage" target="_blank" class="gi-btn gi-btn-secondary">
                                💳 Vercel Usage
                            </a>
                            <a href="https://resend.com/emails" target="_blank" class="gi-btn gi-btn-secondary">
                                📧 Resend Dashboard
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script>
    const GI_API = '<?php echo GI_API_BASE; ?>';

    document.addEventListener('DOMContentLoaded', () => {
        giCargarConfig();
    });

    async function giCargarConfig() {
        try {
            const res = await fetch(GI_API + '/toggle');
            const data = await res.json();

            if (data.success) {
                const container = document.getElementById('gi-config-toggles');
                const toggles = {
                    'monitor_24_7': { label: 'Monitor 24/7', desc: 'Ejecuta verificaciones automáticas cada 15 minutos' },
                    'seo_automatico': { label: 'SEO Automático', desc: 'Genera SEO al crear nuevos productos' },
                    'correccion_automatica': { label: 'Corrección Automática', desc: '⚠️ Corrige historias sin aprobación previa' },
                    'alertas_email': { label: 'Alertas por Email', desc: 'Envía alertas de problemas a duendesdeluruguay@gmail.com' },
                    'alertas_whatsapp': { label: 'Alertas WhatsApp', desc: 'Solo alertas críticas (servicios caídos)' },
                    'cross_selling': { label: 'Cross-Selling', desc: 'Muestra productos relacionados en la tienda' }
                };

                let html = '';
                for (const [key, info] of Object.entries(toggles)) {
                    const activo = data.estado[key];
                    html += `
                        <div style="display: flex; justify-content: space-between; align-items: center; padding: 15px 0; border-bottom: 1px solid rgba(255,255,255,0.05);">
                            <div>
                                <strong style="color: var(--gi-text);">${info.label}</strong>
                                <br><small style="color: var(--gi-text-muted);">${info.desc}</small>
                            </div>
                            <div class="gi-toggle ${activo ? 'active' : ''}" onclick="giToggleConfig('${key}', this)">
                                <div class="gi-toggle-switch"></div>
                            </div>
                        </div>
                    `;
                }
                container.innerHTML = html;
            }
        } catch (e) {
            console.error('Error cargando config:', e);
        }
    }

    async function giToggleConfig(funcionalidad, element) {
        const activo = !element.classList.contains('active');
        element.classList.toggle('active');

        try {
            await fetch(GI_API + '/toggle', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ funcionalidad, activo })
            });
        } catch (e) {
            element.classList.toggle('active');
            alert('Error: ' + e.message);
        }
    }
    </script>
    <?php
}

// ═══════════════════════════════════════════════════════════════════════════
// METABOX EN PRODUCTOS
// ═══════════════════════════════════════════════════════════════════════════

add_action('add_meta_boxes', function() {
    add_meta_box(
        'gi_producto_metabox',
        '🧠 Guardian Intelligence',
        'gi_producto_metabox_html',
        'product',
        'side',
        'high'
    );
});

function gi_producto_metabox_html($post) {
    ?>
    <style>
        .gi-product-box {
            background: #1a1510;
            padding: 15px;
            border-radius: 8px;
            margin: -12px;
        }
        .gi-product-score {
            text-align: center;
            margin-bottom: 15px;
        }
        .gi-product-score-value {
            font-size: 36px;
            font-weight: bold;
            color: #C6A962;
        }
        .gi-product-score-label {
            color: #888;
            font-size: 11px;
        }
        .gi-product-btn {
            display: block;
            width: 100%;
            padding: 10px;
            background: linear-gradient(135deg, #C6A962, #a88a42);
            border: none;
            border-radius: 6px;
            color: #000;
            font-weight: 600;
            cursor: pointer;
            margin-bottom: 8px;
            text-align: center;
        }
        .gi-product-btn:hover {
            opacity: 0.9;
        }
        .gi-product-btn-secondary {
            background: rgba(255,255,255,0.1);
            color: #fff;
            border: 1px solid rgba(198,169,98,0.3);
        }
        .gi-product-status {
            padding: 8px;
            border-radius: 6px;
            font-size: 12px;
            margin-top: 10px;
            display: none;
        }
    </style>

    <div class="gi-product-box">
        <div class="gi-product-score">
            <div class="gi-product-score-value" id="gi-score">--</div>
            <div class="gi-product-score-label">Puntaje de Calidad</div>
        </div>

        <button type="button" class="gi-product-btn" onclick="giAnalizarProducto(<?php echo $post->ID; ?>)">
            🔍 Analizar Historia
        </button>

        <button type="button" class="gi-product-btn gi-product-btn-secondary" onclick="giGenerarSEOProducto(<?php echo $post->ID; ?>)">
            🎯 Generar SEO
        </button>

        <div class="gi-product-status" id="gi-product-status"></div>
    </div>

    <script>
    async function giAnalizarProducto(productId) {
        const status = document.getElementById('gi-product-status');
        const score = document.getElementById('gi-score');

        status.style.display = 'block';
        status.style.background = 'rgba(198,169,98,0.2)';
        status.style.color = '#C6A962';
        status.textContent = 'Analizando...';

        try {
            const res = await fetch('<?php echo GI_API_BASE; ?>/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    modo: 'individual',
                    producto: { id: productId }
                })
            });

            const data = await res.json();

            if (data.success && data.analisis) {
                const puntaje = data.analisis.puntaje || 0;
                score.textContent = puntaje;
                score.style.color = puntaje >= 70 ? '#22c55e' : puntaje >= 50 ? '#f59e0b' : '#ef4444';

                status.style.background = 'rgba(34,197,94,0.2)';
                status.style.color = '#22c55e';
                status.textContent = '✅ Análisis completo';

                if (data.analisis.problemas && data.analisis.problemas.length > 0) {
                    status.innerHTML = '⚠️ Problemas: ' + data.analisis.problemas.join(', ');
                    status.style.background = 'rgba(245,158,11,0.2)';
                    status.style.color = '#f59e0b';
                }
            }
        } catch (e) {
            status.style.background = 'rgba(239,68,68,0.2)';
            status.style.color = '#ef4444';
            status.textContent = '❌ Error: ' + e.message;
        }
    }

    async function giGenerarSEOProducto(productId) {
        const status = document.getElementById('gi-product-status');

        status.style.display = 'block';
        status.style.background = 'rgba(198,169,98,0.2)';
        status.style.color = '#C6A962';
        status.textContent = 'Generando SEO...';

        try {
            const res = await fetch('<?php echo GI_API_BASE; ?>/seo', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    producto: { id: productId },
                    aplicar: true
                })
            });

            const data = await res.json();

            if (data.success) {
                status.style.background = 'rgba(34,197,94,0.2)';
                status.style.color = '#22c55e';
                status.textContent = '✅ SEO aplicado correctamente';
            } else {
                throw new Error(data.error);
            }
        } catch (e) {
            status.style.background = 'rgba(239,68,68,0.2)';
            status.style.color = '#ef4444';
            status.textContent = '❌ Error: ' + e.message;
        }
    }
    </script>
    <?php
}
