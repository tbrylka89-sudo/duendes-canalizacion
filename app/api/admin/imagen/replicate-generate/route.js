import Replicate from 'replicate';
import { kv } from '@vercel/kv';

// ═══════════════════════════════════════════════════════════════════════════════
// API: GENERACIÓN DINÁMICA CON REPLICATE
// Ejecuta cualquier modelo con parámetros dinámicos
// ═══════════════════════════════════════════════════════════════════════════════

export const dynamic = 'force-dynamic';
export const maxDuration = 300; // Videos pueden tardar más

export async function POST(request) {
  if (!process.env.REPLICATE_API_TOKEN) {
    return Response.json({
      success: false,
      error: 'REPLICATE_API_TOKEN no configurada'
    }, { status: 400 });
  }

  const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN
  });

  try {
    const { modelId, params } = await request.json();

    if (!modelId) {
      return Response.json({
        success: false,
        error: 'Se requiere modelId'
      }, { status: 400 });
    }

    console.log(`[REPLICATE-GENERATE] Modelo: ${modelId}`);
    console.log(`[REPLICATE-GENERATE] Params:`, Object.keys(params));

    const startTime = Date.now();

    // Ejecutar el modelo
    const output = await replicate.run(modelId, {
      input: params
    });

    const endTime = Date.now();
    const tiempo = ((endTime - startTime) / 1000).toFixed(1);

    // Extraer URL del resultado
    let url;
    let type = 'image';

    if (Array.isArray(output)) {
      const first = output[0];
      url = typeof first === 'string' ? first :
            first?.url ? (typeof first.url === 'function' ? first.url() : first.url) :
            first?.toString ? first.toString() : null;
    } else if (typeof output === 'string') {
      url = output;
    } else if (output?.url) {
      url = typeof output.url === 'function' ? output.url() : output.url;
    } else if (output?.toString) {
      url = output.toString();
    }

    // Detectar si es video
    if (url && (url.includes('.mp4') || url.includes('video') || modelId.includes('video') || modelId.includes('kling') || modelId.includes('luma') || modelId.includes('minimax') || modelId.includes('haiper') || modelId.includes('hunyuan'))) {
      type = 'video';
    }

    // Detectar formato
    let format = 'png';
    if (url) {
      if (url.includes('.webp')) format = 'webp';
      else if (url.includes('.jpg') || url.includes('.jpeg')) format = 'jpg';
      else if (url.includes('.mp4')) format = 'mp4';
    }

    if (!url || url === '[object Object]') {
      throw new Error('No se pudo obtener la URL del resultado');
    }

    // Guardar en historial
    const historial = await kv.get('admin:replicate:historial-explorer') || [];
    historial.unshift({
      id: `gen_${Date.now()}`,
      modelId,
      params: { prompt: params.prompt }, // Solo guardar prompt para no llenar
      url,
      type,
      tiempo,
      fecha: new Date().toISOString()
    });
    await kv.set('admin:replicate:historial-explorer', historial.slice(0, 50));

    return Response.json({
      success: true,
      url,
      type,
      format,
      modelo: modelId,
      tiempo: parseFloat(tiempo)
    });

  } catch (error) {
    console.error('[REPLICATE-GENERATE] Error:', error);
    return Response.json({
      success: false,
      error: error.message || 'Error generando'
    }, { status: 500 });
  }
}
