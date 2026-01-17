'use client';
import { useState, useEffect } from 'react';

// ═══════════════════════════════════════════════════════════════════════════════
// ADMIN: GENERADOR DE CONTENIDO DEL CÍRCULO
// Integrado con Duende de la Semana, fases lunares y estaciones celtas
// ═══════════════════════════════════════════════════════════════════════════════

const TIPOS_CONTENIDO = [
  { id: 'meditacion', nombre: 'Meditación Guiada', desc: 'Viaje interior 5-10 min', icon: '🧘' },
  { id: 'articulo', nombre: 'Mensaje del Día', desc: 'Reflexión + consejo', icon: '🌅' },
  { id: 'ritual', nombre: 'Ritual Sencillo', desc: 'Práctica paso a paso', icon: '🕯️' },
  { id: 'historia', nombre: 'Historia', desc: 'Cuento con enseñanza', icon: '📜' },
  { id: 'guia', nombre: 'DIY Mágico', desc: 'Proyecto artesanal', icon: '✂️' },
  { id: 'ensenanza', nombre: 'Conocimiento', desc: 'Cristales, hierbas, runas', icon: '💎' },
  { id: 'reflexion', nombre: 'Desafío Semanal', desc: 'Reto de 7 días', icon: '🎯' }
];

const CATEGORIAS = [
  { id: 'general', nombre: 'General' },
  { id: 'luna', nombre: 'Luna' },
  { id: 'cristales', nombre: 'Cristales' },
  { id: 'rituales', nombre: 'Rituales' },
  { id: 'proteccion', nombre: 'Protección' },
  { id: 'abundancia', nombre: 'Abundancia' },
  { id: 'sanacion', nombre: 'Sanación' },
  { id: 'ancestros', nombre: 'Ancestros' },
  { id: 'elementos', nombre: 'Elementos' }
];

