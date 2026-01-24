/**
 * GENERADOR DE TAGS PROFESIONAL
 * Sistema inteligente para generar tags de producto optimizados para SEO
 *
 * @module lib/seo/tags-generator
 */

// ═══════════════════════════════════════════════════════════════
// TAXONOMÍA DE TAGS COMPLETA
// ═══════════════════════════════════════════════════════════════

// Tags base por tipo de guardián
const TAGS_POR_TIPO = {
  duende: [
    'duende', 'duende artesanal', 'duende protector', 'duende magico',
    'duende hecho a mano', 'duende uruguay', 'duende decorativo'
  ],
  pixie: [
    'pixie', 'pixie magica', 'pixie artesanal', 'hada', 'ser de luz',
    'pixie decorativa', 'pixie uruguay'
  ],
  bruja: [
    'bruja', 'bruja buena', 'bruja protectora', 'brujita', 'hechicera',
    'bruja artesanal', 'bruja decorativa'
  ],
  mago: [
    'mago', 'mago protector', 'hechicero', 'mago artesanal',
    'mago decorativo', 'mago sabio'
  ],
  leprechaun: [
    'leprechaun', 'duende irlandes', 'leprechaun artesanal',
    'leprechaun abundancia', 'leprechaun suerte'
  ],
  gnomo: [
    'gnomo', 'gnomo jardin', 'gnomo protector', 'gnomo artesanal',
    'gnomo decorativo', 'gnomo hogar'
  ],
  guardian: [
    'guardian', 'guardian espiritual', 'guardian protector',
    'guardian artesanal', 'guardian magico'
  ]
};

// Tags por categoría/propósito
const TAGS_POR_CATEGORIA = {
  proteccion: [
    'proteccion', 'proteccion hogar', 'proteccion energetica',
    'amuleto proteccion', 'escudo energetico', 'proteccion espiritual',
    'limpiar energias', 'proteger casa', 'proteccion familiar'
  ],
  abundancia: [
    'abundancia', 'prosperidad', 'abundancia dinero', 'atraer dinero',
    'amuleto prosperidad', 'riqueza', 'exito economico',
    'desbloquear abundancia', 'energia abundancia'
  ],
  amor: [
    'amor', 'amor propio', 'autoamor', 'relaciones',
    'atraer amor', 'sanacion corazon', 'energia rosa',
    'amor sano', 'perdonar', 'abrir corazon'
  ],
  sanacion: [
    'sanacion', 'sanacion espiritual', 'sanacion emocional',
    'bienestar', 'equilibrio', 'paz interior',
    'energia curativa', 'sanacion alma', 'liberacion emocional'
  ],
  sabiduria: [
    'sabiduria', 'sabiduria ancestral', 'intuicion', 'claridad mental',
    'guia espiritual', 'tercero ojo', 'meditacion',
    'conexion espiritual', 'despertar'
  ],
  salud: [
    'salud', 'bienestar', 'energia vital', 'vitalidad',
    'equilibrio cuerpo', 'salud holistica', 'armonia'
  ]
};

// Tags por cristales/accesorios
const TAGS_POR_CRISTAL = {
  cuarzo: ['cuarzo', 'cuarzo cristal', 'cristal cuarzo', 'amplificador energia'],
  'cuarzo rosa': ['cuarzo rosa', 'cristal amor', 'piedra amor', 'rosa cuarzo'],
  amatista: ['amatista', 'piedra amatista', 'cristal morado', 'proteccion espiritual'],
  turmalina: ['turmalina negra', 'turmalina', 'proteccion turmalina', 'piedra negra'],
  citrino: ['citrino', 'piedra citrino', 'cristal abundancia', 'piedra exito'],
  obsidiana: ['obsidiana', 'obsidiana negra', 'espejo alma', 'proteccion obsidiana'],
  labradorita: ['labradorita', 'piedra magica', 'cristal transformacion'],
  pirita: ['pirita', 'oro de locos', 'piedra abundancia', 'atraccion dinero'],
  jade: ['jade', 'piedra jade', 'prosperidad jade', 'suerte jade'],
  lapislazuli: ['lapislazuli', 'piedra sabiduria', 'tercer ojo', 'cristal azul'],
  selenita: ['selenita', 'limpieza energetica', 'cristal blanco', 'purificacion'],
  amazonita: ['amazonita', 'piedra esperanza', 'cristal verde', 'armonia'],
  rodonita: ['rodonita', 'piedra perdon', 'sanacion emocional'],
  aventurina: ['aventurina', 'piedra suerte', 'prosperidad', 'cristal verde']
};

