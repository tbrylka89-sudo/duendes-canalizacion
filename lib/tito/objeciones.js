/**
 * Sistema de detección y manejo de objeciones
 * Tito usa esto para detectar cuando un cliente tiene dudas y responder apropiadamente
 */

export const OBJECIONES = {
  precio: {
    detectores: [
      /(?:es|está|muy|bastante|demasiado)\s*caro/i,
      /no\s*(?:me\s*)?alcanza/i,
      /mucha\s*plata/i,
      /no\s*tengo\s*(?:la\s*)?plata/i,
      /fuera\s*de\s*(?:mi\s*)?presupuesto/i,
      /precio.*alto/i
    ],
    respuestas: [
      "Entiendo. ¿Sabías que podés reservar con una seña del 30%? Así asegurás tu guardián y pagás el resto cuando puedas.",
      "Te entiendo. Hay guardianes desde $70 USD que son igual de especiales. ¿Querés que te muestre algunas opciones?",
      "El precio refleja que son piezas únicas, hechas a mano. Pero si sentís el llamado, podemos buscar una forma de hacerlo posible.",
      "¿Caro comparado con qué? Un guardián te acompaña toda la vida. Es una inversión en tu bienestar."
    ],
    tono: "empático_sin_presion"
  },

  tiempo: {
    detectores: [
      /(?:lo\s*)?(?:pienso|pensarlo)/i,
      /más\s*adelante/i,
      /después\s*(?:veo|te\s*aviso)/i,
      /no\s*(?:estoy\s*)?segur[ao]/i,
      /necesito\s*tiempo/i,
      /todavía\s*no/i
    ],
    respuestas: [
      "Dale, sin presión. Pero te cuento que este guardián es pieza única... cuando encuentre hogar, desaparece.",
      "Entiendo. ¿Hay algo específico que te haría sentir más segura/o para decidir?",
      "Está bien. Te dejo el link para cuando estés lista/o. Pero si sentiste algo con este guardián, no lo ignores.",
      "El guardián va a seguir esperando... pero no para siempre. Son piezas únicas."
    ],
    tono: "paciente_con_urgencia_sutil"
  },

  desconfianza: {
    detectores: [
      /(?:es|son)\s*(?:de\s*)?verdad/i,
      /(?:cómo\s*)?(?:sé|se)\s*que/i,
      /no\s*(?:sé\s*)?si\s*creer/i,
      /parece.*estafa/i,
      /es\s*real/i,
      /funciona/i
    ],
    respuestas: [
      "Entiendo la duda. Mirá, no te pido que creas en nada. Solo que notes qué sentiste cuando viste a este guardián.",
      "Los guardianes no necesitan que creas en ellos. Ellos ya saben. La pregunta es: ¿vos sentiste algo?",
      "Tenemos más de 500 familias con sus guardianes. Podés ver testimonios reales en nuestra página.",
      "No vendemos fe, vendemos compañía. Un guardián es un recordatorio físico de lo que necesitás cultivar."
    ],
    tono: "seguro_sin_confrontar"
  },

  envio: {
    detectores: [
      /(?:cómo|cuánto)\s*(?:es\s*)?(?:el\s*)?envío/i,
      /llega.*(?:bien|seguro|roto)/i,
      /(?:se\s*)?rompe/i,
      /hacen\s*envíos/i,
      /envían\s*a/i
    ],
    respuestas: [
      "¡Enviamos a todo el mundo! Uruguay con DAC, internacional con DHL. Llegan perfectos, súper protegidos.",
      "El envío es por DHL (internacional) o DAC (Uruguay). Llegan en 3-7 días hábiles, con tracking.",
      "Cada guardián viaja en su caja especial con protección. Nunca tuvimos problemas de roturas.",
      "Sí, enviamos a tu país. ¿Querés que te calcule el costo de envío?"
    ],
    tono: "informativo_confiado"
  },

  regalo: {
    detectores: [
      /(?:es\s*)?(?:para\s*)?(?:un\s*)?regalo/i,
      /regalar/i,
      /(?:para\s*)?(?:mi\s*)?(?:mamá|papá|hermana|amiga|novio|pareja)/i,
      /sorpresa/i
    ],
    respuestas: [
      "¡Qué lindo regalar un guardián! Podemos hacer una canalización especial para esa persona.",
      "Para regalos tenemos opciones especiales. ¿Querés que te cuente cómo funciona?",
      "Un guardián es un regalo que dura toda la vida. Y la canalización la hacemos personalizada para quien lo recibe.",
      "¿Sabés qué necesita esa persona? Así te puedo recomendar el guardián perfecto para regalar."
    ],
    tono: "entusiasmado_servicial"
  }
};

/**
 * Detecta si un mensaje contiene una objeción
 * @param {string} mensaje - El mensaje del usuario
 * @returns {object|null} - La objeción detectada o null
 */
export function detectarObjecion(mensaje) {
  const msgLower = mensaje.toLowerCase();

  for (const [tipo, config] of Object.entries(OBJECIONES)) {
    for (const regex of config.detectores) {
      if (regex.test(msgLower)) {
        return {
          tipo,
          respuestaSugerida: config.respuestas[Math.floor(Math.random() * config.respuestas.length)],
          tono: config.tono,
          todasLasRespuestas: config.respuestas
        };
      }
    }
  }

  return null;
}

/**
 * Obtiene instrucciones para manejar una objeción específica
 */
export function getInstruccionesObjecion(tipo) {
  const instrucciones = {
    precio: `
      OBJECIÓN DE PRECIO detectada. Estrategia:
      1. Validar la preocupación (no minimizar)
      2. Ofrecer alternativas (seña 30%, guardianes más accesibles)
      3. Reencuadrar el valor (inversión, no gasto)
      4. NO presionar - dejar espacio
    `,
    tiempo: `
      OBJECIÓN DE TIEMPO detectada. Estrategia:
      1. Respetar su ritmo
      2. Crear urgencia SUTIL (pieza única)
      3. Indagar qué le falta para decidir
      4. Dejar puerta abierta
    `,
    desconfianza: `
      OBJECIÓN DE DESCONFIANZA detectada. Estrategia:
      1. No confrontar ni ofenderse
      2. Apelar a la experiencia personal (¿qué sentiste?)
      3. Ofrecer prueba social (testimonios)
      4. Ser transparente sobre qué es un guardián
    `,
    envio: `
      CONSULTA DE ENVÍO detectada. Estrategia:
      1. Dar información clara y completa
      2. Transmitir seguridad
      3. Ofrecer calcular costo específico
      4. Avanzar hacia el cierre si la info satisface
    `,
    regalo: `
      INTENCIÓN DE REGALO detectada. Estrategia:
      1. Mostrar entusiasmo genuino
      2. Explicar proceso de canalización para terceros
      3. Ayudar a elegir según la persona que recibirá
      4. Ofrecer opciones de sorpresa vs no-sorpresa
    `
  };

  return instrucciones[tipo] || '';
}

export default { OBJECIONES, detectarObjecion, getInstruccionesObjecion };
