import { kv } from '@vercel/kv';

export const dynamic = 'force-dynamic';

// ═══════════════════════════════════════════════════════════════
// SISTEMA DE REGALOS MASIVOS PARA EL CÍRCULO
// Envía regalos automáticos a todos los miembros activos
// ═══════════════════════════════════════════════════════════════

const TIPOS_REGALO = {
  lectura: { nombre: 'Lectura Gratis', campo: 'lecturaGratis', cantidad: 1 },
  runas: { nombre: 'Runas', campo: 'runas', cantidad: 10 },
  treboles: { nombre: 'Tréboles', campo: 'treboles', cantidad: 25 },
  meditacion: { nombre: 'Meditación Exclusiva', campo: 'meditacionExclusiva', cantidad: 1 },
  ritual: { nombre: 'Ritual Especial', campo: 'ritualEspecial', cantidad: 1 },
};

async function obtenerMiembrosActivos() {
  const circuloKeys = await kv.keys('circulo:*');
  const miembros = [];

  for (const key of circuloKeys) {
    // Ignorar claves de contenido e índices
    if (key.includes(':contenido:') || key.includes(':indice:') || key.includes(':config')) {
      continue;
    }

    try {
      const data = await kv.get(key);
      if (data?.activo) {
        const email = key.replace('circulo:', '');
        miembros.push({ email, ...data });
      }
    } catch (e) {
      // Ignorar errores individuales
    }
  }

  // También buscar en users con esCirculo activo
  const userKeys = await kv.keys('user:*');
  const elegidoKeys = await kv.keys('elegido:*');
  const allKeys = [...new Set([...userKeys, ...elegidoKeys])];

  for (const key of allKeys) {
    try {
      const user = await kv.get(key);
      if (user?.esCirculo && user?.email) {
        const yaIncluido = miembros.some(m => m.email === user.email);
        if (!yaIncluido) {
          miembros.push({ email: user.email, ...user });
        }
      }
    } catch (e) {
      // Ignorar
    }
  }

  return miembros;
}

export async function POST(request) {
  try {
    const { tipo, cantidad, motivo, mensaje } = await request.json();

    if (!tipo) {
      return Response.json({ success: false, error: 'Tipo de regalo requerido' }, { status: 400 });
    }

    const tipoRegalo = TIPOS_REGALO[tipo];
    if (!tipoRegalo && tipo !== 'dias') {
      return Response.json({ success: false, error: 'Tipo de regalo inválido' }, { status: 400 });
    }

    const miembros = await obtenerMiembrosActivos();

    if (miembros.length === 0) {
      return Response.json({
        success: false,
        error: 'No hay miembros activos en El Círculo'
      }, { status: 400 });
    }

    const resultados = [];
    let exitosos = 0;
    let fallidos = 0;

    for (const miembro of miembros) {
      try {
        // Buscar usuario en ambas claves
        let userData = await kv.get(`user:${miembro.email}`);
        let userKey = `user:${miembro.email}`;

        if (!userData) {
          userData = await kv.get(`elegido:${miembro.email}`);
          userKey = `elegido:${miembro.email}`;
        }

        if (!userData) {
          userData = { email: miembro.email };
          userKey = `user:${miembro.email}`;
        }

        // Aplicar el regalo según el tipo
        if (tipo === 'dias') {
          // Extender días del círculo
          const diasActuales = userData.circuloExpira ? new Date(userData.circuloExpira) : new Date();
          const nuevaFecha = new Date(diasActuales);
          nuevaFecha.setDate(nuevaFecha.getDate() + (cantidad || 7));
          userData.circuloExpira = nuevaFecha.toISOString();
          userData.esCirculo = true;
        } else if (tipo === 'lectura') {
          userData.lecturaGratis = (userData.lecturaGratis || 0) + (cantidad || 1);
        } else if (tipo === 'runas') {
          userData.runas = (userData.runas || 0) + (cantidad || tipoRegalo.cantidad);
        } else if (tipo === 'treboles') {
          userData.treboles = (userData.treboles || 0) + (cantidad || tipoRegalo.cantidad);
        } else if (tipo === 'meditacion') {
          userData.meditacionExclusiva = (userData.meditacionExclusiva || 0) + 1;
        } else if (tipo === 'ritual') {
          userData.ritualEspecial = (userData.ritualEspecial || 0) + 1;
        }

        // Registrar el regalo en historial
        if (!userData.historialRegalos) {
          userData.historialRegalos = [];
        }
        userData.historialRegalos.push({
          tipo,
          cantidad: cantidad || tipoRegalo?.cantidad || 1,
          motivo: motivo || 'Regalo automático de El Círculo',
          fecha: new Date().toISOString()
        });

        // Guardar usuario actualizado
        await kv.set(userKey, userData);

        exitosos++;
        resultados.push({ email: miembro.email, exito: true });

      } catch (error) {
        fallidos++;
        resultados.push({ email: miembro.email, exito: false, error: error.message });
      }
    }

    // Guardar registro del regalo masivo
    const registroRegalo = {
      id: `regalo-${Date.now()}`,
      tipo,
      cantidad: cantidad || tipoRegalo?.cantidad || 1,
      motivo,
      mensaje,
      fecha: new Date().toISOString(),
      totalMiembros: miembros.length,
      exitosos,
      fallidos
    };

    await kv.set(`circulo:regalo:${registroRegalo.id}`, registroRegalo);

    // Guardar en lista de regalos del mes
    const ahora = new Date();
    const mesKey = `circulo:regalos:${ahora.getFullYear()}:${ahora.getMonth() + 1}`;
    const regalosMes = await kv.get(mesKey) || [];
    regalosMes.push(registroRegalo);
    await kv.set(mesKey, regalosMes);

    return Response.json({
      success: true,
      mensaje: `Regalo enviado a ${exitosos} miembros`,
      registro: registroRegalo,
      detalles: {
        exitosos,
        fallidos,
        total: miembros.length
      }
    });

  } catch (error) {
    console.error('Error regalo masivo:', error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}

// GET - Obtener historial de regalos
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const mes = searchParams.get('mes') || (new Date().getMonth() + 1);
    const año = searchParams.get('año') || new Date().getFullYear();

    const regalosMes = await kv.get(`circulo:regalos:${año}:${mes}`) || [];

    return Response.json({
      success: true,
      regalos: regalosMes
    });

  } catch (error) {
    return Response.json({ success: false, regalos: [], error: error.message }, { status: 500 });
  }
}
