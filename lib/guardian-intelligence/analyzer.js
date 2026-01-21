/**
 * GUARDIAN INTELLIGENCE - ANALIZADOR DE HISTORIAS v2
 * Detecta problemas REALES: estructura rígida, repeticiones, falta de elementos
 */

import { SINCRODESTINOS, VOCABULARIO, GI_CONFIG } from './config.js';

// ═══════════════════════════════════════════════════════════════
// PATRONES PROBLEMÁTICOS A DETECTAR
// ═══════════════════════════════════════════════════════════════

const PATRONES_RIGIDOS = {
  // Intros robóticas que se repiten
  intros_template: [
    /^<p>Esta es \w+\. Tiene \d+ años y es un[ao]? /i,
    /^Esta es \w+\. Tiene \d+ años/i
  ],

  // Secciones con headers que no deberían existir
  headers_prohibidos: [
    /QUÉ TE APORTA [A-ZÁÉÍÓÚ]+:/i,
    /CÓMO NACIÓ [A-ZÁÉÍÓÚ]+/i,
    /El trabajo de canalización:/i,
    /Su especialidad:/i,
    /Ama .+\. No tolera/i
  ],

  // Viñetas/listas en contenido emocional
  listas_prohibidas: [
    /<br\s*\/?>\s*-\s+/g,
    /\n-\s+/g,
    /<li>/g
  ],

  // Frases que se repiten en TODAS las historias
  frases_repetitivas: [
    'nos contó que durante siglos',
    'nos contó que durante décadas',
    'algo increíble:',
    'algo increíble mientras',
    'su especialidad:',
    'ama los',
    'no tolera',
    'llevó dos semanas porque pedía pausas',
    'llevó una semana y media',
    'antes de crearla',
    'antes de crearlo',
    'durante días encontrábamos',
    'cada detalle de su rostro emergió'
  ],

  // Sincrodestinos que YA están sobreusados
  sincrodestinos_gastados: [
    'plantas del taller florecieron',
    'plantas comenzaron a crecer',
    'mariposa entró',
    'mariposa azul',
    'pétalos cayeron',
    'pétalos aparecieron',
    'rosa blanca apareció',
    'flores en macetas',
    'polilla apareció',
    'aroma a rosas',
    'todas las plantas'
  ]
};

// Elementos que DEBEN estar (pero tejidos naturalmente, no como headers)
const ELEMENTOS_REQUERIDOS = {
  voz_nosotros: {
    patron: /\b(nosotros|nos\s|nuestro|el taller|el equipo)\b/gi,
    minimo: 2,
    mensaje: 'Falta la voz "nosotros" (canalizadores contando)'
  },
  mensaje_primera_persona: {
    patron: /<em>.*\b(yo|mi|me|soy|tengo|puedo|quiero)\b.*<\/em>/gis,
    minimo: 1,
    mensaje: 'Falta el mensaje canalizado en primera persona (el guardián hablando)'
  },
  voseo: {
    patron: /\b(vos|tenés|podés|sos|sabés|querés|sentís|mirás|trabajás)\b/gi,
    minimo: 3,
    mensaje: 'Falta voseo rioplatense'
  },
  identificacion_cliente: {
    patron: /\b(para quienes?|si te sentís|cuando sentís|esos días que|esas noches que)\b/gi,
    minimo: 1,
    mensaje: 'Falta identificación con problemas del cliente'
  }
};

