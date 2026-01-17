import { kv } from '@vercel/kv';

// ═══════════════════════════════════════════════════════════════════════════════
// API: DUENDE DISPONIBLE
// Muestra un duende real a la venta que desaparece cuando lo compran
// ═══════════════════════════════════════════════════════════════════════════════

export async function GET() {
  try {
    // Obtener el duende destacado actual
    const destacado = await kv.get('duende-destacado');

    if (!destacado) {
      return Response.json({
        success: true,
        disponible: false,
        mensaje: 'Próximo guardián pronto...'
      });
    }

    // Verificar si fue adoptado recientemente
    if (destacado.adoptado) {
      const tiempoAdoptado = new Date() - new Date(destacado.adoptadoEn);
      const minutosAdoptado = Math.floor(tiempoAdoptado / 60000);

      // Mostrar mensaje de adoptado por 24 horas
      if (tiempoAdoptado < 24 * 60 * 60 * 1000) {
        return Response.json({
          success: true,
          disponible: false,
          adoptado: true,
          nombre: destacado.nombre,
          mensaje: `¡${destacado.nombre} encontró su hogar!`,
          hace: minutosAdoptado < 60
            ? `Hace ${minutosAdoptado} minutos`
            : `Hace ${Math.floor(minutosAdoptado / 60)} horas`
        });
      } else {
        // Limpiar después de 24h
        await kv.del('duende-destacado');
        return Response.json({
          success: true,
          disponible: false,
          mensaje: 'Próximo guardián pronto...'
        });
      }
    }

    // Duende disponible
    return Response.json({
      success: true,
      disponible: true,
      duende: {
        id: destacado.id,
        nombre: destacado.nombre,
        descripcion: destacado.descripcion,
        cristales: destacado.cristales,
        proposito: destacado.proposito,
        precio: destacado.precio,
        imagen: destacado.imagen,
        url: destacado.url
      }
    });

  } catch (error) {
    console.error('[DUENDE-DISPONIBLE] Error:', error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST - Admin: Configurar duende destacado o marcar como adoptado
export async function POST(request) {
  try {
    const body = await request.json();
    const { accion } = body;

    switch (accion) {
      case 'destacar': {
        const { id, nombre, descripcion, cristales, proposito, precio, imagen, url } = body;

        if (!nombre || !precio) {
          return Response.json({ success: false, error: 'Nombre y precio requeridos' }, { status: 400 });
        }

        const nuevoDestacado = {
          id: id || `duende_${Date.now()}`,
          nombre,
          descripcion: descripcion || '',
          cristales: cristales || [],
          proposito: proposito || '',
          precio,
          imagen: imagen || null,
          url: url || '#',
          adoptado: false,
          destacadoEn: new Date().toISOString()
        };

        await kv.set('duende-destacado', nuevoDestacado);

        return Response.json({ success: true, duende: nuevoDestacado, mensaje: 'Duende destacado configurado' });
      }

      case 'marcar-adoptado': {
        const destacado = await kv.get('duende-destacado');

        if (!destacado) {
          return Response.json({ success: false, error: 'No hay duende destacado' }, { status: 404 });
        }

        destacado.adoptado = true;
        destacado.adoptadoEn = new Date().toISOString();
        await kv.set('duende-destacado', destacado);

        return Response.json({ success: true, mensaje: `${destacado.nombre} fue adoptado` });
      }

      case 'limpiar': {
        await kv.del('duende-destacado');
        return Response.json({ success: true, mensaje: 'Duende destacado eliminado' });
      }

      default:
        return Response.json({ success: false, error: 'Acción no válida' }, { status: 400 });
    }

  } catch (error) {
    console.error('[DUENDE-DISPONIBLE] Error POST:', error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
