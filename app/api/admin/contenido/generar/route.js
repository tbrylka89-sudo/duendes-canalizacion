export const dynamic = 'force-dynamic';
export const maxDuration = 120;

import { kv } from '@vercel/kv';
import { infoDiaActual } from '@/lib/ciclos-naturales';

// ═══════════════════════════════════════════════════════════════
// SISTEMA DE GENERACIÓN DE CONTENIDO - DUENDES DEL URUGUAY
// Basado en CLAUDE.md - Escritura emocional, NUNCA genérica
// Integrado con Duende de la Semana y ciclos naturales
// ═══════════════════════════════════════════════════════════════

const SYSTEM_PROMPT_BASE = `Sos Thibisay, la voz de Duendes del Uruguay. Escribís en español rioplatense (vos, tenés, podés, querés).

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
  articulo: `Escribí un artículo que enseñe algo real y útil.
No es un ensayo académico ni un texto motivacional genérico.
Es una conversación donde compartís sabiduría práctica.
La persona debe terminar de leer sabiendo HACER algo nuevo o VIENDO algo diferente.`,

  ritual: `Creá un ritual que la persona pueda hacer ESTA NOCHE con cosas que tiene en su casa.
Nada de ingredientes imposibles de conseguir.
Explicá el POR QUÉ de cada paso, no solo el cómo.
Que sienta que vos misma lo hacés regularmente.`,

  meditacion: `Escribí una meditación guiada que se pueda leer en voz alta o grabar.
Ritmo pausado, frases cortas.
Guía sensorial específica (no "sentí la energía", sino "notá el peso de tus manos sobre tus piernas").
Un viaje con inicio, transformación y cierre.`,

  historia: `Contá una historia de duendes que se sienta REAL.
No un cuento infantil ni una leyenda genérica.
Una historia con personaje, conflicto, transformación.
Que transmita una verdad profunda sin ser moraleja obvia.`,

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

export async function POST(request) {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  // Test mode
  const url = new URL(request.url);
  if (url.searchParams.get('test') === '1') {
    return Response.json({ success: true, test: true, hasApiKey: !!apiKey });
  }

  if (!apiKey) {
    return Response.json({ success: false, error: 'API key no configurada' }, { status: 500 });
  }

  try {
    const body = await request.json();
    const {
      tema,
      palabras = 1500,
      categoria = 'general',
      tipo = 'articulo',
      instruccionesExtra = '',
      tono = 'normal', // normal, intimo, energetico, serio
      audiencia = 'general', // general, principiante, avanzado
      usarDuendeSemana = false,
      integrarLuna = false,
      integrarEstacion = false
    } = body;

    if (!tema) {
      return Response.json({ success: false, error: 'Tema requerido' }, { status: 400 });
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

    const userPrompt = `TEMA: "${tema}"

TIPO DE CONTENIDO: ${tipo}
${instruccionesTipo}

EXTENSIÓN: Aproximadamente ${palabras} palabras. No rellenes para llegar al número - si el tema se cubre bien en menos, está perfecto.

${instruccionesExtra ? `INSTRUCCIONES ADICIONALES: ${instruccionesExtra}` : ''}

RECORDÁ:
- Primera frase = impacto emocional (NO descriptiva)
- Cero frases de IA genérica
- Valor real en cada párrafo
- Que la persona se sienta vista y acompañada`;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
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
    const contenido = data.content?.[0]?.text || '';

    // Extraer título (primera línea con #)
    const tituloMatch = contenido.match(/^#\s+(.+)$/m);
    const titulo = tituloMatch ? tituloMatch[1].replace(/\*\*/g, '').trim() : tema;

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
          tema,
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
