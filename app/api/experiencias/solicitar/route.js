import { kv } from '@vercel/kv';
import Anthropic from '@anthropic-ai/sdk';
import canon from '@/lib/canon.json';
import { XP_ACCIONES, obtenerNivel } from '@/lib/gamificacion/config';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

// ═══════════════════════════════════════════════════════════════
// HELPER: Actualizar gamificación al completar experiencia
// ═══════════════════════════════════════════════════════════════
async function actualizarGamificacion(email, experienciaId, experiencia) {
  try {
    let gamificacion = await kv.get(`gamificacion:${email}`);

    // Inicializar si no existe
    if (!gamificacion) {
      gamificacion = {
        xp: 0,
        nivel: 'iniciada',
        racha: 0,
        rachaMax: 0,
        ultimoLogin: null,
        ultimoCofre: null,
        lecturasCompletadas: [],
        tiposLecturaUsados: [],
        misionesCompletadas: [],
        badges: [],
        referidos: [],
        codigoReferido: null,
        creadoEn: new Date().toISOString()
      };
    }

    // Registrar lectura completada
    if (!gamificacion.lecturasCompletadas.includes(experienciaId)) {
      gamificacion.lecturasCompletadas.push(experienciaId);
    }

    // Determinar categoría/tipo de experiencia
    const categoria = determinarCategoria(experienciaId);
    if (categoria && !gamificacion.tiposLecturaUsados.includes(categoria)) {
      gamificacion.tiposLecturaUsados.push(categoria);
    }

    // Calcular XP según costo de runas (como proxy del nivel)
    let xpGanado = XP_ACCIONES.lecturaBasica; // 10 por defecto
    const runas = experiencia.runas || 0;

    if (runas <= 30) {
      xpGanado = XP_ACCIONES.lecturaBasica; // 10
    } else if (runas <= 75) {
      xpGanado = XP_ACCIONES.lecturaEstandar; // 25
    } else if (runas <= 150) {
      xpGanado = XP_ACCIONES.lecturaPremium; // 50
    } else {
      xpGanado = XP_ACCIONES.lecturaUltraPremium; // 100
    }

    gamificacion.xp += xpGanado;

    // Actualizar nivel
    const nuevoNivel = obtenerNivel(gamificacion.xp);
    const subioNivel = nuevoNivel.id !== gamificacion.nivel;
    gamificacion.nivel = nuevoNivel.id;

    // Guardar gamificación
    await kv.set(`gamificacion:${email}`, gamificacion);

    return {
      xpGanado,
      xpTotal: gamificacion.xp,
      nivel: nuevoNivel,
      subioNivel,
      lecturasCompletadas: gamificacion.lecturasCompletadas.length
    };
  } catch (error) {
    console.error('Error actualizando gamificación:', error);
    return null;
  }
}

// Determinar categoría de experiencia para tracking
function determinarCategoria(experienciaId) {
  const categorias = {
    'mensaje_dia': 'mensajes',
    'tirada_basica': 'tiradas',
    'tirada_completa': 'tiradas',
    'lectura_energia': 'lecturas',
    'lectura_profunda': 'lecturas',
    'guia_cristal': 'guias',
    'ritual_personalizado': 'rituales',
    'estudio_numerologico': 'estudios',
    'carta_astral_basica': 'estudios',
    'estudio_alma': 'estudios',
    'tirada-runas': 'tiradas',
    'susurro-guardian': 'mensajes',
    'oraculo-mes': 'lecturas',
    'gran-oraculo': 'lecturas',
    'lectura-alma': 'estudios',
    'registros-akashicos': 'estudios',
    'carta-ancestral': 'lecturas',
    'mapa-energetico': 'lecturas',
    'pregunta-especifica': 'mensajes'
  };
  return categorias[experienciaId] || 'otros';
}

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function OPTIONS() {
  return new Response(null, { headers: CORS_HEADERS });
}

