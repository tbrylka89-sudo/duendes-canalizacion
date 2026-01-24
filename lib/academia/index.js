/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * ACADEMIA DE GUARDIANES - MÓDULO CENTRAL
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Sistema completo para la Academia con:
 * - Validaciones preventivas
 * - Sistema de resiliencia
 * - Conexiones inteligentes
 */

// Validaciones preventivas
export {
  validarGuardianParaAcademia,
  validarConfiguracionCurso,
  validarContenidoGenerado,
  validarSeleccionGuardianes,
  validarSincronizacionWoo,
  validarCursoParaPublicar,
  CATEGORIAS_VALIDAS,
  ESPECIALIZACIONES_VALIDAS,
  ESPECIES_VALIDAS,
  CRISTALES_CONOCIDOS,
  FALLBACKS
} from './validaciones.js';

// Sistema de resiliencia
export {
  conRetry,
  conFallback,
  fetchResiliente,
  cacheGet,
  cacheSet,
  cacheClear,
  obtenerGuardianesConFallback,
  generarImagenConFallback,
  generarContenidoConFallback,
  logError,
  getErrorLog,
  getCircuitState,
  resetCircuitBreaker,
  healthCheck
} from './resiliencia.js';

// Re-export defaults
import validaciones from './validaciones.js';
import resiliencia from './resiliencia.js';

export { validaciones, resiliencia };

// ═══════════════════════════════════════════════════════════════════════════════
// FUNCIONES DE ALTO NIVEL
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Valida completamente un curso antes de cualquier operación
 */
export async function validarCursoCompleto(curso, opciones = {}) {
  const resultados = {
    timestamp: new Date().toISOString(),
    cursoId: curso.id,
    titulo: curso.titulo,
    validaciones: {},
    errores: [],
    advertencias: [],
    sugerencias: [],
    aptoParaPublicar: true
  };

  // 1. Validar configuración
  const configValidacion = validaciones.validarConfiguracionCurso({
    tema: curso.tema || curso.titulo,
    mes: curso.mes,
    year: curso.year,
    guardianes: curso.modulos?.map(m => m.guardian),
    eventoLunar: curso.eventoLunar
  });
  resultados.validaciones.configuracion = configValidacion;
  if (!configValidacion.valid) resultados.aptoParaPublicar = false;
  resultados.errores.push(...configValidacion.errores);
  resultados.advertencias.push(...configValidacion.advertencias);
  resultados.sugerencias.push(...configValidacion.sugerencias);

  // 2. Validar cada guardián profesor
  if (curso.modulos) {
    for (let i = 0; i < curso.modulos.length; i++) {
      const modulo = curso.modulos[i];
      if (modulo.guardian) {
        const guardianValidacion = validaciones.validarGuardianParaAcademia(modulo.guardian);
        resultados.validaciones[`guardian_modulo_${i + 1}`] = guardianValidacion;
        if (!guardianValidacion.valid) resultados.aptoParaPublicar = false;
        resultados.errores.push(...guardianValidacion.errores.map(e => `Módulo ${i + 1}: ${e}`));
        resultados.advertencias.push(...guardianValidacion.advertencias.map(e => `Módulo ${i + 1}: ${e}`));
      }
    }
  }

  // 3. Validar contenido de cada lección
  if (curso.modulos) {
    for (const modulo of curso.modulos) {
      if (modulo.lecciones) {
        for (const leccion of modulo.lecciones) {
          const contenidoValidacion = validaciones.validarContenidoGenerado(
            leccion.contenido,
            modulo.guardian
          );
          if (!contenidoValidacion.valid) {
            resultados.advertencias.push(`Lección "${leccion.titulo}": score ${contenidoValidacion.score}/100`);
          }
        }
      }
    }
  }

  // 4. Validar para publicación
  const publicacionValidacion = validaciones.validarCursoParaPublicar(curso);
  resultados.validaciones.publicacion = publicacionValidacion;
  if (!publicacionValidacion.valid) resultados.aptoParaPublicar = false;
  resultados.errores.push(...publicacionValidacion.errores);
  resultados.advertencias.push(...publicacionValidacion.advertencias);
  resultados.sugerencias.push(...publicacionValidacion.sugerencias);
  resultados.checklist = publicacionValidacion.checklist;

  // 5. Sincronización con WooCommerce (si se pide)
  if (opciones.verificarWoo && opciones.fetchWooProducto) {
    const guardianes = curso.modulos?.map(m => m.guardian).filter(Boolean) || [];
    const wooValidacion = await validaciones.validarSincronizacionWoo(
      guardianes,
      opciones.fetchWooProducto
    );
    resultados.validaciones.woocommerce = wooValidacion;
    if (!wooValidacion.valid) resultados.aptoParaPublicar = false;
    resultados.errores.push(...wooValidacion.errores);
    resultados.advertencias.push(...wooValidacion.advertencias);
    if (wooValidacion.actualizaciones?.length > 0) {
      resultados.advertencias.push(`${wooValidacion.actualizaciones.length} guardianes con datos desactualizados`);
    }
  }

  return resultados;
}

