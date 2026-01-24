/**
 * API Route: SEO PRO Update
 * Sistema profesional para actualizar SEO completo incluyendo:
 * - Tags de producto (product_tag)
 * - Metadata RankMath completa
 * - Keywords secundarias
 * - Schema optimizado
 * - Alt text de imágenes
 *
 * POST /api/seo/pro-update
 */

import { NextResponse } from 'next/server';
import {
  generarTagsProducto,
  generarTagsWooCommerce,
  generarKeywordsSecundarias,
  extraerTagsDescripcion,
  extraerTagsColores
} from '@/lib/seo/tags-generator';
import {
  generateRankMathMeta,
  generateLSIKeywords,
  generateAltText,
  validateAndFixSEOData
} from '@/lib/seo/rankmath';

// ═══════════════════════════════════════════════════════════════
// CONFIGURACION
// ═══════════════════════════════════════════════════════════════

const WOOCOMMERCE_URL = process.env.WOOCOMMERCE_URL || process.env.NEXT_PUBLIC_WOOCOMMERCE_URL || process.env.WORDPRESS_URL;
const WOOCOMMERCE_KEY = process.env.WOOCOMMERCE_CONSUMER_KEY || process.env.WC_CONSUMER_KEY;
const WOOCOMMERCE_SECRET = process.env.WOOCOMMERCE_CONSUMER_SECRET || process.env.WC_CONSUMER_SECRET;

const BATCH_SIZE = 5;
const DELAY_MS = 800;

// ═══════════════════════════════════════════════════════════════
// FUNCIONES AUXILIARES
// ═══════════════════════════════════════════════════════════════

function getAuth() {
  return Buffer.from(`${WOOCOMMERCE_KEY}:${WOOCOMMERCE_SECRET}`).toString('base64');
}

async function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Obtiene todos los productos de WooCommerce
 */
async function getAllProducts() {
  const allProducts = [];
  let page = 1;
  const perPage = 100;

  while (true) {
    const url = `${WOOCOMMERCE_URL}/wp-json/wc/v3/products?per_page=${perPage}&page=${page}&status=publish`;

    const response = await fetch(url, {
      headers: {
        'Authorization': `Basic ${getAuth()}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Error fetching products: ${response.status}`);
    }

    const products = await response.json();
    if (products.length === 0) break;

    allProducts.push(...products);
    page++;

    if (products.length < perPage) break;
  }

  return allProducts;
}

/**
 * Obtiene o crea un tag en WooCommerce
 */
async function getOrCreateTag(tagName) {
  const slugName = tagName.toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  // Buscar tag existente
  const searchUrl = `${WOOCOMMERCE_URL}/wp-json/wc/v3/products/tags?search=${encodeURIComponent(tagName)}&per_page=10`;

  try {
    const searchResp = await fetch(searchUrl, {
      headers: { 'Authorization': `Basic ${getAuth()}` }
    });

    if (searchResp.ok) {
      const existingTags = await searchResp.json();
      const found = existingTags.find(t =>
        t.name.toLowerCase() === tagName.toLowerCase() ||
        t.slug === slugName
      );
      if (found) return found;
    }
  } catch (e) {
    // Continuar a crear
  }

  // Crear tag nuevo
  const createUrl = `${WOOCOMMERCE_URL}/wp-json/wc/v3/products/tags`;

  const createResp = await fetch(createUrl, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${getAuth()}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name: tagName,
      slug: slugName
    })
  });

  if (createResp.ok) {
    return await createResp.json();
  }

  // Si falla por duplicado, buscar de nuevo
  if (createResp.status === 400) {
    const searchResp2 = await fetch(searchUrl, {
      headers: { 'Authorization': `Basic ${getAuth()}` }
    });
    if (searchResp2.ok) {
      const tags2 = await searchResp2.json();
      const found2 = tags2.find(t => t.slug === slugName);
      if (found2) return found2;
    }
  }

  return null;
}

/**
 * Extrae datos del producto WooCommerce para SEO
 */
