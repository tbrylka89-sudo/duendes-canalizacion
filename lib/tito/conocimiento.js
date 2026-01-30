/**
 * TITO 2.0 - BASE DE CONOCIMIENTO
 * Sistema de conocimiento centralizado que se actualiza automáticamente
 */

// ═══════════════════════════════════════════════════════════════
// CACHE DE PRODUCTOS (se actualiza cada 5 minutos)
// ═══════════════════════════════════════════════════════════════

import { kv } from '@vercel/kv';

let cacheProductos = null;
let cacheProductosTime = 0;
const CACHE_DURACION = 5 * 60 * 1000; // 5 minutos

// Key para invalidación distribuida (Vercel KV)
const CACHE_INVALIDATION_KEY = 'tito:productos:invalidacion';

// ═══════════════════════════════════════════════════════════════
// INVALIDACION DE CACHE (llamado desde webhooks)
// ═══════════════════════════════════════════════════════════════

/**
 * Invalida el caché de productos cuando llega un webhook de WooCommerce
 * @param {string} motivo - Razón de la invalidación (para logs)
 * @param {number|null} productoId - ID del producto afectado (opcional)
 */
export async function invalidarCacheProductos(motivo = 'webhook', productoId = null) {
  // 1. Invalidar caché en memoria (esta instancia)
  cacheProductos = null;
  cacheProductosTime = 0;

  // 2. Marcar invalidación en KV (para otras instancias de Vercel)
  try {
    await kv.set(CACHE_INVALIDATION_KEY, {
      invalidadoEn: Date.now(),
      motivo,
      productoId
    }, { ex: 60 }); // Expira en 1 minuto

    console.log(`[TITO KB] Cache invalidado: ${motivo}${productoId ? ` (producto ${productoId})` : ''}`);
  } catch (e) {
    console.error('[TITO KB] Error marcando invalidación en KV:', e.message);
  }

  return { success: true, motivo, productoId };
}

/**
 * Verifica si el caché fue invalidado por otra instancia
 * @returns {boolean} true si hay que refrescar el caché
 */
async function verificarInvalidacionExterna() {
  try {
    const invalidacion = await kv.get(CACHE_INVALIDATION_KEY);
    if (invalidacion && invalidacion.invalidadoEn) {
      // Si la invalidación es más reciente que nuestro caché, invalidar
      if (invalidacion.invalidadoEn > cacheProductosTime) {
        console.log(`[TITO KB] Cache invalidado externamente: ${invalidacion.motivo}`);
        cacheProductos = null;
        cacheProductosTime = 0;
        return true;
      }
    }
  } catch (e) {
    // Silenciar errores de KV
  }
  return false;
}

export async function obtenerProductosWoo() {
  // Verificar si otra instancia invalidó el caché
  await verificarInvalidacionExterna();

  // Usar cache si está fresco
  if (cacheProductos && (Date.now() - cacheProductosTime) < CACHE_DURACION) {
    return cacheProductos;
  }

  try {
    const wpUrl = process.env.WORDPRESS_URL || 'https://duendesdeluruguay.com';
    const auth = Buffer.from(`${process.env.WC_CONSUMER_KEY}:${process.env.WC_CONSUMER_SECRET}`).toString('base64');

    // Paginar para obtener TODOS los productos
    let todosLosProductos = [];
    let page = 1;
    let hayMas = true;

    while (hayMas) {
      const response = await fetch(
        `${wpUrl}/wp-json/wc/v3/products?per_page=100&status=publish&page=${page}`,
        {
          headers: { 'Authorization': `Basic ${auth}` },
          next: { revalidate: 300 }
        }
      );

      if (!response.ok) throw new Error('Error WooCommerce');

      const productos = await response.json();

      if (productos.length === 0) {
        hayMas = false;
      } else {
        todosLosProductos = todosLosProductos.concat(productos);
        page++;
        // Seguridad: máximo 10 páginas (1000 productos)
        if (page > 10) hayMas = false;
      }
    }

    const productos = todosLosProductos;

    cacheProductos = productos
      .filter(p => p.images?.length > 0)
      .map(p => {
        // Obtener precio UYU del meta_data si existe
        const precioUSD = parseFloat(p.price) || 0;
        const metaPrecioUYU = p.meta_data?.find(m => m.key === '_duendes_precio_uyu');
        const precioUYU = metaPrecioUYU ? parseInt(metaPrecioUYU.value) : Math.round(precioUSD * 43);

        return {
          id: p.id,
          nombre: p.name,
          slug: p.slug,
          precio: precioUSD,
          precioUYU: precioUYU, // Precio real en pesos uruguayos
          precioRegular: parseFloat(p.regular_price) || 0,
          enOferta: p.on_sale,
          disponible: p.stock_status === 'instock',
          imagen: p.images[0]?.src,
          imagenes: p.images.map(i => i.src),
          url: p.permalink,
          categorias: p.categories?.map(c => c.name) || [],
          categoriaSlugs: p.categories?.map(c => c.slug) || [],
          descripcion: p.description?.replace(/<[^>]*>/g, ''),
          descripcionCorta: p.short_description?.replace(/<[^>]*>/g, '').substring(0, 200),
          // Meta datos custom del guardián
          historia_completa: p.meta_data?.find(m => m.key === '_duendes_historia')?.value || null,
          sincrodestino: p.meta_data?.find(m => m.key === '_duendes_sincrodestino')?.value || null,
          dones: p.meta_data?.find(m => m.key === '_duendes_dones')?.value || null,
          elemento: p.meta_data?.find(m => m.key === '_duendes_elemento')?.value || null,
          personalidad_guardian: p.meta_data?.find(m => m.key === '_duendes_personalidad')?.value || null,
          atributos: p.attributes?.reduce((acc, a) => {
            acc[a.name.toLowerCase()] = a.options;
            return acc;
          }, {}),
          // Extraer info útil para recomendaciones
          esProteccion: /protecci[oó]n|proteger|escudo/i.test(p.name + ' ' + (p.description || '')),
          esAbundancia: /abundancia|prosperidad|dinero|riqueza/i.test(p.name + ' ' + (p.description || '')),
          esAmor: /amor|coraz[oó]n|relaci[oó]n|pareja/i.test(p.name + ' ' + (p.description || '')),
          esSanacion: /sanaci[oó]n|salud|sanar|bienestar/i.test(p.name + ' ' + (p.description || '')),
          esPaz: /paz|calma|tranquilidad|armon[ií]a/i.test(p.name + ' ' + (p.description || '')),
          tamano: detectarTamano(p.name + ' ' + (p.description || '')),
          tipo: detectarTipo(p.name)
        };
      });

    cacheProductosTime = Date.now();
    console.log(`[TITO KB] Productos actualizados: ${cacheProductos.length}`);
    return cacheProductos;

  } catch (error) {
    console.error('[TITO KB] Error cargando productos:', error);
    return cacheProductos || [];
  }
}

