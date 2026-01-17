import { kv } from '@vercel/kv';

// ═══════════════════════════════════════════════════════════════════════════════
// API: Panel de Inteligencia de Usuarios
// Lista usuarios con perfil completo, clasificación y estadísticas
// ═══════════════════════════════════════════════════════════════════════════════

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const filtroClasificacion = searchParams.get('clasificacion'); // bronce, plata, oro, diamante
    const filtroInteres = searchParams.get('interes'); // cristales, runas, etc.
    const filtroBusca = searchParams.get('busca'); // proteccion, abundancia, etc.
    const busqueda = searchParams.get('q'); // búsqueda por nombre/email
    const limite = parseInt(searchParams.get('limite') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Obtener todos los usuarios
    const userKeys = await kv.keys('user:*');
    const elegidoKeys = await kv.keys('elegido:*');
    const allKeys = [...new Set([...userKeys, ...elegidoKeys])];

    const usuarios = [];
    const estadisticas = {
      total: 0,
      porClasificacion: { bronce: 0, plata: 0, oro: 0, diamante: 0, sinClasificar: 0 },
      porInteres: {},
      porBusca: {},
      conCompras: 0,
      activos7dias: 0
    };

    const hace7dias = new Date();
    hace7dias.setDate(hace7dias.getDate() - 7);

    for (const key of allKeys) {
      const usuario = await kv.get(key);
      if (!usuario || !usuario.email) continue;

      const email = usuario.email.toLowerCase();
      const perfil = await kv.get(`perfil:${email}`);

      // Construir objeto de usuario con toda la info
      const usuarioCompleto = {
        email,
        nombre: perfil?.nombrePreferido || usuario.nombre || 'Sin nombre',
        nombreCompleto: perfil?.nombreCompleto || '',
        pais: perfil?.pais || '',
        clasificacion: perfil?.clasificacion || 'sinClasificar',
        clasificacionEmoji: perfil?.clasificacionEmoji || '❓',
        clasificacionColor: perfil?.clasificacionColor || '#888',
        intereses: perfil?.atraccionPrincipal || [],
        busca: perfil?.queBusca || [],
        experiencia: perfil?.experienciaEspiritual || '',
        objetivo: perfil?.objetivoPrincipal || '',
        runas: usuario.runas || 0,
        treboles: usuario.treboles || 0,
        esCirculo: usuario.esCirculo || false,
        circuloExpira: usuario.circuloExpira || null,
        guardianes: usuario.guardiansAdoptados || perfil?.guardiansAdoptados || '0',
        compras: usuario.compras?.length || 0,
        totalGastado: usuario.compras?.reduce((sum, c) => sum + (c.monto || 0), 0) || 0,
        ultimaActividad: usuario.ultimaActividad || usuario.creado || null,
        fechaRegistro: usuario.creado || perfil?.fechaOnboarding || null,
        comoLlego: perfil?.comoLlegaste || '',
        onboardingCompletado: perfil?.onboardingCompletado || false
      };

      // Estadísticas
      estadisticas.total++;
      const clasif = usuarioCompleto.clasificacion;
      if (estadisticas.porClasificacion[clasif] !== undefined) {
        estadisticas.porClasificacion[clasif]++;
      } else {
        estadisticas.porClasificacion.sinClasificar++;
      }

      for (const interes of usuarioCompleto.intereses) {
        estadisticas.porInteres[interes] = (estadisticas.porInteres[interes] || 0) + 1;
      }

      for (const busca of usuarioCompleto.busca) {
        estadisticas.porBusca[busca] = (estadisticas.porBusca[busca] || 0) + 1;
      }

      if (usuarioCompleto.compras > 0) {
        estadisticas.conCompras++;
      }

      if (usuarioCompleto.ultimaActividad && new Date(usuarioCompleto.ultimaActividad) > hace7dias) {
        estadisticas.activos7dias++;
      }

      // Aplicar filtros
      if (filtroClasificacion && usuarioCompleto.clasificacion !== filtroClasificacion) continue;
      if (filtroInteres && !usuarioCompleto.intereses.includes(filtroInteres)) continue;
      if (filtroBusca && !usuarioCompleto.busca.includes(filtroBusca)) continue;
      if (busqueda) {
        const q = busqueda.toLowerCase();
        if (!usuarioCompleto.email.includes(q) && !usuarioCompleto.nombre.toLowerCase().includes(q)) continue;
      }

      usuarios.push(usuarioCompleto);
    }

    // Ordenar por última actividad (más recientes primero)
    usuarios.sort((a, b) => {
      const fechaA = a.ultimaActividad ? new Date(a.ultimaActividad) : new Date(0);
      const fechaB = b.ultimaActividad ? new Date(b.ultimaActividad) : new Date(0);
      return fechaB - fechaA;
    });

    // Aplicar paginación
    const usuariosPaginados = usuarios.slice(offset, offset + limite);

    return Response.json({
      success: true,
      usuarios: usuariosPaginados,
      total: usuarios.length,
      estadisticas,
      paginacion: {
        limite,
        offset,
        hayMas: offset + limite < usuarios.length
      }
    });

  } catch (error) {
    console.error('[ADMIN/INTELIGENCIA] Error:', error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST: Acciones sobre usuarios
export async function POST(request) {
  try {
    const { accion, email, datos } = await request.json();

    if (!accion || !email) {
      return Response.json({ success: false, error: 'Acción y email requeridos' }, { status: 400 });
    }

    const usuario = await kv.get(`user:${email}`) || await kv.get(`elegido:${email}`);
    if (!usuario) {
      return Response.json({ success: false, error: 'Usuario no encontrado' }, { status: 404 });
    }

    let resultado;

    switch (accion) {
      case 'agregar_nota':
        // Agregar nota interna al usuario
        const notas = usuario.notasAdmin || [];
        notas.push({
          texto: datos.nota,
          fecha: new Date().toISOString(),
          autor: datos.autor || 'Admin'
        });
        usuario.notasAdmin = notas;
        await kv.set(`user:${email}`, usuario);
        resultado = { mensaje: 'Nota agregada', notas };
        break;

      case 'enviar_mensaje_tito':
        // Guardar mensaje para que Tito lo muestre
        await kv.set(`mensaje_tito:${email}`, {
          mensaje: datos.mensaje,
          fecha: new Date().toISOString(),
          leido: false
        });
        resultado = { mensaje: 'Mensaje programado para Tito' };
        break;

      case 'regalar_runas':
        usuario.runas = (usuario.runas || 0) + (datos.cantidad || 0);
        await kv.set(`user:${email}`, usuario);
        resultado = { mensaje: `${datos.cantidad} runas regaladas`, runas: usuario.runas };
        break;

      case 'regalar_treboles':
        usuario.treboles = (usuario.treboles || 0) + (datos.cantidad || 0);
        await kv.set(`user:${email}`, usuario);
        resultado = { mensaje: `${datos.cantidad} tréboles regalados`, treboles: usuario.treboles };
        break;

      case 'cambiar_clasificacion':
        const perfil = await kv.get(`perfil:${email}`) || {};
        perfil.clasificacion = datos.clasificacion;
        perfil.clasificacionManual = true;
        await kv.set(`perfil:${email}`, perfil);
        resultado = { mensaje: `Clasificación cambiada a ${datos.clasificacion}` };
        break;

      default:
        return Response.json({ success: false, error: 'Acción no reconocida' }, { status: 400 });
    }

    return Response.json({ success: true, ...resultado });

  } catch (error) {
    console.error('[ADMIN/INTELIGENCIA] Error POST:', error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
