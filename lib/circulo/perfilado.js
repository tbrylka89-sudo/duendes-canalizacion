/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * SISTEMA DE PERFILADO PSICOLOGICO PARA EL CIRCULO
 * Analiza respuestas del test para crear un perfil de conversion personalizado
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import { kv } from '@vercel/kv';

// ===== TIPOS DE PERFILES =====

export const NIVELES_VULNERABILIDAD = {
  alta: {
    id: 'alta',
    nombre: 'Alta',
    descripcion: 'Persona en momento sensible, necesita contencion',
    enfoque: 'EMPATIA_PRIMERO',
    presion: 0, // Sin presion de venta
    contencion: 100
  },
  media: {
    id: 'media',
    nombre: 'Media',
    descripcion: 'Persona abierta pero cautelosa',
    enfoque: 'VALOR_GRADUAL',
    presion: 30,
    contencion: 60
  },
  baja: {
    id: 'baja',
    nombre: 'Baja',
    descripcion: 'Persona estable, lista para actuar',
    enfoque: 'OFERTA_DIRECTA',
    presion: 60,
    contencion: 30
  }
};

export const TIPOS_DOLOR = {
  soledad: {
    id: 'soledad',
    nombre: 'Soledad',
    mensajes: [
      'Sentirte acompanada no es debilidad, es sabiduria',
      'El Circulo es una familia que entiende sin juzgar',
      'Aca hay alguien que te escucha de verdad'
    ],
    beneficiosCirculo: ['comunidad', 'foro', 'mensaje_diario'],
    testimoniosRelevantes: 'conexion'
  },
  dinero: {
    id: 'dinero',
    nombre: 'Abundancia',
    mensajes: [
      'La abundancia empieza cuando dejas de bloquearla',
      'Invertir en vos no es gasto, es la semilla',
      'Lo que parece caro hoy puede ser lo que te cambie manana'
    ],
    beneficiosCirculo: ['rituales_abundancia', 'guardianes_prosperidad', 'comunidad'],
    testimoniosRelevantes: 'abundancia'
  },
  salud: {
    id: 'salud',
    nombre: 'Salud',
    mensajes: [
      'Tu cuerpo escucha lo que tu mente calla',
      'Sanar es un proceso, no un destino',
      'Acompanarte en el camino de la salud'
    ],
    beneficiosCirculo: ['meditaciones', 'rituales_sanacion', 'guardianes_salud'],
    testimoniosRelevantes: 'sanacion'
  },
  relaciones: {
    id: 'relaciones',
    nombre: 'Relaciones',
    mensajes: [
      'Antes de encontrar a otros, encontrate a vos',
      'Las relaciones sanas empiezan con limites claros',
      'El amor que buscas afuera ya vive adentro'
    ],
    beneficiosCirculo: ['rituales_amor', 'comunidad', 'guardianes_amor'],
    testimoniosRelevantes: 'amor'
  },
  proposito: {
    id: 'proposito',
    nombre: 'Proposito',
    mensajes: [
      'No estas perdida, estas en transicion',
      'Tu proposito no se encuentra, se construye',
      'El camino aparece cuando das el primer paso'
    ],
    beneficiosCirculo: ['ensenanzas', 'guardianes_sabiduria', 'rituales'],
    testimoniosRelevantes: 'transformacion'
  }
};

export const ESTILOS_DECISION = {
  impulsivo: {
    id: 'impulsivo',
    nombre: 'Impulsivo',
    descripcion: 'Decide rapido cuando algo resuena',
    estrategia: 'URGENCIA_REAL',
    cierreIdeal: 'impulsivo',
    elementos: ['escasez', 'accion_inmediata', 'sin_rodeos']
  },
  analitico: {
    id: 'analitico',
    nombre: 'Analitico',
    descripcion: 'Necesita datos y tiempo para decidir',
    estrategia: 'INFORMACION_COMPLETA',
    cierreIdeal: 'racional',
    elementos: ['beneficios_claros', 'comparativa', 'garantias']
  },
  emocional: {
    id: 'emocional',
    nombre: 'Emocional',
    descripcion: 'Decide desde el corazon',
    estrategia: 'CONEXION_PROFUNDA',
    cierreIdeal: 'vulnerable',
    elementos: ['testimonios', 'historias', 'conexion_personal']
  }
};

