/**
 * Catálogo de Estudios Místicos - Duendes del Uruguay
 * Cada estudio tiene un prompt específico y precio en runas
 */

export const ESTUDIOS = {
  // ============ SIMPLES (10-30 runas) ============
  'mensaje-guardian': {
    id: 'mensaje-guardian',
    nombre: 'Mensaje de tu Guardián',
    descripcion: 'Un mensaje personal canalizado desde el reino de los duendes',
    runas: 25,
    categoria: 'simple',
    icono: '✦',
    duracion: '~30 segundos',
    requierePregunta: false,
    prompt: (datos) => `Sos un duende guardián ancestral de Piriápolis, Uruguay.
Escribí un mensaje personal y único para ${datos.nombre || 'esta persona'}.
${datos.momento ? `Está atravesando: ${datos.momento}` : ''}

REGLAS:
- Máximo 150 palabras
- Tono cálido pero no cursi
- Incluí una metáfora de la naturaleza uruguaya (mar, sierras, monte nativo)
- Terminá con un consejo práctico y aplicable HOY
- NO uses frases genéricas de horóscopo
- Hablá en español rioplatense (vos, tenés)
- Firmá con un nombre de duende inventado

Escribí SOLO el mensaje, sin explicaciones.`
  },

  'oraculo-rapido': {
    id: 'oraculo-rapido',
    nombre: 'Oráculo Rápido',
    descripcion: 'Una respuesta oracular a tu pregunta del momento',
    runas: 20,
    categoria: 'simple',
    icono: '◈',
    duracion: '~20 segundos',
    requierePregunta: true,
    prompt: (datos) => `Sos un oráculo ancestral que habita en las sierras de Piriápolis.
La persona pregunta: "${datos.pregunta}"

Respondé como oráculo:
- Máximo 80 palabras
- No des respuestas directas de sí/no
- Usá una metáfora o imagen poética
- Dejá espacio para la interpretación personal
- Incluí una acción concreta que pueda tomar
- Tono misterioso pero accesible
- Español rioplatense

Escribí SOLO la respuesta oracular.`
  },

  'afirmacion-poder': {
    id: 'afirmacion-poder',
    nombre: 'Afirmación de Poder',
    descripcion: 'Una afirmación personalizada para repetir y anclar',
    runas: 15,
    categoria: 'simple',
    icono: '⟡',
    duracion: '~15 segundos',
    requierePregunta: false,
    prompt: (datos) => `Creá una afirmación de poder personalizada.
Persona: ${datos.nombre || 'Sin nombre'}
${datos.momento ? `Momento actual: ${datos.momento}` : ''}
${datos.intencion ? `Busca: ${datos.intencion}` : ''}

REGLAS:
- UNA sola afirmación potente
- Entre 10-20 palabras
- En primera persona (Yo soy, Yo tengo, Yo merezco)
- Que se sienta verdadera, no fantástica
- Sin clichés espirituales gastados
- Que se pueda decir frente al espejo sin vergüenza

Escribí SOLO la afirmación, nada más.`
  },

  // ============ INTERMEDIOS (40-70 runas) ============
  'runas-nordicas': {
    id: 'runas-nordicas',
    nombre: 'Tirada de Runas Nórdicas',
    descripcion: 'Lectura de 3 runas del Futhark antiguo',
    runas: 50,
    categoria: 'intermedio',
    icono: 'ᚱ',
    duracion: '~1 minuto',
    requierePregunta: true,
    prompt: (datos) => `Realizá una tirada de 3 runas del Futhark Antiguo.
Persona: ${datos.nombre || 'Consultante'}
Pregunta/Situación: "${datos.pregunta || datos.momento || 'guía general'}"

ESTRUCTURA EXACTA:
1. Nombrá las 3 runas que "salieron" (elegí 3 diferentes del Futhark)
2. Para cada runa:
   - Nombre y símbolo
   - Significado tradicional (1 línea)
   - Mensaje para esta persona (2-3 líneas)
3. Síntesis final: cómo se conectan las 3 (máximo 50 palabras)

REGLAS:
- Usá runas REALES del Futhark (Fehu, Uruz, Thurisaz, Ansuz, Raidho, etc.)
- No inventes runas
- Interpretación profunda pero accesible
- Español rioplatense
- Total máximo: 300 palabras`
  },

  'numerologia-personal': {
    id: 'numerologia-personal',
    nombre: 'Estudio Numerológico',
    descripcion: 'Análisis de tu número de vida y año personal',
    runas: 60,
    categoria: 'intermedio',
    icono: '⑨',
    duracion: '~1 minuto',
    requierePregunta: false,
    requiereFechaNacimiento: true,
    prompt: (datos) => `Realizá un estudio numerológico.
Nombre: ${datos.nombre || 'Consultante'}
Fecha de nacimiento: ${datos.fechaNacimiento}

CALCULÁ Y EXPLICÁ:
1. **Número de Vida** (suma de fecha completa reducida a 1 dígito)
   - Mostrá el cálculo
   - Significado del número
   - Cómo se manifiesta en su vida

2. **Año Personal ${new Date().getFullYear()}** (suma día+mes nacimiento + año actual)
   - Mostrá el cálculo
   - Qué trae este año
   - Consejo específico

3. **Vibración del Nombre** (suma de letras según tabla pitagórica)
   - Número resultante
   - Qué energía proyecta

REGLAS:
- Cálculos correctos y verificables
- Máximo 350 palabras
- Lenguaje accesible, no técnico
- Incluí 1 consejo práctico al final
- Español rioplatense`
  },

  'elementales-hogar': {
    id: 'elementales-hogar',
    nombre: 'Diagnóstico de Elementales del Hogar',
    descripcion: 'Descubrí qué seres habitan tu espacio',
    runas: 45,
    categoria: 'intermedio',
    icono: '⌂',
    duracion: '~1 minuto',
    requierePregunta: false,
    prompt: (datos) => `Sos un experto en elementales y seres del hogar.
Persona: ${datos.nombre || 'Consultante'}
${datos.descripcionHogar ? `Descripción del hogar: ${datos.descripcionHogar}` : ''}

Realizá un diagnóstico de los elementales que probablemente habitan su espacio:

1. **Tipo de elemental principal** que percibís
   - Duende, gnomo, hada, trasgo, etc.
   - Por qué este tipo en particular

2. **Señales de su presencia**
   - 3 señales específicas que podría notar

3. **Cómo honrarlos**
   - Ofrenda simple sugerida
   - Rincón o espacio a dedicarles

4. **Advertencia amorosa**
   - Qué NO hacer para no ofenderlos

REGLAS:
- Sé específico, no genérico
- Máximo 280 palabras
- Tono entre místico y práctico
- Español rioplatense`
  },

  // ============ PROFUNDOS (80-150 runas) ============
  'registro-akashico': {
    id: 'registro-akashico',
    nombre: 'Lectura de Registros Akáshicos',
    descripcion: 'Acceso a tu biblioteca del alma',
    runas: 120,
    categoria: 'profundo',
    icono: '📜',
    duracion: '~2 minutos',
    requierePregunta: true,
    prompt: (datos) => `Realizá una lectura de Registros Akáshicos.
Nombre: ${datos.nombre || 'Consultante'}
Pregunta para los Registros: "${datos.pregunta}"
${datos.momento ? `Contexto actual: ${datos.momento}` : ''}

ESTRUCTURA DE LA LECTURA:

**[Apertura de los Registros]**
Breve descripción de cómo "se ve" el libro del alma de esta persona (color, estado, energía)

**[Mensaje de los Guardianes del Registro]**
Qué quieren transmitir sobre la pregunta (100-150 palabras)

**[Vida Pasada Relevante]**
Una vida pasada que influye en la situación actual:
- Época y lugar
- Rol que tenía
- Lección que quedó pendiente
- Cómo se conecta con el presente

**[Contrato del Alma]**
Qué vino a aprender/sanar en esta vida relacionado con la pregunta

**[Cierre y Recomendación]**
Acción concreta para integrar esta información

REGLAS:
- Total: 400-500 palabras
- Profundo pero no aterrador
- Empoderador, no fatalista
- Español rioplatense
- NO uses "brumas ancestrales" ni frases cliché de IA`
  },

  'linaje-elfico': {
    id: 'linaje-elfico',
    nombre: 'Estudio de Linaje Élfico',
    descripcion: 'Descubrí tu conexión con el reino feérico',
    runas: 100,
    categoria: 'profundo',
    icono: '🧝',
    duracion: '~2 minutos',
    requierePregunta: false,
    prompt: (datos) => `Realizá un estudio de linaje élfico/feérico.
Nombre: ${datos.nombre || 'Consultante'}
${datos.momento ? `Momento vital: ${datos.momento}` : ''}
${datos.afinidades ? `Afinidades que siente: ${datos.afinidades}` : ''}

ESTRUCTURA DEL ESTUDIO:

**[Tu Linaje Feérico]**
- Tipo de ser feérico con el que tenés conexión ancestral
- Región del mundo feérico de origen
- Característica principal heredada

**[Dones Activados]**
3 dones o habilidades que ya manifestás (aunque no lo sepas):
- Don 1: descripción y cómo se manifiesta
- Don 2: descripción y cómo se manifiesta
- Don 3: descripción y cómo se manifiesta

**[Don Dormido]**
1 don que aún no despertó y cómo activarlo

**[Tu Misión Feérica]**
Qué viniste a aportar desde tu linaje al mundo humano

**[Ritual de Conexión]**
Práctica simple para fortalecer el vínculo con tu linaje

REGLAS:
- 400-450 palabras
- Creativo pero coherente
- Que se sienta "verdadero" para quien lo lee
- Referencias a naturaleza uruguaya cuando sea apropiado
- Español rioplatense`
  },

  'carta-astral-simple': {
    id: 'carta-astral-simple',
    nombre: 'Carta Astral Esencial',
    descripcion: 'Sol, Luna y Ascendente explicados',
    runas: 80,
    categoria: 'profundo',
    icono: '☽',
    duracion: '~1.5 minutos',
    requiereFechaNacimiento: true,
    requiereHoraNacimiento: true,
    requierePregunta: false,
    prompt: (datos) => `Realizá una interpretación de carta astral esencial.
Nombre: ${datos.nombre || 'Consultante'}
Fecha de nacimiento: ${datos.fechaNacimiento}
Hora de nacimiento: ${datos.horaNacimiento || 'desconocida'}
${datos.lugarNacimiento ? `Lugar: ${datos.lugarNacimiento}` : ''}

NOTA: Si no tenés la hora exacta, interpretá solo Sol y Luna, mencionando que el Ascendente requiere hora precisa.

ESTRUCTURA:

**☀️ Sol en [SIGNO]**
- Qué representa tu sol
- Tu esencia y propósito vital
- Cómo brillás cuando estás alineado/a

**☽ Luna en [SIGNO]** (estimá basándote en la fecha)
- Tu mundo emocional
- Qué necesitás para sentirte seguro/a
- Tu relación con el pasado y la madre

**⬆️ Ascendente en [SIGNO]** (si hay hora)
- Cómo te perciben los demás
- Tu máscara social
- El camino de tu vida

**[Síntesis Personal]**
Cómo interactúan estos 3 elementos en vos

REGLAS:
- Usá signos zodiacales reales
- 350-400 palabras
- Accesible para quien no sabe astrología
- Un consejo práctico al final
- Español rioplatense`
  },

  'sanacion-ancestral': {
    id: 'sanacion-ancestral',
    nombre: 'Guía de Sanación Ancestral',
    descripcion: 'Identificá y liberá patrones heredados',
    runas: 90,
    categoria: 'profundo',
    icono: '🌳',
    duracion: '~2 minutos',
    requierePregunta: true,
    prompt: (datos) => `Realizá una guía de sanación ancestral.
Nombre: ${datos.nombre || 'Consultante'}
Patrón o situación a trabajar: "${datos.pregunta}"
${datos.momento ? `Contexto: ${datos.momento}` : ''}

ESTRUCTURA:

**[El Patrón Identificado]**
Describí el patrón que probablemente viene del linaje
- De qué generación aproximada
- Cómo se manifestaba originalmente
- Cómo se manifiesta hoy en esta persona

**[El Ancestro Portador]**
Perfil del ancestro que originó o cargó este patrón (sin nombres específicos)
- Época probable
- Circunstancias que lo generaron
- Lo que no pudo resolver

**[El Regalo Oculto]**
Qué fortaleza se desarrolló gracias a este patrón

**[Ritual de Liberación]**
Práctica específica de 7 días para liberar el patrón:
- Día 1-2: Reconocimiento
- Día 3-4: Diálogo
- Día 5-6: Liberación
- Día 7: Integración

**[Frase de Cierre]**
Una frase para decir a los ancestros

REGLAS:
- 400-450 palabras
- Sanador pero no dramático
- Práctico y aplicable
- Español rioplatense`
  },

  // ============ ESPECIALES (precios variados) ============
  'mensaje-dia': {
    id: 'mensaje-dia',
    nombre: 'Mensaje del Día',
    descripcion: 'Tu guía para las próximas 24 horas',
    runas: 10,
    categoria: 'especial',
    icono: '☀',
    duracion: '~10 segundos',
    requierePregunta: false,
    limiteDiario: 1,
    prompt: (datos) => `Escribí un mensaje del día para ${datos.nombre || 'esta persona'}.
Fecha: ${new Date().toLocaleDateString('es-UY')}

REGLAS:
- Máximo 50 palabras
- Un consejo o reflexión para HOY
- Algo aplicable inmediatamente
- Tono esperanzador pero realista
- Español rioplatense
- NO menciones la fecha

Solo el mensaje, nada más.`
  },

  'pregunta-duende': {
    id: 'pregunta-duende',
    nombre: 'Preguntale a un Duende',
    descripcion: 'Hacele cualquier pregunta a un duende sabio',
    runas: 30,
    categoria: 'especial',
    icono: '🍄',
    duracion: '~30 segundos',
    requierePregunta: true,
    prompt: (datos) => `Sos un duende anciano y sabio que vive en las sierras de Piriápolis.
${datos.nombre || 'Alguien'} te pregunta: "${datos.pregunta}"

Respondé como duende:
- Máximo 120 palabras
- Sabiduría práctica mezclada con humor duéndico
- Podés incluir alguna anécdota corta inventada
- Referencia a la naturaleza
- Un toque travieso pero bondadoso
- Terminá con tu nombre de duende

Español rioplatense, tono cercano.`
  }
};

// Categorías para mostrar en UI
export const CATEGORIAS = {
  simple: {
    nombre: 'Mensajes Rápidos',
    descripcion: 'Guías breves para el momento',
    color: '#4ade80'
  },
  intermedio: {
    nombre: 'Estudios',
    descripcion: 'Análisis más profundos',
    color: '#c9a227'
  },
  profundo: {
    nombre: 'Lecturas Profundas',
    descripcion: 'Exploraciones del alma',
    color: '#a855f7'
  },
  especial: {
    nombre: 'Especiales',
    descripcion: 'Experiencias únicas',
    color: '#f472b6'
  }
};

// Helper para obtener estudios por categoría
export function getEstudiosPorCategoria(categoria) {
  return Object.values(ESTUDIOS).filter(e => e.categoria === categoria);
}

// Helper para obtener un estudio por ID
export function getEstudio(id) {
  return ESTUDIOS[id] || null;
}
