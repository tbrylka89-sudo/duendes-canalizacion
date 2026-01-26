// ═══════════════════════════════════════════════════════════════════════════════
// SISTEMA DE SCHEMA MARKUP (JSON-LD) PARA SEO
// Duendes del Uruguay - Generadores de datos estructurados
// ═══════════════════════════════════════════════════════════════════════════════

const SITE_URL = 'https://duendesdeluruguay.com';
const SITE_NAME = 'Duendes del Uruguay';
const SITE_DESCRIPTION = 'Guardianes artesanales nacidos en Piriapolis, Uruguay. Cada duende es una pieza unica, creada con amor y destinada a encontrar a su humano.';

// Coordenadas de Piriapolis, Maldonado, Uruguay
const GEO = {
  latitude: -34.8667,
  longitude: -55.2833
};

const LOGO_URL = `${SITE_URL}/icon-512.png`;
const DEFAULT_IMAGE = `${SITE_URL}/og-image.jpg`;

// ═══════════════════════════════════════════════════════════════════════════════
// SCHEMA DE ORGANIZATION
// Para usar en toda la web - identifica la marca
// ═══════════════════════════════════════════════════════════════════════════════

export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${SITE_URL}/#organization`,
    name: SITE_NAME,
    url: SITE_URL,
    logo: {
      '@type': 'ImageObject',
      url: LOGO_URL,
      width: 512,
      height: 512
    },
    image: DEFAULT_IMAGE,
    description: SITE_DESCRIPTION,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Piriapolis',
      addressRegion: 'Maldonado',
      addressCountry: 'UY'
    },
    // Agregar redes sociales cuando esten disponibles
    sameAs: [
      // 'https://www.instagram.com/duendesdeluruguay',
      // 'https://www.facebook.com/duendesdeluruguay',
    ].filter(Boolean),
    foundingDate: '2020',
    founder: {
      '@type': 'Person',
      name: 'Thibisay'
    }
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// SCHEMA DE LOCAL BUSINESS
// Para SEO local - tienda fisica/taller en Piriapolis
// ═══════════════════════════════════════════════════════════════════════════════

export function generateLocalBusinessSchema(options = {}) {
  const {
    telephone = null,
    email = null,
    priceRange = '$$',
    openingHours = null, // Formato: "Mo-Fr 10:00-18:00"
  } = options;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'ArtStore', // Subtipo de LocalBusiness
    '@id': `${SITE_URL}/#localbusiness`,
    name: SITE_NAME,
    description: 'Taller artesanal de guardianes magicos. Cada pieza es unica, creada a mano con materiales naturales y energia amorosa.',
    url: SITE_URL,
    image: DEFAULT_IMAGE,
    logo: LOGO_URL,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Piriapolis',
      addressRegion: 'Maldonado',
      postalCode: '20200',
      addressCountry: 'UY'
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: GEO.latitude,
      longitude: GEO.longitude
    },
    priceRange: priceRange,
    currenciesAccepted: 'USD',
    paymentAccepted: 'Visa, MasterCard, American Express, Bank Transfer',
    areaServed: {
      '@type': 'Country',
      name: 'Worldwide'
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Guardianes Artesanales',
      itemListElement: [
        {
          '@type': 'OfferCatalog',
          name: 'Guardianes de Proteccion'
        },
        {
          '@type': 'OfferCatalog',
          name: 'Guardianes de Amor'
        },
        {
          '@type': 'OfferCatalog',
          name: 'Guardianes de Abundancia'
        },
        {
          '@type': 'OfferCatalog',
          name: 'Guardianes de Sanacion'
        },
        {
          '@type': 'OfferCatalog',
          name: 'Guardianes de Sabiduria'
        }
      ]
    }
  };

  // Agregar campos opcionales si estan disponibles
  if (telephone) {
    schema.telephone = telephone;
  }

  if (email) {
    schema.email = email;
  }

  if (openingHours) {
    schema.openingHoursSpecification = parseOpeningHours(openingHours);
  }

  return schema;
}

// Helper para parsear horarios de apertura
function parseOpeningHours(hoursString) {
  // Ejemplo simple: "Mo-Fr 10:00-18:00, Sa 10:00-14:00"
  const specs = hoursString.split(',').map(spec => {
    const [days, hours] = spec.trim().split(' ');
    const [opens, closes] = hours.split('-');
    return {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: days,
      opens: opens,
      closes: closes
    };
  });
  return specs;
}

// ═══════════════════════════════════════════════════════════════════════════════
// SCHEMA DE PRODUCT
// Para paginas de producto individual
// ═══════════════════════════════════════════════════════════════════════════════

