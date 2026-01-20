import { kv } from '@vercel/kv';
import Anthropic from '@anthropic-ai/sdk';

// ═══════════════════════════════════════════════════════════════════════════════
// SISTEMA DE COMENTARIOS DE BOTS REALISTAS
// Genera comentarios naturales para publicaciones del Círculo
// ═══════════════════════════════════════════════════════════════════════════════

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

// Perfiles de bots con personalidades únicas
const BOTS_PERFILES = [
  {
    id: 'maria_luna',
    nombre: 'María Luna',
    avatar: 'ML',
    personalidad: 'Mujer de 45 años, madre de dos, muy espiritual pero práctica. Trabaja en administración. Llegó a los duendes buscando paz interior después de una etapa difícil.',
    estilo: 'Escribe con calidez, usa emojis ocasionalmente (no muchos), hace preguntas reflexivas.',
    frases_tipicas: ['Qué hermoso', 'Me resonó mucho', 'Justo lo que necesitaba leer hoy']
  },
  {
    id: 'ana_cristal',
    nombre: 'Ana del Cristal',
    avatar: 'AC',
    personalidad: 'Mujer de 38 años, artista y terapeuta holística. Muy conectada con la naturaleza. Tiene varios guardianes en casa.',
    estilo: 'Escribe poéticamente pero sin ser excesiva. Menciona sus experiencias personales. A veces comparte tips.',
    frases_tipicas: ['Qué lindo', 'En mi experiencia...', 'Los guardianes siempre saben']
  },
  {
    id: 'laura_bosque',
    nombre: 'Laura del Bosque',
    avatar: 'LB',
    personalidad: 'Mujer de 52 años, jubilada anticipada, vive cerca del campo. Colecciona duendes desde hace años. Sabiduría de vida.',
    estilo: 'Escribe con tranquilidad, comparte anécdotas, usa español rioplatense natural.',
    frases_tipicas: ['Me encanta', 'Hace poco me pasó algo parecido', 'Gracias por compartir']
  },
  {
    id: 'carmen_luz',
    nombre: 'Carmen Luz',
    avatar: 'CL',
    personalidad: 'Mujer de 60 años, abuela, muy cariñosa. Nueva en el mundo de los duendes pero muy entusiasmada.',
    estilo: 'Escribe con entusiasmo genuino, hace preguntas de novata, agradece mucho.',
    frases_tipicas: ['¡Ay qué lindo!', 'Todavía estoy aprendiendo pero...', 'Mi guardián favorito...']
  },
  {
    id: 'sol_serena',
    nombre: 'Sol Serena',
    avatar: 'SS',
    personalidad: 'Mujer de 35 años, profesora de yoga, muy zen. Conecta todo con la espiritualidad pero sin ser pesada.',
    estilo: 'Escribe con calma, menciona prácticas, hace observaciones profundas pero accesibles.',
    frases_tipicas: ['Qué paz me da leer esto', 'Respiro y agradezco', 'Esto me recuerda a...']
  }
];

// GET - Obtener comentarios de una publicación
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const postId = searchParams.get('postId');
  const accion = searchParams.get('accion');

  if (accion === 'perfiles') {
    return Response.json({
      success: true,
      bots: BOTS_PERFILES.map(b => ({
        id: b.id,
        nombre: b.nombre,
        avatar: b.avatar
      }))
    });
  }

  if (!postId) {
    return Response.json({
      success: false,
      error: 'Se requiere postId'
    }, { status: 400 });
  }

  try {
    const comentarios = await kv.get(`circulo:comentarios:${postId}`) || [];

    return Response.json({
      success: true,
      postId,
      comentarios,
      total: comentarios.length
    });

  } catch (error) {
    return Response.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}

