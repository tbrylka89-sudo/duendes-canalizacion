/**
 * GUARDIAN INTELLIGENCE - ANALIZADOR DE HISTORIAS
 * Detecta repeticiones, problemas y calcula puntajes de unicidad
 */

import { SINCRODESTINOS, VOCABULARIO, GI_CONFIG } from './config.js';

// ═══════════════════════════════════════════════════════════════
// UTILIDADES DE ANÁLISIS
// ═══════════════════════════════════════════════════════════════

/**
 * Calcula la similitud entre dos textos (0-100)
 * Usa algoritmo de Jaccard sobre n-gramas
 */
export function calcularSimilitud(texto1, texto2) {
  if (!texto1 || !texto2) return 0;

  const normalizar = (t) => t.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, '')
    .split(/\s+/)
    .filter(p => p.length > 2);

  const palabras1 = new Set(normalizar(texto1));
  const palabras2 = new Set(normalizar(texto2));

  const interseccion = [...palabras1].filter(p => palabras2.has(p));
  const union = new Set([...palabras1, ...palabras2]);

  if (union.size === 0) return 0;
  return Math.round((interseccion.length / union.size) * 100);
}

/**
 * Extrae n-gramas de un texto
 */
export function extraerNgramas(texto, n = 3) {
  const palabras = texto.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, '')
    .split(/\s+/)
    .filter(p => p.length > 2);

  const ngramas = [];
  for (let i = 0; i <= palabras.length - n; i++) {
    ngramas.push(palabras.slice(i, i + n).join(' '));
  }
  return ngramas;
}

/**
 * Encuentra frases repetidas entre dos textos
 */
export function encontrarFrasesRepetidas(texto1, texto2, minPalabras = 4) {
  const oraciones1 = texto1.split(/[.!?]+/).map(s => s.trim()).filter(s => s.length > 10);
  const oraciones2 = texto2.split(/[.!?]+/).map(s => s.trim()).filter(s => s.length > 10);

  const repetidas = [];

  for (const o1 of oraciones1) {
    for (const o2 of oraciones2) {
      const similitud = calcularSimilitud(o1, o2);
      if (similitud >= GI_CONFIG.umbrales.similitudMaxima) {
        repetidas.push({
          frase1: o1,
          frase2: o2,
          similitud
        });
      }
    }
  }

  return repetidas;
}

// ═══════════════════════════════════════════════════════════════
// ANÁLISIS DE HISTORIA INDIVIDUAL
// ═══════════════════════════════════════════════════════════════

/**
 * Analiza una historia individual y detecta problemas
 */
