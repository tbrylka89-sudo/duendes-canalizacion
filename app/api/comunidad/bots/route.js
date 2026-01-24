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

// ═══════════════════════════════════════════════════════════════════════════════
// NOMBRES DE GUARDIANES FICTICIOS (únicos, creíbles, NO existen en la web)
// Para posts donde dicen que "compraron" un guardián - cada nombre solo aparece 1 vez
// ═══════════════════════════════════════════════════════════════════════════════
// IMPORTANTE: Estos nombres NO existen en la web de Duendes del Uruguay
// Verificado contra la lista real de guardianes - ninguno de estos es real
const GUARDIANES_FICTICIOS = [
  // Nombres célticos/irlandeses (no usados en la web)
  'Eileen', 'Brigid', 'Fionn', 'Aisling', 'Ronan', 'Niamh', 'Cormac', 'Sorcha',
  'Declan', 'Siobhan', 'Padraig', 'Aoife', 'Ciaran', 'Maeve', 'Oisin', 'Roisin',
  // Nombres nórdicos (SIN los que son reales: Freya, Astrid, Björn)
  'Sigrid', 'Thorin', 'Ragnar', 'Leif', 'Ingrid', 'Gunnar', 'Helga', 'Harald',
  'Thyra', 'Ivar', 'Solveig', 'Magnus', 'Sigurd', 'Hilda', 'Olaf', 'Dagny',
  // Nombres de naturaleza (SIN los que son reales: Jade)
  'Roble', 'Sauce', 'Cedro', 'Helecho', 'Musgo', 'Ámbar', 'Coral', 'Hiedra',
  'Liquen', 'Brezo', 'Tejo', 'Fresno', 'Saúco', 'Acebo', 'Abeto', 'Ciprés',
  // Nombres esotéricos (SIN los que son reales: Selene)
  'Orion', 'Vega', 'Lyra', 'Nova', 'Cassio', 'Polaris', 'Rigel', 'Altais',
  'Deneb', 'Capella', 'Sirio', 'Mira', 'Electra', 'Alcyone', 'Castor', 'Antares',
  // Nombres simples místicos
  'Alma', 'Luz', 'Paz', 'Vida', 'Fe', 'Alba', 'Cielo', 'Brisa',
  // Nombres medievales/fantásticos (verificados que no existen)
  'Gwendolyn', 'Aldric', 'Rowena', 'Cedric', 'Elara', 'Theron', 'Isolde', 'Gareth'
];

// Guardianes MINI (estos SÍ pueden repetirse porque varias personas los tienen)
const GUARDIANES_MINI = ['Toto', 'Ruperto', 'Brianna', 'Zoe', 'Heart', 'Moon'];