function detectarTamano(texto) {
  if (/gigante|70|60|50\s*cm/i.test(texto)) return 'gigante';
  if (/grande|40|35|30\s*cm/i.test(texto)) return 'grande';
  if (/mediano|25|20\s*cm/i.test(texto)) return 'mediano';
  if (/mini|peque[ñn]o|10|15\s*cm/i.test(texto)) return 'mini';
  return 'mediano';
}

function detectarTipo(nombre) {
  const nombreLower = nombre.toLowerCase();
  if (/duende/i.test(nombreLower)) return 'duende';
  if (/elfo|elfa/i.test(nombreLower)) return 'elfo';
  if (/hada/i.test(nombreLower)) return 'hada';
  if (/mago|maga/i.test(nombreLower)) return 'mago';
  if (/bruja|brujo/i.test(nombreLower)) return 'bruja';
  if (/gnomo/i.test(nombreLower)) return 'gnomo';
  if (/drag[oó]n/i.test(nombreLower)) return 'dragon';
  return 'guardian';
}

// ═══════════════════════════════════════════════════════════════
// CONSULTAS WOOCOMMERCE - PEDIDOS Y CLIENTES
// ═══════════════════════════════════════════════════════════════

export async function buscarPedido(identificador) {
  try {
    const wpUrl = process.env.WORDPRESS_URL || 'https://duendesdeluruguay.com';
    const auth = Buffer.from(`${process.env.WC_CONSUMER_KEY}:${process.env.WC_CONSUMER_SECRET}`).toString('base64');

    // Si es número, buscar directo
    if (/^\d+$/.test(identificador)) {
      const res = await fetch(`${wpUrl}/wp-json/wc/v3/orders/${identificador}`, {
        headers: { 'Authorization': `Basic ${auth}` }
      });
      if (res.ok) return await res.json();
    }

    // Si es email, buscar por email
    if (identificador.includes('@')) {
      const res = await fetch(
        `${wpUrl}/wp-json/wc/v3/orders?search=${encodeURIComponent(identificador)}&per_page=5`,
        { headers: { 'Authorization': `Basic ${auth}` } }
      );
      if (res.ok) {
        const pedidos = await res.json();
        return pedidos.length > 0 ? pedidos : null;
      }
    }

    // Buscar por nombre
    const res = await fetch(
      `${wpUrl}/wp-json/wc/v3/orders?search=${encodeURIComponent(identificador)}&per_page=5`,
      { headers: { 'Authorization': `Basic ${auth}` } }
    );
    if (res.ok) {
      const pedidos = await res.json();
      return pedidos.length > 0 ? pedidos : null;
    }

    return null;
  } catch (error) {
    console.error('[TITO KB] Error buscando pedido:', error);
    return null;
  }
}

export function formatearPedido(pedido) {
  if (!pedido) return null;

  const estados = {
    'pending': '⏳ Esperando pago',
    'on-hold': '⏸️ En espera (verificando pago)',
    'processing': '📦 Pagado - Preparando tu guardián',
    'shipped': '🚚 Enviado - En camino',
    'completed': '✅ Entregado',
    'cancelled': '❌ Cancelado',
    'refunded': '↩️ Reembolsado',
    'failed': '❌ Pago fallido'
  };

  // Mensajes tranquilizadores según estado
  const mensajesEstado = {
    'pending': 'Tu pedido está esperando confirmación del pago. Si ya pagaste, en breve se actualiza.',
    'on-hold': 'Estamos verificando el pago. Todo está bien, es parte del proceso.',
    'processing': '¡Tu guardián se está preparando con mucho amor para el viaje!',
    'shipped': '¡Ya está viajando hacia vos! Pronto lo tenés en tus manos.',
    'completed': '¡Tu guardián ya llegó a su nuevo hogar!',
    'cancelled': 'Este pedido fue cancelado.',
    'refunded': 'Este pedido fue reembolsado.',
    'failed': 'Hubo un problema con el pago. ¿Querés intentar de nuevo?'
  };

  const tracking = pedido.meta_data?.find(m =>
    m.key === '_tracking_number' || m.key === 'tracking_number' || m.key === '_wc_shipment_tracking_items'
  )?.value;

  // País de envío: primero shipping, si no hay, usar billing
  const paisEnvio = pedido.shipping?.country || pedido.billing?.country;

  // Calcular días desde pedido
  const fechaPedido = new Date(pedido.date_created);
  const diasDesde = Math.floor((Date.now() - fechaPedido) / (1000 * 60 * 60 * 24));

  return {
    id: pedido.id,
    estado: estados[pedido.status] || pedido.status,
    estadoRaw: pedido.status,
    mensaje_estado: mensajesEstado[pedido.status] || '',
    cliente: `${pedido.billing?.first_name || ''} ${pedido.billing?.last_name || ''}`.trim(),
    email: pedido.billing?.email,
    total: `$${pedido.total} ${pedido.currency}`,
    fecha: new Date(pedido.date_created).toLocaleDateString('es-UY'),
    productos: pedido.line_items?.map(i => i.name).join(', '),
    tracking: typeof tracking === 'string' ? tracking : tracking?.[0]?.tracking_number || null,
    pais: pedido.billing?.country,
    pais_envio: paisEnvio, // IMPORTANTE: país de envío para calcular tiempos
    ciudad: pedido.billing?.city,
    notas: pedido.customer_note,
    dias_desde_pedido: diasDesde,
    // Instrucciones de envío según país
    tiempo_envio: paisEnvio === 'UY' ? '3-7 días por DAC' : '5-10 días por DHL Express',
    metodo_envio: paisEnvio === 'UY' ? 'DAC (courier uruguayo)' : 'DHL Express (internacional)'
  };
}

