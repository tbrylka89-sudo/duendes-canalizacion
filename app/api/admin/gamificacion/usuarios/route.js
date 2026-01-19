import { kv } from '@vercel/kv';

// ═══════════════════════════════════════════════════════════════════════════════
// API: USUARIOS DE GAMIFICACIÓN (Admin)
// Lista de usuarios con datos de gamificación
// ═══════════════════════════════════════════════════════════════════════════════

export const dynamic = 'force-dynamic';

// Definición de niveles
const NIVELES = [
  { nivel: 1, nombre: 'Buscador', xpRequerido: 0 },
  { nivel: 2, nombre: 'Iniciado', xpRequerido: 100 },
  { nivel: 3, nombre: 'Aprendiz', xpRequerido: 300 },
  { nivel: 4, nombre: 'Adepto', xpRequerido: 600 },
  { nivel: 5, nombre: 'Guardián', xpRequerido: 1000 },
  { nivel: 6, nombre: 'Sabio', xpRequerido: 1500 },
  { nivel: 7, nombre: 'Maestro', xpRequerido: 2100 },
  { nivel: 8, nombre: 'Archimago', xpRequerido: 2800 },
  { nivel: 9, nombre: 'Iluminado', xpRequerido: 3600 },
  { nivel: 10, nombre: 'Ascendido', xpRequerido: 4500 }
];

function calcularNivel(xp) {
  for (let i = NIVELES.length - 1; i >= 0; i--) {
    if (xp >= NIVELES[i].xpRequerido) {
      return NIVELES[i];
    }
  }
  return NIVELES[0];
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const busqueda = searchParams.get('busqueda') || '';

    // Obtener todos los usuarios
    const usuariosKeys = await kv.keys('user:*');
    const usuarios = [];

    for (const key of usuariosKeys) {
      // Ignorar keys de progreso y badges
      if (key.includes(':progreso') || key.includes(':badges') || key.includes(':historial')) continue;

      const usuario = await kv.get(key);
      if (usuario) {
        const email = key.replace('user:', '');

        // Filtrar por búsqueda si hay
        if (busqueda && !email.toLowerCase().includes(busqueda.toLowerCase())) {
          continue;
        }

        const badges = await kv.get(`user:${email}:badges`) || [];
        const nivel = calcularNivel(usuario.xp || 0);

        usuarios.push({
          email,
          runas: usuario.runas || 0,
          xp: usuario.xp || 0,
          racha: usuario.racha || 0,
          nivel: nivel.nombre,
          nivelNum: nivel.nivel,
          badges: badges,
          badgesCount: badges.length,
          referidos: usuario.referidos || [],
          referidosCount: usuario.referidos?.length || 0,
          codigoReferido: usuario.codigoReferido,
          fechaRegistro: usuario.fechaRegistro,
          ultimaActividad: usuario.ultimaActividad,
          esCirculo: usuario.esCirculo || false
        });
      }
    }

    // Ordenar por XP descendente
    usuarios.sort((a, b) => b.xp - a.xp);

    return Response.json({
      success: true,
      usuarios,
      total: usuarios.length
    });

  } catch (error) {
    console.error('[GAMIFICACION-USUARIOS] Error:', error);
    return Response.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
