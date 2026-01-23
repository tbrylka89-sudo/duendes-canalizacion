import { kv } from '@vercel/kv';
import { RACHAS, XP_ACCIONES } from '@/lib/gamificacion/config';

// ═══════════════════════════════════════════════════════════════
// POST - Reclamar cofre diario
// ═══════════════════════════════════════════════════════════════
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

    // Obtener email desde token
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

    // Obtener datos
    const usuario = await kv.get(`elegido:${userEmail}`);
    let gamificacion = await kv.get(`gamificacion:${userEmail}`);

    if (!usuario) {
      return Response.json({
        success: false,
        error: 'Usuario no encontrado'
      }, { status: 404 });
    }

    // Inicializar gamificación si no existe
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
        codigoReferido: generarCodigoReferido(usuario.nombre || userEmail),
        creadoEn: new Date().toISOString()
      };
    }

    const hoy = new Date().toISOString().split('T')[0];
    const ayer = new Date(Date.now() - 86400000).toISOString().split('T')[0];

    // Verificar si ya reclamó hoy
    if (gamificacion.ultimoCofre === hoy) {
      return Response.json({
        success: false,
        error: 'Ya reclamaste tu cofre hoy',
        proximoCofre: calcularProximoCofre()
      }, { status: 400 });
    }

    // Actualizar racha
    if (gamificacion.ultimoLogin === ayer) {
      gamificacion.racha += 1;
    } else if (gamificacion.ultimoLogin !== hoy) {
      gamificacion.racha = 1; // Reiniciar racha
    }

    // Actualizar racha máxima
    if (gamificacion.racha > gamificacion.rachaMax) {
      gamificacion.rachaMax = gamificacion.racha;
    }

    // Girar la rueda / abrir cofre
    const runasGanadas = girarRueda();
    const xpGanado = XP_ACCIONES.loginDiario;

    // Verificar bonus de racha
    let bonusRacha = null;
    const bonusConfig = RACHAS.bonusPorDias[gamificacion.racha];
    if (bonusConfig) {
      bonusRacha = {
        dias: gamificacion.racha,
        ...bonusConfig
      };
    }

    // Calcular recompensas totales
    let totalRunas = runasGanadas;
    let totalXp = xpGanado;
    let lecturaGratis = null;
    let badgeGanado = null;

    if (bonusRacha) {
      totalRunas += bonusRacha.runas;
      totalXp += bonusRacha.xp;
      if (bonusRacha.lecturaGratis) {
        lecturaGratis = bonusRacha.lecturaGratis;
      }
      if (bonusRacha.badge) {
        badgeGanado = bonusRacha.badge;
        if (!gamificacion.badges.includes(badgeGanado)) {
          gamificacion.badges.push(badgeGanado);
        }
      }
    }

    // Actualizar usuario
    usuario.runas = (usuario.runas || 0) + totalRunas;
    await kv.set(`elegido:${userEmail}`, usuario);

    // Actualizar gamificación
    gamificacion.xp += totalXp;
    gamificacion.ultimoCofre = hoy;
    gamificacion.ultimoLogin = hoy;
    await kv.set(`gamificacion:${userEmail}`, gamificacion);

    // Preparar respuesta con animación
    return Response.json({
      success: true,
      cofre: {
        runasBase: runasGanadas,
        xpBase: xpGanado
      },
      bonusRacha,
      totales: {
        runas: totalRunas,
        xp: totalXp,
        lecturaGratis,
        badge: badgeGanado
      },
      racha: {
        actual: gamificacion.racha,
        max: gamificacion.rachaMax,
        diasParaProximoBonus: calcularDiasParaBonus(gamificacion.racha)
      },
      nuevoBalance: usuario.runas,
      mensaje: generarMensajeCofre(runasGanadas, gamificacion.racha, bonusRacha)
    });

  } catch (error) {
    console.error('Error reclamando cofre:', error);
    return Response.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}

// ═══════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════

function girarRueda() {
  const probabilidades = RACHAS.cofre.probabilidades;
  const totalPeso = probabilidades.reduce((sum, p) => sum + p.peso, 0);
  let random = Math.random() * totalPeso;

  for (const prob of probabilidades) {
    random -= prob.peso;
    if (random <= 0) {
      return prob.runas;
    }
  }

  return probabilidades[0].runas; // Fallback
}

function calcularDiasParaBonus(rachaActual) {
  const hitos = [7, 14, 30, 60, 100];
  for (const hito of hitos) {
    if (rachaActual < hito) {
      return hito - rachaActual;
    }
  }
  return null;
}

function calcularProximoCofre() {
  const ahora = new Date();
  const manana = new Date(ahora);
  manana.setDate(manana.getDate() + 1);
  manana.setHours(0, 0, 0, 0);
  return manana.toISOString();
}

function generarCodigoReferido(nombre) {
  const base = (nombre || 'USER')
    .toUpperCase()
    .replace(/[^A-Z]/g, '')
    .slice(0, 6);
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${base}${random}`;
}

function generarMensajeCofre(runas, racha, bonusRacha) {
  const mensajesBase = [
    `¡${runas} runas brillan para vos hoy!`,
    `El bosque te regala ${runas} runas`,
    `¡Encontraste ${runas} runas en el cofre!`,
    `${runas} runas mágicas aparecieron`,
    `Los guardianes te envían ${runas} runas`
  ];

  let mensaje = mensajesBase[Math.floor(Math.random() * mensajesBase.length)];

  if (bonusRacha) {
    mensaje += ` ${bonusRacha.mensaje}`;
  } else if (racha > 1) {
    mensaje += ` ¡Racha de ${racha} días!`;
  }

  return mensaje;
}
