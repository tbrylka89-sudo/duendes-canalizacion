<?php
/**
 * Plugin Name: Duendes - Tito Widget Chat
 * Description: Widget de chat de Tito para toda la web
 * Version: 4.0
 * Author: Duendes del Uruguay
 */

if (!defined('ABSPATH')) exit;

/**
 * Inyectar el widget de Tito en el footer
 */
add_action('wp_footer', 'duendes_tito_widget_html', 99);

function duendes_tito_widget_html() {
    // No mostrar en admin
    if (is_admin()) return;

    // No mostrar en páginas específicas si es necesario
    // if (is_page('mi-magia')) return;

    // Detectar usuario logueado
    $usuario_data = array(
        'logueado' => false,
        'nombre' => '',
        'email' => '',
        'esCliente' => false,
        'totalCompras' => 0
    );

    if (is_user_logged_in()) {
        $user = wp_get_current_user();
        $usuario_data['logueado'] = true;
        $usuario_data['nombre'] = $user->first_name ?: $user->display_name;
        $usuario_data['email'] = $user->user_email;

        // Verificar si es cliente (tiene pedidos)
        if (class_exists('WooCommerce')) {
            $customer_orders = wc_get_orders(array(
                'customer' => $user->user_email,
                'limit' => 5,
                'status' => array('completed', 'processing', 'on-hold')
            ));
            if (!empty($customer_orders)) {
                $usuario_data['esCliente'] = true;
                $usuario_data['totalCompras'] = count($customer_orders);
            }
        }
    }
    ?>
<script>
window.titoUsuario = <?php echo json_encode($usuario_data); ?>;
</script>
<style>
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600&family=Cormorant+Garamond:ital,wght@0,400;0,500;1,400&display=swap');

:root {
    --tito-dorado: #d4af37;
    --tito-dorado-claro: #e6c860;
    --tito-dorado-oscuro: #b8960c;
    --tito-negro: #0a0a0a;
    --tito-negro-suave: #1a1a1a;
    --tito-blanco: rgba(255,255,255,0.9);
    --tito-blanco-suave: rgba(255,255,255,0.6);
}

.tito-widget {
    position: fixed !important;
    bottom: 25px !important;
    right: 25px !important;
    z-index: 999999 !important;
    font-family: 'Cormorant Garamond', Georgia, serif !important;
}

.tito-toggle {
    width: 75px !important;
    height: 75px !important;
    background: linear-gradient(135deg, var(--tito-negro-suave) 0%, var(--tito-negro) 100%) !important;
    border: 2px solid var(--tito-dorado) !important;
    border-radius: 50% !important;
    cursor: pointer !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    box-shadow: 0 5px 30px rgba(0,0,0,0.4), 0 0 25px rgba(212,175,55,0.25) !important;
    transition: all 0.3s ease !important;
    position: relative !important;
    animation: titoFloat 3s ease-in-out infinite !important;
    padding: 0 !important;
    overflow: hidden !important;
}

.tito-toggle img {
    width: 100% !important;
    height: 100% !important;
    object-fit: cover !important;
    border-radius: 50% !important;
}

.tito-toggle:hover {
    transform: scale(1.1) !important;
    animation: none !important;
    box-shadow: 0 8px 40px rgba(0,0,0,0.5), 0 0 40px rgba(212,175,55,0.4) !important;
}

@keyframes titoFloat {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-6px); }
}

.tito-notif {
    position: absolute !important;
    top: -5px !important;
    right: -5px !important;
    width: 24px !important;
    height: 24px !important;
    background: var(--tito-dorado) !important;
    color: var(--tito-negro) !important;
    font-size: 12px !important;
    font-weight: 700 !important;
    border-radius: 50% !important;
    display: none;
    align-items: center !important;
    justify-content: center !important;
    animation: titoPulse 2s infinite !important;
}

@keyframes titoPulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.15); }
}

.tito-burbuja {
    position: absolute !important;
    bottom: 95px !important;
    right: 0 !important;
    width: 320px !important;
    background: linear-gradient(135deg, var(--tito-negro-suave), var(--tito-negro)) !important;
    border: 1px solid rgba(212,175,55,0.4) !important;
    border-radius: 18px !important;
    padding: 18px 20px !important;
    box-shadow: 0 15px 50px rgba(0,0,0,0.5), 0 0 25px rgba(212,175,55,0.15) !important;
    opacity: 0 !important;
    visibility: hidden !important;
    transform: translateY(15px) scale(0.95) !important;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1) !important;
}

.tito-burbuja.visible {
    opacity: 1 !important;
    visibility: visible !important;
    transform: translateY(0) scale(1) !important;
}

.tito-burbuja::after {
    content: '' !important;
    position: absolute !important;
    bottom: -10px !important;
    right: 28px !important;
    border-left: 10px solid transparent !important;
    border-right: 10px solid transparent !important;
    border-top: 10px solid var(--tito-negro-suave) !important;
}

.tito-burbuja-close {
    position: absolute !important;
    top: 10px !important;
    right: 12px !important;
    background: none !important;
    border: none !important;
    color: var(--tito-blanco-suave) !important;
    font-size: 20px !important;
    cursor: pointer !important;
    padding: 0 !important;
    line-height: 1 !important;
    transition: color 0.2s !important;
}

