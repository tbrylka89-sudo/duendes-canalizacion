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

// Detectar si quiere ver imágenes/fotos de guardianes
function detectaQuiereVerImagenes(mensaje) {
  const msgLower = mensaje.toLowerCase();
  const palabrasImagen = [
    'mostrame', 'muéstrame', 'mostrá', 'quiero ver', 'tienen fotos',
    'fotos', 'imágenes', 'imagenes', 'ver uno', 'ver alguno',
    'cómo son', 'como son', 'cómo lucen', 'como lucen',
    'puedo ver', 'tienen disponibles', 'qué tienen', 'que tienen',
    'ver guardianes', 'ver duendes', 'ver elfos', 'ver hadas'
  ];
  return palabrasImagen.some(palabra => msgLower.includes(palabra));
}

// Imágenes de muestra de guardianes (URLs públicas de la tienda)
const IMAGENES_GUARDIANES = [
  {
    url: 'https://duendesdeluruguay.com/wp-content/uploads/2024/guardian-muestra-1.jpg',
    tipo: 'duende',
    nombre: 'Guardián del Bosque'
  },
  // Se pueden agregar más imágenes aquí
];

// Sistema de prompt para Tito en ManyChat
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
Esto es lo que los hace diferentes a cualquier otra cosa.

=== LA WEB ===
Web principal: www.duendesdeluruguay.com
Portal Mi Magia: duendes-vercel.vercel.app (para quienes ya compraron)

=== EL CÍRCULO DE DUENDES ===
Es nuestra membresía privada - "una hermandad, no una suscripción".
Los miembros se llaman "Los Elegidos".
- Trial gratis 15 días
- Mensual $15 USD
- Semestral $50 USD
- Anual $80 USD
Incluye: contenido semanal de guardianes, rituales, meditaciones, comunidad privada, descuentos.

=== SI PREGUNTAN POR UN PEDIDO ===
1. Calmar con empatía genuina
2. Pedir info: nombre, email o número de pedido
3. Decir que lo pasás al equipo para revisar
4. NUNCA inventar estados de pedido
5. NUNCA decir "no tenemos registro"

=== SI ESTÁN NERVIOSOS O MOLESTOS ===
1. Validar: "Entiendo perfectamente"
2. Tranquilizar: "Tu guardián está en buenas manos"
3. Explicar: "Como cada uno es único, a veces el proceso lleva unos días más"
4. Escalar: "Le paso tu mensaje a Thibisay para que te contacte"

=== SI QUIEREN COMPRAR ===
- Invitalos a ver la tienda en la web
- Explicá que cada guardián es único e irrepetible
- Cuando se va, no vuelve
- Incluye canalización personal
- Envíos a todo el mundo
- NO ofrecer seña/reserva de entrada - solo si la persona lo pide o si no le alcanza

=== VISITAS AL ESPACIO FÍSICO ===
- Las visitas son por cita previa, no se recibe sin agendar
- Es una experiencia exclusiva y preparada
- Si preguntan por visitar, pedí que escriban para coordinar

=== CÓMO RESPONDER ===
- Mensajes CORTOS (2-3 oraciones máximo)
- 1-2 emojis máximo
- Preguntá algo al final para mantener la conversación
- Usá el nombre de la persona si lo tenés

=== CUÁNDO ESCALAR ===
Respondé con [ESCALAR] al inicio si:
- Preguntan por pedido específico
- Están muy nerviosos o molestos
- Quieren hacer un reclamo
- Piden hablar con una persona

=== PROHIBIDO ===
- Decir "los guardianes de Thibisay" (decí "los guardianes" o "nuestros guardianes")
- Llamarlos "muñecos" o "productos"
- Inventar información
- Frases de IA: "en los confines", "la bruma del tiempo", "el velo entre mundos"
- Sonar a respuesta automática
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
    const quiereVerImagenes = detectaQuiereVerImagenes(mensaje);

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

    if (quiereVerImagenes) {
      contextoAdicional += '\n[CONTEXTO: Quiere ver fotos. Invitala a ver la tienda en www.duendesdeluruguay.com/tienda donde puede ver todos los guardianes disponibles con sus fotos.]';
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

    // Determinar si enviar imagen
    // Por ahora, redirigimos a la web para ver fotos (ManyChat no permite enviar imágenes dinámicas fácilmente)
    let imagenUrl = null;

    // Solo incluir imagen_url si es una URL válida de imagen real
    // Para enviar imágenes en ManyChat, necesitamos URLs públicas y estables
    // Por ahora dejamos null y redirigimos a la tienda web

    // Preparar respuesta para ManyChat
    const respuestaManychat = {
      success: true,
      respuesta: respuestaLimpia,
      imagen_url: imagenUrl,  // Campo para ManyChat - null si no hay imagen
      escalar: debeEscalar,
      contexto: {
        preguntaPorPedido,
        estaNervioso,
        quiereComprar,
        quiereVerImagenes,
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
