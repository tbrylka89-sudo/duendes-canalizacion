// ═══════════════════════════════════════════════════════════════════════════════
// SEO UTILITIES - INDICE DE EXPORTACIONES
// Punto de entrada central para todas las utilidades de SEO
// ═══════════════════════════════════════════════════════════════════════════════

// Exportar todo desde schema.js
export {
  // Generadores de schemas individuales
  generateOrganizationSchema,
  generateLocalBusinessSchema,
  generateProductSchema,
  generateBreadcrumbSchema,
  generateWebSiteSchema,
  generateFAQSchema,
  generateItemListSchema,
  generateCollectionPageSchema,
  generateArticleSchema,

  // Utilidades
  combineSchemas,
  serializeSchema,

  // Schemas pre-construidos
  generateBaseSchemas,
  generateTiendaSchemas,
  generateProductoSchemas,

  // Constantes
  SITE_URL,
  SITE_NAME
} from './schema';

// Re-exportar el default de schema
export { default as schemaUtils } from './schema';

// ═══════════════════════════════════════════════════════════════════════════════
// RANKMATH SEO - Sistema completo para optimizacion SEO 100/100
// ═══════════════════════════════════════════════════════════════════════════════

export {
  // Generador principal de metadata RankMath
  generateRankMathMeta,

  // Analizador de score SEO
  analyzeRankMathScore,

  // Generador de LSI keywords
  generateLSIKeywords,

  // Generador de alt text para imagenes
  generateAltText,

  // Generador de enlaces internos
  generateInternalLinks,

  // Validador y corrector de datos SEO
  validateAndFixSEOData,

  // Keywords del nicho por categoria
  KEYWORDS_NICHO
} from './rankmath';

// Re-exportar el default de rankmath
export { default as rankMathUtils } from './rankmath';

// ═══════════════════════════════════════════════════════════════════════════════
// METADATA HELPERS - Funciones para metadata dinamico en Next.js
// ═══════════════════════════════════════════════════════════════════════════════

export {
  // Configuracion del sitio
  siteConfig,

  // Generadores de URLs
  getCanonicalUrl,
  getOpenGraphImage,

  // Generadores de metadata
  generateProductMetadata,
  generatePageMetadata,
  generatePrivateMetadata,

  // Keywords
  defaultKeywords,
  getCategoryKeywords
} from './metadata';

// Re-exportar todo de metadata como modulo
export * as metadataUtils from './metadata';

// ═══════════════════════════════════════════════════════════════════════════════
// TAGS GENERATOR - Sistema profesional de generación de tags
// ═══════════════════════════════════════════════════════════════════════════════

export {
  // Generador principal de tags
  generarTagsProducto,
  generarTagsWooCommerce,

  // Extractores especializados
  extraerTagsColores,
  extraerTagsDescripcion,

  // Keywords secundarias para RankMath
  generarKeywordsSecundarias,

  // Taxonomías
  TAGS_POR_TIPO,
  TAGS_POR_CATEGORIA,
  TAGS_POR_CRISTAL,
  TAGS_CARACTERISTICAS
} from './tags-generator';

// Re-exportar todo de tags-generator como modulo
export * as tagsUtils from './tags-generator';
