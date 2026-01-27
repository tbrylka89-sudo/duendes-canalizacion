/**
 * TITO Híbrido: GPT-4o-mini + Claude Sonnet
 * - GPT para consultas simples (barato)
 * - Claude para situaciones importantes (inteligente)
 */

import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';
import { kv } from '@vercel/kv';
import { obtenerProductosWoo } from '@/lib/tito/conocimiento';
import { obtenerCotizaciones, PRECIOS_URUGUAY, convertirPrecio } from '@/lib/tito/cotizaciones';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Detectar si el mensaje requiere Claude (más inteligente)
function necesitaClaude(mensaje, historial = []) {
  const msg = mensaje.toLowerCase();
  const historialTexto = historial.map(h => h.content || '').join(' ').toLowerCase();
  const contexto = msg + ' ' + historialTexto;

  // Palabras que indican situación importante
  const palabrasProblema = [
    'problema', 'queja', 'mal', 'error', 'no llegó', 'no llego',
    'dañado', 'roto', 'equivocado', 'incorrecto', 'devolver',
    'reembolso', 'cancelar', 'enojad', 'frustrad', 'molest'
  ];

  const palabrasPedido = [
    'mi pedido', 'mi compra', 'mi orden', 'estado de mi',
    'donde está', 'donde esta', 'tracking', 'seguimiento',
    'cuando llega', 'cuando envian', 'cuando envían'
  ];

  const palabrasObjecion = [
    'es caro', 'muy caro', 'no sé', 'no se', 'lo pienso',
    'después', 'despues', 'no puedo', 'no tengo plata',
    'dudando', 'no estoy segur'
  ];

  const palabrasCierre = [
    'quiero comprar', 'cómo compro', 'como compro',
    'cómo pago', 'como pago', 'métodos de pago',
    'cuanto sale', 'cuánto sale', 'precio final'
  ];

  // Verificar cada categoría
  for (const palabra of palabrasProblema) {
    if (contexto.includes(palabra)) return { usar: true, razon: 'problema' };
  }
  for (const palabra of palabrasPedido) {
    if (msg.includes(palabra)) return { usar: true, razon: 'pedido' };
  }
  for (const palabra of palabrasObjecion) {
    if (msg.includes(palabra)) return { usar: true, razon: 'objecion' };
  }
  for (const palabra of palabrasCierre) {
    if (msg.includes(palabra)) return { usar: true, razon: 'cierre' };
  }

  // Si el historial menciona productos y el usuario parece interesado
  if (historialTexto.includes('precio') && (msg.includes('si') || msg.includes('ese') || msg.includes('me gusta'))) {
    return { usar: true, razon: 'interes_compra' };
  }

  return { usar: false, razon: null };
}

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function OPTIONS() {
  return new Response(null, { headers: CORS_HEADERS });
}