.tito-burbuja-close:hover {
    color: #fff !important;
}

.tito-burbuja-texto {
    color: var(--tito-blanco) !important;
    font-size: 15px !important;
    line-height: 1.55 !important;
    margin: 0 0 15px 0 !important;
    padding-right: 25px !important;
}

.tito-burbuja-texto strong {
    color: var(--tito-dorado-claro) !important;
}

.tito-burbuja-botones {
    display: flex !important;
    gap: 10px !important;
    flex-wrap: wrap !important;
}

.tito-burbuja-btn {
    flex: 1 !important;
    min-width: 100px !important;
    background: rgba(212,175,55,0.12) !important;
    border: 1px solid rgba(212,175,55,0.4) !important;
    color: var(--tito-dorado) !important;
    padding: 11px 14px !important;
    border-radius: 25px !important;
    font-family: 'Cormorant Garamond', serif !important;
    font-size: 13px !important;
    cursor: pointer !important;
    transition: all 0.3s ease !important;
    text-align: center !important;
}

.tito-burbuja-btn:hover {
    background: rgba(212,175,55,0.22) !important;
    border-color: var(--tito-dorado) !important;
}

.tito-burbuja-btn.primary {
    background: linear-gradient(135deg, var(--tito-dorado), var(--tito-dorado-oscuro)) !important;
    color: var(--tito-negro) !important;
    border: none !important;
    font-weight: 600 !important;
}

.tito-burbuja-btn.primary:hover {
    box-shadow: 0 5px 20px rgba(212,175,55,0.4) !important;
    transform: scale(1.02) !important;
}

.tito-burbuja-galeria {
    display: flex !important;
    gap: 10px !important;
    margin-bottom: 15px !important;
    overflow-x: auto !important;
    padding-bottom: 5px !important;
    scrollbar-width: none !important;
}

.tito-burbuja-galeria::-webkit-scrollbar {
    display: none !important;
}

.tito-burbuja-producto {
    flex-shrink: 0 !important;
    width: 90px !important;
    text-align: center !important;
    cursor: pointer !important;
    transition: transform 0.2s !important;
}

.tito-burbuja-producto:hover {
    transform: scale(1.05) !important;
}

.tito-burbuja-producto img {
    width: 80px !important;
    height: 80px !important;
    object-fit: cover !important;
    border-radius: 10px !important;
    border: 1px solid rgba(212,175,55,0.3) !important;
}

.tito-burbuja-producto-nombre {
    font-size: 11px !important;
    color: var(--tito-blanco-suave) !important;
    margin-top: 5px !important;
    white-space: nowrap !important;
    overflow: hidden !important;
    text-overflow: ellipsis !important;
}

.tito-window {
    position: absolute !important;
    bottom: 95px !important;
    right: 0 !important;
    width: 400px !important;
    height: 580px !important;
    background: linear-gradient(180deg, #12151a 0%, #0a0c10 100%) !important;
    border: 1px solid rgba(212,175,55,0.3) !important;
    border-radius: 25px !important;
    overflow: hidden !important;
    opacity: 0 !important;
    visibility: hidden !important;
    transform: translateY(20px) scale(0.95) !important;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1) !important;
    box-shadow: 0 30px 80px rgba(0,0,0,0.6) !important;
    display: flex !important;
    flex-direction: column !important;
}

.tito-window.visible {
    opacity: 1 !important;
    visibility: visible !important;
    transform: translateY(0) scale(1) !important;
}

.tito-header {
    background: linear-gradient(135deg, rgba(212,175,55,0.15), rgba(212,175,55,0.05)) !important;
    border-bottom: 1px solid rgba(212,175,55,0.2) !important;
    padding: 16px 20px !important;
    display: flex !important;
    align-items: center !important;
    gap: 14px !important;
}

.tito-avatar {
    width: 52px !important;
    height: 52px !important;
    border-radius: 50% !important;
    overflow: hidden !important;
    flex-shrink: 0 !important;
    box-shadow: 0 0 15px rgba(212,175,55,0.35) !important;
    border: 2px solid rgba(212,175,55,0.4) !important;
}

.tito-avatar img {
    width: 100% !important;
    height: 100% !important;
    object-fit: cover !important;
}

.tito-info h4 {
    font-family: 'Cinzel', serif !important;
    font-size: 16px !important;
    color: #fff !important;
    font-weight: 600 !important;
    margin: 0 0 3px 0 !important;
}

.tito-info p {
    font-size: 13px !important;
    color: var(--tito-blanco-suave) !important;
    margin: 0 !important;
    display: flex !important;
    align-items: center !important;
    gap: 6px !important;
}

.tito-status {
    display: inline-block !important;
    width: 8px !important;
    height: 8px !important;
    background: #4ade80 !important;
    border-radius: 50% !important;
    animation: titoStatusPulse 2s infinite !important;
}

@keyframes titoStatusPulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
}

.tito-close {
    margin-left: auto !important;
    background: none !important;
    border: none !important;
    color: var(--tito-blanco-suave) !important;
    font-size: 28px !important;
    cursor: pointer !important;
    padding: 0 !important;
    line-height: 1 !important;
    transition: color 0.2s !important;
}

.tito-close:hover {
    color: #fff !important;
}

