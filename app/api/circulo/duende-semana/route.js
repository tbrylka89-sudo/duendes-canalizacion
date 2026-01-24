import { kv } from '@vercel/kv';
import Anthropic from '@anthropic-ai/sdk';

export const dynamic = 'force-dynamic';

// ═══════════════════════════════════════════════════════════════════════════════
// API PÚBLICA: DUENDE DE LA SEMANA
// Endpoint para que los miembros del Círculo vean el guardián protagonista
// ═══════════════════════════════════════════════════════════════════════════════

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

// ═══════════════════════════════════════════════════════════════════════════════
// GET - Obtener duende actual de la semana con su contenido
// ═══════════════════════════════════════════════════════════════════════════════

export async function GET(request) {
  try {
    const url = new URL(request.url);
    const incluirContenido = url.searchParams.get('contenido') !== '0';
    const generarMensaje = url.searchParams.get('mensaje') === '1';

    // Obtener duende actual - PRIMERO buscar en rotación semanal (datos nuevos)
    let duendeActual = null;

    const ahora = new Date();
    const año = ahora.getFullYear();
    const mes = ahora.getMonth() + 1;
    const dia = ahora.getDate();

    // Determinar número de semana del mes
    let semanaNum = 1;
    if (dia >= 22) semanaNum = 4;
    else if (dia >= 15) semanaNum = 3;
    else if (dia >= 8) semanaNum = 2;

    const semanaKey = `circulo:duende-semana:${año}:${mes}:${semanaNum}`;
    const semanaData = await kv.get(semanaKey);

    if (semanaData?.guardian) {
      // Usar datos de la rotación semanal (prioridad)
      const guardian = semanaData.guardian;
      duendeActual = {
        nombre: guardian.nombre,
        nombreCompleto: guardian.nombreCompleto,
        imagen: guardian.imagen,
        categoria: guardian.categoria,
        descripcion: semanaData.descripcion,
        proposito: semanaData.tema,
        elemento: guardian.elemento,
        cristales: guardian.cristales,
        color: guardian.color,
        saludo: guardian.saludo,
        despedida: guardian.despedida,
        frasesTipicas: guardian.frasesTipicas,
        personalidad: guardian.personalidad,
        historia: guardian.historia,
        temas: guardian.temas,
        fechaInicio: semanaData.inicio,
        fechaFin: semanaData.fin,
        productoWooCommerce: guardian.productoWooCommerce,
        slug: guardian.slug
      };
    }

    // Fallback: buscar en formato antiguo si no hay rotación
    if (!duendeActual) {
      duendeActual = await kv.get('duende-semana:actual');
    }

    if (!duendeActual) {
      return Response.json({
        success: false,
        error: 'No hay un duende de la semana configurado',
        sugerencia: 'El equipo está seleccionando al próximo guardián protagonista'
      }, { status: 404 });
    }

    // Información del portal actual (Litha para enero)
    const portal = obtenerPortalActual();

    // Calcular días restantes de la semana
    const finSemana = new Date(duendeActual.fechaFin);
    const diasRestantes = Math.max(0, Math.ceil((finSemana - ahora) / (1000 * 60 * 60 * 24)));

    // Construir respuesta base
    const respuesta = {
      success: true,
      duende: {
        nombre: duendeActual.nombre,
        nombreCompleto: duendeActual.nombreCompleto,
        imagen: duendeActual.imagen,
        categoria: duendeActual.categoria,
        descripcion: duendeActual.descripcion,
        proposito: duendeActual.proposito,
        elemento: duendeActual.elemento,
        cristales: duendeActual.cristales || []
      },
      semana: {
        inicio: duendeActual.fechaInicio,
        fin: duendeActual.fechaFin,
        diasRestantes,
        esUltimoDia: diasRestantes <= 1
      },
      portal: {
        id: portal.id,
        nombre: portal.nombre,
        energia: portal.energia,
        elemento: portal.elemento
      }
    };

    // Incluir personalidad si existe
    if (duendeActual.personalidadGenerada) {
      respuesta.personalidad = duendeActual.personalidadGenerada;
    }

    // Generar mensaje de bienvenida si se solicita
    if (generarMensaje && duendeActual.personalidadGenerada) {
      const mensaje = await generarMensajeBienvenida(duendeActual, portal);
      respuesta.mensajeBienvenida = mensaje;
    }

    // Incluir contenido de la semana si se solicita
    if (incluirContenido) {
      const contenidoSemana = await obtenerContenidoSemana(duendeActual);
      respuesta.contenidoSemana = contenidoSemana;
    }

    return Response.json(respuesta);

  } catch (error) {
    console.error('[DUENDE-SEMANA-PÚBLICO] Error:', error);
    return Response.json({
      success: false,
      error: 'Error obteniendo el duende de la semana'
    }, { status: 500 });
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// GENERAR MENSAJE DE BIENVENIDA
// El duende saluda al visitante con su voz única
// ═══════════════════════════════════════════════════════════════════════════════

async function generarMensajeBienvenida(duende, portal) {
  const personalidad = duende.personalidadGenerada;

  if (!personalidad) {
    return {
      saludo: `Bienvenido al Círculo`,
      mensaje: `Soy ${duende.nombre}, el guardián que te acompaña esta semana.`,
      consejo: `Prestá atención a las señales que aparezcan estos días.`
    };
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return generarMensajeFallback(duende, personalidad);
  }

  const hora = new Date().getHours();
  const momento = hora < 6 ? 'madrugada' : hora < 12 ? 'mañana' : hora < 19 ? 'tarde' : 'noche';
  const diaSemana = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'][new Date().getDay()];

  try {
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 600,
      system: `Sos ${duende.nombre}, un guardián mágico del Círculo de Duendes del Uruguay.

TU PERSONALIDAD:
- Manera de hablar: ${personalidad.manera_de_hablar}
- Tono emocional: ${personalidad.tono_emocional}
- Cómo das consejos: ${personalidad.como_da_consejos}
- Tu frase característica: "${personalidad.frase_caracteristica}"
- Te despedís así: "${personalidad.forma_de_despedirse}"

REGLAS IMPORTANTES:
- Escribí en español rioplatense (vos, tenés, podés)
- Sé breve pero profundo - cada palabra cuenta
- Hablás en primera persona - SOS ${duende.nombre}
- NO uses frases genéricas de IA
- NO uses "brumas", "velos", "ancestral" de forma cliché
- Tu mensaje debe sentirse PERSONAL, no intercambiable`,
      messages: [{
        role: 'user',
        content: `Es ${momento} de ${diaSemana}. Alguien acaba de entrar al Círculo de Duendes.
Estamos en el ${portal.nombre} (energía de ${portal.energia}).
Tu propósito esta semana: ${duende.proposito}

Generá un mensaje de bienvenida ÚNICO con este formato exacto:

SALUDO: [Una línea cálida y personal - no genérica]
MENSAJE: [2-3 oraciones conectando con la energía del momento y tu propósito]
CONSEJO: [Un consejo práctico y específico para hoy]

No uses asteriscos ni markdown. Solo texto natural.`
      }]
    });

    const texto = response.content?.[0]?.text || '';

    // Parsear respuesta
    const saludoMatch = texto.match(/SALUDO:\s*(.+?)(?=MENSAJE:|$)/s);
    const mensajeMatch = texto.match(/MENSAJE:\s*(.+?)(?=CONSEJO:|$)/s);
    const consejoMatch = texto.match(/CONSEJO:\s*(.+?)$/s);

    return {
      saludo: saludoMatch?.[1]?.trim() || `Qué bueno verte por acá`,
      mensaje: mensajeMatch?.[1]?.trim() || `Esta semana te acompaño. Mi propósito es ${duende.proposito?.toLowerCase()}.`,
      consejo: consejoMatch?.[1]?.trim() || `Tomate un momento hoy para conectar con vos.`,
      generadoEn: new Date().toISOString()
    };

  } catch (error) {
    console.error('Error generando mensaje:', error);
    return generarMensajeFallback(duende, personalidad);
  }
}

