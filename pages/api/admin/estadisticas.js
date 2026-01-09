// /pages/api/admin/estadisticas.js
import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const adminKey = req.headers['x-admin-key'];
  if (adminKey !== process.env.ADMIN_SECRET) {
    return res.status(401).json({ error: 'No autorizado' });
  }

  try {
    // Obtener todas las membresías
    const keysMem = await kv.keys('membresia:*');
    let miembrosActivos = 0;
    let porVencer = 0;
    const ahora = new Date();
    
    for (const key of keysMem) {
      const mem = await kv.get(key);
      if (mem?.fechaVencimiento) {
        const venc = new Date(mem.fechaVencimiento);
        const dias = Math.ceil((venc - ahora) / (1000 * 60 * 60 * 24));
        if (dias > 0) {
          miembrosActivos++;
          if (dias <= 7) porVencer++;
        }
      }
    }

    // Obtener todos los usuarios
    const keysElegidos = await kv.keys('elegido:*');
    let nuevosClientes = 0;
    let totalGastado = 0;
    const inicioMes = new Date(ahora.getFullYear(), ahora.getMonth(), 1);
    
    const guardianesCont = {};
    const categoriaCont = {};
    
    for (const key of keysElegidos) {
      const user = await kv.get(key);
      if (user) {
        // Contar nuevos del mes
        if (user.fechaCreacion && new Date(user.fechaCreacion) >= inicioMes) {
          nuevosClientes++;
        }
        
        // Sumar gastos
        totalGastado += user.totalGastado || 0;
        
        // Contar guardianes
        if (user.guardianes) {
          for (const g of user.guardianes) {
            guardianesCont[g.nombre] = (guardianesCont[g.nombre] || 0) + 1;
            if (g.categoria) {
              categoriaCont[g.categoria] = (categoriaCont[g.categoria] || 0) + (g.precio || 0);
            }
          }
        }
      }
    }

    // Top guardianes
    const topGuardianes = Object.entries(guardianesCont)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([nombre, vendidos]) => ({ nombre, vendidos }));

    // Por categoría
    const porCategoria = Object.entries(categoriaCont)
      .sort((a, b) => b[1] - a[1])
      .map(([categoria, ingresos]) => ({ categoria, ingresos: Math.round(ingresos) }));

    // Obtener logs de ventas del mes
    const logs = await kv.lrange('admin:logs', 0, 100) || [];
    let ventasMes = 0;
    let ingresosMes = 0;
    
    for (const logStr of logs) {
      try {
        const log = typeof logStr === 'string' ? JSON.parse(logStr) : logStr;
        if (log.tipo === 'venta' && new Date(log.fecha) >= inicioMes) {
          ventasMes++;
          ingresosMes += log.monto || 0;
        }
      } catch (e) {}
    }

    return res.status(200).json({
      miembrosActivos,
      porVencer,
      nuevosClientes,
      totalUsuarios: keysElegidos.length,
      ventasMes,
      ingresosMes: Math.round(ingresosMes),
      topGuardianes,
      porCategoria
    });
  } catch (error) {
    console.error('[STATS] Error:', error);
    return res.status(500).json({ error: error.message });
  }
}
