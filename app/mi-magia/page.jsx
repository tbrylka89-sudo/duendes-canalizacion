'use client';
import { useState, useEffect } from 'react';
import { SenalDelDia, TestElemental, CosmosMes, GuiaCristales, CatalogoExperiencias, estilosNuevos } from './nuevas-funciones';

const API_BASE = '';
const TITO_IMG = 'https://duendesuy.10web.cloud/wp-content/uploads/2025/12/gemini-image-2_que_tenga_un_pin_en_su_ropa_con_este_logo_en_negro_y_dorado_solo_el_circulo_que_-0_b02c570f-fd54-4b54-b306-3aa6a2b413b2-scaled.jpg';

// ═══════════════════════════════════════════════════════════════
// PACKS DE RUNAS (con URLs directas)
// ═══════════════════════════════════════════════════════════════

const PACKS_RUNAS = [
  { nombre: 'Chispa', runas: 15, precio: 7, url: 'https://duendesuy.10web.cloud/producto/runas-chispa/', desc: 'Para empezar a explorar' },
  { nombre: 'Destello', runas: 30, precio: 12, url: 'https://duendesuy.10web.cloud/producto/runas-destello/', desc: 'El más popular' },
  { nombre: 'Fulgor', runas: 50, precio: 18, url: 'https://duendesuy.10web.cloud/producto/runas-fulgor/', desc: 'Para varias experiencias' },
  { nombre: 'Resplandor', runas: 100, precio: 32, url: 'https://duendesuy.10web.cloud/producto/runas-resplandor/', desc: 'El mejor valor' }
];

// ═══════════════════════════════════════════════════════════════
// EXPERIENCIAS CON INFO COMPLETA Y HUMANA
// ═══════════════════════════════════════════════════════════════

const EXPERIENCIAS = [
  { 
    id: 'tirada-runas', 
    nombre: 'Tirada de Runas', 
    icono: 'ᚱ', 
    runas: 5, 
    treboles: 25, 
    tiempo: '20-30 minutos', 
    intro: `Las runas son un antiguo alfabeto nórdico que trasciende la escritura. Cada símbolo guarda energía, sabiduría y mensajes del universo. Cuando hacemos una tirada, no es azar - es sincronicidad pura.

Yo (Gabriel o Thibisay, dependiendo de quién esté canalizando ese día) me siento en silencio, conecto con tu energía a través de tu pregunta, y dejo que las runas hablen. A veces el mensaje es directo; otras veces es simbólico y requiere interpretación.`,
    queRecibis: ['Tirada de 3 runas con interpretación profunda', 'Mensaje canalizado específico para tu situación', 'Guía práctica de acción (qué hacer ahora)', 'Ritual opcional para potenciar el mensaje'],
    paraQuien: 'Ideal si tenés una pregunta concreta, necesitás claridad sobre una decisión, o simplemente querés saber qué energía te rodea en este momento.',
    campos: ['pregunta', 'contexto']
  },
  { 
    id: 'susurro-guardian', 
    nombre: 'Susurro del Guardián', 
    icono: '✦', 
    runas: 10, 
    treboles: 50, 
    tiempo: '40-60 minutos',
    intro: `¿Estás mirando los guardianes de la tienda y no sabés cuál elegir? ¿Sentís que varios te llaman pero no podés decidirte? Este servicio existe exactamente para eso.

Lo que hacemos es conectar con los guardianes que mencionás y dejar que ELLOS hablen. Porque recordá: el duende te elige a vos, no al revés. A veces pensamos que queremos uno y resulta que otro lleva tiempo esperándonos.`,
    queRecibis: ['Conexión canalizada con los guardianes que mencionaste', 'Mensaje directo del guardián que resuena con vos', 'Explicación de por qué ÉL te eligió', 'Guía para preparar su llegada a tu hogar'],
    paraQuien: 'Para vos que estás entre varios guardianes y necesitás esa confirmación. O si sentís el llamado pero no sabés por dónde empezar.',
    campos: ['guardianes_interes', 'situacion', 'que_buscas'],
    esElegirGuardian: true
  },
  { 
    id: 'oraculo-mes', 
    nombre: 'Oráculo del Mes', 
    icono: '☽', 
    runas: 12, 
    treboles: 60, 
    tiempo: '1-2 horas',
    intro: `Cada mes trae su propia energía. Las fases lunares, los tránsitos planetarios, las estaciones... todo influye en cómo fluye nuestra vida. Este oráculo te da un mapa completo del mes que viene.

No es una predicción rígida del futuro - es una guía de las energías disponibles y cómo aprovecharlas. Porque el futuro no está escrito; se co-crea entre el universo y tus decisiones.`,
    queRecibis: ['Tirada de 5 runas para cada área de tu vida', 'Análisis de las fases lunares del mes', 'Días favorables marcados para diferentes actividades', 'Rituales específicos para cada semana', 'Cristales y elementos recomendados'],
    paraQuien: 'Perfecto si te gusta planificar, si querés saber cuándo es mejor momento para iniciar proyectos, tener conversaciones difíciles, o simplemente fluir con la energía del mes.',
    campos: ['mes', 'area_principal', 'situacion']
  },
  { 
    id: 'gran-oraculo', 
    nombre: 'El Gran Oráculo', 
    icono: '★', 
    runas: 20, 
    treboles: 100, 
    tiempo: '2-3 horas',
    intro: `Esta es nuestra lectura más completa para quienes quieren ver el panorama grande. Tres meses de tu vida mapeados en detalle: amor, trabajo, salud, espiritualidad, desarrollo personal.

Usamos una combinación de runas, numerología (por eso pedimos tu fecha de nacimiento) y canalización directa. El resultado es un documento extenso que vas a querer releer varias veces porque siempre encontrarás nuevos detalles.`,
    queRecibis: ['Tirada de 7 runas maestras', 'Análisis numerológico personal', 'Mapa detallado de los próximos 3 meses', '3 rituales completamente personalizados', 'Cristales, hierbas y elementos específicos para tu camino'],
    paraQuien: 'Para momentos de transición importante, inicio de año, cumpleaños, o cuando sentís que necesitás una visión amplia de hacia dónde va tu vida.',
    campos: ['fecha_nacimiento', 'hora_nacimiento', 'lugar_nacimiento', 'pregunta_principal']
  },
  { 
    id: 'lectura-alma', 
    nombre: 'Lectura del Alma', 
    icono: '◈', 
    runas: 25, 
    treboles: 125, 
    tiempo: '4-6 horas',
    intro: `¿Alguna vez sentiste que hay algo más grande esperándote? ¿Que viniste a este mundo con un propósito que todavía no terminás de descifrar? Esta lectura va a las profundidades de tu ser.

Trabajamos con tu número de vida (calculado desde tu fecha de nacimiento), patrones que se repiten en tu historia, y canalización profunda para revelar tu misión de alma. No es solo "qué vas a ser" - es "quién viniste a ser".`,
    queRecibis: ['Tu número de vida y su significado completo', 'Misión de alma revelada', 'Patrones kármicos que estás trabajando', 'Dones innatos que podés desarrollar', 'Guía detallada para los próximos 6 meses', 'Meditación personalizada grabada'],
    paraQuien: 'Para quienes sienten el llamado espiritual fuerte, están en búsqueda de propósito, o atraviesan una "crisis" que en realidad es un despertar.',
    campos: ['fecha_nacimiento', 'hora_nacimiento', 'lugar_nacimiento', 'nombre_completo', 'patrones_repetitivos']
  },
  { 
    id: 'registros-akashicos', 
    nombre: 'Registros Akáshicos', 
    icono: '∞', 
    runas: 35, 
    treboles: 175, 
    tiempo: '6-8 horas',
    intro: `Los Registros Akáshicos son la biblioteca cósmica donde está guardada toda la información de tu alma a través de todas sus encarnaciones. Acceder a ellos es como abrir el libro de tu existencia eterna.

Este proceso es sagrado y profundo. Requiere preparación tanto de nuestra parte como tuya. El resultado es información de vidas pasadas que explican patrones actuales, contratos álmicos que tenés vigentes, y mensajes directos de tus guías y maestros ascendidos.`,
    queRecibis: ['Apertura ceremonial de tus registros', 'Información de 3 vidas pasadas relevantes para tu presente', 'Contratos álmicos actuales y cómo trabajarlos', 'Mensajes de tus guías y maestros', 'Karma pendiente y guía para resolverlo', 'Tu misión específica en esta vida', 'Ritual de integración'],
    paraQuien: 'Para almas maduras en el camino espiritual, quienes sienten conexiones inexplicables con épocas o lugares, o quienes quieren entender el "por qué" profundo de sus experiencias.',
    campos: ['fecha_nacimiento', 'hora_nacimiento', 'lugar_nacimiento', 'nombre_completo', 'miedos_inexplicables', 'atracciones_epocas']
  },
  { 
    id: 'carta-ancestral', 
    nombre: 'Carta Ancestral', 
    icono: '❧', 
    runas: 15, 
    treboles: 75, 
    tiempo: '1-2 horas',
    intro: `Tus ancestros no se fueron del todo. Su sangre corre por tus venas, sus memorias están en tu ADN, y su amor te acompaña aunque no los veas. Esta carta es un puente hacia ellos.

Canalizamos mensajes de tu linaje - pueden ser abuelos que conociste, bisabuelos que no, o ancestros más antiguos que tienen algo que decirte. A veces traen bendiciones; otras veces, advertencias cariñosas; siempre, amor.`,
    queRecibis: ['Mensaje canalizado directamente de tu linaje', 'Activación de protección ancestral', 'Bendiciones de línea familiar', 'Patrones heredados que podés sanar', 'Dones ancestrales que podés recuperar', 'Ritual de ofrenda sugerido para honrarlos'],
    paraQuien: 'Para quienes sienten conexión con sus raíces, perdieron seres queridos y quieren reconectar, o notan patrones familiares que quieren entender y sanar.',
    campos: ['nombre_ancestro', 'nacionalidades', 'patrones_familia']
  },
  { 
    id: 'mapa-energetico', 
    nombre: 'Mapa Energético', 
    icono: '◎', 
    runas: 18, 
    treboles: 90, 
    tiempo: '2-3 horas',
    intro: `Tu cuerpo físico es solo la capa más densa de quien sos. Alrededor y a través de él fluye tu cuerpo energético: chakras, aura, meridianos. Cuando algo está mal energéticamente, eventualmente se manifiesta en lo físico o emocional.

Este mapa es un diagnóstico completo. Escaneamos tu campo, identificamos dónde hay bloqueos, fugas, o desequilibrios, y te damos un plan concreto para limpiarte y reequilibrarte.`,
    queRecibis: ['Análisis detallado de tus 7 chakras principales', 'Bloqueos específicos identificados con su origen probable', 'Fugas energéticas y cómo sellarlas', 'Plan de limpieza día a día por 21 días', 'Cristales recomendados para cada chakra', 'Ejercicios energéticos diarios', 'Afirmaciones personalizadas'],
    paraQuien: 'Para quienes sienten cansancio inexplicable, bloqueos creativos o emocionales, sensación de estancamiento, o simplemente quieren un "chequeo energético".',
    campos: ['sintomas_fisicos', 'sintomas_emocionales', 'areas_bloqueadas']
  },
  { 
    id: 'pregunta-especifica', 
    nombre: 'Pregunta Específica', 
    icono: '?', 
    runas: 8, 
    treboles: 40, 
    tiempo: '30-45 minutos',
    intro: `A veces no necesitás un análisis extenso. Necesitás UNA respuesta. Esa pregunta que te da vueltas en la cabeza, que no te deja dormir, que necesitás resolver para poder avanzar.

Este servicio es directo y al punto. Hacés tu pregunta, canalizamos la respuesta, te la damos sin vueltas. Sí, no, cómo, cuándo, qué hacer. Claridad pura.`,
    queRecibis: ['Respuesta canalizada directa y clara', 'Pros y contras revelados', 'Consejo de acción específico', 'Timing sugerido (cuándo actuar)', 'Posibles obstáculos y cómo superarlos'],
    paraQuien: 'Para decisiones puntuales: ¿acepto ese trabajo?, ¿termino esta relación?, ¿me mudo?, ¿empiezo ese proyecto? Preguntas concretas, respuestas concretas.',
    campos: ['pregunta', 'contexto', 'opciones', 'deadline']
  }
];

// ═══════════════════════════════════════════════════════════════
// CANJES (con IDs para API)
// ═══════════════════════════════════════════════════════════════

const CANJES = [
  // Cupones de descuento fijo en USD
  { id: 'cupon-5usd', nombre: 'Cupón $5 USD', treboles: 30, desc: 'Válido en cualquier compra', tipo: 'cupon', valor: 5, valorUY: 225 },
  { id: 'cupon-10usd', nombre: 'Cupón $10 USD', treboles: 60, desc: 'Sin mínimo de compra', tipo: 'cupon', valor: 10, valorUY: 450 },
  { id: 'cupon-15usd', nombre: 'Cupón $15 USD', treboles: 100, desc: 'Cualquier guardián', tipo: 'cupon', valor: 15, valorUY: 675 },
  // Envíos
  { id: 'envio-gratis-uy', nombre: 'Envío Gratis UY', treboles: 60, desc: 'Nacional Uruguay', tipo: 'envio' },
  { id: 'envio-gratis-int', nombre: 'Envío Gratis Int.', treboles: 100, desc: 'Internacional DHL', tipo: 'envio-int' },
  // Productos
  { id: 'mini-guardian', nombre: 'Mini Guardián', treboles: 150, desc: 'Pequeño protector (10cm)', tipo: 'producto' },
  { id: 'cristal', nombre: 'Cristal Sorpresa', treboles: 50, desc: 'Cristal energizado', tipo: 'producto' },
  // Lecturas y experiencias con tréboles
  { id: 'tirada-runas-treboles', nombre: 'Tirada de Runas', treboles: 40, desc: 'Sin gastar runas', tipo: 'lectura' },
  { id: 'lectura-energia-treboles', nombre: 'Lectura Energética', treboles: 80, desc: 'Análisis completo', tipo: 'lectura' },
  { id: 'oraculo-mes-treboles', nombre: 'Oráculo del Mes', treboles: 100, desc: 'Guía mensual', tipo: 'lectura' },
  // Círculo con tréboles (menos que un mini duende $70)
  { id: 'circulo-7dias', nombre: '7 días de Círculo', treboles: 25, desc: 'Acceso completo', tipo: 'circulo' },
  { id: 'circulo-30dias', nombre: '30 días de Círculo', treboles: 60, desc: 'Un mes completo', tipo: 'circulo' }
];

// ═══════════════════════════════════════════════════════════════
// MEMBRESÍAS CÍRCULO (info completa desplegable)
// ═══════════════════════════════════════════════════════════════

const MEMBRESIAS = [
  {
    nombre: 'Mensual',
    precio: 9.99,
    precioUY: 450,
    dias: 30,
    url: 'https://duendesuy.10web.cloud/producto/circulo-mensual/',
    beneficios: [
      'Contenido semanal exclusivo',
      '10 runas por mes',
      '2 tréboles por mes',
      '1 tirada de runas gratis/mes',
      '24h acceso anticipado',
      '5% en guardianes nuevos'
    ]
  },
  {
    nombre: 'Trimestral',
    precio: 24.99,
    precioUY: 1150,
    dias: 90,
    ahorro: '17%',
    url: 'https://duendesuy.10web.cloud/producto/circulo-trimestral/',
    beneficios: [
      'Todo lo del plan Mensual',
      '15 runas por mes',
      '4 tréboles por mes',
      '2 tiradas de runas gratis/mes',
      '1 lectura de energía gratis/mes',
      '5% en toda la tienda',
      'Tito te reconoce'
    ]
  },
  {
    nombre: 'Semestral',
    precio: 44.99,
    precioUY: 2050,
    dias: 180,
    ahorro: '25%',
    url: 'https://duendesuy.10web.cloud/producto/circulo-semestral/',
    beneficios: [
      'Todo lo del plan Trimestral',
      '20 runas por mes',
      '6 tréboles por mes',
      '3 tiradas de runas gratis/mes',
      '2 lecturas de energía gratis/mes',
      '1 guía de cristal gratis/mes',
      '48h acceso anticipado',
      '10% en guardianes nuevos'
    ]
  },
  {
    nombre: 'Anual',
    precio: 79.99,
    precioUY: 3650,
    dias: 365,
    ahorro: '33%',
    url: 'https://duendesuy.10web.cloud/producto/circulo-anual/',
    beneficios: [
      'Todo lo del plan Semestral',
      '25 runas por mes',
      '10 tréboles por mes',
      '5 tiradas de runas gratis/mes',
      '3 lecturas de energía gratis/mes',
      '2 guías de cristal gratis/mes',
      '1 Estudio del Alma gratis/año',
      '72h acceso anticipado',
      '10% en TODA la tienda',
      'Sorpresa de aniversario'
    ]
  }
];

const CIRCULO_CONTENIDO = {
  beneficios: [
    { icono: "◈", titulo: "Descuentos exclusivos", desc: "5% a 10% según tu plan. Mensual: 5% guardianes nuevos. Anual: 10% en toda la tienda." },
    { icono: "✦", titulo: "Acceso anticipado", desc: "24h a 72h antes según tu plan. Reservá los guardianes que te llaman antes que nadie." },
    { icono: "ᚱ", titulo: "Runas y tréboles mensuales", desc: "De 10 a 25 runas y 2 a 10 tréboles por mes según tu plan." },
    { icono: "☽", titulo: "Tiradas y lecturas gratis", desc: "1 a 5 tiradas de runas gratis al mes según tu plan." },
    { icono: "❧", titulo: "DIY mágicos mensuales", desc: "Proyectos para hacer en casa: crear tu altar, hacer velas rituales, preparar aguas mágicas, etc." },
    { icono: "◎", titulo: "Meditaciones guiadas", desc: "Audios exclusivos para conectar con tu guardián, limpiar chakras, y más." },
    { icono: "★", titulo: "Contenido semanal", desc: "Cada semana nuevo contenido: mini-lecturas colectivas, tips, información esotérica." },
    { icono: "?", titulo: "Tus preguntas respondidas", desc: "Mandás tus dudas y las respondemos en los contenidos semanales." }
  ],
  temas: [
    "Calendario esotérico completo: Samhain, Yule, Imbolc, Ostara, Beltane, Litha, Lughnasadh, Mabon",
    "Fases lunares: qué hacer en cada una, rituales específicos",
    "Cristales: propiedades de más de 50 piedras, cómo limpiarlas, programarlas y usarlas",
    "Tarot para principiantes: significado de las cartas, tiradas básicas",
    "Runas: historia, significado de cada una, cómo hacer tu propio set",
    "Cómo crear tu altar personal paso a paso",
    "Rituales de protección para el hogar",
    "Trabajo con los 4 elementos: ejercicios prácticos",
    "Conexión con guías espirituales y ancestros",
    "Limpieza energética: técnicas avanzadas",
    "Magia de las velas: colores, días, intenciones",
    "Herbolaria mágica: plantas, usos, preparaciones",
    "Desarrollo de la intuición: ejercicios diarios"
  ]
};

// ═══════════════════════════════════════════════════════════════
// OPCIONES DE DIARIO (expandidas)
// ═══════════════════════════════════════════════════════════════

const TIPOS_DIARIO = [
  { id: 'reflexion', n: 'Reflexión personal', i: '✦', desc: 'Pensamientos, insights, lo que tengas en mente' },
  { id: 'senal', n: 'Recibí una señal', i: '◈', desc: 'Algo que interpretaste como mensaje' },
  { id: 'sueno', n: 'Tuve un sueño', i: '☽', desc: 'Sueños que quieras recordar o interpretar' },
  { id: 'sincronicidad', n: 'Sincronicidad', i: '∞', desc: 'Coincidencias significativas' },
  { id: 'mensaje', n: 'Mensaje de mi guardián', i: '❧', desc: 'Comunicación que percibiste' },
  { id: 'ritual', n: 'Hice un ritual', i: '◎', desc: 'Rituales, limpiezas, meditaciones' },
  { id: 'gratitud', n: 'Gratitud', i: '♥', desc: 'Lo que agradecés hoy' },
  { id: 'intencion', n: 'Intención/manifestación', i: '★', desc: 'Lo que querés atraer' },
  { id: 'sanacion', n: 'Proceso de sanación', i: '✚', desc: 'Avances en tu camino de sanación' },
  { id: 'libre', n: 'Escritura libre', i: '✎', desc: 'Lo que quieras, sin categoría' }
];

// ═══════════════════════════════════════════════════════════════
// SISTEMA DE RANGOS
// ═══════════════════════════════════════════════════════════════

const RANGOS = [
  { id: 'semilla', nombre: 'Semilla Mágica', min: 0, icono: '🌱', color: '#90EE90', beneficio: 'Bienvenida al mundo elemental' },
  { id: 'brote', nombre: 'Brote de Luz', min: 50, icono: '🌿', color: '#98FB98', beneficio: '+5% tréboles extra' },
  { id: 'aprendiz', nombre: 'Aprendiz Elemental', min: 150, icono: '✨', color: '#d4af37', beneficio: '1 tirada gratis' },
  { id: 'guardian', nombre: 'Guardiana del Bosque', min: 300, icono: '🌳', color: '#228B22', beneficio: '10% descuento' },
  { id: 'hechicera', nombre: 'Hechicera de Cristal', min: 500, icono: '💎', color: '#9b59b6', beneficio: 'Acceso 72hs antes' },
  { id: 'alquimista', nombre: 'Alquimista del Alba', min: 800, icono: '⚗️', color: '#e74c3c', beneficio: '15% + 1 lectura/mes' },
  { id: 'maestra', nombre: 'Maestra Elemental', min: 1200, icono: '👑', color: '#f39c12', beneficio: 'Todo + sorpresas' }
];

const getRango = (gastado) => {
  const g = gastado || 0;
  for (let i = RANGOS.length - 1; i >= 0; i--) {
    if (g >= RANGOS[i].min) return RANGOS[i];
  }
  return RANGOS[0];
};

const getSiguienteRango = (gastado) => {
  const g = gastado || 0;
  for (let i = 0; i < RANGOS.length; i++) {
    if (g < RANGOS[i].min) return RANGOS[i];
  }
  return null;
};

// ═══════════════════════════════════════════════════════════════
// MUNDO ELEMENTAL (resumido para espacio)
// ═══════════════════════════════════════════════════════════════

