// Catálogo de Experiencias Mágicas (pagadas con Runas)
const EXPERIENCIAS = [
  {
    id: 'mensaje_dia',
    nombre: 'Mensaje del Día Personalizado',
    descripcion: 'Un mensaje mágico de tu guardián específicamente para vos y tu situación actual. Canalizado con amor.',
    runas: 15,
    categoria: 'mensajes',
    duracion: 'Instantáneo',
    entregable: 'Mensaje de 300+ palabras',
    icono: '💌',
    popular: false
  },
  {
    id: 'tirada_basica',
    nombre: 'Tirada de Runas (3 Runas)',
    descripcion: 'Pasado, presente y futuro. Una tirada clásica para obtener claridad sobre tu situación.',
    runas: 25,
    categoria: 'tiradas',
    duracion: '24-48 horas',
    entregable: 'Lectura de 800+ palabras con interpretación profunda',
    icono: 'ᚱ',
    popular: true
  },
  {
    id: 'lectura_energia',
    nombre: 'Lectura de Energía Básica',
    descripcion: 'Escaneamos tu campo energético y te contamos qué estamos percibiendo. Incluye consejos de limpieza.',
    runas: 40,
    categoria: 'lecturas',
    duracion: '24-48 horas',
    entregable: 'Informe de 1000+ palabras',
    icono: '✨',
    popular: true
  },
  {
    id: 'guia_cristal',
    nombre: 'Guía de Cristal del Mes',
    descripcion: 'Descubrí qué cristal necesitás este mes y cómo trabajar con él. Personalizado según tu momento.',
    runas: 60,
    categoria: 'guias',
    duracion: '24-48 horas',
    entregable: 'Guía de 1200+ palabras con rituales',
    icono: '💎',
    popular: false
  },
  {
    id: 'tirada_completa',
    nombre: 'Tirada de Runas Completa (7 Runas)',
    descripcion: 'La tirada profunda. Siete runas revelando aspectos ocultos de tu camino. Para decisiones importantes.',
    runas: 80,
    categoria: 'tiradas',
    duracion: '48-72 horas',
    entregable: 'Lectura de 2000+ palabras',
    icono: 'ᚱᛏᚠ',
    popular: true
  },
  {
    id: 'lectura_profunda',
    nombre: 'Lectura de Energía Profunda',
    descripcion: 'Un análisis completo de tu campo áurico, chakras y bloqueos. Incluye plan de sanación.',
    runas: 100,
    categoria: 'lecturas',
    duracion: '48-72 horas',
    entregable: 'Informe de 2500+ palabras',
    icono: '🌟',
    popular: false
  },
  {
    id: 'ritual_personalizado',
    nombre: 'Ritual Personalizado',
    descripcion: 'Diseñamos un ritual único para tu intención específica. Con materiales, pasos y timing lunar.',
    runas: 150,
    categoria: 'rituales',
    duracion: '3-5 días',
    entregable: 'Ritual completo de 2000+ palabras',
    icono: '🕯️',
    popular: true
  },
  {
    id: 'estudio_numerologico',
    nombre: 'Estudio Numerológico Completo',
    descripcion: 'Tu número de vida, expresión, alma, personalidad y año personal. Entendé tus ciclos.',
    runas: 200,
    categoria: 'estudios',
    duracion: '5-7 días',
    entregable: 'Informe de 4000+ palabras',
    icono: '🔢',
    popular: false
  },
  {
    id: 'carta_astral_basica',
    nombre: 'Carta Astral Básica',
    descripcion: 'Sol, Luna, Ascendente y los planetas principales. Tu mapa cósmico explicado.',
    runas: 300,
    categoria: 'estudios',
    duracion: '7-10 días',
    entregable: 'Informe de 5000+ palabras',
    icono: '⭐',
    popular: false
  },
  {
    id: 'estudio_alma',
    nombre: 'Estudio del Alma Completo',
    descripcion: 'La experiencia más profunda. Numerología, astrología, análisis energético y guía de propósito de vida.',
    runas: 500,
    categoria: 'estudios',
    duracion: '14 días',
    entregable: 'Dossier de 8000+ palabras + PDF descargable',
    icono: '👁️',
    popular: true,
    premium: true
  }
];

const CATEGORIAS = [
  { id: 'mensajes', nombre: 'Mensajes', descripcion: 'Comunicación directa con tu guardián' },
  { id: 'tiradas', nombre: 'Tiradas de Runas', descripcion: 'Sabiduría nórdica para tu camino' },
  { id: 'lecturas', nombre: 'Lecturas Energéticas', descripcion: 'Escaneamos tu campo áurico' },
  { id: 'guias', nombre: 'Guías Personalizadas', descripcion: 'Orientación específica para vos' },
  { id: 'rituales', nombre: 'Rituales', descripcion: 'Magia práctica a tu medida' },
  { id: 'estudios', nombre: 'Estudios Profundos', descripcion: 'Análisis completos de tu ser' }
];

// GET - Obtener catálogo de experiencias
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const categoria = searchParams.get('categoria');
    const id = searchParams.get('id');

    // Obtener experiencia específica
    if (id) {
      const experiencia = EXPERIENCIAS.find(e => e.id === id);
      if (!experiencia) {
        return Response.json({
          success: false,
          error: 'Experiencia no encontrada'
        }, { status: 404 });
      }
      return Response.json({
        success: true,
        experiencia
      });
    }

    // Filtrar por categoría
    let experiencias = EXPERIENCIAS;
    if (categoria) {
      experiencias = experiencias.filter(e => e.categoria === categoria);
    }

    // Ordenar por runas (precio)
    experiencias = [...experiencias].sort((a, b) => a.runas - b.runas);

    return Response.json({
      success: true,
      categorias: CATEGORIAS,
      experiencias,
      total: experiencias.length,
      populares: EXPERIENCIAS.filter(e => e.popular)
    });

  } catch (error) {
    console.error('Error obteniendo catálogo:', error);
    return Response.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
