import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { kv } from '@vercel/kv';

// IMPORTANTE: Aumentar el timeout a 60 segundos para las llamadas a Claude
export const maxDuration = 60;

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// Headers CORS para permitir llamadas desde WordPress
const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// ═══════════════════════════════════════════════════════════════
// API CANALIZAR PRODUCTO - Generación de historias con IA
// ═══════════════════════════════════════════════════════════════

// Manejar preflight CORS
export async function OPTIONS() {
    return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(request) {
    try {
        const data = await request.json();
        const { action } = data;

        let response;
        switch (action) {
            case 'generate':
                response = await generateStory(data);
                break;
            case 'improve':
                response = await improveStory(data);
                break;
            case 'regenerate':
                response = await regenerateStory(data);
                break;
            case 'feedback':
                response = await saveFeedback(data);
                break;
            default:
                response = NextResponse.json({ success: false, error: 'Acción no válida' });
        }

        // Agregar headers CORS a la respuesta
        const headers = new Headers(response.headers);
        Object.entries(corsHeaders).forEach(([key, value]) => {
            headers.set(key, value);
        });

        return new NextResponse(response.body, {
            status: response.status,
            statusText: response.statusText,
            headers
        });

    } catch (error) {
        console.error('Error en canalizar-producto:', error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500, headers: corsHeaders }
        );
    }
}

// ═══════════════════════════════════════════════════════════════
// GENERAR HISTORIA NUEVA
// ═══════════════════════════════════════════════════════════════

async function generateStory(data) {
    // Obtener catálogo existente para evitar repetición
    const existingProducts = await getExistingProducts();

    // Obtener imágenes del producto si hay ID
    let imageDescriptions = [];
    if (data.product_id) {
        imageDescriptions = await getProductImages(data.product_id);
    }

    // Obtener insights de Tito
    const titoInsights = await getTitoInsights();

    // Construir el prompt
    const prompt = buildGenerationPrompt(data, existingProducts, imageDescriptions, titoInsights);

    // Llamar a Claude
    const response = await anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4000,
        messages: [{ role: 'user', content: prompt }]
    });

    const content = response.content[0].text;

    // Parsear la respuesta
    const result = parseClaudeResponse(content);

    // Guardar para aprendizaje
    await saveGeneration(data, result);

    return NextResponse.json({
        success: true,
        ...result
    });
}

// ═══════════════════════════════════════════════════════════════
// MEJORAR HISTORIA EXISTENTE
// ═══════════════════════════════════════════════════════════════

async function improveStory(data) {
    const { modificacion, descripcion_actual } = data;

    const prompt = `Sos el canalizador de historias de Duendes del Uruguay.

HISTORIA ACTUAL:
${descripcion_actual}

MODIFICACIÓN SOLICITADA:
${modificacion}

REGLAS ABSOLUTAS (NO ROMPER):
- NO uses frases genéricas de IA como "En lo profundo del bosque", "Las brumas", "El susurro del viento ancestral"
- NO uses metáforas vacías sin significado real
- NO uses relleno poético que no aporta
- SÍ mantené impacto emocional desde la primera frase
- SÍ escribí como si la historia fuera vivida, no inventada
- SÍ usá detalles específicos y concretos

Aplicá la modificación solicitada manteniendo la esencia pero ajustando según lo pedido.

Respondé SOLO con el formato:

TITULO: [título del producto]
DESCRIPCION_CORTA: [frase gancho de máximo 2 líneas]
DESCRIPCION: [historia completa mejorada]
SEO_TITLE: [título SEO optimizado, máximo 60 caracteres]
SEO_DESCRIPTION: [meta description, máximo 155 caracteres]`;

    const response = await anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4000,
        messages: [{ role: 'user', content: prompt }]
    });

    const result = parseClaudeResponse(response.content[0].text);

    return NextResponse.json({
        success: true,
        ...result
    });
}

