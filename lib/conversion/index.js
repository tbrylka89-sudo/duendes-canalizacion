/**
 * SISTEMA DE CONVERSIÓN - ÍNDICE
 *
 * Exporta todas las funciones del sistema de conversión experto.
 *
 * Módulos:
 * - hooks: Biblioteca de hooks de apertura por categoría
 * - sincrodestinos: Base de eventos sincrodestinos
 * - cierres: Cierres personalizados por perfil psicológico
 * - arco: Estructura y validación del arco emocional
 * - scoring: Sistema de scoring de conversión
 */

// Hooks
export {
  hooks,
  getRandomHook,
  getAllHooks,
  getHooksAlternativos
} from './hooks.js';

// Sincrodestinos
export {
  sincrodestinos,
  getRandomSincrodestino,
  getSincrodestinoByTipo,
  tiposSincrodestino
} from './sincrodestinos.js';

// Cierres por perfil
export {
  generarCierres,
  getCierre,
  getCierresPrincipales,
  perfilesDisponibles,
  detectarPerfil
} from './cierres.js';

// Arco emocional
export {
  estructuraArco,
  validarArco,
  generarSugerenciasArco,
  verificarOrdenArco,
  getArcoParaPrompt
} from './arco.js';

// Scoring
export {
  calcularScore,
  evaluarScore,
  generarResumenScore,
  detectarFrasesIA,
  analizarHistoria
} from './scoring.js';

/**
 * Análisis completo de una historia con todos los módulos
 * @param {string} historia - Texto de la historia
 * @param {object} datos - { nombre, especie, categoria, genero }
 * @returns {object} Análisis completo
 */
export const analizarHistoriaCompleta = async (historia, datos = {}) => {
  const { validarArco } = await import('./arco.js');
  const { analizarHistoria } = await import('./scoring.js');
  const { detectarFrasesIA } = await import('./scoring.js');

  const arco = validarArco(historia);
  const scoring = analizarHistoria(historia, datos);
  const frasesIA = detectarFrasesIA(historia);

  return {
    // Arco emocional
    arco: {
      score: arco.score,
      completo: arco.completo,
      fases: arco.resultados,
      faltantes: arco.faltantes
    },

    // Scoring de conversión
    conversion: scoring.score,

    // Evaluación
    evaluacion: scoring.evaluacion,

    // Problemas detectados
    problemas: {
      frasesIA,
      arcoIncompleto: !arco.completo,
      scoreBajo: !scoring.evaluacion.aceptable
    },

    // Veredicto final
    aprobada: arco.completo && scoring.evaluacion.aceptable && frasesIA.length === 0,

    // Sugerencias combinadas
    sugerencias: [
      ...scoring.evaluacion.sugerencias,
      ...arco.faltantes.map(f => `Falta fase "${f.fase}": ${f.objetivo}`)
    ],

    // Advertencias combinadas
    advertencias: [
      ...scoring.evaluacion.advertencias,
      ...frasesIA.map(f => `Frase de IA detectada: ${f}`),
      ...(arco.completo ? [] : [`Arco emocional incompleto (${arco.score}%)`])
    ]
  };
};
