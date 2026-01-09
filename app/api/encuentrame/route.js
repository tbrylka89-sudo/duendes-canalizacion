import { kv } from '@vercel/kv';
import Anthropic from '@anthropic-ai/sdk';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function OPTIONS() {
  return new Response(null, { headers: CORS_HEADERS });
}

// ═══════════════════════════════════════════════════════════════
// ENCUÉNTRAME - MATCHMAKER DE GUARDIANES
// ═══════════════════════════════════════════════════════════════

export async function POST(request) {
  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  
  try {
    const { descripcion, email } = await request.json();
    
    if (!descripcion || descripcion.trim().length < 10) {
      return Response.json({ 
        success: false, 
        error: 'Contanos más sobre lo que buscás' 
      }, { status: 400, headers: CORS_HEADERS });
    }
    
    // Cargar productos disponibles
    const productos = await kv.get('tito:productos') || [];
    const disponibles = productos.filter(p => p.disponible);
    
    if (disponibles.length === 0) {
      return Response.json({ 
        success: false, 
        error: 'No hay guardianes disponibles en este momento' 
      }, { status: 400, headers: CORS_HEADERS });
    }
    
    // Cargar datos del usuario si existe
    let datosUsuario = null;
    if (email) {
      const elegido = await kv.get(`elegido:${email.toLowerCase()}`);
      if (elegido) {
        datosUsuario = {
          nombre: elegido.nombrePreferido || elegido.nombre,
          pronombre: elegido.pronombre,
          guardianesActuales: elegido.guardianes?.map(g => g.nombre) || []
        };
      }
    }
    
    // Preparar lista de productos para Claude
    const productosTexto = disponibles.slice(0, 30).map(p => 
      `ID: ${p.id} | ${p.nombre} | Categoría: ${p.categorias} | Precio: $${p.precio} USD | ${p.descripcion_corta?.substring(0, 100) || ''}`
    ).join('\n');
    
    // Prompt para Claude
    const systemPrompt = `Sos un experto en conectar personas con sus guardianes mágicos (duendes artesanales). 
Tu trabajo es analizar lo que la persona necesita y recomendar los guardianes más adecuados de la lista disponible.

REGLAS:
- Recomendá entre 2 y 4 guardianes máximo
- Cada recomendación debe explicar POR QUÉ ese guardián es ideal para la situación
- Usá español rioplatense (vos, tenés, etc)
- Sé cálido pero directo, no exagerado
- Si la persona menciona problemas graves de salud mental, derivá a profesionales
- Conectá las categorías con las necesidades:
  * Protección: para quienes necesitan sentirse seguras, proteger su hogar o energía
  * Abundancia: para temas de dinero, trabajo, oportunidades
  * Amor: para relaciones, autoestima, armonía familiar
  * Sanación: para salud, recuperación, bienestar
  
FORMATO DE RESPUESTA (JSON):
{
  "recomendaciones": [
    {
      "id": <id_del_producto>,
      "porQueEsIdeal": "<explicación personalizada de 2-3 oraciones>"
    }
  ],
  "mensajeGeneral": "<mensaje cálido de cierre, 1-2 oraciones>"
}`;

    const userPrompt = `PRODUCTOS DISPONIBLES:
${productosTexto}

${datosUsuario ? `DATOS DE LA PERSONA:
- Nombre: ${datosUsuario.nombre}
- Pronombre: ${datosUsuario.pronombre}
- Ya tiene estos guardianes: ${datosUsuario.guardianesActuales.join(', ') || 'Ninguno todavía'}
` : ''}

LO QUE LA PERSONA DESCRIBE:
"${descripcion}"

Analizá la situación y recomendá los guardianes más adecuados en formato JSON.`;

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }]
    });
    
    // Parsear respuesta
    let resultadoClaude;
    try {
      const textoRespuesta = response.content[0].text;
      // Extraer JSON del texto
      const jsonMatch = textoRespuesta.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        resultadoClaude = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No se encontró JSON válido');
      }
    } catch (parseError) {
      console.error('Error parseando respuesta:', parseError);
      return Response.json({ 
        success: false, 
        error: 'Error procesando recomendaciones' 
      }, { status: 500, headers: CORS_HEADERS });
    }
    
    // Enriquecer recomendaciones con datos de productos
    const recomendaciones = resultadoClaude.recomendaciones
      .map(rec => {
        const producto = disponibles.find(p => p.id === rec.id);
        if (!producto) return null;
        
        return {
          id: producto.id,
          nombre: producto.nombre,
          precio: producto.precio,
          imagen: producto.imagen,
          url: producto.url || `https://duendesuy.10web.cloud/producto/${producto.slug}/`,
          categorias: producto.categorias,
          porQueEsIdeal: rec.porQueEsIdeal
        };
      })
      .filter(Boolean);
    
    return Response.json({ 
      success: true, 
      recomendaciones,
      mensajeGeneral: resultadoClaude.mensajeGeneral || ''
    }, { headers: CORS_HEADERS });
    
  } catch (error) {
    console.error('Error en Encuéntrame:', error);
    return Response.json({ 
      success: false, 
      error: error.message 
    }, { status: 500, headers: CORS_HEADERS });
  }
}
