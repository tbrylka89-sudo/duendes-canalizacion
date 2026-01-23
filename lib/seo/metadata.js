// ═══════════════════════════════════════════════════════════════════════════════
// SISTEMA SEO - DUENDES DEL URUGUAY
// Funciones helper para metadata dinámico en Next.js
// ═══════════════════════════════════════════════════════════════════════════════

const SITE_NAME = 'Duendes del Uruguay';
const SITE_URL = 'https://duendesdeluruguay.com';
const DEFAULT_IMAGE = '/og-image.jpg';
const TWITTER_HANDLE = '@duendesuruguay';

/**
 * Configuracion base del sitio
 */
export const siteConfig = {
  name: SITE_NAME,
  url: SITE_URL,
  locale: 'es_UY',
  defaultImage: DEFAULT_IMAGE,
  twitter: TWITTER_HANDLE,
};

/**
 * Genera la URL canonica para una ruta
 * @param {string} path - Ruta relativa (ej: '/tienda', '/guardian/123')
 * @returns {string} URL canonica completa
 */
export function getCanonicalUrl(path = '') {
  // Limpiar la ruta
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${SITE_URL}${cleanPath}`;
}

/**
 * Genera la URL de imagen Open Graph
 * @param {Object} producto - Objeto producto con imagenes
 * @returns {string} URL de la imagen OG
 */
export function getOpenGraphImage(producto = null) {
  if (producto?.images?.[0]?.src) {
    return producto.images[0].src;
  }
  if (producto?.image?.src) {
    return producto.image.src;
  }
  return `${SITE_URL}${DEFAULT_IMAGE}`;
}

/**
 * Genera metadata completo para paginas de producto
 * @param {Object} producto - Objeto producto de WooCommerce
 * @returns {Object} Metadata de Next.js
 */
export function generateProductMetadata(producto) {
  if (!producto) {
    return {
      title: 'Guardian no encontrado',
      description: 'Este guardian magico no esta disponible.',
      robots: { index: false, follow: false },
    };
  }

  const { name, short_description, description, slug, price, categories } = producto;

  // Limpiar HTML de las descripciones
  const cleanDescription = (short_description || description || '')
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .trim()
    .slice(0, 155);

  const categoria = categories?.[0]?.name || 'Guardian Magico';
  const imageUrl = getOpenGraphImage(producto);
  const canonicalUrl = getCanonicalUrl(`/producto/${slug}`);

  return {
    title: name,
    description: cleanDescription || `${name} - Guardian magico artesanal de ${categoria}. Hecho a mano en Piriapolis, Uruguay.`,

    alternates: {
      canonical: canonicalUrl,
    },

    openGraph: {
      title: `${name} | ${SITE_NAME}`,
      description: cleanDescription || `Descubri a ${name}, un guardian magico artesanal creado especialmente para vos.`,
      url: canonicalUrl,
      siteName: SITE_NAME,
      locale: 'es_UY',
      type: 'website',
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: `${name} - Guardian Magico de Duendes del Uruguay`,
        },
      ],
    },

    twitter: {
      card: 'summary_large_image',
      title: `${name} | ${SITE_NAME}`,
      description: cleanDescription || `Descubri a ${name}, un guardian magico unico.`,
      images: [imageUrl],
      site: TWITTER_HANDLE,
      creator: TWITTER_HANDLE,
    },

    other: {
      'product:price:amount': price || '',
      'product:price:currency': 'USD',
      'product:availability': 'in stock',
    },
  };
}

/**
 * Genera metadata para paginas estaticas
 * @param {Object} config - Configuracion de la pagina
 * @param {string} config.title - Titulo de la pagina
 * @param {string} config.description - Descripcion SEO
 * @param {string} config.path - Ruta de la pagina
 * @param {string} [config.image] - Imagen OG personalizada
 * @param {boolean} [config.noIndex] - Si debe ser noindex
 * @param {string} [config.type] - Tipo OG (website, article, etc)
 * @returns {Object} Metadata de Next.js
 */
export function generatePageMetadata({
  title,
  description,
  path = '',
  image = null,
  noIndex = false,
  type = 'website',
}) {
  const canonicalUrl = getCanonicalUrl(path);
  const imageUrl = image || `${SITE_URL}${DEFAULT_IMAGE}`;

  const metadata = {
    title,
    description,

    alternates: {
      canonical: canonicalUrl,
    },

    openGraph: {
      title: `${title} | ${SITE_NAME}`,
      description,
      url: canonicalUrl,
      siteName: SITE_NAME,
      locale: 'es_UY',
      type,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: `${title} - ${SITE_NAME}`,
        },
      ],
    },

    twitter: {
      card: 'summary_large_image',
      title: `${title} | ${SITE_NAME}`,
      description,
      images: [imageUrl],
      site: TWITTER_HANDLE,
      creator: TWITTER_HANDLE,
    },
  };

  // Agregar robots noindex si es necesario
  if (noIndex) {
    metadata.robots = {
      index: false,
      follow: false,
      googleBot: {
        index: false,
        follow: false,
      },
    };
  }

  return metadata;
}

/**
 * Genera metadata para paginas privadas (noindex)
 * @param {string} title - Titulo de la pagina
 * @param {string} [description] - Descripcion opcional
 * @returns {Object} Metadata con noindex
 */
export function generatePrivateMetadata(title, description = 'Contenido privado') {
  return {
    title,
    description,
    robots: {
      index: false,
      follow: false,
      googleBot: {
        index: false,
        follow: false,
        'max-image-preview': 'none',
        'max-snippet': -1,
      },
    },
  };
}

/**
 * Keywords base para el sitio
 */
export const defaultKeywords = [
  'duendes',
  'guardianes magicos',
  'artesania espiritual',
  'duendes hechos a mano',
  'Piriapolis Uruguay',
  'figuras magicas',
  'proteccion energetica',
  'sanacion espiritual',
  'abundancia',
  'amuletos',
  'canalizacion',
  'lectura energetica',
  'Uruguay',
  'esoterismo',
  'misticismo',
];

/**
 * Genera keywords para una categoria especifica
 * @param {string} categoria - Nombre de la categoria
 * @returns {string[]} Array de keywords
 */
export function getCategoryKeywords(categoria) {
  const categoryKeywords = {
    proteccion: ['proteccion energetica', 'amuleto protector', 'defensa espiritual', 'escudo magico'],
    amor: ['amor propio', 'relaciones', 'conexion emocional', 'corazon abierto'],
    abundancia: ['abundancia', 'prosperidad', 'dinero', 'negocios', 'exito financiero'],
    salud: ['sanacion', 'bienestar', 'salud energetica', 'equilibrio'],
    sabiduria: ['sabiduria', 'claridad mental', 'guia espiritual', 'intuicion'],
  };

  const catKey = categoria?.toLowerCase().replace(/[^a-z]/g, '') || '';
  const specific = categoryKeywords[catKey] || [];

  return [...defaultKeywords, ...specific];
}