// Tags de características
const TAGS_CARACTERISTICAS = {
  artesanal: [
    'hecho a mano', 'artesanal', 'handmade', 'pieza unica',
    'artesania', 'arte espiritual', 'exclusivo'
  ],
  origen: [
    'uruguay', 'piriapolis', 'hecho en uruguay', 'artesano uruguayo',
    'producto uruguayo', 'artesania uruguaya'
  ],
  regalo: [
    'regalo espiritual', 'regalo especial', 'regalo unico',
    'regalo significativo', 'regalo magico', 'regalo con intencion'
  ],
  decoracion: [
    'decoracion espiritual', 'decoracion hogar', 'altar',
    'decoracion mistica', 'objeto decorativo', 'adorno hogar'
  ],
  coleccion: [
    'coleccionable', 'pieza coleccion', 'edicion limitada',
    'coleccion guardianes', 'figura coleccion'
  ]
};

// Tags de temporada/ocasión
const TAGS_OCASION = {
  navidad: ['regalo navidad', 'navidad magica', 'navidad espiritual'],
  anio_nuevo: ['año nuevo', 'nuevo comienzo', 'propósitos'],
  san_valentin: ['regalo san valentin', 'regalo pareja', 'amor'],
  dia_madre: ['regalo dia madre', 'regalo mama', 'amor maternal'],
  cumpleanos: ['regalo cumpleaños', 'regalo especial', 'celebracion']
};

// ═══════════════════════════════════════════════════════════════
// FUNCIONES PRINCIPALES
// ═══════════════════════════════════════════════════════════════

/**
 * Genera tags inteligentes para un producto
 * @param {Object} producto - Datos del producto
 * @returns {Object} Tags organizados y lista final
 */
export function generarTagsProducto(producto) {
  const {
    nombre = '',
    tipo = 'guardian',
    categoria = 'proteccion',
    descripcion = '',
    accesorios = [],
    esUnico = true,
    precio = 0
  } = producto;

  const tipoNorm = tipo.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const categoriaNorm = categoria.toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace('protección', 'proteccion')
    .replace('sanación', 'sanacion')
    .replace('sabiduría', 'sabiduria');

  const tags = {
    tipo: [],
    categoria: [],
    cristales: [],
    caracteristicas: [],
    keywords: []
  };

  // 1. Tags por tipo
  const tagsDelTipo = TAGS_POR_TIPO[tipoNorm] || TAGS_POR_TIPO.guardian;
  tags.tipo = tagsDelTipo.slice(0, 5);

  // 2. Tags por categoría
  const tagsDeLaCategoria = TAGS_POR_CATEGORIA[categoriaNorm] || TAGS_POR_CATEGORIA.proteccion;
  tags.categoria = tagsDeLaCategoria.slice(0, 6);

  // 3. Tags por cristales/accesorios
  const accesoriosStr = (Array.isArray(accesorios) ? accesorios.join(' ') : (accesorios || '')) + ' ' + descripcion;
  const accesoriosLower = accesoriosStr.toLowerCase();

  for (const [cristal, tagsCristal] of Object.entries(TAGS_POR_CRISTAL)) {
    if (accesoriosLower.includes(cristal)) {
      tags.cristales.push(...tagsCristal.slice(0, 2));
    }
  }
  tags.cristales = [...new Set(tags.cristales)].slice(0, 6);

  // 4. Tags de características
  tags.caracteristicas = [
    ...TAGS_CARACTERISTICAS.artesanal.slice(0, 3),
    ...TAGS_CARACTERISTICAS.origen.slice(0, 2),
    ...TAGS_CARACTERISTICAS.regalo.slice(0, 2)
  ];

  if (esUnico) {
    tags.caracteristicas.push('pieza unica', 'edicion limitada');
  }

  // 5. Tags de keywords long-tail
  tags.keywords = [
    `${tipoNorm} ${categoriaNorm}`,
    `${tipoNorm} artesanal ${categoriaNorm}`,
    `comprar ${tipoNorm}`,
    `${tipoNorm} para ${categoriaNorm}`,
    `amuleto ${categoriaNorm}`,
    `figura ${categoriaNorm}`,
    `regalo ${categoriaNorm}`
  ];

  // 6. Tags del nombre (palabras significativas)
  const palabrasNombre = nombre.toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .split(/\s+/)
    .filter(p => p.length > 3 && !['para', 'con', 'del', 'los', 'las'].includes(p));

  if (palabrasNombre.length > 0) {
    tags.keywords.push(palabrasNombre[0]); // Primera palabra significativa como tag
  }

  // Combinar y deduplicar
  const todosLosTags = [
    ...tags.tipo,
    ...tags.categoria,
    ...tags.cristales,
    ...tags.caracteristicas,
    ...tags.keywords
  ];

  const tagsUnicos = [...new Set(todosLosTags)]
    .filter(t => t && t.length > 2)
    .slice(0, 25); // WooCommerce maneja bien hasta 30 tags

  return {
    porCategoria: tags,
    lista: tagsUnicos,
    cantidad: tagsUnicos.length,
    principales: tagsUnicos.slice(0, 10),
    secundarios: tagsUnicos.slice(10)
  };
}

/**
 * Genera tags con formato para WooCommerce API
 * @param {Object} producto - Datos del producto
 * @returns {Array} Array de objetos {name: "tag"} para WooCommerce
 */