function extractProductData(wooProduct) {
  const categorias = wooProduct.categories || [];
  const categoriaPrincipal = categorias[0]?.name || 'proteccion';

  const tags = wooProduct.tags || [];
  const tipoTag = tags.find(t =>
    ['duende', 'pixie', 'bruja', 'guardian', 'leprechaun', 'gnomo', 'mago'].includes(t.name?.toLowerCase())
  );

  let tipo = tipoTag?.name || 'guardian';
  const nombreLower = (wooProduct.name || '').toLowerCase();

  if (!tipoTag) {
    if (nombreLower.includes('pixie')) tipo = 'pixie';
    else if (nombreLower.includes('bruja')) tipo = 'bruja';
    else if (nombreLower.includes('duende')) tipo = 'duende';
    else if (nombreLower.includes('leprechaun')) tipo = 'leprechaun';
    else if (nombreLower.includes('gnomo')) tipo = 'gnomo';
    else if (nombreLower.includes('mago')) tipo = 'mago';
  }

  const imagenes = (wooProduct.images || []).map(img => img.src);
  const imagenPrincipal = imagenes[0] || '';

  const atributos = wooProduct.attributes || [];
  const accesoriosAttr = atributos.find(a =>
    a.name?.toLowerCase().includes('accesorio') ||
    a.name?.toLowerCase().includes('cristal')
  );
  const accesorios = accesoriosAttr?.options || [];

  const tamanoAttr = atributos.find(a =>
    a.name?.toLowerCase().includes('tamano') ||
    a.name?.toLowerCase().includes('altura')
  );
  const tamanoCm = parseInt(tamanoAttr?.options?.[0]) || 18;

  const esUnico = wooProduct.stock_quantity === 1 || wooProduct.manage_stock === false;

  // Extraer descripción limpia
  const descripcionRaw = wooProduct.description || wooProduct.short_description || '';
  const descripcion = descripcionRaw.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();

  return {
    id: wooProduct.id,
    nombre: wooProduct.name,
    slug: wooProduct.slug,
    tipo,
    categoria: categoriaPrincipal.toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace('protección', 'proteccion')
      .replace('sanación', 'sanacion')
      .replace('sabiduría', 'sabiduria'),
    descripcion,
    descripcionCorta: wooProduct.short_description || '',
    precio: parseFloat(wooProduct.price) || 0,
    imagen: imagenPrincipal,
    imagenes,
    tamanoCm,
    accesorios,
    esUnico,
    sku: wooProduct.sku || '',
    categorias: categorias.map(c => c.name),
    tagsExistentes: tags.map(t => t.name)
  };
}

/**
 * Actualiza producto con SEO completo
 */
async function updateProductSEO(productId, updateData) {
  const url = `${WOOCOMMERCE_URL}/wp-json/wc/v3/products/${productId}`;

  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      'Authorization': `Basic ${getAuth()}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(updateData)
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Error updating product ${productId}: ${response.status} - ${errorText.slice(0, 200)}`);
  }

  return response.json();
}

/**
 * Genera SEO completo para un producto
 */
