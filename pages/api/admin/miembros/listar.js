// ═══════════════════════════════════════════════════════════════
// ADMIN: LISTAR MIEMBROS DEL CÍRCULO
// Archivo: pages/api/admin/miembros/listar.js
// ═══════════════════════════════════════════════════════════════

import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const adminKey = req.headers['x-admin-key'] || req.query.adminKey;
  if (adminKey !== process.env.ADMIN_SECRET) {
    return res.status(401).json({ error: 'No autorizado' });
  }

  try {
    const keys = await kv.keys('elegido:*');
    const ahora = new Date();
    
    const miembros = {
      activos: [],
      vencidos: [],
      porVencer: [], // Vencen en los próximos 7 días
      stats: {
        total: 0,
        mensual: 0,
        trimestral: 0,
        semestral: 0,
        anual: 0
      }
    };

    for (const key of keys) {
      const elegido = await kv.get(key);
      
      if (!elegido?.membresia) continue;
      
      const membresia = elegido.membresia;
      const vencimiento = new Date(membresia.fechaVencimiento);
      const diasRestantes = Math.ceil((vencimiento - ahora) / (1000 * 60 * 60 * 24));
      
      const miembroResumen = {
        email: elegido.email,
        nombre: elegido.nombre,
        plan: membresia.plan,
        planNombre: membresia.planNombre,
        fechaInicio: membresia.fechaInicio,
        fechaVencimiento: membresia.fechaVencimiento,
        diasRestantes,
        activa: membresia.activa && diasRestantes > 0,
        lecturasGratis: membresia.lecturasGratis,
        totalCompras: elegido.totalCompras || 0,
        guardianes: elegido.guardianes?.length || 0
      };
      
      if (diasRestantes <= 0 || !membresia.activa) {
        miembros.vencidos.push(miembroResumen);
      } else if (diasRestantes <= 7) {
        miembros.porVencer.push(miembroResumen);
        miembros.activos.push(miembroResumen);
        miembros.stats.total++;
        miembros.stats[membresia.plan]++;
      } else {
        miembros.activos.push(miembroResumen);
        miembros.stats.total++;
        miembros.stats[membresia.plan]++;
      }
    }

    // Ordenar por fecha de vencimiento
    miembros.activos.sort((a, b) => new Date(a.fechaVencimiento) - new Date(b.fechaVencimiento));
    miembros.porVencer.sort((a, b) => a.diasRestantes - b.diasRestantes);
    miembros.vencidos.sort((a, b) => new Date(b.fechaVencimiento) - new Date(a.fechaVencimiento));

    return res.status(200).json(miembros);

  } catch (error) {
    console.error('[ADMIN/MIEMBROS] Error:', error);
    return res.status(500).json({ error: error.message });
  }
}
