'use client';
import { useState, useEffect } from 'react';

// ═══════════════════════════════════════════════════════════════════════════════
// GENERADOR DE CONTENIDO - DISEÑO PREMIUM GRIMORIO
// ═══════════════════════════════════════════════════════════════════════════════

const TIPOS_CONTENIDO = [
  { id: 'mensaje', nombre: 'Mensaje del Día', icon: '📜', desc: 'Reflexión inspiradora' },
  { id: 'meditacion', nombre: 'Meditación', icon: '🧘', desc: 'Viaje interior guiado' },
  { id: 'ritual', nombre: 'Ritual', icon: '🕯️', desc: 'Práctica paso a paso' },
  { id: 'curso', nombre: 'Curso', icon: '📚', desc: 'Lección estructurada' },
  { id: 'conocimiento', nombre: 'Conocimiento', icon: '💎', desc: 'Cristales, hierbas, runas' },
  { id: 'historia', nombre: 'Leyenda', icon: '📖', desc: 'Historia con enseñanza' }
];

const CATEGORIAS = [
  { id: 'general', nombre: 'General' },
  { id: 'luna', nombre: 'Fases Lunares' },
  { id: 'cristales', nombre: 'Cristales' },
  { id: 'hierbas', nombre: 'Hierbas' },
  { id: 'proteccion', nombre: 'Protección' },
  { id: 'abundancia', nombre: 'Abundancia' },
  { id: 'sanacion', nombre: 'Sanación' },
  { id: 'ancestros', nombre: 'Ancestros' }
];

const DURACIONES = ['5 minutos', '10 minutos', '15 minutos', '20 minutos'];
const NIVELES = ['Principiante', 'Intermedio', 'Avanzado'];
const MOMENTOS = ['Mañana', 'Mediodía', 'Atardecer', 'Noche', 'Luna llena', 'Luna nueva'];
const SUBTIPOS_CONOCIMIENTO = ['Cristal', 'Hierba', 'Runa', 'Fase lunar', 'Elemento'];
const TIPOS_HISTORIA = ['Leyenda celta', 'Cuento de duendes', 'Fábula mágica', 'Historia de guardián'];

// TABS DEL PANEL ADMIN
const ADMIN_TABS = [
  { id: 'contenido', nombre: 'Contenido Diario', icon: '📝' },
  { id: 'semanal', nombre: 'Generador Semanal', icon: '📅' },
  { id: 'cursos', nombre: 'Cursos', icon: '📚' },
  { id: 'regalos', nombre: 'Regalos Admin', icon: '🎁' },
  { id: 'foro', nombre: 'Bot Foro', icon: '💬' }
];

