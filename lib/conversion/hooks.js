/**
 * BIBLIOTECA DE HOOKS DE CONVERSIÓN
 *
 * Hooks que abren la historia con impacto emocional.
 * Cada uno está diseñado para que el lector piense "esto habla de mí".
 *
 * Categorías: proteccion, abundancia, amor, sanacion, sabiduria
 */

// SUBCATEGORÍAS PARA DISTRIBUCIÓN AUTOMÁTICA EN BATCH
export const subcategorias = {
  amor: [
    { id: 'amor_propio', nombre: 'Amor propio', hooks: ['amor_propio'] },
    { id: 'amor_pareja', nombre: 'Amor de pareja', hooks: ['amor_pareja'] },
    { id: 'amor_familia', nombre: 'Amor de familia', hooks: ['amor_familia'] },
    { id: 'fertilidad', nombre: 'Fertilidad / Maternidad', hooks: ['fertilidad'] },
    { id: 'encontrar_amor', nombre: 'Encontrar al indicado/a', hooks: ['encontrar_amor'] }
  ],
  proteccion: [
    { id: 'proteccion_energetica', nombre: 'Protección energética', hooks: ['proteccion_energia'] },
    { id: 'proteccion_hogar', nombre: 'Protección del hogar', hooks: ['proteccion_hogar'] },
    { id: 'proteccion_emocional', nombre: 'Protección emocional', hooks: ['proteccion_emocional'] },
    { id: 'cortar_lazos', nombre: 'Cortar lazos tóxicos', hooks: ['cortar_lazos'] },
    { id: 'limites', nombre: 'Poner límites', hooks: ['limites'] }
  ],
  abundancia: [
    { id: 'dinero', nombre: 'Dinero / Prosperidad', hooks: ['dinero'] },
    { id: 'trabajo', nombre: 'Trabajo / Oportunidades', hooks: ['trabajo'] },
    { id: 'desbloqueo', nombre: 'Desbloqueo financiero', hooks: ['desbloqueo'] },
    { id: 'merecimiento', nombre: 'Merecimiento', hooks: ['merecimiento'] },
    { id: 'suerte', nombre: 'Suerte / Fortuna', hooks: ['fortuna'] }
  ],
  sanacion: [
    { id: 'sanacion_emocional', nombre: 'Sanación emocional', hooks: ['sanacion_emocional'] },
    { id: 'duelo', nombre: 'Procesar duelo', hooks: ['duelo'] },
    { id: 'trauma', nombre: 'Sanar trauma', hooks: ['trauma'] },
    { id: 'perdon', nombre: 'Perdón / Soltar', hooks: ['perdon'] },
    { id: 'cuerpo', nombre: 'Sanación del cuerpo', hooks: ['cuerpo'] }
  ],
  sabiduria: [
    { id: 'intuicion', nombre: 'Intuición', hooks: ['intuicion'] },
    { id: 'claridad', nombre: 'Claridad mental', hooks: ['claridad'] },
    { id: 'decisiones', nombre: 'Tomar decisiones', hooks: ['decisiones'] },
    { id: 'proposito', nombre: 'Encontrar propósito', hooks: ['proposito'] },
    { id: 'creatividad', nombre: 'Creatividad', hooks: ['creatividad'] }
  ],
  viajeros: [
    { id: 'viajero', nombre: 'Viajero - Cambio de Rumbo', hooks: ['viajero'] },
    { id: 'viajero_aventura', nombre: 'Aventura', hooks: ['viajero_aventura'] },
    { id: 'viajero_sabiduria', nombre: 'Sabiduría Viajera', hooks: ['viajero_sabiduria'] },
    { id: 'viajero_reinvencion', nombre: 'Reinvención', hooks: ['viajero_reinvencion'] },
    { id: 'viajero_horizontes', nombre: 'Nuevos Horizontes', hooks: ['viajero_horizontes'] },
    { id: 'viajero_despegue', nombre: 'Despegue', hooks: ['viajero_despegue'] }
  ],
  naturaleza: [
    { id: 'bosque', nombre: 'Bosque / Naturaleza', hooks: ['bosque'] },
    { id: 'bosque_sanacion', nombre: 'Sanación Natural', hooks: ['bosque_sanacion'] },
    { id: 'bosque_raices', nombre: 'Raíces Ancestrales', hooks: ['bosque_raices'] },
    { id: 'bosque_micelios', nombre: 'Micelios / Conexión', hooks: ['bosque_micelios'] },
    { id: 'bosque_hierbas', nombre: 'Hierbas / Yuyos', hooks: ['bosque_hierbas'] },
    { id: 'bosque_hongos', nombre: 'Hongos / Transformación', hooks: ['bosque_hongos'] },
    { id: 'bosque_equilibrio', nombre: 'Equilibrio Natural', hooks: ['bosque_equilibrio'] }
  ],
  calma: [
    { id: 'calma', nombre: 'Paz y Serenidad', hooks: ['calma'] },
    { id: 'ansiedad', nombre: 'Manejar Ansiedad', hooks: ['ansiedad'] },
    { id: 'insomnio', nombre: 'Descanso / Sueño', hooks: ['insomnio'] },
    { id: 'meditacion', nombre: 'Meditación', hooks: ['meditacion'] }
  ],
  transformacion: [
    { id: 'transformacion', nombre: 'Transformación Personal', hooks: ['transformacion'] },
    { id: 'nuevos_comienzos', nombre: 'Nuevos Comienzos', hooks: ['nuevos_comienzos'] },
    { id: 'separacion', nombre: 'Cierre de Ciclos', hooks: ['separacion'] },
    { id: 'miedos', nombre: 'Superar Miedos', hooks: ['miedos'] }
  ],
  alegria: [
    { id: 'alegria', nombre: 'Alegría Genuina', hooks: ['alegria'] },
    { id: 'gratitud', nombre: 'Gratitud', hooks: ['gratitud'] },
    { id: 'confianza', nombre: 'Confianza Interior', hooks: ['confianza'] }
  ]
};

