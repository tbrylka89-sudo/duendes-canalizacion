'use client';
import { useState, useEffect } from 'react';

// ═══════════════════════════════════════════════════════════════════════════════
// PANEL DE INTELIGENCIA DE USUARIOS
// Dashboard completo con estadísticas, filtros y acciones
// ═══════════════════════════════════════════════════════════════════════════════

const CLASIFICACIONES = [
  { id: 'diamante', emoji: '💎', nombre: 'Diamante', color: '#00d4ff' },
  { id: 'oro', emoji: '🥇', nombre: 'Oro', color: '#d4af37' },
  { id: 'plata', emoji: '🥈', nombre: 'Plata', color: '#c0c0c0' },
  { id: 'bronce', emoji: '🥉', nombre: 'Bronce', color: '#cd7f32' }
];

const INTERESES = [
  { id: 'cristales', emoji: '💎', nombre: 'Cristales' },
  { id: 'runas', emoji: 'ᚱ', nombre: 'Runas' },
  { id: 'tarot', emoji: '🃏', nombre: 'Tarot' },
  { id: 'meditacion', emoji: '🧘', nombre: 'Meditación' },
  { id: 'rituales', emoji: '🕯', nombre: 'Rituales' },
  { id: 'luna', emoji: '🌙', nombre: 'Ciclos lunares' }
];

const OBJETIVOS = [
  { id: 'proteccion', emoji: '🛡', nombre: 'Protección' },
  { id: 'abundancia', emoji: '✨', nombre: 'Abundancia' },
  { id: 'amor', emoji: '💕', nombre: 'Amor' },
  { id: 'sanacion', emoji: '💚', nombre: 'Sanación' },
  { id: 'guia', emoji: '🧭', nombre: 'Guía' },
  { id: 'paz', emoji: '☮', nombre: 'Paz' }
];

