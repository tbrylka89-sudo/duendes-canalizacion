export const dynamic = 'force-dynamic';
export const maxDuration = 120;

import { kv } from '@vercel/kv';
import { infoDiaActual } from '@/lib/ciclos-naturales';
import { GoogleGenerativeAI } from '@google/generative-ai';

// ═══════════════════════════════════════════════════════════════
// SISTEMA DE GENERACIÓN DE CONTENIDO - DUENDES DEL URUGUAY
// Basado en CLAUDE.md - Escritura emocional, NUNCA genérica
// Integrado con Duende de la Semana y ciclos naturales
// ═══════════════════════════════════════════════════════════════

const SYSTEM_PROMPT_BASE = `Sos parte del equipo de Duendes del Uruguay. Escribís en español rioplatense (vos, tenés, podés, querés).

## TU ESTILO DE ESCRITURA - REGLAS INQUEBRANTABLES

### PROHIBIDO (nunca uses estas frases o similares):
- "En lo profundo del bosque..."
- "Las brumas del otoño..."
- "Un manto de estrellas..."
- "La danza de las hojas..."
- "El susurro del viento ancestral..."
- "Desde tiempos inmemoriales..."
- "El velo entre los mundos..."
- "La magia ancestral que fluye..."
- Cualquier frase que suene a "texto de IA místico genérico"

### OBLIGATORIO:
1. **Primera frase = impacto emocional directo**
   - Empezá con algo que la persona SIENTA
   - Conectá con una experiencia real, no con atmósfera decorativa

2. **Escribí desde la experiencia vivida**
   - Como si le hablaras a una amiga tomando mate
   - Anécdotas que se sientan reales
   - Detalles específicos, no abstracciones bonitas

3. **Cada párrafo debe aportar VALOR REAL**
   - Algo que la persona pueda aplicar HOY
   - Una perspectiva nueva sobre algo que ya sabía
   - Una verdad incómoda dicha con amor

4. **Tono: cálida pero no cursi, sabia pero no pedante**
   - Podés ser directa, incluso confrontar con cariño
   - Humor sutil cuando viene natural
   - Vulnerabilidad real, no actuada

### FORMATO:
- Usá markdown: # para título principal, ## para secciones
- NO uses ### ni #### innecesarios
- NO abuses de *cursivas* decorativas
- NO listas con bullets para contenido emocional
- Párrafos cortos, respiran
- Puntos suspensivos... para pausas naturales (con moderación)

### VERIFICACIÓN ANTES DE ENTREGAR:
- ¿La primera frase genera impacto emocional?
- ¿Evité TODAS las frases prohibidas?
- ¿Suena como algo que diría un humano de corazón?
- ¿Hay especificidad o solo generalidades bonitas?
- ¿La persona se va a sentir VISTA, no solo leída?`;

// Prompts específicos por tipo de contenido
const PROMPTS_POR_TIPO = {
  mensaje: `Escribí un mensaje del día que conecte directamente con el corazón.
No es un horóscopo ni una frase motivacional vacía.
Algo que la persona pueda llevarse y aplicar HOY.
Primera frase: golpe emocional. Última frase: esperanza activa.`,

  articulo: `Escribí un artículo que enseñe algo real y útil.
No es un ensayo académico ni un texto motivacional genérico.
Es una conversación donde compartís sabiduría práctica.
La persona debe terminar de leer sabiendo HACER algo nuevo o VIENDO algo diferente.`,

  ritual: `Creá un ritual que la persona pueda hacer ESTA NOCHE con cosas que tiene en su casa.
Nada de ingredientes imposibles de conseguir.
Explicá el POR QUÉ de cada paso, no solo el cómo.
Que sienta que vos misma lo hacés regularmente.
ESTRUCTURA: Intención → Preparación → Pasos numerados → Cierre → Variaciones opcionales`,

  meditacion: `Escribí una meditación guiada que se pueda leer en voz alta o grabar.
Ritmo pausado, frases cortas.
Guía sensorial específica (no "sentí la energía", sino "notá el peso de tus manos sobre tus piernas").
Un viaje con inicio, transformación y cierre.
INCLUIR: Música/sonido sugerido, duración, momento ideal.`,

  curso: `Creá una lección estructurada con teoría y práctica.
Como una clase particular con una amiga.
Empezá por lo básico pero llegá a algo que sorprenda.
ESTRUCTURA: Introducción → Conceptos clave → Ejemplos → Ejercicio práctico → Resumen`,

  conocimiento: `Enseñá sobre este elemento/cristal/hierba/runa de forma completa.
Historia y origen, propiedades, usos prácticos, cuidados, combinaciones.
No solo información - CONEXIÓN personal con el elemento.
ESTRUCTURA: Presentación → Propiedades → Cómo usarlo → Meditación/Ritual corto`,

  historia: `Contá una historia de duendes que se sienta REAL.
No un cuento infantil ni una leyenda genérica.
Una historia con personaje, conflicto, transformación.
Que transmita una verdad profunda sin ser moraleja obvia.
ESTRUCTURA: Inicio envolvente → Desarrollo → Momento de quiebre → Resolución → Eco en el presente`,

  guia: `Creá una guía práctica paso a paso.
Lenguaje claro, instrucciones precisas.
Anticipá las dudas que va a tener la persona.
Incluí tips de tu experiencia personal.`,

  reflexion: `Escribí una reflexión profunda sobre el tema.
No filosofía abstracta - conectá con situaciones reales de la vida.
Hacé preguntas que incomoden (en el buen sentido).
Dejá espacio para que la persona saque sus propias conclusiones.`,

  ensenanza: `Enseñá algo específico sobre el tema.
Como una clase particular con una amiga.
Empezá por lo básico pero llegá a algo que sorprenda.
Incluí ejemplos concretos de tu práctica.`
};

