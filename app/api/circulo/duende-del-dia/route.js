import { kv } from '@vercel/kv';

export const dynamic = 'force-dynamic';

// ═══════════════════════════════════════════════════════════════════════════════
// DUENDE DEL DÍA
// Ahora devuelve el guardián de la SEMANA (Gaia, Noah, Winter, Marcos)
// en vez de uno random del catálogo
// ═══════════════════════════════════════════════════════════════════════════════

export async function GET(request) {
  try {
    const ahora = new Date();
    const año = ahora.getFullYear();
    const mes = ahora.getMonth() + 1;
    const dia = ahora.getDate();

    // Determinar número de semana del mes
    let semanaNum = 1;
    if (dia >= 22) semanaNum = 4;
    else if (dia >= 15) semanaNum = 3;
    else if (dia >= 8) semanaNum = 2;

    // Buscar guardián de la semana actual
    const semanaKey = `circulo:duende-semana:${año}:${mes}:${semanaNum}`;
    const semanaData = await kv.get(semanaKey);

    if (semanaData?.guardian) {
      const guardian = semanaData.guardian;
      return Response.json({
        success: true,
        guardian: {
          id: guardian.slug,
          nombre: guardian.nombre,
          nombreCompleto: guardian.nombreCompleto,
          imagen: guardian.imagen,
          categoria: guardian.categoria,
          elemento: guardian.elemento,
          color: guardian.color
        },
        tema: semanaData.tema,
        descripcion: semanaData.descripcion,
        semana: semanaNum,
        portal_actual: obtenerPortalActual()
      });
    }

    // Fallback: buscar en formato antiguo
    const guardianActual = await kv.get('duende-semana:actual');
    if (guardianActual) {
      return Response.json({
        success: true,
        guardian: {
          id: guardianActual.slug || 'guardian',
          nombre: guardianActual.nombre,
          nombreCompleto: guardianActual.nombreCompleto,
          imagen: guardianActual.imagen,
          categoria: guardianActual.categoria,
          elemento: guardianActual.elemento
        },
        portal_actual: obtenerPortalActual()
      });
    }

    // Fallback final a Marcos
    return Response.json({
      success: true,
      guardian: {
        id: 'marcos',
        nombre: 'Marcos',
        nombreCompleto: 'Marcos, Guardián de la Sabiduría',
        imagen: 'https://duendesdeluruguay.com/wp-content/uploads/2025/03/Marcos-1.jpg',
        categoria: 'Sabiduría',
        elemento: 'aire'
      },
      portal_actual: obtenerPortalActual()
    });

  } catch (error) {
    console.error('Error obteniendo duende del día:', error);
    return Response.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// UTILIDADES
// ═══════════════════════════════════════════════════════════════════════════════

function obtenerPortalActual() {
  const mes = new Date().getMonth();

  if (mes >= 5 && mes <= 7) return { id: 'yule', nombre: 'Portal de Yule', energia: 'Introspección y renacimiento' };
  if (mes >= 8 && mes <= 10) return { id: 'ostara', nombre: 'Portal de Ostara', energia: 'Nuevos comienzos' };
  if (mes === 11 || mes <= 1) return { id: 'litha', nombre: 'Portal de Litha', energia: 'Abundancia plena' };
  return { id: 'mabon', nombre: 'Portal de Mabon', energia: 'Gratitud y cosecha' };
}
