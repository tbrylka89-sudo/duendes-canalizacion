/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * TITO 3.0 - SISTEMA DE RECOMENDACIÓN INTELIGENTE
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Sistema que analiza la conversación y recomienda guardianes de forma inteligente:
 * - Scoring guardián-cliente basado en necesidades
 * - Cross-sell con guardianes complementarios
 * - Detección de clientes repetidos
 * - Recomendaciones personalizadas
 */

import { kv } from '@vercel/kv';

// ═══════════════════════════════════════════════════════════════
// CATEGORÍAS Y NECESIDADES
// ═══════════════════════════════════════════════════════════════

const CATEGORIAS = {
  proteccion: {
    keywords: ['proteccion', 'proteger', 'escudo', 'defensa', 'malo', 'negativ', 'miedo', 'peligro', 'cuidar', 'segur', 'envidia', 'malas vibras', 'energia negativa', 'brujeria', 'mal de ojo'],
    descripcion: 'Guardianes que te protegen de energías negativas y crean un escudo a tu alrededor',
    peso: 1.0
  },
  abundancia: {
    keywords: ['abundancia', 'dinero', 'prosperidad', 'trabajo', 'negocio', 'plata', 'riqueza', 'oportunidad', 'exito', 'suerte', 'fortuna', 'economía', 'deuda', 'bloqueo financiero'],
    descripcion: 'Guardianes que atraen prosperidad y desbloquean caminos de abundancia',
    peso: 1.0
  },
  amor: {
    keywords: ['amor', 'pareja', 'corazon', 'relacion', 'soledad', 'afecto', 'romanc', 'matrimonio', 'novio', 'novia', 'alma gemela', 'conexion', 'desamor', 'ruptura'],
    descripcion: 'Guardianes del amor propio y las relaciones genuinas',
    peso: 1.0
  },
  sanacion: {
    keywords: ['sanacion', 'sanar', 'salud', 'curar', 'enferm', 'bienestar', 'dolor', 'herida', 'traum', 'depresion', 'ansiedad', 'duelo', 'perdida', 'alivio'],
    descripcion: 'Guardianes sanadores que ayudan a soltar el dolor y encontrar equilibrio',
    peso: 1.0
  },
  paz: {
    keywords: ['paz', 'calma', 'tranquil', 'armon', 'serenidad', 'estres', 'nervios', 'ansiedad', 'descanso', 'dormir', 'insomnio', 'meditar', 'equilibrio'],
    descripcion: 'Guardianes que traen paz interior y armonía al hogar',
    peso: 0.9
  },
  hogar: {
    keywords: ['hogar', 'casa', 'familia', 'espacio', 'limpiar', 'ambiente', 'mudanza', 'nuevo hogar', 'bendecir', 'energia del hogar'],
    descripcion: 'Guardianes protectores del hogar y la familia',
    peso: 0.9
  },
  sabiduria: {
    keywords: ['sabidur', 'conocimiento', 'aprender', 'guia', 'decision', 'camino', 'claridad', 'intuicion', 'despertar', 'espiritual', 'meditacion', 'conexion'],
    descripcion: 'Guardianes que iluminan el camino y despiertan la intuición',
    peso: 0.85
  }
};

// ═══════════════════════════════════════════════════════════════
// GUARDIANES COMPLEMENTARIOS (Cross-sell)
// ═══════════════════════════════════════════════════════════════

