// Catálogo de Experiencias Mágicas (pagadas con Runas)
// ACTUALIZADO: 2026-01-18T02:35:39.508Z

const EXPERIENCIAS = [
  // ═══════════════════════════════════════════════════════════════
  // BÁSICAS (15-30 runas)
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'consejo_bosque',
    nombre: 'Consejo del Bosque',
    descripcion: 'Un consejo sabio y directo desde el corazón del bosque. Perfecto cuando necesitás una guía rápida.',
    runas: 15,
    categoria: 'basicas',
    nivel: 'Todos',
    duracion: 'Instantáneo',
    entregable: 'Mensaje de 200+ palabras',
    icono: '🌲'
  },
  {
    id: 'susurro_guardian',
    nombre: 'Susurro del Guardián',
    descripcion: 'Tu guardián te susurra al oído palabras que necesitás escuchar. Íntimo y personal.',
    runas: 20,
    categoria: 'basicas',
    nivel: 'Todos',
    duracion: 'Instantáneo',
    entregable: 'Mensaje de 250+ palabras',
    icono: '👂'
  },
  {
    id: 'tirada_3_runas',
    nombre: 'Tirada de 3 Runas',
    descripcion: 'Pasado, presente y futuro. La tirada clásica nórdica para obtener claridad sobre tu situación.',
    runas: 25,
    categoria: 'basicas',
    nivel: 'Todos',
    duracion: '24 horas',
    entregable: 'Lectura de 500+ palabras',
    icono: 'ᚱ',
    popular: true
  },
  {
    id: 'energia_dia',
    nombre: 'Energía del Día',
    descripcion: 'Escaneamos la energía que te rodea hoy y te damos consejos para navegarla.',
    runas: 15,
    categoria: 'basicas',
    nivel: 'Todos',
    duracion: 'Instantáneo',
    entregable: 'Informe de 200+ palabras',
    icono: '✨'
  },

  // ═══════════════════════════════════════════════════════════════
  // ESTÁNDAR (40-75 runas)
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'tirada_5_runas',
    nombre: 'Tirada de 5 Runas',
    descripcion: 'Una tirada más profunda que explora múltiples aspectos de tu pregunta o situación.',
    runas: 40,
    categoria: 'estandar',
    nivel: 'Todos',
    duracion: '24-48 horas',
    entregable: 'Lectura de 800+ palabras',
    icono: 'ᚱᛏ'
  },
  {
    id: 'oraculo_elementales',
    nombre: 'Oráculo de los Elementales',
    descripcion: 'Los espíritus de Tierra, Agua, Fuego y Aire responden tus preguntas desde su sabiduría elemental.',
    runas: 50,
    categoria: 'estandar',
    nivel: 'Todos',
    duracion: '24-48 horas',
    entregable: 'Lectura de 1000+ palabras',
    icono: '🌍',
    popular: true
  },
  {
    id: 'mapa_energia',
    nombre: 'Mapa de tu Energía',
    descripcion: 'Un análisis completo de tu campo energético actual. Identificamos bloqueos y fortalezas.',
    runas: 60,
    categoria: 'estandar',
    nivel: 'Todos',
    duracion: '48 horas',
    entregable: 'Informe de 1200+ palabras',
    icono: '🗺️'
  },
  {
    id: 'ritual_mes',
    nombre: 'Ritual del Mes',
    descripcion: 'Un ritual personalizado diseñado específicamente para lo que necesitás este mes.',
    runas: 55,
    categoria: 'estandar',
    nivel: 'Todos',
    duracion: '48 horas',
    entregable: 'Ritual de 1000+ palabras con instrucciones',
    icono: '🕯️'
  },
  {
    id: 'numerologia_personal',
    nombre: 'Numerología Personal',
    descripcion: 'Tu número de vida, expresión y año personal. Entendé tus ciclos y potenciales.',
    runas: 65,
    categoria: 'estandar',
    nivel: 'Todos',
    duracion: '48-72 horas',
    entregable: 'Estudio de 1500+ palabras',
    icono: '🔢'
  },
  {
    id: 'tarot_simple',
    nombre: 'Lectura de Tarot Simple',
    descripcion: 'Una tirada de tarot enfocada en una pregunta específica. Clara y directa.',
    runas: 50,
    categoria: 'estandar',
    nivel: 'Todos',
    duracion: '24-48 horas',
    entregable: 'Lectura de 800+ palabras',
    icono: '🃏'
  },
  {
    id: 'mensaje_guardian',
    nombre: 'Mensaje de TU Guardián',
    descripcion: 'Un mensaje canalizado directamente del guardián que compraste. Solo para quienes tienen guardián.',
    runas: 45,
    categoria: 'estandar',
    nivel: 'Requiere guardián comprado',
    duracion: '24-48 horas',
    entregable: 'Mensaje de 600+ palabras',
    icono: '💌',
    requiereGuardian: true
  },

  // ═══════════════════════════════════════════════════════════════
  // PREMIUM (100-150 runas)
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'tirada_7_runas',
    nombre: 'Tirada de 7 Runas Completa',
    descripcion: 'La tirada profunda. Siete runas revelando aspectos ocultos de tu camino. Para decisiones importantes.',
    runas: 100,
    categoria: 'premium',
    nivel: 'Todos',
    duracion: '48-72 horas',
    entregable: 'Lectura de 2000+ palabras',
    icono: 'ᚱᛏᚠᚢᚦ',
    popular: true
  },
  {
    id: 'tarot_profundo',
    nombre: 'Lectura de Tarot Profunda',
    descripcion: 'Una lectura extensa que explora múltiples capas de tu situación con la Cruz Celta.',
    runas: 120,
    categoria: 'premium',
    nivel: 'Todos',
    duracion: '72 horas',
    entregable: 'Lectura de 2500+ palabras',
    icono: '🎴'
  },
  {
    id: 'carta_astral_esencial',
    nombre: 'Carta Astral Esencial',
    descripcion: 'Sol, Luna, Ascendente y los planetas personales. Tu mapa cósmico explicado de forma clara.',
    runas: 130,
    categoria: 'premium',
    nivel: 'Todos',
    duracion: '5-7 días',
    entregable: 'Estudio de 3000+ palabras',
    icono: '⭐'
  },
  {
    id: 'lectura_año_personal',
    nombre: 'Lectura de Año Personal',
    descripcion: 'Qué te depara este año según tu numerología y tránsitos. Mes a mes, con consejos.',
    runas: 140,
    categoria: 'premium',
    nivel: 'Todos',
    duracion: '5-7 días',
    entregable: 'Estudio de 4000+ palabras',
    icono: '📅'
  },
  {
    id: 'conexion_guardian',
    nombre: 'Conexión con tu Guardián',
    descripcion: 'Una sesión profunda de conexión con tu guardián. Incluye ritual y mensajes canalizados.',
    runas: 110,
    categoria: 'premium',
    nivel: 'Requiere guardián comprado',
    duracion: '48-72 horas',
    entregable: 'Sesión de 2000+ palabras + ritual',
    icono: '🔮',
    requiereGuardian: true
  },

  // ═══════════════════════════════════════════════════════════════
  // ULTRA PREMIUM (200-400 runas)
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'estudio_alma',
    nombre: 'Estudio del Alma',
    descripcion: 'La experiencia más profunda. Numerología, astrología, análisis energético y guía de propósito de vida.',
    runas: 200,
    categoria: 'ultra_premium',
    nivel: 'Todos',
    duracion: '7-10 días',
    entregable: 'Dossier de 6000+ palabras + PDF',
    icono: '👁️',
    popular: true,
    destacado: true
  },
  {
    id: 'conexion_ancestros',
    nombre: 'Conexión con Ancestros',
    descripcion: 'Abrimos un canal con tus ancestros para recibir mensajes, sanación y bendiciones de tu linaje.',
    runas: 250,
    categoria: 'ultra_premium',
    nivel: 'Todos',
    duracion: '7-10 días',
    entregable: 'Sesión de 4000+ palabras + ritual',
    icono: '🌳'
  },
  {
    id: 'registros_akashicos',
    nombre: 'Registros Akáshicos',
    descripcion: 'Accedemos a los registros akáshicos de tu alma para revelar información sobre tu misión y lecciones.',
    runas: 250,
    categoria: 'ultra_premium',
    nivel: 'Todos',
    duracion: '7-10 días',
    entregable: 'Lectura de 5000+ palabras',
    icono: '📖'
  },
  {
    id: 'vidas_pasadas',
    nombre: 'Mapa de Vidas Pasadas',
    descripcion: 'Exploramos vidas pasadas relevantes para entender patrones actuales y karmas a liberar.',
    runas: 300,
    categoria: 'ultra_premium',
    nivel: 'Todos',
    duracion: '10-14 días',
    entregable: 'Estudio de 6000+ palabras',
    icono: '⏳'
  },
  {
    id: 'proposito_vida',
    nombre: 'Propósito de Vida',
    descripcion: 'Un estudio integral que combina múltiples disciplinas para revelar tu propósito y misión de alma.',
    runas: 350,
    categoria: 'ultra_premium',
    nivel: 'Todos',
    duracion: '14 días',
    entregable: 'Dossier de 8000+ palabras + PDF',
    icono: '🌟'
  },
  {
    id: 'gran_estudio_anual',
    nombre: 'Gran Estudio Anual',
    descripcion: 'El paquete completo: carta astral, numerología, tarot del año, rituales mensuales y guía trimestral.',
    runas: 400,
    categoria: 'ultra_premium',
    nivel: 'Todos',
    duracion: '14-21 días',
    entregable: 'Mega-dossier de 12000+ palabras + PDFs',
    icono: '👑',
    destacado: true
  }
];

const CATEGORIAS = [
  { id: 'basicas', nombre: 'Básicas', descripcion: 'Guía rápida y accesible', rango: '15-30 runas' },
  { id: 'estandar', nombre: 'Estándar', descripcion: 'Lecturas completas', rango: '40-75 runas' },
  { id: 'premium', nombre: 'Premium', descripcion: 'Estudios profundos', rango: '100-150 runas' },
  { id: 'ultra_premium', nombre: 'Ultra Premium', descripcion: 'Experiencias transformadoras', rango: '200-400 runas' }
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
      populares: EXPERIENCIAS.filter(e => e.popular),
      destacados: EXPERIENCIAS.filter(e => e.destacado)
    });

  } catch (error) {
    console.error('Error obteniendo catálogo:', error);
    return Response.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
