<?php
/**
 * Plugin Name: Duendes - Admin Completo
 * Description: Sistema administrativo con Tito AI Chat
 * Version: 2.0
 * Author: Duendes del Uruguay
 */

if (!defined('ABSPATH')) exit;

define('DUENDES_ADMIN_VERSION', '2.0.0');
define('DUENDES_API_URL', 'https://duendes-vercel.vercel.app/api');

// ═══════════════════════════════════════════════════════════════════════════
// MENÚ PRINCIPAL
// ═══════════════════════════════════════════════════════════════════════════

add_action('admin_menu', function() {
    add_menu_page('Tito Admin', '🧙 Tito Admin', 'manage_options', 'duendes-tito', 'duendes_tito_chat_page', 'dashicons-star-filled', 3);
    add_submenu_page('duendes-tito', 'Chat con Tito', '💬 Chat', 'manage_options', 'duendes-tito', 'duendes_tito_chat_page');
    add_submenu_page('duendes-tito', 'Canalizaciones', '🔮 Canalizaciones', 'manage_options', 'duendes-canalizaciones', 'duendes_canalizaciones_page');
    add_submenu_page('duendes-tito', 'Usuarios', '👥 Usuarios', 'manage_options', 'duendes-usuarios', 'duendes_usuarios_page');
    add_submenu_page('duendes-tito', 'El Círculo', '🌙 El Círculo', 'manage_options', 'duendes-circulo', 'duendes_circulo_page');
    add_submenu_page('duendes-tito', 'Banners', '🎨 Banners', 'manage_options', 'duendes-banners', 'duendes_banners_page');
});

// ═══════════════════════════════════════════════════════════════════════════
// ESTILOS GLOBALES - TEMA NEON
// ═══════════════════════════════════════════════════════════════════════════

