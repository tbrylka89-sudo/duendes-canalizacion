import { kv } from '@vercel/kv';

// ═══════════════════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS (migradas del viejo sistema)
// ═══════════════════════════════════════════════════════════════════════════════

function getSemanaDelMes() {
  const hoy = new Date();
  const dia = hoy.getDate();
  if (dia <= 7) return 'S1';
  if (dia <= 14) return 'S2';
  if (dia <= 21) return 'S3';
  return 'S4';
}

function moduloDesbloqueado(modulo, curso) {
  // Si el curso está en modo libre, todos los módulos están desbloqueados
  if (curso.modoLibre) return true;

  // Obtener semana actual
  const semanaActual = getSemanaDelMes();
  const semanaNum = parseInt(semanaActual.replace('S', ''));

  // Un módulo está desbloqueado si su número es <= a la semana actual
  return modulo.numero <= semanaNum;
}

function calcularProgresoCurso(curso, modulosCompletadosIds) {
  if (!curso.modulos || curso.modulos.length === 0) return 0;

  const totalModulos = curso.modulos.length;
  const completados = modulosCompletadosIds?.length || 0;

  return Math.round((completados / totalModulos) * 100);
}

// ═══════════════════════════════════════════════════════════════════════════════
// API: CURSO INDIVIDUAL PARA MIEMBROS DEL CIRCULO
// Obtiene curso completo con módulos, duendes y progreso del usuario
// ═══════════════════════════════════════════════════════════════════════════════

export const dynamic = 'force-dynamic';

// GET - Obtener curso completo con módulos
export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const usuarioId = searchParams.get('usuarioId');

    // Obtener el curso
    const curso = await kv.get(`curso:${id}`);

    if (!curso) {
      return Response.json({
        success: false,
        error: 'Curso no encontrado'
      }, { status: 404 });
    }

    // Solo permitir acceso a cursos publicados
    if (curso.estado !== 'publicado') {
      return Response.json({
        success: false,
        error: 'Este curso aún no está disponible'
      }, { status: 403 });
    }

    // Obtener duende de la semana actual
    const duendeSemana = await kv.get('duende-semana-actual');

    // Determinar qué semana del mes es
    const semanaActual = getSemanaDelMes();
    const semanaNum = parseInt(semanaActual.replace('S', ''));

    // Procesar módulos: marcar cuáles están desbloqueados
    const modulosProcesados = curso.modulos.map(modulo => {
      const desbloqueado = moduloDesbloqueado(modulo, curso);

      // Verificar si el duende de este módulo es el duende de la semana
      const esDuendeDeLaSemana = duendeSemana &&
        (modulo.duende?.categoria?.toLowerCase() === duendeSemana.categoria?.toLowerCase() ||
         modulo.duende?.nombre === duendeSemana.nombre);

      return {
        ...modulo,
        desbloqueado,
        esDuendeDeLaSemana,
        esModuloActivo: modulo.numero === semanaNum,
        // Si está bloqueado, no enviar el contenido completo
        contenido: desbloqueado ? modulo.contenido : {
          introduccion: 'Este módulo se desbloqueará la próxima semana.',
          leccion: null,
          ejercicio: null,
          reflexion: null
        }
      };
    });

    // Obtener progreso del usuario si se proporcionó ID
    let progreso = null;
    let modulosCompletados = [];

    if (usuarioId) {
      const progresoData = await kv.get(`progreso:${usuarioId}:${id}`);
      if (progresoData) {
        progreso = progresoData;
        modulosCompletados = progresoData.modulosCompletados || [];
      }
    }

    // Calcular progreso general
    const porcentajeProgreso = calcularProgresoCurso(
      { ...curso, modulos: modulosProcesados },
      modulosCompletados.map(m => `${id}_m${m}`)
    );

    // Encontrar el módulo sugerido (siguiente sin completar)
    let moduloSugerido = null;
    for (const modulo of modulosProcesados) {
      if (modulo.desbloqueado && !modulosCompletados.includes(modulo.numero)) {
        moduloSugerido = modulo.numero;
        break;
      }
    }

    return Response.json({
      success: true,
      curso: {
        id: curso.id,
        nombre: curso.nombre,
        descripcion: curso.descripcion,
        mes: curso.mes,
        año: curso.año,
        portal: curso.portal,
        portalInfo: curso.portalInfo,
        imagen: curso.imagen,
        badge: curso.badge,
        modulos: modulosProcesados,
        totalModulos: curso.modulos.length
      },
      duendeSemana: duendeSemana ? {
        nombre: duendeSemana.nombre,
        categoria: duendeSemana.categoria,
        imagen: duendeSemana.imagen,
        personalidad: duendeSemana.personalidadGenerada
      } : null,
      semanaActual: {
        numero: semanaNum,
        id: semanaActual
      },
      progreso: {
        porcentaje: porcentajeProgreso,
        modulosCompletados,
        moduloSugerido,
        ultimaVisita: progreso?.ultimaVisita || null
      }
    });

  } catch (error) {
    console.error('[CURSO-DETALLE] Error GET:', error);
    return Response.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}

