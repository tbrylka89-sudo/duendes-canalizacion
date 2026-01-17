'use client';
import { useState, useEffect } from 'react';

// ═══════════════════════════════════════════════════════════════════════════════
// COMUNIDAD / FORO PRIVADO DEL CÍRCULO
// Solo accesible para miembros del Círculo
// ═══════════════════════════════════════════════════════════════════════════════

export default function Comunidad() {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [categorias, setCategorias] = useState([]);
  const [categoriaActual, setCategoriaActual] = useState(null);
  const [temas, setTemas] = useState([]);
  const [temaActual, setTemaActual] = useState(null);
  const [respuestas, setRespuestas] = useState([]);
  const [vista, setVista] = useState('categorias'); // categorias, temas, tema, nuevo
  const [busqueda, setBusqueda] = useState('');
  const [pagina, setPagina] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);

  // Formularios
  const [nuevoTema, setNuevoTema] = useState({ titulo: '', contenido: '' });
  const [nuevaRespuesta, setNuevaRespuesta] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [mensaje, setMensaje] = useState(null);

  // Modal reporte
  const [mostrarReporte, setMostrarReporte] = useState(null);
  const [motivoReporte, setMotivoReporte] = useState('');

  useEffect(() => {
    verificarUsuario();
  }, []);

  useEffect(() => {
    if (usuario?.esCirculo) {
      cargarCategorias();
    }
  }, [usuario]);

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

  async function cargarCategorias() {
    try {
      const res = await fetch('/api/comunidad?accion=categorias');
      const data = await res.json();
      if (data.success) {
        setCategorias(data.categorias);
      }
    } catch (e) {
      console.error('Error cargando categorías:', e);
    }
  }

  async function cargarTemas(catId, pag = 1) {
    try {
      const params = new URLSearchParams({
        categoria: catId,
        page: pag.toString()
      });
      if (busqueda) params.append('busqueda', busqueda);

      const res = await fetch(`/api/comunidad?${params}`);
      const data = await res.json();
      if (data.success) {
        setTemas(data.temas);
        setPagina(data.pagina);
        setTotalPaginas(data.totalPaginas);
      }
    } catch (e) {
      console.error('Error cargando temas:', e);
    }
  }

  async function cargarTema(temaId) {
    try {
      const res = await fetch(`/api/comunidad?accion=tema&temaId=${temaId}`);
      const data = await res.json();
      if (data.success) {
        setTemaActual(data.tema);
        setRespuestas(data.respuestas);
        setVista('tema');
      }
    } catch (e) {
      console.error('Error cargando tema:', e);
    }
  }

  async function crearTema() {
    if (!nuevoTema.titulo.trim() || !nuevoTema.contenido.trim()) {
      setMensaje({ tipo: 'error', texto: 'Completá título y contenido' });
      return;
    }

    setEnviando(true);
    try {
      const res = await fetch('/api/comunidad', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accion: 'crear-tema',
          email: usuario.email,
          nombre: usuario.nombre,
          categoria: categoriaActual.id,
          titulo: nuevoTema.titulo,
          contenido: nuevoTema.contenido
        })
      });

      const data = await res.json();
      if (data.success) {
        setMensaje({ tipo: 'exito', texto: 'Tema creado' });
        setNuevoTema({ titulo: '', contenido: '' });
        cargarTemas(categoriaActual.id);
        setVista('temas');
      } else {
        setMensaje({ tipo: 'error', texto: data.error });
      }
    } catch (e) {
      setMensaje({ tipo: 'error', texto: 'Error creando tema' });
    }
    setEnviando(false);
  }

  async function enviarRespuesta() {
    if (!nuevaRespuesta.trim()) return;

    setEnviando(true);
    try {
      const res = await fetch('/api/comunidad', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accion: 'responder',
          email: usuario.email,
          nombre: usuario.nombre,
          temaId: temaActual.id,
          contenido: nuevaRespuesta
        })
      });

      const data = await res.json();
      if (data.success) {
        setRespuestas([...respuestas, data.respuesta]);
        setNuevaRespuesta('');
        setTemaActual({ ...temaActual, totalRespuestas: (temaActual.totalRespuestas || 0) + 1 });
      } else {
        setMensaje({ tipo: 'error', texto: data.error });
      }
    } catch (e) {
      setMensaje({ tipo: 'error', texto: 'Error enviando respuesta' });
    }
    setEnviando(false);
  }

  async function darCorazon(temaId, respuestaId = null) {
    try {
      const res = await fetch('/api/comunidad', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accion: 'corazon',
          email: usuario.email,
          temaId,
          respuestaId
        })
      });

      const data = await res.json();
      if (data.success) {
        if (respuestaId) {
          setRespuestas(respuestas.map(r =>
            r.id === respuestaId
              ? { ...r, corazones: data.gustado ? [...(r.corazones || []), usuario.email] : (r.corazones || []).filter(e => e !== usuario.email) }
              : r
          ));
        } else {
          setTemaActual({
            ...temaActual,
            corazones: data.gustado ? [...(temaActual.corazones || []), usuario.email] : (temaActual.corazones || []).filter(e => e !== usuario.email)
          });
        }
      }
    } catch (e) {
      console.error('Error dando corazón:', e);
    }
  }

  async function reportar() {
    if (!motivoReporte.trim()) return;

    try {
      const res = await fetch('/api/comunidad', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accion: 'reportar',
          email: usuario.email,
          temaId: mostrarReporte.temaId,
          respuestaId: mostrarReporte.respuestaId,
          motivo: motivoReporte
        })
      });

      const data = await res.json();
      setMensaje({ tipo: data.success ? 'exito' : 'error', texto: data.mensaje || data.error });
      setMostrarReporte(null);
      setMotivoReporte('');
    } catch (e) {
      setMensaje({ tipo: 'error', texto: 'Error enviando reporte' });
    }
  }

  function seleccionarCategoria(cat) {
    setCategoriaActual(cat);
    setBusqueda('');
    setPagina(1);
    cargarTemas(cat.id, 1);
    setVista('temas');
  }

  function formatearFecha(fecha) {
    const d = new Date(fecha);
    const ahora = new Date();
    const diff = ahora - d;

    if (diff < 60000) return 'Ahora mismo';
    if (diff < 3600000) return `Hace ${Math.floor(diff / 60000)} min`;
    if (diff < 86400000) return `Hace ${Math.floor(diff / 3600000)} horas`;
    if (diff < 604800000) return `Hace ${Math.floor(diff / 86400000)} días`;

    return d.toLocaleDateString('es-UY', { day: 'numeric', month: 'short' });
  }

  // Estados de carga y acceso
  if (cargando) {
    return (
      <div className="comunidad-loading">
        <span className="icono-carga">◆</span>
        <p>Cargando comunidad...</p>
      </div>
    );
  }

  if (!usuario) {
    return (
      <div className="comunidad-acceso">
        <span className="icono-acceso">★</span>
        <h1>Comunidad del Círculo</h1>
        <p>Iniciá sesión en Mi Magia para acceder a la comunidad.</p>
        <a href="/mi-magia" className="btn-acceso">Ir a Mi Magia</a>
      </div>
    );
  }

  if (!usuario.esCirculo) {
    return (
      <div className="comunidad-acceso">
        <span className="icono-acceso">★</span>
        <h1>Comunidad del Círculo</h1>
        <p>Este espacio es exclusivo para miembros del Círculo de Duendes.</p>
        <p className="sub">Unite al Círculo para participar en la comunidad, compartir experiencias y conectar con otros guardianes.</p>
        <a href="/mi-magia/circulo" className="btn-acceso">Conocer el Círculo</a>
      </div>
    );
  }

  return (
    <div className="comunidad">
      {/* Header */}
      <header className="comunidad-header">
        <div className="header-nav">
          {vista !== 'categorias' && (
            <button
              className="btn-volver"
              onClick={() => {
                if (vista === 'tema') {
                  setVista('temas');
                  setTemaActual(null);
                } else if (vista === 'nuevo') {
                  setVista('temas');
                } else {
                  setVista('categorias');
                  setCategoriaActual(null);
                }
              }}
            >
              ← Volver
            </button>
          )}
          <a href="/mi-magia" className="link-mi-magia">Mi Magia</a>
        </div>
        <h1>Comunidad del Círculo</h1>
        <p>El santuario donde nos encontramos</p>
      </header>

      {/* Mensaje */}
      {mensaje && (
        <div className={`mensaje ${mensaje.tipo}`}>
          {mensaje.texto}
          <button onClick={() => setMensaje(null)}>×</button>
        </div>
      )}

      {/* Vista: Categorías */}
      {vista === 'categorias' && (
        <main className="categorias-view">
          <div className="bienvenida-box">
            <span className="bienvenida-icono">◆</span>
            <h2>Bienvenido/a, {usuario.nombre?.split(' ')[0] || 'alma mágica'}</h2>
            <p>Este es tu espacio seguro para compartir, preguntar y conectar con la tribu.</p>
          </div>

          <div className="categorias-grid">
            {categorias.map(cat => (
              <div
                key={cat.id}
                className="categoria-card"
                onClick={() => seleccionarCategoria(cat)}
                style={{ '--cat-color': cat.color }}
              >
                <span className="cat-icono">{cat.icono}</span>
                <div className="cat-info">
                  <h3>{cat.nombre}</h3>
                  <p>{cat.descripcion}</p>
                  <div className="cat-stats">
                    <span>{cat.totalTemas || 0} temas</span>
                    {cat.ultimoTema && (
                      <span className="ultimo">Último: {formatearFecha(cat.ultimoTema.creadoEn)}</span>
                    )}
                  </div>
                </div>
                <span className="cat-arrow">→</span>
              </div>
            ))}
          </div>
        </main>
      )}

      {/* Vista: Lista de Temas */}
      {vista === 'temas' && categoriaActual && (
        <main className="temas-view">
          <div className="temas-header" style={{ '--cat-color': categoriaActual.color }}>
            <span className="cat-icono-grande">{categoriaActual.icono}</span>
            <div>
              <h2>{categoriaActual.nombre}</h2>
              <p>{categoriaActual.descripcion}</p>
            </div>
          </div>

          <div className="temas-actions">
            <div className="busqueda-box">
              <input
                type="text"
                placeholder="Buscar temas..."
                value={busqueda}
                onChange={e => setBusqueda(e.target.value)}
                onKeyPress={e => e.key === 'Enter' && cargarTemas(categoriaActual.id, 1)}
              />
              <button onClick={() => cargarTemas(categoriaActual.id, 1)}>Buscar</button>
            </div>
            <button className="btn-nuevo-tema" onClick={() => setVista('nuevo')}>
              + Nuevo tema
            </button>
          </div>

          {temas.length === 0 ? (
            <div className="sin-temas">
              <span>◇</span>
              <h3>Aún no hay temas</h3>
              <p>Sé el primero en iniciar una conversación</p>
              <button className="btn-crear" onClick={() => setVista('nuevo')}>Crear primer tema</button>
            </div>
          ) : (
            <>
              <div className="temas-lista">
                {temas.map(tema => (
                  <div
                    key={tema.id}
                    className={`tema-card ${tema.fijado ? 'fijado' : ''}`}
                    onClick={() => cargarTema(tema.id)}
                  >
                    {tema.fijado && <span className="badge-fijado">Fijado</span>}
                    <h4>{tema.titulo}</h4>
                    <div className="tema-meta">
                      <span className="autor">Por {tema.autor}</span>
                      <span className="fecha">{formatearFecha(tema.creadoEn)}</span>
                    </div>
                    <div className="tema-stats">
                      <span>♥ {tema.corazones || 0}</span>
                      <span>💬 {tema.totalRespuestas || 0}</span>
                      <span>👁 {tema.vistas || 0}</span>
                    </div>
                  </div>
                ))}
              </div>

              {totalPaginas > 1 && (
                <div className="paginacion">
                  <button
                    disabled={pagina === 1}
                    onClick={() => { setPagina(pagina - 1); cargarTemas(categoriaActual.id, pagina - 1); }}
                  >
                    ← Anterior
                  </button>
                  <span>Página {pagina} de {totalPaginas}</span>
                  <button
                    disabled={pagina === totalPaginas}
                    onClick={() => { setPagina(pagina + 1); cargarTemas(categoriaActual.id, pagina + 1); }}
                  >
                    Siguiente →
                  </button>
                </div>
              )}
            </>
          )}
        </main>
      )}

      {/* Vista: Tema con respuestas */}
      {vista === 'tema' && temaActual && (
        <main className="tema-view">
          <article className="tema-principal">
            <div className="tema-cabecera">
              <h2>{temaActual.titulo}</h2>
              <div className="tema-autor">
                <span className="avatar">{temaActual.autor.nombre?.[0] || '?'}</span>
                <div>
                  <strong>{temaActual.autor.nombre}</strong>
                  <span>{formatearFecha(temaActual.creadoEn)}</span>
                  {temaActual.editadoEn && <span className="editado">(editado)</span>}
                </div>
              </div>
            </div>

            <div className="tema-contenido">
              {temaActual.contenido.split('\n').map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>

            <div className="tema-acciones">
              <button
                className={`btn-corazon ${(temaActual.corazones || []).includes(usuario.email) ? 'activo' : ''}`}
                onClick={() => darCorazon(temaActual.id)}
              >
                ♥ {(temaActual.corazones || []).length}
              </button>
              <button
                className="btn-reportar"
                onClick={() => setMostrarReporte({ temaId: temaActual.id })}
              >
                Reportar
              </button>
            </div>
          </article>

          {/* Respuestas */}
          <section className="respuestas">
            <h3>{respuestas.length} respuesta{respuestas.length !== 1 ? 's' : ''}</h3>

            {respuestas.map(resp => (
              <div key={resp.id} className="respuesta-card">
                <div className="resp-autor">
                  <span className="avatar">{resp.autor.nombre?.[0] || '?'}</span>
                  <div>
                    <strong>{resp.autor.nombre}</strong>
                    <span>{formatearFecha(resp.creadoEn)}</span>
                    {resp.editadoEn && <span className="editado">(editado)</span>}
                  </div>
                </div>

                <div className="resp-contenido">
                  {resp.contenido.split('\n').map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>

                <div className="resp-acciones">
                  <button
                    className={`btn-corazon ${(resp.corazones || []).includes(usuario.email) ? 'activo' : ''}`}
                    onClick={() => darCorazon(temaActual.id, resp.id)}
                  >
                    ♥ {(resp.corazones || []).length}
                  </button>
                  <button
                    className="btn-reportar"
                    onClick={() => setMostrarReporte({ temaId: temaActual.id, respuestaId: resp.id })}
                  >
                    Reportar
                  </button>
                </div>
              </div>
            ))}

            {/* Formulario de respuesta */}
            <div className="nueva-respuesta">
              <h4>Tu respuesta</h4>
              <textarea
                value={nuevaRespuesta}
                onChange={e => setNuevaRespuesta(e.target.value)}
                placeholder="Compartí tu perspectiva..."
                rows={4}
              />
              <button
                onClick={enviarRespuesta}
                disabled={enviando || !nuevaRespuesta.trim()}
                className="btn-enviar"
              >
                {enviando ? 'Enviando...' : 'Responder'}
              </button>
            </div>
          </section>
        </main>
      )}

      {/* Vista: Nuevo Tema */}
      {vista === 'nuevo' && categoriaActual && (
        <main className="nuevo-tema-view">
          <h2>Nuevo tema en {categoriaActual.nombre}</h2>

          <div className="form-nuevo-tema">
            <div className="form-group">
              <label>Título</label>
              <input
                type="text"
                value={nuevoTema.titulo}
                onChange={e => setNuevoTema({ ...nuevoTema, titulo: e.target.value })}
                placeholder="¿De qué querés hablar?"
                maxLength={200}
              />
            </div>

            <div className="form-group">
              <label>Contenido</label>
              <textarea
                value={nuevoTema.contenido}
                onChange={e => setNuevoTema({ ...nuevoTema, contenido: e.target.value })}
                placeholder="Contanos más..."
                rows={8}
                maxLength={5000}
              />
              <small>{nuevoTema.contenido.length}/5000 caracteres</small>
            </div>

            <div className="form-actions">
              <button onClick={() => setVista('temas')} className="btn-cancelar">Cancelar</button>
              <button
                onClick={crearTema}
                disabled={enviando || !nuevoTema.titulo.trim() || !nuevoTema.contenido.trim()}
                className="btn-publicar"
              >
                {enviando ? 'Publicando...' : 'Publicar tema'}
              </button>
            </div>
          </div>
        </main>
      )}

      {/* Modal Reporte */}
      {mostrarReporte && (
        <div className="modal-overlay" onClick={() => setMostrarReporte(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3>Reportar contenido</h3>
            <p>Indicanos el motivo del reporte:</p>
            <textarea
              value={motivoReporte}
              onChange={e => setMotivoReporte(e.target.value)}
              placeholder="Describe brevemente el problema..."
              rows={3}
            />
            <div className="modal-actions">
              <button onClick={() => setMostrarReporte(null)}>Cancelar</button>
              <button onClick={reportar} disabled={!motivoReporte.trim()} className="btn-enviar">
                Enviar reporte
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .comunidad {
          min-height: 100vh;
          background: linear-gradient(180deg, #faf8f3 0%, #fff 100%);
          font-family: 'Cormorant Garamond', Georgia, serif;
        }

        .comunidad-loading, .comunidad-acceso {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: linear-gradient(180deg, #faf8f3 0%, #fff 100%);
          text-align: center;
          padding: 2rem;
        }

        .icono-carga, .icono-acceso {
          font-size: 3rem;
          color: #d4af37;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.1); }
        }

        .comunidad-acceso h1 {
          font-family: 'Cinzel', serif;
          color: #1a1a1a;
          margin: 1rem 0 0.5rem;
        }

        .comunidad-acceso p { color: #666; margin: 0.5rem 0; }
        .comunidad-acceso .sub { font-size: 0.95rem; max-width: 400px; }

        .btn-acceso {
          margin-top: 1.5rem;
          padding: 12px 30px;
          background: linear-gradient(135deg, #d4af37, #b8962e);
          color: #1a1a1a;
          text-decoration: none;
          border-radius: 8px;
          font-family: 'Cinzel', serif;
          font-weight: 600;
        }

        .comunidad-header {
          background: linear-gradient(135deg, #1a1a1a 0%, #2a2520 100%);
          color: #fff;
          padding: 2rem;
          text-align: center;
        }

        .header-nav {
          display: flex;
          justify-content: space-between;
          margin-bottom: 1rem;
        }

        .btn-volver, .link-mi-magia {
          background: none;
          border: none;
          color: rgba(255,255,255,0.7);
          cursor: pointer;
          font-size: 0.9rem;
          text-decoration: none;
        }

        .btn-volver:hover, .link-mi-magia:hover { color: #d4af37; }

        .comunidad-header h1 {
          font-family: 'Cinzel', serif;
          font-size: 2rem;
          margin: 0;
          background: linear-gradient(135deg, #d4af37, #e8d5a3);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .comunidad-header p {
          color: rgba(255,255,255,0.7);
          margin: 0.5rem 0 0;
        }

        .mensaje {
          padding: 1rem 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .mensaje.exito { background: rgba(46, 204, 113, 0.1); color: #27ae60; }
        .mensaje.error { background: rgba(231, 76, 60, 0.1); color: #e74c3c; }
        .mensaje button { background: none; border: none; font-size: 1.2rem; cursor: pointer; color: inherit; }

        /* Categorías */
        .categorias-view { padding: 2rem; max-width: 900px; margin: 0 auto; }

        .bienvenida-box {
          text-align: center;
          padding: 2rem;
          background: #fff;
          border-radius: 16px;
          margin-bottom: 2rem;
          border: 1px solid #f0e6d3;
        }

        .bienvenida-icono { font-size: 2.5rem; color: #d4af37; }
        .bienvenida-box h2 { font-family: 'Cinzel', serif; margin: 1rem 0 0.5rem; color: #1a1a1a; }
        .bienvenida-box p { color: #666; margin: 0; }

        .categorias-grid { display: flex; flex-direction: column; gap: 1rem; }

        .categoria-card {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          padding: 1.5rem;
          background: #fff;
          border: 1px solid #f0e6d3;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .categoria-card:hover {
          border-color: var(--cat-color);
          box-shadow: 0 4px 20px rgba(0,0,0,0.05);
          transform: translateX(5px);
        }

        .cat-icono {
          font-size: 2rem;
          color: var(--cat-color);
          width: 50px;
          text-align: center;
        }

        .cat-info { flex: 1; }
        .cat-info h3 { font-family: 'Cinzel', serif; margin: 0 0 0.25rem; color: #1a1a1a; }
        .cat-info p { color: #666; margin: 0 0 0.5rem; font-size: 0.95rem; }
        .cat-stats { font-size: 0.85rem; color: #999; display: flex; gap: 1rem; }
        .cat-stats .ultimo { color: #888; }
        .cat-arrow { color: #ccc; font-size: 1.5rem; }

        /* Temas */
        .temas-view { padding: 2rem; max-width: 900px; margin: 0 auto; }

        .temas-header {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          padding: 1.5rem;
          background: #fff;
          border-radius: 12px;
          border-left: 4px solid var(--cat-color);
          margin-bottom: 1.5rem;
        }

        .cat-icono-grande { font-size: 2.5rem; color: var(--cat-color); }
        .temas-header h2 { font-family: 'Cinzel', serif; margin: 0; color: #1a1a1a; }
        .temas-header p { color: #666; margin: 0.25rem 0 0; }

        .temas-actions {
          display: flex;
          justify-content: space-between;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .busqueda-box {
          display: flex;
          flex: 1;
          max-width: 400px;
        }

        .busqueda-box input {
          flex: 1;
          padding: 10px 15px;
          border: 1px solid #e0d6c3;
          border-radius: 8px 0 0 8px;
          font-size: 0.95rem;
        }

        .busqueda-box button {
          padding: 10px 20px;
          background: #1a1a1a;
          color: #fff;
          border: none;
          border-radius: 0 8px 8px 0;
          cursor: pointer;
        }

        .btn-nuevo-tema {
          padding: 10px 20px;
          background: linear-gradient(135deg, #d4af37, #b8962e);
          color: #1a1a1a;
          border: none;
          border-radius: 8px;
          font-family: 'Cinzel', serif;
          font-weight: 600;
          cursor: pointer;
        }

        .sin-temas {
          text-align: center;
          padding: 3rem;
          background: #fff;
          border-radius: 12px;
        }

        .sin-temas span { font-size: 3rem; color: #d4af37; }
        .sin-temas h3 { font-family: 'Cinzel', serif; margin: 1rem 0 0.5rem; }
        .sin-temas p { color: #666; margin-bottom: 1.5rem; }

        .btn-crear {
          padding: 12px 24px;
          background: linear-gradient(135deg, #d4af37, #b8962e);
          color: #1a1a1a;
          border: none;
          border-radius: 8px;
          font-family: 'Cinzel', serif;
          cursor: pointer;
        }

        .temas-lista { display: flex; flex-direction: column; gap: 1rem; }

        .tema-card {
          background: #fff;
          border: 1px solid #f0e6d3;
          border-radius: 12px;
          padding: 1.25rem;
          cursor: pointer;
          transition: all 0.2s;
          position: relative;
        }

        .tema-card:hover {
          border-color: #d4af37;
          box-shadow: 0 4px 15px rgba(0,0,0,0.05);
        }

        .tema-card.fijado { border-left: 3px solid #d4af37; }

        .badge-fijado {
          position: absolute;
          top: 10px;
          right: 10px;
          background: #d4af37;
          color: #1a1a1a;
          font-size: 0.7rem;
          padding: 3px 8px;
          border-radius: 4px;
          font-weight: 600;
        }

        .tema-card h4 {
          font-family: 'Cinzel', serif;
          margin: 0 0 0.5rem;
          color: #1a1a1a;
          font-size: 1.1rem;
        }

        .tema-meta {
          display: flex;
          gap: 1rem;
          font-size: 0.85rem;
          color: #888;
          margin-bottom: 0.5rem;
        }

        .tema-stats {
          display: flex;
          gap: 1rem;
          font-size: 0.85rem;
          color: #999;
        }

        .paginacion {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 1rem;
          margin-top: 2rem;
        }

        .paginacion button {
          padding: 8px 16px;
          background: #fff;
          border: 1px solid #e0d6c3;
          border-radius: 6px;
          cursor: pointer;
        }

        .paginacion button:disabled { opacity: 0.5; cursor: not-allowed; }
        .paginacion span { color: #666; }

        /* Tema individual */
        .tema-view { padding: 2rem; max-width: 800px; margin: 0 auto; }

        .tema-principal {
          background: #fff;
          border-radius: 16px;
          padding: 2rem;
          margin-bottom: 2rem;
          border: 1px solid #f0e6d3;
        }

        .tema-cabecera h2 {
          font-family: 'Cinzel', serif;
          color: #1a1a1a;
          margin: 0 0 1rem;
        }

        .tema-autor {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .avatar {
          width: 45px;
          height: 45px;
          background: linear-gradient(135deg, #d4af37, #b8962e);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          font-weight: 600;
          font-family: 'Cinzel', serif;
        }

        .tema-autor strong { display: block; color: #1a1a1a; }
        .tema-autor span { font-size: 0.85rem; color: #888; margin-right: 0.5rem; }
        .editado { color: #aaa; font-style: italic; }

        .tema-contenido p { color: #444; line-height: 1.7; margin: 0 0 1rem; }

        .tema-acciones, .resp-acciones {
          display: flex;
          gap: 1rem;
          padding-top: 1rem;
          border-top: 1px solid #f0e6d3;
        }

        .btn-corazon {
          background: none;
          border: 1px solid #e0d6c3;
          padding: 8px 16px;
          border-radius: 20px;
          cursor: pointer;
          color: #888;
          transition: all 0.2s;
        }

        .btn-corazon:hover { border-color: #e74c3c; color: #e74c3c; }
        .btn-corazon.activo { background: #fde8e8; border-color: #e74c3c; color: #e74c3c; }

        .btn-reportar {
          background: none;
          border: none;
          color: #999;
          cursor: pointer;
          font-size: 0.85rem;
        }

        .btn-reportar:hover { color: #666; }

        /* Respuestas */
        .respuestas h3 {
          font-family: 'Cinzel', serif;
          color: #1a1a1a;
          margin: 0 0 1.5rem;
          font-size: 1.1rem;
        }

        .respuesta-card {
          background: #fff;
          border: 1px solid #f0e6d3;
          border-radius: 12px;
          padding: 1.5rem;
          margin-bottom: 1rem;
        }

        .resp-autor {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1rem;
        }

        .resp-autor .avatar { width: 35px; height: 35px; font-size: 0.9rem; }
        .resp-autor strong { font-size: 0.95rem; }
        .resp-contenido p { color: #444; line-height: 1.6; margin: 0 0 0.75rem; }

        .nueva-respuesta {
          background: #fff;
          border: 1px solid #f0e6d3;
          border-radius: 12px;
          padding: 1.5rem;
          margin-top: 2rem;
        }

        .nueva-respuesta h4 {
          font-family: 'Cinzel', serif;
          margin: 0 0 1rem;
          color: #1a1a1a;
        }

        .nueva-respuesta textarea {
          width: 100%;
          padding: 12px;
          border: 1px solid #e0d6c3;
          border-radius: 8px;
          font-family: inherit;
          font-size: 1rem;
          resize: vertical;
        }

        .btn-enviar {
          margin-top: 1rem;
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

        /* Nuevo tema */
        .nuevo-tema-view { padding: 2rem; max-width: 700px; margin: 0 auto; }

        .nuevo-tema-view h2 {
          font-family: 'Cinzel', serif;
          color: #1a1a1a;
          margin-bottom: 1.5rem;
        }

        .form-nuevo-tema {
          background: #fff;
          border-radius: 16px;
          padding: 2rem;
          border: 1px solid #f0e6d3;
        }

        .form-group { margin-bottom: 1.5rem; }
        .form-group label { display: block; font-weight: 600; color: #1a1a1a; margin-bottom: 0.5rem; }

        .form-group input, .form-group textarea {
          width: 100%;
          padding: 12px;
          border: 1px solid #e0d6c3;
          border-radius: 8px;
          font-family: inherit;
          font-size: 1rem;
        }

        .form-group small { color: #999; font-size: 0.85rem; }

        .form-actions { display: flex; justify-content: flex-end; gap: 1rem; }

        .btn-cancelar {
          padding: 12px 24px;
          background: #f5f5f5;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          cursor: pointer;
        }

        .btn-publicar {
          padding: 12px 24px;
          background: linear-gradient(135deg, #d4af37, #b8962e);
          color: #1a1a1a;
          border: none;
          border-radius: 8px;
          font-family: 'Cinzel', serif;
          font-weight: 600;
          cursor: pointer;
        }

        .btn-publicar:disabled { opacity: 0.5; cursor: not-allowed; }

        /* Modal */
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .modal {
          background: #fff;
          border-radius: 16px;
          padding: 2rem;
          max-width: 400px;
          width: 90%;
        }

        .modal h3 { font-family: 'Cinzel', serif; margin: 0 0 0.5rem; }
        .modal p { color: #666; margin: 0 0 1rem; }

        .modal textarea {
          width: 100%;
          padding: 12px;
          border: 1px solid #e0d6c3;
          border-radius: 8px;
          font-family: inherit;
          margin-bottom: 1rem;
        }

        .modal-actions { display: flex; justify-content: flex-end; gap: 1rem; }

        .modal-actions button {
          padding: 10px 20px;
          border-radius: 8px;
          cursor: pointer;
        }

        .modal-actions button:first-child { background: #f5f5f5; border: none; }

        @media (max-width: 768px) {
          .temas-actions { flex-direction: column; }
          .busqueda-box { max-width: 100%; }
          .categoria-card { flex-direction: column; text-align: center; }
          .cat-arrow { display: none; }
        }
      `}</style>
    </div>
  );
}
