export const dynamic = "force-dynamic";
/**
 * TITO MC-DIRECT - Filtro/Redirector simplificado
 *
 * Tito saluda con intro mágica, explica qué hace único a los guardianes,
 * y redirige a la tienda o al test. Claude solo se llama para casos raros.
 */

import Anthropic from '@anthropic-ai/sdk';
import { kv } from '@vercel/kv';
import { obtenerProductosWoo, PRECIOS_URUGUAY } from '@/lib/tito/conocimiento';
import { PERSONALIDAD_TITO_SIMPLE, CONTEXTO_MANYCHAT_SIMPLE } from '@/lib/tito/personalidad-simple';
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
 */
function detectarNumeroVideo(msg) {
  const msgLower = msg.toLowerCase().trim();
  const numeros = ['222', '44', '33', '11', '9', '7', '5'];
  for (const num of numeros) {
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
// DETECTORES
// ═══════════════════════════════════════════════════════════════

function detectarIntencion(mensaje) {
  const msg = mensaje.toLowerCase();
  return {
    esSaludo: /^(hola|hey|buenas|buenos|hi|hello|ey|qué tal|que tal|buen día)[\s!?.]*$/i.test(msg.trim()),
    preguntaPrecio: /cuánto|cuanto|cuesta|vale|precio|valor/i.test(msg),
    quiereComprar: /quiero comprar|cómo compro|como compro|me lo llevo|lo quiero|lo compro|quiero adquirir|quiero pagar|cómo pago|como pago|quiero uno|quiero ese|quiero una|quiero esa|me interesa comprar/i.test(msg),
    preguntaPedidoExistente: /mi pedido|mi orden|ya (pagué|pague|compré|compre)|cuándo llega|cuando llega|estado de mi|tracking|rastreo|número de seguimiento|no me llegó|no me llego|dónde está mi/i.test(msg),
    quiereVer: /mostr[aá]me|ver guardianes|cat[aá]logo|qu[eé] tienen/i.test(msg),
    quiereTest: /test|descubr|cu[aá]l me elige|qu[eé] (duende|guardi[aá]n) (me|soy)/i.test(msg),
    paisMencionado: detectarPais(msg),
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

/**
 * Busca un guardián por nombre en el mensaje
 */
async function buscarGuardianPorNombre(mensaje) {
  try {
    const productos = await obtenerProductosWoo();
    const msgLower = mensaje.toLowerCase();
    const guardianes = productos.filter(p =>
      p.precio >= 40 && p.precio <= 2000 &&
      !/(runa|altar|círculo|circulo|paquete)/i.test(p.nombre)
    );
    // Buscar por nombre
    const porNombre = guardianes.find(p => {
      const nombre = (p.nombre || '').split(/\s*-\s*/)[0].toLowerCase().trim();
      return nombre.length >= 3 && msgLower.includes(nombre);
    });
    if (porNombre) return porNombre;
    // Buscar por slug
    const porSlug = guardianes.find(p => {
      const slug = (p.slug || '').toLowerCase();
      return slug.length >= 3 && msgLower.includes(slug);
    });
    return porSlug || null;
  } catch (e) {
    return null;
  }
}

/**
 * Notifica al owner en ManyChat para revisión
 */
async function notificarOwner(subscriberId, motivo) {
  if (!MANYCHAT_API_KEY || !subscriberId) return;
  try {
    await fetch(`${MANYCHAT_API_URL}/subscriber/addTagByName`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${MANYCHAT_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        subscriber_id: subscriberId,
        tag_name: 'necesita_revision_tito'
      })
    });
    console.log('[MC-DIRECT] Owner notificado:', motivo);
  } catch (e) {
    console.log('[MC-DIRECT] Error notificando owner:', e.message);
  }
}

// ═══════════════════════════════════════════════════════════════
// CONSTRUIR CONTEXTO MÍNIMO PARA CLAUDE
// ═══════════════════════════════════════════════════════════════

async function construirContexto(mensaje, intencion, datos) {
  const { nombre, subscriberId } = datos;
  let contexto = '';

  if (nombre) contexto += `\n👤 Cliente: ${nombre}`;

  let memoria = null;
  if (subscriberId) {
    try { memoria = await kv.get(`tito:mc:${subscriberId}`); } catch (e) {}
  }

  const esPrimeraVez = !memoria || memoria.interacciones === 0;
  const pais = intencion.paisMencionado || memoria?.pais;
  datos._pais = pais;
  datos._esPrimeraVez = esPrimeraVez;

  if (esPrimeraVez) {
    contexto += `\n✨ PRIMERA VEZ`;
  } else {
    contexto += `\n🔄 Interacción #${(memoria?.interacciones || 0) + 1}`;
    contexto += `\n⚠️ NO te presentes. Hablá directo.`;
  }

  // Contexto de guardián del video
  const guardianVideo = detectarNumeroVideo(mensaje);
  if (guardianVideo) {
    try {
      const productos = await obtenerProductosWoo();
      const encontrado = productos.find(p => {
        const pNombre = (p.nombre || '').toLowerCase();
        const pSlug = (p.slug || '').toLowerCase();
        return guardianVideo.buscar.some(term =>
          pNombre.includes(term) || pSlug.includes(term)
        );
      });
      if (encontrado) {
        datos._productos = [encontrado];
        const desc = (encontrado.descripcion || '').substring(0, 400).trim();
        contexto += `\n\n🎬 GUARDIÁN DEL VIDEO #${guardianVideo.numero}: ${encontrado.nombre} — $${encontrado.precio} USD`;
        if (desc) contexto += `\n  ${desc}`;
      } else {
        contexto += `\n\n🎬 Eligió #${guardianVideo.numero} (${guardianVideo.nombre}) del video.`;
      }
    } catch (e) {}
  }

  // País
  if (pais === 'UY') {
    contexto += `\n\n🇺🇾 URUGUAY - Precios fijos en pesos uruguayos.`;
  } else if (pais) {
    contexto += `\n\n💰 Precios SOLO en USD. Si piden en su moneda → dirigir a la tienda.`;
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
    await kv.set(`tito:sesion:mc:${subscriberId}`, state, { ex: 7200 });
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
    const ultimos = historial.slice(-10);
    await kv.set(`tito:mc:historial:${subscriberId}`, ultimos, { ex: 86400 });
  } catch (e) {}
}

async function enviarRespuestaRapida(subscriberId, texto, historial, method) {
  historial.push({ role: 'assistant', content: texto });
  await guardarHistorial(subscriberId, historial);
  const contenido = crearContenidoManychat(texto);
  await enviarMensajeManychat(subscriberId, contenido);
  return Response.json({ ...contenido, status: 'sent', method, respuesta: texto, respuesta_tito: texto, hay_productos: 'no' });
}

async function enviarGreeting(subscriberId, nombre, historial) {
  const texto = generarGreeting(nombre);
  historial.push({ role: 'assistant', content: texto });
  await guardarHistorial(subscriberId, historial);
  const contenido = crearContenidoManychat(texto);
  await enviarMensajeManychat(subscriberId, contenido);
  return Response.json({ ...contenido, status: 'sent', method: 'greeting', respuesta: texto, respuesta_tito: texto, hay_productos: 'no' });
}

async function enviarConProductos(subscriberId, texto, productos, historial, method) {
  historial.push({ role: 'assistant', content: texto });
  await guardarHistorial(subscriberId, historial);
  const contenido = crearContenidoManychat(texto, productos);
  await enviarMensajeManychat(subscriberId, contenido);
  return Response.json({ ...contenido, status: 'sent', method, respuesta: texto, respuesta_tito: texto, hay_productos: 'si', imagen_url: productos[0]?.imagen || '', imagen_url_2: productos[1]?.imagen || '', imagen_url_3: productos[2]?.imagen || '' });
}

// ═══════════════════════════════════════════════════════════════
// GREETING MÁGICO
// ═══════════════════════════════════════════════════════════════

function generarGreeting(nombre) {
  return `✨ ¡Ey${nombre ? ' ' + nombre : ''}!

Soy Tito, duende del bosque de Piriápolis.

Llegaste a un lugar distinto. Acá los guardianes eligen a su persona, no al revés.

Cada uno tarda días en nacer. Manos humanas, cristales reales, ropa cosida puntada a puntada. Cuando se va, no vuelve. Ese diseño desaparece del mundo para siempre.

Y cuando un guardián te elige, te escribe una canalización: una carta personal donde te habla a VOS, de lo que estás viviendo. No es genérica. Es tuya y de nadie más 🍀

Tenemos dos caminos para empezar:

1️⃣ Conocer a los guardianes disponibles
https://duendesdeluruguay.com/shop/

2️⃣ Descubrir qué guardián te elige
https://duendesdeluruguay.com/descubri-que-duende-te-elige/`;
}

// ═══════════════════════════════════════════════════════════════
// FILTRO PRE-API MC
// ═══════════════════════════════════════════════════════════════

async function filtroPreAPIMC(msg, historial, subscriberId) {
  const msgLower = msg.toLowerCase().trim();
  const tieneHistorial = historial.length > 1;

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

  // Bloqueado
  if (sessionState?.bloqueado) {
    return { interceptado: true, respuesta: '🍀', razon: 'bloqueado' };
  }

  // ── 0) CONTEXTO: No filtrar respuestas a preguntas de Tito ──
  if (historial.length > 0) {
    const ultimoBot = [...historial].reverse().find(m => m.role === 'assistant');
    if (ultimoBot) {
      const textoBot = (ultimoBot.content || '').toLowerCase();

      const pideDatos = /n[uú]mero de pedido|n[uú]mero de orden|tu (n[uú]mero|email|nombre|mail|correo)|pas[aá]me (el|tu)|decime (tu|el)|necesito (tu|el|que me)|con qu[eé] (nombre|email|mail)|datos del pedido/i.test(textoBot);
      if (pideDatos) {
        if (sessionState) { sessionState.contadorMensajes++; await guardarSesionMC(subscriberId, sessionState); }
        return { interceptado: false };
      }

      const titoHizoPregunta = /\?/.test(ultimoBot.content || '');
      const titoOfreció = /te muestro|quer[eé]s (ver|que)|te cuento|te interesa|te gustaria|te gustaría|mostrar(te|los)|ayudan con eso/i.test(textoBot);
      const esAfirmativo = /^(s[ií]|si+|ok|dale|bueno|va|vamos|claro|por favor|porfa|obvio|seguro|manda|mostr[aá]|quer[ií]a|quiero|me interesa|por supuesto)[\s!.]*$/i.test(msgLower);
      if ((titoHizoPregunta || titoOfreció) && esAfirmativo) {
        if (sessionState) { sessionState.contadorMensajes++; sessionState.contadorSinProgreso = 0; await guardarSesionMC(subscriberId, sessionState); }
        return { interceptado: false };
      }

      if (msgLower.length < 3) {
        if (sessionState) { sessionState.contadorMensajes++; await guardarSesionMC(subscriberId, sessionState); }
        return { interceptado: false };
      }
    }
  }

  // ── CRISIS ──
  const crisis = detectarCrisis(msg);
  if (crisis.detectado) {
    if (sessionState) await guardarSesionMC(subscriberId, sessionState);
    return { interceptado: true, respuesta: crisis.respuesta, razon: 'crisis' };
  }

  // ── INSULTOS ──
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

  // ── SPAM ──
  const spam = detectarSpam(msg);
  if (spam.detectado) {
    if (sessionState) await guardarSesionMC(subscriberId, sessionState);
    return {
      interceptado: true,
      respuesta: '¡Que la magia te acompañe! 🍀 Si algún día sentís el llamado de un guardián, acá estoy.',
      razon: 'spam'
    };
  }

  // ── DESPEDIDA ──
  const despedida = detectarDespedida(msg, tieneHistorial);
  if (despedida.detectado) {
    if (sessionState) await guardarSesionMC(subscriberId, sessionState);
    return {
      interceptado: true,
      respuesta: '¡Chau! Que la magia te acompañe 🍀 Si algún día sentís el llamado de un guardián, acá voy a estar.',
      razon: 'despedida'
    };
  }

  // ── SALUDO → Greeting mágico con 2 caminos (siempre, sin importar historial) ──
  if (/^(hola|buenas?|buenos d[ií]as|buenas tardes|buenas noches|hey|ey|hi|hello|que tal|qué tal)[\s!?.]*$/i.test(msgLower)) {
    if (sessionState) { sessionState.contadorMensajes++; await guardarSesionMC(subscriberId, sessionState); }
    return {
      interceptado: true,
      respuesta: '__GREETING__',
      razon: 'saludo'
    };
  }

  // ── TROLLING ──
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

  // ── SIN DINERO → Cierre amable ──
  const sinDinero = detectarSinDinero(msg);
  if (sinDinero.detectado && sessionState) {
    sessionState.contadorSinDinero = (sessionState.contadorSinDinero || 0) + 1;
    sessionState.contadorMensajes++;
    await guardarSesionMC(subscriberId, sessionState);

    if (sessionState.contadorSinDinero === 1) {
      return {
        interceptado: true,
        respuesta: 'Los guardianes llegan en el momento exacto 🍀\n\nCuando sientas el llamado, acá vamos a estar: https://duendesdeluruguay.com/shop/',
        razon: 'sin_dinero'
      };
    } else {
      return {
        interceptado: true,
        respuesta: 'Te dejo el test para cuando sea el momento: https://duendesdeluruguay.com/descubri-que-duende-te-elige/ 🍀 ¡Nos vemos!',
        razon: 'sin_dinero_final'
      };
    }
  } else if (sinDinero.detectado && !sessionState) {
    return {
      interceptado: true,
      respuesta: 'Los guardianes llegan en el momento exacto 🍀\n\nCuando sientas el llamado: https://duendesdeluruguay.com/shop/',
      razon: 'sin_dinero'
    };
  }

  // ── DESAHOGO → Empática breve + redirect ──
  const desahogo = detectarDesahogo(msg);
  if (desahogo.detectado && sessionState) {
    sessionState.contadorDesahogo = (sessionState.contadorDesahogo || 0) + 1;
    sessionState.contadorMensajes++;
    await guardarSesionMC(subscriberId, sessionState);

    if (sessionState.contadorDesahogo === 1) {
      return {
        interceptado: true,
        respuesta: 'Te escucho 💚 A veces un guardián llega justo cuando más lo necesitás.\n\nSi querés descubrir cuál te elige: https://duendesdeluruguay.com/descubri-que-duende-te-elige/ 🍀',
        razon: 'desahogo'
      };
    } else {
      return {
        interceptado: true,
        respuesta: 'Ojalá las cosas mejoren pronto. Cuando estés lista/o: https://duendesdeluruguay.com/shop/ 🍀 Cuidate mucho.',
        razon: 'desahogo_final'
      };
    }
  } else if (desahogo.detectado && !sessionState) {
    return {
      interceptado: true,
      respuesta: 'Te escucho 💚 A veces un guardián llega justo cuando más lo necesitás.\n\nDescubrí cuál te elige: https://duendesdeluruguay.com/descubri-que-duende-te-elige/ 🍀',
      razon: 'desahogo'
    };
  }

  // ── IDIOMA (en/pt) ──
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
          respuesta: 'Hey! Each guardian is UNIQUE — handmade, real crystals, no molds. When adopted, that design disappears forever.\n\nEach adoption includes a personal channeling letter just for you ✨\n\n🛒 Shop: https://duendesdeluruguay.com/shop/\n🔮 Find your guardian: https://duendesdeluruguay.com/descubri-que-duende-te-elige/',
          razon: 'idioma_en'
        };
      }
      if (idioma.idioma === 'pt') {
        return {
          interceptado: true,
          respuesta: 'Oi! Cada guardião é ÚNICO — feito à mão, cristais reais, sem moldes. Quando adotado, esse design desaparece para sempre.\n\nCada adoção inclui uma carta pessoal canalizada só pra você ✨\n\n🛒 Loja: https://duendesdeluruguay.com/shop/\n🔮 Descubra seu guardião: https://duendesdeluruguay.com/descubri-que-duende-te-elige/',
          razon: 'idioma_pt'
        };
      }
    }
  }

  // ── PREGUNTA REPETIDA ──
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

  // ── MAX EXCHANGES SIN PROGRESO ──
  if (sessionState) {
    sessionState.contadorMensajes++;

    if (tieneSeñalDeCompra(msg)) {
      sessionState.contadorSinProgreso = 0;
    } else {
      sessionState.contadorSinProgreso = (sessionState.contadorSinProgreso || 0) + 1;
    }

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
      contact,
      plataforma
    } = body;

    const msg = mensaje || message || '';
    const userName = nombre || first_name || contact?.first_name || contact?.name || '';
    const subscriberId = subscriber_id || contact?.id || contact?.subscriber_id;

    // Detectar si viene del video de ManyChat (tag "vino_del_video_duendes")
    const tags = contact?.tags || [];
    const vieneDelVideo = tags.some(t =>
      (typeof t === 'string' ? t : t?.name || '').toLowerCase().includes('vino_del_video')
    );

    if (!subscriberId) {
      console.error('[MC-DIRECT] No hay subscriber_id');
      const fallbackText = '¡Ey! 🍀 ¿En qué te puedo ayudar?';
      return Response.json({
        version: 'v2',
        content: {
          messages: [{ type: 'text', text: fallbackText }]
        },
        respuesta: fallbackText,
        respuesta_tito: fallbackText,
        hay_productos: 'no'
      });
    }

    const historial = await cargarHistorial(subscriberId);

    // ─────────────────────────────────────────────────────────────
    // MENSAJE VACÍO → Greeting mágico (3 burbujas)
    // ─────────────────────────────────────────────────────────────
    if (!msg.trim()) {
      return enviarGreeting(subscriberId, userName, historial);
    }

    const intencion = detectarIntencion(msg);
    const msgLower = msg.toLowerCase();

    // ─────────────────────────────────────────────────────────────
    // VIDEO NUMBERS
    // ─────────────────────────────────────────────────────────────
    historial.push({ role: 'user', content: msg });

    const esNumeroVideo = detectarNumeroVideo(msg);

    // Número del video sin tag → "tocá el botón"
    if (esNumeroVideo && !vieneDelVideo) {
      const resp = `¡Ey! Para elegir a ${esNumeroVideo.nombre}, tocá el botón con el número ${esNumeroVideo.numero} en el mensaje del video 👆\n\nSi tocás el botón te muestro todo sobre ${esNumeroVideo.nombre} al toque 🍀`;
      historial.push({ role: 'assistant', content: resp });
      await guardarHistorial(subscriberId, historial);
      const contenido = crearContenidoManychat(resp);
      await enviarMensajeManychat(subscriberId, contenido);
      return Response.json({ ...contenido, status: 'sent', method: 'video_sin_tag', respuesta: resp, respuesta_tito: resp, hay_productos: 'no' });
    }

    // ─────────────────────────────────────────────────────────────
    // FILTRO PRE-API
    // ─────────────────────────────────────────────────────────────
    const filtro = (esNumeroVideo && vieneDelVideo) ? { interceptado: false } : await filtroPreAPIMC(msg, historial, subscriberId);
    if (filtro.interceptado) {
      // Si es saludo, usar greeting mágico (3 burbujas)
      if (filtro.respuesta === '__GREETING__') {
        return enviarGreeting(subscriberId, userName, historial);
      }

      historial.push({ role: 'assistant', content: filtro.respuesta });
      await guardarHistorial(subscriberId, historial);
      const contenido = crearContenidoManychat(filtro.respuesta);
      await enviarMensajeManychat(subscriberId, contenido);
      console.log('[MC-DIRECT] Filtro interceptó:', filtro.razon);
      return Response.json({ ...contenido, status: 'sent', method: `filtro_${filtro.razon}`, respuesta: filtro.respuesta, respuesta_tito: filtro.respuesta, hay_productos: 'no' });
    }

    // ─────────────────────────────────────────────────────────────
    // RESPUESTAS RÁPIDAS FAQ
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
      return enviarRespuestaRapida(subscriberId, 'Visa, MasterCard, Amex 💳\nUruguay: + OCA, transferencia bancaria\n\nNo tenemos PayPal.', historial, 'quick_pagos');
    }

    // PAYPAL
    if (/paypal|pay pal/i.test(msgLower)) {
      return enviarRespuestaRapida(subscriberId, 'No tenemos PayPal, pero sí Visa, MasterCard y Amex 💳 Funcionan desde cualquier país.', historial, 'quick_paypal');
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

    // CANALIZACIÓN
    if (/canalización|canalizacion|carta personal|carta del guardián/i.test(msgLower)) {
      return enviarRespuestaRapida(subscriberId, 'Cada guardián viene con su canalización: una carta personal donde te habla a VOS, de lo que estás viviendo ✨\n\nNo es genérica — es única, como el guardián.\n\nPodés verlos acá: https://duendesdeluruguay.com/shop/ 🍀', historial, 'quick_canalizacion');
    }

    // ─────────────────────────────────────────────────────────────
    // PRECIOS EN PESOS URUGUAYOS → Tabla general UY
    // ─────────────────────────────────────────────────────────────
    if (/pesos uruguayos|precios?.*(uruguay|uy)|uruguay.*precios?/i.test(msgLower)) {
      const tablaUY = `🇺🇾 Precios en pesos uruguayos:\n\n🌿 Mini Clásico — $2.500\n✨ Mini Especial / Pixie — $5.500\n🍀 Mediano Especial — $8.000\n🔮 Mediano Maestros Místicos — $12.500\n💚 Grande Especial — $16.500\n👑 Grande Maestros Místicos — $24.500\n🌟 Gigante Especial — $39.800\n\nPodés verlos todos en la tienda: https://duendesdeluruguay.com/shop/ 🍀`;
      return enviarRespuestaRapida(subscriberId, tablaUY, historial, 'quick_precios_uy_general');
    }

    // ─────────────────────────────────────────────────────────────
    // MONEDA LOCAL → Dirigir al shop
    // ─────────────────────────────────────────────────────────────
    if (/en (pesos|mi moneda|moneda local|reales|soles|euros)|cu[aá]nto (es|ser[ií]a|sale|cuesta) en (?!d[oó]lares|usd)|en (pesos\s+)?(argentinos?|mexicanos?|colombianos?|chilenos?|uruguayos)|precio.*(local|moneda)/i.test(msgLower)) {
      return enviarRespuestaRapida(subscriberId, 'Nuestros precios son en dólares (USD) 💚\n\nPero en la tienda te aparece automáticamente en tu moneda: https://duendesdeluruguay.com/shop/ 🍀', historial, 'quick_moneda_local');
    }

    // ─────────────────────────────────────────────────────────────
    // PAÍS → Precios directos
    // ─────────────────────────────────────────────────────────────
    const paisDetectado = detectarPais(msg);
    if (paisDetectado) {
      const historialTexto = historial.map(m => m.content || '').join(' ').toLowerCase();

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
          const cierre = mencionados.length === 1
            ? `\n\n¿Querés que te cuente más sobre ${mencionados[0].nombre}? 🍀`
            : `\n\n¿Cuál te gustó? 🍀`;
          const resp = esUY
            ? `🇺🇾 ¡De Uruguay! Acá van los precios:\n\n${lineas}\n\nPodés ver todo en la tienda: https://duendesdeluruguay.com/shop/${cierre}`
            : `¡Genial! Los precios son en dólares:\n\n${lineas}\n\nPodés ver todo en: https://duendesdeluruguay.com/shop/${cierre}`;
          return enviarRespuestaRapida(subscriberId, resp, historial, esUY ? 'quick_precio_uy' : 'quick_precio_usd');
        }
      } catch (e) {}
    }

    // ─────────────────────────────────────────────────────────────
    // SELECCIÓN DE CAMINO (después del greeting)
    // ─────────────────────────────────────────────────────────────
    const ultimoBot = historial.slice().reverse().find(m => m.role === 'assistant');
    const fueGreeting = ultimoBot && /1️⃣.*2️⃣/s.test(ultimoBot.content || '');

    // Elige SHOP
    if (/^(tienda|shop|ver la tienda|ver guardianes)[\s!?.]*$/i.test(msgLower) || intencion.quiereVer ||
        (fueGreeting && /^(1|uno)[\s!?.]*$/i.test(msgLower))) {
      return enviarRespuestaRapida(subscriberId,
        '¡Dale! En la tienda podés ver todos los guardianes con sus fotos, historia y precios.\n\nEs simple: elegís, sellás el pacto 💚 y te llega a donde estés.\n\n👉 https://duendesdeluruguay.com/shop/\n\nSi necesitás ayuda, preguntame 🍀',
        historial, 'path_shop');
    }

    // Elige TEST
    if (intencion.quiereTest ||
        (fueGreeting && /^(2|dos)[\s!?.]*$/i.test(msgLower))) {
      return enviarRespuestaRapida(subscriberId,
        '¡Buena elección! El test te ayuda a descubrir qué guardián resuena con tu energía.\n\n👉 https://duendesdeluruguay.com/descubri-que-duende-te-elige/\n\nCuando termines, volvé y contame qué salió 🍀',
        historial, 'path_test');
    }

    // ─────────────────────────────────────────────────────────────
    // QUIERE COMPRAR → Redirect a tienda
    // ─────────────────────────────────────────────────────────────
    if (intencion.quiereComprar) {
      return enviarRespuestaRapida(subscriberId,
        '¡Dale! Entrá a la tienda, elegí tu guardián y sellá el pacto 💚\n\n👉 https://duendesdeluruguay.com/shop/\n\nEnvío a todo el mundo con tracking. ¿Alguna duda? 🍀',
        historial, 'quick_comprar');
    }

    // ─────────────────────────────────────────────────────────────
    // PEDIDO EXISTENTE → WhatsApp
    // ─────────────────────────────────────────────────────────────
    if (intencion.preguntaPedidoExistente) {
      return enviarRespuestaRapida(subscriberId,
        'Para consultas de pedidos, escribinos por WhatsApp que ahí el equipo te ayuda con el seguimiento 💚\n\n👉 https://wa.me/59898690629',
        historial, 'quick_pedido');
    }

    // ─────────────────────────────────────────────────────────────
    // PREGUNTA PRECIO (sin país) → Pedir país
    // ─────────────────────────────────────────────────────────────
    if (intencion.preguntaPrecio && !paisDetectado) {
      return enviarRespuestaRapida(subscriberId,
        'Los precios están en la tienda: https://duendesdeluruguay.com/shop/ 🍀\n\n¿De qué país sos? Si sos de Uruguay te doy los precios en pesos.',
        historial, 'quick_precio_pais');
    }

    // ─────────────────────────────────────────────────────────────
    // BUSCAR GUARDIÁN POR NOMBRE → Link directo o shop
    // ─────────────────────────────────────────────────────────────
    const guardianEncontrado = await buscarGuardianPorNombre(msg);
    if (guardianEncontrado) {
      const url = guardianEncontrado.url || `https://duendesdeluruguay.com/?p=${guardianEncontrado.id}`;
      const resp = `¡Acá lo tenés! 🍀\n\n👉 ${url}\n\n¿De qué país sos? Así te doy el precio exacto.`;
      return enviarConProductos(subscriberId, resp, [guardianEncontrado], historial, 'quick_guardian_found');
    }

    // ─────────────────────────────────────────────────────────────
    // CLAUDE - Solo para casos que no matchearon ningún patrón
    // ─────────────────────────────────────────────────────────────
    const datos = {
      nombre: userName,
      subscriberId,
      plataforma,
      _historial: historial,
    };

    const contexto = await construirContexto(msg, intencion, datos);

    const videoInstruccion = vieneDelVideo
      ? `\n\n🎬 VIENE DEL VIDEO. Eligió un guardián por número.
- SÉ BREVE: 2-3 oraciones MÁXIMO
- Mostrá el guardián y preguntá de dónde es
- NO te presentes, NO des discursos`
      : '';

    const idiomaInstruccion = filtro.sessionState?.idiomaDetectado === 'en'
      ? '\n- RESPOND IN ENGLISH.'
      : filtro.sessionState?.idiomaDetectado === 'pt'
        ? '\n- RESPONDE EN PORTUGUÉS.'
        : '';

    const systemPrompt = `${PERSONALIDAD_TITO_SIMPLE}

${CONTEXTO_MANYCHAT_SIMPLE}

${contexto}

=== INSTRUCCIÓN FINAL ===
- Mensajes CORTOS (2-3 oraciones máximo)
- 1-2 emojis máximo
- Respondé DIRECTO a lo que pregunta
- SIEMPRE dirigí a la tienda o al test
- Si no sabés algo, decí: "Uy, dejame averiguar eso. Escribime de nuevo en un ratito 🍀" — NO inventes
- Tienda: https://duendesdeluruguay.com/shop/
- Test: https://duendesdeluruguay.com/descubri-que-duende-te-elige/${videoInstruccion}${idiomaInstruccion}`;

    let messagesParaClaude = historial.slice(-8);
    while (messagesParaClaude.length > 0 && messagesParaClaude[0].role !== 'user') {
      messagesParaClaude = messagesParaClaude.slice(1);
    }
    if (messagesParaClaude.length === 0) {
      messagesParaClaude = [{ role: 'user', content: msg }];
    }

    const response = await anthropic.messages.create({
      model: 'claude-3-5-haiku-20241022',
      max_tokens: 300,
      system: systemPrompt,
      messages: messagesParaClaude
    });

    const textoRespuesta = response.content[0].text;

    // Si Claude dice "averiguar" → notificar al owner
    if (/averiguar|no (tengo|s[eé]) esa info/i.test(textoRespuesta)) {
      await notificarOwner(subscriberId, `Claude no supo responder: "${msg}"`);
    }

    historial.push({ role: 'assistant', content: textoRespuesta });
    await guardarHistorial(subscriberId, historial);

    const contenido = crearContenidoManychat(textoRespuesta, datos._productos);

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
          pais: intencion.paisMencionado || memoriaExistente.pais,
        };
        await kv.set(`tito:mc:${subscriberId}`, nuevaMemoria, { ex: 30 * 24 * 60 * 60 });
      } catch (e) {
        console.error('[MC-DIRECT] Error guardando memoria:', e);
      }
    }

    console.log('[MC-DIRECT] Claude respondió:', {
      tiempo: Date.now() - startTime,
      enviado,
      productos: datos._productos?.length || 0
    });

    // Productos para ManyChat fields (video flow)
    const productos = datos._productos || [];
    const imagenes = {
      imagen_1: productos[0]?.imagen || '',
      nombre_1: productos[0]?.nombre || '',
      precio_1: productos[0] ? `$${productos[0].precio} USD` : '',
      url_1: productos[0]?.url || '',
      tiene_productos: productos.length > 0 ? 'si' : 'no',
    };

    if (enviado) {
      return Response.json({
        ...contenido,
        status: 'sent',
        respuesta: textoRespuesta,
        respuesta_tito: textoRespuesta,
        hay_productos: productos.length > 0 ? 'si' : 'no',
        ...imagenes,
      });
    }

    return Response.json({
      ...contenido,
      respuesta: textoRespuesta,
      respuesta_tito: textoRespuesta,
      hay_productos: productos.length > 0 ? 'si' : 'no',
      ...imagenes,
    });

  } catch (error) {
    console.error('[MC-DIRECT] Error:', error);

    const errorText = 'Uy, tuve un problemita 😅 ¿Podés escribirme de nuevo?';
    return Response.json({
      version: 'v2',
      content: {
        messages: [{ type: 'text', text: errorText }]
      },
      respuesta: errorText,
      respuesta_tito: errorText,
      hay_productos: 'no'
    });
  }
}

export async function GET() {
  return Response.json({
    status: 'ok',
    endpoint: 'TITO MC-DIRECT v2 — Filtro/Redirector',
    descripcion: 'Tito saluda, explica la magia, y redirige a tienda o test',
  });
}
