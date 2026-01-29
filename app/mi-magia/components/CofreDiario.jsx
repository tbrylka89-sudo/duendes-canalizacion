'use client';
import { useState, useEffect, useMemo } from 'react';
import { API_BASE } from './constants';
import { InfoTooltip } from './TooltipInfo';

// Mensajes al tocar elementos del jardín
const MENSAJES_JARDIN = {
  arbol: [
    { tipo: 'mistico', texto: '🌳 Los árboles susurran secretos antiguos... pero solo a quienes saben escuchar.' },
    { tipo: 'gracioso', texto: '🌳 "¿Me rascás la corteza?" - pidió el árbol, pero nadie lo escuchó.' },
    { tipo: 'senal', texto: '🌳 Cuando un árbol cruza tu camino... bueno, técnicamente vos cruzaste el suyo.' },
    { tipo: 'mistico', texto: '🌳 Las raíces recuerdan lo que las hojas olvidan.' },
    { tipo: 'gracioso', texto: '🌳 Este árbol tiene más años que tu última relación estable.' },
    { tipo: 'senal', texto: '🌳 Señal: Es momento de echar raíces en algo importante.' },
  ],
  hongo: [
    { tipo: 'mistico', texto: '🍄 Los hongos son los mensajeros del bosque... y este tiene algo que decirte.' },
    { tipo: 'gracioso', texto: '🍄 No, no es ESE tipo de hongo. Pero igual te hace viajar.' },
    { tipo: 'senal', texto: '🍄 Señal: Lo que buscás está más cerca de lo que pensás.' },
    { tipo: 'mistico', texto: '🍄 En la oscuridad, los hongos brillan. Como vos en tus peores días.' },
    { tipo: 'gracioso', texto: '🍄 Fun fact: Los hongos tienen más en común con vos que con las plantas. Piénsalo.' },
    { tipo: 'senal', texto: '🍄 Este hongo creció justo donde hacía falta. Vos también.' },
  ],
  luciernaga: [
    { tipo: 'mistico', texto: '✨ Las luciérnagas son almas que eligieron seguir brillando.' },
    { tipo: 'gracioso', texto: '✨ Esta luciérnaga cobra por hora. Aceptá que la magia tiene costos operativos.' },
    { tipo: 'senal', texto: '✨ Señal: Tu luz interior está más fuerte de lo que creés.' },
    { tipo: 'mistico', texto: '✨ Cada destello es un deseo que alguien pidió. ¿Cuál es el tuyo?' },
    { tipo: 'gracioso', texto: '✨ POV: Sos una luciérnaga presumiendo tu LED natural.' },
    { tipo: 'senal', texto: '✨ Alguien está pensando en vos en este momento. La luciérnaga lo confirma.' },
  ],
  luna: [
    { tipo: 'mistico', texto: '🌙 La luna ve todo. Y te guiña un ojo cómplice.' },
    { tipo: 'gracioso', texto: '🌙 La luna: literalmente una roca flotante que controla los océanos y tu humor.' },
    { tipo: 'senal', texto: '🌙 Señal: Lo que sembraste en luna nueva está por florecer.' },
    { tipo: 'mistico', texto: '🌙 Cada fase lunar es un recordatorio: todo cambia, incluso vos.' },
  ],
  sol: [
    { tipo: 'mistico', texto: '☀️ El sol no pide permiso para brillar. Vos tampoco deberías.' },
    { tipo: 'gracioso', texto: '☀️ El sol: quemándote mientras te da vitamina D. Relación tóxica pero necesaria.' },
    { tipo: 'senal', texto: '☀️ Señal: Hoy es un buen día para empezar eso que venís postergando.' },
    { tipo: 'mistico', texto: '☀️ Cada amanecer es el universo diciendo: "Dale, otra oportunidad".' },
  ],
  estrella: [
    { tipo: 'mistico', texto: '⭐ Esa estrella brilló hace millones de años solo para que vos la vieras ahora.' },
    { tipo: 'gracioso', texto: '⭐ Las estrellas: básicamente chismes del universo que llegan con delay.' },
    { tipo: 'senal', texto: '⭐ Señal: Pedí un deseo. Rápido. No, ya pasó. Bueno, la próxima.' },
    { tipo: 'mistico', texto: '⭐ Tu nombre está escrito en una constelación que todavía no descubrieron.' },
  ],
  nube: [
    { tipo: 'mistico', texto: '☁️ Las nubes son pensamientos del cielo. Este parece un buen día.' },
    { tipo: 'gracioso', texto: '☁️ Esa nube tiene forma de... nube. Profundo, ¿no?' },
    { tipo: 'senal', texto: '☁️ Señal: Dejá ir lo que no podés controlar. Como las nubes, que se van solas.' },
  ],
  pajaro: [
    { tipo: 'mistico', texto: '🐦 Los pájaros llevan mensajes entre mundos. Este trae uno para vos.' },
    { tipo: 'gracioso', texto: '🐦 Este pájaro está juzgando tu outfit. No te lo tomes personal.' },
    { tipo: 'senal', texto: '🐦 Señal: Libertad. Es hora de soltar algo que te ata.' },
  ],
};

