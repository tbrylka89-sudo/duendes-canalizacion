/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * SISTEMA DE ESCASEZ REAL PARA EL CIRCULO
 * Maneja contadores reales de miembros y genera escasez creible
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import { kv } from '@vercel/kv';

// ===== CONFIGURACION =====

const CONFIG = {
  // Limite de miembros por mes (ajustable)
  limiteMensual: 100,

  // Limite total del Circulo (da sensacion de exclusividad)
  limiteTotal: 500,

  // Minimo de "lugares disponibles" a mostrar (nunca decir 0)
  minimoLugares: 3,

  // Keys en KV
  keys: {
    contadorMiembros: 'circulo:contador:miembros',
    contadorMensual: 'circulo:contador:mensual',
    mesActual: 'circulo:mes:actual',
    visitantesActivos: 'circulo:visitantes:activos',
    historialMiembros: 'circulo:historial:miembros'
  }
};

// ===== FUNCIONES DE CONTEO REAL =====

/**
 * Obtiene el numero real de miembros activos
 */
export async function obtenerMiembrosActivos() {
  try {
    const contador = await kv.get(CONFIG.keys.contadorMiembros);
    return contador || 0;
  } catch (error) {
    console.error('[ESCASEZ] Error obteniendo miembros:', error);
    return 47; // Valor fallback creible
  }
}

/**
 * Incrementa el contador de miembros (llamar al activar membresia)
 */
export async function incrementarMiembros() {
  try {
    const nuevoTotal = await kv.incr(CONFIG.keys.contadorMiembros);

    // Tambien incrementar contador mensual
    const mesActual = new Date().toISOString().slice(0, 7); // YYYY-MM
    const mesGuardado = await kv.get(CONFIG.keys.mesActual);

    if (mesGuardado !== mesActual) {
      // Nuevo mes, resetear contador mensual
      await kv.set(CONFIG.keys.mesActual, mesActual);
      await kv.set(CONFIG.keys.contadorMensual, 1);
    } else {
      await kv.incr(CONFIG.keys.contadorMensual);
    }

    // Guardar en historial
    await registrarEnHistorial('nuevo_miembro', { total: nuevoTotal });

    return nuevoTotal;
  } catch (error) {
    console.error('[ESCASEZ] Error incrementando miembros:', error);
    return null;
  }
}

/**
 * Decrementa el contador (llamar al cancelar membresia)
 */
export async function decrementarMiembros() {
  try {
    const nuevoTotal = await kv.decr(CONFIG.keys.contadorMiembros);
    await registrarEnHistorial('baja_miembro', { total: nuevoTotal });
    return Math.max(0, nuevoTotal);
  } catch (error) {
    console.error('[ESCASEZ] Error decrementando miembros:', error);
    return null;
  }
}

// ===== FUNCIONES DE ESCASEZ =====

/**
 * Calcula lugares disponibles este mes
 */
export async function obtenerLugaresDisponibles() {
  try {
    const mesActual = new Date().toISOString().slice(0, 7);
    const mesGuardado = await kv.get(CONFIG.keys.mesActual);

    let miembrosMes = 0;
    if (mesGuardado === mesActual) {
      miembrosMes = await kv.get(CONFIG.keys.contadorMensual) || 0;
    }

    const disponibles = CONFIG.limiteMensual - miembrosMes;
    return Math.max(CONFIG.minimoLugares, disponibles);
  } catch (error) {
    console.error('[ESCASEZ] Error calculando lugares:', error);
    return 23; // Fallback creible
  }
}

/**
 * Obtiene personas viendo la pagina ahora (semi-real)
 * Basado en visitas recientes + variacion realista
 */
