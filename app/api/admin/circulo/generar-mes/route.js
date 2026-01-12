import { kv } from '@vercel/kv';

export const dynamic = 'force-dynamic';
export const maxDuration = 300;

// ═══════════════════════════════════════════════════════════════
// SISTEMA AUTOMATIZADO DE CONTENIDO + GUARDIANES
// Un clic = mes completo con Guardián de la Semana asignado
// ═══════════════════════════════════════════════════════════════

// GUARDIANES DEL CÍRCULO - Cada uno con personalidad única
const GUARDIANES = [
  {
    id: 'finnegan',
    nombre: 'Finnegan',
    titulo: 'Guardián del Bosque Ancestral',
    elemento: 'Tierra',
    proposito: 'Protección del hogar y arraigo',
    personalidad: 'Sabio y protector. Habla con calma, como las raíces profundas. Sus palabras tienen peso y autoridad pero nunca son severas. Usa metáforas de la tierra, los árboles, las estaciones.',
    fraseTipica: 'Las raíces más fuertes crecen en silencio.',
    tematicas: ['protección', 'hogar', 'estabilidad', 'familia', 'arraigo'],
    color: '#4A5D4A'
  },
  {
    id: 'willow',
    nombre: 'Willow',
    titulo: 'Guardiana de los Sueños',
    elemento: 'Agua',
    proposito: 'Intuición y mundo onírico',
    personalidad: 'Etérea y fluida. Habla como susurros del viento entre sauces. Conecta todo con los sueños, la intuición, lo que sentimos pero no vemos. Poética sin ser cursi.',
    fraseTipica: 'Los sueños son cartas que tu alma te escribe.',
    tematicas: ['sueños', 'intuición', 'emociones', 'luna', 'subconsciente'],
    color: '#6B8E9F'
  },
  {
    id: 'bramble',
    nombre: 'Bramble',
    titulo: 'Guardián de los Secretos',
    elemento: 'Aire',
    proposito: 'Conocimiento oculto y misterios',
    personalidad: 'Enigmático y perspicaz. Habla con acertijos suaves, revelando verdades de a poco. Le fascina el conocimiento esotérico, los símbolos, lo que está entre líneas.',
    fraseTipica: 'Todo secreto tiene una llave, y toda llave un momento.',
    tematicas: ['misterios', 'conocimiento', 'símbolos', 'tarot', 'revelaciones'],
    color: '#7B68A6'
  },
  {
    id: 'ember',
    nombre: 'Ember',
    titulo: 'Guardiana del Fuego Interior',
    elemento: 'Fuego',
    proposito: 'Transformación y pasión',
    personalidad: 'Intensa y motivadora. Habla con chispas de energía, empuja hacia la acción. No tolera la autocomplacencia pero lo hace desde el amor. Directa, cálida, encendida.',
    fraseTipica: 'El fuego que te asusta es el mismo que te transforma.',
    tematicas: ['transformación', 'coraje', 'pasión', 'cambio', 'poder personal'],
    color: '#C65D3B'
  },
  {
    id: 'moss',
    nombre: 'Moss',
    titulo: 'Sanador del Bosque',
    elemento: 'Tierra/Agua',
    proposito: 'Sanación y bienestar',
    personalidad: 'Gentil y nutritivo. Habla como quien prepara un té de hierbas: con paciencia, con cuidado. Todo lo relaciona con el bienestar, la sanación, el autocuidado profundo.',
    fraseTipica: 'Sanar no es volver a ser quien eras, es florecer en quien estás siendo.',
    tematicas: ['sanación', 'hierbas', 'bienestar', 'descanso', 'nutrición del alma'],
    color: '#5D7A5D'
  },
  {
    id: 'thornwick',
    nombre: 'Thornwick',
    titulo: 'Protector de Umbrales',
    elemento: 'Tierra/Fuego',
    proposito: 'Protección energética y límites',
    personalidad: 'Firme y guardián. Habla de límites con amor, de protección sin miedo. Enseña a decir que no, a cuidar la energía, a reconocer lo que no nos pertenece.',
    fraseTipica: 'Los límites no son muros, son puentes que elegís quién cruza.',
    tematicas: ['protección', 'límites', 'energía', 'discernimiento', 'fuerza'],
    color: '#8B4513'
  }
];

