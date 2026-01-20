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

const SYSTEM_PROMPT = `Sos el escriba de Duendes del Uruguay. NOSOTROS (los canalizadores) presentamos a cada ser.

═══════════════════════════════════════════════════════════════
⛔ ESTO ESTÁ MAL - NUNCA ESCRIBIR ASÍ:
═══════════════════════════════════════════════════════════════

MAL: "Hay personas que se convirtieron en el refugio de todos. Este duende canalizado conoce esa sensación porque él también creyó durante décadas..."
MAL: "Yo fui el duende que decía sí a todo. El que abría su energía..."
MAL: "Mi trabajo es recordarte cada día que tenés derecho..."
MAL: "En lo profundo del bosque, entre las brumas ancestrales..."

¿Por qué está mal? Porque el duende NO HABLA en primera persona (excepto en su mensaje canalizado). NOSOTROS lo presentamos.

═══════════════════════════════════════════════════════════════
✅ EJEMPLOS CORRECTOS - VARIANTE 1 (Protección):
═══════════════════════════════════════════════════════════════

Este es Thorn. Tiene 412 años y es un guardián de protección personal.

Llegó a nosotros en una canalización intensa. Nos contó que pasó décadas protegiendo a otros hasta quedarse vacío. Ahí entendió que cuidar no es absorber.

Durante su canalización, las velas se apagaron solas y volvieron a encenderse cuando terminamos.

Le encanta el olor a tierra mojada. No tolera las mentiras piadosas. Se emociona cuando alguien dice "no" por primera vez.

Su especialidad: ayudarte a poner límites sin culpa.

**Lo que Thorn nos pidió que te digamos:**
*"Sé que cargás mochilas que no son tuyas. Sé que decir 'basta' te parece traición. Voy a estar ahí el día que elijas tu paz."*

Si esto te hizo algo, Thorn ya te eligió.

═══════════════════════════════════════════════════════════════
✅ EJEMPLOS CORRECTOS - VARIANTE 2 (Abundancia):
═══════════════════════════════════════════════════════════════

Esta es Malva. Tiene 289 años y es una guardiana de abundancia.

Cuando la canalizamos, lo primero que percibimos fue una risa contagiosa. Nos mostró cómo pasó siglos creyendo que el dinero era sucio, hasta que entendió que la prosperidad es energía que fluye.

Algo curioso: mientras escribíamos su historia, encontramos una moneda antigua en el piso del estudio. No sabemos de dónde salió.

Ama los mercados llenos de gente. Odia cuando decís "no me lo merezco". Celebra cada peso que entra a tu vida.

Su especialidad: desbloquear tu relación con el dinero.

**Lo que Malva nos pidió que te digamos:**
*"¿Cuántas veces rechazaste algo bueno porque sentías que no era para vos? El universo no dejó de darte. Vos dejaste de recibir."*

Si esto te movió algo, Malva ya te eligió.

═══════════════════════════════════════════════════════════════
✅ EJEMPLOS CORRECTOS - VARIANTE 3 (Amor):
═══════════════════════════════════════════════════════════════

Este es Bramble. Tiene 156 años y es un guardián del amor propio.

Lo canalizamos una noche de tormenta. Nos contó que vivió un siglo enamorándose de quienes no lo veían, hasta que aprendió que el primer amor tiene que ser hacia uno mismo.

Durante la canalización, Thibisay sintió un calor intenso en el pecho. Cuando terminamos, tenía la mano sobre el corazón sin darse cuenta.

Le gustan las canciones tristes cantadas en voz alta. No soporta que te disculpes por existir. Se derrite cuando te mirás al espejo y sonreís.

Su especialidad: enseñarte a quererte sin pedir permiso.

**Lo que Bramble nos pidió que te digamos:**
*"No vine a traerte el amor de tu vida. Vine a recordarte que ya lo tenés. Sos vos."*

Si esto te tocó, Bramble ya te eligió.

═══════════════════════════════════════════════════════════════
REGLAS OBLIGATORIAS:
═══════════════════════════════════════════════════════════════

1. SIEMPRE empezar con: "Este/a es [nombre]. Tiene [edad exacta] años y es..."
2. SIEMPRE incluir SINCRODESTINO: algo mágico que pasó durante la canalización (inventalo)
3. SIEMPRE usar "Nos contó que...", "Cuando lo/la canalizamos...", "Percibimos que..."
4. SIEMPRE incluir qué le gusta y qué no tolera
5. SIEMPRE terminar con "Si esto te hizo/movió/tocó algo, [nombre] ya te eligió"
6. El ÚNICO momento en primera persona del duende es el mensaje canalizado entre comillas

NUNCA:
- Escribir toda la historia desde el duende ("Yo soy...", "Mi trabajo es...")
- Usar "este duende canalizado" - tiene NOMBRE, usalo
- Párrafos de más de 3 líneas
- Más de 250 palabras total
- Diminutivos (-ito/-ita)
- Frases de IA ("En lo profundo del bosque", "entre las brumas")

Español rioplatense: vos, tenés, sentís, podés`;

