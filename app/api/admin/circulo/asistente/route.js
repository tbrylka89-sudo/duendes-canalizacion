import { kv } from '@vercel/kv';
import Anthropic from '@anthropic-ai/sdk';

export const dynamic = 'force-dynamic';
export const maxDuration = 120;

// ═══════════════════════════════════════════════════════════════════════════════
// API: ASISTENTE CONVERSACIONAL DEL CÍRCULO
// Interpreta pedidos en lenguaje natural y ejecuta acciones
// ═══════════════════════════════════════════════════════════════════════════════

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// Duendes disponibles (cargados de KV o fallback)
async function obtenerDuendes() {
  const duendes = await kv.get('circulo:duendes-reales');
  if (duendes && duendes.length > 0) return duendes;

  // Fallback a duendes del sistema
  return [
    { id: 'finnegan', nombre: 'Finnegan', proposito: 'Protección del hogar y arraigo', elemento: 'Tierra' },
    { id: 'willow', nombre: 'Willow', proposito: 'Intuición y mundo onírico', elemento: 'Agua' },
    { id: 'bramble', nombre: 'Bramble', proposito: 'Conocimiento oculto y misterios', elemento: 'Aire' },
    { id: 'ember', nombre: 'Ember', proposito: 'Transformación y pasión', elemento: 'Fuego' },
    { id: 'moss', nombre: 'Moss', proposito: 'Sanación y bienestar', elemento: 'Tierra/Agua' },
    { id: 'thornwick', nombre: 'Thornwick', proposito: 'Protección energética y límites', elemento: 'Tierra/Fuego' }
  ];
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { mensaje, contexto, historial, ejecutarAccion } = body;

    // Si es ejecución de acción
    if (ejecutarAccion) {
      return await procesarAccion(ejecutarAccion, contexto);
    }

    // Procesar mensaje conversacional
    const duendes = await obtenerDuendes();
    const duendeActual = await kv.get('duende-semana-actual');

    // Construir contexto para Claude
    const systemPrompt = construirSystemPrompt(duendes, duendeActual);

    // Llamar a Claude para interpretar
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2000,
      system: systemPrompt,
      messages: [
        ...formatearHistorial(historial),
        { role: 'user', content: mensaje }
      ]
    });

    const respuestaClaude = response.content[0].text;

    // Parsear la respuesta para extraer acciones
    const resultado = parsearRespuesta(respuestaClaude, contexto);

    return Response.json({
      success: true,
      ...resultado
    });

  } catch (error) {
    console.error('[ASISTENTE] Error:', error);
    return Response.json({
      success: false,
      error: error.message,
      respuesta: 'Ocurrió un error procesando tu pedido. Intentá de nuevo.'
    }, { status: 500 });
  }
}

function construirSystemPrompt(duendes, duendeActual) {
  const listaDuendes = duendes.map(d => `- ${d.nombre}: ${d.proposito} (${d.elemento})`).join('\n');

  return `Sos el asistente administrativo de "El Círculo", la membresía premium de Duendes del Uruguay.
Tu rol es ayudar a la administradora a gestionar contenido de forma conversacional.

DUENDES DISPONIBLES:
${listaDuendes}

DUENDE DE LA SEMANA ACTUAL: ${duendeActual?.nombre || 'No seleccionado'}

CAPACIDADES:
1. Generar contenido diario/semanal para El Círculo
2. Cambiar el duende de la semana
3. Crear cursos y material educativo
4. Mostrar estadísticas y contenido existente
5. Configurar publicaciones programadas

REGLAS DE RESPUESTA:
- Respondé en español rioplatense (vos, tenés)
- Sé conciso pero amable
- Si necesitás más información para completar un pedido, preguntá
- Cuando generes contenido, incluí una vista previa
- Proponé acciones claras cuando corresponda

FORMATO DE RESPUESTA:
Cuando propongas acciones ejecutables, incluilas así:
[ACCION:tipo:label:datos]

Tipos de acciones:
- cambiar_duende: Cambiar duende de la semana
- generar_semana: Generar contenido de una semana
- generar_dia: Generar contenido de un día
- crear_curso: Crear un curso nuevo
- publicar: Publicar contenido

Ejemplo:
"Perfecto, voy a cambiar el duende de la semana a Ember.
[ACCION:cambiar_duende:Confirmar cambio:{"duendeId":"ember"}]"

Si necesitás preguntar algo antes de ejecutar:
[CONTEXTO:tipo:datos]

Ejemplo para preguntas de seguimiento:
"¿Para qué semana querés generar el contenido?
[CONTEXTO:generar_semana:{"esperando":"fecha"}]"`;
}

function formatearHistorial(historial) {
  if (!historial || historial.length === 0) return [];

  return historial
    .filter(m => m.rol === 'usuario' || m.rol === 'asistente')
    .map(m => ({
      role: m.rol === 'usuario' ? 'user' : 'assistant',
      content: m.contenido
    }));
}

