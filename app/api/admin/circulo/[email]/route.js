import { kv } from '@vercel/kv';

// PATCH - Actualizar membresia del circulo
export async function PATCH(request, { params }) {
  try {
    const email = decodeURIComponent(params.email).toLowerCase();
    const body = await request.json();
    const { accion, dias } = body;

    // Obtener datos del circulo
    let circuloData = await kv.get(`circulo:${email}`);
    const ahora = new Date();

    if (!circuloData) {
      circuloData = {
        activo: false,
        plan: 'admin',
        expira: null,
        esPrueba: false
      };
    }

    // Tambien actualizar el usuario
    let userKey = `user:${email}`;
    let userData = await kv.get(userKey);
    if (!userData) {
      userKey = `elegido:${email}`;
      userData = await kv.get(userKey);
    }

    switch (accion) {
      case 'activar':
        circuloData.activo = true;
        if (!circuloData.expira || new Date(circuloData.expira) < ahora) {
          // Si no tiene fecha o esta vencida, dar 30 dias
          const nuevaExpira = new Date(ahora.getTime() + 30 * 24 * 60 * 60 * 1000);
          circuloData.expira = nuevaExpira.toISOString();
        }
        break;

      case 'desactivar':
        circuloData.activo = false;
        break;

      case 'extender':
        const diasExtender = dias || 30;
        const fechaBase = circuloData.expira && new Date(circuloData.expira) > ahora
          ? new Date(circuloData.expira)
          : ahora;
        const nuevaExpira = new Date(fechaBase.getTime() + diasExtender * 24 * 60 * 60 * 1000);
        circuloData.expira = nuevaExpira.toISOString();
        circuloData.activo = true;
        break;

      default:
        return Response.json({
          success: false,
          error: 'Accion no valida'
        }, { status: 400 });
    }

    // Guardar datos del circulo
    await kv.set(`circulo:${email}`, circuloData);

    // Actualizar usuario si existe
    if (userData) {
      userData.esCirculo = circuloData.activo;
      userData.circuloExpira = circuloData.expira;
      userData.circuloPlan = circuloData.plan;
      await kv.set(userKey, userData);
    }

    return Response.json({
      success: true,
      circulo: circuloData,
      nuevaExpiracion: circuloData.expira
    });

  } catch (error) {
    console.error('Error actualizando circulo:', error);
    return Response.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
