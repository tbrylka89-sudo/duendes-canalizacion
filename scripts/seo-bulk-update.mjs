/**
 * Script de ejecucion directa: SEO Bulk Update
 * Ejecuta el bulk update de SEO para productos WooCommerce
 *
 * Uso: node scripts/seo-bulk-update.mjs
 */

import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

// Cargar .env.local manualmente
const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = resolve(__dirname, '..', '.env.local');
const envContent = readFileSync(envPath, 'utf-8');
envContent.split('\n').forEach(line => {
  const trimmedLine = line.trim();
  if (!trimmedLine || trimmedLine.startsWith('#')) return;
  const eqIndex = trimmedLine.indexOf('=');
  if (eqIndex > 0) {
    const key = trimmedLine.slice(0, eqIndex);
    let value = trimmedLine.slice(eqIndex + 1);
    // Quitar comillas
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    process.env[key] = value;
  }
});

// Configuracion
const WOOCOMMERCE_URL = process.env.WORDPRESS_URL || 'https://duendesdeluruguay.com';
const WOOCOMMERCE_KEY = process.env.WC_CONSUMER_KEY;
const WOOCOMMERCE_SECRET = process.env.WC_CONSUMER_SECRET;
const BATCH_SIZE = 10;
const DELAY_BETWEEN_UPDATES = 500;

console.log('='.repeat(60));
console.log('SEO BULK UPDATE - Duendes del Uruguay');
console.log('='.repeat(60));
console.log(`URL: ${WOOCOMMERCE_URL}`);
console.log(`KEY: ${WOOCOMMERCE_KEY ? WOOCOMMERCE_KEY.slice(0, 10) + '...' : 'NOT SET'}`);
console.log(`SECRET: ${WOOCOMMERCE_SECRET ? '***' : 'NOT SET'}`);
console.log('='.repeat(60));

// ===================================================================
// FUNCIONES SEO (copiadas de lib/seo/rankmath.js)
// ===================================================================

const SITE_URL = 'https://duendesdeluruguay.com';
const SITE_NAME = 'Duendes del Uruguay';
const DEFAULT_IMAGE = `${SITE_URL}/images/og-default.jpg`;

const KEYWORDS_NICHO = {
  proteccion: {
    principal: ['duendes proteccion', 'guardian protector', 'amuleto proteccion'],
    lsi: ['duendes uruguay', 'guardianes magicos', 'proteccion hogar', 'amuletos proteccion', 'energia positiva', 'figuras misticas', 'duendes hechos a mano', 'artesania mistica', 'piriapolis', 'proteccion energetica', 'escudo energetico', 'guardian espiritual']
  },
  abundancia: {
    principal: ['duende abundancia', 'guardian abundancia', 'amuleto prosperidad'],
    lsi: ['duendes uruguay', 'prosperidad abundancia', 'atraer abundancia', 'energia dinero', 'guardianes prosperidad', 'figuras misticas', 'amuletos prosperidad', 'artesania espiritual', 'piriapolis', 'flujo abundancia', 'desbloquear dinero', 'guardian riqueza']
  },
  amor: {
    principal: ['duende amor', 'guardian amor', 'amuleto amor'],
    lsi: ['duendes uruguay', 'energia amor', 'guardianes corazon', 'regalo espiritual', 'figuras misticas', 'sanacion corazon', 'amuletos amor', 'artesania mistica', 'piriapolis', 'autoamor', 'relaciones sanas', 'energia rosa']
  },
  sanacion: {
    principal: ['duende sanacion', 'guardian sanador', 'amuleto sanacion'],
    lsi: ['duendes uruguay', 'sanacion espiritual', 'energia sanadora', 'guardianes sanacion', 'figuras misticas', 'bienestar espiritual', 'artesania mistica', 'regalo espiritual', 'piriapolis', 'sanacion emocional', 'cristales sanacion', 'energia curativa']
  },
  sabiduria: {
    principal: ['duende sabiduria', 'guardian sabio', 'amuleto sabiduria'],
    lsi: ['duendes uruguay', 'sabiduria ancestral', 'guardianes sabios', 'energia sabiduria', 'figuras misticas', 'artesania espiritual', 'amuletos sabiduria', 'regalo espiritual', 'piriapolis', 'claridad mental', 'intuicion', 'guia espiritual']
  },
  salud: {
    principal: ['duende salud', 'guardian salud', 'amuleto bienestar'],
    lsi: ['duendes uruguay', 'bienestar salud', 'energia sanadora', 'guardianes salud', 'figuras misticas', 'sanacion espiritual', 'artesania mistica', 'regalo espiritual', 'piriapolis', 'equilibrio cuerpo', 'vitalidad', 'energia vital']
  }
};

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

