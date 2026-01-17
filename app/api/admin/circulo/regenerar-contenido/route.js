import { kv } from '@vercel/kv';

export const dynamic = 'force-dynamic';
export const maxDuration = 300;

// ═══════════════════════════════════════════════════════════════════════════════
// API: REGENERAR CONTENIDO CON DUENDES REALES
// Usa los duendes cargados en /admin/circulo/duendes para generar contenido
// ═══════════════════════════════════════════════════════════════════════════════

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
  '01-01': { nombre: 'Año Nuevo', tematica: 'Nuevos comienzos, intenciones sagradas' },
  '02-02': { nombre: 'Imbolc', tematica: 'Renacimiento y primeros brotes de luz' },
  '03-20': { nombre: 'Ostara', tematica: 'Equinoccio de primavera, equilibrio' },
  '05-01': { nombre: 'Beltane', tematica: 'Fuego sagrado, fertilidad y pasión' },
  '06-21': { nombre: 'Litha', tematica: 'Solsticio de verano, plenitud solar' },
  '08-01': { nombre: 'Lammas', tematica: 'Primera cosecha, gratitud' },
  '09-22': { nombre: 'Mabon', tematica: 'Equinoccio de otoño, balance' },
  '10-31': { nombre: 'Samhain', tematica: 'Velo entre mundos, ancestros' },
  '12-21': { nombre: 'Yule', tematica: 'Solsticio de invierno, renacimiento de la luz' },
  '12-25': { nombre: 'Navidad', tematica: 'Luz, familia, regalos sagrados' },
  '12-31': { nombre: 'Fin de Año', tematica: 'Cierre de ciclos, gratitud' },
};

// Calcular número de semana dentro del mes
function getNumeroSemana(fecha) {
  const primerDia = new Date(fecha.getFullYear(), fecha.getMonth(), 1);
  return Math.ceil((fecha.getDate() + primerDia.getDay()) / 7);
}

// Crear prompt del sistema con personalidad del duende
function getSystemPrompt(duende) {
  const elemento = duende.elemento || 'Tierra';
  const proposito = duende.proposito || 'guiar y proteger';
  const cristales = duende.cristales?.join(', ') || 'cuarzo';
  const personalidad = duende.personalidad || 'Sabio y gentil. Habla con calidez y profundidad.';

  return `Sos ${duende.nombre}, ${duende.nombreCompleto || duende.nombre}. Elemento: ${elemento}.
Tu propósito es ${proposito}.
Tus cristales asociados: ${cristales}

PERSONALIDAD: ${personalidad}

${duende.descripcion ? `DESCRIPCIÓN: ${duende.descripcion}` : ''}

Escribís en español rioplatense, para mujeres adultas (25-55 años) interesadas en espiritualidad.

REGLAS:
- Mantené tu personalidad única en todo el contenido
- PROHIBIDO frases cliché de IA ("En lo profundo del bosque", "Las brumas", "Un manto de estrellas")
- Tono adulto, profundo, místico pero NUNCA cursi ni infantil
- Primera frase = IMPACTO EMOCIONAL desde tu perspectiva de ${duende.nombre}
- Usá "vos" en lugar de "tú"
- El contenido debe sentirse como si VOS (${duende.nombre}) lo estuvieras compartiendo personalmente
- Incluí referencias a tus cristales (${cristales}) cuando sea apropiado

ESTRUCTURA:
1. INTRO (150 palabras): Gancho desde tu perspectiva como guardián
2. DESARROLLO (400 palabras): Enseñanza con tu sabiduría particular
3. PRÁCTICA (300 palabras): Ejercicio/ritual que refleje tu elemento (${elemento})
4. CIERRE (100 palabras): Mensaje de empoderamiento con tu voz

TOTAL: Mínimo 1000 palabras.`;
}

