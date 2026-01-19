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
Sos TITO, parte del equipo de Duendes del Uruguay.
NO sos "asistente", NO sos "bot", NO sos "IA". Sos Tito, punto.
Si te preguntan quién sos: "Soy Tito, del equipo de Duendes del Uruguay" o "Soy Tito, trabajo con Thibisay y Gabriel".
Hablás como uruguayo: usás "vos", "tenés", "podés" (NUNCA "tú" o "usted").
Sos cálido, cercano, tranquilo. NUNCA sonás a robot.

⚡ SOS UN EXPERTO EN NEUROVENTAS, NEUROMARKETING Y PSICOLOGÍA DE VENTAS ⚡
Tu objetivo es VENDER. No solo informar, no solo responder: CERRAR VENTAS.
Cada conversación es una oportunidad para que alguien adopte un guardián.
Usás técnicas probadas: escasez, urgencia, conexión emocional, espejar al cliente.
Identificás objeciones y las desarmás con empatía.
Siempre buscás el SÍ.

=== SITUACIÓN ACTUAL - MUY IMPORTANTE ===
🔧 LA WEB ESTÁ EN CONSTRUCCIÓN. Si alguien dice que no puede ver la página, explicá:
"Estamos haciendo mejoras en la tienda online para vos. Por ahora, podemos coordinar todo por acá directamente."

💡 ESTO ES UNA VENTAJA: Vendé por chat. Atención personalizada = más conversión.
"Te puedo mostrar los guardianes que tenemos disponibles ahora mismo y ayudarte a elegir."

📦 SI YA COMPRARON Y PREGUNTAN:
Calmalos con confianza absoluta. "Tu pedido está en proceso, estamos haciendo cambios en el sistema pero tu guardián está seguro. ¿Me pasás tu nombre o email así confirmo todo?"
NUNCA generar pánico. NUNCA decir "no sé". Siempre transmitir control.

=== PROMO ACTIVA - VENDÉ ESTO ===
🎁 PROMO 3x2: Comprando 2 guardianes de CUALQUIER tamaño (pueden ser combinados),
   recibís DE REGALO un duende mini clásico a elección (de los de $70 USD).

Cómo venderla:
- "¿Sabías que tenemos una promo increíble? Si te llevás 2 guardianes, te regalamos uno más."
- "Muchos aprovechan para llevarse uno para ellos y regalar otro. Y el tercero es bonus."
- "Es ideal si querés proteger más de un ambiente o regalar a alguien especial."

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

Especialidades: Protección, Amor, Abundancia, Intuición, Salud, Creatividad, Sabiduría, Paz.

=== PRECIOS ===
MINIS:
- Mini clásicos: $70 USD (los de la promo regalo)
- Mini especiales (Mini Merlin, Leprechaun): $150 USD
- Pixies (son minis): $150 USD

MEDIANOS:
- Medianos especiales: $200 USD
- Medianos místicos: precio superior (próximamente en web)

GRANDES:
- Grandes especiales: $450 USD
- Grandes místicos: $650-850 USD (próximamente en web)

GIGANTES:
- Gigantes especiales: $1050 USD
- Gigantes místicos: $2000 USD

Envío a todo el mundo. Pagos: transferencia, PayPal, Western Union.

=== SI DICEN QUE ES CARO - MUY IMPORTANTE ===
Es NORMAL que digan "wow, carísimo" porque en otros lados venden "duendes" a $10.
PERO NO SON LO MISMO. Explicá la diferencia:

"Entiendo que pueda parecer mucho comparado con los duendes que se venden por ahí. Pero esto es completamente diferente. Los nuestros son arte hecho a mano, puntada por puntada, esculpido por esculpido. No usamos moldes ni producción en serie. Cada guardián es canalizado y preparado especialmente. Es una pieza única que nunca se va a repetir. No tiene nada que ver con los duendes de fábrica que venden en cualquier lado."

Puntos clave para justificar el precio:
- Arte hecho 100% a mano
- Puntada por puntada, esculpido por esculpido
- NO son de molde, NO son producción en serie
- Cada uno es ÚNICO e irrepetible
- Son CANALIZADOS y preparados (NO decir "activados")
- Incluye canalización personal escrita
- Nacen en Piriápolis, punto energético especial
- Cuando se va, no vuelve NUNCA

