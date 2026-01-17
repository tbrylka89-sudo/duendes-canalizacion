// ═══════════════════════════════════════════════════════════════════════════════
// SISTEMA DE CICLOS NATURALES
// Fases lunares y estaciones celtas para contenido contextual
// ═══════════════════════════════════════════════════════════════════════════════

// ─────────────────────────────────────────────────────────────────────────────────
// FASES LUNARES
// ─────────────────────────────────────────────────────────────────────────────────

export const FASES_LUNARES = {
  nueva: {
    nombre: 'Luna Nueva',
    icono: '🌑',
    energia: 'inicio',
    actividades: ['intenciones', 'nuevos proyectos', 'limpieza energética'],
    descripcion: 'Momento de sembrar intenciones y comenzar ciclos nuevos',
    colores: ['negro', 'plata', 'gris oscuro'],
    cristales: ['obsidiana', 'labradorita', 'piedra luna negra'],
    ritual: 'Escribir intenciones en papel y guardarlas bajo la almohada'
  },
  creciente: {
    nombre: 'Cuarto Creciente',
    icono: '🌒',
    energia: 'construcción',
    actividades: ['acción', 'crecimiento', 'atracción', 'manifestación'],
    descripcion: 'Tiempo de construir, actuar y atraer lo deseado',
    colores: ['verde', 'dorado', 'amarillo'],
    cristales: ['citrino', 'pirita', 'aventurina'],
    ritual: 'Encender vela verde mientras visualizas tus metas creciendo'
  },
  llena: {
    nombre: 'Luna Llena',
    icono: '🌕',
    energia: 'culminación',
    actividades: ['manifestación', 'celebración', 'gratitud', 'carga de cristales'],
    descripcion: 'Momento de máximo poder, celebración y cosecha',
    colores: ['blanco', 'plata', 'dorado brillante'],
    cristales: ['cuarzo transparente', 'selenita', 'piedra luna'],
    ritual: 'Colocar cristales bajo la luz de luna para cargarlos'
  },
  menguante: {
    nombre: 'Cuarto Menguante',
    icono: '🌘',
    energia: 'liberación',
    actividades: ['soltar', 'limpiar', 'cerrar ciclos', 'desapego'],
    descripcion: 'Tiempo de soltar lo que ya no sirve y cerrar ciclos',
    colores: ['morado', 'negro', 'azul oscuro'],
    cristales: ['amatista', 'turmalina negra', 'cuarzo ahumado'],
    ritual: 'Escribir lo que quieres soltar y quemarlo de forma segura'
  }
};

// Algoritmo para calcular fase lunar
// Basado en ciclo lunar de ~29.53 días
export function calcularFaseLunar(fecha = new Date()) {
  const lunaLlenaConocida = new Date('2024-01-25T17:54:00Z'); // Luna llena conocida
  const cicloLunar = 29.53058867; // Días del ciclo lunar sinódico

  const diasDesde = (fecha - lunaLlenaConocida) / (1000 * 60 * 60 * 24);
  const posicionEnCiclo = ((diasDesde % cicloLunar) + cicloLunar) % cicloLunar;

  // Calcular porcentaje de iluminación (aproximado)
  const porcentaje = Math.round(50 * (1 + Math.cos(2 * Math.PI * posicionEnCiclo / cicloLunar)));

  // Determinar fase basada en posición en el ciclo
  let fase;
  if (posicionEnCiclo < 1.85) {
    fase = 'llena';
  } else if (posicionEnCiclo < 7.38) {
    fase = 'menguante';
  } else if (posicionEnCiclo < 14.76) {
    fase = 'nueva';
  } else if (posicionEnCiclo < 22.14) {
    fase = 'creciente';
  } else {
    fase = 'llena';
  }

  // Calcular días hasta próxima fase
  const diasHastaProxima = Math.ceil((cicloLunar / 4) - (posicionEnCiclo % (cicloLunar / 4)));

  return {
    fase,
    datos: FASES_LUNARES[fase],
    porcentajeIluminacion: porcentaje,
    diasEnFaseActual: Math.floor(posicionEnCiclo % (cicloLunar / 4)),
    proximaFaseEn: diasHastaProxima,
    posicionEnCiclo: Math.round(posicionEnCiclo * 10) / 10
  };
}

// ─────────────────────────────────────────────────────────────────────────────────
// ESTACIONES CELTAS (RUEDA DEL AÑO)
// ─────────────────────────────────────────────────────────────────────────────────