export async function obtenerEstadisticasVentas() {
  try {
    const wpUrl = process.env.WORDPRESS_URL || 'https://duendesdeluruguay.com';
    const auth = Buffer.from(`${process.env.WC_CONSUMER_KEY}:${process.env.WC_CONSUMER_SECRET}`).toString('base64');

    const res = await fetch(
      `${wpUrl}/wp-json/wc/v3/orders?per_page=50&status=any`,
      { headers: { 'Authorization': `Basic ${auth}` } }
    );

    if (!res.ok) return null;
    const pedidos = await res.json();

    const hoy = new Date().toISOString().split('T')[0];
    const hace7dias = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

    return {
      totalPedidos: pedidos.length,
      pendientes: pedidos.filter(p => p.status === 'pending' || p.status === 'on-hold').length,
      procesando: pedidos.filter(p => p.status === 'processing').length,
      completados: pedidos.filter(p => p.status === 'completed').length,
      ventasHoy: pedidos.filter(p => p.date_created?.startsWith(hoy)).length,
      ventasSemana: pedidos.filter(p => p.date_created >= hace7dias).length
    };
  } catch (error) {
    return null;
  }
}

// ═══════════════════════════════════════════════════════════════
// FAQ Y CONOCIMIENTO FIJO
// ═══════════════════════════════════════════════════════════════

