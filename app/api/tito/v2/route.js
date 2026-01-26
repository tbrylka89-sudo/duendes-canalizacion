/**
 * TITO 2.0 - EL DUENDE MAESTRO
 * Endpoint unificado para ManyChat (Instagram, Facebook, WhatsApp)
 *
 * Optimizado para timeout de 10 segundos de ManyChat
 */

import Anthropic from '@anthropic-ai/sdk';
import { kv } from '@vercel/kv';
import {
  obtenerProductosWoo,
  buscarPedido,
  formatearPedido,
  recomendarGuardianes,
  formatearPrecio,
  detectarPaisDeMensaje,
  ejemplosSeña,
  FAQ,
  INFO_EMPRESA,
  PRECIOS_URUGUAY
} from '@/lib/tito/conocimiento';
import { PERSONALIDAD_TITO, CONTEXTO_MANYCHAT } from '@/lib/tito/personalidad';
import { MANUAL_PERSUASION } from '@/lib/tito/manual-persuasion';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// ═══════════════════════════════════════════════════════════════
// DETECTORES DE INTENCIÓN
// ═══════════════════════════════════════════════════════════════

function detectarIntencion(mensaje) {
  const msg = mensaje.toLowerCase();

  return {
    // Pedidos
    preguntaPedido: /pedido|orden|env[ií]o|tracking|rastreo|compr[eé]|pagu[eé]|lleg[oó]|cu[aá]ndo llega|estado|n[uú]mero/i.test(msg),

    // Ver productos
    quiereVer: /mostr[aá]|ver|foto|im[aá]gen|tienen|disponible|cat[aá]logo|tienda/i.test(msg),

    // Recomendación
    quiereRecomendacion: /recomiend|sugier|cu[aá]l|ayud[aá]|necesito|busco|para m[ií]|no s[eé]/i.test(msg),

    // Necesidad específica
    necesidad: detectarNecesidad(msg),

    // Preguntas FAQ
    preguntaFAQ: detectarPreguntaFAQ(msg),

    // Objeción de precio
    objecionPrecio: /caro|precio|presupuesto|mucho|costoso|barato|descuento|oferta|plata|dinero/i.test(msg),

    // Se quiere ir
    quiereIrse: /gracias|chau|adi[oó]s|despu[eé]s|luego|pienso|veo/i.test(msg),

    // Nervioso/molesto
    nervioso: /preocupad|molest|enoj|urgente|problema|queja|reclamo|estafa/i.test(msg),

    // Saludo
    esSaludo: /^(hola|hey|buenas|buenos|hi|hello|ey|que tal|qué tal|buen d[ií]a)/i.test(msg),

    // Info de contacto detectada
    tieneEmail: msg.match(/[\w.-]+@[\w.-]+\.\w+/)?.[0],
    tieneNumero: msg.match(/\b\d{4,}\b/)?.[0],

    // País detectado
    paisMencionado: detectarPais(msg),

    // Pregunta por precio
    preguntaPrecio: /precio|cuánto|cuanto|cuesta|vale|cost|plata|pesos|dólares|dolares|valor/i.test(msg),

    // PIDE ESPECÍFICAMENTE EN DÓLARES
    pideEnDolares: /en d[oó]l|en usd|en us\$|dls|dolares|d[oó]lares/i.test(msg),

    // QUIERE PAGAR - MOMENTO DE CIERRE
    quierePagar: /pagar|pago|comprar|compro|lo quiero|me lo llevo|c[oó]mo pago|quiero ese|transferencia|mercado pago|tarjeta|western|moneygram|link de pago/i.test(msg),

    // Ya dio datos de contacto
    daDireccion: /calle|avenida|av\.|direcci[oó]n|vivo en|domicilio/i.test(msg),
    daTelefono: /\+?\d{7,}|tel[eé]fono|celular|whatsapp/i.test(msg)
  };
}

