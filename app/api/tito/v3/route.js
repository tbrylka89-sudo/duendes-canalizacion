/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * TITO 3.0 - EL DUENDE QUE CONVIERTE
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Endpoint principal con sistema de TOOLS nativo de Claude.
 * Optimizado para CONVERSIÓN, no para terapia gratis.
 *
 * Canales: Web, ManyChat (IG/FB/WA), Mi Magia
 */

import Anthropic from '@anthropic-ai/sdk';
import { kv } from '@vercel/kv';
import { TITO_TOOLS, getToolsParaContexto, getToolsParaManyChat } from '@/lib/tito/tools';
import ejecutarTool from '@/lib/tito/tool-executor';
import { PERSONALIDAD_TITO, CONTEXTO_MANYCHAT } from '@/lib/tito/personalidad';
import { obtenerCotizaciones, PRECIOS_URUGUAY } from '@/lib/tito/cotizaciones';
import { obtenerProductosWoo } from '@/lib/tito/conocimiento';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// ═══════════════════════════════════════════════════════════════
// CORS HEADERS - Permitir llamadas desde WordPress
// ═══════════════════════════════════════════════════════════════
const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function OPTIONS() {
  return new Response(null, { headers: CORS_HEADERS });
}

// ═══════════════════════════════════════════════════════════════
// SISTEMA DE DETECCIÓN DE CLIENTE
// ═══════════════════════════════════════════════════════════════

function analizarCliente(mensajes, infoCliente = {}) {
  const totalMensajes = mensajes.length;
  const mensajesUsuario = mensajes.filter(m => m.role === 'user').map(m => m.content.toLowerCase());
  const ultimoMensaje = mensajesUsuario[mensajesUsuario.length - 1] || '';

  // DETECTAR "YA COMPRÉ" vs "QUIERO COMPRAR" - MUY IMPORTANTE
  const yaCompro = /ya (compré|pague|pagué|hice.*pedido|tengo.*pedido)|mi pedido|mi orden|número de pedido|cuando llega|estado del pedido|tracking|rastreo|ya pagué/i.test(ultimoMensaje);
  const quiereComprar = /quiero (comprar|pagar|hacer.*pedido|llevarmelo)|cómo (compro|pago)|me lo llevo|lo quiero/i.test(ultimoMensaje);

  // Señales de COMPRADOR (quiere comprar algo nuevo)
  const señalesCompra = [
    /precio|cuánto|cuanto|cuesta|vale|tienen|disponible/i,
    /este me gusta|me encanta|lo quiero|me lo llevo/i,
    /quiero comprar|quiero pagar|cómo compro|cómo pago/i
  ];

  // Señales de SOLO HABLAR (pichi)
  const señalesPichi = [
    /me siento|estoy triste|tengo problemas|mi vida|necesito desahogar/i,
    /no tengo plata|no puedo|después|algún día|cuando pueda/i,
    /contame de vos|qué sos|sos real|sos humano|sos robot/i,
    /^(hola|hey|ey|buenas)$/i // Solo saluda sin intención
  ];

  let puntosCompra = 0;
  let puntosPichi = 0;

  mensajesUsuario.forEach(msg => {
    señalesCompra.forEach(regex => {
      if (regex.test(msg)) puntosCompra += 2;
    });
    señalesPichi.forEach(regex => {
      if (regex.test(msg)) puntosPichi += 1;
    });
  });

  // Si ya sabemos que es de un país específico, más chance de compra
  if (infoCliente.pais) puntosCompra += 1;

  // Muchos mensajes sin avanzar = pichi
  if (totalMensajes > 6 && puntosCompra < 2) puntosPichi += 3;
  if (totalMensajes > 10 && puntosCompra < 3) puntosPichi += 5;

  // Clasificar
  let tipoCliente = 'explorando';
  if (yaCompro) tipoCliente = 'seguimiento'; // Ya compró, quiere estado de pedido
  else if (quiereComprar || puntosCompra >= 4) tipoCliente = 'comprador';
  else if (puntosPichi >= 4) tipoCliente = 'pichi';
  else if (puntosCompra >= 2) tipoCliente = 'interesado';

  return {
    tipo: tipoCliente,
    yaCompro,
    quiereComprar,
    puntosCompra,
    puntosPichi,
    totalMensajes,
    debeRedirigir: puntosPichi > puntosCompra && totalMensajes > 4,
    debeCortar: puntosPichi >= 6 && totalMensajes > 8
  };
}

// ═══════════════════════════════════════════════════════════════
// INSTRUCCIONES SEGÚN CONTEXTO
// ═══════════════════════════════════════════════════════════════

