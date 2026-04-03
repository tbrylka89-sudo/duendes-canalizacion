export const dynamic = "force-dynamic";
import Anthropic from '@anthropic-ai/sdk';
import { kv } from '@vercel/kv';
import canon from '@/lib/canon.json';

let _anthropic; function getAnthropic() { if(!_anthropic) _anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
}); return _anthropic; }

// Calcular fase lunar simplificada
function getFaseLunar() {
  const lunaLlenaConocida = new Date('2025-01-13T22:27:00Z');
  const ahora = new Date();
  const ciclo = 29.530588853;
  const dias = (ahora - lunaLlenaConocida) / (24 * 60 * 60 * 1000);
  const enCiclo = ((dias % ciclo) + ciclo) % ciclo;

  if (enCiclo < 3.69) return { fase: 'llena', nombre: 'Luna Llena', emoji: '🌕' };
  if (enCiclo < 11.07) return { fase: 'menguante', nombre: 'Luna Menguante', emoji: '🌖' };
  if (enCiclo < 14.76) return { fase: 'nueva', nombre: 'Luna Nueva', emoji: '🌑' };
  if (enCiclo < 22.14) return { fase: 'creciente', nombre: 'Luna Creciente', emoji: '🌒' };
  return { fase: 'llena', nombre: 'Luna Llena', emoji: '🌕' };
}

// Obtener número del día (para variedad)
function getNumeroDia() {
  const inicio = new Date('2024-01-01');
  const ahora = new Date();
  return Math.floor((ahora - inicio) / (24 * 60 * 60 * 1000));
}

// Mensaje de Tito del día (base, sin personalizar)
const MENSAJES_TITO = [
  "Hoy el universo tiene algo especial preparado para vos. Mantené los ojos abiertos.",
  "Los guardianes me contaron que estás en un momento de transformación. Confiá en el proceso.",
  "Hoy es un buen día para escuchar a tu intuición. Ella sabe más de lo que pensás.",
  "Sentí que necesitabas escuchar esto: todo lo que viviste te preparó para lo que viene.",
  "Las sincronicidades de hoy son mensajes. Prestá atención a los números y las señales.",
  "Tu energía está particularmente brillante hoy. Usala para manifestar lo que querés.",
  "A veces el universo pide paciencia. Hoy es uno de esos días. Respirá y confiá.",
  "Los duendes me susurraron que algo importante está por llegar. Preparate para recibirlo.",
  "Tu guardián está más activo que nunca. ¿Lo sentiste últimamente?",
  "Hoy es perfecto para limpiar tu espacio y tu energía. Todo fluye mejor con ligereza.",
  "El camino se está despejando, aunque no lo veas todavía. Seguí adelante.",
  "Las personas que cruces hoy no son casualidad. Observá qué mensajes te traen.",
  "Tu fuerza interior está creciendo. Los desafíos recientes te hicieron más poderosa.",
  "Hoy soñaste algo importante. Si no lo recordás, llegará de otra forma.",
  "El amor está más cerca de lo que pensás. En todas sus formas."
];

// Señales según elemento
const SENALES_ELEMENTO = {
  fuego: [
    "Hoy tu fuego interior necesita expresión. No lo contengas.",
    "Una oportunidad de liderazgo se presenta. Tomala.",
    "Tu pasión es magnética hoy. Otros lo notarán.",
    "Transformá algo que ya no te sirve. Es tu momento."
  ],
  agua: [
    "Tu intuición está especialmente aguda hoy. Escuchala.",
    "Las emociones que surjan son mensajes. No las reprimas.",
    "Alguien necesita tu don de escucha hoy. Estarás ahí.",
    "Un sueño o visión trae información importante. Anotalo."
  ],
  tierra: [
    "Hoy es ideal para plantar semillas de tus proyectos.",
    "La abundancia toca a tu puerta. Abrila.",
    "Tu estabilidad inspira a otros hoy. Sé el pilar.",
    "Algo concreto se manifiesta. Mirá a tu alrededor."
  ],
  aire: [
    "Una idea brillante llegará hoy. Atrapala antes de que vuele.",
    "La comunicación fluye. Es buen día para conversaciones importantes.",
    "Tu perspectiva única resuelve un problema hoy. Compartila.",
    "Los mensajes llegan de formas inesperadas. Mantené la mente abierta."
  ]
};

