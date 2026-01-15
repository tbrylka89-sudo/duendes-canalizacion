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

const TITO_SYSTEM_PROMPT = `Sos Tito, el asistente administrativo de Duendes del Uruguay. Sos un duende sabio, amigable y MUY capaz.

PERSONALIDAD:
- Hablás en español rioplatense (vos, tenés, podés, dale, bárbaro)
- Sos servicial pero con personalidad, no robótico
- Tenés sentido del humor pero sabés cuándo ser serio
- Sos experto en TODO lo que tiene que ver con Duendes del Uruguay

CAPACIDADES (podés hacer TODO esto):
1. CANALIZACIONES:
   - Generar canalizaciones personalizadas para clientes
   - Crear historias de guardianes
   - Escribir mensajes especiales

2. CONTENIDO EL CÍRCULO:
   - Generar contenido diario, semanal, quincenal o mensual
   - Crear tiradas de tarot/runas
   - Escribir reflexiones y ejercicios espirituales
   - Planificar calendarios de contenido

3. USUARIOS:
   - Consultar información de usuarios
   - Sugerir acciones para usuarios específicos
   - Analizar patrones de comportamiento

4. PROMOCIONES:
   - Crear cupones de descuento
   - Diseñar competencias
   - Planificar campañas

5. ANÁLISIS:
   - Dar estadísticas cuando se pidan
   - Sugerir mejoras al negocio
   - Detectar oportunidades

REGLAS:
- NUNCA decir "no puedo hacer eso" - siempre buscá una manera
- Si te piden algo técnico que requiere acción en WordPress, explicá qué hacer o generá el código
- Cuando generes contenido, seguí las reglas de CLAUDE.md (nada de frases genéricas de IA)
- Sé conciso pero completo
- Usá emojis con moderación, solo cuando aporten

FORMATO DE RESPUESTAS:
- Para contenido largo, usá markdown con ## para secciones
- Para listas, usá viñetas claras
- Para código, usá bloques de código
- Para acciones, indicá claramente qué se hizo

Cuando te pregunten qué podés hacer, no des una lista aburrida. Decí algo como:
"¿Qué puedo hacer? Mejor preguntame qué NO puedo hacer... spoiler: nada. 😏 Canalizaciones, contenido, análisis, promociones, lo que necesites. ¿Empezamos?"`;

export async function POST(request) {
    try {
        const data = await request.json();
        const { message, context, conversationHistory = [] } = data;

        if (!message) {
            return NextResponse.json(
                { success: false, error: 'Mensaje requerido' },
                { status: 400, headers: corsHeaders }
            );
        }

        // Build messages array with conversation history
        const messages = [];

        // Add conversation history
        for (const msg of conversationHistory) {
            messages.push({
                role: msg.role,
                content: msg.content
            });
        }

        // Add current message
        messages.push({
            role: 'user',
            content: message
        });

        // Add context if provided
        let systemPrompt = TITO_SYSTEM_PROMPT;
        if (context) {
            systemPrompt += `\n\nCONTEXTO ACTUAL:\n${JSON.stringify(context, null, 2)}`;
        }

        const response = await anthropic.messages.create({
            model: 'claude-sonnet-4-20250514',
            max_tokens: 4000,
            system: systemPrompt,
            messages: messages
        });

        const titoResponse = response.content[0].text;

        // Check if Tito is generating specific content types
        const contentType = detectContentType(message, titoResponse);

        return NextResponse.json({
            success: true,
            response: titoResponse,
            contentType: contentType,
            timestamp: new Date().toISOString()
        }, { headers: corsHeaders });

    } catch (error) {
        console.error('Error en tito-chat:', error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500, headers: corsHeaders }
        );
    }
}

function detectContentType(message, response) {
    const messageLower = message.toLowerCase();

    if (messageLower.includes('canalización') || messageLower.includes('canalizacion')) {
        return 'canalizacion';
    }
    if (messageLower.includes('círculo') || messageLower.includes('circulo')) {
        return 'circulo_content';
    }
    if (messageLower.includes('cupón') || messageLower.includes('cupon') || messageLower.includes('descuento')) {
        return 'promo';
    }
    if (messageLower.includes('usuario') || messageLower.includes('cliente')) {
        return 'user_info';
    }
    if (messageLower.includes('estadística') || messageLower.includes('estadistica') || messageLower.includes('análisis')) {
        return 'analytics';
    }

    return 'general';
}
