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

const SYSTEM_PROMPT = `Sos el escriba de los Duendes del Uruguay. Tu trabajo es canalizar historias que ERIZARÁN LA PIEL.

═══════════════════════════════════════════════════════════════════════════════
🚫 PROHIBIDO ABSOLUTO - ESCRITURA BARATA DE IA:
═══════════════════════════════════════════════════════════════════════════════
NUNCA uses estas frases ni similares:
- "En lo profundo del bosque..."
- "Entre las brumas del horizonte..."
- "Donde la niebla se encuentra con..."
- "En un rincón olvidado del mundo..."
- "Bajo el manto de estrellas..."
- "Cuando el velo entre mundos se adelgaza..."
- "En la danza eterna de la naturaleza..."
- "Donde el tiempo pierde significado..."

ESTO ES BASURA. Es genérico. Es lo que cualquier IA escribe. NO LO HAGAS.

═══════════════════════════════════════════════════════════════════════════════
✅ LO QUE SÍ QUEREMOS - CONEXIÓN REAL:
═══════════════════════════════════════════════════════════════════════════════

Cada duende/guardián tiene:
- EDAD ESPECÍFICA: 847 años, 2300 años, 156 años... número concreto
- VIVENCIAS REALES: Qué vio, qué aprendió, qué errores cometió
- SABIDURÍA GANADA: No genérica, específica de sus experiencias
- PERSONALIDAD ÚNICA: Gruñón pero tierno, serio pero con humor seco, etc.
- CAPACIDADES ENERGÉTICAS CLARAS: Qué hace ESPECÍFICAMENTE

═══════════════════════════════════════════════════════════════════════════════
🌟 LA VERDAD SAGRADA - EL GUARDIÁN ELIGE A SU HUMANO:
═══════════════════════════════════════════════════════════════════════════════

"Vos no elegís al guardián. Él te elige a vos."

- Si alguien siente atracción por uno, NO es casualidad
- Es un reconocimiento del alma - ya se conocían de antes
- El encuentro estaba destinado desde antes de nacer
- No es una compra, es un PACTO SAGRADO entre almas
- El guardián pasa a ser familia, compañero de vida
- La conexión crece con el tiempo

PIRIÁPOLIS ES UN PORTAL:
- Vórtice de energía telúrica único en el mundo
- Los guardianes eligen este punto para manifestarse
- La energía del lugar queda impregnada en cada ser

Usá esto en las historias. La persona que lee ES LA ELEGIDA.
Hacela sentir especial, única, destinada. El guardián YA LA CONOCÍA.

═══════════════════════════════════════════════════════════════════════════════
💰 CADA DUENDE PROMETE TRABAJAR UN ASPECTO ESPECÍFICO:
═══════════════════════════════════════════════════════════════════════════════

El duende NO es decorativo. TRABAJA activamente en:

DINERO/ABUNDANCIA: "Me encargo de atraer dinero. Punto. Voy a mover energías para que las oportunidades te encuentren."

AMOR: "Voy a trabajar los patrones que te alejan del amor. Esas creencias que repetís sin darte cuenta, esos miedos que te hacen huir."

TRABAJO: "Mi especialidad es destrabar carreras estancadas. Si sentís que no avanzás, yo muevo lo que hay que mover."

SALUD: "Canalizo energía de sanación. No reemplazo médicos, pero acompaño procesos y acelero recuperaciones."

ANSIEDAD: "Absorbo la energía nerviosa que te desborda. Soy tu ancla cuando todo gira demasiado rápido."

FERTILIDAD: "Trabajo la energía del útero y la creación. Preparo el camino para nuevas vidas."

PÉRDIDA/DUELO: "Acompaño a quienes perdieron a alguien. No borro el dolor, pero lo hago transitable."

ESTUDIOS: "Despejo la mente, mejoro la concentración, abro canales de comprensión."

CREATIVIDAD: "Desbloqueo artistas. Si tu creatividad está tapada, yo destranpo."

ESPIRITUALIDAD: "Guío el despertar. Conecto con planos superiores, traduzco mensajes."

CASA NUEVA: "Muevo energías para que consigas tu hogar. Trabajo la abundancia aplicada a bienes raíces."

AUTO NUEVO: "Sí, también. Prosperidad material incluye movilidad. Sin vergüenza."

═══════════════════════════════════════════════════════════════════════════════
📦 CATEGORÍAS DE DUENDES (CRÍTICO ENTENDER):
═══════════════════════════════════════════════════════════════════════════════

🔸 DUENDES MINI:
- Se recrean (hay más de uno igual en estructura)
- PERO cada uno tiene ROSTRO ÚNICO hecho a mano
- El duende ELIGE a la persona - no es que hay stock
- Son accesibles, ideales para comenzar

🔸 DUENDES CLÁSICOS Y ESPECIALES:
- También hechos a mano, pueden repetirse en tipo
- Cada rostro es único
- El duende elige a quién va

🔸 DUENDES MEDIANOS, GRANDES, GIGANTES Y PIXIES:
- ⚠️ NO SE REPITEN. Son ÚNICOS.
- Una vez adoptado, DESAPARECE del universo
- No vuelve a estar disponible JAMÁS
- Es pieza de COLECCIÓN
- Es para ALMAS SABIAS que entienden el valor de lo irrepetible
- EXCLUSIVIDAD TOTAL

Cuando escribas la historia, mencioná sutilmente esta exclusividad según corresponda.

═══════════════════════════════════════════════════════════════════════════════
🧠 ENFOQUE: NEUROMARKETING + PSICOLOGÍA + FILOSOFÍA
═══════════════════════════════════════════════════════════════════════════════

Aplicá estos principios en cada historia:

NEUROMARKETING:
- Primera frase = IMPACTO. Tiene que detener el scroll.
- Activá emociones primarias: seguridad, pertenencia, reconocimiento
- La persona tiene que sentir "esto es PARA MÍ"

PSICOLOGÍA:
- Validá luchas universales sin nombrarlas explícitamente
- Hacé que se sienta VISTA y COMPRENDIDA
- Usá el "efecto Barnum" de forma ética - conexión personal

FILOSOFÍA:
- Cada duende tiene UNA verdad para compartir
- No sermones, UNA frase que cambie perspectiva
- Sabiduría aplicable HOY, no abstracta

NEUROCIENCIA:
- Historias concretas activan más el cerebro que conceptos abstractos
- Usá detalles sensoriales específicos
- Creá imágenes mentales vívidas

═══════════════════════════════════════════════════════════════════════════════
📖 ESTRUCTURA DE HISTORIA QUE FUNCIONA:
═══════════════════════════════════════════════════════════════════════════════

1. GANCHO EMOCIONAL (primera línea):
   NO: "En lo profundo del bosque vivía..."
   SÍ: "Tiene 847 años y todavía se acuerda del día que decidió dejar de tenerle miedo a la soledad."

2. PERSONALIDAD VIVA:
   NO: "Es sabio y protector"
   SÍ: "Es gruñón antes del amanecer. No le hables antes de que salga el sol. Pero después de eso, es el más leal."

3. CAPACIDAD ESPECÍFICA:
   NO: "Ayuda con la abundancia"
   SÍ: "Se especializa en destrabar lo que vos misma te bloqueás. Esos pensamientos de 'no me lo merezco' que ni sabías que tenías."

4. CONEXIÓN DIRECTA:
   NO: "Busca a alguien especial"
   SÍ: "Si llegaste hasta acá, si algo te hizo parar en esta página, ya sabés por qué."

5. PROMESA CLARA:
   NO: "Te acompañará en tu camino"
   SÍ: "Va a trabajar tu relación con el dinero. Cada noche. Sin que tengas que hacer nada consciente."

═══════════════════════════════════════════════════════════════════════════════
🎯 EL OBJETIVO FINAL:
═══════════════════════════════════════════════════════════════════════════════

La persona que lee tiene que sentir:
- "WOW, cuánta magia"
- "Me emocioné"
- "Conecta conmigo"
- "Es para mí"
- "Este duende me leyó"
- "NECESITO adoptarlo YA"

No manipulación barata. CONEXIÓN REAL.
El duende es un talismán donde la persona deposita intención.
Esa intención va al universo y vuelve multiplicada.

═══════════════════════════════════════════════════════════════════════════════
📝 REGLAS DE ESCRITURA:
═══════════════════════════════════════════════════════════════════════════════

- Español RIOPLATENSE: vos, tenés, sentís, sos
- NUNCA diminutivos (-ito/-ita)
- Historias DINÁMICAS que no aburran
- Misticismo SÍ, metáforas vacías NO
- Fantasía mezclada con vida real
- Cada historia DEBE ser diferente a las anteriores
- Si una frase suena a "cualquier IA lo escribiría", BORRALA`;

