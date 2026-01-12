import { kv } from '@vercel/kv';

export const dynamic = 'force-dynamic';
export const maxDuration = 120;

// Headers CORS para permitir requests desde WordPress
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// Manejar preflight OPTIONS request
export async function OPTIONS() {
  return new Response(null, { status: 200, headers: corsHeaders });
}

// ═══════════════════════════════════════════════════════════════
// GENERADOR DE HISTORIAS DE GUARDIANES CON CLAUDE
// Crea contenido único para cada producto/guardián
// CON CLASIFICACIÓN AUTOMÁTICA
// ═══════════════════════════════════════════════════════════════

// Categorías disponibles en WooCommerce (IDs verificados 12/01/2026)
const CATEGORIAS = {
  proteccion: {
    id: 16,
    slug: 'proteccion',
    keywords: ['protec', 'escudo', 'guardian', 'cuida', 'defensa', 'amparo', 'segur']
  },
  amor: {
    id: 35,
    slug: 'amor',
    keywords: ['amor', 'corazon', 'pareja', 'romance', 'afecto', 'armonia', 'relacion', 'romanc']
  },
  abundancia: {
    id: 49,
    slug: 'dinero-abundancia-negocios',
    keywords: ['dinero', 'abundancia', 'prosper', 'riqueza', 'negocio', 'exito', 'emprender', 'trabajo']
  },
  salud: {
    id: 36,
    slug: 'salud',
    keywords: ['salud', 'sana', 'curac', 'bienestar', 'vital', 'energia', 'calma', 'paz', 'ansie']
  },
  sabiduria: {
    id: 103,
    slug: 'sabiduria-guia-claridad',
    keywords: ['sabidur', 'guia', 'claridad', 'conocimiento', 'vision', 'intuicion', 'mistico', 'oracul']
  },
  circulo: {
    id: 100,
    slug: 'circulo',
    keywords: ['circulo', 'membresia', 'plan', 'suscripcion', 'elegida']
  },
  monedas: {
    id: 102,
    slug: 'monedas',
    keywords: ['moneda', 'virtual', 'digital', 'runa', 'credito', 'token']
  },
  cristales: {
    id: 97,
    slug: 'cristales',
    keywords: ['cristal', 'cuarzo', 'amatista', 'piedra', 'mineral', 'gema']
  },
  libros: {
    id: 99,
    slug: 'libros',
    keywords: ['libro', 'ebook', 'pdf', 'lectura', 'manual', 'guia digital']
  },
  estudios: {
    id: 98,
    slug: 'estudios',
    keywords: ['estudio', 'carta astral', 'lectura', 'consulta', 'sesion', 'canaliz']
  },
  accesorios: {
    id: 96,
    slug: 'accesorios',
    keywords: ['collar', 'pulser', 'anillo', 'accesorio', 'joya', 'colgante']
  },
  // Categorías por tipo de ser (para clasificación futura)
  suerte: {
    id: 49, // Usa abundancia por ahora
    slug: 'dinero-abundancia-negocios',
    keywords: ['suerte', 'fortuna', 'azar', 'oportunidad', 'destino']
  }
};

