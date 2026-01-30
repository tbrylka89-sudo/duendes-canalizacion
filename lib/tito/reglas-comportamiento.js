/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * TITO - REGLAS DE COMPORTAMIENTO
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Funciones puras de detección. No hacen I/O ni KV.
 * Cada función recibe el mensaje y retorna { detectado: boolean, ...datos }.
 */

// ═══════════════════════════════════════════════════════════════
// 1. CRISIS - PRIORIDAD MÁXIMA
// ═══════════════════════════════════════════════════════════════

const PATRONES_CRISIS = [
  /quiero\s+(morir(me)?|matarme|desaparecer|acabar\s+con\s+todo)/i,
  /me\s+quiero\s+matar/i,
  /no\s+quiero\s+(seguir\s+)?vivir/i,
  /quitarme\s+la\s+vida/i,
  /acabar\s+con\s+(mi\s+)?vida/i,
  /tirarme\s+de/i,
  /cortarme\s+las\s+venas/i,
  /pastillas\s+para\s+morir/i,
  /ya\s+no\s+quiero\s+estar\s+(acá|aquí|viv)/i,
  /no\s+vale\s+la\s+pena\s+vivir/i,
  /suicid/i,
  /me\s+voy\s+a\s+matar/i,
  /mejor\s+(me\s+)?muero/i,
  /ojal[aá]\s+(me\s+)?muera/i,
  /no\s+aguanto\s+m[aá]s\s+(la\s+)?vida/i,
  /no\s+puedo\s+m[aá]s\s+con\s+(mi\s+)?vida/i,
];

const RESPUESTA_CRISIS = `🆘 Si estás pasando por un momento muy difícil, por favor contactá una línea de ayuda:

🇺🇾 Uruguay: 0800 0767 (Línea de la Vida)
🇦🇷 Argentina: (011) 5275-1135 (Centro de Asistencia al Suicida)
🇲🇽 México: 800 290 0024 (SAPTEL)
🇨🇴 Colombia: 106 (Línea 106)
🇨🇱 Chile: 600 360 7777 (Salud Responde)
🇪🇸 España: 024 (Línea de atención a la conducta suicida)
🌎 Internacional: https://findahelpline.com/

No estás solo/a. Hay personas capacitadas esperando para ayudarte. 💚`;

export function detectarCrisis(msg) {
  const msgLower = msg.toLowerCase();
  for (const patron of PATRONES_CRISIS) {
    if (patron.test(msgLower)) {
      return { detectado: true, respuesta: RESPUESTA_CRISIS };
    }
  }
  return { detectado: false };
}

// ═══════════════════════════════════════════════════════════════
// 2. INSULTOS
// ═══════════════════════════════════════════════════════════════

const INSULTOS_DIRIGIDOS = [
  /\b(hijo\s+de\s+puta|hdp|hija\s+de\s+puta)\b/i,
  /\b(pelotudo|pelotuda|boludo|boluda)\b/i,
  /\b(imb[eé]cil|idiota|tarado|tarada|estúpido|est[uú]pida)\b/i,
  /\b(basura|in[uú]til|pedazo\s+de\s+mierda)\b/i,
  /\bsos\s+(un[ao]?\s+)?(mierda|puto|puta|forro|forra|gil|gila|nabo|naba|inservible|porquer[ií]a)\b/i,
  /\bpedazo\s+de\b/i,
  /\bmet[eé]te(lo|la)?\b/i,
  /\bchup[aá](me|la)\b/i,
  /\band[aá]\s+a\s+(cagar|la\s+mierda|la\s+puta)/i,
  /\bla\s+concha\s+de\s+tu/i,
];

export function detectarInsulto(msg) {
  const msgLower = msg.toLowerCase();
  for (const patron of INSULTOS_DIRIGIDOS) {
    if (patron.test(msgLower)) {
      return { detectado: true, esGrave: true };
    }
  }
  return { detectado: false, esGrave: false };
}

// ═══════════════════════════════════════════════════════════════
// 3. SPAM EXPANDIDO
// ═══════════════════════════════════════════════════════════════

