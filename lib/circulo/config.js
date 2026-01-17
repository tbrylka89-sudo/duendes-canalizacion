// ═══════════════════════════════════════════════════════════════════════════════
// CONFIGURACIÓN CENTRAL DEL CÍRCULO DE DUENDES
// El corazón del sistema - Todo gira en torno a los duendes
// ═══════════════════════════════════════════════════════════════════════════════

export const CIRCULO_CONFIG = {
  nombre: 'El Círculo de Duendes',
  descripcion: 'Un portal donde todo gira en torno a los guardianes',

  // Planes de suscripción
  planes: {
    trial: {
      id: 'trial',
      nombre: 'Prueba Gratuita',
      duracion_dias: 15,
      precio_usd: 0,
      descripcion: '15 días de acceso completo sin compromiso',
      beneficios: [
        'Acceso completo al Círculo por 15 días',
        'Sin tarjeta de crédito',
        'Contenido semanal exclusivo',
        'Mensaje diario de un guardián',
        '100 runas de regalo para explorar'
      ],
      esGratis: true,
      soloUnaVez: true
    },
    semestral: {
      id: 'semestral',
      nombre: 'Medio Año Mágico',
      duracion_meses: 6,
      precio_usd: 50,
      precio_uyu: 2000,
      precio_mensual: 8.33,
      descripcion: '6 meses de magia con ~26 guardianes protagonistas',
      beneficios: [
        'Acceso a contenido semanal exclusivo',
        'Un guardián protagonista cada semana',
        'Foro privado de la comunidad',
        'Mensaje diario de un guardián',
        'Rituales, meditaciones y enseñanzas'
      ]
    },
    anual: {
      id: 'anual',
      nombre: 'Año del Guardián',
      duracion_meses: 12,
      precio_usd: 80,
      precio_uyu: 3200,
      precio_mensual: 6.67,
      ahorro: '20%',
      descripcion: 'El ciclo completo: 52 guardianes, todas las estaciones',
      beneficios: [
        'Todo lo del plan semestral',
        '52 guardianes protagonistas (1 por semana)',
        '10% de descuento permanente en la tienda',
        'Acceso anticipado a nuevos guardianes',
        'Sorpresa de aniversario especial',
        'Los 4 portales estacionales completos'
      ],
      destacado: true
    }
  },

  // Los 4 portales del año (hemisferio sur - Uruguay)
  portales: {
    yule: {
      id: 'yule',
      nombre: 'Portal de Yule',
      subtitulo: 'El Renacimiento de la Luz',
      meses: ['junio', 'julio', 'agosto'],
      fecha_inicio: '21 de junio',
      energia: 'Introspección, renacimiento, de la sombra a la luz',
      elemento_dominante: 'tierra',
      color: '#1a237e', // azul profundo
      descripcion: 'El invierno nos invita a ir hacia adentro. Los guardianes de Yule nos guían en el trabajo de sombra y la preparación para renacer.'
    },
    ostara: {
      id: 'ostara',
      nombre: 'Portal de Ostara',
      subtitulo: 'El Despertar',
      meses: ['septiembre', 'octubre', 'noviembre'],
      fecha_inicio: '21 de septiembre',
      energia: 'Despertar, nuevos comienzos, fertilidad de ideas',
      elemento_dominante: 'aire',
      color: '#2e7d32', // verde bosque
      descripcion: 'La primavera trae renovación. Los guardianes de Ostara nos impulsan a plantar semillas y despertar proyectos dormidos.'
    },
    litha: {
      id: 'litha',
      nombre: 'Portal de Litha',
      subtitulo: 'La Plenitud',
      meses: ['diciembre', 'enero', 'febrero'],
      fecha_inicio: '21 de diciembre',
      energia: 'Abundancia plena, celebración, poder máximo',
      elemento_dominante: 'fuego',
      color: '#ff6f00', // dorado/naranja
      descripcion: 'El verano es pura expansión. Los guardianes de Litha nos enseñan a brillar, celebrar y recibir la abundancia.'
    },
    mabon: {
      id: 'mabon',
      nombre: 'Portal de Mabon',
      subtitulo: 'La Cosecha',
      meses: ['marzo', 'abril', 'mayo'],
      fecha_inicio: '21 de marzo',
      energia: 'Cosecha, gratitud, soltar, preparación',
      elemento_dominante: 'agua',
      color: '#6a1b9a', // púrpura
      descripcion: 'El otoño es tiempo de recoger frutos y soltar hojas. Los guardianes de Mabon nos enseñan gratitud y desapego.'
    }
  },

  // Tipos de contenido que genera el sistema
  tipos_contenido: {
    mensaje_diario: {
      id: 'mensaje_diario',
      nombre: 'Mensaje del Día',
      duracion_lectura: '1-2 min',
      descripcion: 'Un guardián random te saluda con un mensaje personal'
    },
    ensenanza: {
      id: 'ensenanza',
      nombre: 'Enseñanza del Guardián',
      duracion_lectura: '10-15 min',
      descripcion: 'Lección profunda desde la perspectiva del guardián'
    },
    ritual: {
      id: 'ritual',
      nombre: 'Ritual',
      duracion_practica: '20-40 min',
      descripcion: 'Práctica guiada por el guardián protagonista'
    },
    meditacion: {
      id: 'meditacion',
      nombre: 'Meditación Guiada',
      duracion_audio: '15-25 min',
      descripcion: 'Viaje interior con la voz del guardián'
    },
    diy: {
      id: 'diy',
      nombre: 'Proyecto Mágico',
      duracion_proyecto: '30-60 min',
      descripcion: 'Creación artesanal inspirada en el guardián'
    },
    altar: {
      id: 'altar',
      nombre: 'Altar del Guardián',
      descripcion: 'Cómo crear un espacio sagrado para este guardián'
    }
  },

  // Estructura semanal del contenido
  semana_tipo: {
    lunes: {
      tipo: 'presentacion',
      titulo: 'Conocé al Guardián de la Semana',
      descripcion: 'Quién es, su historia, por qué esta semana es SU semana'
    },
    miercoles: {
      tipo: 'ensenanza',
      titulo: 'Enseñanza del Guardián',
      descripcion: 'Sabiduría desde su perspectiva única'
    },
    viernes: {
      tipo: 'ritual',
      titulo: 'Práctica Guiada',
      descripcion: 'Ritual o meditación con el guardián'
    },
    domingo: {
      tipo: 'cierre',
      titulo: 'Mensaje de Cierre',
      descripcion: 'Reflexión y preparación para la próxima semana'
    }
  }
};

// Obtener el portal actual según la fecha
export function getPortalActual() {
  const hoy = new Date();
  const mes = hoy.getMonth(); // 0-11

  // Hemisferio sur
  if (mes >= 5 && mes <= 7) return CIRCULO_CONFIG.portales.yule;      // Jun-Ago
  if (mes >= 8 && mes <= 10) return CIRCULO_CONFIG.portales.ostara;   // Sep-Nov
  if (mes === 11 || mes <= 1) return CIRCULO_CONFIG.portales.litha;   // Dic-Feb
  return CIRCULO_CONFIG.portales.mabon;                                // Mar-May
}

// Obtener el día de la semana para contenido
export function getDiaContenido() {
  const dias = ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'];
  return dias[new Date().getDay()];
}

export default CIRCULO_CONFIG;
