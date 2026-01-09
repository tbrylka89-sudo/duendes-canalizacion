/**
 * TEST DEL GUARDIÁN - API ENDPOINT
 * Con CORS habilitado
 */

import Anthropic from '@anthropic-ai/sdk';
import { kv } from '@vercel/kv';

const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY
});

// Headers CORS
const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
};

// Manejar OPTIONS (preflight)
export async function OPTIONS() {
    return new Response(null, { status: 204, headers: corsHeaders });
}

// Obtener productos de WooCommerce
async function obtenerProductos() {
    const url = `${process.env.WORDPRESS_URL}/wp-json/wc/v3/products?per_page=100&status=publish`;
    
    const response = await fetch(url, {
        headers: {
            'Authorization': 'Basic ' + Buffer.from(
                `${process.env.WC_CONSUMER_KEY}:${process.env.WC_CONSUMER_SECRET}`
            ).toString('base64')
        }
    });
    
    if (!response.ok) return [];
    
    const productos = await response.json();
    
    return productos.map(p => ({
        id: p.id,
        nombre: p.name,
        precio: parseFloat(p.price),
        categoria: p.categories?.[0]?.name || 'Protección',
        categoriaSlug: p.categories?.[0]?.slug || 'proteccion',
        imagen: p.images?.[0]?.src || '',
        url: p.permalink,
        descripcion: p.short_description?.replace(/<[^>]*>/g, '') || ''
    }));
}

// Generar resultado con Anthropic
async function generarResultado(datos, productos) {
    const { nombre, fecha, email, respuestas, numerologia, modo, regaloNombre } = datos;
    
    const nombreFinal = modo === 'regalo' && regaloNombre ? regaloNombre : nombre;
    const primerNombre = nombreFinal.split(' ')[0];
    
    const respuestasTexto = respuestas.map((r, i) => 
        `Pregunta ${i + 1}: ${r.pregunta}\nRespuesta: ${r.respuesta} (${r.tags.join(', ')})`
    ).join('\n\n');
    
    const productosTexto = productos.slice(0, 20).map(p => 
        `- ID:${p.id} | ${p.nombre} (${p.categoria}, $${p.precio} USD): ${p.descripcion.substring(0, 100)}`
    ).join('\n');
    
    const prompt = `Sos el sistema de canalización de Duendes del Uruguay, la marca líder mundial en guardianes canalizados esculpidos a mano en porcelana fría.

CONTEXTO DE LA PERSONA:
- Nombre: ${nombreFinal}
- Fecha de nacimiento: ${fecha}
- Número de vida: ${numerologia.vida}
- Número del alma: ${numerologia.alma}
- Elemento: ${numerologia.elemento}
- Astro regente: ${numerologia.astro}

RESPUESTAS DEL TEST:
${respuestasTexto}

GUARDIANES DISPONIBLES:
${productosTexto}

TU TAREA:
1. Analizar las respuestas y detectar las heridas, necesidades y deseos profundos de esta persona
2. Elegir el guardián que MEJOR se conecta con esta persona específica (usa el ID exacto)
3. Generar un mensaje ÚNICO y PERSONAL que llegue al corazón

REGLAS DEL MENSAJE:
- Debe ser íntimo, como si el guardián conociera el alma de ${primerNombre}
- Mencionar detalles específicos de sus respuestas SIN ser obvio
- El tono es místico pero cercano, como un abuelo sabio
- NUNCA uses frases genéricas como "te acompaño en tu camino"
- Debe sentirse que este mensaje es SOLO para ella, imposible de copiar
- 3-4 párrafos emotivos

RESPONDE SOLO CON ESTE JSON (sin markdown, sin backticks):
{
    "guardian_id": [ID numérico del producto elegido],
    "porcentaje_conexion": [número entre 85 y 98],
    "mensaje_guardian": "[Mensaje de 3-4 párrafos del guardián hacia la persona]",
    "porque_te_eligio": [
        "[Razón 1 específica basada en sus respuestas]",
        "[Razón 2 específica basada en sus respuestas]",
        "[Razón 3 específica basada en sus respuestas]"
    ],
    "mensaje_urgencia": "[Por qué debe sellar el pacto ahora - específico para ella, mencionando que es ÚNICO y otra alma puede reclamarlo]",
    "alternativas_ids": [[ID1], [ID2]]
}`;

    const response = await anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 2000,
        messages: [{ role: 'user', content: prompt }]
    });
    
    const textoRespuesta = response.content[0].text;
    
    const jsonMatch = textoRespuesta.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('No se pudo parsear respuesta de IA');
    
    return JSON.parse(jsonMatch[0]);
}