export function analizarHistoria(historia, accesoriosReales = []) {
  const problemas = [];
  let puntaje = 100;

  if (!historia || historia.length < 100) {
    return {
      puntaje: 0,
      problemas: [{ tipo: 'vacia', mensaje: 'Historia vacía o demasiado corta', severidad: 'critico' }]
    };
  }

  const historiaLower = historia.toLowerCase();

  // 1. Detectar sincrodestinos prohibidos (fantasía irreal)
  for (const prohibido of SINCRODESTINOS.prohibidos) {
    if (historiaLower.includes(prohibido.toLowerCase())) {
      problemas.push({
        tipo: 'sincrodestino_irreal',
        mensaje: `Sincrodestino irreal/fantasioso: "${prohibido}"`,
        texto: prohibido,
        severidad: 'alto'
      });
      puntaje -= 15;
    }
  }

  // 2. Detectar frases genéricas de IA
  for (const frase of VOCABULARIO.frases_prohibidas_ia) {
    if (historiaLower.includes(frase.toLowerCase())) {
      problemas.push({
        tipo: 'frase_ia',
        mensaje: `Frase genérica de IA detectada: "${frase}"`,
        texto: frase,
        severidad: 'medio'
      });
      puntaje -= 8;
    }
  }

  // 3. Detectar palabras sobreusadas
  for (const [palabra, alternativas] of Object.entries(VOCABULARIO.evitar)) {
    const regex = new RegExp(`\\b${palabra}\\b`, 'gi');
    const matches = historia.match(regex);
    if (matches && matches.length > 2) {
      problemas.push({
        tipo: 'palabra_repetida',
        mensaje: `Palabra "${palabra}" usada ${matches.length} veces. Alternativas: ${alternativas.slice(0, 3).join(', ')}`,
        texto: palabra,
        alternativas,
        severidad: 'bajo'
      });
      puntaje -= 3;
    }
  }

  // 4. Verificar accesorios mencionados vs reales
  if (accesoriosReales.length > 0) {
    const accesoriosComunes = ['cristal', 'cuarzo', 'amatista', 'citrino', 'turmalina', 'labradorita',
      'bastón', 'vara', 'capa', 'manto', 'bolso', 'morral', 'sombrero', 'corona', 'cetro',
      'libro', 'grimorio', 'espada', 'escudo', 'lanza'];

    for (const accesorio of accesoriosComunes) {
      if (historiaLower.includes(accesorio) &&
          !accesoriosReales.some(a => a.toLowerCase().includes(accesorio))) {
        problemas.push({
          tipo: 'accesorio_inventado',
          mensaje: `Se menciona "${accesorio}" pero no está en los accesorios reales`,
          texto: accesorio,
          severidad: 'alto'
        });
        puntaje -= 10;
      }
    }
  }

  // 5. Verificar estructura muy rígida
  const seccionesRigidas = [
    'QUÉ TE APORTA',
    'CÓMO NACIÓ',
    'Lo que .* nos pidió que te digamos',
    'Si esto te hizo algo'
  ];

  let seccionesEncontradas = 0;
  for (const seccion of seccionesRigidas) {
    if (new RegExp(seccion, 'i').test(historia)) {
      seccionesEncontradas++;
    }
  }

  if (seccionesEncontradas >= 4) {
    problemas.push({
      tipo: 'estructura_rigida',
      mensaje: 'Estructura demasiado predecible (todas las secciones estándar)',
      severidad: 'bajo'
    });
    puntaje -= 5;
  }

  // 6. Verificar longitud adecuada
  const palabras = historia.split(/\s+/).length;
  if (palabras < 150) {
    problemas.push({
      tipo: 'muy_corta',
      mensaje: `Historia muy corta (${palabras} palabras, mínimo 150)`,
      severidad: 'medio'
    });
    puntaje -= 10;
  } else if (palabras > 800) {
    problemas.push({
      tipo: 'muy_larga',
      mensaje: `Historia muy larga (${palabras} palabras, máximo recomendado 800)`,
      severidad: 'bajo'
    });
    puntaje -= 3;
  }

  // 7. Verificar que use español rioplatense
  const tieneVoseo = /\b(vos|tenés|podés|sos|sabés|querés|sentís)\b/i.test(historia);
  const tieneTuteo = /\b(tú|tienes|puedes|eres|sabes|quieres|sientes)\b/i.test(historia);

  if (tieneTuteo && !tieneVoseo) {
    problemas.push({
      tipo: 'sin_voseo',
      mensaje: 'Usa tuteo en lugar de voseo rioplatense',
      severidad: 'medio'
    });
    puntaje -= 8;
  }

  // Asegurar puntaje mínimo 0
  puntaje = Math.max(0, puntaje);

  return {
    puntaje,
    problemas,
    estadisticas: {
      palabras,
      oraciones: historia.split(/[.!?]+/).filter(s => s.trim().length > 0).length,
      tieneVoseo,
      seccionesEstandar: seccionesEncontradas
    }
  };
}

// ═══════════════════════════════════════════════════════════════
// ANÁLISIS COMPARATIVO (ENTRE HISTORIAS)
// ═══════════════════════════════════════════════════════════════

/**
 * Compara una historia contra todas las demás del catálogo
 */
