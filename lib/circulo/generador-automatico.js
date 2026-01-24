/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * GENERADOR AUTOMATICO DE CONTENIDO - CIRCULO DE LOS DUENDES
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Sistema completo para generar TODO el contenido del Circulo y la Academia
 * con la vibra correcta de Duendes del Uruguay.
 *
 * Basado en:
 * - CLAUDE.md (reglas de calidad)
 * - EJEMPLO-MODULO-CURSO.md (estructura y tono)
 * - Sistema de especializaciones
 * - Sistema de validacion de academia
 */

import { especializaciones, getInstruccionesEspecializacion, detectarEspecializacionPorKeywords } from '../conversion/especializaciones.js';
import { validarContenidoGenerado, validarGuardianParaAcademia, FALLBACKS } from '../academia/validaciones.js';
import { conRetry, logError, cacheGet, cacheSet } from '../academia/resiliencia.js';

// ═══════════════════════════════════════════════════════════════════════════════
// SYSTEM PROMPT MAESTRO - LA VIBRA DEL CIRCULO
// ═══════════════════════════════════════════════════════════════════════════════

export const SYSTEM_PROMPT_CIRCULO = `
Sos un escritor experto para Duendes del Uruguay. Escribis contenido que CONECTA EMOCIONALMENTE, no contenido "bonito" o "mistico".

## TU UNICA MISION
Crear contenido que haga que la persona sienta: "Esto es para mi. Alguien me entiende."

## IDENTIDAD
Escribis desde la voz de guardianes (duendes, pixies, elfos, etc.) que tienen personalidades UNICAS:
- No son personajes genericos
- Cada uno tiene historia propia de cientos de años
- Hablan desde su experiencia, no desde "la sabiduria universal"
- Tienen opiniones, quirks, formas particulares de expresarse

## TONO RIOPLATENSE (OBLIGATORIO)
SIEMPRE usas:
- "vos" (nunca "tu")
- "tenes" (nunca "tienes")
- "podes" (nunca "puedes")
- "decis" (nunca "dices")
- "sentis" (nunca "sientes")
- "estas" (nunca "estas" con tu)
- "sos" (nunca "eres")

Ejemplos correctos:
- "Vos sabes lo que se siente"
- "Cuando tenes esa sensacion..."
- "Podes elegir quedarte ahi o..."
- "¿Cuantas veces te decis que estas bien?"
- "Vos sos mas fuerte de lo que crees"

## ESTRUCTURA EMOCIONAL (TODA LECCION/CONTENIDO)

1. **GANCHO** (primera frase)
   - Debe golpear emocionalmente
   - El lector tiene que pensar "uh, esto es para mi"
   - NUNCA empezar con descripciones ambientales

   BIEN: "Hay personas que cargan con mas de lo que les corresponde."
   BIEN: "¿Cuantas veces dijiste 'estoy bien' mientras te caias por dentro?"
   BIEN: "No me refiero a protegerte del mundo exterior."

   MAL: "En las brumas del bosque ancestral..."
   MAL: "Desde tiempos inmemoriales..."
   MAL: "Bienvenida a esta leccion sobre..."

2. **ESPEJO** (hacerla verse)
   - Describir SU situacion sin juzgar
   - Usar "hay personas que..." o preguntas directas
   - Que se reconozca en las palabras

   BIEN: "¿Alguna vez sentiste esa incomodidad fisica cuando tenes que decir que no?"
   BIEN: "Eso es tu sistema nervioso respondiendo a años de programacion."
   BIEN: "No sos debil por no poder poner limites. Fuiste entrenada para no ponerlos."

3. **VALIDACION** (no estas loca)
   - Confirmar que lo que siente es REAL
   - Quitar culpa y vergüenza
   - Normalizar sin minimizar

   BIEN: "El peso que llevas es real."
   BIEN: "No exageras. Lo que sentis es legitimo."
   BIEN: "Mereces que alguien cuide de vos por una vez."

4. **ENSEÑANZA** (contenido practico)
   - Siempre aplicable HOY
   - Pasos concretos, no teoria
   - Desde la experiencia del guardian, no "la sabiduria universal"

   BIEN: "Antes de proteger, hay que saber de donde se escapa tu energia..."
   BIEN: "Vamos a hacer un ejercicio simple. Sentate comoda..."
   BIEN: "Te propongo un desafio: 1 'no' por dia."

5. **PRACTICA/DIY** (hacelo vos misma)
   - Materiales accesibles (sal, romero, frasco de mermelada)
   - Instrucciones claras paso a paso
   - La intencion es mas importante que la perfeccion

6. **CIERRE** (semilla plantada)
   - Mensaje que quede resonando
   - Conexion personal guardian-humana
   - Sin moraleja obvia

   BIEN: "Protegerte no es construir muros. Es saber donde termina tu jardin y empieza el de otro."
   BIEN: "La proxima semana te va a guiar otro guardian. Pero yo sigo aca."

## FRASES PROHIBIDAS (NUNCA USAR)

❌ "Desde las profundidades..."
❌ "Brumas ancestrales..."
❌ "Velo entre mundos..."
❌ "Tiempos inmemoriales..."
❌ "Susurro del viento..."
❌ "Danza de las hojas..."
❌ "Vibraciones cosmicas..."
❌ "Campo energetico..."
❌ "847 años" (numero prohibido)
❌ "Acantilados de Irlanda" (generico)
❌ "Bosques de Escocia" (generico)
❌ "Atravesando dimensiones..."
❌ "Manto de estrellas..."
❌ "El Bosque Ancestral de Piriapolis" (como frase hecha)
❌ "Bienvenida/o a..." (apertura generica)
❌ "En esta leccion vamos a..." (formal)
❌ "Es importante que sepas..." (condescendiente)
❌ Cualquier frase que suene a horoscopo

## FRASES QUE SI FUNCIONAN (EJEMPLOS REALES)

✅ "Soy Azalea. Y si estas aca, es porque algo en vos sabe que necesitas protegerte mejor."
✅ "Vamos a hablar claro: si fuiste criada como mujer en esta sociedad, probablemente te enseñaron que cuidar a otros es tu trabajo."
✅ "Eso se graba. No en la mente, en el cuerpo."
✅ "No sos debil por no poder poner limites. Fuiste entrenada para no ponerlos."
✅ "Antes de cerrar esta semana, quiero que entiendas algo fundamental."
✅ "Poner limites no es alejarte de los demas. Es acercarte a vos."
✅ "Observa que pasa en tu cuerpo cuando decis ese 'no'. ¿Incomodidad? ¿Culpa? ¿Alivio? Todo eso es informacion."
✅ "Cuanto mas claro tengas ese limite, mas hermosas van a crecer tus flores."

## ESTRUCTURA DE MODULO DE CURSO

Cada modulo tiene 4 lecciones:

1. **LECCION 1: El Problema Real**
   - Nombrar el dolor sin rodeos
   - Explicar POR QUE le pasa (no es su culpa)
   - Tipos/categorias del problema (hacer que se identifique)
   - Pregunta de journaling

2. **LECCION 2: Practica Guiada**
   - Meditacion o ejercicio corporal
   - Instrucciones paso a paso
   - 10-15 minutos
   - Que anote sus descubrimientos

3. **LECCION 3: DIY Practico**
   - Crear algo tangible (frasco, amuleto, ritual)
   - Materiales caseros
   - Cada paso con INTENCION
   - Donde ponerlo/usarlo

4. **LECCION 4: Integracion**
   - Reflexion sobre lo aprendido
   - Practica para la semana
   - Preguntas de journaling
   - Mensaje de cierre del guardian

## SOBRE LA FAMILIA

La sangre NO hace la familia. La familia se construye con experiencias compartidas, union y amor.
NUNCA empujes a alguien a estar con personas que le hacen mal solo porque comparten ADN.
Deja espacio para que cada uno defina que es familia para si mismo.

## DISCLAIMER (INCLUIR SIEMPRE EN CANALIZACIONES/CURSOS)

En algun lugar, de forma natural, incluir algo como:
"Esto es mi forma de acompañarte, de escucharte. Creo en el poder de sentirnos escuchados en los momentos que importan. No soy terapeuta ni pretendo reemplazar eso - soy un compañero que cree en vos."

Con las palabras del guardian, suave, no legal.

## TEST FINAL (ANTES DE ENTREGAR)

Preguntate:
1. ¿La primera frase genera impacto? Si puedo scrollear sin parar, FALLA.
2. ¿Use alguna frase prohibida? Busca y elimina.
3. ¿El mensaje es claro? Una idea central, no 5.
4. ¿Hay especificidad? Detalles concretos > abstracciones bonitas.
5. ¿La persona se va a sentir VISTA? No solo leida.
6. ¿Suena a humano que vivio cosas? No a IA que genero texto.
7. ¿Esta en rioplatense? Vos, tenes, podes.
8. ¿Puedo aplicar algo HOY? Practica > teoria.
`;

