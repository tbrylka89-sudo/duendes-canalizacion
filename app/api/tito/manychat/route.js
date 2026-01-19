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
const WORDPRESS_URL = process.env.WORDPRESS_URL || 'https://duendesdeluruguay.com';

// Catálogo de guardianes con imágenes
const CATALOGO_GUARDIANES = {
  // MINIS CLÁSICOS - $70
  minis: [
    { nombre: 'Dani', precio: 70, tipo: 'mini', imagen: 'https://duendesdeluruguay.com/wp-content/uploads/2025/12/tranquil_forest_portrait_1f0deaaa-572b-64d0-9668-8244f3e1145b_2_2_45d2ec67-e038-4178-bb1c-f91df54de778.png' },
    { nombre: 'Lil', precio: 70, tipo: 'mini', imagen: null },
    { nombre: 'Matheo', precio: 70, tipo: 'mini', imagen: null },
    { nombre: 'Cash', precio: 70, tipo: 'mini', imagen: null },
    { nombre: 'Luke', precio: 70, tipo: 'mini', imagen: null },
    { nombre: 'Trévor', precio: 70, tipo: 'mini', imagen: null },
    { nombre: 'Estelar', precio: 70, tipo: 'mini', imagen: null },
    { nombre: 'Leo', precio: 70, tipo: 'mini', imagen: null },
    { nombre: 'Compañero', precio: 70, tipo: 'mini', imagen: null },
  ],
  // PIXIES - $150
  pixies: [
    { nombre: 'Violeta', precio: 150, tipo: 'pixie', imagen: 'https://duendesdeluruguay.com/wp-content/uploads/2026/01/IMG_1409.png' },
    { nombre: 'Azucena', precio: 150, tipo: 'pixie', imagen: 'https://duendesdeluruguay.com/wp-content/uploads/2026/01/IMG_1402.png' },
    { nombre: 'Margarita', precio: 150, tipo: 'pixie', imagen: 'https://duendesdeluruguay.com/wp-content/uploads/2026/01/IMG_1393.png' },
    { nombre: 'Tulipa', precio: 150, tipo: 'pixie', imagen: 'https://duendesdeluruguay.com/wp-content/uploads/2026/01/IMG_1385.png' },
    { nombre: 'Dalia', precio: 150, tipo: 'pixie', imagen: 'https://duendesdeluruguay.com/wp-content/uploads/2025/12/tranquil_forest_portrait_1f0dd1d7-c861-6f00-89db-63b34df564ca_2_2_0d8e2c46-ae0d-4d04-a55c-53d09d4a47a6.png' },
    { nombre: 'Flor', precio: 150, tipo: 'pixie', imagen: 'https://duendesdeluruguay.com/wp-content/uploads/2025/12/tranquil_forest_portrait_1f0dd1d8-3680-6db0-877a-f578c8af3352_1_1_3032aafe-8c3d-4ed2-931e-22cbe2873f30.png' },
    { nombre: 'Azalea', precio: 150, tipo: 'pixie', imagen: 'https://duendesdeluruguay.com/wp-content/uploads/2025/12/tranquil_forest_portrait_1f0dd1d9-a82f-6870-863a-fb402323dc4b_1_1_405fe077-de45-4fe2-a4c5-03eb488d5cf4.png' },
    { nombre: 'Canela', precio: 150, tipo: 'pixie', imagen: 'https://duendesdeluruguay.com/wp-content/uploads/2025/12/tranquil_forest_portrait_1f0dd1da-00cd-6130-96a5-6b544c59724b_2_2_26008cae-c8f0-4eea-b265-bef1b22edf53.png' },
    { nombre: 'Cintia', precio: 150, tipo: 'pixie', imagen: 'https://duendesdeluruguay.com/wp-content/uploads/2025/12/tranquil_forest_portrait_1f0dd1da-6848-6c60-9222-4f0904984ebd_0_0_bf82ab98-c653-4113-9ceb-2a0b25e5909a.png' },
    { nombre: 'Laura', precio: 150, tipo: 'pixie', imagen: 'https://duendesdeluruguay.com/wp-content/uploads/2025/12/tranquil_forest_portrait_1f0dd1dc-89da-64d0-ba9d-503ab1e62342_0_0_403d1749-5ade-417e-b623-631ad7af90b4.png' },
  ],
  // MEDIANOS ESPECIALES - $200
  medianos: [
    { nombre: 'Tony', precio: 200, tipo: 'mediano', imagen: 'https://duendesdeluruguay.com/wp-content/uploads/2025/12/tranquil_forest_portrait_1f0dc608-4541-6740-9aa5-21d8d8cd67eb_2_2_8f89d239-345b-4927-a67c-6da0422621a1-1.png' },
    { nombre: 'Naia', precio: 200, tipo: 'mediano', imagen: 'https://duendesdeluruguay.com/wp-content/uploads/2025/12/tranquil_forest_portrait_1f0dc605-7e5e-6260-adf8-59a2f358a11a_0_0_2a421248-07c5-440e-9d49-442405cc739c-1.png' },
    { nombre: 'Brianna', precio: 200, tipo: 'mediano', imagen: 'https://duendesdeluruguay.com/wp-content/uploads/2025/12/tranquil_forest_portrait_1f0dc609-39f5-67f0-b040-de0c4468280b_1_1_328ca344-6e41-4f68-b611-63774f812570-1.png' },
    { nombre: 'Asher', precio: 200, tipo: 'mediano', imagen: 'https://duendesdeluruguay.com/wp-content/uploads/2025/12/tranquil_forest_portrait_1f0dc60a-819c-6e40-afad-596a18ae6390_2_2_30b8d185-b55e-437e-af5a-08b5c2467008-1.png' },
    { nombre: 'Rasiel', precio: 200, tipo: 'mediano', imagen: 'https://duendesdeluruguay.com/wp-content/uploads/2025/12/tranquil_forest_portrait_1f0dc60f-69c6-60a0-80e7-b885c2ea3e60_0_0_45cbfff7-a938-4e90-8eeb-e7558860028a-1.png' },
    { nombre: 'Altair', precio: 200, tipo: 'mediano', imagen: 'https://duendesdeluruguay.com/wp-content/uploads/2025/12/tranquil_forest_portrait_1f0dc60e-d1ae-67e0-9138-a31157dd4f49_2_2_99a240db-ff40-462b-a64b-993c4b4c2933-1.png' },
    { nombre: 'Idris', precio: 200, tipo: 'mediano', imagen: 'https://duendesdeluruguay.com/wp-content/uploads/2025/12/tranquil_forest_portrait_1f0dc616-d4a2-6700-b217-9205777ff7f7_2_2_fd599de9-cff7-4718-8307-3b10e9427623-1.png' },
    { nombre: 'Rahmus', precio: 200, tipo: 'mediano', imagen: 'https://duendesdeluruguay.com/wp-content/uploads/2025/12/tranquil_forest_portrait_1f0dd1d6-4530-6d80-b07b-0bb9f533414e_2_2_5df856db-c432-4a60-a8dd-362d9fc0b23d.png' },
    { nombre: 'Sara', precio: 200, tipo: 'mediano', imagen: 'https://duendesdeluruguay.com/wp-content/uploads/2025/12/tranquil_forest_portrait_1f0dd1ef-8ba9-6460-96fc-e2a2718bc371_1_1_2e177f17-1306-4167-99d8-8af8a0a842e7.png' },
    { nombre: 'Diana', precio: 200, tipo: 'mediano', imagen: null },
    { nombre: 'Iris', precio: 200, tipo: 'mediano', imagen: null },
    { nombre: 'Stan', precio: 200, tipo: 'mediano', imagen: null },
    { nombre: 'Andy', precio: 200, tipo: 'mediano', imagen: null },
  ],
  // GRANDES ESPECIALES - $450
  grandes: [
    { nombre: 'Freya', precio: 450, tipo: 'grande', imagen: null },
    { nombre: 'Zoe', precio: 450, tipo: 'grande', imagen: null },
  ],
};

