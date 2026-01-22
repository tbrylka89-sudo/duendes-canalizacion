/**
 * SISTEMA DE ESPECIALIZACIONES COMPLETO
 *
 * Cada especialización tiene:
 * - dolor: Qué problema tiene quien busca esto
 * - espejo: Cómo se ve reflejada la persona
 * - validacion: Cómo validamos su experiencia
 * - solucion: Qué hace el guardián (VERBO DE ACCIÓN)
 * - urgencia: Por qué actuar ahora
 * - keywords: Para detección automática
 */

export const especializaciones = {
  fortuna: {
    nombre: 'Fortuna y Suerte',
    dolor: [
      'Sentís que la suerte te esquiva',
      'Ves oportunidades pasar de largo mientras otros las atrapan',
      'Siempre llegás un paso tarde',
      'Parece que el universo favorece a todos menos a vos',
      'Las coincidencias buenas nunca son para vos',
      'Te preparás, te esforzás, pero el golpe de suerte nunca llega'
    ],
    espejo: [
      '¿Cuántas veces viste a alguien menos preparado llevarse lo que vos merecías?',
      'Hay personas que parecen tener un imán para las oportunidades',
      '¿Te pasó de estar en el lugar equivocado siempre?',
      'Algunos nacen con estrella. Otros miramos desde afuera.'
    ],
    validacion: [
      'No es tu imaginación. Hay personas a las que la suerte les llega más fácil.',
      'No estás loca por sentir que algo te bloquea.',
      'La mala racha existe. Y la tuya ya duró demasiado.'
    ],
    solucion: 'TRAE suerte, ATRAE oportunidades, ABRE puertas que estaban cerradas',
    accion: 'trae buena fortuna',
    urgencia: 'Los momentos de suerte no esperan. Pasan una vez.',
    noUsar: ['proteger', 'cuidar', 'sanar', 'no saber decir que no', 'cargar con todo', 'dar sin recibir'],
    keywords: ['leprechaun', 'fortuna', 'suerte', 'trébol', 'oro', 'moneda', 'lucky']
  },

  proteccion: {
    nombre: 'Protección',
    dolor: [
      'Cargás con el peso de todos',
      'No sabés decir que no',
      'Te drenás cuidando a otros',
      'Das todo y no recibís nada',
      'Tu energía se agota protegiendo a los demás',
      'Nadie te cuida a vos'
    ],
    espejo: [
      'Hay personas que cargan con más de lo que les corresponde',
      '¿Cuántas veces dijiste "estoy bien" mientras te caías por dentro?',
      'Proteger a otros se convirtió en tu forma de existir',
      '¿Quién te protege a vos mientras protegés a todos?'
    ],
    validacion: [
      'No exagerás. El peso que llevás es real.',
      'Estar cansada no es debilidad. Es el resultado de dar sin parar.',
      'Merecés que alguien cuide de vos por una vez.'
    ],
    solucion: 'PROTEGE tu energía, CUIDA de vos, es tu ESCUDO invisible',
    accion: 'protege y cuida',
    urgencia: 'Tu energía tiene límite. Si no la cuidás vos, nadie lo va a hacer.',
    noUsar: ['suerte', 'fortuna', 'oportunidad', 'dinero', 'amor romántico'],
    keywords: ['protector', 'escudo', 'guardián', 'defensor', 'guerrero', 'vikingo']
  },

  amor_romantico: {
    nombre: 'Amor',
    dolor: [
      'Tenés el corazón cerrado',
      'Te cuesta confiar después de que te lastimaron',
      'El amor siempre termina doliéndote',
      'Atraés personas que no te valoran',
      'Sentís que no merecés amor verdadero',
      'Te da miedo abrir el corazón de nuevo'
    ],
    espejo: [
      'Hay personas que aman con todo y terminan con nada',
      '¿Cuántas veces prometiste no volver a enamorarte?',
      'Cerraste el corazón para que no te lastimen. Pero también dejaste afuera lo bueno.',
      'El amor te enseñó a tener miedo, no a confiar.'
    ],
    validacion: [
      'Protegerte no está mal. Pero vivir cerrada tampoco es vida.',
      'Las heridas de amor son las que más tardan en sanar.',
      'No es tu culpa haber confiado en quien no lo merecía.'
    ],
    solucion: 'ABRE el corazón, ATRAE amor genuino, SANA heridas del pasado',
    accion: 'abre el corazón al amor',
    urgencia: 'El amor no espera para siempre. Y vos tampoco deberías.',
    noUsar: ['suerte', 'dinero', 'protección', 'trabajo', 'fortuna'],
    keywords: ['amor', 'corazón', 'rosa', 'pareja', 'romántico', 'cupido']
  },

  amor_propio: {
    nombre: 'Amor Propio',
    dolor: [
      'No te querés como deberías',
      'Te criticás más de lo que te celebrás',
      'Sentís que no sos suficiente',
      'Te comparás con otros y siempre perdés',
      'No te perdonás errores del pasado',
      'Te cuesta mirarte al espejo con cariño'
    ],
    espejo: [
      'Hay personas que son su peor enemigo',
      '¿Cuántas veces te dijiste cosas que nunca le dirías a nadie más?',
      'Te exigís perfección pero no te das ni un poco de compasión.',
      'Buscás aprobación afuera porque adentro solo hay crítica.'
    ],
    validacion: [
      'No naciste odiándote. Te lo enseñaron.',
      'Merecés el mismo amor que le das a otros.',
      'Ser dura con vos misma no te hace mejor. Te hace miserable.'
    ],
    solucion: 'ENSEÑA a amarte, REFLEJA tu valor real, RECUERDA quién sos',
    accion: 'despierta el amor propio',
    urgencia: 'No podés dar amor si tu copa está vacía.',
    noUsar: ['suerte', 'dinero', 'pareja', 'protección de otros'],
    keywords: ['autoestima', 'espejo', 'amor propio', 'interior', 'valor']
  },

  sanacion: {
    nombre: 'Sanación',
    dolor: [
      'No podés soltar el pasado',
      'La herida sigue abierta aunque pasó tiempo',
      'El dolor no se va por más que lo intentes',
      'Algo se rompió adentro y no sabés cómo arreglarlo',
      'Cargás con algo que ya no te pertenece',
      'El trauma te define más que tus logros'
    ],
    espejo: [
      'Hay personas que siguen sangrando por heridas viejas',
      '¿Cuánto tiempo vas a cargar con algo que ya pasó?',
      'El pasado terminó pero vos seguís ahí.',
      'Perdonar no es olvidar. Es dejar de cargar el peso.'
    ],
    validacion: [
      'El dolor que sentís es real. No importa cuánto tiempo pasó.',
      'Sanar no es "superarlo". Es aprender a vivir con la cicatriz.',
      'No estás rota. Estás lastimada. Y eso se puede sanar.'
    ],
    solucion: 'SANA heridas profundas, AYUDA a soltar, ACOMPAÑA el proceso',
    accion: 'acompaña la sanación',
    urgencia: 'Las heridas que no se atienden se infectan. Es hora de sanar.',
    noUsar: ['suerte', 'dinero', 'amor romántico', 'protección'],
    keywords: ['sanador', 'sanar', 'herida', 'trauma', 'soltar', 'curar', 'elfo']
  },

  calma: {
    nombre: 'Paz y Serenidad',
    dolor: [
      'Tu mente no para nunca',
      'La ansiedad te come por dentro',
      'No podés descansar aunque estés agotada',
      'Vivís en modo alerta permanente',
      'El ruido interno no te deja en paz',
      'Olvidaste lo que es sentirte tranquila'
    ],
    espejo: [
      'Hay personas que viven corriendo aunque estén quietas',
      '¿Cuándo fue la última vez que tu mente estuvo en silencio?',
      'El descanso se convirtió en un lujo que no te das.',
      'Dormís pero no descansás. Parás pero no frenás.'
    ],
    validacion: [
      'No es debilidad necesitar paz. Es humanidad.',
      'Tu sistema nervioso está gritando. Es hora de escucharlo.',
      'Merecés un respiro. Merecés silencio interno.'
    ],
    solucion: 'TRAE calma, AQUIETA la mente, REGALA paz interior',
    accion: 'trae paz y serenidad',
    urgencia: 'El cuerpo que no descansa, colapsa.',
    noUsar: ['suerte', 'dinero', 'amor', 'acción', 'oportunidades'],
    keywords: ['calma', 'paz', 'serenidad', 'tranquilidad', 'lavanda', 'relax', 'ansiedad']
  },

  abundancia: {
    nombre: 'Prosperidad',
    dolor: [
      'El dinero nunca alcanza',
      'Trabajás mucho y ganás poco',
      'La estabilidad económica parece imposible',
      'Vivís con miedo a no llegar a fin de mes',
      'Sentís que la prosperidad es para otros',
      'Te esforzás pero los resultados no llegan'
    ],
    espejo: [
      'Hay personas que trabajan el doble y ganan la mitad',
      '¿Cuántas veces calculaste si llegás al mes?',
      'El dinero entra y se va. Nunca queda.',
      'Otros prosperan con menos esfuerzo. Vos remás en dulce de leche.'
    ],
    validacion: [
      'No es que no te esforzás. Es que el sistema está roto.',
      'Merecer abundancia no tiene que ver con cuánto trabajás.',
      'La escasez que sentís es real. Y podés cambiarla.'
    ],
    solucion: 'ATRAE prosperidad, ABRE el flujo del dinero, DESBLOQUEA la abundancia',
    accion: 'atrae prosperidad',
    urgencia: 'La abundancia no espera. Está ahí, solo necesitás abrirte a recibirla.',
    noUsar: ['amor', 'sanación', 'protección personal', 'calma'],
    keywords: ['prosperidad', 'dinero', 'riqueza', 'trabajo', 'negocio', 'gnomo', 'abundancia']
  },

  sabiduria: {
    nombre: 'Sabiduría y Claridad',
    dolor: [
      'No sabés qué decisión tomar',
      'Te sentís perdida sin rumbo claro',
      'La confusión te paraliza',
      'Dudás de todo, incluso de vos misma',
      'Necesitás guía pero no sabés a quién escuchar',
      'El camino se bifurca y no sabés cuál elegir'
    ],
    espejo: [
      'Hay personas que viven en la encrucijada permanente',
      '¿Cuántas decisiones postergaste por miedo a equivocarte?',
      'La duda se convirtió en tu estado natural.',
      'Pedís consejos a todos porque no confiás en tu voz interna.'
    ],
    validacion: [
      'No es indecisión. Es miedo a equivocarte. Y es válido.',
      'La claridad no viene de afuera. Pero a veces necesitás ayuda para verla adentro.',
      'Dudar es humano. Quedarse paralizada, no tiene que ser tu destino.'
    ],
    solucion: 'ILUMINA el camino, TRAE claridad, GUÍA decisiones importantes',
    accion: 'trae claridad y guía',
    urgencia: 'Las decisiones no tomadas también tienen consecuencias.',
    noUsar: ['suerte', 'dinero', 'amor', 'protección física'],
    keywords: ['sabio', 'sabiduría', 'claridad', 'mago', 'brujo', 'maestro', 'guía', 'decisión']
  },

  transformacion: {
    nombre: 'Transformación',
    dolor: [
      'Querés cambiar pero no sabés cómo',
      'Sentís que estás estancada',
      'La vida que tenés no es la que querés',
      'Sabés que hay algo más pero no lo alcanzás',
      'Te da miedo soltar lo conocido',
      'Estás lista para renacer pero no sabés por dónde empezar'
    ],
    espejo: [
      'Hay personas que viven vidas que no eligieron',
      '¿Cuánto tiempo vas a seguir siendo quien no querés ser?',
      'Sentís que hay una versión mejor de vos esperando salir.',
      'El cambio te llama pero el miedo te frena.'
    ],
    validacion: [
      'Querer cambiar no es ingratitud. Es evolución.',
      'La oruga no pide permiso para ser mariposa.',
      'Estás lista. El único permiso que necesitás es el tuyo.'
    ],
    solucion: 'ACOMPAÑA la transformación, AYUDA a soltar lo viejo, GUÍA el renacimiento',
    accion: 'acompaña tu transformación',
    urgencia: 'El momento del cambio es ahora. Mañana es excusa.',
    noUsar: ['suerte', 'dinero', 'protección', 'quedarse igual'],
    keywords: ['transformación', 'cambio', 'mariposa', 'fénix', 'renacer', 'hada', 'metamorfosis']
  },

  alegria: {
    nombre: 'Alegría',
    dolor: [
      'Olvidaste cómo se siente la alegría genuina',
      'Sonreís por compromiso, no por felicidad',
      'La vida se volvió gris',
      'Extrañás la versión de vos que se reía de verdad',
      'La liviandad se perdió en algún momento',
      'Cargás un peso invisible que te roba la sonrisa'
    ],
    espejo: [
      'Hay personas que se olvidaron de jugar',
      '¿Cuándo fue la última vez que te reíste sin razón?',
      'La seriedad se convirtió en tu escudo.',
      'De chica soñabas con otra vida. La adulta la enterró.'
    ],
    validacion: [
      'La alegría no es un lujo. Es una necesidad.',
      'No es inmaduro querer ser feliz.',
      'Merecés liviandad. Merecés risas. Merecés luz.'
    ],
    solucion: 'TRAE alegría genuina, RECUERDA cómo jugar, DEVUELVE la luz',
    accion: 'trae alegría y liviandad',
    urgencia: 'La vida pasa. No merece ser vivida en gris.',
    noUsar: ['dolor', 'trauma', 'pesado', 'serio', 'grave'],
    keywords: ['alegría', 'felicidad', 'risa', 'juego', 'girasol', 'sol', 'niño', 'luz']
  }
};

