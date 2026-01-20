/**
 * TITO 2.0 - BASE DE CONOCIMIENTO
 * Sistema de conocimiento centralizado que se actualiza automáticamente
 */

// ═══════════════════════════════════════════════════════════════
// CACHE DE PRODUCTOS (se actualiza cada 5 minutos)
// ═══════════════════════════════════════════════════════════════

let cacheProductos = null;
let cacheProductosTime = 0;
const CACHE_DURACION = 5 * 60 * 1000; // 5 minutos

export async function obtenerProductosWoo() {
  // Usar cache si está fresco
  if (cacheProductos && (Date.now() - cacheProductosTime) < CACHE_DURACION) {
    return cacheProductos;
  }

  try {
    const wpUrl = process.env.WORDPRESS_URL || 'https://duendesuy.10web.cloud';
    const auth = Buffer.from(`${process.env.WC_CONSUMER_KEY}:${process.env.WC_CONSUMER_SECRET}`).toString('base64');

    const response = await fetch(
      `${wpUrl}/wp-json/wc/v3/products?per_page=100&status=publish`,
      {
        headers: { 'Authorization': `Basic ${auth}` },
        next: { revalidate: 300 } // Cache de Next.js
      }
    );

    if (!response.ok) throw new Error('Error WooCommerce');

    const productos = await response.json();

    cacheProductos = productos
      .filter(p => p.images?.length > 0)
      .map(p => ({
        id: p.id,
        nombre: p.name,
        slug: p.slug,
        precio: parseFloat(p.price) || 0,
        precioRegular: parseFloat(p.regular_price) || 0,
        enOferta: p.on_sale,
        disponible: p.stock_status === 'instock',
        imagen: p.images[0]?.src,
        imagenes: p.images.map(i => i.src),
        url: p.permalink,
        categorias: p.categories?.map(c => c.name) || [],
        categoriaSlugs: p.categories?.map(c => c.slug) || [],
        descripcion: p.description?.replace(/<[^>]*>/g, '').substring(0, 500),
        descripcionCorta: p.short_description?.replace(/<[^>]*>/g, '').substring(0, 200),
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
      }));

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
    const wpUrl = process.env.WORDPRESS_URL || 'https://duendesuy.10web.cloud';
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

  const tracking = pedido.meta_data?.find(m =>
    m.key === '_tracking_number' || m.key === 'tracking_number'
  )?.value;

  return {
    id: pedido.id,
    estado: estados[pedido.status] || pedido.status,
    estadoRaw: pedido.status,
    cliente: `${pedido.billing?.first_name || ''} ${pedido.billing?.last_name || ''}`.trim(),
    email: pedido.billing?.email,
    total: `$${pedido.total} ${pedido.currency}`,
    fecha: new Date(pedido.date_created).toLocaleDateString('es-UY'),
    productos: pedido.line_items?.map(i => i.name).join(', '),
    tracking: tracking || null,
    pais: pedido.billing?.country,
    ciudad: pedido.billing?.city,
    notas: pedido.customer_note
  };
}

export async function obtenerEstadisticasVentas() {
  try {
    const wpUrl = process.env.WORDPRESS_URL || 'https://duendesuy.10web.cloud';
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
  envios: {
    internacional: {
      metodo: 'DHL Express',
      tiempo: '5-10 días hábiles',
      tracking: 'Sí, con número de seguimiento',
      seguro: 'Incluido'
    },
    uruguay: {
      metodo: 'DAC',
      tiempo: '3-7 días hábiles',
      tracking: 'Sí'
    },
    costo: 'Calculado según peso y destino, se muestra en checkout'
  },

  pagos: {
    metodos: ['Tarjeta de crédito/débito', 'PayPal', 'Transferencia bancaria', 'Mercado Pago'],
    reserva: {
      porcentaje: 30,
      diasReserva: 30,
      descripcion: 'Con el 30% reservás tu guardián por 30 días. El 70% restante lo pagás antes del envío.'
    },
    cuotas: 'Disponible con tarjeta según tu banco'
  },

  productos: {
    materiales: 'Porcelana fría profesional (flexible, resistente, dura años)',
    cristales: 'Reales: amatista, cuarzo rosa, citrino, labradorita, turmalina negra, cuarzo blanco',
    ropa: 'Telas naturales, lanas, fieltros - todo cosido a mano',
    detalle4dedos: 'Los duendes tienen 4 dedos, es parte de la tradición mágica',
    unicidad: 'Cada guardián es ÚNICO. Cuando alguien lo adopta, ese diseño desaparece para siempre',
    tiempo: 'Cada guardián tarda varios días en crearse a mano'
  },

  tamanos: {
    mini: { altura: '10-15 cm', precio: 'desde $70 USD' },
    mediano: { altura: '20-25 cm', precio: '$150-200 USD' },
    grande: { altura: '30-40 cm', precio: '$300-450 USD' },
    gigante: { altura: '50-70 cm', precio: '$700-1050 USD' }
  },

  garantia: {
    descripcion: 'Si llega dañado, lo reemplazamos o devolvemos el dinero',
    tiempo: 'Reportar dentro de 48hs de recibido con fotos'
  },

  visitas: {
    permitido: 'Solo con cita previa',
    ubicacion: 'Piriápolis, Uruguay',
    contacto: 'Escribir para coordinar'
  },

  canalizacion: {
    descripcion: 'Cada guardián viene con una canalización personal - un mensaje energético único para vos',
    incluido: 'Siempre incluido en la compra',
    formato: 'PDF digital enviado por email'
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

  // Filtrar por necesidad
  if (necesidad) {
    const necesidadLower = necesidad.toLowerCase();

    if (/protecci[oó]n|proteger|escudo|defensa|malo|negativ/i.test(necesidadLower)) {
      filtrados = filtrados.filter(p => p.esProteccion);
      if (filtrados.length === 0) {
        filtrados = productos.filter(p => p.disponible && /protecci[oó]n/i.test(p.categorias.join(' ')));
      }
    } else if (/abundancia|dinero|prosperidad|trabajo|negocio|plata/i.test(necesidadLower)) {
      filtrados = filtrados.filter(p => p.esAbundancia);
      if (filtrados.length === 0) {
        filtrados = productos.filter(p => p.disponible && /abundancia/i.test(p.categorias.join(' ')));
      }
    } else if (/amor|pareja|coraz[oó]n|relaci[oó]n|soledad/i.test(necesidadLower)) {
      filtrados = filtrados.filter(p => p.esAmor);
      if (filtrados.length === 0) {
        filtrados = productos.filter(p => p.disponible && /amor/i.test(p.categorias.join(' ')));
      }
    } else if (/san|salud|curar|enferm|bienestar/i.test(necesidadLower)) {
      filtrados = filtrados.filter(p => p.esSanacion);
      if (filtrados.length === 0) {
        filtrados = productos.filter(p => p.disponible && /sanaci[oó]n/i.test(p.categorias.join(' ')));
      }
    } else if (/paz|calma|ansiedad|estr[eé]s|tranquil/i.test(necesidadLower)) {
      filtrados = filtrados.filter(p => p.esPaz);
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

  // Ordenar por relevancia (en oferta primero, luego por precio)
  filtrados.sort((a, b) => {
    if (a.enOferta && !b.enOferta) return -1;
    if (!a.enOferta && b.enOferta) return 1;
    return a.precio - b.precio;
  });

  return filtrados.slice(0, limite);
}

// ═══════════════════════════════════════════════════════════════
// FORMATEO DE PRECIOS POR PAÍS
// ═══════════════════════════════════════════════════════════════

const TASAS_CAMBIO = {
  UY: { codigo: 'UYU', simbolo: '$', tasa: 44, nombre: 'pesos uruguayos' },
  AR: { codigo: 'ARS', simbolo: '$', tasa: 1100, nombre: 'pesos argentinos' },
  MX: { codigo: 'MXN', simbolo: '$', tasa: 17.5, nombre: 'pesos mexicanos' },
  CO: { codigo: 'COP', simbolo: '$', tasa: 4200, nombre: 'pesos colombianos' },
  CL: { codigo: 'CLP', simbolo: '$', tasa: 980, nombre: 'pesos chilenos' },
  PE: { codigo: 'PEN', simbolo: 'S/', tasa: 3.8, nombre: 'soles' },
  BR: { codigo: 'BRL', simbolo: 'R$', tasa: 5.2, nombre: 'reales' },
  ES: { codigo: 'EUR', simbolo: '€', tasa: 0.92, nombre: 'euros' },
  US: { codigo: 'USD', simbolo: '$', tasa: 1, nombre: 'dólares' }
};

export function formatearPrecio(precioUSD, codigoPais = 'US') {
  const moneda = TASAS_CAMBIO[codigoPais] || TASAS_CAMBIO['US'];

  if (codigoPais === 'US' || !codigoPais) {
    return `$${precioUSD} USD`;
  }

  const precioLocal = Math.round(precioUSD * moneda.tasa);
  return `$${precioUSD} USD (≈ ${moneda.simbolo}${precioLocal.toLocaleString('es')} ${moneda.codigo})`;
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
