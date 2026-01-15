'use client';
import { useState, useEffect } from 'react';

// ═══════════════════════════════════════════════════════════════════════════════
// ADMIN: GENERADOR DE CONTENIDO DEL CÍRCULO
// Interfaz profesional para crear contenido desde la voz de cada guardián
// ═══════════════════════════════════════════════════════════════════════════════

export default function AdminCirculoContenido() {
  // Estados
  const [guardianes, setGuardianes] = useState([]);
  const [guardianSeleccionado, setGuardianSeleccionado] = useState(null);
  const [tipoContenido, setTipoContenido] = useState('ensenanza');
  const [tema, setTema] = useState('');
  const [instrucciones, setInstrucciones] = useState('');
  const [palabras, setPalabras] = useState(1500);

  const [generando, setGenerando] = useState(false);
  const [contenidoGenerado, setContenidoGenerado] = useState(null);
  const [error, setError] = useState(null);

  const [historial, setHistorial] = useState([]);
  const [vistaActiva, setVistaActiva] = useState('generar'); // generar, historial, programar

  // Cargar guardianes al inicio
  useEffect(() => {
    cargarGuardianes();
    cargarHistorial();
  }, []);

  async function cargarGuardianes() {
    try {
      const res = await fetch('/api/admin/productos');
      const data = await res.json();
      if (data.success) {
        // Filtrar solo productos con imagen
        const conImagen = (data.productos || []).filter(p => p.imagen);
        setGuardianes(conImagen);
      }
    } catch (err) {
      console.error('Error cargando guardianes:', err);
    }
  }

  async function cargarHistorial() {
    try {
      const res = await fetch('/api/admin/contenido/historial');
      const data = await res.json();
      if (data.success) {
        setHistorial(data.contenidos || []);
      }
    } catch (err) {
      console.error('Error cargando historial:', err);
    }
  }

  async function generarContenido() {
    if (!guardianSeleccionado) {
      setError('Seleccioná un guardián primero');
      return;
    }

    setGenerando(true);
    setError(null);
    setContenidoGenerado(null);

    try {
      const res = await fetch('/api/circulo/generar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          guardian_id: guardianSeleccionado.id,
          tipo: tipoContenido,
          tema: tema || undefined,
          palabras,
          instrucciones: instrucciones || undefined
        })
      });

      const data = await res.json();

      if (data.success) {
        setContenidoGenerado(data);
        cargarHistorial(); // Actualizar historial
      } else {
        setError(data.error || 'Error generando contenido');
      }
    } catch (err) {
      setError('Error de conexión');
      console.error(err);
    } finally {
      setGenerando(false);
    }
  }

  const TIPOS_CONTENIDO = [
    { id: 'mensaje_diario', nombre: 'Mensaje del Día', desc: 'Saludo breve y profundo', icon: '🌅' },
    { id: 'ensenanza', nombre: 'Enseñanza', desc: 'Lección desde su perspectiva', icon: '📜' },
    { id: 'ritual', nombre: 'Ritual', desc: 'Práctica guiada', icon: '🕯️' },
    { id: 'meditacion', nombre: 'Meditación', desc: 'Viaje interior guiado', icon: '🧘' },
    { id: 'diy', nombre: 'Proyecto DIY', desc: 'Creación artesanal', icon: '✂️' },
    { id: 'altar', nombre: 'Altar', desc: 'Crear espacio sagrado', icon: '🏛️' }
  ];

  return (
    <div className="admin-circulo">
      {/* Header */}
      <header className="admin-header">
        <div className="header-left">
          <h1>Círculo de Duendes</h1>
          <span className="subtitulo">Generador de Contenido</span>
        </div>
        <nav className="header-nav">
          <button
            className={vistaActiva === 'generar' ? 'active' : ''}
            onClick={() => setVistaActiva('generar')}
          >
            Generar
          </button>
          <button
            className={vistaActiva === 'historial' ? 'active' : ''}
            onClick={() => setVistaActiva('historial')}
          >
            Historial
          </button>
          <button
            className={vistaActiva === 'programar' ? 'active' : ''}
            onClick={() => setVistaActiva('programar')}
          >
            Programar
          </button>
        </nav>
      </header>

      <main className="admin-main">
        {/* VISTA: GENERAR */}
        {vistaActiva === 'generar' && (
          <div className="vista-generar">
            <div className="generar-grid">
              {/* Panel izquierdo: Configuración */}
              <div className="panel-config">
                <h2>Configuración</h2>

                {/* Selector de Guardián */}
                <div className="form-section">
                  <label>Guardián Protagonista</label>
                  <div className="guardian-selector">
                    {guardianSeleccionado ? (
                      <div className="guardian-seleccionado" onClick={() => setGuardianSeleccionado(null)}>
                        <img src={guardianSeleccionado.imagen} alt={guardianSeleccionado.nombre} />
                        <div className="info">
                          <span className="nombre">{guardianSeleccionado.guardian || guardianSeleccionado.nombre}</span>
                          <span className="categoria">{guardianSeleccionado.categoria}</span>
                        </div>
                        <button className="btn-cambiar">Cambiar</button>
                      </div>
                    ) : (
                      <div className="guardian-grid">
                        {guardianes.slice(0, 12).map(g => (
                          <div
                            key={g.id}
                            className="guardian-mini"
                            onClick={() => setGuardianSeleccionado(g)}
                          >
                            <img src={g.imagen} alt={g.nombre} />
                            <span>{g.guardian || g.nombre?.split(' ')[0]}</span>
                          </div>
                        ))}
                        {guardianes.length > 12 && (
                          <div className="guardian-mini ver-mas">
                            +{guardianes.length - 12} más
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Tipo de contenido */}
                <div className="form-section">
                  <label>Tipo de Contenido</label>
                  <div className="tipos-grid">
                    {TIPOS_CONTENIDO.map(tipo => (
                      <div
                        key={tipo.id}
                        className={`tipo-card ${tipoContenido === tipo.id ? 'active' : ''}`}
                        onClick={() => setTipoContenido(tipo.id)}
                      >
                        <span className="icon">{tipo.icon}</span>
                        <span className="nombre">{tipo.nombre}</span>
                        <span className="desc">{tipo.desc}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tema */}
                <div className="form-section">
                  <label>Tema específico (opcional)</label>
                  <input
                    type="text"
                    value={tema}
                    onChange={(e) => setTema(e.target.value)}
                    placeholder="Ej: Cómo trabajar con cristales de protección"
                  />
                </div>

                {/* Instrucciones */}
                <div className="form-section">
                  <label>Instrucciones adicionales (opcional)</label>
                  <textarea
                    value={instrucciones}
                    onChange={(e) => setInstrucciones(e.target.value)}
                    placeholder="Ej: Enfocate en el solsticio de invierno, mencioná el cuarzo ahumado..."
                    rows={3}
                  />
                </div>

                {/* Extensión */}
                <div className="form-section">
                  <label>Extensión aproximada: {palabras} palabras</label>
                  <input
                    type="range"
                    min="500"
                    max="3000"
                    step="100"
                    value={palabras}
                    onChange={(e) => setPalabras(parseInt(e.target.value))}
                  />
                </div>

                {/* Botón generar */}
                <button
                  className="btn-generar"
                  onClick={generarContenido}
                  disabled={generando || !guardianSeleccionado}
                >
                  {generando ? (
                    <>
                      <span className="spinner"></span>
                      Generando magia...
                    </>
                  ) : (
                    <>✨ Generar Contenido</>
                  )}
                </button>

                {error && <div className="error-msg">{error}</div>}
              </div>

              {/* Panel derecho: Preview */}
              <div className="panel-preview">
                <h2>Vista Previa</h2>

                {contenidoGenerado ? (
                  <div className="preview-contenido">
                    {/* Header con guardián */}
                    <div className="preview-header">
                      <img
                        src={contenidoGenerado.guardian?.imagen}
                        alt={contenidoGenerado.guardian?.nombre}
                        className="guardian-img"
                      />
                      <div className="guardian-info">
                        <span className="tipo">{contenidoGenerado.tipo_contenido?.nombre}</span>
                        <h3>{contenidoGenerado.guardian?.nombre}</h3>
                        <span className="categoria">{contenidoGenerado.guardian?.categoria}</span>
                      </div>
                    </div>

                    {/* Contenido */}
                    <div className="preview-body">
                      <h4 className="titulo">{contenidoGenerado.contenido?.titulo}</h4>
                      {contenidoGenerado.contenido?.subtitulo && (
                        <p className="subtitulo">{contenidoGenerado.contenido.subtitulo}</p>
                      )}
                      {contenidoGenerado.contenido?.intro && (
                        <p className="intro">{contenidoGenerado.contenido.intro}</p>
                      )}
                      <div className="cuerpo">
                        {contenidoGenerado.contenido?.cuerpo?.split('\n').map((p, i) => (
                          <p key={i}>{p}</p>
                        ))}
                      </div>
                      {contenidoGenerado.contenido?.cierre && (
                        <div className="cierre">
                          <p>{contenidoGenerado.contenido.cierre}</p>
                        </div>
                      )}
                      {contenidoGenerado.contenido?.cristal_del_dia && (
                        <div className="cristal">
                          <strong>Cristal del día:</strong> {contenidoGenerado.contenido.cristal_del_dia}
                        </div>
                      )}
                    </div>

                    {/* Acciones */}
                    <div className="preview-actions">
                      <button className="btn-publicar">Publicar Ahora</button>
                      <button className="btn-programar">Programar</button>
                      <button className="btn-editar">Editar</button>
                      <button className="btn-regenerar" onClick={generarContenido}>
                        Regenerar
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="preview-vacio">
                    <span className="icono">✨</span>
                    <p>El contenido generado aparecerá aquí</p>
                    <p className="hint">Seleccioná un guardián y hacé clic en "Generar Contenido"</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* VISTA: HISTORIAL */}
        {vistaActiva === 'historial' && (
          <div className="vista-historial">
            <h2>Historial de Contenido</h2>
            {historial.length === 0 ? (
              <p className="sin-historial">Aún no hay contenido generado</p>
            ) : (
              <div className="historial-lista">
                {historial.map((item, i) => (
                  <div key={i} className="historial-item">
                    <span className="fecha">{new Date(item.generado_en).toLocaleString()}</span>
                    <span className="guardian">{item.guardian_nombre}</span>
                    <span className="tipo">{item.tipo}</span>
                    <span className="estado">{item.estado}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* VISTA: PROGRAMAR */}
        {vistaActiva === 'programar' && (
          <div className="vista-programar">
            <h2>Programar Contenido</h2>
            <p className="placeholder">Sistema de programación en desarrollo...</p>
          </div>
        )}
      </main>

      <style jsx>{`
        .admin-circulo {
          min-height: 100vh;
          background: #0f0f0f;
          color: #ffffff;
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

        .header-left h1 {
          font-size: 24px;
          font-weight: 600;
          margin: 0;
          background: linear-gradient(135deg, #d4af37, #e8d5a3);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .header-left .subtitulo {
          font-size: 13px;
          color: #666;
        }

        .header-nav {
          display: flex;
          gap: 8px;
        }

        .header-nav button {
          background: transparent;
          border: 1px solid #333;
          color: #888;
          padding: 10px 20px;
          border-radius: 8px;
          cursor: pointer;
          font-size: 13px;
          transition: all 0.2s;
        }

        .header-nav button:hover {
          border-color: #555;
          color: #fff;
        }

        .header-nav button.active {
          background: #d4af37;
          border-color: #d4af37;
          color: #000;
        }

        /* Main */
        .admin-main {
          padding: 30px;
        }

        /* Vista Generar */
        .generar-grid {
          display: grid;
          grid-template-columns: 450px 1fr;
          gap: 30px;
        }

        .panel-config, .panel-preview {
          background: #1a1a1a;
          border-radius: 16px;
          padding: 25px;
        }

        .panel-config h2, .panel-preview h2 {
          font-size: 16px;
          font-weight: 600;
          margin: 0 0 25px 0;
          color: #d4af37;
        }

        /* Form sections */
        .form-section {
          margin-bottom: 25px;
        }

        .form-section label {
          display: block;
          font-size: 12px;
          font-weight: 500;
          color: #888;
          margin-bottom: 10px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .form-section input[type="text"],
        .form-section textarea {
          width: 100%;
          background: #252525;
          border: 1px solid #333;
          border-radius: 10px;
          padding: 14px 16px;
          font-size: 14px;
          color: #fff;
          transition: all 0.2s;
        }

        .form-section input:focus,
        .form-section textarea:focus {
          outline: none;
          border-color: #d4af37;
        }

        .form-section input[type="range"] {
          width: 100%;
          accent-color: #d4af37;
        }

        /* Guardian selector */
        .guardian-seleccionado {
          display: flex;
          align-items: center;
          gap: 15px;
          background: #252525;
          border: 1px solid #333;
          border-radius: 12px;
          padding: 15px;
          cursor: pointer;
        }

        .guardian-seleccionado img {
          width: 60px;
          height: 60px;
          object-fit: cover;
          border-radius: 50%;
        }

        .guardian-seleccionado .info {
          flex: 1;
        }

        .guardian-seleccionado .nombre {
          display: block;
          font-size: 16px;
          font-weight: 600;
        }

        .guardian-seleccionado .categoria {
          font-size: 13px;
          color: #888;
        }

        .btn-cambiar {
          background: #333;
          border: none;
          color: #888;
          padding: 8px 16px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 12px;
        }

        .guardian-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 10px;
        }

        .guardian-mini {
          background: #252525;
          border: 1px solid #333;
          border-radius: 10px;
          padding: 12px;
          text-align: center;
          cursor: pointer;
          transition: all 0.2s;
        }

        .guardian-mini:hover {
          border-color: #d4af37;
        }

        .guardian-mini img {
          width: 50px;
          height: 50px;
          object-fit: cover;
          border-radius: 50%;
          margin-bottom: 8px;
        }

        .guardian-mini span {
          display: block;
          font-size: 11px;
          color: #888;
        }

        .guardian-mini.ver-mas {
          display: flex;
          align-items: center;
          justify-content: center;
          color: #666;
          font-size: 12px;
        }

        /* Tipos grid */
        .tipos-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
        }

        .tipo-card {
          background: #252525;
          border: 1px solid #333;
          border-radius: 10px;
          padding: 15px 12px;
          text-align: center;
          cursor: pointer;
          transition: all 0.2s;
        }

        .tipo-card:hover {
          border-color: #555;
        }

        .tipo-card.active {
          border-color: #d4af37;
          background: rgba(212, 175, 55, 0.1);
        }

        .tipo-card .icon {
          display: block;
          font-size: 24px;
          margin-bottom: 8px;
        }

        .tipo-card .nombre {
          display: block;
          font-size: 13px;
          font-weight: 500;
          color: #fff;
        }

        .tipo-card .desc {
          display: block;
          font-size: 11px;
          color: #666;
          margin-top: 4px;
        }

        /* Botón generar */
        .btn-generar {
          width: 100%;
          background: linear-gradient(135deg, #d4af37, #b8972e);
          border: none;
          color: #000;
          font-size: 14px;
          font-weight: 600;
          padding: 16px 24px;
          border-radius: 10px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          transition: all 0.2s;
        }

        .btn-generar:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(212, 175, 55, 0.3);
        }

        .btn-generar:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .spinner {
          width: 18px;
          height: 18px;
          border: 2px solid transparent;
          border-top-color: #000;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .error-msg {
          background: rgba(255, 80, 80, 0.1);
          border: 1px solid rgba(255, 80, 80, 0.3);
          color: #ff8080;
          padding: 12px 16px;
          border-radius: 8px;
          margin-top: 15px;
          font-size: 13px;
        }

        /* Panel Preview */
        .preview-vacio {
          text-align: center;
          padding: 80px 40px;
          color: #555;
        }

        .preview-vacio .icono {
          font-size: 60px;
          display: block;
          margin-bottom: 20px;
        }

        .preview-vacio p {
          margin: 0;
        }

        .preview-vacio .hint {
          font-size: 13px;
          color: #444;
          margin-top: 10px;
        }

        .preview-contenido {
          animation: fadeIn 0.5s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .preview-header {
          display: flex;
          align-items: center;
          gap: 20px;
          padding-bottom: 20px;
          border-bottom: 1px solid #2a2a2a;
          margin-bottom: 25px;
        }

        .preview-header .guardian-img {
          width: 80px;
          height: 80px;
          object-fit: cover;
          border-radius: 50%;
          border: 2px solid #d4af37;
        }

        .preview-header .tipo {
          display: inline-block;
          background: rgba(212, 175, 55, 0.2);
          color: #d4af37;
          font-size: 11px;
          padding: 4px 12px;
          border-radius: 20px;
          margin-bottom: 5px;
        }

        .preview-header h3 {
          font-size: 24px;
          margin: 0;
        }

        .preview-header .categoria {
          font-size: 13px;
          color: #666;
        }

        .preview-body {
          max-height: 500px;
          overflow-y: auto;
          padding-right: 10px;
        }

        .preview-body .titulo {
          font-size: 22px;
          margin: 0 0 10px 0;
          color: #d4af37;
        }

        .preview-body .subtitulo {
          font-size: 16px;
          font-style: italic;
          color: #888;
          margin-bottom: 20px;
        }

        .preview-body .intro {
          font-size: 15px;
          color: #ccc;
          line-height: 1.7;
          padding-bottom: 15px;
          border-bottom: 1px solid #2a2a2a;
          margin-bottom: 15px;
        }

        .preview-body .cuerpo p {
          font-size: 15px;
          color: #aaa;
          line-height: 1.8;
          margin-bottom: 15px;
        }

        .preview-body .cierre {
          background: rgba(212, 175, 55, 0.05);
          border-left: 3px solid #d4af37;
          padding: 15px 20px;
          margin-top: 20px;
          border-radius: 0 8px 8px 0;
        }

        .preview-body .cierre p {
          margin: 0;
          font-style: italic;
          color: #ccc;
        }

        .preview-body .cristal {
          background: #252525;
          padding: 15px;
          border-radius: 8px;
          margin-top: 20px;
          font-size: 14px;
          color: #888;
        }

        .preview-body .cristal strong {
          color: #d4af37;
        }

        .preview-actions {
          display: flex;
          gap: 10px;
          margin-top: 25px;
          padding-top: 20px;
          border-top: 1px solid #2a2a2a;
        }

        .preview-actions button {
          flex: 1;
          padding: 12px 20px;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-publicar {
          background: #d4af37;
          border: none;
          color: #000;
        }

        .btn-programar {
          background: transparent;
          border: 1px solid #d4af37;
          color: #d4af37;
        }

        .btn-editar, .btn-regenerar {
          background: #333;
          border: none;
          color: #888;
        }

        /* Responsive */
        @media (max-width: 1200px) {
          .generar-grid {
            grid-template-columns: 1fr;
          }

          .panel-config {
            order: 1;
          }

          .panel-preview {
            order: 2;
          }
        }

        @media (max-width: 600px) {
          .tipos-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .guardian-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }
      `}</style>
    </div>
  );
}
