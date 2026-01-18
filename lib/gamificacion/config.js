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
// 6. CATÁLOGO DE LECTURAS/EXPERIENCIAS - COMPLETO
// ═══════════════════════════════════════════════════════════════

// Campos de formulario reutilizables
export const CAMPOS_FORMULARIO = {
  fechaNacimiento: {
    id: 'fechaNacimiento',
    tipo: 'date',
    label: '¿Cuándo naciste?',
    descripcion: 'Para numerología y carta astral',
    requerido: true
  },
  horaNacimiento: {
    id: 'horaNacimiento',
    tipo: 'time',
    label: 'Hora aproximada de nacimiento',
    descripcion: 'Si la sabés, nos ayuda mucho',
    requerido: false
  },
  lugarNacimiento: {
    id: 'lugarNacimiento',
    tipo: 'text',
    label: '¿Dónde naciste?',
    placeholder: 'Ciudad y país',
    requerido: false
  },
  preguntaEspecifica: {
    id: 'preguntaEspecifica',
    tipo: 'textarea',
    label: '¿Qué pregunta tenés?',
    placeholder: 'Escribí tu pregunta con el corazón...',
    maxLength: 500,
    requerido: true
  },
  momentoVida: {
    id: 'momentoVida',
    tipo: 'select',
    label: '¿Qué momento estás atravesando?',
    opciones: [
      { value: 'transicion', label: 'En transición - Cambios importantes' },
      { value: 'crisis', label: 'Atravesando una crisis' },
      { value: 'crecimiento', label: 'En crecimiento espiritual' },
      { value: 'estabilidad', label: 'Momento de estabilidad' },
      { value: 'despertar', label: 'Despertando espiritualmente' },
      { value: 'busqueda', label: 'Buscando respuestas' }
    ],
    requerido: true
  },
  areaVida: {
    id: 'areaVida',
    tipo: 'select',
    label: '¿Sobre qué área de tu vida?',
    opciones: [
      { value: 'amor', label: 'Amor y relaciones' },
      { value: 'trabajo', label: 'Trabajo y carrera' },
      { value: 'dinero', label: 'Dinero y abundancia' },
      { value: 'salud', label: 'Salud y bienestar' },
      { value: 'familia', label: 'Familia' },
      { value: 'espiritualidad', label: 'Espiritualidad' },
      { value: 'proposito', label: 'Propósito de vida' },
      { value: 'general', label: 'General / Todo' }
    ],
    requerido: true
  },
  intencion: {
    id: 'intencion',
    tipo: 'textarea',
    label: '¿Cuál es tu intención para esta lectura?',
    placeholder: 'Qué esperás recibir o entender...',
    maxLength: 300,
    requerido: false
  },
  contexto: {
    id: 'contexto',
    tipo: 'textarea',
    label: 'Contanos un poco más sobre tu situación',
    placeholder: 'Cualquier contexto que nos ayude a conectar mejor con vos...',
    maxLength: 800,
    requerido: false
  },
  nombreGuardian: {
    id: 'nombreGuardian',
    tipo: 'text',
    label: '¿Cómo se llama tu guardián?',
    placeholder: 'El nombre de tu duende/guardián',
    requerido: true
  },
  tipoGuardian: {
    id: 'tipoGuardian',
    tipo: 'select',
    label: '¿Qué tipo de guardián es?',
    opciones: [
      { value: 'hogar', label: 'Guardián del Hogar' },
      { value: 'abundancia', label: 'Duende de la Abundancia' },
      { value: 'proteccion', label: 'Guardián Protector' },
      { value: 'sanacion', label: 'Duende Sanador' },
      { value: 'sabiduria', label: 'Guardián de Sabiduría' },
      { value: 'amor', label: 'Duende del Amor' },
      { value: 'naturaleza', label: 'Guardián de la Naturaleza' },
      { value: 'otro', label: 'Otro tipo' }
    ],
    requerido: true
  },
  descripcionHogar: {
    id: 'descripcionHogar',
    tipo: 'textarea',
    label: 'Describí tu hogar brevemente',
    placeholder: 'Casa/departamento, cuántas personas viven, mascotas, energía general...',
    maxLength: 500,
    requerido: true
  },
  preocupaciones: {
    id: 'preocupaciones',
    tipo: 'textarea',
    label: '¿Qué te preocupa de tu hogar?',
    placeholder: 'Energías, protección, armonía...',
    maxLength: 400,
    requerido: false
  },
  elementoAfinidad: {
    id: 'elementoAfinidad',
    tipo: 'select',
    label: '¿Con qué elemento sentís más afinidad?',
    opciones: [
      { value: 'tierra', label: '🌍 Tierra - Estabilidad, practicidad' },
      { value: 'agua', label: '💧 Agua - Emociones, intuición' },
      { value: 'fuego', label: '🔥 Fuego - Pasión, acción' },
      { value: 'aire', label: '💨 Aire - Pensamiento, comunicación' },
      { value: 'nosé', label: '✨ No sé / Todos' }
    ],
    requerido: false
  },
  cristalesTiene: {
    id: 'cristalesTiene',
    tipo: 'textarea',
    label: '¿Tenés cristales? ¿Cuáles?',
    placeholder: 'Cuarzo, amatista, etc. Si no tenés, escribí "ninguno"',
    maxLength: 300,
    requerido: false
  },
  experienciaPrevia: {
    id: 'experienciaPrevia',
    tipo: 'select',
    label: '¿Tenés experiencia con lecturas espirituales?',
    opciones: [
      { value: 'primera', label: 'Es mi primera vez' },
      { value: 'algunas', label: 'He tenido algunas' },
      { value: 'muchas', label: 'Tengo bastante experiencia' },
      { value: 'experta', label: 'Soy muy experimentada' }
    ],
    requerido: false
  },
  relacionPersona: {
    id: 'relacionPersona',
    tipo: 'text',
    label: '¿Quién es esta persona para vos?',
    placeholder: 'Pareja, ex, amigo/a, familiar...',
    requerido: true
  },
  situacionRelacion: {
    id: 'situacionRelacion',
    tipo: 'textarea',
    label: 'Contanos sobre la situación',
    placeholder: 'Qué está pasando, qué sentís, qué necesitás saber...',
    maxLength: 600,
    requerido: true
  }
};

