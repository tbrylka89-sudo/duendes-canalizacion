// ═══════════════════════════════════════════════════════════════
// WEBHOOK WOOCOMMERCE - DETECTA GUARDIANES, RUNAS Y MEMBRESÍAS
// Archivo: pages/api/webhook-circulo.js
// ═══════════════════════════════════════════════════════════════

import { kv } from '@vercel/kv';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

// Configuración de planes del Círculo
const PLANES_CIRCULO = {
  'circulo-mensual': {
    nombre: 'Mensual',
    duracionDias: 30,
    tiradas: 1,
    susurros: 0,
    runas: 10,
    treboles: 2,
    descuentoTienda: 0,
    descuentoAnticipado: 5,
    horasAnticipado: 24,
    titoVIP: false,
    lecturaAlmaBienvenida: false
  },
  'circulo-trimestral': {
    nombre: 'Trimestral',
    duracionDias: 90,
    tiradas: 2,
    susurros: 0,
    runas: 15,
    treboles: 4,
    descuentoTienda: 5,
    descuentoAnticipado: 5,
    horasAnticipado: 24,
    titoVIP: true,
    lecturaAlmaBienvenida: false
  },
  'circulo-semestral': {
    nombre: 'Semestral',
    duracionDias: 180,
    tiradas: 2,
    susurros: 1,
    runas: 20,
    treboles: 6,
    descuentoTienda: 5,
    descuentoAnticipado: 10,
    horasAnticipado: 48,
    titoVIP: true,
    lecturaAlmaBienvenida: false
  },
  'circulo-anual': {
    nombre: 'Anual',
    duracionDias: 365,
    tiradas: 3,
    susurros: 2,
    runas: 25,
    treboles: 10,
    descuentoTienda: 10,
    descuentoAnticipado: 10,
    horasAnticipado: 48,
    titoVIP: true,
    lecturaAlmaBienvenida: true
  }
};

// Paquetes de runas
const PAQUETES_RUNAS = {
  'runas-chispa': 15,
  'runas-destello': 30,
  'runas-fulgor': 50,
  'runas-resplandor': 100
};

