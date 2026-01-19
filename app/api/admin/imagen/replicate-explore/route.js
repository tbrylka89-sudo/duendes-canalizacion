import Replicate from 'replicate';

// ═══════════════════════════════════════════════════════════════════════════════
// API: EXPLORADOR DE MODELOS DE REPLICATE
// Obtiene todos los modelos disponibles dinámicamente
// ═══════════════════════════════════════════════════════════════════════════════

export const dynamic = 'force-dynamic';

export async function GET(request) {
  if (!process.env.REPLICATE_API_TOKEN) {
    return Response.json({
      success: false,
      error: 'REPLICATE_API_TOKEN no configurada'
    }, { status: 400 });
  }

  const { searchParams } = new URL(request.url);
  const categoria = searchParams.get('categoria') || 'all';
  const busqueda = searchParams.get('q') || '';

  try {
    // Modelos curados para generación de imágenes y videos
    const modelosCurados = {
      // ═══════════════════════════════════════════════════════════════════
      // GEMINI - NANO BANANA PRO (PRIMERO!)
      // ═══════════════════════════════════════════════════════════════════
      gemini: [
        {
          id: 'gemini/nano-banana-pro',
          nombre: '🍌 Nano Banana Pro',
          descripcion: 'El MEJOR modelo de Google - Gemini 2.0 Flash',
          precio: '~$0.01/imagen',
          categoria: 'gemini',
          isGemini: true,
          params: {
            prompt: { type: 'text', required: true },
            image: { type: 'image', required: false }
          }
        }
      ],

      // ═══════════════════════════════════════════════════════════════════
      // TEXTO A IMAGEN - ALTA CALIDAD
      // ═══════════════════════════════════════════════════════════════════
      text_to_image_quality: [
        {
          id: 'black-forest-labs/flux-1.1-pro',
          nombre: 'Flux 1.1 Pro',
          descripcion: 'Máxima calidad, el mejor modelo actual',
          precio: '$0.04/imagen',
          categoria: 'text_to_image',
          params: {
            prompt: { type: 'text', required: true },
            aspect_ratio: { type: 'select', options: ['1:1', '16:9', '9:16', '4:3', '3:4', '21:9'], default: '16:9' },
            output_format: { type: 'select', options: ['webp', 'jpg', 'png'], default: 'webp' },
            output_quality: { type: 'range', min: 1, max: 100, default: 90 },
            safety_tolerance: { type: 'range', min: 1, max: 5, default: 2 }
          }
        },
        {
          id: 'black-forest-labs/flux-dev',
          nombre: 'Flux Dev',
          descripcion: 'Excelente calidad, más económico que Pro',
          precio: '$0.025/imagen',
          categoria: 'text_to_image',
          params: {
            prompt: { type: 'text', required: true },
            aspect_ratio: { type: 'select', options: ['1:1', '16:9', '9:16', '4:3', '3:4'], default: '16:9' },
            guidance: { type: 'range', min: 1, max: 10, default: 3.5 },
            num_inference_steps: { type: 'range', min: 1, max: 50, default: 28 },
            output_format: { type: 'select', options: ['webp', 'jpg', 'png'], default: 'webp' }
          }
        },
        {
          id: 'stability-ai/stable-diffusion-3.5-large',
          nombre: 'Stable Diffusion 3.5 Large',
          descripcion: 'Último modelo de Stability AI',
          precio: '$0.035/imagen',
          categoria: 'text_to_image',
          params: {
            prompt: { type: 'text', required: true },
            negative_prompt: { type: 'text', default: '' },
            aspect_ratio: { type: 'select', options: ['1:1', '16:9', '9:16', '4:3', '3:4', '21:9'], default: '16:9' },
            output_format: { type: 'select', options: ['webp', 'jpg', 'png'], default: 'webp' }
          }
        },
        {
          id: 'ideogram-ai/ideogram-v2',
          nombre: 'Ideogram v2',
          descripcion: 'Excelente para texto en imágenes',
          precio: '$0.08/imagen',
          categoria: 'text_to_image',
          params: {
            prompt: { type: 'text', required: true },
            aspect_ratio: { type: 'select', options: ['1:1', '16:9', '9:16', '4:3', '3:4', '10:16', '16:10'], default: '16:9' },
            style_type: { type: 'select', options: ['AUTO', 'REALISTIC', 'DESIGN', 'RENDER_3D', 'ANIME'], default: 'REALISTIC' },
            magic_prompt_option: { type: 'select', options: ['AUTO', 'ON', 'OFF'], default: 'AUTO' }
          }
        },
        {
          id: 'recraft-ai/recraft-v3',
          nombre: 'Recraft V3',
          descripcion: 'Estilo artístico profesional',
          precio: '$0.04/imagen',
          categoria: 'text_to_image',
          params: {
            prompt: { type: 'text', required: true },
            size: { type: 'select', options: ['1024x1024', '1365x1024', '1024x1365', '1536x1024', '1024x1536'], default: '1365x1024' },
            style: { type: 'select', options: ['any', 'realistic_image', 'digital_illustration', 'vector_illustration', 'icon'], default: 'realistic_image' }
          }
        }
      ],

      // ═══════════════════════════════════════════════════════════════════
      // TEXTO A IMAGEN - RÁPIDOS Y BARATOS
      // ═══════════════════════════════════════════════════════════════════
      text_to_image_fast: [
        {
          id: 'black-forest-labs/flux-schnell',
          nombre: 'Flux Schnell',
          descripcion: 'Muy rápido, excelente calidad/precio',
          precio: '$0.003/imagen',
          categoria: 'text_to_image',
          params: {
            prompt: { type: 'text', required: true },
            aspect_ratio: { type: 'select', options: ['1:1', '16:9', '9:16', '4:3', '3:4', '21:9'], default: '16:9' },
            num_outputs: { type: 'range', min: 1, max: 4, default: 1 },
            output_format: { type: 'select', options: ['webp', 'jpg', 'png'], default: 'webp' },
            output_quality: { type: 'range', min: 1, max: 100, default: 90 }
          }
        },
        {
          id: 'bytedance/sdxl-lightning-4step',
          nombre: 'SDXL Lightning',
          descripcion: 'Ultra rápido, 4 pasos',
          precio: '$0.002/imagen',
          categoria: 'text_to_image',
          params: {
            prompt: { type: 'text', required: true },
            negative_prompt: { type: 'text', default: '' },
            width: { type: 'select', options: [512, 768, 1024, 1344], default: 1344 },
            height: { type: 'select', options: [512, 768, 1024], default: 768 },
            num_inference_steps: { type: 'range', min: 1, max: 8, default: 4 }
          }
        },
        {
          id: 'playgroundai/playground-v2.5-1024px-aesthetic',
          nombre: 'Playground v2.5',
          descripcion: 'Muy rápido, estético',
          precio: '$0.004/imagen',
          categoria: 'text_to_image',
          params: {
            prompt: { type: 'text', required: true },
            negative_prompt: { type: 'text', default: '' },
            width: { type: 'select', options: [512, 768, 1024, 1344], default: 1344 },
            height: { type: 'select', options: [512, 768, 1024], default: 768 },
            guidance_scale: { type: 'range', min: 1, max: 20, default: 3 },
            num_inference_steps: { type: 'range', min: 1, max: 50, default: 25 }
          }
        }
      ],

      // ═══════════════════════════════════════════════════════════════════
      // TEXTO A IMAGEN - FOTORREALISTAS
      // ═══════════════════════════════════════════════════════════════════
      text_to_image_photo: [
        {
          id: 'lucataco/realvisxl-v2.0',
          nombre: 'RealVisXL v2',
          descripcion: 'Fotorrealismo extremo',
          precio: '$0.002/imagen',
          categoria: 'text_to_image',
          params: {
            prompt: { type: 'text', required: true },
            negative_prompt: { type: 'text', default: 'cartoon, painting, illustration, worst quality, low quality, normal quality' },
            width: { type: 'select', options: [512, 768, 1024, 1344], default: 1344 },
            height: { type: 'select', options: [512, 768, 1024], default: 768 },
            num_inference_steps: { type: 'range', min: 20, max: 50, default: 40 },
            guidance_scale: { type: 'range', min: 1, max: 20, default: 7 }
          }
        },
        {
          id: 'lucataco/juggernaut-xl-v9',
          nombre: 'Juggernaut XL v9',
          descripcion: 'Fotorrealismo profesional',
          precio: '$0.003/imagen',
          categoria: 'text_to_image',
          params: {
            prompt: { type: 'text', required: true },
            negative_prompt: { type: 'text', default: '' },
            width: { type: 'select', options: [512, 768, 1024, 1344], default: 1344 },
            height: { type: 'select', options: [512, 768, 1024], default: 768 },
            num_inference_steps: { type: 'range', min: 20, max: 50, default: 30 },
            guidance_scale: { type: 'range', min: 1, max: 20, default: 6 }
          }
        },
        {
          id: 'stability-ai/sdxl',
          nombre: 'SDXL',
          descripcion: 'Clásico versátil de Stability',
          precio: '$0.002/imagen',
          categoria: 'text_to_image',
          params: {
            prompt: { type: 'text', required: true },
            negative_prompt: { type: 'text', default: '' },
            width: { type: 'select', options: [512, 768, 1024, 1344], default: 1344 },
            height: { type: 'select', options: [512, 768, 1024], default: 768 },
            num_inference_steps: { type: 'range', min: 20, max: 50, default: 30 },
            guidance_scale: { type: 'range', min: 1, max: 20, default: 7.5 },
            scheduler: { type: 'select', options: ['DDIM', 'DPMSolverMultistep', 'K_EULER', 'K_EULER_ANCESTRAL', 'PNDM'], default: 'K_EULER' }
          }
        }
      ],

      // ═══════════════════════════════════════════════════════════════════
      // TEXTO A IMAGEN - ARTÍSTICOS
      // ═══════════════════════════════════════════════════════════════════
      text_to_image_art: [
        {
          id: 'lucataco/dreamshaper-xl-turbo',
          nombre: 'DreamShaper XL Turbo',
          descripcion: 'Fantasía y sueños',
          precio: '$0.003/imagen',
          categoria: 'text_to_image',
          params: {
            prompt: { type: 'text', required: true },
            negative_prompt: { type: 'text', default: '' },
            width: { type: 'select', options: [512, 768, 1024, 1344], default: 1344 },
            height: { type: 'select', options: [512, 768, 1024], default: 768 },
            num_inference_steps: { type: 'range', min: 4, max: 12, default: 6 },
            guidance_scale: { type: 'range', min: 1, max: 5, default: 2 }
          }
        },
        {
          id: 'cagliostrolab/animagine-xl-3.1',
          nombre: 'Animagine XL 3.1',
          descripcion: 'Estilo anime de alta calidad',
          precio: '$0.002/imagen',
          categoria: 'text_to_image',
          params: {
            prompt: { type: 'text', required: true },
            negative_prompt: { type: 'text', default: 'lowres, bad anatomy, bad hands' },
            width: { type: 'select', options: [512, 768, 1024, 1344], default: 1024 },
            height: { type: 'select', options: [512, 768, 1024, 1344], default: 1024 },
            num_inference_steps: { type: 'range', min: 20, max: 50, default: 28 },
            guidance_scale: { type: 'range', min: 1, max: 20, default: 7 }
          }
        },
        {
          id: 'prompthero/openjourney-v4',
          nombre: 'Openjourney v4',
          descripcion: 'Estilo Midjourney',
          precio: '$0.002/imagen',
          categoria: 'text_to_image',
          params: {
            prompt: { type: 'text', required: true, prefix: 'mdjrny-v4 style ' },
            negative_prompt: { type: 'text', default: '' },
            width: { type: 'select', options: [512, 768, 1024], default: 1024 },
            height: { type: 'select', options: [512, 576, 768], default: 576 },
            num_inference_steps: { type: 'range', min: 20, max: 100, default: 50 },
            guidance_scale: { type: 'range', min: 1, max: 20, default: 7 }
          }
        }
      ],

      // ═══════════════════════════════════════════════════════════════════
      // IMAGEN A IMAGEN
      // ═══════════════════════════════════════════════════════════════════
      image_to_image: [
        {
          id: 'stability-ai/stable-diffusion-img2img',
          nombre: 'SD img2img',
          descripcion: 'Transforma imágenes existentes',
          precio: '$0.002/imagen',
          categoria: 'image_to_image',
          params: {
            prompt: { type: 'text', required: true },
            image: { type: 'image', required: true },
            negative_prompt: { type: 'text', default: '' },
            prompt_strength: { type: 'range', min: 0, max: 1, step: 0.05, default: 0.8 },
            num_inference_steps: { type: 'range', min: 10, max: 50, default: 30 },
            guidance_scale: { type: 'range', min: 1, max: 20, default: 7.5 }
          }
        },
        {
          id: 'tencentarc/photomaker',
          nombre: 'PhotoMaker',
          descripcion: 'Mantiene identidad de persona',
          precio: '$0.01/imagen',
          categoria: 'image_to_image',
          params: {
            prompt: { type: 'text', required: true },
            input_image: { type: 'image', required: true },
            style_name: { type: 'select', options: ['Photographic', 'Cinematic', 'Disney Character', 'Digital Art', 'Fantasy art'], default: 'Photographic' },
            num_steps: { type: 'range', min: 20, max: 50, default: 30 },
            guidance_scale: { type: 'range', min: 1, max: 10, default: 5 }
          }
        },
        {
          id: 'lucataco/ip-adapter-faceid-sdxl',
          nombre: 'IP-Adapter FaceID',
          descripcion: 'Transfiere cara a nuevo contexto',
          precio: '$0.005/imagen',
          categoria: 'image_to_image',
          params: {
            prompt: { type: 'text', required: true },
            face_image: { type: 'image', required: true },
            negative_prompt: { type: 'text', default: '' },
            ip_adapter_scale: { type: 'range', min: 0, max: 1, step: 0.1, default: 0.8 },
            num_inference_steps: { type: 'range', min: 20, max: 50, default: 30 }
          }
        }
      ],

      // ═══════════════════════════════════════════════════════════════════
      // UPSCALE / MEJORA
      // ═══════════════════════════════════════════════════════════════════
      upscale: [
        {
          id: 'nightmareai/real-esrgan',
          nombre: 'Real-ESRGAN',
          descripcion: 'Upscale 4x realista',
          precio: '$0.002/imagen',
          categoria: 'upscale',
          params: {
            image: { type: 'image', required: true },
            scale: { type: 'select', options: [2, 4], default: 4 },
            face_enhance: { type: 'boolean', default: false }
          }
        },
        {
          id: 'cjwbw/rudalle-sr',
          nombre: 'ruDALL-E SR',
          descripcion: 'Super resolución artística',
          precio: '$0.003/imagen',
          categoria: 'upscale',
          params: {
            image: { type: 'image', required: true },
            scale: { type: 'select', options: [4, 8], default: 4 }
          }
        }
      ],

      // ═══════════════════════════════════════════════════════════════════
      // VIDEOS
      // ═══════════════════════════════════════════════════════════════════
      video: [
        {
          id: 'minimax/video-01',
          nombre: 'Minimax Video-01',
          descripcion: 'Videos desde texto o imagen',
          precio: '$0.25/5s',
          categoria: 'video',
          params: {
            prompt: { type: 'text', required: true },
            first_frame_image: { type: 'image', required: false }
          }
        },
        {
          id: 'luma/ray',
          nombre: 'Luma Dream Machine',
          descripcion: 'Videos cinematográficos',
          precio: '$0.30/5s',
          categoria: 'video',
          params: {
            prompt: { type: 'text', required: true },
            start_image: { type: 'image', required: false },
            end_image: { type: 'image', required: false },
            aspect_ratio: { type: 'select', options: ['16:9', '9:16', '1:1'], default: '16:9' },
            loop: { type: 'boolean', default: false }
          }
        },
        {
          id: 'kwaivgi/kling-v1.6-pro',
          nombre: 'Kling v1.6 Pro',
          descripcion: 'Videos realistas de alta calidad',
          precio: '$0.10/5s',
          categoria: 'video',
          params: {
            prompt: { type: 'text', required: true },
            start_image: { type: 'image', required: false },
            duration: { type: 'select', options: [5, 10], default: 5 },
            aspect_ratio: { type: 'select', options: ['16:9', '9:16', '1:1'], default: '16:9' }
          }
        },
        {
          id: 'haiper-ai/haiper-video-2',
          nombre: 'Haiper Video 2',
          descripcion: 'Videos rápidos y baratos',
          precio: '$0.05/4s',
          categoria: 'video',
          params: {
            prompt: { type: 'text', required: true },
            duration: { type: 'select', options: [2, 4, 6], default: 4 },
            aspect_ratio: { type: 'select', options: ['16:9', '9:16', '1:1'], default: '16:9' }
          }
        },
        {
          id: 'tencent/hunyuan-video',
          nombre: 'Hunyuan Video',
          descripcion: 'Videos de Tencent, buena calidad',
          precio: '$0.15/5s',
          categoria: 'video',
          params: {
            prompt: { type: 'text', required: true },
            width: { type: 'select', options: [544, 720, 960, 1280], default: 960 },
            height: { type: 'select', options: [320, 480, 544, 720], default: 544 },
            video_length: { type: 'range', min: 65, max: 129, default: 97 }
          }
        }
      ]
    };

    // Filtrar por categoría si se especifica
    let resultados = [];
    if (categoria === 'all') {
      Object.values(modelosCurados).forEach(arr => resultados.push(...arr));
    } else if (modelosCurados[categoria]) {
      resultados = modelosCurados[categoria];
    }

    // Filtrar por búsqueda si se especifica
    if (busqueda) {
      const q = busqueda.toLowerCase();
      resultados = resultados.filter(m =>
        m.nombre.toLowerCase().includes(q) ||
        m.descripcion.toLowerCase().includes(q) ||
        m.id.toLowerCase().includes(q)
      );
    }

    return Response.json({
      success: true,
      categorias: Object.keys(modelosCurados),
      modelos: resultados,
      total: resultados.length
    });

  } catch (error) {
    console.error('[REPLICATE-EXPLORE] Error:', error);
    return Response.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
