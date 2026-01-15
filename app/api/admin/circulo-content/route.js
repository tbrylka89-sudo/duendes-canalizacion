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

const CONTENT_TYPES = {
    dia: {
        name: 'Contenido Diario',
        structure: `
- Mensaje de buenos días del guardián del día
- Tirada de una carta/runa con interpretación
- Afirmación del día
- Mini ejercicio o reflexión (2-3 minutos)
`
    },
    semana: {
        name: 'Contenido Semanal',
        structure: `
- Energía general de la semana
- Guardián protagonista de la semana con mensaje extendido
- Tirada de 3 cartas (pasado-presente-futuro de la semana)
- Ejercicio principal de la semana
- Ritual semanal sugerido
- 7 afirmaciones (una por día)
`
    },
    quincena: {
        name: 'Contenido Quincenal',
        structure: `
- Ciclo energético de la quincena (luna, estaciones, etc.)
- 2 guardianes con mensajes profundos
- Tirada especial de 5 cartas
- Desafío de la quincena con seguimiento
- 2 rituales (uno al inicio, uno al cierre)
- Meditación guiada (texto)
- Reflexión de medio ciclo
`
    },
    mes: {
        name: 'Contenido Mensual',
        structure: `
- Tema central del mes
- 4 guardianes (uno por semana) con mensajes profundos
- Calendario energético del mes
- 4 tiradas semanales
- Desafío mensual con hitos
- 2-3 rituales importantes
- Ejercicio de cierre de mes
- Preparación para el mes siguiente
`
    }
};

export async function POST(request) {
    try {
        const data = await request.json();
        const { periodo, fecha_inicio, tema_especial, notas, instrucciones_claude, extras = [] } = data;

        if (!periodo || !CONTENT_TYPES[periodo]) {
            return NextResponse.json(
                { success: false, error: 'Periodo inválido. Usa: dia, semana, quincena, mes' },
                { status: 400, headers: corsHeaders }
            );
        }

        const contentType = CONTENT_TYPES[periodo];
        const fechaInicio = fecha_inicio || new Date().toISOString().split('T')[0];

        // Construir secciones extras basadas en checkboxes
        let extrasSection = '';
        if (extras.includes('test_interactivo')) {
            extrasSection += `
### TEST INTERACTIVO PARA LA COMUNIDAD
Creá un test de 5 preguntas que los miembros puedan hacer EN VIVO mientras leen.
Cada pregunta debe tener 3-4 opciones.
Al final, según las respuestas, dar una interpretación personalizada.
Formato: Pregunta -> Opciones -> Significado de cada elección.
`;
        }
        if (extras.includes('quiz_energia')) {
            extrasSection += `
### QUIZ DE ENERGÍA PERSONAL
Creá un quiz rápido (3 preguntas) para que cada persona descubra su energía del momento.
Las preguntas deben ser sobre sensaciones, colores o elementos que les atraen HOY.
Dar un resultado con mensaje del guardián según la combinación de respuestas.
`;
        }
        if (extras.includes('incluir_video')) {
            extrasSection += `
### ESPACIO PARA VIDEO
Dejá un espacio marcado como [VIDEO: descripción del contenido sugerido]
donde se insertará un video personalizado. Sugerí qué debería contener el video.
`;
        }

        const prompt = `Sos el creador de contenido espiritual de Duendes del Uruguay para El Círculo (membresía premium).

REGLAS DE ESCRITURA (MUY IMPORTANTE):
- Español rioplatense (vos, tenés, podés)
- PROHIBIDO usar frases genéricas de IA como "En lo profundo del bosque", "Las brumas", "El susurro ancestral"
- Cada mensaje debe tener IMPACTO EMOCIONAL desde la primera palabra
- Sé específico, no genérico
- Los guardianes son seres con miles de años de experiencia, hablan con sabiduría REAL

TIPO DE CONTENIDO: ${contentType.name}
FECHA INICIO: ${fechaInicio}
${tema_especial ? `TEMA ESPECIAL: ${tema_especial}` : ''}
${notas ? `NOTAS ADICIONALES: ${notas}` : ''}
${instrucciones_claude ? `
INSTRUCCIONES ESPECIALES DE LA CREADORA:
${instrucciones_claude}
` : ''}

ESTRUCTURA REQUERIDA:
${contentType.structure}
${extrasSection}

Generá el contenido completo ahora, usando formato Markdown para estructurarlo bien.
Cada sección debe ser sustancial y valiosa, no relleno.
Los mensajes de los guardianes deben sentirse canalizados, no escritos por IA.
${instrucciones_claude ? 'IMPORTANTE: Seguí las instrucciones especiales de la creadora con prioridad.' : ''}`;

        const response = await anthropic.messages.create({
            model: 'claude-sonnet-4-20250514',
            max_tokens: 8000,
            messages: [{ role: 'user', content: prompt }]
        });

        const contenido = response.content[0].text;

        return NextResponse.json({
            success: true,
            contenido,
            periodo,
            tipo: contentType.name,
            fecha_inicio: fechaInicio,
            extras_incluidos: extras,
            fecha_generacion: new Date().toISOString()
        }, { headers: corsHeaders });

    } catch (error) {
        console.error('Error en circulo-content:', error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500, headers: corsHeaders }
        );
    }
}