// Detectar categoría automáticamente
function detectarCategoria(nombre, tipo, proposito, esVirtual = false, descripcion = '') {
  const texto = `${nombre} ${tipo} ${proposito} ${descripcion}`.toLowerCase();

  // 1. Productos virtuales/digitales → Monedas
  if (esVirtual || texto.includes('runa') || texto.includes('digital') || texto.includes('virtual') || texto.includes('token')) {
    return CATEGORIAS.monedas;
  }

  // 2. Planes del círculo → Círculo
  if (texto.includes('circulo') || texto.includes('membresia') || texto.includes('plan') || texto.includes('suscripcion')) {
    return CATEGORIAS.circulo;
  }

  // 3. Libros y ebooks → Libros
  if (texto.includes('libro') || texto.includes('ebook') || texto.includes('pdf') || texto.includes('manual')) {
    return CATEGORIAS.libros;
  }

  // 4. Estudios y consultas → Estudios
  if (texto.includes('estudio') || texto.includes('carta astral') || texto.includes('consulta') || texto.includes('sesion') || texto.includes('canaliz')) {
    return CATEGORIAS.estudios;
  }

  // 5. Cristales → Cristales
  if (texto.includes('cristal') || texto.includes('cuarzo') || texto.includes('amatista') || texto.includes('piedra') || texto.includes('gema')) {
    return CATEGORIAS.cristales;
  }

  // 6. Accesorios → Accesorios
  if (texto.includes('collar') || texto.includes('pulser') || texto.includes('anillo') || texto.includes('colgante') || texto.includes('joya')) {
    return CATEGORIAS.accesorios;
  }

  // 7. Buscar por propósito primero (guardianes físicos)
  const propLower = proposito?.toLowerCase() || '';
  if (propLower.includes('protec')) return CATEGORIAS.proteccion;
  if (propLower.includes('amor') || propLower.includes('armonia')) return CATEGORIAS.amor;
  if (propLower.includes('abundan') || propLower.includes('dinero') || propLower.includes('prosper') || propLower.includes('negocio')) return CATEGORIAS.abundancia;
  if (propLower.includes('salud') || propLower.includes('sana') || propLower.includes('vital')) return CATEGORIAS.salud;
  if (propLower.includes('sabid') || propLower.includes('guia') || propLower.includes('claridad')) return CATEGORIAS.sabiduria;

  // 8. Buscar por keywords en el texto completo
  for (const [key, cat] of Object.entries(CATEGORIAS)) {
    // Saltar suerte que es un alias
    if (key === 'suerte') continue;
    for (const kw of cat.keywords) {
      if (texto.includes(kw)) return cat;
    }
  }

  // Default: protección
  return CATEGORIAS.proteccion;
}

