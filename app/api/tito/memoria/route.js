// ═══════════════════════════════════════════════════════════════════════════
// TITO - SISTEMA DE MEMORIA ACUMULATIVA v2.0
// Guarda aprendizajes de cada conversación para mejorar y dar insights
// ═══════════════════════════════════════════════════════════════════════════

import { kv } from '@vercel/kv';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function OPTIONS() {
  return new Response(null, { headers: CORS_HEADERS });
}

// ═══════════════════════════════════════════════════════════════
// ESTRUCTURA DE MEMORIA EN KV
// ═══════════════════════════════════════════════════════════════

/*
KV Keys:
- tito:memoria:global           - Stats globales acumuladas
- tito:memoria:intereses        - Contadores de intereses (proteccion, abundancia, etc)
- tito:memoria:objeciones       - Objeciones frecuentes con contadores
- tito:memoria:preguntas        - Preguntas frecuentes categorizadas
- tito:memoria:paises           - De donde nos visitan
- tito:memoria:horarios         - En qué horarios hay más conversaciones
- tito:memoria:conversaciones   - Últimas 200 conversaciones resumidas
- tito:memoria:insights         - Insights generados
- tito:memoria:frases           - Frases efectivas que funcionaron
- tito:visitante:{id}           - Memoria individual por visitante
*/

// ═══════════════════════════════════════════════════════════════
// POST - GUARDAR APRENDIZAJE
// ═══════════════════════════════════════════════════════════════

export async function POST(request) {
  try {
    const body = await request.json();
    const { accion } = body;

    // Diferentes acciones
    switch (accion) {
      case 'guardar_conversacion':
        return await guardarConversacion(body);
      case 'guardar_visitante':
        return await guardarVisitante(body);
      case 'registrar_evento':
        return await registrarEvento(body);
      default:
        // Por defecto, guardar conversación
        return await guardarConversacion(body);
    }

  } catch (error) {
    console.error('Error en memoria POST:', error);
    return Response.json({ success: false, error: error.message }, { headers: CORS_HEADERS });
  }
}

// ═══════════════════════════════════════════════════════════════
// GET - OBTENER INSIGHTS/MEMORIA
// ═══════════════════════════════════════════════════════════════

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const tipo = searchParams.get('tipo') || 'resumen';
    const visitorId = searchParams.get('visitorId');
    const email = searchParams.get('email');

    let data = {};

    switch (tipo) {
      case 'resumen':
        data = await obtenerResumenCompleto();
        break;
      case 'visitante':
        data = await obtenerMemoriaVisitante(visitorId, email);
        break;
      case 'intereses':
        data = await kv.get('tito:memoria:intereses') || {};
        break;
      case 'objeciones':
        data = await kv.get('tito:memoria:objeciones') || {};
        break;
      case 'preguntas':
        data = await kv.get('tito:memoria:preguntas') || {};
        break;
      case 'paises':
        data = await kv.get('tito:memoria:paises') || {};
        break;
      case 'conversaciones':
        data = await kv.get('tito:memoria:conversaciones') || [];
        break;
      case 'insights':
        data = await generarInsightsCompletos();
        break;
      case 'contexto_tito':
        // Contexto para que Tito use en sus respuestas
        data = await obtenerContextoParaTito();
        break;
      default:
        data = await obtenerResumenCompleto();
    }

    return Response.json({ success: true, data }, { headers: CORS_HEADERS });

  } catch (error) {
    console.error('Error en memoria GET:', error);
    return Response.json({ success: false, error: error.message }, { headers: CORS_HEADERS });
  }
}

// ═══════════════════════════════════════════════════════════════
// GUARDAR CONVERSACIÓN Y APRENDER
// ═══════════════════════════════════════════════════════════════

