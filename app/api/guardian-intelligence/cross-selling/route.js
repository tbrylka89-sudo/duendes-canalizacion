/**
 * GUARDIAN INTELLIGENCE - API DE CROSS-SELLING
 * GET: Obtener sugerencias de productos relacionados
 * POST: Registrar interacciones y obtener estadísticas
 */

import { NextResponse } from 'next/server';
import {
  obtenerSugerencias,
  obtenerSugerenciasCarrito,
  registrarInteraccion,
  obtenerCombinacionesExitosas,
  obtenerEstadisticas,
  generarWidgetHTML
} from '@/lib/guardian-intelligence/cross-selling';
import { registrarEvento, TIPOS_EVENTO } from '@/lib/guardian-intelligence/daily-report';

// Función helper para obtener catálogo de WooCommerce
async function obtenerCatalogo() {
  try {
    const baseUrl = process.env.WORDPRESS_URL || 'https://duendesdeluruguay.com';
    const consumerKey = process.env.WC_CONSUMER_KEY;
    const consumerSecret = process.env.WC_CONSUMER_SECRET;

    if (!consumerKey || !consumerSecret) {
      console.warn('[Cross-Selling] Credenciales WooCommerce no configuradas');
      return [];
    }

    const response = await fetch(
      `${baseUrl}/wp-json/wc/v3/products?per_page=100&status=publish`,
      {
        headers: {
          'Authorization': 'Basic ' + Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64')
        }
      }
    );

    if (!response.ok) {
      throw new Error('Error obteniendo productos');
    }

    const productos = await response.json();

    return productos.map(p => ({
      id: p.id,
      nombre: p.name,
      precio: parseFloat(p.price) || 0,
      imagen: p.images?.[0]?.src || null,
      categoria: extraerCategoria(p.categories),
      tipo: extraerTipo(p.meta_data),
      slug: p.slug
    }));
  } catch (error) {
    console.error('[Cross-Selling] Error obteniendo catálogo:', error);
    return [];
  }
}

function extraerCategoria(categories) {
  if (!categories || categories.length === 0) return 'proteccion';

  const nombres = categories.map(c => c.name.toLowerCase());

  if (nombres.some(n => n.includes('protec'))) return 'proteccion';
  if (nombres.some(n => n.includes('abundan'))) return 'abundancia';
  if (nombres.some(n => n.includes('amor'))) return 'amor';
  if (nombres.some(n => n.includes('sana'))) return 'sanacion';
  if (nombres.some(n => n.includes('sabi'))) return 'sabiduria';

  return 'proteccion';
}

function extraerTipo(metaData) {
  if (!metaData) return 'duende';

  const tipoMeta = metaData.find(m => m.key === '_duendes_tipo');
  if (tipoMeta) return tipoMeta.value.toLowerCase();

  return 'duende';
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const accion = searchParams.get('accion') || 'sugerencias';

    // Obtener sugerencias para un producto
    if (accion === 'sugerencias') {
      const productoId = searchParams.get('producto_id');

      if (!productoId) {
        return NextResponse.json({
          success: false,
          error: 'Se requiere producto_id'
        }, { status: 400 });
      }

      const catalogo = await obtenerCatalogo();
      const producto = catalogo.find(p => p.id.toString() === productoId);

      if (!producto) {
        return NextResponse.json({
          success: false,
          error: 'Producto no encontrado'
        }, { status: 404 });
      }

      const sugerencias = await obtenerSugerencias(producto, catalogo, {
        limite: parseInt(searchParams.get('limite')) || 3,
        incluirUpgrade: searchParams.get('upgrade') === 'true'
      });

      return NextResponse.json({
        success: true,
        producto: { id: producto.id, nombre: producto.nombre },
        sugerencias
      });
    }

    // Obtener sugerencias para carrito
    if (accion === 'carrito') {
      const carritoParam = searchParams.get('carrito');

      if (!carritoParam) {
        return NextResponse.json({
          success: false,
          error: 'Se requiere carrito (IDs separados por coma)'
        }, { status: 400 });
      }

      const ids = carritoParam.split(',').map(id => id.trim());
      const catalogo = await obtenerCatalogo();
      const carrito = catalogo.filter(p => ids.includes(p.id.toString()));

      const resultado = await obtenerSugerenciasCarrito(carrito, catalogo, {
        limite: parseInt(searchParams.get('limite')) || 4
      });

      return NextResponse.json({
        success: true,
        carrito: carrito.map(p => ({ id: p.id, nombre: p.nombre })),
        ...resultado
      });
    }

    // Obtener combinaciones exitosas
    if (accion === 'combinaciones') {
      const limite = parseInt(searchParams.get('limite')) || 10;
      const combinaciones = await obtenerCombinacionesExitosas(limite);

      return NextResponse.json({
        success: true,
        combinaciones
      });
    }

    // Obtener estadísticas
    if (accion === 'estadisticas') {
      const stats = await obtenerEstadisticas();

      return NextResponse.json({
        success: true,
        estadisticas: stats
      });
    }

    // Generar widget HTML
    if (accion === 'widget') {
      const productoId = searchParams.get('producto_id');
      const estilo = searchParams.get('estilo') || 'horizontal';

      if (!productoId) {
        return NextResponse.json({
          success: false,
          error: 'Se requiere producto_id'
        }, { status: 400 });
      }

      const catalogo = await obtenerCatalogo();
      const producto = catalogo.find(p => p.id.toString() === productoId);

      if (!producto) {
        return NextResponse.json({
          success: false,
          error: 'Producto no encontrado'
        }, { status: 404 });
      }

      const sugerencias = await obtenerSugerencias(producto, catalogo);
      const todasSugerencias = [
        ...sugerencias.complementos,
        ...sugerencias.relacionados
      ].slice(0, 4);

      const html = generarWidgetHTML(todasSugerencias, estilo);

      return NextResponse.json({
        success: true,
        html,
        sugerencias: todasSugerencias
      });
    }

    return NextResponse.json({
      success: false,
      error: 'Acción no válida',
      accionesDisponibles: ['sugerencias', 'carrito', 'combinaciones', 'estadisticas', 'widget']
    }, { status: 400 });

  } catch (error) {
    console.error('[GI Cross-Selling GET] Error:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { accion } = body;

    // Registrar interacción
    if (accion === 'registrar') {
      const { productoOrigen, productoSugerido, tipo, valorCompra } = body;

      if (!productoOrigen || !productoSugerido || !tipo) {
        return NextResponse.json({
          success: false,
          error: 'Se requiere productoOrigen, productoSugerido y tipo'
        }, { status: 400 });
      }

      const tiposValidos = ['vista', 'click', 'compra'];
      if (!tiposValidos.includes(tipo)) {
        return NextResponse.json({
          success: false,
          error: 'Tipo debe ser: vista, click o compra'
        }, { status: 400 });
      }

      const interaccion = await registrarInteraccion({
        productoOrigen,
        productoSugerido,
        tipo,
        valorCompra
      });

      // Registrar para reporte diario si es compra
      if (tipo === 'compra') {
        registrarEvento(TIPOS_EVENTO.VENTA, {
          tipo: 'cross-selling',
          productoOrigen,
          productoSugerido,
          valorCompra
        });
      }

      return NextResponse.json({
        success: true,
        interaccion,
        mensaje: 'Interacción registrada'
      });
    }

    return NextResponse.json({
      success: false,
      error: 'Acción no válida',
      accionesDisponibles: ['registrar']
    }, { status: 400 });

  } catch (error) {
    console.error('[GI Cross-Selling POST] Error:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
