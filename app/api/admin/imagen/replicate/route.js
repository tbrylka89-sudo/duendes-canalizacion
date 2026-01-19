import Replicate from 'replicate';
import { kv } from '@vercel/kv';
import fs from 'fs';
import path from 'path';

// ═══════════════════════════════════════════════════════════════════════════════
// API: GENERACIÓN DE IMÁGENES CON REPLICATE
// Usa modelos con image-to-image para mantener consistencia del personaje
// ═══════════════════════════════════════════════════════════════════════════════

export const dynamic = 'force-dynamic';
export const maxDuration = 120; // Las generaciones pueden tardar

// Convertir imagen a Data URI (base64) para evitar problemas de rate limiting
async function getImageAsDataUri(imagenUrl) {
  // Si es una ruta local (empieza con /), leer del filesystem
  if (imagenUrl.startsWith('/')) {
    const publicPath = path.join(process.cwd(), 'public', imagenUrl);
    if (fs.existsSync(publicPath)) {
      const buffer = fs.readFileSync(publicPath);
      const ext = path.extname(imagenUrl).toLowerCase();
      const mimeType = ext === '.png' ? 'image/png' :
                       ext === '.webp' ? 'image/webp' : 'image/jpeg';
      return `data:${mimeType};base64,${buffer.toString('base64')}`;
    }
  }

  // Si es una URL, descargar y convertir a base64
  try {
    const response = await fetch(imagenUrl);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const buffer = await response.arrayBuffer();
    const contentType = response.headers.get('content-type') || 'image/png';
    const base64 = Buffer.from(buffer).toString('base64');
    return `data:${contentType};base64,${base64}`;
  } catch (error) {
    throw new Error(`No se pudo descargar la imagen: ${error.message}`);
  }
}

