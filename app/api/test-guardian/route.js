import { kv } from '@vercel/kv';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// Preguntas del Test del Guardian Evolutivo
const PREGUNTAS = [
  {
    id: 1,
    tipo: 'seleccion',
    mensaje: '¿Que te trajo hasta aca hoy?',
    opciones: [
      { id: 'proteccion', texto: 'Necesito sentirme protegida', arquetipo: 'victima', intencion: 'proteccion' },
      { id: 'respuestas', texto: 'Busco respuestas sobre mi vida', arquetipo: 'buscadora', intencion: 'claridad' },
      { id: 'ciclos', texto: 'Quiero romper patrones que se repiten', arquetipo: 'repite_patrones', intencion: 'transformacion' },
      { id: 'sanar', texto: 'Estoy en proceso de sanacion', arquetipo: 'sanadora_herida', intencion: 'sanacion' },
      { id: 'amor', texto: 'Quiero atraer mas amor a mi vida', arquetipo: 'busca_amor', intencion: 'amor' }
    ]
  },
  {
    id: 2,
    tipo: 'seleccion',
    mensaje: 'Cuando estas sola en casa de noche, ¿que sentis?',
    opciones: [
      { id: 'presencia', texto: 'Una presencia que me cuida', elemento: 'tierra' },
      { id: 'pensamientos', texto: 'Pensamientos que no paran', elemento: 'aire' },
      { id: 'emociones', texto: 'Emociones profundas que suben', elemento: 'agua' },
      { id: 'energia', texto: 'Energia inquieta, ganas de hacer', elemento: 'fuego' }
    ]
  },
  {
    id: 3,
    tipo: 'seleccion',
    mensaje: '¿Cual de estas frases te describe mejor ahora?',
    opciones: [
      { id: 'cansada', texto: 'Estoy cansada de ser la fuerte', arquetipo: 'sanadora_herida' },
      { id: 'sola', texto: 'Me siento sola aunque este acompanada', arquetipo: 'busca_amor' },
      { id: 'atrapada', texto: 'Siento que algo me frena pero no se que', arquetipo: 'victima' },
      { id: 'perdida', texto: 'Probe de todo pero nada me llena', arquetipo: 'buscadora' }
    ]
  },
  {
    id: 4,
    tipo: 'seleccion',
    mensaje: 'Si pudieras elegir UN regalo del universo, ¿cual seria?',
    opciones: [
      { id: 'paz', texto: 'Paz interior profunda', categoria: 'sanacion' },
      { id: 'seguridad', texto: 'Proteccion absoluta', categoria: 'proteccion' },
      { id: 'abundancia', texto: 'Que el dinero fluya sin esfuerzo', categoria: 'abundancia' },
      { id: 'amor_verdadero', texto: 'Amor verdadero y duradero', categoria: 'amor' }
    ]
  },
  {
    id: 5,
    tipo: 'texto_libre',
    mensaje: 'Contame con tus palabras: ¿que es lo que MAS te duele en este momento de tu vida?',
    placeholder: 'Escribi lo que sientas, no hay respuesta incorrecta...',
    analisis: ['dolor', 'arquetipo']
  },
  {
    id: 6,
    tipo: 'texto_libre',
    mensaje: 'Si pudieras pedirle algo al universo, algo que cambiaria todo... ¿que seria?',
    placeholder: 'Tu deseo mas profundo...',
    analisis: ['deseo', 'intencion']
  },
  {
    id: 7,
    tipo: 'seleccion',
    mensaje: 'Ultima pregunta: ¿como preferis recibir mensajes?',
    opciones: [
      { id: 'directo', texto: 'Directo y claro, sin vueltas', estilo: 'directo' },
      { id: 'suave', texto: 'Suave y contenedor', estilo: 'suave' },
      { id: 'mistico', texto: 'Poetico y mistico', estilo: 'mistico' },
      { id: 'practico', texto: 'Practico con acciones concretas', estilo: 'practico' }
    ]
  }
];

// GET: Retorna las preguntas del test
export async function GET() {
  return Response.json({
    success: true,
    preguntas: PREGUNTAS,
    version: '1.0'
  });
}

