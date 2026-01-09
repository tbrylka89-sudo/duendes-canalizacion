import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  const { token, runas, treboles } = req.query;
  
  if (!token) {
    return res.status(400).json({ error: 'Token requerido. Usa: /api/dar-runas?token=TEST123&runas=100' });
  }

  try {
    // Buscar por token directamente o por email
    let elegido = null;
    let elegidoKey = null;
    
    // Primero intentamos buscar por token directo (el key podría ser el token)
    const testKey = `elegido:${token}`;
    elegido = await kv.get(testKey);
    
    if (!elegido) {
      // Si no encuentra, buscar en todos los elegidos
      // Esto es un fallback para encontrar por token
      const keys = await kv.keys('elegido:*');
      
      for (const key of keys) {
        const e = await kv.get(key);
        if (e && e.token === token) {
          elegido = e;
          elegidoKey = key;
          break;
        }
      }
    } else {
      elegidoKey = testKey;
    }

    if (!elegido) {
      return res.status(404).json({ 
        error: 'Elegido no encontrado',
        token,
        sugerencia: 'Verificá que el token sea correcto'
      });
    }

    // Actualizar runas y/o tréboles
    const runasAntes = elegido.runas || 0;
    const trebolesAntes = elegido.treboles || 0;
    
    if (runas) {
      elegido.runas = parseInt(runas);
    }
    
    if (treboles) {
      elegido.treboles = parseInt(treboles);
    }
    
    // Asegurar que tiradaGratisUsada esté definido
    if (typeof elegido.tiradaGratisUsada === 'undefined') {
      elegido.tiradaGratisUsada = false;
    }
    
    elegido.updatedAt = new Date().toISOString();
    
    await kv.set(elegidoKey, elegido);

    return res.status(200).json({
      success: true,
      mensaje: 'Elegido actualizado',
      elegido: {
        nombre: elegido.nombre,
        email: elegido.email,
        token: elegido.token,
        runasAntes,
        runasAhora: elegido.runas,
        trebolesAntes,
        trebolesAhora: elegido.treboles,
        tiradaGratisUsada: elegido.tiradaGratisUsada
      }
    });

  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: 'Error interno', details: error.message });
  }
}