// ═══════════════════════════════════════════════════════════════
// UTILIDADES
// ═══════════════════════════════════════════════════════════════

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
  const historiaTexto = historia.replace(/<[^>]*>/g, ' '); // Sin HTML

  // ═══════════════════════════════════════════════════════════════
  // 1. DETECTAR ESTRUCTURA RÍGIDA/TEMPLATE
  // ═══════════════════════════════════════════════════════════════

  // Intro robótica
  for (const patron of PATRONES_RIGIDOS.intros_template) {
    if (patron.test(historia)) {
      problemas.push({
        tipo: 'intro_robotica',
        mensaje: 'Intro tipo template: "Esta es X. Tiene Y años..." - debe variar',
        severidad: 'alto'
      });
      puntaje -= 15;
      break;
    }
  }

  // Headers prohibidos
  let headersEncontrados = 0;
  for (const patron of PATRONES_RIGIDOS.headers_prohibidos) {
    if (patron.test(historia)) {
      headersEncontrados++;
    }
  }
  if (headersEncontrados >= 2) {
    problemas.push({
      tipo: 'estructura_rigida',
      mensaje: `${headersEncontrados} secciones con headers tipo template (QUÉ TE APORTA, CÓMO NACIÓ, etc.)`,
      severidad: 'alto'
    });
    puntaje -= 20;
  }

  // Listas/viñetas
  let tieneViñetas = false;
  for (const patron of PATRONES_RIGIDOS.listas_prohibidas) {
    const matches = historia.match(patron);
    if (matches && matches.length > 0) {
      tieneViñetas = true;
      break;
    }
  }
  if (tieneViñetas) {
    problemas.push({
      tipo: 'listas_prohibidas',
      mensaje: 'Tiene viñetas/listas - el contenido emocional no usa bullets',
      severidad: 'medio'
    });
    puntaje -= 10;
  }

  // ═══════════════════════════════════════════════════════════════
  // 2. DETECTAR FRASES REPETITIVAS GASTADAS
  // ═══════════════════════════════════════════════════════════════

  let frasesGastadasEncontradas = [];
  for (const frase of PATRONES_RIGIDOS.frases_repetitivas) {
    if (historiaLower.includes(frase.toLowerCase())) {
      frasesGastadasEncontradas.push(frase);
    }
  }
  if (frasesGastadasEncontradas.length >= 3) {
    problemas.push({
      tipo: 'frases_gastadas',
      mensaje: `${frasesGastadasEncontradas.length} frases template gastadas: "${frasesGastadasEncontradas.slice(0, 3).join('", "')}"`,
      severidad: 'alto'
    });
    puntaje -= 15;
  }

  // ═══════════════════════════════════════════════════════════════
  // 3. DETECTAR SINCRODESTINOS SOBREUSADOS
  // ═══════════════════════════════════════════════════════════════

  for (const sincro of PATRONES_RIGIDOS.sincrodestinos_gastados) {
    if (historiaLower.includes(sincro.toLowerCase())) {
      problemas.push({
        tipo: 'sincrodestino_gastado',
        mensaje: `Sincrodestino sobreusado: "${sincro}" - ya está en muchas historias`,
        severidad: 'alto'
      });
      puntaje -= 12;
      break; // Solo penalizar una vez
    }
  }

  // ═══════════════════════════════════════════════════════════════
  // 4. VERIFICAR ELEMENTOS REQUERIDOS
  // ═══════════════════════════════════════════════════════════════

  for (const [nombre, config] of Object.entries(ELEMENTOS_REQUERIDOS)) {
    const matches = historia.match(config.patron);
    const cantidad = matches ? matches.length : 0;

    if (cantidad < config.minimo) {
      problemas.push({
        tipo: `falta_${nombre}`,
        mensaje: config.mensaje,
        severidad: nombre === 'mensaje_primera_persona' ? 'critico' : 'medio'
      });
      puntaje -= nombre === 'mensaje_primera_persona' ? 20 : 8;
    }
  }

  // ═══════════════════════════════════════════════════════════════
  // 5. DETECTAR SINCRODESTINOS PROHIBIDOS (fantasía)
  // ═══════════════════════════════════════════════════════════════

  for (const prohibido of SINCRODESTINOS.prohibidos) {
    if (historiaLower.includes(prohibido.toLowerCase())) {
      problemas.push({
        tipo: 'sincrodestino_irreal',
        mensaje: `Sincrodestino fantasioso: "${prohibido}"`,
        texto: prohibido,
        severidad: 'alto'
      });
      puntaje -= 15;
    }
  }

  // ═══════════════════════════════════════════════════════════════
  // 6. DETECTAR FRASES GENÉRICAS DE IA
  // ═══════════════════════════════════════════════════════════════

  for (const frase of VOCABULARIO.frases_prohibidas_ia) {
    if (historiaLower.includes(frase.toLowerCase())) {
      problemas.push({
        tipo: 'frase_ia',
        mensaje: `Frase genérica de IA: "${frase}"`,
        texto: frase,
        severidad: 'medio'
      });
      puntaje -= 8;
    }
  }

  // ═══════════════════════════════════════════════════════════════
  // 7. VERIFICAR ACCESORIOS
  // ═══════════════════════════════════════════════════════════════

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

  // ═══════════════════════════════════════════════════════════════
  // 8. VERIFICAR LONGITUD Y VOSEO
  // ═══════════════════════════════════════════════════════════════

  const palabras = historiaTexto.split(/\s+/).length;
  if (palabras < 200) {
    problemas.push({
      tipo: 'muy_corta',
      mensaje: `Historia muy corta (${palabras} palabras, mínimo 200)`,
      severidad: 'medio'
    });
    puntaje -= 10;
  } else if (palabras > 1000) {
    problemas.push({
      tipo: 'muy_larga',
      mensaje: `Historia muy larga (${palabras} palabras, máximo 1000)`,
      severidad: 'bajo'
    });
    puntaje -= 3;
  }

  const tieneTuteo = /\b(tú|tienes|puedes|eres|sabes|quieres|sientes)\b/i.test(historia);
  const tieneVoseo = /\b(vos|tenés|podés|sos|sabés|querés|sentís)\b/i.test(historia);

  if (tieneTuteo && !tieneVoseo) {
    problemas.push({
      tipo: 'sin_voseo',
      mensaje: 'Usa tuteo español en lugar de voseo rioplatense',
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
      oraciones: historiaTexto.split(/[.!?]+/).filter(s => s.trim().length > 0).length,
      tieneVoseo,
      tieneViñetas,
      headersRigidos: headersEncontrados,
      frasesGastadas: frasesGastadasEncontradas.length
    }
  };
}

