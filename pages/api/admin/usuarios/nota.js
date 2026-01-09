// /pages/api/admin/usuarios/nota.js
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
    const { email, nota } = req.body;
    
    if (!email) {
      return res.status(400).json({ error: 'Falta email' });
    }

    const usuario = await kv.get(`elegido:${email.toLowerCase()}`);
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Agregar nota con timestamp
    const notasAnteriores = usuario.notasAdmin || '';
    const nuevaNota = `[${new Date().toLocaleDateString()}] ${nota}`;
    const notasActualizadas = notasAnteriores ? `${notasAnteriores}\n${nuevaNota}` : nuevaNota;

    await kv.set(`elegido:${email.toLowerCase()}`, {
      ...usuario,
      notasAdmin: notasActualizadas
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('[NOTA] Error:', error);
    return res.status(500).json({ error: error.message });
  }
}
