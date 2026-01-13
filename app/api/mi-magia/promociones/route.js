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

    // Obtener todas las promociones
    const promociones = await kv.get('promociones:lista') || [];

    // Filtrar solo las activas si no se piden todas
    const ahora = new Date();
    const promosFiltradas = incluirInactivas
      ? promociones
      : promociones.filter(p => {
          if (!p.activa) return false;
          if (p.fechaInicio && new Date(p.fechaInicio) > ahora) return false;
          if (p.fechaFin && new Date(p.fechaFin) < ahora) return false;
          return true;
        });

    return Response.json({
      success: true,
      promociones: promosFiltradas,
      total: promosFiltradas.length
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
