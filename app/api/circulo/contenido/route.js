export const dynamic = 'force-dynamic';

import { kv } from '@vercel/kv';

// ═══════════════════════════════════════════════════════════════════════════════
// API: Contenido del Círculo
// Busca en ambos formatos: circulo:contenido:año:mes:dia Y contenido:YYYY-MM-DD
// ═══════════════════════════════════════════════════════════════════════════════

// Helper para obtener contenido de cualquier formato de key
async function obtenerContenido(año, mes, dia) {
  // Formato 1: circulo:contenido:año:mes:dia
  let contenido = await kv.get(`circulo:contenido:${año}:${mes}:${dia}`);
  if (contenido) return contenido;

  // Formato 2: contenido:YYYY-MM-DD
  const fechaFormateada = `${año}-${String(mes).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;
  contenido = await kv.get(`contenido:${fechaFormateada}`);
  return contenido;
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    const dia = searchParams.get('dia'); // día específico (1-31)
    const mes = searchParams.get('mes'); // mes específico (1-12)
    const año = searchParams.get('año') || searchParams.get('ano');
    const fecha = searchParams.get('fecha'); // formato YYYY-MM-DD
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

    // Si viene fecha en formato YYYY-MM-DD, parsearla
    let añoActual, mesActual, diaActual;
    if (fecha) {
      const [y, m, d] = fecha.split('-').map(Number);
      añoActual = y;
      mesActual = m;
      diaActual = d;
    } else {
      const ahora = new Date();
      añoActual = año ? parseInt(año) : ahora.getFullYear();
      mesActual = mes ? parseInt(mes) : ahora.getMonth() + 1;
      diaActual = dia ? parseInt(dia) : ahora.getDate();
    }

    // Según el tipo de petición
    if (tipo === 'hoy' || (!tipo && !dia && !mes && !fecha)) {
      // Contenido de HOY
      const contenidoHoy = await obtenerContenido(añoActual, mesActual, diaActual);

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
      const hoy = new Date();
      for (let i = 0; i < 7; i++) {
        const fechaCheck = new Date(hoy);
        fechaCheck.setDate(fechaCheck.getDate() - i);
        const contenido = await obtenerContenido(
          fechaCheck.getFullYear(),
          fechaCheck.getMonth() + 1,
          fechaCheck.getDate()
        );
        if (contenido) {
          contenidos.push({
            fecha: {
              año: fechaCheck.getFullYear(),
              mes: fechaCheck.getMonth() + 1,
              dia: fechaCheck.getDate(),
              diaSemana: fechaCheck.toLocaleDateString('es-ES', { weekday: 'long' })
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

    if (tipo === 'mes' || (mes && !fecha)) {
      // Contenido del mes especificado
      const contenidos = [];
      const diasEnMes = new Date(añoActual, mesActual, 0).getDate();

      for (let d = 1; d <= diasEnMes; d++) {
        const contenido = await obtenerContenido(añoActual, mesActual, d);
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
      const hoy = new Date();

      // Revisar últimos 6 meses
      for (let i = 0; i < 6; i++) {
        const fechaCheck = new Date(hoy.getFullYear(), hoy.getMonth() - i, 1);
        const añoCheck = fechaCheck.getFullYear();
        const mesCheck = fechaCheck.getMonth() + 1;

        // Contar contenidos del mes
        let conteo = 0;
        const diasEnMes = new Date(añoCheck, mesCheck, 0).getDate();

        for (let d = 1; d <= Math.min(diasEnMes, 31); d++) {
          const contenido = await obtenerContenido(añoCheck, mesCheck, d);
          if (contenido) conteo++;
        }

        if (conteo > 0) {
          mesesConContenido.push({
            año: añoCheck,
            mes: mesCheck,
            nombreMes: fechaCheck.toLocaleDateString('es-ES', { month: 'long' }),
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

    // Día específico o fecha específica
    if (dia || fecha) {
      const contenido = await obtenerContenido(añoActual, mesActual, diaActual);

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
