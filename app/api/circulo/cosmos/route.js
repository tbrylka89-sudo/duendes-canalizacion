import Anthropic from '@anthropic-ai/sdk';
import canon from '@/lib/canon.json';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

// Calcular fase lunar actual
function calcularFaseLunar() {
  const lunaLlenaConocida = new Date('2025-01-13T22:27:00Z');
  const ahora = new Date();
  const cicloLunar = 29.530588853;
  const diasDesde = (ahora - lunaLlenaConocida) / (24 * 60 * 60 * 1000);
  const diasEnCiclo = ((diasDesde % cicloLunar) + cicloLunar) % cicloLunar;

  let fase, nombre, emoji, energia, ritual;

  if (diasEnCiclo < 1.85) {
    fase = 'llena';
    nombre = 'Luna Llena';
    emoji = '🌕';
    energia = 'Plenitud, celebración, máximo poder. Momento de cargar cristales y celebrar logros.';
    ritual = 'Colocá tus cristales bajo la luz de la luna. Escribí todo lo que querés soltar.';
  } else if (diasEnCiclo < 7.38) {
    fase = 'menguante';
    nombre = 'Luna Menguante';
    emoji = '🌖';
    energia = 'Liberación, introspección, soltar. Ideal para limpiezas y cierres.';
    ritual = 'Limpiá tu espacio, quemá lo que ya no necesitás, hacé un baño de sal.';
  } else if (diasEnCiclo < 11.07) {
    fase = 'cuarto_menguante';
    nombre = 'Cuarto Menguante';
    emoji = '🌗';
    energia = 'Reflexión profunda, evaluar, dejar ir patrones.';
    ritual = 'Escribí lo que aprendiste este ciclo. Agradecé y soltá.';
  } else if (diasEnCiclo < 14.76) {
    fase = 'nueva';
    nombre = 'Luna Nueva';
    emoji = '🌑';
    energia = 'Nuevos comienzos, semillas, intenciones. El útero del ciclo.';
    ritual = 'Escribí tus intenciones para el nuevo ciclo. Plantá una semilla física o simbólica.';
  } else if (diasEnCiclo < 18.45) {
    fase = 'creciente';
    nombre = 'Luna Creciente';
    emoji = '🌒';
    energia = 'Crecimiento, impulso, acción. Tu energía se expande.';
    ritual = 'Tomá acción en tus proyectos. Visualizá lo que querés manifestar.';
  } else if (diasEnCiclo < 22.14) {
    fase = 'cuarto_creciente';
    nombre = 'Cuarto Creciente';
    emoji = '🌓';
    energia = 'Determinación, superar obstáculos, tomar decisiones.';
    ritual = 'Enfrentá lo que venís postergando. Tomá una decisión importante.';
  } else if (diasEnCiclo < 25.83) {
    fase = 'gibosa_creciente';
    nombre = 'Luna Gibosa Creciente';
    emoji = '🌔';
    energia = 'Refinamiento, ajustes finales, preparación para la plenitud.';
    ritual = 'Revisá tus intenciones, ajustá lo necesario, preparate para recibir.';
  } else {
    fase = 'llena';
    nombre = 'Luna Llena';
    emoji = '🌕';
    energia = 'Plenitud, celebración, máximo poder.';
    ritual = 'Celebrá tus logros, cargá cristales, hacé rituales de gratitud.';
  }

  // Calcular próxima luna llena
  const diasParaLlena = cicloLunar - diasEnCiclo;
  const proximaLlena = new Date(ahora.getTime() + diasParaLlena * 24 * 60 * 60 * 1000);

  // Calcular próxima luna nueva
  const diasParaNueva = diasEnCiclo < 14.76 ? 14.76 - diasEnCiclo : cicloLunar - diasEnCiclo + 14.76;
  const proximaNueva = new Date(ahora.getTime() + diasParaNueva * 24 * 60 * 60 * 1000);

  return {
    fase,
    nombre,
    emoji,
    energia,
    ritual,
    porcentajeIluminacion: Math.round(50 * (1 + Math.cos(2 * Math.PI * diasEnCiclo / cicloLunar))),
    diasEnCiclo: Math.round(diasEnCiclo * 10) / 10,
    proximaLlena: proximaLlena.toISOString().split('T')[0],
    proximaNueva: proximaNueva.toISOString().split('T')[0]
  };
}

