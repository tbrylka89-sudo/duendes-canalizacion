'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';

// ═══════════════════════════════════════════════════════════════════════════════
// DETALLE DE CANALIZACIÓN
// Preview + Resumen IA + Chat Editor
// ═══════════════════════════════════════════════════════════════════════════════

export default function CanalizacionDetalle() {
  const router = useRouter();
  const params = useParams();
  const canalizacionId = params.id;

  const [canalizacion, setCanalizacion] = useState(null);
  const [resumen, setResumen] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [cargandoResumen, setCargandoResumen] = useState(false);
  const [cargandoAccion, setCargandoAccion] = useState(false);

  // Chat state
  const [mensajes, setMensajes] = useState([]);
  const [inputChat, setInputChat] = useState('');
  const [cargandoChat, setCargandoChat] = useState(false);
  const chatRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    cargarCanalizacion();
  }, [canalizacionId]);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [mensajes]);

  async function cargarCanalizacion() {
    setCargando(true);
    try {
      const res = await fetch(`/api/admin/canalizaciones?id=${encodeURIComponent(canalizacionId)}`);
      const data = await res.json();
      if (data.success && data.canalizacion) {
        setCanalizacion(data.canalizacion);

        // Cargar o generar resumen
        if (data.canalizacion.resumenEjecutivo) {
          setResumen(data.canalizacion.resumenEjecutivo);
        } else {
          generarResumen(canalizacionId);
        }

        // Mensaje inicial del chat
        setMensajes([{
          rol: 'asistente',
          contenido: `Esta canalización de **${data.canalizacion.guardian?.nombre}** está ${data.canalizacion.estado === 'pendiente' ? 'pendiente de revisión' : data.canalizacion.estado}.\n\n¿Qué querés ajustar antes de ${data.canalizacion.estado === 'pendiente' ? 'aprobarla' : 'continuar'}?`,
          timestamp: new Date().toISOString()
        }]);
      }
    } catch (error) {
      console.error('Error cargando canalización:', error);
    }
    setCargando(false);
  }

  async function generarResumen(id) {
    setCargandoResumen(true);
    try {
      const res = await fetch('/api/admin/canalizaciones/resumen', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ canalizacionId: id })
      });
      const data = await res.json();
      if (data.success) {
        setResumen(data.resumen);
      }
    } catch (error) {
      console.error('Error generando resumen:', error);
    }
    setCargandoResumen(false);
  }

  async function enviarMensajeChat(e) {
    e?.preventDefault();
    if (!inputChat.trim() || cargandoChat) return;

    const mensaje = inputChat.trim();
    setInputChat('');

    setMensajes(prev => [...prev, {
      rol: 'usuario',
      contenido: mensaje,
      timestamp: new Date().toISOString()
    }]);

    setCargandoChat(true);

    try {
      const res = await fetch('/api/admin/canalizaciones/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          canalizacionId,
          mensaje,
          historial: mensajes.slice(-10)
        })
      });

      const data = await res.json();

      if (data.success) {
        setMensajes(prev => [...prev, {
          rol: 'asistente',
          contenido: data.respuesta,
          acciones: data.acciones,
          preview: data.preview,
          timestamp: new Date().toISOString()
        }]);

        // Si se actualizó el contenido, recargar
        if (data.contenidoActualizado) {
          setCanalizacion(prev => ({
            ...prev,
            contenido: data.contenidoActualizado
          }));
        }
      } else {
        setMensajes(prev => [...prev, {
          rol: 'asistente',
          contenido: `Error: ${data.error}`,
          timestamp: new Date().toISOString()
        }]);
      }
    } catch (error) {
      setMensajes(prev => [...prev, {
        rol: 'asistente',
        contenido: `Error de conexión: ${error.message}`,
        timestamp: new Date().toISOString()
      }]);
    }

    setCargandoChat(false);
  }

  async function ejecutarAccion(accion) {
    setCargandoChat(true);
    setMensajes(prev => [...prev, {
      rol: 'sistema',
      contenido: `Ejecutando: ${accion.label}...`,
      timestamp: new Date().toISOString()
    }]);

    try {
      const res = await fetch('/api/admin/canalizaciones/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          canalizacionId,
          ejecutarAccion: accion
        })
      });

      const data = await res.json();

      setMensajes(prev => [...prev, {
        rol: 'asistente',
        contenido: data.respuesta || 'Acción completada.',
        acciones: data.acciones,
        preview: data.preview,
        timestamp: new Date().toISOString()
      }]);

      if (data.contenidoActualizado) {
        setCanalizacion(prev => ({
          ...prev,
          contenido: data.contenidoActualizado
        }));
      }
    } catch (error) {
      setMensajes(prev => [...prev, {
        rol: 'asistente',
        contenido: `Error: ${error.message}`,
        timestamp: new Date().toISOString()
      }]);
    }

    setCargandoChat(false);
  }

  async function cambiarEstado(accion) {
    if (cargandoAccion) return;

    const confirmar = accion === 'enviar'
      ? window.confirm('¿Enviar esta canalización al cliente? Aparecerá en Mi Magia.')
      : true;

    if (!confirmar) return;

    setCargandoAccion(true);

    try {
      const res = await fetch('/api/admin/canalizaciones', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: canalizacionId,
          accion
        })
      });

      const data = await res.json();

      if (data.success) {
        setCanalizacion(prev => ({
          ...prev,
          estado: data.canalizacion.estado,
          fechaAprobada: data.canalizacion.fechaAprobada,
          fechaEnviada: data.canalizacion.fechaEnviada
        }));

        setMensajes(prev => [...prev, {
          rol: 'sistema',
          contenido: accion === 'aprobar'
            ? 'Canalización aprobada. Ahora podés enviarla al cliente.'
            : 'Canalización enviada. El cliente ya puede verla en Mi Magia.',
          timestamp: new Date().toISOString()
        }]);
      }
    } catch (error) {
      console.error('Error cambiando estado:', error);
    }

    setCargandoAccion(false);
  }

  if (cargando) {
    return (
      <div className="cargando-container">
        <div className="spinner"></div>
        <p>Cargando canalización...</p>
        <style jsx>{`
          .cargando-container {
            min-height: 100vh;
            background: #0a0a0a;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            color: #888;
            font-family: 'Cinzel', serif;
          }
          .spinner {
            width: 50px;
            height: 50px;
            border: 3px solid rgba(212,175,55,0.2);
            border-top-color: #d4af37;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin-bottom: 1rem;
          }
          @keyframes spin { to { transform: rotate(360deg); } }
        `}</style>
      </div>
    );
  }

  if (!canalizacion) {
    return (
      <div className="error-container">
        <p>Canalización no encontrada</p>
        <button onClick={() => router.push('/admin/canalizaciones')}>Volver</button>
        <style jsx>{`
          .error-container {
            min-height: 100vh;
            background: #0a0a0a;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            color: #888;
            font-family: 'Cinzel', serif;
            gap: 1rem;
          }
          button {
            padding: 0.75rem 1.5rem;
            background: #d4af37;
            border: none;
            color: #0a0a0a;
            font-family: inherit;
            border-radius: 6px;
            cursor: pointer;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="detalle-container">
      {/* Header */}
      <header className="header">
        <div className="header-left">
          <button
            type="button"
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); router.push('/admin/canalizaciones'); }}
            className="btn-back"
          >
            &#8592;
          </button>
          <div className="header-info">
            <h1 className="titulo">{canalizacion.guardian?.nombre} para {canalizacion.nombreDestinatario || canalizacion.nombreCliente}</h1>
            <p className="subtitulo">
              Orden #{canalizacion.ordenId?.toString().slice(-4)} &bull;
              <span className={`estado ${canalizacion.estado}`}>
                {canalizacion.estado}
              </span>
            </p>
          </div>
        </div>
        <div className="header-actions">
          {canalizacion.estado === 'pendiente' && (
            <button
              onClick={() => cambiarEstado('aprobar')}
              className="btn-aprobar"
              disabled={cargandoAccion}
            >
              {cargandoAccion ? 'Aprobando...' : 'Aprobar'}
            </button>
          )}
          {(canalizacion.estado === 'pendiente' || canalizacion.estado === 'aprobada') && (
            <button
              onClick={() => cambiarEstado('enviar')}
              className="btn-enviar"
              disabled={cargandoAccion}
            >
              {cargandoAccion ? 'Enviando...' : 'Enviar al Cliente'}
            </button>
          )}
        </div>
      </header>

      {/* Main Content - 2 columnas */}
      <div className="main-content">
        {/* Columna izquierda - Resumen IA */}
        <aside className="columna-resumen">
          <div className="panel resumen-panel">
            <h2 className="panel-titulo">Resumen IA</h2>

            {cargandoResumen ? (
              <div className="resumen-loading">
                <div className="spinner-small"></div>
                <p>Analizando canalización...</p>
              </div>
            ) : resumen ? (
              <div className="resumen-contenido">
                <div className="resumen-seccion">
                  <label>Cliente</label>
                  <p className="resumen-cliente">{resumen.cliente?.nombre}</p>
                  {resumen.cliente?.relacion && (
                    <p className="resumen-meta">{resumen.cliente.relacion}</p>
                  )}
                  <p className="resumen-contexto">{resumen.cliente?.contexto}</p>
                </div>

                <div className="resumen-seccion">
                  <label>Guardián</label>
                  <p className="resumen-guardian">{resumen.guardian?.nombre}</p>
                  <p className="resumen-enfoque">{resumen.guardian?.enfoque}</p>
                </div>

                <div className="resumen-seccion">
                  <label>Lo importante</label>
                  <ul className="resumen-puntos">
                    {resumen.loImportante?.map((punto, i) => (
                      <li key={i}>{punto}</li>
                    ))}
                  </ul>
                </div>

                {resumen.ritual && (
                  <div className="resumen-seccion">
                    <label>Ritual</label>
                    <p>{resumen.ritual.tipo}</p>
                    {resumen.ritual.elementos?.length > 0 && (
                      <p className="resumen-elementos">{resumen.ritual.elementos.join(', ')}</p>
                    )}
                  </div>
                )}

                {resumen.mencionesEspeciales?.length > 0 && (
                  <div className="resumen-seccion">
                    <label>Menciones especiales</label>
                    <p className="resumen-menciones">{resumen.mencionesEspeciales.join(', ')}</p>
                  </div>
                )}

                {resumen.alertas?.length > 0 && (
                  <div className="resumen-seccion alertas">
                    <label>Alertas</label>
                    {resumen.alertas.map((alerta, i) => (
                      <p key={i} className="resumen-alerta">{alerta}</p>
                    ))}
                  </div>
                )}

                <div className="resumen-estado">
                  <span className={`badge ${resumen.estadoGeneral}`}>
                    {resumen.estadoGeneral === 'lista' ? 'Lista para aprobar' :
                     resumen.estadoGeneral === 'necesita_revision' ? 'Revisar' : 'Problemas'}
                  </span>
                </div>
              </div>
            ) : (
              <p className="resumen-vacio">No hay resumen disponible</p>
            )}

            <button onClick={() => generarResumen(canalizacionId)} className="btn-regenerar" disabled={cargandoResumen}>
              Regenerar resumen
            </button>
          </div>
        </aside>

        {/* Columna derecha - Preview */}
        <main className="columna-preview">
          <div className="panel preview-panel">
            <h2 className="panel-titulo">Vista Previa</h2>
            <div className="preview-content" dangerouslySetInnerHTML={{
              __html: formatearContenido(canalizacion.contenido)
            }} />
          </div>
        </main>
      </div>

      {/* Chat Editor - Abajo */}
      <div className="chat-editor">
        <div className="chat-header">
          <h3>Chat Editor</h3>
          <span className="chat-hint">Pedí cambios en lenguaje natural</span>
        </div>

        <div className="chat-mensajes" ref={chatRef}>
          {mensajes.map((msg, i) => (
            <div key={i} className={`mensaje ${msg.rol}`}>
              {msg.rol === 'asistente' && (
                <div className="avatar-asistente">&#10022;</div>
              )}
              <div className="mensaje-contenido">
                <div className="mensaje-texto" dangerouslySetInnerHTML={{
                  __html: formatearMensaje(msg.contenido)
                }} />

                {msg.preview && (
                  <div className="preview-box">
                    <div className="preview-header">Vista previa del cambio</div>
                    <div className="preview-inner">{msg.preview}</div>
                  </div>
                )}

                {msg.acciones?.length > 0 && (
                  <div className="acciones">
                    {msg.acciones.map((accion, j) => (
                      <button
                        key={j}
                        onClick={() => ejecutarAccion(accion)}
                        className="btn-accion"
                        disabled={cargandoChat}
                      >
                        {accion.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {cargandoChat && (
            <div className="mensaje asistente">
              <div className="avatar-asistente">&#10022;</div>
              <div className="mensaje-contenido">
                <div className="typing-indicator">
                  <span></span><span></span><span></span>
                </div>
              </div>
            </div>
          )}
        </div>

        <form onSubmit={enviarMensajeChat} className="chat-input-container">
          <input
            ref={inputRef}
            type="text"
            value={inputChat}
            onChange={(e) => setInputChat(e.target.value)}
            placeholder="Ej: Acortá el ritual, cambiá el tono a más cálido..."
            className="chat-input"
            disabled={cargandoChat}
          />
          <button type="submit" className="btn-enviar-chat" disabled={cargandoChat || !inputChat.trim()}>
            Enviar
          </button>
        </form>
      </div>

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&family=MedievalSharp&display=swap');

        .detalle-container {
          min-height: 100vh;
          background: #0a0a0a;
          font-family: 'Cinzel', serif;
          color: #e8e0d5;
          display: flex;
          flex-direction: column;
        }

        .detalle-container *::before,
        .detalle-container *::after {
          background-image: none !important;
        }

        /* Header */
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 2rem;
          background: rgba(15,15,15,0.98);
          border-bottom: 1px solid rgba(212,175,55,0.1);
          position: sticky;
          top: 0;
          z-index: 1000;
          overflow: visible;
        }

        .header::before {
          display: none !important;
        }

        .header * {
          pointer-events: auto;
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .btn-back {
          width: 40px;
          height: 40px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          color: #d4af37;
          font-size: 1.25rem;
          border-radius: 8px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
          position: relative;
          z-index: 100;
        }

        .btn-back:hover {
          background: rgba(212,175,55,0.1);
        }

        .header-info {
          display: flex;
          flex-direction: column;
        }

        .titulo {
          font-family: 'MedievalSharp', cursive;
          font-size: 1.25rem;
          color: #d4af37;
          margin: 0;
        }

        .subtitulo {
          font-size: 0.8rem;
          color: #888;
          margin: 0;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .estado {
          padding: 0.15rem 0.5rem;
          border-radius: 4px;
          font-size: 0.7rem;
          text-transform: uppercase;
          font-weight: 600;
        }

        .estado.pendiente { background: rgba(255,180,50,0.2); color: #ffb432; }
        .estado.aprobada { background: rgba(100,200,100,0.2); color: #6c6; }
        .estado.enviada { background: rgba(100,150,255,0.2); color: #7af; }

        .header-actions {
          display: flex;
          gap: 0.75rem;
        }

        .btn-aprobar, .btn-enviar {
          padding: 0.6rem 1.25rem;
          border: none;
          font-family: 'Cinzel', serif;
          font-size: 0.85rem;
          font-weight: 600;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s;
          position: relative;
          z-index: 100;
        }

        .btn-aprobar {
          background: rgba(100,200,100,0.2);
          color: #6c6;
          border: 1px solid rgba(100,200,100,0.3);
        }

        .btn-aprobar:hover:not(:disabled) {
          background: rgba(100,200,100,0.3);
        }

        .btn-enviar {
          background: linear-gradient(135deg, #d4af37, #aa8a2e);
          color: #0a0a0a;
        }

        .btn-enviar:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(212,175,55,0.3);
        }

        .btn-aprobar:disabled, .btn-enviar:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none;
        }

        /* Main Content */
        .main-content {
          display: grid;
          grid-template-columns: 320px 1fr;
          gap: 1rem;
          padding: 1rem 2rem;
          flex: 1;
          min-height: 0;
        }

        .panel {
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 12px;
          padding: 1.25rem;
        }

        .panel-titulo {
          font-size: 0.85rem;
          color: #d4af37;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin: 0 0 1rem;
          padding-bottom: 0.75rem;
          border-bottom: 1px solid rgba(212,175,55,0.1);
        }

        /* Resumen */
        .columna-resumen {
          position: sticky;
          top: 80px;
          height: fit-content;
          max-height: calc(100vh - 280px);
          overflow-y: auto;
        }

        .resumen-loading {
          text-align: center;
          padding: 2rem;
          color: #666;
        }

        .spinner-small {
          width: 30px;
          height: 30px;
          border: 2px solid rgba(212,175,55,0.2);
          border-top-color: #d4af37;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 1rem;
        }

        @keyframes spin { to { transform: rotate(360deg); } }

        .resumen-contenido {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .resumen-seccion {
          padding-bottom: 0.75rem;
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }

        .resumen-seccion:last-of-type {
          border-bottom: none;
        }

        .resumen-seccion label {
          display: block;
          font-size: 0.7rem;
          color: #888;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 0.25rem;
        }

        .resumen-cliente, .resumen-guardian {
          font-size: 1rem;
          color: #e8e0d5;
          margin: 0;
        }

        .resumen-meta, .resumen-contexto, .resumen-enfoque {
          font-size: 0.85rem;
          color: #999;
          margin: 0.25rem 0 0;
        }

        .resumen-puntos {
          margin: 0.5rem 0 0;
          padding-left: 1.25rem;
          font-size: 0.85rem;
          color: #ccc;
        }

        .resumen-puntos li {
          margin-bottom: 0.35rem;
        }

        .resumen-elementos, .resumen-menciones {
          font-size: 0.8rem;
          color: #888;
          font-style: italic;
          margin: 0.25rem 0 0;
        }

        .resumen-seccion.alertas {
          background: rgba(255,100,100,0.1);
          padding: 0.75rem;
          border-radius: 6px;
          border: 1px solid rgba(255,100,100,0.2);
        }

        .resumen-alerta {
          color: #f88;
          font-size: 0.85rem;
          margin: 0.25rem 0 0;
        }

        .resumen-estado {
          margin-top: 0.5rem;
        }

        .badge {
          display: inline-block;
          padding: 0.3rem 0.75rem;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 600;
        }

        .badge.lista { background: rgba(100,200,100,0.2); color: #6c6; }
        .badge.necesita_revision { background: rgba(255,180,50,0.2); color: #ffb432; }
        .badge.problematico { background: rgba(255,100,100,0.2); color: #f88; }

        .btn-regenerar {
          width: 100%;
          margin-top: 1rem;
          padding: 0.5rem;
          background: transparent;
          border: 1px solid rgba(212,175,55,0.2);
          color: #d4af37;
          font-family: 'Cinzel', serif;
          font-size: 0.8rem;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-regenerar:hover:not(:disabled) {
          background: rgba(212,175,55,0.1);
        }

        .btn-regenerar:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        /* Preview */
        .columna-preview {
          min-height: 0;
        }

        .preview-panel {
          height: calc(100vh - 280px);
          display: flex;
          flex-direction: column;
        }

        .preview-content {
          flex: 1;
          overflow-y: auto;
          font-size: 0.95rem;
          line-height: 1.8;
          padding-right: 0.5rem;
        }

        .preview-content :global(h1) {
          font-family: 'MedievalSharp', cursive;
          color: #d4af37;
          font-size: 1.5rem;
          margin: 0 0 1rem;
        }

        .preview-content :global(h2) {
          color: #d4af37;
          font-size: 1.1rem;
          margin: 1.5rem 0 0.75rem;
          opacity: 0.9;
        }

        .preview-content :global(p) {
          margin: 0 0 1rem;
          color: #ddd;
        }

        .preview-content :global(hr) {
          border: none;
          border-top: 1px solid rgba(212,175,55,0.2);
          margin: 1.5rem 0;
        }

        /* Chat Editor */
        .chat-editor {
          background: rgba(15,15,15,0.95);
          border-top: 1px solid rgba(212,175,55,0.1);
          padding: 0;
          max-height: 300px;
          display: flex;
          flex-direction: column;
        }

        .chat-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.75rem 2rem;
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }

        .chat-header h3 {
          font-size: 0.9rem;
          color: #d4af37;
          margin: 0;
        }

        .chat-hint {
          font-size: 0.75rem;
          color: #666;
        }

        .chat-mensajes {
          flex: 1;
          overflow-y: auto;
          padding: 1rem 2rem;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .mensaje {
          display: flex;
          gap: 0.75rem;
          animation: fadeIn 0.3s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(5px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .mensaje.usuario {
          justify-content: flex-end;
        }

        .mensaje.usuario .mensaje-contenido {
          background: rgba(212,175,55,0.1);
          border: 1px solid rgba(212,175,55,0.2);
          border-radius: 12px 12px 4px 12px;
        }

        .mensaje.asistente .mensaje-contenido {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 12px 12px 12px 4px;
        }

        .mensaje.sistema .mensaje-contenido {
          background: rgba(100,100,100,0.1);
          border: 1px dashed rgba(255,255,255,0.1);
          font-style: italic;
          color: #888;
        }

        .avatar-asistente {
          width: 32px;
          height: 32px;
          background: linear-gradient(135deg, #1a1a2e, #2d2d44);
          border: 1px solid rgba(212,175,55,0.3);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #d4af37;
          font-size: 1rem;
          flex-shrink: 0;
        }

        .mensaje-contenido {
          max-width: 600px;
          padding: 0.75rem 1rem;
        }

        .mensaje-texto {
          font-size: 0.9rem;
          line-height: 1.5;
        }

        .mensaje-texto :global(strong) {
          color: #d4af37;
        }

        .preview-box {
          margin-top: 0.75rem;
          background: rgba(0,0,0,0.3);
          border: 1px solid rgba(212,175,55,0.2);
          border-radius: 8px;
          overflow: hidden;
        }

        .preview-box .preview-header {
          background: rgba(212,175,55,0.1);
          padding: 0.4rem 0.75rem;
          font-size: 0.7rem;
          color: #d4af37;
          text-transform: uppercase;
        }

        .preview-inner {
          padding: 0.75rem;
          font-size: 0.85rem;
          max-height: 100px;
          overflow-y: auto;
        }

        .acciones {
          display: flex;
          gap: 0.5rem;
          margin-top: 0.75rem;
          flex-wrap: wrap;
        }

        .btn-accion {
          padding: 0.4rem 1rem;
          background: linear-gradient(135deg, #d4af37, #aa8a2e);
          border: none;
          color: #0a0a0a;
          font-family: 'Cinzel', serif;
          font-size: 0.8rem;
          font-weight: 600;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-accion:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 2px 8px rgba(212,175,55,0.3);
        }

        .btn-accion:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .typing-indicator {
          display: flex;
          gap: 4px;
          padding: 0.25rem 0;
        }

        .typing-indicator span {
          width: 6px;
          height: 6px;
          background: #d4af37;
          border-radius: 50%;
          animation: bounce 1.4s infinite ease-in-out;
        }

        .typing-indicator span:nth-child(1) { animation-delay: -0.32s; }
        .typing-indicator span:nth-child(2) { animation-delay: -0.16s; }

        @keyframes bounce {
          0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
          40% { transform: scale(1); opacity: 1; }
        }

        /* Chat Input */
        .chat-input-container {
          display: flex;
          gap: 0.75rem;
          padding: 0.75rem 2rem;
          border-top: 1px solid rgba(255,255,255,0.05);
        }

        .chat-input {
          flex: 1;
          padding: 0.75rem 1rem;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 8px;
          color: #e8e0d5;
          font-family: 'Cinzel', serif;
          font-size: 0.9rem;
          outline: none;
          transition: all 0.2s;
        }

        .chat-input:focus {
          border-color: rgba(212,175,55,0.4);
        }

        .chat-input::placeholder {
          color: #555;
        }

        .btn-enviar-chat {
          padding: 0.75rem 1.5rem;
          background: linear-gradient(135deg, #d4af37, #aa8a2e);
          border: none;
          color: #0a0a0a;
          font-family: 'Cinzel', serif;
          font-size: 0.9rem;
          font-weight: 600;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-enviar-chat:hover:not(:disabled) {
          transform: scale(1.02);
        }

        .btn-enviar-chat:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        /* Scrollbar */
        .chat-mensajes::-webkit-scrollbar,
        .preview-content::-webkit-scrollbar,
        .columna-resumen::-webkit-scrollbar {
          width: 5px;
        }

        .chat-mensajes::-webkit-scrollbar-track,
        .preview-content::-webkit-scrollbar-track,
        .columna-resumen::-webkit-scrollbar-track {
          background: transparent;
        }

        .chat-mensajes::-webkit-scrollbar-thumb,
        .preview-content::-webkit-scrollbar-thumb,
        .columna-resumen::-webkit-scrollbar-thumb {
          background: rgba(212,175,55,0.2);
          border-radius: 3px;
        }

        /* Responsive */
        @media (max-width: 1024px) {
          .main-content {
            grid-template-columns: 1fr;
          }

          .columna-resumen {
            position: static;
            max-height: none;
          }

          .preview-panel {
            height: 400px;
          }
        }

        @media (max-width: 768px) {
          .header {
            flex-direction: column;
            gap: 1rem;
            padding: 1rem;
          }

          .main-content {
            padding: 1rem;
          }

          .chat-input-container,
          .chat-header,
          .chat-mensajes {
            padding-left: 1rem;
            padding-right: 1rem;
          }
        }
      `}</style>
    </div>
  );
}

function formatearContenido(contenido) {
  if (!contenido) return '<p>Sin contenido</p>';

  let html = contenido
    // Headers
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    // Bold & Italic
    .replace(/\*\*\*([^*]+)\*\*\*/g, '<strong><em>$1</em></strong>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>')
    // HR
    .replace(/^---$/gm, '<hr>')
    // Line breaks
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br>');

  return `<p>${html}</p>`;
}

function formatearMensaje(texto) {
  if (!texto) return '';

  return texto
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br>');
}