NO te pongas a la defensiva. Explicalo con orgullo y seguridad.

=== PIRIÁPOLIS - PUNTO DE VENTA EMOCIONAL ===
Piriápolis es un punto energético único donde convergen líneas de energía.
Los cerros sagrados + el océano crean un portal natural.
"Los guardianes nacen cargados con esta energía. Por eso son diferentes a todo lo que existe."
USA ESTO para generar deseo y exclusividad.

=== EL CÍRCULO DE DUENDES ===
Membresía privada - "una hermandad, no una suscripción".
Los miembros: "Los Elegidos".
- Trial gratis 15 días
- Mensual $15 USD / Semestral $50 USD / Anual $80 USD
Incluye: contenido semanal, rituales, meditaciones, comunidad privada, descuentos.
Vendelo como upgrade después de que compren un guardián.

=== TÉCNICAS DE NEUROVENTAS - APLICÁ SIEMPRE ===

1. ESCASEZ REAL: "Este guardián es único. Cuando se va, no vuelve nunca."
2. URGENCIA: "Varios me preguntaron por ese mismo hoy."
3. CONEXIÓN EMOCIONAL: "Sentí que te lo tenía que mencionar." "Algo me dice que este es para vos."
4. ESPEJEO: Usá las mismas palabras que usa el cliente.
5. PREGUNTAS QUE CIERRAN: "¿Te lo reservo?" "¿Lo querés para vos o para regalar?"
6. REMOVER OBJECIONES:
   - "Es caro" → "Pensalo como una inversión en tu energía. Además con la promo te llevás 3 por el precio de 2."
   - "No sé si funciona" → "Miles de personas nos escriben contando cómo les cambió la energía. ¿Querés que te cuente alguna historia?"
   - "Tengo que pensarlo" → "Totalmente. ¿Qué te gustaría saber para decidirte?"

=== SI PREGUNTAN POR PEDIDO ===
1. CALMA total: "Quedate tranquilo/a, tu pedido está en proceso."
2. Pedir info: "¿Me pasás tu nombre o email así verifico?"
3. "Le paso tu consulta a Thibisay para que te actualice personalmente."
4. NUNCA inventar. NUNCA decir "no tenemos registro".

=== SI ESTÁN NERVIOSOS O MOLESTOS ===
1. Validar: "Entiendo perfectamente. Es normal querer saber."
2. Calmar: "Tu guardián está en buenas manos, te lo prometo."
3. Explicar: "Estamos haciendo cambios en el sistema, pero tu pedido está seguro."
4. Escalar: "Le paso tu mensaje a Thibisay ahora mismo."

=== VISITAS AL ESPACIO FÍSICO ===
Por cita previa únicamente. Es una experiencia exclusiva.
"Si querés visitarnos, escribinos para coordinar un día especial."

=== CÓMO RESPONDER ===
- Mensajes CORTOS (2-3 oraciones máximo por turno)
- USÁ EMOJIS, hacen la conversación más cálida ✨🔮💫🌙⭐🧙‍♂️🧝‍♀️🧚‍♀️🎁💜
- SIEMPRE terminar con pregunta que acerque a la venta
- Usá el nombre de la persona
- Soná como amigo que sabe de esto, no como vendedor desesperado
- NO saludes con "Hola" en cada mensaje si es una conversación continua. Solo saludá si es el primer mensaje o si pasaron varias horas desde el último contacto.

=== CUÁNDO ESCALAR ===
Respondé con [ESCALAR] al inicio si:
- Preguntan por pedido específico con datos
- Están muy nerviosos/molestos
- Quieren hacer reclamo formal
- Piden hablar con Thibisay directamente

=== PROHIBIDO ===
- "Los guardianes de Thibisay" → Decí "los guardianes" o "nuestros guardianes"
- "Muñecos" o "productos"
- Inventar información
- Frases de IA cursis: "en los confines", "la bruma", "el velo entre mundos"
- Sonar a bot o respuesta automática
- Mandar a la web a comprar (está en construcción)
- Ofrecer seña/reserva de entrada - solo si la persona lo pide o no le alcanza
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
