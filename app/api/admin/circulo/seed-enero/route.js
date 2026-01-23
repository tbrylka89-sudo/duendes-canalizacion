// ═══════════════════════════════════════════════════════════════════════════════
// API: Seed contenido de Enero 2026 a Vercel KV
// POST /api/admin/circulo/seed-enero
// ═══════════════════════════════════════════════════════════════════════════════

import { kv } from '@vercel/kv';
import { CONTENIDO_ENERO_2026 } from '@/scripts/generar-contenido-enero-2026';
import { GUARDIANES_MAESTROS, ROTACION_ENERO_2026 } from '@/lib/circulo/duendes-semanales-2026';

export async function POST(request) {
  try {
    const resultados = {
      contenidoDiario: [],
      contenidoCompatibilidad: [],
      duendesSemanales: [],
      guardianesMaestros: false,
      errores: []
    };

    // ═══════════════════════════════════════════════════════════════════════════
    // 1. Guardar cada dia de contenido con key: circulo:contenido:2026:1:DIA
    // ═══════════════════════════════════════════════════════════════════════════
    for (const contenido of CONTENIDO_ENERO_2026) {
      const keyDia = `circulo:contenido:2026:1:${contenido.dia}`;
      try {
        await kv.set(keyDia, contenido);
        resultados.contenidoDiario.push({
          dia: contenido.dia,
          key: keyDia,
          titulo: contenido.titulo,
          duende: contenido.duendeNombre
        });
      } catch (error) {
        resultados.errores.push({
          tipo: 'contenidoDiario',
          key: keyDia,
          error: error.message
        });
      }
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // 2. Guardar con key de compatibilidad: contenido:2026-01-DD
    // ═══════════════════════════════════════════════════════════════════════════
    for (const contenido of CONTENIDO_ENERO_2026) {
      const diaFormateado = String(contenido.dia).padStart(2, '0');
      const keyCompat = `contenido:2026-01-${diaFormateado}`;
      try {
        await kv.set(keyCompat, contenido);
        resultados.contenidoCompatibilidad.push({
          fecha: contenido.fecha,
          key: keyCompat
        });
      } catch (error) {
        resultados.errores.push({
          tipo: 'contenidoCompatibilidad',
          key: keyCompat,
          error: error.message
        });
      }
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // 3. Guardar duende de cada semana: circulo:duende-semana:2026:1:SEMANA
    // ═══════════════════════════════════════════════════════════════════════════
    const semanas = Object.entries(ROTACION_ENERO_2026);
    for (const [semanaKey, semanaData] of semanas) {
      const numeroSemana = semanaKey.replace('semana', '');
      const keyDuendeSemana = `circulo:duende-semana:2026:1:${numeroSemana}`;
      const guardian = GUARDIANES_MAESTROS[semanaData.guardian];

      const datosSemana = {
        ...semanaData,
        guardian: guardian,
        numeroSemana: parseInt(numeroSemana)
      };

      try {
        await kv.set(keyDuendeSemana, datosSemana);
        resultados.duendesSemanales.push({
          semana: numeroSemana,
          key: keyDuendeSemana,
          guardian: guardian.nombre,
          tema: semanaData.tema,
          periodo: `${semanaData.inicio} a ${semanaData.fin}`
        });
      } catch (error) {
        resultados.errores.push({
          tipo: 'duendeSemanal',
          key: keyDuendeSemana,
          error: error.message
        });
      }
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // 4. Guardar configuracion de guardianes maestros
    // ═══════════════════════════════════════════════════════════════════════════
    try {
      await kv.set('circulo:guardianes-maestros', GUARDIANES_MAESTROS);
      resultados.guardianesMaestros = true;
    } catch (error) {
      resultados.errores.push({
        tipo: 'guardianesMaestros',
        key: 'circulo:guardianes-maestros',
        error: error.message
      });
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // 5. Generar resumen
    // ═══════════════════════════════════════════════════════════════════════════
    const resumen = {
      success: resultados.errores.length === 0,
      timestamp: new Date().toISOString(),
      estadisticas: {
        diasGuardados: resultados.contenidoDiario.length,
        keysCompatibilidad: resultados.contenidoCompatibilidad.length,
        semanasGuardadas: resultados.duendesSemanales.length,
        guardianesMaestros: resultados.guardianesMaestros,
        errores: resultados.errores.length
      },
      detalle: {
        contenidoDiario: resultados.contenidoDiario,
        duendesSemanales: resultados.duendesSemanales,
        guardianes: Object.keys(GUARDIANES_MAESTROS)
      },
      errores: resultados.errores.length > 0 ? resultados.errores : undefined
    };

    return Response.json(resumen, {
      status: resumen.success ? 200 : 207
    });

  } catch (error) {
    console.error('Error en seed-enero:', error);
    return Response.json({
      success: false,
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 });
  }
}

// GET para verificar el estado actual
export async function GET(request) {
  try {
    const estado = {
      contenidoEnKV: [],
      semanasEnKV: [],
      guardianesMaestros: null
    };

    // Verificar dias guardados
    for (let dia = 1; dia <= 31; dia++) {
      const key = `circulo:contenido:2026:1:${dia}`;
      const existe = await kv.exists(key);
      if (existe) {
        const contenido = await kv.get(key);
        estado.contenidoEnKV.push({
          dia,
          key,
          titulo: contenido?.titulo,
          duende: contenido?.duendeNombre
        });
      }
    }

    // Verificar semanas guardadas
    for (let semana = 1; semana <= 5; semana++) {
      const key = `circulo:duende-semana:2026:1:${semana}`;
      const existe = await kv.exists(key);
      if (existe) {
        const datos = await kv.get(key);
        estado.semanasEnKV.push({
          semana,
          key,
          guardian: datos?.guardian?.nombre,
          tema: datos?.tema
        });
      }
    }

    // Verificar guardianes maestros
    const guardianes = await kv.get('circulo:guardianes-maestros');
    if (guardianes) {
      estado.guardianesMaestros = Object.keys(guardianes);
    }

    return Response.json({
      success: true,
      timestamp: new Date().toISOString(),
      estado,
      resumen: {
        diasEnKV: estado.contenidoEnKV.length,
        semanasEnKV: estado.semanasEnKV.length,
        tieneGuardianes: estado.guardianesMaestros !== null
      }
    });

  } catch (error) {
    console.error('Error verificando estado:', error);
    return Response.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
