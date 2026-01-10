/**
 * ═══════════════════════════════════════════════════════════════════════════
 * TITO WIDGET v5.0 - AUTO-CARGABLE
 * Solo necesitas: <script src="https://duendes-vercel.vercel.app/tito-widget.js"></script>
 * ═══════════════════════════════════════════════════════════════════════════
 */

(function() {
  'use strict';

  // ═══════════════════════════════════════════════════════════════
  // CONFIGURACION
  // ═══════════════════════════════════════════════════════════════

  const CONFIG = {
    API_URL: 'https://duendes-vercel.vercel.app/api/tito/chat',
    AVATAR: 'https://duendesuy.10web.cloud/wp-content/uploads/2025/12/gemini-image-2_que_tenga_un_pin_en_su_ropa_con_este_logo_en_negro_y_dorado_solo_el_circulo_que_-0_b02c570f-fd54-4b54-b306-3aa6a2b413b2-scaled.jpg'
  };

  // ═══════════════════════════════════════════════════════════════
  // ESTILOS CSS
  // ═══════════════════════════════════════════════════════════════

  const CSS = `
    #tito-widget-container * { box-sizing: border-box; }

    #tito-bubble {
      position: fixed;
      bottom: 20px;
      right: 20px;
      width: 70px;
      height: 70px;
      border-radius: 50%;
      cursor: pointer;
      z-index: 999999;
      box-shadow: 0 4px 20px rgba(198,169,98,0.4);
      transition: transform 0.3s;
      overflow: hidden;
      border: 3px solid #C6A962;
    }
    #tito-bubble:hover { transform: scale(1.1); }
    #tito-bubble img { width: 100%; height: 100%; object-fit: cover; }

    #tito-proactive {
      position: fixed;
      bottom: 100px;
      right: 20px;
      background: linear-gradient(135deg, #1a1a1a 0%, #0d0d0d 100%);
      border: 2px solid #C6A962;
      border-radius: 20px;
      padding: 15px 20px;
      max-width: 280px;
      z-index: 999998;
      display: none;
      animation: titoSlideIn 0.4s ease;
      box-shadow: 0 8px 32px rgba(0,0,0,0.5);
    }
    #tito-proactive p {
      color: #f5f5f5;
      margin: 0 0 10px 0;
      font-size: 14px;
      line-height: 1.5;
    }
    #tito-proactive button {
      background: linear-gradient(135deg, #C6A962, #D4BC7D);
      color: #0a0a0a;
      border: none;
      padding: 8px 16px;
      border-radius: 20px;
      cursor: pointer;
      font-weight: 600;
      font-size: 13px;
    }
    #tito-proactive .close-btn {
      position: absolute;
      top: 8px;
      right: 12px;
      background: none;
      border: none;
      color: #888;
      font-size: 18px;
      cursor: pointer;
      padding: 0;
    }

    @keyframes titoSlideIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }

    #tito-chat {
      position: fixed;
      bottom: 100px;
      right: 20px;
      width: 380px;
      max-width: calc(100vw - 40px);
      height: 520px;
      max-height: calc(100vh - 140px);
      background: linear-gradient(180deg, #141414 0%, #0a0a0a 100%);
      border: 2px solid #C6A962;
      border-radius: 24px;
      display: none;
      flex-direction: column;
      z-index: 999999;
      overflow: hidden;
      box-shadow: 0 12px 48px rgba(0,0,0,0.6);
    }
    #tito-chat.open { display: flex; }

    #tito-header {
      background: linear-gradient(135deg, #1f1f1f, #141414);
      padding: 16px;
      display: flex;
      align-items: center;
      gap: 12px;
      border-bottom: 1px solid #333;
    }
    #tito-header img {
      width: 45px;
      height: 45px;
      border-radius: 50%;
      border: 2px solid #C6A962;
      object-fit: cover;
    }
    #tito-header-info h3 {
      margin: 0;
      color: #C6A962;
      font-size: 16px;
      font-weight: 700;
    }
    #tito-header-info span {
      color: #4ade80;
      font-size: 12px;
    }
    #tito-close {
      margin-left: auto;
      background: none;
      border: none;
      color: #888;
      font-size: 24px;
      cursor: pointer;
      padding: 0;
      line-height: 1;
    }

    #tito-messages {
      flex: 1;
      overflow-y: auto;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    #tito-messages::-webkit-scrollbar { width: 6px; }
    #tito-messages::-webkit-scrollbar-track { background: #1a1a1a; }
    #tito-messages::-webkit-scrollbar-thumb { background: #C6A962; border-radius: 3px; }

    .tito-msg {
      max-width: 85%;
      padding: 12px 16px;
      border-radius: 18px;
      font-size: 14px;
      line-height: 1.5;
      animation: msgFade 0.3s ease;
    }
    @keyframes msgFade {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .tito-msg.bot {
      background: linear-gradient(135deg, #1f1f1f, #171717);
      color: #f5f5f5;
      align-self: flex-start;
      border: 1px solid #333;
      border-bottom-left-radius: 4px;
    }
    .tito-msg.user {
      background: linear-gradient(135deg, #C6A962, #a88c4a);
      color: #0a0a0a;
      align-self: flex-end;
      border-bottom-right-radius: 4px;
      font-weight: 500;
    }

    .tito-typing {
      display: flex;
      gap: 4px;
      padding: 16px;
      align-self: flex-start;
    }
    .tito-typing span {
      width: 8px;
      height: 8px;
      background: #C6A962;
      border-radius: 50%;
      animation: typingBounce 1.4s infinite;
    }
    .tito-typing span:nth-child(2) { animation-delay: 0.2s; }
    .tito-typing span:nth-child(3) { animation-delay: 0.4s; }
    @keyframes typingBounce {
      0%, 60%, 100% { transform: translateY(0); }
      30% { transform: translateY(-8px); }
    }

    .tito-products-gallery {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 10px;
      margin-top: 12px;
      width: 100%;
    }
    .tito-product-card {
      background: linear-gradient(135deg, #1a1a1a, #0f0f0f) !important;
      border: 1px solid #C6A962 !important;
      border-radius: 12px !important;
      overflow: hidden !important;
      cursor: pointer !important;
      transition: all 0.3s ease !important;
      min-height: 180px !important;
      display: flex !important;
      flex-direction: column !important;
    }
    .tito-product-card:hover {
      transform: translateY(-3px) !important;
      box-shadow: 0 8px 24px rgba(198,169,98,0.3) !important;
      border-color: #D4BC7D !important;
    }
    .tito-product-card img {
      width: 100% !important;
      height: 100px !important;
      object-fit: cover !important;
      display: block !important;
      background: #222 !important;
    }
    .tito-product-card .card-info {
      padding: 10px !important;
      flex: 1 !important;
      display: flex !important;
      flex-direction: column !important;
      justify-content: space-between !important;
      background: #1a1a1a !important;
    }
    .tito-product-card h4 {
      margin: 0 0 6px 0 !important;
      color: #f5f5f5 !important;
      font-size: 12px !important;
      font-weight: 600 !important;
      line-height: 1.3 !important;
      display: -webkit-box !important;
      -webkit-line-clamp: 2 !important;
      -webkit-box-orient: vertical !important;
      overflow: hidden !important;
    }
    .tito-product-card .price {
      color: #C6A962 !important;
      font-weight: 700 !important;
      font-size: 14px !important;
    }

    #tito-input-area {
      padding: 12px 16px;
      border-top: 1px solid #333;
      display: flex;
      gap: 10px;
      background: #0f0f0f;
    }
    #tito-input {
      flex: 1;
      background: #1a1a1a;
      border: 1px solid #333;
      border-radius: 24px;
      padding: 12px 18px;
      color: #f5f5f5;
      font-size: 14px;
      outline: none;
    }
    #tito-input:focus { border-color: #C6A962; }
    #tito-input::placeholder { color: #666; }
    #tito-send {
      background: linear-gradient(135deg, #C6A962, #D4BC7D);
      border: none;
      width: 44px;
      height: 44px;
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: transform 0.2s;
    }
    #tito-send:hover { transform: scale(1.1); }
    #tito-send svg {
      width: 20px;
      height: 20px;
      fill: #0a0a0a;
    }

    @media (max-width: 480px) {
      #tito-chat {
        width: calc(100vw - 20px);
        height: calc(100vh - 100px);
        bottom: 90px;
        right: 10px;
        border-radius: 20px;
      }
      #tito-bubble { width: 60px; height: 60px; bottom: 15px; right: 15px; }
      .tito-products-gallery { grid-template-columns: 1fr 1fr; }
    }
  `;

  // ═══════════════════════════════════════════════════════════════
  // HTML ESTRUCTURA
  // ═══════════════════════════════════════════════════════════════

  const HTML = `
    <div id="tito-widget-container">
      <div id="tito-bubble">
        <img src="${CONFIG.AVATAR}" alt="Tito">
      </div>

      <div id="tito-proactive">
        <button class="close-btn" onclick="TitoWidget.closeProactive()">x</button>
        <p id="tito-proactive-text">Hola! Buscas algo especial?</p>
        <button onclick="TitoWidget.openFromProactive()">Chatear con Tito</button>
      </div>

      <div id="tito-chat">
        <div id="tito-header">
          <img src="${CONFIG.AVATAR}" alt="Tito">
          <div id="tito-header-info">
            <h3>Tito</h3>
            <span>En linea</span>
          </div>
          <button id="tito-close" onclick="TitoWidget.close()">x</button>
        </div>

        <div id="tito-messages">
          <div class="tito-msg bot">Hola! Soy Tito. En que te ayudo?</div>
        </div>

        <div id="tito-input-area">
          <input type="text" id="tito-input" placeholder="Escribi tu mensaje..." autocomplete="off">
          <button id="tito-send">
            <svg viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
          </button>
        </div>
      </div>
    </div>
  `;

  // ═══════════════════════════════════════════════════════════════
  // WIDGET CLASS
  // ═══════════════════════════════════════════════════════════════

  const TitoWidget = {
    isOpen: false,
    conversationHistory: [],

    init() {
      // Inyectar CSS
      const style = document.createElement('style');
      style.textContent = CSS;
      document.head.appendChild(style);

      // Inyectar HTML
      const container = document.createElement('div');
      container.innerHTML = HTML;
      document.body.appendChild(container.firstElementChild);

      // Bindings
      this.bindEvents();

      // Proactive bubble despues de 8 segundos
      setTimeout(() => this.showProactive(), 8000);

      console.log('Tito Widget v5.0 cargado');
    },

    bindEvents() {
      document.getElementById('tito-bubble').addEventListener('click', () => this.toggle());
      document.getElementById('tito-input').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') this.send();
      });
      document.getElementById('tito-send').addEventListener('click', () => this.send());
    },

    toggle() {
      this.isOpen = !this.isOpen;
      document.getElementById('tito-chat').classList.toggle('open', this.isOpen);
      document.getElementById('tito-proactive').style.display = 'none';
      if (this.isOpen) {
        document.getElementById('tito-input').focus();
      }
    },

    open() {
      this.isOpen = true;
      document.getElementById('tito-chat').classList.add('open');
      document.getElementById('tito-proactive').style.display = 'none';
      document.getElementById('tito-input').focus();
    },

    close() {
      this.isOpen = false;
      document.getElementById('tito-chat').classList.remove('open');
    },

    showProactive() {
      if (this.isOpen) return;

      const page = this.detectPage();
      const messages = {
        home: 'Bienvenida! Queres ver los duendes mas vendidos?',
        tienda: 'Buscas algo especial? Puedo ayudarte a encontrar el duende perfecto',
        producto: 'Tenes dudas sobre este guardian? Preguntame!',
        carrito: 'Necesitas ayuda para completar tu pedido?',
        checkout: 'Estoy aca si tenes alguna duda antes de finalizar',
        default: 'Hola! Soy Tito, en que te puedo ayudar?'
      };

      document.getElementById('tito-proactive-text').textContent = messages[page] || messages.default;
      document.getElementById('tito-proactive').style.display = 'block';
    },

    closeProactive() {
      document.getElementById('tito-proactive').style.display = 'none';
    },

    openFromProactive() {
      this.closeProactive();
      this.open();
    },

    detectPage() {
      const url = window.location.href.toLowerCase();
      const path = window.location.pathname.toLowerCase();

      if (path === '/' || path === '/home') return 'home';
      if (url.includes('/tienda') || url.includes('/shop') || url.includes('/producto')) return 'tienda';
      if (url.includes('/product/') || url.includes('/producto/')) return 'producto';
      if (url.includes('/cart') || url.includes('/carrito')) return 'carrito';
      if (url.includes('/checkout') || url.includes('/finalizar')) return 'checkout';
      return 'default';
    },

    getCartInfo() {
      try {
        if (typeof wc_cart_fragments_params !== 'undefined') {
          const cartData = sessionStorage.getItem('wc_cart_' + wc_cart_fragments_params.cart_hash);
          if (cartData) return JSON.parse(cartData);
        }
      } catch(e) {}
      return null;
    },

    addMessage(text, type, productos = null) {
      const container = document.getElementById('tito-messages');
      const msg = document.createElement('div');
      msg.className = 'tito-msg ' + type;
      msg.innerHTML = text;
      container.appendChild(msg);

      // Si hay productos, crear galeria
      if (productos && productos.length > 0) {
        console.log('Creando galeria con', productos.length, 'productos');
        const gallery = document.createElement('div');
        gallery.className = 'tito-products-gallery';

        productos.forEach(function(p) {
          const card = document.createElement('div');
          card.className = 'tito-product-card';
          card.onclick = function() { window.open(p.url || p.permalink, '_blank'); };

          const imgSrc = p.imagen || (p.images && p.images[0] ? p.images[0].src : null) || CONFIG.AVATAR;
          const nombre = p.nombre || p.name || 'Producto';
          const precio = p.precio || p.price || '???';

          card.innerHTML = '<img src="' + imgSrc + '" alt="' + nombre + '" onerror="this.src=\'' + CONFIG.AVATAR + '\'">' +
            '<div class="card-info">' +
            '<h4>' + nombre + '</h4>' +
            '<span class="price">$' + precio + '</span>' +
            '</div>';
          gallery.appendChild(card);
        });

        container.appendChild(gallery);
      }

      container.scrollTop = container.scrollHeight;
    },

    showTyping() {
      const container = document.getElementById('tito-messages');
      const typing = document.createElement('div');
      typing.className = 'tito-typing';
      typing.id = 'tito-typing';
      typing.innerHTML = '<span></span><span></span><span></span>';
      container.appendChild(typing);
      container.scrollTop = container.scrollHeight;
    },

    hideTyping() {
      const typing = document.getElementById('tito-typing');
      if (typing) typing.remove();
    },

    send: async function() {
      const input = document.getElementById('tito-input');
      const text = input.value.trim();
      if (!text) return;

      input.value = '';
      this.addMessage(text, 'user');
      this.showTyping();

      // Agregar al historial
      this.conversationHistory.push({ role: 'user', content: text });

      try {
        const response = await fetch(CONFIG.API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            mensaje: text,
            contexto: {
              pagina: window.location.href,
              titulo: document.title,
              tipoPagina: this.detectPage(),
              carrito: this.getCartInfo()
            },
            historial: this.conversationHistory.slice(-6)
          })
        });

        const data = await response.json();
        this.hideTyping();

        if (data.respuesta) {
          this.addMessage(data.respuesta, 'bot', data.productos);
          this.conversationHistory.push({ role: 'assistant', content: data.respuesta });
        } else {
          this.addMessage('Ups, algo fallo. Probamos de nuevo?', 'bot');
        }

      } catch (error) {
        console.error('Error Tito:', error);
        this.hideTyping();
        this.addMessage('No pude conectarme. Intenta de nuevo', 'bot');
      }
    }
  };

  // Exponer globalmente
  window.TitoWidget = TitoWidget;

  // Auto-inicializar cuando el DOM este listo
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() { TitoWidget.init(); });
  } else {
    TitoWidget.init();
  }

})();