export const FAQ = {
  // ═══════════════════════════════════════════════════════════════
  // ENVÍOS
  // ═══════════════════════════════════════════════════════════════
  envios: {
    internacional: {
      metodo: 'DHL Express',
      tiempo: '5-10 días hábiles',
      tracking: 'Sí, con número de seguimiento en www.dhl.com/tracking',
      seguro: 'Incluido',
      envioGratis: 'En compras de USD$1000 o más'
    },
    uruguay: {
      metodo: 'DAC',
      tiempo: '5-7 días hábiles',
      tracking: 'Sí, en www.dac.com.uy',
      costo: 'Se calcula en el carrito',
      envioGratis: 'En compras de $10.000 pesos uruguayos o más'
    },
    embalaje: 'Protección múltiple para que el guardián llegue perfecto. Envío asegurado con número de seguimiento.',
    destinosMundiales: 'Enviamos a todo el mundo - más de 30 países',
    danoEnvio: 'Es extremadamente raro. Si llega dañado: documentar con fotos, contactar por WhatsApp dentro de 48 horas, se evalúa caso a caso.',
    impuestosAduana: 'Varían según cada país y son responsabilidad del comprador. Consultar con aduana local antes de comprar.',
    noRetirado: 'Si no se puede entregar (dirección incorrecta, nadie recibe, no se retira de aduana), el paquete vuelve a Uruguay con costos MUY ALTOS de reenvío.'
  },

  // ═══════════════════════════════════════════════════════════════
  // PAGOS - LAS COMPRAS SE HACEN EN LA WEB
  // ═══════════════════════════════════════════════════════════════
  pagos: {
    // IMPORTANTE: Las compras se hacen en la web. Tito guía, no procesa pagos.
    // IMPORTANTE: NO TENEMOS PAYPAL. NUNCA mencionar PayPal.

    exterior: {
      moneda: 'Dólares (USD)',
      tarjetas: ['Visa', 'MasterCard', 'American Express'],
      otros: ['Western Union', 'MoneyGram'],
      conversion: 'Tu banco convierte automáticamente a tu moneda local',
      nota: 'NO tenemos PayPal'
    },

    uruguay: {
      moneda: 'Pesos uruguayos (UYU)',
      tarjetas: ['Visa', 'MasterCard', 'American Express', 'OCA', 'PassCard', 'Cabal', 'Anda', 'Club del Este', 'Redpagos', 'Itaú'],
      bancos: ['Banco República (BROU)', 'Bandes', 'BBVA', 'Scotiabank'],
      nota: 'Tarjetas y transferencia bancaria. NO tenemos Mercado Pago.'
    },

    // IMPORTANTE: NO OFRECER PAYPAL - NO LO TENEMOS
    metodosPROHIBIDOS: ['PayPal', 'Paypal', 'paypal'],

    seguridad: 'Certificado SSL, pasarela de pago certificada, cumplen PCI DSS. Tu información financiera nunca pasa por nosotros.',
    cuotas: 'Depende de tu tarjeta y banco. Algunos permiten cuotas automáticas.',
    pagoRechazado: 'Causas comunes: fondos insuficientes, límite excedido, tarjeta no habilitada para internacional. Verificar datos, probar otra tarjeta, o contactar banco.',
    sinCargoExtra: 'El precio que ves + envío es todo. Tu banco puede cobrar comisión por compra internacional.',

    instruccionTito: `
CUANDO ALGUIEN QUIERE COMPRAR:

1. Verificar qué guardián eligió
2. Guiarla a la tienda: duendesdeluruguay.com/shop/
3. Explicar que en la web:
   - Agrega al carrito
   - Completa datos de envío
   - Elige método de pago
   - Paga de forma segura
4. NO procesar pagos, NO dar datos bancarios
5. Si tiene problemas técnicos, derivar a WhatsApp

FORMAS DE PAGO DISPONIBLES:
- URUGUAY: Visa, MasterCard, AmEx, OCA, PassCard, Cabal, Anda, Club del Este, Redpagos, Itaú, BROU, Bandes, BBVA, Scotiabank
- INTERNACIONAL: Visa, MasterCard, American Express, Western Union, MoneyGram

⚠️ NO TENEMOS PAYPAL - NUNCA lo menciones como opción
⚠️ NO TENEMOS MERCADO PAGO - no lo ofrezcas
`
  },

  // ═══════════════════════════════════════════════════════════════
  // PRODUCTOS Y MATERIALES
  // ═══════════════════════════════════════════════════════════════
  productos: {
    materiales: 'Porcelana fría profesional de alta calidad - flexible y resistente. 100% esculpido a mano, SIN moldes industriales.',
    cristales: '100% auténticos y naturales: amatista, cuarzo rosa, citrino, labradorita, turmalina negra. Cada uno seleccionado por propiedades energéticas.',
    ropa: 'Telas naturales, lanas, fieltros - todo cosido a mano puntada a puntada',
    detalle4dedos: 'Los duendes tienen 4 dedos, es parte de la tradición mágica',
    unicidad: 'Cada guardián mediano, grande y gigante es 100% ÚNICO e irrepetible. Cuando alguien lo adopta, ese diseño desaparece para siempre.',
    tiempoCreacion: 'Entre 20-60 horas para medianos. Piezas grandes pueden requerir semanas o meses. Antes hay proceso de canalización.',
    incluyeCompra: 'Certificado de Originalidad firmado, Guía Digital exclusiva, materiales informativos, packaging especial de protección',
    personalizados: 'NO hacemos encargos ni personalizados. Una canalización no se puede apurar. Solo trabajamos con stock disponible.',
    esIgualFoto: 'Sí, todos están en stock. El duende de la foto es el que recibís.'
  },

  // ═══════════════════════════════════════════════════════════════
  // TAMAÑOS Y PRECIOS
  // ═══════════════════════════════════════════════════════════════
  tamanos: {
    mini: {
      altura: '7-10 cm (Mini/Pixies)',
      unicidad: 'Pueden repetirse en diseño pero varían en ejecución manual',
      nota: 'Perfectos para empezar tu conexión'
    },
    mediano: {
      altura: '20-25 cm',
      unicidad: '100% ÚNICOS e irrepetibles',
      nota: 'El tamaño más elegido'
    },
    grande: {
      altura: '30-40 cm',
      unicidad: '100% ÚNICOS e irrepetibles',
      nota: 'Presencia imponente'
    },
    gigante: {
      altura: '50-70 cm',
      unicidad: '100% ÚNICOS e irrepetibles',
      nota: 'Para espacios amplios o coleccionistas'
    },
    precio: 'No se cobra por tamaño. El valor se determina por complejidad, materiales y horas de trabajo.'
  },

  // ═══════════════════════════════════════════════════════════════
  // MAGIA Y CANALIZACIÓN
  // ═══════════════════════════════════════════════════════════════
  magia: {
    queSon: 'Seres energéticos materializados mediante canalización en estado meditativo profundo. No fabricamos muñecos - somos canales intermediarios.',
    comoElegir: 'La persona no elige al duende; el duende la elige. Es un reconocimiento entre almas. Si uno te llama la atención especialmente, esa es la señal.',
    consagrados: 'Cada uno es canalizado y consagrado en Piriápolis (punto energético mundial). Nacen ya vivos y conectados.',
    energia: 'Todo el trabajo está enfocado desde lo positivo, la luz y la protección. Son guardianes ancestrales, seres de la naturaleza.',
    propositos: 'Están conectados con abundancia, protección, amor, salud o conexión espiritual. Cada uno tiene historia y significado detallado en su publicación.',
    paraQue: 'Es un portal energético para conectar con energías elementales. Puede proteger el espacio, atraer abundancia, elevar vibración.',
    variosOUno: 'Los guardianes son sociables por naturaleza y su energía se potencia en grupo. Pero uno solo también cumple su propósito.',
    siSeRompe: 'Están hechos en porcelana fría flexible y resistente. Daños menores se pueden reparar. Algunas tradiciones dicen que el guardián cumplió su misión protegiendo.',
    quienPuedeTocarlo: 'No recomendado que otros lo toquen. Establece conexión contigo; otros pueden interferir.',
    mantenimiento: 'Exponerlos a luz de luna llena y solar, hablarles, hacer pequeñas ofrendas (flor, moneda, agua). Info completa en la Guía Digital exclusiva.',
    nombre: 'Cada uno lleva un apodo identificatorio, pero el "nombre álmico" lo revela solo a su persona. Puede llegar en sueños, meditación o simplemente "sabiendo."',
    regaladoOComprado: 'Los duendes pueden ser regalados y comprados. Lo importante es la conexión que estableces.',
    dondePonerlo: 'Crear altar con tréboles, cristales y elementos naturales. Ubicarlo cerca de ventana, en espacios ordenados. Info completa en Guía Digital.',
    llevarConmigo: 'Sí, llevalos a citas importantes, cerrar negocios, visitas médicas. Fortalece vínculo y otorgan protección y guía.'
  },

  // ═══════════════════════════════════════════════════════════════
  // GARANTÍA Y DEVOLUCIONES
  // ═══════════════════════════════════════════════════════════════
  garantia: {
    devoluciones: 'NO aceptamos reembolsos ni devoluciones. Cada pieza es única, exclusiva e irrepetible - no es producto masivo.',
    porQueNo: 'Son piezas de arte únicas. Cada duende se retira del inventario al venderse. El proceso de canalización es irrepetible.',
    excepciones: 'Se evalúa caso a caso: daño grave durante envío (documentado con fotos en 48hs) o error nuestro (enviamos algo diferente).',
    recomendacion: 'Estar 100% seguro antes de comprar. No hay vuelta atrás.',
    danoEnEnvio: 'Documentar con fotos, contactar por WhatsApp dentro de 48 horas.'
  },

  // ═══════════════════════════════════════════════════════════════
  // OTROS
  // ═══════════════════════════════════════════════════════════════
  visitas: {
    permitido: 'Solo con cita previa',
    ubicacion: 'Piriápolis, Uruguay',
    contacto: 'Escribir para coordinar'
  },

  canalizacion: {
    descripcion: 'Cada guardián viene con una canalización personal - un mensaje energético único para vos',
    incluido: 'Siempre incluido en la compra',
    formato: 'Accesible en la sección Mi Magia de la web',
    exclusivo: 'Solo para clientes que compraron - se accede con el código QR del guardián'
  },

  reventa: {
    respuesta: 'NO vendemos para reventa. Punto. No hacemos convenios comerciales.',
    explicacion: 'Cada guardián llega directamente de nuestras manos a las tuyas. No hay intermediarios.',
    alternativa: 'Si alguien quiere colaborar, puede hablar directamente con el equipo, pero NO es reventa mayorista.'
  },

  autenticidad: {
    diferencia: 'Cada pieza es 100% esculpida a mano, sin moldes industriales. Trabajamos en estado de consciencia expandida. Cristales auténticos. Consagrados en Piriápolis.',
    imitaciones: 'Existen copias que copian textos, nombres, imágenes. La única fuente oficial es la web y redes verificadas.',
    proteccion: 'Verificar empresa real con factura oficial y pasarela segura. Conocer historia de creadores.'
  },

  modificarPedido: {
    respuesta: 'No se pueden modificar ni cancelar pedidos después de pagar.',
    razon: 'Cada pieza es única. Una vez que pagás, queda reservada y sale del inventario.'
  },

  factura: {
    disponible: 'Sí, emitimos factura oficial uruguaya. Indicar datos fiscales en notas del pedido o escribir después de comprar.'
  },

  // ═══════════════════════════════════════════════════════════════
  // EL CÍRCULO - MEMBRESÍA (actualmente pausada)
  // ═══════════════════════════════════════════════════════════════
  elCirculo: {
    estado: 'pausado',
    descripcion: 'El Círculo es nuestra membresía exclusiva que está siendo preparada con algo muy especial.',
    url: 'https://magia.duendesdeluruguay.com/circulo',
    mensajeTito: `
    Cuando pregunten por El Círculo:

    "El Círculo está siendo preparado con algo muy especial 🔮
    Es nuestra membresía exclusiva que va a incluir contenido y experiencias únicas.

    Si querés ser de los primeros en enterarte cuando esté listo,
    podés dejarnos tu email en: magia.duendesdeluruguay.com/circulo

    ¡Te avisamos cuando abra! 🍀"
    `
  },

  // ═══════════════════════════════════════════════════════════════
  // MI MAGIA - SECCIÓN EXCLUSIVA PARA COMPRADORES
  // ═══════════════════════════════════════════════════════════════
  miMagia: {
    descripcion: 'Portal exclusivo post-compra para clientes que adoptaron un guardián. Ahí acceden a contenido único de su guardián.',
    url: 'https://magia.duendesdeluruguay.com',
    urlAlternativa: 'https://duendesdeluruguay.com/mi-magia/',
    urlVercel: 'https://duendes-vercel.vercel.app/mi-magia',

    comoAcceder: {
      metodo1: 'Escaneando el código QR que viene con el guardián',
      metodo2: 'Entrando a la web y usando el código del guardián (formato DU2601-XXXXX)',
      verificacion: 'Se verifica el email de compra para acceder al contenido personalizado'
    },

    contenidoExclusivo: {
      canalizacion: 'Mensaje personalizado de tu guardián, único para vos según lo que compartiste en el formulario de compra',
      historia: 'Historia completa del guardián - de dónde viene, qué vivió, su personalidad',
      dones: 'Los dones especiales que trae tu guardián y cómo trabaja',
      ritual: 'Ritual de bienvenida paso a paso para cuando llega a casa',
      cuidados: 'Cómo cuidar a tu guardián - dónde ubicarlo, limpieza energética, fechas especiales'
    },

    recanaLizacion: {
      descripcion: 'Podés pedir una nueva canalización si pasó tiempo o estás en un momento diferente de tu vida',
      precio: 'GRATIS si el guardián es de Duendes del Uruguay. $7 USD si es un duende externo',
      tiempo: '24-48 horas después de solicitarla'
    },

    mensajeTito: `
    Cuando alguien pregunte sobre cuidados, envíos, su canalización, o qué pasa después de comprar:

    "Cuando adoptes a tu guardián, vas a tener acceso a una sección exclusiva llamada 'Mi Magia'.
    Ahí vas a encontrar:
    ✨ Tu canalización personalizada - un mensaje único de tu guardián para vos
    📜 Su historia completa - de dónde viene, qué vivió
    🎁 Sus dones especiales y cómo trabaja
    🕯️ Un ritual de bienvenida para cuando llegue a casa
    🌿 Cómo cuidarlo - dónde ponerlo, limpieza energética

    Accedés escaneando el QR que viene con tu guardián o entrando a duendesdeluruguay.com/mi-magia con tu código.

    ¿Tenés alguna otra duda? 💚"
    `
  }
};

