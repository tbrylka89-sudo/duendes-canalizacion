import { kv } from '@vercel/kv';

export const dynamic = 'force-dynamic';
export const maxDuration = 120;

// ═══════════════════════════════════════════════════════════════
// GENERADOR DE HISTORIAS DE GUARDIANES CON CLAUDE
// Crea contenido único para cada producto/guardián
// ═══════════════════════════════════════════════════════════════

const SYSTEM_PROMPT = `Sos el Cronista del Bosque Ancestral de Piriápolis, Uruguay.
Canalizás las historias de los guardianes mágicos que cruzan el portal hacia el mundo humano.

REGLAS ABSOLUTAS:
- Nombres CÉLTICOS, ÉLFICOS o de la NATURALEZA (Elderwood, Bramble, Thornwick, Moss, Rowan, Fern, etc.)
- NUNCA nombres infantiles, diminutivos ni terminaciones en -ito/-ita
- Tono ADULTO, místico, profundo - NUNCA cursi ni infantil
- Solo FORTALEZAS, NUNCA debilidades ni limitaciones
- Español rioplatense natural ("vos", "tenés", "podés", "sos")
- Historia con PROFUNDIDAD espiritual real, no superficial
- El guardián ELIGE a su humano, no al revés
- Cada guardián es ÚNICO e IRREPETIBLE en el universo

SOBRE LOS GUARDIANES:
- Son seres ancestrales con sabiduría milenaria
- Vienen de los 7 Reinos del Universo Mágico
- El portal terrestre está en Piriápolis, Uruguay
- Cada uno tiene un propósito específico para quien lo adopta
- La conexión es energética y real

TONO DE ESCRITURA:
- Primera persona del guardián cuando corresponda
- Poético pero concreto
- Místico sin ser vago
- Profundo sin ser pesado
- Conecta emocionalmente sin manipular`;

const USER_PROMPT_TEMPLATE = `Generá el contenido completo para este guardián:

NOMBRE: {nombre}
TIPO: {tipo}
ELEMENTO: {elemento}
PROPÓSITO PRINCIPAL: {proposito}
CARACTERÍSTICAS ADICIONALES: {caracteristicas}

GENERA UN JSON con esta estructura exacta:
{
  "historia": {
    "origen": "[300-400 palabras] De dónde viene este guardián, de qué reino, cómo llegó al portal de Piriápolis. Hacelo místico y único.",
    "personalidad": "[200 palabras] Cómo es su carácter, cómo se comunica, qué le gusta, cómo se relaciona con su humano.",
    "fortalezas": ["Fortaleza 1 con descripción", "Fortaleza 2 con descripción", "Fortaleza 3", "Fortaleza 4", "Fortaleza 5"],
    "afinidades": ["Nombre de guardián afín 1", "Nombre de guardián afín 2", "Nombre de guardián afín 3"],
    "mensajePoder": "Una frase poderosa que define a este guardián (máximo 15 palabras)",
    "ritual": "[150 palabras] Ritual de bienvenida paso a paso para cuando llegue al hogar",
    "cuidados": "[100 palabras] Dónde ubicarlo, cómo limpiarlo energéticamente, fechas especiales"
  },
  "neuromarketing": {
    "urgencia": "Frase de urgencia específica para este guardián",
    "escasez": "Frase de escasez específica",
    "beneficios": ["Beneficio emocional 1", "Beneficio emocional 2", "Beneficio emocional 3", "Beneficio emocional 4"],
    "garantia": "Descripción de la garantía mágica",
    "promesa": "La promesa principal de este guardián a quien lo adopte"
  }
}

IMPORTANTE:
- Escribí en español rioplatense
- Sé específico y único, no genérico
- El contenido debe emocionar y conectar
- Evitá frases cliché de IA`;

export async function POST(request) {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    return Response.json({ success: false, error: 'API key no configurada' }, { status: 500 });
  }

  try {
    const { nombre, tipo, elemento, proposito, caracteristicas, productId } = await request.json();

    if (!nombre) {
      return Response.json({ success: false, error: 'Nombre del guardián requerido' }, { status: 400 });
    }

    // Construir el prompt
    const userPrompt = USER_PROMPT_TEMPLATE
      .replace('{nombre}', nombre)
      .replace('{tipo}', tipo || 'guardián')
      .replace('{elemento}', elemento || 'Tierra')
      .replace('{proposito}', proposito || 'protección')
      .replace('{caracteristicas}', caracteristicas || 'Ninguna especificada');

    // Llamar a Claude
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 4000,
        system: SYSTEM_PROMPT,
        messages: [{ role: 'user', content: userPrompt }]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error API Claude:', response.status, errorText);
      throw new Error(`Error API Claude: ${response.status}`);
    }

    const data = await response.json();
    const texto = data.content?.[0]?.text || '';

    // Extraer JSON de la respuesta
    const jsonMatch = texto.match(/\{[\s\S]*\}/);

    if (!jsonMatch) {
      console.error('Respuesta sin JSON:', texto.substring(0, 500));
      throw new Error('No se pudo parsear la respuesta de Claude');
    }

    const contenido = JSON.parse(jsonMatch[0]);

    // Guardar en KV si hay productId
    if (productId) {
      const datosProducto = {
        historia: contenido.historia,
        neuromarketing: contenido.neuromarketing,
        generadoEn: new Date().toISOString(),
        nombre,
        tipo,
        elemento,
        proposito
      };

      await kv.set(`producto:${productId}`, datosProducto);
      await kv.set(`producto:${productId}:historia`, contenido.historia);
      await kv.set(`producto:${productId}:neuro`, contenido.neuromarketing);
    }

    return Response.json({
      success: true,
      contenido,
      guardadoEnKV: !!productId
    });

  } catch (error) {
    console.error('Error generando historia:', error);
    return Response.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
