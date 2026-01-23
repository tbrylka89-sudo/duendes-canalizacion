/**
 * RANKMATH SEO - Sistema completo para optimizacion SEO
 * Genera metadata para RankMath 100/100
 *
 * @module lib/seo/rankmath
 */

// ═══════════════════════════════════════════════════════════════
// CONSTANTES Y CONFIGURACION
// ═══════════════════════════════════════════════════════════════

const SITE_URL = 'https://duendesdeluruguay.com';
const SITE_NAME = 'Duendes del Uruguay';
const DEFAULT_IMAGE = `${SITE_URL}/images/og-default.jpg`;

// Keywords relevantes del nicho por categoria
const KEYWORDS_NICHO = {
  proteccion: {
    principal: ['duendes proteccion', 'guardian protector', 'amuleto proteccion'],
    lsi: [
      'duendes uruguay', 'guardianes magicos', 'proteccion hogar',
      'amuletos proteccion', 'energia positiva', 'figuras misticas',
      'duendes hechos a mano', 'artesania mistica', 'piriapolis',
      'proteccion energetica', 'escudo energetico', 'guardian espiritual'
    ]
  },
  abundancia: {
    principal: ['duende abundancia', 'guardian abundancia', 'amuleto prosperidad'],
    lsi: [
      'duendes uruguay', 'prosperidad abundancia', 'atraer abundancia',
      'energia dinero', 'guardianes prosperidad', 'figuras misticas',
      'amuletos prosperidad', 'artesania espiritual', 'piriapolis',
      'flujo abundancia', 'desbloquear dinero', 'guardian riqueza'
    ]
  },
  amor: {
    principal: ['duende amor', 'guardian amor', 'amuleto amor'],
    lsi: [
      'duendes uruguay', 'energia amor', 'guardianes corazon',
      'regalo espiritual', 'figuras misticas', 'sanacion corazon',
      'amuletos amor', 'artesania mistica', 'piriapolis',
      'autoamor', 'relaciones sanas', 'energia rosa'
    ]
  },
  sanacion: {
    principal: ['duende sanacion', 'guardian sanador', 'amuleto sanacion'],
    lsi: [
      'duendes uruguay', 'sanacion espiritual', 'energia sanadora',
      'guardianes sanacion', 'figuras misticas', 'bienestar espiritual',
      'artesania mistica', 'regalo espiritual', 'piriapolis',
      'sanacion emocional', 'cristales sanacion', 'energia curativa'
    ]
  },
  sabiduria: {
    principal: ['duende sabiduria', 'guardian sabio', 'amuleto sabiduria'],
    lsi: [
      'duendes uruguay', 'sabiduria ancestral', 'guardianes sabios',
      'energia sabiduria', 'figuras misticas', 'artesania espiritual',
      'amuletos sabiduria', 'regalo espiritual', 'piriapolis',
      'claridad mental', 'intuicion', 'guia espiritual'
    ]
  },
  salud: {
    principal: ['duende salud', 'guardian salud', 'amuleto bienestar'],
    lsi: [
      'duendes uruguay', 'bienestar salud', 'energia sanadora',
      'guardianes salud', 'figuras misticas', 'sanacion espiritual',
      'artesania mistica', 'regalo espiritual', 'piriapolis',
      'equilibrio cuerpo', 'vitalidad', 'energia vital'
    ]
  }
};

// Tipos de producto con articulos
const TIPOS_ARTICULOS = {
  duende: { articulo: 'un', plural: 'duendes' },
  pixie: { articulo: 'una', plural: 'pixies' },
  bruja: { articulo: 'una', plural: 'brujas' },
  mago: { articulo: 'un', plural: 'magos' },
  hechicero: { articulo: 'un', plural: 'hechiceros' },
  guardian: { articulo: 'un', plural: 'guardianes' },
  leprechaun: { articulo: 'un', plural: 'leprechauns' },
  gnomo: { articulo: 'un', plural: 'gnomos' }
};

// ═══════════════════════════════════════════════════════════════
// FUNCIONES AUXILIARES
// ═══════════════════════════════════════════════════════════════

/**
 * Normaliza texto para URLs y slugs
 */
function normalizeSlug(text) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 100);
}

/**
 * Normaliza categoria quitando acentos
 */
function normalizeCategoria(categoria) {
  return (categoria || 'proteccion')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

/**
 * Capitaliza primera letra
 */
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Ajusta texto a longitud exacta
 */
function adjustLength(text, maxLength, suffix = '...') {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - suffix.length) + suffix;
}

/**
 * Genera texto de longitud exacta con padding
 */