export async function obtenerPersonasViendo() {
  try {
    // Obtener visitas de los ultimos 10 minutos
    const ahora = Date.now();
    const hace10min = ahora - (10 * 60 * 1000);

    // Intentar obtener contador de visitantes activos
    let visitantesReales = await kv.get(CONFIG.keys.visitantesActivos) || 0;

    // Agregar variacion basada en hora del dia
    const hora = new Date().getHours();
    let multiplicador = 1;

    if (hora >= 0 && hora < 6) multiplicador = 0.3;      // Noche: pocos
    else if (hora >= 6 && hora < 9) multiplicador = 0.6;  // Manana temprano
    else if (hora >= 9 && hora < 12) multiplicador = 1;   // Manana: normal
    else if (hora >= 12 && hora < 14) multiplicador = 0.8; // Almuerzo
    else if (hora >= 14 && hora < 18) multiplicador = 1.2; // Tarde: pico
    else if (hora >= 18 && hora < 22) multiplicador = 1.5; // Noche: maximo
    else multiplicador = 0.7; // Noche tarde

    // Base minima + visitantes reales + variacion
    const base = Math.max(2, visitantesReales);
    const variacion = Math.floor(Math.random() * 5);
    const total = Math.round((base + variacion) * multiplicador);

    return Math.max(1, Math.min(30, total)); // Entre 1 y 30
  } catch (error) {
    console.error('[ESCASEZ] Error obteniendo visitantes:', error);
    return calcularVisitantesFallback();
  }
}

function calcularVisitantesFallback() {
  const hora = new Date().getHours();
  if (hora >= 0 && hora < 6) return Math.floor(Math.random() * 3) + 1;
  if (hora >= 6 && hora < 12) return Math.floor(Math.random() * 8) + 3;
  if (hora >= 12 && hora < 18) return Math.floor(Math.random() * 12) + 5;
  return Math.floor(Math.random() * 15) + 8;
}

/**
 * Registra una visita activa
 */
export async function registrarVisitaActiva(email) {
  try {
    // Incrementar contador de visitantes activos
    await kv.incr(CONFIG.keys.visitantesActivos);

    // El contador se decrementa automaticamente despues de 10 min
    setTimeout(async () => {
      try {
        await kv.decr(CONFIG.keys.visitantesActivos);
      } catch (e) { /* ignorar */ }
    }, 10 * 60 * 1000);

    return true;
  } catch (error) {
    console.error('[ESCASEZ] Error registrando visita:', error);
    return false;
  }
}

// ===== FUNCIONES DE URGENCIA =====

/**
 * Genera mensaje de escasez apropiado segun contexto
 */
export function generarMensajeEscasez(lugaresDisponibles, personasViendo, perfilCierre) {
  // No mostrar escasez a vulnerables
  if (perfilCierre === 'vulnerable') {
    return null;
  }

  // Mensajes segun nivel de escasez
  if (lugaresDisponibles <= 5) {
    return {
      tipo: 'critico',
      mensaje: `Solo quedan ${lugaresDisponibles} lugares este mes`,
      urgencia: 'alta',
      icono: 'alert'
    };
  }

  if (lugaresDisponibles <= 15) {
    return {
      tipo: 'moderado',
      mensaje: `${lugaresDisponibles} lugares disponibles este mes`,
      urgencia: 'media',
      icono: 'clock'
    };
  }

  // Si hay muchas personas viendo, usar eso
  if (personasViendo >= 10) {
    return {
      tipo: 'social',
      mensaje: `${personasViendo} personas explorando ahora`,
      urgencia: 'baja',
      icono: 'users'
    };
  }

  return null;
}

/**
 * Genera mensaje de timing (fin de mes, inicio de portal, etc)
 */
export function generarMensajeTiming() {
  const hoy = new Date();
  const diaDelMes = hoy.getDate();
  const diasEnMes = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0).getDate();
  const diasRestantes = diasEnMes - diaDelMes;

  // Fin de mes
  if (diasRestantes <= 3) {
    return {
      tipo: 'fin_mes',
      mensaje: `Solo quedan ${diasRestantes} días para unirte este mes`,
      urgencia: 'alta'
    };
  }

  // Inicio de mes (buenos precios, nuevo comienzo)
  if (diaDelMes <= 5) {
    return {
      tipo: 'inicio_mes',
      mensaje: 'Nuevo mes, nuevo comienzo perfecto',
      urgencia: 'baja'
    };
  }

  // Mitad de mes
  if (diaDelMes >= 13 && diaDelMes <= 17) {
    return {
      tipo: 'mitad_mes',
      mensaje: 'Todavía estás a tiempo este mes',
      urgencia: 'media'
    };
  }

  return null;
}