.tito-messages {
    flex: 1 !important;
    overflow-y: auto !important;
    padding: 18px !important;
    padding-bottom: 10px !important;
    display: flex !important;
    flex-direction: column !important;
    gap: 14px !important;
    min-height: 0 !important; /* Importante para que flex funcione bien con scroll */
}

.tito-messages::-webkit-scrollbar {
    width: 5px !important;
}

.tito-messages::-webkit-scrollbar-thumb {
    background: rgba(212,175,55,0.3) !important;
    border-radius: 3px !important;
}

.tito-msg {
    max-width: 85% !important;
    padding: 13px 17px !important;
    border-radius: 18px !important;
    font-size: 15px !important;
    line-height: 1.55 !important;
    animation: titoMsgIn 0.3s ease !important;
}

@keyframes titoMsgIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
}

.tito-msg.bot {
    background: rgba(212,175,55,0.1) !important;
    border: 1px solid rgba(212,175,55,0.2) !important;
    color: var(--tito-blanco) !important;
    align-self: flex-start !important;
    border-bottom-left-radius: 5px !important;
    white-space: pre-line !important;
}

.tito-msg.bot strong {
    color: var(--tito-dorado-claro) !important;
    font-weight: 600 !important;
}

.tito-msg.bot p {
    margin: 0 0 10px 0 !important;
}

.tito-msg.bot p:last-child {
    margin-bottom: 0 !important;
}

.tito-msg.user {
    background: linear-gradient(135deg, var(--tito-dorado), var(--tito-dorado-oscuro)) !important;
    color: var(--tito-negro) !important;
    align-self: flex-end !important;
    border-bottom-right-radius: 5px !important;
}

.tito-msg.typing {
    display: flex !important;
    gap: 5px !important;
    padding: 16px 22px !important;
}

.tito-msg.typing span {
    width: 8px !important;
    height: 8px !important;
    background: var(--tito-dorado) !important;
    border-radius: 50% !important;
    animation: titoTyping 1.4s infinite !important;
}

.tito-msg.typing span:nth-child(2) { animation-delay: 0.2s !important; }
.tito-msg.typing span:nth-child(3) { animation-delay: 0.4s !important; }

@keyframes titoTyping {
    0%, 60%, 100% { opacity: 0.3; transform: translateY(0); }
    30% { opacity: 1; transform: translateY(-5px); }
}

.tito-galeria {
    display: flex !important;
    gap: 10px !important;
    overflow-x: auto !important;
    overflow-y: visible !important;
    padding: 8px 0 !important;
    margin-top: 8px !important;
    scroll-behavior: smooth !important;
    scrollbar-width: none !important;
    flex-shrink: 0 !important;
}

.tito-galeria::-webkit-scrollbar {
    display: none !important;
}

.tito-galeria-card {
    flex-shrink: 0 !important;
    width: 120px !important;
    background: rgba(0,0,0,0.5) !important;
    border: 1px solid rgba(212,175,55,0.3) !important;
    border-radius: 12px !important;
    overflow: hidden !important;
    cursor: pointer !important;
    transition: all 0.3s ease !important;
    text-decoration: none !important;
    display: block !important;
}

.tito-galeria-card:hover {
    border-color: var(--tito-dorado) !important;
    transform: translateY(-3px) !important;
    box-shadow: 0 8px 20px rgba(0,0,0,0.4), 0 0 15px rgba(212,175,55,0.2) !important;
}

.tito-galeria-card img {
    width: 120px !important;
    height: 90px !important;
    object-fit: cover !important;
    display: block !important;
    background: #222 !important;
}

.tito-galeria-info {
    padding: 8px !important;
}

.tito-galeria-nombre {
    font-family: 'Cinzel', serif !important;
    font-size: 11px !important;
    color: #fff !important;
    margin: 0 0 3px 0 !important;
    white-space: nowrap !important;
    overflow: hidden !important;
    text-overflow: ellipsis !important;
}

.tito-galeria-precio {
    font-size: 12px !important;
    color: var(--tito-dorado) !important;
    font-weight: 600 !important;
    margin: 0 !important;
}

.tito-galeria-btn {
    display: block !important;
    text-align: center !important;
    background: rgba(212,175,55,0.2) !important;
    color: var(--tito-dorado) !important;
    font-size: 10px !important;
    padding: 5px !important;
    margin-top: 5px !important;
    border-radius: 5px !important;
    transition: background 0.2s !important;
}

.tito-galeria-card:hover .tito-galeria-btn {
    background: rgba(212,175,55,0.35) !important;
}

.tito-galeria-hint {
    font-size: 11px !important;
    color: var(--tito-blanco-suave) !important;
    text-align: center !important;
    margin-top: 6px !important;
    opacity: 0.7 !important;
}

.tito-suggestions {
    padding: 8px 18px 5px !important;
    display: flex !important;
    flex-wrap: wrap !important;
    gap: 8px !important;
    background: rgba(10,12,16,0.95) !important;
    flex-shrink: 0 !important; /* No se achica */
}

.tito-suggestions.oculto {
    display: none !important;
}

.tito-suggestion {
    background: rgba(212,175,55,0.1) !important;
    border: 1px solid rgba(212,175,55,0.25) !important;
    border-radius: 20px !important;
    padding: 8px 14px !important;
    font-size: 13px !important;
    color: var(--tito-blanco) !important;
    cursor: pointer !important;
    transition: all 0.2s !important;
}

