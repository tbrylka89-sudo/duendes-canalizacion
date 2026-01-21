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
    // IMPORTANTE: Tito NO procesa pagos. Recopila datos y DERIVA al equipo.

    exterior: {
      opciones: ['Link de pago online (Visa/Mastercard)', 'Western Union', 'MoneyGram'],
      proceso: 'Te mando el link de pago o los datos para Western Union/MoneyGram'
    },

    uruguay: {
      opciones: ['Transferencia bancaria', 'Mercado Pago', 'Link de pago con Handy'],
      proceso: 'Te paso los datos de la cuenta o el link de Mercado Pago'
    },

    reserva: {
      porcentaje: 30,
      diasReserva: 30,
      descripcion: 'Con el 30% reservás tu guardián por 30 días. El 70% restante lo pagás antes del envío.'
    },

    // DATOS QUE TITO DEBE PEDIR ANTES DE DERIVAR:
    datosRequeridos: [
      'Nombre y apellido completo',
      'País',
      'Dirección completa',
      'Código postal',
      'Teléfono con característica/código de país',
      'Email'
    ],

    instruccionTito: `
CUANDO ALGUIEN QUIERE PAGAR - ESTE ES TU CIERRE:

1. Primero preguntá qué guardián eligió (si no quedó claro)

2. Pedí los datos para el envío:
   "¡Genial! Para coordinar el pago necesito tus datos:
   - Nombre y apellido
   - País
   - Dirección completa
   - Código postal
   - Teléfono con código de país
   - Email"

3. Una vez que tenés los datos, decí:
   "Perfecto, te derivo con el equipo para coordinar el pago 💚"

4. NO inventes datos de cuentas bancarias ni links.
   Solo recopilás la info y derivás.
`
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
    mini: {
      altura: '10-15 cm',
      precioUSD: 'Clásico $70 / Especial-Pixie $150 USD',
      precioUY: 'Clásico $2.500 / Especial-Pixie $5.500'
    },
    mediano: {
      altura: '20-25 cm',
      precioUSD: 'Especial $200 / Maestros Místicos $450-600 USD',
      precioUY: 'Especial $8.000 / Maestros Místicos $12.500'
    },
    grande: {
      altura: '30-40 cm',
      precioUSD: 'Especial $450 / Maestros Místicos ~$800 USD',
      precioUY: 'Especial $16.500 / Maestros Místicos $24.500'
    },
    gigante: {
      altura: '50-70 cm',
      precioUSD: 'Especial $1.050 / Maestros Místicos hasta $2.000 USD',
      precioUY: 'Especial $39.800 / Maestros Místicos $79.800'
    }
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
  },

  reventa: {
    respuesta: 'NO vendemos para reventa. Punto.',
    explicacion: 'Cada guardián lleva DÍAS de trabajo artesanal hecho completamente a mano. Porcelana fría moldeada sin moldes, cristales reales engarzados, ropa cosida puntada a puntada. No son juguetes chinos de fábrica. Son piezas únicas de arte con energía.',
    tono: 'Firme pero educado. No somos groseros, pero dejamos claro que esto no es negociable.',
    alternativa: 'Si alguien quiere tener guardianes en su tienda, puede hablar directamente con Thibisay para ver si hay alguna posibilidad de colaboración, pero NO es reventa mayorista.'
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

NOTA: Los Maestros Místicos son ediciones limitadas. Cuando hay disponibles, están en la web.`
};

// TASAS DE CAMBIO - Actualizar periódicamente
// Última actualización: Enero 2025
const TASAS_CAMBIO = {
  UY: { codigo: 'UYU', simbolo: '$', tasa: 44, nombre: 'pesos uruguayos', soloLocal: true },
  AR: { codigo: 'ARS', simbolo: '$', tasa: 1150, nombre: 'pesos argentinos' },
  MX: { codigo: 'MXN', simbolo: '$', tasa: 20, nombre: 'pesos mexicanos' },
  CO: { codigo: 'COP', simbolo: '$', tasa: 4400, nombre: 'pesos colombianos' },
  CL: { codigo: 'CLP', simbolo: '$', tasa: 1000, nombre: 'pesos chilenos' },
  PE: { codigo: 'PEN', simbolo: 'S/', tasa: 3.8, nombre: 'soles peruanos' },
  BR: { codigo: 'BRL', simbolo: 'R$', tasa: 6.2, nombre: 'reales' },
  ES: { codigo: 'EUR', simbolo: '€', tasa: 0.95, nombre: 'euros' },
  US: { codigo: 'USD', simbolo: '$', tasa: 1, nombre: 'dólares' },
  // Países adicionales
  EC: { codigo: 'USD', simbolo: '$', tasa: 1, nombre: 'dólares' }, // Ecuador usa USD
  PA: { codigo: 'USD', simbolo: '$', tasa: 1, nombre: 'dólares' }, // Panamá usa USD
  VE: { codigo: 'USD', simbolo: '$', tasa: 1, nombre: 'dólares' }, // Venezuela prefiere USD
  CR: { codigo: 'CRC', simbolo: '₡', tasa: 510, nombre: 'colones' },
  GT: { codigo: 'GTQ', simbolo: 'Q', tasa: 7.8, nombre: 'quetzales' },
  DO: { codigo: 'DOP', simbolo: 'RD$', tasa: 60, nombre: 'pesos dominicanos' },
  BO: { codigo: 'BOB', simbolo: 'Bs', tasa: 6.9, nombre: 'bolivianos' },
  PY: { codigo: 'PYG', simbolo: '₲', tasa: 7800, nombre: 'guaraníes' },
  HN: { codigo: 'HNL', simbolo: 'L', tasa: 25, nombre: 'lempiras' },
  NI: { codigo: 'NIO', simbolo: 'C$', tasa: 37, nombre: 'córdobas' },
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
