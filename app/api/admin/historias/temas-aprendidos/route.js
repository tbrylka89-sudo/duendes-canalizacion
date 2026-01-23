import { kv } from '@vercel/kv';
import { NextResponse } from 'next/server';

/**
 * API: SISTEMA DE TEMAS APRENDIDOS
 *
 * El generador aprende de los temas libres que se usan exitosamente
 * y los asocia con categorías para futuras generaciones.
 *
 * Estructura en KV:
 * temas-aprendidos: {
 *   "chaman": { categoria: "naturaleza", usos: 5, ultimoUso: "2026-01-23" },
 *   "duende viajero": { categoria: "viajeros", usos: 3, ultimoUso: "2026-01-22" },
 *   ...
 * }
 */

const KV_KEY = 'temas-aprendidos';

// GET - Obtener todos los temas aprendidos
export async function GET() {
  try {
    const temas = await kv.get(KV_KEY) || {};

    // Ordenar por usos (más usados primero)
    const temasOrdenados = Object.entries(temas)
      .sort((a, b) => b[1].usos - a[1].usos)
      .reduce((acc, [key, val]) => ({ ...acc, [key]: val }), {});

    return NextResponse.json({
      success: true,
      temas: temasOrdenados,
      total: Object.keys(temas).length
    });
  } catch (error) {
    console.error('[TEMAS-APRENDIDOS] Error GET:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}

// POST - Registrar un tema aprendido (llamado cuando una generación es exitosa)
export async function POST(request) {
  try {
    const { tema, categoria, subcategoria } = await request.json();

    if (!tema) {
      return NextResponse.json({
        success: false,
        error: 'Se requiere el tema'
      }, { status: 400 });
    }

    // Normalizar el tema (minúsculas, sin tildes, trim)
    const temaNormalizado = tema.toLowerCase().trim()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '');

    // Obtener temas existentes
    const temas = await kv.get(KV_KEY) || {};

    // Actualizar o crear entrada
    if (temas[temaNormalizado]) {
      // Ya existe - incrementar usos
      temas[temaNormalizado].usos += 1;
      temas[temaNormalizado].ultimoUso = new Date().toISOString().split('T')[0];
      // Si viene con categoría nueva y tiene más de 3 usos, actualizar
      if (categoria && temas[temaNormalizado].usos >= 3) {
        temas[temaNormalizado].categoria = categoria;
      }
      if (subcategoria) {
        // Agregar subcategoría a la lista si no existe
        if (!temas[temaNormalizado].subcategorias) {
          temas[temaNormalizado].subcategorias = [];
        }
        if (!temas[temaNormalizado].subcategorias.includes(subcategoria)) {
          temas[temaNormalizado].subcategorias.push(subcategoria);
        }
      }
    } else {
      // Nuevo tema
      temas[temaNormalizado] = {
        original: tema, // Guardar versión original con mayúsculas/tildes
        categoria: categoria || null,
        subcategorias: subcategoria ? [subcategoria] : [],
        usos: 1,
        creadoEn: new Date().toISOString().split('T')[0],
        ultimoUso: new Date().toISOString().split('T')[0]
      };
    }

    // Guardar
    await kv.set(KV_KEY, temas);

    return NextResponse.json({
      success: true,
      mensaje: `Tema "${tema}" registrado`,
      tema: temas[temaNormalizado]
    });

  } catch (error) {
    console.error('[TEMAS-APRENDIDOS] Error POST:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}

// DELETE - Eliminar un tema aprendido (por si hay errores)
export async function DELETE(request) {
  try {
    const { tema } = await request.json();

    if (!tema) {
      return NextResponse.json({
        success: false,
        error: 'Se requiere el tema a eliminar'
      }, { status: 400 });
    }

    const temaNormalizado = tema.toLowerCase().trim()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '');

    const temas = await kv.get(KV_KEY) || {};

    if (temas[temaNormalizado]) {
      delete temas[temaNormalizado];
      await kv.set(KV_KEY, temas);
      return NextResponse.json({
        success: true,
        mensaje: `Tema "${tema}" eliminado`
      });
    }

    return NextResponse.json({
      success: false,
      error: 'Tema no encontrado'
    }, { status: 404 });

  } catch (error) {
    console.error('[TEMAS-APRENDIDOS] Error DELETE:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
