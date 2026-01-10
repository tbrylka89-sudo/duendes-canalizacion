/**
 * ═══════════════════════════════════════════════════════════════════
 * TITO MAESTRO - ASISTENTE OMNIPOTENTE
 * Widget completo para WordPress
 *
 * Uso en WordPress:
 * <div id="tito-maestro-container"></div>
 * <script src="https://tu-dominio.vercel.app/tito-maestro.js"
 *         data-api="https://tu-dominio.vercel.app"
 *         data-mode="full"></script>
 *
 * Modos:
 * - full: Pagina completa
 * - sidebar: Panel lateral
 * - floating: Boton flotante con modal
 * ═══════════════════════════════════════════════════════════════════
 */

(function() {
  'use strict';

  // Configuracion
  const script = document.currentScript;
  const API_BASE = script?.getAttribute('data-api') || 'https://duendes-canalizacion.vercel.app';
  const MODE = script?.getAttribute('data-mode') || 'full';
  const TITO_IMG = 'https://duendesuy.10web.cloud/wp-content/uploads/2025/12/gemini-image-2_que_tenga_un_pin_en_su_ropa_con_este_logo_en_negro_y_dorado_solo_el_circulo_que_-0_b02c570f-fd54-4b54-b306-3aa6a2b413b2-scaled.jpg';

  // Estado
  let mensajes = [];
  let cargando = false;
  let historial = [];

  // Estilos
  const styles = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

    #tito-maestro-container * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    }

    .tito-maestro {
      background: linear-gradient(135deg, #0a0a0a 0%, #141414 100%);
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }

    /* Header */
    .tito-header {
      background: #0f0f0f;
      border-bottom: 1px solid #2a2a2a;
      padding: 20px 30px;
      display: flex;
      align-items: center;
      gap: 20px;
    }

    .tito-avatar {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      border: 3px solid #C6A962;
      object-fit: cover;
    }

    .tito-header-info h1 {
      color: #C6A962;
      font-size: 24px;
      font-weight: 700;
      margin-bottom: 4px;
    }

    .tito-header-info p {
      color: #888;
      font-size: 14px;
    }

    .tito-status {
      margin-left: auto;
      display: flex;
      align-items: center;
      gap: 8px;
      color: #4CAF50;
      font-size: 13px;
    }

    .tito-status-dot {
      width: 8px;
      height: 8px;
      background: #4CAF50;
      border-radius: 50%;
      animation: pulse 2s infinite;
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }

    /* Main container */
    .tito-main {
      flex: 1;
      display: flex;
      max-width: 1400px;
      margin: 0 auto;
      width: 100%;
      padding: 20px;
      gap: 20px;
    }

    /* Chat area */
    .tito-chat {
      flex: 1;
      display: flex;
      flex-direction: column;
      background: #141414;
      border-radius: 16px;
      border: 1px solid #2a2a2a;
      overflow: hidden;
    }

    .tito-messages {
      flex: 1;
      overflow-y: auto;
      padding: 20px;
      display: flex;
      flex-direction: column;
      gap: 16px;
      min-height: 400px;
    }

    .tito-message {
      max-width: 85%;
      padding: 14px 18px;
      border-radius: 16px;
      line-height: 1.6;
      font-size: 14px;
    }

    .tito-message.user {
      align-self: flex-end;
      background: linear-gradient(135deg, rgba(198,169,98,0.2) 0%, rgba(198,169,98,0.1) 100%);
      color: #fff;
      border-bottom-right-radius: 4px;
    }

    .tito-message.assistant {
      align-self: flex-start;
      background: #1f1f1f;
      color: #ccc;
      border-bottom-left-radius: 4px;
    }

    .tito-message.assistant strong {
      color: #C6A962;
    }

    .tito-message.assistant h2,
    .tito-message.assistant h3 {
      color: #C6A962;
      margin: 16px 0 8px;
      font-size: 16px;
    }

    .tito-message.assistant h2:first-child,
    .tito-message.assistant h3:first-child {
      margin-top: 0;
    }

    .tito-message.assistant ul,
    .tito-message.assistant ol {
      margin-left: 20px;
      margin-top: 8px;
    }

    .tito-message.assistant li {
      margin-bottom: 4px;
    }

    .tito-message.assistant code {
      background: #0a0a0a;
      padding: 2px 6px;
      border-radius: 4px;
      font-family: monospace;
      font-size: 13px;
    }

    .tito-message.assistant pre {
      background: #0a0a0a;
      padding: 12px;
      border-radius: 8px;
      overflow-x: auto;
      margin: 12px 0;
    }

    .tito-message.assistant hr {
      border: none;
      border-top: 1px solid #333;
      margin: 16px 0;
    }

    .tito-welcome {
      text-align: center;
      padding: 60px 20px;
      color: #888;
    }

    .tito-welcome-icon {
      font-size: 64px;
      margin-bottom: 20px;
    }

    .tito-welcome h2 {
      color: #C6A962;
      margin-bottom: 12px;
    }

    .tito-welcome p {
      max-width: 400px;
      margin: 0 auto 30px;
      line-height: 1.6;
    }

    .tito-typing {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 14px 18px;
      background: #1f1f1f;
      border-radius: 16px;
      border-bottom-left-radius: 4px;
      color: #888;
      align-self: flex-start;
    }

    .tito-typing-dots {
      display: flex;
      gap: 4px;
    }

    .tito-typing-dots span {
      width: 6px;
      height: 6px;
      background: #C6A962;
      border-radius: 50%;
      animation: typingDot 1.4s infinite;
    }

    .tito-typing-dots span:nth-child(2) { animation-delay: 0.2s; }
    .tito-typing-dots span:nth-child(3) { animation-delay: 0.4s; }

    @keyframes typingDot {
      0%, 100% { opacity: 0.4; transform: translateY(0); }
      50% { opacity: 1; transform: translateY(-4px); }
    }

    /* Input area */
    .tito-input-area {
      padding: 20px;
      border-top: 1px solid #2a2a2a;
      background: #0f0f0f;
    }

    .tito-input-wrapper {
      display: flex;
      gap: 12px;
    }

    .tito-input {
      flex: 1;
      padding: 14px 18px;
      background: #1a1a1a;
      border: 1px solid #2a2a2a;
      border-radius: 12px;
      color: #fff;
      font-size: 15px;
      outline: none;
      transition: border-color 0.2s;
    }

    .tito-input:focus {
      border-color: #C6A962;
    }

    .tito-input::placeholder {
      color: #666;
    }

    .tito-send {
      padding: 14px 24px;
      background: linear-gradient(135deg, #C6A962 0%, #D4BC7D 100%);
      border: none;
      border-radius: 12px;
      color: #0a0a0a;
      font-size: 15px;
      font-weight: 600;
      cursor: pointer;
      transition: transform 0.2s, opacity 0.2s;
    }

    .tito-send:hover {
      transform: scale(1.02);
    }

    .tito-send:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    /* Sidebar */
    .tito-sidebar {
      width: 320px;
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .tito-card {
      background: #141414;
      border: 1px solid #2a2a2a;
      border-radius: 12px;
      padding: 20px;
    }

    .tito-card h3 {
      color: #C6A962;
      font-size: 14px;
      font-weight: 600;
      margin-bottom: 16px;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    /* Quick actions */
    .tito-quick-actions {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .tito-quick-btn {
      padding: 12px 16px;
      background: #1f1f1f;
      border: 1px solid #2a2a2a;
      border-radius: 8px;
      color: #ccc;
      font-size: 13px;
      text-align: left;
      cursor: pointer;
      transition: all 0.2s;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .tito-quick-btn:hover {
      background: #2a2a2a;
      border-color: #C6A962;
      color: #fff;
    }

    .tito-quick-btn span {
      font-size: 16px;
    }

    /* Suggestions */
    .tito-suggestions {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      padding: 10px 20px 0;
    }

    .tito-suggestion {
      padding: 8px 14px;
      background: #1f1f1f;
      border: 1px solid #2a2a2a;
      border-radius: 20px;
      color: #aaa;
      font-size: 12px;
      cursor: pointer;
      transition: all 0.2s;
    }

    .tito-suggestion:hover {
      background: #2a2a2a;
      border-color: #C6A962;
      color: #C6A962;
    }

    /* Stats mini */
    .tito-stats-mini {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;
    }

    .tito-stat-item {
      background: #1f1f1f;
      padding: 12px;
      border-radius: 8px;
      text-align: center;
    }

    .tito-stat-value {
      color: #fff;
      font-size: 20px;
      font-weight: 700;
    }

    .tito-stat-label {
      color: #888;
      font-size: 11px;
      margin-top: 4px;
    }

    /* Scrollbar */
    .tito-messages::-webkit-scrollbar {
      width: 6px;
    }

    .tito-messages::-webkit-scrollbar-track {
      background: #1a1a1a;
    }

    .tito-messages::-webkit-scrollbar-thumb {
      background: #333;
      border-radius: 3px;
    }

    /* Responsive */
    @media (max-width: 1024px) {
      .tito-sidebar {
        display: none;
      }
    }

    @media (max-width: 768px) {
      .tito-main {
        padding: 10px;
      }

      .tito-header {
        padding: 15px 20px;
      }

      .tito-avatar {
        width: 50px;
        height: 50px;
      }

      .tito-header-info h1 {
        font-size: 20px;
      }
    }

    /* Floating mode */
    .tito-floating-btn {
      position: fixed;
      bottom: 24px;
      right: 24px;
      width: 64px;
      height: 64px;
      border-radius: 50%;
      border: 3px solid #C6A962;
      background: #141414;
      cursor: pointer;
      box-shadow: 0 4px 20px rgba(0,0,0,0.5);
      overflow: hidden;
      transition: transform 0.2s;
      z-index: 9998;
    }

    .tito-floating-btn:hover {
      transform: scale(1.1);
    }

    .tito-floating-btn img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .tito-modal-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.8);
      z-index: 9999;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }

    .tito-modal {
      width: 100%;
      max-width: 800px;
      max-height: 90vh;
      background: #141414;
      border-radius: 16px;
      border: 1px solid #2a2a2a;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    .tito-modal-header {
      padding: 16px 20px;
      border-bottom: 1px solid #2a2a2a;
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .tito-modal-header img {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      border: 2px solid #C6A962;
    }

    .tito-modal-header h3 {
      color: #C6A962;
      font-size: 16px;
      flex: 1;
    }

    .tito-modal-close {
      background: none;
      border: none;
      color: #666;
      font-size: 28px;
      cursor: pointer;
      padding: 0 8px;
    }

    .tito-modal-messages {
      flex: 1;
      overflow-y: auto;
      padding: 20px;
      display: flex;
      flex-direction: column;
      gap: 12px;
      min-height: 300px;
      max-height: 50vh;
    }
  `;

  // Inyectar estilos
  const styleEl = document.createElement('style');
  styleEl.textContent = styles;
  document.head.appendChild(styleEl);

  // Renderizar segun modo
  function render() {
    const container = document.getElementById('tito-maestro-container');
    if (!container && MODE === 'full') {
      const newContainer = document.createElement('div');
      newContainer.id = 'tito-maestro-container';
      document.body.appendChild(newContainer);
    }

    if (MODE === 'floating') {
      renderFloating();
    } else {
      renderFull();
    }
  }

  function renderFull() {
    const container = document.getElementById('tito-maestro-container');
    if (!container) return;

    container.innerHTML = \`
      <div class="tito-maestro">
        <div class="tito-header">
          <img src="\${TITO_IMG}" alt="Tito" class="tito-avatar" onerror="this.style.background='#C6A962'">
          <div class="tito-header-info">
            <h1>Tito Maestro</h1>
            <p>Tu asistente omnipotente - Preguntame lo que necesites</p>
          </div>
          <div class="tito-status">
            <span class="tito-status-dot"></span>
            En linea
          </div>
        </div>

        <div class="tito-main">
          <div class="tito-chat">
            <div class="tito-messages" id="tito-messages">
              \${mensajes.length === 0 ? \`
                <div class="tito-welcome">
                  <div class="tito-welcome-icon">✨</div>
                  <h2>Hola! Soy Tito</h2>
                  <p>Tu asistente magico con superpoderes. Puedo ayudarte con clientes, ordenes, productos, contenido, estadisticas y mucho mas.</p>
                </div>
              \` : ''}
            </div>

            <div class="tito-suggestions" id="tito-suggestions">
              <button class="tito-suggestion" data-msg="Que deberia hacer hoy?">Que hacer hoy</button>
              <button class="tito-suggestion" data-msg="Mostrame las estadisticas generales">Ver stats</button>
              <button class="tito-suggestion" data-msg="Hay ordenes pendientes?">Ordenes pendientes</button>
              <button class="tito-suggestion" data-msg="Clientes en riesgo de abandono">Clientes en riesgo</button>
            </div>

            <div class="tito-input-area">
              <div class="tito-input-wrapper">
                <input type="text" class="tito-input" id="tito-input" placeholder="Escribi tu mensaje... (ej: busca a maria, dale 50 runas a juan@mail.com)" />
                <button class="tito-send" id="tito-send" \${cargando ? 'disabled' : ''}>Enviar</button>
              </div>
            </div>
          </div>

          <div class="tito-sidebar">
            <div class="tito-card">
              <h3>⚡ Acciones rapidas</h3>
              <div class="tito-quick-actions">
                <button class="tito-quick-btn" data-msg="Mostrame las estadisticas generales">
                  <span>📊</span> Ver estadisticas
                </button>
                <button class="tito-quick-btn" data-msg="Ordenes del dia">
                  <span>🛒</span> Ordenes de hoy
                </button>
                <button class="tito-quick-btn" data-msg="Ver miembros del circulo activos">
                  <span>⭐</span> Miembros circulo
                </button>
                <button class="tito-quick-btn" data-msg="Productos sin stock">
                  <span>📦</span> Sin stock
                </button>
                <button class="tito-quick-btn" data-msg="Sincronizar productos con WooCommerce">
                  <span>🔄</span> Sync WooCommerce
                </button>
                <button class="tito-quick-btn" data-msg="Sugerime mejoras para el negocio">
                  <span>💡</span> Sugerencias
                </button>
              </div>
            </div>

            <div class="tito-card">
              <h3>🎯 Ejemplos de uso</h3>
              <div class="tito-quick-actions">
                <button class="tito-quick-btn" data-msg="Busca a maria">
                  <span>🔍</span> Buscar cliente
                </button>
                <button class="tito-quick-btn" data-msg="Dale 50 runas a ejemplo@mail.com por su cumpleaños">
                  <span>🎁</span> Dar runas
                </button>
                <button class="tito-quick-btn" data-msg="Activa el circulo de ejemplo@mail.com por 30 dias">
                  <span>⭐</span> Activar circulo
                </button>
                <button class="tito-quick-btn" data-msg="Crea un cupon del 20% llamado PROMO20">
                  <span>🎫</span> Crear cupon
                </button>
                <button class="tito-quick-btn" data-msg="Genera un post para Instagram sobre los guardianes de proteccion">
                  <span>📱</span> Crear post
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    \`;

    bindEvents();
    renderMessages();
  }

  function renderFloating() {
    // Boton flotante
    const btn = document.createElement('button');
    btn.className = 'tito-floating-btn';
    btn.innerHTML = \`<img src="\${TITO_IMG}" alt="Tito">\`;
    btn.onclick = openModal;
    document.body.appendChild(btn);
  }

  function openModal() {
    const overlay = document.createElement('div');
    overlay.className = 'tito-modal-overlay';
    overlay.onclick = (e) => { if (e.target === overlay) closeModal(); };

    overlay.innerHTML = \`
      <div class="tito-modal">
        <div class="tito-modal-header">
          <img src="\${TITO_IMG}" alt="Tito">
          <h3>Tito Maestro</h3>
          <button class="tito-modal-close" onclick="window.titoMaestro.closeModal()">&times;</button>
        </div>
        <div class="tito-modal-messages" id="tito-messages"></div>
        <div class="tito-input-area">
          <div class="tito-input-wrapper">
            <input type="text" class="tito-input" id="tito-input" placeholder="Escribi tu mensaje..." />
            <button class="tito-send" id="tito-send">Enviar</button>
          </div>
        </div>
      </div>
    \`;

    document.body.appendChild(overlay);
    bindEvents();
    renderMessages();
  }

  function closeModal() {
    const overlay = document.querySelector('.tito-modal-overlay');
    if (overlay) overlay.remove();
  }

  function bindEvents() {
    const input = document.getElementById('tito-input');
    const sendBtn = document.getElementById('tito-send');
    const suggestions = document.querySelectorAll('.tito-suggestion, .tito-quick-btn');

    if (input) {
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          enviarMensaje();
        }
      });
    }

    if (sendBtn) {
      sendBtn.addEventListener('click', enviarMensaje);
    }

    suggestions.forEach(btn => {
      btn.addEventListener('click', () => {
        const msg = btn.getAttribute('data-msg');
        if (msg && input) {
          input.value = msg;
          enviarMensaje();
        }
      });
    });
  }

  async function enviarMensaje() {
    const input = document.getElementById('tito-input');
    const mensaje = input?.value?.trim();

    if (!mensaje || cargando) return;

    // Agregar mensaje del usuario
    mensajes.push({ rol: 'usuario', texto: mensaje });
    historial.push({ rol: 'usuario', texto: mensaje });
    input.value = '';
    cargando = true;
    renderMessages();

    try {
      const res = await fetch(\`\${API_BASE}/api/tito/maestro\`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mensaje, historial: historial.slice(-15) })
      });

      const data = await res.json();

      if (data.success) {
        mensajes.push({ rol: 'asistente', texto: data.respuesta });
        historial.push({ rol: 'tito', texto: data.respuesta });
      } else {
        mensajes.push({ rol: 'asistente', texto: data.respuesta || 'Error procesando tu mensaje.' });
      }

    } catch (error) {
      mensajes.push({ rol: 'asistente', texto: 'Error de conexion. Intenta de nuevo.' });
    }

    cargando = false;
    renderMessages();
  }

  function renderMessages() {
    const container = document.getElementById('tito-messages');
    if (!container) return;

    let html = '';

    if (mensajes.length === 0) {
      html = \`
        <div class="tito-welcome">
          <div class="tito-welcome-icon">✨</div>
          <h2>Hola! Soy Tito</h2>
          <p>Tu asistente magico. Preguntame lo que necesites sobre clientes, ordenes, productos, contenido...</p>
        </div>
      \`;
    } else {
      mensajes.forEach(m => {
        const clase = m.rol === 'usuario' ? 'user' : 'assistant';
        const textoFormateado = formatearMarkdown(m.texto);
        html += \`<div class="tito-message \${clase}">\${textoFormateado}</div>\`;
      });

      if (cargando) {
        html += \`
          <div class="tito-typing">
            <div class="tito-typing-dots">
              <span></span><span></span><span></span>
            </div>
            Tito esta pensando...
          </div>
        \`;
      }
    }

    container.innerHTML = html;
    container.scrollTop = container.scrollHeight;
  }

  function formatearMarkdown(texto) {
    if (!texto) return '';

    return texto
      // Headers
      .replace(/^### (.+)$/gm, '<h3>$1</h3>')
      .replace(/^## (.+)$/gm, '<h2>$1</h2>')
      .replace(/^# (.+)$/gm, '<h2>$1</h2>')
      // Bold
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      // Italic
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      // Code inline
      .replace(/\`(.+?)\`/g, '<code>$1</code>')
      // Lists
      .replace(/^- (.+)$/gm, '<li>$1</li>')
      .replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>')
      // Line breaks
      .replace(/\\n/g, '<br>');
  }

  // API publica
  window.titoMaestro = {
    enviar: (msg) => {
      const input = document.getElementById('tito-input');
      if (input) {
        input.value = msg;
        enviarMensaje();
      }
    },
    closeModal
  };

  // Inicializar
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', render);
  } else {
    render();
  }

})();