// Función para obtener subcategoría rotando (para batch)
export const getSubcategoriaRotada = (categoriaMain, indice) => {
  const catLower = (categoriaMain || 'proteccion').toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  // Mapear a categoría principal
  const mapeoMain = {
    'amor': 'amor', 'amor_romantico': 'amor', 'romantico': 'amor', 'love': 'amor', 'amor_propio': 'amor',
    'proteccion': 'proteccion', 'protection': 'proteccion',
    'abundancia': 'abundancia', 'abundance': 'abundancia', 'prosperidad': 'abundancia',
    'sanacion': 'sanacion', 'healing': 'sanacion',
    'sabiduria': 'sabiduria', 'wisdom': 'sabiduria',
    'viajeros': 'viajeros', 'viajero': 'viajeros', 'mochila': 'viajeros', 'camino': 'viajeros',
    'naturaleza': 'naturaleza', 'bosque': 'naturaleza', 'hongos': 'naturaleza', 'micelio': 'naturaleza',
    'calma': 'calma', 'paz': 'calma', 'serenidad': 'calma', 'ansiedad': 'calma',
    'transformacion': 'transformacion', 'cambio': 'transformacion', 'metamorfosis': 'transformacion',
    'alegria': 'alegria', 'felicidad': 'alegria', 'risa': 'alegria',
    'fortuna': 'fortuna', 'suerte': 'fortuna'
  };

  const catKey = mapeoMain[catLower] || 'proteccion';
  const subs = subcategorias[catKey];

  if (!subs || subs.length === 0) return null;

  // Rotar según índice
  return subs[indice % subs.length];
};