export function detectarSpam(msg) {
  const msgLower = msg.toLowerCase().trim();

  // Mensajes muy cortos (1-2 chars)
  if (msgLower.length < 3) {
    return { detectado: true, tipo: 'corto' };
  }

  // Solo emojis (pero NO dígitos - bug conocido con \p{Emoji})
  if (/^[\p{Emoji}\s!.]+$/u.test(msg.trim()) && !/\d/.test(msg)) {
    return { detectado: true, tipo: 'emojis' };
  }

  // Spam religioso / cadenas
  if (/^(amen|amén|bendiciones?|bendecido|am[eé]n\s+bendiciones?|bendiciones?\s+am[eé]n|dios\s+te\s+bendiga|que\s+dios|la\s+virgen|gloria\s+a\s+dios)[\s!.]*$/i.test(msgLower)) {
    return { detectado: true, tipo: 'religioso' };
  }

  // Buena vibra / suerte genérica
  if (/^(dame\s+suerte|buena\s+vibra|buenas\s+vibras|suerte|buenas\s+energias|buenas\s+energías)[\s!.]*$/i.test(msgLower)) {
    return { detectado: true, tipo: 'vibra' };
  }

  // Lotería / números
  if (/^(dame\s+los\s+n[uú]meros|5\s+de\s+oro|loter[ií]a|quiniela|n[uú]meros)/i.test(msgLower)) {
    return { detectado: true, tipo: 'loteria' };
  }

  // Cadenas de reenvío
  if (/comparte?\s+(esto|este|esta)|reenv[ií]a|pasa\s+(a|esto\s+a)\s+\d+\s+personas/i.test(msgLower)) {
    return { detectado: true, tipo: 'cadena' };
  }

  // Sorteos / premios falsos
  if (/^(ganaste|felicidades.*premio|sorteo.*gratis|has\s+sido\s+seleccionado)/i.test(msgLower)) {
    return { detectado: true, tipo: 'sorteo' };
  }

  // Solo puntuación
  if (/^[.!?…\s,;:]+$/.test(msg.trim())) {
    return { detectado: true, tipo: 'puntuacion' };
  }

  // Placeholders de ManyChat (audio, sticker, imagen sin contexto)
  if (/^\[(audio|sticker|imagen|video|gif|file)\]$/i.test(msg.trim())) {
    return { detectado: true, tipo: 'placeholder' };
  }

  return { detectado: false };
}

// ═══════════════════════════════════════════════════════════════
// 4. DESPEDIDA
// ═══════════════════════════════════════════════════════════════

export function detectarDespedida(msg, tieneHistorial = false) {
  const msgLower = msg.toLowerCase().trim();

  // Despedidas explícitas
  if (/^(chau|cha[uo]|adi[oó]s|bye|nos\s+vemos|hasta\s+(luego|pronto|la\s+pr[oó]xima)|me\s+voy|eso\s+era\s+todo|ya\s+est[aá]|nada\s+m[aá]s)[\s!.]*$/i.test(msgLower)) {
    return { detectado: true };
  }

  // "gracias" solo (sin pregunta adicional) como cierre
  if (/^(gracias|muchas\s+gracias|gracias\s+por\s+todo|te\s+agradezco)[\s!.🍀✨💚]*$/i.test(msgLower) && tieneHistorial) {
    return { detectado: true };
  }

  // "buenas noches" como despedida (solo si hay historial, sino es saludo)
  if (/^buenas\s+noches[\s!.]*$/i.test(msgLower) && tieneHistorial) {
    return { detectado: true };
  }

  return { detectado: false };
}

// ═══════════════════════════════════════════════════════════════
// 5. SIN DINERO
// ═══════════════════════════════════════════════════════════════

export function detectarSinDinero(msg) {
  const msgLower = msg.toLowerCase();
  const patrones = [
    /no\s+tengo\s+(la\s+)?plata/i,
    /no\s+me\s+alcanza/i,
    /estoy\s+sin\s+(plata|dinero)/i,
    /no\s+puedo\s+(pagar|gastar|comprar\s+ahora)/i,
    /cuando\s+cobre/i,
    /fin\s+de\s+mes/i,
    /fuera\s+de\s+(mi\s+)?presupuesto/i,
    /no\s+tengo\s+(dinero|para\s+gastar)/i,
    /est[oá]\s+(muy\s+)?car[oa]\s+para\s+m[ií]/i,
    /no\s+puedo\s+permitirme/i,
    /alg[uú]n\s+d[ií]a\s+(cuando|que)\s+pueda/i,
    /cuando\s+tenga\s+plata/i,
  ];

  for (const patron of patrones) {
    if (patron.test(msgLower)) {
      return { detectado: true };
    }
  }
  return { detectado: false };
}

