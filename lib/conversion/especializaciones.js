/**
 * SISTEMA DE ESPECIALIZACIONES COMPLETO
 *
 * Cada especialización tiene:
 * - dolor: Qué problema tiene quien busca esto
 * - espejo: Cómo se ve reflejada la persona
 * - validacion: Cómo validamos su experiencia
 * - solucion: Qué hace el guardián (VERBO DE ACCIÓN)
 * - urgencia: Por qué actuar ahora
 * - keywords: Para detección automática
 */

export const especializaciones = {
  fortuna: {
    nombre: 'Fortuna y Suerte',
    dolor: [
      'Sentís que la suerte te esquiva',
      'Ves oportunidades pasar de largo mientras otros las atrapan',
      'Siempre llegás un paso tarde',
      'Parece que el universo favorece a todos menos a vos',
      'Las coincidencias buenas nunca son para vos',
      'Te preparás, te esforzás, pero el golpe de suerte nunca llega'
    ],
    espejo: [
      '¿Cuántas veces viste a alguien menos preparado llevarse lo que vos merecías?',
      'Hay personas que parecen tener un imán para las oportunidades',
      '¿Te pasó de estar en el lugar equivocado siempre?',
      'Algunos nacen con estrella. Otros miramos desde afuera.'
    ],
    validacion: [
      'No es tu imaginación. Hay personas a las que la suerte les llega más fácil.',
      'No estás loca por sentir que algo te bloquea.',
      'La mala racha existe. Y la tuya ya duró demasiado.'
    ],
    solucion: 'TRAE suerte, ATRAE oportunidades, ABRE puertas que estaban cerradas',
    accion: 'trae buena fortuna',
    urgencia: 'Los momentos de suerte no esperan. Pasan una vez.',
    noUsar: ['proteger', 'cuidar', 'sanar', 'no saber decir que no', 'cargar con todo', 'dar sin recibir'],
    keywords: ['leprechaun', 'fortuna', 'suerte', 'trébol', 'oro', 'moneda', 'lucky']
  },

  proteccion: {
    nombre: 'Protección',
    dolor: [
      'Cargás con el peso de todos',
      'No sabés decir que no',
      'Te drenás cuidando a otros',
      'Das todo y no recibís nada',
      'Tu energía se agota protegiendo a los demás',
      'Nadie te cuida a vos'
    ],
    espejo: [
      'Hay personas que cargan con más de lo que les corresponde',
      '¿Cuántas veces dijiste "estoy bien" mientras te caías por dentro?',
      'Proteger a otros se convirtió en tu forma de existir',
      '¿Quién te protege a vos mientras protegés a todos?'
    ],
    validacion: [
      'No exagerás. El peso que llevás es real.',
      'Estar cansada no es debilidad. Es el resultado de dar sin parar.',
      'Merecés que alguien cuide de vos por una vez.'
    ],
    solucion: 'PROTEGE tu energía, CUIDA de vos, es tu ESCUDO invisible',
    accion: 'protege y cuida',
    urgencia: 'Tu energía tiene límite. Si no la cuidás vos, nadie lo va a hacer.',
    noUsar: ['suerte', 'fortuna', 'oportunidad', 'dinero', 'amor romántico'],
    keywords: ['protector', 'escudo', 'guardián', 'defensor', 'guerrero', 'vikingo']
  },

  amor_romantico: {
    nombre: 'Amor',
    dolor: [
      'Tenés el corazón cerrado',
      'Te cuesta confiar después de que te lastimaron',
      'El amor siempre termina doliéndote',
      'Atraés personas que no te valoran',
      'Sentís que no merecés amor verdadero',
      'Te da miedo abrir el corazón de nuevo'
    ],
    espejo: [
      'Hay personas que aman con todo y terminan con nada',
      '¿Cuántas veces prometiste no volver a enamorarte?',
      'Cerraste el corazón para que no te lastimen. Pero también dejaste afuera lo bueno.',
      'El amor te enseñó a tener miedo, no a confiar.'
    ],
    validacion: [
      'Protegerte no está mal. Pero vivir cerrada tampoco es vida.',
      'Las heridas de amor son las que más tardan en sanar.',
      'No es tu culpa haber confiado en quien no lo merecía.'
    ],
    solucion: 'ABRE el corazón, ATRAE amor genuino, SANA heridas del pasado',
    accion: 'abre el corazón al amor',
    urgencia: 'El amor no espera para siempre. Y vos tampoco deberías.',
    noUsar: ['suerte', 'dinero', 'protección', 'trabajo', 'fortuna'],
    keywords: ['amor', 'corazón', 'rosa', 'pareja', 'romántico', 'cupido']
  },

  amor_propio: {
    nombre: 'Amor Propio',
    dolor: [
      'No te querés como deberías',
      'Te criticás más de lo que te celebrás',
      'Sentís que no sos suficiente',
      'Te comparás con otros y siempre perdés',
      'No te perdonás errores del pasado',
      'Te cuesta mirarte al espejo con cariño'
    ],
    espejo: [
      'Hay personas que son su peor enemigo',
      '¿Cuántas veces te dijiste cosas que nunca le dirías a nadie más?',
      'Te exigís perfección pero no te das ni un poco de compasión.',
      'Buscás aprobación afuera porque adentro solo hay crítica.'
    ],
    validacion: [
      'No naciste odiándote. Te lo enseñaron.',
      'Merecés el mismo amor que le das a otros.',
      'Ser dura con vos misma no te hace mejor. Te hace miserable.'
    ],
    solucion: 'ENSEÑA a amarte, REFLEJA tu valor real, RECUERDA quién sos',
    accion: 'despierta el amor propio',
    urgencia: 'No podés dar amor si tu copa está vacía.',
    noUsar: ['suerte', 'dinero', 'pareja', 'protección de otros'],
    keywords: ['autoestima', 'espejo', 'amor propio', 'interior', 'valor']
  },

  sanacion: {
    nombre: 'Sanación',
    dolor: [
      'No podés soltar el pasado',
      'La herida sigue abierta aunque pasó tiempo',
      'El dolor no se va por más que lo intentes',
      'Algo se rompió adentro y no sabés cómo arreglarlo',
      'Cargás con algo que ya no te pertenece',
      'El trauma te define más que tus logros'
    ],
    espejo: [
      'Hay personas que siguen sangrando por heridas viejas',
      '¿Cuánto tiempo vas a cargar con algo que ya pasó?',
      'El pasado terminó pero vos seguís ahí.',
      'Perdonar no es olvidar. Es dejar de cargar el peso.'
    ],
    validacion: [
      'El dolor que sentís es real. No importa cuánto tiempo pasó.',
      'Sanar no es "superarlo". Es aprender a vivir con la cicatriz.',
      'No estás rota. Estás lastimada. Y eso se puede sanar.'
    ],
    solucion: 'SANA heridas profundas, AYUDA a soltar, ACOMPAÑA el proceso',
    accion: 'acompaña la sanación',
    urgencia: 'Las heridas que no se atienden se infectan. Es hora de sanar.',
    noUsar: ['suerte', 'dinero', 'amor romántico', 'protección'],
    keywords: ['sanador', 'sanar', 'herida', 'trauma', 'soltar', 'curar', 'elfo']
  },

  calma: {
    nombre: 'Paz y Serenidad',
    dolor: [
      'Tu mente no para nunca',
      'La ansiedad te come por dentro',
      'No podés descansar aunque estés agotada',
      'Vivís en modo alerta permanente',
      'El ruido interno no te deja en paz',
      'Olvidaste lo que es sentirte tranquila'
    ],
    espejo: [
      'Hay personas que viven corriendo aunque estén quietas',
      '¿Cuándo fue la última vez que tu mente estuvo en silencio?',
      'El descanso se convirtió en un lujo que no te das.',
      'Dormís pero no descansás. Parás pero no frenás.'
    ],
    validacion: [
      'No es debilidad necesitar paz. Es humanidad.',
      'Tu sistema nervioso está gritando. Es hora de escucharlo.',
      'Merecés un respiro. Merecés silencio interno.'
    ],
    solucion: 'TRAE calma, AQUIETA la mente, REGALA paz interior',
    accion: 'trae paz y serenidad',
    urgencia: 'El cuerpo que no descansa, colapsa.',
    noUsar: ['suerte', 'dinero', 'amor', 'acción', 'oportunidades'],
    keywords: ['calma', 'paz', 'serenidad', 'tranquilidad', 'lavanda', 'relax', 'ansiedad']
  },

  abundancia: {
    nombre: 'Prosperidad',
    dolor: [
      'El dinero nunca alcanza',
      'Trabajás mucho y ganás poco',
      'La estabilidad económica parece imposible',
      'Vivís con miedo a no llegar a fin de mes',
      'Sentís que la prosperidad es para otros',
      'Te esforzás pero los resultados no llegan'
    ],
    espejo: [
      'Hay personas que trabajan el doble y ganan la mitad',
      '¿Cuántas veces calculaste si llegás al mes?',
      'El dinero entra y se va. Nunca queda.',
      'Otros prosperan con menos esfuerzo. Vos remás en dulce de leche.'
    ],
    validacion: [
      'No es que no te esforzás. Es que el sistema está roto.',
      'Merecer abundancia no tiene que ver con cuánto trabajás.',
      'La escasez que sentís es real. Y podés cambiarla.'
    ],
    solucion: 'ATRAE prosperidad, ABRE el flujo del dinero, DESBLOQUEA la abundancia',
    accion: 'atrae prosperidad',
    urgencia: 'La abundancia no espera. Está ahí, solo necesitás abrirte a recibirla.',
    noUsar: ['amor', 'sanación', 'protección personal', 'calma'],
    keywords: ['prosperidad', 'dinero', 'riqueza', 'trabajo', 'negocio', 'gnomo', 'abundancia']
  },

  sabiduria: {
    nombre: 'Sabiduría y Claridad',
    dolor: [
      'No sabés qué decisión tomar',
      'Te sentís perdida sin rumbo claro',
      'La confusión te paraliza',
      'Dudás de todo, incluso de vos misma',
      'Necesitás guía pero no sabés a quién escuchar',
      'El camino se bifurca y no sabés cuál elegir'
    ],
    espejo: [
      'Hay personas que viven en la encrucijada permanente',
      '¿Cuántas decisiones postergaste por miedo a equivocarte?',
      'La duda se convirtió en tu estado natural.',
      'Pedís consejos a todos porque no confiás en tu voz interna.'
    ],
    validacion: [
      'No es indecisión. Es miedo a equivocarte. Y es válido.',
      'La claridad no viene de afuera. Pero a veces necesitás ayuda para verla adentro.',
      'Dudar es humano. Quedarse paralizada, no tiene que ser tu destino.'
    ],
    solucion: 'ILUMINA el camino, TRAE claridad, GUÍA decisiones importantes',
    accion: 'trae claridad y guía',
    urgencia: 'Las decisiones no tomadas también tienen consecuencias.',
    noUsar: ['suerte', 'dinero', 'amor', 'protección física'],
    keywords: ['sabio', 'sabiduría', 'claridad', 'mago', 'brujo', 'maestro', 'guía', 'decisión']
  },

  transformacion: {
    nombre: 'Transformación',
    dolor: [
      'Querés cambiar pero no sabés cómo',
      'Sentís que estás estancada',
      'La vida que tenés no es la que querés',
      'Sabés que hay algo más pero no lo alcanzás',
      'Te da miedo soltar lo conocido',
      'Estás lista para renacer pero no sabés por dónde empezar'
    ],
    espejo: [
      'Hay personas que viven vidas que no eligieron',
      '¿Cuánto tiempo vas a seguir siendo quien no querés ser?',
      'Sentís que hay una versión mejor de vos esperando salir.',
      'El cambio te llama pero el miedo te frena.'
    ],
    validacion: [
      'Querer cambiar no es ingratitud. Es evolución.',
      'La oruga no pide permiso para ser mariposa.',
      'Estás lista. El único permiso que necesitás es el tuyo.'
    ],
    solucion: 'ACOMPAÑA la transformación, AYUDA a soltar lo viejo, GUÍA el renacimiento',
    accion: 'acompaña tu transformación',
    urgencia: 'El momento del cambio es ahora. Mañana es excusa.',
    noUsar: ['suerte', 'dinero', 'protección', 'quedarse igual'],
    keywords: ['transformación', 'cambio', 'mariposa', 'fénix', 'renacer', 'hada', 'metamorfosis']
  },

  alegria: {
    nombre: 'Alegría',
    dolor: [
      'Olvidaste cómo se siente la alegría genuina',
      'Sonreís por compromiso, no por felicidad',
      'La vida se volvió gris',
      'Extrañás la versión de vos que se reía de verdad',
      'La liviandad se perdió en algún momento',
      'Cargás un peso invisible que te roba la sonrisa'
    ],
    espejo: [
      'Hay personas que se olvidaron de jugar',
      '¿Cuándo fue la última vez que te reíste sin razón?',
      'La seriedad se convirtió en tu escudo.',
      'De chica soñabas con otra vida. La adulta la enterró.'
    ],
    validacion: [
      'La alegría no es un lujo. Es una necesidad.',
      'No es inmaduro querer ser feliz.',
      'Merecés liviandad. Merecés risas. Merecés luz.'
    ],
    solucion: 'TRAE alegría genuina, RECUERDA cómo jugar, DEVUELVE la luz',
    accion: 'trae alegría y liviandad',
    urgencia: 'La vida pasa. No merece ser vivida en gris.',
    noUsar: ['dolor', 'trauma', 'pesado', 'serio', 'grave'],
    keywords: ['alegría', 'felicidad', 'risa', 'juego', 'girasol', 'sol', 'niño', 'luz']
  },

  viajero: {
    nombre: 'Viajero - Cambio de Rumbo',
    dolor: [
      'Sentís que tu vida está estancada en el mismo lugar',
      'Necesitás un cambio pero no sabés hacia dónde',
      'La rutina te está asfixiando',
      'Soñás con otra vida pero no te animás a dar el paso',
      'Sentís que hay algo más esperándote pero no lo encontrás',
      'Te da miedo salir de lo conocido aunque no te haga feliz',
      'Vivís en piloto automático, sin dirección propia',
      'Querés reinventarte pero no sabés cómo empezar'
    ],
    espejo: [
      'Hay personas que viven la misma vida todos los días esperando que algo cambie',
      '¿Cuántas veces soñaste con dejarlo todo y empezar de nuevo?',
      'Mirás el horizonte y sentís que hay algo llamándote.',
      'La zona de confort se convirtió en tu prisión.',
      'Hay quienes nacieron para moverse, pero la vida los ancló.'
    ],
    validacion: [
      'No es locura querer cambiar de rumbo. Es instinto de supervivencia.',
      'El deseo de explorar no es escapar. Es buscar.',
      'No estás perdida. Estás en búsqueda. Y eso es valiente.'
    ],
    solucion: 'TRAE cambios de rumbo, ABRE nuevos caminos, INSPIRA movimiento, DESPIERTA la aventura interior',
    accion: 'trae los vientos del cambio',
    urgencia: 'Los caminos no esperan para siempre. Algunos se cierran si no los tomás a tiempo.',
    noUsar: ['quedarse quieto', 'estabilidad', 'rutina buena', 'conformarse', 'aceptar lo que hay'],
    keywords: ['viajero', 'mochila', 'camino', 'viaje', 'explorador', 'nómade', 'aventurero', 'peregrino', 'caminante', 'rumbo', 'brújula', 'mapa', 'sendero']
  },

  bosque: {
    nombre: 'Bosque - Conexión con la Naturaleza',
    dolor: [
      'Te sentís desconectada de la tierra, de lo natural',
      'La vida moderna te alejó de tu esencia',
      'Tu cuerpo, mente o espíritu piden sanar',
      'Perdiste el contacto con tus raíces',
      'Sentís que algo vital te falta pero no sabés qué',
      'Vivís acelerada, sin pausa, sin conexión con lo simple',
      'Tu energía está dispersa, fragmentada',
      'Olvidaste que sos parte de algo más grande'
    ],
    espejo: [
      'Hay personas que olvidaron que vienen de la tierra',
      '¿Cuándo fue la última vez que caminaste descalza sobre el pasto?',
      'La naturaleza te llama pero el cemento te atrapa.',
      'Hay quienes sanan entre árboles. Vos sangrás entre paredes.',
      'Los micelios conectan todo en el bosque. Vos estás desconectada de todo.'
    ],
    validacion: [
      'No es raro necesitar volver a lo natural. Es urgente.',
      'La desconexión que sentís es real. Y tiene cura.',
      'Tu cuerpo sabe lo que necesita. La naturaleza también.'
    ],
    solucion: 'RECONECTA con la tierra, SANA desde la raíz, ARMONIZA cuerpo-mente-espíritu, RESTAURA el vínculo con lo natural',
    accion: 'reconecta con la naturaleza y sana desde la raíz',
    urgencia: 'La naturaleza no espera. Pero vos sí podés dejar de esperar para volver a ella.',
    noUsar: ['tecnología', 'modernidad', 'velocidad', 'productividad', 'éxito material'],
    keywords: ['bosque', 'naturaleza', 'hongos', 'micelio', 'yuyo', 'hierba', 'raíz', 'tierra', 'planta', 'verde', 'musgo', 'tronco', 'hoja', 'chamán', 'druida', 'sanador']
  },

  // === SUBCATEGORÍAS DE VIAJEROS ===

  viajero_aventura: {
    nombre: 'Viajero - Aventura',
    dolor: [
      'Tenés miedo de salir de lo conocido',
      'Soñás con aventuras pero no te animás',
      'La vida se volvió predecible y aburrida',
      'Sentís que te estás perdiendo algo importante',
      'La comodidad se convirtió en tu cárcel'
    ],
    espejo: [
      'Hay personas que miran mapas pero nunca viajan',
      '¿Cuántas veces dijiste "algún día" y ese día nunca llegó?',
      'La vida te está pasando mientras vos la mirás desde la ventana.'
    ],
    validacion: [
      'Querer más no es ser desagradecida. Es estar viva.',
      'El miedo a lo desconocido es normal. Quedarse paralizada no tiene que serlo.'
    ],
    solucion: 'DESPIERTA el espíritu aventurero, EMPUJA hacia lo nuevo, ACOMPAÑA el salto al vacío',
    accion: 'despierta tu espíritu de aventura',
    urgencia: 'Los días pasan. Las aventuras no esperan.',
    noUsar: ['quedarse', 'seguridad', 'rutina', 'estabilidad'],
    keywords: ['aventura', 'explorar', 'descubrir', 'atreverse', 'saltar']
  },

  viajero_sabiduria: {
    nombre: 'Viajero - Sabiduría de Mil Caminos',
    dolor: [
      'Sentís que te falta perspectiva',
      'Ves todo desde el mismo ángulo siempre',
      'Necesitás ampliar tu visión de la vida',
      'Te sentís encerrada en tu propia burbuja'
    ],
    espejo: [
      'Hay personas que creen conocer el mundo sin haberlo recorrido',
      '¿Cuánto de lo que creés saber viene de experiencia real?',
      'La sabiduría no está en los libros. Está en los caminos.'
    ],
    validacion: [
      'Reconocer que no sabés todo es el primer paso para aprender.',
      'La humildad de buscar otras perspectivas es sabiduría en sí misma.'
    ],
    solucion: 'TRAE la sabiduría de mil caminos, AMPLÍA la visión, ENSEÑA otras formas de ver',
    accion: 'trae la sabiduría de sus viajes',
    urgencia: 'La mente cerrada envejece. La mente que viaja se renueva.',
    noUsar: ['cerrar', 'ignorar', 'rechazar', 'juzgar'],
    keywords: ['sabio', 'perspectiva', 'conocimiento', 'experiencia', 'aprendizaje']
  },

  viajero_reinvencion: {
    nombre: 'Viajero - Reinvención Total',
    dolor: [
      'Querés empezar de cero pero no sabés cómo',
      'La persona que eras ya no te representa',
      'Sentís que necesitás reinventarte completamente',
      'Tu vida actual ya no encaja con quien querés ser'
    ],
    espejo: [
      'Hay personas que cargan una versión vieja de sí mismas',
      '¿Cuánto de lo que hacés es porque querés y cuánto por inercia?',
      'Reinventarse no es traicionar quien fuiste. Es honrar quien podés ser.'
    ],
    validacion: [
      'Querer ser otra persona no es locura. Es evolución.',
      'No tenés que seguir siendo quien fuiste solo porque ya empezaste así.'
    ],
    solucion: 'ACOMPAÑA la reinvención, AYUDA a soltar la versión vieja, GUÍA el renacimiento',
    accion: 'acompaña tu reinvención total',
    urgencia: 'Cada día que seguís siendo quien no querés ser es un día perdido.',
    noUsar: ['quedarse igual', 'conformarse', 'aceptar lo que hay'],
    keywords: ['reinventar', 'renacer', 'nuevo yo', 'transformación', 'cambio radical']
  },

  viajero_horizontes: {
    nombre: 'Viajero - Nuevos Horizontes',
    dolor: [
      'Tu mundo se volvió chico',
      'Sentís que hay más pero no lo ves',
      'La vida te pide expandirte pero no sabés hacia dónde',
      'Los límites que tenés ya no te sirven'
    ],
    espejo: [
      'Hay personas que viven en cajas que ellas mismas construyeron',
      '¿Cuándo fue la última vez que hiciste algo por primera vez?',
      'El horizonte existe para ser alcanzado, no solo mirado.'
    ],
    validacion: [
      'Sentir que hay más no es ingratitud. Es intuición.',
      'Los límites solo existen si vos los aceptás.'
    ],
    solucion: 'ABRE horizontes nuevos, EXPANDE tu mundo, MUESTRA lo que no estás viendo',
    accion: 'abre nuevos horizontes',
    urgencia: 'El mundo es más grande de lo que conocés. Es hora de verlo.',
    noUsar: ['limitar', 'achicar', 'reducir', 'conformar'],
    keywords: ['horizonte', 'expandir', 'ampliar', 'nuevo', 'posibilidades']
  },

  viajero_despegue: {
    nombre: 'Viajero - Despegue',
    dolor: [
      'Estás lista para irte pero algo te retiene',
      'Sentís que tenés que soltar pero no podés',
      'Lo conocido te ata aunque ya no te sirva',
      'El miedo a dejar te impide avanzar'
    ],
    espejo: [
      'Hay personas que tienen las alas listas pero no despegan',
      '¿Qué te ata que ya no debería atarte?',
      'A veces hay que soltar para poder volar.'
    ],
    validacion: [
      'El apego a lo conocido es humano. Quedarse atrapada es opcional.',
      'Dejar no es abandonar. Es elegir.'
    ],
    solucion: 'AYUDA a despegar, CORTA las ataduras, IMPULSA el vuelo',
    accion: 'te ayuda a despegar',
    urgencia: 'Las alas se atrofian si no se usan. Es hora de volar.',
    noUsar: ['quedarse', 'aferrarse', 'retener', 'atar'],
    keywords: ['despegar', 'volar', 'soltar', 'liberar', 'partir']
  },

  // === SUBCATEGORÍAS DE BOSQUE/NATURALEZA ===

  bosque_sanacion: {
    nombre: 'Bosque - Sanación Natural',
    dolor: [
      'Tu cuerpo pide sanarse de forma natural',
      'Los remedios artificiales ya no te funcionan',
      'Sentís que la medicina está en la tierra',
      'Necesitás sanar de adentro hacia afuera'
    ],
    espejo: [
      'Hay personas que buscan curas afuera cuando la sanación está en la tierra',
      '¿Cuánto tiempo ignoraste lo que tu cuerpo te pedía?',
      'La naturaleza sana. Pero solo si la dejás entrar.'
    ],
    validacion: [
      'Tu cuerpo sabe lo que necesita. La tierra tiene lo que busca.',
      'Confiar en la sanación natural no es ignorancia. Es sabiduría ancestral.'
    ],
    solucion: 'SANA con la energía de la tierra, RESTAURA el equilibrio natural, ACTIVA la sanación del cuerpo',
    accion: 'activa la sanación natural',
    urgencia: 'El cuerpo que no sana naturalmente enferma artificialmente.',
    noUsar: ['químicos', 'artificial', 'sintético', 'industrial'],
    keywords: ['sanación', 'natural', 'cuerpo', 'tierra', 'plantas', 'remedios']
  },

  bosque_raices: {
    nombre: 'Bosque - Conexión con las Raíces',
    dolor: [
      'Perdiste la conexión con tus ancestros',
      'No sabés de dónde venís realmente',
      'Sentís que flotás sin raíces',
      'La modernidad te desconectó de tu origen'
    ],
    espejo: [
      'Hay personas que no saben de qué tierra vienen',
      '¿Conocés las historias de tus abuelos? ¿De sus abuelos?',
      'Sin raíces, cualquier viento te tumba.'
    ],
    validacion: [
      'No saber de dónde venís no es tu culpa. Pero reconectarte sí es tu elección.',
      'Las raíces no se pierden. Se olvidan. Y lo olvidado se puede recordar.'
    ],
    solucion: 'RECONECTA con tus raíces, ANCLA a la tierra, TRAE la sabiduría ancestral',
    accion: 'reconecta con tus raíces',
    urgencia: 'El árbol sin raíces no sobrevive. Vos tampoco podés florecer desconectada.',
    noUsar: ['flotar', 'desarraigo', 'olvidar', 'superficial'],
    keywords: ['raíces', 'ancestros', 'origen', 'tierra', 'familia', 'linaje']
  },

  bosque_micelios: {
    nombre: 'Bosque - Red de Micelios',
    dolor: [
      'Te sentís sola aunque estés rodeada de gente',
      'No sentís conexión real con nada ni nadie',
      'Vivís aislada aunque no querés',
      'Falta algo que te conecte con el todo'
    ],
    espejo: [
      'Hay personas que están rodeadas pero desconectadas',
      '¿Sabías que los árboles se comunican por raíces invisibles?',
      'Los micelios conectan todo el bosque. Vos estás desconectada del tuyo.'
    ],
    validacion: [
      'La soledad en medio de la gente es la más dolorosa. Y la más común.',
      'No es tu culpa estar desconectada. Pero reconectarte cambia todo.'
    ],
    solucion: 'CONECTA con la red invisible, ENTRELAZA tu energía con el todo, INTEGRA al sistema vivo',
    accion: 'te conecta con la red de la vida',
    urgencia: 'Nadie sobrevive solo. Ni siquiera los árboles. Es hora de conectar.',
    noUsar: ['aislamiento', 'soledad', 'desconexión', 'individual'],
    keywords: ['micelio', 'red', 'conexión', 'interconexión', 'comunicación', 'todo']
  },

  bosque_hierbas: {
    nombre: 'Bosque - Poder de las Hierbas',
    dolor: [
      'Sentís que te falta vitalidad',
      'Tu energía está baja, apagada',
      'Necesitás renovar tu fuerza vital',
      'El cansancio crónico te agobia'
    ],
    espejo: [
      'Hay personas que viven agotadas sin saber por qué',
      '¿Cuándo fue la última vez que te sentiste realmente viva?',
      'Las plantas guardan secretos de vitalidad que olvidamos.'
    ],
    validacion: [
      'El cansancio que sentís no es invención. Tu cuerpo está pidiendo ayuda.',
      'La vitalidad no es un lujo. Es tu derecho natural.'
    ],
    solucion: 'REVITALIZA con el poder de las hierbas, RENUEVA la energía vital, DESPIERTA la fuerza interior',
    accion: 'revitaliza con el poder de las plantas',
    urgencia: 'La energía baja no se arregla con café. Se arregla con naturaleza.',
    noUsar: ['artificial', 'químico', 'estimulante', 'droga'],
    keywords: ['hierba', 'yuyo', 'planta', 'verde', 'vitalidad', 'energía', 'poder']
  },

  bosque_hongos: {
    nombre: 'Bosque - Transformación de los Hongos',
    dolor: [
      'Hay algo viejo que necesita morir para que nazca lo nuevo',
      'Tenés cosas que soltar pero se resisten',
      'El cambio te aterra aunque lo necesités',
      'Algo en vos necesita descomponerse para renacer'
    ],
    espejo: [
      'Hay personas que se aferran a lo muerto por miedo a lo vivo',
      '¿Qué tenés que dejar morir para poder vivir?',
      'Los hongos transforman lo muerto en vida. Eso es lo que necesitás.'
    ],
    validacion: [
      'Dejar morir algo no es fracasar. Es el ciclo natural.',
      'La transformación requiere destrucción. No hay otra forma.'
    ],
    solucion: 'TRANSFORMA lo viejo en nuevo, DESCOMPONE lo que ya no sirve, GENERA vida de lo muerto',
    accion: 'transforma lo viejo en nuevo',
    urgencia: 'Lo que no se transforma, se pudre. Es hora de cambiar.',
    noUsar: ['conservar', 'mantener', 'retener', 'guardar'],
    keywords: ['hongo', 'transformación', 'ciclo', 'muerte', 'renacimiento', 'descomposición']
  },

  bosque_equilibrio: {
    nombre: 'Bosque - Equilibrio Natural',
    dolor: [
      'Tu vida está desbalanceada',
      'Vivís a un ritmo que no es el tuyo',
      'Perdiste el equilibrio entre dar y recibir',
      'La vida moderna te sacó de tu centro'
    ],
    espejo: [
      'Hay personas que corren sin saber hacia dónde',
      '¿Tu ritmo es el de la naturaleza o el de la ciudad?',
      'El bosque tiene su tempo. Vos perdiste el tuyo.'
    ],
    validacion: [
      'No es débil necesitar parar. Es sabio.',
      'El equilibrio no es aburrido. Es necesario para no romperse.'
    ],
    solucion: 'RESTAURA el equilibrio natural, ARMONIZA los ritmos, CENTRA la energía',
    accion: 'restaura tu equilibrio natural',
    urgencia: 'Lo que vive desbalanceado se rompe. Es hora de equilibrar.',
    noUsar: ['acelerar', 'correr', 'forzar', 'exigir'],
    keywords: ['equilibrio', 'balance', 'armonía', 'ritmo', 'centro', 'paz']
  }
};