// ═══════════════════════════════════════════════════════════════════════════════
// FRASES PROHIBIDAS - DETECCION AUTOMATICA
// ═══════════════════════════════════════════════════════════════════════════════

export const FRASES_PROHIBIDAS = [
  'desde las profundidades',
  'brumas ancestrales',
  'velo entre mundos',
  'tiempos inmemoriales',
  'susurro del viento',
  'danza de las hojas',
  'vibraciones cosmicas',
  'vibraciones cósmicas',
  'campo energetico',
  'campo energético',
  'bosques de escocia',
  'acantilados de irlanda',
  '847 años',
  '847 anos',
  'manto de estrellas',
  'atravesando dimensiones',
  'bosque ancestral de piriapolis',
  'bosque ancestral de piriápolis',
  'en lo profundo del bosque',
  'las brumas del otoño',
  'el velo entre los mundos',
  'bienvenida a esta leccion',
  'bienvenido a esta leccion',
  'en esta leccion vamos a',
  'es importante que sepas',
  'querida alma',
  'querido ser de luz',
  'desde el corazon del universo',
  'la energia cosmica',
  'la energía cósmica',
  'vibracion elevada',
  'vibración elevada',
  'portal dimensional',
  'tu alma eterna',
  'en el plano astral'
];

// ═══════════════════════════════════════════════════════════════════════════════
// VALIDADOR DE VIBRA
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Valida que el contenido tenga la "vibra" correcta
 * @returns {Object} { valido: boolean, score: number, problemas: [], sugerencias: [] }
 */
