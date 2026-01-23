'use client';
import { useState, useEffect } from 'react';

// ═══════════════════════════════════════════════════════════════════════════════
// PANEL ADMIN MODO DIOS
// Control total de Mi Magia y El Círculo en un solo lugar
// ═══════════════════════════════════════════════════════════════════════════════

export default function ModoDiosPage() {
  const [tab, setTab] = useState('contenido');
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState(null);

  // Estados para cada sección
  const [contenidos, setContenidos] = useState([]);
  const [miembros, setMiembros] = useState([]);
  const [stats, setStats] = useState(null);
  const [emailBuscar, setEmailBuscar] = useState('');
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);

  // Estados para generación
  const [fechaGenerar, setFechaGenerar] = useState('');
  const [generando, setGenerando] = useState(false);

  // Estados para regalos
  const [regaloTipo, setRegaloTipo] = useState('runas');
  const [regaloCantidad, setRegaloCantidad] = useState(50);
  const [regaloMensaje, setRegaloMensaje] = useState('');

  useEffect(() => {
    cargarStats();
    // Establecer fecha de hoy por defecto
    const hoy = new Date().toISOString().split('T')[0];
    setFechaGenerar(hoy);
  }, []);

  async function cargarStats() {
    try {
      const res = await fetch('/api/admin/stats');
      const data = await res.json();
      if (data.success) setStats(data);
    } catch (e) {
      console.error('Error stats:', e);
    }
  }

  async function buscarUsuario() {
    if (!emailBuscar.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/clientes/${encodeURIComponent(emailBuscar)}`);
      const data = await res.json();
      if (data.success) {
        setUsuarioSeleccionado(data.cliente);
        setMensaje({ tipo: 'ok', texto: 'Usuario encontrado' });
      } else {
        setMensaje({ tipo: 'error', texto: 'Usuario no encontrado' });
      }
    } catch (e) {
      setMensaje({ tipo: 'error', texto: e.message });
    } finally {
      setLoading(false);
    }
  }

  async function generarContenidoDia() {
    if (!fechaGenerar) return;
    setGenerando(true);
    setMensaje(null);
    try {
      const res = await fetch('/api/admin/circulo/generar-contenido-pro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accion: 'generar-dia',
          fecha: fechaGenerar,
          generarImagenes: true,
          publicarDirecto: false
        })
      });
      const data = await res.json();
      if (data.success) {
        setMensaje({ tipo: 'ok', texto: `Generado: ${data.contenido.titulo}` });
      } else {
        setMensaje({ tipo: 'error', texto: data.error });
      }
    } catch (e) {
      setMensaje({ tipo: 'error', texto: e.message });
    } finally {
      setGenerando(false);
    }
  }

  async function generarSemana() {
    setGenerando(true);
    setMensaje({ tipo: 'info', texto: 'Generando semana... esto puede tardar unos minutos' });
    try {
      const res = await fetch('/api/admin/circulo/generar-contenido-pro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accion: 'generar-semana',
          fechaInicio: fechaGenerar,
          generarImagenes: true
        })
      });
      const data = await res.json();
      if (data.success) {
        setMensaje({ tipo: 'ok', texto: `Generados: ${data.generados} contenidos` });
      } else {
        setMensaje({ tipo: 'error', texto: data.error });
      }
    } catch (e) {
      setMensaje({ tipo: 'error', texto: e.message });
    } finally {
      setGenerando(false);
    }
  }

  async function darRegaloUsuario() {
    if (!usuarioSeleccionado) return;
    setLoading(true);
    try {
      const endpoint = regaloTipo === 'runas'
        ? '/api/admin/gamificacion/dar-runas'
        : '/api/admin/regalos';

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: usuarioSeleccionado.email,
          cantidad: regaloCantidad,
          tipo: regaloTipo,
          mensaje: regaloMensaje,
          motivo: 'Regalo del admin'
        })
      });
      const data = await res.json();
      if (data.success) {
        setMensaje({ tipo: 'ok', texto: `${regaloCantidad} ${regaloTipo} enviados a ${usuarioSeleccionado.email}` });
        buscarUsuario(); // Recargar datos
      } else {
        setMensaje({ tipo: 'error', texto: data.error });
      }
    } catch (e) {
      setMensaje({ tipo: 'error', texto: e.message });
    } finally {
      setLoading(false);
    }
  }

  async function crearCuentaPorEmail(email) {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/clientes/crear', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          enviarMagicLink: true
        })
      });
      const data = await res.json();
      if (data.success) {
        setMensaje({ tipo: 'ok', texto: `Cuenta creada y email enviado a ${email}` });
      } else {
        setMensaje({ tipo: 'error', texto: data.error });
      }
    } catch (e) {
      setMensaje({ tipo: 'error', texto: e.message });
    } finally {
      setLoading(false);
    }
  }

  async function activarCirculoUsuario(meses = 1) {
    if (!usuarioSeleccionado) return;
    setLoading(true);
    try {
      const res = await fetch('/api/admin/clientes/modificar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: usuarioSeleccionado.email,
          accion: 'activar-circulo',
          meses
        })
      });
      const data = await res.json();
      if (data.success) {
        setMensaje({ tipo: 'ok', texto: `Círculo activado por ${meses} meses` });
        buscarUsuario();
      } else {
        setMensaje({ tipo: 'error', texto: data.error });
      }
    } catch (e) {
      setMensaje({ tipo: 'error', texto: e.message });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="modo-dios">
      <header className="header">
        <h1>⚡ Panel Modo Dios</h1>
        <p>Control total de Mi Magia y El Círculo</p>
      </header>

      {/* Stats rápidos */}
      {stats && (
        <div className="stats-bar">
          <div className="stat">
            <span className="stat-num">{stats.totalUsuarios || 0}</span>
            <span className="stat-label">Usuarios</span>
          </div>
          <div className="stat">
            <span className="stat-num">{stats.miembrosCirculo || 0}</span>
            <span className="stat-label">Círculo</span>
          </div>
          <div className="stat">
            <span className="stat-num">{stats.contenidosPublicados || 0}</span>
            <span className="stat-label">Contenidos</span>
          </div>
        </div>
      )}

      {/* Mensaje global */}
      {mensaje && (
        <div className={`mensaje ${mensaje.tipo}`}>
          {mensaje.texto}
          <button onClick={() => setMensaje(null)}>×</button>
        </div>
      )}

      {/* Tabs */}
      <nav className="tabs">
        <button className={tab === 'contenido' ? 'active' : ''} onClick={() => setTab('contenido')}>
          📝 Contenido
        </button>
        <button className={tab === 'usuarios' ? 'active' : ''} onClick={() => setTab('usuarios')}>
          👥 Usuarios
        </button>
        <button className={tab === 'regalos' ? 'active' : ''} onClick={() => setTab('regalos')}>
          🎁 Regalos
        </button>
        <button className={tab === 'cursos' ? 'active' : ''} onClick={() => setTab('cursos')}>
          📚 Cursos
        </button>
        <button className={tab === 'config' ? 'active' : ''} onClick={() => setTab('config')}>
          ⚙️ Config
        </button>
      </nav>

      <main className="content">
        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* TAB: CONTENIDO */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        {tab === 'contenido' && (
          <section className="section">
            <h2>Generador de Contenido</h2>

            <div className="card">
              <h3>Generar Contenido</h3>
              <div className="form-row">
                <label>Fecha:</label>
                <input
                  type="date"
                  value={fechaGenerar}
                  onChange={e => setFechaGenerar(e.target.value)}
                />
              </div>

              <div className="buttons">
                <button
                  className="btn primary"
                  onClick={generarContenidoDia}
                  disabled={generando}
                >
                  {generando ? '⏳ Generando...' : '✨ Generar Día'}
                </button>
                <button
                  className="btn secondary"
                  onClick={generarSemana}
                  disabled={generando}
                >
                  📅 Generar Semana
                </button>
              </div>
            </div>

            <div className="card">
              <h3>Acciones Rápidas</h3>
              <div className="quick-actions">
                <a href="/admin/circulo/contenido" className="action-link">
                  📋 Ver Contenidos
                </a>
                <a href="/admin/circulo/calendario" className="action-link">
                  📆 Calendario
                </a>
                <a href="/admin/circulo/duende-semana" className="action-link">
                  🧙 Duende de la Semana
                </a>
              </div>
            </div>
          </section>
        )}

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* TAB: USUARIOS */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        {tab === 'usuarios' && (
          <section className="section">
            <h2>Gestión de Usuarios</h2>

            <div className="card">
              <h3>Buscar Usuario</h3>
              <div className="form-row">
                <input
                  type="email"
                  placeholder="Email del usuario"
                  value={emailBuscar}
                  onChange={e => setEmailBuscar(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && buscarUsuario()}
                />
                <button className="btn primary" onClick={buscarUsuario} disabled={loading}>
                  🔍 Buscar
                </button>
              </div>
            </div>

            {usuarioSeleccionado && (
              <div className="card usuario-card">
                <h3>{usuarioSeleccionado.nombre || usuarioSeleccionado.email}</h3>
                <div className="usuario-info">
                  <p><strong>Email:</strong> {usuarioSeleccionado.email}</p>
                  <p><strong>Runas:</strong> {usuarioSeleccionado.runas || 0}</p>
                  <p><strong>Tréboles:</strong> {usuarioSeleccionado.treboles || 0}</p>
                  <p><strong>Es Círculo:</strong> {usuarioSeleccionado.esCirculo ? '✅ Sí' : '❌ No'}</p>
                  {usuarioSeleccionado.circuloExpira && (
                    <p><strong>Expira:</strong> {new Date(usuarioSeleccionado.circuloExpira).toLocaleDateString()}</p>
                  )}
                </div>

                <div className="buttons">
                  <button className="btn success" onClick={() => activarCirculoUsuario(1)}>
                    🎫 +1 Mes Círculo
                  </button>
                  <button className="btn success" onClick={() => activarCirculoUsuario(6)}>
                    🎫 +6 Meses
                  </button>
                  <button className="btn success" onClick={() => activarCirculoUsuario(12)}>
                    🎫 +1 Año
                  </button>
                </div>
              </div>
            )}

            <div className="card">
              <h3>Crear Cuenta Nueva</h3>
              <p className="hint">Ingresá un email para crear cuenta y enviar magic link automáticamente</p>
              <div className="form-row">
                <input
                  type="email"
                  placeholder="nuevo@email.com"
                  id="nuevo-email"
                />
                <button
                  className="btn primary"
                  onClick={() => {
                    const email = document.getElementById('nuevo-email').value;
                    if (email) crearCuentaPorEmail(email);
                  }}
                  disabled={loading}
                >
                  ➕ Crear Cuenta
                </button>
              </div>
            </div>
          </section>
        )}

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* TAB: REGALOS */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        {tab === 'regalos' && (
          <section className="section">
            <h2>Sistema de Regalos</h2>

            {usuarioSeleccionado ? (
              <div className="card">
                <h3>Regalar a: {usuarioSeleccionado.email}</h3>

                <div className="form-group">
                  <label>Tipo de regalo:</label>
                  <select value={regaloTipo} onChange={e => setRegaloTipo(e.target.value)}>
                    <option value="runas">🔮 Runas</option>
                    <option value="treboles">🍀 Tréboles</option>
                    <option value="lectura">📖 Lectura Gratis</option>
                    <option value="descuento">💰 Cupón Descuento</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Cantidad:</label>
                  <input
                    type="number"
                    value={regaloCantidad}
                    onChange={e => setRegaloCantidad(parseInt(e.target.value))}
                    min="1"
                    max="1000"
                  />
                </div>

                <div className="form-group">
                  <label>Mensaje (opcional):</label>
                  <textarea
                    value={regaloMensaje}
                    onChange={e => setRegaloMensaje(e.target.value)}
                    placeholder="Un mensaje especial para el usuario..."
                    rows={3}
                  />
                </div>

                <button className="btn primary" onClick={darRegaloUsuario} disabled={loading}>
                  🎁 Enviar Regalo
                </button>
              </div>
            ) : (
              <div className="card">
                <p>⬆️ Primero buscá un usuario en la pestaña "Usuarios"</p>
              </div>
            )}

            <div className="card">
              <h3>Regalo Masivo a Todos los del Círculo</h3>
              <div className="form-group">
                <label>Tipo:</label>
                <select id="regalo-masivo-tipo">
                  <option value="runas">🔮 Runas</option>
                  <option value="treboles">🍀 Tréboles</option>
                </select>
              </div>
              <div className="form-group">
                <label>Cantidad por persona:</label>
                <input type="number" id="regalo-masivo-cantidad" defaultValue={25} min={1} />
              </div>
              <button
                className="btn warning"
                onClick={async () => {
                  const tipo = document.getElementById('regalo-masivo-tipo').value;
                  const cantidad = parseInt(document.getElementById('regalo-masivo-cantidad').value);
                  setLoading(true);
                  try {
                    const res = await fetch('/api/admin/circulo/regalo-todos', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ tipo, cantidad })
                    });
                    const data = await res.json();
                    setMensaje({ tipo: data.success ? 'ok' : 'error', texto: data.mensaje || data.error });
                  } catch (e) {
                    setMensaje({ tipo: 'error', texto: e.message });
                  } finally {
                    setLoading(false);
                  }
                }}
                disabled={loading}
              >
                🎉 Regalar a TODOS
              </button>
            </div>
          </section>
        )}

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* TAB: CURSOS */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        {tab === 'cursos' && (
          <section className="section">
            <h2>Gestión de Cursos</h2>

            <div className="card">
              <h3>Generar Curso con IA</h3>
              <div className="form-group">
                <label>Tema del curso:</label>
                <input type="text" id="curso-tema" placeholder="Ej: Abundancia y Prosperidad" />
              </div>
              <div className="form-group">
                <label>Número de módulos:</label>
                <input type="number" id="curso-modulos" defaultValue={4} min={2} max={8} />
              </div>
              <button
                className="btn primary"
                onClick={async () => {
                  const tema = document.getElementById('curso-tema').value;
                  const modulos = parseInt(document.getElementById('curso-modulos').value);
                  if (!tema) {
                    setMensaje({ tipo: 'error', texto: 'Ingresá un tema' });
                    return;
                  }
                  setGenerando(true);
                  setMensaje({ tipo: 'info', texto: 'Generando curso... puede tardar 1-2 minutos' });
                  try {
                    const res = await fetch('/api/admin/cursos/generar-con-ia', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        tema,
                        cantidadModulos: modulos,
                        leccionesPorModulo: 2,
                        preferirGemini: true
                      })
                    });
                    const data = await res.json();
                    if (data.success) {
                      setMensaje({ tipo: 'ok', texto: `Curso "${data.curso.titulo}" creado con ${data.curso.totalLecciones} lecciones` });
                    } else {
                      setMensaje({ tipo: 'error', texto: data.error });
                    }
                  } catch (e) {
                    setMensaje({ tipo: 'error', texto: e.message });
                  } finally {
                    setGenerando(false);
                  }
                }}
                disabled={generando}
              >
                {generando ? '⏳ Generando...' : '🤖 Generar con IA'}
              </button>
            </div>

            <div className="card">
              <h3>Acciones</h3>
              <div className="quick-actions">
                <a href="/admin/circulo/maestro" className="action-link">
                  📚 Administrar Cursos
                </a>
                <a href="/circulo/cursos" className="action-link" target="_blank">
                  👁️ Ver como Usuario
                </a>
              </div>
            </div>
          </section>
        )}

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* TAB: CONFIG */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        {tab === 'config' && (
          <section className="section">
            <h2>Configuración del Sistema</h2>

            <div className="card">
              <h3>Links Rápidos</h3>
              <div className="quick-actions">
                <a href="/admin/canalizaciones" className="action-link">📜 Canalizaciones</a>
                <a href="/admin/promociones" className="action-link">🏷️ Promociones</a>
                <a href="/admin/gamificacion" className="action-link">🎮 Gamificación</a>
                <a href="/admin/inteligencia" className="action-link">🧠 Guardian Intelligence</a>
                <a href="/admin/generador-historias" className="action-link">✍️ Generador Historias</a>
                <a href="/admin/tito" className="action-link">🤖 Tito Admin</a>
              </div>
            </div>

            <div className="card">
              <h3>Estado del Sistema</h3>
              <button
                className="btn secondary"
                onClick={async () => {
                  const res = await fetch('/api/admin/verificar-conexiones');
                  const data = await res.json();
                  setMensaje({
                    tipo: data.success ? 'ok' : 'error',
                    texto: JSON.stringify(data, null, 2)
                  });
                }}
              >
                🔌 Verificar Conexiones
              </button>
            </div>
          </section>
        )}
      </main>

      <style jsx>{`
        .modo-dios {
          min-height: 100vh;
          background: linear-gradient(135deg, #0a0a15 0%, #1a1025 100%);
          color: #fff;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .header {
          padding: 30px;
          text-align: center;
          background: rgba(255, 0, 255, 0.05);
          border-bottom: 1px solid rgba(255, 0, 255, 0.2);
        }

        .header h1 {
          font-size: 2.5rem;
          margin: 0;
          background: linear-gradient(90deg, #ff00ff, #00f0ff);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .header p {
          margin: 10px 0 0;
          color: rgba(255, 255, 255, 0.6);
        }

        .stats-bar {
          display: flex;
          justify-content: center;
          gap: 40px;
          padding: 20px;
          background: rgba(0, 0, 0, 0.3);
        }

        .stat {
          text-align: center;
        }

        .stat-num {
          display: block;
          font-size: 2rem;
          font-weight: bold;
          color: #00f0ff;
        }

        .stat-label {
          font-size: 0.8rem;
          color: rgba(255, 255, 255, 0.5);
          text-transform: uppercase;
        }

        .mensaje {
          margin: 20px;
          padding: 15px 20px;
          border-radius: 10px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .mensaje.ok { background: rgba(57, 255, 20, 0.15); border: 1px solid #39ff14; }
        .mensaje.error { background: rgba(255, 0, 0, 0.15); border: 1px solid #ff4444; }
        .mensaje.info { background: rgba(0, 240, 255, 0.15); border: 1px solid #00f0ff; }

        .mensaje button {
          background: none;
          border: none;
          color: inherit;
          font-size: 1.5rem;
          cursor: pointer;
          opacity: 0.7;
        }

        .tabs {
          display: flex;
          gap: 5px;
          padding: 10px 20px;
          background: rgba(0, 0, 0, 0.2);
          overflow-x: auto;
        }

        .tabs button {
          padding: 12px 20px;
          border: none;
          background: rgba(255, 255, 255, 0.05);
          color: rgba(255, 255, 255, 0.7);
          border-radius: 8px;
          cursor: pointer;
          white-space: nowrap;
          transition: all 0.2s;
        }

        .tabs button:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        .tabs button.active {
          background: linear-gradient(135deg, #ff00ff, #00f0ff);
          color: #fff;
        }

        .content {
          padding: 20px;
          max-width: 1200px;
          margin: 0 auto;
        }

        .section h2 {
          margin-bottom: 20px;
          color: #ff00ff;
        }

        .card {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 15px;
          padding: 20px;
          margin-bottom: 20px;
        }

        .card h3 {
          margin: 0 0 15px;
          color: #00f0ff;
        }

        .form-row {
          display: flex;
          gap: 10px;
          margin-bottom: 15px;
        }

        .form-group {
          margin-bottom: 15px;
        }

        .form-group label {
          display: block;
          margin-bottom: 5px;
          color: rgba(255, 255, 255, 0.7);
        }

        input, select, textarea {
          width: 100%;
          padding: 12px 15px;
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 8px;
          color: #fff;
          font-size: 1rem;
        }

        input:focus, select:focus, textarea:focus {
          outline: none;
          border-color: #ff00ff;
        }

        .buttons {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }

        .btn {
          padding: 12px 24px;
          border: none;
          border-radius: 8px;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .btn.primary {
          background: linear-gradient(135deg, #ff00ff, #cc00cc);
          color: #fff;
        }

        .btn.secondary {
          background: rgba(0, 240, 255, 0.2);
          color: #00f0ff;
          border: 1px solid #00f0ff;
        }

        .btn.success {
          background: rgba(57, 255, 20, 0.2);
          color: #39ff14;
          border: 1px solid #39ff14;
        }

        .btn.warning {
          background: rgba(255, 107, 0, 0.2);
          color: #ff6b00;
          border: 1px solid #ff6b00;
        }

        .btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 5px 20px rgba(255, 0, 255, 0.3);
        }

        .quick-actions {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 10px;
        }

        .action-link {
          display: block;
          padding: 15px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 10px;
          color: #fff;
          text-decoration: none;
          text-align: center;
          transition: all 0.2s;
        }

        .action-link:hover {
          background: rgba(255, 0, 255, 0.1);
          border-color: #ff00ff;
        }

        .usuario-card {
          border-color: #00f0ff;
        }

        .usuario-info p {
          margin: 8px 0;
        }

        .hint {
          color: rgba(255, 255, 255, 0.5);
          font-size: 0.9rem;
          margin-bottom: 15px;
        }

        @media (max-width: 768px) {
          .stats-bar {
            flex-wrap: wrap;
            gap: 20px;
          }

          .form-row {
            flex-direction: column;
          }

          .buttons {
            flex-direction: column;
          }

          .btn {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
