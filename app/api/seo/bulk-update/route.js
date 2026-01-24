/**
 * API Route: SEO Bulk Update
 * POST: Actualiza SEO de multiples productos en WooCommerce usando RankMath
 *
 * Endpoint: /api/seo/bulk-update
 */

import { NextResponse } from 'next/server';
import {
  generateRankMathMeta,
  analyzeRankMathScore,
  generateLSIKeywords,
  validateAndFixSEOData
} from '@/lib/seo/rankmath';

// ═══════════════════════════════════════════════════════════════
// CONFIGURACION
// ═══════════════════════════════════════════════════════════════

const WOOCOMMERCE_URL = process.env.WOOCOMMERCE_URL || process.env.NEXT_PUBLIC_WOOCOMMERCE_URL || process.env.WORDPRESS_URL;
const WOOCOMMERCE_KEY = process.env.WOOCOMMERCE_CONSUMER_KEY || process.env.WC_CONSUMER_KEY;
const WOOCOMMERCE_SECRET = process.env.WOOCOMMERCE_CONSUMER_SECRET || process.env.WC_CONSUMER_SECRET;

const BATCH_SIZE = 10; // Productos por request
const DELAY_BETWEEN_UPDATES = 500; // ms entre actualizaciones

// ═══════════════════════════════════════════════════════════════
// FUNCIONES AUXILIARES
// ═══════════════════════════════════════════════════════════════

/**
 * Obtiene producto de WooCommerce
 */
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

/**
 * Obtiene multiples productos de WooCommerce
 */
async function getWooProducts(productIds) {
  const products = [];

  for (const id of productIds) {
    try {
      const product = await getWooProduct(id);
      products.push(product);
    } catch (error) {
      console.error(`Error obteniendo producto ${id}:`, error.message);
      products.push({ id, error: error.message });
    }
  }

  return products;
}

/**
 * Actualiza SEO de un producto en WooCommerce
 */
