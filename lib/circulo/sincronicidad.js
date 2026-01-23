/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * MOTOR DE SINCRONICIDAD MAGICA
 * Genera mensajes "magicamente" personalizados basados en datos del usuario
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * IMPORTANTE: El sistema debe ser SUTIL. No parecer manipulativo, sino
 * "magicamente" relevante. La persona debe sentir que el contenido fue hecho
 * para ella.
 */

// ===== DATOS BASE PARA SINCRONICIDADES =====

const DIAS_SEMANA = {
  0: { // Domingo
    nombre: 'domingo',
    planeta: 'Sol',
    energia: 'Renovacion y luz interior',
    mensaje: 'El domingo es el dia del Sol. No es casualidad que hayas llegado hoy: es momento de renovar tu luz interior.',
    color: '#FFD700',
    elemento: 'fuego'
  },
  1: { // Lunes
    nombre: 'lunes',
    planeta: 'Luna',
    energia: 'Intuicion y emociones',
    mensaje: 'Lunes, dia de la Luna. Tu intuicion te trajo hasta aca, y la Luna no se equivoca.',
    color: '#C0C0C0',
    elemento: 'agua'
  },
  2: { // Martes
    nombre: 'martes',
    planeta: 'Marte',
    energia: 'Accion y coraje',
    mensaje: 'Martes, el dia de Marte. Llegaste en el dia de la accion. Algo en vos esta listo para moverse.',
    color: '#FF4500',
    elemento: 'fuego'
  },
  3: { // Miercoles
    nombre: 'miercoles',
    planeta: 'Mercurio',
    energia: 'Comunicacion y claridad',
    mensaje: 'Miercoles, dia de Mercurio. Viniste buscando claridad, y eso ya dice mucho de vos.',
    color: '#9370DB',
    elemento: 'aire'
  },
  4: { // Jueves
    nombre: 'jueves',
    planeta: 'Jupiter',
    energia: 'Expansion y abundancia',
    mensaje: 'Jueves, el dia de Jupiter. Llegaste en el dia de la expansion. El universo esta abriendo puertas.',
    color: '#4169E1',
    elemento: 'fuego'
  },
  5: { // Viernes
    nombre: 'viernes',
    planeta: 'Venus',
    energia: 'Amor y belleza',
    mensaje: 'Viernes, dia de Venus. El amor y la belleza te trajeron aca. Tu corazon sabe lo que busca.',
    color: '#FF69B4',
    elemento: 'agua'
  },
  6: { // Sabado
    nombre: 'sabado',
    planeta: 'Saturno',
    energia: 'Estructura y tiempo',
    mensaje: 'Sabado, dia de Saturno. Llegaste en el dia de la paciencia. Lo que se construye bien, perdura.',
    color: '#2F4F4F',
    elemento: 'tierra'
  }
};

const HORAS_MAGICAS = {
  '00': { mensaje: 'La medianoche. El momento donde un dia muere y otro nace. Tu busqueda trasciende el tiempo.', intensidad: 'alta' },
  '01': { mensaje: 'La 1 AM. Mientras el mundo duerme, vos estas despierta. Los guardianes tambien.', intensidad: 'alta' },
  '02': { mensaje: 'Las 2 AM. La hora mas silenciosa. Tu alma habla cuando todo calla.', intensidad: 'alta' },
  '03': { mensaje: 'Las 3 AM. La hora del velo fino. Conectaste en el momento donde los mundos se tocan.', intensidad: 'muy_alta' },
  '04': { mensaje: 'Las 4 AM. Antes del amanecer. Los que buscan a esta hora encuentran primero.', intensidad: 'alta' },
  '05': { mensaje: 'Las 5 AM. El despertar. Llegaste cuando el mundo renace.', intensidad: 'media' },
  '06': { mensaje: 'Las 6 de la manana. El sol empieza a subir. Tu dia empieza con proposito.', intensidad: 'media' },
  '11': { mensaje: 'Las 11. Casi el mediodia. El sol esta alto y tu energia tambien.', intensidad: 'media' },
  '12': { mensaje: 'El mediodia. El sol en su punto mas alto. Maxima claridad.', intensidad: 'media' },
  '15': { mensaje: 'Las 3 de la tarde. Numero maestro. No es coincidencia.', intensidad: 'alta' },
  '18': { mensaje: 'Las 6 de la tarde. El crepusculo. Entre la luz y la sombra hay verdad.', intensidad: 'media' },
  '21': { mensaje: 'Las 9 de la noche. Numero de completitud. Algo esta por cerrarse para que otro se abra.', intensidad: 'alta' },
  '22': { mensaje: 'Las 10 de la noche. Numero maestro. Tu busqueda tiene razon de ser.', intensidad: 'alta' },
  '23': { mensaje: 'Las 11 de la noche. Otro numero maestro. El universo te esta hablando.', intensidad: 'alta' }
};

