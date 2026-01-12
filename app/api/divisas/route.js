import { kv } from '@vercel/kv';

export const dynamic = 'force-dynamic';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function OPTIONS() {
  return new Response(null, { status: 200, headers: corsHeaders });
}

// ═══════════════════════════════════════════════════════════════════════════════
// API DE DIVISAS - Tasas actualizadas para geolocalización de precios
// ═══════════════════════════════════════════════════════════════════════════════

// Tasas por defecto (respaldo si falla la API externa)
const TASAS_DEFAULT = {
  USD: 1,
  UYU: 43,
  ARS: 1050,
  MXN: 17.5,
  COP: 4100,
  CLP: 950,
  PEN: 3.75,
  BRL: 5.2,
  EUR: 0.92,
  GBP: 0.79
};

// Configuración de monedas
const MONEDAS_CONFIG = {
  USD: { simbolo: '$', nombre: 'Dólares', decimales: 0, bandera: '🇺🇸' },
  UYU: { simbolo: '$', nombre: 'Pesos Uruguayos', decimales: 0, bandera: '🇺🇾' },
  ARS: { simbolo: '$', nombre: 'Pesos Argentinos', decimales: 0, bandera: '🇦🇷' },
  MXN: { simbolo: '$', nombre: 'Pesos Mexicanos', decimales: 0, bandera: '🇲🇽' },
  COP: { simbolo: '$', nombre: 'Pesos Colombianos', decimales: 0, bandera: '🇨🇴' },
  CLP: { simbolo: '$', nombre: 'Pesos Chilenos', decimales: 0, bandera: '🇨🇱' },
  PEN: { simbolo: 'S/', nombre: 'Soles', decimales: 2, bandera: '🇵🇪' },
  BRL: { simbolo: 'R$', nombre: 'Reales', decimales: 2, bandera: '🇧🇷' },
  EUR: { simbolo: '€', nombre: 'Euros', decimales: 2, bandera: '🇪🇺' },
  GBP: { simbolo: '£', nombre: 'Libras', decimales: 2, bandera: '🇬🇧' }
};

// Mapeo de países a monedas
const PAISES_MONEDA = {
  UY: 'UYU',
  AR: 'ARS',
  MX: 'MXN',
  CO: 'COP',
  CL: 'CLP',
  PE: 'PEN',
  BR: 'BRL',
  ES: 'EUR', PT: 'EUR', FR: 'EUR', DE: 'EUR', IT: 'EUR', NL: 'EUR', BE: 'EUR',
  GB: 'GBP', UK: 'GBP',
  US: 'USD', EC: 'USD', PA: 'USD', SV: 'USD'
};

// Obtener tasas actualizadas de API externa
async function obtenerTasasActualizadas() {
  try {
    // Usar exchangerate-api (gratis, 1500 requests/mes)
    const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD', {
      next: { revalidate: 43200 } // Cache por 12 horas
    });

    if (!response.ok) {
      throw new Error('Error obteniendo tasas');
    }

    const data = await response.json();

    // Extraer solo las monedas que nos interesan
    const tasas = {};
    for (const moneda of Object.keys(MONEDAS_CONFIG)) {
      tasas[moneda] = data.rates[moneda] || TASAS_DEFAULT[moneda];
    }

    // Guardar en KV con timestamp
    await kv.set('divisas:tasas', {
      tasas,
      actualizadoEn: new Date().toISOString(),
      fuente: 'exchangerate-api'
    });

    return tasas;

  } catch (e) {
    console.error('Error obteniendo tasas:', e);

    // Intentar obtener de KV
    const cached = await kv.get('divisas:tasas');
    if (cached) {
      return cached.tasas;
    }

    return TASAS_DEFAULT;
  }
}

