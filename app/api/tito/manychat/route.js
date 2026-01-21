/**
 * TITO para ManyChat - Instagram, Facebook, WhatsApp
 *
 * Endpoint inteligente que:
 * - Responde preguntas sobre guardianes
 * - Muestra imágenes de productos de WooCommerce
 * - Recomienda guardianes basado en necesidades
 * - Usa formato Dynamic Block de ManyChat para texto + imágenes
 */

import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// ═══════════════════════════════════════════════════════════════
// CONEXIÓN DIRECTA A WOOCOMMERCE
// ═══════════════════════════════════════════════════════════════

const WP_URL = process.env.WORDPRESS_URL || 'https://duendesdeluruguay.com';

function getWooAuth() {
  const key = process.env.WC_CONSUMER_KEY;
  const secret = process.env.WC_CONSUMER_SECRET;
  if (!key || !secret) return null;
  return Buffer.from(`${key}:${secret}`).toString('base64');
}

async function obtenerProductos(params = {}) {
  try {
    const auth = getWooAuth();
    if (!auth) {
      console.error('[MANYCHAT] No hay credenciales de WooCommerce');
      return [];
    }

    // Traer más productos para poder filtrar
    const url = `${WP_URL}/wp-json/wc/v3/products?per_page=50&status=publish&orderby=date&order=desc`;

    const res = await fetch(url, {
      headers: { 'Authorization': `Basic ${auth}` }
    });

    if (!res.ok) {
      console.error('[MANYCHAT] Error WooCommerce:', res.status);
      return [];
    }

    const productos = await res.json();

    // Filtrar: solo guardianes físicos (con imagen, excluyendo membresías y runas)
    const guardianes = productos
      .filter(p => {
        // Debe tener imagen
        if (!p.images || p.images.length === 0) return false;

        // Excluir membresías y paquetes de runas
        const nombre = p.name.toLowerCase();
        const categorias = p.categories?.map(c => c.name.toLowerCase()).join(' ') || '';

        if (nombre.includes('círculo') || nombre.includes('circulo')) return false;
        if (nombre.includes('membresía') || nombre.includes('membresia')) return false;
        if (nombre.includes('paquete') && nombre.includes('runa')) return false;
        if (nombre.includes('runas')) return false;
        if (categorias.includes('membresía')) return false;

        return true;
      })
      .slice(0, params.limite || 6)
      .map(p => ({
        id: p.id,
        nombre: p.name,
        precio: p.price,
        imagen: p.images[0]?.src || null,
        url: p.permalink,
        descripcionCorta: p.short_description?.replace(/<[^>]*>/g, '').substring(0, 100),
        categorias: p.categories?.map(c => c.name).join(', ')
      }));

    return guardianes;

  } catch (error) {
    console.error('[MANYCHAT] Error obteniendo productos:', error);
    return [];
  }
}

async function obtenerRecomendaciones(intencion) {
  // Por ahora devuelve todos los productos
  // Después se puede filtrar por categoría según intención
  return obtenerProductos({ limite: 6 });
}

// ═══════════════════════════════════════════════════════════════
// DETECTORES DE INTENCIÓN
// ═══════════════════════════════════════════════════════════════

const PALABRAS_PEDIDO = [
  'pedido', 'orden', 'envío', 'envio', 'paquete', 'compré', 'compre',
  'pagué', 'pague', 'cuándo llega', 'cuando llega', 'mi guardián',
  'mi guardian', 'ya pagué', 'ya pague', 'transferí', 'transferi',
  'número de seguimiento', 'tracking', 'dónde está', 'donde esta',
  'no me llegó', 'no me llego', 'estado de mi', 'mi compra'
];

const PALABRAS_NERVIOSISMO = [
  'preocupado', 'preocupada', 'nervioso', 'nerviosa', 'urgente',
  'ya pasaron', 'hace días', 'hace semanas', 'no responden',
  'estafa', 'fraude', 'mentira', 'devolver', 'devolución',
  'reclamo', 'queja', 'enojado', 'enojada', 'molesto', 'molesta'
];

const PALABRAS_VER_PRODUCTOS = [
  'mostrame', 'muéstrame', 'mostrá', 'quiero ver', 'tienen fotos',
  'fotos', 'imágenes', 'imagenes', 'ver uno', 'ver alguno',
  'cómo son', 'como son', 'cómo lucen', 'como lucen',
  'puedo ver', 'qué tienen', 'que tienen', 'tienen disponibles',
  'ver guardianes', 'ver duendes', 'ver elfos', 'ver hadas',
  'mostrar', 'enseñame', 'enseñá'
];