const COMPLEMENTOS = {
  // Protección total: uno trabaja sombras, otro vigila
  proteccion: {
    complementa: ['sanacion', 'paz'],
    mensaje: 'Los guardianes de protección trabajan mejor acompañados de sanadores - uno limpia, el otro protege.',
    parejas_sugeridas: [
      {
        tipos: ['duende', 'dragon'],
        razon: 'El duende cuida el hogar mientras el dragón guarda las entradas de energía negativa'
      },
      {
        tipos: ['bruja', 'elfo'],
        razon: 'La bruja transmuta lo negativo mientras el elfo eleva la vibración del espacio'
      }
    ]
  },
  abundancia: {
    complementa: ['proteccion', 'sabiduria'],
    mensaje: 'La abundancia necesita protección para no escaparse y sabiduría para multiplicarse.',
    parejas_sugeridas: [
      {
        tipos: ['gnomo', 'duende'],
        razon: 'El gnomo atrae la fortuna, el duende la protege dentro del hogar'
      },
      {
        tipos: ['gnomo', 'mago'],
        razon: 'El gnomo abre puertas de prosperidad, el mago te guía a elegir las correctas'
      }
    ]
  },
  amor: {
    complementa: ['sanacion', 'paz'],
    mensaje: 'El amor florece cuando sanamos heridas pasadas y encontramos paz interior.',
    parejas_sugeridas: [
      {
        tipos: ['hada', 'elfo'],
        razon: 'El hada despierta el amor propio, el elfo sana las heridas del corazón'
      },
      {
        tipos: ['hada', 'bruja'],
        razon: 'El hada atrae el amor verdadero, la bruja te libera de patrones tóxicos'
      }
    ]
  },
  sanacion: {
    complementa: ['paz', 'proteccion'],
    mensaje: 'Sanar es un proceso que requiere paz para procesar y protección para no absorber más.',
    parejas_sugeridas: [
      {
        tipos: ['elfo', 'duende'],
        razon: 'El elfo sana el alma mientras el duende protege tu espacio de sanación'
      }
    ]
  },
  paz: {
    complementa: ['sanacion', 'sabiduria'],
    mensaje: 'La paz llega cuando sanamos y tenemos claridad de pensamiento.',
    parejas_sugeridas: [
      {
        tipos: ['elfo', 'mago'],
        razon: 'El elfo calma las emociones, el mago ordena los pensamientos'
      }
    ]
  }
};

// ═══════════════════════════════════════════════════════════════
// ELEMENTOS Y SU SINERGIA
// ═══════════════════════════════════════════════════════════════

const ELEMENTOS = {
  tierra: {
    tipos: ['gnomo', 'duende'],
    potencia: ['tierra', 'agua'], // Se potencia con estos
    descripcion: 'Estabilidad, abundancia material, protección del hogar'
  },
  fuego: {
    tipos: ['dragon', 'bruja'],
    potencia: ['fuego', 'aire'],
    descripcion: 'Transformación, fuerza, protección activa'
  },
  agua: {
    tipos: ['hada', 'elfo'],
    potencia: ['agua', 'tierra'],
    descripcion: 'Emociones, sanación, amor, intuición'
  },
  aire: {
    tipos: ['mago'],
    potencia: ['aire', 'fuego'],
    descripcion: 'Sabiduría, comunicación, claridad mental'
  }
};

// ═══════════════════════════════════════════════════════════════
// FUNCIONES DE SCORING
// ═══════════════════════════════════════════════════════════════

/**
 * Analiza un mensaje y detecta las necesidades del cliente
 * @param {string} mensaje - El mensaje del cliente
 * @returns {object} - Objeto con las necesidades detectadas y sus scores
 */
export function analizarNecesidades(mensaje) {
  const msgLower = mensaje.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const necesidades = {};

  for (const [categoria, config] of Object.entries(CATEGORIAS)) {
    let score = 0;
    let keywordsEncontradas = [];

    for (const keyword of config.keywords) {
      const keywordNorm = keyword.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      if (msgLower.includes(keywordNorm)) {
        score += config.peso;
        keywordsEncontradas.push(keyword);
      }
    }

    if (score > 0) {
      necesidades[categoria] = {
        score: score,
        keywords: keywordsEncontradas,
        descripcion: config.descripcion
      };
    }
  }

  return necesidades;
}

/**
 * Analiza toda la conversación para entender mejor al cliente
 * @param {array} historial - Array de mensajes del historial
 * @returns {object} - Perfil de necesidades del cliente
 */
