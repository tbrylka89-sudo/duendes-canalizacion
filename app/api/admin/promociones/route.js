import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

export const maxDuration = 60;

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
    return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(request) {
    try {
        const data = await request.json();
        const { tipo, datos } = data;

        switch (tipo) {
            case 'cupon':
                return await generarCupon(datos);
            case 'competencia':
                return await generarCompetencia(datos);
            case 'regalo':
                return await generarRegalo(datos);
            case 'banner':
                return await generarBanner(datos);
            default:
                return NextResponse.json(
                    { success: false, error: 'Tipo de promoción no válido' },
                    { status: 400, headers: corsHeaders }
                );
        }
    } catch (error) {
        console.error('Error en promociones:', error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500, headers: corsHeaders }
        );
    }
}

async function generarCupon(datos) {
    const { nombre, descuento, tipo_descuento, productos, fecha_expiracion, uso_maximo } = datos;

    // Generate coupon code
    const codigo = `DUENDE${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    // Generate promotional text with Claude
    const prompt = `Creá un mensaje promocional corto para un cupón de descuento de Duendes del Uruguay.

DATOS DEL CUPÓN:
- Código: ${codigo}
- Descuento: ${descuento}${tipo_descuento === 'porcentaje' ? '%' : ' USD'}
- Válido hasta: ${fecha_expiracion || 'sin fecha límite'}

REGLAS:
- Español rioplatense
- Máximo 2-3 líneas
- Tono místico pero no cursi
- Incluir el código de forma destacada
- Generar urgencia sutil sin ser agresivo`;

    const response = await anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 500,
        messages: [{ role: 'user', content: prompt }]
    });

    return NextResponse.json({
        success: true,
        cupon: {
            codigo,
            descuento,
            tipo_descuento,
            productos,
            fecha_expiracion,
            uso_maximo,
            mensaje_promocional: response.content[0].text
        },
        instrucciones_wp: `
Para crear el cupón en WooCommerce:
1. Ir a Marketing > Cupones > Añadir cupón
2. Código: ${codigo}
3. Tipo: ${tipo_descuento === 'porcentaje' ? 'Porcentaje de descuento' : 'Descuento fijo del carrito'}
4. Importe: ${descuento}
5. Fecha de caducidad: ${fecha_expiracion || 'dejar vacío'}
6. Límite de uso: ${uso_maximo || 'ilimitado'}
        `.trim()
    }, { headers: corsHeaders });
}

async function generarCompetencia(datos) {
    const { nombre, premio, duracion, mecanica } = datos;

    const prompt = `Creá el contenido para una competencia de Duendes del Uruguay.

DATOS:
- Nombre: ${nombre}
- Premio: ${premio}
- Duración: ${duracion}
- Mecánica: ${mecanica || 'A definir'}

GENERÁ:
1. Título atractivo
2. Descripción de 3-4 líneas
3. Reglas claras (máximo 5)
4. Cómo participar (3 pasos)
5. Texto para redes sociales (Instagram)

REGLAS:
- Español rioplatense
- Tono místico y emocionante
- Sin frases genéricas de IA`;

    const response = await anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1500,
        messages: [{ role: 'user', content: prompt }]
    });

    return NextResponse.json({
        success: true,
        competencia: {
            nombre,
            premio,
            duracion,
            contenido: response.content[0].text
        }
    }, { headers: corsHeaders });
}

async function generarRegalo(datos) {
    const { tipo_regalo, destinatarios, mensaje_personalizado } = datos;

    const prompt = `Creá un mensaje para acompañar un regalo especial de Duendes del Uruguay.

TIPO DE REGALO: ${tipo_regalo}
DESTINATARIOS: ${destinatarios}
${mensaje_personalizado ? `NOTA PERSONAL: ${mensaje_personalizado}` : ''}

Generá:
1. Asunto del email
2. Mensaje del regalo (3-4 párrafos)
3. Instrucciones para reclamar

REGLAS:
- Español rioplatense
- Hacé que se sientan especiales
- Tono cálido y místico`;

    const response = await anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        messages: [{ role: 'user', content: prompt }]
    });

    return NextResponse.json({
        success: true,
        regalo: {
            tipo: tipo_regalo,
            destinatarios,
            contenido: response.content[0].text
        }
    }, { headers: corsHeaders });
}

async function generarBanner(datos) {
    const { titulo, subtitulo, cta, seccion, colores } = datos;

    const prompt = `Mejorá el copy de este banner para Duendes del Uruguay.

DATOS ACTUALES:
- Título: ${titulo}
- Subtítulo: ${subtitulo || 'ninguno'}
- CTA: ${cta}
- Sección: ${seccion}

Generá versiones mejoradas de:
1. Título (máximo 6 palabras, impactante)
2. Subtítulo (máximo 12 palabras)
3. CTA (máximo 4 palabras, con acción)

REGLAS:
- Español rioplatense
- Místico pero directo
- Generar curiosidad o emoción`;

    const response = await anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 500,
        messages: [{ role: 'user', content: prompt }]
    });

    return NextResponse.json({
        success: true,
        banner: {
            original: { titulo, subtitulo, cta },
            mejorado: response.content[0].text,
            seccion,
            colores
        }
    }, { headers: corsHeaders });
}
