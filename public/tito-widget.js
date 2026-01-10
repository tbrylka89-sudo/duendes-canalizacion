/**
 * TITO WIDGET v7.0 - Duendes del Uruguay
 * Badge verde visible + mensajes bien formateados
 * <script src="https://duendes-vercel.vercel.app/tito-widget.js"></script>
 */

(function() {
  'use strict';

  const CONFIG = {
    API_URL: 'https://duendes-vercel.vercel.app/api/tito/chat',
    AVATAR: 'https://duendesuy.10web.cloud/wp-content/uploads/2025/12/gemini-image-2_que_tenga_un_pin_en_su_ropa_con_este_logo_en_negro_y_dorado_solo_el_circulo_que_-0_b02c570f-fd54-4b54-b306-3aa6a2b413b2-scaled.jpg'
  };

  const CSS = `
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600&display=swap');

    #tito-widget-container * {
      box-sizing: border-box;
      font-family: 'Cormorant Garamond', Georgia, serif;
    }

    #tito-bubble {
      position: fixed;
      bottom: 20px;
      right: 20px;
      width: 80px;
      height: 80px;
      border-radius: 50%;
      cursor: pointer;
      z-index: 999999;
      box-shadow: 0 4px 24px rgba(198,169,98,0.45), 0 0 0 3px rgba(198,169,98,0.15);
      transition: all 0.3s ease;
      border: 2px solid #C6A962;
      background: radial-gradient(circle at 30% 30%, #1a1a1a, #000);
    }
    #tito-bubble:hover {
      transform: scale(1.08) rotate(3deg);
      box-shadow: 0 8px 32px rgba(198,169,98,0.6), 0 0 20px rgba(198,169,98,0.3);
    }
    #tito-bubble img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 50%;
    }
    #tito-bubble-badge {
      position: absolute;
      bottom: -2px;
      right: -2px;
      width: 22px;
      height: 22px;
      background: #22c55e;
      border-radius: 50%;
      border: 3px solid #0a0a0a;
      animation: pulse-badge 2s infinite;
      z-index: 10;
    }
    @keyframes pulse-badge {
      0%, 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(34,197,94,0.5); }
      50% { transform: scale(1.1); box-shadow: 0 0 0 8px rgba(34,197,94,0); }
    }

    #tito-proactive {
      position: fixed;
      bottom: 112px;
      right: 20px;
      background: linear-gradient(145deg, #141414, #0a0a0a);
      border: 1px solid rgba(198,169,98,0.6);
      border-radius: 16px 16px 4px 16px;
      padding: 16px 20px;
      max-width: 270px;
      z-index: 999998;
      display: none;
      animation: slideUp 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
      box-shadow: 0 8px 32px rgba(0,0,0,0.5);
    }
    @keyframes slideUp {
      from { opacity: 0; transform: translateY(20px) scale(0.9); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }
    #tito-proactive p {
      color: #f0f0f0;
      margin: 0 0 14px 0;
      font-size: 15px;
      line-height: 1.5;
      font-weight: 500;
    }
    #tito-proactive .tito-cta {
      background: linear-gradient(135deg, #C6A962, #9a7b3c);
      color: #0a0a0a;
      border: none;
      padding: 11px 20px;
      border-radius: 25px;
      cursor: pointer;
      font-weight: 600;
      font-size: 14px;
      width: 100%;
      transition: all 0.25s;
      letter-spacing: 0.3px;
    }
    #tito-proactive .tito-cta:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(198,169,98,0.4);
    }
    #tito-proactive .close-btn {
      position: absolute;
      top: 6px;
      right: 10px;
      background: none;
      border: none;
      color: #666;
      font-size: 20px;
      cursor: pointer;
      padding: 0;
      line-height: 1;
      transition: color 0.2s;
    }
    #tito-proactive .close-btn:hover { color: #C6A962; }

    #tito-chat {
      position: fixed;
      bottom: 112px;
      right: 20px;
      width: 380px;
      max-width: calc(100vw - 40px);
      height: 540px;
      max-height: calc(100vh - 150px);
      background: linear-gradient(180deg, #0f0f0f 0%, #080808 100%);
      border: 1px solid rgba(198,169,98,0.5);
      border-radius: 24px;
      display: none;
      flex-direction: column;
      z-index: 999999;
      overflow: hidden;
      box-shadow: 0 20px 60px rgba(0,0,0,0.7), inset 0 1px 0 rgba(198,169,98,0.1);
      animation: chatOpen 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
    }
    @keyframes chatOpen {
      from { opacity: 0; transform: translateY(30px) scale(0.9); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }
    #tito-chat.open { display: flex; }

    #tito-header {
      background: linear-gradient(180deg, #161616, #0f0f0f);
      padding: 16px 18px;
      display: flex;
      align-items: center;
      gap: 14px;
      border-bottom: 1px solid rgba(198,169,98,0.25);
    }
    #tito-header-avatar {
      position: relative;
      width: 50px;
      height: 50px;
    }
    #tito-header-avatar img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      border: 2px solid #C6A962;
      object-fit: cover;
    }
    #tito-header-avatar .status-dot {
      position: absolute;
      bottom: 2px;
      right: 2px;
      width: 12px;
      height: 12px;
      background: #22c55e;
      border-radius: 50%;
      border: 2px solid #0f0f0f;
    }
    #tito-header-info h3 {
      margin: 0;
      color: #C6A962;
      font-size: 19px;
      font-weight: 600;
      letter-spacing: 0.5px;
    }
    #tito-header-info span {
      color: #22c55e;
      font-size: 12px;
      font-weight: 500;
    }
    #tito-close {
      margin-left: auto;
      background: rgba(255,255,255,0.03);
      border: 1px solid rgba(255,255,255,0.08);
      color: #777;
      font-size: 20px;
      cursor: pointer;
      padding: 6px 12px;
      border-radius: 10px;
      line-height: 1;
      transition: all 0.2s;
    }
    #tito-close:hover {
      background: rgba(198,169,98,0.1);
      border-color: rgba(198,169,98,0.3);
      color: #C6A962;
    }

    #tito-messages {
      flex: 1;
      overflow-y: auto;
      padding: 18px;
      display: flex;
      flex-direction: column;
      gap: 14px;
      background: linear-gradient(180deg, rgba(20,20,20,0.5), transparent);
    }
    #tito-messages::-webkit-scrollbar { width: 4px; }
    #tito-messages::-webkit-scrollbar-track { background: transparent; }
    #tito-messages::-webkit-scrollbar-thumb {
      background: rgba(198,169,98,0.3);
      border-radius: 4px;
    }

    .tito-msg {
      max-width: 88%;
      padding: 16px 20px;
      border-radius: 18px;
      font-size: 15px;
      line-height: 1.7;
      animation: msgPop 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    }
    @keyframes msgPop {
      from { opacity: 0; transform: scale(0.9) translateY(10px); }
      to { opacity: 1; transform: scale(1) translateY(0); }
    }
    .tito-msg.bot {
      background: linear-gradient(145deg, #1a1a1a, #131313);
      color: #e8e8e8;
      align-self: flex-start;
      border: 1px solid rgba(198,169,98,0.2);
      border-bottom-left-radius: 4px;
    }
    .tito-msg.bot .msg-title {
      color: #C6A962;
      font-weight: 600;
      font-size: 16px;
      display: block;
      margin-bottom: 10px;
      padding-bottom: 8px;
      border-bottom: 1px solid rgba(198,169,98,0.2);
    }
    .tito-msg.bot .msg-section {
      margin: 12px 0;
      padding-left: 8px;
      border-left: 2px solid rgba(198,169,98,0.3);
    }
    .tito-msg.bot .msg-item {
      display: flex;
      align-items: flex-start;
      gap: 10px;
      margin: 8px 0;
      padding: 6px 0;
    }
    .tito-msg.bot .msg-emoji {
      font-size: 18px;
      flex-shrink: 0;
    }
    .tito-msg.bot .msg-highlight {
      color: #C6A962;
      font-weight: 600;
    }
    .tito-msg.bot strong, .tito-msg.bot b {
      color: #C6A962;
      font-weight: 600;
    }
    .tito-msg.bot .msg-list {
      list-style: none;
      padding: 0;
      margin: 10px 0;
    }
    .tito-msg.bot .msg-list li {
      padding: 6px 0;
      padding-left: 20px;
      position: relative;
    }
    .tito-msg.bot .msg-list li::before {
      content: '✦';
      position: absolute;
      left: 0;
      color: #C6A962;
      font-size: 10px;
    }
    .tito-msg.user {
      background: linear-gradient(135deg, #C6A962, #9a7b3c);
      color: #0a0a0a;
      align-self: flex-end;
      border-bottom-right-radius: 4px;
      font-weight: 500;
    }
    .tito-msg.system {
      background: rgba(34, 197, 94, 0.1);
      border: 1px solid rgba(34, 197, 94, 0.3);
      color: #86efac;
      font-size: 13px;
      padding: 10px 14px;
      align-self: center;
      max-width: 90%;
      text-align: center;
    }

    .tito-quick-buttons {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-top: 12px;
      align-self: flex-start;
    }
    .tito-quick-btn {
      background: linear-gradient(145deg, #1a1a1a, #0f0f0f);
      border: 1px solid rgba(198,169,98,0.5);
      color: #C6A962;
      padding: 10px 16px;
      border-radius: 22px;
      font-size: 13px;
      cursor: pointer;
      transition: all 0.25s;
      font-family: 'Cormorant Garamond', Georgia, serif;
      font-weight: 600;
    }
    .tito-quick-btn:hover {
      background: linear-gradient(135deg, #C6A962, #9a7b3c);
      color: #0a0a0a;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(198,169,98,0.3);
    }

    .tito-typing {
      display: flex;
      gap: 6px;
      padding: 16px 20px;
      align-self: flex-start;
      background: linear-gradient(145deg, #1a1a1a, #131313);
      border: 1px solid rgba(198,169,98,0.15);
      border-radius: 18px;
      border-bottom-left-radius: 4px;
    }
    .tito-typing span {
      width: 8px;
      height: 8px;
      background: #C6A962;
      border-radius: 50%;
      animation: bounce 1.4s infinite;
    }
    .tito-typing span:nth-child(2) { animation-delay: 0.15s; }
    .tito-typing span:nth-child(3) { animation-delay: 0.3s; }
    @keyframes bounce {
      0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
      30% { transform: translateY(-8px); opacity: 1; }
    }

    .tito-products-gallery {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 10px;
      margin-top: 14px;
      width: 100%;
    }
    .tito-product-card {
      background: linear-gradient(160deg, #1a1a1a, #0d0d0d) !important;
      border: 1px solid rgba(198,169,98,0.35) !important;
      border-radius: 14px !important;
      overflow: hidden !important;
      cursor: pointer !important;
      transition: all 0.3s ease !important;
      min-height: 175px !important;
      display: flex !important;
      flex-direction: column !important;
    }
    .tito-product-card:hover {
      transform: translateY(-4px) scale(1.02) !important;
      box-shadow: 0 12px 28px rgba(198,169,98,0.25) !important;
      border-color: #C6A962 !important;
    }
    .tito-product-card img {
      width: 100% !important;
      height: 100px !important;
      object-fit: cover !important;
      display: block !important;
      background: #151515 !important;
    }
    .tito-product-card .card-info {
      padding: 12px !important;
      flex: 1 !important;
      display: flex !important;
      flex-direction: column !important;
      justify-content: space-between !important;
      background: linear-gradient(180deg, #161616, #0f0f0f) !important;
    }
    .tito-product-card h4 {
      margin: 0 0 8px 0 !important;
      color: #f0f0f0 !important;
      font-size: 13px !important;
      font-weight: 600 !important;
      line-height: 1.35 !important;
      display: -webkit-box !important;
      -webkit-line-clamp: 2 !important;
      -webkit-box-orient: vertical !important;
      overflow: hidden !important;
    }
    .tito-product-card .price {
      color: #C6A962 !important;
      font-weight: 700 !important;
      font-size: 15px !important;
      letter-spacing: 0.3px !important;
    }

    #tito-input-area {
      padding: 14px 16px;
      border-top: 1px solid rgba(198,169,98,0.2);
      display: flex;
      gap: 12px;
      background: linear-gradient(180deg, #0d0d0d, #080808);
    }
    #tito-input {
      flex: 1;
      background: #151515;
      border: 1px solid rgba(198,169,98,0.25);
      border-radius: 25px;
      padding: 14px 20px;
      color: #f0f0f0;
      font-size: 15px;
      outline: none;
      transition: all 0.25s;
      font-family: 'Cormorant Garamond', Georgia, serif;
    }
    #tito-input:focus {
      border-color: #C6A962;
      box-shadow: 0 0 0 3px rgba(198,169,98,0.1);
      background: #1a1a1a;
    }
    #tito-input::placeholder { color: #555; }
    #tito-send {
      background: linear-gradient(135deg, #C6A962, #9a7b3c);
      border: none;
      width: 48px;
      height: 48px;
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.25s;
      flex-shrink: 0;
      font-size: 20px;
      color: #0a0a0a;
    }
    #tito-send:hover {
      transform: scale(1.08);
      box-shadow: 0 6px 18px rgba(198,169,98,0.45);
    }

    @media (max-width: 480px) {
      #tito-chat {
        width: calc(100vw - 20px);
        height: calc(100vh - 110px);
        bottom: 100px;
        right: 10px;
        border-radius: 20px;
      }
      #tito-bubble {
        width: 68px;
        height: 68px;
        bottom: 16px;
        right: 14px;
      }
      #tito-proactive {
        right: 14px;
        bottom: 96px;
        max-width: calc(100vw - 90px);
      }
    }
  `;

  const HTML = `
    <div id="tito-widget-container">
      <div id="tito-bubble">
        <img src="${CONFIG.AVATAR}" alt="Tito">
        <div id="tito-bubble-badge"></div>
      </div>

      <div id="tito-proactive">
        <button class="close-btn" onclick="TitoWidget.closeProactive()">&times;</button>
        <p id="tito-proactive-text"></p>
        <button class="tito-cta" id="tito-proactive-btn">Chatear con Tito</button>
      </div>

      <div id="tito-chat">
        <div id="tito-header">
          <div id="tito-header-avatar">
            <img src="${CONFIG.AVATAR}" alt="Tito">
            <div class="status-dot"></div>
          </div>
          <div id="tito-header-info">
            <h3>Tito</h3>
            <span>En linea ahora</span>
          </div>
          <button id="tito-close" onclick="TitoWidget.close()">&times;</button>
        </div>

        <div id="tito-messages"></div>

        <div id="tito-input-area">
          <input type="text" id="tito-input" placeholder="Escribi tu mensaje..." autocomplete="off">
          <button id="tito-send" aria-label="Enviar">&#10148;</button>
        </div>
      </div>
    </div>
  `;

  const TitoWidget = {
    isOpen: false,
    conversationHistory: [],
    proactiveMessage: '',
    hasShownIntro: false,
    visitorData: null,

    init() {
      const style = document.createElement('style');
      style.textContent = CSS;
      document.head.appendChild(style);

      const container = document.createElement('div');
      container.innerHTML = HTML;
      document.body.appendChild(container.firstElementChild);

      this.bindEvents();
      this.detectVisitor();
      setTimeout(() => this.showProactive(), 4000);
      console.log('Tito Widget v7.0 - Better formatting');
    },

    async detectVisitor() {
      try {
        // Detect country via IP
        const res = await fetch('https://ipapi.co/json/');
        const data = await res.json();
        this.visitorData = {
          country: data.country_name || 'Desconocido',
          countryCode: data.country_code || 'XX',
          city: data.city || '',
          currency: data.currency || 'USD',
          timezone: data.timezone || '',
          isUruguay: data.country_code === 'UY'
        };
        console.log('Visitor:', this.visitorData.country);
      } catch(e) {
        this.visitorData = { country: 'Desconocido', countryCode: 'XX', currency: 'USD', isUruguay: false };
      }
    },

    getGreeting() {
      const hour = new Date().getHours();
      if (hour >= 5 && hour < 12) return 'Buen dia';
      if (hour >= 12 && hour < 19) return 'Buenas tardes';
      return 'Buenas noches';
    },

    getIntro() {
      const greeting = this.getGreeting();
      const country = this.visitorData?.country;
      const isUruguay = this.visitorData?.isUruguay;

      if (isUruguay) {
        return greeting + '! Soy Tito. Que bueno verte por aca. En que te ayudo?';
      } else if (country && country !== 'Desconocido') {
        return greeting + '! Soy Tito. Veo que nos visitas desde ' + country + '. En que te puedo ayudar?';
      }
      return greeting + '! Soy Tito. Estoy aca para ayudarte. Que necesitas?';
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
      const intro = this.getIntro();
      this.addMessage(intro, 'bot');

      // Show country detection as system message
      if (this.visitorData && this.visitorData.country !== 'Desconocido') {
        const currencyNote = this.visitorData.isUruguay
          ? 'Te muestro precios en pesos uruguayos'
          : 'Los precios estan en USD, pero te puedo decir cuanto seria en ' + this.visitorData.currency;
        setTimeout(() => {
          this.addSystemMessage(currencyNote);
        }, 800);
      }

      setTimeout(() => this.showQuickButtons(), 400);
    },

    showQuickButtons() {
      const container = document.getElementById('tito-messages');
      const buttonsDiv = document.createElement('div');
      buttonsDiv.className = 'tito-quick-buttons';
      buttonsDiv.id = 'tito-quick-buttons';

      const options = [
        { text: 'Ayudame a elegir', msg: 'No se cual me conviene, ayudame a elegir' },
        { text: 'Ver guardianes', msg: 'Quiero ver los duendes disponibles' },
        { text: 'Como compro?', msg: 'Como es el proceso de compra?' },
        { text: 'Mi pedido', msg: 'Quiero consultar sobre mi pedido' }
      ];

      options.forEach(opt => {
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

      const greeting = this.getGreeting();
      const page = this.detectPage();
      const messages = {
        home: { text: greeting + '! Necesitas ayuda para encontrar algo?', auto: 'Hola, que duendes tenes?' },
        tienda: { text: 'Hay muchos guardianes... Te ayudo a elegir?', auto: 'Si, ayudame a elegir' },
        producto: { text: 'Tenes dudas sobre este guardian?', auto: 'Contame mas sobre este duende' },
        carrito: { text: 'Alguna duda antes de finalizar?', auto: 'Tengo una consulta' },
        checkout: { text: 'Necesitas ayuda con algo?', auto: 'Tengo una pregunta' },
        default: { text: greeting + '! Soy Tito. Te ayudo?', auto: 'Hola Tito' }
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
        }, 600);
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

    formatBotMessage(text) {
      // Format bot messages to be more readable
      let html = text;

      // Convert **bold** to <strong>
      html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');

      // Convert *italic* to <em>
      html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');

      // Convert numbered lists (1. 2. 3. etc)
      html = html.replace(/(\d+)\.\s+\*\*([^*]+)\*\*\s*[-–]\s*/g, '<div class="msg-item"><span class="msg-emoji">$1️⃣</span><span><strong>$2</strong> - ');
      html = html.replace(/(\d+)\.\s+/g, '<div class="msg-item"><span class="msg-emoji">✦</span><span>');

      // Close unclosed spans from numbered items
      const openItems = (html.match(/<div class="msg-item">/g) || []).length;
      const closeSpans = (html.match(/<\/span><\/div>/g) || []).length;
      if (openItems > closeSpans) {
        // Add closing tags at line breaks or end
        html = html.replace(/([^>])\n/g, '$1</span></div>\n');
      }

      // Convert line breaks to proper spacing
      html = html.replace(/\n\n/g, '</p><p style="margin: 12px 0;">');
      html = html.replace(/\n/g, '<br>');

      // Wrap in paragraph if not already structured
      if (!html.includes('<div') && !html.includes('<p')) {
        html = '<p style="margin: 0;">' + html + '</p>';
      }

      // Highlight prices
      html = html.replace(/\$(\d+[\d,\.]*)/g, '<span class="msg-highlight">$$$1</span>');

      // Highlight special words
      html = html.replace(/(30%|reservar|unico|especial|garantia)/gi, '<span class="msg-highlight">$1</span>');

      return html;
    },

    addMessage(text, type, productos) {
      const container = document.getElementById('tito-messages');
      const msg = document.createElement('div');
      msg.className = 'tito-msg ' + type;

      if (type === 'bot') {
        msg.innerHTML = this.formatBotMessage(text);
      } else {
        msg.textContent = text;
      }

      container.appendChild(msg);

      if (productos && productos.length > 0) {
        const gallery = document.createElement('div');
        gallery.className = 'tito-products-gallery';

        productos.forEach(p => {
          const card = document.createElement('div');
          card.className = 'tito-product-card';
          card.onclick = () => window.open(p.url || p.permalink, '_blank');

          const imgSrc = p.imagen || (p.images && p.images[0] ? p.images[0].src : null) || CONFIG.AVATAR;
          const nombre = p.nombre || p.name || 'Producto';
          let precio = p.precio || p.price || '???';

          // Format price based on visitor country
          if (this.visitorData?.isUruguay && precio !== '???') {
            const usd = parseFloat(precio);
            const uyu = Math.round(usd * 44); // Approximate rate
            precio = '$' + uyu.toLocaleString() + ' UYU';
          } else {
            precio = '$' + precio + ' USD';
          }

          card.innerHTML = '<img src="' + imgSrc + '" alt="' + nombre + '" onerror="this.src=\'' + CONFIG.AVATAR + '\'">' +
            '<div class="card-info">' +
            '<h4>' + nombre + '</h4>' +
            '<span class="price">' + precio + '</span>' +
            '</div>';
          gallery.appendChild(card);
        });

        container.appendChild(gallery);
      }

      container.scrollTop = container.scrollHeight;
    },

    addSystemMessage(text) {
      const container = document.getElementById('tito-messages');
      const msg = document.createElement('div');
      msg.className = 'tito-msg system';
      msg.textContent = text;
      container.appendChild(msg);
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
              carrito: this.getCartInfo(),
              visitante: this.visitorData
            },
            historial: this.conversationHistory.slice(-8)
          })
        });

        const data = await response.json();
        this.hideTyping();

        const respuesta = data.respuesta || data.response;
        if (respuesta) {
          this.addMessage(respuesta, 'bot', data.productos);
          this.conversationHistory.push({ role: 'assistant', content: respuesta });
        } else {
          this.addMessage('Perdon, algo fallo. Probas de nuevo?', 'bot');
        }

      } catch (error) {
        console.error('Error Tito:', error);
        this.hideTyping();
        this.addMessage('Se corto la conexion. Intenta de nuevo.', 'bot');
      }
    }
  };

  window.TitoWidget = TitoWidget;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => TitoWidget.init());
  } else {
    TitoWidget.init();
  }

})();