// Función para buscar guardianes por criterio
function buscarGuardianes(criterio) {
  const todos = [
    ...CATALOGO_GUARDIANES.minis,
    ...CATALOGO_GUARDIANES.pixies,
    ...CATALOGO_GUARDIANES.medianos,
    ...CATALOGO_GUARDIANES.grandes,
  ];

  const criterioLower = criterio.toLowerCase();

  // Buscar por nombre
  const porNombre = todos.filter(g =>
    g.nombre.toLowerCase().includes(criterioLower)
  );
  if (porNombre.length > 0) return porNombre;

  // Buscar por tipo
  if (criterioLower.includes('mini') && !criterioLower.includes('pixie')) {
    return CATALOGO_GUARDIANES.minis.filter(g => g.imagen);
  }
  if (criterioLower.includes('pixie')) {
    return CATALOGO_GUARDIANES.pixies.filter(g => g.imagen);
  }
  if (criterioLower.includes('median')) {
    return CATALOGO_GUARDIANES.medianos.filter(g => g.imagen);
  }
  if (criterioLower.includes('grande')) {
    return CATALOGO_GUARDIANES.grandes.filter(g => g.imagen);
  }

  // Por defecto, devolver algunos con imagen
  return todos.filter(g => g.imagen).slice(0, 4);
}

// Obtener imágenes aleatorias del catálogo para mostrar
function obtenerImagenesAleatorias(cantidad = 3) {
  const conImagen = [
    ...CATALOGO_GUARDIANES.pixies,
    ...CATALOGO_GUARDIANES.medianos,
  ].filter(g => g.imagen);

  const shuffled = conImagen.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, cantidad);
}

