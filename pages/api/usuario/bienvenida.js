import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { token, pronombre, nombrePreferido } = req.body;

    if (!token) {
      return res.status(400).json({ error: 'Token requerido' });
    }

    // Obtener email desde token
    const email = await kv.get(`token:${token}`);
    if (!email) {
      return res.status(404).json({ error: 'Token no válido' });
    }

    // Obtener usuario actual
    const usuario = await kv.get(`elegido:${email}`);
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Actualizar preferencias
    const usuarioActualizado = {
      ...usuario,
      pronombre: pronombre || 'ella',
      nombrePreferido: nombrePreferido || usuario.nombre?.split(' ')[0],
      bienvenidaCompletada: true,
      fechaBienvenida: new Date().toISOString()
    };

    // Guardar
    await kv.set(`elegido:${email}`, usuarioActualizado);

    return res.status(200).json({ 
      success: true,
      pronombre: usuarioActualizado.pronombre,
      nombrePreferido: usuarioActualizado.nombrePreferido
    });

  } catch (error) {
    console.error('Error en bienvenida:', error);
    return res.status(500).json({ error: 'Error interno' });
  }
}
