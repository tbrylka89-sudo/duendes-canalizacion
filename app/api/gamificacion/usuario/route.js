import { kv } from '@vercel/kv';
import {
  NIVELES,
  XP_ACCIONES,
  RACHAS,
  obtenerNivel
} from '@/lib/gamificacion/config';

// ═══════════════════════════════════════════════════════════════
// GET - Obtener datos de gamificación del usuario
// ═══════════════════════════════════════════════════════════════
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

    // Obtener email desde token si es necesario
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

    // Obtener datos del usuario
    const usuario = await kv.get(`elegido:${userEmail}`);
    if (!usuario) {
      return Response.json({
        success: false,
        error: 'Usuario no encontrado'
      }, { status: 404 });
    }

    // Obtener o inicializar datos de gamificación
    let gamificacion = await kv.get(`gamificacion:${userEmail}`);

    if (!gamificacion) {
      // Inicializar gamificación para usuario existente
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
      await kv.set(`gamificacion:${userEmail}`, gamificacion);
    }

    // Calcular nivel actual basado en XP
    const nivelActual = obtenerNivel(gamificacion.xp);

    // Calcular XP para siguiente nivel
    const nivelIndex = NIVELES.findIndex(n => n.id === nivelActual.id);
    const siguienteNivel = NIVELES[nivelIndex + 1];
    const xpParaSiguiente = siguienteNivel ? siguienteNivel.xpRequerida - gamificacion.xp : 0;

    // Verificar si puede reclamar cofre hoy
    const hoy = new Date().toISOString().split('T')[0];
    const puedeReclamarCofre = gamificacion.ultimoCofre !== hoy;

    // Verificar estado de racha
    const ayer = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    const rachaActiva = gamificacion.ultimoLogin === ayer || gamificacion.ultimoLogin === hoy;

    return Response.json({
      success: true,
      usuario: {
        email: userEmail,
        nombre: usuario.nombre || usuario.nombrePreferido,
        runas: usuario.runas || 0,
        treboles: usuario.treboles || 0,
        guardianes: usuario.guardianes || []
      },
      gamificacion: {
        ...gamificacion,
        nivel: nivelActual,
        siguienteNivel: siguienteNivel || null,
        xpParaSiguiente,
        progresoNivel: siguienteNivel
          ? Math.round(((gamificacion.xp - nivelActual.xpRequerida) / (siguienteNivel.xpRequerida - nivelActual.xpRequerida)) * 100)
          : 100,
        puedeReclamarCofre,
        rachaActiva,
        diasParaBonus: calcularDiasParaBonus(gamificacion.racha)
      }
    });

  } catch (error) {
    console.error('Error obteniendo gamificación:', error);
    return Response.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}

