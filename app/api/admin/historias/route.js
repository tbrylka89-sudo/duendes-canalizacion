import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

// Configuración WooCommerce
const WC_URL = process.env.WORDPRESS_URL;
const WC_KEY = process.env.WC_CONSUMER_KEY;
const WC_SECRET = process.env.WC_CONSUMER_SECRET;

// PSICOLOGÍA DE CONVERSIÓN - Triggers invisibles
const BIBLIA_PROMPT = `
# PSICOLOGÍA DE CONVERSIÓN PROFUNDA

No vendas. Hacé que el lector SE VENDA SOLO. Usá triggers psicológicos invisibles.

## REGLAS CRÍTICAS - DATOS OBLIGATORIOS

1. **USA LOS DATOS EXACTOS QUE TE DOY:**
   - Si dice "especie: pixie" → es PIXIE, NO duende
   - Si dice "cm: 11" → son 11 centímetros, NO inventes otro número
   - Si dice "categoria: Protección" → es de Protección

2. **NUNCA USES 847 AÑOS** - Ese número está prohibido. Usá edades variadas:
   - Pixies: entre 150 y 600 años
   - Duendes: entre 200 y 1500 años
   - Elegí un número DIFERENTE cada vez

3. **ORTOGRAFÍA PERFECTA** - Revisá antes de entregar:
   - "estás" NO "entás"
   - "vine" NO "vim"
   - Sin errores de tipeo

4. **PIXIES SON PIXIES:**
   - Son espíritus de plantas, NO duendes
   - Son femeninas
   - Miden entre 10-13 cm
   - NUNCA las llames "duende"

## PROHIBIDO (delata que es marketing)

- "Llamá ya", "no te lo pierdas", "oferta", "oportunidad única"
- Lugares inventados: "acantilados de Irlanda", "bosques ancestrales"
- Frases de IA: "desde tiempos inmemoriales", "forja caracteres"
- Urgencia explícita tipo teleshopping
- Cualquier cosa que suene a vendedor

## TRIGGERS PSICOLÓGICOS A USAR

### 1. ESPEJO (Identificación profunda)
El lector debe sentir que lo CONOCÉS. Describí su vida interna sin decir "vos".
- "Hay personas que cargan con todo y no piden nada."
- "Existen almas que dan tanto que se olvidan de recibir."
- "Algunos aprendieron a ser fuertes porque no tuvieron otra opción."

El lector piensa: "¿Cómo sabe esto de mí?"

### 2. VACÍO Y COMPLETUD
Hacé que sienta que le FALTA algo (sin decirlo). Luego mostrá que el guardián lo completa.
- No digas "te falta protección". Describí cómo se siente NO tenerla.
- "Esa sensación de que algo no está bien, aunque no sepas qué."
- "Como si caminaras sin ancla, flotando pero sin dirección."

### 3. PERTENENCIA TRIBAL
Hacé que sienta que es parte de algo. Que hay otros como ella.
- "Los que entienden esto no necesitan explicación."
- "Hay un grupo de personas que simplemente SABEN."
- "No todos están listos para esto. Los que sí, se reconocen."

### 4. AUTORIDAD INVISIBLE
No digas "somos expertos". Mostralo con naturalidad.
- "Después de 10 años canalizando..." (dato, no alarde)
- "Lo que aprendimos es que cada ser elige cuándo nacer."
- Usá lenguaje técnico-espiritual con seguridad.

### 5. RECIPROCIDAD EMOCIONAL
Dá algo primero. Una verdad, un reconocimiento, una validación.
- "Lo que sentís es real, aunque te hayan dicho que exagerás."
- "Tu intuición no miente. Nunca mintió."
El lector siente que le DEBÉS algo.

### 6. LOOP ABIERTO
Dejá algo sin cerrar. El cerebro NECESITA completar.
- "Hay algo que este ser quiere decirte... pero solo lo vas a escuchar si está cerca."
- "El mensaje completo llega cuando lo tenés en tus manos."

### 7. FUTURE PACING
Hacé que VIVA el futuro con el guardián.
- "Imaginá despertarte sin esa presión en el pecho."
- "Pensá en la próxima vez que alguien te pida algo que no querés hacer."
No digas "vas a poder", hacé que lo SIENTA.

### 8. PÉRDIDA > GANANCIA
El cerebro reacciona más a perder que a ganar.
- No digas "vas a ganar protección".
- Decí "hay cosas que ya no vas a permitir que te afecten".
- "Este ser desaparece cuando encuentra su hogar. Una vez."

### 9. VALIDACIÓN DE LA DUDA
La duda es normal. Usala a favor.
- "Si estás dudando, es porque una parte tuya ya sabe."
- "La mente racional busca razones. El alma ya decidió."
- "La duda no es miedo. Es el último filtro antes de lo que necesitás."

## PIXIES = ESPÍRITUS DE PLANTAS

No viajan ni nacieron en lugares exóticos. Son la ESENCIA de su planta.
- Azucena = el espíritu que habita las azucenas
- Rosa = la consciencia de los rosales
- Canela = la energía de esa especia
Describí su personalidad basándote en las PROPIEDADES de su planta.

## SINCRODESTINOS (señales sutiles, creíbles)

Cosas que pasan en un taller REAL:
- "Sonó una canción que no escuchaba hace años, justo cuando elegía su cristal."
- "Se cayó el pincel de la mano cuando iba a pintar otro color. Entendí el mensaje."
- "El gato, que nunca entra al taller, se quedó mirando toda la sesión."
- "Soñé con el nombre antes de saber que existía."

## ESTRUCTURA PSICOLÓGICA

1. **Espejo** - Describí al lector sin nombrarlo. Que se reconozca.
2. **Presentación del ser** - Nombre, años, esencia. Sin pompa.
3. **Vacío** - Qué le falta a quien lo necesita (sin decir "te falta")
4. **Completud** - Cómo se siente tenerlo (future pacing)
5. **Sincrodestino** - Una señal creíble de su nacimiento
6. **Mensaje del guardián** - Primera persona, íntimo, como si te conociera
7. **Loop abierto** - Algo queda sin decir, solo se completa con el guardián

## BENEFICIOS POR CATEGORÍA (sin decir "vas a lograr")

PROTECCIÓN: "Esa persona que te incomoda va a empezar a mantenerse lejos. Sin que hagas nada."
ABUNDANCIA: "Las oportunidades van a aparecer donde antes veías paredes."
AMOR: "Vas a empezar a tratarte como tratás a los que amás."
SANACIÓN: "Lo que dolía va a empezar a pesar menos. No desaparece, pero ya no define."
SABIDURÍA: "Las respuestas van a llegar antes que las preguntas."

## FORMATO
- Párrafos cortos (2-3 líneas)
- **Negritas** solo para títulos
- *Cursivas* para el mensaje del guardián
- Tono: íntimo, seguro, sin vender
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

    // VALIDACIÓN PRE-GENERACIÓN
    const validacion = {
      especie: especie || 'duende',
      cm: tamanoCm || 18,
      esPixie: (especie || '').toLowerCase() === 'pixie',
      nombreLimpio: nombre?.split(' - ')[0] || nombre
    };

    // Si es pixie, forzar datos correctos
    if (validacion.esPixie) {
      if (validacion.cm > 15) validacion.cm = 11; // Pixies son pequeñas
    }

    prompt += `\n---\n\n# GENERA LA HISTORIA PARA: ${validacion.nombreLimpio}