function exactLength(text, targetLength) {
  if (text.length === targetLength) return text;
  if (text.length > targetLength) return text.slice(0, targetLength - 3) + '...';

  // Padding con texto adicional
  const paddings = [
    ' Envio internacional.',
    ' Hecho a mano.',
    ' Pieza unica.',
    ' Uruguay.',
    ' Artesanal.',
    ''
  ];

  for (const padding of paddings) {
    const combined = text + padding;
    if (combined.length <= targetLength) {
      // Rellenar con espacios si es necesario (raro pero posible)
      return combined.padEnd(targetLength).slice(0, targetLength);
    }
  }

  return text.slice(0, targetLength);
}

// ═══════════════════════════════════════════════════════════════
// FUNCIONES PRINCIPALES
// ═══════════════════════════════════════════════════════════════

/**
 * Genera metadata completa para RankMath 100/100
 * @param {Object} producto - Datos del producto
 * @returns {Object} Metadata completa para RankMath
 */
export function generateRankMathMeta(producto) {
  const {
    id,
    nombre,
    tipo = 'duende',
    categoria = 'proteccion',
    descripcion = '',
    precio = 0,
    imagen = '',
    imagenes = [],
    tamanoCm = 18,
    accesorios = [],
    esUnico = true,
    sku = ''
  } = producto;

  const categoriaNorm = normalizeCategoria(categoria);
  const tipoNorm = tipo.toLowerCase();
  const tipoInfo = TIPOS_ARTICULOS[tipoNorm] || TIPOS_ARTICULOS.guardian;
  const keywordsCategoria = KEYWORDS_NICHO[categoriaNorm] || KEYWORDS_NICHO.proteccion;

  // ═══════════════════════════════════════════════════════════════
  // FOCUS KEYWORD (2-4 palabras, keyword principal)
  // ═══════════════════════════════════════════════════════════════
  const focusKeyword = `${tipoNorm} ${categoriaNorm}`;

  // ═══════════════════════════════════════════════════════════════
  // SEO TITLE (60 chars max, keyword al inicio)
  // ═══════════════════════════════════════════════════════════════
  let seoTitle = `${capitalize(tipoNorm)} ${capitalize(categoriaNorm)}: ${nombre} | ${SITE_NAME}`;
  if (seoTitle.length > 60) {
    seoTitle = `${nombre} - ${capitalize(tipoNorm)} ${capitalize(categoriaNorm)} | Uruguay`;
  }
  if (seoTitle.length > 60) {
    seoTitle = `${nombre} | ${capitalize(tipoNorm)} de ${capitalize(categoriaNorm)}`;
  }
  seoTitle = exactLength(seoTitle, 60);

  // ═══════════════════════════════════════════════════════════════
  // META DESCRIPTION (155 chars, keyword incluida)
  // ═══════════════════════════════════════════════════════════════
  let metaDescription = `${nombre} es ${tipoInfo.articulo} ${tipoNorm} de ${categoriaNorm} hecho a mano en Uruguay. Pieza ${esUnico ? 'unica' : 'artesanal'} con cristales reales y energia canalizada.`;
  metaDescription = exactLength(metaDescription, 155);

  // ═══════════════════════════════════════════════════════════════
  // CANONICAL URL
  // ═══════════════════════════════════════════════════════════════
  const slug = normalizeSlug(`${tipoNorm}-${categoriaNorm}-${nombre}`);
  const canonicalUrl = `${SITE_URL}/producto/${slug}`;

  // ═══════════════════════════════════════════════════════════════
  // SCHEMA PRODUCT (JSON-LD completo)
  // ═══════════════════════════════════════════════════════════════
  const schemaProduct = {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${canonicalUrl}#product`,
    "name": nombre,
    "description": metaDescription,
    "sku": sku || `DU-${id || Date.now()}`,
    "mpn": `DU-${tipoNorm.slice(0, 2).toUpperCase()}-${id || Date.now()}`,
    "image": imagenes.length > 0 ? imagenes : [imagen || DEFAULT_IMAGE],
    "brand": {
      "@type": "Brand",
      "name": SITE_NAME,
      "logo": `${SITE_URL}/images/logo.png`
    },
    "manufacturer": {
      "@type": "Organization",
      "name": SITE_NAME,
      "url": SITE_URL,
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Piriapolis",
        "addressRegion": "Maldonado",
        "addressCountry": "UY"
      }
    },
    "offers": {
      "@type": "Offer",
      "url": canonicalUrl,
      "price": precio,
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock",
      "itemCondition": "https://schema.org/NewCondition",
      "seller": {
        "@type": "Organization",
        "name": SITE_NAME
      },
      "shippingDetails": {
        "@type": "OfferShippingDetails",
        "shippingRate": {
          "@type": "MonetaryAmount",
          "value": "0",
          "currency": "USD"
        },
        "shippingDestination": [
          {
            "@type": "DefinedRegion",
            "addressCountry": "UY"
          },
          {
            "@type": "DefinedRegion",
            "addressCountry": "AR"
          },
          {
            "@type": "DefinedRegion",
            "addressCountry": "BR"
          }
        ],
        "deliveryTime": {
          "@type": "ShippingDeliveryTime",
          "handlingTime": {
            "@type": "QuantitativeValue",
            "minValue": 3,
            "maxValue": 7,
            "unitCode": "DAY"
          },
          "transitTime": {
            "@type": "QuantitativeValue",
            "minValue": 5,
            "maxValue": 15,
            "unitCode": "DAY"
          }
        }
      }
    },
    "category": `${capitalize(tipoNorm)} de ${capitalize(categoriaNorm)}`,
    "material": "Resina artesanal, cristales naturales, pigmentos ecologicos",
    "height": {
      "@type": "QuantitativeValue",
      "value": tamanoCm,
      "unitCode": "CMT"
    },
    "isAccessoryOrSparePartFor": {
      "@type": "Product",
      "name": "Altar espiritual"
    },
    "additionalProperty": [
      {
        "@type": "PropertyValue",
        "name": "Hecho a mano",
        "value": "Si"
      },
      {
        "@type": "PropertyValue",
        "name": "Pieza unica",
        "value": esUnico ? "Si" : "No"
      },
      {
        "@type": "PropertyValue",
        "name": "Origen",
        "value": "Piriapolis, Uruguay"
      },
      {
        "@type": "PropertyValue",
        "name": "Categoria energetica",
        "value": capitalize(categoriaNorm)
      }
    ]
  };

  // Agregar accesorios si existen
  if (accesorios && accesorios.length > 0) {
    schemaProduct.additionalProperty.push({
      "@type": "PropertyValue",
      "name": "Accesorios incluidos",
      "value": Array.isArray(accesorios) ? accesorios.join(', ') : accesorios
    });
  }

  // ═══════════════════════════════════════════════════════════════
  // SOCIAL MEDIA (OpenGraph + Twitter)
  // ═══════════════════════════════════════════════════════════════
  const socialImage = imagen || (imagenes && imagenes[0]) || DEFAULT_IMAGE;

  const facebookTitle = exactLength(`${nombre} - ${capitalize(tipoNorm)} de ${capitalize(categoriaNorm)}`, 60);
  const facebookDescription = exactLength(
    `Descubri a ${nombre}, ${tipoInfo.articulo} ${tipoNorm} de ${categoriaNorm} canalizado a mano en Piriapolis. Pieza ${esUnico ? 'unica' : 'artesanal'} con cristales reales.`,
    155
  );

  const twitterTitle = exactLength(`${nombre} | ${capitalize(tipoNorm)} de ${capitalize(categoriaNorm)}`, 60);
  const twitterDescription = exactLength(
    `${nombre}: ${tipoInfo.articulo} ${tipoNorm} de ${categoriaNorm} hecho a mano en Uruguay. Energia canalizada y cristales naturales.`,
    155
  );

  // ═══════════════════════════════════════════════════════════════
  // RESULTADO COMPLETO
  // ═══════════════════════════════════════════════════════════════
  return {
    // RankMath specific fields
    rank_math_title: seoTitle,
    rank_math_description: metaDescription,
    rank_math_focus_keyword: focusKeyword,
    rank_math_robots: 'index,follow,max-snippet:-1,max-image-preview:large,max-video-preview:-1',
    rank_math_canonical_url: canonicalUrl,
    rank_math_primary_category: capitalize(categoriaNorm),

    // Schema
    rank_math_schema_Product: JSON.stringify(schemaProduct),

    // Social - Facebook/OpenGraph
    rank_math_facebook_title: facebookTitle,
    rank_math_facebook_description: facebookDescription,
    rank_math_facebook_image: socialImage,
    rank_math_facebook_image_overlay: 'off',

    // Social - Twitter
    rank_math_twitter_title: twitterTitle,
    rank_math_twitter_description: twitterDescription,
    rank_math_twitter_card_type: 'summary_large_image',
    rank_math_twitter_use_facebook: 'off',

    // Additional RankMath fields
    rank_math_advanced_robots: {
      'max-snippet': -1,
      'max-image-preview': 'large',
      'max-video-preview': -1
    },
    rank_math_internal_links_processed: 1,

    // Extra data for reference
    _seo_data: {
      focusKeyword,
      focusKeywordVariations: [
        focusKeyword,
        `${tipoNorm} ${categoriaNorm}`,
        `guardian ${categoriaNorm}`,
        `${tipoNorm} artesanal`,
        `amuleto ${categoriaNorm}`
      ],
      lsiKeywords: keywordsCategoria.lsi,
      slug,
      canonicalUrl,
      schemaProduct
    }
  };
}