export function generateProductSchema(producto) {
  const {
    id,
    name,
    description,
    price,
    images = [],
    slug,
    sku,
    categories = [],
    stock_status = 'instock',
    average_rating,
    rating_count,
    permalink
  } = producto;

  // Limpiar descripcion HTML
  const cleanDescription = description
    ? description.replace(/<[^>]*>/g, '').substring(0, 500)
    : `${name} - Guardian artesanal de Duendes del Uruguay`;

  // Determinar disponibilidad
  const availability = stock_status === 'instock'
    ? 'https://schema.org/InStock'
    : stock_status === 'outofstock'
      ? 'https://schema.org/OutOfStock'
      : 'https://schema.org/PreOrder';

  // URL del producto
  const productUrl = permalink || `${SITE_URL}/product/${slug}/`;

  // Imagen principal
  const mainImage = images[0]?.src || DEFAULT_IMAGE;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    '@id': `${SITE_URL}/product/${slug}/#product`,
    name: name,
    description: cleanDescription,
    image: images.length > 0 ? images.map(img => img.src) : [DEFAULT_IMAGE],
    sku: sku || `DUENDE-${id}`,
    mpn: `DUENDE-${id}`,
    brand: {
      '@type': 'Brand',
      name: SITE_NAME,
      logo: LOGO_URL
    },
    manufacturer: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL
    },
    offers: {
      '@type': 'Offer',
      url: productUrl,
      priceCurrency: 'USD',
      price: parseFloat(price) || 0,
      availability: availability,
      seller: {
        '@type': 'Organization',
        name: SITE_NAME
      },
      shippingDetails: {
        '@type': 'OfferShippingDetails',
        shippingDestination: {
          '@type': 'DefinedRegion',
          addressCountry: 'Worldwide'
        },
        deliveryTime: {
          '@type': 'ShippingDeliveryTime',
          handlingTime: {
            '@type': 'QuantitativeValue',
            minValue: 1,
            maxValue: 5,
            unitCode: 'DAY'
          },
          transitTime: {
            '@type': 'QuantitativeValue',
            minValue: 7,
            maxValue: 21,
            unitCode: 'DAY'
          }
        }
      },
      hasMerchantReturnPolicy: {
        '@type': 'MerchantReturnPolicy',
        applicableCountry: 'UY',
        returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
        merchantReturnDays: 30,
        returnMethod: 'https://schema.org/ReturnByMail'
      }
    },
    // Categoria del producto
    category: categories.length > 0
      ? categories.map(cat => cat.name).join(' > ')
      : 'Guardianes Artesanales',
    // Material (productos artesanales)
    material: 'Materiales naturales, arcilla, telas',
    // Audiencia
    audience: {
      '@type': 'PeopleAudience',
      suggestedMinAge: 18
    },
    // Pais de origen
    countryOfOrigin: {
      '@type': 'Country',
      name: 'Uruguay'
    },
    // Es pieza unica
    isAccessoryOrSparePartFor: null,
    isSimilarTo: null
  };

  // Agregar rating si existe
  if (average_rating && rating_count && rating_count > 0) {
    schema.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: parseFloat(average_rating),
      reviewCount: parseInt(rating_count),
      bestRating: 5,
      worstRating: 1
    };
  }

  return schema;
}

// ═══════════════════════════════════════════════════════════════════════════════
// SCHEMA DE BREADCRUMB LIST
// Para navegacion estructurada
// ═══════════════════════════════════════════════════════════════════════════════

export function generateBreadcrumbSchema(items) {
  // items = [{ name: 'Home', url: '/' }, { name: 'Tienda', url: '/tienda' }, ...]

  if (!items || items.length === 0) {
    return null;
  }

  const itemListElement = items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: item.url.startsWith('http') ? item.url : `${SITE_URL}${item.url}`
  }));

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// SCHEMA DE WEBSITE
// Para habilitar search box en Google
// ═══════════════════════════════════════════════════════════════════════════════

export function generateWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    name: SITE_NAME,
    alternateName: 'Duendes Uruguay',
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    inLanguage: 'es',
    publisher: {
      '@id': `${SITE_URL}/#organization`
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/tienda?search={search_term_string}`
      },
      'query-input': 'required name=search_term_string'
    }
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// SCHEMA DE FAQ PAGE
// Para paginas con preguntas frecuentes
// ═══════════════════════════════════════════════════════════════════════════════

export function generateFAQSchema(faqs) {
  // faqs = [{ question: '...', answer: '...' }, ...]

  if (!faqs || faqs.length === 0) {
    return null;
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// SCHEMA DE ITEM LIST
// Para paginas de coleccion/tienda con multiples productos
// ═══════════════════════════════════════════════════════════════════════════════

export function generateItemListSchema(productos, options = {}) {
  const {
    listName = 'Guardianes Disponibles',
    listDescription = 'Coleccion de guardianes artesanales unicos'
  } = options;

  if (!productos || productos.length === 0) {
    return null;
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: listName,
    description: listDescription,
    numberOfItems: productos.length,
    itemListElement: productos.slice(0, 50).map((producto, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Product',
        '@id': `${SITE_URL}/product/${producto.slug}/#product`,
        name: producto.name,
        image: producto.images?.[0]?.src || DEFAULT_IMAGE,
        url: producto.permalink || `${SITE_URL}/product/${producto.slug}/`,
        offers: {
          '@type': 'Offer',
          price: parseFloat(producto.price) || 0,
          priceCurrency: 'USD',
          availability: producto.stock_status === 'instock'
            ? 'https://schema.org/InStock'
            : 'https://schema.org/OutOfStock'
        }
      }
    }))
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// SCHEMA DE COLLECTION PAGE
// Para paginas de categoria
// ═══════════════════════════════════════════════════════════════════════════════