export async function POST(request) {
    try {
        const datos = await request.json();
        
        if (!datos.nombre || !datos.fecha || !datos.email || !datos.respuestas) {
            return Response.json({ 
                success: false, 
                error: 'Datos incompletos' 
            }, { status: 400, headers: corsHeaders });
        }
        
        const productos = await obtenerProductos();
        if (productos.length === 0) {
            return Response.json({ 
                success: false, 
                error: 'No hay productos disponibles' 
            }, { status: 500, headers: corsHeaders });
        }
        
        const resultado = await generarResultado(datos, productos);
        
        const guardianElegido = productos.find(p => p.id === resultado.guardian_id) || productos[0];
        
        const alternativas = (resultado.alternativas_ids || []).map(id => {
            const prod = productos.find(p => p.id === id);
            return prod ? { ...prod, porcentaje: Math.floor(70 + Math.random() * 20) } : null;
        }).filter(Boolean);
        
        const testId = `test-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        
        const datosGuardar = {
            id: testId,
            fecha: new Date().toISOString(),
            persona: {
                nombre: datos.nombre,
                email: datos.email,
                fechaNacimiento: datos.fecha,
                numerologia: datos.numerologia,
                modo: datos.modo,
                regaloNombre: datos.regaloNombre
            },
            respuestas: datos.respuestas,
            resultado: {
                guardian: guardianElegido,
                porcentaje: resultado.porcentaje_conexion,
                mensaje: resultado.mensaje_guardian,
                porque: resultado.porque_te_eligio,
                urgencia: resultado.mensaje_urgencia,
                alternativas
            }
        };
        
        await kv.set(`test:${testId}`, JSON.stringify(datosGuardar), { ex: 60 * 60 * 24 * 30 });
        await kv.set(`test-email:${datos.email}`, testId, { ex: 60 * 60 * 24 * 30 });
        
        return Response.json({
            success: true,
            testId,
            guardian: {
                id: guardianElegido.id,
                nombre: guardianElegido.nombre,
                imagen: guardianElegido.imagen,
                url: guardianElegido.url,
                precio: guardianElegido.precio,
                categoria: guardianElegido.categoria
            },
            porcentaje: resultado.porcentaje_conexion,
            mensaje: resultado.mensaje_guardian,
            porque: resultado.porque_te_eligio,
            urgencia: resultado.mensaje_urgencia,
            alternativas: alternativas.slice(0, 2).map(a => ({
                id: a.id,
                nombre: a.nombre,
                imagen: a.imagen,
                url: a.url,
                porcentaje: a.porcentaje
            })),
            numerologia: datos.numerologia
        }, { headers: corsHeaders });
        
    } catch (error) {
        console.error('Error en test:', error);
        return Response.json({ 
            success: false, 
            error: error.message 
        }, { status: 500, headers: corsHeaders });
    }
}

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const testId = searchParams.get('id');
    
    if (!testId) {
        return Response.json({ status: 'API Test del Guardián activa', version: '1.0' }, { headers: corsHeaders });
    }
    
    try {
        const datos = await kv.get(`test:${testId}`);
        if (!datos) {
            return Response.json({ success: false, error: 'Test no encontrado' }, { status: 404, headers: corsHeaders });
        }
        
        return Response.json({ success: true, datos: typeof datos === 'string' ? JSON.parse(datos) : datos }, { headers: corsHeaders });
    } catch (error) {
        return Response.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders });
    }
}