// ═══════════════════════════════════════════════════════════════
// REGENERAR CON ESTILO
// ═══════════════════════════════════════════════════════════════

async function regenerateStory(data) {
    const { estilo, descripcion_actual } = data;

    const estilos = {
        mistico: 'Hacelo más místico y esotérico, con referencias a energías, conexiones cósmicas y dimensiones sutiles. Pero sin caer en clichés.',
        terrenal: 'Hacelo más terrenal y accesible, con referencias a la vida cotidiana y situaciones reales que la gente vive.',
        emotivo: 'Hacelo más emotivo y profundo, que toque el corazón, que genere un nudo en la garganta.',
        conciso: 'Hacelo más corto y directo, eliminá todo lo que no sea esencial. Cada palabra debe pesar.',
        poetico: 'Hacelo más poético pero sin usar clichés de IA. Poesía real, con ritmo y belleza genuina.'
    };

    const instruccionEstilo = estilos[estilo] || 'Mejoralo manteniendo la esencia.';

    const prompt = `Sos el canalizador de historias de Duendes del Uruguay.

HISTORIA ACTUAL:
${descripcion_actual}

INSTRUCCIÓN DE ESTILO:
${instruccionEstilo}

REGLAS ABSOLUTAS (NO ROMPER):
- NO uses frases genéricas de IA como "En lo profundo del bosque", "Las brumas", "El susurro del viento ancestral"
- NO uses metáforas vacías sin significado real
- NO uses relleno poético que no aporta
- SÍ mantené impacto emocional desde la primera frase
- SÍ escribí como si la historia fuera vivida, no inventada
- SÍ usá detalles específicos y concretos

Regenerá la historia con el estilo solicitado.

Respondé SOLO con el formato:

TITULO: [título del producto]
DESCRIPCION_CORTA: [frase gancho de máximo 2 líneas]
DESCRIPCION: [historia completa regenerada]
SEO_TITLE: [título SEO optimizado, máximo 60 caracteres]
SEO_DESCRIPTION: [meta description, máximo 155 caracteres]`;

    const response = await anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4000,
        messages: [{ role: 'user', content: prompt }]
    });

    const result = parseClaudeResponse(response.content[0].text);

    return NextResponse.json({
        success: true,
        ...result
    });
}

// ═══════════════════════════════════════════════════════════════
// CONSTRUIR PROMPT DE GENERACIÓN
// ═══════════════════════════════════════════════════════════════

