#!/usr/bin/env node

/**
 * Script para subir historias a WooCommerce
 * Actualiza la descripción de cada producto con su historia generada
 */

import fs from 'fs';
import path from 'path';

// Cargar configuración desde .env.local
function cargarConfig() {
  const archivos = ['.env.local', '.env'];
  const config = {};

  for (const archivo of archivos) {
    const ruta = path.join(process.cwd(), archivo);
    if (fs.existsSync(ruta)) {
      const contenido = fs.readFileSync(ruta, 'utf-8');

      const wcKey = contenido.match(/WC_CONSUMER_KEY=["']?([^"'\n]+)["']?/);
      const wcSecret = contenido.match(/WC_CONSUMER_SECRET=["']?([^"'\n]+)["']?/);
      const wpUrl = contenido.match(/WORDPRESS_URL=["']?([^"'\n]+)["']?/);

      if (wcKey) config.WC_CONSUMER_KEY = wcKey[1];
      if (wcSecret) config.WC_CONSUMER_SECRET = wcSecret[1];
      if (wpUrl) config.WORDPRESS_URL = wpUrl[1];
    }
  }

  return config;
}

const CONFIG = cargarConfig();
const HISTORIAS_FILE = path.join(process.cwd(), 'historias-generadas-output.json');
const PRODUCTOS_CSV = '/Users/usuario/Desktop/productos-completos.csv';
const PROGRESS_FILE = path.join(process.cwd(), 'subida-woo-progress.json');

// Cargar productos del CSV con URLs
function cargarProductosCSV() {
  const contenido = fs.readFileSync(PRODUCTOS_CSV, 'utf-8');
  const lineas = contenido.trim().split('\n');
  const headers = lineas[0].split(';');

  const productos = {};
  for (let i = 1; i < lineas.length; i++) {
    if (!lineas[i].trim()) continue;

    const valores = lineas[i].split(';');
    const producto = {};
    headers.forEach((h, idx) => {
      producto[h.trim()] = valores[idx]?.trim() || '';
    });

    // Guardar por nombre para fácil búsqueda
    productos[producto.NOMBRE] = producto;
  }

  return productos;
}

// Obtener ID de producto desde WooCommerce por slug
async function obtenerProductoId(slug) {
  const auth = Buffer.from(`${CONFIG.WC_CONSUMER_KEY}:${CONFIG.WC_CONSUMER_SECRET}`).toString('base64');

  try {
    // Extraer slug del URL (ej: /product/leprechaun-mini/ -> leprechaun-mini)
    const slugLimpio = slug.replace(/^\/product\//, '').replace(/\/$/, '');

    const response = await fetch(
      `${CONFIG.WORDPRESS_URL}/wp-json/wc/v3/products?slug=${slugLimpio}`,
      {
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (response.ok) {
      const productos = await response.json();
      if (productos.length > 0) {
        return productos[0].id;
      }
    }
  } catch (e) {
    console.error(`Error buscando producto ${slug}:`, e.message);
  }

  return null;
}

// Actualizar producto en WooCommerce
async function actualizarProducto(productId, historia) {
  const auth = Buffer.from(`${CONFIG.WC_CONSUMER_KEY}:${CONFIG.WC_CONSUMER_SECRET}`).toString('base64');

  try {
    const response = await fetch(
      `${CONFIG.WORDPRESS_URL}/wp-json/wc/v3/products/${productId}`,
      {
        method: 'PUT',
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          description: historia
        })
      }
    );

    if (response.ok) {
      return await response.json();
    } else {
      const error = await response.text();
      throw new Error(`HTTP ${response.status}: ${error}`);
    }
  } catch (e) {
    throw e;
  }
}

// Convertir historia a HTML
function historiaAHtml(historia) {
  // Convertir markdown básico a HTML
  let html = historia
    // Headers
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    // Itálicas/mensajes canalizados
    .replace(/\*"([^"]+)"\*/g, '<em>"$1"</em>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>')
    // Listas
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    // Párrafos (doble salto de línea)
    .split('\n\n')
    .map(p => {
      p = p.trim();
      if (p.startsWith('<li>')) {
        return '<ul>' + p + '</ul>';
      }
      if (p) {
        return '<p>' + p.replace(/\n/g, '<br>') + '</p>';
      }
      return '';
    })
    .join('\n');

  // Limpiar múltiples </ul><ul>
  html = html.replace(/<\/ul>\s*<ul>/g, '');

  return html;
}

