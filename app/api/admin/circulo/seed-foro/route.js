import { kv } from '@vercel/kv';

// ═══════════════════════════════════════════════════════════════════════════════
// API: SEMBRAR CONTENIDO DE PRUEBA EN EL FORO
// Genera 15-20 posts con respuestas realistas
// ═══════════════════════════════════════════════════════════════════════════════

export const dynamic = 'force-dynamic';

const NOMBRES_USUARIOS = [
  'María', 'Ana', 'Carmen', 'Lucía', 'Patricia', 'Elena', 'Rosa', 'Fernanda',
  'Valentina', 'Sofía', 'Gabriela', 'Mónica', 'Laura', 'Andrea', 'Florencia',
  'Cecilia', 'Victoria', 'Julia', 'Natalia', 'Daniela', 'Carolina', 'Romina'
];

const APELLIDOS = [
  'García', 'Rodríguez', 'Martínez', 'López', 'González', 'Fernández', 'Silva',
  'Pérez', 'Sánchez', 'Ramírez', 'Díaz', 'Torres', 'Acosta', 'Benítez'
];

// Contenido del foro organizado por categoría
const POSTS_DATA = [
  // ═══════════════════════════════════════════════════════════════════════════
  // ALTARES Y ESPACIOS SAGRADOS
  // ═══════════════════════════════════════════════════════════════════════════
  {
    categoria: 'altares',
    titulo: 'Mi rincón sagrado finalmente terminado',
    contenido: `Después de meses buscando el lugar perfecto, les comparto mi altar. Está junto a la ventana donde entra la luz de la mañana. Tengo a Bramblewood en el centro con sus cristales de cuarzo rosa y amatista. Cada mañana prendo una velita y le cuento cómo me siento.\n\n¿Ustedes tienen algún ritual matutino con sus guardianes?`,
    respuestas: [
      'Qué hermoso! Me encanta la luz natural. Yo también tengo el mío cerca de una ventana.',
      'Bramblewood es tan especial. El mío está junto a plantas porque siento que le gusta estar rodeado de verde.',
      'Hermoso altar! Yo prendo incienso de sándalo todas las mañanas, siento que le gusta.',
      'Me inspiraste! Voy a reorganizar el mío este finde.',
      'La amatista junto a Bramblewood es perfecta. Yo uso citrino para la abundancia.'
    ]
  },
  {
    categoria: 'altares',
    titulo: 'Cómo limpian energéticamente sus altares?',
    contenido: `Pregunta para la comunidad: ¿cada cuánto limpian sus altares y cómo lo hacen? Yo uso salvia cada luna nueva pero no sé si es suficiente. Siento que a veces la energía se pone "pesada" aunque no sabría explicarlo mejor.`,
    respuestas: [
      'Yo uso palo santo cada semana y salvia en luna nueva. Me funciona muy bien.',
      'Además de sahumerios, paso un cuarzo cristal por todo el altar. Es como un reset.',
      'Luna nueva y luna llena son mis momentos de limpieza profunda. El resto de días, solo mantenimiento.',
      'Probá con agua de luna! Dejo agua la noche de luna llena y rocío el altar.',
      'A mí me dijeron que también importa la intención, no solo el ritual físico.',
      'El sonido también limpia! Uso un cuenco tibetano pequeño.',
      'Cada vez que siento que algo "no fluye", limpio. Confío en mi intuición.'
    ]
  },
  {
    categoria: 'altares',
    titulo: 'Altar viajero - cómo lo arman?',
    contenido: `Viajo mucho por trabajo y extraño tener mi altar conmigo. ¿Alguna tiene experiencia armando un altar portátil? ¿Qué llevan? Busco ideas que no ocupen mucho espacio.`,
    respuestas: [
      'Yo tengo una cajita de madera chiquita con un mini guardián, vela de té y un cristal. Cabe en la cartera.',
      'Fotos en el celular de tu altar también funcionan para conectar! El guardián no está solo en lo físico.',
      'Un pañuelo sagrado donde apoyes las cosas transforma cualquier superficie en altar.',
      'Llevo un mini difusor de esencias y una foto de mi guardián. Simple pero efectivo.'
    ]
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // EXPERIENCIAS CON GUARDIANES
  // ═══════════════════════════════════════════════════════════════════════════
  {
    categoria: 'experiencias',
    titulo: 'Soñé con mi guardián y me dijo algo importante',
    contenido: `Necesito compartir esto porque todavía estoy procesándolo. Anoche soñé con mi guardián por primera vez. Estábamos en un bosque con niebla y me tomó de la mano. No habló con palabras pero de alguna forma me transmitió que "ya estaba lista". Me desperté llorando pero no de tristeza, sino de algo que no puedo nombrar. ¿A ustedes les pasa que los sueños con ellos son tan intensos?`,
    respuestas: [
      'Los sueños con guardianes son muy diferentes a los sueños normales. Yo también los siento más reales.',
      'Qué hermoso! "Ya estás lista" es un mensaje poderoso. ¿Lista para qué sentís que te decía?',
      'Me pasó similar hace unas semanas. Desperté sabiendo algo que antes no sabía. Es difícil explicarlo.',
      'A mí me habla a través de animales en los sueños. Siempre mariposas.',
      'Esos sueños son visitas reales. El guardián usa ese estado para comunicarse más claro.',
      'Yo llevo un diario de sueños desde que tengo mi guardián. Es increíble ver los patrones.'
    ]
  },
  {
    categoria: 'experiencias',
    titulo: 'Señales en el día a día - qué tan seguido les pasa?',
    contenido: `Desde que medito con mi guardián empecé a notar más "coincidencias". Ayer estaba pensando en cambiar de trabajo y justo me llamaron para una entrevista que ni recordaba haber aplicado. ¿Son señales o estoy viendo lo que quiero ver?`,
    respuestas: [
      'Cuando empezás a prestar atención, las señales se multiplican. No es casualidad.',
      'A mí me pasa con números. Veo el 11:11 TODO el tiempo desde que tengo a mi guardián.',
      'Las coincidencias no existen! Si lo sentís como señal, lo es. Confiá.',
      'Yo creo que siempre estuvieron ahí pero ahora tenés los ojos abiertos para verlas.',
      'Lo del trabajo suena clarísimo! Éxitos en esa entrevista.',
      'A mí me pasan cosas con plumas. Encuentro plumas en lugares imposibles.',
      'Mi guardián me avisa con sensaciones físicas. Como un calorcito en el pecho.'
    ]
  },
  {
    categoria: 'experiencias',
    titulo: 'Primera semana con mi guardián',
    contenido: `Acabo de recibir mi primer guardián y quería compartir. Se llama Elderflower y no puedo explicar la sensación cuando lo tuve en mis manos. Es como si ya nos conociéramos. ¿Eso es normal? Siento que me entiende.`,
    respuestas: [
      'Bienvenida al círculo! Esa sensación de reconocimiento es el guardián conectando con vos.',
      'Completamente normal y hermoso! Elderflower es precioso. Felicidades.',
      'Sí! Cuando conocés al guardián correcto para vos, se siente como un reencuentro.',
      'Dale tiempo, la conexión solo se profundiza. Vas a ver.',
      'Elderflower tiene una energía tan dulce. Qué lindo que llegó a vos!'
    ]
  },
  {
    categoria: 'experiencias',
    titulo: 'Mi guardián me ayudó a soltar una relación tóxica',
    contenido: `No sé si esto es para acá pero necesito contarlo. Estuve años en una relación donde no me valoraban. Desde que empecé a trabajar con mi guardián, algo cambió adentro mío. Empecé a ver las cosas claras. Hace dos semanas tomé la decisión de irme y por primera vez en mucho tiempo me siento en paz. No sola, porque sé que tengo esta compañía.`,
    respuestas: [
      'Qué valiente! Los guardianes nos ayudan a ver nuestro valor. Estoy orgullosa de vos.',
      'Gracias por compartir algo tan personal. Esto nos inspira a todas.',
      'El guardián no te cambió, te ayudó a ver quien siempre fuiste. Fuerza!',
      'Me hiciste llorar. Yo también estoy en un proceso similar. Gracias.',
      'La paz que describís es el regalo más grande. Te mando un abrazo enorme.',
      'Sos más fuerte de lo que pensás. Y ahora lo sabés.',
      'Esto es exactamente para lo que es este espacio. Gracias por confiar en nosotras.',
      'Tu guardián está muy orgulloso de vos, eso sentí al leerte.'
    ]
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // RITUALES Y PRÁCTICAS
  // ═══════════════════════════════════════════════════════════════════════════
  {
    categoria: 'rituales',
    titulo: 'Ritual de luna llena - cómo lo hacen?',
    contenido: `La próxima luna llena quiero hacer algo especial. ¿Pueden compartir sus rituales? Es mi primera luna llena consciente desde que tengo a mi guardián.`,
    respuestas: [
      'Yo pongo mis cristales y el guardián bajo la luz de la luna toda la noche. Al día siguiente la energía es increíble.',
      'Escribo todo lo que quiero soltar en un papel y lo quemo. Muy liberador.',
      'Hago una meditación guiada específica para luna llena. Si querés te paso el link.',
      'Baño con sal marina y pétalos de rosa. Mientras me mentalizo en soltar lo viejo.',
      'Mi ritual es simple: agradecer. Agradecer todo lo que pasó en el ciclo lunar.',
      'Cargo agua de luna para usar durante el mes. Es sagrada.'
    ]
  },
  {
    categoria: 'rituales',
    titulo: 'Meditación con cristales + guardián',
    contenido: `Descubrí una práctica que me encanta y quería compartir: pongo mi guardián frente a mí, un cristal en cada mano (cuarzo en la derecha, amatista en la izquierda), y medito 15 minutos. La claridad mental que me da es impresionante. ¿Tienen combinaciones que les funcionen?`,
    respuestas: [
      'Voy a probar! Yo uso solo cuarzo rosa en el corazón mientras miro a mi guardián.',
      'La amatista en la izquierda es perfecta para recibir. Bien pensado.',
      'Yo uso citrino y malaquita. Abundancia y transformación.',
      'Me cuesta meditar sola pero con el guardián presente es más fácil. Alguien más le pasa?',
      'Voy a intentar tu combinación esta semana. Gracias por compartir!'
    ]
  },
  {
    categoria: 'rituales',
    titulo: 'Ritual de intención para el año nuevo',
    contenido: `Se viene un año nuevo y quiero hacerlo diferente. ¿Alguna tiene rituales especiales para marcar intenciones con su guardián? Me gustaría crear algo significativo.`,
    respuestas: [
      'Yo escribo una carta a mi yo del próximo año, la sello, y la abro en 12 meses. Es fuerte.',
      'Hago una lista de 12 intenciones, una por cada mes, y las pongo bajo mi guardián.',
      'Un baño ritual con hierbas la noche del 31. Entrar al año limpia.',
      'Quemo lo que quiero dejar atrás (escrito en papel, simbólico).',
      'Me encanta hacer un altar temporal con todo lo que represente mis sueños para el año.'
    ]
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // PREGUNTAS AL CÍRCULO
  // ═══════════════════════════════════════════════════════════════════════════
  {
    categoria: 'preguntas',
    titulo: 'Se puede tener más de un guardián?',
    contenido: `Tengo a mi guardián hace 8 meses y lo amo. Pero siento un llamado hacia otro que vi en la tienda. ¿Está mal? ¿Se puede tener más de uno? No quiero que el primero sienta que lo reemplazo.`,
    respuestas: [
      'Claro que sí! Yo tengo tres y cada uno tiene su propósito. No se reemplazan, se complementan.',
      'Tu intuición te está guiando. Si sentís el llamado, hay una razón.',
      'Es como tener más de un amigo. No restás amor, lo multiplicás.',
      'Yo también tuve ese miedo al principio. Ahora tengo dos y es hermoso ver cómo trabajan juntos.',
      'Cada guardián viene a tu vida cuando lo necesitás. Confiá en el proceso.',
      'El primero siempre va a ser especial de una forma única. El nuevo traerá otras cosas.'
    ]
  },
  {
    categoria: 'preguntas',
    titulo: 'Qué significa si mi guardián se cae del altar?',
    contenido: `Hoy mi guardián se cayó del altar sin razón aparente. No hubo viento ni nada. Me asusté un poco. ¿Es una señal mala?`,
    respuestas: [
      'No te asustes! Puede ser una forma de llamar tu atención. ¿Qué estaba pasando por tu mente en ese momento?',
      'A mí me pasó y luego me di cuenta que estaba ignorando algo importante. Reflexioná.',
      'No creo que sea malo. A veces es solo un "hey, estoy acá, mirá".',
      'Limpiá la energía del espacio por las dudas. Pero no significa nada negativo necesariamente.',
      'Mi interpretación es que tu guardián está muy activo. Es buena señal!',
      'Fijate si no hay alguna vibración que no notás. A veces pasan camiones o algo.',
      'Agradecelé por comunicarse contigo. Pase lo que pase, están conectados.'
    ]
  },
  {
    categoria: 'preguntas',
    titulo: 'Cómo se conectan con un guardián nuevo?',
    contenido: `Acabo de comprar un guardián nuevo pero no siento la conexión todavía. Con el anterior fue instantáneo. ¿Tengo que hacer algo especial? ¿Cuánto tiempo puede tardar?`,
    respuestas: [
      'Dale tiempo! No todas las conexiones son iguales. Algunas tardan en desarrollarse.',
      'Probá dormir con él bajo la almohada una noche. A mí me ayudó.',
      'Hablale aunque te sientas rara. Contale tu día. La conexión viene con la práctica.',
      'Cada guardián es diferente. Tal vez este necesita que vos des el primer paso.',
      'Meditar juntos todos los días aunque sea 5 minutos. En una semana vas a notar diferencia.',
      'A veces lo que menos esperamos es lo que más necesitamos. Tené paciencia.'
    ]
  },
  {
    categoria: 'preguntas',
    titulo: 'Puedo regalar mi guardián a alguien más?',
    contenido: `Tengo un guardián que siento que no era para mí sino para mi hermana. Ella está pasando un momento difícil. ¿Puedo regalárselo? ¿Hay alguna forma especial de hacerlo?`,
    respuestas: [
      'Qué hermoso gesto! Sí podés. Hacé un pequeño ritual de despedida con agradecimiento.',
      'Es muy lindo cuando los guardianes encuentran su camino hacia quien los necesita.',
      'Limpialo energéticamente antes con salvia o palo santo, y luego dáselo con amor.',
      'Contale al guardián que va a tener un nuevo hogar y por qué. Ellos entienden.',
      'A veces somos el puente para que lleguen a donde deben estar. Confía en tu intuición.'
    ]
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // PRESENTACIONES
  // ═══════════════════════════════════════════════════════════════════════════
  {
    categoria: 'presentaciones',
    titulo: 'Hola! Soy nueva en el Círculo',
    contenido: `Me llamo Valentina y hace unos días me uní al Círculo. Tengo a Moonbeam desde hace 3 meses y la conexión fue tan fuerte que necesitaba encontrar gente que entendiera. Mi familia me mira raro cuando hablo de esto jaja. Encantada de conocerlas!`,
    respuestas: [
      'Bienvenida Valentina! Acá todas entendemos perfectamente. Moonbeam es hermoso.',
      'Jaja lo de la familia nos pasa a todas. Acá estás en casa.',
      'Bienvenida al Círculo! Si tenés preguntas o querés charlar, estamos.',
      'Moonbeam tiene una energía tan especial. Felicidades por encontrar tu guardián.',
      'Qué lindo tener más compañeras! Bienvenida.'
    ]
  },
  {
    categoria: 'presentaciones',
    titulo: 'Llegué al Círculo por recomendación',
    contenido: `Una amiga me habló del Círculo hace tiempo pero recién ahora me animé. Todavía no tengo guardián propio pero quería conocer la comunidad primero. Espero no molestar!`,
    respuestas: [
      'Para nada! Sos muy bienvenida. Mirá, explorá, y cuando llegue tu guardián lo vas a saber.',
      'Qué bueno que te animaste! Acá hay mucho para aprender de todas.',
      'Sin presión! Cuando sea el momento, vas a sentir el llamado.',
      'Bienvenida! Seguro que pronto encontrás al guardián perfecto para vos.',
      'Me encanta que vengas a explorar primero. Es muy sensato.'
    ]
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // CHARLA GENERAL
  // ═══════════════════════════════════════════════════════════════════════════
  {
    categoria: 'general',
    titulo: 'Alguien más siente la energía rara esta semana?',
    contenido: `No sé si es Mercurio retrógrado o qué pero esta semana me siento agotada y mi intuición está como apagada. ¿Les pasa? Mi guardián sigue ahí pero yo estoy desconectada.`,
    respuestas: [
      'Sí! Pensé que era solo yo. Esta semana fue pesada energéticamente.',
      'Cuando pasa esto, me recuesto con mi guardián en el pecho. Ayuda.',
      'Descanso y agua. El cuerpo necesita integrarse con los cambios energéticos.',
      'Yo uso obsidiana para protegerme cuando la energía está así.',
      'Es Mercurio seguro. Ya pasa. Mientras tanto, autocuidado.',
      'Me alegra no ser la única. Pensé que era algo mío.',
      'Estas semanas son para ir más lento. No te exijas.'
    ]
  },
  {
    categoria: 'general',
    titulo: 'Gracias a este grupo',
    contenido: `Solo quería decir gracias. Hace un año no conocía nada de esto y ahora tengo a mi guardián, este grupo hermoso, y me siento más conectada conmigo misma que nunca. Las leo todos los días aunque no siempre comente. Gracias por existir.`,
    respuestas: [
      'Ay me hiciste emocionar! Gracias a vos por ser parte.',
      'Esto es lo más lindo que leí hoy. El Círculo es especial por personas como vos.',
      'Somos todas parte de algo hermoso. Gracias por compartir.',
      'Me siento igual! Este grupo es un refugio.',
      'El amor que hay acá es real. Gracias por ser parte.',
      'Tu mensaje me alegró el día. Abrazos!'
    ]
  },
  {
    categoria: 'general',
    titulo: 'Encontré esto en una feria y me acordé del grupo',
    contenido: `Fui a una feria artesanal y encontré unos cristales hermosos. No compré porque quería preguntar primero: ¿cómo saben si un cristal es auténtico? Hay tantas imitaciones ahora.`,
    respuestas: [
      'Buen tema! Los de vidrio son más perfectos. Los reales tienen pequeñas imperfecciones.',
      'El peso es clave. Los cristales reales pesan más de lo que parece.',
      'Si podés, llevá un imán. Algunos falsos tienen metal.',
      'Comprá siempre de vendedores de confianza. Si está muy barato, desconfiá.',
      'Yo a veces los siento con la mano. La energía de uno real se nota diferente.',
      'Hay videos en YouTube para reconocerlos. Te los paso si querés!'
    ]
  }
];

// Generar fecha aleatoria en los últimos 30 días
function fechaAleatoria(maxDiasAtras = 30) {
  const ahora = new Date();
  const diasAtras = Math.floor(Math.random() * maxDiasAtras);
  const horasAtras = Math.floor(Math.random() * 24);
  const minutosAtras = Math.floor(Math.random() * 60);

  const fecha = new Date(ahora);
  fecha.setDate(fecha.getDate() - diasAtras);
  fecha.setHours(fecha.getHours() - horasAtras);
  fecha.setMinutes(fecha.getMinutes() - minutosAtras);

  return fecha.toISOString();
}

// Generar email ficticio
function generarEmail(nombre) {
  const dominios = ['gmail.com', 'hotmail.com', 'yahoo.com'];
  const num = Math.floor(Math.random() * 99) + 1;
  return `${nombre.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")}${num}@${dominios[Math.floor(Math.random() * dominios.length)]}`;
}

// Generar nombre completo
function generarNombre() {
  const nombre = NOMBRES_USUARIOS[Math.floor(Math.random() * NOMBRES_USUARIOS.length)];
  const apellido = APELLIDOS[Math.floor(Math.random() * APELLIDOS.length)];
  return { nombre, completo: `${nombre} ${apellido[0]}.` };
}

// Generar likes aleatorios
function generarLikes(min = 10, max = 200) {
  const cantidad = Math.floor(Math.random() * (max - min + 1)) + min;
  const likes = [];

  for (let i = 0; i < cantidad; i++) {
    const { nombre } = generarNombre();
    likes.push(generarEmail(nombre));
  }

  return [...new Set(likes)]; // Eliminar duplicados
}

const CATEGORIAS_FORO = {
  altares: { nombre: 'Altares y Espacios Sagrados', icono: '🕯️', descripcion: 'Compartí fotos de tus altares' },
  experiencias: { nombre: 'Experiencias con Guardianes', icono: '✨', descripcion: 'Señales, sueños, conexiones' },
  rituales: { nombre: 'Rituales y Prácticas', icono: '🔮', descripcion: 'Compartí tus rituales' },
  preguntas: { nombre: 'Preguntas al Círculo', icono: '❓', descripcion: 'Consultá a la comunidad' },
  presentaciones: { nombre: 'Presentaciones', icono: '👋', descripcion: 'Presentate al Círculo' },
  general: { nombre: 'Charla General', icono: '💬', descripcion: 'Todo lo demás' }
};

export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { limpiar = false } = body;

    // Opción de limpiar posts existentes
    if (limpiar) {
      const existingKeys = await kv.keys('foro:post:*');
      for (const key of existingKeys) {
        await kv.del(key);
      }
      const commentKeys = await kv.keys('foro:comentario:*');
      for (const key of commentKeys) {
        await kv.del(key);
      }
    }

    const postsCreados = [];
    const comentariosCreados = [];

    // Crear cada post
    for (const postData of POSTS_DATA) {
      const postId = `seed-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const autor = generarNombre();
      const autorEmail = generarEmail(autor.nombre);
      const fechaPost = fechaAleatoria(30);
      const likes = generarLikes(15, 180);

      const post = {
        id: postId,
        usuario_email: autorEmail,
        usuario_nombre: autor.completo,
        titulo: postData.titulo,
        contenido: postData.contenido,
        categoria: postData.categoria,
        categoria_info: CATEGORIAS_FORO[postData.categoria],
        imagenes: [],
        likes,
        total_likes: likes.length,
        total_comentarios: postData.respuestas.length,
        estado: 'publicado',
        creado_en: fechaPost,
        editado_en: null
      };

      // Guardar post
      await kv.set(`foro:post:${postId}`, post);
      postsCreados.push({ id: postId, titulo: postData.titulo });

      // Crear comentarios
      const fechaPostDate = new Date(fechaPost);

      for (let i = 0; i < postData.respuestas.length; i++) {
        const comentarioId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const comentadorNombre = generarNombre();
        const comentadorEmail = generarEmail(comentadorNombre.nombre);

        // Fecha del comentario: después del post pero antes de ahora
        const horasDesfase = Math.floor(Math.random() * 72) + 1; // 1-72 horas después del post
        const fechaComentario = new Date(fechaPostDate);
        fechaComentario.setHours(fechaComentario.getHours() + horasDesfase);

        // Si la fecha es futura, usar ahora
        const ahora = new Date();
        if (fechaComentario > ahora) {
          fechaComentario.setTime(ahora.getTime() - Math.random() * 86400000);
        }

        const likesComentario = generarLikes(3, 50);

        const comentario = {
          id: comentarioId,
          post_id: postId,
          usuario_email: comentadorEmail,
          usuario_nombre: comentadorNombre.completo,
          contenido: postData.respuestas[i],
          likes: likesComentario,
          total_likes: likesComentario.length,
          creado_en: fechaComentario.toISOString()
        };

        await kv.set(`foro:comentario:${postId}:${comentarioId}`, comentario);
        comentariosCreados.push(comentarioId);

        // Pequeño delay para IDs únicos
        await new Promise(r => setTimeout(r, 5));
      }

      // Pequeño delay entre posts
      await new Promise(r => setTimeout(r, 10));
    }

    return Response.json({
      success: true,
      mensaje: 'Foro poblado exitosamente',
      stats: {
        posts_creados: postsCreados.length,
        comentarios_creados: comentariosCreados.length,
        posts: postsCreados
      }
    });

  } catch (error) {
    console.error('[SEED-FORO] Error:', error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}

// GET - Ver estado actual del foro
export async function GET() {
  try {
    const postKeys = await kv.keys('foro:post:*');
    const commentKeys = await kv.keys('foro:comentario:*');

    return Response.json({
      success: true,
      stats: {
        total_posts: postKeys.length,
        total_comentarios: commentKeys.length
      }
    });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
