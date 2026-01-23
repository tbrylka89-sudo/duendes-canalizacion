/**
 * Parser inteligente para texto libre de productos
 * Extrae datos estructurados de texto escrito por el usuario
 */

// Especies disponibles
const ESPECIES = [
  'pixie', 'duende', 'duenda', 'elfo', 'elfa', 'bruja', 'brujo',
  'vikingo', 'vikinga', 'leprechaun', 'gnomo', 'gnoma', 'hada',
  'mago', 'maga', 'chaman', 'chamana', 'druida', 'ninfa', 'fauno'
];

// Cristales conocidos
const CRISTALES = [
  'amatista', 'citrino', 'cuarzo', 'cuarzo rosa', 'cuarzo blanco',
  'turmalina', 'turmalina negra', 'fluorita', 'sodalita', 'pirita',
  'ágata', 'agata', 'piedra luna', 'ojo de tigre', 'obsidiana',
  'lapislázuli', 'lapislazuli', 'jade', 'malaquita', 'aventurina',
  'selenita', 'labradorita', 'amazonita', 'rodocrosita', 'granate'
];

// Mapeo de palabras clave a categorías
const CATEGORIAS_KEYWORDS = {
  'Protección': [
    'protege', 'protección', 'proteccion', 'guardian', 'guardián',
    'cuida', 'defensor', 'escudo', 'blindaje', 'amparo', 'refugio'
  ],
  'Abundancia': [
    'abundancia', 'dinero', 'prosperidad', 'fortuna', 'suerte',
    'riqueza', 'éxito', 'exito', 'negocios', 'trabajo', 'oportunidades'
  ],
  'Amor': [
    'amor', 'corazón', 'corazon', 'pareja', 'vínculos', 'vinculos',
    'relaciones', 'autoestima', 'self-love', 'romantico', 'romántico'
  ],
  'Sanación': [
    'sanación', 'sanacion', 'sanar', 'salud', 'curar', 'curación',
    'curacion', 'bienestar', 'equilibrio', 'armonía', 'armonia'
  ],
  'Sabiduría': [
    'sabiduría', 'sabiduria', 'sabio', 'sabia', 'conocimiento',
    'claridad', 'intuición', 'intuicion', 'guía', 'guia', 'mentor'
  ],
  'Viajeros': [
    'viajero', 'viajera', 'mochila', 'aventura', 'camino', 'viaje',
    'explorador', 'nómade', 'nomade', 'peregrino', 'horizonte'
  ],
  'Naturaleza': [
    'bosque', 'naturaleza', 'plantas', 'hierbas', 'hongos', 'setas',
    'raíces', 'raices', 'tierra', 'verde', 'micelios', 'chamán', 'chaman'
  ]
};

// Tamaños por palabras clave
const TAMANOS_KEYWORDS = {
  mini: { tamano: 'mini', cm: 8 },
  pequeño: { tamano: 'pequeno', cm: 11 },
  pequeno: { tamano: 'pequeno', cm: 11 },
  chico: { tamano: 'pequeno', cm: 11 },
  mediano: { tamano: 'mediano_especial', cm: 18 },
  grande: { tamano: 'grande', cm: 25 },
  gigante: { tamano: 'gigante', cm: 35 }
};

/**
 * Parsea texto libre y extrae datos estructurados
 * @param {string} texto - Texto escrito por el usuario
 * @returns {Object} Datos extraídos
 */
