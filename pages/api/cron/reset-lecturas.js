// ═══════════════════════════════════════════════════════════════
// CRON: RESET MENSUAL DE LECTURAS GRATIS
// Archivo: pages/api/cron/reset-lecturas.js
// Ejecutar: Día 1 de cada mes a las 00:01
// ═══════════════════════════════════════════════════════════════

import { kv } from '@vercel/kv';

// Beneficios por plan
const BENEFICIOS_PLAN = {
  'mensual': { tiradas: 1, susurros: 0, runas: 10, treboles: 2 },
  'trimestral': { tiradas: 2, susurros: 0, runas: 15, treboles: 4 },
  'semestral': { tiradas: 2, susurros: 1, runas: 20, treboles: 6 },
  'anual': { tiradas: 3, susurros: 2, runas: 25, treboles: 10 }
};

export default async function handler(req, res) {
  // Verificar clave de cron o admin
  const cronKey = req.headers['authorization'] || req.query.key;
  if (cronKey !== `Bearer ${process.env.CRON_SECRET}` && cronKey !== process.env.ADMIN_SECRET) {
    return res.status(401).json({ error: 'No autorizado' });
  }

  try {
    const ahora = new Date();
    const mesActual = `${ahora.getFullYear()}-${String(ahora.getMonth() + 1).padStart(2, '0')}`;
    
    console.log(`[CRON] Reseteando lecturas para mes: ${mesActual}`);
    
    const keys = await kv.keys('elegido:*');
    let reseteados = 0;
    let acreditados = {
      runas: 0,
      treboles: 0
    };

    for (const key of keys) {
      const elegido = await kv.get(key);
      
      if (!elegido?.membresia?.activa) continue;
      
      // Verificar vencimiento
      const vencimiento = new Date(elegido.membresia.fechaVencimiento);
      if (ahora > vencimiento) {
        elegido.membresia.activa = false;
        await kv.set(key, elegido);
        continue;
      }
      
      // Verificar si ya se reseteó este mes
      if (elegido.membresia.lecturasGratis?.mesActual === mesActual) {
        continue;
      }
      
      // Obtener beneficios del plan
      const plan = elegido.membresia.plan;
      const beneficios = BENEFICIOS_PLAN[plan];
      
      if (!beneficios) continue;
      
      // Resetear lecturas gratis
      elegido.membresia.lecturasGratis = {
        tiradas: beneficios.tiradas,
        susurros: beneficios.susurros,
        mesActual
      };
      
      // Acreditar runas y tréboles mensuales
      elegido.runas = (elegido.runas || 0) + beneficios.runas;
      elegido.treboles = (elegido.treboles || 0) + beneficios.treboles;
      
      acreditados.runas += beneficios.runas;
      acreditados.treboles += beneficios.treboles;
      
      await kv.set(key, elegido);
      reseteados++;
      
      console.log(`[CRON] Reset para ${elegido.email}: +${beneficios.runas}ᚱ, +${beneficios.treboles}🍀`);
    }

    return res.status(200).json({
      success: true,
      mes: mesActual,
      miembrosReseteados: reseteados,
      totalAcreditado: acreditados
    });

  } catch (error) {
    console.error('[CRON/RESET-LECTURAS] Error:', error);
    return res.status(500).json({ error: error.message });
  }
}
