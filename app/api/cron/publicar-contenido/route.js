import { kv } from '@vercel/kv';

// ═══════════════════════════════════════════════════════════════════════════════
// CRON: PUBLICAR CONTENIDO PROGRAMADO
// Ejecutar cada hora para publicar contenido a las 10:00 AM Uruguay (13:00 UTC)
// ═══════════════════════════════════════════════════════════════════════════════

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const ahora = new Date();
    const horaUTC = ahora.getUTCHours();

    // Hora Uruguay = UTC - 3, entonces 10:00 Uruguay = 13:00 UTC
    // Permitir ventana de 13:00-13:59 UTC
    const enVentanaPublicacion = horaUTC === 13;

    const año = ahora.getFullYear();
    const mes = ahora.getMonth() + 1;
    const dia = ahora.getDate();

    const key = `circulo:contenido:${año}:${mes}:${dia}`;
    const contenido = await kv.get(key);

    const resultado = {
      success: true,
      fecha: `${dia}/${mes}/${año}`,
      horaUTC,
      horaUruguay: (horaUTC - 3 + 24) % 24,
      enVentanaPublicacion,
      contenidoExiste: !!contenido,
      estadoAnterior: contenido?.estado || null,
      accion: 'ninguna'
    };

    if (!contenido) {
      resultado.mensaje = 'No hay contenido para hoy';
      return Response.json(resultado);
    }

    // Si ya está publicado, no hacer nada
    if (contenido.estado === 'publicado') {
      resultado.mensaje = 'El contenido de hoy ya está publicado';
      resultado.titulo = contenido.titulo;
      return Response.json(resultado);
    }

    // Si está programado y estamos en ventana de publicación
    if (contenido.estado === 'programado' && enVentanaPublicacion) {
      contenido.estado = 'publicado';
      contenido.publicadoEn = ahora.toISOString();
      contenido.publicadoAutomaticamente = true;

      await kv.set(key, contenido);

      resultado.accion = 'publicado';
      resultado.mensaje = `Contenido publicado: ${contenido.titulo}`;
      resultado.titulo = contenido.titulo;

      // Registrar en log
      const logKey = 'circulo:publicaciones:log';
      const log = await kv.get(logKey) || [];
      log.unshift({
        fecha: ahora.toISOString(),
        dia, mes, año,
        titulo: contenido.titulo,
        tipo: contenido.tipo,
        automatico: true
      });
      await kv.set(logKey, log.slice(0, 100));

      return Response.json(resultado);
    }

    // Si está programado pero no es hora
    if (contenido.estado === 'programado') {
      resultado.mensaje = `Contenido programado pendiente. Hora actual: ${(horaUTC - 3 + 24) % 24}:00 Uruguay. Publicación a las 10:00.`;
      resultado.titulo = contenido.titulo;
      return Response.json(resultado);
    }

    resultado.mensaje = `Estado del contenido: ${contenido.estado}`;
    return Response.json(resultado);

  } catch (error) {
    console.error('[CRON/PUBLICAR] Error:', error);
    return Response.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}

// POST - Publicar manualmente o forzar publicación
export async function POST(request) {
  try {
    const { dia, mes, año, forzar } = await request.json();

    const fechaTarget = dia && mes && año
      ? { dia, mes, año }
      : {
          dia: new Date().getDate(),
          mes: new Date().getMonth() + 1,
          año: new Date().getFullYear()
        };

    const key = `circulo:contenido:${fechaTarget.año}:${fechaTarget.mes}:${fechaTarget.dia}`;
    const contenido = await kv.get(key);

    if (!contenido) {
      return Response.json({
        success: false,
        error: 'No hay contenido para esta fecha'
      }, { status: 404 });
    }

    if (contenido.estado === 'publicado' && !forzar) {
      return Response.json({
        success: false,
        error: 'El contenido ya está publicado. Usa forzar=true para republicar.'
      }, { status: 400 });
    }

    contenido.estado = 'publicado';
    contenido.publicadoEn = new Date().toISOString();
    contenido.publicadoManualmente = true;

    await kv.set(key, contenido);

    return Response.json({
      success: true,
      mensaje: `Contenido publicado: ${contenido.titulo}`,
      contenido
    });

  } catch (error) {
    console.error('[CRON/PUBLICAR] Error POST:', error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
