'use client';
import { useState, useEffect } from 'react';
import './gamificacion-admin.css';

// ═══════════════════════════════════════════════════════════════════════════════
// PANEL ADMIN DE GAMIFICACIÓN
// Dashboard de métricas, gestión de runas, reportes
// ═══════════════════════════════════════════════════════════════════════════════

export default function GamificacionAdmin() {
  const [tab, setTab] = useState('metricas');
  const [metricas, setMetricas] = useState(null);
  const [usuarios, setUsuarios] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [exito, setExito] = useState('');

  // Formulario dar runas
  const [emailDarRunas, setEmailDarRunas] = useState('');
  const [cantidadRunas, setCantidadRunas] = useState(50);
  const [motivoRunas, setMotivoRunas] = useState('regalo_admin');

  // Reportes
  const [reporteActual, setReporteActual] = useState(null);
  const [generandoReporte, setGenerandoReporte] = useState(false);

  // Cargar datos
  useEffect(() => {
    cargarMetricas();
    cargarUsuarios();
  }, []);

  async function cargarMetricas() {
    try {
      const res = await fetch('/api/admin/gamificacion/metricas');
      const data = await res.json();
      if (data.success) {
        setMetricas(data.metricas);
      }
    } catch (err) {
      console.error('Error cargando métricas:', err);
    } finally {
      setCargando(false);
    }
  }

  async function cargarUsuarios() {
    try {
      const res = await fetch('/api/admin/gamificacion/usuarios');
      const data = await res.json();
      if (data.success) {
        setUsuarios(data.usuarios || []);
      }
    } catch (err) {
      console.error('Error cargando usuarios:', err);
    }
  }

  async function darRunas(e) {
    e.preventDefault();
    if (!emailDarRunas.trim()) {
      setError('Email requerido');
      return;
    }

    try {
      const res = await fetch('/api/admin/gamificacion/dar-runas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: emailDarRunas.trim(),
          cantidad: cantidadRunas,
          motivo: motivoRunas
        })
      });

      const data = await res.json();
      if (data.success) {
        setExito(`${cantidadRunas} runas otorgadas a ${emailDarRunas}`);
        setEmailDarRunas('');
        setCantidadRunas(50);
        cargarUsuarios();
        cargarMetricas();
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError(err.message);
    }
  }

  async function verDetalleUsuario(email) {
    try {
      const res = await fetch(`/api/admin/gamificacion/usuarios?email=${encodeURIComponent(email)}`);
      const data = await res.json();
      if (data.success) {
        setUsuarioSeleccionado(data.usuario);
      }
    } catch (err) {
      setError(err.message);
    }
  }

  async function generarReporte(tipo) {
    setGenerandoReporte(true);
    setReporteActual(null);
    try {
      const res = await fetch(`/api/admin/gamificacion/reportes?tipo=${tipo}`);
      const data = await res.json();
      if (data.success) {
        setReporteActual({ tipo, ...data });
      } else {
        setError(data.error || 'Error generando reporte');
      }
    } catch (err) {
      setError(err.message);
    }
    setGenerandoReporte(false);
  }

  async function ajustarRunasUsuario(email, cantidad, operacion) {
    try {
      const res = await fetch('/api/admin/gamificacion/dar-runas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          cantidad: operacion === 'restar' ? -cantidad : cantidad,
          motivo: `ajuste_admin_${operacion}`
        })
      });

      const data = await res.json();
      if (data.success) {
        setExito(`Runas ${operacion === 'restar' ? 'restadas' : 'sumadas'}`);
        verDetalleUsuario(email);
        cargarUsuarios();
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError(err.message);
    }
  }

  // Limpiar mensajes
  useEffect(() => {
    if (exito) setTimeout(() => setExito(''), 4000);
    if (error) setTimeout(() => setError(''), 5000);
  }, [exito, error]);

  const usuariosFiltrados = usuarios.filter(u =>
    u.email?.toLowerCase().includes(busqueda.toLowerCase()) ||
    u.nombre?.toLowerCase().includes(busqueda.toLowerCase())
  );

  const TABS = [
    { id: 'metricas', nombre: 'Métricas', icon: '📊' },
    { id: 'usuarios', nombre: 'Usuarios', icon: '👥' },
    { id: 'dar-runas', nombre: 'Dar Runas', icon: '💎' },
    { id: 'reportes', nombre: 'Reportes', icon: '📈' }
  ];

  return (
    <div className="gamificacion-admin">
      <header className="ga-header">
        <a href="/admin" className="ga-back">← Volver</a>
        <h1>🎮 Admin Gamificación</h1>
      </header>

      {error && <div className="ga-mensaje error">{error}</div>}
      {exito && <div className="ga-mensaje exito">{exito}</div>}

      <nav className="ga-tabs">
        {TABS.map(t => (
          <button
            key={t.id}
            className={`ga-tab ${tab === t.id ? 'active' : ''}`}
            onClick={() => setTab(t.id)}
          >
            <span>{t.icon}</span>
            <span>{t.nombre}</span>
          </button>
        ))}
      </nav>

      <main className="ga-content">
        {/* TAB: MÉTRICAS */}
        {tab === 'metricas' && (
          <div className="ga-metricas">
            <h2>📊 Métricas Generales</h2>

            {cargando ? (
              <div className="ga-loading">Cargando métricas...</div>
            ) : metricas ? (
              <>
                <div className="metricas-grid">
                  <div className="metrica-card">
                    <span className="metrica-icon">👥</span>
                    <span className="metrica-valor">{metricas.totalUsuarios || 0}</span>
                    <span className="metrica-label">Usuarios Totales</span>
                  </div>
                  <div className="metrica-card">
                    <span className="metrica-icon">🔥</span>
                    <span className="metrica-valor">{metricas.usuariosActivos || 0}</span>
                    <span className="metrica-label">Activos (7 días)</span>
                  </div>
                  <div className="metrica-card">
                    <span className="metrica-icon">💎</span>
                    <span className="metrica-valor">{metricas.totalRunasCirculando?.toLocaleString() || 0}</span>
                    <span className="metrica-label">Runas Circulando</span>
                  </div>
                  <div className="metrica-card">
                    <span className="metrica-icon">📦</span>
                    <span className="metrica-valor">{metricas.cofresAbiertoHoy || 0}</span>
                    <span className="metrica-label">Cofres Hoy</span>
                  </div>
                  <div className="metrica-card">
                    <span className="metrica-icon">🔮</span>
                    <span className="metrica-valor">{metricas.lecturasHoy || 0}</span>
                    <span className="metrica-label">Lecturas Hoy</span>
                  </div>
                  <div className="metrica-card">
                    <span className="metrica-icon">⭐</span>
                    <span className="metrica-valor">{metricas.promedioXP || 0}</span>
                    <span className="metrica-label">XP Promedio</span>
                  </div>
                </div>

                <div className="metricas-niveles">
                  <h3>Distribución por Nivel</h3>
                  <div className="niveles-bars">
                    {metricas.distribucionNiveles && Object.entries(metricas.distribucionNiveles).map(([nivel, cantidad]) => (
                      <div key={nivel} className="nivel-bar">
                        <span className="nivel-nombre">{nivel}</span>
                        <div className="nivel-progress">
                          <div
                            className="nivel-fill"
                            style={{ width: `${(cantidad / metricas.totalUsuarios) * 100}%` }}
                          />
                        </div>
                        <span className="nivel-cantidad">{cantidad}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="metricas-rachas">
                  <h3>Top Rachas</h3>
                  <div className="rachas-lista">
                    {metricas.topRachas?.map((u, i) => (
                      <div key={i} className="racha-item">
                        <span className="racha-pos">#{i + 1}</span>
                        <span className="racha-email">{u.email}</span>
                        <span className="racha-dias">🔥 {u.racha} días</span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="ga-empty">No hay datos de métricas</div>
            )}
          </div>
        )}

        {/* TAB: USUARIOS */}
        {tab === 'usuarios' && (
          <div className="ga-usuarios">
            <div className="usuarios-header">
              <h2>👥 Gestión de Usuarios</h2>
              <input
                type="text"
                placeholder="Buscar por email o nombre..."
                value={busqueda}
                onChange={e => setBusqueda(e.target.value)}
                className="usuarios-busqueda"
              />
            </div>

            <div className="usuarios-layout">
              <div className="usuarios-lista">
                {usuariosFiltrados.length === 0 ? (
                  <div className="ga-empty">No hay usuarios</div>
                ) : (
                  usuariosFiltrados.slice(0, 50).map((u, i) => (
                    <div
                      key={i}
                      className={`usuario-item ${usuarioSeleccionado?.email === u.email ? 'active' : ''}`}
                      onClick={() => verDetalleUsuario(u.email)}
                    >
                      <div className="usuario-info">
                        <span className="usuario-email">{u.email}</span>
                        <span className="usuario-nivel">{u.nivel || 'Iniciada'}</span>
                      </div>
                      <div className="usuario-stats">
                        <span>💎 {u.runas || 0}</span>
                        <span>⭐ {u.xp || 0}</span>
                        <span>🔥 {u.racha || 0}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {usuarioSeleccionado && (
                <div className="usuario-detalle">
                  <h3>{usuarioSeleccionado.email}</h3>

                  <div className="detalle-stats">
                    <div className="stat">
                      <span className="stat-label">Nivel</span>
                      <span className="stat-valor">{usuarioSeleccionado.nivel || 'Iniciada'}</span>
                    </div>
                    <div className="stat">
                      <span className="stat-label">XP</span>
                      <span className="stat-valor">{usuarioSeleccionado.xp || 0}</span>
                    </div>
                    <div className="stat">
                      <span className="stat-label">Runas</span>
                      <span className="stat-valor">{usuarioSeleccionado.runas || 0}</span>
                    </div>
                    <div className="stat">
                      <span className="stat-label">Racha</span>
                      <span className="stat-valor">{usuarioSeleccionado.racha || 0} días</span>
                    </div>
                    <div className="stat">
                      <span className="stat-label">Racha Máx</span>
                      <span className="stat-valor">{usuarioSeleccionado.rachaMax || 0} días</span>
                    </div>
                    <div className="stat">
                      <span className="stat-label">Lecturas</span>
                      <span className="stat-valor">{usuarioSeleccionado.lecturasCompletadas?.length || 0}</span>
                    </div>
                  </div>

                  {usuarioSeleccionado.badges?.length > 0 && (
                    <div className="detalle-badges">
                      <h4>Badges</h4>
                      <div className="badges-lista">
                        {usuarioSeleccionado.badges.map((b, i) => (
                          <span key={i} className="badge-item">{b}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="detalle-acciones">
                    <h4>Ajustar Runas</h4>
                    <div className="ajustar-runas">
                      <button onClick={() => ajustarRunasUsuario(usuarioSeleccionado.email, 10, 'sumar')}>+10</button>
                      <button onClick={() => ajustarRunasUsuario(usuarioSeleccionado.email, 50, 'sumar')}>+50</button>
                      <button onClick={() => ajustarRunasUsuario(usuarioSeleccionado.email, 100, 'sumar')}>+100</button>
                      <button className="restar" onClick={() => ajustarRunasUsuario(usuarioSeleccionado.email, 10, 'restar')}>-10</button>
                      <button className="restar" onClick={() => ajustarRunasUsuario(usuarioSeleccionado.email, 50, 'restar')}>-50</button>
                    </div>
                  </div>

                  {usuarioSeleccionado.referidos?.length > 0 && (
                    <div className="detalle-referidos">
                      <h4>Referidos ({usuarioSeleccionado.referidos.length})</h4>
                      <ul>
                        {usuarioSeleccionado.referidos.map((r, i) => (
                          <li key={i}>{r}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB: DAR RUNAS */}
        {tab === 'dar-runas' && (
          <div className="ga-dar-runas">
            <h2>💎 Dar Runas a Usuario</h2>

            <form onSubmit={darRunas} className="dar-runas-form">
              <div className="form-group">
                <label>Email del usuario</label>
                <input
                  type="email"
                  value={emailDarRunas}
                  onChange={e => setEmailDarRunas(e.target.value)}
                  placeholder="usuario@email.com"
                  required
                />
              </div>

              <div className="form-group">
                <label>Cantidad de runas</label>
                <div className="cantidad-presets">
                  {[10, 25, 50, 100, 200, 500].map(n => (
                    <button
                      key={n}
                      type="button"
                      className={cantidadRunas === n ? 'active' : ''}
                      onClick={() => setCantidadRunas(n)}
                    >
                      {n}
                    </button>
                  ))}
                </div>
                <input
                  type="number"
                  value={cantidadRunas}
                  onChange={e => setCantidadRunas(parseInt(e.target.value) || 0)}
                  min={1}
                  max={10000}
                />
              </div>

              <div className="form-group">
                <label>Motivo</label>
                <select value={motivoRunas} onChange={e => setMotivoRunas(e.target.value)}>
                  <option value="regalo_admin">Regalo del Admin</option>
                  <option value="compensacion">Compensación</option>
                  <option value="promocion">Promoción</option>
                  <option value="concurso">Premio de Concurso</option>
                  <option value="bonus_especial">Bonus Especial</option>
                  <option value="correccion">Corrección de Error</option>
                </select>
              </div>

              <button type="submit" className="btn-dar-runas">
                💎 Dar {cantidadRunas} Runas
              </button>
            </form>

            <div className="dar-runas-masivo">
              <h3>Dar Runas Masivo</h3>
              <p>Otorgar runas a todos los usuarios activos del Círculo</p>
              <button
                onClick={async () => {
                  if (!confirm('¿Dar runas a TODOS los miembros del Círculo?')) return;
                  try {
                    const res = await fetch('/api/admin/gamificacion/dar-runas-masivo', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ cantidad: cantidadRunas, motivo: motivoRunas })
                    });
                    const data = await res.json();
                    if (data.success) {
                      setExito(`Runas otorgadas a ${data.usuariosAfectados} usuarios`);
                    } else {
                      setError(data.error);
                    }
                  } catch (err) {
                    setError(err.message);
                  }
                }}
                className="btn-masivo"
              >
                🎁 Dar {cantidadRunas} runas a todos los miembros
              </button>
            </div>
          </div>
        )}

        {/* TAB: REPORTES */}
        {tab === 'reportes' && (
          <div className="ga-reportes">
            <h2>📈 Reportes</h2>

            <div className="reportes-grid">
              <div className="reporte-card">
                <h3>💰 Economía de Runas</h3>
                <p>Runas generadas, gastadas y balance por período</p>
                <button onClick={() => generarReporte('economia')} disabled={generandoReporte}>
                  {generandoReporte ? 'Generando...' : 'Generar Reporte'}
                </button>
              </div>

              <div className="reporte-card">
                <h3>🔮 Lecturas Populares</h3>
                <p>Ranking de lecturas más solicitadas</p>
                <button onClick={() => generarReporte('lecturas')} disabled={generandoReporte}>
                  {generandoReporte ? 'Generando...' : 'Generar Reporte'}
                </button>
              </div>

              <div className="reporte-card">
                <h3>📅 Actividad Diaria</h3>
                <p>Logins, cofres, lecturas por día</p>
                <button onClick={() => generarReporte('actividad')} disabled={generandoReporte}>
                  {generandoReporte ? 'Generando...' : 'Generar Reporte'}
                </button>
              </div>

              <div className="reporte-card">
                <h3>👥 Retención</h3>
                <p>Usuarios que vuelven vs nuevos</p>
                <button onClick={() => generarReporte('retencion')} disabled={generandoReporte}>
                  {generandoReporte ? 'Generando...' : 'Generar Reporte'}
                </button>
              </div>

              <div className="reporte-card">
                <h3>🎯 Referidos</h3>
                <p>Top referidores y conversiones</p>
                <button onClick={() => generarReporte('referidos')} disabled={generandoReporte}>
                  {generandoReporte ? 'Generando...' : 'Generar Reporte'}
                </button>
              </div>

              <div className="reporte-card">
                <h3>🏆 Logros</h3>
                <p>Badges más obtenidos y niveles alcanzados</p>
                <button onClick={() => generarReporte('logros')} disabled={generandoReporte}>
                  {generandoReporte ? 'Generando...' : 'Generar Reporte'}
                </button>
              </div>
            </div>

            {/* Resultado del reporte */}
            {reporteActual && (
              <div className="reporte-resultado">
                <div className="reporte-header">
                  <h3>
                    {reporteActual.tipo === 'economia' && '💰 Reporte de Economía de Runas'}
                    {reporteActual.tipo === 'lecturas' && '🔮 Reporte de Lecturas Populares'}
                    {reporteActual.tipo === 'actividad' && '📅 Reporte de Actividad Diaria'}
                    {reporteActual.tipo === 'retencion' && '👥 Reporte de Retención'}
                    {reporteActual.tipo === 'referidos' && '🎯 Reporte de Referidos'}
                    {reporteActual.tipo === 'logros' && '🏆 Reporte de Logros'}
                  </h3>
                  <button onClick={() => setReporteActual(null)} className="btn-cerrar">✕</button>
                </div>

                {/* Resumen */}
                {reporteActual.reporte?.resumen && (
                  <div className="reporte-resumen">
                    {Object.entries(reporteActual.reporte.resumen).map(([key, value]) => (
                      <div key={key} className="resumen-item">
                        <span className="resumen-label">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                        <span className="resumen-valor">{typeof value === 'number' ? value.toLocaleString() : value}{key.includes('tasa') || key.includes('porcentaje') ? '%' : ''}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Tablas de datos */}
                {reporteActual.reporte?.topUsuarios && (
                  <div className="reporte-tabla">
                    <h4>Top Usuarios</h4>
                    <table>
                      <thead>
                        <tr><th>Usuario</th><th>Runas</th><th>Nivel</th></tr>
                      </thead>
                      <tbody>
                        {reporteActual.reporte.topUsuarios.map((u, i) => (
                          <tr key={i}><td>{u.email}</td><td>{u.runas}</td><td>{u.nivel}</td></tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {reporteActual.reporte?.ranking && (
                  <div className="reporte-tabla">
                    <h4>Ranking</h4>
                    <table>
                      <thead>
                        <tr><th>Tipo</th><th>Cantidad</th><th>%</th></tr>
                      </thead>
                      <tbody>
                        {reporteActual.reporte.ranking.map((r, i) => (
                          <tr key={i}><td>{r.tipo}</td><td>{r.cantidad}</td><td>{r.porcentaje}%</td></tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {reporteActual.reporte?.distribucionNiveles && (
                  <div className="reporte-tabla">
                    <h4>Distribución por Niveles</h4>
                    <table>
                      <thead>
                        <tr><th>Nivel</th><th>Usuarios</th></tr>
                      </thead>
                      <tbody>
                        {Object.entries(reporteActual.reporte.distribucionNiveles).map(([nivel, cantidad]) => (
                          <tr key={nivel}><td>{nivel}</td><td>{cantidad}</td></tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {reporteActual.reporte?.topReferidores && (
                  <div className="reporte-tabla">
                    <h4>Top Referidores</h4>
                    <table>
                      <thead>
                        <tr><th>Código</th><th>Referidos</th><th>Convertidos</th></tr>
                      </thead>
                      <tbody>
                        {reporteActual.reporte.topReferidores.map((r, i) => (
                          <tr key={i}><td>{r.codigo}</td><td>{r.totalReferidos}</td><td>{r.convertidos}</td></tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {reporteActual.reporte?.badgesMasObtenidos && (
                  <div className="reporte-tabla">
                    <h4>Badges Más Obtenidos</h4>
                    <table>
                      <thead>
                        <tr><th>Badge</th><th>Veces Otorgado</th></tr>
                      </thead>
                      <tbody>
                        {reporteActual.reporte.badgesMasObtenidos.map((b, i) => (
                          <tr key={i}><td>{b.nombre}</td><td>{b.cantidad}</td></tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                <p className="reporte-fecha">Generado: {new Date(reporteActual.generadoEn).toLocaleString('es-UY')}</p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