// ═══════════════════════════════════════════════════════════════
// CATÁLOGO UNIFICADO DE EXPERIENCIAS
// Sincronizado con /api/experiencias/catalogo/route.js
// ═══════════════════════════════════════════════════════════════
const EXPERIENCIAS = {
  // === BÁSICAS (15-30 runas) ===
  'consejo_bosque': {
    nombre: 'Consejo del Bosque',
    runas: 15,
    generaIA: true,
    palabras: 200,
    tiempoMs: 0
  },
  'susurro_guardian': {
    nombre: 'Susurro de tu Guardián',
    runas: 20,
    generaIA: true,
    palabras: 500,
    tiempoMinMs: 10 * 60 * 1000,
    tiempoMaxMs: 20 * 60 * 1000,
    requiereGuardian: true
  },
  'tirada_3_runas': {
    nombre: 'Tirada de 3 Runas',
    runas: 25,
    generaIA: true,
    palabras: 500,
    tiempoMinMs: 30 * 60 * 1000,
    tiempoMaxMs: 60 * 60 * 1000
  },
  'energia_dia': {
    nombre: 'Energía del Día',
    runas: 15,
    generaIA: true,
    palabras: 200,
    tiempoMs: 0
  },

  // === ESTÁNDAR (40-75 runas) ===
  'tirada_5_runas': {
    nombre: 'Tirada de 5 Runas',
    runas: 40,
    generaIA: true,
    palabras: 800,
    tiempoMinMs: 60 * 60 * 1000,
    tiempoMaxMs: 2 * 60 * 60 * 1000
  },
  'oraculo_elementales': {
    nombre: 'Oráculo de los Elementales',
    runas: 50,
    generaIA: true,
    palabras: 1000,
    tiempoMinMs: 60 * 60 * 1000,
    tiempoMaxMs: 2 * 60 * 60 * 1000
  },
  'mapa_energia': {
    nombre: 'Mapa de tu Energía',
    runas: 60,
    generaIA: true,
    palabras: 1200,
    tiempoMinMs: 2 * 60 * 60 * 1000,
    tiempoMaxMs: 4 * 60 * 60 * 1000
  },
  'ritual_mes': {
    nombre: 'Ritual del Mes',
    runas: 55,
    generaIA: true,
    palabras: 1000,
    tiempoMinMs: 2 * 60 * 60 * 1000,
    tiempoMaxMs: 4 * 60 * 60 * 1000
  },
  'numerologia_personal': {
    nombre: 'Numerología Personal',
    runas: 65,
    generaIA: true,
    palabras: 1500,
    tiempoMinMs: 4 * 60 * 60 * 1000,
    tiempoMaxMs: 8 * 60 * 60 * 1000
  },
  'tarot_simple': {
    nombre: 'Lectura de Tarot Simple',
    runas: 50,
    generaIA: true,
    palabras: 800,
    tiempoMinMs: 60 * 60 * 1000,
    tiempoMaxMs: 2 * 60 * 60 * 1000
  },
  'mensaje_guardian': {
    nombre: 'Mensaje de TU Guardián',
    runas: 45,
    generaIA: true,
    palabras: 600,
    tiempoMinMs: 60 * 60 * 1000,
    tiempoMaxMs: 2 * 60 * 60 * 1000,
    requiereGuardian: true
  },

  // === PREMIUM (100-150 runas) ===
  'tirada_7_runas': {
    nombre: 'Tirada de 7 Runas Completa',
    runas: 100,
    generaIA: true,
    palabras: 2000,
    tiempoMinMs: 4 * 60 * 60 * 1000,
    tiempoMaxMs: 8 * 60 * 60 * 1000
  },
  'tarot_profundo': {
    nombre: 'Lectura de Tarot Profunda',
    runas: 50,
    generaIA: true,
    palabras: 1200,
    tiempoMinMs: 20 * 60 * 1000,
    tiempoMaxMs: 45 * 60 * 1000
  },
  'carta_astral_esencial': {
    nombre: 'Carta Astral Esencial',
    runas: 130,
    generaIA: true,
    palabras: 3000,
    tiempoMinMs: 24 * 60 * 60 * 1000,
    tiempoMaxMs: 48 * 60 * 60 * 1000
  },
  'lectura_año_personal': {
    nombre: 'Lectura de Año Personal',
    runas: 140,
    generaIA: true,
    palabras: 4000,
    tiempoMinMs: 24 * 60 * 60 * 1000,
    tiempoMaxMs: 72 * 60 * 60 * 1000
  },
  'conexion_guardian': {
    nombre: 'Conexión con tu Guardián',
    runas: 110,
    generaIA: true,
    palabras: 2000,
    tiempoMinMs: 4 * 60 * 60 * 1000,
    tiempoMaxMs: 8 * 60 * 60 * 1000,
    requiereGuardian: true
  },

  // === ULTRA PREMIUM (200-400 runas) ===
  'estudio_alma': {
    nombre: 'Estudio del Alma',
    runas: 200,
    generaIA: true,
    palabras: 6000,
    tiempoMinMs: 48 * 60 * 60 * 1000,
    tiempoMaxMs: 96 * 60 * 60 * 1000
  },
  'conexion_ancestros': {
    nombre: 'Conexión con Ancestros',
    runas: 250,
    generaIA: true,
    palabras: 4000,
    tiempoMinMs: 48 * 60 * 60 * 1000,
    tiempoMaxMs: 96 * 60 * 60 * 1000
  },
  'registros_akashicos': {
    nombre: 'Registros Akáshicos',
    runas: 250,
    generaIA: true,
    palabras: 5000,
    tiempoMinMs: 48 * 60 * 60 * 1000,
    tiempoMaxMs: 96 * 60 * 60 * 1000
  },
  'vidas_pasadas': {
    nombre: 'Mapa de Vidas Pasadas',
    runas: 300,
    generaIA: true,
    palabras: 6000,
    tiempoMinMs: 96 * 60 * 60 * 1000,
    tiempoMaxMs: 168 * 60 * 60 * 1000
  },
  'proposito_vida': {
    nombre: 'Propósito de Vida',
    runas: 350,
    generaIA: true,
    palabras: 8000,
    tiempoMinMs: 168 * 60 * 60 * 1000,
    tiempoMaxMs: 336 * 60 * 60 * 1000
  },
  'gran_estudio_anual': {
    nombre: 'Gran Estudio Anual',
    runas: 400,
    generaIA: true,
    palabras: 12000,
    tiempoMinMs: 168 * 60 * 60 * 1000,
    tiempoMaxMs: 336 * 60 * 60 * 1000
  },

  // === ALIASES PARA COMPATIBILIDAD ===
  // IDs alternativos que apuntan a las experiencias correctas
  'mensaje_dia': { alias: 'consejo_bosque', nombre: 'Consejo del Bosque', runas: 15, generaIA: true, palabras: 200, tiempoMs: 0 },
  'tirada_basica': { alias: 'tirada_3_runas', nombre: 'Tirada de 3 Runas', runas: 25, generaIA: true, palabras: 500, tiempoMinMs: 30 * 60 * 1000, tiempoMaxMs: 60 * 60 * 1000 },
  'tirada_completa': { alias: 'tirada_7_runas', nombre: 'Tirada de 7 Runas Completa', runas: 100, generaIA: true, palabras: 2000, tiempoMinMs: 4 * 60 * 60 * 1000, tiempoMaxMs: 8 * 60 * 60 * 1000 },
  'lectura_energia': { alias: 'mapa_energia', nombre: 'Mapa de tu Energía', runas: 60, generaIA: true, palabras: 1200, tiempoMinMs: 2 * 60 * 60 * 1000, tiempoMaxMs: 4 * 60 * 60 * 1000 },
  'guia_cristal': { alias: 'oraculo_elementales', nombre: 'Oráculo de los Elementales', runas: 50, generaIA: true, palabras: 1000, tiempoMinMs: 60 * 60 * 1000, tiempoMaxMs: 2 * 60 * 60 * 1000 },
  'lectura_profunda': { alias: 'tarot_profundo', nombre: 'Lectura de Tarot Profunda', runas: 120, generaIA: true, palabras: 2500, tiempoMinMs: 6 * 60 * 60 * 1000, tiempoMaxMs: 12 * 60 * 60 * 1000 },
  'ritual_personalizado': { alias: 'ritual_mes', nombre: 'Ritual del Mes', runas: 55, generaIA: true, palabras: 1000, tiempoMinMs: 2 * 60 * 60 * 1000, tiempoMaxMs: 4 * 60 * 60 * 1000 },
  'estudio_numerologico': { alias: 'numerologia_personal', nombre: 'Numerología Personal', runas: 65, generaIA: true, palabras: 1500, tiempoMinMs: 4 * 60 * 60 * 1000, tiempoMaxMs: 8 * 60 * 60 * 1000 },
  'carta_astral_basica': { alias: 'carta_astral_esencial', nombre: 'Carta Astral Esencial', runas: 130, generaIA: true, palabras: 3000, tiempoMinMs: 24 * 60 * 60 * 1000, tiempoMaxMs: 48 * 60 * 60 * 1000 },

  // === IDs con guiones (Mi Magia frontend) ===
  'tirada-runas': { alias: 'tirada_3_runas', nombre: 'Tirada de 3 Runas', runas: 25, generaIA: true, palabras: 500, tiempoMinMs: 30 * 60 * 1000, tiempoMaxMs: 60 * 60 * 1000 },
  'susurro-guardian': { alias: 'susurro_guardian', nombre: 'Susurro del Guardián', runas: 20, generaIA: true, palabras: 250, tiempoMs: 0 },
  'oraculo-mes': { alias: 'oraculo_elementales', nombre: 'Oráculo de los Elementales', runas: 50, generaIA: true, palabras: 1000, tiempoMinMs: 60 * 60 * 1000, tiempoMaxMs: 2 * 60 * 60 * 1000 },
  'gran-oraculo': { alias: 'tarot_profundo', nombre: 'Lectura de Tarot Profunda', runas: 120, generaIA: true, palabras: 2500, tiempoMinMs: 6 * 60 * 60 * 1000, tiempoMaxMs: 12 * 60 * 60 * 1000 },
  'lectura-alma': { alias: 'estudio_alma', nombre: 'Estudio del Alma', runas: 200, generaIA: true, palabras: 6000, tiempoMinMs: 48 * 60 * 60 * 1000, tiempoMaxMs: 96 * 60 * 60 * 1000 },
  'registros-akashicos': { alias: 'registros_akashicos', nombre: 'Registros Akáshicos', runas: 250, generaIA: true, palabras: 5000, tiempoMinMs: 48 * 60 * 60 * 1000, tiempoMaxMs: 96 * 60 * 60 * 1000 },
  'carta-ancestral': { alias: 'conexion_ancestros', nombre: 'Conexión con Ancestros', runas: 250, generaIA: true, palabras: 4000, tiempoMinMs: 48 * 60 * 60 * 1000, tiempoMaxMs: 96 * 60 * 60 * 1000 },
  'mapa-energetico': { alias: 'mapa_energia', nombre: 'Mapa de tu Energía', runas: 60, generaIA: true, palabras: 1200, tiempoMinMs: 2 * 60 * 60 * 1000, tiempoMaxMs: 4 * 60 * 60 * 1000 },
  'pregunta-especifica': { alias: 'consejo_bosque', nombre: 'Consejo del Bosque', runas: 15, generaIA: true, palabras: 200, tiempoMs: 0 },

  // === EXPERIENCIAS MÁGICAS (nuevo catálogo premium - PRECIOS ACTUALIZADOS) ===
  // Mensajes Canalizados
  'mensaje_universo': {
    nombre: 'Lo que el Universo Quiere Decirte',
    runas: 25,
    generaIA: true,
    palabras: 800,
    tiempoMinMs: 15 * 60 * 1000,
    tiempoMaxMs: 30 * 60 * 1000
  },
  'carta_ancestros': {
    nombre: 'Carta de tus Ancestros',
    runas: 45,
    generaIA: true,
    palabras: 1200,
    tiempoMinMs: 30 * 60 * 1000,
    tiempoMaxMs: 60 * 60 * 1000
  },

  // Guardianes
  'estado_guardian': {
    nombre: 'Estado Energético de tu Guardián',
    runas: 20,
    generaIA: true,
    palabras: 600,
    tiempoMinMs: 15 * 60 * 1000,
    tiempoMaxMs: 30 * 60 * 1000,
    requiereGuardian: true
  },
  'mision_guardian': {
    nombre: 'La Misión de tu Guardián',
    runas: 45,
    generaIA: true,
    palabras: 1500,
    tiempoMinMs: 30 * 60 * 1000,
    tiempoMaxMs: 60 * 60 * 1000,
    requiereGuardian: true
  },
  'historia_guardian': {
    nombre: 'La Historia de tu Guardián',
    runas: 55,
    generaIA: true,
    palabras: 2000,
    tiempoMinMs: 45 * 60 * 1000,
    tiempoMaxMs: 90 * 60 * 1000,
    requiereGuardian: true
  },

  // Elementales
  'elemento_dominante': {
    nombre: 'Tu Elemento Dominante Oculto',
    runas: 25,
    generaIA: true,
    palabras: 800,
    tiempoMinMs: 15 * 60 * 1000,
    tiempoMaxMs: 30 * 60 * 1000
  },
  'sanacion_elemental': {
    nombre: 'Sanación con los 4 Elementos',
    runas: 50,
    generaIA: true,
    palabras: 1200,
    tiempoMinMs: 30 * 60 * 1000,
    tiempoMaxMs: 60 * 60 * 1000
  },
  'elemental_personal': {
    nombre: 'Tu Elemental Personal',
    runas: 35,
    generaIA: true,
    palabras: 1000,
    tiempoMinMs: 20 * 60 * 1000,
    tiempoMaxMs: 45 * 60 * 1000
  },

  // Cristales
  'cristal_alma': {
    nombre: 'El Cristal de tu Alma',
    runas: 30,
    generaIA: true,
    palabras: 900,
    tiempoMinMs: 20 * 60 * 1000,
    tiempoMaxMs: 40 * 60 * 1000
  },
  'grid_cristales': {
    nombre: 'Tu Grid de Cristales',
    runas: 40,
    generaIA: true,
    palabras: 1200,
    tiempoMinMs: 25 * 60 * 1000,
    tiempoMaxMs: 50 * 60 * 1000
  },

  // Tarot y Oráculos
  'oraculo_duendes': {
    nombre: 'Oráculo de los Duendes',
    runas: 25,
    generaIA: true,
    palabras: 700,
    tiempoMinMs: 15 * 60 * 1000,
    tiempoMaxMs: 30 * 60 * 1000
  },
  'carta_año': {
    nombre: 'Tu Carta del Año',
    runas: 40,
    generaIA: true,
    palabras: 800,
    tiempoMinMs: 20 * 60 * 1000,
    tiempoMaxMs: 40 * 60 * 1000
  },

  // Runas Nórdicas
  'tirada_runas_3': {
    nombre: 'Tirada de 3 Runas',
    runas: 25,
    generaIA: true,
    palabras: 600,
    tiempoMinMs: 10 * 60 * 1000,
    tiempoMaxMs: 25 * 60 * 1000
  },
  'tirada_runas_9': {
    nombre: 'Tirada de las 9 Runas',
    runas: 65,
    generaIA: true,
    palabras: 1500,
    tiempoMinMs: 30 * 60 * 1000,
    tiempoMaxMs: 60 * 60 * 1000
  },
  'runa_personal': {
    nombre: 'Tu Runa de Nacimiento',
    runas: 30,
    generaIA: true,
    palabras: 800,
    tiempoMinMs: 20 * 60 * 1000,
    tiempoMaxMs: 40 * 60 * 1000
  },

  // Astrología
  'luna_personal': {
    nombre: 'Tu Luna Personal',
    runas: 40,
    generaIA: true,
    palabras: 1000,
    tiempoMinMs: 20 * 60 * 1000,
    tiempoMaxMs: 45 * 60 * 1000
  },
  'ciclo_lunar_mes': {
    nombre: 'Tu Mes Lunar',
    runas: 45,
    generaIA: true,
    palabras: 1200,
    tiempoMinMs: 25 * 60 * 1000,
    tiempoMaxMs: 50 * 60 * 1000
  },

  // Energía
  'lectura_aura': {
    nombre: 'Lectura de Aura',
    runas: 40,
    generaIA: true,
    palabras: 1000,
    tiempoMinMs: 20 * 60 * 1000,
    tiempoMaxMs: 45 * 60 * 1000
  },
  'corte_cordones': {
    nombre: 'Análisis de Cordones Energéticos',
    runas: 55,
    generaIA: true,
    palabras: 1200,
    tiempoMinMs: 30 * 60 * 1000,
    tiempoMaxMs: 60 * 60 * 1000
  },
  'chakras_estado': {
    nombre: 'Estado de tus Chakras',
    runas: 50,
    generaIA: true,
    palabras: 1200,
    tiempoMinMs: 25 * 60 * 1000,
    tiempoMaxMs: 50 * 60 * 1000
  },

  // Alma (PREMIUM)
  'mision_alma': {
    nombre: 'La Misión de tu Alma',
    runas: 200,
    generaIA: true,
    palabras: 2000,
    tiempoMinMs: 45 * 60 * 1000,
    tiempoMaxMs: 90 * 60 * 1000
  },
  'contratos_alma': {
    nombre: 'Contratos del Alma',
    runas: 180,
    generaIA: true,
    palabras: 2500,
    tiempoMinMs: 60 * 60 * 1000,
    tiempoMaxMs: 120 * 60 * 1000
  },

  // Protección
  'escudo_protector': {
    nombre: 'Tu Escudo Protector',
    runas: 40,
    generaIA: true,
    palabras: 1000,
    tiempoMinMs: 20 * 60 * 1000,
    tiempoMaxMs: 45 * 60 * 1000
  },
  'limpieza_casa': {
    nombre: 'Limpieza Energética del Hogar',
    runas: 45,
    generaIA: true,
    palabras: 1200,
    tiempoMinMs: 25 * 60 * 1000,
    tiempoMaxMs: 50 * 60 * 1000
  },
  'deteccion_influencias': {
    nombre: 'Detección de Influencias Negativas',
    runas: 55,
    generaIA: true,
    palabras: 1500,
    tiempoMinMs: 35 * 60 * 1000,
    tiempoMaxMs: 70 * 60 * 1000
  }
};

