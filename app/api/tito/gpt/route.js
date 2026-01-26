/**
 * TITO con GPT-4o-mini
 * Optimizado para ventas, bajo costo
 */

import OpenAI from 'openai';
import { kv } from '@vercel/kv';
import { obtenerProductosWoo } from '@/lib/tito/conocimiento';
import { obtenerCotizaciones, PRECIOS_URUGUAY, convertirPrecio } from '@/lib/tito/cotizaciones';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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
- Si hay problema real (pedido, queja) → usá escalar_a_humano
`;

// Tools para GPT
const TOOLS = [
  {
    type: "function",
    function: {
      name: "mostrar_productos",
      description: "Mostrar guardianes disponibles. Usar cuando piden ver productos, precios, o guardianes.",
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
      name: "escalar_a_humano",
      description: "Escalar al equipo cuando hay problema real (pedido, queja). NO ofrecer esta opción al cliente.",
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

    if (!mensaje) {
      return Response.json({ error: 'Mensaje requerido' }, { status: 400, headers: CORS_HEADERS });
    }

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
      temperature: 0.7
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
        const resultado = await ejecutarTool(toolCall.function.name, args, { pais });

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
        temperature: 0.7
      });

      assistantMessage = response.choices[0].message;
    }

    const respuestaFinal = assistantMessage.content || '';

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
      modelo: 'gpt-4o-mini'
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
