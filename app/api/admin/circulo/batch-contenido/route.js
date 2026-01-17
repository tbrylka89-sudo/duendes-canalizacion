import { kv } from '@vercel/kv';

// ═══════════════════════════════════════════════════════════════════════════════
// API: BATCH INSERT DE CONTENIDO DEL CÍRCULO
// Para cargar contenido histórico o programado en masa
// ═══════════════════════════════════════════════════════════════════════════════

export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const { contenidos, accion } = await request.json();

    if (accion === 'limpiar-mes') {
      const { mes, año } = await request.json();
      const diasEnMes = new Date(año, mes, 0).getDate();
      let eliminados = 0;

      for (let dia = 1; dia <= diasEnMes; dia++) {
        const key = `circulo:contenido:${año}:${mes}:${dia}`;
        const existe = await kv.get(key);
        if (existe) {
          await kv.del(key);
          eliminados++;
        }
      }

      return Response.json({
        success: true,
        eliminados,
        mensaje: `Eliminados ${eliminados} contenidos del mes ${mes}/${año}`
      });
    }

    if (!contenidos || !Array.isArray(contenidos)) {
      return Response.json({
        success: false,
        error: 'Se requiere array de contenidos'
      }, { status: 400 });
    }

    const resultados = [];
    let insertados = 0;
    let errores = 0;

    for (const c of contenidos) {
      try {
        const { dia, mes, año, ...datos } = c;

        if (!dia || !mes || !año) {
          resultados.push({ dia, error: 'Faltan dia, mes o año' });
          errores++;
          continue;
        }

        const key = `circulo:contenido:${año}:${mes}:${dia}`;

        const contenido = {
          dia,
          mes,
          año,
          ...datos,
          creadoEn: datos.creadoEn || new Date().toISOString(),
          creadoPorBatch: true
        };

        await kv.set(key, contenido);
        insertados++;
        resultados.push({ dia, mes, año, titulo: datos.titulo, ok: true });

      } catch (err) {
        errores++;
        resultados.push({ dia: c.dia, error: err.message });
      }
    }

    return Response.json({
      success: true,
      insertados,
      errores,
      total: contenidos.length,
      resultados
    });

  } catch (error) {
    console.error('[BATCH-CONTENIDO] Error:', error);
    return Response.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}

// GET - Verificar estado de contenidos de un rango
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const mes = parseInt(searchParams.get('mes')) || (new Date().getMonth() + 1);
    const año = parseInt(searchParams.get('año')) || new Date().getFullYear();

    const diasEnMes = new Date(año, mes, 0).getDate();
    const resumen = {
      mes,
      año,
      diasEnMes,
      conContenido: 0,
      publicados: 0,
      programados: 0,
      borradores: 0,
      vacios: 0,
      dias: []
    };

    for (let dia = 1; dia <= diasEnMes; dia++) {
      const key = `circulo:contenido:${año}:${mes}:${dia}`;
      const contenido = await kv.get(key);

      if (contenido) {
        resumen.conContenido++;
        if (contenido.estado === 'publicado') resumen.publicados++;
        else if (contenido.estado === 'programado') resumen.programados++;
        else resumen.borradores++;

        resumen.dias.push({
          dia,
          titulo: contenido.titulo,
          tipo: contenido.tipo,
          estado: contenido.estado,
          duende: contenido.duende
        });
      } else {
        resumen.vacios++;
        resumen.dias.push({ dia, vacio: true });
      }
    }

    return Response.json({
      success: true,
      ...resumen
    });

  } catch (error) {
    console.error('[BATCH-CONTENIDO] Error GET:', error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
