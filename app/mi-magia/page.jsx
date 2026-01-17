'use client';
import { useState, useEffect } from 'react';
import { SenalDelDia, TestElemental, CosmosMes, GuiaCristales, CatalogoExperiencias, estilosNuevos } from './nuevas-funciones';
import TestGuardian from './test-guardian';

const API_BASE = '';

// Helper: Limpiar tags HTML que aparecen como texto
function limpiarTexto(texto) {
  if (!texto) return '';
  return texto
    .replace(/<\/?em>/gi, '')
    .replace(/<\/?strong>/gi, '')
    .replace(/<\/?i>/gi, '')
    .replace(/<\/?b>/gi, '')
    .replace(/\*\*/g, '')
    .replace(/\*/g, '');
}
const TITO_IMG = 'https://duendesuy.10web.cloud/wp-content/uploads/2025/12/gemini-image-2_que_tenga_un_pin_en_su_ropa_con_este_logo_en_negro_y_dorado_solo_el_circulo_que_-0_b02c570f-fd54-4b54-b306-3aa6a2b413b2-scaled.jpg';

// ═══════════════════════════════════════════════════════════════
// PACKS DE RUNAS (con URLs directas)
// ═══════════════════════════════════════════════════════════════

const PACKS_RUNAS = [
  { nombre: 'Chispa', runas: 50, precio: 7, url: 'https://duendesuy.10web.cloud/producto/runas-chispa/', desc: 'Para empezar a explorar' },
  { nombre: 'Destello', runas: 100, precio: 12, url: 'https://duendesuy.10web.cloud/producto/runas-destello/', desc: 'El más popular' },
  { nombre: 'Fulgor', runas: 200, precio: 18, url: 'https://duendesuy.10web.cloud/producto/runas-fulgor/', desc: 'Para varias experiencias' },
  { nombre: 'Resplandor', runas: 350, precio: 32, url: 'https://duendesuy.10web.cloud/producto/runas-resplandor/', desc: 'El mejor valor' }
];

// ═══════════════════════════════════════════════════════════════
// EXPERIENCIAS CON INFO COMPLETA Y HUMANA
// ═══════════════════════════════════════════════════════════════

const EXPERIENCIAS = [
  { 
    id: 'tirada-runas',
    nombre: 'Tirada de Runas',
    icono: 'ᚱ',
    runas: 8,
    treboles: 40, 
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
    runas: 15,
    treboles: 75, 
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
    runas: 18,
    treboles: 90, 
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
    runas: 35,
    treboles: 175, 
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
    runas: 45,
    treboles: 225, 
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
    runas: 60,
    treboles: 300, 
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
    runas: 22,
    treboles: 110, 
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
    runas: 28,
    treboles: 140, 
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
    runas: 12,
    treboles: 60, 
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
    nombre: 'Semestral',
    precio: 50,
    precioUY: 2000,
    dias: 180,
    url: 'https://duendesuy.10web.cloud/producto/circulo-semestral/',
    beneficios: [
      'Contenido semanal exclusivo',
      '15 runas por mes',
      '4 tréboles por mes',
      '2 tiradas de runas gratis/mes',
      '1 lectura de energía gratis/mes',
      '48h acceso anticipado',
      '5% en guardianes nuevos'
    ]
  },
  {
    nombre: 'Anual',
    precio: 80,
    precioUY: 3200,
    dias: 365,
    ahorro: '20%',
    destacado: true,
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
  { nombre: "Amatista", color: "#9b59b6", imagen: "https://images.pexels.com/photos/6044266/pexels-photo-6044266.jpeg?auto=compress&w=400", props: "Intuición, paz, protección espiritual", cuidado: "Agua y luna. Evitar sol directo." },
  { nombre: "Cuarzo Rosa", color: "#f8bbd9", imagen: "https://images.pexels.com/photos/5765988/pexels-photo-5765988.jpeg?auto=compress&w=400", props: "Amor incondicional, sanación emocional", cuidado: "Solo luna. Muy sensible al sol." },
  { nombre: "Citrino", color: "#f4d03f", imagen: "https://images.pexels.com/photos/10475789/pexels-photo-10475789.jpeg?auto=compress&w=400", props: "Abundancia, alegría, manifestación", cuidado: "Auto-limpiante. Carga al sol." },
  { nombre: "Turmalina Negra", color: "#2c3e50", imagen: "https://images.pexels.com/photos/5273539/pexels-photo-5273539.jpeg?auto=compress&w=400", props: "Protección máxima, escudo energético", cuidado: "Enterrar en sal o tierra." },
  { nombre: "Labradorita", color: "#3498db", imagen: "https://images.pexels.com/photos/7533347/pexels-photo-7533347.jpeg?auto=compress&w=400", props: "Magia, transformación, intuición", cuidado: "Bajo las estrellas." },
  { nombre: "Cuarzo Transparente", color: "#ecf0f1", imagen: "https://images.pexels.com/photos/1573236/pexels-photo-1573236.jpeg?auto=compress&w=400", props: "Amplificador universal, claridad", cuidado: "Acepta todo. Limpiar seguido." },
  { nombre: "Selenita", color: "#f5f5f5", imagen: "https://images.pexels.com/photos/6186495/pexels-photo-6186495.jpeg?auto=compress&w=400", props: "Limpieza energética, conexión angélica", cuidado: "NUNCA mojar. Solo luna o sonido." },
  { nombre: "Ojo de Tigre", color: "#b8860b", imagen: "https://images.pexels.com/photos/6186512/pexels-photo-6186512.jpeg?auto=compress&w=400", props: "Coraje, prosperidad, protección", cuidado: "Sol de mañana." },
  { nombre: "Obsidiana", color: "#1a1a1a", imagen: "https://images.pexels.com/photos/4040567/pexels-photo-4040567.jpeg?auto=compress&w=400", props: "Verdad, protección psíquica, raíces", cuidado: "Agua corriente. Luna nueva." }
];

// ═══════════════════════════════════════════════════════════════
// LOGIN CON MAGIC LINK
// ═══════════════════════════════════════════════════════════════

function LoginMagicLink({ onLoginExitoso }) {
  const [email, setEmail] = useState('');
  const [estado, setEstado] = useState('inicial'); // inicial, enviando, enviado, error
  const [mensaje, setMensaje] = useState('');
  const [linkDirecto, setLinkDirecto] = useState(null);

  const enviarMagicLink = async (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setMensaje('Por favor ingresá un email válido');
      setEstado('error');
      return;
    }

    setEstado('enviando');
    try {
      const res = await fetch('/api/mi-magia/magic-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.toLowerCase().trim() })
      });
      const data = await res.json();

      if (data.success) {
        setEstado('enviado');
        if (data.linkDirecto) {
          setLinkDirecto(data.linkDirecto);
        }
      } else {
        setMensaje(data.error || 'Error al enviar el enlace');
        setEstado('error');
      }
    } catch (err) {
      setMensaje('Error de conexión. Intentá de nuevo.');
      setEstado('error');
    }
  };

  if (estado === 'enviado') {
    return (
      <div className="login-container">
        <div className="login-card">
          <div className="login-success">
            <span className="login-icono">✨</span>
            <h1>¡Magia lista!</h1>
            {linkDirecto ? (
              <>
                <p>Tocá el botón para entrar:</p>
                <a href={linkDirecto} className="login-btn" style={{display: 'inline-block', marginTop: '1rem', textDecoration: 'none'}}>
                  ✨ Entrar a Mi Magia
                </a>
                <p className="login-sub" style={{marginTop: '1.5rem', fontSize: '0.85rem'}}>
                  (Cuando el dominio esté configurado, esto llegará por email)
                </p>
              </>
            ) : (
              <>
                <p>Revisá tu email <strong>{email}</strong></p>
                <p className="login-sub">Te enviamos un enlace mágico para entrar. Revisá también la carpeta de spam.</p>
              </>
            )}
            <button className="login-btn-sec" onClick={() => { setEstado('inicial'); setLinkDirecto(null); }}>
              Usar otro email
            </button>
          </div>
        </div>
        <style jsx>{loginStyles}</style>
      </div>
    );
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <span className="login-icono">🔮</span>
        <h1>Mi Magia</h1>
        <p className="login-sub">Tu portal personal en Duendes del Uruguay</p>

        <form onSubmit={enviarMagicLink} className="login-form">
          <div className="login-campo">
            <label>Tu email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              disabled={estado === 'enviando'}
              autoFocus
            />
          </div>

          {estado === 'error' && (
            <div className="login-error">{mensaje}</div>
          )}

          <button
            type="submit"
            className="login-btn"
            disabled={estado === 'enviando'}
          >
            {estado === 'enviando' ? 'Enviando...' : '✨ Enviar enlace mágico'}
          </button>
        </form>

        <div className="login-info">
          <p>Te enviaremos un enlace a tu email para entrar sin contraseña.</p>
          <p>¿Primera vez? Se creará tu cuenta automáticamente.</p>
        </div>

        <div className="login-ayuda">
          <a href="https://duendesuy.10web.cloud" className="login-link">
            ← Volver a la tienda
          </a>
        </div>
      </div>
      <style jsx>{loginStyles}</style>
    </div>
  );
}

const loginStyles = `
  .login-container {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0f0f0f 100%);
    padding: 20px;
    font-family: 'Cormorant Garamond', serif;
  }

  .login-card {
    background: #111;
    border-radius: 20px;
    padding: 3rem 2.5rem;
    max-width: 420px;
    width: 100%;
    text-align: center;
    border: 1px solid #222;
    box-shadow: 0 20px 60px rgba(0,0,0,0.5);
  }

  .login-icono {
    font-size: 4rem;
    display: block;
    margin-bottom: 1rem;
    filter: drop-shadow(0 0 20px #d4af3750);
  }

  .login-card h1 {
    font-family: 'Tangerine', cursive;
    font-size: 3.5rem;
    color: #fff;
    margin: 0 0 0.5rem;
  }

  .login-sub {
    color: rgba(255,255,255,0.6);
    font-size: 1.1rem;
    margin-bottom: 2rem;
  }

  .login-form {
    margin-bottom: 1.5rem;
  }

  .login-campo {
    text-align: left;
    margin-bottom: 1.5rem;
  }

  .login-campo label {
    display: block;
    color: rgba(255,255,255,0.7);
    font-size: 0.9rem;
    margin-bottom: 0.5rem;
    font-family: 'Cinzel', serif;
  }

  .login-campo input {
    width: 100%;
    padding: 14px 16px;
    background: #0a0a0a;
    border: 1px solid #333;
    border-radius: 10px;
    color: #fff;
    font-size: 1.1rem;
    font-family: inherit;
    transition: all 0.3s;
  }

  .login-campo input:focus {
    outline: none;
    border-color: #d4af37;
    box-shadow: 0 0 15px #d4af3730;
  }

  .login-campo input::placeholder {
    color: rgba(255,255,255,0.3);
  }

  .login-btn {
    width: 100%;
    padding: 16px;
    background: linear-gradient(135deg, #d4af37 0%, #b8972e 100%);
    color: #0a0a0a;
    border: none;
    border-radius: 10px;
    font-family: 'Cinzel', serif;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s;
  }

  .login-btn:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(212, 175, 55, 0.3);
  }

  .login-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .login-btn-sec {
    background: transparent;
    color: rgba(255,255,255,0.6);
    border: 1px solid #333;
    padding: 12px 24px;
    border-radius: 8px;
    font-size: 0.9rem;
    cursor: pointer;
    margin-top: 1.5rem;
    transition: all 0.3s;
  }

  .login-btn-sec:hover {
    border-color: #666;
    color: #fff;
  }

  .login-error {
    background: rgba(255,100,100,0.1);
    border: 1px solid rgba(255,100,100,0.3);
    color: #ff9999;
    padding: 12px;
    border-radius: 8px;
    margin-bottom: 1rem;
    font-size: 0.9rem;
  }

  .login-info {
    background: #0a0a0a;
    padding: 1rem;
    border-radius: 10px;
    margin-bottom: 1.5rem;
  }

  .login-info p {
    color: rgba(255,255,255,0.5);
    font-size: 0.85rem;
    margin: 0.3rem 0;
  }

  .login-ayuda {
    padding-top: 1rem;
    border-top: 1px solid #222;
  }

  .login-link {
    color: rgba(255,255,255,0.4);
    text-decoration: none;
    font-size: 0.9rem;
    transition: color 0.3s;
  }

  .login-link:hover {
    color: #d4af37;
  }

  .login-success h1 {
    font-size: 2.5rem;
    margin-bottom: 1rem;
  }

  .login-success p {
    color: rgba(255,255,255,0.8);
    margin: 0.5rem 0;
  }

  .login-success strong {
    color: #d4af37;
  }

  @media (max-width: 500px) {
    .login-card {
      padding: 2rem 1.5rem;
    }
    .login-card h1 {
      font-size: 2.5rem;
    }
  }
`;

// ═══════════════════════════════════════════════════════════════
// TOUR DE MI MAGIA (después del onboarding)
// ═══════════════════════════════════════════════════════════════

const PASOS_TOUR = [
  {
    id: 'bienvenida',
    titulo: '¡Bienvenida a Mi Magia!',
    icono: '✨',
    mensaje: 'Este es tu espacio personal en Duendes del Uruguay. Vamos a hacer un recorrido rápido para que sepas todo lo que podés hacer acá.',
    tip: 'El tour dura menos de 2 minutos'
  },
  {
    id: 'runas',
    titulo: 'Tus Runas',
    icono: 'ᚱ',
    mensaje: 'Las runas son tu moneda mágica. Las usás para acceder a experiencias como tiradas de runas, lecturas del alma, oráculos y más. ¡Tenés 100 runas de regalo para empezar!',
    tip: 'Podés comprar más runas cuando las necesites'
  },
  {
    id: 'treboles',
    titulo: 'Tus Tréboles',
    icono: '☘️',
    mensaje: 'Los tréboles son puntos de fidelidad. Ganás 1 trébol por cada $10 USD que gastás en la tienda. Podés canjearlos por descuentos, envío gratis y más.',
    tip: 'Los tréboles nunca expiran'
  },
  {
    id: 'experiencias',
    titulo: 'Experiencias',
    icono: '◈',
    mensaje: 'Acá encontrás todas las experiencias espirituales: tiradas de runas, susurros del guardián, oráculos del mes, lecturas del alma, registros akáshicos y mucho más.',
    tip: 'Cada experiencia tiene un costo en runas diferente'
  },
  {
    id: 'grimorio',
    titulo: 'Tu Grimorio',
    icono: '📖',
    mensaje: 'El Grimorio es tu diario mágico personal. Podés escribir tus sueños, reflexiones, rituales que hiciste, y ver el calendario lunar para planificar tus prácticas.',
    tip: 'Todo lo que escribas queda guardado para siempre'
  },
  {
    id: 'jardin',
    titulo: 'Jardín de Guardianes',
    icono: '🌿',
    mensaje: 'Acá ves todos los guardianes que adoptaste. Podés conectar con ellos, ver sus mensajes y fortalecer el vínculo.',
    tip: 'Tu jardín crece con cada guardián que adoptás'
  },
  {
    id: 'circulo',
    titulo: 'Círculo de Duendes',
    icono: '★',
    mensaje: 'El Círculo es nuestra membresía premium. Te da un guardián semanal con mensajes personalizados, guía lunar, rituales exclusivos, comunidad privada y 100 runas de regalo.',
    tip: 'Membresía semestral $50 USD o anual $80 USD'
  },
  {
    id: 'tito',
    titulo: 'Tito, tu Asistente',
    icono: '🧙',
    imagen: 'https://duendesuy.10web.cloud/wp-content/uploads/2026/01/gemini-image-2_que_tenga_un_pin_en_su_ropa_con_este_logo_en_negro_y_dorado_solo_el_circulo_que_-1_53c2ddf7-82d8-47fa-823e-7b0f3af1398e-scaled.jpg',
    mensaje: 'Si tenés dudas, Tito está ahí para ayudarte. Es un duende sabio que conoce todo sobre Duendes del Uruguay. Lo encontrás en el botón flotante.',
    tip: 'Preguntale lo que quieras'
  },
  {
    id: 'final',
    titulo: '¡Listo para la magia!',
    icono: '🎉',
    mensaje: 'Ya conocés lo básico. Explorá a tu ritmo, usá tus runas de regalo, y recordá que siempre podés volver a ver este tour desde la sección FAQ.',
    tip: 'Tu aventura mágica comienza ahora'
  }
];

function TourMiMagia({ usuario, onFinish }) {
  const [paso, setPaso] = useState(0);
  const pasoActual = PASOS_TOUR[paso];
  const esUltimo = paso === PASOS_TOUR.length - 1;
  const esPrimero = paso === 0;

  return (
    <div className="tour-container">
      <div className="tour-card">
        <div className="tour-progress">
          {PASOS_TOUR.map((_, i) => (
            <div key={i} className={`tour-dot ${i === paso ? 'activo' : ''} ${i < paso ? 'completado' : ''}`} />
          ))}
        </div>

        <div className="tour-content">
          {pasoActual.imagen ? (
            <img src={pasoActual.imagen} alt={pasoActual.titulo} className="tour-imagen" />
          ) : (
            <span className="tour-icono">{pasoActual.icono}</span>
          )}
          <h1>{pasoActual.titulo}</h1>
          <p className="tour-mensaje">{pasoActual.mensaje}</p>
          <div className="tour-tip">
            <span>💡</span>
            <span>{pasoActual.tip}</span>
          </div>
        </div>

        <div className="tour-nav">
          {!esPrimero && (
            <button className="tour-btn-sec" onClick={() => setPaso(paso - 1)}>
              ← Anterior
            </button>
          )}
          {esPrimero && (
            <button className="tour-btn-skip" onClick={onFinish}>
              Saltar tour
            </button>
          )}
          <button className="tour-btn-primary" onClick={() => esUltimo ? onFinish() : setPaso(paso + 1)}>
            {esUltimo ? '¡Comenzar! ✨' : 'Siguiente →'}
          </button>
        </div>

        <div className="tour-counter">
          {paso + 1} de {PASOS_TOUR.length}
        </div>
      </div>

      <style jsx>{`
        .tour-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0f0f0f 100%);
          padding: 20px;
          font-family: 'Cormorant Garamond', serif;
        }

        .tour-card {
          background: #111;
          border-radius: 20px;
          padding: 2.5rem;
          max-width: 480px;
          width: 100%;
          text-align: center;
          border: 1px solid #222;
          box-shadow: 0 20px 60px rgba(0,0,0,0.5);
        }

        .tour-progress {
          display: flex;
          justify-content: center;
          gap: 8px;
          margin-bottom: 2rem;
        }

        .tour-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #333;
          transition: all 0.3s;
        }

        .tour-dot.activo {
          background: #d4af37;
          transform: scale(1.3);
          box-shadow: 0 0 10px #d4af3750;
        }

        .tour-dot.completado {
          background: #d4af3780;
        }

        .tour-content {
          margin-bottom: 2rem;
        }

        .tour-icono {
          font-size: 4rem;
          display: block;
          margin-bottom: 1rem;
          filter: drop-shadow(0 0 20px #d4af3750);
        }
        .tour-imagen {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          object-fit: cover;
          margin-bottom: 1rem;
          border: 3px solid #d4af37;
          box-shadow: 0 4px 15px rgba(212, 175, 55, 0.3);
        }

        .tour-card h1 {
          font-family: 'Tangerine', cursive;
          font-size: 2.5rem;
          color: #fff;
          margin: 0 0 1rem;
        }

        .tour-mensaje {
          font-size: 1.1rem;
          line-height: 1.7;
          color: rgba(255,255,255,0.8);
          margin: 0;
        }

        .tour-tip {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #1a1a1a;
          padding: 10px 16px;
          border-radius: 8px;
          margin-top: 1.5rem;
          font-size: 0.9rem;
          color: rgba(255,255,255,0.6);
        }

        .tour-nav {
          display: flex;
          gap: 12px;
          justify-content: center;
          margin-bottom: 1.5rem;
        }

        .tour-btn-primary {
          background: linear-gradient(135deg, #d4af37 0%, #b8972e 100%);
          color: #0a0a0a;
          border: none;
          padding: 14px 28px;
          border-radius: 8px;
          font-family: 'Cinzel', serif;
          font-size: 0.95rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
        }

        .tour-btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(212, 175, 55, 0.3);
        }

        .tour-btn-sec {
          background: transparent;
          color: rgba(255,255,255,0.7);
          border: 1px solid #333;
          padding: 14px 20px;
          border-radius: 8px;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.3s;
        }

        .tour-btn-sec:hover {
          border-color: #666;
          color: #fff;
        }

        .tour-btn-skip {
          background: transparent;
          color: rgba(255,255,255,0.4);
          border: none;
          padding: 14px 20px;
          font-size: 0.85rem;
          cursor: pointer;
          transition: all 0.3s;
        }

        .tour-btn-skip:hover {
          color: rgba(255,255,255,0.7);
        }

        .tour-counter {
          font-size: 0.8rem;
          color: rgba(255,255,255,0.3);
          font-family: 'Cinzel', serif;
        }

        @media (max-width: 500px) {
          .tour-card {
            padding: 1.5rem;
          }
          .tour-card h1 {
            font-size: 2rem;
          }
          .tour-icono {
            font-size: 3rem;
          }
          .tour-mensaje {
            font-size: 1rem;
          }
        }
      `}</style>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// COMPONENTE PRINCIPAL
// ═══════════════════════════════════════════════════════════════

export default function MiMagia() {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [necesitaLogin, setNecesitaLogin] = useState(false);
  const [seccion, setSeccion] = useState('inicio');
  const [onboarding, setOnboarding] = useState(false);
  const [mostrandoTour, setMostrandoTour] = useState(false);
  const [chatAbierto, setChatAbierto] = useState(false);
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [sidebarAbierto, setSidebarAbierto] = useState(false);
  const [token, setToken] = useState('');
  const [pais, setPais] = useState('UY');
  // FORZAR MOBILE: Siempre mostrar hamburguesa en pantallas pequeñas
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    cargarUsuario();
    detectarPais();
    const checkMobile = () => setIsMobile(window.innerWidth <= 900);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const detectarPais = async () => {
    try { const res = await fetch('https://ipapi.co/json/'); const data = await res.json(); setPais(data.country_code || 'UY'); } catch(e) { setPais('UY'); }
  };

  const cargarUsuario = async () => {
    const params = new URLSearchParams(window.location.search);
    let t = params.get('token');

    // Si no hay token en URL, buscar en localStorage
    if (!t) {
      t = localStorage.getItem('mimagia_token');
    }

    // Si todavía no hay token, mostrar login
    if (!t) {
      setNecesitaLogin(true);
      setCargando(false);
      return;
    }

    setToken(t);
    try {
      const res = await fetch(`${API_BASE}/api/mi-magia/usuario?token=${t}`);
      const data = await res.json();
      if (data.success && data.usuario) {
        setUsuario(data.usuario);
        // Guardar token en localStorage para próximas visitas
        localStorage.setItem('mimagia_token', t);
        // Limpiar token de URL para que quede más limpia
        if (params.get('token')) {
          window.history.replaceState({}, '', '/mi-magia');
        }
        if (!data.usuario.onboardingCompleto) {
          setOnboarding(true);
        } else {
          // Si ya completó onboarding pero nunca vio el tour, mostrarlo
          const tourVisto = localStorage.getItem('tour_mimagia_visto');
          if (!tourVisto) {
            setMostrandoTour(true);
          }
        }
      } else {
        // Token inválido, mostrar login
        localStorage.removeItem('mimagia_token');
        setNecesitaLogin(true);
      }
    } catch (e) {
      console.error(e);
      setNecesitaLogin(true);
    }
    setCargando(false);
  };

  if (cargando) return <Carga />;
  if (necesitaLogin) return <LoginMagicLink onLoginExitoso={() => window.location.reload()} />;
  if (onboarding) return <Onboarding usuario={usuario} token={token} onDone={(d) => { setUsuario({...usuario, ...d, onboardingCompleto: true, runas: 100}); setOnboarding(false); setMostrandoTour(true); }} />;
  if (mostrandoTour) return <TourMiMagia usuario={usuario} onFinish={() => { setMostrandoTour(false); localStorage.setItem('tour_mimagia_visto', 'true'); }} />;

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
      case 'test_guardian': return <TestGuardian usuario={usuario} onComplete={(r) => setUsuario({...usuario, testGuardian: r})} />;
      case 'cosmos': return <CosmosMes usuario={usuario} />;
      case 'circulo': return <CirculoSec usuario={usuario} setUsuario={setUsuario} token={token} pais={pais} />;
      case 'promociones': return <PromocionesMagicas usuario={usuario} ir={setSeccion} />;
      case 'grimorio': return <GrimorioSec usuario={usuario} token={token} setUsuario={setUsuario} />;
      case 'foro': return <ForoSec usuario={usuario} setUsuario={setUsuario} />;
      case 'utilidades': return <UtilidadesSec usuario={usuario} />;
      case 'faq': return <FaqSec onVerTour={() => setMostrandoTour(true)} />;
      default: return <Inicio usuario={usuario} ir={setSeccion} />;
    }
  };

  // Estilos inline para móvil (bypass CSS cache)
  // IMPORTANTE: Usar 'none' antes de mount para evitar hidratación
  const showMobileMenu = mounted && isMobile;
  const mobileMenuBtn = {
    display: showMobileMenu ? 'flex' : 'none',
    flexDirection: 'column',
    gap: '5px',
    background: '#d4af37',
    border: 'none',
    borderRadius: '8px',
    padding: '12px',
    minWidth: '48px',
    minHeight: '48px',
    cursor: 'pointer',
    alignItems: 'center',
    justifyContent: 'center',
    // TOUCH FIX
    touchAction: 'manipulation',
    WebkitTapHighlightColor: 'transparent',
    pointerEvents: 'auto',
    userSelect: 'none',
    zIndex: 101
  };
  const mobileMenuLine = { width: '22px', height: '3px', background: '#fff', borderRadius: '2px', display: 'block' };
  const mobileNav = {
    position: 'fixed', top: '65px', left: 0, bottom: 0, width: '260px',
    background: '#fff', borderRight: '1px solid #e0e0e0', padding: '1rem 0',
    display: 'flex', flexDirection: 'column', zIndex: 99, overflowY: 'auto',
    transform: menuAbierto ? 'translateX(0)' : 'translateX(-100%)',
    transition: 'transform 0.3s ease',
    boxShadow: menuAbierto ? '4px 0 20px rgba(0,0,0,0.2)' : 'none'
  };
  const mobileOverlay = {
    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 98
  };

  return (
    <div className="app">
      <style jsx global>{estilos}</style>
      <header className="header" style={isMobile ? {padding: '0 12px'} : {}}>
        <div className="logo"><span>✦</span> MI MAGIA</div>
        {!isMobile && <div className="user-info">Bienvenid{usuario?.pronombre === 'el' ? 'o' : 'a'}, {usuario?.nombrePreferido}</div>}
        <div className="hstats" style={isMobile ? {gap: '6px'} : {}}>
          <span style={{background: '#1a1a1a', color: '#fff', padding: '4px 10px', borderRadius: '20px', fontSize: isMobile ? '0.75rem' : '0.85rem'}}>☘ {usuario?.treboles || 0}</span>
          <span style={{background: '#1a1a1a', color: '#fff', padding: '4px 10px', borderRadius: '20px', fontSize: isMobile ? '0.75rem' : '0.85rem'}}>ᚱ {usuario?.runas || 0}</span>
        </div>
        <button
          style={mobileMenuBtn}
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); setMenuAbierto(!menuAbierto); }}
          onTouchEnd={(e) => { e.preventDefault(); e.stopPropagation(); setMenuAbierto(!menuAbierto); }}
          aria-label="Menú"
        >
          <span style={mobileMenuLine}></span>
          <span style={mobileMenuLine}></span>
          <span style={mobileMenuLine}></span>
        </button>
      </header>

      {menuAbierto && isMobile && <div style={mobileOverlay} onClick={() => setMenuAbierto(false)} />}
      <nav className={`nav ${menuAbierto ? 'abierto' : ''}`} style={isMobile ? mobileNav : {}}>
        {[['inicio','◇','Inicio'],['test_guardian','🔮','Test del Guardián'],['canalizaciones','♦','Mis Canalizaciones'],['jardin','☘','Jardín Mágico'],['experiencias','✦','Experiencias'],['experiencias_catalogo','ᚱ','Catálogo Runas'],['regalos','❤','Regalos']].map(([k,i,t]) =>
          <button key={k} className={`nav-item ${seccion===k?'activo':''}`} onClick={() => {setSeccion(k);setMenuAbierto(false);}}><span className="nav-i">{i}</span>{t}</button>
        )}
        <div className="nav-sep">El Mundo Elemental</div>
        {[['test_elemental','◈','Tu Elemento'],['mundo','❂','Reino Elemental'],['cuidados','❧','Cuidados'],['guia_cristales','💎','Guía Cristales']].map(([k,i,t]) =>
          <button key={k} className={`nav-item ${seccion===k?'activo':''}`} onClick={() => {setSeccion(k);setMenuAbierto(false);}}><span className="nav-i">{i}</span>{t}</button>
        )}
        <div className="nav-sep">Tu Espacio</div>
        {[['circulo','★','Círculo'],['promociones','🎁','Promociones Mágicas'],['cosmos','☽','Cosmos del Mes'],['grimorio','▣','Grimorio'],['foro','💬','Foro Mágico']].map(([k,i,t]) =>
          <button key={k} className={`nav-item ${seccion===k?'activo':''}`} onClick={() => {setSeccion(k);setMenuAbierto(false);}}><span className="nav-i">{i}</span>{t}</button>
        )}
        <div className="nav-sep">Recursos</div>
        {[['utilidades','⚡','Utilidades'],['faq','❓','FAQ Duendes']].map(([k,i,t]) =>
          <button key={k} className={`nav-item ${seccion===k?'activo':''}`} onClick={() => {setSeccion(k);setMenuAbierto(false);}}><span className="nav-i">{i}</span>{t}</button>
        )}
        <a href="https://duendesuy.10web.cloud/shop/" target="_blank" rel="noopener" className="nav-volver">↗ Ir a la tienda</a>
      </nav>
      
      <main className={`contenido ${sidebarAbierto && !isMobile ? 'con-sidebar' : ''}`}>
        {renderSeccion()}
      </main>

      {/* SIDEBAR OPORTUNIDADES MÁGICAS */}
      {!isMobile && (
        <>
          <button
            className={`sidebar-toggle ${sidebarAbierto ? 'abierto' : ''}`}
            onClick={() => setSidebarAbierto(!sidebarAbierto)}
            title={sidebarAbierto ? 'Cerrar ofertas' : 'Ver ofertas mágicas'}
          >
            <span className="toggle-icon">{sidebarAbierto ? '→' : '★'}</span>
            {!sidebarAbierto && <span className="toggle-badge">OFERTAS</span>}
          </button>

          <aside className={`sidebar-oportunidades ${sidebarAbierto ? 'abierto' : ''}`}>
            <div className="sidebar-header">
              <h3>✦ Oportunidades Mágicas</h3>
              <p>Ofertas exclusivas para ti</p>
            </div>

            {/* CÍRCULO PROMOCIÓN */}
            {!usuario?.esCirculo && (
              <div className="sidebar-card circulo-promo">
                <div className="promo-badge">15 DÍAS GRATIS</div>
                <span className="promo-icon">★</span>
                <h4>Círculo de Duendes</h4>
                <p>Tu santuario secreto con beneficios exclusivos</p>
                <ul className="promo-beneficios">
                  <li>✓ Contenido semanal exclusivo</li>
                  <li>✓ Runas y tréboles extra</li>
                  <li>✓ Tiradas gratis mensuales</li>
                  <li>✓ Descuentos de 5% a 10%</li>
                  <li>✓ Acceso anticipado</li>
                </ul>
                <button className="btn-promo" onClick={() => {setSeccion('circulo'); setSidebarAbierto(false);}}>
                  Probar gratis →
                </button>
              </div>
            )}

            {usuario?.esCirculo && (
              <div className="sidebar-card circulo-activo">
                <span className="promo-icon">★</span>
                <h4>Sos parte del Círculo</h4>
                <p>Membresía activa</p>
                <button className="btn-outline" onClick={() => {setSeccion('circulo'); setSidebarAbierto(false);}}>
                  Ver contenido exclusivo
                </button>
              </div>
            )}

            {/* RUNAS DE PODER */}
            <div className="sidebar-card">
              <div className="oferta-mini">
                <span>ᚱ</span>
                <div>
                  <strong>Runas de Poder</strong>
                  <p>Para experiencias mágicas</p>
                </div>
              </div>
              <div style={{display:'flex',flexDirection:'column',gap:'6px'}}>
                <a href="https://duendesuy.10web.cloud/producto/runas-chispa/" target="_blank" rel="noopener" className="btn-outline-sm" style={{display:'flex',justifyContent:'space-between'}}>
                  <span>50 Runas</span><span style={{color:'#d4af37'}}>$7</span>
                </a>
                <a href="https://duendesuy.10web.cloud/producto/runas-destello/" target="_blank" rel="noopener" className="btn-outline-sm" style={{display:'flex',justifyContent:'space-between'}}>
                  <span>100 Runas</span><span style={{color:'#d4af37'}}>$12</span>
                </a>
                <a href="https://duendesuy.10web.cloud/producto/runas-fulgor/" target="_blank" rel="noopener" className="btn-outline-sm" style={{display:'flex',justifyContent:'space-between'}}>
                  <span>200 Runas</span><span style={{color:'#d4af37'}}>$18</span>
                </a>
              </div>
            </div>

            {/* EXPERIENCIA DESTACADA */}
            <div className="sidebar-card">
              <div className="oferta-mini">
                <span>✦</span>
                <div>
                  <strong>Tirada de Runas</strong>
                  <p>5 runas • 20-30 min</p>
                </div>
              </div>
              <button className="btn-outline-sm" onClick={() => {setSeccion('experiencias'); setSidebarAbierto(false);}}>
                Solicitar
              </button>
            </div>

            {/* GUARDIANES */}
            <div className="sidebar-card">
              <div className="oferta-mini">
                <span>🧙</span>
                <div>
                  <strong>Nuevos Guardianes</strong>
                  <p>Descubrí quién te llama</p>
                </div>
              </div>
              <a href="https://duendesuy.10web.cloud/shop/" target="_blank" rel="noopener" className="btn-outline-sm">
                Ver tienda
              </a>
            </div>

            {/* FOOTER SIDEBAR */}
            <div className="sidebar-footer">
              <p>¿Preguntas sobre ofertas?</p>
              <button className="btn-tito" onClick={() => {setChatAbierto(true); setSidebarAbierto(false);}}>
                Preguntale a Tito 🤖
              </button>
            </div>
          </aside>
        </>
      )}

      {!chatAbierto && <TitoBurbuja usuario={usuario} onAbrir={() => setChatAbierto(true)} />}
      <Tito usuario={usuario} abierto={chatAbierto} setAbierto={setChatAbierto} />
    </div>
  );
}