const getMensajeRandom = (tipo) => {
  const mensajes = MENSAJES_JARDIN[tipo];
  if (!mensajes) return null;
  return mensajes[Math.floor(Math.random() * mensajes.length)];
};

export default function JardinEncantado({ usuario, token, onRunasGanadas }) {
  const [gamificacion, setGamificacion] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [reclamando, setReclamando] = useState(false);
  const [resultado, setResultado] = useState(null);
  const [animacion, setAnimacion] = useState('idle');
  const [hora, setHora] = useState(12); // Default a mediodía para SSR
  const [mensajeElemento, setMensajeElemento] = useState(null); // Mensaje al tocar elementos

  // Setear hora real solo en cliente
  useEffect(() => {
    setHora(new Date().getHours());
    const interval = setInterval(() => {
      setHora(new Date().getHours());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  // Determinar momento del día
  const momentoDia = useMemo(() => {
    if (hora >= 6 && hora < 9) return 'amanecer';
    if (hora >= 9 && hora < 18) return 'dia';
    if (hora >= 18 && hora < 21) return 'atardecer';
    return 'noche';
  }, [hora]);

  const esDeNoche = momentoDia === 'noche';
  const esDeDia = momentoDia === 'dia';

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

  // Handler para tocar elementos del jardín
  const tocarElemento = (tipo, e) => {
    e?.stopPropagation();
    const mensaje = getMensajeRandom(tipo);
    if (mensaje) {
      setMensajeElemento(mensaje);
      setTimeout(() => setMensajeElemento(null), 4000);
    }
  };

  const puedeReclamar = gamificacion?.puedeReclamarCofre;
  const racha = gamificacion?.racha || 0;
  const diasParaBonus = gamificacion?.diasParaBonus;

  // Generar posiciones estables para elementos (ANTES de cualquier return condicional)
  const estrellas = useMemo(() =>
    [...Array(25)].map((_, i) => ({
      top: `${5 + (i * 7) % 45}%`,
      left: `${3 + (i * 13) % 94}%`,
      size: 1.5 + (i % 3),
      delay: (i * 0.3) % 4,
      duration: 2 + (i % 3),
    })), []);

  const luciernagas = useMemo(() =>
    [...Array(10)].map((_, i) => ({
      top: `${25 + (i * 11) % 45}%`,
      left: `${8 + (i * 17) % 84}%`,
      delay: (i * 0.5) % 5,
      moveDuration: 6 + (i % 5),
    })), []);

  const hierbas = useMemo(() =>
    [...Array(20)].map((_, i) => ({
      left: `${2 + i * 5}%`,
      height: 8 + (i % 4) * 5,
      rotation: -12 + (i % 5) * 6,
      delay: (i * 0.1) % 2,
    })), []);

  const nubes = useMemo(() => [
    { top: '10%', duration: 60, delay: 0, size: 1 },
    { top: '25%', duration: 80, delay: 20, size: 0.7 },
    { top: '5%', duration: 100, delay: 40, size: 0.5 },
  ], []);

  // Colores según momento del día
  const coloresCielo = {
    noche: 'linear-gradient(180deg, #0a0a1a 0%, #1a1a3a 50%, #2a2a4a 100%)',
    amanecer: 'linear-gradient(180deg, #1a1a3a 0%, #4a3060 30%, #d4785a 70%, #f4a460 100%)',
    dia: 'linear-gradient(180deg, #4a90c2 0%, #87ceeb 50%, #b0e0e6 100%)',
    atardecer: 'linear-gradient(180deg, #2a2a4a 0%, #8b4060 40%, #e07050 70%, #f4a460 100%)',
  };

  const coloresSuelo = {
    noche: 'linear-gradient(180deg, #1a2a1a 0%, #0f1a0f 100%)',
    amanecer: 'linear-gradient(180deg, #2a3a2a 0%, #1a2a1a 100%)',
    dia: 'linear-gradient(180deg, #3a5a3a 0%, #2a4a2a 100%)',
    atardecer: 'linear-gradient(180deg, #2a3a2a 0%, #1a2a1a 100%)',
  };

  // Colores de amatista real
  const amatista = {
    claro: '#E6B8FF',      // Lavanda claro
    medio: '#9966CC',       // Amatista clásico
    principal: '#7B68EE',   // Medium slate blue
    oscuro: '#6A0DAD',      // Púrpura profundo
    profundo: '#4B0082',    // Indigo
    brillante: '#DA70D6',   // Orchid (para highlights)
  };

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
      background: coloresCielo[momentoDia],
      border: puedeReclamar ? '2px solid rgba(155,89,182,0.6)' : '2px solid rgba(100,100,100,0.3)',
      boxShadow: puedeReclamar ? '0 0 30px rgba(155,89,182,0.3)' : 'none',
      cursor: puedeReclamar ? 'pointer' : 'default',
      transition: 'background 2s ease',
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
    suelo: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      height: '40%',
      background: coloresSuelo[momentoDia],
      borderTop: esDeDia ? '3px solid #4a6a4a' : '2px solid #2a3a2a',
      transition: 'background 2s ease',
    },
    cristalContainer: {
      position: 'absolute',
      bottom: '50px',
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 5,
      filter: puedeReclamar
        ? `drop-shadow(0 0 25px ${amatista.medio}) drop-shadow(0 0 50px ${amatista.oscuro})`
        : 'drop-shadow(0 0 5px rgba(100,100,100,0.3))',
      animation: animacion === 'activando'
        ? 'cristalShake 0.1s infinite'
        : puedeReclamar
          ? 'cristalFloat 3s infinite ease-in-out'
          : 'none',
    },
    info: {
      position: 'absolute',
      bottom: '8px',
      left: '50%',
      transform: 'translateX(-50%)',
      textAlign: 'center',
      zIndex: 10,
    },
    btnReclamar: {
      background: `linear-gradient(135deg, ${amatista.brillante} 0%, ${amatista.medio} 50%, ${amatista.oscuro} 100%)`,
      color: '#fff',
      border: 'none',
      padding: '10px 24px',
      borderRadius: '25px',
      fontFamily: "'Cinzel', serif",
      fontSize: '0.9rem',
      fontWeight: '600',
      cursor: 'pointer',
      boxShadow: `0 4px 20px ${amatista.medio}80`,
      transition: 'all 0.3s ease',
      textShadow: '0 1px 2px rgba(0,0,0,0.3)',
    },
    msgReclamado: {
      color: 'rgba(255,255,255,0.7)',
      fontSize: '0.85rem',
      margin: 0,
      textShadow: '0 1px 3px rgba(0,0,0,0.5)',
    },
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
      background: `linear-gradient(135deg, #1a1a2e 0%, ${amatista.profundo}40 100%)`,
      borderRadius: '24px',
      padding: '2rem',
      maxWidth: '360px',
      width: '100%',
      textAlign: 'center',
      border: `2px solid ${amatista.medio}60`,
      boxShadow: `0 0 60px ${amatista.oscuro}40`,
    },
    modalTitulo: {
      fontFamily: "'Cinzel', serif",
      fontSize: '1.5rem',
      color: amatista.brillante,
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
      color: amatista.claro,
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
      background: `linear-gradient(135deg, ${amatista.brillante} 0%, ${amatista.medio} 100%)`,
      color: '#fff',
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
      background: `linear-gradient(90deg, ${amatista.brillante}, ${amatista.medio})`,
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
      color: amatista.brillante,
    },
  };

  if (cargando) {
    return (
      <div style={styles.container}>
        <div style={{...styles.jardin, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <div style={{color: amatista.claro}}>Cargando jardín...</div>
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
        @keyframes cristalFloat {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50% { transform: translateX(-50%) translateY(-8px); }
        }
        @keyframes cristalShake {
          0%, 100% { transform: translateX(-50%) rotate(0deg); }
          25% { transform: translateX(calc(-50% - 5px)) rotate(-4deg); }
          75% { transform: translateX(calc(-50% + 5px)) rotate(4deg); }
        }
        @keyframes cristalGlow {
          0%, 100% { filter: drop-shadow(0 0 20px ${amatista.medio}) brightness(1); }
          50% { filter: drop-shadow(0 0 40px ${amatista.brillante}) brightness(1.3); }
        }
        @keyframes twinkle {
          0%, 100% { opacity: 0.2; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.3); }
        }
        @keyframes firefly {
          0%, 100% { opacity: 0.1; }
          50% { opacity: 1; }
        }
        @keyframes fireflyMove {
          0% { transform: translate(0, 0); }
          20% { transform: translate(15px, -20px); }
          40% { transform: translate(-10px, -35px); }
          60% { transform: translate(-20px, -15px); }
          80% { transform: translate(5px, -5px); }
          100% { transform: translate(0, 0); }
        }
        @keyframes particleRise {
          0% { opacity: 1; transform: translateY(0) scale(1); }
          100% { opacity: 0; transform: translateY(-80px) scale(0.3); }
        }
        @keyframes sway {
          0%, 100% { transform: rotate(var(--base-rotation)); }
          50% { transform: rotate(calc(var(--base-rotation) + 8deg)); }
        }
        @keyframes cloudMove {
          0% { transform: translateX(-150px); }
          100% { transform: translateX(calc(100vw + 150px)); }
        }
        @keyframes birdFly {
          0% { transform: translateX(-50px) translateY(0); }
          25% { transform: translateX(25vw) translateY(-10px); }
          50% { transform: translateX(50vw) translateY(5px); }
          75% { transform: translateX(75vw) translateY(-8px); }
          100% { transform: translateX(calc(100vw + 50px)) translateY(0); }
        }
        @keyframes innerGlow {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.8; }
        }
        @keyframes fadeInOut {
          0% { opacity: 0; transform: translateX(-50%) translateY(-10px); }
          15% { opacity: 1; transform: translateX(-50%) translateY(0); }
          85% { opacity: 1; transform: translateX(-50%) translateY(0); }
          100% { opacity: 0; transform: translateX(-50%) translateY(-10px); }
        }
        @keyframes mushroomBounce {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50% { transform: translateX(-50%) translateY(-6px); }
        }
        @keyframes mushroomGlow {
          0%, 100% { filter: drop-shadow(0 0 15px rgba(255,100,150,0.5)); }
          50% { filter: drop-shadow(0 0 30px rgba(255,150,200,0.8)); }
        }
        @keyframes elementFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>

      {/* Toast mensaje de elemento */}
      {mensajeElemento && (
        <div style={{
          position: 'absolute',
          top: '50px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: mensajeElemento.tipo === 'gracioso'
            ? 'linear-gradient(135deg, rgba(255,200,100,0.95) 0%, rgba(255,150,50,0.95) 100%)'
            : mensajeElemento.tipo === 'senal'
              ? 'linear-gradient(135deg, rgba(100,200,255,0.95) 0%, rgba(50,150,255,0.95) 100%)'
              : 'linear-gradient(135deg, rgba(150,100,200,0.95) 0%, rgba(100,50,150,0.95) 100%)',
          color: '#fff',
          padding: '12px 20px',
          borderRadius: '16px',
          fontSize: '0.85rem',
          maxWidth: '90%',
          textAlign: 'center',
          zIndex: 100,
          boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
          animation: 'fadeInOut 4s ease-in-out',
          lineHeight: 1.4,
        }}>
          {mensajeElemento.texto}
        </div>
      )}

      {/* Modal de resultado */}
      {resultado && !resultado.error && (
        <div style={styles.modalOverlay} onClick={cerrarResultado}>
          <div style={styles.modal} onClick={e => e.stopPropagation()}>
            <div style={{fontSize: '3rem', marginBottom: '0.5rem'}}>💎</div>
            <h3 style={styles.modalTitulo}>¡Magia de Amatista!</h3>
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
      <div style={styles.jardin}>
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

        {/* Cielo - Estrellas (noche y amanecer/atardecer) */}
        {(esDeNoche || momentoDia === 'amanecer' || momentoDia === 'atardecer') && estrellas.map((star, i) => (
          <div
            key={`star-${i}`}
            onClick={(e) => tocarElemento('estrella', e)}
            style={{
              position: 'absolute',
              top: star.top,
              left: star.left,
              width: `${star.size * 3}px`,
              height: `${star.size * 3}px`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              zIndex: 1,
            }}
          >
            <div style={{
              width: `${star.size}px`,
              height: `${star.size}px`,
              background: '#fff',
              borderRadius: '50%',
              opacity: momentoDia === 'noche' ? 1 : 0.5,
              animation: `twinkle ${star.duration}s infinite`,
              animationDelay: `${star.delay}s`,
            }} />
          </div>
        ))}

        {/* Sol (día) - clickeable */}
        {esDeDia && (
          <div
            onClick={(e) => tocarElemento('sol', e)}
            style={{
              position: 'absolute',
              top: '15px',
              right: '25px',
              width: '50px',
              height: '50px',
              borderRadius: '50%',
              background: 'radial-gradient(circle at 30% 30%, #fff5d4, #ffd700, #ffa500)',
              boxShadow: '0 0 40px rgba(255,215,0,0.8), 0 0 80px rgba(255,165,0,0.5)',
              zIndex: 2,
              cursor: 'pointer',
            }}
          />
        )}

        {/* Luna (noche) - clickeable */}
        {esDeNoche && (
          <div
            onClick={(e) => tocarElemento('luna', e)}
            style={{
              position: 'absolute',
              top: '15px',
              right: '25px',
              width: '45px',
              height: '45px',
              borderRadius: '50%',
              background: 'radial-gradient(circle at 25% 25%, #fffef0, #f5f5dc, #e6e6b8)',
              boxShadow: '0 0 30px rgba(255,255,240,0.6), 0 0 60px rgba(255,255,200,0.3)',
              zIndex: 2,
              cursor: 'pointer',
            }}
          >
            {/* Cráteres de la luna */}
            <div style={{
              position: 'absolute',
              top: '12px',
              left: '15px',
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: 'rgba(200,200,180,0.4)',
            }} />
            <div style={{
              position: 'absolute',
              top: '25px',
              left: '25px',
              width: '5px',
              height: '5px',
              borderRadius: '50%',
              background: 'rgba(200,200,180,0.3)',
            }} />
          </div>
        )}

        {/* Nubes (día) - clickeables */}
        {esDeDia && nubes.map((cloud, i) => (
          <div
            key={`cloud-${i}`}
            onClick={(e) => tocarElemento('nube', e)}
            style={{
              position: 'absolute',
              top: cloud.top,
              left: 0,
              width: `${80 * cloud.size}px`,
              height: `${30 * cloud.size}px`,
              animation: `cloudMove ${cloud.duration}s linear infinite`,
              animationDelay: `${cloud.delay}s`,
              zIndex: 1,
              cursor: 'pointer',
            }}
          >
            <div style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              background: 'rgba(255,255,255,0.8)',
              borderRadius: '50px',
              filter: 'blur(3px)',
            }} />
            <div style={{
              position: 'absolute',
              top: '-40%',
              left: '20%',
              width: '60%',
              height: '80%',
              background: 'rgba(255,255,255,0.8)',
              borderRadius: '50%',
              filter: 'blur(3px)',
            }} />
          </div>
        ))}

        {/* Pájaros (día) - clickeables */}
        {esDeDia && [0, 1].map(i => (
          <div
            key={`bird-${i}`}
            onClick={(e) => tocarElemento('pajaro', e)}
            style={{
              position: 'absolute',
              top: `${15 + i * 20}%`,
              animation: `birdFly ${15 + i * 5}s linear infinite`,
              animationDelay: `${i * 8}s`,
              zIndex: 3,
              fontSize: '12px',
              cursor: 'pointer',
              padding: '10px',
            }}
          >
            🐦
          </div>
        ))}

        {/* Suelo */}
        <div style={styles.suelo}>
          {/* Hierba animada */}
          {hierbas.map((grass, i) => (
            <div
              key={`grass-${i}`}
              style={{
                position: 'absolute',
                bottom: '0',
                left: grass.left,
                width: '3px',
                height: `${grass.height}px`,
                background: esDeDia
                  ? 'linear-gradient(180deg, #5a8a5a 0%, #3a6a3a 100%)'
                  : 'linear-gradient(180deg, #3a5a3a 0%, #2a4a2a 100%)',
                borderRadius: '2px 2px 0 0',
                transformOrigin: 'bottom center',
                '--base-rotation': `${grass.rotation}deg`,
                animation: `sway 3s infinite ease-in-out`,
                animationDelay: `${grass.delay}s`,
              }}
            />
          ))}
        </div>

        {/* Árboles - clickeables */}
        {[
          { left: '8%', height: 95, delay: 0 },
          { left: '85%', height: 75, delay: 0.5 },
        ].map((tree, i) => (
          <div
            key={`tree-${i}`}
            onClick={(e) => tocarElemento('arbol', e)}
            style={{
              position: 'absolute',
              bottom: '0',
              left: tree.left,
              zIndex: 2,
              transformOrigin: 'bottom center',
              animation: 'sway 5s infinite ease-in-out',
              animationDelay: `${tree.delay}s`,
              '--base-rotation': '0deg',
              cursor: 'pointer',
            }}
          >
            <div style={{
              width: `${tree.height * 0.55}px`,
              height: `${tree.height * 0.75}px`,
              background: esDeDia
                ? 'radial-gradient(ellipse at center, #2a5a2a 0%, #1a4a1a 60%, #0f3a0f 100%)'
                : 'radial-gradient(ellipse at center, #1a3a1a 0%, #0f2a0f 70%, #0a1a0a 100%)',
              borderRadius: '50% 50% 45% 45%',
              marginBottom: '-5px',
              boxShadow: '0 5px 20px rgba(0,0,0,0.4)',
            }} />
            <div style={{
              width: '14px',
              height: `${tree.height * 0.4}px`,
              background: 'linear-gradient(90deg, #3d2817 0%, #5a3d2b 50%, #3d2817 100%)',
              borderRadius: '2px',
              margin: '0 auto',
            }} />
          </div>
        ))}

        {/* Hongos - clickeables */}
        {[
          { left: '18%', size: 28, hue: 290 },
          { left: '72%', size: 22, hue: 350 },
          { left: '88%', size: 20, hue: 180 },
        ].map((mushroom, i) => (
          <div
            key={`mushroom-${i}`}
            onClick={(e) => tocarElemento('hongo', e)}
            style={{
              position: 'absolute',
              bottom: '0',
              left: mushroom.left,
              width: `${mushroom.size}px`,
              height: `${mushroom.size * 1.2}px`,
              zIndex: 3,
              cursor: 'pointer',
            }}
          >
            <div style={{
              position: 'absolute',
              bottom: `${mushroom.size * 0.4}px`,
              left: '50%',
              transform: 'translateX(-50%)',
              width: `${mushroom.size}px`,
              height: `${mushroom.size * 0.65}px`,
              background: `linear-gradient(180deg, hsl(${mushroom.hue}, 75%, ${esDeDia ? 55 : 45}%) 0%, hsl(${mushroom.hue}, 65%, ${esDeDia ? 35 : 25}%) 100%)`,
              borderRadius: '50% 50% 10% 10%',
              boxShadow: `0 0 ${puedeReclamar ? 15 : 8}px hsla(${mushroom.hue}, 70%, 50%, ${puedeReclamar ? 0.5 : 0.2})`,
            }} />
            <div style={{
              position: 'absolute',
              bottom: '0',
              left: '50%',
              transform: 'translateX(-50%)',
              width: `${mushroom.size * 0.3}px`,
              height: `${mushroom.size * 0.5}px`,
              background: 'linear-gradient(90deg, #d4c4a8 0%, #e8dcc8 50%, #d4c4a8 100%)',
              borderRadius: '0 0 4px 4px',
            }} />
          </div>
        ))}

        {/* Luciérnagas (noche y atardecer) - clickeables */}
        {(esDeNoche || momentoDia === 'atardecer') && luciernagas.map((fly, i) => (
          <div
            key={`firefly-${i}`}
            onClick={(e) => tocarElemento('luciernaga', e)}
            style={{
              position: 'absolute',
              top: fly.top,
              left: fly.left,
              width: '20px',
              height: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              zIndex: 4,
            }}
          >
            <div style={{
              width: '8px',
              height: '8px',
              background: `radial-gradient(circle, ${puedeReclamar ? amatista.claro : '#ffff88'} 0%, transparent 70%)`,
              borderRadius: '50%',
              boxShadow: `0 0 12px ${puedeReclamar ? amatista.claro : '#ffff88'}, 0 0 25px ${puedeReclamar ? amatista.medio : '#ffff44'}`,
              animation: `firefly 2s infinite ease-in-out, fireflyMove ${fly.moveDuration}s infinite ease-in-out`,
              animationDelay: `${fly.delay}s`,
            }} />
          </div>
        ))}

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* TRES OPCIONES MÁGICAS - Cristal, Hongo, Trébol */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        <div style={{
          position: 'absolute',
          bottom: '45px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: '20px',
          alignItems: 'flex-end',
          zIndex: 5,
        }}>
          {/* CRISTAL DE AMATISTA */}
          <div
            onClick={(e) => { e.stopPropagation(); if (puedeReclamar && !reclamando) reclamarRecompensa(); }}
            style={{
              cursor: puedeReclamar ? 'pointer' : 'default',
              transition: 'transform 0.3s ease',
              filter: `drop-shadow(0 0 15px ${amatista.medio}80)`,
              animation: puedeReclamar ? 'elementFloat 3s infinite ease-in-out' : 'none',
            }}
          >
            <svg width="55" height="75" viewBox="0 0 55 75" fill="none">
              <polygon points="27,2 40,20 40,55 27,72 14,55 14,20" fill="url(#cristalGrad)" stroke={amatista.claro} strokeWidth="1"/>
              <polygon points="27,2 40,20 27,25 14,20" fill={`${amatista.claro}90`}/>
              <polygon points="14,20 27,25 27,72 14,55" fill={`${amatista.profundo}99`}/>
              {puedeReclamar && <polygon points="27,12 32,25 27,60 22,25" fill="rgba(255,255,255,0.4)"><animate attributeName="opacity" values="0.2;0.6;0.2" dur="2s" repeatCount="indefinite"/></polygon>}
              <defs>
                <linearGradient id="cristalGrad" x1="50%" y1="0%" x2="50%" y2="100%">
                  <stop offset="0%" stopColor={amatista.claro}/><stop offset="50%" stopColor={amatista.medio}/><stop offset="100%" stopColor={amatista.profundo}/>
                </linearGradient>
              </defs>
            </svg>
            <div style={{textAlign: 'center', fontSize: '0.7rem', color: '#fff', marginTop: '4px', textShadow: '0 1px 3px rgba(0,0,0,0.8)'}}>Cristal</div>
          </div>

          {/* HONGO MÁGICO */}
          <div
            onClick={(e) => { e.stopPropagation(); if (puedeReclamar && !reclamando) reclamarRecompensa(); }}
            style={{
              cursor: puedeReclamar ? 'pointer' : 'default',
              transition: 'transform 0.3s ease',
              filter: 'drop-shadow(0 0 15px rgba(255,100,150,0.6))',
              animation: puedeReclamar ? 'elementFloat 3s infinite ease-in-out 0.5s' : 'none',
            }}
          >
            <svg width="60" height="80" viewBox="0 0 60 80" fill="none">
              {/* Sombrero del hongo */}
              <ellipse cx="30" cy="35" rx="28" ry="22" fill="url(#hongoCapGrad)"/>
              <ellipse cx="30" cy="32" rx="24" ry="18" fill="url(#hongoCapTop)"/>
              {/* Manchas del hongo */}
              <ellipse cx="20" cy="28" rx="5" ry="4" fill="rgba(255,255,255,0.85)"/>
              <ellipse cx="38" cy="32" rx="6" ry="4.5" fill="rgba(255,255,255,0.85)"/>
              <ellipse cx="28" cy="40" rx="4" ry="3" fill="rgba(255,255,255,0.7)"/>
              <ellipse cx="42" cy="24" rx="3" ry="2.5" fill="rgba(255,255,255,0.6)"/>
              {/* Tallo */}
              <path d="M22 50 Q20 65 23 78 L37 78 Q40 65 38 50 Z" fill="url(#hongoStemGrad)"/>
              <path d="M24 50 Q23 60 25 70" stroke="rgba(200,180,160,0.5)" strokeWidth="2" fill="none"/>
              {/* Brillo */}
              {puedeReclamar && <ellipse cx="18" cy="26" rx="3" ry="2" fill="rgba(255,255,255,0.8)"><animate attributeName="opacity" values="0.5;1;0.5" dur="2s" repeatCount="indefinite"/></ellipse>}
              <defs>
                <linearGradient id="hongoCapGrad" x1="50%" y1="0%" x2="50%" y2="100%">
                  <stop offset="0%" stopColor="#ff6b8a"/><stop offset="50%" stopColor="#e84a6f"/><stop offset="100%" stopColor="#c23a5a"/>
                </linearGradient>
                <radialGradient id="hongoCapTop" cx="40%" cy="30%">
                  <stop offset="0%" stopColor="#ff8fa8"/><stop offset="100%" stopColor="#e84a6f"/>
                </radialGradient>
                <linearGradient id="hongoStemGrad" x1="50%" y1="0%" x2="50%" y2="100%">
                  <stop offset="0%" stopColor="#f5e6d3"/><stop offset="100%" stopColor="#d4c4a8"/>
                </linearGradient>
              </defs>
            </svg>
            <div style={{textAlign: 'center', fontSize: '0.7rem', color: '#fff', marginTop: '4px', textShadow: '0 1px 3px rgba(0,0,0,0.8)'}}>Hongo</div>
          </div>

          {/* TRÉBOL DE 4 HOJAS */}
          <div
            onClick={(e) => { e.stopPropagation(); if (puedeReclamar && !reclamando) reclamarRecompensa(); }}
            style={{
              cursor: puedeReclamar ? 'pointer' : 'default',
              transition: 'transform 0.3s ease',
              filter: 'drop-shadow(0 0 15px rgba(100,200,100,0.6))',
              animation: puedeReclamar ? 'elementFloat 3s infinite ease-in-out 1s' : 'none',
            }}
          >
            <svg width="60" height="75" viewBox="0 0 60 75" fill="none">
              {/* 4 hojas del trébol */}
              <ellipse cx="30" cy="18" rx="12" ry="14" fill="url(#trebolGrad)" transform="rotate(0, 30, 30)"/>
              <ellipse cx="42" cy="30" rx="12" ry="14" fill="url(#trebolGrad)" transform="rotate(90, 42, 30)"/>
              <ellipse cx="30" cy="42" rx="12" ry="14" fill="url(#trebolGrad)" transform="rotate(180, 30, 30)"/>
              <ellipse cx="18" cy="30" rx="12" ry="14" fill="url(#trebolGrad)" transform="rotate(270, 18, 30)"/>
              {/* Hendiduras de las hojas */}
              <path d="M30 8 Q30 18 30 24" stroke="#1a5a1a" strokeWidth="2" fill="none"/>
              <path d="M52 30 Q42 30 36 30" stroke="#1a5a1a" strokeWidth="2" fill="none"/>
              <path d="M30 52 Q30 42 30 36" stroke="#1a5a1a" strokeWidth="2" fill="none"/>
              <path d="M8 30 Q18 30 24 30" stroke="#1a5a1a" strokeWidth="2" fill="none"/>
              {/* Centro */}
              <circle cx="30" cy="30" r="5" fill="#2a6a2a"/>
              {/* Tallo */}
              <path d="M30 35 Q28 50 30 70" stroke="url(#talloGrad)" strokeWidth="4" fill="none" strokeLinecap="round"/>
              {/* Brillo */}
              {puedeReclamar && <ellipse cx="24" cy="14" rx="4" ry="3" fill="rgba(255,255,255,0.5)"><animate attributeName="opacity" values="0.3;0.7;0.3" dur="2.5s" repeatCount="indefinite"/></ellipse>}
              <defs>
                <radialGradient id="trebolGrad" cx="50%" cy="30%">
                  <stop offset="0%" stopColor="#5cb85c"/><stop offset="70%" stopColor="#3a8a3a"/><stop offset="100%" stopColor="#2a6a2a"/>
                </radialGradient>
                <linearGradient id="talloGrad" x1="50%" y1="0%" x2="50%" y2="100%">
                  <stop offset="0%" stopColor="#3a7a3a"/><stop offset="100%" stopColor="#2a5a2a"/>
                </linearGradient>
              </defs>
            </svg>
            <div style={{textAlign: 'center', fontSize: '0.7rem', color: '#fff', marginTop: '4px', textShadow: '0 1px 3px rgba(0,0,0,0.8)'}}>Trébol</div>
          </div>
        </div>

        {/* Overlay cuando ya reclamó */}
        {!puedeReclamar && !resultado && (
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(0,0,0,0.7)',
            borderRadius: '20px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 20,
            backdropFilter: 'blur(2px)',
          }}>
            <div style={{fontSize: '2.5rem', marginBottom: '10px'}}>🌙</div>
            <p style={{
              color: '#fff',
              fontSize: '1rem',
              textAlign: 'center',
              margin: 0,
              padding: '0 20px',
              fontFamily: "'Cinzel', serif",
            }}>
              Ya elegiste tu magia de hoy
            </p>
            <p style={{
              color: 'rgba(255,255,255,0.6)',
              fontSize: '0.85rem',
              marginTop: '8px',
            }}>
              Volvé mañana a elegir de nuevo ✨
            </p>
            {racha > 0 && (
              <div style={{
                marginTop: '15px',
                background: 'rgba(255,100,50,0.2)',
                padding: '8px 16px',
                borderRadius: '20px',
                color: '#ff6b35',
                fontSize: '0.9rem',
              }}>
                🔥 Racha: {racha} días
              </div>
            )}
          </div>
        )}

        {/* Instrucción cuando puede reclamar */}
        {puedeReclamar && !reclamando && (
          <div style={{
            position: 'absolute',
            bottom: '8px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(0,0,0,0.7)',
            padding: '6px 16px',
            borderRadius: '20px',
            zIndex: 10,
          }}>
            <p style={{
              color: '#d4af37',
              fontSize: '0.8rem',
              margin: 0,
              whiteSpace: 'nowrap',
            }}>
              ✨ Elegí uno para recibir tu magia diaria
            </p>
          </div>
        )}

        {/* Animación de carga */}
        {reclamando && (
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(0,0,0,0.6)',
            borderRadius: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 20,
          }}>
            <div style={{
              color: '#d4af37',
              fontSize: '1.1rem',
              fontFamily: "'Cinzel', serif",
              animation: 'pulse 1s infinite',
            }}>
              ✨ Canalizando magia...
            </div>
          </div>
        )}

        {/* Bonus próximo */}
        {diasParaBonus && diasParaBonus <= 7 && (
          <div style={{
            position: 'absolute',
            bottom: '150px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(0,0,0,0.7)',
            padding: '4px 14px',
            borderRadius: '20px',
            fontSize: '0.75rem',
            color: amatista.brillante,
            whiteSpace: 'nowrap',
            border: `1px solid ${amatista.medio}40`,
            zIndex: 8,
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
