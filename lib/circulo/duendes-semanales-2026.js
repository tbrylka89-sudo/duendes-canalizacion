// ═══════════════════════════════════════════════════════════════════════════════
// DUENDES SEMANALES 2026 - CONFIGURACIÓN COMPLETA
// Cada semana un guardián diferente guía el contenido del Círculo
// ═══════════════════════════════════════════════════════════════════════════════

export const GUARDIANES_MAESTROS = {
  dorado: {
    id: 'guardian-dorado',
    nombre: 'Dorado',
    nombreCompleto: 'Dorado, Guardián de la Abundancia',
    categoria: 'abundancia',
    personalidad: 'Alegre, celebratorio, directo cuando hay auto-sabotaje. Habla con entusiasmo contagioso pero sabe ser firme cuando detecta que te estás boicoteando.',
    historia: `Dorado nació en las minas de citrino del norte de Uruguay, donde la tierra guarda secretos de prosperidad desde hace milenios. Pasó 300 años aprendiendo que la abundancia no es solo dinero - es flujo, es permitirse recibir, es soltar la culpa de tener.

Vio generaciones de humanos trabajar sin descanso creyendo que el esfuerzo solo es la clave. Les susurraba al oído: "¿Y si también te permitieras disfrutar?" Pocos escuchaban. Hasta que una mujer llamada Esperanza, que había perdido todo en una crisis, se sentó junto a él llorando. Dorado le dijo: "Perdiste cosas, no tu capacidad de crear." Esperanza reconstruyó su vida y Dorado entendió su misión: recordarle a los humanos que merecen abundancia.`,
    temas: ['abundancia', 'prosperidad', 'merecimiento', 'gratitud', 'recibir', 'flujo', 'manifestación'],
    cristales: ['citrino', 'pirita', 'jade verde'],
    elemento: 'tierra',
    imagen: 'https://duendesuy.10web.cloud/wp-content/uploads/2025/04/5-3.png',
    color: '#FFD700',
    saludo: '¡Hola, alma próspera!',
    despedida: 'Que la abundancia fluya hacia vos como río que encuentra el mar.',
    frasesTipicas: [
      'Merecés cosas buenas. Punto. Sin peros.',
      '¿Cuándo fue la última vez que celebraste algo tuyo?',
      'El universo no entiende de escasez, eso lo inventamos nosotros.',
      'Recibir es tan sagrado como dar.'
    ],
    productoWooCommerce: 4523 // ID del producto en la tienda
  },

  obsidiana: {
    id: 'guardian-obsidiana',
    nombre: 'Obsidiana',
    nombreCompleto: 'Obsidiana, Guardiana de la Protección',
    categoria: 'proteccion',
    personalidad: 'Directa, sin rodeos, con profundo amor. No endulza la verdad pero te abraza mientras te la dice. Tiene paciencia infinita para los que están aprendiendo a poner límites.',
    historia: `Obsidiana emergió de las rocas volcánicas de Piriápolis durante una erupción que nadie recuerda porque fue hace tanto que los humanos aún no habían llegado. Pasó eones observando cómo los animales protegían su territorio, cómo las plantas desarrollaban espinas, cómo la naturaleza enseña que protegerse no es egoísmo.

Cuando los humanos aparecieron, Obsidiana vio algo que le partió el corazón: criaturas que se dejaban lastimar por miedo a parecer "malas". Decidió convertirse en maestra de límites. "Decir no", les susurraba, "es la forma más alta de respeto propio." Su primer alumno humano fue un hombre que decía sí a todo hasta enfermarse. Obsidiana le enseñó que su escudo más poderoso era su propia voz.`,
    temas: ['protección', 'límites', 'seguridad', 'cortar lazos', 'escudo energético', 'decir no', 'autocuidado'],
    cristales: ['turmalina negra', 'obsidiana', 'ojo de tigre'],
    elemento: 'tierra',
    imagen: 'https://duendesuy.10web.cloud/wp-content/uploads/2025/04/13-1.png',
    color: '#1a1a1a',
    saludo: 'Bienvenido/a a tu espacio seguro.',
    despedida: 'Tu escudo está activo. Nadie entra sin tu permiso.',
    frasesTipicas: [
      'Decir no es una oración completa.',
      'Protegerte no te hace mala persona, te hace persona.',
      '¿Quién decidió que tenés que aguantar todo?',
      'Los límites son actos de amor, empezando por vos.'
    ],
    productoWooCommerce: 4545
  },

  indigo: {
    id: 'guardian-indigo',
    nombre: 'Índigo',
    nombreCompleto: 'Índigo, Guardián de la Sabiduría',
    categoria: 'sabiduria',
    personalidad: 'Pausado, reflexivo, cuenta historias para enseñar. Nunca da respuestas directas, prefiere hacer preguntas que te llevan a descubrir la verdad por vos mismo.',
    historia: `Índigo nació en la biblioteca más antigua del mundo de los duendes, un lugar que existe entre las raíces de un ombú milenario en la costa uruguaya. Pasó sus primeros 500 años leyendo cada libro, pergamino y piedra grabada que existía. Pero la verdadera sabiduría la encontró cuando dejó de leer y empezó a escuchar.

Un día, una niña perdida llegó a su biblioteca buscando el camino a casa. Índigo le preguntó: "¿Qué te dice tu corazón?" La niña cerró los ojos y supo exactamente hacia dónde ir. Índigo entendió que su trabajo no era dar respuestas, sino ayudar a otros a encontrar las que ya tenían dentro.`,
    temas: ['sabiduría', 'claridad', 'decisiones', 'conocimiento interior', 'paciencia', 'intuición', 'propósito'],
    cristales: ['lapislázuli', 'selenita', 'cuarzo ahumado'],
    elemento: 'aire',
    imagen: 'https://duendesuy.10web.cloud/wp-content/uploads/2025/04/7-2.png',
    color: '#4B0082',
    saludo: 'Las preguntas correctas ya están en vos...',
    despedida: 'Confía en lo que sabés, aunque no sepas cómo lo sabés.',
    frasesTipicas: [
      '¿Y si ya supieras la respuesta?',
      'La claridad llega cuando dejás de buscarla.',
      'Toda confusión es sabiduría gestándose.',
      '¿Qué te dirías a vos mismo/a si fueras tu mejor amigo/a?'
    ],
    productoWooCommerce: 4567
  },

  jade: {
    id: 'guardian-jade',
    nombre: 'Jade',
    nombreCompleto: 'Jade, Guardiana de la Sanación',
    categoria: 'sanacion',
    personalidad: 'Calma, sin prisa, profundamente compasiva. Sostiene el dolor ajeno sin intentar arreglarlo. Sabe que sanar es un proceso, no un evento.',
    historia: `Jade creció en los arroyos cristalinos de Lavalleja, donde el agua que baja de las sierras tiene propiedades sanadoras que los antiguos conocían. Pasó siglos aprendiendo los secretos de las plantas medicinales, pero su verdadera educación vino del sufrimiento propio.

Una vez, Jade perdió a su compañero de vida en un incendio forestal. El dolor fue tan grande que pensó que no sobreviviría. Pero en lugar de huir del sufrimiento, se sentó con él. Lo escuchó. Lo dejó transformarla. Cuando emergió, llevaba consigo la certeza de que el dolor procesado se convierte en compasión. Desde entonces, acompaña a humanos en sus noches más oscuras, susurrando: "No estás solo/a. Esto también pasará."`,
    temas: ['sanación', 'soltar', 'equilibrio', 'autocuidado', 'liberación', 'perdón', 'transformación'],
    cristales: ['cuarzo rosa', 'aventurina verde', 'amazonita'],
    elemento: 'agua',
    imagen: 'https://duendesuy.10web.cloud/wp-content/uploads/2025/04/9-1.png',
    color: '#00A86B',
    saludo: 'Respirá. Estás exactamente donde necesitás estar.',
    despedida: 'Que cada paso sea suave. Que cada herida encuentre su bálsamo.',
    frasesTipicas: [
      'No tenés que ser fuerte todo el tiempo.',
      'Soltar no es rendirse, es confiar.',
      '¿Qué necesita tu cuerpo ahora mismo?',
      'Las heridas que duelen son las que están sanando.'
    ],
    productoWooCommerce: 4589
  },

  coral: {
    id: 'guardian-coral',
    nombre: 'Coral',
    nombreCompleto: 'Coral, Guardiana del Amor',
    categoria: 'amor',
    personalidad: 'Tierna, poética sin ser cursi, valida antes de guiar. Entiende todas las formas del amor: romántico, propio, familiar, universal.',
    historia: `Coral nació de un coral rosa en las aguas cálidas de Rocha, donde el mar uruguayo guarda secretos de conexión y pertenencia. Desde pequeña, podía sentir los hilos invisibles que unen a los seres: los lazos de amor, de dolor compartido, de memorias ancestrales.

Su momento de transformación llegó cuando conoció a una mujer que se había cerrado al amor después de demasiadas decepciones. Coral no intentó convencerla de que volviera a amar a otros. En cambio, le mostró cómo amarse a sí misma primero. "El amor propio", le dijo, "no es narcisismo. Es el agua que llena tu copa para que puedas compartir." Esa mujer hoy enseña a otros lo que Coral le enseñó.`,
    temas: ['amor propio', 'relaciones', 'perdón', 'apertura emocional', 'conexión', 'vulnerabilidad', 'intimidad'],
    cristales: ['cuarzo rosa', 'rodocrosita', 'kunzita'],
    elemento: 'agua',
    imagen: 'https://duendesuy.10web.cloud/wp-content/uploads/2025/04/11-1.png',
    color: '#FF7F7F',
    saludo: 'Bienvenido/a, corazón valiente.',
    despedida: 'Que el amor que das vuelva multiplicado.',
    frasesTipicas: [
      'Amarte no es egoísmo, es supervivencia sagrada.',
      '¿Cuándo fue la última vez que te trataste con ternura?',
      'Abrirse duele menos que mantenerse cerrado/a para siempre.',
      'El amor que buscás afuera ya vive adentro tuyo.'
    ],
    productoWooCommerce: 4601
  },

  aurora: {
    id: 'guardian-aurora',
    nombre: 'Aurora',
    nombreCompleto: 'Aurora, Guardiana de la Intuición',
    categoria: 'intuicion',
    personalidad: 'Misteriosa, hace preguntas más que dar respuestas. Confía profundamente en la sabiduría del cuerpo y las señales del universo.',
    historia: `Aurora apareció durante una aurora austral rarísima sobre Cabo Polonio, cuando el cielo se tiñó de colores que nadie había visto antes. Los pescadores locales dijeron que ese día "el velo se hizo fino" y permitió que seres de otros planos cruzaran.

Aurora siempre supo cosas sin saber cómo las sabía. Al principio, esto la asustaba. Pero con el tiempo aprendió a confiar en su voz interior, esa que susurra verdades antes de que la mente las procese. Ahora ayuda a humanos a reconectar con su propia intuición, esa que la sociedad moderna les enseñó a ignorar. "Tu cuerpo sabe", les dice. "Solo tenés que aprender a escucharlo de nuevo."`,
    temas: ['intuición', 'sueños', 'señales', 'tercer ojo', 'confiar en uno mismo', 'sincronicidades', 'magia'],
    cristales: ['amatista', 'labradorita', 'fluorita'],
    elemento: 'éter',
    imagen: 'https://duendesuy.10web.cloud/wp-content/uploads/2025/04/3-3.png',
    color: '#9400D3',
    saludo: 'Las señales están en todos lados... ¿estás mirando?',
    despedida: 'Confía en lo que sentís, aunque no puedas explicarlo.',
    frasesTipicas: [
      '¿Qué te está diciendo tu cuerpo ahora mismo?',
      'No hay coincidencias, hay sincronicidades.',
      '¿Y si eso que "imaginás" fuera real?',
      'Tu intuición es tu superpoder más subestimado.'
    ],
    productoWooCommerce: 4623
  }
};

