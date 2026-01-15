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
        const {
            producto_id,
            cliente_nombre,
            cliente_email,
            cliente_pais,
            momento_vida,
            necesidad,
            notas
        } = data;

        // Construir prompt para canalización personalizada
        const prompt = `Sos un canalizador espiritual de Duendes del Uruguay.
Vas a crear una canalización personalizada para una persona que acaba de adoptar un guardián.

REGLAS ABSOLUTAS:
- NO uses frases genéricas de IA como "En lo profundo del bosque", "Las brumas", "El susurro del viento ancestral"
- NO uses metáforas vacías sin significado real
- SÍ escribí con impacto emocional desde la primera palabra
- SÍ hacé que la persona se sienta VISTA, no solo leída
- SÍ usá el nombre de la persona y detalles específicos que compartió
- Usá español rioplatense (vos, tenés, podés)

DATOS DEL CLIENTE:
- Nombre: ${cliente_nombre}
- País: ${cliente_pais || 'No especificado'}
- Momento que atraviesa: ${momento_vida || 'No especificado'}
- Lo que busca/necesita: ${necesidad || 'Guía general'}
- Notas adicionales: ${notas || 'Ninguna'}

ESTRUCTURA DE LA CANALIZACIÓN:

1. APERTURA (2-3 líneas)
Saludo personal que haga sentir a ${cliente_nombre} que el guardián la estaba esperando.

2. MENSAJE DEL GUARDIÁN (3-4 párrafos)
El guardián habla directamente a ${cliente_nombre}, conectando con su situación específica.
Incluir:
- Reconocimiento de lo que está atravesando
- Un mensaje de sabiduría aplicable a su vida
- Una guía práctica o consejo específico
- Palabras de aliento genuinas (no clichés)

3. RITUAL DE CONEXIÓN (1 párrafo)
Un pequeño ritual o práctica que ${cliente_nombre} puede hacer para conectar con su guardián.
Debe ser simple y realizable.

4. CIERRE (2-3 líneas)
Palabras finales del guardián, cerrando con calidez y dejando una semilla de esperanza.

---

Generá la canalización completa ahora:`;

        const response = await anthropic.messages.create({
            model: 'claude-sonnet-4-20250514',
            max_tokens: 2000,
            messages: [{ role: 'user', content: prompt }]
        });

        const canalizacion = response.content[0].text;

        return NextResponse.json({
            success: true,
            canalizacion,
            cliente: cliente_nombre,
            fecha: new Date().toISOString()
        }, { headers: corsHeaders });

    } catch (error) {
        console.error('Error en canalizacion-manual:', error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500, headers: corsHeaders }
        );
    }
}
