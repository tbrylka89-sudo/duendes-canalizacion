/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * SISTEMA DE VALIDACIÓN Y PREVENCIÓN DE ERRORES - ACADEMIA DE GUARDIANES
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Este módulo previene errores ANTES de que ocurran.
 * Cada función valida un aspecto del sistema y retorna:
 * - { valid: true } si todo está bien
 * - { valid: false, errores: [], advertencias: [], sugerencias: [] } si hay problemas
 */

// ═══════════════════════════════════════════════════════════════════════════════
// CATEGORÍAS Y ESPECIALIZACIONES VÁLIDAS
// ═══════════════════════════════════════════════════════════════════════════════

export const CATEGORIAS_VALIDAS = [
  'proteccion', 'protección',
  'amor',
  'sanacion', 'sanación',
  'abundancia',
  'sabiduria', 'sabiduría',
  'salud'
];

export const ESPECIALIZACIONES_VALIDAS = [
  'fortuna', 'proteccion', 'amor_romantico', 'amor_propio',
  'sanacion', 'calma', 'abundancia', 'sabiduria',
  'transformacion', 'alegria',
  'viajero', 'viajero_aventura', 'viajero_sabiduria',
  'viajero_reinvencion', 'viajero_horizontes', 'viajero_despegue',
  'bosque', 'bosque_sanacion', 'bosque_raices',
  'bosque_micelios', 'bosque_hierbas', 'bosque_hongos', 'bosque_equilibrio'
];

export const ESPECIES_VALIDAS = [
  'duende', 'duenda', 'pixie', 'leprechaun',
  'bruja', 'brujo', 'vikingo', 'vikinga',
  'elfo', 'elfa', 'chaman', 'chamana',
  'sanador', 'sanadora', 'maestro', 'maestra',
  'guerrero', 'guerrera', 'hechicero', 'hechicera'
];

export const CRISTALES_CONOCIDOS = [
  'amatista', 'citrino', 'cuarzo', 'cuarzo rosa', 'cuarzo cristal', 'cuarzo ahumado',
  'turmalina', 'turmalina negra', 'obsidiana', 'pirita', 'fluorita',
  'labradorita', 'amazonita', 'sodalita', 'agata', 'ágata',
  'piedra luna', 'piedra de la luna', 'jade', 'ojo de tigre'
];

// ═══════════════════════════════════════════════════════════════════════════════
// 1. VALIDACIÓN DE GUARDIÁN INDIVIDUAL
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Valida que un guardián tenga todos los datos necesarios para ser profesor
 */
export function validarGuardianParaAcademia(guardian) {
  const resultado = {
    valid: true,
    errores: [],
    advertencias: [],
    sugerencias: [],
    puedeEnsenar: [],
    datosCompletos: 0,
    datosTotal: 8
  };

  // Datos críticos (sin estos NO puede ser profesor)
  if (!guardian.nombre) {
    resultado.errores.push('Sin nombre - imposible identificar');
    resultado.valid = false;
  }

  if (!guardian.id && !guardian.productoId) {
    resultado.errores.push('Sin ID de WooCommerce - no se puede conectar con tienda');
    resultado.valid = false;
  }

  // Datos importantes (puede funcionar sin estos pero con limitaciones)
  if (!guardian.imagen && !guardian.foto) {
    resultado.advertencias.push('Sin imagen - usará placeholder');
  } else {
    resultado.datosCompletos++;
  }

  if (!guardian.categoria) {
    resultado.advertencias.push('Sin categoría - limitará temas de enseñanza');
  } else {
    resultado.datosCompletos++;
    // Normalizar y validar categoría
    const catNormalizada = normalizarTexto(guardian.categoria);
    if (!CATEGORIAS_VALIDAS.includes(catNormalizada)) {
      resultado.advertencias.push(`Categoría "${guardian.categoria}" no reconocida`);
    } else {
      resultado.puedeEnsenar.push(`Temas de ${guardian.categoria}`);
    }
  }

  if (!guardian.especie && !guardian.tipo) {
    resultado.advertencias.push('Sin especie - usará "duende" por defecto');
  } else {
    resultado.datosCompletos++;
    const especie = guardian.especie || guardian.tipo;
    resultado.puedeEnsenar.push(`Estilo ${especie}`);
  }

  if (!guardian.accesorios && !guardian.descripcion) {
    resultado.advertencias.push('Sin accesorios ni descripción - contenido será genérico');
  } else {
    resultado.datosCompletos++;
    // Detectar cristales en accesorios
    const texto = (guardian.accesorios || '') + ' ' + (guardian.descripcion || '');
    const cristalesEncontrados = detectarCristales(texto);
    if (cristalesEncontrados.length > 0) {
      resultado.puedeEnsenar.push(`Cristaloterapia: ${cristalesEncontrados.join(', ')}`);
    }

    // Detectar temas especiales por accesorios
    const temasEspeciales = detectarTemasEspeciales(texto);
    resultado.puedeEnsenar.push(...temasEspeciales);
  }

  if (!guardian.historia && !guardian.descripcionLarga) {
    resultado.sugerencias.push('Sin historia - generar personalidad será más difícil');
  } else {
    resultado.datosCompletos++;
  }

  if (!guardian.genero) {
    resultado.sugerencias.push('Sin género - usará lenguaje neutro');
  } else {
    resultado.datosCompletos++;
  }

  if (guardian.adoptado === true || guardian.stock === 0) {
    resultado.errores.push('Guardián adoptado/sin stock - no linkear a tienda');
    // No es error crítico para academia, pero hay que saberlo
  }

  // Calcular score de completitud
  resultado.completitud = Math.round((resultado.datosCompletos / resultado.datosTotal) * 100);

  if (resultado.completitud < 50) {
    resultado.sugerencias.push(`Completitud baja (${resultado.completitud}%) - considerar enriquecer datos`);
  }

  return resultado;
}