const PALABRAS_RECOMENDAR = [
  'recomienda', 'recomendás', 'recomendas', 'sugerí', 'sugeri',
  'cuál me sirve', 'cual me sirve', 'necesito', 'busco',
  'para protección', 'para proteccion', 'para abundancia',
  'para el amor', 'para sanar', 'para sanación', 'para sanacion',
  'qué guardián', 'que guardian', 'cuál guardián', 'cual guardian',
  'ayudame a elegir', 'no sé cuál', 'no se cual'
];

function detectarIntencion(mensaje) {
  const msgLower = mensaje.toLowerCase();

  return {
    preguntaPedido: PALABRAS_PEDIDO.some(p => msgLower.includes(p)),
    nervioso: PALABRAS_NERVIOSISMO.some(p => msgLower.includes(p)),
    quiereVerProductos: PALABRAS_VER_PRODUCTOS.some(p => msgLower.includes(p)),
    quiereRecomendacion: PALABRAS_RECOMENDAR.some(p => msgLower.includes(p)),
    // Detectar necesidades específicas para recomendación
    necesidad: detectarNecesidad(msgLower)
  };
}

function detectarNecesidad(msg) {
  if (msg.includes('protec')) return 'protección';
  if (msg.includes('abundan') || msg.includes('prosper') || msg.includes('dinero')) return 'abundancia';
  if (msg.includes('amor') || msg.includes('pareja') || msg.includes('relacion')) return 'amor';
  if (msg.includes('sana') || msg.includes('salud') || msg.includes('curar')) return 'sanación';
  if (msg.includes('paz') || msg.includes('tranquil') || msg.includes('calma')) return 'paz';
  if (msg.includes('creativ') || msg.includes('inspira') || msg.includes('arte')) return 'creatividad';
  return null;
}

// ═══════════════════════════════════════════════════════════════
// FORMATO MANYCHAT DYNAMIC BLOCK
// ═══════════════════════════════════════════════════════════════

function crearRespuestaTexto(texto) {
  return {
    version: 'v2',
    content: {
      messages: [
        { type: 'text', text: texto }
      ]
    }
  };
}

function crearRespuestaConImagen(texto, imagenUrl) {
  return {
    version: 'v2',
    content: {
      messages: [
        { type: 'text', text: texto },
        { type: 'image', url: imagenUrl }
      ]
    }
  };
}

function crearRespuestaConGaleria(texto, productos) {
  // ManyChat Gallery/Cards format
  const cards = productos.slice(0, 10).map(p => ({
    title: p.nombre,
    subtitle: `$${p.precio} USD`,
    image_url: p.imagen,
    buttons: [
      {
        type: 'url',
        caption: 'Ver más',
        url: p.url || `https://duendesdeluruguay.com/?p=${p.id}`
      }
    ]
  }));

  return {
    version: 'v2',
    content: {
      messages: [
        { type: 'text', text: texto },
        {
          type: 'cards',
          elements: cards,
          image_aspect_ratio: 'square'
        }
      ]
    }
  };
}

function crearRespuestaConProducto(texto, producto) {
  return {
    version: 'v2',
    content: {
      messages: [
        { type: 'text', text: texto },
        {
          type: 'cards',
          elements: [{
            title: producto.nombre,
            subtitle: `$${producto.precio} USD${producto.descripcionCorta ? ' - ' + producto.descripcionCorta : ''}`,
            image_url: producto.imagen,
            buttons: [
              {
                type: 'url',
                caption: 'Conocer más',
                url: producto.url || `https://duendesdeluruguay.com/?p=${producto.id}`
              }
            ]
          }],
          image_aspect_ratio: 'square'
        }
      ]
    }
  };
}

// ═══════════════════════════════════════════════════════════════
// SYSTEM PROMPT PARA TITO
// ═══════════════════════════════════════════════════════════════