export const TIPOS_CREENCIAS = {
  creyente: {
    id: 'creyente',
    nombre: 'Creyente',
    descripcion: 'Cree en la magia y lo espiritual',
    contenido: 'MISTICO_COMPLETO',
    lenguaje: ['energia', 'ritual', 'guardian', 'portal'],
    mostrarMagia: 100
  },
  buscador: {
    id: 'buscador',
    nombre: 'Buscador',
    descripcion: 'Abierto pero todavia explorando',
    contenido: 'MIXTO',
    lenguaje: ['conexion', 'bienestar', 'comunidad', 'crecimiento'],
    mostrarMagia: 60
  },
  esceptico: {
    id: 'esceptico',
    nombre: 'Esceptico',
    descripcion: 'No cree facilmente, necesita validar',
    contenido: 'PRACTICO',
    lenguaje: ['bienestar', 'comunidad', 'contenido', 'herramientas'],
    mostrarMagia: 20
  }
};

// ===== FUNCION PRINCIPAL DE PERFILADO =====

/**
 * Calcula el perfil completo basado en respuestas del test
 * @param {Object} respuestas - Respuestas del test del guardian
 * @returns {Object} Perfil completo con vulnerabilidad, dolor, estilo y creencias
 */
export function calcularPerfil(respuestas) {
  // Si recibimos respuestas vacias, devolver perfil default
  if (!respuestas || Object.keys(respuestas).length === 0) {
    return getPerfilDefault();
  }

  // === 1. CALCULAR VULNERABILIDAD ===
  const vulnerabilidad = calcularVulnerabilidad(respuestas);

  // === 2. DETECTAR DOLOR PRINCIPAL ===
  const dolor = detectarDolorPrincipal(respuestas);

  // === 3. DETERMINAR ESTILO DE DECISION ===
  const estilo = determinarEstiloDecision(respuestas);

  // === 4. EVALUAR CREENCIAS ===
  const creencias = evaluarCreencias(respuestas);

  // === 5. CALCULAR SCORE DE CONVERSION ===
  const conversionScore = calcularScoreConversion(vulnerabilidad, dolor, estilo, creencias);

  // === 6. DETERMINAR TIPO DE CIERRE RECOMENDADO ===
  const cierreRecomendado = determinarCierre(vulnerabilidad, estilo, creencias);

  // === 7. CONSTRUIR PERFIL COMPLETO ===
  const perfil = {
    // Datos core
    vulnerabilidad: {
      nivel: vulnerabilidad.nivel,
      score: vulnerabilidad.score,
      indicadores: vulnerabilidad.indicadores,
      enfoque: NIVELES_VULNERABILIDAD[vulnerabilidad.nivel]?.enfoque || 'VALOR_GRADUAL'
    },
    dolor: {
      tipo: dolor.tipo,
      intensidad: dolor.intensidad,
      mensajes: TIPOS_DOLOR[dolor.tipo]?.mensajes || [],
      beneficiosRelevantes: TIPOS_DOLOR[dolor.tipo]?.beneficiosCirculo || []
    },
    estilo: {
      tipo: estilo.tipo,
      velocidad: estilo.velocidad,
      estrategia: ESTILOS_DECISION[estilo.tipo]?.estrategia || 'VALOR_GRADUAL',
      elementos: ESTILOS_DECISION[estilo.tipo]?.elementos || []
    },
    creencias: {
      tipo: creencias.tipo,
      apertura: creencias.apertura,
      contenido: TIPOS_CREENCIAS[creencias.tipo]?.contenido || 'MIXTO',
      mostrarMagia: TIPOS_CREENCIAS[creencias.tipo]?.mostrarMagia || 60
    },

    // Metricas de conversion
    conversion: {
      score: conversionScore,
      probabilidad: calcularProbabilidadConversion(conversionScore),
      cierreRecomendado,
      microCompromisoSugerido: sugerirMicroCompromiso(conversionScore, vulnerabilidad)
    },

    // Metadata
    fechaCalculo: new Date().toISOString(),
    version: '1.0'
  };

  return perfil;
}