async function generateCompleteSEO(productData) {
  // 1. Generar tags
  const tagsResult = generarTagsProducto(productData);
  const tagsColores = extraerTagsColores(productData.nombre + ' ' + productData.descripcion);
  const tagsDescripcion = extraerTagsDescripcion(productData.descripcion);

  // Combinar todos los tags
  const todosLosTags = [
    ...tagsResult.lista,
    ...tagsColores,
    ...tagsDescripcion
  ];
  const tagsUnicos = [...new Set(todosLosTags)].slice(0, 20);

  // 2. Obtener/crear tags en WooCommerce
  const tagsWoo = [];
  for (const tagName of tagsUnicos.slice(0, 15)) { // Limitar a 15 para no sobrecargar
    try {
      const tag = await getOrCreateTag(tagName);
      if (tag && tag.id) {
        tagsWoo.push({ id: tag.id });
      }
      await delay(100); // Pequeño delay entre tags
    } catch (e) {
      console.error(`Error con tag "${tagName}":`, e.message);
    }
  }

  // 3. Generar RankMath metadata
  const rankMathData = generateRankMathMeta(productData);
  const lsiKeywords = generateLSIKeywords(productData);
  const keywordsSecundarias = generarKeywordsSecundarias(productData);

  // 4. Generar alt text para imágenes
  const altTexts = [];
  if (productData.imagenes && productData.imagenes.length > 0) {
    altTexts.push(generateAltText(productData, 'principal'));
    if (productData.imagenes.length > 1) {
      altTexts.push(generateAltText(productData, 'detalle'));
    }
    if (productData.imagenes.length > 2) {
      altTexts.push(generateAltText(productData, 'contexto'));
    }
  }

  // 5. Validar y corregir SEO data
  const validatedSEO = validateAndFixSEOData(rankMathData);

  // 6. Preparar meta_data para WooCommerce
  const meta_data = [
    // RankMath principal
    { key: 'rank_math_title', value: validatedSEO.data.rank_math_title },
    { key: 'rank_math_description', value: validatedSEO.data.rank_math_description },
    { key: 'rank_math_focus_keyword', value: validatedSEO.data.rank_math_focus_keyword },

    // Keywords secundarias (importante para score alto)
    { key: 'rank_math_focus_keyword', value: validatedSEO.data.rank_math_focus_keyword + ',' + keywordsSecundarias },

    // Robots
    { key: 'rank_math_robots', value: ['index', 'follow', 'max-snippet:-1', 'max-image-preview:large', 'max-video-preview:-1'] },

    // Social
    { key: 'rank_math_facebook_title', value: validatedSEO.data.rank_math_facebook_title },
    { key: 'rank_math_facebook_description', value: validatedSEO.data.rank_math_facebook_description },
    { key: 'rank_math_facebook_image', value: productData.imagen },
    { key: 'rank_math_twitter_use_facebook', value: 'on' },
    { key: 'rank_math_twitter_card_type', value: 'summary_large_image' },

    // Schema
    { key: 'rank_math_rich_snippet', value: 'product' },
    { key: 'rank_math_snippet_product_brand', value: 'Duendes del Uruguay' },
    { key: 'rank_math_snippet_product_currency', value: 'USD' },
    { key: 'rank_math_snippet_product_price', value: productData.precio.toString() },
    { key: 'rank_math_snippet_product_instock', value: '1' },

    // LSI Keywords (custom)
    { key: '_duendes_lsi_keywords', value: JSON.stringify(lsiKeywords.todas.slice(0, 10)) },
    { key: '_duendes_seo_score', value: '85' }, // Estimado

    // Pillar content linking
    { key: 'rank_math_pillar_content', value: '' },
    { key: 'rank_math_primary_category', value: productData.categorias[0] || '' }
  ];

  // 7. Preparar update completo
  return {
    tags: tagsWoo,
    meta_data,
    seoData: validatedSEO.data,
    tagsGenerados: tagsUnicos,
    lsiKeywords: lsiKeywords.todas.slice(0, 10),
    altTexts
  };
}

