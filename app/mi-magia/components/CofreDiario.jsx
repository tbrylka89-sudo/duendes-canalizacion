'use client';
import { useState, useEffect } from 'react';
import { API_BASE } from './constants';
import { InfoTooltip } from './TooltipInfo';

export default function JardinEncantado({ usuario, token, onRunasGanadas }) {
  const [gamificacion, setGamificacion] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [reclamando, setReclamando] = useState(false);
  const [resultado, setResultado] = useState(null);
  const [animacion, setAnimacion] = useState('idle');

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
      await new Promise(r => setTimeout(r, 2500));

      if (data.success) {
        setAnimacion('completado');
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

  const puedeReclamar = gamificacion?.puedeReclamarCofre;
  const racha = gamificacion?.racha || 0;
  const diasParaBonus = gamificacion?.diasParaBonus;

  // Estilos inline para evitar problemas con styled-jsx
  const styles = {
    container: {
      position: 'relative',
      width: '100%',
      margin: '1.5rem 0',
    },
    jardin: {
      position: 'relative',
      width: '100%',
      height: '280px',
      borderRadius: '20px',
      overflow: 'hidden',
      background: 'linear-gradient(180deg, #0a0a1a 0%, #1a1a3a 40%, #2a3a2a 100%)',
      border: puedeReclamar ? '2px solid rgba(212,175,55,0.5)' : '2px solid rgba(100,100,100,0.3)',
      boxShadow: puedeReclamar ? '0 0 30px rgba(212,175,55,0.2)' : 'none',
      cursor: puedeReclamar ? 'pointer' : 'default',
    },
    header: {
      position: 'absolute',
      top: '12px',
      left: '16px',
      right: '16px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      zIndex: 10,
    },
    titulo: {
      fontFamily: "'Cinzel', serif",
      fontSize: '0.95rem',
      color: '#d4af37',
      margin: 0,
      textShadow: '0 2px 4px rgba(0,0,0,0.5)',
    },
    racha: {
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
      background: 'rgba(0,0,0,0.5)',
      padding: '4px 10px',
      borderRadius: '20px',
      fontSize: '0.85rem',
    },
    cielo: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: '60%',
    },
    luna: {
      position: 'absolute',
      top: '20px',
      right: '30px',
      width: '40px',
      height: '40px',
      borderRadius: '50%',
      background: 'radial-gradient(circle at 30% 30%, #fffacd, #f0e68c)',
      boxShadow: '0 0 30px rgba(255,250,205,0.5), 0 0 60px rgba(255,250,205,0.3)',
    },
    suelo: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      height: '45%',
      background: 'linear-gradient(180deg, #1a2a1a 0%, #0f1a0f 100%)',
      borderTop: '2px solid #2a3a2a',
    },
    cristalContainer: {
      position: 'absolute',
      bottom: '55px',
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 5,
      filter: puedeReclamar
        ? 'drop-shadow(0 0 20px rgba(180,130,255,0.6)) drop-shadow(0 0 40px rgba(180,130,255,0.3))'
        : 'drop-shadow(0 0 5px rgba(100,100,100,0.3))',
      animation: animacion === 'activando'
        ? 'cristalShake 0.1s infinite'
        : puedeReclamar
          ? 'cristalPulse 2s infinite ease-in-out'
          : 'none',
    },
    hongo: (left, size, hue) => ({
      position: 'absolute',
      bottom: '0',
      left: left,
      width: `${size}px`,
      height: `${size * 1.2}px`,
      zIndex: 3,
    }),
    hongoTallo: (size) => ({
      position: 'absolute',
      bottom: '0',
      left: '50%',
      transform: 'translateX(-50%)',
      width: `${size * 0.3}px`,
      height: `${size * 0.5}px`,
      background: 'linear-gradient(90deg, #d4c4a8 0%, #e8dcc8 50%, #d4c4a8 100%)',
      borderRadius: '0 0 4px 4px',
    }),
    hongoCapa: (size, hue) => ({
      position: 'absolute',
      bottom: `${size * 0.4}px`,
      left: '50%',
      transform: 'translateX(-50%)',
      width: `${size}px`,
      height: `${size * 0.6}px`,
      background: `linear-gradient(180deg, hsl(${hue}, 70%, 50%) 0%, hsl(${hue}, 60%, 35%) 100%)`,
      borderRadius: '50% 50% 10% 10%',
      boxShadow: `0 0 10px hsla(${hue}, 70%, 50%, 0.3)`,
    }),
    arbol: (left, height) => ({
      position: 'absolute',
      bottom: '0',
      left: left,
      zIndex: 2,
    }),
    arbolTronco: (height) => ({
      width: '12px',
      height: `${height * 0.4}px`,
      background: 'linear-gradient(90deg, #3d2817 0%, #5a3d2b 50%, #3d2817 100%)',
      borderRadius: '2px',
      margin: '0 auto',
    }),
    arbolCopa: (height) => ({
      width: `${height * 0.5}px`,
      height: `${height * 0.7}px`,
      background: 'radial-gradient(ellipse at center, #1a3a1a 0%, #0f2a0f 70%, #0a1a0a 100%)',
      borderRadius: '50% 50% 45% 45%',
      marginBottom: '-5px',
      boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
    }),
    info: {
      position: 'absolute',
      bottom: '12px',
      left: '50%',
      transform: 'translateX(-50%)',
      textAlign: 'center',
      zIndex: 10,
    },
    btnReclamar: {
      background: 'linear-gradient(135deg, #d4af37 0%, #b8972e 100%)',
      color: '#0a0a0a',
      border: 'none',
      padding: '10px 24px',
      borderRadius: '25px',
      fontFamily: "'Cinzel', serif",
      fontSize: '0.9rem',
      fontWeight: '600',
      cursor: 'pointer',
      boxShadow: '0 4px 15px rgba(212,175,55,0.4)',
      transition: 'all 0.3s ease',
    },
    msgReclamado: {
      color: 'rgba(255,255,255,0.6)',
      fontSize: '0.85rem',
      margin: 0,
    },
    // Modal de resultado
    modalOverlay: {
      position: 'fixed',
      inset: 0,
      background: 'rgba(0,0,0,0.85)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px',
    },
    modal: {
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
      borderRadius: '24px',
      padding: '2rem',
      maxWidth: '360px',
      width: '100%',
      textAlign: 'center',
      border: '2px solid rgba(212,175,55,0.4)',
      boxShadow: '0 0 60px rgba(212,175,55,0.2)',
    },
    modalTitulo: {
      fontFamily: "'Cinzel', serif",
      fontSize: '1.5rem',
      color: '#d4af37',
      marginBottom: '1rem',
    },
    recompensas: {
      display: 'flex',
      justifyContent: 'center',
      gap: '2rem',
      marginBottom: '1rem',
    },
    recompensa: {
      textAlign: 'center',
    },
    recompensaValor: {
      display: 'block',
      fontSize: '1.8rem',
      fontWeight: 'bold',
      color: '#d4af37',
    },
    recompensaLabel: {
      fontSize: '0.8rem',
      color: 'rgba(255,255,255,0.6)',
    },
    bonusBox: {
      background: 'rgba(255,100,50,0.1)',
      border: '1px solid rgba(255,100,50,0.3)',
      borderRadius: '12px',
      padding: '0.75rem',
      marginBottom: '1rem',
    },
    btnCerrar: {
      background: 'linear-gradient(135deg, #d4af37 0%, #b8972e 100%)',
      color: '#0a0a0a',
      border: 'none',
      padding: '12px 32px',
      borderRadius: '25px',
      fontFamily: "'Cinzel', serif",
      fontSize: '1rem',
      fontWeight: '600',
      cursor: 'pointer',
      marginTop: '1rem',
    },
    rachaInfo: {
      marginTop: '1rem',
      padding: '0.75rem',
      background: 'rgba(0,0,0,0.3)',
      borderRadius: '12px',
    },
    rachaBar: {
      height: '6px',
      background: 'rgba(255,255,255,0.1)',
      borderRadius: '3px',
      overflow: 'hidden',
      marginBottom: '0.5rem',
    },
    rachaProgress: {
      height: '100%',
      background: 'linear-gradient(90deg, #ff6b35, #f7931e)',
      borderRadius: '3px',
      transition: 'width 0.5s ease',
    },
    rachaHitos: {
      display: 'flex',
      justifyContent: 'space-between',
      fontSize: '0.75rem',
      color: 'rgba(255,255,255,0.4)',
    },
    rachaHitoActivo: {
      color: '#f7931e',
    },
  };

  if (cargando) {
    return (
      <div style={styles.container}>
        <div style={{...styles.jardin, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <div style={{color: '#d4af37'}}>Cargando jardín...</div>
        </div>
      </div>
    );
  }

  if (error || !gamificacion) {
    return (
      <div style={styles.container}>
        <div style={{...styles.jardin, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem'}}>
          <p style={{color: '#ff6b6b', margin: 0}}>{error || 'No se pudo cargar'}</p>
          <button style={styles.btnReclamar} onClick={cargarGamificacion}>Reintentar</button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <style>{`
        @keyframes cristalPulse {
          0%, 100% { transform: translateX(-50%) scale(1); filter: brightness(1) drop-shadow(0 0 20px rgba(180,130,255,0.6)); }
          50% { transform: translateX(-50%) scale(1.08); filter: brightness(1.3) drop-shadow(0 0 35px rgba(180,130,255,0.8)); }
        }
        @keyframes cristalShake {
          0%, 100% { transform: translateX(-50%) rotate(0deg); }
          25% { transform: translateX(calc(-50% - 4px)) rotate(-3deg); }
          75% { transform: translateX(calc(-50% + 4px)) rotate(3deg); }
        }
        @keyframes cristalGlow {
          from { filter: drop-shadow(0 0 20px rgba(180,130,255,0.6)) drop-shadow(0 0 40px rgba(180,130,255,0.3)); }
          to { filter: drop-shadow(0 0 30px rgba(255,200,100,0.8)) drop-shadow(0 0 60px rgba(255,200,100,0.5)); }
        }
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        @keyframes firefly {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.9; }
        }
        @keyframes fireflyMove {
          0% { transform: translate(0, 0); }
          25% { transform: translate(10px, -15px); }
          50% { transform: translate(-5px, -25px); }
          75% { transform: translate(-15px, -10px); }
          100% { transform: translate(0, 0); }
        }
        @keyframes particleRise {
          0% { opacity: 1; transform: translateY(0) scale(1); }
          100% { opacity: 0; transform: translateY(-60px) scale(0.5); }
        }
      `}</style>

      {/* Modal de resultado */}
      {resultado && !resultado.error && (
        <div style={styles.modalOverlay} onClick={cerrarResultado}>
          <div style={styles.modal} onClick={e => e.stopPropagation()}>
            <div style={{fontSize: '3rem', marginBottom: '0.5rem'}}>✨</div>
            <h3 style={styles.modalTitulo}>¡Magia Recolectada!</h3>
            <div style={styles.recompensas}>
              <div style={styles.recompensa}>
                <span style={styles.recompensaValor}>+{resultado.cofre.runasBase}</span>
                <span style={styles.recompensaLabel}>Runas</span>
              </div>
              <div style={styles.recompensa}>
                <span style={styles.recompensaValor}>+{resultado.cofre.xpBase}</span>
                <span style={styles.recompensaLabel}>XP</span>
              </div>
            </div>
            {resultado.bonusRacha && (
              <div style={styles.bonusBox}>
                <div style={{color: '#ff6b35', fontWeight: 'bold', marginBottom: '0.25rem'}}>
                  🔥 {resultado.bonusRacha.dias} días de racha
                </div>
                <div style={{fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)'}}>
                  {resultado.bonusRacha.runas > 0 && <span>+{resultado.bonusRacha.runas} runas </span>}
                  {resultado.bonusRacha.xp > 0 && <span>+{resultado.bonusRacha.xp} XP</span>}
                </div>
              </div>
            )}
            <div style={{color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem'}}>
              Balance: {resultado.nuevoBalance} runas
            </div>
            <button style={styles.btnCerrar} onClick={cerrarResultado}>¡Genial!</button>
          </div>
        </div>
      )}

      {/* Jardín */}
      <div
        style={styles.jardin}
        onClick={puedeReclamar ? reclamarRecompensa : undefined}
      >
        {/* Header */}
        <div style={styles.header}>
          <InfoTooltip tipo="cofreDiario">
            <h3 style={styles.titulo}>Jardín Encantado</h3>
          </InfoTooltip>
          {racha > 0 && (
            <div style={styles.racha}>
              <span>🔥</span>
              <span style={{color: '#ff6b35'}}>{racha}</span>
            </div>
          )}
        </div>

        {/* Cielo */}
        <div style={styles.cielo}>
          {/* Estrellas */}
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                top: `${Math.random() * 50}%`,
                left: `${Math.random() * 100}%`,
                width: `${2 + Math.random() * 2}px`,
                height: `${2 + Math.random() * 2}px`,
                background: '#fff',
                borderRadius: '50%',
                animation: `twinkle ${2 + Math.random() * 3}s infinite`,
                animationDelay: `${Math.random() * 2}s`,
              }}
            />
          ))}
          {/* Luna */}
          <div style={styles.luna} />
        </div>

        {/* Suelo */}
        <div style={styles.suelo}>
          {/* Hierba decorativa */}
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                bottom: '0',
                left: `${5 + i * 6.5}%`,
                width: '3px',
                height: `${10 + Math.random() * 15}px`,
                background: `linear-gradient(180deg, #3a5a3a 0%, #2a4a2a 100%)`,
                borderRadius: '2px 2px 0 0',
                transform: `rotate(${-10 + Math.random() * 20}deg)`,
              }}
            />
          ))}
        </div>

        {/* Árboles */}
        <div style={styles.arbol('10%', 90)}>
          <div style={styles.arbolCopa(90)} />
          <div style={styles.arbolTronco(90)} />
        </div>
        <div style={styles.arbol('80%', 70)}>
          <div style={styles.arbolCopa(70)} />
          <div style={styles.arbolTronco(70)} />
        </div>

        {/* Hongos */}
        <div style={styles.hongo('20%', 25, 280)}>
          <div style={styles.hongoCapa(25, 280)} />
          <div style={styles.hongoTallo(25)} />
        </div>
        <div style={styles.hongo('70%', 20, 340)}>
          <div style={styles.hongoCapa(20, 340)} />
          <div style={styles.hongoTallo(20)} />
        </div>
        <div style={styles.hongo('85%', 18, 180)}>
          <div style={styles.hongoCapa(18, 180)} />
          <div style={styles.hongoTallo(18)} />
        </div>

        {/* Luciérnagas */}
        {puedeReclamar && [...Array(6)].map((_, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              top: `${30 + Math.random() * 40}%`,
              left: `${10 + Math.random() * 80}%`,
              width: '6px',
              height: '6px',
              background: 'radial-gradient(circle, #ffff88 0%, transparent 70%)',
              borderRadius: '50%',
              boxShadow: '0 0 10px #ffff88, 0 0 20px #ffff44',
              animation: `firefly ${2 + Math.random() * 2}s infinite ease-in-out, fireflyMove ${5 + Math.random() * 5}s infinite ease-in-out`,
              animationDelay: `${Math.random() * 3}s`,
            }}
          />
        ))}

        {/* Cristal central - Cluster de cristales */}
        <div style={styles.cristalContainer}>
          <svg width="100" height="120" viewBox="0 0 100 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Cristal central grande */}
            <polygon
              points="50,5 62,35 62,85 50,115 38,85 38,35"
              fill={puedeReclamar ? "url(#cristalGrad1)" : "#4a4a4a"}
              stroke={puedeReclamar ? "#b8a0ff" : "#666"}
              strokeWidth="1"
            />
            <polygon
              points="50,5 62,35 50,40 38,35"
              fill={puedeReclamar ? "rgba(220,200,255,0.4)" : "rgba(150,150,150,0.3)"}
            />
            <polygon
              points="38,35 50,40 50,115 38,85"
              fill={puedeReclamar ? "rgba(100,60,180,0.6)" : "rgba(60,60,60,0.6)"}
            />

            {/* Cristal izquierdo medio */}
            <polygon
              points="25,30 35,50 35,90 25,105 15,90 15,50"
              fill={puedeReclamar ? "url(#cristalGrad2)" : "#3a3a3a"}
              stroke={puedeReclamar ? "#9080cc" : "#555"}
              strokeWidth="1"
            />
            <polygon
              points="25,30 35,50 25,55 15,50"
              fill={puedeReclamar ? "rgba(200,180,255,0.3)" : "rgba(120,120,120,0.3)"}
            />
            <polygon
              points="15,50 25,55 25,105 15,90"
              fill={puedeReclamar ? "rgba(80,50,150,0.5)" : "rgba(50,50,50,0.5)"}
            />

            {/* Cristal derecho medio */}
            <polygon
              points="75,25 85,48 85,88 75,108 65,88 65,48"
              fill={puedeReclamar ? "url(#cristalGrad2)" : "#3a3a3a"}
              stroke={puedeReclamar ? "#9080cc" : "#555"}
              strokeWidth="1"
            />
            <polygon
              points="75,25 85,48 75,52 65,48"
              fill={puedeReclamar ? "rgba(200,180,255,0.3)" : "rgba(120,120,120,0.3)"}
            />
            <polygon
              points="85,48 75,52 75,108 85,88"
              fill={puedeReclamar ? "rgba(80,50,150,0.5)" : "rgba(50,50,50,0.5)"}
            />

            {/* Cristal pequeño izquierda */}
            <polygon
              points="8,55 14,68 14,95 8,105 2,95 2,68"
              fill={puedeReclamar ? "url(#cristalGrad3)" : "#2a2a2a"}
              stroke={puedeReclamar ? "#7060aa" : "#444"}
              strokeWidth="0.5"
            />
            <polygon
              points="2,68 8,72 8,105 2,95"
              fill={puedeReclamar ? "rgba(70,40,140,0.5)" : "rgba(40,40,40,0.5)"}
            />

            {/* Cristal pequeño derecha */}
            <polygon
              points="92,50 98,65 98,92 92,103 86,92 86,65"
              fill={puedeReclamar ? "url(#cristalGrad3)" : "#2a2a2a"}
              stroke={puedeReclamar ? "#7060aa" : "#444"}
              strokeWidth="0.5"
            />
            <polygon
              points="98,65 92,70 92,103 98,92"
              fill={puedeReclamar ? "rgba(70,40,140,0.5)" : "rgba(40,40,40,0.5)"}
            />

            {/* Cristal diagonal izquierdo */}
            <polygon
              points="20,60 28,72 26,100 18,108 12,98 14,70"
              fill={puedeReclamar ? "url(#cristalGrad2)" : "#333"}
              stroke={puedeReclamar ? "#8070bb" : "#4a4a4a"}
              strokeWidth="0.5"
              transform="rotate(-15, 20, 85)"
            />

            {/* Cristal diagonal derecho */}
            <polygon
              points="80,58 88,70 86,98 78,106 72,96 74,68"
              fill={puedeReclamar ? "url(#cristalGrad2)" : "#333"}
              stroke={puedeReclamar ? "#8070bb" : "#4a4a4a"}
              strokeWidth="0.5"
              transform="rotate(15, 80, 82)"
            />

            {/* Brillos */}
            {puedeReclamar && (
              <>
                <line x1="44" y1="15" x2="44" y2="35" stroke="rgba(255,255,255,0.6)" strokeWidth="2" strokeLinecap="round"/>
                <line x1="22" y1="40" x2="22" y2="55" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" strokeLinecap="round"/>
                <line x1="78" y1="35" x2="78" y2="52" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" strokeLinecap="round"/>
              </>
            )}

            {/* Gradientes */}
            <defs>
              <linearGradient id="cristalGrad1" x1="50%" y1="0%" x2="50%" y2="100%">
                <stop offset="0%" stopColor="#c8b0ff"/>
                <stop offset="50%" stopColor="#9070dd"/>
                <stop offset="100%" stopColor="#6040aa"/>
              </linearGradient>
              <linearGradient id="cristalGrad2" x1="50%" y1="0%" x2="50%" y2="100%">
                <stop offset="0%" stopColor="#b098ee"/>
                <stop offset="50%" stopColor="#8060cc"/>
                <stop offset="100%" stopColor="#503090"/>
              </linearGradient>
              <linearGradient id="cristalGrad3" x1="50%" y1="0%" x2="50%" y2="100%">
                <stop offset="0%" stopColor="#9080dd"/>
                <stop offset="100%" stopColor="#403088"/>
              </linearGradient>
            </defs>
          </svg>

          {/* Partículas cuando está activando */}
          {animacion === 'activando' && [...Array(10)].map((_, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                bottom: '50px',
                left: `${30 + Math.random() * 40}px`,
                width: '6px',
                height: '6px',
                background: i % 2 === 0 ? '#d4af37' : '#b8a0ff',
                borderRadius: '50%',
                animation: 'particleRise 1s infinite',
                animationDelay: `${i * 0.08}s`,
              }}
            />
          ))}
        </div>

        {/* Info */}
        <div style={styles.info}>
          {puedeReclamar ? (
            <button
              style={{
                ...styles.btnReclamar,
                opacity: reclamando ? 0.7 : 1,
              }}
              onClick={(e) => { e.stopPropagation(); reclamarRecompensa(); }}
              disabled={reclamando}
            >
              {reclamando ? '✨ Recolectando...' : '✨ Tocar el Cristal'}
            </button>
          ) : (
            <p style={styles.msgReclamado}>Volvé mañana por más magia ✨</p>
          )}
        </div>

        {/* Bonus próximo */}
        {diasParaBonus && diasParaBonus <= 7 && (
          <div style={{
            position: 'absolute',
            bottom: '45px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(0,0,0,0.6)',
            padding: '4px 12px',
            borderRadius: '20px',
            fontSize: '0.75rem',
            color: '#f7931e',
            whiteSpace: 'nowrap',
          }}>
            🎁 {diasParaBonus === 1 ? '¡Mañana bonus!' : `${diasParaBonus} días para bonus`}
          </div>
        )}
      </div>

      {/* Racha info */}
      {racha > 1 && (
        <div style={styles.rachaInfo}>
          <div style={styles.rachaBar}>
            <div style={{...styles.rachaProgress, width: `${Math.min((racha / 30) * 100, 100)}%`}} />
          </div>
          <div style={styles.rachaHitos}>
            <span style={racha >= 7 ? styles.rachaHitoActivo : {}}>7🔥</span>
            <span style={racha >= 14 ? styles.rachaHitoActivo : {}}>14🔥</span>
            <span style={racha >= 30 ? styles.rachaHitoActivo : {}}>30🔥</span>
          </div>
        </div>
      )}
    </div>
  );
}
