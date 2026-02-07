/**
 * MENÚ DE BIENVENIDA WHATSAPP - Duendes del Uruguay
 *
 * Endpoint para ManyChat que maneja el flujo de bienvenida de WhatsApp
 * con menú de opciones y respuestas automáticas.
 *
 * URL: /api/whatsapp/bienvenida
 */

export const runtime = 'edge';

// ═══════════════════════════════════════════════════════════════
// CONTENIDO DEL MENÚ
// ═══════════════════════════════════════════════════════════════

const CONTENIDO = {
  bienvenida: {
    texto: `✨ *Bienvenido/a al refugio de los Duendes del Uruguay* ✨

Cada guardián que creamos tiene alma propia, una historia que contar, y está buscando a la persona correcta para acompañarla.

¿En qué puedo ayudarte hoy?`,
    opciones: [
      { id: '1', emoji: '📦', texto: 'Envíos y precios' },
      { id: '2', emoji: '🔮', texto: 'Cómo funciona la canalización' },
      { id: '3', emoji: '💳', texto: 'Medios de pago' },
      { id: '4', emoji: '🛒', texto: 'Ver catálogo' },
      { id: '5', emoji: '💬', texto: 'Hablar con nosotros' }
    ]
  },

  envios: {
    texto: `📦 *ENVÍOS Y PRECIOS*

🇺🇾 *Uruguay:*
• Montevideo: $350 (24-48hs)
• Interior: $450 (48-72hs)
• *Gratis en compras mayores a $10.000*

🌎 *Internacional (DHL Express):*
• Argentina: USD $45 (5-7 días)
• México: USD $55 (5-7 días)
• España: USD $60 (5-7 días)
• USA: USD $50 (5-7 días)
• *Envío gratis en compras mayores a USD $1000*

Todos los envíos incluyen seguimiento y van protegidos con magia extra ✨`,
    volver: true
  },

  canalizacion: {
    texto: `🔮 *LA CANALIZACIÓN*

Cuando adoptás un guardián, recibís mucho más que una figura artesanal.

*1️⃣* Elegís tu guardián (o él te elige a vos)

*2️⃣* Completás un breve formulario para que tu guardián te conozca

*3️⃣* Thibisay, nuestra canalizadora, se conecta con tu guardián y escribe SU mensaje para vos

*4️⃣* Recibís tu guardián en casa junto con:
   • Carta canalizada personal
   • Certificado de autenticidad
   • Guía de activación

Cada canalización es única e irrepetible, escrita especialmente para vos.

¿Querés conocer a los guardianes disponibles? 👇`,
    botonUrl: {
      texto: '🛒 Ver guardianes',
      url: 'https://www.duendesdeluruguay.com/tienda-magica/'
    },
    volver: true
  },

  pagos: {
    texto: `💳 *MEDIOS DE PAGO*

🇺🇾 *Desde Uruguay:*
• MercadoPago (tarjetas, transferencia)
• Transferencia bancaria directa
• Abitab / RedPagos

🌎 *Desde el exterior:*
• PayPal
• Tarjeta de crédito internacional
• Western Union

Todos los pagos son seguros y procesados al momento de la compra.

¿Alguna duda sobre pagos? 💬`,
    volver: true
  },

  catalogo: {
    texto: `🛒 *CATÁLOGO*

Visitá nuestra tienda mágica para conocer a todos los guardianes disponibles.

Cada uno es único e irrepetible. Cuando se van, desaparecen para siempre... ✨`,
    botonUrl: {
      texto: '🛒 Ver tienda mágica',
      url: 'https://www.duendesdeluruguay.com/tienda-magica/'
    },
    volver: true
  },

  humano: {
    texto: `💬 *HABLAR CON NOSOTROS*

Si preferís hablar con una persona, tocá el botón de abajo para chatear directamente con nuestro equipo.

Respondemos lo más rápido posible 🍀`,
    botonUrl: {
      texto: '💬 Chatear ahora',
      url: 'https://wa.me/59898690629'
    },
    volver: true
  }
};

// ═══════════════════════════════════════════════════════════════
// DETECTAR INTENCIÓN
// ═══════════════════════════════════════════════════════════════