// POST: Procesa respuestas y genera resultado
export async function POST(request) {
  try {
    const { email, respuestas, nombre } = await request.json();

    if (!email || !respuestas) {
      return Response.json({ success: false, error: 'Faltan datos' }, { status: 400 });
    }

    // 1. Analizar respuestas de seleccion
    const analisis = analizarRespuestas(respuestas);

    // 2. Analizar texto libre con IA
    const textoLibreAnalisis = await analizarTextoLibre(
      respuestas[5]?.texto || '',
      respuestas[6]?.texto || '',
      nombre
    );

    // 3. Combinar analisis
    const resultado = combinarAnalisis(analisis, textoLibreAnalisis);

    // 4. Generar revelacion emocional
    const revelacion = await generarRevelacion(resultado, nombre);

    // 5. Obtener recomendaciones de productos (simulado por ahora)
    const productosRecomendados = generarRecomendaciones(resultado);

    // 6. Construir resultado final
    const testGuardian = {
      fecha: new Date().toISOString(),
      version: '1.0',
      arquetipoPrincipal: resultado.arquetipoPrincipal,
      arquetipoSecundario: resultado.arquetipoSecundario,
      arquetipoDetalle: resultado.arquetipoScores,
      elemento: resultado.elemento,
      intencionPrincipal: resultado.intencion,
      categoriaPrincipal: resultado.categoria,
      dolorDetectado: textoLibreAnalisis.dolor_clave || [],
      deseosClave: textoLibreAnalisis.deseo_clave || [],
      estiloMensaje: resultado.estilo,
      productosRecomendados,
      revelacion
    };

    // 7. Guardar en KV
    const userData = await kv.get(`user:${email}`) || await kv.get(`elegido:${email}`) || {};
    userData.testGuardian = testGuardian;
    userData.testGuardianRaw = respuestas;

    if (userData.email) {
      await kv.set(`user:${email}`, userData);
    } else {
      await kv.set(`elegido:${email}`, { ...userData, email });
    }

    return Response.json({
      success: true,
      resultado: testGuardian
    });

  } catch (error) {
    console.error('Error en test-guardian:', error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}

// Analizar respuestas de seleccion
function analizarRespuestas(respuestas) {
  const arquetipoScores = {
    victima: 0,
    buscadora: 0,
    repite_patrones: 0,
    sanadora_herida: 0,
    busca_amor: 0
  };

  const elementoScores = { tierra: 0, aire: 0, agua: 0, fuego: 0 };
  let intencion = 'sanacion';
  let categoria = 'sanacion';
  let estilo = 'suave';

  // Pregunta 1: arquetipo + intencion
  if (respuestas[1]?.arquetipo) {
    arquetipoScores[respuestas[1].arquetipo] += 30;
    intencion = respuestas[1].intencion || intencion;
  }

  // Pregunta 2: elemento
  if (respuestas[2]?.elemento) {
    elementoScores[respuestas[2].elemento] += 40;
  }

  // Pregunta 3: arquetipo
  if (respuestas[3]?.arquetipo) {
    arquetipoScores[respuestas[3].arquetipo] += 25;
  }

  // Pregunta 4: categoria
  if (respuestas[4]?.categoria) {
    categoria = respuestas[4].categoria;
  }

  // Pregunta 7: estilo
  if (respuestas[7]?.estilo) {
    estilo = respuestas[7].estilo;
  }

  // Determinar principales
  const arquetiposSorted = Object.entries(arquetipoScores).sort((a, b) => b[1] - a[1]);
  const elementosSorted = Object.entries(elementoScores).sort((a, b) => b[1] - a[1]);

  return {
    arquetipoPrincipal: arquetiposSorted[0][0],
    arquetipoSecundario: arquetiposSorted[1][0],
    arquetipoScores,
    elemento: elementosSorted[0][0],
    intencion,
    categoria,
    estilo
  };
}

// Analizar texto libre con IA
async function analizarTextoLibre(dolor, deseo, nombre) {
  if (!dolor && !deseo) {
    return { dolor_clave: [], deseo_clave: [], arquetipo_sugerido: null };
  }

  try {
    const prompt = `Analiza estas respuestas de ${nombre || 'una mujer'} en busqueda espiritual (35-65 años).

DOLOR EXPRESADO:
"${dolor}"

DESEO EXPRESADO:
"${deseo}"

Extrae en formato JSON:
{
  "dolor_clave": ["max 3 palabras clave del dolor"],
  "deseo_clave": ["max 3 palabras clave del deseo"],
  "arquetipo_sugerido": "victima|buscadora|repite_patrones|sanadora_herida|busca_amor|null",
  "intensidad_emocional": "alta|media|baja"
}

Solo responde con el JSON, nada mas.`;

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 300,
      messages: [{ role: 'user', content: prompt }]
    });

    const texto = response.content[0].text.trim();
    return JSON.parse(texto);
  } catch (error) {
    console.error('Error analizando texto:', error);
    return { dolor_clave: [], deseo_clave: [], arquetipo_sugerido: null };
  }
}

