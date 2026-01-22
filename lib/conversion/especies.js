/**
 * SISTEMA INTELIGENTE DE ESPECIALIZACIÓN
 *
 * Deduce la especialización del guardián basándose en:
 * 1. Palabras clave en el NOMBRE
 * 2. La CATEGORÍA del producto
 *
 * No hay "especies" fijas - cada guardián puede ser de cualquier tipo.
 * Un duende puede ser de protección, abundancia, amor, etc.
 * Una pixie puede ser de sanación, sabiduría, protección, etc.
 */

// Palabras clave que indican especialización específica
const palabrasClave = {
  // === FORTUNA Y SUERTE ===
  fortuna: {
    keywords: ['leprechaun', 'fortuna', 'suerte', 'lucky', 'trebol', 'trébol', 'oro', 'moneda'],
    especialidad: 'Fortuna y buena suerte',
    enfoque: 'Atrae buena suerte, oportunidades inesperadas, golpes de fortuna, casualidades favorables. NO enseña - TRAE suerte.',
    usar: ['suerte', 'fortuna', 'oportunidad', 'casualidad', 'momento perfecto', 'golpe de suerte'],
    noUsar: ['merecimiento', 'bloqueos internos', 'aprender a recibir', 'trabajar en vos']
  },

  // === PROTECCIÓN ===
  proteccion_hogar: {
    keywords: ['hogar', 'casa', 'puerta', 'umbral', 'guardian', 'guardián', 'troll'],
    especialidad: 'Protección del hogar',
    enfoque: 'Cuida la casa, protege el espacio físico, ahuyenta malas energías del hogar.',
    usar: ['hogar', 'casa', 'puerta', 'familia', 'techo', 'paredes'],
    noUsar: []
  },

  proteccion_personal: {
    keywords: ['protector', 'escudo', 'defensor', 'guerrero'],
    especialidad: 'Protección personal',
    enfoque: 'Protege a quien lo lleva, cuida su energía, es escudo contra lo negativo.',
    usar: ['proteger', 'cuidar', 'escudo', 'energía', 'defensa'],
    noUsar: []
  },

  // === ABUNDANCIA ===
  prosperidad: {
    keywords: ['prosperidad', 'dinero', 'riqueza', 'gnomo', 'trabajo', 'negocio'],
    especialidad: 'Prosperidad económica',
    enfoque: 'Atrae estabilidad financiera, ayuda en negocios, protege el dinero.',
    usar: ['prosperidad', 'estabilidad', 'flujo', 'trabajo', 'negocios'],
    noUsar: ['suerte rápida', 'lotería']
  },

  // === AMOR ===
  amor_propio: {
    keywords: ['amor propio', 'autoestima', 'espejo', 'interior'],
    especialidad: 'Amor propio',
    enfoque: 'Ayuda a amarse, a verse con ojos de cariño, a sanar la relación con uno mismo.',
    usar: ['amor propio', 'merecimiento', 'valor', 'belleza interior'],
    noUsar: ['encontrar pareja', 'atraer amor']
  },

  amor_romantico: {
    keywords: ['pareja', 'romántico', 'corazón', 'rosa', 'cupido', 'enamorar'],
    especialidad: 'Amor romántico',
    enfoque: 'Abre el corazón al amor, atrae conexiones genuinas, sana heridas de amor.',
    usar: ['corazón', 'amor', 'conexión', 'ternura', 'entrega'],
    noUsar: ['manipular', 'amarrar', 'obligar']
  },

  // === SANACIÓN ===
  sanacion_emocional: {
    keywords: ['sanador', 'sanación', 'sanar', 'curar', 'elfo', 'herida', 'trauma'],
    especialidad: 'Sanación emocional',
    enfoque: 'Acompaña procesos de sanación, ayuda a soltar el pasado, a cerrar heridas.',
    usar: ['sanar', 'soltar', 'liberar', 'cerrar ciclos', 'perdonar'],
    noUsar: ['rápido', 'instantáneo', 'olvidar']
  },

  calma: {
    keywords: ['calma', 'paz', 'serenidad', 'tranquilidad', 'lavanda', 'relax'],
    especialidad: 'Paz y serenidad',
    enfoque: 'Trae calma, reduce ansiedad, ayuda a encontrar paz interior.',
    usar: ['calma', 'paz', 'serenidad', 'respirar', 'soltar'],
    noUsar: ['agitación', 'urgencia']
  },

  // === SABIDURÍA ===
  sabiduria: {
    keywords: ['sabio', 'sabiduría', 'conocimiento', 'mago', 'brujo', 'anciano', 'maestro'],
    especialidad: 'Sabiduría y guía',
    enfoque: 'Trae claridad, ayuda a tomar decisiones, ilumina el camino.',
    usar: ['claridad', 'camino', 'decisión', 'visión', 'entender'],
    noUsar: ['predecir', 'adivinar']
  },

  intuicion: {
    keywords: ['intuición', 'tercer ojo', 'visión', 'clarividente', 'místico', 'violeta'],
    especialidad: 'Intuición y conexión espiritual',
    enfoque: 'Despierta la intuición, conecta con lo sutil, ayuda a confiar en uno mismo.',
    usar: ['intuición', 'sentir', 'percibir', 'confiar', 'interno'],
    noUsar: ['futuro', 'predecir']
  },

  // === NATURALEZA ===
  naturaleza: {
    keywords: ['bosque', 'planta', 'flor', 'árbol', 'jardín', 'verde', 'tierra'],
    especialidad: 'Conexión con la naturaleza',
    enfoque: 'Conecta con la tierra, trae energía natural, armoniza con los ciclos.',
    usar: ['naturaleza', 'tierra', 'raíces', 'ciclos', 'verde'],
    noUsar: []
  },

  // === ALEGRÍA ===
  alegria: {
    keywords: ['alegría', 'felicidad', 'risa', 'juego', 'niño', 'girasol', 'sol'],
    especialidad: 'Alegría y liviandad',
    enfoque: 'Trae alegría genuina, recuerda jugar, aligera cargas.',
    usar: ['alegría', 'risa', 'jugar', 'liviano', 'luz'],
    noUsar: ['pesado', 'serio', 'grave']
  },

  // === CREATIVIDAD ===
  creatividad: {
    keywords: ['creativo', 'artista', 'musa', 'inspiración', 'arte', 'crear'],
    especialidad: 'Creatividad e inspiración',
    enfoque: 'Despierta la creatividad, trae inspiración, desbloquea el artista interno.',
    usar: ['crear', 'inspiración', 'ideas', 'fluir', 'expresar'],
    noUsar: ['bloqueo', 'crítica']
  },

  // === TRANSFORMACIÓN ===
  transformacion: {
    keywords: ['transformación', 'cambio', 'metamorfosis', 'renacer', 'fénix', 'mariposa', 'hada'],
    especialidad: 'Transformación personal',
    enfoque: 'Acompaña cambios, ayuda a soltar lo viejo, a renacer.',
    usar: ['transformar', 'cambiar', 'soltar', 'nuevo', 'renacer'],
    noUsar: ['quedarse igual', 'resistir']
  }
};

