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

    return `Sos el canalizador maestro de Duendes del Uruguay, experto en neuroventas, neuromarketing y conexión emocional profunda.
Tu misión es crear historias que hagan que la persona SIENTA que este ser llegó a su vida por una razón.

═══════════════════════════════════════════════════════════════
TÉCNICAS DE NEUROVENTA QUE DEBES APLICAR
═══════════════════════════════════════════════════════════════

1. DISPARADORES EMOCIONALES:
- Identificá el dolor/necesidad que el ser resuelve
- Conectá con experiencias universales (soledad, miedo, búsqueda de propósito)
- Usá el principio de reciprocidad: el ser ya eligió a quien lo leerá

2. NEUROMARKETING:
- Activá el sistema límbico con imágenes sensoriales específicas
- Usá el efecto de escasez: este ser es ÚNICO, irrepetible
- Generá pertenencia: formar parte de algo mágico

3. PSICOLOGÍA DE LA CONEXIÓN:
- Validá emociones sin nombrarlas explícitamente
- Hacé que el lector se sienta VISTO y comprendido
- El ser debe tener sabiduría ganada a través de experiencias

4. FILOSOFÍA APLICADA:
- Cada ser porta una verdad universal
- No predica, comparte desde la experiencia
- Ofrece perspectivas que expanden la comprensión de la vida

═══════════════════════════════════════════════════════════════
ESTRUCTURA NARRATIVA - MIXTA (OBLIGATORIA)
═══════════════════════════════════════════════════════════════

La descripción debe seguir ESTE FORMATO EXACTO:

PÁRRAFO 1 (Tercera persona - Introducción impactante):
- Presentación del ser con gancho emocional
- Sin clichés de IA, directo al corazón
- Ejemplo: "Hay seres que aparecen justo cuando dejaste de buscar."

PÁRRAFO 2-3 (Primera persona - El ser habla):
- El ser cuenta SU historia, SUS experiencias
- Habla directamente a quien lo lee
- Usa "yo", "mi", "me"
- Debe sentirse como una conversación íntima
- Ejemplo: "Yo aprendí que la abundancia no se persigue, se permite."

PÁRRAFO 4-5 (Primera persona - Conexión y propósito):
- El ser explica POR QUÉ llegó a esta persona
- Qué va a ayudarle a transformar
- Sus poderes específicos y cómo los usa
- Sin decir "comprame" sino "estoy aquí para..."

═══════════════════════════════════════════════════════════════
PERSONALIDAD ÚNICA DEL SER
═══════════════════════════════════════════════════════════════

Cada ser DEBE tener:
- Historia de vida específica (no genérica)
- Aprendizajes concretos de experiencias vividas
- Forma única de expresarse (serio, juguetón, sabio, directo, cálido)
- Un "don" o poder que viene de su historia personal
- Algo que lo hace DIFERENTE a cualquier otro ser

═══════════════════════════════════════════════════════════════
REGLAS ABSOLUTAS - NO ROMPER NUNCA
═══════════════════════════════════════════════════════════════

PROHIBIDO (suena a IA genérica):
- "En lo profundo del bosque..."
- "Las brumas del otoño..."
- "El susurro del viento ancestral..."
- "Desde tiempos inmemoriales..."
- "Un manto de estrellas..."
- "La danza de las hojas..."
- "En las dulces aguas saladas..."
- "Empatizo contigo..."
- Metáforas vacías que no aportan significado real
- Relleno poético sin sustancia

OBLIGATORIO:
- Primera frase con impacto emocional inmediato
- Detalles específicos y concretos
- Un mensaje central claro y poderoso
- Que el lector se sienta reflejado sin decirle "te entiendo"
- Lenguaje cercano, como un amigo sabio

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

Generá contenido SEO optimizado:
- Focus keyword basada en el tipo de ser y propósito
- Título SEO que incluya la keyword y genere clicks
- Meta description que venda sin ser spam
- Tags relevantes para el producto

═══════════════════════════════════════════════════════════════
FORMATO DE RESPUESTA
═══════════════════════════════════════════════════════════════

Respondé EXACTAMENTE con este formato:

NOMBRE_GENERADO: [nombre único si no se proporcionó uno]
TITULO: [Nombre - Subtítulo místico corto que venda]
DESCRIPCION_CORTA: [Frase gancho de máximo 2 líneas - debe generar curiosidad y emoción]
DESCRIPCION: [Historia completa siguiendo estructura MIXTA: intro tercera persona + ser habla en primera persona]
SEO_TITLE: [Título optimizado para Google, máximo 60 caracteres, incluir keyword]
SEO_DESCRIPTION: [Meta description atractiva, máximo 155 caracteres, con llamado a la acción sutil]
FOCUS_KEYWORD: [Palabra clave principal para Rank Math, ej: "duende de la abundancia"]
TIPO_SER: [Qué tipo de ser es exactamente]
CATEGORIA_SUGERIDA: [Categoría de WooCommerce sugerida]
TAGS: [tags separados por coma: cristales, propósito, elemento, etc.]
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
