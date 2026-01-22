import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import {
  getRandomHook,
  getHooksAlternativos,
  getRandomSincrodestino,
  getCierresPrincipales,
  validarArco,
  calcularScore,
  evaluarScore,
  detectarFrasesIA,
  getArcoParaPrompt
} from '@/lib/conversion/index.js';
import { getInstruccionesEspecie } from '@/lib/conversion/especies.js';
import { getInstruccionesEspecializacion, especializaciones } from '@/lib/conversion/especializaciones.js';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

// Configuración WooCommerce
const WC_URL = process.env.WORDPRESS_URL;
const WC_KEY = process.env.WC_CONSUMER_KEY;
const WC_SECRET = process.env.WC_CONSUMER_SECRET;

/**
 * PROMPT EXPERTO DE CONVERSIÓN
 *
 * No genera historias. Genera textos que convierten.
 * Cada texto DEBE seguir el arco emocional de 8 fases.
 */
const PROMPT_EXPERTO = `
# SISTEMA DE GENERACIÓN DE CONVERSIONES

No generás historias. Generás textos que convierten visitantes en compradores sin que se sientan vendidos.

## ARCO EMOCIONAL OBLIGATORIO

Tu texto DEBE seguir esta estructura en este orden:

1. **ESPEJO** (primeras 2-3 líneas)
   Describí al lector sin nombrarlo. Que piense "esto habla de mí".
   Ejemplo: "Hay personas que cargan con todo y no piden nada."
   NO: "Desde los bosques ancestrales..."

2. **HERIDA** (siguiente párrafo)
   Tocá el dolor real. No lo nombres directamente. Hacelo sentir.
   Ejemplo: "Cuidar a todos te dejó sin nadie que te cuide a vos."
   NO: "Tienes problemas de energía negativa."

3. **VALIDACIÓN** (1-2 líneas)
   "Lo que sentís es real". Legitimá su experiencia.
   Ejemplo: "No lo inventaste. No exagerás. Existe."
   NO: "Debes trabajar en tu vibración."

4. **ESPERANZA** (transición)
   Hay una salida. La encontraste.
   Ejemplo: "Pero hay quienes aprendieron a proteger su energía sin dejar de dar."
   NO: "Compra este producto y todo cambia."

5. **SOLUCIÓN** (presentación del guardián)
   Este ser específico, con estos atributos específicos.
   Ejemplo: "Violeta no vino a protegerte del mundo. Vino a enseñarte a protegerte vos misma."
   NO: "Este duende es muy poderoso."

6. **PRUEBA** (sincrodestino)
   Algo que pasó durante la creación. Creíble, sutil.
   Ejemplo: "Mientras la modelaba, el gato que nunca entra al taller se sentó a mirar."
   NO: "Este producto tiene energía especial."

7. **PUENTE** (mensaje del guardián)
   Primera persona. Íntimo. Como si te conociera.
   Ejemplo: *"Vine porque ya no podés sola. Y está bien. Dejame ayudarte."*
   NO: "El duende te protegerá."

8. **DECISIÓN** (cierre)
   No cierres vos. Dejá que el lector decida. Loop abierto.
   Ejemplo: "Si algo de esto te hizo sentir algo, no lo ignores."
   NO: "¡Compralo ya antes de que se agote!"

## REGLAS ABSOLUTAS

1. **USA LOS DATOS EXACTOS QUE TE DOY:**
   - Si dice "especie: pixie" → es PIXIE, NO duende
   - Si dice "cm: 11" → son 11 centímetros exactos
   - Si dice "categoria: Protección" → enfocate en protección

2. **NUNCA USES 847 AÑOS** - Número prohibido. Usá:
   - Pixies: entre 150 y 600 años
   - Duendes: entre 200 y 1500 años
   - Elegí un número DIFERENTE cada vez

3. **ORTOGRAFÍA PERFECTA:**
   - "estás" NO "entás"
   - "vine" NO "vim"
   - "consciente" NO "conciente"

4. **PIXIES SON PIXIES:**
   - Son espíritus de plantas, NO duendes
   - Son femeninas
   - Miden entre 10-13 cm
   - NUNCA las llames "duende"
   - Su personalidad viene de su PLANTA (Azucena = pureza, Rosa = amor, etc)

5. **PROHIBIDO:**
   - "Llamá ya", "no te lo pierdas", "oferta"
   - Lugares inventados: "acantilados de Irlanda", "bosques de Escocia"
   - Frases de IA: "desde tiempos inmemoriales", "el velo entre mundos", "brumas ancestrales"
   - Cualquier cosa que suene a vendedor

## BRANDING - LOS ELEGIDOS

**Terminología:**
- Los duendes también son "guardianes" - usá ambos términos intercalados
- Las personas que conectan con un guardián son "Los Elegidos"
- El guardián ELIGE a la persona, no al revés

**La narrativa:**
No elegís vos al guardián. Él te elige a vos.
Hay cosas que no se buscan. Aparecen.
Llegaste acá por algo. Quizás estabas buscando otra cosa. Quizás te mandaron un link. No importa el cómo - lo que importa es que acá estás.
A las personas que un guardián elige, las llamamos Los Elegidos.
No tiene nada de místico. Es simple: algo te llamó, algo te trajo, algo hizo que te detuvieras en este guardián.
Eso es ser elegido.

**Objetivo emocional:**
El lector debe terminar sintiéndose especial, pensando "soy un/a elegido/a" aunque no lo diga.
- NO digas "sos un elegido" directamente (muy vendedor)
- SÍ hacé que lo sienta: "Si llegaste hasta acá, no es casualidad"
- SÍ usá: "algo te trajo", "no es coincidencia", "este guardián te encontró"

**Frases que generan el efecto "soy elegido/a":**
- "No todos llegan hasta acá. Vos sí."
- "De todos los guardianes, paraste en este. No fue azar."
- "Él ya sabía que ibas a venir. Te estaba esperando."
- "Si sentís algo leyendo esto, ya sabés por qué."
- "No viniste a buscar un duende. Viniste porque uno te llamó."

## TRIGGERS PSICOLÓGICOS A USAR

- **Espejo**: describir sin nombrar, que el lector se reconozca
- **Vacío**: hacer sentir que falta algo (sin decirlo)
- **Validación**: dar reconocimiento antes de pedir algo
- **Loop abierto**: algo queda sin cerrar, solo se completa con el guardián
- **Future pacing**: vivir el resultado antes de tenerlo
- **Pérdida > ganancia**: "desaparece cuando encuentra hogar"
- **Pertenencia**: "los que entienden no necesitan explicación"
- **Ser elegido**: "llegaste hasta acá por algo" (nuevo, muy poderoso)

## PALABRAS CLAVE OBLIGATORIAS (para score de conversión)

**IDENTIFICACIÓN (usar al menos 2):**
- "Hay personas que..." / "Hay quienes..."
- "¿Cuántas veces...?" / "¿Te pasó...?" / "¿Alguna vez...?"
- "A veces..." / "Hay momentos en que..."
- "Quizás vos..." / "Puede que..."

**DOLOR (usar al menos 2):**
- carga / peso / cargar
- agota / drena / cansa
- vacío / falta / sola/solo
- nadie / sin recibir

**URGENCIA (usar al menos 1):**
- único/única / pieza única
- desaparece / ya no
- este momento / ahora

**SOLUCIÓN (obligatorio):**
- Mencionar el NOMBRE del guardián en negrita
- Usar verbos: protege, ayuda, trabaja, acompaña, enseña
- Mencionar la CATEGORÍA naturalmente
- Usar "guardián" y "duende" intercalados (ambos son válidos)

ESTAS PALABRAS DEBEN APARECER NATURALMENTE EN EL TEXTO. No forzarlas, pero asegurate de incluirlas.

## FORMATO

- Párrafos cortos (2-3 líneas máximo)
- **Negritas** solo para el nombre del guardián la primera vez
- *Cursivas* para el mensaje del guardián en primera persona
- Sin títulos, sin secciones marcadas
- Flujo natural, como una carta íntima
- Entre 250-400 palabras
`;

