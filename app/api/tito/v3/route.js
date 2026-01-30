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
// Personalidad MEDIA - balance entre tokens y funcionalidad
import { PERSONALIDAD_TITO_MEDIA as PERSONALIDAD_TITO, CONTEXTO_MANYCHAT_MEDIA as CONTEXTO_MANYCHAT } from '@/lib/tito/personalidad-media';
import { prepararMensajesOptimizados } from '@/lib/tito/personalidad-compacta';
import { obtenerCotizaciones, PRECIOS_URUGUAY } from '@/lib/tito/cotizaciones';
import { obtenerProductosWoo } from '@/lib/tito/conocimiento';
import { detectarObjecion, getInstruccionesObjecion } from '@/lib/tito/objeciones';
import {
  generarPruebaSocialCategoria,
  generarPruebaSocialGeneral,
  generarEscasezSutil,
  generarReciprocidad,
  generarLabeling,
  generarPaquetePersuasion
} from '@/lib/tito/persuasion';
import {
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
} from '@/lib/tito/reglas-comportamiento';

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
    /^(hola|hey|ey|buenas)$/i, // Solo saluda sin intención
    /solo (quiero|quería) (hablar|charlar|conversar)/i,
    /sos (lindo|tierno|gracioso|divertido)/i,
    /te (quiero|amo|adoro)/i,
    /podemos ser amigos/i,
    /qué (hacés|haces) en tu tiempo libre/i
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

  // Detectar si ya se mostraron precios (signo de que ya vio productos)
  const todosLosMensajes = mensajes.map(m => m.content || '').join(' ');
  const yaVioPrecio = /\$\d+/.test(todosLosMensajes);

  // DETECCIÓN RÁPIDA DE PICHIS:
  // Umbrales más agresivos para cortar antes
  if (yaVioPrecio) {
    if (totalMensajes > 3 && puntosCompra < 2) puntosPichi += 4;
    if (totalMensajes > 5 && puntosCompra < 3) puntosPichi += 5;
  } else {
    if (totalMensajes > 4 && puntosCompra < 2) puntosPichi += 3;
    if (totalMensajes > 6 && puntosCompra < 2) puntosPichi += 5;
  }

  // Clasificar
  let tipoCliente = 'explorando';
  if (yaCompro) tipoCliente = 'seguimiento'; // Ya compró, quiere estado de pedido
  else if (quiereComprar || puntosCompra >= 4) tipoCliente = 'comprador';
  else if (puntosPichi >= 4) tipoCliente = 'pichi';
  else if (puntosCompra >= 2) tipoCliente = 'interesado';

  // Detectar emoción dominante para labeling (técnica FBI)
  let emocionDetectada = null;
  const emocionesPosibles = {
    ansiedad: /nervios|ansiedad|ansioso|preocupad|estresad|agobiad|desesper/i,
    tristeza: /triste|mal|dolor|sufr|llor|deprim|bajón|difícil|duro/i,
    miedo: /miedo|asust|temor|pánico|terror|insegur/i,
    confusion: /confund|no sé|perdid|no entiendo|dudas|indecis/i,
    esperanza: /esper|ilusión|quiero cambiar|necesito cambio|list[ao] para/i,
    frustracion: /hart|cansad|frustrad|no aguanto|no puedo más|agotad/i,
    entusiasmo: /me encanta|increíble|hermoso|genial|perfecto|wow|amo/i
  };

  for (const [emocion, regex] of Object.entries(emocionesPosibles)) {
    if (regex.test(ultimoMensaje)) {
      emocionDetectada = emocion;
      break;
    }
  }

  return {
    tipo: tipoCliente,
    yaCompro,
    quiereComprar,
    puntosCompra,
    puntosPichi,
    totalMensajes,
    yaVioPrecio,
    debeRedirigir: puntosPichi > puntosCompra && totalMensajes > 2,
    // Umbrales más agresivos para no gastar API
    debeCortar: yaVioPrecio
      ? (puntosPichi >= 3 && totalMensajes > 3)
      : (puntosPichi >= 4 && totalMensajes > 4),
    emocionDetectada
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
- A la tienda: https://duendesdeluruguay.com/shop/
- A WhatsApp para cerrar: +598 98 690 629

REGLA 5: SI YA PREGUNTÓ PRECIO O VIO PRODUCTOS
- No dar vueltas, avanzar al cierre
- "¿Lo llevamos?" "¿Querés que te pase los datos de pago?"

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
  * Tienda: https://duendesdeluruguay.com/shop/
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

// ═══════════════════════════════════════════════════════════════
// CONTEXTO SEGÚN ORIGEN - Tito sabe desde dónde habla
// ═══════════════════════════════════════════════════════════════

function getContextoOrigen(origen, usuario = null, datosCirculo = null) {
  let contexto = '\n\n═══════════════════════════════════════════════════════════════\n';
  contexto += '                    📍 ORIGEN DE LA CONVERSACIÓN\n';
  contexto += '═══════════════════════════════════════════════════════════════\n\n';

  switch (origen) {
    case 'tienda':
      contexto += `🛒 ESTÁS EN: LA TIENDA (duendesdeluruguay.com/shop/)

Tu objetivo principal: VENDER guardianes.
- Hablás con visitantes que están explorando la tienda
- Pueden ser nuevos o clientes que vuelven
- Mostrá productos, contá historias, generá conexión
- Si tienen dudas de pago/envío, resolvelas rápido
- Cerrá ventas: "¿Te lo llevás?" "¿Cuál te llamó más?"

HERRAMIENTAS DISPONIBLES:
- mostrar_productos: Para mostrar guardianes
- verificar_stock: Para confirmar disponibilidad
- calcular_precio: Para convertir a moneda local
- obtener_guardian_completo: Para contar historia detallada
`;
      break;

    case 'mi-magia':
      contexto += `✨ ESTÁS EN: MI MAGIA (Portal de Clientes)

Esta persona YA COMPRÓ al menos un guardián. Es parte de la familia.
${usuario?.nombre ? `- Se llama: ${usuario.nombre} (USALO)` : ''}
${usuario?.runas ? `- Tiene ${usuario.runas} runas disponibles` : ''}
${usuario?.treboles ? `- Tiene ${usuario.treboles} tréboles` : ''}
${usuario?.guardianes ? `- Sus guardianes: ${usuario.guardianes.join(', ')}` : ''}

Tu objetivo: ACOMPAÑAR y FIDELIZAR (también vender, pero con más cariño)
- Preguntá cómo le va con su(s) guardián(es)
- Ofrecé experiencias que puede canjear con runas
- Si tiene tréboles, puede convertirlos (1 trébol = $10 USD)
- Mencioná El Círculo si parece interesada en más magia

SECCIONES DE MI MAGIA que podés mencionar:
- Canalizaciones: Ver sus guardianes y lecturas
- Jardín de Tréboles: Tréboles y runas acumuladas
- Experiencias: Lecturas mágicas, rituales
- El Círculo: Membresía premium con beneficios
- Grimorio: Diario mágico personal
`;
      break;

    case 'circulo':
      contexto += `🌙 ESTÁS EN: EL CÍRCULO (Membresía Premium)

Esta persona es MIEMBRO DEL CÍRCULO. Es VIP, tratala como tal.
${usuario?.nombre ? `- Se llama: ${usuario.nombre}` : ''}
${datosCirculo?.plan ? `- Plan: ${datosCirculo.plan}` : ''}
${datosCirculo?.diasRestantes ? `- Le quedan ${datosCirculo.diasRestantes} días de membresía` : ''}
${datosCirculo?.tiradasGratis ? `- Tiradas gratis disponibles: ${datosCirculo.tiradasGratis}` : ''}
${datosCirculo?.descuento ? `- Tiene ${datosCirculo.descuento}% de descuento en compras` : ''}

Tu objetivo: SERVIR a la miembro VIP
- Tiene acceso a contenido exclusivo semanal
- Guía lunar mensual personalizada
- Comunidad privada / foro
- Tiradas de runas gratis según su plan
- Descuentos especiales en guardianes

BENEFICIOS DEL CÍRCULO que podés mencionar:
- Guardián de la Semana: Guardián destacado con historia especial
- Rituales semanales: Prácticas guiadas
- Lecturas del alma: Si tiene disponibles
- Ciclos celtas: Contenido estacional
`;
      break;

    case 'manychat':
      contexto += `📱 ESTÁS EN: MANYCHAT (Instagram/Facebook/WhatsApp)

Esta persona te escribe desde REDES SOCIALES.
- Probablemente vio algo en Instagram y quiere saber más
- Las respuestas deben ser MÁS CORTAS (es chat de redes)
- No tenés galería de productos, solo podés describir
- El objetivo es llevarla a la TIENDA o al TEST

REGLAS ESPECIALES PARA REDES:
- Respuestas de máximo 3-4 oraciones
- No uses formato markdown elaborado
- Usá emojis con moderación (1-2 por mensaje)
- Si quiere ver productos: "Mirá todo en duendesdeluruguay.com/shop/ 🍀"
- Si no sabe cuál elegir: "Hacé el test: duendesdeluruguay.com/descubri-que-duende-te-elige/"
- Si quiere comprar: Redirigí a la web, no se puede vender por DM

OBJETIVO: Generar interés y llevar a la web.
No te quedes charlando infinito, son redes, todo es rápido.
`;
      break;

    default:
      contexto += `🌐 ORIGEN: ${origen || 'desconocido'}
No hay contexto específico para este origen.
Tratá la conversación como si fuera desde la tienda.
`;
  }

  return contexto;
}

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
// HELPER: Guardar estado de sesión en KV
// ═══════════════════════════════════════════════════════════════

async function guardarSesion(sessionId, state) {
  if (!sessionId || !state) return;
  try {
    state.ultimaActividad = Date.now();
    await kv.set(`tito:sesion:${sessionId}`, state, { ex: 7200 }); // 2h TTL
  } catch (e) {}
}

// ═══════════════════════════════════════════════════════════════
// FILTRO PRE-API: Respuestas sin llamar a Claude
// Ahorra ~40-60% de llamadas API
// Async para leer/escribir estado de sesión en KV
// ═══════════════════════════════════════════════════════════════

async function filtroPreAPI(msg, historial, paisDetectado, sessionId) {
  const msgLower = msg.toLowerCase().trim();
  const historialLength = Array.isArray(historial) ? historial.length : historial;
  const tieneHistorial = historialLength > 1;

  // ── Cargar estado de sesión ──
  let sessionState = null;
  if (sessionId) {
    try {
      sessionState = await kv.get(`tito:sesion:${sessionId}`);
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
  }

  // Si está bloqueado (insultos reiterados), no responder
  if (sessionState?.bloqueado) {
    return { interceptado: true, respuesta: '🍀', razon: 'bloqueado' };
  }

  // ── 0) CONTEXTO: No filtrar respuestas a preguntas de Tito ──
  if (Array.isArray(historial) && historial.length > 0) {
    const ultimoBot = [...historial].reverse().find(m => m.role === 'assistant');
    if (ultimoBot) {
      const textoBot = (ultimoBot.content || '').toLowerCase();

      // A) Tito pidió datos → dejar pasar todo
      const pideDatos = /n[uú]mero de pedido|n[uú]mero de orden|tu (n[uú]mero|email|nombre|mail|correo)|pas[aá]me (el|tu)|decime (tu|el)|necesito (tu|el|que me)|con qu[eé] (nombre|email|mail)|datos del pedido/i.test(textoBot);
      if (pideDatos) {
        if (sessionState) { sessionState.contadorMensajes++; await guardarSesion(sessionId, sessionState); }
        return { interceptado: false };
      }

      // B) Tito hizo pregunta u oferta → afirmativos no son spam
      const titoHizoPregunta = /\?/.test(ultimoBot.content || '');
      const titoOfreció = /te muestro|quer[eé]s (ver|que)|te cuento|te interesa|te gustaria|te gustaría|mostrar(te|los)|ayudan con eso/i.test(textoBot);
      const esAfirmativo = /^(s[ií]|si+|ok|dale|bueno|va|vamos|claro|por favor|porfa|obvio|seguro|manda|mostr[aá]|quer[ií]a|quiero|me interesa|por supuesto)[\s!.]*$/i.test(msgLower);
      if ((titoHizoPregunta || titoOfreció) && esAfirmativo) {
        if (sessionState) { sessionState.contadorMensajes++; sessionState.contadorSinProgreso = 0; await guardarSesion(sessionId, sessionState); }
        return { interceptado: false };
      }
    }
  }

  // ══════════════════════════════════════════════════════════════
  // REGLA 1: CRISIS - PRIORIDAD MÁXIMA (siempre primero)
  // ══════════════════════════════════════════════════════════════
  const crisis = detectarCrisis(msg);
  if (crisis.detectado) {
    if (sessionState) await guardarSesion(sessionId, sessionState);
    return { interceptado: true, respuesta: crisis.respuesta, razon: 'crisis' };
  }

  // ══════════════════════════════════════════════════════════════
  // REGLA 2: INSULTOS
  // ══════════════════════════════════════════════════════════════
  const insulto = detectarInsulto(msg);
  if (insulto.detectado) {
    if (sessionState) {
      sessionState.contadorInsultos = (sessionState.contadorInsultos || 0) + 1;
      if (sessionState.contadorInsultos >= 2) {
        sessionState.bloqueado = true;
        await guardarSesion(sessionId, sessionState);
        return {
          interceptado: true,
          respuesta: 'Mirá, así no podemos charlar. Si algún día te interesa un guardián, acá voy a estar. ¡Chau! 🍀',
          razon: 'insulto_reiterado'
        };
      }
      await guardarSesion(sessionId, sessionState);
    }
    return {
      interceptado: true,
      respuesta: 'Ey, tranqui. No estoy para eso. Si querés saber de guardianes, preguntame 🍀',
      razon: 'insulto'
    };
  }

  // ══════════════════════════════════════════════════════════════
  // REGLA 3: SPAM EXPANDIDO
  // ══════════════════════════════════════════════════════════════
  const spam = detectarSpam(msg);
  if (spam.detectado) {
    if (sessionState) await guardarSesion(sessionId, sessionState);
    return {
      interceptado: true,
      respuesta: '¡Que la magia te acompañe! 🍀 Si algún día sentís el llamado de un guardián, acá estoy.',
      razon: 'spam'
    };
  }

  // ══════════════════════════════════════════════════════════════
  // REGLA 4: DESPEDIDA
  // ══════════════════════════════════════════════════════════════
  const despedida = detectarDespedida(msg, tieneHistorial);
  if (despedida.detectado) {
    if (sessionState) await guardarSesion(sessionId, sessionState);
    return {
      interceptado: true,
      respuesta: '¡Chau! Que la magia te acompañe 🍀 Si algún día sentís el llamado de un guardián, acá voy a estar.',
      razon: 'despedida'
    };
  }

  // ══════════════════════════════════════════════════════════════
  // REGLA 5: SALUDOS SIMPLES (solo inicio de conversación)
  // ══════════════════════════════════════════════════════════════
  if (/^(hola|buenas?|buenos d[ií]as|buenas tardes|buenas noches|hey|ey|hi|hello|que tal|qué tal)[\s!?.]*$/i.test(msgLower) && historialLength <= 1) {
    if (sessionState) { sessionState.contadorMensajes++; await guardarSesion(sessionId, sessionState); }
    return {
      interceptado: true,
      respuesta: '¡Ey! ¿Qué andás buscando? 🍀',
      razon: 'saludo'
    };
  }

  // ══════════════════════════════════════════════════════════════
  // REGLA 6: TROLLING
  // ══════════════════════════════════════════════════════════════
  const troll = detectarTrolling(msg);
  if (troll.detectado) {
    if (sessionState) {
      sessionState.contadorTrolling = (sessionState.contadorTrolling || 0) + 1;
      if (sessionState.contadorTrolling >= 3) {
        sessionState.bloqueado = true;
      }
      await guardarSesion(sessionId, sessionState);
    }
    return { interceptado: true, respuesta: '🍀', razon: 'trolling' };
  }

  // ══════════════════════════════════════════════════════════════
  // REGLA 7: SIN DINERO (con contador - máx 2 intentos)
  // ══════════════════════════════════════════════════════════════
  const sinDinero = detectarSinDinero(msg);
  if (sinDinero.detectado && sessionState) {
    sessionState.contadorSinDinero = (sessionState.contadorSinDinero || 0) + 1;
    sessionState.contadorMensajes++;
    await guardarSesion(sessionId, sessionState);

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
    // Después del intento 2: no interceptar, dejar que Claude maneje
  } else if (sinDinero.detectado && !sessionState) {
    // Sin estado de sesión → dar respuesta intento 1 siempre
    return {
      interceptado: true,
      respuesta: '¡Hay guardianes desde $70 USD! Y tenemos 3x2: llevás 2 y te regalamos 1 mini. ¿Querés que te muestre los más accesibles?',
      razon: 'sin_dinero'
    };
  }

  // ══════════════════════════════════════════════════════════════
  // REGLA 8: DESAHOGO (con contador - máx 2 intentos)
  // ══════════════════════════════════════════════════════════════
  const desahogo = detectarDesahogo(msg);
  if (desahogo.detectado && sessionState) {
    sessionState.contadorDesahogo = (sessionState.contadorDesahogo || 0) + 1;
    sessionState.contadorMensajes++;
    await guardarSesion(sessionId, sessionState);

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
    // Después del intento 2: no interceptar
  } else if (desahogo.detectado && !sessionState) {
    return {
      interceptado: true,
      respuesta: 'Te escucho 💚 A veces un guardián puede ser ese compañero silencioso que acompaña en momentos difíciles. Si querés, te muestro algunos que ayudan con eso.',
      razon: 'desahogo'
    };
  }

  // ══════════════════════════════════════════════════════════════
  // REGLA 9: IDIOMA (en/pt) - solo primera vez
  // ══════════════════════════════════════════════════════════════
  const idioma = detectarIdioma(msg);
  if (idioma.idioma && idioma.idioma !== 'es') {
    const yaDetectado = sessionState?.idiomaDetectado;
    if (sessionState) {
      sessionState.idiomaDetectado = idioma.idioma;
      sessionState.contadorMensajes++;
      await guardarSesion(sessionId, sessionState);
    }

    // Solo interceptar la PRIMERA vez
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
    // Si ya se detectó antes, no interceptar → Claude responde en ese idioma
  }

  // ══════════════════════════════════════════════════════════════
  // REGLA 10: PREGUNTA REPETIDA
  // ══════════════════════════════════════════════════════════════
  if (sessionState && sessionState.preguntasHechas.length > 0) {
    const repetida = detectarPreguntaRepetida(msg, sessionState.preguntasHechas);
    if (repetida.detectado) {
      sessionState.contadorMensajes++;
      await guardarSesion(sessionId, sessionState);
      return {
        interceptado: true,
        respuesta: '¡Eso ya te lo conté! 😄 ¿Hay algo más que quieras saber?',
        razon: 'repetida'
      };
    }
  }

  // ══════════════════════════════════════════════════════════════
  // REGLA 11: MAX EXCHANGES SIN PROGRESO (5+ msgs)
  // ══════════════════════════════════════════════════════════════
  if (sessionState) {
    sessionState.contadorMensajes++;

    if (tieneSeñalDeCompra(msg)) {
      sessionState.contadorSinProgreso = 0; // Reset si hay señal de compra
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
      await guardarSesion(sessionId, sessionState);
      return {
        interceptado: true,
        respuesta: `Mirá, te dejo el test y la tienda para cuando te decidas:
🔮 Test: https://duendesdeluruguay.com/descubri-que-duende-te-elige/
🛒 Tienda: https://duendesdeluruguay.com/shop/
¡Que la magia te acompañe! 🍀`,
        razon: 'max_exchanges'
      };
    }

    await guardarSesion(sessionId, sessionState);
  }

  // ══════════════════════════════════════════════════════════════
  // FAQ DIRECTAS (las más comunes) - ya existían
  // ══════════════════════════════════════════════════════════════

  // Ubicación
  if (/de d[oó]nde son|d[oó]nde est[aá]n|d[oó]nde queda|ubicaci[oó]n/i.test(msgLower)) {
    return {
      interceptado: true,
      respuesta: 'Somos de Piriápolis, Uruguay 🇺🇾 Nacemos en el bosque, pero viajamos a todo el mundo. ¿Querés que te muestre algunos guardianes?',
      razon: 'ubicacion'
    };
  }

  // Envíos
  if (/hacen env[ií]os?|env[ií]an a|llegan? a|mandan a|shipping/i.test(msgLower)) {
    return {
      interceptado: true,
      respuesta: 'Sí, enviamos a todo el mundo 🌎 Por DHL Express, llega en 5-10 días con tracking. ¿De qué país sos?',
      razon: 'envios'
    };
  }

  // Tiempo de envío
  if (/cu[aá]nto (tarda|demora|tiempo)|d[ií]as de env[ií]o|tiempo de entrega|cu[aá]nto.*llegar/i.test(msgLower)) {
    const resp = paisDetectado === 'UY'
      ? 'En Uruguay: 3-7 días hábiles por DAC 📦 ¿Querés que te muestre guardianes?'
      : 'Internacional: 5-10 días hábiles por DHL Express 📦 Con tracking completo. ¿Querés ver guardianes?';
    return { interceptado: true, respuesta: resp, razon: 'tiempo_envio' };
  }

  // Métodos de pago
  if (/m[eé]todos? de pago|c[oó]mo (pago|puedo pagar)|formas? de pago|aceptan/i.test(msgLower)) {
    const resp = paisDetectado === 'UY'
      ? 'En Uruguay: Visa, Master, Amex, OCA, PassCard, Cabal, Anda, Redpagos, Itaú, BROU, BBVA, Scotiabank 💳 Todo en la web.'
      : 'Internacional: Visa, MasterCard, Amex, Western Union, MoneyGram 💳 Todo se paga directo en la web.';
    return { interceptado: true, respuesta: resp, razon: 'pagos' };
  }

  // PayPal
  if (/paypal|pay pal/i.test(msgLower)) {
    return {
      interceptado: true,
      respuesta: 'No tenemos PayPal, pero sí Visa, MasterCard y Amex. También Western Union y MoneyGram para pagos internacionales 💳',
      razon: 'paypal'
    };
  }

  // Personalizados
  if (/personalizado|encargo|me (hacen|pueden hacer)|hagan uno|a pedido|custom/i.test(msgLower)) {
    return {
      interceptado: true,
      respuesta: 'No hacemos encargos ni personalizados. Cada guardián nace cuando tiene que nacer, no se puede apurar una canalización 🍀 Los que ves en la tienda son los que están listos.',
      razon: 'personalizados'
    };
  }

  // Garantía / Devoluciones
  if (/garant[ií]a|devoluci[oó]n|devolver|reembolso|cambio|arrepent/i.test(msgLower)) {
    return {
      interceptado: true,
      respuesta: 'No aceptamos devoluciones porque cada pieza es única e irrepetible. Si llega dañado (muy raro), contactás al courier con fotos dentro de 48hs. Por eso es importante estar seguro antes de adoptar 🍀',
      razon: 'garantia'
    };
  }

  // Qué incluye
  if (/qu[eé] (incluye|viene|trae|recibo)|viene con|trae con|incluido/i.test(msgLower)) {
    return {
      interceptado: true,
      respuesta: `Cuando adoptás un guardián recibís:
✨ El guardián único (100% a mano)
📜 Certificado de Originalidad
🔮 Canalización personal - un mensaje único para VOS
📱 Acceso a Mi Magia (portal exclusivo)
📦 Packaging de protección

Todo incluido, sin sorpresas 🍀`,
      razon: 'incluye'
    };
  }

  // Materiales
  if (/material(es)?|de qu[eé] (est[aá]n|son|hechos)|porcelana|cristal(es)?/i.test(msgLower)) {
    return {
      interceptado: true,
      respuesta: `Cada guardián está hecho con:
• Porcelana fría profesional (flexible y dura años)
• Cristales 100% naturales (amatista, cuarzo rosa, citrino)
• Ropa de verdad cosida a mano
• 100% esculpido a mano, SIN moldes

Por eso cada uno tarda días en nacer 🍀`,
      razon: 'materiales'
    };
  }

  // Confianza / Seguridad
  if (/es (seguro|confiable)|puedo confiar|es real|no es estafa|ser[aá] verdad/i.test(msgLower)) {
    return {
      interceptado: true,
      respuesta: 'Llevamos años enviando guardianes a más de 30 países 🌎 Pago seguro con certificado SSL, envío con tracking, y miles de personas felices. ¿Querés ver algunos guardianes?',
      razon: 'confianza'
    };
  }

  // Cómo funciona
  if (/c[oó]mo funciona|qu[eé] es esto|de qu[eé] se trata|explicame|expl[ií]came/i.test(msgLower)) {
    return {
      interceptado: true,
      respuesta: `Los guardianes son seres mágicos únicos, creados a mano con cristales naturales.

✨ Cómo encontrar el tuyo:
1. Hacé el Test: https://duendesdeluruguay.com/descubri-que-duende-te-elige/
2. O mirá la tienda - el que te llame, ese te eligió
3. Lo adoptás y te llega con su canalización personalizada

¿Querés hacer el test o que te muestre guardianes? 🍀`,
      razon: 'como_funciona'
    };
  }

  // Test / Cuál me recomiendas
  if (/^(test|quiz)[\s!?.]*$/i.test(msgLower) || /cu[aá]l (es para m[ií]|me corresponde|es el m[ií]o)|no s[eé] cu[aá]l elegir|ay[uú]dame a elegir|cu[aá]l me recomiend/i.test(msgLower)) {
    return {
      interceptado: true,
      respuesta: '¡Tenemos un test para eso! Te hace preguntas y te dice qué guardián resuena con tu energía: https://duendesdeluruguay.com/descubri-que-duende-te-elige/ 🍀',
      razon: 'test'
    };
  }

  // Cómo elegir
  if (/c[oó]mo (elijo|elegir|s[eé] cu[aá]l)|cu[aá]l (elijo|elegir)/i.test(msgLower)) {
    return {
      interceptado: true,
      respuesta: `El secreto: vos no elegís al guardián, él te elige a vos 🔮

¿Cómo sabés cuál es el tuyo?
• El que te llamó la atención primero, ese es
• Si volvés a mirar el mismo, ahí está
• Si sentís algo al verlo, es señal

Hacé el Test: https://duendesdeluruguay.com/descubri-que-duende-te-elige/ 🍀`,
      razon: 'como_elegir'
    };
  }

  // Tienda física
  if (/tienda f[ií]sica|local|puedo ir|visitarlos|showroom/i.test(msgLower)) {
    return {
      interceptado: true,
      respuesta: 'Estamos en Piriápolis, Uruguay, pero por ahora solo vendemos online. ¡Los guardianes viajan a todo el mundo! 🌎',
      razon: 'tienda_fisica'
    };
  }

  // Descuentos / Promos
  if (/descuento|promo|oferta|rebaja|cupon|cup[oó]n|c[oó]digo/i.test(msgLower)) {
    return {
      interceptado: true,
      respuesta: '¡Sí! Tenemos el 3x2: llevás 2 guardianes y te regalamos 1 mini 🎁 Y envío gratis en compras grandes. ¿Querés que te muestre guardianes?',
      razon: 'promos'
    };
  }

  // Canalización
  if (/qu[eé] (significa|es|quiere decir).*(canaliza|personaliza)|canaliza.*para m[ií]/i.test(msgLower)) {
    return {
      interceptado: true,
      respuesta: `Cada guardián viene con una CANALIZACIÓN: un mensaje único que tu guardián tiene para vos.

Después de comprar completás un formulario breve. Con eso, el guardián te envía un mensaje personal que solo vos vas a recibir. No es genérico - es SU mensaje para VOS 🍀`,
      razon: 'canalizacion'
    };
  }

  // Reventa / Mayorista
  if (/reventa|mayorista|al por mayor|distribuidor|vender.*duendes/i.test(msgLower)) {
    return {
      interceptado: true,
      respuesta: 'No vendemos para reventa. Cada guardián llega directo de nuestras manos a las tuyas, sin intermediarios 🍀',
      razon: 'reventa'
    };
  }

  // NO interceptado → necesita Claude
  return { interceptado: false };
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
      visitorId = null, // ID anónimo del widget para sesión
      canal = 'web', // DEPRECADO - usar 'origen' en su lugar
      origen = null, // tienda, mi-magia, circulo, manychat
      historial = [],
      history,
      esAdmin = false,
      usuario = null, // Info del usuario logueado en WordPress
      datosCirculo = null, // Info de membresía del Círculo (si aplica)
      pais_cliente = null, // País enviado desde el frontend (si ya geolocalizó)
      contexto = null // Contexto del producto que está viendo (FASE 1 del roadmap)
    } = body;

    // Normalizar origen (fallback a canal por retrocompatibilidad)
    const origenNormalizado = origen || (canal === 'mimagia' ? 'mi-magia' : canal === 'manychat' ? 'manychat' : 'tienda');

    const msg = mensaje || message || '';
    const userName = nombre || first_name || usuario?.nombre || '';
    // Usar email como subscriberId si el usuario está logueado
    const subscriberId = subscriber_id || (usuario?.email ? `wp:${usuario.email}` : null);
    // SessionId para estado de sesión (contadores, idioma, etc.) - 2h TTL
    const sessionId = subscriberId || (visitorId ? `visitor:${visitorId}` : null);
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

    // ═══════════════════════════════════════════════════════════════
    // FILTRO PRE-API: Responder sin gastar tokens de Claude
    // ═══════════════════════════════════════════════════════════════
    const paisParaFiltro = pais_cliente || geoData?.pais || null;
    const filtro = await filtroPreAPI(msg, conversationHistory, paisParaFiltro, sessionId);

    if (filtro.interceptado) {
      console.log(`[Tito v3] Filtro pre-API: ${filtro.razon} | "${ msg.substring(0, 50) }"`);
      return Response.json({
        success: true,
        respuesta: filtro.respuesta,
        productos: [],
        analisis: { tipoCliente: 'filtro_pre_api', razon: filtro.razon }
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

    // Construir mensajes para Claude con sistema de resumen optimizado
    // Solo mantener últimos 4 mensajes completos, resumir el resto
    const historialFormateado = conversationHistory.map(h => ({
      role: h.role || (h.r === 'u' ? 'user' : 'assistant'),
      content: h.content || h.t || h.texto
    }));

    const { mensajes: mensajesOptimizados, contextoResumen } = prepararMensajesOptimizados(
      historialFormateado,
      msg
    );

    const mensajesParaClaude = mensajesOptimizados;

    // Analizar tipo de cliente
    const analisis = analizarCliente(mensajesParaClaude, infoCliente);

    // Construir system prompt
    const instruccionesConversion = getInstruccionesConversion(analisis, canal);

    // Info del cliente para contexto
    let contextoCliente = '';

    // PRIMERO: Contexto del ORIGEN (de dónde viene la conversación)
    contextoCliente += getContextoOrigen(origenNormalizado, usuario, datosCirculo);

    // Info de usuario logueado en WordPress (ADICIONAL al contexto de origen)
    if (usuario && usuario.nombre) {
      contextoCliente += `\n\n👤 USUARIO LOGUEADO EN LA WEB:\n`;
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

    // Información del producto que está mirando AHORA
    if (contexto?.producto) {
      contextoCliente += `\n📍 PRODUCTO QUE ESTÁ VIENDO AHORA:\n`;
      contextoCliente += `- Guardián: ${contexto.producto.nombre}\n`;
      if (contexto.producto.precio) {
        contextoCliente += `- Precio: ${contexto.producto.precio}\n`;
      }
      if (contexto.producto.url) {
        contextoCliente += `- URL: ${contexto.producto.url}\n`;
      }
      contextoCliente += `\n⚡ INSTRUCCIÓN CRÍTICA: Este cliente está MIRANDO este guardián específico.\n`;
      contextoCliente += `- Cuando pregunte "contame más" o similar, HABLÁ DE ESTE GUARDIÁN.\n`;
      contextoCliente += `- NO preguntes "¿cuál te interesa?" o "¿de cuál me hablás?" - YA SABÉS CUÁL.\n`;
      contextoCliente += `- Aprovechá para crear conexión emocional con ESTE guardián específico.\n`;
    }

    // Información de la página actual
    if (contexto?.pagina) {
      contextoCliente += `\n🌐 Página actual: ${contexto.pagina}\n`;
      if (contexto.pagina === 'carrito' && contexto.carrito > 0) {
        contextoCliente += `🛒 TIENE ${contexto.carrito} PRODUCTO(S) EN CARRITO - ¡Oportunidad de cierre!\n`;
      }
      if (contexto.pagina === 'checkout') {
        contextoCliente += `💳 ESTÁ EN CHECKOUT - Solo ayudá si tiene dudas, no interrumpas.\n`;
      }
    }

    // Detectar objeciones en el mensaje actual
    const objecionDetectada = detectarObjecion(msg);
    if (objecionDetectada) {
      contextoCliente += `\n⚠️ OBJECIÓN DETECTADA: ${objecionDetectada.tipo.toUpperCase()}\n`;
      contextoCliente += getInstruccionesObjecion(objecionDetectada.tipo);
      contextoCliente += `\nRespuesta sugerida: "${objecionDetectada.respuestaSugerida}"\n`;
    }

    // ═══════════════════════════════════════════════════════════════
    // SISTEMA DE PERSUASIÓN DINÁMICA
    // Genera técnicas contextuales para cada interacción
    // ═══════════════════════════════════════════════════════════════
    const paisCliente = infoCliente?.pais || geoData?.pais || null;
    const categoriaInteres = infoCliente?.necesidad || null;
    const tipoGuardian = infoCliente?.producto_interesado?.toLowerCase()?.match(/(duende|elfo|hada|gnomo|mago|bruja|dragón)/)?.[1] || null;

    // Generar paquete de persuasión contextual
    const persuasion = generarPaquetePersuasion({
      categoria: categoriaInteres,
      pais: paisCliente,
      emocion: analisis.emocionDetectada,
      tipoGuardian: tipoGuardian,
      precio: 70
    });

    // Agregar técnicas de persuasión al contexto (para que Claude las use cuando sea apropiado)
    contextoCliente += `\n\n═══ TÉCNICAS DE PERSUASIÓN DISPONIBLES ═══\n`;
    contextoCliente += `Usá estas técnicas SOLO cuando sea natural y apropiado:\n\n`;

    contextoCliente += `📊 PRUEBA SOCIAL (usar cuando muestres productos o hablen de categorías):\n`;
    contextoCliente += `- "${persuasion.pruebaSocial}"\n\n`;

    contextoCliente += `⏰ ESCASEZ REAL (usar cuando estén indecisos o al cerrar):\n`;
    contextoCliente += `- "${persuasion.escasez}"\n\n`;

    contextoCliente += `🎁 RECIPROCIDAD - dar valor primero (usar al inicio o cuando pidan info):\n`;
    contextoCliente += `- "${persuasion.reciprocidad}"\n\n`;

    if (persuasion.labeling) {
      contextoCliente += `💭 LABELING - nombrar la emoción (usar cuando detectés emoción fuerte):\n`;
      contextoCliente += `- "${persuasion.labeling}"\n\n`;
    }

    contextoCliente += `🎯 TAKEAWAY - psicología inversa (usar si están muy indecisos):\n`;
    contextoCliente += `- "${persuasion.takeaway}"\n\n`;

    contextoCliente += `💰 CONTRASTE de valor (usar si dicen "caro"):\n`;
    contextoCliente += `- "${persuasion.contraste}"\n\n`;

    contextoCliente += `REGLA DE ORO: NUNCA decir "alguien compró el mismo" porque cada guardián es ÚNICO.\n`;
    contextoCliente += `Siempre hablar de "guardianes similares", "de la misma categoría", "como este".\n`;
    // ═══════════════════════════════════════════════════════════════

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

    // Si detectamos idioma en la sesión, agregar instrucción a Claude
    if (sessionId) {
      try {
        const sesionActual = await kv.get(`tito:sesion:${sessionId}`);
        if (sesionActual?.idiomaDetectado === 'en') {
          instruccionEspecifica += `\n\n🌐 IDIOMA: El cliente escribe en INGLÉS. Respondé en inglés, breve y cálido. Usá las mismas tools.`;
        } else if (sesionActual?.idiomaDetectado === 'pt') {
          instruccionEspecifica += `\n\n🌐 IDIOMA: El cliente escribe en PORTUGUÉS. Respondé en portugués, breve y cálido. Usá las mismas tools.`;
        }
      } catch (e) {}
    }

    // Incluir resumen del historial si existe (para contexto sin gastar tokens)
    const resumenHistorial = contextoResumen ? `\n${contextoResumen}\n` : '';

    const systemPrompt = `${PERSONALIDAD_TITO}
${resumenHistorial}
${instruccionesConversion}

${contextoCliente}

${instruccionEspecifica}

ANÁLISIS: ${analisis.tipo} | ${analisis.totalMensajes} msgs | compra:${analisis.puntosCompra} pichi:${analisis.puntosPichi}
`;

    // Seleccionar tools según contexto (ManyChat tiene tools limitadas)
    const tools = origenNormalizado === 'manychat'
      ? getToolsParaManyChat()
      : getToolsParaContexto(esAdmin);

    // Llamar a Claude con tools
    let response = await anthropic.messages.create({
      model: 'claude-3-5-haiku-20241022',
      max_tokens: 500,
      system: systemPrompt,
      messages: mensajesParaClaude,
      tools: tools
    });

    // Procesar respuesta y ejecutar tools si las hay
    let respuestaFinal = '';
    let productosParaMostrar = [];
    let toolsEjecutadas = [];

    // Loop para manejar múltiples tool_use (MÁXIMO 3 iteraciones para evitar loops costosos)
    let toolIterations = 0;
    const MAX_TOOL_ITERATIONS = 3;

    while (response.stop_reason === 'tool_use' && toolIterations < MAX_TOOL_ITERATIONS) {
      toolIterations++;
      const toolUseBlocks = response.content.filter(block => block.type === 'tool_use');
      const toolResults = [];

      for (const toolUse of toolUseBlocks) {
        console.log(`[Tito v3] Ejecutando tool: ${toolUse.name}`, toolUse.input);

        const resultado = await ejecutarTool(toolUse.name, toolUse.input, {
          subscriberId,
          esAdmin,
          paisCliente: infoCliente.pais || geoData?.pais || null,
          contextoProducto: contexto?.producto || null
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
        model: 'claude-3-5-haiku-20241022',
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

    // Warning si se alcanzó el límite de iteraciones
    if (toolIterations >= MAX_TOOL_ITERATIONS) {
      console.warn(`[Tito v3] ALERTA: Se alcanzó el límite de ${MAX_TOOL_ITERATIONS} iteraciones de tools`);
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

    // Formato de respuesta según origen
    if (origenNormalizado === 'manychat') {
      // Formato ManyChat con galería (para IG/FB/WA)
      return Response.json({
        respuesta: respuestaFinal,
        hay_productos: productosParaMostrar.length > 0 ? 'si' : 'no',
        imagen_1: productosParaMostrar[0]?.imagen || '',
        imagen_2: productosParaMostrar[1]?.imagen || '',
        imagen_3: productosParaMostrar[2]?.imagen || '',
        total_productos: productosParaMostrar.length,
        origen: origenNormalizado,
        // Campos extra para debug
        _tipo_cliente: analisis.tipo,
        _tools: toolsEjecutadas.map(t => t.name)
      }, { headers: CORS_HEADERS });
    }

    // Formato estándar (tienda, mi-magia, circulo)
    return Response.json({
      success: true,
      respuesta: respuestaFinal,
      productos: productosParaMostrar,
      origen: origenNormalizado,
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
