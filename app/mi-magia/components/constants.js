// ═══════════════════════════════════════════════════════════════
// CONSTANTES DE MI MAGIA
// ═══════════════════════════════════════════════════════════════

export const API_BASE = '';
export const WORDPRESS_URL = 'https://duendesdeluruguay.com';

export const CATEGORIAS_LECTURAS = {
  basicas: { nombre: 'Básicas', icono: '🌱', color: '#8B9A46', desc: 'Para empezar tu camino' },
  estandar: { nombre: 'Estándar', icono: '🌿', color: '#5D8A4A', desc: 'Profundizá tu conexión' },
  premium: { nombre: 'Premium', icono: '🌳', color: '#4A7C59', desc: 'Experiencias transformadoras' },
  ultraPremium: { nombre: 'Ultra Premium', icono: '✨', color: '#D4AF37', desc: 'Lo más profundo del bosque' },
  eventos: { nombre: 'Eventos Lunares', icono: '🌙', color: '#9370DB', desc: 'Solo en momentos especiales' },
  temporada: { nombre: 'Portales Estacionales', icono: '🌀', color: '#4169E1', desc: 'Energías de los solsticios' }
};

export const NIVELES_INFO = {
  iniciada: { nombre: 'Iniciada', icono: '🌱', color: '#8B9A46' },
  aprendiz: { nombre: 'Aprendiz', icono: '🌿', color: '#5D8A4A' },
  guardiana: { nombre: 'Guardiana', icono: '🌳', color: '#4A7C59' },
  maestra: { nombre: 'Maestra', icono: '✨', color: '#D4AF37' },
  sabia: { nombre: 'Sabia', icono: '👑', color: '#9B59B6' }
};

export const PAQUETES_RUNAS_UI = [
  { id: 'chispa', nombre: 'Chispa', runas: 30, precio: 5, bonus: 0, slug: 'paquete-runas-30', popular: false, descripcion: 'Perfecto para empezar', icono: '✧', color: '#8B9A46' },
  { id: 'destello', nombre: 'Destello', runas: 80, precio: 10, bonus: 10, slug: 'paquete-runas-80', popular: true, descripcion: '+10 runas de regalo', icono: '✦', color: '#D4AF37' },
  { id: 'resplandor', nombre: 'Resplandor', runas: 200, precio: 20, bonus: 40, slug: 'paquete-runas-200', popular: false, descripcion: '+40 runas de regalo', icono: '◆', color: '#9B59B6' },
  { id: 'fulgor', nombre: 'Fulgor', runas: 550, precio: 50, bonus: 150, slug: 'paquete-runas-550', popular: false, descripcion: '+150 runas de regalo', icono: '❖', color: '#3498db' },
  { id: 'aurora', nombre: 'Aurora', runas: 1200, precio: 100, bonus: 400, slug: 'paquete-runas-1200', popular: false, destacado: true, descripcion: 'El mejor valor - +400 runas', icono: '✹', color: '#e74c3c' }
];

export const MEMBRESIAS_UI = [
  { id: 'mensual', nombre: 'Mensual', precio: 12, slug: 'circulo-mensual', descripcion: 'Probá un mes', icono: '☽' },
  { id: 'trimestral', nombre: 'Trimestral', precio: 30, slug: 'circulo-trimestral', descripcion: '17% off', icono: '◑', popular: true },
  { id: 'semestral', nombre: 'Semestral', precio: 54, slug: 'circulo-semestral', descripcion: '25% off', icono: '◐' },
  { id: 'anual', nombre: 'Anual', precio: 96, slug: 'circulo-anual', descripcion: '33% off - El mejor valor', icono: '●', destacado: true }
];

export const TITO_IMG = `${WORDPRESS_URL}/wp-content/uploads/2025/12/gemini-image-2_que_tenga_un_pin_en_su_ropa_con_este_logo_en_negro_y_dorado_solo_el_circulo_que_-0_b02c570f-fd54-4b54-b306-3aa6a2b413b2-scaled.jpg`;

export const PACKS_RUNAS = [
  { cant: 100, precio: 7, moneda: 'USD' },
  { cant: 250, precio: 15, moneda: 'USD' },
  { cant: 500, precio: 25, moneda: 'USD' }
];