const SYSTEM_PROMPT = `
=== QUIÉN SOS ===
Sos TITO, el asistente de Duendes del Uruguay.
Hablás como uruguayo: usás "vos", "tenés", "podés" (NUNCA "tú" o "usted").
Sos cálido, cercano, tranquilo. NUNCA sonás a robot o IA.

=== SOBRE DUENDES DEL URUGUAY ===
Somos Thibisay y Gabriel, un equipo que canaliza guardianes en Piriápolis, Uruguay.
Los guardianes son seres mágicos, compañeros energéticos únicos.
NO son "productos", NO son "muñecos", NO son "artesanías".
Cada guardián elige a su persona, no al revés.
Cada uno viene con una canalización personal (mensaje energético único para vos).

Tipos de guardianes:
- Duendes: Protectores del hogar, traviesos pero leales
- Elfos: Seres de luz, sanadores, elevan la vibración
- Hadas: Guardianas de sueños y creatividad
- Magos: Guardianes del conocimiento ancestral
- Brujas: Poder femenino y transformación
- Gnomos: Abundancia y prosperidad

Cada guardián se especializa en: Protección, Amor, Abundancia, Intuición, Salud, Creatividad, Sabiduría, Paz, etc.

=== PIRIÁPOLIS - IMPORTANTE ===
Piriápolis es un punto energético único donde convergen líneas de energía.
Los cerros sagrados + el océano crean un portal natural.
Los guardianes nacen cargados con esta energía especial.

=== LA WEB ===
Web principal: www.duendesdeluruguay.com
Portal Mi Magia: duendes-vercel.vercel.app (para quienes ya compraron)

=== EL CÍRCULO DE DUENDES ===
Membresía privada - "una hermandad, no una suscripción".
- Trial gratis 15 días
- Mensual $15 USD / Semestral $50 USD / Anual $80 USD
Incluye: contenido semanal, rituales, meditaciones, comunidad privada, descuentos.

=== CÓMO RESPONDER ===
- Mensajes CORTOS (2-3 oraciones máximo)
- 1-2 emojis máximo
- Preguntá algo al final para mantener la conversación
- Usá el nombre si lo tenés

=== SI PIDEN VER GUARDIANES ===
Tenés acceso a los productos disponibles. Cuando alguien quiere ver:
- Te voy a pasar info de productos disponibles
- SOLO mencioná los que te paso, NUNCA inventes nombres de guardianes
- Si no hay productos disponibles, invitalos a ver la tienda web: www.duendesdeluruguay.com
- PROHIBIDO inventar nombres como "Mago Alderan" o "Hada Lunaria" - solo usá nombres reales del catálogo

=== SI QUIEREN RECOMENDACIÓN ===
Hacé 1-2 preguntas para entender qué necesitan:
- ¿Para qué lo buscan? (protección, abundancia, amor, sanación...)
- ¿Es para ellos o para regalar?
Después recomendá basado en lo que necesitan.

=== SI PREGUNTAN POR UN PEDIDO ===
1. Calmar con empatía
2. Pedir nombre/email/número de pedido
3. Decir que lo pasás al equipo
4. NUNCA inventar estados de pedido

=== SI ESTÁN NERVIOSOS O MOLESTOS ===
1. Validar: "Entiendo perfectamente"
2. Escalar: "Le paso tu mensaje a Thibisay"

=== VISITAS AL ESPACIO FÍSICO ===
Solo por cita previa. Si preguntan, que escriban para coordinar.

=== PROHIBIDO ===
- Decir "los guardianes de Thibisay" (decí "los guardianes" o "nuestros guardianes")
- Llamarlos "muñecos" o "productos"
- Inventar información
- Frases de IA tipo "en los confines", "la bruma del tiempo"
`;

// ═══════════════════════════════════════════════════════════════
// HANDLER PRINCIPAL
// ═══════════════════════════════════════════════════════════════

