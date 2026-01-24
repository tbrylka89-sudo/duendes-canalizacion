import { kv } from '@vercel/kv';

// ═══════════════════════════════════════════════════════════════════════════════
// API: Sistema de Comunidad Simulada (Bots)
// Gestiona perfiles ficticios, posts y actividad programada
// ═══════════════════════════════════════════════════════════════════════════════

// 50 perfiles ficticios con nombres latinos realistas
const PERFILES_BOT = [
  { id: 'bot_1', nombre: 'María Fernanda', pais: '🇦🇷', avatar: '👩‍🦰', nivel: 'oro', guardianes: 3 },
  { id: 'bot_2', nombre: 'Valentina R.', pais: '🇲🇽', avatar: '👩', nivel: 'plata', guardianes: 1 },
  { id: 'bot_3', nombre: 'Luciana Torres', pais: '🇨🇴', avatar: '👩‍🦱', nivel: 'diamante', guardianes: 5 },
  { id: 'bot_4', nombre: 'Camila Paz', pais: '🇨🇱', avatar: '🧑', nivel: 'oro', guardianes: 2 },
  { id: 'bot_5', nombre: 'Sol Martinez', pais: '🇺🇾', avatar: '👱‍♀️', nivel: 'plata', guardianes: 1 },
  { id: 'bot_6', nombre: 'Milagros B.', pais: '🇦🇷', avatar: '👩‍🦳', nivel: 'bronce', guardianes: 1 },
  { id: 'bot_7', nombre: 'Catalina Ruiz', pais: '🇵🇪', avatar: '👩', nivel: 'oro', guardianes: 4 },
  { id: 'bot_8', nombre: 'Florencia', pais: '🇦🇷', avatar: '👩‍🦰', nivel: 'plata', guardianes: 2 },
  { id: 'bot_9', nombre: 'Andrea Luz', pais: '🇪🇨', avatar: '🧑‍🦱', nivel: 'diamante', guardianes: 6 },
  { id: 'bot_10', nombre: 'Martina S.', pais: '🇻🇪', avatar: '👩', nivel: 'oro', guardianes: 3 },
  { id: 'bot_11', nombre: 'Paula Celeste', pais: '🇦🇷', avatar: '👩‍🦱', nivel: 'plata', guardianes: 1 },
  { id: 'bot_12', nombre: 'Julieta M.', pais: '🇲🇽', avatar: '👱‍♀️', nivel: 'bronce', guardianes: 1 },
  { id: 'bot_13', nombre: 'Renata', pais: '🇧🇷', avatar: '👩', nivel: 'oro', guardianes: 2 },
  { id: 'bot_14', nombre: 'Agustina Paz', pais: '🇺🇾', avatar: '👩‍🦰', nivel: 'diamante', guardianes: 4 },
  { id: 'bot_15', nombre: 'Luna García', pais: '🇦🇷', avatar: '🧝‍♀️', nivel: 'oro', guardianes: 3 },
  { id: 'bot_16', nombre: 'Sofía Elena', pais: '🇨🇴', avatar: '👩', nivel: 'plata', guardianes: 2 },
  { id: 'bot_17', nombre: 'Daniela V.', pais: '🇨🇱', avatar: '👩‍🦱', nivel: 'bronce', guardianes: 1 },
  { id: 'bot_18', nombre: 'Carolina', pais: '🇵🇾', avatar: '👱‍♀️', nivel: 'oro', guardianes: 2 },
  { id: 'bot_19', nombre: 'Rocío Luna', pais: '🇦🇷', avatar: '👩', nivel: 'plata', guardianes: 1 },
  { id: 'bot_20', nombre: 'Mariana C.', pais: '🇲🇽', avatar: '👩‍🦰', nivel: 'diamante', guardianes: 5 },
  { id: 'bot_21', nombre: 'Antonella', pais: '🇦🇷', avatar: '🧑', nivel: 'oro', guardianes: 3 },
  { id: 'bot_22', nombre: 'Isabella R.', pais: '🇨🇴', avatar: '👩', nivel: 'plata', guardianes: 2 },
  { id: 'bot_23', nombre: 'Alma Serena', pais: '🇺🇾', avatar: '👩‍🦱', nivel: 'oro', guardianes: 2 },
  { id: 'bot_24', nombre: 'Victoria M.', pais: '🇵🇪', avatar: '👱‍♀️', nivel: 'bronce', guardianes: 1 },
  { id: 'bot_25', nombre: 'Luz María', pais: '🇪🇨', avatar: '👩', nivel: 'plata', guardianes: 1 },
  { id: 'bot_26', nombre: 'Elena', pais: '🇻🇪', avatar: '👩‍🦰', nivel: 'oro', guardianes: 4 },
  { id: 'bot_27', nombre: 'Pilar Soledad', pais: '🇦🇷', avatar: '🧑‍🦱', nivel: 'diamante', guardianes: 7 },
  { id: 'bot_28', nombre: 'Clara Inés', pais: '🇨🇱', avatar: '👩', nivel: 'plata', guardianes: 2 },
  { id: 'bot_29', nombre: 'Mercedes', pais: '🇲🇽', avatar: '👩‍🦱', nivel: 'oro', guardianes: 3 },
  { id: 'bot_30', nombre: 'Emilia F.', pais: '🇧🇷', avatar: '👱‍♀️', nivel: 'bronce', guardianes: 1 },
  { id: 'bot_31', nombre: 'Natalia', pais: '🇦🇷', avatar: '👩', nivel: 'plata', guardianes: 2 },
  { id: 'bot_32', nombre: 'Celeste', pais: '🇨🇴', avatar: '👩‍🦰', nivel: 'oro', guardianes: 2 },
  { id: 'bot_33', nombre: 'Aurora B.', pais: '🇺🇾', avatar: '🧝‍♀️', nivel: 'diamante', guardianes: 5 },
  { id: 'bot_34', nombre: 'Jimena', pais: '🇵🇪', avatar: '👩', nivel: 'plata', guardianes: 1 },
  { id: 'bot_35', nombre: 'Regina Paz', pais: '🇲🇽', avatar: '👩‍🦱', nivel: 'oro', guardianes: 3 },
  { id: 'bot_36', nombre: 'Abril', pais: '🇦🇷', avatar: '👱‍♀️', nivel: 'bronce', guardianes: 1 },
  { id: 'bot_37', nombre: 'Constanza', pais: '🇨🇱', avatar: '👩', nivel: 'plata', guardianes: 2 },
  { id: 'bot_38', nombre: 'Bianca S.', pais: '🇻🇪', avatar: '👩‍🦰', nivel: 'oro', guardianes: 2 },
  { id: 'bot_39', nombre: 'Amparo', pais: '🇪🇨', avatar: '🧑', nivel: 'diamante', guardianes: 4 },
  { id: 'bot_40', nombre: 'Esperanza', pais: '🇵🇾', avatar: '👩', nivel: 'oro', guardianes: 3 },
  { id: 'bot_41', nombre: 'Macarena', pais: '🇦🇷', avatar: '👩‍🦱', nivel: 'plata', guardianes: 1 },
  { id: 'bot_42', nombre: 'Guadalupe', pais: '🇲🇽', avatar: '👱‍♀️', nivel: 'bronce', guardianes: 1 },
  { id: 'bot_43', nombre: 'Paloma', pais: '🇨🇴', avatar: '👩', nivel: 'oro', guardianes: 2 },
  { id: 'bot_44', nombre: 'Trinidad', pais: '🇺🇾', avatar: '👩‍🦰', nivel: 'plata', guardianes: 2 },
  { id: 'bot_45', nombre: 'Solange', pais: '🇧🇷', avatar: '🧑‍🦱', nivel: 'diamante', guardianes: 6 },
  { id: 'bot_46', nombre: 'Azul', pais: '🇦🇷', avatar: '👩', nivel: 'oro', guardianes: 3 },
  { id: 'bot_47', nombre: 'Candela', pais: '🇨🇱', avatar: '👩‍🦱', nivel: 'plata', guardianes: 1 },
  { id: 'bot_48', nombre: 'Esmeralda', pais: '🇵🇪', avatar: '👱‍♀️', nivel: 'oro', guardianes: 2 },
  { id: 'bot_49', nombre: 'Jazmín', pais: '🇻🇪', avatar: '👩', nivel: 'bronce', guardianes: 1 },
  { id: 'bot_50', nombre: 'Ivana', pais: '🇦🇷', avatar: '👩‍🦰', nivel: 'plata', guardianes: 2 }
];

