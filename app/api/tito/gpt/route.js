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

SI PIDE VER GUARDIANES:
→ Usá la función mostrar_productos
→ Mostrá 3 con precios en su moneda
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

=== PRECIOS ===

URUGUAY: Solo pesos uruguayos
OTROS: USD + aproximado en moneda local

Rangos:
- Minis: ~$70 USD
- Medianos: ~$150-200 USD
- Grandes: ~$300-450 USD

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

        return {
          nombre: p.nombre,
          precio_usd: precioUSD,
          precio_mostrar: precio_mostrar,
          descripcion: p.descripcion?.substring(0, 100) || '',
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
        // Construir contexto para Claude
        const contextoParaClaude = messages.map(m => {
          if (m.role === 'system') return { role: 'user', content: `[INSTRUCCIONES DEL SISTEMA]\n${m.content}` };
          if (m.role === 'tool') return { role: 'user', content: `[RESULTADO DE HERRAMIENTA]\n${m.content}` };
          return { role: m.role === 'assistant' ? 'assistant' : 'user', content: m.content || JSON.stringify(m) };
        }).filter(m => m.content);

        // Agregar la respuesta de GPT como contexto
        if (respuestaFinal) {
          contextoParaClaude.push({
            role: 'user',
            content: `[GPT sugirió esta respuesta, mejorala si es necesario]: ${respuestaFinal}`
          });
        }

        const claudeResponse = await anthropic.messages.create({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 500,
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
