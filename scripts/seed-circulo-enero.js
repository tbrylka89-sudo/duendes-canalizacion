#!/usr/bin/env node
/**
 * Script para generar contenido histórico del Círculo
 * Enero 1-17, 2026
 *
 * Uso: node scripts/seed-circulo-enero.js [local|prod]
 */

const BASE_URLS = {
  local: 'http://localhost:3000',
  prod: 'https://duendes-vercel.vercel.app'
};

const env = process.argv[2] || 'local';
const BASE_URL = BASE_URLS[env] || BASE_URLS.local;

console.log(`\n🌲 Generando contenido del Círculo en: ${BASE_URL}\n`);

// ═══════════════════════════════════════════════════════════════
// DUENDES DE LA SEMANA (3 semanas)
// ═══════════════════════════════════════════════════════════════

const DUENDES_SEMANA = [
  {
    id: 'aurora-luz',
    nombre: 'Aurora',
    nombreCompleto: 'Aurora de la Luz Primera',
    descripcion: 'Guardiana de los nuevos comienzos y la esperanza renovada. Aurora despierta con el primer rayo del año.',
    proposito: 'Ayudar a establecer intenciones claras y sembrar las semillas de los sueños para el nuevo ciclo.',
    cristales: ['Cuarzo Rosa', 'Citrino', 'Selenita'],
    elemento: 'Fuego',
    imagen: 'https://duendesdeluruguay.com/wp-content/uploads/2024/01/duende-aurora.jpg',
    personalidad: 'Cálida, esperanzadora, maternal. Habla con frases cortas pero profundas.',
    semana: 1,
    fechaInicio: '2026-01-01',
    fechaFin: '2026-01-07'
  },
  {
    id: 'silvano-raices',
    nombre: 'Silvano',
    nombreCompleto: 'Silvano de las Raíces Profundas',
    descripcion: 'Guardián del arraigo y la conexión con la tierra. Silvano enseña a echar raíces firmes.',
    proposito: 'Guiar en la construcción de bases sólidas para los proyectos del año.',
    cristales: ['Obsidiana', 'Turmalina Negra', 'Jaspe Rojo'],
    elemento: 'Tierra',
    imagen: 'https://duendesdeluruguay.com/wp-content/uploads/2024/01/duende-silvano.jpg',
    personalidad: 'Sereno, sabio, paciente. Usa metáforas de la naturaleza.',
    semana: 2,
    fechaInicio: '2026-01-08',
    fechaFin: '2026-01-14'
  },
  {
    id: 'celeste-suenos',
    nombre: 'Celeste',
    nombreCompleto: 'Celeste de los Sueños Lúcidos',
    descripcion: 'Guardiana de la intuición y los mensajes del subconsciente. Celeste habita entre mundos.',
    proposito: 'Desarrollar la conexión con la intuición y entender los mensajes de los sueños.',
    cristales: ['Amatista', 'Labradorita', 'Piedra Luna'],
    elemento: 'Agua',
    imagen: 'https://duendesdeluruguay.com/wp-content/uploads/2024/01/duende-celeste.jpg',
    personalidad: 'Etérea, misteriosa, profunda. Habla en susurros y acertijos.',
    semana: 3,
    fechaInicio: '2026-01-15',
    fechaFin: '2026-01-21'
  }
];

// ═══════════════════════════════════════════════════════════════
// CONTENIDO DIARIO (1-17 enero)
// ═══════════════════════════════════════════════════════════════

