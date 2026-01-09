import { kv } from '@vercel/kv';
const ADMIN_KEY = process.env.ADMIN_SECRET || 'DuendesAdmin2026';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  
  const adminKey = req.headers['x-admin-key'] || req.body?.adminKey;
  if (adminKey !== ADMIN_KEY) return res.status(401).json({ error: 'No autorizado' });

  try {
    const { email, tipo, cantidad, mensaje } = req.body;
    if (!email || !tipo) return res.status(400).json({ error: 'Falta email o tipo' });

    let usuario = await kv.get(`user:${email}`);
    if (!usuario) {
      const token = [...Array(64)].map(() => 'abcdef0123456789'[Math.floor(Math.random()*16)]).join('');
      usuario = { email, runas: 0, treboles: 0, esCirculo: false, token, fechaCreacion: new Date().toISOString() };
    }

    let detalle = '';
    switch (tipo) {
      case 'runas':
        const r = parseInt(cantidad) || 10;
        usuario.runas = (usuario.runas || 0) + r;
        detalle = `${r} Runas`;
        break;
      case 'treboles':
        const t = parseInt(cantidad) || 10;
        usuario.treboles = (usuario.treboles || 0) + t;
        detalle = `${t} Tréboles`;
        break;
      case 'circulo':
        const d = parseInt(cantidad) || 30;
        const exp = new Date();
        exp.setDate(exp.getDate() + d);
        usuario.esCirculo = true;
        usuario.circuloExpira = exp.toISOString().split('T')[0];
        detalle = `${d} días de Círculo`;
        break;
      case 'lectura':
        if (!usuario.lecturasPendientes) usuario.lecturasPendientes = [];
        usuario.lecturasPendientes.push({ tipo: cantidad || 'tirada', fecha: new Date().toISOString() });
        detalle = `Lectura: ${cantidad || 'Tirada'}`;
        break;
      case 'cupon':
        if (!usuario.cupones) usuario.cupones = [];
        const cod = 'REGALO' + Date.now().toString(36).toUpperCase();
        usuario.cupones.push({ codigo: cod, descuento: cantidad || '10%', usado: false });
        detalle = `Cupón ${cantidad || '10%'} (${cod})`;
        break;
      default:
        return res.status(400).json({ error: 'Tipo no válido' });
    }

    await kv.set(`user:${email}`, usuario);
    await kv.lpush('historial-regalos', JSON.stringify({ email, tipo, detalle, fecha: new Date().toISOString() }));

    return res.status(200).json({ success: true, mensaje: `Enviado: ${detalle}`, usuario: { email, runas: usuario.runas, treboles: usuario.treboles, esCirculo: usuario.esCirculo } });
  } catch (error) {
    return res.status(500).json({ error: 'Error', detalle: error.message });
  }
}
