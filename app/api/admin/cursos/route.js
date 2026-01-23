import { kv } from '@vercel/kv';
import {
  DUENDES_POR_CATEGORIA,
  crearEstructuraCurso,
  crearModulo,
  validarCurso,
  getPortalPorMes
} from '@/lib/cursos/cursos-data';

// ═══════════════════════════════════════════════════════════════════════════════
// API: GESTIÓN DE CURSOS MODULARES
// Sistema completo: 1 curso/mes, 4 módulos/curso, 1 duende/módulo
// ═══════════════════════════════════════════════════════════════════════════════

export const dynamic = 'force-dynamic';

// GET - Listar cursos o obtener uno específico
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const tipo = searchParams.get('tipo'); // 'admin' | 'publico'
  const mes = searchParams.get('mes');
  const año = searchParams.get('año');

  try {
    // Obtener un curso específico por ID
    if (id) {
      const curso = await kv.get(`curso:${id}`);
      if (!curso) {
        return Response.json({ success: false, error: 'Curso no encontrado' }, { status: 404 });
      }

      // Transformar estructura de módulos para compatibilidad con frontend
      // El frontend espera modulo.lecciones[], pero tenemos modulo.contenido.{intro, leccion, ejercicio}
      const cursoTransformado = {
        ...curso,
        titulo: curso.nombre, // Alias para compatibilidad
        modulos: curso.modulos?.map(modulo => {
          // Si ya tiene lecciones como array, mantenerlas
          if (modulo.lecciones && Array.isArray(modulo.lecciones)) {
            return modulo;
          }

          // Si tiene contenido en formato viejo, transformar a lecciones
          if (modulo.contenido) {
            return {
              ...modulo,
              lecciones: [
                {
                  numero: 1,
                  titulo: 'Introducción',
                  duracion_minutos: 5,
                  contenido: modulo.contenido.introduccion || '',
                  ejercicio_practico: null,
                  reflexion: null
                },
                {
                  numero: 2,
                  titulo: modulo.titulo || 'Lección Principal',
                  duracion_minutos: 15,
                  contenido: modulo.contenido.leccion || '',
                  ejercicio_practico: modulo.contenido.ejercicio || '',
                  reflexion: modulo.contenido.reflexion || ''
                }
              ]
            };
          }

          return modulo;
        }) || []
      };

      // Para público, enriquecer con info del duende actual de la semana
      if (tipo === 'publico') {
        const duendeSemana = await kv.get('duende-semana-actual');
        return Response.json({
          success: true,
          curso: cursoTransformado,
          duendeSemanaActual: duendeSemana
        });
      }

      return Response.json({ success: true, curso: cursoTransformado });
    }

    // Listar todos los cursos
    const cursosIds = await kv.smembers('cursos:lista') || [];
    let cursos = [];

    for (const cursoId of cursosIds) {
      const curso = await kv.get(`curso:${cursoId}`);
      if (curso) {
        // Filtrar por mes/año si se especifica
        if (mes && curso.mes !== mes.toLowerCase()) continue;
        if (año && curso.año !== parseInt(año)) continue;

        // Para listado público, solo datos básicos
        if (tipo === 'publico') {
          // Calcular total de lecciones real
          let totalLecciones = 0;
          curso.modulos?.forEach(m => {
            totalLecciones += m.lecciones?.length || 1;
          });

          cursos.push({
            id: curso.id,
            nombre: curso.nombre,
            titulo: curso.nombre, // Alias para compatibilidad con frontend
            descripcion: curso.descripcion,
            mes: curso.mes,
            año: curso.año,
            portal: curso.portal,
            duracion: `${curso.modulos?.length || 4} semanas`,
            nivel: curso.nivel || 'todos',
            imagen: curso.imagen,
            totalModulos: curso.modulos?.length || 0,
            totalLecciones: totalLecciones,
            badge: curso.badge,
            estado: curso.estado,
            modulos: curso.modulos, // Incluir módulos para el detalle
            // Resumen de duendes que enseñan
            duendes: curso.modulos?.map(m => ({
              nombre: m.duende?.nombre,
              categoria: m.duende?.categoria,
              modulo: m.numero
            })) || []
          });
        } else {
          cursos.push(curso);
        }
      }
    }

    // Ordenar: publicados primero, luego por fecha
    cursos.sort((a, b) => {
      if (a.estado === 'publicado' && b.estado !== 'publicado') return -1;
      if (b.estado === 'publicado' && a.estado !== 'publicado') return 1;
      return new Date(b.creado || 0) - new Date(a.creado || 0);
    });

    // Incluir catálogo de duendes disponibles para admin
    let duendesDisponibles = null;
    if (tipo !== 'publico') {
      duendesDisponibles = DUENDES_POR_CATEGORIA;
    }

    return Response.json({
      success: true,
      cursos,
      total: cursos.length,
      duendesDisponibles
    });

  } catch (error) {
    console.error('[CURSOS] Error GET:', error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST - Todas las acciones de gestión
export async function POST(request) {
  try {
    const body = await request.json();
    const { accion } = body;

    switch (accion) {
      // ═══════════════════════════════════════════════════════════════════
      // CREAR CURSO NUEVO
      // ═══════════════════════════════════════════════════════════════════
      case 'crear': {
        const { nombre, mes, año, descripcion, portal } = body;

        if (!nombre || !mes || !año) {
          return Response.json({
            success: false,
            error: 'Nombre, mes y año son requeridos'
          }, { status: 400 });
        }

        const portalInfo = portal ? { id: portal, ...getPortalPorMes(mes) } : getPortalPorMes(mes);

        const curso = crearEstructuraCurso({
          nombre,
          mes,
          año: parseInt(año),
          descripcion: descripcion || `Curso del mes de ${mes} ${año}`,
          portal: portalInfo
        });

        await kv.set(`curso:${curso.id}`, curso);
        await kv.sadd('cursos:lista', curso.id);

        return Response.json({
          success: true,
          curso,
          mensaje: 'Curso creado. Ahora agregá los 4 módulos.'
        });
      }

      // ═══════════════════════════════════════════════════════════════════
      // AGREGAR MÓDULO A CURSO
      // ═══════════════════════════════════════════════════════════════════
      case 'agregar-modulo': {
        const { cursoId, modulo } = body;

        const curso = await kv.get(`curso:${cursoId}`);
        if (!curso) {
          return Response.json({ success: false, error: 'Curso no encontrado' }, { status: 404 });
        }

        if (curso.modulos.length >= 4) {
          return Response.json({
            success: false,
            error: 'El curso ya tiene 4 módulos (máximo permitido)'
          }, { status: 400 });
        }

        const nuevoModulo = crearModulo({
          numero: curso.modulos.length + 1,
          semana: modulo.semana || `${curso.año}-${String(curso.mes === 'enero' ? 1 : curso.mes === 'febrero' ? 2 : curso.mes === 'marzo' ? 3 : curso.mes === 'abril' ? 4 : curso.mes === 'mayo' ? 5 : curso.mes === 'junio' ? 6 : curso.mes === 'julio' ? 7 : curso.mes === 'agosto' ? 8 : curso.mes === 'septiembre' ? 9 : curso.mes === 'octubre' ? 10 : curso.mes === 'noviembre' ? 11 : 12).padStart(2, '0')}-S${curso.modulos.length + 1}`,
          titulo: modulo.titulo,
          duendeCategoria: modulo.duendeCategoria,
          contenido: modulo.contenido
        });

        curso.modulos.push(nuevoModulo);
        curso.actualizado = new Date().toISOString();

        await kv.set(`curso:${cursoId}`, curso);

        return Response.json({
          success: true,
          modulo: nuevoModulo,
          curso,
          mensaje: `Módulo ${nuevoModulo.numero} agregado`
        });
      }

      // ═══════════════════════════════════════════════════════════════════
      // ACTUALIZAR MÓDULO
      // ═══════════════════════════════════════════════════════════════════
      case 'actualizar-modulo': {
        const { cursoId, moduloNumero, datos } = body;

        const curso = await kv.get(`curso:${cursoId}`);
        if (!curso) {
          return Response.json({ success: false, error: 'Curso no encontrado' }, { status: 404 });
        }

        const moduloIdx = curso.modulos.findIndex(m => m.numero === moduloNumero);
        if (moduloIdx === -1) {
          return Response.json({ success: false, error: 'Módulo no encontrado' }, { status: 404 });
        }

        // Si cambió el duende, actualizar info completa
        if (datos.duendeCategoria) {
          const duende = DUENDES_POR_CATEGORIA[datos.duendeCategoria.toLowerCase()];
          if (duende) {
            curso.modulos[moduloIdx].duendeId = duende.id;
            curso.modulos[moduloIdx].duende = {
              id: duende.id,
              nombre: duende.nombre,
              categoria: duende.categoria,
              personalidad: duende.personalidad,
              tono: duende.tono,
              fraseCaracteristica: duende.fraseCaracteristica,
              comoEnsena: duende.comoEnsena,
              cristales: duende.cristales,
              elemento: duende.elemento
            };
          }
        }

        // Actualizar otros campos
        if (datos.titulo) curso.modulos[moduloIdx].titulo = datos.titulo;
        if (datos.contenido) {
          curso.modulos[moduloIdx].contenido = {
            ...curso.modulos[moduloIdx].contenido,
            ...datos.contenido
          };
        }
        if (datos.duracion_minutos) curso.modulos[moduloIdx].duracion_minutos = datos.duracion_minutos;

        curso.actualizado = new Date().toISOString();
        await kv.set(`curso:${cursoId}`, curso);

        return Response.json({
          success: true,
          modulo: curso.modulos[moduloIdx],
          mensaje: 'Módulo actualizado'
        });
      }

      // ═══════════════════════════════════════════════════════════════════
      // GUARDAR CURSO COMPLETO
      // ═══════════════════════════════════════════════════════════════════
      case 'guardar': {
        const { curso } = body;

        if (!curso) {
          return Response.json({ success: false, error: 'Datos del curso requeridos' }, { status: 400 });
        }

        // Si no tiene ID, es nuevo
        if (!curso.id) {
          curso.id = `${curso.mes?.toLowerCase() || 'curso'}-${curso.año || new Date().getFullYear()}-${Date.now()}`;
          curso.creado = new Date().toISOString();
        }
        curso.actualizado = new Date().toISOString();

        // Calcular totales
        curso.totalModulos = curso.modulos?.length || 0;
        curso.totalLecciones = curso.modulos?.length || 0;

        await kv.set(`curso:${curso.id}`, curso);
        await kv.sadd('cursos:lista', curso.id);

        return Response.json({
          success: true,
          curso,
          mensaje: curso.creado === curso.actualizado ? 'Curso creado' : 'Curso actualizado'
        });
      }

      // ═══════════════════════════════════════════════════════════════════
      // PUBLICAR CURSO
      // ═══════════════════════════════════════════════════════════════════
      case 'publicar': {
        const { cursoId } = body;

        const curso = await kv.get(`curso:${cursoId}`);
        if (!curso) {
          return Response.json({ success: false, error: 'Curso no encontrado' }, { status: 404 });
        }

        // Validar que el curso esté completo
        const validacion = validarCurso(curso);
        if (!validacion.esValido) {
          return Response.json({
            success: false,
            error: 'El curso no está completo',
            errores: validacion.errores
          }, { status: 400 });
        }

        curso.estado = 'publicado';
        curso.publicado = new Date().toISOString();
        await kv.set(`curso:${cursoId}`, curso);

        return Response.json({
          success: true,
          mensaje: 'Curso publicado exitosamente'
        });
      }

      // ═══════════════════════════════════════════════════════════════════
      // DESPUBLICAR CURSO
      // ═══════════════════════════════════════════════════════════════════
      case 'despublicar': {
        const { cursoId } = body;

        const curso = await kv.get(`curso:${cursoId}`);
        if (!curso) {
          return Response.json({ success: false, error: 'Curso no encontrado' }, { status: 404 });
        }

        curso.estado = 'borrador';
        await kv.set(`curso:${cursoId}`, curso);

        return Response.json({
          success: true,
          mensaje: 'Curso despublicado'
        });
      }

      // ═══════════════════════════════════════════════════════════════════
      // ELIMINAR CURSO
      // ═══════════════════════════════════════════════════════════════════
      case 'eliminar': {
        const { cursoId } = body;

        await kv.del(`curso:${cursoId}`);
        await kv.srem('cursos:lista', cursoId);

        return Response.json({
          success: true,
          mensaje: 'Curso eliminado'
        });
      }

      // ═══════════════════════════════════════════════════════════════════
      // DUPLICAR CURSO (para crear otro mes basado en uno existente)
      // ═══════════════════════════════════════════════════════════════════
      case 'duplicar': {
        const { cursoId, nuevoMes, nuevoAño } = body;

        const cursoOriginal = await kv.get(`curso:${cursoId}`);
        if (!cursoOriginal) {
          return Response.json({ success: false, error: 'Curso no encontrado' }, { status: 404 });
        }

        const nuevoCurso = {
          ...cursoOriginal,
          id: `${nuevoMes || cursoOriginal.mes}-${nuevoAño || cursoOriginal.año + 1}-${Date.now()}`,
          nombre: `${cursoOriginal.nombre} (copia)`,
          mes: nuevoMes || cursoOriginal.mes,
          año: nuevoAño || cursoOriginal.año + 1,
          estado: 'borrador',
          creado: new Date().toISOString(),
          actualizado: new Date().toISOString(),
          publicado: null
        };

        await kv.set(`curso:${nuevoCurso.id}`, nuevoCurso);
        await kv.sadd('cursos:lista', nuevoCurso.id);

        return Response.json({
          success: true,
          curso: nuevoCurso,
          mensaje: 'Curso duplicado'
        });
      }

      // ═══════════════════════════════════════════════════════════════════
      // OBTENER CATÁLOGO DE DUENDES DISPONIBLES
      // ═══════════════════════════════════════════════════════════════════
      case 'duendes-disponibles': {
        return Response.json({
          success: true,
          duendes: DUENDES_POR_CATEGORIA
        });
      }

      // ═══════════════════════════════════════════════════════════════════
      // VALIDAR CURSO
      // ═══════════════════════════════════════════════════════════════════
      case 'validar': {
        const { cursoId } = body;

        const curso = await kv.get(`curso:${cursoId}`);
        if (!curso) {
          return Response.json({ success: false, error: 'Curso no encontrado' }, { status: 404 });
        }

        const validacion = validarCurso(curso);

        return Response.json({
          success: true,
          validacion,
          curso: {
            id: curso.id,
            nombre: curso.nombre,
            modulosCompletos: curso.modulos?.filter(m =>
              m.contenido?.introduccion && m.contenido?.leccion && m.contenido?.ejercicio
            ).length || 0,
            totalModulos: curso.modulos?.length || 0
          }
        });
      }

      default:
        return Response.json({ success: false, error: 'Acción no válida' }, { status: 400 });
    }

  } catch (error) {
    console.error('[CURSOS] Error POST:', error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}

// PUT - Actualización rápida de curso
export async function PUT(request) {
  try {
    const { cursoId, datos } = await request.json();

    if (!cursoId) {
      return Response.json({ success: false, error: 'cursoId requerido' }, { status: 400 });
    }

    const curso = await kv.get(`curso:${cursoId}`);
    if (!curso) {
      return Response.json({ success: false, error: 'Curso no encontrado' }, { status: 404 });
    }

    // Actualizar campos permitidos
    const camposPermitidos = ['nombre', 'descripcion', 'imagen', 'nivel', 'badge', 'portal'];
    for (const campo of camposPermitidos) {
      if (datos[campo] !== undefined) {
        curso[campo] = datos[campo];
      }
    }

    curso.actualizado = new Date().toISOString();
    await kv.set(`curso:${cursoId}`, curso);

    return Response.json({
      success: true,
      curso,
      mensaje: 'Curso actualizado'
    });

  } catch (error) {
    console.error('[CURSOS] Error PUT:', error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