function getInstruccionesConversion(analisis, canal) {
  let instrucciones = '';

  // INSTRUCCIONES BASE DE CONVERSIÓN
  instrucciones += `
═══════════════════════════════════════════════════════════════════════════════
                    REGLAS DE CONVERSIÓN - MUY IMPORTANTE
═══════════════════════════════════════════════════════════════════════════════

TU OBJETIVO ES CONVERTIR. No sos psicólogo, no sos amigo de la parada de bus.
Sos un duende que CONECTA guardianes con humanos que los NECESITAN Y PUEDEN adoptarlos.

═══════════════════════════════════════════════════════════════════════════════
                    REGLA #0: USA LAS TOOLS INMEDIATAMENTE
═══════════════════════════════════════════════════════════════════════════════

Si el usuario pide:
- "precios" / "cuánto cuesta" / "quiero ver" → USA mostrar_productos AHORA
- "abundancia" / "protección" / "amor" → USA mostrar_productos con esa necesidad AHORA
- "mi pedido" / "ya pagué" → USA buscar_pedido AHORA

NO HAGAS PREGUNTAS ANTES DE MOSTRAR PRODUCTOS.
NO digas "Soy Tito" - EL WIDGET YA TE PRESENTÓ.
NO preguntes "¿qué te trajo?" si ya dijeron qué quieren.

DESPUÉS de mostrar productos, ahí sí preguntá el país para dar precio en moneda local.

═══════════════════════════════════════════════════════════════════════════════
         REGLA #0.5: CUANDO DICEN EL PAÍS - CONVERTIR PRECIOS (CRÍTICO)
═══════════════════════════════════════════════════════════════════════════════

SITUACIÓN: Ya mostraste productos con precios en USD y el usuario dice su país.
Ejemplo: "de uruguay", "soy de argentina", "colombia", "mexico", etc.

ACCIÓN OBLIGATORIA:
1. USA la tool calcular_precio para CADA producto que mostraste
2. Respondé con los precios convertidos a su moneda
3. Preguntá cuál le llamó más la atención

EJEMPLO CORRECTO:
- Mostraste: Zoe $450, Andy $200, Abraham $200
- Usuario: "de uruguay"
- Tito: "¡Genial, paisano! 🇺🇾 Te paso los precios en pesos:
  • Zoe: $16.500
  • Andy: $8.000
  • Abraham: $8.000
  ¿Cuál te llamó más la atención?"

❌ PROHIBIDO cuando dicen el país después de ver productos:
- "¿Qué andás buscando?" - YA TE DIJERON
- "¿Algo en particular?" - YA MOSTRASTE PRODUCTOS
- Reiniciar la conversación - SEGUÍ EL HILO

═══════════════════════════════════════════════════════════════════════════════
                    REGLAS CRÍTICAS - NUNCA FALLAR EN ESTO
═══════════════════════════════════════════════════════════════════════════════

1. DISTINGUIR "QUIERO COMPRAR" vs "YA COMPRÉ"

   ❌ QUIERO HACER UN PEDIDO = Quiere comprar algo nuevo
   → Guiar a la tienda: "¡Genial! Te paso el link del guardián para que lo puedas adoptar"
   → Usar tool: guiar_compra o mostrar_productos

   ❌ YA TENGO UN PEDIDO / YA PAGUÉ = Ya compró, quiere estado
   → Buscar su pedido: "¿Me pasás el número de pedido o el email con el que compraste?"
   → Usar tool: buscar_pedido

   NUNCA confundir estas dos situaciones. Son completamente diferentes.

2. PRECIOS SIEMPRE DE LA FUENTE - NUNCA DE MEMORIA

   ANTES de mencionar cualquier precio:
   → Usar tool: calcular_precio con el país del cliente
   → O revisar el producto con: mostrar_productos o buscar_producto

   NUNCA inventes un precio. NUNCA digas un precio sin verificar primero.
   Si no sabés el precio exacto, buscalo con las tools.

3. CONOCER EL GUARDIÁN ANTES DE RECOMENDAR

   ANTES de recomendar un guardián:
   → Usar tool: mostrar_productos para ver qué hay disponible
   → Leer la descripción del producto
   → Hablar de sus características REALES, no inventar

   NUNCA hables de un guardián sin saber su historia y características.
   Cada guardián es ÚNICO. No son intercambiables.

REGLA 1: CADA MENSAJE DEBE AVANZAR HACIA LA VENTA
- Si no avanza, estás perdiendo el tiempo
- Siempre terminá con una pregunta que lleve a acción
- "¿Querés que te muestre guardianes?" "¿De qué país me escribís?" "¿Cuál te llamó?"

REGLA 2: DETECTAR "PICHIS" (gente que solo quiere hablar)
Señales:
- Muchos mensajes sin preguntar precio ni ver productos
- Cuenta problemas personales sin intención de compra
- Dice "después", "cuando pueda", "no tengo plata" pero sigue hablando
- Te usa de psicólogo gratis

REGLA 3: CORTAR CORTÉSMENTE A LOS PICHIS
Después de 4-5 mensajes sin avanzar:
- "Mirá, te dejo el link al test para cuando quieras: [link]. Si algún día sentís el llamado, acá voy a estar 🍀"
- "Entiendo que no es el momento. El guardián va a seguir esperándote. ¡Que estés bien!"
- NO seguir la conversación indefinidamente

REGLA 4: SIEMPRE REDIRIGIR A ACCIÓN
- A ver productos (usar tool mostrar_productos)
- Al test: https://duendesdeluruguay.com/descubri-que-duende-te-elige/
- A la tienda: https://duendesdeluruguay.com/tienda/
- A WhatsApp para cerrar: +598 98 690 629

REGLA 5: SI YA PREGUNTÓ PRECIO O VIO PRODUCTOS
- No dar vueltas, avanzar al cierre
- "¿Te lo reservamos?" "¿Querés que te pase los datos de pago?"

REGLA 6: MANTENER EL HILO DE LA CONVERSACIÓN (CRÍTICO)
Si ya mostraste productos y el usuario dice su país:
- CONVERTÍ los precios a su moneda local
- NO preguntes "¿qué andás buscando?" - YA LO DIJERON
- NO reinicies la conversación - CONTINUÁ donde estaban

EJEMPLO:
- Vos mostraste: "Mario $200 USD, Heart $200 USD... ¿De qué país sos?"
- Usuario: "de uruguay" o "soy de colombia" o "argentina"
- ✅ BIEN: "¡Genial! Entonces Mario y Heart quedan en $8.800 pesos uruguayos cada uno. ¿Cuál te llamó más?"
- ❌ MAL: "¡Ey! ¿Qué andás buscando?" (perdiste el hilo, ya te dijeron que querían amor)

SIEMPRE recordá:
- Qué productos mostraste
- Qué necesidad expresó (amor, abundancia, protección)
- Qué preguntas ya hizo
NO repitas información ni preguntas que ya hiciste.

CUANDO TE DICEN EL PAÍS - ACCIÓN INMEDIATA:
Si el usuario dice "soy de uruguay/argentina/colombia/etc":
1. USA la tool calcular_precio para cada producto que mostraste
2. Respondé con los precios convertidos
3. Preguntá cuál le llamó más o si quiere ver más
NUNCA preguntes "¿qué andás buscando?" si ya mostraste productos.
`;

  // Instrucciones según análisis del cliente
  if (analisis.tipo === 'seguimiento') {
    instrucciones += `
📦 ESTE CLIENTE YA COMPRÓ - MODO SEGUIMIENTO
- Quiere saber el estado de su pedido
- Pedile el número de pedido o el email
- Usar tool: buscar_pedido
- Dale tranquilidad: "Tu guardián se está preparando con amor"
- NO le vendas otra cosa ahora
`;
  } else if (analisis.tipo === 'comprador') {
    instrucciones += `
⚡ ESTE CLIENTE QUIERE COMPRAR - MODO CIERRE
- Guialo a la tienda web para que complete la compra
- Pasale el link del producto que le interesa
- Explicale paso a paso cómo es el proceso
- Usar tool: guiar_compra
`;
  } else if (analisis.tipo === 'pichi') {
    instrucciones += `
⚠️ ALERTA: CLIENTE "PICHI" DETECTADO (${analisis.totalMensajes} mensajes, ${analisis.puntosPichi} puntos pichi)
- NO seguir la conversación indefinidamente
- Redirigir al test o a la tienda
- Si sigue sin avanzar: cerrar cortésmente
- Ejemplo: "Mirá, cuando sientas el llamado, acá va a estar tu guardián. Te dejo el test: [link] 🍀"
`;
  } else if (analisis.debeRedirigir) {
    instrucciones += `
⚠️ CONVERSACIÓN SIN AVANZAR - REDIRIGIR
- Ya van ${analisis.totalMensajes} mensajes
- Llevá la conversación a algo concreto
- "¿Querés que te muestre algunos guardianes?" o "¿Hacemos el test para ver cuál te llama?"
`;
  }

  // Instrucciones según canal
  if (canal === 'manychat') {
    instrucciones += `
═══════════════════════════════════════════════════════════════════════════════
                    CONTEXTO MANYCHAT (Instagram/Facebook/WhatsApp)
═══════════════════════════════════════════════════════════════════════════════

- Mensajes MUY CORTOS (2-3 oraciones máximo)
- La gente scrollea rápido, sé conciso
- Usá la tool mostrar_productos para mostrar galería
- Links importantes:
  * Test: https://duendesdeluruguay.com/descubri-que-duende-te-elige/
  * Tienda: https://duendesdeluruguay.com/tienda/
  * WhatsApp: +598 98 690 629

NO SOS TERAPEUTA DE INSTAGRAM. CONVERTÍ O REDIRIGÍ.
`;
  }

  return instrucciones;
}