// POST - Registrar progreso en el curso
export async function POST(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { usuarioId, accion, moduloNumero } = body;

    if (!usuarioId) {
      return Response.json({
        success: false,
        error: 'usuarioId requerido'
      }, { status: 400 });
    }

    const curso = await kv.get(`curso:${id}`);
    if (!curso) {
      return Response.json({
        success: false,
        error: 'Curso no encontrado'
      }, { status: 404 });
    }

    const progresoKey = `progreso:${usuarioId}:${id}`;
    let progreso = await kv.get(progresoKey) || {
      cursoId: id,
      modulosCompletados: [],
      porcentaje: 0,
      iniciado: null,
      completado: null,
      ultimaVisita: null
    };

    // COMPLETAR MODULO
    if (accion === 'completar-modulo') {
      if (!moduloNumero) {
        return Response.json({
          success: false,
          error: 'moduloNumero requerido'
        }, { status: 400 });
      }

      // Verificar que el módulo esté desbloqueado
      const modulo = curso.modulos.find(m => m.numero === moduloNumero);
      if (!modulo) {
        return Response.json({
          success: false,
          error: 'Módulo no encontrado'
        }, { status: 404 });
      }

      if (!moduloDesbloqueado(modulo, curso)) {
        return Response.json({
          success: false,
          error: 'Este módulo aún no está disponible'
        }, { status: 403 });
      }

      // Registrar inicio si es primer módulo
      if (!progreso.iniciado) {
        progreso.iniciado = new Date().toISOString();
      }

      // Agregar módulo a completados si no está
      if (!progreso.modulosCompletados.includes(moduloNumero)) {
        progreso.modulosCompletados.push(moduloNumero);
        progreso.modulosCompletados.sort((a, b) => a - b);
      }

      // Calcular porcentaje
      progreso.porcentaje = Math.round(
        (progreso.modulosCompletados.length / curso.modulos.length) * 100
      );

      progreso.ultimaVisita = new Date().toISOString();

      // Verificar si completó el curso
      let badgeOtorgado = null;
      if (progreso.porcentaje >= 100 && !progreso.completado) {
        progreso.completado = new Date().toISOString();

        // Otorgar badge si el curso tiene uno
        if (curso.badge) {
          const badgesKey = `usuario:${usuarioId}:badges`;
          const badges = await kv.get(badgesKey) || [];

          if (!badges.find(b => b.cursoId === id)) {
            badgeOtorgado = {
              ...curso.badge,
              cursoId: id,
              cursoNombre: curso.nombre,
              obtenido: new Date().toISOString()
            };
            badges.push(badgeOtorgado);
            await kv.set(badgesKey, badges);

            // Bonus de runas por completar curso
            const perfil = await kv.get(`circulo:perfil:${usuarioId}`) || {};
            perfil.runas = (perfil.runas || 0) + 100; // 100 runas por completar curso
            await kv.set(`circulo:perfil:${usuarioId}`, perfil);
          }
        }
      }

      await kv.set(progresoKey, progreso);

      return Response.json({
        success: true,
        progreso,
        mensaje: progreso.completado
          ? 'Curso completado! Has ganado 100 runas'
          : `Modulo ${moduloNumero} completado`,
        badgeOtorgado
      });
    }

    // REGISTRAR VISITA
    if (accion === 'visita') {
      progreso.ultimaVisita = new Date().toISOString();
      if (!progreso.iniciado) {
        progreso.iniciado = new Date().toISOString();
      }
      await kv.set(progresoKey, progreso);

      return Response.json({
        success: true,
        progreso
      });
    }

    // REINICIAR PROGRESO
    if (accion === 'reiniciar') {
      progreso = {
        cursoId: id,
        modulosCompletados: [],
        porcentaje: 0,
        iniciado: null,
        completado: null,
        ultimaVisita: new Date().toISOString()
      };
      await kv.set(progresoKey, progreso);

      return Response.json({
        success: true,
        progreso,
        mensaje: 'Progreso reiniciado'
      });
    }

    return Response.json({
      success: false,
      error: 'Acción no válida'
    }, { status: 400 });

  } catch (error) {
    console.error('[CURSO-DETALLE] Error POST:', error);
    return Response.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