// Obtener info astrológica del mes
function getInfoAstrologica() {
  const ahora = new Date();
  const mes = ahora.getMonth();
  const dia = ahora.getDate();

  // Signos zodiacales por fecha
  const signos = [
    { nombre: 'Capricornio', inicio: [12, 22], fin: [1, 19], elemento: 'Tierra', regente: 'Saturno', energia: 'Disciplina, estructura, metas a largo plazo' },
    { nombre: 'Acuario', inicio: [1, 20], fin: [2, 18], elemento: 'Aire', regente: 'Urano', energia: 'Innovación, libertad, pensamiento original' },
    { nombre: 'Piscis', inicio: [2, 19], fin: [3, 20], elemento: 'Agua', regente: 'Neptuno', energia: 'Intuición, espiritualidad, compasión' },
    { nombre: 'Aries', inicio: [3, 21], fin: [4, 19], elemento: 'Fuego', regente: 'Marte', energia: 'Acción, coraje, nuevos comienzos' },
    { nombre: 'Tauro', inicio: [4, 20], fin: [5, 20], elemento: 'Tierra', regente: 'Venus', energia: 'Estabilidad, placer, abundancia material' },
    { nombre: 'Géminis', inicio: [5, 21], fin: [6, 20], elemento: 'Aire', regente: 'Mercurio', energia: 'Comunicación, curiosidad, versatilidad' },
    { nombre: 'Cáncer', inicio: [6, 21], fin: [7, 22], elemento: 'Agua', regente: 'Luna', energia: 'Hogar, emociones, nurtura' },
    { nombre: 'Leo', inicio: [7, 23], fin: [8, 22], elemento: 'Fuego', regente: 'Sol', energia: 'Creatividad, expresión, liderazgo' },
    { nombre: 'Virgo', inicio: [8, 23], fin: [9, 22], elemento: 'Tierra', regente: 'Mercurio', energia: 'Análisis, servicio, perfeccionamiento' },
    { nombre: 'Libra', inicio: [9, 23], fin: [10, 22], elemento: 'Aire', regente: 'Venus', energia: 'Equilibrio, relaciones, armonía' },
    { nombre: 'Escorpio', inicio: [10, 23], fin: [11, 21], elemento: 'Agua', regente: 'Plutón', energia: 'Transformación, profundidad, renacimiento' },
    { nombre: 'Sagitario', inicio: [11, 22], fin: [12, 21], elemento: 'Fuego', regente: 'Júpiter', energia: 'Expansión, aventura, sabiduría' }
  ];

  let signoActual = signos[0];
  for (const signo of signos) {
    const [mesInicio, diaInicio] = signo.inicio;
    const [mesFin, diaFin] = signo.fin;

    if ((mes + 1 === mesInicio && dia >= diaInicio) || (mes + 1 === mesFin && dia <= diaFin)) {
      signoActual = signo;
      break;
    }
  }

  return signoActual;
}

// GET - Obtener Cosmos del Mes
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const generar = searchParams.get('generar') === 'true';

    const luna = calcularFaseLunar();
    const signo = getInfoAstrologica();
    const ahora = new Date();
    const nombreMes = ahora.toLocaleDateString('es-UY', { month: 'long' });

    // Cristal del mes basado en el signo
    const cristalesPorSigno = {
      'Capricornio': { nombre: 'Ónix', poder: 'Disciplina y protección' },
      'Acuario': { nombre: 'Amatista', poder: 'Intuición y libertad mental' },
      'Piscis': { nombre: 'Aguamarina', poder: 'Conexión espiritual' },
      'Aries': { nombre: 'Cornalina', poder: 'Coraje y acción' },
      'Tauro': { nombre: 'Cuarzo Rosa', poder: 'Amor y estabilidad' },
      'Géminis': { nombre: 'Citrino', poder: 'Comunicación y alegría' },
      'Cáncer': { nombre: 'Piedra Luna', poder: 'Intuición y nurtura' },
      'Leo': { nombre: 'Ojo de Tigre', poder: 'Confianza y poder personal' },
      'Virgo': { nombre: 'Amazonita', poder: 'Claridad y organización' },
      'Libra': { nombre: 'Lapislázuli', poder: 'Armonía y verdad' },
      'Escorpio': { nombre: 'Obsidiana', poder: 'Transformación profunda' },
      'Sagitario': { nombre: 'Turquesa', poder: 'Protección en viajes' }
    };

    const cristalMes = cristalesPorSigno[signo.nombre] || { nombre: 'Cuarzo Cristal', poder: 'Amplificación universal' };

    // Guardián destacado del mes
    const guardianesPorElemento = {
      'Fuego': { tipo: 'Mago', mensaje: 'Los Magos del Fuego traen transformación y poder este mes' },
      'Tierra': { tipo: 'Gnomo', mensaje: 'Los Gnomos de la Tierra atraen abundancia y estabilidad' },
      'Aire': { tipo: 'Elfo', mensaje: 'Los Elfos del Aire traen claridad y comunicación divina' },
      'Agua': { tipo: 'Hada', mensaje: 'Las Hadas del Agua despiertan la intuición y los sueños' }
    };

    const guardianMes = guardianesPorElemento[signo.elemento] || guardianesPorElemento['Tierra'];

    // Fechas importantes del mes
    const fechasImportantes = [];

    // Agregar próximas lunas
    fechasImportantes.push({
      fecha: luna.proximaNueva,
      evento: 'Luna Nueva',
      descripcion: 'Ideal para nuevos comienzos y plantar intenciones'
    });
    fechasImportantes.push({
      fecha: luna.proximaLlena,
      evento: 'Luna Llena',
      descripcion: 'Momento de plenitud, celebración y limpieza'
    });

    const cosmos = {
      mes: nombreMes.charAt(0).toUpperCase() + nombreMes.slice(1),
      año: ahora.getFullYear(),

      luna: {
        ...luna,
        mensaje: `Estamos en ${luna.nombre}. ${luna.energia}`
      },

      astrologia: {
        signo: signo.nombre,
        elemento: signo.elemento,
        regente: signo.regente,
        energia: signo.energia,
        mensaje: `El Sol transita ${signo.nombre}, signo de ${signo.elemento}. La energía de ${signo.regente} nos invita a ${signo.energia.toLowerCase()}.`
      },

      cristal: {
        ...cristalMes,
        elemento: signo.elemento,
        como_usar: `Llevá tu ${cristalMes.nombre} cerca durante este mes. Meditá con ella pidiendo ${cristalMes.poder.toLowerCase()}.`,
        limpiar: 'Limpiala con humo de salvia o bajo agua corriente antes de usarla.'
      },

      guardian: {
        ...guardianMes,
        recomendacion: `Si estás buscando un guardián este mes, los ${guardianMes.tipo}s están especialmente activos.`
      },

      fechas: fechasImportantes,

      evitar: [
        luna.fase === 'menguante' ? 'Evitá comenzar proyectos grandes, es momento de cerrar ciclos' : null,
        luna.fase === 'nueva' ? 'No es momento de cosechar, sino de plantar semillas' : null,
        signo.elemento === 'Agua' ? 'Cuidá no dejarte arrastrar por emociones intensas' : null,
        signo.elemento === 'Fuego' ? 'Evitá decisiones impulsivas sin reflexión' : null
      ].filter(Boolean),

      afirmacion: generarAfirmacion(signo, luna)
    };

    // Si se pidió generar contenido extenso con IA
    if (generar) {
      const contenidoIA = await generarContenidoCosmos(cosmos);
      cosmos.ritual_del_mes = contenidoIA.ritual;
      cosmos.meditacion = contenidoIA.meditacion;
      cosmos.mensaje_canalizado = contenidoIA.mensaje;
    }

    return Response.json({
      success: true,
      cosmos
    });

  } catch (error) {
    console.error('Error obteniendo cosmos:', error);
    return Response.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}

