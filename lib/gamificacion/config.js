// ═══════════════════════════════════════════════════════════════
// CONFIGURACIÓN CENTRAL DEL SISTEMA DE GAMIFICACIÓN
// Duendes del Uruguay - Sistema de Runas y Lecturas
// ═══════════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════════
// 1. NIVELES Y PROGRESIÓN
// ═══════════════════════════════════════════════════════════════

export const NIVELES = [
  {
    id: 'iniciada',
    nombre: 'Iniciada',
    nombreMasculino: 'Iniciado',
    xpRequerida: 0,
    icono: '🌱',
    color: '#8B9A46',
    descuento: 0,
    beneficios: ['Lecturas básicas', 'Cofre diario']
  },
  {
    id: 'aprendiz',
    nombre: 'Aprendiz',
    nombreMasculino: 'Aprendiz',
    xpRequerida: 100,
    icono: '🌿',
    color: '#5D8A4A',
    descuento: 0,
    beneficios: ['Todo lo anterior', 'Lecturas estándar', 'Misiones semanales']
  },
  {
    id: 'guardiana',
    nombre: 'Guardiana',
    nombreMasculino: 'Guardián',
    xpRequerida: 500,
    icono: '🌳',
    color: '#4A7C59',
    descuento: 5,
    beneficios: ['Todo lo anterior', 'Lecturas premium', '5% descuento runas']
  },
  {
    id: 'maestra',
    nombre: 'Maestra',
    nombreMasculino: 'Maestro',
    xpRequerida: 1500,
    icono: '✨',
    color: '#D4AF37',
    descuento: 10,
    beneficios: ['Todo lo anterior', 'Lecturas ultra premium', '10% descuento']
  },
  {
    id: 'sabia',
    nombre: 'Sabia',
    nombreMasculino: 'Sabio',
    xpRequerida: 4000,
    icono: '👑',
    color: '#9B59B6',
    descuento: 15,
    beneficios: ['Todo desbloqueado', '15% descuento', 'Acceso beta', 'Badge exclusivo']
  }
];

// ═══════════════════════════════════════════════════════════════
// 2. FUENTES DE XP
// ═══════════════════════════════════════════════════════════════

export const XP_ACCIONES = {
  loginDiario: 5,
  lecturaBasica: 10,
  lecturaEstandar: 25,
  lecturaPremium: 50,
  lecturaUltraPremium: 100,
  racha7dias: 50,
  racha14dias: 75,
  racha30dias: 200,
  racha60dias: 400,
  racha100dias: 1000,
  referidoRegistro: 50,
  referidoCompra: 100,
  compraPorDolar: 1, // 1 XP por cada $1 gastado
  compraGuardianPorDolar: 2, // 2 XP por cada $1 en guardianes
  publicacionForo: 5,
  misionCompletada: 25 // promedio
};

// ═══════════════════════════════════════════════════════════════
// 3. SISTEMA DE RACHAS
// ═══════════════════════════════════════════════════════════════

export const RACHAS = {
  cofre: {
    probabilidades: [
      { runas: 1, peso: 40 },
      { runas: 2, peso: 30 },
      { runas: 3, peso: 20 },
      { runas: 5, peso: 8 },
      { runas: 10, peso: 2 }
    ]
  },
  bonusPorDias: {
    7: { runas: 15, xp: 50, mensaje: '¡Una semana mágica!' },
    14: { runas: 30, xp: 75, mensaje: '¡Dos semanas de conexión!' },
    30: { runas: 75, xp: 200, lecturaGratis: 'mensaje_dia', mensaje: '¡Un mes completo! Te ganaste una lectura gratis.' },
    60: { runas: 150, xp: 400, mensaje: '¡60 días de magia continua!' },
    100: { runas: 300, xp: 1000, badge: 'racha_100', mensaje: '¡100 días! Sos una leyenda del bosque.' }
  }
};

