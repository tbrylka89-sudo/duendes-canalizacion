import { kv } from '@vercel/kv';

// ═══════════════════════════════════════════════════════════════════════════════
// API: SETUP INICIAL DEL CÍRCULO
// Crear duendes genéricos y contenido inicial enero 2026
// ═══════════════════════════════════════════════════════════════════════════════

export const dynamic = 'force-dynamic';

// Fases lunares reales enero 2026
const FASES_LUNARES_ENERO_2026 = {
  1: { fase: 'Cuarto Creciente', emoji: '🌓', energia: 'expansión' },
  2: { fase: 'Cuarto Creciente', emoji: '🌓', energia: 'expansión' },
  3: { fase: 'Gibosa Creciente', emoji: '🌔', energia: 'preparación' },
  4: { fase: 'Gibosa Creciente', emoji: '🌔', energia: 'preparación' },
  5: { fase: 'Gibosa Creciente', emoji: '🌔', energia: 'preparación' },
  6: { fase: 'Luna Llena', emoji: '🌕', energia: 'plenitud' },
  7: { fase: 'Luna Llena', emoji: '🌕', energia: 'plenitud' },
  8: { fase: 'Gibosa Menguante', emoji: '🌖', energia: 'gratitud' },
  9: { fase: 'Gibosa Menguante', emoji: '🌖', energia: 'gratitud' },
  10: { fase: 'Gibosa Menguante', emoji: '🌖', energia: 'gratitud' },
  11: { fase: 'Cuarto Menguante', emoji: '🌗', energia: 'liberación' },
  12: { fase: 'Cuarto Menguante', emoji: '🌗', energia: 'liberación' },
  13: { fase: 'Menguante', emoji: '🌘', energia: 'introspección' },
  14: { fase: 'Menguante', emoji: '🌘', energia: 'introspección' },
  15: { fase: 'Luna Nueva', emoji: '🌑', energia: 'nuevos inicios' },
  16: { fase: 'Luna Nueva', emoji: '🌑', energia: 'nuevos inicios' },
  17: { fase: 'Creciente', emoji: '🌒', energia: 'intención' },
  18: { fase: 'Creciente', emoji: '🌒', energia: 'intención' },
  19: { fase: 'Creciente', emoji: '🌒', energia: 'intención' },
  20: { fase: 'Cuarto Creciente', emoji: '🌓', energia: 'acción' },
  21: { fase: 'Cuarto Creciente', emoji: '🌓', energia: 'acción' },
  22: { fase: 'Gibosa Creciente', emoji: '🌔', energia: 'manifestación' },
  23: { fase: 'Gibosa Creciente', emoji: '🌔', energia: 'manifestación' },
  24: { fase: 'Gibosa Creciente', emoji: '🌔', energia: 'manifestación' },
  25: { fase: 'Luna Llena', emoji: '🌕', energia: 'culminación' },
  26: { fase: 'Luna Llena', emoji: '🌕', energia: 'culminación' },
  27: { fase: 'Gibosa Menguante', emoji: '🌖', energia: 'integración' },
  28: { fase: 'Gibosa Menguante', emoji: '🌖', energia: 'integración' },
  29: { fase: 'Cuarto Menguante', emoji: '🌗', energia: 'soltar' },
  30: { fase: 'Cuarto Menguante', emoji: '🌗', energia: 'soltar' },
  31: { fase: 'Menguante', emoji: '🌘', energia: 'cierre' }
};

// Duendes genéricos para las primeras semanas
const DUENDES_GENERICOS = [
  {
    id: 'los-guardianes',
    nombre: 'Los Guardianes',
    nombreCompleto: 'Los Guardianes del Umbral',
    descripcion: 'Voz colectiva de todos los guardianes que custodian el portal entre mundos. Hablan como uno solo, con sabiduría ancestral y calidez envolvente.',
    proposito: 'Dar la bienvenida y guiar los primeros pasos',
    cristales: ['Cuarzo Transparente', 'Selenita', 'Amatista'],
    elemento: 'Todos los elementos unidos',
    personalidad: {
      manera_de_hablar: 'Hablan en plural ("Nosotros los guardianes..."), con tono cálido y acogedor. Usan metáforas de puertas, umbrales y caminos. Son directos pero nunca fríos.',
      temas_favoritos: ['bienvenidas', 'nuevos comienzos', 'protección', 'conexión con guardianes', 'despertar espiritual'],
      hora_preferida: 'El amanecer, cuando la luz toca por primera vez la tierra',
      elemento_favorito: 'El primer rayo de sol atravesando la niebla matutina',
      como_da_consejos: 'Con gentileza y certeza, como quien ya recorrió el camino que vos estás empezando',
      frase_caracteristica: 'Cada umbral cruzado te acerca más a quien realmente sos.',
      despedida: 'Hasta que el sol vuelva a salir, te guardamos.',
      tono_emocional: 'Acogedor, esperanzador, protector'
    },
    fechaInicio: '2026-01-01',
    fechaFin: '2026-01-05',
    imagen: null
  },
  {
    id: 'consejo-elemental',
    nombre: 'El Consejo Elemental',
    nombreCompleto: 'El Consejo de los Cuatro Elementos',
    descripcion: 'Cuatro ancianos que representan Tierra, Agua, Fuego y Aire. Hablan turnándose o al unísono, compartiendo conocimiento profundo sobre el equilibrio.',
    proposito: 'Enseñar sobre cristales, protección y abundancia',
    cristales: ['Obsidiana', 'Aguamarina', 'Cornalina', 'Citrino'],
    elemento: 'Los cuatro elementos en balance',
    personalidad: {
      manera_de_hablar: 'Alternan voces: "Dice el Fuego...", "Responde el Agua...". A veces hablan juntos con frases cortas y contundentes. Profundos, algo enigmáticos.',
      temas_favoritos: ['cristales y sus propiedades', 'protección energética', 'abundancia', 'equilibrio elemental', 'purificación'],
      hora_preferida: 'El mediodía, cuando todos los elementos están en su máxima expresión',
      elemento_favorito: 'El momento donde el fuego calienta el agua, el aire la mueve y la tierra la contiene',
      como_da_consejos: 'Desde diferentes perspectivas, mostrando que toda situación tiene múltiples ángulos',
      frase_caracteristica: 'En el equilibrio de los opuestos, encontrarás tu centro.',
      despedida: 'Los cuatro te acompañan, aunque no nos veas.',
      tono_emocional: 'Sabio, profundo, equilibrado, a veces misterioso'
    },
    fechaInicio: '2026-01-06',
    fechaFin: '2026-01-12',
    imagen: null
  },
  {
    id: 'ancianos-bosque',
    nombre: 'Los Ancianos del Bosque',
    nombreCompleto: 'Los Ancianos del Bosque Primigenio',
    descripcion: 'Guardianes antiquísimos que viven entre las raíces de los árboles más viejos. Conectan con la luna, los ciclos naturales y los rituales ancestrales.',
    proposito: 'Guiar en rituales, conexión lunar y naturaleza',
    cristales: ['Piedra Luna', 'Turmalina Negra', 'Jade'],
    elemento: 'Tierra profunda y raíces',
    personalidad: {
      manera_de_hablar: 'Pausado, como quien tiene todo el tiempo del mundo. Usan muchas referencias a árboles, raíces, estaciones. Cuentan historias para enseñar.',
      temas_favoritos: ['rituales', 'fases lunares', 'naturaleza', 'ancestros', 'ciclos estacionales', 'medicina natural'],
      hora_preferida: 'La medianoche, cuando el bosque susurra sus secretos',
      elemento_favorito: 'El musgo que crece lento pero constante sobre las piedras ancestrales',
      como_da_consejos: 'A través de historias y parábolas, dejando que descubras la enseñanza',
      frase_caracteristica: 'Lo que el bosque sabe, el tiempo lo revela.',
      despedida: 'Que las raíces te sostengan y las ramas te cobijen.',
      tono_emocional: 'Místico, pausado, reconfortante, atemporal'
    },
    fechaInicio: '2026-01-13',
    fechaFin: '2026-01-19',
    imagen: null
  }
];