export const LECTURAS = {
  // ─────────────────────────────────────────────────────────────
  // TEMÁTICA DE DUENDES - Exclusivas de Duendes del Uruguay
  // ─────────────────────────────────────────────────────────────
  duendes: [
    {
      id: 'consejo_bosque',
      nombre: 'Consejo del Bosque',
      descripcion: 'Un mensaje breve y directo del bosque para tu día. Sabiduría ancestral en pocas palabras.',
      runas: 15,
      nivel: 'iniciada',
      duracion: 'Instantáneo',
      palabras: 300,
      icono: '🌲',
      categoria: 'mensajes',
      formulario: ['momentoVida'],
      promptBase: `Sos el Espíritu del Bosque hablando directamente a {nombre}.
Dale UN consejo poderoso y específico para su día basándote en que está en un momento de {momentoVida}.
NO uses frases genéricas. Hablá como un ser ancestral que LA CONOCE.
Máximo 300 palabras. Empezá con impacto emocional.`
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
      categoria: 'mensajes',
      formulario: [],
      promptBase: `Lee la energía del día para {nombre} según la fecha actual {fecha}.
Describí: qué energía domina hoy, cómo aprovecharla, qué evitar.
Conectá con elementos de la naturaleza. Sé específica y práctica.
Máximo 350 palabras.`
    },
    {
      id: 'susurro_guardian',
      nombre: 'Susurro del Guardián',
      descripcion: 'Un guardián del bosque te susurra un mensaje personal para este momento.',
      runas: 20,
      nivel: 'iniciada',
      duracion: 'Instantáneo',
      palabras: 500,
      icono: '👂',
      categoria: 'mensajes',
      formulario: ['momentoVida', 'intencion'],
      promptBase: `Elegí UN guardián del bosque que resuene con {nombre} en su momento de {momentoVida}.
Dale un nombre, describí brevemente su esencia, y canalizá su mensaje personal.
Intención de {nombre}: {intencion}
El mensaje debe tocar el corazón. 500 palabras máximo.`
    },
    {
      id: 'mensaje_hogar_protegido',
      nombre: 'Mensaje del Hogar Protegido',
      descripcion: 'Tu guardián del hogar tiene algo importante que decirte sobre tu espacio sagrado.',
      runas: 25,
      nivel: 'iniciada',
      duracion: '24 horas',
      palabras: 600,
      icono: '🏠',
      categoria: 'mensajes',
      formulario: ['descripcionHogar', 'preocupaciones'],
      promptBase: `Canalizá un mensaje del Guardián del Hogar para {nombre}.
Su hogar: {descripcionHogar}
Preocupaciones: {preocupaciones}
El guardián observa la energía del hogar y da consejos específicos de protección y armonía.
600 palabras máximo.`
    },
    {
      id: 'conexion_tu_duende',
      nombre: 'Conexión con tu Duende',
      descripcion: 'Si tenés un guardián físico, canalizamos su mensaje personalizado para vos.',
      runas: 45,
      nivel: 'aprendiz',
      duracion: '24-48 horas',
      palabras: 1000,
      icono: '💚',
      categoria: 'mensajes',
      requiereGuardian: true,
      formulario: ['nombreGuardian', 'tipoGuardian', 'preguntaEspecifica'],
      promptBase: `{nombre} tiene un guardián físico llamado {nombreGuardian} de tipo {tipoGuardian}.
Canalizá la voz de este guardián específico. Dale personalidad única basada en su tipo.
Pregunta de {nombre}: {preguntaEspecifica}
El guardián responde con sabiduría, cariño y mensajes prácticos. 1000 palabras.`
    },
    {
      id: 'cuatro_elementales',
      nombre: 'Los 4 Elementales te Hablan',
      descripcion: 'Tierra, Agua, Fuego y Aire - cada uno tiene un mensaje único para vos.',
      runas: 50,
      nivel: 'aprendiz',
      duracion: '48 horas',
      palabras: 1500,
      icono: '🌍',
      categoria: 'lecturas',
      popular: true,
      formulario: ['momentoVida', 'elementoAfinidad', 'preguntaEspecifica'],
      promptBase: `Canalizá los 4 elementales hablando a {nombre}:
- TIERRA: Mensaje de estabilidad y fundamentos
- AGUA: Mensaje emocional e intuitivo
- FUEGO: Mensaje de acción y transformación
- AIRE: Mensaje de claridad y comunicación

Momento de vida: {momentoVida}
Afinidad: {elementoAfinidad}
Pregunta: {preguntaEspecifica}

Cada elemental tiene voz propia. Terminá indicando qué elemento necesita más. 1500 palabras.`
    },
    {
      id: 'consejo_duende_bosque',
      nombre: 'Consejo del Duende del Bosque',
      descripcion: 'Un duende sabio del bosque uruguayo comparte su sabiduría ancestral.',
      runas: 35,
      nivel: 'iniciada',
      duracion: '24 horas',
      palabras: 800,
      icono: '🍀',
      categoria: 'mensajes',
      formulario: ['areaVida', 'contexto'],
      promptBase: `Un duende sabio del bosque uruguayo habla a {nombre}.
Área de consulta: {areaVida}
Contexto: {contexto}

El duende tiene personalidad traviesa pero sabia. Usa humor sutil.
Da consejos prácticos mezclados con magia. 800 palabras.`
    },
    {
      id: 'proteccion_hogar',
      nombre: 'Ritual de Protección del Hogar',
      descripcion: 'Ritual personalizado para proteger tu hogar con la ayuda de guardianes.',
      runas: 55,
      nivel: 'aprendiz',
      duracion: '48 horas',
      palabras: 1200,
      icono: '🛡️',
      categoria: 'rituales',
      formulario: ['descripcionHogar', 'preocupaciones', 'cristalesTiene'],
      promptBase: `Creá un ritual de protección personalizado para el hogar de {nombre}.
Hogar: {descripcionHogar}
Preocupaciones: {preocupaciones}
Cristales disponibles: {cristalesTiene}

Incluí:
1. Preparación del espacio
2. Invocación de guardianes
3. Pasos del ritual (detallados, prácticos)
4. Mantenimiento de la protección
5. Señales de que funciona

Usá elementos accesibles. 1200 palabras.`
    },
    {
      id: 'conexion_espiritu_bosque',
      nombre: 'Conexión con el Espíritu del Bosque',
      descripcion: 'Meditación guiada y mensaje del espíritu colectivo del bosque.',
      runas: 70,
      nivel: 'aprendiz',
      duracion: '48 horas',
      palabras: 1800,
      icono: '🌳',
      categoria: 'lecturas',
      formulario: ['intencion', 'momentoVida', 'experienciaPrevia'],
      promptBase: `Guía a {nombre} en una conexión profunda con el Espíritu del Bosque.
Intención: {intencion}
Momento: {momentoVida}
Experiencia: {experienciaPrevia}

Incluí:
1. Meditación guiada (paso a paso)
2. Mensaje canalizado del Espíritu del Bosque
3. Animal de poder que aparece
4. Regalo simbólico del bosque
5. Práctica para mantener la conexión

1800 palabras. Ajustá complejidad según experiencia.`
    },
    {
      id: 'sanacion_duende',
      nombre: 'Sanación con tu Duende',
      descripcion: 'Tu guardián te guía en un proceso de sanación energética.',
      runas: 85,
      nivel: 'aprendiz',
      duracion: '48-72 horas',
      palabras: 2000,
      icono: '💚',
      categoria: 'sanacion',
      requiereGuardian: true,
      formulario: ['nombreGuardian', 'tipoGuardian', 'areaVida', 'contexto'],
      promptBase: `El guardián {nombreGuardian} ({tipoGuardian}) de {nombre} guía una sanación.
Área a sanar: {areaVida}
Situación: {contexto}

El guardián:
1. Detecta dónde está el bloqueo/dolor
2. Explica el origen energético
3. Guía ejercicio de liberación
4. Llena de luz el espacio sanado
5. Da práctica de mantenimiento

Tono amoroso y contenedor. 2000 palabras.`
    }
  ],

  // ─────────────────────────────────────────────────────────────
  // TIRADAS CLÁSICAS - Tarot y Runas
  // ─────────────────────────────────────────────────────────────
  clasicas: [
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
      popular: true,
      formulario: ['preguntaEspecifica', 'areaVida'],
      promptBase: `Tirada de 3 runas para {nombre}.
Pregunta: {preguntaEspecifica}
Área: {areaVida}

Seleccioná 3 runas del Futhark. Para cada una:
- Nombre y símbolo
- Posición (Pasado/Presente/Futuro)
- Significado en esta posición
- Cómo aplica a su situación

Cierre: síntesis y consejo. 800 palabras.`
    },
    {
      id: 'tirada_5_runas',
      nombre: 'Tirada de 5 Runas',
      descripcion: 'Situación completa con obstáculo y consejo. Cinco perspectivas del camino.',
      runas: 40,
      nivel: 'aprendiz',
      duracion: '24-48 horas',
      palabras: 1200,
      icono: 'ᚱᛏ',
      categoria: 'tiradas',
      formulario: ['preguntaEspecifica', 'areaVida', 'contexto'],
      promptBase: `Tirada de 5 runas para {nombre}.
Pregunta: {preguntaEspecifica}
Área: {areaVida}
Contexto: {contexto}

Posiciones:
1. El tema central
2. Obstáculos
3. Aliados/recursos
4. Consejo de los ancestros
5. Resultado probable

Para cada runa: nombre, símbolo, interpretación específica.
Cierre integrando todo. 1200 palabras.`
    },
    {
      id: 'tirada_7_runas',
      nombre: 'Tirada de 7 Runas Completa',
      descripcion: 'La tirada profunda. Siete runas revelando aspectos ocultos de tu camino.',
      runas: 100,
      nivel: 'guardiana',
      duracion: '48-72 horas',
      palabras: 2500,
      icono: 'ᚱᛏᚠ',
      categoria: 'tiradas',
      popular: true,
      formulario: ['preguntaEspecifica', 'areaVida', 'momentoVida', 'contexto'],
      promptBase: `Tirada profunda de 7 runas para {nombre}.
Pregunta: {preguntaEspecifica}
Área: {areaVida}
Momento: {momentoVida}
Contexto: {contexto}

Posiciones:
1. El pasado que influye
2. El presente visible
3. El presente oculto
4. El obstáculo mayor
5. Las fuerzas a favor
6. El consejo de Odín
7. El resultado si sigue el consejo

Interpretación profunda de cada runa. Relaciones entre runas.
Síntesis final poderosa. 2500 palabras.`
    },
    {
      id: 'tarot_3_cartas',
      nombre: 'Tarot 3 Cartas',
      descripcion: 'Tres cartas con interpretación profunda para tu pregunta específica.',
      runas: 50,
      nivel: 'aprendiz',
      duracion: '24-48 horas',
      palabras: 1200,
      icono: '🃏',
      categoria: 'tiradas',
      formulario: ['preguntaEspecifica', 'areaVida'],
      promptBase: `Lectura de Tarot de 3 cartas para {nombre}.
Pregunta: {preguntaEspecifica}
Área: {areaVida}

Seleccioná 3 cartas (Arcanos Mayores y Menores).
Para cada carta:
- Nombre y descripción visual
- Posición (Situación/Desafío/Consejo)
- Significado específico para su pregunta

Integración final con mensaje claro. 1200 palabras.`
    },
    {
      id: 'tarot_cruz_celta',
      nombre: 'Tarot Cruz Celta',
      descripcion: 'La tirada completa. Diez cartas revelando todos los aspectos de tu situación.',
      runas: 120,
      nivel: 'guardiana',
      duracion: '72 horas',
      palabras: 3000,
      icono: '🎴',
      categoria: 'tiradas',
      destacado: true,
      formulario: ['preguntaEspecifica', 'areaVida', 'momentoVida', 'contexto'],
      promptBase: `Cruz Celta completa para {nombre}.
Pregunta: {preguntaEspecifica}
Área: {areaVida}
Momento: {momentoVida}
Contexto: {contexto}

Las 10 posiciones:
1. Situación presente
2. El desafío inmediato
3. Base/fundamento
4. Pasado reciente
5. Coronación (mejor resultado)
6. Futuro inmediato
7. Cómo te ves
8. Influencias externas
9. Esperanzas y miedos
10. Resultado final

Interpretación profunda de cada carta y sus interrelaciones.
Síntesis final integradora. 3000 palabras.`
    },
    {
      id: 'tarot_amor',
      nombre: 'Tarot del Amor',
      descripcion: 'Tirada especializada en relaciones, vínculos y asuntos del corazón.',
      runas: 75,
      nivel: 'aprendiz',
      duracion: '48 horas',
      palabras: 1500,
      icono: '💕',
      categoria: 'tiradas',
      popular: true,
      formulario: ['preguntaEspecifica', 'relacionPersona', 'situacionRelacion'],
      promptBase: `Tarot del Amor para {nombre}.
Pregunta: {preguntaEspecifica}
La otra persona: {relacionPersona}
Situación: {situacionRelacion}

Tirada de 6 cartas:
1. Tu energía en esto
2. Su energía
3. Lo que los une
4. Lo que los separa
5. El potencial del vínculo
6. Consejo para el amor

Interpretación sensible y honesta. 1500 palabras.`
    }
  ],

  // ─────────────────────────────────────────────────────────────
  // ESTUDIOS PROFUNDOS - Numerología, Astrología, Akáshicos
  // ─────────────────────────────────────────────────────────────
  estudios: [
    {
      id: 'numerologia_personal',
      nombre: 'Numerología Personal',
      descripcion: 'Tu número de vida, año personal y ciclos numerológicos explicados.',
      runas: 65,
      nivel: 'aprendiz',
      duracion: '48-72 horas',
      palabras: 1800,
      icono: '🔢',
      categoria: 'estudios',
      formulario: ['fechaNacimiento'],
      promptBase: `Estudio numerológico para {nombre}, nacida el {fechaNacimiento}.

Calculá y explicá:
1. Número de Vida (suma de fecha)
2. Número de Personalidad
3. Año Personal actual
4. Mes Personal
5. Ciclos de 9 años

Para cada número: significado general + aplicación personal.
Consejos específicos para este año personal. 1800 palabras.`
    },
    {
      id: 'registros_akashicos',
      nombre: 'Registros Akáshicos',
      descripcion: 'Acceso a tus registros del alma. Respuestas de tu biblioteca cósmica personal.',
      runas: 75,
      nivel: 'aprendiz',
      duracion: '48-72 horas',
      palabras: 2000,
      icono: '📜',
      categoria: 'estudios',
      popular: true,
      formulario: ['preguntaEspecifica', 'areaVida', 'fechaNacimiento', 'contexto'],
      promptBase: `Lectura de Registros Akáshicos para {nombre}.
Fecha nacimiento: {fechaNacimiento}
Pregunta: {preguntaEspecifica}
Área: {areaVida}
Contexto: {contexto}

Abrí los registros de {nombre}. Incluí:
1. Apertura ceremonial de los registros
2. Lo que los Maestros muestran sobre su pregunta
3. Contratos de alma relevantes
4. Lecciones de esta encarnación
5. Guía de los Guardianes de los Registros
6. Cierre ceremonial

Tono reverente pero accesible. 2000 palabras.`
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
      categoria: 'estudios',
      formulario: ['fechaNacimiento', 'horaNacimiento', 'lugarNacimiento'],
      promptBase: `Carta Astral Esencial para {nombre}.
Nacimiento: {fechaNacimiento} a las {horaNacimiento} en {lugarNacimiento}

Analizar:
1. Sol: esencia vital, propósito
2. Luna: emociones, necesidades internas
3. Ascendente: máscara social, primera impresión
4. Mercurio, Venus, Marte
5. Casas más relevantes
6. Aspectos principales

Todo explicado de forma clara y aplicable a su vida.
Evitá tecnicismos innecesarios. 3000 palabras.`
    },
    {
      id: 'mapa_karmico',
      nombre: 'Mapa Kármico',
      descripcion: 'Tus lecciones kármicas, deudas del alma y misión en esta vida.',
      runas: 180,
      nivel: 'guardiana',
      duracion: '7-10 días',
      palabras: 3500,
      icono: '🔄',
      categoria: 'estudios',
      formulario: ['fechaNacimiento', 'contexto', 'momentoVida'],
      promptBase: `Mapa Kármico para {nombre}, nacida el {fechaNacimiento}.
Momento actual: {momentoVida}
Contexto: {contexto}

Explorá:
1. Nodos Lunares: de dónde viene, hacia dónde va
2. Deudas kármicas principales
3. Dones traídos de otras vidas
4. Relaciones kármicas actuales
5. Lecciones de esta encarnación
6. Cómo sanar el karma pendiente

Profundo pero esperanzador. 3500 palabras.`
    },
    {
      id: 'mision_alma',
      nombre: 'Misión del Alma',
      descripcion: 'Para qué viniste a este mundo. Tu propósito revelado.',
      runas: 200,
      nivel: 'maestra',
      duracion: '10-14 días',
      palabras: 4000,
      icono: '🎯',
      categoria: 'estudios',
      popular: true,
      formulario: ['fechaNacimiento', 'areaVida', 'momentoVida', 'contexto'],
      promptBase: `Estudio de Misión del Alma para {nombre}.
Nacimiento: {fechaNacimiento}
Momento: {momentoVida}
Contexto: {contexto}

Revelar:
1. Tu arquetipo del alma
2. Los dones que trajiste
3. Los desafíos elegidos
4. Tu misión en esta vida (específica)
5. Cómo estás alineada o desalineada
6. Pasos para alinearte con tu propósito
7. Señales de que vas bien

Transformador y práctico. 4000 palabras.`
    },
    {
      id: 'vidas_pasadas',
      nombre: 'Mapa de Vidas Pasadas',
      descripcion: 'Tres vidas anteriores relevantes para tu presente. Patrones que se repiten.',
      runas: 300,
      nivel: 'maestra',
      duracion: '14 días',
      palabras: 6000,
      icono: '🔮',
      categoria: 'estudios',
      formulario: ['fechaNacimiento', 'areaVida', 'contexto'],
      promptBase: `Mapa de Vidas Pasadas para {nombre}.
Nacimiento: {fechaNacimiento}
Área de interés: {areaVida}
Contexto actual: {contexto}

Revelar 3 vidas pasadas relevantes:
Para cada vida:
- Época y lugar
- Quién eras
- Eventos importantes
- Cómo terminó
- Qué aprendiste
- Cómo afecta tu presente
- Personas de entonces que están ahora

Conexión entre las 3 vidas y el presente.
Sanación del patrón. 6000 palabras.`
    },
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
      formulario: ['fechaNacimiento', 'momentoVida', 'areaVida', 'contexto'],
      promptBase: `Estudio completo del Alma para {nombre}.
Nacimiento: {fechaNacimiento}
Momento: {momentoVida}
Área: {areaVida}
Contexto: {contexto}

Revelar:
1. Esencia del alma (más allá de personalidad)
2. Origen estelar/dimensional
3. Familia de almas
4. Dones latentes
5. Sombras y heridas del alma
6. Camino de integración
7. Tu contribución al colectivo

Profundo y transformador. 5000 palabras.`
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
      categoria: 'estudios',
      formulario: ['areaVida', 'contexto'],
      promptBase: `Conexión Ancestral para {nombre}.
Área: {areaVida}
Contexto: {contexto}

Canalizá mensajes de:
1. Línea materna - abuelas y más atrás
2. Línea paterna - abuelos y más atrás
3. Ancestro específico que se presenta
4. Herencias del linaje (dones y cargas)
5. Lo que piden que sanes
6. Bendiciones que te dan
7. Ritual de honra ancestral

Sanador y reconectador. 5000 palabras.`
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
      destacado: true,
      formulario: ['fechaNacimiento', 'horaNacimiento', 'lugarNacimiento', 'areaVida', 'momentoVida', 'contexto'],
      promptBase: `Gran Estudio Anual para {nombre}.
Nacimiento: {fechaNacimiento} - {horaNacimiento} - {lugarNacimiento}
Momento: {momentoVida}
Área: {areaVida}
Contexto: {contexto}

Incluir TODO:
1. NUMEROLOGÍA: Número vida, año personal, ciclos
2. CARTA ASTRAL: Sol, Luna, Ascendente, tránsitos del año
3. TIRADA ANUAL: 12 cartas (una por mes)
4. RUNAS: Tirada de 7 para el año
5. GUÍA MES A MES: Qué esperar, qué hacer
6. FECHAS CLAVE: Momentos importantes
7. RITUALES SUGERIDOS: Uno por estación

El estudio más completo. 10000 palabras.`
    }
  ],

  // ─────────────────────────────────────────────────────────────
  // GUÍAS Y RITUALES
  // ─────────────────────────────────────────────────────────────
  rituales: [
    {
      id: 'ritual_mes',
      nombre: 'Ritual del Mes',
      descripcion: 'Un ritual personalizado según tu situación actual y la energía del mes.',
      runas: 55,
      nivel: 'aprendiz',
      duracion: '48 horas',
      palabras: 1000,
      icono: '🕯️',
      categoria: 'rituales',
      formulario: ['areaVida', 'intencion'],
      promptBase: `Ritual personalizado para {nombre} en {mes_actual}.
Área: {areaVida}
Intención: {intencion}

Crear ritual con:
1. Momento ideal (luna, día, hora)
2. Materiales (accesibles)
3. Preparación del espacio
4. Pasos detallados
5. Palabras/invocaciones
6. Cierre y agradecimiento
7. Señales de que funcionó

Práctico y poderoso. 1000 palabras.`
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
      categoria: 'guias',
      formulario: ['areaVida', 'cristalesTiene'],
      promptBase: `Guía de Cristales para {nombre}.
Área de vida: {areaVida}
Cristales que tiene: {cristalesTiene}

Incluir:
1. El cristal principal del mes para ella
2. Cristales complementarios
3. Cómo limpiarlos
4. Cómo programarlos
5. Dónde colocarlos
6. Meditación con el cristal
7. Combinaciones a evitar

Práctico y detallado. 1200 palabras.`
    },
    {
      id: 'limpieza_energetica',
      nombre: 'Ritual de Limpieza Energética',
      descripcion: 'Limpieza profunda de tu energía personal y tu espacio.',
      runas: 45,
      nivel: 'aprendiz',
      duracion: '24-48 horas',
      palabras: 1000,
      icono: '✨',
      categoria: 'rituales',
      formulario: ['descripcionHogar', 'preocupaciones'],
      promptBase: `Ritual de Limpieza Energética para {nombre}.
Espacio: {descripcionHogar}
Preocupaciones: {preocupaciones}

Incluir:
1. Limpieza personal (baño de sal, etc)
2. Limpieza del espacio (humo, sonido, etc)
3. Protección posterior
4. Mantenimiento semanal
5. Señales de energías densas

Usar elementos accesibles. 1000 palabras.`
    },
    {
      id: 'ritual_abundancia',
      nombre: 'Ritual de Abundancia',
      descripcion: 'Abrí los canales de prosperidad con este ritual personalizado.',
      runas: 65,
      nivel: 'aprendiz',
      duracion: '48 horas',
      palabras: 1200,
      icono: '🌟',
      categoria: 'rituales',
      popular: true,
      formulario: ['areaVida', 'contexto', 'intencion'],
      promptBase: `Ritual de Abundancia para {nombre}.
Área: {areaVida}
Situación: {contexto}
Intención: {intencion}

Crear ritual que:
1. Identifique bloqueos de abundancia
2. Libere creencias limitantes
3. Active la energía de recibir
4. Incluya altar de prosperidad
5. Tenga afirmaciones personalizadas
6. Incluya acción práctica (no solo energética)

Equilibrio entre magia y acción. 1200 palabras.`
    },
    {
      id: 'ritual_soltar',
      nombre: 'Ritual de Soltar y Liberar',
      descripcion: 'Soltá lo que ya no te sirve con este poderoso ritual de liberación.',
      runas: 50,
      nivel: 'aprendiz',
      duracion: '48 horas',
      palabras: 1000,
      icono: '🔥',
      categoria: 'rituales',
      formulario: ['areaVida', 'contexto'],
      promptBase: `Ritual de Liberación para {nombre}.
Área: {areaVida}
Qué necesita soltar: {contexto}

Crear ritual que:
1. Identifique exactamente qué soltar
2. Honre lo que fue
3. Corte energéticamente
4. Queme/entierro simbólico
5. Llene el espacio vacío de luz
6. Cierre el ciclo

Catártico pero contenedor. 1000 palabras.`
    }
  ],

  // ─────────────────────────────────────────────────────────────
  // LECTURAS ESPECIALES Y DE AMOR
  // ─────────────────────────────────────────────────────────────
  especiales: [
    {
      id: 'lectura_ano_personal',
      nombre: 'Lectura de Año Personal',
      descripcion: 'Los 12 meses que vienen. Predicciones, consejos y momentos clave.',
      runas: 140,
      nivel: 'guardiana',
      duracion: '7 días',
      palabras: 3500,
      icono: '📅',
      categoria: 'especiales',
      popular: true,
      formulario: ['fechaNacimiento', 'areaVida', 'momentoVida'],
      promptBase: `Lectura del Año Personal para {nombre}.
Nacimiento: {fechaNacimiento}
Área prioritaria: {areaVida}
Momento actual: {momentoVida}

Incluir:
1. Tema general del año
2. Predicción mes a mes (12 meses)
3. Fechas clave a marcar
4. Desafíos previstos
5. Oportunidades a aprovechar
6. Consejo para cada trimestre

Esperanzador pero realista. 3500 palabras.`
    },
    {
      id: 'compatibilidad_pareja',
      nombre: 'Compatibilidad de Pareja',
      descripcion: 'Análisis profundo de la compatibilidad energética entre dos personas.',
      runas: 95,
      nivel: 'guardiana',
      duracion: '72 horas',
      palabras: 2000,
      icono: '💑',
      categoria: 'especiales',
      formulario: ['fechaNacimiento', 'relacionPersona', 'situacionRelacion'],
      promptBase: `Estudio de Compatibilidad para {nombre} con {relacionPersona}.
Tu nacimiento: {fechaNacimiento}
Situación: {situacionRelacion}

Analizar:
1. Compatibilidad numerológica
2. Conexiones kármicas
3. Fortalezas de la unión
4. Desafíos a trabajar
5. Dinámicas de poder
6. Potencial a largo plazo
7. Consejos para armonizar

Honesto y constructivo. 2000 palabras.`
    },
    {
      id: 'mensaje_ser_amado_fallecido',
      nombre: 'Mensaje de un Ser Amado que Partió',
      descripcion: 'Canalización de mensajes de seres queridos que ya no están en el plano físico.',
      runas: 150,
      nivel: 'guardiana',
      duracion: '72 horas',
      palabras: 2000,
      icono: '🕊️',
      categoria: 'especiales',
      formulario: ['relacionPersona', 'contexto'],
      promptBase: `Canalización de ser querido para {nombre}.
Relación: {relacionPersona}
Contexto/lo que necesita saber: {contexto}

IMPORTANTE: Mensaje sensible y respetuoso.

Incluir:
1. Conexión con la energía del ser
2. Descripción de cómo se presenta
3. Mensajes que quiere transmitir
4. Lo que quiere que sepas sobre su partida
5. Guía que te da desde donde está
6. Señales de su presencia continua

Sanador y reconfortante. 2000 palabras.`
    },
    {
      id: 'lectura_embarazo',
      nombre: 'Lectura de Embarazo y Maternidad',
      descripcion: 'Mensajes para mamás en espera o buscando serlo.',
      runas: 85,
      nivel: 'aprendiz',
      duracion: '48-72 horas',
      palabras: 1500,
      icono: '🤰',
      categoria: 'especiales',
      formulario: ['contexto', 'intencion'],
      promptBase: `Lectura de Maternidad para {nombre}.
Situación: {contexto}
Intención: {intencion}

Incluir:
1. Mensaje del alma que viene/vino
2. Conexión madre-hijo/a
3. Lo que necesitás saber
4. Guía para este momento
5. Protección para el embarazo/bebé
6. Mensaje de los guardianes para la familia

Amoroso y contenedor. 1500 palabras.`
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
      disponibilidad: 'luna_llena',
      formulario: ['intencion'],
      promptBase: `Lectura de Luna Llena para {nombre}.
Intención: {intencion}

Incluir:
1. Energía de esta luna específica (signo)
2. Qué ilumina en tu vida
3. Qué necesitás soltar ahora
4. Ritual de luna llena
5. Mensaje de la Diosa Luna

Conectar con el ciclo actual. 1000 palabras.`
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
      disponibilidad: 'luna_nueva',
      formulario: ['intencion'],
      promptBase: `Lectura de Luna Nueva para {nombre}.
Intención: {intencion}

Incluir:
1. Energía de esta luna (signo)
2. Qué sembrar en este ciclo
3. Intenciones recomendadas
4. Ritual de luna nueva
5. Mensaje del vacío fértil

Potencial y posibilidad. 1000 palabras.`
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
      disponibilidad: 'random',
      formulario: [],
      promptBase: `Lectura Secreta del Bosque para {nombre}.
Esta lectura solo aparece cuando el bosque tiene algo URGENTE.

Canalizá un mensaje sorpresa que:
1. Sea específico para este momento
2. Revele algo que no esperaba
3. Tenga un consejo accionable inmediato
4. Venga de un guardián misterioso

Impactante pero no alarmante. 800 palabras.`
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
      runas: 0,
      runasSinMembresia: 150,
      nivel: 'iniciada',
      duracion: '72 horas',
      palabras: 2500,
      icono: '❄️',
      categoria: 'portales',
      fecha: 'junio_21',
      formulario: ['momentoVida', 'intencion'],
      promptBase: `Portal de Yule para {nombre}.
Momento: {momentoVida}
Intención: {intencion}

Solsticio de invierno - el renacimiento de la luz.
1. Qué murió este año que necesita ser honrado
2. La luz que renace en vos
3. Mensaje de los ancestros de invierno
4. Ritual de Yule personalizado
5. Intenciones para el nuevo ciclo solar

Profundo y renacedor. 2500 palabras.`
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
      fecha: 'septiembre_21',
      formulario: ['momentoVida', 'intencion'],
      promptBase: `Portal de Ostara para {nombre}.
Momento: {momentoVida}
Intención: {intencion}

Equinoccio de primavera - equilibrio y nuevo comienzo.
1. Qué está brotando en vos
2. Semillas del invierno que florecen
3. Mensaje de la Diosa Primavera
4. Ritual de Ostara personalizado
5. Qué cuidar para que crezca

Renovador y esperanzador. 2500 palabras.`
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
      fecha: 'diciembre_21',
      formulario: ['momentoVida', 'intencion'],
      promptBase: `Portal de Litha para {nombre}.
Momento: {momentoVida}
Intención: {intencion}

Solsticio de verano - máxima luz y poder.
1. Tu luz en su máxima expresión
2. Qué celebrar de vos
3. Mensaje del Sol en su cénit
4. Ritual de Litha personalizado
5. Cómo sostener esta luz

Celebratorio y poderoso. 2500 palabras.`
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
      fecha: 'marzo_21',
      formulario: ['momentoVida', 'intencion'],
      promptBase: `Portal de Mabon para {nombre}.
Momento: {momentoVida}
Intención: {intencion}

Equinoccio de otoño - cosecha y gratitud.
1. Tu cosecha de este ciclo
2. Gratitud específica
3. Lo que soltar antes del invierno
4. Mensaje de los guardianes del otoño
5. Ritual de Mabon personalizado

Balance entre dar y recibir. 2500 palabras.`
    }
  ]
};