function Carga() {
  return <div className="carga"><style jsx global>{estilos}</style><div className="carga-c"><div className="carga-runa">ᚱ</div><p>Preparando tu magia...</p></div></div>;
}

function Onboarding({ usuario, token, onDone }) {
  const [paso, setPaso] = useState(0);
  const [datos, setDatos] = useState({ nombrePreferido: usuario?.nombre || '', pronombre: 'ella', intereses: [], moneda: 'USD', cumpleanos: '' });
  const ints = ['Me siento sola', 'Nada me alcanza', 'Repito patrones', 'Quiero sanar', 'Busco protección', 'Necesito claridad', 'Quiero paz', 'Busco amor'];

  const guardar = async () => {
    try { await fetch(`${API_BASE}/api/mi-magia/onboarding`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ token, ...datos }) }); } catch(e) {}
    onDone(datos);
  };

  return (
    <div className="onb"><style jsx global>{estilos}</style>
      <div className="onb-card">
        {paso === 0 ? (
          <div className="onb-hero">
            <div className="onb-hero-glow"></div>
            <span className="onb-hero-runa">ᛉ</span>
            <h1>Ya te estaba esperando.</h1>
            <p className="onb-hero-sub">Antes de que llegaras a esta página, un guardián empezó a soñar con vos.</p>
            <div className="onb-validation">
              <p>Llevás tiempo sintiendo que algo falta.</p>
              <p>Que das más de lo que recibís.</p>
              <p>Que nadie termina de entenderte.</p>
              <p className="onb-validation-reveal">No estás loca. Estás despierta.</p>
            </div>
            <button className="btn-gold btn-hero-cta" onClick={() => setPaso(1)}>
              Descubrir quién me eligió
            </button>
            <small className="onb-hero-note">Solo 4 preguntas para personalizar tu experiencia</small>
          </div>
        ) : (
          <>
            <div className="onb-header"><span>✦</span><h2>Tu espacio mágico</h2><p>Paso {paso} de 4</p></div>
            <div className="onb-prog">{[1,2,3,4].map(p => <div key={p} className={`prog-p ${paso >= p ? 'act' : ''}`}>{p}</div>)}</div>

            {paso === 1 && (
              <div className="onb-paso">
                <h3>¿Cómo te llama tu guardián?</h3>
                <p className="onb-sub">Este nombre resonará en cada mensaje que recibas</p>
                <input type="text" value={datos.nombrePreferido} onChange={e => setDatos({...datos, nombrePreferido: e.target.value})} placeholder="Tu nombre verdadero" />
              </div>
            )}

            {paso === 2 && (
              <div className="onb-paso">
                <h3>¿Qué te trajo hasta acá?</h3>
                <p className="onb-sub">Elegí todo lo que resuene en tu corazón</p>
                <div className="ints ints-dolor">
                  {ints.map(i => (
                    <button key={i} className={`int ${datos.intereses.includes(i) ? 'act' : ''}`} onClick={() => setDatos({...datos, intereses: datos.intereses.includes(i) ? datos.intereses.filter(x=>x!==i) : [...datos.intereses, i]})}>
                      {i}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {paso === 3 && (
              <div className="onb-paso">
                <h3>¿Desde dónde nos conectamos?</h3>
                <p className="onb-sub">Para mostrarte precios en tu moneda</p>
                <div className="monedas">
                  <button className={`moneda ${datos.moneda === 'UYU' ? 'act' : ''}`} onClick={() => setDatos({...datos, moneda: 'UYU'})}>
                    <span>🇺🇾</span>
                    <strong>Uruguay</strong>
                    <small>Pesos</small>
                  </button>
                  <button className={`moneda ${datos.moneda === 'USD' ? 'act' : ''}`} onClick={() => setDatos({...datos, moneda: 'USD'})}>
                    <span>🌎</span>
                    <strong>Otro país</strong>
                    <small>Dólares</small>
                  </button>
                </div>
              </div>
            )}

            {paso === 4 && (
              <div className="onb-paso onb-final">
                <div className="onb-final-glow"></div>
                <h3>{datos.nombrePreferido}, tu guardián ya sabe que llegaste.</h3>
                <div className="regalo-box regalo-box-new">
                  <span className="regalo-runa">ᚱ</span>
                  <p>Tu regalo de bienvenida:</p>
                  <strong>100 Runas de Poder</strong>
                  <small>Para que descubras las experiencias que te esperan</small>
                </div>
                <div className="onb-fomo">
                  <p>349 personas ya encontraron a su guardián.</p>
                  <p className="onb-fomo-question">¿Estás lista para conocer al tuyo?</p>
                </div>
              </div>
            )}

            <div className="onb-btns">
              {paso > 1 && <button className="btn-sec" onClick={() => setPaso(paso-1)}>Atrás</button>}
              {paso < 4 && <button className="btn-pri" onClick={() => setPaso(paso+1)} disabled={paso === 1 && !datos.nombrePreferido}>Continuar</button>}
              {paso === 4 && <button className="btn-gold btn-enter" onClick={guardar}>Entrar a Mi Magia</button>}
            </div>
          </>
        )}
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

  // Frases de validación rotativas según intereses del usuario
  const validaciones = {
    'Me siento sola': 'Tu guardián siente tu soledad. No viniste a caminar sola.',
    'Nada me alcanza': 'La abundancia no es acumulación. Es flujo. Tu guardián te enseñará.',
    'Repito patrones': 'Los patrones que se repiten no son mala suerte. Son señales.',
    'Quiero sanar': 'No necesitás sanar sola. Tu guardián ya conoce tus heridas.',
    'Busco protección': 'Hay algo cuidándote desde antes de que supieras que existía.',
    'Necesito claridad': 'La claridad no llega pensando. Llega sintiendo. Dejate guiar.',
    'Quiero paz': 'La paz que buscás afuera ya existe adentro. Te ayudamos a encontrarla.',
    'Busco amor': 'El amor empieza cuando te reconocés. Tu guardián te ve.',
  };
  const interesUsuario = usuario?.intereses?.[0];
  const fraseValidacion = interesUsuario && validaciones[interesUsuario] ? validaciones[interesUsuario] : 'Tu guardián ya sabe que llegaste. Ahora solo falta que lo escuches.';

  return (
    <div className="sec">
      {/* HERO CON VALIDACIÓN EMOCIONAL */}
      <div className="banner banner-neuro">
        <div className="banner-glow"></div>
        <div className="banner-rango">
          <span className="rango-icono">{rango.icono}</span>
          <div className="rango-info">
            <span className="rango-nombre">{rango.nombre}</span>
            <span className="rango-ben">{rango.beneficio}</span>
          </div>
        </div>
        <h1 className="hero-title">{usuario?.nombrePreferido}, te estaba esperando.</h1>
        <p className="hero-validation">{fraseValidacion}</p>
        {siguiente && (
          <div className="progreso-rango">
            <div className="progreso-bar"><div className="progreso-fill" style={{width: `${Math.min(progreso, 100)}%`}}></div></div>
            <small>${usuario?.gastado || 0} / ${siguiente.min} para {siguiente.icono} {siguiente.nombre}</small>
          </div>
        )}
      </div>

      {/* SEÑAL DEL DÍA */}
      <SenalDelDia usuario={usuario} />

      {/* ══════ TEST DEL GUARDIÁN - EMBEBIDO EN INICIO ══════ */}
      <div className="test-guardian-inicio-wrapper">
        <TestGuardian
          usuario={usuario}
          onComplete={(resultado) => {
            // Recargar usuario con nuevo testGuardian
            window.location.reload();
          }}
        />
      </div>

      {/* STATS CON SIGNIFICADO */}
      <div className="stats-g">
        <div className="stat-c" onClick={() => ir('canalizaciones')}><div className="stat-n">{(usuario?.guardianes?.length || 0) + (usuario?.lecturas?.length || 0)}</div><div className="stat-t">Conexiones</div></div>
        <div className="stat-c" onClick={() => ir('jardin')}><div className="stat-n">{usuario?.treboles || 0}</div><div className="stat-t">Tréboles</div></div>
        <div className="stat-c" onClick={() => ir('jardin')}><div className="stat-n">{usuario?.runas || 0}</div><div className="stat-t">Runas</div></div>
        <div className="stat-c" onClick={() => ir('grimorio')}><div className="stat-n">{usuario?.diario?.length || 0}</div><div className="stat-t">Escritos</div></div>
      </div>

      {/* CATEGORÍAS POR DOLOR/NECESIDAD */}
      <div className="dolor-section">
        <h2 className="dolor-titulo">¿Qué necesitás sanar?</h2>
        <div className="dolor-cards">
          <a href="https://duendesuy.10web.cloud/categoria-producto/amor/" target="_blank" rel="noopener" className="dolor-card dolor-amor">
            <span className="dolor-icon">◈</span>
            <strong>Me siento sola</strong>
            <small>Guardianes de Conexión</small>
          </a>
          <a href="https://duendesuy.10web.cloud/categoria-producto/abundancia/" target="_blank" rel="noopener" className="dolor-card dolor-abundancia">
            <span className="dolor-icon">✦</span>
            <strong>Nada me alcanza</strong>
            <small>Guardianes de Abundancia</small>
          </a>
          <a href="https://duendesuy.10web.cloud/categoria-producto/proteccion/" target="_blank" rel="noopener" className="dolor-card dolor-proteccion">
            <span className="dolor-icon">◇</span>
            <strong>Tengo miedo</strong>
            <small>Guardianes Protectores</small>
          </a>
          <a href="https://duendesuy.10web.cloud/categoria-producto/sanacion/" target="_blank" rel="noopener" className="dolor-card dolor-sanacion">
            <span className="dolor-icon">❧</span>
            <strong>Quiero sanar</strong>
            <small>Guardianes Sanadores</small>
          </a>
        </div>
      </div>

      {/* ACCESOS RÁPIDOS REESCRITOS */}
      <div className="accesos-g">
        <button className="acceso" onClick={() => ir('experiencias')}><span>✦</span><strong>Pedirle algo al universo</strong><small>Tiradas, lecturas, registros akáshicos</small></button>
        <button className="acceso" onClick={() => ir('test_elemental')}><span>◈</span><strong>Descubrir quién me eligió</strong><small>Test de elemento y guardián</small></button>
        <button className="acceso" onClick={() => ir('regalos')}><span>❤</span><strong>Regalar magia a alguien</strong><small>Que otro sienta lo que vos sentiste</small></button>
      </div>

      {/* MICRO-VALIDACIÓN */}
      <div className="micro-validation">
        <p>Si llegaste hasta acá, no fue casualidad.</p>
        <p className="micro-highlight">El guardián te encuentra. No al revés.</p>
      </div>

      {!usuario?.esCirculo && (
        <div className="banner-circ banner-circ-neuro" onClick={() => ir('circulo')}>
          <span className="circ-glow"></span>
          <span>★</span>
          <div>
            <h3>349 elegidas ya son parte del Círculo</h3>
            <p>No es una membresía. Es una hermandad.</p>
          </div>
          <span className="badge badge-pulse">UNIRME</span>
        </div>
      )}

      {/* FOMO ESPIRITUAL */}
      <div className="fomo-box">
        <div className="fomo-content">
          <span className="fomo-icon">ᛉ</span>
          <div>
            <p className="fomo-main">Cada guardián existe una sola vez.</p>
            <p className="fomo-sub">Si se vende, no vuelve. No es marketing. Es canalización.</p>
          </div>
        </div>
        <a href="https://duendesuy.10web.cloud/shop/" target="_blank" rel="noopener" className="fomo-cta">Conocer a mi guardián</a>
      </div>

      {/* Banner Promociones */}
      <div className="banner-promo" onClick={() => ir('promociones')}>
        <span className="promo-icon-banner">✦</span>
        <div className="promo-banner-content">
          <h3>Oportunidades mágicas</h3>
          <p>Ofertas exclusivas que aparecen y desaparecen.</p>
        </div>
        <span className="promo-arrow">→</span>
      </div>

      <div className="info-box info-box-minimal">
        <h3>Tu espacio explicado</h3>
        <div className="info-grid">
          <div><span>☘</span><h4>Tréboles</h4><p>Se ganan comprando. Canjealos por descuentos, envíos gratis, regalos especiales.</p></div>
          <div><span>ᚱ</span><h4>Runas</h4><p>Moneda mágica para experiencias. Tiradas, lecturas, conexiones profundas.</p></div>
          <div><span>▣</span><h4>Grimorio</h4><p>Tu diario espiritual. Todo lo que recibís queda guardado para siempre.</p></div>
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
  const [canalizacionAbierta, setCanalizacionAbierta] = useState(null);

  const guardianes = usuario?.guardianes || [];
  const talismanes = usuario?.talismanes || [];
  const libros = usuario?.libros || [];
  const lecturas = usuario?.lecturas || [];
  const regalosHechos = usuario?.regalosHechos || [];
  const regalosRecibidos = usuario?.regalosRecibidos || [];

  // Buscar canalización para un guardián
  const getCanalizacion = (guardian) => {
    return lecturas.find(l => l.guardianId === guardian.id || l.ordenId === guardian.ordenId);
  };

  // Estado de canalización
  const getEstadoCana = (cana) => {
    if (!cana) return { texto: 'Pendiente', color: '#888', icono: '⏳' };
    if (cana.estado === 'enviada') return { texto: 'Lista', color: '#2ecc71', icono: '✓' };
    if (cana.estado === 'aprobada') return { texto: 'En camino', color: '#d4af37', icono: '✦' };
    return { texto: 'Procesando', color: '#3498db', icono: '◈' };
  };

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
            <div className="guardianes-lista-completa">
              {guardianes.map((g, i) => {
                const cana = getCanalizacion(g);
                const estado = getEstadoCana(cana);
                return (
                  <div key={i} className="guardian-card-full">
                    <div className="guardian-foto">
                      {g.imagen ? <img src={g.imagen} alt={g.nombre} /> : <span className="guardian-placeholder">◆</span>}
                    </div>
                    <div className="guardian-info">
                      <h3>{g.nombre}</h3>
                      <div className="guardian-meta">
                        <span className="guardian-tipo">{g.tipo || 'Guardián'}</span>
                        {g.categoria && <span className="guardian-cat">{g.categoria}</span>}
                      </div>
                      <p className="guardian-fecha">Adoptado: {g.fecha || 'Recientemente'}</p>
                      {g.paraQuien && <p className="guardian-para">Para: {g.paraQuien}</p>}
                    </div>
                    <div className="guardian-cana">
                      <div className="cana-estado" style={{color: estado.color}}>
                        <span>{estado.icono}</span>
                        <span>Canalización: {estado.texto}</span>
                      </div>
                      {cana && cana.estado === 'enviada' ? (
                        <button className="btn-ver-cana" onClick={() => setCanalizacionAbierta(cana)}>
                          Ver Canalización
                        </button>
                      ) : (
                        <p className="cana-info-text">Tu canalización personalizada está siendo preparada con amor (4-24hs)</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="empty-tab">
              <span>◆</span>
              <h3>Tus guardianes te esperan</h3>
              <p>Cuando adoptes tu primer guardián, aparecerá acá con toda su información, su historia y cómo cuidarlo.</p>
              <a href="https://duendesuy.10web.cloud/shop/" target="_blank" rel="noopener" className="btn-gold">Explorar Guardianes ↗</a>
            </div>
          )}

          {/* LOS ELEGIDOS - Narrativa Cinematográfica */}
          <div className="elegidos-cinematic">
            <div className="elegidos-titulo">
              <span className="titulo-pre">Ahora formás parte de</span>
              <h2>Los Elegidos</h2>
            </div>

            <div className="elegidos-portal">
              <div className="portal-glow"></div>
              <span className="portal-runa">ᛉ</span>
            </div>

            <div className="elegidos-story">
              <div className="story-scene scene-1">
                <p className="scene-visual">
                  Hay cosas que no se buscan.
                </p>
                <p>
                  Aparecen. Como esa persona que conocés en el momento exacto.
                  Como ese libro que cae de un estante y te cambia la vida.
                  Como un guardián que te mira desde una pantalla y algo
                  en vos dice <em>ahí está</em>.
                </p>
              </div>

              <div className="story-scene scene-2">
                <p className="scene-visual">
                  No sabemos cómo funciona.
                </p>
                <p>
                  Solo sabemos que pasa. Que hay personas que ven veinte,
                  treinta guardianes, y siguen de largo. Y hay otras que ven
                  uno solo y ya no pueden irse. Vuelven. Sueñan con él.
                  Le inventan nombre antes de saber el verdadero.
                </p>
              </div>

              <div className="story-reveal">
                <div className="reveal-line"></div>
                <p className="reveal-text">
                  A esas personas las llamamos<br/>
                  <em>Los Elegidos</em>
                </p>
                <div className="reveal-line"></div>
              </div>

              <div className="story-scene scene-3">
                <p>
                  No es un título. Es un reconocimiento. De algo que ya existía
                  antes de que supieras que existía. Un hilo invisible que
                  conecta al guardián con su humano — o al humano con su guardián,
                  según cómo lo mires.
                </p>
                <p>
                  Cada uno de ellos nace dos veces: cuando lo creamos con las manos,
                  y cuando alguien lo reconoce como suyo.
                </p>
              </div>

              <div className="story-scene scene-final">
                <p className="scene-revelation">
                  Si estás leyendo esto, el hilo ya se tensó.
                </p>
                <p className="scene-direct">
                  Ahora solo falta que tires.
                </p>
              </div>
            </div>

            <div className="elegidos-seal">
              <div className="seal-symbol">ᛉ</div>
              <div className="seal-text">
                <span className="seal-title">Registro de Los Elegidos</span>
                <span className="seal-name">{usuario?.nombrePreferido || 'Tu nombre'}</span>
                <span className="seal-date">Inscripta en {new Date(usuario?.creado || Date.now()).toLocaleDateString('es-UY', { month: 'long', year: 'numeric' })}</span>
              </div>
            </div>

            <div className="elegidos-explore">
              <p>Los guardianes siguen esperando.</p>
              <div className="explore-paths">
                <a href="https://duendesuy.10web.cloud/categoria-producto/proteccion/" className="path-link path-proteccion">
                  <div className="path-icon-anim">
                    <svg viewBox="0 0 40 40" className="icon-escudo">
                      <path d="M20 5 L35 12 L35 22 C35 30, 20 38, 20 38 C20 38, 5 30, 5 22 L5 12 Z" fill="none" stroke="#4A90D9" strokeWidth="2" className="escudo-base"/>
                      <path d="M20 10 L30 15 L30 22 C30 27, 20 33, 20 33 C20 33, 10 27, 10 22 L10 15 Z" fill="rgba(74,144,217,0.2)" className="escudo-inner"/>
                      <circle cx="20" cy="20" r="3" fill="#4A90D9" className="escudo-centro"/>
                    </svg>
                    <div className="floating-icons shields">
                      <span className="float-icon fi1">◇</span>
                      <span className="float-icon fi2">◇</span>
                      <span className="float-icon fi3">◇</span>
                    </div>
                  </div>
                  <span className="path-name">Protectores</span>
                  <span className="path-desc">Guardianes del escudo</span>
                </a>
                <a href="https://duendesuy.10web.cloud/categoria-producto/amor/" className="path-link path-amor">
                  <div className="path-icon-anim">
                    <svg viewBox="0 0 40 40" className="icon-corazon">
                      <path d="M20 35 C20 35, 5 25, 5 15 C5 8, 12 5, 20 12 C28 5, 35 8, 35 15 C35 25, 20 35, 20 35" fill="#E91E8C" className="corazon-base"/>
                      <path d="M20 30 C20 30, 10 23, 10 16 C10 12, 14 10, 20 15 C26 10, 30 12, 30 16 C30 23, 20 30, 20 30" fill="rgba(255,255,255,0.2)" className="corazon-inner"/>
                    </svg>
                    <div className="floating-icons hearts">
                      <span className="float-icon fi1">♥</span>
                      <span className="float-icon fi2">♥</span>
                      <span className="float-icon fi3">♥</span>
                    </div>
                  </div>
                  <span className="path-name">Sanadores del Corazón</span>
                  <span className="path-desc">Guardianes del vínculo</span>
                </a>
                <a href="https://duendesuy.10web.cloud/categoria-producto/dinero-abundancia-negocios/" className="path-link path-abundancia">
                  <div className="path-icon-anim">
                    <svg viewBox="0 0 40 40" className="icon-moneda">
                      <circle cx="20" cy="20" r="15" fill="#C6A962" className="moneda-base"/>
                      <circle cx="20" cy="20" r="12" fill="none" stroke="#b8962e" strokeWidth="1" className="moneda-borde"/>
                      <text x="20" y="25" textAnchor="middle" fill="#8B7355" fontSize="14" fontFamily="serif" fontWeight="bold">$</text>
                    </svg>
                    <div className="floating-icons coins">
                      <span className="float-icon fi1">✦</span>
                      <span className="float-icon fi2">✦</span>
                      <span className="float-icon fi3">✦</span>
                    </div>
                  </div>
                  <span className="path-name">Portadores de Oro</span>
                  <span className="path-desc">Guardianes del flujo</span>
                </a>
                <a href="https://duendesuy.10web.cloud/categoria-producto/salud/" className="path-link path-sanacion">
                  <div className="path-icon-anim">
                    <svg viewBox="0 0 40 40" className="icon-vida">
                      <circle cx="20" cy="20" r="15" fill="none" stroke="#2ECC71" strokeWidth="2" className="vida-circulo"/>
                      <path d="M20 8 Q25 15, 20 25 Q15 15, 20 8" fill="#2ECC71" className="vida-hoja1"/>
                      <path d="M12 18 Q18 20, 20 20 Q18 22, 12 22" fill="#27ae60" className="vida-hoja2"/>
                      <path d="M28 18 Q22 20, 20 20 Q22 22, 28 22" fill="#27ae60" className="vida-hoja3"/>
                    </svg>
                    <div className="floating-icons leaves">
                      <span className="float-icon fi1">❋</span>
                      <span className="float-icon fi2">❋</span>
                      <span className="float-icon fi3">❋</span>
                    </div>
                  </div>
                  <span className="path-name">Tejedores de Vida</span>
                  <span className="path-desc">Guardianes del cuerpo</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Canalización */}
      {canalizacionAbierta && (
        <div className="modal-cana-overlay" onClick={() => setCanalizacionAbierta(null)}>
          <div className="modal-cana" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setCanalizacionAbierta(null)}>×</button>
            <div className="modal-cana-header">
              <span>✦</span>
              <h2>Canalización de {canalizacionAbierta.guardianNombre || 'tu Guardián'}</h2>
              {canalizacionAbierta.paraQuien && <p>Para: {canalizacionAbierta.paraQuien}</p>}
            </div>
            <div className="modal-cana-content">
              {canalizacionAbierta.contenido?.split('\n').map((parrafo, i) => (
                parrafo.trim() && <p key={i}>{limpiarTexto(parrafo)}</p>
              ))}
            </div>
            <div className="modal-cana-footer">
              <small>Esta canalización fue creada especialmente para ti ✦</small>
            </div>
          </div>
        </div>
      )}
      
      {tab === 'talismanes' && (
        <div className="cana-content">
          {talismanes.length > 0 ? (
            <div className="items-grid">{talismanes.map((t,i) => <div key={i} className="item-card"><h4>{t.nombre}</h4><small>{t.fecha}</small></div>)}</div>
          ) : (
            <div className="seccion-cinematica seccion-talismanes">
              <div className="seccion-simbolo">
                <div className="anim-varita">
                  <svg viewBox="0 0 80 80" className="varita-svg">
                    <defs>
                      <linearGradient id="varitaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#d4af37"/>
                        <stop offset="50%" stopColor="#9b59b6"/>
                        <stop offset="100%" stopColor="#d4af37"/>
                      </linearGradient>
                    </defs>
                    <line x1="20" y1="60" x2="60" y2="20" stroke="url(#varitaGrad)" strokeWidth="3" strokeLinecap="round" className="varita-line"/>
                    <circle cx="60" cy="20" r="4" fill="#d4af37" className="varita-punta"/>
                    <g className="varita-sparkles">
                      <circle cx="65" cy="15" r="2" fill="#fff" className="sparkle s1"/>
                      <circle cx="70" cy="22" r="1.5" fill="#9b59b6" className="sparkle s2"/>
                      <circle cx="58" cy="10" r="1.5" fill="#d4af37" className="sparkle s3"/>
                      <circle cx="72" cy="12" r="1" fill="#fff" className="sparkle s4"/>
                    </g>
                  </svg>
                </div>
              </div>

              <div className="seccion-narrativa">
                <div className="story-scene scene-1">
                  <p className="scene-visual">
                    Un guardián protege. Un talismán amplifica.
                  </p>
                  <p>
                    Lo vas a sentir cuando lo veas. Un tirón en el pecho.
                    Una certeza que no tiene explicación. Vas a cerrar la página
                    y seguir con tu día — pero va a seguir ahí, en tu cabeza.
                  </p>
                </div>

                <div className="story-scene scene-2">
                  <p>
                    Vas a soñar con él. Te vas a despertar pensando en él.
                    Vas a volver a mirarlo "solo para ver" y cada vez va a costar
                    más cerrar la página.
                  </p>
                  <p>
                    Eso es el llamado. Y las personas especiales lo sienten.
                  </p>
                </div>

                <div className="story-reveal">
                  <div className="reveal-line"></div>
                  <p className="reveal-text">
                    Tu colección de talismanes<br/>
                    <em>empieza cuando vos decidas</em>
                  </p>
                  <div className="reveal-line"></div>
                </div>

                <div className="story-scene scene-final">
                  <p className="scene-direct">
                    Algunos los tienen todos. Otros empiezan con uno y no pueden parar.
                  </p>
                </div>
              </div>

              <a href="https://duendesuy.10web.cloud/categoria-producto/talismanes/" className="seccion-cta">
                <span>Ver los talismanes</span>
                <span className="cta-arrow">→</span>
              </a>
            </div>
          )}
        </div>
      )}
      
      {tab === 'libros' && (
        <div className="cana-content">
          {libros.length > 0 ? (
            <div className="items-grid">{libros.map((l,i) => <div key={i} className="item-card"><h4>{l.nombre}</h4><small>{l.fecha}</small></div>)}</div>
          ) : (
            <div className="seccion-cinematica seccion-libros">
              <div className="seccion-simbolo">
                <div className="anim-libro">
                  <svg viewBox="0 0 80 80" className="libro-svg">
                    <defs>
                      <linearGradient id="libroGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#8B4513"/>
                        <stop offset="50%" stopColor="#D2691E"/>
                        <stop offset="100%" stopColor="#8B4513"/>
                      </linearGradient>
                    </defs>
                    <rect x="15" y="20" width="50" height="40" rx="2" fill="url(#libroGrad)" className="libro-tapa"/>
                    <rect x="18" y="23" width="44" height="34" fill="#FFF8DC" className="libro-paginas"/>
                    <line x1="40" y1="23" x2="40" y2="57" stroke="#D2B48C" strokeWidth="1" className="libro-lomo"/>
                    <g className="libro-lineas">
                      <line x1="22" y1="30" x2="36" y2="30" stroke="#8B4513" strokeWidth="0.5" opacity="0.5"/>
                      <line x1="22" y1="35" x2="34" y2="35" stroke="#8B4513" strokeWidth="0.5" opacity="0.5"/>
                      <line x1="22" y1="40" x2="36" y2="40" stroke="#8B4513" strokeWidth="0.5" opacity="0.5"/>
                      <line x1="44" y1="30" x2="58" y2="30" stroke="#8B4513" strokeWidth="0.5" opacity="0.5"/>
                      <line x1="44" y1="35" x2="56" y2="35" stroke="#8B4513" strokeWidth="0.5" opacity="0.5"/>
                      <line x1="44" y1="40" x2="58" y2="40" stroke="#8B4513" strokeWidth="0.5" opacity="0.5"/>
                    </g>
                    <g className="libro-glow">
                      <circle cx="40" cy="40" r="3" fill="#e67e22" className="glow-center"/>
                      <circle cx="35" cy="48" r="1.5" fill="#d4af37" className="glow-p1"/>
                      <circle cx="45" cy="48" r="1.5" fill="#d4af37" className="glow-p2"/>
                    </g>
                  </svg>
                </div>
              </div>

              <div className="seccion-narrativa">
                <div className="story-scene scene-1">
                  <p className="scene-visual">
                    Hay cosas que no se enseñan. Se transmiten.
                  </p>
                  <p>
                    Durante años guardamos el conocimiento en cuadernos,
                    servilletas, audios de WhatsApp a las 3 de la mañana.
                    Fragmentos de algo más grande que todavía no tenía forma.
                  </p>
                </div>

                <div className="story-scene scene-2">
                  <p>
                    Ahora lo estamos ordenando. Rituales que funcionan.
                    Formas de conectar que no vas a encontrar en Google.
                    Lo que aprendimos en años de trabajar con guardianes
                    — y lo que ellos nos enseñaron a nosotros.
                  </p>
                </div>

                <div className="story-reveal">
                  <div className="reveal-line"></div>
                  <p className="reveal-text">
                    La biblioteca está en construcción.<br/>
                    <em>Algunas cosas llevan tiempo.</em>
                  </p>
                  <div className="reveal-line"></div>
                </div>

                <div className="story-scene scene-final">
                  <p className="scene-direct">
                    Cuando esté lista, vas a ser de las primeras en saberlo.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
      
      {tab === 'lecturas' && (
        <div className="cana-content">
          {lecturas.length > 0 ? (
            <div className="lecturas-list">{lecturas.map((l,i) => <div key={i} className="lectura-item"><span className="lec-fecha">{l.fecha}</span><h4>{l.tipo}</h4><p>{l.resumen || l.contenido?.substring(0, 200)}...</p><button className="btn-sec">Ver completa</button></div>)}</div>
          ) : (
            <div className="seccion-cinematica seccion-lecturas">
              <div className="seccion-simbolo">
                <div className="anim-cartas">
                  <svg viewBox="0 0 80 80" className="cartas-svg">
                    <defs>
                      <linearGradient id="cartaGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#1a1a2e"/>
                        <stop offset="100%" stopColor="#16213e"/>
                      </linearGradient>
                      <linearGradient id="cartaGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#0f3460"/>
                        <stop offset="100%" stopColor="#16213e"/>
                      </linearGradient>
                    </defs>
                    <g className="carta carta-3" transform="rotate(15, 40, 45)">
                      <rect x="25" y="15" width="30" height="45" rx="3" fill="url(#cartaGrad1)" stroke="#3498db" strokeWidth="0.5"/>
                      <circle cx="40" cy="37" r="8" fill="none" stroke="#3498db" strokeWidth="0.5" opacity="0.5"/>
                    </g>
                    <g className="carta carta-2" transform="rotate(-10, 40, 45)">
                      <rect x="25" y="15" width="30" height="45" rx="3" fill="url(#cartaGrad2)" stroke="#9b59b6" strokeWidth="0.5"/>
                      <polygon points="40,25 44,35 40,32 36,35" fill="#9b59b6" opacity="0.6"/>
                    </g>
                    <g className="carta carta-1">
                      <rect x="25" y="15" width="30" height="45" rx="3" fill="#1a1a2e" stroke="#d4af37" strokeWidth="1"/>
                      <circle cx="40" cy="37" r="6" fill="none" stroke="#d4af37" strokeWidth="1"/>
                      <circle cx="40" cy="37" r="2" fill="#d4af37" className="carta-centro"/>
                    </g>
                    <g className="cartas-estrellas">
                      <circle cx="30" cy="12" r="1" fill="#fff" className="estrella e1"/>
                      <circle cx="50" cy="10" r="1.5" fill="#d4af37" className="estrella e2"/>
                      <circle cx="60" cy="20" r="1" fill="#3498db" className="estrella e3"/>
                    </g>
                  </svg>
                </div>
              </div>

              <div className="seccion-narrativa">
                <div className="story-scene scene-1">
                  <p className="scene-visual">
                    A veces necesitás que alguien te diga lo que ya sabés.
                  </p>
                  <p>
                    No porque no lo sepas. Sino porque escucharlo de afuera
                    lo vuelve real. Le da permiso de existir.
                  </p>
                </div>

                <div className="story-scene scene-2">
                  <p>
                    Las lecturas no predicen el futuro — revelan el presente.
                    Eso que sentís pero no nombrás. Eso que intuís pero dudás.
                    Eso que necesitás escuchar para finalmente actuar.
                  </p>
                </div>

                <div className="story-reveal">
                  <div className="reveal-line"></div>
                  <p className="reveal-text">
                    Tu archivo está vacío.<br/>
                    <em>Cada lectura que hagas quedará guardada acá.</em>
                  </p>
                  <div className="reveal-line"></div>
                </div>

                <div className="story-scene scene-final">
                  <p className="scene-direct">
                    Para volver a leerla cuando la necesites. Porque siempre se necesita.
                  </p>
                </div>
              </div>

              <a href="https://duendesuy.10web.cloud/categoria-producto/lecturas/" className="seccion-cta">
                <span>Pedir una lectura</span>
                <span className="cta-arrow">→</span>
              </a>
            </div>
          )}
        </div>
      )}
      
      {tab === 'regalosH' && (
        <div className="cana-content">
          {regalosHechos.length > 0 ? (
            <div className="items-grid">{regalosHechos.map((r,i) => <div key={i} className="item-card"><h4>{r.tipo}</h4><small>Para: {r.para} • {r.fecha}</small></div>)}</div>
          ) : (
            <div className="seccion-cinematica seccion-regalos-h">
              <div className="seccion-simbolo">
                <div className="anim-regalo">
                  <svg viewBox="0 0 80 80" className="regalo-svg">
                    <defs>
                      <linearGradient id="regaloGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#e91e63"/>
                        <stop offset="100%" stopColor="#c2185b"/>
                      </linearGradient>
                    </defs>
                    <rect x="20" y="35" width="40" height="30" rx="3" fill="url(#regaloGrad)" className="regalo-caja"/>
                    <rect x="20" y="30" width="40" height="8" rx="2" fill="#ad1457" className="regalo-tapa"/>
                    <rect x="37" y="30" width="6" height="35" fill="#d4af37" className="regalo-cinta-v"/>
                    <rect x="20" y="32" width="40" height="4" fill="#d4af37" className="regalo-cinta-h"/>
                    <g className="regalo-lazo">
                      <ellipse cx="33" cy="26" rx="6" ry="8" fill="#d4af37" transform="rotate(-30, 33, 26)"/>
                      <ellipse cx="47" cy="26" rx="6" ry="8" fill="#d4af37" transform="rotate(30, 47, 26)"/>
                      <circle cx="40" cy="28" r="4" fill="#b8962e"/>
                    </g>
                    <g className="regalo-hearts">
                      <path d="M15 20 C15 15, 20 15, 20 18 C20 15, 25 15, 25 20 C25 25, 20 28, 20 28 C20 28, 15 25, 15 20" fill="#ff6b9d" className="mini-heart h1"/>
                      <path d="M55 15 C55 12, 58 12, 58 14 C58 12, 61 12, 61 15 C61 18, 58 20, 58 20 C58 20, 55 18, 55 15" fill="#ff6b9d" className="mini-heart h2"/>
                      <path d="M62 35 C62 32, 65 32, 65 34 C65 32, 68 32, 68 35 C68 38, 65 40, 65 40 C65 40, 62 38, 62 35" fill="#ff6b9d" className="mini-heart h3"/>
                    </g>
                  </svg>
                </div>
              </div>

              <div className="seccion-narrativa">
                <div className="story-scene scene-1">
                  <p className="scene-visual">
                    Regalar magia es regalar una decisión.
                  </p>
                  <p>
                    Un guardián, una lectura, un talismán, una runa. No importa qué.
                    Es decirle a alguien: <em>"Vi esto y pensé en vos.
                    En lo que necesitás. En lo que merecés."</em>
                  </p>
                </div>

                <div className="story-scene scene-2">
                  <p>
                    Hay regalos que se usan y se olvidan. Y hay regalos que
                    se quedan para siempre, recordándole a esa persona
                    que alguien la vio. Que alguien pensó en ella.
                  </p>
                </div>

                <div className="story-reveal">
                  <div className="reveal-line"></div>
                  <p className="reveal-text">
                    Todavía no regalaste nada.<br/>
                    <em>Pero ya sabés a quién se lo darías.</em>
                  </p>
                  <div className="reveal-line"></div>
                </div>

                <div className="story-scene scene-final">
                  <p className="scene-direct">
                    Cada regalo que hagas queda registrado acá. Tu rastro de magia compartida.
                  </p>
                </div>
              </div>

              <a href="https://duendesuy.10web.cloud/tienda/" className="seccion-cta">
                <span>Elegir un regalo</span>
                <span className="cta-arrow">→</span>
              </a>
            </div>
          )}
        </div>
      )}
      
      {tab === 'regalosR' && (
        <div className="cana-content">
          {regalosRecibidos.length > 0 ? (
            <div className="items-grid">{regalosRecibidos.map((r,i) => <div key={i} className="item-card"><h4>{r.tipo}</h4><small>De: {r.de} • {r.fecha}</small></div>)}</div>
          ) : (
            <div className="seccion-cinematica seccion-regalos-r">
              <div className="seccion-simbolo">
                <div className="anim-recibir">
                  <svg viewBox="0 0 80 80" className="recibir-svg">
                    <defs>
                      <linearGradient id="recibirGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#2ecc71"/>
                        <stop offset="100%" stopColor="#27ae60"/>
                      </linearGradient>
                    </defs>
                    <g className="manos">
                      <path d="M20 55 Q25 45, 35 50 L35 60 Q25 65, 20 55" fill="#deb887" className="mano-izq"/>
                      <path d="M60 55 Q55 45, 45 50 L45 60 Q55 65, 60 55" fill="#deb887" className="mano-der"/>
                    </g>
                    <circle cx="40" cy="40" r="15" fill="url(#recibirGrad)" className="esfera-regalo"/>
                    <circle cx="40" cy="40" r="10" fill="none" stroke="#fff" strokeWidth="0.5" opacity="0.5"/>
                    <circle cx="40" cy="40" r="5" fill="#fff" opacity="0.3"/>
                    <g className="recibir-sparkles">
                      <polygon points="40,15 42,20 47,20 43,24 45,29 40,26 35,29 37,24 33,20 38,20" fill="#d4af37" className="star-main"/>
                      <circle cx="25" cy="30" r="2" fill="#2ecc71" className="spark s1"/>
                      <circle cx="55" cy="30" r="2" fill="#2ecc71" className="spark s2"/>
                      <circle cx="30" cy="20" r="1.5" fill="#fff" className="spark s3"/>
                      <circle cx="50" cy="22" r="1.5" fill="#fff" className="spark s4"/>
                      <circle cx="20" cy="40" r="1" fill="#d4af37" className="spark s5"/>
                      <circle cx="60" cy="38" r="1" fill="#d4af37" className="spark s6"/>
                    </g>
                  </svg>
                </div>
              </div>

              <div className="seccion-narrativa">
                <div className="story-scene scene-1">
                  <p className="scene-visual">
                    Recibir es más difícil que dar.
                  </p>
                  <p>
                    Requiere aceptar que alguien pensó en vos. Que dedicó tiempo
                    a elegir algo que te represente. Que se animó a decirte,
                    sin palabras: <em>"Te veo. Me importás."</em>
                  </p>
                </div>

                <div className="story-scene scene-2">
                  <p>
                    Cuando alguien te regala algo de acá — un guardián, una lectura,
                    un talismán — está regalándote una pieza de su mundo interior.
                    Algo que eligió para vos.
                  </p>
                </div>

                <div className="story-reveal">
                  <div className="reveal-line"></div>
                  <p className="reveal-text">
                    Nadie te regaló nada todavía.<br/>
                    <em>¿Ya compartiste tu lista de deseos?</em>
                  </p>
                  <div className="reveal-line"></div>
                </div>

                <div className="story-scene scene-final">
                  <p className="scene-direct">
                    A veces solo hace falta que alguien sepa qué deseás.
                  </p>
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
// PROMOCIONES MÁGICAS
// ═══════════════════════════════════════════════════════════════

function PromocionesMagicas({ usuario, ir }) {
  const [promociones, setPromociones] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    cargarPromociones();
  }, []);

  const cargarPromociones = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/mi-magia/promociones`);
      const data = await res.json();
      if (data.success) {
        setPromociones(data.promociones || []);
      }
    } catch(e) {
      console.error('Error cargando promociones:', e);
    }
    setCargando(false);
  };

  // Promociones predefinidas si no hay en la API
  const promosPredefinidas = [
    {
      id: 'circulo-prueba',
      titulo: 'Círculo de Duendes',
      subtitulo: '15 días GRATIS',
      descripcion: 'Tu santuario secreto con beneficios exclusivos: contenido semanal, descuentos permanentes, comunidad privada y lecturas mensuales.',
      beneficios: ['Contenido semanal exclusivo', 'Descuentos permanentes del 15%', 'Lecturas mensuales personalizadas', 'Comunidad privada'],
      icono: '★',
      color: '#d4af37',
      activa: !usuario?.esCirculo,
      accion: () => ir('circulo'),
      textoBoton: 'Probar gratis 15 días'
    },
    {
      id: 'runas-especial',
      titulo: 'Pack de Runas Resplandor',
      subtitulo: '100 runas = mejor valor',
      descripcion: 'El pack más popular. 100 runas para múltiples experiencias mágicas: tiradas, oráculos, lecturas del alma y más.',
      beneficios: ['100 runas de poder', 'El mejor precio por runa', 'Para 5-20 experiencias', 'No vencen nunca'],
      icono: 'ᚱ',
      color: '#7B1FA2',
      activa: true,
      url: 'https://duendesuy.10web.cloud/producto/runas-resplandor/',
      textoBoton: 'Obtener $32 USD'
    }
  ];

  const promosActivas = promociones.length > 0 ? promociones : promosPredefinidas.filter(p => p.activa);

  return (
    <div className="sec">
      <div className="sec-head">
        <h1>Promociones Mágicas</h1>
        <p>Ofertas especiales y oportunidades exclusivas para ti.</p>
      </div>

      {cargando ? (
        <div style={{textAlign:'center', padding:'3rem'}}>
          <div style={{fontSize:'2rem', animation:'pulse 1.5s infinite'}}>✦</div>
          <p>Cargando promociones...</p>
        </div>
      ) : promosActivas.length > 0 ? (
        <div className="promos-grid">
          {promosActivas.map(promo => (
            <div key={promo.id} className="promo-card" style={{'--promo-color': promo.color || '#d4af37'}}>
              <div className="promo-header">
                <span className="promo-icono">{promo.icono}</span>
                <div className="promo-badge-card">{promo.subtitulo}</div>
              </div>
              <h3>{promo.titulo}</h3>
              <p className="promo-desc">{promo.descripcion}</p>

              {promo.beneficios && (
                <ul className="promo-beneficios-list">
                  {promo.beneficios.map((b, i) => (
                    <li key={i}>✓ {b}</li>
                  ))}
                </ul>
              )}

              {promo.url ? (
                <a href={promo.url} target="_blank" rel="noopener" className="btn-promo">
                  {promo.textoBoton || 'Obtener'}
                </a>
              ) : promo.accion ? (
                <button onClick={promo.accion} className="btn-promo">
                  {promo.textoBoton || 'Ver más'}
                </button>
              ) : null}
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-promos">
          <span>🎁</span>
          <h3>Sin promociones activas ahora</h3>
          <p>Volvé pronto para ver las nuevas ofertas mágicas que preparamos para vos.</p>
        </div>
      )}

      {/* Info adicional */}
      <div className="promo-info-box">
        <h4>¿Cómo funcionan las promociones?</h4>
        <p>Las promociones mágicas son ofertas especiales y temporales que preparamos para vos. Pueden incluir descuentos, beneficios exclusivos, o acceso a servicios especiales. ¡Revisá esta sección seguido!</p>
      </div>
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
      <div className="sec-head">
        <h1>Cristales y Gemas</h1>
        <p>Aliados poderosos para tu camino espiritual. Cada piedra tiene su energía única.</p>
      </div>
      <div className="cristales-grid">
        {CRISTALES.map((c,i) => (
          <div key={i} className="cristal-card">
            <div className="cristal-img-container" style={{ position: 'relative', overflow: 'hidden', borderRadius: '12px 12px 0 0' }}>
              <img
                src={c.imagen}
                alt={c.nombre}
                style={{
                  width: '100%',
                  height: '180px',
                  objectFit: 'cover',
                  display: 'block'
                }}
              />
              <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
                padding: '2rem 1rem 0.8rem',
                textAlign: 'center'
              }}>
                <span style={{
                  fontFamily: 'Cinzel, serif',
                  fontSize: '1.1rem',
                  color: '#fff',
                  fontWeight: 500,
                  textShadow: '0 2px 4px rgba(0,0,0,0.5)'
                }}>{c.nombre}</span>
              </div>
            </div>
            <div className="cristal-body">
              <p className="cristal-props">{c.props}</p>
              <small className="cristal-cuidado">🌿 {c.cuidado}</small>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// CÍRCULO DE DUENDES - Dashboard con tema oscuro y neón
// ═══════════════════════════════════════════════════════════════

// Colores neón para el Círculo
const COLORES_NEON = {
  magenta: '#ff006e',
  celeste: '#00d4ff',
  verdeMosgo: '#00ff88',
  dorado: '#ffd700',
  violeta: '#bf00ff'
};

// Portales estacionales
const PORTALES_CIRCULO = {
  yule: { nombre: 'Yule', meses: [5, 6, 7], color: COLORES_NEON.celeste, icono: '❄️' },
  ostara: { nombre: 'Ostara', meses: [8, 9, 10], color: COLORES_NEON.verdeMosgo, icono: '🌱' },
  litha: { nombre: 'Litha', meses: [11, 0, 1], color: COLORES_NEON.dorado, icono: '☀️' },
  mabon: { nombre: 'Mabon', meses: [2, 3, 4], color: COLORES_NEON.magenta, icono: '🍂' }
};

// Colores por elemento del duende
const COLORES_ELEMENTO = {
  fuego: COLORES_NEON.magenta,
  agua: COLORES_NEON.celeste,
  tierra: COLORES_NEON.verdeMosgo,
  aire: COLORES_NEON.dorado,
  espiritu: COLORES_NEON.violeta
};

function CirculoSec({ usuario, setUsuario, token, pais }) {
  const [tab, setTab] = useState('inicio'); // inicio, luna, contenido, comunidad, rituales
  const [consejo, setConsejo] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [onboardingCompletado, setOnboardingCompletado] = useState(null);
  const [pasoOnboarding, setPasoOnboarding] = useState(1);
  const [guardandoOnboarding, setGuardandoOnboarding] = useState(false);
  const [datosOnboarding, setDatosOnboarding] = useState({
    nombrePreferido: usuario?.nombre || '',
    pronombres: '',
    fechaNacimiento: '',
    comoLlegaste: '',
    guardiansAdoptados: '',
    areasInteres: [],
    practicaEspiritual: '',
    coleccionCristales: '',
    cursosAnteriores: '',
    tipoContenido: [],
    objetivoPrincipal: ''
  });
  const esUY = pais === 'UY';

  // Obtener portal actual
  const mesActual = new Date().getMonth();
  const portalActual = Object.entries(PORTALES_CIRCULO).find(([_, p]) => p.meses.includes(mesActual))?.[1] || PORTALES_CIRCULO.litha;

  // Verificar onboarding al montar
  useEffect(() => {
    if (usuario?.esCirculo && usuario?.email) {
      verificarOnboarding();
      cargarConsejo();
    }
  }, [usuario?.esCirculo, usuario?.email]);

  const verificarOnboarding = async () => {
    try {
      const res = await fetch(`/api/circulo/perfil?email=${encodeURIComponent(usuario.email)}`);
      const data = await res.json();
      setOnboardingCompletado(data.existe && data.perfil?.onboardingCompletado);
    } catch(e) {
      setOnboardingCompletado(true);
    }
  };

  const cargarConsejo = async () => {
    setCargando(true);
    try {
      const nombre = usuario?.nombrePreferido || usuario?.nombre || 'viajero';
      const res = await fetch(`/api/circulo/consejo-del-dia?nombre=${encodeURIComponent(nombre)}&email=${encodeURIComponent(usuario.email || '')}`);
      const data = await res.json();
      if (data.success) {
        setConsejo(data);
      }
    } catch(e) {
      console.error('Error cargando consejo:', e);
    }
    setCargando(false);
  };

  const guardarOnboarding = async () => {
    setGuardandoOnboarding(true);
    try {
      const res = await fetch('/api/circulo/perfil', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: usuario.email,
          perfil: { ...datosOnboarding, onboardingCompletado: true, fechaOnboarding: new Date().toISOString() }
        })
      });
      const data = await res.json();
      if (data.success) {
        setOnboardingCompletado(true);
        if (datosOnboarding.nombrePreferido) {
          setUsuario({ ...usuario, nombrePreferido: datosOnboarding.nombrePreferido });
        }
      }
    } catch(e) {}
    setGuardandoOnboarding(false);
  };

  const handleOnboardingChange = (campo, valor) => setDatosOnboarding(prev => ({ ...prev, [campo]: valor }));
  const toggleOnboardingArray = (campo, item) => {
    setDatosOnboarding(prev => {
      const arr = prev[campo] || [];
      return { ...prev, [campo]: arr.includes(item) ? arr.filter(i => i !== item) : [...arr, item] };
    });
  };

  // Color del duende actual
  const colorDuende = consejo?.guardian?.elemento ? COLORES_ELEMENTO[consejo.guardian.elemento.toLowerCase()] || COLORES_NEON.dorado : portalActual.color;

  // ═══════════════════════════════════════════════════════════════
  // SI ES MIEMBRO DEL CÍRCULO
  // ═══════════════════════════════════════════════════════════════

  if (usuario?.esCirculo) {
    // Cargando onboarding
    if (onboardingCompletado === null) {
      return (
        <div className="circulo-dark-loading">
          <span className="circulo-star">★</span>
          <p>Preparando tu espacio en el Círculo...</p>
          <style jsx>{`
            .circulo-dark-loading { background: #0a0a0a; min-height: 400px; display: flex; flex-direction: column; align-items: center; justify-content: center; border-radius: 16px; color: #fff; font-family: 'Cinzel', serif; }
            .circulo-star { font-size: 3rem; color: ${portalActual.color}; animation: pulse 2s infinite; }
            @keyframes pulse { 0%, 100% { opacity: 0.5; transform: scale(1); } 50% { opacity: 1; transform: scale(1.1); } }
          `}</style>
        </div>
      );
    }

    // ONBOARDING (si no completado)
    if (!onboardingCompletado) {
      return (
        <div className="circulo-dark-onboarding">
          <div className="onb-header">
            <span style={{color: portalActual.color}}>★</span>
            <h1>Bienvenid{datosOnboarding.pronombres === 'el' ? 'o' : 'a'} al Círculo</h1>
            <p>Queremos conocerte para personalizar tu experiencia</p>
          </div>
          <div className="onb-pasos">
            {[1,2,3,4].map(n => (
              <div key={n} className={`onb-paso ${pasoOnboarding >= n ? 'activo' : ''} ${pasoOnboarding === n ? 'actual' : ''}`} style={pasoOnboarding === n ? {borderColor: portalActual.color, color: portalActual.color} : {}}>{n}</div>
            ))}
          </div>

          {pasoOnboarding === 1 && (
            <div className="onb-content">
              <div className="onb-campo"><label>¿Cómo te gustaría que te llamemos?</label><input type="text" value={datosOnboarding.nombrePreferido} onChange={e => handleOnboardingChange('nombrePreferido', e.target.value)} placeholder="Tu nombre" /></div>
              <div className="onb-campo"><label>Pronombres</label><div className="onb-opciones">{[['ella','Ella'],['el','Él'],['elle','Elle'],['no-decir','Prefiero no decir']].map(([v,t]) => (<button key={v} onClick={() => handleOnboardingChange('pronombres', v)} className={datosOnboarding.pronombres === v ? 'sel' : ''} style={datosOnboarding.pronombres === v ? {background: portalActual.color, borderColor: portalActual.color} : {}}>{t}</button>))}</div></div>
              <div className="onb-campo"><label>Fecha de nacimiento</label><input type="date" value={datosOnboarding.fechaNacimiento} onChange={e => handleOnboardingChange('fechaNacimiento', e.target.value)} /><small>Para calcular tu signo y número de vida</small></div>
              <button className="onb-btn" onClick={() => setPasoOnboarding(2)} disabled={!datosOnboarding.nombrePreferido} style={{background: datosOnboarding.nombrePreferido ? portalActual.color : '#333'}}>Siguiente</button>
            </div>
          )}

          {pasoOnboarding === 2 && (
            <div className="onb-content">
              <div className="onb-campo"><label>¿Cómo llegaste a Duendes del Uruguay?</label><div className="onb-opciones-v">{[['instagram','Por Instagram'],['recomendacion','Me lo recomendó alguien'],['busqueda','Buscando cristales/guardianes'],['feria','En una feria'],['otro','Otra forma']].map(([v,t]) => (<button key={v} onClick={() => handleOnboardingChange('comoLlegaste', v)} className={datosOnboarding.comoLlegaste === v ? 'sel' : ''}>{t}</button>))}</div></div>
              <div className="onb-campo"><label>¿Cuántos guardianes tenés?</label><div className="onb-opciones">{[['0','Ninguno'],['1-3','1 a 3'],['4-10','4 a 10'],['mas-10','Más de 10']].map(([v,t]) => (<button key={v} onClick={() => handleOnboardingChange('guardiansAdoptados', v)} className={datosOnboarding.guardiansAdoptados === v ? 'sel' : ''} style={datosOnboarding.guardiansAdoptados === v ? {background: portalActual.color, borderColor: portalActual.color} : {}}>{t}</button>))}</div></div>
              <div className="onb-nav"><button className="onb-btn-sec" onClick={() => setPasoOnboarding(1)}>Anterior</button><button className="onb-btn" onClick={() => setPasoOnboarding(3)} style={{background: portalActual.color}}>Siguiente</button></div>
            </div>
          )}

          {pasoOnboarding === 3 && (
            <div className="onb-content">
              <div className="onb-campo"><label>¿Qué áreas te interesan? (varias)</label><div className="onb-grid">{[['abundancia','Abundancia'],['proteccion','Protección'],['amor','Amor'],['sanacion','Sanación'],['intuicion','Intuición'],['naturaleza','Naturaleza']].map(([v,t]) => (<button key={v} onClick={() => toggleOnboardingArray('areasInteres', v)} className={datosOnboarding.areasInteres.includes(v) ? 'sel' : ''} style={datosOnboarding.areasInteres.includes(v) ? {borderColor: portalActual.color, color: portalActual.color} : {}}>{t}</button>))}</div></div>
              <div className="onb-campo"><label>Frecuencia de práctica espiritual</label><div className="onb-opciones-v">{[['nunca','Recién empiezo'],['ocasional','De vez en cuando'],['regular','Semanalmente'],['diario','Todos los días']].map(([v,t]) => (<button key={v} onClick={() => handleOnboardingChange('practicaEspiritual', v)} className={datosOnboarding.practicaEspiritual === v ? 'sel' : ''}>{t}</button>))}</div></div>
              <div className="onb-nav"><button className="onb-btn-sec" onClick={() => setPasoOnboarding(2)}>Anterior</button><button className="onb-btn" onClick={() => setPasoOnboarding(4)} style={{background: portalActual.color}}>Siguiente</button></div>
            </div>
          )}

          {pasoOnboarding === 4 && (
            <div className="onb-content">
              <div className="onb-campo"><label>¿Hiciste cursos espirituales antes?</label><div className="onb-opciones-v">{[['no','No, primera vez'],['gratis','Solo gratuitos'],['pagos','Cursos pagos'],['presencial','Presenciales'],['varios','Varios tipos']].map(([v,t]) => (<button key={v} onClick={() => handleOnboardingChange('cursosAnteriores', v)} className={datosOnboarding.cursosAnteriores === v ? 'sel' : ''}>{t}</button>))}</div></div>
              <div className="onb-campo"><label>Tipo de contenido preferido (varias)</label><div className="onb-opciones">{[['lecturas','Lecturas'],['audios','Audios'],['videos','Videos'],['rituales','Rituales'],['lives','Lives']].map(([v,t]) => (<button key={v} onClick={() => toggleOnboardingArray('tipoContenido', v)} className={datosOnboarding.tipoContenido.includes(v) ? 'sel' : ''} style={datosOnboarding.tipoContenido.includes(v) ? {borderColor: portalActual.color, color: portalActual.color} : {}}>{t}</button>))}</div></div>
              <div className="onb-campo"><label>¿Qué buscás en el Círculo?</label><textarea value={datosOnboarding.objetivoPrincipal} onChange={e => handleOnboardingChange('objetivoPrincipal', e.target.value)} placeholder="Contanos..." rows={3} /></div>
              <div className="onb-nav"><button className="onb-btn-sec" onClick={() => setPasoOnboarding(3)}>Anterior</button><button className="onb-btn onb-btn-final" onClick={guardarOnboarding} disabled={guardandoOnboarding} style={{background: portalActual.color}}>{guardandoOnboarding ? 'Guardando...' : 'Entrar al Círculo'}</button></div>
            </div>
          )}

          <style jsx>{`
            .circulo-dark-onboarding { background: #0a0a0a; border-radius: 16px; padding: 2rem; color: #fff; font-family: 'Cormorant Garamond', serif; }
            .onb-header { text-align: center; margin-bottom: 2rem; }
            .onb-header span { font-size: 2.5rem; }
            .onb-header h1 { font-family: 'Tangerine', cursive; font-size: 2.5rem; margin: 0.5rem 0; color: #fff; }
            .onb-header p { color: rgba(255,255,255,0.6); font-size: 1rem; }
            .onb-pasos { display: flex; justify-content: center; gap: 1rem; margin-bottom: 2rem; }
            .onb-paso { width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2px solid #333; color: #666; font-weight: 600; transition: all 0.3s; }
            .onb-paso.activo { border-color: #666; color: #fff; }
            .onb-paso.actual { border-width: 2px; }
            .onb-content { max-width: 450px; margin: 0 auto; }
            .onb-campo { margin-bottom: 1.5rem; }
            .onb-campo label { display: block; color: #fff; margin-bottom: 0.5rem; font-size: 1rem; }
            .onb-campo input, .onb-campo textarea { width: 100%; padding: 12px; background: #1a1a1a; border: 1px solid #333; border-radius: 8px; color: #fff; font-size: 1rem; font-family: inherit; box-sizing: border-box; }
            .onb-campo input:focus, .onb-campo textarea:focus { outline: none; border-color: ${portalActual.color}; }
            .onb-campo small { color: rgba(255,255,255,0.4); font-size: 0.85rem; margin-top: 4px; display: block; }
            .onb-opciones { display: flex; flex-wrap: wrap; gap: 8px; }
            .onb-opciones button { padding: 10px 18px; border-radius: 20px; border: 1px solid #333; background: #1a1a1a; color: rgba(255,255,255,0.7); cursor: pointer; font-size: 0.9rem; transition: all 0.3s; }
            .onb-opciones button:hover { border-color: #666; }
            .onb-opciones button.sel { color: #0a0a0a; font-weight: 600; }
            .onb-opciones-v { display: flex; flex-direction: column; gap: 8px; }
            .onb-opciones-v button { padding: 12px 16px; border-radius: 8px; border: 1px solid #333; background: #1a1a1a; color: rgba(255,255,255,0.7); cursor: pointer; text-align: left; font-size: 0.95rem; transition: all 0.3s; }
            .onb-opciones-v button:hover { border-color: #666; }
            .onb-opciones-v button.sel { background: #222; border-color: ${portalActual.color}; color: ${portalActual.color}; }
            .onb-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
            .onb-grid button { padding: 12px; border-radius: 8px; border: 1px solid #333; background: #1a1a1a; color: rgba(255,255,255,0.7); cursor: pointer; font-size: 0.9rem; transition: all 0.3s; }
            .onb-grid button:hover { border-color: #666; }
            .onb-grid button.sel { background: rgba(255,255,255,0.05); }
            .onb-nav { display: flex; gap: 12px; margin-top: 1.5rem; }
            .onb-btn { flex: 2; padding: 14px; border: none; border-radius: 8px; color: #0a0a0a; font-size: 1rem; font-weight: 600; cursor: pointer; font-family: 'Cinzel', serif; transition: all 0.3s; }
            .onb-btn:disabled { opacity: 0.5; cursor: not-allowed; }
            .onb-btn-sec { flex: 1; padding: 14px; border: 1px solid #333; border-radius: 8px; background: transparent; color: #fff; font-size: 1rem; cursor: pointer; }
            .onb-btn-final { box-shadow: 0 0 20px ${portalActual.color}40; }
          `}</style>
        </div>
      );
    }

    // DASHBOARD PRINCIPAL (onboarding completado)
    return (
      <div className="circulo-dark-dashboard">
        {/* Banner del portal actual */}
        <div className="circulo-banner" style={{'--portal-color': portalActual.color, '--duende-color': colorDuende}}>
          <div className="banner-bg"></div>
          <div className="banner-content">
            <span className="portal-icon">{portalActual.icono}</span>
            <h1>Círculo de Duendes</h1>
            <p>Portal de {portalActual.nombre}</p>
          </div>
        </div>

        {/* Duende de la semana */}
        {cargando ? (
          <div className="duende-loading"><span>✦</span> Conectando con tu guardián...</div>
        ) : consejo?.guardian ? (
          <div className="duende-card" style={{'--duende-color': colorDuende}}>
            <div className="duende-imagen">
              <img src={consejo.guardian.imagen} alt={consejo.guardian.nombre} />
              <div className="duende-aura"></div>
            </div>
            <div className="duende-info">
              <span className="duende-tipo">{consejo.guardian.tipo_ser_nombre} - {consejo.guardian.arquetipo || 'Guardián'}</span>
              <h2>{consejo.guardian.nombre}</h2>
              <p className="duende-elemento">{consejo.guardian.elemento}</p>
            </div>

            {/* Mensaje del duende */}
            <div className="consejo-box">
              {consejo.tipoMensaje === 'primera' && <span className="consejo-badge">✦ Consejo del día</span>}
              {consejo.tipoMensaje === 'comentario' && <span className="consejo-badge comentario">💬 Te cuento algo más...</span>}
              {consejo.tipoMensaje === 'gracioso' && <span className="consejo-badge gracioso">😄 Entre nos...</span>}
              <p className="consejo-texto">{consejo.consejo?.mensaje || consejo.consejo}</p>
            </div>

            {/* Días restantes */}
            <div className="semana-info">
              <span>📅 {consejo.diasRestantes} días más con {consejo.guardian.nombre}</span>
              {consejo.visitaDelDia > 1 && <span className="visita-num">Visita #{consejo.visitaDelDia} de hoy</span>}
            </div>
          </div>
        ) : (
          <div className="duende-error">No pudimos conectar con tu guardián. Intentá de nuevo.</div>
        )}

        {/* Navegación por tabs */}
        {tab === 'inicio' ? (
          <div className="circulo-accesos">
            <button className="acceso-btn" style={{'--btn-color': COLORES_NEON.celeste}} onClick={() => setTab('luna')}><span>☽</span> Guía Lunar</button>
            <button className="acceso-btn" style={{'--btn-color': COLORES_NEON.verdeMosgo}} onClick={() => setTab('contenido')}><span>✦</span> Contenido</button>
            <button className="acceso-btn" style={{'--btn-color': COLORES_NEON.magenta}} onClick={() => setTab('comunidad')}><span>❧</span> Comunidad</button>
            <button className="acceso-btn" style={{'--btn-color': COLORES_NEON.dorado}} onClick={() => setTab('rituales')}><span>📖</span> Rituales</button>
          </div>
        ) : (
          <div className="tab-content">
            <button className="btn-volver-inicio" onClick={() => setTab('inicio')}>← Volver al inicio</button>

            {tab === 'luna' && (
              <div className="seccion-luna">
                <h2 style={{color: COLORES_NEON.celeste}}>☽ Guía Lunar</h2>
                <p>Tu conexión con los ciclos de la luna</p>
                <div className="luna-actual">
                  <span className="luna-fase">🌙</span>
                  <div>
                    <h3>Luna actual</h3>
                    <p>Pronto tendrás aquí la guía completa de las fases lunares, rituales recomendados y meditaciones para cada momento del ciclo.</p>
                  </div>
                </div>
                <div className="luna-prox">
                  <p className="proximamente">✦ Contenido en preparación</p>
                </div>
              </div>
            )}

            {tab === 'contenido' && (
              <div className="seccion-contenido">
                <h2 style={{color: COLORES_NEON.verdeMosgo}}>✦ Contenido Exclusivo</h2>
                <p>Material especial solo para miembros del Círculo</p>
                <div className="contenido-grid">
                  <div className="contenido-card">
                    <span>📚</span>
                    <h4>Biblioteca de Rituales</h4>
                    <p>Prácticas ancestrales</p>
                  </div>
                  <div className="contenido-card">
                    <span>🔮</span>
                    <h4>Meditaciones Guiadas</h4>
                    <p>Con los guardianes</p>
                  </div>
                  <div className="contenido-card">
                    <span>✨</span>
                    <h4>Cursos Especiales</h4>
                    <p>Aprendizaje profundo</p>
                  </div>
                  <div className="contenido-card">
                    <span>🌿</span>
                    <h4>Herbolaria Mágica</h4>
                    <p>Secretos de plantas</p>
                  </div>
                </div>
                <p className="proximamente">✦ Contenido en preparación</p>
              </div>
            )}

            {tab === 'comunidad' && (
              <div className="seccion-comunidad">
                <h2 style={{color: COLORES_NEON.magenta}}>❧ Comunidad del Círculo</h2>
                <p>Tu espacio para conectar, compartir y crecer junto a otros buscadores</p>

                <div className="comunidad-stats">
                  <div className="stat-item">
                    <span className="stat-num">✦</span>
                    <span className="stat-label">Miembros activos</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-num">☽</span>
                    <span className="stat-label">Círculos de luna</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-num">❧</span>
                    <span className="stat-label">Historias compartidas</span>
                  </div>
                </div>

                <div className="foro-seccion">
                  <div className="foro-titulo">
                    <span className="foro-icono">📋</span>
                    <div>
                      <h3>Tablero de Experiencias</h3>
                      <p>Compartí tu camino con los guardianes</p>
                    </div>
                  </div>
                  <div className="foro-estado">
                    <span className="estado-badge">En desarrollo</span>
                    <p>Estamos creando un espacio sagrado para que puedas compartir tus experiencias, sueños y descubrimientos con otros miembros del Círculo.</p>
                  </div>
                </div>

                <div className="comunidad-features">
                  <div className="feature-card">
                    <span style={{color: COLORES_NEON.magenta}}>💬</span>
                    <h4>Historias con Guardianes</h4>
                    <p>Contá cómo te conectaste con tu guardián y qué aprendiste</p>
                  </div>
                  <div className="feature-card">
                    <span style={{color: COLORES_NEON.celeste}}>🌙</span>
                    <h4>Círculos Lunares</h4>
                    <p>Encuentros virtuales cada luna llena y nueva</p>
                  </div>
                  <div className="feature-card">
                    <span style={{color: COLORES_NEON.verdeMosgo}}>🌿</span>
                    <h4>Intercambio de Rituales</h4>
                    <p>Compartí prácticas que funcionaron para vos</p>
                  </div>
                  <div className="feature-card">
                    <span style={{color: COLORES_NEON.dorado}}>✨</span>
                    <h4>Preguntas al Círculo</h4>
                    <p>Consultá a la comunidad sobre tu camino</p>
                  </div>
                </div>

                <div className="comunidad-cta">
                  <p>¿Tenés algo para compartir? Escribinos a <strong>circulo@duendesuy.com</strong></p>
                </div>
              </div>
            )}

            {tab === 'rituales' && (
              <div className="seccion-rituales">
                <h2 style={{color: COLORES_NEON.dorado}}>📖 Rituales del Portal</h2>
                <p>Prácticas sagradas para el portal de {portalActual.nombre}</p>
                <div className="ritual-destacado">
                  <span className="ritual-icon">{portalActual.icono}</span>
                  <div>
                    <h3>Ritual de {portalActual.nombre}</h3>
                    <p>Conectá con la energía de este momento del año a través de prácticas específicas para el portal actual.</p>
                  </div>
                </div>
                <div className="rituales-lista">
                  <div className="ritual-mini">
                    <span>🕯️</span>
                    <span>Ritual de velas</span>
                  </div>
                  <div className="ritual-mini">
                    <span>🌿</span>
                    <span>Limpieza energética</span>
                  </div>
                  <div className="ritual-mini">
                    <span>✨</span>
                    <span>Meditación guiada</span>
                  </div>
                </div>
                <p className="proximamente">✦ Rituales en preparación</p>
              </div>
            )}
          </div>
        )}

        <style jsx>{`
          .circulo-dark-dashboard { background: #0a0a0a; border-radius: 16px; overflow: hidden; color: #fff; font-family: 'Cormorant Garamond', serif; }
          .circulo-banner { position: relative; padding: 2.5rem 1.5rem; text-align: center; overflow: hidden; }
          .banner-bg { position: absolute; inset: 0; background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%); }
          .banner-bg::before { content: ''; position: absolute; inset: 0; background: radial-gradient(ellipse at 50% 0%, var(--portal-color) 0%, transparent 70%); opacity: 0.15; }
          .banner-content { position: relative; z-index: 1; }
          .portal-icon { font-size: 2.5rem; display: block; margin-bottom: 0.5rem; filter: drop-shadow(0 0 10px var(--portal-color)); }
          .banner-content h1 { font-family: 'Tangerine', cursive; font-size: 3rem; margin: 0; color: #fff; text-shadow: 0 0 30px var(--portal-color); }
          .banner-content p { color: var(--portal-color); font-size: 1.1rem; margin-top: 0.5rem; font-family: 'Cinzel', serif; letter-spacing: 2px; text-transform: uppercase; }

          .duende-loading { text-align: center; padding: 3rem; color: rgba(255,255,255,0.6); }
          .duende-loading span { color: ${portalActual.color}; }
          .duende-error { text-align: center; padding: 2rem; color: rgba(255,255,255,0.5); }

          .duende-card { padding: 1.5rem; text-align: center; }
          .duende-imagen { position: relative; width: 180px; height: 180px; margin: 0 auto 1.5rem; }
          .duende-imagen img { width: 100%; height: 100%; object-fit: cover; border-radius: 50%; border: 3px solid var(--duende-color); }
          .duende-aura { position: absolute; inset: -10px; border-radius: 50%; background: radial-gradient(circle, var(--duende-color) 0%, transparent 70%); opacity: 0.3; animation: aura-pulse 3s ease-in-out infinite; z-index: -1; }
          @keyframes aura-pulse { 0%, 100% { transform: scale(1); opacity: 0.3; } 50% { transform: scale(1.1); opacity: 0.5; } }

          .duende-info { margin-bottom: 1.5rem; }
          .duende-tipo { font-size: 0.85rem; color: var(--duende-color); text-transform: uppercase; letter-spacing: 2px; font-family: 'Cinzel', serif; }
          .duende-info h2 { font-family: 'Tangerine', cursive; font-size: 2.5rem; margin: 0.3rem 0; color: #fff; }
          .duende-elemento { color: rgba(255,255,255,0.5); font-size: 0.9rem; }

          .consejo-box { background: #111; border-radius: 12px; padding: 1.5rem; margin: 1.5rem 0; border-left: 3px solid var(--duende-color); text-align: left; }
          .consejo-badge { display: inline-block; font-size: 0.8rem; color: var(--duende-color); margin-bottom: 0.8rem; font-family: 'Cinzel', serif; letter-spacing: 1px; }
          .consejo-badge.comentario { color: ${COLORES_NEON.celeste}; }
          .consejo-badge.gracioso { color: ${COLORES_NEON.dorado}; }
          .consejo-texto { font-size: 1.1rem; line-height: 1.7; color: rgba(255,255,255,0.9); margin: 0; }

          .semana-info { display: flex; justify-content: space-between; align-items: center; padding: 1rem; background: #111; border-radius: 8px; font-size: 0.85rem; color: rgba(255,255,255,0.5); }
          .visita-num { color: var(--duende-color); }

          .circulo-accesos { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; padding: 1.5rem; }
          .acceso-btn { display: flex; align-items: center; gap: 10px; padding: 1rem; background: #111; border: 1px solid #222; border-radius: 10px; color: #fff; font-family: 'Cinzel', serif; font-size: 0.9rem; cursor: pointer; transition: all 0.3s; }
          .acceso-btn:hover { border-color: var(--btn-color); box-shadow: 0 0 15px var(--btn-color)30; }
          .acceso-btn span { font-size: 1.3rem; color: var(--btn-color); }

          /* Tab content sections */
          .tab-content { padding: 1.5rem; }
          .btn-volver-inicio { display: inline-flex; align-items: center; gap: 6px; background: transparent; border: 1px solid #333; color: rgba(255,255,255,0.7); padding: 8px 16px; border-radius: 6px; font-size: 0.85rem; cursor: pointer; margin-bottom: 1.5rem; transition: all 0.3s; }
          .btn-volver-inicio:hover { border-color: #666; color: #fff; }

          .tab-content h2 { font-family: 'Tangerine', cursive; font-size: 2.2rem; margin: 0 0 0.5rem; }
          .tab-content > p { color: rgba(255,255,255,0.6); margin-bottom: 1.5rem; font-size: 1rem; }
          .proximamente { text-align: center; color: rgba(255,255,255,0.4); font-size: 0.9rem; margin-top: 1.5rem; padding: 1rem; background: #0a0a0a; border-radius: 8px; }

          /* Luna section */
          .luna-actual { display: flex; gap: 1rem; align-items: flex-start; background: #111; padding: 1.5rem; border-radius: 12px; margin-bottom: 1rem; }
          .luna-fase { font-size: 3rem; filter: drop-shadow(0 0 10px ${COLORES_NEON.celeste}); }
          .luna-actual h3 { font-family: 'Cinzel', serif; font-size: 1rem; margin: 0 0 0.5rem; color: ${COLORES_NEON.celeste}; }
          .luna-actual p { color: rgba(255,255,255,0.7); margin: 0; font-size: 0.95rem; line-height: 1.5; }

          /* Contenido section */
          .contenido-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; }
          .contenido-card { background: #111; padding: 1.2rem; border-radius: 10px; text-align: center; border: 1px solid #222; transition: all 0.3s; }
          .contenido-card:hover { border-color: ${COLORES_NEON.verdeMosgo}40; }
          .contenido-card span { font-size: 2rem; display: block; margin-bottom: 0.5rem; }
          .contenido-card h4 { font-family: 'Cinzel', serif; font-size: 0.85rem; margin: 0 0 0.3rem; color: #fff; }
          .contenido-card p { font-size: 0.8rem; color: rgba(255,255,255,0.5); margin: 0; }

          /* Comunidad section */
          .comunidad-stats { display: flex; justify-content: space-around; padding: 1.2rem; background: linear-gradient(135deg, ${COLORES_NEON.magenta}10 0%, transparent 100%); border-radius: 12px; margin-bottom: 1.5rem; border: 1px solid ${COLORES_NEON.magenta}20; }
          .stat-item { text-align: center; }
          .stat-num { font-size: 1.5rem; color: ${COLORES_NEON.magenta}; display: block; margin-bottom: 4px; }
          .stat-label { font-size: 0.75rem; color: rgba(255,255,255,0.5); text-transform: uppercase; letter-spacing: 1px; }

          .foro-seccion { background: #111; border-radius: 12px; padding: 1.5rem; margin-bottom: 1.5rem; }
          .foro-titulo { display: flex; gap: 1rem; align-items: flex-start; margin-bottom: 1rem; }
          .foro-icono { font-size: 2rem; }
          .foro-titulo h3 { font-family: 'Cinzel', serif; font-size: 1.1rem; margin: 0 0 0.3rem; color: #fff; }
          .foro-titulo p { font-size: 0.9rem; color: rgba(255,255,255,0.5); margin: 0; }
          .foro-estado { background: #0a0a0a; padding: 1rem; border-radius: 8px; }
          .estado-badge { display: inline-block; font-size: 0.7rem; background: ${COLORES_NEON.violeta}30; color: ${COLORES_NEON.violeta}; padding: 4px 12px; border-radius: 20px; margin-bottom: 0.8rem; }
          .foro-estado p { font-size: 0.9rem; color: rgba(255,255,255,0.6); margin: 0; line-height: 1.5; }

          .comunidad-features { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin-bottom: 1.5rem; }
          .feature-card { background: #111; padding: 1rem; border-radius: 10px; border: 1px solid #1a1a1a; transition: all 0.3s; }
          .feature-card:hover { border-color: #333; }
          .feature-card span { font-size: 1.5rem; display: block; margin-bottom: 0.5rem; }
          .feature-card h4 { font-family: 'Cinzel', serif; font-size: 0.8rem; margin: 0 0 0.3rem; color: #fff; }
          .feature-card p { font-size: 0.75rem; color: rgba(255,255,255,0.5); margin: 0; line-height: 1.4; }

          .comunidad-cta { text-align: center; padding: 1rem; background: #0a0a0a; border-radius: 8px; }
          .comunidad-cta p { font-size: 0.9rem; color: rgba(255,255,255,0.6); margin: 0; }
          .comunidad-cta strong { color: ${COLORES_NEON.magenta}; }

          /* Rituales section */
          .ritual-destacado { display: flex; gap: 1rem; align-items: flex-start; background: linear-gradient(135deg, #1a1a0a 0%, #111 100%); padding: 1.5rem; border-radius: 12px; border: 1px solid ${COLORES_NEON.dorado}30; margin-bottom: 1rem; }
          .ritual-icon { font-size: 3rem; filter: drop-shadow(0 0 10px ${COLORES_NEON.dorado}); }
          .ritual-destacado h3 { font-family: 'Cinzel', serif; font-size: 1rem; margin: 0 0 0.5rem; color: ${COLORES_NEON.dorado}; }
          .ritual-destacado p { color: rgba(255,255,255,0.7); margin: 0; font-size: 0.95rem; line-height: 1.5; }
          .rituales-lista { display: flex; flex-direction: column; gap: 8px; }
          .ritual-mini { display: flex; align-items: center; gap: 12px; background: #111; padding: 12px 16px; border-radius: 8px; font-size: 0.95rem; color: rgba(255,255,255,0.8); }
          .ritual-mini span:first-child { font-size: 1.2rem; }
        `}</style>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════
  // SI NO ES MIEMBRO - MODAL CON PREVIEW BLURREADO
  // ═══════════════════════════════════════════════════════════════

  return (
    <div className="circulo-promo-container">
      {/* Preview blurreado de fondo */}
      <div className="circulo-preview-bg">
        <div className="preview-fake-content">
          <div className="fake-duende"></div>
          <div className="fake-text"></div>
          <div className="fake-text short"></div>
          <div className="fake-cards">
            <div className="fake-card"></div>
            <div className="fake-card"></div>
          </div>
        </div>
      </div>

      {/* Modal de suscripción */}
      <div className="circulo-modal">
        <span className="modal-star">★</span>
        <h1>Círculo de Duendes</h1>
        <p className="modal-subtitle">El santuario secreto para quienes sienten el llamado</p>

        <div className="beneficios-lista">
          <div className="beneficio"><span style={{color: COLORES_NEON.magenta}}>✦</span> Duende guardián semanal con mensajes únicos</div>
          <div className="beneficio"><span style={{color: COLORES_NEON.celeste}}>☽</span> Guía lunar completa cada mes</div>
          <div className="beneficio"><span style={{color: COLORES_NEON.verdeMosgo}}>🕯️</span> Rituales y prácticas exclusivas</div>
          <div className="beneficio"><span style={{color: COLORES_NEON.dorado}}>❧</span> Comunidad privada de buscadores</div>
          <div className="beneficio"><span style={{color: COLORES_NEON.violeta}}>◈</span> 5-10% OFF en guardianes</div>
          <div className="beneficio destacado"><span style={{color: COLORES_NEON.dorado}}>🎁</span> <strong>100 runas de regalo</strong> para usar en la tienda</div>
        </div>

        <h3>Elegí tu membresía</h3>
        <p className="pago-unico">Pago único - Sin renovación automática</p>

        <div className="membresias-grid">
          <a href="https://duendesuy.10web.cloud/producto/circulo-semestral/" target="_blank" rel="noopener" className="membresia-card">
            <h4>Semestral</h4>
            <div className="precio">{esUY ? '$2.000' : '$50'}<small>{esUY ? 'UYU' : 'USD'}</small></div>
            <span className="duracion">6 meses de magia</span>
          </a>
          <a href="https://duendesuy.10web.cloud/producto/circulo-anual/" target="_blank" rel="noopener" className="membresia-card destacada">
            <span className="badge-mejor">Mejor valor</span>
            <h4>Anual</h4>
            <div className="precio">{esUY ? '$3.200' : '$80'}<small>{esUY ? 'UYU' : 'USD'}</small></div>
            <span className="duracion">12 meses de magia</span>
            <span className="ahorro">Ahorrás 20%</span>
          </a>
        </div>
      </div>

      <style jsx>{`
        .circulo-promo-container { position: relative; min-height: 500px; border-radius: 16px; overflow: hidden; background: #0a0a0a; }
        .circulo-preview-bg { position: absolute; inset: 0; filter: blur(8px); opacity: 0.3; padding: 2rem; }
        .preview-fake-content { display: flex; flex-direction: column; align-items: center; gap: 1rem; }
        .fake-duende { width: 120px; height: 120px; border-radius: 50%; background: linear-gradient(135deg, #333, #222); }
        .fake-text { width: 80%; height: 20px; background: #222; border-radius: 4px; }
        .fake-text.short { width: 50%; }
        .fake-cards { display: flex; gap: 1rem; width: 100%; margin-top: 1rem; }
        .fake-card { flex: 1; height: 100px; background: #1a1a1a; border-radius: 8px; }

        .circulo-modal { position: relative; z-index: 1; text-align: center; padding: 2.5rem 1.5rem; color: #fff; font-family: 'Cormorant Garamond', serif; }
        .modal-star { font-size: 3rem; color: ${COLORES_NEON.dorado}; display: block; margin-bottom: 0.5rem; text-shadow: 0 0 30px ${COLORES_NEON.dorado}; }
        .circulo-modal h1 { font-family: 'Tangerine', cursive; font-size: 3rem; margin: 0 0 0.5rem; color: #fff; }
        .modal-subtitle { color: rgba(255,255,255,0.6); font-size: 1.1rem; margin-bottom: 2rem; }

        .beneficios-lista { text-align: left; max-width: 320px; margin: 0 auto 2rem; }
        .beneficio { display: flex; align-items: center; gap: 12px; padding: 10px 0; font-size: 1rem; color: rgba(255,255,255,0.85); border-bottom: 1px solid #1a1a1a; }
        .beneficio span { font-size: 1.2rem; }
        .beneficio.destacado { background: linear-gradient(90deg, ${COLORES_NEON.dorado}15 0%, transparent 100%); padding: 12px 10px; margin: 8px -10px; border-radius: 8px; border-bottom: none; }
        .beneficio.destacado strong { color: ${COLORES_NEON.dorado}; }

        .circulo-modal h3 { font-family: 'Cinzel', serif; font-size: 1.1rem; margin: 0 0 0.3rem; color: #fff; letter-spacing: 1px; }
        .pago-unico { font-size: 0.85rem; color: ${COLORES_NEON.verdeMosgo}; margin-bottom: 1.5rem; }

        .membresias-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; max-width: 400px; margin: 0 auto; }
        .membresia-card { display: flex; flex-direction: column; align-items: center; padding: 1.5rem 1rem; background: #111; border: 1px solid #222; border-radius: 12px; text-decoration: none; color: #fff; transition: all 0.3s; position: relative; }
        .membresia-card:hover { border-color: ${COLORES_NEON.dorado}; box-shadow: 0 0 20px ${COLORES_NEON.dorado}30; }
        .membresia-card.destacada { border-color: ${COLORES_NEON.dorado}; background: linear-gradient(135deg, #1a1a0a 0%, #111 100%); }
        .badge-mejor { position: absolute; top: -10px; background: ${COLORES_NEON.dorado}; color: #0a0a0a; font-size: 0.7rem; padding: 4px 12px; border-radius: 20px; font-family: 'Cinzel', serif; font-weight: 600; }
        .membresia-card h4 { font-family: 'Cinzel', serif; font-size: 1rem; margin: 0 0 0.5rem; }
        .precio { font-size: 1.8rem; font-weight: 700; color: #fff; }
        .precio small { font-size: 0.8rem; color: rgba(255,255,255,0.5); margin-left: 4px; }
        .duracion { font-size: 0.85rem; color: rgba(255,255,255,0.5); margin-top: 0.3rem; }
        .ahorro { font-size: 0.8rem; color: ${COLORES_NEON.verdeMosgo}; margin-top: 0.5rem; font-weight: 600; }
      `}</style>
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
  const [busqueda, setBusqueda] = useState('');

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
      const nuevoPostLocal = {
        id: Date.now(),
        autor: usuario.nombrePreferido,
        autorEmail: usuario.email,
        titulo: titulo.trim(),
        contenido: nuevoPost.trim(),
        categoria,
        fecha: new Date().toISOString(),
        respuestas: [],
        likes: 0,
        etiqueta: 'nuevo'
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
      likes: 12,
      etiqueta: 'destacado'
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
      likes: 8,
      etiqueta: 'nuevo'
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
      likes: 24,
      etiqueta: 'resuelto'
    }
  ];

  const postsFiltrados = busqueda.trim()
    ? posts.filter(p => p.titulo.toLowerCase().includes(busqueda.toLowerCase()) || p.contenido.toLowerCase().includes(busqueda.toLowerCase()))
    : posts;

  const getEtiquetaStyle = (etiqueta) => {
    switch(etiqueta) {
      case 'destacado': return { bg: 'linear-gradient(135deg, #d4af37, #b8962e)', color: '#0a0a0a' };
      case 'resuelto': return { bg: 'linear-gradient(135deg, #22c55e, #16a34a)', color: '#fff' };
      case 'nuevo': return { bg: 'linear-gradient(135deg, #8b5cf6, #7c3aed)', color: '#fff' };
      default: return null;
    }
  };

  // Vista de post seleccionado
  if (postSeleccionado) {
    return (
      <div className="foro-dark">
        <button className="foro-btn-volver" onClick={() => setPostSeleccionado(null)}>← Volver al foro</button>

        <div className="foro-post-detalle">
          <div className="foro-post-header">
            <div className="foro-avatar-lg">{postSeleccionado.autor.charAt(0)}</div>
            <div className="foro-post-meta">
              <span className="foro-autor">{postSeleccionado.autor}</span>
              <span className="foro-fecha">{formatearFecha(postSeleccionado.fecha)}</span>
            </div>
            {postSeleccionado.etiqueta && (
              <span className="foro-etiqueta" style={{background: getEtiquetaStyle(postSeleccionado.etiqueta)?.bg, color: getEtiquetaStyle(postSeleccionado.etiqueta)?.color}}>
                {postSeleccionado.etiqueta === 'destacado' && '★ '}
                {postSeleccionado.etiqueta === 'resuelto' && '✓ '}
                {postSeleccionado.etiqueta}
              </span>
            )}
          </div>
          <h2 className="foro-post-titulo">{postSeleccionado.titulo}</h2>
          <p className="foro-post-texto">{postSeleccionado.contenido}</p>
          <div className="foro-post-stats">
            <span>❤️ {postSeleccionado.likes || 0}</span>
            <span>💬 {(postSeleccionado.respuestas || []).length}</span>
          </div>
        </div>

        {(postSeleccionado.respuestas || []).length > 0 && (
          <div className="foro-respuestas-sec">
            <h3>💬 Respuestas ({postSeleccionado.respuestas.length})</h3>
            {postSeleccionado.respuestas.map((r, i) => (
              <div key={r.id || i} className="foro-respuesta-card">
                <div className="foro-avatar-sm">{r.autor.charAt(0)}</div>
                <div className="foro-respuesta-body">
                  <div className="foro-respuesta-header">
                    <span className="foro-autor-sm">{r.autor}</span>
                    <span className="foro-fecha-sm">{formatearFecha(r.fecha)}</span>
                  </div>
                  <p>{r.contenido}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="foro-nueva-respuesta">
          <h3>Tu respuesta</h3>
          <textarea
            placeholder="Comparte tu experiencia o ayuda a tu compañera..."
            value={respuesta}
            onChange={e => setRespuesta(e.target.value)}
            rows={3}
          />
          <button className="foro-btn-gold" onClick={responderPost} disabled={!respuesta.trim() || enviando}>
            {enviando ? 'Enviando...' : 'Responder'}
          </button>
        </div>

        <style jsx>{`
          .foro-dark { background: linear-gradient(180deg, #0a0a0f 0%, #0f0f14 100%); min-height: 100vh; padding: 2rem; color: #FDF8F0; font-family: 'Cormorant Garamond', serif; }
          .foro-btn-volver { background: transparent; border: 1px solid rgba(212,175,55,0.3); color: #d4af37; padding: 10px 20px; border-radius: 8px; cursor: pointer; font-size: 0.9rem; margin-bottom: 1.5rem; transition: all 0.3s; }
          .foro-btn-volver:hover { background: rgba(212,175,55,0.1); border-color: #d4af37; }
          .foro-post-detalle { background: rgba(255,255,255,0.03); border: 1px solid rgba(212,175,55,0.2); border-radius: 16px; padding: 2rem; margin-bottom: 1.5rem; }
          .foro-post-header { display: flex; align-items: center; gap: 1rem; margin-bottom: 1.5rem; flex-wrap: wrap; }
          .foro-avatar-lg { width: 50px; height: 50px; border-radius: 50%; background: linear-gradient(135deg, #d4af37, #b8962e); display: flex; align-items: center; justify-content: center; color: #0a0a0a; font-family: 'Cinzel', serif; font-size: 1.2rem; font-weight: 600; }
          .foro-post-meta { display: flex; flex-direction: column; flex: 1; }
          .foro-autor { font-family: 'Cinzel', serif; color: #d4af37; font-size: 1rem; }
          .foro-fecha { color: rgba(255,255,255,0.5); font-size: 0.85rem; }
          .foro-etiqueta { padding: 4px 12px; border-radius: 20px; font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; }
          .foro-post-titulo { font-family: 'Cinzel', serif; font-size: 1.5rem; margin-bottom: 1rem; color: #FDF8F0; }
          .foro-post-texto { color: rgba(255,255,255,0.85); line-height: 1.8; font-size: 1.05rem; }
          .foro-post-stats { display: flex; gap: 1.5rem; margin-top: 1.5rem; padding-top: 1rem; border-top: 1px solid rgba(255,255,255,0.1); color: rgba(255,255,255,0.6); font-size: 0.9rem; }
          .foro-respuestas-sec { margin-bottom: 1.5rem; }
          .foro-respuestas-sec h3 { font-family: 'Cinzel', serif; color: #d4af37; margin-bottom: 1rem; }
          .foro-respuesta-card { display: flex; gap: 1rem; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 1rem; margin-bottom: 0.75rem; transition: all 0.3s; }
          .foro-respuesta-card:hover { border-color: rgba(212,175,55,0.2); }
          .foro-avatar-sm { width: 36px; height: 36px; border-radius: 50%; background: rgba(212,175,55,0.3); display: flex; align-items: center; justify-content: center; color: #d4af37; font-size: 0.9rem; flex-shrink: 0; }
          .foro-respuesta-body { flex: 1; }
          .foro-respuesta-header { display: flex; gap: 0.75rem; margin-bottom: 0.5rem; }
          .foro-autor-sm { color: #d4af37; font-size: 0.9rem; }
          .foro-fecha-sm { color: rgba(255,255,255,0.4); font-size: 0.8rem; }
          .foro-respuesta-body p { color: rgba(255,255,255,0.8); margin: 0; font-size: 0.95rem; line-height: 1.6; }
          .foro-nueva-respuesta { background: rgba(255,255,255,0.03); border: 1px solid rgba(212,175,55,0.2); border-radius: 16px; padding: 1.5rem; }
          .foro-nueva-respuesta h3 { font-family: 'Cinzel', serif; color: #d4af37; margin-bottom: 1rem; }
          .foro-nueva-respuesta textarea { width: 100%; padding: 1rem; background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; color: #FDF8F0; font-size: 1rem; font-family: inherit; resize: vertical; margin-bottom: 1rem; }
          .foro-nueva-respuesta textarea:focus { outline: none; border-color: #d4af37; }
          .foro-nueva-respuesta textarea::placeholder { color: rgba(255,255,255,0.4); }
          .foro-btn-gold { background: linear-gradient(135deg, #d4af37, #b8962e); color: #0a0a0a; border: none; padding: 12px 30px; border-radius: 50px; font-family: 'Cinzel', serif; font-size: 0.9rem; font-weight: 600; cursor: pointer; transition: all 0.3s; }
          .foro-btn-gold:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 10px 30px rgba(212,175,55,0.3); }
          .foro-btn-gold:disabled { opacity: 0.5; cursor: not-allowed; }
        `}</style>
      </div>
    );
  }

  // Vista principal del foro
  return (
    <div className="foro-dark">
      {/* Header */}
      <div className="foro-header">
        <div className="foro-header-content">
          <span className="foro-icono">💬</span>
          <div>
            <h1>Foro Mágico</h1>
            <p>Conectá con la comunidad de guardianas y guardianes</p>
          </div>
        </div>
      </div>

      {/* Búsqueda */}
      <div className="foro-busqueda">
        <input
          type="text"
          placeholder="🔍 Buscar en el foro..."
          value={busqueda}
          onChange={e => setBusqueda(e.target.value)}
        />
      </div>

      {/* Categorías */}
      <div className="foro-categorias-premium">
        {CATEGORIAS_FORO.map(cat => (
          <button
            key={cat.id}
            onClick={() => setCategoria(cat.id)}
            className={`foro-cat-btn ${categoria === cat.id ? 'activa' : ''}`}
          >
            <span className="cat-icono">{cat.icono}</span>
            <span className="cat-nombre">{cat.nombre}</span>
          </button>
        ))}
      </div>

      {/* Botón nuevo post */}
      <button className="foro-nuevo-btn" onClick={() => setMostrarNuevo(!mostrarNuevo)}>
        <span>{mostrarNuevo ? '✕' : '+'}</span>
        {mostrarNuevo ? 'Cancelar' : 'Nueva publicación'}
      </button>

      {/* Formulario nuevo post */}
      {mostrarNuevo && (
        <div className="foro-nuevo-form">
          <h3>✦ Nueva publicación en {CATEGORIAS_FORO.find(c => c.id === categoria)?.nombre}</h3>
          <input
            type="text"
            placeholder="Título de tu publicación"
            value={titulo}
            onChange={e => setTitulo(e.target.value)}
          />
          <textarea
            placeholder="¿Qué querés compartir con la comunidad?"
            value={nuevoPost}
            onChange={e => setNuevoPost(e.target.value)}
            rows={5}
          />
          <button className="foro-btn-gold" onClick={publicar} disabled={!titulo.trim() || !nuevoPost.trim() || enviando}>
            {enviando ? 'Publicando...' : 'Publicar'}
          </button>
        </div>
      )}

      {/* Lista de posts */}
      {cargando ? (
        <div className="foro-cargando">
          <span className="foro-spinner">✦</span>
          <p>Cargando publicaciones...</p>
        </div>
      ) : postsFiltrados.length === 0 ? (
        <div className="foro-vacio">
          <span>✦</span>
          <h3>Sé la primera en publicar</h3>
          <p>Esta categoría está esperando tu voz. ¡Compartí algo con la comunidad!</p>
        </div>
      ) : (
        <div className="foro-lista">
          {postsFiltrados.map(post => (
            <div key={post.id} className="foro-card" onClick={() => setPostSeleccionado(post)}>
              <div className="foro-card-left">
                <div className="foro-avatar">{post.autor.charAt(0)}</div>
              </div>
              <div className="foro-card-content">
                <div className="foro-card-top">
                  <h4>{post.titulo}</h4>
                  {post.etiqueta && (
                    <span className="foro-etiqueta-mini" style={{background: getEtiquetaStyle(post.etiqueta)?.bg, color: getEtiquetaStyle(post.etiqueta)?.color}}>
                      {post.etiqueta === 'destacado' && '★'}
                      {post.etiqueta === 'resuelto' && '✓'}
                      {post.etiqueta === 'nuevo' && '●'}
                    </span>
                  )}
                </div>
                <p className="foro-card-preview">{post.contenido.substring(0, 120)}{post.contenido.length > 120 ? '...' : ''}</p>
                <div className="foro-card-footer">
                  <span className="foro-card-autor">{post.autor}</span>
                  <span className="foro-card-sep">·</span>
                  <span className="foro-card-fecha">{formatearFecha(post.fecha)}</span>
                  <span className="foro-card-sep">·</span>
                  <span className="foro-card-stats">💬 {(post.respuestas || []).length}</span>
                  <span className="foro-card-stats">❤️ {post.likes || 0}</span>
                </div>
              </div>
              <div className="foro-card-arrow">→</div>
            </div>
          ))}
        </div>
      )}

      <style jsx>{`
        .foro-dark { background: linear-gradient(180deg, #0a0a0f 0%, #0f0f14 100%); min-height: 100vh; padding: 0; color: #FDF8F0; font-family: 'Cormorant Garamond', serif; }
        .foro-header { background: linear-gradient(135deg, rgba(212,175,55,0.15) 0%, rgba(212,175,55,0.05) 100%); border-bottom: 1px solid rgba(212,175,55,0.2); padding: 2rem; }
        .foro-header-content { display: flex; align-items: center; gap: 1rem; max-width: 900px; margin: 0 auto; }
        .foro-icono { font-size: 2.5rem; }
        .foro-header h1 { font-family: 'Cinzel', serif; font-size: 1.8rem; margin: 0 0 0.25rem; color: #FDF8F0; }
        .foro-header p { color: rgba(255,255,255,0.6); margin: 0; }
        .foro-busqueda { padding: 1.5rem 2rem; max-width: 900px; margin: 0 auto; }
        .foro-busqueda input { width: 100%; padding: 14px 20px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; color: #FDF8F0; font-size: 1rem; font-family: inherit; transition: all 0.3s; }
        .foro-busqueda input:focus { outline: none; border-color: #d4af37; background: rgba(255,255,255,0.08); }
        .foro-busqueda input::placeholder { color: rgba(255,255,255,0.4); }
        .foro-categorias-premium { display: flex; gap: 0.75rem; padding: 0 2rem 1.5rem; max-width: 900px; margin: 0 auto; flex-wrap: wrap; }
        .foro-cat-btn { display: flex; align-items: center; gap: 8px; padding: 10px 18px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1); border-radius: 25px; color: rgba(255,255,255,0.7); font-size: 0.9rem; cursor: pointer; transition: all 0.3s; }
        .foro-cat-btn:hover { border-color: rgba(212,175,55,0.4); background: rgba(212,175,55,0.05); }
        .foro-cat-btn.activa { background: linear-gradient(135deg, #d4af37, #b8962e); border-color: transparent; color: #0a0a0a; }
        .foro-cat-btn .cat-icono { font-size: 1rem; }
        .foro-nuevo-btn { display: flex; align-items: center; justify-content: center; gap: 10px; width: calc(100% - 4rem); max-width: 868px; margin: 0 auto 1.5rem; padding: 14px; background: linear-gradient(135deg, #d4af37, #b8962e); border: none; border-radius: 12px; color: #0a0a0a; font-family: 'Cinzel', serif; font-size: 1rem; font-weight: 600; cursor: pointer; transition: all 0.3s; }
        .foro-nuevo-btn:hover { transform: translateY(-2px); box-shadow: 0 10px 30px rgba(212,175,55,0.3); }
        .foro-nuevo-btn span { font-size: 1.2rem; }
        .foro-nuevo-form { background: rgba(255,255,255,0.03); border: 1px solid rgba(212,175,55,0.3); border-radius: 16px; padding: 1.5rem; margin: 0 2rem 1.5rem; max-width: 868px; margin-left: auto; margin-right: auto; }
        .foro-nuevo-form h3 { font-family: 'Cinzel', serif; color: #d4af37; margin-bottom: 1rem; }
        .foro-nuevo-form input, .foro-nuevo-form textarea { width: 100%; padding: 14px; background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; color: #FDF8F0; font-size: 1rem; font-family: inherit; margin-bottom: 1rem; box-sizing: border-box; }
        .foro-nuevo-form textarea { resize: vertical; }
        .foro-nuevo-form input:focus, .foro-nuevo-form textarea:focus { outline: none; border-color: #d4af37; }
        .foro-nuevo-form input::placeholder, .foro-nuevo-form textarea::placeholder { color: rgba(255,255,255,0.4); }
        .foro-cargando, .foro-vacio { text-align: center; padding: 4rem 2rem; color: rgba(255,255,255,0.5); }
        .foro-spinner { display: block; font-size: 2.5rem; color: #d4af37; margin-bottom: 1rem; animation: spin 2s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .foro-vacio span { display: block; font-size: 3rem; color: #d4af37; margin-bottom: 1rem; }
        .foro-vacio h3 { font-family: 'Cinzel', serif; color: #FDF8F0; margin-bottom: 0.5rem; }
        .foro-lista { padding: 0 2rem 2rem; max-width: 900px; margin: 0 auto; display: flex; flex-direction: column; gap: 1rem; }
        .foro-card { display: flex; align-items: flex-start; gap: 1rem; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; padding: 1.25rem; cursor: pointer; transition: all 0.3s ease; }
        .foro-card:hover { border-color: rgba(212,175,55,0.4); transform: translateX(5px); box-shadow: 0 8px 30px rgba(212,175,55,0.1); }
        .foro-avatar { width: 45px; height: 45px; border-radius: 50%; background: linear-gradient(135deg, #d4af37, #b8962e); display: flex; align-items: center; justify-content: center; color: #0a0a0a; font-family: 'Cinzel', serif; font-weight: 600; flex-shrink: 0; }
        .foro-card-content { flex: 1; min-width: 0; }
        .foro-card-top { display: flex; align-items: center; gap: 10px; margin-bottom: 0.5rem; }
        .foro-card-top h4 { font-family: 'Cinzel', serif; font-size: 1.1rem; margin: 0; color: #FDF8F0; flex: 1; }
        .foro-etiqueta-mini { width: 22px; height: 22px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.7rem; flex-shrink: 0; }
        .foro-card-preview { color: rgba(255,255,255,0.6); font-size: 0.95rem; margin: 0 0 0.75rem; line-height: 1.5; }
        .foro-card-footer { display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap; font-size: 0.8rem; }
        .foro-card-autor { color: #d4af37; }
        .foro-card-sep { color: rgba(255,255,255,0.3); }
        .foro-card-fecha, .foro-card-stats { color: rgba(255,255,255,0.4); }
        .foro-card-arrow { color: #d4af37; font-size: 1.2rem; opacity: 0; transition: all 0.3s; }
        .foro-card:hover .foro-card-arrow { opacity: 1; }
        .foro-btn-gold { background: linear-gradient(135deg, #d4af37, #b8962e); color: #0a0a0a; border: none; padding: 12px 30px; border-radius: 50px; font-family: 'Cinzel', serif; font-size: 0.9rem; font-weight: 600; cursor: pointer; transition: all 0.3s; }
        .foro-btn-gold:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 10px 30px rgba(212,175,55,0.3); }
        .foro-btn-gold:disabled { opacity: 0.5; cursor: not-allowed; }
        @media (max-width: 600px) {
          .foro-header { padding: 1.5rem; }
          .foro-busqueda, .foro-lista, .foro-nuevo-form { padding-left: 1rem; padding-right: 1rem; }
          .foro-categorias-premium { padding-left: 1rem; padding-right: 1rem; }
          .foro-nuevo-btn { width: calc(100% - 2rem); }
          .foro-card { padding: 1rem; }
          .foro-card-arrow { display: none; }
        }
      `}</style>
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
  },
  {
    categoria: 'Acceso y Login',
    preguntas: [
      {
        q: '¿Cómo entro a Mi Magia?',
        a: 'Para entrar solo necesitás tu email. Vas a /mi-magia, ponés tu email, y te enviamos un "enlace mágico" que te permite entrar sin contraseña. El enlace es válido por 30 minutos.'
      },
      {
        q: '¿Por qué no usan contraseña?',
        a: 'Usamos "Magic Link" (enlace mágico) porque es más seguro y más fácil. No tenés que recordar ninguna contraseña, no hay riesgo de que te la roben, y es más rápido. Es el mismo sistema que usan apps como Notion y Slack.'
      },
      {
        q: '¿Tengo que pedir el enlace cada vez?',
        a: 'No. Una vez que entrás, quedás conectada por 30 días en ese dispositivo. Solo necesitás pedir un nuevo enlace si: cambiás de dispositivo, borrás los datos del navegador, o pasaron más de 30 días.'
      },
      {
        q: '¿Y si no me llega el email?',
        a: 'Revisá la carpeta de spam o correo no deseado. Si no está ahí, esperá unos minutos y volvé a intentar. Si sigue sin llegar, escribinos a hola@duendesuy.com'
      },
      {
        q: '¿Es seguro?',
        a: 'Muy seguro. El enlace es único, expira en 30 minutos, y solo funciona una vez. Nadie puede entrar a tu cuenta sin acceso a tu email.'
      }
    ]
  },
  {
    categoria: 'Guía y Tour',
    preguntas: [
      {
        q: '¿Cómo funciona Mi Magia?',
        a: 'Mi Magia es tu portal personal en Duendes del Uruguay. Desde acá podés usar tus runas para experiencias, escribir en tu grimorio, ver tus guardianes adoptados, y acceder al Círculo si sos miembro.',
        esTour: true
      },
      {
        q: '¿Qué puedo hacer con las runas?',
        a: 'Las runas te permiten acceder a experiencias como tiradas de runas, susurros del guardián, oráculos del mes, lecturas del alma y más. Cada experiencia tiene un costo diferente en runas.'
      },
      {
        q: '¿Qué es el Grimorio?',
        a: 'El Grimorio es tu diario mágico personal. Podés escribir tus sueños, reflexiones, rituales que hiciste, y ver el calendario lunar para planificar tus prácticas. Todo queda guardado para siempre.'
      },
      {
        q: '¿Puedo volver a ver el tour de bienvenida?',
        a: 'Sí, podés ver el tour cuando quieras tocando el botón "Ver Tour" más abajo.',
        mostrarBotonTour: true
      }
    ]
  }
];

function FaqSec({ onVerTour }) {
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
                {faq.mostrarBotonTour && onVerTour && (
                  <button className="btn-gold btn-tour-faq" onClick={onVerTour}>
                    ✨ Ver Tour de Mi Magia
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {categoriaAbierta === 'Guía y Tour' && onVerTour && (
        <div className="faq-tour-box">
          <div className="tour-box-content">
            <span className="tour-box-icon">🎓</span>
            <div>
              <h3>¿Primera vez acá?</h3>
              <p>Hacé el tour para conocer todo lo que podés hacer en Mi Magia.</p>
            </div>
          </div>
          <button className="btn-gold" onClick={onVerTour}>
            ✨ Iniciar Tour
          </button>
        </div>
      )}

      <div className="faq-contacto">
        <h3>¿No encontraste lo que buscabas?</h3>
        <p>Escribinos y te ayudamos.</p>
        <a href="https://wa.me/59899123456" target="_blank" rel="noopener" className="btn-gold">
          💬 Contactar por WhatsApp
        </a>
      </div>

      <style jsx>{`
        .btn-tour-faq {
          margin-top: 1rem;
          display: block;
        }
        .faq-tour-box {
          background: linear-gradient(135deg, #1a1a0a 0%, #111 100%);
          border: 1px solid #d4af3740;
          border-radius: 12px;
          padding: 1.5rem;
          margin: 2rem 0;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          flex-wrap: wrap;
        }
        .tour-box-content {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        .tour-box-icon {
          font-size: 2.5rem;
        }
        .tour-box-content h3 {
          margin: 0 0 0.3rem;
          color: #d4af37;
          font-family: 'Cinzel', serif;
          font-size: 1.1rem;
        }
        .tour-box-content p {
          margin: 0;
          color: rgba(255,255,255,0.7);
          font-size: 0.95rem;
        }
        @media (max-width: 500px) {
          .faq-tour-box {
            flex-direction: column;
            text-align: center;
          }
          .tour-box-content {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// TITO
// ═══════════════════════════════════════════════════════════════

// BURBUJA DE SUGERENCIAS DE TITO
function TitoBurbuja({ usuario, onAbrir }) {
  const [sugerencia, setSugerencia] = useState(null);
  const [visible, setVisible] = useState(false);
  const [cerrada, setCerrada] = useState(false);

  useEffect(() => {
    if (!usuario?.email || cerrada) return;

    // Esperar 3 segundos antes de mostrar la burbuja
    const timer = setTimeout(() => {
      cargarSugerencia();
    }, 3000);

    return () => clearTimeout(timer);
  }, [usuario?.email, cerrada]);

  async function cargarSugerencia() {
    try {
      const res = await fetch('/api/tito/sugerencias', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: usuario?.email })
      });
      const data = await res.json();

      if (data.success && data.sugerencias?.length > 0) {
        // Mostrar la primera sugerencia de mayor prioridad
        setSugerencia(data.sugerencias[0]);
        setVisible(true);

        // Ocultar después de 15 segundos
        setTimeout(() => {
          setVisible(false);
        }, 15000);
      }
    } catch (err) {
      console.error('Error cargando sugerencias:', err);
    }
  }

  function cerrarBurbuja() {
    setVisible(false);
    setCerrada(true);
  }

  function handleClick() {
    cerrarBurbuja();
    onAbrir();
  }

  if (!visible || !sugerencia) return null;

  return (
    <div className="tito-burbuja" onClick={handleClick}>
      <button className="burbuja-cerrar" onClick={(e) => { e.stopPropagation(); cerrarBurbuja(); }}>✕</button>
      <div className="burbuja-contenido">
        <span className="burbuja-avatar">
          <img src={TITO_IMG} alt="Tito" onError={e => e.target.style.display='none'} />
        </span>
        <div className="burbuja-mensaje">
          <p>{sugerencia.mensaje}</p>
          {sugerencia.producto && (
            <span className="burbuja-tag">{sugerencia.producto.tipo === 'experiencia' ? `${sugerencia.producto.precio} runas` : `$${sugerencia.producto.precio}`}</span>
          )}
        </div>
      </div>
      <style jsx>{`
        .tito-burbuja {
          position: fixed;
          bottom: 140px;
          right: 1.5rem;
          max-width: 280px;
          background: linear-gradient(135deg, #1a1a1a, #2a2a2a);
          border: 1px solid rgba(212, 175, 55, 0.3);
          border-radius: 15px;
          padding: 12px 15px;
          cursor: pointer;
          z-index: 998;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
          animation: burbujaEntrar 0.5s ease;
        }
        @keyframes burbujaEntrar {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.9);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .burbuja-cerrar {
          position: absolute;
          top: -8px;
          right: -8px;
          width: 24px;
          height: 24px;
          background: #333;
          border: 1px solid #555;
          border-radius: 50%;
          color: #999;
          font-size: 12px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .burbuja-cerrar:hover {
          background: #444;
          color: #fff;
        }
        .burbuja-contenido {
          display: flex;
          gap: 10px;
          align-items: flex-start;
        }
        .burbuja-avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: #d4af37;
          flex-shrink: 0;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .burbuja-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .burbuja-mensaje {
          flex: 1;
        }
        .burbuja-mensaje p {
          color: #FDF8F0;
          font-size: 13px;
          line-height: 1.4;
          margin: 0;
          font-family: 'Cormorant Garamond', serif;
        }
        .burbuja-tag {
          display: inline-block;
          margin-top: 6px;
          background: rgba(212, 175, 55, 0.2);
          color: #d4af37;
          font-size: 11px;
          padding: 3px 8px;
          border-radius: 10px;
        }
        @media (max-width: 768px) {
          .tito-burbuja {
            bottom: 130px;
            right: 10px;
            max-width: 250px;
          }
        }
      `}</style>
    </div>
  );
}

function Tito({ usuario, abierto, setAbierto }) {
  const [msgs, setMsgs] = useState([]);
  const [input, setInput] = useState('');
  const [env, setEnv] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const check = () => setIsMobile(window.innerWidth <= 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const enviar = async () => {
    if (!input.trim() || env) return;
    const m = input.trim(); setInput('');
    const nuevosMsgs = [...msgs, { r: 'u', t: m }];
    setMsgs(nuevosMsgs); setEnv(true);
    try {
      const historial = nuevosMsgs.slice(-10).map(msg => ({
        role: msg.r === 'u' ? 'user' : 'assistant',
        content: msg.t
      }));
      const contexto = `[CONTEXTO MI MAGIA: Usuario con ${usuario?.runas||0} runas, ${usuario?.treboles||0} tréboles. Secciones: Canalizaciones (guardianes, lecturas, regalos), Jardín Mágico (tréboles/runas), Experiencias (lecturas mágicas), Regalos, Reino Elemental, Cuidados, Cristales, Círculo (membresía), Grimorio (lecturas y diario). 1 trébol = $10 USD. Runas para experiencias.]
IMPORTANTE: Mantené el contexto de la conversación. Si el usuario dice "ayudame" o "sí" o "dale", referite a lo que acabás de decir/ofrecer.
FORMATO: Usá párrafos cortos separados por líneas en blanco. NO escribas todo junto. Hacé el texto fácil de leer.
Mensaje actual: ${m}`;
      const res = await fetch(`${API_BASE}/api/tito/chat`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message: contexto, email: usuario?.email, history: historial }) });
      const data = await res.json();
      setMsgs(prev => [...prev, { r: 't', t: data.response || 'Hubo un error, intentá de nuevo.' }]);
    } catch(e) { setMsgs(prev => [...prev, { r: 't', t: 'Error de conexión.' }]); }
    setEnv(false);
  };

  // ESTILOS FORZADOS PARA MÓVIL - Sin depender de CSS externo
  const mobile = mounted && isMobile;
  const btnStyle = {
    position: 'fixed',
    bottom: mobile ? '12px' : '1.5rem',
    right: mobile ? '12px' : '1.5rem',
    width: mobile ? '52px' : '60px',
    height: mobile ? '52px' : '60px',
    borderRadius: '50%',
    background: '#1a1a1a',
    border: '2px solid #d4af37',
    cursor: 'pointer',
    overflow: 'hidden',
    boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
    zIndex: 1000,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    touchAction: 'manipulation',
    WebkitTapHighlightColor: 'transparent'
  };
  // CHAT: Ancho fijo calculado para no causar overflow
  const screenWidth = typeof window !== 'undefined' ? window.innerWidth : 400;
  const chatWidth = mobile ? Math.min(screenWidth - 20, 380) : 340;
  const chatStyle = {
    position: 'fixed',
    zIndex: 999,
    background: '#fff',
    borderRadius: '12px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    boxSizing: 'border-box',
    bottom: mobile ? '70px' : '6rem',
    right: mobile ? '10px' : '1.5rem',
    width: `${chatWidth}px`,
    maxWidth: mobile ? 'calc(100vw - 20px)' : '340px',
    maxHeight: mobile ? '50vh' : '450px'
  };
  // MENSAJES: Forzar saltos de línea
  const msgStyle = {
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
    lineHeight: '1.6',
    margin: 0,
    fontSize: mobile ? '0.85rem' : '0.9rem'
  };

  return (
    <>
      <button
        style={btnStyle}
        onClick={() => setAbierto(!abierto)}
        onTouchEnd={(e) => { e.preventDefault(); setAbierto(!abierto); }}
        aria-label="Abrir chat con Tito"
      >
        <img src={TITO_IMG} alt="Tito" style={{width:'100%',height:'100%',objectFit:'cover',position:'absolute'}} onError={e => e.target.style.display='none'} />
        <span style={{fontFamily:'Cinzel,serif',fontSize:'1.5rem',color:'#d4af37'}}>T</span>
      </button>
      {abierto && (
        <div style={chatStyle}>
          <div className="tito-head" style={{padding: mobile ? '0.6rem' : '1rem', background:'#1a1a1a', display:'flex', alignItems:'center', gap:'0.75rem'}}>
            <img src={TITO_IMG} alt="" style={{width: mobile ? '28px' : '36px', height: mobile ? '28px' : '36px', borderRadius:'50%',objectFit:'cover'}} onError={e => e.target.style.display='none'} />
            <div style={{flex:1}}><strong style={{display:'block',color:'#d4af37',fontFamily:'Cinzel,serif',fontSize:'0.9rem'}}>Tito</strong><small style={{fontSize:'0.75rem',color:'rgba(255,255,255,0.6)'}}>Tu guía</small></div>
            <button onClick={() => setAbierto(false)} onTouchEnd={(e) => { e.preventDefault(); setAbierto(false); }} style={{background:'none',border:'none',color:'rgba(255,255,255,0.5)',fontSize:'1.1rem',cursor:'pointer',padding:'8px'}}>✕</button>
          </div>
          <div style={{flex:1,padding: mobile ? '0.6rem' : '1rem',overflowY:'auto',display:'flex',flexDirection:'column',gap:'0.6rem',maxHeight: mobile ? '35vh' : '300px', background:'#fff'}}>
            <div style={{background:'#f5f5f5',padding:'0.6rem 0.9rem',borderRadius:'12px',maxWidth:'85%',alignSelf:'flex-start'}}><p style={msgStyle}>¡Hola {usuario?.nombrePreferido}! Soy Tito. Preguntame lo que necesites.</p></div>
            {msgs.map((m,i) => <div key={i} style={{background: m.r==='u' ? '#1a1a1a' : '#f5f5f5', color: m.r==='u' ? '#fff' : '#1a1a1a', padding:'0.6rem 0.9rem', borderRadius:'12px', maxWidth:'85%', alignSelf: m.r==='u' ? 'flex-end' : 'flex-start'}}><p style={msgStyle}>{m.t}</p></div>)}
            {env && <div style={{background:'#f5f5f5',padding:'0.6rem 0.9rem',borderRadius:'12px',maxWidth:'85%',alignSelf:'flex-start'}}><p style={msgStyle}>...</p></div>}
          </div>
          <div style={{display:'flex',gap:'0.5rem',padding: mobile ? '0.5rem' : '0.75rem',borderTop:'1px solid #f0f0f0',background:'#fff'}}>
            <input placeholder="Tu pregunta..." value={input} onChange={e => setInput(e.target.value)} onKeyPress={e => e.key==='Enter' && enviar()} style={{flex:1,padding:'0.6rem 1rem',border:'1px solid #e0e0e0',borderRadius:'50px',fontSize:'16px',fontFamily:'Cormorant Garamond,serif'}} />
            <button onClick={enviar} disabled={env} style={{width:'36px',height:'36px',borderRadius:'50%',background:env?'#ddd':'#d4af37',border:'none',color:'#1a1a1a',fontSize:'1.1rem',cursor:env?'not-allowed':'pointer'}}>→</button>
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
*{margin:0;padding:0;box-sizing:border-box!important}

/* ═══════════════════════════════════════════════════════════════ */
/* ANIMACIONES PROFESIONALES */
/* ═══════════════════════════════════════════════════════════════ */

/* Fade In al cargar */
@keyframes fadeInUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
@keyframes pulse-glow{0%,100%{box-shadow:0 0 20px rgba(212,175,55,0.2)}50%{box-shadow:0 0 40px rgba(212,175,55,0.4)}}
@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}

/* Clases de animación */
.animate-fade-in{animation:fadeIn 0.5s ease-out forwards}
.animate-fade-in-up{animation:fadeInUp 0.6s ease-out forwards}
.animate-delay-1{animation-delay:0.1s;opacity:0}
.animate-delay-2{animation-delay:0.2s;opacity:0}
.animate-delay-3{animation-delay:0.3s;opacity:0}
.animate-delay-4{animation-delay:0.4s;opacity:0}

/* Hover premium para cards */
.hover-lift{transition:all 0.3s cubic-bezier(0.4,0,0.2,1)}
.hover-lift:hover{transform:translateY(-5px);box-shadow:0 20px 40px rgba(0,0,0,0.15)}

/* Shimmer dorado en botones */
.btn-shimmer{position:relative;overflow:hidden}
.btn-shimmer::after{content:'';position:absolute;top:0;left:-200%;width:200%;height:100%;background:linear-gradient(90deg,transparent,rgba(255,255,255,0.2),transparent);transition:none}
.btn-shimmer:hover::after{animation:shimmer 1.5s ease-in-out}

/* Efecto glow dorado */
.glow-gold{transition:box-shadow 0.3s ease}
.glow-gold:hover{box-shadow:0 0 30px rgba(212,175,55,0.4)}

/* Transiciones suaves globales */
.sec{animation:fadeIn 0.4s ease-out}
.stat-c,.acceso,.exp-card-new,.cristal-card,.tipo-card,.ritual-card,.util-card{transition:all 0.3s cubic-bezier(0.4,0,0.2,1)}
.stat-c:hover,.acceso:hover,.exp-card-new:hover,.cristal-card:hover,.tipo-card:hover,.ritual-card:hover,.util-card:hover{transform:translateY(-5px);box-shadow:0 15px 35px rgba(212,175,55,0.15)}

/* Acordeón animado */
.faq-item{transition:all 0.3s ease}
.faq-respuesta{animation:fadeIn 0.3s ease-out}

/* Botones con efecto premium */
.btn-gold,.btn-pri{transition:all 0.3s cubic-bezier(0.4,0,0.2,1);position:relative;overflow:hidden}
.btn-gold::before{content:'';position:absolute;top:50%;left:50%;width:0;height:0;background:rgba(255,255,255,0.2);border-radius:50%;transform:translate(-50%,-50%);transition:width 0.4s ease,height 0.4s ease}
.btn-gold:hover::before{width:300px;height:300px}
.btn-gold:hover{transform:translateY(-2px);box-shadow:0 10px 30px rgba(212,175,55,0.35)}

/* Cards del banner con animación secuencial */
.banner{animation:fadeInUp 0.5s ease-out}
.stats-g .stat-c:nth-child(1){animation:fadeInUp 0.5s ease-out 0.1s forwards;opacity:0}
.stats-g .stat-c:nth-child(2){animation:fadeInUp 0.5s ease-out 0.2s forwards;opacity:0}
.stats-g .stat-c:nth-child(3){animation:fadeInUp 0.5s ease-out 0.3s forwards;opacity:0}
.stats-g .stat-c:nth-child(4){animation:fadeInUp 0.5s ease-out 0.4s forwards;opacity:0}

/* Scroll reveal para secciones */
.accesos-g .acceso:nth-child(1){animation:fadeInUp 0.5s ease-out 0.15s forwards;opacity:0}
.accesos-g .acceso:nth-child(2){animation:fadeInUp 0.5s ease-out 0.25s forwards;opacity:0}
.accesos-g .acceso:nth-child(3){animation:fadeInUp 0.5s ease-out 0.35s forwards;opacity:0}
input,textarea,select{font-size:16px!important;color:#1a1a1a!important}
input::placeholder,textarea::placeholder{color:#888!important}
.circulo-dark-onboarding input,.circulo-dark-onboarding textarea,.circulo-dark-dashboard input,.circulo-dark-dashboard textarea,.exp-formulario input,.exp-formulario textarea,.buscar-input,.foro-dark input,.foro-dark textarea{color:#FDF8F0!important;background:#1a1a1a!important;border-color:#333!important}
.circulo-dark-onboarding input::placeholder,.circulo-dark-onboarding textarea::placeholder,.circulo-dark-dashboard input::placeholder,.circulo-dark-dashboard textarea::placeholder,.exp-formulario input::placeholder,.exp-formulario textarea::placeholder{color:#888!important}
.circulo-dark-onboarding h1,.circulo-dark-onboarding h2,.circulo-dark-onboarding h3,.circulo-dark-onboarding h4,.circulo-dark-onboarding label,.circulo-dark-dashboard h1,.circulo-dark-dashboard h2,.circulo-dark-dashboard h3,.circulo-dark-dashboard h4{color:#FDF8F0!important}
.ciclo-titulo,.faq-pregunta-texto,.faq-card h3,.faq-card h4{color:#FDF8F0!important}
html{overflow-x:hidden!important;width:100%!important;max-width:100%!important}
body{overflow-x:hidden!important;width:100%!important;max-width:100%!important;font-family:'Cormorant Garamond',Georgia,serif;background:#FFFEF9;color:#1a1a1a;font-size:18px;line-height:1.6;position:relative}
.app{min-height:100vh;overflow-x:hidden!important;width:100%!important;box-sizing:border-box}
.sec{overflow-x:hidden!important;word-wrap:break-word;box-sizing:border-box}
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
.contenido{margin-left:240px;margin-top:65px;min-height:calc(100vh - 65px);width:calc(100% - 240px);overflow-x:hidden;padding-right:1rem}
.sec{padding:2rem;max-width:1200px;margin:0 auto;box-sizing:border-box;width:100%}
.sec-head{margin-bottom:2rem}
.sec-head h1{font-family:'Cinzel',serif;font-size:1.8rem;font-weight:500;margin-bottom:0.5rem}
.sec-head p{color:#666}
.sec-titulo{font-family:'Cinzel',serif;font-size:1.2rem;font-weight:500;margin:2rem 0 1rem}
.banner{background:#1a1a1a;border-radius:16px;padding:2.5rem;margin-bottom:2rem;position:relative}
.banner-rango{display:flex;align-items:center;gap:1rem;margin-bottom:1rem}
.rango-icono{font-size:2.5rem}
.rango-info{display:flex;flex-direction:column}
.rango-nombre{font-family:'Cinzel',serif;color:#d4af37;font-size:1rem}
.rango-ben{font-size:0.8rem;color:rgba(255,255,255,0.85)}
.progreso-rango{margin-top:1.5rem}
.progreso-bar{height:6px;background:rgba(255,255,255,0.2);border-radius:3px;overflow:hidden}
.progreso-fill{height:100%;background:linear-gradient(90deg,#d4af37,#f4d03f);border-radius:3px;transition:width 0.5s}
.progreso-rango small{display:block;margin-top:0.5rem;color:rgba(255,255,255,0.8);font-size:0.75rem}
.banner h1{font-family:'Cinzel',serif;font-size:1.8rem;color:#fff;margin-bottom:0.5rem}
.banner p{color:rgba(255,255,255,0.9)}
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
.banner-circ p{color:rgba(255,255,255,0.9);font-size:0.85rem}
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
.ritual-duracion{font-size:0.8rem;color:rgba(255,255,255,0.9)}
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
.cristales-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:1.5rem}
.cristal-card{background:#fff;border:1px solid #f0f0f0;border-radius:20px;padding:0;text-align:center;overflow:hidden;transition:all 0.3s;cursor:pointer;box-shadow:0 4px 15px rgba(0,0,0,0.05)}
.cristal-card:hover{border-color:#d4af37;transform:translateY(-5px);box-shadow:0 12px 35px rgba(212,175,55,0.2)}
.cristal-img{width:100%;height:280px;object-fit:cover;background:linear-gradient(135deg,#f8f4eb,#fff)}
.cristal-img-placeholder{width:100%;height:280px;display:flex;align-items:center;justify-content:center;font-size:5rem;background:linear-gradient(135deg,#f8f4eb,#fff)}
.cristal-body{padding:1.5rem}
.cristal-card h4{font-family:'Cinzel',serif;font-size:1.3rem;margin-bottom:0.75rem;color:#1a1a1a}
.cristal-props{font-size:1rem;color:#d4af37;margin-bottom:1rem;line-height:1.5}
.cristal-cuidado{font-size:0.85rem;color:#666;background:#f8f8f8;padding:0.6rem 1rem;border-radius:10px;display:inline-block}
.circulo-landing{text-align:center}
.circulo-hero{background:linear-gradient(135deg,#1a1a1a,#2a2a2a);border-radius:16px;padding:2.5rem;margin-bottom:2rem}
.circulo-hero span{font-size:3rem;color:#d4af37}
.circulo-hero h1{font-family:'Cinzel',serif;color:#fff;font-size:2rem;margin:0.75rem 0 0.5rem}
.circulo-hero p{color:rgba(255,255,255,0.9)}
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
.circulo-header-int p{color:rgba(255,255,255,0.9);font-size:0.9rem}
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
.tito-chat{position:fixed;bottom:6rem;right:1rem;left:1rem;width:auto;max-width:340px;max-height:450px;height:60vh;background:#fff;border-radius:16px;box-shadow:0 8px 32px rgba(0,0,0,0.15);display:flex;flex-direction:column;z-index:999;overflow:hidden;margin-left:auto}
.tito-head{display:flex;align-items:center;gap:0.75rem;padding:1rem;background:#1a1a1a}
.tito-av{width:36px;height:36px;border-radius:50%;object-fit:cover}
.tito-head div{flex:1}
.tito-head strong{display:block;color:#d4af37;font-family:'Cinzel',serif;font-size:0.9rem}
.tito-head small{font-size:0.75rem;color:rgba(255,255,255,0.85)}
.tito-head button{background:none;border:none;color:rgba(255,255,255,0.8);font-size:1.1rem;cursor:pointer}
.tito-msgs{flex:1;padding:1rem;overflow-y:auto;display:flex;flex-direction:column;gap:0.6rem}
.msg-t,.msg-u{max-width:85%;padding:0.6rem 0.9rem;border-radius:12px;white-space:pre-wrap;word-break:break-word;line-height:1.5}
.msg-t{background:#f5f5f5;align-self:flex-start}
.msg-t p,.msg-u p{margin:0;white-space:pre-wrap}
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
@media(max-width:1100px){.stats-g,.beneficios-grid,.membresias-grid{grid-template-columns:repeat(2,1fr)}.cristales-grid{grid-template-columns:repeat(2,1fr)}.exp-grid,.elementos-grid,.regalos-grid,.grim-intro-cards{grid-template-columns:1fr}.canjes-grid,.packs-grid{grid-template-columns:repeat(2,1fr)}.info-grid,.benef-grid-int,.fases-mes{grid-template-columns:1fr}}
@media(max-width:900px){.menu-btn{display:flex!important;background:#d4af37!important;border:none!important}.menu-btn span{background:#fff!important}.header{padding:0 0.75rem!important}.nav-overlay{display:block!important}.nav{transform:translateX(-100%)!important;transition:transform 0.3s}.nav.abierto{transform:translateX(0)!important;box-shadow:4px 0 20px rgba(0,0,0,0.15)}.contenido{margin-left:0!important;width:100%!important;padding:0 0.5rem!important}.user-info{display:none!important}.logo{font-size:0.85rem!important}.hstats{gap:0.4rem!important}.hstats span{padding:0.15rem 0.4rem!important;font-size:0.7rem!important}}
@media(max-width:768px){.sec{padding:1rem}.banner{padding:1.5rem}.banner h1{font-size:1.4rem}.stats-g,.balances,.accesos-g{grid-template-columns:1fr}.canjes-grid,.packs-grid,.items-grid{grid-template-columns:1fr}.tabs-h{flex-direction:column}.exp-d-cta{flex-direction:column;gap:1rem;text-align:center}.cristales-grid{grid-template-columns:1fr}.cristal-img,.cristal-img-placeholder{height:220px}}

/* ═══════════════════════════════════════════════════════════════
   LUNA CALENDAR STYLES - PREMIUM
   ═══════════════════════════════════════════════════════════════ */
.cargando-mini{text-align:center;padding:2rem;color:#888;font-style:italic}
.luna-preview{background:linear-gradient(135deg,#1a1a1a,#2a2a2a);border-radius:12px;padding:1.5rem;margin-bottom:2rem;display:flex;align-items:center;justify-content:space-between}
.luna-mini{display:flex;align-items:center;gap:1rem}
.luna-emoji{font-size:2.5rem}
.luna-mini strong{color:#d4af37;font-family:'Cinzel',serif}
.luna-mini p{color:rgba(255,255,255,0.9);font-size:0.9rem;margin:0}
.luna-hero{display:grid;grid-template-columns:repeat(2,1fr);gap:1.5rem;margin-bottom:2rem}
.luna-fase-grande{background:#1a1a1a;border-radius:16px;padding:1.5rem;display:flex;align-items:center;gap:1.25rem}
.luna-emoji-lg{font-size:4rem}
.luna-fase-grande h3{font-family:'Cinzel',serif;color:#d4af37;margin-bottom:0.25rem}
.luna-energia{color:rgba(255,255,255,0.8);font-size:0.95rem;margin:0}
.luna-fase-grande small{color:rgba(255,255,255,0.8);font-size:0.8rem}
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
.senal-accion,.senal-cristal,.senal-numero-significado{text-align:center;padding:10px;background:#0a0a0a;border-radius:8px;color:#fff!important}
.senal-accion p,.senal-cristal p,.senal-numero-significado p,.senal-accion small,.senal-cristal small{color:#fff!important}
.senal-accion strong,.senal-cristal strong{display:block;color:#d4af37;font-size:0.8rem;margin-bottom:5px}
.senal-cristal span{font-size:1.5rem}
.senal-numero-significado span{display:block;font-size:1.5rem;color:#d4af37}
.senal-numero-significado small{font-size:0.75rem;color:#fff!important}
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
.cosmos-header p{color:#ddd}
.cosmos-tabs{display:grid;grid-template-columns:repeat(4,1fr);gap:5px;margin-bottom:20px}
.cosmos-tab{display:flex;flex-direction:column;align-items:center;gap:5px;padding:12px;background:#1f1f1f;border:none;border-radius:10px;color:#888;cursor:pointer;transition:all 0.2s}
.cosmos-tab span{font-size:1.2rem}
.cosmos-tab.activo{background:#d4af3722;color:#d4af37}
.luna-actual{display:flex;align-items:center;gap:20px;background:#0a0a0a;padding:20px;border-radius:16px;margin-bottom:20px}
.luna-emoji-xl{font-size:4rem}
.luna-actual h3{color:#fff;margin:0 0 5px}
.luna-actual p{color:#ccc;margin:0}
.luna-actual small{color:#fff}
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
.cristal-chakra,.cristal-ritual{background:#1f1f1f;padding:15px;border-radius:12px;margin-bottom:15px;color:#fff!important}
.cristal-ritual h4,.cristal-chakra h4{color:#d4af37}
.cristal-ritual p,.cristal-chakra p{color:#fff!important}
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
.faq-contacto p{color:rgba(255,255,255,0.9);margin-bottom:1.5rem}

@media(max-width:768px){.senal-footer{grid-template-columns:1fr}.elementos-preview{grid-template-columns:repeat(2,1fr)}.cosmos-tabs{grid-template-columns:repeat(2,1fr)}.cristales-grid{grid-template-columns:repeat(2,1fr)}.experiencias-grid-new{grid-template-columns:1fr}.utils-grid{grid-template-columns:repeat(2,1fr)}.foro-categorias{overflow-x:auto;flex-wrap:nowrap}.faq-categorias{overflow-x:auto;flex-wrap:nowrap}}
@media(max-width:480px){.utils-grid{grid-template-columns:1fr}}

/* ═══════════════════════════════════════════════════════════════ */
/* SIDEBAR OPORTUNIDADES MÁGICAS */
/* ═══════════════════════════════════════════════════════════════ */
.sidebar-toggle{position:fixed;right:0;top:50%;transform:translateY(-50%);background:linear-gradient(135deg,#1a1a1a,#2a2a2a);border:none;border-radius:12px 0 0 12px;padding:12px 8px;cursor:pointer;z-index:97;display:flex;flex-direction:column;align-items:center;gap:6px;transition:all 0.3s;box-shadow:-2px 0 15px rgba(0,0,0,0.2)}
.sidebar-toggle:hover{padding-right:12px;background:linear-gradient(135deg,#2a2a2a,#3a3a3a)}
.sidebar-toggle.abierto{right:280px}
.toggle-icon{color:#d4af37;font-size:1.2rem}
.toggle-badge{writing-mode:vertical-rl;text-orientation:mixed;font-size:0.65rem;font-weight:600;color:#d4af37;letter-spacing:1px;font-family:'Cinzel',serif}

.sidebar-oportunidades{position:fixed;right:-280px;top:65px;bottom:0;width:280px;background:linear-gradient(180deg,#fff 0%,#fafafa 100%);border-left:1px solid #e0e0e0;z-index:96;display:flex;flex-direction:column;transition:right 0.3s ease;overflow-y:auto;box-shadow:-4px 0 20px rgba(0,0,0,0.08)}
.sidebar-oportunidades.abierto{right:0}

.sidebar-header{padding:1.5rem;background:linear-gradient(135deg,#1a1a1a,#2a2a2a);text-align:center}
.sidebar-header h3{color:#d4af37;font-family:'Cinzel',serif;font-size:1rem;margin:0 0 0.25rem}
.sidebar-header p{color:rgba(255,255,255,0.8);font-size:0.8rem;margin:0}

.sidebar-card{padding:1.25rem;border-bottom:1px solid #f0f0f0}
.sidebar-card:last-of-type{border-bottom:none}

.circulo-promo{background:linear-gradient(135deg,#f8f4eb 0%,#fff 100%);position:relative}
.promo-badge{position:absolute;top:10px;right:10px;background:#d4af37;color:#1a1a1a;font-size:0.65rem;font-weight:700;padding:3px 8px;border-radius:4px;font-family:'Cinzel',serif}
.promo-icon{display:block;font-size:2.5rem;color:#d4af37;margin-bottom:0.75rem}
.sidebar-card h4{font-family:'Cinzel',serif;font-size:1rem;margin:0 0 0.5rem;color:#1a1a1a}
.sidebar-card p{font-size:0.85rem;color:#666;margin:0 0 1rem}
.promo-beneficios{list-style:none;padding:0;margin:0 0 1rem}
.promo-beneficios li{font-size:0.8rem;color:#555;padding:0.25rem 0;border-bottom:1px dashed #e0e0e0}
.promo-beneficios li:last-child{border-bottom:none}

.btn-promo{width:100%;padding:12px;background:linear-gradient(135deg,#d4af37,#b8962e);border:none;border-radius:8px;color:#1a1a1a;font-family:'Cinzel',serif;font-weight:600;font-size:0.9rem;cursor:pointer;transition:all 0.2s}
.btn-promo:hover{transform:translateY(-1px);box-shadow:0 4px 12px rgba(212,175,55,0.3)}

.circulo-activo{background:linear-gradient(135deg,#f0fff0,#fff);text-align:center}
.circulo-activo h4{color:#2a7a2a}

.btn-outline{padding:10px 16px;background:transparent;border:1px solid #d4af37;border-radius:6px;color:#d4af37;font-size:0.85rem;cursor:pointer;transition:all 0.2s}
.btn-outline:hover{background:#d4af3711}

.oferta-mini{display:flex;align-items:center;gap:10px;margin-bottom:0.75rem}
.oferta-mini span:first-child{font-size:1.5rem;color:#d4af37;width:35px;text-align:center}
.oferta-mini div{flex:1}
.oferta-mini strong{display:block;font-size:0.9rem;color:#1a1a1a}
.oferta-mini p{margin:0;font-size:0.75rem;color:#888}
.oferta-mini .precio{font-family:'Cinzel',serif;font-weight:600;color:#d4af37}

.btn-outline-sm{padding:8px 12px;background:transparent;border:1px solid #ddd;border-radius:6px;color:#666;font-size:0.8rem;cursor:pointer;transition:all 0.2s;text-decoration:none;display:inline-block;text-align:center}
.btn-outline-sm:hover{border-color:#d4af37;color:#d4af37}

.sidebar-footer{padding:1.25rem;background:#fafafa;margin-top:auto;text-align:center}
.sidebar-footer p{font-size:0.8rem;color:#888;margin:0 0 0.75rem}
.btn-tito{padding:10px 16px;background:#1a1a1a;border:none;border-radius:8px;color:#fff;font-size:0.85rem;cursor:pointer;transition:all 0.2s}
.btn-tito:hover{background:#2a2a2a}

.contenido.con-sidebar{width:calc(100% - 240px - 280px);padding-right:1rem}

/* ═══════════════════════════════════════════════════════════════ */
/* BANNER PROMOCIONES EN INICIO */
/* ═══════════════════════════════════════════════════════════════ */
.banner-promo{display:flex;align-items:center;gap:1rem;background:linear-gradient(135deg,#f5e6d3,#fff5eb);border:2px solid #d4af37;border-radius:12px;padding:1rem 1.5rem;cursor:pointer;transition:all 0.2s;margin-top:1rem}
.banner-promo:hover{background:linear-gradient(135deg,#ffe4c4,#fff5eb);transform:translateY(-2px);box-shadow:0 4px 15px rgba(212,175,55,0.2)}
.promo-icon-banner{font-size:2rem}
.promo-banner-content{flex:1}
.promo-banner-content h3{font-family:'Cinzel',serif;color:#1a1a1a;margin:0 0 0.25rem;font-size:1rem}
.promo-banner-content p{color:#666;margin:0;font-size:0.85rem}
.promo-arrow{font-size:1.5rem;color:#d4af37}

/* ═══════════════════════════════════════════════════════════════ */
/* SECCIÓN PROMOCIONES MÁGICAS */
/* ═══════════════════════════════════════════════════════════════ */
.promos-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:1.5rem;margin-bottom:2rem}
.promo-card{background:#fff;border:1px solid #f0f0f0;border-radius:16px;padding:1.5rem;transition:all 0.2s;position:relative;overflow:hidden}
.promo-card:hover{border-color:var(--promo-color,#d4af37);box-shadow:0 8px 25px rgba(0,0,0,0.08)}
.promo-card::before{content:'';position:absolute;top:0;left:0;right:0;height:4px;background:var(--promo-color,#d4af37)}
.promo-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:1rem}
.promo-icono{font-size:2rem;color:var(--promo-color,#d4af37)}
.promo-badge-card{background:var(--promo-color,#d4af37);color:#fff;padding:4px 10px;border-radius:20px;font-size:0.75rem;font-weight:600}
.promo-card h3{font-family:'Cinzel',serif;color:#1a1a1a;margin:0 0 0.75rem;font-size:1.2rem}
.promo-desc{color:#666;font-size:0.9rem;line-height:1.5;margin:0 0 1rem}
.promo-beneficios-list{list-style:none;padding:0;margin:0 0 1.5rem}
.promo-beneficios-list li{padding:0.4rem 0;color:#555;font-size:0.85rem}
.promo-beneficios-list li::before{content:'';display:none}
.empty-promos{text-align:center;padding:3rem;background:#fafafa;border-radius:12px}
.empty-promos span{font-size:3rem;display:block;margin-bottom:1rem}
.empty-promos h3{font-family:'Cinzel',serif;color:#1a1a1a;margin:0 0 0.5rem}
.empty-promos p{color:#666}
.promo-info-box{background:linear-gradient(135deg,#f8f8f8,#fff);border:1px solid #e0e0e0;border-radius:12px;padding:1.5rem;margin-top:1.5rem}
.promo-info-box h4{font-family:'Cinzel',serif;color:#d4af37;margin:0 0 0.5rem;font-size:1rem}
.promo-info-box p{color:#666;font-size:0.9rem;margin:0}

@media(max-width:768px){.promos-grid{grid-template-columns:1fr}.banner-promo{flex-direction:column;text-align:center}.promo-arrow{display:none}}

/* ═══════════════════════════════════════════════════════════════ */
/* LOS ELEGIDOS - CINEMATICO */
/* ═══════════════════════════════════════════════════════════════ */
.elegidos-cinematic{background:linear-gradient(180deg,#0d0d0d 0%,#1a1510 50%,#0d0d0d 100%);border-radius:20px;padding:3rem 2rem;margin-top:2rem;color:#fff;position:relative;overflow:hidden}
.elegidos-cinematic::before{content:'';position:absolute;inset:0;background:url("data:image/svg+xml,%3Csvg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");opacity:0.03;pointer-events:none}

/* Titulo principal */
.elegidos-titulo{text-align:center;margin-bottom:1.5rem;position:relative;z-index:1}
.titulo-pre{display:block;font-size:0.85rem;color:rgba(255,255,255,0.5);letter-spacing:2px;margin-bottom:0.5rem}
.elegidos-titulo h2{font-family:'Cinzel',serif;font-size:2.2rem;color:#d4af37;letter-spacing:6px;text-transform:uppercase;margin:0;text-shadow:0 0 40px rgba(212,175,55,0.3)}

/* Portal animado */
.elegidos-portal{display:flex;justify-content:center;margin-bottom:2rem;position:relative}
.portal-glow{position:absolute;width:120px;height:120px;background:radial-gradient(circle,rgba(212,175,55,0.3) 0%,transparent 70%);border-radius:50%;animation:portalPulse 4s ease-in-out infinite}
@keyframes portalPulse{0%,100%{transform:scale(1);opacity:0.5}50%{transform:scale(1.3);opacity:0.8}}
.portal-runa{font-size:4rem;color:#d4af37;text-shadow:0 0 40px rgba(212,175,55,0.6);position:relative;z-index:1;animation:runaFloat 6s ease-in-out infinite}
@keyframes runaFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}

/* Historia - Escenas cinematográficas */
.elegidos-story{max-width:650px;margin:0 auto}
.story-scene{margin-bottom:2.5rem;opacity:0;animation:sceneReveal 1.2s ease-out forwards}
.scene-1{animation-delay:0.3s}
.scene-2{animation-delay:0.6s}
.scene-3{animation-delay:0.9s}
.scene-final{animation-delay:1.2s}
@keyframes sceneReveal{0%{opacity:0;transform:translateY(15px)}100%{opacity:1;transform:translateY(0)}}
.story-scene p{font-size:1.05rem;line-height:1.9;color:rgba(255,255,255,0.7);margin-bottom:1rem}
.story-scene p:last-child{margin-bottom:0}
.story-scene em{color:#d4af37;font-style:italic}
.scene-visual{font-family:'Cinzel',serif!important;font-size:1.4rem!important;color:#fff!important;letter-spacing:1px;margin-bottom:1.25rem!important}
.scene-pause{font-style:italic;color:rgba(255,255,255,0.5)!important;margin-top:0.5rem!important}
.scene-quote{font-style:italic;padding-left:1.5rem;border-left:2px solid rgba(212,175,55,0.3);margin:0.75rem 0!important;color:rgba(255,255,255,0.6)!important}
.scene-revelation{font-family:'Cinzel',serif!important;font-size:1.15rem!important;color:#d4af37!important;text-align:center;line-height:1.8!important;letter-spacing:0.5px}
.scene-direct{text-align:center;color:rgba(255,255,255,0.8)!important;margin-top:1.5rem!important;font-size:1rem!important}

/* Divisor */
.story-divider{display:flex;justify-content:center;gap:1rem;margin:2rem 0;opacity:0.4}
.story-divider span{color:#d4af37;font-size:0.6rem}

/* Reveal quote */
.story-reveal{display:flex;align-items:center;gap:1.5rem;margin:2.5rem 0;padding:1.5rem 0}
.reveal-line{flex:1;height:1px;background:linear-gradient(90deg,transparent,rgba(212,175,55,0.4),transparent)}
.reveal-text{font-family:'Cinzel',serif;font-size:1rem;color:#d4af37;text-align:center;white-space:nowrap;letter-spacing:1px}

/* Sello personal */
.elegidos-seal{display:flex;align-items:center;justify-content:center;gap:1.5rem;padding:1.5rem;background:rgba(212,175,55,0.08);border:1px solid rgba(212,175,55,0.2);border-radius:12px;margin:2rem auto;max-width:400px}
.seal-symbol{font-size:2.5rem;color:#d4af37;text-shadow:0 0 20px rgba(212,175,55,0.4)}
.seal-text{display:flex;flex-direction:column;gap:0.25rem}
.seal-title{font-family:'Cinzel',serif;font-size:0.65rem;letter-spacing:3px;color:rgba(255,255,255,0.5);text-transform:uppercase}
.seal-name{font-family:'Cinzel',serif;font-size:1.2rem;color:#d4af37;letter-spacing:2px}
.seal-date{font-size:0.75rem;color:rgba(255,255,255,0.4);font-style:italic}

/* Explorar caminos */
.elegidos-explore{margin-top:2.5rem;text-align:center}
.elegidos-explore>p{font-size:0.9rem;color:rgba(255,255,255,0.5);margin-bottom:1.5rem;font-style:italic}
.explore-paths{display:grid;grid-template-columns:repeat(2,1fr);gap:1rem}
.path-link{display:flex;flex-direction:column;align-items:center;padding:1.25rem;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:12px;text-decoration:none;transition:all 0.3s;position:relative;overflow:hidden}
.path-link::before{content:'';position:absolute;inset:0;opacity:0;transition:opacity 0.3s}
.path-link:hover{transform:translateY(-3px);border-color:rgba(255,255,255,0.15)}
.path-link:hover::before{opacity:1}
.path-proteccion::before{background:radial-gradient(ellipse at center,rgba(74,144,217,0.15) 0%,transparent 70%)}
.path-amor::before{background:radial-gradient(ellipse at center,rgba(233,30,140,0.15) 0%,transparent 70%)}
.path-abundancia::before{background:radial-gradient(ellipse at center,rgba(198,169,98,0.15) 0%,transparent 70%)}
.path-sanacion::before{background:radial-gradient(ellipse at center,rgba(46,204,113,0.15) 0%,transparent 70%)}
.path-symbol{font-size:1.5rem;margin-bottom:0.5rem;position:relative;z-index:1}
.path-proteccion .path-symbol{color:#4A90D9}
.path-amor .path-symbol{color:#E91E8C}
.path-abundancia .path-symbol{color:#C6A962}
.path-sanacion .path-symbol{color:#2ECC71}
.path-name{font-family:'Cinzel',serif;font-size:0.85rem;color:#fff;letter-spacing:1px;margin-bottom:0.25rem;position:relative;z-index:1}
.path-desc{font-size:0.75rem;color:rgba(255,255,255,0.4);position:relative;z-index:1}

/* Iconos animados de categorías */
.path-icon-anim{position:relative;width:50px;height:50px;margin-bottom:0.5rem}
.path-icon-anim svg{width:100%;height:100%}
.floating-icons{position:absolute;inset:0;pointer-events:none}
.float-icon{position:absolute;font-size:0.6rem;opacity:0;animation:floatUp 3s ease-in-out infinite}
.fi1{left:0;top:50%;animation-delay:0s}
.fi2{right:0;top:30%;animation-delay:1s}
.fi3{left:50%;top:0;animation-delay:2s}
@keyframes floatUp{0%{opacity:0;transform:translateY(10px) scale(0.5)}30%{opacity:1}70%{opacity:1}100%{opacity:0;transform:translateY(-20px) scale(1)}}

/* Escudo - Protección */
.icon-escudo{filter:drop-shadow(0 0 8px rgba(74,144,217,0.5))}
.escudo-base{animation:escudoPulse 2s ease-in-out infinite}
.escudo-centro{animation:centroBrillo 2s ease-in-out infinite}
.shields .float-icon{color:#4A90D9}
@keyframes escudoPulse{0%,100%{stroke-width:2}50%{stroke-width:3}}
@keyframes centroBrillo{0%,100%{r:3;opacity:1}50%{r:4;opacity:0.6}}

/* Corazón - Amor */
.icon-corazon{filter:drop-shadow(0 0 8px rgba(233,30,140,0.5))}
.corazon-base{animation:corazonLatido 1.5s ease-in-out infinite}
.hearts .float-icon{color:#E91E8C}
@keyframes corazonLatido{0%,100%{transform:scale(1)}15%{transform:scale(1.1)}30%{transform:scale(1)}45%{transform:scale(1.05)}60%{transform:scale(1)}}

/* Moneda - Abundancia */
.icon-moneda{filter:drop-shadow(0 0 8px rgba(198,169,98,0.5))}
.moneda-base{animation:monedaGiro 4s linear infinite}
.coins .float-icon{color:#C6A962}
@keyframes monedaGiro{0%{transform:rotateY(0deg)}100%{transform:rotateY(360deg)}}

/* Vida - Sanación */
.icon-vida{filter:drop-shadow(0 0 8px rgba(46,204,113,0.5))}
.vida-hoja1{animation:hojaCrecer 3s ease-in-out infinite}
.vida-circulo{animation:circuloRespirar 3s ease-in-out infinite}
.leaves .float-icon{color:#2ECC71}
@keyframes hojaCrecer{0%,100%{transform:scale(1)}50%{transform:scale(1.1)}}
@keyframes circuloRespirar{0%,100%{r:15;opacity:1}50%{r:16;opacity:0.7}}

/* ═══════════════════════════════════════════════════════════════ */
/* SECCIONES CINEMATOGRÁFICAS (Talismanes, Libros, Lecturas, etc) */
/* ═══════════════════════════════════════════════════════════════ */
.seccion-cinematica{background:linear-gradient(180deg,#0d0d0d 0%,#1a1510 50%,#0d0d0d 100%);border-radius:20px;padding:3rem 2rem;color:#fff;position:relative;overflow:hidden;text-align:center}
.seccion-cinematica::before{content:'';position:absolute;inset:0;background:url("data:image/svg+xml,%3Csvg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");opacity:0.03;pointer-events:none}
.seccion-simbolo{margin-bottom:2rem}
.simbolo-glow{font-size:3.5rem;display:inline-block;animation:simboloFloat 4s ease-in-out infinite;filter:drop-shadow(0 0 20px rgba(212,175,55,0.5))}
@keyframes simboloFloat{0%,100%{transform:translateY(0) scale(1)}50%{transform:translateY(-8px) scale(1.05)}}
.seccion-narrativa{max-width:600px;margin:0 auto 2rem;text-align:left}
.seccion-cta{display:inline-flex;align-items:center;gap:0.75rem;background:linear-gradient(135deg,#d4af37 0%,#b8962e 100%);color:#000;padding:1rem 2rem;border-radius:30px;text-decoration:none;font-family:'Cinzel',serif;font-size:0.9rem;letter-spacing:1px;transition:all 0.3s;margin-top:1rem}
.seccion-cta:hover{transform:translateY(-2px);box-shadow:0 8px 25px rgba(212,175,55,0.4)}
.cta-arrow{transition:transform 0.3s}
.seccion-cta:hover .cta-arrow{transform:translateX(5px)}

/* ═══════════════════════════════════════════════════════════════ */
/* ANIMACIONES SVG ESPECTACULARES */
/* ═══════════════════════════════════════════════════════════════ */

/* VARITA MÁGICA - Talismanes */
.anim-varita{width:100px;height:100px;margin:0 auto}
.varita-svg{width:100%;height:100%;filter:drop-shadow(0 0 15px rgba(155,89,182,0.5))}
.varita-line{animation:varitaWave 3s ease-in-out infinite}
.varita-punta{animation:puntaGlow 2s ease-in-out infinite}
.varita-sparkles .sparkle{animation:sparkleFloat 2s ease-in-out infinite}
.sparkle.s1{animation-delay:0s}
.sparkle.s2{animation-delay:0.3s}
.sparkle.s3{animation-delay:0.6s}
.sparkle.s4{animation-delay:0.9s}
@keyframes varitaWave{0%,100%{transform:rotate(-5deg)}50%{transform:rotate(5deg)}}
@keyframes puntaGlow{0%,100%{r:4;opacity:1}50%{r:6;opacity:0.7}}
@keyframes sparkleFloat{0%,100%{opacity:1;transform:translateY(0)}50%{opacity:0.3;transform:translateY(-5px)}}

/* LIBRO MÁGICO - Libros */
.anim-libro{width:100px;height:100px;margin:0 auto}
.libro-svg{width:100%;height:100%;filter:drop-shadow(0 0 15px rgba(230,126,34,0.4))}
.libro-svg{animation:libroFloat 4s ease-in-out infinite}
.libro-glow .glow-center{animation:glowPulse 2s ease-in-out infinite}
.libro-glow .glow-p1,.libro-glow .glow-p2{animation:glowOrbit 3s ease-in-out infinite}
.glow-p2{animation-delay:1.5s!important}
@keyframes libroFloat{0%,100%{transform:translateY(0) rotate(0deg)}50%{transform:translateY(-5px) rotate(2deg)}}
@keyframes glowPulse{0%,100%{r:3;opacity:1}50%{r:5;opacity:0.6}}
@keyframes glowOrbit{0%,100%{opacity:1}50%{opacity:0.3;transform:translateY(-3px)}}

/* CARTAS TAROT - Lecturas */
.anim-cartas{width:100px;height:100px;margin:0 auto}
.cartas-svg{width:100%;height:100%;filter:drop-shadow(0 0 15px rgba(52,152,219,0.4))}
.carta-1{animation:carta1Float 4s ease-in-out infinite}
.carta-2{animation:carta2Float 4s ease-in-out infinite 0.5s}
.carta-3{animation:carta3Float 4s ease-in-out infinite 1s}
.carta-centro{animation:cartaCentroGlow 2s ease-in-out infinite}
.cartas-estrellas .estrella{animation:estrellaFloat 2.5s ease-in-out infinite}
.estrella.e1{animation-delay:0s}
.estrella.e2{animation-delay:0.5s}
.estrella.e3{animation-delay:1s}
@keyframes carta1Float{0%,100%{transform:translateY(0)}50%{transform:translateY(-3px)}}
@keyframes carta2Float{0%,100%{transform:rotate(-10deg) translateY(0)}50%{transform:rotate(-8deg) translateY(-4px)}}
@keyframes carta3Float{0%,100%{transform:rotate(15deg) translateY(0)}50%{transform:rotate(17deg) translateY(-5px)}}
@keyframes cartaCentroGlow{0%,100%{r:2;opacity:1}50%{r:3;opacity:0.5}}
@keyframes estrellaFloat{0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.4;transform:scale(1.3)}}

/* REGALO - Regalos Hechos */
.anim-regalo{width:100px;height:100px;margin:0 auto}
.regalo-svg{width:100%;height:100%;filter:drop-shadow(0 0 15px rgba(233,30,99,0.4))}
.regalo-svg{animation:regaloFloat 3s ease-in-out infinite}
.regalo-lazo{animation:lazoWiggle 2s ease-in-out infinite}
.regalo-hearts .mini-heart{animation:heartFloat 2s ease-in-out infinite}
.mini-heart.h1{animation-delay:0s}
.mini-heart.h2{animation-delay:0.4s}
.mini-heart.h3{animation-delay:0.8s}
@keyframes regaloFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}
@keyframes lazoWiggle{0%,100%{transform:rotate(0deg)}25%{transform:rotate(-3deg)}75%{transform:rotate(3deg)}}
@keyframes heartFloat{0%,100%{opacity:1;transform:scale(1) translateY(0)}50%{opacity:0.5;transform:scale(1.2) translateY(-8px)}}

/* RECIBIR - Regalos Recibidos */
.anim-recibir{width:100px;height:100px;margin:0 auto}
.recibir-svg{width:100%;height:100%;filter:drop-shadow(0 0 15px rgba(46,204,113,0.4))}
.esfera-regalo{animation:esferaPulse 3s ease-in-out infinite}
.manos{animation:manosAcercar 3s ease-in-out infinite}
.star-main{animation:starSpin 4s linear infinite}
.recibir-sparkles .spark{animation:sparkFloat 2s ease-in-out infinite}
.spark.s1{animation-delay:0s}
.spark.s2{animation-delay:0.2s}
.spark.s3{animation-delay:0.4s}
.spark.s4{animation-delay:0.6s}
.spark.s5{animation-delay:0.8s}
.spark.s6{animation-delay:1s}
@keyframes esferaPulse{0%,100%{r:15;opacity:1}50%{r:17;opacity:0.8}}
@keyframes manosAcercar{0%,100%{transform:translateX(0)}50%{transform:translateX(3px)}}
@keyframes starSpin{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}
@keyframes sparkFloat{0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.3;transform:scale(1.5)}}

@media(max-width:768px){
.seccion-cinematica{padding:2rem 1.25rem}
.simbolo-glow{font-size:2.5rem}
.seccion-narrativa{text-align:left}
.seccion-cta{padding:0.85rem 1.5rem;font-size:0.85rem}
}

@media(max-width:768px){
.elegidos-cinematic{padding:2rem 1.25rem}
.portal-runa{font-size:3rem}
.scene-visual{font-size:1.2rem!important}
.story-scene p{font-size:0.95rem;line-height:1.85}
.scene-revelation{font-size:1.05rem!important}
.story-reveal{flex-direction:column;gap:1rem}
.reveal-line{width:60px;height:1px}
.reveal-text{white-space:normal;font-size:0.9rem}
.elegidos-seal{flex-direction:column;text-align:center;gap:1rem}
.explore-paths{grid-template-columns:1fr}
}

/* ═══════════════════════════════════════════════════════════════ */
/* TARJETAS DE GUARDIANES COMPRADOS */
/* ═══════════════════════════════════════════════════════════════ */
.guardianes-lista-completa{display:flex;flex-direction:column;gap:1.25rem}
.guardian-card-full{display:flex;gap:1.25rem;background:#fff;border:1px solid #f0f0f0;border-radius:16px;padding:1.25rem;transition:all 0.2s}
.guardian-card-full:hover{border-color:#d4af37;box-shadow:0 4px 15px rgba(0,0,0,0.05)}
.guardian-foto{width:120px;height:120px;border-radius:12px;overflow:hidden;flex-shrink:0;background:#fafafa;display:flex;align-items:center;justify-content:center}
.guardian-foto img{width:100%;height:100%;object-fit:cover}
.guardian-placeholder{font-size:3rem;color:#d4af37}
.guardian-info{flex:1;min-width:0}
.guardian-info h3{font-family:'Cinzel',serif;color:#1a1a1a;margin:0 0 0.5rem;font-size:1.15rem}
.guardian-meta{display:flex;gap:0.5rem;flex-wrap:wrap;margin-bottom:0.5rem}
.guardian-tipo{background:#f5f5f5;padding:3px 10px;border-radius:20px;font-size:0.75rem;color:#666}
.guardian-cat{background:#d4af3722;padding:3px 10px;border-radius:20px;font-size:0.75rem;color:#b8962e}
.guardian-fecha{color:#888;font-size:0.85rem;margin:0 0 0.25rem}
.guardian-para{color:#555;font-size:0.9rem;margin:0;font-style:italic}
.guardian-cana{display:flex;flex-direction:column;align-items:flex-end;justify-content:center;min-width:180px}
.cana-estado{display:flex;align-items:center;gap:0.5rem;font-size:0.85rem;margin-bottom:0.75rem}
.btn-ver-cana{padding:10px 16px;background:linear-gradient(135deg,#d4af37,#b8962e);border:none;border-radius:8px;color:#1a1a1a;font-family:'Cinzel',serif;font-weight:600;font-size:0.85rem;cursor:pointer;transition:all 0.2s}
.btn-ver-cana:hover{transform:translateY(-1px);box-shadow:0 4px 12px rgba(212,175,55,0.3)}
.cana-info-text{font-size:0.8rem;color:#888;text-align:right;margin:0;max-width:180px}

/* Modal Canalización */
.modal-cana-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.7);display:flex;align-items:center;justify-content:center;z-index:1000;padding:1rem}
.modal-cana{background:#fff;border-radius:16px;max-width:700px;width:100%;max-height:85vh;overflow-y:auto;position:relative}
.modal-close{position:absolute;top:1rem;right:1rem;width:36px;height:36px;border-radius:50%;border:none;background:#f0f0f0;font-size:1.5rem;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all 0.2s;z-index:1}
.modal-close:hover{background:#d4af37;color:#fff}
.modal-cana-header{background:linear-gradient(135deg,#1a1a1a,#2a2a2a);padding:2rem;text-align:center;border-radius:16px 16px 0 0}
.modal-cana-header span{font-size:2rem;color:#d4af37;display:block;margin-bottom:0.5rem}
.modal-cana-header h2{font-family:'Cinzel',serif;color:#d4af37;margin:0 0 0.5rem;font-size:1.4rem}
.modal-cana-header p{color:rgba(255,255,255,0.8);margin:0}
.modal-cana-content{padding:2rem;line-height:1.8}
.modal-cana-content p{margin:0 0 1rem;color:#444}
.modal-cana-footer{padding:1rem 2rem 1.5rem;text-align:center;border-top:1px solid #f0f0f0}
.modal-cana-footer small{color:#888}

@media(max-width:768px){
  .guardian-card-full{flex-direction:column}
  .guardian-foto{width:100%;height:180px}
  .guardian-cana{align-items:stretch;min-width:100%;margin-top:1rem}
  .cana-info-text{text-align:center;max-width:none}
}

@media(max-width:1200px){.contenido.con-sidebar{width:calc(100% - 240px)}.sidebar-oportunidades{display:none}.sidebar-toggle{display:none}}

/* ═══════════════════════════════════════════════════════════════
   NEUROMARKETING STYLES - Validación emocional y conversión
   ═══════════════════════════════════════════════════════════════ */

/* ONBOARDING HERO */
.onb-hero{text-align:center;padding:2rem 1rem}
.onb-hero-glow{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:300px;height:300px;background:radial-gradient(circle,rgba(212,175,55,0.15) 0%,transparent 70%);pointer-events:none;z-index:0}
.onb-hero-runa{display:block;font-size:4rem;color:#d4af37;margin-bottom:1rem;animation:pulse-runa 3s ease-in-out infinite}
.onb-hero h1{font-family:'Cinzel',serif;font-size:2rem;margin-bottom:0.75rem;color:#1a1a1a;position:relative;z-index:1}
.onb-hero-sub{font-size:1.1rem;color:#555;margin-bottom:2rem;max-width:400px;margin-left:auto;margin-right:auto}
.onb-validation{background:#faf8f5;border-radius:12px;padding:1.5rem;margin-bottom:2rem;text-align:left}
.onb-validation p{color:#666;margin:0.5rem 0;font-size:0.95rem}
.onb-validation-reveal{color:#d4af37!important;font-weight:600;font-size:1.05rem!important;margin-top:1rem!important}
.btn-hero-cta{font-size:1.1rem;padding:1rem 2.5rem}
.onb-hero-note{display:block;margin-top:1rem;color:#888;font-size:0.85rem}
@keyframes pulse-runa{0%,100%{transform:scale(1);opacity:1}50%{transform:scale(1.05);opacity:0.8}}

/* ONBOARDING FINAL */
.onb-final{position:relative}
.onb-final-glow{position:absolute;top:0;left:50%;transform:translateX(-50%);width:200px;height:200px;background:radial-gradient(circle,rgba(212,175,55,0.2) 0%,transparent 70%);pointer-events:none}
.regalo-box-new{background:linear-gradient(135deg,#1a1a1a,#2a2a2a);padding:2rem;border-radius:16px;text-align:center;color:#fff}
.regalo-runa{font-size:2.5rem;color:#d4af37;display:block;margin-bottom:0.5rem}
.regalo-box-new p{margin:0;color:rgba(255,255,255,0.8)}
.regalo-box-new strong{display:block;font-family:'Cinzel',serif;font-size:1.4rem;color:#d4af37;margin:0.5rem 0}
.regalo-box-new small{color:rgba(255,255,255,0.7)}
.onb-fomo{margin-top:1.5rem;text-align:center}
.onb-fomo p{color:#666;margin:0.25rem 0}
.onb-fomo-question{color:#d4af37!important;font-weight:600;font-size:1.05rem}
.btn-enter{font-size:1.1rem;padding:1rem 2.5rem}
.ints-dolor{display:flex;flex-wrap:wrap;gap:0.75rem;justify-content:center}
.ints-dolor .int{padding:0.75rem 1.25rem;border-radius:50px;font-size:0.9rem}

/* BANNER NEURO */
.banner-neuro{position:relative;overflow:hidden}
.banner-neuro .banner-glow{position:absolute;top:-50%;right:-20%;width:400px;height:400px;background:radial-gradient(circle,rgba(212,175,55,0.1) 0%,transparent 60%);pointer-events:none}
.hero-title{font-family:'Cinzel',serif;font-size:2rem!important;color:#fff;margin-bottom:0.75rem}
.hero-validation{color:#d4af37!important;font-size:1.05rem;font-style:italic}

/* TEST GUARDIAN EN INICIO */
.test-guardian-inicio-wrapper{margin:2rem 0;background:linear-gradient(135deg,#faf8f5,#fff);border-radius:20px;padding:0;overflow:hidden;border:1px solid rgba(212,175,55,0.2)}
.test-guardian-inicio-wrapper .test-guardian-container{background:transparent!important;box-shadow:none!important;border:none!important}

/* CATEGORÍAS POR DOLOR */
.dolor-section{margin:2rem 0}
.dolor-titulo{font-family:'Cinzel',serif;font-size:1.3rem;text-align:center;margin-bottom:1.5rem;color:#1a1a1a}
.dolor-cards{display:grid;grid-template-columns:repeat(4,1fr);gap:1rem}
.dolor-card{display:flex;flex-direction:column;align-items:center;text-align:center;background:#fff;border:1px solid #f0f0f0;border-radius:16px;padding:1.5rem 1rem;cursor:pointer;transition:all 0.3s;text-decoration:none;color:inherit}
.dolor-card:hover{transform:translateY(-4px);box-shadow:0 10px 30px rgba(0,0,0,0.08);border-color:#d4af37}
.dolor-icon{font-size:2rem;color:#d4af37;margin-bottom:0.75rem}
.dolor-card strong{font-family:'Cinzel',serif;font-size:0.95rem;display:block;margin-bottom:0.25rem}
.dolor-card small{color:#888;font-size:0.8rem}
.dolor-amor:hover{border-color:#d4a5a5;background:linear-gradient(135deg,#fff,#fdf5f5)}
.dolor-abundancia:hover{border-color:#d4af37;background:linear-gradient(135deg,#fff,#fdfaf5)}
.dolor-proteccion:hover{border-color:#4a90d9;background:linear-gradient(135deg,#fff,#f5f8fd)}
.dolor-sanacion:hover{border-color:#90ee90;background:linear-gradient(135deg,#fff,#f5fdf5)}

/* MICRO-VALIDACIÓN */
.micro-validation{text-align:center;padding:2rem;background:linear-gradient(135deg,#faf8f5,#fff);border-radius:16px;margin:2rem 0}
.micro-validation p{color:#888;margin:0.25rem 0;font-size:0.95rem}
.micro-highlight{color:#1a1a1a!important;font-family:'Cinzel',serif;font-size:1.1rem!important;margin-top:0.5rem!important}

/* BANNER CÍRCULO NEURO */
.banner-circ-neuro{position:relative;overflow:hidden}
.circ-glow{position:absolute;top:-50%;left:-20%;width:200px;height:200px;background:radial-gradient(circle,rgba(212,175,55,0.3) 0%,transparent 60%);pointer-events:none;animation:circ-pulse 4s ease-in-out infinite}
@keyframes circ-pulse{0%,100%{opacity:0.5;transform:scale(1)}50%{opacity:1;transform:scale(1.1)}}
.badge-pulse{animation:badge-pulse 2s ease-in-out infinite}
@keyframes badge-pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.05)}}

/* FOMO BOX */
.fomo-box{background:linear-gradient(135deg,#1a1a1a,#2a2a2a);border-radius:16px;padding:1.5rem;display:flex;align-items:center;justify-content:space-between;gap:1.5rem;margin:2rem 0}
.fomo-content{display:flex;align-items:center;gap:1rem}
.fomo-icon{font-size:2.5rem;color:#d4af37}
.fomo-main{color:#fff;font-family:'Cinzel',serif;font-size:1.05rem;margin:0}
.fomo-sub{color:rgba(255,255,255,0.7);font-size:0.85rem;margin:0.25rem 0 0}
.fomo-cta{background:#d4af37;color:#1a1a1a;padding:0.75rem 1.5rem;border-radius:50px;text-decoration:none;font-family:'Cinzel',serif;font-size:0.9rem;font-weight:600;white-space:nowrap;transition:all 0.2s}
.fomo-cta:hover{background:#e5c349;transform:scale(1.02)}

/* INFO BOX MINIMAL */
.info-box-minimal{background:#fff;border:1px solid #f0f0f0}
.info-box-minimal h3{font-size:1rem;color:#888}

/* RESPONSIVE NEURO */
@media(max-width:900px){
  .dolor-cards{grid-template-columns:repeat(2,1fr)}
  .fomo-box{flex-direction:column;text-align:center}
  .fomo-content{flex-direction:column}
  .hero-title{font-size:1.5rem!important}
}
@media(max-width:600px){
  .dolor-cards{grid-template-columns:1fr}
  .onb-hero h1{font-size:1.5rem}
  .onb-hero-sub{font-size:1rem}
  .micro-highlight{font-size:1rem!important}
}
`;