// POST - Solicitar una experiencia
export async function POST(request) {
  try {
    const body = await request.json();
    const {
      email,
      token,
      experienciaId,
      tipo, // Alias para compatibilidad con frontend
      contexto = '',
      fechaNacimiento,
      preguntaEspecifica,
      datos = {}, // Datos adicionales del formulario
      generarInmediato = false
    } = body;

    // Aceptar tanto experienciaId como tipo
    const expId = experienciaId || tipo;

    // Obtener email desde token si se proporciona
    let userEmail = email;
    if (token && !email) {
      const tokenData = await kv.get(`token:${token}`);
      if (!tokenData) {
        return Response.json({
          success: false,
          error: 'Token inválido'
        }, { status: 401, headers: CORS_HEADERS });
      }
      userEmail = typeof tokenData === 'string' ? tokenData : tokenData.email;
    }

    if (!userEmail) {
      return Response.json({
        success: false,
        error: 'Email o token requerido'
      }, { status: 400, headers: CORS_HEADERS });
    }

    if (!expId || !EXPERIENCIAS[expId]) {
      return Response.json({
        success: false,
        error: 'Experiencia no válida',
        experiencias_disponibles: Object.keys(EXPERIENCIAS)
      }, { status: 400, headers: CORS_HEADERS });
    }

    const experiencia = EXPERIENCIAS[expId];
    const emailNorm = userEmail.toLowerCase().trim();

    // Combinar contexto de diferentes fuentes
    const contextoCompleto = contexto || datos?.contexto || datos?.pregunta || '';
    const preguntaCompleta = preguntaEspecifica || datos?.pregunta || '';

    // Buscar usuario PRIMERO en elegido: (que es lo que muestra el frontend)
    // Luego en user: como fallback para compatibilidad
    let userKey = `elegido:${emailNorm}`;
    let usuario = await kv.get(userKey);
    if (!usuario) {
      userKey = `user:${emailNorm}`;
      usuario = await kv.get(userKey);
    }

    if (!usuario) {
      return Response.json({
        success: false,
        error: 'Usuario no encontrado. Debés estar registrado para solicitar experiencias.'
      }, { status: 404, headers: CORS_HEADERS });
    }

    // Verificar runas suficientes
    const runasActuales = usuario.runas || 0;
    if (runasActuales < experiencia.runas) {
      return Response.json({
        success: false,
        error: 'Runas insuficientes',
        runas_necesarias: experiencia.runas,
        runas_actuales: runasActuales,
        faltan: experiencia.runas - runasActuales,
        sugerencia: '¿Necesitás más runas? Podés conseguirlas en nuestra tienda.'
      }, { status: 400, headers: CORS_HEADERS });
    }

    // Calcular fecha de entrega
    const ahora = new Date();
    let fechaEntrega = ahora;

    if (experiencia.tiempoMs === 0) {
      // Instantáneo
      fechaEntrega = ahora;
    } else {
      // Calcular tiempo aleatorio dentro del rango
      const tiempoAleatorio = experiencia.tiempoMinMs +
        Math.random() * (experiencia.tiempoMaxMs - experiencia.tiempoMinMs);
      fechaEntrega = new Date(Date.now() + tiempoAleatorio);

      // Ajustar si cae en horario nocturno Uruguay (22:00 - 06:00)
      fechaEntrega = ajustarHorarioEntrega(fechaEntrega);
    }

    // Crear solicitud
    const solicitudId = `exp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const solicitud = {
      id: solicitudId,
      experienciaId: expId,
      experienciaNombre: experiencia.nombre,
      email: emailNorm,
      nombreUsuario: usuario.nombre || usuario.nombrePreferido || 'Alma luminosa',
      pronombre: usuario.pronombre || 'ella',
      elemento: usuario.elemento,
      guardianes: usuario.guardianes || [],
      contexto: contextoCompleto,
      preguntaEspecifica: preguntaCompleta,
      fechaNacimiento: fechaNacimiento || datos?.fecha_nacimiento,
      datosAdicionales: datos, // Guardar todos los datos del formulario
      runasGastadas: experiencia.runas,
      palabrasMinimas: experiencia.palabras,
      fechaSolicitud: ahora.toISOString(),
      fechaEntregaEstimada: fechaEntrega.toISOString(),
      estado: 'procesando',
      resultado: null
    };

    // Descontar runas del usuario
    usuario.runas = runasActuales - experiencia.runas;

    // Registrar en historial del usuario
    if (!usuario.historialExperiencias) {
      usuario.historialExperiencias = [];
    }
    usuario.historialExperiencias.push({
      id: solicitudId,
      experienciaId: expId,
      nombre: experiencia.nombre,
      runas: experiencia.runas,
      fecha: ahora.toISOString(),
      estado: 'procesando'
    });

    // Guardar usuario actualizado
    await kv.set(userKey, usuario);

    // Guardar solicitud
    await kv.set(`experiencia:${solicitudId}`, solicitud);

    // Agregar a cola de pendientes del usuario
    const pendientes = await kv.get(`lecturas-pendientes:${emailNorm}`) || [];
    pendientes.push({
      id: solicitudId,
      tipo: expId,
      nombre: experiencia.nombre,
      fechaEntrega: fechaEntrega.toISOString(),
      estado: 'procesando'
    });
    await kv.set(`lecturas-pendientes:${emailNorm}`, pendientes);

    // Agregar a cola global de procesamiento
    const colaProcesamiento = await kv.get('cola:experiencias') || [];
    colaProcesamiento.push(solicitudId);
    await kv.set('cola:experiencias', colaProcesamiento);

    // ═══════════════════════════════════════════════════════════════
    // GUARDAR EN HISTORIAL INMEDIATAMENTE (para que aparezca en "Mis Lecturas")
    // Estado inicial: 'procesando' - se actualizará cuando termine
    // ═══════════════════════════════════════════════════════════════
    const historial = await kv.get(`historial:${emailNorm}`) || [];
    const entradaHistorial = {
      id: solicitudId,
      lecturaId: expId,
      nombre: experiencia.nombre,
      icono: obtenerIconoExperiencia(expId),
      categoria: determinarCategoria(expId),
      runas: experiencia.runas,
      fecha: new Date().toISOString(),
      estado: 'procesando',
      contenido: null
    };
    historial.unshift(entradaHistorial);
    await kv.set(`historial:${emailNorm}`, historial.slice(0, 100));

    // También guardar lectura individual (sin contenido aún)
    await kv.set(`lectura:${solicitudId}`, {
      id: solicitudId,
      lecturaId: expId,
      nombre: experiencia.nombre,
      icono: obtenerIconoExperiencia(expId),
      categoria: determinarCategoria(expId),
      email: emailNorm,
      runas: experiencia.runas,
      fecha: new Date().toISOString(),
      estado: 'procesando',
      contenido: null,
      resultado: null
    });

    // Si es instantáneo o se pidió generación inmediata, generar ahora
    let resultado = null;
    if ((experiencia.tiempoMs === 0 || generarInmediato) && experiencia.generaIA) {
      try {
        resultado = await generarExperienciaIA(solicitud, experiencia);
        solicitud.estado = 'listo';
        solicitud.resultado = resultado;
        solicitud.fechaCompletado = new Date().toISOString();

        // Actualizar solicitud
        await kv.set(`experiencia:${solicitudId}`, solicitud);

        // Actualizar estado en historial del usuario
        const historialIndex = usuario.historialExperiencias.findIndex(h => h.id === solicitudId);
        if (historialIndex !== -1) {
          usuario.historialExperiencias[historialIndex].estado = 'listo';
          await kv.set(userKey, usuario);
        }

        // Actualizar pendientes
        const pendientesActualizados = pendientes.map(p =>
          p.id === solicitudId ? { ...p, estado: 'listo' } : p
        );
        await kv.set(`lecturas-pendientes:${emailNorm}`, pendientesActualizados);

        // === GAMIFICACIÓN: Actualizar XP y progreso ===
        try {
          const gamificacionData = await actualizarGamificacion(emailNorm, expId, experiencia);
          if (gamificacionData) {
            solicitud.gamificacion = gamificacionData;
            await kv.set(`experiencia:${solicitudId}`, solicitud);
          }
        } catch (gamError) {
          console.error('Error actualizando gamificación:', gamError);
          // No fallar la solicitud por error de gamificación
        }

        // ═══════════════════════════════════════════════════════════════
        // ACTUALIZAR HISTORIAL (cambiar estado de 'procesando' a 'completado')
        // ═══════════════════════════════════════════════════════════════
        try {
          const historialActual = await kv.get(`historial:${emailNorm}`) || [];
          const indexHistorial = historialActual.findIndex(h => h.id === solicitudId);
          if (indexHistorial !== -1) {
            historialActual[indexHistorial].estado = 'completado';
            historialActual[indexHistorial].contenido = resultado?.contenido || null;
            await kv.set(`historial:${emailNorm}`, historialActual);
          }

          // Actualizar lectura individual con el contenido
          await kv.set(`lectura:${solicitudId}`, {
            id: solicitudId,
            lecturaId: expId,
            nombre: experiencia.nombre,
            icono: obtenerIconoExperiencia(expId),
            categoria: determinarCategoria(expId),
            email: emailNorm,
            runas: experiencia.runas,
            fecha: new Date().toISOString(),
            estado: 'completado',
            contenido: resultado?.contenido || null,
            resultado: resultado
          });
        } catch (histError) {
          console.error('Error actualizando historial:', histError);
        }

      } catch (iaError) {
        console.error('Error generando con IA:', iaError);
        solicitud.estado = 'pendiente_revision';
        solicitud.errorIA = iaError.message;
        await kv.set(`experiencia:${solicitudId}`, solicitud);
      }
    }

    // Incluir datos de gamificación si están disponibles
    const gamificacionResponse = solicitud.gamificacion ? {
      xpGanado: solicitud.gamificacion.xpGanado,
      xpTotal: solicitud.gamificacion.xpTotal,
      nivel: solicitud.gamificacion.nivel,
      subioNivel: solicitud.gamificacion.subioNivel,
      lecturasCompletadas: solicitud.gamificacion.lecturasCompletadas
    } : null;

    return Response.json({
      success: true,
      mensaje: resultado
        ? 'Tu experiencia mágica está lista'
        : `Tu ${experiencia.nombre} está siendo preparada. Te avisaremos cuando esté lista.`,
      solicitud: {
        id: solicitudId,
        experiencia: experiencia.nombre,
        estado: solicitud.estado,
        runasGastadas: experiencia.runas,
        runasRestantes: usuario.runas,
        fechaEntregaEstimada: fechaEntrega.toISOString()
      },
      resultado: resultado ? {
        titulo: resultado.titulo,
        contenido: resultado.contenido,
        palabras: resultado.palabras
      } : null,
      gamificacion: gamificacionResponse
    }, { headers: CORS_HEADERS });

  } catch (error) {
    console.error('Error procesando solicitud:', error);
    return Response.json({
      success: false,
      error: error.message
    }, { status: 500, headers: CORS_HEADERS });
  }
}

// GET - Obtener mis experiencias solicitadas
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    const token = searchParams.get('token');
    const id = searchParams.get('id');

    // Obtener email desde token si se proporciona
    let userEmail = email;
    if (token && !email) {
      const tokenData = await kv.get(`token:${token}`);
      if (!tokenData) {
        return Response.json({
          success: false,
          error: 'Token inválido'
        }, { status: 401, headers: CORS_HEADERS });
      }
      userEmail = typeof tokenData === 'string' ? tokenData : tokenData.email;
    }

    if (!userEmail) {
      return Response.json({
        success: false,
        error: 'Email o token requerido'
      }, { status: 400, headers: CORS_HEADERS });
    }

    const emailNorm = userEmail.toLowerCase().trim();

    // Si piden una experiencia específica
    if (id) {
      const solicitud = await kv.get(`experiencia:${id}`);
      if (!solicitud || solicitud.email !== emailNorm) {
        return Response.json({
          success: false,
          error: 'Experiencia no encontrada'
        }, { status: 404, headers: CORS_HEADERS });
      }

      return Response.json({
        success: true,
        experiencia: solicitud
      }, { headers: CORS_HEADERS });
    }

    // Buscar usuario para historial (primero elegido: que es lo que muestra el frontend)
    let userKey = `elegido:${emailNorm}`;
    let usuario = await kv.get(userKey);
    if (!usuario) {
      userKey = `user:${emailNorm}`;
      usuario = await kv.get(userKey);
    }

    if (!usuario) {
      return Response.json({
        success: false,
        error: 'Usuario no encontrado'
      }, { status: 404, headers: CORS_HEADERS });
    }

    const historial = usuario.historialExperiencias || [];

    // Obtener detalles completos de las últimas 10
    const experienciasDetalladas = [];
    for (const item of historial.slice(-10).reverse()) {
      const detalle = await kv.get(`experiencia:${item.id}`);
      if (detalle) {
        experienciasDetalladas.push({
          id: item.id,
          nombre: item.nombre,
          runas: item.runas,
          fecha: item.fecha,
          estado: detalle.estado,
          fechaEntregaEstimada: detalle.fechaEntregaEstimada,
          tieneResultado: !!detalle.resultado
        });
      }
    }

    return Response.json({
      success: true,
      total: historial.length,
      experiencias: experienciasDetalladas,
      runasActuales: usuario.runas || 0
    }, { headers: CORS_HEADERS });

  } catch (error) {
    console.error('Error obteniendo experiencias:', error);
    return Response.json({
      success: false,
      error: error.message
    }, { status: 500, headers: CORS_HEADERS });
  }
}

// Ajustar horario de entrega (evitar horario nocturno Uruguay)
function ajustarHorarioEntrega(fecha) {
  const horaUruguay = new Date(fecha.toLocaleString('en-US', { timeZone: 'America/Montevideo' }));
  const hora = horaUruguay.getHours();

  if (hora >= 22 || hora < 6) {
    // Mover a las 06:30 del día siguiente si es muy tarde
    const nuevaFecha = new Date(horaUruguay);
    if (hora >= 22) {
      nuevaFecha.setDate(nuevaFecha.getDate() + 1);
    }
    nuevaFecha.setHours(6, 30, 0, 0);
    return nuevaFecha;
  }

  return fecha;
}

// Generador de experiencias con IA
async function generarExperienciaIA(solicitud, experiencia) {
  const {
    experienciaId,
    nombreUsuario,
    elemento,
    guardianes,
    contexto,
    preguntaEspecifica,
    fechaNacimiento,
    pronombre
  } = solicitud;

  // Prompts específicos para cada tipo de experiencia
  const prompts = {
    'mensaje_dia': {
      system: `Sos Tito, el duende mensajero de Duendes del Uruguay.
Tu misión es entregar un mensaje del día profundamente personal y significativo.
Usás español rioplatense (vos, tenés, podés).
Tono: cálido, cercano, místico pero accesible.
Pronombre del usuario: ${pronombre || 'ella'}.`,
      user: `Generá un mensaje del día especial para ${nombreUsuario}.
${elemento ? `Su elemento es ${elemento}.` : ''}
${guardianes.length > 0 ? `Su guardián es ${guardianes[0]?.nombre || guardianes[0]}.` : ''}
${contexto ? `Contexto personal: ${contexto}` : ''}

El mensaje debe:
- Tener mínimo 300 palabras
- Sentirse como un abrazo del universo
- Incluir una pequeña profecía o guía para el día
- Terminar con una afirmación de poder`
    },

    'tirada_basica': {
      system: `Sos un maestro runista de Duendes del Uruguay.
Canalizás la sabiduría de las runas nórdicas con profundidad y claridad.
Usás español rioplatense.
Pronombre: ${pronombre || 'ella'}.`,
      user: `Realizá una tirada de 3 runas (Pasado-Presente-Futuro) para ${nombreUsuario}.
${preguntaEspecifica ? `Pregunta específica: ${preguntaEspecifica}` : 'Lectura general de su momento vital'}
${elemento ? `Elemento: ${elemento}` : ''}
${contexto ? `Contexto: ${contexto}` : ''}

Estructura:
1. Introducción (preparando la energía)
2. Primera Runa (Pasado) - nombre, significado, interpretación personal
3. Segunda Runa (Presente) - nombre, significado, interpretación personal
4. Tercera Runa (Futuro) - nombre, significado, interpretación personal
5. Síntesis - cómo se conectan las tres runas
6. Consejo de acción
7. Mensaje de cierre

Mínimo 800 palabras. Sé específico y profundo.`
    },

    'lectura_energia': {
      system: `Sos un lector de energía y campos áuricos de Duendes del Uruguay.
Percibís con claridad los patrones energéticos de las personas.
Usás español rioplatense.
Pronombre: ${pronombre || 'ella'}.`,
      user: `Realizá una lectura energética básica para ${nombreUsuario}.
${elemento ? `Elemento principal: ${elemento}` : ''}
${guardianes.length > 0 ? `Guardián: ${guardianes[0]?.nombre || guardianes[0]}` : ''}
${contexto ? `Contexto: ${contexto}` : ''}

Incluí:
1. Estado general del campo áurico
2. Colores predominantes en el aura
3. Estado de los chakras principales
4. Bloqueos detectados
5. Fortalezas energéticas
6. Recomendaciones de limpieza
7. Cristal recomendado
8. Afirmación de sanación

Mínimo 1000 palabras. Sé detallado y sanador.`
    },

    'guia_cristal': {
      system: `Sos un experto en cristales y minerales mágicos de Duendes del Uruguay.
Conocés profundamente cada piedra y su sabiduría.
Usás español rioplatense.
Pronombre: ${pronombre || 'ella'}.`,
      user: `Creá una guía del cristal del mes para ${nombreUsuario}.
${elemento ? `Elemento: ${elemento}` : ''}
${contexto ? `Situación actual: ${contexto}` : ''}

Estructura:
1. Presentación del cristal elegido y por qué es para ${pronombre === 'él' ? 'él' : 'ella'} ahora
2. Historia y origen del cristal
3. Propiedades energéticas detalladas
4. Cómo conectar con él
5. Ritual de activación personalizado
6. Usos diarios recomendados
7. Combinaciones potentes
8. Meditación guiada con el cristal
9. Mensaje del cristal para ${nombreUsuario}

Mínimo 1200 palabras.`
    },

    'tirada_completa': {
      system: `Sos un gran maestro runista de Duendes del Uruguay.
Canalizás la sabiduría ancestral con profundidad extraordinaria.
Usás español rioplatense.
Pronombre: ${pronombre || 'ella'}.`,
      user: `Realizá una tirada completa de 7 runas para ${nombreUsuario}.
${preguntaEspecifica ? `Pregunta: ${preguntaEspecifica}` : 'Lectura profunda de su camino de vida'}
${elemento ? `Elemento: ${elemento}` : ''}
${contexto ? `Contexto: ${contexto}` : ''}

Las 7 posiciones:
1. Situación presente
2. Obstáculo principal
3. Raíz del asunto
4. Pasado que influye
5. Coronamiento (mejor resultado posible)
6. Futuro próximo
7. Resultado final

Para cada runa: nombre, significado tradicional, interpretación personal profunda.
Incluí síntesis completa y plan de acción.
Mínimo 2000 palabras.`
    },

    'lectura_profunda': {
      system: `Sos un sanador energético avanzado de Duendes del Uruguay.
Leés los campos sutiles con precisión y compasión.
Usás español rioplatense.
Pronombre: ${pronombre || 'ella'}.`,
      user: `Realizá una lectura energética profunda para ${nombreUsuario}.
${elemento ? `Elemento: ${elemento}` : ''}
${guardianes.length > 0 ? `Guardián: ${guardianes[0]?.nombre || guardianes[0]}` : ''}
${contexto ? `Contexto: ${contexto}` : ''}

Incluí análisis de:
1. Campo áurico completo (7 capas)
2. Sistema de chakras detallado (los 7 principales + secundarios)
3. Patrones kármicos detectados
4. Bloqueos y traumas energéticos
5. Líneas de tiempo (pasado-presente-futuro)
6. Conexiones con otros (cuerdas etéricas)
7. Potenciales dormidos
8. Plan de sanación completo
9. Ritual de liberación
10. Meditación de integración

Mínimo 2500 palabras.`
    },

    'ritual_personalizado': {
      system: `Sos un creador de rituales de Duendes del Uruguay.
Diseñás ceremonias personalizadas con poder real.
Usás español rioplatense.
Pronombre: ${pronombre || 'ella'}.`,
      user: `Diseñá un ritual personalizado para ${nombreUsuario}.
${contexto ? `Intención/objetivo: ${contexto}` : 'Ritual de conexión con su poder personal'}
${elemento ? `Elemento: ${elemento}` : ''}
${guardianes.length > 0 ? `Guardián para invocar: ${guardianes[0]?.nombre || guardianes[0]}` : ''}

Incluí:
1. Nombre del ritual
2. Propósito y significado
3. Timing lunar recomendado
4. Materiales necesarios (accesibles)
5. Preparación del espacio
6. Apertura del ritual
7. Cuerpo del ritual (paso a paso detallado)
8. Invocaciones y palabras de poder
9. Cierre del ritual
10. Señales de que funcionó
11. Mantenimiento post-ritual

Mínimo 2000 palabras. Que sea realizable y poderoso.`
    },

    'estudio_numerologico': {
      system: `Sos un numerólogo experto de Duendes del Uruguay.
Calculás e interpretás los números con profundidad mística.
Usás español rioplatense.
Pronombre: ${pronombre || 'ella'}.`,
      user: `Realizá un estudio numerológico completo para ${nombreUsuario}.
${fechaNacimiento ? `Fecha de nacimiento: ${fechaNacimiento}` : 'Usá tu intuición para los números que resuenan con esta persona'}

Incluí:
1. Número de Vida (calculado o intuido)
2. Número de Expresión
3. Número del Alma
4. Número de Personalidad
5. Número de Año Personal actual (2025/2026)
6. Desafíos numerológicos
7. Ciclos de vida
8. Pináculos
9. Números kármicos
10. Síntesis completa del mapa numerológico
11. Predicciones para los próximos meses
12. Números de poder personales
13. Días favorables del mes

Mínimo 4000 palabras. Detallado y revelador.`
    },

    // === Experiencias de Mi Magia ===
    'tirada-runas': {
      system: `Sos un maestro runista de Duendes del Uruguay.
Canalizás la sabiduría de las runas nórdicas con profundidad y claridad.
Usás español rioplatense (vos, tenés, podés).
Pronombre: ${pronombre || 'ella'}.`,
      user: `Realizá una tirada de 3 runas para ${nombreUsuario}.
${preguntaEspecifica ? `Pregunta: ${preguntaEspecifica}` : 'Lectura general'}
${contexto ? `Contexto: ${contexto}` : ''}
${elemento ? `Elemento: ${elemento}` : ''}

Estructura tu respuesta así:
1. Introducción cálida y preparación de la energía
2. Primera Runa - nombre, símbolo, significado e interpretación para esta persona
3. Segunda Runa - nombre, símbolo, significado e interpretación
4. Tercera Runa - nombre, símbolo, significado e interpretación
5. Síntesis de las tres runas juntas
6. Consejo práctico de acción
7. Cierre con bendición

Mínimo 800 palabras. Sé específico y personal.`
    },

    'susurro-guardian': {
      system: `Sos un canalizador de guardianes elementales de Duendes del Uruguay.
Conectás con los duendes y guardianes para transmitir sus mensajes.
Usás español rioplatense.
Pronombre: ${pronombre || 'ella'}.`,
      user: `${nombreUsuario} está buscando conectar con su guardián.
${contexto ? `Situación: ${contexto}` : ''}
${elemento ? `Su elemento es: ${elemento}` : ''}
${guardianes.length > 0 ? `Ya tiene conexión con: ${guardianes.map(g => g?.nombre || g).join(', ')}` : ''}

Canaliza un mensaje profundo del guardián que está esperando a esta persona.
Incluí:
- Presentación del guardián (cómo se ve, qué energía tiene)
- Por qué eligió a esta persona
- Mensaje específico para su momento actual
- Cómo pueden fortalecer su conexión
- Una señal que le dará para confirmar su presencia

Mínimo 600 palabras. Que sea mágico y personal.`
    },

    'oraculo-mes': {
      system: `Sos un oráculo de Duendes del Uruguay que lee las energías del mes.
Combinás astrología, fases lunares y sabiduría elemental.
Usás español rioplatense.
Pronombre: ${pronombre || 'ella'}.`,
      user: `Creá un oráculo del mes para ${nombreUsuario}.
${contexto ? `Área de enfoque: ${contexto}` : ''}
${elemento ? `Elemento: ${elemento}` : ''}

Estructura:
1. Energía general del mes
2. Fase lunar más importante y qué hacer en cada una
3. Días favorables y desfavorables
4. Área de amor/relaciones
5. Área de trabajo/dinero
6. Área de salud/energía
7. Rituales sugeridos para cada semana
8. Cristal y elemento del mes
9. Mensaje de cierre y afirmación

Mínimo 1500 palabras.`
    },

    'gran-oraculo': {
      system: `Sos el Gran Oráculo de Duendes del Uruguay.
Tenés visión de los próximos 3 meses con claridad y profundidad.
Usás español rioplatense.
Pronombre: ${pronombre || 'ella'}.`,
      user: `Creá el Gran Oráculo para ${nombreUsuario}.
${fechaNacimiento ? `Nacimiento: ${fechaNacimiento}` : ''}
${contexto ? `Pregunta principal: ${contexto}` : ''}
${elemento ? `Elemento: ${elemento}` : ''}

Incluí:
1. Visión general de los próximos 3 meses
2. Tirada de 7 runas maestras con interpretación
3. Mapa mes a mes (detallado)
4. Análisis de cada área de vida
5. Desafíos que vendrán y cómo superarlos
6. Oportunidades a aprovechar
7. Tres rituales completamente personalizados
8. Cristales y hierbas recomendadas
9. Mensaje de los ancestros
10. Profecía de cierre

Mínimo 2500 palabras. Que sea una guía completa.`
    },

    'lectura-alma': {
      system: `Sos un lector de almas de Duendes del Uruguay.
Accedés a la esencia profunda y el propósito de vida de las personas.
Usás español rioplatense.
Pronombre: ${pronombre || 'ella'}.`,
      user: `Realizá una lectura del alma para ${nombreUsuario}.
${fechaNacimiento ? `Nacimiento: ${fechaNacimiento}` : ''}
${contexto ? `Patrones que repite: ${contexto}` : ''}
${elemento ? `Elemento: ${elemento}` : ''}

Estructura:
1. Esencia del alma (quién es en su núcleo)
2. Misión de vida revelada
3. Número de vida y su significado profundo
4. Dones innatos que vinieron a desarrollar
5. Patrones kármicos que están trabajando
6. Bloqueos a liberar
7. Guía para los próximos 6 meses
8. Meditación personalizada para conectar con su alma
9. Afirmación de poder personal
10. Mensaje de los guías

Mínimo 3000 palabras.`
    },

    'registros-akashicos': {
      system: `Sos un guardián de los Registros Akáshicos de Duendes del Uruguay.
Accedés a la biblioteca cósmica con reverencia y claridad.
Usás español rioplatense.
Pronombre: ${pronombre || 'ella'}.`,
      user: `Abrí los Registros Akáshicos para ${nombreUsuario}.
${fechaNacimiento ? `Nacimiento: ${fechaNacimiento}` : ''}
${contexto ? `Miedos inexplicables o atracciones: ${contexto}` : ''}
${elemento ? `Elemento: ${elemento}` : ''}

Incluí:
1. Ceremonia de apertura de los registros
2. Tres vidas pasadas relevantes para su presente
3. Contratos álmicos vigentes
4. Karma pendiente y cómo resolverlo
5. Mensajes de sus guías y maestros
6. Su misión específica en esta encarnación
7. Dones de vidas pasadas que puede activar
8. Ritual de integración
9. Cierre ceremonial

Mínimo 4000 palabras. Profundo y revelador.`
    },

    'carta-ancestral': {
      system: `Sos un médium ancestral de Duendes del Uruguay.
Canalizás mensajes del linaje con amor y claridad.
Usás español rioplatense.
Pronombre: ${pronombre || 'ella'}.`,
      user: `Canaliza una carta ancestral para ${nombreUsuario}.
${contexto ? `Ancestro específico o patrones familiares: ${contexto}` : ''}
${elemento ? `Elemento: ${elemento}` : ''}

Incluí:
1. Conexión con el linaje (quién se presenta)
2. Mensaje canalizado directamente
3. Bendiciones de línea familiar
4. Patrones heredados que pueden sanar
5. Dones ancestrales que pueden recuperar
6. Protección ancestral activada
7. Ritual de ofrenda sugerido
8. Cierre con bendición del linaje

Mínimo 1200 palabras.`
    },

    'mapa-energetico': {
      system: `Sos un sanador energético de Duendes del Uruguay.
Leés el campo áurico y los chakras con precisión.
Usás español rioplatense.
Pronombre: ${pronombre || 'ella'}.`,
      user: `Creá un mapa energético para ${nombreUsuario}.
${contexto ? `Síntomas: ${contexto}` : ''}
${elemento ? `Elemento: ${elemento}` : ''}

Incluí:
1. Estado general del campo áurico
2. Análisis de cada chakra (los 7 principales)
3. Bloqueos identificados y su origen
4. Fugas energéticas y cómo sellarlas
5. Plan de limpieza de 21 días
6. Cristales para cada chakra
7. Ejercicios energéticos diarios
8. Afirmaciones personalizadas
9. Meditación de sanación

Mínimo 2000 palabras.`
    },

    'pregunta-especifica': {
      system: `Sos un oráculo directo de Duendes del Uruguay.
Das respuestas claras y al punto, sin rodeos.
Usás español rioplatense.
Pronombre: ${pronombre || 'ella'}.`,
      user: `${nombreUsuario} tiene una pregunta específica:
"${preguntaEspecifica || contexto || 'Necesito claridad sobre mi situación actual'}"
${elemento ? `Elemento: ${elemento}` : ''}

Respondé de forma directa:
1. La respuesta clara (sí/no/depende de...)
2. Por qué es así
3. Pros y contras de cada opción
4. Timing sugerido (cuándo actuar)
5. Obstáculos posibles y cómo superarlos
6. Consejo final concreto

Mínimo 500 palabras. Directo pero profundo.`
    }
  };

  const promptConfig = prompts[solicitud.experienciaId];
  if (!promptConfig) {
    // Fallback genérico si no hay prompt específico
    return generarExperienciaGenerica(solicitud, experiencia);
  }

  // Añadir contexto del canon
  const systemEnhanced = `${promptConfig.system}

CONTEXTO DEL UNIVERSO DUENDES:
${JSON.stringify({
  tono: canon.tono_comunicacion,
  elementos: canon.elementos,
  cristales_principales: canon.cristales.principales.slice(0, 5)
}, null, 2)}

REGLAS CRÍTICAS:
- Mínimo ${experiencia.palabras} palabras (OBLIGATORIO)
- Español rioplatense natural (vos, tenés, podés)
- Profundo, significativo y personalizado
- Firmá siempre como parte de la familia Duendes del Uruguay`;

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 8000,
    system: systemEnhanced,
    messages: [{ role: 'user', content: promptConfig.user }]
  });

  const contenido = response.content[0]?.text || '';
  const palabras = contenido.split(/\s+/).length;

  return {
    titulo: experiencia.nombre,
    contenido,
    palabras,
    fechaGeneracion: new Date().toISOString()
  };
}

// Fallback genérico para experiencias sin prompt específico
async function generarExperienciaGenerica(solicitud, experiencia) {
  const {
    nombreUsuario,
    elemento,
    guardianes,
    contexto,
    preguntaEspecifica,
    pronombre
  } = solicitud;

  const systemPrompt = `Sos un canalizador de Duendes del Uruguay.
Creás experiencias mágicas personalizadas con profundidad y calidez.
Usás español rioplatense (vos, tenés, podés).
Pronombre del usuario: ${pronombre || 'ella'}.`;

  const userPrompt = `Creá una ${experiencia.nombre} para ${nombreUsuario}.
${elemento ? `Elemento: ${elemento}` : ''}
${guardianes?.length > 0 ? `Guardianes: ${guardianes.map(g => g?.nombre || g).join(', ')}` : ''}
${contexto ? `Contexto: ${contexto}` : ''}
${preguntaEspecifica ? `Pregunta: ${preguntaEspecifica}` : ''}

Creá un contenido profundo, personal y mágico de mínimo ${experiencia.palabras} palabras.
Que sea útil, sanador y memorable para quien lo recibe.`;

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 8000,
    system: systemPrompt,
    messages: [{ role: 'user', content: userPrompt }]
  });

  const contenido = response.content[0]?.text || '';
  const palabras = contenido.split(/\s+/).length;

  return {
    titulo: experiencia.nombre,
    contenido,
    palabras,
    fechaGeneracion: new Date().toISOString()
  };
}

// ═══════════════════════════════════════════════════════════════
// HELPER: Obtener icono de experiencia
// ═══════════════════════════════════════════════════════════════
function obtenerIconoExperiencia(tipo) {
  const iconos = {
    'susurro_guardian': '👂',
    'mensaje_universo': '🌌',
    'carta_ancestros': '📜',
    'estado_guardian': '✨',
    'mision_guardian': '🎯',
    'comunicacion_guardian': '💬',
    'historia_guardian': '📖',
    'elemento_dominante': '🌍',
    'sanacion_elemental': '💚',
    'elemental_personal': '🌀',
    'cristal_alma': '💎',
    'grid_cristales': '💠',
    'limpieza_cristales': '🧹',
    'tarot_profundo': '🎴',
    'oraculo_duendes': '🔮',
    'carta_año': '📅',
    'tirada_3_runas': 'ᚱ',
    'tirada_runas_3': 'ᚱ',
    'tirada_5_runas': 'ᚱᛏ',
    'tirada_7_runas': 'ᚱᛏᚠ',
    'tirada_runas_9': 'ᚱᛏ',
    'tirada-runas': 'ᚱ',
    'runa_personal': 'ᚠ',
    'luna_personal': '🌙',
    'ciclo_lunar_mes': '🌕',
    'lectura_aura': '🌈',
    'corte_cordones': '✂️',
    'chakras_estado': '🔴',
    'mision_alma': '🎯',
    'contratos_alma': '📝',
    'vidas_pasadas': '🔄',
    'escudo_protector': '🛡️',
    'limpieza_casa': '🏠',
    'deteccion_influencias': '👁️',
    'consejo_bosque': '🌲',
    'energia_dia': '☀️',
    'mensaje_dia': '📨',
    'oraculo_elementales': '🌍',
    'mapa_energia': '🗺️',
    'ritual_mes': '🕯️',
    'numerologia_personal': '🔢',
    'tarot_simple': '🃏',
    'mensaje_guardian': '💬',
    'carta_astral_esencial': '⭐',
    'lectura_año_personal': '📅',
    'conexion_guardian': '💚',
    'estudio_alma': '👁️',
    'conexion_ancestros': '🌳',
    'registros_akashicos': '📜',
    'proposito_vida': '🎯',
    'gran_estudio_anual': '📚',
    'susurro-guardian': '👂',
    'oraculo-mes': '🔮',
    'gran-oraculo': '🌟',
    'lectura-alma': '👁️',
    'registros-akashicos': '📜',
    'carta-ancestral': '🌳',
    'mapa-energetico': '🗺️',
    'pregunta-especifica': '❓'
  };
  return iconos[tipo] || '✨';
}
