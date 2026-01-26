import { kv } from '@vercel/kv';

export async function GET() {
  try {
    // Buscar todas las keys de historial
    const keys = await kv.keys('historial:*');

    const resultados = [];

    for (const key of keys.slice(0, 20)) { // Limitar a 20
      const historial = await kv.get(key);
      if (historial && Array.isArray(historial)) {
        const pendientes = historial.filter(h => h.estado === 'procesando');
        if (pendientes.length > 0) {
          resultados.push({
            email: key.replace('historial:', ''),
            pendientes: pendientes.length,
            lecturas: pendientes.map(p => ({
              id: p.id,
              nombre: p.nombre,
              fecha: p.fecha,
              fechaEntrega: p.fechaEntregaEstimada
            }))
          });
        }
      }
    }

    return Response.json({
      success: true,
      totalKeys: keys.length,
      conPendientes: resultados
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
