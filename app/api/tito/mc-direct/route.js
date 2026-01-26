/**
 * TITO MC-DIRECT - Envía mensajes DIRECTAMENTE a ManyChat
 *
 * En lugar de devolver el contenido para que ManyChat lo procese,
 * este endpoint ENVÍA el mensaje directamente usando la API de ManyChat.
 * Así las cards con imágenes se muestran correctamente.
 */

import Anthropic from '@anthropic-ai/sdk';
import { kv } from '@vercel/kv';
import {
  obtenerProductosWoo,
  recomendarGuardianes,
  formatearPrecio,
  FAQ,
  PRECIOS_URUGUAY
} from '@/lib/tito/conocimiento';
import { PERSONALIDAD_TITO, CONTEXTO_MANYCHAT } from '@/lib/tito/personalidad';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const MANYCHAT_API_KEY = process.env.MANYCHAT_API_KEY;
const MANYCHAT_API_URL = 'https://api.manychat.com/fb';

// ═══════════════════════════════════════════════════════════════
// ENVIAR MENSAJE DIRECTO A MANYCHAT
// ═══════════════════════════════════════════════════════════════

async function enviarMensajeManychat(subscriberId, contenido) {
  if (!MANYCHAT_API_KEY) {
    console.error('[MC-DIRECT] No hay MANYCHAT_API_KEY configurada');
    return false;
  }

  try {
    const response = await fetch(`${MANYCHAT_API_URL}/sending/sendContent`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${MANYCHAT_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        subscriber_id: subscriberId,
        data: contenido
      })
    });

    const result = await response.json();

    if (result.status === 'success') {
      console.log('[MC-DIRECT] Mensaje enviado correctamente');
      return true;
    } else {
      console.error('[MC-DIRECT] Error enviando:', result);
      return false;
    }
  } catch (error) {
    console.error('[MC-DIRECT] Error en fetch:', error);
    return false;
  }
}

// ═══════════════════════════════════════════════════════════════
// DETECTORES DE INTENCIÓN (MEJORADOS)
// ═══════════════════════════════════════════════════════════════

function detectarIntencion(mensaje) {
  const msg = mensaje.toLowerCase();

  // NUEVO: Detectar si QUIERE COMPRAR (nuevo cliente)
  const quiereComprar = /quiero comprar|cómo compro|como compro|quiero pagar|cómo pago|como pago|me lo llevo|lo quiero|quiero uno|quiero ese|quiero una|quiero esa|lo compro|la compro|me interesa comprar|quiero adquirir/i.test(msg);

  // DIFERENTE: Pregunta por pedido EXISTENTE (ya compró)
  const preguntaPedidoExistente = /mi pedido|mi orden|ya (pagué|pague|compré|compre)|cuándo llega|cuando llega|estado de mi|tracking|rastreo|número de seguimiento|no me llegó|no me llego|dónde está mi/i.test(msg);

  return {
    // NUEVO: Quiere comprar algo nuevo
    quiereComprar,

    // Pregunta por pedido que YA HIZO
    preguntaPedidoExistente,

    // Ver productos
    quiereVer: /mostr[aá]|ver|foto|im[aá]gen|tienen|disponible|cat[aá]logo|tienda|enseñ/i.test(msg),

    // Recomendación
    quiereRecomendacion: /recomiend|sugier|cu[aá]l.*sirve|ayud[aá].*elegir|necesito|busco|para m[ií]|no s[eé] cu[aá]l/i.test(msg),

    // Necesidad específica
    necesidad: detectarNecesidad(msg),

    // Preguntas FAQ
    preguntaFAQ: detectarPreguntaFAQ(msg),

    // Objeción de precio
    objecionPrecio: /caro|precio|mucho|costoso|barato|descuento|no me alcanza/i.test(msg) && !/cuánto|cuanto|cuesta/.test(msg),

    // Se quiere ir
    quiereIrse: /gracias.*luego|chau|adiós|después veo|lo pienso|voy a pensar/i.test(msg),

    // Nervioso/molesto
    nervioso: /preocupad|molest|enoj|urgente|problema|queja|reclamo|estafa/i.test(msg),

    // Saludo simple
    esSaludo: /^(hola|hey|buenas|buenos|hi|hello|ey|qué tal|que tal|buen día)[\s!?.]*$/i.test(msg.trim()),

    // Pregunta por precio
    preguntaPrecio: /cuánto|cuanto|cuesta|vale|precio|valor/i.test(msg),

    // País mencionado
    paisMencionado: detectarPais(msg),

    // Info de contacto
    tieneEmail: msg.match(/[\w.-]+@[\w.-]+\.\w+/)?.[0],
    tieneNumero: msg.match(/\b\d{5,}\b/)?.[0],
  };
}

