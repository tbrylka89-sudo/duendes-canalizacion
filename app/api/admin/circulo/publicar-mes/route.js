import { kv } from '@vercel/kv';

export const dynamic = 'force-dynamic';

// ═══════════════════════════════════════════════════════════════
// PUBLICAR MES COMPLETO
// Cambia el estado de todos los contenidos a "publicado"
// ═══════════════════════════════════════════════════════════════

export async function POST(request) {
  try {
    const { mes, año } = await request.json();

    if (!mes || !año) {
      return Response.json({ success: false, error: 'Mes y año requeridos' }, { status: 400 });
    }

    // Obtener índice del mes
    const indice = await kv.get(`circulo:indice:${año}:${mes}`);

    if (!indice || !indice.diasConContenido?.length) {
      return Response.json({ success: false, error: 'No hay contenidos para publicar' }, { status: 400 });
    }

    let publicados = 0;

    // Actualizar cada contenido
    for (const dia of indice.diasConContenido) {
      const contenido = await kv.get(`circulo:contenido:${año}:${mes}:${dia}`);

      if (contenido && contenido.estado !== 'publicado') {
        contenido.estado = 'publicado';
        contenido.publicadoEn = new Date().toISOString();
        await kv.set(`circulo:contenido:${año}:${mes}:${dia}`, contenido);
        publicados++;
      }
    }

    return Response.json({
      success: true,
      publicados,
      mensaje: `${publicados} contenidos publicados para ${mes}/${año}`
    });

  } catch (error) {
    console.error('Error publicando mes:', error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