function buildGenerationPrompt(data, existingProducts, imageDescriptions, titoInsights) {
    const {
        categoria, tipo_ser, genero, especie_nueva,
        tamano, tamano_exacto, edicion, es_literatura,
        es_virtual, tipo_virtual, formato_virtual, caracteristicas_virtual,
        fecha_nacimiento, hora_nacimiento, lugar_nacimiento,
        nombre, proposito, elemento, cristales, edad_aparente, notas
    } = data;

    // Información de tamaño
    const tamanoInfo = {
        mini: {
            medida: '10-15 cm',
            nota_clasica: 'Los Mini Clásicos son recreables, artesanales. Cada uno nace de manos que nunca repiten exactamente el mismo gesto.',
            nota_especial: 'Los Mini Especiales son únicos, con más detalle y atención.',
            nota_mistica: 'Los Mini Edición Mística son piezas selectas de lujo energético, creadas cuando las condiciones son óptimas.'
        },
        mediano: {
            medida: '16-26 cm',
            nota: 'Pieza única de colección. Este ser existe una sola vez en el universo.'
        },
        grande: {
            medida: '25-40 cm',
            nota: 'Obra de arte única que no se repetirá. Fue creado para quien estaba destinado a recibirlo.'
        },
        gigante: {
            medida: '50-80 cm',
            nota: 'Monumento de energía concentrada. Pieza irrepetible de presencia imponente que marca un antes y después.'
        }
    };

    const infoTamano = tamanoInfo[tamano] || tamanoInfo.mediano;
    let notaTamano = '';
    if (tamano === 'mini') {
        notaTamano = infoTamano[`nota_${edicion}`] || infoTamano.nota_especial;
    } else {
        notaTamano = infoTamano.nota;
    }

    // Lista de nombres existentes
    const nombresExistentes = existingProducts.map(p => p.nombre || p.name).filter(Boolean).join(', ');

    // Descripción de imágenes
    const imagenInfo = imageDescriptions.length > 0
        ? `\nDETALLES VISUALES DEL PRODUCTO (extraídos de las fotos):\n${imageDescriptions.join('\n')}`
        : '';

    // Insights de Tito
    const titoInfo = titoInsights
        ? `\nINSIGHTS DE TITO (lo que la gente busca):\n${titoInsights}`
        : '';

    // Información de producto virtual
    const virtualInfo = es_virtual ? `

PRODUCTO VIRTUAL:
- Tipo: ${tipo_virtual || 'digital'}
- Formato: ${formato_virtual || 'digital'}
- Características: ${caracteristicas_virtual || 'producto digital'}
- IMPORTANTE: No mencionar tamaño físico en la descripción, enfocarse en beneficios y contenido digital` : '';

    // Tamaño exacto si está especificado
    const tamanoExactoInfo = tamano_exacto ? `\n- Medidas exactas: ${tamano_exacto}` : '';

    return `Sos un copywriter de elite especializado en neuroventas, con 20 años de experiencia vendiendo productos emocionales de alto valor. Trabajaste con las mejores marcas de lujo y conocés cada técnica psicológica para generar deseo de compra sin que parezca venta.

Tu trabajo: crear la historia de un ser místico que haga que el comprador compulsivo sienta que NECESITA este ser en su vida. No vendés un producto, vendés una transformación personal.

═══════════════════════════════════════════════════════════════
FRAMEWORK DE NEUROVENTA AVANZADA
═══════════════════════════════════════════════════════════════

PASO 1 - IDENTIFICAR EL DOLOR OCULTO:
Según el propósito del ser, identificá qué DOLOR REAL tiene la persona:
- Abundancia → Miedo a no ser suficiente, culpa por desear dinero, sensación de que otros tienen la llave que vos no tenés
- Protección → Ansiedad constante, sensación de vulnerabilidad, experiencias pasadas de traición o daño
- Sanación → Heridas emocionales no resueltas, cansancio del alma, sentirse roto por dentro
- Amor → Miedo a no ser amado, patrones de relaciones que se repiten, vacío que nada llena
- Claridad → Parálisis por análisis, confusión sobre el camino, desconexión de la intuición

PASO 2 - TÉCNICAS ESPECÍFICAS A APLICAR:

A) EFECTO ESPEJO (Mirroring):
- El ser VIVIÓ algo similar a lo que vive el lector
- "Yo también pasé años sintiéndome..." (sin decir "te entiendo")
- Generar identificación a través de la experiencia compartida

B) LOOP ABIERTO (Open Loop):
- Introducir una idea que genera curiosidad y no se cierra inmediatamente
- "Hay algo que descubrí después de perderlo todo, y es lo que vengo a enseñarte"
- El lector necesita seguir leyendo para "cerrar" el loop

C) PRUEBA SOCIAL IMPLÍCITA:
- El ser menciona haber ayudado a otros sin sonar a testimonial
- "He visto cómo personas que juraban que nada cambiaría, de pronto..."
- No decir "miles de clientes satisfechos"

D) INVERSIÓN DE RIESGO:
- El ser asume la responsabilidad del cambio
- "Mi trabajo es quedarme hasta que entiendas lo que siempre supiste"
- Quita presión al comprador

E) ANCLAJE DE IDENTIDAD:
- Conectar la compra con quién ES la persona (no con lo que TIENE)
- "Este ser busca a quienes ya decidieron que merecen más"
- El comprador se autoselecciona como "digno"

F) ESCASEZ REAL (no fabricada):
- Este ser es ÚNICO, artesanal, irrepetible
- "Fui creado una sola vez. No habrá otro igual"
- Verdad, no manipulación

G) URGENCIA EMOCIONAL (no temporal):
- No "comprá antes de las 12"
- Sí: "¿Cuánto más vas a esperar para darte lo que necesitás?"
- La urgencia es interna, no externa

PASO 3 - ESTRUCTURA NARRATIVA EXPERTA:

PÁRRAFO 1 - EL GANCHO (tercera persona):
Función: Detener el scroll, generar intriga, crear identificación inmediata
Técnica: Empezar con una VERDAD INCÓMODA o una PREGUNTA IMPLÍCITA
MAL ejemplo: "Este duende fue creado con amor y dedicación"
BUEN ejemplo: "Algunos seres eligen llegar justo cuando dejaste de creer que algo podía cambiar."
EXCELENTE: "Hay un momento exacto en que el universo decide que ya esperaste suficiente."

PÁRRAFO 2-3 - LA HISTORIA DEL SER (primera persona):
Función: Generar empatía a través de vulnerabilidad compartida
El ser cuenta UNA experiencia específica de su vida (inventala)
Debe incluir: un momento de quiebre, un aprendizaje doloroso, una transformación
"Yo viví siglos creyendo que mi valor dependía de cuánto daba a otros. Hasta que me quedé vacío."
"Aprendí de la peor manera que proteger a todos menos a vos mismo no es nobleza, es autodestrucción."

PÁRRAFO 4 - EL PUENTE (primera persona):
Función: Conectar la historia del ser con la vida del lector SIN DECIR "vos también"
"Por eso reconozco esa energía. Esa forma de dar más de lo que recibís."
"Sé lo que se siente cargar con todo mientras sonreís para que nadie pregunte."
El lector debe sentirse descubierto sin que se lo digan explícitamente.

PÁRRAFO 5 - LA PROMESA (primera persona):
Función: Mostrar el futuro posible, establecer el compromiso del ser
No es "te voy a ayudar" (genérico)
Es específico: "Mi trabajo es recordarte cada mañana que el dinero no te hace mala persona"
"Voy a estar ahí cuando la voz de la culpa quiera convencerte de que no merecés esto"
Incluir su PODER ESPECÍFICO y cómo lo usa en lo cotidiano

═══════════════════════════════════════════════════════════════
PERSONALIDAD DEL SER - ARQUETIPOS AVANZADOS
═══════════════════════════════════════════════════════════════

No son personajes planos. Elegí UN arquetipo y desarrollalo:

EL SABIO HERIDO: Sabiduría que viene del dolor transformado. Habla poco pero cada palabra pesa. No da consejos, hace preguntas que desestabilizan. "¿Y si lo que llamás fracaso fue en realidad protección?"

EL GUERRERO GENTIL: Fuerza combinada con ternura. Protege sin sobreproteger. "No voy a pelear tus batallas, pero voy a estar parado a tu lado mientras vos las peleás."

EL ALQUIMISTA: Transforma dolor en poder. Ve el oro en la basura. "Lo que querés esconder es exactamente lo que te va a liberar."

LA ANCIANA JOVEN: Tiene miles de años pero energía de niño. Toma la vida en serio sin tomarse en serio a sí misma. "La vida es demasiado importante para andar con cara de velorio."

EL MÍSTICO PRÁCTICO: Espiritualidad aterrizada. No vende humo. "La meditación está muy bien, pero a veces lo que necesitás es una buena siesta y un abrazo."

═══════════════════════════════════════════════════════════════
BLACKLIST ABSOLUTA - FRASES PROHIBIDAS
═══════════════════════════════════════════════════════════════

ELIMINAR DE TU VOCABULARIO:
- "En lo profundo del bosque..." (cliché #1 de IA)
- "Las brumas del otoño/ancestrales/místicas..."
- "El susurro del viento..."
- "Desde tiempos inmemoriales..."
- "Un manto de estrellas..."
- "La danza de las hojas/las sombras/la luz..."
- "El velo entre los mundos..."
- "Empatizo contigo / Te entiendo perfectamente"
- "En las aguas cristalinas/sagradas..."
- "El poder del universo..."
- "Energías cósmicas que..."
- Cualquier frase que hayas leído en 100 productos similares

TAMBIÉN PROHIBIDO:
- Empezar con descripción del escenario (nadie compra escenarios)
- Adjetivos vacíos: "hermoso", "mágico", "especial" sin contexto
- Promesas genéricas: "te ayudará en tu camino"
- Espiritualidad de Instagram: "todo pasa por algo", "el universo conspira"

═══════════════════════════════════════════════════════════════
WHITELIST - ESTO SÍ FUNCIONA
═══════════════════════════════════════════════════════════════

USAR:
- Frases que empiecen con "Hay personas que..." (genera identificación)
- Preguntas retóricas: "¿Cuántas veces te prometiste que esta vez sería diferente?"
- Detalles sensoriales específicos: no "un bosque", sino "el olor a tierra mojada después de tres días de lluvia"
- Contradicciones interesantes: "la fuerza de rendirse", "la valentía de pedir ayuda"
- Lenguaje de conversación: como si el ser hablara en un café, no en un templo
- Humor sutil si aplica al personaje (no todos son serios)

═══════════════════════════════════════════════════════════════
INFORMACIÓN DEL SER A CREAR
═══════════════════════════════════════════════════════════════

CLASIFICACIÓN:
- Categoría: ${categoria || 'guardián'}
- Tipo de ser: ${tipo_ser || 'duende'}
- Género/Energía: ${genero || 'neutro'}
- ${especie_nueva ? 'INVENTAR ESPECIE ÚNICA para este ser (nombre creativo y significado)' : ''}

TAMAÑO Y EDICIÓN:
- Tamaño: ${tamano} (${infoTamano.medida})${tamanoExactoInfo}
- Edición: ${edicion}
- ${es_literatura ? 'Es personaje de literatura clásica - nuestra interpretación canalizada' : 'Ser único, irrepetible'}
- Nota de edición: ${notaTamano}
${virtualInfo}

DATOS DE NACIMIENTO:
- Fecha: ${fecha_nacimiento || 'Desconocida'}
- Hora: ${hora_nacimiento || 'Desconocida'}
- Lugar: ${lugar_nacimiento || 'Reinos místicos'}

CARACTERÍSTICAS:
- Nombre: ${nombre || 'GENERAR UN NOMBRE ÚNICO que no esté en la lista de existentes'}
- Propósito: ${proposito || 'protección'}
- Elemento: ${elemento || 'tierra'}
- Cristales: ${cristales || 'ninguno especificado'}
- Edad aparente: ${edad_aparente || 'atemporal'}
- Notas adicionales: ${notas || 'ninguna'}
${imagenInfo}

═══════════════════════════════════════════════════════════════
CONTEXTO DEL CATÁLOGO (evitar repetición)
═══════════════════════════════════════════════════════════════

Nombres ya existentes: ${nombresExistentes || 'ninguno aún'}
Total de productos: ${existingProducts.length}
${titoInfo}

═══════════════════════════════════════════════════════════════
SEO PARA RANK MATH (COMPLETAR TODO)
═══════════════════════════════════════════════════════════════

KEYWORDS DE MARCA OBLIGATORIAS (usar al menos 2-3 en tags y descripción):
- "duende canalizado" / "duendes canalizados"
- "duende artesanal" / "duendes artesanales"
- "duende activado" / "duendes activados"
- "duende real" / "duendes reales"
- "guardián canalizado" (si es guardián)

Estas palabras son ESENCIALES para el SEO de la marca. SIEMPRE incluirlas.

Generá contenido SEO optimizado:
- Focus keyword: combinar tipo de ser + propósito + "canalizado" (ej: "duende de abundancia canalizado")
- Título SEO: incluir "canalizado" o "artesanal"
- Meta description: mencionar que es artesanal y canalizado
- Tags: OBLIGATORIO incluir: duende canalizado, duende artesanal, duende real + los específicos del producto

═══════════════════════════════════════════════════════════════
FORMATO DE RESPUESTA
═══════════════════════════════════════════════════════════════

Respondé EXACTAMENTE con este formato:

NOMBRE_GENERADO: [nombre único si no se proporcionó uno]
TITULO: [Nombre - Subtítulo místico corto que venda]
DESCRIPCION_CORTA: [Frase gancho de máximo 2 líneas - debe generar curiosidad y emoción]
DESCRIPCION: [Historia completa siguiendo estructura MIXTA: intro tercera persona + ser habla en primera persona]
SEO_TITLE: [Título optimizado, máximo 60 chars, DEBE incluir "canalizado" o "artesanal"]
SEO_DESCRIPTION: [Meta description, máximo 155 chars, mencionar "duende canalizado artesanal"]
FOCUS_KEYWORD: [Keyword principal, ej: "duende canalizado abundancia" o "guardián artesanal protección"]
TIPO_SER: [Qué tipo de ser es exactamente]
CATEGORIA_SUGERIDA: [Categoría de WooCommerce sugerida]
TAGS: [OBLIGATORIO: duende canalizado, duende artesanal, duende real, duende activado + cristales, propósito, elemento, etc.]
PERSONALIDAD: [Breve descripción de la personalidad única de este ser]`;
}