export const ESTACIONES_CELTAS = {
  samhain: {
    nombre: 'Samhain',
    fecha: '31 octubre',
    fechaNum: { mes: 10, dia: 31 },
    significado: 'Año nuevo celta, honrar ancestros',
    duracion: 3,
    descripcion: 'El velo entre los mundos se adelgaza. Momento de honrar a quienes ya partieron y reflexionar sobre el ciclo que termina.',
    colores: ['naranja', 'negro', 'morado'],
    elementos: ['velas', 'calabazas', 'fotos de ancestros', 'manzanas'],
    rituales: ['altar ancestral', 'meditación de conexión', 'carta a ancestros', 'adivinación'],
    cristales: ['obsidiana', 'azabache', 'amatista oscura'],
    mensaje: 'Honra tu linaje. Tus ancestros caminan contigo.'
  },
  yule: {
    nombre: 'Yule',
    fecha: '21 diciembre',
    fechaNum: { mes: 12, dia: 21 },
    significado: 'Solsticio de invierno, renacimiento de la luz',
    duracion: 3,
    descripcion: 'La noche más larga. A partir de aquí, la luz comienza su regreso. Celebramos la esperanza y el renacimiento.',
    colores: ['rojo', 'verde', 'dorado', 'blanco'],
    elementos: ['acebo', 'muérdago', 'velas', 'piñas', 'ramas de pino'],
    rituales: ['encender velas', 'decorar árbol', 'intercambiar bendiciones', 'quemar tronco de yule'],
    cristales: ['granate', 'rubí', 'cuarzo transparente'],
    mensaje: 'En la oscuridad más profunda, nace la luz más brillante.'
  },
  imbolc: {
    nombre: 'Imbolc',
    fecha: '1 febrero',
    fechaNum: { mes: 2, dia: 1 },
    significado: 'Despertar de la tierra, purificación',
    duracion: 2,
    descripcion: 'La primavera comienza a susurrar bajo la tierra. Momento de purificación y nuevos comienzos.',
    colores: ['blanco', 'amarillo claro', 'verde tierno'],
    elementos: ['velas blancas', 'leche', 'semillas', 'muñeca de Brigid'],
    rituales: ['limpieza del hogar', 'bendición de semillas', 'crear muñeca de Brigid', 'encender todas las velas'],
    cristales: ['amatista', 'cuarzo rosa', 'piedra luna'],
    mensaje: 'Bajo el hielo, la vida se prepara para renacer.'
  },
  ostara: {
    nombre: 'Ostara',
    fecha: '21 marzo',
    fechaNum: { mes: 3, dia: 21 },
    significado: 'Equinoccio de primavera, equilibrio',
    duracion: 2,
    descripcion: 'Día y noche en perfecto balance. La naturaleza explota en vida. Tiempo de fertilidad y nuevos comienzos.',
    colores: ['verde', 'amarillo', 'rosa', 'lavanda'],
    elementos: ['huevos', 'flores', 'conejos', 'semillas germinando'],
    rituales: ['plantar semillas', 'decorar huevos', 'altar de primavera', 'ritual de equilibrio'],
    cristales: ['jade', 'cuarzo rosa', 'aventurina'],
    mensaje: 'El equilibrio perfecto trae la mayor abundancia.'
  },
  beltane: {
    nombre: 'Beltane',
    fecha: '1 mayo',
    fechaNum: { mes: 5, dia: 1 },
    significado: 'Fertilidad, pasión, fuego sagrado',
    duracion: 2,
    descripcion: 'La vida está en su máxima expresión. Celebración de la fertilidad, la pasión y la unión sagrada.',
    colores: ['rojo', 'verde intenso', 'dorado'],
    elementos: ['flores', 'cintas', 'hoguera', 'árbol de mayo'],
    rituales: ['saltar sobre el fuego', 'trenzar cintas', 'recoger rocío', 'celebrar la unión'],
    cristales: ['cornalina', 'granate', 'citrino'],
    mensaje: 'La pasión es el fuego que impulsa la creación.'
  },
  litha: {
    nombre: 'Litha',
    fecha: '21 junio',
    fechaNum: { mes: 6, dia: 21 },
    significado: 'Solsticio de verano, máximo poder solar',
    duracion: 2,
    descripcion: 'El día más largo. El sol en su máximo esplendor. Momento de celebrar logros y cargar energía.',
    colores: ['amarillo', 'naranja', 'dorado brillante'],
    elementos: ['girasoles', 'hierbas de San Juan', 'miel', 'frutas'],
    rituales: ['ver amanecer', 'recolectar hierbas', 'ritual de abundancia', 'agua de sol'],
    cristales: ['citrino', 'ámbar', 'ojo de tigre'],
    mensaje: 'Brilla con toda tu luz. Este es tu momento de esplendor.'
  },
  lughnasadh: {
    nombre: 'Lughnasadh',
    fecha: '1 agosto',
    fechaNum: { mes: 8, dia: 1 },
    significado: 'Primera cosecha, gratitud',
    duracion: 2,
    descripcion: 'La primera cosecha del año. Momento de agradecer los frutos de nuestro trabajo y compartir abundancia.',
    colores: ['dorado', 'marrón', 'naranja', 'verde oliva'],
    elementos: ['trigo', 'pan', 'maíz', 'frutas maduras'],
    rituales: ['hornear pan', 'ofrenda de gratitud', 'compartir comida', 'crear muñeca de trigo'],
    cristales: ['pirita', 'jaspe', 'peridoto'],
    mensaje: 'Cosecha con gratitud lo que sembraste con amor.'
  },
  mabon: {
    nombre: 'Mabon',
    fecha: '21 septiembre',
    fechaNum: { mes: 9, dia: 21 },
    significado: 'Equinoccio de otoño, balance y segunda cosecha',
    duracion: 2,
    descripcion: 'Nuevamente el equilibrio entre luz y oscuridad. Momento de agradecer la abundancia antes del descanso invernal.',
    colores: ['naranja', 'marrón', 'rojo oscuro', 'dorado'],
    elementos: ['manzanas', 'calabazas', 'hojas secas', 'nueces'],
    rituales: ['altar de gratitud', 'caminata en naturaleza', 'conservar alimentos', 'ritual de equilibrio'],
    cristales: ['ámbar', 'cuarzo ahumado', 'jaspe otoñal'],
    mensaje: 'En el equilibrio encontramos la verdadera abundancia.'
  }
};

