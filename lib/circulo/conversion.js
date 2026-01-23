/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * SISTEMA DE CONVERSION INTELIGENTE DEL CIRCULO
 * Exportacion centralizada de todos los modulos
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Este archivo centraliza todas las funciones del sistema de conversion
 * inteligente para El Circulo de Duendes.
 *
 * MODULOS:
 * - perfilado: Analisis psicologico del usuario
 * - sincronicidad: Mensajes "magicos" personalizados
 * - escasez: Sistema de escasez real con KV
 */

// ===== PERFILADO PSICOLOGICO =====
export {
  calcularPerfil,
  guardarPerfil,
  obtenerPerfil,
  perfilNecesitaActualizacion,
  NIVELES_VULNERABILIDAD,
  TIPOS_DOLOR,
  ESTILOS_DECISION,
  TIPOS_CREENCIAS
} from './perfilado.js';

// ===== MOTOR DE SINCRONICIDAD =====
export {
  generarSincronicidad,
  generarBienvenidaCirculo,
  generarMensajeActivacionTrial,
  DIAS_SEMANA,
  HORAS_MAGICAS,
  LETRAS_INICIALES,
  MESES_NACIMIENTO
} from './sincronicidad.js';

// ===== SISTEMA DE ESCASEZ =====
export {
  obtenerMiembrosActivos,
  incrementarMiembros,
  decrementarMiembros,
  obtenerLugaresDisponibles,
  obtenerPersonasViendo,
  registrarVisitaActiva,
  generarMensajeEscasez,
  generarMensajeTiming,
  obtenerEstadisticasEscasez,
  obtenerDatosEscasez
} from './escasez.js';

// ===== FUNCION DE ANALISIS COMPLETO =====

import { calcularPerfil, guardarPerfil, obtenerPerfil } from './perfilado.js';
import { generarSincronicidad, generarBienvenidaCirculo } from './sincronicidad.js';
import { obtenerDatosEscasez, registrarVisitaActiva } from './escasez.js';

/**
 * Analiza un usuario y devuelve todos los datos para personalizacion
 * @param {Object} opciones - Datos del usuario
 * @param {string} opciones.email - Email del usuario
 * @param {string} opciones.nombre - Nombre
 * @param {string} opciones.cumpleanos - Fecha de nacimiento YYYY-MM-DD
 * @param {Object} opciones.respuestasTest - Respuestas del test del guardian
 * @returns {Object} Analisis completo para personalizacion
 */
export async function analizarUsuarioCompleto(opciones = {}) {
  const { email, nombre, cumpleanos, respuestasTest } = opciones;

  // 1. Obtener o calcular perfil
  let perfil = null;
  if (email) {
    perfil = await obtenerPerfil(email);
  }
  if (!perfil && respuestasTest) {
    perfil = calcularPerfil(respuestasTest);
    if (email) {
      await guardarPerfil(email, perfil);
    }
  }

  // 2. Generar sincronicidad
  const sincronicidad = generarSincronicidad({
    nombre,
    cumpleanos,
    fechaVisita: new Date()
  });

  // 3. Generar bienvenida
  const bienvenida = generarBienvenidaCirculo({ nombre });

  // 4. Obtener datos de escasez
  const perfilCierre = perfil?.conversion?.cierreRecomendado || 'vulnerable';
  const escasez = await obtenerDatosEscasez(perfilCierre);

  // 5. Registrar visita
  if (email) {
    await registrarVisitaActiva(email);
  }

  return {
    // Perfil psicologico
    perfil: perfil || {
      vulnerabilidad: { nivel: 'media' },
      dolor: { tipo: 'proposito' },
      estilo: { tipo: 'emocional' },
      creencias: { tipo: 'buscador', mostrarMagia: 60 },
      conversion: { cierreRecomendado: 'vulnerable' }
    },

    // Sincronicidad (mensaje magico)
    sincronicidad: {
      mensaje: sincronicidad.mensajePrincipal,
      detalles: sincronicidad.sincronicidades,
      momento: sincronicidad.momento,
      intensidad: sincronicidad.intensidadTotal
    },

    // Bienvenida personalizada
    bienvenida: {
      mensaje: bienvenida.mensaje,
      color: bienvenida.colorEnergetico
    },

    // Datos de escasez
    escasez,

    // Recomendaciones de contenido
    recomendaciones: {
      // Nivel de magia en el contenido (0-100)
      nivelMagia: perfil?.creencias?.mostrarMagia || 60,

      // Tipo de cierre a usar
      cierre: perfilCierre,

      // Micro-compromiso sugerido
      microCompromiso: perfil?.conversion?.microCompromisoSugerido || {
        tipo: 'email_avisos',
        descripcion: 'Suscribirse a avisos del Circulo'
      },

      // Beneficios a destacar segun dolor
      beneficiosDestacados: obtenerBeneficiosSegunDolor(perfil?.dolor?.tipo)
    },

    // Metadata
    meta: {
      analizado: new Date().toISOString(),
      tieneEmail: !!email,
      tienePerfil: !!perfil,
      tieneTest: !!respuestasTest
    }
  };
}

