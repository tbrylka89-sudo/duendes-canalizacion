import { NextResponse } from 'next/server';

/**
 * API pública para obtener productos/guardianes para el Test del Guardián
 * Devuelve productos de WooCommerce con TODA la información necesaria para matching
 */
export async function GET(request) {
    try {
        const WOO_URL = process.env.WOO_URL || 'https://duendesdeluruguay.com';
        const WOO_KEY = process.env.WC_CONSUMER_KEY || process.env.WOO_CONSUMER_KEY;
        const WOO_SECRET = process.env.WC_CONSUMER_SECRET || process.env.WOO_CONSUMER_SECRET;

        if (!WOO_KEY || !WOO_SECRET) {
            return NextResponse.json({
                success: true,
                products: getFallbackProducts(),
                source: 'fallback'
            });
        }

        const auth = Buffer.from(`${WOO_KEY}:${WOO_SECRET}`).toString('base64');

        // Obtener TODOS los productos en stock con detalles completos
        const response = await fetch(
            `${WOO_URL}/wp-json/wc/v3/products?per_page=100&status=publish&stock_status=instock`,
            {
                headers: {
                    'Authorization': `Basic ${auth}`,
                    'Content-Type': 'application/json'
                },
                next: { revalidate: 60 } // Cache por 1 minuto para tener datos frescos
            }
        );

        if (!response.ok) {
            console.error('WooCommerce error:', response.status);
            return NextResponse.json({
                success: true,
                products: getFallbackProducts(),
                source: 'fallback'
            });
        }

        const wooProducts = await response.json();

        // Transformar con TODA la información para matching inteligente
        const products = wooProducts
            .filter(p => p.images && p.images.length > 0)
            .map(p => {
                // Extraer categorías
                const categorias = (p.categories || []).map(c => c.name.toLowerCase());

                // Detectar categoría principal del nombre o categorías
                const categoriaPrincipal = detectarCategoria(p.name, p.short_description, categorias);

                // Extraer especialidades de la descripción
                const especialidades = extraerEspecialidades(p.description || p.short_description || '');

                // Extraer palabras clave de la historia
                const keywords = extraerKeywords(p.description || '');

                // Detectar dolor que resuelve
                const doloresTarget = detectarDoloresTarget(p.description || p.short_description || '');

                return {
                    id: p.id,
                    nombre: extractGuardianName(p.name),
                    nombreCompleto: p.name,
                    imagen: p.images[0]?.src || null,
                    imagenes: p.images.map(img => img.src),
                    url: p.permalink || `${WOO_URL}/product/${p.slug}`,
                    precio: parseFloat(p.price) || 0,
                    slug: p.slug,
                    // Datos para matching
                    categoria: categoriaPrincipal,
                    categorias: categorias,
                    especialidades: especialidades,
                    keywords: keywords,
                    doloresTarget: doloresTarget,
                    // Descripción corta para mostrar
                    descripcionCorta: limpiarDescripcion(p.short_description || ''),
                    // Stock
                    enStock: p.stock_status === 'instock',
                    esUnico: p.stock_quantity === 1 || p.manage_stock === false
                };
            })
            .filter(p => p.imagen && p.enStock);

        return NextResponse.json({
            success: true,
            products: products.length > 0 ? products : getFallbackProducts(),
            total: products.length,
            source: 'woocommerce',
            lastUpdate: new Date().toISOString()
        });

    } catch (error) {
        console.error('Error fetching products:', error);
        return NextResponse.json({
            success: true,
            products: getFallbackProducts(),
            source: 'fallback',
            error: error.message
        });
    }
}

/**
 * Detecta la categoría principal del guardián
 */
function detectarCategoria(nombre, descripcion, categorias) {
    const texto = `${nombre} ${descripcion}`.toLowerCase();

    // Mapeo de palabras clave a categorías
    const mapeo = {
        proteccion: ['protec', 'escudo', 'cuida', 'amparo', 'defien', 'guard'],
        abundancia: ['abundan', 'prosper', 'dinero', 'suerte', 'fortuna', 'riqueza', 'flujo'],
        sanacion: ['sana', 'cura', 'heal', 'paz', 'calm', 'tranquil', 'equilib'],
        amor: ['amor', 'corazon', 'relacion', 'pareja', 'afecto', 'vinculo'],
        transformacion: ['transform', 'cambio', 'renac', 'ciclo', 'evolu', 'crec'],
        sabiduria: ['sabid', 'conocim', 'guia', 'mentor', 'maestr', 'enseñ']
    };

    // Primero buscar en categorías de WooCommerce
    for (const cat of categorias) {
        for (const [key, keywords] of Object.entries(mapeo)) {
            if (keywords.some(kw => cat.includes(kw))) {
                return key;
            }
        }
    }

    // Luego buscar en nombre y descripción
    for (const [key, keywords] of Object.entries(mapeo)) {
        if (keywords.some(kw => texto.includes(kw))) {
            return key;
        }
    }

    return 'proteccion'; // default
}

/**
 * Extrae especialidades de la descripción
 */
function extraerEspecialidades(descripcion) {
    const texto = descripcion.toLowerCase();
    const especialidades = [];

    const mapeo = {
        'energia_negativa': ['energia negativa', 'malas energias', 'envidia', 'mal de ojo'],
        'ansiedad': ['ansiedad', 'nervios', 'estres', 'angustia', 'preocupa'],
        'autoestima': ['autoestima', 'amor propio', 'valor', 'confianza en'],
        'relaciones': ['relacion', 'pareja', 'familia', 'vinculos', 'lazos'],
        'dinero': ['dinero', 'trabajo', 'empleo', 'negocio', 'economia'],
        'salud': ['salud', 'enferm', 'cuerpo', 'dolor fisico'],
        'duelo': ['duelo', 'perdida', 'muerte', 'partir', 'despedida'],
        'soledad': ['soledad', 'sola', 'solo', 'aislamiento', 'compañia'],
        'creatividad': ['creativ', 'artis', 'inspiracion', 'musa'],
        'fertilidad': ['fertil', 'embarazo', 'maternidad', 'concepcion'],
        'hogar': ['hogar', 'casa', 'familia', 'espacio']
    };

    for (const [esp, keywords] of Object.entries(mapeo)) {
        if (keywords.some(kw => texto.includes(kw))) {
            especialidades.push(esp);
        }
    }

    return especialidades;
}