// ===== FUNCIONES DE CALCULO =====

function calcularVulnerabilidad(respuestas) {
  let score = 0;
  const indicadores = [];

  // Pregunta 2: momento de vida
  const momento = respuestas[2]?.momento || respuestas[2]?.id;
  if (momento === 'crisis') {
    score += 40;
    indicadores.push('crisis_actual');
  } else if (momento === 'transicion') {
    score += 20;
    indicadores.push('transicion');
  }

  // Pregunta 11: nivel de sufrimiento (1-10)
  const sufrimiento = respuestas[11]?.valor || 5;
  if (sufrimiento >= 8) {
    score += 30;
    indicadores.push('sufrimiento_alto');
  } else if (sufrimiento >= 6) {
    score += 20;
    indicadores.push('sufrimiento_medio');
  } else if (sufrimiento >= 4) {
    score += 10;
  }

  // Pregunta 12: duracion del dolor
  const cronicidad = respuestas[12]?.cronicidad || 0;
  score += cronicidad * 10;
  if (cronicidad >= 2) {
    indicadores.push('dolor_cronico');
  }

  // Texto libre: detectar palabras de aislamiento
  const textoLibre = respuestas[5]?.texto || '';
  const palabrasVulnerabilidad = ['solo', 'sola', 'nadie', 'abandonad', 'morir', 'suicid', 'no puedo'];
  palabrasVulnerabilidad.forEach(palabra => {
    if (textoLibre.toLowerCase().includes(palabra)) {
      score += 10;
      if (!indicadores.includes('aislamiento_verbal')) {
        indicadores.push('aislamiento_verbal');
      }
    }
  });

  // Determinar nivel
  let nivel = 'baja';
  if (score > 70) nivel = 'alta';
  else if (score > 40) nivel = 'media';

  return {
    nivel,
    score: Math.min(score, 100),
    indicadores
  };
}

function detectarDolorPrincipal(respuestas) {
  // Mapeo de respuestas a dolor
  const dolorMap = {
    'carga': 'relaciones',
    'esquiva': 'soledad',
    'vacio': 'proposito',
    'estancada': 'dinero'
  };

  // Dolor de pregunta 1
  let tipoDolor = dolorMap[respuestas[1]?.id] || 'proposito';

  // Si hay texto libre, puede override
  const textoLibre = respuestas[5]?.texto || '';
  if (textoLibre.length > 20) {
    tipoDolor = detectarDolorDeTexto(textoLibre);
  }

  // Intensidad basada en sufrimiento
  const sufrimiento = respuestas[11]?.valor || 5;
  const intensidad = sufrimiento * 10;

  return {
    tipo: tipoDolor,
    intensidad,
    textoOriginal: textoLibre.substring(0, 200)
  };
}

function detectarDolorDeTexto(texto) {
  if (!texto) return 'proposito';
  const t = texto.toLowerCase();

  // Orden de prioridad de deteccion
  if (t.includes('solo') || t.includes('sola') || t.includes('nadie') || t.includes('abandonad')) return 'soledad';
  if (t.includes('plata') || t.includes('dinero') || t.includes('trabajo') || t.includes('deuda') || t.includes('pagar')) return 'dinero';
  if (t.includes('enferm') || t.includes('dolor fisico') || t.includes('cuerpo') || t.includes('salud') || t.includes('cancer')) return 'salud';
  if (t.includes('pareja') || t.includes('amor') || t.includes('relacion') || t.includes('familia') || t.includes('hijo') || t.includes('madre')) return 'relaciones';

  return 'proposito';
}