// ═══════════════════════════════════════════════════════════════
// POST - Actualizar datos de gamificación (acciones)
// ═══════════════════════════════════════════════════════════════
export async function POST(request) {
  try {
    const body = await request.json();
    const { token, email, accion, datos } = body;

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
      userEmail = typeof tokenData === 'string' ? tokenData : tokenData.email;
    }

    // Obtener datos actuales
    let gamificacion = await kv.get(`gamificacion:${userEmail}`);
    const usuario = await kv.get(`elegido:${userEmail}`);

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
        codigoReferido: generarCodigoReferido(usuario?.nombre || userEmail),
        creadoEn: new Date().toISOString()
      };
    }

    let recompensas = { runas: 0, xp: 0, mensaje: null, badge: null };
    const hoy = new Date().toISOString().split('T')[0];
    const ayer = new Date(Date.now() - 86400000).toISOString().split('T')[0];

    switch (accion) {
      // ─────────────────────────────────────────────────────────
      // LOGIN DIARIO
      // ─────────────────────────────────────────────────────────
      case 'login_diario':
        if (gamificacion.ultimoLogin !== hoy) {
          // Verificar racha
          if (gamificacion.ultimoLogin === ayer) {
            gamificacion.racha += 1;
          } else if (gamificacion.ultimoLogin !== hoy) {
            // Racha rota
            gamificacion.racha = 1;
          }

          // Actualizar racha máxima
          if (gamificacion.racha > gamificacion.rachaMax) {
            gamificacion.rachaMax = gamificacion.racha;
          }

          // XP por login
          recompensas.xp = XP_ACCIONES.loginDiario;
          gamificacion.xp += recompensas.xp;
          gamificacion.ultimoLogin = hoy;

          // Verificar bonus de racha
          const bonusRacha = RACHAS.bonusPorDias[gamificacion.racha];
          if (bonusRacha) {
            recompensas.runas += bonusRacha.runas;
            recompensas.xp += bonusRacha.xp;
            recompensas.mensaje = bonusRacha.mensaje;
            if (bonusRacha.badge) {
              recompensas.badge = bonusRacha.badge;
              if (!gamificacion.badges.includes(bonusRacha.badge)) {
                gamificacion.badges.push(bonusRacha.badge);
              }
            }

            // Dar runas al usuario
            if (usuario && bonusRacha.runas > 0) {
              usuario.runas = (usuario.runas || 0) + bonusRacha.runas;
              await kv.set(`elegido:${userEmail}`, usuario);
            }
          }
        }
        break;

      // ─────────────────────────────────────────────────────────
      // LECTURA COMPLETADA
      // ─────────────────────────────────────────────────────────
      case 'lectura_completada':
        const { lecturaId, tipoLectura, nivelLectura } = datos;

        // Registrar lectura
        if (!gamificacion.lecturasCompletadas.includes(lecturaId)) {
          gamificacion.lecturasCompletadas.push(lecturaId);
        }

        // Registrar tipo de lectura
        if (!gamificacion.tiposLecturaUsados.includes(tipoLectura)) {
          gamificacion.tiposLecturaUsados.push(tipoLectura);
        }

        // XP según nivel de lectura
        switch (nivelLectura) {
          case 'basica':
            recompensas.xp = XP_ACCIONES.lecturaBasica;
            break;
          case 'estandar':
            recompensas.xp = XP_ACCIONES.lecturaEstandar;
            break;
          case 'premium':
            recompensas.xp = XP_ACCIONES.lecturaPremium;
            break;
          case 'ultra':
            recompensas.xp = XP_ACCIONES.lecturaUltraPremium;
            break;
          default:
            recompensas.xp = XP_ACCIONES.lecturaBasica;
        }

        gamificacion.xp += recompensas.xp;
        break;

      // ─────────────────────────────────────────────────────────
      // COMPRA REALIZADA
      // ─────────────────────────────────────────────────────────
      case 'compra':
        const { monto, tipo } = datos; // tipo: 'runas', 'guardian', 'membresia'

        if (tipo === 'guardian') {
          recompensas.xp = monto * XP_ACCIONES.compraGuardianPorDolar;
        } else {
          recompensas.xp = monto * XP_ACCIONES.compraPorDolar;
        }

        gamificacion.xp += recompensas.xp;
        break;

      // ─────────────────────────────────────────────────────────
      // REFERIDO
      // ─────────────────────────────────────────────────────────
      case 'referido':
        const { emailReferido, tipoAccion } = datos; // tipoAccion: 'registro', 'compra'

        if (!gamificacion.referidos.includes(emailReferido)) {
          gamificacion.referidos.push(emailReferido);
        }

        if (tipoAccion === 'registro') {
          recompensas.xp = XP_ACCIONES.referidoRegistro;
        } else if (tipoAccion === 'compra') {
          recompensas.xp = XP_ACCIONES.referidoCompra;
        }

        gamificacion.xp += recompensas.xp;
        break;

      // ─────────────────────────────────────────────────────────
      // MISIÓN COMPLETADA
      // ─────────────────────────────────────────────────────────
      case 'mision_completada':
        const { misionId, recompensaMision } = datos;

        if (!gamificacion.misionesCompletadas.includes(misionId)) {
          gamificacion.misionesCompletadas.push(misionId);

          if (recompensaMision) {
            recompensas.runas = recompensaMision.runas || 0;
            recompensas.xp = recompensaMision.xp || 0;

            if (recompensaMision.badge) {
              recompensas.badge = recompensaMision.badge;
              if (!gamificacion.badges.includes(recompensaMision.badge)) {
                gamificacion.badges.push(recompensaMision.badge);
              }
            }

            gamificacion.xp += recompensas.xp;

            // Dar runas
            if (usuario && recompensas.runas > 0) {
              usuario.runas = (usuario.runas || 0) + recompensas.runas;
              await kv.set(`elegido:${userEmail}`, usuario);
            }
          }
        }
        break;

      // ─────────────────────────────────────────────────────────
      // PUBLICACIÓN EN FORO
      // ─────────────────────────────────────────────────────────
      case 'publicacion_foro':
        recompensas.xp = XP_ACCIONES.publicacionForo;
        gamificacion.xp += recompensas.xp;
        break;

      default:
        return Response.json({
          success: false,
          error: 'Acción no reconocida'
        }, { status: 400 });
    }

    // Actualizar nivel si cambió
    const nuevoNivel = obtenerNivel(gamificacion.xp);
    const subioNivel = nuevoNivel.id !== gamificacion.nivel;
    gamificacion.nivel = nuevoNivel.id;

    // Guardar cambios
    await kv.set(`gamificacion:${userEmail}`, gamificacion);

    return Response.json({
      success: true,
      accion,
      recompensas,
      subioNivel,
      nuevoNivel: subioNivel ? nuevoNivel : null,
      gamificacion: {
        xp: gamificacion.xp,
        nivel: nuevoNivel,
        racha: gamificacion.racha,
        badges: gamificacion.badges.length
      }
    });

  } catch (error) {
    console.error('Error actualizando gamificación:', error);
    return Response.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}

// ═══════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════

function generarCodigoReferido(nombre) {
  const base = nombre
    .toUpperCase()
    .replace(/[^A-Z]/g, '')
    .slice(0, 6);
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${base}${random}`;
}

function calcularDiasParaBonus(rachaActual) {
  const hitos = [7, 14, 30, 60, 100];
  for (const hito of hitos) {
    if (rachaActual < hito) {
      return hito - rachaActual;
    }
  }
  return null; // Ya pasó todos los hitos
}