// HOOKS POR SUBCATEGORÍA (más específicos)
export const hooksEspecificos = {
  // AMOR
  amor_propio: [
    "Amás a todos menos a vos.",
    "El amor propio no es egoísmo. Es supervivencia.",
    "El amor que merecés empieza por el que te negás.",
    "Elegiste a otros tantas veces. ¿Cuándo te vas a elegir a vos?"
  ],
  amor_pareja: [
    "El amor no debería doler. Pero el tuyo siempre duele.",
    "Hay patrones que repetís sin darte cuenta. Siempre el mismo tipo de persona.",
    "¿Cuántas veces confundiste intensidad con amor?",
    "Lo que tolerás, lo repetís."
  ],
  amor_familia: [
    "La familia que te tocó no siempre es la que merecés.",
    "Hay heridas que solo la familia sabe hacer.",
    "El perdón no significa volver. Significa soltar.",
    "La sangre no hace familia. Las acciones sí."
  ],
  fertilidad: [
    "Hay deseos que no se cuentan porque duelen demasiado.",
    "El cuerpo guarda lo que la mente no procesa.",
    "A veces lo que más querés es lo que más te cuesta.",
    "Hay una espera que nadie entiende si no la vivió."
  ],
  encontrar_amor: [
    "El amor de tu vida no va a aparecer si no dejás ir al que no es.",
    "No es que no haya nadie. Es que seguís buscando donde no está.",
    "A veces el amor llega cuando dejás de perseguirlo.",
    "Hay personas que buscan afuera lo que nunca se dieron adentro."
  ],
  // PROTECCIÓN
  proteccion_energia: [
    "Hay quienes sienten todo. Incluso lo que no es suyo.",
    "Algunas personas absorben todo lo que las rodea sin darse cuenta.",
    "Tu energía no es infinita. Y algunos te la drenan.",
    "Sentís el ambiente apenas entrás a un lugar."
  ],
  proteccion_hogar: [
    "El hogar debería ser refugio. Pero el tuyo no siempre lo es.",
    "Hay espacios que pesan. Y el tuyo es uno.",
    "La energía del lugar donde vivís te afecta más de lo que creés.",
    "Un hogar limpio no es solo cuestión de orden."
  ],
  proteccion_emocional: [
    "Hay personas que cargan con todo y no piden nada.",
    "Cuidar a todos te dejó sin nadie que te cuide a vos.",
    "Ser fuerte todo el tiempo tiene un precio.",
    "Los que más dan son los que menos piden."
  ],
  cortar_lazos: [
    "Hay personas que ya no deberían tener lugar en tu vida.",
    "Soltar no es abandonar. Es liberarte.",
    "El cordón que te ata a ciertas personas no es amor. Es costumbre.",
    "Hay relaciones que terminaron hace años pero vos seguís ahí."
  ],
  limites: [
    "¿Cuántas veces dijiste que sí cuando querías decir que no?",
    "Decir que no no te hace mala persona. Te hace sana.",
    "Los límites que no ponés, otros los cruzan.",
    "Agradar a todos es la forma más segura de perderte a vos misma."
  ],
  // ABUNDANCIA
  dinero: [
    "El dinero no es malo. Lo que te enseñaron sobre él, sí.",
    "Tu mamá tenía miedo al dinero. ¿Y vos?",
    "Hay un techo invisible que vos misma construiste.",
    "No es falta de oportunidades. Es exceso de autosabotaje."
  ],
  trabajo: [
    "Hay personas que trabajan el doble y ganan la mitad.",
    "¿Cuántas veces dejaste pasar oportunidades por no sentirte lista?",
    "El trabajo ideal no aparece. Se construye.",
    "Esperás el momento perfecto. No existe."
  ],
  desbloqueo: [
    "El bloqueo no está en el mundo. Está en lo que creés sobre vos.",
    "Lo que rechazás, te rechaza.",
    "Pediste permiso toda tu vida. ¿A quién?",
    "Hay creencias que heredaste y no te sirven."
  ],
  merecimiento: [
    "Merecer no se negocia. Se decide.",
    "No tenés que ganarte el derecho a recibir.",
    "¿Por qué otros sí y vos no?",
    "El merecimiento no se demuestra. Se asume."
  ],

  // === SANACIÓN ESPECÍFICA ===
  sanacion_emocional: [
    "Hay heridas que no sangran pero duelen todos los días.",
    "Lo que no perdonaste te sigue pesando.",
    "El dolor que ignorás no desaparece. Se transforma.",
    "Sanar no es volver a ser quien eras. Es permitirte ser quien podés ser."
  ],
  duelos: [
    "Hay duelos que nunca hiciste.",
    "Despedirse no es olvidar. Es honrar.",
    "El vacío que dejó esa persona no se llena. Se aprende a vivir con él.",
    "No tenés que superarlo. Tenés que atravesarlo."
  ],
  traumas: [
    "Hay partes tuyas que dejaste atrás hace mucho.",
    "El cuerpo recuerda lo que la mente eligió olvidar.",
    "No es tu culpa. Nunca lo fue.",
    "Sanar no es olvidar. Es dejar de sangrar cada vez que recordás."
  ],
  ansiedad: [
    "El pecho apretado no miente. Algo está pasando.",
    "Vivís en modo alerta permanente. Y eso agota.",
    "El futuro te roba el presente. Todos los días.",
    "No es nervios. Es tu cuerpo gritando lo que tu mente calla."
  ],
  patrones: [
    "¿Cuántas veces te juraste que esta vez iba a ser diferente?",
    "Hay ciclos que se repiten hasta que los ves.",
    "No es mala suerte. Es un patrón que no reconocés.",
    "El patrón que no se ve, se repite."
  ],

  // === TRABAJO Y DINERO ESPECÍFICO ===
  negocios: [
    "Tu negocio es tu sueño. Pero también tu carga.",
    "Hay días en que querés tirar todo y empezar de nuevo.",
    "El emprendedor que no descansa, se quiebra.",
    "No todo se resuelve trabajando más."
  ],
  emprendimiento: [
    "Arrancar algo propio es saltar sin red.",
    "El miedo a fracasar te tiene paralizada.",
    "Nadie te dijo que iba a ser tan solo.",
    "El emprendedor necesita fe. Y a veces se acaba."
  ],
  buscar_trabajo: [
    "Cada NO pesa más que el anterior.",
    "¿Cuántos currículums sin respuesta?",
    "No es que no valés. Es que el sistema no te ve.",
    "Buscar trabajo es un trabajo en sí mismo."
  ],
  deudas: [
    "Las deudas no son solo de plata. Son de energía.",
    "Hay un peso que no te deja dormir.",
    "Salir del pozo se siente imposible cuando estás adentro.",
    "La deuda te persigue. Pero no te define."
  ],

  // === BIENESTAR ESPECÍFICO ===
  calma: [
    "La paz no es ausencia de problemas. Es saber que podés con ellos.",
    "¿Cuándo fue la última vez que respiraste de verdad?",
    "La mente ruidosa no descansa nunca.",
    "La calma que buscás no está afuera."
  ],
  insomnio: [
    "Las 3 AM te conocen demasiado bien.",
    "El cuerpo pide descanso. La mente no lo permite.",
    "¿Cuántas noches sin dormir de verdad?",
    "Hay pensamientos que solo aparecen de noche."
  ],
  energia: [
    "Estás cansada de estar cansada.",
    "No es sueño. Es algo más profundo.",
    "La energía que das no vuelve.",
    "Hay días en que levantarte ya es un logro."
  ],
  confianza: [
    "Dudás de vos más de lo que deberías.",
    "La voz que más te critica es la tuya.",
    "¿Cuándo dejaste de creer en vos?",
    "La confianza que buscás en otros, te la debés a vos."
  ],

  // === ESTUDIO Y MENTE ===
  estudio: [
    "La mente se dispersa cuando más la necesitás.",
    "¿Cuántas veces leíste lo mismo sin entender?",
    "El conocimiento está. La concentración no.",
    "Estudiar se volvió una batalla contigo misma."
  ],
  examenes: [
    "Los nervios te traicionan cuando más los necesitás controlados.",
    "Sabés más de lo que el examen va a mostrar.",
    "El miedo a fallar te paraliza antes de empezar.",
    "No es falta de estudio. Es exceso de presión."
  ],
  intuicion: [
    "Sabés cosas que no sabés cómo sabés.",
    "¿Cuántas veces supiste algo y no le hiciste caso?",
    "La intuición habla. El ruido no te deja escucharla.",
    "Tu cuerpo sabe antes que tu mente."
  ],
  claridad: [
    "Hay días en que todo es niebla.",
    "Las decisiones se sienten imposibles.",
    "Buscás claridad afuera cuando está adentro.",
    "La confusión protege. Pero también paraliza."
  ],

  // === CAMBIOS Y ETAPAS ===
  transformacion: [
    "Algo en vos está muriendo. Y eso asusta.",
    "El cambio que necesitás te da miedo.",
    "Ya no sos quien eras. Pero tampoco sabés quién estás siendo.",
    "Transformarse duele. Pero quedarse igual duele más."
  ],
  nuevos_comienzos: [
    "Empezar de nuevo no es fracasar. Es elegirte.",
    "El miedo a lo nuevo te tiene atada a lo viejo.",
    "Hay páginas que se cierran solas. Y otras que tenés que cerrar vos.",
    "El comienzo que buscás está esperando que sueltes el final."
  ],
  separacion: [
    "Terminar algo no significa que fracasaste.",
    "El vacío que dejó esa persona duele. Pero no te mata.",
    "Soltar no es perder. Es liberar espacio.",
    "La separación que más cuesta es la de quien creías ser."
  ],
  miedos: [
    "El miedo que no enfrentás crece.",
    "¿Cuántas cosas dejaste de hacer por miedo?",
    "El miedo protege. Pero también encarcela.",
    "Lo que más temés probablemente ya pasó."
  ],

  // === ESPIRITUAL ===
  conexion_espiritual: [
    "Hay algo más grande que vos. Y lo sentís.",
    "La conexión que buscás no está en rituales. Está en vos.",
    "El vacío espiritual duele aunque no tenga nombre.",
    "Buscás respuestas que ningún libro te va a dar."
  ],
  proposito: [
    "¿Para qué estás acá? La pregunta que no te deja en paz.",
    "Hay días en que todo se siente vacío de sentido.",
    "El propósito no se encuentra. Se construye.",
    "Sentís que estás para algo más. Pero no sabés qué."
  ],
  gratitud: [
    "Agradecer cuando todo duele es un acto de fe.",
    "Hay bendiciones que no ves porque esperás otras.",
    "La gratitud no es negar el dolor. Es ver lo que el dolor no te deja ver.",
    "Lo que tenés hoy, alguna vez fue tu mayor deseo."
  ],

  // === PROTECCIÓN ESPECÍFICA ===
  proteccion_ninos: [
    "Proteger a tus hijos te quita el sueño.",
    "El mundo se siente demasiado peligroso para ellos.",
    "No podés estar siempre. Y eso te angustia.",
    "Querés cubrirlos de todo. Pero sabés que no podés."
  ],
  envidias: [
    "Hay miradas que pesan aunque no las veas.",
    "No todos se alegran de tu bien.",
    "La envidia ajena te afecta más de lo que admitís.",
    "Hay energías que te rodean y no son buenas."
  ],
  vigilante: [
    "Vivís en guardia permanente.",
    "Alguien tiene que cuidar. Y siempre sos vos.",
    "Los ojos abiertos, siempre. Incluso cuando dormís.",
    "Ser el guardián de todos es agotador."
  ],

  // === AMOR ESPECÍFICO ===
  maternidad: [
    "Ser madre no te prepara para la soledad de la maternidad.",
    "Nadie te dijo que iba a ser tan duro.",
    "Amás tanto que a veces te olvidas de vos.",
    "La madre perfecta no existe. Pero vos seguís intentando serla."
  ],
  soledad: [
    "Podés estar rodeada de gente y sentirte sola.",
    "La soledad que sentís no es falta de gente. Es falta de conexión.",
    "Hay un vacío que ninguna persona llenó.",
    "Estar sola y sentirse sola son cosas distintas. Vos conocés las dos."
  ],
  reconciliacion: [
    "Hay puentes que se quemaron. Pero las cenizas aún duelen.",
    "Perdonar no es olvidar. Es soltar el veneno.",
    "La reconciliación más difícil es contigo misma.",
    "Hay conversaciones pendientes que te pesan."
  ],

  // === VIAJEROS ===
  viajero: [
    "Hay personas que viven la misma vida todos los días esperando que algo cambie.",
    "¿Cuántas veces soñaste con dejarlo todo y empezar de nuevo?",
    "La zona de confort se convirtió en tu prisión.",
    "Mirás el horizonte y sentís que hay algo llamándote.",
    "La rutina te está asfixiando y lo sabés."
  ],
  viajero_aventura: [
    "Hay personas que miran mapas pero nunca viajan.",
    "¿Cuántas veces dijiste 'algún día' y ese día nunca llegó?",
    "La vida te está pasando mientras vos la mirás desde la ventana.",
    "El miedo a lo desconocido te tiene atada a lo que ya no querés."
  ],
  viajero_sabiduria: [
    "Hay personas que creen conocer el mundo sin haberlo recorrido.",
    "¿Cuánto de lo que creés saber viene de experiencia real?",
    "La sabiduría no está en los libros. Está en los caminos.",
    "Vivís en tu burbuja y el mundo es más grande que eso."
  ],
  viajero_reinvencion: [
    "Hay personas que cargan una versión vieja de sí mismas.",
    "¿Cuánto de lo que hacés es porque querés y cuánto por inercia?",
    "La persona que eras ya no te representa. Pero seguís actuando como ella.",
    "Reinventarse no es traicionar quien fuiste. Es honrar quien podés ser."
  ],
  viajero_horizontes: [
    "Tu mundo se volvió chico y vos lo sabés.",
    "¿Cuándo fue la última vez que hiciste algo por primera vez?",
    "Hay más. Siempre hay más. Pero tenés que salir a buscarlo.",
    "Los límites que tenés los pusiste vos. Y los podés mover."
  ],
  viajero_despegue: [
    "Hay personas que tienen las alas listas pero no despegan.",
    "¿Qué te ata que ya no debería atarte?",
    "Estás lista para irte pero algo te retiene.",
    "A veces hay que soltar para poder volar."
  ],

  // === BOSQUE / NATURALEZA ===
  bosque: [
    "Hay personas que olvidaron que vienen de la tierra.",
    "¿Cuándo fue la última vez que caminaste descalza sobre el pasto?",
    "La naturaleza te llama pero el cemento te atrapa.",
    "Los micelios conectan todo en el bosque. Vos estás desconectada de todo.",
    "La vida moderna te alejó de tu esencia."
  ],
  bosque_sanacion: [
    "Tu cuerpo pide sanarse de forma natural.",
    "Hay remedios que ninguna farmacia vende.",
    "La tierra tiene lo que tu cuerpo busca.",
    "La sanación más profunda viene de la naturaleza."
  ],
  bosque_raices: [
    "¿Conocés las historias de tus abuelos? ¿De sus abuelos?",
    "Sin raíces, cualquier viento te tumba.",
    "Hay una fuerza en la tierra que te pertenece. Pero la olvidaste.",
    "Flotás porque perdiste la conexión con tus raíces."
  ],
  bosque_micelios: [
    "Estás rodeada pero desconectada.",
    "¿Sabías que los árboles se comunican por raíces invisibles?",
    "La soledad en medio de la gente es la más dolorosa.",
    "Hay una red invisible que conecta todo. Vos te saliste de ella."
  ],
  bosque_hierbas: [
    "¿Cuándo fue la última vez que te sentiste realmente viva?",
    "Las plantas guardan secretos de vitalidad que olvidamos.",
    "Estás agotada y ningún café lo arregla.",
    "La vitalidad que buscás está en lo verde, no en lo artificial."
  ],
  bosque_hongos: [
    "Hay algo viejo que necesita morir para que nazca lo nuevo.",
    "¿Qué tenés que dejar morir para poder vivir?",
    "Los hongos transforman lo muerto en vida. Eso es lo que necesitás.",
    "Lo que no se transforma, se pudre."
  ],
  bosque_equilibrio: [
    "¿Tu ritmo es el de la naturaleza o el de la ciudad?",
    "Vivís acelerada y tu cuerpo pide parar.",
    "El bosque tiene su tempo. Vos perdiste el tuyo.",
    "El equilibrio no es aburrido. Es necesario para no romperse."
  ]
};

