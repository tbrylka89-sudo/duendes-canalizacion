import { kv } from '@vercel/kv';
import Anthropic from '@anthropic-ai/sdk';

export const dynamic = 'force-dynamic';
export const maxDuration = 120;

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// ═══════════════════════════════════════════════════════════════════════════════
// API: CHAT EDITOR PARA MODIFICAR CANALIZACIONES
// Ida y vuelta conversacional para ajustar contenido antes de aprobar
// ═══════════════════════════════════════════════════════════════════════════════

export async function POST(request) {
  try {
    const body = await request.json();
    const { canalizacionId, mensaje, historial, ejecutarAccion } = body;

    if (!canalizacionId) {
      return Response.json({
        success: false,
        error: 'ID de canalización requerido'
      }, { status: 400 });
    }

    // Obtener la canalización actual
    const canalizacion = await kv.get(`canalizacion:${canalizacionId}`);
    if (!canalizacion) {
      return Response.json({
        success: false,
        error: 'Canalización no encontrada'
      }, { status: 404 });
    }

    // Si es ejecución de acción (aplicar cambios)
    if (ejecutarAccion) {
      return await procesarAccion(ejecutarAccion, canalizacion);
    }

    // Procesar mensaje conversacional
    const systemPrompt = construirSystemPrompt(canalizacion);

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4000,
      system: systemPrompt,
      messages: [
        ...formatearHistorial(historial),
        { role: 'user', content: mensaje }
      ]
    });

    const respuestaClaude = response.content[0].text;

    // Parsear la respuesta para extraer acciones
    const resultado = parsearRespuesta(respuestaClaude);

    return Response.json({
      success: true,
      ...resultado
    });

  } catch (error) {
    console.error('[CHAT CANALIZACION] Error:', error);
    return Response.json({
      success: false,
      error: error.message,
      respuesta: 'Ocurrió un error. Intentá de nuevo.'
    }, { status: 500 });
  }
}

function construirSystemPrompt(canalizacion) {
  const ctx = canalizacion.datosCheckout || {};

  return `Sos el asistente de edición de canalizaciones para Duendes del Uruguay.
Tu rol es ayudar a ajustar canalizaciones antes de enviarlas al cliente.

═══════════════════════════════════════════════════════════════
CONTEXTO DE ESTA CANALIZACIÓN
═══════════════════════════════════════════════════════════════

CLIENTE: ${canalizacion.nombreDestinatario || canalizacion.nombreCliente}
COMPRADOR: ${canalizacion.nombreCliente}
EMAIL: ${canalizacion.email}
ES REGALO: ${ctx.esRegalo ? 'Sí' : 'No'}
ES SORPRESA: ${ctx.esSorpresa ? 'Sí' : 'No'}
PRONOMBRE: ${ctx.pronombre || 'ella'}
EDAD: ${ctx.esNino || 'adulto'}

GUARDIÁN: ${canalizacion.guardian?.nombre}
TIPO: ${canalizacion.guardian?.tipo || 'guardián'}
CATEGORÍA: ${canalizacion.guardian?.categoria}

CONTEXTO ADICIONAL: ${ctx.contexto || 'No especificado'}

═══════════════════════════════════════════════════════════════
CONTENIDO ACTUAL (${canalizacion.contenido?.split(/\s+/).length || 0} palabras)
═══════════════════════════════════════════════════════════════

${canalizacion.contenido}

═══════════════════════════════════════════════════════════════
TUS CAPACIDADES
═══════════════════════════════════════════════════════════════

1. **Acortar secciones**: Reducir texto manteniendo esencia
2. **Expandir secciones**: Agregar profundidad donde haga falta
3. **Cambiar tono**: Más cálido, más formal, más místico, etc.
4. **Ajustar ritual**: Simplificar o detallar pasos
5. **Corregir errores**: Ortografía, coherencia, nombre mal escrito
6. **Regenerar sección**: Reescribir completamente una parte
7. **Agregar mención**: Incluir algo específico que falte

═══════════════════════════════════════════════════════════════
REGLAS DE CONTENIDO (de CLAUDE.md)
═══════════════════════════════════════════════════════════════

PROHIBIDO:
- Frases genéricas de IA ("En lo profundo del bosque...", "Las brumas...")
- Relleno poético vacío
- Metáforas que no aportan
- Formato excesivamente estructurado innecesario

OBLIGATORIO:
- Español rioplatense (vos, tenés, podés)
- Valor real y aplicable
- Especificidad sobre generalidades
- Tocar el corazón desde la primera palabra
- El mensaje debe hacer sentir a la persona VISTA

═══════════════════════════════════════════════════════════════
FORMATO DE RESPUESTA
═══════════════════════════════════════════════════════════════

Cuando propongas cambios, usá este formato:

"Entendido. Voy a [descripción del cambio].

[Explicación breve de qué vas a modificar]

[ACCION:modificar:Aplicar cambios:{"cambios":[{"seccion":"nombre de sección","accion":"reemplazar|acortar|expandir","contenidoNuevo":"texto nuevo completo de la sección"}]}]"

O si necesitás más info:
"Para hacer eso necesito saber: [pregunta]"

TIPOS DE ACCIONES:
- modificar: Cambios al contenido
- regenerar: Reescribir sección completa desde cero
- preview: Solo mostrar cómo quedaría sin aplicar

IMPORTANTE:
- Siempre explicá qué vas a hacer antes de proponer la acción
- Si el cambio es grande, preguntá primero
- Preservá el tono místico pero genuino del universo
- Recordá que el guardián habla en primera persona`;
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

function parsearRespuesta(texto) {
  const acciones = [];

  // Extraer acciones [ACCION:tipo:label:datos]
  const regexAccion = /\[ACCION:([^:]+):([^:]+):(\{[\s\S]*?\})\]/g;
  let match;

  while ((match = regexAccion.exec(texto)) !== null) {
    try {
      acciones.push({
        tipo: match[1],
        label: match[2],
        datos: JSON.parse(match[3])
      });
    } catch (e) {
      console.error('Error parseando acción:', e, match[3]);
    }
  }

  // Limpiar el texto de los tags
  let respuestaLimpia = texto
    .replace(/\[ACCION:[^\]]+\]/g, '')
    .trim();

  return {
    respuesta: respuestaLimpia,
    acciones: acciones.length > 0 ? acciones : undefined
  };
}