// Formatear precio
function formatearPrecio(cantidad, moneda) {
  const config = MONEDAS_CONFIG[moneda] || MONEDAS_CONFIG.USD;
  const formateado = cantidad.toLocaleString('es-UY', {
    minimumFractionDigits: config.decimales,
    maximumFractionDigits: config.decimales
  });
  return `${config.simbolo}${formateado}`;
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const precioUSD = parseFloat(searchParams.get('precio')) || 0;
  const pais = searchParams.get('pais')?.toUpperCase();
  const soloTasas = searchParams.get('tasas') === 'true';

  try {
    // Obtener tasas (de cache o actualizadas)
    let cached = await kv.get('divisas:tasas');

    // Si no hay cache o tiene más de 12 horas, actualizar
    if (!cached || (Date.now() - new Date(cached.actualizadoEn).getTime()) > 43200000) {
      const tasas = await obtenerTasasActualizadas();
      cached = { tasas, actualizadoEn: new Date().toISOString() };
    }

    const tasas = cached.tasas;

    // Si solo piden las tasas
    if (soloTasas) {
      return Response.json({
        success: true,
        tasas,
        monedas: MONEDAS_CONFIG,
        paises: PAISES_MONEDA,
        actualizadoEn: cached.actualizadoEn
      }, { headers: corsHeaders });
    }

    // Si no hay precio, error
    if (!precioUSD) {
      return Response.json({
        error: 'Parámetro precio requerido'
      }, { status: 400, headers: corsHeaders });
    }

    // Determinar moneda del país
    const monedaPais = pais ? (PAISES_MONEDA[pais] || 'USD') : 'USD';
    const esUruguay = pais === 'UY';

    // Calcular precio principal
    const precioPrincipal = precioUSD * tasas[monedaPais];

    // Calcular conversiones para mostrar
    const conversiones = {};
    const monedasMostrar = esUruguay
      ? ['UYU'] // Uruguay solo ve UYU
      : ['USD', 'ARS', 'MXN', 'COP', 'EUR']; // Resto ve USD + aproximados

    for (const moneda of monedasMostrar) {
      if (moneda !== monedaPais) {
        conversiones[moneda] = {
          valor: Math.round(precioUSD * tasas[moneda]),
          formateado: formatearPrecio(precioUSD * tasas[moneda], moneda),
          config: MONEDAS_CONFIG[moneda]
        };
      }
    }

    // Respuesta según ubicación
    const respuesta = {
      success: true,
      pais: pais || 'DESCONOCIDO',
      esUruguay,

      // Precio principal
      precio: {
        USD: precioUSD,
        moneda: monedaPais,
        valor: Math.round(precioPrincipal),
        formateado: formatearPrecio(precioPrincipal, monedaPais),
        config: MONEDAS_CONFIG[monedaPais]
      },

      // Mensaje de envío
      envio: esUruguay
        ? {
            mensaje: 'Envíos a todo Uruguay',
            metodos: ['Correo Uruguayo', 'DAC', 'Mirtrans', 'Retiro en Piriápolis'],
            tiempoEstimado: '3-5 días hábiles'
          }
        : {
            mensaje: 'Envíos Express a todo el mundo',
            metodos: ['DHL Express', 'FedEx International'],
            tiempoEstimado: '7-15 días hábiles'
          },

      // Formas de pago
      pago: esUruguay
        ? {
            metodos: ['Mercado Pago', 'Transferencia BROU/Itaú/Santander', 'Abitab/RedPagos', 'Efectivo'],
            cuotas: 'Hasta 12 cuotas sin interés'
          }
        : {
            metodos: ['PayPal', 'Tarjeta Internacional', 'Transferencia SWIFT'],
            cuotas: null
          },

      // Conversiones aproximadas (para mostrar entre paréntesis)
      conversiones,

      // Meta
      actualizadoEn: cached.actualizadoEn
    };

    return Response.json(respuesta, { headers: corsHeaders });

  } catch (error) {
    console.error('Error en API divisas:', error);
    return Response.json({
      success: false,
      error: error.message
    }, { status: 500, headers: corsHeaders });
  }
}
