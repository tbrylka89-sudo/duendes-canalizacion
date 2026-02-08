/**
 * MANYCHAT UNIFIED ENDPOINT
 * Handles all ManyChat automations for Instagram, Facebook, WhatsApp
 *
 * Flows:
 * - comment_to_dm: User commented a keyword on a post
 * - welcome: New follower/subscriber
 * - faq: Quick FAQ responses
 * - chat: Full Tito conversation (redirects to /api/tito/v3)
 */

export const runtime = 'edge';

// FAQ responses for quick answers
const FAQ_RESPONSES = {
  envios: `📦 *ENVÍOS*

🇺🇾 Uruguay: 3-7 días por DAC ($350-$450)
🌎 Internacional: 5-10 días por DHL Express

Envío GRATIS:
• Uruguay: +$10.000
• Internacional: +USD$1000

¿Alguna otra duda? 🍀`,

  pagos: `💳 *MEDIOS DE PAGO*

🇺🇾 Uruguay:
• MercadoPago (tarjetas, transferencia)
• Transferencia bancaria
• Abitab / RedPagos

🌎 Internacional:
• Visa, MasterCard, American Express

⚠️ Por ahora no tenemos PayPal

¿Te ayudo con algo más? 🍀`,

  precios: `💰 *PRECIOS*

Los guardianes van desde $70 USD (minis) hasta $1050 USD (gigantes).

🇺🇾 Si sos de Uruguay, tenemos precios en pesos:
• Minis: desde $2.500
• Medianos: $8.000
• Grandes: $16.500

¿Querés que te muestre algunos guardianes? 🍀`,

  canalizacion: `🔮 *LA CANALIZACIÓN*

Cuando adoptás un guardián, recibís:
1. Tu guardián único (nunca hay dos iguales)
2. Carta canalizada personal - un mensaje escrito especialmente para vos
3. Certificado de autenticidad
4. Guía de activación

La carta la escribe Thibisay conectándose con tu guardián. Es única e irrepetible.

¿Querés conocer a los guardianes disponibles? 🍀`,

  materiales: `✨ *MATERIALES*

Cada guardián está hecho con:
• Porcelana fría profesional
• Cristales REALES (amatista, cuarzo rosa, citrino, etc.)
• Ropa de tela cosida a mano
• Pintura acrílica de alta calidad
• Mucho amor artesanal 🍀

Son 100% hechos a mano, sin moldes. Por eso cada uno es único.

¿Te muestro algunos? 🍀`
};

// Welcome messages by channel
const WELCOME_MESSAGES = {
  instagram: `✨ ¡Bienvenido/a al refugio de los Duendes del Uruguay!

Soy Tito, el duende que cuida este lugar. Cada guardián que creamos tiene alma propia y está buscando a la persona correcta.

¿Qué te trajo hasta acá?
1️⃣ Quiero ver guardianes
2️⃣ Busco protección
3️⃣ Busco abundancia
4️⃣ Tengo una pregunta`,

  facebook: `✨ ¡Bienvenido/a a Duendes del Uruguay!

Soy Tito 🍀 Acá creamos guardianes únicos, hechos a mano con cristales reales.

¿En qué te puedo ayudar?
1️⃣ Ver guardianes disponibles
2️⃣ Preguntar por precios
3️⃣ Consultar sobre un pedido`,

  whatsapp: `✨ *Bienvenido/a a Duendes del Uruguay*

Soy Tito, el duende que cuida este refugio 🍀

¿Qué andás buscando?

1. 📦 Envíos y precios
2. 🔮 Cómo funciona la canalización
3. 💳 Medios de pago
4. 🛒 Ver catálogo
5. 💬 Hablar con nosotros

_Escribí el número de la opción_`
};

// Comment-to-DM triggers
const COMMENT_TRIGGERS = {
  magia: {
    response: `✨ ¡Hola! Vi que comentaste MAGIA en el post.

Parece que algo te llamó la atención... Los guardianes tienen eso, llaman a quien los necesita.

¿Querés que te cuente más sobre el guardián del video? ¿O preferís que te muestre otros disponibles? 🍀`,
    action: 'show_guardian'
  },
  quiero: {
    response: `🍀 ¡Ey! Vi tu comentario.

¿Estás interesado/a en ese guardián? Te cuento: cada uno es único, cuando se va no vuelve a existir.

¿Querés que te pase más info? ¿O preferís verlo en la tienda?`,
    action: 'show_guardian'
  },
  precio: {
    response: `💰 ¡Hola! Vi que preguntaste por el precio.

Los guardianes van desde $70 USD (minis) hasta $1050 USD (gigantes).

¿De qué país sos? Así te paso el precio exacto en tu moneda 🍀`,
    action: 'ask_country'
  },
  info: {
    response: `✨ ¡Hola! Vi que querés más info.

Cada guardián es único, hecho 100% a mano con cristales reales. Cuando lo adoptás, recibís una carta canalizada personal.

¿Qué te gustaría saber? 🍀`,
    action: 'general'
  }
};