// Generar contenido para un día específico
async function generarContenidoDia(fecha, estructura, especial, duende, apiKey) {
  const temaEspecial = especial
    ? `\n\nFECHA ESPECIAL: ${especial.nombre} - ${especial.tematica}\nIntegrá esta celebración desde tu perspectiva como ${duende.nombre}.`
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

Recordá: Estás hablando como ${duende.nombre}.
Tus cristales: ${duende.cristales?.join(', ') || 'cuarzo'}
Tu propósito: ${duende.proposito || 'guiar y proteger'}

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
      system: getSystemPrompt(duende),
      messages: [{ role: 'user', content: userPrompt }]
    })
  });

  if (!response.ok) {
    throw new Error(`Error API Claude: ${response.status}`);
  }

  const data = await response.json();
  const texto = data.content?.[0]?.text || '';
  const jsonMatch = texto.match(/\{[\s\S]*\}/);

  if (!jsonMatch) {
    throw new Error('No se pudo parsear la respuesta');
  }

  return JSON.parse(jsonMatch[0]);
}

// Asignar duendes a semanas del mes
function asignarDuendesMes(mes, año, duendes) {
  if (!duendes || duendes.length === 0) {
    throw new Error('No hay duendes cargados');
  }

  const semanas = {};
  const ultimoDia = new Date(año, mes, 0);

  for (let dia = 1; dia <= ultimoDia.getDate(); dia++) {
    const fecha = new Date(año, mes - 1, dia);
    const numSemana = getNumeroSemana(fecha);
    if (!semanas[numSemana]) {
      const indiceDuende = (mes + numSemana) % duendes.length;
      semanas[numSemana] = duendes[indiceDuende];
    }
  }

  return semanas;
}

