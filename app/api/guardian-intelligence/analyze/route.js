/**
 * GUARDIAN INTELLIGENCE - API DE ANÁLISIS
 * POST: Analiza una o todas las historias del catálogo
 */

import { NextResponse } from 'next/server';
import { analizarHistoria, analizarCatalogoCompleto, compararContraOtras } from '@/lib/guardian-intelligence/analyzer';

export async function POST(request) {
  try {
    const body = await request.json();
    const { modo = 'individual', producto, todosLosProductos } = body;

    // Modo individual: analiza una sola historia
    if (modo === 'individual' && producto) {
      const historia = producto.descripcion || producto.historia || '';
      const accesorios = producto.accesorios || [];

      const analisis = analizarHistoria(historia, accesorios);

      // Si hay otras historias para comparar
      let similitudes = [];
      if (todosLosProductos && todosLosProductos.length > 0) {
        const historias = todosLosProductos.map(p => ({
          id: p.id,
          nombre: p.nombre,
          contenido: p.descripcion || p.historia || ''
        }));

        similitudes = compararContraOtras(
          { id: producto.id, contenido: historia },
          historias
        );
      }

      return NextResponse.json({
        success: true,
        producto: {
          id: producto.id,
          nombre: producto.nombre
        },
        analisis,
        similitudes: similitudes.filter(s => s.similitud >= 40),
        timestamp: new Date().toISOString()
      });
    }

    // Modo completo: analiza todo el catálogo
    if (modo === 'completo' && todosLosProductos) {
      const resultado = analizarCatalogoCompleto(todosLosProductos);

      return NextResponse.json({
        success: true,
        resultado,
        timestamp: new Date().toISOString()
      });
    }

    return NextResponse.json({
      success: false,
      error: 'Modo no válido o faltan parámetros'
    }, { status: 400 });

  } catch (error) {
    console.error('[GI Analyze] Error:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}

// GET: Obtener último análisis guardado
export async function GET() {
  try {
    const { kv } = await import('@vercel/kv');
    const ultimoAnalisis = await kv.get('gi:analisis:ultimo');

    if (!ultimoAnalisis) {
      return NextResponse.json({
        success: false,
        mensaje: 'No hay análisis previo guardado'
      });
    }

    return NextResponse.json({
      success: true,
      analisis: ultimoAnalisis
    });

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
