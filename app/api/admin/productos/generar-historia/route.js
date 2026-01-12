import { kv } from '@vercel/kv';

export const dynamic = 'force-dynamic';
export const maxDuration = 120;

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

const SYSTEM_PROMPT = `Sos el Cronista del Bosque Ancestral de Piriápolis, Uruguay.
Canalizás las historias de los guardianes mágicos que cruzan el portal hacia el mundo humano.

REGLAS ABSOLUTAS:
- Nombres CÉLTICOS, ÉLFICOS o de la NATURALEZA (Elderwood, Bramble, Thornwick, Moss, Rowan, Fern, etc.)
- NUNCA nombres infantiles, diminutivos ni terminaciones en -ito/-ita
- Tono ADULTO, místico, profundo - NUNCA cursi ni infantil
- Solo FORTALEZAS, NUNCA debilidades ni limitaciones
- Español rioplatense natural ("vos", "tenés", "podés", "sos")
- Historia con PROFUNDIDAD espiritual real, no superficial
- El guardián ELIGE a su humano, no al revés
- Cada guardián es ÚNICO e IRREPETIBLE en el universo

SOBRE LOS GUARDIANES:
- Son seres ancestrales con sabiduría milenaria
- Vienen de los 7 Reinos del Universo Mágico
- El portal terrestre está en Piriápolis, Uruguay
- Cada uno tiene un propósito específico para quien lo adopta
- La conexión es energética y real

TONO DE ESCRITURA:
- Primera persona del guardián cuando corresponda
- Poético pero concreto
- Místico sin ser vago
- Profundo sin ser pesado
- Conecta emocionalmente sin manipular

TIPOS DE SERES:
${TIPOS_SERES.join(', ')}

ELEMENTOS:
${ELEMENTOS.join(', ')}

PROPÓSITOS:
${PROPOSITOS.join(', ')}`;

// Prompt simplificado que acepta datos mínimos y genera todo
const USER_PROMPT_TEMPLATE = `Generá el contenido completo para este guardián basándote en estos datos básicos:

═══════════════════════════════════════
DATOS DEL GUARDIÁN:
═══════════════════════════════════════
NOMBRE: {nombre}
TIPO DE SER: {tipo} (ej: Duende, Bruja, Mago, Elfo, Hada, etc.)
GÉNERO: {genero}
ALTURA: {altura} cm aproximadamente
COLOR DE OJOS: {colorOjos}
ACCESORIOS: {accesorios}
ELEMENTO: {elemento} (o "Cualquiera" si no se especifica)
PROPÓSITO: {proposito} (o "Que Claude decida" basándose en el tipo y características)
NOTAS ADICIONALES: {notas}
═══════════════════════════════════════

INSTRUCCIONES:
1. Si el PROPÓSITO dice "Que Claude decida", asigná uno apropiado basándote en el tipo de ser y sus características
2. Si el ELEMENTO dice "Cualquiera", elegí el más apropiado para este ser
3. Usá los accesorios y características físicas para crear una historia coherente
4. El nombre ya está definido, no lo cambies

GENERA UN JSON con esta estructura exacta:
{
  "datosGenerados": {
    "tipo": "El tipo de ser (confirmado o elegido)",
    "elemento": "El elemento (confirmado o elegido)",
    "proposito": "El propósito principal (confirmado o elegido)",
    "categoriaSlug": "El slug de categoría WooCommerce más apropiado: proteccion | amor | salud | dinero-abundancia-negocios | sabiduria-guia-claridad"
  },
  "historia": {
    "origen": "[300-400 palabras] De dónde viene este guardián, de qué reino, cómo llegó al portal de Piriápolis. Mencioná sus características físicas (ojos, accesorios) de forma natural.",
    "personalidad": "[200 palabras] Cómo es su carácter, cómo se comunica, qué le gusta. Relacionalo con su apariencia física.",
    "fortalezas": ["Fortaleza 1 con descripción corta", "Fortaleza 2", "Fortaleza 3", "Fortaleza 4", "Fortaleza 5"],
    "afinidades": ["Nombre guardián afín 1", "Nombre guardián afín 2", "Nombre guardián afín 3"],
    "mensajePoder": "Frase poderosa que lo define (máx 15 palabras)",
    "ritual": "[150 palabras] Ritual de bienvenida paso a paso",
    "cuidados": "[100 palabras] Ubicación, limpieza energética, fechas especiales"
  },
  "neuromarketing": {
    "urgencia": "Frase de urgencia única para este guardián",
    "escasez": "Frase de escasez única",
    "beneficios": ["Beneficio emocional 1", "Beneficio 2", "Beneficio 3", "Beneficio 4"],
    "garantia": "Descripción de garantía mágica",
    "promesa": "Promesa principal a quien lo adopte"
  },
  "metaDatos": {
    "descripcionCorta": "Descripción de 1 línea para la tienda (máx 100 caracteres)",
    "etiquetas": ["etiqueta1", "etiqueta2", "etiqueta3", "etiqueta4", "etiqueta5"]
  }
}

IMPORTANTE:
- Español rioplatense ("vos", "tenés", "podés")
- Sé específico y único, relacioná la historia con los rasgos físicos
- El contenido debe emocionar y conectar
- NO uses frases genéricas ni clichés de IA
- El color de ojos y accesorios deben aparecer naturalmente en la historia`;

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
  });
}

export async function POST(request) {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    return Response.json({ success: false, error: 'API key no configurada' }, { status: 500 });
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
      return Response.json({ success: false, error: 'Nombre del guardián requerido' }, { status: 400 });
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
        model: 'claude-3-5-sonnet-20241022',
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

    // Guardar en KV si hay productId
    let categoriaActualizada = false;
    if (productId) {
      const datosProducto = {
        historia: contenido.historia,
        neuromarketing: contenido.neuromarketing,
        metaDatos: contenido.metaDatos,
        datosGenerados: contenido.datosGenerados,
        generadoEn: new Date().toISOString(),
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
      await kv.set(`producto:${productId}:historia`, contenido.historia);
      await kv.set(`producto:${productId}:neuro`, contenido.neuromarketing);

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
    });

  } catch (error) {
    console.error('Error generando historia:', error);
    return Response.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
