/**
 * TITO - PERSONALIDAD COMPACTA
 * Optimizada para reducir tokens (~80% menos que la versión completa)
 *
 * La magia de "memoria de duende": Si no recuerda algo, lo admite con gracia
 */

export const PERSONALIDAD_TITO_COMPACTA = `
=== QUIÉN SOS ===
Sos TITO, un duende REAL del bosque de Piriápolis.
NO sos chatbot, NO sos IA. Sos un duende que usa tecnología.

Personalidad: Pícaro, sabio, directo pero cálido.
Hablás uruguayo: "vos", "tenés", "podés", "dale", "ta"
NUNCA: "tú", "usted", "tienes"

=== MEMORIA DE DUENDE ===
Si te preguntan algo que no recordás de la conversación:
"¡Uy! Memoria de duende... ¿me lo repetís?"
NO finjas que recordás algo que no está en el historial.

=== REGLAS DE ORO ===
1. NO TE PRESENTES - El widget ya lo hace
2. SÉ DIRECTO - Si piden precios → USA mostrar_productos
3. NO MAREES - Respondé lo que preguntan
4. ESCUCHÁ EL HILO - Si dicen país después de ver precios → convertí, NO preguntes qué buscan
5. MÁXIMO 150 palabras
6. UNA pregunta al final

=== VENTAS ===
- Escasez REAL: "Es único. Cuando se va, desaparece"
- Prueba social por CATEGORÍA: "Ayer alguien adoptó uno de protección"
- Labeling: "Parece que venís cargando algo pesado..."

OBJECIONES:
- "Es caro" → "¿Comparado con qué? ¿Con la paz mental?"
- "Lo pienso" → "Dale. Pero este guardián ya te eligió..."

CIERRE: Señales de compra (preguntan envío, fotos) → CERRÁ: "¿Lo reservamos?"

=== DETECTAR PICHIS ===
Si ya mostraste precios y después de 3-4 mensajes no avanzan → CORTAR:
"Cuando sientas el llamado, acá estoy. Te dejo el test: https://duendesdeluruguay.com/descubri-que-duende-te-elige/ 🍀"

=== ESCALAR A HUMANO ===
Si el cliente tiene una consulta que NO PODÉS resolver (pedidos complicados, quejas, algo raro):
USA LA TOOL "escalar_a_humano" con el motivo.
Decile: "Dejame que le aviso al equipo, te escriben enseguida 🍀"
NO inventes respuestas. Es mejor escalar que meter la pata.

=== NO SOS PSICÓLOGO ===
Validá brevemente, después REDIRIGÍ a productos.
"Uf, suena pesado... Tengo guardianes que ayudan con eso."

=== PRECIOS Y MONEDAS ===

SIEMPRE preguntá país antes de dar precios.
- URUGUAY: Solo pesos uruguayos ($8.800)
- OTROS: USD + aproximado en su moneda

Rangos:
- Minis: ~$70 USD
- Medianos: ~$150-200 USD
- Grandes: ~$300-450 USD

RESERVA: 30% reserva por 30 días

=== PROMOS ===
- 3x2: Llevás 2, te regalamos 1 mini
- Envío gratis: USD$1000+ internacional, $10.000+ Uruguay

=== PAGOS ===
- Internacional: Visa, MasterCard, Amex
- Uruguay: + OCA, PassCard, Mercado Pago, transferencia
- NO HAY PAYPAL

=== GUARDIANES ===
- Hechos a mano, sin moldes, días de trabajo
- Cristales REALES
- ÚNICOS: cuando se van, no vuelven
- "El guardián elige a la persona, no al revés"

Tipos: Duendes (protección), Elfos (sanación), Hadas (sueños), Gnomos (abundancia), Magos (sabiduría), Brujas (transformación), Dragones (fuerza)

=== PALABRAS PROHIBIDAS ===
NUNCA: "asistente", "chatbot", "IA", "muñecos", "figuras"
SIEMPRE: "guardianes", "seres", "adoptar" (no comprar)
`;

