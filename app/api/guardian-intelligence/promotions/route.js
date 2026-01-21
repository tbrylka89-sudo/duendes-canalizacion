/**
 * GUARDIAN INTELLIGENCE - API DE PROMOCIONES
 * GET: Obtener promociones activas o todas
 * POST: Crear, actualizar, eliminar promociones
 */

import { NextResponse } from 'next/server';
import {
  crearPromocion,
  obtenerPromocionesActivas,
  obtenerTodasPromociones,
  togglePromocion,
  eliminarPromocion,
  obtenerBannerRotativo,
  registrarEstadisticaPromo,
  verificarFechaEspecialProxima,
  generarPromocionFechaEspecial,
  generarEmailPromocion,
  generarHTMLBanner
} from '@/lib/guardian-intelligence/promotions';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const accion = searchParams.get('accion') || 'activas';

    // Obtener promociones activas
    if (accion === 'activas') {
      const promociones = await obtenerPromocionesActivas();
      return NextResponse.json({
        success: true,
        promociones,
        total: promociones.length
      });
    }

    // Obtener todas las promociones
    if (accion === 'todas') {
      const limite = parseInt(searchParams.get('limite')) || 50;
      const promociones = await obtenerTodasPromociones(limite);
      return NextResponse.json({
        success: true,
        promociones,
        total: promociones.length
      });
    }

    // Obtener banner rotativo para la web
    if (accion === 'banner') {
      const banner = await obtenerBannerRotativo();
      if (!banner) {
        return NextResponse.json({
          success: true,
          hayBanner: false,
          mensaje: 'No hay promociones activas'
        });
      }
      return NextResponse.json({
        success: true,
        hayBanner: true,
        banner
      });
    }

    // Verificar fechas especiales próximas
    if (accion === 'fechas-especiales') {
      const dias = parseInt(searchParams.get('dias')) || 7;
      const fechas = verificarFechaEspecialProxima(dias);
      return NextResponse.json({
        success: true,
        fechasProximas: fechas
      });
    }

    return NextResponse.json({
      success: false,
      error: 'Acción no válida',
      accionesDisponibles: ['activas', 'todas', 'banner', 'fechas-especiales']
    }, { status: 400 });

  } catch (error) {
    console.error('[GI Promotions GET] Error:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { accion } = body;

    // Crear nueva promoción
    if (accion === 'crear') {
      const { datos } = body;

      if (!datos || !datos.titulo) {
        return NextResponse.json({
          success: false,
          error: 'Se requiere al menos un título'
        }, { status: 400 });
      }

      const promocion = await crearPromocion(datos);

      return NextResponse.json({
        success: true,
        promocion,
        mensaje: 'Promoción creada correctamente'
      });
    }

    // Activar/desactivar promoción
    if (accion === 'toggle') {
      const { id, activa } = body;

      if (!id) {
        return NextResponse.json({
          success: false,
          error: 'Se requiere ID de promoción'
        }, { status: 400 });
      }

      const promocion = await togglePromocion(id, activa);

      if (!promocion) {
        return NextResponse.json({
          success: false,
          error: 'Promoción no encontrada'
        }, { status: 404 });
      }

      return NextResponse.json({
        success: true,
        promocion,
        mensaje: `Promoción ${activa ? 'activada' : 'desactivada'}`
      });
    }

    // Eliminar promoción
    if (accion === 'eliminar') {
      const { id } = body;

      if (!id) {
        return NextResponse.json({
          success: false,
          error: 'Se requiere ID de promoción'
        }, { status: 400 });
      }

      await eliminarPromocion(id);

      return NextResponse.json({
        success: true,
        mensaje: 'Promoción eliminada'
      });
    }

    // Registrar estadística
    if (accion === 'estadistica') {
      const { id, tipo } = body;

      if (!id || !tipo) {
        return NextResponse.json({
          success: false,
          error: 'Se requiere ID y tipo de estadística'
        }, { status: 400 });
      }

      const promocion = await registrarEstadisticaPromo(id, tipo);

      return NextResponse.json({
        success: true,
        estadisticas: promocion?.estadisticas
      });
    }

    // Generar promoción para fecha especial
    if (accion === 'generar-fecha-especial') {
      const { fechaEspecial } = body;

      if (!fechaEspecial) {
        return NextResponse.json({
          success: false,
          error: 'Se requiere información de fecha especial'
        }, { status: 400 });
      }

      const promocion = await generarPromocionFechaEspecial(fechaEspecial);

      return NextResponse.json({
        success: true,
        promocion,
        mensaje: `Promoción para ${fechaEspecial.nombre} creada`
      });
    }

    // Generar HTML del banner
    if (accion === 'generar-banner') {
      const { promocion, estilo } = body;

      if (!promocion) {
        return NextResponse.json({
          success: false,
          error: 'Se requiere datos de promoción'
        }, { status: 400 });
      }

      const html = generarHTMLBanner(promocion, estilo || 'horizontal');

      return NextResponse.json({
        success: true,
        html
      });
    }

    // Generar email promocional
    if (accion === 'generar-email') {
      const { promocion, productos } = body;

      if (!promocion) {
        return NextResponse.json({
          success: false,
          error: 'Se requiere datos de promoción'
        }, { status: 400 });
      }

      const html = generarEmailPromocion(promocion, productos || []);

      return NextResponse.json({
        success: true,
        html
      });
    }

    return NextResponse.json({
      success: false,
      error: 'Acción no válida',
      accionesDisponibles: ['crear', 'toggle', 'eliminar', 'estadistica', 'generar-fecha-especial', 'generar-banner', 'generar-email']
    }, { status: 400 });

  } catch (error) {
    console.error('[GI Promotions POST] Error:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