function detectarPais(msg) {
  const paises = {
    'uruguay': 'UY', 'uruguayo': 'UY', 'montevideo': 'UY', 'piriápolis': 'UY',
    'argentina': 'AR', 'argentino': 'AR', 'buenos aires': 'AR',
    'méxico': 'MX', 'mexico': 'MX', 'mexicano': 'MX',
    'colombia': 'CO', 'colombiano': 'CO', 'bogotá': 'CO',
    'chile': 'CL', 'chileno': 'CL', 'santiago': 'CL',
    'perú': 'PE', 'peru': 'PE', 'peruano': 'PE', 'lima': 'PE',
    'brasil': 'BR', 'brasileño': 'BR',
    'españa': 'ES', 'español': 'ES',
    'estados unidos': 'US', 'usa': 'US', 'miami': 'US',
    'ecuador': 'EC', 'venezuela': 'VE', 'panamá': 'PA',
  };

  const msgLower = msg.toLowerCase();
  for (const [palabra, codigo] of Object.entries(paises)) {
    if (msgLower.includes(palabra)) return codigo;
  }
  return null;
}

function detectarNecesidad(msg) {
  if (/protecci[oó]n|proteger|escudo|malo|negativ|miedo/i.test(msg)) return 'proteccion';
  if (/abundancia|dinero|prosperidad|trabajo|negocio|plata/i.test(msg)) return 'abundancia';
  if (/amor|pareja|coraz[oó]n|relaci[oó]n|soledad/i.test(msg)) return 'amor';
  if (/san|salud|curar|bienestar/i.test(msg)) return 'sanacion';
  if (/paz|calma|ansiedad|tranquil/i.test(msg)) return 'paz';
  if (/hogar|casa|familia/i.test(msg)) return 'hogar';
  return null;
}

function detectarPreguntaFAQ(msg) {
  if (/env[ií]o|llega|cu[aá]nto tarda/i.test(msg)) return 'envios';
  if (/tama[ñn]o|grande|chico|medida|cm/i.test(msg)) return 'tamanos';
  if (/material|hecho|porcelana|cristal/i.test(msg)) return 'materiales';
  if (/reserva|30%|apartado/i.test(msg)) return 'reserva';
  if (/garant[ií]a|roto|devoluci[oó]n/i.test(msg)) return 'garantia';
  if (/visita|conocer|ir.*piri/i.test(msg)) return 'visitas';
  return null;
}

// ═══════════════════════════════════════════════════════════════
// CONSTRUIR CONTEXTO PARA CLAUDE
// ═══════════════════════════════════════════════════════════════

