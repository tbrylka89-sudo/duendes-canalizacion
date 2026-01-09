import { kv } from '@vercel/kv';

export async function GET() {
  try {
    const userKeys = await kv.keys('user:*');
    let miembrosCirculo = 0;
    const topClientes = [];
    
    for (const k of userKeys) {
      const user = await kv.get(k);
      if (user) {
        if (user.esCirculo) miembrosCirculo++;
        if (user.gastado > 0) topClientes.push({ nombre: user.nombre || user.email, gastado: user.gastado });
      }
    }
    
    topClientes.sort((a, b) => b.gastado - a.gastado);

    return Response.json({
      success: true,
      ingresosMes: 0,
      ventasMes: 0,
      miembrosCirculo,
      clientesTotal: userKeys.length,
      topClientes: topClientes.slice(0, 10),
      lecturasPendientes: 0,
      circulosPorVencer: 0,
      actividad: []
    });
  } catch (error) {
    return Response.json({ success: false, ingresosMes: 0, ventasMes: 0, miembrosCirculo: 0, clientesTotal: 0, topClientes: [] });
  }
}