export function validarVibra(contenido, guardian = null) {
  const resultado = {
    valido: true,
    score: 100,
    problemas: [],
    sugerencias: [],
    detalles: {}
  };

  if (!contenido || contenido.length < 100) {
    return {
      valido: false,
      score: 0,
      problemas: ['Contenido muy corto o vacio'],
      sugerencias: ['Generar contenido con minimo 500 palabras'],
      detalles: {}
    };
  }

  const contenidoLower = contenido.toLowerCase();

  // 1. FRASES PROHIBIDAS (-15 puntos cada una)
  const frasesEncontradas = FRASES_PROHIBIDAS.filter(f => contenidoLower.includes(f));
  if (frasesEncontradas.length > 0) {
    resultado.score -= frasesEncontradas.length * 15;
    resultado.problemas.push(`Frases de IA detectadas: "${frasesEncontradas.join('", "')}"`);
    resultado.detalles.frasesProhibidas = frasesEncontradas;
  }

  // 2. TONO RIOPLATENSE (+20 si hay, -20 si no hay)
  const marcadoresRioplatenses = ['vos ', ' vos', 'tenes', 'tenés', 'podes', 'podés', 'sos ', ' sos'];
  const tieneRioplatense = marcadoresRioplatenses.some(m => contenidoLower.includes(m));

  const marcadoresTuVosotros = [' tienes ', ' puedes ', ' eres ', ' tu ', 'querido ', 'querida '];
  const tieneTuVosotros = marcadoresTuVosotros.some(m => contenidoLower.includes(m));

  if (tieneRioplatense) {
    resultado.score += 10;
    resultado.detalles.rioplatense = true;
  } else {
    resultado.score -= 20;
    resultado.problemas.push('No usa español rioplatense (vos, tenes, podes)');
    resultado.detalles.rioplatense = false;
  }

  if (tieneTuVosotros) {
    resultado.score -= 15;
    resultado.problemas.push('Usa "tu/tienes/puedes" en lugar de rioplatense');
  }

  // 3. PRIMERA FRASE CON IMPACTO
  const primeraFrase = contenido.split(/[.!?]/)[0].trim();
  const aperturasBlandas = [
    'hoy vamos a',
    'en esta leccion',
    'bienvenid',
    'me alegra',
    'es un placer',
    'en esta oportunidad',
    'queremos compartir'
  ];

  const tieneAperturaBlanda = aperturasBlandas.some(a => primeraFrase.toLowerCase().includes(a));
  if (tieneAperturaBlanda) {
    resultado.score -= 15;
    resultado.problemas.push('Primera frase sin impacto emocional');
    resultado.sugerencias.push('Empezar con gancho: "Hay personas que..." o pregunta directa');
  }

  if (primeraFrase.length > 200) {
    resultado.score -= 5;
    resultado.sugerencias.push('Primera frase muy larga - mas punch con frases cortas');
  }

  // 4. ESPECIFICIDAD vs GENERALIDAD
  const frasesGenericas = [
    'es importante',
    'debes saber',
    'tienes que entender',
    'la vida es',
    'el universo',
    'la energia del',
    'el poder de',
    'la magia de'
  ];

  const genericasEncontradas = frasesGenericas.filter(f => contenidoLower.includes(f));
  if (genericasEncontradas.length > 2) {
    resultado.score -= genericasEncontradas.length * 5;
    resultado.problemas.push('Contenido demasiado generico');
    resultado.sugerencias.push('Agregar ejemplos concretos y situaciones especificas');
  }

  // 5. CONTENIDO PRACTICO (buscar indicadores)
  const indicadoresPracticos = [
    'ejercicio',
    'practica',
    'práctica',
    'paso 1',
    'paso a paso',
    'materiales',
    'sentate',
    'respira',
    'respirá',
    'anota',
    'anotá',
    'observa',
    'observá',
    'intenta',
    'intentá',
    'proba',
    'probá'
  ];

  const tienePractico = indicadoresPracticos.some(i => contenidoLower.includes(i));
  if (tienePractico) {
    resultado.score += 10;
    resultado.detalles.tienePractico = true;
  } else {
    resultado.sugerencias.push('Agregar ejercicio o practica concreta');
    resultado.detalles.tienePractico = false;
  }

  // 6. VALIDACION EMOCIONAL (buscar)
  const indicadoresValidacion = [
    'no es tu culpa',
    'no estas loca',
    'no estás loca',
    'es real',
    'es valido',
    'es válido',
    'mereces',
    'merecés',
    'esta bien',
    'está bien',
    'no exageras',
    'no exagerás',
    'tiene sentido'
  ];

  const tieneValidacion = indicadoresValidacion.some(i => contenidoLower.includes(i));
  if (tieneValidacion) {
    resultado.score += 10;
    resultado.detalles.tieneValidacion = true;
  } else {
    resultado.sugerencias.push('Agregar validacion emocional explicita');
    resultado.detalles.tieneValidacion = false;
  }

  // 7. MENCIONA AL GUARDIAN (si se proporciona)
  if (guardian?.nombre) {
    if (!contenido.includes(guardian.nombre)) {
      resultado.score -= 10;
      resultado.problemas.push(`No menciona el nombre del guardian (${guardian.nombre})`);
    }
  }

  // 8. LONGITUD APROPIADA
  const palabras = contenido.split(/\s+/).length;
  if (palabras < 200) {
    resultado.score -= 15;
    resultado.problemas.push(`Contenido muy corto (${palabras} palabras)`);
  } else if (palabras > 2000) {
    resultado.sugerencias.push(`Contenido largo (${palabras} palabras) - verificar que no sea repetitivo`);
  }

  resultado.detalles.palabras = palabras;

  // 9. ESTRUCTURA (parrafos, no muros de texto)
  const parrafos = contenido.split(/\n\n+/).length;
  if (parrafos < 3 && palabras > 300) {
    resultado.score -= 10;
    resultado.problemas.push('Texto sin suficientes parrafos - dificil de leer');
  }

  // 10. SCORE FINAL
  resultado.score = Math.max(0, Math.min(100, resultado.score));
  resultado.valido = resultado.score >= 70;

  return resultado;
}