// ===== HISTORIAL Y ANALYTICS =====

async function registrarEnHistorial(evento, datos) {
  try {
    const historial = await kv.get(CONFIG.keys.historialMiembros) || [];

    historial.push({
      evento,
      datos,
      fecha: new Date().toISOString()
    });

    // Mantener solo ultimos 100 eventos
    const historialRecortado = historial.slice(-100);
    await kv.set(CONFIG.keys.historialMiembros, historialRecortado);
  } catch (error) {
    console.error('[ESCASEZ] Error registrando historial:', error);
  }
}

/**
 * Obtiene estadisticas de escasez para analytics
 */
export async function obtenerEstadisticasEscasez() {
  try {
    const miembros = await obtenerMiembrosActivos();
    const lugares = await obtenerLugaresDisponibles();
    const visitantes = await obtenerPersonasViendo();
    const historial = await kv.get(CONFIG.keys.historialMiembros) || [];

    // Calcular tendencia
    const ultimaSemana = historial.filter(h => {
      const fecha = new Date(h.fecha);
      const hace7dias = new Date();
      hace7dias.setDate(hace7dias.getDate() - 7);
      return fecha >= hace7dias;
    });

    const nuevosEstaSemana = ultimaSemana.filter(h => h.evento === 'nuevo_miembro').length;
    const bajasEstaSemana = ultimaSemana.filter(h => h.evento === 'baja_miembro').length;

    return {
      miembrosActivos: miembros,
      lugaresDisponibles: lugares,
      visitantesActivos: visitantes,
      tendenciaSemanal: nuevosEstaSemana - bajasEstaSemana,
      tasaOcupacion: Math.round((miembros / CONFIG.limiteTotal) * 100),
      proximoHito: calcularProximoHito(miembros)
    };
  } catch (error) {
    console.error('[ESCASEZ] Error obteniendo estadisticas:', error);
    return null;
  }
}

function calcularProximoHito(miembrosActuales) {
  const hitos = [50, 100, 150, 200, 250, 300, 400, 500];
  for (const hito of hitos) {
    if (miembrosActuales < hito) {
      return {
        numero: hito,
        faltan: hito - miembrosActuales
      };
    }
  }
  return { numero: 500, faltan: 0 };
}

// ===== DATOS COMPLETOS DE ESCASEZ =====

/**
 * Obtiene todos los datos de escasez para la landing
 */
export async function obtenerDatosEscasez(perfilCierre = 'vulnerable') {
  const miembros = await obtenerMiembrosActivos();
  const lugares = await obtenerLugaresDisponibles();
  const visitantes = await obtenerPersonasViendo();

  const mensajeEscasez = generarMensajeEscasez(lugares, visitantes, perfilCierre);
  const mensajeTiming = generarMensajeTiming();

  return {
    miembrosActuales: miembros,
    lugaresDisponibles: lugares,
    personasViendo: visitantes,
    mensajeEscasez,
    mensajeTiming,
    // Solo mostrar numeros a impulsivos y coleccionistas
    mostrarNumeros: perfilCierre === 'impulsivo' || perfilCierre === 'coleccionista',
    // Mostrar social proof a todos excepto escepticos
    mostrarSocialProof: perfilCierre !== 'esceptico'
  };
}

// ===== EXPORTACIONES =====

export default {
  obtenerMiembrosActivos,
  incrementarMiembros,
  decrementarMiembros,
  obtenerLugaresDisponibles,
  obtenerPersonasViendo,
  registrarVisitaActiva,
  generarMensajeEscasez,
  generarMensajeTiming,
  obtenerEstadisticasEscasez,
  obtenerDatosEscasez,
  CONFIG
};