export function generarTagsWooCommerce(producto) {
  const { lista } = generarTagsProducto(producto);
  return lista.map(tag => ({ name: tag }));
}

/**
 * Extrae colores del nombre/descripción para tags
 * @param {string} texto - Texto a analizar
 * @returns {Array} Tags de colores encontrados
 */
export function extraerTagsColores(texto) {
  const colores = {
    'rojo': ['rojo', 'color rojo', 'energia roja'],
    'azul': ['azul', 'color azul', 'energia azul'],
    'verde': ['verde', 'color verde', 'energia verde'],
    'morado': ['morado', 'violeta', 'purpura', 'color morado'],
    'rosa': ['rosa', 'rosado', 'color rosa'],
    'dorado': ['dorado', 'oro', 'color dorado'],
    'plateado': ['plateado', 'plata', 'color plateado'],
    'negro': ['negro', 'color negro', 'obsidiana'],
    'blanco': ['blanco', 'color blanco', 'cristalino'],
    'turquesa': ['turquesa', 'aguamarina', 'color turquesa'],
    'naranja': ['naranja', 'color naranja', 'ambar']
  };

  const textoLower = texto.toLowerCase();
  const tagsColores = [];

  for (const [color, tags] of Object.entries(colores)) {
    if (textoLower.includes(color)) {
      tagsColores.push(...tags.slice(0, 2));
    }
  }

  return [...new Set(tagsColores)];
}

/**
 * Genera keywords secundarias (focus keywords adicionales) para RankMath
 * @param {Object} producto - Datos del producto
 * @returns {string} Keywords secundarias separadas por coma
 */
export function generarKeywordsSecundarias(producto) {
  const { tipo = 'guardian', categoria = 'proteccion', nombre = '' } = producto;

  const tipoNorm = tipo.toLowerCase();
  const categoriaNorm = categoria.toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

  const keywords = [
    `${tipoNorm} ${categoriaNorm}`,
    `${tipoNorm} artesanal`,
    `amuleto ${categoriaNorm}`,
    `${tipoNorm} uruguay`,
    `comprar ${tipoNorm}`
  ];

  // Agregar nombre si es significativo
  const primeraPalabraNombre = nombre.split(' ')[0];
  if (primeraPalabraNombre && primeraPalabraNombre.length > 3) {
    keywords.push(primeraPalabraNombre.toLowerCase());
  }

  return keywords.slice(0, 5).join(', ');
}

/**
 * Analiza descripción para extraer tags adicionales
 * @param {string} descripcion - Descripción del producto
 * @returns {Array} Tags extraídos de la descripción
 */
export function extraerTagsDescripcion(descripcion) {
  if (!descripcion || descripcion.length < 50) return [];

  const patronesInteres = [
    // Emociones/estados
    { patron: /ansiedad|ansioso/i, tags: ['calmar ansiedad', 'paz mental'] },
    { patron: /estres|estrés/i, tags: ['reducir estres', 'relajacion'] },
    { patron: /miedo|temor/i, tags: ['superar miedos', 'coraje'] },
    { patron: /tristeza|triste/i, tags: ['alegria', 'superar tristeza'] },
    { patron: /soledad/i, tags: ['compania espiritual', 'conexion'] },
    { patron: /insomnio|dormir/i, tags: ['buen dormir', 'suenos'] },

    // Propósitos
    { patron: /negocio|empresa|trabajo/i, tags: ['exito laboral', 'negocios'] },
    { patron: /familia|hogar/i, tags: ['armonia familiar', 'hogar protegido'] },
    { patron: /pareja|relacion/i, tags: ['amor pareja', 'relacion sana'] },
    { patron: /hijo|hija|niño/i, tags: ['proteccion hijos', 'familia'] },
    { patron: /mudanza|casa nueva/i, tags: ['bendecir hogar', 'nuevo hogar'] },

    // Espirituales
    { patron: /meditacion|meditar/i, tags: ['meditacion', 'practica espiritual'] },
    { patron: /chakra/i, tags: ['chakras', 'equilibrio energetico'] },
    { patron: /aura/i, tags: ['limpieza aura', 'aura'] },
    { patron: /karma/i, tags: ['limpieza karmica', 'liberacion'] },
    { patron: /ritual/i, tags: ['rituales', 'practica magica'] }
  ];

  const tagsEncontrados = [];

  for (const { patron, tags } of patronesInteres) {
    if (patron.test(descripcion)) {
      tagsEncontrados.push(...tags);
    }
  }

  return [...new Set(tagsEncontrados)];
}

// ═══════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════

export default {
  generarTagsProducto,
  generarTagsWooCommerce,
  extraerTagsColores,
  generarKeywordsSecundarias,
  extraerTagsDescripcion,
  TAGS_POR_TIPO,
  TAGS_POR_CATEGORIA,
  TAGS_POR_CRISTAL,
  TAGS_CARACTERISTICAS
};
