import { kv } from '@vercel/kv';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
  return new Response(null, { status: 200, headers: corsHeaders });
}

// GET - Obtener promociones activas
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const incluirInactivas = searchParams.get('todas') === 'true';
    const ubicacion = searchParams.get('ubicacion'); // header, mi-magia-promos, etc.
    const email = searchParams.get('email');

    // Obtener datos del usuario para filtrar por audiencia
    let usuario = null;
    if (email) {
      usuario = await kv.get(`user:${email.toLowerCase()}`) || await kv.get(`elegido:${email.toLowerCase()}`);
    }

    const ahora = new Date();
    const promocionesActivas = [];

    // 1. Obtener promociones del sistema antiguo (lista)
    const promocionesLista = await kv.get('promociones:lista') || [];
    for (const p of promocionesLista) {
      if (!incluirInactivas) {
        if (!p.activa) continue;
        if (p.fechaInicio && new Date(p.fechaInicio) > ahora) continue;
        if (p.fechaFin && new Date(p.fechaFin) < ahora) continue;
      }
      promocionesActivas.push({
        ...p,
        origen: 'lista'
      });
    }

    // 2. Obtener promociones del nuevo sistema CRUD
    const keys = await kv.keys('promociones:promo_*');
    for (const key of keys) {
      const promo = await kv.get(key);
      if (!promo || !promo.id) continue;

      // Calcular si está activa
      const fechaInicio = promo.fechaInicio ? new Date(promo.fechaInicio) : null;
      const fechaFin = promo.fechaFin ? new Date(promo.fechaFin) : null;

      let estaActiva = promo.estado === 'activa';
      if (promo.estado !== 'pausada' && promo.estado !== 'borrador') {
        if (fechaInicio && fechaInicio > ahora) {
          estaActiva = false;
        } else if (fechaFin && fechaFin < ahora) {
          estaActiva = false;
        } else if (!fechaInicio || fechaInicio <= ahora) {
          estaActiva = true;
        }
      }

      if (!incluirInactivas && !estaActiva) continue;

      // Filtrar por ubicación si se especifica
      if (ubicacion && promo.ubicaciones && !promo.ubicaciones.includes(ubicacion)) {
        continue;
      }

      // Filtrar por audiencia
      if (promo.audiencia && promo.audiencia !== 'todos') {
        if (promo.audiencia === 'circulo' && !usuario?.esCirculo) continue;
        if (promo.audiencia === 'clientes' && (!usuario?.compras || usuario.compras.length === 0)) continue;
        if (promo.audiencia === 'nuevos' && usuario?.compras && usuario.compras.length > 0) continue;
      }

      // Calcular cuenta regresiva si aplica
      let cuentaRegresiva = null;
      if (promo.cuentaRegresiva && fechaFin) {
        const diff = fechaFin - ahora;
        if (diff > 0) {
          const dias = Math.floor(diff / (1000 * 60 * 60 * 24));
          const horas = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutos = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
          cuentaRegresiva = { dias, horas, minutos };
        }
      }

      // Construir URL del botón
      let urlBoton = '#';
      if (promo.boton) {
        switch (promo.boton.tipo) {
          case 'link':
            urlBoton = promo.boton.url || '#';
            break;
          case 'cupon':
            urlBoton = `https://duendesdeluruguay.com/tienda/?coupon=${promo.boton.codigoCupon || ''}`;
            break;
          case 'circulo':
            urlBoton = '/mi-magia/circulo';
            break;
          default:
            urlBoton = '#';
        }
      }

      promocionesActivas.push({
        id: promo.id,
        titulo: promo.tituloBanner,
        subtitulo: promo.subtitulo,
        icono: promo.icono,
        colores: promo.colores,
        efectos: promo.efectos,
        url: urlBoton,
        textoBoton: promo.boton?.texto || 'Ver más',
        permitirCerrar: promo.permitirCerrar,
        cuentaRegresiva,
        prioridad: promo.prioridad,
        ubicaciones: promo.ubicaciones,
        origen: 'crud'
      });
    }

    // Ordenar por prioridad
    promocionesActivas.sort((a, b) => {
      const prioridadOrder = { alta: 0, media: 1, baja: 2 };
      return (prioridadOrder[a.prioridad] || 1) - (prioridadOrder[b.prioridad] || 1);
    });

    return Response.json({
      success: true,
      promociones: promocionesActivas,
      total: promocionesActivas.length
    }, { headers: corsHeaders });

  } catch (error) {
    console.error('Error obteniendo promociones:', error);
    return Response.json({
      success: false,
      error: error.message
    }, { status: 500, headers: corsHeaders });
  }
}

