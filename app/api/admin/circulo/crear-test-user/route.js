import { kv } from '@vercel/kv';

// ═══════════════════════════════════════════════════════════════════════════════
// API: Crear usuario de prueba del Círculo (salta onboarding)
// POST /api/admin/circulo/crear-test-user
// ═══════════════════════════════════════════════════════════════════════════════

export async function POST(request) {
  try {
    const { email, nombre } = await request.json();

    if (!email) {
      return Response.json({ success: false, error: 'Email requerido' }, { status: 400 });
    }

    const emailNorm = email.toLowerCase().trim();
    const nombreFinal = nombre || 'Test User';
    const ahora = new Date();
    const expira = new Date(ahora.getTime() + 365 * 24 * 60 * 60 * 1000); // 1 año

    // 1. Crear datos de membresía
    await kv.set(`circulo:${emailNorm}`, {
      activo: true,
      plan: 'anual',
      planNombre: 'Círculo Anual (Test)',
      expira: expira.toISOString(),
      esPrueba: false,
      descuentoTienda: 10,
      runasMensuales: 50,
      fechaInicio: ahora.toISOString(),
      onboardingCompletado: true
    });

    // 2. Crear perfil completo (salta onboarding)
    await kv.set(`circulo:perfil:${emailNorm}`, {
      nombrePreferido: nombreFinal,
      genero: 'ella',
      fechaNacimiento: '1989-11-09',
      pais: 'Uruguay',
      ciudad: 'Montevideo',
      comoLlegaste: 'test',
      atraccionPrincipal: ['cristales', 'intuicion'],
      queBusca: ['proteccion', 'claridad'],
      experienciaEspiritual: 'intermedio',
      objetivoPrincipal: 'Desarrollo espiritual',
      onboardingCompletado: true,
      perfilCliente: {
        poderAdquisitivo: 80,
        engagement: 90,
        madurezEspiritual: 70,
        potencialCompra: 85,
        segmento: 'vip'
      },
      fechaCreacion: ahora.toISOString()
    });

    // 3. Crear registro de usuario
    await kv.set(`user:${emailNorm}`, {
      email: emailNorm,
      nombre: nombreFinal,
      esCirculo: true,
      circuloExpira: expira.toISOString(),
      circuloPlan: 'anual',
      runas: 500,
      treboles: 50,
      fechaRegistro: ahora.toISOString()
    });

    // 4. Crear token simple
    const token = Buffer.from(emailNorm).toString('base64');
    await kv.set(`token:${token}`, { email: emailNorm, nombre: nombreFinal });

    return Response.json({
      success: true,
      mensaje: 'Usuario de prueba creado',
      usuario: {
        email: emailNorm,
        nombre: nombreFinal,
        plan: 'anual',
        expira: expira.toISOString()
      },
      acceso: {
        url: `https://duendes-vercel.vercel.app/mi-magia/circulo?token=${token}`,
        token
      }
    });

  } catch (error) {
    console.error('[CREAR-TEST-USER] Error:', error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