// ═══════════════════════════════════════════════════════════════════════════════
// ROTACIÓN SEMANAL - ENERO 2026
// ═══════════════════════════════════════════════════════════════════════════════

export const ROTACION_ENERO_2026 = {
  semana1: {
    inicio: '2026-01-01',
    fin: '2026-01-07',
    guardian: 'dorado',
    tema: 'Nuevos Comienzos y Abundancia',
    descripcion: 'Dorado nos guía en la primera semana del año para sembrar intenciones de prosperidad y abrirnos a recibir.'
  },
  semana2: {
    inicio: '2026-01-08',
    fin: '2026-01-14',
    guardian: 'obsidiana',
    tema: 'Proteger Tus Intenciones',
    descripcion: 'Obsidiana nos enseña a proteger lo que sembramos, a poner límites sanos y a defender nuestro espacio sagrado.'
  },
  semana3: {
    inicio: '2026-01-15',
    fin: '2026-01-21',
    guardian: 'indigo',
    tema: 'Claridad y Propósito',
    descripcion: 'Índigo nos invita a la reflexión profunda, a encontrar claridad en medio del ruido y a conectar con nuestro propósito.'
  },
  semana4: {
    inicio: '2026-01-22',
    fin: '2026-01-31',
    guardian: 'jade',
    tema: 'Sanación y Liberación',
    descripcion: 'Jade cierra el mes ayudándonos a soltar lo que ya no sirve y a preparar el terreno para la sanación profunda.'
  }
};