const NUMEROS_ESPECIALES = {
  '00': 'Doble cero. Infinito potencial. Todo puede empezar.',
  '11': 'Once. Numero maestro. Portal de intuicion.',
  '22': 'Veintidos. Numero maestro constructor. Estas creando tu realidad.',
  '33': 'Treinta y tres. Maestro de maestros. Tu alma es vieja y sabia.',
  '44': 'Cuarenta y cuatro. Fundamentos solidos. Los angeles te acompanan.',
  '55': 'Cincuenta y cinco. Cambio profundo. Soltar para recibir.',
  '111': 'Triple uno. Tus pensamientos se manifiestan rapido. Elegí bien.',
  '222': 'Triple dos. Equilibrio divino. Todo esta alineandose.',
  '333': 'Triple tres. Los maestros ascendidos te escuchan.',
  '444': 'Triple cuatro. Proteccion total. Estas sostenida.',
  '555': 'Triple cinco. Gran transformacion en camino.'
};

const LETRAS_INICIALES = {
  'A': { significado: 'Iniciadora, lider natural', elemento: 'fuego', mensaje: 'La A de tu nombre habla de liderazgo. Naciste para iniciar caminos.' },
  'B': { significado: 'Sensible, busca armonia', elemento: 'agua', mensaje: 'La B trae sensibilidad profunda. Sentis mas que otros, y eso es un don.' },
  'C': { significado: 'Creativa, expresiva', elemento: 'aire', mensaje: 'La C es creatividad pura. Tu alma necesita expresarse.' },
  'D': { significado: 'Practica, constructora', elemento: 'tierra', mensaje: 'La D construye con solidez. Lo que hagas, va a perdurar.' },
  'E': { significado: 'Libre, aventurera', elemento: 'aire', mensaje: 'La E busca libertad. Tu espiritu no acepta jaulas.' },
  'F': { significado: 'Protectora, familiar', elemento: 'agua', mensaje: 'La F es de familia y cuidado. Proteges a los tuyos, pero no te olvides de vos.' },
  'G': { significado: 'Misteriosa, profunda', elemento: 'agua', mensaje: 'La G guarda misterios. Hay profundidades en vos que todavia no exploraste.' },
  'H': { significado: 'Poderosa, autosuficiente', elemento: 'tierra', mensaje: 'La H es poder silencioso. No necesitas demostrarlo, se siente.' },
  'I': { significado: 'Intuitiva, espiritual', elemento: 'eter', mensaje: 'La I conecta con lo superior. Tu intuicion es tu superpoder.' },
  'J': { significado: 'Justa, honesta', elemento: 'aire', mensaje: 'La J busca justicia. Tu brujula moral es tu guia.' },
  'K': { significado: 'Karmica, maestra', elemento: 'fuego', mensaje: 'La K trae lecciones karmicas. Viniste a aprender y ensenar.' },
  'L': { significado: 'Amorosa, luminosa', elemento: 'fuego', mensaje: 'La L es luz y amor. Iluminas donde vayas, aunque a veces no lo notes.' },
  'M': { significado: 'Maternal, nutritiva', elemento: 'agua', mensaje: 'La M nutre y sostiene. El mundo te necesita, pero vos tambien te necesitas.' },
  'N': { significado: 'Transformadora, intensa', elemento: 'agua', mensaje: 'La N transforma. Donde tocas, algo cambia para siempre.' },
  'O': { significado: 'Completa, ciclica', elemento: 'eter', mensaje: 'La O es el circulo completo. Entiendes los ciclos de la vida.' },
  'P': { significado: 'Pensadora, filosofa', elemento: 'aire', mensaje: 'La P piensa profundo. Tu mente es tu templo.' },
  'Q': { significado: 'Unica, excentrica', elemento: 'eter', mensaje: 'La Q es rara y valiosa. Nunca intentes encajar, naciste para destacar.' },
  'R': { significado: 'Resistente, renovadora', elemento: 'fuego', mensaje: 'La R resiste y renace. Caiste mil veces y mil veces te levantaste.' },
  'S': { significado: 'Sensual, serpenteante', elemento: 'agua', mensaje: 'La S fluye y seduce. Tu energia es magnetica.' },
  'T': { significado: 'Tenaz, tradicional', elemento: 'tierra', mensaje: 'La T es firme. Cuando decidis algo, no hay vuelta atras.' },
  'U': { significado: 'Universal, receptiva', elemento: 'agua', mensaje: 'La U recibe y contiene. Sos un recipiente de sabiduria.' },
  'V': { significado: 'Victoriosa, visionaria', elemento: 'aire', mensaje: 'La V ve mas alla. Tu vision trasciende lo visible.' },
  'W': { significado: 'Ondulante, dual', elemento: 'agua', mensaje: 'La W tiene doble naturaleza. Abrazas tus contradicciones.' },
  'X': { significado: 'Enigmatica, transformadora', elemento: 'eter', mensaje: 'La X marca el tesoro. Hay algo en vos esperando ser descubierto.' },
  'Y': { significado: 'Buscadora, espiritual', elemento: 'eter', mensaje: 'La Y pregunta por que. Tu busqueda espiritual te define.' },
  'Z': { significado: 'Final, completadora', elemento: 'tierra', mensaje: 'La Z cierra ciclos. Terminás lo que empezas.' }
};

