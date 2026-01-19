// ═══════════════════════════════════════════════════════════════
// CATÁLOGO COMPLETO DE EXPERIENCIAS MÁGICAS
// Duendes del Uruguay - Sistema de Estudios Personalizados
// ═══════════════════════════════════════════════════════════════

export const CATEGORIAS_EXPERIENCIAS = {
  mensajes: {
    id: 'mensajes',
    nombre: 'Mensajes Canalizados',
    icono: '💫',
    color: '#9370DB',
    descripcion: 'Mensajes directos del universo para ti'
  },
  guardianes: {
    id: 'guardianes',
    nombre: 'Conexión con Guardianes',
    icono: '🧙',
    color: '#4A7C59',
    descripcion: 'Estudios sobre tus duendes y protectores'
  },
  elementales: {
    id: 'elementales',
    nombre: 'Reino Elemental',
    icono: '🔥',
    color: '#E07020',
    descripcion: 'Conexión con los cuatro elementos'
  },
  cristales: {
    id: 'cristales',
    nombre: 'Cristalomancia',
    icono: '💎',
    color: '#00CED1',
    descripcion: 'Sabiduría de los cristales'
  },
  tarot: {
    id: 'tarot',
    nombre: 'Tarot y Oráculos',
    icono: '🃏',
    color: '#8B4513',
    descripcion: 'Lecturas con cartas y símbolos'
  },
  runas: {
    id: 'runas',
    nombre: 'Runas Nórdicas',
    icono: 'ᚱ',
    color: '#D4AF37',
    descripcion: 'Sabiduría ancestral de las runas'
  },
  astrologia: {
    id: 'astrologia',
    nombre: 'Astrología y Ciclos',
    icono: '🌙',
    color: '#4169E1',
    descripcion: 'Influencias cósmicas en tu vida'
  },
  energia: {
    id: 'energia',
    nombre: 'Lecturas Energéticas',
    icono: '✨',
    color: '#FFD700',
    descripcion: 'Análisis de tu campo energético'
  },
  alma: {
    id: 'alma',
    nombre: 'Estudios del Alma',
    icono: '🦋',
    color: '#DDA0DD',
    descripcion: 'Conexión profunda con tu esencia'
  },
  proteccion: {
    id: 'proteccion',
    nombre: 'Protección y Limpieza',
    icono: '🛡️',
    color: '#708090',
    descripcion: 'Blindaje y purificación energética'
  },
  amor: {
    id: 'amor',
    nombre: 'Amor y Relaciones',
    icono: '💕',
    color: '#E91E63',
    descripcion: 'Lecturas sobre el amor, compatibilidad y vínculos'
  },
  numerologia: {
    id: 'numerologia',
    nombre: 'Numerología',
    icono: '🔢',
    color: '#9C27B0',
    descripcion: 'El poder oculto de los números en tu vida'
  },
  suenos: {
    id: 'suenos',
    nombre: 'Interpretación de Sueños',
    icono: '🌙',
    color: '#3F51B5',
    descripcion: 'Descifra los mensajes de tus sueños'
  },
  abundancia: {
    id: 'abundancia',
    nombre: 'Abundancia y Prosperidad',
    icono: '🌟',
    color: '#FF9800',
    descripcion: 'Desbloquea el flujo de prosperidad'
  },
  akashicos: {
    id: 'akashicos',
    nombre: 'Registros Akáshicos',
    icono: '📚',
    color: '#673AB7',
    descripcion: 'Accede a la biblioteca cósmica de tu alma'
  },
  sanacion: {
    id: 'sanacion',
    nombre: 'Sanación Interior',
    icono: '💚',
    color: '#4CAF50',
    descripcion: 'Procesos de sanación emocional y espiritual'
  }
};

// ═══════════════════════════════════════════════════════════════
// EXPERIENCIAS COMPLETAS
// Cada una con: formulario único, tiempo de entrega, prompt específico
// ═══════════════════════════════════════════════════════════════

