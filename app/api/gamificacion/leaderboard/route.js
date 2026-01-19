import { kv } from '@vercel/kv';
import { obtenerNivel } from '@/lib/gamificacion/config';

// ═══════════════════════════════════════════════════════════════
// API: LEADERBOARD DE RACHAS
// Top usuarios por racha y posición del usuario actual
// ═══════════════════════════════════════════════════════════════

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');
    const limite = parseInt(searchParams.get('limite')) || 10;

    // Obtener email del usuario actual (si hay token)
    let userEmail = null;
    if (token) {
      const tokenData = await kv.get(`token:${token}`);
      // El token puede ser un string (email) o un objeto {email, nombre, creado}
      userEmail = tokenData ? (typeof tokenData === 'string' ? tokenData : tokenData.email) : null;
    }

    // Obtener todas las claves de gamificación
    const keys = await kv.keys('gamificacion:*');

    // Recopilar datos de todos los usuarios
    const usuarios = [];

    for (const key of keys) {
      try {
        const gamificacion = await kv.get(key);
        if (gamificacion && gamificacion.racha > 0) {
          const email = key.replace('gamificacion:', '');

          // Obtener nombre del usuario
          const usuario = await kv.get(`elegido:${email}`);
          const nombre = usuario?.nombrePreferido || usuario?.nombre || 'Guardiana';

          // Obtener nivel
          const nivel = obtenerNivel(gamificacion.xp || 0);

          usuarios.push({
            email: email,
            nombre: nombre,
            racha: gamificacion.racha,
            rachaMax: gamificacion.rachaMax || gamificacion.racha,
            nivel: nivel.id,
            xp: gamificacion.xp || 0,
            esSelf: email === userEmail
          });
        }
      } catch (e) {
        console.error(`Error procesando ${key}:`, e);
      }
    }

    // Ordenar por racha actual (descendente)
    usuarios.sort((a, b) => b.racha - a.racha);

    // Encontrar posición del usuario actual
    let miPosicion = null;
    if (userEmail) {
      const index = usuarios.findIndex(u => u.email === userEmail);
      if (index !== -1) {
        miPosicion = index + 1;
      }
    }

    // Anonimizar emails para privacidad
    const topUsuarios = usuarios.slice(0, limite).map(u => ({
      nombre: u.esSelf ? u.nombre : (u.nombre.length > 2 ? u.nombre.slice(0, 2) + '***' : u.nombre + '***'),
      racha: u.racha,
      nivel: u.nivel,
      esSelf: u.esSelf
    }));

    return Response.json({
      success: true,
      top: topUsuarios,
      miPosicion,
      totalParticipantes: usuarios.length
    });

  } catch (error) {
    console.error('[LEADERBOARD] Error:', error);
    return Response.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
