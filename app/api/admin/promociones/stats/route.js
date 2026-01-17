import { kv } from '@vercel/kv';

// ═══════════════════════════════════════════════════════════════════════════════
// API: STATS DE PROMOCIONES
// Estadísticas detalladas de rendimiento
// ═══════════════════════════════════════════════════════════════════════════════

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const desde = searchParams.get('desde');
    const hasta = searchParams.get('hasta');
    const promoId = searchParams.get('promoId');

    const fechaDesde = desde ? new Date(desde) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const fechaHasta = hasta ? new Date(hasta) : new Date();

    // Si piden stats de una promo específica
    if (promoId) {
      const promo = await kv.get(`promociones:${promoId}`);
      if (!promo) {
        return Response.json({ success: false, error: 'Promoción no encontrada' }, { status: 404 });
      }

      const clicks = await kv.get(`promociones:clicks:${promoId}`) || [];
      const clicksFiltrados = clicks.filter(c => {
        const fecha = new Date(c.timestamp);
        return fecha >= fechaDesde && fecha <= fechaHasta;
      });

      // Agrupar clicks por día
      const clicksPorDia = {};
      clicksFiltrados.forEach(c => {
        const dia = new Date(c.timestamp).toISOString().split('T')[0];
        clicksPorDia[dia] = (clicksPorDia[dia] || 0) + 1;
      });

      // Agrupar por ubicación
      const clicksPorUbicacion = {};
      clicksFiltrados.forEach(c => {
        const ubi = c.ubicacion || 'desconocida';
        clicksPorUbicacion[ubi] = (clicksPorUbicacion[ubi] || 0) + 1;
      });

      const vistas = promo.stats?.vistas || 0;
      const totalClicks = clicksFiltrados.length;
      const ctr = vistas > 0 ? ((totalClicks / vistas) * 100).toFixed(2) : 0;

      return Response.json({
        success: true,
        promo: {
          id: promo.id,
          titulo: promo.tituloInterno || promo.tituloBanner,
          estado: promo.estado
        },
        stats: {
          vistas,
          clicks: totalClicks,
          ctr: parseFloat(ctr),
          clicksPorDia,
          clicksPorUbicacion
        }
      });
    }

    // Stats generales de todas las promos
    const keys = await kv.keys('promociones:promo_*');
    const promociones = [];
    let totalVistas = 0;
    let totalClicks = 0;
    const clicksPorUbicacion = {};
    const clicksPorDia = {};

    for (const key of keys) {
      const promo = await kv.get(key);
      if (!promo || !promo.id) continue;

      const vistas = promo.stats?.vistas || 0;
      const clicks = promo.stats?.clicks || 0;
      totalVistas += vistas;
      totalClicks += clicks;

      const ctr = vistas > 0 ? ((clicks / vistas) * 100).toFixed(2) : 0;

      promociones.push({
        id: promo.id,
        titulo: promo.tituloInterno || promo.tituloBanner,
        estado: promo.estado,
        vistas,
        clicks,
        ctr: parseFloat(ctr),
        ubicaciones: promo.ubicaciones || []
      });

      // Obtener clicks detallados
      const clicksDetalle = await kv.get(`promociones:clicks:${promo.id}`) || [];
      clicksDetalle.forEach(c => {
        const fecha = new Date(c.timestamp);
        if (fecha >= fechaDesde && fecha <= fechaHasta) {
          const dia = fecha.toISOString().split('T')[0];
          clicksPorDia[dia] = (clicksPorDia[dia] || 0) + 1;

          const ubi = c.ubicacion || 'desconocida';
          clicksPorUbicacion[ubi] = (clicksPorUbicacion[ubi] || 0) + 1;
        }
      });
    }

    // Ordenar promociones por CTR
    promociones.sort((a, b) => b.ctr - a.ctr);

    // Top promociones
    const topPromos = promociones.slice(0, 5);
    const mejorCTR = promociones[0] || null;

    // Calcular CTR general
    const ctrGeneral = totalVistas > 0 ? ((totalClicks / totalVistas) * 100).toFixed(2) : 0;

    // Preparar datos para gráfico (últimos 30 días)
    const grafico = [];
    for (let i = 29; i >= 0; i--) {
      const fecha = new Date();
      fecha.setDate(fecha.getDate() - i);
      const dia = fecha.toISOString().split('T')[0];
      grafico.push({
        fecha: dia,
        clicks: clicksPorDia[dia] || 0
      });
    }

    return Response.json({
      success: true,
      periodo: {
        desde: fechaDesde.toISOString(),
        hasta: fechaHasta.toISOString()
      },
      resumen: {
        totalPromociones: promociones.length,
        activas: promociones.filter(p => p.estado === 'activa').length,
        totalVistas,
        totalClicks,
        ctrGeneral: parseFloat(ctrGeneral)
      },
      promociones,
      topPromos,
      mejorCTR,
      clicksPorUbicacion,
      grafico
    });

  } catch (error) {
    console.error('[PROMOCIONES/STATS] Error:', error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST - Registrar click con detalles
export async function POST(request) {
  try {
    const body = await request.json();
    const { promoId, ubicacion, userId, dispositivo } = body;

    if (!promoId) {
      return Response.json({ success: false, error: 'promoId requerido' }, { status: 400 });
    }

    // Registrar click detallado
    const clickData = {
      timestamp: new Date().toISOString(),
      ubicacion: ubicacion || 'desconocida',
      userId: userId || null,
      dispositivo: dispositivo || 'desconocido'
    };

    const clicks = await kv.get(`promociones:clicks:${promoId}`) || [];
    clicks.push(clickData);

    // Limitar a últimos 10000 clicks
    if (clicks.length > 10000) {
      clicks.splice(0, clicks.length - 10000);
    }

    await kv.set(`promociones:clicks:${promoId}`, clicks);

    // También actualizar contador simple en la promo
    const promo = await kv.get(`promociones:${promoId}`);
    if (promo) {
      promo.stats = promo.stats || { vistas: 0, clicks: 0 };
      promo.stats.clicks++;
      await kv.set(`promociones:${promoId}`, promo);
    }

    return Response.json({ success: true });

  } catch (error) {
    console.error('[PROMOCIONES/STATS] Error POST:', error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