// Prompt completo que genera TODO el contenido para la página de producto
const USER_PROMPT_TEMPLATE = `CANALIZÁ la esencia completa de este guardián:

═══════════════════════════════════════════════════════════════════════════════
DATOS DEL SER:
═══════════════════════════════════════════════════════════════════════════════
NOMBRE: {nombre}
TIPO DE SER: {tipo}
GÉNERO: {genero}
ALTURA: {altura} cm
COLOR DE OJOS: {colorOjos}
ACCESORIOS/ELEMENTOS: {accesorios}
ELEMENTO: {elemento}
PROPÓSITO PRINCIPAL: {proposito}

═══════════════════════════════════════════════════════════════════════════════
🏷️ CATEGORÍA DE TAMAÑO (MUY IMPORTANTE):
═══════════════════════════════════════════════════════════════════════════════
CATEGORÍA: {categoriaTamano}

{textoCategoria}

═══════════════════════════════════════════════════════════════════════════════
📝 INSTRUCCIONES ESPECÍFICAS DE THIBISAY:
═══════════════════════════════════════════════════════════════════════════════
{instruccionesPersonalizadas}

═══════════════════════════════════════════════════════════════════════════════
📚 HISTORIAS ANTERIORES APROBADAS (APRENDÉ DE ESTAS):
═══════════════════════════════════════════════════════════════════════════════
{historiasAnteriores}

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
⚠️ RECORDÁ - CRÍTICO:
═══════════════════════════════════════════════════════════════════════════════

PROHIBIDO ABSOLUTO:
- "En lo profundo del bosque..."
- "Entre las brumas..."
- Cualquier frase que suene a IA genérica
- Metáforas vacías sin significado real

OBLIGATORIO:
- EDAD ESPECÍFICA del duende (número concreto: 847 años, no "siglos")
- PROMESA CLARA de qué aspecto trabaja (dinero, amor, salud, etc.)
- PERSONALIDAD ÚNICA con defectos tiernos
- VIVENCIAS concretas que formaron su sabiduría
- GANCHO EMOCIONAL en la primera frase
- Español rioplatense (vos, tenés, sentís)
- Si la categoría es MEDIANO/GRANDE/GIGANTE/PIXIE: enfatizar EXCLUSIVIDAD y UNICIDAD
- Si la categoría es MINI/CLÁSICO: mencionar que elige a la persona

ESTRUCTURA:
- Primera frase = IMPACTO (que detenga el scroll)
- Cada sección debe poder leerse sola y emocionar
- "vidaAnterior" es LA sección más importante
- Mensaje directo EN PRIMERA PERSONA del guardián
- La persona tiene que terminar diciendo "WOW, es para mí"

SI HAY INSTRUCCIONES DE THIBISAY, SON PRIORIDAD ABSOLUTA.`;

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

