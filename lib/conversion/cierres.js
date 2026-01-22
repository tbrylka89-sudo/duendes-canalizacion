/**
 * CIERRES POR PERFIL PSICOLÓGICO - CON VARIACIONES
 *
 * Cada persona tiene un perfil de compra diferente.
 * El cierre debe hablar en su idioma emocional.
 * Ahora con múltiples variaciones para evitar repetición en batch.
 */

// VARIACIONES POR PERFIL
const variacionesVulnerable = [
  (nombre) => `Sé que estás cansada. Sé que das más de lo que recibís. ${nombre} no viene a pedirte nada. Viene a darte lo que nunca te diste: permiso para recibir. Si estás leyendo esto con los ojos húmedos, no es casualidad. Es reconocimiento.`,

  (nombre) => `Siempre cuidando a todos. Siempre siendo el pilar. ¿Y vos cuándo? ${nombre} llegó para recordarte que también merecés recibir. No es egoísmo. Es equilibrio.`,

  (nombre) => `Llevás tanto tiempo siendo fuerte que ya no sabés cómo pedir ayuda. ${nombre} no necesita que le pidas nada. Ya sabe lo que necesitás. Solo dejate cuidar por una vez.`,

  (nombre) => `El cansancio que sentís no es físico. Es de tanto dar sin recibir. ${nombre} viene a equilibrar esa balanza. A recordarte que merecés tanto como das.`,

  (nombre) => `No tenés que convencer a nadie de que lo necesitás. Ni siquiera a vos misma. ${nombre} ya lo sabe. Y está esperando para acompañarte.`
];

const variacionesEsceptico = [
  (nombre) => `No te pido que creas en nada. No necesito que confíes en nosotros ni en ${nombre}. Solo te pido una cosa: observá qué sentiste mientras leías esto. Si algo se movió adentro tuyo, eso no lo inventamos. Eso ya estaba ahí.`,

  (nombre) => `Podés pensar que es solo una figura de arcilla. Podés pensar lo que quieras. Pero algo te hizo leer hasta acá. Ese algo no tiene explicación racional. Y no la necesita.`,

  (nombre) => `No vamos a intentar convencerte de nada. ${nombre} no necesita que creas para hacer lo suyo. Solo necesita que lo dejes entrar. El resto pasa solo.`,

  (nombre) => `La duda es válida. El escepticismo protege. Pero hay un momento donde el cuerpo sabe algo que la mente todavía no acepta. Si llegaste hasta acá, tu cuerpo ya decidió.`,

  (nombre) => `No te pedimos fe ciega. Te pedimos que notes qué sentiste mientras leías sobre ${nombre}. Eso que sentiste es información. Hacé lo que quieras con ella.`
];

const variacionesImpulsivo = [
  (nombre) => `Hay momentos en que el cuerpo sabe antes que la mente. Si llegaste hasta acá, algo te trajo. ${nombre} no espera. Los guardianes únicos desaparecen cuando encuentran su hogar. Este es uno de esos momentos donde pensar demasiado es perder.`,

  (nombre) => `A veces el momento exacto es ahora. No mañana, no "cuando pueda", no "lo pienso". ${nombre} apareció en tu pantalla por algo. Ignorar eso es ignorarte a vos.`,

  (nombre) => `Las mejores decisiones de tu vida probablemente no fueron las más pensadas. Fueron las que sentiste. ${nombre} está acá. Vos estás acá. El universo no necesita más señales.`,

  (nombre) => `¿Cuántas veces dijiste "después" y el después nunca llegó? ${nombre} está disponible ahora. Tu intuición te trajo hasta acá. Escuchala.`,

  (nombre) => `Hay cosas que no se piensan. Se sienten y se hacen. Si ${nombre} te llamó la atención, ya sabés lo que tenés que hacer. La duda es solo miedo disfrazado.`
];