export const EXPERIENCIAS = [
  { nombre: 'Tirada de Runas', runas: 30, duracion: '~30 min', desc: 'Guía personalizada con 5 runas ancestrales.' },
  { nombre: 'Tarot de los Elementos', runas: 50, duracion: '~45 min', desc: 'Lectura con mazo elemental de 78 cartas.' },
  { nombre: 'Numerología Anual', runas: 80, duracion: '~1 hora', desc: 'Mapa numerológico para todo el año.' },
  { nombre: 'Ritual de Luna', runas: 40, duracion: '~20 min', desc: 'Ritual alineado con la fase lunar actual.' },
  { nombre: 'Carta Astral Básica', runas: 100, duracion: '~2 horas', desc: 'Análisis de tu carta natal simplificada.' }
];

export const CANJES = [
  { nombre: 'Saludo del Guardián', treboles: 10, tipo: 'digital', desc: 'Un mensaje único de tu guardián.' },
  { nombre: 'Bendición Semanal', treboles: 25, tipo: 'digital', desc: 'Energía de 7 días para tu intención.' },
  { nombre: 'Descuento 5%', treboles: 30, tipo: 'descuento', desc: 'En cualquier compra de la tienda.' },
  { nombre: 'Ritual Personalizado', treboles: 50, tipo: 'experiencia', desc: 'Un ritual diseñado solo para vos.' },
  { nombre: 'Envío Gratis', treboles: 100, tipo: 'beneficio', desc: 'En tu próximo pedido físico.' }
];

export const MEMBRESIAS = [
  { id: 'mensual', nombre: 'Mensual', precio: 12, beneficios: ['Contenido semanal', '10% descuento', '50 runas/mes'] },
  { id: 'trimestral', nombre: 'Trimestral', precio: 30, beneficios: ['Todo mensual', '15% descuento', '200 runas'], popular: true },
  { id: 'anual', nombre: 'Anual', precio: 96, beneficios: ['Todo trimestral', '20% descuento', '1000 runas', 'Acceso anticipado'] }
];

export const CIRCULO_CONTENIDO = {
  mensaje: {
    titulo: 'Mensaje del Guardián',
    icono: '✉',
    desc: 'Un mensaje canalizado especialmente para los miembros esta semana.'
  },
  ritual: {
    titulo: 'Ritual Semanal',
    icono: '🕯',
    desc: 'Práctica guiada para conectar con las energías de la semana.'
  },
  meditacion: {
    titulo: 'Meditación Guiada',
    icono: '🧘',
    desc: 'Audio exclusivo para miembros del círculo.'
  }
};

export const TIPOS_DIARIO = [
  { id: 'gratitud', nombre: 'Gratitud', icono: '☀', color: '#f39c12' },
  { id: 'sueno', nombre: 'Sueño', icono: '☽', color: '#9b59b6' },
  { id: 'intencion', nombre: 'Intención', icono: '✦', color: '#e74c3c' },
  { id: 'reflexion', nombre: 'Reflexión', icono: '◈', color: '#3498db' },
  { id: 'mensaje', nombre: 'Mensaje Guardián', icono: '♦', color: '#d4af37' }
];

export const RANGOS = [
  { nombre: 'Semilla', min: 0, icono: '🌱', color: '#8B9A46' },
  { nombre: 'Brote', min: 50, icono: '🌿', color: '#5D8A4A' },
  { nombre: 'Flor', min: 150, icono: '🌸', color: '#E91E63' },
  { nombre: 'Árbol', min: 300, icono: '🌳', color: '#4A7C59' },
  { nombre: 'Bosque', min: 500, icono: '🌲', color: '#2E7D32' },
  { nombre: 'Guardiana', min: 1000, icono: '✨', color: '#D4AF37' }
];

export const getRango = (gastado) => {
  return RANGOS.reduce((acc, r) => gastado >= r.min ? r : acc, RANGOS[0]);
};

export const getSiguienteRango = (gastado) => {
  const idx = RANGOS.findIndex(r => gastado < r.min);
  return idx > 0 ? RANGOS[idx] : null;
};