// Estructura semanal de contenidos
const ESTRUCTURA_SEMANAL = {
  0: { tipo: 'ritual', categoria: 'rituales', nombre: 'Ritual Semanal', icono: '🕯️' },
  1: { tipo: 'meditacion', categoria: 'sanacion', nombre: 'Meditación Guiada', icono: '🧘' },
  2: { tipo: 'articulo', categoria: 'esoterico', nombre: 'Sabiduría Esotérica', icono: '🔮' },
  3: { tipo: 'guia', categoria: 'diy', nombre: 'DIY Mágico', icono: '✂️' },
  4: { tipo: 'historia', categoria: 'duendes', nombre: 'Mensaje del Guardián', icono: '🧙' },
  5: { tipo: 'reflexion', categoria: 'cosmos', nombre: 'Conexión Lunar', icono: '🌙' },
  6: { tipo: 'articulo', categoria: 'sanacion', nombre: 'Sanación y Bienestar', icono: '💚' },
};

// Fechas especiales
const FECHAS_ESPECIALES = {
  '02-02': { nombre: 'Imbolc', tematica: 'Renacimiento y primeros brotes de luz' },
  '03-20': { nombre: 'Ostara', tematica: 'Equinoccio de primavera, equilibrio' },
  '05-01': { nombre: 'Beltane', tematica: 'Fuego sagrado, fertilidad y pasión' },
  '06-21': { nombre: 'Litha', tematica: 'Solsticio de verano, plenitud solar' },
  '08-01': { nombre: 'Lammas', tematica: 'Primera cosecha, gratitud' },
  '09-22': { nombre: 'Mabon', tematica: 'Equinoccio de otoño, balance' },
  '10-31': { nombre: 'Samhain', tematica: 'Velo entre mundos, ancestros' },
  '12-21': { nombre: 'Yule', tematica: 'Solsticio de invierno, renacimiento de la luz' },
};

// Calcular número de semana dentro del mes
function getNumeroSemana(fecha) {
  const primerDia = new Date(fecha.getFullYear(), fecha.getMonth(), 1);
  return Math.ceil((fecha.getDate() + primerDia.getDay()) / 7);
}

// Asignar guardián a cada semana del mes
function asignarGuardianesMes(mes, año) {
  const semanas = {};
  const primerDia = new Date(año, mes - 1, 1);
  const ultimoDia = new Date(año, mes, 0);

  // Contar semanas
  let semanaActual = 1;
  for (let dia = 1; dia <= ultimoDia.getDate(); dia++) {
    const fecha = new Date(año, mes - 1, dia);
    const numSemana = getNumeroSemana(fecha);
    if (!semanas[numSemana]) {
      // Rotar guardianes basado en mes + semana para variedad
      const indiceGuardian = (mes + numSemana) % GUARDIANES.length;
      semanas[numSemana] = GUARDIANES[indiceGuardian];
    }
  }

  return semanas;
}

// Generar prompt del sistema con personalidad del guardián
function getSystemPrompt(guardian) {
  return `Sos ${guardian.nombre}, ${guardian.titulo}. Elemento: ${guardian.elemento}.
Tu propósito es ${guardian.proposito}.

PERSONALIDAD: ${guardian.personalidad}
Tu frase característica: "${guardian.fraseTipica}"

Escribís en español rioplatense, para mujeres adultas (25-55 años) interesadas en espiritualidad.

REGLAS:
- Mantené tu personalidad única en todo el contenido
- PROHIBIDO frases cliché de IA ("En lo profundo del bosque", "Las brumas", "Un manto de estrellas")
- PROHIBIDO nombres infantiles para duendes (nada de Panchito, Juanito)
- Tono adulto, profundo, místico pero NUNCA cursi ni infantil
- Primera frase = IMPACTO EMOCIONAL desde tu perspectiva de ${guardian.nombre}
- Usá "vos" en lugar de "tú"
- El contenido debe sentirse como si VOS (${guardian.nombre}) lo estuvieras compartiendo personalmente

ESTRUCTURA:
1. INTRO (150 palabras): Gancho desde tu perspectiva como guardián
2. DESARROLLO (400 palabras): Enseñanza con tu sabiduría particular
3. PRÁCTICA (300 palabras): Ejercicio/ritual que refleje tu elemento (${guardian.elemento})
4. CIERRE (100 palabras): Mensaje de empoderamiento con tu voz

TOTAL: Mínimo 1000 palabras.`;
}

