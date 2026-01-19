'use client';
import { useState, useEffect } from 'react';

// ═══════════════════════════════════════════════════════════════════════════════
// ADMINISTRADOR DE CURSOS - Panel completo con generación IA
// ═══════════════════════════════════════════════════════════════════════════════

export default function CursosAdmin() {
  const [cursos, setCursos] = useState([]);
  const [cursoEditando, setCursoEditando] = useState(null);
  const [vistaActual, setVistaActual] = useState('lista'); // 'lista' | 'editar' | 'generar'
  const [cargando, setCargando] = useState(true);
  const [generando, setGenerando] = useState(false);
  const [error, setError] = useState('');
  const [exito, setExito] = useState('');

  // Estado para generar con IA
  const [temaGeneracion, setTemaGeneracion] = useState('');
  const [promptExtra, setPromptExtra] = useState('');
  const [cursoGenerado, setCursoGenerado] = useState(null);
  const [modeloIA, setModeloIA] = useState('gemini'); // 'gemini' | 'claude'
  const [mostrarRefinamiento, setMostrarRefinamiento] = useState(false);
  const [instruccionRefinamiento, setInstruccionRefinamiento] = useState('');

  // Estado para duendes y configuración de curso
  const [duendesDisponibles, setDuendesDisponibles] = useState([]);
  const [cantidadModulos, setCantidadModulos] = useState(4);
  const [leccionesPorModulo, setLeccionesPorModulo] = useState(3);

  // Opciones rápidas para refinar curso
  const opcionesRefinamientoCurso = [
    { label: '📝 Más detallado', instruccion: 'Hacé el contenido más detallado y profundo, con más explicaciones y ejemplos.' },
    { label: '✂️ Más conciso', instruccion: 'Hacé el contenido más breve y directo, sin perder lo esencial.' },
    { label: '🔮 Más místico', instruccion: 'Agregá más elementos místicos, rituales y conexión espiritual.' },
    { label: '📚 Más educativo', instruccion: 'Enfocate más en la enseñanza práctica con ejercicios claros.' },
    { label: '💫 Más inspirador', instruccion: 'Hacé el tono más inspirador y motivacional.' },
    { label: '🧘 Más meditativo', instruccion: 'Incluí más momentos de reflexión y meditación en las lecciones.' },
    { label: '➕ Más módulos', instruccion: 'Agregá 2 módulos más al curso con contenido relevante.' },
    { label: '➕ Más lecciones', instruccion: 'Agregá más lecciones a cada módulo existente.' },
  ];

  // Cargar cursos y duendes al iniciar
  useEffect(() => {
    cargarCursos();
    cargarDuendes();
  }, []);

  // Cargar duendes desde WooCommerce/KV
  async function cargarDuendes() {
    try {
      const res = await fetch('/api/admin/circulo/duendes-reales');
      const data = await res.json();
      if (data.success && data.duendes) {
        setDuendesDisponibles(data.duendes);
      }
    } catch (err) {
      console.error('Error cargando duendes:', err);
    }
  }

  async function cargarCursos() {
    setCargando(true);
    try {
      const res = await fetch('/api/admin/cursos');
      const data = await res.json();
      if (data.success) {
        setCursos(data.cursos || []);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  }

  // Generar curso con IA
  async function generarCursoIA(instruccionExtra = '') {
    if (!temaGeneracion.trim()) {
      setError('Escribí un tema para el curso');
      return;
    }

    setGenerando(true);
    setError('');
    if (!instruccionExtra) {
      setCursoGenerado(null);
    }

    try {
      const promptFinal = instruccionExtra
        ? `${promptExtra}\n\nINSTRUCCIONES ADICIONALES DE REFINAMIENTO: ${instruccionExtra}`
        : promptExtra;

      const res = await fetch('/api/admin/cursos/generar-con-ia', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tema: temaGeneracion,
          prompt: promptFinal,
          preferirGemini: modeloIA === 'gemini',
          cantidadModulos,
          leccionesPorModulo,
          duendesDisponibles: duendesDisponibles.map(d => ({
            id: d.id,
            nombre: d.nombre,
            imagen: d.imagen,
            descripcion: d.descripcion?.slice(0, 200)
          }))
        })
      });

      const data = await res.json();
      if (data.success) {
        setCursoGenerado(data.curso);
        setExito(`✨ Curso ${instruccionExtra ? 'refinado' : 'generado'} con ${data.modeloUsado}`);
        setMostrarRefinamiento(false);
        setInstruccionRefinamiento('');
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setGenerando(false);
    }
  }

  // Refinar curso con instrucción
  function refinarCurso(instruccion) {
    generarCursoIA(instruccion);
  }

  // Guardar curso
  async function guardarCurso(curso) {
    try {
      const res = await fetch('/api/admin/cursos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accion: 'guardar', curso })
      });

      const data = await res.json();
      if (data.success) {
        setExito('Curso guardado');
        cargarCursos();
        setVistaActual('lista');
        setCursoEditando(null);
        setCursoGenerado(null);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError(err.message);
    }
  }

  // Publicar/Despublicar curso
  async function togglePublicar(cursoId, estado) {
    try {
      const res = await fetch('/api/admin/cursos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accion: estado === 'publicado' ? 'despublicar' : 'publicar',
          cursoId
        })
      });

      const data = await res.json();
      if (data.success) {
        setExito(data.mensaje);
        cargarCursos();
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError(err.message);
    }
  }

  // Eliminar curso
  async function eliminarCurso(cursoId) {
    if (!confirm('¿Eliminar este curso? Esta acción no se puede deshacer.')) return;

    try {
      const res = await fetch('/api/admin/cursos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accion: 'eliminar', cursoId })
      });

      const data = await res.json();
      if (data.success) {
        setExito('Curso eliminado');
        cargarCursos();
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError(err.message);
    }
  }

  // Duplicar curso
  async function duplicarCurso(cursoId) {
    try {
      const res = await fetch('/api/admin/cursos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accion: 'duplicar', cursoId })
      });

      const data = await res.json();
      if (data.success) {
        setExito('Curso duplicado');
        cargarCursos();
      }
    } catch (err) {
      setError(err.message);
    }
  }

  // Limpiar mensajes
  useEffect(() => {
    if (exito) {
      const t = setTimeout(() => setExito(''), 4000);
      return () => clearTimeout(t);
    }
  }, [exito]);

  useEffect(() => {
    if (error) {
      const t = setTimeout(() => setError(''), 6000);
      return () => clearTimeout(t);
    }
  }, [error]);

  // VISTA: Lista de cursos
  const renderLista = () => (
    <div className="cursos-lista-view">
      <div className="cursos-header">
        <div className="cursos-stats">
          <span className="stat">📚 {cursos.length} cursos</span>
          <span className="stat">✅ {cursos.filter(c => c.estado === 'publicado').length} publicados</span>
        </div>
        <div className="cursos-actions">
          <button className="btn-crear" onClick={() => setVistaActual('generar')}>
            🤖 Generar con IA
          </button>
          <button className="btn-crear-manual" onClick={() => {
            setCursoEditando({
              titulo: '',
              descripcion: '',
              nivel: 'principiante',
              duracion: '4 semanas',
              modulos: [],
              badge: { nombre: '', icono: '🏆', descripcion: '' }
            });
            setVistaActual('editar');
          }}>
            ✏️ Crear manual
          </button>
        </div>
      </div>

      {cursos.length === 0 ? (
        <div className="cursos-empty">
          <span>📚</span>
          <h3>No hay cursos todavía</h3>
          <p>Creá tu primer curso con IA o manualmente</p>
          <button onClick={() => setVistaActual('generar')}>🤖 Generar con IA</button>
        </div>
      ) : (
        <div className="cursos-grid">
          {cursos.map(curso => (
            <div key={curso.id} className={`curso-card ${curso.estado}`}>
              <div className="curso-card-header">
                <span className={`estado-badge ${curso.estado}`}>
                  {curso.estado === 'publicado' ? '✅ Publicado' : '📝 Borrador'}
                </span>
                <span className="nivel-badge">{curso.nivel}</span>
              </div>

              {curso.imagen && (
                <div className="curso-imagen">
                  <img src={curso.imagen} alt={curso.titulo} />
                </div>
              )}

              <h3>{curso.titulo}</h3>
              <p className="curso-desc">{curso.descripcion}</p>

              <div className="curso-meta">
                <span>📖 {curso.totalModulos || 0} módulos</span>
                <span>📝 {curso.totalLecciones || 0} lecciones</span>
                <span>⏱️ {curso.duracion}</span>
              </div>

              {curso.badge && (
                <div className="curso-badge-preview">
                  <span>{curso.badge.icono}</span>
                  <span>{curso.badge.nombre}</span>
                </div>
              )}

              <div className="curso-card-actions">
                <button onClick={() => { setCursoEditando(curso); setVistaActual('editar'); }}>
                  ✏️ Editar
                </button>
                <button onClick={() => togglePublicar(curso.id, curso.estado)}>
                  {curso.estado === 'publicado' ? '📥 Despublicar' : '🚀 Publicar'}
                </button>
                <button onClick={() => duplicarCurso(curso.id)}>📋 Duplicar</button>
                <button className="btn-danger" onClick={() => eliminarCurso(curso.id)}>🗑️</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  // VISTA: Generar con IA
  const renderGenerador = () => (
    <div className="cursos-generar-view">
      <button className="btn-volver" onClick={() => { setVistaActual('lista'); setCursoGenerado(null); }}>
        ← Volver a la lista
      </button>

      <div className="generar-header">
        <h2>🤖 Generar Curso con IA</h2>
        <p>La IA creará un curso completo con módulos, lecciones y contenido</p>
      </div>

      <div className="generar-form">
        <div className="form-group">
          <label>Tema del curso *</label>
          <input
            type="text"
            value={temaGeneracion}
            onChange={e => setTemaGeneracion(e.target.value)}
            placeholder="Ej: Introducción a los cristales y sus propiedades energéticas"
          />
        </div>

        <div className="form-group">
          <label>Instrucciones adicionales (opcional)</label>
          <textarea
            value={promptExtra}
            onChange={e => setPromptExtra(e.target.value)}
            placeholder="Ej: Quiero 5 módulos con 4 lecciones cada uno. Enfocate en cristales para principiantes..."
            rows={3}
          />
        </div>

        <div className="sugerencias-temas">
          <span>Sugerencias:</span>
          <button onClick={() => setTemaGeneracion('Introducción a los cristales y piedras energéticas')}>💎 Cristales</button>
          <button onClick={() => setTemaGeneracion('Tarot para principiantes: lectura e interpretación')}>🃏 Tarot</button>
          <button onClick={() => setTemaGeneracion('Meditación y conexión con la naturaleza')}>🧘 Meditación</button>
          <button onClick={() => setTemaGeneracion('Rituales y ceremonias para fechas especiales')}>🕯️ Rituales</button>
          <button onClick={() => setTemaGeneracion('Introducción a las runas nórdicas')}>ᚱ Runas</button>
          <button onClick={() => setTemaGeneracion('Herbología mágica: plantas y sus usos espirituales')}>🌿 Hierbas</button>
        </div>

        <div className="form-group">
          <label>Modelo de IA</label>
          <div className="modelo-selector-cursos">
            <button
              className={`modelo-btn ${modeloIA === 'gemini' ? 'active' : ''}`}
              onClick={() => setModeloIA('gemini')}
            >
              🍌 Gemini Pro
              <small>1.5 Pro (Recomendado)</small>
            </button>
            <button
              className={`modelo-btn ${modeloIA === 'claude' ? 'active' : ''}`}
              onClick={() => setModeloIA('claude')}
            >
              🤖 Claude
              <small>Sonnet 4</small>
            </button>
          </div>
        </div>

        {/* Configuración de longitud del curso */}
        <div className="form-group">
          <label>📏 Estructura del curso</label>
          <div className="curso-estructura-config">
            <div className="estructura-item">
              <label>Cantidad de módulos</label>
              <div className="cantidad-selector">
                {[3, 4, 5, 6, 8, 10].map(n => (
                  <button
                    key={n}
                    className={`cantidad-btn ${cantidadModulos === n ? 'active' : ''}`}
                    onClick={() => setCantidadModulos(n)}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>
            <div className="estructura-item">
              <label>Lecciones por módulo</label>
              <div className="cantidad-selector">
                {[2, 3, 4, 5, 6].map(n => (
                  <button
                    key={n}
                    className={`cantidad-btn ${leccionesPorModulo === n ? 'active' : ''}`}
                    onClick={() => setLeccionesPorModulo(n)}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>
            <div className="estructura-total">
              Total: <strong>{cantidadModulos * leccionesPorModulo}</strong> lecciones
            </div>
          </div>
        </div>

        {/* Duendes disponibles */}
        {duendesDisponibles.length > 0 && (
          <div className="form-group">
            <label>🧙 Duendes disponibles como profesores ({duendesDisponibles.length})</label>
            <div className="duendes-preview-lista">
              {duendesDisponibles.slice(0, 8).map(d => (
                <div key={d.id} className="duende-mini-card" title={d.nombre}>
                  <img src={d.imagen} alt={d.nombre} />
                  <span>{d.nombre?.split(' ')[0]}</span>
                </div>
              ))}
              {duendesDisponibles.length > 8 && (
                <span className="duendes-mas">+{duendesDisponibles.length - 8} más</span>
              )}
            </div>
            <small>La IA asignará duendes automáticamente a cada módulo según el tema</small>
          </div>
        )}

        <button
          className="btn-generar-ia"
          onClick={() => generarCursoIA()}
          disabled={generando || !temaGeneracion.trim()}
        >
          {generando
            ? `🔄 Generando curso + imágenes... (puede tardar 2-3 min)`
            : `✨ Generar Curso con Imágenes`}
        </button>

        {generando && (
          <div className="generando-imagenes-indicator">
            <span>🎨</span>
            <div>
              <strong>Generando curso completo con imágenes</strong>
              <p style={{margin: 0, fontSize: '13px', color: '#666'}}>
                Texto del curso + imagen de portada + imagen por módulo + imágenes en lecciones clave
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Preview del curso generado */}
      {cursoGenerado && (
        <div className="curso-generado-preview">
          <h3>✅ Curso Generado</h3>

          {/* Imagen de portada */}
          {cursoGenerado.imagen && (
            <div className="curso-portada-preview">
              <img src={cursoGenerado.imagen} alt={cursoGenerado.titulo} />
            </div>
          )}

          <div className="preview-header">
            <h4>{cursoGenerado.titulo}</h4>
            <p>{cursoGenerado.descripcion}</p>
            <div className="preview-meta">
              <span>📊 {cursoGenerado.nivel}</span>
              <span>⏱️ {cursoGenerado.duracion}</span>
              <span>📖 {cursoGenerado.modulos?.length} módulos</span>
              <span>📝 {cursoGenerado.totalLecciones} lecciones</span>
              {cursoGenerado.imagen && <span>🖼️ Con imágenes</span>}
            </div>
          </div>

          {cursoGenerado.badge && (
            <div className="preview-badge">
              <span className="badge-icon">{cursoGenerado.badge.icono}</span>
              <div>
                <strong>{cursoGenerado.badge.nombre}</strong>
                <p>{cursoGenerado.badge.descripcion}</p>
              </div>
            </div>
          )}

          <div className="preview-modulos">
            <h5>Contenido del curso:</h5>
            {cursoGenerado.modulos?.map((modulo, i) => (
              <div key={i} className="preview-modulo">
                {/* Imagen del módulo */}
                {modulo.imagen && (
                  <div className="modulo-imagen-preview">
                    <img src={modulo.imagen} alt={modulo.titulo} />
                  </div>
                )}
                <div className="modulo-header">
                  <span className="modulo-num">Módulo {modulo.numero || i + 1}</span>
                  <strong>{modulo.titulo}</strong>
                  {modulo.duende_profesor && (
                    <span className="modulo-duende">
                      🧙 {modulo.duende_profesor.nombre}
                    </span>
                  )}
                </div>
                <ul className="modulo-lecciones">
                  {modulo.lecciones?.map((leccion, j) => (
                    <li key={j} className={leccion.imagen ? 'con-imagen' : ''}>
                      <span className="leccion-num">{leccion.numero || j + 1}.</span>
                      {leccion.titulo}
                      <span className="leccion-duracion">{leccion.duracion_minutos}min</span>
                      {leccion.imagen && <span className="leccion-tiene-imagen">🖼️</span>}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="preview-actions">
            <button className="btn-guardar" onClick={() => guardarCurso(cursoGenerado)}>
              💾 Guardar Curso
            </button>
            <button className="btn-editar" onClick={() => { setCursoEditando(cursoGenerado); setVistaActual('editar'); }}>
              ✏️ Editar antes de guardar
            </button>
            <button className="btn-regenerar" onClick={() => generarCursoIA()} disabled={generando}>
              🔄 Regenerar
            </button>
            <button
              className="btn-refinar"
              onClick={() => setMostrarRefinamiento(!mostrarRefinamiento)}
            >
              🔧 {mostrarRefinamiento ? 'Ocultar' : 'Refinar'}
            </button>
          </div>

          {/* Panel de refinamiento */}
          {mostrarRefinamiento && (
            <div className="curso-refinamiento-panel">
              <h4>🔧 Refinar el curso</h4>
              <p>Seleccioná una opción rápida o escribí qué querés cambiar:</p>

              <div className="refinamiento-opciones">
                {opcionesRefinamientoCurso.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => refinarCurso(opt.instruccion)}
                    disabled={generando}
                    className="opcion-refinamiento"
                  >
                    {opt.label}
                  </button>
                ))}
              </div>

              <div className="refinamiento-custom">
                <textarea
                  value={instruccionRefinamiento}
                  onChange={e => setInstruccionRefinamiento(e.target.value)}
                  placeholder="Ej: Quiero que el módulo 2 sea más práctico, con ejercicios paso a paso. El badge debería llamarse 'Guardián de Cristales'..."
                  rows={3}
                />
                <button
                  onClick={() => refinarCurso(instruccionRefinamiento)}
                  disabled={generando || !instruccionRefinamiento.trim()}
                  className="btn-aplicar-refinamiento"
                >
                  {generando ? '⏳ Regenerando...' : '🔄 Aplicar cambios'}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );

  // VISTA: Editor de curso
  const renderEditor = () => {
    if (!cursoEditando) return null;

    return (
      <div className="cursos-editar-view">
        <button className="btn-volver" onClick={() => { setVistaActual('lista'); setCursoEditando(null); }}>
          ← Volver (sin guardar)
        </button>

        <div className="editor-header">
          <h2>{cursoEditando.id ? 'Editar Curso' : 'Crear Curso'}</h2>
        </div>

        <div className="editor-form">
          <div className="editor-section">
            <h3>Información básica</h3>

            <div className="form-group">
              <label>Título del curso *</label>
              <input
                type="text"
                value={cursoEditando.titulo || ''}
                onChange={e => setCursoEditando({ ...cursoEditando, titulo: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Descripción</label>
              <textarea
                value={cursoEditando.descripcion || ''}
                onChange={e => setCursoEditando({ ...cursoEditando, descripcion: e.target.value })}
                rows={3}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Nivel</label>
                <select
                  value={cursoEditando.nivel || 'principiante'}
                  onChange={e => setCursoEditando({ ...cursoEditando, nivel: e.target.value })}
                >
                  <option value="principiante">Principiante</option>
                  <option value="intermedio">Intermedio</option>
                  <option value="avanzado">Avanzado</option>
                </select>
              </div>

              <div className="form-group">
                <label>Duración</label>
                <input
                  type="text"
                  value={cursoEditando.duracion || ''}
                  onChange={e => setCursoEditando({ ...cursoEditando, duracion: e.target.value })}
                  placeholder="Ej: 4 semanas"
                />
              </div>
            </div>

            <div className="form-group">
              <label>URL de imagen (opcional)</label>
              <input
                type="url"
                value={cursoEditando.imagen || ''}
                onChange={e => setCursoEditando({ ...cursoEditando, imagen: e.target.value })}
                placeholder="https://..."
              />
            </div>
          </div>

          <div className="editor-section">
            <h3>Badge al completar</h3>
            <div className="form-row">
              <div className="form-group">
                <label>Icono</label>
                <input
                  type="text"
                  value={cursoEditando.badge?.icono || '🏆'}
                  onChange={e => setCursoEditando({
                    ...cursoEditando,
                    badge: { ...cursoEditando.badge, icono: e.target.value }
                  })}
                  style={{ width: '60px', textAlign: 'center', fontSize: '24px' }}
                />
              </div>
              <div className="form-group" style={{ flex: 1 }}>
                <label>Nombre del badge</label>
                <input
                  type="text"
                  value={cursoEditando.badge?.nombre || ''}
                  onChange={e => setCursoEditando({
                    ...cursoEditando,
                    badge: { ...cursoEditando.badge, nombre: e.target.value }
                  })}
                  placeholder="Ej: Maestro de Cristales"
                />
              </div>
            </div>
          </div>

          <div className="editor-section">
            <div className="section-header">
              <h3>Módulos ({cursoEditando.modulos?.length || 0})</h3>
              <button
                className="btn-add"
                onClick={() => setCursoEditando({
                  ...cursoEditando,
                  modulos: [...(cursoEditando.modulos || []), {
                    numero: (cursoEditando.modulos?.length || 0) + 1,
                    titulo: '',
                    descripcion: '',
                    duende_profesor: { nombre: '', personalidad: '' },
                    lecciones: []
                  }]
                })}
              >
                + Agregar módulo
              </button>
            </div>

            {cursoEditando.modulos?.map((modulo, mi) => (
              <div key={mi} className="editor-modulo">
                <div className="modulo-header-edit">
                  <span className="modulo-num">Módulo {mi + 1}</span>
                  <button
                    className="btn-remove"
                    onClick={() => setCursoEditando({
                      ...cursoEditando,
                      modulos: cursoEditando.modulos.filter((_, i) => i !== mi)
                    })}
                  >
                    🗑️
                  </button>
                </div>

                <div className="form-group">
                  <label>Título del módulo</label>
                  <input
                    type="text"
                    value={modulo.titulo || ''}
                    onChange={e => {
                      const modulos = [...cursoEditando.modulos];
                      modulos[mi] = { ...modulos[mi], titulo: e.target.value };
                      setCursoEditando({ ...cursoEditando, modulos });
                    }}
                  />
                </div>

                <div className="form-group">
                  <label>🧙 Duende profesor del módulo</label>
                  {duendesDisponibles.length > 0 ? (
                    <div className="duende-selector">
                      <select
                        value={modulo.duende_profesor?.id || ''}
                        onChange={e => {
                          const duendeSeleccionado = duendesDisponibles.find(d => d.id === e.target.value);
                          const modulos = [...cursoEditando.modulos];
                          modulos[mi] = {
                            ...modulos[mi],
                            duende_profesor: duendeSeleccionado ? {
                              id: duendeSeleccionado.id,
                              nombre: duendeSeleccionado.nombre,
                              imagen: duendeSeleccionado.imagen
                            } : { nombre: '', imagen: '' }
                          };
                          setCursoEditando({ ...cursoEditando, modulos });
                        }}
                      >
                        <option value="">-- Seleccionar duende --</option>
                        {duendesDisponibles.map(d => (
                          <option key={d.id} value={d.id}>{d.nombre}</option>
                        ))}
                      </select>
                      {modulo.duende_profesor?.imagen && (
                        <img
                          src={modulo.duende_profesor.imagen}
                          alt={modulo.duende_profesor.nombre}
                          className="duende-profesor-preview"
                        />
                      )}
                    </div>
                  ) : (
                    <input
                      type="text"
                      value={modulo.duende_profesor?.nombre || ''}
                      onChange={e => {
                        const modulos = [...cursoEditando.modulos];
                        modulos[mi] = {
                          ...modulos[mi],
                          duende_profesor: { ...modulos[mi].duende_profesor, nombre: e.target.value }
                        };
                        setCursoEditando({ ...cursoEditando, modulos });
                      }}
                      placeholder="Nombre del duende (sincronizá duendes desde WooCommerce)"
                    />
                  )}
                </div>

                <div className="modulo-lecciones-edit">
                  <div className="lecciones-header">
                    <span>Lecciones ({modulo.lecciones?.length || 0})</span>
                    <button
                      className="btn-add-small"
                      onClick={() => {
                        const modulos = [...cursoEditando.modulos];
                        modulos[mi] = {
                          ...modulos[mi],
                          lecciones: [...(modulos[mi].lecciones || []), {
                            numero: (modulos[mi].lecciones?.length || 0) + 1,
                            titulo: '',
                            duracion_minutos: 15,
                            contenido: '',
                            ejercicio_practico: '',
                            reflexion: ''
                          }]
                        };
                        setCursoEditando({ ...cursoEditando, modulos });
                      }}
                    >
                      + Lección
                    </button>
                  </div>

                  {modulo.lecciones?.map((leccion, li) => (
                    <div key={li} className="editor-leccion">
                      <div className="leccion-header-edit">
                        <span>Lección {li + 1}</span>
                        <button
                          className="btn-remove-small"
                          onClick={() => {
                            const modulos = [...cursoEditando.modulos];
                            modulos[mi] = {
                              ...modulos[mi],
                              lecciones: modulos[mi].lecciones.filter((_, i) => i !== li)
                            };
                            setCursoEditando({ ...cursoEditando, modulos });
                          }}
                        >
                          ✕
                        </button>
                      </div>

                      <input
                        type="text"
                        value={leccion.titulo || ''}
                        onChange={e => {
                          const modulos = [...cursoEditando.modulos];
                          modulos[mi].lecciones[li] = { ...modulos[mi].lecciones[li], titulo: e.target.value };
                          setCursoEditando({ ...cursoEditando, modulos });
                        }}
                        placeholder="Título de la lección"
                      />

                      <textarea
                        value={leccion.contenido || ''}
                        onChange={e => {
                          const modulos = [...cursoEditando.modulos];
                          modulos[mi].lecciones[li] = { ...modulos[mi].lecciones[li], contenido: e.target.value };
                          setCursoEditando({ ...cursoEditando, modulos });
                        }}
                        placeholder="Contenido de la lección..."
                        rows={4}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="editor-actions">
            <button className="btn-guardar" onClick={() => guardarCurso(cursoEditando)}>
              💾 Guardar Curso
            </button>
            <button className="btn-cancelar" onClick={() => { setVistaActual('lista'); setCursoEditando(null); }}>
              Cancelar
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (cargando) {
    return (
      <div className="cursos-admin loading">
        <span>📚</span>
        <p>Cargando cursos...</p>
      </div>
    );
  }

  return (
    <div className="cursos-admin">
      {error && <div className="mensaje error">{error}</div>}
      {exito && <div className="mensaje exito">{exito}</div>}

      {vistaActual === 'lista' && renderLista()}
      {vistaActual === 'generar' && renderGenerador()}
      {vistaActual === 'editar' && renderEditor()}
    </div>
  );
}
