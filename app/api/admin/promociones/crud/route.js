import { kv } from '@vercel/kv';

// ═══════════════════════════════════════════════════════════════════════════════
// API: CRUD DE PROMOCIONES MÁGICAS
// Gestión completa de promociones y banners
// ═══════════════════════════════════════════════════════════════════════════════

// GET - Listar promociones
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const filtro = searchParams.get('filtro'); // activas, programadas, finalizadas, todas
    const id = searchParams.get('id'); // obtener una específica

    // Si piden una específica
    if (id) {
      const promo = await kv.get(`promociones:${id}`);
      if (!promo) {
        return Response.json({ success: false, error: 'Promoción no encontrada' }, { status: 404 });
      }
      return Response.json({ success: true, promocion: promo });
    }

    // Obtener todas las promociones
    const keys = await kv.keys('promociones:*');
    const promociones = [];

    for (const key of keys) {
      const promo = await kv.get(key);
      if (promo && promo.id) {
        // Actualizar estado basado en fechas
        const ahora = new Date();
        const fechaInicio = promo.fechaInicio ? new Date(promo.fechaInicio) : null;
        const fechaFin = promo.fechaFin ? new Date(promo.fechaFin) : null;

        let estadoCalculado = promo.estado || 'borrador';
        if (promo.estado !== 'borrador' && promo.estado !== 'pausada') {
          if (fechaInicio && fechaInicio > ahora) {
            estadoCalculado = 'programada';
          } else if (fechaFin && fechaFin < ahora) {
            estadoCalculado = 'finalizada';
          } else if (!fechaInicio || fechaInicio <= ahora) {
            estadoCalculado = 'activa';
          }
        }

        promociones.push({
          ...promo,
          estadoCalculado
        });
      }
    }

    // Filtrar
    let promosFiltradas = promociones;
    if (filtro && filtro !== 'todas') {
      promosFiltradas = promociones.filter(p => p.estadoCalculado === filtro);
    }

    // Ordenar por prioridad y fecha
    promosFiltradas.sort((a, b) => {
      const prioridadOrder = { alta: 0, media: 1, baja: 2 };
      const prioA = prioridadOrder[a.prioridad] || 1;
      const prioB = prioridadOrder[b.prioridad] || 1;
      if (prioA !== prioB) return prioA - prioB;
      return new Date(b.creadaEn || 0) - new Date(a.creadaEn || 0);
    });

    // Estadísticas
    const stats = {
      total: promociones.length,
      activas: promociones.filter(p => p.estadoCalculado === 'activa').length,
      programadas: promociones.filter(p => p.estadoCalculado === 'programada').length,
      pausadas: promociones.filter(p => p.estadoCalculado === 'pausada').length,
      finalizadas: promociones.filter(p => p.estadoCalculado === 'finalizada').length
    };

    return Response.json({
      success: true,
      promociones: promosFiltradas,
      stats
    });

  } catch (error) {
    console.error('[PROMOCIONES/CRUD] Error GET:', error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST - Crear o actualizar promoción
export async function POST(request) {
  try {
    const body = await request.json();
    const { accion, promocion, id } = body;

    switch (accion) {
      case 'crear': {
        const nuevoId = `promo_${Date.now()}`;
        const nuevaPromo = {
          id: nuevoId,
          ...promocion,
          stats: { vistas: 0, clicks: 0 },
          creadaEn: new Date().toISOString(),
          actualizadaEn: new Date().toISOString()
        };

        await kv.set(`promociones:${nuevoId}`, nuevaPromo);

        return Response.json({
          success: true,
          promocion: nuevaPromo,
          mensaje: 'Promoción creada exitosamente'
        });
      }

      case 'actualizar': {
        if (!id) {
          return Response.json({ success: false, error: 'ID requerido' }, { status: 400 });
        }

        const promoExistente = await kv.get(`promociones:${id}`);
        if (!promoExistente) {
          return Response.json({ success: false, error: 'Promoción no encontrada' }, { status: 404 });
        }

        const promoActualizada = {
          ...promoExistente,
          ...promocion,
          actualizadaEn: new Date().toISOString()
        };

        await kv.set(`promociones:${id}`, promoActualizada);

        return Response.json({
          success: true,
          promocion: promoActualizada,
          mensaje: 'Promoción actualizada'
        });
      }

      case 'pausar': {
        if (!id) return Response.json({ success: false, error: 'ID requerido' }, { status: 400 });

        const promo = await kv.get(`promociones:${id}`);
        if (!promo) return Response.json({ success: false, error: 'No encontrada' }, { status: 404 });

        promo.estado = 'pausada';
        promo.pausadaEn = new Date().toISOString();
        await kv.set(`promociones:${id}`, promo);

        return Response.json({ success: true, mensaje: 'Promoción pausada' });
      }

      case 'activar': {
        if (!id) return Response.json({ success: false, error: 'ID requerido' }, { status: 400 });

        const promo = await kv.get(`promociones:${id}`);
        if (!promo) return Response.json({ success: false, error: 'No encontrada' }, { status: 404 });

        promo.estado = 'activa';
        promo.activadaEn = new Date().toISOString();
        await kv.set(`promociones:${id}`, promo);

        return Response.json({ success: true, mensaje: 'Promoción activada' });
      }

      case 'eliminar': {
        if (!id) return Response.json({ success: false, error: 'ID requerido' }, { status: 400 });

        await kv.del(`promociones:${id}`);

        return Response.json({ success: true, mensaje: 'Promoción eliminada' });
      }

      case 'clonar': {
        if (!id) return Response.json({ success: false, error: 'ID requerido' }, { status: 400 });

        const promoOriginal = await kv.get(`promociones:${id}`);
        if (!promoOriginal) return Response.json({ success: false, error: 'No encontrada' }, { status: 404 });

        const nuevoId = `promo_${Date.now()}`;
        const promoClon = {
          ...promoOriginal,
          id: nuevoId,
          tituloInterno: `${promoOriginal.tituloInterno} (copia)`,
          estado: 'borrador',
          stats: { vistas: 0, clicks: 0 },
          creadaEn: new Date().toISOString(),
          actualizadaEn: new Date().toISOString()
        };

        await kv.set(`promociones:${nuevoId}`, promoClon);

        return Response.json({
          success: true,
          promocion: promoClon,
          mensaje: 'Promoción clonada'
        });
      }

      case 'registrar-vista': {
        if (!id) return Response.json({ success: true });

        const promo = await kv.get(`promociones:${id}`);
        if (promo) {
          promo.stats = promo.stats || { vistas: 0, clicks: 0 };
          promo.stats.vistas++;
          await kv.set(`promociones:${id}`, promo);
        }

        return Response.json({ success: true });
      }

      case 'registrar-click': {
        if (!id) return Response.json({ success: true });

        const promo = await kv.get(`promociones:${id}`);
        if (promo) {
          promo.stats = promo.stats || { vistas: 0, clicks: 0 };
          promo.stats.clicks++;
          await kv.set(`promociones:${id}`, promo);
        }

        return Response.json({ success: true });
      }

      case 'clonar-mas-exitosa': {
        // Buscar la promo con mejor CTR de los últimos 30 días
        const keys = await kv.keys('promociones:promo_*');
        let mejorPromo = null;
        let mejorCTR = 0;

        for (const key of keys) {
          const promo = await kv.get(key);
          if (!promo || !promo.id) continue;

          const vistas = promo.stats?.vistas || 0;
          const clicks = promo.stats?.clicks || 0;
          const ctr = vistas > 0 ? (clicks / vistas) : 0;

          // Solo considerar promos con al menos 10 vistas
          if (vistas >= 10 && ctr > mejorCTR) {
            mejorCTR = ctr;
            mejorPromo = promo;
          }
        }

        if (!mejorPromo) {
          return Response.json({ success: false, error: 'No hay promociones con suficientes datos' }, { status: 404 });
        }

        // Clonar la mejor
        const nuevoId = `promo_${Date.now()}`;
        const promoClon = {
          ...mejorPromo,
          id: nuevoId,
          tituloInterno: `${mejorPromo.tituloInterno} (copia exitosa)`,
          estado: 'borrador',
          stats: { vistas: 0, clicks: 0 },
          fechaInicio: null,
          fechaFin: null,
          creadaEn: new Date().toISOString(),
          actualizadaEn: new Date().toISOString()
        };

        await kv.set(`promociones:${nuevoId}`, promoClon);

        return Response.json({
          success: true,
          promocion: promoClon,
          original: {
            id: mejorPromo.id,
            titulo: mejorPromo.tituloInterno,
            ctr: (mejorCTR * 100).toFixed(2)
          },
          mensaje: `Clonada la más exitosa: ${mejorPromo.tituloInterno} (CTR: ${(mejorCTR * 100).toFixed(2)}%)`
        });
      }

      default:
        return Response.json({ success: false, error: 'Acción no válida' }, { status: 400 });
    }

  } catch (error) {
    console.error('[PROMOCIONES/CRUD] Error POST:', error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