/**
 * Selecciona los mejores guardianes para un tema dado
 */
export function seleccionarGuardianesParaTema(guardianes, tema, opciones = {}) {
  const {
    cantidad = 4,
    historialReciente = [],
    prioridadVariedad = true
  } = opciones;

  // Primero validar la selección
  const validacion = validaciones.validarSeleccionGuardianes(guardianes, tema, historialReciente);

  if (!validacion.valid) {
    return { error: validacion.errores.join(', '), guardianes: [] };
  }

  const guardianesDisponibles = validacion.guardianesFiltrados;

  // Calcular score de relevancia para cada guardián
  const conScore = guardianesDisponibles.map(g => {
    let score = 0;
    const temaLower = tema.toLowerCase();

    // Score por categoría
    if (g.categoria && temaLower.includes(g.categoria.toLowerCase())) {
      score += 30;
    }

    // Score por especialización
    if (g.especializacion && temaLower.includes(g.especializacion.toLowerCase())) {
      score += 25;
    }

    // Score por especie relevante
    const especiesRelevantes = {
      'proteccion': ['vikingo', 'guerrero', 'bruja'],
      'sanacion': ['chaman', 'sanador', 'elfo'],
      'abundancia': ['leprechaun', 'gnomo'],
      'sabiduria': ['mago', 'hechicero', 'brujo', 'elfo'],
      'amor': ['pixie', 'hada']
    };
    const especiesParaTema = especiesRelevantes[validaciones.normalizarTexto(tema)] || [];
    if (especiesParaTema.includes(g.especie?.toLowerCase())) {
      score += 20;
    }

    // Score por cristales relevantes
    const cristalesRelevantes = {
      'proteccion': ['turmalina', 'obsidiana'],
      'sanacion': ['amatista', 'cuarzo rosa'],
      'abundancia': ['citrino', 'pirita'],
      'sabiduria': ['fluorita', 'labradorita'],
      'amor': ['cuarzo rosa', 'cuarzo']
    };
    const cristalesParaTema = cristalesRelevantes[validaciones.normalizarTexto(tema)] || [];
    const cristalesGuardian = validaciones.detectarCristales(g.accesorios || g.descripcion || '');
    const cristalesMatch = cristalesGuardian.filter(c =>
      cristalesParaTema.some(ct => c.toLowerCase().includes(ct))
    );
    score += cristalesMatch.length * 10;

    // Score por keywords en accesorios/descripción
    const texto = `${g.accesorios || ''} ${g.descripcion || ''} ${g.historia || ''}`.toLowerCase();
    if (texto.includes(temaLower)) {
      score += 15;
    }

    // Score por completitud de datos
    const completitudGuardian = validaciones.validarGuardianParaAcademia(g);
    score += completitudGuardian.completitud / 10;

    return { ...g, _score: score };
  });

  // Ordenar por score
  conScore.sort((a, b) => b._score - a._score);

  // Si queremos variedad, asegurar diversidad de especies y géneros
  let seleccionados = [];
  if (prioridadVariedad && cantidad > 1) {
    const especiesUsadas = new Set();
    const generosUsados = new Set();

    for (const g of conScore) {
      if (seleccionados.length >= cantidad) break;

      // Priorizar variedad en los primeros 2
      if (seleccionados.length < 2) {
        if (!especiesUsadas.has(g.especie) || conScore.length < cantidad * 2) {
          seleccionados.push(g);
          especiesUsadas.add(g.especie);
          generosUsados.add(g.genero);
        }
      } else {
        // Para el resto, simplemente tomar los de mejor score
        seleccionados.push(g);
      }
    }

    // Si no llegamos a la cantidad, completar con los de mejor score
    if (seleccionados.length < cantidad) {
      for (const g of conScore) {
        if (seleccionados.length >= cantidad) break;
        if (!seleccionados.includes(g)) {
          seleccionados.push(g);
        }
      }
    }
  } else {
    seleccionados = conScore.slice(0, cantidad);
  }

  return {
    guardianes: seleccionados,
    totalDisponibles: guardianesDisponibles.length,
    advertencias: validacion.advertencias,
    sugerencias: validacion.sugerencias
  };
}