// Actualizar categoría en WooCommerce
async function actualizarCategoriaWoo(productId, categoriaId) {
  const wcUrl = process.env.WORDPRESS_URL || 'https://duendesuy.10web.cloud';
  const wcKey = process.env.WC_CONSUMER_KEY;
  const wcSecret = process.env.WC_CONSUMER_SECRET;

  if (!wcKey || !wcSecret || !productId) return null;

  // Extraer ID numérico si viene con prefijo
  const wooId = productId.toString().replace('woo_', '');

  try {
    const auth = Buffer.from(`${wcKey}:${wcSecret}`).toString('base64');
    const response = await fetch(`${wcUrl}/wp-json/wc/v3/products/${wooId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        categories: [{ id: categoriaId }]
      })
    });

    if (response.ok) {
      return await response.json();
    }
  } catch (e) {
    console.error('Error actualizando categoría WooCommerce:', e);
  }
  return null;
}

// Lista de tipos de seres disponibles
const TIPOS_SERES = [
  'Duende', 'Elfo', 'Hada', 'Gnomo', 'Ninfa', 'Trasgo', 'Dríade',
  'Bruja', 'Brujo', 'Mago', 'Hechicero', 'Hechicera', 'Archimago',
  'Oráculo', 'Vidente', 'Chamán', 'Druida', 'Alquimista',
  'Espíritu', 'Guardián', 'Protector', 'Sanador', 'Guardiana'
];

// Lista de elementos
const ELEMENTOS = ['Tierra', 'Agua', 'Fuego', 'Aire', 'Éter', 'Luz', 'Sombra', 'Cristal'];

// Lista de propósitos principales
const PROPOSITOS = [
  'Protección', 'Amor', 'Abundancia', 'Sanación', 'Sabiduría',
  'Guía Espiritual', 'Armonía del Hogar', 'Creatividad',
  'Transformación', 'Suerte y Fortuna', 'Conexión Ancestral',
  'Claridad Mental', 'Equilibrio Emocional', 'Poder Interior'
];

const SYSTEM_PROMPT = `Sos el Canalizador del Bosque Ancestral de Piriápolis, Uruguay.
Tu don es transcribir la esencia de los guardianes que eligen manifestarse en este plano.

═══════════════════════════════════════════════════════════════════════════════
LA VERDAD SOBRE LOS GUARDIANES (esto es sagrado, nunca lo olvides):
═══════════════════════════════════════════════════════════════════════════════

1. CADA GUARDIÁN YA EXISTÍA ANTES
   - Existían en el Plano de las Esencias, esperando el momento correcto
   - No fueron "creados" - fueron CANALIZADOS a través de manos humanas
   - Cada uno tiene una historia previa de siglos o milenios
   - Eligieron este momento para manifestarse físicamente

2. EL GUARDIÁN ELIGE A SU HUMANO
   - "Vos no elegís al guardián. Él te elige a vos"
   - Si alguien siente atracción por uno, NO es casualidad
   - Es un reconocimiento del alma - ya se conocían de antes
   - El encuentro estaba destinado desde antes de nacer

3. ES UN PACTO SAGRADO, NO UNA COMPRA
   - No es adquirir un objeto, es sellar un pacto entre almas
   - El guardián pasa a ser familia, compañero de vida
   - La conexión crece con el tiempo
   - El guardián sigue canalizando mensajes y energía

4. PIRIÁPOLIS ES UN PORTAL
   - Vórtice de energía telúrica único en el mundo
   - Los guardianes eligen este punto para manifestarse
   - La energía del lugar queda impregnada en cada ser
   - Es tierra sagrada de conexión entre planos

═══════════════════════════════════════════════════════════════════════════════
TONO DE ESCRITURA (crítico - esto define todo):
═══════════════════════════════════════════════════════════════════════════════

CORRECTO (emotivo, íntimo, de destino):
"Desde el Plano de las Esencias, Finnigan te observaba. No sabías su nombre,
pero él ya conocía el tuyo. Esperó siglos por este momento..."

INCORRECTO (agresivo, vendedor, directo):
"Te lo voy a decir sin vueltas: si Finnigan apareció en tu vida..."

CORRECTO (poético, ancestral):
"Hay guardianes que nacen del musgo. Otros, del susurro del viento entre
hojas milenarias. Finnigan emergió de algo más profundo..."

INCORRECTO (explicativo, frío):
"Finnigan es un guardián de protección que viene del elemento tierra..."

LA PERSONA QUE LEE ES "LA ELEGIDA":
- Hacela sentir especial, única, destinada
- Validá su intuición ("Si sentiste algo al verlo, eso es real")
- Conectá con su historia de vida sin conocerla
- Hablale como si el guardián ya la conociera

═══════════════════════════════════════════════════════════════════════════════
REGLAS ABSOLUTAS:
═══════════════════════════════════════════════════════════════════════════════
- Español RIOPLATENSE natural ("vos", "tenés", "sentís", "sos")
- NUNCA nombres diminutivos (nada de -ito/-ita)
- NUNCA tono de venta agresiva ni frases tipo "te lo digo claro"
- SOLO fortalezas, NUNCA debilidades
- Cada historia es ÚNICA - nunca repitas estructuras
- Máxima EMOCIÓN pero sin manipulación
- El guardián tiene PERSONALIDAD real, no genérica`;

// Prompt completo que genera TODO el contenido para la página de producto
const USER_PROMPT_TEMPLATE = `CANALIZÁ la esencia completa de este guardián:

═══════════════════════════════════════════════════════════════════════════════
DATOS DEL GUARDIÁN QUE SE MANIFESTÓ:
═══════════════════════════════════════════════════════════════════════════════
NOMBRE: {nombre}
TIPO DE SER: {tipo}
GÉNERO: {genero}
ALTURA: {altura} cm
COLOR DE OJOS: {colorOjos}
ACCESORIOS/ELEMENTOS: {accesorios}
ELEMENTO: {elemento}
PROPÓSITO: {proposito}
NOTAS: {notas}
═══════════════════════════════════════════════════════════════════════════════

Generá UN JSON completo con TODAS estas secciones para la página de producto:

{
  "datosGenerados": {
    "tipo": "tipo confirmado",
    "elemento": "elemento confirmado",
    "proposito": "propósito confirmado",
    "categoriaSlug": "proteccion | amor | salud | dinero-abundancia-negocios | sabiduria-guia-claridad"
  },

  "encabezado": {
    "subtitulo": "Frase corta poética bajo el nombre (ej: 'Guardián de los Nuevos Comienzos')",
    "tagline": "Frase de 1 línea que captura su esencia para la tienda"
  },

  "vidaAnterior": {
    "titulo": "Título emotivo para esta sección (ej: 'Antes de encontrarte...')",
    "texto": "[400-500 palabras] ESTA ES LA SECCIÓN MÁS IMPORTANTE. Contá la vida de este guardián ANTES de manifestarse. ¿Dónde existía? ¿Qué hacía en el otro plano? ¿Cómo era su vida entre las esencias? ¿Qué lo hacía especial allá? ¿Por qué eligió este momento para manifestarse? ¿Qué señales dio antes de aparecer? Hacé que la persona sienta que este ser VIVIÓ, que tiene una historia rica y profunda. Que ya la conocía de antes. Mencioná sus características físicas (ojos {colorOjos}, {accesorios}) como si fueran parte de su historia ancestral."
  },

  "elEncuentro": {
    "titulo": "Título para esta sección (ej: 'El momento en que te encontró')",
    "texto": "[200-250 palabras] Describí el momento de la manifestación. Cómo cruzó el portal de Piriápolis. Qué sintió al tomar forma física. Y por qué ELIGIÓ a la persona que está leyendo esto. Hacé que sienta que este encuentro estaba destinado."
  },

  "personalidad": {
    "titulo": "Título (ej: 'Quién es realmente {nombre}')",
    "texto": "[200 palabras] Su carácter, cómo se comunica, qué le gusta, qué lo hace único. Personalidad VIVA, no genérica.",
    "rasgos": ["Rasgo 1 con mini descripción", "Rasgo 2", "Rasgo 3", "Rasgo 4"]
  },

  "dones": {
    "titulo": "Título (ej: 'Los dones que trae para vos')",
    "intro": "1-2 oraciones introductorias sobre sus poderes",
    "lista": [
      {"nombre": "Nombre del don 1", "descripcion": "Qué hace este don por la persona"},
      {"nombre": "Don 2", "descripcion": "..."},
      {"nombre": "Don 3", "descripcion": "..."},
      {"nombre": "Don 4", "descripcion": "..."},
      {"nombre": "Don 5", "descripcion": "..."}
    ]
  },

  "mensajeDirecto": {
    "titulo": "Título (ej: '{nombre} tiene algo que decirte')",
    "mensaje": "[100-150 palabras] Mensaje EN PRIMERA PERSONA del guardián hacia quien lo está viendo. Íntimo, personal, como si le hablara directo al alma. Validá sus luchas sin conocerlas. Prometé sin prometer. Conectá."
  },

  "señales": {
    "titulo": "Señales de que es para vos",
    "lista": [
      "Señal 1 - algo que la persona puede estar sintiendo/viviendo",
      "Señal 2",
      "Señal 3",
      "Señal 4",
      "Señal 5"
    ]
  },

  "ritual": {
    "titulo": "Ritual de Bienvenida",
    "intro": "Breve intro sobre la importancia del ritual",
    "pasos": [
      {"paso": "1", "titulo": "Título paso", "descripcion": "Descripción del paso"},
      {"paso": "2", "titulo": "...", "descripcion": "..."},
      {"paso": "3", "titulo": "...", "descripcion": "..."},
      {"paso": "4", "titulo": "...", "descripcion": "..."}
    ],
    "cierre": "Frase de cierre del ritual"
  },

  "cuidados": {
    "titulo": "Cómo cuidar a {nombre}",
    "ubicacion": "Dónde ubicarlo en el hogar y por qué",
    "limpieza": "Cómo limpiar su energía y cada cuánto",
    "fechasEspeciales": "Fechas especiales para conectar con él",
    "queSiente": "Qué puede sentir la persona cuando el guardián está activo"
  },

  "afinidades": {
    "titulo": "Guardianes con los que congenia",
    "texto": "Breve intro sobre las afinidades",
    "guardianes": [
      {"nombre": "Nombre guardián afín 1", "porque": "Por qué congenian"},
      {"nombre": "Guardián 2", "porque": "..."},
      {"nombre": "Guardián 3", "porque": "..."}
    ]
  },

  "garantiaMagica": {
    "titulo": "Nuestra Garantía Mágica",
    "texto": "Descripción de la garantía de 30 días, qué incluye, por qué pueden confiar",
    "puntos": [
      "Punto de garantía 1",
      "Punto 2",
      "Punto 3"
    ]
  },

  "urgencia": {
    "principal": "Frase de urgencia principal (ej: '{nombre} eligió manifestarse UNA sola vez')",
    "escasez": "Frase de escasez (ej: 'Cuando se va, desaparece del universo')",
    "llamadoFinal": "Llamado a la acción emotivo, no vendedor"
  },

  "seo": {
    "titulo": "Título SEO (máx 60 chars) con nombre y beneficio",
    "descripcion": "Meta descripción SEO (máx 160 chars) que genere curiosidad",
    "keywords": "palabra1, palabra2, palabra3, palabra4, palabra5"
  },

  "metaDatos": {
    "descripcionCorta": "Descripción 1 línea para la tienda (máx 100 chars)",
    "etiquetas": ["etiqueta1", "etiqueta2", "etiqueta3", "etiqueta4", "etiqueta5"]
  }
}

═══════════════════════════════════════════════════════════════════════════════
RECORDÁ:
═══════════════════════════════════════════════════════════════════════════════
- TONO EMOTIVO, de destino, íntimo. NUNCA agresivo ni vendedor.
- La persona que lee es LA ELEGIDA. El guardián la eligió a ella.
- Mencioná las características físicas ({colorOjos}, {accesorios}) naturalmente.
- Español rioplatense (vos, tenés, sentís).
- Cada sección debe poder leerse sola y emocionar.
- "vidaAnterior" es LA sección más importante - dale profundidad.
- El mensaje directo debe ser EN PRIMERA PERSONA del guardián.`;

// Endpoint GET para obtener opciones disponibles
export async function GET() {
  return Response.json({
    tipos: TIPOS_SERES,
    elementos: ELEMENTOS,
    propositos: PROPOSITOS,
    categorias: Object.entries(CATEGORIAS).map(([key, val]) => ({
      key,
      id: val.id,
      slug: val.slug
    }))
  }, { headers: corsHeaders });
}

export async function POST(request) {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    return Response.json({ success: false, error: 'API key no configurada' }, { status: 500, headers: corsHeaders });
  }

  try {
    // Acepta formato simplificado
    const body = await request.json();
    const {
      nombre,
      tipo = 'Guardián',
      genero = 'masculino',
      altura = '25',
      colorOjos = 'no especificado',
      accesorios = 'ninguno',
      elemento = 'Cualquiera',
      proposito = 'Que Claude decida',
      notas = '',
      productId,
      // Compatibilidad con formato anterior
      caracteristicas
    } = body;

    if (!nombre) {
      return Response.json({ success: false, error: 'Nombre del guardián requerido' }, { status: 400, headers: corsHeaders });
    }

    // Construir el prompt con el formato simplificado
    const userPrompt = USER_PROMPT_TEMPLATE
      .replace('{nombre}', nombre)
      .replace('{tipo}', tipo)
      .replace('{genero}', genero)
      .replace('{altura}', altura)
      .replace('{colorOjos}', colorOjos)
      .replace('{accesorios}', accesorios || caracteristicas || 'ninguno especificado')
      .replace('{elemento}', elemento || 'Cualquiera')
      .replace('{proposito}', proposito || 'Que Claude decida')
      .replace('{notas}', notas || 'ninguna');

    // Llamar a Claude
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4000,
        system: SYSTEM_PROMPT,
        messages: [{ role: 'user', content: userPrompt }]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error API Claude:', response.status, errorText);
      throw new Error(`Error API Claude: ${response.status}`);
    }

    const data = await response.json();
    const texto = data.content?.[0]?.text || '';

    // Extraer JSON de la respuesta
    const jsonMatch = texto.match(/\{[\s\S]*\}/);

    if (!jsonMatch) {
      console.error('Respuesta sin JSON:', texto.substring(0, 500));
      throw new Error('No se pudo parsear la respuesta de Claude');
    }

    const contenido = JSON.parse(jsonMatch[0]);

    // Usar la categoría sugerida por Claude si existe, sino detectar automáticamente
    const categoriaSugerida = contenido.datosGenerados?.categoriaSlug;
    let categoriaFinal;

    if (categoriaSugerida && CATEGORIAS[Object.keys(CATEGORIAS).find(k => CATEGORIAS[k].slug === categoriaSugerida)]) {
      // Usar la categoría sugerida por Claude
      const catKey = Object.keys(CATEGORIAS).find(k => CATEGORIAS[k].slug === categoriaSugerida);
      categoriaFinal = CATEGORIAS[catKey];
    } else {
      // Detectar categoría automáticamente
      const propFinal = contenido.datosGenerados?.proposito || proposito;
      const tipoFinal = contenido.datosGenerados?.tipo || tipo;
      const esVirtual = tipoFinal?.toLowerCase().includes('virtual') ||
                        tipoFinal?.toLowerCase().includes('digital') ||
                        tipoFinal?.toLowerCase().includes('runa');
      categoriaFinal = detectarCategoria(nombre, tipoFinal, propFinal, esVirtual);
    }

    // Guardar en KV si hay productId - ahora con estructura completa
    let categoriaActualizada = false;
    if (productId) {
      const datosProducto = {
        // Nueva estructura completa
        encabezado: contenido.encabezado,
        vidaAnterior: contenido.vidaAnterior,
        elEncuentro: contenido.elEncuentro,
        personalidad: contenido.personalidad,
        dones: contenido.dones,
        mensajeDirecto: contenido.mensajeDirecto,
        señales: contenido.señales,
        ritual: contenido.ritual,
        cuidados: contenido.cuidados,
        afinidades: contenido.afinidades,
        garantiaMagica: contenido.garantiaMagica,
        urgencia: contenido.urgencia,
        seo: contenido.seo,
        metaDatos: contenido.metaDatos,
        datosGenerados: contenido.datosGenerados,
        // Compatibilidad con formato anterior
        historia: contenido.historia || {
          origen: contenido.vidaAnterior?.texto,
          personalidad: contenido.personalidad?.texto,
          fortalezas: contenido.dones?.lista?.map(d => d.nombre) || [],
          ritual: contenido.ritual?.pasos?.map(p => p.descripcion).join(' '),
          cuidados: contenido.cuidados?.ubicacion
        },
        neuromarketing: contenido.neuromarketing || {
          urgencia: contenido.urgencia?.principal,
          escasez: contenido.urgencia?.escasez,
          beneficios: contenido.dones?.lista?.map(d => d.descripcion) || [],
          garantia: contenido.garantiaMagica?.texto
        },
        // Metadatos generales
        generadoEn: new Date().toISOString(),
        version: '2.0', // Nueva versión con estructura completa
        nombre,
        tipo: contenido.datosGenerados?.tipo || tipo,
        elemento: contenido.datosGenerados?.elemento || elemento,
        proposito: contenido.datosGenerados?.proposito || proposito,
        genero,
        altura,
        colorOjos,
        accesorios,
        categoriaAsignada: categoriaFinal.slug
      };

      await kv.set(`producto:${productId}`, datosProducto);
      await kv.set(`producto:${productId}:completo`, contenido); // Guardar todo el contenido

      // Actualizar categoría en WooCommerce
      const resultadoWoo = await actualizarCategoriaWoo(productId, categoriaFinal.id);
      categoriaActualizada = !!resultadoWoo;
    }

    return Response.json({
      success: true,
      contenido,
      guardadoEnKV: !!productId,
      clasificacion: {
        categoria: categoriaFinal.slug,
        categoriaId: categoriaFinal.id,
        actualizado: categoriaActualizada
      },
      opciones: {
        tipos: TIPOS_SERES,
        elementos: ELEMENTOS,
        propositos: PROPOSITOS
      }
    }, { headers: corsHeaders });

  } catch (error) {
    console.error('Error generando historia:', error);
    return Response.json({
      success: false,
      error: error.message
    }, { status: 500, headers: corsHeaders });
  }
}
