import { kv } from '@vercel/kv';

export async function GET() {
  try {
    // Obtener todas las claves de usuarios
    const userKeys = await kv.keys('user:*');
    const elegidoKeys = await kv.keys('elegido:*');
    const allKeys = [...new Set([...userKeys, ...elegidoKeys])];

    let miembrosCirculo = 0;
    let clientesTotal = 0;
    let ingresosMes = 0;
    let ventasMes = 0;
    let lecturasPendientes = 0;
    let circulosPorVencer = 0;
    let totalGrimorioEntradas = 0;
    let totalCanjes = 0;
    let totalRegalosEnviados = 0;
    let pruebasActivas = 0;
    const topClientes = [];
    const proximosVencer = [];
    const actividad = [];

    const ahora = new Date();
    const inicioMes = new Date(ahora.getFullYear(), ahora.getMonth(), 1);
    const en7Dias = new Date(ahora.getTime() + 7 * 24 * 60 * 60 * 1000);

    // Procesar usuarios
    for (const k of allKeys) {
      try {
        const user = await kv.get(k);
        if (!user) continue;

        clientesTotal++;

        // Contar miembros del circulo
        if (user.esCirculo) {
          miembrosCirculo++;

          // Verificar si vence pronto
          if (user.circuloExpira) {
            const expira = new Date(user.circuloExpira);
            if (expira <= en7Dias && expira > ahora) {
              const diasRestantes = Math.ceil((expira - ahora) / (24 * 60 * 60 * 1000));
              proximosVencer.push({
                email: user.email,
                nombre: user.nombre || user.nombrePreferido,
                diasRestantes,
                expira: user.circuloExpira
              });
              circulosPorVencer++;
            }
          }
        }

        // Top clientes por gastado
        if (user.gastado > 0 || user.totalCompras > 0) {
          topClientes.push({
            email: user.email,
            nombre: user.nombre || user.nombrePreferido || user.email,
            gastado: user.gastado || user.totalCompras || 0
          });
        }

        // Calcular ingresos del mes (si hay datos de compras)
        if (user.compras && Array.isArray(user.compras)) {
          for (const compra of user.compras) {
            if (compra.fecha) {
              const fechaCompra = new Date(compra.fecha);
              if (fechaCompra >= inicioMes) {
                ingresosMes += compra.total || 0;
                ventasMes++;
              }
            }
          }
        }

        // Contar canjes
        if (user.historialCanjes?.length) {
          totalCanjes += user.historialCanjes.length;
        }

        // Contar regalos enviados
        if (user.historialRegalos?.length) {
          totalRegalosEnviados += user.historialRegalos.length;
        }

        // Actividad reciente
        if (user.ultimaCompra) {
          const fechaCompra = new Date(user.ultimaCompra);
          const tiempoAtras = obtenerTiempoAtras(fechaCompra);
          if (tiempoAtras) {
            actividad.push({
              icono: '🛒',
              texto: `${user.nombre || user.email} realizo una compra`,
              tiempo: tiempoAtras,
              fecha: fechaCompra
            });
          }
        }

        // Actividad de canjes recientes
        if (user.historialCanjes?.length) {
          const ultimoCanje = user.historialCanjes[user.historialCanjes.length - 1];
          if (ultimoCanje.fecha) {
            const fechaCanje = new Date(ultimoCanje.fecha);
            const tiempoAtras = obtenerTiempoAtras(fechaCanje);
            if (tiempoAtras) {
              actividad.push({
                icono: '☘',
                texto: `${user.nombre || user.email} canjeo ${ultimoCanje.tipo}`,
                tiempo: tiempoAtras,
                fecha: fechaCanje
              });
            }
          }
        }
      } catch (e) {
        // Ignorar errores de usuarios individuales
      }
    }

    // Contar entradas de grimorio
    try {
      const grimorioKeys = await kv.keys('grimorio:*');
      for (const gk of grimorioKeys) {
        const grimorio = await kv.get(gk);
        if (grimorio?.entradas?.length) {
          totalGrimorioEntradas += grimorio.entradas.length;
        }
      }
    } catch (e) {}

    // Contar miembros del circulo con prueba activa
    try {
      const circuloKeys = await kv.keys('circulo:*');
      for (const ck of circuloKeys) {
        const circulo = await kv.get(ck);
        if (circulo?.activo && circulo?.esPrueba) {
          pruebasActivas++;
        }
      }
    } catch (e) {}

    // Obtener lecturas pendientes
    try {
      const solicitudKeys = await kv.keys('solicitud:*');
      for (const sk of solicitudKeys) {
        const solicitud = await kv.get(sk);
        if (solicitud && solicitud.estado === 'pendiente') {
          lecturasPendientes++;
        }
      }
    } catch (e) {}

    // Ordenar top clientes
    topClientes.sort((a, b) => b.gastado - a.gastado);

    // Ordenar proximos a vencer
    proximosVencer.sort((a, b) => a.diasRestantes - b.diasRestantes);

    // Ordenar actividad por fecha
    actividad.sort((a, b) => b.fecha - a.fecha);

    return Response.json({
      success: true,
      clientesTotal,
      miembrosCirculo,
      ingresosMes: Math.round(ingresosMes),
      ventasMes,
      lecturasPendientes,
      circulosPorVencer,
      // Nuevas stats de Mi Magia
      totalGrimorioEntradas,
      totalCanjes,
      totalRegalosEnviados,
      pruebasActivas,
      topClientes: topClientes.slice(0, 10),
      proximosVencer: proximosVencer.slice(0, 10),
      actividad: actividad.slice(0, 15)
    });

  } catch (error) {
    console.error('Error en stats:', error);
    return Response.json({
      success: false,
      error: error.message,
      clientesTotal: 0,
      miembrosCirculo: 0,
      ingresosMes: 0,
      ventasMes: 0,
      lecturasPendientes: 0,
      circulosPorVencer: 0,
      totalGrimorioEntradas: 0,
      totalCanjes: 0,
      totalRegalosEnviados: 0,
      pruebasActivas: 0,
      topClientes: [],
      proximosVencer: [],
      actividad: []
    });
  }
}

function obtenerTiempoAtras(fecha) {
  const ahora = new Date();
  const diff = ahora - fecha;
  const minutos = Math.floor(diff / 60000);
  const horas = Math.floor(diff / 3600000);
  const dias = Math.floor(diff / 86400000);

  if (dias > 30) return null;
  if (dias > 0) return `hace ${dias} dia${dias > 1 ? 's' : ''}`;
  if (horas > 0) return `hace ${horas} hora${horas > 1 ? 's' : ''}`;
  if (minutos > 0) return `hace ${minutos} min`;
  return 'ahora';
}
