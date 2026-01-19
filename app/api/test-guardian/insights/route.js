export const dynamic = 'force-dynamic';

import { kv } from '@vercel/kv';

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const apiKey = searchParams.get('key');

        // Verificar API key
        const validKey = process.env.INSIGHTS_API_KEY || 'duendes-insights-2024';
        if (apiKey !== validKey) {
            return Response.json({
                success: false,
                error: 'API key invalida'
            }, { status: 401 });
        }

        // Obtener estadisticas
        const stats = await kv.get('test_guardian:stats') || {
            total_tests: 0,
            by_pais: {},
            by_momento: {},
            by_cuerpo: {},
            by_patron: {},
            by_estilo: {},
            by_guardian: {},
            textos_dolor: [],
            textos_deseo: [],
            last_update: null
        };

        // Calcular insights adicionales
        const insights = {
            resumen: {
                total_tests: stats.total_tests,
                ultima_actualizacion: stats.last_update
            },
            distribucion: {
                por_pais: stats.by_pais,
                por_momento: stats.by_momento,
                por_sintoma_corporal: stats.by_cuerpo,
                por_patron: stats.by_patron,
                por_estilo_preferido: stats.by_estilo,
                por_guardian_recomendado: stats.by_guardian
            },
            segmentos: calcularSegmentos(stats),
            keywords_dolor: extraerKeywords(stats.textos_dolor || []),
            keywords_deseo: extraerKeywords(stats.textos_deseo || []),
            textos_recientes: {
                dolores: (stats.textos_dolor || []).slice(0, 10),
                deseos: (stats.textos_deseo || []).slice(0, 10)
            }
        };

        return Response.json({
            success: true,
            insights
        });

    } catch (error) {
        console.error('Insights error:', error);
        return Response.json({
            success: false,
            error: error.message
        }, { status: 500 });
    }
}

// Calcular segmentos de audiencia
function calcularSegmentos(stats) {
    const total = stats.total_tests || 1;
    const segmentos = {};

    // Segmento Sanadoras
    const sanando = (stats.by_momento?.sanando || 0) + (stats.by_patron?.relaciones || 0) + (stats.by_patron?.autoestima || 0);
    segmentos.sanadoras = {
        count: Math.round(sanando / 2),
        porcentaje: Math.round((sanando / 2) / total * 100)
    };

    // Segmento Buscadoras de Abundancia
    const abundancia = (stats.by_momento?.buscando || 0) + (stats.by_patron?.dinero || 0);
    segmentos.buscadoras_abundancia = {
        count: Math.round(abundancia / 2),
        porcentaje: Math.round((abundancia / 2) / total * 100)
    };

    // Segmento Necesitan Proteccion
    const proteccion = (stats.by_momento?.proteccion || 0) + (stats.by_cuerpo?.todo || 0);
    segmentos.necesitan_proteccion = {
        count: Math.round(proteccion / 2),
        porcentaje: Math.round((proteccion / 2) / total * 100)
    };

    // Segmento En Transicion
    segmentos.en_transicion = {
        count: stats.by_momento?.transicion || 0,
        porcentaje: Math.round((stats.by_momento?.transicion || 0) / total * 100)
    };

    return segmentos;
}

// Extraer keywords frecuentes de textos
function extraerKeywords(textos) {
    if (!textos || textos.length === 0) return {};

    const palabras = {};
    const stopwords = ['que', 'de', 'la', 'el', 'en', 'un', 'una', 'con', 'por', 'para', 'los', 'las', 'del', 'al', 'es', 'no', 'si', 'mi', 'me', 'yo', 'tu', 'muy', 'mas', 'pero', 'como', 'ya', 'todo', 'esta', 'eso', 'hay', 'ser', 'sin', 'sobre', 'entre', 'cuando', 'porque', 'donde', 'hasta', 'desde', 'cada', 'hacia', 'segun', 'durante'];

    textos.forEach(texto => {
        const words = texto.toLowerCase()
            .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // remover acentos
            .replace(/[^a-z\s]/g, '')
            .split(/\s+/)
            .filter(w => w.length > 3 && !stopwords.includes(w));

        words.forEach(word => {
            palabras[word] = (palabras[word] || 0) + 1;
        });
    });

    // Ordenar por frecuencia y tomar top 20
    return Object.entries(palabras)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 20)
        .reduce((acc, [word, count]) => {
            acc[word] = count;
            return acc;
        }, {});
}