// ═══════════════════════════════════════════════════════════════
// FUNCIONES AUXILIARES
// ═══════════════════════════════════════════════════════════════

async function getExistingProducts() {
    try {
        // Intentar obtener de KV cache
        const cached = await kv.get('productos:catalogo');
        if (cached && Array.isArray(cached)) return cached;

        // Si no hay cache, obtener de WooCommerce
        const WOO_URL = process.env.WOO_URL || 'https://duendesuy.10web.cloud';
        const WOO_KEY = process.env.WC_CONSUMER_KEY;
        const WOO_SECRET = process.env.WC_CONSUMER_SECRET;

        if (!WOO_KEY || !WOO_SECRET) return [];

        const auth = Buffer.from(`${WOO_KEY}:${WOO_SECRET}`).toString('base64');
        const response = await fetch(
            `${WOO_URL}/wp-json/wc/v3/products?per_page=100`,
            {
                headers: {
                    'Authorization': `Basic ${auth}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        if (!response.ok) return [];

        const products = await response.json();
        return products.map(p => ({
            id: p.id,
            nombre: p.name,
            slug: p.slug
        }));

    } catch (error) {
        console.error('Error obteniendo productos:', error);
        return [];
    }
}

async function getProductImages(productId) {
    try {
        const WOO_URL = process.env.WOO_URL || 'https://duendesuy.10web.cloud';
        const WOO_KEY = process.env.WC_CONSUMER_KEY;
        const WOO_SECRET = process.env.WC_CONSUMER_SECRET;

        if (!WOO_KEY || !WOO_SECRET) return [];

        const auth = Buffer.from(`${WOO_KEY}:${WOO_SECRET}`).toString('base64');
        const response = await fetch(
            `${WOO_URL}/wp-json/wc/v3/products/${productId}`,
            {
                headers: {
                    'Authorization': `Basic ${auth}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        if (!response.ok) return [];

        const product = await response.json();
        const images = product.images || [];

        // Para cada imagen, describir (en producción podrías usar vision API)
        return images.slice(0, 3).map((img, i) =>
            `Imagen ${i + 1}: ${img.alt || 'Foto del producto'} - URL: ${img.src}`
        );

    } catch (error) {
        console.error('Error obteniendo imágenes:', error);
        return [];
    }
}

async function getTitoInsights() {
    try {
        const insights = await kv.get('tito:insights');
        if (insights) {
            return `- Búsquedas frecuentes: ${insights.busquedas || 'protección, abundancia'}
- Propósitos más pedidos: ${insights.propositos || 'sanación, claridad'}
- Tendencias: ${insights.tendencias || 'duendes para ansiedad'}`;
        }
        return null;
    } catch {
        return null;
    }
}

function parseClaudeResponse(content) {
    const result = {};

    const patterns = {
        nombre_generado: /NOMBRE_GENERADO:\s*(.+?)(?=\n[A-Z_]+:|$)/s,
        titulo: /TITULO:\s*(.+?)(?=\n[A-Z_]+:|$)/s,
        descripcion_corta: /DESCRIPCION_CORTA:\s*(.+?)(?=\n[A-Z_]+:|$)/s,
        descripcion: /DESCRIPCION:\s*(.+?)(?=\n[A-Z_]+:|$)/s,
        seo_title: /SEO_TITLE:\s*(.+?)(?=\n[A-Z_]+:|$)/s,
        seo_description: /SEO_DESCRIPTION:\s*(.+?)(?=\n[A-Z_]+:|$)/s,
        focus_keyword: /FOCUS_KEYWORD:\s*(.+?)(?=\n[A-Z_]+:|$)/s,
        tipo_ser: /TIPO_SER:\s*(.+?)(?=\n[A-Z_]+:|$)/s,
        categoria_sugerida: /CATEGORIA_SUGERIDA:\s*(.+?)(?=\n[A-Z_]+:|$)/s,
        tags: /TAGS:\s*(.+?)(?=\n[A-Z_]+:|$)/s,
        personalidad: /PERSONALIDAD:\s*(.+?)(?=\n[A-Z_]+:|$)/s
    };

    for (const [key, pattern] of Object.entries(patterns)) {
        const match = content.match(pattern);
        if (match) {
            result[key] = match[1].trim();
        }
    }

    // Convertir descripción a HTML con párrafos
    if (result.descripcion) {
        result.descripcion = textoAHtml(result.descripcion);
    }
    if (result.descripcion_corta) {
        result.descripcion_corta = '<p>' + result.descripcion_corta + '</p>';
    }

    return result;
}

// Función para convertir texto a HTML con párrafos
function textoAHtml(texto) {
    if (!texto) return '';
    // Dividir por doble salto de línea
    const parrafos = texto.split(/\n\n+/);
    return parrafos
        .map(p => {
            p = p.trim();
            if (!p) return '';
            // Reemplazar saltos simples por <br>
            p = p.replace(/\n/g, '<br>');
            // Detectar si es una cita (empieza con ")
            if (p.startsWith('"') || p.startsWith('«')) {
                return '<blockquote><p>' + p + '</p></blockquote>';
            }
            return '<p>' + p + '</p>';
        })
        .filter(p => p)
        .join('\n');
}

async function saveGeneration(data, result) {
    try {
        const key = `generaciones:${Date.now()}`;
        await kv.set(key, {
            input: data,
            output: result,
            timestamp: new Date().toISOString()
        }, { ex: 60 * 60 * 24 * 30 }); // 30 días
    } catch (error) {
        console.error('Error guardando generación:', error);
    }
}

async function saveFeedback(data) {
    try {
        const { type, product_id, form_data } = data;
        const key = `feedback:${Date.now()}`;
        await kv.set(key, {
            type,
            product_id,
            form_data,
            timestamp: new Date().toISOString()
        }, { ex: 60 * 60 * 24 * 90 }); // 90 días

        // Actualizar estadísticas de feedback
        const stats = await kv.get('feedback:stats') || { likes: 0, dislikes: 0 };
        if (type === 'like') stats.likes++;
        else stats.dislikes++;
        await kv.set('feedback:stats', stats);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error guardando feedback:', error);
        return NextResponse.json({ success: false, error: error.message });
    }
}