export const INFO_EMPRESA = {
  nombre: 'Duendes del Uruguay',
  ubicacion: 'Piriápolis, Uruguay',
  descripcion: 'Artesanos que canalizan guardianes mágicos',
  porquePiriapolis: 'Piriápolis es un punto energético único donde convergen líneas de energía. Los cerros sagrados + el océano crean un portal natural. Los guardianes nacen cargados con esta energía especial.',
  contacto: {
    whatsapp: '+598 98 690 629',
    email: 'duendesdeluruguay@gmail.com',
    instagram: '@duendesdeluruguay',
    web: 'www.duendesdeluruguay.com'
  },
  historia: 'Somos un equipo de artesanos que desde Piriápolis creamos guardianes únicos. Cada pieza es canalizada con intención y hecha 100% a mano.',
  filosofia: 'El guardián elige a la persona, no al revés. Cuando sentís el llamado, es porque ya te eligió.'
};

// ═══════════════════════════════════════════════════════════════
// SISTEMA DE RECOMENDACIÓN INTELIGENTE
// ═══════════════════════════════════════════════════════════════

export function recomendarGuardianes(necesidad, productos, opciones = {}) {
  const { limite = 4, presupuesto, tamano } = opciones;

  let filtrados = [...productos].filter(p => p.disponible);

  // Filtrar por necesidad - buscar en CATEGORÍAS primero, luego en nombre/descripción
  if (necesidad) {
    const necesidadLower = necesidad.toLowerCase();

    // Función helper para filtrar por categoría o atributo
    const filtrarPorCategoria = (productos, patron) => {
      // Primero buscar en categorías (más confiable)
      let resultado = productos.filter(p => {
        const cats = (p.categorias || []).join(' ').toLowerCase();
        const slugs = (p.categoriaSlugs || []).join(' ').toLowerCase();
        return patron.test(cats) || patron.test(slugs);
      });

      // Si no hay en categorías, buscar en nombre/descripción
      if (resultado.length === 0) {
        resultado = productos.filter(p => {
          const texto = `${p.nombre || ''} ${p.descripcion || ''}`.toLowerCase();
          return patron.test(texto);
        });
      }

      return resultado;
    };

    if (/protecci[oó]n|proteger|escudo|defensa|malo|negativ/i.test(necesidadLower)) {
      filtrados = filtrarPorCategoria(filtrados, /protecci[oó]n|proteger/i);
    } else if (/abundancia|dinero|prosperidad|trabajo|negocio|plata/i.test(necesidadLower)) {
      filtrados = filtrarPorCategoria(filtrados, /abundancia|prosperidad|dinero/i);
    } else if (/amor|pareja|coraz[oó]n|relaci[oó]n|soledad/i.test(necesidadLower)) {
      filtrados = filtrarPorCategoria(filtrados, /amor|coraz[oó]n|pareja/i);
    } else if (/san|salud|curar|enferm|bienestar/i.test(necesidadLower)) {
      filtrados = filtrarPorCategoria(filtrados, /sanaci[oó]n|salud|sanar/i);
    } else if (/paz|calma|ansiedad|estr[eé]s|tranquil/i.test(necesidadLower)) {
      filtrados = filtrarPorCategoria(filtrados, /paz|calma|tranquil|armon[ií]a/i);
    }
  }

  // Filtrar por presupuesto
  if (presupuesto) {
    const maxPrecio = parseFloat(presupuesto);
    if (!isNaN(maxPrecio)) {
      filtrados = filtrados.filter(p => p.precio <= maxPrecio);
    }
  }

  // Filtrar por tamaño
  if (tamano) {
    filtrados = filtrados.filter(p => p.tamano === tamano);
  }

  // Si no hay resultados, devolver productos generales
  if (filtrados.length === 0) {
    filtrados = productos.filter(p => p.disponible);
  }

  // Ordenar por relevancia con ROTACIÓN:
  // 1. En oferta primero (shuffled entre sí)
  // 2. Normales shuffled (para no mostrar siempre los mismos)
  const enOferta = filtrados.filter(p => p.enOferta);
  const normales = filtrados.filter(p => !p.enOferta);

  // Fisher-Yates shuffle para rotación
  for (let i = enOferta.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [enOferta[i], enOferta[j]] = [enOferta[j], enOferta[i]];
  }
  for (let i = normales.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [normales[i], normales[j]] = [normales[j], normales[i]];
  }

  filtrados = [...enOferta, ...normales];
  return filtrados.slice(0, limite);
}

