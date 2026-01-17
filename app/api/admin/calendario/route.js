import { kv } from '@vercel/kv';
import { calcularFaseLunar, ESTACIONES_CELTAS } from '@/lib/ciclos-naturales';

// ═══════════════════════════════════════════════════════════════════════════════
// API: CALENDARIO EDITORIAL
// Gestiona contenido programado y publicado
// ═══════════════════════════════════════════════════════════════════════════════

// GET - Obtener calendario del mes
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const mes = parseInt(searchParams.get('mes') || new Date().getMonth() + 1);
    const año = parseInt(searchParams.get('ano') || new Date().getFullYear());

    // Calcular días del mes
    const diasEnMes = new Date(año, mes, 0).getDate();
    const primerDia = new Date(año, mes - 1, 1).getDay(); // 0 = Domingo

    // Obtener contenido programado/publicado del mes
    const contenidoMes = await kv.get(`calendario:${año}-${String(mes).padStart(2, '0')}`) || {};

    // Construir array de días con info
    const dias = [];
    for (let dia = 1; dia <= diasEnMes; dia++) {
      const fecha = new Date(año, mes - 1, dia);
      const fechaStr = `${año}-${String(mes).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;

      // Fase lunar para este día
      const faseLunar = calcularFaseLunar(fecha);

      // Verificar si es celebración celta
      let celebracion = null;
      for (const [key, celeb] of Object.entries(ESTACIONES_CELTAS)) {
        if (celeb.fechaNum.mes === mes && celeb.fechaNum.dia === dia) {
          celebracion = { key, ...celeb };
          break;
        }
      }

      dias.push({
        dia,
        fecha: fechaStr,
        diaSemana: fecha.getDay(),
        faseLunar: {
          fase: faseLunar.fase,
          icono: faseLunar.datos.icono,
          nombre: faseLunar.datos.nombre
        },
        celebracion,
        contenido: contenidoMes[fechaStr] || null,
        esHoy: fechaStr === new Date().toISOString().split('T')[0]
      });
    }

    // Estadísticas del mes
    const stats = {
      diasConContenido: dias.filter(d => d.contenido && d.contenido.estado === 'publicado').length,
      diasProgramados: dias.filter(d => d.contenido && d.contenido.estado === 'programado').length,
      diasVacios: dias.filter(d => !d.contenido).length,
      celebraciones: dias.filter(d => d.celebracion).length
    };

    return Response.json({
      success: true,
      mes,
      año,
      diasEnMes,
      primerDia,
      dias,
      stats
    });

  } catch (error) {
    console.error('[CALENDARIO] Error GET:', error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST - Programar o publicar contenido
export async function POST(request) {
  try {
    const body = await request.json();
    const { accion, fecha, contenido } = body;

    if (!fecha) {
      return Response.json({ success: false, error: 'Fecha requerida' }, { status: 400 });
    }

    const [año, mes] = fecha.split('-');
    const keyMes = `calendario:${año}-${mes}`;

    const calendarioMes = await kv.get(keyMes) || {};

    switch (accion) {
      case 'programar':
        calendarioMes[fecha] = {
          ...contenido,
          estado: 'programado',
          programadoEn: new Date().toISOString()
        };
        break;

      case 'publicar':
        calendarioMes[fecha] = {
          ...calendarioMes[fecha],
          ...contenido,
          estado: 'publicado',
          publicadoEn: new Date().toISOString()
        };
        break;

      case 'eliminar':
        delete calendarioMes[fecha];
        break;

      default:
        return Response.json({ success: false, error: 'Acción no válida' }, { status: 400 });
    }

    await kv.set(keyMes, calendarioMes);

    return Response.json({
      success: true,
      mensaje: accion === 'eliminar' ? 'Contenido eliminado' : `Contenido ${accion === 'programar' ? 'programado' : 'publicado'}`
    });

  } catch (error) {
    console.error('[CALENDARIO] Error POST:', error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