async function guardarConversacion(body) {
  const {
    conversacion = [],
    visitante = {},
    pagina,
    duracion,
    resultado,
    visitorId
  } = body;

  if (!conversacion || conversacion.length === 0) {
    return Response.json({ success: false, error: 'Sin conversación' }, { headers: CORS_HEADERS });
  }

  // Analizar la conversación
  const analisis = analizarConversacion(conversacion);

  // Guardar hora para análisis de horarios
  const hora = new Date().getHours();

  // Actualizar todas las métricas en paralelo
  await Promise.all([
    actualizarStatsGlobales(analisis, visitante, resultado),
    actualizarIntereses(analisis.intereses),
    actualizarObjeciones(analisis.objeciones),
    actualizarPreguntas(analisis.preguntas),
    actualizarPaises(visitante.country, visitante.countryCode),
    actualizarHorarios(hora),
    guardarResumenConversacion({
      fecha: new Date().toISOString(),
      pais: visitante.country || 'Desconocido',
      ciudad: visitante.city,
      pagina,
      intereses: analisis.intereses,
      objeciones: analisis.objeciones,
      preguntas: analisis.preguntas,
      intencionCompra: analisis.intencionCompra,
      sentimiento: analisis.sentimiento,
      mensajes: conversacion.length,
      duracion,
      resultado,
      hora
    }),
    // Guardar también en memoria del visitante si hay ID
    visitorId ? actualizarMemoriaVisitante(visitorId, analisis, visitante) : Promise.resolve()
  ]);

  return Response.json({
    success: true,
    analisis: {
      intereses: analisis.intereses,
      intencionCompra: analisis.intencionCompra,
      objeciones: analisis.objeciones.length,
      sentimiento: analisis.sentimiento
    }
  }, { headers: CORS_HEADERS });
}

// ═══════════════════════════════════════════════════════════════
// ANÁLISIS DE CONVERSACIÓN - EL CEREBRO
// ═══════════════════════════════════════════════════════════════

function analizarConversacion(mensajes) {
  const textoUsuario = mensajes
    .filter(m => m.role === 'user' || m.rol === 'usuario')
    .map(m => m.content || m.texto || '')
    .join(' ')
    .toLowerCase();

  const textoCompleto = mensajes.map(m => m.content || m.texto || '').join(' ').toLowerCase();

  // ═══ DETECTAR INTERESES ═══
  const intereses = [];
  const patronesInteres = {
    proteccion: /protecci[oó]n|proteger|escudo|negativ|mal|energ[ií]a|limpi|purific/i,
    abundancia: /abundancia|prosperidad|dinero|negocio|trabajo|suerte|fortuna|[eé]xito/i,
    amor: /amor|pareja|relaci[oó]n|coraz[oó]n|familia|armon[ií]a|afecto/i,
    sanacion: /sana|salud|equilibrio|paz|calma|ansiedad|bienestar|tranquilidad/i,
    hogar: /hogar|casa|decorar|espacio|ambiente|living|dormitorio/i,
    regalo: /regalo|cumple|navidad|especial|sorpresa|aniversario/i,
    coleccion: /colecci[oó]n|varios|m[aá]s de uno|conjunto/i
  };

  for (const [nombre, patron] of Object.entries(patronesInteres)) {
    if (patron.test(textoUsuario)) {
      intereses.push(nombre);
    }
  }

  // ═══ DETECTAR OBJECIONES ═══
  const objeciones = [];
  const patronesObjecion = {
    precio: /caro|precio|costoso|mucho|plata|presupuesto|econom|barato/i,
    tiempo: /pienso|despu[eé]s|luego|m[aá]s tarde|no ahora|otro momento/i,
    envio: /env[ií]o|llega|demora|aduana|impuesto|shipping/i,
    confianza: /seguro|confianza|real|estafa|verdad|leg[ií]timo/i,
    tamano: /tama[nñ]o|grande|chico|medida|dimensi[oó]n|alto|ancho/i,
    material: /material|fragil|rompe|dura|resiste|calidad/i,
    pago: /pago|tarjeta|cuota|financ|transfer/i
  };

  for (const [nombre, patron] of Object.entries(patronesObjecion)) {
    if (patron.test(textoUsuario)) {
      objeciones.push(nombre);
    }
  }

  // ═══ DETECTAR PREGUNTAS FRECUENTES ═══
  const preguntas = [];
  const patronesPreguntas = {
    proceso_compra: /c[oó]mo compro|c[oó]mo funciona|proceso|pasos|c[oó]mo hago/i,
    envio: /env[ií]o|llega|cu[aá]nto tarda|d[ií]as|shipping/i,
    precios: /precio|cu[aá]nto cuesta|valor|sale/i,
    materiales: /material|hecho|porcelana|cristal|qu[eé] es/i,
    reserva: /reserva|30%|se[nñ]a|apartar|separar/i,
    seguimiento: /pedido|orden|compra.*hice|estado|tracking/i,
    devolucion: /devolu|cambio|garantia|arrepient/i,
    personalizado: /personal|encargo|especial|a medida|custom/i
  };

  for (const [nombre, patron] of Object.entries(patronesPreguntas)) {
    if (patron.test(textoUsuario)) {
      preguntas.push(nombre);
    }
  }

  // ═══ CALCULAR INTENCIÓN DE COMPRA (0-100) ═══
  let intencionCompra = 25; // Base

  // Factores positivos
  if (/quiero|necesito|busco|me interesa/i.test(textoUsuario)) intencionCompra += 15;
  if (/comprar|adquirir|llevar|reservar|lo quiero/i.test(textoUsuario)) intencionCompra += 30;
  if (/precio|cu[aá]nto/i.test(textoUsuario)) intencionCompra += 10;
  if (/env[ií]o.*mi pa[ií]s|env[ií]an.*a/i.test(textoUsuario)) intencionCompra += 15;
  if (/pago|tarjeta|paypal|transfer/i.test(textoUsuario)) intencionCompra += 25;
  if (/cu[aá]l.*recomiend|ayud.*elegir/i.test(textoUsuario)) intencionCompra += 10;
  if (intereses.length >= 2) intencionCompra += 10;

  // Factores negativos
  if (/solo.*pregunt|curiosidad|mirando|no.*comprar/i.test(textoUsuario)) intencionCompra -= 25;
  if (objeciones.includes('precio')) intencionCompra -= 15;
  if (objeciones.includes('tiempo')) intencionCompra -= 20;
  if (objeciones.length >= 2) intencionCompra -= 10;

  intencionCompra = Math.max(0, Math.min(100, intencionCompra));

  // ═══ ANALIZAR SENTIMIENTO ═══
  let sentimiento = 'neutral';
  const positivo = /gracias|genial|perfecto|increible|hermoso|bello|amo|encanta|wow|excelente/i;
  const negativo = /mal|horrible|feo|caro|estafa|malo|no me gusta|decepcion/i;

  if (positivo.test(textoUsuario)) sentimiento = 'positivo';
  if (negativo.test(textoUsuario)) sentimiento = 'negativo';

  return {
    intereses,
    objeciones,
    preguntas,
    intencionCompra,
    sentimiento,
    longitudConversacion: mensajes.length
  };
}