DATOS QUE DEBES USAR EXACTAMENTE:
- Especie: ${validacion.especie.toUpperCase()} (NO uses otra)
- Tamaño: ${validacion.cm} centímetros (NO inventes otro número)
- Categoría: ${categoria}

CHECKLIST ANTES DE ENTREGAR:
□ ¿Usé la especie correcta? (${validacion.especie})
□ ¿Usé los cm correctos? (${validacion.cm}cm)
□ ¿Evité 847 años? (usar entre 150-600 para pixies, 200-1500 para duendes)
□ ¿Revisé la ortografía? (estás, vine, etc)
□ ¿El lector se reconoce en el primer párrafo?
□ ¿Hay un loop abierto que solo se cierra con el guardián?
□ ¿Usé future pacing para que viva el resultado?

IMPORTANTE: Si es PIXIE, es pixie. NO la llames duende. Las pixies son espíritus de plantas.

Generá la historia usando triggers psicológicos invisibles. El lector se vende solo.`;

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

    let historia = response.content[0].text;

    // === POST-VALIDACIÓN Y AUTO-CORRECCIÓN ===

    // 1. Corregir errores de ortografía comunes
    const correccionesOrtografia = {
      'entás': 'estás',
      'entas': 'estás',
      'vim': 'vine',
      'ví': 'vi',
      'conciente': 'consciente',
      'travez': 'través',
      'atravez': 'a través',
      'enseñarte a que': 'enseñarte que',
      'a el ': 'al ',
      'de el ': 'del '
    };

    Object.entries(correccionesOrtografia).forEach(([mal, bien]) => {
      historia = historia.replace(new RegExp(mal, 'gi'), bien);
    });

    // 2. Si es pixie y dice "duende", corregir
    if (validacion.esPixie) {
      historia = historia.replace(/\bes un duende\b/gi, 'es una pixie');
      historia = historia.replace(/\bel duende\b/gi, 'la pixie');
      historia = historia.replace(/\bun duende\b/gi, 'una pixie');
    }

    // 3. Si tiene 847 años, cambiar a número aleatorio
    if (historia.includes('847')) {
      const edadAleatoria = validacion.esPixie
        ? Math.floor(Math.random() * 450) + 150  // 150-600 para pixies
        : Math.floor(Math.random() * 1300) + 200; // 200-1500 para duendes
      historia = historia.replace(/847/g, edadAleatoria.toString());
    }

    // 4. Si menciona cm incorrecto para pixies, corregir
    if (validacion.esPixie) {
      // Buscar patrones como "18 centímetros" o "18cm"
      historia = historia.replace(/\b(1[5-9]|[2-9]\d)\s*(centímetros|cm)\b/gi, `${validacion.cm} centímetros`);
    }

    // 5. Detectar advertencias (no auto-corregir, solo loguear)
    const advertencias = [];
    if (historia.toLowerCase().includes('acantilados')) advertencias.push('Menciona acantilados');
    if (historia.toLowerCase().includes('irlanda') || historia.toLowerCase().includes('escocia')) {
      advertencias.push('Menciona lugares genéricos');
    }
    if (historia.toLowerCase().includes('desde tiempos inmemoriales')) {
      advertencias.push('Usa frase de IA prohibida');
    }

    if (advertencias.length > 0) {
      console.warn('Advertencias en historia generada:', advertencias);
    }

    return NextResponse.json({
      success: true,
      historia,
      datos: {
        nombre: validacion.nombreLimpio,
        categoria,
        tamano,
        productoId,
        especie: validacion.especie,
        cm: validacion.cm
      },
      advertencias: advertencias.length > 0 ? advertencias : undefined
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
