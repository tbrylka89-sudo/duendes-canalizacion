/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * TITO 3.0 - EJECUTOR DE TOOLS
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Este archivo ejecuta las herramientas cuando Claude las llama.
 * Cada función devuelve el resultado que se envía de vuelta a Claude.
 */

import { kv } from '@vercel/kv';
import {
  obtenerProductosWoo,
  buscarPedido as buscarPedidoWoo,
  formatearPedido,
  recomendarGuardianes,
  FAQ,
  PRECIOS_URUGUAY
} from './conocimiento';

const WP_URL = process.env.WORDPRESS_URL || 'https://duendesdeluruguay.com';

function getWooAuth() {
  return Buffer.from(`${process.env.WC_CONSUMER_KEY}:${process.env.WC_CONSUMER_SECRET}`).toString('base64');
}

// ═══════════════════════════════════════════════════════════════
// EJECUTOR PRINCIPAL
// ═══════════════════════════════════════════════════════════════

/**
 * Ejecuta una tool y devuelve el resultado
 * @param {string} toolName - Nombre de la tool
 * @param {object} input - Parámetros de entrada
 * @param {object} context - Contexto (subscriberId, esAdmin, etc)
 */
export async function ejecutarTool(toolName, input, context = {}) {
  const { subscriberId, esAdmin = false } = context;

  // Verificar permisos para tools admin
  if (toolName.startsWith('admin_') && !esAdmin) {
    return {
      success: false,
      error: 'No tenés permisos para esta acción'
    };
  }

  try {
    switch (toolName) {
      // ─────────────────────────────────────────────────────────────
      // PRODUCTOS
      // ─────────────────────────────────────────────────────────────
      case 'mostrar_productos':
        return await mostrarProductos(input);

      case 'buscar_producto':
        return await buscarProducto(input);

      // ─────────────────────────────────────────────────────────────
      // PEDIDOS
      // ─────────────────────────────────────────────────────────────
      case 'buscar_pedido':
        return await buscarPedido(input);

      // ─────────────────────────────────────────────────────────────
      // PRECIOS
      // ─────────────────────────────────────────────────────────────
      case 'calcular_precio':
        return calcularPrecio(input);

      // ─────────────────────────────────────────────────────────────
      // MEMORIA
      // ─────────────────────────────────────────────────────────────
      case 'guardar_info_cliente':
        return await guardarInfoCliente(input, subscriberId);

      case 'obtener_info_cliente':
        return await obtenerInfoCliente(subscriberId);

      // ─────────────────────────────────────────────────────────────
      // GUIAR COMPRA
      // ─────────────────────────────────────────────────────────────
      case 'guiar_compra':
        return await guiarCompra(input, context);

      case 'info_envios':
        return infoEnvios(input);

      case 'info_mi_magia':
        return infoMiMagia();

      // ─────────────────────────────────────────────────────────────
      // FAQ
      // ─────────────────────────────────────────────────────────────
      case 'consultar_faq':
        return consultarFaq(input);

      // ─────────────────────────────────────────────────────────────
      // ADMIN
      // ─────────────────────────────────────────────────────────────
      case 'admin_buscar_cliente':
        return await adminBuscarCliente(input);

      case 'admin_dar_regalo':
        return await adminDarRegalo(input);

      case 'admin_gestionar_circulo':
        return await adminGestionarCirculo(input);

      case 'admin_ver_estadisticas':
        return await adminVerEstadisticas(input);

      case 'admin_ver_pedidos':
        return await adminVerPedidos(input);

      case 'admin_enviar_email':
        return await adminEnviarEmail(input);

      case 'admin_sincronizar_woo':
        return await adminSincronizarWoo();

      default:
        return {
          success: false,
          error: `Tool "${toolName}" no implementada`
        };
    }
  } catch (error) {
    console.error(`[Tool ${toolName}] Error:`, error);
    return {
      success: false,
      error: error.message
    };
  }
}

// ═══════════════════════════════════════════════════════════════
// IMPLEMENTACIÓN DE TOOLS - PRODUCTOS
// ═══════════════════════════════════════════════════════════════

