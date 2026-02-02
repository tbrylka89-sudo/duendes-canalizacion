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
import {
  detectarCrisis, detectarInsulto, detectarSpam, detectarDespedida,
  detectarSinDinero, detectarDesahogo, detectarTrolling, detectarIdioma,
  detectarPreguntaRepetida, tieneSeñalDeCompra
} from '@/lib/tito/reglas-comportamiento';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const MANYCHAT_API_KEY = process.env.MANYCHAT_API_KEY;
const MANYCHAT_API_URL = 'https://api.manychat.com/fb';

// Mapeo de números del video a guardianes
// Cada número corresponde a un guardián específico en la web
const VIDEO_NUMEROS_GUARDIANES = {
  '5':   { nombre: 'Micelio', buscar: ['micelio'] },
  '7':   { nombre: 'Axel',    buscar: ['axel'] },
  '9':   { nombre: 'Felix',   buscar: ['felix'] },
  '11':  { nombre: 'Moonstone', buscar: ['moonstone', 'agustina'] },
  '33':  { nombre: 'Stan',    buscar: ['stan'] },
  '44':  { nombre: 'Finnian', buscar: ['finnian'] },
  '222': { nombre: 'Ruth',    buscar: ['ruth'] },
};

/**
 * Detecta si el mensaje menciona un número del video
 * Devuelve el guardián correspondiente o null
 */