// ═══════════════════════════════════════════════════════════════
// FORMATEO DE PRECIOS POR PAÍS
// ═══════════════════════════════════════════════════════════════

// PRECIOS FIJOS - Actualizados Enero 2025
export const PRECIOS_USD = {
  mini_clasico: 70,
  mini_especial: 150,  // incluye pixies
  mediano_especial: 200,
  mediano_maestro: '450-600',  // cuando hay, en la web
  grande_especial: 450,
  grande_maestro: 800,  // cuando hay, en la web
  gigante_especial: 1050,
  gigante_maestro: 2000,  // puede llegar hasta

  listaCompleta: `
PRECIOS EN DÓLARES (USD):

🌿 MINI CLÁSICO - $70 USD
✨ MINI ESPECIAL / PIXIE - $150 USD
🍀 MEDIANO ESPECIAL - $200 USD
🔮 MEDIANO MAESTROS MÍSTICOS - $450-600 USD (cuando hay disponibles, en la web)
💚 GRANDE ESPECIAL - $450 USD
👑 GRANDE MAESTROS MÍSTICOS - ~$800 USD (cuando hay disponibles, en la web)
🐉 GIGANTE ESPECIAL - $1.050 USD
⭐ GIGANTE MAESTROS MÍSTICOS - hasta $2.000 USD`
};

