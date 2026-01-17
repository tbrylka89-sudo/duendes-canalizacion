'use client';
import { useState, useEffect } from 'react';

// ═══════════════════════════════════════════════════════════════════════════════
// ADMIN: DUENDE DE LA SEMANA
// Interfaz para seleccionar y configurar el duende protagonista semanal
// ═══════════════════════════════════════════════════════════════════════════════

export default function DuendeSemanaAdmin() {
  const [duendeActual, setDuendeActual] = useState(null);
  const [guardianes, setGuardianes] = useState([]);
  const [historial, setHistorial] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [generando, setGenerando] = useState(false);
  const [mensaje, setMensaje] = useState(null);
  const [mostrarSelector, setMostrarSelector] = useState(false);
  const [editando, setEditando] = useState(false);
  const [personalidadEditada, setPersonalidadEditada] = useState(null);

  useEffect(() => {
    cargarDatos();
  }, []);

  async function cargarDatos() {
    setCargando(true);
    try {
      const res = await fetch('/api/admin/duende-semana');
      const data = await res.json();
      if (data.success) {
        setDuendeActual(data.duendeActual);
        setGuardianes(data.guardianes || []);
        setHistorial(data.historial || []);
      }
    } catch (err) {
      console.error('Error cargando datos:', err);
    }
    setCargando(false);
  }

  async function seleccionarDuende(duendeId) {
    setMensaje(null);
    try {
      const res = await fetch('/api/admin/duende-semana', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accion: 'seleccionar', duendeId })
      });
      const data = await res.json();
      if (data.success) {
        setDuendeActual(data.duende);
        setMostrarSelector(false);
        setMensaje({ tipo: 'exito', texto: data.mensaje });
        cargarDatos();
      } else {
        setMensaje({ tipo: 'error', texto: data.error });
      }
    } catch (err) {
      setMensaje({ tipo: 'error', texto: 'Error de conexión' });
    }
  }

  async function seleccionarAleatorio() {
    setMensaje(null);
    try {
      const res = await fetch('/api/admin/duende-semana', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accion: 'aleatorio' })
      });
      const data = await res.json();
      if (data.success) {
        setDuendeActual(data.duende);
        setMostrarSelector(false);
        setMensaje({ tipo: 'exito', texto: data.mensaje });
        cargarDatos();
      } else {
        setMensaje({ tipo: 'error', texto: data.error });
      }
    } catch (err) {
      setMensaje({ tipo: 'error', texto: 'Error de conexión' });
    }
  }

  async function generarPersonalidad() {
    setGenerando(true);
    setMensaje(null);
    try {
      const res = await fetch('/api/admin/duende-semana', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accion: 'generar-personalidad' })
      });
      const data = await res.json();
      if (data.success) {
        setDuendeActual(data.duende);
        setMensaje({ tipo: 'exito', texto: 'Personalidad generada con éxito' });
      } else {
        setMensaje({ tipo: 'error', texto: data.error });
      }
    } catch (err) {
      setMensaje({ tipo: 'error', texto: 'Error generando personalidad' });
    }
    setGenerando(false);
  }

  async function guardarEdicion() {
    try {
      const res = await fetch('/api/admin/duende-semana', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accion: 'editar-personalidad', datos: personalidadEditada })
      });
      const data = await res.json();
      if (data.success) {
        setDuendeActual(data.duende);
        setEditando(false);
        setMensaje({ tipo: 'exito', texto: 'Personalidad actualizada' });
      }
    } catch (err) {
      setMensaje({ tipo: 'error', texto: 'Error guardando cambios' });
    }
  }

  function formatearFecha(fecha) {
    if (!fecha) return '';
    return new Date(fecha).toLocaleDateString('es-UY', {
      day: 'numeric', month: 'short', year: 'numeric'
    });
  }

  if (cargando) {
    return (
      <div className="admin-loading">
        <div className="spinner"></div>
        <p>Cargando...</p>
        <style jsx>{`
          .admin-loading { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; background: #0f0f0f; color: #888; }
          .spinner { width: 40px; height: 40px; border: 3px solid #333; border-top-color: #d4af37; border-radius: 50%; animation: spin 1s linear infinite; }
          @keyframes spin { to { transform: rotate(360deg); } }
        `}</style>
      </div>
    );
  }

  return (
    <div className="admin-duende-semana">
      {/* Header */}
      <header className="admin-header">
        <div className="header-left">
          <a href="/admin" className="back-link">← Admin</a>
          <h1>Duende de la Semana</h1>
        </div>
        <div className="header-actions">
          <a href="/admin/circulo/contenido" className="btn-secondary">Generador de Contenido</a>
          <a href="/admin/circulo/calendario" className="btn-secondary">Calendario</a>
        </div>
      </header>

      {/* Mensaje */}
      {mensaje && (
        <div className={`mensaje ${mensaje.tipo}`}>
          {mensaje.texto}
          <button onClick={() => setMensaje(null)}>×</button>
        </div>
      )}

      <main className="admin-main">
        {/* Duende Actual */}
        <section className="seccion-actual">
          <h2>Duende Actual</h2>

          {duendeActual ? (
            <div className="duende-actual-card">
              <div className="duende-imagen">
                <img src={duendeActual.imagen} alt={duendeActual.nombre} />
              </div>

              <div className="duende-info">
                <div className="duende-nombre">{duendeActual.nombre}</div>
                <div className="duende-titulo">{duendeActual.nombreCompleto}</div>
                <div className="duende-meta">
                  <span className="categoria">{duendeActual.categoria}</span>
                  {duendeActual.proposito && <span className="proposito">{duendeActual.proposito}</span>}
                </div>
                <div className="duende-fechas">
                  Semana: {formatearFecha(duendeActual.fechaInicio)} - {formatearFecha(duendeActual.fechaFin)}
                </div>
              </div>

              <div className="duende-acciones">
                <button onClick={() => setMostrarSelector(true)} className="btn-cambiar">
                  Cambiar Duende
                </button>
                <button onClick={seleccionarAleatorio} className="btn-aleatorio">
                  Aleatorio
                </button>
              </div>
            </div>
          ) : (
            <div className="sin-duende">
              <p>No hay duende seleccionado para esta semana</p>
              <div className="acciones-sin-duende">
                <button onClick={() => setMostrarSelector(true)} className="btn-primary">
                  Seleccionar Duende
                </button>
                <button onClick={seleccionarAleatorio} className="btn-secondary">
                  Selección Aleatoria
                </button>
              </div>
            </div>
          )}
        </section>

        {/* Personalidad */}
        {duendeActual && (
          <section className="seccion-personalidad">
            <div className="seccion-header">
              <h2>Personalidad Generada</h2>
              <div className="seccion-acciones">
                {!editando && (
                  <>
                    <button
                      onClick={generarPersonalidad}
                      disabled={generando}
                      className="btn-generar"
                    >
                      {generando ? (
                        <>
                          <span className="spinner-sm"></span>
                          Generando...
                        </>
                      ) : (
                        duendeActual.personalidadGenerada ? 'Regenerar' : 'Generar Personalidad'
                      )}
                    </button>
                    {duendeActual.personalidadGenerada && (
                      <button
                        onClick={() => {
                          setPersonalidadEditada({ ...duendeActual.personalidadGenerada });
                          setEditando(true);
                        }}
                        className="btn-editar"
                      >
                        Editar Manual
                      </button>
                    )}
                  </>
                )}
                {editando && (
                  <>
                    <button onClick={guardarEdicion} className="btn-guardar">Guardar</button>
                    <button onClick={() => setEditando(false)} className="btn-cancelar">Cancelar</button>
                  </>
                )}
              </div>
            </div>

            {duendeActual.personalidadGenerada ? (
              <div className="personalidad-grid">
                {!editando ? (
                  <>
                    <PersonalidadItem
                      label="Manera de Hablar"
                      value={duendeActual.personalidadGenerada.manera_de_hablar}
                    />
                    <PersonalidadItem
                      label="Temas Favoritos"
                      value={duendeActual.personalidadGenerada.temas_favoritos?.join(', ')}
                    />
                    <PersonalidadItem
                      label="Hora Preferida"
                      value={duendeActual.personalidadGenerada.hora_preferida}
                    />
                    <PersonalidadItem
                      label="Elemento Favorito"
                      value={duendeActual.personalidadGenerada.elemento_favorito}
                    />
                    <PersonalidadItem
                      label="Cómo Da Consejos"
                      value={duendeActual.personalidadGenerada.como_da_consejos}
                    />
                    <PersonalidadItem
                      label="Frase Característica"
                      value={duendeActual.personalidadGenerada.frase_caracteristica}
                      destacado
                    />
                    <PersonalidadItem
                      label="Despedida"
                      value={duendeActual.personalidadGenerada.despedida}
                    />
                    <PersonalidadItem
                      label="Curiosidad"
                      value={duendeActual.personalidadGenerada.curiosidad}
                    />
                    <PersonalidadItem
                      label="Tono Emocional"
                      value={duendeActual.personalidadGenerada.tono_emocional}
                    />
                  </>
                ) : (
                  <>
                    <EditableItem
                      label="Manera de Hablar"
                      value={personalidadEditada.manera_de_hablar}
                      onChange={(v) => setPersonalidadEditada({ ...personalidadEditada, manera_de_hablar: v })}
                    />
                    <EditableItem
                      label="Temas Favoritos (separados por coma)"
                      value={personalidadEditada.temas_favoritos?.join(', ')}
                      onChange={(v) => setPersonalidadEditada({ ...personalidadEditada, temas_favoritos: v.split(',').map(t => t.trim()) })}
                    />
                    <EditableItem
                      label="Hora Preferida"
                      value={personalidadEditada.hora_preferida}
                      onChange={(v) => setPersonalidadEditada({ ...personalidadEditada, hora_preferida: v })}
                    />
                    <EditableItem
                      label="Elemento Favorito"
                      value={personalidadEditada.elemento_favorito}
                      onChange={(v) => setPersonalidadEditada({ ...personalidadEditada, elemento_favorito: v })}
                    />
                    <EditableItem
                      label="Cómo Da Consejos"
                      value={personalidadEditada.como_da_consejos}
                      onChange={(v) => setPersonalidadEditada({ ...personalidadEditada, como_da_consejos: v })}
                    />
                    <EditableItem
                      label="Frase Característica"
                      value={personalidadEditada.frase_caracteristica}
                      onChange={(v) => setPersonalidadEditada({ ...personalidadEditada, frase_caracteristica: v })}
                    />
                    <EditableItem
                      label="Despedida"
                      value={personalidadEditada.despedida}
                      onChange={(v) => setPersonalidadEditada({ ...personalidadEditada, despedida: v })}
                    />
                    <EditableItem
                      label="Curiosidad"
                      value={personalidadEditada.curiosidad}
                      onChange={(v) => setPersonalidadEditada({ ...personalidadEditada, curiosidad: v })}
                    />
                    <EditableItem
                      label="Tono Emocional"
                      value={personalidadEditada.tono_emocional}
                      onChange={(v) => setPersonalidadEditada({ ...personalidadEditada, tono_emocional: v })}
                    />
                  </>
                )}
              </div>
            ) : (
              <div className="sin-personalidad">
                <p>Aún no se ha generado una personalidad para este duende</p>
                <p className="hint">Hacé clic en "Generar Personalidad" para crear una personalidad única con IA</p>
              </div>
            )}
          </section>
        )}

        {/* Historial */}
        <section className="seccion-historial">
          <h2>Historial de Duendes</h2>
          {historial.length > 0 ? (
            <div className="historial-lista">
              {historial.map((item, i) => (
                <div key={i} className="historial-item">
                  <img src={item.imagen} alt={item.nombre} />
                  <div className="historial-info">
                    <span className="nombre">{item.nombre}</span>
                    <span className="fechas">
                      {formatearFecha(item.fechaInicio)} - {formatearFecha(item.fechaFin)}
                    </span>
                  </div>
                  <button
                    onClick={() => seleccionarDuende(item.duendeId)}
                    className="btn-reseleccionar"
                  >
                    Volver a elegir
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="sin-historial">Aún no hay historial de duendes</p>
          )}
        </section>
      </main>

      {/* Modal Selector */}
      {mostrarSelector && (
        <div className="modal-overlay" onClick={() => setMostrarSelector(false)}>
          <div className="modal-selector" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Seleccionar Duende de la Semana</h3>
              <button onClick={() => setMostrarSelector(false)} className="btn-cerrar">×</button>
            </div>
            <div className="modal-body">
              <div className="guardianes-grid">
                {guardianes.map(g => (
                  <div
                    key={g.id}
                    className={`guardian-card ${duendeActual?.duendeId === g.id ? 'actual' : ''}`}
                    onClick={() => seleccionarDuende(g.id)}
                  >
                    <img src={g.imagen} alt={g.nombre} />
                    <div className="guardian-nombre">{g.guardian || g.nombre?.split(' ')[0]}</div>
                    <div className="guardian-categoria">{g.categoria}</div>
                    {duendeActual?.duendeId === g.id && (
                      <span className="badge-actual">Actual</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .admin-duende-semana {
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

        .header-left {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .back-link {
          color: #888;
          text-decoration: none;
          font-size: 14px;
        }

        .back-link:hover {
          color: #d4af37;
        }

        .admin-header h1 {
          font-size: 24px;
          font-weight: 600;
          margin: 0;
          background: linear-gradient(135deg, #d4af37, #e8d5a3);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .header-actions {
          display: flex;
          gap: 10px;
        }

        /* Botones */
        .btn-primary {
          background: linear-gradient(135deg, #d4af37, #b8972e);
          border: none;
          color: #000;
          padding: 12px 24px;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(212, 175, 55, 0.3);
        }

        .btn-secondary {
          background: transparent;
          border: 1px solid #333;
          color: #888;
          padding: 10px 20px;
          border-radius: 8px;
          font-size: 13px;
          cursor: pointer;
          text-decoration: none;
          transition: all 0.2s;
        }

        .btn-secondary:hover {
          border-color: #d4af37;
          color: #d4af37;
        }

        /* Mensaje */
        .mensaje {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 15px 30px;
          font-size: 14px;
        }

        .mensaje.exito {
          background: rgba(46, 204, 113, 0.1);
          color: #2ecc71;
        }

        .mensaje.error {
          background: rgba(231, 76, 60, 0.1);
          color: #e74c3c;
        }

        .mensaje button {
          background: none;
          border: none;
          color: inherit;
          font-size: 20px;
          cursor: pointer;
        }

        /* Main */
        .admin-main {
          padding: 30px;
          max-width: 1200px;
          margin: 0 auto;
        }

        /* Secciones */
        section {
          margin-bottom: 40px;
        }

        section h2 {
          font-size: 18px;
          font-weight: 600;
          color: #d4af37;
          margin: 0 0 20px 0;
        }

        .seccion-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .seccion-header h2 {
          margin: 0;
        }

        .seccion-acciones {
          display: flex;
          gap: 10px;
        }

        /* Duende Actual Card */
        .duende-actual-card {
          display: flex;
          align-items: center;
          gap: 30px;
          background: #1a1a1a;
          border-radius: 16px;
          padding: 30px;
        }

        .duende-imagen {
          flex-shrink: 0;
        }

        .duende-imagen img {
          width: 150px;
          height: 150px;
          object-fit: cover;
          border-radius: 50%;
          border: 3px solid #d4af37;
        }

        .duende-info {
          flex: 1;
        }

        .duende-nombre {
          font-size: 32px;
          font-weight: 700;
          color: #d4af37;
          font-family: 'Cinzel', serif;
        }

        .duende-titulo {
          font-size: 16px;
          color: #888;
          margin-top: 5px;
        }

        .duende-meta {
          display: flex;
          gap: 10px;
          margin-top: 15px;
        }

        .duende-meta span {
          background: #252525;
          padding: 6px 14px;
          border-radius: 20px;
          font-size: 12px;
          color: #aaa;
        }

        .duende-fechas {
          margin-top: 15px;
          font-size: 13px;
          color: #666;
        }

        .duende-acciones {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .btn-cambiar {
          background: #333;
          border: none;
          color: #fff;
          padding: 12px 24px;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-cambiar:hover {
          background: #444;
        }

        .btn-aleatorio {
          background: transparent;
          border: 1px solid #333;
          color: #888;
          padding: 12px 24px;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-aleatorio:hover {
          border-color: #d4af37;
          color: #d4af37;
        }

        /* Sin Duende */
        .sin-duende {
          background: #1a1a1a;
          border-radius: 16px;
          padding: 60px;
          text-align: center;
        }

        .sin-duende p {
          color: #666;
          margin-bottom: 20px;
        }

        .acciones-sin-duende {
          display: flex;
          gap: 15px;
          justify-content: center;
        }

        /* Personalidad */
        .personalidad-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 20px;
        }

        .sin-personalidad {
          background: #1a1a1a;
          border-radius: 16px;
          padding: 60px;
          text-align: center;
        }

        .sin-personalidad p {
          color: #666;
          margin: 0;
        }

        .sin-personalidad .hint {
          font-size: 13px;
          color: #555;
          margin-top: 10px;
        }

        .btn-generar {
          background: linear-gradient(135deg, #d4af37, #b8972e);
          border: none;
          color: #000;
          padding: 10px 20px;
          border-radius: 8px;
          font-weight: 500;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: all 0.2s;
        }

        .btn-generar:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .btn-editar, .btn-cancelar {
          background: #333;
          border: none;
          color: #888;
          padding: 10px 20px;
          border-radius: 8px;
          cursor: pointer;
        }

        .btn-guardar {
          background: #2ecc71;
          border: none;
          color: #fff;
          padding: 10px 20px;
          border-radius: 8px;
          cursor: pointer;
        }

        .spinner-sm {
          width: 16px;
          height: 16px;
          border: 2px solid transparent;
          border-top-color: #000;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        /* Historial */
        .historial-lista {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .historial-item {
          display: flex;
          align-items: center;
          gap: 15px;
          background: #1a1a1a;
          border-radius: 12px;
          padding: 15px 20px;
        }

        .historial-item img {
          width: 50px;
          height: 50px;
          object-fit: cover;
          border-radius: 50%;
        }

        .historial-info {
          flex: 1;
        }

        .historial-info .nombre {
          display: block;
          font-weight: 500;
          color: #fff;
        }

        .historial-info .fechas {
          font-size: 12px;
          color: #666;
        }

        .btn-reseleccionar {
          background: #252525;
          border: none;
          color: #888;
          padding: 8px 16px;
          border-radius: 6px;
          font-size: 12px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-reseleccionar:hover {
          background: #333;
          color: #d4af37;
        }

        .sin-historial {
          color: #666;
          font-style: italic;
        }

        /* Modal */
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

        .modal-selector {
          background: #1a1a1a;
          border-radius: 16px;
          max-width: 800px;
          width: 100%;
          max-height: 80vh;
          display: flex;
          flex-direction: column;
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 25px;
          border-bottom: 1px solid #2a2a2a;
        }

        .modal-header h3 {
          margin: 0;
          font-size: 18px;
          color: #d4af37;
        }

        .btn-cerrar {
          background: none;
          border: none;
          color: #888;
          font-size: 28px;
          cursor: pointer;
          line-height: 1;
        }

        .modal-body {
          padding: 25px;
          overflow-y: auto;
        }

        .guardianes-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
          gap: 15px;
        }

        .guardian-card {
          background: #252525;
          border: 2px solid transparent;
          border-radius: 12px;
          padding: 15px;
          text-align: center;
          cursor: pointer;
          transition: all 0.2s;
          position: relative;
        }

        .guardian-card:hover {
          border-color: #d4af37;
          transform: translateY(-2px);
        }

        .guardian-card.actual {
          border-color: #d4af37;
          background: rgba(212, 175, 55, 0.1);
        }

        .guardian-card img {
          width: 80px;
          height: 80px;
          object-fit: cover;
          border-radius: 50%;
          margin-bottom: 10px;
        }

        .guardian-nombre {
          font-weight: 500;
          color: #fff;
          font-size: 14px;
        }

        .guardian-categoria {
          font-size: 11px;
          color: #888;
          margin-top: 4px;
        }

        .badge-actual {
          position: absolute;
          top: 8px;
          right: 8px;
          background: #d4af37;
          color: #000;
          font-size: 10px;
          padding: 3px 8px;
          border-radius: 10px;
          font-weight: 600;
        }

        @media (max-width: 768px) {
          .admin-header {
            flex-direction: column;
            gap: 15px;
          }

          .duende-actual-card {
            flex-direction: column;
            text-align: center;
          }

          .duende-acciones {
            flex-direction: row;
          }

          .guardianes-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }
      `}</style>
    </div>
  );
}

// Componente para mostrar item de personalidad
function PersonalidadItem({ label, value, destacado = false }) {
  return (
    <div className={`personalidad-item ${destacado ? 'destacado' : ''}`}>
      <span className="label">{label}</span>
      <span className="value">{value || '-'}</span>
      <style jsx>{`
        .personalidad-item {
          background: #1a1a1a;
          border-radius: 12px;
          padding: 20px;
        }

        .personalidad-item.destacado {
          background: linear-gradient(135deg, rgba(212, 175, 55, 0.1), rgba(212, 175, 55, 0.05));
          border: 1px solid rgba(212, 175, 55, 0.3);
        }

        .label {
          display: block;
          font-size: 11px;
          text-transform: uppercase;
          color: #888;
          letter-spacing: 0.5px;
          margin-bottom: 8px;
        }

        .value {
          display: block;
          color: #fff;
          font-size: 14px;
          line-height: 1.6;
        }

        .destacado .value {
          color: #d4af37;
          font-style: italic;
          font-size: 15px;
        }
      `}</style>
    </div>
  );
}

// Componente para editar item de personalidad
function EditableItem({ label, value, onChange }) {
  return (
    <div className="editable-item">
      <label>{label}</label>
      <textarea
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        rows={3}
      />
      <style jsx>{`
        .editable-item {
          background: #1a1a1a;
          border-radius: 12px;
          padding: 20px;
        }

        label {
          display: block;
          font-size: 11px;
          text-transform: uppercase;
          color: #888;
          letter-spacing: 0.5px;
          margin-bottom: 10px;
        }

        textarea {
          width: 100%;
          background: #252525;
          border: 1px solid #333;
          border-radius: 8px;
          padding: 12px;
          color: #fff;
          font-size: 14px;
          resize: vertical;
          min-height: 80px;
        }

        textarea:focus {
          outline: none;
          border-color: #d4af37;
        }
      `}</style>
    </div>
  );
}
