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

    // Inicializar runas si no existen
    if (typeof elegido.runas !== 'number') {
      elegido.runas = 0;
    }

    // GET = solo consultar
    if (req.method === 'GET') {
      return res.status(200).json({ 
        runas: elegido.runas,
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

    const runasAntes = elegido.runas;

    switch (accion) {
      case 'sumar':
        elegido.runas += cantidadNum;
        break;
      case 'restar':
        if (elegido.runas < cantidadNum) {
          return res.status(400).json({ 
            error: 'Runas insuficientes', 
            runas: elegido.runas,
            requeridas: cantidadNum 
          });
        }
        elegido.runas -= cantidadNum;
        break;
      case 'set':
        elegido.runas = cantidadNum;
        break;
    }

    elegido.updatedAt = new Date().toISOString();

    // Registrar transacción
    if (!elegido.transaccionesRunas) {
      elegido.transaccionesRunas = [];
    }
    elegido.transaccionesRunas.push({
      fecha: new Date().toISOString(),
      accion,
      cantidad: cantidadNum,
      antes: runasAntes,
      despues: elegido.runas
    });

    // Mantener solo últimas 50 transacciones
    if (elegido.transaccionesRunas.length > 50) {
      elegido.transaccionesRunas = elegido.transaccionesRunas.slice(-50);
    }

    await kv.set(elegidoKey, elegido);

    return res.status(200).json({ 
      success: true,
      runas: elegido.runas,
      runasAntes,
      accion,
      cantidad: cantidadNum
    });

  } catch (error) {
    console.error('Error gestionando runas:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
}
