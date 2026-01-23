/**
 * API Route: SEO Analyze
 * GET: Analiza SEO actual de un producto y retorna score + sugerencias
 *
 * Endpoint: /api/seo/analyze?productId=123
 */

import { NextResponse } from 'next/server';
import {
  generateRankMathMeta,
  analyzeRankMathScore,
  generateLSIKeywords,
  generateAltText,
  generateInternalLinks,
  validateAndFixSEOData,
  KEYWORDS_NICHO
} from '@/lib/seo/rankmath';

// ═══════════════════════════════════════════════════════════════
// CONFIGURACION
// ═══════════════════════════════════════════════════════════════

const WOOCOMMERCE_URL = process.env.WOOCOMMERCE_URL || process.env.NEXT_PUBLIC_WOOCOMMERCE_URL;
const WOOCOMMERCE_KEY = process.env.WOOCOMMERCE_CONSUMER_KEY;
const WOOCOMMERCE_SECRET = process.env.WOOCOMMERCE_CONSUMER_SECRET;

// ═══════════════════════════════════════════════════════════════
// FUNCIONES AUXILIARES
// ═══════════════════════════════════════════════════════════════

/**
 * Obtiene producto de WooCommerce
 */
async function getWooProduct(productId) {
  if (!WOOCOMMERCE_URL || !WOOCOMMERCE_KEY || !WOOCOMMERCE_SECRET) {
    throw new Error('Configuracion de WooCommerce incompleta');
  }

  const url = `${WOOCOMMERCE_URL}/wp-json/wc/v3/products/${productId}`;
  const auth = Buffer.from(`${WOOCOMMERCE_KEY}:${WOOCOMMERCE_SECRET}`).toString('base64');

  const response = await fetch(url, {
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/json'
    },
    next: { revalidate: 60 } // Cache por 1 minuto
  });

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error(`Producto ${productId} no encontrado`);
    }
    throw new Error(`Error obteniendo producto: ${response.status}`);
  }

  return response.json();
}

/**
 * Extrae SEO actual del producto
 */
function extractCurrentSEO(wooProduct) {
  const meta = wooProduct.meta_data || [];

  const getMeta = (key) => {
    const item = meta.find(m => m.key === key);
    return item?.value || '';
  };

  return {
    rank_math_title: getMeta('rank_math_title'),
    rank_math_description: getMeta('rank_math_description'),
    rank_math_focus_keyword: getMeta('rank_math_focus_keyword'),
    rank_math_robots: getMeta('rank_math_robots'),
    rank_math_canonical_url: getMeta('rank_math_canonical_url'),
    rank_math_schema_Product: getMeta('rank_math_schema_Product'),
    rank_math_facebook_title: getMeta('rank_math_facebook_title'),
    rank_math_facebook_description: getMeta('rank_math_facebook_description'),
    rank_math_facebook_image: getMeta('rank_math_facebook_image'),
    rank_math_twitter_title: getMeta('rank_math_twitter_title'),
    rank_math_twitter_description: getMeta('rank_math_twitter_description'),
    rank_math_twitter_card_type: getMeta('rank_math_twitter_card_type'),
    _duendes_lsi_keywords: getMeta('_duendes_lsi_keywords'),
    // Yoast fallbacks (por si antes usaban Yoast)
    _yoast_wpseo_title: getMeta('_yoast_wpseo_title'),
    _yoast_wpseo_metadesc: getMeta('_yoast_wpseo_metadesc'),
    _yoast_wpseo_focuskw: getMeta('_yoast_wpseo_focuskw')
  };
}

/**
 * Extrae datos del producto para analisis
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
  }

  const imagenes = (wooProduct.images || []).map(img => img.src);

  const atributos = wooProduct.attributes || [];
  const accesoriosAttr = atributos.find(a =>
    a.name?.toLowerCase().includes('accesorio') || a.name?.toLowerCase().includes('cristal')
  );
  const tamanoAttr = atributos.find(a =>
    a.name?.toLowerCase().includes('tamano') || a.name?.toLowerCase().includes('altura')
  );

  return {
    id: wooProduct.id,
    nombre: wooProduct.name,
    slug: wooProduct.slug,
    permalink: wooProduct.permalink,
    tipo,
    categoria: categoriaPrincipal.toLowerCase()
      .replace('protección', 'proteccion')
      .replace('sanación', 'sanacion')
      .replace('sabiduría', 'sabiduria'),
    descripcion: wooProduct.description || '',
    descripcionCorta: wooProduct.short_description || '',
    precio: parseFloat(wooProduct.price) || 0,
    imagen: imagenes[0] || '',
    imagenes,
    tamanoCm: parseInt(tamanoAttr?.options?.[0]) || 18,
    accesorios: accesoriosAttr?.options || [],
    esUnico: wooProduct.stock_quantity === 1 || !wooProduct.manage_stock,
    sku: wooProduct.sku || '',
    status: wooProduct.status,
    categorias: categorias.map(c => c.name),
    etiquetas: tags.map(t => t.name)
  };
}

/**
 * Analiza contenido HTML y extrae metricas
 */