/**
 * Analiza score estimado de RankMath (0-100)
 * @param {Object} producto - Datos del producto
 * @param {Object} seoData - Datos SEO generados
 * @returns {Object} Score y sugerencias de mejora
 */
export function analyzeRankMathScore(producto, seoData) {
  const {
    nombre = '',
    descripcion = '',
    tipo = 'duende',
    categoria = 'proteccion',
    imagen = '',
    imagenes = []
  } = producto;

  const {
    rank_math_title = '',
    rank_math_description = '',
    rank_math_focus_keyword = '',
    _seo_data = {}
  } = seoData;

  const focusKeyword = rank_math_focus_keyword || _seo_data.focusKeyword || '';
  const focusKeywordLower = focusKeyword.toLowerCase();

  let score = 0;
  const detalles = [];
  const sugerencias = [];

  // ═══════════════════════════════════════════════════════════════
  // 1. FOCUS KEYWORD (max 10 puntos)
  // ═══════════════════════════════════════════════════════════════
  if (focusKeyword && focusKeyword.length >= 3) {
    score += 5;
    detalles.push({ criterio: 'Focus keyword definida', puntos: 5, max: 10 });

    const palabras = focusKeyword.split(' ').filter(p => p.length > 2);
    if (palabras.length >= 2 && palabras.length <= 4) {
      score += 5;
      detalles.push({ criterio: 'Focus keyword longitud optima (2-4 palabras)', puntos: 5, max: 5 });
    } else {
      sugerencias.push('La focus keyword deberia tener entre 2 y 4 palabras');
    }
  } else {
    sugerencias.push('Define una focus keyword relevante de 2-4 palabras');
    detalles.push({ criterio: 'Focus keyword', puntos: 0, max: 10 });
  }

  // ═══════════════════════════════════════════════════════════════
  // 2. SEO TITLE (max 15 puntos)
  // ═══════════════════════════════════════════════════════════════
  const titleLength = rank_math_title.length;

  if (titleLength > 0) {
    // Longitud (5 puntos)
    if (titleLength >= 50 && titleLength <= 60) {
      score += 5;
      detalles.push({ criterio: 'Titulo longitud optima', puntos: 5, max: 5 });
    } else if (titleLength >= 40 && titleLength < 70) {
      score += 3;
      detalles.push({ criterio: 'Titulo longitud aceptable', puntos: 3, max: 5 });
      sugerencias.push(`El titulo tiene ${titleLength} caracteres, lo ideal es 50-60`);
    } else {
      sugerencias.push(`El titulo tiene ${titleLength} caracteres, ajustalo a 50-60`);
      detalles.push({ criterio: 'Titulo longitud', puntos: 0, max: 5 });
    }

    // Keyword en titulo (5 puntos)
    if (rank_math_title.toLowerCase().includes(focusKeywordLower)) {
      score += 5;
      detalles.push({ criterio: 'Focus keyword en titulo', puntos: 5, max: 5 });
    } else {
      sugerencias.push(`Incluye la focus keyword "${focusKeyword}" en el titulo`);
      detalles.push({ criterio: 'Focus keyword en titulo', puntos: 0, max: 5 });
    }

    // Keyword al inicio (5 puntos)
    if (rank_math_title.toLowerCase().startsWith(focusKeywordLower.split(' ')[0])) {
      score += 5;
      detalles.push({ criterio: 'Keyword al inicio del titulo', puntos: 5, max: 5 });
    } else {
      sugerencias.push('Coloca la keyword principal al inicio del titulo');
      detalles.push({ criterio: 'Keyword al inicio del titulo', puntos: 0, max: 5 });
    }
  } else {
    sugerencias.push('Define un titulo SEO');
    detalles.push({ criterio: 'Titulo SEO', puntos: 0, max: 15 });
  }

  // ═══════════════════════════════════════════════════════════════
  // 3. META DESCRIPTION (max 15 puntos)
  // ═══════════════════════════════════════════════════════════════
  const descLength = rank_math_description.length;

  if (descLength > 0) {
    // Longitud (5 puntos)
    if (descLength >= 140 && descLength <= 160) {
      score += 5;
      detalles.push({ criterio: 'Meta description longitud optima', puntos: 5, max: 5 });
    } else if (descLength >= 120 && descLength <= 170) {
      score += 3;
      detalles.push({ criterio: 'Meta description longitud aceptable', puntos: 3, max: 5 });
      sugerencias.push(`La meta description tiene ${descLength} caracteres, lo ideal es 140-160`);
    } else {
      sugerencias.push(`La meta description tiene ${descLength} caracteres, ajustala a 140-160`);
      detalles.push({ criterio: 'Meta description longitud', puntos: 0, max: 5 });
    }

    // Keyword en description (5 puntos)
    if (rank_math_description.toLowerCase().includes(focusKeywordLower)) {
      score += 5;
      detalles.push({ criterio: 'Focus keyword en meta description', puntos: 5, max: 5 });
    } else {
      sugerencias.push(`Incluye la focus keyword "${focusKeyword}" en la meta description`);
      detalles.push({ criterio: 'Focus keyword en meta description', puntos: 0, max: 5 });
    }

    // Call to action o power words (5 puntos)
    const powerWords = ['descubri', 'unico', 'exclusivo', 'artesanal', 'hecho a mano', 'energia', 'cristales'];
    const hasPowerWord = powerWords.some(pw => rank_math_description.toLowerCase().includes(pw));
    if (hasPowerWord) {
      score += 5;
      detalles.push({ criterio: 'Power words en meta description', puntos: 5, max: 5 });
    } else {
      sugerencias.push('Incluye palabras de poder: unico, exclusivo, artesanal, energia');
      detalles.push({ criterio: 'Power words en meta description', puntos: 0, max: 5 });
    }
  } else {
    sugerencias.push('Define una meta description');
    detalles.push({ criterio: 'Meta description', puntos: 0, max: 15 });
  }

  // ═══════════════════════════════════════════════════════════════
  // 4. CONTENIDO (max 20 puntos)
  // ═══════════════════════════════════════════════════════════════
  const contenidoLength = descripcion.length;

  if (contenidoLength > 0) {
    // Longitud minima 300 palabras aprox (5 puntos)
    const palabrasContenido = descripcion.split(/\s+/).length;
    if (palabrasContenido >= 300) {
      score += 5;
      detalles.push({ criterio: 'Contenido 300+ palabras', puntos: 5, max: 5 });
    } else if (palabrasContenido >= 150) {
      score += 3;
      detalles.push({ criterio: 'Contenido 150+ palabras', puntos: 3, max: 5 });
      sugerencias.push(`El contenido tiene ${palabrasContenido} palabras, lo ideal son 300+`);
    } else {
      sugerencias.push(`El contenido tiene solo ${palabrasContenido} palabras, amplialo a 300+`);
      detalles.push({ criterio: 'Longitud contenido', puntos: 0, max: 5 });
    }

    // Keyword en contenido (5 puntos)
    if (descripcion.toLowerCase().includes(focusKeywordLower)) {
      score += 5;
      detalles.push({ criterio: 'Focus keyword en contenido', puntos: 5, max: 5 });
    } else {
      sugerencias.push(`Incluye la focus keyword "${focusKeyword}" en el contenido`);
      detalles.push({ criterio: 'Focus keyword en contenido', puntos: 0, max: 5 });
    }

    // Keyword en primer parrafo (5 puntos)
    const primerParrafo = descripcion.slice(0, 500).toLowerCase();
    if (primerParrafo.includes(focusKeywordLower)) {
      score += 5;
      detalles.push({ criterio: 'Keyword en primer parrafo', puntos: 5, max: 5 });
    } else {
      sugerencias.push('Incluye la focus keyword en el primer parrafo');
      detalles.push({ criterio: 'Keyword en primer parrafo', puntos: 0, max: 5 });
    }

    // Densidad keyword 1-2% (5 puntos)
    const keywordCount = (descripcion.toLowerCase().match(new RegExp(focusKeywordLower, 'g')) || []).length;
    const densidad = (keywordCount / palabrasContenido) * 100;
    if (densidad >= 0.5 && densidad <= 3) {
      score += 5;
      detalles.push({ criterio: 'Densidad keyword optima', puntos: 5, max: 5 });
    } else if (densidad > 0) {
      score += 2;
      detalles.push({ criterio: 'Densidad keyword presente', puntos: 2, max: 5 });
      if (densidad < 0.5) {
        sugerencias.push(`Densidad keyword muy baja (${densidad.toFixed(2)}%), aumenta a 1-2%`);
      } else {
        sugerencias.push(`Densidad keyword muy alta (${densidad.toFixed(2)}%), reduce a 1-2%`);
      }
    } else {
      sugerencias.push('Incluye la focus keyword varias veces en el contenido (densidad 1-2%)');
      detalles.push({ criterio: 'Densidad keyword', puntos: 0, max: 5 });
    }
  } else {
    sugerencias.push('Agrega contenido descriptivo de al menos 300 palabras');
    detalles.push({ criterio: 'Contenido', puntos: 0, max: 20 });
  }

  // ═══════════════════════════════════════════════════════════════
  // 5. IMAGENES (max 15 puntos)
  // ═══════════════════════════════════════════════════════════════
  const totalImagenes = (imagenes?.length || 0) + (imagen ? 1 : 0);

  if (totalImagenes > 0) {
    score += 5;
    detalles.push({ criterio: 'Imagen presente', puntos: 5, max: 5 });

    if (totalImagenes >= 3) {
      score += 5;
      detalles.push({ criterio: '3+ imagenes', puntos: 5, max: 5 });
    } else {
      sugerencias.push('Agrega al menos 3 imagenes del producto');
      detalles.push({ criterio: 'Cantidad imagenes', puntos: 0, max: 5 });
    }

    // Alt text (asumimos que si hay imagen, RankMath generara alt)
    score += 5;
    detalles.push({ criterio: 'Alt text disponible', puntos: 5, max: 5 });
  } else {
    sugerencias.push('Agrega imagenes del producto con alt text optimizado');
    detalles.push({ criterio: 'Imagenes', puntos: 0, max: 15 });
  }

  // ═══════════════════════════════════════════════════════════════
  // 6. SCHEMA (max 10 puntos)
  // ═══════════════════════════════════════════════════════════════
  if (seoData.rank_math_schema_Product) {
    score += 10;
    detalles.push({ criterio: 'Schema Product completo', puntos: 10, max: 10 });
  } else {
    sugerencias.push('Genera Schema markup para el producto');
    detalles.push({ criterio: 'Schema Product', puntos: 0, max: 10 });
  }

  // ═══════════════════════════════════════════════════════════════
  // 7. URL/SLUG (max 5 puntos)
  // ═══════════════════════════════════════════════════════════════
  const slug = _seo_data.slug || '';
  if (slug && slug.includes(focusKeywordLower.split(' ')[0])) {
    score += 5;
    detalles.push({ criterio: 'Keyword en URL/slug', puntos: 5, max: 5 });
  } else {
    sugerencias.push('Incluye la keyword principal en el slug/URL');
    detalles.push({ criterio: 'Keyword en URL', puntos: 0, max: 5 });
  }

  // ═══════════════════════════════════════════════════════════════
  // 8. SOCIAL MEDIA (max 10 puntos)
  // ═══════════════════════════════════════════════════════════════
  if (seoData.rank_math_facebook_title && seoData.rank_math_twitter_title) {
    score += 10;
    detalles.push({ criterio: 'Meta social completa', puntos: 10, max: 10 });
  } else {
    sugerencias.push('Completa la metadata para redes sociales');
    detalles.push({ criterio: 'Meta social', puntos: 0, max: 10 });
  }

  // ═══════════════════════════════════════════════════════════════
  // RESULTADO FINAL
  // ═══════════════════════════════════════════════════════════════
  const nivel = score >= 80 ? 'Excelente' : score >= 60 ? 'Bueno' : score >= 40 ? 'Mejorable' : 'Necesita trabajo';

  return {
    score,
    maxScore: 100,
    porcentaje: score,
    nivel,
    color: score >= 80 ? 'green' : score >= 60 ? 'yellow' : score >= 40 ? 'orange' : 'red',
    detalles,
    sugerencias,
    resumen: {
      puntosFuertes: detalles.filter(d => d.puntos === d.max).map(d => d.criterio),
      puntosMejorables: detalles.filter(d => d.puntos < d.max).map(d => d.criterio)
    }
  };
}