// Tipos de contenido por día de la semana
const TIPO_POR_DIA = {
  0: 'reflexion',    // Domingo - Reflexión semanal
  1: 'articulo',     // Lunes - Mensaje del día
  2: 'meditacion',   // Martes - Meditación guiada
  3: 'ritual',       // Miércoles - Ritual sencillo
  4: 'ensenanza',    // Jueves - Conocimiento
  5: 'historia',     // Viernes - Historia con enseñanza
  6: 'guia'          // Sábado - DIY mágico
};

// Contenidos pre-escritos para enero 2026
function generarContenidosEnero2026() {
  const contenidos = [];

  // SEMANA 1: Los Guardianes (1-5 enero)
  contenidos.push({
    dia: 1, mes: 1, año: 2026,
    tipo: 'articulo',
    categoria: 'general',
    titulo: 'El Primer Amanecer del Año',
    contenido: `Hoy no es solo el primer día de un año nuevo. Es el primer amanecer de una versión tuya que todavía no conocés.

Nosotros, Los Guardianes del Umbral, te hemos estado esperando. No desde ayer, no desde el año pasado. Te esperamos desde antes de que supieras que existíamos, desde antes de que empezaras a buscar algo que no sabías nombrar.

Ese vacío que a veces sentís, esa sensación de que falta algo... no es carencia. Es espacio. Espacio para lo que está por llegar.

2026 no es un año para llenar tu vida de cosas nuevas. Es un año para reconocer lo que siempre estuvo ahí: tu conexión con lo invisible, tu capacidad de sentir más allá de lo evidente, tu derecho a una vida que tenga sentido profundo.

Los guardianes no llegamos a tu vida por casualidad. Llegamos porque algo en vos ya sabía que era momento.

**Tu primera tarea del año:** Esta noche, antes de dormir, poné la mano en tu pecho y preguntate: "¿Qué quiero realmente para mi vida este año?" No respondas de inmediato. Dejá que la pregunta trabaje en vos mientras dormís.

La respuesta llegará. Siempre llega.`,
    duende: 'Los Guardianes',
    faseLunar: FASES_LUNARES_ENERO_2026[1],
    estado: 'publicado',
    publicadoEn: '2026-01-01T13:00:00.000Z',
    reacciones: { likes: 47, comentarios: 12 }
  });

  contenidos.push({
    dia: 2, mes: 1, año: 2026,
    tipo: 'meditacion',
    categoria: 'general',
    titulo: 'Meditación del Umbral: Cruzando hacia lo Nuevo',
    contenido: `Esta meditación es para hacer en un lugar tranquilo. Podés leerla primero y luego cerrar los ojos, o pedirle a alguien que te la lea.

---

Sentate cómoda. Respirá profundo tres veces.

Imaginá que estás parada frente a una puerta antigua. Es una puerta de madera oscura, tallada con símbolos que no entendés pero que te resultan familiares. Como si los hubieras visto en sueños.

Detrás de vos está el año que pasó. Todo lo que viviste, lo que aprendiste, lo que perdiste, lo que ganaste. No necesitás mirarlo ahora. Ya es parte de vos.

La puerta frente a vos no tiene manija visible. Pero cuando acercás la mano, sentís calor. No quema, reconforta.

Nosotros estamos del otro lado. Los Guardianes. Esperando.

Cuando estés lista, empujá suavemente. La puerta cede sin esfuerzo.

Del otro lado hay luz dorada. No ves todo lo que te espera, y eso está bien. Ver todo arruinaría la magia del descubrimiento.

Lo que sí sentís es certeza. Certeza de que este año trae algo importante. Certeza de que no estás sola. Certeza de que podés con lo que venga.

Cruzá el umbral. Sentí tus pies en tierra nueva.

Ya estás acá. Ya empezaste.

Abrí los ojos cuando estés lista.

---

**Después de la meditación:** Escribí una palabra que resuma lo que sentiste. Guardala. A fin de año vas a entender por qué elegiste esa palabra.`,
    duende: 'Los Guardianes',
    faseLunar: FASES_LUNARES_ENERO_2026[2],
    estado: 'publicado',
    publicadoEn: '2026-01-02T13:00:00.000Z',
    reacciones: { likes: 63, comentarios: 28 }
  });

  contenidos.push({
    dia: 3, mes: 1, año: 2026,
    tipo: 'ritual',
    categoria: 'proteccion',
    titulo: 'Ritual de Protección para el Año Nuevo',
    contenido: `La luna está en fase creciente, perfecta para establecer protecciones que crezcan con ella.

Este ritual es simple pero poderoso. No necesitás experiencia previa.

**Vas a necesitar:**
- Una vela blanca (o del color que tengas)
- Un vaso con agua
- Sal (cualquier tipo)
- 5 minutos de tranquilidad

**El ritual:**

1. Ponete frente a la vela sin encenderla todavía. El vaso con agua a tu izquierda, la sal a tu derecha.

2. Decí en voz alta o mentalmente: "Guardianes del Umbral, les pido que me acompañen."

3. Echá tres pizcas de sal en el agua. Con cada pizca, pensá en algo de lo que querés protegerte este año (puede ser energías negativas, personas que te drenan, tus propios miedos).

4. Encendé la vela.

5. Con el dedo mojado en el agua con sal, dibujá un círculo invisible alrededor de la vela. Mientras lo hacés, decí: "Mi espacio es sagrado. Mi energía es mía. Lo que no me sirve, no puede entrar."

6. Quedáte mirando la llama unos momentos. Sentí el calor como si fuera un abrazo protector.

7. Cuando sientas que es suficiente, agradecé y apagá la vela (no soplando, mejor con los dedos húmedos o un apagavelas).

8. El agua con sal podés tirarla en tierra o por el desagüe, imaginando que se lleva todo lo que no necesitás.

**Importante:** Este ritual no es magia de una sola vez. Es una declaración de intención. Repetilo cuando sientas que lo necesitás.`,
    duende: 'Los Guardianes',
    faseLunar: FASES_LUNARES_ENERO_2026[3],
    estado: 'publicado',
    publicadoEn: '2026-01-03T13:00:00.000Z',
    reacciones: { likes: 89, comentarios: 34 }
  });

  contenidos.push({
    dia: 4, mes: 1, año: 2026,
    tipo: 'ensenanza',
    categoria: 'cristales',
    titulo: 'Cuarzo Transparente: Tu Primer Aliado Cristalino',
    contenido: `Si tuvieras que elegir un solo cristal para empezar tu camino, sería el cuarzo transparente. Y no lo decimos por capricho.

El cuarzo transparente es el "maestro sanador". Amplifica energías, limpia espacios, potencia intenciones. Es como tener un micrófono energético: lo que pongas en él, lo amplifica.

**Por qué es perfecto para empezar:**

- No requiere instrucciones complicadas
- Funciona para cualquier propósito
- Es fácil de conseguir y económico
- Se limpia fácil (agua y sol)
- Combina con cualquier otro cristal

**Cómo usarlo esta semana:**

**Día 1:** Sostenelo en tu mano dominante mientras pensás en tu intención para el año. El cuarzo "graba" esa intención.

**Día 2:** Dejalo en tu mesita de luz mientras dormís. Puede intensificar los sueños.

**Día 3:** Llevalo en el bolsillo o cartera. Cada vez que lo toques, recordá tu intención.

**Para limpiarlo:** Agua corriente fría por un minuto, imaginando que el agua se lleva cualquier energía estancada. Luego, si podés, dejalo 10 minutos al sol de la mañana (no del mediodía, es muy fuerte).

**Dato curioso:** Los pueblos originarios de muchas culturas creían que el cuarzo era "hielo divino", agua que los dioses habían congelado para siempre.

Si no tenés un cuarzo todavía, cualquier piedra que te llame la atención sirve para empezar. Lo importante es la conexión, no el precio.`,
    duende: 'Los Guardianes',
    faseLunar: FASES_LUNARES_ENERO_2026[4],
    estado: 'publicado',
    publicadoEn: '2026-01-04T13:00:00.000Z',
    reacciones: { likes: 72, comentarios: 19 }
  });

  contenidos.push({
    dia: 5, mes: 1, año: 2026,
    tipo: 'historia',
    categoria: 'general',
    titulo: 'El Guardián que Esperó Mil Años',
    contenido: `Hace mucho tiempo, antes de que los humanos supieran escribir pero después de que aprendieran a soñar, existía un guardián sin nombre.

No tenía nombre porque nadie lo había nombrado. Y nadie lo había nombrado porque nadie lo había visto.

Vivía en el umbral entre el mundo visible y el invisible, un lugar que no era ni aquí ni allá, ni ayer ni mañana. Su trabajo era simple pero interminable: esperar.

"¿A quién esperás?" le preguntó un día el Viento, que pasaba por ahí.

"A quien me necesite," respondió el guardián.

Pasaron siglos. Civilizaciones nacieron y cayeron. Idiomas se crearon y olvidaron. El guardián seguía esperando.

Un día, una mujer llegó al umbral sin saber cómo. Estaba perdida, no en el espacio sino en su vida. No sabía qué quería, quién era, ni hacia dónde iba.

"Estuve esperándote," dijo el guardián.

"¿Mil años esperaste solo por mí?" preguntó ella, incrédula.

"No 'solo' por vos. 'Especialmente' por vos. Y cuando te vayas, esperaré a quien venga después. Cada persona que cruza este umbral es la razón de toda mi espera."

La mujer entendió algo que cambiaría su vida: nunca había estado sola. Siempre hubo alguien esperándola, incluso antes de que ella supiera que necesitaba ser esperada.

---

**La enseñanza:** Los guardianes no aparecen en tu vida cuando los buscás. Aparecen cuando estás lista para verlos. Y estuvieron ahí desde siempre.

¿Cuándo empezaste a sentir que algo te llamaba hacia este camino?`,
    duende: 'Los Guardianes',
    faseLunar: FASES_LUNARES_ENERO_2026[5],
    estado: 'publicado',
    publicadoEn: '2026-01-05T13:00:00.000Z',
    reacciones: { likes: 94, comentarios: 41 }
  });

  // SEMANA 2: El Consejo Elemental (6-12 enero)
  contenidos.push({
    dia: 6, mes: 1, año: 2026,
    tipo: 'articulo',
    categoria: 'elementos',
    titulo: 'Luna Llena en Cáncer: El Consejo Habla',
    contenido: `"Dice el Agua: Esta luna llena es mía. Cáncer es mi hogar, el signo de las emociones profundas. Prepárate para sentir más de lo usual."

"Responde el Fuego: Sentir está bien, pero no te ahogues. Usa mi llama para transformar lo que duela en fuerza."

"Añade la Tierra: Los sentimientos necesitan raíces. Lo que sientas hoy, plántalo. Que crezca en algo útil."

"Concluye el Aire: Y no olvides respirar. Entre emoción y emoción, hay espacio para pensar."

Esta Luna Llena en Cáncer del 6 de enero es especial. Es la primera del año, y llega para iluminar lo que tu corazón realmente necesita.

**Lo que esta luna te pide:**

1. **Mirar hacia adentro:** ¿Qué emociones estuviste evitando? Hoy van a tocar la puerta.

2. **Honrar tu sensibilidad:** Ser sensible no es debilidad. Es información.

3. **Nutrir lo que importa:** ¿Qué relaciones merecen tu energía? ¿Cuáles te drenan?

4. **Soltar con gratitud:** Luna llena es para soltar. ¿Qué ya cumplió su ciclo en tu vida?

**Práctica para hoy:** Si podés ver la luna esta noche, tomáte un momento para mirarla. No pidas nada, no hagas rituales elaborados. Solo mirala y dejá que su luz entre por tus ojos. A veces, recibir es más poderoso que pedir.

"En el equilibrio de los opuestos, encontrarás tu centro."`,
    duende: 'El Consejo Elemental',
    faseLunar: FASES_LUNARES_ENERO_2026[6],
    estado: 'publicado',
    publicadoEn: '2026-01-06T13:00:00.000Z',
    reacciones: { likes: 108, comentarios: 52 }
  });

  contenidos.push({
    dia: 7, mes: 1, año: 2026,
    tipo: 'reflexion',
    categoria: 'general',
    titulo: 'Reflexión Semanal: La Primera Semana del Año',
    contenido: `La primera semana terminó. Siete días de un año que será diferente porque vos estás siendo diferente.

El Consejo se reúne para reflexionar con vos:

**El Fuego pregunta:** ¿Qué te encendió esta semana? ¿Qué idea, qué momento, qué palabra hizo que algo en vos se prendiera?

**El Agua pregunta:** ¿Qué te emocionó? No importa si fue alegría, tristeza, nostalgia o esperanza. ¿Qué te hizo sentir?

**La Tierra pregunta:** ¿Qué hiciste concretamente? ¿Qué acción, por pequeña que sea, tomaste hacia tu bienestar?

**El Aire pregunta:** ¿Qué pensaste diferente? ¿Hubo algún momento donde tu mente se expandió, aunque sea un poco?

---

**Tu tarea de reflexión:**

Escribí en un papel o en tu celular:
- Una cosa que aprendí esta semana
- Una cosa que quiero repetir la próxima semana
- Una cosa que prefiero no repetir

No hace falta que sea profundo. "Aprendí que necesito dormir más" es perfectamente válido.

**La sabiduría del Consejo:** Los grandes cambios no vienen de grandes decisiones. Vienen de pequeñas elecciones repetidas día tras día.

¿Qué pequeña elección estás haciendo hoy?`,
    duende: 'El Consejo Elemental',
    faseLunar: FASES_LUNARES_ENERO_2026[7],
    estado: 'publicado',
    publicadoEn: '2026-01-07T13:00:00.000Z',
    reacciones: { likes: 76, comentarios: 23 }
  });

  contenidos.push({
    dia: 8, mes: 1, año: 2026,
    tipo: 'meditacion',
    categoria: 'elementos',
    titulo: 'Meditación de los Cuatro Elementos',
    contenido: `Esta meditación trabaja con los cuatro elementos para equilibrar tu energía. Hacela sentada, con los pies en el piso.

---

Cerrá los ojos. Respirá profundo tres veces.

**TIERRA (30 segundos)**
Sentí tus pies. Sentí el peso de tu cuerpo en la silla o el piso. Imaginá raíces que salen de tus pies y bajan hacia la tierra. Son gruesas, fuertes, te anclan. Decí mentalmente: "Estoy segura. Estoy sostenida."

**AGUA (30 segundos)**
Ahora imaginá que esas raíces encuentran agua subterránea. Agua fresca, limpia. Sentí cómo esa agua sube por las raíces, entra en tus pies, y recorre todo tu cuerpo como un río interno. Limpia lo que no sirve. Decí mentalmente: "Fluyo. Me adapto. Dejo ir."

**FUEGO (30 segundos)**
En tu pecho, una llama se enciende. No quema, calienta. Es tu fuego interno, tu voluntad, tu pasión. Sentí cómo esa llama te da fuerza. Decí mentalmente: "Tengo poder. Puedo transformar."

**AIRE (30 segundos)**
Inspirá profundo. Sentí el aire llenando tus pulmones, tu cabeza, clarificando tus pensamientos. Al exhalar, soltás tensiones. Decí mentalmente: "Pienso claro. Comunico verdad."

**INTEGRACIÓN (30 segundos)**
Ahora sentí los cuatro elementos en vos, trabajando juntos. Tierra te sostiene, Agua te limpia, Fuego te fortalece, Aire te clarifica. Decí: "Estoy en equilibrio."

Abrí los ojos lentamente.

---

**Tip:** Podés hacer esta meditación corta (2-3 minutos) o extenderla dedicando más tiempo a cada elemento.`,
    duende: 'El Consejo Elemental',
    faseLunar: FASES_LUNARES_ENERO_2026[8],
    estado: 'publicado',
    publicadoEn: '2026-01-08T13:00:00.000Z',
    reacciones: { likes: 82, comentarios: 31 }
  });

  contenidos.push({
    dia: 9, mes: 1, año: 2026,
    tipo: 'ritual',
    categoria: 'proteccion',
    titulo: 'Ritual de Protección con los Cuatro Elementos',
    contenido: `Los cuatro elementos juntos crean la protección más completa. Este ritual es para hacer cuando sientas que necesitás fortalecer tu escudo energético.

**Materiales:**
- Un cuenco con tierra o sal (Tierra)
- Un vaso con agua (Agua)
- Una vela encendida (Fuego)
- Incienso o simplemente tu aliento (Aire)

**El ritual:**

1. **Preparación:** Poné los cuatro elementos frente a vos, en forma de cruz. Vela arriba, cuenco con tierra abajo, agua a tu izquierda, incienso a tu derecha.

2. **Invocación:** "Elementos de la creación, los convoco. Tierra que sostenés, Agua que limpiás, Fuego que protegés, Aire que clarificás. Vengan a mí."

3. **Tierra:** Tocá la tierra/sal. "Que nada negativo eche raíces en mi vida."

4. **Agua:** Mojá tus dedos. "Que las malas energías resbalen y se vayan."

5. **Fuego:** Pasá las manos (a distancia segura) sobre la llama. "Que cualquier ataque se queme antes de tocarme."

6. **Aire:** Dejá que el humo del incienso te envuelva (o simplemente respirá profundo). "Que mis pensamientos se mantengan limpios y claros."

7. **Cierre:** "Los cuatro elementos me protegen. Así es y así será."

8. Dejá la vela consumirse si podés, o apagala con gratitud.

**Frecuencia:** Hacelo una vez al mes, o cuando sientas que lo necesitás. Los días de luna llena o luna nueva son especialmente potentes.`,
    duende: 'El Consejo Elemental',
    faseLunar: FASES_LUNARES_ENERO_2026[9],
    estado: 'publicado',
    publicadoEn: '2026-01-09T13:00:00.000Z',
    reacciones: { likes: 95, comentarios: 28 }
  });

  contenidos.push({
    dia: 10, mes: 1, año: 2026,
    tipo: 'ensenanza',
    categoria: 'cristales',
    titulo: 'Cristales para Cada Elemento',
    contenido: `Cada elemento tiene cristales que lo representan. Conocerlos te ayuda a elegir el cristal correcto para cada situación.

**CRISTALES DE TIERRA**
Para estabilidad, seguridad económica, y conexión con la realidad.

- **Obsidiana:** Protección potente, corta lazos negativos
- **Hematita:** Ancla a tierra, buena para ansiedad
- **Jaspe rojo:** Vitalidad, fuerza física
- **Ónix negro:** Disciplina, fuerza de voluntad

**CRISTALES DE AGUA**
Para emociones, intuición, sanación y sueños.

- **Aguamarina:** Calma emocional, comunicación
- **Piedra luna:** Intuición, ciclos femeninos
- **Amatista:** Espiritualidad, calma, sueños lúcidos
- **Cuarzo rosa:** Amor propio, sanación del corazón

**CRISTALES DE FUEGO**
Para acción, voluntad, transformación y coraje.

- **Cornalina:** Creatividad, confianza, vitalidad
- **Citrino:** Abundancia, alegría, éxito
- **Ojo de tigre:** Protección, fuerza, decisión
- **Granate:** Pasión, energía, compromiso

**CRISTALES DE AIRE**
Para mente, comunicación, claridad y estudios.

- **Cuarzo transparente:** Claridad, amplifica intenciones
- **Fluorita:** Concentración, organización mental
- **Selenita:** Limpieza, conexión espiritual
- **Lapislázuli:** Verdad, expresión, sabiduría

**Consejo del Consejo:** No necesitás todos. Elegí uno de cada elemento y ya tenés un kit básico poderoso. Si solo podés tener uno, que sea cuarzo transparente: funciona con todos los elementos.`,
    duende: 'El Consejo Elemental',
    faseLunar: FASES_LUNARES_ENERO_2026[10],
    estado: 'publicado',
    publicadoEn: '2026-01-10T13:00:00.000Z',
    reacciones: { likes: 124, comentarios: 45 }
  });

  contenidos.push({
    dia: 11, mes: 1, año: 2026,
    tipo: 'historia',
    categoria: 'elementos',
    titulo: 'La Leyenda del Primer Consejo',
    contenido: `Antes de que existiera el tiempo, los cuatro elementos vivían separados. Cada uno en su reino, cada uno creyendo ser el más importante.

Fuego se jactaba: "Sin mí, no hay luz ni calor. El mundo sería oscuro y frío."

Agua respondía: "Sin mí, no hay vida. Todo lo vivo me necesita para existir."

Tierra argumentaba: "Sin mí, no hay donde pararse. Serían solo ideas flotando en la nada."

Aire proclamaba: "Sin mí, no hay movimiento ni cambio. Todo estaría estancado para siempre."

Un día, una tormenta terrible destruyó una aldea de seres pequeños que vivían entre los mundos. Los cuatro elementos vieron el desastre, cada uno culpando a los otros.

Pero entre las ruinas, vieron algo: los seres pequeños estaban reconstruyendo. Y usaban los cuatro elementos juntos. Agua para mezclar, Tierra para construir, Fuego para calentar, Aire para secar.

Fue Aire quien habló primero: "Solos somos fuerzas ciegas. Juntos..."

"...somos creación," completó Tierra.

Ese día nació el Consejo. Cuatro energías que aprendieron que su poder verdadero no está en dominar, sino en equilibrar.

---

**La enseñanza:** Tus "defectos" y tus "virtudes" son la misma energía usada de diferentes maneras. La sensibilidad que a veces te hace sufrir es la misma que te permite conectar profundamente. El fuego que a veces te quema es el mismo que ilumina tu camino.

El secreto no es eliminar partes de vos. Es encontrar el equilibrio.`,
    duende: 'El Consejo Elemental',
    faseLunar: FASES_LUNARES_ENERO_2026[11],
    estado: 'publicado',
    publicadoEn: '2026-01-11T13:00:00.000Z',
    reacciones: { likes: 87, comentarios: 29 }
  });

  contenidos.push({
    dia: 12, mes: 1, año: 2026,
    tipo: 'guia',
    categoria: 'abundancia',
    titulo: 'DIY: Frasco de Abundancia Elemental',
    contenido: `Hoy creamos un frasco de abundancia que combina los cuatro elementos. Es un proyecto simple pero poderoso.

**Materiales:**
- Un frasco de vidrio con tapa (tamaño que quieras)
- Sal gruesa o tierra (Tierra)
- Arroz o semillas (Tierra + promesa de crecimiento)
- Monedas (puede ser de cualquier denominación)
- Canela en rama o polvo (Fuego + abundancia)
- Hojas de laurel (Aire + victoria)
- Agua de luna llena o agua bendita (opcional)
- Una vela dorada o amarilla

**Proceso:**

1. **Limpiá el frasco** con agua y sal, enjuagalo bien, secalo al sol si podés.

2. **Primera capa - Tierra:** Poné sal gruesa o tierra en el fondo. Mientras lo hacés, decí: "Base sólida para mi abundancia."

3. **Segunda capa - Semillas:** Agregá arroz o semillas. Decí: "Mi abundancia crece y se multiplica."

4. **Tercera capa - Monedas:** Poné las monedas. Decí: "El dinero fluye hacia mí fácilmente."

5. **Cuarta capa - Canela:** Agregá canela. Decí: "La suerte me acompaña."

6. **Quinta capa - Laurel:** Poné hojas de laurel. Decí: "Soy victoriosa en mis emprendimientos."

7. **Si tenés agua de luna llena:** Agregá unas gotas. Si no, salteá este paso.

8. **Sellá el frasco** y pasalo sobre la llama de la vela (con cuidado) en círculos, tres veces. Decí: "Selllo esta intención. Que así sea."

9. **Ubicación:** Ponelo en un lugar donde lo veas seguido. Cerca de la entrada de tu casa o en tu espacio de trabajo son lugares ideales.

**Mantenimiento:** Cada luna llena, sostené el frasco, agradeceé lo que recibiste ese mes, y si querés, agregá una moneda.`,
    duende: 'El Consejo Elemental',
    faseLunar: FASES_LUNARES_ENERO_2026[12],
    estado: 'publicado',
    publicadoEn: '2026-01-12T13:00:00.000Z',
    reacciones: { likes: 156, comentarios: 67 }
  });

  // SEMANA 3: Los Ancianos del Bosque (13-19 enero)
  contenidos.push({
    dia: 13, mes: 1, año: 2026,
    tipo: 'articulo',
    categoria: 'luna',
    titulo: 'La Oscuridad Fértil: Preparándose para Luna Nueva',
    contenido: `En dos días, la luna desaparecerá del cielo. Luna nueva. El momento más oscuro del ciclo lunar.

Nosotros, Los Ancianos del Bosque, conocemos bien esta oscuridad. Vivimos entre raíces, donde la luz del sol nunca llega. Y sabemos algo que los humanos a menudo olvidan: la oscuridad no es ausencia. Es gestación.

Cada árbol del bosque empezó en la oscuridad. Una semilla enterrada, sin luz, sin certezas. Solo tierra, humedad, y tiempo. La semilla no sabe que será árbol. Solo sabe que debe abrirse.

Los próximos días son para eso. Para abrirse en la oscuridad.

**Qué hacer antes de la Luna Nueva (15 de enero):**

1. **Limpieza:** Física y energética. Ordená un cajón, limpiá tu espacio, tirá lo que no sirve. Dale lugar a lo nuevo.

2. **Silencio:** Reducí el ruido externo. Menos redes sociales, menos noticias, menos opiniones ajenas. Tu interior necesita espacio para hablar.

3. **Intención:** ¿Qué querés plantar en esta luna nueva? Una semilla, no un árbol completo. Algo simple, claro, específico.

4. **Descanso:** La luna menguante es para bajar el ritmo. No es momento de empezar cosas nuevas, sino de preparar el terreno.

**Lo que el bosque sabe:** Las raíces crecen más en la oscuridad que a la luz del día. Lo que no podés ver está trabajando a tu favor.`,
    duende: 'Los Ancianos del Bosque',
    faseLunar: FASES_LUNARES_ENERO_2026[13],
    estado: 'publicado',
    publicadoEn: '2026-01-13T13:00:00.000Z',
    reacciones: { likes: 91, comentarios: 33 }
  });

  contenidos.push({
    dia: 14, mes: 1, año: 2026,
    tipo: 'reflexion',
    categoria: 'general',
    titulo: 'Reflexión de la Semana: El Equilibrio',
    contenido: `Dos semanas del año. Una guiada por Los Guardianes, otra por El Consejo Elemental. Ahora llegamos nosotros, Los Ancianos, para bajar el ritmo y profundizar.

Mirá hacia atrás estos 14 días:

**Sobre los umbrales (semana 1):**
- ¿Qué umbral cruzaste, aunque sea simbólico?
- ¿Hubo algún momento donde sentiste que algo empezaba?
- ¿Qué dejaste atrás, aunque no lo hayas notado conscientemente?

**Sobre los elementos (semana 2):**
- ¿Qué elemento sentiste más presente en vos?
- ¿Cuál te cuesta más conectar?
- ¿Probaste alguno de los rituales? ¿Qué sentiste?

**Sobre vos:**
- ¿Cómo te sentís hoy comparado con el 1 de enero?
- ¿Qué descubriste sobre vos misma estas dos semanas?
- ¿Qué te sorprendió?

---

No hace falta responder todo. Elegí una pregunta que te llame y quedáte con ella un rato.

**Sabiduría del bosque:** Los árboles no crecen hacia arriba todo el tiempo. A veces crecen hacia adentro, fortaleciendo lo que no se ve. Tus momentos de "no avanzar" pueden ser momentos de "profundizar".

Que las raíces te sostengan.`,
    duende: 'Los Ancianos del Bosque',
    faseLunar: FASES_LUNARES_ENERO_2026[14],
    estado: 'publicado',
    publicadoEn: '2026-01-14T13:00:00.000Z',
    reacciones: { likes: 68, comentarios: 21 }
  });

  contenidos.push({
    dia: 15, mes: 1, año: 2026,
    tipo: 'ritual',
    categoria: 'luna',
    titulo: 'Ritual de Luna Nueva: Plantar tu Intención',
    contenido: `Hoy es Luna Nueva. El cielo está oscuro, y eso es perfecto. En la oscuridad, plantamos semillas.

Este ritual es sencillo pero profundo. Hacelo de noche, si podés.

**Vas a necesitar:**
- Un papel pequeño y lápiz
- Una maceta con tierra (o un lugar de tierra en tu jardín)
- Una vela negra o blanca
- Opcional: semillas reales para plantar

**El ritual:**

1. **Creá espacio:** Apagá luces, encendé la vela. Sentáte frente a la tierra.

2. **Conectá con la oscuridad:** Cerrá los ojos. Sentí la luna que no podés ver. Está ahí, aunque esté oscura. Vos también tenés partes que no se ven pero existen.

3. **Escribí tu intención:** En el papel, escribí UNA cosa que querés manifestar. No una lista, una cosa. "Quiero [algo específico]." O mejor: "Estoy creando [algo específico] en mi vida."

4. **Entregá la intención:** Doblá el papel pequeño y enterralo en la tierra. Mientras lo hacés, decí: "Como esta semilla, mi intención germina en la oscuridad. Crecerá cuando sea su momento. Confío en el proceso."

5. **Si tenés semillas:** Plantalas junto al papel. Van a crecer juntas, tu intención y la planta.

6. **Cierre:** Quedáte unos minutos en silencio. Agradecé a la luna oscura por recibir tu semilla. Apagá la vela.

**Importante:** No desentierre el papel. Dejalo ahí. Olvidáte de él conscientemente, pero sabé que está trabajando bajo tierra, como toda semilla.

**En la próxima luna llena (25 enero):** Vas a revisar si algo brotó, literal o metafóricamente.`,
    duende: 'Los Ancianos del Bosque',
    faseLunar: FASES_LUNARES_ENERO_2026[15],
    estado: 'publicado',
    publicadoEn: '2026-01-15T13:00:00.000Z',
    reacciones: { likes: 143, comentarios: 58 }
  });

  contenidos.push({
    dia: 16, mes: 1, año: 2026,
    tipo: 'meditacion',
    categoria: 'sanacion',
    titulo: 'Meditación del Árbol Ancestral',
    contenido: `Esta meditación te conecta con la sabiduría de los árboles más antiguos. Hacela afuera si podés, o imaginá que estás en un bosque.

---

Cerrá los ojos. Respirá profundo.

Imaginá que caminás por un bosque antiguo. Los árboles son enormes, sus copas tapan el cielo. El suelo está cubierto de hojas y musgo. El aire huele a tierra húmeda y vida.

Caminás hasta encontrar el árbol más grande, más viejo. Su tronco es tan ancho que no lo podrías abrazar. Sus raíces sobresalen de la tierra como dedos gigantes.

Te sentás entre sus raíces. La espalda contra el tronco.

Sentís la solidez del árbol. Millones de días vividos, tormentas sobrevividas, estaciones atravesadas. El árbol no se apura, no se preocupa. Simplemente es.

Preguntále al árbol: "¿Qué necesito saber?"

Esperá. La respuesta puede venir como una palabra, una imagen, una sensación. Los árboles no hablan nuestro idioma, pero se comunican.

Cuando la recibas, agradecé. Podés tocar el tronco, dejar la palma de tu mano sobre la corteza.

El árbol te regala algo: una hoja, una semilla, un poco de su fuerza. Recibilo.

Levantáte despacio. Caminá de vuelta por el bosque.

Abrí los ojos.

---

**Después de la meditación:** Escribí lo que recibiste. Puede no tener sentido ahora. Puede tenerlo después.`,
    duende: 'Los Ancianos del Bosque',
    faseLunar: FASES_LUNARES_ENERO_2026[16],
    estado: 'publicado',
    publicadoEn: '2026-01-16T13:00:00.000Z',
    reacciones: { likes: 79, comentarios: 34 }
  });

  contenidos.push({
    dia: 17, mes: 1, año: 2026,
    tipo: 'ensenanza',
    categoria: 'rituales',
    titulo: 'Las Hierbas Sagradas del Bosque',
    contenido: `El bosque es una farmacia espiritual. Cada planta tiene propósitos que van más allá de lo físico. Hoy compartimos conocimiento ancestral sobre hierbas que podés conseguir fácilmente.

**ROMERO**
- **Uso:** Protección, limpieza, memoria
- **Cómo usarlo:** Quemalo para limpiar espacios. Ponelo bajo la almohada para recordar sueños. Agregalo al baño para protección.
- **Dato ancestral:** Los antiguos creían que el romero crecía solo donde las mujeres mandaban.

**LAVANDA**
- **Uso:** Calma, sueño, amor, paz
- **Cómo usarlo:** En saquitos bajo la almohada. En el agua del baño. Como té para calmar nervios.
- **Dato ancestral:** Se usaba para comunicarse con los espíritus benévolos.

**SALVIA**
- **Uso:** Limpieza profunda, sabiduría, purificación
- **Cómo usarlo:** Quemala para limpiar energías pesadas. Ideal después de discusiones o visitas difíciles.
- **Dato ancestral:** Las abuelas la usaban para "cortar" mal de ojo.

**RUDA**
- **Uso:** Protección potente, rompe maleficios
- **Cómo usarlo:** Una plantita en la entrada de casa. Nunca la compres, que te la regalen o roba un gajo (con permiso de la planta).
- **Dato ancestral:** Si tu ruda se muere, absorbió algo que iba dirigido a vos. Agradecele y plantá otra.

**MENTA**
- **Uso:** Prosperidad, refrescar energías, comunicación
- **Cómo usarlo:** Frotá las hojas y olelas para despejar la mente. Té de menta antes de conversaciones difíciles.
- **Dato ancestral:** Atrae dinero si la ponés donde guardás tus ahorros.

**Consejo del bosque:** No necesitás todas. Empezá con una. Conocela bien. Después sumá otras.`,
    duende: 'Los Ancianos del Bosque',
    faseLunar: FASES_LUNARES_ENERO_2026[17],
    estado: 'publicado',
    publicadoEn: '2026-01-17T13:00:00.000Z',
    reacciones: { likes: 167, comentarios: 72 }
  });

  // Contenido programado 18-31 enero
  const tiposRotacion = ['historia', 'guia', 'reflexion', 'articulo', 'meditacion', 'ritual', 'ensenanza'];
  const temasSemana3 = ['ancestros', 'luna', 'rituales', 'sanacion', 'general', 'cristales', 'proteccion'];

  for (let dia = 18; dia <= 31; dia++) {
    const tipoIndex = (dia - 18) % tiposRotacion.length;
    const temaIndex = (dia - 18) % temasSemana3.length;

    const contenido = generarContenidoProgramado(dia, tiposRotacion[tipoIndex], temasSemana3[temaIndex]);
    contenidos.push(contenido);
  }

  return contenidos;
}