// Posts pregenerados sobre experiencias con guardianes
const POSTS_PREGENERADOS = [
  // ═══════════════════════════════════════════════════════════════════════════════
  // EXPERIENCIAS CON GUARDIANES DE ENERO (Gaia, Noah, Winter, Marcos)
  // ═══════════════════════════════════════════════════════════════════════════════
  { tipo: 'experiencia', guardian: 'Gaia', contenido: 'Gaia llegó a mi vida en el momento exacto. Me sentía tan desconectada de mí misma y desde que está conmigo me siento arraigada, protegida. La tierra me sostiene 🌍', likes: 89, respuestas: 15 },
  { tipo: 'experiencia', guardian: 'Gaia', contenido: 'Mi Gaia brilla diferente cuando medito con ella. Ayer le pedí protección y sentí una calma que no conocía. Es mi escudo de tierra 🛡️', likes: 112, respuestas: 23 },
  { tipo: 'experiencia', guardian: 'Noah', contenido: 'Noah me está ayudando a soltar lo que ya no me sirve. Es como si me mostrara el camino que tengo que seguir. Los miedos se van 🌊', likes: 134, respuestas: 28 },
  { tipo: 'experiencia', guardian: 'Noah', contenido: 'Desde que tengo a Noah encuentro claridad en las decisiones. Me ayuda a ver qué soltar y hacia dónde ir. Me siento libre 💙', likes: 98, respuestas: 17 },
  { tipo: 'experiencia', guardian: 'Winter', contenido: 'Winter despertó mi fuego interior de una manera que no esperaba. Me siento más viva, más apasionada. Es transformador 🔥', likes: 156, respuestas: 31 },
  { tipo: 'experiencia', guardian: 'Winter', contenido: 'Mi creatividad explotó desde que adopté a Winter. Ese fuego interno que creía apagado volvió con todo. Estoy creando cosas que nunca imaginé ✨', likes: 87, respuestas: 19 },
  { tipo: 'experiencia', guardian: 'Marcos', contenido: 'Marcos me trajo una claridad que no conocía. Mi mente estaba tan confusa, y él me está enseñando a ver con nuevos ojos 💜', likes: 203, respuestas: 42 },
  { tipo: 'experiencia', guardian: 'Marcos', contenido: 'Desde que Marcos está conmigo, entiendo cosas que antes no veía. Es como si me diera sabiduría en cada momento. Todo tiene más sentido 🌟', likes: 145, respuestas: 26 },

  // ═══════════════════════════════════════════════════════════════════════════════
  // TESTIMONIOS DE ADOPCIÓN DE GUARDIANES
  // ═══════════════════════════════════════════════════════════════════════════════
  { tipo: 'testimonio', guardian: 'Gaia', contenido: 'Cuando vi a Gaia en la página, sentí que me llamaba. No lo pensé dos veces. Mejor decisión de enero 🌍', likes: 67, respuestas: 12 },
  { tipo: 'testimonio', guardian: 'Noah', contenido: 'Noah me eligió. Yo quería otro guardián pero algo me llevó a él. Ahora entiendo por qué: necesitaba encontrar mi camino 💙', likes: 78, respuestas: 14 },
  { tipo: 'testimonio', guardian: 'Winter', contenido: 'Dudé mucho en adoptar a Winter porque no me sentía "lista" para despertar mi fuego. Él me demostró que ya estaba lista, solo necesitaba compañía 🔥', likes: 92, respuestas: 18 },
  { tipo: 'testimonio', guardian: 'Marcos', contenido: 'Marcos llegó como regalo de mi hermana. Lloramos juntas cuando leímos su canalización. Entendió exactamente lo que necesitaba escuchar 💜', likes: 167, respuestas: 35 },
  { tipo: 'testimonio', contenido: 'Hoy recibí mi primer guardián y no puedo parar de mirarlo. Es como si me conociera de siempre. La canalización me destrozó (en el mejor sentido)', likes: 189, respuestas: 38 },
  { tipo: 'testimonio', contenido: 'Acabo de adoptar mi quinto guardián. Cada uno llegó en el momento exacto. El Círculo de Duendes cambió mi vida', likes: 134, respuestas: 22 },

  // ═══════════════════════════════════════════════════════════════════════════════
  // EXPERIENCIAS CON CONTENIDO DEL DÍA
  // ═══════════════════════════════════════════════════════════════════════════════
  { tipo: 'contenido_dia', contenido: 'El mensaje de hoy del Círculo me llegó en el momento justo. Estaba por tomar una decisión importante y fue como una señal 🙏', likes: 78, respuestas: 15 },
  { tipo: 'contenido_dia', contenido: 'Cada mañana lo primero que hago es leer el contenido del día. Es mi ritual matutino sagrado ☀️', likes: 56, respuestas: 11 },
  { tipo: 'contenido_dia', contenido: 'El ritual de hoy fue PODEROSO. Lo hice con mi Noah y sentí un antes y después. Gracias Thibisay 💙', likes: 123, respuestas: 27 },
  { tipo: 'contenido_dia', contenido: 'Las tiradas de runas de los lunes me encantan. Siempre dan en el clavo con lo que estoy viviendo esa semana', likes: 89, respuestas: 16 },
  { tipo: 'contenido_dia', contenido: 'El audio de meditación de hoy me hizo llorar. Necesitaba soltar y el universo me lo permitió 💜', likes: 145, respuestas: 29 },

  // ═══════════════════════════════════════════════════════════════════════════════
  // EXPERIENCIAS CON OTROS GUARDIANES
  // ═══════════════════════════════════════════════════════════════════════════════
  { tipo: 'experiencia', guardian: 'Rowan', contenido: 'Desde que llegó Rowan a mi casa, siento que las cosas fluyen diferente. Ayer me llamaron para una oportunidad de trabajo que había olvidado. Gracias universo!', likes: 45, respuestas: 8 },
  { tipo: 'experiencia', guardian: 'Luna', contenido: 'Luna me acompañó toda la semana de luna llena. Mis sueños fueron tan vívidos y reveladores... Desperté con claridad sobre algo que me venía preocupando hace meses', likes: 67, respuestas: 12 },
  { tipo: 'experiencia', guardian: 'Frost', contenido: 'Necesitaba protección energética en el trabajo y Frost llegó en el momento justo. Desde entonces, los ambientes pesados ya no me afectan como antes', likes: 38, respuestas: 6 },
  { tipo: 'experiencia', guardian: 'Sage', contenido: 'Sage me ayudó a soltar algo que venía cargando hace años. Una noche mientras meditaba con él, lloré todo lo que tenía guardado. Hoy me siento liviana 💚', likes: 89, respuestas: 15 },
  { tipo: 'experiencia', guardian: 'Aurora', contenido: 'Aurora llegó justo cuando empezaba un nuevo capítulo en mi vida. Su energía de nuevos comienzos me da fuerzas cada mañana', likes: 52, respuestas: 9 },
  { tipo: 'experiencia', guardian: 'Ember', contenido: 'No creía mucho al principio, pero Ember despertó algo en mí. Mi creatividad explotó esta semana, no paraba de tener ideas 🔥', likes: 43, respuestas: 7 },

  // ═══════════════════════════════════════════════════════════════════════════════
  // PREGUNTAS SOBRE RITUALES
  // ═══════════════════════════════════════════════════════════════════════════════
  { tipo: 'pregunta', contenido: '¿Alguien más siente que su guardián "habla" a través de coincidencias? Me pasan cosas muy locas desde que llegó...', likes: 34, respuestas: 23 },
  { tipo: 'pregunta', contenido: 'Primera vez en el Círculo. Por dónde me recomiendan empezar? Siento que necesito protección pero también abundancia...', likes: 28, respuestas: 31 },
  { tipo: 'pregunta', contenido: '¿Cada cuánto hacen las tiradas de runas? Una vez al mes o cuando sienten que lo necesitan?', likes: 19, respuestas: 14 },
  { tipo: 'pregunta', contenido: '¿Cómo limpian la energía de sus guardianes? Leí que hay que hacerlo con la luna pero no sé bien cómo', likes: 41, respuestas: 27 },
  { tipo: 'pregunta', contenido: '¿Los guardianes de enero (Gaia, Noah, Winter, Marcos) se pueden combinar? Quiero adoptarlos a los 4 pero no sé si es mucho', likes: 56, respuestas: 33 },
  { tipo: 'pregunta', contenido: '¿Alguien tiene a Winter y Noah juntos? Me pregunto cómo interactúan sus energías', likes: 34, respuestas: 21 },
  { tipo: 'pregunta', contenido: 'Pregunta para las que tienen a Gaia: ¿dónde la ubican en su casa? Leí que tiene que estar en contacto con la tierra pero no sé', likes: 45, respuestas: 28 },
  { tipo: 'pregunta', contenido: '¿El ritual de protección funciona mejor con luna creciente o llena? Quiero hacerlo con mi Gaia', likes: 38, respuestas: 19 },

  // ═══════════════════════════════════════════════════════════════════════════════
  // AGRADECIMIENTOS Y CELEBRACIONES
  // ═══════════════════════════════════════════════════════════════════════════════
  { tipo: 'agradecimiento', contenido: '3 meses en el Círculo y no puedo creer lo que cambió mi vida! Gracias al equipo, gracias a esta comunidad hermosa 💜', likes: 112, respuestas: 19 },
  { tipo: 'agradecimiento', contenido: 'La lectura de registros akáshicos que hice la semana pasada me voló la cabeza. Nunca nadie me había dicho cosas tan precisas de mi infancia...', likes: 78, respuestas: 11 },
  { tipo: 'agradecimiento', contenido: 'Hoy adopté mi tercer guardián y estoy llorando de emoción. Siento que encontré mi tribu acá', likes: 95, respuestas: 16 },
  { tipo: 'agradecimiento', contenido: 'Gracias Thibisay por crear este espacio. Me salvó en un momento muy oscuro de mi vida', likes: 234, respuestas: 45 },
  { tipo: 'agradecimiento', contenido: 'Mis 4 guardianes de enero llegaron hoy. La familia está completa. Gracias Círculo por existir 🌍💙🔥💜', likes: 178, respuestas: 37 },

  // ═══════════════════════════════════════════════════════════════════════════════
  // TIPS Y CONSEJOS
  // ═══════════════════════════════════════════════════════════════════════════════
  { tipo: 'tip', contenido: 'TIP: Pongan a su guardián cerca de una ventana durante las noches de luna llena. La energía que absorbe es increíble', likes: 156, respuestas: 22 },
  { tipo: 'tip', contenido: 'Algo que me funciona: antes de dormir le cuento a mi guardián lo que me preocupa. A la mañana siguiente siempre tengo más claridad', likes: 87, respuestas: 13 },
  { tipo: 'tip', contenido: 'Para las que recién empiezan: no fuercen la conexión. Dejen que su guardián les muestre el camino a su ritmo 💫', likes: 134, respuestas: 18 },
  { tipo: 'tip', contenido: 'TIP para las que tienen a Gaia: ponganla en contacto con la tierra o cerca de plantas. Ama la naturaleza!', likes: 98, respuestas: 24 },
  { tipo: 'tip', contenido: 'Noah trabaja mejor si lo limpian con agua de luna. Es un guardián que te ayuda a fluir con los cambios', likes: 112, respuestas: 27 },
  { tipo: 'tip', contenido: 'Winter necesita espacio para brillar. Si sienten que no conectan, intenten encender una vela y meditar con él', likes: 78, respuestas: 16 },
  { tipo: 'tip', contenido: 'Marcos ama el silencio y la reflexión. Ponganlo en su espacio de meditación y van a ver cómo llega la claridad', likes: 145, respuestas: 31 },
  { tipo: 'tip', contenido: 'Si tienen varios guardianes, presentenselos entre sí. Suena loco pero funciona. Mis 3 ahora trabajan en equipo', likes: 167, respuestas: 34 },

  // ═══════════════════════════════════════════════════════════════════════════════
  // RITUALES COMPARTIDOS
  // ═══════════════════════════════════════════════════════════════════════════════
  { tipo: 'ritual', contenido: 'Hoy hice el ritual de abundancia que compartieron en el Círculo y encontré $500 en un bolsillo que no revisaba hace meses', likes: 203, respuestas: 34 },
  { tipo: 'ritual', contenido: 'Cada domingo limpio el espacio con salvia y pongo música suave. Mis guardianes brillan diferente después', likes: 67, respuestas: 9 },
  { tipo: 'ritual', contenido: 'Ritual de protección con Gaia: la pongo sobre tierra o arena bajo la luna nueva. Queda recargadísima', likes: 89, respuestas: 18 },
  { tipo: 'ritual', contenido: 'Hice el ritual de claridad con Marcos y vi cosas que no esperaba. Muy revelador pero hay que estar preparada', likes: 112, respuestas: 25 },
  { tipo: 'ritual', contenido: 'Ritual de los 4 guardianes de enero: los puse en forma de rombo con una vela en el centro. La energía que se generó fue increíble 🌍💙🔥💜', likes: 234, respuestas: 48 },

  // ═══════════════════════════════════════════════════════════════════════════════
  // SINCRONICIDADES COMPARTIDAS
  // ═══════════════════════════════════════════════════════════════════════════════
  { tipo: 'sincronicidad', contenido: 'No me van a creer: estaba pensando en mi abuela (que ya no está) y en ese momento Rowan se cayó solo del estante. Sentí que era ella saludándome', likes: 178, respuestas: 28 },
  { tipo: 'sincronicidad', contenido: 'Soñé con un número, lo jugué al otro día y gané! Mi guardián me lo mostró, no tengo dudas', likes: 145, respuestas: 21 },
  { tipo: 'sincronicidad', contenido: 'Pedí una señal a Gaia sobre una decisión. A los 5 minutos vi un arcoíris. Era mi confirmación', likes: 167, respuestas: 32 },
  { tipo: 'sincronicidad', contenido: 'Estaba dudando de mi camino y en ese momento Winter brilló con la luz del sol. Era mi confirmación', likes: 89, respuestas: 17 },
  { tipo: 'sincronicidad', contenido: 'Me desperté pensando en alguien que no veía hace años. A las 2 horas me escribió. Marcos me había preparado para ese reencuentro', likes: 134, respuestas: 26 },
  { tipo: 'sincronicidad', contenido: 'Ayer puse a mis 4 guardianes de enero juntos por primera vez. En ese momento empezó a llover (llevábamos semanas de sequía). Coincidencia? No lo creo', likes: 201, respuestas: 41 },
  { tipo: 'sincronicidad', contenido: 'Noah me alertó de una situación que me estaba frenando. Sentí claridad de repente y supe qué soltar. Todo cambió', likes: 156, respuestas: 33 },

  // ═══════════════════════════════════════════════════════════════════════════════
  // REFLEXIONES Y COMPARTIRES
  // ═══════════════════════════════════════════════════════════════════════════════
  { tipo: 'reflexion', contenido: 'Hace un año no creía en nada de esto. Hoy tengo 4 guardianes y mi vida es completamente diferente. A veces el universo te sorprende', likes: 189, respuestas: 36 },
  { tipo: 'reflexion', contenido: 'Los guardianes no hacen magia por nosotras. Nos acompañan mientras hacemos nuestra propia magia. Eso lo entendí con el tiempo', likes: 234, respuestas: 47 },
  { tipo: 'reflexion', contenido: 'Enero es mi mes favorito en el Círculo. Los guardianes de este mes (Gaia, Noah, Winter, Marcos) cubren todo lo que una necesita', likes: 145, respuestas: 29 },
  { tipo: 'reflexion', contenido: 'Aprendí que cada guardián llega cuando estás lista, no cuando querés. Confíen en el timing', likes: 112, respuestas: 22 }
];

