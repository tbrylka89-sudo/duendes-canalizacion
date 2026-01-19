import { GoogleGenerativeAI } from '@google/generative-ai';
import Anthropic from '@anthropic-ai/sdk';

// ═══════════════════════════════════════════════════════════════════════════════
// API: GENERACIÓN DE CURSOS CON IA (Gemini o Claude)
// Genera cursos completos con módulos, lecciones y contenido
// ═══════════════════════════════════════════════════════════════════════════════

export const dynamic = 'force-dynamic';
export const maxDuration = 120;

// Prompt base para generar cursos mágicos
const SYSTEM_PROMPT = `Eres un creador de cursos espirituales para "Duendes del Uruguay", una plataforma mágica de conexión con guardianes espirituales.

REGLAS DE ESCRITURA:
- Escribe en español rioplatense (vos, tenés, podés)
- Tono cálido, místico pero accesible, nunca condescendiente
- Evita frases genéricas como "En lo profundo del bosque..." o "Desde tiempos inmemoriales..."
- Cada lección debe tener contenido PRÁCTICO y aplicable
- Incluí ejercicios, reflexiones y prácticas reales
- Los duendes son guardianes sabios, no personajes infantiles

FORMATO DE RESPUESTA (JSON válido):
{
  "titulo": "Nombre del Curso",
  "descripcion": "Descripción atractiva de 2-3 oraciones",
  "duracion": "4 semanas",
  "nivel": "principiante|intermedio|avanzado",
  "imagen_sugerida": "descripción para generar imagen con IA",
  "modulos": [
    {
      "numero": 1,
      "titulo": "Nombre del Módulo",
      "descripcion": "Qué aprenderá el alumno",
      "duende_profesor": {
        "nombre": "Nombre del Duende",
        "personalidad": "Breve descripción de su estilo de enseñanza"
      },
      "lecciones": [
        {
          "numero": 1,
          "titulo": "Nombre de la Lección",
          "duracion_minutos": 15,
          "contenido": "Texto completo de la lección (mínimo 500 palabras)",
          "ejercicio_practico": "Actividad para que el alumno practique",
          "reflexion": "Pregunta o punto de reflexión para el alumno"
        }
      ]
    }
  ],
  "badge": {
    "nombre": "Nombre del Badge",
    "icono": "emoji representativo",
    "descripcion": "Qué significa obtener este badge"
  }
}`;

function construirPromptCurso(tema, prompt, cantidadModulos, leccionesPorModulo, duendesDisponibles) {
  let instrucciones = prompt || '';

  // Estructura del curso
  instrucciones += `\n\nESTRUCTURA REQUERIDA:
- EXACTAMENTE ${cantidadModulos} módulos
- EXACTAMENTE ${leccionesPorModulo} lecciones por módulo
- Cada lección debe tener contenido de 300-500 palabras
- Total de lecciones: ${cantidadModulos * leccionesPorModulo}`;

  // Duendes disponibles
  if (duendesDisponibles && duendesDisponibles.length > 0) {
    instrucciones += `\n\nDUENDES DISPONIBLES PARA ASIGNAR COMO PROFESORES:
${duendesDisponibles.slice(0, 6).map(d => `- ${d.nombre}`).join('\n')}

IMPORTANTE: Usa EXACTAMENTE los nombres de estos duendes para "duende_profesor" en cada módulo.`;
  }

  instrucciones += `\n\nLAS LECCIONES DEBEN INCLUIR:
1. Introducción breve (50-100 palabras)
2. Desarrollo del tema principal (200-300 palabras)
3. Ejercicio práctico concreto
4. Reflexión con pregunta específica

REGLAS DE JSON:
- NO uses comillas dobles dentro de strings, usa comillas simples
- NO uses saltos de línea reales en los strings, usa espacios
- Asegurate de que el JSON sea válido y completo
- Cierra TODAS las llaves y corchetes correctamente`;

  return `${SYSTEM_PROMPT}\n\nGenera un curso completo sobre: ${tema}\n\n${instrucciones}\n\nIMPORTANTE: Responde SOLO con el JSON válido, sin texto adicional antes o después. Verificá que el JSON sea válido antes de responder.`;
}

async function generarConGemini(tema, prompt, cantidadModulos, leccionesPorModulo, duendesDisponibles) {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

  // Intentar con diferentes modelos de Gemini
  const modelosGemini = ['gemini-2.0-flash-exp', 'gemini-1.5-flash', 'gemini-pro'];
  let model;
  let modeloUsado;

  for (const nombreModelo of modelosGemini) {
    try {
      model = genAI.getGenerativeModel({ model: nombreModelo });
      modeloUsado = nombreModelo;
      break;
    } catch (e) {
      console.log(`[CURSOS-IA] Modelo ${nombreModelo} no disponible, probando siguiente...`);
    }
  }

  if (!model) throw new Error('Ningún modelo de Gemini disponible');

  const promptFinal = construirPromptCurso(tema, prompt, cantidadModulos, leccionesPorModulo, duendesDisponibles);

  const result = await model.generateContent({
    contents: [{ role: 'user', parts: [{ text: promptFinal }] }],
    generationConfig: {
      temperature: 0.8,
      maxOutputTokens: 16000,
    }
  });

  const response = result.response.text();
  return parseJSONResponse(response);
}