export const hooks = {
  fortuna: [
    "Hay personas a las que la suerte les esquiva.",
    "¿Cuántas veces viste a alguien menos preparado llevarse lo que vos merecías?",
    "Hay quienes siempre llegan un paso tarde.",
    "Parece que el universo favorece a todos menos a vos.",
    "Las coincidencias buenas nunca son para vos.",
    "Te preparás, te esforzás, pero el golpe de suerte nunca llega.",
    "Hay personas que nacen con estrella. Y otras que miramos desde afuera.",
    "La mala racha existe. Y la tuya ya duró demasiado.",
    "Oportunidades hay. El problema es que nunca paran en tu puerta.",
    "¿Y si el problema no sos vos? ¿Y si simplemente te falta un empujón de suerte?"
  ],

  proteccion: [
    "Hay personas que cargan con todo y no piden nada.",
    "¿Cuántas veces dijiste que sí cuando querías decir que no?",
    "Algunas personas absorben todo lo que las rodea sin darse cuenta.",
    "Existe una diferencia entre estar sola y sentirse sola.",
    "Los que más dan son los que menos piden.",
    "Hay quienes sienten todo. Incluso lo que no es suyo.",
    "Cuidar a todos te dejó sin nadie que te cuide a vos.",
    "Ser fuerte todo el tiempo tiene un precio.",
    "A veces el cansancio no es físico.",
    "Cargar con el peso del mundo ajeno no te hace buena persona. Te hace agotada."
  ],

  abundancia: [
    "El dinero no es malo. Lo que te enseñaron sobre él, sí.",
    "¿Cuántas veces dejaste pasar oportunidades por no sentirte lista?",
    "Hay personas que trabajan el doble y ganan la mitad.",
    "Merecer no se negocia. Se decide.",
    "El bloqueo no está en el mundo. Está en lo que creés sobre vos.",
    "Lo que rechazás, te rechaza.",
    "Hay un techo invisible que vos misma construiste.",
    "Pediste permiso toda tu vida. ¿A quién?",
    "Tu mamá tenía miedo al dinero. ¿Y vos?",
    "No es falta de oportunidades. Es exceso de autosabotaje."
  ],

  amor: [
    // AMOR PROPIO
    "Amás a todos menos a vos.",
    "El amor propio no es egoísmo. Es supervivencia.",
    "El amor que merecés empieza por el que te negás.",
    "Elegiste a otros tantas veces. ¿Cuándo te vas a elegir a vos?",
    "Hay un vacío que ninguna otra persona puede llenar.",
    // AMOR DE PAREJA / ROMÁNTICO
    "El amor no debería doler. Pero el tuyo siempre duele.",
    "Esperás que alguien te elija cuando vos todavía no lo hiciste.",
    "Hay patrones que repetís sin darte cuenta. Siempre el mismo tipo de persona.",
    "Lo que tolerás, lo repetís.",
    "¿Cuántas veces confundiste intensidad con amor?",
    // ENCONTRAR AL INDICADO/A
    "Hay personas que buscan afuera lo que nunca se dieron adentro.",
    "El amor de tu vida no va a aparecer si no dejás ir al que no es.",
    "No es que no haya nadie. Es que seguís buscando donde no está.",
    "A veces el amor llega cuando dejás de perseguirlo.",
    // AMOR DE FAMILIA
    "La familia que te tocó no siempre es la que merecés.",
    "Hay heridas que solo la familia sabe hacer.",
    "El perdón no significa volver. Significa soltar.",
    "¿Cuándo fue la última vez que alguien te preguntó cómo estás de verdad?",
    // FERTILIDAD / MATERNIDAD
    "Hay deseos que no se cuentan porque duelen demasiado.",
    "El cuerpo guarda lo que la mente no procesa.",
    "Dar sin recibir no es generosidad. Es costumbre.",
    "A veces lo que más querés es lo que más te cuesta."
  ],

  sanacion: [
    "Hay heridas que no sangran pero duelen todos los días.",
    "Soltar no es olvidar. Es dejar de cargar.",
    "El cuerpo guarda lo que la mente no procesa.",
    "Sanar no es volver a ser quien eras. Es convertirte en quien podés ser.",
    "No todo lo que duele tiene nombre. Pero existe.",
    "Hay duelos que nunca hiciste.",
    "Lo que no perdonaste te sigue pesando.",
    "El dolor que ignorás no desaparece. Se transforma.",
    "Hay partes tuyas que dejaste atrás hace mucho.",
    "A veces sanar es simplemente dejar de resistir."
  ],

  sabiduria: [
    "Sabés más de lo que te permiten recordar.",
    "La intuición habla. El ruido no te deja escucharla.",
    "¿Cuántas veces supiste algo y no le hiciste caso?",
    "La claridad no se busca. Se permite.",
    "Tu mente duda. Tu cuerpo sabe.",
    "Hay respuestas que ya tenés pero no te animás a escuchar.",
    "Buscás afuera lo que siempre estuvo adentro.",
    "Las decisiones más importantes no se piensan. Se sienten.",
    "El miedo a equivocarte te tiene paralizada.",
    "Sabés lo que tenés que hacer. Solo querés que alguien te lo confirme."
  ],

  viajeros: [
    "Hay personas que viven la misma vida todos los días esperando que algo cambie.",
    "¿Cuántas veces soñaste con dejarlo todo y empezar de nuevo?",
    "La zona de confort se convirtió en tu prisión.",
    "Mirás el horizonte y sentís que hay algo llamándote.",
    "La rutina te está asfixiando y lo sabés.",
    "Hay quienes nacieron para moverse, pero la vida los ancló.",
    "El cambio que necesitás te da miedo. Y por eso seguís igual.",
    "Tu mundo se volvió chico. Y vos te achicaste con él.",
    "Hay personas que tienen las alas listas pero no despegan.",
    "Vivís en piloto automático. Pero no elegiste el destino."
  ],

  naturaleza: [
    "Hay personas que olvidaron que vienen de la tierra.",
    "¿Cuándo fue la última vez que caminaste descalza sobre el pasto?",
    "La naturaleza te llama pero el cemento te atrapa.",
    "Los micelios conectan todo en el bosque. Vos estás desconectada de todo.",
    "La vida moderna te alejó de tu esencia.",
    "Tu cuerpo, mente y espíritu piden volver a lo natural.",
    "Hay una fuerza en la tierra que te pertenece. Pero la olvidaste.",
    "El ritmo de la ciudad no es tu ritmo. Y tu cuerpo lo sabe.",
    "La sanación más profunda viene de donde siempre vino: la naturaleza.",
    "Estás desconectada de las raíces. Y sin raíces no hay fruto."
  ],

  // === CATEGORÍAS SINCRONIZADAS CON ESPECIALIZACIONES.JS ===

  calma: [
    "Tu mente no para nunca.",
    "La ansiedad te come por dentro.",
    "Vivís en modo alerta permanente.",
    "Olvidaste lo que es sentirte tranquila.",
    "Dormís pero no descansás. Parás pero no frenás.",
    "El ruido interno no te deja en paz.",
    "¿Cuándo fue la última vez que tu mente estuvo en silencio?",
    "Tu sistema nervioso está gritando. Es hora de escucharlo.",
    "Merecés un respiro. Merecés silencio interno.",
    "El cuerpo que no descansa, colapsa."
  ],

  transformacion: [
    "Algo en vos está muriendo. Y eso asusta.",
    "El cambio que necesitás te da miedo.",
    "Ya no sos quien eras. Pero tampoco sabés quién estás siendo.",
    "Transformarse duele. Pero quedarse igual duele más.",
    "Querés cambiar pero no sabés cómo.",
    "Sentís que estás estancada.",
    "La vida que tenés no es la que querés.",
    "Estás lista para renacer pero no sabés por dónde empezar.",
    "La oruga no pide permiso para ser mariposa.",
    "El único permiso que necesitás es el tuyo."
  ],

  alegria: [
    "Olvidaste cómo se siente la alegría genuina.",
    "Sonreís por compromiso, no por felicidad.",
    "La vida se volvió gris.",
    "Extrañás la versión de vos que se reía de verdad.",
    "La liviandad se perdió en algún momento.",
    "¿Cuándo fue la última vez que te reíste sin razón?",
    "La seriedad se convirtió en tu escudo.",
    "La alegría no es un lujo. Es una necesidad.",
    "No es inmaduro querer ser feliz.",
    "Merecés liviandad. Merecés risas. Merecés luz."
  ]
};

