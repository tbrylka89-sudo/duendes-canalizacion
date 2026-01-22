// ═══════════════════════════════════════════════════════════════════════════════
// MOTOR DE SINCRONICIDAD - Duendes del Uruguay
// Genera "coincidencias mágicas" personalizadas basadas en datos del usuario
// Usado en emails y web para personalizar la experiencia
// ═══════════════════════════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════════════════════════
// MENSAJES POR TIPO DE SINCRONICIDAD
// ═══════════════════════════════════════════════════════════════════════════════

const MENSAJES_DIA_SEMANA = {
  0: { // Domingo
    planeta: 'Sol',
    mensaje: 'Los domingos son días de Sol, de luz interior. No es casualidad que estés acá hoy.'
  },
  1: { // Lunes
    planeta: 'Luna',
    mensaje: 'Los lunes son días de Luna, de intuición y sensibilidad. No es casualidad que estés acá hoy.'
  },
  2: { // Martes
    planeta: 'Marte',
    mensaje: 'Los martes son días de Marte, de acción. No es casualidad que estés acá hoy.'
  },
  3: { // Miércoles
    planeta: 'Mercurio',
    mensaje: 'Los miércoles son días de Mercurio, de comunicación y conexiones. No es casualidad que estés acá hoy.'
  },
  4: { // Jueves
    planeta: 'Júpiter',
    mensaje: 'Los jueves son días de Júpiter, de expansión y abundancia. No es casualidad que estés acá hoy.'
  },
  5: { // Viernes
    planeta: 'Venus',
    mensaje: 'Los viernes son días de Venus, de amor y belleza. No es casualidad que estés acá hoy.'
  },
  6: { // Sábado
    planeta: 'Saturno',
    mensaje: 'Los sábados son días de Saturno, de reflexión profunda. No es casualidad que estés acá hoy.'
  }
};

const MENSAJES_HORA = {
  madrugada: { // 00-05
    nombre: 'la hora del velo fino',
    mensaje: 'Entre las 12 y las 5 de la madrugada el velo entre mundos es más fino. No es casualidad que estés acá ahora.'
  },
  amanecer: { // 05-08
    nombre: 'el amanecer',
    mensaje: 'El amanecer es cuando la energía se renueva. Algo nuevo está empezando para vos.'
  },
  mañana: { // 08-12
    nombre: 'la mañana',
    mensaje: null // Sin mensaje especial
  },
  mediodia: { // 12-14
    nombre: 'el mediodía',
    mensaje: 'El mediodía es el punto de máxima luz. Claridad para ver lo que necesitás ver.'
  },
  tarde: { // 14-18
    nombre: 'la tarde',
    mensaje: null // Sin mensaje especial
  },
  atardecer: { // 18-20
    nombre: 'el atardecer',
    mensaje: 'El atardecer es el momento de transición. Algo se está cerrando para que algo nuevo abra.'
  },
  noche: { // 20-00
    nombre: 'la noche',
    mensaje: null // Sin mensaje especial
  }
};

// Signos zodiacales con sus rangos de fechas y mensajes
const SIGNOS_ZODIACALES = {
  aries: {
    inicio: { mes: 3, dia: 21 },
    fin: { mes: 4, dia: 19 },
    elemento: 'fuego',
    mensaje: 'Sos de Aries, el signo del impulso y la valentía. Los guardianes de fuego resuenan especialmente con tu energía.'
  },
  tauro: {
    inicio: { mes: 4, dia: 20 },
    fin: { mes: 5, dia: 20 },
    elemento: 'tierra',
    mensaje: 'Sos de Tauro, el signo de la persistencia y la conexión con la tierra. Los guardianes de tierra te reconocen.'
  },
  geminis: {
    inicio: { mes: 5, dia: 21 },
    fin: { mes: 6, dia: 20 },
    elemento: 'aire',
    mensaje: 'Sos de Géminis, el signo de la comunicación y la dualidad. Los guardianes de aire entienden tu naturaleza.'
  },
  cancer: {
    inicio: { mes: 6, dia: 21 },
    fin: { mes: 7, dia: 22 },
    elemento: 'agua',
    mensaje: 'Sos de Cáncer, el signo de la protección y la intuición profunda. Los guardianes de agua te acompañan.'
  },
  leo: {
    inicio: { mes: 7, dia: 23 },
    fin: { mes: 8, dia: 22 },
    elemento: 'fuego',
    mensaje: 'Sos de Leo, el signo de la creatividad y el brillo interior. Los guardianes de fuego celebran tu luz.'
  },
  virgo: {
    inicio: { mes: 8, dia: 23 },
    fin: { mes: 9, dia: 22 },
    elemento: 'tierra',
    mensaje: 'Sos de Virgo, el signo del detalle y el servicio. Los guardianes de tierra valoran tu precisión.'
  },
  libra: {
    inicio: { mes: 9, dia: 23 },
    fin: { mes: 10, dia: 22 },
    elemento: 'aire',
    mensaje: 'Sos de Libra, el signo del equilibrio y la armonía. Los guardianes de aire buscan ese balance con vos.'
  },
  escorpio: {
    inicio: { mes: 10, dia: 23 },
    fin: { mes: 11, dia: 21 },
    elemento: 'agua',
    mensaje: 'Sos de Escorpio, el signo de la transformación profunda. Los guardianes de agua conocen tus aguas oscuras.'
  },
  sagitario: {
    inicio: { mes: 11, dia: 22 },
    fin: { mes: 12, dia: 21 },
    elemento: 'fuego',
    mensaje: 'Sos de Sagitario, el signo de la búsqueda y la expansión. Los guardianes de fuego acompañan tu viaje.'
  },
  capricornio: {
    inicio: { mes: 12, dia: 22 },
    fin: { mes: 1, dia: 19 },
    elemento: 'tierra',
    mensaje: 'Sos de Capricornio, el signo de la estructura y la determinación. Los guardianes de tierra respetan tu camino.'
  },
  acuario: {
    inicio: { mes: 1, dia: 20 },
    fin: { mes: 2, dia: 18 },
    elemento: 'aire',
    mensaje: 'Sos de Acuario, el signo de la innovación y la visión. Los guardianes de aire comparten tus ideas.'
  },
  piscis: {
    inicio: { mes: 2, dia: 19 },
    fin: { mes: 3, dia: 20 },
    elemento: 'agua',
    mensaje: 'Sos de Piscis, el signo de la intuición y los sueños. Los guardianes de agua nadan en tus mismas corrientes.'
  }
};

