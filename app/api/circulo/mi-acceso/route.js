import { kv } from '@vercel/kv';

export const dynamic = 'force-dynamic';

// ═══════════════════════════════════════════════════════════════════════════════
// MI ACCESO AL CÍRCULO
// Endpoint para consultar el estado completo de membresía de un usuario
// Útil para WordPress y otras integraciones
// ═══════════════════════════════════════════════════════════════════════════════

export async function GET(request) {
  try {
    const url = new URL(request.url);
    const email = url.searchParams.get('email')?.toLowerCase();
    const token = url.searchParams.get('token');

    if (!email && !token) {
      return Response.json({
        success: false,
        error: 'Email o token requerido'
      }, { status: 400 });
    }

    let usuarioEmail = email;

    // Si tenemos token pero no email, resolver el email desde el token
    if (token && !usuarioEmail) {
      // 1. Buscar en mapeo token:${token}
      const tokenData = await kv.get(`token:${token}`);
      if (tokenData) {
        usuarioEmail = typeof tokenData === 'string'
          ? tokenData.toLowerCase()
          : tokenData.email?.toLowerCase();
      }
      // 2. Si el token contiene @, es el email
      if (!usuarioEmail && token.includes('@')) {
        usuarioEmail = token.toLowerCase();
      }
    }

    if (!usuarioEmail) {
      return Response.json({
        success: false,
        error: 'No se pudo identificar el usuario'
      }, { status: 400 });
    }

    // ═══════════════════════════════════════════════════════════
    // RECOPILAR DATOS DE TODOS LOS LUGARES
    // ═══════════════════════════════════════════════════════════

    const [circuloData, elegidoData, userData] = await Promise.all([
      kv.get(`circulo:${usuarioEmail}`),
      kv.get(`elegido:${usuarioEmail}`),
      kv.get(`user:${usuarioEmail}`)
    ]);

    // Determinar estado de membresía
    let membresia = {
      activa: false,
      plan: null,
      planNombre: null,
      expira: null,
      diasRestantes: null,
      esPrueba: false,
      descuentoTienda: 0,
      runasMensuales: 0
    };

    // Verificar en circulo:${email} (fuente principal)
    if (circuloData?.activo) {
      const expira = circuloData.expira ? new Date(circuloData.expira) : null;
      const ahora = new Date();

      if (!expira || expira > ahora) {
        membresia.activa = true;
        membresia.plan = circuloData.plan;
        membresia.planNombre = circuloData.planNombre || circuloData.plan;
        membresia.expira = circuloData.expira;
        membresia.esPrueba = circuloData.esPrueba || false;
        membresia.descuentoTienda = circuloData.descuentoTienda || 0;
        membresia.runasMensuales = circuloData.runasMensuales || 0;

        if (expira) {
          membresia.diasRestantes = Math.ceil((expira - ahora) / (1000 * 60 * 60 * 24));
        }
      }
    }

    // Si no encontramos en circulo:, buscar en elegido:
    if (!membresia.activa && elegidoData?.esCirculo) {
      const expiraStr = elegidoData.circuloExpira || elegidoData.circulo?.expira;
      const expira = expiraStr ? new Date(expiraStr) : null;
      const ahora = new Date();

      if (!expira || expira > ahora) {
        membresia.activa = true;
        membresia.plan = elegidoData.circuloPlan || elegidoData.circulo?.plan;
        membresia.planNombre = elegidoData.circuloPlanNombre || membresia.plan;
        membresia.expira = expiraStr;
        membresia.esPrueba = elegidoData.circuloPrueba || elegidoData.circulo?.esPrueba || false;

        if (expira) {
          membresia.diasRestantes = Math.ceil((expira - ahora) / (1000 * 60 * 60 * 24));
        }
      }
    }

    // Si no encontramos en elegido:, buscar en user:
    if (!membresia.activa && userData?.esCirculo) {
      const expira = userData.circuloExpira ? new Date(userData.circuloExpira) : null;
      const ahora = new Date();

      if (!expira || expira > ahora) {
        membresia.activa = true;
        membresia.plan = userData.circuloPlan;
        membresia.planNombre = userData.circuloPlanNombre || userData.circuloPlan;
        membresia.expira = userData.circuloExpira;
        membresia.esPrueba = userData.circuloPrueba || false;

        if (expira) {
          membresia.diasRestantes = Math.ceil((expira - ahora) / (1000 * 60 * 60 * 24));
        }
      }
    }

    // ═══════════════════════════════════════════════════════════
    // CONSTRUIR RESPUESTA COMPLETA
    // ═══════════════════════════════════════════════════════════

    const nombre = elegidoData?.nombre || userData?.nombre || usuarioEmail.split('@')[0];
    const tokenUsuario = elegidoData?.token || userData?.token;

    return Response.json({
      success: true,
      usuario: {
        email: usuarioEmail,
        nombre,
        token: tokenUsuario,
        existeEnSistema: !!(elegidoData || userData)
      },
      membresia,
      recursos: {
        runas: elegidoData?.runas || 0,
        treboles: elegidoData?.treboles || 0,
        guardianes: elegidoData?.guardianes?.length || 0,
        nivel: elegidoData?.nivel || 1
      },
      links: {
        circulo: tokenUsuario
          ? `https://duendes-vercel.vercel.app/circulo?token=${tokenUsuario}`
          : null,
        miMagia: tokenUsuario
          ? `https://duendes-vercel.vercel.app/mi-magia?token=${tokenUsuario}`
          : null,
        activar: 'https://duendesdeluruguay.com/producto-categoria/circulo/'
      }
    });

  } catch (error) {
    console.error('Error en mi-acceso:', error);
    return Response.json({
      success: false,
      error: 'Error obteniendo estado de acceso'
    }, { status: 500 });
  }
}

// POST - Para consultas con body (más seguro para datos sensibles)
export async function POST(request) {
  try {
    const { email, token } = await request.json();

    // Construir URL con params y delegar a GET
    const url = new URL('https://duendes-vercel.vercel.app/api/circulo/mi-acceso');
    if (email) url.searchParams.set('email', email);
    if (token) url.searchParams.set('token', token);

    const fakeRequest = { url: url.toString() };
    return GET(fakeRequest);

  } catch (error) {
    console.error('Error en mi-acceso POST:', error);
    return Response.json({
      success: false,
      error: 'Error procesando solicitud'
    }, { status: 500 });
  }
}
