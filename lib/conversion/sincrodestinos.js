/**
 * BASE DE SINCRODESTINOS REALES
 *
 * Eventos que "sucedieron" durante la creación del guardián.
 * Deben ser:
 * - Creíbles (no exagerados)
 * - Sutiles (no "el universo explotó")
 * - Específicos (detalles concretos)
 * - Variados (no repetir tipos)
 * - VOZ PASIVA (mientras era modelado, no "mientras lo modelábamos")
 */

export const sincrodestinos = [
  // TIPO: tiempo
  {
    texto: "Mientras era modelado, el reloj del taller se detuvo. Cuando quedó terminado, volvió a funcionar solo.",
    tipo: "tiempo",
    impacto: "alto",
    genero: "m"
  },
  {
    texto: "Mientras era modelada, el reloj del taller se detuvo. Cuando quedó terminada, volvió a funcionar solo.",
    tipo: "tiempo",
    impacto: "alto",
    genero: "f"
  },
  {
    texto: "Empezó a tomar forma a las 3:33 de la madrugada. Como si ese fuera el momento exacto.",
    tipo: "tiempo",
    impacto: "alto",
    genero: "m"
  },
  {
    texto: "Tardó exactamente 7 horas en quedar lista. Ni más ni menos. Nadie lo planificó.",
    tipo: "tiempo",
    impacto: "medio",
    genero: "f"
  },

  // TIPO: música
  {
    texto: "Mientras se elegía su cristal, sonó una canción que no sonaba hace años en el taller.",
    tipo: "musica",
    impacto: "alto",
    genero: "m"
  },
  {
    texto: "La radio empezó a fallar mientras se pintaban sus ojos. Cuando quedó terminado, volvió perfecta.",
    tipo: "musica",
    impacto: "medio",
    genero: "m"
  },
  {
    texto: "Con la playlist en aleatorio, sonaron tres canciones seguidas sobre nuevos comienzos mientras se secaba.",
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
    texto: "Un pájaro se posó en la ventana justo cuando quedó terminada. Se quedó varios minutos.",
    tipo: "animal",
    impacto: "alto",
    genero: "f"
  },
  {
    texto: "La perra ladró una sola vez mientras era creada. Una. Nunca lo hace.",
    tipo: "animal",
    impacto: "medio",
    genero: "f"
  },
  {
    texto: "Una mariposa entró al taller mientras se secaba. En pleno invierno.",
    tipo: "animal",
    impacto: "alto",
    genero: "m"
  },

  // TIPO: objeto
  {
    texto: "El pincel se cayó solo cuando iba a usarse otro color. Ese no era el correcto.",
    tipo: "objeto",
    impacto: "medio",
    genero: "m"
  },
  {
    texto: "El cristal elegido se partió a la mitad. El que quedó era exactamente lo que se necesitaba.",
    tipo: "objeto",
    impacto: "alto",
    genero: "m"
  },
  {
    texto: "Apareció una pluma en la mesa del taller. No hay pájaros cerca.",
    tipo: "objeto",
    impacto: "alto",
    genero: "f"
  },
  {
    texto: "La arcilla tomó una forma diferente a la planeada. Se confió. Salió mejor.",
    tipo: "objeto",
    impacto: "medio",
    genero: "f"
  },
  {
    texto: "Se rompió el molde de siempre. Tuvo que hacerse de cero, a mano. Salió perfecta.",
    tipo: "objeto",
    impacto: "alto",
    genero: "f"
  },

  // TIPO: sueño
  {
    texto: "Esa noche, antes de empezar a crearlo, su nombre apareció en un sueño.",
    tipo: "sueno",
    impacto: "alto",
    genero: "m"
  },
  {
    texto: "Al despertar, los colores que necesitaba estaban clarísimos. Sin saber por qué.",
    tipo: "sueno",
    impacto: "medio",
    genero: "f"
  },
  {
    texto: "En un sueño, alguien preguntó '¿ya la terminaron?'. Al día siguiente, quedó lista.",
    tipo: "sueno",
    impacto: "alto",
    genero: "f"
  },

  // TIPO: clima
  {
    texto: "Empezó a llover exactamente cuando quedó sellada. Como un bautismo.",
    tipo: "clima",
    impacto: "medio",
    genero: "f"
  },
  {
    texto: "Hubo tormenta toda la noche mientras se trabajaba en él. Al amanecer, todo claro.",
    tipo: "clima",
    impacto: "medio",
    genero: "m"
  },
  {
    texto: "El sol entró por la ventana e iluminó exactamente el lugar donde estaba siendo terminado.",
    tipo: "clima",
    impacto: "alto",
    genero: "m"
  },

  // TIPO: electricidad
  {
    texto: "Las luces del taller titilaron tres veces. Solo pasa cuando algo importante está naciendo.",
    tipo: "electricidad",
    impacto: "medio",
    genero: "m"
  },
  {
    texto: "Se cortó la luz cuando iba a ser guardada. Cuando volvió, algo en su expresión había cambiado.",
    tipo: "electricidad",
    impacto: "alto",
    genero: "f"
  },

  // TIPO: persona
  {
    texto: "Una de las nenas entró al taller y dijo su nombre antes de que nadie lo decidiera.",
    tipo: "persona",
    impacto: "muy_alto",
    genero: "m"
  },
  {
    texto: "Una amiga escribió preguntando si se estaba creando algo. Justo en ese momento.",
    tipo: "persona",
    impacto: "medio",
    genero: "f"
  },
  {
    texto: "Alguien preguntó '¿para quién es?' No hubo respuesta. Ahora sabemos que era para vos.",
    tipo: "persona",
    impacto: "alto",
    genero: "m"
  },
  {
    texto: "Mientras se le daban los últimos detalles, sonó el teléfono. '¿Para quién es?' Ahora sabemos que era para vos.",
    tipo: "persona",
    impacto: "alto",
    genero: "m"
  },

  // TIPO: sensación física
  {
    texto: "Hubo un escalofrío cuando quedaron pintados sus ojos. No hacía frío.",
    tipo: "sensacion",
    impacto: "medio",
    genero: "m"
  },
  {
    texto: "Las manos picaban mientras se trabajaba en ella. Algo quería salir.",
    tipo: "sensacion",
    impacto: "medio",
    genero: "f"
  },
  {
    texto: "Hubo que parar tres veces porque los ojos se llenaban de lágrimas. Sin razón aparente.",
    tipo: "sensacion",
    impacto: "alto",
    genero: "f"
  }
];

