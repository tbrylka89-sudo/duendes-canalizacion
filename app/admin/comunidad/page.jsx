'use client';
import { useState, useEffect } from 'react';

// ═══════════════════════════════════════════════════════════════════════════════
// ADMIN: GESTIÓN DE COMUNIDAD SIMULADA (BOTS)
// Panel para administrar perfiles ficticios, posts y actividad
// ═══════════════════════════════════════════════════════════════════════════════

export default function AdminComunidadPage() {
  const [tab, setTab] = useState('posts');
  const [posts, setPosts] = useState([]);
  const [perfiles, setPerfiles] = useState([]);
  const [stats, setStats] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [nuevoPost, setNuevoPost] = useState({
    tipo: 'experiencia',
    contenido: '',
    guardian: '',
    likes: 30
  });
  const [config, setConfig] = useState({
    postsPerDay: 3,
    respuestasPerDay: 8,
    activo: true
  });

  useEffect(() => {
    cargarDatos();
  }, []);

  async function cargarDatos() {
    setCargando(true);
    try {
      // Cargar stats
      const resStats = await fetch('/api/comunidad/bots?tipo=stats');
      const dataStats = await resStats.json();
      if (dataStats.success) setStats(dataStats.stats);

      // Cargar posts
      const resPosts = await fetch('/api/comunidad/bots?limite=50');
      const dataPosts = await resPosts.json();
      if (dataPosts.success) setPosts(dataPosts.posts || []);

      // Cargar perfiles
      const resPerfiles = await fetch('/api/comunidad/bots', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accion: 'obtener_perfiles' })
      });
      const dataPerfiles = await resPerfiles.json();
      if (dataPerfiles.success) setPerfiles(dataPerfiles.perfiles || []);

    } catch (error) {
      console.error('Error cargando datos:', error);
    } finally {
      setCargando(false);
    }
  }

  async function agregarPost() {
    try {
      const res = await fetch('/api/comunidad/bots', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accion: 'agregar_post',
          datos: nuevoPost
        })
      });
      const data = await res.json();
      if (data.success) {
        alert('Post agregado correctamente');
        setNuevoPost({ tipo: 'experiencia', contenido: '', guardian: '', likes: 30 });
        cargarDatos();
      }
    } catch (error) {
      console.error('Error agregando post:', error);
      alert('Error al agregar post');
    }
  }

  async function actualizarConfig() {
    try {
      const res = await fetch('/api/comunidad/bots', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accion: 'programar_actividad',
          datos: config
        })
      });
      const data = await res.json();
      if (data.success) {
        alert('Configuración actualizada');
      }
    } catch (error) {
      console.error('Error actualizando config:', error);
    }
  }

  return (
    <div className="admin-comunidad">
      <header className="admin-header">
        <h1>🤖 Gestión de Comunidad Simulada</h1>
        <p>Administra perfiles ficticios, posts y actividad programada</p>
      </header>

      {/* Stats */}
      {stats && (
        <div className="stats-grid">
          <div className="stat-card">
            <span className="stat-numero">{stats.totalMiembros}</span>
            <span className="stat-label">Miembros totales</span>
          </div>
          <div className="stat-card">
            <span className="stat-numero">{stats.miembrosActivos}</span>
            <span className="stat-label">Activos ahora</span>
          </div>
          <div className="stat-card">
            <span className="stat-numero">{stats.postsHoy}</span>
            <span className="stat-label">Posts hoy</span>
          </div>
          <div className="stat-card">
            <span className="stat-numero">{perfiles.length}</span>
            <span className="stat-label">Perfiles bot</span>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="tabs">
        <button
          className={`tab ${tab === 'posts' ? 'active' : ''}`}
          onClick={() => setTab('posts')}
        >
          📝 Posts
        </button>
        <button
          className={`tab ${tab === 'perfiles' ? 'active' : ''}`}
          onClick={() => setTab('perfiles')}
        >
          👥 Perfiles
        </button>
        <button
          className={`tab ${tab === 'config' ? 'active' : ''}`}
          onClick={() => setTab('config')}
        >
          ⚙️ Configuración
        </button>
        <button
          className={`tab ${tab === 'nuevo' ? 'active' : ''}`}
          onClick={() => setTab('nuevo')}
        >
          ➕ Nuevo Post
        </button>
      </div>

      {/* Contenido */}
      <div className="contenido">
        {/* Tab: Posts */}
        {tab === 'posts' && (
          <div className="posts-lista">
            <h2>Posts Pregenerados ({posts.length})</h2>
            {cargando ? (
              <p className="cargando">Cargando...</p>
            ) : (
              <div className="posts-grid">
                {posts.map((post, idx) => (
                  <div key={post.id || idx} className="post-card-admin">
                    <div className="post-header">
                      <span className="post-autor">
                        {post.autor?.avatar} {post.autor?.nombre}
                      </span>
                      <span className={`post-tipo tipo-${post.tipo}`}>{post.tipo}</span>
                    </div>
                    <p className="post-contenido">{post.contenido?.substring(0, 150)}...</p>
                    {post.guardian && (
                      <span className="post-guardian">🧙 {post.guardian}</span>
                    )}
                    <div className="post-stats">
                      <span>❤️ {post.likes}</span>
                      <span>💬 {post.respuestas}</span>
                      <span className="post-hace">{post.hace}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab: Perfiles */}
        {tab === 'perfiles' && (
          <div className="perfiles-lista">
            <h2>Perfiles Bot ({perfiles.length})</h2>
            <div className="perfiles-grid">
              {perfiles.map((perfil) => (
                <div key={perfil.id} className="perfil-card">
                  <span className="perfil-avatar">{perfil.avatar}</span>
                  <div className="perfil-info">
                    <span className="perfil-nombre">{perfil.nombre}</span>
                    <span className="perfil-pais">{perfil.pais}</span>
                    <span className={`perfil-nivel nivel-${perfil.nivel}`}>
                      {perfil.nivel === 'diamante' ? '💎' :
                       perfil.nivel === 'oro' ? '🥇' :
                       perfil.nivel === 'plata' ? '🥈' : '🥉'} {perfil.nivel}
                    </span>
                    <span className="perfil-guardianes">🧙 {perfil.guardianes} guardianes</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab: Configuración */}
        {tab === 'config' && (
          <div className="config-section">
            <h2>Configuración de Actividad</h2>
            <div className="config-form">
              <div className="campo">
                <label>Posts por día</label>
                <input
                  type="number"
                  value={config.postsPerDay}
                  onChange={(e) => setConfig({ ...config, postsPerDay: parseInt(e.target.value) })}
                  min={0}
                  max={10}
                />
                <small>Cantidad de posts automáticos por día</small>
              </div>

              <div className="campo">
                <label>Respuestas por día</label>
                <input
                  type="number"
                  value={config.respuestasPerDay}
                  onChange={(e) => setConfig({ ...config, respuestasPerDay: parseInt(e.target.value) })}
                  min={0}
                  max={20}
                />
                <small>Cantidad de respuestas automáticas por día</small>
              </div>

              <div className="campo checkbox">
                <label>
                  <input
                    type="checkbox"
                    checked={config.activo}
                    onChange={(e) => setConfig({ ...config, activo: e.target.checked })}
                  />
                  Sistema activo
                </label>
                <small>Habilitar/deshabilitar la simulación de comunidad</small>
              </div>

              <button className="btn-guardar" onClick={actualizarConfig}>
                Guardar configuración
              </button>
            </div>
          </div>
        )}

        {/* Tab: Nuevo Post */}
        {tab === 'nuevo' && (
          <div className="nuevo-post-section">
            <h2>Crear Post Personalizado</h2>
            <div className="nuevo-post-form">
              <div className="campo">
                <label>Tipo de post</label>
                <select
                  value={nuevoPost.tipo}
                  onChange={(e) => setNuevoPost({ ...nuevoPost, tipo: e.target.value })}
                >
                  <option value="experiencia">💫 Experiencia</option>
                  <option value="pregunta">❓ Pregunta</option>
                  <option value="tip">💡 Tip</option>
                  <option value="agradecimiento">💜 Agradecimiento</option>
                  <option value="ritual">🕯️ Ritual</option>
                  <option value="sincronicidad">🔮 Sincronicidad</option>
                </select>
              </div>

              <div className="campo">
                <label>Guardián (opcional)</label>
                <select
                  value={nuevoPost.guardian}
                  onChange={(e) => setNuevoPost({ ...nuevoPost, guardian: e.target.value })}
                >
                  <option value="">Sin guardián específico</option>
                  <option value="Rowan">Rowan</option>
                  <option value="Luna">Luna</option>
                  <option value="Frost">Frost</option>
                  <option value="Sage">Sage</option>
                  <option value="Aurora">Aurora</option>
                  <option value="Ember">Ember</option>
                </select>
              </div>

              <div className="campo">
                <label>Contenido del post</label>
                <textarea
                  value={nuevoPost.contenido}
                  onChange={(e) => setNuevoPost({ ...nuevoPost, contenido: e.target.value })}
                  placeholder="Escribe el contenido del post..."
                  rows={5}
                />
              </div>

              <div className="campo">
                <label>Likes iniciales</label>
                <input
                  type="number"
                  value={nuevoPost.likes}
                  onChange={(e) => setNuevoPost({ ...nuevoPost, likes: parseInt(e.target.value) })}
                  min={5}
                  max={200}
                />
              </div>

              <button
                className="btn-crear-post"
                onClick={agregarPost}
                disabled={!nuevoPost.contenido}
              >
                ✨ Crear Post
              </button>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .admin-comunidad {
          min-height: 100vh;
          background: linear-gradient(135deg, #0a0a0a, #1a1a1a);
          color: #fff;
          font-family: 'Cormorant Garamond', serif;
          padding: 40px;
        }

        .admin-header {
          margin-bottom: 40px;
        }

        .admin-header h1 {
          font-family: 'Cinzel', serif;
          font-size: 32px;
          color: #d4af37;
          margin: 0 0 10px;
        }

        .admin-header p {
          color: rgba(255, 255, 255, 0.6);
          margin: 0;
        }

        /* Stats */
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
          margin-bottom: 40px;
        }

        .stat-card {
          background: rgba(212, 175, 55, 0.1);
          border: 1px solid rgba(212, 175, 55, 0.3);
          border-radius: 15px;
          padding: 25px;
          text-align: center;
        }

        .stat-numero {
          display: block;
          font-family: 'Cinzel', serif;
          font-size: 36px;
          color: #d4af37;
          font-weight: 600;
        }

        .stat-label {
          font-size: 14px;
          color: rgba(255, 255, 255, 0.6);
        }

        /* Tabs */
        .tabs {
          display: flex;
          gap: 10px;
          margin-bottom: 30px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          padding-bottom: 20px;
        }

        .tab {
          background: transparent;
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: rgba(255, 255, 255, 0.6);
          padding: 12px 25px;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.3s;
          font-size: 14px;
        }

        .tab:hover {
          border-color: rgba(212, 175, 55, 0.5);
          color: #fff;
        }

        .tab.active {
          background: rgba(212, 175, 55, 0.2);
          border-color: #d4af37;
          color: #d4af37;
        }

        /* Posts Grid */
        h2 {
          font-family: 'Cinzel', serif;
          font-size: 20px;
          color: #fff;
          margin: 0 0 20px;
        }

        .posts-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 20px;
        }

        .post-card-admin {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 15px;
          padding: 20px;
        }

        .post-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 15px;
        }

        .post-autor {
          font-size: 14px;
          color: #fff;
        }

        .post-tipo {
          font-size: 11px;
          padding: 4px 10px;
          border-radius: 10px;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .tipo-experiencia { background: rgba(255, 107, 53, 0.2); color: #ff6b35; }
        .tipo-pregunta { background: rgba(74, 144, 217, 0.2); color: #4a90d9; }
        .tipo-tip { background: rgba(74, 222, 128, 0.2); color: #4ade80; }
        .tipo-agradecimiento { background: rgba(168, 85, 247, 0.2); color: #a855f7; }
        .tipo-ritual { background: rgba(251, 191, 36, 0.2); color: #fbbf24; }
        .tipo-sincronicidad { background: rgba(139, 92, 246, 0.2); color: #8b5cf6; }

        .post-contenido {
          font-size: 14px;
          color: rgba(255, 255, 255, 0.8);
          line-height: 1.6;
          margin-bottom: 15px;
        }

        .post-guardian {
          display: inline-block;
          font-size: 12px;
          color: #b794f6;
          background: rgba(139, 92, 246, 0.1);
          padding: 4px 10px;
          border-radius: 10px;
          margin-bottom: 15px;
        }

        .post-stats {
          display: flex;
          gap: 15px;
          font-size: 13px;
          color: rgba(255, 255, 255, 0.5);
        }

        .post-hace {
          margin-left: auto;
          font-style: italic;
        }

        /* Perfiles Grid */
        .perfiles-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 15px;
        }

        .perfil-card {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 15px;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .perfil-avatar {
          font-size: 28px;
        }

        .perfil-info {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .perfil-nombre {
          font-size: 14px;
          color: #fff;
          font-weight: 500;
        }

        .perfil-pais {
          font-size: 14px;
        }

        .perfil-nivel {
          font-size: 11px;
          text-transform: uppercase;
        }

        .nivel-diamante { color: #00d4ff; }
        .nivel-oro { color: #ffd700; }
        .nivel-plata { color: #c0c0c0; }
        .nivel-bronce { color: #cd7f32; }

        .perfil-guardianes {
          font-size: 11px;
          color: rgba(255, 255, 255, 0.5);
        }

        /* Config Form */
        .config-form, .nuevo-post-form {
          max-width: 500px;
        }

        .campo {
          margin-bottom: 20px;
        }

        .campo label {
          display: block;
          font-size: 14px;
          color: #fff;
          margin-bottom: 8px;
        }

        .campo input[type="number"],
        .campo input[type="text"],
        .campo select,
        .campo textarea {
          width: 100%;
          padding: 12px 15px;
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 10px;
          color: #fff;
          font-size: 15px;
          font-family: inherit;
        }

        .campo input:focus,
        .campo select:focus,
        .campo textarea:focus {
          outline: none;
          border-color: #d4af37;
        }

        .campo small {
          display: block;
          margin-top: 5px;
          font-size: 12px;
          color: rgba(255, 255, 255, 0.4);
        }

        .campo.checkbox label {
          display: flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
        }

        .campo.checkbox input {
          width: 18px;
          height: 18px;
        }

        .btn-guardar, .btn-crear-post {
          background: linear-gradient(135deg, #d4af37, #b8972e);
          color: #0a0a0a;
          border: none;
          padding: 15px 30px;
          border-radius: 10px;
          font-family: 'Cinzel', serif;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
        }

        .btn-guardar:hover, .btn-crear-post:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(212, 175, 55, 0.3);
        }

        .btn-crear-post:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .cargando {
          text-align: center;
          color: rgba(255, 255, 255, 0.5);
          padding: 40px;
        }

        @media (max-width: 768px) {
          .admin-comunidad {
            padding: 20px;
          }

          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .tabs {
            flex-wrap: wrap;
          }

          .posts-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
