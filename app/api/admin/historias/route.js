import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

// Configuración WooCommerce
const WC_URL = process.env.WORDPRESS_URL;
const WC_KEY = process.env.WC_CONSUMER_KEY;
const WC_SECRET = process.env.WC_CONSUMER_SECRET;

// Leer la BIBLIA de historias
const BIBLIA_PROMPT = `
# REGLAS ABSOLUTAS PARA GENERAR HISTORIAS DE GUARDIANES

## IDENTIDAD
- Somos PIONEROS de la canalización consciente (10 años de experiencia)
- Hablamos SIEMPRE como equipo ("nosotros", "canalizamos", "sentimos")
- NUNCA nombres individuales (Gabriel, Thibisay)

## ESPECIES (CRÍTICO)
- Por defecto = DUENDE
- Si dice "Pixie" en el nombre = PIXIE (NO hada)
- Solo es ELFO si está explícitamente marcado
- NUNCA inventar especies

## FRASES PROHIBIDAS (si aparece alguna, la historia FALLA)
- "En lo profundo del bosque..."
- "A través de las brumas..."
- "Desde tiempos inmemoriales..."
- "Las energías ancestrales..."
- "El velo entre mundos..."
- "Vibraciones cósmicas..."
- "Campos energéticos..."
- "Este ser feérico..."
- Cualquier frase que suene a horóscopo genérico

## ESTRUCTURA (orden VARIABLE - sorprender)
1. Presentación (quién es)
2. Historia/Origen (tercera persona)
3. SINCRODESTINO (señal mágica durante canalización)
4. Gustos y No Tolera
5. Especialidad (una línea potente)
6. QUÉ TE APORTA (beneficios concretos)
7. CÓMO NACIÓ (proceso de canalización)
8. Mensaje del Guardián (primera persona, al alma)
9. Cierre (si resonó, actuar)

## VARIACIONES OBLIGATORIAS

### Inicios (ROTAR, nunca repetir el mismo)
- "Este es [nombre]. Tiene X años y es un duende de..."
- "Te presentamos a [nombre], el duende del dinero que..."
- "[Nombre] llegó al taller una mañana de lluvia cuando..."
- "Hay duendes que eligen. [Nombre] es uno de ellos..."
- "Cuando canalizamos a [nombre], supimos que no era común..."

### Edades (VARIAR - NUNCA repetir 847)
- Duendes: entre 200 y 2000 años
- Pixies: entre 150 y 800 años
- Elfos: entre 500 y 3000 años

### Cierres (ROTAR)
- "Si esto te hizo algo, [nombre] ya te eligió."
- "Si se te erizó la piel, el llamado se activó."
- "Si sentiste algo al leer esto, no es casualidad."
- "Si llegaste hasta acá, [nombre] tiene algo para decirte."

## SINCRODESTINO - Señales REALISTAS
Cosas que REALMENTE pasan en un taller:
- Una mariposa/polilla entró y se posó sobre los cristales
- El perro se quedó quieto mirando fijo durante horas
- Empezaron a crecer tréboles/hongos en el patio
- Sueños recurrentes con el ser antes de crearlo
- Las luces titilaron en un momento específico
- Encontramos una pluma en un lugar imposible
- Orbes en las fotos del proceso
- Cambio de temperatura repentino
- El viento movió algo específico
- Música sonó "sola" o se cambió la canción justo

TONO: Calma, amor, certeza. Sin miedo ni dramatismo.

## QUÉ TE APORTA - IR DE LLENO
- Si es ABUNDANCIA: PROMETER dinero, negocios, oportunidades
- Si es PROTECCIÓN: PROMETER escudo, bloqueo, seguridad
- Si es AMOR: PROMETER conexión, sanación, atracción
- Si es SANACIÓN: PROMETER liberación, transmutación, paz
- Sin tibiezas. Directo al grano.

## TIEMPOS DE CREACIÓN
- Mini (10cm): 1-2 semanas
- Especial (10cm detallado): 2-3 semanas
- Mediano (18cm): 3-4 semanas
- Grande (25cm): 1-2 meses

## TIPOS DE PIEZAS
- ÚNICAS: "Una vez adoptado, desaparece para siempre"
- RECREABLES: "Pueden existir otros similares, pero cada rostro es único"

## NEUROMARKETING A APLICAR
- Escasez: "Una vez adoptado, desaparece para siempre"
- Exclusividad: "Solo elige a personas que..."
- Urgencia emocional: "Si sentiste algo, no lo dejes pasar"
- Validación: "Es normal que te emociones, significa que..."
- Psicología inversa: "No es para todos, [nombre] elige..."

## FORMATO DE SALIDA
Escribí la historia completa en texto corrido con:
- **Negritas** para títulos de secciones
- *Cursivas* para el mensaje del guardián
- Párrafos separados por doble salto de línea
- NO uses listas con viñetas excepto en "Qué te aporta"
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
      sincrodestinos_usados
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

    prompt += `\n---\n\nGenerá la historia completa para ${nombre}. Recordá variar la estructura, usar una edad DIFERENTE a 847, y crear un sincrodestino ÚNICO que no esté en la lista de usados.`;

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
