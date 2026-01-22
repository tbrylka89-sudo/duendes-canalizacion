/**
 * SISTEMA DE SCORING DE CONVERSIÓN
 *
 * Mide objetivamente qué tan buena es una historia para convertir.
 *
 * 5 dimensiones, cada una de 0-10:
 * - Identificación: ¿El lector se reconoce?
 * - Dolor: ¿Toca heridas reales?
 * - Solución: ¿El guardián resuelve algo específico?
 * - Urgencia: ¿Hay razón para actuar ahora?
 * - Confianza: ¿Evita sonar a venta?
 *
 * Total máximo: 50
 * Score mínimo aceptable: 30
 */

/**
 * Calcula el score de conversión de una historia
 * @param {string} historia - Texto de la historia
 * @param {object} datos - { nombre, especie, categoria }
 * @returns {object} Score desglosado y total
 */
export const calcularScore = (historia, datos = {}) => {
  const score = {
    identificacion: 0,
    dolor: 0,
    solucion: 0,
    urgencia: 0,
    confianza: 0
  };

  const historiaLower = historia.toLowerCase();

  // ===== IDENTIFICACIÓN (0-10) =====
  // ¿El lector puede verse reflejado?
  const patronesIdentificacion = [
    /hay personas que/i,
    /hay quienes/i,
    /algunas personas/i,
    /existe gente/i,
    /¿cuántas veces/i,
    /¿sentís/i,
    /¿te pasó/i,
    /¿alguna vez/i,
    /hay momentos/i,
    /a veces/i,
    /quizás vos/i,
    /puede que/i
  ];
  score.identificacion = Math.min(10, patronesIdentificacion.filter(p => p.test(historia)).length * 2);

  // ===== DOLOR (0-10) =====
  // ¿Toca heridas reales sin ser explícito?
  const patronesDolor = [
    /carga/i,
    /peso/i,
    /agota/i,
    /drena/i,
    /cansa/i,
    /duele/i,
    /herida/i,
    /sufr/i,
    /difícil/i,
    /sola/i,
    /vacío/i,
    /falta/i,
    /nadie/i,
    /sin recibir/i,
    /no te cuida/i
  ];
  score.dolor = Math.min(10, patronesDolor.filter(p => p.test(historia)).length * 1.5);

  // ===== SOLUCIÓN (0-10) =====
  // ¿El guardián ofrece algo concreto?
  const nombreMencionado = datos.nombre && historia.includes(datos.nombre);
  const beneficiosClaros = /vas a|va a|viene a|puede|trabaja para/i.test(historia);
  const accionConcreta = /protege|ayuda|trabaja|activa|enseña|acompaña|sostiene/i.test(historia);
  const especificidad = datos.categoria &&
    historia.toLowerCase().includes(datos.categoria.toLowerCase());

  score.solucion =
    (nombreMencionado ? 3 : 0) +
    (beneficiosClaros ? 2 : 0) +
    (accionConcreta ? 3 : 0) +
    (especificidad ? 2 : 0);

  // ===== URGENCIA (0-10) =====
  // ¿Hay razón para actuar ahora?
  const patronesUrgencia = [
    // Urgencia clásica (piezas únicas)
    /desaparece/i,
    /única vez/i,
    /único/i,
    /no espera/i,
    /este momento/i,
    /una sola/i,
    /ya no/i,
    /cuando encuentr/i,
    /pieza única/i,
    // Urgencia para recreables (el guardián te elige)
    /te elige/i,
    /no elegís vos/i,
    /tenía que llegar/i,
    /ya sabe que sos/i,
    /te estaba esperando/i,
    /algo te trajo/i,
    /no es casualidad/i,
    /llegaste hasta acá/i,
    // Urgencia existencial (tiempo de vida, no stock)
    /esta versión de vos/i,
    /esa no vuelve/i,
    /cuánto más vas a esperar/i,
    /mañana vas a estar igual/i,
    /hoy hagas algo diferente/i
  ];
  score.urgencia = Math.min(10, patronesUrgencia.filter(p => p.test(historia)).length * 1.5);

  // ===== CONFIANZA (0-10) =====
  // ¿Evita sonar a venta? (empezamos en 5 y sumamos/restamos)
  const frasesVenta = [
    /comprá/i,
    /llevátelo/i,
    /oferta/i,
    /descuento/i,
    /no te lo pierdas/i,
    /última oportunidad/i,
    /aprovechá/i,
    /solo hoy/i,
    /promoción/i,
    /quedan pocos/i
  ];

  const frasesConfianza = [
    /si sentiste/i,
    /si algo/i,
    /tu decisión/i,
    /solo vos sabés/i,
    /no te pido/i,
    /está bien/i,
    /es válido/i,
    /no juzgo/i
  ];

  const penalizacion = frasesVenta.filter(p => p.test(historia)).length * 2;
  const bonus = frasesConfianza.filter(p => p.test(historia)).length * 1.5;

  score.confianza = Math.max(0, Math.min(10, 5 + bonus - penalizacion));

  // ===== TOTAL =====
  score.total = Math.round(
    score.identificacion +
    score.dolor +
    score.solucion +
    score.urgencia +
    score.confianza
  );

  return score;
};

