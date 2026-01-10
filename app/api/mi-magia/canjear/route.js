import { kv } from '@vercel/kv';

// ═══════════════════════════════════════════════════════════════
// SISTEMA DE CANJES - TREBOLES
// ═══════════════════════════════════════════════════════════════
// TREBOLES se GANAN: 1 trebol por cada $10 USD gastados
// Baseline: 100 treboles = Envio gratis (~$20 valor)
// Esto significa que hay que gastar $1000 USD para ganar envio gratis
// Es un programa de fidelidad para clientes premium
// ═══════════════════════════════════════════════════════════════

const CANJES = {
  // ═══ BENEFICIOS PRINCIPALES ═══
  'envio-gratis': {
    treboles: 100,
    tipo: 'envio',
    nombre: 'Envio gratis en tu proxima compra',
    descripcion: 'Valido para cualquier pedido, sin minimo de compra'
  },
  'mini-guardian': {
    treboles: 150,
    tipo: 'producto',
    nombre: 'Mini guardian de regalo',
    descripcion: 'Un pequeno guardian sorpresa elegido especialmente para vos'
  },

  // ═══ EXPERIENCIAS (canjeables con treboles) ═══
  // Precio inteligente: experiencias cuestan ~50% mas en treboles que su valor en runas
  // porque treboles son mas dificiles de conseguir (hay que gastar mucho)
  // Esto incentiva comprar runas pero recompensa la lealtad

  'exp-tirada-runas': {
    treboles: 25,  // 5 runas * 5 = 25 treboles
    tipo: 'experiencia',
    experienciaId: 'tirada-runas',
    nombre: 'Tirada de Runas',
    descripcion: 'Tirada de 3 runas con interpretacion profunda'
  },
  'exp-susurro-guardian': {
    treboles: 50,  // 10 runas * 5 = 50 treboles
    tipo: 'experiencia',
    experienciaId: 'susurro-guardian',
    nombre: 'Susurro del Guardian',
    descripcion: 'Mensaje canalizado de tu guardian elemental'
  },
  'exp-oraculo-mes': {
    treboles: 60,  // 12 runas * 5 = 60 treboles
    tipo: 'experiencia',
    experienciaId: 'oraculo-mes',
    nombre: 'Oraculo del Mes',
    descripcion: 'Guia completa para el mes con fases lunares y rituales'
  },
  'exp-gran-oraculo': {
    treboles: 100,  // 20 runas * 5 = 100 treboles
    tipo: 'experiencia',
    experienciaId: 'gran-oraculo',
    nombre: 'El Gran Oraculo',
    descripcion: 'Lectura de 3 meses con numerologia y rituales personalizados'
  },
  'exp-lectura-alma': {
    treboles: 125,  // 25 runas * 5 = 125 treboles
    tipo: 'experiencia',
    experienciaId: 'lectura-alma',
    nombre: 'Lectura del Alma',
    descripcion: 'Tu mision de alma, patrones karmicos y guia de 6 meses'
  },

  // ═══ EXTRAS ═══
  'cristal-sorpresa': {
    treboles: 75,
    tipo: 'producto',
    nombre: 'Cristal sorpresa',
    descripcion: 'Un cristal energizado elegido intuitivamente para vos'
  },
  'descuento-10': {
    treboles: 50,
    tipo: 'descuento',
    valor: 10,
    nombre: '10% de descuento',
    descripcion: 'Aplicable en tu proxima compra de productos'
  },
  'descuento-15': {
    treboles: 80,
    tipo: 'descuento',
    valor: 15,
    nombre: '15% de descuento',
    descripcion: 'Aplicable en tu proxima compra de productos'
  }
};

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, canjeId } = body;

    if (!email || !canjeId) {
      return Response.json({ success: false, error: 'Email y canjeId requeridos' }, { status: 400 });
    }

    const canje = CANJES[canjeId];
    if (!canje) {
      return Response.json({ success: false, error: 'Canje no valido' }, { status: 400 });
    }

    const emailNorm = email.toLowerCase().trim();

    // Buscar usuario
    let userKey = `user:${emailNorm}`;
    let usuario = await kv.get(userKey);
    if (!usuario) {
      userKey = `elegido:${emailNorm}`;
      usuario = await kv.get(userKey);
    }

    if (!usuario) {
      return Response.json({ success: false, error: 'Usuario no encontrado' }, { status: 404 });
    }

    // Verificar treboles suficientes
    const trebolesActuales = usuario.treboles || 0;
    if (trebolesActuales < canje.treboles) {
      return Response.json({
        success: false,
        error: `Treboles insuficientes. Necesitas ${canje.treboles}, tenes ${trebolesActuales}`
      }, { status: 400 });
    }

    // Descontar treboles
    usuario.treboles = trebolesActuales - canje.treboles;

    // Aplicar beneficio segun tipo
    const ahora = new Date();
    let resultado = { mensaje: '', detalles: {} };

    switch (canje.tipo) {
      case 'envio':
        usuario.envioGratisPendiente = true;
        usuario.envioGratisOtorgado = ahora.toISOString();
        resultado.mensaje = 'Envio gratis activado para tu proxima compra!';
        resultado.detalles = { tipo: 'envio-gratis', validoHasta: 'Sin vencimiento' };
        break;

      case 'producto':
        if (!usuario.regalosCanjeados) usuario.regalosCanjeados = [];
        usuario.regalosCanjeados.push({
          tipo: canjeId,
          nombre: canje.nombre,
          fecha: ahora.toISOString(),
          estado: 'pendiente'
        });
        resultado.mensaje = `${canje.nombre} canjeado! Te contactaremos para coordinar la entrega.`;
        resultado.detalles = { tipo: 'producto', producto: canje.nombre };
        break;

      case 'experiencia':
        if (!usuario.experienciasGratis) usuario.experienciasGratis = [];
        usuario.experienciasGratis.push({
          tipo: canje.experienciaId,
          nombre: canje.nombre,
          otorgado: ahora.toISOString(),
          usado: false,
          origen: 'canje-treboles'
        });
        resultado.mensaje = `${canje.nombre} desbloqueada! Anda a la seccion Experiencias para usarla.`;
        resultado.detalles = { tipo: 'experiencia', experiencia: canje.experienciaId };
        break;

      case 'descuento':
        const codigoCupon = `TREBOL${Date.now().toString(36).toUpperCase()}`;
        if (!usuario.cupones) usuario.cupones = [];
        usuario.cupones.push({
          codigo: codigoCupon,
          descuento: canje.valor,
          tipo: 'porcentaje',
          creado: ahora.toISOString(),
          usado: false,
          origen: 'canje-treboles'
        });
        resultado.mensaje = `Cupon de ${canje.valor}% generado: ${codigoCupon}`;
        resultado.detalles = { tipo: 'descuento', codigo: codigoCupon, valor: canje.valor };
        break;
    }

    // Registrar historial de canjes
    if (!usuario.historialCanjes) usuario.historialCanjes = [];
    usuario.historialCanjes.push({
      canjeId,
      nombre: canje.nombre,
      treboles: canje.treboles,
      fecha: ahora.toISOString(),
      resultado: resultado.mensaje
    });

    // Guardar usuario
    await kv.set(userKey, usuario);

    return Response.json({
      success: true,
      ...resultado,
      trebolesRestantes: usuario.treboles,
      trebolesUsados: canje.treboles
    });

  } catch (error) {
    console.error('Error en canje:', error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}

// GET - Obtener canjes disponibles con info completa
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    let trebolesUsuario = 0;

    if (email) {
      const emailNorm = email.toLowerCase().trim();
      let usuario = await kv.get(`user:${emailNorm}`);
      if (!usuario) usuario = await kv.get(`elegido:${emailNorm}`);
      if (usuario) trebolesUsuario = usuario.treboles || 0;
    }

    // Organizar canjes por categoria
    const canjesOrganizados = {
      beneficios: [],
      experiencias: [],
      extras: []
    };

    Object.entries(CANJES).forEach(([id, data]) => {
      const canjeConId = {
        id,
        ...data,
        disponible: trebolesUsuario >= data.treboles
      };

      if (data.tipo === 'envio' || id === 'mini-guardian') {
        canjesOrganizados.beneficios.push(canjeConId);
      } else if (data.tipo === 'experiencia') {
        canjesOrganizados.experiencias.push(canjeConId);
      } else {
        canjesOrganizados.extras.push(canjeConId);
      }
    });

    return Response.json({
      success: true,
      treboles: trebolesUsuario,
      canjes: canjesOrganizados,
      info: {
        comoGanar: '1 trebol por cada $10 USD gastados en la tienda',
        baseline: '100 treboles = Envio gratis (~$1000 USD en compras)'
      }
    });

  } catch (error) {
    console.error('Error obteniendo canjes:', error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