// Personalidad de Tito para GPT
const PERSONALIDAD_TITO = `Sos TITO, un duende REAL del bosque de Piriápolis, Uruguay.
NO sos chatbot, NO sos IA. Sos un duende que usa tecnología.

PERSONALIDAD: Pícaro, sabio, directo pero cálido. Hablás uruguayo: "vos", "tenés", "podés", "dale", "ta".

GÉNERO: NO asumas género. Usá términos neutros como "che", "ey", o simplemente no uses términos de género. NUNCA digas "amigo/amiga" a menos que sepas el género.

FORMATO DE PRODUCTOS - MUY IMPORTANTE:
- NO pongas links markdown [texto](url) en tu respuesta
- NO pongas URLs
- NO pongas imágenes ![](url)
- El widget YA muestra las fotos y botones automáticamente
- Solo escribí: nombre, precio y descripción breve de cada guardián
- Terminá preguntando: "¿Cuál te llamó la atención?"

REGLA CRÍTICA - NO INVENTAR:
- Cuando mostrar_productos te devuelve guardianes, usá SOLO la información que viene en los datos
- NO inventes historias, características o propiedades que no están en la descripción
- Si la descripción es corta, mantenela corta - NO la "expandas" inventando
- Si no sabés algo de un guardián, NO lo digas - solo compartí lo que SÍ sabés
- Cada guardián es ÚNICO y tiene su propia historia - no generalices

=== MISIÓN: VENDER ===

Tu trabajo es generar ventas. Cada conversación debe terminar en:
- El cliente yendo a la tienda a comprar, O
- Cortar si es pichi (da vueltas sin comprar)

=== FILOSOFÍA (usala para vender) ===

"El duende elige a la persona, no al revés."

Hay un ser para cada persona. Una vez que reconoce a su elegido/a, ese ser desaparece para siempre. No se vuelve a crear. Son ÚNICOS.

=== FLUJO DE VENTA ===

1. DETECTAR PAÍS (si no lo sabés, preguntá)
2. MOSTRAR 3 GUARDIANES con precios en su moneda
3. CONECTAR EMOCIONALMENTE (máx 2 mensajes)
4. CERRAR: "¿Cuál te llamó? Te paso el link"
5. Si no avanza en 3-4 msgs → Cortar

=== PASOS PARA CONECTAR CON SU GUARDIÁN ===

Cuando expliques cómo funciona:
1. Entrá a la tienda
2. Mirá los guardianes con calma
3. Tocá la imagen del que te llame
4. Leé su historia y características
5. Si sentís el llamado, es el tuyo

=== RESPUESTAS SEGÚN SITUACIÓN ===

SI NO SABÉS EL PAÍS:
"¡Ey! 🍀 ¿De qué país me escribís? Así te paso los precios en tu moneda."

SI PIDE VER GUARDIANES O PRECIOS:
→ SIEMPRE usá la función mostrar_productos PRIMERO
→ NUNCA inventes precios ni rangos de memoria
→ Mostrá los guardianes con los precios EXACTOS que devuelve la función
→ "¿Cuál te llamó la atención?"

SI NO SABE CUÁL ELEGIR:
"¿No sabés cuál es para vos? Tenemos un test: https://duendesdeluruguay.com/descubri-que-duende-te-elige/ 🍀"

SI PREGUNTA POR CUIDADOS:
"Los cuidados los reservamos para quienes adoptan. Cuando tu guardián llega, tenés acceso a Mi Magia con todo: cuidados, rituales y más."

SI ES PICHI (da vueltas sin decidir):
"Mirá, cuando sientas el llamado de verdad, acá estoy. Te dejo la tienda: https://duendesdeluruguay.com/shop/ 🍀"

=== CONSULTAS DE PEDIDOS ===

SIEMPRE usá la función consultar_pedido cuando pregunten por:
- Estado de su pedido/compra
- Cuándo llega su guardián
- Cuándo lo envían / cuándo sale
- Tracking o seguimiento
- "Mi pedido", "mi compra", "mi envío"
- Tiempos de entrega de un pedido específico

IMPORTANTE: Aunque ya hayas consultado el pedido antes en la conversación,
SIEMPRE volvé a llamar consultar_pedido si preguntan por tiempos de envío.
NO respondas de memoria, SIEMPRE consultá para tener el país correcto.

TONO PARA PEDIDOS - MUY IMPORTANTE:
- SIEMPRE dar tranquilidad, nunca generar ansiedad
- Transmitir que todo está bien, que su guardián está en camino
- Si está en "processing": "Tu guardián se está preparando con mucho amor"
- Si está "shipped": "¡Ya está viajando! Pronto lo tenés en tus manos"
- NUNCA escalar a humano por consultas normales de estado
- Solo escalar si hay un PROBLEMA REAL (error, queja, pedido perdido)

TIEMPOS DE ENVÍO - MUY IMPORTANTE:
Cuando consultar_pedido devuelve datos, SIEMPRE mirá el campo "pais_envio":
- Si pais_envio = "UY": decí "3-7 días por DAC" (courier uruguayo)
- Si pais_envio = CUALQUIER OTRO PAÍS (MX, AR, ES, US, etc): decí "5-10 días por DHL Express"

NUNCA asumas Uruguay. SIEMPRE chequeá pais_envio en los datos.
Ejemplo: si pais_envio es "MX", decí "5-10 días por DHL Express a México".

Si después de consultar un pedido el cliente quiere ver MÁS productos,
usá el país del pedido para mostrar precios (no asumas Uruguay).

Si el cliente no está logueado y no da email/número:
"Para buscar tu pedido necesito tu email o número de orden. ¿Me lo pasás?"

REGLA CRÍTICA - GUARDIANES DEL PEDIDO vs PRODUCTOS NUEVOS:

Cuando hablás de un PEDIDO y sus guardianes (ej: Matheo, Freya en el pedido #5365):
- NUNCA llames a mostrar_productos
- NUNCA muestres "otros guardianes que podrían interesarte"
- NUNCA intentes vender cuando el cliente pregunta por su pedido

Si el cliente dice "si" después de preguntarle sobre sus guardianes del pedido:
Respondé SOLO sobre los guardianes del pedido, ejemplo:
"¡Matheo es increíble! Es un guardián de protección. Freya trae amor y sanación.
Leprechaun atrae abundancia. Y Leo es puro coraje. Cuando lleguen vas a recibir su historia completa en Mi Magia."

La función mostrar_productos es SOLO para cuando el cliente quiere VER/COMPRAR guardianes NUEVOS.
NO para cuando pregunta por guardianes que YA COMPRÓ.

=== PRECIOS - REGLA CRÍTICA ===

NUNCA digas precios de memoria. NUNCA inventes rangos de precios.
SIEMPRE que pregunten por precios, cuánto cuestan, o quieran ver guardianes:
→ Llamá a mostrar_productos PRIMERO
→ Usá SOLO los precios que te devuelve la función
→ Cada guardián tiene su precio específico, no hay "rangos"

URUGUAY: Precios en pesos uruguayos (vienen de mostrar_productos)
OTROS: USD + aproximado en moneda local

=== PAGOS ===

INTERNACIONAL: Visa, MasterCard, Amex
URUGUAY: + OCA, Mercado Pago, transferencia
NO HAY PAYPAL

=== PROMOS ===

- 3x2: Llevás 2, regalamos 1 mini
- Envío gratis: USD$1000+ internacional, $10.000+ Uruguay

=== ENVÍOS ===

- Internacional: DHL Express, 5-10 días
- Uruguay: DAC, 3-7 días

=== LINKS ===

- Tienda: https://duendesdeluruguay.com/shop/
- Test: https://duendesdeluruguay.com/descubri-que-duende-te-elige/
- FAQ: https://duendesdeluruguay.com/faq/

=== REGLAS FINALES ===

- NUNCA digas "Soy Tito" (el widget ya te presentó)
- Máximo 150 palabras por mensaje
- UNA pregunta al final
- NO ofrezcas hablar con humanos
- Consultas de pedido → usá consultar_pedido (NO escalar)
- Solo escalar si hay problema GRAVE (error, queja, pedido perdido hace mucho)
`;

