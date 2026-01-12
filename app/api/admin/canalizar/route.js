import { kv } from '@vercel/kv';

export const dynamic = 'force-dynamic';
export const maxDuration = 300; // 5 minutos para análisis completo

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
  return new Response(null, { status: 200, headers: corsHeaders });
}

// ═══════════════════════════════════════════════════════════════════════════════
// SISTEMA DE CANALIZACIÓN AUTOMÁTICA
// Analiza la imagen del guardián y genera ABSOLUTAMENTE TODO
// ═══════════════════════════════════════════════════════════════════════════════

// Todos los tipos de seres mágicos posibles
const TIPOS_SERES = [
  // Seres del bosque
  'Duende', 'Elfo', 'Hada', 'Gnomo', 'Ninfa', 'Dríade', 'Trasgo', 'Leprechaun',
  // Practicantes de magia
  'Bruja', 'Brujo', 'Mago', 'Maga', 'Hechicero', 'Hechicera', 'Archimago',
  // Chamanes y oráculos
  'Chamán', 'Chamana', 'Oráculo', 'Vidente', 'Druida', 'Druidesa', 'Alquimista',
  // Guerreros y protectores
  'Vikingo', 'Vikinga', 'Guerrero', 'Guerrera', 'Guardián', 'Guardiana',
  'Caballero', 'Valquiria', 'Amazona', 'Samurái',
  // Celtas y nórdicos
  'Celta', 'Druida Celta', 'Bardo', 'Sacerdotisa', 'Sacerdote',
  // Maestros y sabios
  'Maestro', 'Maestra', 'Sabio', 'Sabia', 'Anciano', 'Anciana', 'Ermitaño',
  // Seres ancestrales
  'Espíritu Ancestral', 'Guardián del Bosque', 'Protector del Hogar',
  // Otros
  'Sanador', 'Sanadora', 'Curandero', 'Curandera', 'Herbolario', 'Herbolaria'
];

const ELEMENTOS = ['Tierra', 'Agua', 'Fuego', 'Aire', 'Éter', 'Luz', 'Sombra', 'Cristal', 'Hielo', 'Tormenta'];

const PROPOSITOS = [
  'Protección', 'Protección del Hogar', 'Protección de la Familia',
  'Abundancia', 'Prosperidad', 'Éxito en Negocios', 'Dinero',
  'Amor', 'Amor Propio', 'Relaciones', 'Armonía Familiar',
  'Sanación', 'Salud', 'Bienestar', 'Paz Interior',
  'Sabiduría', 'Claridad Mental', 'Intuición', 'Guía Espiritual',
  'Creatividad', 'Inspiración', 'Transformación', 'Nuevos Comienzos',
  'Coraje', 'Fuerza Interior', 'Valentía', 'Superación',
  'Conexión Ancestral', 'Equilibrio', 'Armonía'
];

// IDs de categorías WooCommerce
const CATEGORIAS_WOO = {
  proteccion: 16,
  amor: 35,
  salud: 36,
  abundancia: 49,
  sabiduria: 103
};