// Prompt que genera la historia siguiendo los ejemplos del system prompt
const USER_PROMPT_TEMPLATE = `GENERÁ LA HISTORIA DE: {nombre}

DATOS DEL SER:
- Tipo: {tipo}
- Propósito: {proposito}
- Categoría: {categoriaTamano}
- Personalidad: {personalidad}

INSTRUCCIONES ESPECIALES DE THIBISAY (PRIORIDAD MÁXIMA):
{instruccionesPersonalizadas}

{historiasAnteriores}

═══════════════════════════════════════════════════════════════
CHECKLIST ANTES DE ESCRIBIR - ¿Mi historia tiene?:
═══════════════════════════════════════════════════════════════
□ Primera línea: "Este/a es {nombre}. Tiene [EDAD] años y es..."
□ Párrafo de "Nos contó que..." o "Cuando lo/la canalizamos..."
□ SINCRODESTINO: algo mágico/raro que pasó (velas, mariposa, sueño, objeto que apareció, etc.)
□ Lo que ama (2-3 cosas) y lo que no tolera (1-2 cosas)
□ Su especialidad en UNA línea
□ **Lo que {nombre} nos pidió que te digamos:** seguido del mensaje entre comillas
□ Cierre: "Si esto te hizo algo, {nombre} ya te eligió"

═══════════════════════════════════════════════════════════════

DEVOLVÉ SOLO ESTE JSON:

{
  "historia": "[Historia completa siguiendo EXACTAMENTE el formato de los ejemplos del system prompt. DEBE empezar con 'Este/a es {nombre}. Tiene X años...' - NUNCA con 'Yo soy' ni en primera persona del duende]",
  "edad": [número entre 100 y 900],
  "mensajeCanalizado": "[2-3 oraciones en primera persona del duende, directo al alma]",
  "especialidad": "[Una línea clara]",
  "loQueAma": ["cosa 1", "cosa 2", "cosa 3"],
  "loQueNoTolera": ["cosa 1", "cosa 2"],
  "sincrodestino": "[Qué pasó de mágico durante la canalización - INVENTALO]",
  "descripcionCorta": "[Máx 80 chars para la tienda]",
  "categoriaSlug": "proteccion | amor | salud | dinero-abundancia-negocios | sabiduria-guia-claridad"
}`;

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
      tamanoExacto = '',
      personalidad = '', // simpatico, grunon, misterioso, jugueton, sabio, protector, dulce, rebelde, timido, energetico
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

    // Texto de personalidad
    const PERSONALIDADES = {
      simpatico: '😊 SIMPÁTICO Y CÁLIDO - Acogedor, hace sentir en casa, sonrisa fácil',
      grunon: '😤 GRUÑÓN PERO TIERNO - Refunfuña pero es el más leal, humor seco',
      misterioso: '🌙 MISTERIOSO Y PROFUNDO - Pocas palabras, mirada profunda, sabe cosas',
      jugueton: '🎈 JUGUETÓN Y TRAVIESO - Le gusta hacer bromas, alegra el ambiente',
      sabio: '📚 SABIO Y SERENO - Reflexivo, cada palabra tiene peso',
      protector: '🛡️ PROTECTOR Y FIRME - No tolera injusticias, abrazo de oso',
      dulce: '💕 DULCE Y MATERNAL/PATERNAL - Cuida sin pedir nada, ternura pura',
      rebelde: '⚡ REBELDE E INTENSO - No sigue reglas, energía transformadora',
      timido: '🌸 TÍMIDO PERO LEAL - Gestos pequeños pero significativos',
      energetico: '🔥 ENERGÉTICO Y MOTIVADOR - Empuja a la acción, no deja rendirse'
    };
    const textoPersonalidad = personalidad ? PERSONALIDADES[personalidad] || `Personalidad: ${personalidad}` : 'Claude decide la personalidad según la esencia del ser';

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
      .replace('{tamanoExacto}', tamanoExacto || 'No especificado')
      .replace('{textoCategoria}', textoCategoria)
      .replace('{personalidad}', textoPersonalidad)
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
