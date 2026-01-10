import { kv } from '@vercel/kv';

// POST - Enviar regalo
export async function POST(request) {
  try {
    const body = await request.json();
    const { email, tipo, cantidad, mensaje } = body;

    if (!email || !tipo || cantidad === undefined || cantidad === null) {
      return Response.json({
        success: false,
        error: 'Email, tipo y cantidad son requeridos'
      }, { status: 400 });
    }

    const emailNormalizado = email.toLowerCase().trim();

    // Buscar usuario
    let userKey = `user:${emailNormalizado}`;
    let usuario = await kv.get(userKey);
    if (!usuario) {
      userKey = `elegido:${emailNormalizado}`;
      usuario = await kv.get(userKey);
    }

    if (!usuario) {
      return Response.json({
        success: false,
        error: 'Usuario no encontrado'
      }, { status: 404 });
    }

    // Aplicar regalo segun tipo
    const ahora = new Date();
    let descripcionRegalo = '';

    switch (tipo) {
      case 'runas':
        usuario.runas = (usuario.runas || 0) + parseInt(cantidad);
        descripcionRegalo = `${cantidad} runas`;
        break;

      case 'treboles':
        usuario.treboles = (usuario.treboles || 0) + parseInt(cantidad);
        descripcionRegalo = `${cantidad} treboles`;
        break;

      case 'circulo':
        const dias = parseInt(cantidad);
        const fechaBase = usuario.circuloExpira && new Date(usuario.circuloExpira) > ahora
          ? new Date(usuario.circuloExpira)
          : ahora;
        const nuevaExpira = new Date(fechaBase.getTime() + dias * 24 * 60 * 60 * 1000);
        usuario.esCirculo = true;
        usuario.circuloExpira = nuevaExpira.toISOString();
        usuario.circuloPlan = usuario.circuloPlan || 'regalo';

        // Tambien actualizar datos en circulo:{email}
        await kv.set(`circulo:${emailNormalizado}`, {
          activo: true,
          plan: usuario.circuloPlan,
          expira: nuevaExpira.toISOString(),
          esPrueba: false
        });

        descripcionRegalo = `${dias} dias de Circulo`;
        break;

      case 'lectura':
        if (!usuario.lecturasGratis) usuario.lecturasGratis = [];
        usuario.lecturasGratis.push({
          tipo: cantidad,
          otorgado: ahora.toISOString(),
          usado: false
        });
        descripcionRegalo = `Lectura gratis: ${cantidad}`;
        break;

      case 'descuento':
        if (!usuario.cupones) usuario.cupones = [];
        const codigo = `REGALO${Date.now().toString(36).toUpperCase()}`;
        usuario.cupones.push({
          codigo,
          descuento: cantidad,
          creado: ahora.toISOString(),
          usado: false
        });
        descripcionRegalo = `Cupon de ${cantidad} descuento (${codigo})`;
        break;

      default:
        return Response.json({
          success: false,
          error: 'Tipo de regalo no valido'
        }, { status: 400 });
    }

    // Registrar en historial de regalos
    if (!usuario.historialRegalos) usuario.historialRegalos = [];
    usuario.historialRegalos.push({
      tipo,
      cantidad,
      descripcion: descripcionRegalo,
      mensaje: mensaje || '',
      fecha: ahora.toISOString()
    });

    // Guardar usuario actualizado
    await kv.set(userKey, usuario);

    return Response.json({
      success: true,
      regalo: {
        tipo,
        cantidad,
        descripcion: descripcionRegalo,
        destinatario: usuario.nombre || usuario.email
      }
    });

  } catch (error) {
    console.error('Error enviando regalo:', error);
    return Response.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
