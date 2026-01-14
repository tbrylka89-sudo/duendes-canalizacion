import { kv } from '@vercel/kv';

export async function POST(request) {
    try {
        const data = await request.json();
        const { identity, answers, contact } = data;

        // Validar datos minimos
        if (!identity?.nombre || !contact?.email) {
            return Response.json({
                success: false,
                error: 'Datos incompletos'
            }, { status: 400 });
        }

        // Crear ID unico basado en email
        const emailHash = Buffer.from(contact.email.toLowerCase().trim())
            .toString('base64')
            .replace(/[^a-zA-Z0-9]/g, '')
            .substring(0, 32);

        const visitorId = `tg:${emailHash}`;

        // Obtener datos previos si existen
        const existing = await kv.get(visitorId);
        const sessionCount = existing?.session_count || 0;

        // Crear registro del test
        const testRecord = {
            visitor_id: visitorId,
            identity: {
                nombre: identity.nombre,
                nacimiento: identity.nacimiento || null,
                sexo: identity.sexo || null,
                nacionalidad: identity.nacionalidad || null,
                pais: identity.pais || null,
                ciudad: identity.ciudad || null
            },
            contact: {
                email: contact.email.toLowerCase().trim(),
                prefijo: contact.prefijo || '+598',
                whatsapp: contact.whatsapp || null
            },
            answers: answers || {},
            // Campos calculados
            dolor_detectado: detectarDolor(answers),
            patron_detectado: answers?.patron || null,
            estilo_preferido: answers?.estilo || null,
            guardian_recomendado: calcularGuardian(answers),
            // Metadata
            session_count: sessionCount + 1,
            first_visit: existing?.first_visit || new Date().toISOString(),
            last_visit: new Date().toISOString(),
            source: 'wordpress_test',
            version: 'v8'
        };

        // Guardar en KV
        await kv.set(visitorId, testRecord, { ex: 60 * 60 * 24 * 365 }); // 1 año

        // Actualizar estadisticas globales
        await updateStats(testRecord);

        return Response.json({
            success: true,
            message: 'Datos guardados',
            visitor_id: visitorId,
            session_count: testRecord.session_count
        });

    } catch (error) {
        console.error('Test guardian save error:', error);
        return Response.json({
            success: false,
            error: 'Error guardando datos'
        }, { status: 500 });
    }
}

// Detectar dolor principal de las respuestas
function detectarDolor(answers) {
    const dolores = [];

    if (answers?.momento === 'sanando') dolores.push('heridas_pasadas');
    if (answers?.momento === 'proteccion') dolores.push('vulnerabilidad');
    if (answers?.momento === 'transicion') dolores.push('incertidumbre');
    if (answers?.momento === 'buscando') dolores.push('busqueda');

    if (answers?.cuerpo === 'pecho') dolores.push('carga_emocional');
    if (answers?.cuerpo === 'garganta') dolores.push('expresion_bloqueada');
    if (answers?.cuerpo === 'estomago') dolores.push('ansiedad');
    if (answers?.cuerpo === 'espalda') dolores.push('responsabilidad_excesiva');
    if (answers?.cuerpo === 'todo') dolores.push('agotamiento');

    if (answers?.patron === 'relaciones') dolores.push('patron_relacional');
    if (answers?.patron === 'dinero') dolores.push('bloqueo_abundancia');
    if (answers?.patron === 'autoestima') dolores.push('baja_autoestima');
    if (answers?.patron === 'familia') dolores.push('patron_familiar');

    return dolores;
}

// Calcular guardian recomendado
function calcularGuardian(answers) {
    const momento = answers?.momento;
    const patron = answers?.patron;

    if (momento === 'sanando' || patron === 'relaciones' || patron === 'autoestima') {
        return { tipo: 'sanacion', nombre: 'Guardian de la Sanacion' };
    }
    if (momento === 'buscando' || patron === 'dinero') {
        return { tipo: 'abundancia', nombre: 'Guardian de la Abundancia' };
    }
    if (momento === 'proteccion') {
        return { tipo: 'proteccion', nombre: 'Guardian de la Proteccion' };
    }
    return { tipo: 'proteccion', nombre: 'Guardian de la Proteccion' };
}

// Actualizar estadisticas globales
async function updateStats(record) {
    try {
        const statsKey = 'test_guardian:stats';
        let stats = await kv.get(statsKey) || {
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

        stats.total_tests++;

        // Por pais
        const pais = record.identity?.pais || 'desconocido';
        stats.by_pais[pais] = (stats.by_pais[pais] || 0) + 1;

        // Por respuestas
        const ans = record.answers;
        if (ans?.momento) stats.by_momento[ans.momento] = (stats.by_momento[ans.momento] || 0) + 1;
        if (ans?.cuerpo) stats.by_cuerpo[ans.cuerpo] = (stats.by_cuerpo[ans.cuerpo] || 0) + 1;
        if (ans?.patron) stats.by_patron[ans.patron] = (stats.by_patron[ans.patron] || 0) + 1;
        if (ans?.estilo) stats.by_estilo[ans.estilo] = (stats.by_estilo[ans.estilo] || 0) + 1;

        // Por guardian recomendado
        const guardian = record.guardian_recomendado?.tipo || 'proteccion';
        stats.by_guardian[guardian] = (stats.by_guardian[guardian] || 0) + 1;

        // Guardar textos libres (ultimos 100)
        if (ans?.dolor && ans.dolor.length > 10) {
            stats.textos_dolor.unshift(ans.dolor.substring(0, 200));
            if (stats.textos_dolor.length > 100) stats.textos_dolor.pop();
        }
        if (ans?.deseo && ans.deseo.length > 10) {
            stats.textos_deseo.unshift(ans.deseo.substring(0, 200));
            if (stats.textos_deseo.length > 100) stats.textos_deseo.pop();
        }

        stats.last_update = new Date().toISOString();

        await kv.set(statsKey, stats);
    } catch (e) {
        console.error('Stats update error:', e);
    }
}

// GET: Obtener perfil de visitante (para reconocimiento en futuras visitas)
export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const email = searchParams.get('email');

        if (!email) {
            return Response.json({
                success: false,
                error: 'Email requerido'
            }, { status: 400 });
        }

        const emailHash = Buffer.from(email.toLowerCase().trim())
            .toString('base64')
            .replace(/[^a-zA-Z0-9]/g, '')
            .substring(0, 32);

        const visitorId = `tg:${emailHash}`;
        const profile = await kv.get(visitorId);

        if (!profile) {
            return Response.json({
                success: false,
                found: false,
                message: 'Visitante nuevo'
            });
        }

        return Response.json({
            success: true,
            found: true,
            nombre: profile.identity?.nombre,
            session_count: profile.session_count,
            last_visit: profile.last_visit,
            guardian_anterior: profile.guardian_recomendado
        });

    } catch (error) {
        return Response.json({
            success: false,
            error: error.message
        }, { status: 500 });
    }
}
