import { kv } from '@vercel/kv';

export const dynamic = 'force-dynamic';

// ═══════════════════════════════════════════════════════════════════════════════
// VERIFICAR ACCESO AL CÍRCULO DE DUENDES
// Busca en 3 lugares: circulo:${email}, elegido:${email}, user:${email}
// Soporta autenticación por: token, email, o token mapeado
// ═══════════════════════════════════════════════════════════════════════════════

export async function POST(request) {
  try {
    const { token, email } = await request.json();

    if (!token && !email) {
      return Response.json({
        success: false,
        acceso: false,
        error: 'Token o email requerido'
      }, { status: 400 });
    }

    let usuarioEmail = email?.toLowerCase();
    let tokenData = null;

    // ═══════════════════════════════════════════════════════════
    // RESOLVER EMAIL DESDE TOKEN (múltiples formatos)
    // ═══════════════════════════════════════════════════════════

    if (token && !usuarioEmail) {
      // 1. Si el token contiene @, es directamente un email
      if (token.includes('@')) {
        usuarioEmail = token.toLowerCase();
      }
      // 2. Buscar en mapeo token:${token} -> {email, nombre}
      else {
        tokenData = await kv.get(`token:${token}`);
        if (tokenData) {
          // El mapeo puede ser string (email) u objeto {email, nombre}
          if (typeof tokenData === 'string') {
            usuarioEmail = tokenData.toLowerCase();
          } else if (tokenData.email) {
            usuarioEmail = tokenData.email.toLowerCase();
          }
        }
        // 3. Fallback: intentar decodificar base64
        if (!usuarioEmail) {
          try {
            const decoded = Buffer.from(token, 'base64').toString('utf-8');
            if (decoded.includes('@')) {
              usuarioEmail = decoded.toLowerCase();
            }
          } catch {
            // Ignorar error de decodificación
          }
        }
      }
    }

    if (!usuarioEmail) {
      return Response.json({
        success: false,
        acceso: false,
        error: 'No se pudo identificar el usuario'
      }, { status: 400 });
    }

    // ═══════════════════════════════════════════════════════════
    // VERIFICAR ACCESO EN LOS 3 LUGARES
    // ═══════════════════════════════════════════════════════════

    let tieneAcceso = false;
    let datosUsuario = null;
    let planInfo = null;
    let fuenteAcceso = null;

    // 1. Verificar en circulo:${email} (fuente principal)
    const circuloData = await kv.get(`circulo:${usuarioEmail}`);
    if (circuloData?.activo) {
      const expira = circuloData.expira ? new Date(circuloData.expira) : null;
      if (!expira || expira > new Date()) {
        tieneAcceso = true;
        fuenteAcceso = 'circulo';
        planInfo = {
          plan: circuloData.plan,
          planNombre: circuloData.planNombre || circuloData.plan,
          expira: circuloData.expira,
          esPrueba: circuloData.esPrueba || false,
          descuentoTienda: circuloData.descuentoTienda || 0,
          runasMensuales: circuloData.runasMensuales || 0
        };
      }
    }

    // 2. Verificar en elegido:${email}.circulo
    if (!tieneAcceso) {
      const elegidoData = await kv.get(`elegido:${usuarioEmail}`);
      if (elegidoData) {
        datosUsuario = elegidoData;

        // Puede estar en elegido.circulo.activo o elegido.esCirculo
        const circuloElegido = elegidoData.circulo || {};
        const esCirculo = elegidoData.esCirculo || circuloElegido.activo;
        const expiraStr = elegidoData.circuloExpira || circuloElegido.expira;

        if (esCirculo) {
          const expira = expiraStr ? new Date(expiraStr) : null;
          if (!expira || expira > new Date()) {
            tieneAcceso = true;
            fuenteAcceso = 'elegido';
            planInfo = {
              plan: elegidoData.circuloPlan || circuloElegido.plan,
              planNombre: elegidoData.circuloPlanNombre || circuloElegido.planNombre || elegidoData.circuloPlan,
              expira: expiraStr,
              esPrueba: elegidoData.circuloPrueba || circuloElegido.esPrueba || false
            };
          }
        }
      }
    }

    // 3. Verificar en user:${email}.esCirculo
    if (!tieneAcceso) {
      const userData = await kv.get(`user:${usuarioEmail}`);
      if (userData?.esCirculo) {
        const expira = userData.circuloExpira ? new Date(userData.circuloExpira) : null;
        if (!expira || expira > new Date()) {
          tieneAcceso = true;
          fuenteAcceso = 'user';
          datosUsuario = userData;
          planInfo = {
            plan: userData.circuloPlan,
            planNombre: userData.circuloPlanNombre || userData.circuloPlan,
            expira: userData.circuloExpira,
            esPrueba: userData.circuloPrueba || false
          };
        }
      }
    }

    // ═══════════════════════════════════════════════════════════
    // CONSTRUIR RESPUESTA
    // ═══════════════════════════════════════════════════════════

    if (tieneAcceso) {
      // Obtener datos completos del usuario si no los tenemos
      if (!datosUsuario) {
        datosUsuario = await kv.get(`elegido:${usuarioEmail}`) ||
                       await kv.get(`user:${usuarioEmail}`) ||
                       {};
      }

      // Registrar última visita al Círculo
      const visitaActual = await kv.get(`circulo:visita:${usuarioEmail}`);
      await kv.set(`circulo:visita:${usuarioEmail}`, {
        ultima: new Date().toISOString(),
        contador: (visitaActual?.contador || 0) + 1
      });

      // Obtener token del usuario si no lo tenemos
      const tokenUsuario = datosUsuario.token || tokenData?.token || token;

      return Response.json({
        success: true,
        acceso: true,
        usuario: {
          email: usuarioEmail,
          nombre: datosUsuario.nombre || datosUsuario.nombrePreferido || usuarioEmail.split('@')[0],
          nombrePreferido: datosUsuario.nombrePreferido,
          token: tokenUsuario
        },
        plan: planInfo,
        debug: {
          fuente: fuenteAcceso,
          verificadoEn: new Date().toISOString()
        }
      });
    }

    // Sin acceso - pero podemos dar info útil
    return Response.json({
      success: true,
      acceso: false,
      usuario: {
        email: usuarioEmail
      },
      error: 'No tenés acceso activo al Círculo de Duendes',
      info: {
        mensaje: 'Tu membresía puede haber expirado o no tenés una membresía activa.',
        accion: 'Visitá nuestra tienda para activar tu acceso al Círculo.'
      }
    });

  } catch (error) {
    console.error('Error verificando acceso al Círculo:', error);
    return Response.json({
      success: false,
      acceso: false,
      error: 'Error verificando acceso'
    }, { status: 500 });
  }
}

// GET - Verificar por query param (para links directos)
export async function GET(request) {
  const url = new URL(request.url);
  const token = url.searchParams.get('token');
  const email = url.searchParams.get('email');

  if (!token && !email) {
    return Response.json({
      success: false,
      acceso: false,
      error: 'Token o email requerido como query param'
    }, { status: 400 });
  }

  // Crear request simulado para POST
  const fakeRequest = {
    json: async () => ({ token, email })
  };

  return POST(fakeRequest);
}