// ═══════════════════════════════════════════════════════════════
// FUNCIONES DE ACTUALIZACIÓN EN KV
// ═══════════════════════════════════════════════════════════════

async function actualizarStatsGlobales(analisis, visitante, resultado) {
  const stats = await kv.get('tito:memoria:global') || {
    totalConversaciones: 0,
    promedioIntencionCompra: 0,
    promedioMensajes: 0,
    sentimientos: { positivo: 0, neutral: 0, negativo: 0 },
    resultados: { compra: 0, interes: 0, consulta: 0, abandono: 0 },
    primeraConversacion: new Date().toISOString()
  };

  const n = stats.totalConversaciones;
  stats.totalConversaciones++;

  // Promedios móviles
  stats.promedioIntencionCompra = Math.round(
    (stats.promedioIntencionCompra * n + analisis.intencionCompra) / (n + 1)
  );
  stats.promedioMensajes = Math.round(
    (stats.promedioMensajes * n + analisis.longitudConversacion) / (n + 1)
  );

  // Contadores
  if (analisis.sentimiento) {
    stats.sentimientos[analisis.sentimiento] = (stats.sentimientos[analisis.sentimiento] || 0) + 1;
  }
  if (resultado && stats.resultados[resultado] !== undefined) {
    stats.resultados[resultado]++;
  }

  stats.ultimaConversacion = new Date().toISOString();

  await kv.set('tito:memoria:global', stats);
}

async function actualizarIntereses(intereses) {
  if (!intereses || intereses.length === 0) return;

  const data = await kv.get('tito:memoria:intereses') || {};
  for (const interes of intereses) {
    data[interes] = (data[interes] || 0) + 1;
  }
  await kv.set('tito:memoria:intereses', data);
}