/**
 * Genera keywords LSI (Latent Semantic Indexing) relacionadas
 * @param {Object} producto - Datos del producto
 * @returns {Object} Keywords LSI organizadas
 */
export function generateLSIKeywords(producto) {
  const {
    nombre = '',
    tipo = 'duende',
    categoria = 'proteccion',
    accesorios = []
  } = producto;

  const categoriaNorm = normalizeCategoria(categoria);
  const tipoNorm = tipo.toLowerCase();
  const keywordsCategoria = KEYWORDS_NICHO[categoriaNorm] || KEYWORDS_NICHO.proteccion;

  // Keywords base del nicho
  const baseKeywords = [
    'duendes uruguay',
    'guardianes magicos',
    'figuras misticas',
    'artesania mistica',
    'piriapolis',
    'energia positiva',
    'amuletos espirituales',
    'regalo espiritual',
    'proteccion hogar',
    'abundancia prosperidad',
    'sanacion espiritual'
  ];

  // Keywords especificas de categoria
  const categoriaKeywords = keywordsCategoria.lsi;

  // Keywords de tipo
  const tipoKeywords = {
    duende: ['duende artesanal', 'duende hecho a mano', 'duende protector', 'duende magico'],
    pixie: ['pixie magica', 'pixie naturaleza', 'pixie artesanal', 'ser de luz'],
    bruja: ['bruja buena', 'bruja protectora', 'bruja artesanal', 'hechicera'],
    guardian: ['guardian espiritual', 'guardian protector', 'guardian magico', 'guardian artesanal']
  };

  // Keywords de accesorios/cristales
  const cristalesKeywords = {
    cuarzo: ['cuarzo cristal', 'energia cuarzo', 'poder cuarzo'],
    amatista: ['amatista proteccion', 'piedra amatista', 'cristal morado'],
    turmalina: ['turmalina negra', 'proteccion turmalina', 'piedra proteccion'],
    citrino: ['citrino abundancia', 'piedra prosperidad', 'cristal amarillo'],
    rosa: ['cuarzo rosa', 'energia amor', 'cristal rosa']
  };

  // Extraer keywords de accesorios
  let accesoriosKeywords = [];
  const accesoriosStr = Array.isArray(accesorios) ? accesorios.join(' ') : accesorios;
  for (const [cristal, kws] of Object.entries(cristalesKeywords)) {
    if (accesoriosStr.toLowerCase().includes(cristal)) {
      accesoriosKeywords = accesoriosKeywords.concat(kws);
    }
  }

  // Long tail keywords
  const longTailKeywords = [
    `${tipoNorm} de ${categoriaNorm} uruguay`,
    `comprar ${tipoNorm} artesanal`,
    `${tipoNorm} hecho a mano uruguay`,
    `donde comprar ${tipoNorm}s`,
    `${tipoNorm} para ${categoriaNorm}`,
    `regalo espiritual ${categoriaNorm}`,
    `amuleto ${categoriaNorm} artesanal`,
    `figura mistica ${categoriaNorm}`
  ];

  // Keywords geograficas
  const geoKeywords = [
    'duendes piriapolis',
    'artesania uruguay',
    'hecho en uruguay',
    'artesanos uruguayos',
    'productos espirituales uruguay',
    'envio internacional uruguay'
  ];

  // Keywords de intencion de compra
  const intentKeywords = [
    `comprar ${tipoNorm}`,
    `precio ${tipoNorm}`,
    `${tipoNorm} barato`,
    `${tipoNorm} online`,
    `tienda ${tipoNorm}s`,
    `venta ${tipoNorm}s`
  ];

  return {
    principal: keywordsCategoria.principal,
    lsi: [...new Set([...categoriaKeywords, ...baseKeywords])],
    tipo: tipoKeywords[tipoNorm] || tipoKeywords.guardian,
    accesorios: accesoriosKeywords,
    longTail: longTailKeywords,
    geograficas: geoKeywords,
    intencion: intentKeywords,
    todas: [...new Set([
      ...keywordsCategoria.principal,
      ...categoriaKeywords,
      ...baseKeywords,
      ...(tipoKeywords[tipoNorm] || []),
      ...accesoriosKeywords,
      ...longTailKeywords.slice(0, 5),
      ...geoKeywords.slice(0, 3)
    ])],
    sugerenciasUso: [
      `Usa "${keywordsCategoria.principal[0]}" como focus keyword`,
      'Incluye 3-5 LSI keywords en el contenido',
      'Usa long tail keywords en subtitulos H2/H3',
      'Menciona keywords geograficas para SEO local',
      'Incluye keywords de intencion cerca del CTA'
    ]
  };
}