add_action('admin_head', function() {
    $screen = get_current_screen();
    if (strpos($screen->id, 'duendes') === false) return;
    ?>
    <style>
    /* Reset WordPress admin styles for our pages */
    .duendes-wrap {
        margin: 0 !important;
        padding: 0 !important;
        max-width: 100% !important;
        background: #0a0a0f;
        min-height: 100vh;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    }

    /* Header Neon */
    .duendes-header {
        background: linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 100%);
        padding: 24px 30px;
        border-bottom: 1px solid rgba(0, 255, 255, 0.2);
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .duendes-header h1 {
        margin: 0;
        font-size: 24px;
        font-weight: 700;
        background: linear-gradient(90deg, #00ffff, #00ff88);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        text-shadow: 0 0 30px rgba(0, 255, 255, 0.5);
    }

    .duendes-header p {
        margin: 4px 0 0 0;
        color: rgba(255, 255, 255, 0.6);
        font-size: 14px;
    }

    /* Neon Colors */
    .neon-cyan { color: #00ffff; text-shadow: 0 0 10px #00ffff; }
    .neon-green { color: #00ff88; text-shadow: 0 0 10px #00ff88; }
    .neon-magenta { color: #ff00ff; text-shadow: 0 0 10px #ff00ff; }
    .neon-orange { color: #ff8800; text-shadow: 0 0 10px #ff8800; }
    .neon-purple { color: #aa00ff; text-shadow: 0 0 10px #aa00ff; }

    .bg-neon-cyan { background: linear-gradient(135deg, #001a1a 0%, #003333 100%); border: 1px solid rgba(0, 255, 255, 0.3); }
    .bg-neon-green { background: linear-gradient(135deg, #001a0f 0%, #003322 100%); border: 1px solid rgba(0, 255, 136, 0.3); }
    .bg-neon-magenta { background: linear-gradient(135deg, #1a001a 0%, #330033 100%); border: 1px solid rgba(255, 0, 255, 0.3); }
    .bg-neon-orange { background: linear-gradient(135deg, #1a0f00 0%, #332200 100%); border: 1px solid rgba(255, 136, 0, 0.3); }
    .bg-neon-purple { background: linear-gradient(135deg, #0f001a 0%, #220033 100%); border: 1px solid rgba(170, 0, 255, 0.3); }

    /* Main Content */
    .duendes-content {
        padding: 30px;
        background: #0a0a0f;
    }

    /* Cards */
    .duendes-card {
        background: linear-gradient(135deg, #12121a 0%, #1a1a28 100%);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 16px;
        padding: 24px;
        margin-bottom: 24px;
    }

    .duendes-card-header {
        display: flex;
        align-items: center;
        gap: 16px;
        margin-bottom: 20px;
        padding-bottom: 16px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }

    .duendes-card-icon {
        width: 50px;
        height: 50px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 24px;
    }

    .duendes-card-title {
        font-size: 18px;
        font-weight: 600;
        color: #fff;
        margin: 0;
    }

    /* Grid */
    .duendes-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 24px;
    }

    @media (max-width: 782px) {
        .duendes-grid { grid-template-columns: 1fr; }
    }

    /* Stats */
    .duendes-stat {
        text-align: center;
        padding: 24px;
    }

    .duendes-stat-value {
        font-size: 42px;
        font-weight: 800;
        background: linear-gradient(90deg, #00ffff, #00ff88);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
    }

    .duendes-stat-label {
        font-size: 14px;
        color: rgba(255, 255, 255, 0.6);
        margin-top: 8px;
    }

    /* Buttons */
    .duendes-btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        padding: 14px 28px;
        border-radius: 10px;
        font-size: 14px;
        font-weight: 600;
        cursor: pointer;
        border: none;
        transition: all 0.3s;
        text-decoration: none;
    }

    .duendes-btn-primary {
        background: linear-gradient(135deg, #00ffff 0%, #00ff88 100%);
        color: #000;
    }

    .duendes-btn-primary:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(0, 255, 255, 0.4);
        color: #000;
    }

    .duendes-btn-secondary {
        background: rgba(255, 255, 255, 0.1);
        color: #fff;
        border: 1px solid rgba(255, 255, 255, 0.2);
    }

    .duendes-btn-secondary:hover {
        background: rgba(255, 255, 255, 0.15);
        color: #fff;
    }

    .duendes-btn-magenta {
        background: linear-gradient(135deg, #ff00ff 0%, #ff00aa 100%);
        color: #fff;
    }

    .duendes-btn-orange {
        background: linear-gradient(135deg, #ff8800 0%, #ffaa00 100%);
        color: #000;
    }

    /* Forms */
    .duendes-form-group {
        margin-bottom: 20px;
    }

    .duendes-label {
        display: block;
        font-size: 12px;
        font-weight: 600;
        color: rgba(255, 255, 255, 0.7);
        margin-bottom: 8px;
        text-transform: uppercase;
        letter-spacing: 1px;
    }

    .duendes-input,
    .duendes-select,
    .duendes-textarea {
        width: 100%;
        padding: 14px 18px;
        background: rgba(0, 0, 0, 0.4);
        border: 2px solid rgba(255, 255, 255, 0.1);
        border-radius: 10px;
        font-size: 15px;
        color: #fff;
        transition: all 0.3s;
        box-sizing: border-box;
    }

    .duendes-input:focus,
    .duendes-select:focus,
    .duendes-textarea:focus {
        outline: none;
        border-color: #00ffff;
        box-shadow: 0 0 20px rgba(0, 255, 255, 0.2);
    }

    .duendes-textarea {
        min-height: 120px;
        resize: vertical;
    }

    .duendes-select option {
        background: #1a1a28;
        color: #fff;
    }

    /* Tables */
    .duendes-table {
        width: 100%;
        border-collapse: collapse;
    }

    .duendes-table th,
    .duendes-table td {
        padding: 14px 18px;
        text-align: left;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        color: #fff;
    }

    .duendes-table th {
        background: rgba(0, 0, 0, 0.3);
        font-weight: 600;
        font-size: 12px;
        text-transform: uppercase;
        letter-spacing: 1px;
        color: rgba(255, 255, 255, 0.6);
    }

    .duendes-table tr:hover {
        background: rgba(0, 255, 255, 0.05);
    }

    /* Badges */
    .duendes-badge {
        display: inline-block;
        padding: 6px 14px;
        border-radius: 20px;
        font-size: 12px;
        font-weight: 600;
    }

    .duendes-badge-cyan { background: rgba(0, 255, 255, 0.2); color: #00ffff; }
    .duendes-badge-green { background: rgba(0, 255, 136, 0.2); color: #00ff88; }
    .duendes-badge-magenta { background: rgba(255, 0, 255, 0.2); color: #ff00ff; }
    .duendes-badge-orange { background: rgba(255, 136, 0, 0.2); color: #ff8800; }

    /* Tabs */
    .duendes-tabs {
        display: flex;
        gap: 4px;
        margin-bottom: 24px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        flex-wrap: wrap;
    }

    .duendes-tab {
        padding: 14px 24px;
        background: none;
        border: none;
        font-size: 14px;
        font-weight: 600;
        color: rgba(255, 255, 255, 0.5);
        cursor: pointer;
        border-bottom: 3px solid transparent;
        margin-bottom: -1px;
        transition: all 0.3s;
    }

    .duendes-tab:hover {
        color: #00ffff;
    }

    .duendes-tab.active {
        color: #00ffff;
        border-bottom-color: #00ffff;
    }

    .duendes-tab-content {
        display: none;
    }

    .duendes-tab-content.active {
        display: block;
    }

    /* ═══════════════════════════════════════════════════════════════════════
       CHAT INTERFACE - TITO
       ═══════════════════════════════════════════════════════════════════════ */

    .tito-chat-container {
        display: flex;
        flex-direction: column;
        height: calc(100vh - 200px);
        min-height: 500px;
        background: linear-gradient(135deg, #0a0a0f 0%, #12121a 100%);
        border-radius: 20px;
        border: 1px solid rgba(0, 255, 255, 0.2);
        overflow: hidden;
    }

    .tito-chat-header {
        padding: 20px 24px;
        background: linear-gradient(135deg, #001a1a 0%, #002828 100%);
        border-bottom: 1px solid rgba(0, 255, 255, 0.2);
        display: flex;
        align-items: center;
        gap: 16px;
    }

    .tito-avatar {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: linear-gradient(135deg, #00ffff, #00ff88);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 28px;
        box-shadow: 0 0 20px rgba(0, 255, 255, 0.4);
    }

    .tito-status {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 13px;
        color: #00ff88;
    }

    .tito-status-dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: #00ff88;
        box-shadow: 0 0 10px #00ff88;
        animation: pulse 2s infinite;
    }

    @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.5; }
    }

    .tito-chat-messages {
        flex: 1;
        overflow-y: auto;
        padding: 24px;
        display: flex;
        flex-direction: column;
        gap: 16px;
    }

    .tito-message {
        max-width: 80%;
        padding: 16px 20px;
        border-radius: 16px;
        line-height: 1.6;
        animation: fadeIn 0.3s ease;
    }

    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
    }

    .tito-message-tito {
        align-self: flex-start;
        background: linear-gradient(135deg, #1a2a2a 0%, #1a3333 100%);
        border: 1px solid rgba(0, 255, 255, 0.2);
        color: #fff;
    }

    .tito-message-user {
        align-self: flex-end;
        background: linear-gradient(135deg, #00ffff 0%, #00ff88 100%);
        color: #000;
    }

    .tito-message-actions {
        margin-top: 12px;
        display: flex;
        gap: 8px;
        flex-wrap: wrap;
    }

    .tito-action-btn {
        padding: 8px 16px;
        background: rgba(0, 255, 255, 0.1);
        border: 1px solid rgba(0, 255, 255, 0.3);
        border-radius: 8px;
        color: #00ffff;
        font-size: 13px;
        cursor: pointer;
        transition: all 0.2s;
    }

    .tito-action-btn:hover {
        background: rgba(0, 255, 255, 0.2);
    }

    .tito-chat-input-container {
        padding: 20px 24px;
        background: linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 100%);
        border-top: 1px solid rgba(0, 255, 255, 0.2);
    }

    .tito-chat-input-wrapper {
        display: flex;
        gap: 12px;
    }

    .tito-chat-input {
        flex: 1;
        padding: 16px 20px;
        background: rgba(0, 0, 0, 0.4);
        border: 2px solid rgba(0, 255, 255, 0.2);
        border-radius: 12px;
        font-size: 15px;
        color: #fff;
        resize: none;
        min-height: 50px;
        max-height: 150px;
    }

    .tito-chat-input:focus {
        outline: none;
        border-color: #00ffff;
        box-shadow: 0 0 20px rgba(0, 255, 255, 0.2);
    }

    .tito-chat-input::placeholder {
        color: rgba(255, 255, 255, 0.4);
    }

    .tito-send-btn {
        padding: 16px 24px;
        background: linear-gradient(135deg, #00ffff 0%, #00ff88 100%);
        border: none;
        border-radius: 12px;
        color: #000;
        font-weight: 700;
        font-size: 16px;
        cursor: pointer;
        transition: all 0.3s;
    }

    .tito-send-btn:hover {
        transform: scale(1.05);
        box-shadow: 0 0 30px rgba(0, 255, 255, 0.5);
    }

    .tito-quick-actions {
        display: flex;
        gap: 8px;
        margin-top: 12px;
        flex-wrap: wrap;
    }

    .tito-quick-btn {
        padding: 8px 16px;
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 20px;
        color: rgba(255, 255, 255, 0.7);
        font-size: 13px;
        cursor: pointer;
        transition: all 0.2s;
    }

    .tito-quick-btn:hover {
        background: rgba(0, 255, 255, 0.1);
        border-color: rgba(0, 255, 255, 0.3);
        color: #00ffff;
    }

    /* Loading */
    .tito-typing {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 16px 20px;
        background: linear-gradient(135deg, #1a2a2a 0%, #1a3333 100%);
        border: 1px solid rgba(0, 255, 255, 0.2);
        border-radius: 16px;
        max-width: 200px;
    }

    .tito-typing-dots {
        display: flex;
        gap: 4px;
    }

    .tito-typing-dot {
        width: 8px;
        height: 8px;
        background: #00ffff;
        border-radius: 50%;
        animation: typing 1.4s infinite;
    }

    .tito-typing-dot:nth-child(2) { animation-delay: 0.2s; }
    .tito-typing-dot:nth-child(3) { animation-delay: 0.4s; }

    @keyframes typing {
        0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
        30% { transform: translateY(-8px); opacity: 1; }
    }

    /* Result Cards */
    .tito-result-card {
        background: rgba(0, 0, 0, 0.3);
        border: 1px solid rgba(0, 255, 255, 0.2);
        border-radius: 12px;
        padding: 16px;
        margin-top: 12px;
    }

    .tito-result-card h4 {
        margin: 0 0 8px 0;
        color: #00ffff;
        font-size: 14px;
    }

    .tito-result-card pre {
        margin: 0;
        white-space: pre-wrap;
        color: rgba(255, 255, 255, 0.8);
        font-size: 14px;
        line-height: 1.6;
    }

    /* User Avatar */
    .duendes-user-avatar {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: linear-gradient(135deg, #ff00ff, #ff00aa);
        color: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 600;
        font-size: 14px;
    }

    /* Responsive */
    @media (max-width: 782px) {
        .tito-chat-container {
            height: calc(100vh - 150px);
            border-radius: 0;
        }
        .tito-message {
            max-width: 90%;
        }
        .duendes-content {
            padding: 16px;
        }
    }
    </style>
    <?php
});

// ═══════════════════════════════════════════════════════════════════════════
// 1. TITO CHAT - PÁGINA PRINCIPAL
// ═══════════════════════════════════════════════════════════════════════════

function duendes_tito_chat_page() {
    ?>
    <div class="wrap duendes-wrap">
        <div class="duendes-header">
            <div>
                <h1>🧙 Tito Admin</h1>
                <p>Tu asistente mágico sin límites</p>
            </div>
            <div style="display: flex; gap: 12px;">
                <a href="<?php echo admin_url('admin.php?page=duendes-canalizaciones'); ?>" class="duendes-btn duendes-btn-secondary">🔮 Canalizaciones</a>
                <a href="<?php echo admin_url('admin.php?page=duendes-circulo'); ?>" class="duendes-btn duendes-btn-secondary">🌙 El Círculo</a>
            </div>
        </div>

        <div class="duendes-content">
            <div class="tito-chat-container">
                <div class="tito-chat-header">
                    <div class="tito-avatar">🧙</div>
                    <div>
                        <strong style="color: #fff; font-size: 16px;">Tito</strong>
                        <div class="tito-status">
                            <span class="tito-status-dot"></span>
                            Listo para ayudarte
                        </div>
                    </div>
                </div>

                <div class="tito-chat-messages" id="tito-messages">
                    <div class="tito-message tito-message-tito">
                        <strong>¡Hola! 🌟</strong><br><br>
                        Soy Tito, tu asistente mágico. Puedo hacer <strong>absolutamente todo</strong> por vos:<br><br>
                        • Crear productos completos desde fotos<br>
                        • Generar canalizaciones personalizadas<br>
                        • Crear contenido para El Círculo<br>
                        • Gestionar usuarios y runas<br>
                        • Generar imágenes con IA<br>
                        • Crear cupones, descuentos, promociones<br>
                        • Analizar ventas y sugerirte mejoras<br>
                        • Lo que me pidas... sin límites<br><br>
                        <strong>¿Qué necesitás?</strong>

                        <div class="tito-message-actions">
                            <button class="tito-action-btn" onclick="TitoChat.quickAction('crear producto')">✨ Crear producto</button>
                            <button class="tito-action-btn" onclick="TitoChat.quickAction('generar canalizacion')">🔮 Canalización</button>
                            <button class="tito-action-btn" onclick="TitoChat.quickAction('ver estadisticas')">📊 Estadísticas</button>
                        </div>
                    </div>
                </div>

                <div class="tito-chat-input-container">
                    <div class="tito-chat-input-wrapper">
                        <textarea class="tito-chat-input" id="tito-input" placeholder="Escribí lo que necesitás... (Ej: 'creame un producto con estas fotos', 'generá el contenido de febrero')" rows="1"></textarea>
                        <button class="tito-send-btn" onclick="TitoChat.send()">Enviar</button>
                    </div>
                    <div class="tito-quick-actions">
                        <button class="tito-quick-btn" onclick="TitoChat.quickAction('crear cupon 20%')">🎟️ Crear cupón</button>
                        <button class="tito-quick-btn" onclick="TitoChat.quickAction('regalar 100 runas a')">💎 Regalar runas</button>
                        <button class="tito-quick-btn" onclick="TitoChat.quickAction('generar semana del circulo')">📅 Generar semana</button>
                        <button class="tito-quick-btn" onclick="TitoChat.quickAction('ver usuarios mi magia')">👥 Usuarios</button>
                        <button class="tito-quick-btn" onclick="TitoChat.quickAction('crear banner promocional')">🎨 Crear banner</button>
                        <button class="tito-quick-btn" onclick="TitoChat.quickAction('analizar ventas del mes')">📈 Ventas</button>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script>
    var TitoChat = {
        messagesContainer: null,
        input: null,

        init: function() {
            this.messagesContainer = document.getElementById('tito-messages');
            this.input = document.getElementById('tito-input');

            // Auto-resize textarea
            this.input.addEventListener('input', function() {
                this.style.height = 'auto';
                this.style.height = Math.min(this.scrollHeight, 150) + 'px';
            });

            // Enter to send
            this.input.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    TitoChat.send();
                }
            });
        },

        send: function() {
            var message = this.input.value.trim();
            if (!message) return;

            // Add user message
            this.addMessage(message, 'user');
            this.input.value = '';
            this.input.style.height = 'auto';

            // Show typing indicator
            this.showTyping();

            // Send to API
            fetch('<?php echo DUENDES_API_URL; ?>/admin/tito-chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: message,
                    context: 'admin_full_access'
                })
            })
            .then(r => r.json())
            .then(result => {
                this.hideTyping();
                if (result.success) {
                    this.addMessage(result.response, 'tito', result.actions);
                } else {
                    this.addMessage('Hubo un error: ' + (result.error || 'Error desconocido'), 'tito');
                }
            })
            .catch(err => {
                this.hideTyping();
                this.addMessage('Error de conexión. Reintentá en unos segundos.', 'tito');
            });
        },

        quickAction: function(action) {
            this.input.value = action;
            this.input.focus();
        },

        addMessage: function(content, type, actions) {
            var div = document.createElement('div');
            div.className = 'tito-message tito-message-' + type;
            div.innerHTML = content.replace(/\n/g, '<br>');

            if (actions && actions.length > 0) {
                var actionsDiv = document.createElement('div');
                actionsDiv.className = 'tito-message-actions';
                actions.forEach(function(action) {
                    var btn = document.createElement('button');
                    btn.className = 'tito-action-btn';
                    btn.textContent = action.label;
                    btn.onclick = function() { TitoChat.executeAction(action); };
                    actionsDiv.appendChild(btn);
                });
                div.appendChild(actionsDiv);
            }

            this.messagesContainer.appendChild(div);
            this.scrollToBottom();
        },

        showTyping: function() {
            var typing = document.createElement('div');
            typing.className = 'tito-typing';
            typing.id = 'tito-typing';
            typing.innerHTML = '<div class="tito-typing-dots"><span class="tito-typing-dot"></span><span class="tito-typing-dot"></span><span class="tito-typing-dot"></span></div><span style="color: rgba(255,255,255,0.6);">Tito está pensando...</span>';
            this.messagesContainer.appendChild(typing);
            this.scrollToBottom();
        },

        hideTyping: function() {
            var typing = document.getElementById('tito-typing');
            if (typing) typing.remove();
        },

        scrollToBottom: function() {
            this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
        },

        executeAction: function(action) {
            if (action.type === 'link') {
                window.location.href = action.url;
            } else if (action.type === 'command') {
                this.input.value = action.command;
                this.send();
            }
        }
    };

    document.addEventListener('DOMContentLoaded', function() {
        TitoChat.init();
    });
    </script>
    <?php
}

// ═══════════════════════════════════════════════════════════════════════════
// 2. CANALIZACIONES
// ═══════════════════════════════════════════════════════════════════════════

function duendes_canalizaciones_page() {
    $products = wc_get_products(['status' => 'publish', 'limit' => -1, 'orderby' => 'title', 'order' => 'ASC']);
    ?>
    <div class="wrap duendes-wrap">
        <div class="duendes-header bg-neon-magenta" style="background: linear-gradient(135deg, #1a001a 0%, #330022 100%); border-bottom: 1px solid rgba(255, 0, 255, 0.3);">
            <div>
                <h1 style="background: linear-gradient(90deg, #ff00ff, #ff66ff); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">🔮 Canalizaciones</h1>
                <p>Genera canalizaciones personalizadas</p>
            </div>
        </div>

        <div class="duendes-content">
            <div class="duendes-grid" style="grid-template-columns: 1.5fr 1fr;">
                <div class="duendes-card">
                    <div class="duendes-card-header">
                        <div class="duendes-card-icon" style="background: rgba(255, 0, 255, 0.2);">🔮</div>
                        <h3 class="duendes-card-title">Nueva Canalización</h3>
                    </div>

                    <form id="canalizacion-form">
                        <div class="duendes-grid" style="grid-template-columns: 1fr 1fr;">
                            <div class="duendes-form-group">
                                <label class="duendes-label">Guardián / Duende</label>
                                <select name="producto_id" class="duendes-select" required>
                                    <option value="">Seleccionar...</option>
                                    <?php foreach ($products as $p): ?>
                                    <option value="<?php echo $p->get_id(); ?>"><?php echo esc_html($p->get_name()); ?></option>
                                    <?php endforeach; ?>
                                </select>
                            </div>
                            <div class="duendes-form-group">
                                <label class="duendes-label">Nombre del Cliente</label>
                                <input type="text" name="cliente_nombre" class="duendes-input" required>
                            </div>
                        </div>

                        <div class="duendes-grid" style="grid-template-columns: 1fr 1fr;">
                            <div class="duendes-form-group">
                                <label class="duendes-label">Email</label>
                                <input type="email" name="cliente_email" class="duendes-input">
                            </div>
                            <div class="duendes-form-group">
                                <label class="duendes-label">País</label>
                                <input type="text" name="cliente_pais" class="duendes-input">
                            </div>
                        </div>

                        <div class="duendes-form-group">
                            <label class="duendes-label">Momento que atraviesa</label>
                            <textarea name="momento_vida" class="duendes-textarea" placeholder="Describe la situación..."></textarea>
                        </div>

                        <div class="duendes-form-group">
                            <label class="duendes-label">Qué busca / necesita</label>
                            <textarea name="necesidad" class="duendes-textarea" placeholder="Protección, claridad, abundancia..."></textarea>
                        </div>

                        <div class="duendes-form-group">
                            <label class="duendes-label">Foto del Cliente (opcional)</label>
                            <input type="file" name="foto" class="duendes-input" accept="image/*">
                        </div>

                        <button type="submit" class="duendes-btn duendes-btn-magenta">
                            🔮 Generar Canalización
                        </button>
                    </form>
                </div>

                <div class="duendes-card">
                    <div class="duendes-card-header">
                        <div class="duendes-card-icon" style="background: rgba(0, 255, 136, 0.2);">👁️</div>
                        <h3 class="duendes-card-title">Vista Previa</h3>
                    </div>
                    <div id="canalizacion-preview" style="color: rgba(255,255,255,0.5); text-align: center; padding: 40px;">
                        La canalización aparecerá aquí...
                    </div>
                    <div id="canalizacion-actions" style="display: none; margin-top: 20px; gap: 12px;">
                        <button class="duendes-btn duendes-btn-primary" onclick="copiarCanalizacion()">📋 Copiar</button>
                        <button class="duendes-btn duendes-btn-secondary" onclick="enviarEmail()">📧 Enviar Email</button>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script>
    document.getElementById('canalizacion-form').addEventListener('submit', function(e) {
        e.preventDefault();
        var preview = document.getElementById('canalizacion-preview');
        var actions = document.getElementById('canalizacion-actions');
        var formData = new FormData(this);

        preview.innerHTML = '<div style="color: #ff00ff;">🔮 Generando canalización...</div>';

        fetch('<?php echo DUENDES_API_URL; ?>/admin/canalizacion-manual', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                producto_id: formData.get('producto_id'),
                cliente_nombre: formData.get('cliente_nombre'),
                cliente_email: formData.get('cliente_email'),
                cliente_pais: formData.get('cliente_pais'),
                momento_vida: formData.get('momento_vida'),
                necesidad: formData.get('necesidad')
            })
        })
        .then(r => r.json())
        .then(result => {
            if (result.success) {
                preview.innerHTML = '<div style="white-space: pre-wrap; line-height: 1.8; color: #fff;">' + result.canalizacion + '</div>';
                actions.style.display = 'flex';
            } else {
                preview.innerHTML = '<div style="color: #ff4444;">Error: ' + result.error + '</div>';
            }
        })
        .catch(err => {
            preview.innerHTML = '<div style="color: #ff4444;">Error de conexión</div>';
        });
    });

    function copiarCanalizacion() {
        var text = document.getElementById('canalizacion-preview').innerText;
        navigator.clipboard.writeText(text);
        alert('Copiado!');
    }
    </script>
    <?php
}

// ═══════════════════════════════════════════════════════════════════════════
// 3. USUARIOS
// ═══════════════════════════════════════════════════════════════════════════

function duendes_usuarios_page() {
    $all_users = get_users(['number' => 100, 'orderby' => 'registered', 'order' => 'DESC']);
    ?>
    <div class="wrap duendes-wrap">
        <div class="duendes-header" style="background: linear-gradient(135deg, #001a0f 0%, #003322 100%); border-bottom: 1px solid rgba(0, 255, 136, 0.3);">
            <div>
                <h1 style="background: linear-gradient(90deg, #00ff88, #00ffaa); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">👥 Usuarios</h1>
                <p>Gestión completa de usuarios</p>
            </div>
            <button class="duendes-btn duendes-btn-primary" onclick="mostrarCrearUsuario()">➕ Crear Usuario</button>
        </div>

        <div class="duendes-content">
            <div class="duendes-tabs">
                <button class="duendes-tab active" onclick="showUserTab('todos')">👥 Todos</button>
                <button class="duendes-tab" onclick="showUserTab('mimagia')">✨ Mi Magia</button>
                <button class="duendes-tab" onclick="showUserTab('circulo')">🌙 El Círculo</button>
            </div>

            <div id="tab-todos" class="duendes-tab-content active">
                <div class="duendes-card">
                    <table class="duendes-table">
                        <thead>
                            <tr>
                                <th>Usuario</th>
                                <th>Email</th>
                                <th>Registro</th>
                                <th>Mi Magia</th>
                                <th>Runas</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php foreach ($all_users as $user):
                                $mi_magia = get_user_meta($user->ID, 'mi_magia_active', true);
                                $runas = get_user_meta($user->ID, 'runas_poder', true) ?: 0;
                            ?>
                            <tr>
                                <td>
                                    <div style="display: flex; align-items: center; gap: 12px;">
                                        <div class="duendes-user-avatar"><?php echo strtoupper(substr($user->display_name, 0, 2)); ?></div>
                                        <div>
                                            <strong><?php echo esc_html($user->display_name); ?></strong><br>
                                            <small style="color: rgba(255,255,255,0.5);">@<?php echo esc_html($user->user_login); ?></small>
                                        </div>
                                    </div>
                                </td>
                                <td><?php echo esc_html($user->user_email); ?></td>
                                <td><?php echo date('d/m/Y', strtotime($user->user_registered)); ?></td>
                                <td>
                                    <?php if ($mi_magia): ?>
                                        <span class="duendes-badge duendes-badge-magenta">Activo</span>
                                    <?php else: ?>
                                        <span class="duendes-badge" style="background: rgba(255,255,255,0.1); color: rgba(255,255,255,0.4);">-</span>
                                    <?php endif; ?>
                                </td>
                                <td><span class="neon-cyan"><?php echo $runas; ?></span> 💎</td>
                                <td>
                                    <button class="duendes-btn duendes-btn-secondary" style="padding: 8px 12px;" onclick="regalarRunas(<?php echo $user->ID; ?>)">💎</button>
                                    <button class="duendes-btn duendes-btn-secondary" style="padding: 8px 12px;" onclick="toggleMiMagia(<?php echo $user->ID; ?>)">✨</button>
                                </td>
                            </tr>
                            <?php endforeach; ?>
                        </tbody>
                    </table>
                </div>
            </div>

            <div id="tab-mimagia" class="duendes-tab-content">
                <div class="duendes-card">
                    <p style="color: rgba(255,255,255,0.5); text-align: center; padding: 40px;">Usuarios con Mi Magia activo</p>
                </div>
            </div>

            <div id="tab-circulo" class="duendes-tab-content">
                <div class="duendes-card">
                    <p style="color: rgba(255,255,255,0.5); text-align: center; padding: 40px;">Miembros de El Círculo</p>
                </div>
            </div>
        </div>
    </div>

    <script>
    function showUserTab(tab) {
        document.querySelectorAll('.duendes-tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.duendes-tab-content').forEach(c => c.classList.remove('active'));
        event.target.classList.add('active');
        document.getElementById('tab-' + tab).classList.add('active');
    }

    function regalarRunas(userId) {
        var cantidad = prompt('¿Cuántas runas querés regalar?', '50');
        if (cantidad) {
            alert('Regalando ' + cantidad + ' runas al usuario ' + userId);
            // Implementar AJAX
        }
    }

    function toggleMiMagia(userId) {
        if (confirm('¿Activar/desactivar Mi Magia para este usuario?')) {
            alert('Cambiando estado de Mi Magia...');
            // Implementar AJAX
        }
    }

    function mostrarCrearUsuario() {
        alert('Formulario de crear usuario - próximamente');
    }
    </script>
    <?php
}

// ═══════════════════════════════════════════════════════════════════════════
// 4. EL CÍRCULO
// ═══════════════════════════════════════════════════════════════════════════

function duendes_circulo_page() {
    ?>
    <div class="wrap duendes-wrap">
        <div class="duendes-header" style="background: linear-gradient(135deg, #0f001a 0%, #220044 100%); border-bottom: 1px solid rgba(170, 0, 255, 0.3);">
            <div>
                <h1 style="background: linear-gradient(90deg, #aa00ff, #ff00ff); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">🌙 El Círculo</h1>
                <p>Generador de contenido mágico</p>
            </div>
        </div>

        <div class="duendes-content">
            <div class="duendes-tabs">
                <button class="duendes-tab active" onclick="showCirculoTab('generar')">🪄 Generar</button>
                <button class="duendes-tab" onclick="showCirculoTab('calendario')">📅 Calendario</button>
                <button class="duendes-tab" onclick="showCirculoTab('miembros')">👥 Miembros</button>
                <button class="duendes-tab" onclick="showCirculoTab('promos')">🎁 Promos</button>
            </div>

            <!-- Tab: Generar -->
            <div id="tab-generar" class="duendes-tab-content active">
                <div class="duendes-grid" style="grid-template-columns: 1fr 1fr;">
                    <div class="duendes-card">
                        <div class="duendes-card-header">
                            <div class="duendes-card-icon" style="background: rgba(170, 0, 255, 0.2);">🪄</div>
                            <h3 class="duendes-card-title">Generar Contenido</h3>
                        </div>

                        <form id="circulo-generar-form">
                            <div class="duendes-form-group">
                                <label class="duendes-label">Período a generar</label>
                                <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-top: 10px;">
                                    <label style="display: flex; align-items: center; gap: 8px; padding: 12px; background: rgba(255,255,255,0.05); border-radius: 8px; cursor: pointer; border: 2px solid transparent;" class="periodo-option">
                                        <input type="radio" name="periodo" value="dia" style="accent-color: #aa00ff;"> Día
                                    </label>
                                    <label style="display: flex; align-items: center; gap: 8px; padding: 12px; background: rgba(255,255,255,0.05); border-radius: 8px; cursor: pointer; border: 2px solid transparent;" class="periodo-option">
                                        <input type="radio" name="periodo" value="semana" checked style="accent-color: #aa00ff;"> Semana
                                    </label>
                                    <label style="display: flex; align-items: center; gap: 8px; padding: 12px; background: rgba(255,255,255,0.05); border-radius: 8px; cursor: pointer; border: 2px solid transparent;" class="periodo-option">
                                        <input type="radio" name="periodo" value="quincena" style="accent-color: #aa00ff;"> Quincena
                                    </label>
                                    <label style="display: flex; align-items: center; gap: 8px; padding: 12px; background: rgba(255,255,255,0.05); border-radius: 8px; cursor: pointer; border: 2px solid transparent;" class="periodo-option">
                                        <input type="radio" name="periodo" value="mes" style="accent-color: #aa00ff;"> Mes
                                    </label>
                                </div>
                            </div>

                            <div class="duendes-grid" style="grid-template-columns: 1fr 1fr;">
                                <div class="duendes-form-group">
                                    <label class="duendes-label">Mes</label>
                                    <select name="mes" class="duendes-select">
                                        <option value="1">Enero</option>
                                        <option value="2">Febrero</option>
                                        <option value="3">Marzo</option>
                                        <option value="4">Abril</option>
                                        <option value="5">Mayo</option>
                                        <option value="6">Junio</option>
                                        <option value="7">Julio</option>
                                        <option value="8">Agosto</option>
                                        <option value="9">Septiembre</option>
                                        <option value="10">Octubre</option>
                                        <option value="11">Noviembre</option>
                                        <option value="12">Diciembre</option>
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
                                <label class="duendes-label">Tipo de contenido</label>
                                <div style="display: flex; flex-direction: column; gap: 10px; margin-top: 10px;">
                                    <label style="display: flex; align-items: center; gap: 10px; color: #fff; cursor: pointer;">
                                        <input type="checkbox" name="tipos[]" value="meditacion" checked style="accent-color: #aa00ff;"> 🧘 Meditaciones
                                    </label>
                                    <label style="display: flex; align-items: center; gap: 10px; color: #fff; cursor: pointer;">
                                        <input type="checkbox" name="tipos[]" value="ritual" checked style="accent-color: #aa00ff;"> 🕯️ Rituales
                                    </label>
                                    <label style="display: flex; align-items: center; gap: 10px; color: #fff; cursor: pointer;">
                                        <input type="checkbox" name="tipos[]" value="lectura" checked style="accent-color: #aa00ff;"> 🔮 Lecturas de energía
                                    </label>
                                    <label style="display: flex; align-items: center; gap: 10px; color: #fff; cursor: pointer;">
                                        <input type="checkbox" name="tipos[]" value="guardian" checked style="accent-color: #aa00ff;"> 🧙 Mensaje del guardián
                                    </label>
                                    <label style="display: flex; align-items: center; gap: 10px; color: #fff; cursor: pointer;">
                                        <input type="checkbox" name="tipos[]" value="cristal" checked style="accent-color: #aa00ff;"> 💎 Cristal del período
                                    </label>
                                </div>
                            </div>

                            <div class="duendes-form-group">
                                <label class="duendes-label">Generar imágenes (OpenAI)</label>
                                <select name="imagenes" class="duendes-select">
                                    <option value="todas">Todas las imágenes</option>
                                    <option value="principales">Solo principales</option>
                                    <option value="ninguna">Sin imágenes</option>
                                </select>
                            </div>

                            <div class="duendes-form-group">
                                <label class="duendes-label">Tema especial (opcional)</label>
                                <input type="text" name="tema" class="duendes-input" placeholder="Ej: Luna de cosecha, Equinoccio...">
                            </div>

                            <button type="submit" class="duendes-btn" style="background: linear-gradient(135deg, #aa00ff, #ff00ff); color: #fff; width: 100%;">
                                🪄 Generar Contenido
                            </button>
                        </form>
                    </div>

                    <div class="duendes-card">
                        <div class="duendes-card-header">
                            <div class="duendes-card-icon" style="background: rgba(0, 255, 255, 0.2);">👁️</div>
                            <h3 class="duendes-card-title">Vista Previa</h3>
                        </div>
                        <div id="circulo-preview" style="color: rgba(255,255,255,0.5); text-align: center; padding: 40px; max-height: 500px; overflow-y: auto;">
                            El contenido generado aparecerá aquí...
                        </div>
                    </div>
                </div>
            </div>

            <!-- Tab: Calendario -->
            <div id="tab-calendario" class="duendes-tab-content">
                <div class="duendes-card">
                    <div class="duendes-card-header">
                        <div class="duendes-card-icon" style="background: rgba(255, 136, 0, 0.2);">📅</div>
                        <h3 class="duendes-card-title">Calendario de Contenido</h3>
                    </div>
                    <div id="calendario-container" style="min-height: 400px;">
                        <!-- Calendario aquí -->
                        <p style="color: rgba(255,255,255,0.5); text-align: center; padding: 60px;">Cargando calendario...</p>
                    </div>
                </div>
            </div>

            <!-- Tab: Miembros -->
            <div id="tab-miembros" class="duendes-tab-content">
                <div class="duendes-card">
                    <div class="duendes-card-header">
                        <div class="duendes-card-icon" style="background: rgba(0, 255, 136, 0.2);">👥</div>
                        <h3 class="duendes-card-title">Gestión de Miembros</h3>
                    </div>
                    <div style="display: flex; gap: 12px; margin-bottom: 20px; flex-wrap: wrap;">
                        <button class="duendes-btn duendes-btn-primary" onclick="habilitarRegistros()">✅ Habilitar Registros</button>
                        <button class="duendes-btn duendes-btn-secondary" onclick="regalarTiempoGratis()">🎁 Regalar Tiempo Gratis</button>
                        <button class="duendes-btn duendes-btn-secondary" onclick="regalarRunasMasivo()">💎 Regalar Runas</button>
                        <button class="duendes-btn duendes-btn-secondary" onclick="crearCupon()">🎟️ Crear Cupón</button>
                    </div>
                    <p style="color: rgba(255,255,255,0.5);">Lista de miembros del Círculo...</p>
                </div>
            </div>

            <!-- Tab: Promos -->
            <div id="tab-promos" class="duendes-tab-content">
                <div class="duendes-card">
                    <div class="duendes-card-header">
                        <div class="duendes-card-icon" style="background: rgba(255, 0, 255, 0.2);">🎁</div>
                        <h3 class="duendes-card-title">Promociones y Competencias</h3>
                    </div>
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 16px;">
                        <div style="background: rgba(0,0,0,0.3); border: 1px solid rgba(255,136,0,0.3); border-radius: 12px; padding: 20px; cursor: pointer;" onclick="crearPromo('descuento')">
                            <div style="font-size: 32px; margin-bottom: 10px;">🏷️</div>
                            <strong style="color: #ff8800;">Crear Descuento</strong>
                            <p style="color: rgba(255,255,255,0.5); font-size: 13px; margin-top: 8px;">Porcentaje o monto fijo</p>
                        </div>
                        <div style="background: rgba(0,0,0,0.3); border: 1px solid rgba(0,255,255,0.3); border-radius: 12px; padding: 20px; cursor: pointer;" onclick="crearPromo('cupon')">
                            <div style="font-size: 32px; margin-bottom: 10px;">🎟️</div>
                            <strong style="color: #00ffff;">Crear Cupón</strong>
                            <p style="color: rgba(255,255,255,0.5); font-size: 13px; margin-top: 8px;">Código promocional</p>
                        </div>
                        <div style="background: rgba(0,0,0,0.3); border: 1px solid rgba(0,255,136,0.3); border-radius: 12px; padding: 20px; cursor: pointer;" onclick="crearPromo('competencia')">
                            <div style="font-size: 32px; margin-bottom: 10px;">🏆</div>
                            <strong style="color: #00ff88;">Crear Competencia</strong>
                            <p style="color: rgba(255,255,255,0.5); font-size: 13px; margin-top: 8px;">Retos y premios</p>
                        </div>
                        <div style="background: rgba(0,0,0,0.3); border: 1px solid rgba(255,0,255,0.3); border-radius: 12px; padding: 20px; cursor: pointer;" onclick="crearPromo('regalo')">
                            <div style="font-size: 32px; margin-bottom: 10px;">🎁</div>
                            <strong style="color: #ff00ff;">Regalo Masivo</strong>
                            <p style="color: rgba(255,255,255,0.5); font-size: 13px; margin-top: 8px;">Runas, lecturas, tiempo</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script>
    function showCirculoTab(tab) {
        document.querySelectorAll('.duendes-tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.duendes-tab-content').forEach(c => c.classList.remove('active'));
        event.target.classList.add('active');
        document.getElementById('tab-' + tab).classList.add('active');
    }

    function habilitarRegistros() { alert('Habilitando registros...'); }
    function regalarTiempoGratis() { alert('Configurar tiempo gratis...'); }
    function regalarRunasMasivo() { alert('Regalar runas masivamente...'); }
    function crearCupon() { alert('Crear cupón...'); }
    function crearPromo(tipo) { alert('Crear ' + tipo + '...'); }

    document.getElementById('circulo-generar-form').addEventListener('submit', function(e) {
        e.preventDefault();
        var preview = document.getElementById('circulo-preview');
        preview.innerHTML = '<div style="color: #aa00ff;">🪄 Generando contenido mágico...</div>';

        setTimeout(function() {
            preview.innerHTML = '<div style="color: #00ff88;">✅ Contenido generado!</div><br><div style="text-align: left; color: #fff;">Aquí aparecería el contenido generado por Claude...</div>';
        }, 2000);
    });
    </script>
    <?php
}

// ═══════════════════════════════════════════════════════════════════════════
// 5. BANNERS
// ═══════════════════════════════════════════════════════════════════════════

function duendes_banners_page() {
    ?>
    <div class="wrap duendes-wrap">
        <div class="duendes-header" style="background: linear-gradient(135deg, #1a0f00 0%, #332200 100%); border-bottom: 1px solid rgba(255, 136, 0, 0.3);">
            <div>
                <h1 style="background: linear-gradient(90deg, #ff8800, #ffaa00); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">🎨 Banners & Promos</h1>
                <p>Crea banners promocionales</p>
            </div>
        </div>

        <div class="duendes-content">
            <div class="duendes-grid">
                <div class="duendes-card">
                    <div class="duendes-card-header">
                        <div class="duendes-card-icon" style="background: rgba(255, 136, 0, 0.2);">🖼️</div>
                        <h3 class="duendes-card-title">Crear Banner</h3>
                    </div>

                    <form id="banner-form">
                        <div class="duendes-form-group">
                            <label class="duendes-label">Título</label>
                            <input type="text" name="titulo" class="duendes-input" placeholder="¡50% OFF!">
                        </div>
                        <div class="duendes-form-group">
                            <label class="duendes-label">Subtítulo</label>
                            <input type="text" name="subtitulo" class="duendes-input" placeholder="Solo por tiempo limitado">
                        </div>
                        <div class="duendes-form-group">
                            <label class="duendes-label">Imagen</label>
                            <input type="file" name="imagen" class="duendes-input" accept="image/*">
                        </div>
                        <div class="duendes-form-group">
                            <label class="duendes-label">Ubicación</label>
                            <select name="ubicacion" class="duendes-select">
                                <option value="mi_magia">Mi Magia - Home</option>
                                <option value="tienda">Tienda</option>
                                <option value="checkout">Checkout</option>
                            </select>
                        </div>
                        <button type="submit" class="duendes-btn duendes-btn-orange">🎨 Crear Banner</button>
                    </form>
                </div>

                <div class="duendes-card">
                    <div class="duendes-card-header">
                        <div class="duendes-card-icon" style="background: rgba(0, 255, 255, 0.2);">📋</div>
                        <h3 class="duendes-card-title">Banners Activos</h3>
                    </div>
                    <p style="color: rgba(255,255,255,0.5); text-align: center; padding: 40px;">No hay banners activos</p>
                </div>
            </div>
        </div>
    </div>
    <?php
}