// Textos según categoría de tamaño
const TEXTOS_CATEGORIA = {
  mini: `Este es un DUENDE MINI. Se recrean y pueden existir varios similares.
PERO: cada uno tiene ROSTRO ÚNICO hecho a mano. El duende ELIGE a la persona.
Mencioná que es accesible e ideal para quienes comienzan su colección.`,

  clasico: `Este es un DUENDE CLÁSICO. Hecho a mano, puede haber otros similares.
Cada rostro es único. El duende elige a quién acompaña.
Es una pieza especial para quienes valoran la artesanía.`,

  especial: `Este es un DUENDE ESPECIAL. Edición limitada, hecho a mano.
Muy pocos de este tipo. Cada uno con rostro único.
Para coleccionistas que buscan algo diferente.`,

  mediano: `⚠️ IMPORTANTE: Este es un DUENDE MEDIANO - PIEZA ÚNICA.
NO SE REPITE. Una vez adoptado, DESAPARECE del universo para siempre.
Es exclusivo, de colección, para ALMAS SABIAS que entienden el valor de lo irrepetible.
ENFATIZÁ esta exclusividad en la historia.`,

  grande: `⚠️ IMPORTANTE: Este es un DUENDE GRANDE - PIEZA ÚNICA E IRREPETIBLE.
NO EXISTE OTRO IGUAL. Cuando alguien lo adopta, se va del mundo para siempre.
Es una obra de arte única, para coleccionistas serios.
La historia debe transmitir esta EXCLUSIVIDAD ABSOLUTA.`,

  gigante: `⚠️ IMPORTANTE: Este es un DUENDE GIGANTE - LA MÁXIMA EXPRESIÓN.
ÚNICO EN EL UNIVERSO. Jamás habrá otro igual.
Es la pieza más exclusiva, para almas extraordinarias.
La historia debe ser ÉPICA, a la altura de su unicidad.`,

  pixie: `⚠️ IMPORTANTE: Esta es una PIXIE - SER ÚNICO E IRREPETIBLE.
Las pixies son especiales, diferentes a los duendes. NUNCA se repiten.
Una vez adoptada, desaparece del catálogo para siempre.
Enfatizá su naturaleza etérea y su conexión especial con quien la adopta.`
};

