/**
 * GUARDIAN INTELLIGENCE - CORREGIR TAMAÑOS
 * POST: Actualiza el atributo "Altura" en WooCommerce con los tamaños reales de la base de datos
 * GET: Lista productos con tamaños incorrectos
 */

import { NextResponse } from 'next/server';
import productosDB from '@/lib/productos-base-datos.json';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function OPTIONS() {
  return new Response(null, { headers: corsHeaders });
}

// Normalizar nombre para búsqueda
function normalizarNombre(nombre) {
  return nombre
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/pixie/gi, '')
    .replace(/guardiana?/gi, '')
    .replace(/duende/gi, '')
    .replace(/-/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// Buscar producto en base de datos
function buscarEnDB(nombreWoo) {
  const nombreNorm = normalizarNombre(nombreWoo);

  // Buscar coincidencia exacta
  let producto = productosDB.productos.find(p =>
    normalizarNombre(p.nombre) === nombreNorm
  );

  // Si no, buscar parcial
  if (!producto) {
    producto = productosDB.productos.find(p =>
      nombreNorm.includes(normalizarNombre(p.nombre)) ||
      normalizarNombre(p.nombre).includes(nombreNorm)
    );
  }

  // Buscar por primera palabra
  if (!producto) {
    const primeraPalabra = nombreNorm.split(' ')[0];
    if (primeraPalabra.length > 2) {
      producto = productosDB.productos.find(p =>
        normalizarNombre(p.nombre).split(' ')[0] === primeraPalabra
      );
    }
  }

  return producto;
}

// GET: Analizar diferencias de tamaño
export async function GET(request) {
  try {
    const WOO_URL = process.env.WORDPRESS_URL || 'https://duendesdeluruguay.com';
    const WOO_KEY = process.env.WC_CONSUMER_KEY;
    const WOO_SECRET = process.env.WC_CONSUMER_SECRET;

    const auth = Buffer.from(`${WOO_KEY}:${WOO_SECRET}`).toString('base64');

    // Obtener todos los productos
    const res = await fetch(
      `${WOO_URL}/wp-json/wc/v3/products?per_page=100&status=publish`,
      {
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (!res.ok) {
      return NextResponse.json({ success: false, error: `WooCommerce error: ${res.status}` }, { headers: corsHeaders });
    }

    const productosWoo = await res.json();

    const analisis = [];
    let correctos = 0;
    let incorrectos = 0;
    let noEncontrados = 0;

    for (const pWoo of productosWoo) {
      // Buscar atributo de altura actual
      const attrAltura = pWoo.attributes?.find(a =>
        a.name.toLowerCase().includes('altura') ||
        a.name.toLowerCase().includes('tamaño') ||
        a.name.toLowerCase().includes('tamano')
      );

      const alturaActual = attrAltura?.options?.[0] || null;

      // Extraer número de la altura actual
      let cmActual = null;
      if (alturaActual) {
        const match = alturaActual.match(/~?(\d+)/);
        if (match) cmActual = parseInt(match[1]);
      }

      // Buscar en base de datos
      const productoEnDB = buscarEnDB(pWoo.name);

      if (productoEnDB) {
        const cmCorrecto = productoEnDB.tamano_cm;

        if (cmActual !== cmCorrecto) {
          incorrectos++;
          analisis.push({
            id: pWoo.id,
            nombre: pWoo.name,
            encontrado_en_db: productoEnDB.nombre,
            altura_actual: alturaActual || 'No tiene',
            cm_actual: cmActual,
            cm_correcto: cmCorrecto,
            diferencia: cmActual ? cmActual - cmCorrecto : null,
            necesita_correccion: true
          });
        } else {
          correctos++;
        }
      } else {
        noEncontrados++;
        analisis.push({
          id: pWoo.id,
          nombre: pWoo.name,
          encontrado_en_db: null,
          altura_actual: alturaActual || 'No tiene',
          necesita_correccion: false,
          nota: 'No encontrado en base de datos'
        });
      }
    }

    // Ordenar: primero los que necesitan corrección
    analisis.sort((a, b) => {
      if (a.necesita_correccion && !b.necesita_correccion) return -1;
      if (!a.necesita_correccion && b.necesita_correccion) return 1;
      return 0;
    });

    return NextResponse.json({
      success: true,
      resumen: {
        total_woo: productosWoo.length,
        total_db: productosDB.productos.length,
        correctos,
        incorrectos,
        no_encontrados: noEncontrados
      },
      productos: analisis
    }, { headers: corsHeaders });

  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders });
  }
}

// POST: Corregir tamaños
export async function POST(request) {
  try {
    const body = await request.json();
    const { modo = 'preview', productIds = [] } = body;
    // modo: 'preview' (solo muestra), 'aplicar' (corrige), 'todos' (corrige todos los incorrectos)

    const WOO_URL = process.env.WORDPRESS_URL || 'https://duendesdeluruguay.com';
    const WOO_KEY = process.env.WC_CONSUMER_KEY;
    const WOO_SECRET = process.env.WC_CONSUMER_SECRET;

    const auth = Buffer.from(`${WOO_KEY}:${WOO_SECRET}`).toString('base64');

    // Obtener productos
    const res = await fetch(
      `${WOO_URL}/wp-json/wc/v3/products?per_page=100&status=publish`,
      {
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const productosWoo = await res.json();
    const resultados = [];

    for (const pWoo of productosWoo) {
      // Si se especificaron IDs, filtrar
      if (productIds.length > 0 && !productIds.includes(pWoo.id)) continue;

      const productoEnDB = buscarEnDB(pWoo.name);
      if (!productoEnDB) continue;

      // Buscar atributo de altura actual
      const attrIndex = pWoo.attributes?.findIndex(a =>
        a.name.toLowerCase().includes('altura') ||
        a.name.toLowerCase().includes('tamaño') ||
        a.name.toLowerCase().includes('tamano')
      );

      const alturaActual = attrIndex >= 0 ? pWoo.attributes[attrIndex].options?.[0] : null;
      let cmActual = null;
      if (alturaActual) {
        const match = alturaActual.match(/~?(\d+)/);
        if (match) cmActual = parseInt(match[1]);
      }

      const cmCorrecto = productoEnDB.tamano_cm;

      // Si ya está correcto, saltar
      if (cmActual === cmCorrecto) continue;

      // Nuevo valor de altura
      const nuevoValorAltura = `~${cmCorrecto}`;

      if (modo === 'preview') {
        resultados.push({
          id: pWoo.id,
          nombre: pWoo.name,
          antes: alturaActual || 'Sin altura',
          despues: nuevoValorAltura,
          cm_antes: cmActual,
          cm_despues: cmCorrecto
        });
      } else if (modo === 'aplicar' || modo === 'todos') {
        // Actualizar en WooCommerce
        const nuevoAtributos = [...(pWoo.attributes || [])];

        if (attrIndex >= 0) {
          // Actualizar existente
          nuevoAtributos[attrIndex] = {
            ...nuevoAtributos[attrIndex],
            options: [nuevoValorAltura]
          };
        } else {
          // Crear nuevo atributo
          nuevoAtributos.push({
            name: 'Altura',
            position: 0,
            visible: true,
            variation: false,
            options: [nuevoValorAltura]
          });
        }

        const updateRes = await fetch(
          `${WOO_URL}/wp-json/wc/v3/products/${pWoo.id}`,
          {
            method: 'PUT',
            headers: {
              'Authorization': `Basic ${auth}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              attributes: nuevoAtributos
            })
          }
        );

        if (updateRes.ok) {
          resultados.push({
            id: pWoo.id,
            nombre: pWoo.name,
            antes: alturaActual || 'Sin altura',
            despues: nuevoValorAltura,
            status: 'corregido'
          });
        } else {
          resultados.push({
            id: pWoo.id,
            nombre: pWoo.name,
            status: 'error',
            error: `HTTP ${updateRes.status}`
          });
        }

        // Pequeña pausa para no saturar la API
        await new Promise(r => setTimeout(r, 500));
      }
    }

    return NextResponse.json({
      success: true,
      modo,
      total_corregidos: resultados.filter(r => r.status === 'corregido').length,
      total_errores: resultados.filter(r => r.status === 'error').length,
      resultados
    }, { headers: corsHeaders });

  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders });
  }
}