function detectarNumeroVideo(msg) {
  const msgLower = msg.toLowerCase().trim();
  // Orden: primero los de más dígitos para evitar que "22" matchee antes que "222"
  const numeros = ['222', '44', '33', '11', '9', '7', '5'];
  for (const num of numeros) {
    // Matchear: "5", "el 5", "número 5", "elegí el 5", "el numero 5", solo el número, etc.
    const regex = new RegExp(`(?:^|\\b|el\\s+|número\\s+|numero\\s+)${num}(?:\\b|$)`);
    if (regex.test(msgLower)) {
      return { numero: num, ...VIDEO_NUMEROS_GUARDIANES[num] };
    }
  }
  return null;
}

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
      // Siempre usar recomendarGuardianes() para diversidad de precios + shuffle
      recomendados = recomendarGuardianes(intencion.necesidad || null, productos, { limite: 6 });

      if (recomendados.length > 0) {
        datos._productos = recomendados;
        contexto += `\n\n🛡️ GUARDIANES DISPONIBLES:`;
        recomendados.forEach(p => {
          const cat = (p.categorias || []).join(', ');
          const desc = (p.descripcion || '').substring(0, 200).trim();
          contexto += `\n\n• ${p.nombre} — $${p.precio} USD`;
          if (cat) contexto += `\n  Categoría: ${cat}`;
          if (desc) contexto += `\n  ${desc}`;
        });
        contexto += `\n\n💡 Las fotos se mostrarán automáticamente. Usá la descripción real de cada guardián para hablar con conocimiento. NO inventes datos. Conectá emocionalmente.`;
      }
    }
  }

  // === BÚSQUEDA POR NÚMERO DEL VIDEO ===
  // Si mencionan un número del video, buscar el guardián correspondiente
  const guardianVideo = detectarNumeroVideo(mensaje);
  if (guardianVideo && (!datos._productos || datos._productos.length === 0)) {
    try {
      const productos = await obtenerProductosWoo();
      // Buscar por cualquiera de los nombres asociados (nombre o slug)
      const encontrado = productos.find(p => {
        const pNombre = (p.nombre || '').toLowerCase();
        const pSlug = (p.slug || '').toLowerCase();
        return guardianVideo.buscar.some(term =>
          pNombre.includes(term) || pSlug.includes(term)
        );
      });
      if (encontrado) {
        datos._productos = [encontrado];
        const cat = (encontrado.categorias || []).join(', ');
        const desc = (encontrado.descripcion || '').substring(0, 400).trim();
        contexto += `\n\n🎬 GUARDIÁN DEL VIDEO #${guardianVideo.numero}: ${encontrado.nombre} — $${encontrado.precio} USD`;
        if (cat) contexto += `\n  Categoría: ${cat}`;
        if (desc) contexto += `\n  ${desc}`;
        contexto += `\n\n💡 Esta persona eligió este guardián en el video. Hablale específicamente de ${encontrado.nombre}: su historia, su energía, por qué la eligió. Guiala a adoptarlo.`;
      } else {
        contexto += `\n\n🎬 La persona eligió el número ${guardianVideo.numero} (guardián: ${guardianVideo.nombre}) en el video. Hablale de ${guardianVideo.nombre} y guiala a la tienda.`;
      }
    } catch (e) {
      console.error('[MC-DIRECT] Error búsqueda guardián video:', e.message);
    }
  }

  // === BÚSQUEDA POR NOMBRE DE GUARDIÁN ===
  // Si no se cargaron productos, buscar si mencionan un guardián por nombre
  if (!datos._productos || datos._productos.length === 0) {
    try {
      const productos = await obtenerProductosWoo();
      const msgLower = mensaje.toLowerCase();
      // Solo buscar guardianes reales (excluir runas, altares, círculos)
      const guardianes = productos.filter(p =>
        p.precio >= 40 && p.precio <= 2000 &&
        !/(runa|altar|círculo|circulo|paquete)/i.test(p.nombre)
      );
      const mencionado = guardianes.find(p => {
        const nombre = (p.nombre || '').split(/\s*-\s*/)[0].toLowerCase().trim();
        return nombre.length >= 3 && msgLower.includes(nombre);
      });
      if (mencionado) {
        datos._productos = [mencionado];
        const cat = (mencionado.categorias || []).join(', ');
        const desc = (mencionado.descripcion || '').substring(0, 400).trim();
        contexto += `\n\n🛡️ GUARDIÁN MENCIONADO: ${mencionado.nombre} — $${mencionado.precio} USD`;
        if (cat) contexto += `\n  Categoría: ${cat}`;
        if (desc) contexto += `\n  ${desc}`;
        contexto += `\n\n💡 Usá la descripción REAL de arriba. NO inventes datos sobre este guardián. Si no tenés info, decí lo que sí sabés.`;
      }
    } catch (e) {
      console.error('[MC-DIRECT] Error búsqueda nombre:', e.message);
    }
  }

  // === PRECIOS URUGUAY ===
  // Si es de Uruguay, buscar productos en historial si no hay cargados
  if (pais === 'UY' && (!datos._productos || datos._productos.length === 0)) {
    try {
      const productos = await obtenerProductosWoo();
      const historialTexto = (datos._historial || []).map(m => m.content || '').join(' ');
      // Buscar guardianes mencionados en el historial (por nombre en cards/mensajes previos)
      const mencionados = productos.filter(p => {
        const nombre = (p.nombre || '').toLowerCase();
        return nombre.length >= 3 && historialTexto.toLowerCase().includes(nombre);
      });
      if (mencionados.length > 0) {
        datos._productos = mencionados;
      }
    } catch (e) {}
  }

  if (pais === 'UY' && datos._productos && datos._productos.length > 0) {
    const preciosUY = datos._productos.map(p => {
      const pesos = PRECIOS_URUGUAY.convertir(p.precio);
      return `• ${p.nombre}: $${pesos.toLocaleString('es-UY')} pesos`;
    }).join('\n');
    contexto += `\n\n🇺🇾 URUGUAY - PRECIOS FIJOS EN PESOS:
${preciosUY}
⚠️ Usá EXACTAMENTE estos precios. NO conviertas USD a pesos.`;
  } else if (pais === 'UY') {
    contexto += `\n\n🇺🇾 URUGUAY - Precios fijos en pesos:
Hasta $75 USD → $2.500 | Hasta $160 → $5.500 | Hasta $210 → $8.000
Hasta $350 → $12.500 | Hasta $500 → $16.500 | Hasta $700 → $24.500 | Más → $39.800`;
  } else if (pais && pais !== 'UY') {
    contexto += `\n\n💰 PRECIOS SOLO EN USD. NUNCA conviertas a moneda local.
Si preguntan en su moneda → "Podés ver el precio en tu moneda en la tienda: https://duendesdeluruguay.com/shop/ 🍀"`;
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
      subtitle: `$${p.precio} USD${p.subtitulo ? ' · ' + p.subtitulo : ''}`,
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
// SESIÓN Y HISTORIAL EN KV
// ═══════════════════════════════════════════════════════════════

async function guardarSesionMC(subscriberId, state) {
  if (!subscriberId || !state) return;
  try {
    state.ultimaActividad = Date.now();
    await kv.set(`tito:sesion:mc:${subscriberId}`, state, { ex: 7200 }); // 2h TTL
  } catch (e) {}
}

async function cargarHistorial(subscriberId) {
  if (!subscriberId) return [];
  try {
    return (await kv.get(`tito:mc:historial:${subscriberId}`)) || [];
  } catch (e) {
    return [];
  }
}

async function guardarHistorial(subscriberId, historial) {
  if (!subscriberId) return;
  try {
    const ultimos = historial.slice(-10); // máx 10 mensajes (5 exchanges)
    await kv.set(`tito:mc:historial:${subscriberId}`, ultimos, { ex: 86400 }); // 24h TTL
  } catch (e) {}
}

async function enviarRespuestaRapida(subscriberId, texto, historial, method) {
  // Guardar en historial
  historial.push({ role: 'assistant', content: texto });
  await guardarHistorial(subscriberId, historial);

  // Enviar a ManyChat
  const contenido = crearContenidoManychat(texto);
  await enviarMensajeManychat(subscriberId, contenido);
  return Response.json({ status: 'sent', method });
}

// ═══════════════════════════════════════════════════════════════
// FILTRO PRE-API MC: Reglas de comportamiento (mismas que v3)
// ═══════════════════════════════════════════════════════════════

async function filtroPreAPIMC(msg, historial, subscriberId) {
  const msgLower = msg.toLowerCase().trim();
  const tieneHistorial = historial.length > 1;

  // Cargar o crear estado de sesión
  let sessionState;
  try {
    sessionState = await kv.get(`tito:sesion:mc:${subscriberId}`);
    if (!sessionState) {
      sessionState = {
        contadorSinDinero: 0,
        contadorDesahogo: 0,
        contadorInsultos: 0,
        contadorTrolling: 0,
        contadorMensajes: 0,
        contadorSinProgreso: 0,
        preguntasHechas: [],
        idiomaDetectado: null,
        bloqueado: false,
        ultimaActividad: Date.now()
      };
    }
  } catch (e) {
    sessionState = null;
  }

  // Si está bloqueado (insultos reiterados), no responder
  if (sessionState?.bloqueado) {
    return { interceptado: true, respuesta: '🍀', razon: 'bloqueado' };
  }

  // ── 0) CONTEXTO: No filtrar respuestas a preguntas de Tito ──
  if (historial.length > 0) {
    const ultimoBot = [...historial].reverse().find(m => m.role === 'assistant');
    if (ultimoBot) {
      const textoBot = (ultimoBot.content || '').toLowerCase();

      // A) Tito pidió datos → dejar pasar todo
      const pideDatos = /n[uú]mero de pedido|n[uú]mero de orden|tu (n[uú]mero|email|nombre|mail|correo)|pas[aá]me (el|tu)|decime (tu|el)|necesito (tu|el|que me)|con qu[eé] (nombre|email|mail)|datos del pedido/i.test(textoBot);
      if (pideDatos) {
        if (sessionState) { sessionState.contadorMensajes++; await guardarSesionMC(subscriberId, sessionState); }
        return { interceptado: false };
      }

      // B) Tito hizo pregunta u oferta → afirmativos no son spam
      const titoHizoPregunta = /\?/.test(ultimoBot.content || '');
      const titoOfreció = /te muestro|quer[eé]s (ver|que)|te cuento|te interesa|te gustaria|te gustaría|mostrar(te|los)|ayudan con eso/i.test(textoBot);
      const esAfirmativo = /^(s[ií]|si+|ok|dale|bueno|va|vamos|claro|por favor|porfa|obvio|seguro|manda|mostr[aá]|quer[ií]a|quiero|me interesa|por supuesto)[\s!.]*$/i.test(msgLower);
      if ((titoHizoPregunta || titoOfreció) && esAfirmativo) {
        if (sessionState) { sessionState.contadorMensajes++; sessionState.contadorSinProgreso = 0; await guardarSesionMC(subscriberId, sessionState); }
        return { interceptado: false };
      }

      // C) Mensaje corto en conversación activa → no es spam, es respuesta contextual
      if (msgLower.length < 3) {
        if (sessionState) { sessionState.contadorMensajes++; await guardarSesionMC(subscriberId, sessionState); }
        return { interceptado: false };
      }
    }
  }

  // ── REGLA 1: CRISIS ──
  const crisis = detectarCrisis(msg);
  if (crisis.detectado) {
    if (sessionState) await guardarSesionMC(subscriberId, sessionState);
    return { interceptado: true, respuesta: crisis.respuesta, razon: 'crisis' };
  }

  // ── REGLA 2: INSULTOS ──
  const insulto = detectarInsulto(msg);
  if (insulto.detectado) {
    if (sessionState) {
      sessionState.contadorInsultos = (sessionState.contadorInsultos || 0) + 1;
      if (sessionState.contadorInsultos >= 2) {
        sessionState.bloqueado = true;
        await guardarSesionMC(subscriberId, sessionState);
        return {
          interceptado: true,
          respuesta: 'Mirá, así no podemos charlar. Si algún día te interesa un guardián, acá voy a estar. ¡Chau! 🍀',
          razon: 'insulto_reiterado'
        };
      }
      await guardarSesionMC(subscriberId, sessionState);
    }
    return {
      interceptado: true,
      respuesta: 'Ey, tranqui. No estoy para eso. Si querés saber de guardianes, preguntame 🍀',
      razon: 'insulto'
    };
  }

  // ── REGLA 3: SPAM ──
  const spam = detectarSpam(msg);
  if (spam.detectado) {
    if (sessionState) await guardarSesionMC(subscriberId, sessionState);
    return {
      interceptado: true,
      respuesta: '¡Que la magia te acompañe! 🍀 Si algún día sentís el llamado de un guardián, acá estoy.',
      razon: 'spam'
    };
  }

  // ── REGLA 4: DESPEDIDA ──
  const despedida = detectarDespedida(msg, tieneHistorial);
  if (despedida.detectado) {
    if (sessionState) await guardarSesionMC(subscriberId, sessionState);
    return {
      interceptado: true,
      respuesta: '¡Chau! Que la magia te acompañe 🍀 Si algún día sentís el llamado de un guardián, acá voy a estar.',
      razon: 'despedida'
    };
  }

  // ── REGLA 5: SALUDOS SIMPLES (solo inicio) ──
  if (/^(hola|buenas?|buenos d[ií]as|buenas tardes|buenas noches|hey|ey|hi|hello|que tal|qué tal)[\s!?.]*$/i.test(msgLower) && historial.length <= 1) {
    if (sessionState) { sessionState.contadorMensajes++; await guardarSesionMC(subscriberId, sessionState); }
    return {
      interceptado: true,
      respuesta: '¡Ey! ¿Qué andás buscando? 🍀',
      razon: 'saludo'
    };
  }

  // ── REGLA 6: TROLLING ──
  const troll = detectarTrolling(msg);
  if (troll.detectado) {
    if (sessionState) {
      sessionState.contadorTrolling = (sessionState.contadorTrolling || 0) + 1;
      if (sessionState.contadorTrolling >= 3) {
        sessionState.bloqueado = true;
      }
      await guardarSesionMC(subscriberId, sessionState);
    }
    return { interceptado: true, respuesta: '🍀', razon: 'trolling' };
  }

  // ── REGLA 7: SIN DINERO (progresivo) ──
  const sinDinero = detectarSinDinero(msg);
  if (sinDinero.detectado && sessionState) {
    sessionState.contadorSinDinero = (sessionState.contadorSinDinero || 0) + 1;
    sessionState.contadorMensajes++;
    await guardarSesionMC(subscriberId, sessionState);

    if (sessionState.contadorSinDinero === 1) {
      return {
        interceptado: true,
        respuesta: '¡Hay guardianes desde $70 USD! Y tenemos 3x2: llevás 2 y te regalamos 1 mini. ¿Querés que te muestre los más accesibles?',
        razon: 'sin_dinero'
      };
    } else if (sessionState.contadorSinDinero === 2) {
      return {
        interceptado: true,
        respuesta: 'Entiendo, no es el momento. Te dejo el test para cuando puedas: https://duendesdeluruguay.com/descubri-que-duende-te-elige/ 🍀 ¡Nos vemos!',
        razon: 'sin_dinero_final'
      };
    }
  } else if (sinDinero.detectado && !sessionState) {
    return {
      interceptado: true,
      respuesta: '¡Hay guardianes desde $70 USD! Y tenemos 3x2: llevás 2 y te regalamos 1 mini. ¿Querés que te muestre los más accesibles?',
      razon: 'sin_dinero'
    };
  }

  // ── REGLA 8: DESAHOGO (progresivo) ──
  const desahogo = detectarDesahogo(msg);
  if (desahogo.detectado && sessionState) {
    sessionState.contadorDesahogo = (sessionState.contadorDesahogo || 0) + 1;
    sessionState.contadorMensajes++;
    await guardarSesionMC(subscriberId, sessionState);

    if (sessionState.contadorDesahogo === 1) {
      return {
        interceptado: true,
        respuesta: 'Te escucho 💚 A veces un guardián puede ser ese compañero silencioso que acompaña en momentos difíciles. ¿Querés que te muestre algunos?',
        razon: 'desahogo'
      };
    } else if (sessionState.contadorDesahogo === 2) {
      return {
        interceptado: true,
        respuesta: 'Ojalá las cosas mejoren pronto. Te dejo el test para cuando estés lista/o: https://duendesdeluruguay.com/descubri-que-duende-te-elige/ 🍀 Cuidate mucho.',
        razon: 'desahogo_final'
      };
    }
  } else if (desahogo.detectado && !sessionState) {
    return {
      interceptado: true,
      respuesta: 'Te escucho 💚 A veces un guardián puede ser ese compañero silencioso que acompaña en momentos difíciles. Si querés, te muestro algunos que ayudan con eso.',
      razon: 'desahogo'
    };
  }

  // ── REGLA 9: IDIOMA (en/pt) - solo primera vez ──
  const idioma = detectarIdioma(msg);
  if (idioma.idioma && idioma.idioma !== 'es') {
    const yaDetectado = sessionState?.idiomaDetectado;
    if (sessionState) {
      sessionState.idiomaDetectado = idioma.idioma;
      sessionState.contadorMensajes++;
      await guardarSesionMC(subscriberId, sessionState);
    }
    if (!yaDetectado) {
      if (idioma.idioma === 'en') {
        return {
          interceptado: true,
          respuesta: 'Hey! We ship worldwide 🌎 Check our store: https://duendesdeluruguay.com/shop/ — Feel free to ask me anything in English!',
          razon: 'idioma_en'
        };
      }
      if (idioma.idioma === 'pt') {
        return {
          interceptado: true,
          respuesta: 'Oi! Enviamos para o mundo todo 🌎 Veja nossa loja: https://duendesdeluruguay.com/shop/ — Pode me perguntar em português!',
          razon: 'idioma_pt'
        };
      }
    }
  }

  // ── REGLA 10: PREGUNTA REPETIDA ──
  if (sessionState && sessionState.preguntasHechas.length > 0) {
    const repetida = detectarPreguntaRepetida(msg, sessionState.preguntasHechas);
    if (repetida.detectado) {
      sessionState.contadorMensajes++;
      await guardarSesionMC(subscriberId, sessionState);
      return {
        interceptado: true,
        respuesta: '¡Eso ya te lo conté! 😄 ¿Hay algo más que quieras saber?',
        razon: 'repetida'
      };
    }
  }

  // ── REGLA 11: MAX EXCHANGES SIN PROGRESO (5+ msgs) ──
  if (sessionState) {
    sessionState.contadorMensajes++;

    if (tieneSeñalDeCompra(msg)) {
      sessionState.contadorSinProgreso = 0;
    } else {
      sessionState.contadorSinProgreso = (sessionState.contadorSinProgreso || 0) + 1;
    }

    // Guardar pregunta para detección de repetidas (máx 5)
    if (msg.length > 5) {
      sessionState.preguntasHechas.push(msg);
      if (sessionState.preguntasHechas.length > 5) {
        sessionState.preguntasHechas = sessionState.preguntasHechas.slice(-5);
      }
    }

    if (sessionState.contadorSinProgreso >= 5) {
      await guardarSesionMC(subscriberId, sessionState);
      return {
        interceptado: true,
        respuesta: `Mirá, te dejo el test y la tienda para cuando te decidas:\n🔮 Test: https://duendesdeluruguay.com/descubri-que-duende-te-elige/\n🛒 Tienda: https://duendesdeluruguay.com/shop/\n¡Que la magia te acompañe! 🍀`,
        razon: 'max_exchanges'
      };
    }

    await guardarSesionMC(subscriberId, sessionState);
  }

  return { interceptado: false, sessionState };
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

    // Detectar si viene del video de ManyChat (tag "vino_del_video_duendes")
    const tags = contact?.tags || [];
    const vieneDelVideo = tags.some(t =>
      (typeof t === 'string' ? t : t?.name || '').toLowerCase().includes('vino_del_video')
    );

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

    // Cargar historial de conversación
    const historial = await cargarHistorial(subscriberId);

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
    const msgLower = msg.toLowerCase();

    console.log('[MC-DIRECT] Intención:', {
      quiereComprar: intencion.quiereComprar,
      preguntaPedidoExistente: intencion.preguntaPedidoExistente,
      quiereVer: intencion.quiereVer,
      necesidad: intencion.necesidad
    });

    // ─────────────────────────────────────────────────────────────
    // FILTRO PRE-API: Reglas de comportamiento (crisis, insultos, spam, etc.)
    // ─────────────────────────────────────────────────────────────

    // Agregar msg del usuario al historial ANTES del filtro
    historial.push({ role: 'user', content: msg });

    // Si es un número del video, decidir según si tiene tag o no
    const esNumeroVideo = detectarNumeroVideo(msg);

    // Si escribe un número del video pero NO tiene el tag → decirle que toque el botón
    if (esNumeroVideo && !vieneDelVideo) {
      const resp = `¡Ey! Para elegir a ${esNumeroVideo.nombre}, tocá el botón con el número ${esNumeroVideo.numero} en el mensaje del video 👆\n\nSi tocás el botón te muestro todo sobre ${esNumeroVideo.nombre} al toque 🍀`;
      historial.push({ role: 'assistant', content: resp });
      await guardarHistorial(subscriberId, historial);
      const contenido = crearContenidoManychat(resp);
      await enviarMensajeManychat(subscriberId, contenido);
      return Response.json({ status: 'sent', method: 'video_sin_tag' });
    }

    const filtro = (esNumeroVideo && vieneDelVideo) ? { interceptado: false } : await filtroPreAPIMC(msg, historial, subscriberId);
    if (filtro.interceptado) {
      historial.push({ role: 'assistant', content: filtro.respuesta });
      await guardarHistorial(subscriberId, historial);

      const contenido = crearContenidoManychat(filtro.respuesta);
      await enviarMensajeManychat(subscriberId, contenido);

      console.log('[MC-DIRECT] Filtro interceptó:', filtro.razon);
      return Response.json({ status: 'sent', method: `filtro_${filtro.razon}` });
    }

    // ─────────────────────────────────────────────────────────────
    // RESPUESTAS RÁPIDAS FAQ - Ahorro de tokens
    // ─────────────────────────────────────────────────────────────

    // ENVÍOS
    if (/hacen env[ií]os?|env[ií]an a|llegan? a|mandan a|shipping/i.test(msgLower) && !/cu[aá]nto|d[ií]as|tarda/i.test(msgLower)) {
      return enviarRespuestaRapida(subscriberId, 'Sí, enviamos a todo el mundo 🌎 Por DHL Express, llega en 5-10 días con tracking. ¿De qué país sos?', historial, 'quick_envios');
    }

    // TIEMPOS DE ENVÍO
    if (/cu[aá]nto (tarda|demora) en llegar|d[ií]as.*llegar|tiempo de env[ií]o/i.test(msgLower)) {
      return enviarRespuestaRapida(subscriberId, '📦 Uruguay: 5-7 días hábiles (DAC)\n✈️ Internacional: 5-10 días hábiles (DHL Express)\n\nTodos van con tracking 🍀', historial, 'quick_tiempo_envio');
    }

    // MÉTODOS DE PAGO
    if (/m[eé]todos? de pago|c[oó]mo (pago|puedo pagar)|formas? de pago/i.test(msgLower)) {
      return enviarRespuestaRapida(subscriberId, 'Visa, MasterCard, Amex 💳\n\nInternacional: también Western Union y MoneyGram\nUruguay: + OCA, Redpagos, transferencia bancaria', historial, 'quick_pagos');
    }

    // PAYPAL
    if (/paypal|pay pal/i.test(msgLower)) {
      return enviarRespuestaRapida(subscriberId, 'No tenemos PayPal, pero sí Visa, MasterCard y Amex. También Western Union y MoneyGram para pagos internacionales 💳', historial, 'quick_paypal');
    }

    // GARANTÍA / DEVOLUCIONES
    if (/garant[ií]a|devoluci[oó]n|devolver|reembolso/i.test(msgLower)) {
      return enviarRespuestaRapida(subscriberId, 'No aceptamos devoluciones por arrepentimiento (cada pieza es única).\n\nSi llega dañado: contactás a DHL o DAC para el reclamo. El envío va asegurado 🍀', historial, 'quick_garantia');
    }

    // MATERIALES
    if (/material|de qu[eé] (est[aá]n|son|hechos)|porcelana|cristal/i.test(msgLower)) {
      return enviarRespuestaRapida(subscriberId, 'Cada guardián está hecho con:\n• Porcelana fría profesional\n• Cristales 100% naturales\n• Ropa cosida a mano\n\n100% artesanal, sin moldes 🍀', historial, 'quick_materiales');
    }

    // PROMO 3x2
    if (/3x2|tres por dos|promo|descuento|oferta/i.test(msgLower)) {
      return enviarRespuestaRapida(subscriberId, '¡Sí! Tenemos el 3x2: llevás 2 guardianes y te regalamos 1 mini 🎁\n\nY envío gratis en compras grandes.', historial, 'quick_promo');
    }

    // EL CÍRCULO
    if (/el c[ií]rculo|membres[ií]a|suscripci[oó]n/i.test(msgLower)) {
      return enviarRespuestaRapida(subscriberId, 'El Círculo está siendo preparado con algo muy especial 🔮\n\nSi querés ser de los primeros, dejá tu email en: magia.duendesdeluruguay.com/circulo', historial, 'quick_circulo');
    }

    // MI MAGIA
    if (/mi magia|portal.*compra/i.test(msgLower)) {
      return enviarRespuestaRapida(subscriberId, 'Mi Magia es tu portal exclusivo post-compra 🔮\n\nAhí encontrás tu canalización, la historia de tu guardián, ritual de bienvenida y más.\n\nAccedés en: magia.duendesdeluruguay.com', historial, 'quick_mimagia');
    }

    // ─────────────────────────────────────────────────────────────
    // INTERCEPTAR MONEDA LOCAL → Dirigir al shop (ANTES de detectar país)
    // ─────────────────────────────────────────────────────────────
    if (/en (pesos|mi moneda|moneda local|reales|soles|euros)|cu[aá]nto (es|ser[ií]a|sale|cuesta) en (?!d[oó]lares|usd)|en (pesos\s+)?(argentinos?|mexicanos?|colombianos?|chilenos?|uruguayos)|precio.*(local|moneda)/i.test(msgLower) && !/pesos uruguayos/i.test(msgLower)) {
      return enviarRespuestaRapida(subscriberId, 'Nuestros precios son en dólares (USD) 💚\n\nPero en la tienda te aparece automáticamente en tu moneda: https://duendesdeluruguay.com/shop/ 🍀', historial, 'quick_moneda_local');
    }

    // ─────────────────────────────────────────────────────────────
    // INTERCEPTAR PAÍS → Precios directos sin Claude
    // ─────────────────────────────────────────────────────────────
    const paisDetectado = detectarPais(msg);
    if (paisDetectado) {
      const historialTexto = historial.map(m => m.content || '').join(' ').toLowerCase();

      // Buscar guardianes mencionados en el historial
      try {
        const productos = await obtenerProductosWoo();
        const mencionados = productos.filter(p => {
          const nombre = (p.nombre || '').toLowerCase();
          return nombre.length >= 3 && historialTexto.includes(nombre);
        });
        if (mencionados.length > 0) {
          const esUY = paisDetectado === 'UY';
          const lineas = mencionados.map(p => {
            if (esUY) {
              const pesos = PRECIOS_URUGUAY.convertir(p.precio);
              return `• ${p.nombre}: $${pesos.toLocaleString('es-UY')} pesos uruguayos`;
            }
            return `• ${p.nombre}: $${p.precio} USD`;
          }).join('\n');
          const resp = esUY
            ? `🇺🇾 ¡De Uruguay! Acá van los precios:\n\n${lineas}\n\nPodés ver todo en la tienda: https://duendesdeluruguay.com/shop/ 🍀\n\n¿Cuál te gustó?`
            : `¡Genial! Los precios son en dólares:\n\n${lineas}\n\nPodés ver todo en: https://duendesdeluruguay.com/shop/ 🍀\n\n¿Cuál te gustó?`;
          return enviarRespuestaRapida(subscriberId, resp, historial, esUY ? 'quick_precio_uy' : 'quick_precio_usd');
        }
      } catch (e) {}
    }

    // Datos
    const datos = {
      nombre: userName,
      subscriberId,
      plataforma,
      _historial: historial,
    };

    // Construir contexto
    const contexto = await construirContexto(msg, intencion, datos);

    // Contexto del video de ManyChat
    const videoInstruccion = vieneDelVideo
      ? `\n\n🎬 VIENE DEL VIDEO. Eligió un guardián por número. ManyChat ya le mandó mensaje inicial.
- SÉ BREVE: 2-3 oraciones MÁXIMO. No le cuentes toda la historia.
- Mostrá el guardián (ya va en la card) y preguntá algo puntual: de dónde es, si quiere adoptarlo
- NO te presentes, NO des discursos, NO expliques de más
- Si dice su país → convertí precio y preguntá si lo quiere`
      : '';

    // Idioma detectado en sesión
    const idiomaInstruccion = filtro.sessionState?.idiomaDetectado === 'en'
      ? '\n- RESPOND IN ENGLISH. The user speaks English.'
      : filtro.sessionState?.idiomaDetectado === 'pt'
        ? '\n- RESPONDE EN PORTUGUÉS. El usuario habla portugués.'
        : '';

    // System prompt
    const systemPrompt = `${PERSONALIDAD_TITO}

${CONTEXTO_MANYCHAT}

${contexto}

=== INSTRUCCIÓN FINAL ===
- Mensajes CORTOS (2-3 oraciones máximo)
- 1-2 emojis máximo
- Respondé DIRECTO a lo que pregunta
- Si quiere comprar, pedí datos. NO pidas número de pedido a cliente nuevo.
- Si pregunta por pedido existente, ahí sí pedí número o email.${videoInstruccion}${idiomaInstruccion}`;

    // Preparar messages con historial (últimos 8 mensajes para contexto)
    // Claude requiere que el primer mensaje sea 'user'
    let messagesParaClaude = historial.slice(-8);
    while (messagesParaClaude.length > 0 && messagesParaClaude[0].role !== 'user') {
      messagesParaClaude = messagesParaClaude.slice(1);
    }
    if (messagesParaClaude.length === 0) {
      messagesParaClaude = [{ role: 'user', content: msg }];
    }

    // Llamar a Claude
    const response = await anthropic.messages.create({
      model: 'claude-3-5-haiku-20241022',
      max_tokens: 300,
      system: systemPrompt,
      messages: messagesParaClaude
    });

    const textoRespuesta = response.content[0].text;

    // Guardar respuesta en historial
    historial.push({ role: 'assistant', content: textoRespuesta });
    await guardarHistorial(subscriberId, historial);

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
    // IMPORTANTE: Si ya se envió directo por API, NO incluir el contenido Dynamic Block
    // para evitar que ManyChat lo envíe de nuevo (mensaje duplicado)
    if (enviado) {
      return Response.json({
        status: 'sent',
        respuesta: textoRespuesta,
        ...imagenes,
        total_productos: productos.length,
        _debug: {
          enviado_directo: true,
          subscriber_id: subscriberId
        }
      });
    }

    // Fallback: si no se pudo enviar directo, devolver en formato Dynamic Block
    // para que ManyChat lo procese
    return Response.json({
      ...contenido,
      respuesta: textoRespuesta,
      ...imagenes,
      total_productos: productos.length,
      _debug: {
        enviado_directo: false,
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