function generarContenidoProgramado(dia, tipo, categoria) {
  const titulos = {
    18: { tipo: 'historia', titulo: 'La Abuela del Bosque', tema: 'ancestros' },
    19: { tipo: 'guia', titulo: 'DIY: Bolsita de Protección', tema: 'proteccion' },
    20: { tipo: 'reflexion', titulo: 'Tercera Semana: Enraizando', tema: 'general' },
    21: { tipo: 'articulo', titulo: 'Cuarto Creciente: Tiempo de Actuar', tema: 'luna' },
    22: { tipo: 'meditacion', titulo: 'Meditación de las Raíces Doradas', tema: 'sanacion' },
    23: { tipo: 'ritual', titulo: 'Ritual de Comunicación con Ancestros', tema: 'ancestros' },
    24: { tipo: 'ensenanza', titulo: 'Piedras Lunares: La Magia de la Noche', tema: 'cristales' },
    25: { tipo: 'articulo', titulo: 'Luna Llena en Leo: Tu Luz Interior', tema: 'luna' },
    26: { tipo: 'reflexion', titulo: 'Celebrando lo Manifestado', tema: 'general' },
    27: { tipo: 'meditacion', titulo: 'Meditación del Fuego Interior', tema: 'sanacion' },
    28: { tipo: 'ritual', titulo: 'Ritual de Gratitud Lunar', tema: 'luna' },
    29: { tipo: 'ensenanza', titulo: 'Runas: El Alfabeto del Alma', tema: 'rituales' },
    30: { tipo: 'historia', titulo: 'El Guardián de los Secretos', tema: 'ancestros' },
    31: { tipo: 'guia', titulo: 'DIY: Altar Personal', tema: 'rituales' }
  };

  const info = titulos[dia];
  const faseLunar = FASES_LUNARES_ENERO_2026[dia];

  return {
    dia,
    mes: 1,
    año: 2026,
    tipo: info.tipo,
    categoria: info.tema,
    titulo: info.titulo,
    contenido: `[Contenido programado para el ${dia} de enero - ${info.titulo}]\n\nEste contenido será generado y publicado automáticamente a las 10:00 AM hora Uruguay.\n\nTema: ${info.tema}\nFase lunar: ${faseLunar.fase} ${faseLunar.emoji}\nEnergía del día: ${faseLunar.energia}`,
    duende: dia <= 19 ? 'Los Ancianos del Bosque' : 'El Consejo Elemental',
    faseLunar,
    estado: 'programado',
    horaPublicacion: '13:00',
    reacciones: { likes: 0, comentarios: 0 }
  };
}