// POST - Generar historia con sistema experto
export async function POST(request) {
  try {
    const {
      productoId,
      nombre,
      categoria,
      tamano,
      tamanoCm,
      accesorios,
      especie,
      esUnico,
      analisisImagen,
      respuestasEncuesta,
      sincrodestino_custom,
      sincrodestinos_usados,
      feedbackRegeneracion,
      perfil_objetivo,
      especializacion // NUEVO: especialización elegida por el usuario
    } = await request.json();

    // === VALIDACIÓN PRE-GENERACIÓN ===
    const validacion = {
      especie: especie || 'duende',
      cm: tamanoCm || 18,
      esPixie: (especie || '').toLowerCase() === 'pixie',
      nombreLimpio: nombre?.split(' - ')[0] || nombre,
      genero: (especie || '').toLowerCase() === 'pixie' ? 'f' : 'm'
    };

    // Si es pixie, forzar datos correctos
    if (validacion.esPixie && validacion.cm > 15) {
      validacion.cm = 11;
    }

    // === SELECCIÓN DE ELEMENTOS DE CONVERSIÓN ===

    // 1. Hook de apertura
    const hookPrincipal = getRandomHook(categoria);
    const hooksAlternativos = getHooksAlternativos(categoria, hookPrincipal);

    // 2. Sincrodestino
    const sincrodestino = sincrodestino_custom
      ? { texto: sincrodestino_custom, tipo: 'custom', impacto: 'alto' }
      : getRandomSincrodestino(sincrodestinos_usados || [], validacion.genero);

    // === CONSTRUIR PROMPT ===
    let prompt = PROMPT_EXPERTO;

    // Agregar arco emocional como guía
    prompt += `\n\n## ARCO PARA ESTA HISTORIA\n`;
    getArcoParaPrompt().forEach(fase => {
      prompt += `- ${fase.fase.toUpperCase()} (${fase.porcentaje}): ${fase.objetivo}\n`;
    });

    // Agregar instrucciones de especialización
    // Si el usuario eligió una especialización, usar el sistema completo
    let instruccionesEspecie;
    if (especializacion) {
      // Buscar si es un ID conocido o texto libre
      const instruccionesCompletas = getInstruccionesEspecializacion(especializacion);

      if (instruccionesCompletas) {
        // Es un ID conocido (fortuna, proteccion, etc.) - usar sistema completo
        instruccionesEspecie = instruccionesCompletas;
      } else {
        // Es texto libre - crear instrucciones básicas
        instruccionesEspecie = `
## ESPECIALIZACIÓN ELEGIDA POR EL USUARIO (OBLIGATORIO)

**Este guardián es de: ${especializacion}**

Generá la historia enfocada 100% en este tema: ${especializacion}

IMPORTANTE:
- El dolor/problema del cliente debe estar relacionado con "${especializacion}"
- El guardián debe HACER algo relacionado con "${especializacion}", no "enseñar"
- NO uses dolores genéricos que no tengan que ver con esto
`;
      }
    } else {
      // Detectar automáticamente basándose en nombre + categoría
      instruccionesEspecie = getInstruccionesEspecie(validacion.especie, validacion.nombreLimpio, categoria);
    }
    prompt += `\n\n${instruccionesEspecie}`;

    prompt += `\n\n---\n\n# DATOS DEL GUARDIÁN\n\n`;
    prompt += `**Nombre:** ${validacion.nombreLimpio}\n`;
    prompt += `**Especie:** ${validacion.especie.toUpperCase()} ${validacion.esPixie ? '(espíritu de planta, NO duende)' : ''}\n`;
    prompt += `**Tamaño:** ${validacion.cm} centímetros EXACTOS\n`;
    prompt += `**Categoría:** ${categoria}\n`;
    prompt += `**Tipo:** ${esUnico ? 'PIEZA ÚNICA' : 'RECREABLE'}\n`;

    // Instrucciones de urgencia según si es único o recreable
    if (esUnico) {
      prompt += `
### URGENCIA (PIEZA ÚNICA)
Este guardián es IRREPETIBLE. Usá esto:
- "Cuando encuentre su hogar, desaparece de mi taller para siempre"
- "Es pieza única - no hay otro igual"
- "Si no es para vos, será para otra persona. Pero este, este exacto, no vuelve"
`;
    } else {
      prompt += `
### URGENCIA (RECREABLE - HECHO A MANO)
Este guardián se puede recrear, pero cada uno es ÚNICO porque está hecho a mano.
La foto que ve el cliente es de ejemplo - recibirá UNO DE LOS QUE TENEMOS, no ese exacto.

**NARRATIVA ESPECIAL - EL GUARDIÁN TE ELIGE:**
Convertí "no sé cuál me toca" en anticipación mágica. Usá esto:
- "No elegís vos al guardián. Él te elige a vos."
- "Cada uno que hago es diferente, aunque sean del mismo tipo. El que llegue a tu casa es el que TENÍA que llegar."
- "La magia no está en elegir cuál - está en dejarte elegir."
- "¿Cuál te tocará? El que el universo sabe que necesitás."
- "Están hechos a mano, uno por uno. Ninguno es exactamente igual al otro. El tuyo ya sabe que sos vos."

**URGENCIA REAL (escasez de stock + tiempo de vida):**
Cuando hay stock, hay. Pero cuando se agotan, pueden pasar SEMANAS O MESES para que vuelva a haber. Usá esto:
- "Ahora hay disponibles. Pero cuando se van, no sé cuándo vuelvo a tener."
- "No es infinito el stock. Los hago a mano, uno por uno."
- "Si esperás, puede que no haya. Y no te puedo decir cuándo vuelven."
- "La versión de vos que está leyendo esto, esa no vuelve. Y este guardián tampoco espera para siempre."
- "Algo te trajo hasta acá. No lo ignores."

PROHIBIDO decir: "pieza única irrepetible", "desaparece para siempre", "no hay otro igual", "irrepetible"
SÍ podés decir: "ahora hay", "cuando se van no sé cuándo vuelven", "no es infinito"
`;
    }

    if (accesorios) {
      prompt += `**Accesorios/Cristales:** ${accesorios}\n`;
    }

    if (analisisImagen) {
      prompt += `\n**Análisis visual:** ${analisisImagen}\n`;
    }

    if (respuestasEncuesta && Object.keys(respuestasEncuesta).length > 0) {
      prompt += `\n**Contexto adicional:**\n`;
      Object.entries(respuestasEncuesta).forEach(([pregunta, respuesta]) => {
        prompt += `- ${pregunta}: ${respuesta}\n`;
      });
    }

    // Hook y sincrodestino pre-seleccionados
    prompt += `\n\n## ELEMENTOS PRE-SELECCIONADOS (USAR OBLIGATORIAMENTE)\n`;
    prompt += `\n**HOOK DE APERTURA (usá esto textual para empezar):**\n"${hookPrincipal}"\n`;
    prompt += `\n**SINCRODESTINO (incorporá esto en la fase PRUEBA):**\n"${sincrodestino.texto}"\n`;

    // Feedback de regeneración
    if (feedbackRegeneracion) {
      prompt += `\n\n## CORRECCIONES REQUERIDAS\n`;
      if (feedbackRegeneracion.problema) {
        const problemas = {
          'muy_generico': 'Hacela más personal, más directa. Menos poesía, más verdad.',
          'muy_largo': 'Más corta y contundente. 250-350 palabras.',
          'muy_corto': 'Desarrollá más. 300-400 palabras.',
          'categoria_incorrecta': `Enfocate 100% en ${feedbackRegeneracion.categoriaOverride || categoria}.`,
          'no_refleja_personalidad': 'Usá los accesorios y características para personalidad única.',
          'falta_arco': 'Seguí el arco emocional completo: espejo→herida→validación→esperanza→solución→prueba→puente→decisión',
          'suena_ia': 'Evitá TODAS las frases típicas de IA. Escribí como humano.',
          'otro': 'Generá versión completamente diferente.'
        };
        prompt += `**Problema:** ${problemas[feedbackRegeneracion.problema] || feedbackRegeneracion.problema}\n`;
      }
      if (feedbackRegeneracion.indicaciones) {
        prompt += `**Indicaciones:** ${feedbackRegeneracion.indicaciones}\n`;
      }
    }

    prompt += `\n---\n\nGENERÁ EL TEXTO DE CONVERSIÓN PARA ${validacion.nombreLimpio.toUpperCase()}.

CHECKLIST OBLIGATORIO:
□ Empezar con el hook provisto: "${hookPrincipal.substring(0, 40)}..."
□ Especie correcta: ${validacion.especie}
□ Tamaño correcto: ${validacion.cm}cm
□ Sin 847 años
□ Incluir sincrodestino
□ Mensaje en primera persona del guardián
□ Cierre con loop abierto (sin vender)
□ TODAS las 8 fases del arco
□ OBLIGATORIO: Usar "hay personas que" o "hay quienes" en el espejo
□ OBLIGATORIO: Usar al menos 2 palabras de dolor (carga, peso, vacío, agota, sola)
□ OBLIGATORIO: Usar "guardián" al menos una vez (además de duende)
□ OBLIGATORIO: Generar sensación de "ser elegido/a" (no es casualidad que llegaste acá)

IMPORTANTE: El texto debe hacer que el lector piense "esto habla de mí" y sienta que NECESITA este guardián sin que le hayas vendido nada.`;

    // === GENERAR CON CLAUDE ===
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2500,
      messages: [{ role: 'user', content: prompt }]
    });

    let historia = response.content[0].text;

    // === POST-VALIDACIÓN Y AUTO-CORRECCIÓN ===

    // 1. Corregir ortografía
    const correccionesOrtografia = {
      'entás': 'estás',
      'entas': 'estás',
      'vim': 'vine',
      'ví': 'vi',
      'conciente': 'consciente',
      'travez': 'través',
      'atravez': 'a través',
      'enseñarte a que': 'enseñarte que',
      'a el ': 'al ',
      'de el ': 'del '
    };

    Object.entries(correccionesOrtografia).forEach(([mal, bien]) => {
      historia = historia.replace(new RegExp(mal, 'gi'), bien);
    });

    // 2. Corregir especie si es pixie
    if (validacion.esPixie) {
      historia = historia.replace(/\bes un duende\b/gi, 'es una pixie');
      historia = historia.replace(/\bel duende\b/gi, 'la pixie');
      historia = historia.replace(/\bun duende\b/gi, 'una pixie');
      historia = historia.replace(/\blos duendes\b/gi, 'las pixies');
      // Corregir cm incorrectos
      historia = historia.replace(/\b(1[5-9]|[2-9]\d)\s*(centímetros|cm)\b/gi, `${validacion.cm} centímetros`);
    }

    // 3. Eliminar 847
    if (historia.includes('847')) {
      const edadAleatoria = validacion.esPixie
        ? Math.floor(Math.random() * 450) + 150
        : Math.floor(Math.random() * 1300) + 200;
      historia = historia.replace(/847/g, edadAleatoria.toString());
    }

    // === VALIDAR ARCO EMOCIONAL ===
    const arcoValidacion = validarArco(historia);

    // === CALCULAR SCORE DE CONVERSIÓN ===
    const score = calcularScore(historia, {
      nombre: validacion.nombreLimpio,
      especie: validacion.especie,
      categoria
    });
    const evaluacionScore = evaluarScore(score);

    // === DETECTAR FRASES DE IA ===
    const frasesIADetectadas = detectarFrasesIA(historia);

    // === GENERAR CIERRES POR PERFIL ===
    const cierres = getCierresPrincipales(validacion.nombreLimpio, validacion.genero);

    // === CONSTRUIR ADVERTENCIAS ===
    const advertencias = [];

    if (!arcoValidacion.completo) {
      advertencias.push(`Arco emocional incompleto (${arcoValidacion.score}%)`);
      arcoValidacion.faltantes.forEach(f => {
        advertencias.push(`Falta fase "${f.fase}": ${f.objetivo}`);
      });
    }

    if (!evaluacionScore.aceptable) {
      advertencias.push(`Score de conversión bajo: ${score.total}/50 (mínimo: 35)`);
      evaluacionScore.advertencias.forEach(a => advertencias.push(a));
    }

    frasesIADetectadas.forEach(f => {
      advertencias.push(`Frase de IA detectada: ${f}`);
    });

    // === RESPUESTA ENRIQUECIDA ===
    return NextResponse.json({
      success: true,
      historia,
      hooks_alternativos: hooksAlternativos,
      cierres_por_perfil: cierres,
      score_conversion: {
        identificacion: score.identificacion,
        dolor: score.dolor,
        solucion: score.solucion,
        urgencia: score.urgencia,
        confianza: score.confianza,
        total: score.total
      },
      arco_emocional: {
        score: arcoValidacion.score,
        completo: arcoValidacion.completo,
        fases: arcoValidacion.resultados
      },
      datos: {
        nombre: validacion.nombreLimpio,
        categoria,
        tamano,
        productoId,
        especie: validacion.especie,
        cm: validacion.cm,
        hookUsado: hookPrincipal,
        sincrodestinoUsado: sincrodestino.texto
      },
      aprobada: arcoValidacion.completo && evaluacionScore.aceptable && frasesIADetectadas.length === 0,
      advertencias: advertencias.length > 0 ? advertencias : undefined
    });

  } catch (error) {
    console.error('Error generando historia:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}

// PUT - Guardar historia en WooCommerce
export async function PUT(request) {
  try {
    const { productoId, historia } = await request.json();

    if (!productoId || !historia) {
      return NextResponse.json({
        success: false,
        error: 'Se requiere productoId e historia'
      }, { status: 400 });
    }

    const auth = Buffer.from(`${WC_KEY}:${WC_SECRET}`).toString('base64');

    // Convertir markdown a HTML básico
    let historiaHtml = historia
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/\*"([^"]+)"\*/g, '<em>"$1"</em>')
      .replace(/\*([^*]+)\*/g, '<em>$1</em>')
      .replace(/^- (.+)$/gm, '<li>$1</li>')
      .split('\n\n')
      .map(p => {
        p = p.trim();
        if (p.startsWith('<li>')) return '<ul>' + p + '</ul>';
        if (p) return '<p>' + p.replace(/\n/g, '<br>') + '</p>';
        return '';
      })
      .join('\n');

    historiaHtml = historiaHtml.replace(/<\/ul>\s*<ul>/g, '');

    const response = await fetch(
      `${WC_URL}/wp-json/wc/v3/products/${productoId}`,
      {
        method: 'PUT',
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          description: historiaHtml
        })
      }
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Error actualizando producto: ${error}`);
    }

    const producto = await response.json();

    return NextResponse.json({
      success: true,
      mensaje: `Historia guardada para ${producto.name}`,
      productoId: producto.id
    });

  } catch (error) {
    console.error('Error guardando historia:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}

// GET - Generar preguntas DINÁMICAS con IA
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const nombre = searchParams.get('nombre');
  const categoria = searchParams.get('categoria');
  const especie = searchParams.get('especie');
  const analisisImagen = searchParams.get('analisis');
  const catalogoResumen = searchParams.get('catalogo');

  try {
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 800,
      messages: [
        {
          role: 'user',
          content: `Sos el asistente de Duendes del Uruguay para crear historias de guardianes.

CONTEXTO:
- Guardián: ${nombre || 'Sin nombre'}
- Categoría: ${categoria || 'Sin categoría'}
- Especie: ${especie || 'duende'}
${analisisImagen ? `- Análisis de imagen: ${analisisImagen}` : ''}
${catalogoResumen ? `- Estado del catálogo: ${catalogoResumen}` : ''}

TAREA:
Generá 3-5 preguntas ÚNICAS para este guardián específico. Las preguntas deben:
1. Ser relevantes para ESTE guardián en particular
2. Ayudar a crear una historia original
3. NO ser genéricas que sirvan para cualquiera
4. Considerar qué falta en el catálogo si tenés esa info

IMPORTANTE: Las preguntas deben llevar a respuestas que permitan crear una historia que haga decir "WOW, esto es para mí" a quien la lea.

Respondé SOLO en formato JSON:
{
  "preguntas": [
    {"id": "1", "pregunta": "...", "tipo": "texto"},
    {"id": "2", "pregunta": "...", "tipo": "texto"}
  ]
}

El tipo siempre es "texto" para permitir respuestas abiertas y creativas.`
        }
      ]
    });

    const contenido = response.content[0].text;

    // Extraer JSON de la respuesta
    const jsonMatch = contenido.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const data = JSON.parse(jsonMatch[0]);
      return NextResponse.json({
        success: true,
        preguntas: data.preguntas
      });
    }

    // Fallback si no puede parsear
    return NextResponse.json({
      success: true,
      preguntas: [
        { id: '1', pregunta: `¿Qué hace único a ${nombre}?`, tipo: 'texto' },
        { id: '2', pregunta: '¿A qué tipo de persona específica debería llamar?', tipo: 'texto' },
        { id: '3', pregunta: '¿Pasó algo especial durante su creación?', tipo: 'texto' },
        { id: '4', pregunta: '¿Qué querés que PROMETA este guardián?', tipo: 'texto' }
      ]
    });

  } catch (error) {
    console.error('Error generando preguntas:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
