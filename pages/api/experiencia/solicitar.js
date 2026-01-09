import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    const { token, experienciaId, datos } = req.body;

    if (!token || !experienciaId) {
      return res.status(400).json({ error: 'Token y experienciaId requeridos' });
    }

    // CORREGIDO: Primero buscar el email del token
    const email = await kv.get(`token:${token}`);
    
    if (!email) {
      return res.status(404).json({ error: 'Token inválido' });
    }

    const elegidoKey = `elegido:${email}`;
    const elegido = await kv.get(elegidoKey);

    if (!elegido) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Definir experiencias y costos
    const EXPERIENCIAS = {
      'tirada-runas': { runas: 10, nombre: 'Tirada de Runas', entrega: 'inmediato' },
      'susurro': { runas: 15, nombre: 'Susurro del Guardián', entrega: '24h' },
      'oraculo': { runas: 20, nombre: 'El Oráculo', entrega: '24h' },
      'lectura-alma': { runas: 25, nombre: 'Lectura del Alma', entrega: '24-48h' },
      'espejo-sombra': { runas: 30, nombre: 'Espejo de Sombra', entrega: '24-48h' },
      'constelacion': { runas: 35, nombre: 'Constelación Elemental', entrega: '48h' },
      'mapa-proposito': { runas: 40, nombre: 'Mapa del Propósito', entrega: '48h' },
      'ritual-ancestros': { runas: 45, nombre: 'Ritual de los Ancestros', entrega: '48h' },
      'carta-año': { runas: 50, nombre: 'Carta del Año', entrega: '48h' },
      'rueda-solar': { runas: 55, nombre: 'Rueda del Año Solar', entrega: '48-72h' },
    };

    const experiencia = EXPERIENCIAS[experienciaId];
    
    if (!experiencia) {
      return res.status(400).json({ error: 'Experiencia no válida' });
    }

    // Verificar runas suficientes
    const runasUsuario = elegido.runas || 0;
    
    if (runasUsuario < experiencia.runas) {
      return res.status(400).json({ 
        error: 'Runas insuficientes',
        runas: runasUsuario,
        requeridas: experiencia.runas
      });
    }

    // Descontar runas
    elegido.runas = runasUsuario - experiencia.runas;

    // Crear solicitud de experiencia
    const solicitud = {
      id: `exp-${Date.now()}`,
      tipo: experienciaId,
      nombre: experiencia.nombre,
      estado: 'pendiente',
      entregaEstimada: experiencia.entrega,
      datos: datos || {},
      fechaSolicitud: new Date().toISOString(),
      runasUsadas: experiencia.runas
    };

    // Guardar en solicitudes pendientes
    if (!elegido.solicitudesPendientes) {
      elegido.solicitudesPendientes = [];
    }
    elegido.solicitudesPendientes.unshift(solicitud);

    elegido.updatedAt = new Date().toISOString();
    await kv.set(elegidoKey, elegido);

    return res.status(200).json({
      success: true,
      solicitud,
      runasRestantes: elegido.runas,
      mensaje: `Tu ${experiencia.nombre} está siendo preparada. Recibirás una notificación cuando esté lista.`
    });

  } catch (error) {
    console.error('Error en solicitud de experiencia:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
}
