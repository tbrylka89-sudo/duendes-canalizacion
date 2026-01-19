import { kv } from '@vercel/kv';

// ═══════════════════════════════════════════════════════════════════════════════
// API: REGALOS MASIVOS AL CÍRCULO
// Otorga runas, lecturas o beneficios a TODOS los miembros activos
// ═══════════════════════════════════════════════════════════════════════════════

export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      tipo = 'runas', // 'runas', 'lectura_gratis', 'descuento', 'experiencia'
      cantidad = 0,
      mensaje = '',
      motivo = '',
      notificar = true,
      soloPreview = false
    } = body;

    // Obtener todos los miembros activos del Círculo
    const miembrosKeys = await kv.keys('circulo:*');
    const miembrosActivos = [];

    for (const key of miembrosKeys) {
      // Saltar keys que no son usuarios
      if (key.includes(':contenido:') || key.includes(':duendes') ||
          key.includes(':config') || key.includes(':foro')) continue;

      const data = await kv.get(key);
      if (data?.activo) {
        const email = key.replace('circulo:', '');
        miembrosActivos.push({
          email,
          nombre: data.nombre || email.split('@')[0],
          ...data
        });
      }
    }

    // También revisar usuarios con esCirculo
    const userKeys = await kv.keys('user:*');
    for (const key of userKeys) {
      const user = await kv.get(key);
      if (user?.esCirculo && user?.circuloExpira && new Date(user.circuloExpira) > new Date()) {
        const email = user.email || key.replace('user:', '');
        if (!miembrosActivos.find(m => m.email === email)) {
          miembrosActivos.push({
            email,
            nombre: user.nombre || email.split('@')[0],
            ...user
          });
        }
      }
    }

    if (miembrosActivos.length === 0) {
      return Response.json({
        success: false,
        error: 'No hay miembros activos en el Círculo'
      }, { status: 400 });
    }

    // Si solo es preview, devolver lista
    if (soloPreview) {
      return Response.json({
        success: true,
        preview: true,
        miembros: miembrosActivos.map(m => ({
          email: m.email,
          nombre: m.nombre
        })),
        total: miembrosActivos.length,
        regalo: { tipo, cantidad, mensaje }
      });
    }

    // Procesar regalo según tipo
    const resultados = [];
    let exitosos = 0;
    let errores = 0;

    for (const miembro of miembrosActivos) {
      try {
        switch (tipo) {
          case 'runas': {
            // Obtener usuario y agregar runas
            let usuario = await kv.get(`user:${miembro.email}`);
            if (!usuario) usuario = await kv.get(`elegido:${miembro.email}`);

            if (usuario) {
              usuario.runas = (usuario.runas || 0) + cantidad;

              // Registrar en historial de runas
              const historialRunas = usuario.historialRunas || [];
              historialRunas.unshift({
                tipo: 'regalo_admin',
                cantidad,
                motivo: motivo || 'Regalo del Círculo',
                fecha: new Date().toISOString()
              });
              usuario.historialRunas = historialRunas.slice(0, 50);

              await kv.set(`user:${miembro.email}`, usuario);
              exitosos++;
              resultados.push({ email: miembro.email, estado: 'ok', runasNuevas: usuario.runas });
            } else {
              errores++;
              resultados.push({ email: miembro.email, estado: 'error', error: 'Usuario no encontrado' });
            }
            break;
          }

          case 'lectura_gratis': {
            // Agregar lectura gratuita
            const circuloData = await kv.get(`circulo:${miembro.email}`) || {};
            circuloData.lecturasGratisExtra = (circuloData.lecturasGratisExtra || 0) + cantidad;
            circuloData.ultimoRegaloLectura = new Date().toISOString();
            await kv.set(`circulo:${miembro.email}`, circuloData);
            exitosos++;
            resultados.push({ email: miembro.email, estado: 'ok' });
            break;
          }

          case 'descuento': {
            // Crear cupón de descuento personal
            const cupon = {
              codigo: `REGALO${Date.now().toString(36).toUpperCase()}${Math.random().toString(36).slice(2, 5).toUpperCase()}`,
              descuento: cantidad,
              tipo: 'porcentaje',
              email: miembro.email,
              usado: false,
              creadoEn: new Date().toISOString(),
              expira: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 días
            };
            await kv.set(`cupon:${cupon.codigo}`, cupon);

            const circuloData = await kv.get(`circulo:${miembro.email}`) || {};
            circuloData.cupones = circuloData.cupones || [];
            circuloData.cupones.unshift(cupon);
            await kv.set(`circulo:${miembro.email}`, circuloData);

            exitosos++;
            resultados.push({ email: miembro.email, estado: 'ok', cupon: cupon.codigo });
            break;
          }

          case 'experiencia': {
            // Otorgar experiencia gratis
            const circuloData = await kv.get(`circulo:${miembro.email}`) || {};
            circuloData.experienciasGratis = circuloData.experienciasGratis || [];
            circuloData.experienciasGratis.push({
              id: `exp_${Date.now()}`,
              nombre: mensaje || 'Experiencia de regalo',
              otorgadaEn: new Date().toISOString(),
              usada: false
            });
            await kv.set(`circulo:${miembro.email}`, circuloData);
            exitosos++;
            resultados.push({ email: miembro.email, estado: 'ok' });
            break;
          }
        }

      } catch (error) {
        errores++;
        resultados.push({ email: miembro.email, estado: 'error', error: error.message });
      }
    }

    // Registrar en historial de regalos
    const historialRegalos = await kv.get('admin:regalos-masivos:historial') || [];
    historialRegalos.unshift({
      fecha: new Date().toISOString(),
      tipo,
      cantidad,
      mensaje,
      motivo,
      totalMiembros: miembrosActivos.length,
      exitosos,
      errores
    });
    await kv.set('admin:regalos-masivos:historial', historialRegalos.slice(0, 50));

    // TODO: Si notificar es true, enviar notificación push o email

    return Response.json({
      success: true,
      resumen: {
        total: miembrosActivos.length,
        exitosos,
        errores
      },
      resultados: resultados.slice(0, 20), // Solo mostrar primeros 20
      mensaje: `Regalo enviado a ${exitosos} miembros del Círculo`
    });

  } catch (error) {
    console.error('[REGALO-TODOS] Error:', error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}

// GET - Obtener historial de regalos masivos
export async function GET() {
  try {
    const historial = await kv.get('admin:regalos-masivos:historial') || [];

    // Contar miembros activos
    const miembrosKeys = await kv.keys('circulo:*');
    let totalActivos = 0;

    for (const key of miembrosKeys) {
      if (key.includes(':contenido:') || key.includes(':duendes')) continue;
      const data = await kv.get(key);
      if (data?.activo) totalActivos++;
    }

    return Response.json({
      success: true,
      historial,
      miembrosActivos: totalActivos
    });

  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