/**
 * Genera instrucciones completas para el prompt basadas en la especialización
 */
export const getInstruccionesEspecializacion = (especializacionId) => {
  const esp = especializaciones[especializacionId];

  if (!esp) {
    return null;
  }

  return `
## ESPECIALIZACIÓN: ${esp.nombre.toUpperCase()}

### EL DOLOR DE QUIEN BUSCA ESTO:
${esp.dolor.map(d => `- ${d}`).join('\n')}

### FRASES DE ESPEJO (elegí una para empezar):
${esp.espejo.map(e => `- "${e}"`).join('\n')}

### VALIDACIÓN (usá alguna):
${esp.validacion.map(v => `- "${v}"`).join('\n')}

### QUÉ HACE EL GUARDIÁN:
${esp.solucion}
El guardián ${esp.accion.toUpperCase()} - no "enseña", no "ayuda a descubrir". HACE.

### URGENCIA:
${esp.urgencia}

### PALABRAS/CONCEPTOS PROHIBIDOS (no aplican a esta especialización):
${esp.noUsar.join(', ')}

IMPORTANTE: Toda la historia debe girar en torno a este dolor específico y esta solución específica. NO uses dolores de otras especializaciones.
`;
};

/**
 * Detecta especialización por keywords
 */
export const detectarEspecializacionPorKeywords = (texto) => {
  const textoLower = texto.toLowerCase();

  for (const [id, esp] of Object.entries(especializaciones)) {
    for (const keyword of esp.keywords || []) {
      if (textoLower.includes(keyword.toLowerCase())) {
        return id;
      }
    }
  }

  return null;
};

/**
 * Obtiene todas las especializaciones disponibles
 */
export const getEspecializacionesDisponibles = () => {
  return Object.entries(especializaciones).map(([id, esp]) => ({
    id,
    nombre: esp.nombre,
    accion: esp.accion
  }));
};

export default especializaciones;
