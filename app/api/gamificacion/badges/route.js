import { kv } from '@vercel/kv';
import { BADGES, obtenerNivel } from '@/lib/gamificacion/config';

// ═══════════════════════════════════════════════════════════════
// API: BADGES - Verificar y otorgar badges automáticamente
// ═══════════════════════════════════════════════════════════════

export const dynamic = 'force-dynamic';

// Condiciones de badges
const CONDICIONES_BADGES = {
  hija_luna: (data) => data.lecturasLuna >= 5,
  guardiana_fuego: (data) => data.elementalesCompletos === true,
  erudita: (data) => data.lecturas >= 25,
  conectada: (data) => data.rachaMax >= 30,
  sabia_bosque: (data) => data.nivel === 'sabia',
  generosa: (data) => data.referidos >= 5,
  coleccionista: (data) => data.guardianes >= 3,
  primera_guardiana: (data) => data.numeroPrimera <= 100,
  exploradora: (data) => data.tiposLectura >= 10,
  racha_100: (data) => data.rachaMax >= 100
};

// GET - Verificar badges del usuario
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');
    const email = searchParams.get('email');

    if (!token && !email) {
      return Response.json({
        success: false,
        error: 'Se requiere token o email'
      }, { status: 400 });
    }

    let userEmail = email;
    if (token && !email) {
      const tokenData = await kv.get(`token:${token}`);
      if (!tokenData) {
        return Response.json({
          success: false,
          error: 'Token inválido'
        }, { status: 401 });
      }
      // El token puede ser un string (email) o un objeto {email, nombre, creado}
      userEmail = typeof tokenData === 'string' ? tokenData : tokenData.email;
    }

    // Obtener datos de gamificación
    const gamificacion = await kv.get(`gamificacion:${userEmail}`) || {};
    const usuario = await kv.get(`elegido:${userEmail}`) || {};

    // Construir datos para verificación
    const datosVerificacion = {
      lecturas: gamificacion.lecturasCompletadas?.length || 0,
      lecturasLuna: contarLecturasLuna(gamificacion.lecturasCompletadas || []),
      elementalesCompletos: verificarElementalesCompletos(gamificacion.lecturasCompletadas || []),
      rachaMax: gamificacion.rachaMax || 0,
      nivel: obtenerNivel(gamificacion.xp || 0).id,
      referidos: gamificacion.referidos?.length || 0,
      guardianes: usuario.guardianes?.length || 0,
      tiposLectura: gamificacion.tiposLecturaUsados?.length || 0,
      numeroPrimera: usuario.numeroPrimera || 999999
    };

    // Verificar cada badge
    const badgesActuales = gamificacion.badges || [];
    const badgesConEstado = BADGES.map(badge => ({
      ...badge,
      ganado: badgesActuales.includes(badge.id),
      cumpleCondicion: CONDICIONES_BADGES[badge.id] ? CONDICIONES_BADGES[badge.id](datosVerificacion) : false
    }));

    return Response.json({
      success: true,
      badges: badgesConEstado,
      badgesGanados: badgesActuales.length,
      totalBadges: BADGES.length
    });

  } catch (error) {
    console.error('[BADGES-GET] Error:', error);
    return Response.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}

// POST - Verificar y otorgar badges pendientes
export async function POST(request) {
  try {
    const body = await request.json();
    const { token, email } = body;

    if (!token && !email) {
      return Response.json({
        success: false,
        error: 'Se requiere token o email'
      }, { status: 400 });
    }

    let userEmail = email;
    if (token && !email) {
      const tokenData = await kv.get(`token:${token}`);
      if (!tokenData) {
        return Response.json({
          success: false,
          error: 'Token inválido'
        }, { status: 401 });
      }
      // El token puede ser un string (email) o un objeto {email, nombre, creado}
      userEmail = typeof tokenData === 'string' ? tokenData : tokenData.email;
    }

    // Obtener datos actuales
    let gamificacion = await kv.get(`gamificacion:${userEmail}`);
    const usuario = await kv.get(`elegido:${userEmail}`) || {};

    if (!gamificacion) {
      return Response.json({
        success: false,
        error: 'Usuario sin datos de gamificación'
      }, { status: 404 });
    }

    // Construir datos para verificación
    const datosVerificacion = {
      lecturas: gamificacion.lecturasCompletadas?.length || 0,
      lecturasLuna: contarLecturasLuna(gamificacion.lecturasCompletadas || []),
      elementalesCompletos: verificarElementalesCompletos(gamificacion.lecturasCompletadas || []),
      rachaMax: gamificacion.rachaMax || 0,
      nivel: obtenerNivel(gamificacion.xp || 0).id,
      referidos: gamificacion.referidos?.length || 0,
      guardianes: usuario.guardianes?.length || 0,
      tiposLectura: gamificacion.tiposLecturaUsados?.length || 0,
      numeroPrimera: usuario.numeroPrimera || 999999
    };

    // Verificar y otorgar badges
    const badgesActuales = gamificacion.badges || [];
    const nuevosBadges = [];

    for (const badge of BADGES) {
      // Si ya tiene el badge, saltear
      if (badgesActuales.includes(badge.id)) continue;

      // Verificar condición
      const verificador = CONDICIONES_BADGES[badge.id];
      if (verificador && verificador(datosVerificacion)) {
        nuevosBadges.push(badge);
        badgesActuales.push(badge.id);
      }
    }

    // Guardar si hay nuevos badges
    if (nuevosBadges.length > 0) {
      gamificacion.badges = badgesActuales;
      await kv.set(`gamificacion:${userEmail}`, gamificacion);
    }

    return Response.json({
      success: true,
      nuevosBadges: nuevosBadges.map(b => ({
        id: b.id,
        nombre: b.nombre,
        icono: b.icono,
        descripcion: b.descripcion
      })),
      totalBadges: badgesActuales.length
    });

  } catch (error) {
    console.error('[BADGES-POST] Error:', error);
    return Response.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}

// ═══════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════

function contarLecturasLuna(lecturas) {
  const lecturasLuna = ['luna_llena', 'luna_nueva'];
  return lecturas.filter(l => lecturasLuna.some(tipo => l.includes(tipo))).length;
}

function verificarElementalesCompletos(lecturas) {
  const elementales = ['cuatro_elementales', 'tierra', 'agua', 'fuego', 'aire'];
  // Simplificación: verificar si hizo la lectura de los 4 elementales
  return lecturas.some(l => l.includes('cuatro_elementales'));
}