.tito-suggestion:hover {
    background: rgba(212,175,55,0.2) !important;
    border-color: var(--tito-dorado) !important;
}

.tito-input-container {
    padding: 14px 18px 18px !important;
    border-top: 1px solid rgba(212,175,55,0.2) !important;
    display: flex !important;
    gap: 10px !important;
    background: rgba(0,0,0,0.3) !important;
}

.tito-input {
    flex: 1 !important;
    background: rgba(255,255,255,0.06) !important;
    border: 1px solid rgba(212,175,55,0.3) !important;
    border-radius: 25px !important;
    padding: 13px 20px !important;
    font-family: 'Cormorant Garamond', serif !important;
    font-size: 16px !important;
    color: #fff !important;
    outline: none !important;
}

.tito-input::placeholder {
    color: var(--tito-blanco-suave) !important;
}

.tito-input:focus {
    border-color: var(--tito-dorado) !important;
}

.tito-send {
    width: 50px !important;
    height: 50px !important;
    background: linear-gradient(135deg, var(--tito-dorado), var(--tito-dorado-oscuro)) !important;
    border: none !important;
    border-radius: 50% !important;
    cursor: pointer !important;
    font-size: 20px !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    flex-shrink: 0 !important;
    transition: all 0.2s !important;
}

.tito-send:hover:not(:disabled) {
    transform: scale(1.05) !important;
    box-shadow: 0 5px 20px rgba(212,175,55,0.4) !important;
}

.tito-send:disabled {
    opacity: 0.5 !important;
    cursor: not-allowed !important;
}

.tito-footer {
    text-align: center !important;
    padding: 8px !important;
    font-size: 10px !important;
    color: rgba(255,255,255,0.25) !important;
}

@media (max-width: 500px) {
    .tito-widget {
        bottom: 15px !important;
        right: 15px !important;
    }

    .tito-toggle {
        width: 65px !important;
        height: 65px !important;
    }

    .tito-window {
        width: calc(100vw - 30px) !important;
        height: 70vh !important;
        right: -7px !important;
        bottom: 80px !important;
        max-height: 550px !important;
    }

    .tito-suggestion {
        padding: 6px 10px !important;
        font-size: 12px !important;
    }

    .tito-suggestions {
        padding: 6px 12px 4px !important;
    }

    .tito-burbuja {
        width: 280px !important;
        right: -7px !important;
        bottom: 80px !important;
    }

    .tito-galeria-card {
        width: 100px !important;
    }

    .tito-galeria-card img {
        width: 100px !important;
        height: 75px !important;
    }

    .tito-galeria-info {
        padding: 6px !important;
    }

    .tito-galeria-nombre {
        font-size: 10px !important;
    }

    .tito-galeria-precio {
        font-size: 11px !important;
    }
}
</style>

<div class="tito-widget" id="titoWidget">
    <div class="tito-burbuja" id="titoBurbuja">
        <button class="tito-burbuja-close" id="titoBurbujaClose">&times;</button>
        <div id="titoBurbujaGaleria" class="tito-burbuja-galeria" style="display:none;"></div>
        <p class="tito-burbuja-texto" id="titoBurbujaTexto"></p>
        <div class="tito-burbuja-botones" id="titoBurbujaBotones"></div>
    </div>

    <button class="tito-toggle" id="titoToggle">
        <img src="https://duendesuy.10web.cloud/wp-content/uploads/2025/12/gemini-image-2_que_tenga_un_pin_en_su_ropa_con_este_logo_en_negro_y_dorado_solo_el_circulo_que_-0_b02c570f-fd54-4b54-b306-3aa6a2b413b2-scaled.jpg" alt="Tito">
        <span class="tito-notif" id="titoNotif">1</span>
    </button>

    <div class="tito-window" id="titoWindow">
        <div class="tito-header">
            <div class="tito-avatar">
                <img src="https://duendesuy.10web.cloud/wp-content/uploads/2025/12/gemini-image-2_que_tenga_un_pin_en_su_ropa_con_este_logo_en_negro_y_dorado_solo_el_circulo_que_-0_b02c570f-fd54-4b54-b306-3aa6a2b413b2-scaled.jpg" alt="Tito">
            </div>
            <div class="tito-info">
                <h4>Tito</h4>
                <p><span class="tito-status"></span> Guardián Digital</p>
            </div>
            <button class="tito-close" id="titoClose">&times;</button>
        </div>

        <div class="tito-messages" id="titoMessages"></div>

        <div class="tito-suggestions" id="titoSuggestions">
            <button class="tito-suggestion" data-text="¿Qué guardián me corresponde?">¿Cuál es para mí? 🔮</button>
            <button class="tito-suggestion" data-text="¿Cómo es el proceso de compra?">¿Cómo compro? 🛒</button>
            <button class="tito-suggestion" data-text="Quiero saber el estado de mi pedido">Mi pedido 📦</button>
        </div>

        <div class="tito-input-container">
            <input type="text" class="tito-input" id="titoInput" placeholder="Escribí tu mensaje..." maxlength="500">
            <button class="tito-send" id="titoSend">➤</button>
        </div>

        <div class="tito-footer">✨ Magia ancestral desde Piriápolis</div>
    </div>
</div>