/**
 * Obtiene un hook aleatorio de una categoría
 * @param {string} categoria - proteccion, abundancia, amor, sanacion, sabiduria
 * @returns {string} Hook aleatorio
 */
export const getRandomHook = (categoria) => {
  const categoriaLower = (categoria || 'proteccion').toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, ''); // Quita tildes

  // Mapeo de variantes y subcategorías a categorías principales
  const mapeo = {
    // === FORTUNA ===
    'fortuna': 'fortuna',
    'fortune': 'fortuna',
    'suerte': 'fortuna',
    'luck': 'fortuna',

    // === PROTECCIÓN ===
    'proteccion': 'proteccion',
    'protection': 'proteccion',
    'proteccion_hogar': 'proteccion',
    'proteccion_energetica': 'proteccion',
    'proteccion_ninos': 'proteccion',
    'proteccion_auto': 'proteccion',
    'proteccion_viajes': 'proteccion',
    'proteccion_mascotas': 'proteccion',
    'limites': 'proteccion',
    'envidias': 'proteccion',
    'vigilante': 'proteccion',
    'miedos': 'proteccion',
    'mudanza': 'proteccion',

    // === ABUNDANCIA ===
    'abundancia': 'abundancia',
    'abundance': 'abundancia',
    'prosperidad': 'abundancia',
    'abrecaminos': 'abundancia',
    'negocios': 'abundancia',
    'emprendimiento': 'abundancia',
    'buscar_trabajo': 'abundancia',
    'entrevistas': 'abundancia',
    'liderazgo': 'abundancia',
    'deudas': 'abundancia',
    'clientes': 'abundancia',
    'deseos': 'abundancia',

    // === AMOR ===
    'amor': 'amor',
    'love': 'amor',
    'amor_romantico': 'amor',
    'romantico': 'amor',
    'pareja': 'amor',
    'relaciones': 'amor',
    'amor_propio': 'amor',
    'amor_hijos': 'amor',
    'maternidad': 'amor',
    'fertilidad': 'amor',
    'familia': 'amor',
    'amistades': 'amor',
    'reconciliacion': 'amor',
    'soledad': 'amor',
    'autoestima': 'amor',
    'confianza': 'amor',
    'alegria': 'amor',
    'gratitud': 'amor',

    // === SANACIÓN ===
    'sanacion': 'sanacion',
    'healing': 'sanacion',
    'sanacion_emocional': 'sanacion',
    'sanacion_transgeneracional': 'sanacion',
    'sanacion_fisica': 'sanacion',
    'sanacion_psicosomatica': 'sanacion',
    'duelos': 'sanacion',
    'patrones': 'sanacion',
    'adicciones': 'sanacion',
    'traumas': 'sanacion',
    'calma': 'sanacion',
    'paz': 'sanacion',
    'ansiedad': 'sanacion',
    'insomnio': 'sanacion',
    'meditacion': 'sanacion',
    'energia': 'sanacion',
    'separacion': 'sanacion',
    'desapego': 'sanacion',

    // === SABIDURÍA ===
    'sabiduria': 'sabiduria',
    'wisdom': 'sabiduria',
    'intuicion': 'sabiduria',
    'creatividad': 'sabiduria',
    'estudio': 'sabiduria',
    'examenes': 'sabiduria',
    'memoria': 'sabiduria',
    'concentracion': 'sabiduria',
    'claridad': 'sabiduria',
    'transformacion': 'sabiduria',
    'nuevos_comienzos': 'sabiduria',
    'jubilacion': 'sabiduria',
    'conexion_espiritual': 'sabiduria',
    'suenos': 'sabiduria',
    'proposito': 'sabiduria',

    // === VIAJEROS ===
    'viajeros': 'viajeros',
    'viajero': 'viajeros',
    'viajero_aventura': 'viajeros',
    'viajero_sabiduria': 'viajeros',
    'viajero_reinvencion': 'viajeros',
    'viajero_horizontes': 'viajeros',
    'viajero_despegue': 'viajeros',
    'mochila': 'viajeros',
    'camino': 'viajeros',
    'rumbo': 'viajeros',
    'aventura': 'viajeros',

    // === BOSQUE / NATURALEZA ===
    'naturaleza': 'naturaleza',
    'bosque': 'naturaleza',
    'bosque_sanacion': 'naturaleza',
    'bosque_raices': 'naturaleza',
    'bosque_micelios': 'naturaleza',
    'bosque_hierbas': 'naturaleza',
    'bosque_hongos': 'naturaleza',
    'bosque_equilibrio': 'naturaleza',
    'hongos': 'naturaleza',
    'micelio': 'naturaleza',
    'yuyo': 'naturaleza',
    'hierba': 'naturaleza',
    'raiz': 'naturaleza',
    'raices': 'naturaleza',
    'tierra': 'naturaleza',
    'planta': 'naturaleza',
    'verde': 'naturaleza',
    'musgo': 'naturaleza',
    'druida': 'naturaleza',
    'chaman': 'naturaleza',

    // === CALMA / PAZ ===
    'calma': 'calma',
    'paz': 'calma',
    'serenidad': 'calma',
    'tranquilidad': 'calma',
    'ansiedad': 'calma',
    'nervios': 'calma',
    'relax': 'calma',
    'descanso': 'calma',

    // === TRANSFORMACIÓN ===
    'transformacion': 'transformacion',
    'cambio': 'transformacion',
    'metamorfosis': 'transformacion',
    'renacer': 'transformacion',
    'renacimiento': 'transformacion',
    'mariposa': 'transformacion',
    'fenix': 'transformacion',
    'phoenix': 'transformacion',

    // === ALEGRÍA ===
    'alegria': 'alegria',
    'felicidad': 'alegria',
    'risa': 'alegria',
    'juego': 'alegria',
    'girasol': 'alegria',
    'sol': 'alegria',
    'luz': 'alegria',
    'liviandad': 'alegria'
  };

  const key = mapeo[categoriaLower] || 'proteccion';
  const lista = hooks[key];
  return lista[Math.floor(Math.random() * lista.length)];
};

