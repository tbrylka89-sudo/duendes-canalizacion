'use client';
import { useState } from 'react';

// ═══════════════════════════════════════════════════════════════
// TOOLTIP DE RUNAS DE PODER
// Explica qué son, cómo se obtienen y cómo se usan
// ═══════════════════════════════════════════════════════════════

export default function TooltipRunas({ runas = 0, onClick }) {
  const [mostrarInfo, setMostrarInfo] = useState(false);

  return (
    <div className="runas-container">
      <button
        className="runas-stat"
        onClick={onClick}
        onMouseEnter={() => setMostrarInfo(true)}
        onMouseLeave={() => setMostrarInfo(false)}
      >
        <span className="runas-icono">ᚱ</span>
        <span className="runas-numero">{runas}</span>
        <span className="runas-label">Runas</span>
        <span className="runas-info-btn">?</span>
      </button>

      {mostrarInfo && (
        <div className="runas-tooltip">
          <h4>✨ Runas de Poder</h4>

          <div className="tooltip-seccion">
            <strong>¿Qué son?</strong>
            <p>Son tu moneda mágica dentro de Mi Magia. Las usás para desbloquear experiencias, lecturas y rituales.</p>
          </div>

          <div className="tooltip-seccion">
            <strong>¿Cómo las obtengo?</strong>
            <ul>
              <li>🎁 <b>100 runas</b> de bienvenida al registrarte</li>
              <li>📦 <b>Cofre diario</b> - Abrilo cada día</li>
              <li>📝 <b>Completar perfil</b> - +50 runas</li>
              <li>🎯 <b>Misiones</b> - Cumplí objetivos</li>
              <li>🛒 <b>Comprar</b> - En la tienda de runas</li>
            </ul>
          </div>

          <div className="tooltip-seccion">
            <strong>¿Cómo las uso?</strong>
            <p>Cada experiencia mágica tiene un costo en runas. Elegí la que quieras y usá tus runas para acceder.</p>
          </div>

          <div className="tooltip-cta">
            Click para obtener más runas →
          </div>
        </div>
      )}

      <style jsx>{`
        .runas-container {
          position: relative;
          display: inline-block;
        }

        .runas-stat {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          background: linear-gradient(135deg, rgba(212, 175, 55, 0.1), rgba(212, 175, 55, 0.05));
          border: 1px solid rgba(212, 175, 55, 0.3);
          border-radius: 16px;
          padding: 16px 20px;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
        }

        .runas-stat:hover {
          border-color: #d4af37;
          background: linear-gradient(135deg, rgba(212, 175, 55, 0.15), rgba(212, 175, 55, 0.08));
          transform: translateY(-2px);
        }

        .runas-icono {
          font-size: 24px;
          color: #d4af37;
        }

        .runas-numero {
          font-family: 'Cinzel', serif;
          font-size: 24px;
          font-weight: 600;
          color: #1a1a1a;
        }

        .runas-label {
          font-size: 12px;
          color: #666;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .runas-info-btn {
          position: absolute;
          top: 8px;
          right: 8px;
          width: 18px;
          height: 18px;
          background: rgba(212, 175, 55, 0.2);
          border-radius: 50%;
          font-size: 11px;
          color: #d4af37;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
        }

        .runas-tooltip {
          position: absolute;
          bottom: calc(100% + 15px);
          left: 50%;
          transform: translateX(-50%);
          width: 320px;
          background: #fff;
          border: 1px solid rgba(212, 175, 55, 0.3);
          border-radius: 16px;
          padding: 20px;
          box-shadow: 0 10px 40px rgba(0,0,0,0.15);
          z-index: 1000;
          animation: fadeIn 0.2s ease;
        }

        .runas-tooltip::after {
          content: '';
          position: absolute;
          bottom: -8px;
          left: 50%;
          transform: translateX(-50%);
          border-left: 8px solid transparent;
          border-right: 8px solid transparent;
          border-top: 8px solid #fff;
        }

        .runas-tooltip h4 {
          font-family: 'Cinzel', serif;
          font-size: 16px;
          color: #d4af37;
          margin: 0 0 15px;
          text-align: center;
        }

        .tooltip-seccion {
          margin-bottom: 15px;
        }

        .tooltip-seccion strong {
          display: block;
          font-family: 'Cinzel', serif;
          font-size: 13px;
          color: #1a1a1a;
          margin-bottom: 5px;
        }

        .tooltip-seccion p {
          margin: 0;
          font-size: 13px;
          color: #666;
          line-height: 1.5;
        }

        .tooltip-seccion ul {
          margin: 5px 0 0;
          padding-left: 0;
          list-style: none;
        }

        .tooltip-seccion li {
          font-size: 12px;
          color: #666;
          margin: 4px 0;
        }

        .tooltip-seccion li b {
          color: #1a1a1a;
        }

        .tooltip-cta {
          text-align: center;
          padding-top: 10px;
          border-top: 1px solid rgba(212, 175, 55, 0.2);
          font-size: 12px;
          color: #d4af37;
          font-weight: 600;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateX(-50%) translateY(5px); }
          to { opacity: 1; transform: translateX(-50%) translateY(0); }
        }

        @media (max-width: 400px) {
          .runas-tooltip {
            width: 280px;
            left: 0;
            transform: none;
          }
          .runas-tooltip::after {
            left: 30px;
            transform: none;
          }
        }
      `}</style>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// MODAL DE INTRODUCCIÓN A LAS RUNAS (primera vez)
// ═══════════════════════════════════════════════════════════════

export function ModalIntroRunas({ onCerrar }) {
  return (
    <div className="modal-overlay" onClick={onCerrar}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="modal-cerrar" onClick={onCerrar}>×</button>

        <div className="modal-header">
          <span className="modal-runa">ᚱ</span>
          <h2>Runas de Poder</h2>
          <p>Tu moneda mágica en Mi Magia</p>
        </div>

        <div className="modal-body">
          <div className="info-card">
            <span className="info-emoji">✨</span>
            <div>
              <strong>¿Qué son?</strong>
              <p>Las runas son la moneda que usás para acceder a experiencias mágicas: lecturas, tiradas, rituales y más.</p>
            </div>
          </div>

          <div className="info-card">
            <span className="info-emoji">🎁</span>
            <div>
              <strong>Tu regalo de bienvenida</strong>
              <p>Empezás con <b>100 runas gratis</b> para que pruebes las experiencias que te esperan.</p>
            </div>
          </div>

          <div className="info-card">
            <span className="info-emoji">📦</span>
            <div>
              <strong>Ganá más cada día</strong>
              <p>Abrí el <b>cofre diario</b>, completá <b>misiones</b>, o comprá en la tienda de runas.</p>
            </div>
          </div>
        </div>

        <button className="modal-btn" onClick={onCerrar}>
          ¡Entendido! Quiero explorar
        </button>
      </div>

      <style jsx>{`
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          padding: 20px;
          animation: fadeIn 0.3s ease;
        }

        .modal-content {
          background: #fff;
          border-radius: 24px;
          max-width: 420px;
          width: 100%;
          position: relative;
          overflow: hidden;
          animation: slideUp 0.3s ease;
        }

        .modal-cerrar {
          position: absolute;
          top: 15px;
          right: 15px;
          width: 32px;
          height: 32px;
          border: none;
          background: rgba(0,0,0,0.05);
          border-radius: 50%;
          font-size: 24px;
          cursor: pointer;
          color: #666;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }

        .modal-cerrar:hover {
          background: rgba(0,0,0,0.1);
        }

        .modal-header {
          background: linear-gradient(135deg, #1a1a1a, #2a2a2a);
          padding: 40px 30px 30px;
          text-align: center;
        }

        .modal-runa {
          display: inline-block;
          font-size: 48px;
          color: #d4af37;
          margin-bottom: 15px;
          animation: pulse 2s ease-in-out infinite;
        }

        .modal-header h2 {
          font-family: 'Cinzel', serif;
          font-size: 24px;
          color: #d4af37;
          margin: 0 0 8px;
        }

        .modal-header p {
          color: rgba(255,255,255,0.7);
          margin: 0;
          font-size: 15px;
        }

        .modal-body {
          padding: 25px 30px;
        }

        .info-card {
          display: flex;
          gap: 15px;
          margin-bottom: 20px;
        }

        .info-emoji {
          font-size: 28px;
          flex-shrink: 0;
        }

        .info-card strong {
          display: block;
          font-family: 'Cinzel', serif;
          font-size: 14px;
          color: #1a1a1a;
          margin-bottom: 4px;
        }

        .info-card p {
          margin: 0;
          font-size: 13px;
          color: #666;
          line-height: 1.5;
        }

        .info-card b {
          color: #d4af37;
        }

        .modal-btn {
          display: block;
          width: calc(100% - 60px);
          margin: 0 30px 30px;
          padding: 16px;
          background: linear-gradient(135deg, #d4af37, #b8962e);
          color: #fff;
          border: none;
          border-radius: 50px;
          font-family: 'Cinzel', serif;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .modal-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(212, 175, 55, 0.3);
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
      `}</style>
    </div>
  );
}