export function analizarConversacion(historial) {
  const perfilCliente = {
    necesidadesPrincipales: {},
    mencionesGuardianes: [],
    sentimiento: 'neutral',
    urgencia: 'normal',
    presupuesto: null
  };

  // Acumular necesidades de toda la conversación
  for (const mensaje of historial) {
    if (mensaje.role === 'user') {
      const necesidades = analizarNecesidades(mensaje.content);

      for (const [categoria, data] of Object.entries(necesidades)) {
        if (!perfilCliente.necesidadesPrincipales[categoria]) {
          perfilCliente.necesidadesPrincipales[categoria] = { score: 0, menciones: 0 };
        }
        perfilCliente.necesidadesPrincipales[categoria].score += data.score;
        perfilCliente.necesidadesPrincipales[categoria].menciones += 1;
      }

      // Detectar urgencia
      if (/urgente|ya|ahora|rapido|necesito ya|cuanto antes/i.test(mensaje.content)) {
        perfilCliente.urgencia = 'alta';
      }

      // Detectar presupuesto
      const matchPresupuesto = mensaje.content.match(/(?:presupuesto|gastar|tengo|hasta|máximo?)\s*(?:de|unos?)?\s*\$?\s*(\d+)/i);
      if (matchPresupuesto) {
        perfilCliente.presupuesto = parseInt(matchPresupuesto[1]);
      }

      // Detectar sentimiento
      if (/triste|mal|dolor|sufr|llor|angust|desesper/i.test(mensaje.content)) {
        perfilCliente.sentimiento = 'vulnerable';
      } else if (/feliz|bien|content|emocion|genial/i.test(mensaje.content)) {
        perfilCliente.sentimiento = 'positivo';
      }
    }
  }

  // Ordenar necesidades por score
  perfilCliente.necesidadesOrdenadas = Object.entries(perfilCliente.necesidadesPrincipales)
    .sort((a, b) => b[1].score - a[1].score)
    .map(([categoria, data]) => ({ categoria, ...data }));

  return perfilCliente;
}

/**
 * Calcula el score de compatibilidad entre un guardián y un perfil de cliente
 * @param {object} guardian - Producto/guardián
 * @param {object} perfilCliente - Perfil analizado del cliente
 * @returns {number} - Score de 0 a 100
 */
export function calcularCompatibilidad(guardian, perfilCliente) {
  let score = 0;
  const maxScore = 100;

  // 1. Match por categoría/necesidad (hasta 50 puntos)
  for (const necesidad of perfilCliente.necesidadesOrdenadas || []) {
    if (guardian.esProteccion && necesidad.categoria === 'proteccion') score += 25;
    if (guardian.esAbundancia && necesidad.categoria === 'abundancia') score += 25;
    if (guardian.esAmor && necesidad.categoria === 'amor') score += 25;
    if (guardian.esSanacion && necesidad.categoria === 'sanacion') score += 25;
    if (guardian.esPaz && necesidad.categoria === 'paz') score += 20;

    // Buscar en categorías del producto
    const cats = (guardian.categorias || []).join(' ').toLowerCase();
    if (cats.includes(necesidad.categoria)) score += 15;
  }

  // 2. Match por tipo preferido (hasta 20 puntos)
  // Si mencionaron un tipo específico
  for (const necesidad of perfilCliente.necesidadesOrdenadas || []) {
    const tipoPreferido = ELEMENTOS[Object.keys(ELEMENTOS).find(el =>
      ELEMENTOS[el].tipos.some(t => necesidad.categoria.includes(t))
    )]?.tipos || [];

    if (tipoPreferido.includes(guardian.tipo)) {
      score += 20;
      break;
    }
  }

  // 3. Match por presupuesto (hasta 15 puntos)
  if (perfilCliente.presupuesto) {
    if (guardian.precio <= perfilCliente.presupuesto) {
      score += 15;
    } else if (guardian.precio <= perfilCliente.presupuesto * 1.2) {
      score += 10; // Un poco arriba pero cerca
    }
  } else {
    score += 10; // Sin presupuesto definido, neutral
  }

  // 4. Disponibilidad (hasta 10 puntos)
  if (guardian.disponible) score += 10;

  // 5. Bonus por oferta (5 puntos extra)
  if (guardian.enOferta) score += 5;

  return Math.min(score, maxScore);
}