// ═══════════════════════════════════════════════════════════════
// 4. PAQUETES DE RUNAS
// ═══════════════════════════════════════════════════════════════

export const PAQUETES_RUNAS = [
  {
    id: 'chispa',
    nombre: 'Chispa',
    runas: 30,
    precio: 5,
    bonus: 0,
    slug: 'paquete-runas-30',
    sku: 'RUNAS-30',
    popular: false,
    descripcion: 'Perfecto para empezar'
  },
  {
    id: 'destello',
    nombre: 'Destello',
    runas: 80,
    precio: 10,
    bonus: 10,
    slug: 'paquete-runas-80',
    sku: 'RUNAS-80',
    popular: true,
    descripcion: '+10 runas de regalo'
  },
  {
    id: 'resplandor',
    nombre: 'Resplandor',
    runas: 200,
    precio: 20,
    bonus: 40,
    slug: 'paquete-runas-200',
    sku: 'RUNAS-200',
    popular: false,
    descripcion: '+40 runas de regalo'
  },
  {
    id: 'fulgor',
    nombre: 'Fulgor',
    runas: 550,
    precio: 50,
    bonus: 150,
    slug: 'paquete-runas-550',
    sku: 'RUNAS-550',
    popular: false,
    descripcion: '+150 runas de regalo'
  },
  {
    id: 'aurora',
    nombre: 'Aurora',
    runas: 1200,
    precio: 100,
    bonus: 400,
    slug: 'paquete-runas-1200',
    sku: 'RUNAS-1200',
    popular: false,
    destacado: true,
    descripcion: 'El mejor valor - +400 runas de regalo'
  }
];

// ═══════════════════════════════════════════════════════════════
// 5. MEMBRESÍAS DEL CÍRCULO
// ═══════════════════════════════════════════════════════════════

export const MEMBRESIAS = {
  trial: {
    id: 'trial',
    nombre: 'Prueba Gratuita',
    dias: 15,
    precio: 0,
    runasBienvenida: 20,
    runasMensuales: 0,
    descuentoTienda: 0,
    slug: null, // No tiene producto
    beneficios: ['Acceso completo 15 días', 'Guardián de la semana', 'Foro']
  },
  mensual: {
    id: 'mensual',
    nombre: 'Círculo Mensual',
    meses: 1,
    precio: 15,
    runasBienvenida: 20,
    runasMensuales: 12,
    descuentoTienda: 0,
    slug: 'circulo-mensual',
    sku: 'CIRCULO-1M',
    beneficios: [
      'Foro privado',
      'Contenido semanal',
      '4 guardianes con enseñanzas'
    ]
  },
  semestral: {
    id: 'semestral',
    nombre: 'Medio Año Mágico',
    meses: 6,
    precio: 50,
    runasBienvenida: 60,
    runasMensuales: 15,
    descuentoTienda: 5,
    slug: 'circulo-seis-meses',
    sku: 'CIRCULO-6M',
    beneficios: [
      '26 guardianes con enseñanzas',
      'Foro privado',
      'Guía lunar mensual',
      '5% descuento en tienda',
      '1 lectura básica gratis/mes'
    ]
  },
  anual: {
    id: 'anual',
    nombre: 'Año del Guardián',
    meses: 12,
    precio: 80,
    runasBienvenida: 120,
    runasMensuales: 25,
    descuentoTienda: 10,
    slug: 'circulo-anual',
    sku: 'CIRCULO-12M',
    destacado: true,
    beneficios: [
      '52 guardianes con enseñanzas',
      'Foro privado',
      'Guía lunar mensual',
      '10% descuento permanente',
      '1 lectura básica gratis/mes',
      '4 portales estacionales',
      'Acceso anticipado'
    ]
  }
};

// ═══════════════════════════════════════════════════════════════
// 6. CATÁLOGO DE LECTURAS/EXPERIENCIAS
// ═══════════════════════════════════════════════════════════════

