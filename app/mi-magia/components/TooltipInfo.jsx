'use client';
import { useState, useRef, useEffect } from 'react';

// ═══════════════════════════════════════════════════════════════
// TOOLTIP INFO - Componente genérico para explicaciones
// Funciona en desktop (hover) y celular (tap en ?)
// ═══════════════════════════════════════════════════════════════

export default function TooltipInfo({
  children,        // El contenido que lleva el tooltip
  titulo,          // Título del tooltip
  contenido,       // Contenido del tooltip (puede ser JSX)
  posicion = 'top' // top, bottom, left, right
}) {
  const [mostrar, setMostrar] = useState(false);
  const tooltipRef = useRef(null);
  const btnRef = useRef(null);

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

  return (
    <div className="tooltip-wrapper">
      <div className="tooltip-trigger">
        {children}
        <button
          ref={btnRef}
          className="tooltip-btn"
          onClick={(e) => { e.stopPropagation(); setMostrar(!mostrar); }}
          aria-label="Más información"
        >
          ?
        </button>
      </div>

      {mostrar && (
        <div ref={tooltipRef} className={`tooltip-box tooltip-${posicion}`}>
          <button className="tooltip-cerrar" onClick={() => setMostrar(false)}>×</button>
          {titulo && <h4 className="tooltip-titulo">{titulo}</h4>}
          <div className="tooltip-contenido">
            {contenido}
          </div>
        </div>
      )}

      <style jsx>{`
        .tooltip-wrapper {
          position: relative;
          display: inline-block;
        }

        .tooltip-trigger {
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }

        .tooltip-btn {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: rgba(212, 175, 55, 0.2);
          border: 1px solid rgba(212, 175, 55, 0.4);
          color: #d4af37;
          font-size: 11px;
          font-weight: bold;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
          flex-shrink: 0;
        }

        .tooltip-btn:hover {
          background: rgba(212, 175, 55, 0.3);
          transform: scale(1.1);
        }

        .tooltip-box {
          position: absolute;
          z-index: 1000;
          width: 280px;
          background: #fff;
          border: 1px solid rgba(212, 175, 55, 0.3);
          border-radius: 16px;
          padding: 16px;
          box-shadow: 0 10px 40px rgba(0,0,0,0.15);
          animation: fadeIn 0.2s ease;
        }

        .tooltip-top {
          bottom: calc(100% + 10px);
          left: 50%;
          transform: translateX(-50%);
        }

        .tooltip-bottom {
          top: calc(100% + 10px);
          left: 50%;
          transform: translateX(-50%);
        }

        .tooltip-left {
          right: calc(100% + 10px);
          top: 50%;
          transform: translateY(-50%);
        }

        .tooltip-right {
          left: calc(100% + 10px);
          top: 50%;
          transform: translateY(-50%);
        }

        .tooltip-cerrar {
          position: absolute;
          top: 8px;
          right: 8px;
          width: 24px;
          height: 24px;
          border: none;
          background: rgba(0,0,0,0.05);
          border-radius: 50%;
          font-size: 18px;
          cursor: pointer;
          color: #666;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .tooltip-cerrar:hover {
          background: rgba(0,0,0,0.1);
        }

        .tooltip-titulo {
          font-family: 'Cinzel', serif;
          font-size: 14px;
          color: #d4af37;
          margin: 0 0 10px;
          padding-right: 20px;
        }

        .tooltip-contenido {
          font-size: 13px;
          color: #666;
          line-height: 1.6;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateX(-50%) translateY(5px); }
          to { opacity: 1; transform: translateX(-50%) translateY(0); }
        }

        @media (max-width: 400px) {
          .tooltip-box {
            width: 260px;
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
          }
          .tooltip-top, .tooltip-bottom, .tooltip-left, .tooltip-right {
            top: 50%;
            left: 50%;
            right: auto;
            bottom: auto;
            transform: translate(-50%, -50%);
          }
        }
      `}</style>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// CONTENIDOS PREDEFINIDOS para Mi Magia
// ═══════════════════════════════════════════════════════════════

export const TOOLTIPS = {
  runas: {
    titulo: '✨ Runas de Poder',
    contenido: (
      <div>
        <p style={{marginBottom: '10px'}}><strong>¿Qué son?</strong><br/>Tu moneda mágica para desbloquear experiencias, lecturas y rituales.</p>
        <p style={{marginBottom: '10px'}}><strong>¿Cómo obtenerlas?</strong></p>
        <ul style={{margin: '0', paddingLeft: '18px', fontSize: '12px'}}>
          <li>🎁 100 de bienvenida</li>
          <li>📦 Cofre diario</li>
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
        <p style={{marginBottom: '10px'}}><strong>¿Qué son?</strong><br/>Puntos de suerte que acumulás con tus acciones en Mi Magia.</p>
        <p style={{marginBottom: '10px'}}><strong>¿Cómo obtenerlos?</strong></p>
        <ul style={{margin: '0', paddingLeft: '18px', fontSize: '12px'}}>
          <li>Entrar cada día</li>
          <li>Completar experiencias</li>
          <li>Interactuar con tu guardián</li>
        </ul>
        <p style={{marginTop: '10px'}}><strong>¿Para qué sirven?</strong><br/>Desbloquean recompensas especiales y mejoran tu rango.</p>
      </div>
    )
  },

  circulo: {
    titulo: '⭐ Círculo de Duendes',
    contenido: (
      <div>
        <p style={{marginBottom: '10px'}}>Membresía con beneficios exclusivos:</p>
        <ul style={{margin: '0', paddingLeft: '18px', fontSize: '12px'}}>
          <li>✨ Contenido semanal exclusivo</li>
          <li>💰 5-10% descuento en tienda</li>
          <li>🎁 100+ runas de regalo</li>
          <li>🌙 Guía lunar mensual</li>
          <li>🕯️ Rituales exclusivos</li>
        </ul>
        <p style={{marginTop: '10px', fontWeight: '600', color: '#d4af37'}}>Probá 15 días gratis</p>
      </div>
    )
  },

  experiencias: {
    titulo: '🔮 Experiencias Mágicas',
    contenido: (
      <div>
        <p style={{marginBottom: '10px'}}>Actividades interactivas que podés hacer con tus runas:</p>
        <ul style={{margin: '0', paddingLeft: '18px', fontSize: '12px'}}>
          <li>🃏 Tiradas de tarot</li>
          <li>ᚱ Lectura de runas</li>
          <li>🔮 Bola de cristal</li>
          <li>🕯️ Rituales guiados</li>
          <li>📖 Estudios místicos</li>
        </ul>
        <p style={{marginTop: '10px'}}>Cada experiencia tiene un costo en runas.</p>
      </div>
    )
  },

  canalizaciones: {
    titulo: '📜 Canalizaciones',
    contenido: (
      <div>
        <p style={{marginBottom: '10px'}}><strong>¿Qué es?</strong><br/>Un mensaje personal de tu guardián, escrito especialmente para vos.</p>
        <p style={{marginBottom: '10px'}}><strong>¿Cómo funciona?</strong></p>
        <ol style={{margin: '0', paddingLeft: '18px', fontSize: '12px'}}>
          <li>Adoptás un guardián</li>
          <li>Completás un formulario</li>
          <li>Tu guardián te escribe</li>
        </ol>
        <p style={{marginTop: '10px'}}>Cada guardián tiene un código QR que te lleva a su mensaje.</p>
      </div>
    )
  },

  grimorio: {
    titulo: '📔 Grimorio Personal',
    contenido: (
      <div>
        <p style={{marginBottom: '10px'}}><strong>¿Qué es?</strong><br/>Tu diario mágico personal donde podés escribir y reflexionar.</p>
        <p><strong>Usos:</strong></p>
        <ul style={{margin: '5px 0 0', paddingLeft: '18px', fontSize: '12px'}}>
          <li>Escribir intenciones</li>
          <li>Registrar sueños</li>
          <li>Anotar señales</li>
          <li>Guardar lecturas</li>
        </ul>
      </div>
    )
  },

  cofreDiario: {
    titulo: '📦 Cofre Diario',
    contenido: (
      <div>
        <p style={{marginBottom: '10px'}}><strong>¿Qué es?</strong><br/>Un regalo que podés abrir cada día.</p>
        <p style={{marginBottom: '10px'}}><strong>¿Qué contiene?</strong></p>
        <ul style={{margin: '0', paddingLeft: '18px', fontSize: '12px'}}>
          <li>Runas (5-50)</li>
          <li>Tréboles</li>
          <li>A veces sorpresas especiales</li>
        </ul>
        <p style={{marginTop: '10px', fontWeight: '600', color: '#d4af37'}}>Entrá cada día para no perdértelo</p>
      </div>
    )
  },

  rangos: {
    titulo: '🏆 Rangos',
    contenido: (
      <div>
        <p style={{marginBottom: '10px'}}>Tu nivel según cuánto compraste:</p>
        <ul style={{margin: '0', paddingLeft: '18px', fontSize: '12px'}}>
          <li>🌱 Semilla - Inicio</li>
          <li>🌿 Brote - $50+</li>
          <li>🌳 Árbol - $150+</li>
          <li>⭐ Guardián - $300+</li>
          <li>👑 Anciano - $500+</li>
        </ul>
        <p style={{marginTop: '10px'}}>Cada rango tiene beneficios especiales.</p>
      </div>
    )
  },

  misiones: {
    titulo: '🎯 Misiones',
    contenido: (
      <div>
        <p style={{marginBottom: '10px'}}><strong>¿Qué son?</strong><br/>Objetivos diarios y semanales para ganar recompensas.</p>
        <p style={{marginBottom: '10px'}}><strong>Ejemplos:</strong></p>
        <ul style={{margin: '0', paddingLeft: '18px', fontSize: '12px'}}>
          <li>Abrir el cofre diario</li>
          <li>Hacer una tirada</li>
          <li>Escribir en el grimorio</li>
          <li>Visitar la tienda</li>
        </ul>
        <p style={{marginTop: '10px', fontWeight: '600', color: '#d4af37'}}>Completalas para ganar runas</p>
      </div>
    )
  },

  nivelAcceso: {
    titulo: '🔐 Niveles de Acceso',
    contenido: (
      <div>
        <p style={{marginBottom: '10px'}}>Tu acceso depende de tus compras:</p>
        <ul style={{margin: '0', paddingLeft: '18px', fontSize: '12px'}}>
          <li><strong>🌱 Explorador</strong> - Sin compras (contenido limitado)</li>
          <li><strong>🛡️ Guardián</strong> - Con compras (acceso completo)</li>
          <li><strong>✨ Círculo</strong> - Con membresía (todo + exclusivo)</li>
        </ul>
        <p style={{marginTop: '10px'}}>Adoptá un guardián para desbloquear todo.</p>
      </div>
    )
  }
};

// ═══════════════════════════════════════════════════════════════
// COMPONENTE HELPER - Para uso rápido con contenido predefinido
// ═══════════════════════════════════════════════════════════════

export function InfoTooltip({ tipo, children, posicion = 'top' }) {
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