// ═══════════════════════════════════════════════════════════════
// RECOMENDACIONES INTELIGENTES
// ═══════════════════════════════════════════════════════════════

/**
 * Genera recomendaciones inteligentes basadas en el análisis
 * @param {array} productos - Lista de productos disponibles
 * @param {object} perfilCliente - Perfil del cliente
 * @param {object} opciones - Opciones adicionales (limite, excluir, etc)
 * @returns {object} - Recomendaciones con explicaciones
 */
export function generarRecomendaciones(productos, perfilCliente, opciones = {}) {
  const { limite = 3, excluirIds = [], incluirCrossSell = true } = opciones;

  // Filtrar solo disponibles y no excluidos
  const disponibles = productos.filter(p =>
    p.disponible && !excluirIds.includes(p.id)
  );

  // Calcular score para cada guardián
  const guardianesConScore = disponibles.map(g => ({
    ...g,
    compatibilidad: calcularCompatibilidad(g, perfilCliente)
  }));

  // Ordenar por compatibilidad
  guardianesConScore.sort((a, b) => b.compatibilidad - a.compatibilidad);

  // Tomar los mejores
  const recomendados = guardianesConScore.slice(0, limite);

  // Generar cross-sell si corresponde
  let crossSell = [];
  if (incluirCrossSell && recomendados.length > 0 && perfilCliente.necesidadesOrdenadas?.length > 0) {
    const necesidadPrincipal = perfilCliente.necesidadesOrdenadas[0].categoria;
    const complemento = COMPLEMENTOS[necesidadPrincipal];

    if (complemento) {
      // Buscar guardianes complementarios
      for (const catComplementaria of complemento.complementa) {
        const guardianesComplementarios = guardianesConScore.filter(g => {
          const cats = (g.categorias || []).join(' ').toLowerCase();
          return cats.includes(catComplementaria) && !recomendados.some(r => r.id === g.id);
        }).slice(0, 1);

        if (guardianesComplementarios.length > 0) {
          crossSell.push({
            guardian: guardianesComplementarios[0],
            razon: complemento.mensaje
          });
        }
      }
    }
  }

  // Generar mensaje de recomendación personalizado
  const mensajeRecomendacion = generarMensajeRecomendacion(recomendados, perfilCliente, crossSell);

  return {
    recomendados,
    crossSell: crossSell.slice(0, 2), // Máximo 2 cross-sell
    mensaje: mensajeRecomendacion,
    perfilDetectado: {
      necesidadPrincipal: perfilCliente.necesidadesOrdenadas?.[0]?.categoria || 'general',
      sentimiento: perfilCliente.sentimiento,
      urgencia: perfilCliente.urgencia
    }
  };
}

/**
 * Genera un mensaje personalizado de recomendación
 */
function generarMensajeRecomendacion(recomendados, perfilCliente, crossSell) {
  if (recomendados.length === 0) {
    return 'No encontré guardianes que coincidan exactamente con lo que buscás, pero tengo otros que podrían resonar contigo.';
  }

  const necesidadPrincipal = perfilCliente.necesidadesOrdenadas?.[0]?.categoria;
  let mensaje = '';

  // Intro según necesidad
  switch (necesidadPrincipal) {
    case 'proteccion':
      mensaje = 'Para lo que necesitás, te recomiendo guardianes con fuerte energía protectora.';
      break;
    case 'abundancia':
      mensaje = 'Si buscás atraer prosperidad, estos guardianes son especialistas en abrir caminos.';
      break;
    case 'amor':
      mensaje = 'Para trabajar el amor y las relaciones, estos guardianes tienen dones especiales.';
      break;
    case 'sanacion':
      mensaje = 'Para sanar y soltar lo que te pesa, estos guardianes trabajan desde el corazón.';
      break;
    case 'paz':
      mensaje = 'Para encontrar paz y calma, estos guardianes traen serenidad donde estén.';
      break;
    default:
      mensaje = 'Basándome en lo que me contaste, estos guardianes podrían resonar contigo.';
  }

  // Agregar info de cross-sell si hay
  if (crossSell.length > 0) {
    mensaje += ` Y te cuento algo: ${crossSell[0].razon}`;
  }

  return mensaje;
}