/**
 * Extrae keywords importantes de la historia
 */
function extraerKeywords(descripcion) {
    const texto = descripcion.toLowerCase();
    const keywords = [];

    // Palabras emocionales clave
    const emocionales = ['cansada', 'agotada', 'sola', 'perdida', 'confundida', 'triste',
                         'fuerte', 'valiente', 'guerrera', 'sensible', 'intuitiva'];

    for (const palabra of emocionales) {
        if (texto.includes(palabra)) {
            keywords.push(palabra);
        }
    }

    return keywords;
}

/**
 * Detecta qué dolores resuelve este guardián
 */
function detectarDoloresTarget(descripcion) {
    const texto = descripcion.toLowerCase();
    const dolores = [];

    const mapeo = {
        'carga_emocional': ['carga', 'peso', 'responsabilidad', 'demasiado'],
        'mala_suerte': ['suerte', 'mala racha', 'nada sale', 'siempre mal'],
        'vacio_existencial': ['vacio', 'falta algo', 'sin sentido', 'proposito'],
        'bloqueo': ['bloqu', 'estancad', 'frena', 'atascad', 'no avanzo'],
        'soledad': ['sola', 'solo', 'nadie', 'abandonad'],
        'relaciones': ['relacion', 'pareja', 'toxico', 'separacion'],
        'dinero': ['dinero', 'economia', 'deuda', 'trabajo']
    };

    for (const [dolor, keywords] of Object.entries(mapeo)) {
        if (keywords.some(kw => texto.includes(kw))) {
            dolores.push(dolor);
        }
    }

    return dolores;
}

/**
 * Limpia HTML de la descripción
 */
function limpiarDescripcion(html) {
    if (!html) return '';
    return html
        .replace(/<[^>]*>/g, '')
        .replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&')
        .replace(/\s+/g, ' ')
        .trim()
        .substring(0, 200);
}

function extractGuardianName(fullName) {
    // Extraer nombre del guardián del nombre del producto
    // Ej: "Finnegan - Guardián de la Abundancia" -> "Finnegan"
    // Ej: "Guardián Violeta" -> "Violeta"
    if (!fullName) return 'Guardián';

    // Si tiene guión, tomar la primera parte
    if (fullName.includes('-')) {
        return fullName.split('-')[0].trim();
    }

    // Si empieza con "Guardián", tomar lo que sigue
    if (fullName.toLowerCase().startsWith('guardián ') || fullName.toLowerCase().startsWith('guardian ')) {
        return fullName.split(' ').slice(1).join(' ').trim() || fullName.split(' ')[0];
    }

    // Sino, tomar la primera palabra
    const match = fullName.match(/^([A-Za-zÀ-ÿ]+)/);
    return match ? match[1] : fullName.split(' ')[0] || 'Guardián';
}

function getFallbackProducts() {
    // Productos de fallback con datos completos para matching
    return [
        {
            id: 1,
            nombre: 'Guardián de Protección',
            imagen: null,
            url: 'https://duendesdeluruguay.com/shop/',
            categoria: 'proteccion',
            especialidades: ['energia_negativa', 'ansiedad'],
            doloresTarget: ['carga_emocional'],
            color1: '#00d4ff',
            color2: '#0066aa'
        },
        {
            id: 2,
            nombre: 'Guardián de Abundancia',
            imagen: null,
            url: 'https://duendesdeluruguay.com/shop/',
            categoria: 'abundancia',
            especialidades: ['dinero', 'autoestima'],
            doloresTarget: ['mala_suerte', 'bloqueo'],
            color1: '#d4af37',
            color2: '#b8962e'
        },
        {
            id: 3,
            nombre: 'Guardián Sanador',
            imagen: null,
            url: 'https://duendesdeluruguay.com/shop/',
            categoria: 'sanacion',
            especialidades: ['duelo', 'autoestima'],
            doloresTarget: ['vacio_existencial'],
            color1: '#56ab91',
            color2: '#3d8b6e'
        },
        {
            id: 4,
            nombre: 'Guardián del Amor',
            imagen: null,
            url: 'https://duendesdeluruguay.com/shop/',
            categoria: 'amor',
            especialidades: ['relaciones', 'autoestima'],
            doloresTarget: ['soledad', 'relaciones'],
            color1: '#e75480',
            color2: '#c44569'
        },
        {
            id: 5,
            nombre: 'Guardián de Transformación',
            imagen: null,
            url: 'https://duendesdeluruguay.com/shop/',
            categoria: 'transformacion',
            especialidades: ['creatividad'],
            doloresTarget: ['bloqueo', 'vacio_existencial'],
            color1: '#9b59b6',
            color2: '#7d3c98'
        },
        {
            id: 6,
            nombre: 'Guardián de Sabiduría',
            imagen: null,
            url: 'https://duendesdeluruguay.com/shop/',
            categoria: 'sabiduria',
            especialidades: ['ansiedad'],
            doloresTarget: ['vacio_existencial', 'bloqueo'],
            color1: '#3498db',
            color2: '#2980b9'
        }
    ];
}
