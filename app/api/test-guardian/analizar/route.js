/**
 * API: ANALISIS COMPLETO DEL TEST DEL GUARDIAN v2
 * Recibe respuestas del test y devuelve:
 * - Perfil psicologico completo
 * - Sincronicidades personalizadas
 * - Guardian recomendado (producto real de WooCommerce)
 * - Mensaje personalizado generado con IA
 * - Estrategias de conversion aplicadas
 * Ultimo update: 2026-01-25
 */

import { NextResponse } from 'next/server';
import WooCommerceRestApi from '@woocommerce/woocommerce-rest-api';
import Anthropic from '@anthropic-ai/sdk';

// ===== CONFIGURACION WOOCOMMERCE =====
const woo = new WooCommerceRestApi({
  url: process.env.WORDPRESS_URL || 'https://duendesdeluruguay.com',
  consumerKey: process.env.WOO_CONSUMER_KEY,
  consumerSecret: process.env.WOO_CONSUMER_SECRET,
  version: 'wc/v3'
});

// ===== CONFIGURACION ANTHROPIC (lazy) =====
let anthropicClient = null;
function getAnthropicClient() {
  if (!anthropicClient && process.env.ANTHROPIC_API_KEY) {
    anthropicClient = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY
    });
  }
  return anthropicClient;
}

// ===== ESTRATEGIAS DE CONVERSION PROBADAS =====
const CONVERSION_STRATEGIES = {
  // Escasez: solo quedan X - compra impulsiva
  escasez: {
    textos: [
      'Este guardian es pieza unica - cuando encuentre hogar, desaparece para siempre.',
      'Solo queda uno disponible. Si sigue aca manana, sera por algo.',
      'Es el ultimo de su especie en el taller.'
    ]
  },
  // Prueba social: otros compraron
  pruebaSocial: {
    textos: [
      '{n} personas eligieron este guardian esta semana.',
      'Es uno de los guardianes mas buscados de la tienda.',
      'Muchas almas sensibles como vos encontraron en el a su companero.'
    ]
  },
  // Aversion a la perdida: lo que perdes si no actuas
  aversionPerdida: {
    textos: [
      'Lo que sentiste al verlo no va a volver si dejas que otro lo adopte.',
      'Esa conexion que sentis ahora es real. Ignorarla tiene un costo.',
      'Los guardianes eligen a sus humanos. Si te llamo, hay una razon.'
    ]
  },
  // Urgencia temporal: actuar ahora
  urgencia: {
    textos: [
      'Este momento de claridad es un regalo. No lo dejes pasar.',
      'Tu intuicion te trajo hasta aca en este preciso momento.',
      'Lo que buscas ya te encontro. Solo falta que digas si.'
    ]
  },
  // Reciprocidad: ya te di algo
  reciprocidad: {
    textos: [
      'Ya compartimos algo importante vos y yo. Este test fue un encuentro real.',
      'Lo que te conte sobre vos no te lo cuento a cualquiera.',
      'Ya te vi. Ya te escuche. El primer paso ya esta dado.'
    ]
  },
  // Compromiso: pequeños pasos
  compromiso: {
    textos: [
      'No tenes que decidir ahora. Pero dejame guardarte un lugar en tu corazon.',
      'Simplemente agendalo para cuando estes lista. Sin presion.',
      'Dame tu email y te cuento mas sobre nosotros. Sin compromiso.'
    ]
  }
};

// ===== SISTEMA DE PERFILADO =====

const NIVELES_VULNERABILIDAD = {
  alta: { id: 'alta', enfoque: 'EMPATIA_PRIMERO', presion: 0 },
  media: { id: 'media', enfoque: 'VALOR_GRADUAL', presion: 30 },
  baja: { id: 'baja', enfoque: 'OFERTA_DIRECTA', presion: 60 }
};