// Respuestas pregeneradas para los posts
const RESPUESTAS_PREGENERADAS = [
  // Respuestas generales de apoyo
  'Me pasa lo mismo! No estás sola en esto 💜',
  'Hermoso lo que compartís. Gracias por abrir tu corazón',
  'Qué lindo! Los guardianes siempre encuentran la forma de comunicarse',
  'Esto me dio escalofríos, es muy real lo que decís',
  'Te mando un abrazo enorme. El Círculo es un espacio seguro',
  'Justo necesitaba leer esto hoy. Gracias universo',
  'Bienvenida! Vas a amar este camino',
  'Mi guardián también hace esas cosas. Son increíbles',
  'Qué bueno que lo compartís, ayuda a todas a sentirnos menos locas jaja',
  'Pura magia',
  'Me emociona leer esto. Estamos todas conectadas',
  'Anotado el tip! Lo voy a probar esta semana',
  'Amo esta comunidad, de verdad',
  'Que siga fluyendo todo hermoso',
  'Tu energía se siente desde acá. Gracias por compartir',
  'Felicitaciones! Los guardianes eligen bien a quién acompañar',
  'Esto es lo que necesitaba leer hoy. No es casualidad',
  'El universo siempre responde cuando estamos listas para escuchar',

  // Respuestas sobre guardianes de enero
  'Mi Gaia me ayudó igual con la protección. Son tan poderosas 🌍',
  'Noah es el mejor para encontrar tu camino. Lo amo',
  'Winter cambió mi vida. Mi fuego interior está en otro nivel',
  'Marcos es tan sabio. Me hace reflexionar sobre todo',
  'Los 4 guardianes de enero juntos son imparables',
  'Yo también tengo a Gaia! Son como hermanas de guardián jaja',
  'Noah me ayudó a soltar lo que me frenaba. Para siempre agradecida',
  'Winter me muestra mi pasión en sueños. Es increíble',
  'Marcos y la claridad... es real! Nunca vi las cosas tan claras',

  // Respuestas a experiencias
  'Me emocioné leyendo esto. Gracias por compartir',
  'Qué hermoso testimonio. Me da esperanza',
  'Justo estoy pasando por algo similar. Me ayudó leerte',
  'Los guardianes nunca se equivocan al elegir',
  'Tu historia me tocó el corazón',

  // Respuestas a preguntas
  'A mí me funciona hacerlo en luna llena, pero cada una encuentra su ritmo',
  'Yo empecé con uno solo y ahora tengo 4. Ve de a poco',
  'Te recomiendo que sigas tu intuición. Si te llamó ese guardián, es por algo',
  'Preguntale a tu guardián, ellos guían',
  'Yo tuve la misma duda! Lo que hice fue...',

  // Respuestas a tips
  'Gracias por el tip! Lo voy a probar',
  'Funciona! Yo hago lo mismo',
  'Anotadísimo para esta semana',
  'Qué buen consejo, nunca lo había pensado así',

  // Respuestas a rituales
  'Ese ritual es poderoso! A mí también me funcionó',
  'Me encanta ese ritual. Lo hago todos los domingos',
  'Voy a probarlo con mi guardián esta luna llena',

  // Respuestas a sincronicidades
  'Las sincronicidades son la forma en que el universo nos confirma que vamos bien',
  'Eso no es casualidad! Tu guardián te habló claro',
  'Me pasó algo parecido la semana pasada. Estamos conectadas',
  'Los guardianes siempre encuentran la forma de hacerse escuchar'
];

