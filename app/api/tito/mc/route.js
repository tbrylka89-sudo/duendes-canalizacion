/**
 * TITO para ManyChat - Versión optimizada para Dynamic Block
 * Timeout de ManyChat: 10 segundos
 */

import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const WP_URL = process.env.WORDPRESS_URL || 'https://duendesdeluruguay.com';

// Cache de productos (5 minutos)
let productosCache = null;
let cacheTime = 0;
const CACHE_DURATION = 5 * 60 * 1000;

function getWooAuth() {
  const key = process.env.WC_CONSUMER_KEY;
  const secret = process.env.WC_CONSUMER_SECRET;
  if (!key || !secret) return null;
  return Buffer.from(`${key}:${secret}`).toString('base64');
}

async function obtenerProductos() {
  // Usar cache si está disponible
  if (productosCache && (Date.now() - cacheTime) < CACHE_DURATION) {
    return productosCache;
  }

  try {
    const auth = getWooAuth();
    if (!auth) return [];

    const url = `${WP_URL}/wp-json/wc/v3/products?per_page=20&status=publish`;
    const res = await fetch(url, {
      headers: { 'Authorization': `Basic ${auth}` }
    });

    if (!res.ok) return [];
    const productos = await res.json();

    productosCache = productos
      .filter(p => {
        if (!p.images || p.images.length === 0) return false;
        const nombre = p.name.toLowerCase();
        if (nombre.includes('círculo') || nombre.includes('circulo')) return false;
        if (nombre.includes('membresía') || nombre.includes('membresia')) return false;
        if (nombre.includes('runas')) return false;
        return true;
      })
      .slice(0, 6)
      .map(p => ({
        nombre: p.name,
        precio: p.price,
        imagen: p.images[0]?.src,
        url: p.permalink
      }));

    cacheTime = Date.now();
    return productosCache;
  } catch (e) {
    console.error('[MC] Error productos:', e);
    return [];
  }
}

function quiereVerProductos(msg) {
  const palabras = ['mostrame', 'muéstrame', 'ver', 'fotos', 'imágenes', 'guardianes', 'duendes', 'tienen', 'disponibles'];
  return palabras.some(p => msg.toLowerCase().includes(p));
}

const SYSTEM = `Sos TITO, asistente de Duendes del Uruguay. Hablás como uruguayo (vos, tenés).
Sos cálido y cercano. Respuestas MUY CORTAS (1-2 oraciones). 1 emoji máximo.
Si te pasan productos, mencioná 2-3 por nombre. NUNCA inventes nombres.
Si no hay productos, invitá a ver www.duendesdeluruguay.com`;

export async function POST(request) {
  const startTime = Date.now();

  try {
    const body = await request.json();
    const { mensaje, nombre } = body;

    console.log('[MC] Recibido:', { mensaje, nombre });

    if (!mensaje || mensaje.trim() === '') {
      return Response.json({
        version: 'v2',
        content: {
          messages: [{ type: 'text', text: `¡Hola${nombre ? ' ' + nombre : ''}! 👋 ¿En qué te puedo ayudar?` }]
        }
      });
    }

    // Obtener productos en paralelo con la llamada a Claude si es necesario
    let productos = [];
    let contexto = '';
    const quiereVer = quiereVerProductos(mensaje);

    if (quiereVer) {
      productos = await obtenerProductos();
      if (productos.length > 0) {
        contexto = `\nPRODUCTOS: ${productos.map(p => `${p.nombre} $${p.precio}`).join(', ')}. Mencioná 2-3.`;
      }
    }

    // Verificar tiempo antes de llamar a Claude
    if (Date.now() - startTime > 7000) {
      console.log('[MC] Timeout prevention - skipping Claude');
      return Response.json({
        version: 'v2',
        content: {
          messages: [
            { type: 'text', text: `¡Hola${nombre ? ' ' + nombre : ''}! 😊 Acá te muestro algunos guardianes:` },
            ...(productos.length > 0 ? [{
              type: 'cards',
              elements: productos.map(p => ({
                title: p.nombre,
                subtitle: `$${p.precio} USD`,
                image_url: p.imagen,
                buttons: [{ type: 'url', caption: 'Ver más', url: p.url }]
              })),
              image_aspect_ratio: 'square'
            }] : [])
          ]
        }
      });
    }

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 150, // Reducido para respuesta más rápida
      system: SYSTEM + contexto,
      messages: [{ role: 'user', content: `${nombre ? `Soy ${nombre}. ` : ''}${mensaje}` }]
    });

    const texto = response.content[0].text;
    console.log('[MC] Tiempo total:', Date.now() - startTime, 'ms');

    // Si hay productos, devolver con galería
    if (productos.length > 0) {
      return Response.json({
        version: 'v2',
        content: {
          messages: [
            { type: 'text', text: texto },
            {
              type: 'cards',
              elements: productos.map(p => ({
                title: p.nombre,
                subtitle: `$${p.precio} USD`,
                image_url: p.imagen,
                buttons: [{ type: 'url', caption: 'Ver más', url: p.url }]
              })),
              image_aspect_ratio: 'square'
            }
          ]
        }
      });
    }

    // Solo texto
    return Response.json({
      version: 'v2',
      content: {
        messages: [{ type: 'text', text: texto }]
      }
    });

  } catch (error) {
    console.error('[MC] Error:', error);
    return Response.json({
      version: 'v2',
      content: {
        messages: [{ type: 'text', text: 'Disculpá, tuve un problemita. ¿Podés escribirme de nuevo? 🙏' }]
      }
    });
  }
}

export async function GET() {
  // Pre-cargar cache
  const productos = await obtenerProductos();
  return Response.json({
    status: 'ok',
    endpoint: 'Tito MC - Dynamic Block optimizado',
    productos_en_cache: productos.length
  });
}