export const EXPERIENCIAS = [
  // ─────────────────────────────────────────────────────────────
  // MENSAJES CANALIZADOS
  // ─────────────────────────────────────────────────────────────
  {
    id: 'susurro_guardián',
    nombre: 'Susurro de tu Guardián',
    categoria: 'mensajes',
    icono: '🍃',
    runas: 20,
    tiempoMinutos: 15,
    descripcionCorta: 'Un mensaje directo de tu duende protector',
    descripcionLarga: `Tu guardián tiene algo que decirte. Algo que ha observado, algo que necesitás escuchar.

Este no es un mensaje genérico. Es lo que TU duende, el que te eligió a vos, quiere transmitirte en este momento exacto de tu vida.

A veces es un consejo. A veces un abrazo en palabras. A veces una advertencia suave. Siempre es exactamente lo que necesitás.`,
    paraQuien: 'Para quienes tienen un guardián adoptado y quieren fortalecer la conexión.',
    requiereGuardian: true,
    campos: [
      { id: 'estado_animo', tipo: 'select', label: '¿Cómo te sentís hoy?', opciones: ['Tranquila', 'Ansiosa', 'Triste', 'Confundida', 'Esperanzada', 'Cansada', 'Emocionada'] },
      { id: 'tema_mensaje', tipo: 'select', label: '¿Sobre qué te gustaría recibir guía?', opciones: ['Lo que mi guardián quiera decirme', 'Una decisión que tengo que tomar', 'Mi camino espiritual', 'Mis relaciones', 'Mi trabajo o proyectos', 'Mi salud emocional'] },
      { id: 'pregunta_opcional', tipo: 'textarea', label: '¿Hay algo específico que quieras preguntarle? (opcional)', placeholder: 'Podés dejarlo vacío y dejar que fluya...' }
    ],
    promptBase: `Sos el guardián {nombreGuardian} de {nombre}. Canalizá un mensaje personal y profundo.

CONTEXTO DEL USUARIO:
- Estado de ánimo: {estado_animo}
- Busca guía sobre: {tema_mensaje}
- Pregunta específica: {pregunta_opcional}

REGLAS:
- Hablá en primera persona como el guardián
- Usá un tono cálido pero con la sabiduría de siglos
- Sé específico, no genérico
- Incluí algo que solo un ser que la observa podría saber
- Mínimo 300 palabras
- Terminá con una frase que pueda recordar`
  },

  {
    id: 'mensaje_universo',
    nombre: 'Lo que el Universo Quiere Decirte',
    categoria: 'mensajes',
    icono: '🌌',
    runas: 25,
    tiempoMinutos: 25,
    descripcionCorta: 'Canalización directa del cosmos',
    descripcionLarga: `El universo siempre está hablando. El problema es que no siempre sabemos escuchar.

Esta canalización es diferente. No es un horóscopo. No es algo que aplica a millones. Es un mensaje específico que el universo tiene para VOS, en ESTE momento, considerando TODO lo que estás viviendo.

Es como si el cosmos se sentara a tomar un café con vos y te dijera lo que ve, lo que siente, lo que quiere que sepas.`,
    paraQuien: 'Para cualquier persona que sienta que necesita claridad cósmica.',
    requiereGuardian: false,
    campos: [
      { id: 'momento_vida', tipo: 'textarea', label: '¿Qué momento de tu vida estás atravesando?', placeholder: 'Contanos brevemente qué está pasando...' },
      { id: 'sensacion_recurrente', tipo: 'select', label: '¿Qué sensación te persigue últimamente?', opciones: ['Que algo grande viene', 'Que estoy estancada', 'Que algo termina', 'Que necesito cambiar', 'Que estoy en el camino correcto', 'No sé qué siento'] },
      { id: 'area_claridad', tipo: 'select', label: '¿En qué área necesitás más claridad?', opciones: ['Propósito de vida', 'Amor y relaciones', 'Trabajo y abundancia', 'Salud y energía', 'Decisiones importantes', 'Todo en general'] }
    ],
    promptBase: `Canalizá un mensaje del universo para {nombre}.

CONTEXTO:
- Momento de vida: {momento_vida}
- Sensación recurrente: {sensacion_recurrente}
- Área que necesita claridad: {area_claridad}

ESTILO:
- Hablá como el universo mismo, en primera persona
- Tono sabio pero cercano, como un padre cósmico
- Incluí señales específicas que puede buscar
- Validá lo que siente pero expandí su perspectiva
- Mínimo 400 palabras
- Incluí un "secreto" que el universo quiere revelarle`
  },

  {
    id: 'carta_ancestros',
    nombre: 'Carta de tus Ancestros',
    categoria: 'mensajes',
    icono: '📜',
    runas: 45,
    tiempoMinutos: 45,
    descripcionCorta: 'Mensaje canalizado de tu linaje',
    descripcionLarga: `Tus ancestros te observan. Desde el otro lado del velo, siguen conectados a vos a través de la sangre, la memoria y el amor que trasciende la muerte.

Esta carta es un mensaje de ellos. No de "los ancestros" en general, sino de los TUYOS. Los que caminaron antes para que vos pudieras caminar ahora.

Puede que sea un abuelo que no conociste. Una bisabuela que soñó con vos antes de que nacieras. Un linaje de mujeres fuertes que ahora te sostienen.`,
    paraQuien: 'Para quienes sienten conexión con su linaje o quieren sanar herencias familiares.',
    requiereGuardian: false,
    campos: [
      { id: 'conocimiento_ancestros', tipo: 'select', label: '¿Qué tanto conocés de tu historia familiar?', opciones: ['Mucho, conozco varias generaciones', 'Algo, conozco a mis abuelos', 'Poco, hay muchos misterios', 'Casi nada, familia fragmentada'] },
      { id: 'herencia_sentida', tipo: 'textarea', label: '¿Qué sentís que heredaste de tu familia? (bueno o difícil)', placeholder: 'Patrones, dones, miedos, fortalezas...' },
      { id: 'ancestro_conexion', tipo: 'text', label: '¿Hay algún ancestro con quien sientas conexión especial? (opcional)', placeholder: 'Un nombre, un rol (abuela materna), o dejalo vacío' },
      { id: 'pregunta_linaje', tipo: 'textarea', label: '¿Qué te gustaría preguntarles o saber de ellos?', placeholder: 'Tu pregunta para el linaje...' }
    ],
    promptBase: `Canalizá una carta de los ancestros de {nombre}.

CONTEXTO FAMILIAR:
- Conocimiento de historia: {conocimiento_ancestros}
- Herencia sentida: {herencia_sentida}
- Ancestro con conexión: {ancestro_conexion}
- Pregunta al linaje: {pregunta_linaje}

FORMATO:
- Escribí como si fueran los ancestros hablando en conjunto, pero con una voz líder
- Incluí detalles que suenen a memorias familiares
- Mencioná dones y también sombras del linaje
- Hablá de lo que rompieron para que ella pudiera ser libre
- Incluí un ritual simple de honra ancestral
- Mínimo 600 palabras`
  },

  // ─────────────────────────────────────────────────────────────
  // CONEXIÓN CON GUARDIANES
  // ─────────────────────────────────────────────────────────────
  {
    id: 'estado_guardian',
    nombre: 'Estado Energético de tu Guardián',
    categoria: 'guardianes',
    icono: '🔮',
    runas: 20,
    tiempoMinutos: 20,
    descripcionCorta: 'Cómo está tu duende y qué necesita',
    descripcionLarga: `Los guardianes también tienen estados. Se nutren de tu energía, pero también la dan. A veces están radiantes. A veces necesitan que los cuides.

Este estudio analiza cómo está TU guardián en este momento. Su nivel de energía, su humor, lo que ha estado haciendo por vos sin que lo notes, y lo que necesita de tu parte.

Es como un chequeo de salud, pero para tu duende.`,
    paraQuien: 'Para quienes quieren cuidar la relación con su guardián.',
    requiereGuardian: true,
    campos: [
      { id: 'ultima_conexion', tipo: 'select', label: '¿Cuándo fue la última vez que "hablaste" con tu guardián?', opciones: ['Hoy', 'Esta semana', 'Este mes', 'Hace mucho', 'Nunca conscientemente'] },
      { id: 'donde_guardian', tipo: 'select', label: '¿Dónde está tu guardián físicamente?', opciones: ['En mi altar', 'En mi habitación', 'En la sala', 'En mi lugar de trabajo', 'Lo llevo conmigo', 'No tengo figura física'] },
      { id: 'cambios_notados', tipo: 'textarea', label: '¿Has notado algo diferente últimamente? (sueños, sensaciones, coincidencias)', placeholder: 'Cualquier cosa que hayas percibido...' }
    ],
    promptBase: `Analizá el estado energético del guardián {nombreGuardian} de {nombre}.

DATOS:
- Última conexión consciente: {ultima_conexion}
- Ubicación física: {donde_guardian}
- Cambios notados: {cambios_notados}

INCLUIR:
1. Estado energético actual del guardián (1-10 y explicación)
2. Qué ha estado haciendo por ella sin que lo note
3. Cómo se siente el guardián con la relación actual
4. Qué necesita de ella en este momento
5. Un mensaje directo del guardián
6. Ritual simple de reconexión

Mínimo 450 palabras. Sé específico sobre este guardián en particular.`
  },

  {
    id: 'mision_guardian',
    nombre: 'La Misión de tu Guardián Contigo',
    categoria: 'guardianes',
    icono: '🗺️',
    runas: 45,
    tiempoMinutos: 50,
    descripcionCorta: 'Por qué te eligió y cuál es su propósito',
    descripcionLarga: `Tu guardián no te eligió por casualidad. Hay una razón. Una misión. Un propósito que los une.

Este estudio profundo revela POR QUÉ este duende específico te eligió a vos. Qué vio en tu alma. Qué viene a enseñarte. Qué venís a enseñarle vos a él. Y cuál es la misión que comparten en esta vida.

No es solo protección. Es un contrato sagrado.`,
    paraQuien: 'Para quienes quieren entender el vínculo profundo con su guardián.',
    requiereGuardian: true,
    campos: [
      { id: 'como_llego', tipo: 'textarea', label: '¿Cómo llegó tu guardián a tu vida? Contanos la historia.', placeholder: 'Cómo lo encontraste, qué sentiste, por qué lo elegiste...' },
      { id: 'conexion_sentida', tipo: 'textarea', label: '¿Qué conexión especial sentís con él?', placeholder: 'Lo que te hace sentir, lo que representa para vos...' },
      { id: 'desafio_actual', tipo: 'textarea', label: '¿Cuál es tu mayor desafío de vida actualmente?', placeholder: 'Algo que estés trabajando o enfrentando...' },
      { id: 'don_principal', tipo: 'select', label: '¿Cuál sentís que es tu don principal?', opciones: ['Intuición', 'Sanación', 'Creatividad', 'Fortaleza', 'Empatía', 'Sabiduría', 'No lo sé aún'] }
    ],
    promptBase: `Revelá la misión del guardián {nombreGuardian} con {nombre}.

HISTORIA DE CONEXIÓN:
- Cómo llegó: {como_llego}
- Conexión sentida: {conexion_sentida}
- Desafío actual: {desafio_actual}
- Don principal: {don_principal}

ESTRUCTURA DEL ESTUDIO:
1. Por qué este guardián la eligió (razones específicas)
2. Qué vio en su alma que otros no ven
3. La misión compartida (contrato sagrado)
4. Lo que él viene a enseñarle
5. Lo que ella viene a enseñarle a él
6. Cómo esta misión se conecta con su desafío actual
7. Señales de que están cumpliendo la misión
8. Ritual de activación del vínculo

Mínimo 700 palabras. Profundo y revelador.`
  },

  {
    id: 'comunicacion_guardian',
    nombre: 'Guía de Comunicación con tu Guardián',
    categoria: 'guardianes',
    icono: '💬',
    runas: 30,
    tiempoMinutos: 35,
    descripcionCorta: 'Aprende a escuchar y hablar con tu duende',
    descripcionLarga: `Tu guardián te habla todo el tiempo. El problema es que no siempre sabés reconocer su voz.

Esta guía personalizada te enseña CÓMO se comunica específicamente TU guardián contigo. Sus señales favoritas. Los momentos en que más activo está. Cómo distinguir su voz de tus pensamientos.

Es un manual de comunicación hecho a medida para ustedes dos.`,
    paraQuien: 'Para quienes quieren desarrollar comunicación consciente con su guardián.',
    requiereGuardian: true,
    campos: [
      { id: 'formas_comunicacion', tipo: 'multiselect', label: '¿De qué formas sentís que podría comunicarse?', opciones: ['Sueños', 'Sensaciones físicas', 'Pensamientos repentinos', 'Sincronicidades', 'A través de animales', 'Olores', 'Sonidos', 'Emociones repentinas'] },
      { id: 'momento_conexion', tipo: 'select', label: '¿En qué momento del día te sentís más receptiva?', opciones: ['Al despertar', 'Durante la mañana', 'Al mediodía', 'Por la tarde', 'Al anochecer', 'De noche', 'De madrugada'] },
      { id: 'bloqueo_comunicacion', tipo: 'textarea', label: '¿Qué creés que te bloquea para escucharlo?', placeholder: 'Dudas, miedos, distracciones...' }
    ],
    promptBase: `Creá una guía de comunicación personalizada entre {nombre} y su guardián {nombreGuardian}.

DATOS:
- Formas de comunicación que intuye: {formas_comunicacion}
- Momento más receptivo: {momento_conexion}
- Bloqueos percibidos: {bloqueo_comunicacion}

GUÍA DEBE INCLUIR:
1. Las 3 formas principales en que ESTE guardián se comunica
2. Cómo distinguir su voz de los pensamientos propios
3. Señales específicas que usa (describir cada una)
4. Ejercicio de apertura de canal (paso a paso)
5. Qué hacer cuando no lo escucha
6. Protocolo diario de conexión (5 minutos)
7. Palabras de activación sugeridas
8. Lo que el guardián quiere que sepa sobre comunicarse

Mínimo 550 palabras. Práctico y aplicable.`
  },

  {
    id: 'historia_guardian',
    nombre: 'La Historia de tu Guardián',
    categoria: 'guardianes',
    icono: '📖',
    runas: 55,
    tiempoMinutos: 60,
    descripcionCorta: 'Quién fue, de dónde viene, su historia milenaria',
    descripcionLarga: `Tu guardián tiene una historia. Miles de años de existencia. Lugares donde vivió. Otros humanos a quienes protegió. Batallas energéticas que libró. Momentos de alegría y de aprendizaje.

Este estudio canaliza la HISTORIA de tu guardián. De dónde viene. Cómo llegó al bosque de Uruguay. Qué lo hace único entre todos los duendes. Sus memorias más significativas.

Es como una biografía de tu protector.`,
    paraQuien: 'Para quienes quieren conocer profundamente a su guardián.',
    requiereGuardian: true,
    campos: [
      { id: 'caracteristicas_guardian', tipo: 'textarea', label: 'Describí a tu guardián: su apariencia, lo que transmite, su energía', placeholder: 'Todo lo que percibas de él...' },
      { id: 'nombre_historia', tipo: 'text', label: '¿Le pusiste un nombre o usás el original?', placeholder: 'El nombre con el que lo llamás' },
      { id: 'curiosidad_guardian', tipo: 'textarea', label: '¿Qué te gustaría saber de su historia?', placeholder: 'Qué te genera curiosidad de su pasado...' }
    ],
    promptBase: `Canalizá la historia completa del guardián {nombreGuardian} de {nombre}.

DESCRIPCIÓN ACTUAL:
- Características: {caracteristicas_guardian}
- Nombre usado: {nombre_historia}
- Curiosidad: {curiosidad_guardian}

HISTORIA DEBE INCLUIR:
1. Origen (dónde nació, hace cuántos años)
2. Su raza/tipo de duende y características únicas
3. El bosque original donde vivió
4. Cómo llegó al Bosque de Duendes del Uruguay
5. Otros humanos que protegió antes (1-2 historias)
6. Su mayor desafío como guardián
7. Lo que lo hace único entre los duendes
8. Un recuerdo que le es muy querido
9. Cómo se sintió cuando {nombre} lo eligió
10. Lo que sueña para el futuro juntos

Mínimo 800 palabras. Narrativa rica y emotiva.`
  },

  // ─────────────────────────────────────────────────────────────
  // REINO ELEMENTAL
  // ─────────────────────────────────────────────────────────────
  {
    id: 'elemento_dominante',
    nombre: 'Tu Elemento Dominante Oculto',
    categoria: 'elementales',
    icono: '🌀',
    runas: 25,
    tiempoMinutos: 25,
    descripcionCorta: 'Descubre qué elemento realmente te rige',
    descripcionLarga: `Todos tenemos un elemento que creemos que nos define. Pero a veces, el elemento que realmente nos rige está oculto, operando desde las sombras.

Este estudio va más allá de los tests superficiales. Analiza tu energía real, tus patrones de vida, tus reacciones instintivas. Y revela qué elemento está verdaderamente en tu núcleo.

Podrías sorprenderte.`,
    paraQuien: 'Para quienes quieren conocer su verdadera naturaleza elemental.',
    requiereGuardian: false,
    campos: [
      { id: 'elemento_creido', tipo: 'select', label: '¿Qué elemento siempre creíste que eras?', opciones: ['Fuego', 'Agua', 'Tierra', 'Aire', 'Ninguno en particular', 'Todos un poco'] },
      { id: 'reaccion_estres', tipo: 'select', label: 'Cuando estás bajo estrés, ¿qué hacés?', opciones: ['Exploto y después me calmo', 'Me cierro y proceso sola', 'Busco soluciones prácticas', 'Analizo y racionalizo', 'Me paralizo', 'Huyo o evito'] },
      { id: 'ambiente_preferido', tipo: 'select', label: '¿Dónde te sentís más vos?', opciones: ['Cerca del mar o ríos', 'En montañas o bosques', 'En lugares altos con viento', 'Cerca del fuego o sol', 'En la ciudad', 'En mi casa'] },
      { id: 'patron_relaciones', tipo: 'textarea', label: 'Describí el patrón que se repite en tus relaciones', placeholder: 'Cómo empiezan, cómo terminan, qué rol tomás...' }
    ],
    promptBase: `Revelá el elemento dominante oculto de {nombre}.

DATOS:
- Elemento que cree ser: {elemento_creido}
- Reacción al estrés: {reaccion_estres}
- Ambiente preferido: {ambiente_preferido}
- Patrón en relaciones: {patron_relaciones}

ANÁLISIS DEBE INCLUIR:
1. El elemento que muestra al mundo vs el elemento real
2. Por qué este elemento está oculto
3. Cómo se manifiesta en su vida sin que lo note
4. Fortalezas de este elemento en ella
5. Sombras de este elemento a trabajar
6. Cómo equilibrarlo con los otros elementos
7. Ritual de activación de su elemento real
8. Mensaje del elemental de ese elemento

Mínimo 500 palabras.`
  },

  {
    id: 'sanacion_elemental',
    nombre: 'Sanación con los 4 Elementos',
    categoria: 'elementales',
    icono: '🔥💧🌍💨',
    runas: 50,
    tiempoMinutos: 45,
    descripcionCorta: 'Protocolo de sanación usando fuego, agua, tierra y aire',
    descripcionLarga: `Cada elemento tiene poder sanador. El fuego transforma y purifica. El agua limpia y renueva. La tierra sostiene y nutre. El aire libera y despeja.

Este estudio crea un PROTOCOLO DE SANACIÓN personalizado usando los 4 elementos. No es genérico. Está diseñado específicamente para lo que necesitás sanar ahora.

Es medicina elemental hecha a tu medida.`,
    paraQuien: 'Para quienes necesitan sanación profunda y están dispuestas a trabajar con los elementos.',
    requiereGuardian: false,
    campos: [
      { id: 'que_sanar', tipo: 'textarea', label: '¿Qué necesitás sanar o soltar?', placeholder: 'Puede ser emocional, físico, mental o espiritual...' },
      { id: 'elemento_afinidad', tipo: 'select', label: '¿Con qué elemento tenés más afinidad?', opciones: ['Fuego', 'Agua', 'Tierra', 'Aire', 'Ninguno en particular'] },
      { id: 'elemento_resistencia', tipo: 'select', label: '¿Qué elemento te cuesta o evitás?', opciones: ['Fuego', 'Agua', 'Tierra', 'Aire', 'Ninguno en particular'] },
      { id: 'acceso_elementos', tipo: 'multiselect', label: '¿A qué tenés acceso fácil?', opciones: ['Velas/fuego', 'Mar/río/bañera', 'Jardín/tierra/plantas', 'Lugares abiertos con viento', 'Incienso/sahumerio'] }
    ],
    promptBase: `Creá un protocolo de sanación elemental para {nombre}.

NECESIDAD:
- Qué sanar: {que_sanar}
- Elemento de afinidad: {elemento_afinidad}
- Elemento de resistencia: {elemento_resistencia}
- Acceso a elementos: {acceso_elementos}

PROTOCOLO DEBE INCLUIR:
1. Diagnóstico elemental (qué elemento necesita más)
2. Ritual de FUEGO (transformación) - paso a paso
3. Ritual de AGUA (limpieza) - paso a paso
4. Ritual de TIERRA (anclaje) - paso a paso
5. Ritual de AIRE (liberación) - paso a paso
6. Orden sugerido y frecuencia
7. Señales de que está funcionando
8. Mensaje de los elementales para ella

Cada ritual debe ser práctico con materiales accesibles.
Mínimo 700 palabras.`
  },

  {
    id: 'elemental_personal',
    nombre: 'Conoce a tu Elemental Personal',
    categoria: 'elementales',
    icono: '🧚',
    runas: 35,
    tiempoMinutos: 35,
    descripcionCorta: 'El ser elemental que te acompaña',
    descripcionLarga: `Además de tu guardián duende, hay un ser elemental que te acompaña. Una salamandra de fuego, una ondina de agua, un gnomo de tierra, o una sílfide de aire.

Este estudio revela QUIÉN es este elemental, cómo se llama, qué aspecto tiene, y cómo trabaja contigo sin que lo notes.

Es conocer a otro miembro de tu equipo espiritual.`,
    paraQuien: 'Para quienes quieren expandir su conexión con seres de luz.',
    requiereGuardian: false,
    campos: [
      { id: 'conexion_naturaleza', tipo: 'textarea', label: '¿Cómo es tu relación con la naturaleza?', placeholder: 'Cuánto tiempo pasás en ella, qué te hace sentir...' },
      { id: 'experiencias_elementales', tipo: 'textarea', label: '¿Has tenido experiencias extrañas con elementos? (fuego que se mueve raro, agua que te "llama", etc.)', placeholder: 'Cualquier experiencia inusual...' },
      { id: 'suenos_naturaleza', tipo: 'textarea', label: '¿Sueños recurrentes con elementos naturales?', placeholder: 'Sueños con agua, fuego, volar, cuevas...' }
    ],
    promptBase: `Revelá el elemental personal de {nombre}.

DATOS:
- Relación con naturaleza: {conexion_naturaleza}
- Experiencias elementales: {experiencias_elementales}
- Sueños: {suenos_naturaleza}

ESTUDIO DEBE INCLUIR:
1. Tipo de elemental (salamandra/ondina/gnomo/sílfide)
2. Nombre del elemental
3. Descripción física detallada
4. Personalidad y temperamento
5. Cómo llegó a ella
6. Qué función cumple en su vida
7. Cómo se comunica con ella
8. Cómo fortalecer el vínculo
9. Un mensaje directo del elemental
10. Ofrenda que le gusta recibir

Mínimo 550 palabras. Descriptivo y mágico.`
  },

  // ─────────────────────────────────────────────────────────────
  // CRISTALOMANCIA
  // ─────────────────────────────────────────────────────────────
  {
    id: 'cristal_alma',
    nombre: 'El Cristal de tu Alma',
    categoria: 'cristales',
    icono: '💠',
    runas: 30,
    tiempoMinutos: 30,
    descripcionCorta: 'Descubre qué cristal está codificado en tu esencia',
    descripcionLarga: `Cada alma tiene un cristal. No es el cristal que te gusta. Es el cristal que ERES.

Este estudio revela qué cristal está codificado en tu esencia. El que resuena con tu frecuencia fundamental. El que si lo tuvieras cerca, amplificaría todo lo que sos.

No es coincidencia que ciertos cristales te atraigan. Es tu alma reconociéndose.`,
    paraQuien: 'Para quienes aman los cristales y quieren conocer su cristal principal.',
    requiereGuardian: false,
    campos: [
      { id: 'cristales_actuales', tipo: 'textarea', label: '¿Qué cristales tenés o te atraen?', placeholder: 'Los que tenés, los que te gustaría tener...' },
      { id: 'sensacion_cristales', tipo: 'select', label: '¿Qué sentís cuando tocás cristales?', opciones: ['Mucha energía/vibración', 'Calma y paz', 'No siento nada particular', 'Depende del cristal', 'Nunca he tocado conscientemente'] },
      { id: 'colores_preferidos', tipo: 'multiselect', label: '¿Qué colores te atraen más?', opciones: ['Transparente/blanco', 'Rosa', 'Verde', 'Azul', 'Morado', 'Negro', 'Dorado/amarillo', 'Naranja/rojo'] },
      { id: 'cualidad_buscada', tipo: 'select', label: '¿Qué cualidad buscás más en tu vida?', opciones: ['Amor', 'Protección', 'Claridad', 'Abundancia', 'Sanación', 'Intuición', 'Fuerza', 'Paz'] }
    ],
    promptBase: `Revelá el cristal del alma de {nombre}.

DATOS:
- Cristales actuales: {cristales_actuales}
- Sensación con cristales: {sensacion_cristales}
- Colores preferidos: {colores_preferidos}
- Cualidad buscada: {cualidad_buscada}

ESTUDIO DEBE INCLUIR:
1. El cristal de su alma (nombre específico)
2. Por qué este cristal y no otro
3. Propiedades de este cristal que resuenan con ella
4. Cómo su alma se refleja en este cristal
5. La historia del cristal y ella (conexión kármica)
6. Cómo trabajar con este cristal
7. Dónde colocarlo/usarlo
8. Ritual de activación con este cristal
9. Cristales complementarios para ella
10. Mensaje del espíritu del cristal

Mínimo 500 palabras.`
  },

  {
    id: 'grid_cristales',
    nombre: 'Tu Grid de Cristales Personal',
    categoria: 'cristales',
    icono: '🔷',
    runas: 40,
    tiempoMinutos: 40,
    descripcionCorta: 'Diseño de red de cristales para tu intención',
    descripcionLarga: `Los grids o redes de cristales son geometrías de poder. Cuando colocás cristales en ciertos patrones, su energía se multiplica exponencialmente.

Este estudio diseña un GRID PERSONALIZADO para tu intención específica. Qué cristales usar, en qué posición exacta, cómo activarlo, y cuánto tiempo mantenerlo.

Es arquitectura energética a tu medida.`,
    paraQuien: 'Para quienes trabajan con cristales y quieren potenciar una intención.',
    requiereGuardian: false,
    campos: [
      { id: 'intencion_grid', tipo: 'textarea', label: '¿Cuál es la intención para tu grid?', placeholder: 'Qué querés manifestar, sanar, proteger, atraer...' },
      { id: 'cristales_disponibles', tipo: 'textarea', label: '¿Qué cristales tenés disponibles?', placeholder: 'Listá todos los que tenés, aunque no sepas sus nombres...' },
      { id: 'espacio_grid', tipo: 'select', label: '¿Dónde colocarías el grid?', opciones: ['Altar', 'Mesa de noche', 'Escritorio', 'Centro de la casa', 'Jardín', 'Otro lugar especial'] },
      { id: 'tamaño_preferido', tipo: 'select', label: '¿Qué tamaño preferís?', opciones: ['Pequeño (cabe en la palma)', 'Mediano (un plato)', 'Grande (una mesa pequeña)'] }
    ],
    promptBase: `Diseñá un grid de cristales para {nombre}.

DATOS:
- Intención: {intencion_grid}
- Cristales disponibles: {cristales_disponibles}
- Ubicación: {espacio_grid}
- Tamaño: {tamaño_preferido}

DISEÑO DEBE INCLUIR:
1. Nombre del grid
2. Geometría base (describe la forma con ASCII o palabras)
3. Cristal central y por qué
4. Cristales secundarios y posición
5. Cristales amplificadores (puntas/terminaciones)
6. Instrucciones de armado paso a paso
7. Palabras de activación
8. Cuánto tiempo mantenerlo
9. Cómo saber que está funcionando
10. Qué hacer cuando cumple su propósito

Mínimo 550 palabras. Incluí un diagrama en ASCII si es posible.`
  },

  {
    id: 'limpieza_cristales',
    nombre: 'Protocolo de Limpieza de tus Cristales',
    categoria: 'cristales',
    icono: '✨',
    runas: 20,
    tiempoMinutos: 20,
    descripcionCorta: 'Cómo limpiar y recargar TUS cristales específicos',
    descripcionLarga: `No todos los cristales se limpian igual. Algunos aman el sol, otros se destruyen con él. Algunos necesitan agua, otros se disuelven.

Este protocolo está diseñado para TUS cristales específicos. Cómo limpiar cada uno, con qué frecuencia, y cómo recargarlos según tu energía.

Es un manual de cuidado para tu colección.`,
    paraQuien: 'Para quienes tienen cristales y quieren cuidarlos correctamente.',
    requiereGuardian: false,
    campos: [
      { id: 'lista_cristales', tipo: 'textarea', label: 'Listá todos tus cristales', placeholder: 'Todos los que tengas, aunque no sepas el nombre exacto...' },
      { id: 'uso_cristales', tipo: 'select', label: '¿Para qué usás principalmente tus cristales?', opciones: ['Meditación', 'Protección', 'Decoración/energía del hogar', 'Trabajo energético con otros', 'Los llevo conmigo', 'Varios usos'] },
      { id: 'metodos_conocidos', tipo: 'multiselect', label: '¿Qué métodos de limpieza conocés?', opciones: ['Agua', 'Sol', 'Luna', 'Sal', 'Sahumerio', 'Tierra', 'Sonido', 'Ninguno'] }
    ],
    promptBase: `Creá un protocolo de limpieza para los cristales de {nombre}.

CRISTALES:
{lista_cristales}

USO: {uso_cristales}
MÉTODOS CONOCIDOS: {metodos_conocidos}

PROTOCOLO DEBE INCLUIR:
1. Para cada cristal mencionado:
   - Método de limpieza recomendado
   - Métodos que debe EVITAR
   - Frecuencia de limpieza
   - Mejor momento para recargar

2. Calendario lunar de limpieza
3. Ritual general de limpieza grupal
4. Señales de que un cristal necesita limpieza
5. Cómo reconectarte con tus cristales después
6. Almacenamiento correcto

Mínimo 450 palabras. Específico para sus cristales.`
  },

  // ─────────────────────────────────────────────────────────────
  // TAROT Y ORÁCULOS
  // ─────────────────────────────────────────────────────────────
  {
    id: 'tarot_profundo',
    nombre: 'Lectura de Tarot Profunda',
    categoria: 'tarot',
    icono: '🎴',
    runas: 50,
    tiempoMinutos: 35,
    descripcionCorta: 'Tirada completa de 10 cartas',
    descripcionLarga: `Esta no es una tirada de tres cartas. Es una lectura profunda de 10 cartas que cubre pasado, presente, futuro, influencias, miedos, ambiente, consejos y resultado.

Cada carta es interpretada en contexto de TU situación específica. No son significados genéricos de libro.

Es como una conversación profunda con el tarot.`,
    paraQuien: 'Para quienes necesitan claridad completa sobre una situación.',
    requiereGuardian: false,
    campos: [
      { id: 'pregunta_tarot', tipo: 'textarea', label: '¿Cuál es tu pregunta o situación?', placeholder: 'Sé lo más específica posible...' },
      { id: 'area_consulta', tipo: 'select', label: '¿En qué área de vida?', opciones: ['Amor y relaciones', 'Trabajo y carrera', 'Dinero y abundancia', 'Salud y bienestar', 'Familia', 'Decisiones importantes', 'Espiritualidad', 'General'] },
      { id: 'tiempo_situacion', tipo: 'select', label: '¿Hace cuánto dura esta situación?', opciones: ['Es nueva (menos de 1 mes)', 'Reciente (1-6 meses)', 'Ya lleva tiempo (6 meses - 2 años)', 'Crónica (más de 2 años)', 'Acaba de aparecer'] },
      { id: 'intentos_previos', tipo: 'textarea', label: '¿Qué has intentado hasta ahora?', placeholder: 'Acciones que ya tomaste...' }
    ],
    promptBase: `Realizá una lectura de tarot profunda para {nombre}.

CONSULTA:
- Pregunta: {pregunta_tarot}
- Área: {area_consulta}
- Tiempo: {tiempo_situacion}
- Intentos previos: {intentos_previos}

TIRADA (elegí 10 cartas apropiadas y explicá):
1. Situación presente
2. Influencia pasada
3. Objetivo/lo que busca
4. Raíz/fundamento
5. Pasado reciente
6. Futuro próximo
7. Actitud de ella
8. Ambiente externo
9. Esperanzas y miedos
10. Resultado probable

Para cada carta:
- Nombre de la carta
- Si está al derecho o invertida
- Interpretación específica para su pregunta

CIERRE:
- Mensaje general de las cartas
- Consejo práctico
- Momento favorable para actuar

Mínimo 700 palabras.`
  },

  {
    id: 'oraculo_duendes',
    nombre: 'Oráculo de los Duendes',
    categoria: 'tarot',
    icono: '🍄',
    runas: 25,
    tiempoMinutos: 25,
    descripcionCorta: 'Mensaje a través del oráculo del bosque',
    descripcionLarga: `Los duendes tienen su propio sistema de adivinación. No usan cartas. Usan hojas, piedras, hongos, y los patrones del bosque.

Este oráculo canaliza un mensaje usando los símbolos del bosque de los duendes. Es una forma de adivinación que no encontrarás en ningún otro lugar.

Es el oráculo del Bosque de Duendes del Uruguay.`,
    paraQuien: 'Para quienes quieren una perspectiva única desde el mundo de los duendes.',
    requiereGuardian: false,
    campos: [
      { id: 'pregunta_oraculo', tipo: 'textarea', label: '¿Qué querés preguntarle al bosque?', placeholder: 'Tu pregunta para los duendes...' },
      { id: 'urgencia', tipo: 'select', label: '¿Qué tan urgente es esto para vos?', opciones: ['Muy urgente, necesito respuesta ya', 'Importante pero no urgente', 'Curiosidad general', 'Guía para el futuro lejano'] },
      { id: 'simbolo_atrae', tipo: 'select', label: '¿Qué símbolo del bosque te atrae más?', opciones: ['Hongos', 'Hojas', 'Piedras', 'Raíces', 'Flores', 'Animales pequeños', 'Agua/arroyos', 'Luz entre los árboles'] }
    ],
    promptBase: `Realizá una lectura del Oráculo de los Duendes para {nombre}.

PREGUNTA: {pregunta_oraculo}
URGENCIA: {urgencia}
SÍMBOLO QUE ATRAE: {simbolo_atrae}

ORÁCULO DEBE INCLUIR:
1. Preparación del oráculo (describe cómo los duendes leen)
2. Primer símbolo que apareció y significado
3. Segundo símbolo y significado
4. Tercer símbolo y significado
5. La combinación de los tres (mensaje central)
6. Lo que los duendes ven en su situación
7. Advertencia o precaución
8. Acción sugerida
9. Señal a buscar como confirmación
10. Momento favorable según el bosque

Mínimo 450 palabras. Muy visual y mágico.`
  },

  {
    id: 'carta_año',
    nombre: 'Tu Carta del Año',
    categoria: 'tarot',
    icono: '📆',
    runas: 40,
    tiempoMinutos: 30,
    descripcionCorta: 'El arcano que rige tu año personal',
    descripcionLarga: `Cada año tiene una carta de tarot que lo rige para vos. Se calcula con tu fecha de nacimiento y el año actual.

Pero más allá del cálculo, lo importante es CÓMO esta carta se manifestará en tu vida, qué lecciones trae, qué oportunidades y desafíos.

Este estudio profundiza en tu arcano del año.`,
    paraQuien: 'Para quienes quieren entender la energía de su año actual.',
    requiereGuardian: false,
    campos: [
      { id: 'fecha_nacimiento', tipo: 'date', label: 'Tu fecha de nacimiento' },
      { id: 'temas_año', tipo: 'textarea', label: '¿Qué temas están siendo importantes este año?', placeholder: 'Lo que ha estado presente en tu vida...' },
      { id: 'meta_año', tipo: 'textarea', label: '¿Cuál es tu mayor meta para este año?', placeholder: 'Lo que querés lograr o manifestar...' }
    ],
    promptBase: `Calculá y analizá la carta del año de {nombre}.

FECHA DE NACIMIENTO: {fecha_nacimiento}
TEMAS DEL AÑO: {temas_año}
META DEL AÑO: {meta_año}

ESTUDIO DEBE INCLUIR:
1. Cálculo de la carta del año (explicar proceso)
2. La carta resultante y su significado general
3. Cómo se ha manifestado ya en su año
4. Lo que viene en los próximos meses
5. Lección principal de esta carta para ella
6. Desafíos que traerá
7. Oportunidades a aprovechar
8. Meses clave y por qué
9. Cómo trabajar con esta energía
10. Mensaje de la carta para ella

Mínimo 500 palabras.`
  },

  // ─────────────────────────────────────────────────────────────
  // RUNAS NÓRDICAS
  // ─────────────────────────────────────────────────────────────
  {
    id: 'tirada_runas_3',
    nombre: 'Tirada de 3 Runas',
    categoria: 'runas',
    icono: 'ᚱ',
    runas: 25,
    tiempoMinutos: 20,
    descripcionCorta: 'Pasado, presente y futuro en runas',
    descripcionLarga: `Las runas nórdicas son uno de los sistemas de adivinación más antiguos. Cada símbolo contiene siglos de sabiduría.

Esta tirada de 3 runas te muestra el flujo de tu situación: de dónde viene, dónde está ahora, y hacia dónde se dirige.

Simple pero poderosa.`,
    paraQuien: 'Para quienes quieren una guía clara y concisa.',
    requiereGuardian: false,
    campos: [
      { id: 'pregunta_runas', tipo: 'textarea', label: '¿Sobre qué querés consultar?', placeholder: 'Tu pregunta o situación...' },
      { id: 'contexto_breve', tipo: 'textarea', label: 'Contexto breve', placeholder: 'Lo esencial que debo saber...' }
    ],
    promptBase: `Realizá una tirada de 3 runas para {nombre}.

PREGUNTA: {pregunta_runas}
CONTEXTO: {contexto_breve}

TIRADA:
1. RUNA 1 - PASADO (elegí una runa apropiada)
   - Nombre de la runa
   - Símbolo
   - Significado en esta posición
   - Cómo se relaciona con su pasado

2. RUNA 2 - PRESENTE
   - Nombre de la runa
   - Símbolo
   - Significado en esta posición
   - Qué está viviendo ahora

3. RUNA 3 - FUTURO
   - Nombre de la runa
   - Símbolo
   - Significado en esta posición
   - Hacia dónde va

SÍNTESIS:
- Mensaje general de las runas
- Consejo de los antiguos

Mínimo 400 palabras.`
  },

  {
    id: 'tirada_runas_9',
    nombre: 'Tirada de las 9 Runas',
    categoria: 'runas',
    icono: 'ᛟ',
    runas: 65,
    tiempoMinutos: 45,
    descripcionCorta: 'Lectura completa del destino rúnico',
    descripcionLarga: `La tirada de 9 runas es una de las más completas. Se lanzan las runas y se leen según dónde caen en un paño especial.

Esta lectura cubre todos los aspectos de tu situación: lo visible y lo oculto, tus aliados y obstáculos, el camino y el destino.

Es el oráculo completo de los nórdicos.`,
    paraQuien: 'Para situaciones complejas que necesitan análisis profundo.',
    requiereGuardian: false,
    campos: [
      { id: 'situacion_completa', tipo: 'textarea', label: 'Describí tu situación completa', placeholder: 'Todo lo que está pasando, personas involucradas, tus sentimientos...' },
      { id: 'pregunta_central', tipo: 'textarea', label: '¿Cuál es tu pregunta central?', placeholder: 'Lo que más necesitás saber...' },
      { id: 'obstaculos_percibidos', tipo: 'textarea', label: '¿Qué obstáculos percibís?', placeholder: 'Lo que creés que te frena...' }
    ],
    promptBase: `Realizá la tirada de las 9 runas para {nombre}.

SITUACIÓN: {situacion_completa}
PREGUNTA CENTRAL: {pregunta_central}
OBSTÁCULOS: {obstaculos_percibidos}

TIRADA (9 runas en sus posiciones):
1. Centro (tú misma)
2. Pasado inmediato
3. Futuro inmediato
4. Fundamento
5. Desafío
6. Influencia pasando
7. Tu actitud
8. Ambiente externo
9. Resultado

Para cada runa:
- Nombre y símbolo
- Posición (derecha/invertida)
- Significado en esa posición
- Cómo se relaciona con las otras runas cercanas

LECTURA INTEGRADA:
- El mensaje central
- Lo que debe hacer
- Lo que debe evitar
- Timing favorable
- Advertencia de los ancestros

Mínimo 750 palabras.`
  },

  {
    id: 'runa_personal',
    nombre: 'Tu Runa de Nacimiento',
    categoria: 'runas',
    icono: 'ᚨ',
    runas: 30,
    tiempoMinutos: 30,
    descripcionCorta: 'La runa que rige tu alma',
    descripcionLarga: `Así como hay signos zodiacales, hay runas de nacimiento. Una runa específica que resonaba el día que naciste.

Este estudio revela tu runa de nacimiento, qué significa para tu personalidad, tu destino, y cómo trabajar con ella.

Es descubrir tu símbolo ancestral.`,
    paraQuien: 'Para quienes quieren conocer su conexión con las runas.',
    requiereGuardian: false,
    campos: [
      { id: 'fecha_nac_runas', tipo: 'date', label: 'Tu fecha de nacimiento' },
      { id: 'atraccion_runas', tipo: 'textarea', label: '¿Hay alguna runa que siempre te atrajo? (aunque no sepas su nombre)', placeholder: 'Describila o decí que no...' },
      { id: 'caracteristica_principal', tipo: 'select', label: '¿Cómo te describirían tus amigos?', opciones: ['Fuerte y decidida', 'Sabia y tranquila', 'Creativa y libre', 'Protectora y leal', 'Intensa y apasionada', 'Misteriosa y profunda'] }
    ],
    promptBase: `Revelá la runa de nacimiento de {nombre}.

FECHA: {fecha_nac_runas}
RUNA QUE LE ATRAE: {atraccion_runas}
CARACTERÍSTICA PRINCIPAL: {caracteristica_principal}

ESTUDIO DEBE INCLUIR:
1. Su runa de nacimiento (nombre y símbolo)
2. Método de cálculo explicado
3. Significado general de la runa
4. Cómo se manifiesta en su personalidad
5. Fortalezas que da esta runa
6. Sombras a trabajar
7. Su destino según esta runa
8. Cómo activar su poder
9. Ritual con su runa
10. Cómo dibujarla/usarla

Mínimo 500 palabras.`
  },

  // ─────────────────────────────────────────────────────────────
  // ASTROLOGÍA Y CICLOS
  // ─────────────────────────────────────────────────────────────
  {
    id: 'luna_personal',
    nombre: 'Tu Luna Personal',
    categoria: 'astrologia',
    icono: '🌙',
    runas: 40,
    tiempoMinutos: 35,
    descripcionCorta: 'Análisis profundo de tu luna natal',
    descripcionLarga: `El sol muestra quién sos al mundo. La luna muestra quién sos en privado, con tus emociones, en tu vulnerabilidad.

Este estudio analiza tu luna natal: en qué signo está, en qué casa, qué aspectos forma. Y más importante: cómo influye en tu vida emocional, tus relaciones, tu maternidad interior.

Es conocer tu lado oculto.`,
    paraQuien: 'Para quienes quieren entender su mundo emocional.',
    requiereGuardian: false,
    campos: [
      { id: 'fecha_hora_lugar', tipo: 'text', label: 'Fecha, hora y lugar de nacimiento', placeholder: 'Ej: 15/03/1990, 14:30, Montevideo' },
      { id: 'relacion_emociones', tipo: 'select', label: '¿Cómo es tu relación con tus emociones?', opciones: ['Las siento muy intensamente', 'Me cuesta sentirlas', 'Son un torbellino', 'Las controlo bien', 'Depende del día'] },
      { id: 'relacion_madre', tipo: 'textarea', label: '¿Cómo fue/es tu relación con tu madre o figura materna?', placeholder: 'Breve descripción...' }
    ],
    promptBase: `Analizá la luna natal de {nombre}.

DATOS: {fecha_hora_lugar}
RELACIÓN CON EMOCIONES: {relacion_emociones}
RELACIÓN CON MADRE: {relacion_madre}

ANÁLISIS DEBE INCLUIR:
1. Signo lunar y qué significa
2. Casa lunar y su influencia
3. Aspectos principales de la luna
4. Cómo procesa emociones
5. Qué necesita para sentirse segura
6. Patrón en relaciones (qué busca emocionalmente)
7. Relación con lo femenino/maternal
8. Cómo nutrirse a sí misma
9. Su lado oscuro lunar (shadow)
10. Ritual lunar personalizado

Mínimo 600 palabras.`
  },

  {
    id: 'ciclo_lunar_mes',
    nombre: 'Tu Mes Lunar',
    categoria: 'astrologia',
    icono: '🌑🌓🌕🌗',
    runas: 45,
    tiempoMinutos: 40,
    descripcionCorta: 'Guía completa del mes según las fases lunares',
    descripcionLarga: `La luna cambia cada semana. Y con ella, tu energía, tus emociones, tu capacidad de manifestar.

Este estudio crea una GUÍA COMPLETA del mes lunar para vos. Qué hacer en cada fase, qué evitar, cuándo iniciar proyectos, cuándo soltar.

Es tu agenda lunar personalizada.`,
    paraQuien: 'Para quienes quieren vivir en sincronía con la luna.',
    requiereGuardian: false,
    campos: [
      { id: 'mes_consulta', tipo: 'select', label: '¿Para qué mes?', opciones: ['Este mes actual', 'El próximo mes'] },
      { id: 'proyectos_actuales', tipo: 'textarea', label: '¿Qué proyectos o temas tenés activos?', placeholder: 'Lo que estás trabajando, creando, soltando...' },
      { id: 'signo_solar', tipo: 'select', label: 'Tu signo solar', opciones: ['Aries', 'Tauro', 'Géminis', 'Cáncer', 'Leo', 'Virgo', 'Libra', 'Escorpio', 'Sagitario', 'Capricornio', 'Acuario', 'Piscis'] }
    ],
    promptBase: `Creá la guía lunar del mes para {nombre}.

MES: {mes_consulta}
PROYECTOS: {proyectos_actuales}
SIGNO SOLAR: {signo_solar}

GUÍA DEBE INCLUIR:
1. Resumen energético del mes lunar
2. LUNA NUEVA (fecha):
   - Tema para iniciar
   - Ritual sugerido
   - Qué sembrar (metafóricamente)

3. CUARTO CRECIENTE (fecha):
   - Acción a tomar
   - Desafíos a superar
   - Qué ajustar

4. LUNA LLENA (fecha):
   - Qué se revela
   - Qué soltar
   - Ritual de liberación

5. CUARTO MENGUANTE (fecha):
   - Qué revisar
   - Cómo cerrar ciclos
   - Preparación para lo nuevo

6. Días más favorables del mes y para qué
7. Días a cuidarse
8. Cómo aprovechar este mes para sus proyectos específicos

Mínimo 650 palabras. Incluí fechas reales.`
  },

  // ─────────────────────────────────────────────────────────────
  // LECTURAS ENERGÉTICAS
  // ─────────────────────────────────────────────────────────────
  {
    id: 'lectura_aura',
    nombre: 'Lectura de Aura',
    categoria: 'energia',
    icono: '🌈',
    runas: 40,
    tiempoMinutos: 35,
    descripcionCorta: 'Análisis completo de tu campo energético',
    descripcionLarga: `Tu aura es el campo de energía que te rodea. Tiene colores, capas, manchas, brillos. Todo tiene significado.

Esta lectura analiza tu aura tal como está AHORA. Qué colores predominan, qué indican sobre tu estado, qué bloqueos hay, qué fortalezas brillan.

Es una radiografía energética.`,
    paraQuien: 'Para quienes quieren conocer su estado energético actual.',
    requiereGuardian: false,
    campos: [
      { id: 'estado_actual', tipo: 'textarea', label: '¿Cómo te sentís física, emocional y mentalmente?', placeholder: 'Tu estado general...' },
      { id: 'colores_atraccion', tipo: 'multiselect', label: '¿Qué colores te atraen últimamente?', opciones: ['Blanco', 'Morado', 'Azul', 'Verde', 'Amarillo', 'Naranja', 'Rojo', 'Rosa', 'Dorado', 'Negro'] },
      { id: 'sensaciones_fisicas', tipo: 'textarea', label: '¿Tenés sensaciones físicas particulares? (hormigueos, frío/calor, pesadez)', placeholder: 'Lo que siente tu cuerpo...' },
      { id: 'ambiente_frecuente', tipo: 'select', label: '¿Dónde pasás más tiempo?', opciones: ['En casa sola', 'En casa con familia', 'En oficina/trabajo', 'En muchos lugares diferentes', 'En la naturaleza'] }
    ],
    promptBase: `Realizá una lectura de aura para {nombre}.

DATOS:
- Estado actual: {estado_actual}
- Colores que atraen: {colores_atraccion}
- Sensaciones físicas: {sensaciones_fisicas}
- Ambiente frecuente: {ambiente_frecuente}

LECTURA DEBE INCLUIR:
1. Color principal del aura y significado
2. Colores secundarios presentes
3. Estado de cada capa:
   - Capa física
   - Capa emocional
   - Capa mental
   - Capa espiritual
4. Zonas de luz (fortalezas)
5. Zonas de sombra (bloqueos)
6. Influencias externas detectadas
7. Recomendaciones para cada capa
8. Cómo fortalecer el aura
9. Colores que debe usar/evitar
10. Próximos pasos energéticos

Mínimo 600 palabras.`
  },

  {
    id: 'corte_cordones',
    nombre: 'Análisis de Cordones Energéticos',
    categoria: 'energia',
    icono: '⛓️',
    runas: 55,
    tiempoMinutos: 45,
    descripcionCorta: 'Detecta y corta conexiones energéticas dañinas',
    descripcionLarga: `Estamos conectados energéticamente a muchas personas. Algunos cordones son sanos (amor, amistad genuina). Otros son tóxicos (dependencia, manipulación, vampirismo energético).

Este estudio detecta qué cordones tenés, con quiénes, y cuáles necesitan ser cortados. Incluye el ritual de corte.

Es una limpieza relacional profunda.`,
    paraQuien: 'Para quienes sienten que algo les drena energía o los ata a alguien.',
    requiereGuardian: false,
    campos: [
      { id: 'personas_peso', tipo: 'textarea', label: '¿Con quién sentís un peso o conexión intensa? (no tiene que ser negativa)', placeholder: 'Personas que ocupan mucho espacio mental/emocional...' },
      { id: 'sintomas_cordon', tipo: 'multiselect', label: '¿Qué síntomas tenés?', opciones: ['Pienso mucho en alguien', 'Siento la energía de alguien a distancia', 'Me dreno después de ver a alguien', 'Sueño con alguien frecuentemente', 'Siento culpa si no hablo con alguien', 'Dependencia emocional'] },
      { id: 'relaciones_cerradas', tipo: 'textarea', label: '¿Hay relaciones que terminaron pero siguen presentes?', placeholder: 'Ex parejas, amistades rotas, familiares distanciados...' }
    ],
    promptBase: `Analizá los cordones energéticos de {nombre}.

DATOS:
- Personas con peso: {personas_peso}
- Síntomas: {sintomas_cordon}
- Relaciones cerradas: {relaciones_cerradas}

ANÁLISIS DEBE INCLUIR:
1. Explicación de qué son los cordones
2. Cordones detectados (3-5):
   - Con quién
   - Tipo de cordón
   - Dónde se conecta en su cuerpo
   - Si es sano o tóxico
   - Qué transmite ese cordón
3. Cordones a mantener y por qué
4. Cordones a cortar y por qué
5. RITUAL DE CORTE (paso a paso detallado):
   - Preparación
   - Protección
   - Palabras de corte
   - Sanación post-corte
6. Cómo evitar reconectar
7. Señales de que el corte fue exitoso

Mínimo 700 palabras. Incluí ritual completo.`
  },

  {
    id: 'chakras_estado',
    nombre: 'Estado de tus Chakras',
    categoria: 'energia',
    icono: '🔴🟠🟡🟢🔵🟣',
    runas: 50,
    tiempoMinutos: 40,
    descripcionCorta: 'Diagnóstico completo de tus 7 centros energéticos',
    descripcionLarga: `Los chakras son vórtices de energía en tu cuerpo. Cuando están equilibrados, todo fluye. Cuando están bloqueados, aparecen problemas físicos, emocionales, mentales.

Este estudio analiza cada uno de tus 7 chakras: su estado actual, qué lo bloquea, cómo sanarlo.

Es un chequeo energético completo.`,
    paraQuien: 'Para quienes quieren un diagnóstico energético integral.',
    requiereGuardian: false,
    campos: [
      { id: 'sintomas_fisicos', tipo: 'textarea', label: '¿Tenés algún síntoma físico recurrente?', placeholder: 'Dolores, tensiones, problemas de salud...' },
      { id: 'patron_emocional', tipo: 'textarea', label: '¿Cuál es tu patrón emocional más frecuente?', placeholder: 'Ansiedad, tristeza, enojo, miedo...' },
      { id: 'area_trabada', tipo: 'select', label: '¿Qué área de tu vida sentís más trabada?', opciones: ['Supervivencia/dinero', 'Relaciones/sexualidad', 'Poder personal/autoestima', 'Amor/relaciones profundas', 'Comunicación/expresión', 'Intuición/claridad', 'Conexión espiritual'] },
      { id: 'trabajo_previo', tipo: 'select', label: '¿Has trabajado con chakras antes?', opciones: ['Nunca', 'Un poco', 'Regularmente', 'Mucho'] }
    ],
    promptBase: `Analizá el estado de los chakras de {nombre}.

DATOS:
- Síntomas físicos: {sintomas_fisicos}
- Patrón emocional: {patron_emocional}
- Área trabada: {area_trabada}
- Trabajo previo: {trabajo_previo}

ANÁLISIS POR CHAKRA (para cada uno):
1. RAÍZ (Muladhara)
2. SACRO (Svadhisthana)
3. PLEXO SOLAR (Manipura)
4. CORAZÓN (Anahata)
5. GARGANTA (Vishuddha)
6. TERCER OJO (Ajna)
7. CORONA (Sahasrara)

Para cada uno incluir:
- Estado actual (abierto/bloqueado/hiperactivo)
- Síntomas asociados
- Causa probable
- Ejercicio específico de sanación
- Cristal recomendado
- Afirmación personalizada

CIERRE:
- Chakra prioritario a trabajar
- Secuencia de sanación sugerida

Mínimo 800 palabras.`
  },

  // ─────────────────────────────────────────────────────────────
  // ESTUDIOS DEL ALMA
  // ─────────────────────────────────────────────────────────────
  {
    id: 'mision_alma',
    nombre: 'La Misión de tu Alma',
    categoria: 'alma',
    icono: '🦋',
    runas: 200,
    tiempoMinutos: 60,
    descripcionCorta: 'Descubre para qué viniste a esta vida',
    descripcionLarga: `Tu alma eligió venir. Eligió esta familia, este cuerpo, esta época. ¿Por qué?

Este estudio profundo revela la misión de tu alma en esta vida. No tu propósito de carrera. Tu propósito de ALMA. Lo que viniste a aprender, a sanar, a aportar.

Es una de las lecturas más transformadoras que existe.`,
    paraQuien: 'Para quienes buscan sentido y propósito profundo.',
    requiereGuardian: false,
    campos: [
      { id: 'fecha_nacimiento_mision', tipo: 'date', label: 'Tu fecha de nacimiento' },
      { id: 'preguntas_existenciales', tipo: 'textarea', label: '¿Qué preguntas existenciales te persiguen?', placeholder: 'Lo que te preguntás sobre la vida, tu lugar, tu sentido...' },
      { id: 'patrones_vida', tipo: 'textarea', label: '¿Qué patrones se repiten en tu vida? (situaciones, tipos de personas, desafíos)', placeholder: 'Lo que vuelve una y otra vez...' },
      { id: 'momentos_conexion', tipo: 'textarea', label: '¿En qué momentos sentís que "estás donde tenés que estar"?', placeholder: 'Cuándo sentís propósito o plenitud...' }
    ],
    promptBase: `Revelá la misión del alma de {nombre}.

DATOS:
- Fecha: {fecha_nacimiento_mision}
- Preguntas existenciales: {preguntas_existenciales}
- Patrones de vida: {patrones_vida}
- Momentos de conexión: {momentos_conexion}

ESTUDIO DEBE INCLUIR:
1. El número del alma y significado
2. La misión principal (clara, en una frase)
3. Por qué eligió esta familia
4. Por qué eligió esta época
5. Los 3 aprendizajes principales de esta vida
6. Lo que viene a sanar de otras vidas
7. Lo que viene a aportar al mundo
8. Señales de que está cumpliendo su misión
9. Señales de que se está desviando
10. Cómo alinearse más con su propósito
11. Mensaje de su Yo Superior

Mínimo 750 palabras. Profundo y revelador.`
  },

  {
    id: 'contratos_alma',
    nombre: 'Contratos del Alma',
    categoria: 'alma',
    icono: '📜',
    runas: 180,
    tiempoMinutos: 75,
    descripcionCorta: 'Los acuerdos que hiciste antes de nacer',
    descripcionLarga: `Antes de nacer, tu alma hizo acuerdos. Con otras almas que serían tu familia. Con tu cuerpo. Con el universo.

Este estudio revela los CONTRATOS que tu alma firmó antes de encarnar. Algunos te sirven. Otros te limitan y ya cumplieron su función.

Incluye la revisión y posibilidad de revocar contratos obsoletos.`,
    paraQuien: 'Para quienes sienten que algo invisible los ata o limita.',
    requiereGuardian: false,
    campos: [
      { id: 'relacion_familia', tipo: 'textarea', label: 'Describí tu relación con tu familia de origen', placeholder: 'Padres, hermanos, dinámicas...' },
      { id: 'patrones_repetidos', tipo: 'textarea', label: '¿Qué situaciones se repiten aunque no quieras?', placeholder: 'Patrones que no podés romper...' },
      { id: 'promesas_inconscientes', tipo: 'textarea', label: '¿Hay algo que sentís que "prometiste" o "debés" aunque no recuerdes hacerlo?', placeholder: 'Obligaciones inexplicables...' },
      { id: 'bloqueo_principal', tipo: 'textarea', label: '¿Cuál es el bloqueo más grande en tu vida que no lográs superar?', placeholder: 'Eso que siempre te frena...' }
    ],
    promptBase: `Revelá los contratos del alma de {nombre}.

DATOS:
- Relación familiar: {relacion_familia}
- Patrones repetidos: {patrones_repetidos}
- Promesas inconscientes: {promesas_inconscientes}
- Bloqueo principal: {bloqueo_principal}

ESTUDIO DEBE INCLUIR:
1. Explicación de qué son los contratos del alma
2. CONTRATO CON MADRE/FIGURA MATERNA:
   - Acuerdo original
   - Lección involucrada
   - Estado actual
3. CONTRATO CON PADRE/FIGURA PATERNA:
   - Igual estructura
4. CONTRATO DE PAREJA (si aplica):
   - Acuerdo kármico
   - Propósito
5. CONTRATO CONSIGO MISMA:
   - Limitaciones auto-impuestas
   - Origen
6. Contratos vencidos que necesita revocar
7. RITUAL DE REVOCACIÓN (paso a paso):
   - Preparación
   - Declaración de revocación
   - Sanación
   - Nuevas afirmaciones
8. Cómo saber que el contrato fue revocado

Mínimo 850 palabras.`
  },

  {
    id: 'vidas_pasadas',
    nombre: 'Ecos de Vidas Pasadas',
    categoria: 'alma',
    icono: '🌀',
    runas: 300,
    tiempoMinutos: 90,
    descripcionCorta: 'Vidas anteriores que afectan tu presente',
    descripcionLarga: `No es tu primera vez. Tu alma ha vivido antes. Y esas vidas dejaron marcas.

Este estudio canaliza 2-3 vidas pasadas relevantes para tu presente. No cualquier vida: las que están afectando lo que vivís AHORA. Miedos, talentos, atracciones, rechazos inexplicables.

Es un viaje a través del tiempo de tu alma.`,
    paraQuien: 'Para quienes quieren entender el origen profundo de sus patrones.',
    requiereGuardian: false,
    campos: [
      { id: 'miedos_inexplicables', tipo: 'textarea', label: '¿Tenés miedos que no tienen explicación en esta vida?', placeholder: 'Fobias, aversiones sin razón aparente...' },
      { id: 'talentos_naturales', tipo: 'textarea', label: '¿Qué te sale naturalmente sin haberlo aprendido?', placeholder: 'Habilidades innatas...' },
      { id: 'epocas_atraccion', tipo: 'textarea', label: '¿Hay épocas históricas o lugares que te atraen mucho?', placeholder: 'Períodos, culturas, países...' },
      { id: 'suenos_recurrentes', tipo: 'textarea', label: '¿Tenés sueños recurrentes que parecen de otra época?', placeholder: 'Sueños que se repiten...' }
    ],
    promptBase: `Canalizá las vidas pasadas de {nombre}.

DATOS:
- Miedos inexplicables: {miedos_inexplicables}
- Talentos naturales: {talentos_naturales}
- Épocas que atraen: {epocas_atraccion}
- Sueños recurrentes: {suenos_recurrentes}

ESTUDIO DEBE INCLUIR:
1. VIDA PASADA #1:
   - Época y lugar
   - Quién era (género, rol, situación)
   - Eventos significativos
   - Cómo terminó
   - Qué karma dejó
   - Cómo afecta su presente

2. VIDA PASADA #2:
   - Misma estructura

3. VIDA PASADA #3 (si es relevante):
   - Misma estructura

4. Conexiones entre las vidas
5. Personas actuales que aparecen en vidas pasadas
6. Karma pendiente a trabajar
7. Dones traídos de otras vidas
8. Ritual de sanación de memorias pasadas
9. Mensaje de su alma sobre estas vidas

Mínimo 900 palabras. Narrativo y detallado.`
  },

  // ─────────────────────────────────────────────────────────────
  // PROTECCIÓN Y LIMPIEZA
  // ─────────────────────────────────────────────────────────────
  {
    id: 'escudo_protector',
    nombre: 'Tu Escudo Protector Personal',
    categoria: 'proteccion',
    icono: '🛡️',
    runas: 40,
    tiempoMinutos: 35,
    descripcionCorta: 'Diseño de protección energética a medida',
    descripcionLarga: `No todos necesitan la misma protección. Depende de tu energía, tu ambiente, lo que enfrentás.

Este estudio diseña un ESCUDO PROTECTOR personalizado para vos. Qué técnicas usar, qué símbolos te protegen, cómo mantener la protección activa.

Es tu armadura energética a medida.`,
    paraQuien: 'Para quienes se sienten vulnerables o están en ambientes densos.',
    requiereGuardian: false,
    campos: [
      { id: 'de_que_protegerse', tipo: 'multiselect', label: '¿De qué sentís que necesitás protegerte?', opciones: ['Energías de otras personas', 'Lugares densos', 'Entidades', 'Mi propia negatividad', 'Envidia/mal de ojo', 'Vampirismo energético', 'Ambientes laborales'] },
      { id: 'sensibilidad', tipo: 'select', label: '¿Qué tan sensible sos energéticamente?', opciones: ['Muy sensible (siento todo)', 'Bastante sensible', 'Normal', 'Poco sensible', 'No sé'] },
      { id: 'protecciones_actuales', tipo: 'textarea', label: '¿Qué usás actualmente para protegerte?', placeholder: 'Cristales, rituales, oraciones...' },
      { id: 'situacion_puntual', tipo: 'textarea', label: '¿Hay alguna situación puntual que te preocupe?', placeholder: 'Algo específico de lo que protegerte...' }
    ],
    promptBase: `Diseñá el escudo protector de {nombre}.

DATOS:
- Protección necesaria: {de_que_protegerse}
- Nivel de sensibilidad: {sensibilidad}
- Protecciones actuales: {protecciones_actuales}
- Situación puntual: {situacion_puntual}

ESCUDO DEBE INCLUIR:
1. Diagnóstico de vulnerabilidades
2. PROTECCIÓN FÍSICA:
   - Objetos protectores recomendados
   - Dónde colocarlos
   - Cómo activarlos
3. PROTECCIÓN ENERGÉTICA:
   - Técnica de escudo personalizada (paso a paso)
   - Visualización específica
   - Palabras de poder
4. PROTECCIÓN DIARIA:
   - Rutina de 3 minutos de activación
   - Cuándo renovar
5. PROTECCIÓN DE EMERGENCIA:
   - Qué hacer si se siente atacada
   - Técnica rápida
6. Símbolos protectores específicos para ella
7. Mantenimiento del escudo

Mínimo 600 palabras. Práctico y aplicable.`
  },

  {
    id: 'limpieza_casa',
    nombre: 'Limpieza Energética del Hogar',
    categoria: 'proteccion',
    icono: '🏠',
    runas: 45,
    tiempoMinutos: 40,
    descripcionCorta: 'Protocolo completo para limpiar tu espacio',
    descripcionLarga: `Tu casa acumula energía. De vos, de quienes viven ahí, de quienes visitan, de lo que pasó entre esas paredes.

Este estudio analiza tu hogar energéticamente y crea un PROTOCOLO DE LIMPIEZA completo y personalizado. Habitación por habitación.

Es una renovación energética total de tu espacio.`,
    paraQuien: 'Para quienes sienten su hogar pesado o quieren renovar la energía.',
    requiereGuardian: false,
    campos: [
      { id: 'tipo_hogar', tipo: 'select', label: '¿Qué tipo de hogar es?', opciones: ['Departamento', 'Casa', 'Habitación alquilada', 'Casa compartida', 'Otro'] },
      { id: 'habitantes', tipo: 'textarea', label: '¿Quiénes viven ahí?', placeholder: 'Personas, mascotas, descripciones breves...' },
      { id: 'zonas_densas', tipo: 'textarea', label: '¿Hay zonas que sientas más densas o incómodas?', placeholder: 'Habitaciones, rincones...' },
      { id: 'historia_lugar', tipo: 'textarea', label: '¿Sabés algo de la historia del lugar?', placeholder: 'Anteriores habitantes, eventos, antigüedad...' },
      { id: 'materiales_disponibles', tipo: 'multiselect', label: '¿Qué materiales tenés?', opciones: ['Sahumerio/incienso', 'Sal', 'Velas', 'Cristales', 'Campana/sonido', 'Plantas', 'Agua florida'] }
    ],
    promptBase: `Creá el protocolo de limpieza del hogar de {nombre}.

DATOS:
- Tipo: {tipo_hogar}
- Habitantes: {habitantes}
- Zonas densas: {zonas_densas}
- Historia: {historia_lugar}
- Materiales: {materiales_disponibles}

PROTOCOLO DEBE INCLUIR:
1. Diagnóstico energético del hogar
2. PREPARACIÓN:
   - Mejor día/hora para limpiar
   - Preparación personal
   - Preparación del espacio
3. LIMPIEZA GENERAL (paso a paso):
   - Orden de habitaciones
   - Técnica base
   - Palabras a usar
4. ZONAS ESPECIALES:
   - Tratamiento para zonas densas
   - Esquinas y rincones
   - Entradas
5. PROTECCIÓN POST-LIMPIEZA:
   - Sellado de la casa
   - Protecciones permanentes
6. MANTENIMIENTO:
   - Frecuencia de limpieza
   - Limpieza express semanal
7. Señales de que necesita limpieza
8. Mensaje de los guardianes del hogar

Mínimo 700 palabras.`
  },

  {
    id: 'deteccion_influencias',
    nombre: 'Detección de Influencias Negativas',
    categoria: 'proteccion',
    icono: '👁️',
    runas: 55,
    tiempoMinutos: 50,
    descripcionCorta: '¿Hay algo afectándote negativamente?',
    descripcionLarga: `A veces sentimos que "algo anda mal" pero no sabemos qué. Puede ser energía acumulada, influencias de otros, o algo más sutil.

Este estudio investiga si hay alguna influencia negativa afectándote, de dónde viene, y cómo neutralizarla.

Es un diagnóstico completo de interferencias.`,
    paraQuien: 'Para quienes sienten que algo los afecta pero no saben qué.',
    requiereGuardian: false,
    campos: [
      { id: 'sintomas_negativos', tipo: 'multiselect', label: '¿Qué síntomas tenés?', opciones: ['Mala suerte repentina', 'Cansancio extremo sin razón', 'Pesadillas frecuentes', 'Peleas constantes', 'Problemas de dinero repentinos', 'Enfermedades sin explicación', 'Sensación de presencia', 'Pensamientos oscuros que no son míos'] },
      { id: 'inicio_sintomas', tipo: 'textarea', label: '¿Cuándo empezó y qué pasaba en tu vida?', placeholder: 'Hace cuánto y contexto...' },
      { id: 'sospechas', tipo: 'textarea', label: '¿Sospechás de alguien o algo? (opcional)', placeholder: 'Si tenés alguna intuición...' },
      { id: 'cosas_raras', tipo: 'textarea', label: '¿Han pasado cosas raras que quieras mencionar?', placeholder: 'Eventos extraños, objetos que aparecen, etc...' }
    ],
    promptBase: `Realizá detección de influencias negativas para {nombre}.

DATOS:
- Síntomas: {sintomas_negativos}
- Inicio: {inicio_sintomas}
- Sospechas: {sospechas}
- Eventos extraños: {cosas_raras}

ANÁLISIS DEBE INCLUIR:
1. Evaluación inicial (¿hay algo o no?)
2. Si HAY algo:
   - Tipo de influencia detectada
   - Origen probable
   - Intensidad (leve/moderada/fuerte)
   - Desde cuándo está activa
   - Cómo entró
3. Si NO hay nada:
   - Explicación de los síntomas
   - Qué hacer igualmente
4. PROTOCOLO DE NEUTRALIZACIÓN:
   - Paso 1: Preparación
   - Paso 2: Limpieza personal
   - Paso 3: Corte de la influencia
   - Paso 4: Sanación
   - Paso 5: Protección
5. Prevención futura
6. Cuándo consultar a alguien presencial
7. Mensaje de protección

IMPORTANTE: Ser cuidadoso, no generar miedo innecesario.
Mínimo 700 palabras.`
  },

  // ─────────────────────────────────────────────────────────────
  // AMOR Y RELACIONES
  // ─────────────────────────────────────────────────────────────
  {
    id: 'lectura_amor_actual',
    nombre: 'Tu Situación Amorosa Actual',
    categoria: 'amor',
    icono: '💗',
    runas: 45,
    tiempoMinutos: 40,
    descripcionCorta: 'Análisis profundo de tu vida amorosa',
    descripcionLarga: `¿Qué está pasando realmente en tu vida amorosa? Más allá de lo que ves, hay energías, patrones y posibilidades que se te escapan.

Este estudio analiza tu situación amorosa actual: lo que sentís, lo que el otro siente (si hay otro), los obstáculos invisibles y las oportunidades que se abren.

Es ver tu amor con ojos de sabiduría.`,
    paraQuien: 'Para quienes quieren claridad sobre su situación de pareja o soledad.',
    requiereGuardian: false,
    campos: [
      { id: 'estado_actual_amor', tipo: 'select', label: '¿Cuál es tu situación actual?', opciones: ['En pareja estable', 'En pareja con problemas', 'Separándome', 'Soltera buscando', 'Soltera sin buscar', 'Situación complicada'] },
      { id: 'tiempo_situacion', tipo: 'select', label: '¿Hace cuánto estás en esta situación?', opciones: ['Menos de un mes', '1-6 meses', '6 meses - 2 años', 'Más de 2 años'] },
      { id: 'que_sientes', tipo: 'textarea', label: '¿Qué sentís respecto al amor en tu vida?', placeholder: 'Tus emociones, frustraciones, esperanzas...' },
      { id: 'pregunta_amor', tipo: 'textarea', label: '¿Qué querés saber específicamente?', placeholder: 'Tu pregunta sobre tu vida amorosa...' }
    ],
    promptBase: `Analizá la situación amorosa actual de {nombre}.

DATOS:
- Estado: {estado_actual_amor}
- Tiempo: {tiempo_situacion}
- Lo que siente: {que_sientes}
- Pregunta: {pregunta_amor}

ANÁLISIS DEBE INCLUIR:
1. Lectura energética de su corazón actual
2. Si hay pareja: qué siente la otra persona (energéticamente)
3. Patrones de amor que repite
4. Bloqueos que impiden el amor pleno
5. Lo que su corazón realmente desea (aunque no lo admita)
6. Respuesta específica a su pregunta
7. Predicción energética (próximos 3 meses)
8. Consejo de los guardianes del amor
9. Ritual para desbloquear el amor

Mínimo 600 palabras.`
  },

  {
    id: 'compatibilidad_pareja',
    nombre: 'Compatibilidad de Pareja',
    categoria: 'amor',
    icono: '💞',
    runas: 55,
    tiempoMinutos: 50,
    descripcionCorta: 'Análisis energético de dos personas',
    descripcionLarga: `¿Son realmente compatibles? No hablamos de signos zodiacales genéricos. Hablamos de ENERGÍAS, de vibración, de propósito compartido.

Este estudio analiza la compatibilidad real entre vos y otra persona. Dónde fluyen, dónde chocan, qué vienen a enseñarse mutuamente, y si tienen futuro.

Es radiografiar la conexión.`,
    paraQuien: 'Para quienes quieren entender la dinámica profunda con otra persona.',
    requiereGuardian: false,
    campos: [
      { id: 'tu_fecha', tipo: 'date', label: 'Tu fecha de nacimiento' },
      { id: 'fecha_otro', tipo: 'date', label: 'Fecha de nacimiento de la otra persona' },
      { id: 'relacion_actual', tipo: 'select', label: '¿Qué relación tienen actualmente?', opciones: ['Pareja formal', 'Saliendo/conociendo', 'Amistad con tensión', 'Ex que volvió', 'Todavía no hay nada', 'Situación complicada'] },
      { id: 'lo_que_ves', tipo: 'textarea', label: '¿Qué ves en esta relación? (lo bueno y lo difícil)', placeholder: 'Tu percepción de la dinámica...' }
    ],
    promptBase: `Analizá la compatibilidad entre {nombre} y su persona de interés.

DATOS:
- Fecha de {nombre}: {tu_fecha}
- Fecha de la otra persona: {fecha_otro}
- Relación actual: {relacion_actual}
- Percepción: {lo_que_ves}

ANÁLISIS DEBE INCLUIR:
1. Análisis numerológico de compatibilidad
2. Compatibilidad emocional
3. Compatibilidad mental
4. Compatibilidad espiritual
5. Compatibilidad física/pasional
6. Dónde fluyen naturalmente
7. Puntos de fricción y cómo manejarlos
8. Lección kármica entre ambos
9. Probabilidad de éxito (honesto)
10. Consejo para la relación

Mínimo 650 palabras.`
  },

  {
    id: 'sanar_corazon_roto',
    nombre: 'Sanar un Corazón Roto',
    categoria: 'amor',
    icono: '💔',
    runas: 60,
    tiempoMinutos: 55,
    descripcionCorta: 'Proceso de sanación después de una ruptura',
    descripcionLarga: `El dolor de un corazón roto es real. No es exageración. Es una herida profunda que necesita atención.

Este estudio no te dice que "lo superes". Te acompaña en el proceso REAL de sanación. Entiende tu dolor, valida tu proceso, y te guía hacia la reconstrucción.

Es sanación amorosa profunda.`,
    paraQuien: 'Para quienes atraviesan una ruptura o pérdida amorosa.',
    requiereGuardian: false,
    campos: [
      { id: 'que_paso', tipo: 'textarea', label: '¿Qué pasó? Contanos lo que quieras compartir', placeholder: 'La ruptura, la pérdida, lo que terminó...' },
      { id: 'tiempo_ruptura', tipo: 'select', label: '¿Hace cuánto pasó?', opciones: ['Menos de una semana', '1-4 semanas', '1-3 meses', '3-6 meses', '6 meses - 1 año', 'Más de un año'] },
      { id: 'como_estas', tipo: 'textarea', label: '¿Cómo te sentís ahora?', placeholder: 'Tu estado emocional actual...' },
      { id: 'que_necesitas', tipo: 'select', label: '¿Qué sentís que necesitás?', opciones: ['Entender qué pasó', 'Soltar y seguir', 'Cerrar el ciclo', 'Recuperar mi autoestima', 'Volver a creer en el amor', 'Todo lo anterior'] }
    ],
    promptBase: `Guiá a {nombre} en la sanación de su corazón roto.

DATOS:
- Qué pasó: {que_paso}
- Tiempo: {tiempo_ruptura}
- Cómo está: {como_estas}
- Necesita: {que_necesitas}

PROCESO DE SANACIÓN:
1. Validación de su dolor (sin minimizar)
2. Lo que esta experiencia vino a enseñarle
3. Lo que necesita soltar (no solo a la persona)
4. Creencias que se instalaron que debe revisar
5. Sus fortalezas que quizás olvidó
6. Etapas de sanación que atravesará
7. RITUAL DE LIBERACIÓN (paso a paso):
   - Carta al pasado
   - Símbolo de soltar
   - Palabras de cierre
8. Cómo preparar el corazón para amar de nuevo
9. Mensaje de esperanza genuino

Ser empático pero no condescendiente.
Mínimo 700 palabras.`
  },

  {
    id: 'atraer_amor',
    nombre: 'Ritual para Atraer el Amor',
    categoria: 'amor',
    icono: '🧲',
    runas: 50,
    tiempoMinutos: 45,
    descripcionCorta: 'Preparate para recibir el amor que merecés',
    descripcionLarga: `No se trata de magia para "atrapar" a alguien. Se trata de preparar TU energía para ser capaz de recibir amor.

Este estudio analiza qué te está bloqueando y crea un ritual personalizado para alinear tu energía con el amor que merecés.

Es preparación energética para el amor.`,
    paraQuien: 'Para quienes quieren abrir las puertas al amor en su vida.',
    requiereGuardian: false,
    campos: [
      { id: 'historia_amorosa', tipo: 'textarea', label: 'Breve historia de tus relaciones pasadas', placeholder: 'Patrones que ves, cómo terminaron...' },
      { id: 'que_buscas', tipo: 'textarea', label: '¿Qué tipo de amor buscás?', placeholder: 'Cómo te gustaría que fuera tu próxima relación...' },
      { id: 'bloqueos_percibidos', tipo: 'multiselect', label: '¿Qué creés que te bloquea?', opciones: ['Miedo a ser lastimada', 'Baja autoestima', 'Experiencias pasadas', 'No conozco gente nueva', 'Creo que no merezco amor', 'Soy muy selectiva', 'No sé qué me bloquea'] },
      { id: 'disponibilidad', tipo: 'select', label: '¿Qué tan disponible estás realmente?', opciones: ['Totalmente lista', 'Casi lista', 'No estoy segura', 'Todavía sanando'] }
    ],
    promptBase: `Creá un ritual de atracción del amor para {nombre}.

DATOS:
- Historia amorosa: {historia_amorosa}
- Qué busca: {que_buscas}
- Bloqueos: {bloqueos_percibidos}
- Disponibilidad: {disponibilidad}

INCLUIR:
1. Diagnóstico: Por qué el amor no llega
2. Lo que SÍ tiene para ofrecer (validar)
3. Lo que debe trabajar internamente
4. RITUAL DE APERTURA AL AMOR:
   - Mejor momento (fase lunar, día)
   - Materiales necesarios
   - Preparación personal
   - Paso a paso del ritual
   - Palabras de invocación
   - Qué hacer después
5. Señales de que está funcionando
6. Qué evitar para no sabotear
7. Afirmaciones diarias personalizadas
8. Mensaje del universo sobre su amor

Mínimo 600 palabras.`
  },

  // ─────────────────────────────────────────────────────────────
  // NUMEROLOGÍA
  // ─────────────────────────────────────────────────────────────
  {
    id: 'perfil_numerologico',
    nombre: 'Tu Perfil Numerológico Completo',
    categoria: 'numerologia',
    icono: '🔢',
    runas: 70,
    tiempoMinutos: 55,
    descripcionCorta: 'Todos tus números revelados',
    descripcionLarga: `Tu fecha de nacimiento y tu nombre esconden códigos. Números que revelan tu personalidad, tu destino, tus desafíos y tus dones.

Este estudio calcula TODOS tus números importantes: número de vida, número de expresión, número del alma, número de personalidad, y cómo interactúan entre sí.

Es el mapa numerológico de tu ser.`,
    paraQuien: 'Para quienes quieren conocerse a través de la numerología.',
    requiereGuardian: false,
    campos: [
      { id: 'nombre_completo', tipo: 'text', label: 'Tu nombre completo de nacimiento', placeholder: 'Tal como figura en tu partida de nacimiento' },
      { id: 'fecha_nacimiento_num', tipo: 'date', label: 'Tu fecha de nacimiento' },
      { id: 'nombre_actual', tipo: 'text', label: '¿Usás otro nombre actualmente? (opcional)', placeholder: 'Si te cambiaste el nombre o usás apodo' }
    ],
    promptBase: `Calculá el perfil numerológico completo de {nombre}.

DATOS:
- Nombre de nacimiento: {nombre_completo}
- Fecha: {fecha_nacimiento_num}
- Nombre actual: {nombre_actual}

ANÁLISIS DEBE INCLUIR:
1. NÚMERO DE VIDA (fecha):
   - Cálculo explicado
   - Significado profundo
   - Cómo se manifiesta en su vida

2. NÚMERO DE EXPRESIÓN (nombre):
   - Cálculo letra por letra
   - Lo que vino a expresar al mundo

3. NÚMERO DEL ALMA (vocales):
   - Lo que su alma verdaderamente desea

4. NÚMERO DE PERSONALIDAD (consonantes):
   - Cómo la perciben los demás

5. NÚMERO DE MADUREZ:
   - Su potencial a desarrollar

6. Cómo interactúan estos números
7. Desafíos kármicos por resolver
8. Años personales importantes
9. Su año personal actual y qué esperar
10. Consejo numerológico

Mínimo 750 palabras.`
  },

  {
    id: 'año_personal_num',
    nombre: 'Tu Año Personal Numerológico',
    categoria: 'numerologia',
    icono: '📅',
    runas: 35,
    tiempoMinutos: 30,
    descripcionCorta: 'Qué energía rige este año para vos',
    descripcionLarga: `Cada año tiene un número personal que influye en todo lo que vivís. Saber en qué año personal estás te ayuda a fluir en vez de luchar.

Este estudio calcula tu año personal actual y te explica exactamente qué esperar, qué hacer y qué evitar.

Es tu brújula para el año.`,
    paraQuien: 'Para quienes quieren aprovechar mejor la energía del año.',
    requiereGuardian: false,
    campos: [
      { id: 'fecha_nac_año', tipo: 'date', label: 'Tu fecha de nacimiento' },
      { id: 'areas_importantes', tipo: 'multiselect', label: '¿Qué áreas son más importantes para vos este año?', opciones: ['Trabajo/carrera', 'Amor/relaciones', 'Salud', 'Familia', 'Crecimiento personal', 'Dinero/abundancia', 'Creatividad'] },
      { id: 'como_va_año', tipo: 'textarea', label: '¿Cómo viene siendo tu año hasta ahora?', placeholder: 'Breve resumen de cómo te ha ido...' }
    ],
    promptBase: `Analizá el año personal numerológico de {nombre}.

DATOS:
- Fecha: {fecha_nac_año}
- Áreas importantes: {areas_importantes}
- Cómo va el año: {como_va_año}

ANÁLISIS DEBE INCLUIR:
1. Cálculo del año personal explicado
2. Significado general de este número de año
3. PARA CADA ÁREA que le importa:
   - Qué esperar
   - Qué acciones tomar
   - Qué evitar
4. Meses más favorables y por qué
5. Meses desafiantes y cómo navegarlos
6. Lo que aprendió de años anteriores (ciclo)
7. Qué prepara este año para el siguiente
8. Consejo de cierre

Mínimo 500 palabras.`
  },

  {
    id: 'numerologia_nombre',
    nombre: 'Análisis de tu Nombre',
    categoria: 'numerologia',
    icono: '✏️',
    runas: 40,
    tiempoMinutos: 35,
    descripcionCorta: 'El poder oculto en tu nombre',
    descripcionLarga: `Tu nombre no es casualidad. Cada letra vibra en una frecuencia específica. Tu nombre programa tu destino.

Este estudio analiza la vibración de tu nombre: qué energías activa, qué potencia y qué bloquea.

Si estás pensando en cambiarte el nombre, este estudio es esencial.`,
    paraQuien: 'Para quienes quieren entender o cambiar su nombre.',
    requiereGuardian: false,
    campos: [
      { id: 'nombre_analizar', tipo: 'text', label: 'Nombre a analizar', placeholder: 'Tu nombre actual o el nombre que considerás' },
      { id: 'es_nombre_actual', tipo: 'select', label: '¿Es tu nombre actual o uno que considerás?', opciones: ['Es mi nombre actual', 'Es un nombre que considero usar', 'Es mi nombre artístico/profesional'] },
      { id: 'motivo_analisis', tipo: 'textarea', label: '¿Por qué querés analizar este nombre?', placeholder: 'Tu motivación...' }
    ],
    promptBase: `Analizá numerológicamente el nombre para {nombre}.

NOMBRE A ANALIZAR: {nombre_analizar}
TIPO: {es_nombre_actual}
MOTIVO: {motivo_analisis}

ANÁLISIS DEBE INCLUIR:
1. Desglose letra por letra (número de cada una)
2. Número total del nombre
3. Energías que este nombre activa
4. Fortalezas que potencia
5. Posibles limitaciones
6. Si hay letras repetidas: qué significa
7. Letras faltantes: qué energías le faltan
8. Comparación con nombre de nacimiento (si es diferente)
9. Recomendación: ¿le sirve este nombre?
10. Ajustes sugeridos si es necesario

Mínimo 500 palabras.`
  },

  // ─────────────────────────────────────────────────────────────
  // INTERPRETACIÓN DE SUEÑOS
  // ─────────────────────────────────────────────────────────────
  {
    id: 'interpretar_sueno',
    nombre: 'Interpretación de un Sueño',
    categoria: 'suenos',
    icono: '💭',
    runas: 30,
    tiempoMinutos: 25,
    descripcionCorta: 'Descifra el mensaje de tu sueño',
    descripcionLarga: `Los sueños son mensajes del inconsciente, del universo, de tu alma. Pero vienen en código y necesitan ser descifrados.

Este estudio interpreta UN sueño específico que hayas tenido. No significados genéricos de diccionario. Interpretación personalizada para VOS.

Es traducir el lenguaje de tu alma.`,
    paraQuien: 'Para quienes tuvieron un sueño que no pueden olvidar.',
    requiereGuardian: false,
    campos: [
      { id: 'sueno_detalle', tipo: 'textarea', label: 'Describí tu sueño con todos los detalles que recuerdes', placeholder: 'Personas, lugares, objetos, emociones, colores, acciones...' },
      { id: 'cuando_soñaste', tipo: 'select', label: '¿Cuándo lo soñaste?', opciones: ['Anoche', 'Esta semana', 'Este mes', 'Hace tiempo pero no lo olvido'] },
      { id: 'emocion_despertar', tipo: 'select', label: '¿Cómo te sentiste al despertar?', opciones: ['Confundida', 'Asustada', 'Triste', 'Feliz', 'Inquieta', 'En paz', 'Intrigada'] },
      { id: 'situacion_actual', tipo: 'textarea', label: '¿Qué está pasando en tu vida actualmente?', placeholder: 'Contexto de tu vida al momento del sueño...' }
    ],
    promptBase: `Interpretá el sueño de {nombre}.

EL SUEÑO: {sueno_detalle}
CUÁNDO: {cuando_soñaste}
EMOCIÓN AL DESPERTAR: {emocion_despertar}
SITUACIÓN ACTUAL: {situacion_actual}

INTERPRETACIÓN DEBE INCLUIR:
1. Análisis de los símbolos principales
2. El mensaje central del sueño
3. Conexión con su situación actual
4. Lo que su inconsciente le dice
5. Advertencias o guías
6. Aspectos de sí misma reflejados
7. Acciones sugeridas
8. Si el sueño se repetirá y por qué
9. Mensaje final del mundo onírico

NO usar interpretaciones genéricas de diccionario.
Mínimo 450 palabras.`
  },

  {
    id: 'diario_onirico',
    nombre: 'Análisis de Sueños Recurrentes',
    categoria: 'suenos',
    icono: '🔄',
    runas: 55,
    tiempoMinutos: 45,
    descripcionCorta: 'Patrones ocultos en tus sueños repetitivos',
    descripcionLarga: `Cuando un sueño se repite, tu alma está gritando un mensaje. No es casualidad. Hay algo urgente que necesitás ver.

Este estudio analiza PATRONES en tus sueños recurrentes. Qué te dicen en conjunto, qué necesitás resolver, y cómo hacer que dejen de repetirse.

Es sanación onírica profunda.`,
    paraQuien: 'Para quienes tienen sueños que se repiten una y otra vez.',
    requiereGuardian: false,
    campos: [
      { id: 'suenos_recurrentes', tipo: 'textarea', label: 'Describí los sueños que se repiten', placeholder: 'Pueden ser varios con tema similar o el mismo sueño exacto...' },
      { id: 'desde_cuando', tipo: 'select', label: '¿Desde cuándo los tenés?', opciones: ['Semanas', 'Meses', 'Años', 'Toda mi vida'] },
      { id: 'variaciones', tipo: 'textarea', label: '¿Hay variaciones entre uno y otro?', placeholder: 'Qué cambia y qué se mantiene igual...' },
      { id: 'evento_inicio', tipo: 'textarea', label: '¿Pasó algo cuando empezaron? (opcional)', placeholder: 'Si recordás qué estaba pasando cuando empezaron...' }
    ],
    promptBase: `Analizá los sueños recurrentes de {nombre}.

LOS SUEÑOS: {suenos_recurrentes}
DESDE CUÁNDO: {desde_cuando}
VARIACIONES: {variaciones}
EVENTO DE INICIO: {evento_inicio}

ANÁLISIS DEBE INCLUIR:
1. El patrón central que se repite
2. Lo que el inconsciente intenta comunicar
3. Por qué se repiten (qué no ha sido resuelto)
4. Conexión con trauma o experiencia no procesada
5. Evolución de los sueños (si han cambiado)
6. Lo que necesita hacer para resolver el mensaje
7. RITUAL DE SANACIÓN ONÍRICA:
   - Antes de dormir
   - Intención consciente
   - Trabajo de integración
8. Cuándo deberían dejar de repetirse
9. Si no paran: qué hacer

Mínimo 550 palabras.`
  },

  {
    id: 'suenos_profeticos',
    nombre: '¿Tus Sueños son Proféticos?',
    categoria: 'suenos',
    icono: '🔮',
    runas: 45,
    tiempoMinutos: 40,
    descripcionCorta: 'Descubrí si tenés el don de la precognición',
    descripcionLarga: `Algunas personas sueñan cosas que después pasan. ¿Te ha sucedido? ¿Soñás con eventos antes de que ocurran?

Este estudio evalúa si tenés el don de los sueños proféticos, cómo desarrollarlo y cómo diferenciarlo de sueños comunes.

Es despertar tu don onírico.`,
    paraQuien: 'Para quienes creen que sus sueños predicen el futuro.',
    requiereGuardian: false,
    campos: [
      { id: 'ejemplos_profeticos', tipo: 'textarea', label: '¿Podés dar ejemplos de sueños que después pasaron?', placeholder: 'Contanos casos específicos...' },
      { id: 'frecuencia', tipo: 'select', label: '¿Con qué frecuencia te pasa?', opciones: ['Muy seguido', 'A veces', 'Pocas veces pero muy claras', 'Creo que me pasó pero no estoy segura'] },
      { id: 'tipo_prediccion', tipo: 'multiselect', label: '¿Qué tipo de cosas sueñas antes?', opciones: ['Accidentes', 'Encuentros con personas', 'Noticias', 'Eventos personales', 'Cosas cotidianas', 'Grandes eventos', 'Muertes'] },
      { id: 'como_te_sientes', tipo: 'textarea', label: '¿Cómo te sentís con este don?', placeholder: 'Tu relación con esta habilidad...' }
    ],
    promptBase: `Evalúa el don profético de {nombre}.

EJEMPLOS: {ejemplos_profeticos}
FRECUENCIA: {frecuencia}
TIPO: {tipo_prediccion}
CÓMO SE SIENTE: {como_te_sientes}

ANÁLISIS DEBE INCLUIR:
1. Evaluación: ¿tiene realmente el don?
2. Tipos de sueños proféticos que tiene
3. Cómo diferenciar sueño profético de sueño común
4. Señales en el sueño de que es profético
5. Por qué tiene este don
6. Responsabilidad ética del don
7. CÓMO DESARROLLARLO:
   - Prácticas antes de dormir
   - Diario de sueños
   - Validación de los sueños
8. Qué hacer cuando sueña algo malo
9. Protección energética para soñadores
10. Su potencial profético

Mínimo 550 palabras.`
  },

  // ─────────────────────────────────────────────────────────────
  // ABUNDANCIA Y PROSPERIDAD
  // ─────────────────────────────────────────────────────────────
  {
    id: 'bloqueos_abundancia',
    nombre: 'Bloqueos de Abundancia',
    categoria: 'abundancia',
    icono: '🚫',
    runas: 55,
    tiempoMinutos: 50,
    descripcionCorta: 'Por qué el dinero no fluye hacia vos',
    descripcionLarga: `El dinero es energía. Si no fluye hacia vos, hay algo bloqueándolo. Y no siempre es lo que creés.

Este estudio detecta tus BLOQUEOS DE ABUNDANCIA reales. Creencias, patrones familiares, votos inconscientes, autosabotaje. Todo lo que te frena.

Es destapar la cañería de la prosperidad.`,
    paraQuien: 'Para quienes sienten que el dinero les es esquivo.',
    requiereGuardian: false,
    campos: [
      { id: 'relacion_dinero', tipo: 'textarea', label: 'Describí tu relación con el dinero', placeholder: 'Cómo te sentís con el dinero, qué te genera...' },
      { id: 'patron_familiar', tipo: 'textarea', label: '¿Cómo era la relación de tu familia con el dinero?', placeholder: 'Tus padres, abuelos, lo que decían del dinero...' },
      { id: 'frases_dinero', tipo: 'textarea', label: '¿Qué frases sobre el dinero escuchaste de chica?', placeholder: '"El dinero no crece en los árboles", "Los ricos son malos"...' },
      { id: 'situacion_actual_dinero', tipo: 'textarea', label: '¿Cuál es tu situación financiera actual?', placeholder: 'Breve descripción...' }
    ],
    promptBase: `Detectá los bloqueos de abundancia de {nombre}.

DATOS:
- Relación con dinero: {relacion_dinero}
- Patrón familiar: {patron_familiar}
- Frases heredadas: {frases_dinero}
- Situación actual: {situacion_actual_dinero}

ANÁLISIS DEBE INCLUIR:
1. Sus 3 principales bloqueos de abundancia
2. Origen de cada bloqueo (infancia, vida pasada, linaje)
3. Creencias limitantes específicas
4. Patrones de autosabotaje
5. Votos inconscientes de pobreza (si los hay)
6. Lo que inconscientemente cree del dinero
7. Para CADA BLOQUEO:
   - Cómo se manifiesta en su vida
   - Cómo sanarlo
   - Afirmación de reemplazo
8. RITUAL DE LIBERACIÓN de bloqueos
9. Hábitos que debe cambiar
10. Mensaje del universo sobre su abundancia

Mínimo 700 palabras.`
  },

  {
    id: 'ritual_abundancia',
    nombre: 'Ritual de Activación de Abundancia',
    categoria: 'abundancia',
    icono: '✨',
    runas: 45,
    tiempoMinutos: 40,
    descripcionCorta: 'Abrí las puertas a la prosperidad',
    descripcionLarga: `La abundancia existe. Hay más que suficiente para todos. Pero necesitás sintonizar con su frecuencia.

Este estudio crea un RITUAL DE ABUNDANCIA completamente personalizado para vos. No genérico. Diseñado para tu energía específica.

Es programar tu campo para recibir.`,
    paraQuien: 'Para quienes quieren activar el flujo de prosperidad.',
    requiereGuardian: false,
    campos: [
      { id: 'que_necesitas', tipo: 'textarea', label: '¿Qué tipo de abundancia necesitás más?', placeholder: 'Dinero, oportunidades, clientes, trabajo...' },
      { id: 'cuanto_necesitas', tipo: 'select', label: '¿Qué tan urgente es?', opciones: ['Muy urgente (supervivencia)', 'Importante (mejorar)', 'Sería lindo (extra)', 'Para el futuro'] },
      { id: 'acciones_tomadas', tipo: 'textarea', label: '¿Qué acciones concretas estás tomando?', placeholder: 'Trabajo, emprendimiento, búsqueda...' },
      { id: 'materiales_disponibles', tipo: 'multiselect', label: '¿Qué materiales tenés disponibles?', opciones: ['Velas', 'Cristales', 'Monedas', 'Canela', 'Laurel', 'Sal', 'Incienso', 'Papel y lápiz'] }
    ],
    promptBase: `Creá un ritual de abundancia para {nombre}.

DATOS:
- Qué necesita: {que_necesitas}
- Urgencia: {cuanto_necesitas}
- Acciones tomadas: {acciones_tomadas}
- Materiales: {materiales_disponibles}

EL RITUAL DEBE INCLUIR:
1. Mejor momento para hacerlo (luna, día)
2. Preparación del espacio
3. Preparación personal
4. PASOS DEL RITUAL (detallados):
   - Cada acción explicada
   - Palabras de poder específicas
   - Visualizaciones
   - Duración de cada paso
5. Qué hacer con los materiales después
6. Cómo mantener la energía activa
7. Señales de que está funcionando
8. Qué hacer si no funciona rápido
9. Afirmaciones diarias post-ritual
10. Acciones mundanas que deben acompañar

Ser práctico y detallado.
Mínimo 600 palabras.`
  },

  {
    id: 'lectura_prosperidad',
    nombre: 'Lectura de tu Camino de Prosperidad',
    categoria: 'abundancia',
    icono: '🛤️',
    runas: 65,
    tiempoMinutos: 55,
    descripcionCorta: 'Tu mapa hacia la abundancia verdadera',
    descripcionLarga: `¿Cuál es TU camino hacia la prosperidad? No el de otro. El tuyo. Cada persona tiene un camino único hacia la abundancia.

Este estudio revela cuál es tu camino natural de prosperidad, qué dones monetizables tenés, y cómo alinear tu vida con la riqueza.

Es encontrar tu ruta dorada.`,
    paraQuien: 'Para quienes buscan dirección en su camino financiero.',
    requiereGuardian: false,
    campos: [
      { id: 'fecha_nac_prosp', tipo: 'date', label: 'Tu fecha de nacimiento' },
      { id: 'habilidades', tipo: 'textarea', label: '¿Qué se te da bien naturalmente?', placeholder: 'Tus talentos, lo que otros dicen que hacés bien...' },
      { id: 'que_disfruta', tipo: 'textarea', label: '¿Qué disfrutás hacer?', placeholder: 'Lo que harías gratis pero podrías cobrar...' },
      { id: 'intentos_pasados', tipo: 'textarea', label: '¿Qué has intentado para generar abundancia?', placeholder: 'Trabajos, emprendimientos, inversiones...' }
    ],
    promptBase: `Revelá el camino de prosperidad de {nombre}.

DATOS:
- Fecha: {fecha_nac_prosp}
- Habilidades: {habilidades}
- Disfruta: {que_disfruta}
- Intentos: {intentos_pasados}

LECTURA DEBE INCLUIR:
1. Su número de prosperidad (de fecha)
2. Su arquetipo de abundancia
3. Dónde NO está su prosperidad
4. Dónde SÍ está su camino de riqueza
5. Dones monetizables que no está usando
6. Bloqueos entre ella y su prosperidad
7. Las 3 acciones clave para activar abundancia
8. Timing: cuándo es su mejor momento
9. Personas que deberían estar en su camino
10. MAPA DE PROSPERIDAD personal
11. Mensaje de los guardianes de la abundancia

Mínimo 650 palabras.`
  },

  // ─────────────────────────────────────────────────────────────
  // REGISTROS AKÁSHICOS
  // ─────────────────────────────────────────────────────────────
  {
    id: 'lectura_akashicos',
    nombre: 'Lectura de Registros Akáshicos',
    categoria: 'akashicos',
    icono: '📖',
    runas: 250,
    tiempoMinutos: 90,
    descripcionCorta: 'Accede a la biblioteca cósmica de tu alma',
    descripcionLarga: `Los Registros Akáshicos son la biblioteca del universo. Contienen toda la información de tu alma: vidas pasadas, propósito, contratos, lecciones.

Esta lectura abre TUS registros y extrae información específica para tu momento actual. No es genérica. Es lo que tu alma necesita saber AHORA.

Es consultar el libro de tu existencia.`,
    paraQuien: 'Para quienes buscan respuestas profundas sobre su alma.',
    requiereGuardian: false,
    campos: [
      { id: 'nombre_completo_ak', tipo: 'text', label: 'Tu nombre completo de nacimiento', placeholder: 'Como aparece en tu partida de nacimiento' },
      { id: 'preguntas_akashicos', tipo: 'textarea', label: '¿Qué preguntas querés hacer a tus Registros?', placeholder: 'Hasta 3 preguntas importantes...' },
      { id: 'area_vida', tipo: 'select', label: '¿Qué área de tu vida necesita más claridad?', opciones: ['Propósito de vida', 'Relaciones', 'Trabajo/vocación', 'Sanación personal', 'Espiritualidad', 'Patrones repetitivos', 'Todo/general'] },
      { id: 'experiencia_previa', tipo: 'select', label: '¿Has consultado Registros Akáshicos antes?', opciones: ['Nunca', 'Una vez', 'Varias veces', 'Regularmente'] }
    ],
    promptBase: `Abrí los Registros Akáshicos de {nombre}.

NOMBRE: {nombre_completo_ak}
PREGUNTAS: {preguntas_akashicos}
ÁREA: {area_vida}
EXPERIENCIA PREVIA: {experiencia_previa}

LECTURA DEBE INCLUIR:
1. Apertura ceremonial de los Registros
2. Descripción del espacio de sus Registros
3. Guía o guardián de sus Registros
4. Respuesta a cada pregunta desde los Registros
5. Información sobre su origen de alma
6. Vidas pasadas relevantes para su momento
7. Contratos del alma activos
8. Lecciones principales de esta vida
9. Bloqueos akáshicos a liberar
10. Mensajes de los Maestros Akáshicos
11. Cierre ceremonial

Usar lenguaje elevado pero comprensible.
Mínimo 900 palabras.`
  },

  {
    id: 'origen_alma',
    nombre: 'Tu Origen de Alma',
    categoria: 'akashicos',
    icono: '⭐',
    runas: 180,
    tiempoMinutos: 75,
    descripcionCorta: '¿De dónde viene tu alma realmente?',
    descripcionLarga: `Tu alma no empezó en la Tierra. Viene de algún lugar del cosmos. Algunas almas vienen de Sirio, otras de Pléyades, otras de Arcturus, otras de la Tierra misma.

Este estudio revela de DÓNDE viene tu alma. Tu origen estelar. Tu familia cósmica. Por qué elegiste la Tierra.

Es conocer tu verdadero hogar.`,
    paraQuien: 'Para quienes sienten que no pertenecen del todo a este mundo.',
    requiereGuardian: false,
    campos: [
      { id: 'sensacion_no_pertenecer', tipo: 'select', label: '¿Te sentís diferente a los demás?', opciones: ['Siempre me sentí diferente', 'A veces', 'No especialmente', 'Me siento muy humana'] },
      { id: 'atraccion_estrellas', tipo: 'textarea', label: '¿Hay constelaciones, planetas o estrellas que te atraigan?', placeholder: 'Lo que te llama del cosmos...' },
      { id: 'dones_especiales', tipo: 'textarea', label: '¿Qué dones o sensibilidades especiales tenés?', placeholder: 'Intuición, sanación, percepción...' },
      { id: 'mision_percibida', tipo: 'textarea', label: '¿Sentís que viniste a hacer algo específico en la Tierra?', placeholder: 'Tu intuición sobre tu misión...' }
    ],
    promptBase: `Revelá el origen de alma de {nombre}.

DATOS:
- Sensación de no pertenecer: {sensacion_no_pertenecer}
- Atracción estelar: {atraccion_estrellas}
- Dones especiales: {dones_especiales}
- Misión percibida: {mision_percibida}

REVELACIÓN DEBE INCLUIR:
1. Su origen de alma (lugar del cosmos)
2. Características de ese lugar de origen
3. Por qué almas de allí vienen a la Tierra
4. Dones que trae de su origen
5. Desafíos de adaptación a la Tierra
6. Su familia de almas
7. Otras vidas en otros planetas/dimensiones
8. Por qué eligió venir ahora
9. Su misión desde su origen
10. Cómo reconectar con su familia cósmica
11. Mensaje de sus guías de origen

Mínimo 800 palabras.`
  },

  {
    id: 'limpieza_akashica',
    nombre: 'Limpieza de Registros Akáshicos',
    categoria: 'akashicos',
    icono: '🧹',
    runas: 150,
    tiempoMinutos: 65,
    descripcionCorta: 'Libera karmas y contratos obsoletos',
    descripcionLarga: `Tus Registros Akáshicos pueden tener "archivos corruptos": karmas pendientes, contratos obsoletos, votos que ya no te sirven.

Esta limpieza entra a tus Registros y BORRA lo que te frena. Karmas saldados que siguen activos. Votos de otras vidas. Contratos vencidos.

Es desfragmentar el disco duro de tu alma.`,
    paraQuien: 'Para quienes sienten cargas de vidas pasadas.',
    requiereGuardian: false,
    campos: [
      { id: 'cargas_sentidas', tipo: 'textarea', label: '¿Qué cargas sentís que no son de esta vida?', placeholder: 'Miedos, limitaciones, deudas kármicas...' },
      { id: 'patrones_ancestrales', tipo: 'textarea', label: '¿Qué patrones familiares se repiten?', placeholder: 'Lo que se repite en tu linaje...' },
      { id: 'votos_intuidos', tipo: 'multiselect', label: '¿Sentís que hiciste votos en otras vidas?', opciones: ['Voto de pobreza', 'Voto de castidad', 'Voto de silencio', 'Voto de sacrificio', 'Voto de servicio', 'Voto de soledad', 'No sé/ninguno'] },
      { id: 'que_liberar', tipo: 'textarea', label: '¿Qué te gustaría liberar específicamente?', placeholder: 'Lo que sentís que necesitás soltar...' }
    ],
    promptBase: `Realizá limpieza akáshica para {nombre}.

DATOS:
- Cargas sentidas: {cargas_sentidas}
- Patrones ancestrales: {patrones_ancestrales}
- Votos intuidos: {votos_intuidos}
- Qué liberar: {que_liberar}

LIMPIEZA DEBE INCLUIR:
1. Apertura de los Registros
2. Diagnóstico de lo que hay que limpiar:
   - Karmas pendientes encontrados
   - Votos activos de otras vidas
   - Contratos obsoletos
   - Implantes energéticos
3. Para CADA elemento encontrado:
   - Origen (cuándo, cómo)
   - Por qué sigue activo
   - Declaración de liberación
4. Ritual de sellado de la limpieza
5. Lo que cambiará después de la limpieza
6. Qué puede sentir en los próximos días
7. Cómo mantener los Registros limpios
8. Cierre y bendición

Mínimo 750 palabras.`
  },

  // ─────────────────────────────────────────────────────────────
  // SANACIÓN INTERIOR
  // ─────────────────────────────────────────────────────────────
  {
    id: 'nino_interior',
    nombre: 'Sanación del Niño Interior',
    categoria: 'sanacion',
    icono: '👶',
    runas: 80,
    tiempoMinutos: 60,
    descripcionCorta: 'Conectá y saná a tu niña interior',
    descripcionLarga: `Dentro de vos vive todavía la niña que fuiste. Esa niña guarda heridas, pero también tu alegría original, tu creatividad y tu capacidad de asombro.

Este trabajo de sanación te conecta con tu niño interior para escucharla, sanarla y reintegrarla.

Es recuperar partes perdidas de vos.`,
    paraQuien: 'Para quienes sienten heridas de infancia no sanadas.',
    requiereGuardian: false,
    campos: [
      { id: 'infancia_breve', tipo: 'textarea', label: 'Describí brevemente tu infancia', placeholder: 'Cómo fue, ambiente familiar...' },
      { id: 'heridas_ninez', tipo: 'multiselect', label: '¿Qué heridas identificás de tu niñez?', opciones: ['Abandono', 'Rechazo', 'Humillación', 'Traición', 'Injusticia', 'Negligencia', 'Abuso', 'Comparación', 'No sé/otras'] },
      { id: 'relacion_padres', tipo: 'textarea', label: '¿Cómo era la relación con tus padres/cuidadores?', placeholder: 'Lo más significativo...' },
      { id: 'que_necesitaba', tipo: 'textarea', label: '¿Qué necesitabas de niña que no recibiste?', placeholder: 'Lo que te faltó...' }
    ],
    promptBase: `Guiá la sanación del niño interior de {nombre}.

DATOS:
- Infancia: {infancia_breve}
- Heridas: {heridas_ninez}
- Relación con padres: {relacion_padres}
- Lo que necesitaba: {que_necesitaba}

PROCESO DEBE INCLUIR:
1. Visualización guiada para encontrar a la niña interior
2. Descripción de cómo está la niña (estado, edad, lugar)
3. Diálogo con la niña interior (lo que dice, lo que siente)
4. Las heridas específicas a sanar
5. Reparentalización: lo que la adulta le da a la niña
6. Palabras que la niña necesita escuchar
7. RITUAL DE INTEGRACIÓN:
   - Ejercicio de abrazo interior
   - Promesas a la niña
   - Símbolo de sanación
8. Cómo mantener la conexión
9. Señales de que la sanación avanza
10. Mensaje de la niña interior sanada

Ser muy amoroso y contenedor.
Mínimo 750 palabras.`
  },

  {
    id: 'sombra_personal',
    nombre: 'Trabajo con tu Sombra',
    categoria: 'sanacion',
    icono: '🌑',
    runas: 90,
    tiempoMinutos: 70,
    descripcionCorta: 'Integra lo que rechazás de vos',
    descripcionLarga: `Tu sombra es todo lo que rechazás de vos misma. Lo que escondés, lo que negás, lo que proyectás en otros. Pero tu sombra tiene poder.

Este trabajo te ayuda a VER tu sombra, entenderla e integrarla. No para eliminarla, sino para que deje de controlarte desde lo oscuro.

Es hacer las paces con tu oscuridad.`,
    paraQuien: 'Para quienes quieren un trabajo profundo de autoconocimiento.',
    requiereGuardian: false,
    campos: [
      { id: 'que_rechazas', tipo: 'textarea', label: '¿Qué características detestás en otros?', placeholder: 'Lo que no soportás de la gente...' },
      { id: 'que_escondes', tipo: 'textarea', label: '¿Qué partes de vos escondés o avergüenzan?', placeholder: 'Lo que no mostrás...' },
      { id: 'patron_conflictos', tipo: 'textarea', label: '¿Qué tipo de conflictos se repiten en tu vida?', placeholder: 'Peleas, problemas recurrentes...' },
      { id: 'miedo_profundo', tipo: 'textarea', label: '¿Cuál es tu miedo más profundo?', placeholder: 'Lo que más te aterra de vos o de la vida...' }
    ],
    promptBase: `Guiá el trabajo de sombra de {nombre}.

DATOS:
- Rechaza de otros: {que_rechazas}
- Esconde de sí: {que_escondes}
- Conflictos repetidos: {patron_conflictos}
- Miedo profundo: {miedo_profundo}

TRABAJO DEBE INCLUIR:
1. Explicación de qué es la sombra
2. Sus aspectos de sombra principales (3-4)
3. Para CADA aspecto:
   - Cómo se formó
   - Cómo se manifiesta
   - El don que esconde
   - Cómo integrarlo
4. Lo que proyecta en otros
5. Su arquetipo de sombra dominante
6. EJERCICIO DE DIÁLOGO CON LA SOMBRA:
   - Visualización
   - Preguntas a hacer
   - Qué escuchar
7. Ritual de integración
8. Cómo la sombra integrada le da poder
9. Señales de integración exitosa

Profundo pero no traumático.
Mínimo 700 palabras.`
  },

  {
    id: 'sanacion_linaje',
    nombre: 'Sanación del Linaje Femenino/Masculino',
    categoria: 'sanacion',
    icono: '👵',
    runas: 100,
    tiempoMinutos: 75,
    descripcionCorta: 'Sana las heridas heredadas de tu linaje',
    descripcionLarga: `Cargás heridas que no son tuyas. Traumas de tu abuela, de tu bisabuela, de todo tu linaje. Se transmiten sin palabras, en el ADN del alma.

Este trabajo sana las heridas de tu linaje femenino O masculino (elegís cuál). Liberás a tus ancestros y te liberás a vos.

Es cortar cadenas generacionales.`,
    paraQuien: 'Para quienes sienten el peso de la historia familiar.',
    requiereGuardian: false,
    campos: [
      { id: 'linaje_elegido', tipo: 'select', label: '¿Qué linaje querés sanar?', opciones: ['Linaje materno (madre, abuela, bisabuela)', 'Linaje paterno (padre, abuelo, bisabuelo)', 'Ambos (más extenso)'] },
      { id: 'historia_linaje', tipo: 'textarea', label: '¿Qué sabés de las mujeres/hombres de ese linaje?', placeholder: 'Sus historias, sus luchas, lo que vivieron...' },
      { id: 'patrones_heredados', tipo: 'textarea', label: '¿Qué patrones ves que se repiten?', placeholder: 'Enfermedades, relaciones, traumas...' },
      { id: 'relacion_linaje', tipo: 'textarea', label: '¿Cómo es tu relación con ese linaje?', placeholder: 'Si conociste a estas personas, cómo te sentís con ellas...' }
    ],
    promptBase: `Guiá la sanación del linaje de {nombre}.

DATOS:
- Linaje elegido: {linaje_elegido}
- Historia conocida: {historia_linaje}
- Patrones heredados: {patrones_heredados}
- Relación actual: {relacion_linaje}

SANACIÓN DEBE INCLUIR:
1. Visualización del árbol del linaje
2. Las heridas principales del linaje (3-4)
3. Origen de cada herida
4. Cómo llegó a ella
5. Lo que le toca sanar y lo que NO
6. Honrar a las ancestras/ancestros
7. RITUAL DE SANACIÓN GENERACIONAL:
   - Invocación del linaje
   - Declaración de sanación
   - Corte de patrones
   - Bendición hacia atrás
   - Bendición hacia adelante
8. Dones del linaje a recibir
9. Mensaje de las ancestras/ancestros
10. Cómo mantener la sanación

Mínimo 750 palabras.`
  },

  {
    id: 'perdon_profundo',
    nombre: 'Proceso de Perdón Profundo',
    categoria: 'sanacion',
    icono: '💜',
    runas: 70,
    tiempoMinutos: 55,
    descripcionCorta: 'Liberá el peso del resentimiento',
    descripcionLarga: `Perdonar no es olvidar. No es decir que estuvo bien. Es liberarte del veneno que te tomás esperando que el otro muera.

Este proceso te guía en un PERDÓN REAL. No forzado. No espiritual tóxico. Perdón que sana de verdad porque entiende de verdad.

Es soltar la carga.`,
    paraQuien: 'Para quienes cargan resentimiento que les pesa.',
    requiereGuardian: false,
    campos: [
      { id: 'a_quien_perdonar', tipo: 'textarea', label: '¿A quién necesitás perdonar?', placeholder: 'Puede ser otra persona, o vos misma...' },
      { id: 'que_paso', tipo: 'textarea', label: '¿Qué pasó? (lo que quieras compartir)', placeholder: 'Lo que te hicieron o hiciste...' },
      { id: 'intentos_perdon', tipo: 'select', label: '¿Has intentado perdonar antes?', opciones: ['Nunca', 'Muchas veces sin éxito', 'Creí que había perdonado pero no', 'No quiero perdonar'] },
      { id: 'que_sientes', tipo: 'textarea', label: '¿Qué sentís hacia esa persona/situación ahora?', placeholder: 'Tus emociones actuales...' }
    ],
    promptBase: `Guiá el proceso de perdón de {nombre}.

DATOS:
- A quién: {a_quien_perdonar}
- Qué pasó: {que_paso}
- Intentos previos: {intentos_perdon}
- Qué siente: {que_sientes}

PROCESO DEBE INCLUIR:
1. Validación del dolor (no minimizar)
2. Por qué el perdón es PARA ELLA, no para el otro
3. Lo que el perdón NO es (mitos)
4. Entender (no justificar) qué llevó al otro a hacer eso
5. El daño que le hace seguir sin perdonar
6. Las etapas del perdón real
7. RITUAL DE PERDÓN:
   - Preparación emocional
   - Carta que no se envía
   - Liberación del lazo
   - Palabras de perdón
   - Qué hacer con la carta
8. Qué esperar después
9. Si el perdón "no funciona": qué hacer
10. Mensaje de sanación

No forzar el perdón. Respetar el proceso.
Mínimo 650 palabras.`
  }
];