/**
 * Evalúa si el score es aceptable
 * @param {object} score - Resultado de calcularScore
 * @returns {object} { aceptable, advertencias, sugerencias }
 */
export const evaluarScore = (score) => {
  const advertencias = [];
  const sugerencias = [];

  // Verificar cada dimensión
  if (score.identificacion < 4) {
    advertencias.push('Baja identificación');
    sugerencias.push('Agregá preguntas o frases como "hay personas que..." para que el lector se reconozca');
  }

  if (score.dolor < 4) {
    advertencias.push('Dolor insuficiente');
    sugerencias.push('Tocá el dolor real sin nombrarlo: carga, peso, vacío, soledad');
  }

  if (score.solucion < 5) {
    advertencias.push('Solución poco clara');
    sugerencias.push('Especificá qué hace el guardián, usá su nombre, mencioná beneficios concretos');
  }

  if (score.urgencia < 3) {
    advertencias.push('Sin urgencia');
    sugerencias.push('Urgencia única: "pieza única, desaparece". Urgencia recreable: "no elegís vos, él te elige", "algo te trajo hasta acá"');
  }

  if (score.confianza < 4) {
    advertencias.push('Suena a venta');
    sugerencias.push('Eliminá frases de venta directa, usá "si sentiste algo" en lugar de "comprá"');
  }

  return {
    aceptable: score.total >= 30,
    scoreMinimo: 30,
    advertencias,
    sugerencias
  };
};

/**
 * Genera un resumen del score para mostrar
 * @param {object} score
 * @returns {string} Resumen legible
 */
export const generarResumenScore = (score) => {
  const evaluacion = evaluarScore(score);
  const emoji = score.total >= 40 ? '✅' : score.total >= 35 ? '⚠️' : '❌';

  let resumen = `${emoji} Score: ${score.total}/50\n\n`;
  resumen += `📊 Desglose:\n`;
  resumen += `  • Identificación: ${score.identificacion}/10\n`;
  resumen += `  • Dolor: ${score.dolor}/10\n`;
  resumen += `  • Solución: ${score.solucion}/10\n`;
  resumen += `  • Urgencia: ${score.urgencia}/10\n`;
  resumen += `  • Confianza: ${score.confianza}/10\n`;

  if (evaluacion.advertencias.length > 0) {
    resumen += `\n⚠️ Advertencias:\n`;
    evaluacion.advertencias.forEach(a => {
      resumen += `  • ${a}\n`;
    });
  }

  return resumen;
};

/**
 * Detecta frases problemáticas de IA
 * @param {string} historia
 * @returns {string[]} Lista de frases problemáticas encontradas
 */
export const detectarFrasesIA = (historia) => {
  const frasesProhibidas = [
    { patron: /desde.*profundidades/i, descripcion: "Desde las profundidades..." },
    { patron: /brumas.*ancestral/i, descripcion: "Brumas ancestrales" },
    { patron: /velo entre.*mundos/i, descripcion: "El velo entre mundos" },
    { patron: /tiempos inmemoriales/i, descripcion: "Tiempos inmemoriales" },
    { patron: /susurro.*viento/i, descripcion: "Susurro del viento" },
    { patron: /danza de las hojas/i, descripcion: "Danza de las hojas" },
    { patron: /bosque ancestral.*piriápolis/i, descripcion: "Bosque Ancestral de Piriápolis (genérico)" },
    { patron: /atraves.*dimensiones/i, descripcion: "Atravesando dimensiones" },
    { patron: /vibracione?s? cósmica/i, descripcion: "Vibraciones cósmicas" },
    { patron: /campo energético/i, descripcion: "Campo energético" },
    { patron: /847 años/i, descripcion: "847 años (número prohibido)" },
    { patron: /acantilados de irlanda/i, descripcion: "Acantilados de Irlanda (genérico)" },
    { patron: /bosques de escocia/i, descripcion: "Bosques de Escocia (genérico)" },
  ];

  const encontradas = [];

  frasesProhibidas.forEach(({ patron, descripcion }) => {
    if (patron.test(historia)) {
      encontradas.push(descripcion);
    }
  });

  return encontradas;
};

/**
 * Análisis completo de una historia
 * @param {string} historia
 * @param {object} datos
 * @returns {object} Análisis completo
 */
export const analizarHistoria = (historia, datos = {}) => {
  const score = calcularScore(historia, datos);
  const evaluacion = evaluarScore(score);
  const frasesIA = detectarFrasesIA(historia);

  return {
    score,
    evaluacion,
    frasesIA,
    aprobada: evaluacion.aceptable && frasesIA.length === 0,
    resumen: generarResumenScore(score)
  };
};
