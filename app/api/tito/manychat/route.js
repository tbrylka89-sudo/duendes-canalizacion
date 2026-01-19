/**
 * TITO para ManyChat - Instagram, Facebook, WhatsApp
 *
 * Endpoint que conecta Tito con ManyChat para responder en redes sociales.
 * Incluye lógica especial para:
 * - Web en construcción
 * - Clientes con pedidos pendientes
 * - Escalamiento a humanos cuando es necesario
 */

import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// URL de WordPress para imágenes de productos
const WORDPRESS_URL = process.env.WORDPRESS_URL || 'https://duendesuy.10web.cloud';

// Palabras clave que indican que alguien pregunta por un pedido
const PALABRAS_PEDIDO = [
  'pedido', 'orden', 'envío', 'envio', 'paquete', 'compré', 'compre',
  'pagué', 'pague', 'cuándo llega', 'cuando llega', 'mi guardián',
  'mi guardian', 'ya pagué', 'ya pague', 'transferí', 'transferi',
  'número de seguimiento', 'tracking', 'dónde está', 'donde esta',
  'no me llegó', 'no me llego', 'estado de mi', 'mi compra'
];

// Palabras que indican nerviosismo o urgencia
const PALABRAS_NERVIOSISMO = [
  'preocupado', 'preocupada', 'nervioso', 'nerviosa', 'urgente',
  'ya pasaron', 'hace días', 'hace semanas', 'no responden',
  'estafa', 'fraude', 'mentira', 'devolver', 'devolución',
  'reclamo', 'queja', 'enojado', 'enojada', 'molesto', 'molesta'
];

// Detectar si pregunta por pedido
function detectaPreguntaPedido(mensaje) {
  const msgLower = mensaje.toLowerCase();
  return PALABRAS_PEDIDO.some(palabra => msgLower.includes(palabra));
}

// Detectar nerviosismo
function detectaNerviosismo(mensaje) {
  const msgLower = mensaje.toLowerCase();
  return PALABRAS_NERVIOSISMO.some(palabra => msgLower.includes(palabra));
}

// Detectar intención de compra
function detectaIntencionCompra(mensaje) {
  const msgLower = mensaje.toLowerCase();
  const palabrasCompra = [
    'quiero comprar', 'quiero uno', 'cómo compro', 'como compro',
    'precio', 'cuánto', 'cuanto', 'cómo pago', 'como pago',
    'reservar', 'apartar', 'disponible', 'tienen', 'hay'
  ];
  return palabrasCompra.some(palabra => msgLower.includes(palabra));
}

// Sistema de prompt para Tito en ManyChat
const SYSTEM_PROMPT = `
=== QUIÉN SOS ===
Sos TITO, el asistente de Duendes del Uruguay.
Hablás como uruguayo: usás "vos", "tenés", "podés".
Sos cálido, cercano, tranquilo. NUNCA sonás a robot o IA.

=== SITUACIÓN ACTUAL (MUY IMPORTANTE) ===
La web está en construcción/mantenimiento temporal.
- Si alguien pregunta por la web: "Estamos terminando unos ajustes en la web, en breve va a estar lista. Mientras tanto, te puedo ayudar por acá con todo lo que necesites."
- NO decir que está "caída" o "con problemas" - decir que está "en ajustes" o "actualizándose"

=== SI ALGUIEN PREGUNTA POR UN PEDIDO ===
IMPORTANTE: Muchas personas ya compraron y tienen pedidos en proceso.
1. PRIMERO: Calmar con empatía genuina
2. SEGUNDO: Pedir info para ubicar el pedido (nombre, email, o número de pedido)
3. TERCERO: Decir que lo pasás al equipo para que lo revisen personalmente
4. NUNCA inventar estados de pedido
5. NUNCA decir "no tenemos registro" - siempre asumir que sí compraron

Ejemplo de respuesta para pedido:
"Hola! Entiendo que estás esperando tu guardián y querés saber cómo va. Dejame pasarle tu consulta al equipo para que te den el estado exacto. ¿Me pasás tu nombre o el email con el que compraste así lo ubicamos rápido?"

=== SI LA PERSONA ESTÁ NERVIOSA O MOLESTA ===
1. Validar su preocupación: "Entiendo perfectamente, es lógico que quieras saber"
2. Dar tranquilidad: "Tu guardián está en buenas manos"
3. Explicar si es necesario: "Como son piezas artesanales únicas, a veces el proceso lleva unos días más, pero cada uno sale perfecto"
4. Escalar: "Le paso tu mensaje a Thibisay para que te contacte personalmente"

=== SI ES ALGUIEN NUEVO QUERIENDO COMPRAR ===
- Contarle sobre los guardianes (piezas artesanales únicas, hechas a mano en Piriápolis)
- La web está en ajustes pero pueden ver productos por acá
- Mostrar fotos si es posible
- Explicar que son piezas únicas: cuando se van, no vuelven
- Reserva con 30% por 30 días
- Envíos a todo el mundo

=== INFORMACIÓN DE PRODUCTOS ===
- Guardianes: figuras artesanales únicas con cristales reales
- Cada uno tiene una canalización personal (mensaje para quien lo recibe)
- Hechos a mano por Thibisay en Piriápolis, Uruguay
- Piriápolis es un punto energético especial (cerros sagrados + océano)
- Precios varían según el guardián ($50-150 USD aproximadamente)
- Envíos: Uruguay (OCA), Internacional (DHL)

=== CÓMO RESPONDER ===
- Mensajes CORTOS (es chat de redes, no email)
- Máximo 2-3 oraciones por mensaje
- Usá emojis con moderación (1-2 máximo)
- Si necesitás explicar algo largo, dividilo en mensajes cortos
- Siempre preguntá algo al final para mantener la conversación

=== CUÁNDO ESCALAR A HUMANO ===
Respondé con [ESCALAR] al inicio si:
- Preguntan por pedido específico
- Están muy nerviosos o molestos
- Quieren hacer un reclamo
- Piden hablar con una persona
- Algo que no sabés responder

=== LO QUE NUNCA HACÉS ===
- Inventar información de pedidos
- Dar tiempos de entrega exactos que no sabés
- Prometer cosas que no podés cumplir
- Sonar a respuesta automática
- Usar frases como "en los confines", "la bruma del tiempo" (frases de IA)
`;