// ═══════════════════════════════════════════════════════════════
// DETECCIÓN DE CLIENTES REPETIDOS
// ═══════════════════════════════════════════════════════════════

/**
 * Busca historial de compras de un cliente
 * @param {string} identificador - Email, subscriberId o teléfono
 * @returns {object|null} - Historial del cliente o null
 */
export async function buscarHistorialCliente(identificador) {
  if (!identificador) return null;

  try {
    // Buscar por diferentes keys
    const posiblesKeys = [
      `user:${identificador.toLowerCase()}`,
      `elegido:${identificador.toLowerCase()}`,
      `tito:cliente:${identificador}`
    ];

    for (const key of posiblesKeys) {
      const data = await kv.get(key);
      if (data) {
        return {
          key,
          data,
          esClienteRepetido: (data.guardianes?.length || 0) > 0 || (data.compras?.length || 0) > 0,
          guardianesPrevios: data.guardianes || [],
          totalCompras: data.totalCompras || data.gastado || 0,
          ultimaCompra: data.ultimaCompra || null,
          nombre: data.nombre || data.nombrePreferido || null,
          email: data.email || null
        };
      }
    }

    return null;
  } catch (error) {
    console.error('[Recomendaciones] Error buscando historial:', error);
    return null;
  }
}

/**
 * Genera mensaje personalizado para cliente repetido
 * @param {object} historial - Historial del cliente
 * @returns {string} - Mensaje personalizado
 */
export function generarMensajeClienteRepetido(historial) {
  if (!historial || !historial.esClienteRepetido) return null;

  const nombre = historial.nombre ? `, ${historial.nombre}` : '';
  const cantidadGuardianes = historial.guardianesPrevios?.length || 0;

  let mensaje = `¡Ey${nombre}! Qué alegría verte de nuevo por acá. `;

  if (cantidadGuardianes === 1) {
    mensaje += '¿Cómo te está yendo con tu guardián? ';
  } else if (cantidadGuardianes > 1) {
    mensaje += `Ya tenés ${cantidadGuardianes} guardianes cuidándote, ¿cómo les va juntos? `;
  }

  // Agregar promo 3x2 si aplica
  if (cantidadGuardianes >= 1) {
    mensaje += '\n\n**Te recuerdo que tenemos la promo 3x2** - llevás 3 y pagás 2. Si querés agrandar la familia, es el momento.';
  }

  return mensaje;
}

/**
 * Recomienda guardianes que complementen los que ya tiene
 * @param {array} guardianesPrevios - Guardianes que ya tiene
 * @param {array} productos - Catálogo disponible
 * @returns {object} - Recomendaciones complementarias
 */
export function recomendarComplementarios(guardianesPrevios, productos) {
  if (!guardianesPrevios || guardianesPrevios.length === 0) {
    return null;
  }

  // Analizar qué tiene
  const tiposQueTiene = [];
  const categoriasQueTiene = [];

  for (const guardian of guardianesPrevios) {
    if (guardian.tipo) tiposQueTiene.push(guardian.tipo);
    if (guardian.categorias) categoriasQueTiene.push(...guardian.categorias);
  }

  // Buscar complementos
  const recomendaciones = [];
  const tiposUnicos = [...new Set(tiposQueTiene)];

  for (const tipo of tiposUnicos) {
    // Encontrar el elemento de este tipo
    const elementoDelTipo = Object.entries(ELEMENTOS).find(([_, config]) =>
      config.tipos.includes(tipo)
    );

    if (elementoDelTipo) {
      const [elemento, config] = elementoDelTipo;

      // Buscar guardianes de elementos que potencian
      for (const elementoPotencia of config.potencia) {
        const elementoPotenciaConfig = ELEMENTOS[elementoPotencia];
        if (elementoPotenciaConfig) {
          for (const tipoPotencia of elementoPotenciaConfig.tipos) {
            // Buscar productos de ese tipo que no tenga
            const candidatos = productos.filter(p =>
              p.tipo === tipoPotencia &&
              p.disponible &&
              !tiposQueTiene.includes(p.tipo)
            );

            if (candidatos.length > 0) {
              recomendaciones.push({
                guardian: candidatos[0],
                razon: `Tu ${tipo} y un ${tipoPotencia} se potencian - ${config.descripcion} + ${elementoPotenciaConfig.descripcion}`
              });
            }
          }
        }
      }
    }
  }

  // Eliminar duplicados
  const vistos = new Set();
  const recomendacionesUnicas = recomendaciones.filter(r => {
    if (vistos.has(r.guardian.id)) return false;
    vistos.add(r.guardian.id);
    return true;
  });

  return {
    recomendaciones: recomendacionesUnicas.slice(0, 3),
    mensaje: recomendacionesUnicas.length > 0
      ? 'Ya que tenés guardianes de cierto elemento, estos otros potenciarían su energía:'
      : null
  };
}

