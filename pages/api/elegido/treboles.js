import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const { token, accion, cantidad } = req.method === 'GET' ? req.query : req.body;

    if (!token) {
      return res.status(400).json({ error: 'Token requerido' });
    }

    // Buscar elegido por token
    const elegidoKey = `elegido:${token}`;
    const elegido = await kv.get(elegidoKey);

    if (!elegido) {
      return res.status(404).json({ error: 'Elegido no encontrado' });
    }

    // Calcular tréboles si no existen (basado en totalCompras)
    if (typeof elegido.treboles !== 'number') {
      // $10 USD = 1 trébol
      elegido.treboles = Math.floor((elegido.totalCompras || 0) / 10);
    }

    // GET = solo consultar
    if (req.method === 'GET') {
      return res.status(200).json({ 
        treboles: elegido.treboles,
        totalCompras: elegido.totalCompras || 0,
        nombre: elegido.nombre
      });
    }

    // POST = modificar
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Método no permitido' });
    }

    if (!accion || !['sumar', 'restar', 'set'].includes(accion)) {
      return res.status(400).json({ error: 'Acción inválida. Usar: sumar, restar, set' });
    }

    const cantidadNum = parseInt(cantidad);
    if (isNaN(cantidadNum) || cantidadNum < 0) {
      return res.status(400).json({ error: 'Cantidad inválida' });
    }

    const trebolesAntes = elegido.treboles;

    switch (accion) {
      case 'sumar':
        elegido.treboles += cantidadNum;
        break;
      case 'restar':
        if (elegido.treboles < cantidadNum) {
          return res.status(400).json({ 
            error: 'Tréboles insuficientes', 
            treboles: elegido.treboles,
            requeridos: cantidadNum 
          });
        }
        elegido.treboles -= cantidadNum;
        break;
      case 'set':
        elegido.treboles = cantidadNum;
        break;
    }

    elegido.updatedAt = new Date().toISOString();

    // Registrar transacción
    if (!elegido.transaccionesTreboles) {
      elegido.transaccionesTreboles = [];
    }
    elegido.transaccionesTreboles.push({
      fecha: new Date().toISOString(),
      accion,
      cantidad: cantidadNum,
      antes: trebolesAntes,
      despues: elegido.treboles
    });

    // Mantener solo últimas 50 transacciones
    if (elegido.transaccionesTreboles.length > 50) {
      elegido.transaccionesTreboles = elegido.transaccionesTreboles.slice(-50);
    }

    await kv.set(elegidoKey, elegido);

    return res.status(200).json({ 
      success: true,
      treboles: elegido.treboles,
      trebolesAntes,
      accion,
      cantidad: cantidadNum
    });

  } catch (error) {
    console.error('Error gestionando tréboles:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
}
