import { kv } from '@vercel/kv';

// POST - Activar prueba gratuita del Circulo
export async function POST(request) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return Response.json({ success: false, error: 'Email requerido' }, { status: 400 });
    }

    const emailNorm = email.toLowerCase().trim();

    // Buscar usuario
    let userKey = `user:${emailNorm}`;
    let usuario = await kv.get(userKey);
    if (!usuario) {
      userKey = `elegido:${emailNorm}`;
      usuario = await kv.get(userKey);
    }

    if (!usuario) {
      return Response.json({ success: false, error: 'Usuario no encontrado' }, { status: 404 });
    }

    // Verificar si ya uso prueba gratuita
    if (usuario.circuloPruebaUsada) {
      return Response.json({
        success: false,
        error: 'Ya usaste tu prueba gratuita del Circulo. Podes suscribirte para continuar disfrutando los beneficios.'
      }, { status: 400 });
    }

    // Verificar si ya es miembro activo
    const ahora = new Date();
    if (usuario.esCirculo && usuario.circuloExpira && new Date(usuario.circuloExpira) > ahora) {
      return Response.json({
        success: false,
        error: 'Ya sos miembro activo del Circulo!'
      }, { status: 400 });
    }

    // Activar prueba de 15 dias
    const expira = new Date(ahora.getTime() + 15 * 24 * 60 * 60 * 1000);

    usuario.esCirculo = true;
    usuario.circuloExpira = expira.toISOString();
    usuario.circuloPlan = 'prueba-gratis';
    usuario.circuloPruebaUsada = true;
    usuario.circuloPruebaInicio = ahora.toISOString();

    // Dar 100 runas de bienvenida
    const runasAntes = usuario.runas || 0;
    usuario.runas = runasAntes + 100;

    // Dar 1 tirada gratis
    if (!usuario.experienciasGratis) usuario.experienciasGratis = [];
    usuario.experienciasGratis.push({
      tipo: 'tirada-runas',
      otorgado: ahora.toISOString(),
      usado: false,
      origen: 'prueba-circulo'
    });

    // Guardar en circulo:{email}
    await kv.set(`circulo:${emailNorm}`, {
      activo: true,
      plan: 'prueba-gratis',
      expira: expira.toISOString(),
      esPrueba: true,
      inicioEn: ahora.toISOString()
    });

    // Guardar usuario
    await kv.set(userKey, usuario);

    // Registrar actividad
    if (!usuario.actividad) usuario.actividad = [];
    usuario.actividad.push({
      tipo: 'circulo-prueba',
      fecha: ahora.toISOString(),
      detalle: '15 dias de prueba + 100 runas + 1 tirada gratis'
    });

    return Response.json({
      success: true,
      mensaje: 'Bienvenida al Circulo de Duendes!',
      beneficios: {
        diasPrueba: 15,
        expira: expira.toISOString(),
        runasOtorgadas: 100,
        tiradaGratis: true
      },
      usuario: {
        esCirculo: true,
        circuloExpira: expira.toISOString(),
        runas: usuario.runas
      }
    });

  } catch (error) {
    console.error('Error activando prueba:', error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
