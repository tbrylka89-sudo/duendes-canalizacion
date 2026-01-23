import { kv } from '@vercel/kv';

export const dynamic = 'force-dynamic';

// ═══════════════════════════════════════════════════════════════════════════════
// VERIFICAR CÍRCULO PARA WORDPRESS
// Endpoint seguro para que WordPress consulte si un usuario tiene acceso
// Requiere secret compartido para autenticación
// ═══════════════════════════════════════════════════════════════════════════════

// Secret compartido entre WordPress y Vercel
// Configurar en .env: WORDPRESS_API_SECRET=tu-secret-seguro
const WORDPRESS_SECRET = process.env.WORDPRESS_API_SECRET || process.env.WP_API_SECRET;

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, secret, incluirDetalles } = body;

    // ═══════════════════════════════════════════════════════════
    // VALIDACIÓN DE SEGURIDAD
    // ═══════════════════════════════════════════════════════════

    if (!secret) {
      return Response.json({
        success: false,
        error: 'Secret requerido para autenticación'
      }, { status: 401 });
    }

    if (!WORDPRESS_SECRET) {
      console.error('[WP-VERIFICAR] WORDPRESS_API_SECRET no configurado');
      return Response.json({
        success: false,
        error: 'Configuración de servidor incompleta'
      }, { status: 500 });
    }

    if (secret !== WORDPRESS_SECRET) {
      console.warn(`[WP-VERIFICAR] Intento con secret inválido desde IP: ${request.headers.get('x-forwarded-for') || 'desconocida'}`);
      return Response.json({
        success: false,
        error: 'Secret inválido'
      }, { status: 403 });
    }

    // ═══════════════════════════════════════════════════════════
    // VALIDACIÓN DE EMAIL
    // ═══════════════════════════════════════════════════════════

    if (!email || !email.includes('@')) {
      return Response.json({
        success: false,
        error: 'Email válido requerido'
      }, { status: 400 });
    }

    const usuarioEmail = email.toLowerCase().trim();

    // ═══════════════════════════════════════════════════════════
    // VERIFICAR ACCESO EN LOS 3 LUGARES
    // ═══════════════════════════════════════════════════════════

    const ahora = new Date();
    let tieneAcceso = false;
    let planInfo = null;
    let fuenteAcceso = null;

    // 1. Verificar en circulo:${email} (fuente principal)
    const circuloData = await kv.get(`circulo:${usuarioEmail}`);
    if (circuloData?.activo) {
      const expira = circuloData.expira ? new Date(circuloData.expira) : null;
      if (!expira || expira > ahora) {
        tieneAcceso = true;
        fuenteAcceso = 'circulo';
        planInfo = {
          plan: circuloData.plan,
          planNombre: circuloData.planNombre,
          expira: circuloData.expira,
          diasRestantes: expira ? Math.ceil((expira - ahora) / (1000 * 60 * 60 * 24)) : null,
          esPrueba: circuloData.esPrueba || false,
          descuentoTienda: circuloData.descuentoTienda || 0
        };
      }
    }

    // 2. Verificar en elegido:${email}
    if (!tieneAcceso) {
      const elegidoData = await kv.get(`elegido:${usuarioEmail}`);
      if (elegidoData?.esCirculo || elegidoData?.circulo?.activo) {
        const expiraStr = elegidoData.circuloExpira || elegidoData.circulo?.expira;
        const expira = expiraStr ? new Date(expiraStr) : null;
        if (!expira || expira > ahora) {
          tieneAcceso = true;
          fuenteAcceso = 'elegido';
          planInfo = {
            plan: elegidoData.circuloPlan || elegidoData.circulo?.plan,
            planNombre: elegidoData.circuloPlanNombre || elegidoData.circulo?.planNombre,
            expira: expiraStr,
            diasRestantes: expira ? Math.ceil((expira - ahora) / (1000 * 60 * 60 * 24)) : null,
            esPrueba: elegidoData.circuloPrueba || elegidoData.circulo?.esPrueba || false
          };
        }
      }
    }

    // 3. Verificar en user:${email}
    if (!tieneAcceso) {
      const userData = await kv.get(`user:${usuarioEmail}`);
      if (userData?.esCirculo) {
        const expira = userData.circuloExpira ? new Date(userData.circuloExpira) : null;
        if (!expira || expira > ahora) {
          tieneAcceso = true;
          fuenteAcceso = 'user';
          planInfo = {
            plan: userData.circuloPlan,
            planNombre: userData.circuloPlanNombre,
            expira: userData.circuloExpira,
            diasRestantes: expira ? Math.ceil((expira - ahora) / (1000 * 60 * 60 * 24)) : null,
            esPrueba: userData.circuloPrueba || false
          };
        }
      }
    }

    // ═══════════════════════════════════════════════════════════
    // CONSTRUIR RESPUESTA
    // ═══════════════════════════════════════════════════════════

    // Respuesta básica (para WordPress simple)
    const respuesta = {
      success: true,
      email: usuarioEmail,
      tieneAcceso,
      activo: tieneAcceso // Alias para compatibilidad
    };

    // Si pide detalles, incluir info del plan
    if (incluirDetalles && planInfo) {
      respuesta.plan = planInfo;
      respuesta.fuente = fuenteAcceso;
    }

    // Loguear para debugging
    console.log(`[WP-VERIFICAR] ${usuarioEmail}: ${tieneAcceso ? 'ACCESO' : 'SIN ACCESO'}${planInfo ? ` (${planInfo.plan})` : ''}`);

    return Response.json(respuesta);

  } catch (error) {
    console.error('[WP-VERIFICAR] Error:', error);
    return Response.json({
      success: false,
      error: 'Error verificando acceso'
    }, { status: 500 });
  }
}

// GET no permitido por seguridad (evita que el secret viaje en URL)
export async function GET() {
  return Response.json({
    success: false,
    error: 'Método no permitido. Usar POST con email y secret en el body.'
  }, { status: 405 });
}