/**
 * Genera instrucciones completas para el prompt basadas en la especialización
 */
export const getInstruccionesEspecializacion = (especializacionId) => {
  const esp = especializaciones[especializacionId];

  if (!esp) {
    return null;
  }

  return `
## ESPECIALIZACIÓN: ${esp.nombre.toUpperCase()}

### EL DOLOR DE QUIEN BUSCA ESTO:
${esp.dolor.map(d => `- ${d}`).join('\n')}

### FRASES DE ESPEJO (elegí una para empezar):
${esp.espejo.map(e => `- "${e}"`).join('\n')}

### VALIDACIÓN (usá alguna):
${esp.validacion.map(v => `- "${v}"`).join('\n')}

### QUÉ HACE EL GUARDIÁN:
${esp.solucion}
El guardián ${esp.accion.toUpperCase()} - no "enseña", no "ayuda a descubrir". HACE.

### URGENCIA:
${esp.urgencia}

### PALABRAS/CONCEPTOS PROHIBIDOS (no aplican a esta especialización):
${esp.noUsar.join(', ')}

IMPORTANTE: Toda la historia debe girar en torno a este dolor específico y esta solución específica. NO uses dolores de otras especializaciones.
`;
};

/**
 * Detecta especialización por keywords
 */
export const detectarEspecializacionPorKeywords = (texto) => {
  const textoLower = texto.toLowerCase();

  for (const [id, esp] of Object.entries(especializaciones)) {
    for (const keyword of esp.keywords || []) {
      if (textoLower.includes(keyword.toLowerCase())) {
        return id;
      }
    }
  }

  return null;
};

/**
 * Obtiene todas las especializaciones disponibles
 */
export const getEspecializacionesDisponibles = () => {
  return Object.entries(especializaciones).map(([id, esp]) => ({
    id,
    nombre: esp.nombre,
    accion: esp.accion
  }));
};

export default especializaciones;