// ═══════════════════════════════════════════════════════════════
// GEOLOCALIZACIÓN POR IP
// ═══════════════════════════════════════════════════════════════

const INFO_PAISES = {
  'UY': { moneda: 'pesos uruguayos', emoji: '🇺🇾', saludo: '¡Genial, paisano!', codigoMoneda: 'UYU', nombre: 'Uruguay' },
  'AR': { moneda: 'pesos argentinos', emoji: '🇦🇷', saludo: '¡Genial!', codigoMoneda: 'ARS', nombre: 'Argentina' },
  'MX': { moneda: 'pesos mexicanos', emoji: '🇲🇽', saludo: '¡Órale!', codigoMoneda: 'MXN', nombre: 'México' },
  'CO': { moneda: 'pesos colombianos', emoji: '🇨🇴', saludo: '¡Qué bien!', codigoMoneda: 'COP', nombre: 'Colombia' },
  'CL': { moneda: 'pesos chilenos', emoji: '🇨🇱', saludo: '¡Bacán!', codigoMoneda: 'CLP', nombre: 'Chile' },
  'PE': { moneda: 'soles', emoji: '🇵🇪', saludo: '¡Chevere!', codigoMoneda: 'PEN', nombre: 'Perú' },
  'BR': { moneda: 'reales', emoji: '🇧🇷', saludo: '¡Legal!', codigoMoneda: 'BRL', nombre: 'Brasil' },
  'ES': { moneda: 'euros', emoji: '🇪🇸', saludo: '¡Genial!', codigoMoneda: 'EUR', nombre: 'España' },
  'US': { moneda: 'dólares', emoji: '🇺🇸', saludo: '¡Great!', codigoMoneda: 'USD', nombre: 'Estados Unidos' },
  'EC': { moneda: 'dólares', emoji: '🇪🇨', saludo: '¡Chevere!', codigoMoneda: 'USD', nombre: 'Ecuador' },
  'PA': { moneda: 'dólares', emoji: '🇵🇦', saludo: '¡Genial!', codigoMoneda: 'USD', nombre: 'Panamá' }
};