// ═══════════════════════════════════════════════════════════════════════════════
// 2. VALIDACIÓN DE CURSO ANTES DE GENERAR
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Valida que la configuración de un curso sea viable
 */
export function validarConfiguracionCurso(config) {
  const resultado = {
    valid: true,
    errores: [],
    advertencias: [],
    sugerencias: []
  };

  // Validar campos requeridos
  if (!config.tema) {
    resultado.errores.push('Falta tema del curso');
    resultado.valid = false;
  }

  if (!config.mes || config.mes < 1 || config.mes > 12) {
    resultado.errores.push('Mes inválido (debe ser 1-12)');
    resultado.valid = false;
  }

  if (!config.year || config.year < 2024) {
    resultado.errores.push('Año inválido');
    resultado.valid = false;
  }

  // Validar que hay suficientes guardianes para el curso
  if (config.guardianes && config.guardianes.length < 4) {
    resultado.advertencias.push(`Solo ${config.guardianes.length} guardianes - un curso necesita 4 (uno por semana)`);
  }

  // Validar que no se programa en el pasado
  const fechaProgramada = new Date(config.year, config.mes - 1, 1);
  const hoy = new Date();
  if (fechaProgramada < hoy) {
    resultado.advertencias.push('La fecha de publicación ya pasó');
  }

  // Sugerencias de eventos lunares
  if (!config.eventoLunar) {
    resultado.sugerencias.push('Considerar agregar evento lunar para mayor engagement');
  }

  return resultado;
}

// ═══════════════════════════════════════════════════════════════════════════════
// 3. VALIDACIÓN DE CONTENIDO GENERADO
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Valida que el contenido generado siga las reglas de CLAUDE.md
 */
