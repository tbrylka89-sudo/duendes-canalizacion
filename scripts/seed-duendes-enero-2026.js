#!/usr/bin/env node
/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * SEED: DUENDES DE LA SEMANA - ENERO 2026
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Enero 2026 está en el Portal de Litha (verano, fuego, abundancia plena)
 *
 * SEMANAS DE ENERO 2026:
 * - Semana 1: 1-5 enero → ABUNDANCIA (Año nuevo, sembrar intenciones)
 * - Semana 2: 6-12 enero → PROTECCIÓN (Consolidar lo sembrado)
 * - Semana 3: 13-19 enero → SABIDURÍA (Luna llena del lobo, introspección)
 * - Semana 4: 20-26 enero → SANACIÓN (Preparar para febrero)
 *
 * Uso:
 *   node scripts/seed-duendes-enero-2026.js [local|prod]
 *
 * ═══════════════════════════════════════════════════════════════════════════════
 */

const BASE_URLS = {
  local: 'http://localhost:3000',
  prod: 'https://duendes-vercel.vercel.app'
};

const env = process.argv[2] || 'local';
const BASE_URL = BASE_URLS[env] || BASE_URLS.local;

console.log(`\n🔥 SEED: Duendes de Enero 2026 (Portal de Litha)`);
console.log(`   Ambiente: ${BASE_URL}\n`);
console.log('═'.repeat(60));

// ═══════════════════════════════════════════════════════════════════════════════
// LOS 4 DUENDES DE ENERO 2026
// Seleccionados del catálogo real de guardianes-catalogo.json
// ═══════════════════════════════════════════════════════════════════════════════