const CONTENIDO_DIARIO = [
  // SEMANA 1 - Aurora
  {
    dia: 1, mes: 1, año: 2026,
    tipo: 'ritual',
    categoria: 'rituales',
    titulo: 'Ritual de Año Nuevo: Siembra tus Intenciones',
    extracto: 'Un ritual poderoso para plantar las semillas de tus deseos en el primer día del año.',
    secciones: {
      intro: 'El primer día del año es un portal. La energía está fresca, limpia, lista para recibir tus intenciones. Aurora, la guardiana de los nuevos comienzos, te acompaña en este ritual de siembra.',
      desarrollo: 'Necesitarás: una vela blanca, un papel, una semilla real (puede ser de cualquier planta), un poco de tierra en una maceta pequeña.\n\nPrimero, enciende la vela y respira profundo tres veces. En el papel, escribí una sola palabra que represente lo que querés manifestar este año. No expliques, no justifiques. Una palabra.\n\nAhora, sostené la semilla en tu mano izquierda (la que recibe) y visualizá esa palabra floreciendo. ¿Cómo se ve tu vida cuando esa palabra está presente? Sentí la emoción.\n\nPlantá la semilla en la tierra mientras decís: "Como esta semilla, mi intención crece. Como esta planta, mi deseo florece."\n\nQuemá el papel con la vela y dejá que las cenizas caigan sobre la tierra.',
      practica: 'Regá tu plantita cada día durante este mes. Cada vez que lo hagas, recordá tu palabra. No es magia instantánea: es compromiso diario. Tu intención necesita agua como la semilla.\n\nSi la planta no germina, no significa que fallaste. Significa que la semilla necesitaba descomponerse para nutrir algo más grande. Seguí regando.',
      cierre: 'Aurora te recuerda: "El universo no responde a lo que pedís. Responde a lo que regás todos los días." Que este año florezca.'
    }
  },
  {
    dia: 2, mes: 1, año: 2026,
    tipo: 'meditacion',
    categoria: 'sanacion',
    titulo: 'Meditación: Limpieza Energética de Año Nuevo',
    extracto: 'Liberá la energía estancada del año pasado con esta meditación guiada de 15 minutos.',
    secciones: {
      intro: 'Enero 2 es el día perfecto para soltar. Ayer sembraste intenciones; hoy limpiamos el terreno. Esta meditación te ayuda a liberar lo que ya no te sirve.',
      desarrollo: 'Sentate cómoda, cerrá los ojos. Imaginá que estás en un bosque. El suelo está cubierto de hojas secas del año pasado. Cada hoja representa algo que ya cumplió su propósito: una preocupación, un miedo, un resentimiento.\n\nAhora imaginá que empieza a llover suavemente. No es agua fría; es luz dorada. Cada gota disuelve una hoja. El bosque se va limpiando.\n\nLa lluvia dorada también cae sobre vos. Sentí cómo entra por tu coronilla y baja por todo tu cuerpo, disolviendo tensiones, dudas, cargas. Especialmente en los hombros. Especialmente en el pecho.\n\nEl agua dorada sale por tus pies y se absorbe en la tierra. La tierra transforma todo en nutrientes. Nada se pierde; todo se recicla.',
      practica: 'Hacé esta meditación durante los primeros 7 días del año. Notá cómo cada día te sentís un poco más liviana. Si surge alguna emoción intensa, dejala fluir. Las lágrimas también son lluvia dorada.',
      cierre: 'Aurora susurra: "No cargues mochilas de años pasados a caminos nuevos. Viajá liviana."'
    }
  },
  {
    dia: 3, mes: 1, año: 2026,
    tipo: 'articulo',
    categoria: 'esoterico',
    titulo: 'Los Números de tu Año Personal 2026',
    extracto: 'Calculá tu número de año personal y descubrí qué energía te acompañará durante todo 2026.',
    secciones: {
      intro: 'Cada año tiene una vibración numérica para vos. Saber tu número de año personal te ayuda a fluir con la energía en lugar de luchar contra ella.',
      desarrollo: '**Cómo calcular tu número de año personal:**\n\nSumá el día y mes de tu cumpleaños + 2026.\n\nEjemplo: Si naciste el 15 de marzo:\n1 + 5 + 0 + 3 + 2 + 0 + 2 + 6 = 19 → 1 + 9 = 10 → 1 + 0 = **1**\n\n**Significados:**\n\n**Año 1:** Nuevos comienzos. Iniciativas. Liderazgo. Es TU año.\n**Año 2:** Relaciones. Paciencia. Diplomacia. Colaboración.\n**Año 3:** Creatividad. Expresión. Alegría. Comunicación.\n**Año 4:** Estructura. Trabajo. Cimientos. Disciplina.\n**Año 5:** Cambios. Libertad. Aventura. Flexibilidad.\n**Año 6:** Hogar. Familia. Responsabilidad. Amor.\n**Año 7:** Introspección. Espiritualidad. Estudio. Soledad productiva.\n**Año 8:** Abundancia. Poder. Logros materiales. Karma.\n**Año 9:** Cierre. Soltar. Humanidad. Fin de ciclo.',
      practica: 'Una vez que sepas tu número, escribilo en algún lugar que veas seguido. Cuando enfrentes decisiones, preguntate: "¿Esto está alineado con la energía de mi año?"',
      cierre: 'Aurora comparte: "Los números no predicen. Revelan. Tu libre albedrío siempre tiene la última palabra."'
    }
  },
  {
    dia: 4, mes: 1, año: 2026,
    tipo: 'guia',
    categoria: 'diy',
    titulo: 'DIY: Creá tu Altar de Año Nuevo',
    extracto: 'Paso a paso para armar un altar que potencie tus intenciones durante todo enero.',
    secciones: {
      intro: 'Un altar no es decoración: es un portal de enfoque. Cada vez que lo mirás, tu subconsciente recuerda tus intenciones. Hoy te enseño a crear el tuyo.',
      desarrollo: '**Materiales básicos:**\n- Una superficie (mesa, estante, caja)\n- Un mantel o tela que te guste\n- Una vela (blanca o dorada para enero)\n- Algo que represente tu elemento (tierra, agua, fuego, aire)\n- Un cristal (cualquiera que tengas)\n- Algo personal (foto, objeto significativo)\n\n**Armado:**\n\n1. Limpiá el espacio con humo de salvia, palo santo, o simplemente con tu intención.\n\n2. Colocá la tela. Elegí colores que te inspiren: blanco para pureza, dorado para abundancia, verde para crecimiento.\n\n3. En el centro, poné tu vela. Representa la luz que guía.\n\n4. A la izquierda, tu elemento. A la derecha, tu cristal.\n\n5. Adelante, colocá tu objeto personal y el papel con tu palabra de intención (del ritual del día 1).\n\n6. Opcional: agregá flores frescas, plantas, o imágenes que representen tus metas.',
      practica: 'Encendé la vela del altar al menos una vez al día, aunque sea 5 minutos. Mientras esté encendida, visualizá tu intención. Renovalo cada luna nueva.',
      cierre: 'Aurora dice: "Tu altar es un espejo de tu mundo interior. Mantenelo limpio, mantenelo vivo, mantenelo sagrado."'
    }
  },
  {
    dia: 5, mes: 1, año: 2026,
    tipo: 'historia',
    categoria: 'duendes',
    titulo: 'La Leyenda de Aurora y el Primer Amanecer',
    extracto: 'Cómo Aurora se convirtió en la guardiana de los nuevos comienzos.',
    secciones: {
      intro: 'Antes de que Aurora fuera Aurora, era una pequeña duende sin nombre que vivía en las sombras. Esta es su historia.',
      desarrollo: 'Cuenta la leyenda que hace miles de años, el mundo vivió una noche que no terminaba. El sol había olvidado cómo salir, y la oscuridad cubría todo.\n\nLos duendes del bosque estaban asustados. Ninguno se animaba a buscar al sol. Excepto una pequeña duende que todavía no tenía nombre.\n\n"Voy a encontrar al sol", dijo. Los demás se rieron. "Sos muy chica. Muy débil. No tenés ni nombre."\n\nPero ella caminó igual. Caminó tanto que sus pies sangraron. Caminó hasta el borde del mundo, donde el cielo se encontraba con el mar.\n\nAllí encontró al sol, escondido bajo las olas. "¿Por qué no salís?", preguntó.\n\nEl sol respondió: "Porque nadie me espera. Todos se acostumbraron a la oscuridad."\n\nLa pequeña duende se sentó junto al mar y esperó. Esperó con los ojos abiertos, mirando el horizonte. "Yo te espero", dijo. "Yo siempre te voy a esperar."\n\nY el sol, conmovido por su fe, salió.\n\nDesde ese día, la pequeña duende fue llamada Aurora, porque ella trajo de vuelta la luz. Y cada primer día del año, Aurora nos recuerda: incluso la noche más larga termina si alguien espera el amanecer.',
      practica: 'Hoy, levantate temprano y mirá el amanecer. Si no podés verlo físicamente, cerrá los ojos y visualizalo. Sentí la gratitud de un nuevo día.',
      cierre: 'Aurora te recuerda: "No subestimes tu luz. A veces, un solo corazón que espera puede traer de vuelta el sol."'
    }
  },
  {
    dia: 6, mes: 1, año: 2026,
    tipo: 'reflexion',
    categoria: 'cosmos',
    titulo: 'La Luna en su Fase Creciente: Construir con Paciencia',
    extracto: 'Cómo aprovechar la energía de la luna creciente para dar forma a tus proyectos.',
    secciones: {
      intro: 'Estamos en luna creciente. Esta fase es para construir, agregar, expandir. Todo lo que hagas ahora tiene impulso hacia adelante.',
      desarrollo: 'La luna creciente es como una embarazada: algo está gestándose, creciendo, tomando forma. No es momento de soltar; es momento de nutrir.\n\n**Qué hacer en luna creciente:**\n- Empezar proyectos\n- Tener conversaciones importantes\n- Pedir lo que necesitás\n- Estudiar cosas nuevas\n- Socializar y conectar\n- Plantar (literal y metafóricamente)\n\n**Qué evitar:**\n- Terminar relaciones\n- Dietas de eliminación drásticas\n- Decisiones de "cortar" algo\n- Aislamiento excesivo\n\nLa luna creciente nos enseña que el crecimiento lleva tiempo. No podés apurar a la luna. Tampoco podés apurar tus sueños.',
      practica: 'Cada noche de luna creciente, antes de dormir, preguntate: "¿Qué nutriste hoy?" Si la respuesta es "nada", mañana elegí una cosa pequeña para agregar a tu vida.',
      cierre: 'Aurora reflexiona: "La luna no intenta ser llena antes de tiempo. Aprende de ella."'
    }
  },
  {
    dia: 7, mes: 1, año: 2026,
    tipo: 'articulo',
    categoria: 'sanacion',
    titulo: 'Las 7 Áreas de tu Vida: Balance de Inicio de Año',
    extracto: 'Un ejercicio de autoevaluación para entender dónde necesitás enfocar tu energía.',
    secciones: {
      intro: 'Último día con Aurora. Antes de recibir a Silvano, hagamos un balance honesto de las 7 áreas de tu vida.',
      desarrollo: '**Las 7 áreas:**\n\n1. **Salud física**: ¿Cómo está tu cuerpo? ¿Tu energía? ¿Tu sueño?\n\n2. **Bienestar emocional**: ¿Cómo manejás tus emociones? ¿Tenés herramientas?\n\n3. **Relaciones**: ¿Tus vínculos te nutren? ¿Hay relaciones tóxicas?\n\n4. **Finanzas**: ¿Tenés claridad sobre tu dinero? ¿Llegás a fin de mes?\n\n5. **Carrera/Propósito**: ¿Tu trabajo te llena? ¿Sentís que aportás algo?\n\n6. **Crecimiento personal**: ¿Estás aprendiendo? ¿Evolucionando?\n\n7. **Espiritualidad**: ¿Tenés conexión con algo más grande? ¿Prácticas?\n\n**Ejercicio:**\nDale a cada área un puntaje del 1 al 10. No pienses mucho; la primera respuesta suele ser la verdadera.\n\nAhora mirá: ¿Hay algún área por debajo de 5? Esa es tu prioridad este mes. No intentes arreglar todo. Elegí UNA cosa.',
      practica: 'Escribí tu puntaje y guardalo. Volvé a hacerlo en un mes. El progreso se mide, no se adivina.',
      cierre: 'Aurora se despide: "No se puede llenar un vaso roto. Primero identificá las grietas. Después, con amor, reparalas. Nos vemos en luna llena."'
    }
  },

  // SEMANA 2 - Silvano
  {
    dia: 8, mes: 1, año: 2026,
    tipo: 'ritual',
    categoria: 'rituales',
    titulo: 'Ritual de Arraigo: Conectar con la Tierra',
    extracto: 'Silvano te enseña a echar raíces firmes para que ningún viento te derrumbe.',
    secciones: {
      intro: 'Bienvenida a la semana de Silvano, guardián de las raíces profundas. Esta semana es para construir cimientos sólidos. Hoy empezamos con un ritual de arraigo.',
      desarrollo: 'Necesitarás: un espacio donde puedas estar descalza (si es posible, en la tierra; si no, en el piso de tu casa).\n\nParate con los pies separados al ancho de las caderas. Cerrá los ojos. Sentí el peso de tu cuerpo presionando hacia abajo.\n\nImaginá que de la planta de tus pies salen raíces. Primero pequeñas, como hilos. Pero van creciendo, haciéndose gruesas, penetrando la tierra.\n\nTus raíces atraviesan el piso, la roca, el agua subterránea. Llegan hasta el centro de la Tierra, donde hay un cristal enorme que late como un corazón.\n\nTus raíces se enredan en ese cristal. Ahora estás conectada al corazón del planeta.\n\nSentí cómo la energía de la Tierra sube por tus raíces, entra por tus pies, llena tu cuerpo de estabilidad, de calma, de fuerza.',
      practica: 'Hacé este ejercicio cada mañana de esta semana. Solo lleva 3 minutos. Notarás que tus decisiones serán más firmes, tu ansiedad menor, tu presencia más sólida.',
      cierre: 'Silvano dice: "Los árboles más altos tienen las raíces más profundas. No podés crecer hacia arriba si no crecés primero hacia abajo."'
    }
  },
  {
    dia: 9, mes: 1, año: 2026,
    tipo: 'meditacion',
    categoria: 'sanacion',
    titulo: 'Meditación: Encontrar tu Centro',
    extracto: 'Una meditación de 10 minutos para cuando sientas que el mundo te tambalea.',
    secciones: {
      intro: 'Silvano entiende lo fácil que es perderse. Por eso hoy te enseña a encontrar tu centro, ese lugar interno donde nada te puede mover.',
      desarrollo: 'Sentate cómoda. Podés tener los ojos abiertos o cerrados.\n\nLlevá tu atención a tu ombligo. Justo ahí, unos centímetros hacia adentro, está tu centro. Los japoneses lo llaman "hara". Es tu punto de equilibrio.\n\nImaginá que en tu hara hay una esfera dorada, del tamaño de una naranja. Es pesada, densa, brillante. Cada vez que inhalás, la esfera se vuelve un poco más brillante. Cada vez que exhalás, se vuelve un poco más pesada.\n\nAhora imaginá que desde esa esfera salen líneas doradas hacia arriba (hasta tu cabeza) y hacia abajo (hasta tus pies). Estás alineada. Centrada. Presente.\n\nSi algún pensamiento intenta llevarte, volvé a la esfera. No luchas contra los pensamientos. Simplemente elegís volver a tu centro.',
      practica: 'Cuando sientas ansiedad, miedo o confusión, poné una mano en tu ombligo y respirá. Recordá la esfera. No necesitás cerrar los ojos ni hacer una meditación larga. Solo: mano en el centro, respirar, recordar.',
      cierre: 'Silvano comparte: "Tu centro no se mueve. Vos te movés lejos de él. Siempre podés volver."'
    }
  },
  {
    dia: 10, mes: 1, año: 2026,
    tipo: 'articulo',
    categoria: 'esoterico',
    titulo: 'Los Cristales del Arraigo: Cuáles Usar y Cómo',
    extracto: 'Silvano te presenta los cristales que te ayudan a mantenerte firme.',
    secciones: {
      intro: 'Cada guardián tiene sus cristales aliados. Los de Silvano son los que conectan con la tierra, protegen y estabilizan.',
      desarrollo: '**Obsidiana Negra**\nEl escudo. Absorbe energías negativas y te protege de vampiros energéticos. Ponela junto a la puerta de tu casa o llevala en el bolsillo cuando vayas a lugares densos.\n\n**Turmalina Negra**\nLa transmutadora. No solo absorbe; transforma la energía negativa en neutral. Ideal para personas que trabajan con gente (terapeutas, maestras, vendedoras).\n\n**Jaspe Rojo**\nLa sangre de la tierra. Conecta con tu fuerza vital, tu pasión, tu voluntad. Cuando sientas que no tenés ganas de nada, jaspe rojo en el bolsillo.\n\n**Ojo de Tigre**\nEl guerrero. Protección + confianza + acción. Para cuando necesitás hacer algo que te da miedo.\n\n**Cuarzo Ahumado**\nEl ancla. Cuando sientas que flotás, que no podés concentrarte, que tu mente está en mil lugares. Sostené un cuarzo ahumado y sentí cómo te "baja".',
      practica: 'Elegí UNO de estos cristales (el que tengas, el que puedas conseguir, o el que más te llame). Llevalo contigo toda la semana. Antes de usarlo, limpialo con humo o dejándolo toda la noche en sal gruesa.',
      cierre: 'Silvano enseña: "Los cristales son herramientas, no magia. Vos sos la magia. Ellos solo amplifican lo que ya tenés."'
    }
  },
  {
    dia: 11, mes: 1, año: 2026,
    tipo: 'guia',
    categoria: 'diy',
    titulo: 'DIY: Bolsita de Protección para el Hogar',
    extracto: 'Creá tu propio amuleto protector con materiales simples.',
    secciones: {
      intro: 'Silvano protege los hogares. Hoy te enseña a crear una bolsita de protección que podés colgar en tu puerta o esconder en algún rincón de tu casa.',
      desarrollo: '**Materiales:**\n- Una bolsita de tela (puede ser de las de té, o hacé una con tela que tengas)\n- Sal gruesa (1 cucharada)\n- Romero seco (1 cucharadita)\n- Un cristal pequeño de protección (o una piedrita negra de la calle)\n- Un pelo tuyo o de las personas que viven en la casa\n- Opcional: un papel con el nombre de tu guardián\n\n**Preparación:**\n\n1. Limpiá tu espacio. Abrí una ventana. Prendé una vela si querés.\n\n2. Ponés la sal en la bolsita mientras decís: "Sal que limpia, sal que protege."\n\n3. Agregás el romero: "Romero de sanación, romero de tradición."\n\n4. Ponés el cristal o la piedra: "Piedra que ancla, piedra que guarda."\n\n5. Agregás el pelo: "Por mi sangre, por mi linaje, este hogar es sagrado."\n\n6. Cerrás la bolsita. Sostenela en tus manos, respirá hondo tres veces, y visualizá tu casa rodeada de luz dorada.',
      practica: 'Colgá la bolsita cerca de la puerta principal (puede estar escondida). Cada luna nueva, sacala, agradecele su protección, y reemplazá la sal.',
      cierre: 'Silvano dice: "Tu hogar es tu santuario. Protegelo como protegerías a tu familia."'
    }
  },
  {
    dia: 12, mes: 1, año: 2026,
    tipo: 'historia',
    categoria: 'duendes',
    titulo: 'El Guardián del Roble Milenario',
    extracto: 'La historia de Silvano y el árbol que le enseñó todo.',
    secciones: {
      intro: 'Silvano no siempre fue sabio. Antes era un duende inquieto, impaciente, que saltaba de rama en rama sin terminar nada. Hasta que conoció al Roble.',
      desarrollo: 'El Roble Milenario había visto nacer y morir imperios. Sus raíces tocaban el agua subterránea de tres ríos. Su copa era tan ancha que podían descansar cien aves a la vez.\n\nSilvano llegó un día huyendo de algo que ya no recuerda. Estaba agotado, perdido, sin propósito.\n\n"¿Puedo quedarme?", preguntó al Roble.\n\n"Podés quedarte", respondió el árbol, "pero solo si aprendés a estar quieto."\n\nSilvano pensó que sería fácil. Se sentó al pie del Roble... y a los dos minutos ya quería moverse. El Roble rio (los árboles ríen, pero muy despacio).\n\nPasaron años. Silvano practicó quedarse quieto. Primero una hora. Después un día. Después una semana. Mientras más quieto estaba, más podía sentir: las raíces del Roble comunicándose con otros árboles, el agua subterránea fluyendo, los minerales de la tierra.\n\nCuando finalmente pudo quedarse un año entero sin moverse, el Roble le dijo: "Ahora entendés. El poder no está en moverte mucho. Está en elegir dónde poner tus raíces."\n\nY Silvano se convirtió en el Guardián de las Raíces Profundas.',
      practica: 'Hoy, elegí un momento para estar completamente quieta. Sin teléfono, sin libro, sin música. Solo vos y el silencio. Empezá con 5 minutos. Notá qué surge.',
      cierre: 'Silvano recuerda: "En la quietud encontré más de lo que jamás encontré corriendo."'
    }
  },
  {
    dia: 13, mes: 1, año: 2026,
    tipo: 'reflexion',
    categoria: 'cosmos',
    titulo: 'La Luna Llena del Lobo: Instintos y Supervivencia',
    extracto: 'La primera luna llena del año trae la energía del lobo interior.',
    secciones: {
      intro: 'La luna llena de enero se llama "Luna del Lobo" en muchas tradiciones. Es momento de conectar con tus instintos más primarios.',
      desarrollo: 'Los lobos aúllan a la luna, pero no porque estén tristes. Aúllan para comunicarse con su manada, para marcar territorio, para afirmar su existencia.\n\n**Qué trae esta luna:**\n- Instintos agudizados (confiá en tus corazonadas)\n- Necesidad de comunidad (¿quién es tu manada?)\n- Supervivencia (¿qué necesitás para estar bien?)\n- Autenticidad (el lobo no finge ser otra cosa)\n\n**Preguntas para reflexionar:**\n- ¿Estás ignorando alguna señal de tu cuerpo o intuición?\n- ¿Te rodeás de personas que te fortalecen o te debilitan?\n- ¿Estás sobreviviendo o viviendo?\n- ¿En qué áreas de tu vida fingís ser alguien que no sos?',
      practica: 'Esta noche, si podés, salí a mirar la luna. Si no podés verla, imaginala. Respirá profundo y, en silencio o en voz alta, "aullá": hacé un sonido largo desde tu vientre, liberando lo que necesites liberar.',
      cierre: 'Silvano bajo la luna llena dice: "El lobo que aúlla solo sigue siendo lobo. No dejes que la soledad te haga olvidar tu naturaleza."'
    }
  },
  {
    dia: 14, mes: 1, año: 2026,
    tipo: 'articulo',
    categoria: 'sanacion',
    titulo: 'Despedida de Silvano: El Mapa de tus Cimientos',
    extracto: 'Un ejercicio para identificar qué sostiene tu vida y qué está tambaleante.',
    secciones: {
      intro: 'Último día con Silvano. Antes de pasar a Celeste, vamos a revisar los cimientos de tu vida.',
      desarrollo: '**El ejercicio del edificio:**\n\nImaginá tu vida como un edificio. Como todo edificio, tiene cimientos (lo que lo sostiene), estructura (lo que lo mantiene en pie), y decoración (lo que lo hace lindo).\n\n**Tus cimientos son:**\n- Tu salud básica (sueño, alimentación, movimiento)\n- Tu seguridad material (techo, comida, dinero mínimo)\n- Tu red de contención (al menos una persona en quien confiar)\n\n**Tu estructura es:**\n- Tu trabajo o propósito\n- Tus relaciones cercanas\n- Tus rutinas diarias\n\n**Tu decoración es:**\n- Viajes, hobbies, entretenimiento\n- Lujos pequeños\n- Crecimiento personal "extra"\n\n**La regla de Silvano:**\nSi los cimientos están débiles, no inviertas en decoración. Primero asegurá lo básico.',
      practica: 'Hacé un dibujo simple de tu edificio. ¿Cómo están tus cimientos? ¿Hay grietas? ¿Hay algo que se tambalea? Esa es la prioridad antes de pensar en agregar pisos o pintar las paredes.',
      cierre: 'Silvano se despide: "Construí despacio. Construí firme. Lo que construyas sobre cimientos sólidos durará generaciones."'
    }
  },

  // SEMANA 3 - Celeste
  {
    dia: 15, mes: 1, año: 2026,
    tipo: 'ritual',
    categoria: 'rituales',
    titulo: 'Ritual de los Sueños: Abriendo el Canal',
    extracto: 'Celeste te enseña a recordar y entender tus sueños.',
    secciones: {
      intro: 'Bienvenida a la semana de Celeste, guardiana de los sueños lúcidos. Esta semana trabajaremos con el mundo onírico, donde habita tu subconsciente.',
      desarrollo: 'Necesitarás: un cuaderno que usarás SOLO para sueños, y algo para escribir junto a tu cama.\n\n**Antes de dormir:**\n\n1. Sentate en tu cama. Cerrá los ojos. Decí en voz alta o mentalmente: "Esta noche voy a recordar mis sueños."\n\n2. Visualizá un puente dorado que conecta tu mente despierta con tu mente dormida. Cruzá el puente.\n\n3. Del otro lado, imaginá que hay un buzón. Ese es el buzón donde tu subconsciente deja mensajes. Abrilo (aunque esté vacío) y decí: "Estoy lista para recibir."\n\n4. Volvé a cruzar el puente y acuéstate a dormir.\n\n**Al despertar (INMEDIATAMENTE):**\n\nNo te muevas. No abras los ojos. Recordá lo último que soñaste. Aunque sea un fragmento, un color, una sensación.\n\nAbrí los ojos y escribí lo que sea que recuerdes. No juzgues. No interpretes todavía. Solo escribí.',
      practica: 'Hacé este ritual todas las noches de esta semana. Para el día 7, deberías estar recordando sueños con más claridad.',
      cierre: 'Celeste susurra: "Tus sueños son cartas de amor de tu alma. Aprendé a leerlas."'
    }
  },
  {
    dia: 16, mes: 1, año: 2026,
    tipo: 'meditacion',
    categoria: 'sanacion',
    titulo: 'Meditación: Viaje al Mundo Interior',
    extracto: 'Una meditación de 15 minutos para conectar con tu guía interior.',
    secciones: {
      intro: 'Celeste habita entre mundos. Hoy te lleva de viaje a conocer a tu guía interior, esa parte sabia de vos que siempre sabe qué hacer.',
      desarrollo: 'Acuéstate cómoda. Cerrá los ojos. Respirá profundo tres veces.\n\nImaginá que estás en un bosque de noche. Hay una luna llena que ilumina todo con luz plateada. El aire es fresco pero no frío.\n\nFrente a vos hay un lago perfectamente quieto, como un espejo. En el centro del lago hay una isla pequeña con un árbol luminoso.\n\nEmpezás a caminar sobre el agua (en este mundo, podés). Cada paso genera ondas plateadas.\n\nLlegás a la isla. Bajo el árbol luminoso hay alguien esperándote. Es tu Guía Interior. Puede tener cualquier forma: una persona, un animal, una luz, tu versión del futuro.\n\nSentate frente a tu Guía. No hables todavía. Solo miralo/a. Sentí su presencia.\n\nCuando estés lista, hacé UNA pregunta. No tiene que ser la pregunta perfecta. Cualquier pregunta sirve.\n\nEscuchá la respuesta. Puede venir en palabras, imágenes, sensaciones, o silencio.\n\nAgradecé, cruzá el lago de vuelta, y regresá al bosque.',
      practica: 'Anotá lo que recibiste. Aunque no tenga sentido ahora, guardalo. A veces las respuestas del guía interior tardan días en revelarse.',
      cierre: 'Celeste comparte: "Tu guía interior nunca se fue. Simplemente dejaste de visitarlo."'
    }
  },
  {
    dia: 17, mes: 1, año: 2026,
    tipo: 'articulo',
    categoria: 'esoterico',
    titulo: 'Símbolos Comunes en los Sueños y su Significado',
    extracto: 'Una guía de Celeste para interpretar los mensajes de tus sueños.',
    secciones: {
      intro: 'Los sueños hablan en símbolos. Hoy Celeste te da las claves para empezar a descifrarlos.',
      desarrollo: '**Agua**: Tu estado emocional. Agua clara = emociones procesadas. Agua turbia = emociones revueltas. Mar agitado = desborde.\n\n**Casas**: Tu mente. Las habitaciones son diferentes aspectos de tu psique. Sótano = subconsciente. Ático = espiritualidad. Cocina = cómo te nutrís.\n\n**Vehículos**: Tu dirección en la vida. ¿Quién maneja? ¿Vas rápido o lento? ¿Hay frenos?\n\n**Dientes que se caen**: Miedo a perder poder, atractivo o la capacidad de "morder" la vida.\n\n**Volar**: Libertad, elevarse por encima de problemas. ¿Volás fácil o con miedo?\n\n**Persecuciones**: Algo que estás evitando enfrentar. El perseguidor suele representar una parte de vos.\n\n**Muerte**: Rara vez literal. Significa fin de una etapa, transformación.\n\n**Animales**: Aspectos instintivos. El animal específico importa.\n\n**Personas conocidas**: Pueden representar esas personas O aspectos de vos que asociás con ellas.',
      practica: 'Revisá tu diario de sueños de los últimos días. ¿Hay algún símbolo recurrente? Buscalo en esta lista y reflexioná: ¿tiene sentido para tu vida actual?',
      cierre: 'Celeste advierte: "Los diccionarios de sueños son guías, no verdades absolutas. Tu subconsciente tiene su propio lenguaje. Aprendé a escucharlo."'
    }
  }
];