const MESES_NACIMIENTO = {
  1: { signo: 'Capricornio/Acuario', elemento: 'tierra/aire', mensaje: 'Naciste en enero, mes de nuevos comienzos sobre bases solidas.' },
  2: { signo: 'Acuario/Piscis', elemento: 'aire/agua', mensaje: 'Febrero te dio la vision del acuariano y la sensibilidad pisciana.' },
  3: { signo: 'Piscis/Aries', elemento: 'agua/fuego', mensaje: 'Marzo: el cierre y el inicio. Llevas ambas energias en vos.' },
  4: { signo: 'Aries/Tauro', elemento: 'fuego/tierra', mensaje: 'Abril te dio fuego para empezar y tierra para mantener.' },
  5: { signo: 'Tauro/Geminis', elemento: 'tierra/aire', mensaje: 'Mayo: sensualidad taurina y curiosidad geminiana te definen.' },
  6: { signo: 'Geminis/Cancer', elemento: 'aire/agua', mensaje: 'Junio mezclo tu mente agil con un corazon profundo.' },
  7: { signo: 'Cancer/Leo', elemento: 'agua/fuego', mensaje: 'Julio: nutricion canceriana y brillo leonino. Cuidadora y reina.' },
  8: { signo: 'Leo/Virgo', elemento: 'fuego/tierra', mensaje: 'Agosto te dio el escenario de Leo y la precision de Virgo.' },
  9: { signo: 'Virgo/Libra', elemento: 'tierra/aire', mensaje: 'Septiembre: el servicio perfecto de Virgo con la belleza de Libra.' },
  10: { signo: 'Libra/Escorpio', elemento: 'aire/agua', mensaje: 'Octubre: armonia libriana y profundidad escorpiana. Luz y sombra.' },
  11: { signo: 'Escorpio/Sagitario', elemento: 'agua/fuego', mensaje: 'Noviembre: la intensidad escorpiana y la aventura sagitariana te impulsan.' },
  12: { signo: 'Sagitario/Capricornio', elemento: 'fuego/tierra', mensaje: 'Diciembre: la flecha del arquero con los pies en la tierra.' }
};

