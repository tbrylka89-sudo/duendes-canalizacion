import { kv } from '@vercel/kv';
import { CONTENIDO_ENERO_2026, GUARDIANES_ENERO_2026 } from '@/lib/contenido/enero-2026';

export const dynamic = 'force-dynamic';

// ═══════════════════════════════════════════════════════════════════════════════
// API: SEED DE CONTENIDO DEL CÍRCULO
// Permite insertar contenido de enero 2026 en KV
// ═══════════════════════════════════════════════════════════════════════════════

export async function POST(request) {
  try {
    const { accion } = await request.json();

    // SEED CONTENIDO ENERO 2026
    if (accion === 'seed-enero-2026' || accion === 'forzar-seed-enero-2026') {
      const resultados = {
        contenidos: { exitos: 0, errores: 0 },
        guardianes: { exitos: 0, errores: 0 },
        metadata: false
      };

      // Insertar cada contenido
      for (const contenido of CONTENIDO_ENERO_2026) {
        try {
          const key = `contenido:${contenido.fecha}`;
          const dataParaKV = {
            ...contenido,
            fechaCreacion: new Date().toISOString(),
            estado: 'publicado',
            portal: 'litha',
            mes: 'enero',
            anio: 2026
          };
          await kv.set(key, dataParaKV);
          resultados.contenidos.exitos++;
        } catch (e) {
          resultados.contenidos.errores++;
          console.error(`Error insertando ${contenido.fecha}:`, e);
        }
      }

      // Insertar guardianes
      try {
        await kv.set('guardianes:enero-2026', {
          mes: 'enero',
          anio: 2026,
          portal: 'litha',
          guardianes: GUARDIANES_ENERO_2026,
          fechaCreacion: new Date().toISOString()
        });
        resultados.guardianes.exitos++;

        // Insertar cada guardián individualmente
        for (const [semana, guardian] of Object.entries(GUARDIANES_ENERO_2026)) {
          try {
            const guardianKey = `guardian:${guardian.id}`;
            await kv.set(guardianKey, {
              ...guardian,
              semana: parseInt(semana.replace('semana', '')),
              mes: 'enero',
              anio: 2026,
              fechaCreacion: new Date().toISOString()
            });
            resultados.guardianes.exitos++;
          } catch (e) {
            resultados.guardianes.errores++;
          }
        }
      } catch (e) {
        resultados.guardianes.errores++;
        console.error('Error insertando guardianes:', e);
      }

      // Insertar metadata
      try {
        await kv.set('contenido:enero-2026:meta', {
          mes: 'enero',
          anio: 2026,
          portal: 'litha',
          tema: 'Verano, fuego, abundancia',
          totalContenidos: CONTENIDO_ENERO_2026.length,
          fechas: CONTENIDO_ENERO_2026.map(c => c.fecha),
          fechaCreacion: new Date().toISOString()
        });

        // Actualizar índice general
        const existingIndex = await kv.get('circulo:contenido:index') || [];
        const nuevasFechas = CONTENIDO_ENERO_2026.map(c => c.fecha);
        const indexActualizado = [...new Set([...existingIndex, ...nuevasFechas])].sort();
        await kv.set('circulo:contenido:index', indexActualizado);

        resultados.metadata = true;
      } catch (e) {
        console.error('Error insertando metadata:', e);
      }

      return Response.json({
        success: true,
        mensaje: 'Contenido de Enero 2026 insertado',
        resultados,
        totalContenidos: CONTENIDO_ENERO_2026.length,
        guardianes: Object.keys(GUARDIANES_ENERO_2026)
      });
    }

    // VERIFICAR ESTADO
    if (accion === 'verificar') {
      const verificacion = {
        contenidos: [],
        guardianes: null,
        metadata: null
      };

      // Verificar algunos contenidos
      const fechasVerificar = ['2026-01-01', '2026-01-12', '2026-01-26'];
      for (const fecha of fechasVerificar) {
        const contenido = await kv.get(`contenido:${fecha}`);
        verificacion.contenidos.push({
          fecha,
          existe: !!contenido,
          titulo: contenido?.titulo?.substring(0, 40)
        });
      }

      // Verificar guardianes
      verificacion.guardianes = await kv.get('guardianes:enero-2026');
      verificacion.metadata = await kv.get('contenido:enero-2026:meta');

      return Response.json({
        success: true,
        verificacion
      });
    }

    // LISTAR FECHAS DISPONIBLES
    if (accion === 'listar') {
      return Response.json({
        success: true,
        contenidosDisponibles: CONTENIDO_ENERO_2026.map(c => ({
          fecha: c.fecha,
          tipo: c.tipo,
          titulo: c.titulo,
          duende: c.duendeNombre
        })),
        guardianes: Object.entries(GUARDIANES_ENERO_2026).map(([sem, g]) => ({
          semana: sem,
          nombre: g.nombre,
          categoria: g.categoria
        }))
      });
    }

    return Response.json({
      success: false,
      error: 'Acción no válida. Usar: seed-enero-2026, verificar, listar'
    }, { status: 400 });

  } catch (error) {
    console.error('[CONTENIDO-SEED] Error:', error);
    return Response.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}

export async function GET() {
  try {
    const meta = await kv.get('contenido:enero-2026:meta');
    const index = await kv.get('circulo:contenido:index');

    return Response.json({
      success: true,
      enero2026: {
        insertado: !!meta,
        meta: meta ? {
          totalContenidos: meta.totalContenidos,
          fechas: meta.fechas?.length || 0
        } : null
      },
      indexGeneral: {
        totalFechas: index?.length || 0
      },
      seedsDisponibles: ['seed-enero-2026']
    });

  } catch (error) {
    console.error('[CONTENIDO-SEED] Error GET:', error);
    return Response.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