/**
 * Obtiene beneficios del Circulo relevantes al dolor del usuario
 */
function obtenerBeneficiosSegunDolor(tipoDolor) {
  const beneficios = {
    soledad: [
      'Comunidad de personas que entienden',
      'Foro privado sin juicios',
      'Mensaje diario de un guardian'
    ],
    dinero: [
      'Rituales de abundancia cada portal',
      'Guardianes especializados en prosperidad',
      'Ensenanzas sobre merecimiento'
    ],
    salud: [
      'Meditaciones guiadas diarias',
      'Guardianes de sanacion',
      'Rituales de bienestar'
    ],
    relaciones: [
      'Ensenanzas sobre limites sanos',
      'Guardianes del amor y conexion',
      'Comunidad de apoyo'
    ],
    proposito: [
      '52 guardianes al ano, cada uno con ensenanzas',
      'Portales estacionales con tematicas profundas',
      'Herramientas de autoconocimiento'
    ]
  };

  return beneficios[tipoDolor] || beneficios.proposito;
}

// ===== CIERRES POR PERFIL (para usar en landing/contenido) =====

export const CIERRES_CIRCULO = {
  vulnerable: {
    titulo: 'Este es tu espacio',
    mensaje: 'No tenes que tomar ninguna decision ahora. Solo quiero que sepas que aca hay un lugar para vos cuando estes lista. Sin presiones, sin apuros.',
    cta: 'Quiero saber mas',
    tono: 'suave',
    urgencia: 0
  },
  esceptico: {
    titulo: 'Sin promesas magicas',
    mensaje: 'No te vamos a decir que esto cambia vidas. Lo que si podemos decir: miles de personas encontraron algo aca. Proba 15 dias gratis y saca tus propias conclusiones.',
    cta: 'Probar sin compromiso',
    tono: 'directo',
    urgencia: 20
  },
  impulsivo: {
    titulo: 'El momento es ahora',
    mensaje: 'Algo te trajo hasta aca. No ignores eso. Los lugares en el Circulo son limitados y este mes quedan pocos. Tu intuicion ya decidio.',
    cta: 'Activar mi lugar',
    tono: 'urgente',
    urgencia: 80
  },
  racional: {
    titulo: 'Los numeros hablan',
    mensaje: 'Por menos de $7 al mes tenes acceso a 52 guardianes, contenido semanal exclusivo, comunidad privada y descuento en tienda. 15 dias de prueba gratis.',
    cta: 'Ver planes detallados',
    tono: 'logico',
    urgencia: 40
  },
  coleccionista: {
    titulo: 'Para quienes ya entienden',
    mensaje: 'Vos ya sabes como funcionan los guardianes. Imagina conocer a uno nuevo cada semana, con su historia, su ritual, sus ensenanzas. Un ano entero de magia organizada.',
    cta: 'Unirme ahora',
    tono: 'exclusivo',
    urgencia: 60
  }
};

/**
 * Obtiene el cierre apropiado para un perfil
 */
export function obtenerCierreParaPerfil(perfilCierre) {
  return CIERRES_CIRCULO[perfilCierre] || CIERRES_CIRCULO.vulnerable;
}

// ===== MICRO-COMPROMISOS =====

export const MICRO_COMPROMISOS = [
  {
    paso: 1,
    id: 'test_gratis',
    nombre: 'Test del Guardian',
    descripcion: 'Descubri que guardian resuena con vos',
    conversionSiguiente: 0.3 // 30% pasa al siguiente
  },
  {
    paso: 2,
    id: 'email_avisos',
    nombre: 'Avisos del Circulo',
    descripcion: 'Recibir novedades y contenido gratuito',
    conversionSiguiente: 0.25
  },
  {
    paso: 3,
    id: 'preview_contenido',
    nombre: 'Preview de Contenido',
    descripcion: 'Ver un adelanto del contenido exclusivo',
    conversionSiguiente: 0.4
  },
  {
    paso: 4,
    id: 'trial_15_dias',
    nombre: 'Prueba Gratuita',
    descripcion: '15 dias de acceso completo sin compromiso',
    conversionSiguiente: 0.35
  },
  {
    paso: 5,
    id: 'membresia_paga',
    nombre: 'Membresia',
    descripcion: 'Acceso completo al Circulo',
    conversionSiguiente: 1 // Final
  }
];

/**
 * Obtiene el proximo micro-compromiso sugerido
 */
export function obtenerProximoMicroCompromiso(pasoActual) {
  if (pasoActual >= MICRO_COMPROMISOS.length) {
    return null;
  }
  return MICRO_COMPROMISOS[pasoActual];
}

export default {
  analizarUsuarioCompleto,
  obtenerCierreParaPerfil,
  obtenerProximoMicroCompromiso,
  CIERRES_CIRCULO,
  MICRO_COMPROMISOS
};