export function validarContenidoGenerado(contenido, guardian) {
  const resultado = {
    valid: true,
    errores: [],
    advertencias: [],
    sugerencias: [],
    score: 100
  };

  if (!contenido || contenido.length < 100) {
    resultado.errores.push('Contenido muy corto o vacío');
    resultado.valid = false;
    return resultado;
  }

  // FRASES PROHIBIDAS DE IA (de CLAUDE.md)
  const frasesProhibidas = [
    'desde las profundidades',
    'brumas ancestrales',
    'velo entre mundos',
    'tiempos inmemoriales',
    'susurro del viento',
    'danza de las hojas',
    'vibraciones cósmicas',
    'campo energético',
    'bosques de escocia',
    'acantilados de irlanda',
    '847 años',
    'manto de estrellas',
    'atravesando dimensiones'
  ];

  const contenidoLower = contenido.toLowerCase();
  const frasesEncontradas = frasesProhibidas.filter(f => contenidoLower.includes(f));

  if (frasesEncontradas.length > 0) {
    resultado.advertencias.push(`Frases de IA detectadas: "${frasesEncontradas.join('", "')}"`);
    resultado.score -= frasesEncontradas.length * 10;
  }

  // Verificar que menciona al guardián
  if (guardian?.nombre && !contenido.includes(guardian.nombre)) {
    resultado.advertencias.push('No menciona el nombre del guardián');
    resultado.score -= 5;
  }

  // Verificar que no es genérico (debería tener detalles específicos)
  const tieneDetallesEspecificos =
    contenido.includes(guardian?.categoria) ||
    contenido.includes(guardian?.especie) ||
    (guardian?.accesorios && contenido.toLowerCase().includes(guardian.accesorios.split(',')[0]?.toLowerCase()));

  if (!tieneDetallesEspecificos) {
    resultado.advertencias.push('Contenido parece genérico - no menciona atributos del guardián');
    resultado.score -= 15;
  }

  // Verificar primera frase con impacto
  const primeraFrase = contenido.split('.')[0];
  if (primeraFrase.length > 150) {
    resultado.sugerencias.push('Primera frase muy larga - considerar más impacto');
  }

  // Verificar tono rioplatense
  const tieneRioplatense = contenido.includes('vos') || contenido.includes('tenés') || contenido.includes('podés');
  if (!tieneRioplatense) {
    resultado.advertencias.push('No usa español rioplatense (vos, tenés, podés)');
    resultado.score -= 10;
  }

  // Score final
  if (resultado.score < 60) {
    resultado.valid = false;
    resultado.errores.push(`Score de calidad muy bajo: ${resultado.score}/100`);
  } else if (resultado.score < 80) {
    resultado.advertencias.push(`Score de calidad mejorable: ${resultado.score}/100`);
  }

  return resultado;
}

// ═══════════════════════════════════════════════════════════════════════════════
// 4. VALIDACIÓN DE SELECCIÓN DE GUARDIANES
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Valida que la selección de guardianes sea óptima para un tema
 */
export function validarSeleccionGuardianes(guardianes, tema, historialReciente = []) {
  const resultado = {
    valid: true,
    errores: [],
    advertencias: [],
    sugerencias: [],
    guardianesFiltrados: []
  };

  if (!guardianes || guardianes.length === 0) {
    resultado.errores.push('No hay guardianes disponibles');
    resultado.valid = false;
    return resultado;
  }

  // Filtrar guardianes ya usados recientemente
  const idsRecientes = new Set(historialReciente.map(h => h.id || h.productoId));
  const guardianesNuevos = guardianes.filter(g => !idsRecientes.has(g.id || g.productoId));

  if (guardianesNuevos.length < guardianes.length) {
    resultado.advertencias.push(`${guardianes.length - guardianesNuevos.length} guardianes usados recientemente - excluidos`);
  }

  if (guardianesNuevos.length < 4) {
    resultado.advertencias.push(`Solo ${guardianesNuevos.length} guardianes disponibles - un curso necesita 4`);
    if (guardianesNuevos.length === 0) {
      resultado.errores.push('No hay guardianes nuevos disponibles');
      resultado.valid = false;
    }
  }

  // Validar variedad (no todos del mismo tipo)
  const especies = new Set(guardianesNuevos.map(g => g.especie || g.tipo || 'duende'));
  if (especies.size === 1 && guardianesNuevos.length > 2) {
    resultado.sugerencias.push('Todos los guardianes son del mismo tipo - considerar variedad');
  }

  // Validar variedad de género
  const generos = new Set(guardianesNuevos.map(g => g.genero));
  if (generos.size === 1 && guardianesNuevos.length > 2) {
    resultado.sugerencias.push('Todos los guardianes son del mismo género - considerar variedad');
  }

  resultado.guardianesFiltrados = guardianesNuevos;
  return resultado;
}

// ═══════════════════════════════════════════════════════════════════════════════
// 5. VALIDACIÓN DE SINCRONIZACIÓN CON WOOCOMMERCE
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Valida que los guardianes del curso aún existen y están disponibles
 */
