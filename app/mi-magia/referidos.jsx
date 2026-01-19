'use client';
import { useState, useEffect } from 'react';

// ═══════════════════════════════════════════════════════════════
// COMPONENTE: SISTEMA DE REFERIDOS
// Panel para que usuarios vean y compartan su código de referido
// ═══════════════════════════════════════════════════════════════

export default function Referidos({ usuario, token }) {
  const [datos, setDatos] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [generando, setGenerando] = useState(false);
  const [copiado, setCopiado] = useState(false);
  const [mensaje, setMensaje] = useState(null);

  useEffect(() => {
    cargarReferidos();
  }, []);

  const cargarReferidos = async () => {
    try {
      const res = await fetch(`/api/referidos/mis-referidos?email=${encodeURIComponent(usuario.email)}`);
      const data = await res.json();
      if (data.success) {
        setDatos(data);
      }
    } catch (e) {
      console.error('Error cargando referidos:', e);
    }
    setCargando(false);
  };

  const generarCodigo = async () => {
    setGenerando(true);
    try {
      const res = await fetch('/api/referidos/generar-codigo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: usuario.email })
      });
      const data = await res.json();
      if (data.success) {
        setDatos(prev => ({
          ...prev,
          codigoReferido: data.codigo,
          tieneCodigo: true,
          linkCompartir: `https://duendesdeluruguay.com/registro?ref=${data.codigo}`
        }));
        setMensaje({ tipo: 'exito', texto: '¡Código generado! Compartilo con tus amigas.' });
      } else {
        setMensaje({ tipo: 'error', texto: data.error });
      }
    } catch (e) {
      setMensaje({ tipo: 'error', texto: 'Error generando código' });
    }
    setGenerando(false);
  };

  const copiarLink = () => {
    const link = datos?.linkCompartir || `https://duendesdeluruguay.com/registro?ref=${datos?.codigoReferido}`;
    navigator.clipboard.writeText(link);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  };

  const compartirWhatsApp = () => {
    const texto = `✨ Te invito a Duendes del Uruguay, un espacio mágico de conexión espiritual. Usá mi código ${datos?.codigoReferido} y recibí runas de regalo para tu primera experiencia. ${datos?.linkCompartir}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(texto)}`, '_blank');
  };

  if (cargando) {
    return (
      <div className="referidos-container referidos-cargando">
        <div className="referidos-spinner"></div>
      </div>
    );
  }

  return (
    <div className="referidos-container">
      <div className="referidos-header">
        <span className="referidos-icono">💫</span>
        <h3>Invitá amigas y ganá runas</h3>
      </div>

      {mensaje && (
        <div className={`referidos-mensaje ${mensaje.tipo}`}>
          {mensaje.texto}
        </div>
      )}

      {!datos?.tieneCodigo ? (
        <div className="referidos-generar">
          <p>Generá tu código único de referido y compartilo con tus amigas.</p>
          <p className="referidos-beneficios">
            <span>🎁 Vos ganás <strong>50 runas</strong> por cada amiga</span>
            <span>🎁 Ella recibe <strong>25 runas</strong> de bienvenida</span>
          </p>
          <button
            className="btn-generar-codigo"
            onClick={generarCodigo}
            disabled={generando}
          >
            {generando ? 'Generando...' : '✨ Generar mi código'}
          </button>
        </div>
      ) : (
        <div className="referidos-panel">
          <div className="codigo-box">
            <span className="codigo-label">Tu código:</span>
            <span className="codigo-valor">{datos.codigoReferido}</span>
          </div>

          <div className="referidos-acciones">
            <button className="btn-copiar" onClick={copiarLink}>
              {copiado ? '✓ Copiado' : '📋 Copiar link'}
            </button>
            <button className="btn-whatsapp" onClick={compartirWhatsApp}>
              💬 Compartir
            </button>
          </div>

          <div className="referidos-stats">
            <div className="stat-referidos">
              <span className="stat-num">{datos.totalReferidos || 0}</span>
              <span className="stat-label">Amigas invitadas</span>
            </div>
            <div className="stat-referidos">
              <span className="stat-num">{datos.totalBonusGanado || 0}</span>
              <span className="stat-label">Runas ganadas</span>
            </div>
          </div>

          {datos.referidos && datos.referidos.length > 0 && (
            <div className="referidos-lista">
              <h4>Tus referidas</h4>
              {datos.referidos.slice(0, 5).map((ref, i) => (
                <div key={i} className="referido-item">
                  <span className="referido-email">{ref.email}</span>
                  <span className="referido-bonus">+{ref.bonus} ᚱ</span>
                  {ref.esCirculo && <span className="referido-circulo">⭐ Círculo</span>}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <style jsx>{`
        .referidos-container {
          background: linear-gradient(135deg, rgba(212, 175, 55, 0.1) 0%, rgba(75, 0, 130, 0.15) 100%);
          border: 1px solid rgba(212, 175, 55, 0.3);
          border-radius: 20px;
          padding: 24px;
          margin: 20px 0;
        }

        .referidos-cargando {
          display: flex;
          justify-content: center;
          padding: 40px;
        }

        .referidos-spinner {
          width: 32px;
          height: 32px;
          border: 3px solid rgba(212, 175, 55, 0.3);
          border-top-color: #d4af37;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .referidos-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 16px;
        }

        .referidos-icono {
          font-size: 28px;
        }

        .referidos-header h3 {
          margin: 0;
          font-size: 18px;
          color: #d4af37;
        }

        .referidos-mensaje {
          padding: 12px 16px;
          border-radius: 10px;
          margin-bottom: 16px;
          font-size: 14px;
        }

        .referidos-mensaje.exito {
          background: rgba(46, 204, 113, 0.2);
          color: #2ecc71;
        }

        .referidos-mensaje.error {
          background: rgba(231, 76, 60, 0.2);
          color: #e74c3c;
        }

        .referidos-generar {
          text-align: center;
        }

        .referidos-generar p {
          color: #aaa;
          font-size: 14px;
          margin: 0 0 16px 0;
        }

        .referidos-beneficios {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-bottom: 20px !important;
        }

        .referidos-beneficios span {
          font-size: 13px;
        }

        .referidos-beneficios strong {
          color: #d4af37;
        }

        .btn-generar-codigo {
          padding: 14px 28px;
          background: linear-gradient(135deg, #d4af37 0%, #b8962e 100%);
          border: none;
          border-radius: 12px;
          color: #1a1a2e;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
        }

        .btn-generar-codigo:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(212, 175, 55, 0.3);
        }

        .btn-generar-codigo:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .codigo-box {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          background: rgba(0, 0, 0, 0.3);
          padding: 20px;
          border-radius: 12px;
          margin-bottom: 16px;
        }

        .codigo-label {
          font-size: 12px;
          color: #888;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .codigo-valor {
          font-size: 28px;
          font-weight: 700;
          color: #d4af37;
          letter-spacing: 2px;
          font-family: monospace;
        }

        .referidos-acciones {
          display: flex;
          gap: 12px;
          margin-bottom: 20px;
        }

        .btn-copiar, .btn-whatsapp {
          flex: 1;
          padding: 12px;
          border: none;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-copiar {
          background: rgba(255, 255, 255, 0.1);
          color: #fff;
        }

        .btn-copiar:hover {
          background: rgba(255, 255, 255, 0.2);
        }

        .btn-whatsapp {
          background: #25D366;
          color: #fff;
        }

        .btn-whatsapp:hover {
          background: #1da851;
        }

        .referidos-stats {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin-bottom: 16px;
        }

        .stat-referidos {
          background: rgba(0, 0, 0, 0.2);
          padding: 16px;
          border-radius: 10px;
          text-align: center;
        }

        .stat-num {
          display: block;
          font-size: 24px;
          font-weight: 700;
          color: #d4af37;
        }

        .stat-label {
          font-size: 12px;
          color: #888;
        }

        .referidos-lista {
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          padding-top: 16px;
        }

        .referidos-lista h4 {
          margin: 0 0 12px 0;
          font-size: 14px;
          color: #888;
        }

        .referido-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 12px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 8px;
          margin-bottom: 8px;
        }

        .referido-email {
          flex: 1;
          font-size: 13px;
          color: #ccc;
        }

        .referido-bonus {
          font-size: 13px;
          color: #2ecc71;
          font-weight: 600;
        }

        .referido-circulo {
          font-size: 11px;
          padding: 2px 8px;
          background: rgba(212, 175, 55, 0.2);
          color: #d4af37;
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
}