// ═══════════════════════════════════════════════════════════════
// ANÁLISIS COMPARATIVO (ENTRE HISTORIAS)
// ═══════════════════════════════════════════════════════════════

export function compararContraOtras(historia, otrasHistorias, nombreProducto = '') {
  const similitudes = [];

  for (const otra of otrasHistorias) {
    if (otra.id === historia.id) continue;

    const similitud = calcularSimilitud(historia.contenido, otra.contenido);

    if (similitud >= 40) {
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

  similitudes.sort((a, b) => b.similitud - a.similitud);
  return similitudes;
}

/**
 * Detecta sincrodestinos duplicados en todo el catálogo
 */
export function detectarSincrodestinosDuplicados(historias) {
  const sincrodestinos = [];
  const duplicados = [];

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
 * Detecta roles/títulos repetidos
 */
export function detectarRolesRepetidos(historias) {
  const roles = {};
  const patronesRol = [
    /(?:es (?:un|una)) ([^.!?,]+(?:de|del|de la) [^.!?,]+)/gi,
    /(?:guardián|guardiana|bruja|brujo|hechicera|hechicero|chamán|mago|maga|elfo|elfa|pixie|hada) (?:de|del|de la) [a-záéíóúñ\s]+/gi
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
      productosOK: 0,
      problemasComunes: {}
    },
    recomendaciones: []
  };

  const historias = productos.map(p => ({
    id: p.id,
    nombre: p.nombre,
    contenido: p.descripcion || p.historia || ''
  })).filter(h => h.contenido.length > 0);

  let sumaPuntajes = 0;
  const conteoProblemas = {};

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
        severidad: sim.similitud >= 80 ? 'critico' : 'alto'
      });
      resultado.puntaje = Math.max(0, resultado.puntaje - 15);
    }

    // Contar tipos de problemas
    for (const p of resultado.problemas) {
      conteoProblemas[p.tipo] = (conteoProblemas[p.tipo] || 0) + 1;
    }

    resultados.productosAnalizados.push(resultado);
    sumaPuntajes += resultado.puntaje;

    if (resultado.problemas.some(p => p.severidad === 'critico')) {
      resultados.estadisticas.productosCriticos++;
      resultados.problemasCriticos.push({
        producto: producto.nombre,
        id: producto.id,
        puntaje: resultado.puntaje,
        problemas: resultado.problemas.filter(p => p.severidad === 'critico' || p.severidad === 'alto')
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
  resultados.estadisticas.problemasComunes = conteoProblemas;

  // Calcular estadísticas
  resultados.estadisticas.promedioPuntaje = Math.round(sumaPuntajes / productos.length);
  resultados.puntajeGlobal = resultados.estadisticas.promedioPuntaje;

  // Ordenar por puntaje (peores primero)
  resultados.productosAnalizados.sort((a, b) => a.puntaje - b.puntaje);

  // Generar recomendaciones
  if (conteoProblemas['intro_robotica'] > 5) {
    resultados.recomendaciones.push({
      prioridad: 'alta',
      mensaje: `${conteoProblemas['intro_robotica']} historias tienen intro robótica "Esta es X. Tiene Y años..." - VARIAR`
    });
  }

  if (conteoProblemas['estructura_rigida'] > 5) {
    resultados.recomendaciones.push({
      prioridad: 'alta',
      mensaje: `${conteoProblemas['estructura_rigida']} historias tienen headers tipo template (QUÉ TE APORTA, CÓMO NACIÓ) - ELIMINAR`
    });
  }

  if (conteoProblemas['falta_mensaje_primera_persona'] > 5) {
    resultados.recomendaciones.push({
      prioridad: 'critica',
      mensaje: `${conteoProblemas['falta_mensaje_primera_persona']} historias NO tienen mensaje del guardián en primera persona - AGREGAR`
    });
  }

  if (conteoProblemas['sincrodestino_gastado'] > 3) {
    resultados.recomendaciones.push({
      prioridad: 'alta',
      mensaje: `${conteoProblemas['sincrodestino_gastado']} historias usan sincrodestinos repetidos (plantas, mariposas, pétalos) - VARIAR`
    });
  }

  if (resultados.sincrodestinosDuplicados.length > 0) {
    resultados.recomendaciones.push({
      prioridad: 'alta',
      mensaje: `Hay ${resultados.sincrodestinosDuplicados.length} sincrodestinos duplicados entre historias`
    });
  }

  if (Object.keys(resultados.rolesRepetidos).length > 0) {
    resultados.recomendaciones.push({
      prioridad: 'media',
      mensaje: `Hay ${Object.keys(resultados.rolesRepetidos).length} roles/títulos repetidos`
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
