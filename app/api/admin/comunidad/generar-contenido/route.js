import Anthropic from '@anthropic-ai/sdk';
import { kv } from '@vercel/kv';
import {
  MIEMBROS_FUNDADORES,
  obtenerPerfilPorId,
  obtenerPerfilAleatorio,
  seleccionarPerfilSegunContexto
} from '@/lib/comunidad/miembros-fundadores';
import {
  generarPromptPersonalidad,
  generarPromptComentario,
  generarPromptPost,
  generarComentarioRapido,
  validarComentario,
  TEMPLATES_COMENTARIOS
} from '@/lib/comunidad/generador-contenido';

// ═══════════════════════════════════════════════════════════════════════════════
// API: GENERAR CONTENIDO PARA LA COMUNIDAD
// Genera comentarios y posts con IA usando los perfiles fundadores
// ═══════════════════════════════════════════════════════════════════════════════

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

const anthropic = new Anthropic();

// Configuracion
const MODELO_IA = 'claude-sonnet-4-20250514';
const MAX_TOKENS = 1024;

// ═══════════════════════════════════════════════════════════════════════════════
// POST - Generar contenido
// ═══════════════════════════════════════════════════════════════════════════════

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      tipo = 'comentario', // comentario | post | respuestas
      cantidad = 1,
      fecha = new Date().toISOString().split('T')[0],
      perfilId = null,
      contexto = {},
      usarIA = true,
      guardar = false
    } = body;

    const resultados = [];

    for (let i = 0; i < cantidad; i++) {
      // Seleccionar perfil
      let perfil;
      if (perfilId) {
        perfil = obtenerPerfilPorId(perfilId);
        if (!perfil) {
          return Response.json({
            success: false,
            error: `Perfil no encontrado: ${perfilId}`
          }, { status: 400 });
        }
      } else {
        perfil = seleccionarPerfilSegunContexto(contexto);
      }

      let contenidoGenerado;

      if (tipo === 'comentario') {
        contenidoGenerado = await generarComentario(perfil, contexto, usarIA);
      } else if (tipo === 'post') {
        contenidoGenerado = await generarPost(perfil, contexto, usarIA);
      } else if (tipo === 'respuestas') {
        contenidoGenerado = await generarRespuestasMultiples(contexto, usarIA);
      } else {
        return Response.json({
          success: false,
          error: `Tipo no valido: ${tipo}`
        }, { status: 400 });
      }

      // Agregar metadatos
      contenidoGenerado.perfil = {
        id: perfil.id,
        nombre: perfil.nombre,
        nombreCorto: perfil.nombreCorto,
        avatar: perfil.avatar,
        email: perfil.email
      };
      contenidoGenerado.fecha = fecha;
      contenidoGenerado.generadoCon = usarIA ? 'claude' : 'template';

      // Validar si usa IA
      if (usarIA && tipo === 'comentario') {
        const validacion = validarComentario(contenidoGenerado.contenido, perfil);
        contenidoGenerado.validacion = validacion;
      }

      // Guardar si se solicita
      if (guardar) {
        const id = `contenido:${tipo}:${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        await kv.set(id, contenidoGenerado);
        contenidoGenerado.id = id;
      }

      resultados.push(contenidoGenerado);
    }

    return Response.json({
      success: true,
      tipo,
      cantidad: resultados.length,
      fecha,
      resultados
    });

  } catch (error) {
    console.error('[GENERAR-CONTENIDO] Error:', error);
    return Response.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// GENERADORES ESPECIFICOS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Genera un comentario
 */
async function generarComentario(perfil, contexto, usarIA) {
  const { tipoComentario = 'experiencia', contenidoOriginal = '', guardian = null } = contexto;

  // Si no usa IA, generar con template
  if (!usarIA) {
    const comentario = generarComentarioRapido(tipoComentario, perfil, {
      guardian: guardian || (perfil.guardianes[0]?.nombre || 'mi guardian'),
      emocion: 'esto',
      tema: 'los rituales',
      experiencia: 'siento cosas raras'
    });

    return {
      tipo: 'comentario',
      tipoComentario,
      contenido: comentario || 'Hermoso, gracias por compartir!',
      metodo: 'template'
    };
  }

  // Generar con IA
  const prompt = generarPromptComentario(perfil, contexto);

  const response = await anthropic.messages.create({
    model: MODELO_IA,
    max_tokens: MAX_TOKENS,
    messages: [
      {
        role: 'user',
        content: prompt
      }
    ]
  });

  const contenido = response.content[0].text.trim();

  return {
    tipo: 'comentario',
    tipoComentario,
    contenido,
    metodo: 'ia',
    tokensUsados: response.usage.output_tokens
  };
}

/**
 * Genera un post para el foro
 */
async function generarPost(perfil, contexto, usarIA) {
  const { categoria = 'general', tema = null, guardian = null } = contexto;

  if (!usarIA) {
    // Post basico sin IA
    return {
      tipo: 'post',
      categoria,
      titulo: `Post de ${perfil.nombreCorto}`,
      contenido: 'Queria compartir algo con ustedes...',
      metodo: 'template'
    };
  }

  const prompt = generarPromptPost(perfil, contexto);

  const response = await anthropic.messages.create({
    model: MODELO_IA,
    max_tokens: MAX_TOKENS * 2,
    messages: [
      {
        role: 'user',
        content: prompt
      }
    ]
  });

  const texto = response.content[0].text.trim();

  // Parsear titulo y contenido
  let titulo = '';
  let contenido = '';

  const tituloMatch = texto.match(/TITULO:\s*(.+)/i);
  const contenidoMatch = texto.match(/CONTENIDO:\s*([\s\S]+)/i);

  if (tituloMatch) {
    titulo = tituloMatch[1].trim();
  }
  if (contenidoMatch) {
    contenido = contenidoMatch[1].trim();
  } else {
    contenido = texto;
  }

  // Si no se parseo bien, usar el texto completo
  if (!titulo) {
    const lineas = texto.split('\n');
    titulo = lineas[0].replace(/^[#*]+\s*/, '').trim();
    contenido = lineas.slice(1).join('\n').trim();
  }

  return {
    tipo: 'post',
    categoria,
    titulo,
    contenido,
    metodo: 'ia',
    tokensUsados: response.usage.output_tokens
  };
}

/**
 * Genera multiples respuestas para un post
 */
async function generarRespuestasMultiples(contexto, usarIA) {
  const {
    cantidadRespuestas = 5,
    contenidoOriginal = '',
    temaPost = '',
    guardian = null
  } = contexto;

  const respuestas = [];
  const perfilesUsados = new Set();

  // Tipos de respuesta variados
  const tiposRespuesta = ['agradecimiento', 'experiencia', 'consejo', 'reflexion', 'pregunta'];

  for (let i = 0; i < cantidadRespuestas; i++) {
    // Seleccionar perfil unico
    let perfil;
    let intentos = 0;
    do {
      perfil = seleccionarPerfilSegunContexto({
        ...contexto,
        esRespuesta: true,
        tipo: tiposRespuesta[i % tiposRespuesta.length]
      });
      intentos++;
    } while (perfilesUsados.has(perfil.id) && intentos < 15);

    // Si ya usamos todos, repetir esta bien
    if (!perfilesUsados.has(perfil.id)) {
      perfilesUsados.add(perfil.id);
    }

    const tipoRespuesta = tiposRespuesta[i % tiposRespuesta.length];

    const respuesta = await generarComentario(perfil, {
      tipoComentario: tipoRespuesta,
      contenidoOriginal,
      temaPost,
      guardian,
      esRespuesta: true
    }, usarIA);

    respuesta.perfil = {
      id: perfil.id,
      nombre: perfil.nombre,
      nombreCorto: perfil.nombreCorto,
      avatar: perfil.avatar,
      email: perfil.email
    };

    respuestas.push(respuesta);
  }

  return {
    tipo: 'respuestas',
    cantidad: respuestas.length,
    respuestas
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// GET - Obtener perfiles disponibles y estadisticas
// ═══════════════════════════════════════════════════════════════════════════════

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const accion = searchParams.get('accion') || 'perfiles';

  if (accion === 'perfiles') {
    const perfiles = MIEMBROS_FUNDADORES.map(p => ({
      id: p.id,
      nombre: p.nombre,
      nombreCorto: p.nombreCorto,
      avatar: p.avatar,
      personalidad: p.personalidad,
      tiempoMiembro: p.tiempoMiembro,
      guardianes: p.guardianes.map(g => g.nombre),
      estiloEscritura: p.estiloEscritura.extension
    }));

    return Response.json({
      success: true,
      totalPerfiles: perfiles.length,
      perfiles
    });
  }

  if (accion === 'templates') {
    return Response.json({
      success: true,
      tipos: Object.keys(TEMPLATES_COMENTARIOS),
      templates: TEMPLATES_COMENTARIOS
    });
  }

  if (accion === 'estadisticas') {
    // Contar contenido generado
    const keys = await kv.keys('contenido:*');

    return Response.json({
      success: true,
      totalContenidoGenerado: keys.length
    });
  }

  return Response.json({
    success: false,
    error: 'Accion no valida'
  }, { status: 400 });
}
