/**
 * CIERRES POR PERFIL PSICOLÓGICO
 *
 * Cada persona tiene un perfil de compra diferente.
 * El cierre debe hablar en su idioma emocional.
 *
 * Perfiles:
 * - vulnerable: Da mucho, recibe poco, necesita permiso
 * - esceptico: No cree fácil, necesita validación de su propia experiencia
 * - impulsivo: Decide rápido, necesita urgencia real
 * - coleccionista: Ya tiene guardianes, entiende el sistema
 * - racional: Necesita "lógica" emocional, no mística
 */

/**
 * Genera todos los cierres para un guardián específico
 * @param {string} nombreGuardian - Nombre del guardián
 * @param {string} genero - 'm' o 'f' del guardián
 * @returns {object} Cierres por cada perfil
 */
export const generarCierres = (nombreGuardian, genero = 'f') => {
  const pronombre = genero === 'f' ? 'ella' : 'él';
  const articulo = genero === 'f' ? 'la' : 'el';

  return {
    vulnerable: `Sé que estás cansada. Sé que das más de lo que recibís. ${nombreGuardian} no viene a pedirte nada. Viene a darte lo que nunca te diste: permiso para recibir.

Si estás leyendo esto con los ojos húmedos, no es casualidad. Es reconocimiento.`,

    esceptico: `No te pido que creas en nada. No necesito que confíes en mí ni en ${nombreGuardian}.

Solo te pido una cosa: observá qué sentiste mientras leías esto. Si algo se movió adentro tuyo, eso no lo inventé yo. Eso ya estaba ahí.`,

    impulsivo: `Hay momentos en que el cuerpo sabe antes que la mente. Si llegaste hasta acá, algo te trajo.

${nombreGuardian} no espera. Los guardianes únicos desaparecen cuando encuentran su hogar. Este es uno de esos momentos donde pensar demasiado es perder.`,

    coleccionista: `${nombreGuardian} no trabaja solo${genero === 'f' ? 'a' : ''}. Los guardianes se potencian entre sí. Si ya tenés otros, ${articulo} viene a completar algo que falta.

Los que entienden esto no necesitan explicación. Ya saben cómo funciona.`,

    racional: `No voy a decirte que ${nombreGuardian} hace magia. Voy a decirte que tener algo físico que represente lo que necesitás, cambia cómo te relacionás con eso.

La psicología lo llama anclaje. Los antiguos lo llamaban protección. El nombre da igual. Funciona.`,

    default: `Si algo de esto te hizo sentir algo, no lo ignores. El cuerpo reconoce antes que la mente.

${nombreGuardian} desaparece cuando encuentra su hogar verdadero. Una sola vez.`
  };
};

/**
 * Obtiene el cierre para un perfil específico
 * @param {string} nombreGuardian
 * @param {string} perfil - vulnerable, esceptico, impulsivo, coleccionista, racional
 * @param {string} genero
 * @returns {string} Cierre personalizado
 */
export const getCierre = (nombreGuardian, perfil = 'default', genero = 'f') => {
  const cierres = generarCierres(nombreGuardian, genero);
  return cierres[perfil] || cierres.default;
};

/**
 * Obtiene 3 cierres alternativos para diferentes perfiles
 * @param {string} nombreGuardian
 * @param {string} genero
 * @returns {object} 3 cierres principales
 */
export const getCierresPrincipales = (nombreGuardian, genero = 'f') => {
  const todos = generarCierres(nombreGuardian, genero);
  return {
    vulnerable: todos.vulnerable,
    esceptico: todos.esceptico,
    impulsivo: todos.impulsivo
  };
};

/**
 * Lista de perfiles disponibles
 */
export const perfilesDisponibles = [
  { id: 'vulnerable', nombre: 'Vulnerable', descripcion: 'Personas que dan mucho y piden poco' },
  { id: 'esceptico', nombre: 'Escéptico', descripcion: 'No creen fácil, necesitan validar su experiencia' },
  { id: 'impulsivo', nombre: 'Impulsivo', descripcion: 'Deciden rápido cuando algo resuena' },
  { id: 'coleccionista', nombre: 'Coleccionista', descripcion: 'Ya tienen guardianes, entienden el sistema' },
  { id: 'racional', nombre: 'Racional', descripcion: 'Necesitan lógica emocional, no mística' }
];

/**
 * Detecta el perfil probable basado en comportamiento
 * (Para uso futuro con analytics)
 * @param {object} comportamiento
 * @returns {string} Perfil detectado
 */
export const detectarPerfil = (comportamiento = {}) => {
  const {
    tiempoEnPagina = 0,
    scrollProfundidad = 0,
    volvioAPagina = false,
    tieneOtrosGuardianes = false,
    fuenteTrafico = '',
    dispositivo = ''
  } = comportamiento;

  // Coleccionista: ya compró antes
  if (tieneOtrosGuardianes) return 'coleccionista';

  // Impulsivo: poco tiempo, decisión rápida
  if (tiempoEnPagina < 60 && scrollProfundidad > 80) return 'impulsivo';

  // Escéptico: volvió a la página (estaba pensando)
  if (volvioAPagina) return 'esceptico';

  // Vulnerable: mucho tiempo leyendo (conectando emocionalmente)
  if (tiempoEnPagina > 180) return 'vulnerable';

  // Racional: viene de búsqueda orgánica (investigó)
  if (fuenteTrafico === 'organic') return 'racional';

  return 'default';
};
