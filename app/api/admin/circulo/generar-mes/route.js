import { kv } from '@vercel/kv';

export const dynamic = 'force-dynamic';
export const maxDuration = 300; // 5 minutos para generar todo el mes

// ═══════════════════════════════════════════════════════════════
// GENERADOR DE CONTENIDO MENSUAL COMPLETO
// Genera automáticamente todo el contenido de El Círculo para un mes
// ═══════════════════════════════════════════════════════════════

const ESTRUCTURA_SEMANAL = {
  0: { tipo: 'ritual', categoria: 'rituales', nombre: 'Ritual Semanal' },
  1: { tipo: 'meditacion', categoria: 'sanacion', nombre: 'Meditación Guiada' },
  2: { tipo: 'articulo', categoria: 'esoterico', nombre: 'Sabiduría Esotérica' },
  3: { tipo: 'guia', categoria: 'diy', nombre: 'DIY Mágico' },
  4: { tipo: 'historia', categoria: 'duendes', nombre: 'Historias de Duendes' },
  5: { tipo: 'reflexion', categoria: 'cosmos', nombre: 'Conexión Lunar' },
  6: { tipo: 'articulo', categoria: 'sanacion', nombre: 'Sanación y Bienestar' },
};

const FECHAS_ESPECIALES = {
  '02-02': { nombre: 'Imbolc', tipo: 'sabbat', tematica: 'Renacimiento y primeros brotes de luz' },
  '03-20': { nombre: 'Ostara', tipo: 'sabbat', tematica: 'Equinoccio de primavera, equilibrio y nuevos comienzos' },
  '05-01': { nombre: 'Beltane', tipo: 'sabbat', tematica: 'Fuego sagrado, fertilidad y pasión' },
  '06-21': { nombre: 'Litha', tipo: 'sabbat', tematica: 'Solsticio de verano, plenitud solar' },
  '08-01': { nombre: 'Lammas', tipo: 'sabbat', tematica: 'Primera cosecha, gratitud por la abundancia' },
  '09-22': { nombre: 'Mabon', tipo: 'sabbat', tematica: 'Equinoccio de otoño, balance y reflexión' },
  '10-31': { nombre: 'Samhain', tipo: 'sabbat', tematica: 'Velo entre mundos, ancestros y transformación' },
  '12-21': { nombre: 'Yule', tipo: 'sabbat', tematica: 'Solsticio de invierno, renacimiento de la luz' },
};

const SYSTEM_PROMPT = `Sos Thibisay, la voz de Duendes del Uruguay. Escribís en español rioplatense.

AUDIENCIA: Mujeres adultas (25-55 años) interesadas en espiritualidad, esoterismo, conexión con la naturaleza. NO son niños.

REGLAS INQUEBRANTABLES:
- PROHIBIDO frases cliché de IA ("En lo profundo del bosque", "Las brumas", "Un manto de estrellas", "Desde tiempos inmemoriales")
- PROHIBIDO nombres vulgares o infantiles para duendes (NADA de Panchito, Juanito, Pedrito, diminutivos)
- Los duendes tienen nombres MÍSTICOS: célticos, élficos, de la naturaleza (Finnegan, Bramble, Rowan, Elderwood, Thornwick, Moss, Willow, etc.)
- PROHIBIDO tono infantil o de cuento para niños - esto NO es Disney ni literatura infantil
- El mundo de los duendes es ANCESTRAL, SABIO, MISTERIOSO
- Los duendes son seres antiguos con sabiduría profunda, guardianes del bosque, conocedores de secretos de la tierra
- Primera frase = IMPACTO EMOCIONAL DIRECTO, algo que enganche
- Escribí como hablando con una amiga adulta interesada en lo místico y espiritual
- Cada párrafo debe aportar VALOR REAL y práctico
- Tono cálido, profundo, pero NUNCA cursi, meloso ni infantil
- Detalles específicos, no abstracciones vagas
- Usá "vos" en lugar de "tú"
- Las historias de duendes deben tener PROFUNDIDAD ESPIRITUAL y enseñanzas para la vida adulta

ESTRUCTURA DEL CONTENIDO:
1. INTRO (150 palabras): Gancho emocional + contexto del tema
2. DESARROLLO (400 palabras): Enseñanza principal con ejemplos reales
3. PRÁCTICA (300 palabras): Algo que la lectora pueda HACER hoy
4. CIERRE (100 palabras): Mensaje de empoderamiento

TOTAL: Mínimo 1000 palabras de contenido sustancioso.`;