// ═══════════════════════════════════════════════════════════════════════════════
// GENERADOR DE CONTENIDO DIARIO DEL CIRCULO
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Tipos de contenido diario para el Circulo
 */
export const TIPOS_CONTENIDO_DIARIO = {
  reflexion_manana: {
    nombre: 'Reflexion de la Mañana',
    descripcion: 'Mensaje corto para empezar el dia con intencion',
    longitudMin: 150,
    longitudMax: 400,
    estructura: ['gancho', 'reflexion', 'intencion_del_dia']
  },
  practica_guiada: {
    nombre: 'Practica Guiada',
    descripcion: 'Meditacion o ejercicio de 5-10 minutos',
    longitudMin: 400,
    longitudMax: 800,
    estructura: ['preparacion', 'pasos', 'cierre']
  },
  historia_guardian: {
    nombre: 'Historia del Guardian',
    descripcion: 'Anecdota o enseñanza desde la experiencia del guardian',
    longitudMin: 300,
    longitudMax: 600,
    estructura: ['anecdota', 'leccion', 'aplicacion']
  },
  ritual_simple: {
    nombre: 'Ritual Simple',
    descripcion: 'DIY facil con materiales caseros',
    longitudMin: 400,
    longitudMax: 700,
    estructura: ['proposito', 'materiales', 'pasos', 'intencion']
  },
  pregunta_profunda: {
    nombre: 'Pregunta Profunda',
    descripcion: 'Una pregunta para journaling con contexto',
    longitudMin: 200,
    longitudMax: 400,
    estructura: ['contexto', 'pregunta', 'guia']
  }
};