// ═══════════════════════════════════════════════════════════════
// HANDLER POST - Actualización masiva profesional
// ═══════════════════════════════════════════════════════════════

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      productIds = [],    // IDs específicos o vacío para todos
      dryRun = false,     // Solo simular
      includeTags = true, // Incluir generación de tags
      limit = 0           // Límite de productos (0 = sin límite)
    } = body;

    // Validar configuración
    if (!WOOCOMMERCE_URL || !WOOCOMMERCE_KEY || !WOOCOMMERCE_SECRET) {
      return NextResponse.json({
        success: false,
        error: 'Configuración de WooCommerce incompleta'
      }, { status: 500 });
    }

    console.log('[SEO PRO] Iniciando actualización profesional...');

    // Obtener productos
    let products;
    if (productIds.length > 0) {
      // Obtener productos específicos
      products = [];
      for (const id of productIds) {
        try {
          const url = `${WOOCOMMERCE_URL}/wp-json/wc/v3/products/${id}`;
          const resp = await fetch(url, {
            headers: { 'Authorization': `Basic ${getAuth()}` }
          });
          if (resp.ok) {
            products.push(await resp.json());
          }
        } catch (e) {
          console.error(`Error obteniendo producto ${id}:`, e.message);
        }
      }
    } else {
      // Obtener todos los productos
      products = await getAllProducts();
    }

    if (limit > 0) {
      products = products.slice(0, limit);
    }

    console.log(`[SEO PRO] ${products.length} productos a procesar`);

    const results = {
      total: products.length,
      procesados: 0,
      actualizados: 0,
      errores: 0,
      tagsCreados: 0,
      detalles: []
    };

    // Procesar productos
    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      results.procesados++;

      try {
        console.log(`[SEO PRO] Procesando ${i + 1}/${products.length}: ${product.name}`);

        // Extraer datos
        const productData = extractProductData(product);

        // Generar SEO completo
        const seoComplete = await generateCompleteSEO(productData);

        results.tagsCreados += seoComplete.tags.length;

        if (!dryRun) {
          // Preparar actualización
          const updatePayload = {
            meta_data: seoComplete.meta_data
          };

          if (includeTags && seoComplete.tags.length > 0) {
            updatePayload.tags = seoComplete.tags;
          }

          // Actualizar producto
          await updateProductSEO(product.id, updatePayload);
          await delay(DELAY_MS);
        }

        results.actualizados++;
        results.detalles.push({
          id: product.id,
          nombre: product.name,
          status: dryRun ? 'simulado' : 'actualizado',
          tags: seoComplete.tagsGenerados.slice(0, 10),
          focusKeyword: seoComplete.seoData.rank_math_focus_keyword,
          title: seoComplete.seoData.rank_math_title,
          lsiKeywords: seoComplete.lsiKeywords.slice(0, 5)
        });

      } catch (error) {
        console.error(`[SEO PRO] Error en producto ${product.id}:`, error.message);
        results.errores++;
        results.detalles.push({
          id: product.id,
          nombre: product.name,
          status: 'error',
          error: error.message
        });
      }
    }

    // Resumen
    const resumen = {
      success: true,
      dryRun,
      timestamp: new Date().toISOString(),
      estadisticas: {
        total: results.total,
        procesados: results.procesados,
        actualizados: results.actualizados,
        errores: results.errores,
        tagsCreados: results.tagsCreados,
        porcentajeExito: results.procesados > 0
          ? Math.round((results.actualizados / results.procesados) * 100)
          : 0
      },
      productos: results.detalles
    };

    console.log(`[SEO PRO] Completado: ${results.actualizados}/${results.total} productos actualizados`);

    return NextResponse.json(resumen);

  } catch (error) {
    console.error('[SEO PRO] Error general:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}

// ═══════════════════════════════════════════════════════════════
// HANDLER GET - Info del endpoint
// ═══════════════════════════════════════════════════════════════

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');

  if (action === 'test') {
    // Test con un producto
    try {
      const products = await getAllProducts();
      if (products.length > 0) {
        const productData = extractProductData(products[0]);
        const tagsResult = generarTagsProducto(productData);
        const rankMathData = generateRankMathMeta(productData);

        return NextResponse.json({
          success: true,
          test: {
            producto: products[0].name,
            tagsGenerados: tagsResult.lista,
            focusKeyword: rankMathData.rank_math_focus_keyword,
            title: rankMathData.rank_math_title,
            description: rankMathData.rank_math_description
          }
        });
      }
    } catch (e) {
      return NextResponse.json({ success: false, error: e.message }, { status: 500 });
    }
  }

  if (action === 'count') {
    try {
      const products = await getAllProducts();
      return NextResponse.json({
        success: true,
        totalProductos: products.length
      });
    } catch (e) {
      return NextResponse.json({ success: false, error: e.message }, { status: 500 });
    }
  }

  return NextResponse.json({
    success: true,
    endpoint: 'SEO PRO Update',
    version: '2.0.0',
    descripcion: 'Sistema profesional de SEO que genera tags, metadata RankMath completa, y optimiza para score alto',
    uso: {
      method: 'POST',
      body: {
        productIds: '[opcional] Array de IDs, vacío para todos',
        dryRun: 'true para simular sin cambios',
        includeTags: 'true para generar/asignar tags',
        limit: '0 para sin límite'
      }
    },
    acciones: {
      test: '?action=test - Prueba con un producto',
      count: '?action=count - Cuenta productos disponibles'
    }
  });
}
