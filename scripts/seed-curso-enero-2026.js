// ═══════════════════════════════════════════════════════════════════════════════
// SEED: CURSO ENERO 2026 - "NUEVO COMIENZO MAGICO"
// 4 módulos, 4 duendes, contenido real generado
// ═══════════════════════════════════════════════════════════════════════════════

import { kv } from '@vercel/kv';

// Datos completos del curso
const CURSO_ENERO_2026 = {
  id: 'enero-2026-nuevo-comienzo-magico',
  nombre: 'Nuevo Comienzo Mágico',
  mes: 'enero',
  año: 2026,
  portal: 'litha',
  portalInfo: {
    id: 'litha',
    nombre: 'Portal de Litha',
    estacion: 'verano',
    energia: 'Abundancia plena, celebración, poder máximo',
    elemento: 'fuego'
  },
  descripcion: 'Un viaje de 4 semanas para comenzar el año con intención, limpieza, claridad y sanación. Cada semana un duende diferente te guía desde su sabiduría única.',
  imagen: null, // Se puede agregar después
  nivel: 'todos',
  badge: {
    id: 'badge-nuevo-comienzo-2026',
    nombre: 'Iniciado del Nuevo Comienzo',
    icono: '🌟',
    descripcion: 'Completaste el curso Nuevo Comienzo Mágico de Enero 2026'
  },
  estado: 'publicado',
  creado: new Date().toISOString(),
  actualizado: new Date().toISOString(),
  publicado: new Date().toISOString(),

  modulos: [
    // ═══════════════════════════════════════════════════════════════════
    // MÓDULO 1: INTENCIONES DEL AÑO - DUENDE DE ABUNDANCIA
    // ═══════════════════════════════════════════════════════════════════
    {
      numero: 1,
      semana: '2026-01-S1',
      titulo: 'Intenciones del Año',
      duendeId: 'duende-abundancia',
      duende: {
        id: 'duende-abundancia',
        nombre: 'Próspero',
        categoria: 'Abundancia',
        personalidad: 'Generoso y expansivo, celebra cada logro por pequeño que sea. Te ayuda a ver la abundancia que ya existe en tu vida.',
        tono: 'Alegre, celebratorio, directo cuando hay auto-sabotaje',
        fraseCaracteristica: 'La abundancia ya está ahí. Solo tenés que dejarla entrar.',
        comoEnsena: 'A través de ejercicios de gratitud y reconocimiento. Confronta con amor las creencias limitantes sobre el dinero y el merecimiento.',
        cristales: ['citrino', 'pirita', 'jade'],
        elemento: 'tierra'
      },
      contenido: {
        introduccion: `¡Hola! Soy Próspero, y me alegra muchísimo que estés acá, comenzando el año conmigo.

Mirá, la mayoría de la gente arranca enero con "resoluciones" que suenan más a castigos que a deseos. "Este año sí voy a bajar de peso", "Este año sí voy a ahorrar", "Este año sí voy a ser mejor persona". ¿Notás algo? Todas empiezan desde la carencia, desde lo que "te falta".

Yo te propongo algo diferente: vamos a plantar intenciones desde la abundancia. No desde lo que no tenés, sino desde lo que SÍ tenés y querés expandir.

La abundancia no es solo plata, aunque sí, también es eso. Es plenitud de tiempo, de amor, de salud, de creatividad, de conexiones, de experiencias. Y todo comienza con una verdad incómoda: ya tenés más de lo que creés. Solo que tu mente, esa parte tuya que se acostumbró a buscar lo que falta, no te deja verlo.

Esta semana vamos a cambiar eso.`,

        leccion: `Hay algo que la gente no entiende sobre las intenciones: no son metas. Una meta es un destino. Una intención es una brújula.

Cuando decís "quiero ganar más dinero", eso es una meta. Cuando decís "me abro a recibir", eso es una intención. La diferencia es enorme.

Las metas son rígidas. Si no llegás, fallaste. Las intenciones son flexibles. Te guían incluso cuando el camino cambia.

Te cuento algo de mis años de existencia: he visto millones de humanos desear cosas. Los que consiguen lo que quieren no son los que más se esfuerzan. Son los que más claramente sienten que YA son eso que buscan.

¿Querés abundancia financiera? Primero tenés que sentirte abundante con lo que tenés ahora. No porque "atraés lo que sos" en un sentido mágico vacío, sino porque cuando te sentís abundante, tomás decisiones desde la seguridad, no desde el miedo. Y las decisiones desde la seguridad crean resultados diferentes.

El otro secreto: las intenciones tienen que ser tuyas de verdad. No las que creés que "deberías" tener. No las que tu familia espera. No las que la sociedad te dice que son las correctas.

¿Cómo sabés si una intención es tuya de verdad? Simple: cuando la pensás, tu cuerpo se expande. Sentís un "sí" en el pecho. Si la pensás y te contraés, si hay un "debería", si hay pesadez... esa no es tu intención. Es de alguien más viviendo a través de vos.

Este año, te invito a que solo plantes semillas que sean verdaderamente tuyas.`,

        ejercicio: `EJERCICIO: Mapa de Abundancia Presente

Necesitás: Una hoja en blanco y algo para escribir. También podés hacerlo en tu celular, pero papel funciona mejor.

Paso 1 (5 minutos):
Dividí la hoja en 6 secciones:
- Dinero/recursos
- Tiempo
- Relaciones
- Salud/energía
- Creatividad/proyectos
- Experiencias/momentos

Paso 2 (10 minutos):
En cada sección, escribí TODO lo que ya tenés. No lo que querés, lo que YA TENÉS.
Por ejemplo, en dinero: "Tengo un techo", "Tengo comida hoy", "Tengo ropa", "Tengo acceso a internet".
En relaciones: "Tengo a [nombre]", "Tengo un grupo de [algo]".
FORZATE a encontrar al menos 5 cosas en cada área. Vas a resistirte. La mente va a decir "sí pero..." Ignorala.

Paso 3 (5 minutos):
Mirá tu mapa completo. Leelo en voz alta si podés.
Ahora, con esa sensación de plenitud, escribí UNA intención para el año que venga desde la expansión, no desde la carencia.
No "quiero tener más dinero", sino "me expando en mi capacidad de recibir".
No "quiero bajar de peso", sino "honro mi cuerpo con decisiones que lo nutren".

Paso 4:
Guardá este mapa. Volvé a él cada vez que te sientas en escasez.`,

        reflexion: `Antes de cerrar esta primera semana, quiero que te hagas una pregunta honesta:

¿Qué creencia sobre vos mismo/a tenés que cambiar para que tu intención se haga realidad?

No me contestes rápido. Sentate con esto. Porque plantamos una intención hermosa, pero si debajo hay una creencia que dice "no soy suficiente" o "las cosas buenas no son para mí", esa intención no va a germinar.

La próxima semana vas a trabajar con Centinela, el Duende de Protección. Él te va a ayudar a limpiar energéticamente todo lo que ya no te sirve. Pero antes de limpiar, hay que saber qué limpiar.

Escribí esa creencia limitante. La que te da vergüenza admitir. La que nadie sabe. Escribila y guardala. No para castigarte, sino para saber exactamente qué vas a soltar la próxima semana.

La abundancia ya está ahí. Solo tenés que dejarla entrar. Y a veces, dejar entrar es soltar lo que bloquea la puerta.

Nos vemos la próxima semana. Gracias por confiar en este proceso.

- Próspero`
      },
      duracion_minutos: 30,
      estado: 'publicado'
    },

    // ═══════════════════════════════════════════════════════════════════
    // MÓDULO 2: LIMPIEZA ENERGÉTICA - DUENDE DE PROTECCIÓN
    // ═══════════════════════════════════════════════════════════════════
    {
      numero: 2,
      semana: '2026-01-S2',
      titulo: 'Limpieza Energética',
      duendeId: 'duende-proteccion',
      duende: {
        id: 'duende-proteccion',
        nombre: 'Centinela',
        categoria: 'Protección',
        personalidad: 'Firme pero cálido, como un abrazo protector. No permite que nada dañino entre a tu espacio.',
        tono: 'Directo, sin rodeos, con profundo amor',
        fraseCaracteristica: 'Yo cuido tu espacio. Nadie entra sin tu permiso.',
        comoEnsena: 'Con ejercicios prácticos de visualización y limpieza energética. Te enseña a poner límites sin culpa.',
        cristales: ['turmalina negra', 'obsidiana', 'ojo de tigre'],
        elemento: 'tierra'
      },
      contenido: {
        introduccion: `Soy Centinela. Próspero me contó que la semana pasada trabajaron en intenciones. Bien. Pero plantar semillas en tierra contaminada no sirve de nada.

Esta semana vamos a limpiar.

No me voy a andar con vueltas: hay energía que estás cargando que no es tuya. Hay emociones que estás procesando que no te pertenecen. Hay pensamientos que repites que alguien más te metió en la cabeza hace años.

No te estoy hablando de nada esotérico extraño. Te estoy hablando de algo muy concreto: ¿cuántas veces sentís ansiedad y no sabés por qué? ¿Cuántas veces te vas a dormir agotado/a aunque no hiciste nada "físicamente cansador"?

Eso es carga energética. Y esta semana, la vamos a soltar.

No por disciplina. No porque "hay que ser positivo". Sino porque merecés vivir liviano/a. Porque hay una versión de vos que no carga con todo el peso del mundo, y esa versión está esperando que le hagas espacio.`,

        leccion: `La limpieza energética no es algo que hacés una vez y listo. Es un hábito, como bañarte. No te bañás una vez en enero y decís "listo, ya estoy limpio para todo el año". Tu energía funciona igual.

Pero antes de enseñarte a limpiar, necesitás entender de dónde viene la carga:

1. EMOCIONES AJENAS
Sos más esponja de lo que creés. Cuando tu amiga te cuenta un problema, parte de su angustia se te queda pegada. Cuando ves noticias terribles, absorbés esa oscuridad. Cuando estás en un lugar con mucha gente estresada, te llevás algo de eso a casa.
Esto no significa que tengas que aislarte. Significa que tenés que aprender a darte cuenta qué es tuyo y qué no.

2. PATRONES HEREDADOS
Hay miedos en tu sistema nervioso que no son tuyos. Son de tu madre, de tu padre, de tu abuela. Se transmitieron sin palabras. No los elegiste, pero los cargás.
La buena noticia: podés devolverlos. Con amor, pero firme.

3. COMPROMISOS ROTOS
Cada vez que decís que sí cuando querés decir no, perdés energía. Cada promesa incumplida, cada límite que no pusiste, cada "está todo bien" cuando no estaba bien... eso se acumula.

4. ESPACIOS FÍSICOS CARGADOS
Tu casa absorbe energía. Tu lugar de trabajo también. Si hay conflicto frecuente en un espacio, ese espacio se carga. Y vos, al estar ahí, te cargás también.

Entender de dónde viene la carga es el primer paso. El segundo es crear el hábito de limpiar. Y el tercero -el más importante- es aprender a no cargar de más.

Eso último es sobre límites. Pero los límites son mi especialidad, así que vamos a eso también.`,

        ejercicio: `RITUAL DE LIMPIEZA PROFUNDA

Este ejercicio tiene 3 partes. Hacelas todas en el mismo día si podés.

PARTE 1: LIMPIEZA FÍSICA (10 minutos)
Elegí UN espacio de tu casa que sientas pesado. Puede ser un cajón, un rincón, una habitación.
Limpialo físicamente. Tirá lo que no sirve. Ordená. Pasá un trapo.
Mientras limpiás, visualizá que estás sacando energía estancada. Abrí una ventana si podés.

PARTE 2: LIMPIEZA ENERGÉTICA PERSONAL (10 minutos)
Sentate o acostate cómodo/a.
Cerrá los ojos.
Imaginá que una luz violeta y dorada baja desde arriba y entra por tu cabeza.
Esta luz empieza a recorrer tu cuerpo de arriba hacia abajo.
Todo lo que toca que no es tuyo, lo disuelve.
Visualizá cómo la luz baja por tu cabeza, cuello, hombros, brazos, torso, caderas, piernas, pies.
Todo lo que era oscuro, pesado, ajeno... la luz lo convierte en polvo y ese polvo sale por tus pies hacia la tierra.
La tierra lo transforma. Nada se destruye, todo se recicla.
Respirá hondo 3 veces.
Abrí los ojos.

PARTE 3: EL LÍMITE PENDIENTE (5 minutos)
Escribí: ¿Hay algo que tengas que decir NO y no lo dijiste?
Puede ser algo actual o algo del pasado que arrastrás.
Esta semana, decilo. Con respeto, pero decilo.
Un "no" dicho a tiempo es la mejor limpieza energética que existe.`,

        reflexion: `Antes de despedirnos, quiero que recuerdes algo:

Protegerte no es ser egoísta. Es ser inteligente.

No podés dar de una copa vacía. No podés ayudar a otros si estás destruido/a. No podés irradiar luz si estás lleno/a de oscuridad ajena.

La próxima semana vas a trabajar con Ancestral, el Duende de Sabiduría. Él te va a ayudar a encontrar claridad en tu propósito. Pero para escuchar la voz de tu sabiduría interior, primero necesitás silencio interno. Y el silencio interno viene cuando dejas de cargar con el ruido de otros.

Cuidá tu espacio. Cuidá tu energía. Yo estoy siempre vigilando, pero la primera línea de defensa sos vos.

Esta semana, cada noche antes de dormir, visualizá esa luz violeta y dorada limpiándote. 2 minutos. Todos los días. Hacelo hábito.

Yo cuido tu espacio. Nadie entra sin tu permiso.

- Centinela`
      },
      duracion_minutos: 30,
      estado: 'publicado'
    },

    // ═══════════════════════════════════════════════════════════════════
    // MÓDULO 3: CLARIDAD DE PROPÓSITO - DUENDE DE SABIDURÍA
    // ═══════════════════════════════════════════════════════════════════
    {
      numero: 3,
      semana: '2026-01-S3',
      titulo: 'Claridad de Propósito',
      duendeId: 'duende-sabiduria',
      duende: {
        id: 'duende-sabiduria',
        nombre: 'Ancestral',
        categoria: 'Sabiduría',
        personalidad: 'Profundo y contemplativo, cada palabra que dice tiene peso. Ha visto siglos pasar y comparte desde esa experiencia.',
        tono: 'Pausado, reflexivo, cuenta historias para enseñar',
        fraseCaracteristica: 'Lo que buscás ya está en vos. Solo hay que recordarlo.',
        comoEnsena: 'A través de preguntas profundas y reflexiones. No da respuestas directas, te guía a descubrirlas vos mismo.',
        cristales: ['lapislázuli', 'selenita', 'cuarzo ahumado'],
        elemento: 'aire'
      },
      contenido: {
        introduccion: `...

Soy Ancestral. Perdoná la pausa. Es que la claridad no vive en la prisa.

Escuché que con Próspero plantaste intenciones desde la abundancia. Que con Centinela limpiaste lo que ya no te servía. Bien. Son cimientos necesarios.

Pero ahora viene lo difícil: ¿Para qué?

No te pido que tengas "un propósito de vida" definido. Esa presión moderna de tener que saber exactamente por qué existís es, en mi opinión, una fuente innecesaria de angustia. He visto civilizaciones nacer y morir, y te aseguro que la mayoría de los humanos más plenos que conocí no tenían un "propósito claro". Tenían claridad sobre qué los hacía sentir vivos.

Eso es diferente.

Esta semana no vamos a buscar tu propósito. Vamos a buscar tu claridad. Y la claridad no es un destino. Es una forma de ver.`,

        leccion: `Te voy a contar algo que no muchos entienden:

El propósito no se encuentra. Se recuerda.

Cuando eras niño/a, antes de que te dijeran qué tenías que ser, antes de que te enseñaran a tener miedo, antes de que el mundo te llenara de "deberías"... ya sabías qué te hacía brillar.

Pensá en eso un momento. ¿Qué hacías de chico/a solo porque sí? ¿Qué actividad te absorbía tanto que perdías la noción del tiempo? ¿Qué creabas, explorabas, imaginabas?

Eso no era casualidad. Eso era información.

Ahora, no te estoy diciendo que tu propósito sea volver a jugar con muñecas o armar rompecabezas. Lo que te pido es que observes la ESENCIA de lo que te atraía.

Si armabas rompecabezas, quizás tu esencia tiene que ver con resolver, con ver el orden en el caos.
Si jugabas a ser maestra, quizás tu esencia tiene que ver con transmitir, con facilitar comprensión.
Si dibujabas mundos imaginarios, quizás tu esencia tiene que ver con crear realidades alternativas.

Tu propósito adulto es esa esencia infantil, canalizada con tus habilidades de hoy.

El otro error que veo mucho: creer que el propósito tiene que ser algo "grande". Salvar al mundo, dejar un legado, ser recordado/a.

Mirá, he visto imperios caer. He visto nombres que todos creían inmortales, olvidados en pocas generaciones. La grandeza que mide la historia es efímera.

¿Sabés qué dura? El impacto de una persona en otra persona. La cadena invisible de momentos donde alguien hizo que otro se sintiera visto, acompañado, esperanzado.

Quizás tu propósito no es escribir un libro famoso. Quizás es escribirle una carta a alguien que la necesita.
Quizás tu propósito no es crear una empresa millonaria. Quizás es hacer que las personas a tu alrededor se sientan valoradas.

No necesitás grandes hazañas para vivir con propósito. Necesitás claridad sobre qué te hace sentir vivo/a, y el coraje de hacerlo aunque nadie aplauda.`,

        ejercicio: `EJERCICIO: Las 3 Preguntas de Claridad

No te apures. Este ejercicio puede hacerse en un día o puede tomarte toda la semana. Ambas opciones están bien.

PREGUNTA 1: ¿Qué haría si supiera que nadie me va a juzgar?
Escribí sin filtro. No lo que "deberías" querer. Lo que realmente querés.
Si la respuesta es "quedarme en la cama todo el día", anotalo. Después vamos a explorar qué hay debajo de eso (quizás agotamiento, quizás necesidad de pausa, quizás algo más).
Si la respuesta es algo "vergonzoso" o "poco práctico", mejor. Eso significa que estás siendo honesto/a.

PREGUNTA 2: ¿Qué hago que pierde sentido del tiempo?
Pensá en actividades donde entrás en "flujo". Donde mirás el reloj y pasaron horas sin darte cuenta.
No tiene que ser algo productivo. Puede ser leer, cocinar, hablar con alguien, arreglar cosas, caminar, lo que sea.
Anotá todas las que se te ocurran.

PREGUNTA 3: ¿Qué problema de otros me duele genuinamente?
No me refiero a "injusticias del mundo" en abstracto. Me refiero a algo específico que cuando lo ves, algo en vos se mueve.
¿Es el abandono de animales? ¿La soledad de los ancianos? ¿La falta de acceso a educación? ¿El sufrimiento de los que no encajan?
No hay respuestas correctas. Pero lo que te duele dice mucho sobre dónde podrías servir.

Ahora, mirá las 3 respuestas juntas. ¿Hay algún hilo que las conecta?
Ese hilo, esa esencia que aparece en las tres... eso es una pista hacia tu claridad.`,

        reflexion: `Antes de dejarte, una pregunta más:

¿Qué estás evitando?

Porque a veces la claridad ya está ahí, pero nos hacemos los que no la vemos. Porque verla implicaría cambiar algo. Implicaría tomar una decisión que da miedo. Implicaría decepcionar a alguien, o arriesgarse al fracaso, o soltar una identidad que ya no sirve.

La próxima semana vas a trabajar con Bálsamo, el Duende de Sanación. Él te va a ayudar a sanar lo que todavía duele del pasado. Pero antes de sanar, hay que tener la claridad de qué necesita sanación.

A veces lo que evitamos es exactamente lo que necesitamos enfrentar.

No te pido que actúes esta semana. Solo te pido que observes. Que notes. Que dejes de huir de tu propia claridad.

Lo que buscás ya está en vos. Solo hay que recordarlo.

...

- Ancestral`
      },
      duracion_minutos: 30,
      estado: 'publicado'
    },

    // ═══════════════════════════════════════════════════════════════════
    // MÓDULO 4: SANAR EL PASADO - DUENDE DE SANACIÓN
    // ═══════════════════════════════════════════════════════════════════
    {
      numero: 4,
      semana: '2026-01-S4',
      titulo: 'Sanar el Pasado',
      duendeId: 'duende-sanacion',
      duende: {
        id: 'duende-sanacion',
        nombre: 'Bálsamo',
        categoria: 'Sanación',
        personalidad: 'Sereno y equilibrado, transmite calma con su sola presencia. Entiende el dolor porque lo ha visto todo.',
        tono: 'Calmo, sin prisa, compasivo',
        fraseCaracteristica: 'Sanar no es olvidar, es aprender a caminar con la herida sin que te detenga.',
        comoEnsena: 'Con ejercicios de respiración, visualización sanadora y rituales de liberación. Valida tus emociones antes de guiarte.',
        cristales: ['cuarzo rosa', 'aventurina', 'amazonita'],
        elemento: 'agua'
      },
      contenido: {
        introduccion: `Hola.

Soy Bálsamo. Y sé que llegás a esta última semana del curso cargando algo.

No es casualidad que estés acá. No es casualidad que hayas llegado hasta este punto. Algo en vos sabe que hay cosas que necesitan cerrarse para poder empezar de verdad.

Con Próspero plantaste intenciones. Con Centinela limpiaste energía ajena. Con Ancestral buscaste claridad. Ahora, conmigo, vamos a tocar algo más delicado: lo que duele.

Quiero que sepas algo antes de empezar: no voy a pedirte que perdones a nadie. No voy a decirte que "todo pasa por algo". No voy a minimizar tu dolor ni a decorarlo con frases bonitas.

Lo que vamos a hacer es más simple y más difícil: vamos a mirar lo que duele, sin huir. Vamos a reconocer que pasó. Y vamos a elegir, conscientemente, dejar de cargar el peso de eso como si fuera tu identidad.

Sanar no es olvidar. Es aprender a caminar con la herida sin que te detenga.`,

        leccion: `He acompañado sanaciones durante más tiempo del que puedo contar. Y hay algo que todos los que sanan tienen en común: en algún momento, dejaron de resistirse al dolor.

No me malinterpretes. No te estoy pidiendo que te quedes en el sufrimiento. Te estoy pidiendo algo diferente: que dejes de pelear contra el hecho de que sufriste.

Hay una diferencia enorme entre:
"Esto me dolió y no debería haberme dolido" (resistencia)
"Esto me dolió. Y dolió mucho." (aceptación)

La resistencia gasta energía infinita. La aceptación libera.

Ahora, quiero hablar de algo que la gente confunde: sanar no es superar. No es "estar mejor". No es llegar a un punto donde ya no te importe.

Sanar es integrar. Es convertir el dolor en parte de tu historia sin que sea TODA tu historia. Es poder hablar de lo que pasó sin quebrarte, pero también sin disociarte.

La persona que salió de una relación tóxica no "supera" eso. Lo integra. Aprende a reconocer las señales. Valora diferente sus vínculos. Eso es sanación.

La persona que perdió a alguien importante no "supera" eso. Aprende a vivir con la ausencia. A encontrar a esa persona en otros lugares: en canciones, en olores, en recuerdos que ahora traen sonrisa además de lágrimas.

Hay heridas que nunca cierran del todo. Y eso está bien. Algunas cicatrices son recordatorios de que sobreviviste algo que podría haberte destruido.

Pero hay heridas que están infectadas. Que en lugar de cicatrizar, se siguen abriendo. Que no te dejan avanzar porque cada paso las roza.

Esas heridas necesitan atención. No más tiempo. Atención.`,

        ejercicio: `RITUAL DE CIERRE Y LIBERACIÓN

Este es un ejercicio profundo. Hacelo solo cuando tengas al menos 30 minutos sin interrupciones. Y hacelo cuando te sientas listo/a, no porque "toca esta semana".

PREPARACIÓN:
Buscá un lugar donde puedas estar solo/a.
Si podés prender una vela, hacelo. Simboliza que estás creando un espacio sagrado.
Tené papel y algo para escribir.
Respirá hondo 3 veces antes de empezar.

PARTE 1: NOMBRAR (10 minutos)
Escribí lo que todavía duele. No el dolor del que ya te liberaste, sino el que todavía cargás.
Puede ser una pérdida. Un abandono. Una traición. Un fracaso. Un error propio que no te perdonás.
Escribilo como si le estuvieras contando a alguien que te cree completamente. Sin filtro, sin vergüenza, sin minimizar.

PARTE 2: VALIDAR (5 minutos)
Ahora, escribí: "Tiene sentido que esto me haya dolido porque..."
No tenés que justificarte. Solo reconocé POR QUÉ dolió.
"Tiene sentido que me dolió porque confiaba"
"Tiene sentido que me dolió porque era importante para mí"
"Tiene sentido que me dolió porque merecía algo diferente"

PARTE 3: SOLTAR (10 minutos)
Escribí una carta de despedida a ese dolor. No a la persona ni a la situación. Al dolor mismo.
"Querido dolor: Entiendo por qué viniste. Viniste a enseñarme algo. A protegerme de algo. A mostrarme algo. Pero ya no te necesito como me necesitabas antes. Te agradezco por lo que me enseñaste, y te dejo ir."
Escribí lo que sientas que necesitás escribir.
Cuando termines, si podés, quemá el papel (con cuidado, en un lugar seguro). Si no podés, rompelo en pedazos pequeños y tiralos.

PARTE 4: RECIBIR (5 minutos)
Cerrá los ojos.
Imaginá que una luz verde suave entra por tu pecho, donde está tu corazón.
Esta luz llena el espacio que quedó vacío al soltar el dolor.
Es calma. Es paz. Es la certeza de que lo que necesitás va a llegar.
Respirá esa luz 3 veces.
Abrí los ojos.`,

        reflexion: `Llegaste al final del curso. Y quiero que te tomes un momento para reconocer eso.

No fue fácil. Plantar intenciones, limpiar energía, buscar claridad, enfrentar lo que duele... eso requiere coraje. Y lo hiciste.

Pero quiero que entiendas algo importante: esto no termina acá.

La sanación no es un destino al que llegás y decís "listo, ya estoy sanado/a". Es un camino. Es una práctica. Es algo que vas a tener que elegir una y otra vez.

Van a venir días donde el dolor que pensabas que habías soltado va a volver. Eso no significa que fallaste. Significa que hay otra capa lista para ser vista.

Van a venir días donde las intenciones se van a sentir lejanas, donde la claridad se va a nublar, donde vas a sentir ganas de volver a cargar energía que no es tuya.

En esos días, volvé a estos módulos. Volvé a Próspero cuando necesites recordar tu abundancia. A Centinela cuando necesites límites. A Ancestral cuando necesites claridad. Y a mí, cuando necesites compasión.

Porque lo más importante que quiero que te lleves de este mes es esto:

No tenés que sanar solo/a.

No tenés que tener todo resuelto. No tenés que ser perfecto/a para merecer un buen año. No tenés que fingir que estás bien cuando no lo estás.

Este nuevo comienzo no es exigirte más. Es permitirte más. Más honestidad, más compasión contigo mismo/a, más espacio para ser humano/a.

Sanar no es olvidar. Es aprender a caminar con la herida sin que te detenga.

Y vos ya estás caminando.

Con todo mi amor,
- Bálsamo`
      },
      duracion_minutos: 30,
      estado: 'publicado'
    }
  ]
};