function analyzeContent(html) {
  if (!html) return { palabras: 0, parrafos: 0, headers: [], links: [], imagenes: [] };

  // Contar palabras (removiendo HTML)
  const textoPlano = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  const palabras = textoPlano.split(' ').filter(p => p.length > 0).length;

  // Contar parrafos
  const parrafos = (html.match(/<p[^>]*>/gi) || []).length;

  // Extraer headers
  const headersMatch = html.match(/<h[1-6][^>]*>([^<]+)<\/h[1-6]>/gi) || [];
  const headers = headersMatch.map(h => {
    const nivel = h.match(/<h([1-6])/i)?.[1] || '2';
    const texto = h.replace(/<[^>]+>/g, '').trim();
    return { nivel: parseInt(nivel), texto };
  });

  // Extraer links
  const linksMatch = html.match(/<a[^>]+href="([^"]+)"[^>]*>([^<]*)<\/a>/gi) || [];
  const links = linksMatch.map(l => {
    const href = l.match(/href="([^"]+)"/i)?.[1] || '';
    const texto = l.replace(/<[^>]+>/g, '').trim();
    const esInterno = href.startsWith('/') || href.includes('duendesdeluruguay');
    return { href, texto, esInterno };
  });

  // Contar imagenes con alt
  const imagenesMatch = html.match(/<img[^>]+>/gi) || [];
  const imagenes = imagenesMatch.map(img => {
    const src = img.match(/src="([^"]+)"/i)?.[1] || '';
    const alt = img.match(/alt="([^"]+)"/i)?.[1] || '';
    return { src, alt, tieneAlt: alt.length > 0 };
  });

  return {
    palabras,
    parrafos,
    headers,
    links,
    imagenes,
    linksInternos: links.filter(l => l.esInterno).length,
    linksExternos: links.filter(l => !l.esInterno).length,
    imagenesConAlt: imagenes.filter(i => i.tieneAlt).length,
    imagenesSinAlt: imagenes.filter(i => !i.tieneAlt).length
  };
}

/**
 * Compara SEO actual con el optimizado
 */
function compareSEO(actual, optimizado) {
  const comparaciones = [];

  // Focus keyword
  if (!actual.rank_math_focus_keyword) {
    comparaciones.push({
      campo: 'Focus Keyword',
      estado: 'faltante',
      actual: 'No definida',
      recomendado: optimizado.rank_math_focus_keyword,
      impacto: 'alto'
    });
  } else if (actual.rank_math_focus_keyword !== optimizado.rank_math_focus_keyword) {
    comparaciones.push({
      campo: 'Focus Keyword',
      estado: 'diferente',
      actual: actual.rank_math_focus_keyword,
      recomendado: optimizado.rank_math_focus_keyword,
      impacto: 'medio'
    });
  }

  // Titulo
  if (!actual.rank_math_title) {
    comparaciones.push({
      campo: 'SEO Title',
      estado: 'faltante',
      actual: 'No definido',
      recomendado: optimizado.rank_math_title,
      impacto: 'alto'
    });
  } else {
    const tituloScore = actual.rank_math_title.length >= 50 && actual.rank_math_title.length <= 60 ? 'optimo' : 'mejorable';
    if (tituloScore === 'mejorable') {
      comparaciones.push({
        campo: 'SEO Title',
        estado: 'mejorable',
        actual: `${actual.rank_math_title} (${actual.rank_math_title.length} chars)`,
        recomendado: `${optimizado.rank_math_title} (${optimizado.rank_math_title.length} chars)`,
        impacto: 'medio'
      });
    }
  }

  // Meta description
  if (!actual.rank_math_description) {
    comparaciones.push({
      campo: 'Meta Description',
      estado: 'faltante',
      actual: 'No definida',
      recomendado: optimizado.rank_math_description,
      impacto: 'alto'
    });
  } else {
    const descScore = actual.rank_math_description.length >= 140 && actual.rank_math_description.length <= 160 ? 'optimo' : 'mejorable';
    if (descScore === 'mejorable') {
      comparaciones.push({
        campo: 'Meta Description',
        estado: 'mejorable',
        actual: `${actual.rank_math_description.slice(0, 50)}... (${actual.rank_math_description.length} chars)`,
        recomendado: `${optimizado.rank_math_description.slice(0, 50)}... (${optimizado.rank_math_description.length} chars)`,
        impacto: 'medio'
      });
    }
  }

  // Schema
  if (!actual.rank_math_schema_Product) {
    comparaciones.push({
      campo: 'Schema Product',
      estado: 'faltante',
      actual: 'No definido',
      recomendado: 'Schema JSON-LD completo',
      impacto: 'alto'
    });
  }

  // Social
  if (!actual.rank_math_facebook_title || !actual.rank_math_twitter_title) {
    comparaciones.push({
      campo: 'Social Meta',
      estado: 'incompleto',
      actual: 'Parcialmente configurado',
      recomendado: 'Configurar OpenGraph y Twitter Cards',
      impacto: 'medio'
    });
  }

  return comparaciones;
}