async function mostrarProductos({ necesidad, cantidad = 3, tipo }) {
  try {
    const productos = await obtenerProductosWoo();

    if (!productos || productos.length === 0) {
      return {
        success: false,
        mensaje: 'No pude cargar los productos ahora. Intentá de nuevo en un momento.'
      };
    }

    let filtrados = productos.filter(p => p.disponible);

    // Filtrar por necesidad
    if (necesidad) {
      filtrados = recomendarGuardianes(necesidad, filtrados, { limite: cantidad * 2 });
    }

    // Filtrar por tipo
    if (tipo) {
      const tipoLower = tipo.toLowerCase();
      filtrados = filtrados.filter(p =>
        (p.nombre || '').toLowerCase().includes(tipoLower) ||
        (p.categoria || '').toLowerCase().includes(tipoLower) ||
        (p.descripcion || '').toLowerCase().includes(tipoLower)
      );
    }

    // Limitar cantidad
    const seleccionados = filtrados.slice(0, Math.min(cantidad, 6));

    if (seleccionados.length === 0) {
      return {
        success: true,
        mensaje: 'No encontré guardianes con esas características ahora. ¿Buscás algo diferente?',
        productos: []
      };
    }

    return {
      success: true,
      productos: seleccionados.map(p => ({
        id: p.id,
        nombre: p.nombre,
        precio_usd: p.precio,
        imagen: p.imagen,
        url: p.url || `https://duendesdeluruguay.com/?p=${p.id}`,
        categoria: p.categoria,
        enOferta: p.enOferta,
        descripcion: p.descripcion?.substring(0, 150)
      })),
      total: seleccionados.length
    };
  } catch (error) {
    return {
      success: false,
      error: 'Error cargando productos: ' + error.message
    };
  }
}

async function buscarProducto({ nombre }) {
  try {
    const productos = await obtenerProductosWoo();
    const nombreLower = nombre.toLowerCase();

    const encontrado = productos.find(p =>
      (p.nombre || '').toLowerCase().includes(nombreLower)
    );

    if (!encontrado) {
      return {
        success: false,
        mensaje: `No encontré un guardián llamado "${nombre}". ¿Querés que te muestre los que hay?`
      };
    }

    return {
      success: true,
      producto: {
        id: encontrado.id,
        nombre: encontrado.nombre,
        precio_usd: encontrado.precio,
        imagen: encontrado.imagen,
        url: encontrado.url || `https://duendesdeluruguay.com/?p=${encontrado.id}`,
        categoria: encontrado.categoria,
        descripcion: encontrado.descripcion,
        disponible: encontrado.disponible,
        enOferta: encontrado.enOferta
      }
    };
  } catch (error) {
    return {
      success: false,
      error: 'Error buscando producto: ' + error.message
    };
  }
}

// ═══════════════════════════════════════════════════════════════
// IMPLEMENTACIÓN DE TOOLS - PEDIDOS
// ═══════════════════════════════════════════════════════════════

async function buscarPedido({ identificador }) {
  try {
    const pedido = await buscarPedidoWoo(identificador);

    if (!pedido) {
      return {
        success: false,
        mensaje: `No encontré ningún pedido con "${identificador}". ¿Podés darme el número de pedido o el email que usaste?`
      };
    }

    const info = Array.isArray(pedido) ? formatearPedido(pedido[0]) : formatearPedido(pedido);

    return {
      success: true,
      pedido: {
        numero: info.id,
        estado: info.estado,
        cliente: info.cliente,
        productos: info.productos,
        total: info.total,
        fecha: info.fecha,
        tracking: info.tracking || null
      }
    };
  } catch (error) {
    return {
      success: false,
      error: 'Error buscando pedido: ' + error.message
    };
  }
}

// ═══════════════════════════════════════════════════════════════
// IMPLEMENTACIÓN DE TOOLS - PRECIOS
// ═══════════════════════════════════════════════════════════════

