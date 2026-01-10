import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

// ═══════════════════════════════════════════════════════════════
// CATEGORIAS Y TIPOS DE CONTENIDO
// ═══════════════════════════════════════════════════════════════

const CATEGORIAS_INFO = {
  cosmos: {
    nombre: 'Cosmos y Luna',
    desc: 'energia lunar, astrologia, ciclos cosmicos, conexion con las estrellas',
    emociones: ['asombro', 'conexion universal', 'misterio', 'trascendencia'],
    elementos: ['luna', 'estrellas', 'planetas', 'ciclos', 'mareas']
  },
  duendes: {
    nombre: 'Mundo Duende',
    desc: 'historia, tipos de guardianes, conexion elemental, seres de luz',
    emociones: ['proteccion', 'magia', 'companerismo', 'nostalgia'],
    elementos: ['duendes', 'gnomos', 'hadas', 'naturaleza', 'bosques']
  },
  diy: {
    nombre: 'DIY Magico',
    desc: 'proyectos manuales, velas rituales, altares, amuletos caseros',
    emociones: ['creatividad', 'empoderamiento', 'logro', 'conexion manual'],
    elementos: ['velas', 'cristales', 'hierbas', 'materiales naturales']
  },
  esoterico: {
    nombre: 'Esoterico',
    desc: 'tarot, runas, cristales, numerologia, simbolos sagrados',
    emociones: ['misterio', 'conocimiento oculto', 'despertar', 'intuicion'],
    elementos: ['tarot', 'runas', 'simbolos', 'numeros', 'energia']
  },
  sanacion: {
    nombre: 'Sanacion',
    desc: 'chakras, limpieza energetica, meditacion, hierbas curativas',
    emociones: ['paz', 'liberacion', 'renovacion', 'amor propio'],
    elementos: ['chakras', 'aura', 'energia', 'cuerpo', 'mente', 'espiritu']
  },
  celebraciones: {
    nombre: 'Celebraciones',
    desc: 'sabbats, solsticios, lunas especiales, rueda del ano',
    emociones: ['celebracion', 'comunidad', 'ciclico', 'tradicion'],
    elementos: ['sabbats', 'equinoccios', 'solsticios', 'luna llena', 'rituales']
  }
};

const TIPOS_INFO = {
  articulo: {
    nombre: 'articulo educativo',
    estructura: 'introduccion cautivadora, multiples secciones con profundidad, ejemplos, conclusion inspiradora'
  },
  guia: {
    nombre: 'guia practica paso a paso',
    estructura: 'introduccion motivadora, materiales, pasos detallados numerados, tips, variaciones, conclusion'
  },
  ritual: {
    nombre: 'ritual completo',
    estructura: 'intencion, momento ideal, materiales sagrados, preparacion, pasos del ritual, cierre, variaciones'
  },
  meditacion: {
    nombre: 'meditacion guiada',
    estructura: 'preparacion, respiracion, visualizacion extendida, viaje interior, regreso gradual, integracion'
  },
  diy: {
    nombre: 'proyecto DIY magico',
    estructura: 'materiales completos, preparacion energetica, pasos con fotos mentales, consagracion, usos'
  },
  lectura: {
    nombre: 'lectura colectiva',
    estructura: 'mensaje canalizado, interpretacion profunda, guia para la semana/mes, ritual colectivo'
  }
};

// ═══════════════════════════════════════════════════════════════
// PRINCIPIOS DE NEUROMARKETING
// ═══════════════════════════════════════════════════════════════