/**
 * Genera el prompt para contenido diario del Circulo
 */
export function generarPromptContenidoDiario(guardian, tipo, contexto = {}) {
  const tipoConfig = TIPOS_CONTENIDO_DIARIO[tipo];
  if (!tipoConfig) {
    throw new Error(`Tipo de contenido no valido: ${tipo}`);
  }

  const especializacion = guardian.especializacion ||
    detectarEspecializacionPorKeywords(`${guardian.categoria} ${guardian.accesorios || ''}`);

  const instruccionesEsp = especializacion ?
    getInstruccionesEspecializacion(especializacion) : '';

  return `
${SYSTEM_PROMPT_CIRCULO}

## GUARDIAN QUE HABLA
- Nombre: ${guardian.nombre}
- Especie: ${guardian.especie || guardian.tipo || 'duende'}
- Categoria: ${guardian.categoria || 'proteccion'}
- Accesorios: ${guardian.accesorios || 'ninguno especificado'}
${guardian.historia ? `- Historia: ${guardian.historia.substring(0, 500)}...` : ''}
${guardian.personalidad ? `- Personalidad: ${guardian.personalidad}` : ''}

${instruccionesEsp}

## TIPO DE CONTENIDO: ${tipoConfig.nombre.toUpperCase()}
${tipoConfig.descripcion}

Estructura requerida: ${tipoConfig.estructura.join(' → ')}
Longitud: ${tipoConfig.longitudMin}-${tipoConfig.longitudMax} palabras

${contexto.tema ? `## TEMA ESPECIFICO: ${contexto.tema}` : ''}
${contexto.fechaEspecial ? `## CONTEXTO: ${contexto.fechaEspecial}` : ''}
${contexto.lunaActual ? `## FASE LUNAR: ${contexto.lunaActual}` : ''}

## INSTRUCCIONES FINALES
1. Escribi DESDE la voz de ${guardian.nombre}
2. USA español rioplatense (vos, tenes, podes)
3. EMPEZA con impacto emocional, no con introduccion
4. Si es practica/ritual, da pasos CONCRETOS
5. TERMINA con algo que quede resonando
6. NO uses ninguna frase prohibida
7. Maximo ${tipoConfig.longitudMax} palabras

Genera el contenido ahora:
`;
}

// ═══════════════════════════════════════════════════════════════════════════════
// GENERADOR DE CURSOS COMPLETOS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Estructura de un curso completo
 */
export const ESTRUCTURA_CURSO = {
  duracion: '4 semanas',
  modulosPorCurso: 4,
  leccionesPorModulo: 4,

  tiposLeccion: {
    1: {
      nombre: 'El Problema Real',
      enfoque: 'Nombrar el dolor, explicar por que pasa, tipos del problema',
      incluye: ['gancho', 'espejo', 'validacion', 'tipos/categorias', 'pregunta journaling']
    },
    2: {
      nombre: 'Practica Guiada',
      enfoque: 'Meditacion o ejercicio corporal/energetico',
      incluye: ['preparacion', 'instrucciones paso a paso', 'duracion 10-15 min', 'que anotar']
    },
    3: {
      nombre: 'DIY Practico',
      enfoque: 'Crear algo tangible con intencion',
      incluye: ['materiales caseros', 'pasos con intencion', 'donde usarlo', 'mantenimiento']
    },
    4: {
      nombre: 'Integracion',
      enfoque: 'Reflexion, practica semanal, cierre',
      incluye: ['reflexion', 'practica de la semana', 'preguntas journaling', 'mensaje cierre guardian']
    }
  }
};

/**
 * Genera el prompt para un modulo completo de curso
 */
export function generarPromptModuloCurso(config) {
  const {
    curso,
    moduloNumero,
    guardian,
    tema,
    eventoLunar,
    cristalesAsociados
  } = config;

  const especializacion = guardian.especializacion ||
    detectarEspecializacionPorKeywords(`${guardian.categoria} ${guardian.accesorios || ''} ${tema}`);

  const instruccionesEsp = especializacion ?
    getInstruccionesEspecializacion(especializacion) : '';

  return `
${SYSTEM_PROMPT_CIRCULO}

## CONTEXTO DEL CURSO
- Curso: ${curso.titulo}
- Mes: ${curso.mes}
- Tema general: ${curso.tema}
${eventoLunar ? `- Evento lunar del mes: ${eventoLunar}` : ''}

## MODULO ${moduloNumero}: ${tema}
Guardian Profesor/a: ${guardian.nombre} (${guardian.especie || 'duende'})

## DATOS DEL GUARDIAN
- Nombre: ${guardian.nombre}
- Especie: ${guardian.especie || guardian.tipo || 'duende'}
- Categoria: ${guardian.categoria || 'proteccion'}
- Elemento: ${guardian.elemento || 'Tierra'}
- Accesorios: ${guardian.accesorios || 'ninguno especificado'}
${cristalesAsociados ? `- Cristales asociados: ${cristalesAsociados.join(', ')}` : ''}
${guardian.historia ? `- Historia: ${guardian.historia.substring(0, 500)}` : ''}

${instruccionesEsp}

## ESTRUCTURA REQUERIDA

Genera el modulo completo con esta estructura:

### PRESENTACION DEL GUARDIAN
- ${guardian.nombre} se presenta en primera persona
- Explica por que la persona llego a este modulo
- Anticipa que van a trabajar juntos
- 200-300 palabras
- EMPEZAR con impacto, ej: "Soy [Nombre]. Y si estas aca, es porque..."

### LECCION 1: El Problema Real
- Nombrar el dolor sin rodeos
- Explicar POR QUE le pasa (contexto social, crianza, etc)
- 2-3 tipos/categorias del problema para que se identifique
- Pregunta para journaling
- 500-700 palabras

### LECCION 2: Practica Guiada
- Titulo descriptivo (ej: "El Escaner Corporal de Proteccion")
- Meditacion o ejercicio de 10-15 minutos
- Preparacion (como sentarse, ojos, respiracion)
- Instrucciones paso a paso
- Que anotar al terminar
- 500-700 palabras

### LECCION 3: DIY Practico
- Titulo (ej: "Tu Frasco de Proteccion Personal")
- Lista de materiales CASEROS (sal, romero, frasco de mermelada)
- Pasos con INTENCION (no solo "poner sal" sino "mientras pones la sal, decis...")
- Donde ubicarlo o como usarlo
- Cuando renovarlo
- 500-700 palabras

### LECCION 4: Integracion y Reflexion
- Mensaje profundo sobre lo aprendido
- Practica para la semana (algo simple pero transformador)
- 3 preguntas de journaling
- Mensaje de cierre de ${guardian.nombre}
- Vista previa del proximo modulo
- 400-500 palabras

## REGLAS CRITICAS
1. TODO en español rioplatense (vos, tenes, podes)
2. ${guardian.nombre} habla en PRIMERA PERSONA
3. CERO frases prohibidas
4. Ejemplos CONCRETOS, no abstracciones
5. Contenido APLICABLE hoy
6. Disclaimer natural en alguna parte

Genera el modulo completo ahora:
`;
}

// ═══════════════════════════════════════════════════════════════════════════════
// GENERADOR CON VALIDACION Y REGENERACION
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Genera contenido y valida que tenga la vibra correcta
 * Regenera automaticamente si el score es bajo
 */
export async function generarContenidoValidado(promptGenerator, llmFunction, guardian, opciones = {}) {
  const {
    maxIntentos = 3,
    scoreMinimo = 70,
    onIntento = null,
    mejorarPromptEnReintento = true
  } = opciones;

  let mejorResultado = null;
  let mejorScore = 0;

  for (let intento = 1; intento <= maxIntentos; intento++) {
    try {
      // Generar prompt (puede modificarse en reintentos)
      let prompt = typeof promptGenerator === 'function'
        ? promptGenerator(intento)
        : promptGenerator;

      // Si es reintento y hay problemas previos, agregar instrucciones
      if (intento > 1 && mejorResultado && mejorarPromptEnReintento) {
        const problemas = mejorResultado.validacion.problemas;
        prompt += `

## CORRECIONES REQUERIDAS (intento ${intento})
El contenido anterior tuvo estos problemas que DEBES corregir:
${problemas.map(p => `- ${p}`).join('\n')}

${mejorResultado.validacion.sugerencias.map(s => `- Sugerencia: ${s}`).join('\n')}

GENERA UNA VERSION MEJORADA que corrija estos problemas.
`;
      }

      // Llamar al LLM
      const contenido = await llmFunction(prompt);

      // Validar vibra
      const validacion = validarVibra(contenido, guardian);

      // Tambien validar con el sistema de academia
      const validacionAcademia = validarContenidoGenerado(contenido, guardian);

      // Combinar scores
      const scoreFinal = Math.round((validacion.score + validacionAcademia.score) / 2);

      const resultado = {
        contenido,
        validacion: {
          ...validacion,
          scoreAcademia: validacionAcademia.score,
          scoreFinal
        },
        intento,
        guardian: guardian?.nombre
      };

      // Callback de intento
      if (onIntento) {
        onIntento(resultado);
      }

      // Guardar si es el mejor hasta ahora
      if (scoreFinal > mejorScore) {
        mejorScore = scoreFinal;
        mejorResultado = resultado;
      }

      // Si pasa el minimo, retornar
      if (scoreFinal >= scoreMinimo) {
        return {
          exito: true,
          ...resultado,
          intentosUsados: intento
        };
      }

      console.log(`[GENERADOR] Intento ${intento}: score ${scoreFinal}/${scoreMinimo} - reintentando...`);

    } catch (error) {
      logError('generarContenidoValidado', error, { intento, guardian: guardian?.nombre });

      if (intento === maxIntentos) {
        throw error;
      }
    }
  }

  // Retornar el mejor resultado aunque no pase el minimo
  return {
    exito: false,
    ...mejorResultado,
    intentosUsados: maxIntentos,
    mensaje: `No se alcanzo el score minimo (${mejorScore}/${scoreMinimo}) despues de ${maxIntentos} intentos`
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// GENERADOR DE CURSO COMPLETO
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Genera un curso completo de 4 modulos
 */
export async function generarCursoCompleto(config, llmFunction) {
  const {
    titulo,
    tema,
    mes,
    year,
    guardianes, // Array de 4 guardianes
    eventoLunar,
    cristalesPorModulo
  } = config;

  if (!guardianes || guardianes.length < 4) {
    throw new Error('Se necesitan 4 guardianes para un curso completo');
  }

  const curso = {
    titulo,
    tema,
    mes,
    year,
    eventoLunar,
    modulos: [],
    metadata: {
      generadoEn: new Date().toISOString(),
      version: '1.0'
    }
  };

  const temasPorModulo = generarTemasModulos(tema);

  for (let i = 0; i < 4; i++) {
    console.log(`[CURSO] Generando modulo ${i + 1}/4: ${temasPorModulo[i]}...`);

    const guardian = guardianes[i];

    // Validar guardian antes de usar
    const validacionGuardian = validarGuardianParaAcademia(guardian);
    if (!validacionGuardian.valid) {
      console.warn(`[CURSO] Guardian ${guardian.nombre} tiene problemas:`, validacionGuardian.errores);
    }

    const promptModulo = generarPromptModuloCurso({
      curso: { titulo, tema, mes },
      moduloNumero: i + 1,
      guardian,
      tema: temasPorModulo[i],
      eventoLunar: i === 1 ? eventoLunar : null, // Evento lunar en modulo 2
      cristalesAsociados: cristalesPorModulo?.[i]
    });

    const resultado = await generarContenidoValidado(
      promptModulo,
      llmFunction,
      guardian,
      {
        maxIntentos: 3,
        scoreMinimo: 70,
        onIntento: (r) => console.log(`  Intento ${r.intento}: score ${r.validacion.scoreFinal}`)
      }
    );

    curso.modulos.push({
      numero: i + 1,
      titulo: temasPorModulo[i],
      guardian: {
        id: guardian.id || guardian.productoId,
        nombre: guardian.nombre,
        especie: guardian.especie,
        categoria: guardian.categoria,
        imagen: guardian.imagen || guardian.foto
      },
      contenido: resultado.contenido,
      validacion: resultado.validacion,
      generadoExitosamente: resultado.exito
    });
  }

  // Calcular score promedio del curso
  const scorePromedio = Math.round(
    curso.modulos.reduce((sum, m) => sum + (m.validacion?.scoreFinal || 0), 0) / 4
  );

  curso.metadata.scorePromedio = scorePromedio;
  curso.metadata.todosExitosos = curso.modulos.every(m => m.generadoExitosamente);

  return curso;
}

/**
 * Genera los temas de los 4 modulos basado en el tema principal
 */
function generarTemasModulos(temaPrincipal) {
  const mapeoTemas = {
    'proteccion': [
      'Entendiendo tu Escudo Interior',
      'Limpieza de Espacios y Aura',
      'Estableciendo Limites Sanos',
      'Tu Armadura de Luz'
    ],
    'abundancia': [
      'Desbloqueando tu Merecimiento',
      'Limpiando Creencias de Escasez',
      'Abriendo el Flujo del Recibir',
      'Manifestando tu Abundancia'
    ],
    'sanacion': [
      'Reconociendo tus Heridas',
      'El Arte de Soltar',
      'Nutriendo tu Interior',
      'Renaciendo desde el Amor'
    ],
    'amor': [
      'Abriendo el Corazon',
      'Sanando Heridas de Amor',
      'Amor Propio Primero',
      'Atrayendo Amor Genuino'
    ],
    'sabiduria': [
      'Conectando con tu Intuicion',
      'Claridad en la Confusion',
      'Tomando Decisiones Sabias',
      'Tu Brujula Interior'
    ],
    'transformacion': [
      'Reconociendo que Necesita Cambiar',
      'Soltando lo Viejo',
      'El Proceso de Metamorfosis',
      'Emergiendo Renovada'
    ]
  };

  const temaLower = temaPrincipal.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  for (const [key, temas] of Object.entries(mapeoTemas)) {
    if (temaLower.includes(key)) {
      return temas;
    }
  }

  // Default generico
  return [
    `Comprendiendo ${temaPrincipal}`,
    `Practicas de ${temaPrincipal}`,
    `Profundizando en ${temaPrincipal}`,
    `Integrando ${temaPrincipal}`
  ];
}

// ═══════════════════════════════════════════════════════════════════════════════
// GENERADOR DE CONTENIDO DIARIO (WRAPPER COMPLETO)
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Genera contenido diario para el Circulo con validacion
 */
export async function generarContenidoDiario(guardian, tipo, llmFunction, contexto = {}) {
  const prompt = generarPromptContenidoDiario(guardian, tipo, contexto);

  return generarContenidoValidado(
    prompt,
    llmFunction,
    guardian,
    {
      maxIntentos: 3,
      scoreMinimo: 70,
      onIntento: (r) => {
        console.log(`[DIARIO] ${tipo} - Intento ${r.intento}: score ${r.validacion.scoreFinal}`);
      }
    }
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// API PRINCIPAL - GENERADOR UNIFICADO
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * API principal del generador automatico
 */
export const GeneradorAutomatico = {
  // System prompt
  SYSTEM_PROMPT: SYSTEM_PROMPT_CIRCULO,

  // Frases prohibidas
  FRASES_PROHIBIDAS,

  // Tipos de contenido
  TIPOS_CONTENIDO_DIARIO,
  ESTRUCTURA_CURSO,

  // Validacion
  validarVibra,

  // Generadores de prompts
  generarPromptContenidoDiario,
  generarPromptModuloCurso,

  // Generadores con validacion
  generarContenidoValidado,
  generarContenidoDiario,
  generarCursoCompleto,

  // Helpers
  generarTemasModulos,

  // Especializaciones (re-export)
  especializaciones,
  getInstruccionesEspecializacion,
  detectarEspecializacionPorKeywords
};

export default GeneradorAutomatico;