// Categorías de guardianes
const CATEGORIAS_GUARDIAN = ['proteccion', 'amor', 'dinero-abundancia-negocios', 'salud'];

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const order = req.body;
    
    if (!order || !order.id) {
      return res.status(400).json({ error: 'Invalid order data' });
    }

    const orderId = order.id.toString();
    const email = order.billing?.email?.toLowerCase();
    const nombre = order.billing?.first_name || 'Elegido/a';
    const items = order.line_items || [];

    if (!email) {
      return res.status(400).json({ error: 'No email in order' });
    }

    console.log(`[WEBHOOK] Procesando orden ${orderId} para ${email}`);

    // Obtener o crear elegido
    let elegido = await kv.get(`elegido:${email}`);
    const esNuevo = !elegido;

    if (esNuevo) {
      // Crear nuevo elegido
      const token = generarToken();
      elegido = {
        email,
        nombre,
        token,
        genero: null,
        totalCompras: 0,
        treboles: 0,
        runas: 0,
        tiradaGratisUsada: false,
        nivel: 1,
        tituloNivel: '✨ Elegida',
        cupones: [],
        guardianes: [],
        cristales: [],
        accesorios: [],
        estudios: [],
        lecturas: [],
        canjes: [],
        ordenes: [],
        membresia: null,
        createdAt: new Date().toISOString(),
        ultimaCompra: null,
        sinergiaGenerada: false
      };
      
      // Guardar mapeo token -> email
      await kv.set(`token:${token}`, email);
    }

    // Procesar cada item de la orden
    let tipoCompra = [];
    let totalOrden = parseFloat(order.total) || 0;

    for (const item of items) {
      const sku = item.sku?.toLowerCase() || '';
      const categorias = item.categories?.map(c => c.slug) || [];
      const productId = item.product_id?.toString();
      
      // ═══ MEMBRESÍA CÍRCULO ═══
      if (categorias.includes('circulo') || PLANES_CIRCULO[sku]) {
        const plan = PLANES_CIRCULO[sku];
        if (plan) {
          await procesarMembresia(elegido, sku, plan);
          tipoCompra.push('membresia');
        }
      }
      // ═══ RUNAS ═══
      else if (categorias.includes('monedas') || PAQUETES_RUNAS[sku]) {
        const cantidadRunas = PAQUETES_RUNAS[sku];
        if (cantidadRunas) {
          elegido.runas = (elegido.runas || 0) + cantidadRunas;
          tipoCompra.push('runas');
          console.log(`[WEBHOOK] +${cantidadRunas} runas para ${email}`);
        }
      }
      // ═══ GUARDIÁN ═══
      else if (categorias.some(c => CATEGORIAS_GUARDIAN.includes(c))) {
        const guardian = {
          id: productId,
          nombre: item.name,
          tipo: 'guardian',
          categorias: categorias.filter(c => CATEGORIAS_GUARDIAN.includes(c)),
          precio: parseFloat(item.price) || 0,
          imagen: item.image?.src || null,
          fechaCompra: new Date().toISOString(),
          guiaGenerada: false,
          guiaId: null,
          guiaContent: null
        };
        
        elegido.guardianes = elegido.guardianes || [];
        elegido.guardianes.push(guardian);
        tipoCompra.push('guardian');
        console.log(`[WEBHOOK] Nuevo guardián: ${item.name} para ${email}`);
      }
    }

    // Actualizar totales y tréboles
    elegido.totalCompras = (elegido.totalCompras || 0) + totalOrden;
    const nuevosTreboles = Math.floor(totalOrden / 10);
    elegido.treboles = (elegido.treboles || 0) + nuevosTreboles;
    elegido.ultimaCompra = new Date().toISOString();
    elegido.ordenes = elegido.ordenes || [];
    elegido.ordenes.push(orderId);

    // Verificar subida de nivel
    const nivelAnterior = elegido.nivel;
    actualizarNivel(elegido);

    // Guardar elegido actualizado
    await kv.set(`elegido:${email}`, elegido);
    await kv.set(`orden-elegido:${orderId}`, email);

    // ═══ ENVIAR EMAILS SEGÚN TIPO DE COMPRA ═══
    
    if (tipoCompra.includes('membresia')) {
      await enviarEmailBienvenidaCirculo(elegido);
    }
    
    if (tipoCompra.includes('runas')) {
      await enviarEmailRunasAcreditadas(elegido);
    }
    
    if (tipoCompra.includes('guardian')) {
      // Agregar a pendientes para generar guía
      await agregarAPendientes(orderId, email);
      await enviarEmailGraciasCompra(elegido);
    }

    // Email de subida de nivel
    if (elegido.nivel > nivelAnterior) {
      await enviarEmailSubioNivel(elegido);
    }

    console.log(`[WEBHOOK] Orden ${orderId} procesada: ${tipoCompra.join(', ')}`);
    
    return res.status(200).json({ 
      success: true, 
      tipos: tipoCompra,
      email 
    });

  } catch (error) {
    console.error('[WEBHOOK] Error:', error);
    return res.status(500).json({ error: error.message });
  }
}

// ═══════════════════════════════════════════════════════════════
// FUNCIONES AUXILIARES
// ═══════════════════════════════════════════════════════════════

function generarToken() {
  const chars = 'abcdef0123456789';
  let token = '';
  for (let i = 0; i < 64; i++) {
    token += chars[Math.floor(Math.random() * chars.length)];
  }
  return token;
}