const TIPOS_DOLOR = {
  soledad: { id: 'soledad', categorias: ['amor', 'proteccion'], mensaje: 'Sentirte acompanada no es debilidad, es sabiduria' },
  dinero: { id: 'dinero', categorias: ['dinero-abundancia-negocios', 'abundancia'], mensaje: 'La abundancia empieza cuando dejas de bloquearla' },
  salud: { id: 'salud', categorias: ['salud', 'sanacion'], mensaje: 'Tu cuerpo escucha lo que tu mente calla' },
  relaciones: { id: 'relaciones', categorias: ['amor'], mensaje: 'El amor que buscas afuera ya vive adentro' },
  proposito: { id: 'proposito', categorias: ['sabiduria-guia-claridad', 'sabiduria'], mensaje: 'No estas perdida, estas en transicion' }
};

const ESTILOS_DECISION = {
  impulsivo: { id: 'impulsivo', cierre: 'urgencia', elementos: ['escasez', 'accion_inmediata'] },
  analitico: { id: 'analitico', cierre: 'racional', elementos: ['beneficios_claros', 'garantias'] },
  emocional: { id: 'emocional', cierre: 'conexion', elementos: ['testimonios', 'historias'] }
};

// ===== SINCRONICIDADES =====

const DIAS_SEMANA = {
  0: { planeta: 'Sol', mensaje: 'El domingo es el dia del Sol. No es casualidad que estes aca hoy: es momento de renovar tu luz interior.' },
  1: { planeta: 'Luna', mensaje: 'Lunes, dia de la Luna. Tu intuicion te trajo hasta aca, y la Luna no se equivoca.' },
  2: { planeta: 'Marte', mensaje: 'Martes, el dia de Marte. Llegaste en el dia de la accion. Algo en vos esta listo para moverse.' },
  3: { planeta: 'Mercurio', mensaje: 'Miercoles, dia de Mercurio. Viniste buscando claridad, y eso ya dice mucho de vos.' },
  4: { planeta: 'Jupiter', mensaje: 'Jueves, el dia de Jupiter. Llegaste en el dia de la expansion. El universo esta abriendo puertas.' },
  5: { planeta: 'Venus', mensaje: 'Viernes, dia de Venus. El amor y la belleza te trajeron aca. Tu corazon sabe lo que busca.' },
  6: { planeta: 'Saturno', mensaje: 'Sabado, dia de Saturno. Llegaste en el dia de la paciencia. Lo que se construye bien, perdura.' }
};

const SIGNOS_ZODIACALES = {
  aries: { nombre: 'Aries', emoji: '♈', elemento: 'fuego', mensaje: 'Tu espiritu guerrero necesita un guardian que entienda tu fuego interior.' },
  tauro: { nombre: 'Tauro', emoji: '♉', elemento: 'tierra', mensaje: 'Tu conexion con la tierra te hace receptiva a guardianes de abundancia y estabilidad.' },
  geminis: { nombre: 'Geminis', emoji: '♊', elemento: 'aire', mensaje: 'Tu mente curiosa atrae guardianes de sabiduria y comunicacion.' },
  cancer: { nombre: 'Cancer', emoji: '♋', elemento: 'agua', mensaje: 'Tu sensibilidad emocional te conecta profundamente con guardianes protectores.' },
  leo: { nombre: 'Leo', emoji: '♌', elemento: 'fuego', mensaje: 'Tu luz interior atrae guardianes que potencian tu brillo natural.' },
  virgo: { nombre: 'Virgo', emoji: '♍', elemento: 'tierra', mensaje: 'Tu busqueda de perfeccion te conecta con guardianes sanadores.' },
  libra: { nombre: 'Libra', emoji: '♎', elemento: 'aire', mensaje: 'Tu busqueda de equilibrio atrae guardianes de armonia y amor.' },
  escorpio: { nombre: 'Escorpio', emoji: '♏', elemento: 'agua', mensaje: 'Tu profundidad emocional te conecta con guardianes de transformacion.' },
  sagitario: { nombre: 'Sagitario', emoji: '♐', elemento: 'fuego', mensaje: 'Tu espiritu aventurero atrae guardianes de expansion y sabiduria.' },
  capricornio: { nombre: 'Capricornio', emoji: '♑', elemento: 'tierra', mensaje: 'Tu determinacion te conecta con guardianes de abundancia y estructura.' },
  acuario: { nombre: 'Acuario', emoji: '♒', elemento: 'aire', mensaje: 'Tu vision unica atrae guardianes de intuicion y cambio.' },
  piscis: { nombre: 'Piscis', emoji: '♓', elemento: 'agua', mensaje: 'Tu sensibilidad espiritual te conecta con todos los reinos de guardianes.' }
};

