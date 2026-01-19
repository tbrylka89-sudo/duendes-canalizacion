export const dynamic = 'force-dynamic';

import { kv } from '@vercel/kv';

// ═══════════════════════════════════════════════════════════════════════════════
// API: Contenido del Círculo
// Obtiene contenido diario guardado en circulo:contenido:año:mes:dia
// ═══════════════════════════════════════════════════════════════════════════════

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    const dia = searchParams.get('dia'); // día específico (1-31)
    const mes = searchParams.get('mes'); // mes específico (1-12)
    const año = searchParams.get('año') || searchParams.get('ano');
    const tipo = searchParams.get('tipo'); // 'hoy', 'semana', 'mes', 'archivo'

    // Verificar membresía si hay email
    if (email) {
      const emailNorm = email.toLowerCase().trim();
      let usuario = await kv.get(`user:${emailNorm}`);
      if (!usuario) usuario = await kv.get(`elegido:${emailNorm}`);
      const circuloData = await kv.get(`circulo:${emailNorm}`);

      const esCirculo = circuloData?.activo ||
        (usuario?.esCirculo && usuario?.circuloExpira && new Date(usuario.circuloExpira) > new Date());

      if (!esCirculo) {
        return Response.json({
          success: false,
          error: 'Necesitás ser miembro del Círculo para acceder',
          esCirculo: false
        }, { status: 403 });
      }
    }

    const ahora = new Date();
    const añoActual = año ? parseInt(año) : ahora.getFullYear();
    const mesActual = mes ? parseInt(mes) : ahora.getMonth() + 1;
    const diaActual = dia ? parseInt(dia) : ahora.getDate();

    // Según el tipo de petición
    if (tipo === 'hoy' || (!tipo && !dia && !mes)) {
      // Contenido de HOY
      const contenidoHoy = await kv.get(`circulo:contenido:${añoActual}:${mesActual}:${diaActual}`);

      return Response.json({
        success: true,
        tipo: 'hoy',
        fecha: { año: añoActual, mes: mesActual, dia: diaActual },
        contenido: contenidoHoy || null,
        hayContenido: !!contenidoHoy
      });
    }

    if (tipo === 'semana') {
      // Contenido de la semana actual (últimos 7 días)
      const contenidos = [];
      for (let i = 0; i < 7; i++) {
        const fecha = new Date(ahora);
        fecha.setDate(fecha.getDate() - i);
        const key = `circulo:contenido:${fecha.getFullYear()}:${fecha.getMonth() + 1}:${fecha.getDate()}`;
        const contenido = await kv.get(key);
        if (contenido) {
          contenidos.push({
            fecha: {
              año: fecha.getFullYear(),
              mes: fecha.getMonth() + 1,
              dia: fecha.getDate(),
              diaSemana: fecha.toLocaleDateString('es-ES', { weekday: 'long' })
            },
            ...contenido
          });
        }
      }

      return Response.json({
        success: true,
        tipo: 'semana',
        contenidos,
        total: contenidos.length
      });
    }

    if (tipo === 'mes' || mes) {
      // Contenido del mes especificado
      const contenidos = [];
      const diasEnMes = new Date(añoActual, mesActual, 0).getDate();

      for (let d = 1; d <= diasEnMes; d++) {
        const key = `circulo:contenido:${añoActual}:${mesActual}:${d}`;
        const contenido = await kv.get(key);
        if (contenido) {
          contenidos.push({
            fecha: { año: añoActual, mes: mesActual, dia: d },
            ...contenido
          });
        }
      }

      return Response.json({
        success: true,
        tipo: 'mes',
        año: añoActual,
        mes: mesActual,
        contenidos,
        total: contenidos.length
      });
    }

    if (tipo === 'archivo') {
      // Archivo: meses anteriores con contenido
      const mesesConContenido = [];

      // Revisar últimos 6 meses
      for (let i = 0; i < 6; i++) {
        const fecha = new Date(ahora.getFullYear(), ahora.getMonth() - i, 1);
        const añoCheck = fecha.getFullYear();
        const mesCheck = fecha.getMonth() + 1;

        // Contar contenidos del mes
        let conteo = 0;
        const diasEnMes = new Date(añoCheck, mesCheck, 0).getDate();

        for (let d = 1; d <= Math.min(diasEnMes, 31); d++) {
          const contenido = await kv.get(`circulo:contenido:${añoCheck}:${mesCheck}:${d}`);
          if (contenido) conteo++;
        }

        if (conteo > 0) {
          mesesConContenido.push({
            año: añoCheck,
            mes: mesCheck,
            nombreMes: fecha.toLocaleDateString('es-ES', { month: 'long' }),
            totalContenidos: conteo
          });
        }
      }

      return Response.json({
        success: true,
        tipo: 'archivo',
        meses: mesesConContenido
      });
    }

    // Día específico
    if (dia) {
      const contenido = await kv.get(`circulo:contenido:${añoActual}:${mesActual}:${diaActual}`);

      return Response.json({
        success: true,
        tipo: 'dia',
        fecha: { año: añoActual, mes: mesActual, dia: diaActual },
        contenido: contenido || null,
        hayContenido: !!contenido
      });
    }

    return Response.json({
      success: false,
      error: 'Tipo de consulta no válido'
    }, { status: 400 });

  } catch (error) {
    console.error('[CONTENIDO] Error:', error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
