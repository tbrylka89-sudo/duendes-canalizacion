import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({ error: 'Token requerido' });
    }

    // CORREGIDO: Primero buscar el email del token
    const email = await kv.get(`token:${token}`);
    
    if (!email) {
      return res.status(404).json({ error: 'Token inválido' });
    }

    const elegido = await kv.get(`elegido:${email}`);

    if (!elegido) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const lecturas = elegido.lecturas || [];

    return res.status(200).json({
      success: true,
      lecturas,
      total: lecturas.length
    });

  } catch (error) {
    console.error('Error al listar lecturas:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
}