// PRECIOS FIJOS URUGUAY (en pesos uruguayos)
export const PRECIOS_URUGUAY = {
  mini_clasico: { precio: 2500, nombre: 'Mini Clásico' },
  mini_especial: { precio: 5500, nombre: 'Mini Especial / Pixie' },
  mediano_especial: { precio: 8000, nombre: 'Mediano Especial' },
  mediano_maestro: { precio: 12500, nombre: 'Mediano Edición Maestros Místicos' },
  grande_especial: { precio: 16500, nombre: 'Grande Especial' },
  grande_maestro: { precio: 24500, nombre: 'Grande Edición Maestros Místicos' },
  gigante_especial: { precio: 39800, nombre: 'Gigante Especial' },
  gigante_maestro: { precio: 79800, nombre: 'Gigante Edición Maestros Místicos' },

  // Texto formateado CON explicación de cada categoría
  listaCompleta: `
PRECIOS EN PESOS URUGUAYOS:

🌿 MINI CLÁSICO - $2.500
   Guardianes tradicionales, perfectos para empezar tu conexión.
   10-15cm. Ideales para espacios pequeños.

✨ MINI ESPECIAL / PIXIE - $5.500
   Incluyen cristales energéticos y detalles únicos.
   Más trabajo artesanal, cada uno con su piedra especial.

🍀 MEDIANO ESPECIAL - $8.000
   El tamaño más elegido. Presencia sin ocupar mucho espacio.
   Cristales, ropa cosida a mano, detalles que enamoran.

🔮 MEDIANO MAESTROS MÍSTICOS - $12.500
   Edición premium. Guardianes con energía elevada.
   Múltiples cristales, acabados de lujo, piezas de colección.

💚 GRANDE ESPECIAL - $16.500
   Presencia imponente. Para quienes quieren un guardián que se note.
   Días de trabajo, cada detalle cuidado al máximo.

👑 GRANDE MAESTROS MÍSTICOS - $24.500
   Lo mejor de lo mejor en tamaño grande.
   Piezas de museo. Energía palpable.

🐉 GIGANTE ESPECIAL - $39.800
   Para espacios amplios o coleccionistas serios.
   Semanas de trabajo. Impacto visual y energético único.

⭐ GIGANTE MAESTROS MÍSTICOS - $79.800
   La máxima expresión del arte de Duendes del Uruguay.
   Piezas irrepetibles. Inversión en arte y energía.

NOTA: Los Maestros Místicos son ediciones limitadas. Cuando hay disponibles, están en la web.`,

  // Función para convertir USD a pesos uruguayos (aproximado)
  convertir: (precioUSD) => {
    // Precios fijos para Uruguay según rango de USD
    if (precioUSD <= 75) return 2500;      // Mini clásico
    if (precioUSD <= 160) return 5500;     // Mini especial
    if (precioUSD <= 210) return 8000;     // Mediano especial
    if (precioUSD <= 350) return 12500;    // Mediano maestro
    if (precioUSD <= 500) return 16500;    // Grande especial
    if (precioUSD <= 700) return 24500;    // Grande maestro
    if (precioUSD <= 1100) return 39800;   // Gigante especial
    return 79800;                           // Gigante maestro
  }
};