function detectarIntencion(mensaje) {
  const msg = mensaje.toLowerCase().trim();

  // Menú principal
  if (/^(hola|hi|hello|buenas|buen[ao]s?|hey|ola|menu|menú|inicio|empezar|comenzar|ayuda|help|\?)$/i.test(msg)) {
    return 'bienvenida';
  }

  // Opciones numéricas
  if (msg === '1' || /env[ií]o|precio|costo|cuanto|cuánto|shipping/i.test(msg)) {
    return 'envios';
  }

  if (msg === '2' || /canaliza|carta|mensaje|como funciona|cómo funciona/i.test(msg)) {
    return 'canalizacion';
  }

  if (msg === '3' || /pago|pagar|tarjeta|mercadopago|paypal|transferencia/i.test(msg)) {
    return 'pagos';
  }

  if (msg === '4' || /cat[aá]logo|tienda|ver|producto|guardi[aá]n|duende/i.test(msg)) {
    return 'catalogo';
  }

  if (msg === '5' || /humano|persona|hablar|chat|ayuda personal/i.test(msg)) {
    return 'humano';
  }

  // Volver
  if (/volver|atr[aá]s|back|menu|menú/i.test(msg)) {
    return 'bienvenida';
  }

  // Default: mostrar menú
  return 'bienvenida';
}

// ═══════════════════════════════════════════════════════════════
// CREAR RESPUESTA MANYCHAT
// ═══════════════════════════════════════════════════════════════

function crearRespuesta(intencion) {
  const contenido = CONTENIDO[intencion] || CONTENIDO.bienvenida;
  const messages = [];

  // Mensaje principal
  messages.push({
    type: 'text',
    text: contenido.texto
  });

  // Si tiene opciones de menú (solo bienvenida)
  if (contenido.opciones) {
    // WhatsApp permite hasta 3 botones, así que usamos lista o botones
    // Formato: texto con opciones numeradas
    const opcionesTexto = contenido.opciones
      .map(op => `${op.id}. ${op.emoji} ${op.texto}`)
      .join('\n');

    messages.push({
      type: 'text',
      text: `Escribí el número de la opción:\n\n${opcionesTexto}`
    });
  }

  // Si tiene botón URL
  if (contenido.botonUrl) {
    messages.push({
      type: 'text',
      text: `👉 ${contenido.botonUrl.url}`
    });
  }

  // Si tiene opción de volver
  if (contenido.volver) {
    messages.push({
      type: 'text',
      text: `\n_Escribí "menu" para volver al inicio_`
    });
  }

  return {
    version: 'v2',
    content: {
      messages: messages
    },
    // Campos adicionales para compatibilidad
    respuesta: contenido.texto,
    intencion: intencion
  };
}

// ═══════════════════════════════════════════════════════════════
// HANDLERS
// ═══════════════════════════════════════════════════════════════

export async function POST(request) {
  try {
    const body = await request.json();

    const {
      mensaje,
      message,
      last_input_text,
      nombre,
      first_name,
      subscriber_id
    } = body;

    const msg = mensaje || message || last_input_text || '';
    const userName = nombre || first_name || 'amigo/a';

    console.log('[WHATSAPP BIENVENIDA]', {
      mensaje: msg,
      nombre: userName,
      subscriber_id
    });

    // Detectar intención
    const intencion = detectarIntencion(msg);

    // Crear respuesta
    const respuesta = crearRespuesta(intencion);

    // Personalizar con nombre si es bienvenida
    if (intencion === 'bienvenida' && userName && userName !== 'amigo/a') {
      respuesta.content.messages[0].text = respuesta.content.messages[0].text.replace(
        'Bienvenido/a',
        `Bienvenido/a ${userName}`
      );
    }

    return Response.json(respuesta);

  } catch (error) {
    console.error('[WHATSAPP BIENVENIDA ERROR]', error);

    return Response.json({
      version: 'v2',
      content: {
        messages: [
          {
            type: 'text',
            text: '✨ ¡Hola! Soy el asistente de Duendes del Uruguay. Escribí "menu" para ver las opciones disponibles.'
          }
        ]
      }
    });
  }
}

export async function GET() {
  return Response.json({
    status: 'ok',
    endpoint: 'WhatsApp Bienvenida - Duendes del Uruguay',
    descripcion: 'Menú de bienvenida para WhatsApp via ManyChat',
    uso: {
      metodo: 'POST',
      body: {
        mensaje: 'texto del usuario',
        nombre: 'nombre del usuario (opcional)',
        subscriber_id: 'ID de ManyChat (opcional)'
      }
    },
    opciones: Object.keys(CONTENIDO),
    ejemplo: {
      request: { mensaje: 'hola', nombre: 'María' },
      trigger: 'Cualquier mensaje activa el menú'
    }
  });
}