function calcularPrecio({ precio_usd, pais }) {
  // Tasas aproximadas - Actualizado Enero 2026
  const tasas = {
    'UY': { moneda: 'pesos uruguayos', simbolo: '$', tasa: 45, formato: 'UYU' },
    'AR': { moneda: 'pesos argentinos', simbolo: '$', tasa: 1250, formato: 'ARS' },
    'MX': { moneda: 'pesos mexicanos', simbolo: '$', tasa: 21, formato: 'MXN' },
    'CO': { moneda: 'pesos colombianos', simbolo: '$', tasa: 4500, formato: 'COP' },
    'CL': { moneda: 'pesos chilenos', simbolo: '$', tasa: 1020, formato: 'CLP' },
    'PE': { moneda: 'soles', simbolo: 'S/', tasa: 3.85, formato: 'PEN' },
    'BR': { moneda: 'reales', simbolo: 'R$', tasa: 6.4, formato: 'BRL' },
    'ES': { moneda: 'euros', simbolo: '€', tasa: 0.96, formato: 'EUR' },
    'US': { moneda: 'dólares', simbolo: '$', tasa: 1, formato: 'USD' },
    'EC': { moneda: 'dólares', simbolo: '$', tasa: 1, formato: 'USD' },
    'PA': { moneda: 'dólares', simbolo: '$', tasa: 1, formato: 'USD' }
  };

  const paisData = tasas[pais] || tasas['US'];

  // Uruguay: precios fijos en pesos
  if (pais === 'UY') {
    // Buscar en la tabla de precios de Uruguay
    const precioUY = PRECIOS_URUGUAY.convertir(precio_usd);
    return {
      success: true,
      precio_original_usd: precio_usd,
      precio_local: precioUY,
      moneda: 'pesos uruguayos',
      formato: `$${precioUY.toLocaleString()} pesos uruguayos`,
      solo_mostrar: `$${precioUY.toLocaleString()}`
    };
  }

  // USA y dolarizados: solo USD
  if (['US', 'EC', 'PA'].includes(pais)) {
    return {
      success: true,
      precio_original_usd: precio_usd,
      precio_local: precio_usd,
      moneda: 'dólares',
      formato: `$${precio_usd} USD`,
      solo_mostrar: `$${precio_usd} USD`
    };
  }

  // Otros países: USD + aproximado local
  const precioLocal = Math.round(precio_usd * paisData.tasa);

  return {
    success: true,
    precio_original_usd: precio_usd,
    precio_local: precioLocal,
    moneda: paisData.moneda,
    formato: `$${precio_usd} USD (aprox. ${paisData.simbolo}${precioLocal.toLocaleString()} ${paisData.moneda})`,
    solo_mostrar: `$${precio_usd} USD`
  };
}

// ═══════════════════════════════════════════════════════════════
// IMPLEMENTACIÓN DE TOOLS - MEMORIA
// ═══════════════════════════════════════════════════════════════

async function guardarInfoCliente({ campo, valor }, subscriberId) {
  if (!subscriberId) {
    return { success: false, error: 'No hay ID de cliente' };
  }

  try {
    const key = `tito:cliente:${subscriberId}`;
    const existente = await kv.get(key) || {};

    existente[campo] = valor;
    existente.ultimaActualizacion = new Date().toISOString();

    await kv.set(key, existente, { ex: 30 * 24 * 60 * 60 }); // 30 días

    return {
      success: true,
      mensaje: `Guardé: ${campo} = ${valor}`
    };
  } catch (error) {
    return {
      success: false,
      error: 'Error guardando info: ' + error.message
    };
  }
}

async function obtenerInfoCliente(subscriberId) {
  if (!subscriberId) {
    return { success: true, info: {} };
  }

  try {
    const key = `tito:cliente:${subscriberId}`;
    const info = await kv.get(key) || {};

    return {
      success: true,
      info
    };
  } catch (error) {
    return {
      success: true,
      info: {}
    };
  }
}

// ═══════════════════════════════════════════════════════════════
// IMPLEMENTACIÓN DE TOOLS - CIERRE/VENTA
// ═══════════════════════════════════════════════════════════════

