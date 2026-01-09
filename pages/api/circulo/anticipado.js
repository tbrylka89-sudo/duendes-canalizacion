// ═══════════════════════════════════════════════════════════════
// ACCESO ANTICIPADO - PRODUCTOS EXCLUSIVOS CÍRCULO
// Archivo: pages/api/circulo/anticipado.js
// ═══════════════════════════════════════════════════════════════

import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { token } = req.query;
    
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

    // Obtener horas de anticipado según plan
    const horasAnticipado = elegido.membresia.horasAnticipado || 24;
    const descuentoAnticipado = elegido.membresia.descuentoAnticipado || 5;

    // Obtener lista de productos en anticipado
    const productosAnticipado = await kv.get('productos-anticipado') || [];
    
    // Filtrar productos activos y dentro del tiempo del usuario
    const productosDisponibles = [];
    
    for (const productoId of productosAnticipado) {
      const producto = await kv.get(`anticipado:${productoId}`);
      
      if (!producto) continue;
      
      // Verificar que esté activo y no vendido
      if (producto.estado !== 'anticipado') continue;
      
      // Calcular tiempo restante
      const fechaFin = new Date(producto.fechaFinAnticipado);
      const tiempoRestanteMs = fechaFin - ahora;
      
      // Si ya pasó el tiempo, ignorar
      if (tiempoRestanteMs <= 0) continue;
      
      // Verificar que el usuario tenga acceso según sus horas
      const fechaInicio = new Date(producto.fechaInicio);
      const horasDesdeInicio = (ahora - fechaInicio) / (1000 * 60 * 60);
      
      // Si el producto tiene más de 48h y el usuario solo tiene 24h, verificar
      const horasProducto = (fechaFin - fechaInicio) / (1000 * 60 * 60);
      
      // Usuario con 24h solo ve productos cuando quedan 24h o menos
      // Usuario con 48h ve todo
      if (horasAnticipado < horasProducto) {
        const horasRestantes = tiempoRestanteMs / (1000 * 60 * 60);
        if (horasRestantes > horasAnticipado) {
          continue; // Aún no tiene acceso
        }
      }
      
      // Calcular precio con descuento
      const precioOriginal = producto.precio;
      const precioConDescuento = precioOriginal * (1 - descuentoAnticipado / 100);
      
      productosDisponibles.push({
        id: producto.productId,
        nombre: producto.nombre,
        descripcion: producto.descripcion,
        imagen: producto.imagen,
        categorias: producto.categorias,
        precioOriginal,
        precioConDescuento: Math.round(precioConDescuento * 100) / 100,
        descuento: descuentoAnticipado,
        tiempoRestanteMs,
        tiempoRestanteFormateado: formatearTiempo(tiempoRestanteMs),
        fechaFinAnticipado: producto.fechaFinAnticipado
      });
    }

    // Registrar que el usuario vio los productos
    for (const prod of productosDisponibles) {
      const productoData = await kv.get(`anticipado:${prod.id}`);
      if (productoData && !productoData.vistoPor?.includes(email)) {
        productoData.vistoPor = productoData.vistoPor || [];
        productoData.vistoPor.push(email);
        await kv.set(`anticipado:${prod.id}`, productoData);
      }
    }

    return res.status(200).json({
      productos: productosDisponibles,
      tuPlan: {
        horasAnticipado,
        descuentoAnticipado
      },
      total: productosDisponibles.length
    });

  } catch (error) {
    console.error('[CIRCULO/ANTICIPADO] Error:', error);
    return res.status(500).json({ error: error.message });
  }
}

function formatearTiempo(ms) {
  const segundos = Math.floor(ms / 1000);
  const minutos = Math.floor(segundos / 60);
  const horas = Math.floor(minutos / 60);
  
  if (horas >= 24) {
    const dias = Math.floor(horas / 24);
    const horasRestantes = horas % 24;
    return `${dias}d ${horasRestantes}h`;
  }
  
  const minutosRestantes = minutos % 60;
  const segundosRestantes = segundos % 60;
  
  return `${String(horas).padStart(2, '0')}:${String(minutosRestantes).padStart(2, '0')}:${String(segundosRestantes).padStart(2, '0')}`;
}