/**
 * Obtiene todos los hooks de una categoría
 * @param {string} categoria
 * @returns {string[]} Lista de hooks
 */
export const getAllHooks = (categoria) => {
  const categoriaLower = (categoria || 'proteccion').toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  const mapeo = {
    'proteccion': 'proteccion',
    'protection': 'proteccion',
    'abundancia': 'abundancia',
    'amor': 'amor',
    'amor_romantico': 'amor',
    'amor_propio': 'amor',
    'sanacion': 'sanacion',
    'sabiduria': 'sabiduria',
    'viajeros': 'viajeros',
    'viajero': 'viajeros',
    'naturaleza': 'naturaleza',
    'bosque': 'naturaleza',
    'fortuna': 'fortuna',
    'calma': 'calma',
    'paz': 'calma',
    'transformacion': 'transformacion',
    'alegria': 'alegria'
  };

  const key = mapeo[categoriaLower] || 'proteccion';
  return hooks[key] || hooks.proteccion;
};

/**
 * Obtiene 3 hooks alternativos (excluyendo el principal)
 * @param {string} categoria
 * @param {string} hookPrincipal - El que ya se usó
 * @returns {string[]} 3 hooks alternativos
 */
export const getHooksAlternativos = (categoria, hookPrincipal) => {
  const todos = getAllHooks(categoria);
  const disponibles = todos.filter(h => h !== hookPrincipal);

  // Shuffle y tomar 3
  const shuffled = disponibles.sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 3);
};