// Detectar país del mensaje
function detectarPais(msg) {
  const msgLower = msg.toLowerCase();

  const paises = {
    // Uruguay
    'uruguay': 'UY', 'uruguayo': 'UY', 'uruguaya': 'UY', 'montevideo': 'UY', 'piriápolis': 'UY', 'piriapolis': 'UY', 'maldonado': 'UY',
    // Argentina
    'argentina': 'AR', 'argentino': 'AR', 'argentina': 'AR', 'buenos aires': 'AR', 'cordoba': 'AR', 'rosario': 'AR', 'mendoza': 'AR',
    // México
    'méxico': 'MX', 'mexico': 'MX', 'mexicano': 'MX', 'mexicana': 'MX', 'cdmx': 'MX', 'guadalajara': 'MX', 'monterrey': 'MX',
    // Colombia
    'colombia': 'CO', 'colombiano': 'CO', 'colombiana': 'CO', 'bogotá': 'CO', 'bogota': 'CO', 'medellín': 'CO', 'medellin': 'CO', 'cali': 'CO',
    // Chile
    'chile': 'CL', 'chileno': 'CL', 'chilena': 'CL', 'santiago': 'CL', 'valparaíso': 'CL',
    // Perú
    'perú': 'PE', 'peru': 'PE', 'peruano': 'PE', 'peruana': 'PE', 'lima': 'PE',
    // Brasil
    'brasil': 'BR', 'brazil': 'BR', 'brasileño': 'BR', 'brasileña': 'BR', 'são paulo': 'BR', 'sao paulo': 'BR', 'rio': 'BR',
    // España
    'españa': 'ES', 'spain': 'ES', 'español': 'ES', 'española': 'ES', 'madrid': 'ES', 'barcelona': 'ES',
    // USA
    'estados unidos': 'US', 'usa': 'US', 'eeuu': 'US', 'united states': 'US', 'miami': 'US', 'new york': 'US', 'california': 'US', 'texas': 'US',
    // Ecuador
    'ecuador': 'EC', 'ecuatoriano': 'EC', 'ecuatoriana': 'EC', 'quito': 'EC', 'guayaquil': 'EC',
    // Venezuela
    'venezuela': 'VE', 'venezolano': 'VE', 'venezolana': 'VE', 'caracas': 'VE',
    // Panamá
    'panamá': 'PA', 'panama': 'PA', 'panameño': 'PA', 'panameña': 'PA',
    // Costa Rica
    'costa rica': 'CR', 'costarricense': 'CR', 'tico': 'CR', 'tica': 'CR', 'san josé': 'CR',
    // Guatemala
    'guatemala': 'GT', 'guatemalteco': 'GT', 'guatemalteca': 'GT',
    // República Dominicana
    'dominicana': 'DO', 'dominicano': 'DO', 'santo domingo': 'DO',
    // Bolivia
    'bolivia': 'BO', 'boliviano': 'BO', 'boliviana': 'BO', 'la paz': 'BO',
    // Paraguay
    'paraguay': 'PY', 'paraguayo': 'PY', 'paraguaya': 'PY', 'asunción': 'PY', 'asuncion': 'PY',
    // Honduras
    'honduras': 'HN', 'hondureño': 'HN', 'hondureña': 'HN', 'tegucigalpa': 'HN',
    // El Salvador
    'el salvador': 'SV', 'salvadoreño': 'SV', 'salvadoreña': 'SV',
    // Nicaragua
    'nicaragua': 'NI', 'nicaragüense': 'NI', 'managua': 'NI',
    // Puerto Rico
    'puerto rico': 'US', 'puertorriqueño': 'US', 'boricua': 'US',
  };

  for (const [palabra, codigo] of Object.entries(paises)) {
    if (msgLower.includes(palabra)) return codigo;
  }
  return null;
}

function detectarNecesidad(msg) {
  if (/protecci[oó]n|proteger|escudo|defensa|malo|negativ|miedo|peligro/i.test(msg)) return 'proteccion';
  if (/abundancia|dinero|prosperidad|trabajo|negocio|plata|riqueza|fortuna/i.test(msg)) return 'abundancia';
  if (/amor|pareja|coraz[oó]n|relaci[oó]n|soledad|solo|sola/i.test(msg)) return 'amor';
  if (/san|salud|curar|enferm|bienestar|dolor|mejor/i.test(msg)) return 'sanacion';
  if (/paz|calma|ansiedad|estr[eé]s|tranquil|nervio/i.test(msg)) return 'paz';
  if (/hogar|casa|familia|espacio/i.test(msg)) return 'hogar';
  return null;
}

