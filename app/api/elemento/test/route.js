import { kv } from '@vercel/kv';
import canon from '@/lib/canon.json';

// Test del Reino Elemental - Descubrí tu elemento
const PREGUNTAS = [
  {
    id: 1,
    pregunta: "Cuando enfrentás un problema difícil, ¿qué hacés primero?",
    opciones: [
      { texto: "Actúo rápido, no me gusta esperar", elemento: "fuego" },
      { texto: "Analizo todas las opciones con calma", elemento: "aire" },
      { texto: "Confío en mi intuición y lo que siento", elemento: "agua" },
      { texto: "Busco una solución práctica y segura", elemento: "tierra" }
    ]
  },
  {
    id: 2,
    pregunta: "¿Qué paisaje te atrae más para pasar un día?",
    opciones: [
      { texto: "Un volcán activo o desierto cálido", elemento: "fuego" },
      { texto: "Una montaña alta con viento fresco", elemento: "aire" },
      { texto: "El mar o un lago tranquilo", elemento: "agua" },
      { texto: "Un bosque denso o jardín florecido", elemento: "tierra" }
    ]
  },
  {
    id: 3,
    pregunta: "En un grupo de amigos, ¿cuál es tu rol natural?",
    opciones: [
      { texto: "La que lidera y propone aventuras", elemento: "fuego" },
      { texto: "La que aporta ideas y ve todo desde arriba", elemento: "aire" },
      { texto: "La que escucha y conecta emocionalmente", elemento: "agua" },
      { texto: "La que organiza y cuida de todos", elemento: "tierra" }
    ]
  },
  {
    id: 4,
    pregunta: "¿Qué te genera más incomodidad?",
    opciones: [
      { texto: "La rutina y el aburrimiento", elemento: "fuego" },
      { texto: "Sentirme atrapada o sin libertad", elemento: "aire" },
      { texto: "La frialdad emocional de otros", elemento: "agua" },
      { texto: "El caos y la falta de estabilidad", elemento: "tierra" }
    ]
  },
  {
    id: 5,
    pregunta: "Si pudieras tener un superpoder, ¿cuál elegirías?",
    opciones: [
      { texto: "Control del fuego y la energía", elemento: "fuego" },
      { texto: "Volar o ser invisible", elemento: "aire" },
      { texto: "Leer mentes y emociones", elemento: "agua" },
      { texto: "Super fuerza o curación", elemento: "tierra" }
    ]
  },
  {
    id: 6,
    pregunta: "¿Cómo recargas tu energía cuando estás agotada?",
    opciones: [
      { texto: "Haciendo ejercicio o algo activo", elemento: "fuego" },
      { texto: "Leyendo, pensando, meditando", elemento: "aire" },
      { texto: "Un baño largo o llorando si lo necesito", elemento: "agua" },
      { texto: "Cocinando, jardinería, algo manual", elemento: "tierra" }
    ]
  },
  {
    id: 7,
    pregunta: "¿Qué cualidad valorás más en vos misma?",
    opciones: [
      { texto: "Mi valentía y pasión", elemento: "fuego" },
      { texto: "Mi inteligencia y claridad mental", elemento: "aire" },
      { texto: "Mi sensibilidad y compasión", elemento: "agua" },
      { texto: "Mi confiabilidad y paciencia", elemento: "tierra" }
    ]
  },
  {
    id: 8,
    pregunta: "En el amor, ¿qué buscás principalmente?",
    opciones: [
      { texto: "Pasión intensa y aventura", elemento: "fuego" },
      { texto: "Conexión intelectual y libertad", elemento: "aire" },
      { texto: "Profundidad emocional y romance", elemento: "agua" },
      { texto: "Seguridad, lealtad y compromiso", elemento: "tierra" }
    ]
  },
  {
    id: 9,
    pregunta: "¿Cuál es tu mayor miedo secreto?",
    opciones: [
      { texto: "Perder mi pasión o volverme mediocre", elemento: "fuego" },
      { texto: "Quedar atrapada en una vida sin sentido", elemento: "aire" },
      { texto: "No ser amada o ser abandonada", elemento: "agua" },
      { texto: "Perder mi seguridad o a quienes amo", elemento: "tierra" }
    ]
  },
  {
    id: 10,
    pregunta: "Si tu vida fuera una estación del año, ¿cuál sería?",
    opciones: [
      { texto: "Verano - calor, intensidad, vitalidad", elemento: "fuego" },
      { texto: "Primavera - renovación, ideas frescas", elemento: "aire" },
      { texto: "Otoño - introspección, transformación", elemento: "agua" },
      { texto: "Invierno - quietud, fortaleza, raíces", elemento: "tierra" }
    ]
  },
  {
    id: 11,
    pregunta: "¿Qué animal sentís que representa tu esencia?",
    opciones: [
      { texto: "León, fénix o dragón", elemento: "fuego" },
      { texto: "Águila, mariposa o colibrí", elemento: "aire" },
      { texto: "Delfín, cisne o pez", elemento: "agua" },
      { texto: "Oso, elefante o lobo", elemento: "tierra" }
    ]
  },
  {
    id: 12,
    pregunta: "Cuando meditás o te relajás, ¿qué visualizás naturalmente?",
    opciones: [
      { texto: "Llamas, luz dorada, sol", elemento: "fuego" },
      { texto: "Cielo, nubes, estrellas", elemento: "aire" },
      { texto: "Agua fluyendo, lluvia, océano", elemento: "agua" },
      { texto: "Bosques, montañas, jardines", elemento: "tierra" }
    ]
  }
];

