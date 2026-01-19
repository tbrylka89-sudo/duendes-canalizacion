import { kv } from '@vercel/kv';

// ═══════════════════════════════════════════════════════════════════════════════
// API: PROGRESO DE CURSOS
// Guarda y recupera el progreso del usuario en cursos
// ═══════════════════════════════════════════════════════════════════════════════

export const dynamic = 'force-dynamic';

// GET - Obtener progreso de un usuario
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const usuarioId = searchParams.get('usuarioId');
  const cursoId = searchParams.get('cursoId');

  if (!usuarioId) {
    return Response.json({ success: false, error: 'usuarioId requerido' }, { status: 400 });
  }

  try {
    // Progreso de un curso específico
    if (cursoId) {
      const progreso = await kv.get(`progreso:${usuarioId}:${cursoId}`) || {
        cursoId,
        leccionesCompletadas: [],
        porcentaje: 0,
        ultimaLeccion: null,
        iniciado: null,
        completado: null
      };

      return Response.json({ success: true, progreso });
    }

    // Todo el progreso del usuario
    const cursosIds = await kv.smembers('cursos:lista') || [];
    const progresos = [];

    for (const cId of cursosIds) {
      const progreso = await kv.get(`progreso:${usuarioId}:${cId}`);
      if (progreso) {
        progresos.push(progreso);
      }
    }

    // Badges del usuario
    const badges = await kv.get(`usuario:${usuarioId}:badges`) || [];

    return Response.json({
      success: true,
      progresos,
      badges,
      cursosIniciados: progresos.length,
      cursosCompletados: progresos.filter(p => p.completado).length
    });

  } catch (error) {
    console.error('[PROGRESO] Error GET:', error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST - Actualizar progreso
export async function POST(request) {
  try {
    const { usuarioId, cursoId, leccionId, accion } = await request.json();

    if (!usuarioId || !cursoId) {
      return Response.json({ success: false, error: 'usuarioId y cursoId requeridos' }, { status: 400 });
    }

    const progresoKey = `progreso:${usuarioId}:${cursoId}`;
    let progreso = await kv.get(progresoKey) || {
      cursoId,
      leccionesCompletadas: [],
      porcentaje: 0,
      ultimaLeccion: null,
      iniciado: null,
      completado: null
    };

    // MARCAR LECCIÓN COMO COMPLETADA
    if (accion === 'completar-leccion' && leccionId) {
      if (!progreso.iniciado) {
        progreso.iniciado = new Date().toISOString();
      }

      if (!progreso.leccionesCompletadas.includes(leccionId)) {
        progreso.leccionesCompletadas.push(leccionId);
      }

      progreso.ultimaLeccion = {
        id: leccionId,
        fecha: new Date().toISOString()
      };

      // Calcular porcentaje
      const curso = await kv.get(`curso:${cursoId}`);
      if (curso) {
        const totalLecciones = curso.totalLecciones || 1;
        progreso.porcentaje = Math.round((progreso.leccionesCompletadas.length / totalLecciones) * 100);

        // Verificar si completó el curso
        if (progreso.porcentaje >= 100 && !progreso.completado) {
          progreso.completado = new Date().toISOString();

          // Otorgar badge si el curso tiene uno
          if (curso.badge) {
            const badgesKey = `usuario:${usuarioId}:badges`;
            const badges = await kv.get(badgesKey) || [];

            const badgeExiste = badges.find(b => b.cursoId === cursoId);
            if (!badgeExiste) {
              badges.push({
                ...curso.badge,
                cursoId,
                cursoTitulo: curso.titulo,
                obtenido: new Date().toISOString()
              });
              await kv.set(badgesKey, badges);

              // Agregar runas de bonificación por completar
              const perfil = await kv.get(`circulo:perfil:${usuarioId}`) || {};
              perfil.runas = (perfil.runas || 0) + 50; // 50 runas por completar curso
              await kv.set(`circulo:perfil:${usuarioId}`, perfil);
            }
          }
        }
      }

      await kv.set(progresoKey, progreso);

      return Response.json({
        success: true,
        progreso,
        mensaje: progreso.completado ? '¡Curso completado! Badge desbloqueado 🎉' : 'Lección completada'
      });
    }

    // REINICIAR PROGRESO
    if (accion === 'reiniciar') {
      progreso = {
        cursoId,
        leccionesCompletadas: [],
        porcentaje: 0,
        ultimaLeccion: null,
        iniciado: null,
        completado: null
      };

      await kv.set(progresoKey, progreso);

      return Response.json({
        success: true,
        progreso,
        mensaje: 'Progreso reiniciado'
      });
    }

    return Response.json({ success: false, error: 'Acción no válida' }, { status: 400 });

  } catch (error) {
    console.error('[PROGRESO] Error POST:', error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
