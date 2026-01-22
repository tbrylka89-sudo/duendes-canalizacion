/**
 * BIBLIOTECA DE HOOKS DE CONVERSIÓN
 *
 * Hooks que abren la historia con impacto emocional.
 * Cada uno está diseñado para que el lector piense "esto habla de mí".
 *
 * Categorías: proteccion, abundancia, amor, sanacion, sabiduria
 */

export const hooks = {
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
    "Amás a todos menos a vos.",
    "¿Cuándo fue la última vez que alguien te preguntó cómo estás de verdad?",
    "Hay personas que buscan afuera lo que nunca se dieron adentro.",
    "El amor propio no es egoísmo. Es supervivencia.",
    "Dar sin recibir no es generosidad. Es costumbre.",
    "El amor que merecés empieza por el que te negás.",
    "Esperás que alguien te elija cuando vos todavía no lo hiciste.",
    "Hay un vacío que ninguna otra persona puede llenar.",
    "Lo que tolerás, lo repetís.",
    "Elegiste a otros tantas veces. ¿Cuándo te vas a elegir a vos?"
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

  // Mapeo de variantes
  const mapeo = {
    'proteccion': 'proteccion',
    'protection': 'proteccion',
    'abundancia': 'abundancia',
    'abundance': 'abundancia',
    'amor': 'amor',
    'love': 'amor',
    'sanacion': 'sanacion',
    'healing': 'sanacion',
    'sabiduria': 'sabiduria',
    'wisdom': 'sabiduria'
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
    'sanacion': 'sanacion',
    'sabiduria': 'sabiduria'
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
