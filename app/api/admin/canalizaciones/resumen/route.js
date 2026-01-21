import { kv } from '@vercel/kv';
import Anthropic from '@anthropic-ai/sdk';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// ═══════════════════════════════════════════════════════════════════════════════
// API: GENERAR RESUMEN INTELIGENTE DE CANALIZACIÓN
// Extrae contexto clave para facilitar la revisión del admin
// ═══════════════════════════════════════════════════════════════════════════════

export async function POST(request) {
  try {
    const { canalizacionId, forzarRegenerar } = await request.json();

    if (!canalizacionId) {
      return Response.json({
        success: false,
        error: 'ID de canalización requerido'
      }, { status: 400 });
    }

    // Obtener la canalización
    const canalizacion = await kv.get(`canalizacion:${canalizacionId}`);
    if (!canalizacion) {
      return Response.json({
        success: false,
        error: 'Canalización no encontrada'
      }, { status: 404 });
    }

    // Si ya tiene resumen ejecutivo y no forzamos regenerar, devolverlo
    if (canalizacion.resumenEjecutivo && !forzarRegenerar) {
      return Response.json({
        success: true,
        resumen: canalizacion.resumenEjecutivo,
        cacheado: true
      });
    }

    // Construir contexto para el resumen
    const contextoCheckout = canalizacion.datosCheckout || {};

    const prompt = `Analizá esta canalización y generá un resumen ejecutivo para el admin.

DATOS DEL CLIENTE:
- Nombre: ${canalizacion.nombreCliente}
- Destinatario: ${canalizacion.nombreDestinatario || canalizacion.nombreCliente}
- Email: ${canalizacion.email}
- Es regalo: ${contextoCheckout.esRegalo ? 'Sí' : 'No'}
- Es sorpresa: ${contextoCheckout.esSorpresa ? 'Sí' : 'No'}
- Para: ${contextoCheckout.paraQuien || 'para_mi'}
- Edad: ${contextoCheckout.esNino || 'adulto'}
- Pronombre: ${contextoCheckout.pronombre || 'ella'}
- Contexto adicional: ${contextoCheckout.contexto || 'No especificado'}

GUARDIÁN:
- Nombre: ${canalizacion.guardian?.nombre}
- Tipo: ${canalizacion.guardian?.tipo || 'guardián'}
- Categoría: ${canalizacion.guardian?.categoria || 'protección'}

CONTENIDO DE LA CANALIZACIÓN:
${canalizacion.contenido?.substring(0, 6000) || 'Sin contenido'}

---

GENERÁ UN RESUMEN ESTRUCTURADO EN ESTE FORMATO JSON:

{
  "cliente": {
    "nombre": "nombre del destinatario real",
    "relacion": "si es regalo, quién compró para quién",
    "contexto": "situación relevante en 1 frase"
  },
  "guardian": {
    "nombre": "nombre del guardián",
    "enfoque": "en qué se centra la canalización"
  },
  "loImportante": [
    "punto clave 1",
    "punto clave 2",
    "punto clave 3"
  ],
  "ritual": {
    "tipo": "tipo de ritual incluido",
    "elementos": ["elemento1", "elemento2"]
  },
  "mencionesEspeciales": [
    "guardián o lugar mencionado para futuras compras"
  ],
  "alertas": [
    "algo que el admin debería revisar (opcional)"
  ],
  "estadoGeneral": "lista | necesita_revision | problematico"
}

Respondé SOLO con el JSON, sin explicaciones.`;

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      messages: [{
        role: 'user',
        content: prompt
      }]
    });

    let resumenRaw = response.content[0].text;

    // Limpiar el JSON si viene con backticks
    resumenRaw = resumenRaw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

    let resumenEjecutivo;
    try {
      resumenEjecutivo = JSON.parse(resumenRaw);
    } catch (e) {
      // Si no parsea, crear uno básico
      resumenEjecutivo = {
        cliente: {
          nombre: canalizacion.nombreDestinatario || canalizacion.nombreCliente,
          contexto: 'No se pudo generar resumen detallado'
        },
        guardian: {
          nombre: canalizacion.guardian?.nombre,
          enfoque: canalizacion.guardian?.categoria
        },
        loImportante: [canalizacion.resumen || 'Canalización generada'],
        estadoGeneral: 'necesita_revision'
      };
    }

    // Guardar el resumen ejecutivo en la canalización
    canalizacion.resumenEjecutivo = resumenEjecutivo;
    await kv.set(`canalizacion:${canalizacionId}`, canalizacion);

    return Response.json({
      success: true,
      resumen: resumenEjecutivo,
      cacheado: false
    });

  } catch (error) {
    console.error('[RESUMEN] Error:', error);
    return Response.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