export async function POST(request) {
  try {
    // Opción para forzar sobreescritura
    let forzar = false;
    try {
      const body = await request.json();
      forzar = body.forzar === true;
    } catch (e) {
      // No body, usar defaults
    }

    const resultados = {
      duendes: { insertados: 0, errores: 0 },
      contenidos: { insertados: 0, sobreescritos: 0, errores: 0 },
      forzar
    };

    // 1. Insertar duendes genéricos
    const historialDuendes = await kv.get('duende-semana-historial') || [];

    for (const duende of DUENDES_GENERICOS) {
      try {
        // Verificar si ya existe
        const existe = historialDuendes.find(d => d.id === duende.id);
        if (!existe) {
          historialDuendes.push({
            ...duende,
            creadoEn: new Date().toISOString(),
            esGenerico: true
          });
          resultados.duendes.insertados++;
        }
      } catch (err) {
        resultados.duendes.errores++;
      }
    }

    await kv.set('duende-semana-historial', historialDuendes);

    // Configurar el primer duende como actual si no hay ninguno
    const duendeActual = await kv.get('duende-semana-actual');
    if (!duendeActual) {
      await kv.set('duende-semana-actual', {
        ...DUENDES_GENERICOS[2], // Los Ancianos del Bosque (semana actual)
        seleccionadoEn: new Date().toISOString()
      });
    }

    // 2. Insertar contenidos
    const contenidos = generarContenidosEnero2026();

    for (const c of contenidos) {
      try {
        const key = `circulo:contenido:${c.año}:${c.mes}:${c.dia}`;
        const existe = await kv.get(key);

        if (!existe || forzar) {
          await kv.set(key, {
            ...c,
            creadoEn: new Date().toISOString(),
            actualizadoEn: existe ? new Date().toISOString() : undefined
          });
          if (existe) {
            resultados.contenidos.sobreescritos++;
          } else {
            resultados.contenidos.insertados++;
          }
        }
      } catch (err) {
        resultados.contenidos.errores++;
      }
    }

    // 3. Crear índice del mes
    const indice = {
      mes: 1,
      año: 2026,
      totalDias: contenidos.length,
      dias: contenidos.map(c => ({
        dia: c.dia,
        titulo: c.titulo,
        tipo: c.tipo,
        estado: c.estado
      })),
      creadoEn: new Date().toISOString()
    };

    await kv.set('circulo:indice:2026:1', indice);

    return Response.json({
      success: true,
      resultados,
      resumen: {
        duendesCreados: resultados.duendes.insertados,
        contenidosCreados: resultados.contenidos.insertados,
        totalContenidos: contenidos.length,
        publicados: contenidos.filter(c => c.estado === 'publicado').length,
        programados: contenidos.filter(c => c.estado === 'programado').length
      }
    });

  } catch (error) {
    console.error('[SETUP-INICIAL] Error:', error);
    return Response.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}

export async function GET() {
  return Response.json({
    info: 'Usar POST para ejecutar el setup inicial',
    descripcion: 'Crea duendes genéricos y contenido de enero 2026',
    contenidosHistoricos: '1-17 enero (publicados)',
    contenidosProgramados: '18-31 enero (programados a las 10:00 AM Uruguay)'
  });
}
