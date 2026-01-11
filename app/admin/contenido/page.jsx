'use client';
import { useState, useEffect } from 'react';

// ═══════════════════════════════════════════════════════════════
// CONSTANTES
// ═══════════════════════════════════════════════════════════════

const CATEGORIAS = [
  { id: 'cosmos', nombre: 'Cosmos y Luna', icono: '🌙', temas: ['Fases lunares', 'Eclipses', 'Astrologia', 'Rituales lunares', 'Planetas y energia'] },
  { id: 'duendes', nombre: 'Mundo Duende', icono: '🧙', temas: ['Historia de los duendes', 'Tipos de guardianes', 'Comunicacion elemental', 'Rituales de conexion'] },
  { id: 'diy', nombre: 'DIY Magico', icono: '✂️', temas: ['Velas rituales', 'Altares caseros', 'Amuletos', 'Decoracion magica', 'Herramientas rituales'] },
  { id: 'esoterico', nombre: 'Esoterico', icono: '🔮', temas: ['Tarot', 'Runas', 'Cristales', 'Numerologia', 'Simbolos sagrados'] },
  { id: 'sanacion', nombre: 'Sanacion', icono: '💚', temas: ['Chakras', 'Limpieza energetica', 'Meditacion', 'Hierbas', 'Cristaloterapia'] },
  { id: 'celebraciones', nombre: 'Celebraciones', icono: '🎉', temas: ['Sabbats', 'Lunas especiales', 'Solsticios', 'Equinoccios', 'Festividades paganas'] }
];

const TIPOS = [
  { id: 'articulo', nombre: 'Articulo', desc: 'Texto educativo o informativo extenso' },
  { id: 'guia', nombre: 'Guia Practica', desc: 'Paso a paso detallado' },
  { id: 'ritual', nombre: 'Ritual', desc: 'Ritual completo con instrucciones' },
  { id: 'meditacion', nombre: 'Meditacion', desc: 'Guia de meditacion escrita' },
  { id: 'diy', nombre: 'DIY/Tutorial', desc: 'Proyecto para hacer en casa' },
  { id: 'lectura', nombre: 'Lectura Colectiva', desc: 'Mensaje para todos los miembros' }
];

const LONGITUDES = [
  { id: 1500, nombre: 'Corto', desc: '~1500 palabras' },
  { id: 3000, nombre: 'Medio', desc: '~3000 palabras' },
  { id: 5000, nombre: 'Largo', desc: '~5000 palabras' }
];

// ═══════════════════════════════════════════════════════════════
// CONTENIDO PAGE
// ═══════════════════════════════════════════════════════════════