export const LECTURAS = {
  // ─────────────────────────────────────────────────────────────
  // BÁSICAS (15-30 runas) - Nivel: Iniciada
  // ─────────────────────────────────────────────────────────────
  basicas: [
    {
      id: 'consejo_bosque',
      nombre: 'Consejo del Bosque',
      descripcion: 'Un mensaje breve y directo del bosque para tu día. Sabiduría ancestral en pocas palabras.',
      runas: 15,
      nivel: 'iniciada',
      duracion: 'Instantáneo',
      palabras: 300,
      icono: '🌲',
      categoria: 'mensajes'
    },
    {
      id: 'energia_dia',
      nombre: 'Energía del Día',
      descripcion: 'Descubrí qué energía te rodea hoy y cómo aprovecharla al máximo.',
      runas: 15,
      nivel: 'iniciada',
      duracion: 'Instantáneo',
      palabras: 350,
      icono: '☀️',
      categoria: 'mensajes'
    },
    {
      id: 'susurro_guardian',
      nombre: 'Susurro del Guardián',
      descripcion: 'Tu guardián (si tenés uno) o un guardián del bosque te susurra un mensaje personal.',
      runas: 20,
      nivel: 'iniciada',
      duracion: 'Instantáneo',
      palabras: 500,
      icono: '👂',
      categoria: 'mensajes',
      requiereGuardian: false // Si tiene, es personalizado
    },
    {
      id: 'tirada_3_runas',
      nombre: 'Tirada de 3 Runas',
      descripcion: 'Pasado, Presente y Futuro. La tirada clásica para obtener claridad.',
      runas: 25,
      nivel: 'iniciada',
      duracion: '24 horas',
      palabras: 800,
      icono: 'ᚱ',
      categoria: 'tiradas',
      popular: true
    }
  ],

  // ─────────────────────────────────────────────────────────────
  // ESTÁNDAR (40-75 runas) - Nivel: Aprendiz
  // ─────────────────────────────────────────────────────────────
  estandar: [
    {
      id: 'tirada_5_runas',
      nombre: 'Tirada de 5 Runas',
      descripcion: 'Situación completa con consejo. Cinco runas revelando el camino.',
      runas: 40,
      nivel: 'aprendiz',
      duracion: '24-48 horas',
      palabras: 1200,
      icono: 'ᚱᛏ',
      categoria: 'tiradas'
    },
    {
      id: 'mensaje_guardian_personal',
      nombre: 'Mensaje de tu Guardián',
      descripcion: 'Un mensaje profundo de TU guardián específico. Solo si tenés uno adoptado.',
      runas: 45,
      nivel: 'aprendiz',
      duracion: '24 horas',
      palabras: 1000,
      icono: '💌',
      categoria: 'mensajes',
      requiereGuardian: true
    },
    {
      id: 'oraculo_elementales',
      nombre: 'Oráculo de los Elementales',
      descripcion: 'Tierra, Agua, Fuego y Aire te hablan. Qué elemento necesitás y cuál evitar.',
      runas: 50,
      nivel: 'aprendiz',
      duracion: '24-48 horas',
      palabras: 1500,
      icono: '🌍',
      categoria: 'lecturas',
      popular: true
    },
    {
      id: 'tarot_simple',
      nombre: 'Lectura de Tarot Simple',
      descripcion: 'Tres cartas con interpretación profunda para tu pregunta específica.',
      runas: 50,
      nivel: 'aprendiz',
      duracion: '24-48 horas',
      palabras: 1200,
      icono: '🃏',
      categoria: 'tiradas'
    },
    {
      id: 'ritual_mes',
      nombre: 'Ritual del Mes',
      descripcion: 'Un ritual personalizado según tu situación actual y la energía del mes.',
      runas: 55,
      nivel: 'aprendiz',
      duracion: '48 horas',
      palabras: 1000,
      icono: '🕯️',
      categoria: 'rituales'
    },
    {
      id: 'mapa_energia',
      nombre: 'Mapa de tu Energía',
      descripcion: 'Dónde está tu energía bloqueada, dónde fluye, y cómo equilibrar.',
      runas: 60,
      nivel: 'aprendiz',
      duracion: '48 horas',
      palabras: 1500,
      icono: '🗺️',
      categoria: 'lecturas'
    },
    {
      id: 'numerologia_personal',
      nombre: 'Numerología Personal',
      descripcion: 'Tu número de vida y año personal explicados. Entendé tus ciclos.',
      runas: 65,
      nivel: 'aprendiz',
      duracion: '48-72 horas',
      palabras: 1800,
      icono: '🔢',
      categoria: 'estudios'
    },
    {
      id: 'guia_cristales',
      nombre: 'Guía de Cristales del Mes',
      descripcion: 'Qué cristal necesitás este mes y cómo trabajar con él.',
      runas: 60,
      nivel: 'aprendiz',
      duracion: '48 horas',
      palabras: 1200,
      icono: '💎',
      categoria: 'guias'
    }
  ],

  // ─────────────────────────────────────────────────────────────
  // PREMIUM (100-150 runas) - Nivel: Guardiana
  // ─────────────────────────────────────────────────────────────
  premium: [
    {
      id: 'tirada_7_runas',
      nombre: 'Tirada de 7 Runas Completa',
      descripcion: 'La tirada profunda. Siete runas revelando aspectos ocultos de tu camino.',
      runas: 100,
      nivel: 'guardiana',
      duracion: '48-72 horas',
      palabras: 2500,
      icono: 'ᚱᛏᚠᛖᚨᛚᛝ',
      categoria: 'tiradas',
      popular: true
    },
    {
      id: 'conexion_guardian',
      nombre: 'Conexión Profunda con tu Guardián',
      descripcion: 'Sesión extendida con TU guardián. Su historia, sus mensajes, su guía para vos.',
      runas: 110,
      nivel: 'guardiana',
      duracion: '72 horas',
      palabras: 2500,
      icono: '🔗',
      categoria: 'mensajes',
      requiereGuardian: true
    },
    {
      id: 'tarot_profundo',
      nombre: 'Lectura de Tarot Profunda',
      descripcion: 'Cruz Celta completa. Diez cartas revelando todos los aspectos de tu situación.',
      runas: 120,
      nivel: 'guardiana',
      duracion: '72 horas',
      palabras: 3000,
      icono: '🎴',
      categoria: 'tiradas'
    },
    {
      id: 'carta_astral_esencial',
      nombre: 'Carta Astral Esencial',
      descripcion: 'Sol, Luna, Ascendente y casas principales. Tu mapa cósmico explicado.',
      runas: 130,
      nivel: 'guardiana',
      duracion: '5-7 días',
      palabras: 3000,
      icono: '⭐',
      categoria: 'estudios'
    },
    {
      id: 'lectura_ano_personal',
      nombre: 'Lectura de Año Personal',
      descripcion: 'Los 12 meses que vienen. Predicciones, consejos y momentos clave.',
      runas: 140,
      nivel: 'guardiana',
      duracion: '7 días',
      palabras: 3500,
      icono: '📅',
      categoria: 'estudios',
      popular: true
    }
  ],

  // ─────────────────────────────────────────────────────────────
  // ULTRA PREMIUM (200-400 runas) - Nivel: Maestra
  // ─────────────────────────────────────────────────────────────
  ultraPremium: [
    {
      id: 'estudio_alma',
      nombre: 'Estudio del Alma',
      descripcion: 'Quién sos realmente, más allá de lo visible. Tu esencia revelada.',
      runas: 200,
      nivel: 'maestra',
      duracion: '7-10 días',
      palabras: 5000,
      icono: '👁️',
      categoria: 'estudios',
      popular: true
    },
    {
      id: 'conexion_ancestros',
      nombre: 'Conexión con Ancestros',
      descripcion: 'Mensajes de tu linaje. Lo que tus ancestros quieren que sepas.',
      runas: 250,
      nivel: 'maestra',
      duracion: '10-14 días',
      palabras: 5000,
      icono: '🌳',
      categoria: 'estudios'
    },
    {
      id: 'vidas_pasadas',
      nombre: 'Mapa de Vidas Pasadas',
      descripcion: 'Tres vidas anteriores relevantes para tu presente. Patrones que se repiten.',
      runas: 300,
      nivel: 'maestra',
      duracion: '14 días',
      palabras: 6000,
      icono: '🔄',
      categoria: 'estudios'
    },
    {
      id: 'proposito_vida',
      nombre: 'Propósito de Vida',
      descripcion: 'Para qué viniste a este mundo. Tu misión revelada.',
      runas: 350,
      nivel: 'maestra',
      duracion: '14 días',
      palabras: 6000,
      icono: '🎯',
      categoria: 'estudios'
    },
    {
      id: 'gran_estudio_anual',
      nombre: 'Gran Estudio Anual',
      descripcion: 'Todo: carta astral + tarot + runas + numerología + guía completa.',
      runas: 400,
      nivel: 'maestra',
      duracion: '21 días',
      palabras: 10000,
      icono: '📚',
      categoria: 'estudios',
      destacado: true
    }
  ],

  // ─────────────────────────────────────────────────────────────
  // LECTURAS DE EVENTO (Tiempo limitado)
  // ─────────────────────────────────────────────────────────────
  eventos: [
    {
      id: 'luna_llena',
      nombre: 'Lectura de Luna Llena',
      descripcion: 'Disponible solo durante la luna llena. Qué soltar, qué manifestar.',
      runas: 35,
      nivel: 'iniciada',
      duracion: '24 horas',
      palabras: 1000,
      icono: '🌕',
      categoria: 'eventos',
      disponibilidad: 'luna_llena' // Solo visible en luna llena
    },
    {
      id: 'luna_nueva',
      nombre: 'Lectura de Luna Nueva',
      descripcion: 'Disponible solo durante la luna nueva. Semillas para el nuevo ciclo.',
      runas: 35,
      nivel: 'iniciada',
      duracion: '24 horas',
      palabras: 1000,
      icono: '🌑',
      categoria: 'eventos',
      disponibilidad: 'luna_nueva'
    },
    {
      id: 'lectura_secreta',
      nombre: 'Lectura Secreta del Bosque',
      descripcion: '¡Aparece por tiempo limitado! El bosque tiene algo urgente que decirte.',
      runas: 25,
      nivel: 'iniciada',
      duracion: '12 horas',
      palabras: 800,
      icono: '🔮',
      categoria: 'eventos',
      disponibilidad: 'random' // Aparece random 1-2 veces por semana
    }
  ],

  // ─────────────────────────────────────────────────────────────
  // LECTURAS DE TEMPORADA (Círculo Anual)
  // ─────────────────────────────────────────────────────────────
  temporada: [
    {
      id: 'portal_yule',
      nombre: 'Portal de Yule',
      descripcion: 'Renacimiento interior en el solsticio de invierno.',
      runas: 0, // Gratis para anuales, 150 para otros
      runasSinMembresia: 150,
      nivel: 'iniciada',
      duracion: '72 horas',
      palabras: 2500,
      icono: '❄️',
      categoria: 'portales',
      fecha: 'junio_21'
    },
    {
      id: 'portal_ostara',
      nombre: 'Portal de Ostara',
      descripcion: 'Despertar de primavera. Nuevos comienzos.',
      runas: 0,
      runasSinMembresia: 150,
      nivel: 'iniciada',
      duracion: '72 horas',
      palabras: 2500,
      icono: '🌸',
      categoria: 'portales',
      fecha: 'septiembre_21'
    },
    {
      id: 'portal_litha',
      nombre: 'Portal de Litha',
      descripcion: 'Plenitud del solsticio de verano. Abundancia máxima.',
      runas: 0,
      runasSinMembresia: 150,
      nivel: 'iniciada',
      duracion: '72 horas',
      palabras: 2500,
      icono: '☀️',
      categoria: 'portales',
      fecha: 'diciembre_21'
    },
    {
      id: 'portal_mabon',
      nombre: 'Portal de Mabon',
      descripcion: 'Cosecha y gratitud de otoño. Cerrar ciclos.',
      runas: 0,
      runasSinMembresia: 150,
      nivel: 'iniciada',
      duracion: '72 horas',
      palabras: 2500,
      icono: '🍂',
      categoria: 'portales',
      fecha: 'marzo_21'
    }
  ]
};