export const MUNDO_ELEMENTAL = {
  fuego: {
    nombre: 'Fuego',
    color: '#e74c3c',
    icono: '🔥',
    desc: 'Pasión, transformación, voluntad.',
    guardianes: ['Ember', 'Phoenix', 'Blaze'],
    cristales: ['Cornalina', 'Ágata de Fuego', 'Jaspe Rojo'],
    ritual: 'Encendé una vela roja y visualizá tu meta ardiendo con intensidad.'
  },
  agua: {
    nombre: 'Agua',
    color: '#3498db',
    icono: '💧',
    desc: 'Emociones, intuición, fluidez.',
    guardianes: ['Marina', 'Cascade', 'River'],
    cristales: ['Aguamarina', 'Piedra Luna', 'Larimar'],
    ritual: 'Baño con sal marina y visualizá las emociones fluyendo.'
  },
  tierra: {
    nombre: 'Tierra',
    color: '#27ae60',
    icono: '🌿',
    desc: 'Estabilidad, abundancia, raíces.',
    guardianes: ['Moss', 'Oak', 'Terra'],
    cristales: ['Jaspe Verde', 'Malaquita', 'Aventurina'],
    ritual: 'Caminá descalza y sentí la conexión con la tierra.'
  },
  aire: {
    nombre: 'Aire',
    color: '#9b59b6',
    icono: '🌬',
    desc: 'Mente, comunicación, libertad.',
    guardianes: ['Zephyr', 'Breeze', 'Storm'],
    cristales: ['Amatista', 'Fluorita', 'Sodalita'],
    ritual: 'Respiración consciente en un lugar con brisa.'
  }
};

export const CUIDADOS = [
  { titulo: 'Limpieza Energética', icono: '✧', desc: 'Pasalo por humo de salvia o palo santo una vez por semana.' },
  { titulo: 'Carga Lunar', icono: '☽', desc: 'Dejalo bajo la luna llena para recargar su energía.' },
  { titulo: 'Intención Diaria', icono: '♦', desc: 'Cada mañana, sostenelo y establecé tu intención del día.' },
  { titulo: 'Conexión', icono: '❤', desc: 'Hablale, contale tus sueños. Los guardianes escuchan.' }
];

export const CRISTALES = [
  { nombre: 'Amatista', elemento: 'aire', propiedad: 'Paz mental', color: '#9b59b6' },
  { nombre: 'Cuarzo Rosa', elemento: 'agua', propiedad: 'Amor propio', color: '#ff69b4' },
  { nombre: 'Citrino', elemento: 'fuego', propiedad: 'Abundancia', color: '#f39c12' },
  { nombre: 'Jade', elemento: 'tierra', propiedad: 'Prosperidad', color: '#27ae60' },
  { nombre: 'Obsidiana', elemento: 'tierra', propiedad: 'Protección', color: '#2c3e50' },
  { nombre: 'Selenita', elemento: 'aire', propiedad: 'Claridad', color: '#ecf0f1' }
];

export const SIGNOS_ZODIACALES = [
  { nombre: 'Aries', desde: [3, 21], hasta: [4, 19], icono: '♈' },
  { nombre: 'Tauro', desde: [4, 20], hasta: [5, 20], icono: '♉' },
  { nombre: 'Géminis', desde: [5, 21], hasta: [6, 20], icono: '♊' },
  { nombre: 'Cáncer', desde: [6, 21], hasta: [7, 22], icono: '♋' },
  { nombre: 'Leo', desde: [7, 23], hasta: [8, 22], icono: '♌' },
  { nombre: 'Virgo', desde: [8, 23], hasta: [9, 22], icono: '♍' },
  { nombre: 'Libra', desde: [9, 23], hasta: [10, 22], icono: '♎' },
  { nombre: 'Escorpio', desde: [10, 23], hasta: [11, 21], icono: '♏' },
  { nombre: 'Sagitario', desde: [11, 22], hasta: [12, 21], icono: '♐' },
  { nombre: 'Capricornio', desde: [12, 22], hasta: [1, 19], icono: '♑' },
  { nombre: 'Acuario', desde: [1, 20], hasta: [2, 18], icono: '♒' },
  { nombre: 'Piscis', desde: [2, 19], hasta: [3, 20], icono: '♓' }
];

export function calcularSigno(fechaNacimiento) {
  if (!fechaNacimiento) return null;
  const [año, mes, dia] = fechaNacimiento.split('-').map(Number);
  for (const signo of SIGNOS_ZODIACALES) {
    const [mesDesde, diaDesde] = signo.desde;
    const [mesHasta, diaHasta] = signo.hasta;
    if ((mes === mesDesde && dia >= diaDesde) || (mes === mesHasta && dia <= diaHasta)) {
      return signo;
    }
  }
  return SIGNOS_ZODIACALES[9]; // Capricornio default
}

