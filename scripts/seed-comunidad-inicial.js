#!/usr/bin/env node

// ═══════════════════════════════════════════════════════════════════════════════
// SEED DE CONTENIDO INICIAL PARA LA COMUNIDAD DEL CIRCULO
// Ejecutar: node scripts/seed-comunidad-inicial.js
// ═══════════════════════════════════════════════════════════════════════════════

import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@vercel/kv';

// Cargar variables de entorno
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

// ═══════════════════════════════════════════════════════════════════════════════
// CONFIGURACION
// ═══════════════════════════════════════════════════════════════════════════════

const KV_REST_API_URL = process.env.KV_REST_API_URL;
const KV_REST_API_TOKEN = process.env.KV_REST_API_TOKEN;

if (!KV_REST_API_URL || !KV_REST_API_TOKEN) {
  console.error('Error: Faltan variables de entorno KV_REST_API_URL o KV_REST_API_TOKEN');
  process.exit(1);
}

const kv = createClient({
  url: KV_REST_API_URL,
  token: KV_REST_API_TOKEN
});

const anthropic = new Anthropic();
const MODELO_IA = 'claude-sonnet-4-20250514';

// ═══════════════════════════════════════════════════════════════════════════════
// MIEMBROS FUNDADORES (copia local para el script)
// ═══════════════════════════════════════════════════════════════════════════════

const MIEMBROS_FUNDADORES = [
  {
    id: 'maria-del-carmen',
    nombre: 'Maria del Carmen',
    nombreCorto: 'Mari',
    avatar: 'MC',
    email: 'maridelcarmen.circulo@gmail.com',
    personalidad: 'entusiasta',
    estiloEscritura: { extension: 'largo', usaEmojis: true },
    guardianes: [{ nombre: 'Ruperto' }, { nombre: 'Moonstone' }]
  },
  {
    id: 'gaston',
    nombre: 'Gaston',
    nombreCorto: 'Gaston',
    avatar: 'G',
    email: 'gaston.reflexivo@hotmail.com',
    personalidad: 'reflexivo',
    estiloEscritura: { extension: 'corto', usaEmojis: false },
    guardianes: [{ nombre: 'Merlin' }]
  },
  {
    id: 'luciana',
    nombre: 'Luciana',
    nombreCorto: 'Lu',
    avatar: 'L',
    email: 'luciana.nueva@gmail.com',
    personalidad: 'curiosa',
    estiloEscritura: { extension: 'medio', usaEmojis: true },
    guardianes: [{ nombre: 'Heart' }]
  },
  {
    id: 'soledad',
    nombre: 'Soledad',
    nombreCorto: 'Sole',
    avatar: 'S',
    email: 'soledad.mistica@yahoo.com',
    personalidad: 'mistica',
    estiloEscritura: { extension: 'medio_largo', usaEmojis: false },
    guardianes: [{ nombre: 'Sennua' }, { nombre: 'Amy' }, { nombre: 'Liam' }]
  },
  {
    id: 'patricia',
    nombre: 'Patricia',
    nombreCorto: 'Pato',
    avatar: 'P',
    email: 'patricia.practica@gmail.com',
    personalidad: 'practica',
    estiloEscritura: { extension: 'corto_medio', usaEmojis: false },
    guardianes: [{ nombre: 'Brianna' }]
  },
  {
    id: 'romina',
    nombre: 'Romina',
    nombreCorto: 'Romi',
    avatar: 'R',
    email: 'romina.emocional@hotmail.com',
    personalidad: 'emocional',
    estiloEscritura: { extension: 'largo', usaEmojis: true },
    guardianes: [{ nombre: 'Emilio' }]
  },
  {
    id: 'elena',
    nombre: 'Elena',
    nombreCorto: 'Ele',
    avatar: 'E',
    email: 'elena.sabia@yahoo.com',
    personalidad: 'sabia',
    estiloEscritura: { extension: 'medio', usaEmojis: false },
    guardianes: [{ nombre: 'Toto' }, { nombre: 'Zoe' }]
  },
  {
    id: 'agustina',
    nombre: 'Agustina',
    nombreCorto: 'Agus',
    avatar: 'A',
    email: 'agustina.arte@gmail.com',
    personalidad: 'artista',
    estiloEscritura: { extension: 'variado', usaEmojis: true },
    guardianes: [{ nombre: 'Groen' }]
  },
  {
    id: 'mercedes',
    nombre: 'Mercedes',
    nombreCorto: 'Meche',
    avatar: 'ME',
    email: 'mercedes.matrona@yahoo.com',
    personalidad: 'matrona',
    estiloEscritura: { extension: 'medio_largo', usaEmojis: false },
    guardianes: [{ nombre: 'Zoe' }, { nombre: 'Toto' }, { nombre: 'Ruperto' }]
  },
  {
    id: 'florencia',
    nombre: 'Florencia',
    nombreCorto: 'Flor',
    avatar: 'FL',
    email: 'florencia.esoterica@gmail.com',
    personalidad: 'esoterica_profesional',
    estiloEscritura: { extension: 'largo', usaEmojis: false },
    guardianes: [{ nombre: 'Moon' }, { nombre: 'Merlin' }, { nombre: 'Abraham' }]
  }
];