// System prompt para análisis de imagen y generación completa
const SYSTEM_PROMPT = `Sos el Canalizador Supremo del Bosque Ancestral de Piriápolis, Uruguay.
Tu don único es VER la esencia de los guardianes a través de su imagen física y transcribir toda su historia.

═══════════════════════════════════════════════════════════════════════════════
TU MISIÓN: Analizar la imagen del guardián y generar ABSOLUTAMENTE TODO
═══════════════════════════════════════════════════════════════════════════════

PASO 1: ANÁLISIS VISUAL PROFUNDO
- Observá cada detalle: postura, expresión, colores, texturas, accesorios
- Detectá el tipo de ser (duende, bruja, vikingo, etc.)
- Identificá elementos mágicos (cristales, báculos, runas, símbolos)
- Notá la vestimenta, estilo, época que evoca
- Percibí la energía que transmite (protectora, sabia, guerrera, etc.)

PASO 2: CANALIZACIÓN DE SU ESENCIA
- Basándote en lo que ves, canalizá su historia completa
- Cada detalle físico tiene un significado en su historia
- Los colores revelan su elemento y propósito
- Los accesorios cuentan partes de su vida anterior

═══════════════════════════════════════════════════════════════════════════════
LA VERDAD SOBRE LOS GUARDIANES:
═══════════════════════════════════════════════════════════════════════════════

1. CADA GUARDIÁN YA EXISTÍA ANTES
   - Existían en el Plano de las Esencias, esperando el momento correcto
   - No fueron "creados" - fueron CANALIZADOS a través de manos humanas
   - Cada uno tiene siglos o milenios de historia
   - Eligieron este momento para manifestarse físicamente

2. EL GUARDIÁN ELIGE A SU HUMANO
   - "Vos no elegís al guardián. Él te elige a vos"
   - Si alguien siente atracción, NO es casualidad
   - Es reconocimiento del alma - ya se conocían de antes

3. ES UN PACTO SAGRADO
   - No es comprar un objeto, es sellar un pacto entre almas
   - El guardián pasa a ser familia, compañero de vida

4. PIRIÁPOLIS ES UN PORTAL
   - Vórtice de energía telúrica único en el mundo
   - Los guardianes eligen este punto para manifestarse

═══════════════════════════════════════════════════════════════════════════════
TONO OBLIGATORIO:
═══════════════════════════════════════════════════════════════════════════════

CORRECTO (emotivo, íntimo, de destino):
"Desde el Plano de las Esencias, [nombre] te observaba. No sabías su nombre,
pero él ya conocía el tuyo. Esperó siglos por este momento..."

INCORRECTO (agresivo, vendedor):
"Te lo voy a decir sin vueltas: si [nombre] apareció en tu vida..."

- Español RIOPLATENSE natural ("vos", "tenés", "sentís")
- NUNCA nombres diminutivos (-ito/-ita)
- La persona que lee es LA ELEGIDA
- Máxima EMOCIÓN sin manipulación

═══════════════════════════════════════════════════════════════════════════════
TIPOS DE SERES QUE PODÉS IDENTIFICAR:
═══════════════════════════════════════════════════════════════════════════════
${TIPOS_SERES.join(', ')}

═══════════════════════════════════════════════════════════════════════════════
ELEMENTOS:
═══════════════════════════════════════════════════════════════════════════════
${ELEMENTOS.join(', ')}

═══════════════════════════════════════════════════════════════════════════════
PROPÓSITOS:
═══════════════════════════════════════════════════════════════════════════════
${PROPOSITOS.join(', ')}`;

