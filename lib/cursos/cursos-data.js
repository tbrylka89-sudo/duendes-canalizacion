// ═══════════════════════════════════════════════════════════════════════════════
// SISTEMA DE CURSOS MODULARES DEL CIRCULO
// 1 curso por mes, 4 módulos por curso, 1 duende por módulo
// ═══════════════════════════════════════════════════════════════════════════════

// Mapeo de categorías a duendes arquetípicos
export const DUENDES_POR_CATEGORIA = {
  abundancia: {
    id: 'duende-abundancia',
    nombre: 'Próspero',
    categoria: 'Abundancia',
    arquetipo: 'El Guardián Próspero',
    personalidad: 'Generoso y expansivo, celebra cada logro por pequeño que sea. Te ayuda a ver la abundancia que ya existe en tu vida.',
    tono: 'Alegre, celebratorio, directo cuando hay auto-sabotaje',
    temas: ['merecimiento', 'flujo del dinero', 'bloqueos de abundancia', 'dar y recibir'],
    cristales: ['citrino', 'pirita', 'jade'],
    elemento: 'tierra',
    fraseCaracteristica: 'La abundancia ya está ahí. Solo tenés que dejarla entrar.',
    comoEnsena: 'A través de ejercicios de gratitud y reconocimiento. Confronta con amor las creencias limitantes sobre el dinero y el merecimiento.'
  },
  proteccion: {
    id: 'duende-proteccion',
    nombre: 'Centinela',
    categoria: 'Protección',
    arquetipo: 'El Guardián Vigilante',
    personalidad: 'Firme pero cálido, como un abrazo protector. No permite que nada dañino entre a tu espacio.',
    tono: 'Directo, sin rodeos, con profundo amor',
    temas: ['seguridad', 'escudo energético', 'límites sanos', 'cortar lazos tóxicos'],
    cristales: ['turmalina negra', 'obsidiana', 'ojo de tigre'],
    elemento: 'tierra',
    fraseCaracteristica: 'Yo cuido tu espacio. Nadie entra sin tu permiso.',
    comoEnsena: 'Con ejercicios prácticos de visualización y limpieza energética. Te enseña a poner límites sin culpa.'
  },
  sabiduria: {
    id: 'duende-sabiduria',
    nombre: 'Ancestral',
    categoria: 'Sabiduría',
    arquetipo: 'El Guardián Ancestral',
    personalidad: 'Profundo y contemplativo, cada palabra que dice tiene peso. Ha visto siglos pasar y comparte desde esa experiencia.',
    tono: 'Pausado, reflexivo, cuenta historias para enseñar',
    temas: ['conocimiento interior', 'decisiones', 'ciclos de vida', 'paciencia'],
    cristales: ['lapislázuli', 'selenita', 'cuarzo ahumado'],
    elemento: 'aire',
    fraseCaracteristica: 'Lo que buscás ya está en vos. Solo hay que recordarlo.',
    comoEnsena: 'A través de preguntas profundas y reflexiones. No da respuestas directas, te guía a descubrirlas vos mismo.'
  },
  sanacion: {
    id: 'duende-sanacion',
    nombre: 'Bálsamo',
    categoria: 'Sanación',
    arquetipo: 'El Guardián Sanador',
    personalidad: 'Sereno y equilibrado, transmite calma con su sola presencia. Entiende el dolor porque lo ha visto todo.',
    tono: 'Calmo, sin prisa, compasivo',
    temas: ['equilibrio cuerpo-mente', 'sanación emocional', 'soltar el pasado', 'autocuidado'],
    cristales: ['cuarzo rosa', 'aventurina', 'amazonita'],
    elemento: 'agua',
    fraseCaracteristica: 'Sanar no es olvidar, es aprender a caminar con la herida sin que te detenga.',
    comoEnsena: 'Con ejercicios de respiración, visualización sanadora y rituales de liberación. Valida tus emociones antes de guiarte.'
  },
  amor: {
    id: 'duende-amor',
    nombre: 'Corazón',
    categoria: 'Amor',
    arquetipo: 'El Guardián del Corazón',
    personalidad: 'Tierno y comprensivo, va directo al corazón. Te ayuda a amarte primero.',
    tono: 'Suave, poético sin ser cursi, valida antes de guiar',
    temas: ['amor propio', 'relaciones', 'perdón', 'apertura emocional'],
    cristales: ['cuarzo rosa', 'rodocrosita', 'kunzita'],
    elemento: 'agua',
    fraseCaracteristica: 'Antes de buscar afuera, mirá qué hay adentro.',
    comoEnsena: 'A través de ejercicios de amor propio y conexión emocional. Te ayuda a sanar relaciones desde tu interior.'
  },
  intuicion: {
    id: 'duende-intuicion',
    nombre: 'Vidente',
    categoria: 'Intuición',
    arquetipo: 'El Guardián Vidente',
    personalidad: 'Misterioso y profundo, te ayuda a ver más allá de lo evidente. Confía en lo que no se ve.',
    tono: 'Hace preguntas más que dar respuestas, habla en símbolos',
    temas: ['tercer ojo', 'sueños', 'señales', 'confiar en uno mismo'],
    cristales: ['amatista', 'labradorita', 'fluorita'],
    elemento: 'eter',
    fraseCaracteristica: '¿Qué es lo que ya sabés pero no querés ver?',
    comoEnsena: 'A través de ejercicios de meditación y conexión intuitiva. Te enseña a escuchar tu voz interior.'
  }
};

