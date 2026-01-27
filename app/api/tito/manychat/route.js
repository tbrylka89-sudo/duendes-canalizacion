/**
 * TITO para ManyChat - Instagram, Facebook, WhatsApp
 *
 * Usa el modelo HÍBRIDO (GPT-4o-mini + Claude Sonnet):
 * - GPT para consultas simples (rápido y barato)
 * - Claude Sonnet para situaciones importantes (pedidos, quejas, cierres)
 *
 * Mantiene el formato de respuesta ManyChat Dynamic Block v2
 */

// ═══════════════════════════════════════════════════════════════
// FORMATO MANYCHAT DYNAMIC BLOCK
// ═══════════════════════════════════════════════════════════════

function crearRespuestaTexto(texto) {
  return {
    version: 'v2',
    content: {
      messages: [
        { type: 'text', text: texto }
      ]
    }
  };
}

function crearRespuestaConGaleria(texto, productos) {
  // ManyChat Gallery/Cards format
  const cards = productos.slice(0, 10).map(p => ({
    title: p.nombre,
    subtitle: `$${p.precio_mostrar || p.precio} ${p.moneda || 'USD'}`,
    image_url: p.imagen,
    buttons: [
      {
        type: 'url',
        caption: 'Ver más',
        url: p.url || `https://duendesdeluruguay.com/?p=${p.id}`
      }
    ]
  }));

  return {
    version: 'v2',
    content: {
      messages: [
        { type: 'text', text: texto },
        {
          type: 'cards',
          elements: cards,
          image_aspect_ratio: 'square'
        }
      ]
    }
  };
}

function crearRespuestaConProducto(texto, producto) {
  return {
    version: 'v2',
    content: {
      messages: [
        { type: 'text', text: texto },
        {
          type: 'cards',
          elements: [{
            title: producto.nombre,
            subtitle: `$${producto.precio_mostrar || producto.precio} ${producto.moneda || 'USD'}`,
            image_url: producto.imagen,
            buttons: [
              {
                type: 'url',
                caption: 'Conocer más',
                url: producto.url || `https://duendesdeluruguay.com/?p=${producto.id}`
              }
            ]
          }],
          image_aspect_ratio: 'square'
        }
      ]
    }
  };
}

// ═══════════════════════════════════════════════════════════════
// HANDLER PRINCIPAL - Usa modelo híbrido (GPT + Claude)
// ═══════════════════════════════════════════════════════════════

export async function POST(request) {
  try {
    const body = await request.json();

    const {
      mensaje,
      message,
      nombre,
      first_name,
      plataforma,
      subscriber_id,
      historial,
      history,
    } = body;

    const msg = mensaje || message;
    const userName = nombre || first_name;
    const conversationHistory = historial || history || [];

    if (!msg) {
      return Response.json({
        version: 'v2',
        content: { messages: [{ type: 'text', text: '¡Hola! Soy Tito 🍀 ¿Qué andás buscando?' }] },
        respuesta: '¡Hola! Soy Tito 🍀 ¿Qué andás buscando?'
      });
    }

    // Llamar a Tito GPT (híbrido) con origen manychat
    const requestUrl = new URL(request.url);
    const baseUrl = `${requestUrl.protocol}//${requestUrl.host}`;

    const gptResponse = await fetch(`${baseUrl}/api/tito/gpt`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        mensaje: msg,
        nombre: userName,
        origen: 'manychat',
        subscriber_id,
        conversationHistory: conversationHistory.map(h => ({
          role: h.rol === 'usuario' ? 'user' : (h.role || 'assistant'),
          content: h.contenido || h.content || h.texto
        }))
      })
    });

    const gptData = await gptResponse.json();

    // Extraer respuesta y productos de v3
    const respuestaTexto = gptData.respuesta || gptData.response || 'Disculpá, tuve un problemita. ¿Podés intentar de nuevo?';
    const productos = gptData.productos || [];

    // Construir respuesta en formato ManyChat
    let respuestaManychat;

    if (productos.length > 0) {
      if (productos.length === 1) {
        respuestaManychat = crearRespuestaConProducto(respuestaTexto, productos[0]);
      } else {
        respuestaManychat = crearRespuestaConGaleria(respuestaTexto, productos);
      }
    } else {
      respuestaManychat = crearRespuestaTexto(respuestaTexto);
    }

    // Agregar metadata
    respuestaManychat.metadata = {
      success: true,
      origen: 'manychat',
      modelo: gptData.modelo || 'gpt-4o-mini',
      razon_modelo: gptData.razon_modelo || 'simple',
      productos_mostrados: productos.length,
      tools: gptData.tools || []
    };

    // También incluir respuesta simple para compatibilidad
    respuestaManychat.respuesta = respuestaTexto;
    respuestaManychat.hay_productos = productos.length > 0 ? 'si' : 'no';

    // Campos de imagen para compatibilidad con flujos antiguos de ManyChat
    if (productos.length >= 1) respuestaManychat.imagen_1 = productos[0]?.imagen || '';
    if (productos.length >= 2) respuestaManychat.imagen_2 = productos[1]?.imagen || '';
    if (productos.length >= 3) respuestaManychat.imagen_3 = productos[2]?.imagen || '';
    respuestaManychat.total_productos = productos.length;

    console.log('[TITO MANYCHAT HÍBRIDO]', {
      plataforma,
      nombre: userName,
      productos: productos.length,
      modelo: gptData.modelo || 'gpt-4o-mini',
      razon: gptData.razon_modelo
    });

    return Response.json(respuestaManychat);

  } catch (error) {
    console.error('[TITO MANYCHAT ERROR]', error);

    return Response.json({
      version: 'v2',
      content: {
        messages: [
          { type: 'text', text: "Hola! Disculpá, estoy teniendo un problemita técnico. ¿Podés escribirme de nuevo en un ratito? 🍀" }
        ]
      },
      respuesta: "Hola! Disculpá, estoy teniendo un problemita técnico. ¿Podés escribirme de nuevo en un ratito? 🍀",
      metadata: { success: false, error: error.message }
    });
  }
}

// GET para verificar
export async function GET() {
  return Response.json({
    status: 'ok',
    endpoint: 'Tito ManyChat HÍBRIDO (GPT + Claude)',
    descripcion: 'Usa GPT-4o-mini para consultas simples, Claude Sonnet para situaciones importantes',
    formato: 'ManyChat Dynamic Block v2',
    modelo: {
      simple: 'GPT-4o-mini (saludos, ver productos)',
      importante: 'Claude Sonnet (pedidos, quejas, objeciones, cierres)'
    },
    capacidades: [
      'Modelo híbrido inteligente según contexto',
      'Consulta de pedidos con país de envío correcto',
      'Mantiene formato ManyChat para compatibilidad',
      'Soporta Instagram, Facebook y WhatsApp via ManyChat'
    ],
    ejemplo_request: {
      method: 'POST',
      body: {
        mensaje: "Mostrame guardianes de protección",
        nombre: "María",
        plataforma: "instagram",
        subscriber_id: "123456"
      }
    },
    formato_respuesta: {
      descripcion: "Usa ManyChat Dynamic Block v2 para texto + galería de productos",
      campos: ['version', 'content.messages', 'respuesta', 'metadata', 'hay_productos', 'imagen_1', 'imagen_2', 'imagen_3']
    }
  });
}
