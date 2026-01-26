'use client';
import { useState, useEffect } from 'react';
import { API_BASE } from './constants';
import { InfoTooltip } from './TooltipInfo';

// ═══════════════════════════════════════════════════════════════
// JARDÍN ENCANTADO - Recompensa Diaria
// Un paisaje mágico donde tocás el cristal para obtener runas
// ═══════════════════════════════════════════════════════════════

export default function CofreDiario({ usuario, token, onRunasGanadas }) {
  const [gamificacion, setGamificacion] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [reclamando, setReclamando] = useState(false);
  const [resultado, setResultado] = useState(null);
  const [animacion, setAnimacion] = useState('idle'); // idle, activando, revelando
  const [luciernagas, setLuciernagas] = useState([]);

  // Generar luciérnagas aleatorias
  useEffect(() => {
    const nuevasLuciernagas = Array.from({ length: 8 }, (_, i) => ({
      id: i,
      x: 10 + Math.random() * 80,
      y: 10 + Math.random() * 60,
      delay: Math.random() * 5,
      duration: 3 + Math.random() * 4
    }));
    setLuciernagas(nuevasLuciernagas);
  }, []);

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
        setError(data.error || 'No se pudo cargar');
      }
    } catch (e) {
      console.error('Error cargando gamificación:', e);
      setError('Error de conexión');
    }
    setCargando(false);
  };

  const reclamarRecompensa = async () => {
    if (reclamando || !gamificacion?.puedeReclamarCofre) return;
    setReclamando(true);
    setAnimacion('activando');

    try {
      const res = await fetch(`${API_BASE}/api/gamificacion/cofre-diario`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token })
      });
      const data = await res.json();

      // Esperar la animación del cristal
      await new Promise(r => setTimeout(r, 2500));

      if (data.success) {
        setAnimacion('revelando');
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
        setAnimacion('idle');
        setResultado({ error: data.error });
      }
    } catch (e) {
      setAnimacion('idle');
      setResultado({ error: 'Error al reclamar' });
    }
    setReclamando(false);
  };

  const cerrarResultado = () => {
    setResultado(null);
    setAnimacion('idle');
  };

  if (cargando) {
    return (
      <div className="jardin-container jardin-cargando">
        <div className="jardin-loader">
          <span className="loader-cristal">💎</span>
          <p>Preparando el jardín...</p>
        </div>
      </div>
    );
  }

  if (error || !gamificacion) {
    return (
      <div className="jardin-container">
        <div className="jardin-error">
          <span className="error-icono">🌿</span>
          <p>{error || 'No se pudo cargar el jardín'}</p>
          <button onClick={cargarGamificacion}>Reintentar</button>
        </div>
      </div>
    );
  }

  const puedeReclamar = gamificacion?.puedeReclamarCofre;
  const racha = gamificacion?.racha || 0;
  const diasParaBonus = gamificacion?.diasParaBonus;

  return (
    <div className="jardin-container">
      {/* Modal de resultado */}
      {resultado && !resultado.error && (
        <div className="jardin-modal-overlay" onClick={cerrarResultado}>
          <div className="jardin-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-magia"></div>
            <div className="modal-contenido">
              <div className="modal-cristal-grande">
                <div className="cristal-brillante">💎</div>
                <div className="cristal-rayos"></div>
              </div>
              <h3>¡Magia Revelada!</h3>
              <div className="modal-recompensas">
                <div className="recompensa-principal">
                  <span className="recompensa-valor">+{resultado.cofre.runasBase}</span>
                  <span className="recompensa-tipo">Runas</span>
                </div>
                <div className="recompensa-secundaria">
                  <span className="recompensa-valor">+{resultado.cofre.xpBase}</span>
                  <span className="recompensa-tipo">XP</span>
                </div>
              </div>
              {resultado.bonusRacha && (
                <div className="modal-bonus">
                  <div className="bonus-racha">
                    <span className="bonus-dias">{resultado.bonusRacha.dias} días</span>
                    <span className="bonus-fuego">🔥</span>
                  </div>
                  <p className="bonus-mensaje">{resultado.bonusRacha.mensaje}</p>
                  <div className="bonus-extras">
                    {resultado.bonusRacha.runas > 0 && <span>+{resultado.bonusRacha.runas} runas</span>}
                    {resultado.bonusRacha.xp > 0 && <span>+{resultado.bonusRacha.xp} XP</span>}
                    {resultado.totales.lecturaGratis && <span className="bonus-regalo">🎁 ¡Lectura gratis!</span>}
                  </div>
                </div>
              )}
              <div className="modal-total">
                <span>Total: {resultado.totales.runas} runas</span>
                <span className="total-balance">Nuevo balance: {resultado.nuevoBalance}</span>
              </div>
              <button className="modal-cerrar" onClick={cerrarResultado}>¡Genial!</button>
            </div>
          </div>
        </div>
      )}

      {/* Jardín Encantado */}
      <div className={`jardin-escena ${puedeReclamar ? 'activo' : 'visitado'} ${animacion}`}>
        {/* Título */}
        <div className="jardin-header">
          <InfoTooltip tipo="cofreDiario">
            <h3>Jardín Encantado</h3>
          </InfoTooltip>
          {racha > 0 && (
            <div className="jardin-racha">
              <span className="racha-fuego">🔥</span>
              <span className="racha-num">{racha}</span>
            </div>
          )}
        </div>

        {/* Escena del jardín */}
        <div className="jardin-paisaje" onClick={puedeReclamar ? reclamarRecompensa : undefined}>
          {/* Cielo nocturno */}
          <div className="jardin-cielo">
            <div className="estrella e1"></div>
            <div className="estrella e2"></div>
            <div className="estrella e3"></div>
            <div className="estrella e4"></div>
            <div className="estrella e5"></div>
            <div className="luna"></div>
          </div>

          {/* Luciérnagas flotantes */}
          <div className="luciernagas">
            {luciernagas.map(l => (
              <div
                key={l.id}
                className="luciernaga"
                style={{
                  left: `${l.x}%`,
                  top: `${l.y}%`,
                  animationDelay: `${l.delay}s`,
                  animationDuration: `${l.duration}s`
                }}
              ></div>
            ))}
          </div>

          {/* Plantas y flores del fondo */}
          <div className="jardin-fondo">
            <div className="arbol arbol-1"></div>
            <div className="arbol arbol-2"></div>
            <div className="hongo hongo-1">🍄</div>
            <div className="hongo hongo-2">🍄</div>
          </div>

          {/* Cristal central - el elemento interactivo */}
          <div className={`cristal-container ${puedeReclamar ? 'disponible' : ''} ${animacion}`}>
            <div className="cristal-base"></div>
            <div className="cristal-piedra">
              <div className="cristal-gema">💎</div>
              <div className="cristal-brillo"></div>
              <div className="cristal-aura"></div>
            </div>
            {animacion === 'activando' && (
              <div className="cristal-explosion">
                <span>✨</span><span>✨</span><span>✨</span>
                <span>⭐</span><span>⭐</span><span>⭐</span>
              </div>
            )}
          </div>

          {/* Pasto y flores del frente */}
          <div className="jardin-frente">
            <div className="pasto"></div>
            <div className="flor flor-1">🌸</div>
            <div className="flor flor-2">🌺</div>
            <div className="flor flor-3">🌷</div>
            <div className="flor flor-4">🌻</div>
            <div className="flor flor-5">🌼</div>
          </div>
        </div>

        {/* Info y estado */}
        <div className="jardin-info">
          {puedeReclamar ? (
            <>
              <p className="jardin-llamada">
                {reclamando ? '✨ Canalizando magia...' : '¡Tocá el cristal!'}
              </p>
              <p className="jardin-hint">Tu recompensa diaria te espera</p>
            </>
          ) : (
            <>
              <p className="jardin-visitado">Ya reclamaste tu magia hoy</p>
              <p className="jardin-volver">El cristal se recarga mañana</p>
            </>
          )}
        </div>

        {/* Próximo bonus */}
        {diasParaBonus && diasParaBonus <= 7 && (
          <div className="jardin-proximo-bonus">
            <span>🎁</span>
            <span>{diasParaBonus === 1 ? '¡Mañana bonus especial!' : `${diasParaBonus} días para bonus`}</span>
          </div>
        )}
      </div>

      {/* Barra de racha */}
      {racha > 1 && (
        <div className="jardin-racha-info">
          <div className="racha-barra">
            <div className="racha-progreso" style={{ width: `${Math.min((racha / 7) * 100, 100)}%` }}></div>
          </div>
          <div className="racha-hitos">
            <span className={racha >= 7 ? 'activo' : ''}>7🔥</span>
            <span className={racha >= 14 ? 'activo' : ''}>14🔥</span>
            <span className={racha >= 30 ? 'activo' : ''}>30🔥</span>
          </div>
        </div>
      )}

      <style jsx>{`
        .jardin-container {
          width: 100%;
          max-width: 400px;
          margin: 0 auto;
        }

        /* ═══════ LOADER ═══════ */
        .jardin-cargando {
          display: flex;
          justify-content: center;
          padding: 40px;
        }

        .jardin-loader {
          text-align: center;
          color: rgba(255,255,255,0.6);
        }

        .loader-cristal {
          font-size: 40px;
          display: block;
          animation: loaderPulse 1.5s ease-in-out infinite;
        }

        @keyframes loaderPulse {
          0%, 100% { transform: scale(1); opacity: 0.5; }
          50% { transform: scale(1.2); opacity: 1; }
        }

        /* ═══════ ERROR ═══════ */
        .jardin-error {
          text-align: center;
          padding: 40px 20px;
          background: rgba(255,255,255,0.03);
          border-radius: 20px;
          border: 1px solid rgba(255,255,255,0.1);
        }

        .error-icono {
          font-size: 50px;
          display: block;
          margin-bottom: 15px;
          filter: grayscale(1);
        }

        .jardin-error p {
          color: rgba(255,255,255,0.6);
          margin-bottom: 20px;
        }

        .jardin-error button {
          background: linear-gradient(135deg, #d4af37, #b8972e);
          color: #0a0a0a;
          border: none;
          padding: 12px 30px;
          border-radius: 25px;
          font-weight: 600;
          cursor: pointer;
        }

        /* ═══════ ESCENA PRINCIPAL ═══════ */
        .jardin-escena {
          background: linear-gradient(180deg, #0d1b2a 0%, #1b263b 50%, #0d1b2a 100%);
          border-radius: 24px;
          overflow: hidden;
          border: 1px solid rgba(212,175,55,0.2);
          position: relative;
        }

        .jardin-escena.activo {
          border-color: rgba(212,175,55,0.4);
          box-shadow: 0 0 30px rgba(212,175,55,0.1);
        }

        .jardin-escena.visitado {
          filter: saturate(0.6);
          border-color: rgba(255,255,255,0.1);
        }

        /* ═══════ HEADER ═══════ */
        .jardin-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 15px 20px;
          background: rgba(0,0,0,0.3);
          border-bottom: 1px solid rgba(212,175,55,0.15);
        }

        .jardin-header h3 {
          font-family: 'Cinzel', serif;
          font-size: 16px;
          color: #d4af37;
          margin: 0;
        }

        .jardin-racha {
          display: flex;
          align-items: center;
          gap: 5px;
          background: rgba(255,100,50,0.2);
          padding: 5px 12px;
          border-radius: 15px;
        }

        .racha-fuego {
          font-size: 14px;
        }

        .racha-num {
          font-family: 'Cinzel', serif;
          font-size: 14px;
          font-weight: 600;
          color: #ff6b35;
        }

        /* ═══════ PAISAJE ═══════ */
        .jardin-paisaje {
          position: relative;
          height: 220px;
          cursor: pointer;
          overflow: hidden;
        }

        .jardin-escena.visitado .jardin-paisaje {
          cursor: default;
        }

        /* Cielo */
        .jardin-cielo {
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse at 70% 20%, rgba(100,100,180,0.3) 0%, transparent 50%);
        }

        .estrella {
          position: absolute;
          width: 3px;
          height: 3px;
          background: #fff;
          border-radius: 50%;
          animation: estrellaBrilla 2s ease-in-out infinite;
        }

        .e1 { top: 15%; left: 20%; animation-delay: 0s; }
        .e2 { top: 25%; left: 70%; animation-delay: 0.5s; }
        .e3 { top: 10%; left: 50%; animation-delay: 1s; }
        .e4 { top: 35%; left: 85%; animation-delay: 1.5s; width: 2px; height: 2px; }
        .e5 { top: 20%; left: 35%; animation-delay: 2s; width: 2px; height: 2px; }

        @keyframes estrellaBrilla {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.5); }
        }

        .luna {
          position: absolute;
          top: 15%;
          right: 15%;
          width: 35px;
          height: 35px;
          background: radial-gradient(circle at 30% 30%, #fffde7, #ffd54f);
          border-radius: 50%;
          box-shadow: 0 0 20px rgba(255,213,79,0.5), 0 0 40px rgba(255,213,79,0.3);
        }

        /* Luciérnagas */
        .luciernagas {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }

        .luciernaga {
          position: absolute;
          width: 6px;
          height: 6px;
          background: radial-gradient(circle, #90EE90, transparent);
          border-radius: 50%;
          animation: luciernagaFlota 4s ease-in-out infinite;
          box-shadow: 0 0 10px #90EE90, 0 0 20px rgba(144,238,144,0.5);
        }

        @keyframes luciernagaFlota {
          0%, 100% {
            transform: translate(0, 0) scale(1);
            opacity: 0.3;
          }
          25% {
            transform: translate(10px, -15px) scale(1.2);
            opacity: 1;
          }
          50% {
            transform: translate(-5px, -25px) scale(0.8);
            opacity: 0.6;
          }
          75% {
            transform: translate(-15px, -10px) scale(1.1);
            opacity: 0.9;
          }
        }

        /* Fondo - árboles y hongos */
        .jardin-fondo {
          position: absolute;
          bottom: 60px;
          left: 0;
          right: 0;
          height: 100px;
        }

        .arbol {
          position: absolute;
          bottom: 0;
          width: 60px;
          height: 80px;
          background: linear-gradient(180deg, #2d5a3d 0%, #1a3d2a 100%);
          border-radius: 50% 50% 5px 5px;
        }

        .arbol::after {
          content: '';
          position: absolute;
          bottom: -10px;
          left: 50%;
          transform: translateX(-50%);
          width: 12px;
          height: 20px;
          background: #5d4037;
          border-radius: 3px;
        }

        .arbol-1 { left: 5%; transform: scale(0.8); }
        .arbol-2 { right: 5%; transform: scale(0.9); }

        .hongo {
          position: absolute;
          bottom: 10px;
          font-size: 24px;
          animation: hongoRebota 3s ease-in-out infinite;
        }

        .hongo-1 { left: 18%; animation-delay: 0s; }
        .hongo-2 { right: 18%; animation-delay: 1.5s; }

        @keyframes hongoRebota {
          0%, 100% { transform: translateY(0) rotate(-5deg); }
          50% { transform: translateY(-5px) rotate(5deg); }
        }

        /* ═══════ CRISTAL CENTRAL ═══════ */
        .cristal-container {
          position: absolute;
          bottom: 50px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 10;
        }

        .cristal-base {
          width: 60px;
          height: 15px;
          background: linear-gradient(180deg, #5d4037, #3e2723);
          border-radius: 50%;
          margin: 0 auto;
        }

        .cristal-piedra {
          position: relative;
          width: 50px;
          height: 50px;
          margin: -10px auto 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .cristal-gema {
          font-size: 40px;
          position: relative;
          z-index: 2;
          filter: drop-shadow(0 0 10px rgba(212,175,55,0.5));
          transition: transform 0.3s;
        }

        .cristal-container.disponible .cristal-gema {
          animation: cristalLlama 2s ease-in-out infinite;
        }

        @keyframes cristalLlama {
          0%, 100% { transform: scale(1) rotate(0deg); }
          25% { transform: scale(1.05) rotate(-3deg); }
          50% { transform: scale(1.1) rotate(0deg); }
          75% { transform: scale(1.05) rotate(3deg); }
        }

        .cristal-container.disponible:hover .cristal-gema {
          transform: scale(1.2);
        }

        .cristal-brillo {
          position: absolute;
          inset: -20px;
          background: radial-gradient(circle, rgba(212,175,55,0.4) 0%, transparent 70%);
          animation: brilloPulsa 2s ease-in-out infinite;
        }

        @keyframes brilloPulsa {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.3); }
        }

        .cristal-aura {
          position: absolute;
          inset: -30px;
          border: 2px solid rgba(212,175,55,0.3);
          border-radius: 50%;
          animation: auraPulsa 3s ease-in-out infinite;
        }

        @keyframes auraPulsa {
          0%, 100% { transform: scale(0.8); opacity: 0; }
          50% { transform: scale(1.2); opacity: 1; }
        }

        /* Animación activando (sacudiéndose) */
        .cristal-container.activando .cristal-gema {
          animation: cristalSacude 0.1s ease-in-out infinite;
        }

        @keyframes cristalSacude {
          0%, 100% { transform: translateX(0) rotate(0deg); }
          25% { transform: translateX(-5px) rotate(-10deg); }
          75% { transform: translateX(5px) rotate(10deg); }
        }

        .cristal-container.activando .cristal-brillo {
          animation: brilloIntenso 0.3s ease-in-out infinite;
        }

        @keyframes brilloIntenso {
          0%, 100% { opacity: 0.8; transform: scale(1.5); }
          50% { opacity: 1; transform: scale(2); }
        }

        .cristal-explosion {
          position: absolute;
          inset: -40px;
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          align-items: center;
          pointer-events: none;
        }

        .cristal-explosion span {
          position: absolute;
          font-size: 20px;
          animation: particulaSale 2s ease-out forwards;
        }

        .cristal-explosion span:nth-child(1) { --angle: 0deg; }
        .cristal-explosion span:nth-child(2) { --angle: 60deg; animation-delay: 0.1s; }
        .cristal-explosion span:nth-child(3) { --angle: 120deg; animation-delay: 0.2s; }
        .cristal-explosion span:nth-child(4) { --angle: 180deg; animation-delay: 0.3s; }
        .cristal-explosion span:nth-child(5) { --angle: 240deg; animation-delay: 0.4s; }
        .cristal-explosion span:nth-child(6) { --angle: 300deg; animation-delay: 0.5s; }

        @keyframes particulaSale {
          0% { transform: translate(0, 0) scale(0); opacity: 0; }
          20% { opacity: 1; transform: translate(0, 0) scale(1); }
          100% { transform: translate(40px, -40px) scale(0.5); opacity: 0; }
        }

        /* Visitado - cristal apagado */
        .jardin-escena.visitado .cristal-gema {
          filter: grayscale(0.5) brightness(0.7);
          animation: none;
        }

        .jardin-escena.visitado .cristal-brillo,
        .jardin-escena.visitado .cristal-aura {
          opacity: 0.2;
          animation: none;
        }

        /* ═══════ FRENTE - PASTO Y FLORES ═══════ */
        .jardin-frente {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 60px;
        }

        .pasto {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 40px;
          background: linear-gradient(180deg, #2d5a3d 0%, #1a3d2a 100%);
          border-radius: 100% 100% 0 0 / 30px 30px 0 0;
        }

        .flor {
          position: absolute;
          bottom: 25px;
          font-size: 20px;
          animation: florMece 4s ease-in-out infinite;
        }

        .flor-1 { left: 10%; animation-delay: 0s; }
        .flor-2 { left: 25%; animation-delay: 0.5s; font-size: 18px; }
        .flor-3 { left: 50%; animation-delay: 1s; }
        .flor-4 { right: 25%; animation-delay: 1.5s; font-size: 22px; }
        .flor-5 { right: 10%; animation-delay: 2s; font-size: 18px; }

        @keyframes florMece {
          0%, 100% { transform: rotate(-5deg); }
          50% { transform: rotate(5deg); }
        }

        /* ═══════ INFO ═══════ */
        .jardin-info {
          text-align: center;
          padding: 15px 20px;
          background: rgba(0,0,0,0.3);
          border-top: 1px solid rgba(212,175,55,0.15);
        }

        .jardin-llamada {
          font-family: 'Cinzel', serif;
          font-size: 16px;
          color: #d4af37;
          margin: 0 0 5px;
        }

        .jardin-hint {
          font-size: 13px;
          color: rgba(255,255,255,0.5);
          margin: 0;
        }

        .jardin-visitado {
          font-family: 'Cinzel', serif;
          font-size: 14px;
          color: rgba(255,255,255,0.6);
          margin: 0 0 5px;
        }

        .jardin-volver {
          font-size: 12px;
          color: rgba(255,255,255,0.4);
          margin: 0;
        }

        /* ═══════ PRÓXIMO BONUS ═══════ */
        .jardin-proximo-bonus {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 10px;
          background: rgba(212,175,55,0.1);
          border-top: 1px solid rgba(212,175,55,0.15);
          font-size: 13px;
          color: #d4af37;
        }

        /* ═══════ BARRA DE RACHA ═══════ */
        .jardin-racha-info {
          margin-top: 15px;
          padding: 15px;
          background: rgba(255,255,255,0.03);
          border-radius: 12px;
          border: 1px solid rgba(255,255,255,0.1);
        }

        .racha-barra {
          height: 6px;
          background: rgba(255,255,255,0.1);
          border-radius: 3px;
          overflow: hidden;
          margin-bottom: 10px;
        }

        .racha-progreso {
          height: 100%;
          background: linear-gradient(90deg, #ff6b35, #d4af37);
          border-radius: 3px;
          transition: width 0.5s ease;
        }

        .racha-hitos {
          display: flex;
          justify-content: space-between;
          font-size: 12px;
          color: rgba(255,255,255,0.4);
        }

        .racha-hitos span.activo {
          color: #ff6b35;
          font-weight: 600;
        }

        /* ═══════ MODAL RESULTADO ═══════ */
        .jardin-modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.85);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
        }

        .jardin-modal {
          background: linear-gradient(180deg, #1a1a2e 0%, #0a0a0a 100%);
          border-radius: 24px;
          border: 1px solid rgba(212,175,55,0.3);
          max-width: 350px;
          width: 100%;
          position: relative;
          overflow: hidden;
        }

        .modal-magia {
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse at 50% 0%, rgba(212,175,55,0.2) 0%, transparent 70%);
          pointer-events: none;
        }

        .modal-contenido {
          position: relative;
          padding: 30px 25px;
          text-align: center;
        }

        .modal-cristal-grande {
          position: relative;
          margin-bottom: 20px;
        }

        .cristal-brillante {
          font-size: 60px;
          animation: cristalBrilla 2s ease-in-out infinite;
        }

        @keyframes cristalBrilla {
          0%, 100% { filter: drop-shadow(0 0 20px rgba(212,175,55,0.8)); }
          50% { filter: drop-shadow(0 0 40px rgba(212,175,55,1)) drop-shadow(0 0 60px rgba(107,33,168,0.5)); }
        }

        .cristal-rayos {
          position: absolute;
          inset: -30px;
          background: radial-gradient(circle, rgba(212,175,55,0.3) 0%, transparent 70%);
          animation: rayosPulsa 1.5s ease-in-out infinite;
        }

        @keyframes rayosPulsa {
          0%, 100% { transform: scale(1); opacity: 0.5; }
          50% { transform: scale(1.3); opacity: 1; }
        }

        .modal-contenido h3 {
          font-family: 'Cinzel', serif;
          font-size: 24px;
          background: linear-gradient(135deg, #d4af37, #e8d5a3);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin: 0 0 20px;
        }

        .modal-recompensas {
          display: flex;
          justify-content: center;
          gap: 30px;
          margin-bottom: 20px;
        }

        .recompensa-principal,
        .recompensa-secundaria {
          text-align: center;
        }

        .recompensa-valor {
          display: block;
          font-family: 'Cinzel', serif;
          font-size: 32px;
          font-weight: 700;
          color: #d4af37;
        }

        .recompensa-secundaria .recompensa-valor {
          font-size: 24px;
          color: #a78bfa;
        }

        .recompensa-tipo {
          font-size: 13px;
          color: rgba(255,255,255,0.6);
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .modal-bonus {
          background: rgba(255,100,50,0.1);
          border: 1px solid rgba(255,100,50,0.3);
          border-radius: 12px;
          padding: 15px;
          margin-bottom: 20px;
        }

        .bonus-racha {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin-bottom: 8px;
        }

        .bonus-dias {
          font-family: 'Cinzel', serif;
          font-size: 16px;
          font-weight: 600;
          color: #ff6b35;
        }

        .bonus-fuego {
          font-size: 18px;
        }

        .bonus-mensaje {
          font-size: 14px;
          color: rgba(255,255,255,0.7);
          margin: 0 0 10px;
        }

        .bonus-extras {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 10px;
          font-size: 12px;
          color: #ff6b35;
        }

        .bonus-regalo {
          color: #22c55e;
        }

        .modal-total {
          padding: 15px;
          background: rgba(212,175,55,0.1);
          border-radius: 10px;
          margin-bottom: 20px;
        }

        .modal-total span {
          display: block;
          font-family: 'Cinzel', serif;
          font-size: 16px;
          color: #d4af37;
        }

        .total-balance {
          font-size: 13px !important;
          color: rgba(255,255,255,0.5) !important;
          margin-top: 5px;
        }

        .modal-cerrar {
          background: linear-gradient(135deg, #d4af37, #b8972e);
          color: #0a0a0a;
          border: none;
          padding: 14px 40px;
          border-radius: 25px;
          font-family: 'Cinzel', serif;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
        }

        .modal-cerrar:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(212,175,55,0.3);
        }
      `}</style>
    </div>
  );
}