export default function InteligenciaPage() {
  const [usuarios, setUsuarios] = useState([]);
  const [estadisticas, setEstadisticas] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [filtros, setFiltros] = useState({
    clasificacion: '',
    interes: '',
    busca: '',
    q: ''
  });
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
  const [modalAccion, setModalAccion] = useState(null);

  useEffect(() => {
    cargarDatos();
  }, [filtros]);

  async function cargarDatos() {
    setCargando(true);
    try {
      const params = new URLSearchParams();
      if (filtros.clasificacion) params.set('clasificacion', filtros.clasificacion);
      if (filtros.interes) params.set('interes', filtros.interes);
      if (filtros.busca) params.set('busca', filtros.busca);
      if (filtros.q) params.set('q', filtros.q);

      const res = await fetch(`/api/admin/inteligencia?${params}`);
      const data = await res.json();

      if (data.success) {
        setUsuarios(data.usuarios);
        setEstadisticas(data.estadisticas);
      }
    } catch (err) {
      console.error('Error cargando datos:', err);
    } finally {
      setCargando(false);
    }
  }

  async function ejecutarAccion(accion, datos) {
    try {
      const res = await fetch('/api/admin/inteligencia', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accion,
          email: usuarioSeleccionado?.email,
          datos
        })
      });
      const data = await res.json();

      if (data.success) {
        alert(data.mensaje || 'Acción completada');
        setModalAccion(null);
        cargarDatos();
      } else {
        alert('Error: ' + data.error);
      }
    } catch (err) {
      alert('Error de conexión');
    }
  }

  return (
    <div className="inteligencia-page">
      {/* Header */}
      <header className="header">
        <h1>🧠 Inteligencia de Usuarios</h1>
        <p>Panel de análisis y segmentación</p>
      </header>

      {/* Estadísticas */}
      {estadisticas && (
        <section className="stats-section">
          <div className="stats-grid">
            <div className="stat-card total">
              <span className="stat-number">{estadisticas.total}</span>
              <span className="stat-label">Total Usuarios</span>
            </div>
            <div className="stat-card activos">
              <span className="stat-number">{estadisticas.activos7dias}</span>
              <span className="stat-label">Activos (7 días)</span>
            </div>
            <div className="stat-card compras">
              <span className="stat-number">{estadisticas.conCompras}</span>
              <span className="stat-label">Con compras</span>
            </div>
            <div className="stat-card conversion">
              <span className="stat-number">
                {estadisticas.total > 0 ? Math.round((estadisticas.conCompras / estadisticas.total) * 100) : 0}%
              </span>
              <span className="stat-label">Conversión</span>
            </div>
          </div>

          {/* Distribución por clasificación */}
          <div className="clasificacion-grid">
            {CLASIFICACIONES.map(c => (
              <div
                key={c.id}
                className={`clasificacion-card ${filtros.clasificacion === c.id ? 'activo' : ''}`}
                onClick={() => setFiltros(f => ({ ...f, clasificacion: f.clasificacion === c.id ? '' : c.id }))}
                style={{ borderColor: c.color }}
              >
                <span className="clasif-emoji">{c.emoji}</span>
                <span className="clasif-nombre">{c.nombre}</span>
                <span className="clasif-count" style={{ color: c.color }}>
                  {estadisticas.porClasificacion[c.id] || 0}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Filtros */}
      <section className="filtros-section">
        <div className="filtros-row">
          <input
            type="text"
            placeholder="🔍 Buscar por nombre o email..."
            value={filtros.q}
            onChange={e => setFiltros(f => ({ ...f, q: e.target.value }))}
            className="busqueda-input"
          />

          <select
            value={filtros.interes}
            onChange={e => setFiltros(f => ({ ...f, interes: e.target.value }))}
            className="filtro-select"
          >
            <option value="">Todos los intereses</option>
            {INTERESES.map(i => (
              <option key={i.id} value={i.id}>{i.emoji} {i.nombre}</option>
            ))}
          </select>

          <select
            value={filtros.busca}
            onChange={e => setFiltros(f => ({ ...f, busca: e.target.value }))}
            className="filtro-select"
          >
            <option value="">Todos los objetivos</option>
            {OBJETIVOS.map(o => (
              <option key={o.id} value={o.id}>{o.emoji} {o.nombre}</option>
            ))}
          </select>

          <button onClick={() => setFiltros({ clasificacion: '', interes: '', busca: '', q: '' })} className="btn-limpiar">
            Limpiar filtros
          </button>
        </div>
      </section>

      {/* Lista de usuarios */}
      <section className="usuarios-section">
        {cargando ? (
          <div className="cargando">Cargando usuarios...</div>
        ) : (
          <table className="usuarios-tabla">
            <thead>
              <tr>
                <th>Usuario</th>
                <th>Clasificación</th>
                <th>Intereses</th>
                <th>Busca</th>
                <th>Runas</th>
                <th>Tréboles</th>
                <th>Compras</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map(u => (
                <tr key={u.email} onClick={() => setUsuarioSeleccionado(u)}>
                  <td>
                    <div className="usuario-info">
                      <strong>{u.nombre}</strong>
                      <small>{u.email}</small>
                      {u.pais && <span className="pais-tag">{u.pais}</span>}
                    </div>
                  </td>
                  <td>
                    <span className="clasif-badge" style={{
                      background: u.clasificacionColor + '20',
                      color: u.clasificacionColor,
                      borderColor: u.clasificacionColor
                    }}>
                      {u.clasificacionEmoji} {u.clasificacion}
                    </span>
                  </td>
                  <td>
                    <div className="tags">
                      {u.intereses.slice(0, 3).map(i => (
                        <span key={i} className="tag">{INTERESES.find(x => x.id === i)?.emoji || i}</span>
                      ))}
                      {u.intereses.length > 3 && <span className="tag">+{u.intereses.length - 3}</span>}
                    </div>
                  </td>
                  <td>
                    <div className="tags">
                      {u.busca.slice(0, 2).map(b => (
                        <span key={b} className="tag">{OBJETIVOS.find(x => x.id === b)?.emoji || b}</span>
                      ))}
                    </div>
                  </td>
                  <td><span className="runas-badge">ᚱ {u.runas}</span></td>
                  <td><span className="treboles-badge">☘ {u.treboles}</span></td>
                  <td>
                    {u.compras > 0 ? (
                      <span className="compras-badge">{u.compras} (${u.totalGastado})</span>
                    ) : (
                      <span className="sin-compras">-</span>
                    )}
                  </td>
                  <td>
                    <div className="acciones-btns">
                      <button onClick={(e) => { e.stopPropagation(); setUsuarioSeleccionado(u); setModalAccion('regalar'); }} title="Regalar">🎁</button>
                      <button onClick={(e) => { e.stopPropagation(); setUsuarioSeleccionado(u); setModalAccion('mensaje'); }} title="Mensaje">💬</button>
                      <button onClick={(e) => { e.stopPropagation(); setUsuarioSeleccionado(u); setModalAccion('nota'); }} title="Nota">📝</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      {/* Modal de detalle de usuario */}
      {usuarioSeleccionado && !modalAccion && (
        <div className="modal-overlay" onClick={() => setUsuarioSeleccionado(null)}>
          <div className="modal-usuario" onClick={e => e.stopPropagation()}>
            <button className="modal-cerrar" onClick={() => setUsuarioSeleccionado(null)}>✕</button>

            <div className="usuario-header">
              <div className="usuario-avatar" style={{ background: usuarioSeleccionado.clasificacionColor }}>
                {usuarioSeleccionado.clasificacionEmoji}
              </div>
              <div>
                <h2>{usuarioSeleccionado.nombre}</h2>
                <p>{usuarioSeleccionado.email}</p>
                <span className="clasif-badge-lg" style={{ background: usuarioSeleccionado.clasificacionColor }}>
                  {usuarioSeleccionado.clasificacion}
                </span>
              </div>
            </div>

            <div className="usuario-stats">
              <div className="stat-mini"><strong>{usuarioSeleccionado.runas}</strong><span>Runas</span></div>
              <div className="stat-mini"><strong>{usuarioSeleccionado.treboles}</strong><span>Tréboles</span></div>
              <div className="stat-mini"><strong>{usuarioSeleccionado.compras}</strong><span>Compras</span></div>
              <div className="stat-mini"><strong>${usuarioSeleccionado.totalGastado}</strong><span>Total</span></div>
            </div>

            <div className="usuario-detalles">
              <div className="detalle-grupo">
                <h4>Intereses</h4>
                <div className="tags-full">
                  {usuarioSeleccionado.intereses.map(i => (
                    <span key={i} className="tag-full">{INTERESES.find(x => x.id === i)?.emoji} {i}</span>
                  ))}
                </div>
              </div>

              <div className="detalle-grupo">
                <h4>Qué busca</h4>
                <div className="tags-full">
                  {usuarioSeleccionado.busca.map(b => (
                    <span key={b} className="tag-full">{OBJETIVOS.find(x => x.id === b)?.emoji} {b}</span>
                  ))}
                </div>
              </div>

              {usuarioSeleccionado.objetivo && (
                <div className="detalle-grupo">
                  <h4>Objetivo principal</h4>
                  <p className="objetivo-texto">{usuarioSeleccionado.objetivo}</p>
                </div>
              )}

              <div className="detalle-grupo">
                <h4>Información</h4>
                <ul className="info-lista">
                  <li><strong>País:</strong> {usuarioSeleccionado.pais || 'No especificado'}</li>
                  <li><strong>Cómo llegó:</strong> {usuarioSeleccionado.comoLlego || 'No especificado'}</li>
                  <li><strong>Experiencia:</strong> {usuarioSeleccionado.experiencia || 'No especificado'}</li>
                  <li><strong>Guardianes:</strong> {usuarioSeleccionado.guardianes}</li>
                  <li><strong>Círculo:</strong> {usuarioSeleccionado.esCirculo ? `Sí (hasta ${usuarioSeleccionado.circuloExpira})` : 'No'}</li>
                </ul>
              </div>
            </div>

            <div className="usuario-acciones">
              <button onClick={() => setModalAccion('regalar')} className="btn-accion regalar">🎁 Regalar</button>
              <button onClick={() => setModalAccion('mensaje')} className="btn-accion mensaje">💬 Mensaje Tito</button>
              <button onClick={() => setModalAccion('nota')} className="btn-accion nota">📝 Agregar nota</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de acciones */}
      {modalAccion && usuarioSeleccionado && (
        <ModalAccion
          tipo={modalAccion}
          usuario={usuarioSeleccionado}
          onCerrar={() => setModalAccion(null)}
          onEjecutar={ejecutarAccion}
        />
      )}

      <style jsx>{`
        .inteligencia-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #0a0a0a, #1a1a1a);
          color: #fff;
          font-family: 'Cormorant Garamond', serif;
          padding: 20px;
        }
        .header {
          text-align: center;
          padding: 30px 0;
          border-bottom: 1px solid rgba(212, 175, 55, 0.2);
          margin-bottom: 30px;
        }
        .header h1 {
          font-family: 'Cinzel', serif;
          font-size: 2rem;
          color: #d4af37;
          margin: 0 0 10px;
        }
        .header p {
          color: rgba(255, 255, 255, 0.6);
          margin: 0;
        }

        .stats-section {
          margin-bottom: 30px;
        }
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 15px;
          margin-bottom: 20px;
        }
        .stat-card {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 20px;
          text-align: center;
        }
        .stat-number {
          display: block;
          font-size: 2rem;
          font-weight: 600;
          color: #d4af37;
        }
        .stat-label {
          font-size: 0.85rem;
          color: rgba(255, 255, 255, 0.6);
        }

        .clasificacion-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 15px;
        }
        .clasificacion-card {
          background: rgba(255, 255, 255, 0.03);
          border: 2px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 15px;
          text-align: center;
          cursor: pointer;
          transition: all 0.3s;
        }
        .clasificacion-card:hover, .clasificacion-card.activo {
          background: rgba(255, 255, 255, 0.08);
        }
        .clasif-emoji { font-size: 1.5rem; display: block; margin-bottom: 5px; }
        .clasif-nombre { font-size: 0.9rem; display: block; margin-bottom: 5px; }
        .clasif-count { font-size: 1.5rem; font-weight: 600; }

        .filtros-section {
          margin-bottom: 20px;
        }
        .filtros-row {
          display: flex;
          gap: 15px;
          flex-wrap: wrap;
        }
        .busqueda-input {
          flex: 1;
          min-width: 250px;
          padding: 12px 15px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 8px;
          color: #fff;
          font-size: 14px;
        }
        .filtro-select {
          padding: 12px 15px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 8px;
          color: #fff;
          font-size: 14px;
          min-width: 180px;
        }
        .btn-limpiar {
          padding: 12px 20px;
          background: transparent;
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 8px;
          color: rgba(255, 255, 255, 0.7);
          cursor: pointer;
        }

        .usuarios-section {
          background: rgba(255, 255, 255, 0.03);
          border-radius: 12px;
          overflow: hidden;
        }
        .cargando {
          text-align: center;
          padding: 40px;
          color: rgba(255, 255, 255, 0.5);
        }
        .usuarios-tabla {
          width: 100%;
          border-collapse: collapse;
        }
        .usuarios-tabla th {
          background: rgba(0, 0, 0, 0.3);
          padding: 15px;
          text-align: left;
          font-size: 0.85rem;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: #d4af37;
        }
        .usuarios-tabla td {
          padding: 15px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          vertical-align: middle;
        }
        .usuarios-tabla tr:hover {
          background: rgba(255, 255, 255, 0.03);
          cursor: pointer;
        }
        .usuario-info strong { display: block; }
        .usuario-info small { color: rgba(255, 255, 255, 0.5); font-size: 0.8rem; }
        .pais-tag {
          display: inline-block;
          background: rgba(212, 175, 55, 0.1);
          color: #d4af37;
          font-size: 0.7rem;
          padding: 2px 6px;
          border-radius: 4px;
          margin-top: 3px;
        }
        .clasif-badge {
          display: inline-block;
          padding: 4px 10px;
          border-radius: 15px;
          font-size: 0.8rem;
          border: 1px solid;
        }
        .tags { display: flex; gap: 5px; flex-wrap: wrap; }
        .tag {
          background: rgba(255, 255, 255, 0.1);
          padding: 3px 8px;
          border-radius: 10px;
          font-size: 0.8rem;
        }
        .runas-badge { color: #d4af37; }
        .treboles-badge { color: #4ade80; }
        .compras-badge { color: #60a5fa; }
        .sin-compras { color: rgba(255, 255, 255, 0.3); }
        .acciones-btns {
          display: flex;
          gap: 5px;
        }
        .acciones-btns button {
          background: rgba(255, 255, 255, 0.05);
          border: none;
          padding: 8px;
          border-radius: 8px;
          cursor: pointer;
          font-size: 1rem;
        }
        .acciones-btns button:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
        }
        .modal-usuario {
          background: #1a1a1a;
          border: 1px solid rgba(212, 175, 55, 0.3);
          border-radius: 20px;
          padding: 30px;
          max-width: 600px;
          width: 100%;
          max-height: 80vh;
          overflow-y: auto;
          position: relative;
        }
        .modal-cerrar {
          position: absolute;
          top: 15px;
          right: 15px;
          background: none;
          border: none;
          color: #888;
          font-size: 1.5rem;
          cursor: pointer;
        }
        .usuario-header {
          display: flex;
          align-items: center;
          gap: 20px;
          margin-bottom: 25px;
        }
        .usuario-avatar {
          width: 70px;
          height: 70px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2rem;
        }
        .usuario-header h2 {
          margin: 0 0 5px;
          font-family: 'Cinzel', serif;
          color: #d4af37;
        }
        .usuario-header p {
          margin: 0 0 10px;
          color: rgba(255, 255, 255, 0.6);
        }
        .clasif-badge-lg {
          display: inline-block;
          padding: 5px 15px;
          border-radius: 20px;
          font-size: 0.85rem;
          text-transform: capitalize;
        }
        .usuario-stats {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 15px;
          margin-bottom: 25px;
        }
        .stat-mini {
          text-align: center;
          background: rgba(255, 255, 255, 0.03);
          padding: 15px;
          border-radius: 10px;
        }
        .stat-mini strong {
          display: block;
          font-size: 1.3rem;
          color: #d4af37;
        }
        .stat-mini span {
          font-size: 0.8rem;
          color: rgba(255, 255, 255, 0.5);
        }
        .usuario-detalles {
          margin-bottom: 25px;
        }
        .detalle-grupo {
          margin-bottom: 20px;
        }
        .detalle-grupo h4 {
          color: #d4af37;
          font-size: 0.9rem;
          margin: 0 0 10px;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        .tags-full {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }
        .tag-full {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          padding: 6px 12px;
          border-radius: 15px;
          font-size: 0.9rem;
        }
        .objetivo-texto {
          background: rgba(255, 255, 255, 0.03);
          padding: 15px;
          border-radius: 10px;
          font-style: italic;
          line-height: 1.6;
        }
        .info-lista {
          list-style: none;
          padding: 0;
        }
        .info-lista li {
          padding: 8px 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }
        .info-lista strong {
          color: rgba(255, 255, 255, 0.6);
          margin-right: 10px;
        }
        .usuario-acciones {
          display: flex;
          gap: 10px;
        }
        .btn-accion {
          flex: 1;
          padding: 12px;
          border: none;
          border-radius: 10px;
          cursor: pointer;
          font-family: 'Cinzel', serif;
          font-size: 0.9rem;
          transition: all 0.3s;
        }
        .btn-accion.regalar {
          background: linear-gradient(135deg, #d4af37, #b8972e);
          color: #0a0a0a;
        }
        .btn-accion.mensaje {
          background: rgba(96, 165, 250, 0.2);
          color: #60a5fa;
          border: 1px solid rgba(96, 165, 250, 0.3);
        }
        .btn-accion.nota {
          background: rgba(74, 222, 128, 0.2);
          color: #4ade80;
          border: 1px solid rgba(74, 222, 128, 0.3);
        }

        @media (max-width: 768px) {
          .stats-grid { grid-template-columns: repeat(2, 1fr); }
          .clasificacion-grid { grid-template-columns: repeat(2, 1fr); }
          .filtros-row { flex-direction: column; }
          .usuarios-tabla { font-size: 0.85rem; }
          .usuario-stats { grid-template-columns: repeat(2, 1fr); }
        }
      `}</style>
    </div>
  );
}

// Modal de acciones
function ModalAccion({ tipo, usuario, onCerrar, onEjecutar }) {
  const [cantidad, setCantidad] = useState(50);
  const [mensaje, setMensaje] = useState('');
  const [nota, setNota] = useState('');
  const [tipoRegalo, setTipoRegalo] = useState('runas');

  function handleEjecutar() {
    switch (tipo) {
      case 'regalar':
        onEjecutar(tipoRegalo === 'runas' ? 'regalar_runas' : 'regalar_treboles', { cantidad });
        break;
      case 'mensaje':
        onEjecutar('enviar_mensaje_tito', { mensaje });
        break;
      case 'nota':
        onEjecutar('agregar_nota', { nota });
        break;
    }
  }

  return (
    <div className="modal-overlay" onClick={onCerrar}>
      <div className="modal-accion" onClick={e => e.stopPropagation()}>
        <button className="modal-cerrar" onClick={onCerrar}>✕</button>

        {tipo === 'regalar' && (
          <>
            <h3>🎁 Regalar a {usuario.nombre}</h3>
            <div className="form-grupo">
              <label>Tipo de regalo</label>
              <div className="radio-grupo">
                <label>
                  <input type="radio" checked={tipoRegalo === 'runas'} onChange={() => setTipoRegalo('runas')} />
                  Runas ᚱ
                </label>
                <label>
                  <input type="radio" checked={tipoRegalo === 'treboles'} onChange={() => setTipoRegalo('treboles')} />
                  Tréboles ☘
                </label>
              </div>
            </div>
            <div className="form-grupo">
              <label>Cantidad</label>
              <input type="number" value={cantidad} onChange={e => setCantidad(parseInt(e.target.value) || 0)} />
            </div>
          </>
        )}

        {tipo === 'mensaje' && (
          <>
            <h3>💬 Mensaje via Tito</h3>
            <p className="nota-info">Tito le mostrará este mensaje la próxima vez que entre a Mi Magia</p>
            <div className="form-grupo">
              <label>Mensaje</label>
              <textarea value={mensaje} onChange={e => setMensaje(e.target.value)} rows={4} placeholder="Escribe el mensaje que Tito le dirá..." />
            </div>
          </>
        )}

        {tipo === 'nota' && (
          <>
            <h3>📝 Agregar nota interna</h3>
            <p className="nota-info">Solo visible para administradores</p>
            <div className="form-grupo">
              <label>Nota</label>
              <textarea value={nota} onChange={e => setNota(e.target.value)} rows={4} placeholder="Escribe una nota sobre este usuario..." />
            </div>
          </>
        )}

        <button onClick={handleEjecutar} className="btn-ejecutar">Confirmar</button>

        <style jsx>{`
          .modal-accion {
            background: #1a1a1a;
            border: 1px solid rgba(212, 175, 55, 0.3);
            border-radius: 20px;
            padding: 30px;
            max-width: 450px;
            width: 100%;
            position: relative;
          }
          .modal-cerrar {
            position: absolute;
            top: 15px;
            right: 15px;
            background: none;
            border: none;
            color: #888;
            font-size: 1.5rem;
            cursor: pointer;
          }
          h3 {
            font-family: 'Cinzel', serif;
            color: #d4af37;
            margin: 0 0 20px;
          }
          .nota-info {
            color: rgba(255, 255, 255, 0.5);
            font-size: 0.9rem;
            margin: 0 0 20px;
          }
          .form-grupo {
            margin-bottom: 20px;
          }
          .form-grupo label {
            display: block;
            margin-bottom: 8px;
            color: rgba(255, 255, 255, 0.8);
          }
          .form-grupo input, .form-grupo textarea {
            width: 100%;
            padding: 12px;
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.15);
            border-radius: 8px;
            color: #fff;
            font-size: 14px;
            font-family: inherit;
          }
          .radio-grupo {
            display: flex;
            gap: 20px;
          }
          .radio-grupo label {
            display: flex;
            align-items: center;
            gap: 8px;
            cursor: pointer;
          }
          .btn-ejecutar {
            width: 100%;
            padding: 15px;
            background: linear-gradient(135deg, #d4af37, #b8972e);
            color: #0a0a0a;
            border: none;
            border-radius: 10px;
            font-family: 'Cinzel', serif;
            font-size: 1rem;
            font-weight: 600;
            cursor: pointer;
          }
        `}</style>
      </div>
    </div>
  );
}
