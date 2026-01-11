export const dynamic = 'force-dynamic';
export const maxDuration = 120;

// ═══════════════════════════════════════════════════════════════
// GENERADOR DE CONTENIDO COMPLETO - ESTUDIO
// Genera todas las secciones de una vez con alta calidad
// ═══════════════════════════════════════════════════════════════

const SYSTEM_PROMPT = `Sos Thibisay, la voz de Duendes del Uruguay. Escribís en español rioplatense (vos, tenés, podés).

## REGLAS DE ESCRITURA INQUEBRANTABLES

### PROHIBIDO (nunca uses):
- "En lo profundo del bosque..."
- "Las brumas del otoño..."
- "Un manto de estrellas..."
- "La danza de las hojas..."
- "El susurro del viento ancestral..."
- "Desde tiempos inmemoriales..."
- "El velo entre los mundos..."
- Cualquier frase de "IA mística genérica"

### OBLIGATORIO:
1. Primera frase = IMPACTO EMOCIONAL DIRECTO
2. Escribí desde la experiencia vivida (como hablando con una amiga)
3. Cada párrafo debe aportar VALOR REAL
4. Tono: cálida pero no cursi, sabia pero no pedante
5. Detalles específicos, no abstracciones bonitas
6. Podés confrontar con cariño cuando hace falta

### ESTRUCTURA:
- Párrafos cortos que respiran
- Puntos suspensivos... para pausas naturales (con moderación)
- NO abuses de *cursivas* decorativas
- NO uses bullets para contenido emocional`;

const CONTEXTO_CATEGORIAS = {
  cosmos: 'Las fases lunares y la astrología son parte de tu vida diaria. Sabés cómo cada fase afecta las emociones y la energía.',
  duendes: 'Los duendes son tu especialidad. Conocés sus tipos, personalidades, cómo conectar con ellos. No son personajes de cuento - son energías reales.',
  diy: 'Te encanta crear cosas con las manos. Tus DIY son simples pero mágicos, con materiales accesibles.',
  esoterico: 'Lo esotérico es tu día a día. Tarot, runas, numerología - herramientas de autoconocimiento, no de predicción.',
  sanacion: 'La sanación energética es tu camino. No reemplaza la medicina pero complementa el bienestar. Enfoque práctico.',
  rituales: 'Los rituales son momentos de intención consciente. No ceremonias complicadas - cualquiera puede hacerlos en su casa.',
};

const ESTRUCTURA_POR_TIPO = {
  articulo: ['Introducción', 'Desarrollo', 'Aplicación práctica', 'Cierre'],
  ritual: ['Preparación', 'Materiales', 'Pasos del ritual', 'Cierre y agradecimiento'],
  guia: ['Introducción', 'Paso a paso', 'Tips importantes', 'Resumen'],
  meditacion: ['Preparación', 'Inducción', 'Visualización', 'Retorno'],
  reflexion: ['Apertura', 'Desarrollo', 'Preguntas para reflexionar', 'Cierre'],
  historia: ['Comienzo', 'Desarrollo', 'Transformación', 'Mensaje final'],
};

export async function POST(request) {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    return Response.json({ success: false, error: 'API key no configurada' }, { status: 500 });
  }

  try {
    const { tema, categoria = 'general', tipo = 'articulo' } = await request.json();

    if (!tema) {
      return Response.json({ success: false, error: 'Tema requerido' }, { status: 400 });
    }

    const contextoCategoria = CONTEXTO_CATEGORIAS[categoria] || '';
    const estructura = ESTRUCTURA_POR_TIPO[tipo] || ESTRUCTURA_POR_TIPO.articulo;

    const userPrompt = `TEMA: "${tema}"
CATEGORÍA: ${categoria}
TIPO: ${tipo}

Generá contenido completo con esta estructura de secciones:
${estructura.map((sec, i) => `${i + 1}. ${sec}`).join('\n')}

${contextoCategoria}

IMPORTANTE:
- Título atrapante que genere curiosidad REAL (no genérico)
- Extracto de 1-2 oraciones que enganche
- Cada sección debe ser sustancial (mínimo 150 palabras)
- Primera frase de cada sección = impacto emocional
- Total aproximado: 1500-2000 palabras

Respondé SOLO con JSON válido en este formato exacto:
{
  "titulo": "Título atrapante aquí",
  "extracto": "Resumen que enganche en 1-2 oraciones",
  "secciones": [
    {
      "id": "${estructura[0].toLowerCase().replace(/\s/g, '-')}",
      "nombre": "${estructura[0]}",
      "contenido": "Contenido de la sección..."
    }
  ]
}`;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 8000,
        system: SYSTEM_PROMPT,
        messages: [{ role: 'user', content: userPrompt }]
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Anthropic error:', response.status, errorData);
      return Response.json({ success: false, error: `Error API: ${response.status}` }, { status: 500 });
    }

    const data = await response.json();
    const contenidoRaw = data.content?.[0]?.text || '';

    // Parsear JSON
    try {
      const jsonMatch = contenidoRaw.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const resultado = JSON.parse(jsonMatch[0]);

        // Asegurar estructura correcta
        const secciones = resultado.secciones || estructura.map((nombre, i) => ({
          id: nombre.toLowerCase().replace(/\s/g, '-'),
          nombre,
          contenido: '',
          audio: null,
          mostrarAudio: false,
        }));

        return Response.json({
          success: true,
          titulo: resultado.titulo || tema,
          extracto: resultado.extracto || '',
          secciones: secciones.map(s => ({
            ...s,
            audio: null,
            mostrarAudio: false,
          })),
        });
      }
    } catch (parseError) {
      console.error('Error parsing JSON:', parseError);
    }

    // Si no se pudo parsear, devolver error
    return Response.json({
      success: false,
      error: 'No se pudo generar el contenido estructurado',
      raw: contenidoRaw,
    });

  } catch (error) {
    console.error('Error:', error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
