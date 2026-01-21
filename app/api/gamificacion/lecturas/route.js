import { kv } from '@vercel/kv';
import {
  LECTURAS,
  obtenerTodasLasLecturas,
  obtenerLecturaPorId,
  obtenerNivel,
  puedeAccederALectura
} from '@/lib/gamificacion/config';

// ═══════════════════════════════════════════════════════════════
// GET - Obtener catálogo de lecturas (filtrado por usuario)
// ═══════════════════════════════════════════════════════════════
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');
    const email = searchParams.get('email');
    const categoria = searchParams.get('categoria'); // Filtro opcional
    const soloDisponibles = searchParams.get('disponibles') === 'true';

    let usuario = null;
    let gamificacion = null;
    let nivelUsuario = 'iniciada';
    let tieneGuardian = false;
    let esCirculo = false;
    let tipoMembresia = null;

    // Si hay autenticación, obtener datos del usuario
    if (token || email) {
      let userEmail = email;
      if (token && !email) {
        userEmail = await kv.get(`token:${token}`);
      }

      if (userEmail) {
        usuario = await kv.get(`elegido:${userEmail}`);
        gamificacion = await kv.get(`gamificacion:${userEmail}`);

        if (usuario) {
          tieneGuardian = usuario.guardianes && usuario.guardianes.length > 0;
          esCirculo = usuario.circulo?.activo || false;
          tipoMembresia = usuario.circulo?.plan || null;
        }

        if (gamificacion) {
          const nivel = obtenerNivel(gamificacion.xp);
          nivelUsuario = nivel.id;
        }
      }
    }

    // Construir catálogo - usando las categorías reales de LECTURAS
    const catalogo = {
      duendes: procesarLecturas(LECTURAS.duendes || [], nivelUsuario, tieneGuardian, esCirculo, tipoMembresia),
      clasicas: procesarLecturas(LECTURAS.clasicas || [], nivelUsuario, tieneGuardian, esCirculo, tipoMembresia),
      estudios: procesarLecturas(LECTURAS.estudios || [], nivelUsuario, tieneGuardian, esCirculo, tipoMembresia),
      rituales: procesarLecturas(LECTURAS.rituales || [], nivelUsuario, tieneGuardian, esCirculo, tipoMembresia),
      especiales: procesarLecturas(LECTURAS.especiales || [], nivelUsuario, tieneGuardian, esCirculo, tipoMembresia),
      eventos: procesarLecturasEventos(LECTURAS.eventos || [], nivelUsuario),
      temporada: procesarLecturasTemporada(LECTURAS.temporada || [], esCirculo, tipoMembresia)
    };

    // Filtrar por categoría si se especifica
    if (categoria) {
      const todasLecturas = [
        ...catalogo.duendes,
        ...catalogo.clasicas,
        ...catalogo.estudios,
        ...catalogo.rituales,
        ...catalogo.especiales,
        ...catalogo.eventos,
        ...catalogo.temporada
      ];

      return Response.json({
        success: true,
        lecturas: todasLecturas.filter(l => l.categoria === categoria),
        filtro: { categoria }
      });
    }

    // Filtrar solo disponibles si se especifica
    if (soloDisponibles) {
      catalogo.duendes = catalogo.duendes.filter(l => l.disponible);
      catalogo.clasicas = catalogo.clasicas.filter(l => l.disponible);
      catalogo.estudios = catalogo.estudios.filter(l => l.disponible);
      catalogo.rituales = catalogo.rituales.filter(l => l.disponible);
      catalogo.especiales = catalogo.especiales.filter(l => l.disponible);
      catalogo.eventos = catalogo.eventos.filter(l => l.disponible);
      catalogo.temporada = catalogo.temporada.filter(l => l.disponible);
    }

    // Lecturas destacadas para mostrar primero
    const destacadas = [
      ...catalogo.duendes.filter(l => l.popular),
      ...catalogo.clasicas.filter(l => l.popular),
      ...catalogo.estudios.filter(l => l.popular || l.destacado),
      ...catalogo.rituales.filter(l => l.popular),
      ...catalogo.especiales.filter(l => l.popular)
    ];

    return Response.json({
      success: true,
      usuario: usuario ? {
        nivel: nivelUsuario,
        tieneGuardian,
        esCirculo,
        runas: usuario.runas || 0
      } : null,
      destacadas,
      catalogo,
      eventosActivos: catalogo.eventos.filter(e => e.disponible),
      totalLecturas: contarLecturas(catalogo)
    });

  } catch (error) {
    console.error('Error obteniendo catálogo:', error);
    return Response.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}

// ═══════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════

