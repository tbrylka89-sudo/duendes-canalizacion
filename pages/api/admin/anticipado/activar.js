// ═══════════════════════════════════════════════════════════════
// ADMIN: ACTIVAR ACCESO ANTICIPADO
// Archivo: pages/api/admin/anticipado/activar.js
// ═══════════════════════════════════════════════════════════════

import { kv } from '@vercel/kv';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const adminKey = req.headers['x-admin-key'] || req.body?.adminKey;
  if (adminKey !== process.env.ADMIN_SECRET) {
    return res.status(401).json({ error: 'No autorizado' });
  }

  try {
    const { 
      productId, 
      nombre, 
      descripcion, 
      precio, 
      imagen, 
      categorias,
      duracionHoras 
    } = req.body;
    
    if (!productId || !nombre || !precio) {
      return res.status(400).json({ 
        error: 'Faltan parámetros: productId, nombre, precio' 
      });
    }

    const horas = duracionHoras || 48;
    const ahora = new Date();
    const fechaFin = new Date(ahora);
    fechaFin.setHours(fechaFin.getHours() + horas);

    // Crear registro de producto anticipado
    const productoAnticipado = {
      productId: productId.toString(),
      nombre,
      descripcion: descripcion || '',
      precio: parseFloat(precio),
      imagen: imagen || null,
      categorias: categorias || [],
      fechaInicio: ahora.toISOString(),
      fechaFinAnticipado: fechaFin.toISOString(),
      duracionHoras: horas,
      estado: 'anticipado',
      vistoPor: [],
      compradoPor: null
    };

    // Guardar producto
    await kv.set(`anticipado:${productId}`, productoAnticipado);

    // Agregar a lista de productos anticipados
    const listaAnticipados = await kv.get('productos-anticipado') || [];
    if (!listaAnticipados.includes(productId.toString())) {
      listaAnticipados.push(productId.toString());
      await kv.set('productos-anticipado', listaAnticipados);
    }

    // Notificar a miembros del Círculo
    const notificados = await notificarNuevoAnticipado(productoAnticipado);

    return res.status(200).json({
      success: true,
      producto: productoAnticipado,
      miembrosNotificados: notificados
    });

  } catch (error) {
    console.error('[ADMIN/ANTICIPADO] Error:', error);
    return res.status(500).json({ error: error.message });
  }
}

async function notificarNuevoAnticipado(producto) {
  try {
    const keys = await kv.keys('elegido:*');
    let notificados = 0;
    
    for (const key of keys) {
      const elegido = await kv.get(key);
      
      if (!elegido?.membresia?.activa) continue;
      if (new Date(elegido.membresia.fechaVencimiento) < new Date()) continue;
      
      const portalUrl = `https://duendes-vercel.vercel.app/mi-magia?token=${elegido.token}`;
      const descuento = elegido.membresia.descuentoAnticipado || 5;
      const precioConDescuento = producto.precio * (1 - descuento / 100);
      
      try {
        await resend.emails.send({
          from: 'Duendes del Uruguay <magia@duendesdeluruguay.com>',
          to: elegido.email,
          subject: `👁️ Acceso Anticipado: ${producto.nombre}`,
          html: `
            <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; color: #f5f5f5; padding: 40px;">
              <div style="text-align: center; margin-bottom: 20px;">
                <span style="background: #d4af37; color: #0a0a0a; padding: 8px 20px; border-radius: 20px; font-size: 12px; letter-spacing: 2px;">ACCESO ANTICIPADO</span>
              </div>
              
              <h1 style="color: #d4af37; font-size: 26px; text-align: center; margin: 20px 0;">
                ${producto.nombre}
              </h1>
              
              ${producto.imagen ? `
                <div style="text-align: center; margin: 30px 0;">
                  <img src="${producto.imagen}" alt="${producto.nombre}" style="max-width: 100%; border-radius: 10px; border: 2px solid #d4af37;">
                </div>
              ` : ''}
              
              <p style="font-size: 16px; line-height: 1.8; text-align: center;">
                ${elegido.nombre}, tenés acceso exclusivo a este guardián antes que nadie.
              </p>
              
              <div style="background: #1a1a1a; border: 1px solid #d4af37; border-radius: 10px; padding: 25px; margin: 30px 0; text-align: center;">
                <p style="color: #888; margin: 0; text-decoration: line-through;">
                  Precio normal: $${producto.precio} USD
                </p>
                <p style="color: #d4af37; font-size: 28px; margin: 10px 0; font-weight: bold;">
                  Tu precio: $${precioConDescuento.toFixed(2)} USD
                </p>
                <p style="color: #4ade80; margin: 0;">
                  ¡${descuento}% de descuento por ser del Círculo!
                </p>
              </div>
              
              <div style="background: #1a1a1a; border-radius: 10px; padding: 15px; text-align: center; margin-bottom: 30px;">
                <p style="margin: 0; color: #f87171;">
                  ⏰ Disponible solo por ${producto.duracionHoras} horas
                </p>
                <p style="margin: 5px 0 0 0; color: #888; font-size: 14px;">
                  Después pasa a la tienda pública sin descuento
                </p>
              </div>
              
              <div style="text-align: center; margin: 40px 0;">
                <a href="${portalUrl}" style="display: inline-block; background: #d4af37; color: #0a0a0a; padding: 18px 40px; text-decoration: none; font-weight: bold; border-radius: 50px; font-size: 16px;">
                  Ver en Mi Portal ✦
                </a>
              </div>
              
              <p style="font-size: 14px; color: #666; text-align: center;">
                Solo miembros del Círculo pueden ver esto.
              </p>
            </div>
          `
        });
        notificados++;
      } catch (emailError) {
        console.error(`Error enviando a ${elegido.email}:`, emailError);
      }
    }
    
    return notificados;
  } catch (error) {
    console.error('Error notificando anticipado:', error);
    return 0;
  }
}
