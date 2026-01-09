import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    const { token } = req.query;

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
      elegido.treboles = Math.floor((elegido.totalCompras || 0) / 10);
    }

    // Inicializar runas si no existen
    if (typeof elegido.runas !== 'number') {
      elegido.runas = 0;
    }

    // Preparar respuesta (sin datos sensibles)
    const respuesta = {
      nombre: elegido.nombre,
      email: elegido.email,
      genero: elegido.genero || null,
      
      // Gamificación
      treboles: elegido.treboles,
      runas: elegido.runas,
      totalCompras: elegido.totalCompras || 0,
      tiradaGratisUsada: elegido.tiradaGratisUsada || false,
      
      // Guardianes (duendes comprados)
      guardianes: (elegido.guardianes || []).map(g => ({
        id: g.id,
        nombre: g.nombre,
        imagen: g.imagen,
        categorias: g.categorias,
        fechaCompra: g.fechaCompra,
        guiaContent: g.guiaContent || null,
        guiaGenerada: !!g.guiaContent
      })),
      
      // Lecturas (experiencias solicitadas)
      lecturas: (elegido.lecturas || []).map(l => ({
        id: l.id,
        tipo: l.tipo,
        fecha: l.fecha,
        contenido: l.contenido
      })),
      
      // Canjes realizados
      canjes: (elegido.canjes || []).filter(c => c.estado !== 'usado').map(c => ({
        id: c.id,
        tipo: c.tipo,
        nombre: c.nombre,
        fecha: c.fecha,
        estado: c.estado,
        codigo: c.codigo,
        valor: c.valor,
        minimo: c.minimo,
        vence: c.vence
      })),
      
      // Metadata
      createdAt: elegido.createdAt,
      updatedAt: elegido.updatedAt
    };

    return res.status(200).json(respuesta);

  } catch (error) {
    console.error('Error verificando elegido:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
}