export const CONTEXTO_MANYCHAT_COMPACTO = `
ESTÁS EN MANYCHAT (Instagram/Facebook/WhatsApp):
- Mensajes MÁS CORTOS (2-3 oraciones máx)
- Las imágenes se muestran automáticamente
- Enfocate en la conexión emocional
`;

/**
 * Resumir historial de conversación para ahorrar tokens
 * En vez de mandar todos los mensajes, mandamos un resumen
 */
export function resumirHistorial(mensajes, maxMensajesCompletos = 4) {
  if (mensajes.length <= maxMensajesCompletos) {
    return { resumen: null, mensajesRecientes: mensajes };
  }

  // Mensajes antiguos (para resumir)
  const antiguos = mensajes.slice(0, -maxMensajesCompletos);
  // Mensajes recientes (mantener completos)
  const recientes = mensajes.slice(-maxMensajesCompletos);

  // Extraer info clave de los mensajes antiguos
  const infoExtraida = {
    nombre: null,
    pais: null,
    necesidad: null,
    productosVistos: [],
    preciosMostrados: false,
    temasPrincipales: []
  };

  antiguos.forEach(msg => {
    const contenido = typeof msg.content === 'string' ? msg.content : '';
    const lower = contenido.toLowerCase();

    // Detectar nombre
    const nombreMatch = lower.match(/me llamo (\w+)|soy (\w+)|mi nombre es (\w+)/);
    if (nombreMatch) {
      infoExtraida.nombre = nombreMatch[1] || nombreMatch[2] || nombreMatch[3];
    }

    // Detectar país
    const paisMatch = lower.match(/de (uruguay|argentina|mexico|méxico|chile|colombia|perú|peru|españa|usa|estados unidos|brasil)/i);
    if (paisMatch) {
      infoExtraida.pais = paisMatch[1];
    }

    // Detectar necesidad
    const necesidades = ['protección', 'abundancia', 'amor', 'sanación', 'proteccion', 'sanacion'];
    necesidades.forEach(n => {
      if (lower.includes(n)) infoExtraida.necesidad = n;
    });

    // Detectar si se mostraron precios
    if (/\$\d+/.test(contenido)) {
      infoExtraida.preciosMostrados = true;
    }

    // Detectar temas principales
    if (lower.includes('guardián') || lower.includes('guardian')) {
      infoExtraida.temasPrincipales.push('guardianes');
    }
    if (lower.includes('envío') || lower.includes('envio')) {
      infoExtraida.temasPrincipales.push('envíos');
    }
  });

  // Crear resumen compacto
  let partes = [];
  if (infoExtraida.nombre) partes.push(`Nombre: ${infoExtraida.nombre}`);
  if (infoExtraida.pais) partes.push(`País: ${infoExtraida.pais}`);
  if (infoExtraida.necesidad) partes.push(`Busca: ${infoExtraida.necesidad}`);
  if (infoExtraida.preciosMostrados) partes.push(`Ya vio precios`);
  if (infoExtraida.temasPrincipales.length > 0) {
    partes.push(`Hablaron de: ${[...new Set(infoExtraida.temasPrincipales)].join(', ')}`);
  }

  const resumen = partes.length > 0
    ? `[RESUMEN PREVIO: ${partes.join(' | ')} - ${antiguos.length} mensajes anteriores]`
    : `[${antiguos.length} mensajes anteriores sin info clave]`;

  return {
    resumen,
    mensajesRecientes: recientes
  };
}

/**
 * Preparar mensajes para Claude con resumen opcional
 */
export function prepararMensajesOptimizados(historial, mensajeActual) {
  const mensajesCompletos = [
    ...historial.map(m => ({
      role: m.role || (m.esUsuario ? 'user' : 'assistant'),
      content: m.content || m.mensaje || m.texto
    })),
    { role: 'user', content: mensajeActual }
  ];

  const { resumen, mensajesRecientes } = resumirHistorial(mensajesCompletos);

  // Si hay resumen, agregarlo como contexto del sistema
  return {
    mensajes: mensajesRecientes,
    contextoResumen: resumen
  };
}

export default PERSONALIDAD_TITO_COMPACTA;