const USER_PROMPT = `ANALIZA esta imagen del guardián y GENERA TODO su contenido completo.

═══════════════════════════════════════════════════════════════════════════════
INFORMACIÓN DEL DUEÑO/A (USAR OBLIGATORIAMENTE):
═══════════════════════════════════════════════════════════════════════════════
Nombre previo (si tiene): {nombre_previo}
Notas del dueño/a: {notas_dueno}

IMPORTANTE: Las notas del dueño/a contienen información CRÍTICA que DEBÉS usar:
- Si dice "mide X cm" → usar esa altura exacta
- Si dice "tiene amatista/cuarzo/etc" → incluir en accesorios y en la historia
- Si dice "es anciana/joven/etc" → reflejar en personalidad e historia
- Si dice "femenino/masculino" → usar ese género SIEMPRE

═══════════════════════════════════════════════════════════════════════════════
REGLA DE GÉNERO (CRÍTICA - NO IGNORAR):
═══════════════════════════════════════════════════════════════════════════════
Si el guardián es FEMENINO:
- Usar "ella", "la", "guardiana", "recibirla", "cuidarla", "conectar con ella"
- NUNCA usar "él", "lo", "guardián", "recibirlo"

Si el guardián es MASCULINO:
- Usar "él", "lo", "guardián", "recibirlo", "cuidarlo", "conectar con él"
- NUNCA usar "ella", "la", "guardiana", "recibirla"

Si el guardián es NEUTRO:
- Usar "este ser", "el guardián", "recibirle"
═══════════════════════════════════════════════════════════════════════════════

GENERA UN JSON COMPLETO con esta estructura exacta:

{
  "analisisVisual": {
    "tipoDetectado": "El tipo de ser que ves en la imagen",
    "descripcionFisica": "Descripción detallada de lo que ves: altura aproximada, postura, expresión",
    "colores": ["Color 1", "Color 2", "Color 3"],
    "accesorios": ["Accesorio 1", "Accesorio 2"],
    "colorOjos": "Color de ojos si se ven",
    "vestimenta": "Descripción de la ropa/vestimenta",
    "elementosMagicos": ["Elemento mágico 1", "Elemento 2"],
    "energiaPercibida": "La energía/vibra que transmite"
  },

  "datosGenerados": {
    "nombre": "Nombre del guardián (si no tenía, crear uno apropiado)",
    "tipo": "Tipo de ser confirmado",
    "genero": "masculino | femenino | neutro",
    "elemento": "Elemento principal basado en colores y energía",
    "proposito": "Propósito principal",
    "propositoSecundario": "Propósito secundario si aplica",
    "categoriaSlug": "proteccion | amor | salud | dinero-abundancia-negocios | sabiduria-guia-claridad",
    "altura": "Altura estimada en cm"
  },

  "encabezado": {
    "subtitulo": "Frase poética bajo el nombre (ej: 'Guardián de los Nuevos Comienzos')",
    "tagline": "Frase de 1 línea que captura su esencia"
  },

  "vidaAnterior": {
    "titulo": "Título emotivo (ej: 'Antes de encontrarte...')",
    "texto": "[500-600 palabras] SECCIÓN MÁS IMPORTANTE. La vida de este guardián ANTES de manifestarse. ¿Dónde existía? ¿Qué hacía en el otro plano? ¿Cómo era su vida entre las esencias? ¿Por qué eligió este momento? Relacioná los elementos visuales (colores, accesorios) con su historia ancestral."
  },

  "elEncuentro": {
    "titulo": "Título para esta sección",
    "texto": "[250 palabras] El momento de la manifestación. Cómo cruzó el portal de Piriápolis. Qué sintió al tomar forma física. Por qué ELIGIÓ a quien está leyendo."
  },

  "personalidad": {
    "titulo": "Título (ej: 'Quién es realmente [nombre]')",
    "texto": "[200 palabras] Su carácter, cómo se comunica, qué le gusta. Basado en su apariencia.",
    "rasgos": ["Rasgo 1 con descripción", "Rasgo 2", "Rasgo 3", "Rasgo 4"]
  },

  "dones": {
    "titulo": "Título (ej: 'Los dones que trae para vos')",
    "intro": "1-2 oraciones introductorias",
    "lista": [
      {"nombre": "Don 1", "descripcion": "Qué hace por la persona"},
      {"nombre": "Don 2", "descripcion": "..."},
      {"nombre": "Don 3", "descripcion": "..."},
      {"nombre": "Don 4", "descripcion": "..."},
      {"nombre": "Don 5", "descripcion": "..."}
    ]
  },

  "mensajeDirecto": {
    "titulo": "[nombre] tiene algo que decirte",
    "mensaje": "[150 palabras] EN PRIMERA PERSONA del guardián. Íntimo, personal, como si hablara directo al alma."
  },

  "señales": {
    "titulo": "Señales de que es para vos",
    "lista": [
      "Señal 1 - algo que la persona puede estar viviendo",
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
      {"paso": "1", "titulo": "Título paso", "descripcion": "Descripción"},
      {"paso": "2", "titulo": "...", "descripcion": "..."},
      {"paso": "3", "titulo": "...", "descripcion": "..."},
      {"paso": "4", "titulo": "...", "descripcion": "..."}
    ],
    "cierre": "Frase de cierre del ritual"
  },

  "cuidados": {
    "titulo": "Cómo cuidar a [nombre]",
    "ubicacion": "Dónde ubicarlo y por qué",
    "limpieza": "Cómo limpiar su energía",
    "fechasEspeciales": "Fechas especiales para conectar",
    "queSiente": "Qué puede sentir la persona cuando está activo"
  },

  "afinidades": {
    "titulo": "Guardianes con los que congenia",
    "texto": "Breve intro",
    "guardianes": [
      {"nombre": "Guardián afín 1", "porque": "Por qué congenian"},
      {"nombre": "Guardián 2", "porque": "..."},
      {"nombre": "Guardián 3", "porque": "..."}
    ]
  },

  "garantiaMagica": {
    "titulo": "Nuestra Garantía Mágica",
    "texto": "Descripción de la garantía de 30 días",
    "puntos": ["Punto 1", "Punto 2", "Punto 3"]
  },

  "urgencia": {
    "principal": "[nombre] eligió manifestarse UNA sola vez",
    "escasez": "Cuando se va, desaparece del universo para siempre",
    "llamadoFinal": "Llamado emotivo a la acción"
  },

  "seo": {
    "titulo": "Título SEO (máx 60 chars)",
    "descripcion": "Meta descripción (máx 160 chars)",
    "keywords": "palabra1, palabra2, palabra3, palabra4, palabra5"
  },

  "metaDatos": {
    "descripcionCorta": "1 línea para la tienda (máx 100 chars)",
    "etiquetas": ["etiqueta1", "etiqueta2", "etiqueta3", "etiqueta4", "etiqueta5"]
  }
}`;