async function generarConClaude(tema, prompt, cantidadModulos, leccionesPorModulo, duendesDisponibles) {
  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const promptFinal = construirPromptCurso(tema, prompt, cantidadModulos, leccionesPorModulo, duendesDisponibles);

  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 16000,
    messages: [{
      role: 'user',
      content: promptFinal
    }]
  });

  const response = message.content[0].text;
  return parseJSONResponse(response);
}

// Función robusta para parsear JSON de respuestas de IA
function parseJSONResponse(response) {
  // Intentar extraer JSON
  const jsonMatch = response.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error('No se pudo extraer JSON de la respuesta');

  let jsonStr = jsonMatch[0];

  // Intentar parsear directamente
  try {
    return JSON.parse(jsonStr);
  } catch (e) {
    console.log('[CURSOS-IA] JSON inválido, intentando reparar...');
  }

  // Intentar reparar JSON común:
  // 1. Remover trailing commas
  jsonStr = jsonStr.replace(/,(\s*[}\]])/g, '$1');

  // 2. Escapar caracteres problemáticos en strings
  jsonStr = jsonStr.replace(/:\s*"([^"]*?)"/g, (match, content) => {
    const escaped = content
      .replace(/\\/g, '\\\\')
      .replace(/\n/g, '\\n')
      .replace(/\r/g, '\\r')
      .replace(/\t/g, '\\t');
    return `: "${escaped}"`;
  });

  try {
    return JSON.parse(jsonStr);
  } catch (e2) {
    console.log('[CURSOS-IA] Segundo intento de reparación...');
  }

  // 3. Intentar truncar hasta el último cierre válido
  let lastValidClose = jsonStr.lastIndexOf('}');
  while (lastValidClose > 0) {
    const truncated = jsonStr.substring(0, lastValidClose + 1);
    try {
      // Balancear llaves
      const openBraces = (truncated.match(/\{/g) || []).length;
      const closeBraces = (truncated.match(/\}/g) || []).length;

      if (openBraces === closeBraces) {
        return JSON.parse(truncated);
      }
    } catch (e3) {
      // Seguir intentando
    }
    lastValidClose = jsonStr.lastIndexOf('}', lastValidClose - 1);
  }

  throw new Error('No se pudo parsear el JSON de la respuesta. Intentá con menos módulos/lecciones.');
}