// POST - Crear nueva promoción (admin)
export async function POST(request) {
  try {
    const body = await request.json();
    const { titulo, subtitulo, descripcion, beneficios, icono, color, url, textoBoton, fechaInicio, fechaFin } = body;

    if (!titulo) {
      return Response.json({
        success: false,
        error: 'El título es requerido'
      }, { status: 400, headers: corsHeaders });
    }

    const nuevaPromo = {
      id: `promo_${Date.now()}`,
      titulo,
      subtitulo: subtitulo || '',
      descripcion: descripcion || '',
      beneficios: beneficios || [],
      icono: icono || '🎁',
      color: color || '#d4af37',
      url: url || '',
      textoBoton: textoBoton || 'Ver más',
      activa: true,
      fechaInicio: fechaInicio || null,
      fechaFin: fechaFin || null,
      creadaEn: new Date().toISOString()
    };

    // Obtener lista actual y agregar la nueva
    const promociones = await kv.get('promociones:lista') || [];
    promociones.unshift(nuevaPromo);
    await kv.set('promociones:lista', promociones);

    return Response.json({
      success: true,
      promocion: nuevaPromo
    }, { headers: corsHeaders });

  } catch (error) {
    console.error('Error creando promoción:', error);
    return Response.json({
      success: false,
      error: error.message
    }, { status: 500, headers: corsHeaders });
  }
}

// PUT - Actualizar promoción
export async function PUT(request) {
  try {
    const body = await request.json();
    const { id, ...actualizaciones } = body;

    if (!id) {
      return Response.json({
        success: false,
        error: 'ID de promoción requerido'
      }, { status: 400, headers: corsHeaders });
    }

    const promociones = await kv.get('promociones:lista') || [];
    const index = promociones.findIndex(p => p.id === id);

    if (index === -1) {
      return Response.json({
        success: false,
        error: 'Promoción no encontrada'
      }, { status: 404, headers: corsHeaders });
    }

    // Actualizar campos
    promociones[index] = { ...promociones[index], ...actualizaciones, actualizadaEn: new Date().toISOString() };
    await kv.set('promociones:lista', promociones);

    return Response.json({
      success: true,
      promocion: promociones[index]
    }, { headers: corsHeaders });

  } catch (error) {
    console.error('Error actualizando promoción:', error);
    return Response.json({
      success: false,
      error: error.message
    }, { status: 500, headers: corsHeaders });
  }
}

// DELETE - Eliminar promoción
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return Response.json({
        success: false,
        error: 'ID de promoción requerido'
      }, { status: 400, headers: corsHeaders });
    }

    const promociones = await kv.get('promociones:lista') || [];
    const filtradas = promociones.filter(p => p.id !== id);

    if (filtradas.length === promociones.length) {
      return Response.json({
        success: false,
        error: 'Promoción no encontrada'
      }, { status: 404, headers: corsHeaders });
    }

    await kv.set('promociones:lista', filtradas);

    return Response.json({
      success: true,
      message: 'Promoción eliminada'
    }, { headers: corsHeaders });

  } catch (error) {
    console.error('Error eliminando promoción:', error);
    return Response.json({
      success: false,
      error: error.message
    }, { status: 500, headers: corsHeaders });
  }
}
