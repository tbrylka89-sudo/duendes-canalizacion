'use client';
import { useState, useEffect } from 'react';
import { API_BASE } from './constants';
import { InfoTooltip } from './TooltipInfo';

export default function CofreDiario({ usuario, token, onRunasGanadas }) {
  const [gamificacion, setGamificacion] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [reclamando, setReclamando] = useState(false);
  const [resultado, setResultado] = useState(null);
  const [animacion, setAnimacion] = useState('cerrado');

  useEffect(() => {
    if (token) {
      cargarGamificacion();
    } else {
      setCargando(false);
    }
  }, [token]);

  const cargarGamificacion = async () => {
    setCargando(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/api/gamificacion/usuario?token=${token}`);
      const data = await res.json();
      if (data.success && data.gamificacion) {
        setGamificacion(data.gamificacion);
      } else {
        setError(data.error || 'No se pudo cargar el cofre');
      }
    } catch (e) {
      console.error('Error cargando gamificación:', e);
      setError('Error de conexión');
    }
    setCargando(false);
  };

  const reclamarCofre = async () => {
    if (reclamando || !gamificacion?.puedeReclamarCofre) return;
    setReclamando(true);
    setAnimacion('girando');

    try {
      const res = await fetch(`${API_BASE}/api/gamificacion/cofre-diario`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token })
      });
      const data = await res.json();
      await new Promise(r => setTimeout(r, 2000));

      if (data.success) {
        setAnimacion('abierto');
        setResultado(data);
        setGamificacion(prev => ({
          ...prev,
          puedeReclamarCofre: false,
          racha: data.racha.actual,
          rachaMax: data.racha.max
        }));
        if (onRunasGanadas) {
          onRunasGanadas(data.totales.runas);
        }
      } else {
        setAnimacion('cerrado');
        setResultado({ error: data.error });
      }
    } catch (e) {
      setAnimacion('cerrado');
      setResultado({ error: 'Error al reclamar cofre' });
    }
    setReclamando(false);
  };

  const cerrarResultado = () => {
    setResultado(null);
    setAnimacion('cerrado');
  };

  if (cargando) {
    return (
      <div className="cofre-container cofre-cargando">
        <div className="cofre-spinner"></div>
      </div>
    );
  }

  if (error || !gamificacion) {
    return (
      <div className="cofre-container">
        <div className="cofre-box error-state">
          <div className="cofre-header"><h3>Cofre Diario</h3></div>
          <div className="cofre-icono cerrado"><span className="cofre-cerrado">📦</span></div>
          <div className="cofre-info">
            <p className="cofre-error-msg">{error || 'No se pudo cargar'}</p>
            <button className="cofre-btn" onClick={cargarGamificacion}>Reintentar</button>
          </div>
        </div>
      </div>
    );
  }

  const puedeReclamar = gamificacion?.puedeReclamarCofre;
  const racha = gamificacion?.racha || 0;
  const diasParaBonus = gamificacion?.diasParaBonus;

  return (
    <div className="cofre-container">
      {resultado && !resultado.error && (
        <div className="cofre-modal-overlay" onClick={cerrarResultado}>
          <div className="cofre-modal" onClick={e => e.stopPropagation()}>
            <div className="cofre-modal-glow"></div>
            <div className="cofre-modal-content">
              <div className="cofre-icono-grande cofre-abierto-icono">
                <div className="cofre-mini abierto">
                  <div className="cofre-tapa"><div className="cofre-tapa-frente"></div></div>
                  <div className="cofre-cuerpo"></div>
                </div>
              </div>
              <h3>¡Cofre Abierto!</h3>
              <div className="cofre-recompensas">
                <div className="cofre-recompensa principal">
                  <span className="cofre-valor">+{resultado.cofre.runasBase}</span>
                  <span className="cofre-label">Runas</span>
                </div>
                <div className="cofre-recompensa">
                  <span className="cofre-valor">+{resultado.cofre.xpBase}</span>
                  <span className="cofre-label">XP</span>
                </div>
              </div>
              {resultado.bonusRacha && (
                <div className="cofre-bonus">
                  <div className="cofre-bonus-header">
                    <span className="cofre-bonus-dias">{resultado.bonusRacha.dias} días</span>
                    <span className="cofre-bonus-emoji">🔥</span>
                  </div>
                  <p className="cofre-bonus-msg">{resultado.bonusRacha.mensaje}</p>
                  <div className="cofre-bonus-extras">
                    {resultado.bonusRacha.runas > 0 && <span>+{resultado.bonusRacha.runas} runas bonus</span>}
                    {resultado.bonusRacha.xp > 0 && <span>+{resultado.bonusRacha.xp} XP bonus</span>}
                    {resultado.totales.lecturaGratis && <span className="cofre-lectura-gratis">🎁 ¡Lectura gratis!</span>}
                    {resultado.totales.badge && <span className="cofre-badge">🏆 Badge: {resultado.totales.badge}</span>}
                  </div>
                </div>
              )}
              <div className="cofre-total">
                <span>Total: {resultado.totales.runas} runas</span>
                <span className="cofre-balance">Balance: {resultado.nuevoBalance} runas</span>
              </div>
              <p className="cofre-mensaje">{resultado.mensaje}</p>
              <button className="cofre-cerrar-btn" onClick={cerrarResultado}>¡Genial!</button>
            </div>
          </div>
        </div>
      )}

      <div className={`cofre-box ${puedeReclamar ? 'disponible' : 'reclamado'} ${animacion}`}>
        <div className="cofre-header">
          <InfoTooltip tipo="cofreDiario">
            <h3>Cofre Diario</h3>
          </InfoTooltip>
          {racha > 0 && (
            <div className="cofre-racha">
              <span className="racha-fuego">🔥</span>
              <span className="racha-num">{racha}</span>
            </div>
          )}
        </div>

        {/* Cofre visual CSS */}
        <div
          className={`cofre-visual ${animacion} ${puedeReclamar ? 'clickeable' : ''}`}
          onClick={puedeReclamar ? reclamarCofre : undefined}
        >
          <div className="cofre-tapa">
            <div className="cofre-tapa-frente"></div>
            <div className="cofre-tapa-top"></div>
          </div>
          <div className="cofre-cuerpo">
            <div className="cofre-cerradura"></div>
            <div className="cofre-brillo"></div>
          </div>
          {animacion === 'girando' && (
            <div className="cofre-particulas">
              <span>✨</span><span>✨</span><span>✨</span>
              <span>⭐</span><span>⭐</span>
            </div>
          )}
          {animacion === 'abierto' && (
            <div className="cofre-luz"></div>
          )}
        </div>

        <div className="cofre-info">
          {puedeReclamar ? (
            <>
              <button className="cofre-btn" onClick={reclamarCofre} disabled={reclamando}>
                {reclamando ? 'Abriendo...' : '¡Abrir Cofre!'}
              </button>
              <p className="cofre-hint">Tocá para reclamar tus runas diarias</p>
            </>
          ) : (
            <>
              <p className="cofre-reclamado-msg">Ya reclamaste hoy</p>
              <p className="cofre-proximo">Volvé mañana</p>
            </>
          )}
        </div>
        {diasParaBonus && diasParaBonus <= 7 && (
          <div className="cofre-proximo-bonus">
            <span>🎁</span>
            <span>{diasParaBonus === 1 ? '¡Mañana bonus especial!' : `${diasParaBonus} días para bonus`}</span>
          </div>
        )}
      </div>

      {racha > 1 && (
        <div className="cofre-racha-info">
          <div className="racha-bar">
            <div className="racha-progress" style={{ width: `${Math.min((racha / 7) * 100, 100)}%` }}></div>
          </div>
          <div className="racha-hitos">
            <span className={racha >= 7 ? 'activo' : ''}>7🔥</span>
            <span className={racha >= 14 ? 'activo' : ''}>14🔥</span>
            <span className={racha >= 30 ? 'activo' : ''}>30🔥</span>
          </div>
        </div>
      )}
    </div>
  );
}