const variacionesColeccionista = [
  (nombre, genero) => `${nombre} no trabaja sol${genero === 'f' ? 'a' : 'o'}. Los guardianes se potencian entre sí. Si ya tenés otros, viene a completar algo que falta. Los que entienden esto no necesitan explicación.`,

  (nombre) => `Ya conocés la magia de tener guardianes. Sabés que cada uno trae algo diferente. ${nombre} viene a sumar, no a reemplazar. A completar la protección que ya empezaste a construir.`,

  (nombre) => `Tu familia de guardianes está esperando a ${nombre}. Ellos ya lo saben. Vos también. Solo falta que se encuentren.`,

  (nombre) => `Cada guardián que sumaste cambió algo. ${nombre} viene a cambiar lo que todavía falta. Tu intuición de coleccionista no falla.`
];

const variacionesRacional = [
  (nombre) => `No vamos a decirte que ${nombre} hace magia. Vamos a decirte que tener algo físico que represente lo que necesitás, cambia cómo te relacionás con eso. La psicología lo llama anclaje. Los antiguos lo llamaban protección. El nombre da igual. Funciona.`,

  (nombre) => `Pensalo así: ${nombre} es un recordatorio tangible de lo que querés atraer a tu vida. Cada vez que lo veas, tu cerebro refuerza esa intención. No es magia. Es neurociencia básica con miles de años de tradición.`,

  (nombre) => `No necesitás creer en duendes para que ${nombre} funcione. Necesitás algo que te recuerde tu intención cada día. Los rituales funcionan porque crean hábitos mentales. ${nombre} es un ritual con forma.`,

  (nombre) => `El efecto placebo funciona incluso cuando sabés que es placebo. Lo dice la ciencia. ${nombre} es un catalizador de intención. Llamalo como quieras. El resultado es el mismo.`
];

/**
 * Genera todos los cierres para un guardián específico
 * Ahora con variaciones aleatorias
 */
export const generarCierres = (nombreGuardian, genero = 'f') => {
  // Elegir variación aleatoria de cada perfil
  const vulnerable = variacionesVulnerable[Math.floor(Math.random() * variacionesVulnerable.length)](nombreGuardian);
  const esceptico = variacionesEsceptico[Math.floor(Math.random() * variacionesEsceptico.length)](nombreGuardian);
  const impulsivo = variacionesImpulsivo[Math.floor(Math.random() * variacionesImpulsivo.length)](nombreGuardian);
  const coleccionista = variacionesColeccionista[Math.floor(Math.random() * variacionesColeccionista.length)](nombreGuardian, genero);
  const racional = variacionesRacional[Math.floor(Math.random() * variacionesRacional.length)](nombreGuardian);

  return {
    vulnerable,
    esceptico,
    impulsivo,
    coleccionista,
    racional,
    default: `Si algo de esto te hizo sentir algo, no lo ignores. El cuerpo reconoce antes que la mente. ${nombreGuardian} desaparece cuando encuentra su hogar verdadero. Una sola vez.`
  };
};

/**
 * Obtiene el cierre para un perfil específico
 */
export const getCierre = (nombreGuardian, perfil = 'default', genero = 'f') => {
  const cierres = generarCierres(nombreGuardian, genero);
  return cierres[perfil] || cierres.default;
};

/**
 * Obtiene 3 cierres alternativos para diferentes perfiles
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
 */
export const detectarPerfil = (comportamiento = {}) => {
  const {
    tiempoEnPagina = 0,
    scrollProfundidad = 0,
    volvioAPagina = false,
    tieneOtrosGuardianes = false,
    fuenteTrafico = ''
  } = comportamiento;

  if (tieneOtrosGuardianes) return 'coleccionista';
  if (tiempoEnPagina < 60 && scrollProfundidad > 80) return 'impulsivo';
  if (volvioAPagina) return 'esceptico';
  if (tiempoEnPagina > 180) return 'vulnerable';
  if (fuenteTrafico === 'organic') return 'racional';

  return 'default';
};
