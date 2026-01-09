// /pages/api/admin/usuarios/buscar.js
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
    const { email, q } = req.query;
    const busqueda = email || q;
    
    if (!busqueda) {
      return res.status(400).json({ error: 'Falta email o búsqueda' });
    }

    // Buscar por email exacto primero
    let usuario = await kv.get(`elegido:${busqueda.toLowerCase()}`);
    
    // Si no encuentra, buscar en todas las claves
    if (!usuario && q) {
      const keys = await kv.keys('elegido:*');
      for (const key of keys) {
        const u = await kv.get(key);
        if (u && (u.nombre?.toLowerCase().includes(q.toLowerCase()) || 
                  u.email?.toLowerCase().includes(q.toLowerCase()))) {
          usuario = u;
          break;
        }
      }
    }

    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Obtener membresía si existe
    const membresia = await kv.get(`membresia:${usuario.email}`);
    
    // Calcular si membresía está activa
    let membresiaActiva = false;
    let diasRestantes = 0;
    if (membresia?.fechaVencimiento) {
      const vencimiento = new Date(membresia.fechaVencimiento);
      diasRestantes = Math.ceil((vencimiento - new Date()) / (1000 * 60 * 60 * 24));
      membresiaActiva = diasRestantes > 0;
    }

    // Generar link de acceso
    const linkAcceso = usuario.token 
      ? `https://duendes-vercel.vercel.app/mi-magia?token=${usuario.token}`
      : null;

    return res.status(200).json({
      usuario: {
        ...usuario,
        linkAcceso,
        membresia: membresia ? {
          ...membresia,
          activa: membresiaActiva,
          diasRestantes
        } : null
      }
    });
  } catch (error) {
    console.error('[BUSCAR] Error:', error);
    return res.status(500).json({ error: error.message });
  }
}