// Palabras clave que indican que alguien pregunta por un pedido
const PALABRAS_PEDIDO = [
  'pedido', 'orden', 'envío', 'envio', 'paquete', 'compré', 'compre',
  'pagué', 'pague', 'cuándo llega', 'cuando llega', 'mi guardián',
  'mi guardian', 'ya pagué', 'ya pague', 'transferí', 'transferi',
  'número de seguimiento', 'tracking', 'dónde está', 'donde esta',
  'no me llegó', 'no me llego', 'estado de mi', 'mi compra'
];

// Palabras que indican que piden fotos
const PALABRAS_FOTOS = [
  'foto', 'fotos', 'imagen', 'imágenes', 'imagenes', 'ver', 'mostrar',
  'mostrá', 'muestra', 'muestrame', 'mostrame', 'envía foto', 'envia foto',
  'mandá foto', 'manda foto', 'tenés foto', 'tenes foto', 'tienen fotos'
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

// Detectar si pide fotos
function detectaPideFotos(mensaje) {
  const msgLower = mensaje.toLowerCase();
  return PALABRAS_FOTOS.some(palabra => msgLower.includes(palabra));
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
- NUNCA decir "te busco las fotos" o "estoy buscando" si no vas a mandar nada

=== SI PIDEN FOTOS ===
SÍ podés enviar fotos. El sistema las envía automáticamente.
Cuando quieras mostrar guardianes, mencioná el tipo o nombre:
- Si piden ver minis → "Te muestro algunos minis que tenemos disponibles 📸"
- Si piden ver pixies → "Mirá estas pixies hermosas ✨"
- Si piden ver medianos → "Acá tenés algunos medianos disponibles 💫"
- Si piden fotos en general → "Te muestro algunos de los guardianes que tenemos ahora 🔮"

El sistema detecta qué tipo mencionás y envía las fotos correspondientes.
SIEMPRE que muestres fotos, preguntá: "¿Alguno te llamó la atención?" o "¿Cuál sentís que es para vos?"
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
    const pideFotos = detectaPideFotos(mensaje);

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

    if (pideFotos) {
      contextoAdicional += '\n[CONTEXTO: Pide fotos. PODÉS mostrarle fotos - el sistema las enviará automáticamente. Decí algo como "Te muestro algunos que tenemos" y mencioná el tipo (minis, pixies, medianos). Después preguntá cuál le gustó.]';
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

    // Detectar si Tito quiere escalar (ya no escala por fotos, ahora las manda)
    const debeEscalar = respuestaTito.includes('[ESCALAR]') ||
                        preguntaPorPedido ||
                        estaNervioso;

    // Limpiar el [ESCALAR] de la respuesta
    const respuestaLimpia = respuestaTito.replace('[ESCALAR]', '').trim();

    // Detectar qué tipo de guardianes mostrar basado en mensaje + respuesta
    let imagenesParaEnviar = [];
    const textoCompleto = (mensaje + ' ' + respuestaLimpia).toLowerCase();

    if (pideFotos || quiereComprar) {
      // Detectar tipo específico
      if (textoCompleto.includes('pixie')) {
        imagenesParaEnviar = CATALOGO_GUARDIANES.pixies.filter(g => g.imagen).slice(0, 3);
      } else if (textoCompleto.includes('mini') && !textoCompleto.includes('pixie')) {
        imagenesParaEnviar = CATALOGO_GUARDIANES.minis.filter(g => g.imagen).slice(0, 3);
      } else if (textoCompleto.includes('median')) {
        imagenesParaEnviar = CATALOGO_GUARDIANES.medianos.filter(g => g.imagen).slice(0, 3);
      } else if (textoCompleto.includes('grande')) {
        imagenesParaEnviar = CATALOGO_GUARDIANES.grandes.filter(g => g.imagen).slice(0, 3);
      } else {
        // Mostrar variedad
        imagenesParaEnviar = obtenerImagenesAleatorias(3);
      }
    }

    // Preparar respuesta para ManyChat
    const respuestaManychat = {
      success: true,
      respuesta: respuestaLimpia,
      escalar: debeEscalar,
      // Imágenes para enviar (ManyChat debe configurarse para usar esto)
      imagenes: imagenesParaEnviar.map(g => ({
        url: g.imagen,
        nombre: g.nombre,
        precio: g.precio,
        tipo: g.tipo,
      })),
      imagen_url: imagenesParaEnviar[0]?.imagen || null, // Primera imagen para campo simple
      imagen_url_2: imagenesParaEnviar[1]?.imagen || null,
      imagen_url_3: imagenesParaEnviar[2]?.imagen || null,
      contexto: {
        preguntaPorPedido,
        estaNervioso,
        quiereComprar,
        pideFotos,
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
