import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

// Configuración WooCommerce
const WC_URL = process.env.WORDPRESS_URL;
const WC_KEY = process.env.WC_CONSUMER_KEY;
const WC_SECRET = process.env.WC_CONSUMER_SECRET;

// BIBLIA NEUROMARKETING - Crear deseo, no literatura
const BIBLIA_PROMPT = `
# GENERA CONTENIDO QUE VENDA - NO LITERATURA

Tu objetivo: que quien lea esto SIENTA que lo necesita YA. No escribas poesía, escribí triggers emocionales.

## PROHIBIDO ABSOLUTO (si aparece, la historia FALLA)

- Lugares inventados: "acantilados de Irlanda", "bosques ancestrales", "valles místicos"
- Frases de IA: "desde tiempos inmemoriales", "forja caracteres", "tormentas de envidias"
- Metáforas vacías: "su luz ilumina", "su poder es la fuerza del..."
- Conceptos abstractos sin beneficio concreto
- Párrafos largos que no dicen nada

## NEUROMARKETING APLICADO

### 1. IDENTIFICACIÓN INMEDIATA
Primera línea: que el lector piense "esto habla de MÍ"
- "¿Sentís que das más de lo que recibís?"
- "¿Cuántas veces dijiste que sí cuando querías decir que no?"
- "¿Sabés que merecés más pero algo te frena?"

### 2. DOLOR → SOLUCIÓN
Nombrar el problema REAL que tiene la persona, luego presentar al guardián como la solución.
- PROTECCIÓN: "Esa amiga que te drena. El jefe que te manipula. La familia que te culpa."
- ABUNDANCIA: "El mes que no llega. Las deudas que asfixian. El trabajo que no paga lo que merecés."
- AMOR: "La relación que no funciona. El amor propio olvidado. La soledad aunque estés acompañada."
- SANACIÓN: "El duelo que no termina. El trauma que volvés a vivir. La angustia sin nombre."
- SABIDURÍA: "Las decisiones que postergás. La intuición que ignorás. La claridad que perdiste."

### 3. ESCASEZ REAL
- "Pieza ÚNICA - cuando se adopte, desaparece para siempre"
- "Solo canalizo X por mes"
- "Este ser eligió nacer AHORA"

### 4. URGENCIA EMOCIONAL
- "Si llegaste hasta acá, no es casualidad"
- "Tu cuerpo ya sabe lo que necesitás"
- "La duda es el ego, la certeza es el alma"

### 5. VALIDACIÓN
- "Es normal que se te ericen los pelos"
- "Si te emocionaste, es la confirmación"
- "Lo que sentís es el reconocimiento"

## PIXIES - VERDAD SOBRE ELLAS

Son espíritus de plantas ESPECÍFICAS. No viajan, no "nacieron en Irlanda".
- Azucena = espíritu de las azucenas (la flor)
- Rosa = espíritu de los rosales
- Canela = espíritu de la planta de canela
- Cada una tiene la ENERGÍA de su planta

## SINCRODESTINOS CREÍBLES

Señales sutiles, no películas de fantasía:
- "Mientras la modelaba, sonó una canción que no había escuchado en años"
- "Se me cayó el cristal de la mano justo cuando pensaba en su nombre"
- "Esa noche soñé con su color antes de elegirlo"
- "El gato se sentó a mirar todo el proceso sin moverse"
- "Empezó a llover exactamente cuando terminé de sellarla"

## ESTRUCTURA QUE VENDE

1. **Hook** - Pregunta/afirmación que identifica al lector
2. **Presentación** - Quién es, años, de qué planta/elemento
3. **Para quién es** - Descripción de la persona que lo necesita
4. **Qué hace por vos** - BENEFICIOS CONCRETOS (no poderes abstractos)
5. **Sincrodestino** - Una señal creíble de su nacimiento
6. **Su mensaje** - Primera persona, directo, sin rodeos
7. **CTA emocional** - Si sentiste algo, actuá

## BENEFICIOS CONCRETOS POR CATEGORÍA

PROTECCIÓN:
- Vas a poder decir que no sin culpa
- La gente tóxica se va a alejar sola
- Vas a sentir un escudo invisible en lugares pesados

ABUNDANCIA:
- Se van a abrir puertas que estaban trabadas
- El dinero va a empezar a fluir de lugares inesperados
- Vas a animarte a cobrar lo que valés

AMOR:
- Vas a mirarte al espejo con otros ojos
- Las relaciones que no suman se van a ir
- Vas a atraer lo que vibrás

SANACIÓN:
- Vas a poder soltar lo que te pesa
- Los recuerdos van a doler menos
- Vas a dormir mejor

SABIDURÍA:
- Las decisiones van a ser más claras
- Tu intuición va a hablar más fuerte
- Vas a confiar más en vos

## FORMATO
- Párrafos de 2-3 líneas máximo
- **Negritas** para secciones
- *Cursivas* para mensaje del guardián
- NO usar listas en el cuerpo, solo al final en beneficios
`;

