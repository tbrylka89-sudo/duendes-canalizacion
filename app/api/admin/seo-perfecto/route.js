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

const SYSTEM_PROMPT = `Eres un experto en SEO para ecommerce de productos artesanales místicos/espirituales.

Tu trabajo es generar contenido SEO PERFECTO para Rank Math (100/100) para productos de "Duendes del Uruguay" - guardianes artesanales canalizados.

REGLAS CRÍTICAS:
1. El Focus Keyword DEBE aparecer:
   - En el SEO Title (al principio preferible)
   - En la Meta Description (primeras 50 palabras)
   - En la intro_seo (primeras 50 palabras del contenido)
   - Al menos 3 veces en el contenido total

2. La intro_seo es un párrafo que VA ANTES de la historia del producto - NO reemplaza nada

3. Las FAQs van DESPUÉS de la historia - agregan contenido sin modificar nada

4. Focus Keyword ideal: "[nombre] duende/guardian de [propósito]" o "comprar [nombre] [propósito]"

5. Todo en español rioplatense (vos, tenés, etc.)

6. Las FAQs deben ser preguntas que la gente realmente buscaría`;

const USER_PROMPT = `Generá SEO PERFECTO para este producto:

NOMBRE: {nombre}
CATEGORÍA/PROPÓSITO: {proposito}
TIPO: {tipo}
TAMAÑO: {tamano}
PRECIO: {precio}

DESCRIPCIÓN ACTUAL (NO MODIFICAR, solo usar como referencia):
{descripcion}

═══════════════════════════════════════════════════════════════

Generá un JSON con:

{
  "focus_keyword": "[keyword principal de 2-4 palabras que incluya el nombre]",

  "seo_title": "[título SEO de max 60 caracteres con focus keyword al inicio] | Duendes del Uruguay",

  "seo_description": "[meta description de 150-160 caracteres que empiece con el focus keyword, sea persuasiva y tenga call to action]",

  "intro_seo": "[Párrafo de 80-100 palabras que VA ANTES de la historia. DEBE empezar con el focus keyword. Presenta al guardián, menciona el propósito, y engancha emocionalmente. Usar keywords secundarias como 'comprar duende', 'guardian espiritual', 'artesanal Uruguay'.]",

  "faqs": [
    {
      "pregunta": "¿Qué es [nombre] y para qué sirve?",
      "respuesta": "[Respuesta de 50-80 palabras explicando el propósito del guardián]"
    },
    {
      "pregunta": "¿Cómo se canaliza un guardián como [nombre]?",
      "respuesta": "[Respuesta sobre el proceso de canalización artesanal]"
    },
    {
      "pregunta": "¿Qué beneficios trae [nombre] a mi vida?",
      "respuesta": "[Respuesta con beneficios específicos según el propósito]"
    },
    {
      "pregunta": "¿[nombre] es pieza única o recreable?",
      "respuesta": "[Respuesta según el tamaño - minis recreables, medianos/grandes únicos]"
    },
    {
      "pregunta": "¿Cómo cuido a mi guardián [nombre]?",
      "respuesta": "[Respuesta con consejos de cuidado y conexión]"
    }
  ],

  "tags": "[lista de 8-10 tags separados por coma: incluir nombre, propósito, tipo, 'duende artesanal', 'guardian espiritual', 'hecho a mano Uruguay', etc.]",

  "keywords_secundarias": "[5 keywords long-tail para usar en el contenido]"
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

    // Formatear FAQs como HTML
    let faqsHtml = '<div class="duendes-faqs"><h3>Preguntas Frecuentes sobre ' + nombre + '</h3>';
    if (seoData.faqs && Array.isArray(seoData.faqs)) {
      seoData.faqs.forEach(faq => {
        faqsHtml += '<div class="faq-item">';
        faqsHtml += '<h4>' + faq.pregunta + '</h4>';
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
