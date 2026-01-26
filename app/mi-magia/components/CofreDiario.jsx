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
      bottom: '60px',
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 5,
    },
    cristal: {
      width: '60px',
      height: '80px',
      background: puedeReclamar
        ? 'linear-gradient(180deg, rgba(180,130,255,0.9) 0%, rgba(130,80,200,0.9) 50%, rgba(100,60,180,0.9) 100%)'
        : 'linear-gradient(180deg, rgba(100,100,100,0.7) 0%, rgba(70,70,70,0.7) 100%)',
      clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
      boxShadow: puedeReclamar
        ? '0 0 40px rgba(180,130,255,0.6), 0 0 80px rgba(180,130,255,0.3), inset 0 0 20px rgba(255,255,255,0.3)'
        : '0 0 10px rgba(100,100,100,0.3)',
      animation: animacion === 'activando'
        ? 'cristalShake 0.1s infinite, cristalGlow 0.5s infinite alternate'
        : puedeReclamar
          ? 'cristalPulse 2s infinite ease-in-out'
          : 'none',
      transition: 'all 0.3s ease',
    },
    cristalBrillo: {
      position: 'absolute',
      top: '10px',
      left: '15px',
      width: '8px',
      height: '20px',
      background: 'rgba(255,255,255,0.6)',
      borderRadius: '4px',
      transform: 'rotate(-20deg)',
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
          0%, 100% { transform: scale(1); filter: brightness(1); }
          50% { transform: scale(1.05); filter: brightness(1.2); }
        }
        @keyframes cristalShake {
          0%, 100% { transform: translateX(0) rotate(0deg); }
          25% { transform: translateX(-3px) rotate(-2deg); }
          75% { transform: translateX(3px) rotate(2deg); }
        }
        @keyframes cristalGlow {
          from { box-shadow: 0 0 40px rgba(180,130,255,0.6), 0 0 80px rgba(180,130,255,0.3); }
          to { box-shadow: 0 0 60px rgba(255,200,100,0.8), 0 0 120px rgba(255,200,100,0.4); }
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

        {/* Cristal central */}
        <div style={styles.cristalContainer}>
          <div style={styles.cristal}>
            <div style={styles.cristalBrillo} />
          </div>
          {/* Partículas cuando está activando */}
          {animacion === 'activando' && [...Array(8)].map((_, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                bottom: '40px',
                left: `${20 + Math.random() * 20}px`,
                width: '8px',
                height: '8px',
                background: '#d4af37',
                borderRadius: '50%',
                animation: 'particleRise 1s infinite',
                animationDelay: `${i * 0.1}s`,
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
