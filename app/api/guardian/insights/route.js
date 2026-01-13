import { kv } from '@vercel/kv';

// GET: Obtener insights globales del Test del Guardián
// Protegido con API key simple (en producción usar auth más robusto)
export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const apiKey = searchParams.get('key');

        // Verificación simple de API key
        const validKey = process.env.INSIGHTS_API_KEY || 'duendes-insights-2024';
        if (apiKey !== validKey) {
            return Response.json({ success: false, error: 'API key inválida' }, { status: 401 });
        }

        // Obtener estadísticas globales
        const stats = await kv.get('guardian:global_stats') || {
            total_tests: 0,
            by_pain: {},
            by_body: {},
            by_style: {},
            by_intent: {},
            by_country: {},
            keywords: {},
            last_updated: null
        };

        // Calcular porcentajes y rankings
        const insights = {
            resumen: {
                total_tests: stats.total_tests,
                last_updated: stats.last_updated
            },

            // Dolor principal (Q2) - ordenado por frecuencia
            dolor_principal: Object.entries(stats.by_pain || {})
                .map(([key, count]) => ({
                    dolor: key,
                    count: count,
                    porcentaje: stats.total_tests > 0 ? Math.round((count / stats.total_tests) * 100) : 0,
                    etiqueta: getLabelForPain(key)
                }))
                .sort((a, b) => b.count - a.count),

            // Síntoma corporal (Q3)
            sintoma_corporal: Object.entries(stats.by_body || {})
                .map(([key, count]) => ({
                    zona: key,
                    count: count,
                    porcentaje: stats.total_tests > 0 ? Math.round((count / stats.total_tests) * 100) : 0,
                    etiqueta: getLabelForBody(key)
                }))
                .sort((a, b) => b.count - a.count),

            // Estilo de decisión (Q6)
            estilo_decision: Object.entries(stats.by_style || {})
                .map(([key, count]) => ({
                    estilo: key,
                    count: count,
                    porcentaje: stats.total_tests > 0 ? Math.round((count / stats.total_tests) * 100) : 0,
                    etiqueta: getLabelForStyle(key)
                }))
                .sort((a, b) => b.count - a.count),

            // Intención detectada
            intencion_detectada: Object.entries(stats.by_intent || {})
                .map(([key, count]) => ({
                    intent: key,
                    count: count,
                    porcentaje: stats.total_tests > 0 ? Math.round((count / stats.total_tests) * 100) : 0
                }))
                .sort((a, b) => b.count - a.count),

            // Países
            por_pais: Object.entries(stats.by_country || {})
                .map(([key, count]) => ({
                    pais: key,
                    count: count,
                    porcentaje: stats.total_tests > 0 ? Math.round((count / stats.total_tests) * 100) : 0
                }))
                .sort((a, b) => b.count - a.count),

            // Keywords frecuentes de texto libre
            keywords_frecuentes: Object.entries(stats.keywords || {})
                .map(([word, count]) => ({ palabra: word, count: count }))
                .sort((a, b) => b.count - a.count)
                .slice(0, 15),

            // Segmentos detectados
            segmentos: detectSegments(stats),

            // Recomendaciones para negocio
            recomendaciones: generateRecommendations(stats)
        };

        return Response.json({
            success: true,
            insights: insights
        });

    } catch (error) {
        console.error('Error en guardian/insights:', error);
        return Response.json({ success: false, error: error.message }, { status: 500 });
    }
}

// Etiquetas legibles para dolor
function getLabelForPain(key) {
    const labels = {
        'agotamiento': 'Agotada de ser la fuerte',
        'proteccion': 'Necesita protección',
        'soledad': 'Se siente sola',
        'patrones': 'Repite patrones',
        'amor': 'Quiere amor pero le cuesta confiar'
    };
    return labels[key] || key;
}

// Etiquetas legibles para cuerpo
function getLabelForBody(key) {
    const labels = {
        'pecho': 'Pecho apretado',
        'garganta': 'Nudo en la garganta',
        'cansancio': 'Cansancio que no se va',
        'cabeza': 'Ansiedad en la cabeza',
        'intuicion': 'Panza/intuición cargada'
    };
    return labels[key] || key;
}

// Etiquetas legibles para estilo
function getLabelForStyle(key) {
    const labels = {
        'rapida': 'Directa y rápida',
        'profunda': 'Profunda y transformadora',
        'suave': 'Suave y amorosa',
        'protectora': 'Firme y protectora',
        'señal': 'Como señal para volver a sí'
    };
    return labels[key] || key;
}