/**
 * Obtiene un hook de una subcategoría específica
 * @param {string} subcategoria - ID de subcategoría (ej: 'amor_propio', 'proteccion_hogar')
 * @returns {string} Hook aleatorio de esa subcategoría
 */
export const getHookPorSubcategoria = (subcategoria) => {
  const lista = hooksEspecificos[subcategoria];
  if (lista && lista.length > 0) {
    return lista[Math.floor(Math.random() * lista.length)];
  }
  // Fallback a categoría general
  return getRandomHook(subcategoria);
};

/**
 * Obtiene la subcategoría que debería usar este guardián en un batch
 * basándose en su índice dentro del grupo
 * @param {string} categoriaMain - Categoría principal (amor, proteccion, etc)
 * @param {number} indice - Índice del guardián en el grupo (0, 1, 2, ...)
 * @returns {object} { id, nombre, hook }
 */
export const getDistribucionBatch = (categoriaMain, indice) => {
  const sub = getSubcategoriaRotada(categoriaMain, indice);
  if (!sub) {
    return {
      id: categoriaMain,
      nombre: categoriaMain,
      hook: getRandomHook(categoriaMain)
    };
  }
  return {
    id: sub.id,
    nombre: sub.nombre,
    hook: getHookPorSubcategoria(sub.id)
  };
};
