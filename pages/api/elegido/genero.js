import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    const { token, genero } = req.body;

    if (!token) {
      return res.status(400).json({ error: 'Token requerido' });
    }

    if (!genero || !['F', 'M', 'N'].includes(genero)) {
      return res.status(400).json({ error: 'Género inválido. Usar F, M o N' });
    }

    // Buscar elegido por token
    const elegidoKey = `elegido:${token}`;
    const elegido = await kv.get(elegidoKey);

    if (!elegido) {
      return res.status(404).json({ error: 'Elegido no encontrado' });
    }

    // Actualizar género
    elegido.genero = genero;
    elegido.updatedAt = new Date().toISOString();

    await kv.set(elegidoKey, elegido);

    return res.status(200).json({ 
      success: true, 
      genero: elegido.genero,
      mensaje: genero === 'F' ? 'Elegida' : genero === 'M' ? 'Elegido' : 'Alma Mágica'
    });

  } catch (error) {
    console.error('Error guardando género:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
}
