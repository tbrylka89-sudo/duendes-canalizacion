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
  FAQ
} from './conocimiento';
import { obtenerCotizaciones, PRECIOS_URUGUAY, convertirPrecio } from './cotizaciones';
import {
  recomendarGuardian,
  analizarNecesidades,
  buscarHistorialCliente,
  COMBOS_RECOMENDADOS
} from './recomendaciones';

const WP_URL = process.env.WORDPRESS_URL || 'https://duendesdeluruguay.com';

function getWooAuth() {
  return Buffer.from(`${process.env.WC_CONSUMER_KEY}:${process.env.WC_CONSUMER_SECRET}`).toString('base64');
}

// ═══════════════════════════════════════════════════════════════
// EJECUTOR PRINCIPAL
// ═══════════════════════════════════════════════════════════════

// Info de países para formateo de precios
const INFO_PAISES = {
  'UY': { moneda: 'pesos uruguayos', simbolo: '$', codigoMoneda: 'UYU', nombre: 'Uruguay' },
  'AR': { moneda: 'pesos argentinos', simbolo: '$', codigoMoneda: 'ARS', nombre: 'Argentina' },
  'MX': { moneda: 'pesos mexicanos', simbolo: '$', codigoMoneda: 'MXN', nombre: 'México' },
  'CO': { moneda: 'pesos colombianos', simbolo: '$', codigoMoneda: 'COP', nombre: 'Colombia' },
  'CL': { moneda: 'pesos chilenos', simbolo: '$', codigoMoneda: 'CLP', nombre: 'Chile' },
  'PE': { moneda: 'soles', simbolo: 'S/', codigoMoneda: 'PEN', nombre: 'Perú' },
  'BR': { moneda: 'reales', simbolo: 'R$', codigoMoneda: 'BRL', nombre: 'Brasil' },
  'ES': { moneda: 'euros', simbolo: '€', codigoMoneda: 'EUR', nombre: 'España' },
  'US': { moneda: 'dólares', simbolo: '$', codigoMoneda: 'USD', nombre: 'Estados Unidos' },
  'EC': { moneda: 'dólares', simbolo: '$', codigoMoneda: 'USD', nombre: 'Ecuador' },
  'PA': { moneda: 'dólares', simbolo: '$', codigoMoneda: 'USD', nombre: 'Panamá' }
};

/**
 * Ejecuta una tool y devuelve el resultado
 * @param {string} toolName - Nombre de la tool
 * @param {object} input - Parámetros de entrada
 * @param {object} context - Contexto (subscriberId, esAdmin, paisCliente, etc)
 */