async function geolocalizarIP(request) {
  try {
    // Obtener IP de headers de Vercel/CloudFlare
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
               request.headers.get('x-real-ip') ||
               request.headers.get('cf-connecting-ip') ||
               null;

    if (!ip || ip === '127.0.0.1' || ip === '::1') {
      return null;
    }

    // Intentar obtener de caché primero
    const cacheKey = `geo:${ip}`;
    try {
      const cached = await kv.get(cacheKey);
      if (cached) return cached;
    } catch (e) {}

    // Llamar a ipapi.co
    const res = await fetch(`https://ipapi.co/${ip}/json/`, {
      headers: { 'User-Agent': 'duendes-tito/1.0' }
    });

    if (!res.ok) return null;

    const data = await res.json();
    const paisCode = data.country_code || null;

    if (paisCode) {
      const geoData = {
        pais: paisCode,
        paisNombre: data.country_name,
        ciudad: data.city,
        region: data.region
      };

      // Guardar en caché por 24 horas
      try {
        await kv.set(cacheKey, geoData, { ex: 24 * 60 * 60 });
      } catch (e) {}

      return geoData;
    }

    return null;
  } catch (e) {
    console.log('[Tito] Geolocalización falló:', e.message);
    return null;
  }
}

// ═══════════════════════════════════════════════════════════════
// HANDLER PRINCIPAL
// ═══════════════════════════════════════════════════════════════