// ===== FUNCION PRINCIPAL =====

/**
 * Genera un mensaje de sincronicidad personalizado
 * @param {Object} usuario - Datos del usuario
 * @param {string} usuario.nombre - Nombre del usuario
 * @param {string} usuario.email - Email (opcional)
 * @param {string} usuario.cumpleanos - Fecha de nacimiento YYYY-MM-DD (opcional)
 * @param {Date} usuario.fechaVisita - Fecha/hora de la visita (opcional, default = now)
 * @returns {Object} Mensaje de sincronicidad con todas las capas
 */
export function generarSincronicidad(usuario = {}) {
  const nombre = usuario.nombre || '';
  const fechaVisita = usuario.fechaVisita || new Date();
  const cumpleanos = usuario.cumpleanos ? new Date(usuario.cumpleanos) : null;

  // Recopilar todas las sincronicidades
  const sincronicidades = [];

  // 1. SINCRONICIDAD DEL DIA
  const diaSemana = fechaVisita.getDay();
  const infoDia = DIAS_SEMANA[diaSemana];
  sincronicidades.push({
    tipo: 'dia',
    prioridad: 2,
    mensaje: infoDia.mensaje,
    datos: {
      dia: infoDia.nombre,
      planeta: infoDia.planeta,
      energia: infoDia.energia,
      color: infoDia.color,
      elemento: infoDia.elemento
    }
  });

  // 2. SINCRONICIDAD DE LA HORA
  const hora = fechaVisita.getHours().toString().padStart(2, '0');
  const minutos = fechaVisita.getMinutes().toString().padStart(2, '0');
  const horaCompleta = `${hora}:${minutos}`;

  // Verificar horas especiales
  if (HORAS_MAGICAS[hora]) {
    sincronicidades.push({
      tipo: 'hora',
      prioridad: HORAS_MAGICAS[hora].intensidad === 'muy_alta' ? 1 : 2,
      mensaje: HORAS_MAGICAS[hora].mensaje,
      datos: {
        hora: horaCompleta,
        intensidad: HORAS_MAGICAS[hora].intensidad
      }
    });
  }

  // 3. NUMEROS ESPEJO/REPETIDOS
  // Verificar si la hora tiene numeros especiales
  const horaMinutos = hora + minutos;
  Object.entries(NUMEROS_ESPECIALES).forEach(([patron, significado]) => {
    if (horaMinutos.includes(patron) || horaCompleta.includes(patron.substring(0, 2) + ':' + patron.substring(0, 2))) {
      sincronicidades.push({
        tipo: 'numero',
        prioridad: 1,
        mensaje: `Llegaste a las ${horaCompleta}. ${significado}`,
        datos: {
          patron,
          horaExacta: horaCompleta
        }
      });
    }
  });

  // Verificar patrones como 11:11, 22:22, etc
  if (hora === minutos && hora !== '00') {
    sincronicidades.push({
      tipo: 'espejo',
      prioridad: 1,
      mensaje: `Llegaste exactamente a las ${horaCompleta}. Eso no pasa por casualidad. Es una senal.`,
      datos: {
        horaEspejo: horaCompleta
      }
    });
  }

  // 4. SINCRONICIDAD DEL NOMBRE
  if (nombre && nombre.length > 0) {
    const inicial = nombre.charAt(0).toUpperCase();
    if (LETRAS_INICIALES[inicial]) {
      sincronicidades.push({
        tipo: 'nombre',
        prioridad: 3,
        mensaje: LETRAS_INICIALES[inicial].mensaje,
        datos: {
          inicial,
          significado: LETRAS_INICIALES[inicial].significado,
          elemento: LETRAS_INICIALES[inicial].elemento
        }
      });
    }

    // Conexion nombre-numero (numerologia basica)
    const valorNombre = calcularValorNombre(nombre);
    const numeroVida = reducirADigito(valorNombre);
    sincronicidades.push({
      tipo: 'numerologia',
      prioridad: 4,
      mensaje: `Tu nombre vibra en el numero ${numeroVida}. ${getMensajeNumeroVida(numeroVida)}`,
      datos: {
        numero: numeroVida,
        valorTotal: valorNombre
      }
    });
  }

  // 5. SINCRONICIDAD DE CUMPLEANOS
  if (cumpleanos) {
    const mesNacimiento = cumpleanos.getMonth() + 1;
    const diaNacimiento = cumpleanos.getDate();
    const infoMes = MESES_NACIMIENTO[mesNacimiento];

    if (infoMes) {
      sincronicidades.push({
        tipo: 'cumpleanos',
        prioridad: 3,
        mensaje: infoMes.mensaje,
        datos: {
          mes: mesNacimiento,
          dia: diaNacimiento,
          signo: infoMes.signo,
          elemento: infoMes.elemento
        }
      });
    }

    // Verificar si estamos cerca del cumpleanos
    const hoy = new Date();
    const cumpleEsteAno = new Date(hoy.getFullYear(), cumpleanos.getMonth(), cumpleanos.getDate());
    const diasParaCumple = Math.ceil((cumpleEsteAno - hoy) / (1000 * 60 * 60 * 24));

    if (diasParaCumple >= 0 && diasParaCumple <= 7) {
      sincronicidades.push({
        tipo: 'cumple_cercano',
        prioridad: 1,
        mensaje: diasParaCumple === 0
          ? 'Hoy es tu cumpleanos. No es casualidad que hayas llegado hoy. El universo te esta regalando algo.'
          : `Faltan ${diasParaCumple} dias para tu cumpleanos. Este es tu portal personal. Aprovechalo.`,
        datos: {
          diasParaCumple
        }
      });
    }
  }

  // Ordenar por prioridad (1 es mas alta)
  sincronicidades.sort((a, b) => a.prioridad - b.prioridad);

  // Construir mensaje principal (tomar las 2 mejores sincronicidades)
  const mejoresSincronicidades = sincronicidades.slice(0, 2);
  const mensajePrincipal = mejoresSincronicidades.map(s => s.mensaje).join(' ');

  return {
    // Mensaje principal combinado
    mensajePrincipal,

    // Todas las sincronicidades detectadas
    sincronicidades,

    // La sincronicidad mas importante
    sincronicidadPrincipal: sincronicidades[0] || null,

    // Datos del momento
    momento: {
      fecha: fechaVisita.toISOString(),
      dia: DIAS_SEMANA[diaSemana].nombre,
      hora: horaCompleta,
      planeta: DIAS_SEMANA[diaSemana].planeta,
      elemento: DIAS_SEMANA[diaSemana].elemento
    },

    // Metadata
    totalSincronicidades: sincronicidades.length,
    intensidadTotal: calcularIntensidadTotal(sincronicidades)
  };
}