// Función para construir prompt específico según campos del form
function construirPromptDesdeCampos(tipo, camposForm) {
  const prompts = {
    mensaje: () => {
      const { tema, enfoque, intencion } = camposForm;
      return `
TEMA DEL MENSAJE: ${tema || 'Inspiración general'}
ENFOQUE: ${enfoque || 'reflexivo'}
INTENCIÓN: ${intencion || 'Que la persona sienta paz y claridad'}

Escribí un mensaje del día con este enfoque específico.`;
    },

    meditacion: () => {
      const { duracion, objetivo, elementos, musica } = camposForm;
      return `
DURACIÓN: ${duracion || '10 minutos'}
OBJETIVO: ${objetivo || 'Relajación profunda'}
ELEMENTOS VISUALES: ${elementos || 'Naturaleza, luz, agua'}
MÚSICA SUGERIDA: ${musica || 'Sonidos suaves de naturaleza'}

Escribí una meditación guiada completa con estas especificaciones.
INCLUÍ al principio: Duración, música recomendada, momento ideal.
Al final: sugerencia de journaling post-meditación.`;
    },

    ritual: () => {
      const { proposito, materiales, momento, nivel } = camposForm;
      return `
PROPÓSITO DEL RITUAL: ${proposito || 'Limpieza energética'}
MATERIALES: ${materiales || 'Lo que tenga en casa'}
MEJOR MOMENTO: ${momento || 'Cuando sienta la necesidad'}
NIVEL: ${nivel || 'Principiante'}

Creá un ritual completo con estos parámetros.
Si los materiales son específicos, ofrecé alternativas accesibles.
INCLUÍ: Por qué funciona, variaciones para otros propósitos.`;
    },

    curso: () => {
      const { tema_curso, nivel, objetivos, incluirEjercicio } = camposForm;
      return `
TEMA DE LA LECCIÓN: ${tema_curso || 'Introducción'}
NIVEL: ${nivel || 'Principiante'}
OBJETIVOS DE APRENDIZAJE: ${objetivos || 'Comprender los fundamentos'}
${incluirEjercicio ? 'INCLUIR: Ejercicio práctico al final' : ''}

Creá una lección educativa estructurada.
ESTRUCTURA: Introducción enganchadora → Concepto 1 → Concepto 2 → Aplicación → Resumen → (Ejercicio si aplica)`;
    },

    conocimiento: () => {
      const { subtipo, elemento, propiedades, usos } = camposForm;
      return `
TIPO: ${subtipo || 'Cristal'}
ELEMENTO ESPECÍFICO: ${elemento || 'A tu elección'}
PROPIEDADES A DESTACAR: ${propiedades || 'Las principales'}
USOS PRÁCTICOS: ${usos || 'Los más comunes y algunos sorprendentes'}

Creá un artículo de conocimiento profundo sobre este elemento.
INCLUÍ: Historia/origen, propiedades energéticas, cómo usarlo, cuidados, combinaciones, un mini-ritual o meditación con él.`;
    },

    historia: () => {
      const { tipo_historia, moraleja, personajes, ambientacion } = camposForm;
      return `
TIPO DE HISTORIA: ${tipo_historia || 'Cuento de duendes'}
MORALEJA/ENSEÑANZA: ${moraleja || 'A tu elección'}
PERSONAJES: ${personajes || 'Un duende sabio como protagonista'}
AMBIENTACIÓN: ${ambientacion || 'Bosque encantado'}

Contá una historia cautivadora con estos elementos.
Que la moraleja emerja naturalmente, sin explicitarla de forma obvia.`;
    }
  };

  const constructor = prompts[tipo];
  return constructor ? constructor() : '';
}

