/**
 * TITO 3.0 - SISTEMA DE RECOMENDACIÓN (Simplificado)
 *
 * Funciones esenciales:
 * - Detectar necesidades del cliente
 * - Buscar historial de compras
 */

import { kv } from '@vercel/kv';

// Categorías y sus keywords
const CATEGORIAS = {
  proteccion: ['proteccion', 'proteger', 'miedo', 'negativ', 'envidia', 'mal de ojo', 'segur'],
  abundancia: ['abundancia', 'dinero', 'prosperidad', 'trabajo', 'negocio', 'plata', 'exito'],
  amor: ['amor', 'pareja', 'corazon', 'relacion', 'soledad', 'romanc'],
  sanacion: ['sanacion', 'sanar', 'salud', 'dolor', 'traum', 'duelo', 'ansiedad'],
  paz: ['paz', 'calma', 'tranquil', 'estres', 'dormir', 'equilibrio']
};

/**
 * Analiza un mensaje y detecta las necesidades del cliente
 */
export function analizarNecesidades(mensaje) {
  const msgLower = mensaje.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const necesidades = [];

  for (const [categoria, keywords] of Object.entries(CATEGORIAS)) {
    for (const keyword of keywords) {
      if (msgLower.includes(keyword)) {
        if (!necesidades.includes(categoria)) {
          necesidades.push(categoria);
        }
        break;
      }
    }
  }

  return necesidades;
}

/**
 * Analiza toda la conversación para detectar patrones
 */
export function analizarConversacion(historial) {
  const perfil = {
    necesidadesOrdenadas: [],
    sentimiento: 'neutral',
    urgencia: 'normal'
  };

  const conteoNecesidades = {};

  for (const mensaje of historial) {
    if (mensaje.role === 'user') {
      const necesidades = analizarNecesidades(mensaje.content);

      for (const necesidad of necesidades) {
        conteoNecesidades[necesidad] = (conteoNecesidades[necesidad] || 0) + 1;
      }

      // Detectar urgencia
      if (/urgente|ya|ahora|rapido|necesito ya/i.test(mensaje.content)) {
        perfil.urgencia = 'alta';
      }

      // Detectar sentimiento
      if (/triste|mal|dolor|sufr|llor|desesper/i.test(mensaje.content)) {
        perfil.sentimiento = 'vulnerable';
      }
    }
  }

  // Ordenar necesidades por frecuencia
  perfil.necesidadesOrdenadas = Object.entries(conteoNecesidades)
    .sort((a, b) => b[1] - a[1])
    .map(([categoria, count]) => ({ categoria, count }));

  return perfil;
}

/**
 * Busca historial de compras de un cliente
 */
export async function buscarHistorialCliente(identificador) {
  if (!identificador) return null;

  try {
    const posiblesKeys = [
      `user:${identificador.toLowerCase()}`,
      `elegido:${identificador.toLowerCase()}`,
      `tito:cliente:${identificador}`
    ];

    for (const key of posiblesKeys) {
      const data = await kv.get(key);
      if (data) {
        return {
          esClienteRepetido: (data.guardianes?.length || 0) > 0,
          guardianesPrevios: data.guardianes || [],
          nombre: data.nombre || data.nombrePreferido || null,
          email: data.email || null
        };
      }
    }

    return null;
  } catch (error) {
    console.error('[Recomendaciones] Error:', error);
    return null;
  }
}

/**
 * Función principal simplificada
 */
export async function recomendarGuardian({
  mensaje,
  historial = [],
  productos,
  subscriberId = null,
  email = null,
  limite = 3
}) {
  // 1. Analizar conversación
  const mensajesCompletos = [...historial];
  if (mensaje) {
    mensajesCompletos.push({ role: 'user', content: mensaje });
  }
  const perfilCliente = analizarConversacion(mensajesCompletos);

  // 2. Buscar si es cliente repetido
  const identificador = email || subscriberId;
  const historialCompras = identificador ? await buscarHistorialCliente(identificador) : null;

  // 3. Filtrar productos por necesidad principal
  const necesidadPrincipal = perfilCliente.necesidadesOrdenadas[0]?.categoria || null;
  let productosRecomendados = productos.filter(p => p.disponible);

  if (necesidadPrincipal) {
    // 1. Primero buscar por intenciones (taxonomía custom - más preciso)
    let filtrados = productosRecomendados.filter(p =>
      (p.intenciones || []).includes(necesidadPrincipal)
    );

    // 2. Si no hay, buscar por flags booleanos
    if (filtrados.length === 0) {
      const flagMap = {
        'proteccion': 'esProteccion',
        'abundancia': 'esAbundancia',
        'amor': 'esAmor',
        'sanacion': 'esSanacion',
        'paz': 'esPaz'
      };
      const flag = flagMap[necesidadPrincipal];
      if (flag) {
        filtrados = productosRecomendados.filter(p => p[flag]);
      }
    }

    // 3. Fallback: buscar en categorías WooCommerce
    if (filtrados.length === 0) {
      filtrados = productosRecomendados.filter(p => {
        const cats = (p.categorias || []).join(' ').toLowerCase();
        return cats.includes(necesidadPrincipal);
      });
    }

    if (filtrados.length > 0) {
      productosRecomendados = filtrados;
    }
  }

  // 4. Randomizar y limitar
  productosRecomendados = productosRecomendados
    .sort(() => Math.random() - 0.5)
    .slice(0, limite);

  // 5. Mensaje para cliente repetido
  let mensajeClienteRepetido = null;
  if (historialCompras?.esClienteRepetido) {
    const nombre = historialCompras.nombre ? `, ${historialCompras.nombre}` : '';
    mensajeClienteRepetido = `¡Ey${nombre}! Qué bueno verte de nuevo 🍀`;
  }

  return {
    success: true,
    perfilCliente,
    esClienteRepetido: historialCompras?.esClienteRepetido || false,
    mensajeClienteRepetido,
    recomendaciones: productosRecomendados,
    mensaje: necesidadPrincipal
      ? `Para ${necesidadPrincipal}, te muestro estos guardianes:`
      : 'Te muestro algunos guardianes:'
  };
}

// Combos simples para la promo 3x2
export const COMBOS_RECOMENDADOS = [
  { nombre: 'Protección Total', tipos: ['duende', 'dragon'] },
  { nombre: 'Abundancia Completa', tipos: ['gnomo', 'duende'] },
  { nombre: 'Sanación Profunda', tipos: ['elfo', 'hada'] }
];

export default recomendarGuardian;