function determinarEstiloDecision(respuestas) {
  // Pregunta 9: como decide
  const respuestaDecision = respuestas[9]?.id || 'consulto';

  const estiloMap = {
    'enseguida': { tipo: 'impulsivo', velocidad: 'rapido' },
    'pienso_dias': { tipo: 'analitico', velocidad: 'medio' },
    'consulto': { tipo: 'emocional', velocidad: 'lento' },
    'investigo': { tipo: 'analitico', velocidad: 'lento' }
  };

  let estilo = estiloMap[respuestaDecision] || { tipo: 'emocional', velocidad: 'medio' };

  // Pregunta 8: bloqueos - puede modificar el estilo
  if (respuestas[8]?.bloqueo === 'escepticismo' && estilo.tipo !== 'impulsivo') {
    estilo.tipo = 'analitico';
  }

  return estilo;
}

function evaluarCreencias(respuestas) {
  // Pregunta 10: creencias sobre energia
  const respuestaCreencia = respuestas[10];

  if (!respuestaCreencia) {
    return { tipo: 'buscador', apertura: 50 };
  }

  return {
    tipo: respuestaCreencia.creencia || 'buscador',
    apertura: respuestaCreencia.apertura || 50
  };
}

function calcularScoreConversion(vulnerabilidad, dolor, estilo, creencias) {
  let score = 50; // Base

  // Vulnerabilidad alta = menor presion, menor conversion inmediata
  if (vulnerabilidad.nivel === 'alta') score -= 15;
  else if (vulnerabilidad.nivel === 'media') score += 5;
  else score += 15;

  // Dolor intenso = mayor necesidad = potencial conversion
  if (dolor.intensidad >= 70) score += 15;
  else if (dolor.intensidad >= 50) score += 5;

  // Estilo impulsivo = mayor conversion inmediata
  if (estilo.tipo === 'impulsivo') score += 20;
  else if (estilo.tipo === 'analitico') score -= 10;

  // Creencia alta = mas facil de convertir
  if (creencias.apertura >= 80) score += 15;
  else if (creencias.apertura >= 50) score += 5;
  else score -= 10;

  return Math.max(0, Math.min(100, score));
}

function calcularProbabilidadConversion(score) {
  if (score >= 80) return 'muy_alta';
  if (score >= 60) return 'alta';
  if (score >= 40) return 'media';
  if (score >= 20) return 'baja';
  return 'muy_baja';
}

function determinarCierre(vulnerabilidad, estilo, creencias) {
  // Prioridad: vulnerabilidad > creencias > estilo
  if (vulnerabilidad.nivel === 'alta') return 'vulnerable';
  if (creencias.tipo === 'esceptico') return 'esceptico';
  if (estilo.tipo === 'impulsivo') return 'impulsivo';
  if (estilo.tipo === 'analitico') return 'racional';
  if (creencias.tipo === 'creyente' && vulnerabilidad.nivel === 'baja') return 'coleccionista';

  return 'vulnerable'; // Default mas seguro
}

function sugerirMicroCompromiso(conversionScore, vulnerabilidad) {
  // Para vulnerabilidad alta, siempre empezar con lo mas suave
  if (vulnerabilidad.nivel === 'alta') {
    return {
      paso: 1,
      tipo: 'test_gratis',
      descripcion: 'Completar test del guardian',
      siguientePaso: 'email_avisos'
    };
  }

  // Segun score de conversion
  if (conversionScore >= 70) {
    return {
      paso: 4,
      tipo: 'trial_15_dias',
      descripcion: 'Activar prueba gratuita de 15 dias',
      siguientePaso: 'membresia_paga'
    };
  }

  if (conversionScore >= 50) {
    return {
      paso: 3,
      tipo: 'preview_contenido',
      descripcion: 'Ver preview de contenido exclusivo',
      siguientePaso: 'trial_15_dias'
    };
  }

  return {
    paso: 2,
    tipo: 'email_avisos',
    descripcion: 'Suscribirse a avisos del Circulo',
    siguientePaso: 'preview_contenido'
  };
}