// Categorías con contexto
const CONTEXTO_CATEGORIAS = {
  duendes: `El mundo de los duendes es tu especialidad. Conocés sus tipos, sus personalidades, cómo conectar con ellos. No son personajes de cuento - son energías reales con las que trabajás.`,

  luna: `Las fases lunares son parte de tu vida diaria. Sabés cómo cada fase afecta las emociones, la energía, los rituales. Compartí desde tu experiencia directa.`,

  cristales: `Los cristales son aliados que usás a diario. Conocés sus propiedades no de libro sino de uso. Sabés cuáles recomendar para cada situación real.`,

  tarot: `El tarot es una herramienta de autoconocimiento que usás hace años. No predecís el futuro - ayudás a ver el presente con claridad.`,

  rituales: `Los rituales son parte de tu práctica. No son ceremonias complicadas - son momentos de intención consciente que cualquiera puede hacer.`,

  sanacion: `La sanación energética es tu camino. Sabés que no reemplaza la medicina pero complementa el bienestar. Enfoque práctico y responsable.`,

  abundancia: `La abundancia es un tema que trabajaste personalmente. No hablás de "atraer dinero mágicamente" - hablás de merecimiento, bloqueos, y acción alineada.`,

  proteccion: `La protección energética es algo que practicás y enseñás. Técnicas simples, efectivas, que cualquiera puede usar en su día a día.`,

  ancestros: `La conexión con ancestros es profunda y personal. Sabés que no es solo genealogía - es sanar heridas heredadas y recibir guía.`,

  elementos: `Los cuatro elementos (y el éter) son la base de tu práctica. Sabés cómo cada persona resuena con diferentes elementos y cómo equilibrarlos.`,

  general: `Contenido espiritual y místico en general. Siempre con los pies en la tierra, siempre aplicable a la vida real.`
};

// Función para generar con Gemini
async function generarConGemini(systemPrompt, userPrompt) {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

  const fullPrompt = `${systemPrompt}\n\n---\n\n${userPrompt}`;

  const result = await model.generateContent({
    contents: [{ role: 'user', parts: [{ text: fullPrompt }] }],
    generationConfig: {
      temperature: 0.8,
      maxOutputTokens: 8000,
    }
  });

  return result.response.text();
}