async function actualizarObjeciones(objeciones) {
  if (!objeciones || objeciones.length === 0) return;

  const data = await kv.get('tito:memoria:objeciones') || {};
  for (const objecion of objeciones) {
    data[objecion] = (data[objecion] || 0) + 1;
  }
  await kv.set('tito:memoria:objeciones', data);
}

async function actualizarPreguntas(preguntas) {
  if (!preguntas || preguntas.length === 0) return;

  const data = await kv.get('tito:memoria:preguntas') || {};
  for (const pregunta of preguntas) {
    data[pregunta] = (data[pregunta] || 0) + 1;
  }
  await kv.set('tito:memoria:preguntas', data);
}

async function actualizarPaises(country, countryCode) {
  if (!country) return;

  const data = await kv.get('tito:memoria:paises') || {};
  const key = countryCode || country;
  if (!data[key]) {
    data[key] = { nombre: country, visitas: 0 };
  }
  data[key].visitas++;
  await kv.set('tito:memoria:paises', data);
}

async function actualizarHorarios(hora) {
  const data = await kv.get('tito:memoria:horarios') || {};
  data[hora] = (data[hora] || 0) + 1;
  await kv.set('tito:memoria:horarios', data);
}

async function guardarResumenConversacion(resumen) {
  let conversaciones = await kv.get('tito:memoria:conversaciones') || [];
  conversaciones.unshift(resumen);
  if (conversaciones.length > 200) {
    conversaciones = conversaciones.slice(0, 200);
  }
  await kv.set('tito:memoria:conversaciones', conversaciones);
}

async function actualizarMemoriaVisitante(visitorId, analisis, visitante) {
  let memoria = await kv.get(`tito:visitante:${visitorId}`) || {
    creado: new Date().toISOString(),
    conversaciones: 0,
    interesesAcumulados: {},
    objecionesAcumuladas: {}
  };

  memoria.conversaciones++;
  memoria.ultimaVisita = new Date().toISOString();
  memoria.pais = visitante.country;
  memoria.ultimaIntencion = analisis.intencionCompra;

  // Acumular intereses
  for (const i of analisis.intereses) {
    memoria.interesesAcumulados[i] = (memoria.interesesAcumulados[i] || 0) + 1;
  }

  // Acumular objeciones
  for (const o of analisis.objeciones) {
    memoria.objecionesAcumuladas[o] = (memoria.objecionesAcumuladas[o] || 0) + 1;
  }

  // Guardar con TTL de 90 días
  await kv.set(`tito:visitante:${visitorId}`, memoria, { ex: 90 * 24 * 60 * 60 });
}

// ═══════════════════════════════════════════════════════════════
// GUARDAR MEMORIA DE VISITANTE
// ═══════════════════════════════════════════════════════════════

async function guardarVisitante(body) {
  const { visitorId, datos } = body;

  if (!visitorId) {
    return Response.json({ success: false, error: 'Se requiere visitorId' }, { headers: CORS_HEADERS });
  }

  let memoria = await kv.get(`tito:visitante:${visitorId}`) || {
    creado: new Date().toISOString(),
    conversaciones: 0
  };

  memoria = { ...memoria, ...datos, ultimaActualizacion: new Date().toISOString() };
  await kv.set(`tito:visitante:${visitorId}`, memoria, { ex: 90 * 24 * 60 * 60 });

  return Response.json({ success: true, memoria }, { headers: CORS_HEADERS });
}

// ═══════════════════════════════════════════════════════════════
// REGISTRAR EVENTO ESPECÍFICO
// ═══════════════════════════════════════════════════════════════

async function registrarEvento(body) {
  const { evento, datos, visitorId } = body;

  // Eventos: 'click_producto', 'ver_categoria', 'agregar_carrito', 'inicio_checkout', etc.
  const eventos = await kv.get('tito:memoria:eventos') || {};
  eventos[evento] = (eventos[evento] || 0) + 1;
  await kv.set('tito:memoria:eventos', eventos);

  return Response.json({ success: true }, { headers: CORS_HEADERS });
}

// ═══════════════════════════════════════════════════════════════
// OBTENER MEMORIA DE UN VISITANTE
// ═══════════════════════════════════════════════════════════════