async function procesarAccion(accion, canalizacion) {
  const { tipo, datos } = accion;

  if (tipo === 'modificar' && datos.cambios) {
    let contenidoActual = canalizacion.contenido;

    for (const cambio of datos.cambios) {
      if (cambio.seccion && cambio.contenidoNuevo) {
        // Buscar la sección y reemplazarla
        // Las secciones suelen empezar con ## emoji Título
        const regexSeccion = new RegExp(
          `(##\\s*[^\\n]*${escapeRegex(cambio.seccion)}[^\\n]*\\n)([\\s\\S]*?)(?=##\\s|$)`,
          'i'
        );

        if (regexSeccion.test(contenidoActual)) {
          contenidoActual = contenidoActual.replace(
            regexSeccion,
            `$1${cambio.contenidoNuevo}\n\n`
          );
        } else {
          // Si no encuentra la sección exacta, intentar reemplazo directo
          // del contenidoNuevo si es texto literal a buscar
          if (cambio.buscar) {
            contenidoActual = contenidoActual.replace(cambio.buscar, cambio.contenidoNuevo);
          }
        }
      }
    }

    // Guardar cambios
    canalizacion.contenido = contenidoActual;
    canalizacion.ultimaEdicion = new Date().toISOString();
    canalizacion.editadaManualmente = true;

    await kv.set(`canalizacion:${canalizacion.id}`, canalizacion);

    return Response.json({
      success: true,
      respuesta: 'Cambios aplicados correctamente.',
      contenidoActualizado: contenidoActual
    });
  }

  if (tipo === 'regenerar' && datos.seccion) {
    // Regenerar sección completa con IA
    const promptRegenerar = `Regenerá la sección "${datos.seccion}" de esta canalización.

CONTEXTO:
- Guardián: ${canalizacion.guardian?.nombre}
- Cliente: ${canalizacion.nombreDestinatario || canalizacion.nombreCliente}
- Instrucción: ${datos.instruccion || 'Reescribir manteniendo la esencia'}

CONTENIDO ACTUAL DE LA SECCIÓN:
${extraerSeccion(canalizacion.contenido, datos.seccion)}

Escribí SOLO el contenido nuevo de la sección (sin el título ##).
Mantené el tono y estilo del resto de la canalización.
Español rioplatense, sin frases genéricas de IA.`;

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2000,
      messages: [{ role: 'user', content: promptRegenerar }]
    });

    const nuevoContenido = response.content[0].text;

    return Response.json({
      success: true,
      respuesta: `Regeneré la sección "${datos.seccion}". ¿Querés aplicar este cambio?`,
      preview: nuevoContenido,
      acciones: [{
        tipo: 'modificar',
        label: 'Aplicar',
        datos: {
          cambios: [{
            seccion: datos.seccion,
            contenidoNuevo: nuevoContenido
          }]
        }
      }]
    });
  }

  return Response.json({
    success: true,
    respuesta: `Acción "${tipo}" recibida pero no implementada.`
  });
}

function escapeRegex(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function extraerSeccion(contenido, nombreSeccion) {
  const regex = new RegExp(
    `##\\s*[^\\n]*${escapeRegex(nombreSeccion)}[^\\n]*\\n([\\s\\S]*?)(?=##\\s|$)`,
    'i'
  );
  const match = contenido.match(regex);
  return match ? match[1].trim() : '';
}