export default function GeneradorContenido() {
  const [tabActiva, setTabActiva] = useState('contenido');
  const [tipo, setTipo] = useState('mensaje');
  const [categoria, setCategoria] = useState('general');
  const [camposForm, setCamposForm] = useState({});
  const [palabras, setPalabras] = useState(1500);
  const [usarDuende, setUsarDuende] = useState(true);
  const [integrarLuna, setIntegrarLuna] = useState(true);
  const [integrarEstacion, setIntegrarEstacion] = useState(false);

  const [duendeSemana, setDuendeSemana] = useState(null);
  const [infoHoy, setInfoHoy] = useState(null);
  const [generando, setGenerando] = useState(false);
  const [contenidoGenerado, setContenidoGenerado] = useState(null);
  const [contenidoEditado, setContenidoEditado] = useState('');
  const [tituloEditado, setTituloEditado] = useState('');
  const [modoEdicion, setModoEdicion] = useState(false);
  const [error, setError] = useState(null);
  const [exito, setExito] = useState('');
  const [guardando, setGuardando] = useState(false);
  const [vistaHistorial, setVistaHistorial] = useState(false);
  const [historial, setHistorial] = useState([]);

  // Estados para generador semanal
  const [semanaPlanificada, setSemanaPlanificada] = useState([]);
  const [generandoSemana, setGenerandoSemana] = useState(false);

  // Estados para cursos
  const [cursos, setCursos] = useState([]);
  const [cursoEditando, setCursoEditando] = useState(null);

  // Estados para regalos admin
  const [regalosAdmin, setRegalosAdmin] = useState([]);
  const [nuevoRegalo, setNuevoRegalo] = useState({ email: '', runas: 0, motivo: '' });

  // Estados para foro bot
  const [postsPendientes, setPostsPendientes] = useState([]);
  const [respuestaBot, setRespuestaBot] = useState('');

  useEffect(() => {
    cargarDatos();
  }, []);

  useEffect(() => {
    setCamposForm({});
  }, [tipo]);

  async function cargarDatos() {
    try {
      const [resDuende, resInfo, resHist] = await Promise.all([
        fetch('/api/admin/duende-semana'),
        fetch('/api/circulo/info-dia'),
        fetch('/api/admin/contenido/historial')
      ]);

      const dataDuende = await resDuende.json();
      if (dataDuende.success && dataDuende.duendeActual) {
        setDuendeSemana(dataDuende.duendeActual);
      }

      const dataInfo = await resInfo.json();
      if (dataInfo.success) setInfoHoy(dataInfo);

      const dataHist = await resHist.json();
      if (dataHist.success) setHistorial(dataHist.contenidos || []);
    } catch (err) {
      console.error('Error cargando datos:', err);
    }
  }

  function actualizarCampo(campo, valor) {
    setCamposForm(prev => ({ ...prev, [campo]: valor }));
  }

  function hayContenidoEnForm() {
    return Object.values(camposForm).some(v => v && String(v).trim());
  }

  async function generarContenido() {
    if (!hayContenidoEnForm()) {
      setError('Completá al menos un campo del formulario');
      return;
    }

    setGenerando(true);
    setError(null);
    setContenidoGenerado(null);
    setModoEdicion(false);

    const tipoActual = TIPOS_CONTENIDO.find(t => t.id === tipo);

    try {
      const res = await fetch('/api/admin/contenido/generar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tipo,
          tipoNombre: tipoActual?.nombre,
          camposForm,
          palabras,
          categoria,
          usarDuendeSemana: usarDuende && duendeSemana,
          integrarLuna,
          integrarEstacion
        })
      });

      const data = await res.json();

      if (data.success) {
        setContenidoGenerado(data);
        setContenidoEditado(data.contenido || '');
        setTituloEditado(data.titulo || '');
        cargarDatos();
      } else {
        setError(data.error || 'Error generando contenido');
      }
    } catch (err) {
      setError('Error de conexión');
    } finally {
      setGenerando(false);
    }
  }

  async function guardarContenido(estado = 'borrador') {
    if (!contenidoGenerado) return;

    setGuardando(true);
    setError(null);

    try {
      const hoy = new Date();
      const res = await fetch('/api/admin/circulo/contenidos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dia: hoy.getDate(),
          mes: hoy.getMonth() + 1,
          año: hoy.getFullYear(),
          contenido: {
            tipo,
            titulo: tituloEditado || contenidoGenerado.titulo,
            contenido: contenidoEditado || contenidoGenerado.contenido,
            categoria,
            duende: duendeSemana?.nombre,
            estado
          }
        })
      });

      const data = await res.json();
      if (data.success) {
        setExito(estado === 'publicado' ? '¡Contenido publicado!' : 'Guardado como borrador');
        setTimeout(() => setExito(''), 3000);
        cargarDatos();
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Error guardando');
    } finally {
      setGuardando(false);
    }
  }

  // Renderizar campos específicos del tipo
  function renderCamposTipo() {
    switch (tipo) {
      case 'mensaje':
        return (
          <>
            <div className="form-field">
              <label>Tema del mensaje</label>
              <input
                type="text"
                value={camposForm.tema || ''}
                onChange={e => actualizarCampo('tema', e.target.value)}
                placeholder="Ej: Soltar lo que ya no sirve..."
              />
            </div>
            <div className="form-field">
              <label>Enfoque</label>
              <select value={camposForm.enfoque || ''} onChange={e => actualizarCampo('enfoque', e.target.value)}>
                <option value="">Seleccionar enfoque...</option>
                <option value="motivacional">Motivacional</option>
                <option value="reflexivo">Reflexivo</option>
                <option value="practico">Práctico</option>
                <option value="sanador">Sanador</option>
              </select>
            </div>
            <div className="form-field">
              <label>Intención</label>
              <textarea
                rows={2}
                value={camposForm.intencion || ''}
                onChange={e => actualizarCampo('intencion', e.target.value)}
                placeholder="¿Qué querés que sienta quien lo lea?"
              />
            </div>
          </>
        );

      case 'meditacion':
        return (
          <>
            <div className="form-row">
              <div className="form-field">
                <label>Duración</label>
                <select value={camposForm.duracion || ''} onChange={e => actualizarCampo('duracion', e.target.value)}>
                  <option value="">Seleccionar...</option>
                  {DURACIONES.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div className="form-field">
                <label>Música sugerida</label>
                <input
                  type="text"
                  value={camposForm.musica || ''}
                  onChange={e => actualizarCampo('musica', e.target.value)}
                  placeholder="432Hz, naturaleza..."
                />
              </div>
            </div>
            <div className="form-field">
              <label>Objetivo</label>
              <input
                type="text"
                value={camposForm.objetivo || ''}
                onChange={e => actualizarCampo('objetivo', e.target.value)}
                placeholder="Ej: Conectar con la paz interior"
              />
            </div>
            <div className="form-field">
              <label>Elementos visuales</label>
              <input
                type="text"
                value={camposForm.elementos || ''}
                onChange={e => actualizarCampo('elementos', e.target.value)}
                placeholder="Ej: Bosque, río de luz dorada..."
              />
            </div>
          </>
        );

      case 'ritual':
        return (
          <>
            <div className="form-field">
              <label>Propósito del ritual</label>
              <input
                type="text"
                value={camposForm.proposito || ''}
                onChange={e => actualizarCampo('proposito', e.target.value)}
                placeholder="Ej: Limpiar energías estancadas"
              />
            </div>
            <div className="form-field">
              <label>Materiales</label>
              <textarea
                rows={2}
                value={camposForm.materiales || ''}
                onChange={e => actualizarCampo('materiales', e.target.value)}
                placeholder="Vela blanca, sal, agua..."
              />
            </div>
            <div className="form-row">
              <div className="form-field">
                <label>Mejor momento</label>
                <select value={camposForm.momento || ''} onChange={e => actualizarCampo('momento', e.target.value)}>
                  <option value="">Seleccionar...</option>
                  {MOMENTOS.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
              <div className="form-field">
                <label>Nivel</label>
                <select value={camposForm.nivel || ''} onChange={e => actualizarCampo('nivel', e.target.value)}>
                  <option value="">Seleccionar...</option>
                  {NIVELES.map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
            </div>
          </>
        );

      case 'curso':
        return (
          <>
            <div className="form-field">
              <label>Tema de la lección</label>
              <input
                type="text"
                value={camposForm.tema_curso || ''}
                onChange={e => actualizarCampo('tema_curso', e.target.value)}
                placeholder="Ej: Introducción a las runas vikingas"
              />
            </div>
            <div className="form-row">
              <div className="form-field">
                <label>Nivel</label>
                <select value={camposForm.nivel || ''} onChange={e => actualizarCampo('nivel', e.target.value)}>
                  <option value="">Seleccionar...</option>
                  {NIVELES.map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
              <div className="form-field checkbox-field">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={camposForm.incluirEjercicio || false}
                    onChange={e => actualizarCampo('incluirEjercicio', e.target.checked)}
                  />
                  <span className="checkmark"></span>
                  Incluir ejercicio práctico
                </label>
              </div>
            </div>
            <div className="form-field">
              <label>Objetivos de aprendizaje</label>
              <textarea
                rows={2}
                value={camposForm.objetivos || ''}
                onChange={e => actualizarCampo('objetivos', e.target.value)}
                placeholder="¿Qué va a aprender?"
              />
            </div>
          </>
        );

      case 'conocimiento':
        return (
          <>
            <div className="form-row">
              <div className="form-field">
                <label>Tipo</label>
                <select value={camposForm.subtipo || ''} onChange={e => actualizarCampo('subtipo', e.target.value)}>
                  <option value="">Seleccionar...</option>
                  {SUBTIPOS_CONOCIMIENTO.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="form-field">
                <label>Elemento específico</label>
                <input
                  type="text"
                  value={camposForm.elemento || ''}
                  onChange={e => actualizarCampo('elemento', e.target.value)}
                  placeholder="Ej: Cuarzo rosa"
                />
              </div>
            </div>
            <div className="form-field">
              <label>Propiedades a destacar</label>
              <textarea
                rows={2}
                value={camposForm.propiedades || ''}
                onChange={e => actualizarCampo('propiedades', e.target.value)}
                placeholder="¿Qué propiedades resaltar?"
              />
            </div>
            <div className="form-field">
              <label>Usos prácticos</label>
              <textarea
                rows={2}
                value={camposForm.usos || ''}
                onChange={e => actualizarCampo('usos', e.target.value)}
                placeholder="¿Cómo puede usarlo?"
              />
            </div>
          </>
        );

      case 'historia':
        return (
          <>
            <div className="form-row">
              <div className="form-field">
                <label>Tipo de historia</label>
                <select value={camposForm.tipo_historia || ''} onChange={e => actualizarCampo('tipo_historia', e.target.value)}>
                  <option value="">Seleccionar...</option>
                  {TIPOS_HISTORIA.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div className="form-field">
                <label>Ambientación</label>
                <input
                  type="text"
                  value={camposForm.ambientacion || ''}
                  onChange={e => actualizarCampo('ambientacion', e.target.value)}
                  placeholder="Ej: Bosque en otoño"
                />
              </div>
            </div>
            <div className="form-field">
              <label>Moraleja o enseñanza</label>
              <input
                type="text"
                value={camposForm.moraleja || ''}
                onChange={e => actualizarCampo('moraleja', e.target.value)}
                placeholder="¿Qué mensaje debe transmitir?"
              />
            </div>
            <div className="form-field">
              <label>Personajes</label>
              <input
                type="text"
                value={camposForm.personajes || ''}
                onChange={e => actualizarCampo('personajes', e.target.value)}
                placeholder="Ej: Un duende sabio, una niña curiosa"
              />
            </div>
          </>
        );

      default:
        return null;
    }
  }

  // Renderizar sección de tabs adicionales
  function renderSeccionSemanal() {
    return (
      <div className="seccion-semanal">
        <h2 className="section-title">📅 Generador Semanal</h2>
        <p className="section-desc">Genera toda una semana de contenido de una vez</p>

        <div className="semana-config">
          <div className="config-row">
            <label>Duende de la semana:</label>
            <span className="duende-name">{duendeSemana?.nombre || 'No seleccionado'}</span>
          </div>
          <div className="config-row">
            <label>Tipos a generar:</label>
            <div className="tipos-checkboxes">
              <label><input type="checkbox" defaultChecked /> Mensaje diario</label>
              <label><input type="checkbox" defaultChecked /> Meditación (Mié)</label>
              <label><input type="checkbox" defaultChecked /> Ritual (Vie)</label>
              <label><input type="checkbox" defaultChecked /> Conocimiento (Dom)</label>
            </div>
          </div>
        </div>

        <button
          className="btn-generar-semana"
          onClick={async () => {
            setGenerandoSemana(true);
            // Aquí iría la lógica de generar la semana completa
            setTimeout(() => {
              setSemanaPlanificada([
                { dia: 'Lunes', tipo: 'mensaje', titulo: 'Mensaje del lunes', estado: 'pendiente' },
                { dia: 'Martes', tipo: 'mensaje', titulo: 'Mensaje del martes', estado: 'pendiente' },
                { dia: 'Miércoles', tipo: 'meditacion', titulo: 'Meditación semanal', estado: 'pendiente' },
                { dia: 'Jueves', tipo: 'mensaje', titulo: 'Mensaje del jueves', estado: 'pendiente' },
                { dia: 'Viernes', tipo: 'ritual', titulo: 'Ritual de cierre', estado: 'pendiente' },
                { dia: 'Sábado', tipo: 'mensaje', titulo: 'Mensaje del sábado', estado: 'pendiente' },
                { dia: 'Domingo', tipo: 'conocimiento', titulo: 'Conocimiento semanal', estado: 'pendiente' },
              ]);
              setGenerandoSemana(false);
            }, 1000);
          }}
          disabled={generandoSemana}
        >
          {generandoSemana ? 'Generando...' : '⚡ Generar Semana Completa'}
        </button>

        {semanaPlanificada.length > 0 && (
          <div className="semana-preview">
            <h3>Vista previa de la semana</h3>
            <div className="dias-grid">
              {semanaPlanificada.map((dia, i) => (
                <div key={i} className={`dia-card ${dia.estado}`}>
                  <span className="dia-nombre">{dia.dia}</span>
                  <span className="dia-tipo">{TIPOS_CONTENIDO.find(t => t.id === dia.tipo)?.icon}</span>
                  <span className="dia-titulo">{dia.titulo}</span>
                  <span className={`dia-estado estado-${dia.estado}`}>{dia.estado}</span>
                </div>
              ))}
            </div>
            <button className="btn-publicar-semana">Publicar Toda la Semana</button>
          </div>
        )}
      </div>
    );
  }

  function renderSeccionCursos() {
    return (
      <div className="seccion-cursos">
        <h2 className="section-title">📚 Gestión de Cursos</h2>
        <p className="section-desc">Crea y administra cursos para los miembros del Círculo</p>

        <div className="cursos-actions">
          <button className="btn-nuevo-curso" onClick={() => setCursoEditando({
            titulo: '',
            descripcion: '',
            nivel: 'Principiante',
            lecciones: []
          })}>
            + Nuevo Curso
          </button>
        </div>

        {cursoEditando && (
          <div className="curso-editor">
            <h3>{cursoEditando.id ? 'Editar' : 'Nuevo'} Curso</h3>
            <div className="form-field">
              <label>Título del curso</label>
              <input
                type="text"
                value={cursoEditando.titulo}
                onChange={e => setCursoEditando({...cursoEditando, titulo: e.target.value})}
                placeholder="Ej: Introducción a los Cristales"
              />
            </div>
            <div className="form-field">
              <label>Descripción</label>
              <textarea
                rows={3}
                value={cursoEditando.descripcion}
                onChange={e => setCursoEditando({...cursoEditando, descripcion: e.target.value})}
                placeholder="¿De qué trata este curso?"
              />
            </div>
            <div className="form-field">
              <label>Nivel</label>
              <select
                value={cursoEditando.nivel}
                onChange={e => setCursoEditando({...cursoEditando, nivel: e.target.value})}
              >
                {NIVELES.map(n => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>
            <div className="curso-lecciones">
              <h4>Lecciones ({cursoEditando.lecciones?.length || 0})</h4>
              <button className="btn-add-leccion" onClick={() => {
                setCursoEditando({
                  ...cursoEditando,
                  lecciones: [...(cursoEditando.lecciones || []), { titulo: '', contenido: '' }]
                });
              }}>+ Agregar Lección</button>
            </div>
            <div className="curso-actions">
              <button className="btn-cancelar" onClick={() => setCursoEditando(null)}>Cancelar</button>
              <button className="btn-guardar-curso">Guardar Curso</button>
            </div>
          </div>
        )}

        <div className="cursos-list">
          <h3>Cursos existentes</h3>
          <p className="empty-state">No hay cursos creados aún</p>
        </div>
      </div>
    );
  }

  function renderSeccionRegalos() {
    return (
      <div className="seccion-regalos">
        <h2 className="section-title">🎁 Regalos Admin</h2>
        <p className="section-desc">Otorga runas, lecturas o beneficios a usuarios</p>

        <div className="regalo-form-admin">
          <h3>Otorgar Regalo</h3>
          <div className="form-row">
            <div className="form-field">
              <label>Email del usuario</label>
              <input
                type="email"
                value={nuevoRegalo.email}
                onChange={e => setNuevoRegalo({...nuevoRegalo, email: e.target.value})}
                placeholder="usuario@email.com"
              />
            </div>
            <div className="form-field">
              <label>Cantidad de runas</label>
              <input
                type="number"
                value={nuevoRegalo.runas}
                onChange={e => setNuevoRegalo({...nuevoRegalo, runas: parseInt(e.target.value) || 0})}
                placeholder="100"
              />
            </div>
          </div>
          <div className="form-field">
            <label>Motivo (interno)</label>
            <input
              type="text"
              value={nuevoRegalo.motivo}
              onChange={e => setNuevoRegalo({...nuevoRegalo, motivo: e.target.value})}
              placeholder="Ej: Compensación por problema técnico"
            />
          </div>
          <div className="regalo-options">
            <label><input type="checkbox" /> Enviar email de notificación</label>
            <label><input type="checkbox" /> Agregar mensaje personalizado</label>
          </div>
          <button className="btn-otorgar" onClick={async () => {
            if (!nuevoRegalo.email || !nuevoRegalo.runas) return;
            try {
              const res = await fetch('/api/admin/regalos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(nuevoRegalo)
              });
              const data = await res.json();
              if (data.success) {
                setExito('Runas otorgadas correctamente');
                setNuevoRegalo({ email: '', runas: 0, motivo: '' });
              } else {
                setError(data.error);
              }
            } catch (e) {
              setError('Error al otorgar regalo');
            }
          }}>
            ✨ Otorgar Runas
          </button>
        </div>

        <div className="regalos-historial">
          <h3>Regalos recientes</h3>
          <p className="empty-state">No hay regalos otorgados recientemente</p>
        </div>
      </div>
    );
  }

  function renderSeccionForo() {
    return (
      <div className="seccion-foro">
        <h2 className="section-title">💬 Bot del Foro</h2>
        <p className="section-desc">Genera respuestas automáticas y gestiona la comunidad simulada</p>

        <div className="foro-config">
          <h3>Configuración del Bot</h3>
          <div className="config-options">
            <label><input type="checkbox" defaultChecked /> Bot activo</label>
            <label><input type="checkbox" defaultChecked /> Responder preguntas automáticamente</label>
            <label><input type="checkbox" /> Generar posts de comunidad</label>
          </div>
        </div>

        <div className="foro-generar">
          <h3>Generar Respuesta</h3>
          <div className="form-field">
            <label>Post del usuario a responder</label>
            <textarea
              rows={3}
              value={respuestaBot}
              onChange={e => setRespuestaBot(e.target.value)}
              placeholder="Pega aquí el mensaje del usuario..."
            />
          </div>
          <button className="btn-generar-respuesta" onClick={async () => {
            if (!respuestaBot) return;
            setGenerando(true);
            try {
              const res = await fetch('/api/comunidad/bots', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ tipo: 'respuesta', mensaje: respuestaBot })
              });
              const data = await res.json();
              if (data.success) {
                setExito('Respuesta generada');
              }
            } catch (e) {
              setError('Error generando respuesta');
            } finally {
              setGenerando(false);
            }
          }} disabled={generando}>
            {generando ? 'Generando...' : '🤖 Generar Respuesta'}
          </button>
        </div>

        <div className="foro-posts-pendientes">
          <h3>Posts pendientes de respuesta</h3>
          <p className="empty-state">No hay posts pendientes</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grimorio">
      {/* Header */}
      <header className="header">
        <div className="header-left">
          <a href="/admin" className="back-link">← Volver</a>
          <div className="divider"></div>
          <h1>✨ Panel de Contenido</h1>
        </div>
        {tabActiva === 'contenido' && (
          <button
            className={`btn-historial ${vistaHistorial ? 'active' : ''}`}
            onClick={() => setVistaHistorial(!vistaHistorial)}
          >
            {vistaHistorial ? 'Crear Nuevo' : 'Historial'}
          </button>
        )}
      </header>

      {/* Tabs Navigation */}
      <nav className="admin-tabs">
        {ADMIN_TABS.map(tab => (
          <button
            key={tab.id}
            className={`admin-tab ${tabActiva === tab.id ? 'active' : ''}`}
            onClick={() => setTabActiva(tab.id)}
          >
            <span className="tab-icon">{tab.icon}</span>
            <span className="tab-name">{tab.nombre}</span>
          </button>
        ))}
      </nav>

      {/* Info Bar */}
      {(duendeSemana || infoHoy) && (
        <div className="info-bar">
          {duendeSemana && (
            <div className="info-item">
              <img src={duendeSemana.imagen} alt="" className="duende-avatar" />
              <span>Duende activo: <strong>{duendeSemana.nombre}</strong></span>
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
              <span>☀️</span>
              <span>{infoHoy.celebracionProxima.datos?.nombre} en {infoHoy.celebracionProxima.diasRestantes} días</span>
            </div>
          )}
        </div>
      )}

      <main className="main-content">
        {/* Tab: Semanal */}
        {tabActiva === 'semanal' && renderSeccionSemanal()}

        {/* Tab: Cursos */}
        {tabActiva === 'cursos' && renderSeccionCursos()}

        {/* Tab: Regalos */}
        {tabActiva === 'regalos' && renderSeccionRegalos()}

        {/* Tab: Foro */}
        {tabActiva === 'foro' && renderSeccionForo()}

        {/* Tab: Contenido Diario (principal) */}
        {tabActiva === 'contenido' && (
          vistaHistorial ? (
          <div className="historial-view">
            <h2 className="section-title">Contenido Generado</h2>
            {historial.length === 0 ? (
              <p className="empty-state">No hay contenido en el historial</p>
            ) : (
              <div className="historial-list">
                {historial.map((item, i) => (
                  <div key={i} className="historial-item">
                    <div className="historial-left">
                      {item.duende?.imagen && (
                        <img src={item.duende.imagen} alt="" className="historial-avatar" />
                      )}
                      <div>
                        <h3>{item.titulo || item.tema}</h3>
                        <p>{TIPOS_CONTENIDO.find(t => t.id === item.tipo)?.nombre} • {item.duende?.nombre}</p>
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
        ) : (
          <div className="generator-grid">
            {/* Left Column */}
            <div className="left-column">
              {/* Tipo de Contenido */}
              <div className="card">
                <h2 className="card-title"><span className="step">01</span> Tipo de Contenido</h2>
                <div className="tipos-grid">
                  {TIPOS_CONTENIDO.map(t => (
                    <button
                      key={t.id}
                      className={`tipo-btn ${tipo === t.id ? 'active' : ''}`}
                      onClick={() => setTipo(t.id)}
                    >
                      <span className="tipo-icon">{t.icon}</span>
                      <span className="tipo-nombre">{t.nombre}</span>
                      <span className="tipo-desc">{t.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Configuración */}
              <div className="card">
                <h2 className="card-title"><span className="step">02</span> Configuración</h2>
                <div className="form-fields">
                  {renderCamposTipo()}
                </div>
              </div>

              {/* Opciones */}
              <div className="card">
                <h2 className="card-title"><span className="step">03</span> Opciones</h2>

                <div className="form-field">
                  <label>Categoría</label>
                  <select value={categoria} onChange={e => setCategoria(e.target.value)}>
                    {CATEGORIAS.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                  </select>
                </div>

                <div className="form-field">
                  <label>Extensión: <strong>~{palabras} palabras</strong></label>
                  <input
                    type="range"
                    min="500"
                    max="3000"
                    step="100"
                    value={palabras}
                    onChange={e => setPalabras(parseInt(e.target.value))}
                    className="range-slider"
                  />
                </div>

                <div className="checkbox-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={usarDuende}
                      onChange={e => setUsarDuende(e.target.checked)}
                      disabled={!duendeSemana}
                    />
                    <span className="checkmark"></span>
                    Usar voz de {duendeSemana?.nombre || 'Duende de la Semana'}
                  </label>

                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={integrarLuna}
                      onChange={e => setIntegrarLuna(e.target.checked)}
                    />
                    <span className="checkmark"></span>
                    Integrar fase lunar
                  </label>

                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={integrarEstacion}
                      onChange={e => setIntegrarEstacion(e.target.checked)}
                    />
                    <span className="checkmark"></span>
                    Mencionar celebración celta
                  </label>
                </div>
              </div>

              {/* Botón Generar */}
              <button
                className={`btn-generar ${generando || !hayContenidoEnForm() ? 'disabled' : ''}`}
                onClick={generarContenido}
                disabled={generando || !hayContenidoEnForm()}
              >
                {generando ? (
                  <><span className="spinner"></span> Generando magia...</>
                ) : (
                  <>✨ Generar con IA</>
                )}
              </button>

              {error && <div className="msg error">{error}</div>}
              {exito && <div className="msg success">{exito}</div>}
            </div>

            {/* Right Column - Preview */}
            <div className="right-column">
              <div className="card preview-card">
                <div className="preview-header">
                  <h2 className="card-title">{modoEdicion ? '✏️ Editor' : '👁️ Vista Previa'}</h2>
                  {contenidoGenerado && (
                    <button className="btn-edit" onClick={() => setModoEdicion(!modoEdicion)}>
                      {modoEdicion ? 'Ver preview' : 'Editar'}
                    </button>
                  )}
                </div>

                {contenidoGenerado ? (
                  <div className="preview-content">
                    <div className="preview-meta">
                      {contenidoGenerado.duendeSemana && (
                        <img src={contenidoGenerado.duendeSemana.imagen} alt="" className="preview-avatar" />
                      )}
                      <div>
                        <span className="tipo-badge">
                          {TIPOS_CONTENIDO.find(t => t.id === tipo)?.icon}
                          {TIPOS_CONTENIDO.find(t => t.id === tipo)?.nombre}
                        </span>
                        {contenidoGenerado.duendeSemana && (
                          <p className="autor">por {contenidoGenerado.duendeSemana.nombre}</p>
                        )}
                      </div>
                    </div>

                    {modoEdicion ? (
                      <div className="editor">
                        <input
                          type="text"
                          className="editor-titulo"
                          value={tituloEditado}
                          onChange={e => setTituloEditado(e.target.value)}
                          placeholder="Título..."
                        />
                        <textarea
                          className="editor-texto"
                          value={contenidoEditado}
                          onChange={e => setContenidoEditado(e.target.value)}
                          rows={16}
                        />
                        <p className="editor-tip">Markdown: **negrita**, *cursiva*, ## subtítulo</p>
                      </div>
                    ) : (
                      <div className="preview-body">
                        <h3 className="preview-titulo">{tituloEditado || contenidoGenerado.titulo}</h3>
                        <div
                          className="preview-text"
                          dangerouslySetInnerHTML={{ __html: formatearContenido(contenidoEditado || contenidoGenerado.contenido) }}
                        />
                      </div>
                    )}

                    <div className="preview-stats">
                      <span>{(contenidoEditado || contenidoGenerado.contenido).split(/\s+/).length} palabras</span>
                      <span className="categoria-badge">{CATEGORIAS.find(c => c.id === categoria)?.nombre}</span>
                    </div>

                    <div className="preview-actions">
                      <button className="btn-primary" onClick={() => guardarContenido('publicado')} disabled={guardando}>
                        {guardando ? '...' : '💾 Publicar'}
                      </button>
                      <button className="btn-secondary" onClick={() => guardarContenido('borrador')} disabled={guardando}>
                        Guardar borrador
                      </button>
                      <button className="btn-ghost" onClick={() => navigator.clipboard.writeText(contenidoEditado || contenidoGenerado.contenido)}>
                        📋 Copiar
                      </button>
                      <button className="btn-ghost" onClick={generarContenido} disabled={generando}>
                        🔄 Regenerar
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="preview-empty">
                    <span className="empty-icon">✨</span>
                    <p>El contenido generado aparecerá aquí</p>
                    <span className="empty-hint">Completá el formulario y generá con IA</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </main>

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400&display=swap');

        .grimorio {
          min-height: 100vh;
          background: #0a0a0a;
          color: #FDF8F0;
          font-family: 'Inter', -apple-system, sans-serif;
        }

        /* Header */
        .header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px 40px;
          border-bottom: 1px solid rgba(212, 175, 55, 0.15);
          background: linear-gradient(180deg, rgba(20, 20, 20, 0.95) 0%, rgba(10, 10, 10, 0.98) 100%);
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .back-link {
          color: rgba(212, 175, 55, 0.6);
          text-decoration: none;
          font-size: 14px;
          transition: color 0.3s;
        }

        .back-link:hover { color: #d4af37; }

        /* Admin Tabs */
        .admin-tabs {
          display: flex;
          gap: 5px;
          padding: 0 40px;
          background: rgba(20, 20, 20, 0.95);
          border-bottom: 1px solid rgba(212, 175, 55, 0.1);
          overflow-x: auto;
        }

        .admin-tab {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 15px 25px;
          background: transparent;
          border: none;
          color: rgba(253, 248, 240, 0.5);
          font-family: 'Cinzel', serif;
          font-size: 13px;
          cursor: pointer;
          transition: all 0.3s;
          border-bottom: 2px solid transparent;
          white-space: nowrap;
        }

        .admin-tab:hover {
          color: rgba(253, 248, 240, 0.8);
          background: rgba(212, 175, 55, 0.05);
        }

        .admin-tab.active {
          color: #d4af37;
          border-bottom-color: #d4af37;
          background: rgba(212, 175, 55, 0.1);
        }

        .tab-icon { font-size: 16px; }
        .tab-name { letter-spacing: 1px; }

        /* Secciones adicionales */
        .seccion-semanal,
        .seccion-cursos,
        .seccion-regalos,
        .seccion-foro {
          padding: 40px;
          max-width: 1000px;
          margin: 0 auto;
        }

        .section-desc {
          color: rgba(253, 248, 240, 0.6);
          font-size: 15px;
          margin-bottom: 30px;
        }

        .semana-config,
        .foro-config,
        .regalo-form-admin,
        .curso-editor {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(212, 175, 55, 0.2);
          border-radius: 15px;
          padding: 25px;
          margin-bottom: 30px;
        }

        .config-row {
          display: flex;
          align-items: center;
          gap: 15px;
          margin-bottom: 15px;
        }

        .config-row label {
          color: rgba(253, 248, 240, 0.7);
          min-width: 150px;
        }

        .duende-name {
          color: #d4af37;
          font-weight: 500;
        }

        .tipos-checkboxes,
        .config-options,
        .regalo-options {
          display: flex;
          flex-wrap: wrap;
          gap: 15px;
        }

        .tipos-checkboxes label,
        .config-options label,
        .regalo-options label {
          display: flex;
          align-items: center;
          gap: 8px;
          color: rgba(253, 248, 240, 0.8);
          font-size: 14px;
          cursor: pointer;
        }

        .tipos-checkboxes input,
        .config-options input,
        .regalo-options input {
          accent-color: #d4af37;
        }

        .btn-generar-semana,
        .btn-publicar-semana,
        .btn-nuevo-curso,
        .btn-guardar-curso,
        .btn-otorgar,
        .btn-generar-respuesta {
          background: linear-gradient(135deg, #d4af37, #b8972e);
          color: #0a0a0a;
          border: none;
          padding: 15px 30px;
          border-radius: 8px;
          font-family: 'Cinzel', serif;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
        }

        .btn-generar-semana:hover,
        .btn-publicar-semana:hover,
        .btn-nuevo-curso:hover,
        .btn-guardar-curso:hover,
        .btn-otorgar:hover,
        .btn-generar-respuesta:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 20px rgba(212, 175, 55, 0.3);
        }

        .btn-generar-semana:disabled,
        .btn-generar-respuesta:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        .semana-preview {
          margin-top: 30px;
        }

        .semana-preview h3 {
          color: #d4af37;
          font-family: 'Cinzel', serif;
          margin-bottom: 20px;
        }

        .dias-grid {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 10px;
          margin-bottom: 20px;
        }

        .dia-card {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(212, 175, 55, 0.15);
          border-radius: 10px;
          padding: 15px 10px;
          text-align: center;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .dia-nombre {
          font-family: 'Cinzel', serif;
          font-size: 11px;
          letter-spacing: 1px;
          color: #d4af37;
        }

        .dia-tipo { font-size: 24px; }

        .dia-titulo {
          font-size: 12px;
          color: rgba(253, 248, 240, 0.7);
          line-height: 1.3;
        }

        .dia-estado {
          font-size: 10px;
          padding: 3px 8px;
          border-radius: 10px;
          background: rgba(212, 175, 55, 0.2);
          color: #d4af37;
        }

        .cursos-actions {
          margin-bottom: 20px;
        }

        .cursos-list h3,
        .regalos-historial h3,
        .foro-posts-pendientes h3,
        .foro-generar h3 {
          color: #d4af37;
          font-family: 'Cinzel', serif;
          font-size: 16px;
          margin-bottom: 15px;
        }

        .curso-lecciones {
          margin: 20px 0;
          padding: 15px;
          background: rgba(0, 0, 0, 0.3);
          border-radius: 10px;
        }

        .curso-lecciones h4 {
          color: rgba(253, 248, 240, 0.8);
          font-size: 14px;
          margin-bottom: 10px;
        }

        .btn-add-leccion {
          background: rgba(212, 175, 55, 0.2);
          border: 1px dashed rgba(212, 175, 55, 0.4);
          color: #d4af37;
          padding: 10px 20px;
          border-radius: 8px;
          cursor: pointer;
          font-size: 13px;
        }

        .curso-actions {
          display: flex;
          gap: 10px;
          margin-top: 20px;
        }

        .btn-cancelar {
          background: transparent;
          border: 1px solid rgba(253, 248, 240, 0.3);
          color: rgba(253, 248, 240, 0.7);
          padding: 12px 25px;
          border-radius: 8px;
          cursor: pointer;
        }

        @media (max-width: 800px) {
          .dias-grid {
            grid-template-columns: repeat(4, 1fr);
          }

          .admin-tabs {
            padding: 0 15px;
          }

          .admin-tab {
            padding: 12px 15px;
            font-size: 12px;
          }

          .tab-name {
            display: none;
          }
        }

        .divider {
          width: 1px;
          height: 24px;
          background: rgba(212, 175, 55, 0.2);
        }

        .header h1 {
          font-family: 'Cinzel', serif;
          font-size: 26px;
          font-weight: 500;
          background: linear-gradient(135deg, #d4af37 0%, #f4e4a6 50%, #d4af37 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin: 0;
        }

        .btn-historial {
          padding: 12px 24px;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s;
          background: rgba(0, 0, 0, 0.4);
          border: 1px solid rgba(212, 175, 55, 0.2);
          color: rgba(212, 175, 55, 0.7);
        }

        .btn-historial:hover {
          border-color: rgba(212, 175, 55, 0.5);
          color: #d4af37;
        }

        .btn-historial.active {
          background: rgba(212, 175, 55, 0.15);
          border-color: rgba(212, 175, 55, 0.4);
          color: #d4af37;
        }

        /* Info Bar */
        .info-bar {
          display: flex;
          gap: 30px;
          padding: 14px 40px;
          background: rgba(0, 0, 0, 0.3);
          border-bottom: 1px solid rgba(212, 175, 55, 0.08);
        }

        .info-item {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 13px;
          color: rgba(253, 248, 240, 0.6);
        }

        .info-item strong { color: #d4af37; }

        .duende-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          border: 2px solid rgba(212, 175, 55, 0.4);
          object-fit: cover;
        }

        .luna-icon { font-size: 18px; }

        .celebracion { color: rgba(212, 175, 55, 0.8); }

        /* Main Content */
        .main-content {
          max-width: 1400px;
          margin: 0 auto;
          padding: 40px;
        }

        .generator-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 40px;
        }

        .left-column {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .right-column {
          position: sticky;
          top: 40px;
          align-self: start;
        }

        /* Cards */
        .card {
          background: linear-gradient(180deg, rgba(30, 28, 25, 0.9) 0%, rgba(20, 18, 15, 0.95) 100%);
          border: 1px solid rgba(212, 175, 55, 0.15);
          border-radius: 20px;
          padding: 28px;
          backdrop-filter: blur(10px);
        }

        .card-title {
          font-family: 'Cinzel', serif;
          font-size: 18px;
          font-weight: 500;
          color: #d4af37;
          margin: 0 0 24px 0;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .step {
          color: rgba(212, 175, 55, 0.4);
          font-size: 14px;
        }

        /* Tipos Grid */
        .tipos-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
        }

        .tipo-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 20px 12px;
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(212, 175, 55, 0.15);
          border-radius: 16px;
          cursor: pointer;
          transition: all 0.3s;
          color: rgba(253, 248, 240, 0.7);
        }

        .tipo-btn:hover {
          border-color: rgba(212, 175, 55, 0.4);
          background: rgba(212, 175, 55, 0.05);
        }

        .tipo-btn.active {
          background: linear-gradient(180deg, rgba(212, 175, 55, 0.2) 0%, rgba(212, 175, 55, 0.08) 100%);
          border-color: rgba(212, 175, 55, 0.5);
          box-shadow: 0 0 30px rgba(212, 175, 55, 0.15);
        }

        .tipo-icon {
          font-size: 28px;
          margin-bottom: 10px;
          transition: transform 0.3s;
        }

        .tipo-btn:hover .tipo-icon,
        .tipo-btn.active .tipo-icon {
          transform: scale(1.15);
        }

        .tipo-nombre {
          font-size: 13px;
          font-weight: 500;
          color: rgba(253, 248, 240, 0.9);
          margin-bottom: 4px;
        }

        .tipo-btn.active .tipo-nombre {
          color: #d4af37;
        }

        .tipo-desc {
          font-size: 11px;
          color: rgba(253, 248, 240, 0.4);
          text-align: center;
        }

        /* Form Fields */
        .form-fields {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .form-field {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .form-field label {
          font-size: 12px;
          font-weight: 500;
          color: rgba(212, 175, 55, 0.8);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .form-field input[type="text"],
        .form-field textarea,
        .form-field select {
          width: 100%;
          background: rgba(0, 0, 0, 0.4);
          border: 1px solid rgba(212, 175, 55, 0.2);
          border-radius: 12px;
          padding: 14px 16px;
          font-size: 14px;
          color: #FDF8F0;
          transition: all 0.3s;
          font-family: inherit;
        }

        .form-field input:focus,
        .form-field textarea:focus,
        .form-field select:focus {
          outline: none;
          border-color: rgba(212, 175, 55, 0.5);
          box-shadow: 0 0 20px rgba(212, 175, 55, 0.1);
        }

        .form-field input::placeholder,
        .form-field textarea::placeholder {
          color: rgba(212, 175, 55, 0.3);
        }

        .form-field textarea {
          resize: none;
          min-height: 70px;
        }

        .form-field select {
          cursor: pointer;
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23d4af37'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 14px center;
          background-size: 16px;
          padding-right: 44px;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        /* Checkboxes */
        .checkbox-group {
          display: flex;
          flex-direction: column;
          gap: 14px;
          margin-top: 8px;
        }

        .checkbox-label {
          display: flex;
          align-items: center;
          gap: 12px;
          cursor: pointer;
          font-size: 14px;
          color: rgba(253, 248, 240, 0.8);
          user-select: none;
        }

        .checkbox-label input {
          display: none;
        }

        .checkmark {
          width: 22px;
          height: 22px;
          border: 2px solid rgba(212, 175, 55, 0.4);
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s;
          flex-shrink: 0;
        }

        .checkbox-label:hover .checkmark {
          border-color: rgba(212, 175, 55, 0.7);
        }

        .checkbox-label input:checked + .checkmark {
          background: linear-gradient(135deg, #d4af37, #b8972e);
          border-color: #d4af37;
        }

        .checkbox-label input:checked + .checkmark::after {
          content: '✓';
          color: #0a0a0a;
          font-size: 14px;
          font-weight: bold;
        }

        .checkbox-label input:disabled + .checkmark {
          opacity: 0.4;
        }

        /* Range Slider */
        .range-slider {
          width: 100%;
          height: 6px;
          border-radius: 3px;
          background: rgba(0, 0, 0, 0.5);
          appearance: none;
          cursor: pointer;
        }

        .range-slider::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          background: linear-gradient(135deg, #d4af37, #b8972e);
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 2px 10px rgba(212, 175, 55, 0.4);
          transition: all 0.2s;
        }

        .range-slider::-webkit-slider-thumb:hover {
          transform: scale(1.15);
          box-shadow: 0 4px 20px rgba(212, 175, 55, 0.5);
        }

        /* Generate Button */
        .btn-generar {
          width: 100%;
          padding: 18px 32px;
          font-family: 'Cinzel', serif;
          font-size: 18px;
          font-weight: 500;
          border: none;
          border-radius: 16px;
          cursor: pointer;
          transition: all 0.4s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          background: linear-gradient(135deg, #d4af37 0%, #c9a227 50%, #d4af37 100%);
          color: #0a0a0a;
          box-shadow: 0 4px 30px rgba(212, 175, 55, 0.3);
        }

        .btn-generar:hover:not(.disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 40px rgba(212, 175, 55, 0.4);
        }

        .btn-generar.disabled {
          background: rgba(212, 175, 55, 0.15);
          color: rgba(212, 175, 55, 0.4);
          cursor: not-allowed;
          box-shadow: none;
        }

        .spinner {
          width: 20px;
          height: 20px;
          border: 2px solid rgba(10, 10, 10, 0.3);
          border-top-color: #0a0a0a;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        /* Messages */
        .msg {
          padding: 14px 18px;
          border-radius: 12px;
          font-size: 14px;
        }

        .msg.error {
          background: rgba(220, 53, 69, 0.15);
          border: 1px solid rgba(220, 53, 69, 0.3);
          color: #ff6b7a;
        }

        .msg.success {
          background: rgba(40, 167, 69, 0.15);
          border: 1px solid rgba(40, 167, 69, 0.3);
          color: #6bff8a;
        }

        /* Preview Card */
        .preview-card {
          min-height: 500px;
        }

        .preview-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
          padding-bottom: 16px;
          border-bottom: 1px solid rgba(212, 175, 55, 0.1);
        }

        .preview-header .card-title {
          margin: 0;
        }

        .btn-edit {
          background: transparent;
          border: 1px solid rgba(212, 175, 55, 0.3);
          color: rgba(212, 175, 55, 0.7);
          padding: 8px 16px;
          border-radius: 8px;
          font-size: 13px;
          cursor: pointer;
          transition: all 0.3s;
        }

        .btn-edit:hover {
          border-color: #d4af37;
          color: #d4af37;
        }

        .preview-empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 80px 40px;
          text-align: center;
        }

        .empty-icon {
          font-size: 60px;
          opacity: 0.2;
          margin-bottom: 20px;
        }

        .preview-empty p {
          font-family: 'Cormorant Garamond', serif;
          font-size: 20px;
          color: rgba(253, 248, 240, 0.4);
          margin: 0 0 8px 0;
        }

        .empty-hint {
          font-size: 14px;
          color: rgba(253, 248, 240, 0.2);
        }

        .preview-content {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .preview-meta {
          display: flex;
          align-items: center;
          gap: 14px;
          padding-bottom: 16px;
          border-bottom: 1px solid rgba(212, 175, 55, 0.1);
        }

        .preview-avatar {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          border: 2px solid rgba(212, 175, 55, 0.4);
          object-fit: cover;
        }

        .tipo-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(212, 175, 55, 0.15);
          color: #d4af37;
          padding: 6px 14px;
          border-radius: 20px;
          font-size: 12px;
        }

        .autor {
          font-size: 12px;
          color: rgba(253, 248, 240, 0.5);
          margin: 6px 0 0 0;
        }

        .preview-body {
          max-height: 400px;
          overflow-y: auto;
          padding-right: 10px;
        }

        .preview-titulo {
          font-family: 'Cinzel', serif;
          font-size: 22px;
          color: #d4af37;
          margin: 0 0 20px 0;
        }

        .preview-text {
          font-family: 'Cormorant Garamond', serif;
          font-size: 17px;
          line-height: 1.8;
          color: rgba(253, 248, 240, 0.85);
        }

        .preview-text h1, .preview-text h2, .preview-text h3 {
          font-family: 'Cinzel', serif;
          color: #d4af37;
          margin: 24px 0 12px 0;
        }

        .preview-text p {
          margin-bottom: 16px;
        }

        .preview-text strong {
          color: #f4e4a6;
        }

        .editor {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .editor-titulo {
          background: rgba(0, 0, 0, 0.4);
          border: 1px solid rgba(212, 175, 55, 0.2);
          border-radius: 12px;
          padding: 14px 16px;
          font-family: 'Cinzel', serif;
          font-size: 18px;
          color: #FDF8F0;
        }

        .editor-titulo:focus {
          outline: none;
          border-color: rgba(212, 175, 55, 0.5);
        }

        .editor-texto {
          background: rgba(0, 0, 0, 0.4);
          border: 1px solid rgba(212, 175, 55, 0.2);
          border-radius: 12px;
          padding: 14px 16px;
          font-family: 'Monaco', 'Menlo', monospace;
          font-size: 13px;
          line-height: 1.6;
          color: rgba(253, 248, 240, 0.9);
          resize: none;
          min-height: 350px;
        }

        .editor-texto:focus {
          outline: none;
          border-color: rgba(212, 175, 55, 0.5);
        }

        .editor-tip {
          font-size: 12px;
          color: rgba(212, 175, 55, 0.4);
          margin: 0;
        }

        .preview-stats {
          display: flex;
          align-items: center;
          gap: 16px;
          padding-top: 16px;
          border-top: 1px solid rgba(212, 175, 55, 0.1);
          font-size: 13px;
          color: rgba(253, 248, 240, 0.4);
        }

        .categoria-badge {
          background: rgba(212, 175, 55, 0.1);
          color: rgba(212, 175, 55, 0.7);
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 11px;
        }

        .preview-actions {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        .btn-primary {
          background: linear-gradient(135deg, #d4af37, #b8972e);
          border: none;
          color: #0a0a0a;
          padding: 14px 20px;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s;
        }

        .btn-primary:hover:not(:disabled) {
          box-shadow: 0 4px 20px rgba(212, 175, 55, 0.4);
        }

        .btn-primary:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .btn-secondary {
          background: rgba(0, 0, 0, 0.4);
          border: 1px solid rgba(212, 175, 55, 0.3);
          color: rgba(212, 175, 55, 0.8);
          padding: 14px 20px;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s;
        }

        .btn-secondary:hover:not(:disabled) {
          border-color: #d4af37;
          color: #d4af37;
        }

        .btn-secondary:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .btn-ghost {
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(212, 175, 55, 0.15);
          color: rgba(212, 175, 55, 0.6);
          padding: 14px 20px;
          border-radius: 12px;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.3s;
        }

        .btn-ghost:hover:not(:disabled) {
          border-color: rgba(212, 175, 55, 0.4);
          color: rgba(212, 175, 55, 0.9);
        }

        .btn-ghost:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        /* Historial */
        .historial-view {
          max-width: 900px;
        }

        .section-title {
          font-family: 'Cinzel', serif;
          font-size: 24px;
          color: #d4af37;
          margin: 0 0 30px 0;
        }

        .empty-state {
          color: rgba(253, 248, 240, 0.4);
          text-align: center;
          padding: 60px 20px;
        }

        .historial-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .historial-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: rgba(30, 28, 25, 0.8);
          border: 1px solid rgba(212, 175, 55, 0.1);
          border-radius: 16px;
          padding: 20px 24px;
          transition: all 0.3s;
        }

        .historial-item:hover {
          border-color: rgba(212, 175, 55, 0.3);
        }

        .historial-left {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .historial-avatar {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          border: 2px solid rgba(212, 175, 55, 0.3);
          object-fit: cover;
        }

        .historial-left h3 {
          font-size: 16px;
          color: #FDF8F0;
          margin: 0 0 4px 0;
        }

        .historial-left p {
          font-size: 13px;
          color: rgba(253, 248, 240, 0.5);
          margin: 0;
        }

        .historial-right {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .fecha {
          font-size: 13px;
          color: rgba(253, 248, 240, 0.4);
        }

        .estado {
          font-size: 11px;
          padding: 6px 14px;
          border-radius: 20px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .estado.publicado {
          background: rgba(40, 167, 69, 0.2);
          color: #6bff8a;
        }

        .estado.borrador {
          background: rgba(212, 175, 55, 0.15);
          color: rgba(212, 175, 55, 0.7);
        }

        /* Scrollbar */
        .preview-body::-webkit-scrollbar {
          width: 6px;
        }

        .preview-body::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.2);
          border-radius: 3px;
        }

        .preview-body::-webkit-scrollbar-thumb {
          background: rgba(212, 175, 55, 0.3);
          border-radius: 3px;
        }

        .preview-body::-webkit-scrollbar-thumb:hover {
          background: rgba(212, 175, 55, 0.5);
        }

        /* Responsive */
        @media (max-width: 1200px) {
          .generator-grid {
            grid-template-columns: 1fr;
          }

          .right-column {
            position: static;
          }
        }

        @media (max-width: 768px) {
          .header {
            flex-direction: column;
            gap: 16px;
            padding: 20px;
          }

          .main-content {
            padding: 20px;
          }

          .tipos-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .form-row {
            grid-template-columns: 1fr;
          }

          .info-bar {
            flex-wrap: wrap;
            padding: 14px 20px;
          }
        }
      `}</style>
    </div>
  );
}

// Formatear markdown a HTML
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