// POST - Generar y agregar comentarios de bots
export async function POST(request) {
  try {
    const { postId, contenidoPost, tituloPost, cantidadBots = 2 } = await request.json();

    if (!postId || !contenidoPost) {
      return Response.json({
        success: false,
        error: 'Se requiere postId y contenidoPost'
      }, { status: 400 });
    }

    // Seleccionar bots aleatorios (no repetir)
    const botsDisponibles = [...BOTS_PERFILES];
    const botsSeleccionados = [];

    for (let i = 0; i < Math.min(cantidadBots, BOTS_PERFILES.length); i++) {
      const indice = Math.floor(Math.random() * botsDisponibles.length);
      botsSeleccionados.push(botsDisponibles.splice(indice, 1)[0]);
    }

    // Generar comentarios
    const nuevosComentarios = [];

    for (const bot of botsSeleccionados) {
      const comentario = await generarComentarioBot(bot, contenidoPost, tituloPost);

      if (comentario) {
        const comentarioCompleto = {
          id: `com_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
          botId: bot.id,
          nombreAutor: bot.nombre,
          avatar: bot.avatar,
          texto: comentario.texto,
          esBot: true,
          creadoEn: generarFechaRealista(),
          likes: Math.floor(Math.random() * 5),
          respuestas: []
        };

        nuevosComentarios.push(comentarioCompleto);
      }
    }

    // Guardar comentarios
    const comentariosExistentes = await kv.get(`circulo:comentarios:${postId}`) || [];
    const todosComentarios = [...comentariosExistentes, ...nuevosComentarios];

    // Ordenar por fecha (los bots comentan en diferentes momentos)
    todosComentarios.sort((a, b) => new Date(a.creadoEn) - new Date(b.creadoEn));

    await kv.set(`circulo:comentarios:${postId}`, todosComentarios);

    return Response.json({
      success: true,
      mensaje: `${nuevosComentarios.length} comentarios generados`,
      comentarios: nuevosComentarios
    });

  } catch (error) {
    console.error('[COMENTARIOS-BOT] Error:', error);
    return Response.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// GENERAR COMENTARIO CON IA
// ═══════════════════════════════════════════════════════════════════════════════

async function generarComentarioBot(bot, contenidoPost, tituloPost) {
  try {
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 200,
      system: `Sos ${bot.nombre}, una usuaria real del Círculo de Duendes (comunidad de mujeres que coleccionan guardianes mágicos artesanales).

SOBRE VOS:
${bot.personalidad}

TU ESTILO DE ESCRITURA:
${bot.estilo}

FRASES QUE USÁS A VECES: ${bot.frases_tipicas.join(', ')}

REGLAS CRÍTICAS:
- Escribí en español rioplatense natural (vos, tenés, etc.)
- MÁXIMO 2-3 oraciones. Los comentarios largos parecen falsos.
- NO uses hashtags
- NO menciones que sos parte del Círculo (ya se sabe)
- NO empieces con "Hola" ni saludos formales
- Podés usar 0-2 emojis, no más
- Sé auténtica, no genérica
- Si mencionás un duende/guardián, usá nombres reales o genéricos
- A veces podés hacer una pregunta al autor o a otros
- NUNCA suenes como una IA o un bot`,
      messages: [{
        role: 'user',
        content: `Vas a comentar esta publicación del Círculo:

TÍTULO: ${tituloPost || 'Sin título'}
CONTENIDO: ${contenidoPost}

Escribí UN comentario corto y natural como lo haría ${bot.nombre}. Solo el texto del comentario, nada más.`
      }]
    });

    return {
      texto: response.content[0].text.trim()
    };

  } catch (error) {
    console.error(`Error generando comentario para ${bot.nombre}:`, error);

    // Fallback con comentarios pre-escritos
    const fallbacks = [
      'Qué lindo, gracias por compartir',
      'Me encantó leer esto',
      'Justo lo que necesitaba hoy',
      'Hermoso mensaje',
      'Gracias por esto'
    ];

    return {
      texto: fallbacks[Math.floor(Math.random() * fallbacks.length)]
    };
  }
}

// Generar fecha realista (últimas horas/días)
function generarFechaRealista() {
  const ahora = new Date();
  const horasAtras = Math.floor(Math.random() * 48) + 1; // 1-48 horas atrás
  const minutosExtra = Math.floor(Math.random() * 60);

  ahora.setHours(ahora.getHours() - horasAtras);
  ahora.setMinutes(ahora.getMinutes() - minutosExtra);

  return ahora.toISOString();
}
