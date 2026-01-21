import { kv } from '@vercel/kv';

// ═══════════════════════════════════════════════════════════════
// API PÚBLICA DE PRODUCTO - Para WordPress
// Devuelve datos completos con historia, neuromarketing, precios geo
// ═══════════════════════════════════════════════════════════════

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function OPTIONS() {
  return new Response(null, { headers: CORS_HEADERS });
}

// Tasas de cambio (actualizar periódicamente)
const TASAS_CAMBIO = {
  USD: { simbolo: '$', tasa: 1, nombre: 'USD', decimales: 2 },
  UYU: { simbolo: '$', tasa: 43, nombre: 'UYU', decimales: 0 },
  ARS: { simbolo: '$', tasa: 1050, nombre: 'ARS', decimales: 0 },
  BRL: { simbolo: 'R$', tasa: 5.2, nombre: 'BRL', decimales: 2 },
  EUR: { simbolo: '€', tasa: 0.92, nombre: 'EUR', decimales: 2 },
  CLP: { simbolo: '$', tasa: 950, nombre: 'CLP', decimales: 0 },
  MXN: { simbolo: '$', tasa: 17, nombre: 'MXN', decimales: 0 },
  COP: { simbolo: '$', tasa: 4000, nombre: 'COP', decimales: 0 },
  PEN: { simbolo: 'S/', tasa: 3.7, nombre: 'PEN', decimales: 2 },
};

// Mapeo de países a monedas
const PAISES_MONEDA = {
  UY: 'UYU', AR: 'ARS', BR: 'BRL', CL: 'CLP',
  MX: 'MXN', CO: 'COP', PE: 'PEN', ES: 'EUR',
  US: 'USD', EC: 'USD', VE: 'USD', PY: 'USD',
  BO: 'USD', CR: 'USD', PA: 'USD', GT: 'USD',
};

function formatearPrecio(precioUSD, moneda) {
  const config = TASAS_CAMBIO[moneda] || TASAS_CAMBIO.USD;
  const precioLocal = precioUSD * config.tasa;
  const formateado = precioLocal.toLocaleString('es-UY', {
    minimumFractionDigits: config.decimales,
    maximumFractionDigits: config.decimales
  });
  return `${config.simbolo}${formateado} ${config.nombre}`;
}

// Obtener producto de WooCommerce
async function obtenerProductoWoo(productId) {
  const WP_URL = process.env.WORDPRESS_URL || 'https://duendesdeluruguay.com';
  const auth = Buffer.from(`${process.env.WC_CONSUMER_KEY}:${process.env.WC_CONSUMER_SECRET}`).toString('base64');

  try {
    const res = await fetch(`${WP_URL}/wp-json/wc/v3/products/${productId}`, {
      headers: { 'Authorization': `Basic ${auth}` },
      next: { revalidate: 300 } // Cache 5 min
    });

    if (!res.ok) return null;
    return await res.json();
  } catch (e) {
    console.error('Error obteniendo producto WOO:', e);
    return null;
  }
}

// Obtener productos relacionados
async function obtenerRelacionados(ids) {
  if (!ids || ids.length === 0) return [];

  const WP_URL = process.env.WORDPRESS_URL || 'https://duendesdeluruguay.com';
  const auth = Buffer.from(`${process.env.WC_CONSUMER_KEY}:${process.env.WC_CONSUMER_SECRET}`).toString('base64');

  try {
    const res = await fetch(`${WP_URL}/wp-json/wc/v3/products?include=${ids.slice(0, 4).join(',')}`, {
      headers: { 'Authorization': `Basic ${auth}` },
      next: { revalidate: 300 }
    });

    if (!res.ok) return [];
    const productos = await res.json();

    return productos.map(p => ({
      id: p.id,
      nombre: p.name,
      imagen: p.images?.[0]?.src,
      precio: p.price,
      url: p.permalink
    }));
  } catch (e) {
    return [];
  }
}