// ═══════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════

export function obtenerExperienciaPorId(id) {
  return EXPERIENCIAS.find(e => e.id === id);
}

export function obtenerExperienciasPorCategoria(categoriaId) {
  return EXPERIENCIAS.filter(e => e.categoria === categoriaId);
}

export function obtenerCategorias() {
  return Object.values(CATEGORIAS_EXPERIENCIAS);
}

// Calcular tiempo de entrega según hora de Uruguay
export function calcularTiempoEntrega(tiempoMinutos) {
  const ahora = new Date();
  // Convertir a hora de Uruguay (UTC-3)
  const horaUruguay = new Date(ahora.getTime() - (3 * 60 * 60 * 1000));
  const hora = horaUruguay.getHours();

  let entrega = new Date(ahora);

  // Si es entre 22:00 y 06:00, la entrega empieza a las 06:00
  if (hora >= 22 || hora < 6) {
    // Calcular cuándo son las 06:00
    if (hora >= 22) {
      // Agregar horas hasta las 06:00 del día siguiente
      entrega.setHours(entrega.getHours() + (24 - hora + 6));
    } else {
      // Ya es de madrugada, esperar hasta las 06:00
      entrega.setHours(6, 0, 0, 0);
    }
    // Agregar el tiempo de trabajo
    entrega.setMinutes(entrega.getMinutes() + tiempoMinutos);
  } else {
    // Horario de trabajo normal
    entrega.setMinutes(entrega.getMinutes() + tiempoMinutos);

    // Si la entrega cae en horario de descanso, ajustar
    const horaEntrega = entrega.getHours();
    if (horaEntrega >= 22) {
      const minutosPendientes = (horaEntrega - 22) * 60 + entrega.getMinutes();
      entrega.setDate(entrega.getDate() + 1);
      entrega.setHours(6, minutosPendientes, 0, 0);
    }
  }

  return entrega;
}

export function formatearTiempoEspera(fechaEntrega) {
  const ahora = new Date();
  const diferencia = fechaEntrega - ahora;

  const horas = Math.floor(diferencia / (1000 * 60 * 60));
  const minutos = Math.floor((diferencia % (1000 * 60 * 60)) / (1000 * 60));

  if (horas > 0) {
    return `${horas}h ${minutos}min`;
  }
  return `${minutos} minutos`;
}