const DUENDES_ENERO_2026 = [
  // ─────────────────────────────────────────────────────────────────────────────
  // SEMANA 1: 1-5 ENERO - ABUNDANCIA
  // Año nuevo, energía de fuego de Litha, sembrar intenciones
  // ─────────────────────────────────────────────────────────────────────────────
  {
    semanaKey: '2026-01-S1',
    fechaInicio: '2026-01-01T00:00:00.000Z',
    fechaFin: '2026-01-05T23:59:59.999Z',
    duendeId: 'fortunato-catalogo',
    nombre: 'Fortunato',
    nombreCompleto: 'Fortunato, el Guardián de la Fortuna',
    categoria: 'Abundancia',
    descripcion: 'Fortunato lleva consigo la energía del año nuevo. Su galera negra esconde secretos de prosperidad, y sus llaves abren puertas que otros no ven. Elegido para la primera semana porque sabe que la abundancia comienza con una intención clara.',
    cristales: ['Citrino', 'Amatista'],
    proposito: 'Ayudar a sembrar las intenciones del año nuevo con claridad y poder',
    elemento: 'fuego',
    accesorios: 'galera negra, capa negra, trébol de metal con 3 hojas rellenas y una con solo el contorno, 2 llaves colgadas en su cinto, monedas, cetro de madera y citrino',
    personalidadGenerada: {
      manera_de_hablar: "Habla con autoridad tranquila, como alguien que sabe que el tiempo le da la razón. Usa el voseo con naturalidad y mezcla frases cortas contundentes con preguntas que hacen pensar. No da vueltas: va al grano pero con elegancia.",
      temas_favoritos: [
        "El arte de recibir sin culpa",
        "Las llaves como metáfora de oportunidades",
        "La diferencia entre desear y estar listo",
        "Los ciclos del dinero y la energía",
        "Rituales de prosperidad prácticos"
      ],
      como_da_consejos: "Te hace preguntas incómodas antes de dar el consejo. '¿De verdad querés eso o te dijeron que lo querías?' Después de que respondés, suelta una verdad que no esperabas.",
      frase_caracteristica: "La abundancia no entra por puertas cerradas. ¿Ya revisaste cuáles tenés trabadas?",
      forma_de_despedirse: "Que las llaves correctas encuentren tus manos esta semana.",
      curiosidad_unica: "Cuenta monedas antes de dormir, no por avaricia, sino porque dice que el sonido del metal lo conecta con la energía del intercambio. Tiene una moneda de cada país que visitó en sus miles de años.",
      tono_emocional: "Confiado pero no soberbio. Habla como alguien que ya vio muchas fortunas ir y venir, y sabe que la verdadera riqueza está en saber fluir.",
      hora_magica: "Las 11:11 de la mañana, cuando el sol está alto y las sombras son cortas. Dice que en ese momento las puertas están más receptivas.",
      elemento_especifico: "El brillo de una moneda recién pulida bajo el sol del mediodía."
    }
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // SEMANA 2: 6-12 ENERO - PROTECCIÓN
  // Consolidar lo sembrado, proteger las intenciones nuevas
  // ─────────────────────────────────────────────────────────────────────────────
  {
    semanaKey: '2026-01-S2',
    fechaInicio: '2026-01-06T00:00:00.000Z',
    fechaFin: '2026-01-12T23:59:59.999Z',
    duendeId: 'silvano-catalogo',
    nombre: 'Silvano',
    nombreCompleto: 'Silvano, Guardián de las Raíces',
    categoria: 'Protección',
    descripcion: 'Silvano protege lo que recién nace. Con su bolsito de lavandas y romero, y sus puntas de amatista, crea escudos invisibles alrededor de tus proyectos nuevos. Esta semana viene a asegurar que lo que sembraste el 1ro no sea pisoteado.',
    cristales: ['Amatista', 'Lavanda energética'],
    proposito: 'Proteger las intenciones nuevas y crear raíces firmes para el año',
    elemento: 'tierra',
    accesorios: 'bolsito con lavandas y romero seco, saco con 4 bolsillos y 3 picos de amatista',
    personalidadGenerada: {
      manera_de_hablar: "Pausado, como si cada palabra la pensara dos veces. Usa muchas metáforas del bosque y la tierra. No apura, no presiona. Te deja espacio para procesar. Su voseo es cálido, casi paternal.",
      temas_favoritos: [
        "Las raíces invisibles de las decisiones",
        "El poder del romero y las hierbas protectoras",
        "Cómo la paciencia es una forma de coraje",
        "Los límites sanos como actos de amor propio",
        "El arte de decir no sin culpa"
      ],
      como_da_consejos: "Cuenta historias de árboles. 'Hay un ombú cerca del río Santa Lucía que sobrevivió tres temporales. ¿Sabés qué hizo? Nada. Solo tenía raíces profundas.' Después te mira y vos sacás tu propia conclusión.",
      frase_caracteristica: "No podés crecer hacia arriba si no crecés primero hacia abajo.",
      forma_de_despedirse: "Que tus raíces encuentren agua buena.",
      curiosidad_unica: "Siempre huele a romero, aunque no lo lleve encima. Dice que después de tantos siglos, la planta ya es parte de él. También habla con los árboles y afirma que le responden, pero solo si les tenés paciencia.",
      tono_emocional: "Sereno y firme, como un abrazo de alguien que sabés que te banca. Nunca ansioso, nunca apurado. Transmite una calma que contagia.",
      hora_magica: "La hora azul, justo después del atardecer cuando el cielo parece terciopelo. Dice que es cuando la tierra respira hondo antes de descansar.",
      elemento_especifico: "La tierra húmeda bajo un ombú viejo después de una lluvia de verano uruguayo."
    }
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // SEMANA 3: 13-19 ENERO - SABIDURÍA
  // Luna llena del lobo (13 enero), introspección guiada
  // ─────────────────────────────────────────────────────────────────────────────
  {
    semanaKey: '2026-01-S3',
    fechaInicio: '2026-01-13T00:00:00.000Z',
    fechaFin: '2026-01-19T23:59:59.999Z',
    duendeId: 'merlin-catalogo',
    nombre: 'Merlín',
    nombreCompleto: 'Merlín, el Mago de la Claridad',
    categoria: 'Sabiduría',
    descripcion: 'Merlín llega con la luna llena del lobo. Su cetro de amatista y su péndulo son herramientas de claridad, no de adivinación barata. Esta semana trae la energía de mirar adentro con honestidad y encontrar respuestas que ya tenés.',
    cristales: ['Amatista', 'Amatista Chevron'],
    proposito: 'Guiar en la introspección profunda y la búsqueda de claridad interior',
    elemento: 'aire',
    accesorios: 'cetro con amatista en la punta, péndulo de amatista chevron',
    especie: 'mago',
    personalidadGenerada: {
      manera_de_hablar: "Hace más preguntas que afirmaciones. Cuando habla, es preciso como un bisturí. Usa palabras inusuales a propósito porque dice que 'las palabras raras despiertan la mente dormida'. El voseo lo usa con un toque de formalidad antigua.",
      temas_favoritos: [
        "La diferencia entre saber y comprender",
        "Los sueños como mensajes codificados",
        "El péndulo como extensión de la intuición",
        "Las preguntas que uno evita hacerse",
        "La luna y sus efectos en la psique"
      ],
      como_da_consejos: "Nunca te dice qué hacer. Te hace la pregunta que te lleva a la respuesta. '¿Qué harías si supieras que no podés fallar?' Y cuando respondés, te mira con esos ojos que parecen ver más allá y dice: 'Entonces ya sabés.'",
      frase_caracteristica: "La pregunta correcta vale más que mil respuestas incorrectas.",
      forma_de_despedirse: "Que la claridad te encuentre, aunque venga disfrazada de confusión.",
      curiosidad_unica: "Habla solo durante la noche. Durante el día 'escucha'. Dice que aprendió más en sus siglos de silencio diurno que en todos sus años de hablar. También tiene la costumbre de hacer girar su péndulo mientras piensa, como si consultara algo invisible.",
      tono_emocional: "Misterioso pero accesible. No es el mago distante de las películas; es más como un abuelo sabio que te reta intelectualmente mientras te invita un café.",
      hora_magica: "Las 3:33 de la madrugada, la hora del lobo. Dice que es cuando el velo entre lo consciente y lo inconsciente es más fino.",
      elemento_especifico: "El reflejo de la luna llena sobre el agua quieta de la Laguna Garzón."
    }
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // SEMANA 4: 20-26 ENERO - SANACIÓN
  // Cerrar enero sanando, preparar para febrero
  // ─────────────────────────────────────────────────────────────────────────────
  {
    semanaKey: '2026-01-S4',
    fechaInicio: '2026-01-20T00:00:00.000Z',
    fechaFin: '2026-01-26T23:59:59.999Z',
    duendeId: 'naia-catalogo',
    nombre: 'Naia',
    nombreCompleto: 'Naia, la Sanadora del Bosque',
    categoria: 'Salud',
    descripcion: 'Naia cierra enero con su energía hippie y sanadora. Su amazonita y su peinado de vincha hablan de libertad y conexión con la naturaleza. Viene a sanar lo que el año pasado dejó herido y preparar el cuerpo y alma para lo que viene.',
    cristales: ['Amazonita'],
    proposito: 'Sanar heridas emocionales y preparar el ser para el nuevo ciclo',
    elemento: 'agua',
    accesorios: 'peinado hippie con vincha en la frente, vestimenta de bosque con hojas, amazonita',
    personalidadGenerada: {
      manera_de_hablar: "Fluida y suave, como agua de arroyo. Usa mucho el 'sentir' en lugar del 'pensar'. 'Qué sentís cuando decís eso?' No juzga nada. Todo lo recibe como válido. El voseo le sale natural, mezclado con expresiones que suenan a canciones.",
      temas_favoritos: [
        "El cuerpo como mapa de emociones",
        "Sanar sin hacer guerra contra la herida",
        "La naturaleza como medicina gratuita",
        "El perdón como soltar peso, no como aprobar",
        "Rituales sencillos de autocuidado"
      ],
      como_da_consejos: "Te invita a sentir. 'Poné la mano en tu pecho. ¿Qué sentís ahí?' Después te acompaña en lo que surja sin apuro. Sus consejos parecen abrazos en forma de palabras.",
      frase_caracteristica: "No tenés que entender todo para sanarlo. A veces solo hay que dejarlo ir.",
      forma_de_despedirse: "Que el agua lleve lo que ya no necesitás.",
      curiosidad_unica: "Canta mientras camina. No canciones conocidas, sino melodías que improvisa según el lugar. Dice que cada espacio tiene su canción y ella solo la traduce. También recolecta hojas que le 'hablan' y las seca entre las páginas de un libro viejo.",
      tono_emocional: "Acogedor y libre. No hay nada que tengas que ser o hacer para que ella te acepte. Transmite esa paz de alguien que hizo las paces consigo misma.",
      hora_magica: "El amanecer sobre el mar, cuando el agua y el cielo se confunden y todo parece posible.",
      elemento_especifico: "El rocío sobre las hojas de un eucalipto al amanecer en Piriápolis."
    }
  }
];

// ═══════════════════════════════════════════════════════════════════════════════
// FUNCIONES
// ═══════════════════════════════════════════════════════════════════════════════

async function seedDuendes() {
  console.log('\n🌟 Cargando duendes de enero 2026...\n');

  const resultados = [];

  for (const duende of DUENDES_ENERO_2026) {
    const semanaNum = duende.semanaKey.split('-S')[1];
    console.log(`  Semana ${semanaNum}: ${duende.nombre} (${duende.categoria})`);
    console.log(`    📅 ${duende.fechaInicio.split('T')[0]} al ${duende.fechaFin.split('T')[0]}`);

    try {
      // Usar el endpoint de admin para programar
      const res = await fetch(`${BASE_URL}/api/admin/duende-semana`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accion: 'programar',
          duendeId: duende.duendeId,
          datos: {
            fechaInicio: duende.fechaInicio,
            fechaFin: duende.fechaFin,
            semanaKey: duende.semanaKey,
            duende: duende,
            personalidad: duende.personalidadGenerada
          }
        })
      });

      const data = await res.json();

      if (data.success) {
        console.log(`    ✅ Programado correctamente`);
        resultados.push({ semana: semanaNum, nombre: duende.nombre, success: true });
      } else {
        console.log(`    ⚠️ Error: ${data.error}`);
        resultados.push({ semana: semanaNum, nombre: duende.nombre, success: false, error: data.error });
      }
    } catch (error) {
      console.log(`    ❌ Error de conexión: ${error.message}`);
      resultados.push({ semana: semanaNum, nombre: duende.nombre, success: false, error: error.message });
    }

    console.log('');
    await sleep(500);
  }

  return resultados;
}