// Helper: Obtener todas las lecturas en array plano
export function obtenerTodasLasLecturas() {
  return [
    ...LECTURAS.basicas,
    ...LECTURAS.estandar,
    ...LECTURAS.premium,
    ...LECTURAS.ultraPremium,
    ...LECTURAS.eventos,
    ...LECTURAS.temporada
  ];
}

// Helper: Obtener lectura por ID
export function obtenerLecturaPorId(id) {
  return obtenerTodasLasLecturas().find(l => l.id === id);
}

// Helper: Obtener nivel del usuario
export function obtenerNivel(xp) {
  let nivel = NIVELES[0];
  for (const n of NIVELES) {
    if (xp >= n.xpRequerida) {
      nivel = n;
    }
  }
  return nivel;
}

// Helper: Verificar si usuario puede acceder a lectura
export function puedeAccederALectura(nivelUsuario, nivelLectura) {
  const ordenNiveles = ['iniciada', 'aprendiz', 'guardiana', 'maestra', 'sabia'];
  return ordenNiveles.indexOf(nivelUsuario) >= ordenNiveles.indexOf(nivelLectura);
}

// ═══════════════════════════════════════════════════════════════
// 7. MISIONES
// ═══════════════════════════════════════════════════════════════

export const MISIONES = {
  bienvenida: [
    { id: 'primera_lectura', nombre: 'Completá tu primera lectura', recompensa: { runas: 20, xp: 25 }, condicion: 'lecturas >= 1' },
    { id: 'visitar_circulo', nombre: 'Visitá el Círculo', recompensa: { runas: 10, xp: 10 }, condicion: 'visitoCirculo' },
    { id: 'completar_perfil', nombre: 'Completá tu perfil', recompensa: { runas: 15, xp: 15 }, condicion: 'perfilCompleto' },
    { id: 'primera_compra', nombre: 'Hacé tu primera compra de runas', recompensa: { runas: 25, xp: 30 }, condicion: 'comprasRunas >= 1' },
    { id: 'invitar_amiga', nombre: 'Invitá tu primera amiga', recompensa: { runas: 75, xp: 50 }, condicion: 'referidos >= 1' }
  ],
  semanales: [
    { id: 'sem_3_lecturas', nombre: 'Hacé 3 lecturas esta semana', recompensa: { runas: 30, xp: 35 } },
    { id: 'sem_5_dias', nombre: 'Entrá 5 días seguidos', recompensa: { runas: 20, xp: 25 } },
    { id: 'sem_lectura_nueva', nombre: 'Probá una lectura que nunca hiciste', recompensa: { runas: 15, xp: 20 } },
    { id: 'sem_compartir', nombre: 'Compartí una lectura', recompensa: { runas: 25, xp: 30 } }
  ],
  mensuales: [
    { id: 'men_10_lecturas', nombre: 'Completá 10 lecturas', recompensa: { runas: 100, xp: 100 } },
    { id: 'men_racha_30', nombre: 'Mantené racha de 30 días', recompensa: { runas: 75, xp: 200, badge: 'racha_30' } },
    { id: 'men_subir_nivel', nombre: 'Subí de nivel', recompensa: { runas: 50, xp: 50 } },
    { id: 'men_3_referidas', nombre: 'Referí a 3 amigas', recompensa: { runas: 150, xp: 150 } }
  ]
};