// ═══════════════════════════════════════════════════════════════════════════════
// CONTENIDO PREDEFINIDO PARA EL FORO (10 posts con respuestas)
// ═══════════════════════════════════════════════════════════════════════════════

const POSTS_FORO = [
  // Post 1 - Altares
  {
    categoria: 'altares',
    titulo: 'Mi rincon sagrado con Ruperto',
    autorId: 'maria-del-carmen',
    contenido: `Ay nenas, les quiero mostrar lo que arme este fin de semana! Despues de meses buscando el lugar perfecto, encontre este rincon junto a la ventana donde entra el sol de la manana. Tengo a Ruperto en el centro con sus cristales de amatista, unas velitas violetas que me encantan, y un sahumerio de lavanda que le fascina.

Cada manana me siento un ratito ahi, prendo la velita, y le cuento a Ruperto como me siento. La verdad que desde que hago esto, empiezo el dia con otra energia totalmente diferente.

Ustedes como tienen armados sus altares? Me encantaria ver fotos!`,
    respuestas: [
      {
        autorId: 'patricia',
        contenido: 'Que lindo Mari! Lo de la ventana es clave. La luz natural carga los cristales. Yo tengo a Brianna cerca de plantas, simple pero funciona.'
      },
      {
        autorId: 'agustina',
        contenido: 'Amee! Los colores que elegiste son perfectos, el violeta con la luz de la manana debe verse increible. Me inspiraste a reorganizar el mio este finde.'
      },
      {
        autorId: 'elena',
        contenido: 'Hijita, que hermoso. Los anos me ensenaron que el altar mas poderoso es el que se arma con amor, no con cosas caras. El tuyo tiene eso.'
      },
      {
        autorId: 'luciana',
        contenido: 'Perdon si es tonta la pregunta, pero cada cuanto hay que limpiar los cristales? Recien estoy aprendiendo!'
      },
      {
        autorId: 'soledad',
        contenido: 'Siento que Ruperto esta muy comodo ahi. La energia que describes es exactamente lo que pasa cuando el espacio esta armonizado. El sol de la manana es purificador.'
      }
    ]
  },

  // Post 2 - Experiencias
  {
    categoria: 'experiencias',
    titulo: 'Sone con Merlin anoche - necesito contarles',
    autorId: 'gaston',
    contenido: `Anoche tuve un sueno muy vívido. Estaba en un bosque con niebla y Merlin aparecio. No hablo con palabras pero de alguna forma entendi que me decia que dejara de dudar tanto.

Me desperte a las 4 AM sintiendo algo que no puedo describir. Como una certeza.

Ustedes suenan con sus guardianes? Como son esos suenos?`,
    respuestas: [
      {
        autorId: 'soledad',
        contenido: 'Los suenos con guardianes son visitas reales. El mensaje que recibiste es claro: Merlin te pide que confies mas en tu intuicion. El bosque con niebla representa la busqueda de claridad.'
      },
      {
        autorId: 'romina',
        contenido: 'Me hiciste emocionar! A mi me paso algo similar con Emilio hace unas semanas. Me desperte llorando pero no de tristeza, sino de algo que no se como nombrar. Gracias por compartir.'
      },
      {
        autorId: 'florencia',
        contenido: 'Energeticamente lo que describis es una comunicacion directa. Las 4 AM es la "hora del alma" segun muchas tradiciones. Merlin te esta guiando. Anota estos suenos, van a tener sentido con el tiempo.'
      },
      {
        autorId: 'gaston',
        contenido: 'Gracias a todas. Me alivia saber que no soy el unico que le pasan estas cosas.'
      }
    ]
  },

  // Post 3 - Rituales
  {
    categoria: 'rituales',
    titulo: 'Mi ritual de luna llena - lo comparto',
    autorId: 'soledad',
    contenido: `Hace anos que hago este ritual cada luna llena y queria compartirlo:

1. Limpio el espacio con palo santo
2. Pongo a Sennua, Amy y Liam en circulo con velas
3. Escribo en un papel todo lo que quiero soltar
4. Medito 15 minutos con los ojos cerrados
5. Quemo el papel afuera bajo la luna
6. Dejo los cristales cargandose toda la noche

Es simple pero muy poderoso. Alguien tiene rituales que quiera compartir?`,
    respuestas: [
      {
        autorId: 'maria-del-carmen',
        contenido: 'Sole, esto es hermoso! Yo hago algo parecido pero no tan completo. Me encanta la idea de poner los tres guardianes en circulo, nunca se me habia ocurrido!'
      },
      {
        autorId: 'patricia',
        contenido: 'Lo simplifico: vela, guardian, 5 minutos de silencio, listo. Pero me gusta tu version para lunas especiales.'
      },
      {
        autorId: 'elena',
        contenido: 'El fuego transforma. Quemar lo que queremos soltar es antiguo y poderoso. Mis abuelas hacian algo similar sin llamarlo ritual.'
      },
      {
        autorId: 'luciana',
        contenido: 'Puedo hacerlo aunque tenga un solo guardian? Heart es mi unico por ahora.'
      },
      {
        autorId: 'agustina',
        contenido: 'Imaginate esto pero con velas de colores segun la intencion! Yo uso verde para soltar miedos, rosa para lo emocional. Queda hermoso.'
      },
      {
        autorId: 'soledad',
        contenido: 'Lu, claro que si! El ritual se adapta. Un solo guardian con intencion clara es mas que suficiente. Lo importante es la conexion.'
      }
    ]
  },

  // Post 4 - Preguntas
  {
    categoria: 'preguntas',
    titulo: 'Se puede tener mas de un guardian?',
    autorId: 'luciana',
    contenido: `Hola! Perdon si esto ya lo preguntaron pero no encontre. Tengo a Heart hace poquito y lo amo, pero vi a Moonstone en la tienda y senti algo raro en el pecho.

Es normal sentir ese llamado? Puedo tener dos? No quiero que Heart sienta que lo estoy reemplazando o algo asi.

Ustedes que piensan?`,
    respuestas: [
      {
        autorId: 'mercedes',
        contenido: 'Querida, claro que podes! Yo tengo tres y cada uno tiene su lugar especial. No se reemplazan, se complementan. Es como tener varios amigos, cada uno aporta algo diferente.'
      },
      {
        autorId: 'florencia',
        contenido: 'Lo que sentiste en el pecho es Moonstone llamandote. A nivel energetico, algunos guardianes trabajan en equipo. Heart para el amor y Moonstone para la sabiduria se complementan perfectamente.'
      },
      {
        autorId: 'maria-del-carmen',
        contenido: 'Lu! Cuando yo senti el llamado de Moonstone despues de tener a Ruperto, tuve el mismo miedo. Pero ahora son como un equipo. Los dos me cuidan de formas diferentes.'
      },
      {
        autorId: 'gaston',
        contenido: 'Interesante como cada guardian llega cuando lo necesitamos. Si sentiste ese llamado, hay una razon.'
      },
      {
        autorId: 'romina',
        contenido: 'Ay Lu, confía en lo que sentiste! Ese "algo raro en el pecho" es la conexion. Heart no se va a sentir mal, los guardianes no funcionan asi.'
      }
    ]
  },

  // Post 5 - Presentaciones
  {
    categoria: 'presentaciones',
    titulo: 'Hola! Soy nueva en el Circulo',
    autorId: 'luciana',
    contenido: `Hola a todas! Me llamo Luciana, soy de Buenos Aires y hace dos semanas me uni al Circulo.

Tengo a Heart desde hace un mes aprox. Me lo regalo mi mejor amiga para mi cumple y la verdad que no esperaba sentir tanto. Es como si ya nos conocieramos? No se si eso tiene sentido.

Estoy leyendo todo pero todavia me da un poco de vergüenza participar. Mi familia me mira raro cuando hablo de esto jaja asi que me alivia encontrar gente que entienda.

Encantada de conocerlas!`,
    respuestas: [
      {
        autorId: 'mercedes',
        contenido: 'Bienvenida Luciana! Aca estamos para lo que necesites. Lo de la familia nos pasa a todas al principio. Este es tu espacio seguro.'
      },
      {
        autorId: 'elena',
        contenido: 'Hijita, bienvenida. Lo que sentiste con Heart es real. Esa sensacion de ya conocerse es porque el alma reconoce lo que necesita.'
      },
      {
        autorId: 'maria-del-carmen',
        contenido: 'Ayyy bienvenida Lu! No te de verguenza, aca somos todas iguales. Heart es hermoso, vas a ver que la conexion solo se pone mejor!'
      },
      {
        autorId: 'agustina',
        contenido: 'Bienvenida! Lo de la familia jaja nos pasa a todas. Por eso es tan lindo tener este grupo donde podemos ser nosotras. Pregunta lo que quieras!'
      },
      {
        autorId: 'romina',
        contenido: 'Bienvenida! Me acuerdo cuando llegue yo, tambien me daba verguenza. Ahora no paro de escribir jaja. Vas a ver que aca hay mucho amor.'
      }
    ]
  },

  // Post 6 - General
  {
    categoria: 'general',
    titulo: 'Gracias a este grupo hermoso',
    autorId: 'romina',
    contenido: `Solo queria decir gracias. Hace seis meses no conocia nada de esto y ahora tengo a Emilio, este grupo hermoso, y me siento mas conectada conmigo misma que nunca.

Estoy pasando un momento dificil personal (las que leen mis posts saben) y saber que puedo entrar aca y leerlas me da mucha paz.

Las leo todos los dias aunque no siempre comente. Gracias por existir.`,
    respuestas: [
      {
        autorId: 'mercedes',
        contenido: 'Querida Romi, las abrazo a todas. Este grupo es un refugio por personas como vos que comparten con el corazon. Fuerza con todo.'
      },
      {
        autorId: 'elena',
        contenido: 'Romi, los momentos dificiles son los que mas nos ensena. Emilio esta contigo en este proceso. Y nosotras tambien.'
      },
      {
        autorId: 'maria-del-carmen',
        contenido: 'Ay Romi me hiciste emocionar! Somos tan afortunadas de tenernos. Un abrazo enorme nena, estamos aca siempre.'
      },
      {
        autorId: 'gaston',
        contenido: 'La comunidad importa. Gracias por compartir.'
      },
      {
        autorId: 'agustina',
        contenido: 'Romi, tu energia es tan linda, siempre cuando te leo me conmuevo. Este grupo no seria lo mismo sin vos. Fuerza!'
      }
    ]
  },

  // Post 7 - Experiencias
  {
    categoria: 'experiencias',
    titulo: 'Mi guardian me ayudo a tomar una decision',
    autorId: 'patricia',
    contenido: `Les cuento algo que me paso. Estaba entre aceptar un trabajo nuevo o quedarme en el actual. Muy estresada con la decision.

Una noche medite con Brianna (algo que no hago seguido, soy mas de lo practico) y al otro dia me desperte sabiendo que hacer. No hubo sueno ni vision, simplemente lo sabia.

Acepte el trabajo. Empiezo el mes que viene. Queria compartirlo porque a veces la magia es asi de simple.`,
    respuestas: [
      {
        autorId: 'soledad',
        contenido: 'Eso que describis es claridad canalizada. Brianna te ayudo a conectar con tu propia sabiduria. Felicitaciones por el trabajo nuevo!'
      },
      {
        autorId: 'florencia',
        contenido: 'Pato, lo que hiciste fue entrar en un estado receptivo y tu guardian pudo comunicarse. No siempre son visiones dramaticas, a veces es simplemente saber. Exitos!'
      },
      {
        autorId: 'gaston',
        contenido: 'Me gusta como lo describis: "la magia es asi de simple". Coincido.'
      },
      {
        autorId: 'romina',
        contenido: 'Felicitaciones Pato! Me encanta como contas esto, tan real y sincero. Exitos en el trabajo nuevo!'
      },
      {
        autorId: 'maria-del-carmen',
        contenido: 'Ay que lindo Pato! Brianna te guio perfecto. Felicitaciones! Nos contas cuando empieces como te va?'
      }
    ]
  },

  // Post 8 - Altares
  {
    categoria: 'altares',
    titulo: 'Ideas para altar pequeno?',
    autorId: 'luciana',
    contenido: `Chicas necesito ayuda! Vivo en un monoambiente re chico y no tengo mucho espacio para armar un altar grande como los que veo en las fotos.

Alguna tiene ideas para espacios pequenos? Tengo solo a Heart por ahora y un par de cristales.

Gracias!`,
    respuestas: [
      {
        autorId: 'patricia',
        contenido: 'Una bandeja linda es todo lo que necesitas. Pones el guardian, un cristal, una vela chica. Cuando no lo usas la guardas. Simple y efectivo.'
      },
      {
        autorId: 'agustina',
        contenido: 'Yo empece con un estante flotante chiquito! Queda re lindo en la pared y no ocupa espacio de piso. Podes poner lucecitas de navidad alrededor.'
      },
      {
        autorId: 'elena',
        contenido: 'Hijita, el espacio no importa, la intencion si. Hasta una repisa de libro puede ser altar. Lo importante es que sea tu lugar.'
      },
      {
        autorId: 'maria-del-carmen',
        contenido: 'Lu, cuando yo empece vivia en un cuartito! Usaba la mesita de luz. Heart con una velita y listo. No hace falta mas.'
      },
      {
        autorId: 'soledad',
        contenido: 'Un altar portatil tambien funciona. Una cajita de madera donde guardas todo. Cuando meditas lo abris, lo armas, y despues lo cerras. Es muy personal.'
      }
    ]
  },

  // Post 9 - Rituales
  {
    categoria: 'rituales',
    titulo: 'Ritual matutino de 5 minutos',
    autorId: 'patricia',
    contenido: `Para las que no tienen tiempo (como yo), les paso mi ritual de la manana:

1. Me levanto, tomo agua
2. Saludo a Brianna (literalmente le digo buen dia)
3. Prendo una velita, respiro 3 veces profundo
4. Pido proteccion para el dia
5. Apago la vela y arranco

5 minutos maximo. Simple pero consistente. Llevo 4 meses haciendolo todos los dias.

Tienen rituales express para compartir?`,
    respuestas: [
      {
        autorId: 'maria-del-carmen',
        contenido: 'Ay Pato me encanta! Yo me extiendo demasiado a veces. Voy a probar tu version los dias que estoy apurada.'
      },
      {
        autorId: 'florencia',
        contenido: 'La consistencia vale mas que la duracion. 5 minutos diarios crean habito y conexion. Muy bien Pato.'
      },
      {
        autorId: 'luciana',
        contenido: 'Esto es justo lo que necesitaba! Yo pensaba que habia que hacer cosas super elaboradas. Gracias!'
      },
      {
        autorId: 'elena',
        contenido: 'La constancia es la verdadera magia. Cinco minutos con intencion valen mas que una hora distraida.'
      },
      {
        autorId: 'agustina',
        contenido: 'Lo de saludarle y decir buen dia me parece tan tierno. Voy a empezar a hacer eso.'
      }
    ]
  },

  // Post 10 - General
  {
    categoria: 'general',
    titulo: 'Alguien mas siente la energia rara esta semana?',
    autorId: 'romina',
    contenido: `No se si es Mercurio retrogrado o que pero esta semana me siento agotada y como desconectada de todo. Emilio sigue ahi pero yo estoy como en una nube.

Les pasa? Es solo a mi?`,
    respuestas: [
      {
        autorId: 'florencia',
        contenido: 'No es solo a vos. Estamos en un transito planetario intenso. Recomiendo mucho descanso, agua, y contacto con la tierra. Caminar descalza si podes.'
      },
      {
        autorId: 'soledad',
        contenido: 'Siento lo mismo. Cuando la energia colectiva esta pesada, nosotras lo absorbemos. Es momento de protegerse y descansar mas.'
      },
      {
        autorId: 'patricia',
        contenido: 'Agua, descanso, nada de exigirte. Yo cuando me pasa uso turmalina negra todo el dia. Ayuda.'
      },
      {
        autorId: 'elena',
        contenido: 'Romi, estas semanas son para ir lento. No te fuerces. Emilio sabe que estas ahi aunque vos te sientas lejos.'
      },
      {
        autorId: 'maria-del-carmen',
        contenido: 'Romi! Si, esta semana esta rara. Yo tambien me siento cansada. Pero ya va a pasar nena. Un abrazo!'
      },
      {
        autorId: 'gaston',
        contenido: 'Me pasa igual. Quizas sea momento de escuchar al cuerpo.'
      }
    ]
  }
];