/**
 * Detecta la especialización basándose en nombre + categoría
 */
export const detectarEspecializacion = (nombre, categoria) => {
  const nombreLower = (nombre || '').toLowerCase();
  const categoriaLower = (categoria || '').toLowerCase();
  const textoCompleto = `${nombreLower} ${categoriaLower}`;

  // Buscar coincidencias en palabras clave
  for (const [tipo, config] of Object.entries(palabrasClave)) {
    for (const keyword of config.keywords) {
      if (textoCompleto.includes(keyword.toLowerCase())) {
        return {
          tipo,
          ...config
        };
      }
    }
  }

  // Si no hay match específico, usar la categoría como fallback
  const fallbackPorCategoria = {
    'protección': palabrasClave.proteccion_personal,
    'proteccion': palabrasClave.proteccion_personal,
    'abundancia': palabrasClave.prosperidad,
    'amor': palabrasClave.amor_romantico,
    'sanación': palabrasClave.sanacion_emocional,
    'sanacion': palabrasClave.sanacion_emocional,
    'sabiduría': palabrasClave.sabiduria,
    'sabiduria': palabrasClave.sabiduria
  };

  const fallback = fallbackPorCategoria[categoriaLower];
  if (fallback) {
    return {
      tipo: 'categoria_generica',
      ...fallback
    };
  }

  // Sin especialización específica
  return null;
};

/**
 * Genera instrucciones para el prompt basadas en nombre + categoría
 */
export const getInstruccionesEspecie = (especie, nombre, categoria) => {
  const especializacion = detectarEspecializacion(nombre, categoria);

  if (!especializacion) {
    return `Enfocate en la categoría: ${categoria}`;
  }

  let instrucciones = `
## ESPECIALIZACIÓN DETECTADA (OBLIGATORIO)

**Este guardián es de: ${especializacion.especialidad}**

${especializacion.enfoque}

**Palabras/conceptos que DEBÉS usar:** ${especializacion.usar.join(', ')}
`;

  if (especializacion.noUsar && especializacion.noUsar.length > 0) {
    instrucciones += `
**NO uses estos conceptos (no aplican a este guardián):** ${especializacion.noUsar.join(', ')}
`;
  }

  return instrucciones;
};

/**
 * Exporta la configuración para referencia
 */
export const getTodasLasEspecializaciones = () => Object.keys(palabrasClave);

export default { detectarEspecializacion, getInstruccionesEspecie };