// ═══════════════════════════════════════════════════════════════════════════════
// FUNCIONES AUXILIARES
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Obtiene el signo zodiacal a partir de una fecha de nacimiento
 * @param {Date} fecha - Fecha de nacimiento
 * @returns {Object} - { signo, elemento, mensaje }
 */
function obtenerSignoZodiacal(fecha) {
  const mes = fecha.getMonth() + 1; // getMonth() es 0-indexed
  const dia = fecha.getDate();

  for (const [signo, datos] of Object.entries(SIGNOS_ZODIACALES)) {
    const { inicio, fin } = datos;

    // Caso especial: Capricornio cruza el año
    if (signo === 'capricornio') {
      if ((mes === 12 && dia >= 22) || (mes === 1 && dia <= 19)) {
        return { signo, ...datos };
      }
    } else {
      // Verificar si la fecha está en el rango
      if (
        (mes === inicio.mes && dia >= inicio.dia) ||
        (mes === fin.mes && dia <= fin.dia)
      ) {
        return { signo, ...datos };
      }
    }
  }

  // Fallback (no debería llegar acá)
  return { signo: 'desconocido', elemento: 'desconocido', mensaje: '' };
}

/**
 * Verifica si el cumpleaños está en el mes actual
 * @param {Date} fechaNacimiento - Fecha de nacimiento
 * @param {Date} fechaActual - Fecha actual (opcional, por defecto hoy)
 * @returns {boolean}
 */
function esCumpleanosEsteMes(fechaNacimiento, fechaActual = new Date()) {
  return fechaNacimiento.getMonth() === fechaActual.getMonth();
}

/**
 * Cuenta las letras de un nombre (sin espacios ni caracteres especiales)
 * @param {string} nombre
 * @returns {number}
 */
function contarLetras(nombre) {
  if (!nombre) return 0;
  return nombre.replace(/[^a-záéíóúñü]/gi, '').length;
}

/**
 * Obtiene la franja horaria
 * @param {number} hora - Hora del día (0-23)
 * @returns {Object} - { franja, nombre, mensaje }
 */