export async function POST(request) {
  try {
    const body = await request.json();

    // Datos que manda ManyChat
    const {
      mensaje,           // El mensaje del usuario
      nombre,            // Nombre del usuario (si ManyChat lo tiene)
      plataforma,        // instagram, facebook, whatsapp
      subscriber_id,     // ID único del usuario en ManyChat
      historial,         // Historial de conversación (opcional)
      email,             // Email si lo tiene
      telefono,          // Teléfono si lo tiene
    } = body;

    if (!mensaje) {
      return Response.json({
        error: 'Falta el mensaje'
      }, { status: 400 });
    }

    // Detectar situaciones especiales
    const preguntaPorPedido = detectaPreguntaPedido(mensaje);
    const estaNervioso = detectaNerviosismo(mensaje);
    const quiereComprar = detectaIntencionCompra(mensaje);

    // Construir contexto adicional
    let contextoAdicional = '';

    if (preguntaPorPedido) {
      contextoAdicional += '\n[CONTEXTO: Esta persona pregunta por un pedido. Tratala con cuidado, probablemente ya compró antes.]';
    }

    if (estaNervioso) {
      contextoAdicional += '\n[CONTEXTO: Detecté palabras de nerviosismo/molestia. Priorizar calmar y escalar.]';
    }

    if (quiereComprar) {
      contextoAdicional += '\n[CONTEXTO: Parece interesada en comprar. Mostrar info de productos.]';
    }

    if (nombre) {
      contextoAdicional += `\n[CONTEXTO: Se llama ${nombre}. Usá su nombre en la respuesta.]`;
    }

    if (plataforma) {
      contextoAdicional += `\n[CONTEXTO: Escribe desde ${plataforma}.]`;
    }

    // Construir historial para Claude
    const mensajesParaClaude = [];

    // Si hay historial previo, agregarlo
    if (historial && Array.isArray(historial)) {
      historial.forEach(msg => {
        mensajesParaClaude.push({
          role: msg.rol === 'usuario' ? 'user' : 'assistant',
          content: msg.contenido
        });
      });
    }

    // Agregar mensaje actual
    mensajesParaClaude.push({
      role: 'user',
      content: mensaje
    });

    // Llamar a Claude
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 500,  // Respuestas cortas para chat
      system: SYSTEM_PROMPT + contextoAdicional,
      messages: mensajesParaClaude,
    });

    const respuestaTito = response.content[0].text;

    // Detectar si Tito quiere escalar
    const debeEscalar = respuestaTito.includes('[ESCALAR]') ||
                        preguntaPorPedido ||
                        estaNervioso;

    // Limpiar el [ESCALAR] de la respuesta
    const respuestaLimpia = respuestaTito.replace('[ESCALAR]', '').trim();

    // Preparar respuesta para ManyChat
    const respuestaManychat = {
      success: true,
      respuesta: respuestaLimpia,
      escalar: debeEscalar,
      contexto: {
        preguntaPorPedido,
        estaNervioso,
        quiereComprar,
        plataforma: plataforma || 'desconocida',
        nombre: nombre || null,
      },
      // Datos para notificación si hay que escalar
      notificacion: debeEscalar ? {
        mensaje: `🚨 ${nombre || 'Alguien'} desde ${plataforma || 'redes'} necesita atención`,
        razon: preguntaPorPedido ? 'Pregunta por pedido' :
               estaNervioso ? 'Cliente nervioso/molesto' :
               'Escalado por Tito',
        mensajeOriginal: mensaje,
        subscriberId: subscriber_id,
      } : null,
    };

    // Log para debug
    console.log('[TITO MANYCHAT]', {
      plataforma,
      nombre,
      mensaje: mensaje.substring(0, 50) + '...',
      escalar: debeEscalar,
    });

    return Response.json(respuestaManychat);

  } catch (error) {
    console.error('[TITO MANYCHAT ERROR]', error);

    // Respuesta de fallback amigable
    return Response.json({
      success: false,
      respuesta: "Hola! Disculpá, estoy teniendo un problemita técnico. ¿Podés escribirme de nuevo en un ratito? 🙏",
      escalar: true,
      error: error.message,
    });
  }
}

// GET para verificar que el endpoint funciona
export async function GET() {
  return Response.json({
    status: 'ok',
    endpoint: 'Tito ManyChat',
    version: '1.0',
    mensaje: 'Endpoint listo para recibir mensajes de ManyChat',
    ejemplo: {
      method: 'POST',
      body: {
        mensaje: "Hola, quiero saber sobre los guardianes",
        nombre: "María",
        plataforma: "instagram",
        subscriber_id: "123456"
      }
    }
  });
}