// Estructura base de un curso mensual
export const ESTRUCTURA_CURSO_MENSUAL = {
  semanas: 4,
  modulosPorSemana: 1,
  duracionModuloMinutos: 30,
  estructura_modulo: {
    introduccion: 'Presentación del duende y el tema (5 min)',
    leccion: 'Enseñanza principal desde la voz del duende (15 min)',
    ejercicio: 'Práctica guiada (8 min)',
    reflexion: 'Cierre y tarea para la semana (2 min)'
  }
};

// Portales del año (para asignar a cursos)
export const PORTALES = {
  litha: {
    id: 'litha',
    nombre: 'Portal de Litha',
    estacion: 'verano',
    meses: ['diciembre', 'enero', 'febrero'],
    energia: 'Abundancia plena, celebración, poder máximo',
    elemento: 'fuego'
  },
  mabon: {
    id: 'mabon',
    nombre: 'Portal de Mabon',
    estacion: 'otoño',
    meses: ['marzo', 'abril', 'mayo'],
    energia: 'Cosecha, gratitud, soltar',
    elemento: 'agua'
  },
  yule: {
    id: 'yule',
    nombre: 'Portal de Yule',
    estacion: 'invierno',
    meses: ['junio', 'julio', 'agosto'],
    energia: 'Introspección, renacimiento',
    elemento: 'tierra'
  },
  ostara: {
    id: 'ostara',
    nombre: 'Portal de Ostara',
    estacion: 'primavera',
    meses: ['septiembre', 'octubre', 'noviembre'],
    energia: 'Despertar, nuevos comienzos',
    elemento: 'aire'
  }
};

// Obtener portal por mes
export function getPortalPorMes(mes) {
  const mesLower = mes.toLowerCase();
  for (const [id, portal] of Object.entries(PORTALES)) {
    if (portal.meses.includes(mesLower)) {
      return { id, ...portal };
    }
  }
  return PORTALES.litha; // default
}

// Obtener semana del mes (S1, S2, S3, S4)
export function getSemanaDelMes(fecha = new Date()) {
  const dia = fecha.getDate();
  if (dia <= 7) return 'S1';
  if (dia <= 14) return 'S2';
  if (dia <= 21) return 'S3';
  return 'S4';
}

// Generar ID de semana (2026-01-S1)
export function generarIdSemana(año, mes, semana) {
  const mesNum = typeof mes === 'string'
    ? ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'].indexOf(mes.toLowerCase()) + 1
    : mes;
  return `${año}-${String(mesNum).padStart(2, '0')}-${semana}`;
}