// ═══════════════════════════════════════════════════════════════
// HANDLER GET
// ═══════════════════════════════════════════════════════════════

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');
    const includeRecommendations = searchParams.get('recommendations') !== 'false';
    const includeComparison = searchParams.get('comparison') !== 'false';

    // Validar productId
    if (!productId) {
      return NextResponse.json({
        success: false,
        error: 'Se requiere productId como parametro',
        ejemplo: '/api/seo/analyze?productId=123'
      }, { status: 400 });
    }

    // Obtener producto de WooCommerce
    let wooProduct;
    try {
      wooProduct = await getWooProduct(productId);
    } catch (error) {
      return NextResponse.json({
        success: false,
        error: error.message
      }, { status: error.message.includes('no encontrado') ? 404 : 500 });
    }

    // Extraer datos
    const productData = extractProductData(wooProduct);
    const currentSEO = extractCurrentSEO(wooProduct);
    const contentAnalysis = analyzeContent(productData.descripcion);

    // Generar SEO optimizado
    const optimizedSEO = generateRankMathMeta(productData);

    // Analizar score del SEO actual
    const currentScore = analyzeRankMathScore(productData, currentSEO);

    // Analizar score del SEO optimizado
    const optimizedScore = analyzeRankMathScore(productData, optimizedSEO);

    // Generar LSI keywords
    const lsiKeywords = generateLSIKeywords(productData);

    // Generar alt texts
    const altTexts = {
      principal: generateAltText(productData, 'principal'),
      detalle: generateAltText(productData, 'detalle'),
      contexto: generateAltText(productData, 'contexto'),
      rostro: generateAltText(productData, 'rostro')
    };

    // Generar enlaces internos
    const internalLinks = generateInternalLinks(productData);

    // Comparar SEO actual vs optimizado
    const comparison = includeComparison ? compareSEO(currentSEO, optimizedSEO) : [];

    // Construir respuesta
    const response = {
      success: true,
      timestamp: new Date().toISOString(),

      producto: {
        id: productData.id,
        nombre: productData.nombre,
        tipo: productData.tipo,
        categoria: productData.categoria,
        precio: productData.precio,
        url: productData.permalink,
        status: productData.status
      },

      analisisContenido: {
        palabras: contentAnalysis.palabras,
        parrafos: contentAnalysis.parrafos,
        headers: contentAnalysis.headers.length,
        imagenes: productData.imagenes.length,
        linksInternos: contentAnalysis.linksInternos,
        linksExternos: contentAnalysis.linksExternos,
        imagenesConAlt: contentAnalysis.imagenesConAlt,
        imagenesTotal: contentAnalysis.imagenes.length
      },

      seoActual: {
        score: currentScore.score,
        nivel: currentScore.nivel,
        color: currentScore.color,
        focusKeyword: currentSEO.rank_math_focus_keyword || 'No definida',
        titulo: currentSEO.rank_math_title || 'No definido',
        tituloLength: (currentSEO.rank_math_title || '').length,
        description: currentSEO.rank_math_description || 'No definida',
        descriptionLength: (currentSEO.rank_math_description || '').length,
        tieneSchema: !!currentSEO.rank_math_schema_Product,
        tieneSocialMeta: !!(currentSEO.rank_math_facebook_title && currentSEO.rank_math_twitter_title),
        detalles: currentScore.detalles,
        sugerencias: currentScore.sugerencias
      },

      seoOptimizado: includeRecommendations ? {
        score: optimizedScore.score,
        nivel: optimizedScore.nivel,
        mejoraPotencial: optimizedScore.score - currentScore.score,
        focusKeyword: optimizedSEO.rank_math_focus_keyword,
        focusKeywordVariations: optimizedSEO._seo_data?.focusKeywordVariations || [],
        titulo: optimizedSEO.rank_math_title,
        description: optimizedSEO.rank_math_description,
        canonicalUrl: optimizedSEO.rank_math_canonical_url,
        socialMedia: {
          facebook: {
            title: optimizedSEO.rank_math_facebook_title,
            description: optimizedSEO.rank_math_facebook_description
          },
          twitter: {
            title: optimizedSEO.rank_math_twitter_title,
            description: optimizedSEO.rank_math_twitter_description,
            cardType: optimizedSEO.rank_math_twitter_card_type
          }
        }
      } : undefined,

      comparacion: comparison,

      keywords: {
        principal: lsiKeywords.principal,
        lsi: lsiKeywords.lsi.slice(0, 10),
        longTail: lsiKeywords.longTail.slice(0, 5),
        geograficas: lsiKeywords.geograficas.slice(0, 3),
        todas: lsiKeywords.todas.slice(0, 20)
      },

      altTexts,

      enlacesInternos: {
        canonical: internalLinks.canonical,
        categoria: internalLinks.categoria,
        sugeridos: internalLinks.sugeridos.slice(0, 3),
        anchorTexts: internalLinks.anchorTextsVariados.slice(0, 5)
      },

      acciones: {
        necesitaActualizacion: currentScore.score < 70,
        prioridad: currentScore.score < 40 ? 'alta' : currentScore.score < 70 ? 'media' : 'baja',
        mejoraPotencial: `+${optimizedScore.score - currentScore.score} puntos`,
        camposACambiar: comparison.filter(c => c.impacto === 'alto').length
      }
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('[SEO Analyze] Error:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 });
  }
}

