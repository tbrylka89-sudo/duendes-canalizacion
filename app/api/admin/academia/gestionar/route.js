/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * API: GESTIÓN DE CURSOS - ACADEMIA DE GUARDIANES
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * POST /api/admin/academia/gestionar
 *
 * Acciones disponibles:
 * - aprobar: Marca curso como aprobado
 * - programar: Programa publicación para fecha
 * - publicar: Publica inmediatamente
 * - despublicar: Quita de publicados
 * - eliminar: Elimina curso
 * - editar: Edita campos del curso
 * - regenerar: Regenera una lección específica
 */

import { kv } from '@vercel/kv';
import academia from '@/lib/academia';

export async function POST(request) {
  try {
    const body = await request.json();
    const { accion, cursoId, ...datos } = body;

    if (!cursoId) {
      return Response.json({ success: false, error: 'Falta cursoId' }, { status: 400 });
    }

    // Obtener curso
    const curso = await kv.get(`academia:curso:${cursoId}`);
    if (!curso) {
      return Response.json({ success: false, error: 'Curso no encontrado' }, { status: 404 });
    }

    let resultado = { success: true, accion, cursoId };

    switch (accion) {
      // ═══════════════════════════════════════════════════════════════════════
      // APROBAR
      // ═══════════════════════════════════════════════════════════════════════
      case 'aprobar': {
        // Validar antes de aprobar
        const validacion = academia.validaciones.validarCursoParaPublicar(curso);

        if (!validacion.valid) {
          return Response.json({
            success: false,
            error: 'Curso no apto para aprobar',
            errores: validacion.errores,
            checklist: validacion.checklist
          }, { status: 400 });
        }

        curso.estado = 'aprobado';
        curso.aprobadoEn = new Date().toISOString();
        curso.aprobadoPor = datos.aprobadoPor || 'admin';

        await kv.set(`academia:curso:${cursoId}`, curso);
        await actualizarListaCursos(cursoId, { estado: 'aprobado' });

        resultado.mensaje = 'Curso aprobado';
        resultado.advertencias = validacion.advertencias;
        break;
      }

      // ═══════════════════════════════════════════════════════════════════════
      // PROGRAMAR
      // ═══════════════════════════════════════════════════════════════════════
      case 'programar': {
        if (!datos.fechaPublicacion) {
          return Response.json({ success: false, error: 'Falta fechaPublicacion' }, { status: 400 });
        }

        const fechaPub = new Date(datos.fechaPublicacion);
        if (fechaPub < new Date()) {
          return Response.json({ success: false, error: 'La fecha debe ser futura' }, { status: 400 });
        }

        curso.estado = 'programado';
        curso.programarPara = datos.fechaPublicacion;
        curso.programadoEn = new Date().toISOString();

        await kv.set(`academia:curso:${cursoId}`, curso);
        await actualizarListaCursos(cursoId, { estado: 'programado', programarPara: datos.fechaPublicacion });

        // Agregar a cola de publicación
        const colaPub = await kv.get('academia:cola:publicacion') || [];
        colaPub.push({
          cursoId,
          fechaPublicacion: datos.fechaPublicacion,
          agregadoEn: new Date().toISOString()
        });
        await kv.set('academia:cola:publicacion', colaPub);

        resultado.mensaje = `Curso programado para ${datos.fechaPublicacion}`;
        break;
      }

      // ═══════════════════════════════════════════════════════════════════════
      // PUBLICAR
      // ═══════════════════════════════════════════════════════════════════════
      case 'publicar': {
        // Validar antes de publicar
        const validacion = academia.validaciones.validarCursoParaPublicar(curso);

        if (!validacion.valid) {
          return Response.json({
            success: false,
            error: 'Curso no apto para publicar',
            errores: validacion.errores,
            checklist: validacion.checklist
          }, { status: 400 });
        }

        curso.estado = 'publicado';
        curso.publicadoEn = new Date().toISOString();

        await kv.set(`academia:curso:${cursoId}`, curso);
        await actualizarListaCursos(cursoId, { estado: 'publicado' });

        // Agregar a cursos publicados (accesibles por usuarios)
        const publicados = await kv.get('academia:cursos:publicados') || [];
        if (!publicados.find(p => p.id === cursoId)) {
          publicados.push({
            id: cursoId,
            titulo: curso.titulo,
            mes: curso.mes,
            year: curso.year,
            imagen: curso.imagen,
            publicadoEn: curso.publicadoEn
          });
          await kv.set('academia:cursos:publicados', publicados);
        }

        resultado.mensaje = 'Curso publicado';
        resultado.url = `/circulo/cursos/${cursoId}`;
        break;
      }

      // ═══════════════════════════════════════════════════════════════════════
      // DESPUBLICAR
      // ═══════════════════════════════════════════════════════════════════════
      case 'despublicar': {
        curso.estado = 'borrador';
        curso.despublicadoEn = new Date().toISOString();

        await kv.set(`academia:curso:${cursoId}`, curso);
        await actualizarListaCursos(cursoId, { estado: 'borrador' });

        // Quitar de publicados
        const publicados = await kv.get('academia:cursos:publicados') || [];
        const nuevoPublicados = publicados.filter(p => p.id !== cursoId);
        await kv.set('academia:cursos:publicados', nuevoPublicados);

        resultado.mensaje = 'Curso despublicado';
        break;
      }

      // ═══════════════════════════════════════════════════════════════════════
      // ELIMINAR
      // ═══════════════════════════════════════════════════════════════════════
      case 'eliminar': {
        if (curso.estado === 'publicado' && !datos.forzar) {
          return Response.json({
            success: false,
            error: 'No se puede eliminar un curso publicado. Usa forzar: true para confirmar.'
          }, { status: 400 });
        }

        await kv.del(`academia:curso:${cursoId}`);

        // Quitar de todas las listas
        const lista = await kv.get('academia:cursos:lista') || [];
        await kv.set('academia:cursos:lista', lista.filter(c => c.id !== cursoId));

        const publicados = await kv.get('academia:cursos:publicados') || [];
        await kv.set('academia:cursos:publicados', publicados.filter(p => p.id !== cursoId));

        resultado.mensaje = 'Curso eliminado';
        break;
      }

      // ═══════════════════════════════════════════════════════════════════════
      // EDITAR
      // ═══════════════════════════════════════════════════════════════════════
      case 'editar': {
        const camposEditables = ['titulo', 'descripcion', 'imagen', 'eventoLunar', 'badge'];

        for (const campo of camposEditables) {
          if (datos[campo] !== undefined) {
            curso[campo] = datos[campo];
          }
        }

        // Editar módulo específico
        if (datos.moduloIndex !== undefined && datos.moduloCambios) {
          const modulo = curso.modulos[datos.moduloIndex];
          if (modulo) {
            Object.assign(modulo, datos.moduloCambios);
          }
        }

        // Editar lección específica
        if (datos.moduloIndex !== undefined && datos.leccionIndex !== undefined && datos.leccionCambios) {
          const leccion = curso.modulos[datos.moduloIndex]?.lecciones[datos.leccionIndex];
          if (leccion) {
            Object.assign(leccion, datos.leccionCambios);

            // Si se editó contenido, revalidar
            if (datos.leccionCambios.contenido) {
              const guardian = curso.modulos[datos.moduloIndex].guardian;
              const validacion = academia.validaciones.validarContenidoGenerado(
                datos.leccionCambios.contenido,
                guardian
              );
              resultado.validacionContenido = {
                score: validacion.score,
                advertencias: validacion.advertencias
              };
            }
          }
        }

        curso.editadoEn = new Date().toISOString();
        await kv.set(`academia:curso:${cursoId}`, curso);

        resultado.mensaje = 'Curso editado';
        break;
      }

      // ═══════════════════════════════════════════════════════════════════════
      // REGENERAR LECCIÓN
      // ═══════════════════════════════════════════════════════════════════════
      case 'regenerar': {
        if (datos.moduloIndex === undefined || datos.leccionIndex === undefined) {
          return Response.json({
            success: false,
            error: 'Falta moduloIndex y leccionIndex'
          }, { status: 400 });
        }

        const modulo = curso.modulos[datos.moduloIndex];
        const leccion = modulo?.lecciones[datos.leccionIndex];

        if (!modulo || !leccion) {
          return Response.json({ success: false, error: 'Módulo o lección no encontrada' }, { status: 404 });
        }

        // Regenerar contenido (llamar a la API de generación)
        const responseGen = await fetch(new URL('/api/admin/academia/generar', request.url).origin + '/api/admin/academia/generar', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            soloValidar: false,
            // ... parámetros para regenerar solo una lección
          })
        });

        // Por ahora, marcar como pendiente de regeneración
        leccion.pendienteRegeneracion = true;
        leccion.solicitadoEn = new Date().toISOString();

        await kv.set(`academia:curso:${cursoId}`, curso);

        resultado.mensaje = 'Lección marcada para regeneración';
        resultado.nota = 'La regeneración se procesará en segundo plano';
        break;
      }

      // ═══════════════════════════════════════════════════════════════════════
      // DUPLICAR
      // ═══════════════════════════════════════════════════════════════════════
      case 'duplicar': {
        const nuevoCursoId = `curso_${curso.year}_${curso.mes}_${Date.now()}`;

        const cursoDuplicado = {
          ...curso,
          id: nuevoCursoId,
          titulo: `${curso.titulo} (copia)`,
          estado: 'borrador',
          metadata: {
            ...curso.metadata,
            duplicadoDe: cursoId,
            creadoEn: new Date().toISOString()
          }
        };

        // Limpiar campos de publicación
        delete cursoDuplicado.publicadoEn;
        delete cursoDuplicado.aprobadoEn;
        delete cursoDuplicado.programarPara;

        await kv.set(`academia:curso:${nuevoCursoId}`, cursoDuplicado);

        // Agregar a lista
        const lista = await kv.get('academia:cursos:lista') || [];
        lista.push({
          id: nuevoCursoId,
          titulo: cursoDuplicado.titulo,
          mes: cursoDuplicado.mes,
          year: cursoDuplicado.year,
          estado: 'borrador',
          creadoEn: cursoDuplicado.metadata.creadoEn
        });
        await kv.set('academia:cursos:lista', lista);

        resultado.mensaje = 'Curso duplicado';
        resultado.nuevoCursoId = nuevoCursoId;
        break;
      }

      default:
        return Response.json({
          success: false,
          error: `Acción "${accion}" no reconocida`,
          accionesDisponibles: ['aprobar', 'programar', 'publicar', 'despublicar', 'eliminar', 'editar', 'regenerar', 'duplicar']
        }, { status: 400 });
    }

    return Response.json(resultado);

  } catch (error) {
    console.error('[ACADEMIA GESTIONAR]', error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// HELPER: Actualizar lista de cursos
// ═══════════════════════════════════════════════════════════════════════════════

async function actualizarListaCursos(cursoId, cambios) {
  const lista = await kv.get('academia:cursos:lista') || [];
  const index = lista.findIndex(c => c.id === cursoId);

  if (index !== -1) {
    lista[index] = { ...lista[index], ...cambios };
    await kv.set('academia:cursos:lista', lista);
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// GET: Obtener estado de un curso
// ═══════════════════════════════════════════════════════════════════════════════

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const cursoId = searchParams.get('id');

    if (!cursoId) {
      // Listar todos los cursos con su estado
      const lista = await kv.get('academia:cursos:lista') || [];
      const publicados = await kv.get('academia:cursos:publicados') || [];
      const cola = await kv.get('academia:cola:publicacion') || [];

      return Response.json({
        success: true,
        resumen: {
          total: lista.length,
          borradores: lista.filter(c => c.estado === 'borrador').length,
          aprobados: lista.filter(c => c.estado === 'aprobado').length,
          programados: lista.filter(c => c.estado === 'programado').length,
          publicados: publicados.length,
          enCola: cola.length
        },
        cursos: lista,
        colaPublicacion: cola
      });
    }

    const curso = await kv.get(`academia:curso:${cursoId}`);
    if (!curso) {
      return Response.json({ success: false, error: 'Curso no encontrado' }, { status: 404 });
    }

    // Validar estado actual
    const validacion = await academia.validarCursoCompleto(curso);

    return Response.json({
      success: true,
      curso: {
        id: curso.id,
        titulo: curso.titulo,
        estado: curso.estado,
        mes: curso.mes,
        year: curso.year,
        modulos: curso.modulos?.length || 0,
        lecciones: curso.modulos?.reduce((acc, m) => acc + (m.lecciones?.length || 0), 0) || 0,
        fechas: {
          creado: curso.metadata?.creadoEn,
          aprobado: curso.aprobadoEn,
          programado: curso.programarPara,
          publicado: curso.publicadoEn
        }
      },
      validacion: {
        aptoParaPublicar: validacion.aptoParaPublicar,
        checklist: validacion.checklist,
        errores: validacion.errores,
        advertencias: validacion.advertencias
      }
    });

  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
