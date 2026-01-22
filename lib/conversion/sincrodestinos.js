/**
 * BASE DE SINCRODESTINOS REALES
 *
 * Eventos que "sucedieron" durante la creación del guardián.
 * Deben ser:
 * - Creíbles (no exagerados)
 * - Sutiles (no "el universo explotó")
 * - Específicos (detalles concretos)
 * - Variados (no repetir tipos)
 */

export const sincrodestinos = [
  // TIPO: tiempo
  {
    texto: "Mientras la modelaba, el reloj del taller se detuvo. Cuando terminé, volvió a funcionar solo.",
    tipo: "tiempo",
    impacto: "alto",
    genero: "f"
  },
  {
    texto: "Empecé a trabajar en él a las 3:33 de la madrugada. Me desperté sin despertador, sabiendo que era el momento.",
    tipo: "tiempo",
    impacto: "alto",
    genero: "m"
  },
  {
    texto: "Tardé exactamente 7 horas en terminarla. Ni más ni menos. No lo planifiqué.",
    tipo: "tiempo",
    impacto: "medio",
    genero: "f"
  },

  // TIPO: música
  {
    texto: "Sonó una canción que no escuchaba hace años, justo cuando elegía su cristal. Era la canción favorita de mi abuela.",
    tipo: "musica",
    impacto: "alto",
    genero: "m"
  },
  {
    texto: "La radio empezó a fallar mientras pintaba sus ojos. Cuando terminé, volvió perfecta.",
    tipo: "musica",
    impacto: "medio",
    genero: "m"
  },
  {
    texto: "Tenía la playlist en aleatorio. Sonaron tres canciones seguidas sobre nuevos comienzos.",
    tipo: "musica",
    impacto: "medio",
    genero: "f"
  },

  // TIPO: animal
  {
    texto: "El gato, que nunca entra al taller, se sentó a mirar todo el proceso sin moverse.",
    tipo: "animal",
    impacto: "medio",
    genero: "m"
  },
  {
    texto: "Un pájaro se posó en la ventana justo cuando terminé de sellarla. Se quedó varios minutos.",
    tipo: "animal",
    impacto: "alto",
    genero: "f"
  },
  {
    texto: "Mi perra ladró una sola vez mientras la creaba. Una. Nunca lo hace.",
    tipo: "animal",
    impacto: "medio",
    genero: "f"
  },
  {
    texto: "Una mariposa entró al taller. En pleno invierno.",
    tipo: "animal",
    impacto: "alto",
    genero: "m"
  },

  // TIPO: objeto
  {
    texto: "Se me cayó el pincel de la mano cuando iba a usar otro color. Entendí que ese no era el correcto.",
    tipo: "objeto",
    impacto: "medio",
    genero: "m"
  },
  {
    texto: "El cristal que elegí se partió a la mitad. El que quedó era exactamente lo que necesitaba.",
    tipo: "objeto",
    impacto: "alto",
    genero: "m"
  },
  {
    texto: "Encontré una pluma en la mesa del taller. No tenemos pájaros cerca.",
    tipo: "objeto",
    impacto: "alto",
    genero: "f"
  },
  {
    texto: "La arcilla tomó una forma que no era la que yo tenía pensada. Confié. Salió mejor.",
    tipo: "objeto",
    impacto: "medio",
    genero: "f"
  },
  {
    texto: "Se rompió el molde que siempre uso. Tuve que hacerla de cero, a mano. Salió perfecta.",
    tipo: "objeto",
    impacto: "alto",
    genero: "f"
  },

  // TIPO: sueño
  {
    texto: "Esa noche soñé con su nombre antes de saber que existía.",
    tipo: "sueno",
    impacto: "alto",
    genero: "m"
  },
  {
    texto: "Me desperté sabiendo exactamente qué colores necesitaba. Ni yo entiendo cómo.",
    tipo: "sueno",
    impacto: "medio",
    genero: "f"
  },
  {
    texto: "Soñé con alguien que no conozco preguntándome '¿ya la terminaste?'. Al día siguiente, la terminé.",
    tipo: "sueno",
    impacto: "alto",
    genero: "f"
  },

  // TIPO: clima
  {
    texto: "Empezó a llover exactamente cuando terminé de sellarla. Como un bautismo.",
    tipo: "clima",
    impacto: "medio",
    genero: "f"
  },
  {
    texto: "Hubo tormenta toda la noche mientras trabajaba. Al amanecer, todo claro.",
    tipo: "clima",
    impacto: "medio",
    genero: "m"
  },
  {
    texto: "El sol entró por la ventana e iluminó exactamente el lugar donde la estaba terminando.",
    tipo: "clima",
    impacto: "alto",
    genero: "f"
  },

  // TIPO: electricidad
  {
    texto: "Las luces del taller titilaron tres veces. Solo pasa cuando algo importante está naciendo.",
    tipo: "electricidad",
    impacto: "medio",
    genero: "m"
  },
  {
    texto: "Se cortó la luz cuando iba a guardarla. Cuando volvió, algo en su expresión había cambiado.",
    tipo: "electricidad",
    impacto: "alto",
    genero: "f"
  },

  // TIPO: persona
  {
    texto: "Mi hija entró al taller y dijo el nombre del guardián antes de que yo lo decidiera.",
    tipo: "persona",
    impacto: "muy_alto",
    genero: "m"
  },
  {
    texto: "Una amiga me escribió preguntando si estaba creando algo. Justo en ese momento.",
    tipo: "persona",
    impacto: "medio",
    genero: "f"
  },
  {
    texto: "Alguien me preguntó '¿para quién es?' No supe responder. Ahora sé que era para vos.",
    tipo: "persona",
    impacto: "alto",
    genero: "m"
  },

  // TIPO: sensación física
  {
    texto: "Sentí un escalofrío cuando terminé de pintarle los ojos. No hacía frío.",
    tipo: "sensacion",
    impacto: "medio",
    genero: "m"
  },
  {
    texto: "Me picaban las manos mientras trabajaba en ella. Algo quería salir.",
    tipo: "sensacion",
    impacto: "medio",
    genero: "f"
  },
  {
    texto: "Tuve que parar tres veces porque se me llenaban los ojos de lágrimas. Sin razón aparente.",
    tipo: "sensacion",
    impacto: "alto",
    genero: "f"
  }
];

