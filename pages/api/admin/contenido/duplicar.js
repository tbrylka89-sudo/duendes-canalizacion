// /pages/api/admin/contenido/duplicar.js
import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const adminKey = req.headers['x-admin-key'];
  if (adminKey !== process.env.ADMIN_SECRET) {
    return res.status(401).json({ error: 'No autorizado' });
  }

  try {
    const { semanaOrigen, semanaDestino } = req.body;
    
    if (!semanaOrigen || !semanaDestino) {
      return res.status(400).json({ error: 'Faltan parámetros' });
    }

    const contenidoOrigen = await kv.get(`contenido-circulo:${semanaOrigen}`);
    if (!contenidoOrigen) {
      return res.status(404).json({ error: 'No existe contenido origen' });
    }

    const contenidoNuevo = {
      ...contenidoOrigen,
      id: semanaDestino,
      semana: semanaDestino,
      estado: 'borrador',
      fechaGeneracion: new Date().toISOString(),
      fechaPublicacion: null,
      duplicadoDe: semanaOrigen
    };

    await kv.set(`contenido-circulo:${semanaDestino}`, contenidoNuevo);

    return res.status(200).json({ success: true, contenido: contenidoNuevo });
  } catch (error) {
    console.error('[DUPLICAR] Error:', error);
    return res.status(500).json({ error: error.message });
  }
}