function detectarPreguntaFAQ(msg) {
  if (/env[ií]o|llega|cu[aá]nto tarda|d[ií]as/i.test(msg)) return 'envios';
  if (/pago|pagar|tarjeta|transferencia|mercado pago|paypal/i.test(msg)) return 'pagos';
  if (/reserva|30%|apartado/i.test(msg)) return 'reserva';
  if (/material|hecho|porcelana|cristal/i.test(msg)) return 'materiales';
  if (/tama[ñn]o|grande|chico|medida|cm|cent[ií]metro/i.test(msg)) return 'tamanos';
  if (/garant[ií]a|roto|da[ñn]ado|devoluci[oó]n/i.test(msg)) return 'garantia';
  if (/visita|conocer|ir|piri[aá]polis/i.test(msg)) return 'visitas';
  if (/canaliza|mensaje|energ[ií]a/i.test(msg)) return 'canalizacion';
  if (/reventa|revender|mayorista|mayor|por mayor|distribu|tienda|negocio.*vender|vender.*negocio/i.test(msg)) return 'reventa';
  return null;
}

// ═══════════════════════════════════════════════════════════════
// CONSTRUIR CONTEXTO PARA CLAUDE
// ═══════════════════════════════════════════════════════════════

async function construirContexto(mensaje, intencion, datos) {
  const { nombre, plataforma, historial, subscriberId } = datos;
  let contexto = '';

  // Info del visitante
  if (nombre) contexto += `\n👤 HABLÁS CON: ${nombre}`;
  if (plataforma) contexto += ` (desde ${plataforma})`;

  // Cargar memoria si existe
  let esPrimeraInteraccion = true;
  if (subscriberId) {
    try {
      const memoria = await kv.get(`tito:mc:${subscriberId}`);
      if (memoria && memoria.interacciones > 0) {
        esPrimeraInteraccion = false;
        datos._esPrimeraInteraccion = false;

        contexto += `\n\n🔄 CONVERSACIÓN EN CURSO (interacción #${memoria.interacciones + 1})`;
        contexto += `\n⚠️ PROHIBIDO: NO te presentes de nuevo, NO digas "soy Tito", NO repitas tu historia. Ya te conoce.`;
        contexto += `\n⚠️ NO repitas su nombre en cada mensaje. Hablá directo.`;

        // País conocido
        if (memoria.pais) {
          datos._pais = memoria.pais;
          contexto += `\n🌍 PAÍS: ${memoria.pais} - Usá la moneda correcta para este país.`;
        }

        if (memoria.necesidad) contexto += `\n- Busca: ${memoria.necesidad}`;
        if (memoria.productosVistos?.length) contexto += `\n- Vio: ${memoria.productosVistos.slice(0,3).join(', ')}`;
        if (memoria.interacciones > 3 && memoria.interacciones <= 8) {
          contexto += `\n- Ya chateó ${memoria.interacciones} veces (interesada)`;
        }
        if (memoria.interacciones > 8) {
          contexto += `\n- ⚠️ LLEVA ${memoria.interacciones} MENSAJES - Está dando vueltas. Usá cierre o psicología inversa.`;
        }
        if (memoria.objecionPrecio) contexto += `\n- ⚠️ Mostró duda por precio antes`;

        // Guardar país si lo mencionó ahora
        if (intencion.paisMencionado && !memoria.pais) {
          datos._paisNuevo = intencion.paisMencionado;
        }
      } else {
        datos._esPrimeraInteraccion = true;
      }
    } catch (e) {
      datos._esPrimeraInteraccion = true;
    }
  } else {
    datos._esPrimeraInteraccion = true;
  }

  // País: detectar de memoria o del mensaje actual
  const paisFinal = datos._pais || intencion.paisMencionado;
  datos._paisFinal = paisFinal;

  // === INSTRUCCIONES CLARAS Y SIN CONFLICTO ===

  if (datos._esPrimeraInteraccion) {
    // PRIMERA VEZ: presentarse casual
    contexto += `\n\n✨ PRIMERA INTERACCIÓN:
- Presentate casual: "¡Ey! Soy Tito 🍀 ¿Cómo andás?"
- NO largues tu historia
- Solo saludá y preguntá cómo está`;
  } else {
    // YA SE CONOCEN: no presentarse
    contexto += `\n\n🔄 YA SE CONOCEN:
- NO te presentes de nuevo
- NO digas "soy Tito"
- Hablá directo, como si continuaras la charla`;
  }

  // PAÍS Y PRECIOS
  // Si pide específicamente en dólares, responder en dólares
  if (intencion.pideEnDolares) {
    contexto += `\n\n💵 PIDIÓ PRECIO EN DÓLARES - RESPONDÉ EN USD:
- Mini clásico: $70 USD
- Mini especial / Pixies: $150 USD
- Mediano especial: $200 USD
- Mediano maestros místicos: $450-600 USD (cuando hay, están en la web)
- Grande especial: $450 USD
- Grande maestros místicos: ~$800 USD (cuando hay, en la web)
- Gigante especial: $1.050 USD
- Gigante maestros místicos: hasta $2.000 USD

⚠️ La persona PIDIÓ EN DÓLARES. NO le des pesos uruguayos.`;
  } else if (paisFinal) {
    // Ya sabemos el país - dar formato de moneda
    if (paisFinal === 'UY' && !intencion.pideEnDolares) {
      // URUGUAY: Precios FIJOS en pesos uruguayos
      contexto += `\n\n💰 ES DE URUGUAY - PRECIOS EN PESOS URUGUAYOS:
${PRECIOS_URUGUAY.listaCompleta}

CUANDO HABLES DE PRECIOS:
- NO tires la lista seca. Explicá la MAGIA detrás de cada categoría.
- Preguntá primero qué busca (protección, abundancia, etc.) y recién ahí recomendá tamaño.
- Contá la diferencia entre Clásico, Especial y Maestros Místicos.
- Usá tu expertise de 847 años: "En mi experiencia..." "Los que buscan X suelen conectar con..."
- Conectá el precio con el VALOR: días de trabajo, cristales reales, pieza única.
- Si pregunta por uno específico, describí qué lo hace especial.

⚠️ SOLO pesos uruguayos. NUNCA menciones USD a uruguayos.
⚠️ YA SABÉS SU PAÍS - NO preguntes de nuevo de dónde es.`;
    } else {
      const instruccionesMoneda = {
        'AR': '\n💰 Es de ARGENTINA: USD + pesos. Ej: "$70 USD (aprox. $80.500 pesos argentinos)"',
        'MX': '\n💰 Es de MÉXICO: USD + pesos. Ej: "$70 USD (aprox. $1.400 pesos mexicanos)"',
        'CO': '\n💰 Es de COLOMBIA: USD + pesos. Ej: "$70 USD (aprox. $308.000 pesos)"',
        'CL': '\n💰 Es de CHILE: USD + pesos. Ej: "$70 USD (aprox. $70.000 pesos chilenos)"',
        'PE': '\n💰 Es de PERÚ: USD + soles. Ej: "$70 USD (aprox. S/266 soles)"',
        'BR': '\n💰 Es de BRASIL: USD + reales. Ej: "$70 USD (aprox. R$434 reales)"',
        'ES': '\n💰 Es de ESPAÑA: USD + euros. Ej: "$70 USD (aprox. €66 euros)"',
      };
      contexto += instruccionesMoneda[paisFinal] || `\n💰 País: ${paisFinal} - Precios en USD.`;
      contexto += '\n⚠️ YA SABÉS SU PAÍS - NO preguntes de nuevo de dónde es.';
    }
  } else if (intencion.preguntaPrecio) {
    // No sabemos país y pregunta precio - preguntar país
    contexto += `\n\n💰 PREGUNTA PRECIO pero NO SABÉS SU PAÍS:
- Antes de dar precio preguntá: "¿De qué país me escribís?"
- NO des precio hasta saber el país`;
  }

  // Si pregunta por pedido
  if (intencion.preguntaPedido) {
    const identificador = intencion.tieneEmail || intencion.tieneNumero;
    if (identificador) {
      const pedido = await buscarPedido(identificador);
      if (pedido) {
        const info = Array.isArray(pedido) ? formatearPedido(pedido[0]) : formatearPedido(pedido);
        if (info) {
          contexto += `\n\n📦 PEDIDO ENCONTRADO:
- Número: #${info.id}
- Estado: ${info.estado}
- Cliente: ${info.cliente}
- Productos: ${info.productos}
- Total: ${info.total}
- Fecha: ${info.fecha}
${info.tracking ? `- Tracking: ${info.tracking}` : '- Tracking: Aún no disponible'}`;
        }
      } else {
        contexto += `\n\n⚠️ No encontré pedido con "${identificador}". Pedile más datos.`;
      }
    } else {
      contexto += `\n\n📦 PREGUNTA POR PEDIDO pero no dio número ni email. Pedíselo amablemente.`;
    }
  }

  // Si quiere ver productos o recomendación
  if (intencion.quiereVer || intencion.quiereRecomendacion || intencion.necesidad) {
    const productos = await obtenerProductosWoo();
    const pais = detectarPaisDeMensaje(mensaje, datos);

    if (productos.length > 0) {
      let recomendados;
      if (intencion.necesidad) {
        recomendados = recomendarGuardianes(intencion.necesidad, productos, { limite: 6 });
      } else {
        recomendados = productos.filter(p => p.disponible).slice(0, 6);
      }

      if (recomendados.length > 0) {
        contexto += `\n\n🛡️ GUARDIANES PARA MOSTRAR:`;
        recomendados.forEach(p => {
          contexto += `\n- ${p.nombre}: ${formatearPrecio(p.precio, pais)} ${p.enOferta ? '(EN OFERTA)' : ''}`;
        });
        contexto += `\n\n💡 El sistema mostrará las fotos automáticamente. Vos enfocate en la conexión emocional.`;

        // Guardar para el response
        datos._productosParaMostrar = recomendados;
      }
    }
  }

  // Si pregunta FAQ
  if (intencion.preguntaFAQ) {
    const faqKey = intencion.preguntaFAQ;
    const faqData = FAQ[faqKey];
    if (faqData) {
      contexto += `\n\n📚 INFO PARA RESPONDER (${faqKey.toUpperCase()}):`;
      contexto += `\n${JSON.stringify(faqData, null, 2)}`;
    }
  }

  // Si tiene objeción de precio - USAR LA SEÑA
  if (intencion.objecionPrecio) {
    const paisParaSeña = paisFinal || 'US';
    contexto += `\n\n💰 OBJECIÓN DE PRECIO - HORA DE LA SEÑA:
${ejemplosSeña(paisParaSeña)}

Técnicas:
1. "¿Caro comparado con qué? ¿Con la paz mental?"
2. "Son días de trabajo artesanal, cristales reales, pieza única"
3. USÁS LA SEÑA: "Mirá, con [MONTO ESPECÍFICO] lo reservás 30 días y pagás el resto cuando puedas"
4. "Cuando se va, no vuelve. Es ahora o nunca."

SÉ ESPECÍFICO con el monto de seña. Decí el número en plata, no solo "30%".`;
  }

  // Si se quiere ir o duda - USAR LA SEÑA
  if (intencion.quiereIrse && !intencion.esSaludo) {
    const paisParaSeña = paisFinal || 'US';
    contexto += `\n\n🚨 SE QUIERE IR - USÁS LA SEÑA COMO CIERRE:
${ejemplosSeña(paisParaSeña)}

Decí algo como: "Antes de irte... con [MONTO ESPECÍFICO] lo reservás 30 días. Si no, mañana capaz ya no está."
SÉ ESPECÍFICO con el monto, no digas solo "30%".`;
  }

  // Si está nervioso
  if (intencion.nervioso) {
    contexto += `\n\n⚠️ CLIENTE NERVIOSO/MOLESTO
1. Validá: "Entiendo perfectamente"
2. Calmá: "Dejame revisar qué está pasando"
3. Si no podés resolver: "Le paso tu mensaje al equipo ahora mismo"`;
  }

  // QUIERE PAGAR - MOMENTO DE CIERRE
  if (intencion.quierePagar) {
    contexto += `\n\n💳 ¡QUIERE PAGAR! - ESTE ES TU CIERRE:

OPCIONES DE PAGO:
• EXTERIOR: Link de pago (Visa/Mastercard), Western Union, MoneyGram
• URUGUAY: Transferencia bancaria, Mercado Pago, Link de pago Handy

ANTES DE DERIVAR, PEDÍ ESTOS DATOS:
"¡Genial! Para coordinar el pago y envío necesito:
- Nombre y apellido completo
- País
- Dirección completa (calle, número, ciudad)
- Código postal
- Teléfono con código de país
- Email"

UNA VEZ QUE TENÉS LOS DATOS:
"Perfecto, te derivo con el equipo para coordinar el pago 💚"

⚠️ NO inventes datos de cuentas ni links. Solo recopilás info y derivás.
⚠️ SÉ CLARO Y DIRECTO. Nada de dar vueltas.`;
  }

  return contexto;
}