function generarAfirmacion(signo, luna) {
  const afirmaciones = {
    'Fuego': [
      'Mi fuego interior ilumina el camino',
      'Tengo el coraje para transformar mi vida',
      'Mi pasión me guía hacia mis sueños'
    ],
    'Tierra': [
      'Estoy arraigada y segura en mi poder',
      'La abundancia fluye hacia mí naturalmente',
      'Construyo con paciencia y determinación'
    ],
    'Aire': [
      'Mis pensamientos crean mi realidad',
      'Me comunico con claridad y amor',
      'Soy libre para ser quien realmente soy'
    ],
    'Agua': [
      'Fluyo con los cambios de la vida',
      'Mi intuición me guía certeramente',
      'Mis emociones son mi fuerza'
    ]
  };

  const lista = afirmaciones[signo.elemento] || afirmaciones['Tierra'];
  return lista[Math.floor(Math.random() * lista.length)];
}

async function generarContenidoCosmos(cosmos) {
  try {
    const prompt = `Generá contenido mágico breve para el Cosmos del Mes de ${cosmos.mes}.

CONTEXTO:
- Luna: ${cosmos.luna.nombre}
- Signo Solar: ${cosmos.astrologia.signo}
- Elemento dominante: ${cosmos.astrologia.elemento}
- Cristal del mes: ${cosmos.cristal.nombre}

GENERÁ (en español rioplatense, tono cálido y místico):

1. RITUAL DEL MES (200 palabras):
Un ritual sencillo pero poderoso que cualquiera pueda hacer en casa.
Incluí: materiales simples, pasos claros, intención.

2. MEDITACIÓN BREVE (150 palabras):
Una meditación guiada corta para conectar con la energía del mes.

3. MENSAJE CANALIZADO (100 palabras):
Un mensaje de los guardianes para todos los Elegidos este mes.

Formato JSON:
{
  "ritual": "texto del ritual...",
  "meditacion": "texto de meditación...",
  "mensaje": "mensaje canalizado..."
}`;

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2000,
      messages: [{ role: 'user', content: prompt }]
    });

    const texto = response.content[0]?.text || '';
    const jsonMatch = texto.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }

    return {
      ritual: 'Encendé una vela del color de tu elemento y meditá 10 minutos.',
      meditacion: 'Cerrá los ojos, respirá profundo, conectá con tu guardián.',
      mensaje: 'Los guardianes te acompañan. Confiá en el proceso.'
    };

  } catch (e) {
    console.error('Error generando contenido cosmos:', e);
    return {
      ritual: 'Encendé una vela y meditá sobre tus intenciones.',
      meditacion: 'Respirá profundo y conectá con tu interior.',
      mensaje: 'Estás exactamente donde necesitás estar.'
    };
  }
}