/**
 * Genera un mensaje de bienvenida personalizado para el Circulo
 * Usa sincronicidades para hacer que parezca "magico"
 */
export function generarBienvenidaCirculo(usuario) {
  const sincro = generarSincronicidad(usuario);
  const nombre = usuario.nombre || 'buscador/a';

  // Seleccionar template segun intensidad
  let template;
  if (sincro.intensidadTotal >= 8) {
    template = `${nombre}, no llegaste por casualidad. ${sincro.mensajePrincipal} El Circulo te estaba esperando.`;
  } else if (sincro.intensidadTotal >= 5) {
    template = `${nombre}, ${sincro.mensajePrincipal} Algo te guio hasta aca. El Circulo esta listo para recibirte.`;
  } else {
    template = `Bienvenido/a, ${nombre}. ${sincro.mensajePrincipal} Este es tu momento.`;
  }

  return {
    mensaje: template,
    sincronicidad: sincro,
    elementoDominante: sincro.momento.elemento,
    colorEnergetico: DIAS_SEMANA[new Date().getDay()].color
  };
}

/**
 * Genera mensaje de activacion de trial personalizado
 */
export function generarMensajeActivacionTrial(usuario) {
  const sincro = generarSincronicidad(usuario);
  const nombre = usuario.nombre || '';

  const mensajesBase = [
    `${nombre}, tu viaje en el Circulo empieza ahora. ${sincro.sincronicidadPrincipal?.mensaje || ''}`,
    `El momento es perfecto. ${sincro.mensajePrincipal} Bienvenida a tu prueba de 15 dias.`,
    `${nombre}, el Circulo te recibe. ${sincro.sincronicidades[0]?.mensaje || 'Llegaste en el momento justo.'}`,
  ];

  const indice = Math.floor(Math.random() * mensajesBase.length);

  return {
    mensaje: mensajesBase[indice],
    sincronicidad: sincro
  };
}