// ===== FUNCIONES DE ANALISIS =====

function calcularSigno(fechaNacimiento) {
  const fecha = new Date(fechaNacimiento);
  const mes = fecha.getMonth() + 1;
  const dia = fecha.getDate();

  if ((mes === 3 && dia >= 21) || (mes === 4 && dia <= 19)) return 'aries';
  if ((mes === 4 && dia >= 20) || (mes === 5 && dia <= 20)) return 'tauro';
  if ((mes === 5 && dia >= 21) || (mes === 6 && dia <= 20)) return 'geminis';
  if ((mes === 6 && dia >= 21) || (mes === 7 && dia <= 22)) return 'cancer';
  if ((mes === 7 && dia >= 23) || (mes === 8 && dia <= 22)) return 'leo';
  if ((mes === 8 && dia >= 23) || (mes === 9 && dia <= 22)) return 'virgo';
  if ((mes === 9 && dia >= 23) || (mes === 10 && dia <= 22)) return 'libra';
  if ((mes === 10 && dia >= 23) || (mes === 11 && dia <= 21)) return 'escorpio';
  if ((mes === 11 && dia >= 22) || (mes === 12 && dia <= 21)) return 'sagitario';
  if ((mes === 12 && dia >= 22) || (mes === 1 && dia <= 19)) return 'capricornio';
  if ((mes === 1 && dia >= 20) || (mes === 2 && dia <= 18)) return 'acuario';
  return 'piscis';
}

function analizarVulnerabilidad(respuestas) {
  let score = 0;

  // Analizar respuestas emocionales
  const textoLibre = Object.values(respuestas).filter(r => typeof r === 'string').join(' ').toLowerCase();

  // Palabras de alta vulnerabilidad
  const palabrasAlta = ['solo', 'sola', 'nadie', 'abandono', 'miedo', 'ansiedad', 'depresion', 'no puedo', 'ayuda'];
  palabrasAlta.forEach(p => { if (textoLibre.includes(p)) score += 15; });

  // Palabras de media vulnerabilidad
  const palabrasMedia = ['dificil', 'cansada', 'confundida', 'perdida', 'frustrada', 'triste'];
  palabrasMedia.forEach(p => { if (textoLibre.includes(p)) score += 8; });

  // Momento de vida
  if (respuestas.momentoVida === 'crisis') score += 25;
  if (respuestas.momentoVida === 'transicion') score += 15;
  if (respuestas.momentoVida === 'estancamiento') score += 10;

  if (score >= 40) return 'alta';
  if (score >= 20) return 'media';
  return 'baja';
}

function detectarDolorPrincipal(respuestas) {
  const textoLibre = Object.values(respuestas).filter(r => typeof r === 'string').join(' ').toLowerCase();

  const scores = {
    soledad: 0,
    dinero: 0,
    salud: 0,
    relaciones: 0,
    proposito: 0
  };

  // Palabras clave por dolor
  if (textoLibre.match(/sol[oa]|aislad|nadie|acompan/)) scores.soledad += 20;
  if (textoLibre.match(/plata|dinero|trabajo|deuda|abundancia|econom/)) scores.dinero += 20;
  if (textoLibre.match(/salud|enferm|dolor|cuerpo|cansa|energia/)) scores.salud += 20;
  if (textoLibre.match(/pareja|amor|relacion|familia|hij|separac/)) scores.relaciones += 20;
  if (textoLibre.match(/sentido|proposito|direccion|perdid|rumbo|mision/)) scores.proposito += 20;

  // Por respuesta directa si existe
  if (respuestas.necesidad === 'proteccion') scores.relaciones += 15;
  if (respuestas.necesidad === 'abundancia') scores.dinero += 15;
  if (respuestas.necesidad === 'sanacion') scores.salud += 15;
  if (respuestas.necesidad === 'claridad') scores.proposito += 15;
  if (respuestas.necesidad === 'conexion') scores.soledad += 15;

  // Encontrar el mayor
  let maxDolor = 'proposito';
  let maxScore = 0;
  for (const [dolor, score] of Object.entries(scores)) {
    if (score > maxScore) {
      maxScore = score;
      maxDolor = dolor;
    }
  }

  return maxDolor;
}