async function obtenerMemoriaVisitante(visitorId, email) {
  let memoria = null;

  if (visitorId) {
    memoria = await kv.get(`tito:visitante:${visitorId}`);
  }

  if (!memoria && email) {
    const elegido = await kv.get(`elegido:${email.toLowerCase()}`);
    if (elegido) {
      memoria = {
        nombre: elegido.nombre,
        email,
        esCliente: true,
        totalCompras: elegido.totalCompras || 0,
        guardianes: elegido.guardianes?.map(g => g.nombre) || [],
        treboles: elegido.treboles || 0,
        runas: elegido.runas || 0
      };
    }
  }

  return { memoria, encontrado: !!memoria };
}

// ═══════════════════════════════════════════════════════════════
// OBTENER RESUMEN COMPLETO PARA ADMIN
// ═══════════════════════════════════════════════════════════════

async function obtenerResumenCompleto() {
  const [global, intereses, objeciones, preguntas, paises, horarios, conversaciones] = await Promise.all([
    kv.get('tito:memoria:global'),
    kv.get('tito:memoria:intereses'),
    kv.get('tito:memoria:objeciones'),
    kv.get('tito:memoria:preguntas'),
    kv.get('tito:memoria:paises'),
    kv.get('tito:memoria:horarios'),
    kv.get('tito:memoria:conversaciones')
  ]);

  const ordenar = (obj) => Object.entries(obj || {})
    .sort((a, b) => (typeof b[1] === 'object' ? b[1].visitas : b[1]) - (typeof a[1] === 'object' ? a[1].visitas : a[1]))
    .map(([k, v]) => typeof v === 'object' ? { codigo: k, ...v } : { nombre: k, cantidad: v });

  return {
    global: global || { totalConversaciones: 0 },
    topIntereses: ordenar(intereses).slice(0, 6),
    topObjeciones: ordenar(objeciones).slice(0, 5),
    topPreguntas: ordenar(preguntas).slice(0, 6),
    topPaises: ordenar(paises).slice(0, 10),
    horariosPico: obtenerHorariosPico(horarios),
    ultimasConversaciones: (conversaciones || []).slice(0, 20),
    insights: await generarInsightsCompletos()
  };
}

function obtenerHorariosPico(horarios) {
  if (!horarios) return [];
  return Object.entries(horarios)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([hora, cantidad]) => ({
      hora: parseInt(hora),
      rango: `${hora}:00 - ${parseInt(hora) + 1}:00`,
      conversaciones: cantidad
    }));
}

// ═══════════════════════════════════════════════════════════════
// GENERAR INSIGHTS PARA ADMIN
// ═══════════════════════════════════════════════════════════════

