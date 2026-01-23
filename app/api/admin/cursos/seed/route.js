import { kv } from '@vercel/kv';
import { CURSO_ENERO_2026 } from '@/scripts/seed-curso-enero-2026';

// ═══════════════════════════════════════════════════════════════════════════════
// API: SEED DE CURSOS
// Permite ejecutar seeds de cursos desde el admin
// ═══════════════════════════════════════════════════════════════════════════════

export const dynamic = 'force-dynamic';

// POST - Ejecutar seed
export async function POST(request) {
  try {
    const { accion, cursoId } = await request.json();

    // SEED ENERO 2026
    if (accion === 'seed-enero-2026') {
      // Verificar si ya existe
      const existente = await kv.get(`curso:${CURSO_ENERO_2026.id}`);
      if (existente) {
        return Response.json({
          success: false,
          error: 'El curso de Enero 2026 ya existe. Usa la acción "forzar-seed-enero-2026" para sobreescribir.'
        }, { status: 400 });
      }

      await kv.set(`curso:${CURSO_ENERO_2026.id}`, CURSO_ENERO_2026);
      await kv.sadd('cursos:lista', CURSO_ENERO_2026.id);

      return Response.json({
        success: true,
        mensaje: 'Curso Enero 2026 creado exitosamente',
        curso: {
          id: CURSO_ENERO_2026.id,
          nombre: CURSO_ENERO_2026.nombre,
          modulos: CURSO_ENERO_2026.modulos.length,
          estado: CURSO_ENERO_2026.estado
        }
      });
    }

    // FORZAR SEED ENERO 2026 (sobreescribe)
    if (accion === 'forzar-seed-enero-2026') {
      await kv.set(`curso:${CURSO_ENERO_2026.id}`, CURSO_ENERO_2026);
      await kv.sadd('cursos:lista', CURSO_ENERO_2026.id);

      return Response.json({
        success: true,
        mensaje: 'Curso Enero 2026 creado/actualizado exitosamente',
        curso: {
          id: CURSO_ENERO_2026.id,
          nombre: CURSO_ENERO_2026.nombre,
          modulos: CURSO_ENERO_2026.modulos.length,
          estado: CURSO_ENERO_2026.estado
        }
      });
    }

    // ELIMINAR CURSO (para testing)
    if (accion === 'eliminar' && cursoId) {
      await kv.del(`curso:${cursoId}`);
      await kv.srem('cursos:lista', cursoId);

      return Response.json({
        success: true,
        mensaje: `Curso ${cursoId} eliminado`
      });
    }

    // LISTAR CURSOS DISPONIBLES PARA SEED
    if (accion === 'listar-seeds') {
      return Response.json({
        success: true,
        seedsDisponibles: [
          {
            id: 'seed-enero-2026',
            nombre: 'Nuevo Comienzo Mágico',
            mes: 'Enero 2026',
            modulos: 4,
            duendes: ['Próspero (Abundancia)', 'Centinela (Protección)', 'Ancestral (Sabiduría)', 'Bálsamo (Sanación)']
          }
          // Agregar más seeds aquí cuando se creen
        ]
      });
    }

    return Response.json({ success: false, error: 'Acción no válida' }, { status: 400 });

  } catch (error) {
    console.error('[CURSOS-SEED] Error:', error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}

// GET - Ver estado de seeds
export async function GET() {
  try {
    const cursosIds = await kv.smembers('cursos:lista') || [];
    const cursos = [];

    for (const id of cursosIds) {
      const curso = await kv.get(`curso:${id}`);
      if (curso) {
        cursos.push({
          id: curso.id,
          nombre: curso.nombre,
          mes: curso.mes,
          año: curso.año,
          modulos: curso.modulos?.length || 0,
          estado: curso.estado
        });
      }
    }

    return Response.json({
      success: true,
      cursosExistentes: cursos,
      seedsDisponibles: [
        {
          id: 'seed-enero-2026',
          cursoId: CURSO_ENERO_2026.id,
          existeEnDB: cursos.some(c => c.id === CURSO_ENERO_2026.id)
        }
      ]
    });

  } catch (error) {
    console.error('[CURSOS-SEED] Error GET:', error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