export async function validarSincronizacionWoo(guardianesDelCurso, fetchWooProducto) {
  const resultado = {
    valid: true,
    errores: [],
    advertencias: [],
    actualizaciones: []
  };

  for (const guardian of guardianesDelCurso) {
    try {
      const productoActual = await fetchWooProducto(guardian.id || guardian.productoId);

      if (!productoActual) {
        resultado.errores.push(`Guardián "${guardian.nombre}" (ID: ${guardian.id}) ya no existe en WooCommerce`);
        resultado.valid = false;
        continue;
      }

      // Verificar cambios importantes
      if (productoActual.status !== 'publish') {
        resultado.advertencias.push(`Guardián "${guardian.nombre}" ya no está publicado`);
      }

      if (productoActual.stock_status === 'outofstock') {
        resultado.advertencias.push(`Guardián "${guardian.nombre}" sin stock - considerar no linkear`);
      }

      // Detectar si cambió la imagen
      const imagenActual = productoActual.images?.[0]?.src;
      if (guardian.imagen && imagenActual && guardian.imagen !== imagenActual) {
        resultado.actualizaciones.push({
          guardianId: guardian.id,
          campo: 'imagen',
          valorAnterior: guardian.imagen,
          valorNuevo: imagenActual
        });
      }

      // Detectar si cambió el precio
      if (guardian.precio && productoActual.price && guardian.precio !== parseFloat(productoActual.price)) {
        resultado.actualizaciones.push({
          guardianId: guardian.id,
          campo: 'precio',
          valorAnterior: guardian.precio,
          valorNuevo: parseFloat(productoActual.price)
        });
      }

    } catch (error) {
      resultado.advertencias.push(`Error verificando guardián "${guardian.nombre}": ${error.message}`);
    }
  }

  if (resultado.actualizaciones.length > 0) {
    resultado.sugerencias = [`${resultado.actualizaciones.length} guardianes tienen actualizaciones pendientes`];
  }

  return resultado;
}

// ═══════════════════════════════════════════════════════════════════════════════
// 6. VALIDACIÓN DE CURSO COMPLETO ANTES DE PUBLICAR
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Validación final exhaustiva antes de publicar un curso
 */
export function validarCursoParaPublicar(curso) {
  const resultado = {
    valid: true,
    errores: [],
    advertencias: [],
    sugerencias: [],
    checklist: {}
  };

  // 1. Estructura básica
  resultado.checklist.tieneInfo = !!(curso.titulo && curso.descripcion);
  if (!resultado.checklist.tieneInfo) {
    resultado.errores.push('Falta título o descripción del curso');
    resultado.valid = false;
  }

  // 2. Módulos completos
  resultado.checklist.tiene4Modulos = curso.modulos?.length === 4;
  if (!resultado.checklist.tiene4Modulos) {
    resultado.errores.push(`Curso tiene ${curso.modulos?.length || 0} módulos, necesita 4`);
    resultado.valid = false;
  }

  // 3. Lecciones por módulo
  if (curso.modulos) {
    for (let i = 0; i < curso.modulos.length; i++) {
      const modulo = curso.modulos[i];
      const tieneProfesor = !!modulo.guardian;
      const tieneLecciones = modulo.lecciones?.length >= 4;

      resultado.checklist[`modulo${i + 1}Profesor`] = tieneProfesor;
      resultado.checklist[`modulo${i + 1}Lecciones`] = tieneLecciones;

      if (!tieneProfesor) {
        resultado.errores.push(`Módulo ${i + 1} sin guardián profesor`);
        resultado.valid = false;
      }
      if (!tieneLecciones) {
        resultado.advertencias.push(`Módulo ${i + 1} tiene ${modulo.lecciones?.length || 0} lecciones (recomendado: 4)`);
      }

      // Validar contenido de cada lección
      if (modulo.lecciones) {
        for (const leccion of modulo.lecciones) {
          const validacionContenido = validarContenidoGenerado(leccion.contenido, modulo.guardian);
          if (!validacionContenido.valid) {
            resultado.advertencias.push(`Lección "${leccion.titulo}" tiene problemas de calidad`);
          }
        }
      }
    }
  }

  // 4. Imágenes
  resultado.checklist.tieneImagenCurso = !!curso.imagen;
  if (!resultado.checklist.tieneImagenCurso) {
    resultado.advertencias.push('Curso sin imagen principal');
  }

  // 5. Badge
  resultado.checklist.tieneBadge = !!(curso.badge?.nombre && curso.badge?.icono);
  if (!resultado.checklist.tieneBadge) {
    resultado.sugerencias.push('Considerar agregar badge de completado');
  }

  // 6. Fechas
  resultado.checklist.tieneFechas = !!(curso.fechaInicio && curso.fechaFin);
  if (!resultado.checklist.tieneFechas) {
    resultado.advertencias.push('Curso sin fechas definidas');
  }

  return resultado;
}