async function construirContexto(mensaje, intencion, datos) {
  const { nombre, subscriberId } = datos;
  let contexto = '';

  if (nombre) contexto += `\n👤 Cliente: ${nombre}`;

  // Cargar memoria
  let memoria = null;
  if (subscriberId) {
    try {
      memoria = await kv.get(`tito:mc:${subscriberId}`);
    } catch (e) {}
  }

  const esPrimeraVez = !memoria || memoria.interacciones === 0;
  const pais = intencion.paisMencionado || memoria?.pais;
  datos._pais = pais;
  datos._esPrimeraVez = esPrimeraVez;

  if (esPrimeraVez) {
    contexto += `\n\n✨ PRIMERA VEZ - Saludá casual y breve.`;
  } else {
    contexto += `\n\n🔄 YA SE CONOCEN (interacción #${memoria.interacciones + 1})`;
    contexto += `\n⚠️ NO te presentes. NO digas "soy Tito". Hablá directo.`;
    if (memoria.necesidad) contexto += `\n- Busca: ${memoria.necesidad}`;
  }

  // === QUIERE COMPRAR (NUEVO CLIENTE) ===
  if (intencion.quiereComprar) {
    contexto += `\n\n💳 ¡QUIERE COMPRAR! - MOMENTO DE CIERRE:

1. Preguntá qué guardián le gustó (si no lo dijo)
2. Pedí sus datos para el envío:
   "¡Genial! Para coordinar necesito:
   - Nombre completo
   - País
   - Dirección completa
   - Código postal
   - Teléfono con código de país
   - Email"
3. "Perfecto, te paso con el equipo para coordinar el pago 💚"

⚠️ NO pidas número de pedido - es cliente NUEVO que quiere comprar.
⚠️ NO confundas con consulta de pedido existente.`;
  }

  // === PREGUNTA POR PEDIDO EXISTENTE ===
  if (intencion.preguntaPedidoExistente && !intencion.quiereComprar) {
    contexto += `\n\n📦 CONSULTA DE PEDIDO EXISTENTE:
- Pedí número de pedido O email para buscar
- "¿Me pasás tu número de pedido o el email con que compraste?"
- Si tienen el dato, buscá en el sistema`;
  }

  // === VER PRODUCTOS ===
  if (intencion.quiereVer || intencion.quiereRecomendacion || intencion.necesidad) {
    const productos = await obtenerProductosWoo();

    if (productos.length > 0) {
      let recomendados;
      if (intencion.necesidad) {
        recomendados = recomendarGuardianes(intencion.necesidad, productos, { limite: 6 });
      } else {
        recomendados = productos.filter(p => p.disponible).slice(0, 6);
      }

      if (recomendados.length > 0) {
        datos._productos = recomendados;
        contexto += `\n\n🛡️ GUARDIANES DISPONIBLES:`;
        recomendados.forEach(p => {
          contexto += `\n- ${p.nombre}: $${p.precio} USD`;
        });
        contexto += `\n\n💡 Las fotos se mostrarán automáticamente. Enfocate en conectar emocionalmente.`;
      }
    }
  }

  // === PRECIOS ===
  if (intencion.preguntaPrecio && pais === 'UY') {
    contexto += `\n\n💰 ES DE URUGUAY - PRECIOS EN PESOS:
${PRECIOS_URUGUAY.listaCompleta}`;
  } else if (intencion.preguntaPrecio && !pais) {
    contexto += `\n\n💰 PREGUNTA PRECIO - Preguntá: "¿De qué país me escribís?"`;
  }

  // === OBJECIÓN PRECIO ===
  if (intencion.objecionPrecio) {
    contexto += `\n\n💰 OBJECIÓN DE PRECIO - USÁS LA SEÑA:
"Mirá, con solo [30% del precio] lo reservás 30 días y pagás el resto cuando puedas."
Ej: Mini $70 → Seña $21 USD`;
  }

  return contexto;
}

// ═══════════════════════════════════════════════════════════════
// CREAR CONTENIDO PARA MANYCHAT
// ═══════════════════════════════════════════════════════════════

function crearContenidoManychat(texto, productos = []) {
  const messages = [{ type: 'text', text: texto }];

  if (productos.length > 0) {
    const cards = productos.slice(0, 10).map(p => ({
      title: p.nombre.substring(0, 80),
      subtitle: `$${p.precio} USD`,
      image_url: p.imagen,
      action_url: p.url || `https://duendesdeluruguay.com/?p=${p.id}`,
      buttons: [{
        type: 'url',
        caption: '💚 Ver más',
        url: p.url || `https://duendesdeluruguay.com/?p=${p.id}`
      }]
    }));

    messages.push({
      type: 'cards',
      elements: cards,
      image_aspect_ratio: 'square'
    });
  }

  return { version: 'v2', content: { messages } };
}

// ═══════════════════════════════════════════════════════════════
// HANDLER PRINCIPAL
// ═══════════════════════════════════════════════════════════════