/**
 * Genera alt text optimizado para imagenes
 * @param {Object} producto - Datos del producto
 * @param {string} tipoImagen - Tipo de imagen (principal, detalle, contexto, etc)
 * @returns {string} Alt text optimizado
 */
export function generateAltText(producto, tipoImagen = 'principal') {
  const {
    nombre = 'Guardian',
    tipo = 'duende',
    categoria = 'proteccion'
  } = producto;

  const categoriaNorm = normalizeCategoria(categoria);
  const tipoNorm = tipo.toLowerCase();
  const tipoCapitalizado = capitalize(tipoNorm);
  const categoriaCapitalizada = capitalize(categoriaNorm);

  const altTexts = {
    principal: `${nombre} - ${tipoCapitalizado} de ${categoriaCapitalizada} hecho a mano - Duendes del Uruguay`,
    detalle: `Detalle de ${nombre}, ${tipoNorm} de ${categoriaNorm} artesanal con cristales naturales`,
    contexto: `${nombre} en altar espiritual - ${tipoCapitalizado} de ${categoriaCapitalizada} Piriapolis Uruguay`,
    rostro: `Rostro de ${nombre}, ${tipoNorm} canalizado a mano - expresion ${categoriaNorm}`,
    accesorios: `Cristales y accesorios de ${nombre} - ${tipoNorm} de ${categoriaNorm}`,
    empaque: `Empaque artesanal de ${nombre} - ${tipoCapitalizado} de ${categoriaCapitalizada}`,
    escala: `Tamano real de ${nombre} - ${tipoNorm} de ${categoriaNorm} junto a mano para referencia`,
    proceso: `Proceso de creacion de ${nombre} - ${tipoNorm} artesanal siendo canalizado`
  };

  return altTexts[tipoImagen] || altTexts.principal;
}