export async function POST(request) {
  try {
    const body = await request.json();

    const {
      mensaje,
      nombre,
      plataforma,
      subscriber_id,
      historial,
    } = body;

    if (!mensaje) {
      return Response.json({ error: 'Falta el mensaje' }, { status: 400 });
    }

    // Detectar intención del mensaje
    const intencion = detectarIntencion(mensaje);

    // Construir contexto para Claude
    let contextoProductos = '';
    let productosParaMostrar = [];

    // Si quiere ver productos o recomendación, obtenerlos
    if (intencion.quiereVerProductos || intencion.quiereRecomendacion) {
      if (intencion.necesidad) {
        // Buscar por necesidad específica
        productosParaMostrar = await obtenerRecomendaciones(intencion.necesidad);
      } else {
        // Mostrar productos disponibles
        productosParaMostrar = await obtenerProductos({ limite: 6 });
      }

      if (productosParaMostrar.length > 0) {
        contextoProductos = `\n\n[PRODUCTOS DISPONIBLES PARA MOSTRAR:]
${productosParaMostrar.map(p => `- ${p.nombre}: $${p.precio} USD (${p.categorias || 'guardián'})`).join('\n')}

IMPORTANTE: Solo mencioná estos productos por nombre. El sistema mostrará sus fotos automáticamente.`;
      } else {
        contextoProductos = `\n\n[SIN PRODUCTOS EN CATÁLOGO]
No hay productos cargados en este momento. Invitá a la persona a ver la tienda en www.duendesdeluruguay.com donde puede ver los guardianes disponibles con sus fotos.
NO INVENTES nombres de guardianes.`;
      }
    }

    // Contexto adicional
    let contextoAdicional = '';

    if (intencion.preguntaPedido) {
      contextoAdicional += '\n[CONTEXTO: Pregunta por un pedido. Pedir datos y calmar.]';
    }
    if (intencion.nervioso) {
      contextoAdicional += '\n[CONTEXTO: Cliente nervioso. Priorizar calmar y escalar a Thibisay.]';
    }
    if (nombre) {
      contextoAdicional += `\n[CONTEXTO: Se llama ${nombre}. Usá su nombre.]`;
    }
    if (plataforma) {
      contextoAdicional += `\n[CONTEXTO: Escribe desde ${plataforma}.]`;
    }

    // Construir mensajes para Claude
    const mensajesParaClaude = [];

    if (historial && Array.isArray(historial)) {
      historial.forEach(msg => {
        mensajesParaClaude.push({
          role: msg.rol === 'usuario' ? 'user' : 'assistant',
          content: msg.contenido
        });
      });
    }

    mensajesParaClaude.push({
      role: 'user',
      content: mensaje
    });

    // Llamar a Claude
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 500,
      system: SYSTEM_PROMPT + contextoAdicional + contextoProductos,
      messages: mensajesParaClaude,
    });

    const respuestaTito = response.content[0].text;
    const respuestaLimpia = respuestaTito.replace('[ESCALAR]', '').trim();

    // Detectar si hay que escalar
    const debeEscalar = respuestaTito.includes('[ESCALAR]') ||
                        intencion.preguntaPedido ||
                        intencion.nervioso;

    // Construir respuesta para ManyChat
    let respuestaManychat;

    if (productosParaMostrar.length > 0 && (intencion.quiereVerProductos || intencion.quiereRecomendacion)) {
      // Enviar galería de productos
      if (productosParaMostrar.length === 1) {
        respuestaManychat = crearRespuestaConProducto(respuestaLimpia, productosParaMostrar[0]);
      } else {
        respuestaManychat = crearRespuestaConGaleria(respuestaLimpia, productosParaMostrar);
      }
    } else {
      // Solo texto
      respuestaManychat = crearRespuestaTexto(respuestaLimpia);
    }

    // Agregar metadata
    respuestaManychat.metadata = {
      success: true,
      escalar: debeEscalar,
      productos_mostrados: productosParaMostrar.length,
      intencion: {
        verProductos: intencion.quiereVerProductos,
        recomendacion: intencion.quiereRecomendacion,
        necesidad: intencion.necesidad,
        pedido: intencion.preguntaPedido,
        nervioso: intencion.nervioso
      }
    };

    // También incluir respuesta simple para compatibilidad
    respuestaManychat.respuesta = respuestaLimpia;

    console.log('[TITO MANYCHAT]', {
      plataforma,
      nombre,
      intencion: intencion.necesidad || (intencion.quiereVerProductos ? 'ver' : 'chat'),
      productos: productosParaMostrar.length,
      escalar: debeEscalar
    });

    return Response.json(respuestaManychat);

  } catch (error) {
    console.error('[TITO MANYCHAT ERROR]', error);

    return Response.json({
      version: 'v2',
      content: {
        messages: [
          { type: 'text', text: "Hola! Disculpá, estoy teniendo un problemita técnico. ¿Podés escribirme de nuevo en un ratito?" }
        ]
      },
      respuesta: "Hola! Disculpá, estoy teniendo un problemita técnico. ¿Podés escribirme de nuevo en un ratito?",
      metadata: { success: false, error: error.message }
    });
  }
}

// GET para verificar
export async function GET() {
  // Test: obtener algunos productos
  let productosTest = [];
  try {
    productosTest = await obtenerProductos({ limite: 3 });
  } catch (e) {
    console.error('Error test productos:', e);
  }

  return Response.json({
    status: 'ok',
    endpoint: 'Tito ManyChat v2 - Con imágenes',
    formato: 'ManyChat Dynamic Block',
    productos_disponibles: productosTest.length,
    ejemplo_productos: productosTest.slice(0, 2).map(p => ({
      nombre: p.nombre,
      precio: p.precio,
      imagen: p.imagen ? 'Sí' : 'No'
    })),
    ejemplo_request: {
      method: 'POST',
      body: {
        mensaje: "Mostrame guardianes de protección",
        nombre: "María",
        plataforma: "instagram"
      }
    },
    formato_respuesta: {
      descripcion: "Usa ManyChat Dynamic Block v2 para texto + galería de productos",
      campos: ['version', 'content.messages', 'respuesta', 'metadata']
    }
  });
}