/**
 * Genera un reporte de salud del sistema
 */
export async function reporteSalud() {
  const health = await resiliencia.healthCheck();
  const errores = resiliencia.getErrorLog();
  const circuit = resiliencia.getCircuitState();

  return {
    ...health,
    resumen: {
      serviciosSaludables: Object.values(health.servicios).filter(s => s.status === 'healthy').length,
      serviciosDegradados: Object.values(health.servicios).filter(s => s.status === 'degraded').length,
      serviciosCaidos: Object.values(health.servicios).filter(s => s.status === 'unhealthy').length,
      erroresUltimaHora: errores.filter(e => new Date(e.timestamp) > new Date(Date.now() - 3600000)).length,
      circuitBreakersAbiertos: Object.values(circuit).filter(c => c.isOpen).length
    },
    recomendaciones: generarRecomendaciones(health, errores, circuit)
  };
}

function generarRecomendaciones(health, errores, circuit) {
  const recomendaciones = [];

  // Circuit breakers abiertos
  for (const [servicio, estado] of Object.entries(circuit)) {
    if (estado.isOpen) {
      recomendaciones.push({
        prioridad: 'alta',
        mensaje: `Circuit breaker de ${servicio} está abierto - verificar servicio`,
        accion: `resetCircuitBreaker('${servicio}')`
      });
    } else if (estado.failures > 2) {
      recomendaciones.push({
        prioridad: 'media',
        mensaje: `${servicio} tiene ${estado.failures} fallos recientes`,
        accion: 'Monitorear'
      });
    }
  }

  // Muchos errores recientes
  const erroresRecientes = errores.filter(e => new Date(e.timestamp) > new Date(Date.now() - 3600000));
  if (erroresRecientes.length > 10) {
    recomendaciones.push({
      prioridad: 'alta',
      mensaje: `${erroresRecientes.length} errores en la última hora`,
      accion: 'Revisar logs de errores'
    });
  }

  // Cache muy grande
  if (health.cache?.items > 1000) {
    recomendaciones.push({
      prioridad: 'baja',
      mensaje: `Cache tiene ${health.cache.items} items`,
      accion: 'Considerar limpiar cache'
    });
  }

  return recomendaciones;
}

export default {
  // Validación completa
  validarCursoCompleto,

  // Selección inteligente
  seleccionarGuardianesParaTema,

  // Salud del sistema
  reporteSalud,

  // Submódulos
  validaciones,
  resiliencia
};
