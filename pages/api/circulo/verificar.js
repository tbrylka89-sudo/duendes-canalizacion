// ═══════════════════════════════════════════════════════════════
// VERIFICAR MEMBRESÍA CÍRCULO
// Archivo: pages/api/circulo/verificar.js
// ═══════════════════════════════════════════════════════════════

import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const token = req.query.token || req.body?.token;
    
    if (!token) {
      return res.status(400).json({ error: 'Token requerido' });
    }

    // Obtener email del token
    const email = await kv.get(`token:${token}`);
    if (!email) {
      return res.status(404).json({ error: 'Token no válido', esCirculo: false });
    }

    // Obtener elegido
    const elegido = await kv.get(`elegido:${email}`);
    if (!elegido) {
      return res.status(404).json({ error: 'Elegido no encontrado', esCirculo: false });
    }

    // Verificar membresía
    const membresia = elegido.membresia;
    
    if (!membresia || !membresia.activa) {
      return res.status(200).json({
        esCirculo: false,
        mensaje: 'No tiene membresía activa'
      });
    }

    // Verificar si venció
    const ahora = new Date();
    const vencimiento = new Date(membresia.fechaVencimiento);
    
    if (ahora > vencimiento) {
      // Membresía vencida - actualizar
      elegido.membresia.activa = false;
      await kv.set(`elegido:${email}`, elegido);
      
      return res.status(200).json({
        esCirculo: false,
        mensaje: 'Membresía vencida',
        fechaVencimiento: membresia.fechaVencimiento
      });
    }

    // Membresía activa - devolver datos
    const diasRestantes = Math.ceil((vencimiento - ahora) / (1000 * 60 * 60 * 24));
    
    return res.status(200).json({
      esCirculo: true,
      plan: membresia.plan,
      planNombre: membresia.planNombre,
      fechaInicio: membresia.fechaInicio,
      fechaVencimiento: membresia.fechaVencimiento,
      diasRestantes,
      beneficios: {
        descuentoTienda: membresia.descuentoTienda,
        descuentoAnticipado: membresia.descuentoAnticipado,
        horasAnticipado: membresia.horasAnticipado,
        titoVIP: membresia.titoVIP,
        lecturasGratis: membresia.lecturasGratis
      }
    });

  } catch (error) {
    console.error('[CIRCULO/VERIFICAR] Error:', error);
    return res.status(500).json({ error: error.message });
  }
}