// ═══════════════════════════════════════════════════════════════
// 6. DESAHOGO (quiere hablar, no comprar)
// ═══════════════════════════════════════════════════════════════

export function detectarDesahogo(msg) {
  const msgLower = msg.toLowerCase();

  // Intención explícita de hablar/desahogarse
  const patronesDesahogo = [
    /necesito\s+(hablar|desahogarme|que\s+me\s+escuchen|contar(le|te)\s+algo)/i,
    /solo\s+quer[ií]a\s+(hablar|charlar|conversar|desahogarme)/i,
    /puedo\s+(hablar|contarte|desahogarme)/i,
    /ten[ée]s\s+un\s+minuto\s+para\s+(escucharme|hablar)/i,
    /necesito\s+un\s+amigo/i,
    /no\s+tengo\s+(a\s+)?nadie\s+(con\s+quien|que\s+me\s+escuche)/i,
  ];

  // Drama emocional fuerte SIN intención de compra
  const patronesDrama = [
    /estoy\s+(muy\s+)?(mal|triste|destru[ií]d|deprimi|perdid)/i,
    /no\s+puedo\s+m[aá]s/i,
    /todo\s+me\s+sale\s+mal/i,
    /nadie\s+me\s+(quiere|entiende)/i,
    /me\s+siento\s+(sol[oa]|vac[ií]|perdid)/i,
    /no\s+s[eé]\s+qu[eé]\s+hacer\s+con\s+mi\s+vida/i,
    /me\s+dejaron/i,
    /coraz[oó]n\s+roto/i,
    /quiero\s+llorar/i,
  ];

  const tieneIntencionCompra = /precio|cu[aá]nto|guard|duende|compr|quiero\s+(uno|ver|un)|env[ií]o|tienda|protecci|abundancia|amor|sanaci/i.test(msgLower);

  // Desahogo explícito
  for (const patron of patronesDesahogo) {
    if (patron.test(msgLower)) {
      return { detectado: true, tipo: 'explicito' };
    }
  }

  // Drama emocional sin compra
  if (!tieneIntencionCompra) {
    for (const patron of patronesDrama) {
      if (patron.test(msgLower)) {
        return { detectado: true, tipo: 'drama' };
      }
    }
  }

  return { detectado: false };
}

// ═══════════════════════════════════════════════════════════════
// 7. TROLLING
// ═══════════════════════════════════════════════════════════════

export function detectarTrolling(msg) {
  const msgLower = msg.toLowerCase().trim();

  // Letras/caracteres repetidos (aaaaa, jjjjj, hahaha largo)
  if (/^(.)\1{4,}$/i.test(msgLower.replace(/\s/g, ''))) {
    return { detectado: true, tipo: 'repeticion' };
  }

  // Teclado aleatorio
  if (/^(asdf|qwerty|zxcv|asd|qwe|123456|abcdef)/i.test(msgLower)) {
    return { detectado: true, tipo: 'teclado' };
  }

  // Provocaciones sobre identidad del bot
  if (/sos\s+(una?\s+)?(m[aá]quina|robot|bot|programa|inteligencia\s+artificial|fake|falso|mentira|mentiroso)/i.test(msgLower)) {
    return { detectado: true, tipo: 'provocacion' };
  }

  // "esto es" + descrédito
  if (/esto\s+es\s+(mentira|falso|una?\s+estafa|fake|basura|porquer[ií]a)/i.test(msgLower)) {
    return { detectado: true, tipo: 'descredito' };
  }

  // Flirteo excesivo / roleplay
  if (/sos\s+(lind[oa]|tiern[oa]|gracios[oa]|divertid[oa]|sexo|sexi|sexy)/i.test(msgLower)) {
    return { detectado: true, tipo: 'flirteo' };
  }
  if (/te\s+(quiero|amo|adoro|deseo)/i.test(msgLower)) {
    return { detectado: true, tipo: 'flirteo' };
  }
  if (/podemos\s+ser\s+(amigos|novios|pareja)/i.test(msgLower)) {
    return { detectado: true, tipo: 'flirteo' };
  }
  if (/qu[eé]\s+(hac[eé]s|haces)\s+(en\s+tu\s+)?tiempo\s+libre/i.test(msgLower)) {
    return { detectado: true, tipo: 'flirteo' };
  }

  return { detectado: false };
}