// ═══════════════════════════════════════════════════════════════
// FORMATO MANYCHAT
// ═══════════════════════════════════════════════════════════════

function crearRespuestaManychat(texto, productos = []) {
  const mensajes = [{ type: 'text', text: texto }];

  if (productos.length > 0) {
    const cards = productos.slice(0, 10).map(p => ({
      title: p.nombre,
      subtitle: `$${p.precio} USD${p.enOferta ? ' ⭐ OFERTA' : ''}`,
      image_url: p.imagen,
      buttons: [{
        type: 'url',
        caption: '💚 Ver más',
        url: p.url || `https://duendesdeluruguay.com/?p=${p.id}`
      }]
    }));

    mensajes.push({
      type: 'cards',
      elements: cards,
      image_aspect_ratio: 'square'
    });
  }

  return {
    version: 'v2',
    content: { messages: mensajes }
  };
}

// ═══════════════════════════════════════════════════════════════
// HANDLER PRINCIPAL
// ═══════════════════════════════════════════════════════════════

export async function POST(request) {
  const startTime = Date.now();

  try {
    const body = await request.json();

    // DEBUG: Imprimir TODO lo que llega de ManyChat
    console.log('[TITO v2] === REQUEST COMPLETO ===');
    console.log(JSON.stringify(body, null, 2));

    const {
      mensaje,
      message,
      nombre,
      first_name,
      plataforma,
      platform,
      subscriber_id,
      historial,
      history
    } = body;

    const msg = mensaje || message || '';
    const userName = nombre || first_name || '';
    const platform_ = plataforma || platform || 'instagram';
    const subscriberId = subscriber_id;
    const conversationHistory = (historial && historial.length > 0) ? historial : (history || []);

    // DEBUG: Ver valores parseados
    console.log('[TITO v2] Parseado:', {
      mensaje: msg,
      nombre: userName,
      subscriberId: subscriberId || 'NO HAY SUBSCRIBER_ID!!!',
      historialLength: conversationHistory.length
    });

    // Si mensaje vacío, saludo casual
    if (!msg.trim()) {
      return Response.json(crearRespuestaManychat(
        `¡Ey${userName ? ' ' + userName : ''}! Soy Tito 🍀\n\n¿Cómo andás?`
      ));
    }

    // Detectar intención
    const intencion = detectarIntencion(msg);

    // Datos para contexto
    const datos = {
      nombre: userName,
      plataforma: platform_,
      subscriberId,
      historial: conversationHistory,
      _productosParaMostrar: []
    };

    // Construir contexto (con timeout protection)
    let contexto = '';
    try {
      const contextoPromise = construirContexto(msg, intencion, datos);
      contexto = await Promise.race([
        contextoPromise,
        new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout contexto')), 4000))
      ]);
    } catch (e) {
      console.log('[TITO v2] Contexto timeout, continuando sin contexto completo');
    }

    // Verificar tiempo antes de llamar a Claude
    if (Date.now() - startTime > 6000) {
      console.log('[TITO v2] Timeout prevention - respuesta rápida');

      // Respuesta de emergencia inteligente según intención
      if (intencion.esSaludo) {
        return Response.json(crearRespuestaManychat(
          `¡Ey${userName ? ' ' + userName : ''}! ✨\n\n¿Qué andás buscando? ¿Protección, abundancia, amor...?`,
          datos._productosParaMostrar
        ));
      }

      if (datos._productosParaMostrar?.length > 0) {
        return Response.json(crearRespuestaManychat(
          `Mirá estos guardianes... ¿Cuál te llama? 💚`,
          datos._productosParaMostrar
        ));
      }

      return Response.json(crearRespuestaManychat(
        `Dame un segundito que me trabé 😅\n\n¿Podés repetirme qué necesitás?`
      ));
    }

    // Construir historial para Claude
    const mensajesParaClaude = [];

    if (conversationHistory.length > 0) {
      conversationHistory.slice(-6).forEach(h => {
        mensajesParaClaude.push({
          role: h.role === 'assistant' || h.rol === 'asistente' ? 'assistant' : 'user',
          content: h.content || h.contenido
        });
      });
    }

    mensajesParaClaude.push({ role: 'user', content: msg });

    // System prompt con instrucción específica según contexto
    let instruccionFinal = '';

    // Determinar si ya conocemos el país (de memoria O del mensaje actual)
    const paisConocido = datos._paisFinal || intencion.paisMencionado;
    const yaPreguntoPais = paisConocido !== null && paisConocido !== undefined;

    // DEBUG: Agregar log para ver qué está pasando
    console.log('[TITO v2] Estado:', {
      esPrimeraInteraccion: datos._esPrimeraInteraccion,
      paisFinal: datos._paisFinal,
      paisMencionado: intencion.paisMencionado,
      paisConocido,
      yaPreguntoPais,
      subscriberId
    });

    if (datos._esPrimeraInteraccion && !yaPreguntoPais) {
      // Primera vez Y no sabemos país - saludo simple
      instruccionFinal = `=== INSTRUCCIÓN ÚNICA ===
Decí EXACTAMENTE: "¡Ey! Soy Tito 🍀 ¿Cómo andás?"
NADA MÁS. NO agregues preguntas sobre país. NO cuentes tu historia.`;
    } else if (datos._esPrimeraInteraccion && yaPreguntoPais) {
      // Primera vez PERO ya sabemos país (lo dijo en el mensaje)
      instruccionFinal = `=== INSTRUCCIÓN ÚNICA ===
El usuario es de ${paisConocido}. YA SABÉS SU PAÍS.
Saludá breve y respondé a lo que dice. NO preguntes de dónde es.
Máximo 3 oraciones cortas.`;
    } else if (!datos._esPrimeraInteraccion && yaPreguntoPais) {
      // Ya se conocen Y ya sabemos país
      instruccionFinal = `=== INSTRUCCIÓN ÚNICA ===
PROHIBIDO: presentarte, decir "soy Tito", preguntar de dónde es.
Ya se conocen. Ya sabés que es de ${paisConocido}.
Respondé DIRECTO a lo que pregunta. Máximo 3 oraciones.`;
    } else {
      // Ya se conocen pero no sabemos país
      instruccionFinal = `=== INSTRUCCIÓN ÚNICA ===
PROHIBIDO: presentarte o decir "soy Tito" (ya te conoce).
Si pregunta precios, ahí sí preguntá: "¿De qué país me escribís?"
Respondé directo. Máximo 3 oraciones.`;
    }

    const systemPrompt = `${PERSONALIDAD_TITO}

${MANUAL_PERSUASION}

${CONTEXTO_MANYCHAT}

${contexto}

${instruccionFinal}`;

    // Llamar a Claude
    const response = await anthropic.messages.create({
      model: 'claude-3-5-haiku-20241022',
      max_tokens: 300,
      system: systemPrompt,
      messages: mensajesParaClaude
    });

    const textoRespuesta = response.content[0].text;

    // Guardar memoria Y HISTORIAL DE CONVERSACIÓN
    if (subscriberId) {
      try {
        const memoriaExistente = await kv.get(`tito:mc:${subscriberId}`) || {};

        // Prioridad para país: mensaje actual > mensaje anterior guardado
        const paisParaGuardar = intencion.paisMencionado || datos._paisNuevo || memoriaExistente.pais;

        // Guardar mensaje en historial
        const historialExistente = memoriaExistente.historial || [];
        const nuevoMensaje = {
          timestamp: new Date().toISOString(),
          usuario: msg,
          tito: textoRespuesta,
          intencion: {
            necesidad: intencion.necesidad,
            preguntaPrecio: intencion.preguntaPrecio,
            quiereIrse: intencion.quiereIrse,
            objecionPrecio: intencion.objecionPrecio
          }
        };

        const nuevaMemoria = {
          ...memoriaExistente,
          ultimaInteraccion: new Date().toISOString(),
          interacciones: (memoriaExistente.interacciones || 0) + 1,
          nombre: userName || memoriaExistente.nombre,
          necesidad: intencion.necesidad || memoriaExistente.necesidad,
          objecionPrecio: intencion.objecionPrecio || memoriaExistente.objecionPrecio,
          pais: paisParaGuardar,
          // Guardar últimos 20 mensajes del historial
          historial: [...historialExistente, nuevoMensaje].slice(-20)
        };

        if (datos._productosParaMostrar?.length) {
          nuevaMemoria.productosVistos = [
            ...datos._productosParaMostrar.map(p => p.nombre),
            ...(memoriaExistente.productosVistos || [])
          ].slice(0, 10);
        }

        await kv.set(`tito:mc:${subscriberId}`, nuevaMemoria, { ex: 30 * 24 * 60 * 60 }); // 30 días

        console.log('[TITO v2] Conversación guardada:', {
          subscriberId,
          interacciones: nuevaMemoria.interacciones,
          pais: nuevaMemoria.pais,
          ultimoMensaje: msg.substring(0, 50)
        });
      } catch (e) {
        console.error('[TITO v2] Error guardando memoria:', e);
      }
    } else {
      console.warn('[TITO v2] Sin subscriber_id - no se puede guardar memoria');
    }

    // LOG GLOBAL para diagnóstico (últimas 100 conversaciones)
    try {
      const logGlobal = await kv.get('tito:log:global') || [];
      logGlobal.push({
        timestamp: new Date().toISOString(),
        subscriberId: subscriberId || 'anon',
        nombre: userName,
        mensaje: msg,
        respuesta: textoRespuesta.substring(0, 200),
        pais: paisConocido
      });
      await kv.set('tito:log:global', logGlobal.slice(-100), { ex: 7 * 24 * 60 * 60 }); // 7 días
    } catch (e) {
      // No falla si el log global falla
    }

    console.log('[TITO v2]', {
      tiempo: Date.now() - startTime,
      plataforma: platform_,
      intencion: intencion.necesidad || (intencion.quiereVer ? 'ver' : 'chat'),
      productos: datos._productosParaMostrar?.length || 0
    });

    return Response.json(crearRespuestaManychat(textoRespuesta, datos._productosParaMostrar));

  } catch (error) {
    console.error('[TITO v2] Error:', error);

    return Response.json(crearRespuestaManychat(
      `Uy, se me cruzaron los cables 😅\n\n¿Podés escribirme de nuevo? Si sigue fallando, escribí al WhatsApp: +598 98 690 629`
    ));
  }
}