// Detectar segmentos
function detectSegments(stats) {
    const segments = [];
    const total = stats.total_tests || 1;

    // Segmento: Protección
    const proteccionCount = (stats.by_pain?.proteccion || 0) + (stats.by_intent?.proteccion || 0);
    if (proteccionCount > 0) {
        segments.push({
            nombre: 'Buscadoras de Protección',
            descripcion: 'Personas que sienten que cargan demasiado y necesitan sentirse seguras',
            porcentaje: Math.round((stats.by_intent?.proteccion || 0) / total * 100),
            productos_sugeridos: ['Guardianes de Protección', 'Duendes del Hogar']
        });
    }

    // Segmento: Amor sano
    const amorCount = (stats.by_pain?.amor || 0) + (stats.by_pain?.soledad || 0);
    if (amorCount > 0) {
        segments.push({
            nombre: 'En Búsqueda de Amor Sano',
            descripcion: 'Personas que quieren amor pero tienen heridas que les impiden confiar',
            porcentaje: Math.round(amorCount / total * 100),
            productos_sugeridos: ['Guardianes del Amor', 'Duendes de Sanación Emocional']
        });
    }

    // Segmento: Corte de patrón
    if (stats.by_pain?.patrones > 0) {
        segments.push({
            nombre: 'Rompedoras de Patrones',
            descripcion: 'Personas conscientes de que repiten ciclos y quieren cambiar',
            porcentaje: Math.round((stats.by_pain?.patrones || 0) / total * 100),
            productos_sugeridos: ['Guardianes de Transformación', 'Rituales de Corte']
        });
    }

    // Segmento: Agotamiento
    if (stats.by_pain?.agotamiento > 0) {
        segments.push({
            nombre: 'Cuidadoras Agotadas',
            descripcion: 'Personas que cuidan a todos y olvidaron cuidarse a sí mismas',
            porcentaje: Math.round((stats.by_pain?.agotamiento || 0) / total * 100),
            productos_sugeridos: ['Guardianes de Sanación', 'Rituales de Autocuidado']
        });
    }

    return segments;
}

// Generar recomendaciones para el negocio
function generateRecommendations(stats) {
    const recs = [];
    const total = stats.total_tests || 1;

    // Si hay mucha gente con agotamiento
    if ((stats.by_pain?.agotamiento || 0) / total > 0.25) {
        recs.push({
            tipo: 'contenido',
            prioridad: 'alta',
            sugerencia: 'Crear contenido específico para "la que siempre es la fuerte". Este segmento representa más del 25% de las visitantes.'
        });
    }

    // Si hay mucha gente buscando protección
    if ((stats.by_intent?.proteccion || 0) / total > 0.3) {
        recs.push({
            tipo: 'producto',
            prioridad: 'alta',
            sugerencia: 'Los Guardianes de Protección son los más demandados. Considerar crear más variedad en esta categoría.'
        });
    }

    // Si hay muchos keywords de "paz" o "tranquilidad"
    if ((stats.keywords?.paz || 0) + (stats.keywords?.tranquilidad || 0) > total * 0.2) {
        recs.push({
            tipo: 'email',
            prioridad: 'media',
            sugerencia: 'El 20%+ menciona paz/tranquilidad. Email sequence enfocado en "encontrar la calma" podría resonar bien.'
        });
    }

    // Si hay muchos de un país específico
    const topCountry = Object.entries(stats.by_country || {}).sort((a, b) => b[1] - a[1])[0];
    if (topCountry && topCountry[1] / total > 0.4) {
        recs.push({
            tipo: 'marketing',
            prioridad: 'media',
            sugerencia: `El ${Math.round(topCountry[1] / total * 100)}% viene de ${topCountry[0]}. Considerar campañas geo-específicas.`
        });
    }

    // Recomendación general basada en estilo de decisión
    const topStyle = Object.entries(stats.by_style || {}).sort((a, b) => b[1] - a[1])[0];
    if (topStyle) {
        const styleRecs = {
            'rapida': 'Muchas buscan alivio rápido. CTAs más directos y ofertas con urgencia podrían funcionar.',
            'profunda': 'Audiencia que valora profundidad. Contenido largo y rituales elaborados resuenan.',
            'suave': 'Prefieren approach gentil. Evitar lenguaje agresivo de venta.',
            'protectora': 'Buscan seguridad. Enfatizar garantías y testimonios de protección.',
            'señal': 'Audiencia espiritual. Contenido sobre señales y sincronicidades.'
        };
        if (styleRecs[topStyle[0]]) {
            recs.push({
                tipo: 'comunicacion',
                prioridad: 'media',
                sugerencia: styleRecs[topStyle[0]]
            });
        }
    }

    return recs;
}
