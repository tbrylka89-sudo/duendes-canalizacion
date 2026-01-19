import { kv } from '@vercel/kv';

// ═══════════════════════════════════════════════════════════════════════════════
// API: GESTIÓN DE CURSOS
// CRUD completo + progreso de usuarios + badges
// ═══════════════════════════════════════════════════════════════════════════════

export const dynamic = 'force-dynamic';

// GET - Listar cursos o obtener uno específico
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const tipo = searchParams.get('tipo'); // 'admin' | 'publico'

  try {
    if (id) {
      // Obtener curso específico
      const curso = await kv.get(`curso:${id}`);
      if (!curso) {
        return Response.json({ success: false, error: 'Curso no encontrado' }, { status: 404 });
      }
      return Response.json({ success: true, curso });
    }

    // Listar todos los cursos
    const cursosIds = await kv.smembers('cursos:lista') || [];
    const cursos = [];

    for (const cursoId of cursosIds) {
      const curso = await kv.get(`curso:${cursoId}`);
      if (curso) {
        // Para listado público, no enviar todo el contenido de lecciones
        if (tipo === 'publico') {
          cursos.push({
            id: curso.id,
            titulo: curso.titulo,
            descripcion: curso.descripcion,
            duracion: curso.duracion,
            nivel: curso.nivel,
            imagen: curso.imagen,
            totalModulos: curso.modulos?.length || 0,
            totalLecciones: curso.totalLecciones || 0,
            badge: curso.badge,
            estado: curso.estado
          });
        } else {
          cursos.push(curso);
        }
      }
    }

    // Ordenar por fecha de creación (más recientes primero)
    cursos.sort((a, b) => new Date(b.creado) - new Date(a.creado));

    return Response.json({
      success: true,
      cursos,
      total: cursos.length
    });

  } catch (error) {
    console.error('[CURSOS] Error GET:', error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST - Crear o actualizar curso
export async function POST(request) {
  try {
    const { accion, curso, cursoId } = await request.json();

    // GUARDAR CURSO (nuevo o actualización)
    if (accion === 'guardar') {
      if (!curso) {
        return Response.json({ success: false, error: 'Datos del curso requeridos' }, { status: 400 });
      }

      // Si no tiene ID, es nuevo
      if (!curso.id) {
        curso.id = `curso_${Date.now()}`;
        curso.creado = new Date().toISOString();
      }
      curso.actualizado = new Date().toISOString();

      // Calcular totales
      curso.totalModulos = curso.modulos?.length || 0;
      curso.totalLecciones = curso.modulos?.reduce((acc, m) => acc + (m.lecciones?.length || 0), 0) || 0;

      // Guardar curso
      await kv.set(`curso:${curso.id}`, curso);
      // Agregar a lista de cursos
      await kv.sadd('cursos:lista', curso.id);

      return Response.json({
        success: true,
        curso,
        mensaje: curso.creado === curso.actualizado ? 'Curso creado' : 'Curso actualizado'
      });
    }

    // PUBLICAR CURSO
    if (accion === 'publicar') {
      const curso = await kv.get(`curso:${cursoId}`);
      if (!curso) {
        return Response.json({ success: false, error: 'Curso no encontrado' }, { status: 404 });
      }

      curso.estado = 'publicado';
      curso.publicado = new Date().toISOString();
      await kv.set(`curso:${cursoId}`, curso);

      return Response.json({
        success: true,
        mensaje: 'Curso publicado exitosamente'
      });
    }

    // DESPUBLICAR CURSO
    if (accion === 'despublicar') {
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

    // ELIMINAR CURSO
    if (accion === 'eliminar') {
      await kv.del(`curso:${cursoId}`);
      await kv.srem('cursos:lista', cursoId);

      return Response.json({
        success: true,
        mensaje: 'Curso eliminado'
      });
    }

    // DUPLICAR CURSO
    if (accion === 'duplicar') {
      const cursoOriginal = await kv.get(`curso:${cursoId}`);
      if (!cursoOriginal) {
        return Response.json({ success: false, error: 'Curso no encontrado' }, { status: 404 });
      }

      const nuevoCurso = {
        ...cursoOriginal,
        id: `curso_${Date.now()}`,
        titulo: `${cursoOriginal.titulo} (copia)`,
        estado: 'borrador',
        creado: new Date().toISOString(),
        actualizado: new Date().toISOString()
      };

      await kv.set(`curso:${nuevoCurso.id}`, nuevoCurso);
      await kv.sadd('cursos:lista', nuevoCurso.id);

      return Response.json({
        success: true,
        curso: nuevoCurso,
        mensaje: 'Curso duplicado'
      });
    }

    return Response.json({ success: false, error: 'Acción no válida' }, { status: 400 });

  } catch (error) {
    console.error('[CURSOS] Error POST:', error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
