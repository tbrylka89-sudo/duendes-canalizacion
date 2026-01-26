'use client';
import { useState, useRef, useEffect } from 'react';

// ═══════════════════════════════════════════════════════════════
// TOOLTIP INFO - Componente genérico para explicaciones
// Funciona en desktop (hover) y celular (tap en ?)
// Convertido a inline styles (styled-jsx no funciona en prod)
// ═══════════════════════════════════════════════════════════════

export default function TooltipInfo({
  children,        // El contenido que lleva el tooltip
  titulo,          // Título del tooltip
  contenido,       // Contenido del tooltip (puede ser JSX)
  posicion = 'bottom' // top, bottom, left, right
}) {
  const [mostrar, setMostrar] = useState(false);
  const tooltipRef = useRef(null);
  const btnRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  // Detectar móvil (solo en cliente)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsMobile(window.innerWidth <= 500);
      const handleResize = () => setIsMobile(window.innerWidth <= 500);
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  // Cerrar al hacer click fuera
  useEffect(() => {
    function handleClickFuera(e) {
      if (mostrar &&
          tooltipRef.current &&
          !tooltipRef.current.contains(e.target) &&
          btnRef.current &&
          !btnRef.current.contains(e.target)) {
        setMostrar(false);
      }
    }
    document.addEventListener('mousedown', handleClickFuera);
    document.addEventListener('touchstart', handleClickFuera);
    return () => {
      document.removeEventListener('mousedown', handleClickFuera);
      document.removeEventListener('touchstart', handleClickFuera);
    };
  }, [mostrar]);

  const styles = {
    wrapper: {
      position: 'relative',
      display: 'inline-block',
    },
    trigger: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
    },
    btn: {
      width: '20px',
      height: '20px',
      borderRadius: '50%',
      background: 'rgba(212, 175, 55, 0.25)',
      border: '1px solid rgba(212, 175, 55, 0.5)',
      color: '#d4af37',
      fontSize: '12px',
      fontWeight: 'bold',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'all 0.2s',
      flexShrink: 0,
      padding: 0,
      lineHeight: 1,
    },
    box: {
      position: isMobile ? 'fixed' : 'absolute',
      zIndex: 10000,
      width: isMobile ? '90vw' : '300px',
      maxWidth: '320px',
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
      border: '1px solid rgba(212, 175, 55, 0.4)',
      borderRadius: '16px',
      padding: '18px',
      boxShadow: '0 15px 50px rgba(0,0,0,0.5), 0 0 30px rgba(212,175,55,0.1)',
      ...(isMobile ? {
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
      } : {
        ...(posicion === 'top' && { bottom: 'calc(100% + 12px)', left: '0' }),
        ...(posicion === 'bottom' && { top: 'calc(100% + 12px)', left: '0' }),
        ...(posicion === 'left' && { right: 'calc(100% + 12px)', top: '0' }),
        ...(posicion === 'right' && { left: 'calc(100% + 12px)', top: '0' }),
      }),
    },
    cerrar: {
      position: 'absolute',
      top: '10px',
      right: '10px',
      width: '26px',
      height: '26px',
      border: 'none',
      background: 'rgba(255,255,255,0.1)',
      borderRadius: '50%',
      fontSize: '18px',
      cursor: 'pointer',
      color: 'rgba(255,255,255,0.6)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 0,
      lineHeight: 1,
    },
    titulo: {
      fontFamily: "'Cinzel', serif",
      fontSize: '15px',
      color: '#d4af37',
      margin: '0 0 12px',
      paddingRight: '30px',
    },
    contenido: {
      fontSize: '13px',
      color: 'rgba(255,255,255,0.85)',
      lineHeight: 1.6,
    },
    overlay: {
      position: 'fixed',
      inset: 0,
      background: 'rgba(0,0,0,0.5)',
      zIndex: 9999,
    },
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.trigger}>
        {children}
        <button
          ref={btnRef}
          style={styles.btn}
          onClick={(e) => { e.stopPropagation(); setMostrar(!mostrar); }}
          aria-label="Más información"
        >
          ?
        </button>
      </div>

      {mostrar && (
        <>
          {isMobile && <div style={styles.overlay} onClick={() => setMostrar(false)} />}
          <div ref={tooltipRef} style={styles.box}>
            <button style={styles.cerrar} onClick={() => setMostrar(false)}>×</button>
            {titulo && <h4 style={styles.titulo}>{titulo}</h4>}
            <div style={styles.contenido}>
              {contenido}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// CONTENIDOS PREDEFINIDOS para Mi Magia
// ═══════════════════════════════════════════════════════════════

const listaStyle = { margin: '5px 0 0', paddingLeft: '18px', fontSize: '12px', color: 'rgba(255,255,255,0.8)' };
const parrafoStyle = { marginBottom: '10px', color: 'rgba(255,255,255,0.85)' };

export const TOOLTIPS = {
  runas: {
    titulo: '✨ Runas de Poder',
    contenido: (
      <div>
        <p style={parrafoStyle}><strong style={{color: '#d4af37'}}>¿Qué son?</strong><br/>Tu moneda mágica para desbloquear experiencias, lecturas y rituales.</p>
        <p style={parrafoStyle}><strong style={{color: '#d4af37'}}>¿Cómo obtenerlas?</strong></p>
        <ul style={listaStyle}>
          <li>🎁 100 de bienvenida</li>
          <li>💎 Jardín Encantado (diario)</li>
          <li>📝 Completar perfil (+50)</li>
          <li>🎯 Cumplir misiones</li>
          <li>🛒 Comprar en tienda</li>
        </ul>
      </div>
    )
  },

  treboles: {
    titulo: '🍀 Tréboles',
    contenido: (
      <div>
        <p style={parrafoStyle}><strong style={{color: '#d4af37'}}>¿Qué son?</strong><br/>Puntos de suerte que acumulás con tus acciones en Mi Magia.</p>
        <p style={parrafoStyle}><strong style={{color: '#d4af37'}}>¿Cómo obtenerlos?</strong></p>
        <ul style={listaStyle}>
          <li>Entrar cada día</li>
          <li>Completar experiencias</li>
          <li>Interactuar con tu guardián</li>
        </ul>
        <p style={{...parrafoStyle, marginTop: '10px'}}><strong style={{color: '#d4af37'}}>¿Para qué sirven?</strong><br/>Desbloquean recompensas especiales y mejoran tu rango.</p>
      </div>
    )
  },

  circulo: {
    titulo: '⭐ Círculo de Duendes',
    contenido: (
      <div>
        <p style={parrafoStyle}>Membresía con beneficios exclusivos:</p>
        <ul style={listaStyle}>
          <li>✨ Contenido semanal exclusivo</li>
          <li>💰 5-10% descuento en tienda</li>
          <li>🎁 100+ runas de regalo</li>
          <li>🌙 Guía lunar mensual</li>
          <li>🕯️ Rituales exclusivos</li>
        </ul>
        <p style={{marginTop: '12px', fontWeight: '600', color: '#d4af37'}}>Probá 15 días gratis</p>
      </div>
    )
  },

  experiencias: {
    titulo: '🔮 Experiencias Mágicas',
    contenido: (
      <div>
        <p style={parrafoStyle}>Actividades interactivas que podés hacer con tus runas:</p>
        <ul style={listaStyle}>
          <li>🃏 Tiradas de tarot</li>
          <li>ᚱ Lectura de runas</li>
          <li>🔮 Bola de cristal</li>
          <li>🕯️ Rituales guiados</li>
          <li>📖 Estudios místicos</li>
        </ul>
        <p style={{...parrafoStyle, marginTop: '10px'}}>Cada experiencia tiene un costo en runas.</p>
      </div>
    )
  },

  canalizaciones: {
    titulo: '📜 Canalizaciones',
    contenido: (
      <div>
        <p style={parrafoStyle}><strong style={{color: '#d4af37'}}>¿Qué es?</strong><br/>Un mensaje personal de tu guardián, escrito especialmente para vos.</p>
        <p style={parrafoStyle}><strong style={{color: '#d4af37'}}>¿Cómo funciona?</strong></p>
        <ol style={listaStyle}>
          <li>Adoptás un guardián</li>
          <li>Completás un formulario</li>
          <li>Tu guardián te escribe</li>
        </ol>
        <p style={{...parrafoStyle, marginTop: '10px'}}>Cada guardián tiene un código QR que te lleva a su mensaje.</p>
      </div>
    )
  },

  grimorio: {
    titulo: '📔 Grimorio Personal',
    contenido: (
      <div>
        <p style={parrafoStyle}><strong style={{color: '#d4af37'}}>¿Qué es?</strong><br/>Tu diario mágico personal donde podés escribir y reflexionar.</p>
        <p style={parrafoStyle}><strong style={{color: '#d4af37'}}>Usos:</strong></p>
        <ul style={listaStyle}>
          <li>Escribir intenciones</li>
          <li>Registrar sueños</li>
          <li>Anotar señales</li>
          <li>Guardar lecturas</li>
        </ul>
      </div>
    )
  },

  cofreDiario: {
    titulo: '💎 Jardín Encantado',
    contenido: (
      <div>
        <p style={parrafoStyle}><strong style={{color: '#d4af37'}}>¿Qué es?</strong><br/>Un jardín mágico con un cristal de amatista que podés tocar cada día.</p>
        <p style={parrafoStyle}><strong style={{color: '#d4af37'}}>¿Qué obtenés?</strong></p>
        <ul style={listaStyle}>
          <li>Runas (5-50)</li>
          <li>Tréboles</li>
          <li>Bonus por racha</li>
          <li>A veces sorpresas especiales</li>
        </ul>
        <p style={{marginTop: '12px', fontWeight: '600', color: '#d4af37'}}>Entrá cada día para mantener tu racha 🔥</p>
      </div>
    )
  },

  rangos: {
    titulo: '🏆 Rangos',
    contenido: (
      <div>
        <p style={parrafoStyle}>Tu nivel según cuánto compraste:</p>
        <ul style={listaStyle}>
          <li>🌱 Semilla - Inicio</li>
          <li>🌿 Brote - $50+</li>
          <li>🌳 Árbol - $150+</li>
          <li>⭐ Guardián - $300+</li>
          <li>👑 Anciano - $500+</li>
        </ul>
        <p style={{...parrafoStyle, marginTop: '10px'}}>Cada rango tiene beneficios especiales.</p>
      </div>
    )
  },

  misiones: {
    titulo: '🎯 Misiones',
    contenido: (
      <div>
        <p style={parrafoStyle}><strong style={{color: '#d4af37'}}>¿Qué son?</strong><br/>Objetivos diarios y semanales para ganar recompensas.</p>
        <p style={parrafoStyle}><strong style={{color: '#d4af37'}}>Ejemplos:</strong></p>
        <ul style={listaStyle}>
          <li>Tocar el cristal diario</li>
          <li>Hacer una tirada</li>
          <li>Escribir en el grimorio</li>
          <li>Visitar la tienda</li>
        </ul>
        <p style={{marginTop: '12px', fontWeight: '600', color: '#d4af37'}}>Completalas para ganar runas</p>
      </div>
    )
  },

  nivelAcceso: {
    titulo: '🔐 Niveles de Acceso',
    contenido: (
      <div>
        <p style={parrafoStyle}>Tu acceso depende de tus compras:</p>
        <ul style={listaStyle}>
          <li><strong style={{color: '#d4af37'}}>🌱 Explorador</strong> - Sin compras (limitado)</li>
          <li><strong style={{color: '#d4af37'}}>🛡️ Guardián</strong> - Con compras (completo)</li>
          <li><strong style={{color: '#d4af37'}}>✨ Círculo</strong> - Con membresía (todo + exclusivo)</li>
        </ul>
        <p style={{...parrafoStyle, marginTop: '10px'}}>Adoptá un guardián para desbloquear todo.</p>
      </div>
    )
  }
};

// ═══════════════════════════════════════════════════════════════
// COMPONENTE HELPER - Para uso rápido con contenido predefinido
// ═══════════════════════════════════════════════════════════════

export function InfoTooltip({ tipo, children, posicion = 'bottom' }) {
  const tooltip = TOOLTIPS[tipo];
  if (!tooltip) return children;

  return (
    <TooltipInfo
      titulo={tooltip.titulo}
      contenido={tooltip.contenido}
      posicion={posicion}
    >
      {children}
    </TooltipInfo>
  );
}