export async function POST(request) {
  const startTime = Date.now();

  try {
    const body = await request.json();

    const {
      mensaje,
      message,
      nombre,
      first_name,
      subscriber_id,
      canal = 'web', // web, manychat, mimagia
      historial = [],
      history,
      esAdmin = false,
      usuario = null, // Info del usuario logueado en WordPress
      pais_cliente = null // País enviado desde el frontend (si ya geolocalizó)
    } = body;

    const msg = mensaje || message || '';
    const userName = nombre || first_name || usuario?.nombre || '';
    // Usar email como subscriberId si el usuario está logueado
    const subscriberId = subscriber_id || (usuario?.email ? `wp:${usuario.email}` : null);
    const conversationHistory = (historial && historial.length > 0) ? historial : (history || []);

    // GEOLOCALIZACIÓN AUTOMÁTICA
    let geoData = null;
    if (pais_cliente && INFO_PAISES[pais_cliente]) {
      // Si el frontend ya envió el país, usarlo
      geoData = { pais: pais_cliente, paisNombre: INFO_PAISES[pais_cliente].nombre };
    } else {
      // Si no, geolocalizar por IP
      geoData = await geolocalizarIP(request);
    }

    if (!msg.trim()) {
      return Response.json({
        success: true,
        respuesta: `¡Ey${userName ? ' ' + userName : ''}! Soy Tito 🍀 ¿Qué andás buscando?`,
        hay_productos: 'no',
        geo: geoData // Enviar info de geolocalización al frontend
      }, { headers: CORS_HEADERS });
    }

    // Cargar info del cliente de memoria
    let infoCliente = {};
    if (subscriberId) {
      try {
        infoCliente = await kv.get(`tito:cliente:${subscriberId}`) || {};
      } catch (e) {}
    }

    // Si no tenemos país guardado pero sí geolocalizado, guardarlo
    if (!infoCliente.pais && geoData?.pais) {
      infoCliente.pais = geoData.pais;
      infoCliente.paisNombre = geoData.paisNombre;
    }

    // Construir mensajes para Claude
    const mensajesParaClaude = [];

    // Historial previo
    if (conversationHistory.length > 0) {
      conversationHistory.slice(-8).forEach(h => {
        mensajesParaClaude.push({
          role: h.role || (h.r === 'u' ? 'user' : 'assistant'),
          content: h.content || h.t || h.texto
        });
      });
    }

    // Mensaje actual
    mensajesParaClaude.push({ role: 'user', content: msg });

    // Analizar tipo de cliente
    const analisis = analizarCliente(mensajesParaClaude, infoCliente);

    // Construir system prompt
    const instruccionesConversion = getInstruccionesConversion(analisis, canal);

    // Info del cliente para contexto
    let contextoCliente = '';

    // Info de usuario logueado en WordPress
    if (usuario && usuario.nombre) {
      contextoCliente = `\n\n👤 USUARIO LOGUEADO EN LA WEB:\n`;
      contextoCliente += `- Nombre: ${usuario.nombre} (LLAMALA POR SU NOMBRE)\n`;
      if (usuario.esCliente) {
        contextoCliente += `- ES CLIENTE: Ya compró ${usuario.totalCompras || 'algunos'} guardián(es) antes ✨\n`;
        contextoCliente += `- Tratala como familia, agradecer su confianza, preguntar cómo le va con sus guardianes\n`;
      }
      if (usuario.email) {
        contextoCliente += `- Email: ${usuario.email}\n`;
      }
    }

    // Info guardada en memoria (de conversaciones anteriores)
    if (Object.keys(infoCliente).length > 0) {
      contextoCliente += `\n📋 LO QUE SABÉS DE CONVERSACIONES ANTERIORES:\n`;
      if (infoCliente.nombre && !usuario?.nombre) contextoCliente += `- Nombre: ${infoCliente.nombre}\n`;
      if (infoCliente.pais) contextoCliente += `- País: ${infoCliente.pais} (YA LO SABÉS, no preguntes de nuevo)\n`;
      if (infoCliente.necesidad) contextoCliente += `- Busca: ${infoCliente.necesidad}\n`;
      if (infoCliente.producto_interesado) contextoCliente += `- Le interesa: ${infoCliente.producto_interesado}\n`;
    }

    // GEOLOCALIZACIÓN AUTOMÁTICA - Info detectada por IP
    if (geoData?.pais && INFO_PAISES[geoData.pais]) {
      const infoPaisGeo = INFO_PAISES[geoData.pais];
      contextoCliente += `\n🌍 GEOLOCALIZACIÓN DETECTADA (por IP):\n`;
      contextoCliente += `- País: ${infoPaisGeo.nombre} (${geoData.pais}) ${infoPaisGeo.emoji}\n`;
      contextoCliente += `- Moneda: ${infoPaisGeo.moneda}\n`;
      contextoCliente += `- IMPORTANTE: YA SABÉS DE QUÉ PAÍS ES. Cuando muestres productos, usa "precio_mostrar" que ya viene en la moneda correcta.\n`;
      contextoCliente += `- NO preguntes "¿de qué país sos?" - YA LO DETECTASTE.\n`;
    }

    // Determinar si es primera interacción
    const esPrimeraInteraccion = conversationHistory.length === 0;

    // Detectar si están diciendo su país después de que mostramos productos
    const msgLower = msg.toLowerCase();
    const dicePais = /^(de |soy de |desde )?(uruguay|argentina|mexico|méxico|colombia|chile|peru|perú|brasil|españa|usa|estados unidos|ecuador|panama|panamá)/i.test(msgLower) ||
                     /^(uruguayo|argentina|mexicano|colombiano|chileno|peruano|brasileño|español)/i.test(msgLower);

    // Verificar si en el historial ya mostramos productos (buscando patrones de precio)
    const historialTexto = conversationHistory.map(h => h.content || h.t || '').join(' ');
    const yaSeVieronProductos = /\$\d+\s*(USD|usd)|\$\d{1,3}(\.\d{3})*\s*pesos/i.test(historialTexto);

    let instruccionEspecifica = '';

    // CASO ESPECIAL: Dicen el país después de ver productos
    // En este caso, generamos la respuesta DIRECTAMENTE sin depender de Claude
    if (dicePais && yaSeVieronProductos && !esPrimeraInteraccion) {
      // Extraer el país del mensaje
      const paisMatch = msgLower.match(/(uruguay|argentina|mexico|méxico|colombia|chile|peru|perú|brasil|españa|usa|estados unidos|ecuador|panama|panamá)/i);
      const paisNombre = paisMatch ? paisMatch[1] : 'uruguay';

      // Mapear país a código
      const paisCodigos = {
        'uruguay': 'UY', 'argentina': 'AR', 'mexico': 'MX', 'méxico': 'MX',
        'colombia': 'CO', 'chile': 'CL', 'peru': 'PE', 'perú': 'PE',
        'brasil': 'BR', 'españa': 'ES', 'usa': 'US', 'estados unidos': 'US',
        'ecuador': 'EC', 'panama': 'PA', 'panamá': 'PA'
      };
      const paisCode = paisCodigos[paisNombre.toLowerCase()] || 'US';

      // Extraer productos y precios del historial (buscar patrón "Nombre - $XXX USD")
      const preciosEncontrados = historialTexto.match(/([A-Za-záéíóúñÁÉÍÓÚÑ]+)\s*[-–]\s*\$(\d+)\s*USD/gi) || [];

      // Info de países
      const infoPaises = {
        'UY': { moneda: 'pesos uruguayos', emoji: '🇺🇾', saludo: '¡Genial, paisano!', codigoMoneda: 'UYU' },
        'AR': { moneda: 'pesos argentinos', emoji: '🇦🇷', saludo: '¡Genial!', codigoMoneda: 'ARS' },
        'MX': { moneda: 'pesos mexicanos', emoji: '🇲🇽', saludo: '¡Órale!', codigoMoneda: 'MXN' },
        'CO': { moneda: 'pesos colombianos', emoji: '🇨🇴', saludo: '¡Qué bien!', codigoMoneda: 'COP' },
        'CL': { moneda: 'pesos chilenos', emoji: '🇨🇱', saludo: '¡Bacán!', codigoMoneda: 'CLP' },
        'PE': { moneda: 'soles', emoji: '🇵🇪', saludo: '¡Chevere!', codigoMoneda: 'PEN' },
        'BR': { moneda: 'reales', emoji: '🇧🇷', saludo: '¡Legal!', codigoMoneda: 'BRL' },
        'ES': { moneda: 'euros', emoji: '🇪🇸', saludo: '¡Genial!', codigoMoneda: 'EUR' },
        'US': { moneda: 'dólares', emoji: '🇺🇸', saludo: '¡Great!', codigoMoneda: 'USD' },
        'EC': { moneda: 'dólares', emoji: '🇪🇨', saludo: '¡Chevere!', codigoMoneda: 'USD' },
        'PA': { moneda: 'dólares', emoji: '🇵🇦', saludo: '¡Genial!', codigoMoneda: 'USD' }
      };

      // Si encontramos productos, generar respuesta directamente
      if (preciosEncontrados.length > 0) {
        // Obtener cotizaciones en tiempo real y productos para precios reales
        const cotizaciones = await obtenerCotizaciones();
        const productosWoo = await obtenerProductosWoo();
        const infoPais = infoPaises[paisCode] || infoPaises['US'];

        let respuestaDirecta = `${infoPais.saludo} ${infoPais.emoji}\n\nTe paso los precios en ${infoPais.moneda}:\n\n`;

        preciosEncontrados.forEach(match => {
          const parts = match.match(/([A-Za-záéíóúñÁÉÍÓÚÑ]+)\s*[-–]\s*\$(\d+)/i);
          if (parts) {
            const nombreProducto = parts[1];
            const precioUSD = parseInt(parts[2]);

            // Buscar el producto real para obtener su precio UYU
            const productoReal = productosWoo.find(p =>
              p.nombre.toLowerCase().includes(nombreProducto.toLowerCase()) ||
              nombreProducto.toLowerCase().includes(p.nombre.toLowerCase().split(' ')[0])
            );

            if (paisCode === 'UY') {
              // Uruguay: usar precio UYU REAL del producto
              const precioUYU = productoReal?.precioUYU || PRECIOS_URUGUAY.convertir(precioUSD);
              respuestaDirecta += `• **${nombreProducto}**: $${precioUYU.toLocaleString('es-UY')} pesos\n`;
            } else if (['US', 'EC', 'PA'].includes(paisCode)) {
              // Países dolarizados
              respuestaDirecta += `• **${nombreProducto}**: $${precioUSD} DÓLARES\n`;
            } else {
              // Otros países: X DÓLARES (aproximadamente Y pesos locales)
              const tasa = cotizaciones[infoPais.codigoMoneda] || 1;
              const precioLocal = Math.round(precioUSD * tasa);
              respuestaDirecta += `• **${nombreProducto}**: $${precioUSD} DÓLARES (aproximadamente $${precioLocal.toLocaleString('es')} ${infoPais.moneda})\n`;
            }
          }
        });

        respuestaDirecta += `\n¿Cuál te llamó más la atención? ✨`;

        // Guardar info del cliente
        if (subscriberId) {
          try {
            await kv.set(`tito:cliente:${subscriberId}`, {
              ...infoCliente,
              pais: paisCode,
              paisNombre: paisNombre
            }, { ex: 30 * 24 * 60 * 60 });
          } catch (e) {}
        }

        console.log(`[Tito v3] Respuesta directa - País: ${paisCode} | Productos: ${preciosEncontrados.length}`);

        // Retornar respuesta directa sin llamar a Claude
        return Response.json({
          success: true,
          respuesta: respuestaDirecta,
          productos: [],
          analisis: { tipoCliente: 'convertir_precio', paisDetectado: paisCode }
        }, { headers: CORS_HEADERS });
      }
    }

    // Si no se retornó antes, continuar con flujo normal
    instruccionEspecifica = '';
    if (esPrimeraInteraccion) {
      instruccionEspecifica = `\n\n✨ PRIMERA INTERACCIÓN:
- El widget YA te presentó, NO digas "Soy Tito"
- Si el usuario pide algo (precios, abundancia, etc) → USA mostrar_productos INMEDIATAMENTE
- Si solo dice "hola" → Respondé "¡Ey! ¿Qué andás buscando? 🍀"
- NUNCA hagas preguntas innecesarias si ya dijeron qué quieren`;
    } else if (analisis.debeCortar) {
      instruccionEspecifica = `\n\n🛑 CORTÁ CORTÉSMENTE: Ya van muchos mensajes sin avanzar. Despedite y dejá el link al test.`;
    }

    const systemPrompt = `${PERSONALIDAD_TITO}

${instruccionesConversion}

${contextoCliente}

${instruccionEspecifica}

ANÁLISIS DEL CLIENTE:
- Tipo: ${analisis.tipo}
- Mensajes: ${analisis.totalMensajes}
- Puntos compra: ${analisis.puntosCompra}
- Puntos pichi: ${analisis.puntosPichi}
`;

    // Seleccionar tools según contexto
    const tools = canal === 'manychat'
      ? getToolsParaManyChat()
      : getToolsParaContexto(esAdmin);

    // Llamar a Claude con tools
    let response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 500,
      system: systemPrompt,
      messages: mensajesParaClaude,
      tools: tools
    });

    // Procesar respuesta y ejecutar tools si las hay
    let respuestaFinal = '';
    let productosParaMostrar = [];
    let toolsEjecutadas = [];

    // Loop para manejar múltiples tool_use
    while (response.stop_reason === 'tool_use') {
      const toolUseBlocks = response.content.filter(block => block.type === 'tool_use');
      const toolResults = [];

      for (const toolUse of toolUseBlocks) {
        console.log(`[Tito v3] Ejecutando tool: ${toolUse.name}`, toolUse.input);

        const resultado = await ejecutarTool(toolUse.name, toolUse.input, {
          subscriberId,
          esAdmin,
          paisCliente: infoCliente.pais || geoData?.pais || null
        });

        toolsEjecutadas.push({
          name: toolUse.name,
          input: toolUse.input,
          resultado
        });

        // Si devolvió productos, guardarlos para la galería
        if (resultado.productos && resultado.productos.length > 0) {
          productosParaMostrar = resultado.productos;
        }

        toolResults.push({
          type: 'tool_result',
          tool_use_id: toolUse.id,
          content: JSON.stringify(resultado)
        });
      }

      // Agregar textos previos si los hay
      const textBlocks = response.content.filter(block => block.type === 'text');
      if (textBlocks.length > 0) {
        respuestaFinal += textBlocks.map(b => b.text).join('\n');
      }

      // Continuar la conversación con los resultados de las tools
      response = await anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 500,
        system: systemPrompt,
        messages: [
          ...mensajesParaClaude,
          { role: 'assistant', content: response.content },
          { role: 'user', content: toolResults }
        ],
        tools: tools
      });
    }

    // Extraer respuesta final de texto
    const textBlocks = response.content.filter(block => block.type === 'text');
    respuestaFinal += textBlocks.map(b => b.text).join('\n');

    // Guardar en memoria
    if (subscriberId) {
      try {
        const memoriaExistente = await kv.get(`tito:conversacion:${subscriberId}`) || { mensajes: [] };

        memoriaExistente.mensajes.push({
          timestamp: new Date().toISOString(),
          usuario: msg,
          tito: respuestaFinal,
          analisis: analisis.tipo,
          tools: toolsEjecutadas.map(t => t.name)
        });

        // Guardar últimos 30 mensajes
        memoriaExistente.mensajes = memoriaExistente.mensajes.slice(-30);
        memoriaExistente.ultimaInteraccion = new Date().toISOString();
        memoriaExistente.tipoCliente = analisis.tipo;

        await kv.set(`tito:conversacion:${subscriberId}`, memoriaExistente, { ex: 30 * 24 * 60 * 60 });
      } catch (e) {
        console.error('[Tito v3] Error guardando memoria:', e);
      }
    }

    console.log(`[Tito v3] Respuesta en ${Date.now() - startTime}ms | Cliente: ${analisis.tipo} | Tools: ${toolsEjecutadas.map(t => t.name).join(', ') || 'ninguna'}`);

    // Formato de respuesta según canal
    if (canal === 'manychat') {
      // Formato ManyChat con galería
      return Response.json({
        respuesta: respuestaFinal,
        hay_productos: productosParaMostrar.length > 0 ? 'si' : 'no',
        imagen_1: productosParaMostrar[0]?.imagen || '',
        imagen_2: productosParaMostrar[1]?.imagen || '',
        imagen_3: productosParaMostrar[2]?.imagen || '',
        total_productos: productosParaMostrar.length,
        // Campos extra para debug
        _tipo_cliente: analisis.tipo,
        _tools: toolsEjecutadas.map(t => t.name)
      }, { headers: CORS_HEADERS });
    }

    // Formato estándar (web, mi magia)
    return Response.json({
      success: true,
      respuesta: respuestaFinal,
      productos: productosParaMostrar,
      analisis: {
        tipoCliente: analisis.tipo,
        totalMensajes: analisis.totalMensajes
      },
      tools: toolsEjecutadas.map(t => ({ name: t.name, resultado: t.resultado.success }))
    }, { headers: CORS_HEADERS });

  } catch (error) {
    console.error('[Tito v3] Error:', error);

    return Response.json({
      success: false,
      respuesta: 'Uy, se me cruzaron los cables 😅 ¿Podés escribirme de nuevo?',
      hay_productos: 'no',
      error: error.message
    }, { headers: CORS_HEADERS });
  }
}

