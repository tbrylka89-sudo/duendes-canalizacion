import { kv } from '@vercel/kv';

// ═══════════════════════════════════════════════════════════════════════════════
// API: Reset completo del cache del Círculo
// Limpia TODA la data cacheada para forzar regeneración limpia
// ═══════════════════════════════════════════════════════════════════════════════

export async function POST(request) {
  try {
    const { email, limpiezaTotal } = await request.json();

    const borrados = [];
    const errores = [];
    const ahora = new Date();
    const hoy = ahora.toISOString().split('T')[0];
    const año = ahora.getFullYear();
    const mes = ahora.getMonth() + 1;
    const semanaDelAño = Math.ceil((ahora.getDate() + new Date(año, 0, 1).getDay()) / 7);

    // Función helper para borrar silenciosamente
    async function borrarKey(key) {
      try {
        await kv.del(key);
        borrados.push(key);
      } catch (e) {
        errores.push({ key, error: e.message });
      }
    }

    // Si se especifica email, limpiar datos de ese usuario
    if (email) {
      const emailNorm = email.toLowerCase().trim();

      // Datos específicos del usuario
      await borrarKey(`bienvenida:${emailNorm}`);
      await borrarKey(`circulo:historial:${emailNorm}`);
      await borrarKey(`circulo:ultimo-mensaje:${emailNorm}:${hoy}`);
      await borrarKey(`visitas:${emailNorm}:${hoy}`);
      await borrarKey(`circulo:visitas-dia:${emailNorm}:${hoy}`);
    }

    // Si se pide limpieza total, limpiar TODO el cache del sistema
    if (limpiezaTotal) {
      // Cache de guardianes de la semana (formato viejo y nuevo)
      await borrarKey('duende-semana:actual');
      await borrarKey('duende-semana-actual');

      // Limpiar TODAS las semanas del año (el consejo-del-dia usa este formato)
      for (let w = 1; w <= 52; w++) {
        await borrarKey(`circulo:guardian-semana:${año}-W${w}`);
      }

      // También el formato antiguo por si acaso
      await borrarKey(`circulo:guardian-semana:${año}-W${semanaDelAño}`);
      await borrarKey(`circulo:guardian-semana:${año}-W${semanaDelAño - 1}`);

      // Cache de duende del día
      await borrarKey(`circulo:duende-dia:${hoy}`);
      await borrarKey(`duende-dia:${hoy}`);

      // Cache de consejos globales (si existen)
      await borrarKey(`consejo:${hoy}`);

      // Limpiar rotaciones semanales del mes actual (4 semanas)
      for (let sem = 1; sem <= 4; sem++) {
        // NO borrar las rotaciones reales (circulo:duende-semana:*) porque tienen datos buenos
        // Solo borrar los caches de consejos viejos
        await borrarKey(`guardian-consejo:${año}:${mes}:${sem}`);
      }

      // Limpiar cualquier cache de formato viejo de guardianes inventados
      const guardianesViejos = ['dorado', 'obsidiana', 'indigo', 'jade', 'izara', 'rahmus', 'vero', 'naia', 'finnian'];
      for (const g of guardianesViejos) {
        await borrarKey(`guardian:${g}`);
        await borrarKey(`circulo:guardian:${g}`);
      }
    }

    return Response.json({
      success: true,
      mensaje: limpiezaTotal
        ? 'Limpieza total del cache del Círculo completada. El sistema regenerará datos frescos.'
        : email
          ? `Cache de ${email} limpiado. Volvé a entrar al Círculo para datos frescos.`
          : 'No se especificó qué limpiar.',
      borrados,
      errores: errores.length > 0 ? errores : undefined,
      totalBorrados: borrados.length,
      totalErrores: errores.length
    });

  } catch (error) {
    console.error('[RESET-CIRCULO] Error:', error);
    return Response.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}

// GET: Ver qué keys existen (para debugging)
export async function GET() {
  try {
    const ahora = new Date();
    const hoy = ahora.toISOString().split('T')[0];
    const año = ahora.getFullYear();
    const mes = ahora.getMonth() + 1;

    // Determinar semana del mes
    const dia = ahora.getDate();
    let semanaNum = 1;
    if (dia >= 22) semanaNum = 4;
    else if (dia >= 15) semanaNum = 3;
    else if (dia >= 8) semanaNum = 2;

    // Verificar keys importantes
    const keysParaVerificar = [
      `circulo:duende-semana:${año}:${mes}:${semanaNum}`,
      'duende-semana:actual',
      `circulo:duende-dia:${hoy}`,
      `circulo:guardian-semana:${año}-W${Math.ceil((dia + new Date(año, 0, 1).getDay()) / 7)}`
    ];

    const resultados = {};
    for (const key of keysParaVerificar) {
      const valor = await kv.get(key);
      resultados[key] = valor ? {
        existe: true,
        guardianNombre: valor.guardian?.nombre || valor.nombre || 'N/A',
        estructura: Object.keys(valor).join(', ')
      } : { existe: false };
    }

    return Response.json({
      success: true,
      fecha: hoy,
      semana: semanaNum,
      keys: resultados
    });

  } catch (error) {
    return Response.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