// Combinar analisis
function combinarAnalisis(analisis, textoLibre) {
  // Si el texto libre sugiere un arquetipo diferente, ajustar scores
  if (textoLibre.arquetipo_sugerido && analisis.arquetipoScores[textoLibre.arquetipo_sugerido] !== undefined) {
    analisis.arquetipoScores[textoLibre.arquetipo_sugerido] += 20;

    // Recalcular principal
    const sorted = Object.entries(analisis.arquetipoScores).sort((a, b) => b[1] - a[1]);
    analisis.arquetipoPrincipal = sorted[0][0];
    analisis.arquetipoSecundario = sorted[1][0];
  }

  return { ...analisis, ...textoLibre };
}

// Generar revelacion emocional con IA
async function generarRevelacion(resultado, nombre) {
  const arquetipoNombres = {
    victima: 'Alma en Busca de Refugio',
    buscadora: 'Eterna Buscadora',
    repite_patrones: 'Rompedora de Ciclos',
    sanadora_herida: 'Sanadora en Despertar',
    busca_amor: 'Corazon Abierto'
  };

  const elementoEmojis = {
    tierra: '🌿',
    agua: '🌊',
    fuego: '🔥',
    aire: '💨'
  };

  try {
    const prompt = `Genera una revelacion emocional para ${nombre || 'esta mujer'}.

PERFIL:
- Arquetipo principal: ${resultado.arquetipoPrincipal}
- Elemento: ${resultado.elemento}
- Dolor detectado: ${resultado.dolor_clave?.join(', ') || 'no especificado'}
- Deseo: ${resultado.deseo_clave?.join(', ') || 'no especificado'}

Escribe en español rioplatense (vos, tenes). Tono: calido, profundo, esperanzador. NO uses frases genericas de IA.

Formato JSON:
{
  "mensaje": "Mensaje principal de 60-80 palabras que toque el corazon",
  "mensaje_guardian": "Mensaje corto (40 palabras) como si fuera el guardian hablando en primera persona",
  "ritual_sugerido": "Un ritual simple de 1-2 oraciones"
}`;

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 500,
      messages: [{ role: 'user', content: prompt }]
    });

    const generated = JSON.parse(response.content[0].text.trim());

    return {
      titulo: arquetipoNombres[resultado.arquetipoPrincipal] || 'Alma Unica',
      subtitulo: `${elementoEmojis[resultado.elemento] || '✨'} ${resultado.elemento?.charAt(0).toUpperCase() + resultado.elemento?.slice(1)} + ${resultado.arquetipoPrincipal?.replace('_', ' ')}`,
      mensaje: generated.mensaje,
      mensajeGuardian: generated.mensaje_guardian,
      ritualSugerido: generated.ritual_sugerido,
      colorEnergetico: getColorByElemento(resultado.elemento)
    };
  } catch (error) {
    console.error('Error generando revelacion:', error);
    return {
      titulo: arquetipoNombres[resultado.arquetipoPrincipal] || 'Alma Unica',
      subtitulo: `${elementoEmojis[resultado.elemento] || '✨'} Tu esencia`,
      mensaje: 'Tu camino es unico y tu guardian te esta esperando. Lo que buscas ya vive dentro tuyo.',
      mensajeGuardian: 'Llegue porque me llamaste. Estoy aca para acompanarte.',
      ritualSugerido: 'Esta noche, antes de dormir, coloca una mano en tu corazon y respira profundo.',
      colorEnergetico: '#d4af37'
    };
  }
}

// Color por elemento
function getColorByElemento(elemento) {
  const colores = {
    tierra: '#56ab91',
    agua: '#4a90a4',
    fuego: '#e75480',
    aire: '#9b59b6'
  };
  return colores[elemento] || '#d4af37';
}

// Generar recomendaciones (placeholder - se puede conectar a WooCommerce)
function generarRecomendaciones(resultado) {
  const recomendaciones = {
    proteccion: [
      { nombre: 'Guardian de la Proteccion', matchScore: 95, razon: 'Especialista en crear escudos energeticos' },
      { nombre: 'Duende del Hogar Seguro', matchScore: 88, razon: 'Protege tu espacio sagrado' }
    ],
    abundancia: [
      { nombre: 'Guardian de la Abundancia', matchScore: 95, razon: 'Desbloquea el flujo de prosperidad' },
      { nombre: 'Hada del Oro Interior', matchScore: 85, razon: 'Trabaja con tu merecimiento' }
    ],
    amor: [
      { nombre: 'Guardian del Amor', matchScore: 95, razon: 'Abre el corazon a dar y recibir' },
      { nombre: 'Duende del Vinculo Sagrado', matchScore: 87, razon: 'Sana heridas de relaciones pasadas' }
    ],
    sanacion: [
      { nombre: 'Guardian Sanador', matchScore: 95, razon: 'Especialista en sanar heridas emocionales' },
      { nombre: 'Hada de la Paz Interior', matchScore: 90, razon: 'Trae calma a tu alma cansada' }
    ]
  };

  return recomendaciones[resultado.categoria] || recomendaciones.sanacion;
}