/**
 * Genera URLs y enlaces internos optimizados
 * @param {Object} producto - Datos del producto
 * @returns {Object} URLs y sugerencias de enlaces internos
 */
export function generateInternalLinks(producto) {
  const {
    nombre = '',
    tipo = 'duende',
    categoria = 'proteccion'
  } = producto;

  const categoriaNorm = normalizeCategoria(categoria);
  const tipoNorm = tipo.toLowerCase();
  const slug = normalizeSlug(`${tipoNorm}-${categoriaNorm}-${nombre}`);

  return {
    canonical: `${SITE_URL}/producto/${slug}`,
    categoria: `${SITE_URL}/categoria/${categoriaNorm}`,
    tipo: `${SITE_URL}/tipo/${tipoNorm}`,

    sugeridos: [
      {
        url: `${SITE_URL}/categoria/${categoriaNorm}`,
        anchorText: `Ver mas ${tipoNorm}s de ${categoriaNorm}`,
        contexto: 'Al final del contenido'
      },
      {
        url: `${SITE_URL}/sobre-nosotros`,
        anchorText: 'Conoce nuestro proceso de canalizacion',
        contexto: 'Cuando menciones el proceso de creacion'
      },
      {
        url: `${SITE_URL}/blog/guia-cristales`,
        anchorText: 'Propiedades de los cristales',
        contexto: 'Cuando menciones accesorios o cristales'
      },
      {
        url: `${SITE_URL}/blog/como-cuidar-guardian`,
        anchorText: 'Como cuidar tu guardian',
        contexto: 'En la descripcion de cuidados'
      },
      {
        url: `${SITE_URL}/test-guardian`,
        anchorText: 'Descubri que guardian es para vos',
        contexto: 'Para visitantes indecisos'
      }
    ],

    anchorTextsVariados: [
      `${tipoNorm}s de ${categoriaNorm}`,
      `guardianes de ${categoriaNorm}`,
      `figuras de ${categoriaNorm}`,
      'piezas unicas artesanales',
      'guardianes canalizados',
      `amuletos de ${categoriaNorm}`
    ],

    estructuraSilo: {
      padre: `/categoria/${categoriaNorm}`,
      hermanos: [
        `/categoria/${categoriaNorm}?tipo=${tipoNorm}`,
        `/categoria/${categoriaNorm}?precio=asc`,
        `/categoria/${categoriaNorm}?nuevo=true`
      ],
      relacionados: [
        '/categoria/proteccion',
        '/categoria/abundancia',
        '/categoria/sanacion'
      ].filter(c => !c.includes(categoriaNorm))
    }
  };
}