function procesarLecturas(lecturas, nivelUsuario, tieneGuardian, esCirculo, tipoMembresia) {
  return lecturas.map(lectura => {
    const puedeAcceder = puedeAccederALectura(nivelUsuario, lectura.nivel);
    const cumpleRequisitos = !lectura.requiereGuardian || tieneGuardian;

    // Calcular descuento si tiene membresía
    let precioFinal = lectura.runas;
    let descuento = 0;

    if (esCirculo && tipoMembresia === 'anual') {
      descuento = 10;
      precioFinal = Math.round(lectura.runas * 0.9);
    } else if (esCirculo && tipoMembresia === 'semestral') {
      descuento = 5;
      precioFinal = Math.round(lectura.runas * 0.95);
    }

    return {
      ...lectura,
      disponible: puedeAcceder && cumpleRequisitos,
      bloqueadoPorNivel: !puedeAcceder,
      bloqueadoPorGuardian: lectura.requiereGuardian && !tieneGuardian,
      precioOriginal: lectura.runas,
      precioFinal,
      descuento,
      nivelRequerido: lectura.nivel
    };
  });
}

function procesarLecturasEventos(lecturas, nivelUsuario) {
  const ahora = new Date();

  return lecturas.map(lectura => {
    const puedeAcceder = puedeAccederALectura(nivelUsuario, lectura.nivel);
    let disponible = puedeAcceder;
    let razonNoDisponible = null;
    let proximaDisponibilidad = null;

    // Verificar disponibilidad según tipo de evento
    if (lectura.disponibilidad === 'luna_llena') {
      const esLunaLlena = verificarLunaLlena(ahora);
      disponible = puedeAcceder && esLunaLlena;
      if (!esLunaLlena) {
        razonNoDisponible = 'Solo disponible durante luna llena';
        proximaDisponibilidad = calcularProximaLunaLlena(ahora);
      }
    } else if (lectura.disponibilidad === 'luna_nueva') {
      const esLunaNueva = verificarLunaNueva(ahora);
      disponible = puedeAcceder && esLunaNueva;
      if (!esLunaNueva) {
        razonNoDisponible = 'Solo disponible durante luna nueva';
        proximaDisponibilidad = calcularProximaLunaNueva(ahora);
      }
    } else if (lectura.disponibilidad === 'random') {
      // La lectura secreta aparece random (simular con hash del día)
      const diaHash = ahora.getDate() + ahora.getMonth() * 31;
      disponible = puedeAcceder && (diaHash % 4 === 0); // ~2 días por semana
      if (!disponible && puedeAcceder) {
        razonNoDisponible = 'La lectura secreta aparece por tiempo limitado';
      }
    }

    return {
      ...lectura,
      disponible,
      bloqueadoPorNivel: !puedeAcceder,
      razonNoDisponible,
      proximaDisponibilidad,
      esEvento: true,
      precioFinal: lectura.runas
    };
  });
}

function procesarLecturasTemporada(lecturas, esCirculo, tipoMembresia) {
  const ahora = new Date();
  const mes = ahora.getMonth(); // 0-11
  const dia = ahora.getDate();

  return lecturas.map(lectura => {
    // Determinar si está en fecha
    const fechaPortal = lectura.fecha; // ej: "junio_21"
    const enFecha = verificarFechaPortal(fechaPortal, mes, dia);

    // Precio: gratis para anuales, precio completo para otros
    let precioFinal = lectura.runasSinMembresia || 150;
    let esGratis = false;

    if (esCirculo && tipoMembresia === 'anual') {
      precioFinal = 0;
      esGratis = true;
    }

    return {
      ...lectura,
      disponible: enFecha,
      esGratis,
      precioOriginal: lectura.runasSinMembresia || 150,
      precioFinal,
      enFecha,
      razonNoDisponible: enFecha ? null : 'Solo disponible durante el portal estacional',
      esTemporada: true
    };
  });
}

// Funciones de calendario lunar (simplificadas)
function verificarLunaLlena(fecha) {
  // Ciclo lunar aproximado de 29.5 días
  // Luna llena de referencia: 17 enero 2026
  const lunaLlenaRef = new Date(2026, 0, 17);
  const diff = Math.abs(fecha - lunaLlenaRef);
  const ciclo = 29.5 * 24 * 60 * 60 * 1000;
  const posicionEnCiclo = (diff % ciclo) / ciclo;

  // Luna llena cuando está cerca de 0 o 1
  return posicionEnCiclo < 0.05 || posicionEnCiclo > 0.95;
}

function verificarLunaNueva(fecha) {
  const lunaLlenaRef = new Date(2026, 0, 17);
  const diff = Math.abs(fecha - lunaLlenaRef);
  const ciclo = 29.5 * 24 * 60 * 60 * 1000;
  const posicionEnCiclo = (diff % ciclo) / ciclo;

  // Luna nueva cuando está cerca de 0.5
  return posicionEnCiclo > 0.45 && posicionEnCiclo < 0.55;
}

function calcularProximaLunaLlena(fecha) {
  const ciclo = 29.5 * 24 * 60 * 60 * 1000;
  const lunaLlenaRef = new Date(2026, 0, 17);
  let proxima = new Date(lunaLlenaRef);

  while (proxima <= fecha) {
    proxima = new Date(proxima.getTime() + ciclo);
  }

  return proxima.toISOString().split('T')[0];
}