async function procesarMembresia(elegido, sku, plan) {
  const ahora = new Date();
  const vencimiento = new Date(ahora);
  vencimiento.setDate(vencimiento.getDate() + plan.duracionDias);
  
  const mesActual = `${ahora.getFullYear()}-${String(ahora.getMonth() + 1).padStart(2, '0')}`;
  
  elegido.membresia = {
    activa: true,
    plan: sku.replace('circulo-', ''),
    planNombre: plan.nombre,
    fechaInicio: ahora.toISOString(),
    fechaVencimiento: vencimiento.toISOString(),
    descuentoTienda: plan.descuentoTienda,
    descuentoAnticipado: plan.descuentoAnticipado,
    horasAnticipado: plan.horasAnticipado,
    titoVIP: plan.titoVIP,
    lecturasGratis: {
      tiradas: plan.tiradas,
      susurros: plan.susurros,
      mesActual
    },
    lecturaAlmaBienvenida: plan.lecturaAlmaBienvenida,
    lecturaAlmaGenerada: false,
    lecturaAlmaId: null
  };
  
  // Acreditar runas y tréboles del mes
  elegido.runas = (elegido.runas || 0) + plan.runas;
  elegido.treboles = (elegido.treboles || 0) + plan.treboles;
  
  console.log(`[WEBHOOK] Membresía ${plan.nombre} activada para ${elegido.email}`);
  console.log(`[WEBHOOK] +${plan.runas} runas, +${plan.treboles} tréboles acreditados`);
  
  // Si es anual, marcar para generar Lectura del Alma de bienvenida
  if (plan.lecturaAlmaBienvenida) {
    console.log(`[WEBHOOK] Pendiente generar Lectura del Alma de bienvenida`);
    // La generación se hace en otro proceso para no bloquear
  }
}

function actualizarNivel(elegido) {
  const total = elegido.totalCompras || 0;
  
  if (total >= 1200) {
    elegido.nivel = 5;
    elegido.tituloNivel = '👑 Maestra del Círculo';
  } else if (total >= 800) {
    elegido.nivel = 4;
    elegido.tituloNivel = '💎 Portadora de Luz';
  } else if (total >= 500) {
    elegido.nivel = 3;
    elegido.tituloNivel = '🌙 Custodia del Clan';
  } else if (total >= 300) {
    elegido.nivel = 2;
    elegido.tituloNivel = '🌿 Guardiana';
  } else {
    elegido.nivel = 1;
    elegido.tituloNivel = '✨ Elegida';
  }
}

async function agregarAPendientes(orderId, email) {
  const pendientes = await kv.get('pending_orders') || [];
  if (!pendientes.includes(orderId)) {
    pendientes.push(orderId);
    await kv.set('pending_orders', pendientes);
  }
  await kv.set(`pending:${orderId}`, {
    email,
    createdAt: new Date().toISOString(),
    status: 'pending'
  });
}

// ═══════════════════════════════════════════════════════════════
// EMAILS
// ═══════════════════════════════════════════════════════════════

