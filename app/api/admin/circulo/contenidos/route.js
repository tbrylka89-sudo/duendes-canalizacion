import { kv } from '@vercel/kv';

export const dynamic = 'force-dynamic';

// ═══════════════════════════════════════════════════════════════
// LISTAR CONTENIDOS DE EL CÍRCULO POR MES
// ═══════════════════════════════════════════════════════════════

// Helper para buscar contenido en ambos formatos de key (igual que la API de usuario)
async function obtenerContenido(año, mes, dia) {
  // Formato 1: circulo:contenido:año:mes:dia
  let contenido = await kv.get(`circulo:contenido:${año}:${mes}:${dia}`);
  if (contenido) return contenido;

  // Formato 2: contenido:YYYY-MM-DD
  const fechaFormateada = `${año}-${String(mes).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;
  contenido = await kv.get(`contenido:${fechaFormateada}`);
  return contenido;
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const mes = parseInt(searchParams.get('mes')) || (new Date().getMonth() + 1);
    // Aceptar tanto "año" como "ano" para compatibilidad con encoding
    const año = parseInt(searchParams.get('año') || searchParams.get('ano')) || new Date().getFullYear();

    // Buscar todos los contenidos del mes en ambos formatos
    const contenidos = [];
    const diasEnMes = new Date(año, mes, 0).getDate();

    for (let dia = 1; dia <= diasEnMes; dia++) {
      const contenido = await obtenerContenido(año, mes, dia);
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

// POST - Crear o actualizar un contenido específico
export async function POST(request) {
  try {
    const body = await request.json();
    const { dia, mes, contenido } = body;
    // Aceptar tanto "año" como "ano" para compatibilidad con encoding
    const año = body.año || body.ano;

    if (!dia || !mes || !año) {
      return Response.json({ success: false, error: 'Día, mes y año requeridos' }, { status: 400 });
    }

    const key = `circulo:contenido:${año}:${mes}:${dia}`;
    const existente = await kv.get(key);

    const ahora = new Date().toISOString();
    const datos = existente
      ? { ...existente, ...contenido, modificadoEn: ahora }
      : { ...contenido, creadoEn: ahora };

    await kv.set(key, datos);

    // Actualizar índice del mes
    const indiceKey = `circulo:indice:${año}:${mes}`;
    let indice = await kv.get(indiceKey) || { dias: [], totalDias: 0 };

    const diaExiste = indice.dias.find(d => d.dia === dia);
    if (!diaExiste) {
      indice.dias.push({
        dia,
        titulo: contenido.titulo || datos.titulo,
        estado: contenido.estado || datos.estado || 'borrador'
      });
      indice.dias.sort((a, b) => a.dia - b.dia);
      indice.totalDias = indice.dias.length;
      await kv.set(indiceKey, indice);
    }

    return Response.json({
      success: true,
      contenido: datos,
      accion: existente ? 'actualizado' : 'creado'
    });

  } catch (error) {
    console.error('Error guardando contenido:', error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}

// PATCH - Cambiar estado de un contenido (publicar/despublicar)
export async function PATCH(request) {
  try {
    const body = await request.json();
    const { dia, mes, estado } = body;
    const año = body.año || body.ano;

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

// DELETE - Eliminar contenido del Círculo
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const dia = parseInt(searchParams.get('dia'));
    const mes = parseInt(searchParams.get('mes'));
    const año = parseInt(searchParams.get('año'));

    if (!dia || !mes || !año) {
      return Response.json({
        success: false,
        error: 'Día, mes y año requeridos'
      }, { status: 400 });
    }

    const key = `circulo:contenido:${año}:${mes}:${dia}`;
    const contenido = await kv.get(key);

    if (!contenido) {
      return Response.json({
        success: false,
        error: 'Contenido no encontrado'
      }, { status: 404 });
    }

    // Eliminar el contenido
    await kv.del(key);

    // Actualizar el índice del mes si existe
    const indiceKey = `circulo:indice:${año}:${mes}`;
    const indice = await kv.get(indiceKey);
    if (indice && indice.dias) {
      indice.dias = indice.dias.filter(d => d.dia !== dia);
      indice.totalDias = indice.dias.length;
      await kv.set(indiceKey, indice);
    }

    return Response.json({
      success: true,
      message: `Contenido del día ${dia}/${mes}/${año} eliminado`
    });

  } catch (error) {
    console.error('Error eliminando contenido:', error);
    return Response.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