export function generateCollectionPageSchema(options = {}) {
  const {
    name = 'Tienda de Guardianes',
    description = 'Explora nuestra coleccion de guardianes artesanales unicos',
    url = '/tienda'
  } = options;

  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${SITE_URL}${url}/#collectionpage`,
    name: name,
    description: description,
    url: `${SITE_URL}${url}`,
    isPartOf: {
      '@id': `${SITE_URL}/#website`
    },
    about: {
      '@type': 'Thing',
      name: 'Guardianes Artesanales',
      description: 'Duendes y seres magicos creados artesanalmente en Uruguay'
    },
    mainEntity: {
      '@id': `${SITE_URL}${url}/#itemlist`
    }
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// SCHEMA DE ARTICLE / BLOG POST
// Para contenido de blog o historias
// ═══════════════════════════════════════════════════════════════════════════════

export function generateArticleSchema(article) {
  const {
    title,
    description,
    content,
    image,
    url,
    datePublished,
    dateModified,
    author = 'Thibisay'
  } = article;

  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description: description,
    image: image || DEFAULT_IMAGE,
    url: url.startsWith('http') ? url : `${SITE_URL}${url}`,
    datePublished: datePublished,
    dateModified: dateModified || datePublished,
    author: {
      '@type': 'Person',
      name: author,
      url: SITE_URL
    },
    publisher: {
      '@id': `${SITE_URL}/#organization`
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url.startsWith('http') ? url : `${SITE_URL}${url}`
    }
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// UTILIDADES
// ═══════════════════════════════════════════════════════════════════════════════

// Combinar multiples schemas en un array @graph
export function combineSchemas(...schemas) {
  const validSchemas = schemas.filter(Boolean);

  if (validSchemas.length === 0) {
    return null;
  }

  if (validSchemas.length === 1) {
    return validSchemas[0];
  }

  // Remover @context de schemas individuales y combinar en @graph
  return {
    '@context': 'https://schema.org',
    '@graph': validSchemas.map(schema => {
      const { '@context': _, ...rest } = schema;
      return rest;
    })
  };
}

// Serializar schema a JSON string seguro para HTML
export function serializeSchema(schema) {
  if (!schema) return null;
  return JSON.stringify(schema, null, 0)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026');
}

// ═══════════════════════════════════════════════════════════════════════════════
// SCHEMAS PRE-CONSTRUIDOS PARA USO COMUN
// ═══════════════════════════════════════════════════════════════════════════════

// Schema base para toda la web (Organization + WebSite)
export function generateBaseSchemas() {
  return combineSchemas(
    generateOrganizationSchema(),
    generateWebSiteSchema()
  );
}

// Schema para la pagina de tienda
export function generateTiendaSchemas(productos) {
  const breadcrumbs = generateBreadcrumbSchema([
    { name: 'Inicio', url: '/' },
    { name: 'Tienda', url: '/tienda' }
  ]);

  const itemList = generateItemListSchema(productos);
  const collectionPage = generateCollectionPageSchema();

  return combineSchemas(breadcrumbs, itemList, collectionPage);
}

// Schema para pagina de producto individual
export function generateProductoSchemas(producto, categoria = null) {
  const breadcrumbItems = [
    { name: 'Inicio', url: '/' },
    { name: 'Tienda', url: '/tienda' }
  ];

  if (categoria) {
    breadcrumbItems.push({
      name: categoria.name,
      url: `/tienda?categoria=${categoria.slug}`
    });
  }

  breadcrumbItems.push({
    name: producto.name,
    url: `/product/${producto.slug}`
  });

  const breadcrumbs = generateBreadcrumbSchema(breadcrumbItems);
  const productSchema = generateProductSchema(producto);

  return combineSchemas(breadcrumbs, productSchema);
}

export default {
  generateOrganizationSchema,
  generateLocalBusinessSchema,
  generateProductSchema,
  generateBreadcrumbSchema,
  generateWebSiteSchema,
  generateFAQSchema,
  generateItemListSchema,
  generateCollectionPageSchema,
  generateArticleSchema,
  combineSchemas,
  serializeSchema,
  generateBaseSchemas,
  generateTiendaSchemas,
  generateProductoSchemas,
  SITE_URL,
  SITE_NAME
};