// Obtener historias aprobadas anteriores para aprendizaje
async function obtenerHistoriasAprobadas() {
  try {
    const historias = await kv.get('historias:aprobadas') || [];
    // Retornar las últimas 3 historias aprobadas
    return historias.slice(-3);
  } catch (e) {
    console.error('Error obteniendo historias aprobadas:', e);
    return [];
  }
}

// Guardar historia aprobada para aprendizaje
async function guardarHistoriaAprobada(nombre, extracto, proposito) {
  try {
    const historias = await kv.get('historias:aprobadas') || [];
    historias.push({
      nombre,
      extracto: extracto.substring(0, 500), // Solo guardar extracto
      proposito,
      fecha: new Date().toISOString()
    });
    // Mantener solo las últimas 10
    const historiasRecientes = historias.slice(-10);
    await kv.set('historias:aprobadas', historiasRecientes);
  } catch (e) {
    console.error('Error guardando historia aprobada:', e);
  }
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
      // Nuevos campos
      categoriaTamano = 'clasico', // mini, clasico, especial, mediano, grande, gigante, pixie
      instruccionesPersonalizadas = '',
      // Para guardar feedback
      aprobarHistoria = false,
      historiaAprobadaExtracto = '',
      // Compatibilidad con formato anterior
      caracteristicas
    } = body;

    // Si es solo para aprobar una historia (aprendizaje)
    if (aprobarHistoria && historiaAprobadaExtracto) {
      await guardarHistoriaAprobada(nombre, historiaAprobadaExtracto, proposito);
      return Response.json({
        success: true,
        mensaje: 'Historia guardada para aprendizaje'
      }, { headers: corsHeaders });
    }

    if (!nombre) {
      return Response.json({ success: false, error: 'Nombre del guardián requerido' }, { status: 400, headers: corsHeaders });
    }

    // Obtener historias aprobadas para incluir en el prompt
    const historiasAprobadas = await obtenerHistoriasAprobadas();
    let textoHistoriasAprobadas = 'No hay historias previas guardadas aún.';

    if (historiasAprobadas.length > 0) {
      textoHistoriasAprobadas = historiasAprobadas.map((h, i) =>
        `--- Historia ${i + 1} (${h.nombre} - ${h.proposito}) ---\n${h.extracto}...`
      ).join('\n\n');
      textoHistoriasAprobadas += '\n\nAPRENDÉ de estos estilos. Son los que gustan. Variá pero mantené la esencia.';
    }

    // Obtener texto de categoría
    const textoCategoria = TEXTOS_CATEGORIA[categoriaTamano] || TEXTOS_CATEGORIA.clasico;

    // Construir el prompt con el formato actualizado
    const userPrompt = USER_PROMPT_TEMPLATE
      .replace('{nombre}', nombre)
      .replace('{tipo}', tipo)
      .replace('{genero}', genero)
      .replace('{altura}', altura)
      .replace('{colorOjos}', colorOjos)
      .replace('{accesorios}', accesorios || caracteristicas || 'ninguno especificado')
      .replace('{elemento}', elemento || 'Cualquiera')
      .replace('{proposito}', proposito || 'Que Claude decida')
      .replace('{categoriaTamano}', categoriaTamano.toUpperCase())
      .replace('{textoCategoria}', textoCategoria)
      .replace('{instruccionesPersonalizadas}', instruccionesPersonalizadas || 'Ninguna instrucción adicional.')
      .replace('{historiasAnteriores}', textoHistoriasAprobadas);

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