export async function GET(request, { params }) {
  const productId = params.id;
  const { searchParams } = new URL(request.url);
  const pais = searchParams.get('pais')?.toUpperCase() || 'UY';

  try {
    // 1. Intentar obtener datos enriquecidos de KV
    let datosEnriquecidos = await kv.get(`producto:${productId}`);

    // 2. Obtener producto base de WooCommerce
    const productoWoo = await obtenerProductoWoo(productId);

    if (!productoWoo) {
      return Response.json({
        success: false,
        error: 'Producto no encontrado'
      }, { status: 404, headers: CORS_HEADERS });
    }

    // 3. Determinar moneda según país
    const moneda = PAISES_MONEDA[pais] || 'USD';
    const precioUSD = parseFloat(productoWoo.price) || 0;

    // 4. Calcular precio de seña (30%)
    const porcentajeSena = 0.30;
    const senaUSD = precioUSD * porcentajeSena;

    // 5. Extraer categorías y atributos
    const categorias = productoWoo.categories?.map(c => c.name) || [];
    const atributos = productoWoo.attributes || [];

    // Detectar tipo de guardián por categorías o atributos
    const tiposGuardian = ['duende', 'elfo', 'hada', 'mago', 'bruja', 'gnomo'];
    const propositos = ['protección', 'proteccion', 'abundancia', 'amor', 'sanación', 'sanacion', 'sabiduría', 'sabiduria'];
    const elementos = ['tierra', 'agua', 'fuego', 'aire', 'éter', 'eter'];

    const tipo = tiposGuardian.find(t =>
      productoWoo.name?.toLowerCase().includes(t) ||
      categorias.some(c => c.toLowerCase().includes(t))
    ) || 'guardián';

    const proposito = propositos.find(p =>
      categorias.some(c => c.toLowerCase().includes(p))
    ) || 'protección';

    const elemento = elementos.find(e =>
      atributos.some(a => a.options?.some(o => o.toLowerCase().includes(e)))
    ) || 'tierra';

    // 6. Construir respuesta completa
    const respuesta = {
      success: true,
      id: productoWoo.id,
      nombre: productoWoo.name,
      slug: productoWoo.slug,
      url: productoWoo.permalink,

      // Clasificación mágica
      tipo: tipo.charAt(0).toUpperCase() + tipo.slice(1),
      elemento: elemento.charAt(0).toUpperCase() + elemento.slice(1),
      proposito: proposito.charAt(0).toUpperCase() + proposito.slice(1),

      // Imágenes
      imagenes: productoWoo.images?.map(i => i.src) || [],
      imagenPrincipal: productoWoo.images?.[0]?.src,
      imagenBanner: productoWoo.images?.[0]?.src,

      // Precios geolocalizados
      precio: {
        USD: precioUSD,
        local: precioUSD * (TASAS_CAMBIO[moneda]?.tasa || 1),
        moneda: moneda,
        mostrar: formatearPrecio(precioUSD, moneda),
        original: productoWoo.regular_price !== productoWoo.price
          ? formatearPrecio(parseFloat(productoWoo.regular_price), moneda)
          : null
      },

      // Sistema de seña
      sena: {
        habilitada: precioUSD >= 50, // Solo para productos de más de $50
        porcentaje: 30,
        USD: senaUSD,
        mostrar: formatearPrecio(senaUSD, moneda),
        diasReserva: 30,
        mensaje: `Reservalo con solo ${formatearPrecio(senaUSD, moneda)} y completá el pago en 30 días`
      },

      // Descripción WooCommerce
      descripcionCorta: productoWoo.short_description?.replace(/<[^>]*>/g, ''),
      descripcion: productoWoo.description?.replace(/<[^>]*>/g, ''),

      // ═══════════════════════════════════════════════════════════════
      // NUEVA ESTRUCTURA V2.0 - Contenido épico completo
      // ═══════════════════════════════════════════════════════════════

      // Encabezado
      encabezado: datosEnriquecidos?.encabezado || null,

      // Vida Anterior - LA SECCIÓN MÁS IMPORTANTE
      vidaAnterior: datosEnriquecidos?.vidaAnterior || null,

      // El Encuentro - Cómo cruzó el portal
      elEncuentro: datosEnriquecidos?.elEncuentro || null,

      // Personalidad
      personalidad: datosEnriquecidos?.personalidad || null,

      // Dones/Fortalezas
      dones: datosEnriquecidos?.dones || null,

      // Mensaje directo del guardián (primera persona)
      mensajeDirecto: datosEnriquecidos?.mensajeDirecto || null,

      // Señales de que es para vos
      señales: datosEnriquecidos?.señales || null,

      // Ritual de bienvenida
      ritual: datosEnriquecidos?.ritual || null,

      // Cuidados
      cuidados: datosEnriquecidos?.cuidados || null,

      // Afinidades con otros guardianes
      afinidades: datosEnriquecidos?.afinidades || null,

      // Garantía mágica
      garantiaMagica: datosEnriquecidos?.garantiaMagica || null,

      // Urgencia/escasez
      urgencia: datosEnriquecidos?.urgencia || {
        principal: `${productoWoo.name} eligió manifestarse UNA sola vez`,
        escasez: 'Cuando se va, desaparece del universo para siempre',
        llamadoFinal: 'Si sentiste algo al verlo, eso es real. Es tu alma reconociendo lo que necesita.'
      },

      // SEO
      seo: datosEnriquecidos?.seo || null,

      // Metadatos
      metaDatos: datosEnriquecidos?.metaDatos || null,

      // ═══════════════════════════════════════════════════════════════
      // COMPATIBILIDAD V1.0 - Formato anterior
      // ═══════════════════════════════════════════════════════════════

      // Historia (formato anterior)
      historia: datosEnriquecidos?.historia || {
        origen: datosEnriquecidos?.vidaAnterior?.texto || null,
        personalidad: datosEnriquecidos?.personalidad?.texto || null,
        fortalezas: datosEnriquecidos?.dones?.lista?.map(d => d.nombre) || [],
        afinidades: datosEnriquecidos?.afinidades?.guardianes?.map(g => g.nombre) || [],
        mensajePoder: datosEnriquecidos?.mensajeDirecto?.mensaje?.substring(0, 100) || null,
        ritual: datosEnriquecidos?.ritual?.pasos?.map(p => p.descripcion).join(' ') || null,
        cuidados: datosEnriquecidos?.cuidados?.ubicacion || null
      },

      // Neuromarketing (formato anterior)
      neuromarketing: datosEnriquecidos?.neuromarketing || {
        urgencia: datosEnriquecidos?.urgencia?.principal || 'Pieza única e irrepetible en el mundo',
        escasez: datosEnriquecidos?.urgencia?.escasez || 'Cuando se va, desaparece para siempre',
        beneficios: datosEnriquecidos?.dones?.lista?.map(d => d.descripcion) || [
          `${proposito.charAt(0).toUpperCase() + proposito.slice(1)} energética para tu vida`,
          'Compañero silencioso que cuida tu espacio',
          'Conexión con lo ancestral y mágico',
          'Recordatorio diario de tu poder interior'
        ],
        garantia: datosEnriquecidos?.garantiaMagica?.texto || '30 días de garantía mágica',
        envio: 'Envío seguro a todo el mundo',
        canalización: 'Canalización personalizada incluida'
      },

      // Stock
      enStock: productoWoo.stock_status === 'instock',
      stockCantidad: productoWoo.stock_quantity || 1,
      esUnico: true, // Siempre son piezas únicas

      // Categorías y tags
      categorias: categorias,
      etiquetas: productoWoo.tags?.map(t => t.name) || [],

      // Productos relacionados
      relacionados: await obtenerRelacionados(productoWoo.related_ids),

      // Testimonios (de KV si existen)
      testimonios: datosEnriquecidos?.testimonios || [
        {
          texto: "Desde que llegó, mi casa se siente diferente. Una energía hermosa.",
          autor: "María L.",
          pais: "Uruguay",
          estrellas: 5
        },
        {
          texto: "No pensé que iba a conectar tanto con un guardián. Es mágico de verdad.",
          autor: "Carolina S.",
          pais: "Argentina",
          estrellas: 5
        }
      ],

      // Meta
      meta: {
        generadoPor: 'Duendes del Uruguay API',
        version: '1.0',
        paisDetectado: pais,
        monedaUsada: moneda
      }
    };

    return Response.json(respuesta, { headers: CORS_HEADERS });

  } catch (error) {
    console.error('Error en API producto:', error);
    return Response.json({
      success: false,
      error: error.message
    }, { status: 500, headers: CORS_HEADERS });
  }
}