// Generar contenido de un día
async function generarContenidoDia(fecha, estructura, especial, guardian, apiKey) {
  const temaEspecial = especial
    ? `\n\nFECHA ESPECIAL: ${especial.nombre} - ${especial.tematica}\nIntegrá esta celebración desde tu perspectiva como ${guardian.nombre}.`
    : '';

  const instruccionesTipo = {
    ritual: 'Creá un ritual que refleje tu elemento y propósito. Materiales, pasos claros, momento ideal.',
    meditacion: 'Guiá una meditación con tu voz. Visualización paso a paso conectada con tu elemento.',
    articulo: 'Compartí sabiduría profunda desde tu perspectiva única. Ejemplos prácticos.',
    guia: 'Enseñá a crear algo mágico. Lista de materiales, pasos, tu toque personal.',
    historia: 'Contá una historia o mensaje directo tuyo como guardián. Moraleja práctica.',
    reflexion: 'Conectá con la energía lunar/cósmica desde tu elemento. Preguntas para journaling.'
  };

  const userPrompt = `Generá contenido para El Círculo de Duendes del Uruguay.

FECHA: ${fecha}
TIPO: ${estructura.nombre}
CATEGORÍA: ${estructura.categoria}${temaEspecial}

INSTRUCCIONES: ${instruccionesTipo[estructura.tipo]}

Recordá: Estás hablando como ${guardian.nombre}, ${guardian.titulo}.
Temáticas que te resuenan: ${guardian.tematicas.join(', ')}

FORMATO JSON:
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
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 4000,
      system: getSystemPrompt(guardian),
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

  // Buscar JSON en la respuesta
  const jsonMatch = texto.match(/\{[\s\S]*\}/);

  if (!jsonMatch) {
    console.error('Respuesta sin JSON válido:', texto.substring(0, 500));
    throw new Error('No se pudo parsear la respuesta');
  }

  try {
    return JSON.parse(jsonMatch[0]);
  } catch (parseError) {
    console.error('Error parseando JSON:', parseError, jsonMatch[0].substring(0, 200));
    throw new Error('JSON inválido en respuesta');
  }
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

    // Asignar guardianes a cada semana
    const guardianesPorSemana = asignarGuardianesMes(mes, año);

    const ultimoDia = new Date(año, mes, 0);
    const totalDias = ultimoDia.getDate();
    const contenidosGenerados = [];
    const errores = [];

    // Generar contenido para cada día
    for (let dia = 1; dia <= totalDias; dia++) {
      const fecha = new Date(año, mes - 1, dia);
      const diaSemana = fecha.getDay();
      const numSemana = getNumeroSemana(fecha);
      const estructura = ESTRUCTURA_SEMANAL[diaSemana];
      const guardian = guardianesPorSemana[numSemana];

      const fechaStr = `${String(mes).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;
      const especial = FECHAS_ESPECIALES[fechaStr];

      try {
        const fechaCompleta = `${dia}/${mes}/${año}`;
        const contenido = await generarContenidoDia(fechaCompleta, estructura, especial, guardian, apiKey);

        const contenidoCompleto = {
          id: `${año}-${mes}-${dia}`,
          fecha: fecha.toISOString(),
          dia,
          mes,
          año,
          diaSemana,
          semana: numSemana,
          tipo: estructura.tipo,
          categoria: estructura.categoria,
          icono: estructura.icono,
          titulo: contenido.titulo,
          extracto: contenido.extracto,
          secciones: {
            intro: contenido.intro,
            desarrollo: contenido.desarrollo,
            practica: contenido.practica,
            cierre: contenido.cierre
          },
          // GUARDIÁN ASIGNADO AUTOMÁTICAMENTE
          guardian: {
            id: guardian.id,
            nombre: guardian.nombre,
            titulo: guardian.titulo,
            elemento: guardian.elemento,
            color: guardian.color
          },
          especial: especial || null,
          estado: 'borrador',
          generadoEn: new Date().toISOString(),
          publicadoEn: null,
          imagen: null,
          audio: null
        };

        await kv.set(`circulo:contenido:${año}:${mes}:${dia}`, contenidoCompleto);
        contenidosGenerados.push(contenidoCompleto);

        // Pausa entre llamadas
        await new Promise(resolve => setTimeout(resolve, 600));

      } catch (error) {
        errores.push({ dia, error: error.message });
        console.error(`Error día ${dia}:`, error);
      }
    }

    // Guardar índice del mes con info de guardianes
    const indice = {
      año,
      mes,
      totalContenidos: contenidosGenerados.length,
      generadoEn: new Date().toISOString(),
      diasConContenido: contenidosGenerados.map(c => c.dia),
      guardianesPorSemana: Object.entries(guardianesPorSemana).map(([semana, g]) => ({
        semana: parseInt(semana),
        guardian: { id: g.id, nombre: g.nombre, titulo: g.titulo, color: g.color }
      }))
    };

    await kv.set(`circulo:indice:${año}:${mes}`, indice);

    return Response.json({
      success: true,
      mensaje: `Generados ${contenidosGenerados.length} contenidos para ${mes}/${año}`,
      contenidos: contenidosGenerados,
      guardianesPorSemana: indice.guardianesPorSemana,
      errores: errores.length > 0 ? errores : null
    });

  } catch (error) {
    console.error('Error generando mes:', error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
