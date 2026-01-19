import { kv } from '@vercel/kv';
import { notificarCompra } from '@/lib/emails';
import crypto from 'crypto';

// ═══════════════════════════════════════════════════════════════════════════════
// WEBHOOK: WOOCOMMERCE
// Recibe notificaciones de compras y otorga runas automáticamente
// ═══════════════════════════════════════════════════════════════════════════════

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs'; // Forzar Node.js runtime para crypto

// Configuración de runas por tipo de producto
const RUNAS_CONFIG = {
  // Por precio (USD aproximado)
  porPrecio: {
    bajo: { min: 0, max: 20, runas: 20, xp: 10 },
    medio: { min: 20, max: 50, runas: 50, xp: 25 },
    alto: { min: 50, max: 100, runas: 100, xp: 50 },
    premium: { min: 100, max: Infinity, runas: 200, xp: 100 }
  },
  // Bonus por categoría
  bonusCategoria: {
    'duendes': 1.5,        // 50% más runas en duendes
    'guardianes': 1.5,
    'canalizaciones': 2.0, // Doble runas en canalizaciones
    'circulo': 2.0,        // Doble runas en membresías
    'cursos': 1.3
  },
  // Bonus para miembros del Círculo
  bonusCirculo: 1.25       // 25% más runas
};

function calcularRunas(precio, categorias = [], esCirculo = false) {
  // Base según precio
  let runas = 20;
  let xp = 10;

  for (const rango of Object.values(RUNAS_CONFIG.porPrecio)) {
    if (precio >= rango.min && precio < rango.max) {
      runas = rango.runas;
      xp = rango.xp;
      break;
    }
  }

  // Bonus por categoría (tomar el mayor)
  let bonusCategoria = 1;
  for (const cat of categorias) {
    const catLower = cat.toLowerCase();
    for (const [key, bonus] of Object.entries(RUNAS_CONFIG.bonusCategoria)) {
      if (catLower.includes(key) && bonus > bonusCategoria) {
        bonusCategoria = bonus;
      }
    }
  }
  runas = Math.round(runas * bonusCategoria);
  xp = Math.round(xp * bonusCategoria);

  // Bonus para miembros del Círculo
  if (esCirculo) {
    runas = Math.round(runas * RUNAS_CONFIG.bonusCirculo);
    xp = Math.round(xp * RUNAS_CONFIG.bonusCirculo);
  }

  return { runas, xp };
}

// Verificar firma del webhook de WooCommerce
function verificarFirma(payload, signature, secret) {
  if (!secret) return true; // Si no hay secret configurado, aceptar todo (dev)

  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('base64');

  return signature === expectedSignature;
}

export async function POST(request) {
  try {
    const webhookSecret = process.env.WOOCOMMERCE_WEBHOOK_SECRET;
    const signature = request.headers.get('x-wc-webhook-signature');
    const rawBody = await request.text();

    // Verificar firma si hay secret configurado
    if (webhookSecret && !verificarFirma(rawBody, signature, webhookSecret)) {
      console.log('[WEBHOOK-WOO] Firma inválida');
      return Response.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const order = JSON.parse(rawBody);

    // Verificar que sea una orden completada
    const status = order.status;
    if (status !== 'completed' && status !== 'processing') {
      console.log(`[WEBHOOK-WOO] Orden ${order.id} ignorada (status: ${status})`);
      return Response.json({ success: true, ignored: true, reason: 'status' });
    }

    // Extraer datos del cliente
    const email = order.billing?.email?.toLowerCase();
    if (!email) {
      console.log(`[WEBHOOK-WOO] Orden ${order.id} sin email`);
      return Response.json({ success: true, ignored: true, reason: 'no_email' });
    }

    // Verificar si ya procesamos esta orden
    const ordenKey = `orden:${order.id}`;
    const yaProc = await kv.get(ordenKey);
    if (yaProc) {
      console.log(`[WEBHOOK-WOO] Orden ${order.id} ya procesada`);
      return Response.json({ success: true, ignored: true, reason: 'already_processed' });
    }

    // Obtener o crear usuario
    let usuario = await kv.get(`user:${email}`);
    const esNuevo = !usuario;

    if (!usuario) {
      // Crear usuario básico
      usuario = {
        email,
        nombre: order.billing?.first_name || '',
        apellido: order.billing?.last_name || '',
        fechaRegistro: new Date().toISOString(),
        runas: 0,
        xp: 0,
        gastado: 0
      };
    }

    // Calcular total y extraer categorías
    const total = parseFloat(order.total) || 0;
    const categorias = [];
    const productos = [];

    for (const item of (order.line_items || [])) {
      productos.push(item.name);
      if (item.categories) {
        for (const cat of item.categories) {
          categorias.push(cat.name || cat);
        }
      }
    }

    // Calcular runas a otorgar
    const { runas, xp } = calcularRunas(total, categorias, usuario.esCirculo);

    // Actualizar usuario
    usuario.runas = (usuario.runas || 0) + runas;
    usuario.xp = (usuario.xp || 0) + xp;
    usuario.gastado = (usuario.gastado || 0) + total;
    usuario.ultimaCompra = new Date().toISOString();

    // Guardar usuario
    await kv.set(`user:${email}`, usuario);

    // Registrar transacción
    const historialKey = `user:${email}:transacciones`;
    const historial = await kv.get(historialKey) || [];
    historial.unshift({
      tipo: 'compra_woocommerce',
      cantidad: runas,
      xp,
      motivo: `Compra: ${productos.join(', ').slice(0, 100)}`,
      ordenId: order.id,
      total,
      fecha: new Date().toISOString()
    });
    await kv.set(historialKey, historial.slice(0, 100));

    // Marcar orden como procesada
    await kv.set(ordenKey, {
      email,
      runas,
      xp,
      total,
      procesado: new Date().toISOString()
    });

    // Enviar email de confirmación
    const nombre = usuario.nombrePreferido || usuario.nombre || 'Alma mágica';
    const productoNombre = productos[0] || 'tu compra';
    await notificarCompra(email, nombre, productoNombre, runas, xp);

    console.log(`[WEBHOOK-WOO] Orden ${order.id}: ${email} +${runas} runas, +${xp} XP (total: $${total})`);

    return Response.json({
      success: true,
      email,
      runas,
      xp,
      total,
      esNuevo
    });

  } catch (error) {
    console.error('[WEBHOOK-WOO] Error:', error);
    return Response.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}

// GET para verificar que el webhook está activo
export async function GET() {
  return Response.json({
    status: 'active',
    endpoint: '/api/webhook/woocommerce',
    message: 'Webhook de WooCommerce activo. Configura este endpoint en WooCommerce > Settings > Advanced > Webhooks'
  });
}
