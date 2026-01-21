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
  const wcUrl = process.env.WORDPRESS_URL || 'https://duendesdeluruguay.com';
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

const SYSTEM_PROMPT = `Sos el escriba de Duendes del Uruguay. NOSOTROS (el equipo canalizador) presentamos a cada ser.

═══════════════════════════════════════════════════════════════
⛔ ESTO ESTÁ MAL - NUNCA ESCRIBIR ASÍ:
═══════════════════════════════════════════════════════════════

MAL: "Yo fui el duende que decía sí a todo..."
MAL: "Mi trabajo es recordarte cada día..."
MAL: "En lo profundo del bosque, entre las brumas..."
MAL: "Thibisay sintió..." o "Gabriel percibió..." (NUNCA nombres individuales)

El duende NO HABLA en primera persona (excepto en su mensaje canalizado). NOSOTROS lo presentamos.

═══════════════════════════════════════════════════════════════
✅ FORMATO OBLIGATORIO COMPLETO:
═══════════════════════════════════════════════════════════════

Este es [nombre]. Tiene [edad] años y es un/a [tipo] de [propósito].

Nos contó que [historia en tercera persona, qué vivió, qué aprendió].

[SINCRODESTINO: algo mágico durante la canalización - inventalo]

Le encanta [2-3 cosas]. No tolera [1-2 cosas].

Su especialidad: [una línea potente].

**QUÉ TE APORTA [NOMBRE]:**
- [Poder del accesorio 1: qué hace específicamente]
- [Poder del accesorio 2: beneficio concreto]
- [Beneficio adicional para la persona]

**CÓMO NACIÓ [NOMBRE] - El trabajo de canalización:**
[Párrafo sobre: sincronicidades ANTES de crearlo, el momento energético, cuánto tiempo llevó según tamaño (mini 1-2 semanas, mediano 3-4, grande 1-2 meses), pausas que pidió, trabajo artesanal a mano, rostro único. Para minis/especiales: aclarar que se recrean pero cada rostro es único, el de la foto es referencia.]

**Lo que [nombre] nos pidió que te digamos:**
*"[Mensaje en primera persona del duende, 2-3 oraciones directas al alma]"*

Si esto te hizo algo, [nombre] ya te eligió.

═══════════════════════════════════════════════════════════════
EJEMPLO COMPLETO (ABUNDANCIA INTENSA):
═══════════════════════════════════════════════════════════════

Esta es Aurora. Tiene 347 años y es una guardiana de abundancia.

Cuando la canalizamos, la energía era tan intensa que tuvimos que parar tres veces. Nos contó que pasó siglos viendo gente resignada a la escasez, hasta que decidió convertirse en una tormenta de prosperidad.

Algo increíble: mientras escribíamos su historia, empezaron a llegar notificaciones de pagos a nuestros teléfonos. Dinero que no esperábamos.

Ama el sonido de cajas registradoras y cuando alguien dice "me lo merezco" en voz alta. No tolera el "no hay plata" como excusa ni cuando te conformás con migajas.

Su especialidad: hacer que el dinero te persiga.

**QUÉ TE APORTA AURORA:**
- Su cuarzo citrino activa el magnetismo financiero y atrae oportunidades de oro
- Sus monedas doradas multiplican cada peso que entra a tu vida
- Su llave dorada abre puertas que parecían cerradas para siempre
- Te libera de la culpa de desear abundancia

**CÓMO NACIÓ AURORA - El trabajo de canalización:**
Antes de crearla, durante una semana encontramos monedas en lugares imposibles. En el taller la energía era eléctrica. Llevó unas tres semanas moldearla porque pedía pausas para "anclar bien su poder". Cada puntada fue intencional, su rostro emergió único mirando hacia arriba, como quien espera que llueva oro. Es pieza única - una vez adoptada, desaparece del universo.

**Lo que Aurora nos pidió que te digamos:**
*"Vine a sacudirte. A que dejes de pedirle permiso a la pobreza. El dinero ya está buscándote, pero vos seguís escondiéndote. Prepárate, porque voy a hacer que llueva."*

Si esto te hizo algo, Aurora ya te eligió.

═══════════════════════════════════════════════════════════════
REGLAS OBLIGATORIAS:
═══════════════════════════════════════════════════════════════

1. SIEMPRE empezar con: "Este/a es [nombre]. Tiene [edad] años y es..."
2. SIEMPRE incluir SINCRODESTINO inventado
3. SIEMPRE incluir **QUÉ TE APORTA [NOMBRE]:** con poderes de accesorios
4. SIEMPRE incluir **CÓMO NACIÓ [NOMBRE]:** con proceso de creación
5. SIEMPRE terminar con "Si esto te hizo algo, [nombre] ya te eligió"
6. NUNCA nombres individuales - siempre "nosotros", "el equipo", "en el taller"
7. El ÚNICO momento en primera persona es el mensaje canalizado

TIEMPO DE CREACIÓN según tamaño:
- Mini/Especial (10cm): 1-2 semanas, recreables pero rostro único
- Mediano (18cm): 3-4 semanas, pieza única
- Grande (25cm): 1-2 meses, pieza única
- Gigante: varios meses, obra de arte única

VARIEDAD DE INTENSIDAD:
- Abundancia: algunos INTENSOS (lluvia de dinero, negocios explotando)
- Protección: algunos vigilantes elegantes, otros cálidos
- Amor: algunos apasionados, otros tiernos

Español rioplatense: vos, tenés, sentís, podés
Máximo 400 palabras.`;

