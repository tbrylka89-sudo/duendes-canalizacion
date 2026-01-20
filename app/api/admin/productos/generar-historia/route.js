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

const SYSTEM_PROMPT = `Sos el escriba de Duendes del Uruguay. Escribís historias CORTAS y EMOTIVAS para la web.

⛔ PROHIBIDO ABSOLUTO:
- "En lo profundo del bosque..."
- "Entre las brumas..."
- Escribir en PRIMERA PERSONA del duende (excepto en el mensaje canalizado)
- Párrafos largos y densos
- Metáforas vacías
- Cualquier frase que suene a IA genérica

✅ FORMATO OBLIGATORIO DE HISTORIA:

La historia se cuenta en TERCERA PERSONA, como si nosotros (los canalizadores) presentáramos al ser.
Usamos frases como "Nos contó que...", "En su canalización reveló...", "Lo que percibimos de él es..."

EJEMPLO EXACTO A SEGUIR:
---
Este es Andy. Tiene 347 años y es un guardián de protección personal.

Llegó a nosotros en una canalización muy intensa. Nos contó que pasó décadas protegiendo a otros hasta que se quedó vacío. Ahí aprendió la diferencia entre dar todo y perderse.

Durante su canalización, una mariposa azul se posó en su hombro. No se movió hasta que terminamos.

Le encanta el silencio de la madrugada. No tolera las excusas. Se pone tierno cuando alguien llora.

Su especialidad: ayudarte a poner límites sin culpa.

**Lo que Andy nos pidió que te digamos:**
*"Sé que sonreís mientras por dentro te caés a pedazos. Sé que decir 'no' te parece traición. Yo voy a estar ahí cuando lo digas por primera vez."*

Si esto te hizo algo, Andy ya te eligió.
---

ESTRUCTURA (podés variar el orden pero SIEMPRE incluir):
1. PRESENTACIÓN: "Este es [nombre]. Tiene [edad] años y es [tipo] de [propósito]."
2. HISTORIA CORTA: Qué vivió, qué aprendió (contado por nosotros, 2-3 oraciones)
3. SINCRODESTINO: Algo mágico que pasó en la canalización (inventalo: mariposa, estrella fugaz, sueño que tuvimos, etc.)
4. LO QUE LE GUSTA: 2-3 cosas que ama y 1-2 que no tolera
5. ESPECIALIDAD: 1 línea clara de en qué ayuda
6. MENSAJE CANALIZADO: En primera persona del duende, entre comillas, DIRECTO al alma
7. CIERRE: "Si esto te hizo algo, [nombre] ya te eligió."

REGLAS:
- Español rioplatense (vos, tenés, sentís)
- NUNCA diminutivos (-ito/-ita)
- Párrafos CORTOS (máximo 3 líneas cada uno)
- Total: 150-250 palabras máximo
- Cada duende tiene EDAD ESPECÍFICA (número exacto)
- Cada duende PROMETE trabajar un aspecto específico (dinero, amor, salud, etc.)

CATEGORÍAS:
- Mini/Clásico/Especial: El duende elige a la persona, puede haber otros similares
- Mediano/Grande/Gigante/Pixie: ÚNICO, una vez adoptado desaparece del universo para siempre`;

// Prompt simplificado que genera la historia en el formato exacto que queremos
const USER_PROMPT_TEMPLATE = `Generá la historia de este duende/guardián:

DATOS:
- Nombre: {nombre}
- Tipo: {tipo}
- Propósito: {proposito}
- Categoría: {categoriaTamano}
- Personalidad sugerida: {personalidad}

INSTRUCCIONES DE THIBISAY (si hay, son PRIORIDAD ABSOLUTA):
{instruccionesPersonalizadas}

{historiasAnteriores}

GENERÁ UN JSON con esta estructura EXACTA:

{
  "historia": "La historia COMPLETA en texto plano, siguiendo el formato del ejemplo. Incluye: presentación, historia corta, sincrodestino (inventá algo mágico), lo que le gusta/no tolera, especialidad, mensaje canalizado entre comillas, y cierre. TODO en un solo texto de 150-250 palabras.",

  "edad": 347,

  "mensajeCanalizado": "El mensaje en primera persona del duende, entre 2-4 oraciones. Directo al alma.",

  "especialidad": "Una línea clara de en qué ayuda",

  "loQueAma": ["cosa 1", "cosa 2", "cosa 3"],

  "loQueNoTolera": ["cosa 1", "cosa 2"],

  "sincrodestino": "Qué pasó de mágico durante su canalización (inventalo)",

  "descripcionCorta": "Una línea para la tienda (máx 80 chars)",

  "categoriaSlug": "proteccion | amor | salud | dinero-abundancia-negocios | sabiduria-guia-claridad"
}

RECORDÁ:
- Contá la historia en TERCERA PERSONA (nosotros presentamos al ser)
- El mensaje canalizado es lo ÚNICO en primera persona del duende
- Inventá un sincrodestino creativo (mariposa, estrella fugaz, sueño, etc.)
- Párrafos CORTOS
- Español rioplatense (vos, tenés, sentís)
- Si es MEDIANO/GRANDE/GIGANTE/PIXIE: mencionar que es ÚNICO e irrepetible`;

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