// Obtener próxima celebración celta
export function proximaCelebracion(fecha = new Date()) {
  const hoy = fecha;
  const añoActual = hoy.getFullYear();

  // Convertir celebraciones a fechas ordenables
  const celebracionesConFecha = Object.entries(ESTACIONES_CELTAS).map(([key, celeb]) => {
    let fechaCeleb = new Date(añoActual, celeb.fechaNum.mes - 1, celeb.fechaNum.dia);

    // Si ya pasó este año, usar el próximo
    if (fechaCeleb < hoy) {
      fechaCeleb = new Date(añoActual + 1, celeb.fechaNum.mes - 1, celeb.fechaNum.dia);
    }

    return {
      key,
      ...celeb,
      fechaCompleta: fechaCeleb,
      diasRestantes: Math.ceil((fechaCeleb - hoy) / (1000 * 60 * 60 * 24))
    };
  });

  // Ordenar por días restantes
  celebracionesConFecha.sort((a, b) => a.diasRestantes - b.diasRestantes);

  const proxima = celebracionesConFecha[0];

  return {
    celebracion: proxima.key,
    datos: ESTACIONES_CELTAS[proxima.key],
    diasRestantes: proxima.diasRestantes,
    fechaCompleta: proxima.fechaCompleta,
    esHoy: proxima.diasRestantes === 0,
    esCercana: proxima.diasRestantes <= 7,
    esEstaSemana: proxima.diasRestantes <= 7
  };
}

// Obtener celebración actual (si estamos en período de celebración)
export function celebracionActual(fecha = new Date()) {
  const hoy = fecha;
  const añoActual = hoy.getFullYear();

  for (const [key, celeb] of Object.entries(ESTACIONES_CELTAS)) {
    const fechaInicio = new Date(añoActual, celeb.fechaNum.mes - 1, celeb.fechaNum.dia);
    const fechaFin = new Date(fechaInicio);
    fechaFin.setDate(fechaFin.getDate() + celeb.duracion);

    if (hoy >= fechaInicio && hoy <= fechaFin) {
      return {
        celebracion: key,
        datos: celeb,
        diaDelaACelebracion: Math.ceil((hoy - fechaInicio) / (1000 * 60 * 60 * 24)) + 1
      };
    }
  }

  return null;
}

// ─────────────────────────────────────────────────────────────────────────────────
// ESTACIONES DEL AÑO (Hemisferio Sur)
// ─────────────────────────────────────────────────────────────────────────────────