// POST - Generar señal del día personalizada
export async function POST(request) {
  try {
    const body = await request.json();
    const { email, generar = false } = body;

    const luna = getFaseLunar();
    const numeroDia = getNumeroDia();
    const ahora = new Date();
    const fechaHoy = ahora.toISOString().split('T')[0];

    let usuario = null;
    let elemento = null;
    let nombrePersona = 'Alma luminosa';
    let guardianes = [];
    let esCirculo = false;

    // Obtener datos del usuario si hay email
    if (email) {
      const emailNorm = email.toLowerCase().trim();
      let userKey = `user:${emailNorm}`;
      usuario = await kv.get(userKey);
      if (!usuario) {
        userKey = `elegido:${emailNorm}`;
        usuario = await kv.get(userKey);
      }

      if (usuario) {
        elemento = usuario.elemento;
        nombrePersona = usuario.nombre || usuario.nombrePreferido || 'Alma luminosa';
        guardianes = usuario.guardianes || [];
        esCirculo = usuario.esCirculo || false;

        // Verificar si ya recibió señal hoy
        if (usuario.ultimaSenal === fechaHoy && usuario.senalDia && !generar) {
          return Response.json({
            success: true,
            senal: usuario.senalDia,
            yaGenerada: true
          });
        }
      }
    }

    // Mensaje base de Tito
    const mensajeTitoIndex = numeroDia % MENSAJES_TITO.length;
    const mensajeTito = MENSAJES_TITO[mensajeTitoIndex];

    // Señal según elemento
    let senalElemento = null;
    if (elemento && SENALES_ELEMENTO[elemento]) {
      const senales = SENALES_ELEMENTO[elemento];
      senalElemento = senales[numeroDia % senales.length];
    }

    // Construir señal base
    const senal = {
      fecha: fechaHoy,
      saludo: getSaludo(nombrePersona, esCirculo),
      luna: {
        fase: luna.nombre,
        emoji: luna.emoji,
        mensaje: getMensajeLuna(luna.fase)
      },
      mensaje_tito: mensajeTito,
      senal_elemento: senalElemento,
      guardian_mensaje: guardianes.length > 0 ? getMensajeGuardian(guardianes[0]) : null,
      accion_sugerida: getAccionDia(luna.fase, elemento),
      cristal_del_dia: getCristalDia(numeroDia),
      numero_dia: numeroDia % 9 + 1, // Número del 1 al 9
      significado_numero: getSignificadoNumero(numeroDia % 9 + 1)
    };

    // Si se pidió generar con IA (solo para Círculo)
    if (generar && esCirculo) {
      senal.mensaje_canalizado = await generarMensajeIA(nombrePersona, elemento, luna, guardianes);
    }

    // Guardar señal en usuario si hay email
    if (usuario && email) {
      const emailNorm = email.toLowerCase().trim();
      let userKey = `user:${emailNorm}`;
      const userCheck = await kv.get(userKey);
      if (!userCheck) userKey = `elegido:${emailNorm}`;

      usuario.ultimaSenal = fechaHoy;
      usuario.senalDia = senal;
      await kv.set(userKey, usuario);
    }

    return Response.json({
      success: true,
      senal
    });

  } catch (error) {
    console.error('Error generando señal diaria:', error);
    return Response.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}

function getSaludo(nombre, esCirculo) {
  const hora = new Date().getHours();
  let momento = 'día';
  if (hora < 12) momento = 'mañana';
  else if (hora < 19) momento = 'tarde';
  else momento = 'noche';

  if (esCirculo) {
    return `Buenos ${momento}, ${nombre}. Es un honor saludarte, Elegida.`;
  }
  return `Buenos ${momento}, ${nombre}. El universo te saluda hoy.`;
}

function getMensajeLuna(fase) {
  const mensajes = {
    llena: 'La Luna Llena ilumina verdades ocultas. Es momento de celebrar y soltar.',
    menguante: 'La Luna Menguante invita a la liberación. Dejá ir lo que ya no suma.',
    nueva: 'La Luna Nueva es el útero de nuevos comienzos. Plantá intenciones.',
    creciente: 'La Luna Creciente impulsa tus proyectos. Es momento de actuar.'
  };
  return mensajes[fase] || mensajes.nueva;
}

function getMensajeGuardian(guardian) {
  const nombre = guardian?.nombre || guardian || 'Tu guardián';
  const mensajes = [
    `${nombre} te envía protección extra hoy.`,
    `${nombre} quiere que sepas que está orgulloso de vos.`,
    `${nombre} sintió que necesitabas un abrazo energético.`,
    `${nombre} está trabajando en algo especial para vos.`,
    `${nombre} te recuerda que no estás sola en esto.`
  ];
  return mensajes[Math.floor(Math.random() * mensajes.length)];
}

function getAccionDia(faseL, elemento) {
  const acciones = {
    llena: [
      'Cargá tus cristales bajo la luz de la luna',
      'Escribí lo que querés soltar y quemalo simbólicamente',
      'Hacé una meditación de gratitud'
    ],
    menguante: [
      'Limpiá un espacio de tu casa que tengas descuidado',
      'Hacé un baño con sal marina',
      'Doná algo que ya no uses'
    ],
    nueva: [
      'Escribí tus intenciones para este ciclo',
      'Planificá un proyecto que venías postergando',
      'Meditá en silencio 10 minutos'
    ],
    creciente: [
      'Tomá una acción concreta hacia tu meta',
      'Contactá a alguien que te pueda ayudar',
      'Visualizá lo que querés manifestar'
    ]
  };

  const lista = acciones[faseL] || acciones.nueva;
  return lista[Math.floor(Math.random() * lista.length)];
}

function getCristalDia(numeroDia) {
  const cristales = canon.cristales.principales;
  const cristal = cristales[numeroDia % cristales.length];
  return {
    nombre: cristal.nombre,
    poder: cristal.poder,
    chakra: cristal.chakra
  };
}

function getSignificadoNumero(numero) {
  const significados = {
    1: 'Nuevos comienzos, liderazgo, independencia',
    2: 'Equilibrio, cooperación, paciencia',
    3: 'Creatividad, expresión, alegría',
    4: 'Estabilidad, estructura, trabajo duro',
    5: 'Cambio, libertad, aventura',
    6: 'Amor, familia, responsabilidad',
    7: 'Espiritualidad, introspección, sabiduría',
    8: 'Abundancia, poder, manifestación',
    9: 'Completitud, humanitarismo, cierre de ciclos'
  };
  return significados[numero] || significados[1];
}

async function generarMensajeIA(nombre, elemento, luna, guardianes) {
  try {
    const guardianNombre = guardianes[0]?.nombre || guardianes[0] || 'tu guardián';

    const prompt = `Generá un mensaje canalizado breve (máximo 100 palabras) para ${nombre}.

Contexto:
- Elemento: ${elemento || 'desconocido'}
- Luna: ${luna.nombre}
- Tiene un guardián llamado: ${guardianNombre}

El mensaje debe:
- Ser en español rioplatense (vos, tenés)
- Sentirse como un susurro místico personal
- Incluir una pequeña predicción o guía para hoy
- Ser cálido y validador
- NO hacer promesas específicas
- Terminar con una frase de poder

Solo devolvé el mensaje, sin explicaciones.`;

    const response = await getAnthropic().messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 300,
      messages: [{ role: 'user', content: prompt }]
    });

    return response.content[0]?.text || null;
  } catch (e) {
    console.error('Error generando mensaje IA:', e);
    return null;
  }
}