export async function POST(request) {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    return Response.json({ success: false, error: 'API key de Anthropic no configurada' }, { status: 500 });
  }

  try {
    const body = await request.json().catch(() => ({}));
    const {
      mes = new Date().getMonth() + 1,
      año = new Date().getFullYear(),
      soloFaltantes = false,
      diaEspecifico = null
    } = body;

    // Obtener duendes reales
    const duendes = await kv.get('circulo:duendes-reales') || [];

    if (duendes.length === 0) {
      return Response.json({
        success: false,
        error: 'No hay duendes reales cargados. Ve a /admin/circulo/duendes para agregar guardianes.',
        accion: 'Ir a /admin/circulo/duendes para cargar duendes'
      }, { status: 400 });
    }

    // Asignar duendes a semanas
    const duendesPorSemana = asignarDuendesMes(mes, año, duendes);

    const hoy = new Date();
    const ultimoDia = new Date(año, mes, 0);
    const totalDias = ultimoDia.getDate();
    const contenidosGenerados = [];
    const errores = [];

    // Si es un día específico
    if (diaEspecifico) {
      const fecha = new Date(año, mes - 1, diaEspecifico);
      const diaSemana = fecha.getDay();
      const numSemana = getNumeroSemana(fecha);
      const estructura = ESTRUCTURA_SEMANAL[diaSemana];
      const duende = duendesPorSemana[numSemana];

      const fechaStr = `${String(mes).padStart(2, '0')}-${String(diaEspecifico).padStart(2, '0')}`;
      const especial = FECHAS_ESPECIALES[fechaStr];

      const contenido = await generarContenidoDia(`${diaEspecifico}/${mes}/${año}`, estructura, especial, duende, apiKey);

      const contenidoCompleto = {
        id: `${año}-${mes}-${diaEspecifico}`,
        fecha: fecha.toISOString(),
        dia: diaEspecifico,
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
        duende: duende.nombre,
        duendeInfo: {
          id: duende.id,
          nombre: duende.nombre,
          nombreCompleto: duende.nombreCompleto,
          imagen: duende.imagen,
          cristales: duende.cristales,
          elemento: duende.elemento
        },
        especial: especial || null,
        estado: fecha <= hoy ? 'publicado' : 'programado',
        generadoEn: new Date().toISOString(),
        publicadoEn: fecha <= hoy ? new Date().toISOString() : null
      };

      await kv.set(`circulo:contenido:${año}:${mes}:${diaEspecifico}`, contenidoCompleto);

      return Response.json({
        success: true,
        mensaje: `Contenido generado para ${diaEspecifico}/${mes}/${año}`,
        contenido: contenidoCompleto,
        duende: duende.nombre
      });
    }

    // Generar para todo el mes
    for (let dia = 1; dia <= totalDias; dia++) {
      // Si solo faltantes, verificar si ya existe
      if (soloFaltantes) {
        const existente = await kv.get(`circulo:contenido:${año}:${mes}:${dia}`);
        if (existente) continue;
      }

      const fecha = new Date(año, mes - 1, dia);
      const diaSemana = fecha.getDay();
      const numSemana = getNumeroSemana(fecha);
      const estructura = ESTRUCTURA_SEMANAL[diaSemana];
      const duende = duendesPorSemana[numSemana];

      const fechaStr = `${String(mes).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;
      const especial = FECHAS_ESPECIALES[fechaStr];

      try {
        const contenido = await generarContenidoDia(`${dia}/${mes}/${año}`, estructura, especial, duende, apiKey);

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
          duende: duende.nombre,
          duendeInfo: {
            id: duende.id,
            nombre: duende.nombre,
            nombreCompleto: duende.nombreCompleto,
            imagen: duende.imagen,
            cristales: duende.cristales,
            elemento: duende.elemento
          },
          especial: especial || null,
          estado: fecha <= hoy ? 'publicado' : 'programado',
          generadoEn: new Date().toISOString(),
          publicadoEn: fecha <= hoy ? new Date().toISOString() : null
        };

        await kv.set(`circulo:contenido:${año}:${mes}:${dia}`, contenidoCompleto);
        contenidosGenerados.push({ dia, titulo: contenido.titulo, duende: duende.nombre });

        // Pausa entre llamadas a la API
        await new Promise(r => setTimeout(r, 800));

      } catch (error) {
        errores.push({ dia, error: error.message });
        console.error(`Error día ${dia}:`, error);
      }
    }

    // Guardar índice del mes
    const indice = {
      año,
      mes,
      totalContenidos: contenidosGenerados.length,
      generadoEn: new Date().toISOString(),
      diasConContenido: contenidosGenerados.map(c => c.dia),
      duendesPorSemana: Object.entries(duendesPorSemana).map(([semana, d]) => ({
        semana: parseInt(semana),
        duende: { id: d.id, nombre: d.nombre, imagen: d.imagen }
      })),
      usandoDuendesReales: true
    };

    await kv.set(`circulo:indice:${año}:${mes}`, indice);

    return Response.json({
      success: true,
      mensaje: `Generados ${contenidosGenerados.length} contenidos para ${mes}/${año} con duendes reales`,
      duendesUsados: duendes.map(d => d.nombre),
      contenidos: contenidosGenerados,
      errores: errores.length > 0 ? errores : null
    });

  } catch (error) {
    console.error('[REGENERAR-CONTENIDO] Error:', error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}

// GET - Ver estado de duendes y contenido
export async function GET() {
  try {
    const duendes = await kv.get('circulo:duendes-reales') || [];
    const hoy = new Date();
    const mes = hoy.getMonth() + 1;
    const año = hoy.getFullYear();

    const indice = await kv.get(`circulo:indice:${año}:${mes}`);

    return Response.json({
      success: true,
      duendesReales: {
        total: duendes.length,
        nombres: duendes.map(d => d.nombre)
      },
      contenidoMesActual: indice || { mensaje: 'Sin contenido generado' },
      instrucciones: duendes.length === 0
        ? 'Primero cargá duendes reales en /admin/circulo/duendes'
        : 'Enviá POST para regenerar contenido con los duendes reales'
    });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
