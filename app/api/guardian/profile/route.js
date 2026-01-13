import { kv } from '@vercel/kv';

// GET: Recuperar perfil de visitante
export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const visitorId = searchParams.get('visitor_id');
        const email = searchParams.get('email');

        if (!visitorId && !email) {
            return Response.json({ success: false, error: 'Se requiere visitor_id o email' }, { status: 400 });
        }

        let profile = null;

        // Buscar por email primero (más confiable)
        if (email) {
            const emailHash = Buffer.from(email.toLowerCase()).toString('base64').replace(/[^a-zA-Z0-9]/g, '');
            profile = await kv.get(`guardian:email:${emailHash}`);
        }

        // Si no se encontró, buscar por visitor_id
        if (!profile && visitorId) {
            profile = await kv.get(`guardian:visitor:${visitorId}`);
        }

        if (!profile) {
            return Response.json({ success: false, found: false });
        }

        return Response.json({
            success: true,
            found: true,
            profile: profile
        });

    } catch (error) {
        console.error('Error en guardian/profile GET:', error);
        return Response.json({ success: false, error: error.message }, { status: 500 });
    }
}

// POST: Guardar/actualizar perfil de visitante
export async function POST(request) {
    try {
        const data = await request.json();
        const { visitor_id, identity, answers, interpretation, timestamp } = data;

        if (!visitor_id) {
            return Response.json({ success: false, error: 'Se requiere visitor_id' }, { status: 400 });
        }

        // Construir perfil
        const profile = {
            visitor_id,
            name: identity?.name || '',
            birthdate: identity?.birth || '',
            country: identity?.country || '',
            email: identity?.email || '',
            whatsapp: identity?.whatsapp || '',
            answers: {
                for_whom: answers?.q1_for_whom?.id || '',
                pain: answers?.q2_pain?.pain || '',
                body: answers?.q3_body?.body || '',
                soul_text: answers?.q4_soul?.text || '',
                universe_text: answers?.q5_universe?.text || '',
                magic_style: answers?.q6_magic_style?.style || ''
            },
            detected_profile: {
                pain: answers?.q2_pain?.pain || '',
                desire: extractDesire(answers?.q5_universe?.text || ''),
                decision_style: answers?.q6_magic_style?.style || '',
                intent: interpretation?.intent || 'proteccion'
            },
            interpretation: {
                summary: interpretation?.summary_emotional || '',
                sealed_phrase: interpretation?.sealed_phrase || '',
                intent: interpretation?.intent || ''
            },
            session_count: 1,
            first_visit: timestamp || new Date().toISOString(),
            last_visit: timestamp || new Date().toISOString(),
            updated_at: new Date().toISOString()
        };

        // Verificar si ya existe (para incrementar session_count)
        let existingProfile = await kv.get(`guardian:visitor:${visitor_id}`);
        if (existingProfile) {
            profile.session_count = (existingProfile.session_count || 0) + 1;
            profile.first_visit = existingProfile.first_visit || profile.first_visit;
        }

        // Guardar por visitor_id
        await kv.set(`guardian:visitor:${visitor_id}`, profile);

        // Si hay email, también indexar por email
        if (identity?.email) {
            const emailHash = Buffer.from(identity.email.toLowerCase()).toString('base64').replace(/[^a-zA-Z0-9]/g, '');
            await kv.set(`guardian:email:${emailHash}`, profile);

            // Actualizar perfil de usuario existente si lo hay
            const userKey = `user:${identity.email}`;
            const existingUser = await kv.get(userKey);
            if (existingUser) {
                existingUser.testGuardian = profile;
                await kv.set(userKey, existingUser);
            }
        }

        // Actualizar estadísticas globales para insights
        await updateGlobalStats(profile);

        return Response.json({
            success: true,
            profile_id: visitor_id,
            session_count: profile.session_count
        });

    } catch (error) {
        console.error('Error en guardian/profile POST:', error);
        return Response.json({ success: false, error: error.message }, { status: 500 });
    }
}

// Extraer palabras clave del deseo
function extractDesire(text) {
    if (!text) return '';
    const keywords = ['paz', 'amor', 'tranquilidad', 'fuerza', 'claridad', 'protección', 'abundancia', 'sanación', 'confianza', 'libertad'];
    const lower = text.toLowerCase();
    const found = keywords.filter(k => lower.includes(k));
    return found.length > 0 ? found[0] : text.split(' ').slice(0, 3).join(' ');
}

// Actualizar estadísticas globales
async function updateGlobalStats(profile) {
    try {
        const statsKey = 'guardian:global_stats';
        let stats = await kv.get(statsKey) || {
            total_tests: 0,
            by_pain: {},
            by_body: {},
            by_style: {},
            by_intent: {},
            by_country: {},
            keywords: {},
            last_updated: null
        };

        // Incrementar contadores
        stats.total_tests++;

        // Por dolor
        if (profile.answers?.pain) {
            stats.by_pain[profile.answers.pain] = (stats.by_pain[profile.answers.pain] || 0) + 1;
        }

        // Por cuerpo
        if (profile.answers?.body) {
            stats.by_body[profile.answers.body] = (stats.by_body[profile.answers.body] || 0) + 1;
        }

        // Por estilo
        if (profile.answers?.magic_style) {
            stats.by_style[profile.answers.magic_style] = (stats.by_style[profile.answers.magic_style] || 0) + 1;
        }

        // Por intención
        if (profile.detected_profile?.intent) {
            stats.by_intent[profile.detected_profile.intent] = (stats.by_intent[profile.detected_profile.intent] || 0) + 1;
        }

        // Por país
        if (profile.country) {
            stats.by_country[profile.country] = (stats.by_country[profile.country] || 0) + 1;
        }

        // Extraer keywords de texto libre
        const soulText = profile.answers?.soul_text || '';
        const universeText = profile.answers?.universe_text || '';
        const allText = (soulText + ' ' + universeText).toLowerCase();
        const importantWords = ['paz', 'amor', 'tranquilidad', 'fuerza', 'claridad', 'protección', 'dinero', 'trabajo', 'familia', 'salud', 'soledad', 'miedo', 'ansiedad', 'cansancio', 'esperanza', 'fe', 'confianza'];

        importantWords.forEach(word => {
            if (allText.includes(word)) {
                stats.keywords[word] = (stats.keywords[word] || 0) + 1;
            }
        });

        stats.last_updated = new Date().toISOString();

        await kv.set(statsKey, stats);
    } catch (e) {
        console.error('Error updating global stats:', e);
    }
}