// ═══════════════════════════════════════════════════════════════
// 8. BADGES/INSIGNIAS
// ═══════════════════════════════════════════════════════════════

export const BADGES = [
  { id: 'hija_luna', nombre: 'Hija de la Luna', icono: '🌙', descripcion: 'Completar 5 lecturas de Luna', condicion: 'lecturasLuna >= 5' },
  { id: 'guardiana_fuego', nombre: 'Guardiana del Fuego', icono: '🔥', descripcion: 'Completar todas las lecturas elementales', condicion: 'elementalesCompletos' },
  { id: 'erudita', nombre: 'Erudita', icono: '📚', descripcion: 'Completar 25 lecturas', condicion: 'lecturas >= 25' },
  { id: 'conectada', nombre: 'Conectada', icono: '💫', descripcion: '30 días de racha', condicion: 'rachaMax >= 30' },
  { id: 'sabia_bosque', nombre: 'Sabia del Bosque', icono: '👑', descripcion: 'Alcanzar nivel Sabia', condicion: 'nivel == sabia' },
  { id: 'generosa', nombre: 'Generosa', icono: '🎁', descripcion: 'Referir 5 amigas', condicion: 'referidos >= 5' },
  { id: 'coleccionista', nombre: 'Coleccionista', icono: '🏆', descripcion: 'Tener 3+ guardianes físicos', condicion: 'guardianes >= 3' },
  { id: 'primera_guardiana', nombre: 'Primera Guardiana', icono: '⭐', descripcion: 'Ser de las primeras 100 miembros', condicion: 'numeroPrimera <= 100' },
  { id: 'exploradora', nombre: 'Exploradora', icono: '🌈', descripcion: 'Probar 10 tipos de lecturas', condicion: 'tiposLectura >= 10' },
  { id: 'racha_100', nombre: 'Leyenda del Bosque', icono: '🌟', descripcion: '100 días de racha', condicion: 'rachaMax >= 100' }
];