export default function GeneradorContenido() {
  // Estados principales
  const [duendeSemana, setDuendeSemana] = useState(null);
  const [infoHoy, setInfoHoy] = useState(null);
  const [historial, setHistorial] = useState([]);

  // Configuración del contenido
  const [tipo, setTipo] = useState('articulo');
  const [categoria, setCategoria] = useState('general');
  const [tema, setTema] = useState('');
  const [palabras, setPalabras] = useState(1500);
  const [usarDuende, setUsarDuende] = useState(true);
  const [integrarLuna, setIntegrarLuna] = useState(true);
  const [integrarEstacion, setIntegrarEstacion] = useState(true);

  // Estados de UI
  const [generando, setGenerando] = useState(false);
  const [contenidoGenerado, setContenidoGenerado] = useState(null);
  const [error, setError] = useState(null);
  const [vistaActiva, setVistaActiva] = useState('generar');

  useEffect(() => {
    cargarDatos();
  }, []);

  async function cargarDatos() {
    try {
      // Cargar duende de la semana
      const resDuende = await fetch('/api/admin/duende-semana');
      const dataDuende = await resDuende.json();
      if (dataDuende.success && dataDuende.duendeActual) {
        setDuendeSemana(dataDuende.duendeActual);
      }

      // Cargar historial
      const resHistorial = await fetch('/api/admin/contenido/historial');
      const dataHistorial = await resHistorial.json();
      if (dataHistorial.success) {
        setHistorial(dataHistorial.contenidos || []);
      }

      // Cargar info del día
      const resInfo = await fetch('/api/circulo/info-dia');
      const dataInfo = await resInfo.json();
      if (dataInfo.success) {
        setInfoHoy(dataInfo);
      }
    } catch (err) {
      console.error('Error cargando datos:', err);
    }
  }

  async function generarContenido() {
    if (!tema.trim()) {
      setError('Escribí un tema para el contenido');
      return;
    }

    setGenerando(true);
    setError(null);
    setContenidoGenerado(null);

    try {
      const res = await fetch('/api/admin/contenido/generar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tema,
          palabras,
          categoria,
          tipo,
          usarDuendeSemana: usarDuende && duendeSemana,
          integrarLuna,
          integrarEstacion
        })
      });

      const data = await res.json();

      if (data.success) {
        setContenidoGenerado(data);
        cargarDatos(); // Actualizar historial
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

  return (
    <div className="admin-contenido">
      {/* Header */}
      <header className="admin-header">
        <div className="header-left">
          <a href="/admin" className="back-link">← Admin</a>
          <h1>Generador de Contenido</h1>
        </div>
        <nav className="header-nav">
          <button className={vistaActiva === 'generar' ? 'active' : ''} onClick={() => setVistaActiva('generar')}>
            Generar
          </button>
          <button className={vistaActiva === 'historial' ? 'active' : ''} onClick={() => setVistaActiva('historial')}>
            Historial
          </button>
        </nav>
        <div className="header-actions">
          <a href="/admin/circulo/duende-semana" className="btn-link">Duende de la Semana</a>
          <a href="/admin/circulo/calendario" className="btn-link">Calendario</a>
        </div>
      </header>

      {/* Info Bar */}
      <div className="info-bar">
        {duendeSemana && (
          <div className="info-item duende-info">
            <img src={duendeSemana.imagen} alt={duendeSemana.nombre} />
            <span>Duende activo: <strong>{duendeSemana.nombre}</strong></span>
            {!duendeSemana.personalidadGenerada && (
              <span className="warning">Sin personalidad generada</span>
            )}
          </div>
        )}
        {infoHoy?.faseLunar && (
          <div className="info-item">
            <span className="luna-icon">{infoHoy.faseLunar.datos?.icono}</span>
            <span>{infoHoy.faseLunar.datos?.nombre}</span>
          </div>
        )}
        {infoHoy?.celebracionProxima?.esCercana && (
          <div className="info-item celebracion">
            <span>☀</span>
            <span>{infoHoy.celebracionProxima.datos?.nombre} en {infoHoy.celebracionProxima.diasRestantes} días</span>
          </div>
        )}
      </div>

      <main className="admin-main">
        {vistaActiva === 'generar' && (
          <div className="generar-grid">
            {/* Panel de Configuración */}
            <div className="panel-config">
              <h2>Configuración</h2>

              {/* Tipo de contenido */}
              <div className="form-section">
                <label>Tipo de Contenido</label>
                <div className="tipos-grid">
                  {TIPOS_CONTENIDO.map(t => (
                    <div
                      key={t.id}
                      className={`tipo-card ${tipo === t.id ? 'active' : ''}`}
                      onClick={() => setTipo(t.id)}
                    >
                      <span className="icon">{t.icon}</span>
                      <span className="nombre">{t.nombre}</span>
                      <span className="desc">{t.desc}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Categoría */}
              <div className="form-section">
                <label>Categoría</label>
                <select value={categoria} onChange={e => setCategoria(e.target.value)}>
                  {CATEGORIAS.map(c => (
                    <option key={c.id} value={c.id}>{c.nombre}</option>
                  ))}
                </select>
              </div>

              {/* Tema */}
              <div className="form-section">
                <label>Tema / Enfoque</label>
                <input
                  type="text"
                  value={tema}
                  onChange={e => setTema(e.target.value)}
                  placeholder="Ej: Cómo trabajar con cristales de protección"
                />
              </div>

              {/* Extensión */}
              <div className="form-section">
                <label>Extensión: ~{palabras} palabras</label>
                <input
                  type="range"
                  min="500"
                  max="3000"
                  step="100"
                  value={palabras}
                  onChange={e => setPalabras(parseInt(e.target.value))}
                />
              </div>

              {/* Integraciones */}
              <div className="form-section integraciones">
                <label>Integraciones</label>

                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={usarDuende}
                    onChange={e => setUsarDuende(e.target.checked)}
                    disabled={!duendeSemana}
                  />
                  <span>Usar voz de {duendeSemana?.nombre || 'Duende de la Semana'}</span>
                </label>

                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={integrarLuna}
                    onChange={e => setIntegrarLuna(e.target.checked)}
                  />
                  <span>Integrar fase lunar ({infoHoy?.faseLunar?.datos?.nombre || 'cargando...'})</span>
                </label>

                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={integrarEstacion}
                    onChange={e => setIntegrarEstacion(e.target.checked)}
                  />
                  <span>
                    Mencionar celebración celta
                    {infoHoy?.celebracionProxima?.datos?.nombre && ` (${infoHoy.celebracionProxima.datos.nombre})`}
                  </span>
                </label>
              </div>

              {/* Botón Generar */}
              <button
                className="btn-generar"
                onClick={generarContenido}
                disabled={generando || !tema.trim()}
              >
                {generando ? (
                  <>
                    <span className="spinner"></span>
                    Generando magia...
                  </>
                ) : (
                  '✨ Generar Contenido'
                )}
              </button>

              {error && <div className="error-msg">{error}</div>}
            </div>

            {/* Panel de Preview */}
            <div className="panel-preview">
              <h2>Vista Previa</h2>

              {contenidoGenerado ? (
                <div className="preview-contenido">
                  {/* Header */}
                  <div className="preview-header">
                    {contenidoGenerado.duendeSemana && (
                      <img
                        src={contenidoGenerado.duendeSemana.imagen}
                        alt={contenidoGenerado.duendeSemana.nombre}
                        className="duende-img"
                      />
                    )}
                    <div className="preview-meta">
                      <span className="tipo-badge">
                        {TIPOS_CONTENIDO.find(t => t.id === contenidoGenerado.tipo)?.icon}
                        {TIPOS_CONTENIDO.find(t => t.id === contenidoGenerado.tipo)?.nombre}
                      </span>
                      {contenidoGenerado.duendeSemana && (
                        <span className="autor">por {contenidoGenerado.duendeSemana.nombre}</span>
                      )}
                    </div>
                  </div>

                  {/* Contenido */}
                  <div className="preview-body">
                    <h3 className="titulo">{contenidoGenerado.titulo}</h3>
                    <div
                      className="contenido-html"
                      dangerouslySetInnerHTML={{
                        __html: formatearContenido(contenidoGenerado.contenido)
                      }}
                    />
                  </div>

                  {/* Stats */}
                  <div className="preview-stats">
                    <span>{contenidoGenerado.palabras} palabras</span>
                    {contenidoGenerado.infoContextual?.faseLunar && (
                      <span>{contenidoGenerado.infoContextual.faseLunar.datos?.icono} {contenidoGenerado.infoContextual.faseLunar.datos?.nombre}</span>
                    )}
                  </div>

                  {/* Acciones */}
                  <div className="preview-actions">
                    <button className="btn-publicar">Publicar Ahora</button>
                    <button className="btn-programar">Programar</button>
                    <button className="btn-copiar" onClick={() => copiarContenido(contenidoGenerado.contenido)}>
                      Copiar
                    </button>
                    <button className="btn-regenerar" onClick={generarContenido}>
                      Regenerar
                    </button>
                  </div>
                </div>
              ) : (
                <div className="preview-vacio">
                  <span className="icono">✨</span>
                  <p>El contenido generado aparecerá aquí</p>
                  <p className="hint">Escribí un tema y hacé clic en "Generar Contenido"</p>
                </div>
              )}
            </div>
          </div>
        )}

        {vistaActiva === 'historial' && (
          <div className="vista-historial">
            <h2>Historial de Contenido Generado</h2>
            {historial.length === 0 ? (
              <p className="sin-historial">Aún no hay contenido generado</p>
            ) : (
              <div className="historial-lista">
                {historial.map((item, i) => (
                  <div key={i} className="historial-item">
                    <div className="historial-left">
                      {item.duende?.imagen && (
                        <img src={item.duende.imagen} alt={item.duende.nombre} />
                      )}
                      <div className="historial-info">
                        <span className="titulo">{item.titulo || item.tema}</span>
                        <span className="meta">
                          {TIPOS_CONTENIDO.find(t => t.id === item.tipo)?.nombre || item.tipo}
                          {item.duende?.nombre && ` • ${item.duende.nombre}`}
                        </span>
                      </div>
                    </div>
                    <div className="historial-right">
                      <span className="fecha">{new Date(item.generadoEn).toLocaleDateString()}</span>
                      <span className={`estado ${item.estado}`}>{item.estado}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      <style jsx>{`
        .admin-contenido {
          min-height: 100vh;
          background: #0f0f0f;
          color: #fff;
          font-family: 'Inter', -apple-system, sans-serif;
        }

        /* Header */
        .admin-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px 30px;
          background: #1a1a1a;
          border-bottom: 1px solid #2a2a2a;
          gap: 30px;
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

        .back-link:hover { color: #d4af37; }

        .admin-header h1 {
          font-size: 24px;
          font-weight: 600;
          margin: 0;
          background: linear-gradient(135deg, #d4af37, #e8d5a3);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
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

        .header-nav button:hover { border-color: #555; color: #fff; }
        .header-nav button.active { background: #d4af37; border-color: #d4af37; color: #000; }

        .header-actions { display: flex; gap: 10px; }

        .btn-link {
          color: #888;
          text-decoration: none;
          font-size: 13px;
          padding: 8px 16px;
          border: 1px solid #333;
          border-radius: 6px;
          transition: all 0.2s;
        }

        .btn-link:hover { border-color: #d4af37; color: #d4af37; }

        /* Info Bar */
        .info-bar {
          display: flex;
          gap: 20px;
          padding: 15px 30px;
          background: #151515;
          border-bottom: 1px solid #252525;
        }

        .info-item {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 13px;
          color: #888;
        }

        .info-item img {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          object-fit: cover;
        }

        .info-item strong { color: #d4af37; }

        .info-item .warning {
          background: rgba(231, 76, 60, 0.2);
          color: #e74c3c;
          padding: 2px 8px;
          border-radius: 4px;
          font-size: 11px;
        }

        .luna-icon { font-size: 18px; }

        .celebracion { color: #c9a227; }

        /* Main */
        .admin-main { padding: 30px; }

        .generar-grid {
          display: grid;
          grid-template-columns: 450px 1fr;
          gap: 30px;
        }

        /* Panel Config */
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

        .form-section {
          margin-bottom: 25px;
        }

        .form-section > label {
          display: block;
          font-size: 12px;
          font-weight: 500;
          color: #888;
          margin-bottom: 10px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .form-section input[type="text"],
        .form-section select {
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
        .form-section select:focus {
          outline: none;
          border-color: #d4af37;
        }

        .form-section input[type="range"] {
          width: 100%;
          accent-color: #d4af37;
        }

        /* Tipos Grid */
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

        .tipo-card:hover { border-color: #555; }

        .tipo-card.active {
          border-color: #d4af37;
          background: rgba(212, 175, 55, 0.1);
        }

        .tipo-card .icon { display: block; font-size: 24px; margin-bottom: 8px; }
        .tipo-card .nombre { display: block; font-size: 13px; font-weight: 500; color: #fff; }
        .tipo-card .desc { display: block; font-size: 11px; color: #666; margin-top: 4px; }

        /* Integraciones */
        .integraciones { display: flex; flex-direction: column; gap: 12px; }

        .checkbox-label {
          display: flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
          font-size: 13px;
          color: #aaa;
        }

        .checkbox-label input[type="checkbox"] {
          width: 18px;
          height: 18px;
          accent-color: #d4af37;
        }

        /* Botón Generar */
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

        .btn-generar:disabled { opacity: 0.5; cursor: not-allowed; }

        .spinner {
          width: 18px;
          height: 18px;
          border: 2px solid transparent;
          border-top-color: #000;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin { to { transform: rotate(360deg); } }

        .error-msg {
          background: rgba(255, 80, 80, 0.1);
          border: 1px solid rgba(255, 80, 80, 0.3);
          color: #ff8080;
          padding: 12px 16px;
          border-radius: 8px;
          margin-top: 15px;
          font-size: 13px;
        }

        /* Preview */
        .preview-vacio {
          text-align: center;
          padding: 80px 40px;
          color: #555;
        }

        .preview-vacio .icono { font-size: 60px; display: block; margin-bottom: 20px; }
        .preview-vacio p { margin: 0; }
        .preview-vacio .hint { font-size: 13px; color: #444; margin-top: 10px; }

        .preview-contenido { animation: fadeIn 0.5s ease; }

        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

        .preview-header {
          display: flex;
          align-items: center;
          gap: 15px;
          padding-bottom: 20px;
          border-bottom: 1px solid #2a2a2a;
          margin-bottom: 25px;
        }

        .preview-header .duende-img {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid #d4af37;
        }

        .preview-meta { display: flex; flex-direction: column; gap: 5px; }

        .tipo-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(212, 175, 55, 0.2);
          color: #d4af37;
          font-size: 12px;
          padding: 4px 12px;
          border-radius: 20px;
        }

        .autor { font-size: 13px; color: #888; }

        .preview-body {
          max-height: 500px;
          overflow-y: auto;
          padding-right: 10px;
        }

        .preview-body .titulo {
          font-size: 22px;
          margin: 0 0 20px 0;
          color: #d4af37;
        }

        .contenido-html {
          font-size: 15px;
          color: #bbb;
          line-height: 1.8;
        }

        .contenido-html h1, .contenido-html h2 {
          color: #d4af37;
          margin: 25px 0 15px 0;
        }

        .contenido-html p { margin-bottom: 15px; }

        .preview-stats {
          display: flex;
          gap: 20px;
          padding: 15px 0;
          border-top: 1px solid #2a2a2a;
          margin-top: 20px;
          font-size: 13px;
          color: #666;
        }

        .preview-actions {
          display: flex;
          gap: 10px;
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

        .btn-publicar { background: #d4af37; border: none; color: #000; }
        .btn-programar { background: transparent; border: 1px solid #d4af37; color: #d4af37; }
        .btn-copiar, .btn-regenerar { background: #333; border: none; color: #888; }

        /* Historial */
        .vista-historial h2 {
          font-size: 18px;
          color: #d4af37;
          margin-bottom: 25px;
        }

        .historial-lista { display: flex; flex-direction: column; gap: 10px; }

        .historial-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: #1a1a1a;
          border-radius: 12px;
          padding: 15px 20px;
        }

        .historial-left { display: flex; align-items: center; gap: 15px; }

        .historial-left img {
          width: 45px;
          height: 45px;
          border-radius: 50%;
          object-fit: cover;
        }

        .historial-info .titulo {
          display: block;
          font-weight: 500;
          color: #fff;
          font-size: 14px;
        }

        .historial-info .meta {
          font-size: 12px;
          color: #666;
        }

        .historial-right { display: flex; align-items: center; gap: 15px; }

        .historial-right .fecha { font-size: 12px; color: #666; }

        .historial-right .estado {
          font-size: 11px;
          padding: 4px 10px;
          border-radius: 20px;
          text-transform: uppercase;
        }

        .estado.borrador { background: #333; color: #888; }
        .estado.publicado { background: rgba(46, 204, 113, 0.2); color: #2ecc71; }

        .sin-historial { color: #666; font-style: italic; }

        /* Responsive */
        @media (max-width: 1200px) {
          .generar-grid { grid-template-columns: 1fr; }
        }

        @media (max-width: 768px) {
          .admin-header { flex-direction: column; gap: 15px; }
          .tipos-grid { grid-template-columns: repeat(2, 1fr); }
          .info-bar { flex-wrap: wrap; }
        }
      `}</style>
    </div>
  );
}

// Función para formatear el contenido markdown a HTML
function formatearContenido(texto) {
  if (!texto) return '';

  return texto
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/^/, '<p>')
    .replace(/$/, '</p>');
}

// Función para copiar contenido
function copiarContenido(texto) {
  navigator.clipboard.writeText(texto);
  alert('Contenido copiado al portapapeles');
}
