/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * CRON: GENERAR ACTIVIDAD DIARIA DE LA COMUNIDAD
 * Se ejecuta 3 veces al dia (8:00, 14:00, 20:00 hora Uruguay)
 * Genera interacciones REALES usando Claude, no frases hechas
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import { NextResponse } from 'next/server';
import { kv } from '@vercel/kv';
import {
  generarActividadDiaria,
  generarComentarioEspecifico,
  responderAUsuarioReal,
  obtenerConfiguracion,
  obtenerEstadisticasActividad
} from '@/lib/comunidad/motor-interaccion.js';
import {
  obtenerPerfilAleatorio,
  seleccionarPerfilSegunContexto
} from '@/lib/comunidad/miembros-fundadores.js';

export const dynamic = 'force-dynamic';
export const maxDuration = 300; // 5 minutos max

/**
 * GET - Ejecuta la generacion de actividad diaria
 * Se llama desde Vercel Cron
 */
export async function GET(request) {
  const startTime = Date.now();

  try {
    // ─────────────────────────────────────────────────────────────
    // VERIFICAR AUTORIZACION
    // ─────────────────────────────────────────────────────────────
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;

    // En produccion, verificar el secret
    if (process.env.NODE_ENV === 'production' && cronSecret) {
      if (authHeader !== `Bearer ${cronSecret}`) {
        console.log('[CRON-ACTIVIDAD] Intento no autorizado');
        return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
      }
    }

    // ─────────────────────────────────────────────────────────────
    // VERIFICAR CONFIGURACION
    // ─────────────────────────────────────────────────────────────
    const config = await obtenerConfiguracion();

    if (!config.activo) {
      console.log('[CRON-ACTIVIDAD] Sistema desactivado');
      return NextResponse.json({
        success: true,
        mensaje: 'Sistema de actividad automatica desactivado',
        ejecutado: false
      });
    }

    // ─────────────────────────────────────────────────────────────
    // VERIFICAR HORA PERMITIDA
    // ─────────────────────────────────────────────────────────────
    const ahora = new Date();
    const horaUruguay = new Date(ahora.toLocaleString('en-US', { timeZone: 'America/Montevideo' }));
    const hora = horaUruguay.getHours();

    // Solo ejecutar en horarios permitidos
    if (!config.horariosPermitidos.includes(hora)) {
      console.log(`[CRON-ACTIVIDAD] Fuera de horario (${hora}h), horarios: ${config.horariosPermitidos.join(', ')}`);
      return NextResponse.json({
        success: true,
        mensaje: `Fuera de horario de actividad (${hora}h)`,
        ejecutado: false,
        horariosPermitidos: config.horariosPermitidos
      });
    }

    // ─────────────────────────────────────────────────────────────
    // VERIFICAR SI YA SE EJECUTO EN ESTA FRANJA
    // ─────────────────────────────────────────────────────────────
    const franjaActual = hora < 12 ? 'manana' : hora < 18 ? 'tarde' : 'noche';
    const hoy = horaUruguay.toISOString().split('T')[0];
    const keyUltimaEjecucion = `comunidad:actividad:ultima:${hoy}:${franjaActual}`;

    const ultimaEjecucionFranja = await kv.get(keyUltimaEjecucion);

    if (ultimaEjecucionFranja) {
      console.log(`[CRON-ACTIVIDAD] Ya se ejecuto en franja ${franjaActual} hoy`);
      return NextResponse.json({
        success: true,
        mensaje: `Ya se genero actividad en franja ${franjaActual}`,
        ejecutado: false,
        ultimaEjecucion: ultimaEjecucionFranja
      });
    }

    // ─────────────────────────────────────────────────────────────
    // EJECUTAR GENERACION DE ACTIVIDAD
    // ─────────────────────────────────────────────────────────────
    console.log(`[CRON-ACTIVIDAD] Iniciando generacion para franja ${franjaActual}...`);

    // Ajustar cantidad segun franja horaria
    const multiplicadores = {
      manana: 0.3,  // Menos actividad en la manana
      tarde: 0.4,   // Actividad moderada
      noche: 0.3    // Mas actividad en la noche (usuarios conectados)
    };

    const resultado = await generarActividadDiaria(horaUruguay);

    // Marcar franja como ejecutada
    await kv.set(keyUltimaEjecucion, {
      fecha: ahora.toISOString(),
      franja: franjaActual,
      interacciones: resultado.interaccionesTotales || 0
    }, { ex: 86400 }); // Expira en 24 horas

    // ─────────────────────────────────────────────────────────────
    // REGISTRAR EJECUCION
    // ─────────────────────────────────────────────────────────────
    const duracion = Date.now() - startTime;

    await kv.set('comunidad:actividad:ultima_ejecucion', {
      fecha: ahora.toISOString(),
      franja: franjaActual,
      duracionMs: duracion,
      resultado: resultado.success ? 'exito' : 'error',
      interacciones: resultado.interaccionesTotales || 0
    });

    // Log detallado
    console.log(`[CRON-ACTIVIDAD] Completado en ${duracion}ms`);
    console.log(`[CRON-ACTIVIDAD] Posts: ${resultado.generados?.posts?.length || 0}`);
    console.log(`[CRON-ACTIVIDAD] Comentarios: ${resultado.generados?.comentarios?.length || 0}`);
    console.log(`[CRON-ACTIVIDAD] Respuestas: ${resultado.generados?.respuestasAUsuarios?.length || 0}`);

    if (resultado.errores?.length > 0) {
      console.log(`[CRON-ACTIVIDAD] Errores: ${resultado.errores.length}`);
      resultado.errores.forEach(e => console.error(`  - ${e.tipo}: ${e.error}`));
    }

    return NextResponse.json({
      success: resultado.success,
      ejecutado: true,
      franja: franjaActual,
      duracionMs: duracion,
      resumen: {
        posts: resultado.generados?.posts?.length || 0,
        comentarios: resultado.generados?.comentarios?.length || 0,
        respuestas: resultado.generados?.respuestasAUsuarios?.length || 0,
        errores: resultado.errores?.length || 0,
        total: resultado.interaccionesTotales || 0
      },
      detalles: resultado.generados,
      timestamp: ahora.toISOString()
    });

  } catch (error) {
    console.error('[CRON-ACTIVIDAD] Error general:', error);

    // Guardar error para diagnostico
    await kv.lpush('comunidad:actividad:errores', {
      fecha: new Date().toISOString(),
      error: error.message,
      stack: error.stack?.slice(0, 500)
    });
    await kv.ltrim('comunidad:actividad:errores', 0, 49);

    return NextResponse.json({
      success: false,
      error: error.message,
      duracionMs: Date.now() - startTime
    }, { status: 500 });
  }
}