// ═══════════════════════════════════════════════════════════════
// 8. IDIOMA
// ═══════════════════════════════════════════════════════════════

export function detectarIdioma(msg) {
  const msgLower = msg.toLowerCase();

  // Inglés
  const palabrasIngles = /\b(hello|hi there|how much|do you ship|I want|price|guardian|shipping|buy|purchase|what is this|can you|please|thank you|how does|is this real|credit card)\b/i;
  if (palabrasIngles.test(msg)) {
    return { idioma: 'en' };
  }

  // Portugués
  const palabrasPortugues = /\b(ol[aá]|quanto\s+custa|quero|pre[cç]o|voc[eê]s\s+enviam|como\s+funciona|posso|obrigad[oa]|bom\s+dia|boa\s+tarde|boa\s+noite|envio\s+para|como\s+comprar|cart[aã]o)\b/i;
  if (palabrasPortugues.test(msg)) {
    return { idioma: 'pt' };
  }

  return { idioma: null };
}

// ═══════════════════════════════════════════════════════════════
// 9. PREGUNTA REPETIDA
// ═══════════════════════════════════════════════════════════════

function normalizarTexto(texto) {
  return texto
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // quitar acentos
    .replace(/[^a-z0-9\s]/g, '') // solo letras y números
    .replace(/\b(el|la|los|las|un|una|unos|unas|de|del|al|en|por|para|con|que|y|o|me|te|se|lo|le|es|son|a)\b/g, '') // quitar artículos/preposiciones
    .replace(/\s+/g, ' ')
    .trim();
}

export function detectarPreguntaRepetida(msg, preguntasAnteriores = []) {
  if (preguntasAnteriores.length === 0) return { detectado: false };

  const msgNorm = normalizarTexto(msg);
  if (msgNorm.length < 5) return { detectado: false }; // muy corto para comparar

  for (const pregAnterior of preguntasAnteriores) {
    const pregNorm = normalizarTexto(pregAnterior);
    if (pregNorm.length < 5) continue;

    // Coincidencia exacta normalizada
    if (msgNorm === pregNorm) {
      return { detectado: true, preguntaOriginal: pregAnterior };
    }

    // Similitud: si comparten >70% de las palabras
    const palabrasMsg = new Set(msgNorm.split(' '));
    const palabrasPrev = new Set(pregNorm.split(' '));
    const interseccion = [...palabrasMsg].filter(p => palabrasPrev.has(p));
    const similitud = interseccion.length / Math.max(palabrasMsg.size, palabrasPrev.size);

    if (similitud > 0.7) {
      return { detectado: true, preguntaOriginal: pregAnterior };
    }
  }

  return { detectado: false };
}

// ═══════════════════════════════════════════════════════════════
// 10. SEÑAL DE COMPRA (para contadores de progreso)
// ═══════════════════════════════════════════════════════════════

export function tieneSeñalDeCompra(msg) {
  const msgLower = msg.toLowerCase();
  return /precio|cu[aá]nto|cuesta|vale|comprar|pagar|env[ií]o|lo\s+quiero|me\s+lo\s+llevo|me\s+interesa|carrito|tienda|agregar|quiero\s+(uno|ver|un)|disponible|stock|tienen/i.test(msgLower);
}

// ═══════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════

export default {
  detectarCrisis,
  detectarInsulto,
  detectarSpam,
  detectarDespedida,
  detectarSinDinero,
  detectarDesahogo,
  detectarTrolling,
  detectarIdioma,
  detectarPreguntaRepetida,
  tieneSeñalDeCompra
};