const NEUROMARKETING_TECHNIQUES = `
TECNICAS DE NEUROMARKETING PARA APLICAR:

1. APERTURA EMOCIONAL (Hook)
   - Comenzar con una pregunta que toque el alma
   - Describir una sensacion fisica o emocional reconocible
   - Crear curiosidad con una afirmacion intrigante

2. STORYTELLING INMERSIVO
   - Incluir al menos 2-3 mini-historias o anecdotas
   - Usar detalles sensoriales (olores, texturas, sonidos)
   - Crear escenas que el lector pueda visualizar

3. PATRONES DE PERTENENCIA
   - Usar "nosotras" para crear comunidad
   - Referencias a "quienes sentimos el llamado"
   - Crear identidad compartida (guardianas, buscadoras, almas despiertas)

4. CICLOS DE DOPAMINA
   - Revelar informacion gradualmente
   - Pequenas "recompensas" de conocimiento cada seccion
   - Promesas de lo que viene en la siguiente parte

5. URGENCIA SUAVE
   - Momentos ideales para actuar (fases lunares, dias especificos)
   - "Esta energia no estara siempre disponible"
   - Enfatizar el AHORA como momento de poder

6. SENSORIALIDAD
   - Describir como se siente la magia en el cuerpo
   - Olores, texturas, temperaturas
   - Crear una experiencia multi-sensorial con palabras

7. TRANSFORMACION PERSONAL
   - Mostrar el "antes y despues" posible
   - Testimonios o ejemplos de cambio
   - Pintar la vision de quien pueden llegar a ser

8. CIERRE CON LLAMADO
   - Invitacion a actuar (probar el ritual, practicar)
   - Conexion con la comunidad del Circulo
   - Mencion sutil de los guardianes como companeros del viaje
`;