async function enviarEmailBienvenidaCirculo(elegido) {
  const plan = elegido.membresia;
  const portalUrl = `https://duendes-vercel.vercel.app/mi-magia?token=${elegido.token}`;
  
  try {
    await resend.emails.send({
      from: 'Duendes del Uruguay <magia@duendesdeluruguay.com>',
      to: elegido.email,
      subject: `✦ Bienvenida al Círculo de Duendes, ${elegido.nombre}`,
      html: `
        <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; color: #f5f5f5; padding: 40px;">
          <h1 style="color: #d4af37; font-size: 28px; text-align: center;">✦ Bienvenida al Círculo ✦</h1>
          
          <p style="font-size: 18px; line-height: 1.8;">
            ${elegido.nombre},
          </p>
          
          <p style="font-size: 16px; line-height: 1.8;">
            Acabás de entrar al santuario secreto. A partir de ahora, tenés acceso a contenido exclusivo, 
            lecturas gratis cada mes, y privilegios que solo los miembros del Círculo conocen.
          </p>
          
          <div style="background: #1a1a1a; border: 1px solid #d4af37; border-radius: 10px; padding: 25px; margin: 30px 0;">
            <h3 style="color: #d4af37; margin-top: 0;">Tu Plan: ${plan.planNombre}</h3>
            <ul style="list-style: none; padding: 0; line-height: 2;">
              <li>✦ Contenido semanal exclusivo</li>
              <li>✦ ${plan.lecturasGratis.tiradas} tirada${plan.lecturasGratis.tiradas > 1 ? 's' : ''} de runas gratis/mes</li>
              ${plan.lecturasGratis.susurros > 0 ? `<li>✦ ${plan.lecturasGratis.susurros} susurro${plan.lecturasGratis.susurros > 1 ? 's' : ''} gratis/mes</li>` : ''}
              <li>✦ Acceso anticipado ${plan.horasAnticipado}h a nuevos guardianes</li>
              ${plan.descuentoTienda > 0 ? `<li>✦ ${plan.descuentoTienda}% de descuento en toda la tienda</li>` : ''}
              ${plan.lecturaAlmaBienvenida ? '<li>🎁 Lectura del Alma de bienvenida (en camino)</li>' : ''}
            </ul>
          </div>
          
          <div style="text-align: center; margin: 40px 0;">
            <a href="${portalUrl}" style="display: inline-block; background: #d4af37; color: #0a0a0a; padding: 18px 40px; text-decoration: none; font-weight: bold; border-radius: 50px; font-size: 16px;">
              Acceder a Mi Magia ✦
            </a>
          </div>
          
          <p style="font-size: 14px; color: #888; text-align: center;">
            Guardá este email. Tu acceso es de por vida mientras tu membresía esté activa.
          </p>
          
          <p style="font-size: 16px; line-height: 1.8; margin-top: 40px;">
            Con cariño desde Piriápolis,<br>
            <strong style="color: #d4af37;">Gabriel, Thibisay y el equipo ✨</strong>
          </p>
        </div>
      `
    });
    console.log(`[EMAIL] Bienvenida Círculo enviado a ${elegido.email}`);
  } catch (error) {
    console.error(`[EMAIL] Error enviando bienvenida Círculo:`, error);
  }
}

async function enviarEmailRunasAcreditadas(elegido) {
  const portalUrl = `https://duendes-vercel.vercel.app/mi-magia?token=${elegido.token}`;
  
  try {
    await resend.emails.send({
      from: 'Duendes del Uruguay <magia@duendesdeluruguay.com>',
      to: elegido.email,
      subject: `🔮 Tus runas ya están en tu portal`,
      html: `
        <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; color: #f5f5f5; padding: 40px;">
          <h1 style="color: #d4af37; font-size: 28px; text-align: center;">🔮 Runas Acreditadas</h1>
          
          <p style="font-size: 18px; line-height: 1.8;">
            ${elegido.nombre},
          </p>
          
          <p style="font-size: 16px; line-height: 1.8;">
            Tus Runas de Poder ya están disponibles en tu portal.
          </p>
          
          <div style="background: #1a1a1a; border: 1px solid #d4af37; border-radius: 10px; padding: 25px; margin: 30px 0; text-align: center;">
            <p style="font-size: 48px; margin: 0; color: #d4af37;">ᚱ ${elegido.runas}</p>
            <p style="color: #888; margin: 10px 0 0 0;">Runas de Poder disponibles</p>
          </div>
          
          <p style="font-size: 16px; line-height: 1.8;">
            Ahora podés solicitar experiencias mágicas: Tirada de Runas, Susurro del Guardián, 
            Lectura del Alma, y mucho más.
          </p>
          
          <div style="text-align: center; margin: 40px 0;">
            <a href="${portalUrl}" style="display: inline-block; background: #d4af37; color: #0a0a0a; padding: 18px 40px; text-decoration: none; font-weight: bold; border-radius: 50px; font-size: 16px;">
              Ir a Experiencias ✦
            </a>
          </div>
          
          <p style="font-size: 16px; line-height: 1.8;">
            La magia te espera.<br>
            <strong style="color: #d4af37;">Gabriel, Thibisay y el equipo</strong>
          </p>
        </div>
      `
    });
    console.log(`[EMAIL] Runas acreditadas enviado a ${elegido.email}`);
  } catch (error) {
    console.error(`[EMAIL] Error enviando runas acreditadas:`, error);
  }
}