export function obtenerEstacion(fecha = new Date(), hemisferio = 'sur') {
  const mes = fecha.getMonth() + 1;
  const dia = fecha.getDate();

  let estacion;

  // Basado en solsticios y equinoccios aproximados
  if ((mes === 12 && dia >= 21) || mes === 1 || mes === 2 || (mes === 3 && dia < 21)) {
    estacion = hemisferio === 'sur' ? 'verano' : 'invierno';
  } else if ((mes === 3 && dia >= 21) || mes === 4 || mes === 5 || (mes === 6 && dia < 21)) {
    estacion = hemisferio === 'sur' ? 'otoño' : 'primavera';
  } else if ((mes === 6 && dia >= 21) || mes === 7 || mes === 8 || (mes === 9 && dia < 21)) {
    estacion = hemisferio === 'sur' ? 'invierno' : 'verano';
  } else {
    estacion = hemisferio === 'sur' ? 'primavera' : 'otoño';
  }

  const datosEstacion = {
    verano: { nombre: 'Verano', energia: 'expansión', elemento: 'fuego' },
    otoño: { nombre: 'Otoño', energia: 'cosecha', elemento: 'tierra' },
    invierno: { nombre: 'Invierno', energia: 'introspección', elemento: 'agua' },
    primavera: { nombre: 'Primavera', energia: 'renacimiento', elemento: 'aire' }
  };

  return {
    estacion,
    ...datosEstacion[estacion]
  };
}

// ─────────────────────────────────────────────────────────────────────────────────
// INFORMACIÓN COMPLETA DEL DÍA
// ─────────────────────────────────────────────────────────────────────────────────

export function infoDiaActual(fecha = new Date()) {
  const diasSemana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

  const faseLunar = calcularFaseLunar(fecha);
  const proximaCeleb = proximaCelebracion(fecha);
  const celebActual = celebracionActual(fecha);
  const estacion = obtenerEstacion(fecha);

  return {
    fecha: {
      diaSemana: diasSemana[fecha.getDay()],
      dia: fecha.getDate(),
      mes: meses[fecha.getMonth()],
      año: fecha.getFullYear(),
      completa: fecha.toISOString()
    },
    faseLunar,
    celebracionProxima: proximaCeleb,
    celebracionActual: celebActual,
    estacion,
    esFinDeSemana: [0, 6].includes(fecha.getDay()),
    esDiaEspecial: celebActual !== null || faseLunar.fase === 'llena' || faseLunar.fase === 'nueva'
  };
}

// ─────────────────────────────────────────────────────────────────────────────────
// SUGERENCIAS DE CONTENIDO BASADAS EN CICLOS
// ─────────────────────────────────────────────────────────────────────────────────

export function sugerirContenido(fecha = new Date()) {
  const info = infoDiaActual(fecha);
  const sugerencias = [];

  // Basado en fase lunar
  if (info.faseLunar.fase === 'nueva') {
    sugerencias.push({
      tipo: 'ritual',
      tema: 'Ritual de intenciones de luna nueva',
      urgencia: 'alta',
      razon: 'Luna nueva - momento ideal para nuevos comienzos'
    });
  } else if (info.faseLunar.fase === 'llena') {
    sugerencias.push({
      tipo: 'meditacion',
      tema: 'Meditación de luna llena para manifestación',
      urgencia: 'alta',
      razon: 'Luna llena - máximo poder de manifestación'
    });
  }

  // Basado en celebración cercana
  if (info.celebracionProxima.esCercana) {
    sugerencias.push({
      tipo: 'conocimiento',
      tema: `Preparación para ${info.celebracionProxima.datos.nombre}`,
      urgencia: 'media',
      razon: `${info.celebracionProxima.datos.nombre} en ${info.celebracionProxima.diasRestantes} días`
    });
  }

  // Basado en celebración actual
  if (info.celebracionActual) {
    sugerencias.push({
      tipo: 'ritual',
      tema: `Ritual especial de ${info.celebracionActual.datos.nombre}`,
      urgencia: 'alta',
      razon: `Hoy es ${info.celebracionActual.datos.nombre}`
    });
  }

  // Sugerencia por día de la semana
  const sugerenciasDia = {
    0: { tipo: 'meditacion', tema: 'Meditación de conexión solar' }, // Domingo
    1: { tipo: 'mensaje_diario', tema: 'Mensaje de inicio de semana' }, // Lunes
    2: { tipo: 'ritual', tema: 'Ritual de acción y coraje' }, // Martes
    3: { tipo: 'conocimiento', tema: 'Enseñanza sobre comunicación mágica' }, // Miércoles
    4: { tipo: 'diy', tema: 'Proyecto de abundancia' }, // Jueves
    5: { tipo: 'ritual', tema: 'Ritual de amor propio' }, // Viernes
    6: { tipo: 'descanso', tema: 'Práctica de introspección' } // Sábado
  };

  sugerencias.push({
    ...sugerenciasDia[fecha.getDay()],
    urgencia: 'baja',
    razon: `Sugerencia para ${info.fecha.diaSemana}`
  });

  return sugerencias;
}

export default {
  FASES_LUNARES,
  ESTACIONES_CELTAS,
  calcularFaseLunar,
  proximaCelebracion,
  celebracionActual,
  obtenerEstacion,
  infoDiaActual,
  sugerirContenido
};
