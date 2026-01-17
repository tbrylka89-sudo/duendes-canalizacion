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
  // Experiencias con guardianes específicos
  { tipo: 'experiencia', guardian: 'Rowan', contenido: 'Desde que llegó Rowan a mi casa, siento que las cosas fluyen diferente. Ayer me llamaron para una oportunidad de trabajo que había olvidado. ¡Gracias universo! ✨', likes: 45, respuestas: 8 },
  { tipo: 'experiencia', guardian: 'Luna', contenido: 'Luna me acompañó toda la semana de luna llena. Mis sueños fueron tan vívidos y reveladores... Desperté con claridad sobre algo que me venía preocupando hace meses 🌙', likes: 67, respuestas: 12 },
  { tipo: 'experiencia', guardian: 'Frost', contenido: 'Necesitaba protección energética en el trabajo y Frost llegó en el momento justo. Desde entonces, los ambientes pesados ya no me afectan como antes 🛡️', likes: 38, respuestas: 6 },
  { tipo: 'experiencia', guardian: 'Sage', contenido: 'Sage me ayudó a soltar algo que venía cargando hace años. Una noche mientras meditaba con él, lloré todo lo que tenía guardado. Hoy me siento liviana 💚', likes: 89, respuestas: 15 },
  { tipo: 'experiencia', guardian: 'Aurora', contenido: 'Aurora llegó justo cuando empezaba un nuevo capítulo en mi vida. Su energía de nuevos comienzos me da fuerzas cada mañana ☀️', likes: 52, respuestas: 9 },
  { tipo: 'experiencia', guardian: 'Ember', contenido: 'No creía mucho al principio, pero Ember despertó algo en mí. Mi creatividad explotó esta semana, no paraba de tener ideas 🔥', likes: 43, respuestas: 7 },

  // Preguntas y dudas
  { tipo: 'pregunta', contenido: '¿Alguien más siente que su guardián "habla" a través de coincidencias? Me pasan cosas muy locas desde que llegó...', likes: 34, respuestas: 23 },
  { tipo: 'pregunta', contenido: 'Primera vez en el Círculo 🙈 ¿Por dónde me recomiendan empezar? Siento que necesito protección pero también abundancia...', likes: 28, respuestas: 31 },
  { tipo: 'pregunta', contenido: '¿Cada cuánto hacen las tiradas de runas? ¿Una vez al mes o cuando sienten que lo necesitan?', likes: 19, respuestas: 14 },
  { tipo: 'pregunta', contenido: '¿Cómo limpian la energía de sus guardianes? Leí que hay que hacerlo con la luna pero no sé bien cómo', likes: 41, respuestas: 27 },

  // Agradecimientos y celebraciones
  { tipo: 'agradecimiento', contenido: '¡3 meses en el Círculo y no puedo creer lo que cambió mi vida! Gracias Thibisay, gracias a esta comunidad hermosa 💜', likes: 112, respuestas: 19 },
  { tipo: 'agradecimiento', contenido: 'La lectura de registros akáshicos que hice la semana pasada me voló la cabeza. Nunca nadie me había dicho cosas tan precisas de mi infancia...', likes: 78, respuestas: 11 },
  { tipo: 'agradecimiento', contenido: 'Hoy adopté mi tercer guardián y estoy llorando de emoción. Siento que encontré mi tribu acá 🥹', likes: 95, respuestas: 16 },

  // Tips y consejos
  { tipo: 'tip', contenido: 'TIP: Pongan a su guardián cerca de una ventana durante las noches de luna llena. La energía que absorbe es increíble 🌕', likes: 156, respuestas: 22 },
  { tipo: 'tip', contenido: 'Algo que me funciona: antes de dormir le cuento a mi guardián lo que me preocupa. A la mañana siguiente siempre tengo más claridad', likes: 87, respuestas: 13 },
  { tipo: 'tip', contenido: 'Para las que recién empiezan: no fuercen la conexión. Dejen que su guardián les muestre el camino a su ritmo 💫', likes: 134, respuestas: 18 },

  // Rituales compartidos
  { tipo: 'ritual', contenido: 'Hoy hice el ritual de abundancia que compartió Thibisay y encontré $500 en un bolsillo que no revisaba hace meses 😱', likes: 203, respuestas: 34 },
  { tipo: 'ritual', contenido: 'Cada domingo limpio el espacio con salvia y pongo música suave. Mis guardianes brillan diferente después ✨', likes: 67, respuestas: 9 },

  // Sincronicidades
  { tipo: 'sincronicidad', contenido: 'No me van a creer: estaba pensando en mi abuela (que ya no está) y en ese momento Rowan se cayó solo del estante. Sentí que era ella saludándome 🥺', likes: 178, respuestas: 28 },
  { tipo: 'sincronicidad', contenido: 'Soñé con un número, lo jugué al otro día y gané! Mi guardián me lo mostró, no tengo dudas 🎰', likes: 145, respuestas: 21 }
];

