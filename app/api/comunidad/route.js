import { kv } from '@vercel/kv';

// ═══════════════════════════════════════════════════════════════════════════════
// API: COMUNIDAD / FORO
// Gestión de categorías, temas y respuestas
// ═══════════════════════════════════════════════════════════════════════════════

const CATEGORIAS = [
  { id: 'general', nombre: 'General', icono: '◆', descripcion: 'Presentaciones y charla libre', color: '#d4af37' },
  { id: 'guardianes', nombre: 'Guardianes', icono: '✦', descripcion: 'Experiencias, conexiones y cuidados', color: '#7B1FA2' },
  { id: 'rituales', nombre: 'Rituales y Prácticas', icono: '☽', descripcion: 'Compartir rituales y resultados', color: '#1565C0' },
  { id: 'luna', nombre: 'Luna y Estaciones', icono: '●', descripcion: 'Fases lunares y celebraciones celtas', color: '#455A64' },
  { id: 'cristales', nombre: 'Cristales y Herramientas', icono: '◇', descripcion: 'Preguntas y consejos', color: '#00796B' },
  { id: 'testimonios', nombre: 'Testimonios', icono: '★', descripcion: 'Historias de transformación', color: '#C62828' }
];

// GET - Obtener categorías y temas
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const accion = searchParams.get('accion');
    const categoria = searchParams.get('categoria');
    const temaId = searchParams.get('temaId');
    const page = parseInt(searchParams.get('page') || '1');
    const busqueda = searchParams.get('busqueda');

    // Obtener categorías
    if (accion === 'categorias') {
      // Contar temas por categoría
      const categoriasConStats = await Promise.all(CATEGORIAS.map(async (cat) => {
        const temas = await kv.get(`comunidad:temas:${cat.id}`) || [];
        return {
          ...cat,
          totalTemas: temas.length,
          ultimoTema: temas[0] || null
        };
      }));

      return Response.json({ success: true, categorias: categoriasConStats });
    }

    // Obtener tema específico con respuestas
    if (accion === 'tema' && temaId) {
      const tema = await kv.get(`comunidad:tema:${temaId}`);
      if (!tema) {
        return Response.json({ success: false, error: 'Tema no encontrado' }, { status: 404 });
      }

      const respuestas = await kv.get(`comunidad:respuestas:${temaId}`) || [];

      // Incrementar vistas
      tema.vistas = (tema.vistas || 0) + 1;
      await kv.set(`comunidad:tema:${temaId}`, tema);

      return Response.json({ success: true, tema, respuestas });
    }

    // Obtener temas de una categoría
    if (categoria) {
      let temas = await kv.get(`comunidad:temas:${categoria}`) || [];

      // Buscar si hay término
      if (busqueda) {
        const termino = busqueda.toLowerCase();
        temas = temas.filter(t =>
          t.titulo.toLowerCase().includes(termino) ||
          t.contenido?.toLowerCase().includes(termino)
        );
      }

      // Ordenar: fijados primero, luego por fecha
      temas.sort((a, b) => {
        if (a.fijado && !b.fijado) return -1;
        if (!a.fijado && b.fijado) return 1;
        return new Date(b.creadoEn) - new Date(a.creadoEn);
      });

      // Paginar
      const porPagina = 20;
      const inicio = (page - 1) * porPagina;
      const temasPage = temas.slice(inicio, inicio + porPagina);

      return Response.json({
        success: true,
        temas: temasPage,
        total: temas.length,
        pagina: page,
        totalPaginas: Math.ceil(temas.length / porPagina)
      });
    }

    // Temas recientes de todas las categorías
    let todosLosTemas = [];
    for (const cat of CATEGORIAS) {
      const temas = await kv.get(`comunidad:temas:${cat.id}`) || [];
      todosLosTemas.push(...temas.map(t => ({ ...t, categoriaInfo: cat })));
    }

    todosLosTemas.sort((a, b) => new Date(b.creadoEn) - new Date(a.creadoEn));

    return Response.json({
      success: true,
      temas: todosLosTemas.slice(0, 10),
      categorias: CATEGORIAS
    });

  } catch (error) {
    console.error('[COMUNIDAD] Error GET:', error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST - Crear tema, respuesta, dar corazón, reportar
export async function POST(request) {
  try {
    const body = await request.json();
    const { accion, email, nombre } = body;

    // Verificar que sea miembro del Círculo
    const usuario = await kv.get(`user:${email?.toLowerCase()}`) || await kv.get(`elegido:${email?.toLowerCase()}`);
    if (!usuario?.esCirculo) {
      return Response.json({ success: false, error: 'Solo miembros del Círculo pueden participar' }, { status: 403 });
    }

    switch (accion) {
      case 'crear-tema': {
        const { categoria, titulo, contenido } = body;

        if (!categoria || !titulo || !contenido) {
          return Response.json({ success: false, error: 'Faltan campos requeridos' }, { status: 400 });
        }

        if (!CATEGORIAS.find(c => c.id === categoria)) {
          return Response.json({ success: false, error: 'Categoría no válida' }, { status: 400 });
        }

        const nuevoTema = {
          id: `tema_${Date.now()}`,
          categoria,
          titulo: titulo.slice(0, 200),
          contenido: contenido.slice(0, 5000),
          autor: {
            email,
            nombre: nombre || usuario.nombre || 'Anónimo'
          },
          corazones: [],
          vistas: 0,
          totalRespuestas: 0,
          fijado: false,
          reportes: [],
          creadoEn: new Date().toISOString()
        };

        // Guardar tema
        await kv.set(`comunidad:tema:${nuevoTema.id}`, nuevoTema);

        // Agregar a lista de la categoría
        const temas = await kv.get(`comunidad:temas:${categoria}`) || [];
        temas.unshift({
          id: nuevoTema.id,
          titulo: nuevoTema.titulo,
          autor: nuevoTema.autor.nombre,
          corazones: 0,
          vistas: 0,
          totalRespuestas: 0,
          fijado: false,
          creadoEn: nuevoTema.creadoEn
        });
        await kv.set(`comunidad:temas:${categoria}`, temas);

        return Response.json({ success: true, tema: nuevoTema });
      }

      case 'responder': {
        const { temaId, contenido: respuestaContenido } = body;

        if (!temaId || !respuestaContenido) {
          return Response.json({ success: false, error: 'Faltan campos' }, { status: 400 });
        }

        const tema = await kv.get(`comunidad:tema:${temaId}`);
        if (!tema) {
          return Response.json({ success: false, error: 'Tema no encontrado' }, { status: 404 });
        }

        const nuevaRespuesta = {
          id: `resp_${Date.now()}`,
          contenido: respuestaContenido.slice(0, 3000),
          autor: {
            email,
            nombre: nombre || usuario.nombre || 'Anónimo'
          },
          corazones: [],
          reportes: [],
          creadoEn: new Date().toISOString()
        };

        // Agregar respuesta
        const respuestas = await kv.get(`comunidad:respuestas:${temaId}`) || [];
        respuestas.push(nuevaRespuesta);
        await kv.set(`comunidad:respuestas:${temaId}`, respuestas);

        // Actualizar contador en tema
        tema.totalRespuestas = respuestas.length;
        tema.ultimaRespuesta = new Date().toISOString();
        await kv.set(`comunidad:tema:${temaId}`, tema);

        // Actualizar lista de categoría
        const temasCategoria = await kv.get(`comunidad:temas:${tema.categoria}`) || [];
        const idx = temasCategoria.findIndex(t => t.id === temaId);
        if (idx !== -1) {
          temasCategoria[idx].totalRespuestas = respuestas.length;
        }
        await kv.set(`comunidad:temas:${tema.categoria}`, temasCategoria);

        return Response.json({ success: true, respuesta: nuevaRespuesta });
      }

      case 'corazon': {
        const { temaId, respuestaId } = body;

        if (respuestaId) {
          // Corazón a respuesta
          const respuestas = await kv.get(`comunidad:respuestas:${temaId}`) || [];
          const idx = respuestas.findIndex(r => r.id === respuestaId);
          if (idx === -1) {
            return Response.json({ success: false, error: 'Respuesta no encontrada' }, { status: 404 });
          }

          const corazones = respuestas[idx].corazones || [];
          const yaGustado = corazones.includes(email);

          if (yaGustado) {
            respuestas[idx].corazones = corazones.filter(e => e !== email);
          } else {
            respuestas[idx].corazones.push(email);
          }

          await kv.set(`comunidad:respuestas:${temaId}`, respuestas);

          return Response.json({
            success: true,
            corazones: respuestas[idx].corazones.length,
            gustado: !yaGustado
          });
        } else {
          // Corazón a tema
          const tema = await kv.get(`comunidad:tema:${temaId}`);
          if (!tema) {
            return Response.json({ success: false, error: 'Tema no encontrado' }, { status: 404 });
          }

          const corazones = tema.corazones || [];
          const yaGustado = corazones.includes(email);

          if (yaGustado) {
            tema.corazones = corazones.filter(e => e !== email);
          } else {
            tema.corazones.push(email);
          }

          await kv.set(`comunidad:tema:${temaId}`, tema);

          // Actualizar lista
          const temasCategoria = await kv.get(`comunidad:temas:${tema.categoria}`) || [];
          const idx = temasCategoria.findIndex(t => t.id === temaId);
          if (idx !== -1) {
            temasCategoria[idx].corazones = tema.corazones.length;
          }
          await kv.set(`comunidad:temas:${tema.categoria}`, temasCategoria);

          return Response.json({
            success: true,
            corazones: tema.corazones.length,
            gustado: !yaGustado
          });
        }
      }

      case 'reportar': {
        const { temaId, respuestaId, motivo } = body;

        if (respuestaId) {
          const respuestas = await kv.get(`comunidad:respuestas:${temaId}`) || [];
          const idx = respuestas.findIndex(r => r.id === respuestaId);
          if (idx !== -1) {
            respuestas[idx].reportes = respuestas[idx].reportes || [];
            respuestas[idx].reportes.push({ email, motivo, fecha: new Date().toISOString() });
            await kv.set(`comunidad:respuestas:${temaId}`, respuestas);
          }
        } else {
          const tema = await kv.get(`comunidad:tema:${temaId}`);
          if (tema) {
            tema.reportes = tema.reportes || [];
            tema.reportes.push({ email, motivo, fecha: new Date().toISOString() });
            await kv.set(`comunidad:tema:${temaId}`, tema);
          }
        }

        return Response.json({ success: true, mensaje: 'Reporte enviado. Lo revisaremos pronto.' });
      }

      case 'editar': {
        const { temaId, respuestaId, contenido: nuevoContenido } = body;

        if (respuestaId) {
          const respuestas = await kv.get(`comunidad:respuestas:${temaId}`) || [];
          const idx = respuestas.findIndex(r => r.id === respuestaId);
          if (idx === -1) {
            return Response.json({ success: false, error: 'Respuesta no encontrada' }, { status: 404 });
          }

          // Verificar autor
          if (respuestas[idx].autor.email !== email) {
            return Response.json({ success: false, error: 'Solo podés editar tus propias respuestas' }, { status: 403 });
          }

          // Verificar tiempo (30 min)
          const tiempoCreacion = new Date(respuestas[idx].creadoEn);
          const ahora = new Date();
          if ((ahora - tiempoCreacion) > 30 * 60 * 1000) {
            return Response.json({ success: false, error: 'Solo podés editar dentro de los primeros 30 minutos' }, { status: 403 });
          }

          respuestas[idx].contenido = nuevoContenido.slice(0, 3000);
          respuestas[idx].editadoEn = ahora.toISOString();
          await kv.set(`comunidad:respuestas:${temaId}`, respuestas);

          return Response.json({ success: true, respuesta: respuestas[idx] });
        } else {
          const tema = await kv.get(`comunidad:tema:${temaId}`);
          if (!tema) {
            return Response.json({ success: false, error: 'Tema no encontrado' }, { status: 404 });
          }

          if (tema.autor.email !== email) {
            return Response.json({ success: false, error: 'Solo podés editar tus propios temas' }, { status: 403 });
          }

          const tiempoCreacion = new Date(tema.creadoEn);
          const ahora = new Date();
          if ((ahora - tiempoCreacion) > 30 * 60 * 1000) {
            return Response.json({ success: false, error: 'Solo podés editar dentro de los primeros 30 minutos' }, { status: 403 });
          }

          tema.contenido = nuevoContenido.slice(0, 5000);
          tema.editadoEn = ahora.toISOString();
          await kv.set(`comunidad:tema:${temaId}`, tema);

          return Response.json({ success: true, tema });
        }
      }

      default:
        return Response.json({ success: false, error: 'Acción no válida' }, { status: 400 });
    }

  } catch (error) {
    console.error('[COMUNIDAD] Error POST:', error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
