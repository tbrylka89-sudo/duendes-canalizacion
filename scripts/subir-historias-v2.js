#!/usr/bin/env node

/**
 * Script mejorado para subir historias a WooCommerce
 * Busca productos por nombre normalizado y usa ID directo
 */

import fs from 'fs';
import path from 'path';

// Cargar configuración
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
const PROGRESS_FILE = path.join(process.cwd(), 'subida-woo-progress-v2.json');

// Normalizar nombre para comparación
function normalizarNombre(nombre) {
  return nombre
    .toLowerCase()
    .replace(/ - .*/g, '')      // Quitar subtítulos
    .replace(/pixie$/i, 'pixie')
    .replace(/\s+/g, ' ')
    .trim();
}

// Obtener todos los productos de WooCommerce
async function obtenerTodosProductos() {
  const auth = Buffer.from(`${CONFIG.WC_CONSUMER_KEY}:${CONFIG.WC_CONSUMER_SECRET}`).toString('base64');
  const productos = [];

  for (let page = 1; page <= 3; page++) {
    const response = await fetch(
      `${CONFIG.WORDPRESS_URL}/wp-json/wc/v3/products?per_page=100&page=${page}`,
      {
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (response.ok) {
      const data = await response.json();
      if (data.length === 0) break;
      productos.push(...data);
    }
  }

  return productos;
}

// Buscar producto por nombre
function buscarProductoPorNombre(nombre, productosWoo) {
  const nombreNorm = normalizarNombre(nombre);

  // Búsqueda exacta primero
  let producto = productosWoo.find(p =>
    normalizarNombre(p.name) === nombreNorm
  );

  // Si no encuentra, buscar con match parcial
  if (!producto) {
    producto = productosWoo.find(p => {
      const pNorm = normalizarNombre(p.name);
      return pNorm.includes(nombreNorm) || nombreNorm.includes(pNorm);
    });
  }

  return producto;
}

// Actualizar producto en WooCommerce
async function actualizarProducto(productId, historia) {
  const auth = Buffer.from(`${CONFIG.WC_CONSUMER_KEY}:${CONFIG.WC_CONSUMER_SECRET}`).toString('base64');

  const response = await fetch(
    `${CONFIG.WORDPRESS_URL}/wp-json/wc/v3/products/${productId}`,
    {
      method: 'PUT',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ description: historia })
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`HTTP ${response.status}: ${error}`);
  }

  return await response.json();
}

// Convertir historia a HTML
function historiaAHtml(historia) {
  let html = historia
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\*"([^"]+)"\*/g, '<em>"$1"</em>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>')
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    .split('\n\n')
    .map(p => {
      p = p.trim();
      if (p.startsWith('<li>')) return '<ul>' + p + '</ul>';
      if (p) return '<p>' + p.replace(/\n/g, '<br>') + '</p>';
      return '';
    })
    .join('\n');

  html = html.replace(/<\/ul>\s*<ul>/g, '');
  return html;
}

// Función principal
async function main() {
  console.log('🚀 Subiendo historias a WooCommerce (v2)');
  console.log('═══════════════════════════════════════\n');

  if (!CONFIG.WC_CONSUMER_KEY || !CONFIG.WC_CONSUMER_SECRET || !CONFIG.WORDPRESS_URL) {
    console.error('❌ Faltan credenciales de WooCommerce');
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

  // Obtener productos de WooCommerce
  console.log('📦 Obteniendo productos de WooCommerce...');
  const productosWoo = await obtenerTodosProductos();
  console.log(`📦 ${productosWoo.length} productos encontrados\n`);

  // Cargar progreso anterior
  let progreso = { subidos: [], errores: [], noEncontrados: [], fecha: new Date().toISOString() };
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
  let noEncontrados = 0;

  for (let i = 0; i < historias.productos.length; i++) {
    const prod = historias.productos[i];

    if (yaSubidos.has(prod.nombre)) {
      console.log(`⏭️  [${i + 1}/${historias.productos.length}] ${prod.nombre} ya subido`);
      continue;
    }

    // Buscar producto en WooCommerce
    const productoWoo = buscarProductoPorNombre(prod.nombre, productosWoo);

    if (!productoWoo) {
      console.log(`⚠️  [${i + 1}/${historias.productos.length}] ${prod.nombre} - NO ENCONTRADO en WooCommerce`);
      progreso.noEncontrados.push({ nombre: prod.nombre, fecha: new Date().toISOString() });
      noEncontrados++;
      continue;
    }

    console.log(`📝 [${i + 1}/${historias.productos.length}] ${prod.nombre} → ID: ${productoWoo.id}`);

    try {
      const historiaHtml = historiaAHtml(prod.historia);
      await actualizarProducto(productoWoo.id, historiaHtml);

      console.log(`✅ ${prod.nombre} subido exitosamente`);

      progreso.subidos.push({
        nombre: prod.nombre,
        productId: productoWoo.id,
        slug: productoWoo.slug,
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

    // Guardar progreso
    fs.writeFileSync(PROGRESS_FILE, JSON.stringify(progreso, null, 2));

    // Pausa entre requests
    await new Promise(resolve => setTimeout(resolve, 300));
  }

  console.log('\n═══════════════════════════════════════');
  console.log(`✅ Subida completada!`);
  console.log(`📊 Exitosos: ${exitosos}`);
  console.log(`⚠️  No encontrados: ${noEncontrados}`);
  console.log(`❌ Errores: ${errores}`);
  console.log(`📁 Progreso guardado en: ${PROGRESS_FILE}`);
}

main().catch(console.error);
