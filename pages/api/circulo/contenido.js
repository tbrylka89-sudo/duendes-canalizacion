// ═══════════════════════════════════════════════════════════════
// CONTENIDO SEMANAL DEL CÍRCULO
// Archivo: pages/api/circulo/contenido.js
// ═══════════════════════════════════════════════════════════════

import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { token, semana } = req.query;
    
    if (!token) {
      return res.status(400).json({ error: 'Token requerido' });
    }

    // Verificar membresía
    const email = await kv.get(`token:${token}`);
    if (!email) {
      return res.status(404).json({ error: 'Token no válido' });
    }

    const elegido = await kv.get(`elegido:${email}`);
    if (!elegido?.membresia?.activa) {
      return res.status(403).json({ error: 'Se requiere membresía del Círculo' });
    }

    // Verificar vencimiento
    const ahora = new Date();
    if (new Date(elegido.membresia.fechaVencimiento) < ahora) {
      return res.status(403).json({ error: 'Membresía vencida' });
    }

    // Calcular semana actual si no se especifica
    const semanaActual = semana || obtenerSemanaActual();
    
    // Obtener contenido de esa semana
    const contenido = await kv.get(`contenido-circulo:${semanaActual}`);
    
    if (!contenido) {
      return res.status(200).json({
        semana: semanaActual,
        disponible: false,
        mensaje: 'El contenido de esta semana aún no está disponible'
      });
    }

    // Solo devolver si está publicado
    if (contenido.estado !== 'publicado') {
      return res.status(200).json({
        semana: semanaActual,
        disponible: false,
        mensaje: 'El contenido de esta semana aún no está disponible'
      });
    }

    // Obtener contenido de semanas anteriores (últimas 4)
    const semanasAnteriores = [];
    for (let i = 1; i <= 4; i++) {
      const semanaAnterior = obtenerSemanaAnterior(semanaActual, i);
      const contenidoAnterior = await kv.get(`contenido-circulo:${semanaAnterior}`);
      if (contenidoAnterior && contenidoAnterior.estado === 'publicado') {
        semanasAnteriores.push({
          semana: semanaAnterior,
          tematica: contenidoAnterior.tematica,
          titulo: contenidoAnterior.titulo,
          fechaPublicacion: contenidoAnterior.fechaPublicacion
        });
      }
    }

    return res.status(200).json({
      semana: semanaActual,
      disponible: true,
      contenido: {
        tematica: contenido.tematica,
        titulo: contenido.titulo,
        subtitulo: contenido.subtitulo,
        contenidoPrincipal: contenido.contenidoPrincipal,
        extras: contenido.extras || null,
        meditacion: contenido.meditacion || null,
        fechaPublicacion: contenido.fechaPublicacion
      },
      semanasAnteriores
    });

  } catch (error) {
    console.error('[CIRCULO/CONTENIDO] Error:', error);
    return res.status(500).json({ error: error.message });
  }
}

function obtenerSemanaActual() {
  const ahora = new Date();
  const año = ahora.getFullYear();
  const inicioAño = new Date(año, 0, 1);
  const dias = Math.floor((ahora - inicioAño) / (24 * 60 * 60 * 1000));
  const semana = Math.ceil((dias + inicioAño.getDay() + 1) / 7);
  return `${año}-${String(semana).padStart(2, '0')}`;
}

function obtenerSemanaAnterior(semanaActual, semanas) {
  const [año, semana] = semanaActual.split('-').map(Number);
  let nuevaSemana = semana - semanas;
  let nuevoAño = año;
  
  while (nuevaSemana <= 0) {
    nuevoAño--;
    nuevaSemana += 52;
  }
  
  return `${nuevoAño}-${String(nuevaSemana).padStart(2, '0')}`;
}