// Helper: Obtener todas las lecturas en array plano
export function obtenerTodasLasLecturas() {
  return [
    ...(LECTURAS.duendes || []),
    ...(LECTURAS.clasicas || []),
    ...(LECTURAS.estudios || []),
    ...(LECTURAS.rituales || []),
    ...(LECTURAS.especiales || []),
    ...(LECTURAS.eventos || []),
    ...(LECTURAS.temporada || [])
  ];
}

// Helper: Obtener lecturas por categoría
export function obtenerLecturasPorCategoria(categoria) {
  return LECTURAS[categoria] || [];
}

// Helper: Obtener campos de formulario para una lectura
export function obtenerCamposFormulario(lecturaId) {
  const lectura = obtenerLecturaPorId(lecturaId);
  if (!lectura || !lectura.formulario) return [];
  return lectura.formulario.map(campoId => CAMPOS_FORMULARIO[campoId]).filter(Boolean);
}

// Helper: Construir prompt personalizado
export function construirPromptLectura(lecturaId, datos) {
  const lectura = obtenerLecturaPorId(lecturaId);
  if (!lectura || !lectura.promptBase) return null;

  let prompt = lectura.promptBase;

  // Reemplazar variables en el prompt
  Object.keys(datos).forEach(key => {
    const regex = new RegExp(`\\{${key}\\}`, 'g');
    prompt = prompt.replace(regex, datos[key] || '');
  });

  // Agregar fecha actual
  const hoy = new Date();
  prompt = prompt.replace(/\{fecha\}/g, hoy.toLocaleDateString('es-UY'));
  prompt = prompt.replace(/\{mes_actual\}/g, hoy.toLocaleDateString('es-UY', { month: 'long' }));

  return prompt;
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
  CAMPOS_FORMULARIO,
  MISIONES,
  BADGES,
  REFERIDOS,
  BONUS_GUARDIAN,
  EVENTOS_ESPECIALES,
  obtenerTodasLasLecturas,
  obtenerLecturaPorId,
  obtenerLecturasPorCategoria,
  obtenerCamposFormulario,
  construirPromptLectura,
  obtenerNivel,
  puedeAccederALectura
};