// ═══════════════════════════════════════════════════════════════
// FUNCIONES
// ═══════════════════════════════════════════════════════════════

async function crearDuendes() {
  console.log('\n🧚 Creando Duendes de la Semana...\n');

  for (const duende of DUENDES_SEMANA) {
    console.log(`  → ${duende.nombre} (Semana ${duende.semana})`);

    try {
      const res = await fetch(`${BASE_URL}/api/admin/circulo/duendes-reales`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accion: 'crear',
          duende: duende
        })
      });

      const data = await res.json();

      if (data.success) {
        console.log(`    ✅ Creado`);
      } else {
        console.log(`    ⚠️ ${data.error || 'Error'}`);
      }
    } catch (e) {
      console.log(`    ❌ ${e.message}`);
    }

    await sleep(300);
  }
}

async function crearContenido() {
  console.log('\n📝 Generando contenido diario (1-17 enero)...\n');

  for (const contenido of CONTENIDO_DIARIO) {
    const fecha = `${contenido.año}-${String(contenido.mes).padStart(2, '0')}-${String(contenido.dia).padStart(2, '0')}`;
    console.log(`  → Día ${contenido.dia}: ${contenido.titulo.substring(0, 40)}...`);

    try {
      const res = await fetch(`${BASE_URL}/api/admin/circulo/contenidos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dia: contenido.dia,
          mes: contenido.mes,
          año: contenido.año,
          contenido: {
            id: fecha,
            fecha: `${fecha}T00:00:00Z`,
            dia: contenido.dia,
            mes: contenido.mes,
            año: contenido.año,
            tipo: contenido.tipo,
            categoria: contenido.categoria,
            titulo: contenido.titulo,
            extracto: contenido.extracto,
            secciones: contenido.secciones,
            estado: 'publicado',
            publicadoEn: new Date().toISOString()
          }
        })
      });

      const data = await res.json();

      if (data.success) {
        console.log(`    ✅ Creado`);
      } else {
        console.log(`    ⚠️ ${data.error || 'Error'}`);
      }
    } catch (e) {
      console.log(`    ❌ ${e.message}`);
    }

    await sleep(200);
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
  console.log('═'.repeat(60));
  console.log('  SEED: CONTENIDO DEL CÍRCULO - ENERO 2026');
  console.log('═'.repeat(60));

  await crearDuendes();
  await crearContenido();

  console.log('\n' + '═'.repeat(60));
  console.log('  ✅ COMPLETADO');
  console.log('═'.repeat(60));
  console.log('\n  Duendes creados: 3');
  console.log(`  Días de contenido: ${CONTENIDO_DIARIO.length}`);
  console.log('\n');
}

main().catch(console.error);