/**
 * Obtiene un sincrodestino aleatorio que no haya sido usado
 */
export const getRandomSincrodestino = (usados = [], genero = 'f') => {
  let disponibles = sincrodestinos.filter(s =>
    !usados.some(u => u.includes(s.texto.substring(0, 30)))
  );

  const delGenero = disponibles.filter(s => s.genero === genero);
  if (delGenero.length > 0) {
    disponibles = delGenero;
  }

  if (disponibles.length === 0) {
    return sincrodestinos[0];
  }

  const altoImpacto = disponibles.filter(s => s.impacto === 'alto' || s.impacto === 'muy_alto');
  if (altoImpacto.length > 0 && Math.random() > 0.3) {
    return altoImpacto[Math.floor(Math.random() * altoImpacto.length)];
  }

  return disponibles[Math.floor(Math.random() * disponibles.length)];
};

/**
 * Obtiene un sincrodestino específico por tipo
 */
export const getSincrodestinoByTipo = (tipo, genero = 'f') => {
  const delTipo = sincrodestinos.filter(s => s.tipo === tipo);
  const delGenero = delTipo.filter(s => s.genero === genero);

  const lista = delGenero.length > 0 ? delGenero : delTipo;
  if (lista.length === 0) return sincrodestinos[0];

  return lista[Math.floor(Math.random() * lista.length)];
};

export const tiposSincrodestino = [
  'tiempo', 'musica', 'animal', 'objeto', 'sueno', 'clima', 'electricidad', 'persona', 'sensacion'
];