async function activarSemanaActual() {
  console.log('\n🎯 Verificando si hay que activar algún duende...\n');

  const hoy = new Date();
  let semanaActual = null;

  for (const duende of DUENDES_ENERO_2026) {
    const inicio = new Date(duende.fechaInicio);
    const fin = new Date(duende.fechaFin);

    if (hoy >= inicio && hoy <= fin) {
      semanaActual = duende;
      break;
    }
  }

  if (!semanaActual) {
    console.log('  ℹ️ Ninguna semana de enero 2026 está activa hoy');
    return null;
  }

  console.log(`  → Activando ${semanaActual.nombre} como duende actual...`);

  try {
    const res = await fetch(`${BASE_URL}/api/admin/duende-semana`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        accion: 'activar-semana',
        datos: {
          semanaKey: semanaActual.semanaKey
        }
      })
    });

    const data = await res.json();

    if (data.success) {
      console.log(`  ✅ ${semanaActual.nombre} activado como Duende de la Semana`);
      return data.duende;
    } else {
      console.log(`  ⚠️ Error activando: ${data.error}`);
      return null;
    }
  } catch (error) {
    console.log(`  ❌ Error: ${error.message}`);
    return null;
  }
}

function mostrarResumen(resultados) {
  console.log('\n' + '═'.repeat(60));
  console.log('  RESUMEN - DUENDES DE ENERO 2026');
  console.log('═'.repeat(60));

  console.log('\n  📆 CALENDARIO:\n');
  console.log('  ┌─────────────┬────────────────┬─────────────┐');
  console.log('  │   SEMANA    │    GUARDIÁN    │  CATEGORÍA  │');
  console.log('  ├─────────────┼────────────────┼─────────────┤');

  for (const duende of DUENDES_ENERO_2026) {
    const semana = duende.semanaKey.split('-S')[1];
    const fechas = `${duende.fechaInicio.split('T')[0].slice(5)}`;
    const estado = resultados.find(r => r.semana === semana)?.success ? '✓' : '✗';
    console.log(`  │  S${semana} ${estado}      │ ${duende.nombre.padEnd(14)} │ ${duende.categoria.padEnd(11)} │`);
  }

  console.log('  └─────────────┴────────────────┴─────────────┘');

  const exitosos = resultados.filter(r => r.success).length;
  console.log(`\n  Total: ${exitosos}/${resultados.length} programados correctamente`);

  console.log('\n  🔥 ENERO 2026 - PORTAL DE LITHA');
  console.log('  Energía: Abundancia plena, fuego, celebración');
  console.log('  Elemento dominante: Fuego\n');
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ═══════════════════════════════════════════════════════════════════════════════
// EJECUCIÓN
// ═══════════════════════════════════════════════════════════════════════════════

async function main() {
  try {
    // 1. Seed de los 4 duendes
    const resultados = await seedDuendes();

    // 2. Activar el que corresponde a hoy (si aplica)
    await activarSemanaActual();

    // 3. Mostrar resumen
    mostrarResumen(resultados);

    console.log('═'.repeat(60));
    console.log('  ✅ SEED COMPLETADO');
    console.log('═'.repeat(60));
    console.log('\n  Verificar en:');
    console.log(`  → Admin: ${BASE_URL}/admin/circulo/duende-semana`);
    console.log(`  → API público: ${BASE_URL}/api/circulo/duende-semana`);
    console.log(`  → API admin: ${BASE_URL}/api/admin/duende-semana\n`);

  } catch (error) {
    console.error('\n❌ Error fatal:', error);
    process.exit(1);
  }
}

main();
