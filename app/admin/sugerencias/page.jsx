'use client';
import { useState, useEffect } from 'react';

// ═══════════════════════════════════════════════════════════════════════════════
// ADMIN: GESTIÓN DE SUGERENCIAS
// Ver, filtrar, cambiar estado y responder sugerencias
// ═══════════════════════════════════════════════════════════════════════════════

const CATEGORIAS = [
  { id: 'contenido', nombre: 'Contenido' },
  { id: 'productos', nombre: 'Productos' },
  { id: 'portal', nombre: 'Portal' },
  { id: 'comunidad', nombre: 'Comunidad' },
  { id: 'otro', nombre: 'Otro' }
];

const ESTADOS = [
  { id: 'nueva', nombre: 'Nueva', color: '#888' },
  { id: 'en_evaluacion', nombre: 'En evaluación', color: '#f39c12' },
  { id: 'en_proceso', nombre: 'En proceso', color: '#3498db' },
  { id: 'implementada', nombre: 'Implementada', color: '#27ae60' },
  { id: 'descartada', nombre: 'Descartada', color: '#e74c3c' }
];

export default function AdminSugerencias() {
  const [sugerencias, setSugerencias] = useState([]);
  const [stats, setStats] = useState({});
  const [filtroCategoria, setFiltroCategoria] = useState('todas');
  const [filtroEstado, setFiltroEstado] = useState('todos');
  const [mensaje, setMensaje] = useState(null);
  const [cargando, setCargando] = useState(true);

  // Modal responder
  const [modalRespuesta, setModalRespuesta] = useState(null);
  const [respuesta, setRespuesta] = useState('');

  useEffect(() => {
    cargarSugerencias();
  }, [filtroCategoria, filtroEstado]);

  async function cargarSugerencias() {
    setCargando(true);
    try {
      const params = new URLSearchParams({ admin: 'true' });
      if (filtroCategoria !== 'todas') params.append('categoria', filtroCategoria);
      if (filtroEstado !== 'todos') params.append('estado', filtroEstado);

      const res = await fetch(`/api/sugerencias?${params}`);
      const data = await res.json();
      if (data.success) {
        setSugerencias(data.sugerencias);
        setStats(data.stats);
      }
    } catch (e) {
      console.error('Error cargando sugerencias:', e);
    }
    setCargando(false);
  }

  async function cambiarEstado(sugerenciaId, nuevoEstado) {
    try {
      const res = await fetch('/api/sugerencias', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accion: 'cambiar-estado',
          sugerenciaId,
          estado: nuevoEstado
        })
      });

      const data = await res.json();
      if (data.success) {
        setSugerencias(sugerencias.map(s =>
          s.id === sugerenciaId ? { ...s, estado: nuevoEstado } : s
        ));
        setMensaje({ tipo: 'exito', texto: 'Estado actualizado' });
      }
    } catch (e) {
      setMensaje({ tipo: 'error', texto: 'Error actualizando estado' });
    }
  }

  async function enviarRespuesta() {
    if (!respuesta.trim()) return;

    try {
      const res = await fetch('/api/sugerencias', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accion: 'responder',
          sugerenciaId: modalRespuesta.id,
          respuesta
        })
      });

      const data = await res.json();
      if (data.success) {
        setSugerencias(sugerencias.map(s =>
          s.id === modalRespuesta.id
            ? { ...s, respuestaAdmin: { texto: respuesta, fecha: new Date().toISOString() } }
            : s
        ));
        setModalRespuesta(null);
        setRespuesta('');
        setMensaje({ tipo: 'exito', texto: 'Respuesta guardada' });
      }
    } catch (e) {
      setMensaje({ tipo: 'error', texto: 'Error guardando respuesta' });
    }
  }

  async function togglePublica(sugerenciaId) {
    try {
      const res = await fetch('/api/sugerencias', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accion: 'toggle-publica', sugerenciaId })
      });

      const data = await res.json();
      if (data.success) {
        setSugerencias(sugerencias.map(s =>
          s.id === sugerenciaId ? { ...s, publica: data.publica } : s
        ));
      }
    } catch (e) {
      console.error('Error:', e);
    }
  }

  async function eliminar(sugerenciaId) {
    if (!confirm('¿Eliminar esta sugerencia?')) return;

    try {
      const res = await fetch('/api/sugerencias', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accion: 'eliminar', sugerenciaId })
      });

      const data = await res.json();
      if (data.success) {
        setSugerencias(sugerencias.filter(s => s.id !== sugerenciaId));
        setMensaje({ tipo: 'exito', texto: 'Sugerencia eliminada' });
      }
    } catch (e) {
      setMensaje({ tipo: 'error', texto: 'Error eliminando' });
    }
  }

  function exportarCSV() {
    const headers = ['ID', 'Título', 'Descripción', 'Categoría', 'Estado', 'Votos', 'Autor', 'Fecha'];
    const rows = sugerencias.map(s => [
      s.id,
      `"${s.titulo.replace(/"/g, '""')}"`,
      `"${s.descripcion.replace(/"/g, '""')}"`,
      s.categoria,
      s.estado,
      s.votos || 0,
      s.anonimo ? 'Anónimo' : (s.autor?.email || 'N/A'),
      new Date(s.creadaEn).toLocaleDateString()
    ]);

    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `sugerencias_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  }

  function formatearFecha(fecha) {
    return new Date(fecha).toLocaleDateString('es-UY', {
      day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  }

  return (
    <div className="admin-sugerencias">
      {/* Header */}
      <header className="admin-header">
        <div className="header-left">
          <a href="/admin" className="back-link">← Admin</a>
          <h1>Sugerencias</h1>
        </div>
        <button onClick={exportarCSV} className="btn-exportar">Exportar CSV</button>
      </header>

      {/* Mensaje */}
      {mensaje && (
        <div className={`mensaje ${mensaje.tipo}`}>
          {mensaje.texto}
          <button onClick={() => setMensaje(null)}>×</button>
        </div>
      )}

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card"><span className="num">{stats.total || 0}</span><span className="label">Total</span></div>
        <div className="stat-card nueva"><span className="num">{stats.nuevas || 0}</span><span className="label">Nuevas</span></div>
        <div className="stat-card evaluacion"><span className="num">{stats.enEvaluacion || 0}</span><span className="label">En evaluación</span></div>
        <div className="stat-card proceso"><span className="num">{stats.enProceso || 0}</span><span className="label">En proceso</span></div>
        <div className="stat-card implementada"><span className="num">{stats.implementadas || 0}</span><span className="label">Implementadas</span></div>
      </div>

      {/* Filtros */}
      <div className="filtros">
        <select value={filtroCategoria} onChange={e => setFiltroCategoria(e.target.value)}>
          <option value="todas">Todas las categorías</option>
          {CATEGORIAS.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
        </select>
        <select value={filtroEstado} onChange={e => setFiltroEstado(e.target.value)}>
          <option value="todos">Todos los estados</option>
          {ESTADOS.map(e => <option key={e.id} value={e.id}>{e.nombre}</option>)}
        </select>
      </div>

      {/* Lista */}
      <main className="sugerencias-lista">
        {cargando ? (
          <div className="cargando">Cargando...</div>
        ) : sugerencias.length === 0 ? (
          <div className="sin-datos">No hay sugerencias con estos filtros</div>
        ) : (
          sugerencias.map(sug => (
            <div key={sug.id} className={`sug-card ${sug.estado}`}>
              <div className="sug-main">
                <div className="sug-top">
                  <span className="sug-cat">{sug.categoria}</span>
                  <span className="sug-votos">▲ {sug.votos || 0}</span>
                  <span className={`sug-visibilidad ${sug.publica ? '' : 'oculta'}`}>
                    {sug.publica ? 'Pública' : 'Oculta'}
                  </span>
                </div>

                <h3>{sug.titulo}</h3>
                <p>{sug.descripcion}</p>

                <div className="sug-meta">
                  <span>{sug.anonimo ? 'Anónimo' : (sug.autor?.nombre || sug.autor?.email || 'Usuario')}</span>
                  <span>•</span>
                  <span>{formatearFecha(sug.creadaEn)}</span>
                </div>

                {sug.respuestaAdmin && (
                  <div className="sug-respuesta-existente">
                    <strong>Tu respuesta:</strong> {sug.respuestaAdmin.texto}
                  </div>
                )}
              </div>

              <div className="sug-acciones">
                <select
                  value={sug.estado}
                  onChange={e => cambiarEstado(sug.id, e.target.value)}
                  className="select-estado"
                >
                  {ESTADOS.map(e => <option key={e.id} value={e.id}>{e.nombre}</option>)}
                </select>

                <button onClick={() => { setModalRespuesta(sug); setRespuesta(sug.respuestaAdmin?.texto || ''); }} className="btn-responder">
                  {sug.respuestaAdmin ? 'Editar respuesta' : 'Responder'}
                </button>

                <button onClick={() => togglePublica(sug.id)} className="btn-toggle">
                  {sug.publica ? 'Ocultar' : 'Publicar'}
                </button>

                <button onClick={() => eliminar(sug.id)} className="btn-eliminar">×</button>
              </div>
            </div>
          ))
        )}
      </main>

      {/* Modal Respuesta */}
      {modalRespuesta && (
        <div className="modal-overlay" onClick={() => setModalRespuesta(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3>Responder a: {modalRespuesta.titulo}</h3>
            <textarea
              value={respuesta}
              onChange={e => setRespuesta(e.target.value)}
              placeholder="Escribe tu respuesta pública..."
              rows={4}
            />
            <div className="modal-actions">
              <button onClick={() => setModalRespuesta(null)}>Cancelar</button>
              <button onClick={enviarRespuesta} className="btn-guardar">Guardar respuesta</button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .admin-sugerencias {
          min-height: 100vh;
          background: #0f0f0f;
          color: #fff;
          font-family: 'Inter', -apple-system, sans-serif;
        }

        .admin-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 30px;
          background: #1a1a1a;
          border-bottom: 1px solid #2a2a2a;
        }

        .header-left { display: flex; align-items: center; gap: 20px; }
        .back-link { color: #888; text-decoration: none; }
        .back-link:hover { color: #d4af37; }

        .admin-header h1 {
          font-size: 24px;
          margin: 0;
          background: linear-gradient(135deg, #d4af37, #e8d5a3);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .btn-exportar {
          padding: 10px 20px;
          background: #333;
          border: none;
          border-radius: 8px;
          color: #fff;
          cursor: pointer;
        }

        .btn-exportar:hover { background: #444; }

        .mensaje {
          padding: 15px 30px;
          display: flex;
          justify-content: space-between;
        }

        .mensaje.exito { background: rgba(46, 204, 113, 0.1); color: #2ecc71; }
        .mensaje.error { background: rgba(231, 76, 60, 0.1); color: #e74c3c; }
        .mensaje button { background: none; border: none; color: inherit; font-size: 20px; cursor: pointer; }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 15px;
          padding: 20px 30px;
        }

        .stat-card {
          background: #1a1a1a;
          border-radius: 12px;
          padding: 20px;
          text-align: center;
        }

        .stat-card .num { display: block; font-size: 2rem; font-weight: 700; }
        .stat-card .label { color: #888; font-size: 0.85rem; }

        .stat-card.nueva .num { color: #888; }
        .stat-card.evaluacion .num { color: #f39c12; }
        .stat-card.proceso .num { color: #3498db; }
        .stat-card.implementada .num { color: #27ae60; }

        .filtros {
          display: flex;
          gap: 15px;
          padding: 0 30px 20px;
        }

        .filtros select {
          padding: 10px 15px;
          background: #252525;
          border: 1px solid #333;
          border-radius: 8px;
          color: #fff;
          font-size: 14px;
        }

        .sugerencias-lista {
          padding: 0 30px 30px;
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .cargando, .sin-datos {
          text-align: center;
          padding: 50px;
          color: #666;
        }

        .sug-card {
          background: #1a1a1a;
          border-radius: 12px;
          padding: 20px;
          display: flex;
          justify-content: space-between;
          gap: 20px;
          border-left: 4px solid #333;
        }

        .sug-card.nueva { border-left-color: #888; }
        .sug-card.en_evaluacion { border-left-color: #f39c12; }
        .sug-card.en_proceso { border-left-color: #3498db; }
        .sug-card.implementada { border-left-color: #27ae60; }
        .sug-card.descartada { border-left-color: #e74c3c; opacity: 0.7; }

        .sug-main { flex: 1; }

        .sug-top {
          display: flex;
          gap: 15px;
          margin-bottom: 10px;
          font-size: 0.85rem;
        }

        .sug-cat {
          background: #252525;
          padding: 4px 10px;
          border-radius: 4px;
          color: #888;
        }

        .sug-votos { color: #d4af37; }

        .sug-visibilidad { color: #27ae60; }
        .sug-visibilidad.oculta { color: #e74c3c; }

        .sug-card h3 {
          margin: 0 0 10px;
          font-size: 1.1rem;
          color: #fff;
        }

        .sug-card p {
          color: #aaa;
          margin: 0 0 10px;
          line-height: 1.5;
        }

        .sug-meta { font-size: 0.85rem; color: #666; display: flex; gap: 8px; }

        .sug-respuesta-existente {
          margin-top: 15px;
          padding: 12px;
          background: #252525;
          border-radius: 8px;
          font-size: 0.9rem;
          border-left: 3px solid #d4af37;
        }

        .sug-respuesta-existente strong { color: #d4af37; }

        .sug-acciones {
          display: flex;
          flex-direction: column;
          gap: 10px;
          min-width: 150px;
        }

        .select-estado {
          padding: 8px 12px;
          background: #252525;
          border: 1px solid #333;
          border-radius: 6px;
          color: #fff;
          font-size: 13px;
        }

        .btn-responder {
          padding: 8px 12px;
          background: #d4af37;
          border: none;
          border-radius: 6px;
          color: #000;
          font-weight: 600;
          cursor: pointer;
          font-size: 13px;
        }

        .btn-toggle {
          padding: 8px 12px;
          background: #333;
          border: none;
          border-radius: 6px;
          color: #888;
          cursor: pointer;
          font-size: 13px;
        }

        .btn-toggle:hover { background: #444; color: #fff; }

        .btn-eliminar {
          padding: 8px;
          background: transparent;
          border: 1px solid #e74c3c;
          border-radius: 6px;
          color: #e74c3c;
          cursor: pointer;
          font-size: 16px;
        }

        .btn-eliminar:hover { background: rgba(231, 76, 60, 0.1); }

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
          padding: 25px;
          width: 90%;
          max-width: 500px;
        }

        .modal h3 {
          margin: 0 0 15px;
          color: #d4af37;
        }

        .modal textarea {
          width: 100%;
          padding: 15px;
          background: #252525;
          border: 1px solid #333;
          border-radius: 8px;
          color: #fff;
          font-family: inherit;
          font-size: 14px;
          resize: vertical;
        }

        .modal-actions {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          margin-top: 15px;
        }

        .modal-actions button {
          padding: 10px 20px;
          border-radius: 8px;
          cursor: pointer;
        }

        .modal-actions button:first-child {
          background: #333;
          border: none;
          color: #888;
        }

        .btn-guardar {
          background: #d4af37;
          border: none;
          color: #000;
          font-weight: 600;
        }

        @media (max-width: 768px) {
          .stats-grid { grid-template-columns: repeat(2, 1fr); }
          .sug-card { flex-direction: column; }
          .sug-acciones { flex-direction: row; flex-wrap: wrap; }
        }
      `}</style>
    </div>
  );
}
