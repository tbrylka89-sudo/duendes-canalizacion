import { kv } from '@vercel/kv';

export const dynamic = 'force-dynamic';
export const maxDuration = 120;

// ═══════════════════════════════════════════════════════════════
// GENERADOR DE CONTENIDO + IMAGEN PARA UN DÍA ESPECÍFICO
// ═══════════════════════════════════════════════════════════════

const ESTRUCTURA_SEMANAL = {
  0: { tipo: 'ritual', categoria: 'rituales', nombre: 'Ritual Semanal' },
  1: { tipo: 'meditacion', categoria: 'sanacion', nombre: 'Meditación Guiada' },
  2: { tipo: 'articulo', categoria: 'esoterico', nombre: 'Sabiduría Esotérica' },
  3: { tipo: 'guia', categoria: 'diy', nombre: 'DIY Mágico' },
  4: { tipo: 'historia', categoria: 'duendes', nombre: 'Historias de Duendes' },
  5: { tipo: 'reflexion', categoria: 'cosmos', nombre: 'Conexión Lunar' },
  6: { tipo: 'articulo', categoria: 'sanacion', nombre: 'Sanación y Bienestar' },
};

// Estilos para DALL-E
const ESTILO_BASE = `Mystical and enchanting digital art style. Warm earth tones with magical golden accents. Ethereal lighting with soft glows. Fantasy elements but grounded and elegant. No text or letters in the image. Professional quality, suitable for blog header.`;

const ESTILOS_CATEGORIA = {
  cosmos: 'Celestial theme with moon phases, stars, cosmic energy. Deep blues, purples, and silver.',
  duendes: 'Forest spirits, magical woodland creatures, mushrooms, ancient trees. Earthy greens and golden browns.',
  diy: 'Crafting elements, crystals, candles, natural materials arranged artistically. Warm and inviting.',
  esoterico: 'Tarot cards, mystical symbols, crystals, sacred geometry. Deep purples and golds.',
  sanacion: 'Healing energy, soft light, nature elements, peaceful atmosphere. Greens, soft pinks, white light.',
  rituales: 'Ritual setup with candles, herbs, crystals, altar elements. Warm candlelight ambiance.',
};

