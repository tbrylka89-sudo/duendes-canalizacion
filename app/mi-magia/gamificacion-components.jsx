'use client';
import { useState, useEffect } from 'react';

const API_BASE = '';

// ═══════════════════════════════════════════════════════════════
// DASHBOARD DE GAMIFICACIÓN
// Panel principal con nivel, XP, progreso y racha
// ═══════════════════════════════════════════════════════════════

const NIVELES_INFO = {
  iniciada: { nombre: 'Iniciada', icono: '🌱', color: '#8B9A46', siguiente: 'aprendiz' },
  aprendiz: { nombre: 'Aprendiz', icono: '🌿', color: '#5D8A4A', siguiente: 'guardiana' },
  guardiana: { nombre: 'Guardiana', icono: '🌳', color: '#4A7C59', siguiente: 'maestra' },
  maestra: { nombre: 'Maestra', icono: '✨', color: '#D4AF37', siguiente: 'sabia' },
  sabia: { nombre: 'Sabia', icono: '👑', color: '#9B59B6', siguiente: null }
};

export function DashboardGamificacion({ usuario, token, onActualizar }) {
  const [gamificacion, setGamificacion] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [animandoXP, setAnimandoXP] = useState(false);

  useEffect(() => {
    cargarGamificacion();
  }, [token]);

  const cargarGamificacion = async () => {
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE}/api/gamificacion/usuario?token=${token}`);
      const data = await res.json();
      if (data.success) {
        setGamificacion(data.gamificacion);
      }
    } catch (e) {
      console.error('Error cargando gamificación:', e);
    }
    setCargando(false);
  };

  if (cargando) {
    return (
      <div className="dashboard-gamificacion cargando">
        <div className="dash-spinner"></div>
      </div>
    );
  }

  if (!gamificacion) return null;

  const nivel = gamificacion.nivel || { id: 'iniciada', nombre: 'Iniciada' };
  const nivelInfo = NIVELES_INFO[nivel.id] || NIVELES_INFO.iniciada;
  const siguienteNivel = gamificacion.siguienteNivel;
  const progreso = gamificacion.progresoNivel || 0;
  const xp = gamificacion.xp || 0;
  const racha = gamificacion.racha || 0;
  const rachaMax = gamificacion.rachaMax || 0;
  const badges = gamificacion.badges || [];
  const lecturas = gamificacion.lecturasCompletadas?.length || 0;

  return (
    <div className="dashboard-gamificacion">
      {/* Nivel y XP */}
      <div className="dash-nivel-card">
        <div className="dash-nivel-header">
          <div className="dash-nivel-icono" style={{ background: nivelInfo.color }}>
            {nivelInfo.icono}
          </div>
          <div className="dash-nivel-info">
            <span className="dash-nivel-label">Tu Nivel</span>
            <h3 className="dash-nivel-nombre">{nivelInfo.nombre}</h3>
          </div>
          <div className="dash-xp-badge">
            <span className="xp-valor">{xp}</span>
            <span className="xp-label">XP</span>
          </div>
        </div>

        {siguienteNivel && (
          <div className="dash-progreso-container">
            <div className="dash-progreso-bar">
              <div
                className="dash-progreso-fill"
                style={{
                  width: `${progreso}%`,
                  background: `linear-gradient(90deg, ${nivelInfo.color}, ${NIVELES_INFO[nivelInfo.siguiente]?.color || nivelInfo.color})`
                }}
              >
                <div className="dash-progreso-glow"></div>
              </div>
            </div>
            <div className="dash-progreso-labels">
              <span>{nivel.nombre}</span>
              <span className="dash-xp-restante">{gamificacion.xpParaSiguiente} XP para {siguienteNivel.nombre}</span>
              <span>{siguienteNivel.nombre}</span>
            </div>
          </div>
        )}

        {!siguienteNivel && (
          <div className="dash-nivel-max">
            <span className="nivel-max-badge">👑 Nivel Máximo Alcanzado</span>
            <p>Sos una Sabia del Bosque</p>
          </div>
        )}
      </div>

      {/* Stats rápidos */}
      <div className="dash-stats-grid">
        <div className="dash-stat racha">
          <div className="stat-icono">🔥</div>
          <div className="stat-info">
            <span className="stat-valor">{racha}</span>
            <span className="stat-label">Racha actual</span>
          </div>
          {racha > 0 && rachaMax > racha && (
            <span className="stat-extra">Máx: {rachaMax}</span>
          )}
        </div>

        <div className="dash-stat lecturas">
          <div className="stat-icono">📖</div>
          <div className="stat-info">
            <span className="stat-valor">{lecturas}</span>
            <span className="stat-label">Lecturas</span>
          </div>
        </div>

        <div className="dash-stat badges">
          <div className="stat-icono">🏆</div>
          <div className="stat-info">
            <span className="stat-valor">{badges.length}</span>
            <span className="stat-label">Badges</span>
          </div>
        </div>

        <div className="dash-stat runas">
          <div className="stat-icono">ᚱ</div>
          <div className="stat-info">
            <span className="stat-valor">{usuario?.runas || 0}</span>
            <span className="stat-label">Runas</span>
          </div>
        </div>
      </div>

      {/* Próximos hitos de racha */}
      {racha > 0 && (
        <div className="dash-racha-hitos">
          <h4>Próximos Bonus de Racha</h4>
          <div className="hitos-lista">
            {[7, 14, 30, 60, 100].map(hito => {
              const alcanzado = racha >= hito;
              const proximo = !alcanzado && racha < hito;
              const diasFaltan = hito - racha;
              return (
                <div key={hito} className={`hito ${alcanzado ? 'alcanzado' : ''} ${proximo && diasFaltan <= 3 ? 'cercano' : ''}`}>
                  <span className="hito-dias">{hito}🔥</span>
                  {alcanzado ? (
                    <span className="hito-check">✓</span>
                  ) : (
                    <span className="hito-faltan">{diasFaltan}d</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      <style jsx>{`
        .dashboard-gamificacion {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .dashboard-gamificacion.cargando {
          min-height: 200px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .dash-spinner {
          width: 40px;
          height: 40px;
          border: 3px solid rgba(212, 175, 55, 0.2);
          border-top-color: #d4af37;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .dash-nivel-card {
          background: linear-gradient(145deg, #1a1a2e 0%, #16213e 100%);
          border: 1px solid rgba(212, 175, 55, 0.2);
          border-radius: 20px;
          padding: 24px;
          position: relative;
          overflow: hidden;
        }

        .dash-nivel-card::before {
          content: '';
          position: absolute;
          top: 0;
          right: 0;
          width: 150px;
          height: 150px;
          background: radial-gradient(circle, rgba(212, 175, 55, 0.1) 0%, transparent 70%);
          pointer-events: none;
        }

        .dash-nivel-header {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 20px;
        }

        .dash-nivel-icono {
          width: 60px;
          height: 60px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 28px;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
        }

        .dash-nivel-info {
          flex: 1;
        }

        .dash-nivel-label {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.5);
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .dash-nivel-nombre {
          margin: 4px 0 0;
          font-size: 24px;
          color: #fff;
          font-family: 'Cinzel', serif;
        }

        .dash-xp-badge {
          background: rgba(212, 175, 55, 0.15);
          border: 1px solid rgba(212, 175, 55, 0.3);
          border-radius: 12px;
          padding: 12px 16px;
          text-align: center;
        }

        .xp-valor {
          display: block;
          font-size: 24px;
          font-weight: 700;
          color: #d4af37;
        }

        .xp-label {
          font-size: 11px;
          color: rgba(255, 255, 255, 0.5);
          text-transform: uppercase;
        }

        .dash-progreso-container {
          margin-top: 8px;
        }

        .dash-progreso-bar {
          height: 12px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 6px;
          overflow: hidden;
          position: relative;
        }

        .dash-progreso-fill {
          height: 100%;
          border-radius: 6px;
          position: relative;
          transition: width 0.5s ease;
        }

        .dash-progreso-glow {
          position: absolute;
          top: 0;
          right: 0;
          width: 20px;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4));
          animation: shimmer 2s infinite;
        }

        @keyframes shimmer {
          0%, 100% { opacity: 0; }
          50% { opacity: 1; }
        }

        .dash-progreso-labels {
          display: flex;
          justify-content: space-between;
          margin-top: 8px;
          font-size: 12px;
          color: rgba(255, 255, 255, 0.5);
        }

        .dash-xp-restante {
          color: #d4af37;
          font-weight: 500;
        }

        .dash-nivel-max {
          text-align: center;
          padding: 16px;
          background: rgba(155, 89, 182, 0.1);
          border-radius: 12px;
          margin-top: 8px;
        }

        .nivel-max-badge {
          display: inline-block;
          background: linear-gradient(135deg, #9b59b6, #8e44ad);
          color: #fff;
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 14px;
          font-weight: 600;
        }

        .dash-nivel-max p {
          margin: 12px 0 0;
          color: rgba(255, 255, 255, 0.6);
          font-size: 14px;
        }

        .dash-stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
        }

        @media (max-width: 600px) {
          .dash-stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        .dash-stat {
          background: linear-gradient(145deg, #1a1a2e 0%, #16213e 100%);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          padding: 16px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          position: relative;
        }

        .dash-stat.racha {
          border-color: rgba(255, 87, 34, 0.3);
        }

        .stat-icono {
          font-size: 24px;
        }

        .stat-info {
          text-align: center;
        }

        .stat-valor {
          display: block;
          font-size: 24px;
          font-weight: 700;
          color: #fff;
        }

        .stat-label {
          font-size: 11px;
          color: rgba(255, 255, 255, 0.5);
          text-transform: uppercase;
        }

        .stat-extra {
          position: absolute;
          top: 8px;
          right: 8px;
          font-size: 10px;
          color: rgba(255, 255, 255, 0.4);
        }

        .dash-racha-hitos {
          background: linear-gradient(145deg, #1a1a2e 0%, #16213e 100%);
          border: 1px solid rgba(255, 87, 34, 0.2);
          border-radius: 16px;
          padding: 20px;
        }

        .dash-racha-hitos h4 {
          margin: 0 0 16px;
          font-size: 14px;
          color: rgba(255, 255, 255, 0.7);
          text-align: center;
        }

        .hitos-lista {
          display: flex;
          justify-content: space-around;
          gap: 8px;
        }

        .hito {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          padding: 12px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 12px;
          min-width: 50px;
        }

        .hito.alcanzado {
          background: rgba(46, 204, 113, 0.15);
          border: 1px solid rgba(46, 204, 113, 0.3);
        }

        .hito.cercano {
          background: rgba(255, 193, 7, 0.15);
          border: 1px solid rgba(255, 193, 7, 0.3);
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }

        .hito-dias {
          font-size: 14px;
        }

        .hito-check {
          color: #2ecc71;
          font-weight: bold;
        }

        .hito-faltan {
          font-size: 11px;
          color: rgba(255, 255, 255, 0.5);
        }
      `}</style>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// COLECCIÓN DE BADGES
// Muestra badges ganados y disponibles
// ═══════════════════════════════════════════════════════════════

const TODOS_BADGES = [
  { id: 'hija_luna', nombre: 'Hija de la Luna', icono: '🌙', descripcion: 'Completar 5 lecturas de Luna', condicion: 'lecturasLuna >= 5' },
  { id: 'guardiana_fuego', nombre: 'Guardiana del Fuego', icono: '🔥', descripcion: 'Completar todas las lecturas elementales', condicion: 'elementalesCompletos' },
  { id: 'erudita', nombre: 'Erudita', icono: '📚', descripcion: 'Completar 25 lecturas', condicion: 'lecturas >= 25' },
  { id: 'conectada', nombre: 'Conectada', icono: '💫', descripcion: '30 días de racha', condicion: 'rachaMax >= 30' },
  { id: 'sabia_bosque', nombre: 'Sabia del Bosque', icono: '👑', descripcion: 'Alcanzar nivel Sabia', condicion: 'nivel == sabia' },
  { id: 'generosa', nombre: 'Generosa', icono: '🎁', descripcion: 'Referir 5 amigas', condicion: 'referidos >= 5' },
  { id: 'coleccionista', nombre: 'Coleccionista', icono: '🏆', descripcion: 'Tener 3+ guardianes físicos', condicion: 'guardianes >= 3' },
  { id: 'primera_guardiana', nombre: 'Primera Guardiana', icono: '⭐', descripcion: 'Ser de las primeras 100', condicion: 'numeroPrimera <= 100' },
  { id: 'exploradora', nombre: 'Exploradora', icono: '🌈', descripcion: 'Probar 10 tipos de lecturas', condicion: 'tiposLectura >= 10' },
  { id: 'racha_100', nombre: 'Leyenda del Bosque', icono: '🌟', descripcion: '100 días de racha', condicion: 'rachaMax >= 100' }
];

export function ColeccionBadges({ token, compacto = false }) {
  const [badgesGanados, setBadgesGanados] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [badgeSeleccionado, setBadgeSeleccionado] = useState(null);

  useEffect(() => {
    cargarBadges();
  }, [token]);

  const cargarBadges = async () => {
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE}/api/gamificacion/usuario?token=${token}`);
      const data = await res.json();
      if (data.success && data.gamificacion) {
        setBadgesGanados(data.gamificacion.badges || []);
      }
    } catch (e) {
      console.error('Error cargando badges:', e);
    }
    setCargando(false);
  };

  if (cargando) {
    return <div className="badges-cargando"><div className="badge-spinner"></div></div>;
  }

  const badgesConEstado = TODOS_BADGES.map(badge => ({
    ...badge,
    ganado: badgesGanados.includes(badge.id)
  }));

  const badgesGanadosList = badgesConEstado.filter(b => b.ganado);
  const badgesPendientes = badgesConEstado.filter(b => !b.ganado);

  if (compacto) {
    return (
      <div className="badges-compacto">
        <div className="badges-mini-grid">
          {badgesGanadosList.slice(0, 5).map(badge => (
            <div key={badge.id} className="badge-mini" title={badge.nombre}>
              {badge.icono}
            </div>
          ))}
          {badgesGanadosList.length > 5 && (
            <div className="badge-mini mas">+{badgesGanadosList.length - 5}</div>
          )}
          {badgesGanadosList.length === 0 && (
            <span className="sin-badges">Sin badges aún</span>
          )}
        </div>
        <style jsx>{`
          .badges-compacto {
            display: flex;
            align-items: center;
          }
          .badges-mini-grid {
            display: flex;
            gap: 6px;
          }
          .badge-mini {
            width: 32px;
            height: 32px;
            background: rgba(212, 175, 55, 0.15);
            border: 1px solid rgba(212, 175, 55, 0.3);
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 16px;
          }
          .badge-mini.mas {
            font-size: 11px;
            color: #d4af37;
          }
          .sin-badges {
            font-size: 12px;
            color: rgba(255, 255, 255, 0.4);
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="coleccion-badges">
      {/* Modal de badge */}
      {badgeSeleccionado && (
        <div className="badge-modal-overlay" onClick={() => setBadgeSeleccionado(null)}>
          <div className="badge-modal" onClick={e => e.stopPropagation()}>
            <div className={`badge-modal-icono ${badgeSeleccionado.ganado ? 'ganado' : 'bloqueado'}`}>
              {badgeSeleccionado.icono}
            </div>
            <h3>{badgeSeleccionado.nombre}</h3>
            <p className="badge-modal-desc">{badgeSeleccionado.descripcion}</p>
            {badgeSeleccionado.ganado ? (
              <div className="badge-modal-ganado">
                <span>✓ Badge Desbloqueado</span>
              </div>
            ) : (
              <div className="badge-modal-bloqueado">
                <span>🔒 Aún no desbloqueado</span>
              </div>
            )}
            <button className="badge-modal-cerrar" onClick={() => setBadgeSeleccionado(null)}>
              Cerrar
            </button>
          </div>
        </div>
      )}

      {/* Badges ganados */}
      {badgesGanadosList.length > 0 && (
        <div className="badges-seccion">
          <h4>Tus Badges ({badgesGanadosList.length})</h4>
          <div className="badges-grid">
            {badgesGanadosList.map(badge => (
              <div
                key={badge.id}
                className="badge-card ganado"
                onClick={() => setBadgeSeleccionado(badge)}
              >
                <div className="badge-icono">{badge.icono}</div>
                <span className="badge-nombre">{badge.nombre}</span>
                <div className="badge-brillo"></div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Badges por desbloquear */}
      <div className="badges-seccion">
        <h4>Por Desbloquear ({badgesPendientes.length})</h4>
        <div className="badges-grid bloqueados">
          {badgesPendientes.map(badge => (
            <div
              key={badge.id}
              className="badge-card bloqueado"
              onClick={() => setBadgeSeleccionado(badge)}
            >
              <div className="badge-icono">{badge.icono}</div>
              <span className="badge-nombre">{badge.nombre}</span>
              <div className="badge-lock">🔒</div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .coleccion-badges {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .badges-cargando {
          display: flex;
          justify-content: center;
          padding: 40px;
        }

        .badge-spinner {
          width: 30px;
          height: 30px;
          border: 2px solid rgba(212, 175, 55, 0.2);
          border-top-color: #d4af37;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .badges-seccion h4 {
          margin: 0 0 16px;
          font-size: 14px;
          color: rgba(255, 255, 255, 0.7);
          font-weight: 500;
        }

        .badges-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
          gap: 12px;
        }

        .badge-card {
          background: linear-gradient(145deg, #1a1a2e 0%, #16213e 100%);
          border: 1px solid rgba(212, 175, 55, 0.2);
          border-radius: 16px;
          padding: 16px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          transition: all 0.3s;
          position: relative;
          overflow: hidden;
        }

        .badge-card.ganado {
          border-color: rgba(212, 175, 55, 0.4);
        }

        .badge-card.ganado:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 25px rgba(212, 175, 55, 0.2);
        }

        .badge-card.bloqueado {
          border-color: rgba(255, 255, 255, 0.1);
          opacity: 0.6;
        }

        .badge-card.bloqueado:hover {
          opacity: 0.8;
        }

        .badge-icono {
          font-size: 32px;
        }

        .badge-nombre {
          font-size: 11px;
          color: rgba(255, 255, 255, 0.7);
          text-align: center;
        }

        .badge-brillo {
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: linear-gradient(45deg, transparent, rgba(212, 175, 55, 0.1), transparent);
          animation: brillo 3s infinite;
          pointer-events: none;
        }

        @keyframes brillo {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .badge-lock {
          position: absolute;
          top: 8px;
          right: 8px;
          font-size: 12px;
          opacity: 0.5;
        }

        /* Modal */
        .badge-modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
        }

        .badge-modal {
          background: linear-gradient(145deg, #1a1a2e 0%, #16213e 100%);
          border: 1px solid rgba(212, 175, 55, 0.3);
          border-radius: 24px;
          padding: 32px;
          text-align: center;
          max-width: 320px;
          width: 100%;
        }

        .badge-modal-icono {
          font-size: 64px;
          margin-bottom: 16px;
        }

        .badge-modal-icono.ganado {
          animation: float 3s ease-in-out infinite;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        .badge-modal-icono.bloqueado {
          filter: grayscale(1);
          opacity: 0.5;
        }

        .badge-modal h3 {
          margin: 0 0 8px;
          color: #fff;
          font-size: 20px;
        }

        .badge-modal-desc {
          color: rgba(255, 255, 255, 0.6);
          font-size: 14px;
          margin: 0 0 20px;
        }

        .badge-modal-ganado {
          background: rgba(46, 204, 113, 0.15);
          border: 1px solid rgba(46, 204, 113, 0.3);
          color: #2ecc71;
          padding: 10px 20px;
          border-radius: 20px;
          font-size: 14px;
          margin-bottom: 20px;
        }

        .badge-modal-bloqueado {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: rgba(255, 255, 255, 0.5);
          padding: 10px 20px;
          border-radius: 20px;
          font-size: 14px;
          margin-bottom: 20px;
        }

        .badge-modal-cerrar {
          background: #d4af37;
          color: #000;
          border: none;
          padding: 12px 32px;
          border-radius: 25px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
        }

        .badge-modal-cerrar:hover {
          transform: scale(1.05);
        }
      `}</style>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// PANEL DE MISIONES
// Tracking de misiones con progreso
// ═══════════════════════════════════════════════════════════════

const MISIONES_CONFIG = {
  bienvenida: [
    { id: 'primera_lectura', nombre: 'Completá tu primera lectura', recompensa: { runas: 20, xp: 25 }, icono: '📖' },
    { id: 'visitar_circulo', nombre: 'Visitá el Círculo', recompensa: { runas: 10, xp: 10 }, icono: '★' },
    { id: 'completar_perfil', nombre: 'Completá tu perfil', recompensa: { runas: 15, xp: 15 }, icono: '👤' },
    { id: 'primera_compra', nombre: 'Hacé tu primera compra de runas', recompensa: { runas: 25, xp: 30 }, icono: 'ᚱ' },
    { id: 'invitar_amiga', nombre: 'Invitá tu primera amiga', recompensa: { runas: 75, xp: 50 }, icono: '💌' }
  ],
  semanales: [
    { id: 'sem_3_lecturas', nombre: 'Hacé 3 lecturas esta semana', recompensa: { runas: 30, xp: 35 }, icono: '📚', meta: 3 },
    { id: 'sem_5_dias', nombre: 'Entrá 5 días seguidos', recompensa: { runas: 20, xp: 25 }, icono: '🔥', meta: 5 },
    { id: 'sem_lectura_nueva', nombre: 'Probá una lectura nueva', recompensa: { runas: 15, xp: 20 }, icono: '✨' },
    { id: 'sem_compartir', nombre: 'Compartí una lectura', recompensa: { runas: 25, xp: 30 }, icono: '📤' }
  ],
  mensuales: [
    { id: 'men_10_lecturas', nombre: 'Completá 10 lecturas', recompensa: { runas: 100, xp: 100 }, icono: '🎯', meta: 10 },
    { id: 'men_racha_30', nombre: 'Mantené racha de 30 días', recompensa: { runas: 75, xp: 200, badge: 'conectada' }, icono: '🔥', meta: 30 },
    { id: 'men_subir_nivel', nombre: 'Subí de nivel', recompensa: { runas: 50, xp: 50 }, icono: '⬆️' },
    { id: 'men_3_referidas', nombre: 'Referí a 3 amigas', recompensa: { runas: 150, xp: 150 }, icono: '👯', meta: 3 }
  ]
};

export function MisionesPanel({ token }) {
  const [misionesCompletadas, setMisionesCompletadas] = useState([]);
  const [progreso, setProgreso] = useState({});
  const [cargando, setCargando] = useState(true);
  const [tabActiva, setTabActiva] = useState('bienvenida');

  useEffect(() => {
    cargarMisiones();
  }, [token]);

  const cargarMisiones = async () => {
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE}/api/gamificacion/usuario?token=${token}`);
      const data = await res.json();
      if (data.success && data.gamificacion) {
        setMisionesCompletadas(data.gamificacion.misionesCompletadas || []);
        // Calcular progreso basado en datos
        setProgreso({
          lecturas: data.gamificacion.lecturasCompletadas?.length || 0,
          racha: data.gamificacion.racha || 0,
          referidos: data.gamificacion.referidos?.length || 0,
          tiposLectura: data.gamificacion.tiposLecturaUsados?.length || 0
        });
      }
    } catch (e) {
      console.error('Error cargando misiones:', e);
    }
    setCargando(false);
  };

  if (cargando) {
    return <div className="misiones-cargando"><div className="mision-spinner"></div></div>;
  }

  const misiones = MISIONES_CONFIG[tabActiva] || [];

  return (
    <div className="misiones-panel">
      {/* Tabs */}
      <div className="misiones-tabs">
        {[
          { id: 'bienvenida', label: 'Bienvenida', icono: '🌟' },
          { id: 'semanales', label: 'Semanales', icono: '📅' },
          { id: 'mensuales', label: 'Mensuales', icono: '🗓️' }
        ].map(tab => (
          <button
            key={tab.id}
            className={`mision-tab ${tabActiva === tab.id ? 'activa' : ''}`}
            onClick={() => setTabActiva(tab.id)}
          >
            <span>{tab.icono}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Lista de misiones */}
      <div className="misiones-lista">
        {misiones.map(mision => {
          const completada = misionesCompletadas.includes(mision.id);
          return (
            <div key={mision.id} className={`mision-card ${completada ? 'completada' : ''}`}>
              <div className="mision-icono">{mision.icono}</div>
              <div className="mision-info">
                <h5>{mision.nombre}</h5>
                <div className="mision-recompensas">
                  {mision.recompensa.runas > 0 && (
                    <span className="recompensa runas">+{mision.recompensa.runas} ᚱ</span>
                  )}
                  {mision.recompensa.xp > 0 && (
                    <span className="recompensa xp">+{mision.recompensa.xp} XP</span>
                  )}
                  {mision.recompensa.badge && (
                    <span className="recompensa badge">🏆</span>
                  )}
                </div>
              </div>
              <div className="mision-estado">
                {completada ? (
                  <span className="estado-completada">✓</span>
                ) : (
                  <span className="estado-pendiente">○</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <style jsx>{`
        .misiones-panel {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .misiones-cargando {
          display: flex;
          justify-content: center;
          padding: 40px;
        }

        .mision-spinner {
          width: 30px;
          height: 30px;
          border: 2px solid rgba(212, 175, 55, 0.2);
          border-top-color: #d4af37;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        .misiones-tabs {
          display: flex;
          gap: 8px;
          overflow-x: auto;
          padding-bottom: 4px;
        }

        .mision-tab {
          display: flex;
          align-items: center;
          gap: 6px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          padding: 10px 16px;
          color: rgba(255, 255, 255, 0.6);
          font-size: 13px;
          cursor: pointer;
          transition: all 0.3s;
          white-space: nowrap;
        }

        .mision-tab:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        .mision-tab.activa {
          background: rgba(212, 175, 55, 0.15);
          border-color: rgba(212, 175, 55, 0.3);
          color: #d4af37;
        }

        .misiones-lista {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .mision-card {
          display: flex;
          align-items: center;
          gap: 16px;
          background: linear-gradient(145deg, #1a1a2e 0%, #16213e 100%);
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 16px;
          padding: 16px;
          transition: all 0.3s;
        }

        .mision-card:hover {
          border-color: rgba(212, 175, 55, 0.2);
        }

        .mision-card.completada {
          background: linear-gradient(145deg, rgba(46, 204, 113, 0.1) 0%, rgba(39, 174, 96, 0.05) 100%);
          border-color: rgba(46, 204, 113, 0.3);
        }

        .mision-icono {
          width: 44px;
          height: 44px;
          background: rgba(212, 175, 55, 0.12);
          border: 1px solid rgba(212, 175, 55, 0.2);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
        }

        .mision-info {
          flex: 1;
        }

        .mision-info h5 {
          margin: 0 0 6px;
          font-size: 14px;
          color: #fff;
          font-weight: 500;
        }

        .mision-recompensas {
          display: flex;
          gap: 8px;
        }

        .recompensa {
          font-size: 12px;
          padding: 2px 8px;
          border-radius: 10px;
        }

        .recompensa.runas {
          background: rgba(212, 175, 55, 0.15);
          color: #d4af37;
        }

        .recompensa.xp {
          background: rgba(155, 89, 182, 0.15);
          color: #9b59b6;
        }

        .recompensa.badge {
          background: rgba(46, 204, 113, 0.15);
          color: #2ecc71;
        }

        .mision-estado {
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .estado-completada {
          color: #2ecc71;
          font-size: 20px;
          font-weight: bold;
        }

        .estado-pendiente {
          color: rgba(255, 255, 255, 0.2);
          font-size: 20px;
        }
      `}</style>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// HISTORIAL DE LECTURAS
// Lista de lecturas pasadas con acceso a releerlas
// ═══════════════════════════════════════════════════════════════

// Helper para calcular tiempo restante
function calcularTiempoRestante(fechaEntregaEstimada) {
  if (!fechaEntregaEstimada) return null;
  const ahora = new Date();
  const entrega = new Date(fechaEntregaEstimada);
  const diffMs = entrega - ahora;

  if (diffMs <= 0) return 'unos segundos';

  const diffMins = Math.ceil(diffMs / 60000);
  if (diffMins < 60) return `${diffMins} min`;

  const diffHoras = Math.floor(diffMins / 60);
  const minsRestantes = diffMins % 60;
  if (diffHoras < 24) {
    return minsRestantes > 0 ? `${diffHoras}h ${minsRestantes}min` : `${diffHoras}h`;
  }

  const diffDias = Math.floor(diffHoras / 24);
  return `${diffDias} día${diffDias > 1 ? 's' : ''}`;
}

export function HistorialLecturas({ token }) {
  const [historial, setHistorial] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [lecturaAbierta, setLecturaAbierta] = useState(null);
  const [procesando, setProcesando] = useState(false);

  useEffect(() => {
    cargarHistorial();
  }, [token]);

  const cargarHistorial = async () => {
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE}/api/gamificacion/historial-lecturas?token=${token}`);
      const data = await res.json();
      if (data.success) {
        const lecturas = data.lecturas || [];
        setHistorial(lecturas);

        // Verificar si hay lecturas trabadas (procesando con tiempo pasado)
        const ahora = new Date();
        const trabadas = lecturas.filter(l => {
          if (l.estado !== 'procesando') return false;
          if (!l.fechaEntregaEstimada) return true; // Sin fecha = trabada
          const fechaEntrega = new Date(l.fechaEntregaEstimada);
          return fechaEntrega < ahora; // Fecha pasada = trabada
        });

        // Si hay trabadas, procesarlas automáticamente
        if (trabadas.length > 0 && !procesando) {
          procesarPendientes();
        }
      }
    } catch (e) {
      console.error('Error cargando historial:', e);
    }
    setCargando(false);
  };

  const procesarPendientes = async () => {
    if (procesando) return;
    setProcesando(true);
    try {
      const res = await fetch(`${API_BASE}/api/experiencias/procesar-pendientes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token })
      });
      const data = await res.json();
      if (data.success && data.procesadas > 0) {
        // Recargar historial después de procesar
        setTimeout(() => cargarHistorial(), 1000);
      }
    } catch (e) {
      console.error('Error procesando pendientes:', e);
    }
    setProcesando(false);
  };

  const abrirLectura = async (lecturaId) => {
    try {
      const res = await fetch(`${API_BASE}/api/gamificacion/ejecutar-lectura?token=${token}&id=${lecturaId}`);
      const data = await res.json();
      if (data.success && data.lectura) {
        setLecturaAbierta(data.lectura);
      }
    } catch (e) {
      console.error('Error abriendo lectura:', e);
    }
  };

  if (cargando) {
    return <div className="historial-cargando"><div className="hist-spinner"></div></div>;
  }

  if (procesando) {
    return (
      <div className="historial-procesando">
        <div className="hist-spinner"></div>
        <p style={{ color: '#d4af37', marginTop: '15px' }}>Generando tus lecturas pendientes...</p>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px' }}>Esto puede tardar unos segundos</p>
        <style jsx>{`
          .historial-procesando {
            text-align: center;
            padding: 40px 20px;
            background: linear-gradient(145deg, #1a1a2e 0%, #16213e 100%);
            border: 1px solid rgba(212, 175, 55, 0.3);
            border-radius: 20px;
          }
        `}</style>
      </div>
    );
  }

  if (historial.length === 0) {
    return (
      <div className="historial-vacio">
        <div className="vacio-icono">📖</div>
        <h4>Sin lecturas aún</h4>
        <p>Tus lecturas completadas aparecerán aquí</p>
        <style jsx>{`
          .historial-vacio {
            text-align: center;
            padding: 40px 20px;
            background: linear-gradient(145deg, #1a1a2e 0%, #16213e 100%);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 20px;
          }
          .vacio-icono {
            font-size: 48px;
            margin-bottom: 16px;
            opacity: 0.5;
          }
          .historial-vacio h4 {
            margin: 0 0 8px;
            color: #fff;
            font-size: 18px;
          }
          .historial-vacio p {
            margin: 0;
            color: rgba(255, 255, 255, 0.5);
            font-size: 14px;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="historial-lecturas">
      {/* Modal de lectura completa */}
      {lecturaAbierta && (
        <div className="lectura-modal-overlay" onClick={() => setLecturaAbierta(null)}>
          <div className="lectura-modal" onClick={e => e.stopPropagation()}>
            <button className="modal-cerrar" onClick={() => setLecturaAbierta(null)}>×</button>
            <div className="lectura-modal-header">
              <span className="lectura-modal-icono">{lecturaAbierta.icono}</span>
              <div>
                <h3>{lecturaAbierta.nombre}</h3>
                <span className="lectura-fecha">{new Date(lecturaAbierta.fecha).toLocaleDateString('es-UY', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}</span>
              </div>
            </div>
            <div className="lectura-modal-contenido">
              {lecturaAbierta.contenido}
            </div>
          </div>
        </div>
      )}

      {/* Lista de lecturas */}
      <div className="historial-lista">
        {historial.map((lectura, index) => {
          const esProcesando = lectura.estado === 'procesando' || lectura.estado === 'pendiente';
          const tiempoRestante = calcularTiempoRestante(lectura.fechaEntregaEstimada);

          return (
            <div
              key={lectura.id || index}
              className={`historial-item ${esProcesando ? 'procesando' : ''}`}
              onClick={() => !esProcesando && abrirLectura(lectura.id)}
              style={{ cursor: esProcesando ? 'default' : 'pointer' }}
            >
              <div className="hist-icono">{lectura.icono || '📖'}</div>
              <div className="hist-info">
                <h5>{lectura.nombre}</h5>
                {esProcesando ? (
                  <span className="hist-estado-procesando">
                    <span className="spinner-mini"></span>
                    {tiempoRestante ? `Lista en ~${tiempoRestante}` : 'Generando...'}
                  </span>
                ) : (
                  <span className="hist-fecha">
                    {new Date(lectura.fecha).toLocaleDateString('es-UY', {
                      day: 'numeric',
                      month: 'short'
                    })}
                  </span>
                )}
              </div>
              <div className={`hist-runas ${esProcesando ? 'procesando' : ''}`}>
                {esProcesando ? '⏳' : `-${lectura.runas} ᚱ`}
              </div>
            </div>
          );
        })}
      </div>

      <style jsx>{`
        .historial-lecturas {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .historial-cargando {
          display: flex;
          justify-content: center;
          padding: 40px;
        }

        .hist-spinner {
          width: 30px;
          height: 30px;
          border: 2px solid rgba(212, 175, 55, 0.2);
          border-top-color: #d4af37;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .historial-lista {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .historial-item {
          display: flex;
          align-items: center;
          gap: 12px;
          background: linear-gradient(145deg, #1a1a2e 0%, #16213e 100%);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 14px;
          cursor: pointer;
          transition: all 0.3s;
        }

        .historial-item:hover {
          border-color: rgba(212, 175, 55, 0.3);
          transform: translateX(4px);
        }

        .hist-icono {
          width: 40px;
          height: 40px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
        }

        .hist-info {
          flex: 1;
        }

        .hist-info h5 {
          margin: 0 0 4px;
          font-size: 14px;
          color: #fff;
          font-weight: 500;
        }

        .hist-fecha {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.4);
        }

        .hist-runas {
          font-size: 13px;
          color: rgba(212, 175, 55, 0.7);
        }

        .hist-runas.procesando {
          font-size: 18px;
        }

        .historial-item.procesando {
          border-color: rgba(147, 112, 219, 0.3);
          background: linear-gradient(145deg, #1a1a2e 0%, #1e1e3f 100%);
        }

        .historial-item.procesando:hover {
          transform: none;
          border-color: rgba(147, 112, 219, 0.3);
        }

        .hist-estado-procesando {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          color: #9370db;
        }

        .spinner-mini {
          width: 12px;
          height: 12px;
          border: 2px solid rgba(147, 112, 219, 0.2);
          border-top-color: #9370db;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        /* Modal */
        .lectura-modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.9);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
          overflow-y: auto;
        }

        .lectura-modal {
          background: linear-gradient(145deg, #1a1a2e 0%, #16213e 100%);
          border: 1px solid rgba(212, 175, 55, 0.3);
          border-radius: 24px;
          padding: 32px;
          max-width: 700px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
          position: relative;
        }

        .modal-cerrar {
          position: absolute;
          top: 16px;
          right: 16px;
          width: 36px;
          height: 36px;
          background: rgba(255, 255, 255, 0.1);
          border: none;
          border-radius: 50%;
          color: #fff;
          font-size: 24px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .lectura-modal-header {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 24px;
        }

        .lectura-modal-icono {
          font-size: 40px;
        }

        .lectura-modal-header h3 {
          margin: 0 0 4px;
          color: #fff;
          font-size: 20px;
        }

        .lectura-fecha {
          font-size: 13px;
          color: rgba(255, 255, 255, 0.5);
        }

        .lectura-modal-contenido {
          color: rgba(255, 255, 255, 0.85);
          font-size: 15px;
          line-height: 1.8;
          white-space: pre-wrap;
        }
      `}</style>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// LEADERBOARD DE RACHAS
// Top usuarios por racha
// ═══════════════════════════════════════════════════════════════

export function LeaderboardRachas({ token }) {
  const [leaderboard, setLeaderboard] = useState([]);
  const [miPosicion, setMiPosicion] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    cargarLeaderboard();
  }, [token]);

  const cargarLeaderboard = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/gamificacion/leaderboard?token=${token}`);
      const data = await res.json();
      if (data.success) {
        setLeaderboard(data.top || []);
        setMiPosicion(data.miPosicion);
      }
    } catch (e) {
      console.error('Error cargando leaderboard:', e);
    }
    setCargando(false);
  };

  if (cargando) {
    return <div className="leaderboard-cargando"><div className="lb-spinner"></div></div>;
  }

  if (leaderboard.length === 0) {
    return null;
  }

  return (
    <div className="leaderboard-rachas">
      <h4>🔥 Top Rachas del Bosque</h4>

      <div className="leaderboard-lista">
        {leaderboard.slice(0, 10).map((usuario, index) => (
          <div
            key={usuario.email}
            className={`lb-item ${index < 3 ? `top-${index + 1}` : ''} ${usuario.esSelf ? 'self' : ''}`}
          >
            <div className="lb-posicion">
              {index === 0 && '🥇'}
              {index === 1 && '🥈'}
              {index === 2 && '🥉'}
              {index > 2 && <span>{index + 1}</span>}
            </div>
            <div className="lb-avatar">
              {usuario.nombre?.charAt(0).toUpperCase() || '?'}
            </div>
            <div className="lb-info">
              <span className="lb-nombre">{usuario.esSelf ? 'Vos' : usuario.nombre || 'Anónima'}</span>
              <span className="lb-nivel">{NIVELES_INFO[usuario.nivel]?.icono} {NIVELES_INFO[usuario.nivel]?.nombre || usuario.nivel}</span>
            </div>
            <div className="lb-racha">
              {usuario.racha}🔥
            </div>
          </div>
        ))}
      </div>

      {miPosicion && miPosicion > 10 && (
        <div className="lb-mi-posicion">
          <span>Tu posición: #{miPosicion}</span>
        </div>
      )}

      <style jsx>{`
        .leaderboard-rachas {
          background: linear-gradient(145deg, #1a1a2e 0%, #16213e 100%);
          border: 1px solid rgba(255, 87, 34, 0.2);
          border-radius: 20px;
          padding: 20px;
        }

        .leaderboard-cargando {
          display: flex;
          justify-content: center;
          padding: 40px;
        }

        .lb-spinner {
          width: 30px;
          height: 30px;
          border: 2px solid rgba(255, 87, 34, 0.2);
          border-top-color: #ff5722;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .leaderboard-rachas h4 {
          margin: 0 0 16px;
          font-size: 16px;
          color: #fff;
          text-align: center;
        }

        .leaderboard-lista {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .lb-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          background: rgba(255, 255, 255, 0.03);
          border-radius: 12px;
          transition: all 0.3s;
        }

        .lb-item.top-1 {
          background: linear-gradient(145deg, rgba(255, 215, 0, 0.15) 0%, rgba(255, 193, 7, 0.05) 100%);
          border: 1px solid rgba(255, 215, 0, 0.3);
        }

        .lb-item.top-2 {
          background: linear-gradient(145deg, rgba(192, 192, 192, 0.15) 0%, rgba(169, 169, 169, 0.05) 100%);
          border: 1px solid rgba(192, 192, 192, 0.3);
        }

        .lb-item.top-3 {
          background: linear-gradient(145deg, rgba(205, 127, 50, 0.15) 0%, rgba(184, 115, 51, 0.05) 100%);
          border: 1px solid rgba(205, 127, 50, 0.3);
        }

        .lb-item.self {
          border: 1px solid rgba(212, 175, 55, 0.3);
          background: rgba(212, 175, 55, 0.1);
        }

        .lb-posicion {
          width: 30px;
          text-align: center;
          font-size: 18px;
        }

        .lb-posicion span {
          color: rgba(255, 255, 255, 0.4);
          font-size: 14px;
        }

        .lb-avatar {
          width: 36px;
          height: 36px;
          background: linear-gradient(135deg, #d4af37, #b8962e);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
          font-weight: 600;
          color: #000;
        }

        .lb-info {
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .lb-nombre {
          font-size: 14px;
          color: #fff;
          font-weight: 500;
        }

        .lb-nivel {
          font-size: 11px;
          color: rgba(255, 255, 255, 0.4);
        }

        .lb-racha {
          font-size: 16px;
          font-weight: 600;
          color: #ff5722;
        }

        .lb-mi-posicion {
          text-align: center;
          margin-top: 16px;
          padding-top: 16px;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          color: rgba(255, 255, 255, 0.5);
          font-size: 13px;
        }
      `}</style>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// SISTEMA DE NOTIFICACIONES/TOASTS
// Toast para mostrar logros, badges, etc.
// ═══════════════════════════════════════════════════════════════

export function ToastGamificacion({ mensaje, tipo = 'info', icono, duracion = 4000, onCerrar }) {
  const [visible, setVisible] = useState(true);
  const [saliendo, setSaliendo] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSaliendo(true);
      setTimeout(() => {
        setVisible(false);
        if (onCerrar) onCerrar();
      }, 300);
    }, duracion);

    return () => clearTimeout(timer);
  }, [duracion, onCerrar]);

  if (!visible) return null;

  const colores = {
    xp: { bg: 'rgba(155, 89, 182, 0.95)', border: '#9b59b6' },
    runas: { bg: 'rgba(212, 175, 55, 0.95)', border: '#d4af37' },
    badge: { bg: 'rgba(46, 204, 113, 0.95)', border: '#2ecc71' },
    nivel: { bg: 'rgba(52, 152, 219, 0.95)', border: '#3498db' },
    racha: { bg: 'rgba(255, 87, 34, 0.95)', border: '#ff5722' },
    info: { bg: 'rgba(30, 30, 50, 0.95)', border: 'rgba(255, 255, 255, 0.2)' }
  };

  const color = colores[tipo] || colores.info;

  return (
    <div className={`toast-gamificacion ${tipo} ${saliendo ? 'saliendo' : ''}`}>
      {icono && <span className="toast-icono">{icono}</span>}
      <span className="toast-mensaje">{mensaje}</span>

      <style jsx>{`
        .toast-gamificacion {
          position: fixed;
          bottom: 20px;
          right: 20px;
          background: ${color.bg};
          border: 1px solid ${color.border};
          border-radius: 12px;
          padding: 14px 20px;
          display: flex;
          align-items: center;
          gap: 12px;
          color: #fff;
          font-size: 14px;
          font-weight: 500;
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.3);
          z-index: 9999;
          animation: slideIn 0.3s ease;
          max-width: 350px;
        }

        .toast-gamificacion.saliendo {
          animation: slideOut 0.3s ease forwards;
        }

        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes slideOut {
          from {
            transform: translateX(0);
            opacity: 1;
          }
          to {
            transform: translateX(100%);
            opacity: 0;
          }
        }

        .toast-icono {
          font-size: 24px;
        }

        .toast-mensaje {
          flex: 1;
        }
      `}</style>
    </div>
  );
}

// Contexto para manejar toasts globalmente
import { createContext, useContext } from 'react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const mostrarToast = (config) => {
    const id = Date.now();
    setToasts(prev => [...prev, { ...config, id }]);
  };

  const cerrarToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ mostrarToast }}>
      {children}
      <div className="toasts-container">
        {toasts.map((toast, index) => (
          <div key={toast.id} style={{ marginBottom: index < toasts.length - 1 ? '60px' : 0 }}>
            <ToastGamificacion
              {...toast}
              onCerrar={() => cerrarToast(toast.id)}
            />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast debe usarse dentro de ToastProvider');
  }
  return context;
}
