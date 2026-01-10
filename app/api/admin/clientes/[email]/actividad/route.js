import { kv } from '@vercel/kv';

// GET - Obtener actividad completa del usuario
export async function GET(request, { params }) {
  try {
    const { email } = await params;
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

    // Obtener grimorio
    const grimorio = await kv.get(`grimorio:${emailNormalizado}`) || { entradas: [] };

    // Obtener datos del circulo
    const circulo = await kv.get(`circulo:${emailNormalizado}`) || null;

    // Construir actividad
    const actividad = {
      // Informacion basica
      usuario: {
        email: usuario.email,
        nombre: usuario.nombre || usuario.nombrePreferido,
        runas: usuario.runas || 0,
        treboles: usuario.treboles || 0,
        gastado: usuario.gastado || usuario.totalCompras || 0,
        guardianes: usuario.guardianes || [],
        creado: usuario.creado || usuario.fechaRegistro
      },

      // Grimorio - ultimas entradas
      grimorio: {
        totalEntradas: grimorio.entradas?.length || 0,
        ultimasEntradas: (grimorio.entradas || [])
          .slice(-10)
          .reverse()
          .map(e => ({
            fecha: e.fecha,
            tipo: e.tipo || 'reflexion',
            contenido: e.contenido?.substring(0, 100) + (e.contenido?.length > 100 ? '...' : ''),
            lunaFase: e.lunaFase
          }))
      },

      // Circulo
      circulo: circulo ? {
        activo: circulo.activo,
        plan: circulo.plan,
        expira: circulo.expira,
        esPrueba: circulo.esPrueba
      } : null,

      // Historial de canjes
      canjes: {
        totalCanjes: usuario.historialCanjes?.length || 0,
        historial: (usuario.historialCanjes || [])
          .slice(-10)
          .reverse()
          .map(c => ({
            fecha: c.fecha,
            tipo: c.tipo,
            costo: c.costo,
            detalle: c.detalle
          }))
      },

      // Historial de regalos recibidos
      regalos: {
        totalRegalos: usuario.historialRegalos?.length || 0,
        historial: (usuario.historialRegalos || [])
          .slice(-10)
          .reverse()
          .map(r => ({
            fecha: r.fecha,
            tipo: r.tipo,
            cantidad: r.cantidad,
            descripcion: r.descripcion,
            mensaje: r.mensaje
          }))
      },

      // Lecturas gratis
      lecturasGratis: (usuario.lecturasGratis || []).filter(l => !l.usado),

      // Cupones activos
      cupones: (usuario.cupones || []).filter(c => !c.usado),

      // Estadisticas de uso
      estadisticas: {
        diasComoMiembro: Math.floor((Date.now() - new Date(usuario.creado || usuario.fechaRegistro || Date.now()).getTime()) / (24 * 60 * 60 * 1000)),
        ultimaActividad: usuario.ultimaActividad || null
      }
    };

    return Response.json({
      success: true,
      actividad
    });

  } catch (error) {
    console.error('Error obteniendo actividad:', error);
    return Response.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