// ═══════════════════════════════════════════════════════════════
// PARES Y TRÍOS RECOMENDADOS
// ═══════════════════════════════════════════════════════════════

export const COMBOS_RECOMENDADOS = [
  {
    nombre: 'Protección Total',
    tipos: ['duende', 'dragon'],
    descripcion: 'Diana y Stan juntos son protección total - uno trabaja las sombras, el otro vigila',
    beneficios: ['Protección del hogar', 'Escudo contra energía negativa', 'Vigilancia permanente'],
    descuento: '3x2 disponible'
  },
  {
    nombre: 'Abundancia Completa',
    tipos: ['gnomo', 'duende', 'mago'],
    descripcion: 'El gnomo atrae, el duende protege lo ganado, y el mago guía las decisiones',
    beneficios: ['Atracción de prosperidad', 'Protección de recursos', 'Claridad en negocios'],
    descuento: '3x2 disponible'
  },
  {
    nombre: 'Sanación Profunda',
    tipos: ['elfo', 'hada'],
    descripcion: 'El elfo sana el alma mientras el hada despierta el amor propio',
    beneficios: ['Sanación emocional', 'Amor propio', 'Elevación de vibración'],
    descuento: 'Llevá 2 con 15% off'
  },
  {
    nombre: 'Equilibrio Total',
    tipos: ['gnomo', 'elfo', 'duende'],
    descripcion: 'Tierra, agua y protección - el trío más equilibrado',
    beneficios: ['Abundancia', 'Sanación', 'Protección'],
    descuento: '3x2 disponible'
  },
  {
    nombre: 'Despertar Espiritual',
    tipos: ['mago', 'bruja'],
    descripcion: 'Sabiduría ancestral y poder de transformación unidos',
    beneficios: ['Claridad mental', 'Transformación personal', 'Conexión espiritual'],
    descuento: 'Llevá 2 con 15% off'
  }
];

/**
 * Busca combos que coincidan con lo que el cliente busca
 * @param {object} perfilCliente - Perfil del cliente
 * @param {array} productos - Productos disponibles
 * @returns {array} - Combos recomendados con productos específicos
 */
export function buscarCombosRecomendados(perfilCliente, productos) {
  const necesidadPrincipal = perfilCliente.necesidadesOrdenadas?.[0]?.categoria;
  const combosRelevantes = [];

  for (const combo of COMBOS_RECOMENDADOS) {
    // Verificar si el combo es relevante para la necesidad
    let esRelevante = false;

    if (necesidadPrincipal === 'proteccion' && combo.nombre.includes('Protección')) esRelevante = true;
    if (necesidadPrincipal === 'abundancia' && combo.nombre.includes('Abundancia')) esRelevante = true;
    if (necesidadPrincipal === 'sanacion' && combo.nombre.includes('Sanación')) esRelevante = true;
    if (necesidadPrincipal === 'paz' && combo.nombre.includes('Equilibrio')) esRelevante = true;
    if (necesidadPrincipal === 'sabiduria' && combo.nombre.includes('Espiritual')) esRelevante = true;

    if (esRelevante) {
      // Buscar productos disponibles para este combo
      const productosDelCombo = combo.tipos.map(tipo =>
        productos.find(p => p.tipo === tipo && p.disponible)
      ).filter(Boolean);

      if (productosDelCombo.length >= 2) {
        combosRelevantes.push({
          ...combo,
          productos: productosDelCombo,
          precioTotal: productosDelCombo.reduce((sum, p) => sum + p.precio, 0)
        });
      }
    }
  }

  return combosRelevantes;
}