export function compararContraOtras(historia, otrasHistorias, nombreProducto = '') {
  const similitudes = [];

  for (const otra of otrasHistorias) {
    if (otra.id === historia.id) continue;

    const similitud = calcularSimilitud(historia.contenido, otra.contenido);

    if (similitud >= 40) { // Umbral bajo para detectar cualquier similitud significativa
      const frasesRepetidas = encontrarFrasesRepetidas(historia.contenido, otra.contenido);

      similitudes.push({
        producto_id: otra.id,
        producto_nombre: otra.nombre,
        similitud,
        frasesRepetidas,
        esProblematico: similitud >= GI_CONFIG.umbrales.similitudMaxima
      });
    }
  }

  // Ordenar por similitud descendente
  similitudes.sort((a, b) => b.similitud - a.similitud);

  return similitudes;
}

/**
 * Detecta sincrodestinos duplicados en todo el catálogo
 */
export function detectarSincrodestinosDuplicados(historias) {
  const sincrodestinos = [];
  const duplicados = [];

  // Patrones comunes de sincrodestinos
  const patronesSincro = [
    /(?:mientras|cuando|el d[ií]a que).*?(?:canaliz|cre|termin|trabaj)[^.!?]*[.!?]/gi,
    /algo (?:incre[ií]ble|m[aá]gico|extra[ñn]o)[^.!?]*[.!?]/gi,
    /(?:sucedi[oó]|pas[oó]|ocurri[oó]) algo[^.!?]*[.!?]/gi
  ];

  for (const historia of historias) {
    for (const patron of patronesSincro) {
      const matches = historia.contenido.match(patron);
      if (matches) {
        for (const match of matches) {
          sincrodestinos.push({
            texto: match.trim(),
            producto_id: historia.id,
            producto_nombre: historia.nombre
          });
        }
      }
    }
  }

  // Comparar sincrodestinos entre sí
  for (let i = 0; i < sincrodestinos.length; i++) {
    for (let j = i + 1; j < sincrodestinos.length; j++) {
      const similitud = calcularSimilitud(sincrodestinos[i].texto, sincrodestinos[j].texto);
      if (similitud >= 60) {
        duplicados.push({
          sincro1: sincrodestinos[i],
          sincro2: sincrodestinos[j],
          similitud
        });
      }
    }
  }

  return duplicados;
}

/**
 * Detecta roles/títulos repetidos ("hechicera ancestral", etc.)
 */
export function detectarRolesRepetidos(historias) {
  const roles = {};
  const patronesRol = [
    /(?:es (?:un|una)) ([^.!?,]+(?:de|del|de la) [^.!?,]+)/gi,
    /(?:guardián|guardiana|bruja|brujo|hechicera|hechicero|chamán|mago|maga|elfo|elfa) (?:de|del|de la) [a-záéíóúñ\s]+/gi
  ];

  for (const historia of historias) {
    for (const patron of patronesRol) {
      const matches = historia.contenido.match(patron);
      if (matches) {
        for (const match of matches) {
          const rolNormalizado = match.toLowerCase().trim();
          if (!roles[rolNormalizado]) {
            roles[rolNormalizado] = [];
          }
          roles[rolNormalizado].push({
            producto_id: historia.id,
            producto_nombre: historia.nombre
          });
        }
      }
    }
  }

  // Filtrar solo los que aparecen más de una vez
  const repetidos = {};
  for (const [rol, productos] of Object.entries(roles)) {
    if (productos.length > 1) {
      repetidos[rol] = productos;
    }
  }

  return repetidos;
}

// ═══════════════════════════════════════════════════════════════
// ANÁLISIS COMPLETO DEL CATÁLOGO
// ═══════════════════════════════════════════════════════════════

/**
 * Analiza todo el catálogo y genera un informe completo
 */