// ═══════════════════════════════════════════════════════════════════════════════
// COMENTARIOS PARA CONTENIDO DE ENERO
// ═══════════════════════════════════════════════════════════════════════════════

const COMENTARIOS_CONTENIDO = {
  // Comentarios genericos para diferentes tipos de contenido
  canalizacion: [
    { autorId: 'romina', contenido: 'Esto me hizo llorar. Justo lo que necesitaba leer hoy.' },
    { autorId: 'maria-del-carmen', contenido: 'Ay que hermoso mensaje! Gracias por compartir esta canalizacion.' },
    { autorId: 'soledad', contenido: 'Siento que este mensaje tiene muchas capas. Voy a releerlo.' },
    { autorId: 'luciana', contenido: 'Me encanto! Es normal sentir un cosquilleo al leer esto?' },
    { autorId: 'gaston', contenido: 'Interesante perspectiva. Me quedo pensando.' }
  ],
  ritual: [
    { autorId: 'patricia', contenido: 'Gracias por el paso a paso. Lo voy a probar este finde.' },
    { autorId: 'maria-del-carmen', contenido: 'Ay que lindo ritual! Ya se lo cuento a mi guardiana.' },
    { autorId: 'agustina', contenido: 'Me inspiro para armar algo visual tambien. Gracias!' },
    { autorId: 'elena', contenido: 'Los rituales simples son los mas poderosos. Muy bien explicado.' },
    { autorId: 'florencia', contenido: 'Excelente ritual. Agregaría un cierre con agradecimiento.' }
  ],
  meditacion: [
    { autorId: 'soledad', contenido: 'Me transporto a otro lugar. Muy poderosa esta meditacion.' },
    { autorId: 'romina', contenido: 'La hice y termine llorando. Pero bien, de liberacion.' },
    { autorId: 'gaston', contenido: 'La guia es clara y el ritmo perfecto.' },
    { autorId: 'luciana', contenido: 'Primera vez que medito tanto tiempo! Me encanto.' },
    { autorId: 'mercedes', contenido: 'Queridas, esta meditacion es un regalo. Gracias.' }
  ],
  reflexion: [
    { autorId: 'elena', contenido: 'Mucha sabiduria en estas palabras. Las voy a guardar.' },
    { autorId: 'gaston', contenido: 'Me pregunto cuantas veces necesitamos escuchar algo antes de entenderlo.' },
    { autorId: 'soledad', contenido: 'Todo esta conectado de formas que recien empezamos a ver.' },
    { autorId: 'maria-del-carmen', contenido: 'Hermoso. Lo comparto con mis amigas!' },
    { autorId: 'patricia', contenido: 'Concreto y util. Gracias.' }
  ]
};