// ═══════════════════════════════════════════════════════════════════════════════
// 7. SISTEMA DE FALLBACKS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Provee valores por defecto cuando faltan datos
 */
export const FALLBACKS = {
  // Si no hay imagen del guardián
  imagenGuardian: (nombre) =>
    `https://placehold.co/400x400/1a1a1a/d4af37?text=${encodeURIComponent(nombre || 'Guardián')}`,

  // Si no hay imagen del curso
  imagenCurso: (tema) =>
    `https://placehold.co/1200x630/1a1a1a/d4af37?text=${encodeURIComponent(tema || 'Curso')}`,

  // Si no hay categoría
  categoria: 'proteccion',

  // Si no hay especie
  especie: 'duende',

  // Si no hay historia
  historiaMinima: (nombre, categoria) =>
    `${nombre} es un guardián especializado en ${categoria}. Su presencia trae energía de transformación.`,

  // Si no hay accesorios detectables
  cristalPorDefecto: (categoria) => {
    const mapa = {
      'proteccion': 'turmalina negra',
      'amor': 'cuarzo rosa',
      'sanacion': 'amatista',
      'abundancia': 'citrino',
      'sabiduria': 'fluorita',
      'salud': 'cuarzo verde'
    };
    return mapa[normalizarTexto(categoria)] || 'cuarzo cristal';
  },

  // Badge por defecto
  badge: (tema) => ({
    nombre: `Maestría en ${tema}`,
    icono: '🏆',
    descripcion: `Completaste el curso de ${tema}`
  })
};

// ═══════════════════════════════════════════════════════════════════════════════
// UTILIDADES
// ═══════════════════════════════════════════════════════════════════════════════

function normalizarTexto(texto) {
  if (!texto) return '';
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Quitar acentos
    .trim();
}

function detectarCristales(texto) {
  if (!texto) return [];
  const textoLower = texto.toLowerCase();
  return CRISTALES_CONOCIDOS.filter(cristal => textoLower.includes(cristal.toLowerCase()));
}

function detectarTemasEspeciales(texto) {
  if (!texto) return [];
  const temas = [];
  const textoLower = texto.toLowerCase();

  const mapeoTemas = {
    'mochila': 'Viajes y cambios',
    'llave': 'Abrecaminos',
    'hongo': 'Transformación y ciclos',
    'micelio': 'Interconexión',
    'hierba': 'Herbalismo',
    'tambor': 'Sonidoterapia',
    'escoba': 'Limpieza energética',
    'caldero': 'Rituales',
    'trebol': 'Suerte y fortuna',
    'corazon': 'Amor y emociones',
    'luna': 'Ciclos lunares',
    'estrella': 'Guía y propósito'
  };

  for (const [keyword, tema] of Object.entries(mapeoTemas)) {
    if (textoLower.includes(keyword)) {
      temas.push(tema);
    }
  }

  return temas;
}

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORT
// ═══════════════════════════════════════════════════════════════════════════════

export default {
  // Validaciones
  validarGuardianParaAcademia,
  validarConfiguracionCurso,
  validarContenidoGenerado,
  validarSeleccionGuardianes,
  validarSincronizacionWoo,
  validarCursoParaPublicar,

  // Constantes
  CATEGORIAS_VALIDAS,
  ESPECIALIZACIONES_VALIDAS,
  ESPECIES_VALIDAS,
  CRISTALES_CONOCIDOS,

  // Fallbacks
  FALLBACKS,

  // Utilidades
  normalizarTexto,
  detectarCristales,
  detectarTemasEspeciales
};
