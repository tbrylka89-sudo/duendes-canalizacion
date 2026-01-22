/**
 * ARCO EMOCIONAL - ESTRUCTURA OBLIGATORIA
 *
 * Cada historia DEBE seguir este arco de 8 fases.
 * Si falta alguna fase, la conversión baja.
 *
 * El arco está diseñado para llevar al lector de:
 * "esto habla de mí" → "lo necesito" → "lo quiero ahora"
 */

export const estructuraArco = {
  espejo: {
    porcentaje: "0-15%",
    objetivo: "El lector se reconoce. Piensa 'esto habla de mí'.",
    indicadores: [
      "hay personas que",
      "hay quienes",
      "algunos",
      "existe gente",
      "¿cuántas veces",
      "¿te pasó",
      "¿sentís que"
    ],
    ejemploMalo: "Desde los bosques ancestrales...",
    ejemploBueno: "Hay personas que cargan con todo y no piden nada."
  },

  herida: {
    porcentaje: "15-30%",
    objetivo: "Tocar el dolor sin nombrarlo directamente. Hacerlo sentir.",
    indicadores: [
      "carga",
      "peso",
      "agota",
      "drena",
      "cansa",
      "duele",
      "falta",
      "vacío",
      "sola",
      "nadie"
    ],
    ejemploMalo: "Tienes problemas de energía negativa.",
    ejemploBueno: "Cuidar a todos te dejó sin nadie que te cuide a vos."
  },

  validacion: {
    porcentaje: "30-40%",
    objetivo: "Legitimar su experiencia. 'Lo que sentís es real'.",
    indicadores: [
      "es real",
      "no estás loca",
      "tiene sentido",
      "es válido",
      "no es tu culpa",
      "no imaginás",
      "existe"
    ],
    ejemploMalo: "Debes trabajar en tu vibración.",
    ejemploBueno: "Lo que sentís es real. No lo inventaste. No exagerás."
  },

  esperanza: {
    porcentaje: "40-55%",
    objetivo: "Mostrar que hay una salida. Transición a la solución.",
    indicadores: [
      "pero",
      "sin embargo",
      "existe",
      "hay otra forma",
      "no tiene que ser así",
      "es posible",
      "llegó"
    ],
    ejemploMalo: "Compra este producto y todo cambia.",
    ejemploBueno: "Pero hay quienes aprendieron a proteger su energía sin dejar de dar."
  },

  solucion: {
    porcentaje: "55-70%",
    objetivo: "Presentar al guardián específico como la respuesta.",
    indicadores: [
      "[nombre del guardián]",
      "este ser",
      "viene a",
      "su misión",
      "fue creado",
      "nació para",
      "trabaja"
    ],
    ejemploMalo: "Este duende es muy poderoso.",
    ejemploBueno: "Violeta no vino a protegerte del mundo. Vino a enseñarte a protegerte vos misma."
  },

  prueba: {
    porcentaje: "70-85%",
    objetivo: "El sincrodestino. Algo que pasó durante la creación.",
    indicadores: [
      "mientras",
      "cuando",
      "justo",
      "exactamente",
      "ese momento",
      "pasó algo",
      "creaba"
    ],
    ejemploMalo: "Este producto tiene energía especial.",
    ejemploBueno: "Mientras la modelaba, el gato que nunca entra al taller se sentó a mirar."
  },

  puente: {
    porcentaje: "85-95%",
    objetivo: "El guardián habla en primera persona. Íntimo, directo.",
    indicadores: [
      "*",
      "primera persona",
      "vine",
      "llegué",
      "sé que",
      "voy a",
      "conmigo"
    ],
    ejemploMalo: "El duende te protegerá.",
    ejemploBueno: "*Vine porque ya no podés sola. Y está bien. Dejame ayudarte.*"
  },

  decision: {
    porcentaje: "95-100%",
    objetivo: "No cerrar. Dejar que el lector decida. Loop abierto.",
    indicadores: [
      "si sentiste",
      "si llegaste",
      "si algo",
      "tu decisión",
      "solo vos sabés",
      "desaparece",
      "única vez"
    ],
    ejemploMalo: "¡Compralo ya antes de que se agote!",
    ejemploBueno: "Si algo de esto te hizo sentir algo, no lo ignores."
  }
};

/**
 * Valida si una historia tiene todos los elementos del arco
 * @param {string} historia - Texto de la historia
 * @returns {object} { resultados, score, completo, faltantes }
 */
export const validarArco = (historia) => {
  const historiaLower = historia.toLowerCase();
  const resultados = {};
  let score = 0;
  const faltantes = [];

  Object.entries(estructuraArco).forEach(([fase, config]) => {
    const tiene = config.indicadores.some(ind => {
      const indicadorLower = ind.toLowerCase();
      // Para el nombre del guardián, buscar patrón genérico
      if (indicadorLower.includes('[nombre')) {
        return /[A-Z][a-záéíóú]+/.test(historia);
      }
      return historiaLower.includes(indicadorLower);
    });

    resultados[fase] = tiene;
    if (tiene) {
      score += 12.5; // 8 fases = 100%
    } else {
      faltantes.push({
        fase,
        objetivo: config.objetivo,
        ejemplo: config.ejemploBueno
      });
    }
  });

  return {
    resultados,
    score: Math.round(score),
    completo: score >= 75,
    faltantes
  };
};

/**
 * Genera sugerencias para mejorar el arco
 * @param {object} validacion - Resultado de validarArco
 * @returns {string[]} Lista de sugerencias
 */
export const generarSugerenciasArco = (validacion) => {
  const sugerencias = [];

  validacion.faltantes.forEach(({ fase, objetivo, ejemplo }) => {
    const sugerencia = `Falta la fase "${fase}": ${objetivo}\nEjemplo: "${ejemplo}"`;
    sugerencias.push(sugerencia);
  });

  return sugerencias;
};

/**
 * Verifica si la historia tiene el orden correcto del arco
 * @param {string} historia
 * @returns {object} { ordenCorrecto, problemas }
 */
export const verificarOrdenArco = (historia) => {
  const historiaLower = historia.toLowerCase();
  const fases = Object.keys(estructuraArco);
  const posiciones = {};

  fases.forEach(fase => {
    const config = estructuraArco[fase];
    let primeraPos = -1;

    config.indicadores.forEach(ind => {
      const pos = historiaLower.indexOf(ind.toLowerCase());
      if (pos !== -1 && (primeraPos === -1 || pos < primeraPos)) {
        primeraPos = pos;
      }
    });

    posiciones[fase] = primeraPos;
  });

  // Verificar que las fases encontradas estén en orden
  const fasesEncontradas = fases.filter(f => posiciones[f] !== -1);
  const problemas = [];

  for (let i = 1; i < fasesEncontradas.length; i++) {
    const faseAnterior = fasesEncontradas[i - 1];
    const faseActual = fasesEncontradas[i];

    if (posiciones[faseActual] < posiciones[faseAnterior]) {
      problemas.push(`"${faseActual}" aparece antes que "${faseAnterior}"`);
    }
  }

  return {
    ordenCorrecto: problemas.length === 0,
    problemas,
    posiciones
  };
};

/**
 * Retorna las fases del arco para el prompt
 */
export const getArcoParaPrompt = () => {
  return Object.entries(estructuraArco).map(([fase, config]) => ({
    fase,
    porcentaje: config.porcentaje,
    objetivo: config.objetivo,
    ejemplo: config.ejemploBueno
  }));
};