function detectarEstiloDecision(respuestas) {
  // Basado en como respondieron y que eligieron
  if (respuestas.estilo === 'rapido' || respuestas.tiempoDecision === 'ahora') return 'impulsivo';
  if (respuestas.estilo === 'investigo' || respuestas.tiempoDecision === 'pienso') return 'analitico';
  return 'emocional';
}

function generarSincronicidades(nombre, fechaNacimiento) {
  const sincronicidades = [];
  const ahora = new Date();

  // Sincronicidad del dia
  const diaSemana = DIAS_SEMANA[ahora.getDay()];
  sincronicidades.push({
    tipo: 'dia',
    mensaje: diaSemana.mensaje,
    planeta: diaSemana.planeta
  });

  // Sincronicidad del nombre
  if (nombre) {
    const letras = nombre.length;
    const mensajesLetras = {
      3: 'Tu nombre tiene 3 letras. El numero de la creatividad y expresion.',
      4: 'Tu nombre tiene 4 letras. El numero de la estabilidad y los cimientos.',
      5: 'Tu nombre tiene 5 letras. El numero del cambio y la libertad.',
      6: 'Tu nombre tiene 6 letras. El numero del amor y la armonia.',
      7: 'Tu nombre tiene 7 letras. El numero de la espiritualidad y la busqueda.',
      8: 'Tu nombre tiene 8 letras. El numero de la abundancia y el poder.',
      9: 'Tu nombre tiene 9 letras. El numero de la completitud y la sabiduria.'
    };
    if (mensajesLetras[letras]) {
      sincronicidades.push({
        tipo: 'nombre',
        mensaje: mensajesLetras[letras],
        detalle: `${nombre} - ${letras} letras`
      });
    }
  }

  // Sincronicidad de cumpleanos
  if (fechaNacimiento) {
    const cumple = new Date(fechaNacimiento);
    const hoy = new Date();
    const diasParaCumple = Math.ceil((new Date(hoy.getFullYear(), cumple.getMonth(), cumple.getDate()) - hoy) / (1000 * 60 * 60 * 24));

    if (diasParaCumple >= 0 && diasParaCumple <= 30) {
      sincronicidades.push({
        tipo: 'cumpleanos',
        mensaje: diasParaCumple === 0
          ? 'Hoy es tu cumpleanos. Los guardianes que aparecen hoy traen regalos especiales del universo.'
          : `Faltan ${diasParaCumple} dias para tu cumpleanos. Este es tu portal de renovacion.`,
        detalle: `Cumpleanos en ${diasParaCumple} dias`
      });
    }
  }

  // Sincronicidad de hora
  const hora = ahora.getHours();
  const minutos = ahora.getMinutes();
  if (hora === minutos || (hora === 11 && minutos === 11) || (hora === 22 && minutos === 22)) {
    sincronicidades.push({
      tipo: 'hora_espejo',
      mensaje: `Llegaste a las ${hora}:${minutos.toString().padStart(2, '0')}. Hora espejo. El universo te esta prestando atencion.`,
      detalle: 'Hora espejo'
    });
  }

  return sincronicidades;
}

