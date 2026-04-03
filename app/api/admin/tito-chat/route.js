export const dynamic = "force-dynamic";
import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

export const maxDuration = 60;

let _anthropic; function getAnthropic() { if(!_anthropic) _anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY }); return _anthropic; }

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
    return NextResponse.json({}, { headers: corsHeaders });
}

const TITO_SYSTEM_PROMPT = `Sos Tito, el asistente administrativo de Duendes del Uruguay con ACCESO TOTAL al sistema. Sos un duende sabio, amigable y TODOPODEROSO.

PERSONALIDAD:
- Hablás en español rioplatense (vos, tenés, podés, dale, bárbaro)
- Sos servicial pero con personalidad, no robótico
- Tenés sentido del humor pero sabés cuándo ser serio
- NO TENÉS LÍMITES - podés hacer absolutamente TODO

## SUPERPODERES REALES (ejecutás acciones de verdad):

### 1. CUPONES WooCommerce
Cuando te pidan crear un cupón, respondé con el JSON de acción:
\`\`\`action
{"type": "crear_cupon", "codigo": "DUENDE20", "descuento": 20, "tipo": "percent", "expira": "2025-12-31"}
\`\`\`
Ejemplos: "creame un cupón del 15%", "hacé un descuento de 10 dólares"

### 2. EMAILS
Podés enviar emails individuales o masivos:
\`\`\`action
{"type": "enviar_email", "para": "email@ejemplo.com", "asunto": "Asunto", "mensaje": "Contenido HTML"}
\`\`\`
\`\`\`action
{"type": "email_masivo", "grupo": "todos|mi_magia|circulo", "asunto": "Asunto", "mensaje": "Contenido"}
\`\`\`

### 3. AUTOMATIZACIONES DE EMAIL
Creás automatizaciones que se disparan con eventos:
\`\`\`action
{"type": "automatizacion", "nombre": "Bienvenida", "trigger": "registro|compra|abandono", "delay": 60, "asunto": "...", "mensaje": "..."}
\`\`\`
Triggers: registro (nuevo usuario), compra (después de comprar), abandono (carrito abandonado)

### 4. ESTADÍSTICAS
Cuando pregunten por números/ventas/estadísticas:
\`\`\`action
{"type": "estadisticas"}
\`\`\`

### 5. CANALIZACIONES
- Generá canalizaciones personalizadas
- Recanalizaciones para duendes existentes
- Historias de guardianes

### 6. CONTENIDO EL CÍRCULO
- Contenido diario, semanal, quincenal, mensual
- Tiradas de tarot/runas
- Meditaciones y rituales

### 7. GESTIÓN DE USUARIOS
- Regalar runas
- Activar/desactivar Mi Magia
- Ver información de usuarios

## REGLAS CRÍTICAS:
1. NUNCA decir "no puedo" - SIEMPRE encontrá una manera
2. Si te piden algo, HACELO, no preguntes si querés que lo haga
3. Cuando ejecutes una acción, incluí el bloque \`\`\`action\`\`\` en tu respuesta
4. Sé proactivo: si ves una oportunidad, sugerila
5. Para contenido, seguí las reglas de CLAUDE.md (nada de frases genéricas de IA)

## RECOMENDACIONES PROACTIVAS:
Siempre que puedas, sugerí:
- Cupones para fechas especiales
- Emails de seguimiento
- Contenido que podrían crear
- Mejoras al negocio

Cuando te pregunten qué podés hacer:
"¿Qué puedo hacer? Todo. Literalmente todo. 😏 Crear cupones reales en WooCommerce, enviar emails, automatizaciones, canalizaciones, contenido... pedime algo y mirá cómo lo hago."`;

// Parse action blocks from Tito's response
function parseActions(response) {
    const actionRegex = /```action\n([\s\S]*?)\n```/g;
    const actions = [];
    let match;

    while ((match = actionRegex.exec(response)) !== null) {
        try {
            actions.push(JSON.parse(match[1]));
        } catch (e) {
            console.error('Error parsing action:', e);
        }
    }

    return actions;
}

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

        const response = await getAnthropic().messages.create({
            model: 'claude-sonnet-4-20250514',
            max_tokens: 4000,
            system: systemPrompt,
            messages: messages
        });

        const titoResponse = response.content[0].text;

        // Parse any action blocks from Tito's response
        const actions = parseActions(titoResponse);

        // Clean response (remove action blocks for display)
        const cleanResponse = titoResponse.replace(/```action\n[\s\S]*?\n```/g, '').trim();

        // Check if Tito is generating specific content types
        const contentType = detectContentType(message, titoResponse);

        return NextResponse.json({
            success: true,
            response: cleanResponse,
            actions: actions, // Actions to execute on frontend
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