// ═══════════════════════════════════════════════════════════════════════════════
// FUNCIONES DE UTILIDAD
// ═══════════════════════════════════════════════════════════════════════════════

function obtenerPerfil(id) {
  return MIEMBROS_FUNDADORES.find(m => m.id === id);
}

function generarFechaAleatoria(diasAtras) {
  const ahora = new Date();
  const dias = Math.floor(Math.random() * diasAtras);
  const horas = Math.floor(Math.random() * 24);
  const fecha = new Date(ahora);
  fecha.setDate(fecha.getDate() - dias);
  fecha.setHours(horas);
  return fecha.toISOString();
}

function generarLikesAleatorios(min, max) {
  const cantidad = Math.floor(Math.random() * (max - min + 1)) + min;
  const likes = [];
  for (let i = 0; i < cantidad; i++) {
    const perfil = MIEMBROS_FUNDADORES[Math.floor(Math.random() * MIEMBROS_FUNDADORES.length)];
    if (!likes.includes(perfil.email)) {
      likes.push(perfil.email);
    }
  }
  return likes;
}

// ═══════════════════════════════════════════════════════════════════════════════
// FUNCION PRINCIPAL: SEED DE POSTS DEL FORO
// ═══════════════════════════════════════════════════════════════════════════════

async function seedPostsForo() {
  console.log('\n=== SEMBRANDO POSTS DEL FORO ===\n');

  const CATEGORIAS_FORO = {
    altares: { nombre: 'Altares y Espacios Sagrados', icono: '?', descripcion: 'Comparti fotos de tus altares' },
    experiencias: { nombre: 'Experiencias con Guardianes', icono: '?', descripcion: 'Senales, suenos, conexiones' },
    rituales: { nombre: 'Rituales y Practicas', icono: '?', descripcion: 'Comparti tus rituales' },
    preguntas: { nombre: 'Preguntas al Circulo', icono: '?', descripcion: 'Consulta a la comunidad' },
    presentaciones: { nombre: 'Presentaciones', icono: '?', descripcion: 'Presentate al Circulo' },
    general: { nombre: 'Charla General', icono: '?', descripcion: 'Todo lo demas' }
  };

  let postsCreados = 0;
  let comentariosCreados = 0;

  for (const postData of POSTS_FORO) {
    const autor = obtenerPerfil(postData.autorId);
    if (!autor) {
      console.log(`  Autor no encontrado: ${postData.autorId}`);
      continue;
    }

    const postId = `fundador-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const fechaPost = generarFechaAleatoria(25);
    const likes = generarLikesAleatorios(30, 120);

    const post = {
      id: postId,
      usuario_email: autor.email,
      usuario_nombre: autor.nombre,
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
      editado_en: null,
      es_contenido_fundador: true
    };

    await kv.set(`foro:post:${postId}`, post);
    console.log(`  Post: "${postData.titulo}" por ${autor.nombreCorto}`);
    postsCreados++;

    // Crear respuestas
    const fechaPostDate = new Date(fechaPost);

    for (let i = 0; i < postData.respuestas.length; i++) {
      const respuestaData = postData.respuestas[i];
      const autorRespuesta = obtenerPerfil(respuestaData.autorId);
      if (!autorRespuesta) continue;

      const comentarioId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      const horasDesfase = Math.floor(Math.random() * 48) + (i * 2);
      const fechaComentario = new Date(fechaPostDate);
      fechaComentario.setHours(fechaComentario.getHours() + horasDesfase);

      const ahora = new Date();
      if (fechaComentario > ahora) {
        fechaComentario.setTime(ahora.getTime() - Math.random() * 86400000);
      }

      const likesComentario = generarLikesAleatorios(5, 40);

      const comentario = {
        id: comentarioId,
        post_id: postId,
        usuario_email: autorRespuesta.email,
        usuario_nombre: autorRespuesta.nombre,
        contenido: respuestaData.contenido,
        likes: likesComentario,
        total_likes: likesComentario.length,
        creado_en: fechaComentario.toISOString(),
        es_contenido_fundador: true
      };

      await kv.set(`foro:comentario:${postId}:${comentarioId}`, comentario);
      comentariosCreados++;

      await new Promise(r => setTimeout(r, 10));
    }

    await new Promise(r => setTimeout(r, 50));
  }

  console.log(`\n  Total: ${postsCreados} posts, ${comentariosCreados} comentarios\n`);
  return { posts: postsCreados, comentarios: comentariosCreados };
}

// ═══════════════════════════════════════════════════════════════════════════════
// FUNCION: SEED DE COMENTARIOS EN CONTENIDO EXISTENTE
// ═══════════════════════════════════════════════════════════════════════════════

async function seedComentariosContenido() {
  console.log('\n=== SEMBRANDO COMENTARIOS EN CONTENIDO DE ENERO ===\n');

  // Buscar contenido de enero
  const contenidoKeys = await kv.keys('circulo:contenido:*');
  console.log(`  Encontrados ${contenidoKeys.length} contenidos`);

  let comentariosCreados = 0;

  for (const key of contenidoKeys) {
    const contenido = await kv.get(key);
    if (!contenido) continue;

    // Determinar tipo de contenido
    let tipoContenido = 'reflexion';
    if (contenido.tipo?.includes('ritual')) tipoContenido = 'ritual';
    else if (contenido.tipo?.includes('meditacion')) tipoContenido = 'meditacion';
    else if (contenido.tipo?.includes('canal')) tipoContenido = 'canalizacion';

    const comentariosPosibles = COMENTARIOS_CONTENIDO[tipoContenido] || COMENTARIOS_CONTENIDO.reflexion;

    // Agregar 2-4 comentarios aleatorios
    const numComentarios = Math.floor(Math.random() * 3) + 2;
    const comentariosUsados = [];

    for (let i = 0; i < numComentarios; i++) {
      let comentarioData;
      let intentos = 0;

      do {
        comentarioData = comentariosPosibles[Math.floor(Math.random() * comentariosPosibles.length)];
        intentos++;
      } while (comentariosUsados.includes(comentarioData.autorId) && intentos < 10);

      if (comentariosUsados.includes(comentarioData.autorId)) continue;
      comentariosUsados.push(comentarioData.autorId);

      const autor = obtenerPerfil(comentarioData.autorId);
      if (!autor) continue;

      const comentarioId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      const comentario = {
        id: comentarioId,
        contenido_id: key,
        usuario_email: autor.email,
        usuario_nombre: autor.nombre,
        contenido: comentarioData.contenido,
        likes: generarLikesAleatorios(3, 25),
        creado_en: generarFechaAleatoria(5),
        es_contenido_fundador: true
      };

      await kv.set(`circulo:comentario:${key}:${comentarioId}`, comentario);
      comentariosCreados++;

      await new Promise(r => setTimeout(r, 10));
    }
  }

  console.log(`  Total: ${comentariosCreados} comentarios agregados\n`);
  return { comentarios: comentariosCreados };
}

// ═══════════════════════════════════════════════════════════════════════════════
// EJECUCION PRINCIPAL
// ═══════════════════════════════════════════════════════════════════════════════

async function main() {
  console.log('\n' + '='.repeat(60));
  console.log('SEED DE CONTENIDO INICIAL - CIRCULO DE DUENDES');
  console.log('='.repeat(60));

  try {
    // 1. Seed de posts del foro
    const resultadoForo = await seedPostsForo();

    // 2. Seed de comentarios en contenido existente
    const resultadoComentarios = await seedComentariosContenido();

    console.log('\n' + '='.repeat(60));
    console.log('RESUMEN FINAL');
    console.log('='.repeat(60));
    console.log(`Posts del foro: ${resultadoForo.posts}`);
    console.log(`Comentarios en posts: ${resultadoForo.comentarios}`);
    console.log(`Comentarios en contenido: ${resultadoComentarios.comentarios}`);
    console.log('\nSeed completado exitosamente!');
    console.log('='.repeat(60) + '\n');

  } catch (error) {
    console.error('\nError durante el seed:', error);
    process.exit(1);
  }
}

main();