async function generarImagen(titulo, extracto, categoria, tipo, openaiKey) {
  if (!openaiKey) return null;

  try {
    const estiloCategoria = ESTILOS_CATEGORIA[categoria] || '';

    const prompt = `Create a banner image for: "${titulo}"

${ESTILO_BASE}

Category style: ${estiloCategoria}

${extracto ? `Context: ${extracto.substring(0, 200)}` : ''}

Important:
- Horizontal composition (16:9 aspect ratio feel)
- No text, letters, or words in the image
- Mystical but not cheesy
- Professional quality for spiritual content platform`;

    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openaiKey}`
      },
      body: JSON.stringify({
        model: 'dall-e-3',
        prompt: prompt,
        n: 1,
        size: '1792x1024',
        quality: 'standard',
        response_format: 'url'
      })
    });

    if (!response.ok) {
      console.error('Error generando imagen:', await response.text());
      return null;
    }

    const data = await response.json();
    return data.data?.[0]?.url || null;

  } catch (error) {
    console.error('Error imagen:', error);
    return null;
  }
}

const SYSTEM_PROMPT = `Sos Thibisay, la voz de Duendes del Uruguay. Escribís en español rioplatense.

AUDIENCIA: Mujeres adultas (25-55 años) interesadas en espiritualidad, esoterismo, conexión con la naturaleza. NO son niños.

REGLAS INQUEBRANTABLES:
- PROHIBIDO frases cliché de IA ("En lo profundo del bosque", "Las brumas", "Un manto de estrellas")
- PROHIBIDO nombres vulgares o infantiles para duendes (NADA de Panchito, Juanito, Pedrito)
- Los duendes tienen nombres MÍSTICOS: célticos, élficos, de la naturaleza (Finnegan, Bramble, Rowan, Elderwood, Thornwick, Moss, etc.)
- PROHIBIDO tono infantil o de cuento para niños
- El mundo de los duendes es ANCESTRAL, SABIO, MISTERIOSO - no es Disney
- Los duendes son seres antiguos con sabiduría profunda, no personajes de caricatura
- Primera frase = IMPACTO EMOCIONAL DIRECTO
- Escribí como hablando con una amiga adulta interesada en lo místico
- Cada párrafo debe aportar VALOR REAL y práctico
- Tono cálido, profundo, pero NUNCA cursi ni infantil
- Usá "vos" en lugar de "tú"
- Las historias de duendes deben tener PROFUNDIDAD ESPIRITUAL, enseñanzas reales

ESTRUCTURA: intro (150 palabras), desarrollo (400 palabras), practica (300 palabras), cierre (100 palabras)`;

export async function POST(request) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  const openaiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return Response.json({ success: false, error: 'API key no configurada' }, { status: 500 });
  }

  try {
    const { dia, mes, año, instruccionExtra, soloImagen } = await request.json();

    if (!dia || !mes || !año) {
      return Response.json({ success: false, error: 'Día, mes y año requeridos' }, { status: 400 });
    }

    const fecha = new Date(año, mes - 1, dia);
    const diaSemana = fecha.getDay();
    const estructura = ESTRUCTURA_SEMANAL[diaSemana];

    // Si solo quiere regenerar imagen
    if (soloImagen) {
      const contenidoExistente = await kv.get(`circulo:contenido:${año}:${mes}:${dia}`);
      if (!contenidoExistente) {
        return Response.json({ success: false, error: 'No hay contenido para generar imagen' }, { status: 400 });
      }

      const imagen = await generarImagen(
        contenidoExistente.titulo,
        contenidoExistente.extracto,
        contenidoExistente.categoria,
        contenidoExistente.tipo,
        openaiKey
      );

      contenidoExistente.imagen = imagen;
      await kv.set(`circulo:contenido:${año}:${mes}:${dia}`, contenidoExistente);

      return Response.json({
        success: true,
        contenido: contenidoExistente,
        imagen
      });
    }

    const userPrompt = `Generá contenido para El Círculo de Duendes del Uruguay.

FECHA: ${dia}/${mes}/${año}
DÍA: ${estructura.nombre}
CATEGORÍA: ${estructura.categoria}
TIPO: ${estructura.tipo}

${instruccionExtra ? `INSTRUCCIÓN ESPECIAL: ${instruccionExtra}` : ''}

Generá un JSON con: titulo, extracto, intro, desarrollo, practica, cierre

FORMATO:
{
  "titulo": "...",
  "extracto": "...",
  "intro": "...",
  "desarrollo": "...",
  "practica": "...",
  "cierre": "..."
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
        max_tokens: 4000,
        system: SYSTEM_PROMPT,
        messages: [{ role: 'user', content: userPrompt }]
      })
    });

    if (!response.ok) {
      throw new Error(`Error API: ${response.status}`);
    }

    const data = await response.json();
    const texto = data.content?.[0]?.text || '';
    const jsonMatch = texto.match(/\{[\s\S]*\}/);

    if (!jsonMatch) {
      throw new Error('No se pudo parsear la respuesta');
    }

    const contenido = JSON.parse(jsonMatch[0]);

    // Generar imagen con DALL-E
    const imagen = await generarImagen(
      contenido.titulo,
      contenido.extracto,
      estructura.categoria,
      estructura.tipo,
      openaiKey
    );

    const contenidoCompleto = {
      id: `${año}-${mes}-${dia}`,
      fecha: fecha.toISOString(),
      dia,
      mes,
      año,
      diaSemana,
      tipo: estructura.tipo,
      categoria: estructura.categoria,
      titulo: contenido.titulo,
      extracto: contenido.extracto,
      secciones: {
        intro: contenido.intro,
        desarrollo: contenido.desarrollo,
        practica: contenido.practica,
        cierre: contenido.cierre
      },
      estado: 'borrador',
      generadoEn: new Date().toISOString(),
      publicadoEn: null,
      imagen: imagen,
      audio: null
    };

    await kv.set(`circulo:contenido:${año}:${mes}:${dia}`, contenidoCompleto);

    return Response.json({
      success: true,
      contenido: contenidoCompleto
    });

  } catch (error) {
    console.error('Error:', error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