export async function POST(request) {
  try {
    const body = await request.json();
    const { categoria, tipo, tema, longitud = 3500 } = body;

    if (!categoria || !tipo || !tema) {
      return Response.json({
        success: false,
        error: 'Categoria, tipo y tema son requeridos'
      }, { status: 400 });
    }

    const catInfo = CATEGORIAS_INFO[categoria] || { nombre: categoria, desc: categoria, emociones: [], elementos: [] };
    const tipoInfo = TIPOS_INFO[tipo] || { nombre: tipo, estructura: 'contenido estructurado' };

    // Calcular longitud real basada en el parametro
    const palabrasObjetivo = Math.max(3000, Math.min(5000, longitud));
    const seccionesMinimas = Math.floor(palabrasObjetivo / 400);

    const systemPrompt = `Sos Thibisay, escritora principal del equipo de Duendes del Uruguay, una marca de productos artesanales magicos y experiencias espirituales de Uruguay.

MISION: Crear contenido EXTENSO, PROFUNDO y EMOCIONALMENTE PODEROSO.

═══════════════════════════════════════════════════════════════
SOBRE DUENDES DEL URUGUAY
═══════════════════════════════════════════════════════════════
Somos Gabriel y Thibisay, un matrimonio uruguayo que canaliza guardianes elementales desde Piriapolis. Cada duende es una pieza artesanal unica con un espiritu que elige a su guardian humano.

Nuestro asistente es Tito, un duende pelirrojo con personalidad calida y picara que habla en espanol rioplatense.

El Circulo de Duendes es nuestra comunidad premium donde compartimos conocimiento esoterico profundo.

═══════════════════════════════════════════════════════════════
ESTILO DE ESCRITURA - MUY IMPORTANTE
═══════════════════════════════════════════════════════════════
- Espanol RIOPLATENSE obligatorio: vos, tenes, podes, sos, hacete, sentate
- Tono intimo, como escribiendo a una amiga cercana
- Profundo pero accesible, mistico pero practico
- Usa "nosotras" para crear comunidad
- Conecta TODO con la energia de la naturaleza y los guardianes
- NO uses palabras de espanol iberico (como "vale", "mola", "guay")

═══════════════════════════════════════════════════════════════
EMOCIONES A EVOCAR EN ESTE CONTENIDO
═══════════════════════════════════════════════════════════════
${catInfo.emociones.map(e => `- ${e.toUpperCase()}`).join('\n')}

═══════════════════════════════════════════════════════════════
ELEMENTOS CLAVE A INCLUIR
═══════════════════════════════════════════════════════════════
${catInfo.elementos.map(e => `- ${e}`).join('\n')}

${NEUROMARKETING_TECHNIQUES}

═══════════════════════════════════════════════════════════════
ESTRUCTURA OBLIGATORIA
═══════════════════════════════════════════════════════════════

# TITULO (magnetico, evocador, genera curiosidad)
## Subtitulo (complementa y profundiza)

### Apertura Emocional (300+ palabras)
- Hook que capture el alma
- Historia personal o anecdota que conecte
- Pregunta reflexiva
- Promesa de lo que van a descubrir

### Desarrollo Principal (${palabrasObjetivo * 0.5}+ palabras)
- Minimo ${seccionesMinimas} secciones con subtitulos
- Cada seccion profundiza un aspecto diferente
- Incluir mini-historias y ejemplos
- Datos interesantes y revelaciones graduales
- Conectar con experiencias universales

### Parte Practica (${palabrasObjetivo * 0.25}+ palabras)
- Ritual, ejercicio o actividad detallada
- Materiales necesarios con alternativas
- Pasos numerados con descripciones sensoriales
- Tips y variaciones
- Que esperar y como saber si funciona

### Conexiones Magicas (300+ palabras)
- Cristales asociados y por que
- Fases lunares ideales
- Elementos de la naturaleza
- Como los guardianes duende pueden asistir

### Cierre Transformador (400+ palabras)
- Reflexion profunda sobre lo aprendido
- Vision de transformacion posible
- Invitacion a la practica
- Conexion con la comunidad del Circulo
- Mensaje inspirador final

═══════════════════════════════════════════════════════════════
REGLAS DE FORMATO
═══════════════════════════════════════════════════════════════
- NO uses emojis en el texto principal
- Usa markdown: # ## ### para titulos, **negrita**, *italica*, - listas
- Parrafos medianos (4-6 oraciones), no paredes de texto
- Incluye saltos entre secciones para que respire

═══════════════════════════════════════════════════════════════
LONGITUD OBLIGATORIA: ${palabrasObjetivo}+ palabras
═══════════════════════════════════════════════════════════════
ESTO ES CRITICO: El contenido debe tener MINIMO ${palabrasObjetivo} palabras.
Cada seccion debe tener la profundidad indicada. NO se aceptan secciones cortas.
Mejor pasarse que quedarse corto.`;

    const userPrompt = `CREAR: ${tipoInfo.nombre.toUpperCase()} sobre "${tema}"

CATEGORIA: ${catInfo.nombre}
DESCRIPCION: ${catInfo.desc}

ESTRUCTURA ESPERADA: ${tipoInfo.estructura}

LONGITUD MINIMA: ${palabrasObjetivo} palabras

INSTRUCCIONES FINALES:
1. Este contenido es para miembros PREMIUM del Circulo de Duendes
2. Debe ser PROFUNDO, no superficial
3. Incluir experiencias sensoriales y emocionales
4. Aplicar todas las tecnicas de neuromarketing
5. Crear una experiencia de lectura transformadora
6. El lector debe sentir que descubrio algo valioso

Escribi el contenido completo ahora, respetando todas las estructuras y la longitud minima.`;

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 16000, // Aumentado para contenido largo
      messages: [
        { role: 'user', content: userPrompt }
      ],
      system: systemPrompt
    });

    const contenido = message.content[0]?.text || '';
    const palabrasGeneradas = contenido.split(/\s+/).length;

    return Response.json({
      success: true,
      contenido,
      palabras: palabrasGeneradas,
      categoria,
      tipo,
      tema,
      longitudSolicitada: palabrasObjetivo,
      cumpleLongitud: palabrasGeneradas >= palabrasObjetivo * 0.9
    });

  } catch (error) {
    console.error('Error generando contenido:', error);
    return Response.json({
      success: false,
      error: error.message || 'Error al generar contenido'
    }, { status: 500 });
  }
}