export async function POST(request) {
  // Test mode
  const url = new URL(request.url);
  if (url.searchParams.get('test') === '1') {
    return Response.json({
      success: true,
      test: true,
      hasAnthropicKey: !!process.env.ANTHROPIC_API_KEY,
      hasGeminiKey: !!process.env.GEMINI_API_KEY
    });
  }

  // Verificar que al menos una API key exista
  if (!process.env.ANTHROPIC_API_KEY && !process.env.GEMINI_API_KEY) {
    return Response.json({ success: false, error: 'No hay API keys configuradas' }, { status: 500 });
  }

  try {
    const body = await request.json();
    const {
      // Nuevo formato con campos dinámicos
      tipo = 'mensaje',
      tipoNombre = '',
      promptBase = '',
      camposForm = {},
      // O formato legacy
      tema,
      palabras = 1500,
      categoria = 'general',
      instruccionesExtra = '',
      tono = 'normal',
      audiencia = 'general',
      usarDuendeSemana = false,
      integrarLuna = false,
      integrarEstacion = false,
      // NUEVO: elegir modelo (claude o gemini)
      modelo = 'claude' // 'claude' | 'gemini'
    } = body;

    // Determinar qué modelo usar
    let modeloFinal = modelo;
    if (modelo === 'gemini' && !process.env.GEMINI_API_KEY) {
      console.log('[GENERAR] Gemini solicitado pero no hay API key, usando Claude');
      modeloFinal = 'claude';
    }
    if (modelo === 'claude' && !process.env.ANTHROPIC_API_KEY) {
      console.log('[GENERAR] Claude solicitado pero no hay API key, usando Gemini');
      modeloFinal = 'gemini';
    }

    // Extraer tema de camposForm si existe, o usar tema legacy
    const temaFinal = camposForm.tema || camposForm.tema_curso || camposForm.objetivo ||
                      camposForm.proposito || camposForm.elemento || tema;

    if (!temaFinal && Object.keys(camposForm).length === 0) {
      return Response.json({ success: false, error: 'Completá al menos un campo del formulario' }, { status: 400 });
    }

    // Construir contexto de categoría
    const contextoCategoria = CONTEXTO_CATEGORIAS[categoria] || CONTEXTO_CATEGORIAS.general;

    // Construir instrucciones de tipo
    const instruccionesTipo = PROMPTS_POR_TIPO[tipo] || PROMPTS_POR_TIPO.articulo;

    // Integración con Duende de la Semana
    let contextoDuende = '';
    let duendeSemana = null;
    if (usarDuendeSemana) {
      duendeSemana = await kv.get('duende-semana-actual');
      if (duendeSemana) {
        const personalidad = duendeSemana.personalidadGenerada || {};
        contextoDuende = `

## ESCRIBE COMO ${duendeSemana.nombre.toUpperCase()}
Este contenido es narrado por ${duendeSemana.nombre}, el Duende de la Semana.
- Manera de hablar: ${personalidad.manera_de_hablar || 'Cálida y sabia'}
- Temas que le apasionan: ${personalidad.temas_favoritos?.join(', ') || 'naturaleza, cristales'}
- Frase característica: "${personalidad.frase_caracteristica || ''}"
- Cómo da consejos: ${personalidad.como_da_consejos || 'Con metáforas de la naturaleza'}
- Despedida: "${personalidad.despedida || 'Hasta pronto'}"
- Tono predominante: ${personalidad.tono_emocional || 'Esperanzador'}

El contenido debe sentirse escrito por ${duendeSemana.nombre}, con su voz única.
Usa su frase característica al menos una vez de forma natural.
Cierra con su despedida personal.`;
      }
    }

    // Integración con fases lunares y estaciones celtas
    let contextoNatural = '';
    let infoHoy = null;
    if (integrarLuna || integrarEstacion) {
      try {
        infoHoy = infoDiaActual();

        if (integrarLuna && infoHoy.faseLunar) {
          const luna = infoHoy.faseLunar;
          contextoNatural += `

## FASE LUNAR: ${luna.datos.nombre} ${luna.datos.icono}
- Energía actual: ${luna.datos.energia}
- Actividades afines: ${luna.datos.actividades.join(', ')}
Integra sutilmente esta energía lunar en el contenido si es apropiado.`;
        }

        if (integrarEstacion) {
          if (infoHoy.celebracionActual) {
            const celeb = infoHoy.celebracionActual.datos;
            contextoNatural += `

## CELEBRACIÓN CELTA EN CURSO: ${celeb.nombre}
- Significado: ${celeb.significado}
- ${celeb.descripcion}
El contenido puede celebrar este momento especial del año.`;
          } else if (infoHoy.celebracionProxima?.esCercana) {
            const celeb = infoHoy.celebracionProxima.datos;
            contextoNatural += `

## CELEBRACIÓN CERCANA: ${celeb.nombre} (en ${infoHoy.celebracionProxima.diasRestantes} días)
- Significado: ${celeb.significado}
Menciona la preparación para ${celeb.nombre} si es apropiado.`;
          }
        }
      } catch (e) {
        console.error('Error obteniendo info de ciclos:', e);
      }
    }

    // Ajustes de tono
    const ajusteTono = {
      normal: '',
      intimo: 'Escribí como si fuera un mensaje personal, muy cercano. Como una carta a alguien que querés.',
      energetico: 'El tono es más dinámico, motivador pero sin ser "coach". Energía alta pero genuina.',
      serio: 'Tema delicado, tratalo con la profundidad que merece. Sin frivolidad pero sin ser pesado.'
    }[tono] || '';

    // Ajustes de audiencia
    const ajusteAudiencia = {
      general: '',
      principiante: 'La persona es nueva en esto. Explicá todo sin asumir conocimiento previo. Nada de jerga esotérica sin explicar.',
      avanzado: 'La persona ya tiene camino recorrido. Podés ir más profundo, referencias más específicas, menos explicaciones básicas.'
    }[audiencia] || '';

    const systemPrompt = `${SYSTEM_PROMPT_BASE}

## CONTEXTO DE ESTA PIEZA:
${contextoCategoria}
${contextoDuende}
${contextoNatural}

${ajusteTono}
${ajusteAudiencia}`;

    // Construir prompt específico si tenemos campos del form
    const promptEspecifico = Object.keys(camposForm).length > 0
      ? construirPromptDesdeCampos(tipo, camposForm)
      : `TEMA: "${temaFinal}"`;

    const userPrompt = `${promptEspecifico}

TIPO DE CONTENIDO: ${tipoNombre || tipo}
${instruccionesTipo}

EXTENSIÓN: Aproximadamente ${palabras} palabras. No rellenes para llegar al número - si el tema se cubre bien en menos, está perfecto.

${instruccionesExtra ? `INSTRUCCIONES ADICIONALES: ${instruccionesExtra}` : ''}

RECORDÁ:
- Primera frase = impacto emocional (NO descriptiva)
- Cero frases de IA genérica
- Valor real en cada párrafo
- Que la persona se sienta vista y acompañada`;

    let contenido = '';

    // GENERAR CON GEMINI
    if (modeloFinal === 'gemini') {
      console.log('[GENERAR] Usando Gemini...');
      try {
        contenido = await generarConGemini(systemPrompt, userPrompt);
      } catch (geminiError) {
        console.error('[GENERAR] Error Gemini:', geminiError);
        // Fallback a Claude si falla
        if (process.env.ANTHROPIC_API_KEY) {
          console.log('[GENERAR] Fallback a Claude...');
          modeloFinal = 'claude';
        } else {
          throw geminiError;
        }
      }
    }

    // GENERAR CON CLAUDE
    if (modeloFinal === 'claude') {
      console.log('[GENERAR] Usando Claude...');
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 6000,
          system: systemPrompt,
          messages: [{ role: 'user', content: userPrompt }]
        })
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('Anthropic error:', response.status, errorData);
        return Response.json({
          success: false,
          error: `Error API: ${response.status}`
        }, { status: 500 });
      }

      const data = await response.json();
      contenido = data.content?.[0]?.text || '';
    }

    // Extraer título (primera línea con #)
    const tituloMatch = contenido.match(/^#\s+(.+)$/m);
    const titulo = tituloMatch ? tituloMatch[1].replace(/\*\*/g, '').trim() : temaFinal;

    // Contar palabras reales
    const palabrasReales = contenido.split(/\s+/).filter(w => w.length > 0).length;

    // Guardar en historial si hay duende
    if (duendeSemana) {
      try {
        const historial = await kv.get('contenido-historial') || [];
        historial.unshift({
          id: `contenido_${Date.now()}`,
          tipo,
          titulo,
          tema: temaFinal,
          duende: {
            id: duendeSemana.duendeId,
            nombre: duendeSemana.nombre,
            imagen: duendeSemana.imagen
          },
          faseLunar: infoHoy?.faseLunar?.fase,
          celebracion: infoHoy?.celebracionActual?.celebracion || infoHoy?.celebracionProxima?.celebracion,
          generadoEn: new Date().toISOString(),
          estado: 'borrador'
        });
        await kv.set('contenido-historial', historial.slice(0, 100));
      } catch (e) {
        console.error('Error guardando historial:', e);
      }
    }

    return Response.json({
      success: true,
      contenido,
      titulo,
      palabras: palabrasReales,
      categoria,
      tipo,
      tono,
      audiencia,
      modeloUsado: modeloFinal, // NUEVO: indicar qué modelo se usó
      duendeSemana: duendeSemana ? {
        nombre: duendeSemana.nombre,
        imagen: duendeSemana.imagen
      } : null,
      infoContextual: infoHoy ? {
        faseLunar: infoHoy.faseLunar,
        celebracion: infoHoy.celebracionProxima
      } : null
    });

  } catch (error) {
    console.error('Error:', error);
    return Response.json({
      success: false,
      error: error.message || 'Error desconocido'
    }, { status: 500 });
  }
}

// GET - Obtener opciones disponibles
export async function GET() {
  return Response.json({
    success: true,
    tipos: Object.keys(PROMPTS_POR_TIPO).map(id => ({
      id,
      nombre: id.charAt(0).toUpperCase() + id.slice(1)
    })),
    categorias: Object.keys(CONTEXTO_CATEGORIAS).map(id => ({
      id,
      nombre: id.charAt(0).toUpperCase() + id.slice(1)
    })),
    tonos: [
      { id: 'normal', nombre: 'Normal' },
      { id: 'intimo', nombre: 'Íntimo/Personal' },
      { id: 'energetico', nombre: 'Energético' },
      { id: 'serio', nombre: 'Serio/Profundo' }
    ],
    audiencias: [
      { id: 'general', nombre: 'General' },
      { id: 'principiante', nombre: 'Principiante' },
      { id: 'avanzado', nombre: 'Avanzado' }
    ]
  });
}
