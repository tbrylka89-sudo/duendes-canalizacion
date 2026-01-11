import { kv } from '@vercel/kv';

export const dynamic = 'force-dynamic';

// GET - Obtener notificaciones del admin
export async function GET() {
  try {
    const notificaciones = [];
    const ahora = new Date();

    // ═══ CÍRCULOS POR VENCER ═══
    try {
      const keys = await kv.keys('user:*');
      const elegidoKeys = await kv.keys('elegido:*');
      let porVencer = 0;

      for (const key of [...keys, ...elegidoKeys]) {
        const usuario = await kv.get(key);
        if (!usuario?.esCirculo || !usuario?.circuloExpira) continue;

        const expira = new Date(usuario.circuloExpira);
        const diasRestantes = Math.ceil((expira - ahora) / (1000 * 60 * 60 * 24));

        if (diasRestantes > 0 && diasRestantes <= 7) {
          porVencer++;
        }
      }

      if (porVencer > 0) {
        notificaciones.push({
          icon: '☽',
          titulo: 'Círculos por vencer',
          mensaje: `${porVencer} membresía${porVencer > 1 ? 's' : ''} vence${porVencer > 1 ? 'n' : ''} en 7 días`,
          tiempo: 'Revisar',
          color: '#f59e0b',
          url: '/admin/circulo?filtro=por-vencer'
        });
      }
    } catch (e) {}

    // ═══ CONTENIDO PROGRAMADO ═══
    try {
      const contenidoKeys = await kv.keys('contenido:*');
      let programados = 0;

      for (const key of contenidoKeys) {
        const contenido = await kv.get(key);
        if (contenido?.estado === 'programado' && contenido?.fechaPublicacion) {
          const fechaPub = new Date(contenido.fechaPublicacion);
          const horasHasta = (fechaPub - ahora) / (1000 * 60 * 60);

          if (horasHasta > 0 && horasHasta <= 24) {
            programados++;
          }
        }
      }

      if (programados > 0) {
        notificaciones.push({
          icon: '📅',
          titulo: 'Contenido próximo',
          mensaje: `${programados} publicación${programados > 1 ? 'es' : ''} programada${programados > 1 ? 's' : ''} para hoy`,
          tiempo: 'Ver',
          color: '#3b82f6',
          url: '/admin/contenido?filtro=programados'
        });
      }
    } catch (e) {}

    // ═══ REGALOS PENDIENTES ═══
    try {
      const regalosKeys = await kv.keys('regalo:*');
      let pendientes = 0;

      for (const key of regalosKeys) {
        const regalo = await kv.get(key);
        if (regalo?.estado === 'pendiente') {
          pendientes++;
        }
      }

      if (pendientes > 0) {
        notificaciones.push({
          icon: '🎁',
          titulo: 'Regalos pendientes',
          mensaje: `${pendientes} regalo${pendientes > 1 ? 's' : ''} físico${pendientes > 1 ? 's' : ''} por enviar`,
          tiempo: 'Gestionar',
          color: '#8b5cf6',
          url: '/admin/regalos?filtro=pendientes'
        });
      }
    } catch (e) {}

    // ═══ ESTADÍSTICAS DEL DÍA ═══
    try {
      const stats = await kv.get('stats:hoy');
      if (stats?.nuevosUsuarios > 0) {
        notificaciones.push({
          icon: '✨',
          titulo: 'Nuevos usuarios',
          mensaje: `${stats.nuevosUsuarios} nuevo${stats.nuevosUsuarios > 1 ? 's' : ''} usuario${stats.nuevosUsuarios > 1 ? 's' : ''} hoy`,
          tiempo: 'Hoy',
          color: '#22c55e',
          url: '/admin/clientes'
        });
      }
    } catch (e) {}

    return Response.json({
      success: true,
      notificaciones,
      total: notificaciones.length
    });

  } catch (error) {
    console.error('Error obteniendo notificaciones:', error);
    return Response.json({
      success: true,
      notificaciones: [],
      total: 0
    });
  }
}
