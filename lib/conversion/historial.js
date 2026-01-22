/**
 * SISTEMA ANTI-REPETICIÓN
 *
 * Guarda qué elementos se usaron en historias recientes
 * para evitar repetir hooks, frases de espejo, sincrodestinos.
 */

import { kv } from '@vercel/kv';

const CLAVE_HISTORIAL = 'historias:historial';
const MAX_ELEMENTOS = 50; // Cuántos elementos recordar por tipo

/**
 * Estructura del historial:
 * {
 *   hooks: ["frase1", "frase2", ...],
 *   espejos: ["frase1", "frase2", ...],
 *   sincrodestinos: ["evento1", "evento2", ...],
 *   aperturas: ["primera frase 1", "primera frase 2", ...]
 * }
 */

/**
 * Obtiene el historial actual
 */
export const getHistorial = async () => {
  try {
    const historial = await kv.get(CLAVE_HISTORIAL);
    return historial || {
      hooks: [],
      espejos: [],
      sincrodestinos: [],
      aperturas: []
    };
  } catch (e) {
    console.error('Error obteniendo historial:', e);
    return { hooks: [], espejos: [], sincrodestinos: [], aperturas: [] };
  }
};

/**
 * Registra elementos usados en una historia
 */
export const registrarElementosUsados = async (elementos) => {
  try {
    const historial = await getHistorial();

    // Agregar nuevos elementos (evitando duplicados)
    if (elementos.hook) {
      historial.hooks = [elementos.hook, ...historial.hooks.filter(h => h !== elementos.hook)].slice(0, MAX_ELEMENTOS);
    }
    if (elementos.espejo) {
      historial.espejos = [elementos.espejo, ...historial.espejos.filter(e => e !== elementos.espejo)].slice(0, MAX_ELEMENTOS);
    }
    if (elementos.sincrodestino) {
      historial.sincrodestinos = [elementos.sincrodestino, ...historial.sincrodestinos.filter(s => s !== elementos.sincrodestino)].slice(0, MAX_ELEMENTOS);
    }
    if (elementos.apertura) {
      // Guardar solo las primeras 50 caracteres de la apertura
      const aperturaCorta = elementos.apertura.substring(0, 50);
      historial.aperturas = [aperturaCorta, ...historial.aperturas.filter(a => a !== aperturaCorta)].slice(0, MAX_ELEMENTOS);
    }

    await kv.set(CLAVE_HISTORIAL, historial);
    return true;
  } catch (e) {
    console.error('Error registrando elementos:', e);
    return false;
  }
};

/**
 * Genera instrucciones de NO REPETIR para el prompt
 */
export const getInstruccionesNoRepetir = async () => {
  const historial = await getHistorial();

  let instrucciones = '\n## ELEMENTOS YA USADOS (NO REPETIR)\n\n';

  if (historial.hooks.length > 0) {
    instrucciones += '**Hooks ya usados (elegí uno DIFERENTE):**\n';
    historial.hooks.slice(0, 10).forEach(h => {
      instrucciones += `- ❌ "${h.substring(0, 60)}..."\n`;
    });
    instrucciones += '\n';
  }

  if (historial.aperturas.length > 0) {
    instrucciones += '**Primeras frases ya usadas (empezá DIFERENTE):**\n';
    historial.aperturas.slice(0, 10).forEach(a => {
      instrucciones += `- ❌ "${a}..."\n`;
    });
    instrucciones += '\n';
  }

  if (historial.sincrodestinos.length > 0) {
    instrucciones += '**Sincrodestinos ya usados (inventá uno DIFERENTE):**\n';
    historial.sincrodestinos.slice(0, 8).forEach(s => {
      instrucciones += `- ❌ "${s.substring(0, 60)}..."\n`;
    });
    instrucciones += '\n';
  }

  instrucciones += `
IMPORTANTE: Las historias deben ser ÚNICAS. Si ves que tu idea es similar a algo de la lista, cambiala.
`;

  return instrucciones;
};

/**
 * Extrae elementos de una historia generada para registrar
 */
export const extraerElementosDeHistoria = (historia, hookUsado, sincrodestinoUsado) => {
  // Extraer primera frase (apertura)
  const primeraFrase = historia.split(/[.!?]/)[0]?.trim() || '';

  return {
    hook: hookUsado,
    apertura: primeraFrase,
    sincrodestino: sincrodestinoUsado?.evento || null
  };
};

export default {
  getHistorial,
  registrarElementosUsados,
  getInstruccionesNoRepetir,
  extraerElementosDeHistoria
};
