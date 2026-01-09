// ═══════════════════════════════════════════════════════════════
// ADMIN: MEJORAR O EXTENDER CONTENIDO
// Archivo: pages/api/admin/contenido/mejorar.js
// ═══════════════════════════════════════════════════════════════

import { kv } from '@vercel/kv';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const adminKey = req.headers['x-admin-key'] || req.body?.adminKey;
  if (adminKey !== process.env.ADMIN_SECRET) {
    return res.status(401).json({ error: 'No autorizado' });
  }

  try {
    const { semana, seccion, accion, instrucciones } = req.body;
    
    if (!semana || !seccion || !accion) {
      return res.status(400).json({ error: 'Faltan parámetros: semana, seccion, accion' });
    }

    // Obtener contenido existente
    const contenido = await kv.get(`contenido-circulo:${semana}`);
    if (!contenido) {
      return res.status(404).json({ error: 'No existe contenido para esta semana' });
    }

    // Obtener la sección específica
    const seccionContenido = obtenerSeccion(contenido, seccion);
    if (!seccionContenido) {
      return res.status(404).json({ error: `Sección '${seccion}' no encontrada` });
    }

    let prompt;
    
    if (accion === 'mejorar') {
      prompt = `Sos parte del equipo de Duendes del Uruguay. Tenés que MEJORAR este contenido haciéndolo más atractivo, claro y conectado con los guardianes.

CONTENIDO ACTUAL:
${JSON.stringify(seccionContenido, null, 2)}

INSTRUCCIONES ADICIONALES:
${instrucciones || 'Hacelo más atractivo y fácil de leer, sin perder la esencia.'}

REGLAS:
- Mantené la misma estructura JSON
- Mejorá la redacción sin cambiar el sentido
- Hacelo más directo, menos florido
- PROHIBIDO: brumas místicas, océano susurra, dimensiones superiores
- Conectá siempre con los guardianes/duendes
- Tono cercano, como hablando con una amiga

Devolvé SOLO el JSON mejorado, sin explicaciones.`;
    } 
    else if (accion === 'extender') {
      prompt = `Sos parte del equipo de Duendes del Uruguay. Tenés que EXTENDER este contenido agregando más profundidad, ejemplos y detalles.

CONTENIDO ACTUAL:
${JSON.stringify(seccionContenido, null, 2)}

INSTRUCCIONES ADICIONALES:
${instrucciones || 'Agregá más ejemplos prácticos, más detalles, más contenido útil.'}

REGLAS:
- Mantené la misma estructura JSON
- Agregá 30-50% más contenido
- Incluí más ejemplos concretos
- Agregá tips prácticos
- PROHIBIDO: brumas místicas, océano susurra, dimensiones superiores
- Todo conectado con guardianes/duendes

Devolvé SOLO el JSON extendido, sin explicaciones.`;
    }
    else if (accion === 'regenerar') {
      prompt = `Sos parte del equipo de Duendes del Uruguay. Tenés que REGENERAR completamente este contenido con un enfoque fresco.

CONTENIDO ANTERIOR (para contexto de qué tema es):
${JSON.stringify(seccionContenido, null, 2)}

INSTRUCCIONES:
${instrucciones || 'Creá contenido completamente nuevo sobre el mismo tema.'}

REGLAS:
- Mantené la misma estructura JSON exacta
- Contenido 100% nuevo
- Más creativo y original
- PROHIBIDO: brumas místicas, océano susurra, dimensiones superiores
- Tono cercano, práctico, conectado con guardianes

Devolvé SOLO el JSON nuevo, sin explicaciones.`;
    }
    else {
      return res.status(400).json({ error: 'Acción no válida. Usar: mejorar, extender, regenerar' });
    }

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 3000,
      messages: [{ role: 'user', content: prompt }]
    });

    const contenidoTexto = response.content[0].text;
    const jsonMatch = contenidoTexto.match(/\{[\s\S]*\}/);
    
    if (!jsonMatch) {
      return res.status(500).json({ error: 'No se pudo generar contenido válido' });
    }

    const nuevoContenido = JSON.parse(jsonMatch[0]);

    // Actualizar la sección en el contenido
    actualizarSeccion(contenido, seccion, nuevoContenido);
    contenido.ultimaModificacion = new Date().toISOString();
    
    await kv.set(`contenido-circulo:${semana}`, contenido);

    return res.status(200).json({
      success: true,
      seccion,
      accion,
      contenidoActualizado: nuevoContenido
    });

  } catch (error) {
    console.error('[ADMIN/MEJORAR] Error:', error);
    return res.status(500).json({ error: error.message });
  }
}