export async function ejecutarTool(toolName, input, context = {}) {
  const { subscriberId, esAdmin = false, paisCliente = null } = context;

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
        return await mostrarProductos(input, paisCliente);

      case 'buscar_producto':
        return await buscarProducto(input);

      case 'obtener_guardian_completo':
        return await obtenerGuardianCompleto(input);

      case 'verificar_stock':
        return await verificarStock(input);

      case 'recomendar_guardian':
        return await ejecutarRecomendacion(input, context);

      // ─────────────────────────────────────────────────────────────
      // PEDIDOS
      // ─────────────────────────────────────────────────────────────
      case 'buscar_pedido':
        return await buscarPedido(input);

      // ─────────────────────────────────────────────────────────────
      // PRECIOS
      // ─────────────────────────────────────────────────────────────
      case 'calcular_precio':
        return await calcularPrecio(input);

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

async function mostrarProductos({ necesidad, cantidad = 3, tipo }, paisCliente = null) {
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

    // Si tenemos país del cliente, formatear precios en su moneda
    let cotizaciones = null;
    let infoPais = null;
    if (paisCliente && INFO_PAISES[paisCliente]) {
      infoPais = INFO_PAISES[paisCliente];
      // Solo obtener cotizaciones si no es Uruguay ni país dolarizado
      if (!['UY', 'US', 'EC', 'PA'].includes(paisCliente)) {
        cotizaciones = await obtenerCotizaciones();
      }
    }

    return {
      success: true,
      paisCliente: paisCliente,
      monedaCliente: infoPais?.moneda || 'dólares',
      productos: seleccionados.map(p => {
        const producto = {
          id: p.id,
          nombre: p.nombre,
          precio_usd: p.precio,
          precio_uyu: p.precioUYU, // Precio real en pesos uruguayos
          imagen: p.imagen,
          url: p.url || `https://duendesdeluruguay.com/?p=${p.id}`,
          categoria: p.categoria,
          enOferta: p.enOferta,
          descripcion: p.descripcion?.substring(0, 150)
        };

        // Agregar precio formateado según país
        if (paisCliente === 'UY') {
          // Uruguay: precio real en pesos
          producto.precio_mostrar = `$${p.precioUYU?.toLocaleString('es-UY') || p.precio * 43} pesos`;
        } else if (['US', 'EC', 'PA'].includes(paisCliente)) {
          // Países dolarizados: solo dólares
          producto.precio_mostrar = `$${p.precio} DÓLARES`;
        } else if (infoPais && cotizaciones) {
          // Otros países: dólares + aproximado en moneda local
          const tasa = cotizaciones[infoPais.codigoMoneda] || 1;
          const precioLocal = Math.round(p.precio * tasa);
          producto.precio_mostrar = `$${p.precio} DÓLARES (aprox. ${infoPais.simbolo}${precioLocal.toLocaleString('es')} ${infoPais.moneda})`;
        } else {
          // Sin país detectado: solo USD
          producto.precio_mostrar = `$${p.precio} USD`;
        }

        return producto;
      }),
      total: seleccionados.length,
      instruccion_formato: paisCliente
        ? `IMPORTANTE: Ya sabés que el cliente es de ${infoPais?.nombre || paisCliente}. Mostrá los precios usando el campo "precio_mostrar" de cada producto. NO preguntes el país.`
        : 'El país del cliente no está detectado. Después de mostrar productos, preguntá de qué país escribe para dar precios en su moneda.'
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

async function obtenerGuardianCompleto({ identificador }) {
  const productos = await obtenerProductosWoo();
  const idLower = identificador.toLowerCase();

  const guardian = productos.find(p =>
    p.nombre?.toLowerCase().includes(idLower) ||
    p.id?.toString() === identificador
  );

  if (!guardian) {
    return {
      success: false,
      mensaje: `No encontré un guardián llamado "${identificador}". ¿Querés que te muestre los disponibles?`
    };
  }

  return {
    success: true,
    guardian: {
      id: guardian.id,
      nombre: guardian.nombre,
      precio_usd: guardian.precio,
      precio_uyu: guardian.precioUYU,
      disponible: guardian.disponible,
      categoria: guardian.categorias?.join(', '),
      descripcion: guardian.descripcion,
      historia: guardian.historia_completa || guardian.descripcion,
      sincrodestino: guardian.sincrodestino,
      dones: guardian.dones,
      elemento: guardian.elemento,
      personalidad: guardian.personalidad_guardian,
      imagen: guardian.imagen,
      url: guardian.url,
      enOferta: guardian.enOferta
    },
    instruccion: "Usa esta información para hablar del guardián de forma personal y conectada. Menciona su historia, sus dones especiales, su sincrodestino si lo tiene."
  };
}

async function verificarStock({ producto_id, nombre_producto }) {
  try {
    let producto;

    if (producto_id) {
      // Consulta directa a WooCommerce por ID
      const url = `${WP_URL}/wp-json/wc/v3/products/${producto_id}`;
      const response = await fetch(url, {
        headers: { 'Authorization': `Basic ${getWooAuth()}` }
      });
      if (!response.ok) throw new Error('Producto no encontrado');
      producto = await response.json();
    } else if (nombre_producto) {
      // Buscar en caché por nombre
      const productos = await obtenerProductosWoo();
      const productoCache = productos.find(p =>
        p.nombre?.toLowerCase().includes(nombre_producto.toLowerCase())
      );
      if (!productoCache) {
        return { success: false, mensaje: `No encontré "${nombre_producto}"` };
      }
      // Si lo encontramos, hacer consulta fresca a WooCommerce
      const url = `${WP_URL}/wp-json/wc/v3/products/${productoCache.id}`;
      const response = await fetch(url, {
        headers: { 'Authorization': `Basic ${getWooAuth()}` }
      });
      producto = await response.json();
    } else {
      return { success: false, mensaje: 'Necesito el ID o nombre del producto' };
    }

    const disponible = producto.stock_status === 'instock';

    return {
      success: true,
      producto: producto.name,
      disponible: disponible,
      stock_status: producto.stock_status,
      cantidad: producto.stock_quantity,
      mensaje: disponible
        ? `✅ ${producto.name} está disponible y esperando encontrar su hogar.`
        : `❌ ${producto.name} ya encontró su hogar. Pero tengo otros guardianes que podrían resonar contigo.`
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// ═══════════════════════════════════════════════════════════════
// IMPLEMENTACIÓN DE TOOLS - RECOMENDACIÓN INTELIGENTE
// ═══════════════════════════════════════════════════════════════

async function ejecutarRecomendacion(input, context = {}) {
  const { mensaje, email, incluirCrossSell = true, incluirCombos = true, limite = 3 } = input;
  const { subscriberId, paisCliente, historial = [] } = context;

  try {
    // Obtener productos disponibles
    const productos = await obtenerProductosWoo();

    if (!productos || productos.length === 0) {
      return {
        success: false,
        mensaje: 'No pude cargar los productos ahora. Intentá de nuevo en un momento.'
      };
    }

    // Ejecutar el sistema de recomendación inteligente
    const resultado = await recomendarGuardian({
      mensaje,
      historial,
      productos: productos.filter(p => p.disponible),
      subscriberId,
      email,
      limite,
      incluirCrossSell,
      incluirCombos
    });

    // Obtener cotizaciones si tenemos país
    let cotizaciones = null;
    let infoPais = null;
    if (paisCliente && INFO_PAISES[paisCliente]) {
      infoPais = INFO_PAISES[paisCliente];
      if (!['UY', 'US', 'EC', 'PA'].includes(paisCliente)) {
        cotizaciones = await obtenerCotizaciones();
      }
    }

    // Formatear productos recomendados con precios
    const productosFormateados = resultado.recomendaciones.map(p => {
      const producto = {
        id: p.id,
        nombre: p.nombre,
        precio_usd: p.precio,
        precio_uyu: p.precioUYU,
        imagen: p.imagen,
        url: p.url || `https://duendesdeluruguay.com/?p=${p.id}`,
        categoria: p.categoria || p.categorias?.join(', '),
        tipo: p.tipo,
        compatibilidad: p.compatibilidad,
        descripcion: p.descripcion?.substring(0, 150),
        enOferta: p.enOferta
      };

      // Agregar precio formateado según país
      if (paisCliente === 'UY') {
        producto.precio_mostrar = `$${p.precioUYU?.toLocaleString('es-UY') || p.precio * 43} pesos`;
      } else if (['US', 'EC', 'PA'].includes(paisCliente)) {
        producto.precio_mostrar = `$${p.precio} DÓLARES`;
      } else if (infoPais && cotizaciones) {
        const tasa = cotizaciones[infoPais.codigoMoneda] || 1;
        const precioLocal = Math.round(p.precio * tasa);
        producto.precio_mostrar = `$${p.precio} DÓLARES (aprox. ${infoPais.simbolo}${precioLocal.toLocaleString('es')} ${infoPais.moneda})`;
      } else {
        producto.precio_mostrar = `$${p.precio} USD`;
      }

      return producto;
    });

    // Formatear cross-sell
    const crossSellFormateado = (resultado.crossSell || []).map(cs => ({
      guardian: {
        id: cs.guardian.id,
        nombre: cs.guardian.nombre,
        precio_usd: cs.guardian.precio,
        imagen: cs.guardian.imagen,
        url: cs.guardian.url,
        tipo: cs.guardian.tipo
      },
      razon: cs.razon
    }));

    // Formatear combos
    const combosFormateados = (resultado.combos || []).map(combo => ({
      nombre: combo.nombre,
      descripcion: combo.descripcion,
      beneficios: combo.beneficios,
      descuento: combo.descuento,
      productos: combo.productos?.map(p => ({
        nombre: p.nombre,
        precio_usd: p.precio
      })),
      precioTotal: combo.precioTotal
    }));

    return {
      success: true,
      // Info del cliente
      esClienteRepetido: resultado.esClienteRepetido,
      mensajeClienteRepetido: resultado.mensajeClienteRepetido,
      perfilDetectado: resultado.perfilCliente?.necesidadesOrdenadas?.[0]?.categoria || 'general',
      sentimientoDetectado: resultado.perfilCliente?.sentimiento,
      urgencia: resultado.perfilCliente?.urgencia,

      // Recomendaciones principales
      productos: productosFormateados,
      mensaje: resultado.mensaje,

      // Cross-sell y combos
      crossSell: crossSellFormateado,
      combos: combosFormateados,

      // Complementarios (si es cliente repetido)
      complementarios: (resultado.complementarios || []).map(c => ({
        guardian: {
          id: c.guardian?.id,
          nombre: c.guardian?.nombre,
          precio_usd: c.guardian?.precio
        },
        razon: c.razon
      })),

      // Instrucciones para Tito
      instruccionTito: resultado.instruccionTito,

      // Meta
      total: productosFormateados.length,
      paisCliente: paisCliente,
      monedaCliente: infoPais?.moneda || 'dólares'
    };

  } catch (error) {
    console.error('[Tool recomendar_guardian] Error:', error);
    return {
      success: false,
      error: 'Error generando recomendaciones: ' + error.message
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

async function calcularPrecio({ precio_usd, pais }) {
  // Usar el módulo de cotizaciones centralizado
  const resultado = await convertirPrecio(precio_usd, pais);

  return {
    success: true,
    precio_original_usd: precio_usd,
    precio_local: resultado.precioLocal,
    moneda: resultado.moneda,
    formato: resultado.formato,
    solo_mostrar: resultado.esFijo ? resultado.formato : `$${precio_usd} USD`,
    tasa_usada: resultado.tasa || null,
    actualizacion: resultado.actualizacion || null
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
    const urlTienda = 'https://duendesdeluruguay.com/shop/';

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
        '1. Entrá a la tienda: https://duendesdeluruguay.com/shop/',
        '2. Buscá el guardián que te llamó',
        '3. Hacé clic en "Agregar al carrito"',
        '4. Completá tus datos y elegí el método de pago',
        '5. ¡Listo!'
      ],
      link_tienda: 'https://duendesdeluruguay.com/shop/',
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
    link_tienda: 'https://duendesdeluruguay.com/shop/'
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
