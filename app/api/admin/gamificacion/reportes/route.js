import { kv } from '@vercel/kv';

// ═══════════════════════════════════════════════════════════════════════════════
// API: REPORTES DE GAMIFICACIÓN
// Genera reportes con datos de Vercel KV
// ═══════════════════════════════════════════════════════════════════════════════

export const dynamic = 'force-dynamic';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const tipo = searchParams.get('tipo') || 'economia';
  const desde = searchParams.get('desde'); // fecha inicio YYYY-MM-DD
  const hasta = searchParams.get('hasta'); // fecha fin YYYY-MM-DD

  try {
    let reporte = {};

    switch (tipo) {
      case 'economia':
        reporte = await generarReporteEconomia();
        break;
      case 'lecturas':
        reporte = await generarReporteLecturas();
        break;
      case 'actividad':
        reporte = await generarReporteActividad();
        break;
      case 'retencion':
        reporte = await generarReporteRetencion();
        break;
      case 'referidos':
        reporte = await generarReporteReferidos();
        break;
      case 'logros':
        reporte = await generarReporteLogros();
        break;
      default:
        return Response.json({ success: false, error: 'Tipo de reporte no válido' }, { status: 400 });
    }

    return Response.json({
      success: true,
      tipo,
      generadoEn: new Date().toISOString(),
      reporte
    });

  } catch (error) {
    console.error('[REPORTE] Error:', error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// GENERADORES DE REPORTES
// ═══════════════════════════════════════════════════════════════════════════════

async function generarReporteEconomia() {
  // Obtener datos de usuarios con gamificación
  const keys = await kv.keys('gamificacion:usuario:*');

  let totalRunasGanadas = 0;
  let totalRunasGastadas = 0;
  let totalUsuarios = keys.length;
  let usuariosPorNivel = { iniciada: 0, aprendiz: 0, guardiana: 0, maestra: 0, sabia: 0 };
  let topUsuarios = [];

  for (const key of keys.slice(0, 100)) { // Limitar a 100 para performance
    try {
      const data = await kv.get(key);
      if (data) {
        totalRunasGanadas += data.runas || 0;
        totalRunasGastadas += data.runasGastadas || 0;

        const nivel = data.nivel?.toLowerCase() || 'iniciada';
        if (usuariosPorNivel[nivel] !== undefined) {
          usuariosPorNivel[nivel]++;
        }

        topUsuarios.push({
          email: key.replace('gamificacion:usuario:', '').slice(0, 3) + '***',
          runas: data.runas || 0,
          nivel: data.nivel || 'Iniciada'
        });
      }
    } catch (e) {
      // Ignorar errores individuales
    }
  }

  // Ordenar por runas
  topUsuarios.sort((a, b) => b.runas - a.runas);
  topUsuarios = topUsuarios.slice(0, 10);

  return {
    resumen: {
      totalUsuarios,
      totalRunasGanadas,
      totalRunasGastadas,
      balanceNeto: totalRunasGanadas - totalRunasGastadas,
      promedioRunasPorUsuario: totalUsuarios > 0 ? Math.round(totalRunasGanadas / totalUsuarios) : 0
    },
    distribucionNiveles: usuariosPorNivel,
    topUsuarios
  };
}

async function generarReporteLecturas() {
  // Obtener historial de lecturas
  const keys = await kv.keys('lectura:historial:*');

  let lecturasConteo = {};
  let totalLecturas = 0;

  for (const key of keys.slice(0, 100)) {
    try {
      const historial = await kv.get(key);
      if (Array.isArray(historial)) {
        for (const lectura of historial) {
          totalLecturas++;
          const tipo = lectura.tipo || 'desconocido';
          lecturasConteo[tipo] = (lecturasConteo[tipo] || 0) + 1;
        }
      }
    } catch (e) {
      // Ignorar errores
    }
  }

  // Ordenar por popularidad
  const ranking = Object.entries(lecturasConteo)
    .map(([tipo, cantidad]) => ({ tipo, cantidad, porcentaje: Math.round((cantidad / totalLecturas) * 100) }))
    .sort((a, b) => b.cantidad - a.cantidad);

  return {
    resumen: {
      totalLecturas,
      tiposUnicos: Object.keys(lecturasConteo).length
    },
    ranking
  };
}

async function generarReporteActividad() {
  // Obtener actividad de cofres
  const keys = await kv.keys('gamificacion:usuario:*');

  let actividadPorDia = {};
  let totalCofresReclamados = 0;
  let rachaMaxima = 0;
  let usuariosActivos = 0;

  const hoy = new Date();
  const hace7dias = new Date(hoy.getTime() - 7 * 24 * 60 * 60 * 1000);

  for (const key of keys.slice(0, 100)) {
    try {
      const data = await kv.get(key);
      if (data) {
        if (data.ultimoCofre) {
          const fecha = new Date(data.ultimoCofre).toISOString().split('T')[0];
          actividadPorDia[fecha] = (actividadPorDia[fecha] || 0) + 1;
          totalCofresReclamados++;

          if (new Date(data.ultimoCofre) > hace7dias) {
            usuariosActivos++;
          }
        }

        if (data.racha > rachaMaxima) {
          rachaMaxima = data.racha;
        }
      }
    } catch (e) {
      // Ignorar
    }
  }

  // Ordenar actividad por fecha
  const actividadOrdenada = Object.entries(actividadPorDia)
    .sort((a, b) => b[0].localeCompare(a[0]))
    .slice(0, 30)
    .map(([fecha, cofres]) => ({ fecha, cofres }));

  return {
    resumen: {
      totalCofresReclamados,
      rachaMaxima,
      usuariosActivosUltimos7Dias: usuariosActivos
    },
    actividadDiaria: actividadOrdenada
  };
}

async function generarReporteRetencion() {
  const keys = await kv.keys('gamificacion:usuario:*');

  const hoy = new Date();
  const hace7dias = new Date(hoy.getTime() - 7 * 24 * 60 * 60 * 1000);
  const hace30dias = new Date(hoy.getTime() - 30 * 24 * 60 * 60 * 1000);

  let activosHoy = 0;
  let activos7dias = 0;
  let activos30dias = 0;
  let inactivos = 0;
  let totalUsuarios = keys.length;

  for (const key of keys.slice(0, 100)) {
    try {
      const data = await kv.get(key);
      if (data?.ultimoCofre) {
        const ultimaActividad = new Date(data.ultimoCofre);

        if (ultimaActividad.toDateString() === hoy.toDateString()) {
          activosHoy++;
        }
        if (ultimaActividad > hace7dias) {
          activos7dias++;
        }
        if (ultimaActividad > hace30dias) {
          activos30dias++;
        } else {
          inactivos++;
        }
      } else {
        inactivos++;
      }
    } catch (e) {
      // Ignorar
    }
  }

  return {
    resumen: {
      totalUsuarios,
      activosHoy,
      activos7dias,
      activos30dias,
      inactivos
    },
    tasas: {
      retencion7dias: totalUsuarios > 0 ? Math.round((activos7dias / totalUsuarios) * 100) : 0,
      retencion30dias: totalUsuarios > 0 ? Math.round((activos30dias / totalUsuarios) * 100) : 0
    }
  };
}

async function generarReporteReferidos() {
  const keys = await kv.keys('referido:*');

  let topReferidores = [];
  let totalReferidos = 0;
  let referidosConvertidos = 0;

  for (const key of keys.slice(0, 100)) {
    try {
      const data = await kv.get(key);
      if (data) {
        const referidos = data.referidos || [];
        totalReferidos += referidos.length;

        const convertidos = referidos.filter(r => r.convertido).length;
        referidosConvertidos += convertidos;

        if (referidos.length > 0) {
          topReferidores.push({
            codigo: key.replace('referido:', '').slice(0, 6) + '***',
            totalReferidos: referidos.length,
            convertidos
          });
        }
      }
    } catch (e) {
      // Ignorar
    }
  }

  topReferidores.sort((a, b) => b.totalReferidos - a.totalReferidos);
  topReferidores = topReferidores.slice(0, 10);

  return {
    resumen: {
      totalReferidos,
      referidosConvertidos,
      tasaConversion: totalReferidos > 0 ? Math.round((referidosConvertidos / totalReferidos) * 100) : 0
    },
    topReferidores
  };
}

async function generarReporteLogros() {
  const keys = await kv.keys('gamificacion:usuario:*');

  let badgesConteo = {};
  let totalBadges = 0;
  let nivelesConteo = {
    'Iniciada': 0,
    'Aprendiz': 0,
    'Guardiana': 0,
    'Maestra': 0,
    'Sabia': 0
  };

  for (const key of keys.slice(0, 100)) {
    try {
      const data = await kv.get(key);
      if (data) {
        // Contar niveles
        const nivel = data.nivel || 'Iniciada';
        if (nivelesConteo[nivel] !== undefined) {
          nivelesConteo[nivel]++;
        }

        // Contar badges
        if (Array.isArray(data.badges)) {
          for (const badge of data.badges) {
            totalBadges++;
            const nombre = badge.nombre || badge;
            badgesConteo[nombre] = (badgesConteo[nombre] || 0) + 1;
          }
        }
      }
    } catch (e) {
      // Ignorar
    }
  }

  // Ordenar badges por popularidad
  const badgesRanking = Object.entries(badgesConteo)
    .map(([nombre, cantidad]) => ({ nombre, cantidad }))
    .sort((a, b) => b.cantidad - a.cantidad)
    .slice(0, 10);

  return {
    resumen: {
      totalBadgesOtorgados: totalBadges,
      badgesUnicos: Object.keys(badgesConteo).length
    },
    distribucionNiveles: nivelesConteo,
    badgesMasObtenidos: badgesRanking
  };
}
