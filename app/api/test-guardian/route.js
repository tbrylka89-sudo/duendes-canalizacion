import { kv } from '@vercel/kv';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// Preguntas del Test del Guardian - DISEÑO DE CONVERSIÓN
// Cada pregunta tiene doble propósito: conectar emocionalmente + detectar perfil de compra
const PREGUNTAS = [
  // === PREGUNTA 1: ESPEJO INICIAL (detecta dolor sin preguntar directo) ===
  {
    id: 1,
    tipo: 'seleccion',
    mensaje: 'Hay personas que sienten que cargan con más de lo que les corresponde. Otras sienten que la vida les debe algo. ¿Cuál te suena más?',
    opciones: [
      { id: 'carga', texto: 'Cargo con todo y nadie me cuida a mí', categoria: 'proteccion', dolor: 'carga_emocional', intensidad: 'alta' },
      { id: 'esquiva', texto: 'Las cosas buenas siempre le pasan a otros', categoria: 'fortuna', dolor: 'mala_suerte', intensidad: 'media' },
      { id: 'vacio', texto: 'Tengo todo pero siento un vacío', categoria: 'sanacion', dolor: 'vacio_existencial', intensidad: 'alta' },
      { id: 'estancada', texto: 'Sé que puedo más pero algo me frena', categoria: 'transformacion', dolor: 'bloqueo', intensidad: 'media' }
    ]
  },
  // === PREGUNTA 2: MOMENTO DE VIDA (detecta urgencia y disposición) ===
  {
    id: 2,
    tipo: 'seleccion',
    mensaje: '¿En qué momento estás ahora?',
    opciones: [
      { id: 'crisis', texto: 'Atravesando algo difícil', momento: 'crisis', urgencia: 'alta', perfil_compra: 'vulnerable' },
      { id: 'transicion', texto: 'Cerrando un ciclo, abriendo otro', momento: 'transicion', urgencia: 'media', perfil_compra: 'buscador_activo' },
      { id: 'busqueda', texto: 'Buscando algo más, no sé qué', momento: 'busqueda', urgencia: 'baja', perfil_compra: 'curioso' },
      { id: 'estable', texto: 'Estable, pero quiero potenciar algo', momento: 'estable', urgencia: 'baja', perfil_compra: 'buscador_activo' }
    ]
  },
  // === PREGUNTA 3: ESPEJO PROFUNDO (valida el dolor) ===
  {
    id: 3,
    tipo: 'seleccion',
    mensaje: '¿Cuál de estas frases podrías haber dicho vos?',
    opciones: [
      { id: 'fuerte', texto: '"Estoy cansada de ser la fuerte para todos"', arquetipo: 'protectora_agotada', categoria: 'proteccion' },
      { id: 'merece', texto: '"A veces siento que no merezco cosas buenas"', arquetipo: 'autoestima_baja', categoria: 'amor_propio' },
      { id: 'repite', texto: '"Siempre termino en el mismo lugar"', arquetipo: 'patron_repetido', categoria: 'sanacion' },
      { id: 'tarde', texto: '"Siento que llego tarde a todo"', arquetipo: 'ansiosa', categoria: 'fortuna' }
    ]
  },
  // === PREGUNTA 4: QUÉ BUSCA (detecta categoría principal) ===
  {
    id: 4,
    tipo: 'seleccion',
    mensaje: 'Si un ser mágico pudiera ayudarte con UNA cosa, ¿cuál elegirías?',
    opciones: [
      { id: 'proteger', texto: 'Que me proteja y cuide mi energía', categoria: 'proteccion', intencion: 'proteccion' },
      { id: 'suerte', texto: 'Que me traiga suerte y oportunidades', categoria: 'fortuna', intencion: 'abundancia' },
      { id: 'sanar', texto: 'Que me ayude a soltar y sanar', categoria: 'sanacion', intencion: 'sanacion' },
      { id: 'amor', texto: 'Que abra mi corazón al amor', categoria: 'amor', intencion: 'amor' },
      { id: 'calma', texto: 'Que me traiga paz y calma', categoria: 'calma', intencion: 'bienestar' }
    ]
  },
  // === PREGUNTA 5: TEXTO LIBRE - DOLOR (análisis con IA) ===
  {
    id: 5,
    tipo: 'texto_libre',
    mensaje: 'Si pudieras contarle a alguien lo que de verdad te pesa... ¿qué le dirías?',
    placeholder: 'No hay respuesta incorrecta. Escribí lo que sientas...',
    analisis: ['dolor', 'urgencia', 'categoria']
  },
  // === PREGUNTA 6: EXPERIENCIA PREVIA (detecta familiaridad con el mundo místico) ===
  {
    id: 6,
    tipo: 'seleccion',
    mensaje: '¿Tenés experiencia con objetos o seres que te acompañen espiritualmente?',
    opciones: [
      { id: 'si_varios', texto: 'Sí, tengo varios y me encantan', experiencia: 'alta', perfil_compra: 'coleccionista' },
      { id: 'si_uno', texto: 'Tengo algo pero quiero más', experiencia: 'media', perfil_compra: 'expansion' },
      { id: 'no_pero', texto: 'No, pero siempre me llamó la atención', experiencia: 'baja', perfil_compra: 'primera_vez' },
      { id: 'esceptica', texto: 'Soy escéptica pero algo me trajo acá', experiencia: 'ninguna', perfil_compra: 'esceptico_curioso' }
    ]
  },
  // === PREGUNTA 7: ESTILO DE MENSAJE ===
  {
    id: 7,
    tipo: 'seleccion',
    mensaje: 'Última: ¿cómo preferís que te hablen?',
    opciones: [
      { id: 'directo', texto: 'Directo, sin vueltas', estilo: 'directo' },
      { id: 'suave', texto: 'Suave y contenedor', estilo: 'suave' },
      { id: 'poetico', texto: 'Poético y profundo', estilo: 'mistico' },
      { id: 'practico', texto: 'Práctico, con acciones claras', estilo: 'practico' }
    ]
  }
];