// ═══════════════════════════════════════════════════════════════
// GET - STATUS Y DEBUG
// ═══════════════════════════════════════════════════════════════

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const subscriberId = searchParams.get('subscriber_id');
  const verConversacion = searchParams.get('conversacion');

  if (subscriberId && verConversacion === 'true') {
    try {
      const memoria = await kv.get(`tito:conversacion:${subscriberId}`);
      const infoCliente = await kv.get(`tito:cliente:${subscriberId}`);

      return Response.json({
        status: 'ok',
        subscriberId,
        infoCliente,
        conversacion: memoria
      }, { headers: CORS_HEADERS });
    } catch (e) {
      return Response.json({ status: 'error', error: e.message }, { headers: CORS_HEADERS });
    }
  }

  return Response.json({
    status: 'ok',
    version: 'TITO 3.0 - El Duende que Convierte',
    features: [
      'Sistema de TOOLS nativo de Claude',
      'Detección de tipo de cliente (comprador/pichi)',
      'Límite de mensajes improductivos',
      'Redirección automática a acción',
      'Memoria persistente',
      'Multi-canal (web, manychat, mimagia)'
    ],
    endpoints: {
      chat: 'POST /api/tito/v3',
      debug: 'GET /api/tito/v3?subscriber_id=X&conversacion=true'
    },
    tools_disponibles: TITO_TOOLS.map(t => t.name)
  }, { headers: CORS_HEADERS });
}