async function generarContenidoDia(fecha, estructura, especial, apiKey) {
  let temaEspecial = '';
  if (especial) {
    temaEspecial = `\n\nFECHA ESPECIAL: ${especial.nombre} - ${especial.tematica}
Integrá esta celebración en el contenido de manera orgánica.`;
  }

  const userPrompt = `Generá contenido para El Círculo de Duendes del Uruguay.

FECHA: ${fecha}
DÍA DE LA SEMANA: ${estructura.nombre}
CATEGORÍA: ${estructura.categoria}
TIPO DE CONTENIDO: ${estructura.tipo}${temaEspecial}

INSTRUCCIONES ESPECÍFICAS POR TIPO:
${estructura.tipo === 'ritual' ? '- Incluí materiales necesarios, pasos claros, momento ideal para realizarlo' : ''}
${estructura.tipo === 'meditacion' ? '- Describí la visualización paso a paso, duración recomendada, posición' : ''}
${estructura.tipo === 'articulo' ? '- Profundizá en el tema con ejemplos y aplicaciones prácticas' : ''}
${estructura.tipo === 'guia' ? '- Lista de materiales, pasos numerados, fotos mentales de cada paso' : ''}
${estructura.tipo === 'historia' ? '- Contá una historia envolvente sobre duendes con moraleja práctica' : ''}
${estructura.tipo === 'reflexion' ? '- Conectá con la energía lunar actual, preguntas para journaling' : ''}

Generá:
1. Un TÍTULO atrapante (máximo 12 palabras, sin clichés)
2. Un EXTRACTO para preview (2 oraciones que generen curiosidad)
3. El CONTENIDO completo con las 4 secciones (intro, desarrollo, práctica, cierre)

FORMATO DE RESPUESTA (JSON):
{
  "titulo": "...",
  "extracto": "...",
  "intro": "...",
  "desarrollo": "...",
  "practica": "...",
  "cierre": "..."
}`;

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4000,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: userPrompt }]
    })
  });

  if (!response.ok) {
    throw new Error(`Error API Claude: ${response.status}`);
  }

  const data = await response.json();
  const texto = data.content?.[0]?.text || '';

  // Extraer JSON de la respuesta
  const jsonMatch = texto.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('No se pudo parsear la respuesta');
  }

  return JSON.parse(jsonMatch[0]);
}

export async function POST(request) {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    return Response.json({ success: false, error: 'API key no configurada' }, { status: 500 });
  }

  try {
    const { mes, año } = await request.json();

    if (!mes || !año) {
      return Response.json({ success: false, error: 'Mes y año requeridos' }, { status: 400 });
    }

    const mesIndex = mes - 1; // Convertir a 0-indexed
    const primerDia = new Date(año, mesIndex, 1);
    const ultimoDia = new Date(año, mesIndex + 1, 0);
    const totalDias = ultimoDia.getDate();

    const contenidosGenerados = [];
    const errores = [];

    // Generar contenido para cada día del mes
    for (let dia = 1; dia <= totalDias; dia++) {
      const fecha = new Date(año, mesIndex, dia);
      const diaSemana = fecha.getDay();
      const estructura = ESTRUCTURA_SEMANAL[diaSemana];

      // Verificar si es fecha especial
      const fechaStr = `${String(mes).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;
      const especial = FECHAS_ESPECIALES[fechaStr];

      try {
        const fechaCompleta = `${dia}/${mes}/${año}`;
        const contenido = await generarContenidoDia(fechaCompleta, estructura, especial, apiKey);

        const contenidoCompleto = {
          id: `${año}-${mes}-${dia}`,
          fecha: fecha.toISOString(),
          dia,
          mes,
          año,
          diaSemana,
          tipo: estructura.tipo,
          categoria: estructura.categoria,
          titulo: contenido.titulo,
          extracto: contenido.extracto,
          secciones: {
            intro: contenido.intro,
            desarrollo: contenido.desarrollo,
            practica: contenido.practica,
            cierre: contenido.cierre
          },
          especial: especial || null,
          estado: 'borrador',
          generadoEn: new Date().toISOString(),
          publicadoEn: null,
          imagen: null,
          audio: null
        };

        // Guardar en KV
        await kv.set(`circulo:contenido:${año}:${mes}:${dia}`, contenidoCompleto);
        contenidosGenerados.push(contenidoCompleto);

        // Pequeña pausa para no saturar la API
        await new Promise(resolve => setTimeout(resolve, 500));

      } catch (error) {
        errores.push({ dia, error: error.message });
        console.error(`Error día ${dia}:`, error);
      }
    }

    // Guardar índice del mes
    await kv.set(`circulo:indice:${año}:${mes}`, {
      año,
      mes,
      totalContenidos: contenidosGenerados.length,
      generadoEn: new Date().toISOString(),
      diasConContenido: contenidosGenerados.map(c => c.dia)
    });

    return Response.json({
      success: true,
      mensaje: `Generados ${contenidosGenerados.length} contenidos para ${mes}/${año}`,
      contenidos: contenidosGenerados,
      errores: errores.length > 0 ? errores : null
    });

  } catch (error) {
    console.error('Error generando mes:', error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
