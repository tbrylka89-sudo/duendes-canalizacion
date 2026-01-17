'use client';
import { useState, useEffect } from 'react';

// ═══════════════════════════════════════════════════════════════════════════════
// ADMIN: PROMOCIONES AUTOMÁTICAS
// Configurar gatillos que activan promociones automáticamente
// ═══════════════════════════════════════════════════════════════════════════════

export default function PromocionesAutomaticas() {
  const [automaticas, setAutomaticas] = useState([]);
  const [gatillos, setGatillos] = useState([]);
  const [acciones, setAcciones] = useState([]);
  const [stats, setStats] = useState({});
  const [historial, setHistorial] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [mensaje, setMensaje] = useState(null);
  const [modalNueva, setModalNueva] = useState(false);
  const [modalHistorial, setModalHistorial] = useState(false);

  // Formulario nueva
  const [nueva, setNueva] = useState({
    nombre: '',
    gatillo: '',
    configuracionGatillo: {},
    accionPromo: '',
    configuracionAccion: {},
    limite: 'una_vez'
  });

  useEffect(() => {
    cargarDatos();
  }, []);

  async function cargarDatos() {
    setCargando(true);
    try {
      const res = await fetch('/api/admin/promociones/automaticas');
      const data = await res.json();
      if (data.success) {
        setAutomaticas(data.automaticas);
        setGatillos(data.gatillos);
        setAcciones(data.acciones);
        setStats(data.stats);
        setHistorial(data.historial);
      }
    } catch (e) {
      console.error('Error cargando:', e);
    }
    setCargando(false);
  }

  async function crearAutomatica() {
    if (!nueva.nombre || !nueva.gatillo || !nueva.accionPromo) {
      setMensaje({ tipo: 'error', texto: 'Completá nombre, gatillo y acción' });
      return;
    }

    try {
      const res = await fetch('/api/admin/promociones/automaticas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accion: 'crear', ...nueva })
      });

      const data = await res.json();
      if (data.success) {
        setAutomaticas([...automaticas, data.automatica]);
        setModalNueva(false);
        setNueva({ nombre: '', gatillo: '', configuracionGatillo: {}, accionPromo: '', configuracionAccion: {}, limite: 'una_vez' });
        setMensaje({ tipo: 'exito', texto: data.mensaje });
      } else {
        setMensaje({ tipo: 'error', texto: data.error });
      }
    } catch (e) {
      setMensaje({ tipo: 'error', texto: 'Error creando' });
    }
  }

  async function toggleActiva(id) {
    try {
      const res = await fetch('/api/admin/promociones/automaticas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accion: 'toggle', id })
      });

      const data = await res.json();
      if (data.success) {
        setAutomaticas(automaticas.map(a =>
          a.id === id ? { ...a, activa: data.activa } : a
        ));
      }
    } catch (e) {
      console.error('Error:', e);
    }
  }

  async function eliminar(id) {
    if (!confirm('¿Eliminar esta promoción automática?')) return;

    try {
      const res = await fetch('/api/admin/promociones/automaticas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accion: 'eliminar', id })
      });

      const data = await res.json();
      if (data.success) {
        setAutomaticas(automaticas.filter(a => a.id !== id));
        setMensaje({ tipo: 'exito', texto: 'Eliminada' });
      }
    } catch (e) {
      setMensaje({ tipo: 'error', texto: 'Error eliminando' });
    }
  }

  function formatearFecha(fecha) {
    return new Date(fecha).toLocaleDateString('es-UY', {
      day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
    });
  }

  if (cargando) {
    return (
      <div style={{ minHeight: '100vh', background: '#0f0f0f', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#d4af37' }}>
        Cargando...
      </div>
    );
  }

  return (
    <div className="auto-page">
      <header className="auto-header">
        <div className="header-left">
          <a href="/admin/promociones" className="back-link">← Promociones</a>
          <h1>Promociones Automáticas</h1>
        </div>
        <div className="header-right">
          <button onClick={() => setModalHistorial(true)} className="btn-historial">Ver historial</button>
          <button onClick={() => setModalNueva(true)} className="btn-nueva">+ Nueva regla</button>
        </div>
      </header>

      {mensaje && (
        <div className={`mensaje ${mensaje.tipo}`}>
          {mensaje.texto}
          <button onClick={() => setMensaje(null)}>×</button>
        </div>
      )}

      {/* Stats */}
      <div className="stats-row">
        <div className="stat"><span className="num">{stats.total || 0}</span><span className="label">Total</span></div>
        <div className="stat activas"><span className="num">{stats.activas || 0}</span><span className="label">Activas</span></div>
        <div className="stat"><span className="num">{stats.pausadas || 0}</span><span className="label">Pausadas</span></div>
      </div>

      {/* Lista */}
      <main className="auto-lista">
        {automaticas.length === 0 ? (
          <div className="sin-datos">
            <span>⚡</span>
            <h3>Sin promociones automáticas</h3>
            <p>Crea reglas que se activen automáticamente cuando se cumplan condiciones.</p>
            <button onClick={() => setModalNueva(true)}>Crear primera regla</button>
          </div>
        ) : (
          automaticas.map(auto => (
            <div key={auto.id} className={`auto-card ${auto.activa ? 'activa' : 'pausada'}`}>
              <div className="auto-estado">
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={auto.activa}
                    onChange={() => toggleActiva(auto.id)}
                  />
                  <span className="slider"></span>
                </label>
              </div>

              <div className="auto-content">
                <h3>{auto.nombre}</h3>
                <div className="auto-regla">
                  <span className="gatillo">
                    {gatillos.find(g => g.id === auto.gatillo)?.icono} {gatillos.find(g => g.id === auto.gatillo)?.nombre}
                  </span>
                  <span className="flecha">→</span>
                  <span className="accion">
                    {acciones.find(a => a.id === auto.accionPromo)?.icono} {acciones.find(a => a.id === auto.accionPromo)?.nombre}
                  </span>
                </div>
                <div className="auto-meta">
                  <span>Límite: {auto.limite === 'una_vez' ? '1 vez' : auto.limite}</span>
                  <span>•</span>
                  <span>Activaciones: {auto.activaciones || 0}</span>
                  <span>•</span>
                  <span>Creada: {formatearFecha(auto.creadaEn)}</span>
                </div>
              </div>

              <button onClick={() => eliminar(auto.id)} className="btn-eliminar">×</button>
            </div>
          ))
        )}
      </main>

      {/* Modal Nueva */}
      {modalNueva && (
        <div className="modal-overlay" onClick={() => setModalNueva(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2>Nueva Promoción Automática</h2>

            <div className="form-group">
              <label>Nombre de la regla</label>
              <input
                type="text"
                value={nueva.nombre}
                onChange={e => setNueva({ ...nueva, nombre: e.target.value })}
                placeholder="Ej: Descuento de cumpleaños"
              />
            </div>

            <div className="form-group">
              <label>Gatillo (¿Cuándo se activa?)</label>
              <div className="opciones-grid">
                {gatillos.map(g => (
                  <button
                    key={g.id}
                    className={`opcion-btn ${nueva.gatillo === g.id ? 'activo' : ''}`}
                    onClick={() => setNueva({ ...nueva, gatillo: g.id })}
                  >
                    <span>{g.icono}</span>
                    <span>{g.nombre}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Configuración específica del gatillo */}
            {nueva.gatillo === 'inactividad' && (
              <div className="form-group">
                <label>Días de inactividad</label>
                <input
                  type="number"
                  value={nueva.configuracionGatillo.dias || 30}
                  onChange={e => setNueva({ ...nueva, configuracionGatillo: { dias: parseInt(e.target.value) } })}
                  min={1}
                />
              </div>
            )}

            {nueva.gatillo === 'treboles' && (
              <div className="form-group">
                <label>Cantidad de tréboles</label>
                <input
                  type="number"
                  value={nueva.configuracionGatillo.cantidad || 100}
                  onChange={e => setNueva({ ...nueva, configuracionGatillo: { cantidad: parseInt(e.target.value) } })}
                  min={1}
                />
              </div>
            )}

            <div className="form-group">
              <label>Acción (¿Qué hacer?)</label>
              <div className="opciones-grid">
                {acciones.map(a => (
                  <button
                    key={a.id}
                    className={`opcion-btn ${nueva.accionPromo === a.id ? 'activo' : ''}`}
                    onClick={() => setNueva({ ...nueva, accionPromo: a.id })}
                  >
                    <span>{a.icono}</span>
                    <span>{a.nombre}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Configuración específica de la acción */}
            {nueva.accionPromo === 'cupon' && (
              <div className="form-group">
                <label>Código del cupón</label>
                <input
                  type="text"
                  value={nueva.configuracionAccion.cupon || ''}
                  onChange={e => setNueva({ ...nueva, configuracionAccion: { ...nueva.configuracionAccion, cupon: e.target.value.toUpperCase() } })}
                  placeholder="CUMPLE20"
                />
              </div>
            )}

            {(nueva.accionPromo === 'treboles' || nueva.accionPromo === 'runas') && (
              <div className="form-group">
                <label>Cantidad a regalar</label>
                <input
                  type="number"
                  value={nueva.configuracionAccion.cantidad || 10}
                  onChange={e => setNueva({ ...nueva, configuracionAccion: { cantidad: parseInt(e.target.value) } })}
                  min={1}
                />
              </div>
            )}

            <div className="form-group">
              <label>Límite por usuario</label>
              <select
                value={nueva.limite}
                onChange={e => setNueva({ ...nueva, limite: e.target.value })}
              >
                <option value="una_vez">Una sola vez</option>
                <option value="mensual">Una vez por mes</option>
                <option value="anual">Una vez por año</option>
                <option value="ilimitado">Sin límite</option>
              </select>
            </div>

            <div className="modal-actions">
              <button onClick={() => setModalNueva(false)}>Cancelar</button>
              <button onClick={crearAutomatica} className="btn-crear">Crear regla</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Historial */}
      {modalHistorial && (
        <div className="modal-overlay" onClick={() => setModalHistorial(false)}>
          <div className="modal modal-historial" onClick={e => e.stopPropagation()}>
            <h2>Historial de Activaciones</h2>
            <div className="historial-lista">
              {historial.length === 0 ? (
                <p className="sin-historial">No hay activaciones registradas</p>
              ) : (
                historial.map((h, i) => (
                  <div key={i} className="historial-item">
                    <div className="hist-info">
                      <span className="hist-nombre">{h.nombreAuto}</span>
                      <span className="hist-email">{h.email}</span>
                    </div>
                    <div className="hist-meta">
                      <span>{formatearFecha(h.fecha)}</span>
                      {h.manual && <span className="badge-manual">Manual</span>}
                    </div>
                  </div>
                ))
              )}
            </div>
            <button onClick={() => setModalHistorial(false)} className="btn-cerrar">Cerrar</button>
          </div>
        </div>
      )}

      <style jsx>{`
        .auto-page {
          min-height: 100vh;
          background: #0f0f0f;
          color: #fff;
          font-family: 'Inter', -apple-system, sans-serif;
        }

        .auto-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 30px;
          background: #1a1a1a;
          border-bottom: 1px solid #2a2a2a;
        }

        .header-left { display: flex; align-items: center; gap: 20px; }
        .header-right { display: flex; gap: 10px; }
        .back-link { color: #888; text-decoration: none; }

        .auto-header h1 {
          font-size: 24px;
          margin: 0;
          background: linear-gradient(135deg, #d4af37, #e8d5a3);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .btn-historial {
          padding: 10px 20px;
          background: #333;
          border: none;
          border-radius: 8px;
          color: #888;
          cursor: pointer;
        }

        .btn-nueva {
          padding: 10px 20px;
          background: #d4af37;
          border: none;
          border-radius: 8px;
          color: #000;
          font-weight: 600;
          cursor: pointer;
        }

        .mensaje {
          padding: 15px 30px;
          display: flex;
          justify-content: space-between;
        }

        .mensaje.exito { background: rgba(46, 204, 113, 0.1); color: #2ecc71; }
        .mensaje.error { background: rgba(231, 76, 60, 0.1); color: #e74c3c; }
        .mensaje button { background: none; border: none; color: inherit; cursor: pointer; }

        .stats-row {
          display: flex;
          gap: 20px;
          padding: 20px 30px;
        }

        .stat {
          background: #1a1a1a;
          border-radius: 12px;
          padding: 20px 30px;
          text-align: center;
        }

        .stat .num { display: block; font-size: 2rem; font-weight: 700; }
        .stat .label { color: #888; font-size: 0.85rem; }
        .stat.activas .num { color: #27ae60; }

        .auto-lista { padding: 0 30px 30px; display: flex; flex-direction: column; gap: 15px; }

        .sin-datos {
          text-align: center;
          padding: 60px;
          background: #1a1a1a;
          border-radius: 12px;
        }

        .sin-datos span { font-size: 3rem; }
        .sin-datos h3 { margin: 1rem 0 0.5rem; }
        .sin-datos p { color: #888; margin-bottom: 1.5rem; }
        .sin-datos button { padding: 12px 24px; background: #d4af37; border: none; border-radius: 8px; cursor: pointer; }

        .auto-card {
          display: flex;
          align-items: center;
          gap: 20px;
          background: #1a1a1a;
          border-radius: 12px;
          padding: 20px;
          border-left: 4px solid #27ae60;
        }

        .auto-card.pausada { border-left-color: #888; opacity: 0.7; }

        .switch {
          position: relative;
          width: 50px;
          height: 28px;
        }

        .switch input { opacity: 0; width: 0; height: 0; }

        .slider {
          position: absolute;
          cursor: pointer;
          inset: 0;
          background: #333;
          border-radius: 28px;
          transition: 0.3s;
        }

        .slider::before {
          content: '';
          position: absolute;
          height: 22px;
          width: 22px;
          left: 3px;
          bottom: 3px;
          background: #fff;
          border-radius: 50%;
          transition: 0.3s;
        }

        .switch input:checked + .slider { background: #27ae60; }
        .switch input:checked + .slider::before { transform: translateX(22px); }

        .auto-content { flex: 1; }
        .auto-content h3 { margin: 0 0 10px; font-size: 1.1rem; }

        .auto-regla {
          display: flex;
          align-items: center;
          gap: 15px;
          margin-bottom: 10px;
        }

        .gatillo, .accion {
          background: #252525;
          padding: 8px 15px;
          border-radius: 8px;
          font-size: 0.9rem;
        }

        .flecha { color: #d4af37; }

        .auto-meta {
          display: flex;
          gap: 10px;
          font-size: 0.85rem;
          color: #888;
        }

        .btn-eliminar {
          background: none;
          border: 1px solid #e74c3c;
          color: #e74c3c;
          width: 35px;
          height: 35px;
          border-radius: 8px;
          cursor: pointer;
          font-size: 1.2rem;
        }

        /* Modal */
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .modal {
          background: #1a1a1a;
          border-radius: 16px;
          padding: 30px;
          width: 90%;
          max-width: 600px;
          max-height: 90vh;
          overflow-y: auto;
        }

        .modal h2 { margin: 0 0 25px; color: #d4af37; }

        .form-group { margin-bottom: 20px; }
        .form-group label { display: block; color: #888; margin-bottom: 8px; font-size: 0.9rem; }

        .form-group input, .form-group select {
          width: 100%;
          padding: 12px;
          background: #252525;
          border: 1px solid #333;
          border-radius: 8px;
          color: #fff;
          font-size: 14px;
        }

        .opciones-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 10px;
        }

        .opcion-btn {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px;
          background: #252525;
          border: 2px solid transparent;
          border-radius: 8px;
          cursor: pointer;
          color: #aaa;
          font-size: 0.85rem;
          text-align: left;
        }

        .opcion-btn:hover { border-color: #444; }
        .opcion-btn.activo { border-color: #d4af37; color: #fff; }
        .opcion-btn span:first-child { font-size: 1.2rem; }

        .modal-actions {
          display: flex;
          justify-content: flex-end;
          gap: 15px;
          margin-top: 25px;
        }

        .modal-actions button {
          padding: 12px 25px;
          border-radius: 8px;
          cursor: pointer;
        }

        .modal-actions button:first-child { background: #333; border: none; color: #888; }
        .btn-crear { background: #d4af37; border: none; color: #000; font-weight: 600; }

        .modal-historial { max-width: 500px; }

        .historial-lista { max-height: 400px; overflow-y: auto; }

        .sin-historial { color: #666; text-align: center; padding: 30px; }

        .historial-item {
          display: flex;
          justify-content: space-between;
          padding: 15px;
          background: #252525;
          border-radius: 8px;
          margin-bottom: 10px;
        }

        .hist-nombre { display: block; color: #fff; font-weight: 500; }
        .hist-email { font-size: 0.85rem; color: #888; }
        .hist-meta { text-align: right; font-size: 0.85rem; color: #888; }

        .badge-manual {
          background: #d4af37;
          color: #000;
          padding: 2px 8px;
          border-radius: 4px;
          font-size: 0.7rem;
          margin-left: 10px;
        }

        .btn-cerrar {
          width: 100%;
          margin-top: 20px;
          padding: 12px;
          background: #333;
          border: none;
          border-radius: 8px;
          color: #fff;
          cursor: pointer;
        }

        @media (max-width: 768px) {
          .opciones-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}