async function generarInsightsCompletos() {
  const [global, intereses, objeciones, paises, horarios] = await Promise.all([
    kv.get('tito:memoria:global'),
    kv.get('tito:memoria:intereses'),
    kv.get('tito:memoria:objeciones'),
    kv.get('tito:memoria:paises'),
    kv.get('tito:memoria:horarios')
  ]);

  const insights = [];

  // Insight de interés principal
  const topInteres = Object.entries(intereses || {}).sort((a, b) => b[1] - a[1])[0];
  if (topInteres) {
    insights.push({
      tipo: 'interes',
      icono: '🎯',
      titulo: 'Lo que más buscan',
      texto: `"${formatearNombre(topInteres[0])}" domina con ${topInteres[1]} menciones. Destacar estos guardianes en la home.`,
      accion: 'Promocionar categoría ' + topInteres[0]
    });
  }

  // Insight de objeción principal
  const topObjecion = Object.entries(objeciones || {}).sort((a, b) => b[1] - a[1])[0];
  if (topObjecion) {
    const soluciones = {
      precio: 'Reforzar el mensaje del 30% de reserva y el valor artesanal',
      tiempo: 'Crear urgencia: "últimas unidades" o "reservado hasta X fecha"',
      envio: 'Hacer más visible la info de DHL Express 5-10 días',
      confianza: 'Agregar más testimonios y fotos del proceso artesanal',
      tamano: 'Crear comparativas visuales de tamaños con objetos comunes',
      material: 'Explicar mejor la durabilidad de la porcelana fría profesional',
      pago: 'Destacar los métodos de pago disponibles'
    };
    insights.push({
      tipo: 'objecion',
      icono: '⚠️',
      titulo: 'Objeción a resolver',
      texto: `"${formatearNombre(topObjecion[0])}" frena ${topObjecion[1]} conversaciones.`,
      accion: soluciones[topObjecion[0]] || 'Revisar respuestas de Tito'
    });
  }

  // Insight geográfico
  const topPais = Object.entries(paises || {}).sort((a, b) => b[1].visitas - a[1].visitas)[0];
  if (topPais) {
    insights.push({
      tipo: 'mercado',
      icono: '🌎',
      titulo: 'Mercado estrella',
      texto: `${topPais[1].nombre} lidera con ${topPais[1].visitas} visitas.`,
      accion: topPais[0] === 'UY' ? 'Promocionar envío local rápido' : 'Considerar contenido en moneda local'
    });
  }

  // Insight de horario
  const topHora = Object.entries(horarios || {}).sort((a, b) => b[1] - a[1])[0];
  if (topHora) {
    insights.push({
      tipo: 'timing',
      icono: '⏰',
      titulo: 'Hora pico',
      texto: `${topHora[0]}:00 es cuando más conversan (${topHora[1]} chats).`,
      accion: 'Programar posts y promos para esa hora'
    });
  }

  // Insight de intención de compra
  if (global?.promedioIntencionCompra) {
    const nivel = global.promedioIntencionCompra > 55 ? 'alta' : global.promedioIntencionCompra > 35 ? 'media' : 'baja';
    insights.push({
      tipo: 'conversion',
      icono: '📈',
      titulo: 'Intención de compra',
      texto: `Promedio ${global.promedioIntencionCompra}% (${nivel}).`,
      accion: nivel === 'baja' ? 'Mejorar argumentos de valor' : nivel === 'media' ? 'Trabajar las objeciones' : 'Mantener estrategia actual'
    });
  }

  // Insight de sentimiento
  if (global?.sentimientos) {
    const total = (global.sentimientos.positivo || 0) + (global.sentimientos.neutral || 0) + (global.sentimientos.negativo || 0);
    if (total > 0) {
      const pctPositivo = Math.round((global.sentimientos.positivo || 0) / total * 100);
      insights.push({
        tipo: 'sentimiento',
        icono: pctPositivo > 60 ? '😊' : pctPositivo > 40 ? '😐' : '😟',
        titulo: 'Sentimiento general',
        texto: `${pctPositivo}% de conversaciones positivas.`,
        accion: pctPositivo < 50 ? 'Revisar tono de respuestas de Tito' : 'Buen trabajo!'
      });
    }
  }

  return insights;
}

// ═══════════════════════════════════════════════════════════════
// CONTEXTO PARA QUE TITO USE EN SUS RESPUESTAS
// ═══════════════════════════════════════════════════════════════

async function obtenerContextoParaTito() {
  const [intereses, objeciones, paises] = await Promise.all([
    kv.get('tito:memoria:intereses'),
    kv.get('tito:memoria:objeciones'),
    kv.get('tito:memoria:paises')
  ]);

  const topIntereses = Object.entries(intereses || {})
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([k]) => k);

  const topObjeciones = Object.entries(objeciones || {})
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([k]) => k);

  const topPaises = Object.entries(paises || {})
    .sort((a, b) => b[1].visitas - a[1].visitas)
    .slice(0, 5)
    .map(([k, v]) => v.nombre);

  return {
    topIntereses,
    topObjeciones,
    topPaises,
    sugerenciaVenta: topIntereses[0] ? `Destacar guardianes de ${topIntereses[0]}` : null,
    objecionComun: topObjeciones[0] ? `Preparar respuesta para objeción de ${topObjeciones[0]}` : null
  };
}

function formatearNombre(nombre) {
  const nombres = {
    proteccion: 'Protección',
    abundancia: 'Abundancia',
    amor: 'Amor',
    sanacion: 'Sanación',
    hogar: 'Hogar',
    regalo: 'Regalo',
    precio: 'Precio alto',
    tiempo: 'Lo dejo para después',
    envio: 'Dudas de envío',
    confianza: 'Falta de confianza',
    tamano: 'Dudas de tamaño',
    proceso_compra: 'Cómo comprar',
    precios: 'Precios',
    materiales: 'Materiales',
    reserva: 'Sistema de reserva'
  };
  return nombres[nombre] || nombre;
}