export function analizarCatalogoCompleto(productos) {
  const resultados = {
    fecha: new Date().toISOString(),
    totalProductos: productos.length,
    puntajeGlobal: 0,
    productosAnalizados: [],
    problemasCriticos: [],
    sincrodestinosDuplicados: [],
    rolesRepetidos: {},
    frasesRepetidas: [],
    estadisticas: {
      promedioPuntaje: 0,
      productosConProblemas: 0,
      productosCriticos: 0,
      productosOK: 0
    },
    recomendaciones: []
  };

  // Preparar historias para comparación
  const historias = productos.map(p => ({
    id: p.id,
    nombre: p.nombre,
    contenido: p.descripcion || p.historia || ''
  })).filter(h => h.contenido.length > 0);

  // Analizar cada producto
  let sumaPuntajes = 0;

  for (const producto of productos) {
    const historia = producto.descripcion || producto.historia || '';
    const accesorios = producto.accesorios || [];

    const analisisIndividual = analizarHistoria(historia, accesorios);
    const similitudes = compararContraOtras(
      { id: producto.id, contenido: historia },
      historias,
      producto.nombre
    );

    const resultado = {
      id: producto.id,
      nombre: producto.nombre,
      puntaje: analisisIndividual.puntaje,
      problemas: analisisIndividual.problemas,
      similitudes: similitudes.filter(s => s.esProblematico),
      estadisticas: analisisIndividual.estadisticas
    };

    // Agregar problemas de similitud
    for (const sim of similitudes.filter(s => s.esProblematico)) {
      resultado.problemas.push({
        tipo: 'similitud_alta',
        mensaje: `${sim.similitud}% similar a "${sim.producto_nombre}"`,
        similarA: sim.producto_nombre,
        similitud: sim.similitud,
        frasesRepetidas: sim.frasesRepetidas,
        severidad: sim.similitud >= 80 ? 'critico' : 'alto'
      });
      resultado.puntaje = Math.max(0, resultado.puntaje - 15);
    }

    resultados.productosAnalizados.push(resultado);
    sumaPuntajes += resultado.puntaje;

    // Clasificar
    if (resultado.problemas.some(p => p.severidad === 'critico')) {
      resultados.productosCriticos++;
      resultados.problemasCriticos.push({
        producto: producto.nombre,
        problemas: resultado.problemas.filter(p => p.severidad === 'critico')
      });
    }

    if (resultado.problemas.length > 0) {
      resultados.estadisticas.productosConProblemas++;
    } else {
      resultados.estadisticas.productosOK++;
    }
  }

  // Análisis global
  resultados.sincrodestinosDuplicados = detectarSincrodestinosDuplicados(historias);
  resultados.rolesRepetidos = detectarRolesRepetidos(historias);

  // Calcular estadísticas
  resultados.estadisticas.promedioPuntaje = Math.round(sumaPuntajes / productos.length);
  resultados.puntajeGlobal = resultados.estadisticas.promedioPuntaje;
  resultados.estadisticas.productosCriticos = resultados.problemasCriticos.length;

  // Generar recomendaciones
  if (resultados.sincrodestinosDuplicados.length > 0) {
    resultados.recomendaciones.push({
      prioridad: 'alta',
      mensaje: `Hay ${resultados.sincrodestinosDuplicados.length} sincrodestinos duplicados que deben reescribirse`
    });
  }

  if (Object.keys(resultados.rolesRepetidos).length > 0) {
    resultados.recomendaciones.push({
      prioridad: 'media',
      mensaje: `Hay ${Object.keys(resultados.rolesRepetidos).length} roles/títulos repetidos entre guardianes`
    });
  }

  if (resultados.estadisticas.productosCriticos > 0) {
    resultados.recomendaciones.push({
      prioridad: 'alta',
      mensaje: `${resultados.estadisticas.productosCriticos} productos tienen problemas críticos que requieren atención inmediata`
    });
  }

  if (resultados.puntajeGlobal < 70) {
    resultados.recomendaciones.push({
      prioridad: 'alta',
      mensaje: `El puntaje global (${resultados.puntajeGlobal}) está por debajo del mínimo recomendado (70)`
    });
  }

  return resultados;
}

export default {
  calcularSimilitud,
  extraerNgramas,
  encontrarFrasesRepetidas,
  analizarHistoria,
  compararContraOtras,
  detectarSincrodestinosDuplicados,
  detectarRolesRepetidos,
  analizarCatalogoCompleto
};
