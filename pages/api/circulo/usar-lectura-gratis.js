// ═══════════════════════════════════════════════════════════════
// USAR LECTURA GRATIS DEL CÍRCULO
// Archivo: pages/api/circulo/usar-lectura-gratis.js
// ═══════════════════════════════════════════════════════════════

import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { token, tipoLectura } = req.body;
    
    if (!token || !tipoLectura) {
      return res.status(400).json({ error: 'Token y tipoLectura requeridos' });
    }

    // Validar tipo
    if (!['tirada', 'susurro'].includes(tipoLectura)) {
      return res.status(400).json({ error: 'Tipo de lectura inválido' });
    }

    // Obtener email del token
    const email = await kv.get(`token:${token}`);
    if (!email) {
      return res.status(404).json({ error: 'Token no válido' });
    }

    // Obtener elegido
    const elegido = await kv.get(`elegido:${email}`);
    if (!elegido) {
      return res.status(404).json({ error: 'Elegido no encontrado' });
    }

    // Verificar membresía activa
    if (!elegido.membresia || !elegido.membresia.activa) {
      return res.status(403).json({ error: 'No tiene membresía activa' });
    }

    // Verificar vencimiento
    const ahora = new Date();
    const vencimiento = new Date(elegido.membresia.fechaVencimiento);
    if (ahora > vencimiento) {
      elegido.membresia.activa = false;
      await kv.set(`elegido:${email}`, elegido);
      return res.status(403).json({ error: 'Membresía vencida' });
    }

    // Verificar si hay que resetear el mes
    const mesActual = `${ahora.getFullYear()}-${String(ahora.getMonth() + 1).padStart(2, '0')}`;
    
    if (elegido.membresia.lecturasGratis.mesActual !== mesActual) {
      // Nuevo mes - resetear lecturas según plan
      const plan = elegido.membresia.plan;
      const beneficios = obtenerBeneficiosPlan(plan);
      
      elegido.membresia.lecturasGratis = {
        tiradas: beneficios.tiradas,
        susurros: beneficios.susurros,
        mesActual
      };
    }

    // Verificar disponibilidad
    const campo = tipoLectura === 'tirada' ? 'tiradas' : 'susurros';
    const disponibles = elegido.membresia.lecturasGratis[campo] || 0;

    if (disponibles <= 0) {
      return res.status(403).json({ 
        error: `No tenés ${tipoLectura}s gratis disponibles este mes`,
        disponibles: 0
      });
    }

    // Descontar lectura
    elegido.membresia.lecturasGratis[campo] = disponibles - 1;
    await kv.set(`elegido:${email}`, elegido);

    return res.status(200).json({
      success: true,
      mensaje: `Lectura gratis usada`,
      restantes: elegido.membresia.lecturasGratis[campo],
      lecturasGratis: elegido.membresia.lecturasGratis
    });

  } catch (error) {
    console.error('[CIRCULO/USAR-LECTURA] Error:', error);
    return res.status(500).json({ error: error.message });
  }
}

function obtenerBeneficiosPlan(plan) {
  // Semestral: $50 USD | Anual: $80 USD
  const planes = {
    'trial': { tiradas: 1, susurros: 0 },
    'semestral': { tiradas: 2, susurros: 1 },
    'anual': { tiradas: 5, susurros: 2 }
  };
  return planes[plan] || { tiradas: 0, susurros: 0 };
}
