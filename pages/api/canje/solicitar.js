import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    const { token, canjeId } = req.body;

    if (!token || !canjeId) {
      return res.status(400).json({ error: 'Token y canjeId requeridos' });
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

    // Definir canjes disponibles
    const CANJES = {
      'cupon5': { treboles: 20, tipo: 'cupon', valor: 5, minimo: 100 },
      'cristal': { treboles: 30, tipo: 'fisico', nombre: 'Cristal de los Deseos' },
      'cupon10': { treboles: 40, tipo: 'cupon', valor: 10, minimo: 150 },
      'prueba-circulo': { treboles: 50, tipo: 'membresia', dias: 15 },
      'cupon15': { treboles: 60, tipo: 'cupon', valor: 15, minimo: 200 },
      'envio': { treboles: 100, tipo: 'envio' },
      'mini': { treboles: 150, tipo: 'fisico', nombre: 'Duende Mini Sorpresa' },
    };

    const canje = CANJES[canjeId];
    
    if (!canje) {
      return res.status(400).json({ error: 'Canje no válido' });
    }

    // Verificar tréboles suficientes
    if ((elegido.treboles || 0) < canje.treboles) {
      return res.status(400).json({ 
        error: 'Tréboles insuficientes',
        treboles: elegido.treboles || 0,
        requeridos: canje.treboles
      });
    }

    // Descontar tréboles
    elegido.treboles = (elegido.treboles || 0) - canje.treboles;

    // Procesar según tipo de canje
    let resultado = {};

    if (canje.tipo === 'cupon') {
      const codigo = `TREBOL-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
      const vencimiento = new Date();
      vencimiento.setDate(vencimiento.getDate() + 60);
      
      elegido.cuponActivo = {
        codigo,
        valor: canje.valor,
        minimo: canje.minimo,
        vencimiento: vencimiento.toISOString(),
        creado: new Date().toISOString()
      };
      
      resultado = { tipo: 'cupon', codigo, valor: canje.valor, vencimiento: vencimiento.toISOString() };
    } 
    else if (canje.tipo === 'membresia') {
      const inicio = new Date();
      const fin = new Date();
      fin.setDate(fin.getDate() + canje.dias);
      
      elegido.esCirculo = true;
      elegido.circuloPlan = 'prueba';
      elegido.circuloInicio = inicio.toISOString();
      elegido.circuloFin = fin.toISOString();
      
      resultado = { tipo: 'membresia', dias: canje.dias, fin: fin.toISOString() };
    }
    else if (canje.tipo === 'envio') {
      elegido.envioGratisPendiente = true;
      resultado = { tipo: 'envio', mensaje: 'Envío gratis aplicado a tu próxima compra' };
    }
    else if (canje.tipo === 'fisico') {
      if (!elegido.premiosPendientes) {
        elegido.premiosPendientes = [];
      }
      elegido.premiosPendientes.push({
        nombre: canje.nombre,
        fecha: new Date().toISOString()
      });
      resultado = { tipo: 'fisico', nombre: canje.nombre, mensaje: 'Se enviará con tu próxima compra' };
    }

    // Guardar historial de canje
    if (!elegido.historialCanjes) {
      elegido.historialCanjes = [];
    }
    elegido.historialCanjes.unshift({
      canjeId,
      treboles: canje.treboles,
      fecha: new Date().toISOString(),
      resultado
    });

    elegido.updatedAt = new Date().toISOString();
    await kv.set(elegidoKey, elegido);

    return res.status(200).json({
      success: true,
      ...resultado,
      trebolesRestantes: elegido.treboles
    });

  } catch (error) {
    console.error('Error en canje:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
}
