/**
 * Tito Widget - Widget flotante para integrar Tito en cualquier sitio web
 * Duendes del Uruguay
 *
 * USO EN WORDPRESS:
 * Agregar este script en el footer o header:
 * <script src="https://tu-dominio-vercel.app/tito-widget.js" data-api="https://tu-dominio-vercel.app"></script>
 */

(function() {
  'use strict';

  // Configuración
  const CONFIG = {
    apiUrl: document.currentScript?.getAttribute('data-api') || 'https://duendes-canalizacion.vercel.app',
    position: document.currentScript?.getAttribute('data-position') || 'right', // 'left' o 'right'
    theme: document.currentScript?.getAttribute('data-theme') || 'dark',
    welcomeMessage: '¡Hola! Soy Tito, el Elfo Guardián del Portal. ¿En qué puedo ayudarte hoy?',
    placeholder: 'Escribí tu mensaje...',
    titoImage: 'https://duendesuy.10web.cloud/wp-content/uploads/2025/12/gemini-image-2_que_tenga_un_pin_en_su_ropa_con_este_logo_en_negro_y_dorado_solo_el_circulo_que_-0_b02c570f-fd54-4b54-b306-3aa6a2b413b2-scaled.jpg'
  };

  // Estilos
  const STYLES = `
    @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600&family=Lora:wght@400;500&display=swap');

    #tito-widget-container * {
      box-sizing: border-box;
      font-family: 'Lora', serif;
    }

    #tito-float-button {
      position: fixed;
      bottom: 20px;
      ${CONFIG.position}: 20px;
      width: 65px;
      height: 65px;
      border-radius: 50%;
      background: linear-gradient(135deg, #C6A962, #8B7355);
      border: 3px solid #C6A962;
      cursor: pointer;
      box-shadow: 0 4px 20px rgba(198, 169, 98, 0.4);
      z-index: 999998;
      overflow: hidden;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    #tito-float-button:hover {
      transform: scale(1.1);
      box-shadow: 0 6px 30px rgba(198, 169, 98, 0.6);
    }

    #tito-float-button img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 50%;
    }

    #tito-float-button .tito-notification {
      position: absolute;
      top: -5px;
      right: -5px;
      width: 20px;
      height: 20px;
      background: #FF6B6B;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 12px;
      font-weight: bold;
      animation: pulse 2s infinite;
    }

    @keyframes pulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.2); }
    }

    #tito-chat-modal {
      position: fixed;
      bottom: 100px;
      ${CONFIG.position}: 20px;
      width: 380px;
      max-width: calc(100vw - 40px);
      height: 550px;
      max-height: calc(100vh - 140px);
      background: #0a0a0a;
      border-radius: 16px;
      border: 1px solid #C6A962;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
      z-index: 999999;
      display: none;
      flex-direction: column;
      overflow: hidden;
    }

    #tito-chat-modal.open {
      display: flex;
      animation: slideIn 0.3s ease;
    }

    @keyframes slideIn {
      from {
        opacity: 0;
        transform: translateY(20px) scale(0.95);
      }
      to {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }

    #tito-chat-header {
      background: linear-gradient(135deg, #1a1a1a, #0a0a0a);
      padding: 15px;
      display: flex;
      align-items: center;
      gap: 12px;
      border-bottom: 1px solid #333;
    }

    #tito-chat-header img {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      border: 2px solid #C6A962;
    }

    #tito-chat-header-info {
      flex: 1;
    }

    #tito-chat-header-info h3 {
      margin: 0;
      color: #C6A962;
      font-family: 'Cinzel', serif;
      font-size: 16px;
      font-weight: 600;
    }

    #tito-chat-header-info p {
      margin: 2px 0 0;
      color: #888;
      font-size: 12px;
    }

    #tito-chat-close {
      background: none;
      border: none;
      color: #666;
      font-size: 24px;
      cursor: pointer;
      padding: 5px;
      line-height: 1;
      transition: color 0.2s;
    }

    #tito-chat-close:hover {
      color: #C6A962;
    }

    #tito-chat-messages {
      flex: 1;
      overflow-y: auto;
      padding: 15px;
      display: flex;
      flex-direction: column;
      gap: 12px;
      background: #0a0a0a;
    }

    #tito-chat-messages::-webkit-scrollbar {
      width: 6px;
    }

    #tito-chat-messages::-webkit-scrollbar-track {
      background: #1a1a1a;
    }

    #tito-chat-messages::-webkit-scrollbar-thumb {
      background: #C6A962;
      border-radius: 3px;
    }

    .tito-message {
      max-width: 85%;
      padding: 12px 16px;
      border-radius: 16px;
      font-size: 14px;
      line-height: 1.5;
      animation: fadeIn 0.3s ease;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .tito-message.tito {
      background: linear-gradient(135deg, #1B4D3E, #0d2920);
      color: #e0e0e0;
      border-bottom-left-radius: 4px;
      align-self: flex-start;
      border: 1px solid #2a5a4a;
    }

    .tito-message.user {
      background: linear-gradient(135deg, #C6A962, #8B7355);
      color: #0a0a0a;
      border-bottom-right-radius: 4px;
      align-self: flex-end;
    }

    .tito-message.typing {
      background: #1a1a1a;
      color: #888;
    }

    .tito-typing-dots {
      display: flex;
      gap: 4px;
    }

    .tito-typing-dots span {
      width: 8px;
      height: 8px;
      background: #C6A962;
      border-radius: 50%;
      animation: typingDot 1.4s infinite ease-in-out;
    }

    .tito-typing-dots span:nth-child(1) { animation-delay: 0s; }
    .tito-typing-dots span:nth-child(2) { animation-delay: 0.2s; }
    .tito-typing-dots span:nth-child(3) { animation-delay: 0.4s; }

    @keyframes typingDot {
      0%, 80%, 100% { transform: scale(0.7); opacity: 0.5; }
      40% { transform: scale(1); opacity: 1; }
    }

    #tito-chat-input-container {
      padding: 15px;
      background: #1a1a1a;
      border-top: 1px solid #333;
      display: flex;
      gap: 10px;
    }

    #tito-chat-input {
      flex: 1;
      background: #0a0a0a;
      border: 1px solid #333;
      border-radius: 25px;
      padding: 12px 20px;
      color: #e0e0e0;
      font-size: 14px;
      outline: none;
      transition: border-color 0.2s;
    }

    #tito-chat-input:focus {
      border-color: #C6A962;
    }

    #tito-chat-input::placeholder {
      color: #666;
    }

    #tito-chat-send {
      background: linear-gradient(135deg, #C6A962, #8B7355);
      border: none;
      border-radius: 50%;
      width: 45px;
      height: 45px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s;
    }

    #tito-chat-send:hover {
      transform: scale(1.1);
    }

    #tito-chat-send:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      transform: none;
    }

    #tito-chat-send svg {
      width: 20px;
      height: 20px;
      fill: #0a0a0a;
    }

    .tito-quick-actions {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      padding: 10px 15px;
      background: #141414;
      border-top: 1px solid #222;
    }

    .tito-quick-action {
      background: #1a1a1a;
      border: 1px solid #333;
      border-radius: 20px;
      padding: 8px 14px;
      color: #C6A962;
      font-size: 12px;
      cursor: pointer;
      transition: all 0.2s;
    }

    .tito-quick-action:hover {
      background: #C6A962;
      color: #0a0a0a;
    }

    /* Mobile responsiveness */
    @media (max-width: 480px) {
      #tito-chat-modal {
        bottom: 0;
        ${CONFIG.position}: 0;
        width: 100%;
        max-width: 100%;
        height: 100%;
        max-height: 100%;
        border-radius: 0;
      }

      #tito-float-button {
        bottom: 15px;
        ${CONFIG.position}: 15px;
        width: 55px;
        height: 55px;
      }
    }
  `;

  // HTML del widget
  const WIDGET_HTML = `
    <button id="tito-float-button" aria-label="Chatear con Tito">
      <img src="${CONFIG.titoImage}" alt="Tito" onerror="this.style.display='none'; this.parentElement.innerHTML='🧙';">
      <span class="tito-notification" style="display:none;">1</span>
    </button>

    <div id="tito-chat-modal">
      <div id="tito-chat-header">
        <img src="${CONFIG.titoImage}" alt="Tito" onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🧙</text></svg>';">
        <div id="tito-chat-header-info">
          <h3>Tito</h3>
          <p>Elfo Guardián del Portal</p>
        </div>
        <button id="tito-chat-close" aria-label="Cerrar chat">&times;</button>
      </div>

      <div id="tito-chat-messages"></div>

      <div class="tito-quick-actions">
        <button class="tito-quick-action" data-msg="¿Qué es un duende guardián?">Duendes</button>
        <button class="tito-quick-action" data-msg="¿Cómo elijo mi guardián?">Elegir guardián</button>
        <button class="tito-quick-action" data-msg="¿Qué es el Círculo?">El Círculo</button>
        <button class="tito-quick-action" data-msg="Necesito protección">Protección</button>
      </div>

      <div id="tito-chat-input-container">
        <input type="text" id="tito-chat-input" placeholder="${CONFIG.placeholder}" autocomplete="off">
        <button id="tito-chat-send" aria-label="Enviar mensaje">
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
          </svg>
        </button>
      </div>
    </div>
  `;

  // Estado
  let chatHistory = [];
  let isOpen = false;
  let isLoading = false;

  // Crear contenedor
  function createWidget() {
    // Agregar estilos
    const styleEl = document.createElement('style');
    styleEl.textContent = STYLES;
    document.head.appendChild(styleEl);

    // Crear contenedor
    const container = document.createElement('div');
    container.id = 'tito-widget-container';
    container.innerHTML = WIDGET_HTML;
    document.body.appendChild(container);

    // Agregar event listeners
    setupEventListeners();

    // Mostrar mensaje de bienvenida
    setTimeout(() => {
      addMessage(CONFIG.welcomeMessage, 'tito');
    }, 500);

    console.log('🧙 Tito Widget cargado correctamente');
  }

  // Configurar event listeners
  function setupEventListeners() {
    const floatBtn = document.getElementById('tito-float-button');
    const closeBtn = document.getElementById('tito-chat-close');
    const input = document.getElementById('tito-chat-input');
    const sendBtn = document.getElementById('tito-chat-send');
    const quickActions = document.querySelectorAll('.tito-quick-action');
    const modal = document.getElementById('tito-chat-modal');

    floatBtn.addEventListener('click', toggleChat);
    closeBtn.addEventListener('click', toggleChat);
    sendBtn.addEventListener('click', sendMessage);

    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    });

    quickActions.forEach(btn => {
      btn.addEventListener('click', () => {
        const msg = btn.getAttribute('data-msg');
        input.value = msg;
        sendMessage();
      });
    });

    // Cerrar al hacer clic fuera
    document.addEventListener('click', (e) => {
      if (isOpen && !modal.contains(e.target) && !floatBtn.contains(e.target)) {
        toggleChat();
      }
    });
  }

  // Toggle chat
  function toggleChat() {
    const modal = document.getElementById('tito-chat-modal');
    const notification = document.querySelector('.tito-notification');

    isOpen = !isOpen;
    modal.classList.toggle('open', isOpen);

    if (isOpen) {
      notification.style.display = 'none';
      document.getElementById('tito-chat-input').focus();
    }
  }

  // Agregar mensaje
  function addMessage(text, sender) {
    const messagesContainer = document.getElementById('tito-chat-messages');
    const messageEl = document.createElement('div');
    messageEl.className = `tito-message ${sender}`;
    messageEl.textContent = text;
    messagesContainer.appendChild(messageEl);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    if (sender === 'tito') {
      chatHistory.push({ role: 'assistant', content: text });
    } else {
      chatHistory.push({ role: 'user', content: text });
    }
  }

  // Mostrar typing indicator
  function showTyping() {
    const messagesContainer = document.getElementById('tito-chat-messages');
    const typingEl = document.createElement('div');
    typingEl.className = 'tito-message tito typing';
    typingEl.id = 'tito-typing';
    typingEl.innerHTML = '<div class="tito-typing-dots"><span></span><span></span><span></span></div>';
    messagesContainer.appendChild(typingEl);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  // Ocultar typing indicator
  function hideTyping() {
    const typingEl = document.getElementById('tito-typing');
    if (typingEl) typingEl.remove();
  }

  // Enviar mensaje
  async function sendMessage() {
    const input = document.getElementById('tito-chat-input');
    const sendBtn = document.getElementById('tito-chat-send');
    const message = input.value.trim();

    if (!message || isLoading) return;

    // Agregar mensaje del usuario
    addMessage(message, 'user');
    input.value = '';

    // Mostrar loading
    isLoading = true;
    sendBtn.disabled = true;
    showTyping();

    try {
      const response = await fetch(`${CONFIG.apiUrl}/api/tito/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mensaje: message,
          historial: chatHistory.slice(-10), // Últimos 10 mensajes para contexto
          modo: 'publico',
          origen: 'widget-wordpress'
        })
      });

      const data = await response.json();
      hideTyping();

      if (data.success && data.respuesta) {
        addMessage(data.respuesta, 'tito');
      } else {
        addMessage('Mmm, parece que algo no salió bien. ¿Podés intentar de nuevo?', 'tito');
      }
    } catch (error) {
      console.error('Error enviando mensaje a Tito:', error);
      hideTyping();
      addMessage('Ups, parece que perdí la conexión con el portal. Intentá de nuevo en unos segundos.', 'tito');
    } finally {
      isLoading = false;
      sendBtn.disabled = false;
    }
  }

  // Inicializar cuando el DOM esté listo
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createWidget);
  } else {
    createWidget();
  }
})();