/**
 * POST - Permite ejecucion manual desde el admin
 */
export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { forzar = false, prueba = false } = body;

    // Verificar autorizacion (admin)
    const authHeader = request.headers.get('authorization');

    // Si es prueba, generar solo un comentario de ejemplo
    if (prueba) {
      console.log('[CRON-ACTIVIDAD] Modo prueba: generando comentario de ejemplo');

      const perfilPrueba = obtenerPerfilAleatorio();
      const contenidoPrueba = {
        titulo: 'Post de prueba',
        contenido: 'Este es un post de prueba para verificar que el sistema genera comentarios correctamente. Hoy me senti muy conectada con mi guardian y queria compartirlo con ustedes.',
        autor: 'Usuario de prueba'
      };

      const resultado = await generarComentarioEspecifico(contenidoPrueba, perfilPrueba);

      return NextResponse.json({
        success: resultado.success,
        prueba: true,
        perfil: perfilPrueba.nombre,
        comentario: resultado.comentario,
        error: resultado.error
      });
    }

    // Ejecucion completa
    if (forzar) {
      console.log('[CRON-ACTIVIDAD] Ejecucion forzada desde admin');
    }

    return GET(request);

  } catch (error) {
    console.error('[CRON-ACTIVIDAD] Error en POST:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