// POST - Generar historia
export async function POST(request) {
  try {
    const {
      productoId,
      nombre,
      categoria,
      tamano,
      tamanoCm,
      accesorios,
      especie,
      esUnico,
      analisisImagen,
      respuestasEncuesta,
      sincrodestino_custom,
      sincrodestinos_usados,
      feedbackRegeneracion
    } = await request.json();

    // Construir prompt con contexto
    let prompt = BIBLIA_PROMPT + `\n\n---\n\n# DATOS DEL GUARDIÁN A CREAR\n\n`;
    prompt += `**Nombre:** ${nombre}\n`;
    prompt += `**Categoría:** ${categoria}\n`;
    prompt += `**Tamaño:** ${tamano} (${tamanoCm}cm)\n`;
    prompt += `**Especie:** ${especie || 'duende (por defecto)'}\n`;
    prompt += `**Tipo:** ${esUnico ? 'PIEZA ÚNICA' : 'RECREABLE'}\n`;

    if (accesorios) {
      prompt += `**Accesorios/Cristales:** ${accesorios}\n`;
    }

    if (analisisImagen) {
      prompt += `\n**Análisis de la imagen:**\n${analisisImagen}\n`;
    }

    if (respuestasEncuesta && Object.keys(respuestasEncuesta).length > 0) {
      prompt += `\n**Respuestas de la encuesta:**\n`;
      Object.entries(respuestasEncuesta).forEach(([pregunta, respuesta]) => {
        prompt += `- ${pregunta}: ${respuesta}\n`;
      });
    }

    if (sincrodestino_custom) {
      prompt += `\n**Sincrodestino específico a usar:** ${sincrodestino_custom}\n`;
    }

    if (sincrodestinos_usados && sincrodestinos_usados.length > 0) {
      prompt += `\n**SINCRODESTINOS YA USADOS (NO REPETIR):**\n`;
      sincrodestinos_usados.forEach(s => {
        prompt += `- ${s}\n`;
      });
    }

    // Si hay feedback de regeneración, incluirlo
    if (feedbackRegeneracion) {
      prompt += `\n\n# FEEDBACK DE REGENERACIÓN - CORREGIR ESTO:\n`;
      if (feedbackRegeneracion.problema) {
        const problemas = {
          'muy_generico': 'La historia anterior sonaba muy genérica/de IA. Hacela más personal, más directa, con triggers emocionales reales.',
          'muy_largo': 'La historia anterior era muy larga. Hacela más corta y contundente.',
          'muy_corto': 'La historia anterior era muy corta. Desarrollá más los beneficios concretos.',
          'categoria_incorrecta': 'La categoría era incorrecta. Enfocate 100% en la nueva categoría.',
          'no_refleja_personalidad': 'No reflejaba la personalidad del ser. Usá más los accesorios y características para crear personalidad única.',
          'otro': 'Generá una versión completamente diferente.'
        };
        prompt += `**Problema detectado:** ${problemas[feedbackRegeneracion.problema] || feedbackRegeneracion.problema}\n`;
      }
      if (feedbackRegeneracion.indicaciones) {
        prompt += `**Indicaciones específicas:** ${feedbackRegeneracion.indicaciones}\n`;
      }
    }

    prompt += `\n---\n\nGenerá la historia completa para ${nombre}. Enfocate en crear DESEO y URGENCIA. Que quien lea esto sienta que lo necesita AHORA.`;

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2500,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ]
    });

    const historia = response.content[0].text;

    return NextResponse.json({
      success: true,
      historia,
      datos: {
        nombre,
        categoria,
        tamano,
        productoId
      }
    });

  } catch (error) {
    console.error('Error generando historia:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}

// PUT - Guardar historia en WooCommerce
export async function PUT(request) {
  try {
    const { productoId, historia } = await request.json();

    if (!productoId || !historia) {
      return NextResponse.json({
        success: false,
        error: 'Se requiere productoId e historia'
      }, { status: 400 });
    }

    const auth = Buffer.from(`${WC_KEY}:${WC_SECRET}`).toString('base64');

    // Convertir markdown a HTML básico
    let historiaHtml = historia
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/\*"([^"]+)"\*/g, '<em>"$1"</em>')
      .replace(/\*([^*]+)\*/g, '<em>$1</em>')
      .replace(/^- (.+)$/gm, '<li>$1</li>')
      .split('\n\n')
      .map(p => {
        p = p.trim();
        if (p.startsWith('<li>')) return '<ul>' + p + '</ul>';
        if (p) return '<p>' + p.replace(/\n/g, '<br>') + '</p>';
        return '';
      })
      .join('\n');

    historiaHtml = historiaHtml.replace(/<\/ul>\s*<ul>/g, '');

    const response = await fetch(
      `${WC_URL}/wp-json/wc/v3/products/${productoId}`,
      {
        method: 'PUT',
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          description: historiaHtml
        })
      }
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Error actualizando producto: ${error}`);
    }

    const producto = await response.json();

    return NextResponse.json({
      success: true,
      mensaje: `Historia guardada para ${producto.name}`,
      productoId: producto.id
    });

  } catch (error) {
    console.error('Error guardando historia:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}

// GET - Generar preguntas DINÁMICAS con IA (no pre-hechas)
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const nombre = searchParams.get('nombre');
  const categoria = searchParams.get('categoria');
  const especie = searchParams.get('especie');
  const analisisImagen = searchParams.get('analisis');
  const catalogoResumen = searchParams.get('catalogo');

  try {
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 800,
      messages: [
        {
          role: 'user',
          content: `Sos el asistente de Duendes del Uruguay para crear historias de guardianes.

CONTEXTO:
- Guardián: ${nombre || 'Sin nombre'}
- Categoría: ${categoria || 'Sin categoría'}
- Especie: ${especie || 'duende'}
${analisisImagen ? `- Análisis de imagen: ${analisisImagen}` : ''}
${catalogoResumen ? `- Estado del catálogo: ${catalogoResumen}` : ''}

TAREA:
Generá 3-5 preguntas ÚNICAS para este guardián específico. Las preguntas deben:
1. Ser relevantes para ESTE guardián en particular
2. Ayudar a crear una historia original
3. NO ser genéricas que sirvan para cualquiera
4. Considerar qué falta en el catálogo si tenés esa info

IMPORTANTE: Las preguntas deben llevar a respuestas que permitan crear una historia que haga decir "WOW, esto es para mí" a quien la lea.

Respondé SOLO en formato JSON:
{
  "preguntas": [
    {"id": "1", "pregunta": "...", "tipo": "texto"},
    {"id": "2", "pregunta": "...", "tipo": "texto"}
  ]
}

El tipo siempre es "texto" para permitir respuestas abiertas y creativas.`
        }
      ]
    });

    const contenido = response.content[0].text;

    // Extraer JSON de la respuesta
    const jsonMatch = contenido.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const data = JSON.parse(jsonMatch[0]);
      return NextResponse.json({
        success: true,
        preguntas: data.preguntas
      });
    }

    // Fallback si no puede parsear
    return NextResponse.json({
      success: true,
      preguntas: [
        { id: '1', pregunta: `¿Qué hace único a ${nombre}?`, tipo: 'texto' },
        { id: '2', pregunta: '¿A qué tipo de persona específica debería llamar?', tipo: 'texto' },
        { id: '3', pregunta: '¿Pasó algo especial durante su creación?', tipo: 'texto' },
        { id: '4', pregunta: '¿Qué querés que PROMETA este guardián?', tipo: 'texto' }
      ]
    });

  } catch (error) {
    console.error('Error generando preguntas:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
