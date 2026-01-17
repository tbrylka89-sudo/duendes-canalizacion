import { kv } from '@vercel/kv';

// ═══════════════════════════════════════════════════════════════════════════════
// API: BUZÓN DE SUGERENCIAS
// Envío, listado y votación de sugerencias
// ═══════════════════════════════════════════════════════════════════════════════

const CATEGORIAS = ['contenido', 'productos', 'portal', 'comunidad', 'otro'];
const ESTADOS = ['nueva', 'en_evaluacion', 'en_proceso', 'implementada', 'descartada'];

// GET - Listar sugerencias públicas
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const categoria = searchParams.get('categoria');
    const estado = searchParams.get('estado');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const admin = searchParams.get('admin') === 'true';

    let sugerencias = await kv.get('sugerencias:lista') || [];

    // Filtrar solo públicas para usuarios normales
    if (!admin) {
      sugerencias = sugerencias.filter(s => s.publica !== false && s.estado !== 'descartada');
    }

    // Filtrar por categoría
    if (categoria && categoria !== 'todas') {
      sugerencias = sugerencias.filter(s => s.categoria === categoria);
    }

    // Filtrar por estado
    if (estado && estado !== 'todos') {
      sugerencias = sugerencias.filter(s => s.estado === estado);
    }

    // Ordenar por votos y fecha
    sugerencias.sort((a, b) => {
      // Primero las implementadas
      if (a.estado === 'implementada' && b.estado !== 'implementada') return -1;
      if (a.estado !== 'implementada' && b.estado === 'implementada') return 1;
      // Luego por votos
      if ((b.votos || 0) !== (a.votos || 0)) return (b.votos || 0) - (a.votos || 0);
      // Luego por fecha
      return new Date(b.creadaEn) - new Date(a.creadaEn);
    });

    // Paginar
    const inicio = (page - 1) * limit;
    const paginadas = sugerencias.slice(inicio, inicio + limit);

    // Stats
    const stats = {
      total: sugerencias.length,
      nuevas: sugerencias.filter(s => s.estado === 'nueva').length,
      enEvaluacion: sugerencias.filter(s => s.estado === 'en_evaluacion').length,
      enProceso: sugerencias.filter(s => s.estado === 'en_proceso').length,
      implementadas: sugerencias.filter(s => s.estado === 'implementada').length,
      descartadas: sugerencias.filter(s => s.estado === 'descartada').length
    };

    return Response.json({
      success: true,
      sugerencias: paginadas,
      stats,
      pagina: page,
      totalPaginas: Math.ceil(sugerencias.length / limit),
      categorias: CATEGORIAS
    });

  } catch (error) {
    console.error('[SUGERENCIAS] Error GET:', error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST - Enviar sugerencia, votar, cambiar estado, responder
export async function POST(request) {
  try {
    const body = await request.json();
    const { accion } = body;

    switch (accion) {
      case 'enviar': {
        const { email, nombre, categoria, titulo, descripcion, anonimo } = body;

        if (!titulo || !descripcion || !categoria) {
          return Response.json({ success: false, error: 'Faltan campos requeridos' }, { status: 400 });
        }

        if (!CATEGORIAS.includes(categoria)) {
          return Response.json({ success: false, error: 'Categoría no válida' }, { status: 400 });
        }

        const nuevaSugerencia = {
          id: `sug_${Date.now()}`,
          titulo: titulo.slice(0, 200),
          descripcion: descripcion.slice(0, 2000),
          categoria,
          autor: anonimo ? null : { email, nombre: nombre || 'Anónimo' },
          anonimo: !!anonimo,
          estado: 'nueva',
          votos: 0,
          votantes: [],
          respuestaAdmin: null,
          publica: true,
          creadaEn: new Date().toISOString()
        };

        const sugerencias = await kv.get('sugerencias:lista') || [];
        sugerencias.unshift(nuevaSugerencia);
        await kv.set('sugerencias:lista', sugerencias);

        return Response.json({
          success: true,
          sugerencia: nuevaSugerencia,
          mensaje: 'Sugerencia enviada. ¡Gracias por ayudarnos a mejorar!'
        });
      }

      case 'votar': {
        const { sugerenciaId, email } = body;

        if (!sugerenciaId || !email) {
          return Response.json({ success: false, error: 'Faltan datos' }, { status: 400 });
        }

        const sugerencias = await kv.get('sugerencias:lista') || [];
        const idx = sugerencias.findIndex(s => s.id === sugerenciaId);

        if (idx === -1) {
          return Response.json({ success: false, error: 'Sugerencia no encontrada' }, { status: 404 });
        }

        const votantes = sugerencias[idx].votantes || [];
        const yaVoto = votantes.includes(email);

        if (yaVoto) {
          // Quitar voto
          sugerencias[idx].votantes = votantes.filter(e => e !== email);
          sugerencias[idx].votos = (sugerencias[idx].votos || 1) - 1;
        } else {
          // Agregar voto
          sugerencias[idx].votantes.push(email);
          sugerencias[idx].votos = (sugerencias[idx].votos || 0) + 1;
        }

        await kv.set('sugerencias:lista', sugerencias);

        return Response.json({
          success: true,
          votos: sugerencias[idx].votos,
          votado: !yaVoto
        });
      }

      case 'cambiar-estado': {
        const { sugerenciaId, estado } = body;

        if (!ESTADOS.includes(estado)) {
          return Response.json({ success: false, error: 'Estado no válido' }, { status: 400 });
        }

        const sugerencias = await kv.get('sugerencias:lista') || [];
        const idx = sugerencias.findIndex(s => s.id === sugerenciaId);

        if (idx === -1) {
          return Response.json({ success: false, error: 'Sugerencia no encontrada' }, { status: 404 });
        }

        sugerencias[idx].estado = estado;
        sugerencias[idx].estadoCambiadoEn = new Date().toISOString();
        await kv.set('sugerencias:lista', sugerencias);

        return Response.json({ success: true, mensaje: 'Estado actualizado' });
      }

      case 'responder': {
        const { sugerenciaId, respuesta } = body;

        if (!respuesta) {
          return Response.json({ success: false, error: 'La respuesta es requerida' }, { status: 400 });
        }

        const sugerencias = await kv.get('sugerencias:lista') || [];
        const idx = sugerencias.findIndex(s => s.id === sugerenciaId);

        if (idx === -1) {
          return Response.json({ success: false, error: 'Sugerencia no encontrada' }, { status: 404 });
        }

        sugerencias[idx].respuestaAdmin = {
          texto: respuesta.slice(0, 1000),
          fecha: new Date().toISOString()
        };
        await kv.set('sugerencias:lista', sugerencias);

        return Response.json({ success: true, mensaje: 'Respuesta guardada' });
      }

      case 'toggle-publica': {
        const { sugerenciaId } = body;

        const sugerencias = await kv.get('sugerencias:lista') || [];
        const idx = sugerencias.findIndex(s => s.id === sugerenciaId);

        if (idx === -1) {
          return Response.json({ success: false, error: 'Sugerencia no encontrada' }, { status: 404 });
        }

        sugerencias[idx].publica = !sugerencias[idx].publica;
        await kv.set('sugerencias:lista', sugerencias);

        return Response.json({
          success: true,
          publica: sugerencias[idx].publica,
          mensaje: sugerencias[idx].publica ? 'Ahora es pública' : 'Ahora es privada'
        });
      }

      case 'eliminar': {
        const { sugerenciaId } = body;

        const sugerencias = await kv.get('sugerencias:lista') || [];
        const filtradas = sugerencias.filter(s => s.id !== sugerenciaId);
        await kv.set('sugerencias:lista', filtradas);

        return Response.json({ success: true, mensaje: 'Sugerencia eliminada' });
      }

      default:
        return Response.json({ success: false, error: 'Acción no válida' }, { status: 400 });
    }

  } catch (error) {
    console.error('[SUGERENCIAS] Error POST:', error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