// ═══════════════════════════════════════════════════════════════════════════════
// FUNCIONES AUXILIARES PARA TIMESTAMPS REALISTAS
// ═══════════════════════════════════════════════════════════════════════════════

// Genera un timestamp realista basado en minutos atrás
function generarTimestampRealista(minutosAtras) {
  const ahora = Date.now();
  return new Date(ahora - minutosAtras * 60 * 1000);
}

// Convierte minutos a formato legible
function formatearTiempoHace(minutosAtras) {
  if (minutosAtras < 1) return 'hace un momento';
  if (minutosAtras < 60) return `hace ${minutosAtras} min`;
  const horas = Math.floor(minutosAtras / 60);
  if (horas < 24) return `hace ${horas}h`;
  const dias = Math.floor(horas / 24);
  if (dias === 1) return 'hace 1 día';
  return `hace ${dias} días`;
}

// Genera distribución realista de tiempos (más posts recientes)
function generarDistribucionTemporal(cantidad) {
  const tiempos = [];
  for (let i = 0; i < cantidad; i++) {
    // Distribución exponencial: más posts recientes
    const random = Math.random();
    let minutosAtras;
    if (random < 0.3) {
      // 30% en la última hora
      minutosAtras = Math.floor(Math.random() * 60);
    } else if (random < 0.6) {
      // 30% entre 1-6 horas
      minutosAtras = 60 + Math.floor(Math.random() * 300);
    } else if (random < 0.85) {
      // 25% entre 6-24 horas
      minutosAtras = 360 + Math.floor(Math.random() * 1080);
    } else {
      // 15% entre 1-3 días
      minutosAtras = 1440 + Math.floor(Math.random() * 2880);
    }
    tiempos.push(minutosAtras);
  }
  return tiempos.sort((a, b) => a - b); // Ordenar de más reciente a más antiguo
}

