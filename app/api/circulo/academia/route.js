/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * API: ACADEMIA - ENDPOINT PÚBLICO PARA USUARIOS DEL CÍRCULO
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * GET /api/circulo/academia
 *   - Lista cursos publicados
 *   - ?id=xxx → Obtiene curso específico con contenido
 *   - ?progreso=true → Incluye progreso del usuario
 */

import { kv } from '@vercel/kv';
import { cookies } from 'next/headers';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const cursoId = searchParams.get('id');
    const incluirProgreso = searchParams.get('progreso') === 'true';

    // Obtener usuario actual (si está logueado)
    let usuarioId = null;
    if (incluirProgreso) {
      const cookieStore = await cookies();
      const token = cookieStore.get('circulo_token')?.value;
      if (token) {
        const tokenData = await kv.get(`token:${token}`);
        usuarioId = typeof tokenData === 'string' ? tokenData : tokenData?.email;
      }
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // OBTENER CURSO ESPECÍFICO
    // ═══════════════════════════════════════════════════════════════════════════
    if (cursoId) {
      const curso = await kv.get(`academia:curso:${cursoId}`);

      if (!curso || curso.estado !== 'publicado') {
        return Response.json({
          success: false,
          error: 'Curso no encontrado o no disponible'
        }, { status: 404 });
      }

      // Obtener progreso del usuario si corresponde
      let progreso = null;
      if (usuarioId) {
        progreso = await kv.get(`academia:progreso:${usuarioId}:${cursoId}`) || {
          porcentaje: 0,
          leccionesCompletadas: [],
          ultimaActividad: null
        };
      }

      // Formatear respuesta (sin datos sensibles)
      const cursoPublico = {
        id: curso.id,
        titulo: curso.titulo,
        descripcion: curso.descripcion,
        imagen: curso.imagen,
        mes: curso.mes,
        year: curso.year,
        eventoLunar: curso.eventoLunar,
        badge: curso.badge,
        modulos: curso.modulos.map((m, mi) => ({
          numero: m.numero,
          titulo: m.titulo,
          semana: m.semana,
          imagen: m.imagen,
          guardian: {
            nombre: m.guardian.nombre,
            imagen: m.guardian.imagen,
            especie: m.guardian.especie
          },
          lecciones: m.lecciones.map((l, li) => ({
            numero: l.numero,
            tipo: l.tipo,
            titulo: l.titulo,
            descripcion: l.descripcion,
            // Contenido solo si el usuario tiene acceso
            contenido: l.contenido,
            completada: progreso?.leccionesCompletadas?.includes(`${mi}-${li}`) || false
          }))
        })),
        progreso
      };

      return Response.json({
        success: true,
        curso: cursoPublico
      });
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // LISTAR CURSOS PUBLICADOS
    // ═══════════════════════════════════════════════════════════════════════════
    const publicados = await kv.get('academia:cursos:publicados') || [];

    // Obtener progreso del usuario para todos los cursos
    let progresos = {};
    if (usuarioId && publicados.length > 0) {
      for (const c of publicados) {
        const prog = await kv.get(`academia:progreso:${usuarioId}:${c.id}`);
        if (prog) {
          progresos[c.id] = prog;
        }
      }
    }

    // Formatear lista
    const cursosConProgreso = publicados.map(c => ({
      ...c,
      progreso: progresos[c.id] || { porcentaje: 0 }
    }));

    return Response.json({
      success: true,
      cursos: cursosConProgreso,
      total: cursosConProgreso.length
    });

  } catch (error) {
    console.error('[ACADEMIA PÚBLICO]', error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// POST: Marcar lección como completada
// ═══════════════════════════════════════════════════════════════════════════════

export async function POST(request) {
  try {
    const body = await request.json();
    const { cursoId, moduloIndex, leccionIndex } = body;

    if (cursoId === undefined || moduloIndex === undefined || leccionIndex === undefined) {
      return Response.json({
        success: false,
        error: 'Faltan parámetros: cursoId, moduloIndex, leccionIndex'
      }, { status: 400 });
    }

    // Verificar usuario
    const cookieStore = await cookies();
    const token = cookieStore.get('circulo_token')?.value;

    if (!token) {
      return Response.json({
        success: false,
        error: 'No autenticado'
      }, { status: 401 });
    }

    const tokenData = await kv.get(`token:${token}`);
    const usuarioId = typeof tokenData === 'string' ? tokenData : tokenData?.email;

    if (!usuarioId) {
      return Response.json({
        success: false,
        error: 'Token inválido'
      }, { status: 401 });
    }

    // Verificar que el curso existe y está publicado
    const curso = await kv.get(`academia:curso:${cursoId}`);
    if (!curso || curso.estado !== 'publicado') {
      return Response.json({
        success: false,
        error: 'Curso no disponible'
      }, { status: 404 });
    }

    // Obtener o crear progreso
    const progresoKey = `academia:progreso:${usuarioId}:${cursoId}`;
    let progreso = await kv.get(progresoKey) || {
      porcentaje: 0,
      leccionesCompletadas: [],
      iniciadoEn: new Date().toISOString(),
      ultimaActividad: null
    };

    // Marcar lección como completada
    const leccionKey = `${moduloIndex}-${leccionIndex}`;
    if (!progreso.leccionesCompletadas.includes(leccionKey)) {
      progreso.leccionesCompletadas.push(leccionKey);
    }

    // Calcular porcentaje
    const totalLecciones = curso.modulos.reduce((acc, m) => acc + m.lecciones.length, 0);
    progreso.porcentaje = Math.round((progreso.leccionesCompletadas.length / totalLecciones) * 100);
    progreso.ultimaActividad = new Date().toISOString();

    // Verificar si completó el curso
    let badgeDesbloqueado = null;
    if (progreso.porcentaje >= 100 && !progreso.completadoEn) {
      progreso.completadoEn = new Date().toISOString();

      // Otorgar badge
      if (curso.badge) {
        badgeDesbloqueado = curso.badge;

        // Guardar badge del usuario
        const badgesKey = `academia:badges:${usuarioId}`;
        const badges = await kv.get(badgesKey) || [];
        if (!badges.find(b => b.cursoId === cursoId)) {
          badges.push({
            ...curso.badge,
            cursoId,
            cursoTitulo: curso.titulo,
            obtenidoEn: progreso.completadoEn
          });
          await kv.set(badgesKey, badges);
        }
      }
    }

    await kv.set(progresoKey, progreso);

    return Response.json({
      success: true,
      progreso,
      badgeDesbloqueado,
      mensaje: progreso.porcentaje >= 100
        ? '¡Felicitaciones! Completaste el curso'
        : `Progreso: ${progreso.porcentaje}%`
    });

  } catch (error) {
    console.error('[ACADEMIA PROGRESO]', error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