function generarMensajeFallback(duende, personalidad) {
  return {
    saludo: `Bienvenido al Círculo`,
    mensaje: `Soy ${duende.nombre}. Esta semana mi propósito es ${duende.proposito?.toLowerCase() || 'acompañarte'}. ${personalidad?.frase_caracteristica || ''}`,
    consejo: `Prestá atención a lo que sentís hoy. Ahí hay mensajes para vos.`
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// OBTENER CONTENIDO DE LA SEMANA
// Estructura del contenido asociado al duende
// ═══════════════════════════════════════════════════════════════════════════════

async function obtenerContenidoSemana(duende) {
  // Intentar obtener contenido específico del duende de la semana
  const semanaKey = duende.semanaKey;

  if (semanaKey) {
    const contenidoEspecifico = await kv.get(`contenido-semana:${semanaKey}`);
    if (contenidoEspecifico) {
      return contenidoEspecifico;
    }
  }

  // Generar estructura básica basada en config.js
  const hoy = new Date();
  const diaSemana = hoy.getDay();

  return {
    estructura: {
      lunes: {
        tipo: 'presentacion',
        titulo: `Conocé a ${duende.nombre}`,
        descripcion: `Quién es ${duende.nombre}, su historia, por qué esta semana es SU semana`,
        disponible: diaSemana >= 1
      },
      miercoles: {
        tipo: 'ensenanza',
        titulo: `Enseñanza de ${duende.nombre}`,
        descripcion: `Sabiduría sobre ${duende.proposito?.toLowerCase() || 'la vida'} desde su perspectiva única`,
        disponible: diaSemana >= 3
      },
      viernes: {
        tipo: 'ritual',
        titulo: `Práctica Guiada`,
        descripcion: `Ritual o meditación con ${duende.nombre}`,
        disponible: diaSemana >= 5
      },
      domingo: {
        tipo: 'cierre',
        titulo: `Mensaje de Cierre`,
        descripcion: `Reflexión y preparación para la próxima semana`,
        disponible: diaSemana === 0
      }
    },
    temasSugeridos: duende.personalidadGenerada?.temas_favoritos || [
      duende.categoria,
      duende.proposito
    ],
    cristalesRecomendados: duende.cristales || []
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// UTILIDADES
// ═══════════════════════════════════════════════════════════════════════════════

function obtenerPortalActual() {
  const mes = new Date().getMonth();

  // Hemisferio sur - Uruguay
  if (mes >= 5 && mes <= 7) {
    return {
      id: 'yule',
      nombre: 'Portal de Yule',
      energia: 'Introspección y renacimiento',
      elemento: 'tierra'
    };
  }
  if (mes >= 8 && mes <= 10) {
    return {
      id: 'ostara',
      nombre: 'Portal de Ostara',
      energia: 'Nuevos comienzos y despertar',
      elemento: 'aire'
    };
  }
  if (mes === 11 || mes <= 1) {
    return {
      id: 'litha',
      nombre: 'Portal de Litha',
      energia: 'Abundancia plena y celebración',
      elemento: 'fuego'
    };
  }
  return {
    id: 'mabon',
    nombre: 'Portal de Mabon',
    energia: 'Gratitud y cosecha',
    elemento: 'agua'
  };
}