// ═══════════════════════════════════════════════════════════════
// GET - STATUS, DEBUG Y VER CONVERSACIONES
// ═══════════════════════════════════════════════════════════════

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const subscriberId = searchParams.get('subscriber_id');
  const clearMemory = searchParams.get('clear');
  const verLog = searchParams.get('log');
  const verTodas = searchParams.get('todas');

  // VER TODAS LAS CONVERSACIONES RECIENTES
  if (verTodas === 'true' || verLog === 'global') {
    try {
      const logGlobal = await kv.get('tito:log:global') || [];
      return Response.json({
        status: 'log_global',
        total: logGlobal.length,
        conversaciones: logGlobal.reverse() // Más recientes primero
      });
    } catch (e) {
      return Response.json({ status: 'error', error: e.message });
    }
  }

  // Si piden ver/limpiar memoria de un subscriber
  if (subscriberId) {
    try {
      if (clearMemory === 'true') {
        await kv.del(`tito:mc:${subscriberId}`);
        return Response.json({
          status: 'memoria_borrada',
          subscriber_id: subscriberId
        });
      }

      const memoria = await kv.get(`tito:mc:${subscriberId}`);

      if (memoria && memoria.historial) {
        // Formatear historial para lectura fácil
        const historialFormateado = memoria.historial.map(h => ({
          fecha: h.timestamp,
          cliente: h.usuario,
          tito: h.tito
        }));

        return Response.json({
          status: 'conversacion_completa',
          subscriber_id: subscriberId,
          nombre: memoria.nombre,
          pais: memoria.pais,
          interacciones: memoria.interacciones,
          historial: historialFormateado
        });
      }

      return Response.json({
        status: 'debug_memoria',
        subscriber_id: subscriberId,
        memoria: memoria || 'NO HAY MEMORIA GUARDADA',
        kv_key: `tito:mc:${subscriberId}`
      });
    } catch (e) {
      return Response.json({
        status: 'error_kv',
        error: e.message,
        subscriber_id: subscriberId
      });
    }
  }

  let productosTest = [];
  try {
    productosTest = await obtenerProductosWoo();
  } catch (e) {}

  return Response.json({
    status: 'ok',
    version: 'TITO 2.0 - El Duende Maestro',
    capacidades: [
      'Personalidad de duende experto en neuroventas',
      'Conocimiento completo de productos WooCommerce',
      'Búsqueda de pedidos por número/email',
      'Recomendación inteligente de guardianes',
      'Memoria de conversaciones',
      'FAQ integrado',
      'Manejo de objeciones',
      'Formato ManyChat Dynamic Block'
    ],
    productos_cargados: productosTest.length,
    debug: {
      ver_todas_conversaciones: '/api/tito/v2?todas=true',
      ver_conversacion_especifica: '/api/tito/v2?subscriber_id=ID_DEL_CLIENTE',
      borrar_memoria: '/api/tito/v2?subscriber_id=ID&clear=true'
    },
    ejemplo_uso: {
      method: 'POST',
      body: {
        mensaje: 'Hola, busco un duende de protección',
        nombre: 'María',
        plataforma: 'instagram',
        subscriber_id: 'abc123'
      }
    }
  });
}