export async function POST(request) {
  try {
    const body = await request.json();

    const {
      flow,           // 'comment_to_dm' | 'welcome' | 'faq' | 'chat'
      channel,        // 'instagram' | 'facebook' | 'whatsapp'
      trigger,        // For comment_to_dm: the keyword that triggered
      comment_text,   // For comment_to_dm: full comment text
      faq_topic,      // For faq: 'envios' | 'pagos' | 'precios' | etc
      mensaje,        // For chat: user message
      subscriber_id,
      first_name,
      last_input_text
    } = body;

    const userName = first_name || 'amigo/a';
    const effectiveChannel = channel || 'instagram';

    console.log('[ManyChat]', { flow, channel: effectiveChannel, trigger, faq_topic });

    // Handle different flows
    switch (flow) {
      // ═══════════════════════════════════════════════════════════════
      // COMMENT TO DM
      // ═══════════════════════════════════════════════════════════════
      case 'comment_to_dm': {
        const triggerLower = (trigger || comment_text || '').toLowerCase();

        // Find matching trigger
        let response = null;
        for (const [keyword, config] of Object.entries(COMMENT_TRIGGERS)) {
          if (triggerLower.includes(keyword)) {
            response = config.response.replace('{nombre}', userName);
            break;
          }
        }

        // Default response if no trigger matched
        if (!response) {
          response = `✨ ¡Hola ${userName}! Vi tu comentario.

Los guardianes tienen algo especial... llaman a quien los necesita.

¿Querés que te muestre algunos disponibles? 🍀`;
        }

        return Response.json({
          respuesta_tito: response,
          flow: 'comment_to_dm',
          trigger: triggerLower
        });
      }

      // ═══════════════════════════════════════════════════════════════
      // WELCOME - New follower/subscriber
      // ═══════════════════════════════════════════════════════════════
      case 'welcome': {
        let welcomeMsg = WELCOME_MESSAGES[effectiveChannel] || WELCOME_MESSAGES.instagram;

        // Personalize with name
        if (userName && userName !== 'amigo/a') {
          welcomeMsg = welcomeMsg.replace('¡Bienvenido/a', `¡Bienvenido/a ${userName}`);
        }

        return Response.json({
          respuesta_tito: welcomeMsg,
          flow: 'welcome',
          channel: effectiveChannel
        });
      }

      // ═══════════════════════════════════════════════════════════════
      // FAQ - Quick responses
      // ═══════════════════════════════════════════════════════════════
      case 'faq': {
        const topic = (faq_topic || last_input_text || '').toLowerCase();

        // Find matching FAQ
        let faqResponse = null;
        for (const [key, response] of Object.entries(FAQ_RESPONSES)) {
          if (topic.includes(key)) {
            faqResponse = response;
            break;
          }
        }

        // Also check for number responses (menu selection)
        if (!faqResponse) {
          if (topic === '1' || topic.includes('envio')) faqResponse = FAQ_RESPONSES.envios;
          else if (topic === '2' || topic.includes('canaliza')) faqResponse = FAQ_RESPONSES.canalizacion;
          else if (topic === '3' || topic.includes('pago')) faqResponse = FAQ_RESPONSES.pagos;
          else if (topic === '4' || topic.includes('precio')) faqResponse = FAQ_RESPONSES.precios;
          else if (topic === '5' || topic.includes('material')) faqResponse = FAQ_RESPONSES.materiales;
        }

        if (faqResponse) {
          return Response.json({
            respuesta_tito: faqResponse,
            flow: 'faq',
            topic: topic
          });
        }

        // No FAQ match - redirect to Tito
        return Response.json({
          respuesta_tito: `Mmm, no tengo esa info a mano. ¿Querés que te ayude con algo específico? 🍀

1️⃣ Ver guardianes
2️⃣ Preguntas sobre envíos
3️⃣ Hablar con el equipo`,
          flow: 'faq',
          topic: 'unknown'
        });
      }

      // ═══════════════════════════════════════════════════════════════
      // CHAT - Full Tito conversation (proxy to /api/tito/v3)
      // ═══════════════════════════════════════════════════════════════
      case 'chat':
      default: {
        // Forward to Tito v3
        const titoResponse = await fetch(new URL('/api/tito/v3', request.url), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            mensaje: mensaje || last_input_text || 'hola',
            subscriber_id,
            nombre: first_name,
            canal: effectiveChannel
          })
        });

        const titoData = await titoResponse.json();

        return Response.json({
          respuesta_tito: titoData.respuesta || titoData.error || 'Error conectando con Tito',
          productos: titoData.productos || [],
          flow: 'chat'
        });
      }
    }

  } catch (error) {
    console.error('[ManyChat] Error:', error);

    return Response.json({
      respuesta_tito: '¡Uy! Algo falló. Probá de nuevo o escribinos al WhatsApp: wa.me/59898690629 🍀',
      error: error.message
    });
  }
}

export async function GET() {
  return Response.json({
    status: 'ok',
    endpoint: 'ManyChat Unified API - Duendes del Uruguay',
    flows: ['comment_to_dm', 'welcome', 'faq', 'chat'],
    channels: ['instagram', 'facebook', 'whatsapp'],
    faq_topics: Object.keys(FAQ_RESPONSES),
    usage: {
      method: 'POST',
      body: {
        flow: 'comment_to_dm | welcome | faq | chat',
        channel: 'instagram | facebook | whatsapp',
        trigger: '(for comment_to_dm) keyword that triggered',
        faq_topic: '(for faq) topic to answer',
        mensaje: '(for chat) user message'
      }
    }
  });
}