<script>
(function() {
    'use strict';

    const CONFIG = {
        API_BASE: 'https://duendes-vercel.vercel.app',
        TITO_AVATAR: 'https://duendesuy.10web.cloud/wp-content/uploads/2025/12/gemini-image-2_que_tenga_un_pin_en_su_ropa_con_este_logo_en_negro_y_dorado_solo_el_circulo_que_-0_b02c570f-fd54-4b54-b306-3aa6a2b413b2-scaled.jpg',
        TIEMPO_PRODUCTO: 12000,
        TIEMPO_TIENDA: 20000,
        TIEMPO_CARRITO: 8000,
        TIEMPO_CHECKOUT: 25000,
        TIEMPO_GENERAL: 30000,
        TIEMPO_ABANDONO: 60000,
        URL_CARRITO: '/carrito/',
        URL_CHECKOUT: '/caja/',
        URL_TIENDA: '/tienda/'
    };

    // Datos del usuario logueado (inyectados por PHP)
    const usuarioWP = window.titoUsuario || { logueado: false, nombre: '', email: '', esCliente: false };

    const estado = {
        chatAbierto: false,
        conversationHistory: [],
        isWaiting: false,
        visitorId: null,
        tiempoPagina: 0,
        ultimaActividad: Date.now(),
        burbujasMostradas: {},
        interactuoConTito: false,
        paginaActual: null,
        productoActual: null,
        carritoItems: [],
        carritoCount: 0,
        usuario: usuarioWP
    };

    let els = {};

    function initElements() {
        els = {
            widget: document.getElementById('titoWidget'),
            toggle: document.getElementById('titoToggle'),
            window: document.getElementById('titoWindow'),
            close: document.getElementById('titoClose'),
            messages: document.getElementById('titoMessages'),
            input: document.getElementById('titoInput'),
            send: document.getElementById('titoSend'),
            suggestions: document.getElementById('titoSuggestions'),
            notif: document.getElementById('titoNotif'),
            burbuja: document.getElementById('titoBurbuja'),
            burbujaTexto: document.getElementById('titoBurbujaTexto'),
            burbujaBotones: document.getElementById('titoBurbujaBotones'),
            burbujaGaleria: document.getElementById('titoBurbujaGaleria'),
            burbujaClose: document.getElementById('titoBurbujaClose')
        };
    }

    function getVisitorId() {
        let id = localStorage.getItem('tito_visitor_id');
        if (!id) {
            id = 'v_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('tito_visitor_id', id);
        }
        return id;
    }

    function detectarPagina() {
        const path = window.location.pathname;
        const body = document.body;
        if (body.classList.contains('single-product') || path.includes('/producto/') || path.includes('/product/')) return 'producto';
        if (path.includes('/carrito') || path.includes('/cart') || body.classList.contains('woocommerce-cart')) return 'carrito';
        if (path.includes('/caja') || path.includes('/checkout') || body.classList.contains('woocommerce-checkout')) return 'checkout';
        if (body.classList.contains('woocommerce-shop') || body.classList.contains('post-type-archive-product') || body.classList.contains('tax-product_cat') || path.includes('/tienda') || path.includes('/shop')) return 'tienda';
        return 'general';
    }

    function obtenerProductoActual() {
        if (estado.paginaActual !== 'producto') return null;
        const titulo = document.querySelector('.product_title, .entry-title, h1.elementor-heading-title');
        const precio = document.querySelector('.price .woocommerce-Price-amount, .price ins .amount');
        const imagen = document.querySelector('.woocommerce-product-gallery__image img, .wp-post-image');
        if (titulo) {
            return {
                nombre: titulo.textContent.trim(),
                precio: precio ? precio.textContent.trim() : null,
                imagen: imagen ? imagen.src : null,
                url: window.location.href
            };
        }
        return null;
    }

    function obtenerCarritoWoo() {
        const carritoCount = document.querySelector('.cart-contents-count, .cart-count, .wc-block-mini-cart__badge');
        if (carritoCount) estado.carritoCount = parseInt(carritoCount.textContent) || 0;
        return estado.carritoCount;
    }

    async function enviarMensaje(mensaje) {
        const contexto = {
            pagina: estado.paginaActual,
            producto: estado.productoActual,
            carrito: estado.carritoCount,
            tiempoEnPagina: estado.tiempoPagina,
            url: window.location.href
        };
        try {
            const response = await fetch(CONFIG.API_BASE + '/api/tito/v3', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: mensaje,
                    history: estado.conversationHistory.slice(-8),
                    contexto,
                    visitorId: estado.visitorId,
                    // Info del usuario logueado
                    usuario: estado.usuario.logueado ? {
                        nombre: estado.usuario.nombre,
                        email: estado.usuario.email,
                        esCliente: estado.usuario.esCliente,
                        totalCompras: estado.usuario.totalCompras
                    } : null
                })
            });
            return await response.json();
        } catch (error) {
            console.error('Error Tito:', error);
            return { success: false, response: 'Disculpá, tuve un problemita. ¿Podés intentar de nuevo?' };
        }
    }

    async function obtenerProductosRecomendados(params) {
        try {
            let url = CONFIG.API_BASE + '/api/tito/woo?accion=recomendaciones';
            if (params && params.intencion) url += '&intencion=' + encodeURIComponent(params.intencion);
            const response = await fetch(url);
            const data = await response.json();
            return data.success ? data.data : [];
        } catch (error) {
            return [];
        }
    }

    function formatearTexto(texto) {
        if (!texto) return '';
        // Convertir markdown básico a HTML
        return texto
            // Negritas **texto** o __texto__
            .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
            .replace(/__([^_]+)__/g, '<strong>$1</strong>')
            // Cursivas *texto* o _texto_
            .replace(/\*([^*]+)\*/g, '<em>$1</em>')
            .replace(/_([^_]+)_/g, '<em>$1</em>')
            // Saltos de línea dobles = párrafos
            .replace(/\n\n/g, '</p><p>')
            // Saltos de línea simples
            .replace(/\n/g, '<br>');
    }

    function scrollAlFinal() {
        if (els.messages) {
            els.messages.scrollTop = els.messages.scrollHeight + 500;
        }
    }

    function agregarMensaje(texto, tipo, productos) {
        const msg = document.createElement('div');
        msg.className = 'tito-msg ' + tipo;
        // Formatear texto solo para mensajes del bot
        if (tipo === 'bot') {
            msg.innerHTML = '<p>' + formatearTexto(texto) + '</p>';
        } else {
            msg.textContent = texto;
        }
        els.messages.appendChild(msg);
        scrollAlFinal();

        if (productos && productos.length > 0) {
            const galeria = crearGaleria(productos);
            els.messages.appendChild(galeria);

            // Scroll inmediato
            scrollAlFinal();

            // Scroll cuando cargan las imágenes
            const imagenes = galeria.querySelectorAll('img');
            imagenes.forEach(function(img) {
                img.onload = scrollAlFinal;
            });

            // Scroll adicional con timeouts
            setTimeout(scrollAlFinal, 100);
            setTimeout(scrollAlFinal, 300);
            setTimeout(scrollAlFinal, 500);
            setTimeout(scrollAlFinal, 1000);
            setTimeout(scrollAlFinal, 2000);
        } else {
            setTimeout(scrollAlFinal, 50);
        }
    }

    function crearGaleria(productos) {
        const container = document.createElement('div');
        container.className = 'tito-galeria';
        productos.forEach(function(p) {
            const imgSrc = p.imagen && p.imagen !== 'null' && p.imagen.startsWith('http') ? p.imagen : CONFIG.TITO_AVATAR;
            const card = document.createElement('a');
            card.className = 'tito-galeria-card';
            card.href = p.url || '#';
            card.target = '_blank';
            card.innerHTML = '<img src="' + imgSrc + '" alt="' + p.nombre + '" onerror="this.src=\'' + CONFIG.TITO_AVATAR + '\'">' +
                '<div class="tito-galeria-info">' +
                '<p class="tito-galeria-nombre">' + p.nombre + '</p>' +
                '<p class="tito-galeria-precio">$' + p.precio + ' USD</p>' +
                '<span class="tito-galeria-btn">Ver ✨</span>' +
                '</div>';
            container.appendChild(card);
        });
        return container;
    }

    function mostrarTyping() {
        const typing = document.createElement('div');
        typing.className = 'tito-msg bot typing';
        typing.id = 'titoTyping';
        typing.innerHTML = '<span></span><span></span><span></span>';
        els.messages.appendChild(typing);
        // Ocultar sugerencias mientras carga
        els.suggestions.classList.add('oculto');
        scrollAlFinal();
    }

    function ocultarTyping() {
        const typing = document.getElementById('titoTyping');
        if (typing) typing.remove();
        // Mostrar sugerencias de nuevo
        els.suggestions.classList.remove('oculto');
    }

    function mostrarBurbuja(config) {
        if (estado.chatAbierto || estado.interactuoConTito) return;
        if (els.burbuja.classList.contains('visible')) return;
        if (config.productos && config.productos.length > 0) {
            els.burbujaGaleria.innerHTML = '';
            config.productos.slice(0, 3).forEach(function(p) {
                const item = document.createElement('div');
                item.className = 'tito-burbuja-producto';
                item.innerHTML = '<img src="' + (p.imagen || CONFIG.TITO_AVATAR) + '" alt="' + p.nombre + '" onerror="this.src=\'' + CONFIG.TITO_AVATAR + '\'">' +
                    '<div class="tito-burbuja-producto-nombre">' + p.nombre + '</div>';
                item.onclick = function() { window.open(p.url, '_blank'); };
                els.burbujaGaleria.appendChild(item);
            });
            els.burbujaGaleria.style.display = 'flex';
        } else {
            els.burbujaGaleria.style.display = 'none';
        }
        els.burbujaTexto.innerHTML = config.texto;
        els.burbujaBotones.innerHTML = '';
        config.botones.forEach(function(btn) {
            const boton = document.createElement('button');
            boton.className = 'tito-burbuja-btn' + (btn.primary ? ' primary' : '');
            boton.textContent = btn.texto;
            boton.onclick = function() {
                ocultarBurbuja();
                if (btn.accion === 'chat') {
                    abrirChat();
                    if (btn.mensaje) {
                        setTimeout(function() {
                            els.input.value = btn.mensaje;
                            procesarEnvio();
                        }, 300);
                    }
                } else if (btn.accion === 'url') {
                    window.location.href = btn.url;
                }
            };
            els.burbujaBotones.appendChild(boton);
        });
        els.burbuja.classList.add('visible');
        setTimeout(ocultarBurbuja, 20000);
    }

    function ocultarBurbuja() {
        els.burbuja.classList.remove('visible');
    }

    const BURBUJAS = {
        producto: [
            { delay: 12000, config: function() { return { texto: '✨ Este guardián es <strong>único en el mundo</strong>... cuando se va, desaparece para siempre.', botones: [{ texto: '💜 Contame más', primary: true, accion: 'chat' }, { texto: 'Sigo mirando', accion: 'cerrar' }] }; } },
            { delay: 35000, config: function() { return { texto: '🔮 ¿Sabías que cada duende tiene su propia historia y personalidad? Si sentiste algo al verlo, <strong>no es casualidad</strong>.', botones: [{ texto: '¿Cuál es su historia?', primary: true, accion: 'chat', mensaje: '¿Cuál es la historia de este guardián?' }, { texto: 'Después', accion: 'cerrar' }] }; } },
            { delay: 70000, config: function() { return { texto: '💫 ¿Tenés alguna duda sobre este guardián? Puedo contarte su historia, sus dones, o cómo cuidarlo...', botones: [{ texto: 'Contame más', primary: true, accion: 'chat', mensaje: 'Contame más sobre este guardián' }, { texto: 'No, gracias', accion: 'cerrar' }] }; } }
        ],
        tienda: [
            { delay: 20000, config: async function() { const productos = await obtenerProductosRecomendados({}); return { texto: '🔮 ¿Buscás algo específico? Puedo ayudarte a encontrar el guardián <strong>perfecto para vos</strong>.', productos: productos.slice(0, 3), botones: [{ texto: 'Sí, ayudame', primary: true, accion: 'chat' }, { texto: 'Solo miro', accion: 'cerrar' }] }; } },
            { delay: 50000, config: function() { return { texto: '✨ ¿Protección, abundancia, amor o sanación? Cada guardián tiene un propósito especial...', botones: [{ texto: '🛡️ Protección', accion: 'chat', mensaje: 'Busco un guardián de protección' }, { texto: '💰 Abundancia', accion: 'chat', mensaje: 'Busco un guardián de abundancia' }, { texto: '💜 Amor', accion: 'chat', mensaje: 'Busco un guardián de amor' }] }; } }
        ],
        carrito: [
            { delay: 8000, config: function() { return { texto: '🍀 ¡Excelente elección! Tus guardianes ya están ansiosos por conocerte...', botones: [{ texto: '🛒 Completar compra', primary: true, accion: 'url', url: CONFIG.URL_CHECKOUT }, { texto: 'Tengo dudas', accion: 'chat' }] }; } },
            { delay: 40000, config: function() { return { texto: '⚡ Recordá: son piezas <strong>únicas</strong>. Si alguien más las adopta mientras tanto, desaparecen para siempre...', botones: [{ texto: 'Voy a pagar', primary: true, accion: 'url', url: CONFIG.URL_CHECKOUT }, { texto: 'Tengo una duda', accion: 'chat', mensaje: 'Tengo una duda sobre la compra' }] }; } }
        ],
        checkout: [
            { delay: 25000, config: function() { return { texto: '📝 ¿Todo bien con el formulario? Estoy acá si necesitás ayuda.', botones: [{ texto: 'Tengo una duda', primary: true, accion: 'chat' }, { texto: 'Todo bien', accion: 'cerrar' }] }; } }
        ],
        general: [
            { delay: 30000, config: function() { return { texto: '✨ ¡Hola! Soy Tito, el guardián digital. Si llegaste hasta acá, <strong>no es casualidad</strong>...', botones: [{ texto: 'Contame más', primary: true, accion: 'chat' }, { texto: 'Ver tienda', accion: 'url', url: CONFIG.URL_TIENDA }] }; } }
        ]
    };

    function iniciarBurbujas() {
        const burbujas = BURBUJAS[estado.paginaActual] || BURBUJAS.general;
        burbujas.forEach(function(burbuja, index) {
            const key = estado.paginaActual + '_' + index;
            if (estado.burbujasMostradas[key]) return;
            setTimeout(async function() {
                if (estado.chatAbierto || estado.interactuoConTito) return;
                if (estado.burbujasMostradas[key]) return;
                estado.burbujasMostradas[key] = true;
                const config = typeof burbuja.config === 'function' ? await burbuja.config() : burbuja.config;
                mostrarBurbuja(config);
            }, burbuja.delay);
        });
    }

    function iniciarDeteccionAbandono() {
        let abandonoTimeout = null;
        function resetearAbandono() {
            estado.ultimaActividad = Date.now();
            if (abandonoTimeout) clearTimeout(abandonoTimeout);
            abandonoTimeout = setTimeout(function() {
                if (estado.carritoCount > 0 && !estado.chatAbierto && !estado.interactuoConTito) {
                    mostrarBurbuja({
                        texto: '💭 ¿Te fuiste? Tus guardianes siguen esperándote... No dejes que otro los adopte 🍀',
                        botones: [
                            { texto: 'Ver mi carrito', primary: true, accion: 'url', url: CONFIG.URL_CARRITO },
                            { texto: 'Tengo dudas', accion: 'chat' }
                        ]
                    });
                }
            }, CONFIG.TIEMPO_ABANDONO);
        }
        ['mousemove', 'keydown', 'scroll', 'click', 'touchstart'].forEach(function(event) {
            document.addEventListener(event, resetearAbandono, { passive: true });
        });
        resetearAbandono();
    }

    function abrirChat() {
        estado.chatAbierto = true;
        els.window.classList.add('visible');
        ocultarBurbuja();
        els.notif.style.display = 'none';
        els.input.focus();
        if (estado.conversationHistory.length === 0) {
            let saludo;
            const nombre = estado.usuario.nombre;
            const esCliente = estado.usuario.esCliente;

            if (estado.paginaActual === 'producto' && estado.productoActual) {
                // En página de producto
                saludo = nombre
                    ? '¡Hola ' + nombre + '! 🍀 Veo que estás mirando a <strong>' + estado.productoActual.nombre + '</strong>... ¿Querés que te cuente sobre este guardián?'
                    : '¡Hola! Veo que estás mirando a <strong>' + estado.productoActual.nombre + '</strong>... ¿Querés que te cuente sobre este guardián? 🍀';
            } else if (esCliente && nombre) {
                // Cliente que ya compró
                saludo = '¡' + nombre + '! 🍀 Qué lindo verte de nuevo por el bosque. ¿Cómo están tus guardianes? ¿En qué puedo ayudarte?';
            } else if (nombre) {
                // Usuario logueado pero no cliente
                saludo = '¡Hola ' + nombre + '! Soy Tito, el guardián digital 🍀 ¿Qué andás buscando hoy?';
            } else {
                // Usuario no logueado
                saludo = '¡Hola! Soy Tito, el guardián digital de Duendes del Uruguay. ¿En qué puedo ayudarte hoy? ✨';
            }

            agregarMensaje(saludo, 'bot');
            // Guardar saludo en historial para que el backend sepa que no es primera interacción
            estado.conversationHistory.push({ role: 'assistant', content: saludo });
        }
    }

    function cerrarChat() {
        estado.chatAbierto = false;
        els.window.classList.remove('visible');
    }

    async function procesarEnvio() {
        const mensaje = els.input.value.trim();
        if (!mensaje || estado.isWaiting) return;
        estado.interactuoConTito = true;
        estado.isWaiting = true;
        els.send.disabled = true;
        els.input.value = '';
        els.suggestions.style.display = 'none';
        agregarMensaje(mensaje, 'user');
        estado.conversationHistory.push({ role: 'user', content: mensaje });
        mostrarTyping();
        const response = await enviarMensaje(mensaje);
        ocultarTyping();
        if (response.success) {
            agregarMensaje(response.respuesta, 'bot', response.productos);
            estado.conversationHistory.push({ role: 'assistant', content: response.respuesta });
        } else {
            agregarMensaje(response.respuesta || 'Disculpá, tuve un problemita. ¿Podés intentar de nuevo?', 'bot');
        }
        estado.isWaiting = false;
        els.send.disabled = false;
    }

    function initEventListeners() {
        els.toggle.onclick = function() {
            if (estado.chatAbierto) cerrarChat();
            else abrirChat();
        };
        els.close.onclick = cerrarChat;
        els.burbujaClose.onclick = ocultarBurbuja;
        els.send.onclick = procesarEnvio;
        els.input.onkeypress = function(e) {
            if (e.key === 'Enter') procesarEnvio();
        };
        document.querySelectorAll('.tito-suggestion').forEach(function(btn) {
            btn.onclick = function() {
                els.input.value = btn.dataset.text;
                procesarEnvio();
            };
        });
        document.addEventListener('click', function(e) {
            if (estado.chatAbierto && !els.widget.contains(e.target)) cerrarChat();
        });
    }

    function syncWooCommerce() {
        if (typeof jQuery !== 'undefined') {
            jQuery(document.body).on('added_to_cart', function() {
                estado.carritoCount++;
                els.notif.textContent = '1';
                els.notif.style.display = 'flex';
                setTimeout(function() {
                    if (!estado.chatAbierto) {
                        mostrarBurbuja({
                            texto: '🎉 ¡Guardián agregado al carrito! ¿Querés completar la adopción?',
                            botones: [
                                { texto: 'Ir al carrito', primary: true, accion: 'url', url: CONFIG.URL_CARRITO },
                                { texto: 'Seguir mirando', accion: 'cerrar' }
                            ]
                        });
                    }
                }, 500);
            });
            jQuery(document.body).on('removed_from_cart', function() {
                estado.carritoCount = Math.max(0, estado.carritoCount - 1);
            });
        }
        obtenerCarritoWoo();
    }

    function iniciarContadorTiempo() {
        setInterval(function() { estado.tiempoPagina++; }, 1000);
    }

    function init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
            return;
        }
        console.log('🍀 Tito Widget v4.0 iniciando...');
        initElements();
        estado.visitorId = getVisitorId();
        estado.paginaActual = detectarPagina();
        estado.productoActual = obtenerProductoActual();
        console.log('🍀 Página detectada:', estado.paginaActual);
        initEventListeners();
        syncWooCommerce();
        iniciarContadorTiempo();
        iniciarBurbujas();
        iniciarDeteccionAbandono();
        console.log('🍀 Tito listo!');
    }

    init();
})();
</script>
    <?php
}