async function buscarGuardianIdeal(perfil) {
  try {
    // Obtener productos de WooCommerce
    const response = await woo.get('products', {
      per_page: 100,
      status: 'publish',
      stock_status: 'instock'
    });

    const productos = response.data;
    if (!productos || productos.length === 0) {
      return null;
    }

    // Categorias ideales segun el dolor principal
    const categoriasIdeales = TIPOS_DOLOR[perfil.dolorPrincipal]?.categorias || [];

    // Puntuar cada producto
    const productosConScore = productos.map(producto => {
      let score = 0;

      // Match por categoria
      const categorias = producto.categories?.map(c => c.slug) || [];
      categoriasIdeales.forEach(cat => {
        if (categorias.some(c => c.includes(cat))) score += 30;
      });

      // Match por descripcion (keywords del dolor)
      const descripcion = (producto.description + ' ' + producto.short_description).toLowerCase();
      if (perfil.dolorPrincipal === 'soledad' && descripcion.match(/acompan|soledad|conexion/)) score += 20;
      if (perfil.dolorPrincipal === 'dinero' && descripcion.match(/abundancia|prosperidad|dinero/)) score += 20;
      if (perfil.dolorPrincipal === 'salud' && descripcion.match(/sana|salud|energia|equilibrio/)) score += 20;
      if (perfil.dolorPrincipal === 'relaciones' && descripcion.match(/amor|corazon|relacion/)) score += 20;
      if (perfil.dolorPrincipal === 'proposito' && descripcion.match(/camino|sabidur|guia|proposito/)) score += 20;

      // Match por elemento del signo
      const elementoSigno = SIGNOS_ZODIACALES[perfil.signo]?.elemento;
      if (elementoSigno && descripcion.includes(elementoSigno)) score += 15;

      // Bonus por precio accesible si vulnerabilidad alta
      if (perfil.vulnerabilidad === 'alta' && parseFloat(producto.price) < 50) score += 10;

      return { ...producto, score };
    });

    // Ordenar por score y tomar el mejor
    productosConScore.sort((a, b) => b.score - a.score);
    const mejor = productosConScore[0];

    return {
      id: mejor.id,
      nombre: mejor.name,
      precio: mejor.price,
      imagen: mejor.images?.[0]?.src || '',
      descripcion: mejor.short_description?.replace(/<[^>]*>/g, '') || '',
      url: mejor.permalink,
      slug: mejor.slug,
      categoria: mejor.categories?.[0]?.name || 'Guardian',
      score: mejor.score,
      alternativas: productosConScore.slice(1, 4).map(p => ({
        id: p.id,
        nombre: p.name,
        imagen: p.images?.[0]?.src || '',
        precio: p.price,
        url: p.permalink
      }))
    };
  } catch (error) {
    console.error('[buscarGuardianIdeal] Error:', error);
    return null;
  }
}

function generarMensajeFallback(perfil, guardian, nombre) {
  const nombreUsuario = nombre || 'buscador';
  const dolor = TIPOS_DOLOR[perfil.dolorPrincipal];

  // Mensaje base segun vulnerabilidad
  let mensaje = '';

  if (perfil.vulnerabilidad === 'alta') {
    mensaje = `${nombreUsuario}, te estuve esperando. Se lo que cargas, y quiero que sepas algo importante: no tenes que seguir haciendolo sola. `;
  } else if (perfil.vulnerabilidad === 'media') {
    mensaje = `${nombreUsuario}, hay algo en vos que me llamo. Una busqueda, una pregunta sin responder. `;
  } else {
    mensaje = `${nombreUsuario}, llegaste en el momento justo. Estabas lista, y yo tambien. `;
  }

  // Agregar segun dolor
  mensaje += dolor?.mensaje || '';

  // Cierre segun estilo de decision
  if (perfil.estiloDecision === 'impulsivo') {
    mensaje += ` No lo pienses demasiado. Lo que sentis ahora es real.`;
  } else if (perfil.estiloDecision === 'analitico') {
    mensaje += ` Toma el tiempo que necesites. Pero escucha: la razon no siempre tiene las respuestas que el corazon busca.`;
  } else {
    mensaje += ` Dejate sentir lo que este momento desperto en vos.`;
  }

  return mensaje;
}

// ===== GENERACION CON IA (ANTHROPIC) =====