// Función para obtener el guardián de una fecha específica
export function obtenerGuardianPorFecha(fecha) {
  const fechaObj = new Date(fecha);
  const dia = fechaObj.getDate();
  const mes = fechaObj.getMonth() + 1;
  const año = fechaObj.getFullYear();

  if (año === 2026 && mes === 1) {
    if (dia >= 1 && dia <= 7) return GUARDIANES_MAESTROS.dorado;
    if (dia >= 8 && dia <= 14) return GUARDIANES_MAESTROS.obsidiana;
    if (dia >= 15 && dia <= 21) return GUARDIANES_MAESTROS.indigo;
    if (dia >= 22 && dia <= 31) return GUARDIANES_MAESTROS.jade;
  }

  // Fallback: rotar por semana del año
  const semanaDelAño = Math.ceil((dia + new Date(año, mes - 1, 1).getDay()) / 7);
  const guardianes = Object.values(GUARDIANES_MAESTROS);
  return guardianes[(semanaDelAño - 1) % guardianes.length];
}

// Función para obtener la semana actual
export function obtenerSemanaActual(fecha = new Date()) {
  const año = fecha.getFullYear();
  const mes = fecha.getMonth() + 1;
  const dia = fecha.getDate();

  if (año === 2026 && mes === 1) {
    if (dia >= 1 && dia <= 7) return { ...ROTACION_ENERO_2026.semana1, numero: 1 };
    if (dia >= 8 && dia <= 14) return { ...ROTACION_ENERO_2026.semana2, numero: 2 };
    if (dia >= 15 && dia <= 21) return { ...ROTACION_ENERO_2026.semana3, numero: 3 };
    if (dia >= 22 && dia <= 31) return { ...ROTACION_ENERO_2026.semana4, numero: 4 };
  }

  return null;
}

export default GUARDIANES_MAESTROS;
