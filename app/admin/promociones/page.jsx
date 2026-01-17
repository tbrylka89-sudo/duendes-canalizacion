'use client';
import { useState, useEffect } from 'react';

// ═══════════════════════════════════════════════════════════════════════════════
// ADMIN: PANEL DE PROMOCIONES MÁGICAS
// Vista principal para gestionar todas las promociones
// ═══════════════════════════════════════════════════════════════════════════════

export default function PanelPromociones() {
  const [promociones, setPromociones] = useState([]);
  const [stats, setStats] = useState(null);
  const [filtro, setFiltro] = useState('todas');
  const [cargando, setCargando] = useState(true);
  const [mensaje, setMensaje] = useState(null);

  useEffect(() => {
    cargarPromociones();
  }, [filtro]);

  async function cargarPromociones() {
    setCargando(true);
    try {
      const res = await fetch(`/api/admin/promociones/crud?filtro=${filtro}`);
      const data = await res.json();
      if (data.success) {
        setPromociones(data.promociones || []);
        setStats(data.stats);
      }
    } catch (err) {
      console.error('Error cargando promociones:', err);
    }
    setCargando(false);
  }

  async function ejecutarAccion(accion, id) {
    try {
      const res = await fetch('/api/admin/promociones/crud', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accion, id })
      });
      const data = await res.json();
      if (data.success) {
        setMensaje({ tipo: 'exito', texto: data.mensaje });
        cargarPromociones();
      } else {
        setMensaje({ tipo: 'error', texto: data.error });
      }
    } catch (err) {
      setMensaje({ tipo: 'error', texto: 'Error de conexión' });
    }
  }

  function calcularCTR(promo) {
    if (!promo.stats || promo.stats.vistas === 0) return '0%';
    const ctr = (promo.stats.clicks / promo.stats.vistas * 100).toFixed(1);
    return `${ctr}%`;
  }

  function formatearFecha(fecha) {
    if (!fecha) return 'Sin fecha';
    return new Date(fecha).toLocaleDateString('es-UY', {
      day: 'numeric', month: 'short', year: 'numeric'
    });
  }

  function diasRestantes(fechaFin) {
    if (!fechaFin) return null;
    const dias = Math.ceil((new Date(fechaFin) - new Date()) / (1000 * 60 * 60 * 24));
    if (dias < 0) return 'Expirada';
    if (dias === 0) return 'Hoy';
    return `${dias} días`;
  }

  return (
    <div className="admin-promociones">
      {/* Header */}
      <header className="admin-header">
        <div className="header-left">
          <a href="/admin" className="back-link">← Admin</a>
          <h1>Promociones Mágicas</h1>
        </div>
        <a href="/admin/promociones/nueva" className="btn-nueva">
          + Nueva Promoción
        </a>
      </header>

      {/* Mensaje */}
      {mensaje && (
        <div className={`mensaje ${mensaje.tipo}`}>
          {mensaje.texto}
          <button onClick={() => setMensaje(null)}>×</button>
        </div>
      )}

      <main className="admin-main">
        {/* Stats */}
        {stats && (
          <div className="stats-grid">
            <div className="stat-card" onClick={() => setFiltro('activas')}>
              <span className="stat-num">{stats.activas}</span>
              <span className="stat-label">Activas</span>
            </div>
            <div className="stat-card" onClick={() => setFiltro('programadas')}>
              <span className="stat-num">{stats.programadas}</span>
              <span className="stat-label">Programadas</span>
            </div>
            <div className="stat-card" onClick={() => setFiltro('pausadas')}>
              <span className="stat-num">{stats.pausadas}</span>
              <span className="stat-label">Pausadas</span>
            </div>
            <div className="stat-card" onClick={() => setFiltro('finalizadas')}>
              <span className="stat-num">{stats.finalizadas}</span>
              <span className="stat-label">Finalizadas</span>
            </div>
          </div>
        )}

        {/* Filtros */}
        <div className="filtros-bar">
          <div className="filtros">
            {['todas', 'activas', 'programadas', 'pausadas', 'finalizadas'].map(f => (
              <button
                key={f}
                className={filtro === f ? 'active' : ''}
                onClick={() => setFiltro(f)}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
          <div className="acciones-rapidas">
            <button className="btn-rapido" onClick={() => window.location.href = '/admin/promociones/nueva?tipo=relampago'}>
              ⚡ Promo Relámpago 24h
            </button>
          </div>
        </div>

        {/* Lista de Promociones */}
        {cargando ? (
          <div className="cargando">
            <div className="spinner"></div>
            <p>Cargando promociones...</p>
          </div>
        ) : promociones.length === 0 ? (
          <div className="sin-promociones">
            <p>No hay promociones {filtro !== 'todas' ? filtro : ''}</p>
            <a href="/admin/promociones/nueva" className="btn-crear">
              Crear primera promoción
            </a>
          </div>
        ) : (
          <div className="promociones-lista">
            {promociones.map(promo => (
              <div key={promo.id} className={`promo-card ${promo.estadoCalculado}`}>
                <div className="promo-header">
                  <div className="promo-titulo">
                    <span className="icono">{promo.icono || '★'}</span>
                    <h3>{promo.tituloInterno || promo.tituloBanner || 'Sin título'}</h3>
                  </div>
                  <span className={`badge-estado ${promo.estadoCalculado}`}>
                    {promo.estadoCalculado}
                  </span>
                </div>

                <div className="promo-info">
                  <div className="info-row">
                    <span className="label">Expira:</span>
                    <span className="value">
                      {promo.fechaFin ? (
                        <>
                          {formatearFecha(promo.fechaFin)}
                          {promo.estadoCalculado === 'activa' && (
                            <span className="dias-restantes">({diasRestantes(promo.fechaFin)})</span>
                          )}
                        </>
                      ) : 'Sin fecha'}
                    </span>
                  </div>
                  <div className="info-row">
                    <span className="label">Ubicaciones:</span>
                    <span className="value">
                      {promo.ubicaciones?.length > 0 ? promo.ubicaciones.join(', ') : 'Ninguna'}
                    </span>
                  </div>
                  <div className="info-row">
                    <span className="label">Audiencia:</span>
                    <span className="value">{promo.audiencia || 'Todos'}</span>
                  </div>
                  <div className="info-row stats-row">
                    <span className="stat">
                      <strong>{promo.stats?.vistas || 0}</strong> vistas
                    </span>
                    <span className="stat">
                      <strong>{promo.stats?.clicks || 0}</strong> clicks
                    </span>
                    <span className="stat ctr">
                      <strong>{calcularCTR(promo)}</strong> CTR
                    </span>
                  </div>
                </div>

                <div className="promo-acciones">
                  <a href={`/admin/promociones/nueva?editar=${promo.id}`} className="btn-accion">
                    Editar
                  </a>
                  {promo.estadoCalculado === 'activa' && (
                    <button onClick={() => ejecutarAccion('pausar', promo.id)} className="btn-accion pausar">
                      Pausar
                    </button>
                  )}
                  {promo.estadoCalculado === 'pausada' && (
                    <button onClick={() => ejecutarAccion('activar', promo.id)} className="btn-accion activar">
                      Activar
                    </button>
                  )}
                  <button onClick={() => ejecutarAccion('clonar', promo.id)} className="btn-accion">
                    Clonar
                  </button>
                  <button
                    onClick={() => {
                      if (confirm('¿Eliminar esta promoción?')) {
                        ejecutarAccion('eliminar', promo.id);
                      }
                    }}
                    className="btn-accion eliminar"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <style jsx>{`
        .admin-promociones {
          min-height: 100vh;
          background: #0f0f0f;
          color: #fff;
          font-family: 'Inter', -apple-system, sans-serif;
        }

        /* Header */
        .admin-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 30px;
          background: #1a1a1a;
          border-bottom: 1px solid #2a2a2a;
        }

        .header-left { display: flex; align-items: center; gap: 20px; }

        .back-link { color: #888; text-decoration: none; font-size: 14px; }
        .back-link:hover { color: #d4af37; }

        .admin-header h1 {
          font-size: 24px;
          font-weight: 600;
          margin: 0;
          background: linear-gradient(135deg, #d4af37, #e8d5a3);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .btn-nueva {
          background: linear-gradient(135deg, #d4af37, #b8972e);
          color: #000;
          padding: 12px 24px;
          border-radius: 8px;
          text-decoration: none;
          font-weight: 600;
          transition: all 0.2s;
        }

        .btn-nueva:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(212, 175, 55, 0.3);
        }

        /* Mensaje */
        .mensaje {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 15px 30px;
          font-size: 14px;
        }

        .mensaje.exito { background: rgba(46, 204, 113, 0.1); color: #2ecc71; }
        .mensaje.error { background: rgba(231, 76, 60, 0.1); color: #e74c3c; }

        .mensaje button {
          background: none;
          border: none;
          color: inherit;
          font-size: 20px;
          cursor: pointer;
        }

        /* Main */
        .admin-main { padding: 30px; max-width: 1200px; margin: 0 auto; }

        /* Stats */
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 15px;
          margin-bottom: 30px;
        }

        .stat-card {
          background: #1a1a1a;
          padding: 20px;
          border-radius: 12px;
          text-align: center;
          cursor: pointer;
          transition: all 0.2s;
          border: 1px solid transparent;
        }

        .stat-card:hover { border-color: #d4af37; }

        .stat-num {
          display: block;
          font-size: 32px;
          font-weight: 700;
          color: #d4af37;
        }

        .stat-label {
          font-size: 13px;
          color: #888;
        }

        /* Filtros */
        .filtros-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 25px;
        }

        .filtros { display: flex; gap: 8px; }

        .filtros button {
          background: transparent;
          border: 1px solid #333;
          color: #888;
          padding: 10px 20px;
          border-radius: 8px;
          cursor: pointer;
          font-size: 13px;
          transition: all 0.2s;
        }

        .filtros button:hover { border-color: #555; color: #fff; }
        .filtros button.active { background: #d4af37; border-color: #d4af37; color: #000; }

        .btn-rapido {
          background: #333;
          border: none;
          color: #fff;
          padding: 10px 20px;
          border-radius: 8px;
          cursor: pointer;
          font-size: 13px;
        }

        .btn-rapido:hover { background: #444; }

        /* Cargando */
        .cargando {
          text-align: center;
          padding: 60px;
          color: #666;
        }

        .spinner {
          width: 40px;
          height: 40px;
          border: 3px solid #333;
          border-top-color: #d4af37;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 15px;
        }

        @keyframes spin { to { transform: rotate(360deg); } }

        /* Sin promociones */
        .sin-promociones {
          text-align: center;
          padding: 60px;
          background: #1a1a1a;
          border-radius: 16px;
        }

        .sin-promociones p { color: #666; margin-bottom: 20px; }

        .btn-crear {
          display: inline-block;
          background: linear-gradient(135deg, #d4af37, #b8972e);
          color: #000;
          padding: 12px 24px;
          border-radius: 8px;
          text-decoration: none;
          font-weight: 600;
        }

        /* Lista de promociones */
        .promociones-lista {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .promo-card {
          background: #1a1a1a;
          border-radius: 16px;
          padding: 25px;
          border-left: 4px solid #333;
        }

        .promo-card.activa { border-left-color: #2ecc71; }
        .promo-card.programada { border-left-color: #3498db; }
        .promo-card.pausada { border-left-color: #f39c12; }
        .promo-card.finalizada { border-left-color: #666; }

        .promo-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 15px;
        }

        .promo-titulo {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .promo-titulo .icono { font-size: 24px; }

        .promo-titulo h3 {
          font-size: 18px;
          font-weight: 600;
          margin: 0;
        }

        .badge-estado {
          padding: 5px 12px;
          border-radius: 20px;
          font-size: 11px;
          text-transform: uppercase;
          font-weight: 600;
        }

        .badge-estado.activa { background: rgba(46, 204, 113, 0.2); color: #2ecc71; }
        .badge-estado.programada { background: rgba(52, 152, 219, 0.2); color: #3498db; }
        .badge-estado.pausada { background: rgba(243, 156, 18, 0.2); color: #f39c12; }
        .badge-estado.finalizada { background: #333; color: #888; }

        .promo-info {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-bottom: 20px;
        }

        .info-row {
          display: flex;
          gap: 10px;
          font-size: 13px;
        }

        .info-row .label { color: #888; }
        .info-row .value { color: #ccc; }

        .dias-restantes {
          margin-left: 8px;
          color: #f39c12;
          font-weight: 500;
        }

        .stats-row {
          margin-top: 10px;
          padding-top: 10px;
          border-top: 1px solid #252525;
        }

        .stats-row .stat {
          margin-right: 20px;
          color: #888;
        }

        .stats-row .stat strong { color: #fff; }

        .stats-row .ctr strong { color: #d4af37; }

        .promo-acciones {
          display: flex;
          gap: 10px;
          padding-top: 15px;
          border-top: 1px solid #252525;
        }

        .btn-accion {
          background: #252525;
          border: none;
          color: #888;
          padding: 8px 16px;
          border-radius: 6px;
          font-size: 13px;
          cursor: pointer;
          text-decoration: none;
          transition: all 0.2s;
        }

        .btn-accion:hover { background: #333; color: #fff; }

        .btn-accion.pausar:hover { background: #f39c12; color: #000; }
        .btn-accion.activar:hover { background: #2ecc71; color: #000; }
        .btn-accion.eliminar:hover { background: #e74c3c; color: #fff; }

        @media (max-width: 768px) {
          .stats-grid { grid-template-columns: repeat(2, 1fr); }
          .filtros-bar { flex-direction: column; gap: 15px; }
          .filtros { flex-wrap: wrap; }
          .promo-acciones { flex-wrap: wrap; }
        }
      `}</style>
    </div>
  );
}
