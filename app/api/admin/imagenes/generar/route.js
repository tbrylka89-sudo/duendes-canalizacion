import { kv } from '@vercel/kv';
import {
  generarImagen,
  generarImagenDuende,
  generarImagenContenido,
  generarImagenCurso,
  generarBannerDuendeSemana,
  verificarConfiguracion,
  MODELOS_DISPONIBLES
} from '@/lib/imagenes/generador';

// ═══════════════════════════════════════════════════════════════════════════════
// API ADMIN: GENERADOR DE IMAGENES UNIFICADO
// Endpoint central para generar imagenes de duendes, contenido, cursos
// ═══════════════════════════════════════════════════════════════════════════════

export const dynamic = 'force-dynamic';
export const maxDuration = 120; // Las generaciones pueden tardar

// Keys para historial
const KEYS = {
  historial: 'admin:imagenes:historial',
  stats: 'admin:imagenes:stats'
};

// ═══════════════════════════════════════════════════════════════════════════════
// POST - Generar imagen
// ═══════════════════════════════════════════════════════════════════════════════

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      tipo,      // 'duende' | 'contenido' | 'curso' | 'semana' | 'custom'
      datos,     // Datos especificos del tipo
      api = 'replicate',  // 'replicate' | 'openai'
      modelo,    // Modelo especifico (opcional)
      aspectRatio = '16:9',
      guardarHistorial = true
    } = body;

    // Validaciones
    if (!tipo) {
      return Response.json({
        success: false,
        error: 'Se requiere tipo de imagen (duende, contenido, curso, semana, custom)'
      }, { status: 400 });
    }

    if (!datos) {
      return Response.json({
        success: false,
        error: 'Se requieren datos para generar la imagen'
      }, { status: 400 });
    }

    // Verificar configuracion
    const config = verificarConfiguracion();
    if (!config.replicate && !config.openai) {
      return Response.json({
        success: false,
        error: 'No hay APIs de imagenes configuradas. Configura REPLICATE_API_TOKEN o OPENAI_API_KEY'
      }, { status: 400 });
    }

    // Si pide una API que no esta configurada, usar la otra
    let apiReal = api;
    if (api === 'replicate' && !config.replicate && config.openai) {
      apiReal = 'openai';
    } else if (api === 'openai' && !config.openai && config.replicate) {
      apiReal = 'replicate';
    }

    console.log(`[IMAGENES] Generando ${tipo} con ${apiReal}${modelo ? ` (${modelo})` : ''}`);

    // Generar imagen segun tipo
    let resultado;
    const opciones = { api: apiReal, modelo, aspectRatio };

    switch (tipo) {
      case 'duende':
        resultado = await generarImagenDuende(datos, opciones);
        break;

      case 'contenido':
        resultado = await generarImagenContenido(datos, opciones);
        break;

      case 'curso':
        resultado = await generarImagenCurso(datos, opciones);
        break;

      case 'semana':
      case 'duende-semana':
        resultado = await generarBannerDuendeSemana(datos, opciones);
        break;

      case 'custom':
        if (!datos.prompt) {
          return Response.json({
            success: false,
            error: 'Para tipo custom se requiere datos.prompt'
          }, { status: 400 });
        }
        resultado = await generarImagen({ tipo: 'custom', datos, ...opciones });
        break;

      default:
        return Response.json({
          success: false,
          error: `Tipo no reconocido: ${tipo}. Usa: duende, contenido, curso, semana, custom`
        }, { status: 400 });
    }

    // Si fallo, devolver error
    if (!resultado.success) {
      return Response.json({
        success: false,
        error: resultado.error
      }, { status: 500 });
    }

    // Guardar en historial
    if (guardarHistorial) {
      try {
        const historial = await kv.get(KEYS.historial) || [];
        const registro = {
          id: `img_${Date.now()}`,
          tipo,
          datos: {
            nombre: datos.nombre || datos.titulo || 'Sin nombre',
            categoria: datos.categoria,
            tipo: datos.tipo
          },
          api: apiReal,
          modelo: resultado.modelo,
          url: resultado.url,
          fecha: new Date().toISOString()
        };
        historial.unshift(registro);
        await kv.set(KEYS.historial, historial.slice(0, 100));

        // Actualizar stats
        const stats = await kv.get(KEYS.stats) || { total: 0, porTipo: {}, porApi: {} };
        stats.total++;
        stats.porTipo[tipo] = (stats.porTipo[tipo] || 0) + 1;
        stats.porApi[apiReal] = (stats.porApi[apiReal] || 0) + 1;
        stats.ultimaGeneracion = new Date().toISOString();
        await kv.set(KEYS.stats, stats);
      } catch (e) {
        console.error('[IMAGENES] Error guardando historial:', e);
      }
    }

    return Response.json({
      success: true,
      imagen: {
        url: resultado.url,
        tipo,
        api: apiReal,
        modelo: resultado.modelo,
        promptRevisado: resultado.promptRevisado
      }
    });

  } catch (error) {
    console.error('[IMAGENES] Error:', error);
    return Response.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// GET - Obtener configuracion, historial y stats
// ═══════════════════════════════════════════════════════════════════════════════

export async function GET(request) {
  try {
    const url = new URL(request.url);
    const accion = url.searchParams.get('accion');

    // Configuracion y APIs disponibles
    const config = verificarConfiguracion();

    // Solo configuracion
    if (accion === 'config') {
      return Response.json({
        success: true,
        config,
        modelos: MODELOS_DISPONIBLES,
        tipos: ['duende', 'contenido', 'curso', 'semana', 'custom'],
        aspectRatios: ['1:1', '16:9', '9:16']
      });
    }

    // Solo historial
    if (accion === 'historial') {
      const limite = parseInt(url.searchParams.get('limite') || '20');
      const historial = await kv.get(KEYS.historial) || [];
      return Response.json({
        success: true,
        historial: historial.slice(0, limite),
        total: historial.length
      });
    }

    // Solo stats
    if (accion === 'stats') {
      const stats = await kv.get(KEYS.stats) || { total: 0, porTipo: {}, porApi: {} };
      return Response.json({
        success: true,
        stats
      });
    }

    // Todo junto (default)
    const historial = await kv.get(KEYS.historial) || [];
    const stats = await kv.get(KEYS.stats) || { total: 0, porTipo: {}, porApi: {} };

    return Response.json({
      success: true,
      config,
      modelos: MODELOS_DISPONIBLES,
      tipos: {
        duende: {
          descripcion: 'Imagen de un guardian/duende',
          campos: ['nombre', 'descripcion', 'categoria', 'elemento', 'cristales'],
          ejemplo: { nombre: 'Prospero', categoria: 'Abundancia', elemento: 'tierra' }
        },
        contenido: {
          descripcion: 'Imagen para ensenanza, ritual, meditacion',
          campos: ['tipo', 'titulo', 'descripcion', 'duende'],
          ejemplo: { tipo: 'ritual', titulo: 'Ritual de Luna Llena', duende: 'Ancestral' }
        },
        curso: {
          descripcion: 'Portada de curso mensual',
          campos: ['nombre', 'descripcion', 'portal', 'categoria'],
          ejemplo: { nombre: 'Abundancia en Litha', portal: 'litha' }
        },
        semana: {
          descripcion: 'Banner para Duende de la Semana',
          campos: ['nombre', 'descripcion', 'categoria', 'proposito'],
          ejemplo: { nombre: 'Centinela', categoria: 'Proteccion' }
        },
        custom: {
          descripcion: 'Prompt personalizado',
          campos: ['prompt', 'tamanio', 'calidad'],
          ejemplo: { prompt: 'Mystical forest with crystals and golden light' }
        }
      },
      aspectRatios: [
        { id: '1:1', nombre: 'Cuadrado', uso: 'Perfil, avatar' },
        { id: '16:9', nombre: 'Horizontal', uso: 'Banner, portada' },
        { id: '9:16', nombre: 'Vertical', uso: 'Stories, movil' }
      ],
      historial: historial.slice(0, 10),
      stats
    });

  } catch (error) {
    console.error('[IMAGENES] Error GET:', error);
    return Response.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// DELETE - Limpiar historial
// ═══════════════════════════════════════════════════════════════════════════════

export async function DELETE(request) {
  try {
    const url = new URL(request.url);
    const todo = url.searchParams.get('todo') === '1';

    if (todo) {
      await kv.del(KEYS.historial);
      await kv.set(KEYS.stats, { total: 0, porTipo: {}, porApi: {} });
      return Response.json({
        success: true,
        mensaje: 'Historial y estadisticas limpiados'
      });
    }

    // Limpiar solo historial viejo (mas de 30 dias)
    const historial = await kv.get(KEYS.historial) || [];
    const hace30Dias = new Date();
    hace30Dias.setDate(hace30Dias.getDate() - 30);

    const filtrado = historial.filter(item => new Date(item.fecha) > hace30Dias);
    await kv.set(KEYS.historial, filtrado);

    return Response.json({
      success: true,
      eliminados: historial.length - filtrado.length,
      restantes: filtrado.length
    });

  } catch (error) {
    return Response.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