// Posts pregenerados - REESCRITOS para ser realistas
const POSTS_PREGENERADOS = [
  // ═══════════════════════════════════════════════════════════════════════════════
  // POSTS SOBRE CONTENIDO DEL CÍRCULO (rituales, meditaciones, artículos)
  // ═══════════════════════════════════════════════════════════════════════════════
  { tipo: 'contenido', contenido: '¿Hicieron el ritual de hoy? Quedé flasheada con la parte del cuarzo. Lo voy a repetir esta noche 🔮', likes: 89, respuestas: 23 },
  { tipo: 'contenido', contenido: 'La meditación de esta mañana me hizo llorar. Justo lo que necesitaba soltar. Gracias Círculo 💜', likes: 134, respuestas: 28 },
  { tipo: 'contenido', contenido: 'El artículo sobre protección energética de ayer está BUENÍSIMO. Lo releí 3 veces y sigo descubriendo cosas', likes: 112, respuestas: 19 },
  { tipo: 'contenido', contenido: 'No me pierdo la guía de los domingos. Hoy armé mi altar siguiendo las instrucciones y quedó hermoso ✨', likes: 98, respuestas: 21 },
  { tipo: 'contenido', contenido: '¿Alguien más sintió la energía rara durante la reflexión de anoche? Fue como si algo se moviera', likes: 78, respuestas: 34 },
  { tipo: 'contenido', contenido: 'El contenido de hoy sobre abundancia me llegó en el momento exacto. Estaba justamente pensando en eso', likes: 145, respuestas: 27 },
  { tipo: 'contenido', contenido: 'Cada vez que leo el mensaje del día siento que me hablan a mí directamente. ¿Les pasa?', likes: 167, respuestas: 42 },
  { tipo: 'contenido', contenido: 'La práctica de los sábados es mi favorita. Hoy fue sobre cristales y aprendí banda de cosas nuevas', likes: 87, respuestas: 16 },

  // ═══════════════════════════════════════════════════════════════════════════════
  // PREGUNTAS SOBRE EL CONTENIDO
  // ═══════════════════════════════════════════════════════════════════════════════
  { tipo: 'pregunta', contenido: 'En el ritual de hoy dice "visualizar luz dorada" pero a mí me sale violeta. ¿Está mal? ¿A alguien más le pasa?', likes: 56, respuestas: 38 },
  { tipo: 'pregunta', contenido: '¿Alguien me explica la parte del sahumerio del artículo de ayer? No entendí si hay que apagarlo o dejarlo', likes: 34, respuestas: 27 },
  { tipo: 'pregunta', contenido: 'La meditación de hoy es de 20 minutos. ¿La hacen entera o por partes? Es que me cuesta concentrarme tanto rato', likes: 45, respuestas: 31 },
  { tipo: 'pregunta', contenido: '¿El ejercicio de journaling de hoy lo hacen a mano o en la compu? Leí que a mano es mejor pero no sé', likes: 28, respuestas: 19 },
  { tipo: 'pregunta', contenido: 'Primera vez haciendo el ritual de luna. ¿A qué hora es mejor? ¿De noche o al amanecer?', likes: 67, respuestas: 44 },
  { tipo: 'pregunta', contenido: '¿Cada cuánto publican contenido nuevo? Recién llegué y estoy perdida jaja', likes: 23, respuestas: 15 },
  { tipo: 'pregunta', contenido: '¿Los audios de meditación se pueden descargar? Me gustaría escucharlos sin wifi', likes: 41, respuestas: 12 },

  // ═══════════════════════════════════════════════════════════════════════════════
  // EXPERIENCIAS CON GUARDIANES ÚNICOS (nombres ficticios verificados, cada uno aparece 1 sola vez)
  // ═══════════════════════════════════════════════════════════════════════════════
  { tipo: 'experiencia', guardian: 'Eileen', contenido: 'Mi Eileen llegó ayer y ya siento la diferencia. Dormí como no dormía hace meses. Ella me protege 💚', likes: 89, respuestas: 15 },
  { tipo: 'experiencia', guardian: 'Thorin', contenido: 'Thorin es imponente. Cuando lo vi supe que era para mí. Desde que está conmigo me siento más fuerte', likes: 112, respuestas: 19 },
  { tipo: 'experiencia', guardian: 'Orion', contenido: 'Adopté a Orion en luna llena y fue la mejor decisión. Su energía estelar me acompaña cada noche ✨', likes: 134, respuestas: 24 },
  { tipo: 'experiencia', guardian: 'Roble', contenido: 'Mi Roble es inmenso y me da una sensación de arraigo increíble. Es mi ancla a tierra cuando todo se mueve', likes: 98, respuestas: 17 },
  { tipo: 'experiencia', guardian: 'Brigid', contenido: 'Brigid me eligió a mí, no al revés. La vi y sentí que me llamaba. Ahora entiendo el significado de conexión', likes: 145, respuestas: 28 },
  { tipo: 'experiencia', guardian: 'Ámbar', contenido: 'Mi pequeña Ámbar brilla diferente con la luz del sol. La pongo en la ventana y siento su calor todo el día 🌅', likes: 78, respuestas: 13 },
  { tipo: 'experiencia', guardian: 'Fionn', contenido: 'Fionn me está enseñando paciencia. Cada vez que me acelero, siento su presencia que me calma', likes: 87, respuestas: 16 },
  { tipo: 'experiencia', guardian: 'Sigrid', contenido: 'Mi vikinga Sigrid es guerrera como yo. Juntas estamos enfrentando cosas que antes me daban miedo', likes: 156, respuestas: 31 },

  // ═══════════════════════════════════════════════════════════════════════════════
  // EXPERIENCIAS CON GUARDIANES MINI (estos SÍ pueden repetirse)
  // ═══════════════════════════════════════════════════════════════════════════════
  { tipo: 'experiencia', guardian: 'Toto', contenido: 'Mi Toto es chiquito pero poderoso! Lo llevo en la cartera a todos lados y me da suerte 🍀', likes: 67, respuestas: 21 },
  { tipo: 'experiencia', guardian: 'Toto', contenido: 'Toto es el mejor compañero de viaje. Lo llevé a mis vacaciones y todo fluyó perfecto', likes: 54, respuestas: 18 },
  { tipo: 'experiencia', guardian: 'Ruperto', contenido: 'Mi Ruperto cuida la casa mientras no estoy. Siempre lo saludo cuando llego 🏠', likes: 78, respuestas: 14 },
  { tipo: 'experiencia', guardian: 'Brianna', contenido: 'Brianna es mi protectora. La tengo en mi mesa de luz y duermo tranquila desde que llegó', likes: 89, respuestas: 19 },
  { tipo: 'experiencia', guardian: 'Zoe', contenido: 'Mi Zoe es pura alegría. Desde que la tengo sonrío más, es increíble lo que transmite', likes: 92, respuestas: 22 },
  { tipo: 'experiencia', guardian: 'Heart', contenido: 'Heart me ayudó a abrir el corazón después de una ruptura. Ahora puedo amar de nuevo 💕', likes: 123, respuestas: 27 },
  { tipo: 'experiencia', guardian: 'Moon', contenido: 'Mi Moon brilla en la oscuridad! La pongo cerca de la cama y me conecta con mis sueños 🌙', likes: 87, respuestas: 16 },

  // ═══════════════════════════════════════════════════════════════════════════════
  // PREGUNTAS GENERALES (sin mencionar guardianes específicos o mencionando minis)
  // ═══════════════════════════════════════════════════════════════════════════════
  { tipo: 'pregunta', contenido: '¿Alguien más siente que su guardián "habla" a través de coincidencias? Me pasan cosas locas desde que llegó...', likes: 34, respuestas: 23 },
  { tipo: 'pregunta', contenido: 'Primera vez en el Círculo. ¿Por dónde me recomiendan empezar? Estoy un poco perdida', likes: 28, respuestas: 31 },
  { tipo: 'pregunta', contenido: '¿Cómo limpian la energía de sus guardianes? Leí que hay que hacerlo con la luna pero no sé cómo', likes: 41, respuestas: 27 },
  { tipo: 'pregunta', contenido: '¿Cuántos guardianes tienen? Yo tengo 3 y no sé si es mucho o poco jaja', likes: 56, respuestas: 33 },
  { tipo: 'pregunta', contenido: '¿Dónde ubican a sus guardianes en la casa? Busco ideas para armar un espacio lindo', likes: 45, respuestas: 28 },
  { tipo: 'pregunta', contenido: '¿Los Toto son buenos para llevar encima? Quiero uno para tener siempre conmigo', likes: 38, respuestas: 24 },
  { tipo: 'pregunta', contenido: '¿Las que tienen varios guardianes los presentan entre sí? ¿Cómo lo hacen?', likes: 34, respuestas: 21 },

  // ═══════════════════════════════════════════════════════════════════════════════
  // AGRADECIMIENTOS Y CELEBRACIONES
  // ═══════════════════════════════════════════════════════════════════════════════
  { tipo: 'agradecimiento', contenido: '3 meses en el Círculo y no puedo creer lo que cambió mi vida! Gracias a esta comunidad hermosa 💜', likes: 112, respuestas: 19 },
  { tipo: 'agradecimiento', contenido: 'Hoy adopté mi tercer guardián y estoy llorando de emoción. Siento que encontré mi tribu acá', likes: 95, respuestas: 16 },
  { tipo: 'agradecimiento', contenido: 'Gracias Thibisay por crear este espacio. Me salvó en un momento muy oscuro de mi vida', likes: 234, respuestas: 45 },
  { tipo: 'agradecimiento', contenido: 'El contenido del Círculo es increíble. Cada día aprendo algo nuevo. Gracias por tanto 🙏', likes: 178, respuestas: 37 },
  { tipo: 'agradecimiento', contenido: 'Un año en el Círculo! No puedo creer todo lo que cambió. Gracias infinitas ✨', likes: 189, respuestas: 42 },

  // ═══════════════════════════════════════════════════════════════════════════════
  // TIPS Y CONSEJOS (sin nombrar guardianes específicos únicos)
  // ═══════════════════════════════════════════════════════════════════════════════
  { tipo: 'tip', contenido: 'TIP: Pongan a su guardián cerca de una ventana durante las noches de luna llena. La energía que absorbe es increíble', likes: 156, respuestas: 22 },
  { tipo: 'tip', contenido: 'Algo que me funciona: antes de dormir le cuento a mi guardián lo que me preocupa. A la mañana tengo más claridad', likes: 87, respuestas: 13 },
  { tipo: 'tip', contenido: 'Para las que recién empiezan: no fuercen la conexión. Dejen que su guardián les muestre el camino a su ritmo 💫', likes: 134, respuestas: 18 },
  { tipo: 'tip', contenido: 'Si sienten que no conectan con su guardián, prueben meditar con él. Cambió todo para mí', likes: 98, respuestas: 24 },
  { tipo: 'tip', contenido: 'Los minis son ideales para llevar encima. Yo llevo mi Toto a todos lados y me da seguridad', likes: 112, respuestas: 27 },
  { tipo: 'tip', contenido: 'Si tienen varios guardianes, armen un altar donde estén todos juntos. La energía se potencia', likes: 145, respuestas: 31 },

  // ═══════════════════════════════════════════════════════════════════════════════
  // COMENTARIOS SOBRE RITUALES PUBLICADOS
  // ═══════════════════════════════════════════════════════════════════════════════
  { tipo: 'ritual', contenido: 'Hice el ritual de abundancia de esta semana y encontré plata que no sabía que tenía. Funciona!', likes: 203, respuestas: 34 },
  { tipo: 'ritual', contenido: 'Cada domingo hago el ritual de limpieza que compartieron. Mi casa se siente diferente después', likes: 67, respuestas: 9 },
  { tipo: 'ritual', contenido: 'El ritual de protección de ayer fue muy fuerte. Lo hice con velas blancas como decía y dormí re bien', likes: 89, respuestas: 18 },
  { tipo: 'ritual', contenido: 'Hice el ritual de luna nueva que publicaron y pedí algo. A la semana se cumplió. No lo puedo creer 🌑', likes: 156, respuestas: 38 },
  { tipo: 'ritual', contenido: 'El ritual de los 4 elementos del contenido de ayer fue increíble. Lo voy a repetir cada mes', likes: 112, respuestas: 25 },

  // ═══════════════════════════════════════════════════════════════════════════════
  // SINCRONICIDADES (sin nombres específicos de guardianes únicos)
  // ═══════════════════════════════════════════════════════════════════════════════
  { tipo: 'sincronicidad', contenido: 'Estaba pensando en mi abuela (que ya no está) y mi guardián se cayó solo del estante. Sentí que era ella', likes: 178, respuestas: 28 },
  { tipo: 'sincronicidad', contenido: 'Pedí una señal sobre una decisión. A los 5 minutos vi un arcoíris. Era mi confirmación 🌈', likes: 167, respuestas: 32 },
  { tipo: 'sincronicidad', contenido: 'Soñé con algo muy específico y al otro día pasó. Mi guardián me está mostrando cosas', likes: 145, respuestas: 21 },
  { tipo: 'sincronicidad', contenido: 'Justo cuando dudaba de todo, el contenido del día habló EXACTAMENTE de lo que me pasaba. No es casualidad', likes: 134, respuestas: 26 },
  { tipo: 'sincronicidad', contenido: 'Mi guardián brilló diferente justo cuando estaba llorando. Sentí que me abrazaba 💜', likes: 189, respuestas: 33 },

  // ═══════════════════════════════════════════════════════════════════════════════
  // REFLEXIONES SOBRE EL CÍRCULO
  // ═══════════════════════════════════════════════════════════════════════════════
  { tipo: 'reflexion', contenido: 'Hace un año no creía en nada de esto. Hoy tengo 4 guardianes y mi vida es completamente diferente. A veces el universo te sorprende', likes: 189, respuestas: 36 },
  { tipo: 'reflexion', contenido: 'Los guardianes no hacen magia por nosotras. Nos acompañan mientras hacemos nuestra propia magia. Eso lo entendí con el tiempo', likes: 234, respuestas: 47 },
  { tipo: 'reflexion', contenido: 'El contenido del Círculo me cambió la forma de ver las cosas. Cada ritual, cada meditación, todo suma', likes: 145, respuestas: 29 },
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
  'Pura magia ✨',
  'Me emociona leer esto. Estamos todas conectadas',
  'Anotado el tip! Lo voy a probar esta semana',
  'Amo esta comunidad, de verdad',
  'Que siga fluyendo todo hermoso',
  'Tu energía se siente desde acá. Gracias por compartir',
  'Felicitaciones! Los guardianes eligen bien a quién acompañar',
  'Esto es lo que necesitaba leer hoy. No es casualidad',
  'El universo siempre responde cuando estamos listas para escuchar',

  // Respuestas sobre contenido del Círculo
  'El contenido de hoy estaba buenísimo! Lo releí 2 veces',
  'Hiciste el ritual? A mí me funcionó increíble',
  'La meditación de esta semana me encantó. La voy a repetir',
  'Esa parte del artículo también me resonó mucho',
  'Voy a probar lo que dicen en el contenido de hoy',
  'El Círculo cada vez tiene mejor contenido. Gracias equipo!',
  'A mí también me pasó lo mismo con ese ejercicio',

  // Respuestas a experiencias
  'Me emocioné leyendo esto. Gracias por compartir',
  'Qué hermoso testimonio. Me da esperanza',
  'Justo estoy pasando por algo similar. Me ayudó leerte',
  'Los guardianes nunca se equivocan al elegir',
  'Tu historia me tocó el corazón 💜',
  'Qué lindo lo que contás! Ojalá me pase algo así',
  'Los minis son increíbles! El mío también hace cosas así',

  // Respuestas a preguntas
  'A mí me funciona hacerlo en luna llena, pero cada una encuentra su ritmo',
  'Yo empecé con uno solo y ahora tengo varios. Ve de a poco',
  'Te recomiendo que sigas tu intuición. Si te llamó ese guardián, es por algo',
  'Preguntale a tu guardián, ellos guían',
  'Yo tuve la misma duda! A mí me sirvió...',
  'Hay un artículo en el Círculo sobre eso, buscalo!',
  'Lo mejor es ir probando y ver qué te funciona',

  // Respuestas a tips
  'Gracias por el tip! Lo voy a probar',
  'Funciona! Yo hago lo mismo',
  'Anotadísimo para esta semana',
  'Qué buen consejo, nunca lo había pensado así',
  'Esto lo tengo que probar sí o sí',

  // Respuestas a rituales
  'Ese ritual es poderoso! A mí también me funcionó',
  'Me encanta ese ritual. Lo hago seguido',
  'Voy a probarlo esta luna llena',
  'Agregué algunas cosas y quedó más potente todavía',

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
          // Los populares son minis (que muchos tienen) + algunos ficticios rotativos
          guardianesPopulares: ['Toto', 'Heart', 'Ruperto', 'Brianna'].slice(0, 2 + Math.floor(Math.random() * 2))
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

      // Para "última compra" usamos nombres FICTICIOS (guardianes únicos)
      // o MINI (que sí pueden repetirse porque varias personas los tienen)
      // 40% minis (pueden repetir), 60% ficticios (únicos, no repiten)
      const usarMini = Math.random() < 0.4;

      let guardianComprado;
      if (usarMini) {
        // Guardianes mini - pueden repetirse
        guardianComprado = GUARDIANES_MINI[Math.floor(Math.random() * GUARDIANES_MINI.length)];
      } else {
        // Guardianes ficticios únicos - cada nombre solo aparece 1 vez por sesión
        const guardianesRecientes = new Set(historialReciente.guardianes || []);
        const guardianesDisponibles = GUARDIANES_FICTICIOS.filter(g => !guardianesRecientes.has(g));
        guardianComprado = guardianesDisponibles.length > 0
          ? guardianesDisponibles[Math.floor(Math.random() * guardianesDisponibles.length)]
          : GUARDIANES_FICTICIOS[Math.floor(Math.random() * GUARDIANES_FICTICIOS.length)];
      }

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