export async function POST(request) {
  if (!process.env.REPLICATE_API_TOKEN) {
    return Response.json({
      success: false,
      error: 'REPLICATE_API_TOKEN no configurada. Agregala en Vercel → Settings → Environment Variables'
    }, { status: 400 });
  }

  const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN
  });

  try {
    const body = await request.json();
    const {
      imagenReferencia = null,  // URL de imagen de referencia (opcional)
      prompt = '',
      modelo = 'flux-schnell',  // Modelo a usar
      fuerza = 0.7  // Para img2img: qué tanto mantener del original (0-1)
    } = body;

    if (!prompt && !imagenReferencia) {
      return Response.json({
        success: false,
        error: 'Se requiere al menos un prompt o una imagen de referencia'
      }, { status: 400 });
    }

    let output;
    let modeloUsado = modelo;

    // Prompt mejorado para escenas mágicas
    const promptBase = prompt || 'Enchanted forest with magical atmosphere';
    const promptFinal = `${promptBase}. Photorealistic, cinematic, high quality.`;
    const negativePrompt = "text, watermark, logo, cartoon, anime, illustration, low quality, blurry, deformed";

    console.log(`[REPLICATE] Usando modelo: ${modelo}`);

    // Convertir imagen de referencia si existe
    let imageDataUri = null;
    if (imagenReferencia) {
      console.log('[REPLICATE] Procesando imagen de referencia...');
      imageDataUri = await getImageAsDataUri(imagenReferencia);
    }

    // ═══════════════════════════════════════════════════════════════════
    // MODELOS DE IMAGEN
    // ═══════════════════════════════════════════════════════════════════

    if (modelo === 'flux-schnell') {
      output = await replicate.run("black-forest-labs/flux-schnell", {
        input: {
          prompt: promptFinal,
          num_outputs: 1,
          aspect_ratio: "16:9",
          output_format: "webp",
          output_quality: 90
        }
      });

    } else if (modelo === 'flux-pro') {
      output = await replicate.run("black-forest-labs/flux-1.1-pro", {
        input: {
          prompt: promptFinal,
          aspect_ratio: "16:9",
          output_format: "webp",
          output_quality: 90,
          safety_tolerance: 2
        }
      });

    } else if (modelo === 'sdxl') {
      if (imageDataUri) {
        // img2img
        output = await replicate.run(
          "stability-ai/sdxl:7762fd07cf82c948538e41f63f77d685e02b063e37e496e96eefd46c929f9bdc",
          {
            input: {
              image: imageDataUri,
              prompt: promptFinal,
              negative_prompt: negativePrompt,
              prompt_strength: 1 - fuerza,
              num_inference_steps: 30,
              guidance_scale: 7.5
            }
          }
        );
      } else {
        // text2img
        output = await replicate.run(
          "stability-ai/sdxl:7762fd07cf82c948538e41f63f77d685e02b063e37e496e96eefd46c929f9bdc",
          {
            input: {
              prompt: promptFinal,
              negative_prompt: negativePrompt,
              width: 1344,
              height: 768,
              num_inference_steps: 30,
              guidance_scale: 7.5
            }
          }
        );
      }

    } else if (modelo === 'ideogram') {
      output = await replicate.run("ideogram-ai/ideogram-v2", {
        input: {
          prompt: promptFinal,
          aspect_ratio: "16:9",
          style_type: "REALISTIC"
        }
      });

    } else if (modelo === 'recraft') {
      output = await replicate.run("recraft-ai/recraft-v3", {
        input: {
          prompt: promptFinal,
          size: "1365x1024",
          style: "realistic_image"
        }
      });

    // ═══════════════════════════════════════════════════════════════════
    // MODELOS DE VIDEO
    // ═══════════════════════════════════════════════════════════════════

    } else if (modelo === 'minimax-video') {
      if (imageDataUri) {
        output = await replicate.run("minimax/video-01", {
          input: {
            prompt: promptFinal,
            first_frame_image: imageDataUri
          }
        });
      } else {
        output = await replicate.run("minimax/video-01", {
          input: { prompt: promptFinal }
        });
      }

    } else if (modelo === 'luma-dream') {
      if (imageDataUri) {
        output = await replicate.run("luma/ray", {
          input: {
            prompt: promptFinal,
            start_image: imageDataUri,
            aspect_ratio: "16:9"
          }
        });
      } else {
        output = await replicate.run("luma/ray", {
          input: {
            prompt: promptFinal,
            aspect_ratio: "16:9"
          }
        });
      }

    } else if (modelo === 'kling-video') {
      if (imageDataUri) {
        output = await replicate.run("kwaivgi/kling-v1.6-pro", {
          input: {
            prompt: promptFinal,
            start_image: imageDataUri,
            duration: 5,
            aspect_ratio: "16:9"
          }
        });
      } else {
        output = await replicate.run("kwaivgi/kling-v1.6-pro", {
          input: {
            prompt: promptFinal,
            duration: 5,
            aspect_ratio: "16:9"
          }
        });
      }

    } else if (modelo === 'haiper') {
      output = await replicate.run("haiper-ai/haiper-video-2", {
        input: {
          prompt: promptFinal,
          duration: 4,
          aspect_ratio: "16:9"
        }
      });

    // ═══════════════════════════════════════════════════════════════════
    // MODELOS RÁPIDOS
    // ═══════════════════════════════════════════════════════════════════

    } else if (modelo === 'sdxl-lightning') {
      output = await replicate.run("bytedance/sdxl-lightning-4step:5599ed30703defd1d160a25a63321b4dec97101d98b4674bcc56e41f62f35637", {
        input: {
          prompt: promptFinal,
          negative_prompt: negativePrompt,
          width: 1344,
          height: 768,
          num_inference_steps: 4,
          guidance_scale: 0
        }
      });

    } else if (modelo === 'playground') {
      output = await replicate.run("playgroundai/playground-v2.5-1024px-aesthetic:a45f82a1382bed5c7aeb861dac7c7d191b0fdf74d8d57c4a0e6ed7d4d0bf7d24", {
        input: {
          prompt: promptFinal,
          negative_prompt: negativePrompt,
          width: 1344,
          height: 768,
          guidance_scale: 3,
          num_inference_steps: 25
        }
      });

    // ═══════════════════════════════════════════════════════════════════
    // MODELOS ALTA CALIDAD
    // ═══════════════════════════════════════════════════════════════════

    } else if (modelo === 'flux-dev') {
      output = await replicate.run("black-forest-labs/flux-dev", {
        input: {
          prompt: promptFinal,
          aspect_ratio: "16:9",
          output_format: "webp",
          output_quality: 90,
          guidance: 3.5,
          num_inference_steps: 28
        }
      });

    } else if (modelo === 'sd35-large') {
      output = await replicate.run("stability-ai/stable-diffusion-3.5-large", {
        input: {
          prompt: promptFinal,
          negative_prompt: negativePrompt,
          aspect_ratio: "16:9",
          output_format: "webp",
          output_quality: 90
        }
      });

    // ═══════════════════════════════════════════════════════════════════
    // MODELOS FOTORREALISTAS
    // ═══════════════════════════════════════════════════════════════════

    } else if (modelo === 'realvis') {
      output = await replicate.run("lucataco/realvisxl-v2.0:7d6a2f9c4754477b12c14ed2a58f89bb85128edcdd581d24ce58b6926029de08", {
        input: {
          prompt: promptFinal,
          negative_prompt: negativePrompt,
          width: 1344,
          height: 768,
          num_inference_steps: 40,
          guidance_scale: 7
        }
      });

    } else if (modelo === 'juggernaut') {
      output = await replicate.run("lucataco/juggernaut-xl-v9:bea09cf018e513cef0841719559ea86d2299e05571f49c3a64c3c1e88e0d4650", {
        input: {
          prompt: promptFinal,
          negative_prompt: negativePrompt,
          width: 1344,
          height: 768,
          num_inference_steps: 30,
          guidance_scale: 6
        }
      });

    // ═══════════════════════════════════════════════════════════════════
    // MODELOS ARTÍSTICOS
    // ═══════════════════════════════════════════════════════════════════

    } else if (modelo === 'dreamshaper') {
      output = await replicate.run("lucataco/dreamshaper-xl-turbo:0a1710e0187b01a255c434d22cec3f6e07a6f3fda8a7a53b2eb574f30ea7dc64", {
        input: {
          prompt: promptFinal,
          negative_prompt: negativePrompt,
          width: 1344,
          height: 768,
          num_inference_steps: 6,
          guidance_scale: 2
        }
      });

    } else if (modelo === 'animagine') {
      // Usar versión sin hash específico para obtener la última
      output = await replicate.run("cagliostrolab/animagine-xl-3.1", {
        input: {
          prompt: promptFinal,
          negative_prompt: "lowres, bad anatomy, bad hands, text, error, missing fingers, extra digit, fewer digits, cropped, worst quality, low quality",
          width: 1344,
          height: 768,
          num_inference_steps: 28,
          guidance_scale: 7
        }
      });

    } else if (modelo === 'openjourney') {
      // Usar SDXL con estilo Midjourney como fallback (openjourney deprecated)
      output = await replicate.run("stability-ai/sdxl:7762fd07cf82c948538e41f63f77d685e02b063e37e496e96eefd46c929f9bdc", {
        input: {
          prompt: `masterpiece, best quality, highly detailed, ${promptFinal}, trending on artstation, digital art`,
          negative_prompt: negativePrompt,
          width: 1344,
          height: 768,
          num_inference_steps: 30,
          guidance_scale: 7.5
        }
      });

    } else {
      // Default: Flux Schnell
      output = await replicate.run("black-forest-labs/flux-schnell", {
        input: {
          prompt: promptFinal,
          num_outputs: 1,
          aspect_ratio: "16:9"
        }
      });
    }

    // Obtener URL de la imagen generada
    console.log('[REPLICATE] Output type:', typeof output, output);

    let imagenUrl;
    if (Array.isArray(output)) {
      // Si es un array, tomar el primer elemento
      const firstItem = output[0];
      // Puede ser un string (URL) o un objeto FileOutput
      imagenUrl = typeof firstItem === 'string' ? firstItem :
                  firstItem?.url ? firstItem.url() :
                  firstItem?.toString ? firstItem.toString() : null;
    } else if (typeof output === 'string') {
      imagenUrl = output;
    } else if (output?.url) {
      imagenUrl = typeof output.url === 'function' ? output.url() : output.url;
    } else if (output?.toString) {
      imagenUrl = output.toString();
    }

    console.log('[REPLICATE] Imagen URL:', imagenUrl);

    if (!imagenUrl || imagenUrl === '[object Object]') {
      throw new Error('No se pudo obtener la URL de la imagen generada');
    }

    // Guardar en historial
    const historial = await kv.get('admin:replicate:historial') || [];
    historial.unshift({
      id: `replicate_${Date.now()}`,
      imagenReferencia,
      prompt,
      modelo,
      resultado: imagenUrl,
      fecha: new Date().toISOString()
    });
    await kv.set('admin:replicate:historial', historial.slice(0, 30));

    return Response.json({
      success: true,
      imagen: {
        url: imagenUrl,
        modelo: modeloUsado,
        imagenReferencia
      }
    });

  } catch (error) {
    console.error('[REPLICATE] Error:', error);
    return Response.json({
      success: false,
      error: error.message || 'Error generando imagen con Replicate'
    }, { status: 500 });
  }
}

// GET - Ver historial y modelos disponibles
export async function GET() {
  const historial = await kv.get('admin:replicate:historial') || [];

  return Response.json({
    success: true,
    configurado: !!process.env.REPLICATE_API_TOKEN,
    modelos: [
      { id: 'ip-adapter', nombre: 'IP-Adapter SDXL', descripcion: 'Mejor para mantener estilo del personaje' },
      { id: 'sdxl-img2img', nombre: 'SDXL img2img', descripcion: 'Variaciones directas de la imagen' },
      { id: 'photomaker', nombre: 'PhotoMaker', descripcion: 'Mantiene identidad del personaje' }
    ],
    historial: historial.slice(0, 10)
  });
}
