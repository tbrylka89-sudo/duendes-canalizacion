/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * ADMIN: ACTIVIDAD AUTOMATICA DE LA COMUNIDAD
 * Configuracion y monitoreo del sistema de interacciones automaticas
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import { NextResponse } from 'next/server';
import { kv } from '@vercel/kv';
import {
  obtenerConfiguracion,
  guardarConfiguracion,
  obtenerEstadisticasActividad,
  generarComentarioEspecifico,
  generarConversacionForo,
  generarActividadDiaria
} from '@/lib/comunidad/motor-interaccion.js';
import {
  MIEMBROS_FUNDADORES,
  obtenerPerfilAleatorio,
  obtenerPerfilPorId
} from '@/lib/comunidad/miembros-fundadores.js';

/**
 * GET - Obtener estado, configuracion y estadisticas
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const accion = searchParams.get('accion') || 'estado';

    switch (accion) {
      // ─────────────────────────────────────────────────────────────
      // ESTADO GENERAL
      // ─────────────────────────────────────────────────────────────
      case 'estado': {
        const estadisticas = await obtenerEstadisticasActividad();
        const ultimaEjecucion = await kv.get('comunidad:actividad:ultima_ejecucion');
        const erroresRecientes = await kv.lrange('comunidad:actividad:errores', 0, 4);

        return NextResponse.json({
          success: true,
          estado: {
            activo: estadisticas.config.activo,
            config: estadisticas.config,
            ultimaEjecucion,
            estadisticas: estadisticas.estadisticas,
            erroresRecientes
          }
        });
      }

      // ─────────────────────────────────────────────────────────────
      // HISTORIAL DE ACTIVIDAD
      // ─────────────────────────────────────────────────────────────
      case 'historial': {
        const dias = parseInt(searchParams.get('dias') || '30');
        const historial = await kv.lrange('comunidad:actividad:historial', 0, dias - 1);

        // Calcular totales
        const totales = historial.reduce((acc, h) => ({
          interacciones: acc.interacciones + (h?.interacciones || 0),
          posts: acc.posts + (h?.posts || 0),
          comentarios: acc.comentarios + (h?.comentarios || 0),
          respuestas: acc.respuestas + (h?.respuestas || 0),
          errores: acc.errores + (h?.errores || 0)
        }), { interacciones: 0, posts: 0, comentarios: 0, respuestas: 0, errores: 0 });

        return NextResponse.json({
          success: true,
          historial,
          totales,
          promedioDiario: {
            interacciones: Math.round(totales.interacciones / (historial.length || 1)),
            posts: Math.round(totales.posts / (historial.length || 1) * 10) / 10,
            comentarios: Math.round(totales.comentarios / (historial.length || 1) * 10) / 10
          }
        });
      }

      // ─────────────────────────────────────────────────────────────
      // REGISTRO DE UN DIA ESPECIFICO
      // ─────────────────────────────────────────────────────────────
      case 'registro': {
        const fecha = searchParams.get('fecha') || new Date().toISOString().split('T')[0];
        const registro = await kv.get(`comunidad:actividad:registro:${fecha}`);

        return NextResponse.json({
          success: true,
          fecha,
          registro: registro || null
        });
      }

      // ─────────────────────────────────────────────────────────────
      // LISTAR PERFILES DISPONIBLES
      // ─────────────────────────────────────────────────────────────
      case 'perfiles': {
        const perfiles = MIEMBROS_FUNDADORES.map(p => ({
          id: p.id,
          nombre: p.nombre,
          nombreCorto: p.nombreCorto,
          avatar: p.avatar,
          personalidad: p.personalidad,
          edad: p.edad,
          ubicacion: p.ubicacion,
          tiempoMiembro: p.tiempoMiembro,
          guardianes: p.guardianes.map(g => g.nombre),
          estiloExtension: p.estiloEscritura.extension,
          usaEmojis: p.estiloEscritura.usaEmojis
        }));

        return NextResponse.json({
          success: true,
          totalPerfiles: perfiles.length,
          perfiles
        });
      }

      // ─────────────────────────────────────────────────────────────
      // ERRORES RECIENTES
      // ─────────────────────────────────────────────────────────────
      case 'errores': {
        const errores = await kv.lrange('comunidad:actividad:errores', 0, 49);

        return NextResponse.json({
          success: true,
          totalErrores: errores.length,
          errores
        });
      }

      default:
        return NextResponse.json({
          success: false,
          error: 'Accion no valida'
        }, { status: 400 });
    }

  } catch (error) {
    console.error('[ADMIN-ACTIVIDAD] Error GET:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}

/**
 * POST - Configurar y ejecutar acciones
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const { accion } = body;

    switch (accion) {
      // ─────────────────────────────────────────────────────────────
      // ACTIVAR/DESACTIVAR SISTEMA
      // ─────────────────────────────────────────────────────────────
      case 'toggle': {
        const config = await obtenerConfiguracion();
        const nuevoEstado = !config.activo;

        await guardarConfiguracion({ activo: nuevoEstado });

        console.log(`[ADMIN-ACTIVIDAD] Sistema ${nuevoEstado ? 'ACTIVADO' : 'DESACTIVADO'}`);

        return NextResponse.json({
          success: true,
          activo: nuevoEstado,
          mensaje: `Sistema de actividad automatica ${nuevoEstado ? 'activado' : 'desactivado'}`
        });
      }

      // ─────────────────────────────────────────────────────────────
      // ACTUALIZAR CONFIGURACION
      // ─────────────────────────────────────────────────────────────
      case 'configurar': {
        const { config } = body;

        // Validar configuracion
        const configValida = {};

        if (typeof config.activo === 'boolean') {
          configValida.activo = config.activo;
        }

        if (config.minInteraccionesDia !== undefined) {
          const min = parseInt(config.minInteraccionesDia);
          if (min >= 0 && min <= 50) configValida.minInteraccionesDia = min;
        }

        if (config.maxInteraccionesDia !== undefined) {
          const max = parseInt(config.maxInteraccionesDia);
          if (max >= 1 && max <= 100) configValida.maxInteraccionesDia = max;
        }

        if (config.minInteraccionesFinDeSemana !== undefined) {
          const min = parseInt(config.minInteraccionesFinDeSemana);
          if (min >= 0 && min <= 50) configValida.minInteraccionesFinDeSemana = min;
        }

        if (config.maxInteraccionesFinDeSemana !== undefined) {
          const max = parseInt(config.maxInteraccionesFinDeSemana);
          if (max >= 1 && max <= 100) configValida.maxInteraccionesFinDeSemana = max;
        }

        if (config.probabilidadRespuestaUsuarioReal !== undefined) {
          const prob = parseFloat(config.probabilidadRespuestaUsuarioReal);
          if (prob >= 0 && prob <= 1) configValida.probabilidadRespuestaUsuarioReal = prob;
        }

        if (config.maxComentariosPorPost !== undefined) {
          const max = parseInt(config.maxComentariosPorPost);
          if (max >= 1 && max <= 10) configValida.maxComentariosPorPost = max;
        }

        if (Array.isArray(config.horariosPermitidos)) {
          const horas = config.horariosPermitidos.filter(h => h >= 0 && h <= 23);
          if (horas.length > 0) configValida.horariosPermitidos = horas;
        }

        if (typeof config.generarConversaciones === 'boolean') {
          configValida.generarConversaciones = config.generarConversaciones;
        }

        const nuevaConfig = await guardarConfiguracion(configValida);

        console.log('[ADMIN-ACTIVIDAD] Configuracion actualizada:', configValida);

        return NextResponse.json({
          success: true,
          config: nuevaConfig,
          mensaje: 'Configuracion actualizada'
        });
      }

      // ─────────────────────────────────────────────────────────────
      // GENERAR COMENTARIO DE PRUEBA
      // ─────────────────────────────────────────────────────────────
      case 'probar-comentario': {
        const { contenido, perfilId } = body;

        if (!contenido) {
          return NextResponse.json({
            success: false,
            error: 'Se requiere contenido para generar el comentario'
          }, { status: 400 });
        }

        const perfil = perfilId
          ? obtenerPerfilPorId(perfilId)
          : obtenerPerfilAleatorio();

        if (!perfil) {
          return NextResponse.json({
            success: false,
            error: 'Perfil no encontrado'
          }, { status: 400 });
        }

        console.log(`[ADMIN-ACTIVIDAD] Generando comentario de prueba con perfil: ${perfil.nombre}`);

        const resultado = await generarComentarioEspecifico(
          { contenido, autor: 'Prueba' },
          perfil
        );

        return NextResponse.json({
          success: resultado.success,
          perfil: {
            id: perfil.id,
            nombre: perfil.nombre,
            personalidad: perfil.personalidad,
            extension: perfil.estiloEscritura.extension
          },
          comentario: resultado.comentario,
          error: resultado.error
        });
      }

      // ─────────────────────────────────────────────────────────────
      // GENERAR CONVERSACION DE PRUEBA
      // ─────────────────────────────────────────────────────────────
      case 'probar-conversacion': {
        const { tema, categoria = 'general', cantidadRespuestas = 3 } = body;

        if (!tema) {
          return NextResponse.json({
            success: false,
            error: 'Se requiere tema para generar la conversacion'
          }, { status: 400 });
        }

        console.log(`[ADMIN-ACTIVIDAD] Generando conversacion de prueba: ${tema}`);

        const resultado = await generarConversacionForo(tema, {
          categoria,
          cantidadRespuestas: Math.min(cantidadRespuestas, 5)
        });

        return NextResponse.json({
          success: resultado.success,
          post: resultado.post,
          respuestas: resultado.respuestas,
          error: resultado.error
        });
      }

      // ─────────────────────────────────────────────────────────────
      // EJECUTAR ACTIVIDAD MANUALMENTE
      // ─────────────────────────────────────────────────────────────
      case 'ejecutar': {
        console.log('[ADMIN-ACTIVIDAD] Ejecutando actividad manual...');

        const resultado = await generarActividadDiaria(new Date());

        return NextResponse.json({
          success: resultado.success,
          mensaje: resultado.success
            ? `Se generaron ${resultado.interaccionesTotales} interacciones`
            : 'Error en la generacion',
          resultado
        });
      }

      // ─────────────────────────────────────────────────────────────
      // LIMPIAR ERRORES
      // ─────────────────────────────────────────────────────────────
      case 'limpiar-errores': {
        await kv.del('comunidad:actividad:errores');

        return NextResponse.json({
          success: true,
          mensaje: 'Errores limpiados'
        });
      }

      // ─────────────────────────────────────────────────────────────
      // RESETEAR CONFIGURACION
      // ─────────────────────────────────────────────────────────────
      case 'resetear': {
        await kv.del('comunidad:actividad:config');
        const config = await obtenerConfiguracion();

        return NextResponse.json({
          success: true,
          mensaje: 'Configuracion reseteada a valores por defecto',
          config
        });
      }

      default:
        return NextResponse.json({
          success: false,
          error: 'Accion no valida'
        }, { status: 400 });
    }

  } catch (error) {
    console.error('[ADMIN-ACTIVIDAD] Error POST:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}

/**
 * DELETE - Eliminar datos especificos
 */
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const tipo = searchParams.get('tipo');

    switch (tipo) {
      case 'historial': {
        await kv.del('comunidad:actividad:historial');
        return NextResponse.json({
          success: true,
          mensaje: 'Historial eliminado'
        });
      }

      case 'errores': {
        await kv.del('comunidad:actividad:errores');
        return NextResponse.json({
          success: true,
          mensaje: 'Errores eliminados'
        });
      }

      case 'todo': {
        // Obtener y eliminar todas las keys relacionadas
        const keys = await kv.keys('comunidad:actividad:*');
        for (const key of keys) {
          await kv.del(key);
        }
        return NextResponse.json({
          success: true,
          mensaje: `Se eliminaron ${keys.length} registros`,
          keysEliminadas: keys
        });
      }

      default:
        return NextResponse.json({
          success: false,
          error: 'Tipo de eliminacion no valido'
        }, { status: 400 });
    }

  } catch (error) {
    console.error('[ADMIN-ACTIVIDAD] Error DELETE:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