// GET - Obtener preguntas del test
export async function GET() {
  return Response.json({
    success: true,
    titulo: "Descubrí tu Reino Elemental",
    descripcion: "Este test revelará cuál de los cuatro elementos gobierna tu alma. Respondé con honestidad, dejando que tu intuición guíe tus respuestas.",
    preguntas: PREGUNTAS.map(p => ({
      id: p.id,
      pregunta: p.pregunta,
      opciones: p.opciones.map((o, i) => ({
        id: i,
        texto: o.texto
      }))
    })),
    total_preguntas: PREGUNTAS.length
  });
}

// POST - Procesar respuestas y calcular elemento
export async function POST(request) {
  try {
    const body = await request.json();
    const { respuestas, email } = body;

    if (!respuestas || !Array.isArray(respuestas) || respuestas.length < 10) {
      return Response.json({
        success: false,
        error: 'Se requieren al menos 10 respuestas'
      }, { status: 400 });
    }

    // Contar elementos
    const conteo = { fuego: 0, agua: 0, tierra: 0, aire: 0 };

    respuestas.forEach(r => {
      const pregunta = PREGUNTAS.find(p => p.id === r.preguntaId);
      if (pregunta && pregunta.opciones[r.opcionId]) {
        const elemento = pregunta.opciones[r.opcionId].elemento;
        conteo[elemento]++;
      }
    });

    // Determinar elemento dominante
    const elementoGanador = Object.entries(conteo)
      .sort((a, b) => b[1] - a[1])[0][0];

    // Calcular elemento secundario
    const elementoSecundario = Object.entries(conteo)
      .sort((a, b) => b[1] - a[1])[1][0];

    // Obtener info del canon
    const infoElemento = canon.elementos.find(e => e.id === elementoGanador);
    const infoSecundario = canon.elementos.find(e => e.id === elementoSecundario);

    // Calcular porcentajes
    const total = Object.values(conteo).reduce((a, b) => a + b, 0);
    const porcentajes = {};
    for (const [elem, count] of Object.entries(conteo)) {
      porcentajes[elem] = Math.round((count / total) * 100);
    }

    // Determinar compatibilidad con guardianes
    const guardianeAfines = getGuardianesAfines(elementoGanador);

    // Generar mensaje personalizado
    const mensaje = generarMensajeElemento(elementoGanador, porcentajes);

    const resultado = {
      elemento_principal: {
        id: elementoGanador,
        nombre: infoElemento.nombre,
        simbolo: infoElemento.simbolo,
        energia: infoElemento.energia,
        direccion: infoElemento.direccion,
        estacion: infoElemento.estacion,
        cristales: infoElemento.cristales_afines,
        ritual_conexion: infoElemento.ritual_conexion,
        personalidad_guardiana: infoElemento.personalidad_guardiana
      },
      elemento_secundario: {
        id: elementoSecundario,
        nombre: infoSecundario.nombre,
        simbolo: infoSecundario.simbolo,
        porcentaje: porcentajes[elementoSecundario]
      },
      porcentajes,
      guardianes_afines: guardianeAfines,
      mensaje,
      ritual_activacion: generarRitualActivacion(elementoGanador),
      fecha_test: new Date().toISOString()
    };

    // Si hay email, guardar resultado
    if (email) {
      const emailNorm = email.toLowerCase().trim();
      let userKey = `user:${emailNorm}`;
      let usuario = await kv.get(userKey);
      if (!usuario) {
        userKey = `elegido:${emailNorm}`;
        usuario = await kv.get(userKey);
      }

      if (usuario) {
        usuario.elemento = elementoGanador;
        usuario.elementoSecundario = elementoSecundario;
        usuario.testElementoFecha = resultado.fecha_test;
        usuario.testElementoResultado = resultado;
        await kv.set(userKey, usuario);
      }
    }

    return Response.json({
      success: true,
      resultado
    });

  } catch (error) {
    console.error('Error procesando test de elemento:', error);
    return Response.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}

function getGuardianesAfines(elemento) {
  const afinidades = {
    fuego: [
      { tipo: 'Mago', afinidad: 'Muy alta', razon: 'Los Magos del Fuego canalizan la transformación' },
      { tipo: 'Bruja', afinidad: 'Alta', razon: 'Las Brujas potencian tu poder interior' },
      { tipo: 'Duende', afinidad: 'Media', razon: 'Los Duendes del Fuego protegen con pasión' }
    ],
    agua: [
      { tipo: 'Hada', afinidad: 'Muy alta', razon: 'Las Hadas del Agua despiertan tu intuición' },
      { tipo: 'Elfo', afinidad: 'Alta', razon: 'Los Elfos conectan con tu sensibilidad' },
      { tipo: 'Bruja', afinidad: 'Media', razon: 'Las Brujas del Agua sanan emociones profundas' }
    ],
    tierra: [
      { tipo: 'Gnomo', afinidad: 'Muy alta', razon: 'Los Gnomos atraen abundancia y estabilidad' },
      { tipo: 'Duende', afinidad: 'Alta', razon: 'Los Duendes del Bosque protegen tu hogar' },
      { tipo: 'Mago', afinidad: 'Media', razon: 'Los Magos de la Tierra manifiestan tus sueños' }
    ],
    aire: [
      { tipo: 'Elfo', afinidad: 'Muy alta', razon: 'Los Elfos de Luz traen claridad y mensajes' },
      { tipo: 'Hada', afinidad: 'Alta', razon: 'Las Hadas del Aire despiertan creatividad' },
      { tipo: 'Mago', afinidad: 'Media', razon: 'Los Magos del Viento expanden tu mente' }
    ]
  };

  return afinidades[elemento] || afinidades.tierra;
}

function generarMensajeElemento(elemento, porcentajes) {
  const mensajes = {
    fuego: `Sos un alma de **Fuego**. La pasión arde en tu interior, transformando todo lo que tocás. Tenés el don de inspirar a otros y el coraje de enfrentar cualquier desafío. Tu energía es magnética, tu determinación inquebrantable.

Los guardianes del Fuego te eligen porque ven en vos una llama que nunca se apaga. Ellos potenciarán tu capacidad de transformación y te protegerán de quemarte en tu propia intensidad.

**Tu desafío:** Aprender a canalizar tu fuego sin consumirte.
**Tu regalo:** La capacidad de iluminar el camino de otros.`,

    agua: `Sos un alma de **Agua**. La intuición fluye a través de vos como un río ancestral. Sentís lo que otros ni siquiera perciben, y tu empatía es tu superpoder más profundo. Tu corazón es un océano de sabiduría emocional.

Los guardianes del Agua te eligen porque ven en vos un canal puro para los mensajes del universo. Ellos profundizarán tu conexión intuitiva y te enseñarán a no ahogarte en las emociones ajenas.

**Tu desafío:** Poner límites sin perder tu sensibilidad.
**Tu regalo:** La capacidad de sanar y comprender el alma de otros.`,

    tierra: `Sos un alma de **Tierra**. La estabilidad y la fuerza nacen de tus raíces profundas. Sos el pilar en el que otros se apoyan, la presencia sólida que transforma sueños en realidad. Tu paciencia es legendaria.

Los guardianes de la Tierra te eligen porque ven en vos la capacidad de manifestar lo imposible. Ellos multiplicarán tu abundancia y te ayudarán a no quedarte estancada en lo seguro.

**Tu desafío:** Atreverte a cambiar cuando sea necesario.
**Tu regalo:** La capacidad de construir imperios duraderos.`,

    aire: `Sos un alma de **Aire**. Las ideas vuelan en tu mente como pájaros libres, y tu intelecto es tu herramienta más poderosa. Ves patrones donde otros ven caos, y tu perspectiva es única e invaluable.

Los guardianes del Aire te eligen porque ven en vos un puente entre mundos, una mensajera de verdades elevadas. Ellos expandirán tu visión y te anclarán cuando vueles demasiado alto.

**Tu desafío:** Aterrizar tus ideas en acciones concretas.
**Tu regalo:** La capacidad de ver más allá de lo obvio.`
  };

  return mensajes[elemento] || mensajes.tierra;
}

function generarRitualActivacion(elemento) {
  const rituales = {
    fuego: {
      nombre: "Ritual de la Llama Interior",
      materiales: ["Vela roja o naranja", "Citrino o cornalina", "Papel y lapicera"],
      pasos: [
        "Buscá un momento al atardecer cuando el sol está cayendo",
        "Encendé la vela visualizando tu fuego interior",
        "Escribí en el papel algo que querés transformar",
        "Sosteniendo el cristal, leé en voz alta lo que escribiste",
        "Quemá el papel en la llama (con cuidado)",
        "Cerrá diciendo: 'Mi fuego transforma, mi fuego crea, mi fuego ilumina'",
        "Dejá que la vela se consuma completamente"
      ]
    },
    agua: {
      nombre: "Ritual del Fluir Sagrado",
      materiales: ["Cuenco con agua", "Piedra luna o amatista", "Sal marina"],
      pasos: [
        "Realizá este ritual de noche, idealmente en luna llena",
        "Llená el cuenco con agua y agregá una pizca de sal",
        "Colocá el cristal dentro del agua",
        "Sumergí tus manos y sentí la temperatura del agua",
        "Visualizá tus emociones fluyendo y liberándose",
        "Decí: 'Fluyo con la vida, confío en mi intuición, soy agua'",
        "Dejá el cuenco bajo la luna y al día siguiente usá el agua para regar una planta"
      ]
    },
    tierra: {
      nombre: "Ritual del Arraigo Profundo",
      materiales: ["Turmalina negra u ojo de tigre", "Tierra de maceta o jardín", "Una semilla"],
      pasos: [
        "Salí descalza al pasto o tocá tierra con tus manos",
        "Sostené el cristal contra tu pecho respirando profundo",
        "Visualizá raíces saliendo de tus pies hacia el centro de la Tierra",
        "Plantá la semilla diciendo tu intención de manifestación",
        "Cubrí con tierra y presioná firme",
        "Decí: 'Mis raíces son profundas, mi manifestación es segura, soy Tierra'",
        "Cuidá esa planta como símbolo de tu intención"
      ]
    },
    aire: {
      nombre: "Ritual del Vuelo Libre",
      materiales: ["Pluma (natural si es posible)", "Fluorita o cuarzo cristal", "Incienso de sándalo"],
      pasos: [
        "Elegí un lugar elevado o junto a una ventana abierta",
        "Encendé el incienso y dejá que el humo te envuelva",
        "Sostené la pluma y el cristal, uno en cada mano",
        "Respirá profundo sintiendo el aire llenar tus pulmones",
        "Visualizá tus pensamientos ordenándose, las ideas clarificándose",
        "Decí: 'Mi mente es libre, mi visión es clara, soy Aire'",
        "Dejá ir la pluma al viento (si es posible) o colocala en tu altar"
      ]
    }
  };

  return rituales[elemento] || rituales.tierra;
}