async function guiarCompra({ producto_id, producto_url }, context) {
  // Tito NO da datos de pago, guía a la tienda
  // La compra se hace directamente en WooCommerce

  try {
    // Buscar el producto para obtener su URL
    const productos = await obtenerProductosWoo();
    const producto = productos.find(p => p.id == producto_id || p.id === producto_id);

    const urlProducto = producto?.url || `https://duendesdeluruguay.com/?p=${producto_id}`;
    const urlTienda = 'https://duendesdeluruguay.com/tienda/';

    return {
      success: true,
      mensaje: 'Guiar al cliente a la tienda para completar la compra',
      pasos: [
        `1. Entrá al link del guardián: ${urlProducto}`,
        '2. Hacé clic en "Agregar al carrito"',
        '3. Completá tus datos de envío',
        '4. Elegí el método de pago que prefieras',
        '5. ¡Listo! Tu guardián va a estar en camino'
      ],
      link_producto: urlProducto,
      link_tienda: urlTienda,
      link_whatsapp: 'https://wa.me/59898690629',
      nota: 'Si tenés alguna duda durante el proceso, escribinos al WhatsApp'
    };
  } catch (error) {
    return {
      success: true,
      mensaje: 'Guiar al cliente a la tienda',
      pasos: [
        '1. Entrá a la tienda: https://duendesdeluruguay.com/tienda/',
        '2. Buscá el guardián que te llamó',
        '3. Hacé clic en "Agregar al carrito"',
        '4. Completá tus datos y elegí el método de pago',
        '5. ¡Listo!'
      ],
      link_tienda: 'https://duendesdeluruguay.com/tienda/',
      link_whatsapp: 'https://wa.me/59898690629'
    };
  }
}

function infoEnvios({ pais }) {
  // Info de envíos según país
  const esUruguay = pais === 'UY';

  return {
    success: true,
    mensaje: 'Información de envíos',
    envio: esUruguay
      ? {
          metodo: 'DAC',
          tiempo: '3-7 días hábiles',
          cobertura: 'Todo Uruguay',
          tracking: 'Sí, te pasamos el número cuando despache'
        }
      : {
          metodo: 'DHL Express',
          tiempo: '5-10 días hábiles',
          cobertura: 'Todo el mundo',
          tracking: 'Sí, con seguimiento internacional completo'
        },
    nota: 'Los datos de envío se completan en la web durante el checkout',
    link_tienda: 'https://duendesdeluruguay.com/tienda/'
  };
}

// ═══════════════════════════════════════════════════════════════
// IMPLEMENTACIÓN DE TOOLS - MI MAGIA
// ═══════════════════════════════════════════════════════════════

function infoMiMagia() {
  return {
    success: true,
    seccion: 'Mi Magia',
    descripcion: 'Portal exclusivo para clientes que adoptaron un guardián',
    url: 'https://duendesdeluruguay.com/mi-magia/',

    comoAcceder: [
      '1. Escaneando el código QR que viene con tu guardián',
      '2. Entrando a duendesdeluruguay.com/mi-magia y usando tu código (formato DU2601-XXXXX)',
      '3. Verificás con el email de tu compra para acceder al contenido personalizado'
    ],

    contenidoExclusivo: {
      canalizacion: 'Mensaje personalizado de tu guardián, único para vos según lo que compartiste en el formulario',
      historia: 'Historia completa del guardián - de dónde viene, qué vivió, su personalidad',
      dones: 'Los dones especiales que trae y cómo trabaja',
      ritual: 'Ritual de bienvenida paso a paso para cuando llega a casa',
      cuidados: 'Cómo cuidarlo - dónde ubicarlo, limpieza energética, fechas especiales'
    },

    recanaLizacion: {
      descripcion: 'Si pasó tiempo o estás en un momento diferente, podés pedir una nueva canalización',
      precio_gratis: 'GRATIS si el guardián es de Duendes del Uruguay',
      precio_externo: '$7 USD si es un duende de otro lugar',
      tiempo: '24-48 horas después de solicitarla'
    },

    mensajeSugerido: `
Cuando adoptes a tu guardián, vas a tener acceso a una sección exclusiva llamada 'Mi Magia'.
Ahí vas a encontrar:
✨ Tu canalización personalizada - un mensaje único de tu guardián para vos
📜 Su historia completa
🎁 Sus dones especiales
🕯️ Un ritual de bienvenida
🌿 Cómo cuidarlo

Accedés escaneando el QR que viene con tu guardián o entrando a la web con tu código.`
  };
}

// ═══════════════════════════════════════════════════════════════
// IMPLEMENTACIÓN DE TOOLS - FAQ
// ═══════════════════════════════════════════════════════════════

