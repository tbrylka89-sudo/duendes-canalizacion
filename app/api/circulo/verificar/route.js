import { kv } from '@vercel/kv';

export const dynamic = 'force-dynamic';

// ═══════════════════════════════════════════════════════════════════════════════
// VERIFICAR ACCESO AL CÍRCULO DE DUENDES
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

    let usuarioEmail = email;

    // Si hay token, decodificarlo (formato simple: base64 del email)
    if (token) {
      try {
        // El token puede ser el email directamente o base64
        if (token.includes('@')) {
          usuarioEmail = token.toLowerCase();
        } else {
          usuarioEmail = Buffer.from(token, 'base64').toString('utf-8').toLowerCase();
        }
      } catch {
        // Si falla el decode, usar el token como está
        usuarioEmail = token.toLowerCase();
      }
    }

    // Verificar en múltiples lugares
    let tieneAcceso = false;
    let datosUsuario = null;
    let planInfo = null;

    // 1. Verificar en clave específica del círculo
    const circuloData = await kv.get(`circulo:${usuarioEmail}`);
    if (circuloData) {
      // Verificar que esté activo y no expirado
      if (circuloData.activo) {
        const expira = circuloData.expira ? new Date(circuloData.expira) : null;
        if (!expira || expira > new Date()) {
          tieneAcceso = true;
          planInfo = {
            plan: circuloData.plan,
            expira: circuloData.expira,
            esPrueba: circuloData.esPrueba || false
          };
        }
      }
    }

    // 2. Verificar en datos del usuario
    if (!tieneAcceso) {
      const userData = await kv.get(`user:${usuarioEmail}`);
      if (userData?.esCirculo) {
        const expira = userData.circuloExpira ? new Date(userData.circuloExpira) : null;
        if (!expira || expira > new Date()) {
          tieneAcceso = true;
          datosUsuario = userData;
          planInfo = {
            plan: userData.circuloPlan,
            expira: userData.circuloExpira,
            esPrueba: userData.circuloPrueba || false
          };
        }
      }
    }

    // 3. Verificar en elegidos
    if (!tieneAcceso) {
      const elegidoData = await kv.get(`elegido:${usuarioEmail}`);
      if (elegidoData?.esCirculo) {
        const expira = elegidoData.circuloExpira ? new Date(elegidoData.circuloExpira) : null;
        if (!expira || expira > new Date()) {
          tieneAcceso = true;
          datosUsuario = elegidoData;
          planInfo = {
            plan: elegidoData.circuloPlan,
            expira: elegidoData.circuloExpira,
            esPrueba: elegidoData.circuloPrueba || false
          };
        }
      }
    }

    // Si tiene acceso, obtener/actualizar datos del usuario
    if (tieneAcceso) {
      if (!datosUsuario) {
        datosUsuario = await kv.get(`user:${usuarioEmail}`) ||
                       await kv.get(`elegido:${usuarioEmail}`) ||
                       {};
      }

      // Registrar última visita
      await kv.set(`circulo:visita:${usuarioEmail}`, {
        ultima: new Date().toISOString(),
        contador: (await kv.get(`circulo:visita:${usuarioEmail}`))?.contador + 1 || 1
      });

      return Response.json({
        success: true,
        acceso: true,
        usuario: {
          email: usuarioEmail,
          nombre: datosUsuario.nombre || datosUsuario.nombrePreferido || usuarioEmail.split('@')[0],
          nombrePreferido: datosUsuario.nombrePreferido
        },
        plan: planInfo
      });
    }

    // Sin acceso
    return Response.json({
      success: true,
      acceso: false,
      error: 'No tenés acceso activo al Círculo de Duendes'
    });

  } catch (error) {
    console.error('Error verificando acceso:', error);
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
      error: 'Token o email requerido'
    }, { status: 400 });
  }

  // Redirigir al POST
  const fakeRequest = {
    json: async () => ({ token, email })
  };

  return POST(fakeRequest);
}