export const PASOS_TOUR = [
  { titulo: '¡Bienvenida a tu espacio mágico!', icono: '✦', mensaje: 'Este es MI MAGIA, tu portal personal donde vivirás experiencias únicas con tus guardianes.' },
  { titulo: 'Tus monedas mágicas', icono: '☘', mensaje: 'Los TRÉBOLES se ganan con amor (compras, actividad). Las RUNAS se compran y sirven para experiencias especiales.' },
  { titulo: 'El Jardín de Tréboles', icono: '🌿', mensaje: 'Acá podés canjear tus tréboles por bendiciones, descuentos y experiencias únicas.' },
  { titulo: 'Experiencias Mágicas', icono: '✧', mensaje: 'Tiradas de runas, tarot, numerología... todo personalizado para vos, usando tus runas.' },
  { titulo: 'El Círculo de Duendes', icono: '★', mensaje: 'Nuestra membresía premium con contenido exclusivo semanal, descuentos y runas gratis cada mes.' },
  { titulo: 'Tito, tu asistente', icono: '🤖', mensaje: '¿Dudas? ¿Consultas? Tito está siempre disponible en la esquina inferior derecha.' }
];

export const LECTURAS_REGALABLES = [
  { id: 'consejo', nombre: 'Consejo del Bosque', runas: 15, desc: 'Un mensaje breve de sabiduría ancestral' },
  { id: 'tirada3', nombre: 'Tirada de 3 Runas', runas: 25, desc: 'Pasado, presente y futuro con las runas' },
  { id: 'tarot3', nombre: 'Tarot 3 Cartas', runas: 50, desc: 'Lectura de tarot con interpretación personalizada' },
  { id: 'numerologia', nombre: 'Numerología Personal', runas: 65, desc: 'Análisis de tu número de vida y año personal' }
];

export const CATEGORIAS_FORO = [
  { id: 'general', nombre: 'General', icono: '💬', desc: 'Conversaciones variadas' },
  { id: 'guardianes', nombre: 'Guardianes', icono: '🧝', desc: 'Sobre nuestros duendes' },
  { id: 'experiencias', nombre: 'Experiencias', icono: '✨', desc: 'Compartí tus vivencias' },
  { id: 'ayuda', nombre: 'Ayuda', icono: '❓', desc: 'Preguntas y respuestas' }
];

export const FAQS = [
  { p: '¿Qué es Mi Magia?', r: 'Es tu portal personal donde podés gestionar tus guardianes, acceder a experiencias mágicas, canjear beneficios y mucho más.' },
  { p: '¿Qué es el certificado de canalización?', r: 'Es el documento oficial que acompaña a cada guardián. Incluye su nombre, la fecha en que fue canalizado, un mensaje único del guardián para vos, y la firma de Thibisay. Lo recibís por email 24 horas después de tu compra, y también queda disponible en la sección Mi Magia de tu cuenta.' },
  { p: '¿Puedo comprar como regalo?', r: 'Sí, en el checkout tenés la opción "Es un regalo". Podés elegir si es sorpresa o no. Si no es sorpresa, el destinatario recibe un formulario para completar su información. Si es sorpresa, vos completás los datos sobre la persona que lo va a recibir.' },
  { p: '¿Qué incluye la compra de un guardián?', r: 'Tu guardián llega con todo: la figura física articulada, el certificado de canalización personalizado con su mensaje único, acceso al portal Mi Magia donde gestionás tu colección, y runas de bienvenida para empezar a explorar las experiencias mágicas.' },
  { p: '¿Cómo consigo tréboles?', r: 'Los tréboles se ganan automáticamente con cada compra en la tienda. También hay misiones especiales y eventos donde podés ganar más.' },
  { p: '¿Para qué sirven las runas?', r: 'Las runas son la moneda para experiencias mágicas: tiradas de runas, tarot, numerología, rituales personalizados, etc.' },
  { p: '¿Qué es el Círculo de Duendes?', r: 'Es nuestra membresía premium. Los miembros reciben contenido exclusivo semanal, descuentos permanentes, runas gratis cada mes y acceso anticipado a nuevos guardianes.' },
  { p: '¿Cómo cuido a mi guardián?', r: 'Te recomendamos limpieza energética semanal con salvia, carga bajo luna llena, y hablarle todos los días estableciendo tu intención.' },
  { p: '¿Puedo regalar una experiencia?', r: 'Sí, desde la sección "Regalos" podés enviar lecturas y experiencias a cualquier persona con email.' },
  { p: '¿Cómo contacto a Tito?', r: 'Tito está siempre disponible en el botón flotante de la esquina inferior derecha. Podés preguntarle lo que necesites.' },
  { p: '¿Mis datos están seguros?', r: 'Sí, toda tu información está protegida y nunca compartimos datos con terceros. Tus experiencias y mensajes son privados.' }
];

export function limpiarTexto(texto) {
  if (!texto) return '';
  return texto
    .replace(/\*\*/g, '')
    .replace(/#{1,6}\s/g, '')
    .replace(/^\s*[-*]\s/gm, '• ')
    .trim();
}
