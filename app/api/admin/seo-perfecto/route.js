import { kv } from '@vercel/kv';

export const dynamic = 'force-dynamic';
export const maxDuration = 120;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
  return new Response(null, { status: 200, headers: corsHeaders });
}

const SYSTEM_PROMPT = `Eres un experto en SEO y copywriting para ecommerce de productos artesanales místicos/espirituales.

Tu trabajo es generar contenido SEO PERFECTO para Rank Math (100/100) para productos de "Duendes del Uruguay" - guardianes artesanales canalizados.

REGLAS CRÍTICAS:
1. El Focus Keyword DEBE aparecer:
   - En el SEO Title (al principio preferible)
   - En la Meta Description (primeras 50 palabras)
   - En la intro_seo (primeras 50 palabras del contenido)
   - Al menos 3 veces en el contenido total

2. La intro_seo es un párrafo que VA ANTES de la historia del producto - NO reemplaza nada

3. Las FAQs van DESPUÉS de la historia - agregan contenido sin modificar nada

4. Focus Keyword ideal: "[Nombre] Duende/Guardián de [Propósito]" o "Comprar [Nombre] [Propósito]"

5. Todo en español rioplatense (vos, tenés, etc.)

6. Las FAQs deben ser preguntas que la gente realmente buscaría

ESTILO Y FORMATO:
- Usar mayúsculas correctamente (nombres propios, inicio de oración)
- Focus Keyword con mayúsculas: "Abraham Guardián de la Abundancia"
- SEO Title profesional y atractivo
- Intro SEO debe ser emotivo y enganchador, como si hablaras con el cliente
- FAQs con preguntas naturales y respuestas cálidas
- Todo debe sentirse premium y místico, no genérico`;

const USER_PROMPT = `Generá SEO PERFECTO para este producto:

NOMBRE: {nombre}
CATEGORÍA/PROPÓSITO: {proposito}
TIPO: {tipo}
TAMAÑO: {tamano}
PRECIO: {precio}

DESCRIPCIÓN ACTUAL (NO MODIFICAR, solo usar como referencia):
{descripcion}

═══════════════════════════════════════════════════════════════

Generá un JSON con contenido ESTÉTICO y PROFESIONAL:

{
  "focus_keyword": "[Keyword con Mayúsculas Correctas, ej: 'Abraham Guardián de Abundancia']",

  "seo_title": "[Título atractivo con keyword al inicio, max 55 chars] | Duendes del Uruguay",

  "seo_description": "[Meta description de 150-155 caracteres. Empezar con keyword. Ser emotivo y persuasivo. Incluir call to action como 'Descubrí', 'Conocé', 'Adoptá'.]",

  "intro_seo": "[Párrafo EMOTIVO de 80-100 palabras que va ANTES de la historia. Empezar con el nombre del guardián. Hablar directo al cliente con 'vos'. Mencionar el propósito principal. Crear conexión emocional. Usar frases como 'llegó para transformar tu vida', 'fue canalizado especialmente', 'guardián artesanal único'. NO repetir lo que dice la historia.]",

  "faqs": [
    {
      "pregunta": "¿Quién es {nombre} y cuál es su propósito?",
      "respuesta": "[Respuesta cálida de 60-80 palabras explicando quién es y su misión principal. Usar 'vos' y 'tu'.]"
    },
    {
      "pregunta": "¿Cómo fue canalizado {nombre}?",
      "respuesta": "[Explicar brevemente el proceso de canalización artesanal. Mencionar que cada pieza es única, hecha a mano con intención.]"
    },
    {
      "pregunta": "¿Qué beneficios puedo esperar de {nombre}?",
      "respuesta": "[Listar 3-4 beneficios específicos según el propósito: abundancia, protección, amor, etc. Ser concreto.]"
    },
    {
      "pregunta": "¿{nombre} es una pieza única?",
      "respuesta": "[Responder según tamaño: minis/especiales son recreables pero cada rostro es único; medianos/grandes son piezas únicas irrepetibles.]"
    },
    {
      "pregunta": "¿Cómo conecto con mi guardián {nombre}?",
      "respuesta": "[Dar consejos prácticos: ubicación en el hogar, ritual de bienvenida, cómo hablarle, etc.]"
    }
  ],

  "tags": "[8-10 tags separados por coma, con mayúsculas: Nombre, Propósito, Duende Artesanal, Guardián Espiritual, Hecho a Mano, Uruguay, etc.]"
}`;

export async function POST(request) {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    return Response.json({ success: false, error: 'API key no configurada' }, { status: 500, headers: corsHeaders });
  }

  try {
    const body = await request.json();
    const { nombre, proposito, tipo, tamano, precio, descripcion, product_id } = body;

    if (!nombre) {
      return Response.json({ success: false, error: 'Nombre requerido' }, { status: 400, headers: corsHeaders });
    }

    const prompt = USER_PROMPT
      .replace('{nombre}', nombre)
      .replace('{proposito}', proposito || 'protección')
      .replace('{tipo}', tipo || 'guardián')
      .replace('{tamano}', tamano || 'mediano')
      .replace('{precio}', precio || '')
      .replace('{descripcion}', (descripcion || '').substring(0, 1000));

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 2000,
        temperature: 0.3,
        system: SYSTEM_PROMPT,
        messages: [{ role: 'user', content: prompt }]
      })
    });

    if (!response.ok) {
      throw new Error(`Error API Claude: ${response.status}`);
    }

    const data = await response.json();
    const textoRespuesta = data.content?.[0]?.text || '';

    // Extraer JSON
    const jsonMatch = textoRespuesta.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No se pudo parsear la respuesta');
    }

    const seoData = JSON.parse(jsonMatch[0]);

    // Formatear FAQs como HTML estético
    let faqsHtml = '<div class="duendes-faqs">';
    faqsHtml += '<h3>✨ Preguntas Frecuentes sobre ' + nombre + '</h3>';
    if (seoData.faqs && Array.isArray(seoData.faqs)) {
      seoData.faqs.forEach((faq, index) => {
        faqsHtml += '<div class="faq-item">';
        faqsHtml += '<h4><span class="faq-icon">❓</span> ' + faq.pregunta + '</h4>';
        faqsHtml += '<p>' + faq.respuesta + '</p>';
        faqsHtml += '</div>';
      });
    }
    faqsHtml += '</div>';

    // Calcular palabras totales aproximadas
    const introWords = (seoData.intro_seo || '').split(/\s+/).length;
    const faqsWords = seoData.faqs ? seoData.faqs.reduce((acc, faq) => {
      return acc + faq.pregunta.split(/\s+/).length + faq.respuesta.split(/\s+/).length;
    }, 0) : 0;
    const descripcionWords = (descripcion || '').split(/\s+/).length;
    const totalWords = introWords + faqsWords + descripcionWords;

    return Response.json({
      success: true,
      seo: {
        focus_keyword: seoData.focus_keyword,
        seo_title: seoData.seo_title,
        seo_description: seoData.seo_description,
        intro_seo: seoData.intro_seo,
        faqs: seoData.faqs,
        faqs_html: faqsHtml,
        tags: seoData.tags,
        keywords_secundarias: seoData.keywords_secundarias
      },
      stats: {
        intro_words: introWords,
        faqs_words: faqsWords,
        descripcion_words: descripcionWords,
        total_words: totalWords,
        target_reached: totalWords >= 600
      }
    }, { headers: corsHeaders });

  } catch (error) {
    console.error('Error generando SEO:', error);
    return Response.json({
      success: false,
      error: error.message
    }, { status: 500, headers: corsHeaders });
  }
}