async function generarMensajeConIA(perfil, guardian, nombre, sincronicidades, respuestas) {
  try {
    const client = getAnthropicClient();
    if (!client) {
      console.log('[IA] No hay cliente de Anthropic disponible, usando fallback');
      return null;
    }

    const nombreUsuario = nombre || 'alma buscadora';
    const dolor = TIPOS_DOLOR[perfil.dolorPrincipal];
    const signo = SIGNOS_ZODIACALES[perfil.signo];

    // Construir contexto rico para la IA
    const contexto = `
CONTEXTO DEL USUARIO:
- Nombre: ${nombreUsuario}
- Signo: ${signo?.nombre || 'desconocido'} (${signo?.elemento || ''})
- Vulnerabilidad: ${perfil.vulnerabilidad}
- Dolor principal: ${perfil.dolorPrincipal} - ${dolor?.mensaje || ''}
- Estilo de decision: ${perfil.estiloDecision}
- Respuestas del test: ${JSON.stringify(respuestas).substring(0, 500)}

GUARDIAN RECOMENDADO:
- Nombre: ${guardian?.nombre || 'Guardian protector'}
- Categoria: ${guardian?.categoria || 'Proteccion'}
- Descripcion: ${guardian?.descripcion || ''}

SINCRONICIDADES:
${sincronicidades.map(s => `- ${s.tipo}: ${s.mensaje}`).join('\n')}

ESTRATEGIA DE CONVERSION A APLICAR:
${perfil.estiloDecision === 'impulsivo' ? 'URGENCIA + ESCASEZ: actuar ahora, es unico, momento especial' : ''}
${perfil.estiloDecision === 'analitico' ? 'RECIPROCIDAD + COMPROMISO: ya te di valor, sin presion, pequeno paso' : ''}
${perfil.estiloDecision === 'emocional' ? 'AVERSION PERDIDA + PRUEBA SOCIAL: conexion real, otros lo eligieron' : ''}
`;

    const response = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 600,
      messages: [{
        role: 'user',
        content: `Sos ${guardian?.nombre || 'un guardian magico'} de Duendes del Uruguay.

Escribi un mensaje PERSONAL de 3-4 oraciones para ${nombreUsuario} que acaba de hacer el Test del Guardian.

REGLAS CRITICAS:
1. Habla como un ser real que CONOCE a esta persona, no como IA generica
2. Menciona algo ESPECIFICO de sus respuestas o situacion
3. Usa espanol rioplatense (vos, tenes, podes)
4. NO uses frases cliche ("desde las profundidades", "brumas ancestrales", etc)
5. Incluye sutilmente UNA estrategia de conversion sin sonar a venta
6. El tono es cercano, calido, directo - como un amigo sabio
7. Termina con algo que invite a la accion sin presionar

${contexto}

IMPORTANTE: El mensaje debe sentirse como si el guardian REALMENTE conociera a la persona y le hablara desde el corazon. Nada generico.`
      }]
    });

    return response.content[0].text;
  } catch (error) {
    console.error('[generarMensajeConIA] Error:', error);
    return null;
  }
}

// ===== SELECCION DE ESTRATEGIAS DE CONVERSION =====

function seleccionarEstrategias(perfil, guardian) {
  const estrategiasSeleccionadas = [];

  // Segun estilo de decision
  if (perfil.estiloDecision === 'impulsivo') {
    estrategiasSeleccionadas.push({
      tipo: 'urgencia',
      texto: CONVERSION_STRATEGIES.urgencia.textos[Math.floor(Math.random() * 3)]
    });
    estrategiasSeleccionadas.push({
      tipo: 'escasez',
      texto: CONVERSION_STRATEGIES.escasez.textos[0] // pieza unica
    });
  } else if (perfil.estiloDecision === 'analitico') {
    estrategiasSeleccionadas.push({
      tipo: 'reciprocidad',
      texto: CONVERSION_STRATEGIES.reciprocidad.textos[Math.floor(Math.random() * 3)]
    });
    estrategiasSeleccionadas.push({
      tipo: 'compromiso',
      texto: CONVERSION_STRATEGIES.compromiso.textos[0]
    });
  } else {
    // emocional
    estrategiasSeleccionadas.push({
      tipo: 'aversionPerdida',
      texto: CONVERSION_STRATEGIES.aversionPerdida.textos[Math.floor(Math.random() * 3)]
    });
    estrategiasSeleccionadas.push({
      tipo: 'pruebaSocial',
      texto: CONVERSION_STRATEGIES.pruebaSocial.textos[Math.floor(Math.random() * 3)].replace('{n}', Math.floor(Math.random() * 20) + 8)
    });
  }

  // Segun vulnerabilidad
  if (perfil.vulnerabilidad === 'alta') {
    // Para vulnerable: reciprocidad + compromiso suave
    estrategiasSeleccionadas.push({
      tipo: 'compromiso',
      texto: 'No hay apuro. Lo importante es que te sentiste escuchada.'
    });
  }

  return estrategiasSeleccionadas;
}