export function parsearTextoLibre(texto) {
  if (!texto || typeof texto !== 'string') {
    return {
      nombre: null,
      especie: null,
      genero: null,
      categoria: null,
      tamano: null,
      tamanoCm: null,
      accesorios: [],
      cristales: [],
      confianza: {} // Indica qué tan seguro está el parser de cada campo
    };
  }

  const textoOriginal = texto;
  const textoLower = texto.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  const resultado = {
    nombre: null,
    especie: null,
    genero: null,
    categoria: null,
    tamano: null,
    tamanoCm: null,
    accesorios: [],
    cristales: [],
    confianza: {}
  };

  // === DETECTAR NOMBRE ===
  // Patrones: "se llama X", "nombre: X", "es X (especie)", "X," al inicio
  const patronesNombre = [
    /se\s+llama\s+["']?([A-ZÁÉÍÓÚÑ][a-záéíóúñ]+)["']?/i,
    /nombre[:\s]+["']?([A-ZÁÉÍÓÚÑ][a-záéíóúñ]+)["']?/i,
    /^["']?([A-ZÁÉÍÓÚÑ][a-záéíóúñ]+)["']?[,\s]/,
    /es\s+["']?([A-ZÁÉÍÓÚÑ][a-záéíóúñ]+)["']?\s+(?:un|una)/i
  ];

  for (const patron of patronesNombre) {
    const match = textoOriginal.match(patron);
    if (match && match[1] && !ESPECIES.includes(match[1].toLowerCase())) {
      resultado.nombre = match[1];
      resultado.confianza.nombre = 'alto';
      break;
    }
  }

  // === DETECTAR TAMAÑO EN CM ===
  const patronCm = /(\d{1,2})\s*(?:cm|centimetros|centímetros)/i;
  const matchCm = texto.match(patronCm);
  if (matchCm) {
    const cm = parseInt(matchCm[1]);
    if (cm >= 5 && cm <= 50) {
      resultado.tamanoCm = cm;
      resultado.confianza.tamanoCm = 'alto';

      // Inferir tamaño desde cm
      if (cm <= 10) resultado.tamano = 'mini';
      else if (cm <= 13) resultado.tamano = 'pequeno';
      else if (cm <= 20) resultado.tamano = 'mediano_especial';
      else if (cm <= 30) resultado.tamano = 'grande';
      else resultado.tamano = 'gigante';
    }
  }

  // Si no hay cm, buscar palabras de tamaño
  if (!resultado.tamanoCm) {
    for (const [palabra, datos] of Object.entries(TAMANOS_KEYWORDS)) {
      if (textoLower.includes(palabra)) {
        resultado.tamano = datos.tamano;
        resultado.tamanoCm = datos.cm;
        resultado.confianza.tamanoCm = 'medio';
        break;
      }
    }
  }

  // === DETECTAR ESPECIE ===
  for (const especie of ESPECIES) {
    // Buscar la especie con word boundaries
    const regex = new RegExp(`\\b${especie}\\b`, 'i');
    if (regex.test(textoLower)) {
      resultado.especie = especie;
      resultado.confianza.especie = 'alto';

      // Inferir género de la especie
      if (['pixie', 'duenda', 'elfa', 'bruja', 'vikinga', 'gnoma', 'hada', 'maga', 'chamana', 'ninfa'].includes(especie)) {
        resultado.genero = 'F';
      } else if (['duende', 'elfo', 'brujo', 'vikingo', 'leprechaun', 'gnomo', 'mago', 'chaman', 'druida', 'fauno'].includes(especie)) {
        resultado.genero = 'M';
      }
      break;
    }
  }

  // === DETECTAR CATEGORÍA ===
  for (const [categoria, keywords] of Object.entries(CATEGORIAS_KEYWORDS)) {
    for (const keyword of keywords) {
      if (textoLower.includes(keyword)) {
        resultado.categoria = categoria;
        resultado.confianza.categoria = 'alto';
        break;
      }
    }
    if (resultado.categoria) break;
  }

  // Si dice "para X" intentar detectar categoría
  if (!resultado.categoria) {
    const patronPara = /para\s+([^,.]+)/gi;
    let matchPara;
    while ((matchPara = patronPara.exec(textoLower)) !== null) {
      const contexto = matchPara[1];
      for (const [categoria, keywords] of Object.entries(CATEGORIAS_KEYWORDS)) {
        if (keywords.some(k => contexto.includes(k))) {
          resultado.categoria = categoria;
          resultado.confianza.categoria = 'medio';
          break;
        }
      }
      if (resultado.categoria) break;
    }
  }

  // === DETECTAR CRISTALES ===
  for (const cristal of CRISTALES) {
    if (textoLower.includes(cristal.normalize('NFD').replace(/[\u0300-\u036f]/g, ''))) {
      resultado.cristales.push(cristal);
    }
  }

  // === DETECTAR ACCESORIOS ===
  // Patrones: "con X", "tiene X", "lleva X", "porta X"
  const patronesAccesorios = [
    /(?:con|tiene|lleva|porta|trae)\s+([^.,]+)/gi,
    /(?:incluye|viene con)\s+([^.,]+)/gi
  ];

  for (const patron of patronesAccesorios) {
    let match;
    while ((match = patron.exec(texto)) !== null) {
      const accesorio = match[1].trim();
      // Filtrar si es solo un cristal ya detectado
      const esSoloCristal = resultado.cristales.some(c =>
        accesorio.toLowerCase().includes(c.toLowerCase()) &&
        accesorio.length < c.length + 10
      );
      if (!esSoloCristal && accesorio.length > 2 && accesorio.length < 100) {
        resultado.accesorios.push(accesorio);
      }
    }
  }

  // === DETECTAR GÉNERO EXPLÍCITO ===
  if (!resultado.genero) {
    if (/\b(femenin[oa]|mujer|ella|nena)\b/i.test(textoLower)) {
      resultado.genero = 'F';
      resultado.confianza.genero = 'alto';
    } else if (/\b(masculin[oa]|hombre|él|nene)\b/i.test(textoLower)) {
      resultado.genero = 'M';
      resultado.confianza.genero = 'alto';
    }
  }

  // === LIMPIAR Y DEDUPLICAR ===
  resultado.cristales = [...new Set(resultado.cristales)];
  resultado.accesorios = [...new Set(resultado.accesorios)];

  return resultado;
}

/**
 * Combina datos del análisis Vision con datos parseados del texto
 * Prioridad: texto usuario > análisis vision > defaults
 */
export function mergearDatosProducto(analisisVision, textoParseado, defaults = {}) {
  const defaultsFinal = {
    nombre: '',
    especie: 'duende',
    genero: 'M',
    categoria: 'Protección',
    tamano: 'mediano_especial',
    tamanoCm: 18,
    accesorios: '',
    esUnico: true,
    ...defaults
  };

  // Extraer datos del análisis Vision si existe
  const datosVision = {};
  if (analisisVision) {
    // El análisis viene como texto, intentar extraer info
    const analisisLower = analisisVision.toLowerCase();

    // Especie sugerida
    if (analisisLower.includes('pixie')) datosVision.especie = 'pixie';
    else if (analisisLower.includes('elfo') || analisisLower.includes('elfa')) datosVision.especie = 'elfo';
    else if (analisisLower.includes('gnomo')) datosVision.especie = 'gnomo';

    // Género desde el análisis
    if (analisisLower.includes('femenin') || analisisLower.includes('ella ')) datosVision.genero = 'F';
    else if (analisisLower.includes('masculin') || analisisLower.includes('él ')) datosVision.genero = 'M';

    // Categoría desde el análisis
    if (analisisLower.includes('protec')) datosVision.categoria = 'Protección';
    else if (analisisLower.includes('abund') || analisisLower.includes('prosper')) datosVision.categoria = 'Abundancia';
    else if (analisisLower.includes('amor') || analisisLower.includes('coraz')) datosVision.categoria = 'Amor';
    else if (analisisLower.includes('sana') || analisisLower.includes('salud')) datosVision.categoria = 'Sanación';
    else if (analisisLower.includes('sabid') || analisisLower.includes('intuic')) datosVision.categoria = 'Sabiduría';
  }

  // Construir accesorios combinados
  const accesoriosArray = [];
  if (textoParseado.cristales?.length) {
    accesoriosArray.push(...textoParseado.cristales);
  }
  if (textoParseado.accesorios?.length) {
    accesoriosArray.push(...textoParseado.accesorios);
  }

  // Merge con prioridades
  return {
    nombre: textoParseado.nombre || datosVision.nombre || defaultsFinal.nombre,
    especie: textoParseado.especie || datosVision.especie || defaultsFinal.especie,
    genero: textoParseado.genero || datosVision.genero || defaultsFinal.genero,
    categoria: textoParseado.categoria || datosVision.categoria || defaultsFinal.categoria,
    tamano: textoParseado.tamano || defaultsFinal.tamano,
    tamanoCm: textoParseado.tamanoCm || defaultsFinal.tamanoCm,
    accesorios: accesoriosArray.length > 0 ? accesoriosArray.join(', ') : defaultsFinal.accesorios,
    esUnico: textoParseado.tamanoCm ? textoParseado.tamanoCm > 15 : defaultsFinal.esUnico,
    confianza: textoParseado.confianza || {}
  };
}

/**
 * Genera un SKU automático basado en los datos del producto
 */
export function generarSKU(datos) {
  const prefijos = {
    pixie: 'PX',
    duende: 'DU',
    duenda: 'DA',
    elfo: 'EL',
    elfa: 'EA',
    gnomo: 'GN',
    hada: 'HD',
    bruja: 'BR',
    brujo: 'BO',
    vikingo: 'VK',
    vikinga: 'VA',
    leprechaun: 'LP',
    mago: 'MG',
    maga: 'MA',
    chaman: 'CH',
    druida: 'DR'
  };

  const prefijo = prefijos[datos.especie?.toLowerCase()] || 'PR';
  const nombre = datos.nombre
    ? datos.nombre.substring(0, 3).toUpperCase()
    : 'XXX';
  const timestamp = Date.now().toString().slice(-6);

  return `${prefijo}-${nombre}-${timestamp}`;
}