// ═══════════════════════════════════════════════════════════════
// 9. SISTEMA DE REFERIDOS
// ═══════════════════════════════════════════════════════════════

export const REFERIDOS = {
  recompensaReferidor: {
    registro: 50,
    compraRunas: 25,
    compraGuardian: 75,
    compraMembresia: 150
  },
  recompensaReferido: {
    registro: 30 // En lugar de 20 normales
  }
};

// ═══════════════════════════════════════════════════════════════
// 10. RUNAS POR COMPRA DE GUARDIÁN
// ═══════════════════════════════════════════════════════════════

export const BONUS_GUARDIAN = {
  porcentaje: 10, // 10% del precio en runas
  minimo: 10 // Mínimo 10 runas por cualquier guardián
};

// ═══════════════════════════════════════════════════════════════
// 11. EVENTOS ESPECIALES
// ═══════════════════════════════════════════════════════════════

export const EVENTOS_ESPECIALES = {
  cumpleanos: {
    recompensa: { lecturaGratis: 'consejo_bosque' },
    mensaje: '¡Feliz cumpleaños! El bosque tiene un regalo para vos.'
  },
  aniversarioRegistro: {
    recompensa: { runas: 100, badge: 'aniversario' },
    mensaje: '¡Un año juntas! Gracias por ser parte del bosque.'
  },
  primeraCompra: {
    recompensa: { runas: 15 },
    mensaje: '¡Bienvenida a la magia! Acá tenés un pequeño extra.'
  }
};

export default {
  NIVELES,
  XP_ACCIONES,
  RACHAS,
  PAQUETES_RUNAS,
  MEMBRESIAS,
  LECTURAS,
  MISIONES,
  BADGES,
  REFERIDOS,
  BONUS_GUARDIAN,
  EVENTOS_ESPECIALES,
  obtenerTodasLasLecturas,
  obtenerLecturaPorId,
  obtenerNivel,
  puedeAccederALectura
};