// ===== GENERAR LLAMADA A ACCION SEGUN PERFIL =====

function generarCTA(perfil, guardian) {
  const ctas = {
    impulsivo: {
      principal: 'Quiero conocerlo',
      secundario: 'Adoptalo ahora',
      urgencia: 'Solo hoy: envio gratis'
    },
    analitico: {
      principal: 'Ver mas detalles',
      secundario: 'Guardar para despues',
      urgencia: null
    },
    emocional: {
      principal: 'Conectar con ' + (guardian?.nombre || 'mi guardian'),
      secundario: 'Contame mas sobre el',
      urgencia: null
    }
  };

  return ctas[perfil.estiloDecision] || ctas.emocional;
}

// ===== CORS HEADERS =====
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// Handler OPTIONS para CORS preflight
export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: corsHeaders
  });
}

// ===== HANDLER PRINCIPAL =====

export async function POST(request) {
  try {
    const body = await request.json();
    const { nombre, email, fechaNacimiento, pais, respuestas } = body;

    if (!respuestas) {
      return NextResponse.json({ error: 'Faltan respuestas del test' }, { status: 400, headers: corsHeaders });
    }

    // 1. Calcular signo zodiacal
    const signo = calcularSigno(fechaNacimiento);
    const datosSigno = SIGNOS_ZODIACALES[signo];

    // 2. Analizar perfil psicologico
    const vulnerabilidad = analizarVulnerabilidad(respuestas);
    const dolorPrincipal = detectarDolorPrincipal(respuestas);
    const estiloDecision = detectarEstiloDecision(respuestas);

    const perfil = {
      signo,
      vulnerabilidad,
      dolorPrincipal,
      estiloDecision,
      datosVulnerabilidad: NIVELES_VULNERABILIDAD[vulnerabilidad],
      datosDolor: TIPOS_DOLOR[dolorPrincipal],
      datosEstilo: ESTILOS_DECISION[estiloDecision]
    };

    // 3. Generar sincronicidades
    const sincronicidades = generarSincronicidades(nombre, fechaNacimiento);

    // 4. Buscar guardian ideal en WooCommerce
    const guardian = await buscarGuardianIdeal(perfil);

    // 5. Generar mensaje con IA (o fallback)
    let mensajeGuardian = await generarMensajeConIA(perfil, guardian, nombre, sincronicidades, respuestas);
    if (!mensajeGuardian) {
      mensajeGuardian = generarMensajeFallback(perfil, guardian, nombre);
    }

    // 6. Seleccionar estrategias de conversion
    const estrategiasConversion = seleccionarEstrategias(perfil, guardian);

    // 7. Generar CTAs personalizados
    const cta = generarCTA(perfil, guardian);

    // 8. Construir respuesta completa
    const resultado = {
      success: true,
      usuario: {
        nombre,
        email,
        pais
      },
      signo: {
        id: signo,
        ...datosSigno
      },
      perfil,
      sincronicidades,
      guardian,
      mensajeGuardian,
      conversion: {
        estrategias: estrategiasConversion,
        cta,
        enfoque: perfil.datosVulnerabilidad?.enfoque,
        presionVenta: perfil.datosVulnerabilidad?.presion || 0,
        tipoCierre: perfil.datosEstilo?.cierre
      },
      recomendaciones: {
        enfoque: perfil.datosVulnerabilidad?.enfoque,
        presionVenta: perfil.datosVulnerabilidad?.presion || 0,
        tipoCierre: perfil.datosEstilo?.cierre
      },
      timestamp: new Date().toISOString()
    };

    return NextResponse.json(resultado, { headers: corsHeaders });

  } catch (error) {
    console.error('[API test-guardian/analizar] Error:', error);
    return NextResponse.json({
      error: 'Error procesando el test',
      detalle: error.message
    }, { status: 500, headers: corsHeaders });
  }
}