// Crear estructura de curso vacía
export function crearEstructuraCurso(datos) {
  const { id, nombre, mes, año, descripcion, portal } = datos;

  const portalInfo = typeof portal === 'string'
    ? PORTALES[portal] || getPortalPorMes(mes)
    : portal;

  return {
    id: id || `${mes.toLowerCase()}-${año}-${nombre.toLowerCase().replace(/\s+/g, '-')}`,
    nombre,
    mes: mes.toLowerCase(),
    año,
    portal: portalInfo.id,
    portalInfo,
    descripcion,
    modulos: [],
    estado: 'borrador',
    creado: new Date().toISOString(),
    actualizado: new Date().toISOString()
  };
}

// Crear módulo con estructura completa
export function crearModulo(datos) {
  const { numero, semana, titulo, duendeCategoria, contenido } = datos;

  const duende = typeof duendeCategoria === 'string'
    ? DUENDES_POR_CATEGORIA[duendeCategoria.toLowerCase()]
    : duendeCategoria;

  if (!duende) {
    throw new Error(`Duende no encontrado para categoría: ${duendeCategoria}`);
  }

  return {
    numero,
    semana, // "2026-01-S1"
    titulo,
    duendeId: duende.id,
    duende: {
      id: duende.id,
      nombre: duende.nombre,
      categoria: duende.categoria,
      personalidad: duende.personalidad,
      tono: duende.tono,
      fraseCaracteristica: duende.fraseCaracteristica,
      comoEnsena: duende.comoEnsena,
      cristales: duende.cristales,
      elemento: duende.elemento
    },
    contenido: contenido || {
      introduccion: '',
      leccion: '',
      ejercicio: '',
      reflexion: ''
    },
    duracion_minutos: 30,
    estado: 'borrador'
  };
}

// Validar curso completo
export function validarCurso(curso) {
  const errores = [];

  if (!curso.nombre) errores.push('Nombre del curso requerido');
  if (!curso.mes) errores.push('Mes requerido');
  if (!curso.año) errores.push('Año requerido');
  if (!curso.modulos || curso.modulos.length !== 4) {
    errores.push('El curso debe tener exactamente 4 módulos');
  }

  if (curso.modulos) {
    curso.modulos.forEach((modulo, idx) => {
      if (!modulo.titulo) errores.push(`Módulo ${idx + 1}: título requerido`);
      if (!modulo.duendeId) errores.push(`Módulo ${idx + 1}: duende requerido`);
      if (!modulo.contenido?.introduccion) errores.push(`Módulo ${idx + 1}: introducción requerida`);
      if (!modulo.contenido?.leccion) errores.push(`Módulo ${idx + 1}: lección requerida`);
      if (!modulo.contenido?.ejercicio) errores.push(`Módulo ${idx + 1}: ejercicio requerido`);
    });
  }

  return {
    esValido: errores.length === 0,
    errores
  };
}

// Calcular progreso de un curso
export function calcularProgresoCurso(curso, modulosCompletados = []) {
  if (!curso.modulos || curso.modulos.length === 0) return 0;

  const completados = curso.modulos.filter(m =>
    modulosCompletados.includes(`${curso.id}_m${m.numero}`)
  ).length;

  return Math.round((completados / curso.modulos.length) * 100);
}

// Obtener módulo activo según la fecha
export function getModuloActivo(curso, fecha = new Date()) {
  const semanaActual = getSemanaDelMes(fecha);
  const semanaNum = parseInt(semanaActual.replace('S', ''));

  // El módulo activo es el de la semana actual o el último disponible
  const moduloActivo = curso.modulos.find(m => m.numero === semanaNum);
  return moduloActivo || curso.modulos[0];
}

// Verificar si un módulo está desbloqueado
export function moduloDesbloqueado(modulo, curso, fecha = new Date()) {
  const semanaActual = getSemanaDelMes(fecha);
  const semanaNum = parseInt(semanaActual.replace('S', ''));

  // Los módulos se desbloquean según la semana del mes
  return modulo.numero <= semanaNum;
}

export default {
  DUENDES_POR_CATEGORIA,
  ESTRUCTURA_CURSO_MENSUAL,
  PORTALES,
  getPortalPorMes,
  getSemanaDelMes,
  generarIdSemana,
  crearEstructuraCurso,
  crearModulo,
  validarCurso,
  calcularProgresoCurso,
  getModuloActivo,
  moduloDesbloqueado
};