function getPerfilDefault() {
  return {
    vulnerabilidad: {
      nivel: 'media',
      score: 50,
      indicadores: [],
      enfoque: 'VALOR_GRADUAL'
    },
    dolor: {
      tipo: 'proposito',
      intensidad: 50,
      mensajes: TIPOS_DOLOR.proposito.mensajes,
      beneficiosRelevantes: TIPOS_DOLOR.proposito.beneficiosCirculo
    },
    estilo: {
      tipo: 'emocional',
      velocidad: 'medio',
      estrategia: 'CONEXION_PROFUNDA',
      elementos: ['testimonios', 'historias', 'conexion_personal']
    },
    creencias: {
      tipo: 'buscador',
      apertura: 50,
      contenido: 'MIXTO',
      mostrarMagia: 60
    },
    conversion: {
      score: 50,
      probabilidad: 'media',
      cierreRecomendado: 'vulnerable',
      microCompromisoSugerido: {
        paso: 2,
        tipo: 'email_avisos',
        descripcion: 'Suscribirse a avisos del Circulo',
        siguientePaso: 'preview_contenido'
      }
    },
    fechaCalculo: new Date().toISOString(),
    version: '1.0'
  };
}

// ===== FUNCIONES DE PERSISTENCIA KV =====

/**
 * Guarda el perfil en KV
 * @param {string} email - Email del usuario
 * @param {Object} perfil - Perfil calculado
 */
export async function guardarPerfil(email, perfil) {
  if (!email) throw new Error('Email requerido');

  const emailNormalizado = email.toLowerCase().trim();
  const key = `perfil:${emailNormalizado}`;

  await kv.set(key, {
    ...perfil,
    email: emailNormalizado,
    ultimaActualizacion: new Date().toISOString()
  });

  // Tambien actualizar el registro de elegido si existe
  const elegido = await kv.get(`elegido:${emailNormalizado}`);
  if (elegido) {
    await kv.set(`elegido:${emailNormalizado}`, {
      ...elegido,
      perfilCirculo: perfil,
      perfilActualizado: new Date().toISOString()
    });
  }

  return true;
}

/**
 * Obtiene el perfil de KV
 * @param {string} email - Email del usuario
 * @returns {Object|null} Perfil guardado o null
 */
export async function obtenerPerfil(email) {
  if (!email) return null;

  const emailNormalizado = email.toLowerCase().trim();
  const perfil = await kv.get(`perfil:${emailNormalizado}`);

  return perfil;
}

/**
 * Verifica si el perfil necesita actualizacion
 * @param {Object} perfil - Perfil existente
 * @returns {boolean} True si necesita actualizacion
 */
export function perfilNecesitaActualizacion(perfil) {
  if (!perfil || !perfil.fechaCalculo) return true;

  const fechaCalculo = new Date(perfil.fechaCalculo);
  const ahora = new Date();
  const diasDesdeCalculo = (ahora - fechaCalculo) / (1000 * 60 * 60 * 24);

  // Actualizar si tiene mas de 30 dias
  return diasDesdeCalculo > 30;
}

// ===== EXPORTACIONES =====

export default {
  calcularPerfil,
  guardarPerfil,
  obtenerPerfil,
  perfilNecesitaActualizacion,
  NIVELES_VULNERABILIDAD,
  TIPOS_DOLOR,
  ESTILOS_DECISION,
  TIPOS_CREENCIAS
};
