// /pages/api/admin/contenido/historial.js
import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const adminKey = req.headers['x-admin-key'] || req.query?.adminKey;
  if (adminKey !== process.env.ADMIN_SECRET) {
    return res.status(401).json({ error: 'No autorizado' });
  }

  try {
    const keys = await kv.keys('contenido-circulo:*');
    const historial = [];
    
    for (const key of keys) {
      const contenido = await kv.get(key);
      if (contenido) {
        historial.push({
          semana: contenido.semana || key.replace('contenido-circulo:', ''),
          tematica: contenido.tematica,
          titulo: contenido.titulo,
          estado: contenido.estado,
          fechaGeneracion: contenido.fechaGeneracion
        });
      }
    }

    historial.sort((a, b) => b.semana.localeCompare(a.semana));

    return res.status(200).json({ historial: historial.slice(0, 20) });
  } catch (error) {
    console.error('[HISTORIAL] Error:', error);
    return res.status(500).json({ error: error.message });
  }
}