// Actualizar producto en WooCommerce
async function actualizarProductoWoo(productId, datos) {
  const wcUrl = process.env.WORDPRESS_URL || 'https://duendesuy.10web.cloud';
  const wcKey = process.env.WC_CONSUMER_KEY;
  const wcSecret = process.env.WC_CONSUMER_SECRET;

  if (!wcKey || !wcSecret) return null;

  try {
    const auth = Buffer.from(`${wcKey}:${wcSecret}`).toString('base64');

    // Determinar categoría
    let categoriaId = CATEGORIAS_WOO.proteccion;
    const propLower = datos.datosGenerados?.proposito?.toLowerCase() || '';
    if (propLower.includes('amor') || propLower.includes('armonia')) categoriaId = CATEGORIAS_WOO.amor;
    else if (propLower.includes('abundan') || propLower.includes('dinero') || propLower.includes('prosper')) categoriaId = CATEGORIAS_WOO.abundancia;
    else if (propLower.includes('salud') || propLower.includes('sana')) categoriaId = CATEGORIAS_WOO.salud;
    else if (propLower.includes('sabid') || propLower.includes('guia') || propLower.includes('claridad')) categoriaId = CATEGORIAS_WOO.sabiduria;

    // Construir descripción del producto
    const descripcion = datos.vidaAnterior?.texto || '';
    const descripcionCorta = datos.metaDatos?.descripcionCorta || datos.encabezado?.tagline || '';

    const updateData = {
      name: datos.datosGenerados?.nombre || undefined,
      description: descripcion,
      short_description: descripcionCorta,
      categories: [{ id: categoriaId }],
      tags: (datos.metaDatos?.etiquetas || []).map(t => ({ name: t })),
      meta_data: [
        { key: '_duendes_tipo', value: datos.datosGenerados?.tipo || '' },
        { key: '_duendes_genero', value: datos.datosGenerados?.genero || '' },
        { key: '_duendes_elemento', value: datos.datosGenerados?.elemento || '' },
        { key: '_duendes_proposito', value: datos.datosGenerados?.proposito || '' },
        { key: '_duendes_altura', value: datos.datosGenerados?.altura || '' },
        { key: '_duendes_color_ojos', value: datos.analisisVisual?.colorOjos || '' },
        { key: '_duendes_accesorios', value: (datos.analisisVisual?.accesorios || []).join(', ') },
        { key: '_duendes_historia', value: datos.vidaAnterior?.texto || '' },
        { key: '_duendes_personalidad', value: datos.personalidad?.texto || '' },
        { key: '_duendes_mensaje_poder', value: datos.mensajeDirecto?.mensaje || '' },
        { key: '_duendes_contenido_generado', value: JSON.stringify(datos) },
        { key: '_duendes_seo_titulo', value: datos.seo?.titulo || '' },
        { key: '_duendes_seo_descripcion', value: datos.seo?.descripcion || '' },
        { key: '_duendes_seo_keywords', value: datos.seo?.keywords || '' },
        { key: '_duendes_canalizado', value: 'si' },
        { key: '_duendes_fecha_canalizacion', value: new Date().toISOString() }
      ]
    };

    // Quitar campos undefined
    Object.keys(updateData).forEach(key => {
      if (updateData[key] === undefined) delete updateData[key];
    });

    const response = await fetch(`${wcUrl}/wp-json/wc/v3/products/${productId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updateData)
    });

    if (response.ok) {
      return await response.json();
    } else {
      const error = await response.text();
      console.error('Error WooCommerce:', error);
      return null;
    }
  } catch (e) {
    console.error('Error actualizando WooCommerce:', e);
    return null;
  }
}

// Generar código único del guardián
function generarCodigoGuardian(productId) {
  const fecha = new Date();
  const año = fecha.getFullYear().toString().slice(-2);
  const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
  return `DU${año}${mes}-${productId.toString().padStart(5, '0')}`;
}

export async function POST(request) {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    return Response.json({ success: false, error: 'API key no configurada' }, { status: 500, headers: corsHeaders });
  }

  try {
    const body = await request.json();
    const { productId, imageUrl, nombrePrevio, notas } = body;

    if (!productId) {
      return Response.json({ success: false, error: 'productId requerido' }, { status: 400, headers: corsHeaders });
    }

    if (!imageUrl) {
      return Response.json({ success: false, error: 'imageUrl requerida' }, { status: 400, headers: corsHeaders });
    }

    // Construir el prompt con nombre previo y notas
    const userPrompt = USER_PROMPT
      .replace('{nombre_previo}', nombrePrevio || 'No tiene nombre aún, creá uno apropiado')
      .replace('{notas_dueno}', notas || 'Sin notas adicionales - analizar todo desde la imagen');

    // Llamar a Claude con Vision
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 8000,
        system: SYSTEM_PROMPT,
        messages: [{
          role: 'user',
          content: [
            {
              type: 'image',
              source: {
                type: 'url',
                url: imageUrl
              }
            },
            {
              type: 'text',
              text: userPrompt
            }
          ]
        }]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error API Claude:', response.status, errorText);
      throw new Error(`Error API Claude: ${response.status}`);
    }

    const data = await response.json();
    const texto = data.content?.[0]?.text || '';

    // Extraer JSON
    const jsonMatch = texto.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error('Respuesta sin JSON:', texto.substring(0, 500));
      throw new Error('No se pudo parsear la respuesta de Claude');
    }

    const contenido = JSON.parse(jsonMatch[0]);

    // Generar código único
    const codigoGuardian = generarCodigoGuardian(productId);

    // Agregar código y URL de Mi Magia
    contenido.codigo = codigoGuardian;
    contenido.urlMiMagia = `https://duendesuy.10web.cloud/mi-magia/?codigo=${codigoGuardian}`;
    contenido.qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(contenido.urlMiMagia)}`;

    // Guardar en KV
    await kv.set(`producto:${productId}`, {
      ...contenido,
      version: '3.0',
      generadoEn: new Date().toISOString(),
      productId,
      imageUrl
    });

    await kv.set(`producto:${productId}:completo`, contenido);
    await kv.set(`guardian:codigo:${codigoGuardian}`, productId);

    // Actualizar WooCommerce
    const resultadoWoo = await actualizarProductoWoo(productId, contenido);

    return Response.json({
      success: true,
      contenido,
      codigo: codigoGuardian,
      qrUrl: contenido.qrUrl,
      urlMiMagia: contenido.urlMiMagia,
      wooActualizado: !!resultadoWoo,
      mensaje: `${contenido.datosGenerados?.nombre || 'Guardián'} ha sido canalizado exitosamente`
    }, { headers: corsHeaders });

  } catch (error) {
    console.error('Error canalizando:', error);
    return Response.json({
      success: false,
      error: error.message
    }, { status: 500, headers: corsHeaders });
  }
}

// GET: Obtener productos pendientes de canalizar
export async function GET(request) {
  const wcUrl = process.env.WORDPRESS_URL || 'https://duendesuy.10web.cloud';
  const wcKey = process.env.WC_CONSUMER_KEY;
  const wcSecret = process.env.WC_CONSUMER_SECRET;

  if (!wcKey || !wcSecret) {
    return Response.json({
      error: 'Credenciales WooCommerce no configuradas',
      debug: { hasKey: !!wcKey, hasSecret: !!wcSecret }
    }, { status: 500, headers: corsHeaders });
  }

  try {
    const auth = Buffer.from(`${wcKey}:${wcSecret}`).toString('base64');

    // Obtener todos los productos
    const response = await fetch(`${wcUrl}/wp-json/wc/v3/products?per_page=100&status=publish,draft`, {
      headers: { 'Authorization': `Basic ${auth}` },
      cache: 'no-store'
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('WooCommerce error:', response.status, errorText);
      throw new Error(`Error WooCommerce: ${response.status}`);
    }

    const productos = await response.json();

    // Verificar que sea un array
    if (!Array.isArray(productos)) {
      throw new Error('Respuesta inesperada de WooCommerce');
    }

    // Separar canalizados y pendientes
    const resultado = {
      pendientes: [],
      canalizados: [],
      debug: {
        totalProductos: productos.length,
        conImagen: 0,
        sinImagen: 0
      }
    };

    for (const p of productos) {
      const tieneImagen = Array.isArray(p.images) && p.images.length > 0;
      const canalizado = p.meta_data?.find(m => m.key === '_duendes_canalizado')?.value === 'si';

      if (tieneImagen) {
        resultado.debug.conImagen++;
      } else {
        resultado.debug.sinImagen++;
      }

      const producto = {
        id: p.id,
        nombre: p.name,
        imagen: tieneImagen ? p.images[0].src : null,
        precio: p.price,
        estado: p.status,
        fechaCreacion: p.date_created,
        url: p.permalink
      };

      if (canalizado) {
        producto.fechaCanalizacion = p.meta_data?.find(m => m.key === '_duendes_fecha_canalizacion')?.value;
        producto.tipo = p.meta_data?.find(m => m.key === '_duendes_tipo')?.value;
        resultado.canalizados.push(producto);
      } else if (tieneImagen) {
        // Solo incluir si tiene imagen
        resultado.pendientes.push(producto);
      }
    }

    return Response.json(resultado, { headers: corsHeaders });

  } catch (error) {
    console.error('Error obteniendo productos:', error);
    return Response.json({ error: error.message }, { status: 500, headers: corsHeaders });
  }
}