/**
 * Valida y corrige datos SEO para WooCommerce/RankMath
 * @param {Object} seoData - Datos SEO a validar
 * @returns {Object} Datos validados y corregidos
 */
export function validateAndFixSEOData(seoData) {
  const errores = [];
  const advertencias = [];
  const fixed = { ...seoData };

  // Validar titulo
  if (!fixed.rank_math_title || fixed.rank_math_title.length === 0) {
    errores.push('Falta titulo SEO');
  } else if (fixed.rank_math_title.length > 60) {
    advertencias.push(`Titulo muy largo (${fixed.rank_math_title.length} chars), truncado a 60`);
    fixed.rank_math_title = fixed.rank_math_title.slice(0, 57) + '...';
  }

  // Validar description
  if (!fixed.rank_math_description || fixed.rank_math_description.length === 0) {
    errores.push('Falta meta description');
  } else if (fixed.rank_math_description.length > 160) {
    advertencias.push(`Description muy larga (${fixed.rank_math_description.length} chars), truncada a 155`);
    fixed.rank_math_description = fixed.rank_math_description.slice(0, 152) + '...';
  }

  // Validar focus keyword
  if (!fixed.rank_math_focus_keyword || fixed.rank_math_focus_keyword.length < 3) {
    errores.push('Falta o es muy corta la focus keyword');
  }

  // Validar canonical URL
  if (!fixed.rank_math_canonical_url) {
    advertencias.push('Falta canonical URL, se usara la URL del producto');
  }

  // Validar schema
  if (!fixed.rank_math_schema_Product) {
    errores.push('Falta Schema Product');
  } else {
    try {
      const schema = typeof fixed.rank_math_schema_Product === 'string'
        ? JSON.parse(fixed.rank_math_schema_Product)
        : fixed.rank_math_schema_Product;

      if (!schema['@type'] || schema['@type'] !== 'Product') {
        errores.push('Schema no es tipo Product');
      }
    } catch (e) {
      errores.push('Schema JSON invalido');
    }
  }

  // Validar social media
  if (!fixed.rank_math_facebook_title) {
    advertencias.push('Falta titulo para Facebook');
    fixed.rank_math_facebook_title = fixed.rank_math_title;
  }
  if (!fixed.rank_math_twitter_title) {
    advertencias.push('Falta titulo para Twitter');
    fixed.rank_math_twitter_title = fixed.rank_math_title;
  }

  return {
    valido: errores.length === 0,
    data: fixed,
    errores,
    advertencias,
    resumen: errores.length === 0
      ? `SEO valido con ${advertencias.length} advertencias`
      : `SEO invalido: ${errores.length} errores, ${advertencias.length} advertencias`
  };
}

// ═══════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════

export default {
  generateRankMathMeta,
  analyzeRankMathScore,
  generateLSIKeywords,
  generateAltText,
  generateInternalLinks,
  validateAndFixSEOData,
  KEYWORDS_NICHO,
  SITE_URL,
  SITE_NAME
};