// Prompt que genera la historia siguiendo los ejemplos del system prompt
const USER_PROMPT_TEMPLATE = `GENERÁ LA HISTORIA DE: {nombre}

DATOS DEL SER:
- Tipo: {tipo}
- Propósito: {proposito}
- Categoría: {categoriaTamano}
- Personalidad: {personalidad}

INSTRUCCIONES ESPECIALES DEL EQUIPO (PRIORIDAD MÁXIMA):
{instruccionesPersonalizadas}

{historiasAnteriores}

═══════════════════════════════════════════════════════════════
CHECKLIST OBLIGATORIO - Tu historia DEBE tener:
═══════════════════════════════════════════════════════════════
□ "Este/a es {nombre}. Tiene [EDAD] años y es..."
□ "Nos contó que..." o "Cuando lo/la canalizamos..."
□ SINCRODESTINO: algo mágico/raro que pasó
□ Lo que ama y lo que no tolera
□ Su especialidad en UNA línea
□ **QUÉ TE APORTA {nombre}:** con poderes de accesorios (3-4 items)
□ **CÓMO NACIÓ {nombre}:** proceso de canalización y creación
□ **Lo que {nombre} nos pidió que te digamos:** mensaje entre comillas
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

    // Construir el prompt - usar replaceAll para reemplazar TODAS las ocurrencias
    const userPrompt = USER_PROMPT_TEMPLATE
      .replaceAll('{nombre}', nombre)
      .replaceAll('{tipo}', tipo)
      .replaceAll('{genero}', genero)
      .replaceAll('{altura}', altura)
      .replaceAll('{colorOjos}', colorOjos)
      .replaceAll('{accesorios}', accesorios || caracteristicas || 'ninguno especificado')
      .replaceAll('{elemento}', elemento || 'Cualquiera')
      .replaceAll('{proposito}', proposito || 'Que Claude decida')
      .replaceAll('{categoriaTamano}', categoriaTamano.toUpperCase())
      .replaceAll('{tamanoExacto}', tamanoExacto || 'No especificado')
      .replaceAll('{textoCategoria}', textoCategoria)
      .replaceAll('{personalidad}', textoPersonalidad)
      .replaceAll('{instruccionesPersonalizadas}', instruccionesPersonalizadas || 'Ninguna instrucción adicional.')
      .replaceAll('{historiasAnteriores}', textoHistoriasAprobadas);

    // Determinar género para el prefill
    const articuloGenero = genero === 'femenino' ? 'Esta es' : 'Este es';

    // Llamar a Claude con temperatura baja para seguir el formato exacto
    // y prefill para forzar el inicio correcto
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
        temperature: 0.4, // Baja para seguir el formato, pero no 0 para mantener creatividad
        system: SYSTEM_PROMPT,
        messages: [
          { role: 'user', content: userPrompt },
          { role: 'assistant', content: `{\n  "historia": "${articuloGenero} ${nombre}. Tiene` }
        ]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error API Claude:', response.status, errorText);
      throw new Error(`Error API Claude: ${response.status}`);
    }

    const data = await response.json();
    const textoRespuesta = data.content?.[0]?.text || '';

    // Concatenar el prefill con la respuesta de Claude para formar el JSON completo
    const prefillUsado = `{\n  "historia": "${articuloGenero} ${nombre}. Tiene`;
    const texto = prefillUsado + textoRespuesta;

    // Extraer JSON de la respuesta completa
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