// Perfiles de compra y qué ofrecerles
const PERFILES_COMPRA = {
  vulnerable: {
    nombre: 'En momento sensible',
    enfoque: 'VALOR PRIMERO, no venta',
    oferta_principal: 'contenido_gratuito',
    oferta_secundaria: 'mini_accesible',
    mensaje: 'No te voy a vender nada. Primero quiero que sepas que no estás sola.',
    cta: 'Recibir mensaje de tu guardián (gratis)'
  },
  buscador_activo: {
    nombre: 'Lista para transformar',
    enfoque: 'Mostrar opciones completas',
    oferta_principal: 'guardian_canalizado',
    oferta_secundaria: 'pack_proteccion',
    mensaje: 'Estás lista. Tu guardián te está esperando.',
    cta: 'Conocer guardianes disponibles'
  },
  curioso: {
    nombre: 'Explorando',
    enfoque: 'Educar y nutrir',
    oferta_principal: 'mini_entrada',
    oferta_secundaria: 'newsletter_valor',
    mensaje: 'No tenés que decidir nada ahora. Solo escuchá lo que tu intuición dice.',
    cta: 'Ver guardianes de entrada'
  },
  coleccionista: {
    nombre: 'Ya conoce el mundo',
    enfoque: 'Mostrar piezas especiales',
    oferta_principal: 'pieza_unica',
    oferta_secundaria: 'maestro_mistico',
    mensaje: 'Tenemos piezas que no mostramos a todos. Vos ya sabés reconocerlas.',
    cta: 'Ver piezas exclusivas'
  },
  expansion: {
    nombre: 'Quiere crecer su familia',
    enfoque: 'Complementar lo que tiene',
    oferta_principal: 'guardian_complementario',
    oferta_secundaria: 'pack_familia',
    mensaje: 'Tu guardián actual va a estar feliz de tener compañía.',
    cta: 'Ver guardianes que complementan'
  },
  primera_vez: {
    nombre: 'Primera experiencia',
    enfoque: 'Guiar con cariño',
    oferta_principal: 'mini_especial',
    oferta_secundaria: 'guia_cuidado',
    mensaje: 'Tu primer guardián es especial. Te voy a ayudar a elegir el indicado.',
    cta: 'Empezar con un mini especial'
  },
  esceptico_curioso: {
    nombre: 'Escéptico pero abierto',
    enfoque: 'Sin presión, dejar que sienta',
    oferta_principal: 'contenido_valor',
    oferta_secundaria: 'mini_sin_compromiso',
    mensaje: 'No tenés que creer en nada. Solo notá qué sentiste al leer esto.',
    cta: 'Seguir explorando sin compromiso'
  }
};

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