// ═══════════════════════════════════════════════════════════════
// FUNCIÓN PRINCIPAL DE RECOMENDACIÓN
// ═══════════════════════════════════════════════════════════════

/**
 * Función principal que orquesta todo el sistema de recomendación
 * @param {object} params - Parámetros de la recomendación
 * @returns {object} - Resultado completo de la recomendación
 */
export async function recomendarGuardian({
  mensaje,
  historial = [],
  productos,
  subscriberId = null,
  email = null,
  limite = 3,
  incluirCrossSell = true,
  incluirCombos = true
}) {
  // 1. Analizar la conversación
  const mensajesCompletos = [...historial];
  if (mensaje) {
    mensajesCompletos.push({ role: 'user', content: mensaje });
  }
  const perfilCliente = analizarConversacion(mensajesCompletos);

  // 2. Buscar si es cliente repetido
  const identificador = email || subscriberId;
  const historialCompras = identificador ? await buscarHistorialCliente(identificador) : null;
  const mensajeClienteRepetido = generarMensajeClienteRepetido(historialCompras);

  // 3. Generar recomendaciones principales
  const recomendaciones = generarRecomendaciones(productos, perfilCliente, {
    limite,
    incluirCrossSell
  });

  // 4. Si es cliente repetido, agregar recomendaciones complementarias
  let complementarios = null;
  if (historialCompras?.esClienteRepetido) {
    complementarios = recomendarComplementarios(historialCompras.guardianesPrevios, productos);
  }

  // 5. Buscar combos si aplica
  let combos = [];
  if (incluirCombos && perfilCliente.necesidadesOrdenadas?.length > 0) {
    combos = buscarCombosRecomendados(perfilCliente, productos);
  }

  return {
    success: true,
    perfilCliente,
    esClienteRepetido: historialCompras?.esClienteRepetido || false,
    mensajeClienteRepetido,
    recomendaciones: recomendaciones.recomendados,
    crossSell: recomendaciones.crossSell,
    complementarios: complementarios?.recomendaciones || [],
    combos: combos.slice(0, 2),
    mensaje: recomendaciones.mensaje,
    instruccionTito: generarInstruccionTito(perfilCliente, recomendaciones, historialCompras, combos)
  };
}

/**
 * Genera instrucciones específicas para Tito
 */
function generarInstruccionTito(perfilCliente, recomendaciones, historialCompras, combos) {
  let instruccion = '';

  // Si es cliente repetido
  if (historialCompras?.esClienteRepetido) {
    instruccion += `\n[CLIENTE REPETIDO] Ya compró antes. Preguntale cómo le va con sus guardianes y mencioná la promo 3x2.`;
  }

  // Según sentimiento
  if (perfilCliente.sentimiento === 'vulnerable') {
    instruccion += `\n[SENSIBLE] El cliente parece estar pasando un momento difícil. Sé especialmente empático y contenedor. No presiones.`;
  }

  // Si hay urgencia
  if (perfilCliente.urgencia === 'alta') {
    instruccion += `\n[URGENTE] El cliente parece tener urgencia. Sé directo y enfocate en soluciones rápidas.`;
  }

  // Si hay combos relevantes
  if (combos.length > 0) {
    instruccion += `\n[COMBO] Hay un combo que le sirve: "${combos[0].nombre}" - ${combos[0].descripcion}. Mencionalo naturalmente.`;
  }

  // Cross-sell
  if (recomendaciones.crossSell?.length > 0) {
    instruccion += `\n[CROSS-SELL] ${recomendaciones.crossSell[0].razon}`;
  }

  return instruccion || 'Mostrá los guardianes recomendados y conectá emocionalmente con la necesidad del cliente.';
}

export default recomendarGuardian;
