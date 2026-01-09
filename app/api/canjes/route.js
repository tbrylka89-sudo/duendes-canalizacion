import { kv } from '@vercel/kv';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function OPTIONS() {
  return new Response(null, { headers: CORS_HEADERS });
}

// ═══════════════════════════════════════════════════════════════
// CANJES DISPONIBLES
// ═══════════════════════════════════════════════════════════════

const CANJES = {
  'cupon-5': {
    treboles: 10,
    nombre: 'Cupón $5 USD',
    tipo: 'cupon',
    valor: 5
  },
  'cupon-10': {
    treboles: 20,
    nombre: 'Cupón $10 USD',
    tipo: 'cupon',
    valor: 10
  },
  'circulo-15': {
    treboles: 50,
    nombre: '15 días de Círculo gratis',
    tipo: 'circulo',
    dias: 15
  },
  'envio-gratis': {
    treboles: 100,
    nombre: 'Envío gratis próxima compra',
    tipo: 'envio',
    valor: 1
  },
  'mini-guardian': {
    treboles: 150,
    nombre: 'Mini guardián de regalo',
    tipo: 'regalo',
    valor: 'mini-guardian'
  }
};

// ═══════════════════════════════════════════════════════════════
// PROCESAR CANJE
// ═══════════════════════════════════════════════════════════════

export async function POST(request) {
  try {
    const { email, canjeId } = await request.json();
    
    if (!email || !canjeId) {
      return Response.json({ 
        success: false, 
        error: 'Email y canjeId requeridos' 
      }, { status: 400, headers: CORS_HEADERS });
    }
    
    const canje = CANJES[canjeId];
    if (!canje) {
      return Response.json({ 
        success: false, 
        error: 'Canje no válido' 
      }, { status: 400, headers: CORS_HEADERS });
    }
    
    const emailLower = email.toLowerCase();
    
    // Verificar tréboles del usuario
    const elegido = await kv.get(`elegido:${emailLower}`);
    if (!elegido || (elegido.treboles || 0) < canje.treboles) {
      return Response.json({ 
        success: false, 
        error: 'Tréboles insuficientes' 
      }, { status: 400, headers: CORS_HEADERS });
    }
    
    // Descontar tréboles
    elegido.treboles = (elegido.treboles || 0) - canje.treboles;
    
    // Procesar según tipo de canje
    let resultado = {};
    
    if (canje.tipo === 'cupon') {
      // Generar código de cupón
      const codigoCupon = `DUY${canje.valor}-${Date.now().toString(36).toUpperCase()}`;
      
      // Guardar cupón
      const cupones = await kv.get(`cupones:${emailLower}`) || [];
      cupones.push({
        codigo: codigoCupon,
        valor: canje.valor,
        moneda: 'USD',
        creado: new Date().toISOString(),
        usado: false
      });
      await kv.set(`cupones:${emailLower}`, cupones);
      
      resultado = {
        tipo: 'cupon',
        codigo: codigoCupon,
        valor: canje.valor,
        mensaje: `Tu cupón de $${canje.valor} USD es: ${codigoCupon}`
      };
      
      // TODO: Crear cupón en WooCommerce vía API
    }
    
    else if (canje.tipo === 'circulo') {
      // Agregar días al círculo
      let circulo = await kv.get(`circulo:${emailLower}`) || {
        activo: false,
        plan: 'regalo',
        expira: null
      };
      
      const fechaBase = circulo.expira ? new Date(circulo.expira) : new Date();
      const nuevaExpiracion = new Date(fechaBase);
      nuevaExpiracion.setDate(nuevaExpiracion.getDate() + canje.dias);
      
      circulo.activo = true;
      circulo.expira = nuevaExpiracion.toISOString();
      circulo.ultimoCanje = new Date().toISOString();
      
      await kv.set(`circulo:${emailLower}`, circulo);
      
      resultado = {
        tipo: 'circulo',
        dias: canje.dias,
        expira: nuevaExpiracion.toISOString(),
        mensaje: `¡Tenés ${canje.dias} días de Círculo gratis! Activo hasta ${nuevaExpiracion.toLocaleDateString()}`
      };
    }
    
    else if (canje.tipo === 'envio') {
      // Marcar envío gratis pendiente
      elegido.envioGratisPendiente = true;
      elegido.envioGratisDesde = new Date().toISOString();
      
      resultado = {
        tipo: 'envio',
        mensaje: 'Tu próxima compra tendrá envío gratis.'
      };
    }
    
    else if (canje.tipo === 'regalo') {
      // Agregar a lista de regalos pendientes
      const regalos = await kv.get(`regalos-pendientes:${emailLower}`) || [];
      regalos.push({
        tipo: canje.valor,
        nombre: canje.nombre,
        canjeado: new Date().toISOString(),
        reclamado: false
      });
      await kv.set(`regalos-pendientes:${emailLower}`, regalos);
      
      resultado = {
        tipo: 'regalo',
        regalo: canje.valor,
        mensaje: 'Tu mini guardián de regalo está reservado. Te contactaremos para coordinar el envío.'
      };
    }
    
    // Guardar historial de canjes
    const historialCanjes = await kv.get(`historial-canjes:${emailLower}`) || [];
    historialCanjes.unshift({
      canjeId,
      nombre: canje.nombre,
      treboles: canje.treboles,
      fecha: new Date().toISOString(),
      resultado
    });
    await kv.set(`historial-canjes:${emailLower}`, historialCanjes);
    
    // Guardar elegido actualizado
    await kv.set(`elegido:${emailLower}`, elegido);
    
    return Response.json({ 
      success: true, 
      ...resultado,
      trebolRestantes: elegido.treboles
    }, { headers: CORS_HEADERS });
    
  } catch (error) {
    console.error('Error procesando canje:', error);
    return Response.json({ 
      success: false, 
      error: error.message 
    }, { status: 500, headers: CORS_HEADERS });
  }
}
