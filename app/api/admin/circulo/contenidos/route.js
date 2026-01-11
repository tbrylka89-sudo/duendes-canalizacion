import { kv } from '@vercel/kv';

export const dynamic = 'force-dynamic';

// ═══════════════════════════════════════════════════════════════
// LISTAR CONTENIDOS DE EL CÍRCULO POR MES
// ═══════════════════════════════════════════════════════════════

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const mes = parseInt(searchParams.get('mes')) || (new Date().getMonth() + 1);
    const año = parseInt(searchParams.get('año')) || new Date().getFullYear();

    // Buscar todos los contenidos del mes
    const contenidos = [];
    const diasEnMes = new Date(año, mes, 0).getDate();

    for (let dia = 1; dia <= diasEnMes; dia++) {
      const contenido = await kv.get(`circulo:contenido:${año}:${mes}:${dia}`);
      if (contenido) {
        contenidos.push(contenido);
      }
    }

    // Obtener índice del mes si existe
    const indice = await kv.get(`circulo:indice:${año}:${mes}`);

    return Response.json({
      success: true,
      mes,
      año,
      contenidos,
      total: contenidos.length,
      indice
    });

  } catch (error) {
    console.error('Error listando contenidos:', error);
    return Response.json({
      success: false,
      contenidos: [],
      error: error.message
    }, { status: 500 });
  }
}

// POST - Actualizar un contenido específico
export async function POST(request) {
  try {
    const { dia, mes, año, contenido } = await request.json();

    if (!dia || !mes || !año) {
      return Response.json({ success: false, error: 'Día, mes y año requeridos' }, { status: 400 });
    }

    const key = `circulo:contenido:${año}:${mes}:${dia}`;
    const existente = await kv.get(key);

    if (!existente) {
      return Response.json({ success: false, error: 'Contenido no encontrado' }, { status: 404 });
    }

    const actualizado = {
      ...existente,
      ...contenido,
      modificadoEn: new Date().toISOString()
    };

    await kv.set(key, actualizado);

    return Response.json({
      success: true,
      contenido: actualizado
    });

  } catch (error) {
    console.error('Error actualizando contenido:', error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}

// PATCH - Cambiar estado de un contenido (publicar/despublicar)
export async function PATCH(request) {
  try {
    const { dia, mes, año, estado } = await request.json();

    if (!dia || !mes || !año || !estado) {
      return Response.json({ success: false, error: 'Parámetros incompletos' }, { status: 400 });
    }

    const key = `circulo:contenido:${año}:${mes}:${dia}`;
    const contenido = await kv.get(key);

    if (!contenido) {
      return Response.json({ success: false, error: 'Contenido no encontrado' }, { status: 404 });
    }

    contenido.estado = estado;
    if (estado === 'publicado') {
      contenido.publicadoEn = new Date().toISOString();
    }

    await kv.set(key, contenido);

    return Response.json({
      success: true,
      contenido
    });

  } catch (error) {
    console.error('Error cambiando estado:', error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
