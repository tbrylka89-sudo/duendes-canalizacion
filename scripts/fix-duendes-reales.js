#!/usr/bin/env node
/**
 * CORREGIR: Borrar duendes inventados y cargar los REALES
 * Regenerar contenido de enero 1-17 con duendes que EXISTEN
 */

const fs = require('fs');
const path = require('path');

// Leer .env.local
const envPath = path.join(__dirname, '..', '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match && !process.env[match[1]]) {
      process.env[match[1]] = match[2].replace(/^["']|["']$/g, '');
    }
  });
}

// Cliente KV
async function kvSet(key, value) {
  const res = await fetch(`${process.env.KV_REST_API_URL}/set/${encodeURIComponent(key)}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.KV_REST_API_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(value)
  });
  return res.ok;
}

async function kvDel(key) {
  const res = await fetch(`${process.env.KV_REST_API_URL}/del/${encodeURIComponent(key)}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.KV_REST_API_TOKEN}`
    }
  });
  return res.ok;
}

// ═══════════════════════════════════════════════════════════════
// DUENDES REALES - Los que EXISTEN en el sistema
// ═══════════════════════════════════════════════════════════════

const DUENDES_REALES = [
  {
    id: 'finnegan',
    nombre: 'Finnegan',
    nombreCompleto: 'Finnegan, Guardián del Bosque Ancestral',
    descripcion: 'Un duende sabio y protector que habita en las raíces más antiguas del bosque. Su presencia trae estabilidad y seguridad a quienes buscan arraigo en tiempos de cambio.',
    proposito: 'Protección del hogar y arraigo',
    elemento: 'Tierra',
    personalidad: 'Sabio y protector. Habla con calma, como las raíces profundas. Sus palabras tienen peso y autoridad pero nunca son severas. Usa metáforas de la tierra, los árboles, las estaciones.',
    fraseTipica: 'Las raíces más fuertes crecen en silencio.',
    tematicas: ['protección', 'hogar', 'estabilidad', 'familia', 'arraigo'],
    cristales: ['Obsidiana', 'Jaspe Rojo', 'Turmalina Negra'],
    color: '#4A5D4A',
    imagen: 'https://duendesuy.10web.cloud/wp-content/uploads/2024/duende-finnegan.jpg'
  },
  {
    id: 'willow',
    nombre: 'Willow',
    nombreCompleto: 'Willow, Guardiana de los Sueños',
    descripcion: 'Una duende etérea que habita entre el mundo de los sueños y la vigilia. Guía a quienes buscan entender los mensajes de su subconsciente.',
    proposito: 'Intuición y mundo onírico',
    elemento: 'Agua',
    personalidad: 'Etérea y fluida. Habla como susurros del viento entre sauces. Conecta todo con los sueños, la intuición, lo que sentimos pero no vemos. Poética sin ser cursi.',
    fraseTipica: 'Los sueños son cartas que tu alma te escribe.',
    tematicas: ['sueños', 'intuición', 'emociones', 'luna', 'subconsciente'],
    cristales: ['Amatista', 'Labradorita', 'Piedra Luna'],
    color: '#6B8E9F',
    imagen: 'https://duendesuy.10web.cloud/wp-content/uploads/2024/duende-willow.jpg'
  },
  {
    id: 'bramble',
    nombre: 'Bramble',
    nombreCompleto: 'Bramble, Guardián de los Secretos',
    descripcion: 'Un duende enigmático que custodia el conocimiento oculto. Revela verdades profundas solo a quienes están preparados para recibirlas.',
    proposito: 'Conocimiento oculto y misterios',
    elemento: 'Aire',
    personalidad: 'Enigmático y perspicaz. Habla con acertijos suaves, revelando verdades de a poco. Le fascina el conocimiento esotérico, los símbolos, lo que está entre líneas.',
    fraseTipica: 'Todo secreto tiene una llave, y toda llave un momento.',
    tematicas: ['misterios', 'conocimiento', 'símbolos', 'tarot', 'revelaciones'],
    cristales: ['Lapislázuli', 'Fluorita', 'Sodalita'],
    color: '#7B68A6',
    imagen: 'https://duendesuy.10web.cloud/wp-content/uploads/2024/duende-bramble.jpg'
  },
  {
    id: 'ember',
    nombre: 'Ember',
    nombreCompleto: 'Ember, Guardiana del Fuego Interior',
    descripcion: 'Una duende de fuego que enciende la pasión y el coraje en los corazones dormidos. Empuja hacia la transformación con amor feroz.',
    proposito: 'Transformación y pasión',
    elemento: 'Fuego',
    personalidad: 'Intensa y motivadora. Habla con chispas de energía, empuja hacia la acción. No tolera la autocomplacencia pero lo hace desde el amor. Directa, cálida, encendida.',
    fraseTipica: 'El fuego que te asusta es el mismo que te transforma.',
    tematicas: ['transformación', 'coraje', 'pasión', 'cambio', 'poder personal'],
    cristales: ['Cornalina', 'Ámbar', 'Ojo de Tigre'],
    color: '#C65D3B',
    imagen: 'https://duendesuy.10web.cloud/wp-content/uploads/2024/duende-ember.jpg'
  },
  {
    id: 'moss',
    nombre: 'Moss',
    nombreCompleto: 'Moss, Sanador del Bosque',
    descripcion: 'Un duende gentil que conoce todos los secretos de las plantas medicinales. Guía hacia la sanación profunda del cuerpo y el alma.',
    proposito: 'Sanación y bienestar',
    elemento: 'Tierra/Agua',
    personalidad: 'Gentil y nutritivo. Habla como quien prepara un té de hierbas: con paciencia, con cuidado. Todo lo relaciona con el bienestar, la sanación, el autocuidado profundo.',
    fraseTipica: 'Sanar no es volver a ser quien eras, es florecer en quien estás siendo.',
    tematicas: ['sanación', 'hierbas', 'bienestar', 'descanso', 'nutrición del alma'],
    cristales: ['Cuarzo Rosa', 'Aventurina', 'Jade'],
    color: '#5D7A5D',
    imagen: 'https://duendesuy.10web.cloud/wp-content/uploads/2024/duende-moss.jpg'
  },
  {
    id: 'thornwick',
    nombre: 'Thornwick',
    nombreCompleto: 'Thornwick, Protector de Umbrales',
    descripcion: 'Un duende guardián que protege los espacios sagrados y enseña a establecer límites saludables. Firme pero amoroso.',
    proposito: 'Protección energética y límites',
    elemento: 'Tierra/Fuego',
    personalidad: 'Firme y guardián. Habla de límites con amor, de protección sin miedo. Enseña a decir que no, a cuidar la energía, a reconocer lo que no nos pertenece.',
    fraseTipica: 'Los límites no son muros, son puentes que elegís quién cruza.',
    tematicas: ['protección', 'límites', 'energía', 'discernimiento', 'fuerza'],
    cristales: ['Turmalina Negra', 'Hematita', 'Ónix'],
    color: '#8B4513',
    imagen: 'https://duendesuy.10web.cloud/wp-content/uploads/2024/duende-thornwick.jpg'
  }
];

// ═══════════════════════════════════════════════════════════════
// ASIGNACIÓN DE DUENDES A SEMANAS DE ENERO
// ═══════════════════════════════════════════════════════════════

const DUENDES_ENERO = {
  semana1: DUENDES_REALES.find(d => d.id === 'finnegan'),  // 1-7 enero: Arraigo, nuevos comienzos
  semana2: DUENDES_REALES.find(d => d.id === 'ember'),     // 8-14 enero: Fuego interior, acción
  semana3: DUENDES_REALES.find(d => d.id === 'willow')     // 15-21 enero: Sueños, intuición
};

// ═══════════════════════════════════════════════════════════════
// CONTENIDO DIARIO CON DUENDES REALES
// ═══════════════════════════════════════════════════════════════

const CONTENIDO_ENERO = [
  // SEMANA 1 - FINNEGAN (1-7 enero)
  {
    dia: 1, mes: 1, año: 2026,
    tipo: 'ritual',
    categoria: 'rituales',
    titulo: 'Ritual de Año Nuevo: Echá Raíces Firmes',
    extracto: 'Finnegan te guía para plantar intenciones sólidas como las raíces de un roble.',
    duende: { id: 'finnegan', nombre: 'Finnegan' },
    secciones: {
      intro: 'Antes de correr hacia adelante, necesitás saber dónde están tus pies. Soy Finnegan, y lo primero que hago cada año nuevo es tocar la tierra. Hoy te invito a hacer lo mismo.',
      desarrollo: 'Buscá un lugar tranquilo. Si podés estar descalza sobre tierra o pasto, mejor. Si no, parada en tu casa está bien.\n\nCerrá los ojos. Sentí el peso de tu cuerpo hacia abajo. Imaginá que de tus pies salen raíces, finas primero, pero cada vez más gruesas. Esas raíces atraviesan el piso, la piedra, el agua subterránea. Llegan hasta el centro de la tierra.\n\nAhora pensá en UNA palabra que represente lo que querés cultivar este año. No la fuerces. Dejá que aparezca.\n\nCuando la tengas, decila en voz baja: "[Tu palabra], te planto en tierra fértil."\n\nEsa palabra es tu semilla. Durante enero, la vas a regar cada día.',
      practica: 'Escribí tu palabra en un papel y ponela donde la veas cada mañana. Cada vez que la mires, sentí tus pies en el suelo. Las raíces más fuertes crecen en silencio.',
      cierre: 'No apures el crecimiento. Un árbol no se hace en un día. Tampoco vos.'
    }
  },
  {
    dia: 2, mes: 1, año: 2026,
    tipo: 'meditacion',
    categoria: 'sanacion',
    titulo: 'Meditación: Limpieza de Terreno',
    extracto: 'Finnegan te ayuda a preparar el suelo interno para lo que viene.',
    duende: { id: 'finnegan', nombre: 'Finnegan' },
    secciones: {
      intro: 'Antes de plantar, hay que limpiar. El terreno de tu vida acumuló hojas secas del año pasado: preocupaciones que ya no sirven, miedos que cumplieron su función, resentimientos que pesan.',
      desarrollo: 'Sentate cómoda. Cerrá los ojos.\n\nImaginá que estás en un claro del bosque. El suelo está cubierto de hojas secas, ramas caídas, todo lo que el año pasado dejó.\n\nAhora empieza a llover. Pero no es agua común: es luz dorada. Cada gota que cae disuelve una hoja, limpia una rama. El bosque se aclara.\n\nLa lluvia dorada también cae sobre vos. Sentí cómo entra por tu cabeza y baja, disolviendo tensiones en los hombros, el pecho, el estómago. Todo lo que no necesitás se va por tus pies, vuelve a la tierra, se transforma en nutriente.\n\nQuedás limpia. El terreno queda listo.',
      practica: 'Hacé esta meditación durante los próximos 3 días. Cada vez que te sientas cargada, recordá la lluvia dorada.',
      cierre: 'La tierra acepta todo lo que le devuelvas. No cargues lo que ya cumplió su ciclo.'
    }
  },
  {
    dia: 3, mes: 1, año: 2026,
    tipo: 'articulo',
    categoria: 'esoterico',
    titulo: 'El Número de tu Año Personal',
    extracto: 'Finnegan te revela la energía numérica que te acompañará en 2026.',
    duende: { id: 'finnegan', nombre: 'Finnegan' },
    secciones: {
      intro: 'Los números son raíces invisibles que sostienen los ciclos. Cada año tiene una vibración distinta para vos, y conocerla te ayuda a fluir en lugar de luchar.',
      desarrollo: '**Cómo calcular tu número:**\n\nSumá tu día de nacimiento + tu mes de nacimiento + 2026.\n\nEjemplo: 15 de marzo = 1+5+0+3+2+0+2+6 = 19 → 1+9 = 10 → 1+0 = **1**\n\n**Los significados:**\n\n**Año 1**: Sembrar. Iniciar. Liderarte a vos misma.\n**Año 2**: Cultivar paciencia. Relaciones. Esperar.\n**Año 3**: Florecer creativamente. Expresarte. Alegría.\n**Año 4**: Construir estructura. Trabajo. Cimientos.\n**Año 5**: Adaptarte. Cambios. Libertad.\n**Año 6**: Nutrir. Hogar. Responsabilidad amorosa.\n**Año 7**: Ir hacia adentro. Reflexionar. Estudiar.\n**Año 8**: Cosechar. Abundancia. Poder.\n**Año 9**: Cerrar ciclos. Soltar. Preparar.',
      practica: 'Calculá tu número y escribilo junto a tu palabra del año. Preguntate: ¿qué me pide este número?',
      cierre: 'Los números no predicen, revelan. La última palabra siempre es tuya.'
    }
  },
  {
    dia: 4, mes: 1, año: 2026,
    tipo: 'guia',
    categoria: 'diy',
    titulo: 'DIY: Creá tu Altar de Intenciones',
    extracto: 'Finnegan te enseña a armar un espacio sagrado para tus metas.',
    duende: { id: 'finnegan', nombre: 'Finnegan' },
    secciones: {
      intro: 'Un altar no es decoración. Es un portal de enfoque. Cada vez que lo mirás, tu mente recuerda hacia dónde vas. Hoy armamos el tuyo.',
      desarrollo: '**Necesitás:**\n- Una superficie (mesa, estante, caja)\n- Una tela que te guste\n- Una vela (blanca o el color de tu intención)\n- Algo de la tierra (piedra, planta, cristal)\n- Tu palabra del año escrita\n\n**Armado:**\n\n1. Limpiá el espacio físicamente. Ordenar es el primer ritual.\n\n2. Colocá la tela. Elegí un color que te inspire.\n\n3. En el centro, la vela. Es tu foco, tu luz guía.\n\n4. A la izquierda, algo de la tierra (representa tus raíces).\n\n5. A la derecha, un cristal o piedra (representa tu fortaleza).\n\n6. Adelante, tu palabra escrita.\n\n7. Opcional: una foto, una imagen que represente tu meta.',
      practica: 'Encendé la vela al menos 5 minutos por día. Mientras esté prendida, visualizá tu intención ya cumplida.',
      cierre: 'Tu altar es un espejo de tu mundo interior. Cuidalo como cuidarías un jardín.'
    }
  },
  {
    dia: 5, mes: 1, año: 2026,
    tipo: 'historia',
    categoria: 'duendes',
    titulo: 'La Historia de Finnegan',
    extracto: 'Conocé cómo Finnegan se convirtió en el Guardián del Bosque Ancestral.',
    duende: { id: 'finnegan', nombre: 'Finnegan' },
    secciones: {
      intro: 'Me preguntan seguido cómo llegué a ser guardián. No nací siéndolo. Me convertí.',
      desarrollo: 'Hace más tiempo del que puedo contar, yo era un duende sin propósito. Saltaba de árbol en árbol, de lugar en lugar, buscando algo que no sabía nombrar.\n\nUn día llegué a un roble tan viejo que sus raíces se confundían con las de la montaña. Me senté a su sombra, exhausto.\n\n"¿Por qué corrés tanto?", me preguntó el roble.\n\n"Busco mi lugar", respondí.\n\n"Tu lugar no se encuentra corriendo. Se encuentra quedándote."\n\nMe quedé. Un día. Una semana. Un año. Mientras más quieto estaba, más podía sentir: el agua subterránea, los minerales de la tierra, las raíces de otros árboles comunicándose.\n\nAprendí que la fuerza no está en moverse mucho. Está en elegir bien dónde poner las raíces.\n\nEl roble ya no está, pero sus raíces siguen vivas bajo la tierra. Y yo sigo cuidando ese lugar.',
      practica: 'Hoy, elegí un momento para quedarte quieta. Sin teléfono, sin distracciones. Solo vos y el silencio. Notá qué aparece.',
      cierre: 'En la quietud encontré más de lo que jamás encontré corriendo.'
    }
  },
  {
    dia: 6, mes: 1, año: 2026,
    tipo: 'reflexion',
    categoria: 'cosmos',
    titulo: 'Luna Creciente: Tiempo de Construir',
    extracto: 'Finnegan explica cómo aprovechar la energía de la luna que crece.',
    duende: { id: 'finnegan', nombre: 'Finnegan' },
    secciones: {
      intro: 'La luna está creciendo. En el bosque, esto significa que es tiempo de agregar, no de podar. La energía se expande.',
      desarrollo: '**Qué hacer en luna creciente:**\n\n- Empezar proyectos\n- Plantar (literal y metafóricamente)\n- Pedir lo que necesitás\n- Tener conversaciones importantes\n- Estudiar algo nuevo\n- Conectar con gente\n\n**Qué evitar:**\n\n- Terminar relaciones\n- Cortar drásticamente\n- Eliminaciones extremas\n- Aislarte demasiado\n\nLa luna te enseña paciencia. No intenta ser llena antes de tiempo. Cada fase tiene su propósito.',
      practica: 'Cada noche de luna creciente, preguntate: "¿Qué agregué hoy a mi vida?" Si la respuesta es "nada", mañana elegí algo pequeño para sumar.',
      cierre: 'No apures los ciclos. La luna no compite con nadie para crecer.'
    }
  },
  {
    dia: 7, mes: 1, año: 2026,
    tipo: 'articulo',
    categoria: 'sanacion',
    titulo: 'Las 7 Raíces de tu Vida',
    extracto: 'Finnegan te invita a evaluar qué tan firmes están tus cimientos.',
    duende: { id: 'finnegan', nombre: 'Finnegan' },
    secciones: {
      intro: 'Último día conmigo esta semana. Antes de que llegue Ember, quiero que revises tus raíces. Un árbol con raíces débiles no sobrevive la tormenta.',
      desarrollo: '**Las 7 raíces de una vida estable:**\n\n1. **Cuerpo**: ¿Dormís bien? ¿Te movés? ¿Comés?\n\n2. **Emociones**: ¿Tenés herramientas para procesar lo que sentís?\n\n3. **Relaciones**: ¿Tus vínculos te nutren o te drenan?\n\n4. **Recursos**: ¿Llegás a fin de mes? ¿Tenés claridad financiera?\n\n5. **Propósito**: ¿Tu trabajo tiene sentido para vos?\n\n6. **Crecimiento**: ¿Estás aprendiendo algo?\n\n7. **Conexión espiritual**: ¿Tenés algo más grande que vos?\n\n**Ejercicio:**\nDale a cada raíz un puntaje del 1 al 10. Las que estén por debajo de 5 son tu prioridad.',
      practica: 'Escribí tu puntaje y guardalo. En un mes, volvé a hacerlo. El progreso se mide, no se adivina.',
      cierre: 'No se puede construir alto sobre cimientos débiles. Primero, las raíces. Después, el cielo.'
    }
  },

  // SEMANA 2 - EMBER (8-14 enero)
  {
    dia: 8, mes: 1, año: 2026,
    tipo: 'ritual',
    categoria: 'rituales',
    titulo: 'Ritual del Fuego Interior',
    extracto: 'Ember te despierta la llama que llevás dormida.',
    duende: { id: 'ember', nombre: 'Ember' },
    secciones: {
      intro: 'Finnegan te dio raíces. Yo te voy a dar fuego. Soy Ember, y no vine a que te sientas cómoda. Vine a que despiertes.',
      desarrollo: 'Necesitás una vela roja o naranja. Si no tenés, blanca sirve.\n\nSentate frente a la vela apagada. Cerrá los ojos.\n\nPensá en algo que querés hacer pero te da miedo. Algo que postergás. Algo que sabés que tenés que enfrentar.\n\nSentí ese miedo en el cuerpo. ¿Dónde está? ¿En el pecho? ¿En el estómago?\n\nAhora encendé la vela.\n\nMirá la llama. Esa misma energía está en vos. El fuego no pide permiso para arder. No se disculpa por quemar lo que tiene que quemar.\n\nDecí en voz alta: "El fuego que me asusta es el mismo que me transforma."\n\nDejá que el miedo siga ahí. Pero ahora tenés fuego también.',
      practica: 'Esta semana, cada vez que sientas miedo, tocá tu pecho y recordá la llama. El fuego y el miedo pueden coexistir.',
      cierre: 'No esperes a no tener miedo para actuar. El coraje es actuar con miedo.'
    }
  },
  {
    dia: 9, mes: 1, año: 2026,
    tipo: 'meditacion',
    categoria: 'sanacion',
    titulo: 'Meditación: Encender tu Centro',
    extracto: 'Ember te guía para conectar con tu fuego interior.',
    duende: { id: 'ember', nombre: 'Ember' },
    secciones: {
      intro: 'Hay un lugar en tu cuerpo donde vive tu fuego. No en la cabeza, donde pensás de más. Más abajo. En el vientre.',
      desarrollo: 'Sentate o acostate. Cerrá los ojos.\n\nLlevá tu atención al espacio entre tu ombligo y tu pelvis. Los orientales le dicen "hara". Es tu centro de poder.\n\nImaginá que ahí hay una brasa. Pequeña, pero viva. Cada vez que inhalás, la brasa se enciende un poco más. Cada vez que exhalás, se expande.\n\nLa brasa se convierte en llama. La llama crece, sube por tu columna, llena tu pecho de calor. No quema: empodera.\n\nSentí esa energía. Es tuya. Siempre estuvo ahí.\n\nCuando estés lista, llevá esa llama de vuelta al vientre. Queda ahí, lista para cuando la necesites.',
      practica: 'Antes de cualquier situación desafiante, poné una mano en tu vientre y recordá la llama. Actuá desde ahí.',
      cierre: 'Tu poder no está afuera. Está en tu centro. Nadie puede apagarlo sin tu permiso.'
    }
  },
  {
    dia: 10, mes: 1, año: 2026,
    tipo: 'articulo',
    categoria: 'esoterico',
    titulo: 'Los Cristales del Fuego',
    extracto: 'Ember te presenta las piedras que activan tu pasión.',
    duende: { id: 'ember', nombre: 'Ember' },
    secciones: {
      intro: 'Las piedras guardan energía de la tierra. Algunas guardan fuego. Estas son mis aliadas.',
      desarrollo: '**Cornalina**\nLa piedra de la acción. Cuando no tenés ganas de nada, cuando la procrastinación te domina, cornalina en el bolsillo. Activa el sacro, donde vive la motivación.\n\n**Ojo de Tigre**\nProtección + acción. Para cuando tenés que hacer algo que te da miedo. Te da el coraje del tigre sin la impulsividad.\n\n**Ámbar**\nTécnicamente no es piedra, es resina fósil. Pero guarda la luz del sol de hace millones de años. Cuando te sentís apagada, el ámbar te recuerda que la luz vuelve.\n\n**Granate**\nPasión profunda. No la pasión efímera: la que dura. Para proyectos largos, para relaciones que necesitan fuego.\n\n**Citrino**\nAlegría de fuego. No es intenso como la cornalina, es más suave. Pero sostiene la llama de buen humor incluso en días grises.',
      practica: 'Elegí UNA piedra de fuego. Llevala esta semana. Antes de usarla, sostenela en tus manos y pedile que active tu llama.',
      cierre: 'Los cristales amplifican lo que ya tenés. El fuego es tuyo. Ellos solo lo avivan.'
    }
  },
  {
    dia: 11, mes: 1, año: 2026,
    tipo: 'guia',
    categoria: 'diy',
    titulo: 'DIY: Frasco de Intenciones de Fuego',
    extracto: 'Ember te enseña a crear un talismán de acción.',
    duende: { id: 'ember', nombre: 'Ember' },
    secciones: {
      intro: 'Hoy creamos algo que te recuerde actuar. No más "mañana empiezo". El fuego no espera.',
      desarrollo: '**Necesitás:**\n- Un frasco pequeño con tapa\n- Papelitos\n- Canela (en polvo o rama)\n- Una piedra pequeña roja o naranja (o una cuenta de vidrio)\n- Opcional: pimentón, jengibre seco\n\n**Preparación:**\n\n1. Escribí en 7 papelitos 7 acciones que venís postergando. Cosas concretas, no abstractas.\n\n2. Doblá cada papelito y ponelos en el frasco.\n\n3. Agregá la canela (activa la energía).\n\n4. Agregá la piedra roja.\n\n5. Opcional: una pizca de pimentón (fuego extra).\n\n6. Cerrá el frasco y sacudilo mientras decís: "El fuego que me asusta es el mismo que me transforma."\n\n**Uso:**\nCada mañana, sacudí el frasco y sacá un papelito sin mirar. Esa es tu acción del día. No la postergas. La hacés.',
      practica: 'Cuando completes una acción, quemá el papelito (con cuidado) y agradecé. El fuego transforma.',
      cierre: 'Las intenciones sin acción son fantasías. Actuá.'
    }
  },
  {
    dia: 12, mes: 1, año: 2026,
    tipo: 'historia',
    categoria: 'duendes',
    titulo: 'La Historia de Ember',
    extracto: 'Conocé cómo Ember descubrió su fuego interior.',
    duende: { id: 'ember', nombre: 'Ember' },
    secciones: {
      intro: 'No siempre fui fuego. Hubo un tiempo en que era ceniza.',
      desarrollo: 'Hace muchas lunas, yo era una duende que complacía. Hacía lo que me decían, callaba lo que sentía, me achicaba para que otros se sintieran grandes.\n\nUn día, el bosque se incendió. No fue un incendio cualquiera: fue un fuego que quemó todo lo que yo conocía. Mi hogar, mis certezas, mi forma de vivir.\n\nMientras todo ardía, sentí algo extraño. En lugar de miedo, sentí... alivio. El fuego estaba quemando lo que ya estaba muerto. Lo que yo no me animaba a soltar.\n\nCuando las llamas se apagaron, quedé parada en medio de las cenizas. Y desde esas cenizas, algo nuevo creció en mí.\n\nEntendí que el fuego no es el enemigo. El fuego es el maestro más honesto. No negocia. No espera. Transforma.\n\nDesde entonces, llevo ese fuego adentro. Y mi trabajo es recordarte que vos también lo tenés.',
      practica: 'Preguntate: ¿Qué necesita quemarse en mi vida? ¿Qué estoy manteniendo vivo que ya murió?',
      cierre: 'De las cenizas nacen bosques enteros. No le temas al fuego. Él sabe lo que hace.'
    }
  },
  {
    dia: 13, mes: 1, año: 2026,
    tipo: 'reflexion',
    categoria: 'cosmos',
    titulo: 'Luna Llena del Lobo',
    extracto: 'Ember te conecta con la energía de la primera luna llena del año.',
    duende: { id: 'ember', nombre: 'Ember' },
    secciones: {
      intro: 'La luna está llena. Le dicen Luna del Lobo porque en esta época los lobos aúllan más. Pero no aúllan de tristeza. Aúllan para recordarse quiénes son.',
      desarrollo: '**La Luna del Lobo te pregunta:**\n\n- ¿Quién sos cuando nadie te ve?\n- ¿Qué instinto estás ignorando?\n- ¿Dónde estás fingiendo ser mansa cuando sos salvaje?\n- ¿Qué territorio necesitás marcar?\n\nEl lobo no se disculpa por ocupar espacio. No pide permiso para aullar. No se hace pequeño para que otros se sientan cómodos.\n\nEsta luna te invita a reconectar con tu naturaleza más auténtica. La parte de vos que sabe lo que quiere y no tiene vergüenza de ir por ello.',
      practica: 'Esta noche, si podés, mirá la luna. Respirá profundo y hacé un sonido desde tu vientre. No tiene que ser un aullido literal. Pero dejá salir algo. Algo que estaba guardado.',
      cierre: 'El lobo que aúlla solo sigue siendo lobo. No dejes que nada te haga olvidar tu naturaleza.'
    }
  },
  {
    dia: 14, mes: 1, año: 2026,
    tipo: 'articulo',
    categoria: 'sanacion',
    titulo: 'Despedida de Ember: El Mapa de tu Fuego',
    extracto: 'Ember te deja una herramienta para seguir ardiendo.',
    duende: { id: 'ember', nombre: 'Ember' },
    secciones: {
      intro: 'Último día conmigo. Mañana llega Willow con sus sueños y susurros. Pero antes de irme, quiero asegurarme de que tu fuego siga encendido.',
      desarrollo: '**El Mapa de tu Fuego:**\n\nDibujá un círculo y dividilo en 4 partes:\n\n**1. Pasión**: ¿Qué te enciende? ¿Qué harías gratis porque te llena?\n\n**2. Coraje**: ¿Qué estás evitando que necesita tu fuego?\n\n**3. Acción**: ¿Qué paso concreto podés dar esta semana?\n\n**4. Transformación**: ¿Qué necesita quemarse para que nazca algo nuevo?\n\nCompletá cada sección con honestidad brutal. El fuego no miente.',
      practica: 'Guardá este mapa. Cada vez que te sientas apagada, miralo y preguntate: ¿Dónde perdí la llama?',
      cierre: 'El fuego que te asusta es el mismo que te transforma. No lo olvides nunca.'
    }
  },

  // SEMANA 3 - WILLOW (15-21 enero, solo hasta el 17)
  {
    dia: 15, mes: 1, año: 2026,
    tipo: 'ritual',
    categoria: 'rituales',
    titulo: 'Ritual de los Sueños: Abriendo el Canal',
    extracto: 'Willow te enseña a recordar y entender tus sueños.',
    duende: { id: 'willow', nombre: 'Willow' },
    secciones: {
      intro: 'Finnegan te arraigó. Ember te encendió. Yo vengo a llevarte a otro lugar. Soy Willow, y habito donde tus ojos no pueden ver: en el mundo de los sueños.',
      desarrollo: 'Necesitás un cuaderno que usarás SOLO para sueños. Dejalo junto a tu cama con algo para escribir.\n\n**Antes de dormir:**\n\n1. Sentate en la cama. Cerrá los ojos.\n\n2. Decí: "Esta noche voy a recordar mis sueños."\n\n3. Imaginá un puente plateado entre tu mente despierta y tu mente dormida. Cruzalo.\n\n4. Del otro lado hay un buzón. Es donde tu subconsciente deja mensajes. Abrilo (aunque esté vacío) y decí: "Estoy lista para recibir."\n\n5. Volvé a cruzar el puente y dormite.\n\n**Al despertar:**\nNo te muevas. No abras los ojos. Recordá lo último que soñaste. Aunque sea un color, una sensación. Después escribí.',
      practica: 'Hacé este ritual cada noche esta semana. Para el día 7, vas a estar recordando sueños con claridad.',
      cierre: 'Los sueños son cartas de amor que tu alma te escribe. Aprendé a leerlas.'
    }
  },
  {
    dia: 16, mes: 1, año: 2026,
    tipo: 'meditacion',
    categoria: 'sanacion',
    titulo: 'Meditación: Viaje al Lago Interior',
    extracto: 'Willow te guía a conocer tu guía interior.',
    duende: { id: 'willow', nombre: 'Willow' },
    secciones: {
      intro: 'Hay un lugar dentro tuyo donde las respuestas esperan. No necesitás buscarlo afuera. Solo necesitás recordar el camino.',
      desarrollo: 'Acostate cómoda. Cerrá los ojos. Respirá profundo tres veces.\n\nEstás en un bosque de noche. La luna llena ilumina todo con luz plateada. El aire es fresco.\n\nFrente a vos hay un lago quieto como un espejo. En el centro del lago, una isla pequeña con un sauce luminoso.\n\nEmpezás a caminar sobre el agua. Cada paso crea ondas plateadas. Llegás a la isla.\n\nBajo el sauce hay alguien esperándote. Es tu Guía Interior. Puede tener cualquier forma: persona, animal, luz, tu versión del futuro.\n\nSentate frente a tu Guía. No hables. Solo miralo. Sentí su presencia.\n\nCuando estés lista, hacé UNA pregunta.\n\nEscuchá la respuesta. Puede venir en palabras, imágenes, sensaciones, o silencio.\n\nAgradecé y volvé.',
      practica: 'Anotá lo que recibiste, aunque no tenga sentido ahora. Las respuestas del guía interior a veces tardan días en revelarse.',
      cierre: 'Tu guía interior nunca se fue. Simplemente dejaste de visitarlo.'
    }
  },
  {
    dia: 17, mes: 1, año: 2026,
    tipo: 'articulo',
    categoria: 'esoterico',
    titulo: 'El Lenguaje de los Sueños',
    extracto: 'Willow te da las claves para interpretar tus sueños.',
    duende: { id: 'willow', nombre: 'Willow' },
    secciones: {
      intro: 'Los sueños no hablan en español. Hablan en símbolos. Hoy te doy un pequeño diccionario para empezar a entenderlos.',
      desarrollo: '**Agua**: Tu estado emocional. Clara = procesado. Turbia = revuelta. Mar agitado = desborde.\n\n**Casas**: Tu mente. Cada habitación es un aspecto de tu psique. Sótano = subconsciente. Ático = espiritualidad.\n\n**Vehículos**: Tu dirección en la vida. ¿Quién maneja? ¿Hay frenos?\n\n**Caída de dientes**: Miedo a perder poder o atractivo.\n\n**Volar**: Libertad. ¿Volás fácil o con miedo?\n\n**Persecuciones**: Algo que evitás enfrentar.\n\n**Muerte**: Casi nunca literal. Fin de etapa, transformación.\n\n**Animales**: Aspectos instintivos. Cada animal significa algo distinto.\n\n**Personas conocidas**: Pueden ser esas personas O aspectos de vos que asociás con ellas.',
      practica: 'Revisá tu diario de sueños. ¿Hay símbolos recurrentes? Buscalos en esta guía.',
      cierre: 'Los diccionarios de sueños son guías, no verdades. Tu subconsciente tiene su propio lenguaje. Aprendé a escucharlo.'
    }
  }
];

// ═══════════════════════════════════════════════════════════════
// FUNCIONES
// ═══════════════════════════════════════════════════════════════

async function borrarDuendesInventados() {
  console.log('\n🗑️ Borrando duendes inventados...');

  // Borrar lista de duendes falsos
  await kvSet('circulo:duendes-reales', []);
  await kvDel('duende-semana-actual');

  console.log('  ✅ Duendes inventados eliminados');
}

async function cargarDuendesReales() {
  console.log('\n🧚 Cargando duendes REALES...');

  const ahora = new Date().toISOString();
  const duendesConFecha = DUENDES_REALES.map(d => ({
    ...d,
    creadoEn: ahora
  }));

  await kvSet('circulo:duendes-reales', duendesConFecha);

  for (const d of DUENDES_REALES) {
    console.log(`  ✅ ${d.nombre} - ${d.nombreCompleto}`);
  }

  // Establecer Finnegan como duende actual
  await kvSet('duende-semana-actual', {
    ...DUENDES_ENERO.semana1,
    seleccionadoEn: ahora
  });
  console.log(`\n  👑 ${DUENDES_ENERO.semana1.nombre} establecido como Duende de la Semana`);
}

async function regenerarContenido() {
  console.log('\n📝 Regenerando contenido con duendes REALES...');

  const ahora = new Date().toISOString();

  // Primero borrar contenido viejo de enero
  for (let dia = 1; dia <= 17; dia++) {
    await kvDel(`circulo:contenido:2026:1:${dia}`);
  }
  console.log('  🗑️ Contenido viejo eliminado');

  // Crear contenido nuevo
  for (const contenido of CONTENIDO_ENERO) {
    const { dia, mes, año } = contenido;
    const key = `circulo:contenido:${año}:${mes}:${dia}`;
    const fecha = `${año}-${String(mes).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;

    const datos = {
      id: fecha,
      fecha: `${fecha}T00:00:00Z`,
      dia, mes, año,
      tipo: contenido.tipo,
      categoria: contenido.categoria,
      titulo: contenido.titulo,
      extracto: contenido.extracto,
      duende: contenido.duende,
      secciones: contenido.secciones,
      estado: 'publicado',
      publicadoEn: ahora,
      creadoEn: ahora
    };

    await kvSet(key, datos);
    console.log(`  ✅ Día ${dia}: ${contenido.titulo.substring(0, 40)}... (${contenido.duende.nombre})`);

    await sleep(100);
  }

  // Actualizar índice
  const indice = {
    dias: CONTENIDO_ENERO.map(c => ({
      dia: c.dia,
      titulo: c.titulo,
      tipo: c.tipo,
      duende: c.duende.nombre,
      estado: 'publicado'
    })),
    totalDias: CONTENIDO_ENERO.length
  };

  await kvSet('circulo:indice:2026:1', indice);
  console.log('\n  📊 Índice actualizado');
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
  console.log('═'.repeat(60));
  console.log('  CORREGIR: DUENDES REALES + CONTENIDO ENERO');
  console.log('═'.repeat(60));

  await borrarDuendesInventados();
  await cargarDuendesReales();
  await regenerarContenido();

  console.log('\n' + '═'.repeat(60));
  console.log('  ✅ COMPLETADO');
  console.log('═'.repeat(60));
  console.log('\n  Duendes cargados: 6 (Finnegan, Willow, Bramble, Ember, Moss, Thornwick)');
  console.log('  Contenido regenerado: 17 días');
  console.log('\n  Semana 1 (1-7): Finnegan');
  console.log('  Semana 2 (8-14): Ember');
  console.log('  Semana 3 (15-17): Willow');
  console.log('\n');
}

main().catch(console.error);
