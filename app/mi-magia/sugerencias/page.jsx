'use client';
import { useState, useEffect } from 'react';

// ═══════════════════════════════════════════════════════════════════════════════
// BUZÓN DE SUGERENCIAS - Usuario
// Enviar y votar sugerencias
// ═══════════════════════════════════════════════════════════════════════════════

const CATEGORIAS = [
  { id: 'contenido', nombre: 'Contenido', icono: '◆' },
  { id: 'productos', nombre: 'Productos', icono: '★' },
  { id: 'portal', nombre: 'Portal Mi Magia', icono: '◇' },
  { id: 'comunidad', nombre: 'Comunidad', icono: '●' },
  { id: 'otro', nombre: 'Otro', icono: '○' }
];

const ESTADOS = {
  nueva: { nombre: 'Nueva', color: '#888' },
  en_evaluacion: { nombre: 'En evaluación', color: '#f39c12' },
  en_proceso: { nombre: 'En proceso', color: '#3498db' },
  implementada: { nombre: 'Implementada', color: '#27ae60' },
  descartada: { nombre: 'Descartada', color: '#e74c3c' }
};

export default function Sugerencias() {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [sugerencias, setSugerencias] = useState([]);
  const [stats, setStats] = useState({});
  const [filtroCategoria, setFiltroCategoria] = useState('todas');
  const [vista, setVista] = useState('lista'); // lista, nueva
  const [mensaje, setMensaje] = useState(null);

  // Formulario nueva sugerencia
  const [nueva, setNueva] = useState({ titulo: '', descripcion: '', categoria: 'otro', anonimo: false });
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    verificarUsuario();
    cargarSugerencias();
  }, []);

  useEffect(() => {
    cargarSugerencias();
  }, [filtroCategoria]);

  async function verificarUsuario() {
    const token = localStorage.getItem('duendes_token');
    if (!token) {
      setCargando(false);
      return;
    }

    try {
      const res = await fetch(`/api/mi-magia/magic-link/verify?token=${token}`);
      const data = await res.json();
      if (data.success && data.usuario) {
        setUsuario(data.usuario);
      }
    } catch (e) {
      console.error('Error verificando usuario:', e);
    }
    setCargando(false);
  }

  async function cargarSugerencias() {
    try {
      const params = new URLSearchParams();
      if (filtroCategoria !== 'todas') params.append('categoria', filtroCategoria);

      const res = await fetch(`/api/sugerencias?${params}`);
      const data = await res.json();
      if (data.success) {
        setSugerencias(data.sugerencias);
        setStats(data.stats);
      }
    } catch (e) {
      console.error('Error cargando sugerencias:', e);
    }
  }

  async function enviarSugerencia() {
    if (!nueva.titulo.trim() || !nueva.descripcion.trim()) {
      setMensaje({ tipo: 'error', texto: 'Completá título y descripción' });
      return;
    }

    setEnviando(true);
    try {
      const res = await fetch('/api/sugerencias', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accion: 'enviar',
          email: usuario?.email,
          nombre: usuario?.nombre,
          ...nueva
        })
      });

      const data = await res.json();
      if (data.success) {
        setMensaje({ tipo: 'exito', texto: data.mensaje });
        setNueva({ titulo: '', descripcion: '', categoria: 'otro', anonimo: false });
        setVista('lista');
        cargarSugerencias();
      } else {
        setMensaje({ tipo: 'error', texto: data.error });
      }
    } catch (e) {
      setMensaje({ tipo: 'error', texto: 'Error enviando sugerencia' });
    }
    setEnviando(false);
  }

  async function votar(sugerenciaId) {
    if (!usuario) {
      setMensaje({ tipo: 'error', texto: 'Iniciá sesión para votar' });
      return;
    }

    try {
      const res = await fetch('/api/sugerencias', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accion: 'votar',
          sugerenciaId,
          email: usuario.email
        })
      });

      const data = await res.json();
      if (data.success) {
        setSugerencias(sugerencias.map(s =>
          s.id === sugerenciaId
            ? {
                ...s,
                votos: data.votos,
                votantes: data.votado
                  ? [...(s.votantes || []), usuario.email]
                  : (s.votantes || []).filter(e => e !== usuario.email)
              }
            : s
        ));
      }
    } catch (e) {
      console.error('Error votando:', e);
    }
  }

  function formatearFecha(fecha) {
    const d = new Date(fecha);
    return d.toLocaleDateString('es-UY', { day: 'numeric', month: 'short', year: 'numeric' });
  }

  return (
    <div className="sugerencias-page">
      {/* Header */}
      <header className="sugerencias-header">
        <a href="/mi-magia" className="link-volver">← Mi Magia</a>
        <h1>Buzón de Sugerencias</h1>
        <p>Tu voz importa. Ayudanos a crear la magia que necesitás.</p>
      </header>

      {/* Mensaje */}
      {mensaje && (
        <div className={`mensaje ${mensaje.tipo}`}>
          {mensaje.texto}
          <button onClick={() => setMensaje(null)}>×</button>
        </div>
      )}

      <main className="sugerencias-main">
        {/* Stats */}
        <div className="stats-row">
          <div className="stat-card">
            <span className="stat-num">{stats.total || 0}</span>
            <span className="stat-label">Total</span>
          </div>
          <div className="stat-card">
            <span className="stat-num">{stats.implementadas || 0}</span>
            <span className="stat-label">Implementadas</span>
          </div>
          <div className="stat-card">
            <span className="stat-num">{stats.enProceso || 0}</span>
            <span className="stat-label">En proceso</span>
          </div>
        </div>

        {/* Acciones */}
        <div className="acciones-row">
          <div className="filtros">
            <select
              value={filtroCategoria}
              onChange={e => setFiltroCategoria(e.target.value)}
            >
              <option value="todas">Todas las categorías</option>
              {CATEGORIAS.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.nombre}</option>
              ))}
            </select>
          </div>
          <button className="btn-nueva" onClick={() => setVista('nueva')}>
            + Nueva sugerencia
          </button>
        </div>

        {/* Vista: Lista */}
        {vista === 'lista' && (
          <div className="sugerencias-lista">
            {sugerencias.length === 0 ? (
              <div className="sin-sugerencias">
                <span>◇</span>
                <h3>Sin sugerencias aún</h3>
                <p>Sé el primero en compartir una idea</p>
                <button onClick={() => setVista('nueva')}>Enviar sugerencia</button>
              </div>
            ) : (
              sugerencias.map(sug => (
                <div key={sug.id} className={`sugerencia-card estado-${sug.estado}`}>
                  <div className="sug-votos">
                    <button
                      className={`btn-votar ${(sug.votantes || []).includes(usuario?.email) ? 'votado' : ''}`}
                      onClick={() => votar(sug.id)}
                    >
                      ▲
                    </button>
                    <span className="votos-num">{sug.votos || 0}</span>
                  </div>

                  <div className="sug-content">
                    <div className="sug-header">
                      <span className="sug-categoria">
                        {CATEGORIAS.find(c => c.id === sug.categoria)?.icono} {CATEGORIAS.find(c => c.id === sug.categoria)?.nombre}
                      </span>
                      <span className="sug-estado" style={{ color: ESTADOS[sug.estado]?.color }}>
                        {ESTADOS[sug.estado]?.nombre}
                      </span>
                    </div>

                    <h3>{sug.titulo}</h3>
                    <p>{sug.descripcion}</p>

                    <div className="sug-meta">
                      <span>{sug.anonimo ? 'Anónimo' : (sug.autor?.nombre || 'Usuario')}</span>
                      <span>•</span>
                      <span>{formatearFecha(sug.creadaEn)}</span>
                    </div>

                    {sug.respuestaAdmin && (
                      <div className="sug-respuesta">
                        <strong>Respuesta del equipo:</strong>
                        <p>{sug.respuestaAdmin.texto}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Vista: Nueva sugerencia */}
        {vista === 'nueva' && (
          <div className="nueva-sugerencia">
            <h2>Nueva Sugerencia</h2>

            <div className="form-group">
              <label>Categoría</label>
              <div className="categorias-grid">
                {CATEGORIAS.map(cat => (
                  <button
                    key={cat.id}
                    className={`cat-btn ${nueva.categoria === cat.id ? 'activo' : ''}`}
                    onClick={() => setNueva({ ...nueva, categoria: cat.id })}
                  >
                    <span>{cat.icono}</span>
                    <span>{cat.nombre}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label>Título</label>
              <input
                type="text"
                value={nueva.titulo}
                onChange={e => setNueva({ ...nueva, titulo: e.target.value })}
                placeholder="Resumí tu idea en una frase"
                maxLength={200}
              />
            </div>

            <div className="form-group">
              <label>Descripción</label>
              <textarea
                value={nueva.descripcion}
                onChange={e => setNueva({ ...nueva, descripcion: e.target.value })}
                placeholder="Contanos más detalles sobre tu sugerencia..."
                rows={5}
                maxLength={2000}
              />
              <small>{nueva.descripcion.length}/2000</small>
            </div>

            <label className="checkbox-anonimo">
              <input
                type="checkbox"
                checked={nueva.anonimo}
                onChange={e => setNueva({ ...nueva, anonimo: e.target.checked })}
              />
              <span>Enviar de forma anónima</span>
            </label>

            <div className="form-actions">
              <button onClick={() => setVista('lista')} className="btn-cancelar">Cancelar</button>
              <button
                onClick={enviarSugerencia}
                disabled={enviando || !nueva.titulo.trim() || !nueva.descripcion.trim()}
                className="btn-enviar"
              >
                {enviando ? 'Enviando...' : 'Enviar sugerencia'}
              </button>
            </div>
          </div>
        )}
      </main>

      <style jsx>{`
        .sugerencias-page {
          min-height: 100vh;
          background: linear-gradient(180deg, #faf8f3 0%, #fff 100%);
          font-family: 'Cormorant Garamond', Georgia, serif;
        }

        .sugerencias-header {
          background: linear-gradient(135deg, #1a1a1a 0%, #2a2520 100%);
          color: #fff;
          padding: 2rem;
          text-align: center;
        }

        .link-volver {
          position: absolute;
          left: 2rem;
          top: 2rem;
          color: rgba(255,255,255,0.7);
          text-decoration: none;
        }

        .link-volver:hover { color: #d4af37; }

        .sugerencias-header h1 {
          font-family: 'Cinzel', serif;
          font-size: 2rem;
          margin: 0;
          background: linear-gradient(135deg, #d4af37, #e8d5a3);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .sugerencias-header p { color: rgba(255,255,255,0.7); margin: 0.5rem 0 0; }

        .mensaje {
          padding: 1rem 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .mensaje.exito { background: rgba(46, 204, 113, 0.1); color: #27ae60; }
        .mensaje.error { background: rgba(231, 76, 60, 0.1); color: #e74c3c; }
        .mensaje button { background: none; border: none; font-size: 1.2rem; cursor: pointer; color: inherit; }

        .sugerencias-main { padding: 2rem; max-width: 800px; margin: 0 auto; }

        .stats-row {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .stat-card {
          background: #fff;
          border: 1px solid #f0e6d3;
          border-radius: 12px;
          padding: 1.25rem;
          text-align: center;
        }

        .stat-num {
          display: block;
          font-family: 'Cinzel', serif;
          font-size: 2rem;
          color: #d4af37;
        }

        .stat-label { color: #666; font-size: 0.9rem; }

        .acciones-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
          gap: 1rem;
        }

        .filtros select {
          padding: 10px 15px;
          border: 1px solid #e0d6c3;
          border-radius: 8px;
          font-size: 0.95rem;
          background: #fff;
        }

        .btn-nueva {
          padding: 12px 24px;
          background: linear-gradient(135deg, #d4af37, #b8962e);
          color: #1a1a1a;
          border: none;
          border-radius: 8px;
          font-family: 'Cinzel', serif;
          font-weight: 600;
          cursor: pointer;
        }

        .sugerencias-lista { display: flex; flex-direction: column; gap: 1rem; }

        .sin-sugerencias {
          text-align: center;
          padding: 3rem;
          background: #fff;
          border-radius: 12px;
        }

        .sin-sugerencias span { font-size: 3rem; color: #d4af37; }
        .sin-sugerencias h3 { font-family: 'Cinzel', serif; margin: 1rem 0 0.5rem; }
        .sin-sugerencias p { color: #666; margin-bottom: 1.5rem; }
        .sin-sugerencias button { padding: 12px 24px; background: #d4af37; border: none; border-radius: 8px; cursor: pointer; }

        .sugerencia-card {
          display: flex;
          gap: 1.5rem;
          background: #fff;
          border: 1px solid #f0e6d3;
          border-radius: 12px;
          padding: 1.5rem;
        }

        .sugerencia-card.estado-implementada { border-left: 4px solid #27ae60; }
        .sugerencia-card.estado-en_proceso { border-left: 4px solid #3498db; }

        .sug-votos {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.25rem;
        }

        .btn-votar {
          width: 40px;
          height: 40px;
          background: #f5f5f5;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          font-size: 1.2rem;
          cursor: pointer;
          color: #888;
          transition: all 0.2s;
        }

        .btn-votar:hover { background: #fff5eb; border-color: #d4af37; color: #d4af37; }
        .btn-votar.votado { background: #fff5eb; border-color: #d4af37; color: #d4af37; }

        .votos-num { font-weight: 600; color: #1a1a1a; }

        .sug-content { flex: 1; }

        .sug-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.75rem;
        }

        .sug-categoria { color: #888; font-size: 0.85rem; }
        .sug-estado { font-size: 0.85rem; font-weight: 600; }

        .sug-content h3 {
          font-family: 'Cinzel', serif;
          margin: 0 0 0.5rem;
          color: #1a1a1a;
          font-size: 1.1rem;
        }

        .sug-content p { color: #555; margin: 0 0 0.75rem; line-height: 1.6; }

        .sug-meta { font-size: 0.85rem; color: #999; display: flex; gap: 0.5rem; }

        .sug-respuesta {
          margin-top: 1rem;
          padding: 1rem;
          background: #f8f8f5;
          border-radius: 8px;
          border-left: 3px solid #d4af37;
        }

        .sug-respuesta strong { color: #d4af37; font-size: 0.9rem; }
        .sug-respuesta p { margin: 0.5rem 0 0; color: #555; }

        /* Nueva sugerencia */
        .nueva-sugerencia {
          background: #fff;
          border-radius: 16px;
          padding: 2rem;
          border: 1px solid #f0e6d3;
        }

        .nueva-sugerencia h2 {
          font-family: 'Cinzel', serif;
          margin: 0 0 1.5rem;
          color: #1a1a1a;
        }

        .form-group { margin-bottom: 1.5rem; }
        .form-group label { display: block; font-weight: 600; color: #1a1a1a; margin-bottom: 0.5rem; }

        .categorias-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
          gap: 0.75rem;
        }

        .cat-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          padding: 1rem;
          background: #f8f8f5;
          border: 1px solid #e0d6c3;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .cat-btn:hover { border-color: #d4af37; }
        .cat-btn.activo { background: #fff5eb; border-color: #d4af37; }
        .cat-btn span:first-child { font-size: 1.5rem; }

        .form-group input, .form-group textarea {
          width: 100%;
          padding: 12px;
          border: 1px solid #e0d6c3;
          border-radius: 8px;
          font-family: inherit;
          font-size: 1rem;
        }

        .form-group small { color: #999; font-size: 0.85rem; }

        .checkbox-anonimo {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          cursor: pointer;
          margin-bottom: 1.5rem;
        }

        .checkbox-anonimo input { width: 18px; height: 18px; accent-color: #d4af37; }

        .form-actions { display: flex; justify-content: flex-end; gap: 1rem; }

        .btn-cancelar {
          padding: 12px 24px;
          background: #f5f5f5;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          cursor: pointer;
        }

        .btn-enviar {
          padding: 12px 24px;
          background: linear-gradient(135deg, #d4af37, #b8962e);
          color: #1a1a1a;
          border: none;
          border-radius: 8px;
          font-family: 'Cinzel', serif;
          font-weight: 600;
          cursor: pointer;
        }

        .btn-enviar:disabled { opacity: 0.5; cursor: not-allowed; }

        @media (max-width: 768px) {
          .stats-row { grid-template-columns: 1fr; }
          .acciones-row { flex-direction: column; }
          .sugerencia-card { flex-direction: column; }
          .sug-votos { flex-direction: row; }
          .categorias-grid { grid-template-columns: repeat(2, 1fr); }
        }
      `}</style>
    </div>
  );
}