function normalizeSlug(text) {
  return text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 100);
}

function normalizeCategoria(categoria) {
  return (categoria || 'proteccion').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function exactLength(text, targetLength) {
  if (text.length === targetLength) return text;
  if (text.length > targetLength) return text.slice(0, targetLength - 3) + '...';
  const paddings = [' Envio internacional.', ' Hecho a mano.', ' Pieza unica.', ' Uruguay.', ' Artesanal.', ''];
  for (const padding of paddings) {
    const combined = text + padding;
    if (combined.length <= targetLength) {
      return combined.padEnd(targetLength).slice(0, targetLength);
    }
  }
  return text.slice(0, targetLength);
}

function generateRankMathMeta(producto) {
  const { id, nombre, tipo = 'duende', categoria = 'proteccion', descripcion = '', precio = 0, imagen = '', imagenes = [], tamanoCm = 18, accesorios = [], esUnico = true, sku = '' } = producto;

  const categoriaNorm = normalizeCategoria(categoria);
  const tipoNorm = tipo.toLowerCase();
  const tipoInfo = TIPOS_ARTICULOS[tipoNorm] || TIPOS_ARTICULOS.guardian;
  const keywordsCategoria = KEYWORDS_NICHO[categoriaNorm] || KEYWORDS_NICHO.proteccion;

  const focusKeyword = `${tipoNorm} ${categoriaNorm}`;

  let seoTitle = `${capitalize(tipoNorm)} ${capitalize(categoriaNorm)}: ${nombre} | ${SITE_NAME}`;
  if (seoTitle.length > 60) {
    seoTitle = `${nombre} - ${capitalize(tipoNorm)} ${capitalize(categoriaNorm)} | Uruguay`;
  }
  if (seoTitle.length > 60) {
    seoTitle = `${nombre} | ${capitalize(tipoNorm)} de ${capitalize(categoriaNorm)}`;
  }
  seoTitle = exactLength(seoTitle, 60);

  let metaDescription = `${nombre} es ${tipoInfo.articulo} ${tipoNorm} de ${categoriaNorm} hecho a mano en Uruguay. Pieza ${esUnico ? 'unica' : 'artesanal'} con cristales reales y energia canalizada.`;
  metaDescription = exactLength(metaDescription, 155);

  const slug = normalizeSlug(`${tipoNorm}-${categoriaNorm}-${nombre}`);
  const canonicalUrl = `${SITE_URL}/producto/${slug}`;

  const schemaProduct = {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${canonicalUrl}#product`,
    "name": nombre,
    "description": metaDescription,
    "sku": sku || `DU-${id || Date.now()}`,
    "mpn": `DU-${tipoNorm.slice(0, 2).toUpperCase()}-${id || Date.now()}`,
    "image": imagenes.length > 0 ? imagenes : [imagen || DEFAULT_IMAGE],
    "brand": { "@type": "Brand", "name": SITE_NAME, "logo": `${SITE_URL}/images/logo.png` },
    "offers": {
      "@type": "Offer",
      "url": canonicalUrl,
      "price": precio,
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock",
      "itemCondition": "https://schema.org/NewCondition"
    }
  };

  const socialImage = imagen || (imagenes && imagenes[0]) || DEFAULT_IMAGE;

  return {
    rank_math_title: seoTitle,
    rank_math_description: metaDescription,
    rank_math_focus_keyword: focusKeyword,
    rank_math_robots: 'index,follow,max-snippet:-1,max-image-preview:large,max-video-preview:-1',
    rank_math_canonical_url: canonicalUrl,
    rank_math_schema_Product: JSON.stringify(schemaProduct),
    rank_math_facebook_title: exactLength(`${nombre} - ${capitalize(tipoNorm)} de ${capitalize(categoriaNorm)}`, 60),
    rank_math_facebook_description: exactLength(`Descubri a ${nombre}, ${tipoInfo.articulo} ${tipoNorm} de ${categoriaNorm} canalizado a mano en Piriapolis. Pieza ${esUnico ? 'unica' : 'artesanal'} con cristales reales.`, 155),
    rank_math_facebook_image: socialImage,
    rank_math_twitter_title: exactLength(`${nombre} | ${capitalize(tipoNorm)} de ${capitalize(categoriaNorm)}`, 60),
    rank_math_twitter_description: exactLength(`${nombre}: ${tipoInfo.articulo} ${tipoNorm} de ${categoriaNorm} hecho a mano en Uruguay. Energia canalizada y cristales naturales.`, 155),
    rank_math_twitter_card_type: 'summary_large_image',
    _seo_data: {
      focusKeyword,
      lsiKeywords: keywordsCategoria.lsi,
      slug,
      canonicalUrl
    }
  };
}

function generateLSIKeywords(producto) {
  const { tipo = 'duende', categoria = 'proteccion' } = producto;
  const categoriaNorm = normalizeCategoria(categoria);
  const keywordsCategoria = KEYWORDS_NICHO[categoriaNorm] || KEYWORDS_NICHO.proteccion;
  return {
    principal: keywordsCategoria.principal,
    todas: keywordsCategoria.lsi
  };
}

function validateAndFixSEOData(seoData) {
  const errores = [];
  const advertencias = [];
  const fixed = { ...seoData };

  if (!fixed.rank_math_title || fixed.rank_math_title.length === 0) {
    errores.push('Falta titulo SEO');
  } else if (fixed.rank_math_title.length > 60) {
    advertencias.push(`Titulo muy largo (${fixed.rank_math_title.length} chars)`);
    fixed.rank_math_title = fixed.rank_math_title.slice(0, 57) + '...';
  }

  if (!fixed.rank_math_description || fixed.rank_math_description.length === 0) {
    errores.push('Falta meta description');
  }

  if (!fixed.rank_math_focus_keyword || fixed.rank_math_focus_keyword.length < 3) {
    errores.push('Falta focus keyword');
  }

  return { valido: errores.length === 0, data: fixed, errores, advertencias };
}

// ===================================================================
// FUNCIONES WOOCOMMERCE
// ===================================================================

async function getWooProduct(productId) {
  const url = `${WOOCOMMERCE_URL}/wp-json/wc/v3/products/${productId}`;
  const auth = Buffer.from(`${WOOCOMMERCE_KEY}:${WOOCOMMERCE_SECRET}`).toString('base64');

  const response = await fetch(url, {
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error(`Error obteniendo producto ${productId}: ${response.status}`);
  }

  return response.json();
}

async function updateWooProductSEO(productId, seoData) {
  const url = `${WOOCOMMERCE_URL}/wp-json/wc/v3/products/${productId}`;
  const auth = Buffer.from(`${WOOCOMMERCE_KEY}:${WOOCOMMERCE_SECRET}`).toString('base64');

  const meta_data = [];

  if (seoData.rank_math_title) meta_data.push({ key: 'rank_math_title', value: seoData.rank_math_title });
  if (seoData.rank_math_description) meta_data.push({ key: 'rank_math_description', value: seoData.rank_math_description });
  if (seoData.rank_math_focus_keyword) meta_data.push({ key: 'rank_math_focus_keyword', value: seoData.rank_math_focus_keyword });
  if (seoData.rank_math_robots) meta_data.push({ key: 'rank_math_robots', value: seoData.rank_math_robots });
  if (seoData.rank_math_canonical_url) meta_data.push({ key: 'rank_math_canonical_url', value: seoData.rank_math_canonical_url });
  if (seoData.rank_math_schema_Product) meta_data.push({ key: 'rank_math_schema_Product', value: seoData.rank_math_schema_Product });
  if (seoData.rank_math_facebook_title) meta_data.push({ key: 'rank_math_facebook_title', value: seoData.rank_math_facebook_title });
  if (seoData.rank_math_facebook_description) meta_data.push({ key: 'rank_math_facebook_description', value: seoData.rank_math_facebook_description });
  if (seoData.rank_math_facebook_image) meta_data.push({ key: 'rank_math_facebook_image', value: seoData.rank_math_facebook_image });
  if (seoData.rank_math_twitter_title) meta_data.push({ key: 'rank_math_twitter_title', value: seoData.rank_math_twitter_title });
  if (seoData.rank_math_twitter_description) meta_data.push({ key: 'rank_math_twitter_description', value: seoData.rank_math_twitter_description });
  if (seoData.rank_math_twitter_card_type) meta_data.push({ key: 'rank_math_twitter_card_type', value: seoData.rank_math_twitter_card_type });

  if (seoData._seo_data?.lsiKeywords) {
    meta_data.push({ key: '_duendes_lsi_keywords', value: JSON.stringify(seoData._seo_data.lsiKeywords) });
  }

  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ meta_data })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Error actualizando producto ${productId}: ${response.status} - ${errorText}`);
  }

  return response.json();
}

function extractProductData(wooProduct) {
  const categorias = wooProduct.categories || [];
  const categoriaPrincipal = categorias[0]?.name || 'proteccion';

  const tags = wooProduct.tags || [];
  const tipoTag = tags.find(t => ['duende', 'pixie', 'bruja', 'guardian', 'leprechaun', 'gnomo', 'mago'].includes(t.name?.toLowerCase()));
  let tipo = tipoTag?.name || 'guardian';

  const nombreLower = (wooProduct.name || '').toLowerCase();
  if (!tipoTag) {
    if (nombreLower.includes('pixie')) tipo = 'pixie';
    else if (nombreLower.includes('bruja')) tipo = 'bruja';
    else if (nombreLower.includes('duende')) tipo = 'duende';
    else if (nombreLower.includes('leprechaun')) tipo = 'leprechaun';
  }

  const imagenes = (wooProduct.images || []).map(img => img.src);
  const imagenPrincipal = imagenes[0] || '';

  const atributos = wooProduct.attributes || [];
  const accesoriosAttr = atributos.find(a => a.name?.toLowerCase().includes('accesorio') || a.name?.toLowerCase().includes('cristal'));
  const accesorios = accesoriosAttr?.options || [];

  const tamanoAttr = atributos.find(a => a.name?.toLowerCase().includes('tamano') || a.name?.toLowerCase().includes('altura'));
  const tamanoCm = parseInt(tamanoAttr?.options?.[0]) || 18;

  const esUnico = wooProduct.stock_quantity === 1 || wooProduct.manage_stock === false;

  return {
    id: wooProduct.id,
    nombre: wooProduct.name,
    tipo,
    categoria: categoriaPrincipal.toLowerCase().replace('proteccion', 'proteccion').replace('sanacion', 'sanacion').replace('sabiduria', 'sabiduria'),
    descripcion: wooProduct.description || wooProduct.short_description || '',
    precio: parseFloat(wooProduct.price) || 0,
    imagen: imagenPrincipal,
    imagenes,
    tamanoCm,
    accesorios,
    esUnico,
    sku: wooProduct.sku || ''
  };
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ===================================================================
// MAIN
// ===================================================================

async function main() {
  // TODOS los 122 productos de WooCommerce
  const productIds = [
    // Página 1 (100 productos)
    4776, 4777, 4778, 4774, 4775, 4771, 4772, 4773, 4740, 4732,
    4722, 4712, 4707, 4704, 4702, 4697, 4694, 4691, 4689, 4687,
    4685, 4683, 4681, 4679, 4677, 4675, 4673, 4671, 4662, 4660,
    4658, 4656, 4612, 4603, 4591, 4584, 4582, 4580, 4572, 4567,
    4556, 4547, 4544, 4542, 4538, 4536, 4532, 4530, 4528, 4525,
    4522, 4520, 4518, 4516, 4512, 4510, 4508, 4506, 4502, 4500,
    4497, 4495, 4493, 4491, 4467, 4389, 4324, 4244, 4207, 4145,
    3622, 3618, 3004, 2998, 2994, 2993, 2992, 2987, 2991, 2990,
    2989, 2988, 2986, 2982, 2981, 2969, 263, 264, 261, 262,
    259, 260, 253, 255, 247, 248, 252, 246, 240, 241,
    // Página 2 (22 productos)
    242, 244, 237, 239, 231, 232, 222, 217, 202, 191,
    192, 193, 194, 195, 188, 189, 186, 187, 182, 183,
    185, 178
  ];
  const dryRun = false;
  const forceUpdate = true; // Forzar actualizacion aunque ya tengan SEO

  console.log(`\nProcesando ${productIds.length} productos...`);
  console.log(`Modo: ${dryRun ? 'DRY RUN (simulacion)' : 'ACTUALIZACION REAL'}`);
  console.log(`Force Update: ${forceUpdate}`);
  console.log('');

  const results = {
    total: productIds.length,
    procesados: 0,
    actualizados: 0,
    errores: 0,
    omitidos: 0,
    detalles: []
  };

  for (let i = 0; i < productIds.length; i += BATCH_SIZE) {
    const batchIds = productIds.slice(i, i + BATCH_SIZE);
    const batchNumber = Math.floor(i / BATCH_SIZE) + 1;
    const totalBatches = Math.ceil(productIds.length / BATCH_SIZE);

    console.log(`\n[Batch ${batchNumber}/${totalBatches}] Procesando ${batchIds.length} productos...`);

    for (const productId of batchIds) {
      results.procesados++;

      try {
        console.log(`  - Obteniendo producto ${productId}...`);
        const product = await getWooProduct(productId);

        // Verificar si ya tiene SEO
        const existingMeta = product.meta_data || [];
        const hasRankMathTitle = existingMeta.some(m => m.key === 'rank_math_title' && m.value);

        if (hasRankMathTitle && !forceUpdate) {
          results.omitidos++;
          results.detalles.push({
            id: productId,
            nombre: product.name,
            status: 'omitido',
            razon: 'Ya tiene SEO configurado'
          });
          console.log(`    -> Omitido (ya tiene SEO): ${product.name}`);
          continue;
        }

        // Extraer datos
        const productData = extractProductData(product);

        // Generar SEO
        const seoData = generateRankMathMeta(productData);
        const lsiKeywords = generateLSIKeywords(productData);
        seoData._seo_data = seoData._seo_data || {};
        seoData._seo_data.lsiKeywords = lsiKeywords.todas;

        // Validar
        const validation = validateAndFixSEOData(seoData);

        // Actualizar
        if (!dryRun) {
          await updateWooProductSEO(productId, validation.data);
          await delay(DELAY_BETWEEN_UPDATES);
        }

        results.actualizados++;
        results.detalles.push({
          id: productId,
          nombre: product.name,
          status: dryRun ? 'simulado' : 'actualizado',
          seo: {
            focusKeyword: validation.data.rank_math_focus_keyword,
            title: validation.data.rank_math_title,
            description: validation.data.rank_math_description?.slice(0, 50) + '...'
          }
        });

        console.log(`    -> ${dryRun ? 'Simulado' : 'Actualizado'}: ${product.name}`);
        console.log(`       Focus: ${validation.data.rank_math_focus_keyword}`);

      } catch (error) {
        results.errores++;
        results.detalles.push({
          id: productId,
          status: 'error',
          error: error.message
        });
        console.log(`    -> ERROR: ${error.message}`);
      }
    }
  }

  // Resumen
  console.log('\n' + '='.repeat(60));
  console.log('RESUMEN FINAL');
  console.log('='.repeat(60));
  console.log(`Total productos: ${results.total}`);
  console.log(`Procesados: ${results.procesados}`);
  console.log(`Actualizados: ${results.actualizados}`);
  console.log(`Omitidos: ${results.omitidos}`);
  console.log(`Errores: ${results.errores}`);
  console.log(`Porcentaje exito: ${Math.round((results.actualizados / results.procesados) * 100)}%`);
  console.log('='.repeat(60));

  // Detalle de errores si hay
  const errores = results.detalles.filter(d => d.status === 'error');
  if (errores.length > 0) {
    console.log('\nDETALLE DE ERRORES:');
    errores.forEach(e => {
      console.log(`  - Producto ${e.id}: ${e.error}`);
    });
  }

  // Detalle de actualizados
  console.log('\nPRODUCTOS ACTUALIZADOS:');
  results.detalles.filter(d => d.status === 'actualizado' || d.status === 'simulado').forEach(d => {
    console.log(`  - [${d.id}] ${d.nombre}: ${d.seo?.focusKeyword}`);
  });

  return results;
}

main().catch(console.error);