// Respuestas pregeneradas para los posts
const RESPUESTAS_PREGENERADAS = [
  '¡Me pasa lo mismo! No estás sola en esto 💜',
  'Hermoso lo que compartís. Gracias por abrir tu corazón',
  '¡Qué lindo! Los guardianes siempre encuentran la forma de comunicarse',
  'Esto me dio escalofríos, es muy real lo que decís',
  'Te mando un abrazo enorme. El Círculo es un espacio seguro 🤗',
  'Justo necesitaba leer esto hoy. Gracias universo',
  '¡Bienvenida! Vas a amar este camino',
  'Mi guardián también hace esas cosas. Son increíbles',
  'Qué bueno que lo compartís, ayuda a todas a sentirnos menos locas jaja',
  '✨✨✨ Pura magia',
  'Me emociona leer esto. Estamos todas conectadas',
  'Anotado el tip! Lo voy a probar esta semana',
  'Amo esta comunidad, de verdad',
  'Que siga fluyendo todo hermoso 🌸',
  'Tu energía se siente desde acá. Gracias por compartir',
  '¡Felicitaciones! Los guardianes eligen bien a quién acompañar',
  'Esto es lo que necesitaba leer hoy. No es casualidad',
  'El universo siempre responde cuando estamos listas para escuchar'
];

// GET: Obtener posts y actividad de la comunidad
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const tipo = searchParams.get('tipo'); // posts, actividad, stats
    const limite = parseInt(searchParams.get('limite') || '10');

    if (tipo === 'stats') {
      // Estadísticas de la comunidad (fijas + algo de variación)
      const hora = new Date().getHours();
      const variacion = Math.floor(Math.sin(hora) * 15);

      return Response.json({
        success: true,
        stats: {
          totalMiembros: 324 + Math.floor(Math.random() * 12),
          miembrosActivos: 47 + variacion,
          postsHoy: 3 + Math.floor(Math.random() * 2),
          guardianesCirulo: 892
        }
      });
    }

    if (tipo === 'actividad') {
      // "X personas viendo ahora"
      const viendoAhora = 8 + Math.floor(Math.random() * 15);
      const ultimaCompra = PERFILES_BOT[Math.floor(Math.random() * PERFILES_BOT.length)];
      const guardianesPopulares = ['Rowan', 'Luna', 'Sage', 'Frost', 'Aurora', 'Ember'];
      const guardianComprado = guardianesPopulares[Math.floor(Math.random() * guardianesPopulares.length)];

      // Tiempo aleatorio "hace X minutos"
      const minutosAtras = 2 + Math.floor(Math.random() * 25);

      return Response.json({
        success: true,
        actividad: {
          viendoAhora,
          ultimaCompra: {
            nombre: ultimaCompra.nombre,
            pais: ultimaCompra.pais,
            guardian: guardianComprado,
            hace: `${minutosAtras} min`
          },
          escribiendo: Math.random() > 0.6 ? PERFILES_BOT[Math.floor(Math.random() * PERFILES_BOT.length)].nombre : null
        }
      });
    }

    // Posts de la comunidad (mezcla de pregenerados con fechas aleatorias)
    const postsConAutor = POSTS_PREGENERADOS.map((post, i) => {
      const autor = PERFILES_BOT[i % PERFILES_BOT.length];
      const horasAtras = Math.floor(Math.random() * 72); // últimas 72 horas
      const fecha = new Date(Date.now() - horasAtras * 60 * 60 * 1000);

      // Generar respuestas aleatorias
      const numRespuestas = Math.min(post.respuestas, 5);
      const respuestas = [];
      for (let j = 0; j < numRespuestas; j++) {
        const autorResp = PERFILES_BOT[(i + j + 10) % PERFILES_BOT.length];
        respuestas.push({
          autor: autorResp,
          contenido: RESPUESTAS_PREGENERADAS[Math.floor(Math.random() * RESPUESTAS_PREGENERADAS.length)],
          hace: `${Math.floor(Math.random() * horasAtras)}h`
        });
      }

      return {
        id: `post_${i}`,
        autor,
        ...post,
        fecha: fecha.toISOString(),
        hace: horasAtras < 1 ? 'hace un momento' :
              horasAtras < 24 ? `hace ${horasAtras}h` :
              `hace ${Math.floor(horasAtras / 24)} días`,
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

      default:
        return Response.json({ success: false, error: 'Acción no reconocida' }, { status: 400 });
    }

  } catch (error) {
    console.error('[COMUNIDAD/BOTS] Error POST:', error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