function consultarFaq({ tema }) {
  const faqData = FAQ[tema];

  if (!faqData) {
    return {
      success: false,
      error: `No tengo información sobre "${tema}"`
    };
  }

  return {
    success: true,
    tema,
    info: faqData
  };
}

// ═══════════════════════════════════════════════════════════════
// IMPLEMENTACIÓN DE TOOLS - ADMIN
// ═══════════════════════════════════════════════════════════════

async function adminBuscarCliente({ query }) {
  try {
    const userKeys = await kv.keys('user:*');
    const elegidoKeys = await kv.keys('elegido:*');
    const allKeys = [...new Set([...userKeys, ...elegidoKeys])];
    const resultados = [];

    const queryLower = query.toLowerCase();

    for (const k of allKeys) {
      const u = await kv.get(k);
      if (!u) continue;

      const email = (u.email || '').toLowerCase();
      const nombre = (u.nombre || u.nombrePreferido || '').toLowerCase();

      if (email.includes(queryLower) || nombre.includes(queryLower)) {
        resultados.push({
          email: u.email,
          nombre: u.nombre || u.nombrePreferido || 'Sin nombre',
          runas: u.runas || 0,
          treboles: u.treboles || 0,
          esCirculo: u.esCirculo || false,
          gastado: u.gastado || u.totalCompras || 0,
          guardianes: u.guardianes?.length || 0
        });
      }
    }

    return {
      success: true,
      total: resultados.length,
      clientes: resultados.slice(0, 10)
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

async function adminDarRegalo({ email, tipo, cantidad, mensaje }) {
  try {
    const emailNorm = email.toLowerCase();
    let userKey = `user:${emailNorm}`;
    let user = await kv.get(userKey);

    if (!user) {
      userKey = `elegido:${emailNorm}`;
      user = await kv.get(userKey);
    }

    if (!user) {
      return { success: false, error: `No encontré a ${email}` };
    }

    if (tipo === 'runas') {
      user.runas = (user.runas || 0) + cantidad;
    } else if (tipo === 'treboles') {
      user.treboles = (user.treboles || 0) + cantidad;
    }

    await kv.set(userKey, user);

    return {
      success: true,
      mensaje: `Le di ${cantidad} ${tipo} a ${user.nombre || email}. Ahora tiene ${user[tipo]} ${tipo}.`
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

async function adminGestionarCirculo({ email, accion, dias }) {
  try {
    const emailNorm = email.toLowerCase();
    let circuloData = await kv.get(`circulo:${emailNorm}`) || { activo: false };
    const ahora = new Date();

    if (accion === 'activar') {
      circuloData.activo = true;
      circuloData.expira = new Date(ahora.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString();
    } else if (accion === 'desactivar') {
      circuloData.activo = false;
    } else if (accion === 'extender' && dias) {
      const fechaBase = circuloData.expira && new Date(circuloData.expira) > ahora
        ? new Date(circuloData.expira)
        : ahora;
      circuloData.expira = new Date(fechaBase.getTime() + dias * 24 * 60 * 60 * 1000).toISOString();
      circuloData.activo = true;
    }

    await kv.set(`circulo:${emailNorm}`, circuloData);

    // Actualizar también en el usuario
    let userKey = `user:${emailNorm}`;
    let user = await kv.get(userKey);
    if (!user) {
      userKey = `elegido:${emailNorm}`;
      user = await kv.get(userKey);
    }
    if (user) {
      user.esCirculo = circuloData.activo;
      user.circuloExpira = circuloData.expira;
      await kv.set(userKey, user);
    }

    return {
      success: true,
      mensaje: `Círculo ${accion === 'activar' ? 'activado' : accion === 'desactivar' ? 'desactivado' : 'extendido'} para ${email}`,
      expira: circuloData.expira
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

async function adminVerEstadisticas({ tipo = 'general' }) {
  try {
    const userKeys = await kv.keys('user:*');
    const elegidoKeys = await kv.keys('elegido:*');
    const circuloKeys = await kv.keys('circulo:*');
    const allKeys = [...new Set([...userKeys, ...elegidoKeys])];

    let totalClientes = allKeys.length;
    let totalRunas = 0;
    let totalTreboles = 0;
    let totalGastado = 0;
    let miembrosCirculo = 0;

    for (const k of allKeys.slice(0, 200)) {
      const u = await kv.get(k);
      if (u) {
        totalRunas += u.runas || 0;
        totalTreboles += u.treboles || 0;
        totalGastado += u.gastado || u.totalCompras || 0;
        if (u.esCirculo) miembrosCirculo++;
      }
    }

    return {
      success: true,
      estadisticas: {
        totalClientes,
        miembrosCirculo,
        totalRunas,
        totalTreboles,
        totalGastado
      }
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

async function adminVerPedidos({ estado = 'todos', limite = 10 }) {
  try {
    const estadoWoo = {
      'pendientes': 'on-hold',
      'procesando': 'processing',
      'completados': 'completed',
      'todos': 'any'
    }[estado] || 'any';

    const url = `${WP_URL}/wp-json/wc/v3/orders?per_page=${limite}${estadoWoo !== 'any' ? `&status=${estadoWoo}` : ''}`;

    const res = await fetch(url, {
      headers: { 'Authorization': `Basic ${getWooAuth()}` }
    });

    if (!res.ok) {
      return { success: false, error: 'Error conectando con WooCommerce' };
    }

    const pedidos = await res.json();

    return {
      success: true,
      pedidos: pedidos.map(p => ({
        id: p.id,
        estado: p.status,
        total: p.total,
        cliente: `${p.billing?.first_name} ${p.billing?.last_name}`,
        email: p.billing?.email,
        fecha: p.date_created
      }))
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

async function adminEnviarEmail({ email, asunto, mensaje }) {
  // Importar Resend dinámicamente para evitar errores si no está configurado
  try {
    const { Resend } = await import('resend');
    const resend = new Resend(process.env.RESEND_API_KEY);

    await resend.emails.send({
      from: 'Duendes del Uruguay <hola@duendesdeluruguay.com>',
      to: email,
      subject: asunto,
      html: `<div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;padding:30px;background:#FFFEF9;">${mensaje.replace(/\n/g, '<br>')}<p style="margin-top:40px;color:#888;">Con amor, Duendes del Uruguay</p></div>`
    });

    return {
      success: true,
      mensaje: `Email enviado a ${email}`
    };
  } catch (error) {
    return { success: false, error: 'Error enviando email: ' + error.message };
  }
}

async function adminSincronizarWoo() {
  try {
    const WOO_KEY = process.env.WC_CONSUMER_KEY;
    const WOO_SECRET = process.env.WC_CONSUMER_SECRET;

    if (!WOO_KEY || !WOO_SECRET) {
      return { success: false, error: 'Credenciales de WooCommerce no configuradas' };
    }

    const auth = Buffer.from(`${WOO_KEY}:${WOO_SECRET}`).toString('base64');

    let todosProductos = [];
    let page = 1;
    let hasMore = true;

    while (hasMore && page <= 5) {
      const response = await fetch(
        `${WP_URL}/wp-json/wc/v3/products?per_page=100&page=${page}`,
        { headers: { 'Authorization': `Basic ${auth}` } }
      );

      if (!response.ok) break;

      const productos = await response.json();
      if (productos.length === 0) {
        hasMore = false;
      } else {
        todosProductos = [...todosProductos, ...productos];
        page++;
      }
    }

    // Mapear y guardar
    const productosWoo = todosProductos.map(p => ({
      id: p.id,
      nombre: p.name,
      precio: parseFloat(p.price) || 0,
      stock: p.stock_quantity || 0,
      disponible: p.stock_status === 'instock',
      categoria: p.categories?.[0]?.name || 'Sin categoría',
      imagen: p.images?.[0]?.src || null,
      descripcion: (p.short_description || '').replace(/<[^>]*>/g, ''),
      url: p.permalink,
      enOferta: !!p.sale_price
    }));

    await kv.set('productos:catalogo', productosWoo);
    await kv.set('productos:ultima_sync', new Date().toISOString());

    return {
      success: true,
      mensaje: `Sincronizados ${productosWoo.length} productos`,
      total: productosWoo.length
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export default ejecutarTool;
