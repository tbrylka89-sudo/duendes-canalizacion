// ═══════════════════════════════════════════════════════════════════════════════
// SCRIPT COMPLETO: Sincronizar duendes reales + Generar contenido enero + Catálogo
// ═══════════════════════════════════════════════════════════════════════════════

const fs = require('fs');
const path = require('path');

// Cargar variables de entorno
const envPath = path.join(__dirname, '..', '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
envContent.split('\n').forEach(line => {
  const [key, ...valueParts] = line.split('=');
  if (key && valueParts.length > 0) {
    process.env[key.trim()] = valueParts.join('=').trim().replace(/^["']|["']$/g, '');
  }
});

const WC_URL = process.env.WORDPRESS_URL || 'https://duendesuy.10web.cloud';
const WC_KEY = process.env.WC_CONSUMER_KEY;
const WC_SECRET = process.env.WC_CONSUMER_SECRET;
const KV_URL = process.env.KV_REST_API_URL;
const KV_TOKEN = process.env.KV_REST_API_TOKEN;

// ═══════════════════════════════════════════════════════════════════════════════
// FUNCIONES DE KV
// ═══════════════════════════════════════════════════════════════════════════════

async function kvSet(key, value) {
  const res = await fetch(`${KV_URL}/set/${key}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${KV_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(value)
  });
  return res.ok;
}

async function kvGet(key) {
  const res = await fetch(`${KV_URL}/get/${key}`, {
    headers: { Authorization: `Bearer ${KV_TOKEN}` }
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data.result;
}

async function kvDel(key) {
  const res = await fetch(`${KV_URL}/del/${key}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${KV_TOKEN}` }
  });
  return res.ok;
}

// ═══════════════════════════════════════════════════════════════════════════════
// 1. SINCRONIZAR DUENDES REALES DE WOOCOMMERCE
// ═══════════════════════════════════════════════════════════════════════════════

async function sincronizarDuendesReales() {
  console.log('\n═══════════════════════════════════════════════════════════════');
  console.log('1. SINCRONIZANDO DUENDES REALES DE WOOCOMMERCE');
  console.log('═══════════════════════════════════════════════════════════════\n');

  // Obtener productos de WooCommerce
  const url = `${WC_URL}/wp-json/wc/v3/products?per_page=100&consumer_key=${WC_KEY}&consumer_secret=${WC_SECRET}`;
  const res = await fetch(url);
  const productos = await res.json();

  console.log(`Total productos en WooCommerce: ${productos.length}`);

  // Filtrar solo guardianes (excluir pixies, runas, círculo, etc.)
  const guardianes = productos.filter(p => {
    const nombre = p.name.toLowerCase();
    const excluir = ['pixie', 'runas', 'círculo', 'paquete', 'prueba', 'lectura', '100 ', '50 ', '30 '];
    return !excluir.some(e => nombre.includes(e)) && p.slug && p.images?.length > 0;
  });

  // Filtrar pixies
  const pixies = productos.filter(p => p.name.toLowerCase().includes('pixie') && p.images?.length > 0);

  console.log(`Guardianes encontrados: ${guardianes.length}`);
  console.log(`Pixies encontrados: ${pixies.length}`);

  // Mapear a formato interno
  const duendesReales = guardianes.map(g => ({
    id: g.slug,
    wooId: g.id,
    nombre: g.name,
    slug: g.slug,
    imagen: g.images[0]?.src || null,
    categoria: g.categories?.[0]?.name || 'Guardian',
    descripcion: g.short_description || '',
    precio: parseFloat(g.price) || 0,
    tipo: 'guardian'
  }));

  const pixiesReales = pixies.map(p => ({
    id: p.slug,
    wooId: p.id,
    nombre: p.name,
    slug: p.slug,
    imagen: p.images[0]?.src || null,
    categoria: 'Pixie',
    descripcion: p.short_description || '',
    precio: parseFloat(p.price) || 0,
    tipo: 'pixie'
  }));

  // Guardar en KV
  await kvSet('duendes:guardianes', duendesReales);
  await kvSet('duendes:pixies', pixiesReales);
  await kvSet('duendes:todos', [...duendesReales, ...pixiesReales]);

  // Borrar duendes inventados del sistema anterior
  await kvDel('circulo:duendes-reales');
  await kvDel('duende-semana-actual');

  console.log(`\n✓ Guardados ${duendesReales.length} guardianes reales`);
  console.log(`✓ Guardados ${pixiesReales.length} pixies reales`);

  // Mostrar algunos nombres
  console.log('\nGuardianes reales:');
  duendesReales.slice(0, 15).forEach(d => console.log(`  - ${d.nombre}`));
  if (duendesReales.length > 15) console.log(`  ... y ${duendesReales.length - 15} más`);

  return { guardianes: duendesReales, pixies: pixiesReales };
}

// ═══════════════════════════════════════════════════════════════════════════════
// 2. GENERAR CONTENIDO ENERO 1-18 CON DUENDES REALES
// ═══════════════════════════════════════════════════════════════════════════════

async function generarContenidoEnero(guardianes) {
  console.log('\n═══════════════════════════════════════════════════════════════');
  console.log('2. GENERANDO CONTENIDO ENERO 1-18 CON DUENDES REALES');
  console.log('═══════════════════════════════════════════════════════════════\n');

  // Seleccionar 3 guardianes destacados para las semanas
  const duendeSemana1 = guardianes.find(g => g.nombre === 'Finnian') || guardianes[0];
  const duendeSemana2 = guardianes.find(g => g.nombre === 'Freya') || guardianes[1];
  const duendeSemana3 = guardianes.find(g => g.nombre === 'Izara') || guardianes[2];

  console.log(`Semana 1 (1-7 enero): ${duendeSemana1.nombre}`);
  console.log(`Semana 2 (8-14 enero): ${duendeSemana2.nombre}`);
  console.log(`Semana 3 (15-18 enero): ${duendeSemana3.nombre}`);

  const tiposContenido = [
    { tipo: 'mensaje', nombre: 'Mensaje del Día', icono: '💬' },
    { tipo: 'meditacion', nombre: 'Meditación Guiada', icono: '🧘' },
    { tipo: 'ritual', nombre: 'Ritual', icono: '🕯️' },
    { tipo: 'conocimiento', nombre: 'Conocimiento Ancestral', icono: '📚' },
    { tipo: 'diy', nombre: 'Hazlo Tú Mismo', icono: '🌿' },
    { tipo: 'leyenda', nombre: 'Leyenda del Guardián', icono: '📜' },
    { tipo: 'reflexion', nombre: 'Reflexión del Atardecer', icono: '🌅' }
  ];

  const contenidoEnero = [];

  for (let dia = 1; dia <= 18; dia++) {
    let duende;
    if (dia <= 7) duende = duendeSemana1;
    else if (dia <= 14) duende = duendeSemana2;
    else duende = duendeSemana3;

    const tipoIndex = (dia - 1) % 7;
    const tipoHoy = tiposContenido[tipoIndex];

    const contenido = {
      id: `enero-2026-dia-${dia}`,
      dia,
      mes: 1,
      año: 2026,
      fecha: `2026-01-${dia.toString().padStart(2, '0')}`,
      tipo: tipoHoy.tipo,
      tipoNombre: tipoHoy.nombre,
      icono: tipoHoy.icono,
      duende: {
        id: duende.id,
        nombre: duende.nombre,
        imagen: duende.imagen
      },
      titulo: generarTitulo(tipoHoy, duende, dia),
      contenido: generarContenidoTexto(tipoHoy, duende, dia),
      extracto: generarExtracto(tipoHoy, duende),
      publicado: true,
      creadoEn: new Date().toISOString()
    };

    contenidoEnero.push(contenido);
  }

  // Guardar en KV
  await kvSet('circulo:contenido:2026:1', contenidoEnero);
  await kvSet('circulo:contenido:actual', contenidoEnero);

  // Establecer duende de la semana actual (semana 3)
  await kvSet('duende-semana-actual', {
    ...duendeSemana3,
    semana: 3,
    seleccionadoEn: new Date().toISOString()
  });

  console.log(`\n✓ Generados ${contenidoEnero.length} días de contenido`);
  console.log('\nResumen:');
  contenidoEnero.forEach(c => {
    console.log(`  Día ${c.dia}: ${c.tipoNombre} - "${c.titulo}" (${c.duende.nombre})`);
  });

  return contenidoEnero;
}

function generarTitulo(tipo, duende, dia) {
  const titulos = {
    mensaje: [
      `Palabras de ${duende.nombre} para comenzar el día`,
      `${duende.nombre} te susurra al oído`,
      `El saludo matutino de ${duende.nombre}`,
      `${duende.nombre} comparte su sabiduría`,
      `Mensaje especial de ${duende.nombre}`,
      `${duende.nombre} te acompaña hoy`,
      `Las palabras de ${duende.nombre} para vos`
    ],
    meditacion: [
      `Meditación guiada por ${duende.nombre}`,
      `Viaje interior con ${duende.nombre}`,
      `${duende.nombre} te lleva al silencio`,
      `Respirá con ${duende.nombre}`,
      `El jardín secreto de ${duende.nombre}`,
      `${duende.nombre} y el momento presente`,
      `Conexión profunda con ${duende.nombre}`
    ],
    ritual: [
      `Ritual de ${duende.nombre} para la protección`,
      `Ceremonia sagrada con ${duende.nombre}`,
      `${duende.nombre} te enseña un ritual ancestral`,
      `El ritual del amanecer de ${duende.nombre}`,
      `Magia práctica con ${duende.nombre}`,
      `${duende.nombre} y el poder de la intención`,
      `Ritual de limpieza de ${duende.nombre}`
    ],
    conocimiento: [
      `Los secretos que ${duende.nombre} guarda`,
      `${duende.nombre} revela conocimiento antiguo`,
      `Sabiduría ancestral de ${duende.nombre}`,
      `${duende.nombre} y los misterios del bosque`,
      `Lo que ${duende.nombre} aprendió en siglos`,
      `${duende.nombre} comparte sus enseñanzas`,
      `El legado de ${duende.nombre}`
    ],
    diy: [
      `Creá con ${duende.nombre}: amuleto protector`,
      `${duende.nombre} te enseña a hacer un saquito mágico`,
      `Manualidad mágica con ${duende.nombre}`,
      `${duende.nombre} y el arte de crear`,
      `Hazlo con ${duende.nombre}: talismán personal`,
      `${duende.nombre} te guía paso a paso`,
      `Proyecto mágico de ${duende.nombre}`
    ],
    leyenda: [
      `La historia de cómo ${duende.nombre} llegó al bosque`,
      `${duende.nombre} cuenta su origen`,
      `La leyenda de ${duende.nombre}`,
      `El viaje de ${duende.nombre} a través del tiempo`,
      `${duende.nombre} y la noche más larga`,
      `Cómo ${duende.nombre} encontró su propósito`,
      `Los primeros días de ${duende.nombre}`
    ],
    reflexion: [
      `${duende.nombre} reflexiona sobre el día`,
      `Palabras de cierre de ${duende.nombre}`,
      `${duende.nombre} te invita a mirar dentro`,
      `La reflexión nocturna de ${duende.nombre}`,
      `${duende.nombre} y el poder de la gratitud`,
      `Cerrando el día con ${duende.nombre}`,
      `${duende.nombre} te abraza antes de dormir`
    ]
  };

  const opciones = titulos[tipo.tipo] || titulos.mensaje;
  return opciones[(dia - 1) % opciones.length];
}

function generarContenidoTexto(tipo, duende, dia) {
  // Contenido base según tipo, personalizado con el duende
  const contenidos = {
    mensaje: `Querido ser de luz,

Hoy ${duende.nombre} quiere recordarte algo importante: cada amanecer es una oportunidad para comenzar de nuevo. No importa lo que haya pasado ayer, lo que cargues del pasado o los miedos que te visiten en la noche.

${duende.nombre} ha visto muchos amaneceres desde que cuida este bosque, y cada uno trae consigo la misma promesa: la posibilidad de elegir de nuevo. De ser quien realmente sos.

Hoy, ${duende.nombre} te invita a soltar una preocupación. Solo una. Dejala ir como las hojas que caen en otoño, sabiendo que su tiempo ya pasó.

Llevá esta bendición con vos: "Soy guiado/a, soy protegido/a, soy amado/a."

Con cariño desde el bosque,
${duende.nombre}`,

    meditacion: `Meditación Guiada por ${duende.nombre}

Buscá un lugar tranquilo donde puedas estar sin interrupciones por unos minutos.

Cerrá los ojos y comenzá a respirar profundamente. Inhalá contando hasta cuatro, retené el aire contando hasta cuatro, y exhalá contando hasta seis.

Ahora imaginá que estás en un claro del bosque. La luz del sol se filtra entre las hojas, creando patrones dorados en el suelo cubierto de musgo.

${duende.nombre} aparece entre los árboles. Su presencia es cálida y reconfortante. Se acerca a vos y te ofrece la mano.

"Vení," te dice ${duende.nombre}. "Quiero mostrarte algo."

Te lleva a un pequeño arroyo cristalino. "Mirá el agua," dice. "Así como el agua fluye sin esfuerzo, así puede fluir tu vida cuando soltás el control."

Quedáte un momento observando el agua. Dejá que cualquier tensión se disuelva.

Cuando estés listo/a, agradecé a ${duende.nombre} y abrí lentamente los ojos.`,

    ritual: `Ritual de ${duende.nombre}

Materiales necesarios:
- Una vela blanca o del color que sientas
- Un vaso con agua
- Una pizca de sal
- Opcional: una piedra o cristal que tengas

Preparación:
Buscá un momento de tranquilidad. Apagá distracciones.

El Ritual:

1. Encendé la vela diciendo: "Con esta llama invoco la presencia de ${duende.nombre} y la luz que guía mi camino."

2. Tomá la sal y echala en el agua diciendo: "Purifico este espacio y mi energía de todo lo que no me sirve."

3. Pasá tus manos sobre el humo de la vela (sin quemarte) diciendo: "Me libero de miedos, dudas y energías ajenas."

4. Cerrá los ojos y sentí la presencia de ${duende.nombre} a tu lado. Pedile lo que necesites o simplemente agradecé.

5. Dejá que la vela se consuma o apagala con los dedos (nunca soplando).

6. El agua la podés usar para regar una planta, devolviendo la energía a la tierra.

Que ${duende.nombre} te acompañe siempre.`,

    conocimiento: `Conocimiento Ancestral de ${duende.nombre}

Los guardianes del bosque guardamos secretos que hemos aprendido a lo largo de siglos. Hoy, ${duende.nombre} quiere compartir contigo una de estas verdades antiguas.

En el bosque, nada se desperdicia. Cada hoja que cae alimenta la tierra. Cada árbol que muere da vida a hongos, insectos, y eventualmente a nuevos árboles. Este ciclo infinito de dar y recibir es la base de toda abundancia.

Los humanos muchas veces olvidan esto. Acumulan, retienen, temen perder. Pero ${duende.nombre} te recuerda: la verdadera abundancia viene de participar en el flujo. Dar para recibir. Soltar para que llegue lo nuevo.

Preguntate hoy: ¿Qué estoy reteniendo que ya no me sirve? ¿Qué puedo dar para abrir espacio a lo nuevo?

El bosque siempre provee a quien confía en él.`,

    diy: `Proyecto Mágico con ${duende.nombre}: Saquito de Protección

Hoy ${duende.nombre} te enseña a crear un pequeño amuleto de protección que podés llevar con vos o dejar en tu hogar.

Vas a necesitar:
- Un trozo pequeño de tela (puede ser de una prenda vieja que ya no uses)
- Hilo o cinta
- Sal (una pizca)
- Una hierba seca (romero, lavanda, o lo que tengas)
- Opcional: un cristalito pequeño

Pasos:

1. Cortá la tela en un cuadrado de unos 10cm x 10cm.

2. En el centro, poné primero la sal mientras decís: "Para purificar y proteger."

3. Agregá la hierba diciendo: "Para atraer energías positivas."

4. Si tenés un cristalito, agregalo diciendo: "Para amplificar la intención."

5. Juntá las esquinas de la tela y atalas con el hilo o cinta.

6. Sostenelo entre tus manos y pedile a ${duende.nombre} que bendiga este amuleto.

7. Llevalo en tu bolso, dejalo junto a tu cama, o colgalo en la entrada de tu casa.

${duende.nombre} sonríe al verte crear. La magia está en tus manos.`,

    leyenda: `La Historia de ${duende.nombre}

Hace mucho tiempo, más de lo que los humanos pueden recordar, existía un pequeño ser de luz que aún no tenía nombre ni propósito.

Este ser viajó por muchos bosques, montañas y ríos, buscando un lugar donde pertenecer. En cada sitio, aprendía algo nuevo: la paciencia de las piedras, la alegría del agua corriendo, la sabiduría de los árboles ancianos.

Un día, llegó a este bosque. Y algo fue diferente. Los árboles lo reconocieron. Los animales lo saludaron. El viento susurró: "Aquí es."

Fue entonces cuando recibió su nombre: ${duende.nombre}.

Con el tiempo, ${duende.nombre} descubrió su propósito: cuidar de aquellos que buscan conexión con la naturaleza y consigo mismos. Guiar a los perdidos. Consolar a los tristes. Celebrar con los alegres.

Y así, ${duende.nombre} ha permanecido aquí, generación tras generación, esperando a quienes lo buscan con el corazón abierto.

Como vos, que estás leyendo estas palabras.

${duende.nombre} te estaba esperando.`,

    reflexion: `Reflexión del Atardecer con ${duende.nombre}

El día llega a su fin. El sol comienza a descender y los colores del cielo se transforman.

${duende.nombre} te invita a tomarte un momento para mirar hacia atrás, no con juicio sino con curiosidad.

¿Qué momentos de hoy merecen tu gratitud?
Tal vez algo pequeño: una taza de té caliente, una sonrisa de alguien, un momento de paz.

¿Hubo algún desafío?
${duende.nombre} te recuerda que los desafíos son maestros disfrazados. ¿Qué te enseñó el día de hoy?

¿Qué querés soltar antes de dormir?
Visualizá eso que te pesa como una hoja que soltás al viento. Dejala ir.

Ahora, ponete una mano en el corazón y decí: "Hice lo mejor que pude hoy. Y eso es suficiente."

${duende.nombre} te desea dulces sueños y un mañana lleno de posibilidades.

Descansá, ser querido. El bosque vela por vos.`
  };

  return contenidos[tipo.tipo] || contenidos.mensaje;
}

function generarExtracto(tipo, duende) {
  const extractos = {
    mensaje: `${duende.nombre} tiene un mensaje especial para vos hoy. Palabras que llegan desde el corazón del bosque.`,
    meditacion: `Dejá que ${duende.nombre} te guíe en un viaje interior. Unos minutos de paz para conectar con tu esencia.`,
    ritual: `${duende.nombre} comparte un ritual sagrado para fortalecer tu energía y protección.`,
    conocimiento: `Sabiduría ancestral que ${duende.nombre} ha guardado durante siglos, ahora revelada para vos.`,
    diy: `Creá tu propio amuleto mágico con la guía paso a paso de ${duende.nombre}.`,
    leyenda: `Descubrí la historia de ${duende.nombre} y cómo llegó a convertirse en guardián del bosque.`,
    reflexion: `${duende.nombre} te acompaña en una reflexión para cerrar el día con gratitud y paz.`
  };
  return extractos[tipo.tipo] || extractos.mensaje;
}

// ═══════════════════════════════════════════════════════════════════════════════
// 3. ACTUALIZAR CATÁLOGO DE EXPERIENCIAS
// ═══════════════════════════════════════════════════════════════════════════════

async function actualizarCatalogoExperiencias() {
  console.log('\n═══════════════════════════════════════════════════════════════');
  console.log('3. ACTUALIZANDO CATÁLOGO DE EXPERIENCIAS/LECTURAS');
  console.log('═══════════════════════════════════════════════════════════════\n');

  const EXPERIENCIAS_COMPLETAS = [
    // BÁSICAS (15-30 runas)
    {
      id: 'consejo_bosque',
      nombre: 'Consejo del Bosque',
      descripcion: 'Un consejo sabio y directo desde el corazón del bosque. Perfecto cuando necesitás una guía rápida.',
      runas: 15,
      categoria: 'basicas',
      nivel: 'Todos',
      duracion: 'Instantáneo',
      entregable: 'Mensaje de 200+ palabras',
      icono: '🌲'
    },
    {
      id: 'susurro_guardian',
      nombre: 'Susurro del Guardián',
      descripcion: 'Tu guardián te susurra al oído palabras que necesitás escuchar. Íntimo y personal.',
      runas: 20,
      categoria: 'basicas',
      nivel: 'Todos',
      duracion: 'Instantáneo',
      entregable: 'Mensaje de 250+ palabras',
      icono: '👂'
    },
    {
      id: 'tirada_3_runas',
      nombre: 'Tirada de 3 Runas',
      descripcion: 'Pasado, presente y futuro. La tirada clásica nórdica para obtener claridad sobre tu situación.',
      runas: 25,
      categoria: 'basicas',
      nivel: 'Todos',
      duracion: '24 horas',
      entregable: 'Lectura de 500+ palabras',
      icono: 'ᚱ',
      popular: true
    },
    {
      id: 'energia_dia',
      nombre: 'Energía del Día',
      descripcion: 'Escaneamos la energía que te rodea hoy y te damos consejos para navegarla.',
      runas: 15,
      categoria: 'basicas',
      nivel: 'Todos',
      duracion: 'Instantáneo',
      entregable: 'Informe de 200+ palabras',
      icono: '✨'
    },

    // ESTÁNDAR (40-75 runas)
    {
      id: 'tirada_5_runas',
      nombre: 'Tirada de 5 Runas',
      descripcion: 'Una tirada más profunda que explora múltiples aspectos de tu pregunta o situación.',
      runas: 40,
      categoria: 'estandar',
      nivel: 'Todos',
      duracion: '24-48 horas',
      entregable: 'Lectura de 800+ palabras',
      icono: 'ᚱᛏ'
    },
    {
      id: 'oraculo_elementales',
      nombre: 'Oráculo de los Elementales',
      descripcion: 'Los espíritus de Tierra, Agua, Fuego y Aire responden tus preguntas desde su sabiduría elemental.',
      runas: 50,
      categoria: 'estandar',
      nivel: 'Todos',
      duracion: '24-48 horas',
      entregable: 'Lectura de 1000+ palabras',
      icono: '🌍',
      popular: true
    },
    {
      id: 'mapa_energia',
      nombre: 'Mapa de tu Energía',
      descripcion: 'Un análisis completo de tu campo energético actual. Identificamos bloqueos y fortalezas.',
      runas: 60,
      categoria: 'estandar',
      nivel: 'Todos',
      duracion: '48 horas',
      entregable: 'Informe de 1200+ palabras',
      icono: '🗺️'
    },
    {
      id: 'ritual_mes',
      nombre: 'Ritual del Mes',
      descripcion: 'Un ritual personalizado diseñado específicamente para lo que necesitás este mes.',
      runas: 55,
      categoria: 'estandar',
      nivel: 'Todos',
      duracion: '48 horas',
      entregable: 'Ritual de 1000+ palabras con instrucciones',
      icono: '🕯️'
    },
    {
      id: 'numerologia_personal',
      nombre: 'Numerología Personal',
      descripcion: 'Tu número de vida, expresión y año personal. Entendé tus ciclos y potenciales.',
      runas: 65,
      categoria: 'estandar',
      nivel: 'Todos',
      duracion: '48-72 horas',
      entregable: 'Estudio de 1500+ palabras',
      icono: '🔢'
    },
    {
      id: 'tarot_simple',
      nombre: 'Lectura de Tarot Simple',
      descripcion: 'Una tirada de tarot enfocada en una pregunta específica. Clara y directa.',
      runas: 50,
      categoria: 'estandar',
      nivel: 'Todos',
      duracion: '24-48 horas',
      entregable: 'Lectura de 800+ palabras',
      icono: '🃏'
    },
    {
      id: 'mensaje_guardian',
      nombre: 'Mensaje de TU Guardián',
      descripcion: 'Un mensaje canalizado directamente del guardián que compraste. Solo para quienes tienen guardián.',
      runas: 45,
      categoria: 'estandar',
      nivel: 'Requiere guardián comprado',
      duracion: '24-48 horas',
      entregable: 'Mensaje de 600+ palabras',
      icono: '💌',
      requiereGuardian: true
    },

    // PREMIUM (100-150 runas)
    {
      id: 'tirada_7_runas',
      nombre: 'Tirada de 7 Runas Completa',
      descripcion: 'La tirada profunda. Siete runas revelando aspectos ocultos de tu camino. Para decisiones importantes.',
      runas: 100,
      categoria: 'premium',
      nivel: 'Todos',
      duracion: '48-72 horas',
      entregable: 'Lectura de 2000+ palabras',
      icono: 'ᚱᛏᚠᚢᚦ',
      popular: true
    },
    {
      id: 'tarot_profundo',
      nombre: 'Lectura de Tarot Profunda',
      descripcion: 'Una lectura extensa que explora múltiples capas de tu situación con la Cruz Celta.',
      runas: 120,
      categoria: 'premium',
      nivel: 'Todos',
      duracion: '72 horas',
      entregable: 'Lectura de 2500+ palabras',
      icono: '🎴'
    },
    {
      id: 'carta_astral_esencial',
      nombre: 'Carta Astral Esencial',
      descripcion: 'Sol, Luna, Ascendente y los planetas personales. Tu mapa cósmico explicado de forma clara.',
      runas: 130,
      categoria: 'premium',
      nivel: 'Todos',
      duracion: '5-7 días',
      entregable: 'Estudio de 3000+ palabras',
      icono: '⭐'
    },
    {
      id: 'lectura_año_personal',
      nombre: 'Lectura de Año Personal',
      descripcion: 'Qué te depara este año según tu numerología y tránsitos. Mes a mes, con consejos.',
      runas: 140,
      categoria: 'premium',
      nivel: 'Todos',
      duracion: '5-7 días',
      entregable: 'Estudio de 4000+ palabras',
      icono: '📅'
    },
    {
      id: 'conexion_guardian',
      nombre: 'Conexión con tu Guardián',
      descripcion: 'Una sesión profunda de conexión con tu guardián. Incluye ritual y mensajes canalizados.',
      runas: 110,
      categoria: 'premium',
      nivel: 'Requiere guardián comprado',
      duracion: '48-72 horas',
      entregable: 'Sesión de 2000+ palabras + ritual',
      icono: '🔮',
      requiereGuardian: true
    },

    // ULTRA PREMIUM (200-400 runas)
    {
      id: 'estudio_alma',
      nombre: 'Estudio del Alma',
      descripcion: 'La experiencia más profunda. Numerología, astrología, análisis energético y guía de propósito de vida.',
      runas: 200,
      categoria: 'ultra_premium',
      nivel: 'Todos',
      duracion: '7-10 días',
      entregable: 'Dossier de 6000+ palabras + PDF',
      icono: '👁️',
      popular: true,
      destacado: true
    },
    {
      id: 'conexion_ancestros',
      nombre: 'Conexión con Ancestros',
      descripcion: 'Abrimos un canal con tus ancestros para recibir mensajes, sanación y bendiciones de tu linaje.',
      runas: 250,
      categoria: 'ultra_premium',
      nivel: 'Todos',
      duracion: '7-10 días',
      entregable: 'Sesión de 4000+ palabras + ritual',
      icono: '🌳'
    },
    {
      id: 'registros_akashicos',
      nombre: 'Registros Akáshicos',
      descripcion: 'Accedemos a los registros akáshicos de tu alma para revelar información sobre tu misión y lecciones.',
      runas: 250,
      categoria: 'ultra_premium',
      nivel: 'Todos',
      duracion: '7-10 días',
      entregable: 'Lectura de 5000+ palabras',
      icono: '📖'
    },
    {
      id: 'vidas_pasadas',
      nombre: 'Mapa de Vidas Pasadas',
      descripcion: 'Exploramos vidas pasadas relevantes para entender patrones actuales y karmas a liberar.',
      runas: 300,
      categoria: 'ultra_premium',
      nivel: 'Todos',
      duracion: '10-14 días',
      entregable: 'Estudio de 6000+ palabras',
      icono: '⏳'
    },
    {
      id: 'proposito_vida',
      nombre: 'Propósito de Vida',
      descripcion: 'Un estudio integral que combina múltiples disciplinas para revelar tu propósito y misión de alma.',
      runas: 350,
      categoria: 'ultra_premium',
      nivel: 'Todos',
      duracion: '14 días',
      entregable: 'Dossier de 8000+ palabras + PDF',
      icono: '🌟'
    },
    {
      id: 'gran_estudio_anual',
      nombre: 'Gran Estudio Anual',
      descripcion: 'El paquete completo: carta astral, numerología, tarot del año, rituales mensuales y guía trimestral.',
      runas: 400,
      categoria: 'ultra_premium',
      nivel: 'Todos',
      duracion: '14-21 días',
      entregable: 'Mega-dossier de 12000+ palabras + PDFs',
      icono: '👑',
      destacado: true
    }
  ];

  const CATEGORIAS = [
    { id: 'basicas', nombre: 'Básicas', descripcion: 'Guía rápida y accesible', rango: '15-30 runas' },
    { id: 'estandar', nombre: 'Estándar', descripcion: 'Lecturas completas', rango: '40-75 runas' },
    { id: 'premium', nombre: 'Premium', descripcion: 'Estudios profundos', rango: '100-150 runas' },
    { id: 'ultra_premium', nombre: 'Ultra Premium', descripcion: 'Experiencias transformadoras', rango: '200-400 runas' }
  ];

  // Guardar en KV
  await kvSet('experiencias:catalogo', EXPERIENCIAS_COMPLETAS);
  await kvSet('experiencias:categorias', CATEGORIAS);

  console.log(`✓ Guardadas ${EXPERIENCIAS_COMPLETAS.length} experiencias en el catálogo`);
  console.log('\nExperiencias por categoría:');

  CATEGORIAS.forEach(cat => {
    const exp = EXPERIENCIAS_COMPLETAS.filter(e => e.categoria === cat.id);
    console.log(`\n  ${cat.nombre} (${cat.rango}):`);
    exp.forEach(e => console.log(`    - ${e.nombre}: ${e.runas} runas`));
  });

  return EXPERIENCIAS_COMPLETAS;
}

// ═══════════════════════════════════════════════════════════════════════════════
// 4. ACTUALIZAR ARCHIVO DE CATÁLOGO
// ═══════════════════════════════════════════════════════════════════════════════

async function actualizarArchivoCatalogo() {
  console.log('\n═══════════════════════════════════════════════════════════════');
  console.log('4. ACTUALIZANDO ARCHIVO DE CATÁLOGO');
  console.log('═══════════════════════════════════════════════════════════════\n');

  const catalogoPath = path.join(__dirname, '..', 'app', 'api', 'experiencias', 'catalogo', 'route.js');

  const contenidoArchivo = `// Catálogo de Experiencias Mágicas (pagadas con Runas)
// ACTUALIZADO: ${new Date().toISOString()}

const EXPERIENCIAS = [
  // ═══════════════════════════════════════════════════════════════
  // BÁSICAS (15-30 runas)
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'consejo_bosque',
    nombre: 'Consejo del Bosque',
    descripcion: 'Un consejo sabio y directo desde el corazón del bosque. Perfecto cuando necesitás una guía rápida.',
    runas: 15,
    categoria: 'basicas',
    nivel: 'Todos',
    duracion: 'Instantáneo',
    entregable: 'Mensaje de 200+ palabras',
    icono: '🌲'
  },
  {
    id: 'susurro_guardian',
    nombre: 'Susurro del Guardián',
    descripcion: 'Tu guardián te susurra al oído palabras que necesitás escuchar. Íntimo y personal.',
    runas: 20,
    categoria: 'basicas',
    nivel: 'Todos',
    duracion: 'Instantáneo',
    entregable: 'Mensaje de 250+ palabras',
    icono: '👂'
  },
  {
    id: 'tirada_3_runas',
    nombre: 'Tirada de 3 Runas',
    descripcion: 'Pasado, presente y futuro. La tirada clásica nórdica para obtener claridad sobre tu situación.',
    runas: 25,
    categoria: 'basicas',
    nivel: 'Todos',
    duracion: '24 horas',
    entregable: 'Lectura de 500+ palabras',
    icono: 'ᚱ',
    popular: true
  },
  {
    id: 'energia_dia',
    nombre: 'Energía del Día',
    descripcion: 'Escaneamos la energía que te rodea hoy y te damos consejos para navegarla.',
    runas: 15,
    categoria: 'basicas',
    nivel: 'Todos',
    duracion: 'Instantáneo',
    entregable: 'Informe de 200+ palabras',
    icono: '✨'
  },

  // ═══════════════════════════════════════════════════════════════
  // ESTÁNDAR (40-75 runas)
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'tirada_5_runas',
    nombre: 'Tirada de 5 Runas',
    descripcion: 'Una tirada más profunda que explora múltiples aspectos de tu pregunta o situación.',
    runas: 40,
    categoria: 'estandar',
    nivel: 'Todos',
    duracion: '24-48 horas',
    entregable: 'Lectura de 800+ palabras',
    icono: 'ᚱᛏ'
  },
  {
    id: 'oraculo_elementales',
    nombre: 'Oráculo de los Elementales',
    descripcion: 'Los espíritus de Tierra, Agua, Fuego y Aire responden tus preguntas desde su sabiduría elemental.',
    runas: 50,
    categoria: 'estandar',
    nivel: 'Todos',
    duracion: '24-48 horas',
    entregable: 'Lectura de 1000+ palabras',
    icono: '🌍',
    popular: true
  },
  {
    id: 'mapa_energia',
    nombre: 'Mapa de tu Energía',
    descripcion: 'Un análisis completo de tu campo energético actual. Identificamos bloqueos y fortalezas.',
    runas: 60,
    categoria: 'estandar',
    nivel: 'Todos',
    duracion: '48 horas',
    entregable: 'Informe de 1200+ palabras',
    icono: '🗺️'
  },
  {
    id: 'ritual_mes',
    nombre: 'Ritual del Mes',
    descripcion: 'Un ritual personalizado diseñado específicamente para lo que necesitás este mes.',
    runas: 55,
    categoria: 'estandar',
    nivel: 'Todos',
    duracion: '48 horas',
    entregable: 'Ritual de 1000+ palabras con instrucciones',
    icono: '🕯️'
  },
  {
    id: 'numerologia_personal',
    nombre: 'Numerología Personal',
    descripcion: 'Tu número de vida, expresión y año personal. Entendé tus ciclos y potenciales.',
    runas: 65,
    categoria: 'estandar',
    nivel: 'Todos',
    duracion: '48-72 horas',
    entregable: 'Estudio de 1500+ palabras',
    icono: '🔢'
  },
  {
    id: 'tarot_simple',
    nombre: 'Lectura de Tarot Simple',
    descripcion: 'Una tirada de tarot enfocada en una pregunta específica. Clara y directa.',
    runas: 50,
    categoria: 'estandar',
    nivel: 'Todos',
    duracion: '24-48 horas',
    entregable: 'Lectura de 800+ palabras',
    icono: '🃏'
  },
  {
    id: 'mensaje_guardian',
    nombre: 'Mensaje de TU Guardián',
    descripcion: 'Un mensaje canalizado directamente del guardián que compraste. Solo para quienes tienen guardián.',
    runas: 45,
    categoria: 'estandar',
    nivel: 'Requiere guardián comprado',
    duracion: '24-48 horas',
    entregable: 'Mensaje de 600+ palabras',
    icono: '💌',
    requiereGuardian: true
  },

  // ═══════════════════════════════════════════════════════════════
  // PREMIUM (100-150 runas)
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'tirada_7_runas',
    nombre: 'Tirada de 7 Runas Completa',
    descripcion: 'La tirada profunda. Siete runas revelando aspectos ocultos de tu camino. Para decisiones importantes.',
    runas: 100,
    categoria: 'premium',
    nivel: 'Todos',
    duracion: '48-72 horas',
    entregable: 'Lectura de 2000+ palabras',
    icono: 'ᚱᛏᚠᚢᚦ',
    popular: true
  },
  {
    id: 'tarot_profundo',
    nombre: 'Lectura de Tarot Profunda',
    descripcion: 'Una lectura extensa que explora múltiples capas de tu situación con la Cruz Celta.',
    runas: 120,
    categoria: 'premium',
    nivel: 'Todos',
    duracion: '72 horas',
    entregable: 'Lectura de 2500+ palabras',
    icono: '🎴'
  },
  {
    id: 'carta_astral_esencial',
    nombre: 'Carta Astral Esencial',
    descripcion: 'Sol, Luna, Ascendente y los planetas personales. Tu mapa cósmico explicado de forma clara.',
    runas: 130,
    categoria: 'premium',
    nivel: 'Todos',
    duracion: '5-7 días',
    entregable: 'Estudio de 3000+ palabras',
    icono: '⭐'
  },
  {
    id: 'lectura_año_personal',
    nombre: 'Lectura de Año Personal',
    descripcion: 'Qué te depara este año según tu numerología y tránsitos. Mes a mes, con consejos.',
    runas: 140,
    categoria: 'premium',
    nivel: 'Todos',
    duracion: '5-7 días',
    entregable: 'Estudio de 4000+ palabras',
    icono: '📅'
  },
  {
    id: 'conexion_guardian',
    nombre: 'Conexión con tu Guardián',
    descripcion: 'Una sesión profunda de conexión con tu guardián. Incluye ritual y mensajes canalizados.',
    runas: 110,
    categoria: 'premium',
    nivel: 'Requiere guardián comprado',
    duracion: '48-72 horas',
    entregable: 'Sesión de 2000+ palabras + ritual',
    icono: '🔮',
    requiereGuardian: true
  },

  // ═══════════════════════════════════════════════════════════════
  // ULTRA PREMIUM (200-400 runas)
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'estudio_alma',
    nombre: 'Estudio del Alma',
    descripcion: 'La experiencia más profunda. Numerología, astrología, análisis energético y guía de propósito de vida.',
    runas: 200,
    categoria: 'ultra_premium',
    nivel: 'Todos',
    duracion: '7-10 días',
    entregable: 'Dossier de 6000+ palabras + PDF',
    icono: '👁️',
    popular: true,
    destacado: true
  },
  {
    id: 'conexion_ancestros',
    nombre: 'Conexión con Ancestros',
    descripcion: 'Abrimos un canal con tus ancestros para recibir mensajes, sanación y bendiciones de tu linaje.',
    runas: 250,
    categoria: 'ultra_premium',
    nivel: 'Todos',
    duracion: '7-10 días',
    entregable: 'Sesión de 4000+ palabras + ritual',
    icono: '🌳'
  },
  {
    id: 'registros_akashicos',
    nombre: 'Registros Akáshicos',
    descripcion: 'Accedemos a los registros akáshicos de tu alma para revelar información sobre tu misión y lecciones.',
    runas: 250,
    categoria: 'ultra_premium',
    nivel: 'Todos',
    duracion: '7-10 días',
    entregable: 'Lectura de 5000+ palabras',
    icono: '📖'
  },
  {
    id: 'vidas_pasadas',
    nombre: 'Mapa de Vidas Pasadas',
    descripcion: 'Exploramos vidas pasadas relevantes para entender patrones actuales y karmas a liberar.',
    runas: 300,
    categoria: 'ultra_premium',
    nivel: 'Todos',
    duracion: '10-14 días',
    entregable: 'Estudio de 6000+ palabras',
    icono: '⏳'
  },
  {
    id: 'proposito_vida',
    nombre: 'Propósito de Vida',
    descripcion: 'Un estudio integral que combina múltiples disciplinas para revelar tu propósito y misión de alma.',
    runas: 350,
    categoria: 'ultra_premium',
    nivel: 'Todos',
    duracion: '14 días',
    entregable: 'Dossier de 8000+ palabras + PDF',
    icono: '🌟'
  },
  {
    id: 'gran_estudio_anual',
    nombre: 'Gran Estudio Anual',
    descripcion: 'El paquete completo: carta astral, numerología, tarot del año, rituales mensuales y guía trimestral.',
    runas: 400,
    categoria: 'ultra_premium',
    nivel: 'Todos',
    duracion: '14-21 días',
    entregable: 'Mega-dossier de 12000+ palabras + PDFs',
    icono: '👑',
    destacado: true
  }
];

const CATEGORIAS = [
  { id: 'basicas', nombre: 'Básicas', descripcion: 'Guía rápida y accesible', rango: '15-30 runas' },
  { id: 'estandar', nombre: 'Estándar', descripcion: 'Lecturas completas', rango: '40-75 runas' },
  { id: 'premium', nombre: 'Premium', descripcion: 'Estudios profundos', rango: '100-150 runas' },
  { id: 'ultra_premium', nombre: 'Ultra Premium', descripcion: 'Experiencias transformadoras', rango: '200-400 runas' }
];

// GET - Obtener catálogo de experiencias
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const categoria = searchParams.get('categoria');
    const id = searchParams.get('id');

    // Obtener experiencia específica
    if (id) {
      const experiencia = EXPERIENCIAS.find(e => e.id === id);
      if (!experiencia) {
        return Response.json({
          success: false,
          error: 'Experiencia no encontrada'
        }, { status: 404 });
      }
      return Response.json({
        success: true,
        experiencia
      });
    }

    // Filtrar por categoría
    let experiencias = EXPERIENCIAS;
    if (categoria) {
      experiencias = experiencias.filter(e => e.categoria === categoria);
    }

    // Ordenar por runas (precio)
    experiencias = [...experiencias].sort((a, b) => a.runas - b.runas);

    return Response.json({
      success: true,
      categorias: CATEGORIAS,
      experiencias,
      total: experiencias.length,
      populares: EXPERIENCIAS.filter(e => e.popular),
      destacados: EXPERIENCIAS.filter(e => e.destacado)
    });

  } catch (error) {
    console.error('Error obteniendo catálogo:', error);
    return Response.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
`;

  fs.writeFileSync(catalogoPath, contenidoArchivo);
  console.log(`✓ Archivo actualizado: ${catalogoPath}`);
}

// ═══════════════════════════════════════════════════════════════════════════════
// EJECUTAR TODO
// ═══════════════════════════════════════════════════════════════════════════════

async function main() {
  console.log('\n');
  console.log('╔═══════════════════════════════════════════════════════════════╗');
  console.log('║  SINCRONIZACIÓN COMPLETA - DUENDES DEL URUGUAY                ║');
  console.log('║  Duendes reales + Contenido enero + Catálogo experiencias     ║');
  console.log('╚═══════════════════════════════════════════════════════════════╝');

  try {
    // 1. Sincronizar duendes reales
    const { guardianes, pixies } = await sincronizarDuendesReales();

    // 2. Generar contenido enero
    await generarContenidoEnero(guardianes);

    // 3. Actualizar catálogo experiencias en KV
    await actualizarCatalogoExperiencias();

    // 4. Actualizar archivo de catálogo
    await actualizarArchivoCatalogo();

    console.log('\n');
    console.log('╔═══════════════════════════════════════════════════════════════╗');
    console.log('║  ✓ TODO COMPLETADO EXITOSAMENTE                               ║');
    console.log('╠═══════════════════════════════════════════════════════════════╣');
    console.log(`║  • ${guardianes.length} guardianes reales sincronizados                       ║`);
    console.log(`║  • ${pixies.length} pixies reales sincronizados                            ║`);
    console.log('║  • 18 días de contenido enero generados                       ║');
    console.log('║  • 22 experiencias en el catálogo                             ║');
    console.log('╚═══════════════════════════════════════════════════════════════╝');
    console.log('\n');

  } catch (error) {
    console.error('\n❌ ERROR:', error);
    process.exit(1);
  }
}

main();
