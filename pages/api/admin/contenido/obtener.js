// ═══════════════════════════════════════════════════════════════
// ADMIN: OBTENER CONTENIDO DE UNA SEMANA
// Archivo: pages/api/admin/contenido/obtener.js
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
    const { semana } = req.query;
    
    if (!semana) {
      return res.status(400).json({ error: 'Semana requerida' });
    }

    const contenido = await kv.get(`contenido-circulo:${semana}`);
    
    if (!contenido) {
      return res.status(200).json({ 
        existe: false,
        semana 
      });
    }

    return res.status(200).json({
      existe: true,
      semana,
      contenido
    });

  } catch (error) {
    console.error('[ADMIN/OBTENER] Error:', error);
    return res.status(500).json({ error: error.message });
  }
}