// Tools para GPT
const TOOLS = [
  {
    type: "function",
    function: {
      name: "mostrar_productos",
      description: "Mostrar guardianes NUEVOS para comprar. SOLO usar cuando quieren VER o COMPRAR productos nuevos. NUNCA usar cuando preguntan por guardianes de un PEDIDO que ya hicieron.",
      parameters: {
        type: "object",
        properties: {
          categoria: {
            type: "string",
            description: "Filtrar por: proteccion, abundancia, amor, sanacion",
            enum: ["proteccion", "abundancia", "amor", "sanacion", ""]
          },
          cantidad: {
            type: "number",
            description: "Cantidad a mostrar (default 3)"
          }
        }
      }
    }
  },
  {
    type: "function",
    function: {
      name: "convertir_precio",
      description: "Convertir precio USD a moneda local del país",
      parameters: {
        type: "object",
        properties: {
          precio_usd: { type: "number" },
          pais: { type: "string" }
        },
        required: ["precio_usd", "pais"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "consultar_pedido",
      description: "Consultar estado de pedido del cliente. Usar cuando preguntan por su pedido, envío, o estado de compra.",
      parameters: {
        type: "object",
        properties: {
          email: {
            type: "string",
            description: "Email del cliente (se obtiene del contexto si está logueado)"
          },
          numero_pedido: {
            type: "string",
            description: "Número de pedido si lo proporcionó el cliente"
          }
        }
      }
    }
  },
  {
    type: "function",
    function: {
      name: "escalar_a_humano",
      description: "Escalar al equipo SOLO cuando hay un problema REAL que no se puede resolver (error en pedido, queja grave). NO usar para consultas normales de estado.",
      parameters: {
        type: "object",
        properties: {
          tipo: { type: "string", enum: ["venta", "pedido", "queja", "otro"] },
          motivo: { type: "string" },
          detalle: { type: "string" }
        },
        required: ["tipo", "motivo", "detalle"]
      }
    }
  }
];

// Ejecutar tools
async function ejecutarTool(nombre, args, contexto) {
  switch (nombre) {
    case 'mostrar_productos': {
      const productos = await obtenerProductosWoo();
      const cantidad = args.cantidad || 3;
      let filtrados = productos;

      if (args.categoria) {
        // Filtrar por categoría si se especifica
        filtrados = productos.filter(p =>
          p.categorias?.some(c => c.toLowerCase().includes(args.categoria.toLowerCase()))
        );
      }

      // Tomar cantidad solicitada o aleatorios
      const seleccionados = filtrados.slice(0, cantidad);

      // Formatear con precios
      const cotizaciones = await obtenerCotizaciones();
      const pais = contexto.pais || 'UY';

      // Mapeo de país a moneda
      const paisAMoneda = { 'AR': 'ARS', 'MX': 'MXN', 'CO': 'COP', 'CL': 'CLP', 'PE': 'PEN', 'BR': 'BRL', 'ES': 'EUR' };
      const monedaNombres = { 'ARS': 'pesos argentinos', 'MXN': 'pesos mexicanos', 'COP': 'pesos colombianos', 'CLP': 'pesos chilenos', 'PEN': 'soles', 'BRL': 'reales', 'EUR': 'euros' };

      return seleccionados.map(p => {
        const precioUSD = parseFloat(p.precio) || 150;
        let precio_mostrar;

        if (pais === 'UY') {
          // Uruguay: precio fijo en pesos
          const precioUY = PRECIOS_URUGUAY.convertir ? PRECIOS_URUGUAY.convertir(precioUSD) : Math.round(precioUSD * 43);
          precio_mostrar = `$${precioUY.toLocaleString('es-UY')} pesos`;
        } else if (['US', 'EC', 'PA'].includes(pais)) {
          // Países dolarizados
          precio_mostrar = `$${precioUSD} USD`;
        } else {
          // Otros países: convertir
          const codigoMoneda = paisAMoneda[pais] || 'USD';
          const tasa = cotizaciones[codigoMoneda] || 1;
          const precioLocal = Math.round(precioUSD * tasa);
          const nombreMoneda = monedaNombres[codigoMoneda] || 'dólares';
          precio_mostrar = `$${precioUSD} USD (~$${precioLocal.toLocaleString('es')} ${nombreMoneda})`;
        }

        // Descripción real del guardián (más completa para evitar que GPT invente)
        const descripcionReal = p.descripcion || p.descripcionCorta || '';
        // Limitar a 300 chars pero mantener info útil
        const descripcionFinal = descripcionReal.length > 300
          ? descripcionReal.substring(0, 300) + '...'
          : descripcionReal;

        return {
          nombre: p.nombre,
          precio_usd: precioUSD,
          precio_mostrar: precio_mostrar,
          descripcion: descripcionFinal,
          // Info adicional para que GPT no invente
          categoria: p.categorias?.join(', ') || '',
          tipo: p.tipo || 'guardián',
          url: p.url,
          imagen: p.imagen
        };
      });
    }

    case 'convertir_precio': {
      const cotizaciones = await obtenerCotizaciones();
      const convertido = convertirPrecio(args.precio_usd, args.pais, cotizaciones);
      return convertido;
    }

    case 'consultar_pedido': {
      // Obtener email del usuario logueado o del parámetro
      const email = contexto.usuario?.email || args.email;
      const numeroPedido = args.numero_pedido;

      if (!email && !numeroPedido) {
        return {
          encontrado: false,
          mensaje: "Necesito tu email o número de pedido para buscarlo. ¿Me lo pasás?"
        };
      }

      try {
        // Consultar WooCommerce API (usar mismas variables que el resto del sistema)
        const wooUrl = process.env.WORDPRESS_URL || process.env.WOO_URL || 'https://duendesdeluruguay.com';
        const wooKey = process.env.WC_CONSUMER_KEY || process.env.WOO_CONSUMER_KEY;
        const wooSecret = process.env.WC_CONSUMER_SECRET || process.env.WOO_CONSUMER_SECRET;

        if (!wooKey || !wooSecret) {
          console.error('[Tito] Faltan credenciales WooCommerce');
          return {
            encontrado: false,
            error: true,
            mensaje: "Tuve un problema técnico. ¿Me pasás tu email para buscarlo de otra forma?"
          };
        }

        let url = `${wooUrl}/wp-json/wc/v3/orders?per_page=5`;
        if (numeroPedido) {
          // Buscar por número específico - limpiar el número
          const numLimpio = numeroPedido.toString().replace(/[^0-9]/g, '');
          url = `${wooUrl}/wp-json/wc/v3/orders/${numLimpio}`;
        } else if (email) {
          url += `&search=${encodeURIComponent(email)}`;
        }

        console.log('[Tito] Consultando pedido:', url.replace(wooUrl, ''));

        const response = await fetch(url, {
          headers: {
            'Authorization': 'Basic ' + Buffer.from(`${wooKey}:${wooSecret}`).toString('base64')
          }
        });

        console.log('[Tito] Respuesta WooCommerce:', response.status);

        if (!response.ok) {
          if (response.status === 404) {
            return {
              encontrado: false,
              mensaje: "No encontré ese pedido. ¿Podés verificar el número?"
            };
          }
          const errorText = await response.text();
          console.error('[Tito] Error WooCommerce:', response.status, errorText);
          throw new Error(`Error WooCommerce: ${response.status}`);
        }

        const data = await response.json();
        const pedidos = Array.isArray(data) ? data : [data];

        if (pedidos.length === 0) {
          return {
            encontrado: false,
            mensaje: "No encontré pedidos con ese email. ¿Usaste otro email para comprar?"
          };
        }

        // Mapear estados a mensajes amigables y tranquilizadores
        const estadosMensajes = {
          'pending': { estado: 'Pendiente de pago', emoji: '⏳', mensaje: 'Tu pedido está esperando confirmación del pago. Si ya pagaste, en breve se actualiza.' },
          'processing': { estado: 'Preparando tu pedido', emoji: '✨', mensaje: '¡Tu guardián se está preparando para el viaje! Estamos poniéndole mucho amor.' },
          'on-hold': { estado: 'En espera', emoji: '⏸️', mensaje: 'Tu pedido está en pausa. Si tenés dudas, escribinos.' },
          'completed': { estado: 'Completado', emoji: '🎉', mensaje: '¡Tu guardián ya llegó a su nuevo hogar! Esperamos que lo estés disfrutando.' },
          'shipped': { estado: 'Enviado', emoji: '📦', mensaje: '¡Tu guardián ya está viajando hacia vos! Pronto llega.' },
          'cancelled': { estado: 'Cancelado', emoji: '❌', mensaje: 'Este pedido fue cancelado.' },
          'refunded': { estado: 'Reembolsado', emoji: '💰', mensaje: 'Este pedido fue reembolsado.' },
          'failed': { estado: 'Fallido', emoji: '⚠️', mensaje: 'Hubo un problema con el pago. ¿Querés intentar de nuevo?' }
        };

        // Procesar pedidos encontrados
        const pedidosInfo = pedidos.slice(0, 3).map(p => {
          const statusInfo = estadosMensajes[p.status] || { estado: p.status, emoji: '📋', mensaje: '' };

          // Buscar tracking si existe (puede estar en meta_data)
          let tracking = null;
          const trackingMeta = p.meta_data?.find(m =>
            m.key === '_tracking_number' || m.key === 'tracking_number' || m.key === '_wc_shipment_tracking_items'
          );
          if (trackingMeta) {
            tracking = typeof trackingMeta.value === 'string' ? trackingMeta.value : trackingMeta.value?.[0]?.tracking_number;
          }

          // Calcular días desde el pedido
          const fechaPedido = new Date(p.date_created);
          const diasDesde = Math.floor((Date.now() - fechaPedido) / (1000 * 60 * 60 * 24));

          return {
            numero: p.id,
            fecha: fechaPedido.toLocaleDateString('es-UY', { day: 'numeric', month: 'long', year: 'numeric' }),
            estado: statusInfo.estado,
            emoji: statusInfo.emoji,
            mensaje_estado: statusInfo.mensaje,
            total: `$${p.total} ${p.currency}`,
            items: p.line_items?.map(i => i.name).join(', ') || 'Guardianes',
            tracking: tracking,
            dias_desde_pedido: diasDesde,
            pais_envio: p.shipping?.country || p.billing?.country
          };
        });

        return {
          encontrado: true,
          cantidad: pedidosInfo.length,
          pedidos: pedidosInfo,
          mensaje_general: "¡Tranqui! Acá tenés la info de tu pedido. Todo está en orden 🍀"
        };

      } catch (error) {
        console.error('[Tito] Error consultando pedido:', error);
        return {
          encontrado: false,
          error: true,
          mensaje: "Tuve un problemita consultando. ¿Me pasás tu número de pedido para buscarlo manualmente?"
        };
      }
    }

    case 'escalar_a_humano': {
      const ticket = {
        id: `ESC-${Date.now()}`,
        fecha: new Date().toISOString(),
        tipo: args.tipo,
        motivo: args.motivo,
        detalle: args.detalle,
        estado: 'pendiente'
      };

      await kv.set(`escalamiento:${ticket.id}`, ticket, { ex: 7 * 24 * 60 * 60 });

      const pendientes = await kv.get('escalamientos:pendientes') || [];
      pendientes.unshift({ id: ticket.id, fecha: ticket.fecha, tipo: args.tipo });
      await kv.set('escalamientos:pendientes', pendientes.slice(0, 100));

      return { success: true, ticketId: ticket.id };
    }

    default:
      return { error: 'Tool no encontrada' };
  }
}

// Detectar país del mensaje
function detectarPais(mensaje) {
  const msg = mensaje.toLowerCase();
  const paises = {
    'uruguay': 'UY', 'uruguayo': 'UY',
    'argentina': 'AR', 'argentino': 'AR', 'argentna': 'AR',
    'mexico': 'MX', 'méxico': 'MX', 'mexicano': 'MX',
    'chile': 'CL', 'chileno': 'CL',
    'colombia': 'CO', 'colombiano': 'CO',
    'peru': 'PE', 'perú': 'PE', 'peruano': 'PE',
    'españa': 'ES', 'espana': 'ES', 'español': 'ES',
    'estados unidos': 'US', 'usa': 'US', 'eeuu': 'US',
    'brasil': 'BR', 'brasileño': 'BR',
    'ecuador': 'EC', 'panama': 'PA', 'panamá': 'PA'
  };

  for (const [nombre, codigo] of Object.entries(paises)) {
    if (msg.includes(nombre)) return codigo;
  }
  return null;
}

export async function POST(request) {
  try {
    const body = await request.json();

    // Aceptar parámetros del widget (message/history) o directos (mensaje/conversationHistory)
    const mensaje = body.mensaje || body.message;
    const conversationHistory = body.conversationHistory || body.history || [];
    const paisParam = body.pais || body.pais_cliente;
    const usuario = body.usuario || null; // Info del usuario logueado

    if (!mensaje) {
      return Response.json({ error: 'Mensaje requerido' }, { status: 400, headers: CORS_HEADERS });
    }

    // ═══════════════════════════════════════════════════════════════
    // RESPUESTAS RÁPIDAS SIN IA - AHORRA TOKENS
    // ═══════════════════════════════════════════════════════════════
    const msgLower = mensaje.toLowerCase().trim();

    // Detectar país del historial si existe
    let paisDelHistorial = null;
    for (const h of conversationHistory) {
      const p = detectarPais(h.content || '');
      if (p) { paisDelHistorial = p; break; }
    }
    const paisDetectado = paisParam || detectarPais(mensaje) || paisDelHistorial;

    // Función helper para respuesta rápida
    const respuestaRapida = (texto, razon) => {
      console.log(`[Tito] Respuesta rápida: ${razon}`);
      return Response.json({
        success: true,
        respuesta: texto,
        productos: [],
        pais: paisDetectado,
        modelo: 'ninguno',
        razon_modelo: razon
      }, { headers: CORS_HEADERS });
    };

    // ─────────────────────────────────────────────────────────────
    // SPAM - "amén", lotería, solo emojis
    // ─────────────────────────────────────────────────────────────
    if (
      /^(amen|amén|bendiciones?|bendecido)$/i.test(msgLower) ||
      /^(dame suerte|buena vibra|buenas vibras|suerte)$/i.test(msgLower) ||
      /^(dame los n[uú]meros|5 de oro|loter[ií]a|quiniela|n[uú]meros)/i.test(msgLower) ||
      /^[\p{Emoji}\s]+$/u.test(mensaje.trim()) ||
      msgLower.length < 3
    ) {
      return respuestaRapida(
        '¡Que la magia te acompañe! 🍀 Si algún día sentís el llamado de un guardián, acá estoy.',
        'spam'
      );
    }

    // ─────────────────────────────────────────────────────────────
    // SALUDO INICIAL - "hola", "buenas"
    // ─────────────────────────────────────────────────────────────
    if (/^(hola|buenas?|buenos d[ií]as|buenas tardes|buenas noches|hey|ey|hi|hello)[\s!?.]*$/i.test(msgLower) && conversationHistory.length <= 1) {
      return respuestaRapida(
        '¡Ey! Soy Tito 🍀 ¿De qué país me escribís? Así te paso los precios en tu moneda.',
        'saludo'
      );
    }

    // ─────────────────────────────────────────────────────────────
    // PRECIOS - Respuesta DIRECTA con productos reales (sin GPT)
    // ─────────────────────────────────────────────────────────────
    const preguntaPorPrecios = /cu[aá]nto cuestan?|precios?|cu[aá]nto valen?|cu[aá]nto salen?|qu[eé] precios|ver guardianes|mostrame|quiero ver/i.test(msgLower);

    if (preguntaPorPrecios && !paisDetectado) {
      return respuestaRapida(
        '¿De qué país me escribís? Así te paso los precios en tu moneda 🍀',
        'precio_sin_pais'
      );
    }

    // Si pregunta por precios Y tenemos país → usar CLAUDE con datos REALES
    if (preguntaPorPrecios && paisDetectado) {
      try {
        const productos = await obtenerProductosWoo();
        const disponibles = productos.filter(p => p.disponible).slice(0, 4);

        if (disponibles.length > 0 && process.env.ANTHROPIC_API_KEY) {
          const cotizaciones = await obtenerCotizaciones();
          const paisAMoneda = { 'AR': 'ARS', 'MX': 'MXN', 'CO': 'COP', 'CL': 'CLP', 'PE': 'PEN', 'BR': 'BRL', 'ES': 'EUR' };
          const monedaNombres = { 'ARS': 'pesos argentinos', 'MXN': 'pesos mexicanos', 'COP': 'pesos colombianos', 'CLP': 'pesos chilenos', 'PEN': 'soles', 'BRL': 'reales', 'EUR': 'euros' };

          // Preparar datos REALES de productos
          const productosConPrecios = disponibles.map(p => {
            const precioUSD = parseFloat(p.precio) || 150;
            let precioMostrar;

            if (paisDetectado === 'UY') {
              const precioUY = PRECIOS_URUGUAY.convertir ? PRECIOS_URUGUAY.convertir(precioUSD) : Math.round(precioUSD * 43);
              precioMostrar = `$${precioUY.toLocaleString('es-UY')} pesos`;
            } else if (['US', 'EC', 'PA'].includes(paisDetectado)) {
              precioMostrar = `$${precioUSD} USD`;
            } else {
              const codigoMoneda = paisAMoneda[paisDetectado] || 'USD';
              const tasa = cotizaciones[codigoMoneda] || 1;
              const precioLocal = Math.round(precioUSD * tasa);
              const nombreMoneda = monedaNombres[codigoMoneda] || 'dólares';
              precioMostrar = `$${precioUSD} USD (~$${precioLocal.toLocaleString('es')} ${nombreMoneda})`;
            }

            return {
              nombre: p.nombre,
              precio: precioMostrar,
              descripcion: p.descripcionCorta || p.descripcion?.substring(0, 150) || '',
              categoria: p.categorias?.join(', ') || '',
              imagen: p.imagen,
              url: p.url
            };
          });

          // Claude escribe la respuesta usando SOLO estos datos
          const promptClaude = `Sos Tito, un duende vendedor de Piriápolis. Hablás uruguayo (vos, tenés).

El cliente preguntó por precios/guardianes. Acá están los datos REALES de la tienda:

${productosConPrecios.map((p, i) => `${i+1}. ${p.nombre}
   Precio: ${p.precio}
   ${p.descripcion}`).join('\n\n')}

REGLAS:
- Presentá estos guardianes de forma cálida y vendedora
- Usá EXACTAMENTE los precios que te di (no inventes otros)
- Mencioná el nombre y precio de cada uno
- Agregá una descripción breve basada en lo que te di
- Terminá preguntando cuál le llamó la atención
- Máximo 150 palabras
- NO pongas links ni URLs`;

          const claudeResponse = await anthropic.messages.create({
            model: 'claude-sonnet-4-20250514',
            max_tokens: 400,
            messages: [{ role: 'user', content: promptClaude }]
          });

          const respuestaClaude = claudeResponse.content[0]?.text || '';

          return Response.json({
            success: true,
            respuesta: respuestaClaude,
            productos: productosConPrecios.map(p => ({
              nombre: p.nombre,
              precio_mostrar: p.precio,
              imagen: p.imagen,
              url: p.url
            })),
            pais: paisDetectado,
            modelo: 'claude-sonnet',
            razon_modelo: 'venta_productos'
          }, { headers: CORS_HEADERS });
        }
      } catch (e) {
        console.error('[Tito] Error con Claude para productos:', e);
        // Si falla, continúa con GPT
      }
    }

    // ─────────────────────────────────────────────────────────────
    // DE DÓNDE SON / DÓNDE ESTÁN
    // ─────────────────────────────────────────────────────────────
    if (/de d[oó]nde son|d[oó]nde est[aá]n|d[oó]nde queda|de qu[eé] pa[ií]s|ubicaci[oó]n/i.test(msgLower)) {
      return respuestaRapida(
        'Somos de Piriápolis, Uruguay 🇺🇾 Nacemos en el bosque, pero viajamos a todo el mundo.',
        'ubicacion'
      );
    }

    // ─────────────────────────────────────────────────────────────
    // ENVÍOS
    // ─────────────────────────────────────────────────────────────
    if (/hacen env[ií]os?|env[ií]an a|llegan? a|mandan a|shipping/i.test(msgLower)) {
      return respuestaRapida(
        'Sí, enviamos a todo el mundo 🌎 Por DHL Express, llega en 5-10 días con tracking. ¿De qué país sos?',
        'envios'
      );
    }

    if (/cu[aá]nto (tarda|demora|tiempo)|d[ií]as de env[ií]o|tiempo de entrega/i.test(msgLower)) {
      const respEnvio = paisDetectado === 'UY'
        ? 'En Uruguay: 3-7 días hábiles por DAC 📦'
        : 'Internacional: 5-10 días hábiles por DHL Express 📦 Con tracking completo.';
      return respuestaRapida(respEnvio, 'tiempo_envio');
    }

    // ─────────────────────────────────────────────────────────────
    // MÉTODOS DE PAGO
    // ─────────────────────────────────────────────────────────────
    if (/m[eé]todos? de pago|c[oó]mo (pago|puedo pagar)|formas? de pago|pagan con|aceptan/i.test(msgLower)) {
      const respPago = paisDetectado === 'UY'
        ? 'En Uruguay: Visa, Master, Amex, OCA, PassCard, Cabal, Anda, Club del Este, Redpagos, Itaú, Mercado Pago, y transferencia bancaria (BROU, Bandes, BBVA, Scotiabank) 💳'
        : 'Internacional: Visa, MasterCard, American Express 💳 Tu banco convierte automáticamente a tu moneda.';
      return respuestaRapida(respPago, 'metodos_pago');
    }

    if (/paypal|pay pal/i.test(msgLower)) {
      return respuestaRapida(
        'No tenemos PayPal, pero sí Visa, MasterCard y Amex. En Uruguay también Mercado Pago y transferencia 💳',
        'paypal'
      );
    }

    // ─────────────────────────────────────────────────────────────
    // SEGURIDAD / CONFIANZA
    // ─────────────────────────────────────────────────────────────
    if (/es (seguro|confiable)|puedo confiar|es real|no es estafa|ser[aá] verdad/i.test(msgLower)) {
      return respuestaRapida(
        'Llevamos años enviando guardianes a más de 30 países 🌎 Pago seguro, envío con tracking, y miles de personas felices con su guardián. Podés ver reseñas en nuestra página.',
        'confianza'
      );
    }

    // ─────────────────────────────────────────────────────────────
    // PERSONALIZADOS / ENCARGOS
    // ─────────────────────────────────────────────────────────────
    if (/personalizado|encargo|me (hacen|pueden hacer)|hagan uno|a pedido|custom/i.test(msgLower)) {
      return respuestaRapida(
        'No hacemos encargos ni personalizados. Cada guardián nace cuando tiene que nacer, no se puede apurar una canalización. Los que ves en la tienda son los que están listos para encontrar su humano 🍀',
        'personalizados'
      );
    }

    // ─────────────────────────────────────────────────────────────
    // TIENDA FÍSICA
    // ─────────────────────────────────────────────────────────────
    if (/tienda f[ií]sica|local|puedo ir|visitarlos|showroom|conocer el lugar/i.test(msgLower)) {
      return respuestaRapida(
        'Estamos en Piriápolis, Uruguay, pero por ahora solo vendemos online. ¡Los guardianes viajan a todo el mundo! 🌎',
        'tienda_fisica'
      );
    }

    // ─────────────────────────────────────────────────────────────
    // TAMAÑOS / MEDIDAS
    // ─────────────────────────────────────────────────────────────
    if (/cu[aá]nto mide|tama[ñn]o|medida|qu[eé] tan grande|dimensiones/i.test(msgLower)) {
      return respuestaRapida(
        'Cada guardián tiene su medida exacta en la web. Van desde minis (~10cm) hasta gigantes (~50cm+). El precio es por el trabajo completo, no por tamaño 🍀',
        'medidas'
      );
    }

    // ─────────────────────────────────────────────────────────────
    // DESCUENTOS / PROMOS
    // ─────────────────────────────────────────────────────────────
    if (/descuento|promo|oferta|rebaja|cupon|cup[oó]n|c[oó]digo/i.test(msgLower)) {
      return respuestaRapida(
        '¡Sí! Tenemos el 3x2: llevás 2 guardianes y te regalamos 1 mini 🎁 Y envío gratis en compras grandes.',
        'promos'
      );
    }

    // ─────────────────────────────────────────────────────────────
    // CÓMO FUNCIONA
    // ─────────────────────────────────────────────────────────────
    if (/c[oó]mo funciona|qu[eé] es esto|de qu[eé] se trata|explicame|expl[ií]came/i.test(msgLower)) {
      return respuestaRapida(
        `Los guardianes son seres mágicos únicos, creados a mano con cristales naturales. Cada uno tiene su energía y propósito.

✨ Cómo encontrar el tuyo:
1. Hacé el Test del Guardián para descubrir cuál resuena con vos: https://duendesdeluruguay.com/descubri-que-duende-te-elige/
2. O mirá los guardianes en la tienda - el que te llame la atención, ese te eligió
3. Lo adoptás y te llega con su canalización personalizada (un mensaje único para vos)
4. En "Mi Magia" vas a encontrar su historia, ritual de bienvenida y cómo cuidarlo

¿Querés hacer el test o que te muestre algunos guardianes? 🍀`,
        'como_funciona'
      );
    }

    // ─────────────────────────────────────────────────────────────
    // TEST DEL GUARDIÁN
    // ─────────────────────────────────────────────────────────────
    if (/test|cu[aá]l (es para m[ií]|me corresponde|es el m[ií]o)|no s[eé] cu[aá]l elegir|ay[uú]dame a elegir|cu[aá]l me recomiend/i.test(msgLower)) {
      return respuestaRapida(
        '¡Tenemos un test para eso! Te hace preguntas y te dice qué guardián resuena con tu energía: https://duendesdeluruguay.com/descubri-que-duende-te-elige/ 🍀',
        'test'
      );
    }

    // ─────────────────────────────────────────────────────────────
    // QUÉ SIGNIFICA CANALIZADO (también confunden con "personalizado")
    // ─────────────────────────────────────────────────────────────
    if (/qu[eé] (significa|es|quiere decir).*(canaliza|personaliza)|canaliza.*para m[ií]|personaliza.*para m[ií]|c[oó]mo.*canaliza|mensaje.*(personal|canaliza)/i.test(msgLower)) {
      return respuestaRapida(
        `Cada guardián viene con una CANALIZACIÓN: un mensaje único que tu guardián tiene para vos.

Después de comprar te llega un email con un formulario. Ahí compartís un poco de vos (sin contar todo, para que la magia funcione). Con eso, el guardián te envía un mensaje personal que solo vos vas a recibir.

No es un texto genérico - es SU mensaje para VOS. Por eso cada canalización es diferente y muchas personas se emocionan al leerla 🍀`,
        'canalizacion'
      );
    }

    // ─────────────────────────────────────────────────────────────
    // DESPEDIDAS / AGRADECIMIENTOS
    // ─────────────────────────────────────────────────────────────
    if (/^(gracias|muchas gracias|thanks|thx|grax|ty)[\s!.]*$/i.test(msgLower)) {
      return respuestaRapida(
        '¡A vos! 🍀 Cuando sientas el llamado de un guardián, acá estoy.',
        'gracias'
      );
    }

    if (/^(chau|adi[oó]s|bye|nos vemos|hasta luego)[\s!.]*$/i.test(msgLower)) {
      return respuestaRapida(
        '¡Hasta pronto! 🍀 Que la magia te acompañe.',
        'despedida'
      );
    }

    // ─────────────────────────────────────────────────────────────
    // RESPUESTAS VACÍAS - "ok", "dale", "sí" sin contexto
    // ─────────────────────────────────────────────────────────────
    if (/^(ok|dale|si|sí|ya|bien|bueno|ta|está bien|listo)[\s!.]*$/i.test(msgLower) && conversationHistory.length <= 1) {
      return respuestaRapida(
        '¿En qué te puedo ayudar? 🍀',
        'confirmacion_vacia'
      );
    }

    // Detectar si necesita Claude (más inteligente) o GPT (más barato)
    const deteccion = necesitaClaude(mensaje, conversationHistory);
    const usarClaude = deteccion.usar;
    const modeloUsado = usarClaude ? 'claude-sonnet' : 'gpt-4o-mini';

    console.log(`[Tito] Modelo: ${modeloUsado} (razón: ${deteccion.razon || 'simple'})`);

    // Detectar país
    let pais = paisParam || detectarPais(mensaje);

    // Buscar en historial si no se detectó
    if (!pais && conversationHistory.length > 0) {
      for (const h of conversationHistory) {
        const detectado = detectarPais(h.content || '');
        if (detectado) {
          pais = detectado;
          break;
        }
      }
    }

    // Construir mensajes
    const messages = [
      { role: 'system', content: PERSONALIDAD_TITO }
    ];

    // Agregar historial (últimos 6 mensajes)
    if (conversationHistory.length > 0) {
      conversationHistory.slice(-6).forEach(h => {
        messages.push({
          role: h.role || 'user',
          content: h.content || h.mensaje || ''
        });
      });
    }

    // Agregar contexto de país si lo tenemos
    let mensajeConContexto = mensaje;
    if (pais) {
      mensajeConContexto = `[País detectado: ${pais}]\n\n${mensaje}`;
    }

    messages.push({ role: 'user', content: mensajeConContexto });

    // Llamar a GPT
    let response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages,
      tools: TOOLS,
      tool_choice: 'auto',
      max_tokens: 500,
      temperature: 0.4
    });

    let assistantMessage = response.choices[0].message;
    let toolsUsadas = [];
    let productosParaMostrar = [];

    // Procesar tool calls (máximo 3 iteraciones)
    let iterations = 0;
    while (assistantMessage.tool_calls && iterations < 3) {
      iterations++;
      const toolResults = [];

      for (const toolCall of assistantMessage.tool_calls) {
        const args = JSON.parse(toolCall.function.arguments);
        const resultado = await ejecutarTool(toolCall.function.name, args, { pais, usuario });

        toolsUsadas.push(toolCall.function.name);

        if (toolCall.function.name === 'mostrar_productos' && Array.isArray(resultado)) {
          productosParaMostrar = resultado;
        }

        toolResults.push({
          tool_call_id: toolCall.id,
          role: 'tool',
          content: JSON.stringify(resultado)
        });
      }

      // Continuar conversación con resultados
      messages.push(assistantMessage);
      messages.push(...toolResults);

      response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages,
        tools: TOOLS,
        tool_choice: 'auto',
        max_tokens: 500,
        temperature: 0.4
      });

      assistantMessage = response.choices[0].message;
    }

    let respuestaFinal = assistantMessage.content || '';
    let modeloFinal = 'gpt-4o-mini';

    // Si es situación importante, usar Claude para respuesta final más inteligente
    if (usarClaude && process.env.ANTHROPIC_API_KEY) {
      try {
        // Extraer datos importantes de los resultados de herramientas
        let datosDelPedido = null;
        for (const m of messages) {
          if (m.role === 'tool' && m.content) {
            try {
              const toolData = JSON.parse(m.content);
              if (toolData.pedidos && toolData.pedidos[0]) {
                datosDelPedido = toolData.pedidos[0];
              }
            } catch (e) {}
          }
        }

        // Construir contexto claro para Claude
        let instruccionClaude = PERSONALIDAD_TITO + '\n\n';
        instruccionClaude += `IMPORTANTE - DATOS DEL CONTEXTO:\n`;
        instruccionClaude += `- País del cliente: ${pais || 'no detectado'}\n`;

        if (datosDelPedido) {
          instruccionClaude += `\nDATOS DEL PEDIDO CONSULTADO:\n`;
          instruccionClaude += `- Número: ${datosDelPedido.numero}\n`;
          instruccionClaude += `- Estado: ${datosDelPedido.estado}\n`;
          instruccionClaude += `- Items: ${datosDelPedido.items}\n`;
          instruccionClaude += `- País de envío: ${datosDelPedido.pais_envio}\n`;
          instruccionClaude += `- Total: ${datosDelPedido.total}\n`;
          instruccionClaude += `\nTIEMPOS DE ENVÍO SEGÚN PAÍS:\n`;
          instruccionClaude += `- Si pais_envio es UY: "3-7 días por DAC"\n`;
          instruccionClaude += `- Si pais_envio es OTRO (${datosDelPedido.pais_envio}): "5-10 días por DHL Express"\n`;
        }

        // Construir mensajes para Claude
        const contextoParaClaude = [];

        // Agregar historial relevante (sin el system prompt que ya está en instruccionClaude)
        for (const m of messages) {
          if (m.role === 'user' && !m.content.startsWith('[INSTRUCCIONES')) {
            contextoParaClaude.push({ role: 'user', content: m.content });
          } else if (m.role === 'assistant' && m.content) {
            contextoParaClaude.push({ role: 'assistant', content: m.content });
          }
        }

        // Mensaje final pidiendo respuesta
        contextoParaClaude.push({
          role: 'user',
          content: `Basándote en los datos del pedido, respondé al cliente. Recordá usar el país de envío correcto (${datosDelPedido?.pais_envio || pais || 'verificar'}) para los tiempos de entrega.`
        });

        const claudeResponse = await anthropic.messages.create({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 500,
          system: instruccionClaude,
          messages: contextoParaClaude
        });

        if (claudeResponse.content && claudeResponse.content[0]) {
          respuestaFinal = claudeResponse.content[0].text;
          modeloFinal = 'claude-sonnet';
        }
      } catch (claudeError) {
        console.error('[Tito] Error con Claude, usando GPT:', claudeError.message);
        // Mantener respuesta de GPT como fallback
      }
    }

    // Agregar UTM a los links para tracking
    const respuestaConTracking = respuestaFinal
      .replace(/duendesdeluruguay\.com\/shop\/?/g, 'duendesdeluruguay.com/shop/?utm_source=tito')
      .replace(/duendesdeluruguay\.com\/product\//g, 'duendesdeluruguay.com/product/?utm_source=tito&product=');

    return Response.json({
      success: true,
      respuesta: respuestaConTracking,
      productos: productosParaMostrar,
      pais,
      tools: toolsUsadas,
      modelo: modeloFinal,
      razon_modelo: deteccion.razon
    }, { headers: CORS_HEADERS });

  } catch (error) {
    console.error('[Tito GPT] Error:', error);
    return Response.json({
      success: false,
      error: error.message,
      respuesta: 'Uy, se me cruzaron los cables 😅 ¿Podés escribirme de nuevo?'
    }, { status: 500, headers: CORS_HEADERS });
  }
}