const MUNDO_ELEMENTAL = {
  intro: {
    titulo: "El Reino Elemental",
    texto: `El Reino Elemental es el mundo invisible que coexiste con el nuestro. Es el plano donde habitan los seres de naturaleza, aquellos que los antiguos llamaban "los que están entre mundos". Este plano existe en una frecuencia vibratoria más alta que la nuestra, pero algunas personas sensibles pueden percibirlo.

Cada cultura los ha conocido: los celtas hablaban del Pueblo de las Hadas (Tuatha Dé Danann), los nórdicos de los Alfar (elfos de luz y oscuridad), los griegos de Ninfas y Dríades, los japoneses de los Kami. Todos describían lo mismo: seres de luz que custodian los secretos de la naturaleza y mantienen el equilibrio del mundo.

Los elementales no son "espíritus" en el sentido religioso. Son seres de energía pura, más antiguos que la humanidad, que eligieron este plano de existencia para cumplir funciones específicas. Algunos trabajan con la naturaleza, otros con las emociones humanas, algunos protegen, otros enseñan.

En Duendes del Uruguay trabajamos principalmente con los seres de Tierra - duendes, gnomos y guardianes - porque son los más afines a la vida humana. Han evolucionado durante milenios para entender nuestra psicología, nuestras necesidades, nuestros miedos y sueños. Por eso, cuando un duende elige a un humano, esa conexión es profunda y duradera.

La comunicación con estos seres no requiere dones especiales. Requiere apertura, respeto, y la voluntad de escuchar con el corazón en lugar del oído. Ellos hablan a través de sincronicidades, sueños, sensaciones, y a veces, a través de objetos físicos que han sido canalizados para servir como puentes entre mundos.`
  },
  elementales: [
    {
      elemento: "Tierra",
      nombre: "Duendes, Gnomos y Guardianes",
      icono: "◆",
      color: "#8B4513",
      desc: "Los más cercanos a los humanos. Guardianes de hogares, tesoros y secretos de la naturaleza. Trabajan con la energía de la estabilidad, la protección, la abundancia material y la conexión con el mundo físico.",
      conectar: "Cristales (especialmente cuarzo y turmalina), plantas vivas, figuras canalizadas, jardines, tierra de lugares sagrados.",
      detalles: "Los seres de Tierra son los más densos energéticamente, lo que les permite interactuar más fácilmente con el plano físico. Pueden mover objetos, crear sonidos, y habitar espacios u objetos. Son leales, trabajadores, y tienen un fuerte sentido de la justicia. Les atraen los hogares ordenados, las plantas bien cuidadas, y las personas honestas.",
      ritual: "Para conectar con la energía de Tierra, sentate descalza sobre césped o tierra. Colocá las manos sobre el suelo y visualizá raíces creciendo desde tus palmas hacia el centro de la Tierra. Pedí permiso para conectar y escuchá en silencio."
    },
    {
      elemento: "Agua",
      nombre: "Ondinas, Ninfas y Sirenas",
      icono: "≋",
      color: "#1E90FF",
      desc: "Trabajan con las emociones, la intuición, los sueños y el flujo de la vida. Son los sanadores del mundo elemental, capaces de limpiar bloqueos emocionales profundos.",
      conectar: "Agua bendecida, fuentes, rituales de luna llena, baños rituales, lágrimas ofrecidas con intención.",
      detalles: "Los seres de Agua son fluidos, cambiantes, profundamente empáticos. Pueden sentir las emociones humanas a distancia y a menudo son atraídos por personas que están pasando por procesos emocionales intensos. Son los más difíciles de 'fijar' porque su naturaleza es el cambio constante.",
      ritual: "Llená un vaso de cristal con agua pura bajo la luna llena. Sostenelo entre tus manos y hablá al agua sobre lo que necesitás sanar emocionalmente. Bebé el agua al amanecer siguiente."
    },
    {
      elemento: "Fuego",
      nombre: "Salamandras y Djinn",
      icono: "🔥",
      color: "#FF4500",
      desc: "Pura energía transformadora. Transmutan lo negativo en positivo, destruyen para crear, purifican lo corrupto. Son los más poderosos pero también los más volátiles.",
      conectar: "Velas encendidas con intención, incienso, luz solar directa, hogueras rituales, ceniza de rituales pasados.",
      detalles: "Los seres de Fuego son intensos, apasionados, y no conocen los grises: todo es blanco o negro para ellos. Pueden ser increíblemente protectores pero también peligrosos si se les falta el respeto. Requieren trabajo con precaución y experiencia.",
      ritual: "Encendé una vela roja o naranja. Mirá fijamente la llama durante 5 minutos sin parpadear. Visualizá todo lo que querés transmutar siendo consumido por el fuego. Cuando la vela se consuma, el proceso estará completo."
    },
    {
      elemento: "Aire",
      nombre: "Silfos, Hadas y Musas",
      icono: "❋",
      color: "#87CEEB",
      desc: "Mensajeros entre mundos, portadores de inspiración, claridad mental y comunicación. Son los más etéreos y difíciles de percibir, pero los más accesibles para la comunicación.",
      conectar: "Viento, plumas (especialmente encontradas), campanas de viento, música, incienso elevándose, escritura automática.",
      detalles: "Los seres de Aire son curiosos, juguetones, y extremadamente rápidos. Pueden traer mensajes de otras dimensiones, inspirar obras de arte, y desbloquear la creatividad. Les encantan los lugares altos, la música, y las personas que se ríen seguido.",
      ritual: "En un día ventoso, salí a un lugar abierto. Abrí los brazos y dejá que el viento te envuelva. Hacé una pregunta en voz alta y prestá atención a cualquier pensamiento, imagen o sensación que llegue en los siguientes minutos."
    }
  ],
  tiposDuendes: [
    {
      tipo: "Duendes del Hogar",
      desc: "Protegen casas y familias. Se sienten atraídos por hogares donde hay amor, niños, o mascotas. Son los más comunes y los más fáciles de percibir.",
      señales: "Objetos que se mueven, puertas que se abren solas, mascotas mirando 'a la nada', sensación de compañía cuando estás sola."
    },
    {
      tipo: "Duendes de Abundancia",
      desc: "Atraen prosperidad, oportunidades, y flujo de dinero. No dan riqueza instantánea sino que abren caminos y multiplican esfuerzos.",
      señales: "Monedas que aparecen en lugares inesperados, ideas de negocio que surgen de la nada, 'coincidencias' laborales."
    },
    {
      tipo: "Duendes Sanadores",
      desc: "Trabajan con la salud física y emocional. Alivian dolores, aceleran recuperaciones, y ayudan a soltar traumas.",
      señales: "Sueños reveladores sobre salud, intuiciones sobre qué remedio usar, sensación de calor o cosquilleo en zonas afectadas."
    },
    {
      tipo: "Duendes del Bosque",
      desc: "Los más antiguos y poderosos. Custodian espacios naturales y tienen conexión directa con la sabiduría de la Tierra.",
      señales: "Sensación de ser observada en el bosque, caminos que 'aparecen', animales que se acercan sin miedo."
    },
    {
      tipo: "Duendes Traviesos (Pucks)",
      desc: "Ni buenos ni malos: caóticos. Les gusta el desorden, las bromas, y poner a prueba a los humanos. Con respeto, se vuelven aliados.",
      señales: "Llaves que desaparecen y reaparecen, risas que se escuchan sin fuente, electrónicos que fallan."
    }
  ],
  duendes: {
    titulo: "Los Duendes",
    texto: `Los duendes son seres de energía que han elegido vibrar cerca del plano físico. A diferencia de otros elementales que prefieren mantener distancia de los humanos, los duendes han evolucionado durante milenios desarrollando un interés genuino por nuestra especie.

Pueden manifestarse de múltiples formas: moviendo objetos, creando sonidos sutiles, enviando señales a través de sincronicidades, y - lo más importante para nosotros - habitando objetos físicos que han sido canalizados específicamente para servir de puente entre mundos.

Cuando un duende habita un guardián canalizado, no está "atrapado". Elige estar ahí porque ha encontrado a un humano con quien quiere trabajar. Es una relación simbiótica: el duende ofrece protección, guía y energía; el humano ofrece un ancla en el mundo físico, cuidados, y compañía.

Tienen personalidades definidas: algunos son serios y protectores, otros traviesos y juguetones, algunos sabios y antiguos, otros jóvenes y curiosos. Pero todos comparten ciertos rasgos: lealtad inquebrantable hacia quienes los tratan bien, conexión especial con niños y animales (que pueden verlos más fácilmente), y un sentido del humor que a veces puede parecer extraño a los humanos.

Los duendes no piden adoración ni sacrificios. Piden respeto, comunicación, y cuidados básicos. A cambio, ofrecen algo invaluable: un compañero del otro lado del velo, un guardián que vela por vos incluso cuando dormís.`
  },
  signos: [
    { signo: "Un duende te eligió", señales: ["Sentís atracción inexplicable hacia una figura", "Sueños recurrentes con duendes o gnomos", "Sincronicidades relacionadas con duendes (verlos en todas partes)", "Sensación de 'reconocimiento' al ver cierto guardián"] },
    { signo: "Tu duende está activo", señales: ["Objetos que se mueven solos", "Sonidos inexplicables (campanitas, pasos)", "Sueños muy vívidos y significativos", "Mascotas que miran hacia tu altar", "Velas que chisporrotean sin corriente de aire"] },
    { signo: "Tu duende necesita atención", señales: ["Sensación de que 'algo falta' en casa", "Racha de mala suerte o cosas que salen mal", "Te olvidás de hablarle por mucho tiempo", "Intuiciones que ignoraste repetidamente"] }
  ],
  alquimia: {
    titulo: "Alquimia y Piriápolis",
    texto: `La alquimia no era solo convertir plomo en oro - eso era una metáfora. Era una ciencia espiritual completa que entendía la conexión entre todos los niveles de existencia: elementos, planetas, metales, partes del cuerpo, emociones humanas, y seres invisibles.

Los alquimistas medievales sabían que ciertos lugares de la Tierra tenían configuraciones energéticas especiales, vórtices donde el velo entre mundos era más delgado. Buscaban estos lugares para establecer sus laboratorios porque ahí la transmutación (de cualquier tipo) era más fácil.

Francisco Piria, fundador de Piriápolis, era un alquimista iniciado. Eligió este punto específico de la costa uruguaya por su configuración única: el encuentro del mar (Agua) con las sierras (Tierra), las corrientes de aire constantes (Aire), y la energía solar particular de esta latitud (Fuego). Los cuatro elementos en perfecto equilibrio.

La disposición de Piriápolis no es casualidad: el Castillo de Piria, el Argentino Hotel, la Rambla, la Virgen de los Pescadores... todo está ubicado siguiendo principios alquímicos de geometría sagrada. Es un gran círculo mágico trazado en la tierra.

Es acá, en este vórtice energético, donde Gabriel canaliza a los guardianes. La energía del lugar facilita la conexión con el Reino Elemental, permitiendo que cada figura se convierta en un verdadero puente entre mundos.

Cuando recibís un guardián canalizado en Piriápolis, no solo recibís un objeto hermoso. Recibís un fragmento de esta energía ancestral, un pedacito de este lugar mágico que ahora vivirá en tu hogar.`
  },
  rituales: [
    { nombre: "Ritual de Conexión Elemental", pasos: ["Elegí el elemento con el que querés trabajar", "Creá un espacio con símbolos de ese elemento", "Encendé incienso y una vela del color correspondiente", "Meditá 10 minutos visualizando el elemento", "Pedí permiso para conectar y escuchá"], duracion: "20-30 minutos" },
    { nombre: "Ritual de Presentación al Guardián", pasos: ["Lavá tus manos con agua y sal marina", "Encendé vela blanca o dorada", "Abrí el guardián con reverencia, sin prisa", "Presentate: nombre, intención, qué esperás", "Escuchá en silencio por 5 minutos", "Agradecé y colocalo en su lugar"], duracion: "15-20 minutos" },
    { nombre: "Ritual de Luna Llena", pasos: ["Sacá tu guardián a la luz de la luna", "Limpialo con humo de salvia", "Hablale sobre el mes que pasó", "Hacé tres pedidos para el mes que viene", "Dejalo bajo la luna hasta el amanecer"], duracion: "15 minutos + noche" }
  ]
};

const CUIDADOS = [
  { titulo: "Ritual de Bienvenida", texto: "Dejalo reposar unas horas, luego en calma: lavá tus manos con sal, encendé vela blanca, abrilo con reverencia, presentate y escuchá.", items: ["Lavá manos con agua y sal", "Encendé vela blanca o dorada", "Abrí con reverencia", "Presentate y escuchá en silencio"] },
  { titulo: "Espacio Sagrado", texto: "Necesita un lugar propio, elevado, limpio. Que pueda 'ver' lo que protege.", items: ["Evitá ruido y tránsito", "Nunca en el piso", "Protectores: cerca de la entrada", "Abundancia: cerca de donde manejás dinero"] },
  { titulo: "Limpieza Energética Semanal", texto: "Absorbe energías densas para protegerte. Necesita limpieza regular.", items: ["Humo de salvia o palo santo", "Luz de luna llena", "Agua con sal marina (rociar)", "Sonido de cuenco o campana"] },
  { titulo: "Comunicación", texto: "Hablale diariamente, en voz alta o mental.", items: ["Buenos días al levantarte", "Pedí protección antes de salir", "Agradecé cada noche", "Celebrá logros con él"] },
  { titulo: "Ofrendas de Alta Vibración", texto: "Fortalecen el vínculo. Cosas naturales y de alta energía.", items: ["Flores frescas", "Cristales pequeños", "Agua fresca", "Luz de vela", "Incienso de calidad"] },
  { titulo: "⚠️ QUÉ NO HACER", texto: "Esto baja la vibración o rompe el vínculo.", items: ["NUNCA dulces ni azúcar", "NUNCA alcohol", "No guardarlo en cajones", "No exponerlo a peleas", "No prestarlo", "No ignorarlo mucho tiempo"], esProhibido: true }
];

const CRISTALES = [
  { nombre: "Amatista", color: "#9b59b6", props: "Intuición, paz, protección espiritual", cuidado: "Agua y luna. Evitar sol." },
  { nombre: "Cuarzo Rosa", color: "#f8bbd9", props: "Amor, sanación emocional", cuidado: "Solo luna. Muy sensible al sol." },
  { nombre: "Citrino", color: "#f4d03f", props: "Abundancia, alegría", cuidado: "Auto-limpiante. Carga al sol." },
  { nombre: "Turmalina Negra", color: "#2c3e50", props: "Protección máxima", cuidado: "Enterrar en sal o tierra." },
  { nombre: "Labradorita", color: "#3498db", props: "Magia, transformación", cuidado: "Bajo las estrellas." },
  { nombre: "Cuarzo Transparente", color: "#ecf0f1", props: "Amplificador universal", cuidado: "Acepta todo. Limpiar seguido." },
  { nombre: "Selenita", color: "#f5f5f5", props: "Limpieza, conexión angélica", cuidado: "NUNCA mojar. Solo luna o sonido." },
  { nombre: "Ojo de Tigre", color: "#b8860b", props: "Coraje, prosperidad", cuidado: "Sol de mañana." }
];

// ═══════════════════════════════════════════════════════════════
// COMPONENTE PRINCIPAL
// ═══════════════════════════════════════════════════════════════

export default function MiMagia() {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [seccion, setSeccion] = useState('inicio');
  const [onboarding, setOnboarding] = useState(false);
  const [chatAbierto, setChatAbierto] = useState(false);
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [token, setToken] = useState('');
  const [pais, setPais] = useState('UY');

  useEffect(() => { cargarUsuario(); detectarPais(); }, []);

  const detectarPais = async () => {
    try { const res = await fetch('https://ipapi.co/json/'); const data = await res.json(); setPais(data.country_code || 'UY'); } catch(e) { setPais('UY'); }
  };

  const cargarUsuario = async () => {
    const params = new URLSearchParams(window.location.search);
    const t = params.get('token');
    if (!t) { window.location.href = 'https://duendesuy.10web.cloud'; return; }
    setToken(t);
    try {
      const res = await fetch(`${API_BASE}/api/mi-magia/usuario?token=${t}`);
      const data = await res.json();
      if (data.success && data.usuario) {
        setUsuario(data.usuario);
        if (!data.usuario.onboardingCompleto) setOnboarding(true);
      } else { window.location.href = 'https://duendesuy.10web.cloud'; }
    } catch (e) { console.error(e); }
    setCargando(false);
  };

  if (cargando) return <Carga />;
  if (onboarding) return <Onboarding usuario={usuario} token={token} onDone={(d) => { setUsuario({...usuario, ...d, onboardingCompleto: true, runas: 50}); setOnboarding(false); }} />;

  const renderSeccion = () => {
    switch(seccion) {
      case 'inicio': return <Inicio usuario={usuario} ir={setSeccion} />;
      case 'canalizaciones': return <Canalizaciones usuario={usuario} />;
      case 'jardin': return <Jardin usuario={usuario} setUsuario={setUsuario} pais={pais} token={token} />;
      case 'experiencias': return <SeccionExperiencias usuario={usuario} setUsuario={setUsuario} />;
      case 'experiencias_catalogo': return <CatalogoExperiencias usuario={usuario} setUsuario={setUsuario} />;
      case 'regalos': return <Regalos ir={setSeccion} />;
      case 'mundo': return <MundoSec />;
      case 'cuidados': return <CuidadosSec />;
      case 'cristales': return <CristalesSec />;
      case 'guia_cristales': return <GuiaCristales usuario={usuario} />;
      case 'test_elemental': return <TestElemental usuario={usuario} onComplete={(r) => setUsuario({...usuario, elemento: r.elemento_principal})} />;
      case 'cosmos': return <CosmosMes usuario={usuario} />;
      case 'circulo': return <CirculoSec usuario={usuario} setUsuario={setUsuario} token={token} pais={pais} />;
      case 'grimorio': return <GrimorioSec usuario={usuario} token={token} setUsuario={setUsuario} />;
      case 'foro': return <ForoSec usuario={usuario} setUsuario={setUsuario} />;
      case 'utilidades': return <UtilidadesSec usuario={usuario} />;
      case 'faq': return <FaqSec />;
      default: return <Inicio usuario={usuario} ir={setSeccion} />;
    }
  };

  return (
    <div className="app">
      <style jsx global>{estilos}</style>
      <header className="header">
        <div className="logo"><span>✦</span> MI MAGIA</div>
        <div className="user-info">Bienvenid{usuario?.pronombre === 'el' ? 'o' : 'a'}, {usuario?.nombrePreferido}</div>
        <div className="hstats"><span>☘ {usuario?.treboles || 0}</span><span>ᚱ {usuario?.runas || 0}</span></div>
        <button className="menu-btn" onClick={() => setMenuAbierto(!menuAbierto)}><span></span><span></span><span></span></button>
      </header>
      
      {menuAbierto && <div className="nav-overlay" onClick={() => setMenuAbierto(false)} />}
      <nav className={`nav ${menuAbierto ? 'abierto' : ''}`}>
        {[['inicio','◇','Inicio'],['canalizaciones','♦','Mis Canalizaciones'],['jardin','☘','Jardín Mágico'],['experiencias','✦','Experiencias'],['experiencias_catalogo','ᚱ','Catálogo Runas'],['regalos','❤','Regalos']].map(([k,i,t]) =>
          <button key={k} className={`nav-item ${seccion===k?'activo':''}`} onClick={() => {setSeccion(k);setMenuAbierto(false);}}><span className="nav-i">{i}</span>{t}</button>
        )}
        <div className="nav-sep">El Mundo Elemental</div>
        {[['test_elemental','◈','Tu Elemento'],['mundo','❂','Reino Elemental'],['cuidados','❧','Cuidados'],['guia_cristales','💎','Guía Cristales']].map(([k,i,t]) =>
          <button key={k} className={`nav-item ${seccion===k?'activo':''}`} onClick={() => {setSeccion(k);setMenuAbierto(false);}}><span className="nav-i">{i}</span>{t}</button>
        )}
        <div className="nav-sep">Tu Espacio</div>
        {[['circulo','★','Círculo'],['cosmos','☽','Cosmos del Mes'],['grimorio','▣','Grimorio'],['foro','💬','Foro Mágico']].map(([k,i,t]) =>
          <button key={k} className={`nav-item ${seccion===k?'activo':''}`} onClick={() => {setSeccion(k);setMenuAbierto(false);}}><span className="nav-i">{i}</span>{t}</button>
        )}
        <div className="nav-sep">Recursos</div>
        {[['utilidades','⚡','Utilidades'],['faq','❓','FAQ Duendes']].map(([k,i,t]) =>
          <button key={k} className={`nav-item ${seccion===k?'activo':''}`} onClick={() => {setSeccion(k);setMenuAbierto(false);}}><span className="nav-i">{i}</span>{t}</button>
        )}
        <a href="https://duendesuy.10web.cloud/shop/" target="_blank" rel="noopener" className="nav-volver">↗ Ir a la tienda</a>
      </nav>
      
      <main className="contenido">{renderSeccion()}</main>
      <Tito usuario={usuario} abierto={chatAbierto} setAbierto={setChatAbierto} />
    </div>
  );
}

function Carga() {
  return <div className="carga"><style jsx global>{estilos}</style><div className="carga-c"><div className="carga-runa">ᚱ</div><p>Preparando tu magia...</p></div></div>;
}