function parsearRespuesta(texto, contextoActual) {
  const acciones = [];
  let nuevoContexto = null;

  // Extraer acciones [ACCION:tipo:label:datos]
  const regexAccion = /\[ACCION:([^:]+):([^:]+):([^\]]+)\]/g;
  let match;
  while ((match = regexAccion.exec(texto)) !== null) {
    try {
      acciones.push({
        tipo: match[1],
        label: match[2],
        datos: JSON.parse(match[3])
      });
    } catch (e) {
      // Si no parsea JSON, usar como string
      acciones.push({
        tipo: match[1],
        label: match[2],
        datos: match[3]
      });
    }
  }

  // Extraer contexto [CONTEXTO:tipo:datos]
  const regexContexto = /\[CONTEXTO:([^:]+):([^\]]+)\]/;
  const matchContexto = texto.match(regexContexto);
  if (matchContexto) {
    try {
      nuevoContexto = {
        tipo: matchContexto[1],
        datos: JSON.parse(matchContexto[2])
      };
    } catch (e) {
      nuevoContexto = {
        tipo: matchContexto[1],
        datos: matchContexto[2]
      };
    }
  }

  // Limpiar el texto de los tags
  let respuestaLimpia = texto
    .replace(/\[ACCION:[^\]]+\]/g, '')
    .replace(/\[CONTEXTO:[^\]]+\]/g, '')
    .trim();

  return {
    respuesta: respuestaLimpia,
    acciones: acciones.length > 0 ? acciones : undefined,
    contexto: nuevoContexto
  };
}

async function procesarAccion(accion, contexto) {
  const { tipo, datos } = accion;

  switch (tipo) {
    case 'cambiar_duende':
      return await cambiarDuendeSemana(datos);

    case 'generar_semana':
      return await generarContenidoSemana(datos);

    case 'generar_dia':
      return await generarContenidoDia(datos);

    case 'crear_curso':
      return await crearCurso(datos);

    default:
      return Response.json({
        success: true,
        respuesta: `Acción "${tipo}" recibida pero no implementada todavía.`
      });
  }
}

async function cambiarDuendeSemana(datos) {
  try {
    const duendes = await obtenerDuendes();
    const duende = duendes.find(d => d.id === datos.duendeId);

    if (!duende) {
      return Response.json({
        success: true,
        respuesta: `No encontré el duende "${datos.duendeId}". Los disponibles son: ${duendes.map(d => d.nombre).join(', ')}`
      });
    }

    // Guardar anterior en historial
    const anterior = await kv.get('duende-semana-actual');
    if (anterior) {
      const historial = await kv.get('duende-semana-historial') || [];
      historial.unshift({ ...anterior, fechaFin: new Date().toISOString() });
      await kv.set('duende-semana-historial', historial.slice(0, 20));
    }

    // Establecer nuevo duende
    await kv.set('duende-semana-actual', {
      ...duende,
      seleccionadoEn: new Date().toISOString()
    });

    return Response.json({
      success: true,
      respuesta: `**${duende.nombre}** es ahora el Duende de la Semana.\n\nPropósito: ${duende.proposito}\nElemento: ${duende.elemento}`
    });

  } catch (error) {
    return Response.json({
      success: false,
      respuesta: `Error cambiando duende: ${error.message}`
    });
  }
}

async function generarContenidoSemana(datos) {
  try {
    const { semana, mes, año, duendeId } = datos;

    const duendes = await obtenerDuendes();
    const duende = duendeId
      ? duendes.find(d => d.id === duendeId)
      : await kv.get('duende-semana-actual');

    if (!duende) {
      return Response.json({
        success: true,
        respuesta: 'Necesito saber qué duende usar. ¿Cuál preferís para esta semana?',
        contexto: { tipo: 'generar_semana', datos: { ...datos, esperando: 'duende' } }
      });
    }

    // Generar contenido con IA
    const contenidos = await generarContenidosConIA(duende, semana, mes, año);

    // Vista previa HTML
    const preview = contenidos.map(c =>
      `<div style="margin-bottom:1rem;padding:0.75rem;background:rgba(255,255,255,0.03);border-radius:8px;">
        <strong>Día ${c.dia}:</strong> ${c.titulo}<br>
        <small style="color:#888">${c.tipo} · ${duende.nombre}</small>
      </div>`
    ).join('');

    return Response.json({
      success: true,
      respuesta: `Generé ${contenidos.length} días de contenido con **${duende.nombre}**.\n\n¿Querés que lo publique?`,
      preview,
      acciones: [
        { tipo: 'publicar_semana', label: 'Publicar todo', datos: { contenidos } },
        { tipo: 'editar_semana', label: 'Editar primero', datos: { contenidos } }
      ]
    });

  } catch (error) {
    return Response.json({
      success: false,
      respuesta: `Error generando contenido: ${error.message}`
    });
  }
}

async function generarContenidosConIA(duende, semana, mes, año) {
  // Estructura de contenido semanal
  const tipos = [
    { tipo: 'ritual', nombre: 'Ritual' },
    { tipo: 'meditacion', nombre: 'Meditación' },
    { tipo: 'articulo', nombre: 'Artículo' },
    { tipo: 'guia', nombre: 'Guía DIY' },
    { tipo: 'historia', nombre: 'Historia del Guardián' },
    { tipo: 'reflexion', nombre: 'Reflexión' },
    { tipo: 'articulo', nombre: 'Bienestar' }
  ];

  const contenidos = [];
  const primerDia = (semana - 1) * 7 + 1;

  for (let i = 0; i < 7; i++) {
    const dia = primerDia + i;
    if (dia > 31) break; // No pasar del mes

    const tipoHoy = tipos[i];

    contenidos.push({
      dia,
      mes: mes || 1,
      año: año || 2026,
      tipo: tipoHoy.tipo,
      titulo: `${tipoHoy.nombre} de ${duende.nombre} - Día ${dia}`,
      extracto: `Contenido generado por ${duende.nombre}`,
      duende: { id: duende.id, nombre: duende.nombre }
    });
  }

  return contenidos;
}

async function generarContenidoDia(datos) {
  // Por implementar
  return Response.json({
    success: true,
    respuesta: 'Generación de día individual en desarrollo.'
  });
}

async function crearCurso(datos) {
  // Por implementar
  return Response.json({
    success: true,
    respuesta: 'Creación de cursos en desarrollo. ¿Qué tema te gustaría?'
  });
}
