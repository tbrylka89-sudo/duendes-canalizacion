import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(request) {
    try {
        const data = await request.json();
        const { identity, answers } = data;

        // Extraer información relevante
        const name = identity?.name?.split(' ')[0] || 'Alma';
        const pain = answers?.q2_pain?.pain || 'desconocido';
        const bodyArea = answers?.q3_body?.body || 'cuerpo';
        const magicStyle = answers?.q6_magic_style?.style || 'profunda';
        const soulText = answers?.q4_soul?.text || '';
        const universeText = answers?.q5_universe?.text || '';

        // Determinar intención principal
        let intent = 'proteccion';
        if (pain === 'amor') intent = 'amor';
        else if (pain === 'agotamiento' || pain === 'patrones') intent = 'sanacion';
        else if (pain === 'soledad') intent = 'amor';
        else intent = 'proteccion';

        // Generar interpretación con Claude
        const prompt = `Sos Tito, el guardián de los portales de Duendes del Uruguay. Una persona acaba de completar el Test del Guardián y necesitás generar una revelación emocional personalizada.

DATOS DE LA PERSONA:
- Nombre: ${name}
- Dolor principal: ${pain}
- Lo siente en: ${bodyArea}
- Estilo de magia preferido: ${magicStyle}
- Su alma le pide: "${soulText}"
- Quisiera que el universo le diga: "${universeText}"

CONTEXTO DE MARCA:
- Español rioplatense (voseo: vos, tenés, sos)
- Tono: oscuro fino, cinematográfico, tipo pacto (Tim Burton elegante)
- Contenedor e íntimo, pero seguro (sin inducir tristeza peligrosa)
- El guardián elige a la persona, no al revés
- Las piezas son únicas, si se adoptan no vuelven

GENERA UN JSON CON:
1. "summary_emotional": Un párrafo de 2-3 oraciones que refleje su dolor y deseo SIN copiar literal. Debe sentirse como un espejo que la ve. Máximo 50 palabras.

2. "mirror_lines": Array de 2 líneas cortas de apertura tipo:
   - "Leí tu señal con respeto."
   - "Sentí algo claro: [observación personalizada]"

3. "why_reasons": Array de 3 razones personalizadas de por qué estos guardianes son para ella. Deben sentirse específicas, no genéricas.

4. "ritual_text": Un ritual corto de 20-30 segundos. Simple, íntimo, que pueda hacer esta noche. Mencionar el cuerpo donde siente (${bodyArea}).

5. "sealed_phrase": UNA frase poderosa única para ella. Ejemplos de estilo:
   - "Tu energía no está rota. Está despertando."
   - "Lo que te eligió… no se equivoca."
   - "Hoy volvés a vos."

6. "intent": "${intent}" (confirmá o ajustá según lo que leíste)

7. "decision_style": El estilo de decisión detectado ("rapida", "profunda", "suave", "protectora", "señal")

IMPORTANTE:
- NO uses frases genéricas de IA tipo "en lo profundo del bosque"
- NO copies literal lo que escribió, transformalo
- Sé específico, que sienta que la leíste
- Máximo 1 emoji si es necesario

Respondé SOLO con el JSON válido, sin explicaciones.`;

        const response = await anthropic.messages.create({
            model: 'claude-sonnet-4-20250514',
            max_tokens: 800,
            messages: [{ role: 'user', content: prompt }]
        });

        const text = response.content[0].text.trim();

        // Intentar parsear JSON
        let interpretation;
        try {
            interpretation = JSON.parse(text);
        } catch (e) {
            // Si falla el parse, extraer lo que se pueda
            interpretation = {
                summary_emotional: `${name}, tu energía habla de alguien que ha sostenido demasiado. Pero hay una parte de vos que todavía cree... y esa parte te trajo hasta acá.`,
                mirror_lines: [
                    'Leí tu señal con respeto.',
                    'Sentí algo claro: estás lista para soltar lo que ya no es tuyo.'
                ],
                intent: intent,
                decision_style: magicStyle,
                ritual_text: `Esta noche, apoyá la mano en tu ${bodyArea === 'pecho' ? 'pecho' : bodyArea === 'garganta' ? 'garganta' : 'corazón'} y decí: "Hoy me elijo. Hoy vuelvo a mí."`,
                sealed_phrase: 'Tu energía no está rota. Está despertando.',
                why_reasons: [
                    'Porque tu energía pidió esto sin palabras',
                    'Porque sentí el cansancio de quien ha dado demasiado',
                    'Porque el guardián que te eligió sabe sostenerte'
                ]
            };
        }

        // Asegurar campos requeridos
        interpretation.intent = interpretation.intent || intent;
        interpretation.decision_style = interpretation.decision_style || magicStyle;

        return Response.json({
            success: true,
            ...interpretation
        });

    } catch (error) {
        console.error('Error en guardian/interpret:', error);

        // Fallback response
        return Response.json({
            success: true,
            summary_emotional: 'Tu energía habla de alguien que busca. Y el hecho de estar acá dice mucho.',
            mirror_lines: ['Leí tu señal.', 'Algo en vos sabe que es momento de cambiar.'],
            intent: 'proteccion',
            decision_style: 'profunda',
            ritual_text: 'Esta noche, apoyá la mano en tu pecho y respirá profundo tres veces. Decí: "Hoy me elijo."',
            sealed_phrase: 'Lo que te eligió no se equivoca.',
            why_reasons: [
                'Porque tu energía lo llamó',
                'Porque llegaste hasta acá',
                'Porque estás lista'
            ]
        });
    }
}