export default function ContenidoPage() {
  // Estado del formulario
  const [categoria, setCategoria] = useState(null);
  const [tipo, setTipo] = useState(null);
  const [tema, setTema] = useState('');
  const [temaCustom, setTemaCustom] = useState('');
  const [longitud, setLongitud] = useState(3000);
  const [generando, setGenerando] = useState(false);
  const [contenido, setContenido] = useState('');
  const [titulo, setTitulo] = useState('');
  const [error, setError] = useState('');
  const [copiado, setCopiado] = useState(false);

  // Estado de imagen
  const [generandoImagen, setGenerandoImagen] = useState(false);
  const [imagenUrl, setImagenUrl] = useState('');
  const [promptImagen, setPromptImagen] = useState('');

  // Estado de publicación
  const [publicando, setPublicando] = useState(false);
  const [publicado, setPublicado] = useState(false);

  // Historial
  const [tab, setTab] = useState('generar'); // 'generar' | 'historial'
  const [historial, setHistorial] = useState([]);
  const [cargandoHistorial, setCargandoHistorial] = useState(false);
  const [contenidoSeleccionado, setContenidoSeleccionado] = useState(null);

  const temaFinal = temaCustom || tema;

  // Cargar historial al montar
  useEffect(() => {
    if (tab === 'historial') {
      cargarHistorial();
    }
  }, [tab]);

  const cargarHistorial = async () => {
    setCargandoHistorial(true);
    try {
      const res = await fetch('/api/admin/contenido/historial');
      const data = await res.json();
      if (data.success) {
        setHistorial(data.contenidos || []);
      }
    } catch (e) {
      console.error('Error cargando historial:', e);
    }
    setCargandoHistorial(false);
  };

  const generar = async () => {
    if (!categoria || !tipo || !temaFinal) {
      setError('Completa todos los campos');
      return;
    }

    setGenerando(true);
    setError('');
    setContenido('');
    setTitulo('');
    setImagenUrl('');
    setPublicado(false);

    try {
      const res = await fetch('/api/admin/contenido/generar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          categoria: categoria.id,
          tipo: tipo.id,
          tema: temaFinal,
          longitud
        })
      });

      const data = await res.json();
      if (data.success) {
        setContenido(data.contenido);
        setTitulo(data.titulo || temaFinal);
        // Auto-generar prompt para imagen basado en el tema
        setPromptImagen(`Mystical ${categoria.nombre.toLowerCase()} themed illustration, ${temaFinal}, magical atmosphere, ethereal, fantasy art, soft golden lighting, no text`);
      } else {
        setError(data.error || 'Error al generar contenido');
      }
    } catch (e) {
      setError('Error de conexion');
    }
    setGenerando(false);
  };

  const generarImagen = async () => {
    if (!promptImagen) {
      setError('Escribe una descripcion para la imagen');
      return;
    }

    setGenerandoImagen(true);
    setError('');

    try {
      const res = await fetch('/api/admin/imagen/generar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: promptImagen })
      });

      const data = await res.json();
      if (data.success) {
        setImagenUrl(data.url);
      } else {
        setError(data.error || 'Error al generar imagen');
      }
    } catch (e) {
      setError('Error de conexion al generar imagen');
    }
    setGenerandoImagen(false);
  };

  const publicarEnCirculo = async () => {
    if (!contenido || !titulo) {
      setError('Genera contenido primero');
      return;
    }

    setPublicando(true);
    setError('');

    try {
      const res = await fetch('/api/circulo/contenido', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          titulo,
          contenido,
          categoria: categoria?.id || 'general',
          tipo: tipo?.id || 'articulo',
          imagen: imagenUrl || null,
          autor: 'Duendes del Uruguay'
        })
      });

      const data = await res.json();
      if (data.success) {
        setPublicado(true);
        // Guardar en historial
        guardarEnHistorial();
      } else {
        setError(data.error || 'Error al publicar');
      }
    } catch (e) {
      setError('Error de conexion al publicar');
    }
    setPublicando(false);
  };

  const guardarEnHistorial = async () => {
    try {
      await fetch('/api/admin/contenido/historial', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          titulo,
          contenido,
          categoria: categoria?.id,
          tipo: tipo?.id,
          imagen: imagenUrl,
          palabras: contenido.split(/\s+/).length,
          publicado: true
        })
      });
    } catch (e) {
      console.error('Error guardando en historial:', e);
    }
  };

  const copiar = () => {
    navigator.clipboard.writeText(contenido);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  };

  const limpiar = () => {
    setCategoria(null);
    setTipo(null);
    setTema('');
    setTemaCustom('');
    setContenido('');
    setTitulo('');
    setError('');
    setImagenUrl('');
    setPromptImagen('');
    setPublicado(false);
  };

  const verContenido = (item) => {
    setContenidoSeleccionado(item);
    setContenido(item.contenido);
    setTitulo(item.titulo);
    setImagenUrl(item.imagen || '');
    setCategoria(CATEGORIAS.find(c => c.id === item.categoria) || null);
    setTipo(TIPOS.find(t => t.id === item.tipo) || null);
    setTab('generar');
  };

  return (
    <div style={estilos.container}>
      {/* Header con tabs */}
      <div style={estilos.header}>
        <div>
          <h1 style={estilos.titulo}>📝 Contenido</h1>
          <p style={estilos.subtitulo}>Genera y publica contenido para el Circulo</p>
        </div>
        <div style={estilos.tabs}>
          <button
            onClick={() => setTab('generar')}
            style={{ ...estilos.tab, ...(tab === 'generar' ? estilos.tabActivo : {}) }}
          >
            ✨ Generar
          </button>
          <button
            onClick={() => setTab('historial')}
            style={{ ...estilos.tab, ...(tab === 'historial' ? estilos.tabActivo : {}) }}
          >
            📚 Historial
          </button>
        </div>
      </div>

      {/* TAB HISTORIAL */}
      {tab === 'historial' && (
        <div style={estilos.historialContainer}>
          {cargandoHistorial ? (
            <div style={estilos.cargando}>Cargando historial...</div>
          ) : historial.length === 0 ? (
            <div style={estilos.sinHistorial}>
              <span style={{ fontSize: '48px' }}>📝</span>
              <p>Aun no has generado contenido</p>
              <button onClick={() => setTab('generar')} style={estilos.btnPrimario}>
                Generar primer contenido
              </button>
            </div>
          ) : (
            <div style={estilos.historialGrid}>
              {historial.map((item, i) => (
                <div key={item.id || i} style={estilos.historialItem} onClick={() => verContenido(item)}>
                  {item.imagen && (
                    <div style={estilos.historialImagen}>
                      <img src={item.imagen} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  )}
                  <div style={estilos.historialInfo}>
                    <span style={estilos.historialCategoria}>
                      {CATEGORIAS.find(c => c.id === item.categoria)?.icono} {item.categoria}
                    </span>
                    <h4 style={estilos.historialTitulo}>{item.titulo}</h4>
                    <p style={estilos.historialMeta}>
                      {item.palabras} palabras • {item.publicado ? '✅ Publicado' : '📝 Borrador'}
                    </p>
                    <small style={estilos.historialFecha}>
                      {new Date(item.fecha).toLocaleDateString('es-UY')}
                    </small>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB GENERAR */}
      {tab === 'generar' && (
        <>
          {contenido ? (
            // Vista de resultado
            <div style={estilos.resultado}>
              <div style={estilos.resultadoHeader}>
                <input
                  type="text"
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                  placeholder="Titulo del contenido..."
                  style={estilos.inputTitulo}
                />
                <div style={estilos.resultadoAcciones}>
                  <button onClick={copiar} style={estilos.accionBtn}>
                    {copiado ? '✓ Copiado' : '📋 Copiar'}
                  </button>
                  <button onClick={limpiar} style={estilos.accionBtnSecundario}>
                    ✨ Nuevo
                  </button>
                </div>
              </div>

              {/* Seccion de imagen */}
              <div style={estilos.imagenSeccion}>
                <h4 style={estilos.imagenTitulo}>🎨 Imagen (OpenAI DALL-E)</h4>
                {imagenUrl ? (
                  <div style={estilos.imagenPreview}>
                    <img src={imagenUrl} alt="Generada" style={estilos.imagenImg} />
                    <button onClick={() => setImagenUrl('')} style={estilos.cambiarImagen}>
                      Generar otra
                    </button>
                  </div>
                ) : (
                  <div style={estilos.imagenForm}>
                    <textarea
                      value={promptImagen}
                      onChange={(e) => setPromptImagen(e.target.value)}
                      placeholder="Describe la imagen que queres generar..."
                      style={estilos.promptInput}
                      rows={2}
                    />
                    <button
                      onClick={generarImagen}
                      disabled={generandoImagen}
                      style={{
                        ...estilos.generarImagenBtn,
                        ...(generandoImagen ? estilos.btnDisabled : {})
                      }}
                    >
                      {generandoImagen ? '⏳ Generando...' : '🎨 Generar imagen'}
                    </button>
                  </div>
                )}
              </div>

              <div style={estilos.contenidoPreview}>
                <pre style={estilos.contenidoTexto}>{contenido}</pre>
              </div>

              <div style={estilos.contenidoFooter}>
                <div style={estilos.contenidoInfo}>
                  <span>~{contenido.split(/\s+/).length} palabras</span>
                  <span>•</span>
                  <span>{categoria?.nombre}</span>
                  <span>•</span>
                  <span>{tipo?.nombre}</span>
                </div>

                {/* Boton publicar */}
                {publicado ? (
                  <div style={estilos.publicadoMsg}>
                    ✅ Publicado en el Circulo
                  </div>
                ) : (
                  <button
                    onClick={publicarEnCirculo}
                    disabled={publicando}
                    style={{
                      ...estilos.publicarBtn,
                      ...(publicando ? estilos.btnDisabled : {})
                    }}
                  >
                    {publicando ? '⏳ Publicando...' : '🚀 Publicar en el Circulo'}
                  </button>
                )}
              </div>

              {error && <div style={estilos.error}>{error}</div>}
            </div>
          ) : (
            // Formulario de generacion
            <div style={estilos.formulario}>
              {/* Paso 1: Categoria */}
              <div style={estilos.paso}>
                <h3 style={estilos.pasoTitulo}>1. Categoria</h3>
                <div style={estilos.categoriaGrid}>
                  {CATEGORIAS.map(cat => (
                    <div
                      key={cat.id}
                      onClick={() => { setCategoria(cat); setTema(''); }}
                      style={{
                        ...estilos.categoriaCard,
                        ...(categoria?.id === cat.id ? estilos.categoriaCardActiva : {})
                      }}
                    >
                      <span style={estilos.categoriaIcono}>{cat.icono}</span>
                      <span style={estilos.categoriaNombre}>{cat.nombre}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Paso 2: Tipo */}
              <div style={estilos.paso}>
                <h3 style={estilos.pasoTitulo}>2. Tipo de contenido</h3>
                <div style={estilos.tipoGrid}>
                  {TIPOS.map(t => (
                    <div
                      key={t.id}
                      onClick={() => setTipo(t)}
                      style={{
                        ...estilos.tipoCard,
                        ...(tipo?.id === t.id ? estilos.tipoCardActivo : {})
                      }}
                    >
                      <span style={estilos.tipoNombre}>{t.nombre}</span>
                      <span style={estilos.tipoDesc}>{t.desc}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Paso 3: Tema */}
              <div style={estilos.paso}>
                <h3 style={estilos.pasoTitulo}>3. Tema</h3>
                {categoria && (
                  <div style={estilos.temasSugeridos}>
                    <span style={estilos.temasLabel}>Sugerencias:</span>
                    {categoria.temas.map(t => (
                      <button
                        key={t}
                        onClick={() => { setTema(t); setTemaCustom(''); }}
                        style={{
                          ...estilos.temaBtn,
                          ...(tema === t ? estilos.temaBtnActivo : {})
                        }}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                )}
                <input
                  type="text"
                  placeholder="O escribe tu propio tema..."
                  value={temaCustom}
                  onChange={e => { setTemaCustom(e.target.value); setTema(''); }}
                  style={estilos.input}
                />
              </div>

              {/* Paso 4: Longitud */}
              <div style={estilos.paso}>
                <h3 style={estilos.pasoTitulo}>4. Longitud</h3>
                <div style={estilos.longitudGrid}>
                  {LONGITUDES.map(l => (
                    <div
                      key={l.id}
                      onClick={() => setLongitud(l.id)}
                      style={{
                        ...estilos.longitudCard,
                        ...(longitud === l.id ? estilos.longitudCardActiva : {})
                      }}
                    >
                      <span style={estilos.longitudNombre}>{l.nombre}</span>
                      <span style={estilos.longitudDesc}>{l.desc}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Error */}
              {error && <div style={estilos.error}>{error}</div>}

              {/* Boton generar */}
              <button
                onClick={generar}
                disabled={generando || !categoria || !tipo || !temaFinal}
                style={{
                  ...estilos.generarBtn,
                  ...(generando || !categoria || !tipo || !temaFinal ? estilos.btnDisabled : {})
                }}
              >
                {generando ? (
                  <>⏳ Generando... (esto puede tardar 1-2 minutos)</>
                ) : (
                  <>✨ Generar contenido</>
                )}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// ESTILOS
// ═══════════════════════════════════════════════════════════════

const estilos = {
  container: {
    maxWidth: '900px',
    margin: '0 auto'
  },

  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '32px',
    flexWrap: 'wrap',
    gap: '16px'
  },
  titulo: {
    color: '#fff',
    fontSize: '24px',
    fontWeight: '600',
    marginBottom: '4px'
  },
  subtitulo: {
    color: '#666',
    fontSize: '14px'
  },
  tabs: {
    display: 'flex',
    gap: '8px'
  },
  tab: {
    padding: '10px 20px',
    background: '#1f1f1f',
    border: '1px solid #2a2a2a',
    borderRadius: '8px',
    color: '#888',
    fontSize: '14px',
    cursor: 'pointer',
    transition: 'all 0.2s'
  },
  tabActivo: {
    background: 'rgba(198, 169, 98, 0.15)',
    borderColor: 'rgba(198, 169, 98, 0.4)',
    color: '#C6A962'
  },

  // Historial
  historialContainer: {
    minHeight: '400px'
  },
  cargando: {
    textAlign: 'center',
    padding: '60px',
    color: '#888'
  },
  sinHistorial: {
    textAlign: 'center',
    padding: '80px 20px',
    color: '#888',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '16px'
  },
  historialGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '16px'
  },
  historialItem: {
    background: '#141414',
    border: '1px solid #2a2a2a',
    borderRadius: '12px',
    overflow: 'hidden',
    cursor: 'pointer',
    transition: 'all 0.2s'
  },
  historialImagen: {
    height: '120px',
    background: '#0a0a0a'
  },
  historialInfo: {
    padding: '16px'
  },
  historialCategoria: {
    fontSize: '12px',
    color: '#888',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  historialTitulo: {
    color: '#fff',
    fontSize: '15px',
    fontWeight: '500',
    margin: '8px 0'
  },
  historialMeta: {
    color: '#666',
    fontSize: '13px',
    margin: '0'
  },
  historialFecha: {
    color: '#555',
    fontSize: '12px'
  },

  btnPrimario: {
    padding: '12px 24px',
    background: 'linear-gradient(135deg, #C6A962 0%, #D4BC7D 100%)',
    border: 'none',
    borderRadius: '8px',
    color: '#0a0a0a',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer'
  },

  // Formulario
  formulario: {
    display: 'flex',
    flexDirection: 'column',
    gap: '32px'
  },

  paso: {
    background: '#141414',
    border: '1px solid #2a2a2a',
    borderRadius: '12px',
    padding: '24px'
  },
  pasoTitulo: {
    color: '#fff',
    fontSize: '16px',
    fontWeight: '600',
    marginBottom: '16px'
  },

  categoriaGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
    gap: '12px'
  },
  categoriaCard: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
    padding: '20px 16px',
    background: '#0a0a0a',
    border: '1px solid #2a2a2a',
    borderRadius: '10px',
    cursor: 'pointer',
    transition: 'all 0.2s'
  },
  categoriaCardActiva: {
    background: 'rgba(198, 169, 98, 0.1)',
    borderColor: 'rgba(198, 169, 98, 0.4)'
  },
  categoriaIcono: {
    fontSize: '28px'
  },
  categoriaNombre: {
    color: '#ccc',
    fontSize: '13px',
    textAlign: 'center'
  },

  tipoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: '12px'
  },
  tipoCard: {
    padding: '16px',
    background: '#0a0a0a',
    border: '1px solid #2a2a2a',
    borderRadius: '10px',
    cursor: 'pointer',
    transition: 'all 0.2s'
  },
  tipoCardActivo: {
    background: 'rgba(198, 169, 98, 0.1)',
    borderColor: 'rgba(198, 169, 98, 0.4)'
  },
  tipoNombre: {
    display: 'block',
    color: '#fff',
    fontSize: '14px',
    fontWeight: '500',
    marginBottom: '4px'
  },
  tipoDesc: {
    color: '#666',
    fontSize: '12px'
  },

  temasSugeridos: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    marginBottom: '16px',
    alignItems: 'center'
  },
  temasLabel: {
    color: '#666',
    fontSize: '13px'
  },
  temaBtn: {
    padding: '8px 14px',
    background: '#0a0a0a',
    border: '1px solid #2a2a2a',
    borderRadius: '20px',
    color: '#888',
    fontSize: '13px',
    cursor: 'pointer',
    transition: 'all 0.2s'
  },
  temaBtnActivo: {
    background: 'rgba(198, 169, 98, 0.15)',
    borderColor: 'rgba(198, 169, 98, 0.4)',
    color: '#C6A962'
  },
  input: {
    width: '100%',
    padding: '14px 16px',
    background: '#0a0a0a',
    border: '1px solid #2a2a2a',
    borderRadius: '8px',
    color: '#fff',
    fontSize: '15px',
    outline: 'none',
    boxSizing: 'border-box'
  },

  longitudGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '12px'
  },
  longitudCard: {
    padding: '16px',
    background: '#0a0a0a',
    border: '1px solid #2a2a2a',
    borderRadius: '10px',
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s'
  },
  longitudCardActiva: {
    background: 'rgba(198, 169, 98, 0.1)',
    borderColor: 'rgba(198, 169, 98, 0.4)'
  },
  longitudNombre: {
    display: 'block',
    color: '#fff',
    fontSize: '15px',
    fontWeight: '500',
    marginBottom: '4px'
  },
  longitudDesc: {
    color: '#666',
    fontSize: '12px'
  },

  error: {
    padding: '14px 16px',
    background: 'rgba(239, 68, 68, 0.1)',
    border: '1px solid rgba(239, 68, 68, 0.3)',
    borderRadius: '8px',
    color: '#ef4444',
    fontSize: '14px'
  },

  generarBtn: {
    padding: '18px 32px',
    background: 'linear-gradient(135deg, #C6A962 0%, #D4BC7D 100%)',
    border: 'none',
    borderRadius: '10px',
    color: '#0a0a0a',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    textAlign: 'center'
  },
  btnDisabled: {
    opacity: 0.5,
    cursor: 'not-allowed'
  },

  // Resultado
  resultado: {
    background: '#141414',
    border: '1px solid #2a2a2a',
    borderRadius: '12px',
    overflow: 'hidden'
  },
  resultadoHeader: {
    padding: '20px 24px',
    borderBottom: '1px solid #2a2a2a',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '16px',
    flexWrap: 'wrap'
  },
  inputTitulo: {
    flex: 1,
    minWidth: '200px',
    padding: '12px 16px',
    background: '#0a0a0a',
    border: '1px solid #2a2a2a',
    borderRadius: '8px',
    color: '#fff',
    fontSize: '18px',
    fontWeight: '500',
    outline: 'none'
  },
  resultadoAcciones: {
    display: 'flex',
    gap: '10px'
  },
  accionBtn: {
    padding: '10px 16px',
    background: '#C6A962',
    border: 'none',
    borderRadius: '6px',
    color: '#0a0a0a',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer'
  },
  accionBtnSecundario: {
    padding: '10px 16px',
    background: '#1f1f1f',
    border: '1px solid #2a2a2a',
    borderRadius: '6px',
    color: '#ccc',
    fontSize: '13px',
    cursor: 'pointer'
  },

  // Imagen
  imagenSeccion: {
    padding: '20px 24px',
    borderBottom: '1px solid #2a2a2a',
    background: '#0f0f0f'
  },
  imagenTitulo: {
    color: '#C6A962',
    fontSize: '14px',
    fontWeight: '500',
    marginBottom: '16px'
  },
  imagenForm: {
    display: 'flex',
    gap: '12px',
    alignItems: 'flex-end'
  },
  promptInput: {
    flex: 1,
    padding: '12px 16px',
    background: '#0a0a0a',
    border: '1px solid #2a2a2a',
    borderRadius: '8px',
    color: '#fff',
    fontSize: '14px',
    resize: 'none',
    outline: 'none'
  },
  generarImagenBtn: {
    padding: '12px 20px',
    background: '#1f1f1f',
    border: '1px solid #C6A962',
    borderRadius: '8px',
    color: '#C6A962',
    fontSize: '13px',
    fontWeight: '500',
    cursor: 'pointer',
    whiteSpace: 'nowrap'
  },
  imagenPreview: {
    position: 'relative'
  },
  imagenImg: {
    width: '100%',
    maxHeight: '300px',
    objectFit: 'cover',
    borderRadius: '8px'
  },
  cambiarImagen: {
    position: 'absolute',
    top: '10px',
    right: '10px',
    padding: '8px 14px',
    background: 'rgba(0,0,0,0.7)',
    border: 'none',
    borderRadius: '6px',
    color: '#fff',
    fontSize: '12px',
    cursor: 'pointer'
  },

  contenidoPreview: {
    padding: '24px',
    maxHeight: '50vh',
    overflowY: 'auto'
  },
  contenidoTexto: {
    color: '#ccc',
    fontSize: '15px',
    lineHeight: '1.8',
    whiteSpace: 'pre-wrap',
    fontFamily: 'inherit'
  },
  contenidoFooter: {
    padding: '16px 24px',
    borderTop: '1px solid #2a2a2a',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '16px',
    flexWrap: 'wrap'
  },
  contenidoInfo: {
    display: 'flex',
    gap: '12px',
    color: '#666',
    fontSize: '13px'
  },
  publicarBtn: {
    padding: '12px 24px',
    background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
    border: 'none',
    borderRadius: '8px',
    color: '#fff',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer'
  },
  publicadoMsg: {
    padding: '12px 24px',
    background: 'rgba(34, 197, 94, 0.1)',
    border: '1px solid rgba(34, 197, 94, 0.3)',
    borderRadius: '8px',
    color: '#22c55e',
    fontSize: '14px',
    fontWeight: '500'
  }
};