async function enviarEmailGraciasCompra(elegido) {
  try {
    await resend.emails.send({
      from: 'Duendes del Uruguay <magia@duendesdeluruguay.com>',
      to: elegido.email,
      subject: `🌿 Gracias por tu compra, ${elegido.nombre}`,
      html: `
        <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; color: #f5f5f5; padding: 40px;">
          <p style="font-size: 18px; line-height: 1.8;">
            Hola ${elegido.nombre},
          </p>
          
          <p style="font-size: 16px; line-height: 1.8;">
            Tu guardián ya sabe que va camino a tu hogar.
          </p>
          
          <p style="font-size: 16px; line-height: 1.8;">
            En este momento, Gabriel, Thibisay y el equipo estamos preparando todo con cuidado. 
            Cada pieza es única, y la tuya está siendo envuelta con la misma intención con la que fue creada.
          </p>
          
          <p style="font-size: 16px; line-height: 1.8;">
            Mientras tanto, estamos canalizando la guía personalizada de tu guardián. 
            Es un mensaje único, solo para vos, que estará esperándote en tu portal "Mi Magia".
          </p>
          
          <p style="font-size: 16px; line-height: 1.8;">
            <strong style="color: #d4af37;">En las próximas horas vas a recibir otro email con el acceso.</strong>
          </p>
          
          <p style="font-size: 14px; color: #888;">
            Guardá este email. Tu portal es de por vida.
          </p>
          
          <p style="font-size: 16px; line-height: 1.8; margin-top: 40px;">
            Con cariño desde Piriápolis,<br>
            <strong style="color: #d4af37;">Gabriel, Thibisay y el equipo ✨</strong>
          </p>
        </div>
      `
    });
    console.log(`[EMAIL] Gracias compra enviado a ${elegido.email}`);
  } catch (error) {
    console.error(`[EMAIL] Error enviando gracias compra:`, error);
  }
}

async function enviarEmailSubioNivel(elegido) {
  const portalUrl = `https://duendes-vercel.vercel.app/mi-magia?token=${elegido.token}`;
  
  try {
    await resend.emails.send({
      from: 'Duendes del Uruguay <magia@duendesdeluruguay.com>',
      to: elegido.email,
      subject: `🌙 Ascendiste en el Círculo, ${elegido.nombre}`,
      html: `
        <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; color: #f5f5f5; padding: 40px;">
          <h1 style="color: #d4af37; font-size: 28px; text-align: center;">${elegido.tituloNivel}</h1>
          
          <p style="font-size: 18px; line-height: 1.8;">
            ${elegido.nombre},
          </p>
          
          <p style="font-size: 16px; line-height: 1.8;">
            Algo mágico acaba de pasar.
          </p>
          
          <p style="font-size: 16px; line-height: 1.8;">
            Has ascendido a <strong style="color: #d4af37;">${elegido.tituloNivel}</strong> en el Círculo de las Elegidas.
          </p>
          
          <p style="font-size: 16px; line-height: 1.8;">
            Esto significa que tu pueblo mágico está creciendo, tu conexión se profundiza, 
            y el universo reconoce tu compromiso con la magia.
          </p>
          
          <div style="text-align: center; margin: 40px 0;">
            <a href="${portalUrl}" style="display: inline-block; background: #d4af37; color: #0a0a0a; padding: 18px 40px; text-decoration: none; font-weight: bold; border-radius: 50px; font-size: 16px;">
              Ver mi nuevo nivel ✦
            </a>
          </div>
          
          <p style="font-size: 16px; line-height: 1.8;">
            Tu clan de guardianes celebra contigo.<br>
            <strong style="color: #d4af37;">Gabriel, Thibisay y el equipo</strong>
          </p>
        </div>
      `
    });
    console.log(`[EMAIL] Subió nivel enviado a ${elegido.email}`);
  } catch (error) {
    console.error(`[EMAIL] Error enviando subió nivel:`, error);
  }
}
