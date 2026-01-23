// ═══════════════════════════════════════════════════════════════════════════════
// GENERADOR DE IMAGENES - DUENDES DEL URUGUAY
// Sistema centralizado para generar imagenes con IA
// Prefiere Replicate (Flux) por costo y calidad para fantasia
// ═══════════════════════════════════════════════════════════════════════════════

import Replicate from 'replicate';

// ═══════════════════════════════════════════════════════════════════════════════
// ESTILOS Y PROMPTS BASE
// ═══════════════════════════════════════════════════════════════════════════════

// Estilo base para TODAS las imagenes de Duendes del Uruguay
const ESTILO_BASE_DUENDES = `
fantasy art style, magical atmosphere, warm golden light,
uruguayan folklore inspired, mystical forest setting,
soft bokeh effect, enchanted atmosphere, professional quality,
whimsical and magical, earth tones with gold accents,
dreamlike quality, handcrafted aesthetic
`.trim().replace(/\n/g, ' ');

// Modificadores de calidad
const CALIDAD_ALTA = 'high quality, detailed, professional photography lighting, cinematic';
const NEGATIVE_PROMPT = 'text, watermark, logo, ugly, blurry, deformed, low quality, cartoon, anime style, childish, plastic, artificial';

// Prompts especificos por tipo de contenido
export const PROMPTS_TIPO = {
  duende: {
    base: `A magical guardian spirit figurine, handcrafted appearance, wise and gentle expression,
           sitting in mystical forest, surrounded by crystals and natural elements,
           warm amber lighting, moss and small mushrooms around, ethereal sparkles,
           ${ESTILO_BASE_DUENDES}`,
    elementos: {
      tierra: 'earthy browns and greens, moss, roots, stones, grounding energy',
      agua: 'soft blues and teals, flowing water elements, pearls, moonlight reflections',
      fuego: 'warm oranges and golds, candle glow, ember sparks, passionate energy',
      aire: 'soft whites and lavenders, feathers, mist, light breeze effects',
      eter: 'purple and silver tones, stars, cosmic elements, mysterious depth'
    },
    categorias: {
      Proteccion: 'protective stance, shield-like pose, turmalina negra crystals nearby, strong and vigilant aura',
      Abundancia: 'joyful expression, golden coins and citrine crystals, prosperous energy, open welcoming pose',
      Amor: 'tender expression, rose quartz crystals, heart-shaped elements, soft pink glow',
      Sanacion: 'serene expression, healing herbs and aventurina, calm green aura, peaceful atmosphere',
      Sabiduria: 'contemplative expression, ancient scrolls, lapislazuli, wise and deep gaze',
      Intuicion: 'mysterious expression, amethyst and labradorite, third eye glow, cosmic connection'
    }
  },

  contenido: {
    ritual: `mystical ritual setup, sacred altar with candles, crystals arranged in pattern,
             dried herbs and flowers, warm candlelight glow, witchy aesthetic,
             smoke wisps, ${ESTILO_BASE_DUENDES}`,
    ensenanza: `magical book with glowing pages, wisdom symbols floating, forest clearing,
                ancient knowledge, soft ethereal light, ${ESTILO_BASE_DUENDES}`,
    meditacion: `peaceful meditation scene, person silhouette in nature, chakra colors,
                 serene forest lake, golden hour light, ${ESTILO_BASE_DUENDES}`,
    ejercicio: `hands holding crystals, magical energy flowing, practical magic,
                grounding earth elements, ${ESTILO_BASE_DUENDES}`
  },

  curso: {
    portada: `magical course portal, ornate frame with mystical symbols,
              forest path leading to light, invitation to journey,
              title space at top, ${ESTILO_BASE_DUENDES}`,
    modulo: `chapter opening illustration, numbered magical seal,
             guardian figure welcoming, specific theme elements,
             ${ESTILO_BASE_DUENDES}`
  },

  semana: {
    banner: `weekly guardian announcement, spotlight on magical creature,
             "guardian of the week" energy, celebratory but mystical,
             ${ESTILO_BASE_DUENDES}`,
    presentacion: `guardian introduction scene, dramatic reveal lighting,
                   magical forest stage, welcoming atmosphere,
                   ${ESTILO_BASE_DUENDES}`
  }
};