// TASAS DE CAMBIO - Actualizar periódicamente
// Última actualización: Enero 2026
const TASAS_CAMBIO = {
  UY: { codigo: 'UYU', simbolo: '$', tasa: 45, nombre: 'pesos uruguayos', soloLocal: true },
  AR: { codigo: 'ARS', simbolo: '$', tasa: 1250, nombre: 'pesos argentinos' },
  MX: { codigo: 'MXN', simbolo: '$', tasa: 21, nombre: 'pesos mexicanos' },
  CO: { codigo: 'COP', simbolo: '$', tasa: 4500, nombre: 'pesos colombianos' },
  CL: { codigo: 'CLP', simbolo: '$', tasa: 1020, nombre: 'pesos chilenos' },
  PE: { codigo: 'PEN', simbolo: 'S/', tasa: 3.85, nombre: 'soles peruanos' },
  BR: { codigo: 'BRL', simbolo: 'R$', tasa: 6.4, nombre: 'reales' },
  ES: { codigo: 'EUR', simbolo: '€', tasa: 0.96, nombre: 'euros' },
  US: { codigo: 'USD', simbolo: '$', tasa: 1, nombre: 'dólares' },
  // Países adicionales
  EC: { codigo: 'USD', simbolo: '$', tasa: 1, nombre: 'dólares' }, // Ecuador usa USD
  PA: { codigo: 'USD', simbolo: '$', tasa: 1, nombre: 'dólares' }, // Panamá usa USD
  VE: { codigo: 'USD', simbolo: '$', tasa: 1, nombre: 'dólares' }, // Venezuela prefiere USD
  CR: { codigo: 'CRC', simbolo: '₡', tasa: 520, nombre: 'colones' },
  GT: { codigo: 'GTQ', simbolo: 'Q', tasa: 7.9, nombre: 'quetzales' },
  DO: { codigo: 'DOP', simbolo: 'RD$', tasa: 62, nombre: 'pesos dominicanos' },
  BO: { codigo: 'BOB', simbolo: 'Bs', tasa: 6.95, nombre: 'bolivianos' },
  PY: { codigo: 'PYG', simbolo: '₲', tasa: 8000, nombre: 'guaraníes' },
  HN: { codigo: 'HNL', simbolo: 'L', tasa: 26, nombre: 'lempiras' },
  NI: { codigo: 'NIO', simbolo: 'C$', tasa: 38, nombre: 'córdobas' },
  SV: { codigo: 'USD', simbolo: '$', tasa: 1, nombre: 'dólares' }, // El Salvador usa USD
};

export function formatearPrecio(precioUSD, codigoPais = 'US') {
  const moneda = TASAS_CAMBIO[codigoPais] || TASAS_CAMBIO['US'];
  const precioLocal = Math.round(precioUSD * moneda.tasa);

  // Uruguay: SOLO pesos uruguayos
  if (codigoPais === 'UY') {
    return `$${precioLocal.toLocaleString('es-UY')} pesos uruguayos`;
  }

  // Países que usan USD: solo USD
  if (moneda.tasa === 1) {
    return `$${precioUSD} USD`;
  }

  // Otros países: USD + (equivalente local)
  return `$${precioUSD} USD (aprox. ${moneda.simbolo}${precioLocal.toLocaleString('es')} ${moneda.nombre})`;
}

// Función para obtener info de moneda
export function obtenerInfoMoneda(codigoPais) {
  return TASAS_CAMBIO[codigoPais] || TASAS_CAMBIO['US'];
}

// Calcular precio de reserva (30%)
export function calcularReserva(precioUSD, codigoPais = 'US') {
  const reservaUSD = Math.round(precioUSD * 0.3);
  return formatearPrecio(reservaUSD, codigoPais);
}

// Ejemplos de seña para el contexto
export function ejemplosSeña(codigoPais = 'US') {
  const moneda = TASAS_CAMBIO[codigoPais] || TASAS_CAMBIO['US'];

  if (codigoPais === 'UY') {
    return `
EJEMPLOS DE SEÑA (30%) PARA URUGUAY:
• Mini Clásico ($2.500) → Seña: $750 pesos
• Mini Especial ($5.500) → Seña: $1.650 pesos
• Mediano Especial ($8.000) → Seña: $2.400 pesos
• Mediano Maestros ($12.500) → Seña: $3.750 pesos
• Grande Especial ($16.500) → Seña: $4.950 pesos`;
  }

  if (moneda.tasa === 1) {
    // Países con USD
    return `
EJEMPLOS DE SEÑA (30%) EN DÓLARES:
• Mini ($70) → Seña: $21 dólares
• Mediano ($150) → Seña: $45 dólares
• Grande ($300) → Seña: $90 dólares`;
  }

  // Otros países: USD + equivalente
  const ej21 = Math.round(21 * moneda.tasa);
  const ej45 = Math.round(45 * moneda.tasa);
  const ej90 = Math.round(90 * moneda.tasa);

  return `
EJEMPLOS DE SEÑA (30%) - Di USD + equivalente local:
• Mini ($70) → Seña: 21 dólares (${moneda.simbolo}${ej21.toLocaleString('es')} ${moneda.nombre})
• Mediano ($150) → Seña: 45 dólares (${moneda.simbolo}${ej45.toLocaleString('es')} ${moneda.nombre})
• Grande ($300) → Seña: 90 dólares (${moneda.simbolo}${ej90.toLocaleString('es')} ${moneda.nombre})`;
}

export function detectarPaisDeMensaje(mensaje, contexto) {
  // Primero verificar contexto
  if (contexto?.visitante?.countryCode) {
    return contexto.visitante.countryCode;
  }

  // Detectar por mensaje
  const paises = {
    'uruguay': 'UY', 'uruguayo': 'UY', 'uruguaya': 'UY', 'montevideo': 'UY',
    'argentina': 'AR', 'argentino': 'AR', 'argentina': 'AR', 'buenos aires': 'AR',
    'méxico': 'MX', 'mexico': 'MX', 'mexicano': 'MX', 'mexicana': 'MX',
    'colombia': 'CO', 'colombiano': 'CO', 'colombiana': 'CO', 'bogotá': 'CO',
    'chile': 'CL', 'chileno': 'CL', 'chilena': 'CL', 'santiago': 'CL',
    'perú': 'PE', 'peru': 'PE', 'peruano': 'PE', 'peruana': 'PE', 'lima': 'PE',
    'brasil': 'BR', 'brazil': 'BR', 'brasileño': 'BR', 'brasileña': 'BR',
    'españa': 'ES', 'spain': 'ES', 'español': 'ES', 'española': 'ES', 'madrid': 'ES'
  };

  const msgLower = mensaje.toLowerCase();
  for (const [palabra, codigo] of Object.entries(paises)) {
    if (msgLower.includes(palabra)) return codigo;
  }

  return 'US'; // Default
}