// ===== FUNCIONES AUXILIARES =====

function calcularValorNombre(nombre) {
  const valores = {
    'A': 1, 'B': 2, 'C': 3, 'D': 4, 'E': 5, 'F': 6, 'G': 7, 'H': 8, 'I': 9,
    'J': 1, 'K': 2, 'L': 3, 'M': 4, 'N': 5, 'O': 6, 'P': 7, 'Q': 8, 'R': 9,
    'S': 1, 'T': 2, 'U': 3, 'V': 4, 'W': 5, 'X': 6, 'Y': 7, 'Z': 8
  };

  return nombre
    .toUpperCase()
    .split('')
    .filter(c => valores[c])
    .reduce((sum, c) => sum + valores[c], 0);
}

function reducirADigito(numero) {
  while (numero > 9 && numero !== 11 && numero !== 22 && numero !== 33) {
    numero = numero.toString().split('').reduce((sum, d) => sum + parseInt(d), 0);
  }
  return numero;
}

function getMensajeNumeroVida(numero) {
  const mensajes = {
    1: 'Lider, pionera, independiente. Tu camino es unico.',
    2: 'Cooperadora, sensible, diplomatica. Tu don es unir.',
    3: 'Creativa, expresiva, social. Tu voz importa.',
    4: 'Constructora, practica, leal. Tu estabilidad inspira.',
    5: 'Libre, aventurera, adaptable. El cambio es tu aliado.',
    6: 'Cuidadora, amorosa, responsable. Tu hogar es tu templo.',
    7: 'Mistica, analitica, espiritual. Tu busqueda tiene sentido.',
    8: 'Poderosa, ambiciosa, magnetica. La abundancia te busca.',
    9: 'Humanitaria, sabia, compasiva. Tu proposito trasciende.',
    11: 'Numero maestro de la intuicion. Tu mision es iluminar.',
    22: 'Numero maestro constructor. Tu vision se hace realidad.',
    33: 'Numero maestro del amor. Tu presencia sana.'
  };
  return mensajes[numero] || 'Tu numero tiene un mensaje especial para vos.';
}

function calcularIntensidadTotal(sincronicidades) {
  let intensidad = 0;

  sincronicidades.forEach(s => {
    switch (s.prioridad) {
      case 1: intensidad += 3; break;
      case 2: intensidad += 2; break;
      case 3: intensidad += 1; break;
      default: intensidad += 0.5;
    }
  });

  return Math.min(10, Math.round(intensidad));
}

// ===== EXPORTACIONES =====

export default {
  generarSincronicidad,
  generarBienvenidaCirculo,
  generarMensajeActivacionTrial,
  DIAS_SEMANA,
  HORAS_MAGICAS,
  LETRAS_INICIALES,
  MESES_NACIMIENTO
};