/**
 * Obtiene un sincrodestino aleatorio que no haya sido usado
 * @param {string[]} usados - Array de textos ya usados (parciales)
 * @param {string} genero - 'm' o 'f' para el guardián
 * @returns {object} Sincrodestino seleccionado
 */
export const getRandomSincrodestino = (usados = [], genero = 'f') => {
  // Filtrar por género si es posible, sino usar todos
  let disponibles = sincrodestinos.filter(s =>
    !usados.some(u => u.includes(s.texto.substring(0, 30)))
  );

  // Preferir los del género correcto
  const delGenero = disponibles.filter(s => s.genero === genero);
  if (delGenero.length > 0) {
    disponibles = delGenero;
  }

  if (disponibles.length === 0) {
    return sincrodestinos[0];
  }

  // Priorizar los de alto impacto
  const altoImpacto = disponibles.filter(s => s.impacto === 'alto' || s.impacto === 'muy_alto');
  if (altoImpacto.length > 0 && Math.random() > 0.3) {
    return altoImpacto[Math.floor(Math.random() * altoImpacto.length)];
  }

  return disponibles[Math.floor(Math.random() * disponibles.length)];
};

/**
 * Obtiene un sincrodestino específico por tipo
 * @param {string} tipo - tiempo, musica, animal, objeto, sueno, clima, electricidad, persona, sensacion
 * @param {string} genero - 'm' o 'f'
 * @returns {object} Sincrodestino del tipo especificado
 */
export const getSincrodestinoByTipo = (tipo, genero = 'f') => {
  const delTipo = sincrodestinos.filter(s => s.tipo === tipo);
  const delGenero = delTipo.filter(s => s.genero === genero);

  const lista = delGenero.length > 0 ? delGenero : delTipo;
  if (lista.length === 0) return sincrodestinos[0];

  return lista[Math.floor(Math.random() * lista.length)];
};

/**
 * Lista todos los tipos disponibles
 */
export const tiposSincrodestino = [
  'tiempo',
  'musica',
  'animal',
  'objeto',
  'sueno',
  'clima',
  'electricidad',
  'persona',
  'sensacion'
];