function obtenerSeccion(contenido, seccion) {
  const mapa = {
    'introduccion': contenido.contenidoPrincipal?.introduccion,
    'luna': contenido.contenidoPrincipal?.luna,
    'eventos': contenido.contenidoPrincipal?.eventosAstrologicos,
    'sabbat': contenido.contenidoPrincipal?.sabbat,
    'consejos': contenido.contenidoPrincipal?.consejos,
    'cierre': contenido.contenidoPrincipal?.mensajeCierre,
    'desarrollo': contenido.contenidoPrincipal?.desarrollo,
    'actividad': contenido.contenidoPrincipal?.actividadPractica,
    'sabiasque': contenido.contenidoPrincipal?.sabiasQue,
    'mensaje': contenido.contenidoPrincipal?.mensajeGuardian,
    'materiales': contenido.contenidoPrincipal?.materiales,
    'pasos': contenido.contenidoPrincipal?.pasos,
    'personalizacion': contenido.contenidoPrincipal?.personalizacion,
    'activacion': contenido.contenidoPrincipal?.activacionMagica,
    'educativo': contenido.contenidoPrincipal?.contenidoEducativo,
    'guia': contenido.contenidoPrincipal?.guiaPractica,
    'guardianes': contenido.contenidoPrincipal?.conexionGuardianes,
    'ejercicio': contenido.contenidoPrincipal?.ejercicioSemana,
    'color': contenido.contenidoPrincipal?.colorDelMes,
    'meditacion': contenido.meditacion,
    'todo': contenido.contenidoPrincipal
  };
  
  return mapa[seccion] || null;
}

function actualizarSeccion(contenido, seccion, nuevoValor) {
  const mapa = {
    'introduccion': () => contenido.contenidoPrincipal.introduccion = nuevoValor,
    'luna': () => contenido.contenidoPrincipal.luna = nuevoValor,
    'eventos': () => contenido.contenidoPrincipal.eventosAstrologicos = nuevoValor,
    'sabbat': () => contenido.contenidoPrincipal.sabbat = nuevoValor,
    'consejos': () => contenido.contenidoPrincipal.consejos = nuevoValor,
    'cierre': () => contenido.contenidoPrincipal.mensajeCierre = nuevoValor,
    'desarrollo': () => contenido.contenidoPrincipal.desarrollo = nuevoValor,
    'actividad': () => contenido.contenidoPrincipal.actividadPractica = nuevoValor,
    'sabiasque': () => contenido.contenidoPrincipal.sabiasQue = nuevoValor,
    'mensaje': () => contenido.contenidoPrincipal.mensajeGuardian = nuevoValor,
    'materiales': () => contenido.contenidoPrincipal.materiales = nuevoValor,
    'pasos': () => contenido.contenidoPrincipal.pasos = nuevoValor,
    'personalizacion': () => contenido.contenidoPrincipal.personalizacion = nuevoValor,
    'activacion': () => contenido.contenidoPrincipal.activacionMagica = nuevoValor,
    'educativo': () => contenido.contenidoPrincipal.contenidoEducativo = nuevoValor,
    'guia': () => contenido.contenidoPrincipal.guiaPractica = nuevoValor,
    'guardianes': () => contenido.contenidoPrincipal.conexionGuardianes = nuevoValor,
    'ejercicio': () => contenido.contenidoPrincipal.ejercicioSemana = nuevoValor,
    'color': () => contenido.contenidoPrincipal.colorDelMes = nuevoValor,
    'meditacion': () => contenido.meditacion = nuevoValor,
    'todo': () => contenido.contenidoPrincipal = nuevoValor
  };
  
  if (mapa[seccion]) {
    mapa[seccion]();
  }
}