export async function POST(request) {
  const startTime = Date.now();

  try {
    const body = await request.json();

    console.log('[MC-DIRECT] Request:', JSON.stringify(body, null, 2));

    const {
      mensaje,
      message,
      nombre,
      first_name,
      subscriber_id,
      contact,  // Full Contact Data de ManyChat
      plataforma
    } = body;

    const msg = mensaje || message || '';
    // Extraer nombre de contact si existe
    const userName = nombre || first_name || contact?.first_name || contact?.name || '';
    // Extraer subscriber_id de contact si existe
    const subscriberId = subscriber_id || contact?.id || contact?.subscriber_id;

    // Validar subscriber_id
    if (!subscriberId) {
      console.error('[MC-DIRECT] No hay subscriber_id');
      return Response.json({
        version: 'v2',
        content: {
          messages: [{ type: 'text', text: '¡Ey! 🍀 ¿En qué te puedo ayudar?' }]
        }
      });
    }

    // Mensaje vacío = saludo
    if (!msg.trim()) {
      const saludo = `¡Ey${userName ? ' ' + userName : ''}! Soy Tito 🍀\n\n¿Qué andás buscando?`;

      // Enviar directo
      const contenido = crearContenidoManychat(saludo);
      await enviarMensajeManychat(subscriberId, contenido);

      return Response.json({ status: 'sent', method: 'direct' });
    }

    // Detectar intención
    const intencion = detectarIntencion(msg);

    console.log('[MC-DIRECT] Intención:', {
      quiereComprar: intencion.quiereComprar,
      preguntaPedidoExistente: intencion.preguntaPedidoExistente,
      quiereVer: intencion.quiereVer,
      necesidad: intencion.necesidad
    });

    // Datos
    const datos = {
      nombre: userName,
      subscriberId,
      plataforma,
      _productos: []
    };

    // Construir contexto
    const contexto = await construirContexto(msg, intencion, datos);

    // System prompt
    const systemPrompt = `${PERSONALIDAD_TITO}

${CONTEXTO_MANYCHAT}

${contexto}

=== INSTRUCCIÓN FINAL ===
- Mensajes CORTOS (2-3 oraciones máximo)
- 1-2 emojis máximo
- Respondé DIRECTO a lo que pregunta
- Si quiere comprar, pedí datos. NO pidas número de pedido a cliente nuevo.
- Si pregunta por pedido existente, ahí sí pedí número o email.`;

    // Llamar a Claude
    const response = await anthropic.messages.create({
      model: 'claude-3-5-haiku-20241022',
      max_tokens: 300,
      system: systemPrompt,
      messages: [{ role: 'user', content: msg }]
    });

    const textoRespuesta = response.content[0].text;

    // Crear contenido con productos si hay
    const contenido = crearContenidoManychat(textoRespuesta, datos._productos);

    // INTENTAR ENVIAR DIRECTO A MANYCHAT
    let enviado = false;
    if (subscriberId) {
      enviado = await enviarMensajeManychat(subscriberId, contenido);
    }

    // Guardar memoria
    if (subscriberId) {
      try {
        const memoriaExistente = await kv.get(`tito:mc:${subscriberId}`) || {};
        const nuevaMemoria = {
          ...memoriaExistente,
          ultimaInteraccion: new Date().toISOString(),
          interacciones: (memoriaExistente.interacciones || 0) + 1,
          nombre: userName || memoriaExistente.nombre,
          necesidad: intencion.necesidad || memoriaExistente.necesidad,
          pais: intencion.paisMencionado || memoriaExistente.pais,
        };
        await kv.set(`tito:mc:${subscriberId}`, nuevaMemoria, { ex: 30 * 24 * 60 * 60 });
      } catch (e) {
        console.error('[MC-DIRECT] Error guardando memoria:', e);
      }
    }

    console.log('[MC-DIRECT] Completado:', {
      tiempo: Date.now() - startTime,
      enviado,
      productos: datos._productos?.length || 0
    });

    // Extraer URLs de imágenes de los productos para mapeo en ManyChat
    const productos = datos._productos || [];
    const imagenes = {
      imagen_1: productos[0]?.imagen || '',
      imagen_2: productos[1]?.imagen || '',
      imagen_3: productos[2]?.imagen || '',
      nombre_1: productos[0]?.nombre || '',
      nombre_2: productos[1]?.nombre || '',
      nombre_3: productos[2]?.nombre || '',
      precio_1: productos[0] ? `$${productos[0].precio} USD` : '',
      precio_2: productos[1] ? `$${productos[1].precio} USD` : '',
      precio_3: productos[2] ? `$${productos[2].precio} USD` : '',
      url_1: productos[0]?.url || '',
      url_2: productos[1]?.url || '',
      url_3: productos[2]?.url || '',
      // ManyChat solo mapea campos Text, así que usamos "si"/"no" en vez de true/false
      tiene_productos: productos.length > 0 ? 'si' : 'no',
      hay_productos: productos.length > 0 ? 'si' : 'no'
    };

    // Devolver respuesta con campos separados para ManyChat
    return Response.json({
      ...contenido,
      respuesta: textoRespuesta,
      ...imagenes,
      total_productos: productos.length,
      _debug: {
        enviado_directo: enviado,
        subscriber_id: subscriberId
      }
    });

  } catch (error) {
    console.error('[MC-DIRECT] Error:', error);

    return Response.json({
      version: 'v2',
      content: {
        messages: [{
          type: 'text',
          text: 'Uy, tuve un problemita 😅 ¿Podés escribirme de nuevo?'
        }]
      }
    });
  }
}

export async function GET() {
  return Response.json({
    status: 'ok',
    endpoint: 'TITO MC-DIRECT',
    descripcion: 'Envía mensajes directamente a ManyChat vía API',
    requiere: {
      env: 'MANYCHAT_API_KEY debe estar configurada',
      body: {
        mensaje: 'string',
        nombre: 'string (opcional)',
        subscriber_id: 'string (REQUERIDO para envío directo)'
      }
    }
  });
}
