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

      case 'eliminar_usuario':
        // Eliminar usuario completamente
        const emailNorm = email.toLowerCase();
        const keysToDelete = [
          `user:${emailNorm}`,
          `elegido:${emailNorm}`,
          `perfil:${emailNorm}`,
          `circulo:${emailNorm}`,
          `grimorio:${emailNorm}`,
          `mensaje_tito:${emailNorm}`
        ];

        let eliminados = 0;
        for (const key of keysToDelete) {
          try {
            const existe = await kv.get(key);
            if (existe) {
              await kv.del(key);
              eliminados++;
            }
          } catch (e) {
            console.error(`Error eliminando ${key}:`, e);
          }
        }

        // También eliminar de tito perfiles activos si existe
        try {
          const titoKeys = await kv.keys(`tito:visitante:*`);
          for (const tk of titoKeys) {
            const tito = await kv.get(tk);
            if (tito?.email?.toLowerCase() === emailNorm) {
              await kv.del(tk);
              eliminados++;
            }
          }
        } catch (e) {}

        resultado = { mensaje: `Usuario ${email} eliminado`, keysEliminadas: eliminados };
        break;

      case 'obtener_perfil_completo':
        // Obtener toda la información del usuario
        const emailLower = email.toLowerCase();
        const userDataComplete = await kv.get(`user:${emailLower}`) || await kv.get(`elegido:${emailLower}`);
        const perfilData = await kv.get(`perfil:${emailLower}`);
        const circuloData = await kv.get(`circulo:${emailLower}`);
        const grimorioData = await kv.get(`grimorio:${emailLower}`);
        const mensajeTitoData = await kv.get(`mensaje_tito:${emailLower}`);

        // Buscar conversaciones de Tito
        let titoConversaciones = null;
        try {
          const titoKeys = await kv.keys(`tito:visitante:*`);
          for (const tk of titoKeys) {
            const titoData = await kv.get(tk);
            if (titoData?.email?.toLowerCase() === emailLower) {
              titoConversaciones = titoData;
              break;
            }
          }
        } catch (e) {}

        // Buscar visitas del día
        const hoy = new Date().toISOString().split('T')[0];
        const visitasHoy = await kv.get(`visitas:${emailLower}:${hoy}`);

        resultado = {
          usuario: userDataComplete,
          perfil: perfilData,
          circulo: circuloData,
          grimorio: grimorioData,
          mensajeTito: mensajeTitoData,
          tito: titoConversaciones,
          visitasHoy
        };
        break;

      case 'buscar_duplicados':
        // Buscar todos los usuarios con emails duplicados
        const allUserKeys = await kv.keys('user:*');
        const allElegidoKeys = await kv.keys('elegido:*');
        const emailCount = {};
        const duplicadosInfo = [];

        // Contar ocurrencias de cada email
        for (const key of [...allUserKeys, ...allElegidoKeys]) {
          const userData = await kv.get(key);
          if (userData?.email) {
            const em = userData.email.toLowerCase();
            if (!emailCount[em]) {
              emailCount[em] = [];
            }
            emailCount[em].push({
              key,
              runas: userData.runas || 0,
              treboles: userData.treboles || 0,
              creado: userData.creado || userData.fechaCreacion,
              nombre: userData.nombre || userData.nombrePreferido
            });
          }
        }

        // Encontrar duplicados
        for (const [em, entries] of Object.entries(emailCount)) {
          if (entries.length > 1) {
            duplicadosInfo.push({
              email: em,
              cantidad: entries.length,
              entradas: entries
            });
          }
        }

        resultado = {
          duplicados: duplicadosInfo,
          totalDuplicados: duplicadosInfo.length,
          totalEntradas: duplicadosInfo.reduce((sum, d) => sum + d.cantidad, 0)
        };
        break;

      case 'limpiar_duplicados':
        // Mergear y limpiar duplicados
        const userKeysAll = await kv.keys('user:*');
        const elegidoKeysAll = await kv.keys('elegido:*');
        const emailMap = {};

        // Recopilar todos los datos por email
        for (const key of [...userKeysAll, ...elegidoKeysAll]) {
          const ud = await kv.get(key);
          if (ud?.email) {
            const em = ud.email.toLowerCase();
            if (!emailMap[em]) {
              emailMap[em] = [];
            }
            emailMap[em].push({ key, data: ud });
          }
        }

        let mergeados = 0;
        let keysEliminadas = 0;

        for (const [em, entries] of Object.entries(emailMap)) {
          if (entries.length > 1) {
            // Ordenar por fecha de creación (más antigua primero)
            entries.sort((a, b) => {
              const fechaA = new Date(a.data.creado || a.data.fechaCreacion || 0);
              const fechaB = new Date(b.data.creado || b.data.fechaCreacion || 0);
              return fechaA - fechaB;
            });

            // La primera es la principal (más antigua)
            const principal = entries[0];
            let runasTotal = principal.data.runas || 0;
            let trebolesTotal = principal.data.treboles || 0;

            // Sumar runas y tréboles de todas las demás
            for (let i = 1; i < entries.length; i++) {
              runasTotal += entries[i].data.runas || 0;
              trebolesTotal += entries[i].data.treboles || 0;

              // Eliminar la entrada duplicada
              await kv.del(entries[i].key);
              keysEliminadas++;
            }

            // Actualizar la principal con el total
            principal.data.runas = runasTotal;
            principal.data.treboles = trebolesTotal;
            principal.data.mergeadoEn = new Date().toISOString();
            principal.data.cuentasMergeadas = entries.length - 1;

            // Guardar con key normalizada (user:email)
            await kv.set(`user:${em}`, principal.data);

            // Si la key original era diferente, eliminarla
            if (principal.key !== `user:${em}`) {
              await kv.del(principal.key);
            }

            mergeados++;
          }
        }

        resultado = {
          mensaje: `Limpieza completada`,
          emailsMergeados: mergeados,
          keysEliminadas,
          totalUsuariosAhora: Object.keys(emailMap).length
        };
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