function Onboarding({ usuario, token, onDone }) {
  const [paso, setPaso] = useState(1);
  const [datos, setDatos] = useState({ nombrePreferido: usuario?.nombre || '', pronombre: 'ella', intereses: [], moneda: 'USD', cumpleanos: '' });
  const ints = ['Protección', 'Abundancia', 'Amor', 'Sanación', 'Espiritualidad', 'Paz mental', 'Creatividad', 'Autoconocimiento'];
  
  const guardar = async () => {
    try { await fetch(`${API_BASE}/api/mi-magia/onboarding`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ token, ...datos }) }); } catch(e) {}
    onDone(datos);
  };
  
  return (
    <div className="onb"><style jsx global>{estilos}</style>
      <div className="onb-card">
        <div className="onb-header"><span>✦</span><h2>¡Bienvenida a Mi Magia!</h2><p>Personalizá tu espacio en 5 pasos</p></div>
        <div className="onb-prog">{[1,2,3,4,5].map(p => <div key={p} className={`prog-p ${paso >= p ? 'act' : ''}`}>{p}</div>)}</div>
        
        {paso === 1 && (
          <div className="onb-paso">
            <h3>¿Cómo te llamamos?</h3>
            <p className="onb-sub">Este nombre aparecerá en tus lecturas y comunicaciones</p>
            <input type="text" value={datos.nombrePreferido} onChange={e => setDatos({...datos, nombrePreferido: e.target.value})} placeholder="Tu nombre preferido" />
          </div>
        )}
        
        {paso === 2 && (
          <div className="onb-paso">
            <h3>¿Qué pronombre preferís?</h3>
            <p className="onb-sub">Para personalizar los mensajes</p>
            <div className="prons">
              {['ella', 'el', 'elle'].map(p => (
                <button key={p} className={`pron ${datos.pronombre === p ? 'act' : ''}`} onClick={() => setDatos({...datos, pronombre: p})}>
                  {p === 'ella' ? 'Ella' : p === 'el' ? 'Él' : 'Elle'}
                </button>
              ))}
            </div>
          </div>
        )}
        
        {paso === 3 && (
          <div className="onb-paso">
            <h3>¿En qué moneda preferís ver los precios?</h3>
            <p className="onb-sub">Podés cambiarlo después en configuración</p>
            <div className="monedas">
              <button className={`moneda ${datos.moneda === 'UYU' ? 'act' : ''}`} onClick={() => setDatos({...datos, moneda: 'UYU'})}>
                <span>🇺🇾</span>
                <strong>Pesos Uruguayos</strong>
                <small>UYU $</small>
              </button>
              <button className={`moneda ${datos.moneda === 'USD' ? 'act' : ''}`} onClick={() => setDatos({...datos, moneda: 'USD'})}>
                <span>🌎</span>
                <strong>Dólares</strong>
                <small>USD $</small>
              </button>
            </div>
          </div>
        )}
        
        {paso === 4 && (
          <div className="onb-paso">
            <h3>¿Qué te interesa?</h3>
            <p className="onb-sub">Elegí todo lo que resuene (opcional)</p>
            <div className="ints">
              {ints.map(i => (
                <button key={i} className={`int ${datos.intereses.includes(i) ? 'act' : ''}`} onClick={() => setDatos({...datos, intereses: datos.intereses.includes(i) ? datos.intereses.filter(x=>x!==i) : [...datos.intereses, i]})}>
                  {i}
                </button>
              ))}
            </div>
          </div>
        )}
        
        {paso === 5 && (
          <div className="onb-paso">
            <h3>¡Todo listo!</h3>
            <div className="regalo-box">
              <span>🎁</span>
              <p>Tu regalo de bienvenida:</p>
              <strong>50 Runas de Poder</strong>
              <small>Para que explores las experiencias mágicas</small>
            </div>
            <div className="resumen-onb">
              <p>Vas a entrar como <strong>{datos.nombrePreferido}</strong></p>
              <p>Precios en <strong>{datos.moneda === 'UYU' ? 'Pesos Uruguayos' : 'Dólares'}</strong></p>
            </div>
          </div>
        )}
        
        <div className="onb-btns">
          {paso > 1 && <button className="btn-sec" onClick={() => setPaso(paso-1)}>Atrás</button>}
          {paso < 5 && <button className="btn-pri" onClick={() => setPaso(paso+1)} disabled={paso === 1 && !datos.nombrePreferido}>Continuar</button>}
          {paso === 5 && <button className="btn-gold" onClick={guardar}>Entrar a Mi Magia ✦</button>}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// INICIO
// ═══════════════════════════════════════════════════════════════

function Inicio({ usuario, ir }) {
  const rango = getRango(usuario?.gastado);
  const siguiente = getSiguienteRango(usuario?.gastado);
  const progreso = siguiente ? ((usuario?.gastado || 0) / siguiente.min) * 100 : 100;
  
  return (
    <div className="sec">
      <div className="banner">
        <div className="banner-rango">
          <span className="rango-icono">{rango.icono}</span>
          <div className="rango-info">
            <span className="rango-nombre">{rango.nombre}</span>
            <span className="rango-ben">{rango.beneficio}</span>
          </div>
        </div>
        <h1>Bienvenid{usuario?.pronombre === 'el' ? 'o' : 'a'} de vuelta, {usuario?.nombrePreferido}</h1>
        <p>Tu santuario personal donde la magia cobra vida.</p>
        {siguiente && (
          <div className="progreso-rango">
            <div className="progreso-bar"><div className="progreso-fill" style={{width: `${Math.min(progreso, 100)}%`}}></div></div>
            <small>${usuario?.gastado || 0} / ${siguiente.min} para {siguiente.icono} {siguiente.nombre}</small>
          </div>
        )}
      </div>

      {/* SEÑAL DEL DÍA - Mensaje personalizado diario */}
      <SenalDelDia usuario={usuario} />

      <div className="stats-g">
        <div className="stat-c" onClick={() => ir('canalizaciones')}><div className="stat-n">{(usuario?.guardianes?.length || 0) + (usuario?.lecturas?.length || 0)}</div><div className="stat-t">Canalizaciones</div></div>
        <div className="stat-c" onClick={() => ir('jardin')}><div className="stat-n">{usuario?.treboles || 0}</div><div className="stat-t">Tréboles</div></div>
        <div className="stat-c" onClick={() => ir('jardin')}><div className="stat-n">{usuario?.runas || 0}</div><div className="stat-t">Runas</div></div>
        <div className="stat-c" onClick={() => ir('grimorio')}><div className="stat-n">{usuario?.diario?.length || 0}</div><div className="stat-t">Entradas</div></div>
      </div>

      <div className="accesos-g">
        <button className="acceso" onClick={() => ir('experiencias')}><span>✦</span><strong>Experiencias Mágicas</strong><small>Tiradas, lecturas, registros akáshicos</small></button>
        <button className="acceso" onClick={() => ir('mundo')}><span>◈</span><strong>Reino Elemental</strong><small>Duendes, hadas, elementales, alquimia</small></button>
        <button className="acceso" onClick={() => ir('regalos')}><span>❤</span><strong>Regalá Magia</strong><small>Experiencias, guardianes, runas</small></button>
      </div>
      
      {!usuario?.esCirculo && (
        <div className="banner-circ" onClick={() => ir('circulo')}><span>★</span><div><h3>Círculo de Duendes</h3><p>15 días gratis. Descuentos, lecturas mensuales, contenido exclusivo.</p></div><span className="badge">PROBAR</span></div>
      )}
      
      <div className="info-box">
        <h3>¿Cómo funciona Mi Magia?</h3>
        <div className="info-grid">
          <div><span>☘</span><h4>Tréboles</h4><p>Se ganan comprando ({usuario?.moneda === 'UYU' ? '$400 UYU' : '$10 USD'} = 1). Canjealos por descuentos, envíos gratis, regalos.</p></div>
          <div><span>ᚱ</span><h4>Runas</h4><p>Se compran o ganan. Para experiencias mágicas personalizadas.</p></div>
          <div><span>▣</span><h4>Grimorio</h4><p>Tus lecturas guardadas para siempre + tu diario espiritual.</p></div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// MIS CANALIZACIONES (antes Santuario)
// ═══════════════════════════════════════════════════════════════

function Canalizaciones({ usuario }) {
  const [tab, setTab] = useState('guardianes');
  
  const guardianes = usuario?.guardianes || [];
  const talismanes = usuario?.talismanes || [];
  const libros = usuario?.libros || [];
  const lecturas = usuario?.lecturas || [];
  const regalosHechos = usuario?.regalosHechos || [];
  const regalosRecibidos = usuario?.regalosRecibidos || [];
  
  return (
    <div className="sec">
      <div className="sec-head"><h1>Mis Canalizaciones</h1><p>Todo lo que ha llegado a tu vida desde el mundo elemental.</p></div>
      
      <div className="tabs-h">
        {[['guardianes','◆','Guardianes'],['talismanes','✧','Talismanes'],['libros','📖','Libros'],['lecturas','✦','Lecturas'],['regalosH','❤↗','Regalos Hechos'],['regalosR','❤↙','Regalos Recibidos']].map(([k,i,t]) => 
          <button key={k} className={`tab ${tab===k?'act':''}`} onClick={() => setTab(k)}>{i} {t}</button>
        )}
      </div>
      
      {tab === 'guardianes' && (
        <div className="cana-content">
          {guardianes.length > 0 ? (
            <div className="items-grid">{guardianes.map((g,i) => <div key={i} className="item-card"><div className="item-img">{g.imagen ? <img src={g.imagen} alt={g.nombre} /> : <span>◆</span>}</div><h4>{g.nombre}</h4><small>{g.tipo} • {g.fecha}</small></div>)}</div>
          ) : (
            <div className="empty-tab">
              <span>◆</span>
              <h3>Tus guardianes te esperan</h3>
              <p>Cuando adoptes tu primer guardián, aparecerá acá con toda su información, su historia y cómo cuidarlo.</p>
              <a href="https://duendesuy.10web.cloud/shop/" target="_blank" rel="noopener" className="btn-gold">Explorar Guardianes ↗</a>
            </div>
          )}
        </div>
      )}
      
      {tab === 'talismanes' && (
        <div className="cana-content">
          {talismanes.length > 0 ? (
            <div className="items-grid">{talismanes.map((t,i) => <div key={i} className="item-card"><h4>{t.nombre}</h4><small>{t.fecha}</small></div>)}</div>
          ) : (
            <div className="empty-tab"><span>✧</span><h3>Sin talismanes aún</h3><p>Los talismanes son piezas especiales con propósitos específicos.</p></div>
          )}
        </div>
      )}
      
      {tab === 'libros' && (
        <div className="cana-content">
          {libros.length > 0 ? (
            <div className="items-grid">{libros.map((l,i) => <div key={i} className="item-card"><h4>{l.nombre}</h4><small>{l.fecha}</small></div>)}</div>
          ) : (
            <div className="empty-tab"><span>📖</span><h3>Sin libros digitales</h3><p>Próximamente tendremos guías y libros digitales sobre el mundo elemental.</p></div>
          )}
        </div>
      )}
      
      {tab === 'lecturas' && (
        <div className="cana-content">
          {lecturas.length > 0 ? (
            <div className="lecturas-list">{lecturas.map((l,i) => <div key={i} className="lectura-item"><span className="lec-fecha">{l.fecha}</span><h4>{l.tipo}</h4><p>{l.resumen || l.contenido?.substring(0, 200)}...</p><button className="btn-sec">Ver completa</button></div>)}</div>
          ) : (
            <div className="empty-tab"><span>✦</span><h3>Sin lecturas aún</h3><p>Cuando solicites una experiencia mágica, quedará guardada acá para siempre. Podrás releerla cuando quieras.</p></div>
          )}
        </div>
      )}
      
      {tab === 'regalosH' && (
        <div className="cana-content">
          {regalosHechos.length > 0 ? (
            <div className="items-grid">{regalosHechos.map((r,i) => <div key={i} className="item-card"><h4>{r.tipo}</h4><small>Para: {r.para} • {r.fecha}</small></div>)}</div>
          ) : (
            <div className="empty-tab"><span>❤↗</span><h3>No has regalado aún</h3><p>Cuando regales una experiencia o guardián, quedará registrado acá.</p></div>
          )}
        </div>
      )}
      
      {tab === 'regalosR' && (
        <div className="cana-content">
          {regalosRecibidos.length > 0 ? (
            <div className="items-grid">{regalosRecibidos.map((r,i) => <div key={i} className="item-card"><h4>{r.tipo}</h4><small>De: {r.de} • {r.fecha}</small></div>)}</div>
          ) : (
            <div className="empty-tab"><span>❤↙</span><h3>No has recibido regalos</h3><p>Si alguien te regala una experiencia, aparecerá acá.</p></div>
          )}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// JARDÍN MÁGICO (canjes funcionales + packs runas)
// ═══════════════════════════════════════════════════════════════

function Jardin({ usuario, setUsuario, pais, token }) {
  const [canjeando, setCanjeando] = useState(null);
  const [msg, setMsg] = useState(null);
  const esUY = pais === 'UY';
  
  const canjear = async (canje) => {
    if ((usuario?.treboles || 0) < canje.treboles) return;
    setCanjeando(canje.id); setMsg(null);
    try {
      const res = await fetch(`${API_BASE}/api/mi-magia/canjear`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: usuario.email, canjeId: canje.id })
      });
      const data = await res.json();
      if (data.success) {
        setUsuario({ ...usuario, treboles: (usuario.treboles || 0) - canje.treboles });
        if (data.cupon) {
          setMsg({ t: 'ok', m: `¡Canjeado! Tu cupón: ${data.cupon}. Te llegará por email también.` });
        } else {
          setMsg({ t: 'ok', m: '¡Canjeado! Nos pondremos en contacto para coordinar.' });
        }
      } else {
        setMsg({ t: 'error', m: data.error || 'Error al canjear' });
      }
    } catch(e) {
      setMsg({ t: 'error', m: 'Error de conexión' });
    }
    setCanjeando(null);
  };
  
  return (
    <div className="sec">
      <div className="sec-head"><h1>Jardín Mágico</h1><p>Tu riqueza en el mundo elemental.</p></div>
      
      <div className="balances">
        <div className="bal-card">
          <span className="bal-icon">☘</span>
          <div className="bal-info">
            <div className="bal-num">{usuario?.treboles || 0}</div>
            <div className="bal-label">Tréboles</div>
          </div>
        </div>
        <div className="bal-card">
          <span className="bal-icon">ᚱ</span>
          <div className="bal-info">
            <div className="bal-num">{usuario?.runas || 0}</div>
            <div className="bal-label">Runas de Poder</div>
          </div>
        </div>
      </div>
      
      <div className="explicacion-box">
        <h3>☘ ¿Cómo funcionan los Tréboles?</h3>
        <p><strong>{esUY ? '$400 UYU' : '$10 USD'} = 1 trébol.</strong> Se ganan automáticamente con cada compra.</p>
        <p>Canjealos por descuentos, envíos gratis, productos y hasta lecturas. Son tu recompensa por ser parte de la tribu.</p>
      </div>
      
      {msg && <div className={`msg ${msg.t}`}>{msg.m}</div>}
      
      <h2 className="sec-titulo">Canjeá tus Tréboles</h2>
      <div className="canjes-grid">
        {CANJES.map(c => {
          const disponible = (usuario?.treboles || 0) >= c.treboles;
          const esteCanjeando = canjeando === c.id;
          return (
            <div key={c.id} className={`canje-card ${disponible ? '' : 'bloq'}`}>
              <div className="canje-cost">☘ {c.treboles}</div>
              <h4>{c.nombre}</h4>
              <p>{c.desc}</p>
              <button 
                className="btn-canjear" 
                disabled={!disponible || esteCanjeando}
                onClick={() => canjear(c)}
              >
                {esteCanjeando ? 'Canjeando...' : disponible ? 'Canjear' : `Necesitás ${c.treboles}`}
              </button>
            </div>
          );
        })}
      </div>
      
      <div className="explicacion-box">
        <h3>ᚱ ¿Cómo funcionan las Runas de Poder?</h3>
        <p>Las Runas son tu moneda para las <strong>experiencias mágicas</strong>: tiradas, lecturas del alma, registros akáshicos y más.</p>
        <p>Podés comprarlas en packs, o ganarlas uniéndote al Círculo (recibís 50 de regalo + beneficios mensuales).</p>
      </div>
      
      <h2 className="sec-titulo">Packs de Runas</h2>
      <div className="packs-grid">
        {PACKS_RUNAS.map(p => (
          <div key={p.nombre} className="pack-card">
            <div className="pack-runas">{p.runas} ᚱ</div>
            <h4>{p.nombre}</h4>
            <p>{p.desc}</p>
            <div className="pack-precio">${p.precio} USD</div>
            <a href={p.url} target="_blank" rel="noopener" className="btn-gold-sm">Comprar ↗</a>
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// EXPERIENCIAS (con intro humana completa)
// ═══════════════════════════════════════════════════════════════

function SeccionExperiencias({ usuario, setUsuario }) {
  const [selExp, setSelExp] = useState(null);
  const [vista, setVista] = useState('info'); // 'info' o 'form'
  const [form, setForm] = useState({});
  const [esRegalo, setEsRegalo] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [msg, setMsg] = useState(null);
  
  const solicitar = async () => {
    if ((usuario?.runas || 0) < selExp.runas) { setMsg({ t: 'error', m: `Necesitás ${selExp.runas} Runas.` }); return; }
    setEnviando(true); setMsg(null);
    try {
      const payload = esRegalo 
        ? { emailRegalo: form.email_regalo, nombreRegalo: form.nombre_regalo, mensajeRegalo: form.mensaje_regalo, tipo: selExp.id, emailComprador: usuario.email, esRegalo: true }
        : { email: usuario.email, tipo: selExp.id, datos: form, esRegalo: false };
      
      const res = await fetch(`${API_BASE}/api/experiencias/solicitar`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const data = await res.json();
      if (data.success) { 
        setMsg({ t: 'ok', m: esRegalo ? '¡Regalo enviado! La persona recibirá acceso por email.' : '¡Solicitada! Recibirás tu lectura por email.' }); 
        setUsuario({ ...usuario, runas: (usuario.runas || 0) - selExp.runas }); 
        setTimeout(() => { setSelExp(null); setVista('info'); setForm({}); setEsRegalo(false); setMsg(null); }, 3000);
      } else { setMsg({ t: 'error', m: data.error || 'Error' }); }
    } catch(e) { setMsg({ t: 'error', m: 'Error de conexión' }); }
    setEnviando(false);
  };
  
  if (selExp) {
    return (
      <div className="sec">
        <button className="btn-back" onClick={() => { setSelExp(null); setVista('info'); setForm({}); }}>← Volver a experiencias</button>
        
        {vista === 'info' && (
          <div className="exp-detalle">
            <div className="exp-d-header">
              <span className="exp-d-icon">{selExp.icono}</span>
              <h1>{selExp.nombre}</h1>
              <div className="exp-d-meta"><span>⏱ {selExp.tiempo}</span><span>ᚱ {selExp.runas} runas</span></div>
            </div>
            
            <div className="exp-d-intro">
              {selExp.intro.split('\n\n').map((p, i) => <p key={i}>{p}</p>)}
            </div>
            
            <div className="exp-d-section">
              <h3>¿Qué vas a recibir?</h3>
              <ul>{selExp.queRecibis.map((q, i) => <li key={i}>{q}</li>)}</ul>
            </div>
            
            <div className="exp-d-section">
              <h3>¿Para quién es?</h3>
              <p>{selExp.paraQuien}</p>
            </div>
            
            <div className="exp-d-cta">
              <div className="exp-d-cost"><span>Costo:</span><strong>{selExp.runas} ᚱ</strong><small>Tenés {usuario?.runas || 0}</small></div>
              <button className="btn-gold btn-lg" onClick={() => setVista('form')} disabled={(usuario?.runas || 0) < selExp.runas}>
                {(usuario?.runas || 0) >= selExp.runas ? 'Continuar →' : `Necesitás ${selExp.runas} Runas`}
              </button>
            </div>
          </div>
        )}
        
        {vista === 'form' && (
          <div className="exp-form">
            <h2>{selExp.nombre}</h2>
            
            <div className="regalo-toggle">
              <label><input type="checkbox" checked={esRegalo} onChange={e => setEsRegalo(e.target.checked)} /> <span>🎁 Es un regalo para otra persona</span></label>
            </div>
            
            {esRegalo ? (
              <div className="form-campos">
                <p className="form-note">La persona recibirá un email con acceso a Mi Magia donde completará sus propios datos y recibirá la lectura personalizada.</p>
                <div className="campo"><label>Email de quien recibe *</label><input type="email" value={form.email_regalo || ''} onChange={e => setForm({...form, email_regalo: e.target.value})} placeholder="email@ejemplo.com" /></div>
                <div className="campo"><label>Nombre</label><input type="text" value={form.nombre_regalo || ''} onChange={e => setForm({...form, nombre_regalo: e.target.value})} placeholder="Para personalizar" /></div>
                <div className="campo"><label>Tu mensaje (opcional)</label><textarea value={form.mensaje_regalo || ''} onChange={e => setForm({...form, mensaje_regalo: e.target.value})} placeholder="Un mensaje personal..." rows={3} /></div>
              </div>
            ) : (
              <div className="form-campos">
                <p className="form-note">Completá lo que puedas. Cuanta más información nos des, más personalizada será tu lectura.</p>
                {selExp.campos.includes('pregunta') && <div className="campo"><label>Tu pregunta o tema *</label><textarea value={form.pregunta || ''} onChange={e => setForm({...form, pregunta: e.target.value})} placeholder="¿Qué querés saber o trabajar?" rows={3} /></div>}
                {selExp.campos.includes('contexto') && <div className="campo"><label>Contexto</label><textarea value={form.contexto || ''} onChange={e => setForm({...form, contexto: e.target.value})} placeholder="¿Qué está pasando en tu vida relacionado a esto?" rows={3} /></div>}
                {selExp.campos.includes('guardianes_interes') && <div className="campo"><label>¿Qué guardianes te llaman? *</label><textarea value={form.guardianes_interes || ''} onChange={e => setForm({...form, guardianes_interes: e.target.value})} placeholder="Describí los que te atraen: pueden ser por nombre, por tipo (protección, abundancia), o por algo que notaste..." rows={3} /></div>}
                {selExp.campos.includes('situacion') && <div className="campo"><label>Tu situación actual</label><textarea value={form.situacion || ''} onChange={e => setForm({...form, situacion: e.target.value})} placeholder="¿Qué momento de vida atravesás?" rows={2} /></div>}
                {selExp.campos.includes('que_buscas') && <div className="campo"><label>¿Qué buscás?</label><input type="text" value={form.que_buscas || ''} onChange={e => setForm({...form, que_buscas: e.target.value})} placeholder="Protección, abundancia, amor, claridad..." /></div>}
                {selExp.campos.includes('fecha_nacimiento') && <div className="campo"><label>Fecha de nacimiento *</label><input type="date" value={form.fecha_nacimiento || ''} onChange={e => setForm({...form, fecha_nacimiento: e.target.value})} /></div>}
                {selExp.campos.includes('hora_nacimiento') && <div className="campo"><label>Hora de nacimiento (si la sabés)</label><input type="time" value={form.hora_nacimiento || ''} onChange={e => setForm({...form, hora_nacimiento: e.target.value})} /></div>}
                {selExp.campos.includes('lugar_nacimiento') && <div className="campo"><label>Lugar de nacimiento</label><input type="text" value={form.lugar_nacimiento || ''} onChange={e => setForm({...form, lugar_nacimiento: e.target.value})} placeholder="Ciudad, país" /></div>}
                {selExp.campos.includes('nombre_completo') && <div className="campo"><label>Nombre completo</label><input type="text" value={form.nombre_completo || ''} onChange={e => setForm({...form, nombre_completo: e.target.value})} /></div>}
                {selExp.campos.includes('patrones_repetitivos') && <div className="campo"><label>Patrones que se repiten en tu vida</label><textarea value={form.patrones_repetitivos || ''} onChange={e => setForm({...form, patrones_repetitivos: e.target.value})} placeholder="Situaciones, relaciones, problemas que aparecen una y otra vez..." rows={2} /></div>}
                {selExp.campos.includes('miedos_inexplicables') && <div className="campo"><label>Miedos inexplicables</label><textarea value={form.miedos_inexplicables || ''} onChange={e => setForm({...form, miedos_inexplicables: e.target.value})} placeholder="Miedos que tenés desde siempre sin saber por qué..." rows={2} /></div>}
                {selExp.campos.includes('atracciones_epocas') && <div className="campo"><label>Épocas o culturas que te atraen</label><input type="text" value={form.atracciones_epocas || ''} onChange={e => setForm({...form, atracciones_epocas: e.target.value})} placeholder="Egipto, medieval, celta, oriental..." /></div>}
                {selExp.campos.includes('nombre_ancestro') && <div className="campo"><label>¿A quién querés contactar?</label><input type="text" value={form.nombre_ancestro || ''} onChange={e => setForm({...form, nombre_ancestro: e.target.value})} placeholder="Nombre del ancestro o 'mis ancestros en general'" /></div>}
                {selExp.campos.includes('nacionalidades') && <div className="campo"><label>Nacionalidades de tu familia</label><input type="text" value={form.nacionalidades || ''} onChange={e => setForm({...form, nacionalidades: e.target.value})} placeholder="Española, italiana, uruguaya..." /></div>}
                {selExp.campos.includes('patrones_familia') && <div className="campo"><label>Patrones familiares que notás</label><textarea value={form.patrones_familia || ''} onChange={e => setForm({...form, patrones_familia: e.target.value})} placeholder="Enfermedades, separaciones, temas de dinero..." rows={2} /></div>}
                {selExp.campos.includes('sintomas_fisicos') && <div className="campo"><label>Síntomas físicos</label><textarea value={form.sintomas_fisicos || ''} onChange={e => setForm({...form, sintomas_fisicos: e.target.value})} placeholder="Cansancio, dolores, tensiones..." rows={2} /></div>}
                {selExp.campos.includes('sintomas_emocionales') && <div className="campo"><label>Síntomas emocionales</label><textarea value={form.sintomas_emocionales || ''} onChange={e => setForm({...form, sintomas_emocionales: e.target.value})} placeholder="Ansiedad, tristeza, bloqueos..." rows={2} /></div>}
                {selExp.campos.includes('areas_bloqueadas') && <div className="campo"><label>Áreas que sentís bloqueadas</label><input type="text" value={form.areas_bloqueadas || ''} onChange={e => setForm({...form, areas_bloqueadas: e.target.value})} placeholder="Amor, dinero, creatividad..." /></div>}
                {selExp.campos.includes('opciones') && <div className="campo"><label>Opciones que estás considerando</label><textarea value={form.opciones || ''} onChange={e => setForm({...form, opciones: e.target.value})} placeholder="Si tenés opciones concretas, contanos cuáles..." rows={2} /></div>}
                {selExp.campos.includes('deadline') && <div className="campo"><label>¿Hay una fecha límite?</label><input type="text" value={form.deadline || ''} onChange={e => setForm({...form, deadline: e.target.value})} placeholder="Ej: tengo que decidir antes del viernes" /></div>}
                {selExp.campos.includes('mes') && <div className="campo"><label>Mes a consultar</label><select value={form.mes || ''} onChange={e => setForm({...form, mes: e.target.value})}><option value="">Elegí</option><option value="proximo">Próximo mes</option><option value="actual">Este mes</option></select></div>}
                {selExp.campos.includes('area_principal') && <div className="campo"><label>Área principal de enfoque</label><select value={form.area_principal || ''} onChange={e => setForm({...form, area_principal: e.target.value})}><option value="">Elegí</option><option value="amor">Amor</option><option value="trabajo">Trabajo/Dinero</option><option value="salud">Salud</option><option value="espiritualidad">Espiritualidad</option><option value="general">Visión general</option></select></div>}
              </div>
            )}
            
            {msg && <div className={`msg ${msg.t}`}>{msg.m}</div>}
            
            <div className="form-actions">
              <button className="btn-sec" onClick={() => setVista('info')}>← Volver</button>
              <button className="btn-gold" onClick={solicitar} disabled={enviando}>{enviando ? 'Enviando...' : esRegalo ? 'Enviar Regalo' : 'Solicitar Lectura'}</button>
            </div>
          </div>
        )}
      </div>
    );
  }
  
  return (
    <div className="sec">
      <div className="sec-head">
        <h1>Experiencias Mágicas</h1>
        <p>Lecturas personalizadas, mensajes canalizados, guías para tu camino. Cada experiencia queda guardada en tu grimorio para siempre.</p>
      </div>
      
      <div className="runas-header">
        <div className="runas-balance"><span>ᚱ</span><strong>{usuario?.runas || 0}</strong><small>disponibles</small></div>
        <a href="https://duendesuy.10web.cloud/producto-categoria/runas/" target="_blank" rel="noopener" className="btn-gold-sm">Obtener más ↗</a>
      </div>
      
      <div className="exp-grid">
        {EXPERIENCIAS.map(exp => {
          const disponible = (usuario?.runas || 0) >= exp.runas;
          return (
            <div key={exp.id} className={`exp-card ${disponible ? '' : 'bloq'}`} onClick={() => setSelExp(exp)}>
              <div className="exp-card-head"><span className="exp-icon">{exp.icono}</span><span className="exp-runas">{exp.runas} ᚱ</span></div>
              <h3>{exp.nombre}</h3>
              <p className="exp-tiempo">⏱ {exp.tiempo}</p>
              <p className="exp-desc">{exp.intro.substring(0, 120)}...</p>
              <button className="btn-ver">Ver más →</button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// REGALOS
// ═══════════════════════════════════════════════════════════════

function Regalos({ ir }) {
  const [expandido, setExpandido] = useState(null);
  
  return (
    <div className="sec">
      <div className="sec-head regalo-head"><span>❤</span><h1>Regalá Magia</h1><p>Un regalo de Duendes del Uruguay es diferente. Es compañía, protección, transformación.</p></div>
      
      <div className="regalos-grid">
        <div className="regalo-card" onClick={() => setExpandido(expandido === 'guardianes' ? null : 'guardianes')}>
          <span>◆</span><h3>Guardianes</h3><p>Un compañero de vida para alguien especial.</p>
          {expandido === 'guardianes' && (
            <div className="regalo-exp">
              <p>Un guardián canalizado es un regalo que trasciende lo material. Es protección, compañía, conexión con el mundo elemental.</p>
              <p><strong>¿Cómo funciona?</strong> Elegís el guardián en la tienda, en el checkout indicás que es regalo y ponés el email del destinatario. Le llega la sorpresa con toda la información de su nuevo compañero.</p>
              <a href="https://duendesuy.10web.cloud/shop/" target="_blank" rel="noopener" className="btn-gold-sm">Ver guardianes ↗</a>
            </div>
          )}
        </div>
        
        <div className="regalo-card" onClick={() => setExpandido(expandido === 'exp' ? null : 'exp')}>
          <span>✦</span><h3>Experiencias Mágicas</h3><p>Una lectura personalizada.</p>
          {expandido === 'exp' && (
            <div className="regalo-exp">
              <p>Regalá una Tirada de Runas, Lectura del Alma, Registros Akáshicos o cualquier experiencia.</p>
              <p><strong>¿Cómo funciona?</strong> Vas a Experiencias, elegís la que querés regalar, marcás "Es un regalo" y ponés el email. La persona recibe acceso a Mi Magia donde completa SUS propios datos y recibe la lectura personalizada.</p>
              <button className="btn-gold-sm" onClick={(e) => { e.stopPropagation(); ir('experiencias'); }}>Ir a Experiencias</button>
            </div>
          )}
        </div>
        
        <div className="regalo-card" onClick={() => setExpandido(expandido === 'circulo' ? null : 'circulo')}>
          <span>★</span><h3>Círculo de Duendes</h3><p>Membresía. El regalo que sigue dando.</p>
          {expandido === 'circulo' && (
            <div className="regalo-exp">
              <p>3 meses de Círculo = 3 meses de descuentos, lecturas gratis, contenido exclusivo, comunidad.</p>
              <p><strong>¿Cómo funciona?</strong> Comprás la membresía trimestral como regalo, indicás el email y la persona recibe acceso completo.</p>
              <a href="https://duendesuy.10web.cloud/producto/circulo-trimestral/" target="_blank" rel="noopener" className="btn-gold-sm">Regalar 3 meses ↗</a>
            </div>
          )}
        </div>
        
        <div className="regalo-card" onClick={() => setExpandido(expandido === 'runas' ? null : 'runas')}>
          <span>ᚱ</span><h3>Runas de Poder</h3><p>Libertad para elegir qué experiencia quiere.</p>
          {expandido === 'runas' && (
            <div className="regalo-exp">
              <p>Regalá Runas y dejá que la persona elija qué experiencia mágica quiere tener.</p>
              <p><strong>¿Cómo funciona?</strong> Comprás el pack, indicás el email del destinatario, y las Runas aparecen en su cuenta de Mi Magia.</p>
              <div className="mini-packs">
                {PACKS_RUNAS.map(p => <a key={p.nombre} href={p.url} target="_blank" rel="noopener">{p.runas}ᚱ ${p.precio}</a>)}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// MUNDO, CUIDADOS, CRISTALES
// ═══════════════════════════════════════════════════════════════

function MundoSec() {
  const [tab, setTab] = useState('intro');
  const [elementoExpandido, setElementoExpandido] = useState(null);

  return (
    <div className="sec mundo-elemental">
      <div className="sec-head">
        <h1>El Reino Elemental</h1>
        <p>Todo lo que necesitás saber sobre duendes, hadas, gnomos, elementales, alquimia y la conexión entre mundos.</p>
      </div>

      <div className="tabs-h mundo-tabs">
        {[
          ['intro','◈','Qué es'],
          ['elementales','✦','4 Elementos'],
          ['tipos','◆','Tipos de Duendes'],
          ['signos','☽','Señales'],
          ['rituales','❧','Rituales'],
          ['alquimia','★','Alquimia']
        ].map(([k,i,t]) => (
          <button key={k} className={`tab ${tab===k?'act':''}`} onClick={() => setTab(k)}>
            <span className="tab-icon">{i}</span>{t}
          </button>
        ))}
      </div>

      <div className="tab-content mundo-content">
        {tab === 'intro' && (
          <div className="intro-expandida">
            {MUNDO_ELEMENTAL.intro.texto.split('\n\n').map((p,i) => <p key={i}>{p}</p>)}

            <div className="intro-cta">
              <h4>¿Listo para explorar más?</h4>
              <p>Navegá por las pestañas para descubrir cada aspecto del Reino Elemental.</p>
            </div>
          </div>
        )}

        {tab === 'elementales' && (
          <div className="elementos-expandidos">
            <p className="elementos-intro">Los cuatro elementos son la base de toda la creación. Cada uno tiene sus propios seres guardianes, energías específicas, y formas de conexión.</p>

            <div className="elementos-grid-exp">
              {MUNDO_ELEMENTAL.elementales.map((el,i) => (
                <div
                  key={i}
                  className={`elem-card-exp ${elementoExpandido === i ? 'expandido' : ''}`}
                  style={{borderColor: el.color}}
                >
                  <div className="elem-header" style={{background: el.color}} onClick={() => setElementoExpandido(elementoExpandido === i ? null : i)}>
                    <span className="elem-icono">{el.icono}</span>
                    <div className="elem-titulo">
                      <strong>{el.elemento}</strong>
                      <small>{el.nombre}</small>
                    </div>
                    <span className="elem-expand">{elementoExpandido === i ? '−' : '+'}</span>
                  </div>

                  <div className="elem-body">
                    <p className="elem-desc">{el.desc}</p>

                    {elementoExpandido === i && (
                      <div className="elem-detalles">
                        <div className="elem-seccion">
                          <h5>Características</h5>
                          <p>{el.detalles}</p>
                        </div>

                        <div className="elem-seccion">
                          <h5>Cómo Conectar</h5>
                          <p>{el.conectar}</p>
                        </div>

                        <div className="elem-seccion ritual-box">
                          <h5>✦ Ritual de Conexión</h5>
                          <p>{el.ritual}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'tipos' && (
          <div className="tipos-duendes">
            <div className="tipos-intro">
              {MUNDO_ELEMENTAL.duendes.texto.split('\n\n').map((p,i) => <p key={i}>{p}</p>)}
            </div>

            <h3>Tipos de Duendes</h3>
            <div className="tipos-grid">
              {MUNDO_ELEMENTAL.tiposDuendes.map((td,i) => (
                <div key={i} className="tipo-card">
                  <h4>{td.tipo}</h4>
                  <p>{td.desc}</p>
                  <div className="tipo-senales">
                    <strong>Señales de su presencia:</strong>
                    <span>{td.señales}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'signos' && (
          <div className="signos-duende">
            <p className="signos-intro">Los duendes se comunican de formas sutiles. Aprender a reconocer sus señales te permite fortalecer el vínculo y entender sus mensajes.</p>

            <div className="signos-grid">
              {MUNDO_ELEMENTAL.signos.map((s,i) => (
                <div key={i} className="signo-card">
                  <h4>{s.signo}</h4>
                  <ul>
                    {s.señales.map((sen,j) => <li key={j}>{sen}</li>)}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'rituales' && (
          <div className="rituales-section">
            <p className="rituales-intro">Los rituales son puentes de comunicación. No requieren materiales costosos ni conocimientos avanzados: solo intención pura y corazón abierto.</p>

            <div className="rituales-grid">
              {MUNDO_ELEMENTAL.rituales.map((r,i) => (
                <div key={i} className="ritual-card">
                  <div className="ritual-header">
                    <h4>{r.nombre}</h4>
                    <span className="ritual-duracion">⏱ {r.duracion}</span>
                  </div>
                  <ol className="ritual-pasos">
                    {r.pasos.map((p,j) => <li key={j}>{p}</li>)}
                  </ol>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'alquimia' && (
          <div className="alquimia-section">
            {MUNDO_ELEMENTAL.alquimia.texto.split('\n\n').map((p,i) => <p key={i}>{p}</p>)}

            <div className="piriapolis-highlight">
              <span>★</span>
              <p>Cada guardián canalizado en Piriápolis lleva consigo la energía de este vórtice alquímico único en el mundo.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function CuidadosSec() {
  return (
    <div className="sec">
      <div className="sec-head"><h1>Cuidados de tu Guardián</h1><p>Guía para mantener el vínculo fuerte y vibrante.</p></div>
      <div className="cuidados-lista">
        {CUIDADOS.map((c,i) => (
          <div key={i} className={`cuidado-card ${c.esProhibido ? 'prohibido' : ''}`}>
            <div className="cuidado-num">{i+1}</div>
            <div className="cuidado-body">
              <h3>{c.titulo}</h3>
              <p>{c.texto}</p>
              <ul>{c.items.map((it,j) => <li key={j}>{it}</li>)}</ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CristalesSec() {
  return (
    <div className="sec">
      <div className="sec-head"><h1>Cristales y Gemas</h1><p>Aliados poderosos. Cada guardián viene acompañado de cristales específicos para su energía.</p></div>
      <div className="cristales-grid">
        {CRISTALES.map((c,i) => (
          <div key={i} className="cristal-card">
            <div className="cristal-color" style={{background:c.color}}></div>
            <h4>{c.nombre}</h4>
            <p className="cristal-props">{c.props}</p>
            <small className="cristal-cuidado">{c.cuidado}</small>
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// CÍRCULO (con contenido interno desarrollado - conectado a APIs)
// ═══════════════════════════════════════════════════════════════

function CirculoSec({ usuario, setUsuario, token, pais }) {
  const [tab, setTab] = useState('inicio');
  const [verMembresias, setVerMembresias] = useState(false);
  const [activandoPrueba, setActivandoPrueba] = useState(false);
  const [lunaData, setLunaData] = useState(null);
  const [contenidos, setContenidos] = useState([]);
  const [cargandoLuna, setCargandoLuna] = useState(false);
  const [cargandoContenido, setCargandoContenido] = useState(false);
  const [contenidoModal, setContenidoModal] = useState(null);
  const esUY = pais === 'UY';

  useEffect(() => {
    if (usuario?.esCirculo) {
      cargarLuna();
      cargarContenido();
    }
  }, [usuario?.esCirculo]);

  const cargarLuna = async () => {
    setCargandoLuna(true);
    try {
      const res = await fetch(`${API_BASE}/api/circulo/luna?email=${usuario.email}`);
      const data = await res.json();
      if (data.success) setLunaData(data.luna);
    } catch(e) { console.error('Error cargando luna:', e); }
    setCargandoLuna(false);
  };

  const cargarContenido = async () => {
    setCargandoContenido(true);
    try {
      const res = await fetch(`${API_BASE}/api/circulo/contenido?email=${usuario.email}`);
      const data = await res.json();
      if (data.success) setContenidos(data.contenidos || []);
    } catch(e) { console.error('Error cargando contenido:', e); }
    setCargandoContenido(false);
  };

  const activarPrueba = async () => {
    setActivandoPrueba(true);
    try {
      const res = await fetch(`${API_BASE}/api/mi-magia/circulo/prueba`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: usuario.email }) });
      const data = await res.json();
      if (data.success) {
        setUsuario({ ...usuario, esCirculo: true, circuloPrueba: true, circuloExpira: data.beneficios?.expira, runas: (usuario.runas || 0) + 50 });
      }
    } catch(e) {}
    setActivandoPrueba(false);
  };

  // SI ES MIEMBRO DEL CÍRCULO - MUNDO INTERNO
  if (usuario?.esCirculo) {
    return (
      <div className="sec circulo-interno">
        <div className="circulo-header-int">
          <span>★</span>
          <h1>Círculo de Duendes</h1>
          <p>{usuario.circuloPrueba ? `Prueba gratuita` : `Miembro activo`}{usuario.circuloExpira ? ` hasta ${new Date(usuario.circuloExpira).toLocaleDateString('es-UY')}` : ''}</p>
        </div>

        <div className="circulo-tabs">
          {[['inicio','◇','Inicio'],['contenido','✦','Contenido'],['guia','☽','Guía Lunar'],['comunidad','❧','Comunidad']].map(([k,i,t]) =>
            <button key={k} className={`tab ${tab===k?'act':''}`} onClick={() => setTab(k)}><span>{i}</span>{t}</button>
          )}
        </div>

        {tab === 'inicio' && (
          <div className="circulo-inicio">
            <div className="beneficios-activos">
              <h2>Tus Beneficios Activos</h2>
              <div className="benef-grid-int">
                <div className="benef-item-int"><span>◈</span><strong>5-10% OFF</strong><p>Según tu plan</p></div>
                <div className="benef-item-int"><span>✦</span><strong>Acceso anticipado</strong><p>24-72hs antes</p></div>
                <div className="benef-item-int"><span>ᚱ</span><strong>Tiradas gratis/mes</strong><p>1 a 5 según plan</p></div>
              </div>
            </div>

            {lunaData && (
              <div className="luna-preview">
                <div className="luna-mini">
                  <span className="luna-emoji">{lunaData.faseActual?.emoji}</span>
                  <div>
                    <strong>{lunaData.faseActual?.nombre}</strong>
                    <p>{lunaData.faseActual?.energia}</p>
                  </div>
                </div>
                <button className="btn-sec" onClick={() => setTab('guia')}>Ver guía lunar completa →</button>
              </div>
            )}

            <div className="circulo-bienvenida">
              <h2>Bienvenid{usuario?.pronombre === 'el' ? 'o' : 'a'} al santuario secreto</h2>
              <p>Este es tu espacio exclusivo. Acá encontrarás contenido que no está disponible en ningún otro lugar: guías lunares, DIY mágicos, meditaciones, y una comunidad de personas que, como vos, sienten el llamado de la magia.</p>
              <p>Explorá las secciones arriba. Cada semana agregamos contenido nuevo.</p>
            </div>
          </div>
        )}

        {tab === 'contenido' && (
          <div className="circulo-contenido">
            <h2>Contenido Exclusivo</h2>
            <p className="contenido-intro">Cada mes nuevo contenido. Acá abajo lo más reciente:</p>
            {cargandoContenido ? (
              <div className="cargando-mini">Cargando contenido...</div>
            ) : (
              <div className="contenido-lista">
                {contenidos.length > 0 ? contenidos.map((c, i) => (
                  <div key={c.id || i} className="contenido-item">
                    <span>{c.tipo === 'ritual' ? '🕯️' : c.tipo === 'meditacion' ? '🎧' : c.tipo === 'guia' ? '📖' : '✦'}</span>
                    <h4>{c.titulo}</h4>
                    <p>{c.extracto}</p>
                    <small>Por {c.autor} • {c.vistas} vistas</small>
                    <button className="btn-sec" onClick={() => setContenidoModal(c)}>Ver {c.tipo}</button>
                  </div>
                )) : (
                  <p className="sin-contenido">Cargando contenido exclusivo...</p>
                )}
              </div>
            )}

            {/* Modal de Contenido */}
            {contenidoModal && (
              <div className="contenido-modal-overlay" onClick={() => setContenidoModal(null)}>
                <div className="contenido-modal" onClick={e => e.stopPropagation()}>
                  <button className="modal-cerrar" onClick={() => setContenidoModal(null)}>×</button>
                  <div className="modal-header">
                    <span>{contenidoModal.tipo === 'ritual' ? '🕯️' : contenidoModal.tipo === 'meditacion' ? '🎧' : contenidoModal.tipo === 'guia' ? '📖' : '✦'}</span>
                    <div>
                      <h2>{contenidoModal.titulo}</h2>
                      <p className="modal-meta">Por {contenidoModal.autor} • {contenidoModal.vistas} vistas</p>
                    </div>
                  </div>
                  <div className="modal-contenido">
                    {contenidoModal.contenido ? (
                      contenidoModal.contenido.split('\n').map((p, i) => {
                        if (p.startsWith('## ')) return <h2 key={i}>{p.replace('## ', '')}</h2>;
                        if (p.startsWith('### ')) return <h3 key={i}>{p.replace('### ', '')}</h3>;
                        if (p.startsWith('**') && p.endsWith('**')) return <h4 key={i}>{p.replace(/\*\*/g, '')}</h4>;
                        if (p.startsWith('- ')) return <li key={i}>{p.replace('- ', '')}</li>;
                        if (p.startsWith('✦')) return <p key={i} className="mensaje-cierre">{p}</p>;
                        if (p.trim() === '') return <br key={i} />;
                        return <p key={i}>{p.replace(/\*([^*]+)\*/g, '<em>$1</em>').replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')}</p>;
                      })
                    ) : (
                      <p>{contenidoModal.extracto}</p>
                    )}
                  </div>
                </div>
              </div>
            )}
            <div className="temas-explorar">
              <h3>Temas que exploramos:</h3>
              <div className="temas-tags">{CIRCULO_CONTENIDO.temas.map((t,i) => <span key={i}>{t}</span>)}</div>
            </div>
          </div>
        )}

        {tab === 'guia' && (
          <div className="circulo-guia">
            <h2>Guía Lunar</h2>
            {cargandoLuna ? (
              <div className="cargando-mini">Consultando las estrellas...</div>
            ) : lunaData ? (
              <>
                <div className="luna-hero">
                  <div className="luna-fase-grande">
                    <span className="luna-emoji-lg">{lunaData.faseActual?.emoji}</span>
                    <div>
                      <h3>{lunaData.faseActual?.nombre}</h3>
                      <p className="luna-energia">{lunaData.faseActual?.energia}</p>
                      <small>{lunaData.iluminacion}% iluminada</small>
                    </div>
                  </div>
                  {lunaData.signoLunar && (
                    <div className="signo-lunar">
                      <span>{lunaData.signoLunar.emoji}</span>
                      <div>
                        <strong>Luna en {lunaData.signoLunar.signo}</strong>
                        <p>{lunaData.signoLunar.energia}</p>
                        <small>Elemento: {lunaData.signoLunar.elemento}</small>
                      </div>
                    </div>
                  )}
                </div>

                <div className="mensaje-guardian-luna">
                  <h3>✦ Mensaje de tu Guardián</h3>
                  <p className="mensaje-texto">{lunaData.mensajeGuardian}</p>
                </div>

                <div className="afirmacion-dia">
                  <h3>Afirmación del día</h3>
                  <p className="afirmacion">"{lunaData.afirmacionDia}"</p>
                </div>

                {lunaData.proximasFases && (
                  <div className="proximas-fases">
                    <h3>Próximas fases</h3>
                    <div className="fases-grid">
                      {lunaData.proximasFases.map((f, i) => (
                        <div key={i} className="fase-item">
                          <span>{f.emoji}</span>
                          <strong>{f.fase}</strong>
                          <small>en {f.diasRestantes} días</small>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {lunaData.ritualesRecomendados && (
                  <div className="rituales-fase">
                    <h3>Rituales para esta fase</h3>
                    <ul>
                      {lunaData.ritualesRecomendados.map((r, i) => <li key={i}>{r}</li>)}
                    </ul>
                  </div>
                )}

                {lunaData.cristalesLuna && (
                  <div className="cristales-fase">
                    <h3>Cristales recomendados</h3>
                    <div className="cristales-tags">
                      {lunaData.cristalesLuna.map((c, i) => <span key={i}>{c}</span>)}
                    </div>
                  </div>
                )}

                {lunaData.energiaMes && (
                  <div className="energia-mes">
                    <h3>Energía del mes: {lunaData.energiaMes.nombre}</h3>
                    <div className="energia-info" style={{borderColor: lunaData.energiaMes.color}}>
                      <strong>Tema: {lunaData.energiaMes.tema}</strong>
                      <p>Cristal del mes: {lunaData.energiaMes.cristal}</p>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="luna-error">No pudimos cargar los datos lunares. Intentá de nuevo.</div>
            )}
          </div>
        )}

        {tab === 'comunidad' && (
          <div className="circulo-comunidad">
            <h2>Comunidad del Círculo</h2>
            <p className="comunidad-intro">Un espacio para compartir experiencias, hacer preguntas, y conectar con otros guardianes del mundo elemental.</p>
            <div className="comunidad-prox">
              <span>🚧</span>
              <h3>Próximamente: Foro del Círculo</h3>
              <p>Estamos desarrollando un espacio donde van a poder compartir sus experiencias con los guardianes, hacer preguntas, y conectar entre ustedes.</p>
              <p>Mientras tanto, pueden enviar sus preguntas y las respondemos en el contenido semanal.</p>
            </div>
          </div>
        )}
      </div>
    );
  }

  // SI NO ES MIEMBRO - LANDING CON BLUR PREVIEW
  return (
    <div className="sec circulo-landing">
      <div className="circulo-hero"><span>★</span><h1>Círculo de Duendes</h1><p>El santuario secreto para quienes sienten el llamado</p></div>

      {/* Vista previa con blur */}
      <div className="circulo-preview-blur">
        <div className="preview-content">
          <div className="preview-item">
            <span>🕯️</span>
            <h4>Ritual de Luna Llena para Manifestación</h4>
            <p>Descubrí cómo aprovechar la energía de la luna llena...</p>
          </div>
          <div className="preview-item">
            <span>🧙</span>
            <h4>Los Duendes Protectores del Hogar</h4>
            <p>Conoce a los guardianes elementales que cuidan tu espacio...</p>
          </div>
          <div className="preview-item">
            <span>🎧</span>
            <h4>Meditación: Conexión con tu Guardián</h4>
            <p>Una meditación profunda para establecer un vínculo...</p>
          </div>
        </div>
        <div className="preview-overlay">
          <span className="lock-icon">🔒</span>
          <h3>Contenido exclusivo del Círculo</h3>
          <p>Accedé a rituales, guías, meditaciones y más</p>
        </div>
      </div>

      {/* Caja de acción principal */}
      <div className="circulo-cta-box">
        {!usuario?.circuloPruebaUsada ? (
          <>
            <div className="cta-header">
              <span className="cta-gift">🎁</span>
              <h2>15 días gratis para vos</h2>
            </div>
            <div className="cta-benefits">
              <div className="cta-benefit"><span>✓</span> Acceso a todo el contenido exclusivo</div>
              <div className="cta-benefit"><span>✓</span> 10 Runas + 2 tréboles por mes</div>
              <div className="cta-benefit"><span>✓</span> 1 Tirada de Runas gratis/mes</div>
              <div className="cta-benefit"><span>✓</span> 5% en guardianes nuevos</div>
              <div className="cta-benefit"><span>✓</span> Sin compromiso, cancelás cuando quieras</div>
            </div>
            <button className="btn-gold btn-lg cta-button" onClick={activarPrueba} disabled={activandoPrueba}>
              {activandoPrueba ? '✨ Activando tu acceso...' : '✦ Comenzar prueba gratuita'}
            </button>
            <p className="cta-small">Sin tarjeta de crédito. Sin letra chica.</p>
          </>
        ) : (
          <>
            <div className="cta-header">
              <span className="cta-gift">★</span>
              <h2>Elegí tu membresía</h2>
            </div>
            <p className="cta-subtitle">Ya probaste el Círculo. ¡Es hora de quedarte!</p>
            <div className="membresias-cta-grid">
              {MEMBRESIAS.map(m => (
                <div key={m.nombre} className={`membresia-cta-card ${m.nombre === 'Anual' ? 'destacada' : ''}`}>
                  {m.nombre === 'Anual' && <span className="badge-popular">Más elegida</span>}
                  <h4>{m.nombre}</h4>
                  <div className="membresia-precio-cta">
                    {esUY ? `$${m.precioUY.toLocaleString()}` : `$${m.precio}`}
                    <small>{esUY ? 'UYU' : 'USD'}</small>
                  </div>
                  {m.ahorro && <span className="membresia-ahorro-cta">{m.ahorro}</span>}
                  <p className="membresia-dias">{m.dias} días</p>
                  <a href={m.url} target="_blank" rel="noopener" className="btn-membresia">
                    Elegir →
                  </a>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <h2 className="sec-titulo">¿Qué incluye el Círculo?</h2>
      <div className="beneficios-grid">
        {CIRCULO_CONTENIDO.beneficios.map((b,i) => (
          <div key={i} className="beneficio-card"><span>{b.icono}</span><h4>{b.titulo}</h4><p>{b.desc}</p></div>
        ))}
      </div>

      <h2 className="sec-titulo">Temas que exploramos</h2>
      <div className="temas-tags">{CIRCULO_CONTENIDO.temas.map((t,i) => <span key={i}>{t}</span>)}</div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// GRIMORIO (con explicación completa)
// ═══════════════════════════════════════════════════════════════

function GrimorioSec({ usuario, token, setUsuario }) {
  const [tab, setTab] = useState('intro');
  const [entrada, setEntrada] = useState('');
  const [tipoEntrada, setTipoEntrada] = useState('libre');
  const [guardando, setGuardando] = useState(false);
  const [msg, setMsg] = useState(null);

  // Estados del calendario interactivo
  const [mesActual, setMesActual] = useState(new Date());
  const [diaSeleccionado, setDiaSeleccionado] = useState(null);
  const [vistaCalendario, setVistaCalendario] = useState(true);

  // Calcular fase lunar para una fecha
  const calcularFaseLunar = (fecha) => {
    const cicloLunar = 29.530588853;
    const lunaLlena = new Date(2024, 0, 25); // Luna llena conocida
    const diff = (fecha - lunaLlena) / (1000 * 60 * 60 * 24);
    const fase = ((diff % cicloLunar) + cicloLunar) % cicloLunar;
    if (fase < 1.84566) return { nombre: 'Nueva', icono: '🌑', energia: 'Nuevos comienzos, introspección' };
    if (fase < 7.38264) return { nombre: 'Creciente', icono: '🌒', energia: 'Manifestación, acción' };
    if (fase < 9.22830) return { nombre: 'Cuarto Creciente', icono: '🌓', energia: 'Decisiones, compromiso' };
    if (fase < 14.76528) return { nombre: 'Gibosa Creciente', icono: '🌔', energia: 'Refinamiento, paciencia' };
    if (fase < 16.61094) return { nombre: 'Llena', icono: '🌕', energia: 'Culminación, gratitud, magia potente' };
    if (fase < 22.14792) return { nombre: 'Gibosa Menguante', icono: '🌖', energia: 'Gratitud, compartir' };
    if (fase < 23.99358) return { nombre: 'Cuarto Menguante', icono: '🌗', energia: 'Soltar, liberar' };
    return { nombre: 'Menguante', icono: '🌘', energia: 'Descanso, limpieza' };
  };

  // Obtener días del mes para el calendario
  const obtenerDiasMes = () => {
    const year = mesActual.getFullYear();
    const month = mesActual.getMonth();
    const primerDia = new Date(year, month, 1);
    const ultimoDia = new Date(year, month + 1, 0);
    const diasEnMes = ultimoDia.getDate();
    const diaSemanaInicio = primerDia.getDay();
    const dias = [];

    // Días vacíos al inicio
    for (let i = 0; i < diaSemanaInicio; i++) {
      dias.push({ vacio: true });
    }

    // Días del mes
    for (let d = 1; d <= diasEnMes; d++) {
      const fecha = new Date(year, month, d);
      const fechaStr = fecha.toLocaleDateString('es-UY');
      const entradasDia = (usuario?.diario || []).filter(e => e.fecha === fechaStr);
      const faseLunar = calcularFaseLunar(fecha);
      const esHoy = new Date().toDateString() === fecha.toDateString();
      dias.push({
        dia: d,
        fecha: fechaStr,
        fechaObj: fecha,
        entradas: entradasDia,
        tieneEntradas: entradasDia.length > 0,
        faseLunar,
        esHoy
      });
    }
    return dias;
  };

  // Obtener entradas del día seleccionado
  const entradasDelDia = diaSeleccionado
    ? (usuario?.diario || []).filter(e => e.fecha === diaSeleccionado)
    : [];
  
  const guardarEntrada = async () => {
    if (!entrada.trim()) return;
    setGuardando(true);
    try {
      const res = await fetch(`${API_BASE}/api/mi-magia/diario`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: usuario.email, tipo: tipoEntrada, contenido: entrada }) });
      const data = await res.json();
      setUsuario({ ...usuario, diario: [...(usuario.diario || []), { tipo: tipoEntrada, contenido: entrada, fecha: new Date().toLocaleDateString('es-UY') }], runas: data.runaOtorgada ? (usuario.runas || 0) + 1 : usuario.runas });
      setEntrada('');
      if (data.runaOtorgada) setMsg({ t: 'ok', m: '+1 Runa por tu práctica diaria!' });
    } catch(e) {}
    setGuardando(false);
  };
  
  return (
    <div className="sec">
      <div className="sec-head"><h1>Tu Grimorio</h1><p>Biblioteca mágica personal. Todo lo que recibís y escribís queda guardado acá para siempre.</p></div>
      
      <div className="tabs-h">
        {[['intro','◇','¿Qué es?'],['lecturas','✦','Mis Lecturas'],['diario','✎','Mi Diario']].map(([k,i,t]) => 
          <button key={k} className={`tab ${tab===k?'act':''}`} onClick={() => setTab(k)}>{i} {t}</button>
        )}
      </div>
      
      {tab === 'intro' && (
        <div className="grim-intro">
          <div className="grim-intro-section">
            <h3>📜 ¿Qué es un Grimorio?</h3>
            <p>En la tradición mágica, un grimorio es el libro personal de una bruja, mago o practicante espiritual. Es donde se guardan hechizos, rituales, sueños, visiones, y todo el conocimiento acumulado en el camino.</p>
            <p>Tu grimorio en Mi Magia tiene dos partes:</p>
          </div>
          
          <div className="grim-intro-cards">
            <div className="grim-card" onClick={() => setTab('lecturas')}>
              <span>✦</span>
              <h4>Mis Lecturas</h4>
              <p>Todas las experiencias mágicas que solicites (tiradas de runas, lecturas del alma, registros akáshicos, etc.) quedan guardadas acá. Podés releerlas cuando quieras, encontrar patrones, ver tu evolución.</p>
            </div>
            <div className="grim-card" onClick={() => setTab('diario')}>
              <span>✎</span>
              <h4>Mi Diario</h4>
              <p>Tu espacio personal para escribir lo que quieras: reflexiones, sueños, señales que recibiste, rituales que hiciste, sincronicidades, gratitud, intenciones. Es privado y solo vos lo ves.</p>
            </div>
          </div>
          
          <div className="grim-tip">
            <strong>💡 Tip:</strong> Mantener un diario espiritual es una de las prácticas más poderosas para desarrollar la intuición. No tiene que ser largo ni elaborado - a veces una frase basta.
          </div>
        </div>
      )}
      
      {tab === 'lecturas' && (
        <div className="grim-lecturas">
          <h2>Mis Lecturas</h2>
          {usuario?.lecturas?.length > 0 ? (
            <div className="lecturas-lista">
              {usuario.lecturas.map((l, i) => (
                <div key={i} className="lectura-card">
                  <div className="lectura-head"><span className="lectura-tipo">{l.tipo}</span><span className="lectura-fecha">{l.fecha}</span></div>
                  <p className="lectura-preview">{l.resumen || l.contenido?.substring(0, 300)}...</p>
                  <button className="btn-sec">Leer completa</button>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-grim">
              <span>📜</span>
              <h3>Todavía no tenés lecturas</h3>
              <p>Cuando solicites una experiencia mágica (tirada de runas, lectura del alma, etc.), el resultado completo quedará guardado acá. Podrás releerlo cuando quieras, buscar patrones, ver cómo evoluciona tu camino.</p>
            </div>
          )}
        </div>
      )}
      
      {tab === 'diario' && (
        <div className="grim-diario">
          <h2>Mi Diario Mágico</h2>
          <p className="diario-intro">Tu espacio sagrado. Cada entrada es un hechizo, cada reflexión una semilla de magia.</p>

          {/* Barra de vista */}
          <div className="diario-vistas">
            <button className={`vista-btn ${vistaCalendario ? 'act' : ''}`} onClick={() => setVistaCalendario(true)}>
              📅 Calendario Lunar
            </button>
            <button className={`vista-btn ${!vistaCalendario ? 'act' : ''}`} onClick={() => setVistaCalendario(false)}>
              📜 Lista Cronológica
            </button>
          </div>

          {/* VISTA CALENDARIO */}
          {vistaCalendario && (
            <div className="diario-calendario">
              {/* Navegación del mes */}
              <div className="cal-nav">
                <button onClick={() => setMesActual(new Date(mesActual.getFullYear(), mesActual.getMonth() - 1))} className="cal-nav-btn">◀</button>
                <div className="cal-mes">
                  <span className="cal-mes-nombre">{mesActual.toLocaleDateString('es-UY', { month: 'long', year: 'numeric' })}</span>
                  <span className="cal-fase-hoy">{calcularFaseLunar(new Date()).icono} Luna {calcularFaseLunar(new Date()).nombre}</span>
                </div>
                <button onClick={() => setMesActual(new Date(mesActual.getFullYear(), mesActual.getMonth() + 1))} className="cal-nav-btn">▶</button>
              </div>

              {/* Cabecera días de la semana */}
              <div className="cal-header">
                {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(d => (
                  <div key={d} className="cal-header-dia">{d}</div>
                ))}
              </div>

              {/* Grid del calendario */}
              <div className="cal-grid">
                {obtenerDiasMes().map((d, i) => (
                  <div
                    key={i}
                    className={`cal-dia ${d.vacio ? 'vacio' : ''} ${d.esHoy ? 'hoy' : ''} ${d.tieneEntradas ? 'con-entradas' : ''} ${diaSeleccionado === d.fecha ? 'sel' : ''}`}
                    onClick={() => !d.vacio && setDiaSeleccionado(d.fecha === diaSeleccionado ? null : d.fecha)}
                  >
                    {!d.vacio && (
                      <>
                        <span className="cal-dia-num">{d.dia}</span>
                        <span className="cal-dia-luna" title={`Luna ${d.faseLunar.nombre}: ${d.faseLunar.energia}`}>{d.faseLunar.icono}</span>
                        {d.tieneEntradas && <span className="cal-dia-marker">✦</span>}
                      </>
                    )}
                  </div>
                ))}
              </div>

              {/* Leyenda */}
              <div className="cal-leyenda">
                <span><span className="marker-dot hoy"></span> Hoy</span>
                <span><span className="marker-dot entradas"></span> Tiene entradas</span>
                <span>🌑 Nueva → 🌕 Llena → 🌑</span>
              </div>

              {/* Entradas del día seleccionado */}
              {diaSeleccionado && (
                <div className="dia-seleccionado">
                  <h3>📖 {diaSeleccionado}</h3>
                  {(() => {
                    const fechaSel = obtenerDiasMes().find(d => d.fecha === diaSeleccionado);
                    return fechaSel && (
                      <div className="dia-info-luna">
                        {fechaSel.faseLunar.icono} Luna {fechaSel.faseLunar.nombre}
                        <span className="luna-energia">{fechaSel.faseLunar.energia}</span>
                      </div>
                    );
                  })()}
                  {entradasDelDia.length > 0 ? (
                    <div className="entradas-dia">
                      {entradasDelDia.map((e, i) => {
                        const tipo = TIPOS_DIARIO.find(t => t.id === e.tipo) || TIPOS_DIARIO[TIPOS_DIARIO.length - 1];
                        return (
                          <div key={i} className="entrada-mini">
                            <span className="entrada-mini-tipo">{tipo.i} {tipo.n}</span>
                            <p>{e.contenido}</p>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="sin-entradas">No hay entradas este día. ¿Querés agregar una reflexión?</p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* VISTA LISTA */}
          {!vistaCalendario && usuario?.diario?.length > 0 && (
            <div className="diario-entradas">
              <h3>Todas tus entradas</h3>
              {usuario.diario.slice().reverse().map((e, i) => {
                const tipo = TIPOS_DIARIO.find(t => t.id === e.tipo) || TIPOS_DIARIO[TIPOS_DIARIO.length - 1];
                return (
                  <div key={i} className="entrada-card">
                    <div className="entrada-head"><span>{tipo.i} {tipo.n}</span><span>{e.fecha}</span></div>
                    <p>{e.contenido}</p>
                  </div>
                );
              })}
            </div>
          )}

          {!vistaCalendario && (!usuario?.diario || usuario.diario.length === 0) && (
            <div className="empty-grim">
              <span>📜</span>
              <h3>Tu diario está vacío</h3>
              <p>Cada entrada que escribas aquí se guarda para siempre. Es tu registro mágico personal.</p>
            </div>
          )}

          {/* NUEVA ENTRADA */}
          <div className="diario-nuevo">
            <h3>✎ Nueva entrada</h3>
            <div className="tipos-entrada">
              {TIPOS_DIARIO.map(t => (
                <button key={t.id} className={`tipo-btn ${tipoEntrada === t.id ? 'act' : ''}`} onClick={() => setTipoEntrada(t.id)} title={t.desc}>
                  <span>{t.i}</span>{t.n}
                </button>
              ))}
            </div>
            <div className="tipo-desc">{TIPOS_DIARIO.find(t => t.id === tipoEntrada)?.desc}</div>
            <textarea
              placeholder="Escribí lo que tengas en mente... No hay reglas, es tu espacio sagrado."
              value={entrada}
              onChange={e => setEntrada(e.target.value)}
              rows={5}
            />
            <div className="diario-acciones">
              <button className="btn-gold" onClick={guardarEntrada} disabled={!entrada.trim() || guardando}>
                {guardando ? 'Guardando...' : 'Guardar en mi grimorio'}
              </button>
              <span className="tip-runa">+1 Runa por día de práctica</span>
            </div>
          </div>

          {/* Estadísticas del diario */}
          {usuario?.diario?.length > 0 && (
            <div className="diario-stats">
              <h4>Tu camino en números</h4>
              <div className="stats-grid">
                <div className="stat">
                  <span className="stat-num">{usuario.diario.length}</span>
                  <span className="stat-label">Entradas</span>
                </div>
                <div className="stat">
                  <span className="stat-num">{[...new Set(usuario.diario.map(e => e.fecha))].length}</span>
                  <span className="stat-label">Días practicando</span>
                </div>
                <div className="stat">
                  <span className="stat-num">{TIPOS_DIARIO.find(t => t.id === (usuario.diario.reduce((acc, e) => { acc[e.tipo] = (acc[e.tipo] || 0) + 1; return acc; }, {}), Object.entries(usuario.diario.reduce((acc, e) => { acc[e.tipo] = (acc[e.tipo] || 0) + 1; return acc; }, {})).sort((a, b) => b[1] - a[1])[0]?.[0]))?.i || '✦'}</span>
                  <span className="stat-label">Tipo favorito</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// FORO MÁGICO - Comunidad
// ═══════════════════════════════════════════════════════════════

const CATEGORIAS_FORO = [
  { id: 'general', nombre: 'General', icono: '💬', desc: 'Conversaciones libres de la comunidad' },
  { id: 'guardianes', nombre: 'Guardianes', icono: '🧙', desc: 'Experiencias con tus duendes' },
  { id: 'magia', nombre: 'Magia y Rituales', icono: '✨', desc: 'Comparte tus prácticas mágicas' },
  { id: 'suenos', nombre: 'Sueños y Visiones', icono: '🌙', desc: 'Interpretación de sueños' },
  { id: 'cristales', nombre: 'Cristales', icono: '💎', desc: 'Todo sobre cristales' },
  { id: 'ayuda', nombre: 'Ayuda', icono: '❓', desc: 'Preguntas y dudas' }
];

function ForoSec({ usuario, setUsuario }) {
  const [categoria, setCategoria] = useState('general');
  const [posts, setPosts] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [nuevoPost, setNuevoPost] = useState('');
  const [titulo, setTitulo] = useState('');
  const [mostrarNuevo, setMostrarNuevo] = useState(false);
  const [postSeleccionado, setPostSeleccionado] = useState(null);
  const [respuesta, setRespuesta] = useState('');
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    cargarPosts();
  }, [categoria]);

  const cargarPosts = async () => {
    setCargando(true);
    try {
      const res = await fetch(`${API_BASE}/api/foro?categoria=${categoria}`);
      const data = await res.json();
      if (data.success) {
        setPosts(data.posts || []);
      }
    } catch (e) {
      // Usar posts de ejemplo si no hay API
      setPosts(getPostsEjemplo(categoria));
    }
    setCargando(false);
  };

  const publicar = async () => {
    if (!titulo.trim() || !nuevoPost.trim()) return;
    setEnviando(true);
    try {
      const res = await fetch(`${API_BASE}/api/foro`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: usuario.email,
          autor: usuario.nombrePreferido,
          categoria,
          titulo: titulo.trim(),
          contenido: nuevoPost.trim()
        })
      });
      const data = await res.json();
      if (data.success) {
        setPosts([data.post, ...posts]);
        setNuevoPost('');
        setTitulo('');
        setMostrarNuevo(false);
      }
    } catch (e) {
      // Agregar localmente si falla
      const nuevoPostLocal = {
        id: Date.now(),
        autor: usuario.nombrePreferido,
        autorEmail: usuario.email,
        titulo: titulo.trim(),
        contenido: nuevoPost.trim(),
        categoria,
        fecha: new Date().toISOString(),
        respuestas: [],
        likes: 0
      };
      setPosts([nuevoPostLocal, ...posts]);
      setNuevoPost('');
      setTitulo('');
      setMostrarNuevo(false);
    }
    setEnviando(false);
  };

  const responderPost = async () => {
    if (!respuesta.trim() || !postSeleccionado) return;
    setEnviando(true);
    try {
      const res = await fetch(`${API_BASE}/api/foro/responder`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          postId: postSeleccionado.id,
          email: usuario.email,
          autor: usuario.nombrePreferido,
          contenido: respuesta.trim()
        })
      });
      const data = await res.json();
      if (data.success) {
        const nuevaRespuesta = {
          id: Date.now(),
          autor: usuario.nombrePreferido,
          contenido: respuesta.trim(),
          fecha: new Date().toISOString()
        };
        setPostSeleccionado({
          ...postSeleccionado,
          respuestas: [...(postSeleccionado.respuestas || []), nuevaRespuesta]
        });
        setRespuesta('');
      }
    } catch (e) {
      // Agregar localmente
      const nuevaRespuesta = {
        id: Date.now(),
        autor: usuario.nombrePreferido,
        contenido: respuesta.trim(),
        fecha: new Date().toISOString()
      };
      setPostSeleccionado({
        ...postSeleccionado,
        respuestas: [...(postSeleccionado.respuestas || []), nuevaRespuesta]
      });
      setRespuesta('');
    }
    setEnviando(false);
  };

  const formatearFecha = (fecha) => {
    const d = new Date(fecha);
    const ahora = new Date();
    const diff = Math.floor((ahora - d) / (1000 * 60));
    if (diff < 1) return 'Ahora mismo';
    if (diff < 60) return `Hace ${diff} min`;
    if (diff < 1440) return `Hace ${Math.floor(diff / 60)}h`;
    return d.toLocaleDateString('es-UY', { day: 'numeric', month: 'short' });
  };

  const getPostsEjemplo = (cat) => [
    {
      id: 1,
      autor: 'Valeria',
      titulo: cat === 'guardianes' ? 'Mi Finnegan me salvó el día!' : '¿Cómo limpiar mi espacio?',
      contenido: cat === 'guardianes'
        ? 'Les cuento que ayer tuve un día muy difícil en el trabajo. Cuando llegué a casa, mi Finnegan estaba en un lugar diferente (juro que lo dejé en el altar). Lo tomé en mis manos y sentí una paz increíble. ¿Les pasa que sienten que sus guardianes les "hablan"?'
        : 'Hola a todos! Soy nueva en esto y quería preguntarles cómo hacen para limpiar energéticamente su hogar. Mi guardián acaba de llegar y quiero que su espacio esté impecable.',
      categoria: cat,
      fecha: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      respuestas: [
        { id: 1, autor: 'Mariana', contenido: '¡Me pasa todo el tiempo! Son increíbles.', fecha: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString() },
        { id: 2, autor: 'Lucia', contenido: 'Finnegan es muy especial. Mi Bramble también me acompaña mucho.', fecha: new Date(Date.now() - 30 * 60 * 1000).toISOString() }
      ],
      likes: 12
    },
    {
      id: 2,
      autor: 'Carolina',
      titulo: cat === 'cristales' ? 'Cuarzo rosa vs Rodocrosita' : 'Ritual de luna llena',
      contenido: cat === 'cristales'
        ? 'Estoy buscando un cristal para trabajar el amor propio. ¿Qué me recomiendan, cuarzo rosa o rodocrosita? Mi guardián tiene citrino y cuarzo ahumado.'
        : 'Este viernes es luna llena! ¿Alguien quiere compartir sus rituales? Yo siempre cargo mis cristales y escribo intenciones.',
      categoria: cat,
      fecha: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      respuestas: [],
      likes: 8
    },
    {
      id: 3,
      autor: 'Sofía',
      titulo: 'Nuevo en la familia!',
      contenido: 'Les presento a mi primer guardián! Es un Willow y estoy emocionadísima. ¿Algún consejo para conectar mejor con él en los primeros días?',
      categoria: cat,
      fecha: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      respuestas: [
        { id: 1, autor: 'Duendes del Uruguay', contenido: '¡Bienvenida Sofía! Lo más importante es hablarle, contarle tus cosas, ponerlo en un lugar especial. La conexión crece con el tiempo. ✨', fecha: new Date(Date.now() - 23 * 60 * 60 * 1000).toISOString() }
      ],
      likes: 24
    }
  ];

  if (postSeleccionado) {
    return (
      <div className="sec">
        <button className="btn-back" onClick={() => setPostSeleccionado(null)}>← Volver al foro</button>

        <div className="foro-post-full">
          <div className="post-header">
            <div className="post-avatar">{postSeleccionado.autor.charAt(0)}</div>
            <div className="post-meta">
              <strong>{postSeleccionado.autor}</strong>
              <span>{formatearFecha(postSeleccionado.fecha)}</span>
            </div>
          </div>
          <h2 className="post-titulo">{postSeleccionado.titulo}</h2>
          <p className="post-contenido">{postSeleccionado.contenido}</p>

          <div className="post-acciones">
            <span>❤️ {postSeleccionado.likes || 0} me gusta</span>
            <span>💬 {(postSeleccionado.respuestas || []).length} respuestas</span>
          </div>
        </div>

        {(postSeleccionado.respuestas || []).length > 0 && (
          <div className="foro-respuestas">
            <h3>Respuestas</h3>
            {postSeleccionado.respuestas.map((r, i) => (
              <div key={r.id || i} className="respuesta-card">
                <div className="respuesta-avatar">{r.autor.charAt(0)}</div>
                <div className="respuesta-content">
                  <div className="respuesta-meta">
                    <strong>{r.autor}</strong>
                    <span>{formatearFecha(r.fecha)}</span>
                  </div>
                  <p>{r.contenido}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="foro-responder">
          <h3>Tu respuesta</h3>
          <textarea
            placeholder="Comparte tu experiencia o ayuda a tu compañera..."
            value={respuesta}
            onChange={e => setRespuesta(e.target.value)}
            rows={3}
          />
          <button className="btn-gold" onClick={responderPost} disabled={!respuesta.trim() || enviando}>
            {enviando ? 'Enviando...' : 'Responder'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="sec">
      <div className="sec-head">
        <h1>💬 Foro Mágico</h1>
        <p>Conectá con la comunidad de guardianas y guardianes.</p>
      </div>

      <div className="foro-categorias">
        {CATEGORIAS_FORO.map(cat => (
          <button
            key={cat.id}
            className={`foro-cat ${categoria === cat.id ? 'act' : ''}`}
            onClick={() => setCategoria(cat.id)}
          >
            <span>{cat.icono}</span>
            <span>{cat.nombre}</span>
          </button>
        ))}
      </div>

      <div className="foro-acciones">
        <button className="btn-gold" onClick={() => setMostrarNuevo(!mostrarNuevo)}>
          {mostrarNuevo ? 'Cancelar' : '+ Nueva publicación'}
        </button>
      </div>

      {mostrarNuevo && (
        <div className="foro-nuevo">
          <h3>Nueva publicación en {CATEGORIAS_FORO.find(c => c.id === categoria)?.nombre}</h3>
          <input
            type="text"
            placeholder="Título de tu publicación"
            value={titulo}
            onChange={e => setTitulo(e.target.value)}
            className="foro-titulo-input"
          />
          <textarea
            placeholder="¿Qué querés compartir con la comunidad?"
            value={nuevoPost}
            onChange={e => setNuevoPost(e.target.value)}
            rows={5}
          />
          <button className="btn-gold" onClick={publicar} disabled={!titulo.trim() || !nuevoPost.trim() || enviando}>
            {enviando ? 'Publicando...' : 'Publicar'}
          </button>
        </div>
      )}

      {cargando ? (
        <div className="foro-loading">Cargando publicaciones...</div>
      ) : posts.length === 0 ? (
        <div className="foro-empty">
          <span>✦</span>
          <h3>Sé la primera en publicar</h3>
          <p>Esta categoría está esperando tu voz. ¡Compartí algo con la comunidad!</p>
        </div>
      ) : (
        <div className="foro-posts">
          {posts.map(post => (
            <div key={post.id} className="foro-post-card" onClick={() => setPostSeleccionado(post)}>
              <div className="post-avatar">{post.autor.charAt(0)}</div>
              <div className="post-content">
                <h4>{post.titulo}</h4>
                <p>{post.contenido.substring(0, 150)}{post.contenido.length > 150 ? '...' : ''}</p>
                <div className="post-footer">
                  <span className="post-autor">{post.autor}</span>
                  <span className="post-fecha">{formatearFecha(post.fecha)}</span>
                  <span className="post-stats">💬 {(post.respuestas || []).length} · ❤️ {post.likes || 0}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// UTILIDADES MÁGICAS
// ═══════════════════════════════════════════════════════════════

function UtilidadesSec({ usuario }) {
  const [utilidad, setUtilidad] = useState(null);

  const UTILIDADES = [
    {
      id: 'luna',
      nombre: 'Fase Lunar',
      icono: '🌙',
      desc: 'Consulta la fase lunar actual y su energía',
      render: () => {
        const calcularFase = () => {
          const fecha = new Date();
          const cicloLunar = 29.530588853;
          const lunaLlena = new Date(2024, 0, 25);
          const diff = (fecha - lunaLlena) / (1000 * 60 * 60 * 24);
          const fase = ((diff % cicloLunar) + cicloLunar) % cicloLunar;
          if (fase < 1.84566) return { nombre: 'Luna Nueva', icono: '🌑', energia: 'Nuevos comienzos, siembra intenciones, introspección', ritual: 'Escribe tus intenciones en papel, medita sobre lo que quieres crear' };
          if (fase < 7.38264) return { nombre: 'Luna Creciente', icono: '🌒', energia: 'Manifestación, tomar acción, crecimiento', ritual: 'Trabaja activamente hacia tus metas, haz rituales de atracción' };
          if (fase < 9.22830) return { nombre: 'Cuarto Creciente', icono: '🌓', energia: 'Decisiones, compromiso, superar obstáculos', ritual: 'Toma decisiones importantes, rompe bloqueos' };
          if (fase < 14.76528) return { nombre: 'Luna Gibosa', icono: '🌔', energia: 'Refinamiento, paciencia, ajustes', ritual: 'Ajusta tus planes, ten paciencia, confía en el proceso' };
          if (fase < 16.61094) return { nombre: 'Luna Llena', icono: '🌕', energia: 'Culminación, gratitud, magia potente', ritual: 'Carga cristales, celebra logros, haz rituales poderosos' };
          if (fase < 22.14792) return { nombre: 'Luna Diseminante', icono: '🌖', energia: 'Compartir, gratitud, enseñar', ritual: 'Comparte tu sabiduría, practica gratitud' };
          if (fase < 23.99358) return { nombre: 'Cuarto Menguante', icono: '🌗', energia: 'Soltar, liberar, perdonar', ritual: 'Libera lo que no te sirve, rituales de limpieza' };
          return { nombre: 'Luna Balsámica', icono: '🌘', energia: 'Descanso, limpieza, preparación', ritual: 'Descansa, limpia espacios, prepárate para el nuevo ciclo' };
        };
        const fase = calcularFase();
        return (
          <div className="util-content">
            <div className="luna-actual">
              <span className="luna-icono">{fase.icono}</span>
              <h3>{fase.nombre}</h3>
            </div>
            <div className="luna-info">
              <div className="luna-energia">
                <strong>Energía:</strong>
                <p>{fase.energia}</p>
              </div>
              <div className="luna-ritual">
                <strong>Ritual sugerido:</strong>
                <p>{fase.ritual}</p>
              </div>
            </div>
          </div>
        );
      }
    },
    {
      id: 'numerologia',
      nombre: 'Número del Día',
      icono: '🔢',
      desc: 'Tu número personal para hoy',
      render: () => {
        const hoy = new Date();
        const dia = hoy.getDate();
        const mes = hoy.getMonth() + 1;
        const anio = hoy.getFullYear();
        const suma = String(dia + mes + anio).split('').reduce((a, b) => a + parseInt(b), 0);
        const numero = suma > 9 ? String(suma).split('').reduce((a, b) => a + parseInt(b), 0) : suma;
        const significados = {
          1: { nombre: 'Liderazgo', mensaje: 'Día para iniciar proyectos, tomar la iniciativa. Tu energía es de creador/a.' },
          2: { nombre: 'Cooperación', mensaje: 'Día para trabajar en equipo, escuchar, ser diplomático/a. La paciencia es clave.' },
          3: { nombre: 'Creatividad', mensaje: 'Día para expresarte, crear, comunicar. Tu alegría inspira a otros.' },
          4: { nombre: 'Estabilidad', mensaje: 'Día para construir bases sólidas, organizar, planificar.' },
          5: { nombre: 'Cambio', mensaje: 'Día para aventurarte, cambiar rutinas, ser flexible.' },
          6: { nombre: 'Amor', mensaje: 'Día para nutrir relaciones, el hogar, la familia. El amor sana.' },
          7: { nombre: 'Introspección', mensaje: 'Día para meditar, estudiar, buscar respuestas internas.' },
          8: { nombre: 'Abundancia', mensaje: 'Día para manifestar, trabajar en proyectos materiales.' },
          9: { nombre: 'Completud', mensaje: 'Día para cerrar ciclos, soltar, servir a otros.' }
        };
        const sig = significados[numero] || significados[9];
        return (
          <div className="util-content">
            <div className="numero-dia">
              <span className="numero-grande">{numero}</span>
              <h3>{sig.nombre}</h3>
            </div>
            <p className="numero-mensaje">{sig.mensaje}</p>
            <small>Basado en {hoy.toLocaleDateString('es-UY')}</small>
          </div>
        );
      }
    },
    {
      id: 'color',
      nombre: 'Color del Día',
      icono: '🎨',
      desc: 'Qué color te favorece hoy',
      render: () => {
        const colores = [
          { nombre: 'Rojo', hex: '#e74c3c', energia: 'Pasión, energía, acción. Úsalo cuando necesites motivación.' },
          { nombre: 'Naranja', hex: '#e67e22', energia: 'Creatividad, alegría, socialización. Ideal para conectar.' },
          { nombre: 'Amarillo', hex: '#f1c40f', energia: 'Claridad mental, optimismo, intelecto. Bueno para estudiar.' },
          { nombre: 'Verde', hex: '#27ae60', energia: 'Sanación, equilibrio, naturaleza. Perfecto para sanar.' },
          { nombre: 'Azul', hex: '#3498db', energia: 'Calma, comunicación, verdad. Ideal para hablar desde el corazón.' },
          { nombre: 'Índigo', hex: '#8e44ad', energia: 'Intuición, espiritualidad, visión. Bueno para meditar.' },
          { nombre: 'Violeta', hex: '#9b59b6', energia: 'Transformación, conexión divina, magia. Día de rituales.' }
        ];
        const diaSemana = new Date().getDay();
        const color = colores[diaSemana];
        return (
          <div className="util-content">
            <div className="color-dia" style={{ background: color.hex }}>
              <span className="color-nombre">{color.nombre}</span>
            </div>
            <p className="color-energia">{color.energia}</p>
            <small>Color asociado al día de hoy</small>
          </div>
        );
      }
    },
    {
      id: 'afirmacion',
      nombre: 'Afirmación',
      icono: '✨',
      desc: 'Tu afirmación positiva del día',
      render: () => {
        const afirmaciones = [
          'Soy merecedor/a de todo lo bueno que la vida tiene para mí.',
          'Mi intuición me guía hacia las decisiones correctas.',
          'Cada día me acerco más a la versión más mágica de mí.',
          'El universo conspira a mi favor.',
          'Soy un imán para la abundancia y las bendiciones.',
          'Mi energía es poderosa y transforma todo lo que toca.',
          'Confío en el timing divino de mi vida.',
          'Soy luz, soy magia, soy poder.',
          'Libero lo que no me sirve y abrazo lo nuevo.',
          'Mis sueños son válidos y están en camino.',
          'La magia fluye a través de mí en todo momento.',
          'Merezco amor, paz y felicidad.'
        ];
        const hoy = new Date();
        const indice = (hoy.getDate() + hoy.getMonth()) % afirmaciones.length;
        return (
          <div className="util-content afirmacion-box">
            <div className="afirmacion-icono">✦</div>
            <p className="afirmacion-texto">"{afirmaciones[indice]}"</p>
            <small>Repetí esta afirmación 3 veces frente al espejo</small>
          </div>
        );
      }
    },
    {
      id: 'elemento',
      nombre: 'Elemento del Día',
      icono: '🌍',
      desc: 'Qué elemento te acompaña hoy',
      render: () => {
        const elementos = [
          { nombre: 'Tierra', icono: '🌿', color: '#27ae60', consejo: 'Conectá con la naturaleza, caminá descalza si podés. Hoy es buen día para la estabilidad y la práctica.' },
          { nombre: 'Agua', icono: '💧', color: '#3498db', consejo: 'Fluí con las emociones, tomá un baño ritual, limpiá con agua sagrada. Día de intuición.' },
          { nombre: 'Fuego', icono: '🔥', color: '#e74c3c', consejo: 'Encendé una vela, trabajá con tu pasión. Hoy es día de acción y transformación.' },
          { nombre: 'Aire', icono: '🌬️', color: '#9b59b6', consejo: 'Meditá, respirá profundo, quemá incienso. Día de claridad mental y comunicación.' }
        ];
        const diaDelAnio = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
        const elemento = elementos[diaDelAnio % 4];
        return (
          <div className="util-content">
            <div className="elemento-dia" style={{ background: elemento.color }}>
              <span className="elemento-icono">{elemento.icono}</span>
              <h3>{elemento.nombre}</h3>
            </div>
            <p className="elemento-consejo">{elemento.consejo}</p>
          </div>
        );
      }
    }
  ];

  if (utilidad) {
    const util = UTILIDADES.find(u => u.id === utilidad);
    return (
      <div className="sec">
        <button className="btn-back" onClick={() => setUtilidad(null)}>← Volver</button>
        <div className="util-header">
          <span className="util-icono-grande">{util.icono}</span>
          <h2>{util.nombre}</h2>
        </div>
        {util.render()}
      </div>
    );
  }

  return (
    <div className="sec">
      <div className="sec-head">
        <h1>⚡ Utilidades Mágicas</h1>
        <p>Herramientas diarias para tu práctica espiritual.</p>
      </div>

      <div className="utils-grid">
        {UTILIDADES.map(util => (
          <div key={util.id} className="util-card" onClick={() => setUtilidad(util.id)}>
            <span className="util-icono">{util.icono}</span>
            <h3>{util.nombre}</h3>
            <p>{util.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// FAQ DUENDES
// ═══════════════════════════════════════════════════════════════

const FAQS = [
  {
    categoria: 'Sobre los Guardianes',
    preguntas: [
      {
        q: '¿Qué es un guardián/duende?',
        a: 'Los guardianes son seres elementales que canalizamos en forma física a través de figuras únicas. Cada uno tiene su propia energía, personalidad y propósito. No son simples decoraciones: son compañeros espirituales que te acompañan y protegen.'
      },
      {
        q: '¿Cómo se "activa" mi guardián?',
        a: 'Cada guardián viene ya activado energéticamente. Al recibirlo, te recomendamos presentarte (decirle tu nombre y bienvenirlo), colocarlo en un lugar especial, y hablarle como si fuera un amigo. La conexión se profundiza con el tiempo.'
      },
      {
        q: '¿Puedo tener más de un guardián?',
        a: '¡Absolutamente! Muchas personas tienen varios guardianes, cada uno con diferentes propósitos. Algunos protegen el hogar, otros acompañan la meditación, otros cuidan los sueños. Entre ellos se llevan bien.'
      },
      {
        q: '¿Los guardianes se rompen o dañan?',
        a: 'Físicamente son muy resistentes, pero si alguna vez se daña, no significa que la energía se haya ido. IMPORTANTE: No realizamos reparaciones de guardianes. Si tu guardián se daña, podés agradecerle por su servicio y enterrarlo en la tierra para devolver su energía a la naturaleza.'
      }
    ]
  },
  {
    categoria: 'Runas y Tréboles',
    preguntas: [
      {
        q: '¿Qué son las runas?',
        a: 'Las runas (ᚱ) son nuestra moneda mágica para experiencias. Las podés obtener de tres formas: comprándolas directamente en packs, recibiéndolas como beneficio de tu membresía del Círculo, o como regalo especial en ocasiones. Las usás para acceder a lecturas, tiradas, y experiencias espirituales personalizadas. NO se ganan al comprar guardianes.'
      },
      {
        q: '¿Qué son los tréboles?',
        a: 'Los tréboles (☘️) son nuestra moneda de fidelidad. Ganás 1 trébol por cada $10 USD (o equivalente en pesos uruguayos) que gastás en la tienda. Podés canjearlos por descuentos, envío gratis, días de Círculo, productos y más. A veces también los regalamos en ocasiones especiales.'
      },
      {
        q: '¿Las runas y tréboles expiran?',
        a: 'No, nunca expiran. Permanecen en tu cuenta para siempre hasta que decidas usarlos.'
      }
    ]
  },
  {
    categoria: 'El Círculo de Duendes',
    preguntas: [
      {
        q: '¿Qué es el Círculo?',
        a: 'El Círculo de Duendes es nuestra membresía premium. Te da acceso a contenido exclusivo semanal, runas y tréboles extra cada mes, tiradas gratuitas, acceso anticipado a nuevos guardianes, y más beneficios según tu plan.'
      },
      {
        q: '¿Puedo cancelar cuando quiera?',
        a: 'Sí, podés cancelar en cualquier momento. Tu acceso continúa hasta el final del período pagado.'
      },
      {
        q: '¿Qué incluye cada plan?',
        a: 'Cada plan tiene beneficios diferentes. Consultá la sección Círculo en Mi Magia para ver el detalle de runas, tréboles, tiradas y descuentos de cada uno.'
      }
    ]
  },
  {
    categoria: 'Envíos y Pedidos',
    preguntas: [
      {
        q: '¿Hacen envíos internacionales?',
        a: '¡Sí! Enviamos a todo el mundo. Los guardianes viajan con mucho amor y protección. El envío internacional es por DHL y tarda aproximadamente 7-15 días.'
      },
      {
        q: '¿Cuánto tarda mi pedido?',
        a: 'En Uruguay: 2-5 días hábiles. Internacional: 7-15 días. Cada guardián es único y a veces necesitamos unos días extra para prepararlo con el cuidado que merece.'
      },
      {
        q: '¿Puedo rastrear mi pedido?',
        a: 'Sí, te enviamos el número de seguimiento por email cuando tu guardián sale de viaje hacia vos.'
      }
    ]
  },
  {
    categoria: 'Cristales y Energía',
    preguntas: [
      {
        q: '¿Cómo limpio mis cristales?',
        a: 'Hay varias formas: luz de luna (ideal luna llena), humo de salvia o palo santo, enterrarlos en sal gruesa por 24h, o ponerlos sobre selenita. Cada cristal tiene sus preferencias - consultá nuestra guía de cristales.'
      },
      {
        q: '¿Cada cuánto debo limpiarlos?',
        a: 'Depende del uso. Si trabajás mucho con ellos, una vez por semana. Si son decorativos, una vez al mes en luna llena es suficiente. Confía en tu intuición - si sentís que lo necesitan, limpiálos.'
      }
    ]
  }
];

function FaqSec() {
  const [categoriaAbierta, setCategoriaAbierta] = useState(FAQS[0].categoria);
  const [preguntaAbierta, setPreguntaAbierta] = useState(null);

  return (
    <div className="sec">
      <div className="sec-head">
        <h1>❓ Preguntas Frecuentes</h1>
        <p>Todo lo que necesitás saber sobre Duendes del Uruguay.</p>
      </div>

      <div className="faq-categorias">
        {FAQS.map(cat => (
          <button
            key={cat.categoria}
            className={`faq-cat ${categoriaAbierta === cat.categoria ? 'act' : ''}`}
            onClick={() => { setCategoriaAbierta(cat.categoria); setPreguntaAbierta(null); }}
          >
            {cat.categoria}
          </button>
        ))}
      </div>

      <div className="faq-lista">
        {FAQS.find(c => c.categoria === categoriaAbierta)?.preguntas.map((faq, i) => (
          <div
            key={i}
            className={`faq-item ${preguntaAbierta === i ? 'abierta' : ''}`}
          >
            <button
              className="faq-pregunta"
              onClick={() => setPreguntaAbierta(preguntaAbierta === i ? null : i)}
            >
              <span>{faq.q}</span>
              <span className="faq-arrow">{preguntaAbierta === i ? '−' : '+'}</span>
            </button>
            {preguntaAbierta === i && (
              <div className="faq-respuesta">
                <p>{faq.a}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="faq-contacto">
        <h3>¿No encontraste lo que buscabas?</h3>
        <p>Escribinos y te ayudamos.</p>
        <a href="https://wa.me/59899123456" target="_blank" rel="noopener" className="btn-gold">
          💬 Contactar por WhatsApp
        </a>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// TITO
// ═══════════════════════════════════════════════════════════════

function Tito({ usuario, abierto, setAbierto }) {
  const [msgs, setMsgs] = useState([]);
  const [input, setInput] = useState('');
  const [env, setEnv] = useState(false);
  
  const enviar = async () => {
    if (!input.trim() || env) return;
    const m = input.trim(); setInput('');
    const nuevosMsgs = [...msgs, { r: 'u', t: m }];
    setMsgs(nuevosMsgs); setEnv(true);
    try {
      // Enviar historial de conversación para mantener contexto
      const historial = nuevosMsgs.slice(-10).map(msg => ({
        role: msg.r === 'u' ? 'user' : 'assistant',
        content: msg.t
      }));
      const contexto = `[CONTEXTO MI MAGIA: Usuario con ${usuario?.runas||0} runas, ${usuario?.treboles||0} tréboles. Secciones: Canalizaciones (guardianes, lecturas, regalos), Jardín Mágico (tréboles/runas), Experiencias (lecturas mágicas), Regalos, Reino Elemental, Cuidados, Cristales, Círculo (membresía), Grimorio (lecturas y diario). 1 trébol = $10 USD. Runas para experiencias.]
IMPORTANTE: Mantené el contexto de la conversación. Si el usuario dice "ayudame" o "sí" o "dale", referite a lo que acabás de decir/ofrecer.
Mensaje actual: ${m}`;
      const res = await fetch(`${API_BASE}/api/tito/chat`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message: contexto, email: usuario?.email, history: historial }) });
      const data = await res.json();
      setMsgs(prev => [...prev, { r: 't', t: data.response || 'Hubo un error, intentá de nuevo.' }]);
    } catch(e) { setMsgs(prev => [...prev, { r: 't', t: 'Error de conexión.' }]); }
    setEnv(false);
  };
  
  return (
    <>
      <button className="tito-btn" onClick={() => setAbierto(!abierto)}>
        <img src={TITO_IMG} alt="Tito" onError={e => e.target.style.display='none'} />
        <span className="tito-fb">T</span>
      </button>
      {abierto && (
        <div className="tito-chat">
          <div className="tito-head">
            <img src={TITO_IMG} alt="" className="tito-av" onError={e => e.target.style.display='none'} />
            <div><strong>Tito</strong><small>Tu guía</small></div>
            <button onClick={() => setAbierto(false)}>✕</button>
          </div>
          <div className="tito-msgs">
            <div className="msg-t"><p>¡Hola {usuario?.nombrePreferido}! Soy Tito. Preguntame sobre Mi Magia, los tréboles, las runas, las experiencias, o lo que necesites.</p></div>
            {msgs.map((m,i) => <div key={i} className={m.r==='u'?'msg-u':'msg-t'}><p>{m.t}</p></div>)}
            {env && <div className="msg-t"><p>...</p></div>}
          </div>
          <div className="tito-input">
            <input placeholder="Tu pregunta..." value={input} onChange={e => setInput(e.target.value)} onKeyPress={e => e.key==='Enter' && enviar()} />
            <button onClick={enviar} disabled={env}>→</button>
          </div>
        </div>
      )}
    </>
  );
}

// ═══════════════════════════════════════════════════════════════
// ESTILOS
// ═══════════════════════════════════════════════════════════════

const estilos = `
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600&family=Cormorant+Garamond:wght@400;500;600&display=swap');
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'Cormorant Garamond',Georgia,serif;background:#FFFEF9;color:#1a1a1a;font-size:18px;line-height:1.6}
.app{min-height:100vh}
.header{position:fixed;top:0;left:0;right:0;height:65px;background:#fff;border-bottom:1px solid #f0f0f0;display:flex;align-items:center;justify-content:space-between;padding:0 2rem;z-index:100}
.logo{font-family:'Cinzel',serif;font-size:1rem;letter-spacing:2px;display:flex;align-items:center;gap:0.5rem}
.logo span{color:#d4af37}
.user-info{color:#666;font-size:0.95rem}
.hstats{display:flex;gap:1rem;font-family:'Cinzel',serif;font-size:0.85rem;color:#1a1a1a;font-weight:600}
.hstats span{background:linear-gradient(135deg,#1a1a1a,#333);color:#fff;padding:0.3rem 0.6rem;border-radius:20px;font-size:0.8rem}
.menu-btn{display:none;flex-direction:column;gap:5px;background:#f5f5f5;border:2px solid #ddd;border-radius:8px;cursor:pointer;padding:10px;min-width:44px;min-height:44px;justify-content:center;align-items:center;-webkit-tap-highlight-color:transparent;touch-action:manipulation}
.menu-btn:active{background:#e5e5e5;border-color:#ccc}
.menu-btn span{width:20px;height:2px;background:#1a1a1a;border-radius:2px;display:block}
.nav-overlay{display:none;position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:98}
.nav{position:fixed;top:65px;left:0;bottom:0;width:240px;background:#fff;border-right:1px solid #f0f0f0;padding:1rem 0;display:flex;flex-direction:column;z-index:99;overflow-y:auto}
.nav-item{display:flex;align-items:center;gap:0.75rem;padding:0.75rem 1.5rem;background:none;border:none;text-align:left;cursor:pointer;font-family:'Cormorant Garamond',serif;font-size:1rem;color:#666;transition:all 0.2s}
.nav-item:hover{background:#fafafa;color:#1a1a1a}
.nav-item.activo{background:#f5f5f5;color:#1a1a1a;border-left:3px solid #d4af37}
.nav-i{color:#d4af37;width:20px;text-align:center}
.nav-sep{font-family:'Cinzel',serif;font-size:0.65rem;letter-spacing:1px;color:#999;padding:1.25rem 1.5rem 0.5rem;text-transform:uppercase}
.nav-volver{margin-top:auto;padding:1rem 1.5rem;color:#d4af37;text-decoration:none;font-size:0.9rem}
.contenido{margin-left:240px;margin-top:65px;min-height:calc(100vh - 65px)}
.sec{padding:2rem 2.5rem;max-width:1100px}
.sec-head{margin-bottom:2rem}
.sec-head h1{font-family:'Cinzel',serif;font-size:1.8rem;font-weight:500;margin-bottom:0.5rem}
.sec-head p{color:#666}
.sec-titulo{font-family:'Cinzel',serif;font-size:1.2rem;font-weight:500;margin:2rem 0 1rem}
.banner{background:#1a1a1a;border-radius:16px;padding:2.5rem;margin-bottom:2rem;position:relative}
.banner-rango{display:flex;align-items:center;gap:1rem;margin-bottom:1rem}
.rango-icono{font-size:2.5rem}
.rango-info{display:flex;flex-direction:column}
.rango-nombre{font-family:'Cinzel',serif;color:#d4af37;font-size:1rem}
.rango-ben{font-size:0.8rem;color:rgba(255,255,255,0.6)}
.progreso-rango{margin-top:1.5rem}
.progreso-bar{height:6px;background:rgba(255,255,255,0.2);border-radius:3px;overflow:hidden}
.progreso-fill{height:100%;background:linear-gradient(90deg,#d4af37,#f4d03f);border-radius:3px;transition:width 0.5s}
.progreso-rango small{display:block;margin-top:0.5rem;color:rgba(255,255,255,0.5);font-size:0.75rem}
.banner h1{font-family:'Cinzel',serif;font-size:1.8rem;color:#fff;margin-bottom:0.5rem}
.banner p{color:rgba(255,255,255,0.7)}
.stats-g{display:grid;grid-template-columns:repeat(4,1fr);gap:1rem;margin-bottom:2rem}
.stat-c{background:#fff;border:1px solid #f0f0f0;border-radius:12px;padding:1.25rem;cursor:pointer;transition:all 0.2s;text-align:center}
.stat-c:hover{border-color:#d4af37}
.stat-n{font-family:'Cinzel',serif;font-size:2rem;line-height:1;color:#d4af37}
.stat-t{font-size:0.85rem;color:#666;margin-top:0.25rem}
.accesos-g{display:grid;grid-template-columns:repeat(3,1fr);gap:1rem;margin-bottom:2rem}
.acceso{background:#fff;border:1px solid #f0f0f0;border-radius:12px;padding:1.25rem;cursor:pointer;text-align:left;transition:all 0.2s}
.acceso:hover{border-color:#d4af37}
.acceso span{font-size:1.5rem;color:#d4af37}
.acceso strong{display:block;font-family:'Cinzel',serif;margin:0.5rem 0 0.25rem}
.acceso small{color:#666;font-size:0.85rem}
.banner-circ{background:linear-gradient(135deg,#1a1a1a,#2a2a2a);border-radius:12px;padding:1.25rem 1.5rem;display:flex;align-items:center;gap:1.25rem;cursor:pointer;margin-bottom:2rem}
.banner-circ span:first-child{font-size:2rem;color:#d4af37}
.banner-circ h3{font-family:'Cinzel',serif;color:#fff;font-size:1rem}
.banner-circ p{color:rgba(255,255,255,0.7);font-size:0.85rem}
.badge{background:#d4af37;color:#1a1a1a;padding:0.25rem 0.75rem;border-radius:20px;font-family:'Cinzel',serif;font-size:0.7rem;font-weight:600}
.info-box{background:#fafafa;border-radius:12px;padding:1.5rem;margin-top:2rem}
.info-box h3{font-family:'Cinzel',serif;margin-bottom:1rem}
.info-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:1.5rem}
.info-grid div{text-align:center}
.info-grid span{font-size:1.5rem;color:#d4af37}
.info-grid h4{font-family:'Cinzel',serif;margin:0.5rem 0 0.25rem;font-size:0.95rem}
.info-grid p{font-size:0.85rem;color:#666}
.tabs-h{display:flex;gap:0.5rem;margin-bottom:1.5rem;flex-wrap:wrap}
.tab{padding:0.5rem 1rem;background:#fff;border:1px solid #f0f0f0;border-radius:50px;font-family:'Cinzel',serif;font-size:0.85rem;cursor:pointer;transition:all 0.2s}
.tab:hover{border-color:#d4af37}
.tab.act{background:#1a1a1a;color:#fff;border-color:#1a1a1a}
.cana-content,.tab-content,.grim-content{background:#fff;border:1px solid #f0f0f0;border-radius:12px;padding:1.5rem}
.items-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:1rem}
.item-card{border:1px solid #f0f0f0;border-radius:12px;overflow:hidden}
.item-img{height:150px;background:#f5f5f5;display:flex;align-items:center;justify-content:center;font-size:2rem;color:#ddd}
.item-img img{width:100%;height:100%;object-fit:cover}
.item-card h4{font-family:'Cinzel',serif;padding:0.75rem 0.75rem 0.25rem;font-size:0.95rem}
.item-card small{color:#666;font-size:0.8rem;padding:0 0.75rem 0.75rem;display:block}
.empty-tab{text-align:center;padding:2rem}
.empty-tab span{font-size:2.5rem;color:#ddd}
.empty-tab h3{font-family:'Cinzel',serif;margin:0.5rem 0}
.empty-tab p{color:#666;max-width:400px;margin:0 auto 1rem}
.lecturas-list{display:flex;flex-direction:column;gap:1rem}
.lectura-item{border-bottom:1px solid #f0f0f0;padding-bottom:1rem}
.lectura-item:last-child{border:none}
.lec-fecha{font-size:0.8rem;color:#999}
.lectura-item h4{font-family:'Cinzel',serif;margin:0.25rem 0}
.lectura-item p{font-size:0.9rem;color:#666}
.balances{display:grid;grid-template-columns:repeat(2,1fr);gap:1.5rem;margin-bottom:2rem}
.bal-card{background:#fff;border:1px solid #f0f0f0;border-radius:12px;padding:1.5rem;display:flex;align-items:center;gap:1.25rem}
.bal-icon{font-size:2.5rem;color:#d4af37}
.bal-num{font-family:'Cinzel',serif;font-size:2.5rem;line-height:1}
.bal-label{font-size:0.9rem;color:#666}
.explicacion-box{background:#fafafa;border-radius:12px;padding:1.25rem;margin-bottom:1.5rem}
.explicacion-box h3{font-family:'Cinzel',serif;margin-bottom:0.5rem;font-size:1rem}
.explicacion-box p{color:#666;font-size:0.95rem;margin-bottom:0.5rem}
.explicacion-box p:last-child{margin:0}
.msg{padding:1rem;border-radius:8px;margin-bottom:1rem}
.msg.error{background:#fef2f2;color:#991b1b;border:1px solid #fecaca}
.msg.ok{background:#f0fdf4;color:#166534;border:1px solid #bbf7d0}
.canjes-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:1rem;margin-bottom:2rem}
.canje-card{background:#fff;border:1px solid #f0f0f0;border-radius:12px;padding:1.25rem;text-align:center}
.canje-card.bloq{opacity:0.6}
.canje-cost{display:inline-block;background:#f5f5f5;padding:0.25rem 0.6rem;border-radius:20px;font-family:'Cinzel',serif;font-size:0.8rem;color:#d4af37;margin-bottom:0.5rem}
.canje-card h4{font-family:'Cinzel',serif;font-size:0.9rem;margin-bottom:0.25rem}
.canje-card p{font-size:0.8rem;color:#666;margin-bottom:0.75rem}
.btn-canjear{width:100%;padding:0.6rem;background:#1a1a1a;color:#fff;border:none;border-radius:6px;font-family:'Cinzel',serif;font-size:0.75rem;cursor:pointer}
.btn-canjear:disabled{background:#ddd;color:#999;cursor:not-allowed}
.packs-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:1rem}
.pack-card{background:#fff;border:1px solid #f0f0f0;border-radius:12px;padding:1.25rem;text-align:center}
.pack-runas{font-family:'Cinzel',serif;font-size:1.5rem;color:#d4af37}
.pack-card h4{font-family:'Cinzel',serif;margin:0.5rem 0 0.25rem}
.pack-card p{font-size:0.8rem;color:#666;margin-bottom:0.5rem}
.pack-precio{font-family:'Cinzel',serif;font-size:1.1rem;margin-bottom:0.75rem}
.runas-header{background:#1a1a1a;border-radius:12px;padding:1rem 1.5rem;display:flex;align-items:center;justify-content:space-between;margin-bottom:2rem}
.runas-balance{display:flex;align-items:center;gap:0.75rem;color:#fff}
.runas-balance span{font-size:1.5rem;color:#d4af37}
.runas-balance strong{font-family:'Cinzel',serif;font-size:1.5rem}
.runas-balance small{opacity:0.7}
.exp-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:1.25rem}
.exp-card{background:#fff;border:1px solid #f0f0f0;border-radius:12px;padding:1.25rem;cursor:pointer;transition:all 0.2s}
.exp-card:hover{border-color:#d4af37}
.exp-card.bloq{opacity:0.7}
.exp-card-head{display:flex;justify-content:space-between;align-items:center;margin-bottom:0.5rem}
.exp-icon{font-size:1.5rem;color:#d4af37}
.exp-runas{background:#f5f5f5;padding:0.25rem 0.6rem;border-radius:20px;font-family:'Cinzel',serif;font-size:0.8rem}
.exp-card h3{font-family:'Cinzel',serif;font-size:1rem;margin-bottom:0.25rem}
.exp-tiempo{font-size:0.8rem;color:#999;margin-bottom:0.5rem}
.exp-desc{font-size:0.9rem;color:#666;margin-bottom:0.75rem}
.btn-ver{background:none;border:1px solid #d4af37;color:#d4af37;padding:0.4rem 0.75rem;border-radius:6px;font-family:'Cinzel',serif;font-size:0.75rem;cursor:pointer}
.btn-back{background:none;border:none;color:#d4af37;font-family:'Cinzel',serif;cursor:pointer;margin-bottom:1.5rem;font-size:0.9rem}
.exp-detalle{max-width:700px}
.exp-d-header{text-align:center;margin-bottom:2rem;padding-bottom:2rem;border-bottom:1px solid #f0f0f0}
.exp-d-icon{font-size:3rem;color:#d4af37}
.exp-d-header h1{font-family:'Cinzel',serif;font-size:1.8rem;margin:0.5rem 0}
.exp-d-meta{display:flex;gap:1.5rem;justify-content:center;color:#666;font-size:0.9rem}
.exp-d-intro{margin-bottom:2rem}
.exp-d-intro p{margin-bottom:1rem;color:#444}
.exp-d-section{background:#fafafa;border-radius:12px;padding:1.5rem;margin-bottom:1.5rem}
.exp-d-section h3{font-family:'Cinzel',serif;margin-bottom:0.75rem}
.exp-d-section ul{margin-left:1.25rem;color:#666}
.exp-d-section li{margin-bottom:0.4rem}
.exp-d-section p{color:#666}
.exp-d-cta{background:#1a1a1a;border-radius:12px;padding:1.5rem;display:flex;align-items:center;justify-content:space-between}
.exp-d-cost{color:#fff}
.exp-d-cost span{opacity:0.7;font-size:0.9rem}
.exp-d-cost strong{display:block;font-family:'Cinzel',serif;font-size:1.5rem;color:#d4af37}
.exp-d-cost small{opacity:0.6;font-size:0.8rem}
.exp-form{max-width:600px}
.exp-form h2{font-family:'Cinzel',serif;margin-bottom:1.5rem}
.regalo-toggle{background:#fef3c7;padding:1rem;border-radius:8px;margin-bottom:1.5rem}
.regalo-toggle label{display:flex;align-items:center;gap:0.75rem;cursor:pointer}
.regalo-toggle input{width:18px;height:18px}
.form-campos{display:flex;flex-direction:column;gap:1rem}
.form-note{background:#f5f5f5;padding:1rem;border-radius:8px;font-size:0.9rem;color:#666;margin-bottom:0.5rem}
.campo label{display:block;font-family:'Cinzel',serif;font-size:0.85rem;margin-bottom:0.4rem}
.campo input,.campo select,.campo textarea{width:100%;padding:0.75rem;border:1px solid #ddd;border-radius:8px;font-family:'Cormorant Garamond',serif;font-size:1rem}
.campo textarea{resize:vertical}
.form-actions{display:flex;gap:1rem;margin-top:1.5rem;justify-content:flex-end}
.btn-gold{display:inline-block;background:linear-gradient(135deg,#d4af37,#b8962e);color:#1a1a1a;padding:0.8rem 1.5rem;border-radius:50px;font-family:'Cinzel',serif;font-size:0.85rem;font-weight:600;text-decoration:none;border:none;cursor:pointer}
.btn-gold:hover{transform:translateY(-1px)}
.btn-gold:disabled{opacity:0.6;cursor:not-allowed;transform:none}
.btn-gold-sm{display:inline-block;background:linear-gradient(135deg,#d4af37,#b8962e);color:#1a1a1a;padding:0.5rem 1rem;border-radius:50px;font-family:'Cinzel',serif;font-size:0.75rem;font-weight:600;text-decoration:none;border:none;cursor:pointer}
.btn-lg{padding:1rem 2rem;font-size:0.95rem}
.btn-sec{background:#fff;border:1px solid #ddd;padding:0.6rem 1rem;border-radius:8px;font-family:'Cinzel',serif;font-size:0.85rem;cursor:pointer}
.btn-pri{background:#1a1a1a;color:#fff;padding:0.8rem 1.5rem;border-radius:8px;font-family:'Cinzel',serif;border:none;cursor:pointer}
.btn-pri:disabled{background:#ccc}
.regalo-head{text-align:center}
.regalo-head span{font-size:3rem}
.regalos-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:1.25rem}
.regalo-card{background:#fff;border:1px solid #f0f0f0;border-radius:12px;padding:1.5rem;text-align:center;cursor:pointer;transition:all 0.2s}
.regalo-card:hover{border-color:#d4af37}
.regalo-card span{font-size:2rem;color:#d4af37}
.regalo-card h3{font-family:'Cinzel',serif;margin:0.75rem 0 0.5rem}
.regalo-card p{font-size:0.9rem;color:#666}
.regalo-exp{margin-top:1rem;padding-top:1rem;border-top:1px solid #f0f0f0;text-align:left}
.regalo-exp p{font-size:0.9rem;color:#666;margin-bottom:0.75rem}
.mini-packs{display:flex;gap:0.5rem;flex-wrap:wrap;margin-top:0.5rem}
.mini-packs a{background:#f5f5f5;padding:0.4rem 0.75rem;border-radius:6px;font-size:0.8rem;text-decoration:none;color:#1a1a1a}
.elementos-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:1rem}
.elem-card{border:2px solid #f0f0f0;border-radius:12px;overflow:hidden}
.elem-head{padding:0.75rem;text-align:center;color:#fff;display:flex;align-items:center;justify-content:center;gap:0.5rem;font-family:'Cinzel',serif}
.elem-card h4{font-family:'Cinzel',serif;padding:0.75rem 0.75rem 0.25rem;font-size:0.95rem}
.elem-card p{padding:0 0.75rem;font-size:0.85rem;color:#666}
.elem-card small{display:block;padding:0.5rem 0.75rem 0.75rem;font-size:0.8rem;color:#888}
.mundo-elemental{max-width:100%}
.mundo-tabs{display:flex;flex-wrap:wrap;gap:0.5rem;margin-bottom:1.5rem}
.mundo-tabs .tab{display:flex;align-items:center;gap:0.4rem;padding:0.6rem 1rem;background:#f5f5f5;border:none;border-radius:20px;cursor:pointer;transition:all 0.2s}
.mundo-tabs .tab:hover{background:#e5e5e5}
.mundo-tabs .tab.act{background:linear-gradient(135deg,#d4af37,#c6a962);color:#1a1a1a}
.mundo-tabs .tab-icon{font-size:1rem}
.mundo-content p{line-height:1.7;margin-bottom:1rem;color:#555}
.intro-expandida{max-width:800px}
.intro-cta{margin-top:2rem;padding:1.5rem;background:linear-gradient(135deg,#f8f4eb,#fff);border-radius:12px;border:1px solid #e5d9c3}
.intro-cta h4{font-family:'Cinzel',serif;color:#8B4513;margin-bottom:0.5rem}
.intro-cta p{margin-bottom:0;color:#666}
.elementos-intro{font-size:1.05rem;margin-bottom:1.5rem;color:#666}
.elementos-grid-exp{display:flex;flex-direction:column;gap:1rem}
.elem-card-exp{border:2px solid #e0e0e0;border-radius:12px;overflow:hidden;transition:all 0.3s}
.elem-card-exp.expandido{border-color:currentColor}
.elem-header{padding:1rem 1.25rem;display:flex;align-items:center;gap:1rem;cursor:pointer;color:#fff}
.elem-icono{font-size:1.75rem}
.elem-titulo{flex:1}
.elem-titulo strong{display:block;font-family:'Cinzel',serif;font-size:1.1rem}
.elem-titulo small{opacity:0.9;font-size:0.85rem}
.elem-expand{font-size:1.5rem;font-weight:300;opacity:0.8}
.elem-body{padding:1.25rem;background:#fff}
.elem-desc{font-size:0.95rem;color:#555;margin-bottom:0}
.elem-detalles{margin-top:1.25rem;padding-top:1.25rem;border-top:1px solid #eee}
.elem-seccion{margin-bottom:1.25rem}
.elem-seccion:last-child{margin-bottom:0}
.elem-seccion h5{font-family:'Cinzel',serif;font-size:0.9rem;color:#1a1a1a;margin-bottom:0.5rem}
.elem-seccion p{margin-bottom:0;font-size:0.9rem}
.ritual-box{background:#f8f4eb;padding:1rem;border-radius:8px;border-left:3px solid #d4af37}
.ritual-box h5{color:#8B4513}
.tipos-intro{margin-bottom:2rem;padding-bottom:1.5rem;border-bottom:1px solid #eee}
.tipos-intro p{max-width:800px}
.tipos-duendes h3{font-family:'Cinzel',serif;margin-bottom:1.25rem}
.tipos-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:1rem}
.tipo-card{background:#fff;border:1px solid #e5e5e5;border-radius:12px;padding:1.25rem;transition:all 0.2s}
.tipo-card:hover{border-color:#d4af37;box-shadow:0 4px 12px rgba(212,175,55,0.1)}
.tipo-card h4{font-family:'Cinzel',serif;color:#8B4513;margin-bottom:0.5rem;font-size:1rem}
.tipo-card p{font-size:0.9rem;color:#666;margin-bottom:0.75rem}
.tipo-senales{font-size:0.85rem;padding-top:0.75rem;border-top:1px dashed #e5e5e5}
.tipo-senales strong{display:block;color:#555;margin-bottom:0.25rem}
.tipo-senales span{color:#888}
.signos-intro{font-size:1.05rem;margin-bottom:1.5rem;color:#666}
.signos-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:1rem}
.signo-card{background:linear-gradient(135deg,#f8f4eb,#fff);border:1px solid #e5d9c3;border-radius:12px;padding:1.25rem}
.signo-card h4{font-family:'Cinzel',serif;color:#8B4513;margin-bottom:0.75rem;font-size:1rem}
.signo-card ul{margin:0;padding-left:1.25rem}
.signo-card li{font-size:0.9rem;color:#666;margin-bottom:0.4rem}
.rituales-intro{font-size:1.05rem;margin-bottom:1.5rem;color:#666}
.rituales-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(320px,1fr));gap:1.25rem}
.ritual-card{background:#fff;border:1px solid #e5e5e5;border-radius:12px;overflow:hidden}
.ritual-header{display:flex;justify-content:space-between;align-items:center;padding:1rem 1.25rem;background:linear-gradient(135deg,#1a1a1a,#2a2a2a)}
.ritual-header h4{font-family:'Cinzel',serif;color:#d4af37;margin:0;font-size:1rem}
.ritual-duracion{font-size:0.8rem;color:rgba(255,255,255,0.7)}
.ritual-pasos{margin:0;padding:1.25rem;padding-left:2.5rem}
.ritual-pasos li{font-size:0.9rem;color:#555;margin-bottom:0.5rem;padding-left:0.5rem}
.alquimia-section{max-width:800px}
.piriapolis-highlight{display:flex;gap:1rem;align-items:flex-start;margin-top:2rem;padding:1.5rem;background:linear-gradient(135deg,#1a1a1a,#2a2a2a);border-radius:12px}
.piriapolis-highlight span{font-size:2rem;color:#d4af37}
.piriapolis-highlight p{margin:0;color:rgba(255,255,255,0.9);font-size:1rem;line-height:1.6}
.cuidados-lista{display:flex;flex-direction:column;gap:1rem}
.cuidado-card{display:flex;gap:1.25rem;background:#fff;border:1px solid #f0f0f0;border-radius:12px;padding:1.25rem}
.cuidado-card.prohibido{background:#fef2f2;border-color:#fecaca}
.cuidado-num{width:36px;height:36px;min-width:36px;background:#d4af37;color:#1a1a1a;border-radius:50%;display:flex;align-items:center;justify-content:center;font-family:'Cinzel',serif;font-weight:600}
.cuidado-body h3{font-family:'Cinzel',serif;margin-bottom:0.5rem;font-size:1rem}
.cuidado-body p{font-size:0.9rem;color:#666;margin-bottom:0.5rem}
.cuidado-body ul{margin-left:1.25rem;font-size:0.9rem;color:#666}
.cuidado-body li{margin-bottom:0.25rem}
.cristales-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:1rem}
.cristal-card{background:#fff;border:1px solid #f0f0f0;border-radius:12px;padding:1rem;text-align:center}
.cristal-color{width:50px;height:50px;border-radius:50%;margin:0 auto 0.75rem}
.cristal-card h4{font-family:'Cinzel',serif;font-size:0.9rem;margin-bottom:0.25rem}
.cristal-props{font-size:0.8rem;color:#d4af37;margin-bottom:0.5rem}
.cristal-cuidado{font-size:0.75rem;color:#888}
.circulo-landing{text-align:center}
.circulo-hero{background:linear-gradient(135deg,#1a1a1a,#2a2a2a);border-radius:16px;padding:2.5rem;margin-bottom:2rem}
.circulo-hero span{font-size:3rem;color:#d4af37}
.circulo-hero h1{font-family:'Cinzel',serif;color:#fff;font-size:2rem;margin:0.75rem 0 0.5rem}
.circulo-hero p{color:rgba(255,255,255,0.7)}
.circulo-intro-text{max-width:600px;margin:0 auto 2rem}
.circulo-intro-text p{color:#666}
.prueba-gratis{background:#f0fdf4;border:2px solid #bbf7d0;border-radius:16px;padding:2rem;margin-bottom:2rem}
.prueba-gratis h2{font-family:'Cinzel',serif;margin-bottom:0.5rem}
.prueba-gratis p{color:#166534;margin-bottom:0.75rem}

/* BLUR PREVIEW */
.circulo-preview-blur{position:relative;margin-bottom:2rem;border-radius:16px;overflow:hidden}
.preview-content{display:flex;flex-direction:column;gap:0.75rem;padding:1.5rem;filter:blur(6px);pointer-events:none}
.preview-item{background:#fff;border-radius:12px;padding:1rem;display:flex;gap:1rem;align-items:flex-start;text-align:left}
.preview-item span{font-size:1.5rem}
.preview-item h4{margin:0 0 0.25rem;font-size:0.9rem}
.preview-item p{margin:0;font-size:0.8rem;color:#666}
.preview-overlay{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;background:rgba(255,255,255,0.85);text-align:center}
.lock-icon{font-size:2.5rem;margin-bottom:0.5rem}
.preview-overlay h3{font-family:'Cinzel',serif;margin:0 0 0.25rem;color:#1a1a1a}
.preview-overlay p{color:#666;font-size:0.9rem}

/* CTA BOX */
.circulo-cta-box{background:linear-gradient(135deg,#1a1a1a,#2a2a2a);border-radius:20px;padding:2.5rem;margin-bottom:2.5rem;border:2px solid #d4af3744}
.cta-header{display:flex;align-items:center;justify-content:center;gap:0.75rem;margin-bottom:1.5rem}
.cta-gift{font-size:2.5rem}
.cta-header h2{font-family:'Cinzel',serif;color:#fff;margin:0;font-size:1.5rem}
.cta-benefits{display:flex;flex-direction:column;gap:0.6rem;margin-bottom:1.5rem}
.cta-benefit{display:flex;align-items:center;gap:0.75rem;color:#eee;font-size:0.95rem}
.cta-benefit span{color:#22c55e;font-weight:bold}
.cta-button{width:100%;max-width:400px;margin:0 auto;display:block;font-size:1.1rem;padding:1rem 2rem}
.cta-small{color:#888;font-size:0.8rem;margin-top:1rem}
.cta-subtitle{color:#aaa;margin-bottom:1.5rem}
.membresias-cta-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:1rem}
.membresia-cta-card{background:rgba(255,255,255,0.05);border:1px solid #444;border-radius:12px;padding:1.25rem;position:relative}
.membresia-cta-card.destacada{border-color:#d4af37;background:rgba(212,175,55,0.1)}
.badge-popular{position:absolute;top:-10px;left:50%;transform:translateX(-50%);background:#d4af37;color:#0a0a0a;font-size:0.7rem;padding:0.25rem 0.75rem;border-radius:20px;font-weight:600}
.membresia-cta-card h4{color:#fff;font-family:'Cinzel',serif;margin-bottom:0.5rem}
.membresia-precio-cta{color:#d4af37;font-size:1.4rem;font-weight:600}
.membresia-precio-cta small{font-size:0.8rem;margin-left:0.25rem;font-weight:normal}
.membresia-ahorro-cta{display:inline-block;background:#22c55e22;color:#22c55e;font-size:0.75rem;padding:0.2rem 0.5rem;border-radius:4px;margin:0.5rem 0}
.membresia-dias{color:#aaa;font-size:0.85rem;margin-bottom:0.75rem}
.btn-membresia{display:inline-block;background:transparent;border:1px solid #d4af37;color:#d4af37;padding:0.6rem 1.25rem;border-radius:8px;font-size:0.85rem;text-decoration:none;transition:all 0.2s}
.btn-membresia:hover{background:#d4af37;color:#0a0a0a}
@media(max-width:768px){.membresias-cta-grid{grid-template-columns:repeat(2,1fr)}}
@media(max-width:500px){.membresias-cta-grid{grid-template-columns:1fr}}

.beneficios-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:1rem;margin-bottom:2rem}
.beneficio-card{background:#fff;border:1px solid #f0f0f0;border-radius:12px;padding:1rem;text-align:center}
.beneficio-card span{font-size:1.5rem;color:#d4af37}
.beneficio-card h4{font-family:'Cinzel',serif;font-size:0.85rem;margin:0.5rem 0 0.25rem}
.beneficio-card p{font-size:0.75rem;color:#666}
.membresias-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:1rem;margin-bottom:2rem}
.membresia-card{background:#fff;border:1px solid #f0f0f0;border-radius:12px;padding:1.25rem;text-align:center}
.membresia-card h4{font-family:'Cinzel',serif;margin-bottom:0.5rem}
.membresia-precio{font-family:'Cinzel',serif;font-size:1.25rem;color:#d4af37}
.membresia-ahorro{display:inline-block;background:#f0fdf4;color:#166534;font-size:0.7rem;padding:0.2rem 0.5rem;border-radius:4px;margin:0.25rem 0}
.membresia-card p{font-size:0.8rem;color:#666;margin-bottom:0.75rem}
.temas-tags{display:flex;flex-wrap:wrap;gap:0.5rem;justify-content:center}
.temas-tags span{background:#f5f5f5;padding:0.4rem 0.8rem;border-radius:20px;font-size:0.8rem;color:#666}
.circulo-interno .circulo-header-int{background:linear-gradient(135deg,#1a1a1a,#2a2a2a);border-radius:16px;padding:2rem;text-align:center;margin-bottom:2rem}
.circulo-header-int span{font-size:2.5rem;color:#d4af37}
.circulo-header-int h1{font-family:'Cinzel',serif;color:#fff;margin:0.5rem 0}
.circulo-header-int p{color:rgba(255,255,255,0.7);font-size:0.9rem}
.circulo-tabs{display:flex;gap:0.5rem;margin-bottom:1.5rem}
.circulo-tabs .tab{display:flex;align-items:center;gap:0.4rem}
.circulo-tabs .tab span{color:#d4af37}
.beneficios-activos{margin-bottom:2rem}
.beneficios-activos h2{font-family:'Cinzel',serif;margin-bottom:1rem;font-size:1.2rem}
.benef-grid-int{display:grid;grid-template-columns:repeat(3,1fr);gap:1rem}
.benef-item-int{background:#fff;border:1px solid #f0f0f0;border-radius:12px;padding:1rem;text-align:center}
.benef-item-int span{color:#d4af37;font-size:1.25rem}
.benef-item-int strong{display:block;font-family:'Cinzel',serif;margin:0.5rem 0 0.25rem}
.benef-item-int p{font-size:0.8rem;color:#666}
.circulo-bienvenida{background:#fafafa;border-radius:12px;padding:1.5rem}
.circulo-bienvenida h2{font-family:'Cinzel',serif;margin-bottom:1rem}
.circulo-bienvenida p{color:#666;margin-bottom:0.75rem}
.contenido-intro{color:#666;margin-bottom:1.5rem}
.contenido-lista{display:flex;flex-direction:column;gap:1rem;margin-bottom:2rem}
.contenido-item{background:#fff;border:1px solid #f0f0f0;border-radius:12px;padding:1.25rem;display:flex;gap:1rem;align-items:flex-start}
.contenido-item span{font-size:1.5rem}
.contenido-item h4{font-family:'Cinzel',serif;margin-bottom:0.25rem}
.contenido-item p{font-size:0.9rem;color:#666;margin-bottom:0.5rem}
.temas-explorar h3{font-family:'Cinzel',serif;margin-bottom:1rem;font-size:1rem}
.luna-actual{background:#1a1a1a;border-radius:12px;padding:1.25rem;display:flex;align-items:center;gap:1rem;margin-bottom:1.5rem}
.luna-actual span{font-size:2rem;color:#d4af37}
.luna-actual p{color:#fff;margin:0}
.fases-mes{display:grid;grid-template-columns:repeat(3,1fr);gap:1rem;margin-bottom:1.5rem}
.fase{background:#fff;border:1px solid #f0f0f0;border-radius:12px;padding:1rem;text-align:center}
.fase span{font-size:1.5rem;color:#d4af37}
.fase strong{display:block;font-family:'Cinzel',serif;margin:0.5rem 0 0.25rem}
.fase p{font-size:0.8rem;color:#666}
.ritual-sugerido{background:#fafafa;border-radius:12px;padding:1.25rem}
.ritual-sugerido h3{font-family:'Cinzel',serif;margin-bottom:0.5rem;font-size:1rem}
.ritual-sugerido p{color:#666;font-size:0.9rem}
.comunidad-intro{color:#666;margin-bottom:1.5rem}
.comunidad-prox{background:#fafafa;border-radius:12px;padding:2rem;text-align:center}
.comunidad-prox span{font-size:2rem}
.comunidad-prox h3{font-family:'Cinzel',serif;margin:0.5rem 0}
.comunidad-prox p{color:#666;font-size:0.9rem}
.grim-intro{display:flex;flex-direction:column;gap:1.5rem}
.grim-intro-section h3{font-family:'Cinzel',serif;margin-bottom:0.5rem}
.grim-intro-section p{color:#666;margin-bottom:0.5rem}
.grim-intro-cards{display:grid;grid-template-columns:repeat(2,1fr);gap:1rem}
.grim-card{background:#fafafa;border-radius:12px;padding:1.5rem;cursor:pointer;transition:all 0.2s}
.grim-card:hover{background:#f5f5f5}
.grim-card span{font-size:2rem;color:#d4af37}
.grim-card h4{font-family:'Cinzel',serif;margin:0.5rem 0}
.grim-card p{font-size:0.9rem;color:#666}
.grim-tip{background:#fef3c7;border-radius:8px;padding:1rem;font-size:0.9rem}
.grim-lecturas h2,.grim-diario h2{font-family:'Cinzel',serif;margin-bottom:1rem}
.lecturas-lista{display:flex;flex-direction:column;gap:1rem}
.lectura-card{background:#fafafa;border-radius:12px;padding:1.25rem}
.lectura-head{display:flex;justify-content:space-between;margin-bottom:0.5rem}
.lectura-tipo{font-family:'Cinzel',serif;color:#d4af37}
.lectura-fecha{font-size:0.8rem;color:#999}
.lectura-preview{font-size:0.9rem;color:#666;margin-bottom:0.75rem}
.empty-grim{text-align:center;padding:2rem}
.empty-grim span{font-size:3rem;color:#ddd}
.empty-grim h3{font-family:'Cinzel',serif;margin:0.5rem 0}
.empty-grim p{color:#666;max-width:400px;margin:0 auto}
.diario-intro{color:#666;margin-bottom:1.5rem}
.diario-nuevo{background:#fafafa;border-radius:12px;padding:1.5rem;margin-bottom:2rem}
.diario-nuevo h3{font-family:'Cinzel',serif;margin-bottom:1rem}
.tipos-entrada{display:flex;flex-wrap:wrap;gap:0.5rem;margin-bottom:0.75rem}
.tipo-btn{display:flex;align-items:center;gap:0.3rem;padding:0.5rem 0.75rem;background:#fff;border:1px solid #f0f0f0;border-radius:20px;font-size:0.8rem;cursor:pointer}
.tipo-btn:hover{border-color:#d4af37}
.tipo-btn.act{background:#d4af37;border-color:#d4af37;color:#1a1a1a}
.tipo-btn span{font-size:1rem}
.tipo-desc{font-size:0.8rem;color:#888;margin-bottom:0.75rem}
.diario-nuevo textarea{width:100%;padding:1rem;border:1px solid #ddd;border-radius:8px;font-family:'Cormorant Garamond',serif;font-size:1rem;margin-bottom:1rem;resize:vertical}
.diario-entradas h3{font-family:'Cinzel',serif;margin-bottom:1rem;font-size:1rem}
.entrada-card{background:#fff;border:1px solid #f0f0f0;border-radius:8px;padding:1rem;margin-bottom:0.75rem}
.entrada-head{display:flex;justify-content:space-between;margin-bottom:0.5rem;font-size:0.85rem}
.entrada-head span:first-child{color:#d4af37}
.entrada-head span:last-child{color:#999}
.entrada-card p{color:#666;font-size:0.95rem}

/* CALENDARIO INTERACTIVO DEL DIARIO */
.diario-vistas{display:flex;gap:0.5rem;margin-bottom:1.5rem}
.vista-btn{padding:0.6rem 1rem;background:#fff;border:1px solid #e0e0e0;border-radius:8px;font-family:'Cinzel',serif;font-size:0.8rem;cursor:pointer;transition:all 0.2s}
.vista-btn:hover{border-color:#d4af37}
.vista-btn.act{background:#1a1a1a;color:#fff;border-color:#1a1a1a}
.diario-calendario{background:#fff;border-radius:12px;padding:1.5rem;margin-bottom:2rem;border:1px solid #f0f0f0}
.cal-nav{display:flex;align-items:center;justify-content:space-between;margin-bottom:1rem}
.cal-nav-btn{background:none;border:none;font-size:1.25rem;color:#d4af37;cursor:pointer;padding:0.5rem 1rem}
.cal-nav-btn:hover{color:#b8962e}
.cal-mes{text-align:center}
.cal-mes-nombre{display:block;font-family:'Cinzel',serif;font-size:1.1rem;text-transform:capitalize}
.cal-fase-hoy{font-size:0.85rem;color:#666}
.cal-header{display:grid;grid-template-columns:repeat(7,1fr);text-align:center;padding:0.5rem 0;border-bottom:1px solid #f0f0f0;margin-bottom:0.5rem}
.cal-header-dia{font-family:'Cinzel',serif;font-size:0.75rem;color:#999}
.cal-grid{display:grid;grid-template-columns:repeat(7,1fr);gap:2px}
.cal-dia{aspect-ratio:1;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:0.25rem;border-radius:8px;cursor:pointer;position:relative;transition:all 0.2s;background:#fafafa}
.cal-dia:hover:not(.vacio){background:#f0f0f0}
.cal-dia.vacio{background:transparent;cursor:default}
.cal-dia.hoy{background:#d4af37;color:#1a1a1a}
.cal-dia.hoy .cal-dia-num{font-weight:600}
.cal-dia.con-entradas{border:2px solid #d4af37}
.cal-dia.sel{background:#1a1a1a;color:#fff}
.cal-dia.sel .cal-dia-luna{color:#d4af37}
.cal-dia-num{font-family:'Cinzel',serif;font-size:0.9rem}
.cal-dia-luna{font-size:0.7rem;margin-top:2px}
.cal-dia-marker{position:absolute;top:2px;right:4px;font-size:0.6rem;color:#d4af37}
.cal-leyenda{display:flex;gap:1.5rem;justify-content:center;padding:1rem 0;border-top:1px solid #f0f0f0;margin-top:1rem;font-size:0.8rem;color:#666}
.marker-dot{display:inline-block;width:10px;height:10px;border-radius:50%;margin-right:4px}
.marker-dot.hoy{background:#d4af37}
.marker-dot.entradas{border:2px solid #d4af37;background:#fff}
.dia-seleccionado{margin-top:1.5rem;padding-top:1.5rem;border-top:1px solid #f0f0f0}
.dia-seleccionado h3{font-family:'Cinzel',serif;margin-bottom:0.5rem}
.dia-info-luna{display:flex;align-items:center;gap:0.5rem;color:#666;font-size:0.9rem;margin-bottom:1rem}
.luna-energia{font-size:0.8rem;opacity:0.8;font-style:italic}
.entradas-dia{display:flex;flex-direction:column;gap:0.75rem}
.entrada-mini{background:#fafafa;padding:1rem;border-radius:8px}
.entrada-mini-tipo{font-family:'Cinzel',serif;font-size:0.85rem;color:#d4af37;display:block;margin-bottom:0.5rem}
.entrada-mini p{font-size:0.9rem;color:#555;margin:0}
.sin-entradas{color:#999;font-style:italic;text-align:center;padding:1rem}
.diario-acciones{display:flex;align-items:center;gap:1rem}
.tip-runa{font-size:0.8rem;color:#888}
.diario-stats{background:linear-gradient(135deg,#f8f4eb,#fff);border-radius:12px;padding:1.5rem;border:1px solid #e5d9c3}
.diario-stats h4{font-family:'Cinzel',serif;text-align:center;margin-bottom:1rem;color:#8B4513}
.stats-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:1rem;text-align:center}
.stat{display:flex;flex-direction:column;gap:0.25rem}
.stat-num{font-family:'Cinzel',serif;font-size:1.75rem;color:#d4af37}
.stat-label{font-size:0.8rem;color:#666}
@media(max-width:600px){
  .cal-grid{gap:1px}
  .cal-dia{padding:0.1rem}
  .cal-dia-num{font-size:0.75rem}
  .cal-dia-luna{font-size:0.6rem}
  .cal-leyenda{flex-wrap:wrap;gap:0.75rem}
  .diario-vistas{flex-direction:column}
  .vista-btn{width:100%}
  .stats-grid{grid-template-columns:1fr}
}

.tito-btn{position:fixed;bottom:1.5rem;right:1.5rem;width:60px;height:60px;border-radius:50%;background:#1a1a1a;border:2px solid #d4af37;cursor:pointer;overflow:hidden;box-shadow:0 4px 16px rgba(0,0,0,0.15);z-index:1000;display:flex;align-items:center;justify-content:center}
.tito-btn img{width:100%;height:100%;object-fit:cover;position:absolute}
.tito-fb{font-family:'Cinzel',serif;font-size:1.5rem;color:#d4af37}
.tito-chat{position:fixed;bottom:6rem;right:1.5rem;width:340px;max-height:450px;height:60vh;background:#fff;border-radius:16px;box-shadow:0 8px 32px rgba(0,0,0,0.15);display:flex;flex-direction:column;z-index:999;overflow:hidden}
.tito-head{display:flex;align-items:center;gap:0.75rem;padding:1rem;background:#1a1a1a}
.tito-av{width:36px;height:36px;border-radius:50%;object-fit:cover}
.tito-head div{flex:1}
.tito-head strong{display:block;color:#d4af37;font-family:'Cinzel',serif;font-size:0.9rem}
.tito-head small{font-size:0.75rem;color:rgba(255,255,255,0.6)}
.tito-head button{background:none;border:none;color:rgba(255,255,255,0.5);font-size:1.1rem;cursor:pointer}
.tito-msgs{flex:1;padding:1rem;overflow-y:auto;display:flex;flex-direction:column;gap:0.6rem}
.msg-t,.msg-u{max-width:85%;padding:0.6rem 0.9rem;border-radius:12px}
.msg-t{background:#f5f5f5;align-self:flex-start}
.msg-u{background:#1a1a1a;color:#fff;align-self:flex-end}
.msg-t p,.msg-u p{margin:0;font-size:0.9rem}
.tito-input{display:flex;gap:0.5rem;padding:0.75rem;border-top:1px solid #f0f0f0}
.tito-input input{flex:1;padding:0.6rem 1rem;border:1px solid #e0e0e0;border-radius:50px;font-size:0.85rem;font-family:'Cormorant Garamond',serif}
.tito-input button{width:36px;height:36px;border-radius:50%;background:#d4af37;border:none;color:#1a1a1a;font-size:1.1rem;cursor:pointer}
.tito-input button:disabled{background:#ddd}
.onb{min-height:100vh;display:flex;align-items:center;justify-content:center;padding:2rem;background:#FFFEF9}
.onb-card{background:#fff;border-radius:20px;padding:2rem;max-width:450px;width:100%;box-shadow:0 8px 32px rgba(0,0,0,0.08)}
.onb-header{text-align:center;margin-bottom:1.5rem}
.onb-header span{font-size:2.5rem}
.onb-header h2{font-family:'Cinzel',serif;margin:0.5rem 0}
.onb-header p{color:#666;font-size:0.95rem}
.onb-prog{display:flex;justify-content:center;gap:0.75rem;margin-bottom:1.5rem}
.prog-p{width:32px;height:32px;border-radius:50%;border:2px solid #ddd;display:flex;align-items:center;justify-content:center;font-family:'Cinzel',serif;font-size:0.85rem;color:#999}
.prog-p.act{background:#d4af37;border-color:#d4af37;color:#1a1a1a}
.onb-paso{text-align:center;min-height:130px}
.onb-paso h3{font-family:'Cinzel',serif;margin-bottom:0.5rem}
.onb-sub{color:#666;font-size:0.9rem;margin-bottom:1rem}
.onb-paso input[type="text"]{width:100%;padding:0.9rem;border:2px solid #f0f0f0;border-radius:10px;font-size:1rem;font-family:'Cormorant Garamond',serif;text-align:center}
.prons{display:flex;gap:0.75rem;justify-content:center}
.pron{padding:0.75rem 1.5rem;border:2px solid #f0f0f0;border-radius:10px;background:#fff;font-family:'Cinzel',serif;cursor:pointer}
.pron:hover{border-color:#d4af37}
.pron.act{background:#d4af37;border-color:#d4af37;color:#1a1a1a}
.monedas{display:grid;grid-template-columns:repeat(2,1fr);gap:1rem}
.moneda{display:flex;flex-direction:column;align-items:center;gap:0.5rem;padding:1.5rem;border:2px solid #f0f0f0;border-radius:12px;background:#fff;cursor:pointer;transition:all 0.2s}
.moneda:hover{border-color:#d4af37}
.moneda.act{border-color:#d4af37;background:#FFF8E7}
.moneda span{font-size:2rem}
.moneda strong{font-family:'Cinzel',serif}
.moneda small{color:#666;font-size:0.85rem}
.resumen-onb{background:#f5f5f5;border-radius:8px;padding:1rem;margin-top:1rem;text-align:center}
.resumen-onb p{margin:0.25rem 0;font-size:0.9rem;color:#666}
.resumen-onb strong{color:#1a1a1a}
.ints{display:grid;grid-template-columns:repeat(2,1fr);gap:0.5rem}
.int{padding:0.5rem;border:1px solid #f0f0f0;border-radius:6px;background:#fff;font-size:0.85rem;cursor:pointer}
.int:hover{border-color:#d4af37}
.int.act{background:#d4af37;border-color:#d4af37;color:#1a1a1a}
.regalo-box{background:#f0fdf4;border:1px solid #bbf7d0;border-radius:10px;padding:1.25rem;margin:1rem 0}
.regalo-box span{font-size:1.5rem}
.regalo-box p{margin:0.25rem 0;color:#666;font-size:0.9rem}
.regalo-box strong{display:block;font-family:'Cinzel',serif;font-size:1.1rem;color:#166534}
.regalo-box small{color:#888;font-size:0.8rem}
.onb-btns{display:flex;gap:0.75rem;justify-content:center;margin-top:1.5rem}
.carga{min-height:100vh;display:flex;align-items:center;justify-content:center;background:#FFFEF9}
.carga-c{text-align:center}
.carga-runa{font-size:3rem;color:#d4af37;animation:pulsar 2s ease-in-out infinite}
.carga-c p{margin-top:1rem;color:#666}
@keyframes pulsar{0%,100%{transform:scale(1);opacity:0.5}50%{transform:scale(1.1);opacity:1}}
@media(max-width:1100px){.stats-g,.beneficios-grid,.membresias-grid,.cristales-grid{grid-template-columns:repeat(2,1fr)}.exp-grid,.elementos-grid,.regalos-grid,.grim-intro-cards{grid-template-columns:1fr}.canjes-grid,.packs-grid{grid-template-columns:repeat(2,1fr)}.info-grid,.benef-grid-int,.fases-mes{grid-template-columns:1fr}}
@media(max-width:900px){.menu-btn{display:flex!important;background:#d4af37!important;border:none!important}.menu-btn span{background:#fff!important}.header{padding:0 0.75rem!important}.nav-overlay{display:block!important}.nav{transform:translateX(-100%)!important;transition:transform 0.3s}.nav.abierto{transform:translateX(0)!important;box-shadow:4px 0 20px rgba(0,0,0,0.15)}.contenido{margin-left:0!important}.user-info{display:none!important}.logo{font-size:0.85rem!important}.hstats{gap:0.4rem!important}.hstats span{padding:0.15rem 0.4rem!important;font-size:0.7rem!important}}
@media(max-width:768px){.sec{padding:1.25rem}.banner{padding:1.5rem}.banner h1{font-size:1.4rem}.stats-g,.balances,.accesos-g{grid-template-columns:1fr}.canjes-grid,.packs-grid,.items-grid{grid-template-columns:1fr}.tito-chat{right:0.5rem!important;left:0.5rem!important;width:auto!important;bottom:4.5rem!important;max-height:55vh!important;height:auto!important;border-radius:12px!important}.tito-btn{width:45px!important;height:45px!important;bottom:0.5rem!important;right:0.5rem!important}.tito-head{padding:0.75rem!important}.tito-msgs{max-height:35vh!important}.tito-input{padding:0.5rem!important}.tabs-h{flex-direction:column}.exp-d-cta{flex-direction:column;gap:1rem;text-align:center}}

/* ═══════════════════════════════════════════════════════════════
   LUNA CALENDAR STYLES - PREMIUM
   ═══════════════════════════════════════════════════════════════ */
.cargando-mini{text-align:center;padding:2rem;color:#888;font-style:italic}
.luna-preview{background:linear-gradient(135deg,#1a1a1a,#2a2a2a);border-radius:12px;padding:1.5rem;margin-bottom:2rem;display:flex;align-items:center;justify-content:space-between}
.luna-mini{display:flex;align-items:center;gap:1rem}
.luna-emoji{font-size:2.5rem}
.luna-mini strong{color:#d4af37;font-family:'Cinzel',serif}
.luna-mini p{color:rgba(255,255,255,0.7);font-size:0.9rem;margin:0}
.luna-hero{display:grid;grid-template-columns:repeat(2,1fr);gap:1.5rem;margin-bottom:2rem}
.luna-fase-grande{background:#1a1a1a;border-radius:16px;padding:1.5rem;display:flex;align-items:center;gap:1.25rem}
.luna-emoji-lg{font-size:4rem}
.luna-fase-grande h3{font-family:'Cinzel',serif;color:#d4af37;margin-bottom:0.25rem}
.luna-energia{color:rgba(255,255,255,0.8);font-size:0.95rem;margin:0}
.luna-fase-grande small{color:rgba(255,255,255,0.5);font-size:0.8rem}
.signo-lunar{background:#fff;border:1px solid #f0f0f0;border-radius:16px;padding:1.5rem;display:flex;align-items:center;gap:1.25rem}
.signo-lunar span{font-size:2.5rem}
.signo-lunar strong{font-family:'Cinzel',serif;display:block}
.signo-lunar p{color:#666;font-size:0.9rem;margin:0.25rem 0}
.signo-lunar small{color:#888;font-size:0.8rem}
.mensaje-guardian-luna{background:linear-gradient(135deg,#FFF9F0,#FDF8F5);border-left:4px solid #d4af37;border-radius:0 12px 12px 0;padding:1.5rem;margin-bottom:1.5rem}
.mensaje-guardian-luna h3{font-family:'Cinzel',serif;color:#d4af37;margin-bottom:0.75rem}
.mensaje-texto{font-style:italic;color:#444;font-size:1.05rem;line-height:1.7}
.afirmacion-dia{background:#1a1a1a;border-radius:12px;padding:1.5rem;text-align:center;margin-bottom:1.5rem}
.afirmacion-dia h3{font-family:'Cinzel',serif;color:#d4af37;margin-bottom:0.75rem;font-size:0.9rem}
.afirmacion{color:#fff;font-size:1.2rem;font-style:italic;margin:0}
.proximas-fases{margin-bottom:1.5rem}
.proximas-fases h3{font-family:'Cinzel',serif;margin-bottom:1rem;font-size:1rem}
.fases-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:1rem}
.fase-item{background:#fff;border:1px solid #f0f0f0;border-radius:12px;padding:1rem;text-align:center}
.fase-item span{font-size:2rem}
.fase-item strong{display:block;font-family:'Cinzel',serif;margin:0.5rem 0 0.25rem;font-size:0.9rem}
.fase-item small{color:#888;font-size:0.8rem}
.rituales-fase{background:#fafafa;border-radius:12px;padding:1.5rem;margin-bottom:1.5rem}
.rituales-fase h3{font-family:'Cinzel',serif;margin-bottom:0.75rem;font-size:1rem}
.rituales-fase ul{margin-left:1.25rem;color:#666}
.rituales-fase li{margin-bottom:0.4rem}
.cristales-fase{margin-bottom:1.5rem}
.cristales-fase h3{font-family:'Cinzel',serif;margin-bottom:0.75rem;font-size:1rem}
.cristales-tags{display:flex;flex-wrap:wrap;gap:0.5rem}
.cristales-tags span{background:linear-gradient(135deg,#f5f5f5,#fff);padding:0.5rem 1rem;border-radius:50px;font-size:0.85rem;border:1px solid #e0e0e0}
.energia-mes{margin-bottom:1.5rem}
.energia-mes h3{font-family:'Cinzel',serif;margin-bottom:0.75rem;font-size:1rem}
.energia-info{background:#fff;border-left:4px solid;border-radius:0 12px 12px 0;padding:1rem}
.energia-info strong{display:block;font-family:'Cinzel',serif;margin-bottom:0.25rem}
.energia-info p{color:#666;font-size:0.9rem;margin:0}
.luna-error{text-align:center;padding:2rem;color:#dc2626;background:#fef2f2;border-radius:12px}
.prueba-usada{color:#888;font-size:0.85rem;margin-top:0.5rem!important}
.contenido-item small{display:block;font-size:0.75rem;color:#888;margin-bottom:0.5rem}
.sin-contenido{text-align:center;color:#888;padding:2rem}

/* MODAL DE CONTENIDO */
.contenido-modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.85);z-index:100000;display:flex;align-items:center;justify-content:center;padding:20px;animation:fadeIn 0.2s}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
.contenido-modal{background:linear-gradient(180deg,#141414 0%,#0a0a0a 100%);border-radius:20px;max-width:700px;width:100%;max-height:85vh;overflow-y:auto;border:1px solid #d4af3744;box-shadow:0 20px 60px rgba(0,0,0,0.5)}
.modal-cerrar{position:absolute;top:15px;right:20px;background:none;border:none;color:#888;font-size:28px;cursor:pointer;transition:color 0.2s;z-index:10}
.modal-cerrar:hover{color:#d4af37}
.modal-header{display:flex;align-items:center;gap:15px;padding:25px 25px 15px;border-bottom:1px solid #333;position:relative}
.modal-header span{font-size:2.5rem}
.modal-header h2{margin:0;color:#d4af37;font-size:1.4rem}
.modal-meta{margin:5px 0 0;color:#888;font-size:0.85rem}
.modal-contenido{padding:25px;color:#ddd;line-height:1.8}
.modal-contenido h2{color:#d4af37;font-size:1.3rem;margin:25px 0 15px;padding-bottom:8px;border-bottom:1px solid #333}
.modal-contenido h3{color:#fff;font-size:1.1rem;margin:20px 0 10px}
.modal-contenido h4{color:#d4af37;font-size:1rem;margin:15px 0 8px}
.modal-contenido p{margin:10px 0}
.modal-contenido li{margin:8px 0;padding-left:10px;list-style:none}
.modal-contenido li::before{content:"◆";color:#d4af37;margin-right:10px;font-size:0.7rem}
.modal-contenido em{font-style:italic;color:#aaa}
.modal-contenido strong{color:#fff}
.mensaje-cierre{margin-top:25px;padding:15px;background:#d4af3711;border-radius:10px;border-left:3px solid #d4af37;font-style:italic;color:#d4af37}

@media(max-width:768px){.luna-hero{grid-template-columns:1fr}.fases-grid{grid-template-columns:1fr}.contenido-modal{margin:10px;max-height:90vh}}

/* ═══ NUEVAS FUNCIONES ESTILOS ═══ */
.senal-card{background:linear-gradient(135deg,#1a1a2e 0%,#16213e 100%);border-radius:16px;padding:20px;margin-bottom:20px;border:1px solid #d4af3733}
.senal-card.cargando{display:flex;justify-content:center;align-items:center;min-height:200px}
.senal-loading{text-align:center}
.pulse{animation:pulse 1.5s infinite;display:inline-block;font-size:2rem}
@keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.5;transform:scale(1.1)}}
.senal-header{display:flex;align-items:center;gap:15px;margin-bottom:15px}
.senal-luna{font-size:2.5rem}
.senal-header h3{margin:0;color:#d4af37}
.senal-fase{margin:0;color:#aaa;font-size:0.9rem}
.senal-numero{margin-left:auto;background:#d4af3722;padding:5px 10px;border-radius:8px;color:#d4af37;font-size:0.9rem}
.senal-saludo p{font-size:1.1rem;color:#eee;margin-bottom:15px}
.senal-mensaje-tito{display:flex;gap:12px;background:#0a0a0a;padding:15px;border-radius:12px;margin-bottom:15px}
.tito-icon{font-size:1.5rem}
.senal-mensaje-tito p{margin:0;color:#ccc;line-height:1.5}
.senal-elemento,.senal-guardian{display:flex;align-items:center;gap:10px;padding:10px;background:#ffffff08;border-radius:8px;margin-bottom:10px}
.senal-elemento span,.senal-guardian span{color:#d4af37}
.senal-footer{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-top:15px;padding-top:15px;border-top:1px solid #333}
.senal-accion,.senal-cristal,.senal-numero-significado{text-align:center;padding:10px;background:#0a0a0a;border-radius:8px}
.senal-accion strong,.senal-cristal strong{display:block;color:#d4af37;font-size:0.8rem;margin-bottom:5px}
.senal-cristal span{font-size:1.5rem}
.senal-numero-significado span{display:block;font-size:1.5rem;color:#d4af37}
.senal-numero-significado small{font-size:0.75rem;color:#888}
.senal-luna-mensaje{margin-top:15px;padding:12px;background:#d4af3711;border-radius:8px;border-left:3px solid #d4af37}
.senal-luna-mensaje p{margin:0;font-style:italic;color:#ccc}
.senal-canalizado{margin-top:15px;padding:15px;background:linear-gradient(135deg,#1a1a3e,#0a0a2e);border-radius:12px;border:1px solid #d4af3744}
.senal-canalizado h4{color:#d4af37;margin:0 0 10px}
.test-intro,.test-pregunta,.test-cargando,.test-resultado{background:#141414;border-radius:16px;padding:30px;text-align:center}
.test-header{margin-bottom:20px}
.test-icono{font-size:3rem;color:#d4af37}
.test-header h2{color:#fff;margin:10px 0}
.elementos-preview{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin:20px 0}
.elem-prev{padding:15px;border-radius:12px;text-align:center}
.elem-prev span{display:block;font-size:1.5rem;margin-bottom:5px}
.elem-prev.fuego{background:#ff450033;color:#ff6b6b}
.elem-prev.agua{background:#1e90ff33;color:#74b9ff}
.elem-prev.tierra{background:#2ecc7133;color:#55efc4}
.elem-prev.aire{background:#74b9ff33;color:#a29bfe}
.test-tiempo{color:#888;font-size:0.9rem}
.test-progress{display:flex;align-items:center;gap:15px;margin-bottom:30px}
.progress-bar{flex:1;height:6px;background:#333;border-radius:3px;overflow:hidden}
.progress-bar>div{height:100%;background:#d4af37;transition:width 0.3s}
.test-pregunta h3{color:#fff;font-size:1.2rem;margin-bottom:25px}
.opciones{display:flex;flex-direction:column;gap:10px}
.opcion-btn{padding:15px 20px;background:#1f1f1f;border:1px solid #333;border-radius:12px;color:#fff;text-align:left;cursor:pointer;transition:all 0.2s}
.opcion-btn:hover{background:#2a2a2a;border-color:#d4af37}
.resultado-header{padding:30px;border-radius:16px;margin-bottom:20px}
.resultado-header.fuego{background:linear-gradient(135deg,#ff4500,#ff6b6b)}
.resultado-header.agua{background:linear-gradient(135deg,#1e90ff,#74b9ff)}
.resultado-header.tierra{background:linear-gradient(135deg,#2ecc71,#55efc4)}
.resultado-header.aire{background:linear-gradient(135deg,#a29bfe,#dfe6e9)}
.resultado-emoji{font-size:4rem}
.resultado-header h2{color:#fff;margin:10px 0 0}
.elem-secundario{color:rgba(255,255,255,0.8)}
.resultado-mensaje{background:#1f1f1f;padding:20px;border-radius:12px;margin-bottom:20px}
.resultado-guardianes h4{color:#d4af37;margin-bottom:10px}
.guardianes-lista{display:flex;flex-wrap:wrap;gap:8px}
.guardianes-lista span{background:#d4af3722;color:#d4af37;padding:5px 12px;border-radius:20px;font-size:0.9rem}
.resultado-ritual{background:#0a0a0a;padding:20px;border-radius:12px;border-left:3px solid #d4af37;margin-top:20px}
.resultado-ritual h4{color:#d4af37;margin:0 0 10px}
.cosmos-panel{background:#141414;border-radius:16px;padding:20px}
.cosmos-header{text-align:center;margin-bottom:20px}
.cosmos-header h2{color:#d4af37;margin:0}
.cosmos-header p{color:#888}
.cosmos-tabs{display:grid;grid-template-columns:repeat(4,1fr);gap:5px;margin-bottom:20px}
.cosmos-tab{display:flex;flex-direction:column;align-items:center;gap:5px;padding:12px;background:#1f1f1f;border:none;border-radius:10px;color:#888;cursor:pointer;transition:all 0.2s}
.cosmos-tab span{font-size:1.2rem}
.cosmos-tab.activo{background:#d4af3722;color:#d4af37}
.luna-actual{display:flex;align-items:center;gap:20px;background:#0a0a0a;padding:20px;border-radius:16px;margin-bottom:20px}
.luna-emoji-xl{font-size:4rem}
.luna-actual h3{color:#fff;margin:0 0 5px}
.luna-actual p{color:#ccc;margin:0}
.luna-actual small{color:#888}
.luna-ritual{background:#1f1f1f;padding:15px;border-radius:12px;margin-bottom:15px}
.luna-ritual h4{color:#d4af37;margin:0 0 10px}
.fechas-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:10px}
.fecha-item{display:flex;align-items:center;gap:10px;background:#1f1f1f;padding:12px;border-radius:10px}
.fecha-item span{font-size:1.5rem}
.fecha-item strong{display:block;color:#fff}
.fecha-item small{color:#888}
.sol-actual{display:flex;align-items:center;gap:15px;background:#0a0a0a;padding:20px;border-radius:12px;margin-bottom:15px}
.sol-actual span{font-size:2.5rem}
.sol-actual strong{display:block;color:#fff}
.alerta-retrogrado{display:flex;align-items:center;gap:10px;background:#ff450022;padding:15px;border-radius:12px;border:1px solid #ff4500;margin-bottom:15px}
.cristal-mes{display:flex;align-items:center;gap:15px;margin-bottom:15px}
.cristal-mes span{font-size:3rem}
.cristal-mes h3{color:#fff;margin:0}
.cristal-poder{color:#ccc;font-style:italic;margin-bottom:15px}
.cristal-chakra,.cristal-ritual{background:#1f1f1f;padding:15px;border-radius:12px;margin-bottom:15px}
.cosmos-guardian h3{color:#d4af37;margin:0 0 5px}
.guardian-tipo{color:#888;font-size:0.9rem;margin-bottom:10px}
.guardian-mensaje{background:#0a0a0a;padding:15px;border-radius:12px;margin-top:15px;border-left:3px solid #d4af37}
.guardian-mensaje h4{color:#d4af37;margin:0 0 10px}
.mensaje-destacado{font-size:1.1rem;line-height:1.6;color:#eee}
.fechas-importantes{margin-top:20px;padding-top:20px;border-top:1px solid #333}
.fechas-importantes h3{color:#d4af37;margin:0 0 15px}
.fechas-lista{display:flex;flex-direction:column;gap:10px}
.fecha-item-full{display:flex;align-items:center;gap:12px;padding:12px;background:#1f1f1f;border-radius:10px}
.fecha-item-full span{font-size:1.5rem}
.fecha-item-full strong{color:#fff}
.fecha-item-full small{display:block;color:#888}
.guia-cristales{padding-bottom:20px}
.guia-header{text-align:center;margin-bottom:20px}
.guia-header h2{color:#d4af37;margin:0 0 5px}
.guia-header p{color:#888}
.guia-filtros{margin-bottom:20px}
.buscar-input{width:100%;padding:12px 15px;background:#1f1f1f;border:1px solid #333;border-radius:10px;color:#fff;font-size:1rem;margin-bottom:10px}
.buscar-input:focus{outline:none;border-color:#d4af37}
.chakra-filtros{display:flex;flex-wrap:wrap;gap:5px}
.chakra-btn{padding:6px 12px;background:#1f1f1f;border:none;border-radius:20px;color:#888;font-size:0.85rem;cursor:pointer;transition:all 0.2s}
.chakra-btn.activo{background:#d4af3722;color:#d4af37}
.cristales-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:12px}
.cristal-card{background:#1f1f1f;border-radius:12px;padding:15px;text-align:center;cursor:pointer;transition:all 0.2s;border:1px solid transparent}
.cristal-card:hover{border-color:#d4af37;transform:translateY(-2px)}
.cristal-emoji{font-size:2rem;margin-bottom:10px}
.cristal-card h4{color:#fff;margin:0 0 5px;font-size:0.95rem}
.cristal-color{color:#888;font-size:0.8rem;margin:0 0 8px}
.cristal-chakras-mini{display:flex;justify-content:center;gap:5px;margin-bottom:8px}
.cristal-chakras-mini span{background:#d4af3722;color:#d4af37;padding:2px 8px;border-radius:10px;font-size:0.7rem}
.cristal-prop-mini{color:#aaa;font-size:0.75rem;margin:0;line-height:1.3}
.cristal-detalle{padding:20px 0}
.btn-volver{background:none;border:none;color:#d4af37;cursor:pointer;padding:10px 0;font-size:1rem}
.cristal-header-det{margin-bottom:20px}
.cristal-header-det h2{color:#d4af37;margin:0 0 5px}
.nombres-alt{color:#888;font-size:0.9rem;margin:0}
.cristal-info-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:10px;margin-bottom:20px}
.info-item{background:#1f1f1f;padding:12px;border-radius:10px}
.info-item strong{color:#d4af37;display:block;margin-bottom:5px;font-size:0.85rem}
.cristal-seccion{background:#141414;padding:15px;border-radius:12px;margin-bottom:15px}
.cristal-seccion h3{color:#d4af37;margin:0 0 10px;font-size:1rem}
.cristal-seccion p{color:#ccc;margin:0;line-height:1.5}
.cristal-seccion.ritual{background:linear-gradient(135deg,#1a1a2e,#0a0a2e);border:1px solid #d4af3733}
.cristal-seccion.advertencia{background:#ff450011;border:1px solid #ff450044}
.combinaciones-tags,.guardianes-tags{display:flex;flex-wrap:wrap;gap:8px}
.combinaciones-tags span,.guardianes-tags span{background:#d4af3722;color:#d4af37;padding:5px 12px;border-radius:15px;font-size:0.85rem}
.cristal-mensaje{text-align:center;padding:20px;background:linear-gradient(135deg,#d4af3711,#d4af3722);border-radius:12px;border:1px solid #d4af3744;margin-top:20px}
.cristal-mensaje p{color:#d4af37;font-style:italic;font-size:1.1rem;margin:0}
.catalogo-exp{padding-bottom:20px}
.catalogo-header{text-align:center;margin-bottom:20px}
.catalogo-header h2{color:#d4af37;margin:0 0 5px}
.catalogo-header p{color:#888}
.categorias-tabs{display:flex;flex-wrap:wrap;gap:5px;margin-bottom:20px}
.cat-tab{padding:8px 15px;background:#1f1f1f;border:none;border-radius:20px;color:#888;cursor:pointer;transition:all 0.2s}
.cat-tab.activo{background:#d4af3722;color:#d4af37}
.experiencias-grid-new{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:15px}
.exp-card-new{background:#1f1f1f;border-radius:16px;padding:20px;cursor:pointer;transition:all 0.2s;border:1px solid transparent;position:relative}
.exp-card-new:hover{border-color:#d4af37;transform:translateY(-2px)}
.exp-card-new.popular{border-color:#d4af3744}
.exp-card-new.premium{background:linear-gradient(135deg,#1f1f2f,#1a1a2e)}
.badge-popular,.badge-premium{position:absolute;top:10px;right:10px;padding:3px 8px;border-radius:10px;font-size:0.7rem;font-weight:600}
.badge-popular{background:#d4af37;color:#000}
.badge-premium{background:#9b59b6;color:#fff}
.exp-icono{font-size:2rem;display:block;margin-bottom:10px}
.exp-card-new h4{color:#fff;margin:0 0 8px}
.exp-desc{color:#888;font-size:0.9rem;margin:0 0 12px;line-height:1.4}
.exp-footer{display:flex;justify-content:space-between;align-items:center}
.exp-runas{background:#d4af3722;color:#d4af37;padding:5px 10px;border-radius:8px;font-weight:600}
.exp-duracion{color:#666;font-size:0.85rem}
.runas-info{text-align:center;margin-top:20px;padding-top:20px;border-top:1px solid #333}
.runas-info p{margin:0 0 10px;color:#aaa}
.runas-info strong{color:#d4af37}
.exp-detalle{padding:20px 0}
.exp-header-det{display:flex;align-items:center;gap:20px;margin-bottom:20px}
.exp-icono-lg{font-size:3rem}
.exp-header-det h2{color:#fff;margin:0 0 8px}
.exp-meta{display:flex;gap:15px}
.exp-runas-lg{background:#d4af37;color:#000;padding:5px 12px;border-radius:8px;font-weight:600}
.exp-desc-full{color:#ccc;line-height:1.6;margin-bottom:20px}
.exp-entregable{background:#1f1f1f;padding:15px;border-radius:12px;margin-bottom:20px}
.exp-entregable strong{color:#d4af37}
.exp-formulario{margin-bottom:20px}
.exp-formulario h4{color:#d4af37;margin:0 0 15px}
.exp-formulario textarea{width:100%;padding:12px;background:#1f1f1f;border:1px solid #333;border-radius:10px;color:#fff;font-size:1rem;margin-bottom:10px;resize:vertical}
.exp-formulario textarea:focus{outline:none;border-color:#d4af37}
.exp-accion{text-align:center;padding:20px;background:#141414;border-radius:16px}
.runas-insuficientes{color:#ff6b6b;margin-bottom:15px}
.runas-actuales{color:#888;margin-top:15px}
.exp-resultado{padding:20px}
.resultado-header-exp{text-align:center;margin-bottom:20px}
.resultado-header-exp span{font-size:3rem;display:block;margin-bottom:10px}
.resultado-header-exp h2{color:#d4af37;margin:0}
.resultado-contenido{background:#141414;padding:20px;border-radius:16px;margin-bottom:20px}
.resultado-contenido h3{color:#d4af37;margin:0 0 15px}
.resultado-texto p{color:#ccc;line-height:1.7;margin-bottom:10px}
.resultado-palabras{color:#888;font-size:0.85rem;text-align:right;margin-top:15px}
.resultado-pendiente{background:#1f1f1f;padding:20px;border-radius:16px;text-align:center;margin-bottom:20px}
.guia-cargando,.catalogo-cargando,.cosmos-cargando{display:flex;flex-direction:column;align-items:center;justify-content:center;padding:40px;color:#888}

/* FORO MÁGICO */
.foro-categorias{display:flex;flex-wrap:wrap;gap:0.5rem;margin-bottom:1.5rem}
.foro-cat{display:flex;align-items:center;gap:0.4rem;padding:0.6rem 1rem;background:#fff;border:1px solid #f0f0f0;border-radius:8px;font-size:0.85rem;cursor:pointer;transition:all 0.2s}
.foro-cat:hover{border-color:#d4af37}
.foro-cat.act{background:#1a1a1a;color:#fff;border-color:#1a1a1a}
.foro-acciones{margin-bottom:1.5rem}
.foro-nuevo{background:#fafafa;border-radius:12px;padding:1.5rem;margin-bottom:1.5rem}
.foro-nuevo h3{font-family:'Cinzel',serif;margin-bottom:1rem}
.foro-titulo-input{width:100%;padding:0.75rem;border:1px solid #ddd;border-radius:8px;font-family:'Cormorant Garamond',serif;font-size:1rem;margin-bottom:1rem}
.foro-nuevo textarea{width:100%;padding:1rem;border:1px solid #ddd;border-radius:8px;font-family:'Cormorant Garamond',serif;font-size:1rem;margin-bottom:1rem;resize:vertical}
.foro-loading,.foro-empty{text-align:center;padding:3rem;color:#888}
.foro-empty span{font-size:2.5rem;color:#ddd;display:block}
.foro-empty h3{font-family:'Cinzel',serif;margin:0.5rem 0}
.foro-posts{display:flex;flex-direction:column;gap:1rem}
.foro-post-card{display:flex;gap:1rem;background:#fff;border:1px solid #f0f0f0;border-radius:12px;padding:1.25rem;cursor:pointer;transition:all 0.2s}
.foro-post-card:hover{border-color:#d4af37}
.post-avatar{width:45px;height:45px;border-radius:50%;background:linear-gradient(135deg,#d4af37,#b8962e);display:flex;align-items:center;justify-content:center;color:#fff;font-family:'Cinzel',serif;font-weight:600;flex-shrink:0}
.post-content{flex:1;min-width:0}
.post-content h4{font-family:'Cinzel',serif;margin:0 0 0.5rem;font-size:1rem}
.post-content p{color:#666;font-size:0.9rem;margin:0 0 0.75rem;overflow:hidden;text-overflow:ellipsis}
.post-footer{display:flex;gap:1rem;font-size:0.8rem;color:#999;flex-wrap:wrap}
.post-autor{color:#d4af37}
.foro-post-full{background:#fff;border:1px solid #f0f0f0;border-radius:12px;padding:1.5rem;margin-bottom:1.5rem}
.post-header{display:flex;align-items:center;gap:1rem;margin-bottom:1rem}
.post-meta{display:flex;flex-direction:column}
.post-meta strong{font-family:'Cinzel',serif}
.post-meta span{font-size:0.8rem;color:#999}
.post-titulo{font-family:'Cinzel',serif;font-size:1.3rem;margin-bottom:1rem}
.post-contenido{color:#555;line-height:1.7;margin-bottom:1.5rem}
.post-acciones{display:flex;gap:1.5rem;color:#888;font-size:0.9rem;padding-top:1rem;border-top:1px solid #f0f0f0}
.foro-respuestas{margin-bottom:1.5rem}
.foro-respuestas h3{font-family:'Cinzel',serif;margin-bottom:1rem}
.respuesta-card{display:flex;gap:1rem;background:#fafafa;border-radius:8px;padding:1rem;margin-bottom:0.75rem}
.respuesta-avatar{width:32px;height:32px;border-radius:50%;background:#d4af37;display:flex;align-items:center;justify-content:center;color:#fff;font-size:0.85rem;flex-shrink:0}
.respuesta-content{flex:1}
.respuesta-meta{display:flex;gap:0.75rem;margin-bottom:0.4rem}
.respuesta-meta strong{font-size:0.9rem}
.respuesta-meta span{font-size:0.8rem;color:#999}
.respuesta-content p{color:#555;font-size:0.95rem;margin:0}
.foro-responder{background:#f5f5f5;border-radius:12px;padding:1.5rem}
.foro-responder h3{font-family:'Cinzel',serif;margin-bottom:1rem}
.foro-responder textarea{width:100%;padding:1rem;border:1px solid #ddd;border-radius:8px;font-family:'Cormorant Garamond',serif;font-size:1rem;margin-bottom:1rem;resize:vertical}

/* UTILIDADES */
.utils-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:1rem}
.util-card{background:#fff;border:1px solid #f0f0f0;border-radius:12px;padding:1.5rem;text-align:center;cursor:pointer;transition:all 0.2s}
.util-card:hover{border-color:#d4af37;transform:translateY(-2px)}
.util-icono{font-size:2rem;display:block;margin-bottom:0.75rem}
.util-card h3{font-family:'Cinzel',serif;font-size:1rem;margin-bottom:0.5rem}
.util-card p{font-size:0.85rem;color:#666;margin:0}
.util-header{text-align:center;margin-bottom:2rem}
.util-icono-grande{font-size:3rem;display:block;margin-bottom:0.5rem}
.util-header h2{font-family:'Cinzel',serif}
.util-content{background:#fff;border:1px solid #f0f0f0;border-radius:12px;padding:2rem}
.luna-actual{text-align:center;margin-bottom:2rem}
.luna-icono{font-size:4rem;display:block;margin-bottom:0.5rem}
.luna-actual h3{font-family:'Cinzel',serif;font-size:1.3rem}
.luna-info{display:grid;gap:1.5rem}
.luna-energia strong,.luna-ritual strong{display:block;font-family:'Cinzel',serif;color:#d4af37;margin-bottom:0.5rem}
.luna-energia p,.luna-ritual p{color:#555;margin:0}
.numero-dia{text-align:center;margin-bottom:1.5rem}
.numero-grande{font-family:'Cinzel',serif;font-size:4rem;color:#d4af37;display:block}
.numero-dia h3{font-family:'Cinzel',serif}
.numero-mensaje{color:#555;text-align:center;margin-bottom:1rem}
.util-content small{color:#999;text-align:center;display:block}
.color-dia{padding:3rem 2rem;border-radius:12px;text-align:center;margin-bottom:1.5rem}
.color-nombre{font-family:'Cinzel',serif;font-size:1.5rem;color:#fff}
.color-energia{color:#555;text-align:center;margin-bottom:1rem}
.afirmacion-box{text-align:center;background:linear-gradient(135deg,#fef3c7,#fff)}
.afirmacion-icono{font-size:2.5rem;color:#d4af37;margin-bottom:1rem}
.afirmacion-texto{font-size:1.3rem;font-style:italic;color:#555;margin-bottom:1.5rem}
.elemento-dia{padding:2.5rem;border-radius:12px;text-align:center;margin-bottom:1.5rem;color:#fff}
.elemento-icono{font-size:2.5rem;display:block;margin-bottom:0.5rem}
.elemento-dia h3{font-family:'Cinzel',serif;margin:0}
.elemento-consejo{color:#555;text-align:center}

/* FAQ */
.faq-categorias{display:flex;flex-wrap:wrap;gap:0.5rem;margin-bottom:1.5rem}
.faq-cat{padding:0.6rem 1rem;background:#fff;border:1px solid #f0f0f0;border-radius:8px;font-size:0.85rem;cursor:pointer;transition:all 0.2s}
.faq-cat:hover{border-color:#d4af37}
.faq-cat.act{background:#1a1a1a;color:#fff;border-color:#1a1a1a}
.faq-lista{display:flex;flex-direction:column;gap:0.5rem}
.faq-item{background:#fff;border:1px solid #f0f0f0;border-radius:8px;overflow:hidden}
.faq-item.abierta{border-color:#d4af37}
.faq-pregunta{width:100%;padding:1rem 1.25rem;background:none;border:none;display:flex;justify-content:space-between;align-items:center;cursor:pointer;text-align:left;font-family:'Cormorant Garamond',serif;font-size:1rem}
.faq-pregunta:hover{background:#fafafa}
.faq-arrow{font-size:1.25rem;color:#d4af37}
.faq-respuesta{padding:0 1.25rem 1.25rem;background:#fafafa}
.faq-respuesta p{color:#555;margin:0}
.faq-contacto{background:linear-gradient(135deg,#1a1a1a,#2a2a2a);border-radius:12px;padding:2rem;text-align:center;margin-top:2rem}
.faq-contacto h3{font-family:'Cinzel',serif;color:#d4af37;margin-bottom:0.5rem}
.faq-contacto p{color:rgba(255,255,255,0.7);margin-bottom:1.5rem}

@media(max-width:768px){.senal-footer{grid-template-columns:1fr}.elementos-preview{grid-template-columns:repeat(2,1fr)}.cosmos-tabs{grid-template-columns:repeat(2,1fr)}.cristales-grid{grid-template-columns:repeat(2,1fr)}.experiencias-grid-new{grid-template-columns:1fr}.utils-grid{grid-template-columns:repeat(2,1fr)}.foro-categorias{overflow-x:auto;flex-wrap:nowrap}.faq-categorias{overflow-x:auto;flex-wrap:nowrap}}
@media(max-width:480px){.utils-grid{grid-template-columns:1fr}}
`;
