import { kv } from '@vercel/kv';

// ═══════════════════════════════════════════════════════════════════════════════
// API: HISTORIAL DE CONTENIDO GENERADO
// Obtiene todo el contenido generado para el Círculo
// ═══════════════════════════════════════════════════════════════════════════════

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Obtener todas las claves de contenido
    // Las claves tienen formato: circulo:contenido:año:mes:dia
    const keys = await kv.keys('circulo:contenido:*');

    const contenidos = [];

    // Obtener contenido de cada clave
    for (const key of keys) {
      try {
        const contenido = await kv.get(key);
        if (contenido) {
          // Extraer fecha de la clave si no está en el contenido
          const partes = key.split(':');
          const fechaKey = {
            año: parseInt(partes[2]),
            mes: parseInt(partes[3]),
            dia: parseInt(partes[4])
          };

          contenidos.push({
            ...contenido,
            fecha: contenido.fecha || fechaKey,
            key
          });
        }
      } catch (err) {
        console.error(`Error leyendo ${key}:`, err);
      }
    }

    // Ordenar por fecha (más reciente primero)
    contenidos.sort((a, b) => {
      const fechaA = new Date(a.fecha?.año || 2024, (a.fecha?.mes || 1) - 1, a.fecha?.dia || 1);
      const fechaB = new Date(b.fecha?.año || 2024, (b.fecha?.mes || 1) - 1, b.fecha?.dia || 1);
      return fechaB - fechaA;
    });

    return Response.json({
      success: true,
      contenidos,
      total: contenidos.length
    });

  } catch (error) {
    console.error('[HISTORIAL] Error:', error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
