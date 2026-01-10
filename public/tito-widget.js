/**
 * TITO WIDGET v5.2 - Duendes del Uruguay
 * <script src="https://duendes-vercel.vercel.app/tito-widget.js"></script>
 */

(function() {
  'use strict';

  const CONFIG = {
    API_URL: 'https://duendes-vercel.vercel.app/api/tito/chat',
    AVATAR: 'https://duendesuy.10web.cloud/wp-content/uploads/2025/12/gemini-image-2_que_tenga_un_pin_en_su_ropa_con_este_logo_en_negro_y_dorado_solo_el_circulo_que_-0_b02c570f-fd54-4b54-b306-3aa6a2b413b2-scaled.jpg'
  };

  const CSS = `
    @import url('https://fonts.googleapis.com/css2?family=Crimson+Text:ital,wght@0,400;0,600;1,400&display=swap');

    #tito-widget-container * {
      box-sizing: border-box;
      font-family: 'Crimson Text', Georgia, serif;
    }

    #tito-bubble {
      position: fixed;
      bottom: 20px;
      right: 20px;
      width: 85px;
      height: 85px;
      border-radius: 50%;
      cursor: pointer;
      z-index: 999999;
      box-shadow: 0 4px 28px rgba(198,169,98,0.5), 0 0 0 4px rgba(198,169,98,0.2);
      transition: all 0.3s ease;
      overflow: hidden;
      border: 3px solid #C6A962;
      background: #0a0a0a;
    }
    #tito-bubble:hover {
      transform: scale(1.08);
      box-shadow: 0 6px 36px rgba(198,169,98,0.6), 0 0 0 8px rgba(198,169,98,0.15);
    }
    #tito-bubble img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    #tito-bubble .tito-wave {
      position: absolute;
      bottom: -2px;
      right: -2px;
      font-size: 22px;
      animation: wave 2s infinite;
    }
    @keyframes wave {
      0%, 100% { transform: rotate(0deg); }
      25% { transform: rotate(20deg); }
      75% { transform: rotate(-10deg); }
    }

    #tito-proactive {
      position: fixed;
      bottom: 118px;
      right: 20px;
      background: linear-gradient(145deg, #1a1a1a 0%, #0d0d0d 100%);
      border: 1px solid #C6A962;
      border-radius: 16px;
      padding: 16px 20px;
      max-width: 280px;
      z-index: 999998;
      display: none;
      animation: titoSlideIn 0.4s ease;
      box-shadow: 0 8px 32px rgba(0,0,0,0.6), inset 0 1px 0 rgba(198,169,98,0.1);
    }
    #tito-proactive p {
      color: #e8e8e8;
      margin: 0 0 12px 0;
      font-size: 15px;
      line-height: 1.5;
    }
    #tito-proactive .tito-cta {
      background: linear-gradient(135deg, #C6A962 0%, #a88c4a 100%);
      color: #0a0a0a;
      border: none;
      padding: 10px 18px;
      border-radius: 24px;
      cursor: pointer;
      font-weight: 600;
      font-size: 14px;
      width: 100%;
      transition: all 0.2s;
    }
    #tito-proactive .tito-cta:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(198,169,98,0.4);
    }
    #tito-proactive .close-btn {
      position: absolute;
      top: 8px;
      right: 10px;
      background: none;
      border: none;
      color: #666;
      font-size: 20px;
      cursor: pointer;
      padding: 0;
      line-height: 1;
    }
    #tito-proactive .close-btn:hover { color: #C6A962; }

    @keyframes titoSlideIn {
      from { opacity: 0; transform: translateY(16px) scale(0.95); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }

    #tito-chat {
      position: fixed;
      bottom: 118px;
      right: 20px;
      width: 370px;
      max-width: calc(100vw - 40px);
      height: 520px;
      max-height: calc(100vh - 150px);
      background: linear-gradient(180deg, #121212 0%, #0a0a0a 100%);
      border: 1px solid #C6A962;
      border-radius: 20px;
      display: none;
      flex-direction: column;
      z-index: 999999;
      overflow: hidden;
      box-shadow: 0 16px 64px rgba(0,0,0,0.7), inset 0 1px 0 rgba(198,169,98,0.1);
      animation: chatOpen 0.3s ease;
    }
    @keyframes chatOpen {
      from { opacity: 0; transform: translateY(20px) scale(0.95); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }
    #tito-chat.open { display: flex; }

    #tito-header {
      background: linear-gradient(180deg, #1a1a1a 0%, #141414 100%);
      padding: 14px 16px;
      display: flex;
      align-items: center;
      gap: 12px;
      border-bottom: 1px solid rgba(198,169,98,0.3);
    }
    #tito-header img {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      border: 2px solid #C6A962;
      object-fit: cover;
    }
    #tito-header-info h3 {
      margin: 0;
      color: #C6A962;
      font-size: 18px;
      font-weight: 600;
      letter-spacing: 0.5px;
    }
    #tito-header-info span {
      color: #5cb85c;
      font-size: 12px;
      display: flex;
      align-items: center;
      gap: 4px;
    }
    #tito-header-info span::before {
      content: '';
      width: 6px;
      height: 6px;
      background: #5cb85c;
      border-radius: 50%;
      animation: pulse 2s infinite;
    }
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }
    #tito-close {
      margin-left: auto;
      background: rgba(255,255,255,0.05);
      border: none;
      color: #888;
      font-size: 18px;
      cursor: pointer;
      padding: 6px 10px;
      border-radius: 8px;
      line-height: 1;
      transition: all 0.2s;
    }
    #tito-close:hover {
      background: rgba(198,169,98,0.15);
      color: #C6A962;
    }

    #tito-messages {
      flex: 1;
      overflow-y: auto;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    #tito-messages::-webkit-scrollbar { width: 5px; }
    #tito-messages::-webkit-scrollbar-track { background: transparent; }
    #tito-messages::-webkit-scrollbar-thumb {
      background: rgba(198,169,98,0.4);
      border-radius: 4px;
    }

    .tito-msg {
      max-width: 85%;
      padding: 12px 16px;
      border-radius: 16px;
      font-size: 15px;
      line-height: 1.55;
      animation: msgFade 0.3s ease;
    }
    @keyframes msgFade {
      from { opacity: 0; transform: translateY(8px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .tito-msg.bot {
      background: linear-gradient(135deg, #1e1e1e 0%, #171717 100%);
      color: #f0f0f0;
      align-self: flex-start;
      border: 1px solid rgba(198,169,98,0.2);
      border-bottom-left-radius: 4px;
    }
    .tito-msg.user {
      background: linear-gradient(135deg, #C6A962 0%, #a88c4a 100%);
      color: #0a0a0a;
      align-self: flex-end;
      border-bottom-right-radius: 4px;
      font-weight: 500;
    }

    .tito-quick-buttons {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-top: 12px;
      align-self: flex-start;
    }
    .tito-quick-btn {
      background: linear-gradient(135deg, #1a1a1a, #0f0f0f);
      border: 1px solid #C6A962;
      color: #C6A962;
      padding: 9px 16px;
      border-radius: 20px;
      font-size: 13px;
      cursor: pointer;
      transition: all 0.25s ease;
      font-family: 'Crimson Text', Georgia, serif;
      font-weight: 500;
    }
    .tito-quick-btn:hover {
      background: linear-gradient(135deg, #C6A962, #a88c4a);
      color: #0a0a0a;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(198,169,98,0.3);
    }

    .tito-typing {
      display: flex;
      gap: 5px;
      padding: 14px 16px;
      align-self: flex-start;
      background: rgba(30,30,30,0.6);
      border-radius: 16px;
      border-bottom-left-radius: 4px;
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
      0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
      30% { transform: translateY(-6px); opacity: 1; }
    }

    .tito-products-gallery {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 10px;
      margin-top: 12px;
      width: 100%;
    }
    .tito-product-card {
      background: linear-gradient(145deg, #1a1a1a, #0f0f0f) !important;
      border: 1px solid rgba(198,169,98,0.4) !important;
      border-radius: 12px !important;
      overflow: hidden !important;
      cursor: pointer !important;
      transition: all 0.3s ease !important;
      min-height: 170px !important;
      display: flex !important;
      flex-direction: column !important;
    }
    .tito-product-card:hover {
      transform: translateY(-2px) !important;
      box-shadow: 0 8px 20px rgba(198,169,98,0.25) !important;
      border-color: #C6A962 !important;
    }
    .tito-product-card img {
      width: 100% !important;
      height: 95px !important;
      object-fit: cover !important;
      display: block !important;
      background: #1a1a1a !important;
    }
    .tito-product-card .card-info {
      padding: 10px !important;
      flex: 1 !important;
      display: flex !important;
      flex-direction: column !important;
      justify-content: space-between !important;
      background: linear-gradient(180deg, #1a1a1a, #141414) !important;
    }
    .tito-product-card h4 {
      margin: 0 0 6px 0 !important;
      color: #f0f0f0 !important;
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
      padding: 12px 14px;
      border-top: 1px solid rgba(198,169,98,0.2);
      display: flex;
      gap: 10px;
      background: linear-gradient(180deg, #0f0f0f, #0a0a0a);
    }
    #tito-input {
      flex: 1;
      background: #1a1a1a;
      border: 1px solid rgba(198,169,98,0.3);
      border-radius: 24px;
      padding: 12px 18px;
      color: #f0f0f0;
      font-size: 14px;
      outline: none;
      transition: border-color 0.2s;
    }
    #tito-input:focus {
      border-color: #C6A962;
      box-shadow: 0 0 0 2px rgba(198,169,98,0.1);
    }
    #tito-input::placeholder { color: #666; }
    #tito-send {
      background: linear-gradient(135deg, #C6A962, #a88c4a);
      border: none;
      width: 44px;
      height: 44px;
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s;
      flex-shrink: 0;
    }
    #tito-send:hover {
      transform: scale(1.05);
      box-shadow: 0 4px 12px rgba(198,169,98,0.4);
    }
    #tito-send svg {
      width: 20px;
      height: 20px;
      margin-left: 2px;
    }
    #tito-send svg path {
      fill: #0a0a0a;
    }

    @media (max-width: 480px) {
      #tito-chat {
        width: calc(100vw - 24px);
        height: calc(100vh - 120px);
        bottom: 110px;
        right: 12px;
        border-radius: 16px;
      }
      #tito-bubble {
        width: 72px;
        height: 72px;
        bottom: 16px;
        right: 14px;
      }
      #tito-proactive {
        right: 14px;
        bottom: 100px;
        max-width: calc(100vw - 100px);
      }
    }
  `;

  const HTML = `
    <div id="tito-widget-container">
      <div id="tito-bubble">
        <img src="${CONFIG.AVATAR}" alt="Tito">
      </div>

      <div id="tito-proactive">
        <button class="close-btn" onclick="TitoWidget.closeProactive()">&times;</button>
        <p id="tito-proactive-text"></p>
        <button class="tito-cta" id="tito-proactive-btn">Chatear con Tito</button>
      </div>

      <div id="tito-chat">
        <div id="tito-header">
          <img src="${CONFIG.AVATAR}" alt="Tito">
          <div id="tito-header-info">
            <h3>Tito</h3>
            <span>En linea</span>
          </div>
          <button id="tito-close" onclick="TitoWidget.close()">&times;</button>
        </div>

        <div id="tito-messages"></div>

        <div id="tito-input-area">
          <input type="text" id="tito-input" placeholder="Escribi tu mensaje..." autocomplete="off">
          <button id="tito-send">
            <svg viewBox="0 0 24 24" fill="#0a0a0a"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" fill="#0a0a0a"/></svg>
          </button>
        </div>
      </div>
    </div>
  `;

  const TITO_INTRO = [
    "Hola! Soy Tito, el guardian de este portal magico. Llevo siglos ayudando a las almas a encontrar su duende protector...",
    "Bienvenida al bosque encantado! Soy Tito, y mi mision es ayudarte a encontrar al guardian que tu energia necesita.",
    "Saludos, viajera! Soy Tito, el elfo custodio de Duendes del Uruguay. Siento que el universo te trajo hasta aca por una razon..."
  ];

  const QUICK_OPTIONS = [
    { text: "Quien sos, Tito?", msg: "Contame sobre vos Tito, quien sos y que haces aca?" },
    { text: "Recomendame un duende", msg: "Ayudame a elegir un duende, no se cual me conviene" },
    { text: "Como comprar?", msg: "Como es el proceso para adoptar un duende?" },
    { text: "Ver guardianes", msg: "Mostrame los duendes disponibles" }
  ];

  const TitoWidget = {
    isOpen: false,
    conversationHistory: [],
    proactiveMessage: '',
    hasShownIntro: false,

    init() {
      const style = document.createElement('style');
      style.textContent = CSS;
      document.head.appendChild(style);

      const container = document.createElement('div');
      container.innerHTML = HTML;
      document.body.appendChild(container.firstElementChild);

      this.bindEvents();
      setTimeout(() => this.showProactive(), 5000);
      console.log('Tito Widget v5.2 listo');
    },

    bindEvents() {
      document.getElementById('tito-bubble').addEventListener('click', () => this.toggle());
      document.getElementById('tito-input').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') this.send();
      });
      document.getElementById('tito-send').addEventListener('click', () => this.send());
      document.getElementById('tito-proactive-btn').addEventListener('click', () => this.openFromProactive());
    },

    toggle() {
      this.isOpen = !this.isOpen;
      document.getElementById('tito-chat').classList.toggle('open', this.isOpen);
      document.getElementById('tito-proactive').style.display = 'none';
      if (this.isOpen) {
        document.getElementById('tito-input').focus();
        if (!this.hasShownIntro) {
          this.showIntro();
        }
      }
    },

    open() {
      this.isOpen = true;
      document.getElementById('tito-chat').classList.add('open');
      document.getElementById('tito-proactive').style.display = 'none';
      document.getElementById('tito-input').focus();
      if (!this.hasShownIntro) {
        this.showIntro();
      }
    },

    close() {
      this.isOpen = false;
      document.getElementById('tito-chat').classList.remove('open');
    },

    showIntro() {
      this.hasShownIntro = true;
      const intro = TITO_INTRO[Math.floor(Math.random() * TITO_INTRO.length)];
      this.addMessage(intro, 'bot');
      this.showQuickButtons();
    },

    showQuickButtons() {
      const container = document.getElementById('tito-messages');
      const buttonsDiv = document.createElement('div');
      buttonsDiv.className = 'tito-quick-buttons';
      buttonsDiv.id = 'tito-quick-buttons';

      QUICK_OPTIONS.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = 'tito-quick-btn';
        btn.textContent = opt.text;
        btn.onclick = () => {
          document.getElementById('tito-input').value = opt.msg;
          this.send();
          const btns = document.getElementById('tito-quick-buttons');
          if (btns) btns.remove();
        };
        buttonsDiv.appendChild(btn);
      });

      container.appendChild(buttonsDiv);
      container.scrollTop = container.scrollHeight;
    },

    showProactive() {
      if (this.isOpen) return;

      const page = this.detectPage();
      const messages = {
        home: { text: 'Psst... soy Tito! Puedo ayudarte a encontrar tu guardian perfecto', auto: 'Hola Tito! Que duendes tenes?' },
        tienda: { text: 'Veo que estas explorando... Te ayudo a elegir?', auto: 'Ayudame a elegir un duende' },
        producto: { text: 'Este guardian tiene algo especial... Queres saber mas?', auto: 'Contame sobre este duende' },
        carrito: { text: 'Ya casi! Alguna duda antes de llevartelo?', auto: 'Tengo dudas sobre mi pedido' },
        checkout: { text: 'Ultimo paso! Estoy aca si necesitas algo', auto: 'Tengo una consulta' },
        default: { text: 'Hola! Soy Tito, el guardian del portal. Charlamos?', auto: 'Hola Tito!' }
      };

      const msg = messages[page] || messages.default;
      this.proactiveMessage = msg.auto;

      document.getElementById('tito-proactive-text').textContent = msg.text;
      document.getElementById('tito-proactive').style.display = 'block';
    },

    closeProactive() {
      document.getElementById('tito-proactive').style.display = 'none';
    },

    openFromProactive() {
      this.closeProactive();
      this.open();

      if (this.proactiveMessage && this.hasShownIntro) {
        setTimeout(() => {
          document.getElementById('tito-input').value = this.proactiveMessage;
          this.send();
        }, 800);
      }
    },

    detectPage() {
      const url = window.location.href.toLowerCase();
      const path = window.location.pathname.toLowerCase();

      if (path === '/' || path === '/home') return 'home';
      if (url.includes('/tienda') || url.includes('/shop')) return 'tienda';
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

    addMessage(text, type, productos) {
      const container = document.getElementById('tito-messages');
      const msg = document.createElement('div');
      msg.className = 'tito-msg ' + type;
      msg.textContent = text;
      container.appendChild(msg);

      if (productos && productos.length > 0) {
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

      // Remove quick buttons if they exist
      const btns = document.getElementById('tito-quick-buttons');
      if (btns) btns.remove();

      input.value = '';
      this.addMessage(text, 'user');
      this.showTyping();

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

        const respuesta = data.respuesta || data.response;
        if (respuesta) {
          this.addMessage(respuesta, 'bot', data.productos);
          this.conversationHistory.push({ role: 'assistant', content: respuesta });
        } else {
          this.addMessage('Mmm, algo raro paso en el portal... Intenta de nuevo?', 'bot');
        }

      } catch (error) {
        console.error('Error Tito:', error);
        this.hideTyping();
        this.addMessage('Se corto la magia por un momento... Probas de nuevo?', 'bot');
      }
    }
  };

  window.TitoWidget = TitoWidget;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() { TitoWidget.init(); });
  } else {
    TitoWidget.init();
  }

})();
