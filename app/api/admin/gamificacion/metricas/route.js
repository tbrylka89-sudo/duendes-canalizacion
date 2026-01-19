import { kv } from '@vercel/kv';

// ═══════════════════════════════════════════════════════════════════════════════
// API: MÉTRICAS DE GAMIFICACIÓN (Admin)
// Dashboard con estadísticas del sistema de gamificación
// ═══════════════════════════════════════════════════════════════════════════════

export const dynamic = 'force-dynamic';

// Definición de niveles (debe coincidir con el sistema principal)
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
    // Obtener todos los usuarios
    const usuariosKeys = await kv.keys('user:*');
    const usuarios = [];

    for (const key of usuariosKeys) {
      if (key.includes(':progreso') || key.includes(':badges')) continue;
      const usuario = await kv.get(key);
      if (usuario) {
        const email = key.replace('user:', '');
        const progreso = await kv.get(`user:${email}:progreso`) || {};
        usuarios.push({
          email,
          ...usuario,
          progreso
        });
      }
    }

    // Calcular métricas generales
    let totalRunas = 0;
    let totalXP = 0;
    let totalRachas = 0;
    let mejorRacha = 0;
    let totalReferidos = 0;
    let totalBadges = 0;
    const distribucionNiveles = {};
    const topRachas = [];

    // Inicializar distribución
    NIVELES.forEach(n => {
      distribucionNiveles[n.nombre] = 0;
    });

    for (const usuario of usuarios) {
      const runas = usuario.runas || 0;
      const xp = usuario.xp || 0;
      const racha = usuario.racha || 0;
      const referidos = usuario.referidos?.length || 0;

      totalRunas += runas;
      totalXP += xp;
      totalRachas += racha;
      totalReferidos += referidos;

      if (racha > mejorRacha) mejorRacha = racha;

      // Distribución por nivel
      const nivel = calcularNivel(xp);
      distribucionNiveles[nivel.nombre]++;

      // Badges
      const badges = await kv.get(`user:${usuario.email}:badges`) || [];
      totalBadges += badges.length;

      // Top rachas
      if (racha > 0) {
        topRachas.push({ email: usuario.email, racha });
      }
    }

    // Ordenar top rachas
    topRachas.sort((a, b) => b.racha - a.racha);

    // Calcular promedios
    const cantidadUsuarios = usuarios.length || 1;

    const metricas = {
      general: {
        totalUsuarios: usuarios.length,
        totalRunas,
        totalXP,
        totalBadges,
        totalReferidos,
        promedioRunas: Math.round(totalRunas / cantidadUsuarios),
        promedioXP: Math.round(totalXP / cantidadUsuarios),
        promedioRacha: Math.round(totalRachas / cantidadUsuarios * 10) / 10,
        mejorRacha
      },
      distribucionNiveles,
      topRachas: topRachas.slice(0, 10),
      usuariosActivos: usuarios.filter(u => {
        const ultimaActividad = u.ultimaActividad || u.fechaRegistro;
        if (!ultimaActividad) return false;
        const hace7dias = Date.now() - 7 * 24 * 60 * 60 * 1000;
        return new Date(ultimaActividad).getTime() > hace7dias;
      }).length,
      usuariosConRacha: usuarios.filter(u => (u.racha || 0) > 0).length,
      usuariosConBadges: usuarios.filter(u => u.badges?.length > 0).length
    };

    return Response.json({ success: true, metricas });

  } catch (error) {
    console.error('[GAMIFICACION-METRICAS] Error:', error);
    return Response.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