// Función principal
async function main() {
  console.log('🚀 Subiendo historias a WooCommerce');
  console.log('═══════════════════════════════════════\n');

  // Verificar configuración
  if (!CONFIG.WC_CONSUMER_KEY || !CONFIG.WC_CONSUMER_SECRET || !CONFIG.WORDPRESS_URL) {
    console.error('❌ Faltan credenciales de WooCommerce en .env.local');
    process.exit(1);
  }

  console.log(`📍 URL: ${CONFIG.WORDPRESS_URL}`);

  // Cargar historias
  if (!fs.existsSync(HISTORIAS_FILE)) {
    console.error('❌ No se encontró archivo de historias:', HISTORIAS_FILE);
    process.exit(1);
  }

  const historias = JSON.parse(fs.readFileSync(HISTORIAS_FILE, 'utf-8'));
  console.log(`📚 ${historias.productos.length} historias cargadas`);

  // Cargar productos con URLs
  const productosCSV = cargarProductosCSV();
  console.log(`📦 ${Object.keys(productosCSV).length} productos en CSV\n`);

  // Cargar progreso anterior
  let progreso = { subidos: [], errores: [], fecha: new Date().toISOString() };
  let yaSubidos = new Set();

  if (fs.existsSync(PROGRESS_FILE)) {
    try {
      progreso = JSON.parse(fs.readFileSync(PROGRESS_FILE, 'utf-8'));
      progreso.subidos.forEach(p => yaSubidos.add(p.nombre));
      console.log(`📂 Continuando: ${yaSubidos.size} ya subidos\n`);
    } catch (e) {
      console.log('📂 Iniciando desde cero\n');
    }
  }

  // Procesar cada historia
  let exitosos = 0;
  let errores = 0;

  for (let i = 0; i < historias.productos.length; i++) {
    const prod = historias.productos[i];

    // Saltar si ya fue subido
    if (yaSubidos.has(prod.nombre)) {
      console.log(`⏭️  [${i + 1}/${historias.productos.length}] ${prod.nombre} ya subido`);
      continue;
    }

    // Buscar URL en CSV (puede estar en URL o ACCESORIOS dependiendo del formato)
    const datosCSV = productosCSV[prod.nombre];
    const urlProducto = datosCSV?.URL || datosCSV?.ACCESORIOS;
    if (!datosCSV || !urlProducto || !urlProducto.startsWith('/product/')) {
      console.log(`⚠️  [${i + 1}/${historias.productos.length}] ${prod.nombre} - Sin URL en CSV`);
      progreso.errores.push({ nombre: prod.nombre, error: 'Sin URL en CSV' });
      errores++;
      continue;
    }

    console.log(`📝 [${i + 1}/${historias.productos.length}] Subiendo ${prod.nombre}...`);

    try {
      // Obtener ID del producto
      const productId = await obtenerProductoId(urlProducto);

      if (!productId) {
        throw new Error(`Producto no encontrado con slug: ${urlProducto}`);
      }

      // Convertir historia a HTML
      const historiaHtml = historiaAHtml(prod.historia);

      // Actualizar en WooCommerce
      await actualizarProducto(productId, historiaHtml);

      console.log(`✅ ${prod.nombre} subido (ID: ${productId})`);

      progreso.subidos.push({
        nombre: prod.nombre,
        productId,
        fecha: new Date().toISOString()
      });
      exitosos++;

    } catch (e) {
      console.error(`❌ Error con ${prod.nombre}:`, e.message);
      progreso.errores.push({
        nombre: prod.nombre,
        error: e.message,
        fecha: new Date().toISOString()
      });
      errores++;
    }

    // Guardar progreso después de cada producto
    fs.writeFileSync(PROGRESS_FILE, JSON.stringify(progreso, null, 2));

    // Pausa entre requests
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  console.log('\n═══════════════════════════════════════');
  console.log(`✅ Subida completada!`);
  console.log(`📊 Exitosos: ${exitosos}`);
  console.log(`❌ Errores: ${errores}`);
  console.log(`📁 Progreso guardado en: ${PROGRESS_FILE}`);
}

main().catch(console.error);