export async function POST(request) {
  try {
    const {
      tema,
      prompt,
      preferirGemini = true,
      cantidadModulos = 5,
      leccionesPorModulo = 4,
      duendesDisponibles = []
    } = await request.json();

    if (!tema) {
      return Response.json({ success: false, error: 'Se requiere un tema para el curso' }, { status: 400 });
    }

    console.log(`[CURSOS-IA] Generando curso: ${tema} (${cantidadModulos} módulos x ${leccionesPorModulo} lecciones)`);

    let curso;
    let modeloUsado;

    // Intentar con Gemini primero si está configurado y se prefiere
    if (preferirGemini && process.env.GEMINI_API_KEY) {
      try {
        console.log('[CURSOS-IA] Generando con Gemini...');
        curso = await generarConGemini(tema, prompt, cantidadModulos, leccionesPorModulo, duendesDisponibles);
        modeloUsado = 'gemini-1.5-pro';
      } catch (geminiError) {
        console.error('[CURSOS-IA] Error Gemini:', geminiError.message);
        // Fallback a Claude
        if (process.env.ANTHROPIC_API_KEY) {
          console.log('[CURSOS-IA] Fallback a Claude...');
          curso = await generarConClaude(tema, prompt, cantidadModulos, leccionesPorModulo, duendesDisponibles);
          modeloUsado = 'claude-sonnet';
        } else {
          throw geminiError;
        }
      }
    }
    // Usar Claude si no hay Gemini o no se prefiere
    else if (process.env.ANTHROPIC_API_KEY) {
      console.log('[CURSOS-IA] Generando con Claude...');
      curso = await generarConClaude(tema, prompt, cantidadModulos, leccionesPorModulo, duendesDisponibles);
      modeloUsado = 'claude-sonnet';
    }
    else {
      return Response.json({
        success: false,
        error: 'No hay API keys configuradas. Agregá GEMINI_API_KEY o ANTHROPIC_API_KEY en las variables de entorno.'
      }, { status: 400 });
    }

    // Agregar metadatos
    curso.id = `curso_${Date.now()}`;
    curso.creado = new Date().toISOString();
    curso.estado = 'borrador';
    curso.generadoPor = modeloUsado;
    curso.totalLecciones = curso.modulos.reduce((acc, m) => acc + m.lecciones.length, 0);

    // Generar imágenes automáticamente para el curso
    console.log('[CURSOS-IA] Generando imágenes para el curso...');

    try {
      // Imagen principal del curso
      curso.imagen = await generarImagenCurso(curso.titulo, curso.descripcion, 'portada');
      console.log('[CURSOS-IA] Imagen de portada generada');

      // Imagen para cada módulo
      for (let i = 0; i < curso.modulos.length; i++) {
        const modulo = curso.modulos[i];
        modulo.imagen = await generarImagenCurso(modulo.titulo, curso.titulo, 'modulo');
        console.log(`[CURSOS-IA] Imagen módulo ${i + 1} generada`);

        // Imagen para algunas lecciones clave (primera y última de cada módulo)
        if (modulo.lecciones && modulo.lecciones.length > 0) {
          // Primera lección
          modulo.lecciones[0].imagen = await generarImagenCurso(
            modulo.lecciones[0].titulo,
            modulo.titulo,
            'leccion'
          );

          // Última lección si hay más de una
          if (modulo.lecciones.length > 1) {
            const ultima = modulo.lecciones.length - 1;
            modulo.lecciones[ultima].imagen = await generarImagenCurso(
              modulo.lecciones[ultima].titulo,
              modulo.titulo,
              'leccion'
            );
          }
        }

        // Pequeña pausa entre módulos para no saturar la API
        await new Promise(r => setTimeout(r, 1000));
      }

      console.log('[CURSOS-IA] Todas las imágenes generadas');
    } catch (imgError) {
      console.error('[CURSOS-IA] Error generando imágenes:', imgError.message);
      // El curso se genera igual aunque fallen las imágenes
    }

    return Response.json({
      success: true,
      curso,
      modeloUsado,
      mensaje: `Curso generado exitosamente con ${modeloUsado} + imágenes`
    });

  } catch (error) {
    console.error('[CURSOS-IA] Error:', error);
    return Response.json({
      success: false,
      error: error.message || 'Error generando curso'
    }, { status: 500 });
  }
}

// Generar imagen para curso/módulo/lección
async function generarImagenCurso(titulo, contexto, tipo) {
  const openaiKey = process.env.OPENAI_API_KEY;
  if (!openaiKey) {
    console.log('[CURSOS-IA] No hay OPENAI_API_KEY, saltando imagen');
    return null;
  }

  // Construir prompt según el tipo
  const estilosBase = {
    portada: 'epic fantasy book cover style, magical and mystical, dramatic lighting, professional illustration',
    modulo: 'enchanted forest scene, magical atmosphere, soft ethereal glow, fantasy art style',
    leccion: 'cozy magical study scene, crystals, candles, ancient books, warm lighting, detailed illustration'
  };

  const escenas = {
    portada: [
      'majestic enchanted forest gateway with glowing runes',
      'mystical crystal cave with aurora lights',
      'ancient magical tree of knowledge with glowing leaves',
      'ethereal fairy realm with floating islands'
    ],
    modulo: [
      'magical clearing in enchanted forest with mushroom circle',
      'cozy duende workshop with potions and crystals',
      'moonlit sacred grove with standing stones',
      'mystical waterfall with rainbow mist and fireflies',
      'enchanted garden with glowing flowers at dusk'
    ],
    leccion: [
      'open grimoire on wooden desk with candles and crystals',
      'meditation corner with cushions, incense and plants',
      'crystal altar with candles in forest setting',
      'herbalist table with dried flowers and bottles',
      'tarot cards spread on velvet cloth with moonlight'
    ]
  };

  const escenasDelTipo = escenas[tipo] || escenas.leccion;
  const escenaBase = escenasDelTipo[Math.floor(Math.random() * escenasDelTipo.length)];
  const estilo = estilosBase[tipo] || estilosBase.leccion;

  const prompt = `${escenaBase}, theme: "${titulo.slice(0, 60)}", context: "${contexto.slice(0, 40)}". ${estilo}. Duendes del Uruguay magical guardian aesthetic, no text, no letters, high quality, 4K.`;

  try {
    const res = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'dall-e-3',
        prompt: prompt,
        n: 1,
        size: tipo === 'portada' ? '1792x1024' : '1024x1024',
        quality: 'standard'
      })
    });

    const data = await res.json();

    if (data.data?.[0]?.url) {
      return data.data[0].url;
    }

    console.error('[CURSOS-IA] Error DALL-E:', data.error?.message || 'Sin URL');
    return null;
  } catch (error) {
    console.error('[CURSOS-IA] Error generando imagen:', error.message);
    return null;
  }
}