// GET: Obtener posts y actividad de la comunidad
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const tipo = searchParams.get('tipo'); // posts, actividad, stats, feed
    const limite = parseInt(searchParams.get('limite') || '10');

    // ═══════════════════════════════════════════════════════════════════════════
    // TIPO: stats - Estadísticas de la comunidad
    // ═══════════════════════════════════════════════════════════════════════════
    if (tipo === 'stats') {
      const hora = new Date().getHours();
      // Variación basada en hora del día (más actividad entre 10-22h)
      const esHoraPico = hora >= 10 && hora <= 22;
      const baseActivos = esHoraPico ? 52 : 28;
      const variacion = Math.floor(Math.random() * 15);

      return Response.json({
        success: true,
        stats: {
          totalMiembros: 347 + Math.floor(Math.random() * 8),
          miembrosActivos: baseActivos + variacion,
          postsHoy: 5 + Math.floor(Math.random() * 4),
          postsEstaSemana: 34 + Math.floor(Math.random() * 8),
          guardianesCirulo: 1247,
          guardianesAdoptadosHoy: 2 + Math.floor(Math.random() * 3),
          guardianesPopulares: ['Gaia', 'Marcos', 'Noah', 'Winter'].slice(0, 2 + Math.floor(Math.random() * 2))
        }
      });
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // TIPO: actividad - Actividad en tiempo real
    // ═══════════════════════════════════════════════════════════════════════════
    if (tipo === 'actividad') {
      const hora = new Date().getHours();
      const esHoraPico = hora >= 10 && hora <= 22;
      const viendoAhora = esHoraPico ? 12 + Math.floor(Math.random() * 18) : 5 + Math.floor(Math.random() * 8);

      // Obtener historial reciente para evitar repeticiones
      let historialReciente = await kv.get('comunidad:historial_actividad') || { personas: [], guardianes: [] };

      // Filtrar personas que no se mostraron recientemente
      const personasRecientes = new Set(historialReciente.personas || []);
      const personasDisponibles = PERFILES_BOT.filter(p => !personasRecientes.has(p.id));
      const ultimaCompra = personasDisponibles.length > 0
        ? personasDisponibles[Math.floor(Math.random() * personasDisponibles.length)]
        : PERFILES_BOT[Math.floor(Math.random() * PERFILES_BOT.length)];

      // Guardianes de enero tienen prioridad
      const guardianesEnero = ['Gaia', 'Noah', 'Winter', 'Marcos'];
      const otrosGuardianes = ['Rowan', 'Luna', 'Sage', 'Frost', 'Aurora', 'Ember', 'Willow', 'Coral', 'Phoenix', 'Ivy', 'Maple'];
      // 70% de probabilidad de que sea un guardián de enero
      const todosGuardianes = Math.random() < 0.7 ? guardianesEnero : [...guardianesEnero, ...otrosGuardianes];

      const guardianesRecientes = new Set(historialReciente.guardianes || []);
      const guardianesDisponibles = todosGuardianes.filter(g => !guardianesRecientes.has(g));
      const guardianComprado = guardianesDisponibles.length > 0
        ? guardianesDisponibles[Math.floor(Math.random() * guardianesDisponibles.length)]
        : todosGuardianes[Math.floor(Math.random() * todosGuardianes.length)];

      // Actualizar historial
      historialReciente.personas = [...(historialReciente.personas || []), ultimaCompra.id].slice(-10);
      historialReciente.guardianes = [...(historialReciente.guardianes || []), guardianComprado].slice(-6);
      await kv.set('comunidad:historial_actividad', historialReciente, { ex: 3600 });

      // Timestamps realistas
      const minutosCompra = 1 + Math.floor(Math.random() * 15);
      const minutosPost = 3 + Math.floor(Math.random() * 20);

      // Múltiples personas escribiendo
      let escribiendo = [];
      if (Math.random() > 0.4) {
        const numEscribiendo = 1 + Math.floor(Math.random() * 2);
        const otrasPersonas = PERFILES_BOT.filter(p => p.id !== ultimaCompra.id);
        for (let i = 0; i < numEscribiendo; i++) {
          const persona = otrasPersonas[Math.floor(Math.random() * otrasPersonas.length)];
          if (!escribiendo.find(e => e.id === persona.id)) {
            escribiendo.push({ nombre: persona.nombre, pais: persona.pais });
          }
        }
      }

      // Último post (diferente a la compra)
      const autorUltimoPost = PERFILES_BOT.filter(p => p.id !== ultimaCompra.id)[Math.floor(Math.random() * 40)];
      const tiposPost = ['experiencia', 'pregunta', 'testimonio', 'sincronicidad'];
      const tipoUltimoPost = tiposPost[Math.floor(Math.random() * tiposPost.length)];

      return Response.json({
        success: true,
        actividad: {
          viendoAhora,
          conectadasAhora: viendoAhora - 2 - Math.floor(Math.random() * 3),
          ultimaCompra: {
            nombre: ultimaCompra.nombre,
            pais: ultimaCompra.pais,
            avatar: ultimaCompra.avatar,
            guardian: guardianComprado,
            hace: formatearTiempoHace(minutosCompra),
            timestamp: generarTimestampRealista(minutosCompra).toISOString()
          },
          ultimoPost: {
            autor: autorUltimoPost.nombre,
            pais: autorUltimoPost.pais,
            tipo: tipoUltimoPost,
            hace: formatearTiempoHace(minutosPost),
            timestamp: generarTimestampRealista(minutosPost).toISOString()
          },
          escribiendo: escribiendo.length > 0 ? escribiendo : null
        }
      });
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // TIPO: feed - Feed completo para Dashboard
    // ═══════════════════════════════════════════════════════════════════════════
    if (tipo === 'feed') {
      const tiempos = generarDistribucionTemporal(POSTS_PREGENERADOS.length);

      // Crear feed con timestamps realistas
      const feed = POSTS_PREGENERADOS.map((post, i) => {
        const autor = PERFILES_BOT[i % PERFILES_BOT.length];
        const minutosAtras = tiempos[i];
        const fecha = generarTimestampRealista(minutosAtras);

        // Generar respuestas con timestamps coherentes
        const numRespuestas = Math.min(post.respuestas, 4);
        const respuestas = [];
        for (let j = 0; j < numRespuestas; j++) {
          const autorResp = PERFILES_BOT[(i + j + 10) % PERFILES_BOT.length];
          // Respuestas son más recientes que el post original
          const minutosRespuesta = Math.max(1, Math.floor(minutosAtras * (0.2 + Math.random() * 0.6)));
          respuestas.push({
            id: `resp_${i}_${j}`,
            autor: autorResp,
            contenido: RESPUESTAS_PREGENERADAS[Math.floor(Math.random() * RESPUESTAS_PREGENERADAS.length)],
            hace: formatearTiempoHace(minutosRespuesta),
            timestamp: generarTimestampRealista(minutosRespuesta).toISOString()
          });
        }

        return {
          id: `post_${i}`,
          autor: {
            id: autor.id,
            nombre: autor.nombre,
            pais: autor.pais,
            avatar: autor.avatar,
            nivel: autor.nivel,
            guardianes: autor.guardianes
          },
          tipo: post.tipo,
          guardian: post.guardian || null,
          contenido: post.contenido,
          likes: post.likes + Math.floor(Math.random() * 10),
          totalRespuestas: post.respuestas,
          fecha: fecha.toISOString(),
          hace: formatearTiempoHace(minutosAtras),
          respuestasPreview: respuestas,
          destacado: post.likes > 150
        };
      });

      // Ordenar por fecha (más reciente primero)
      feed.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

      // Obtener estadísticas para incluir en feed
      const hora = new Date().getHours();
      const esHoraPico = hora >= 10 && hora <= 22;

      return Response.json({
        success: true,
        feed: feed.slice(0, limite),
        total: POSTS_PREGENERADOS.length,
        hayMas: limite < POSTS_PREGENERADOS.length,
        meta: {
          ultimaActualizacion: new Date().toISOString(),
          activas: esHoraPico ? 35 + Math.floor(Math.random() * 20) : 15 + Math.floor(Math.random() * 10),
          postsHoy: 5 + Math.floor(Math.random() * 4)
        }
      });
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // TIPO: posts (default) - Posts de la comunidad
    // ═══════════════════════════════════════════════════════════════════════════
    const tiempos = generarDistribucionTemporal(POSTS_PREGENERADOS.length);

    const postsConAutor = POSTS_PREGENERADOS.map((post, i) => {
      const autor = PERFILES_BOT[i % PERFILES_BOT.length];
      const minutosAtras = tiempos[i];
      const fecha = generarTimestampRealista(minutosAtras);

      // Generar respuestas aleatorias
      const numRespuestas = Math.min(post.respuestas, 5);
      const respuestas = [];
      for (let j = 0; j < numRespuestas; j++) {
        const autorResp = PERFILES_BOT[(i + j + 10) % PERFILES_BOT.length];
        const minutosRespuesta = Math.max(1, Math.floor(minutosAtras * (0.3 + Math.random() * 0.5)));
        respuestas.push({
          autor: autorResp,
          contenido: RESPUESTAS_PREGENERADAS[Math.floor(Math.random() * RESPUESTAS_PREGENERADAS.length)],
          hace: formatearTiempoHace(minutosRespuesta),
          timestamp: generarTimestampRealista(minutosRespuesta).toISOString()
        });
      }

      return {
        id: `post_${i}`,
        autor,
        ...post,
        fecha: fecha.toISOString(),
        hace: formatearTiempoHace(minutosAtras),
        respuestasPreview: respuestas
      };
    });

    // Ordenar por fecha y aplicar límite
    postsConAutor.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
    const postsLimitados = postsConAutor.slice(0, limite);

    return Response.json({
      success: true,
      posts: postsLimitados,
      total: POSTS_PREGENERADOS.length
    });

  } catch (error) {
    console.error('[COMUNIDAD/BOTS] Error:', error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}

// Respuestas de bots a posts reales (más variadas y contextuales)
const RESPUESTAS_A_USUARIOS = {
  experiencia: [
    'Qué hermoso lo que compartís! Me emociona leer esto 💜',
    'Gracias por abrir tu corazón. Este es un espacio seguro para todas',
    'Me pasó algo similar con mi guardián. Son increíbles',
    'Esto me da escalofríos de lo real que es. Gracias por compartir!',
    'Justo necesitaba leer algo así hoy. El universo no se equivoca',
    'Tu experiencia me inspira a seguir confiando en el proceso',
    'Qué lindo! Los guardianes siempre encuentran la forma de comunicarse',
    'Mi Gaia también me sorprende así. La protección es real 🌍',
    'Noah me ayudó igual cuando más lo necesitaba',
    'Winter es así, te enciende el fuego interior. Increíble',
    'Marcos me dio claridad igual. Son tan especiales los guardianes de enero'
  ],
  pregunta: [
    'Buena pregunta! A mí me funciona hacerlo en luna llena, pero cada una encuentra su camino',
    'Yo también tuve esa duda al principio. Con el tiempo vas encontrando tu ritmo',
    'Qué bueno que preguntes! Acá todas aprendemos juntas',
    'Te recomiendo empezar por lo que más te llame. Tu intuición sabe',
    'Me pasó lo mismo cuando empecé. Dale tiempo y vas a ver que fluye',
    'Los guardianes de enero (Gaia, Noah, Winter, Marcos) son perfectos para empezar',
    'Yo empecé con Marcos y ahora tengo los 4 de enero. Son complementarios',
    'Preguntale a tu guardián en meditación. Ellos responden'
  ],
  testimonio: [
    'Felicitaciones por tu adopción! Qué emoción',
    'Los guardianes eligen bien a quién acompañar. Te eligió!',
    'Me emocioné leyendo esto. Los comienzos son mágicos',
    'Bienvenida al Círculo! Vas a amar este camino',
    'Ese guardián te va a cambiar la vida. Ya vas a ver'
  ],
  tip: [
    'Gracias por el tip! Lo voy a probar esta semana',
    'Funciona! Yo hago lo mismo con mi guardián',
    'Anotadísimo. Me encanta aprender de ustedes',
    'Qué buen consejo! Nunca lo había pensado así'
  ],
  ritual: [
    'Ese ritual es poderoso! A mí también me funcionó',
    'Me encanta ese ritual. Lo hago cada luna llena',
    'Voy a probarlo con mi Noah esta semana',
    'Los rituales con los guardianes de enero son muy potentes'
  ],
  sincronicidad: [
    'Las sincronicidades son la forma en que el universo confirma que vamos bien',
    'Eso no es casualidad! Tu guardián te habló claro',
    'Me pasó algo parecido la semana pasada. Estamos conectadas',
    'Los guardianes siempre encuentran la forma de hacerse escuchar',
    'Increíble! El universo habla, hay que saber escuchar'
  ],
  general: [
    'Me encanta leer esto! 💜',
    'Qué bueno que lo compartas con nosotras',
    'Anotado! Gracias por el aporte',
    'Esto es oro. Gracias por compartir',
    'Amo esta comunidad, de verdad',
    'Qué hermoso!',
    'Tu energía se siente desde acá',
    'El Círculo de Duendes es un lugar mágico. Gracias por ser parte'
  ]
};

// Función para generar respuesta contextual de bot
function generarRespuestaBot(post) {
  const tipoPost = post.tipo || 'general';
  let respuestas = RESPUESTAS_A_USUARIOS[tipoPost] || RESPUESTAS_A_USUARIOS.general;

  // Si el post menciona un guardián de enero, mezclar con respuestas generales
  if (post.contenido) {
    const guardianesEnero = ['dorado', 'obsidiana', 'índigo', 'indigo', 'jade'];
    const mencionaGuardianEnero = guardianesEnero.some(g =>
      post.contenido.toLowerCase().includes(g)
    );
    if (mencionaGuardianEnero) {
      // Agregar algunas respuestas específicas de guardianes de enero
      respuestas = [...respuestas, ...RESPUESTAS_A_USUARIOS.experiencia.filter(r =>
        guardianesEnero.some(g => r.toLowerCase().includes(g))
      )];
    }
  }

  return respuestas[Math.floor(Math.random() * respuestas.length)];
}

// Función para seleccionar bots que interactúan
function seleccionarBotsParaInteraccion(cantidad = 3) {
  const shuffled = [...PERFILES_BOT].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, cantidad);
}

// POST: Agregar contenido de bot (para admin)
export async function POST(request) {
  try {
    const { accion, datos } = await request.json();

    switch (accion) {
      case 'agregar_post':
        // Guardar nuevo post personalizado
        const nuevoPost = {
          id: `post_custom_${Date.now()}`,
          tipo: datos.tipo || 'experiencia',
          contenido: datos.contenido,
          guardian: datos.guardian,
          likes: datos.likes || Math.floor(Math.random() * 50) + 10,
          respuestas: datos.respuestas || Math.floor(Math.random() * 10),
          creado: new Date().toISOString()
        };

        const postsCustom = await kv.get('comunidad:posts_custom') || [];
        postsCustom.push(nuevoPost);
        await kv.set('comunidad:posts_custom', postsCustom);

        return Response.json({ success: true, post: nuevoPost });

      case 'programar_actividad':
        // Programar posts automáticos
        const config = await kv.get('comunidad:config') || {
          postsPerDay: 3,
          respuestasPerDay: 8,
          activo: true
        };

        config.postsPerDay = datos.postsPerDay || config.postsPerDay;
        config.respuestasPerDay = datos.respuestasPerDay || config.respuestasPerDay;
        config.activo = datos.activo !== undefined ? datos.activo : config.activo;

        await kv.set('comunidad:config', config);
        return Response.json({ success: true, config });

      case 'obtener_perfiles':
        return Response.json({ success: true, perfiles: PERFILES_BOT });

      // ═══════════════════════════════════════════════════════════════════════
      // NUEVAS ACCIONES: INTERACCIÓN CON USUARIOS REALES
      // ═══════════════════════════════════════════════════════════════════════

      case 'interactuar_con_post': {
        // Cuando un usuario real publica, los bots pueden dar like y responder
        const { postId, postContenido, postTipo, autorEmail } = datos;

        if (!postId) {
          return Response.json({ success: false, error: 'postId requerido' }, { status: 400 });
        }

        // Determinar cuántos bots interactúan (2-5 likes, 1-3 respuestas)
        const numLikes = 2 + Math.floor(Math.random() * 4);
        const numRespuestas = Math.random() > 0.3 ? 1 + Math.floor(Math.random() * 3) : 0;

        const botsLike = seleccionarBotsParaInteraccion(numLikes);
        const botsRespuesta = seleccionarBotsParaInteraccion(numRespuestas);

        // Guardar interacciones de bots para este post
        const interacciones = {
          postId,
          likes: botsLike.map(bot => ({
            botId: bot.id,
            nombre: bot.nombre,
            pais: bot.pais,
            fecha: new Date().toISOString()
          })),
          respuestas: botsRespuesta.map(bot => ({
            botId: bot.id,
            nombre: bot.nombre,
            pais: bot.pais,
            avatar: bot.avatar,
            contenido: generarRespuestaBot({ tipo: postTipo, contenido: postContenido }),
            fecha: new Date(Date.now() + Math.random() * 3600000).toISOString() // Delay aleatorio hasta 1 hora
          })),
          creado: new Date().toISOString()
        };

        // Guardar en KV
        await kv.set(`comunidad:interaccion:${postId}`, interacciones, { ex: 30 * 24 * 60 * 60 }); // 30 días

        // Agregar a lista de interacciones pendientes (para mostrar gradualmente)
        const pendientes = await kv.get('comunidad:interacciones_pendientes') || [];
        pendientes.push({
          postId,
          likes: interacciones.likes.length,
          respuestas: interacciones.respuestas.length,
          programadoHasta: new Date(Date.now() + 3600000).toISOString()
        });
        await kv.set('comunidad:interacciones_pendientes', pendientes.slice(-100)); // Mantener últimas 100

        return Response.json({
          success: true,
          interacciones: {
            likes: interacciones.likes.length,
            respuestas: interacciones.respuestas.length
          }
        });
      }

      case 'obtener_interacciones_post': {
        // Obtener likes y respuestas de bots para un post específico
        const { postId } = datos;
        if (!postId) {
          return Response.json({ success: false, error: 'postId requerido' }, { status: 400 });
        }

        const interacciones = await kv.get(`comunidad:interaccion:${postId}`);
        return Response.json({
          success: true,
          interacciones: interacciones || { likes: [], respuestas: [] }
        });
      }

      case 'dar_like_bot': {
        // Un bot específico da like a un post
        const { postId, botId } = datos;
        if (!postId) {
          return Response.json({ success: false, error: 'postId requerido' }, { status: 400 });
        }

        const bot = botId
          ? PERFILES_BOT.find(b => b.id === botId)
          : PERFILES_BOT[Math.floor(Math.random() * PERFILES_BOT.length)];

        if (!bot) {
          return Response.json({ success: false, error: 'Bot no encontrado' }, { status: 404 });
        }

        // Obtener o crear interacciones del post
        let interacciones = await kv.get(`comunidad:interaccion:${postId}`) || { likes: [], respuestas: [] };

        // Verificar que el bot no haya dado like ya
        if (!interacciones.likes.find(l => l.botId === bot.id)) {
          interacciones.likes.push({
            botId: bot.id,
            nombre: bot.nombre,
            pais: bot.pais,
            fecha: new Date().toISOString()
          });
          await kv.set(`comunidad:interaccion:${postId}`, interacciones, { ex: 30 * 24 * 60 * 60 });
        }

        return Response.json({
          success: true,
          like: { bot: bot.nombre, pais: bot.pais }
        });
      }

      case 'responder_post_bot': {
        // Un bot específico responde a un post
        const { postId, botId, contenido, postTipo } = datos;
        if (!postId) {
          return Response.json({ success: false, error: 'postId requerido' }, { status: 400 });
        }

        const bot = botId
          ? PERFILES_BOT.find(b => b.id === botId)
          : PERFILES_BOT[Math.floor(Math.random() * PERFILES_BOT.length)];

        if (!bot) {
          return Response.json({ success: false, error: 'Bot no encontrado' }, { status: 404 });
        }

        // Generar o usar contenido proporcionado
        const respuestaContenido = contenido || generarRespuestaBot({ tipo: postTipo });

        // Obtener o crear interacciones del post
        let interacciones = await kv.get(`comunidad:interaccion:${postId}`) || { likes: [], respuestas: [] };

        const nuevaRespuesta = {
          botId: bot.id,
          nombre: bot.nombre,
          pais: bot.pais,
          avatar: bot.avatar,
          contenido: respuestaContenido,
          fecha: new Date().toISOString()
        };

        interacciones.respuestas.push(nuevaRespuesta);
        await kv.set(`comunidad:interaccion:${postId}`, interacciones, { ex: 30 * 24 * 60 * 60 });

        return Response.json({
          success: true,
          respuesta: nuevaRespuesta
        });
      }

      case 'actividad_diaria': {
        // Generar actividad diaria de bots (llamar desde cron o manualmente)
        const config = await kv.get('comunidad:config') || { postsPerDay: 3, respuestasPerDay: 8, activo: true };

        if (!config.activo) {
          return Response.json({ success: false, mensaje: 'Actividad de bots desactivada' });
        }

        // Obtener posts reales de usuarios para interactuar
        const postsReales = await kv.keys('foro:general:*');
        const resultados = { postsCreados: 0, interacciones: 0 };

        // 1. Crear posts de bots
        for (let i = 0; i < config.postsPerDay; i++) {
          const post = POSTS_PREGENERADOS[Math.floor(Math.random() * POSTS_PREGENERADOS.length)];
          const bot = PERFILES_BOT[Math.floor(Math.random() * PERFILES_BOT.length)];

          const nuevoPost = {
            id: `bot_post_${Date.now()}_${i}`,
            autorId: bot.id,
            autorNombre: bot.nombre,
            autorPais: bot.pais,
            autorAvatar: bot.avatar,
            esBot: true,
            tipo: post.tipo,
            contenido: post.contenido,
            guardian: post.guardian,
            likes: [],
            respuestas: [],
            creado: new Date().toISOString()
          };

          await kv.set(`foro:general:${nuevoPost.id}`, nuevoPost, { ex: 90 * 24 * 60 * 60 }); // 90 días
          resultados.postsCreados++;
        }

        // 2. Interactuar con posts reales
        for (const postKey of postsReales.slice(0, 10)) {
          const post = await kv.get(postKey);
          if (!post || post.esBot) continue; // No interactuar con otros bots

          // 70% de probabilidad de interactuar
          if (Math.random() < 0.7) {
            // Dar likes
            const numLikes = 1 + Math.floor(Math.random() * 3);
            const botsLike = seleccionarBotsParaInteraccion(numLikes);

            for (const bot of botsLike) {
              if (!post.likes) post.likes = [];
              if (!post.likes.find(l => l.id === bot.id)) {
                post.likes.push({
                  id: bot.id,
                  nombre: bot.nombre,
                  pais: bot.pais,
                  fecha: new Date().toISOString(),
                  esBot: true
                });
                resultados.interacciones++;
              }
            }

            // 40% de probabilidad de responder
            if (Math.random() < 0.4) {
              const botResp = PERFILES_BOT[Math.floor(Math.random() * PERFILES_BOT.length)];
              if (!post.respuestas) post.respuestas = [];

              post.respuestas.push({
                id: `resp_bot_${Date.now()}`,
                autorId: botResp.id,
                autorNombre: botResp.nombre,
                autorPais: botResp.pais,
                autorAvatar: botResp.avatar,
                contenido: generarRespuestaBot(post),
                fecha: new Date().toISOString(),
                esBot: true
              });
              resultados.interacciones++;
            }

            await kv.set(postKey, post);
          }
        }

        // Guardar registro de actividad
        await kv.set('comunidad:ultima_actividad', {
          fecha: new Date().toISOString(),
          ...resultados
        });

        return Response.json({
          success: true,
          resultados,
          mensaje: `Creados ${resultados.postsCreados} posts, ${resultados.interacciones} interacciones`
        });
      }

      default:
        return Response.json({ success: false, error: 'Acción no reconocida' }, { status: 400 });
    }

  } catch (error) {
    console.error('[COMUNIDAD/BOTS] Error POST:', error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