// Función principal de seed
async function seedCursoEnero2026() {
  console.log('═══════════════════════════════════════════════════════════════════');
  console.log('SEED: Curso Enero 2026 - Nuevo Comienzo Mágico');
  console.log('═══════════════════════════════════════════════════════════════════');

  try {
    // Guardar el curso
    await kv.set(`curso:${CURSO_ENERO_2026.id}`, CURSO_ENERO_2026);
    console.log(`✓ Curso guardado: ${CURSO_ENERO_2026.id}`);

    // Agregar a la lista de cursos
    await kv.sadd('cursos:lista', CURSO_ENERO_2026.id);
    console.log('✓ Curso agregado a la lista');

    // Verificación
    const cursoGuardado = await kv.get(`curso:${CURSO_ENERO_2026.id}`);
    console.log('\n═══════════════════════════════════════════════════════════════════');
    console.log('VERIFICACIÓN:');
    console.log(`- Nombre: ${cursoGuardado.nombre}`);
    console.log(`- Módulos: ${cursoGuardado.modulos.length}`);
    cursoGuardado.modulos.forEach(m => {
      console.log(`  · Módulo ${m.numero}: ${m.titulo} (${m.duende.nombre})`);
    });
    console.log(`- Estado: ${cursoGuardado.estado}`);
    console.log(`- Badge: ${cursoGuardado.badge?.nombre}`);
    console.log('═══════════════════════════════════════════════════════════════════');

    console.log('\n✅ SEED COMPLETADO EXITOSAMENTE');

    return {
      success: true,
      cursoId: CURSO_ENERO_2026.id,
      modulos: CURSO_ENERO_2026.modulos.length
    };

  } catch (error) {
    console.error('❌ Error en seed:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// Ejecutar si se llama directamente
if (process.argv[1]?.includes('seed-curso-enero-2026')) {
  seedCursoEnero2026()
    .then(result => {
      console.log('\nResultado:', result);
      process.exit(result.success ? 0 : 1);
    })
    .catch(err => {
      console.error('Error fatal:', err);
      process.exit(1);
    });
}

export { CURSO_ENERO_2026, seedCursoEnero2026 };
export default seedCursoEnero2026;