function obtenerFranjaHoraria(hora) {
  if (hora >= 0 && hora < 5) {
    return { franja: 'madrugada', ...MENSAJES_HORA.madrugada };
  } else if (hora >= 5 && hora < 8) {
    return { franja: 'amanecer', ...MENSAJES_HORA.amanecer };
  } else if (hora >= 8 && hora < 12) {
    return { franja: 'mañana', ...MENSAJES_HORA.mañana };
  } else if (hora >= 12 && hora < 14) {
    return { franja: 'mediodia', ...MENSAJES_HORA.mediodia };
  } else if (hora >= 14 && hora < 18) {
    return { franja: 'tarde', ...MENSAJES_HORA.tarde };
  } else if (hora >= 18 && hora < 20) {
    return { franja: 'atardecer', ...MENSAJES_HORA.atardecer };
  } else {
    return { franja: 'noche', ...MENSAJES_HORA.noche };
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// FUNCIÓN PRINCIPAL
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Genera una sincronicidad personalizada basada en los datos del usuario
 *
 * @param {Object} datos - Datos del usuario
 * @param {string} datos.nombre - Nombre del usuario
 * @param {string} datos.fechaNacimiento - Fecha de nacimiento en formato ISO
 * @param {string} datos.guardian - Nombre del guardián
 * @param {number} datos.diaSemana - Día de la semana (0-6, domingo=0)
 * @param {number} datos.hora - Hora del día (0-23)
 * @param {boolean} datos.volvioAPagina - Si el usuario volvió a visitar
 *
 * @returns {Object} - { tipo, mensaje, datos }
 *
 * PRIORIDAD:
 * 1. volvioAPagina
 * 2. cumpleaños este mes
 * 3. nombre coincide en letras con guardián
 * 4. hora especial (madrugada, amanecer, mediodía, atardecer)
 * 5. día de la semana
 * 6. signo zodiacal
 */
export function generarSincronicidad(datos) {
  const {
    nombre,
    fechaNacimiento,
    guardian,
    diaSemana,
    hora,
    volvioAPagina
  } = datos;

  // Parsear fecha de nacimiento
  const fechaNac = fechaNacimiento ? new Date(fechaNacimiento) : null;
  const ahora = new Date();

  // ═══════════════════════════════════════════════════════════════════════════
  // PRIORIDAD 1: Volvió a la página
  // ═══════════════════════════════════════════════════════════════════════════
  if (volvioAPagina) {
    return {
      tipo: 'retorno',
      mensaje: 'Volviste. Algo te trajo de nuevo. Eso tiene un nombre: reconocimiento.',
      datos: {
        volvioAPagina: true
      }
    };
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // PRIORIDAD 2: Cumpleaños este mes
  // ═══════════════════════════════════════════════════════════════════════════
  if (fechaNac && esCumpleanosEsteMes(fechaNac, ahora)) {
    const mesActual = ahora.toLocaleDateString('es-UY', { month: 'long' });
    return {
      tipo: 'cumpleanos',
      mensaje: `Este mes es tu portal. Los guardianes que aparecen cerca de tu cumpleaños vienen con mensajes especiales.`,
      datos: {
        mesCumpleanos: mesActual,
        diaCumpleanos: fechaNac.getDate()
      }
    };
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // PRIORIDAD 3: Nombre coincide con guardián
  // ═══════════════════════════════════════════════════════════════════════════
  if (nombre && guardian) {
    const letrasNombre = contarLetras(nombre);
    const letrasGuardian = contarLetras(guardian);

    if (letrasNombre === letrasGuardian && letrasNombre > 0) {
      return {
        tipo: 'nombre',
        mensaje: `Tu nombre y el de ${guardian} tienen ${letrasNombre} letras. Los números no mienten.`,
        datos: {
          nombreUsuario: nombre,
          nombreGuardian: guardian,
          cantidadLetras: letrasNombre
        }
      };
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // PRIORIDAD 4: Hora especial
  // ═══════════════════════════════════════════════════════════════════════════
  if (typeof hora === 'number' && hora >= 0 && hora <= 23) {
    const franjaHoraria = obtenerFranjaHoraria(hora);

    if (franjaHoraria.mensaje) {
      return {
        tipo: 'hora',
        mensaje: franjaHoraria.mensaje,
        datos: {
          hora,
          franja: franjaHoraria.franja,
          nombreFranja: franjaHoraria.nombre
        }
      };
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // PRIORIDAD 5: Día de la semana
  // ═══════════════════════════════════════════════════════════════════════════
  if (typeof diaSemana === 'number' && diaSemana >= 0 && diaSemana <= 6) {
    const datosDia = MENSAJES_DIA_SEMANA[diaSemana];
    const nombresDias = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];

    return {
      tipo: 'dia',
      mensaje: datosDia.mensaje,
      datos: {
        diaSemana,
        nombreDia: nombresDias[diaSemana],
        planeta: datosDia.planeta
      }
    };
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // PRIORIDAD 6: Signo zodiacal
  // ═══════════════════════════════════════════════════════════════════════════
  if (fechaNac) {
    const signo = obtenerSignoZodiacal(fechaNac);

    return {
      tipo: 'signo',
      mensaje: signo.mensaje,
      datos: {
        signo: signo.signo,
        elemento: signo.elemento
      }
    };
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // FALLBACK: Mensaje genérico (no debería llegar acá con datos válidos)
  // ═══════════════════════════════════════════════════════════════════════════
  return {
    tipo: 'generico',
    mensaje: 'Llegaste acá por algo. Nada es casualidad.',
    datos: {}
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORTS ADICIONALES (para testing o uso extendido)
// ═══════════════════════════════════════════════════════════════════════════════

export {
  obtenerSignoZodiacal,
  esCumpleanosEsteMes,
  contarLetras,
  obtenerFranjaHoraria,
  SIGNOS_ZODIACALES,
  MENSAJES_DIA_SEMANA,
  MENSAJES_HORA
};