function calcularProximaLunaNueva(fecha) {
  const ciclo = 29.5 * 24 * 60 * 60 * 1000;
  const lunaLlenaRef = new Date(2026, 0, 17);
  let proximaLlena = new Date(lunaLlenaRef);

  while (proximaLlena <= fecha) {
    proximaLlena = new Date(proximaLlena.getTime() + ciclo);
  }

  // Luna nueva es ~14.75 días después de luna llena
  const proximaNueva = new Date(proximaLlena.getTime() + (14.75 * 24 * 60 * 60 * 1000));

  return proximaNueva.toISOString().split('T')[0];
}

function verificarFechaPortal(fechaPortal, mes, dia) {
  const portales = {
    'junio_21': { mes: 5, diaInicio: 19, diaFin: 23 }, // Yule (hemisferio sur)
    'septiembre_21': { mes: 8, diaInicio: 19, diaFin: 23 }, // Ostara
    'diciembre_21': { mes: 11, diaInicio: 19, diaFin: 23 }, // Litha
    'marzo_21': { mes: 2, diaInicio: 19, diaFin: 23 } // Mabon
  };

  const portal = portales[fechaPortal];
  if (!portal) return false;

  return mes === portal.mes && dia >= portal.diaInicio && dia <= portal.diaFin;
}

function contarLecturas(catalogo) {
  return {
    duendes: catalogo.duendes.length,
    clasicas: catalogo.clasicas.length,
    estudios: catalogo.estudios.length,
    rituales: catalogo.rituales.length,
    especiales: catalogo.especiales.length,
    eventos: catalogo.eventos.length,
    temporada: catalogo.temporada.length,
    total: Object.values(catalogo).reduce((sum, arr) => sum + arr.length, 0)
  };
}

// ═══════════════════════════════════════════════════════════════
// POST - Obtener detalle de una lectura específica
// ═══════════════════════════════════════════════════════════════
export async function POST(request) {
  try {
    const body = await request.json();
    const { token, email, lecturaId } = body;

    if (!lecturaId) {
      return Response.json({
        success: false,
        error: 'Se requiere lecturaId'
      }, { status: 400 });
    }

    // Obtener datos del usuario si está autenticado
    let usuario = null;
    let gamificacion = null;
    let userEmail = null;

    if (token || email) {
      userEmail = email;
      if (token && !email) {
        userEmail = await kv.get(`token:${token}`);
      }

      if (userEmail) {
        usuario = await kv.get(`elegido:${userEmail}`);
        gamificacion = await kv.get(`gamificacion:${userEmail}`);
      }
    }

    // Buscar la lectura
    const lectura = obtenerLecturaPorId(lecturaId);

    if (!lectura) {
      return Response.json({
        success: false,
        error: 'Lectura no encontrada'
      }, { status: 404 });
    }

    // Calcular disponibilidad y precio
    const nivelUsuario = gamificacion ? obtenerNivel(gamificacion.xp).id : 'iniciada';
    const tieneGuardian = usuario?.guardianes?.length > 0;
    const esCirculo = usuario?.circulo?.activo || false;
    const tipoMembresia = usuario?.circulo?.plan || null;

    const puedeAcceder = puedeAccederALectura(nivelUsuario, lectura.nivel);
    const cumpleRequisitos = !lectura.requiereGuardian || tieneGuardian;
    const tieneRunas = usuario ? (usuario.runas || 0) >= lectura.runas : false;

    // Calcular precio con descuento
    let precioFinal = lectura.runas;
    let descuento = 0;

    if (esCirculo && tipoMembresia === 'anual') {
      descuento = 10;
      precioFinal = Math.round(lectura.runas * 0.9);
    } else if (esCirculo && tipoMembresia === 'semestral') {
      descuento = 5;
      precioFinal = Math.round(lectura.runas * 0.95);
    }

    // Verificar si ya hizo esta lectura antes
    const yaRealizada = gamificacion?.lecturasCompletadas?.includes(lecturaId) || false;

    return Response.json({
      success: true,
      lectura: {
        ...lectura,
        precioOriginal: lectura.runas,
        precioFinal,
        descuento
      },
      acceso: {
        puedeAcceder,
        cumpleRequisitos,
        tieneRunas,
        puedeComprar: puedeAcceder && cumpleRequisitos && tieneRunas
      },
      usuario: usuario ? {
        runas: usuario.runas || 0,
        nivel: nivelUsuario,
        tieneGuardian,
        esCirculo
      } : null,
      historial: {
        yaRealizada,
        vecesRealizada: yaRealizada ? 1 : 0 // Por ahora solo contamos una
      }
    });

  } catch (error) {
    console.error('Error obteniendo lectura:', error);
    return Response.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