async function updateWooProductSEO(productId, seoData) {
  const url = `${WOOCOMMERCE_URL}/wp-json/wc/v3/products/${productId}`;
  const auth = Buffer.from(`${WOOCOMMERCE_KEY}:${WOOCOMMERCE_SECRET}`).toString('base64');

  // Preparar meta_data para WooCommerce/RankMath
  const meta_data = [];

  // RankMath meta fields
  if (seoData.rank_math_title) {
    meta_data.push({ key: 'rank_math_title', value: seoData.rank_math_title });
  }
  if (seoData.rank_math_description) {
    meta_data.push({ key: 'rank_math_description', value: seoData.rank_math_description });
  }
  if (seoData.rank_math_focus_keyword) {
    meta_data.push({ key: 'rank_math_focus_keyword', value: seoData.rank_math_focus_keyword });
  }
  if (seoData.rank_math_robots) {
    meta_data.push({ key: 'rank_math_robots', value: seoData.rank_math_robots });
  }
  if (seoData.rank_math_canonical_url) {
    meta_data.push({ key: 'rank_math_canonical_url', value: seoData.rank_math_canonical_url });
  }

  // Schema
  if (seoData.rank_math_schema_Product) {
    meta_data.push({ key: 'rank_math_schema_Product', value: seoData.rank_math_schema_Product });
  }

  // Facebook/OpenGraph
  if (seoData.rank_math_facebook_title) {
    meta_data.push({ key: 'rank_math_facebook_title', value: seoData.rank_math_facebook_title });
  }
  if (seoData.rank_math_facebook_description) {
    meta_data.push({ key: 'rank_math_facebook_description', value: seoData.rank_math_facebook_description });
  }
  if (seoData.rank_math_facebook_image) {
    meta_data.push({ key: 'rank_math_facebook_image', value: seoData.rank_math_facebook_image });
  }

  // Twitter
  if (seoData.rank_math_twitter_title) {
    meta_data.push({ key: 'rank_math_twitter_title', value: seoData.rank_math_twitter_title });
  }
  if (seoData.rank_math_twitter_description) {
    meta_data.push({ key: 'rank_math_twitter_description', value: seoData.rank_math_twitter_description });
  }
  if (seoData.rank_math_twitter_card_type) {
    meta_data.push({ key: 'rank_math_twitter_card_type', value: seoData.rank_math_twitter_card_type });
  }

  // LSI Keywords (custom field)
  if (seoData._seo_data?.lsiKeywords) {
    meta_data.push({
      key: '_duendes_lsi_keywords',
      value: JSON.stringify(seoData._seo_data.lsiKeywords)
    });
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

/**
 * Extrae datos del producto WooCommerce para generar SEO
 */
function extractProductData(wooProduct) {
  // Extraer categoria principal
  const categorias = wooProduct.categories || [];
  const categoriaPrincipal = categorias[0]?.name || 'proteccion';

  // Extraer tipo de las etiquetas o nombre
  const tags = wooProduct.tags || [];
  const tipoTag = tags.find(t =>
    ['duende', 'pixie', 'bruja', 'guardian', 'leprechaun', 'gnomo', 'mago'].includes(t.name?.toLowerCase())
  );
  let tipo = tipoTag?.name || 'guardian';

  // Inferir tipo del nombre si no hay tag
  const nombreLower = (wooProduct.name || '').toLowerCase();
  if (!tipoTag) {
    if (nombreLower.includes('pixie')) tipo = 'pixie';
    else if (nombreLower.includes('bruja')) tipo = 'bruja';
    else if (nombreLower.includes('duende')) tipo = 'duende';
    else if (nombreLower.includes('leprechaun')) tipo = 'leprechaun';
  }

  // Extraer imagenes
  const imagenes = (wooProduct.images || []).map(img => img.src);
  const imagenPrincipal = imagenes[0] || '';

  // Extraer accesorios de atributos o descripcion
  const atributos = wooProduct.attributes || [];
  const accesoriosAttr = atributos.find(a =>
    a.name?.toLowerCase().includes('accesorio') || a.name?.toLowerCase().includes('cristal')
  );
  const accesorios = accesoriosAttr?.options || [];

  // Extraer tamano
  const tamanoAttr = atributos.find(a => a.name?.toLowerCase().includes('tamano') || a.name?.toLowerCase().includes('altura'));
  const tamanoCm = parseInt(tamanoAttr?.options?.[0]) || 18;

  // Verificar si es unico
  const esUnico = wooProduct.stock_quantity === 1 || wooProduct.manage_stock === false;

  return {
    id: wooProduct.id,
    nombre: wooProduct.name,
    tipo,
    categoria: categoriaPrincipal.toLowerCase()
      .replace('protección', 'proteccion')
      .replace('sanación', 'sanacion')
      .replace('sabiduría', 'sabiduria'),
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

/**
 * Delay helper
 */
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ═══════════════════════════════════════════════════════════════
// HANDLER POST
// ═══════════════════════════════════════════════════════════════

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      productIds = [],      // Array de IDs de productos
      dryRun = false,       // Si true, solo genera SEO sin actualizar
      forceUpdate = false,  // Si true, actualiza aunque ya tenga SEO
      batchSize = BATCH_SIZE
    } = body;

    // Validaciones
    if (!productIds || productIds.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'Se requiere al menos un ID de producto'
      }, { status: 400 });
    }

    if (!WOOCOMMERCE_URL || !WOOCOMMERCE_KEY || !WOOCOMMERCE_SECRET) {
      return NextResponse.json({
        success: false,
        error: 'Configuracion de WooCommerce incompleta'
      }, { status: 500 });
    }

    // Limitar cantidad de productos
    const idsToProcess = productIds.slice(0, 100); // Max 100 productos por request
    const totalProducts = idsToProcess.length;

    // Resultados
    const results = {
      total: totalProducts,
      procesados: 0,
      actualizados: 0,
      errores: 0,
      omitidos: 0,
      detalles: []
    };

    // Procesar en batches
    for (let i = 0; i < idsToProcess.length; i += batchSize) {
      const batchIds = idsToProcess.slice(i, i + batchSize);
      const batchNumber = Math.floor(i / batchSize) + 1;
      const totalBatches = Math.ceil(idsToProcess.length / batchSize);

      console.log(`[SEO Bulk] Procesando batch ${batchNumber}/${totalBatches} (${batchIds.length} productos)`);

      // Obtener productos
      const products = await getWooProducts(batchIds);

      for (const product of products) {
        results.procesados++;

        // Si hubo error al obtener
        if (product.error) {
          results.errores++;
          results.detalles.push({
            id: product.id,
            status: 'error',
            error: product.error
          });
          continue;
        }

        try {
          // Verificar si ya tiene SEO (a menos que forceUpdate)
          const existingMeta = product.meta_data || [];
          const hasRankMathTitle = existingMeta.some(m => m.key === 'rank_math_title' && m.value);

          if (hasRankMathTitle && !forceUpdate) {
            results.omitidos++;
            results.detalles.push({
              id: product.id,
              nombre: product.name,
              status: 'omitido',
              razon: 'Ya tiene SEO configurado (usar forceUpdate para sobreescribir)'
            });
            continue;
          }

          // Extraer datos del producto
          const productData = extractProductData(product);

          // Generar SEO
          const seoData = generateRankMathMeta(productData);

          // Generar LSI keywords
          const lsiKeywords = generateLSIKeywords(productData);
          seoData._seo_data = seoData._seo_data || {};
          seoData._seo_data.lsiKeywords = lsiKeywords.todas;

          // Validar y corregir
          const validation = validateAndFixSEOData(seoData);

          // Analizar score
          const scoreAnalysis = analyzeRankMathScore(productData, validation.data);

          // Si no es dry run, actualizar en WooCommerce
          if (!dryRun) {
            await updateWooProductSEO(product.id, validation.data);
            await delay(DELAY_BETWEEN_UPDATES);
          }

          results.actualizados++;
          results.detalles.push({
            id: product.id,
            nombre: product.name,
            status: dryRun ? 'simulado' : 'actualizado',
            seo: {
              focusKeyword: validation.data.rank_math_focus_keyword,
              title: validation.data.rank_math_title,
              description: validation.data.rank_math_description?.slice(0, 50) + '...',
              score: scoreAnalysis.score,
              nivel: scoreAnalysis.nivel
            },
            validacion: {
              valido: validation.valido,
              advertencias: validation.advertencias.length,
              errores: validation.errores.length
            },
            lsiKeywords: lsiKeywords.principal
          });

        } catch (error) {
          console.error(`[SEO Bulk] Error procesando producto ${product.id}:`, error);
          results.errores++;
          results.detalles.push({
            id: product.id,
            nombre: product.name,
            status: 'error',
            error: error.message
          });
        }
      }
    }

    // Resumen final
    const resumen = {
      success: true,
      dryRun,
      timestamp: new Date().toISOString(),
      estadisticas: {
        total: results.total,
        procesados: results.procesados,
        actualizados: results.actualizados,
        omitidos: results.omitidos,
        errores: results.errores,
        porcentajeExito: results.procesados > 0
          ? Math.round((results.actualizados / results.procesados) * 100)
          : 0
      },
      scorePromedio: results.detalles
        .filter(d => d.seo?.score)
        .reduce((sum, d) => sum + d.seo.score, 0) /
        (results.detalles.filter(d => d.seo?.score).length || 1),
      productos: results.detalles
    };

    return NextResponse.json(resumen);

  } catch (error) {
    console.error('[SEO Bulk] Error general:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 });
  }
}

// ═══════════════════════════════════════════════════════════════
// HANDLER GET - Obtener estado/info
// ═══════════════════════════════════════════════════════════════

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');

  if (action === 'status') {
    return NextResponse.json({
      success: true,
      status: 'ready',
      config: {
        batchSize: BATCH_SIZE,
        delayBetweenUpdates: DELAY_BETWEEN_UPDATES,
        maxProductsPerRequest: 100,
        woocommerceConfigured: !!(WOOCOMMERCE_URL && WOOCOMMERCE_KEY && WOOCOMMERCE_SECRET)
      },
      endpoints: {
        bulkUpdate: 'POST /api/seo/bulk-update',
        analyze: 'GET /api/seo/analyze?productId=123'
      },
      ejemplo: {
        method: 'POST',
        body: {
          productIds: [123, 456, 789],
          dryRun: true,
          forceUpdate: false
        }
      }
    });
  }

  return NextResponse.json({
    success: true,
    message: 'SEO Bulk Update API',
    version: '1.0.0',
    usage: 'POST con body { productIds: [1,2,3], dryRun: false, forceUpdate: false }',
    info: 'Usa ?action=status para ver configuracion'
  });
}