// ═══════════════════════════════════════════════════════════════
// HANDLER POST - Analisis de multiples productos
// ═══════════════════════════════════════════════════════════════

export async function POST(request) {
  try {
    const body = await request.json();
    const { productIds = [] } = body;

    if (!productIds || productIds.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'Se requiere array de productIds'
      }, { status: 400 });
    }

    // Limitar a 20 productos
    const idsToAnalyze = productIds.slice(0, 20);
    const results = [];

    for (const productId of idsToAnalyze) {
      try {
        const wooProduct = await getWooProduct(productId);
        const productData = extractProductData(wooProduct);
        const currentSEO = extractCurrentSEO(wooProduct);
        const currentScore = analyzeRankMathScore(productData, currentSEO);
        const optimizedSEO = generateRankMathMeta(productData);
        const optimizedScore = analyzeRankMathScore(productData, optimizedSEO);

        results.push({
          id: productId,
          nombre: productData.nombre,
          scoreActual: currentScore.score,
          scorePotencial: optimizedScore.score,
          nivel: currentScore.nivel,
          necesitaActualizacion: currentScore.score < 70,
          mejoraPotencial: optimizedScore.score - currentScore.score
        });
      } catch (error) {
        results.push({
          id: productId,
          error: error.message
        });
      }
    }

    // Estadisticas generales
    const productosValidos = results.filter(r => !r.error);
    const scorePromedio = productosValidos.length > 0
      ? productosValidos.reduce((sum, r) => sum + r.scoreActual, 0) / productosValidos.length
      : 0;

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      total: idsToAnalyze.length,
      analizados: productosValidos.length,
      errores: results.filter(r => r.error).length,
      estadisticas: {
        scorePromedio: Math.round(scorePromedio),
        necesitanActualizacion: productosValidos.filter(r => r.necesitaActualizacion).length,
        mejoraPotencialPromedio: Math.round(
          productosValidos.reduce((sum, r) => sum + r.mejoraPotencial, 0) / (productosValidos.length || 1)
        )
      },
      productos: results,
      distribucionScores: {
        excelente: productosValidos.filter(r => r.scoreActual >= 80).length,
        bueno: productosValidos.filter(r => r.scoreActual >= 60 && r.scoreActual < 80).length,
        mejorable: productosValidos.filter(r => r.scoreActual >= 40 && r.scoreActual < 60).length,
        bajo: productosValidos.filter(r => r.scoreActual < 40).length
      }
    });

  } catch (error) {
    console.error('[SEO Analyze POST] Error:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