// ═══════════════════════════════════════════════════════════════════════════════
// FUNCION PRINCIPAL: GENERAR IMAGEN CON REPLICATE (PREFERIDO)
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Genera una imagen usando Replicate (Flux por defecto)
 * @param {Object} opciones - Opciones de generacion
 * @param {string} opciones.prompt - Descripcion de lo que generar
 * @param {string} [opciones.modelo='flux-schnell'] - Modelo a usar
 * @param {string} [opciones.aspectRatio='16:9'] - Aspect ratio
 * @param {string} [opciones.imagenReferencia] - URL de imagen de referencia (opcional)
 * @returns {Promise<{success: boolean, url?: string, error?: string}>}
 */
export async function generarConReplicate(opciones) {
  const {
    prompt,
    modelo = 'flux-schnell',
    aspectRatio = '16:9',
    imagenReferencia = null
  } = opciones;

  if (!process.env.REPLICATE_API_TOKEN) {
    return {
      success: false,
      error: 'REPLICATE_API_TOKEN no configurada'
    };
  }

  const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN
  });

  try {
    const promptFinal = `${prompt}, ${CALIDAD_ALTA}`;
    let output;

    // Flux Schnell - Rapido y economico
    if (modelo === 'flux-schnell') {
      output = await replicate.run("black-forest-labs/flux-schnell", {
        input: {
          prompt: promptFinal,
          num_outputs: 1,
          aspect_ratio: aspectRatio,
          output_format: "webp",
          output_quality: 90
        }
      });
    }
    // Flux Pro - Mayor calidad
    else if (modelo === 'flux-pro') {
      output = await replicate.run("black-forest-labs/flux-1.1-pro", {
        input: {
          prompt: promptFinal,
          aspect_ratio: aspectRatio,
          output_format: "webp",
          output_quality: 90,
          safety_tolerance: 2
        }
      });
    }
    // Flux Dev - Balance calidad/velocidad
    else if (modelo === 'flux-dev') {
      output = await replicate.run("black-forest-labs/flux-dev", {
        input: {
          prompt: promptFinal,
          aspect_ratio: aspectRatio,
          output_format: "webp",
          output_quality: 90,
          guidance: 3.5,
          num_inference_steps: 28
        }
      });
    }
    // SDXL - Versatil
    else if (modelo === 'sdxl') {
      const [width, height] = aspectRatio === '16:9' ? [1344, 768] :
                              aspectRatio === '1:1' ? [1024, 1024] :
                              aspectRatio === '9:16' ? [768, 1344] : [1344, 768];

      output = await replicate.run(
        "stability-ai/sdxl:7762fd07cf82c948538e41f63f77d685e02b063e37e496e96eefd46c929f9bdc",
        {
          input: {
            prompt: promptFinal,
            negative_prompt: NEGATIVE_PROMPT,
            width,
            height,
            num_inference_steps: 30,
            guidance_scale: 7.5
          }
        }
      );
    }
    // Default: Flux Schnell
    else {
      output = await replicate.run("black-forest-labs/flux-schnell", {
        input: {
          prompt: promptFinal,
          num_outputs: 1,
          aspect_ratio: aspectRatio
        }
      });
    }

    // Extraer URL del output
    let url;
    if (Array.isArray(output)) {
      const first = output[0];
      url = typeof first === 'string' ? first :
            first?.url ? (typeof first.url === 'function' ? first.url() : first.url) :
            first?.toString ? first.toString() : null;
    } else if (typeof output === 'string') {
      url = output;
    } else if (output?.url) {
      url = typeof output.url === 'function' ? output.url() : output.url;
    }

    if (!url || url === '[object Object]') {
      throw new Error('No se pudo obtener URL de la imagen generada');
    }

    return {
      success: true,
      url,
      modelo,
      prompt: promptFinal
    };

  } catch (error) {
    console.error('[GENERADOR] Error Replicate:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// FUNCION ALTERNATIVA: GENERAR CON DALL-E (OpenAI)
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Genera una imagen usando DALL-E 3
 * @param {Object} opciones - Opciones de generacion
 * @param {string} opciones.prompt - Descripcion
 * @param {string} [opciones.tamanio='1792x1024'] - Tamanio
 * @param {string} [opciones.calidad='standard'] - Calidad (standard/hd)
 * @returns {Promise<{success: boolean, url?: string, error?: string}>}
 */
export async function generarConDallE(opciones) {
  const {
    prompt,
    tamanio = '1792x1024',
    calidad = 'standard'
  } = opciones;

  if (!process.env.OPENAI_API_KEY) {
    return {
      success: false,
      error: 'OPENAI_API_KEY no configurada'
    };
  }

  try {
    const promptFinal = `${prompt}, ${ESTILO_BASE_DUENDES}, ${CALIDAD_ALTA}`;

    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'dall-e-3',
        prompt: promptFinal,
        n: 1,
        size: tamanio,
        quality: calidad,
        style: 'vivid'
      })
    });

    const data = await response.json();

    if (data.error) {
      return {
        success: false,
        error: data.error.message || 'Error de OpenAI'
      };
    }

    if (data.data?.[0]?.url) {
      return {
        success: true,
        url: data.data[0].url,
        promptRevisado: data.data[0].revised_prompt,
        modelo: 'dall-e-3'
      };
    }

    return {
      success: false,
      error: 'No se genero imagen'
    };

  } catch (error) {
    console.error('[GENERADOR] Error DALL-E:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// FUNCIONES ESPECIALIZADAS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Genera imagen para un Duende/Guardian
 * @param {Object} duende - Datos del duende
 * @param {string} duende.nombre - Nombre del guardian
 * @param {string} [duende.descripcion] - Descripcion
 * @param {string} [duende.categoria] - Categoria (Proteccion, Abundancia, etc)
 * @param {string} [duende.elemento] - Elemento (tierra, agua, fuego, aire)
 * @param {string[]} [duende.cristales] - Cristales asociados
 * @param {Object} [opciones] - Opciones adicionales
 * @returns {Promise<{success: boolean, url?: string, error?: string}>}
 */
export async function generarImagenDuende(duende, opciones = {}) {
  const {
    nombre,
    descripcion = '',
    categoria = 'Proteccion',
    elemento = 'tierra',
    cristales = []
  } = duende;

  const {
    api = 'replicate', // 'replicate' o 'openai'
    modelo = 'flux-schnell',
    aspectRatio = '1:1'
  } = opciones;

  // Construir prompt personalizado
  const basePrompt = PROMPTS_TIPO.duende.base;
  const elementoMod = PROMPTS_TIPO.duende.elementos[elemento] || PROMPTS_TIPO.duende.elementos.tierra;
  const categoriaMod = PROMPTS_TIPO.duende.categorias[categoria] || '';
  const cristalesMod = cristales.length > 0 ? `with ${cristales.join(', ')} crystals nearby` : '';

  const prompt = `
    A magical guardian spirit named "${nombre}",
    ${descripcion ? descripcion + ',' : ''}
    ${basePrompt},
    ${elementoMod},
    ${categoriaMod},
    ${cristalesMod}
  `.trim().replace(/\s+/g, ' ');

  console.log(`[GENERADOR] Generando imagen para duende: ${nombre}`);

  if (api === 'openai') {
    return generarConDallE({ prompt, tamanio: aspectRatio === '1:1' ? '1024x1024' : '1792x1024' });
  }

  return generarConReplicate({ prompt, modelo, aspectRatio });
}

/**
 * Genera imagen para contenido (ensenanza, ritual, etc)
 * @param {Object} contenido - Datos del contenido
 * @param {string} contenido.tipo - Tipo: ritual, ensenanza, meditacion, ejercicio
 * @param {string} contenido.titulo - Titulo del contenido
 * @param {string} [contenido.descripcion] - Descripcion adicional
 * @param {string} [contenido.duende] - Nombre del duende asociado
 * @param {Object} [opciones] - Opciones adicionales
 * @returns {Promise<{success: boolean, url?: string, error?: string}>}
 */
export async function generarImagenContenido(contenido, opciones = {}) {
  const {
    tipo = 'ensenanza',
    titulo,
    descripcion = '',
    duende = null
  } = contenido;

  const {
    api = 'replicate',
    modelo = 'flux-schnell',
    aspectRatio = '16:9'
  } = opciones;

  const basePrompt = PROMPTS_TIPO.contenido[tipo] || PROMPTS_TIPO.contenido.ensenanza;
  const duendeMod = duende ? `with guardian spirit "${duende}" present,` : '';

  const prompt = `
    ${basePrompt},
    representing "${titulo}",
    ${descripcion ? descripcion + ',' : ''}
    ${duendeMod}
    mystical and inviting atmosphere
  `.trim().replace(/\s+/g, ' ');

  console.log(`[GENERADOR] Generando imagen para contenido: ${titulo} (${tipo})`);

  if (api === 'openai') {
    return generarConDallE({ prompt, tamanio: '1792x1024' });
  }

  return generarConReplicate({ prompt, modelo, aspectRatio });
}

/**
 * Genera imagen de portada para un curso
 * @param {Object} curso - Datos del curso
 * @param {string} curso.nombre - Nombre del curso
 * @param {string} curso.descripcion - Descripcion
 * @param {string} [curso.portal] - Portal (litha, mabon, yule, ostara)
 * @param {string} [curso.categoria] - Categoria principal
 * @param {Object} [opciones] - Opciones adicionales
 * @returns {Promise<{success: boolean, url?: string, error?: string}>}
 */
export async function generarImagenCurso(curso, opciones = {}) {
  const {
    nombre,
    descripcion = '',
    portal = 'litha',
    categoria = null
  } = curso;

  const {
    api = 'replicate',
    modelo = 'flux-pro', // Usar mejor modelo para portadas
    aspectRatio = '16:9'
  } = opciones;

  const portalColores = {
    litha: 'warm golden and orange tones, summer energy, abundant light',
    mabon: 'autumn colors, harvest gold and deep red, grateful atmosphere',
    yule: 'winter blues and silvers, introspective mood, quiet magic',
    ostara: 'spring greens and pastels, new beginnings, fresh energy'
  };

  const categoriaMod = categoria && PROMPTS_TIPO.duende.categorias[categoria]
    ? PROMPTS_TIPO.duende.categorias[categoria]
    : '';

  const prompt = `
    ${PROMPTS_TIPO.curso.portada},
    for magical course "${nombre}",
    ${descripcion ? descripcion + ',' : ''}
    ${portalColores[portal] || portalColores.litha},
    ${categoriaMod},
    elegant and mystical design
  `.trim().replace(/\s+/g, ' ');

  console.log(`[GENERADOR] Generando portada para curso: ${nombre}`);

  if (api === 'openai') {
    return generarConDallE({ prompt, tamanio: '1792x1024', calidad: 'hd' });
  }

  return generarConReplicate({ prompt, modelo, aspectRatio });
}

/**
 * Genera imagen de banner para Duende de la Semana
 * @param {Object} duende - Datos del duende
 * @param {Object} [opciones] - Opciones adicionales
 * @returns {Promise<{success: boolean, url?: string, error?: string}>}
 */
export async function generarBannerDuendeSemana(duende, opciones = {}) {
  const {
    nombre,
    descripcion = '',
    categoria = 'Proteccion',
    proposito = ''
  } = duende;

  const {
    api = 'replicate',
    modelo = 'flux-schnell',
    aspectRatio = '16:9'
  } = opciones;

  const categoriaMod = PROMPTS_TIPO.duende.categorias[categoria] || '';

  const prompt = `
    ${PROMPTS_TIPO.semana.banner},
    featuring "${nombre}" the magical guardian,
    ${descripcion ? descripcion + ',' : ''}
    ${categoriaMod},
    ${proposito ? `embodying ${proposito},` : ''}
    spotlight effect, celebratory magical atmosphere,
    welcoming and mystical
  `.trim().replace(/\s+/g, ' ');

  console.log(`[GENERADOR] Generando banner Duende de la Semana: ${nombre}`);

  if (api === 'openai') {
    return generarConDallE({ prompt, tamanio: '1792x1024' });
  }

  return generarConReplicate({ prompt, modelo, aspectRatio });
}

// ═══════════════════════════════════════════════════════════════════════════════
// FUNCION GENERICA
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Genera cualquier tipo de imagen con prompt personalizado
 * @param {Object} params - Parametros
 * @param {string} params.tipo - Tipo: duende, contenido, curso, semana, custom
 * @param {Object} params.datos - Datos especificos del tipo
 * @param {string} [params.api='replicate'] - API a usar
 * @param {string} [params.modelo] - Modelo especifico
 * @param {string} [params.aspectRatio='16:9'] - Aspect ratio
 * @returns {Promise<{success: boolean, url?: string, error?: string}>}
 */
export async function generarImagen(params) {
  const {
    tipo,
    datos,
    api = 'replicate',
    modelo,
    aspectRatio = '16:9'
  } = params;

  const opciones = { api, modelo, aspectRatio };

  switch (tipo) {
    case 'duende':
      return generarImagenDuende(datos, opciones);

    case 'contenido':
      return generarImagenContenido(datos, opciones);

    case 'curso':
      return generarImagenCurso(datos, opciones);

    case 'semana':
    case 'duende-semana':
      return generarBannerDuendeSemana(datos, opciones);

    case 'custom':
      if (api === 'openai') {
        return generarConDallE({
          prompt: datos.prompt,
          tamanio: datos.tamanio || '1792x1024',
          calidad: datos.calidad || 'standard'
        });
      }
      return generarConReplicate({
        prompt: datos.prompt,
        modelo: modelo || 'flux-schnell',
        aspectRatio
      });

    default:
      return {
        success: false,
        error: `Tipo no reconocido: ${tipo}`
      };
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// UTILIDADES
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Verifica que APIs estan configuradas
 */
export function verificarConfiguracion() {
  return {
    replicate: !!process.env.REPLICATE_API_TOKEN,
    openai: !!process.env.OPENAI_API_KEY,
    gemini: !!process.env.GEMINI_API_KEY,
    preferida: process.env.REPLICATE_API_TOKEN ? 'replicate' :
               process.env.OPENAI_API_KEY ? 'openai' : null
  };
}

/**
 * Lista de modelos disponibles
 */
export const MODELOS_DISPONIBLES = {
  replicate: [
    { id: 'flux-schnell', nombre: 'Flux Schnell', descripcion: 'Rapido y economico, ideal para pruebas', costo: '$' },
    { id: 'flux-dev', nombre: 'Flux Dev', descripcion: 'Balance calidad/velocidad', costo: '$$' },
    { id: 'flux-pro', nombre: 'Flux Pro', descripcion: 'Mayor calidad, ideal para portadas', costo: '$$$' },
    { id: 'sdxl', nombre: 'Stable Diffusion XL', descripcion: 'Versatil, bueno para fantasia', costo: '$$' }
  ],
  openai: [
    { id: 'dall-e-3', nombre: 'DALL-E 3', descripcion: 'Alta calidad, mas costoso', costo: '$$$' }
  ]
};

export default {
  generarImagen,
  generarImagenDuende,
  generarImagenContenido,
  generarImagenCurso,
  generarBannerDuendeSemana,
  generarConReplicate,
  generarConDallE,
  verificarConfiguracion,
  MODELOS_DISPONIBLES,
  PROMPTS_TIPO
};
