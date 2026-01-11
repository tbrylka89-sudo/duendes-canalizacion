'use client';
import { useState, useEffect, useCallback } from 'react';

// ═══════════════════════════════════════════════════════════════
// ESTUDIO UNIFICADO - CALENDARIO + CONTENIDO + CÍRCULO + GUARDIANES
// Todo conectado: planificás, creás, publicás y canalizás desde acá
// ═══════════════════════════════════════════════════════════════

const COLORS = {
  bg: '#1a1a2e',
  bgCard: '#16213e',
  bgElevated: '#1f3460',
  bgHover: '#2a4a7a',
  border: '#2a3f5f',
  borderLight: '#3a5070',
  text: '#ffffff',
  textMuted: '#9ca3af',
  textDim: '#6b7280',
  gold: '#D4A853',
  goldLight: '#E8C97D',
  purple: '#8B5CF6',
  pink: '#EC4899',
  cyan: '#06B6D4',
  emerald: '#10B981',
  orange: '#F97316',
  amber: '#F59E0B',
  teal: '#14B8A6',
  success: '#22c55e',
  error: '#ef4444',
};

const MESES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

const CATEGORIAS = [
  { id: 'cosmos', nombre: 'Cosmos y Luna', icono: '🌙', color: '#8B5CF6' },
  { id: 'duendes', nombre: 'Mundo Duende', icono: '🧙', color: '#F59E0B' },
  { id: 'diy', nombre: 'DIY Mágico', icono: '✂️', color: '#EC4899' },
  { id: 'esoterico', nombre: 'Esotérico', icono: '🔮', color: '#A78BFA' },
  { id: 'sanacion', nombre: 'Sanación', icono: '💚', color: '#10B981' },
  { id: 'rituales', nombre: 'Rituales', icono: '🕯️', color: '#F97316' },
];

const TIPOS = [
  { id: 'articulo', nombre: 'Artículo', icono: '📝' },
  { id: 'ritual', nombre: 'Ritual', icono: '🕯️' },
  { id: 'guia', nombre: 'Guía', icono: '📖' },
  { id: 'meditacion', nombre: 'Meditación', icono: '🧘' },
  { id: 'reflexion', nombre: 'Reflexión', icono: '💭' },
  { id: 'historia', nombre: 'Historia', icono: '📚' },
];

const ESTRUCTURA_SEMANAL = {
  0: { tipo: 'ritual', categoria: 'rituales', nombre: 'Ritual Semanal' },
  1: { tipo: 'meditacion', categoria: 'sanacion', nombre: 'Meditación Guiada' },
  2: { tipo: 'articulo', categoria: 'esoterico', nombre: 'Sabiduría Esotérica' },
  3: { tipo: 'guia', categoria: 'diy', nombre: 'DIY Mágico' },
  4: { tipo: 'historia', categoria: 'duendes', nombre: 'Historias de Duendes' },
  5: { tipo: 'reflexion', categoria: 'cosmos', nombre: 'Conexión Lunar' },
  6: { tipo: 'articulo', categoria: 'sanacion', nombre: 'Sanación y Bienestar' },
};

// ═══════════════════════════════════════════════════════════════
// COMPONENTE PRINCIPAL UNIFICADO
// ═══════════════════════════════════════════════════════════════

export default function EstudioUnificado() {
  // Tab activo
  const [tab, setTab] = useState('calendario');

  // Estados compartidos
  const [mes, setMes] = useState(new Date().getMonth() + 1);
  const [año, setAño] = useState(new Date().getFullYear());
  const [contenidos, setContenidos] = useState([]);
  const [contenidoSeleccionado, setContenidoSeleccionado] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingDia, setLoadingDia] = useState(null);
  const [mensaje, setMensaje] = useState(null);
  const [guardianes, setGuardianes] = useState([]);
  const [guardianSeleccionado, setGuardianSeleccionado] = useState(null);

  // Estados del editor
  const [editorContenido, setEditorContenido] = useState({
    titulo: '',
    extracto: '',
    categoria: 'cosmos',
    tipo: 'articulo',
    imagen: null,
    secciones: {
      intro: '',
      desarrollo: '',
      practica: '',
      cierre: ''
    }
  });
  const [temaInicial, setTemaInicial] = useState('');
  const [instruccionExtra, setInstruccionExtra] = useState('');

  // Cargar contenidos
  useEffect(() => {
    cargarContenidos();
    cargarGuardianes();
  }, [mes, año]);

  const mostrarMensaje = (texto, tipo = 'ok') => {
    setMensaje({ texto, tipo });
    setTimeout(() => setMensaje(null), 4000);
  };

  const cargarContenidos = async () => {
    try {
      const res = await fetch(`/api/admin/circulo/contenidos?mes=${mes}&año=${año}`);
      const data = await res.json();
      if (data.success) setContenidos(data.contenidos || []);
    } catch (e) {
      console.error('Error cargando:', e);
    }
  };

  const cargarGuardianes = async () => {
    try {
      const res = await fetch('/api/admin/productos?categoria=guardianes');
      const data = await res.json();
      if (data.success) setGuardianes(data.productos || []);
    } catch (e) {
      console.error('Error cargando guardianes:', e);
    }
  };

  // Buscar contenido por día
  const getContenidoDia = (dia) => contenidos.find(c => c.dia === dia);

  // Generar mes completo
  const generarMes = async () => {
    if (loading) return;
    setLoading(true);
    mostrarMensaje('Generando contenido del mes... (esto tarda unos minutos)', 'info');

    try {
      const res = await fetch('/api/admin/circulo/generar-mes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mes, año })
      });
      const data = await res.json();

      if (data.success) {
        setContenidos(data.contenidos || []);
        mostrarMensaje(`¡Listo! ${data.contenidos?.length || 0} contenidos generados`);
      } else {
        mostrarMensaje(data.error || 'Error al generar', 'error');
      }
    } catch (e) {
      mostrarMensaje(e.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  // Generar día individual
  const generarDia = async (dia, soloImagen = false) => {
    setLoadingDia(dia);
    mostrarMensaje(soloImagen ? 'Generando imagen...' : 'Generando contenido + imagen...', 'info');

    try {
      const res = await fetch('/api/admin/circulo/generar-dia', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dia, mes, año, soloImagen, instruccionExtra })
      });
      const data = await res.json();

      if (data.success && data.contenido) {
        setContenidos(prev => {
          const filtered = prev.filter(c => c.dia !== dia);
          return [...filtered, data.contenido];
        });
        if (contenidoSeleccionado?.dia === dia) {
          setContenidoSeleccionado(data.contenido);
        }
        mostrarMensaje(soloImagen ? 'Imagen generada' : 'Contenido + imagen generados');
      } else {
        mostrarMensaje(data.error || 'Error', 'error');
      }
    } catch (e) {
      mostrarMensaje(e.message, 'error');
    } finally {
      setLoadingDia(null);
    }
  };

  // Publicar contenido
  const publicar = async (contenido) => {
    try {
      const textoCompleto = contenido.secciones
        ? `${contenido.secciones.intro}\n\n${contenido.secciones.desarrollo}\n\n${contenido.secciones.practica}\n\n${contenido.secciones.cierre}`
        : contenido.contenido || '';

      const res = await fetch('/api/circulo/contenido', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          titulo: contenido.titulo,
          contenido: textoCompleto,
          extracto: contenido.extracto,
          categoria: contenido.categoria,
          tipo: contenido.tipo,
          imagen: contenido.imagen
        })
      });

      const data = await res.json();
      if (data.success) {
        await fetch('/api/admin/circulo/contenidos', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ dia: contenido.dia, mes: contenido.mes, año: contenido.año, estado: 'publicado' })
        });

        setContenidos(prev => prev.map(c => c.dia === contenido.dia ? { ...c, estado: 'publicado' } : c));
        mostrarMensaje('¡Publicado en El Círculo!');
      }
    } catch (e) {
      mostrarMensaje(e.message, 'error');
    }
  };

  // Generar contenido desde tema (Editor)
  const generarDesdeEditor = async () => {
    if (!temaInicial.trim()) return;
    setLoading(true);
    mostrarMensaje('Generando contenido...', 'info');

    try {
      const res = await fetch('/api/admin/contenido/generar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tema: temaInicial,
          categoria: editorContenido.categoria,
          tipo: editorContenido.tipo,
          instruccionExtra
        })
      });
      const data = await res.json();

      if (data.success) {
        setEditorContenido(prev => ({
          ...prev,
          titulo: data.contenido.titulo,
          extracto: data.contenido.extracto,
          secciones: data.contenido.secciones || prev.secciones
        }));
        mostrarMensaje('¡Contenido generado!');
      } else {
        mostrarMensaje(data.error || 'Error', 'error');
      }
    } catch (e) {
      mostrarMensaje(e.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  // Generar desde Guardián
  const generarDesdeGuardian = async () => {
    if (!guardianSeleccionado) return;
    setLoading(true);
    mostrarMensaje('Canalizando mensaje del guardián...', 'info');

    try {
      const res = await fetch('/api/admin/personajes/canalizar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productoId: guardianSeleccionado.id,
          tipo: editorContenido.tipo,
          instruccionExtra
        })
      });
      const data = await res.json();

      if (data.success) {
        setEditorContenido(prev => ({
          ...prev,
          titulo: data.contenido.titulo,
          extracto: data.contenido.extracto,
          categoria: 'duendes',
          secciones: data.contenido.secciones || prev.secciones
        }));
        mostrarMensaje('¡Mensaje del guardián canalizado!');
        setTab('editor'); // Ir al editor para revisar
      } else {
        mostrarMensaje(data.error || 'Error', 'error');
      }
    } catch (e) {
      mostrarMensaje(e.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  // Abrir contenido en editor
  const abrirEnEditor = (contenido) => {
    setEditorContenido({
      titulo: contenido.titulo || '',
      extracto: contenido.extracto || '',
      categoria: contenido.categoria || 'cosmos',
      tipo: contenido.tipo || 'articulo',
      imagen: contenido.imagen || null,
      secciones: contenido.secciones || { intro: '', desarrollo: '', practica: '', cierre: '' }
    });
    setContenidoSeleccionado(contenido);
    setTab('editor');
  };

  // Generar calendario
  const diasEnMes = new Date(año, mes, 0).getDate();
  const primerDia = new Date(año, mes - 1, 1).getDay();
  const calendario = [];
  for (let i = 0; i < primerDia; i++) calendario.push(null);
  for (let d = 1; d <= diasEnMes; d++) calendario.push(d);

  // ═══════════════════════════════════════════════════════════════
  // ESTILOS COMUNES
  // ═══════════════════════════════════════════════════════════════

  const estilos = {
    container: { minHeight: '100vh', background: COLORS.bg, color: COLORS.text, padding: '24px' },
    header: { marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 },
    titulo: { fontSize: 28, fontWeight: 'bold', marginBottom: 4 },
    subtitulo: { color: COLORS.textMuted },
    tabs: { display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' },
    tab: (activo) => ({
      padding: '12px 24px',
      background: activo ? COLORS.gold : COLORS.bgCard,
      border: `1px solid ${activo ? COLORS.gold : COLORS.border}`,
      borderRadius: 10,
      color: activo ? '#000' : COLORS.text,
      cursor: 'pointer',
      fontSize: 15,
      fontWeight: activo ? 600 : 400,
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      transition: 'all 0.2s'
    }),
    card: { background: COLORS.bgCard, border: `1px solid ${COLORS.border}`, borderRadius: 12, padding: 20 },
    btn: (variante = 'primary') => ({
      padding: '12px 24px',
      background: variante === 'primary' ? `linear-gradient(135deg, ${COLORS.gold}, ${COLORS.amber})` : COLORS.bgElevated,
      border: variante === 'primary' ? 'none' : `1px solid ${COLORS.border}`,
      borderRadius: 10,
      color: variante === 'primary' ? '#000' : COLORS.text,
      cursor: 'pointer',
      fontSize: 14,
      fontWeight: 600
    }),
    input: {
      width: '100%',
      padding: 14,
      background: COLORS.bgElevated,
      border: `1px solid ${COLORS.border}`,
      borderRadius: 10,
      color: COLORS.text,
      fontSize: 15
    },
    textarea: {
      width: '100%',
      padding: 14,
      background: COLORS.bgElevated,
      border: `1px solid ${COLORS.border}`,
      borderRadius: 10,
      color: COLORS.text,
      fontSize: 15,
      resize: 'vertical',
      minHeight: 150,
      lineHeight: 1.6
    },
    select: {
      padding: 12,
      background: COLORS.bgElevated,
      border: `1px solid ${COLORS.border}`,
      borderRadius: 10,
      color: COLORS.text,
      fontSize: 14,
      cursor: 'pointer'
    },
    label: { display: 'block', marginBottom: 8, color: COLORS.textMuted, fontSize: 14 },
    grid: (cols) => ({ display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: 16 }),
  };

  return (
    <div style={estilos.container}>
      {/* Mensaje */}
      {mensaje && (
        <div style={{
          position: 'fixed', top: 20, right: 20, padding: '14px 24px', zIndex: 1000,
          background: mensaje.tipo === 'error' ? COLORS.error : mensaje.tipo === 'info' ? COLORS.cyan : COLORS.success,
          borderRadius: 10, fontWeight: 500, boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
        }}>
          {mensaje.texto}
        </div>
      )}

      {/* Header */}
      <div style={estilos.header}>
        <div>
          <h1 style={estilos.titulo}>🎨 Estudio Creativo</h1>
          <p style={estilos.subtitulo}>Calendario + Editor + Círculo + Guardianes - Todo conectado</p>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <span style={{ padding: '8px 16px', background: `${COLORS.purple}22`, border: `1px solid ${COLORS.purple}`, borderRadius: 8, color: COLORS.purple }}>
            {contenidos.length} generados
          </span>
          <span style={{ padding: '8px 16px', background: `${COLORS.success}22`, border: `1px solid ${COLORS.success}`, borderRadius: 8, color: COLORS.success }}>
            {contenidos.filter(c => c.estado === 'publicado').length} publicados
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div style={estilos.tabs}>
        <button style={estilos.tab(tab === 'calendario')} onClick={() => setTab('calendario')}>
          📅 Calendario
        </button>
        <button style={estilos.tab(tab === 'editor')} onClick={() => setTab('editor')}>
          ✍️ Editor
        </button>
        <button style={estilos.tab(tab === 'circulo')} onClick={() => setTab('circulo')}>
          🌙 Círculo
        </button>
        <button style={estilos.tab(tab === 'guardianes')} onClick={() => setTab('guardianes')}>
          🧙 Guardianes
        </button>
      </div>

      {/* ════════════════════════════════════════════════════════════ */}
      {/* TAB: CALENDARIO */}
      {/* ════════════════════════════════════════════════════════════ */}
      {tab === 'calendario' && (
        <div>
          {/* Controles de mes */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <button onClick={() => { if (mes === 1) { setMes(12); setAño(año - 1); } else setMes(mes - 1); }}
                style={{ ...estilos.btn('secondary'), padding: '10px 18px', fontSize: 18 }}>←</button>
              <h2 style={{ fontSize: 24, fontWeight: 'bold', minWidth: 200, textAlign: 'center' }}>
                {MESES[mes - 1]} {año}
              </h2>
              <button onClick={() => { if (mes === 12) { setMes(1); setAño(año + 1); } else setMes(mes + 1); }}
                style={{ ...estilos.btn('secondary'), padding: '10px 18px', fontSize: 18 }}>→</button>
            </div>

            <button onClick={generarMes} disabled={loading} style={estilos.btn()}>
              {loading ? '⏳ Generando...' : '✨ Generar mes completo'}
            </button>
          </div>

          {/* Días de la semana */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4, marginBottom: 4 }}>
            {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(d => (
              <div key={d} style={{ padding: 8, textAlign: 'center', color: COLORS.textDim, fontSize: 12, fontWeight: 600 }}>{d}</div>
            ))}
          </div>

          {/* Calendario */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 6, marginBottom: 30 }}>
            {calendario.map((dia, i) => {
              if (!dia) return <div key={i} style={{ background: COLORS.bgCard, borderRadius: 8, minHeight: 110 }} />;

              const contenido = getContenidoDia(dia);
              const esHoy = dia === new Date().getDate() && mes === new Date().getMonth() + 1 && año === new Date().getFullYear();
              const estructura = ESTRUCTURA_SEMANAL[new Date(año, mes - 1, dia).getDay()];

              return (
                <div key={i}
                  onClick={() => contenido && abrirEnEditor(contenido)}
                  style={{
                    background: esHoy ? `${COLORS.gold}15` : COLORS.bgCard,
                    border: `1px solid ${esHoy ? COLORS.gold : contenido?.estado === 'publicado' ? COLORS.success : contenido ? COLORS.purple : COLORS.border}`,
                    borderRadius: 10, padding: 10, minHeight: 110,
                    cursor: contenido ? 'pointer' : 'default',
                    position: 'relative',
                    transition: 'all 0.2s'
                  }}>

                  {/* Estado indicator */}
                  <div style={{
                    position: 'absolute', top: 8, right: 8,
                    width: 8, height: 8, borderRadius: '50%',
                    background: contenido?.estado === 'publicado' ? COLORS.success : contenido ? COLORS.purple : COLORS.border
                  }} />

                  <div style={{ fontWeight: esHoy ? 700 : 500, color: esHoy ? COLORS.gold : 'white', marginBottom: 4, fontSize: 14 }}>
                    {dia}
                  </div>

                  <div style={{ fontSize: 10, color: COLORS.textDim, marginBottom: 6 }}>
                    {estructura?.nombre}
                  </div>

                  {contenido ? (
                    <div>
                      {contenido.imagen && (
                        <div style={{ fontSize: 9, color: COLORS.success, marginBottom: 4 }}>🖼️</div>
                      )}
                      <div style={{ fontSize: 11, color: '#e5e7eb', lineHeight: 1.3, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                        {contenido.titulo}
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={(e) => { e.stopPropagation(); generarDia(dia); }}
                      disabled={loadingDia === dia}
                      style={{
                        fontSize: 10, padding: '4px 8px', marginTop: 4,
                        background: COLORS.bgElevated, border: `1px solid ${COLORS.border}`,
                        borderRadius: 4, color: COLORS.textMuted, cursor: 'pointer'
                      }}>
                      {loadingDia === dia ? '...' : '+ Generar'}
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          {/* Leyenda */}
          <div style={{ display: 'flex', gap: 20, padding: '12px 16px', background: COLORS.bgCard, borderRadius: 8, flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: COLORS.textMuted }}>
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: COLORS.success }} /> Publicado
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: COLORS.textMuted }}>
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: COLORS.purple }} /> Generado
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: COLORS.textMuted }}>
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: COLORS.border }} /> Sin generar
            </div>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════ */}
      {/* TAB: EDITOR */}
      {/* ════════════════════════════════════════════════════════════ */}
      {tab === 'editor' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          {/* Panel izquierdo: Generación */}
          <div style={estilos.card}>
            <h3 style={{ marginBottom: 16, color: COLORS.gold }}>✨ Generar contenido</h3>

            <div style={{ marginBottom: 16 }}>
              <label style={estilos.label}>Tema o idea inicial</label>
              <input
                type="text"
                placeholder="Ej: Ritual de luna llena para abundancia"
                value={temaInicial}
                onChange={(e) => setTemaInicial(e.target.value)}
                style={estilos.input}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
              <div>
                <label style={estilos.label}>Categoría</label>
                <select value={editorContenido.categoria} onChange={(e) => setEditorContenido(prev => ({ ...prev, categoria: e.target.value }))} style={{ ...estilos.select, width: '100%' }}>
                  {CATEGORIAS.map(c => (
                    <option key={c.id} value={c.id}>{c.icono} {c.nombre}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={estilos.label}>Tipo</label>
                <select value={editorContenido.tipo} onChange={(e) => setEditorContenido(prev => ({ ...prev, tipo: e.target.value }))} style={{ ...estilos.select, width: '100%' }}>
                  {TIPOS.map(t => (
                    <option key={t.id} value={t.id}>{t.icono} {t.nombre}</option>
                  ))}
                </select>
              </div>
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={estilos.label}>Instrucción extra (opcional)</label>
              <textarea
                placeholder="Ej: Enfocate en mujeres jóvenes, usá un tono más informal..."
                value={instruccionExtra}
                onChange={(e) => setInstruccionExtra(e.target.value)}
                style={{ ...estilos.textarea, minHeight: 80 }}
              />
            </div>

            <button onClick={generarDesdeEditor} disabled={loading || !temaInicial.trim()} style={{ ...estilos.btn(), width: '100%' }}>
              {loading ? '⏳ Generando...' : '🪄 Generar contenido'}
            </button>
          </div>

          {/* Panel derecho: Edición */}
          <div style={estilos.card}>
            <h3 style={{ marginBottom: 16, color: COLORS.gold }}>📝 Editar contenido</h3>

            <div style={{ marginBottom: 16 }}>
              <label style={estilos.label}>Título</label>
              <input
                type="text"
                value={editorContenido.titulo}
                onChange={(e) => setEditorContenido(prev => ({ ...prev, titulo: e.target.value }))}
                style={estilos.input}
              />
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={estilos.label}>Extracto</label>
              <textarea
                value={editorContenido.extracto}
                onChange={(e) => setEditorContenido(prev => ({ ...prev, extracto: e.target.value }))}
                style={{ ...estilos.textarea, minHeight: 80 }}
              />
            </div>

            {['intro', 'desarrollo', 'practica', 'cierre'].map(seccion => (
              <div key={seccion} style={{ marginBottom: 16 }}>
                <label style={estilos.label}>{seccion.charAt(0).toUpperCase() + seccion.slice(1)}</label>
                <textarea
                  value={editorContenido.secciones[seccion]}
                  onChange={(e) => setEditorContenido(prev => ({
                    ...prev,
                    secciones: { ...prev.secciones, [seccion]: e.target.value }
                  }))}
                  style={{ ...estilos.textarea, minHeight: 120 }}
                />
              </div>
            ))}

            <div style={{ display: 'flex', gap: 12 }}>
              <button onClick={() => publicar(editorContenido)} style={{ ...estilos.btn(), flex: 1 }}>
                🚀 Publicar en Círculo
              </button>
              <button style={{ ...estilos.btn('secondary'), flex: 1 }}>
                💾 Guardar borrador
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════ */}
      {/* TAB: CÍRCULO */}
      {/* ════════════════════════════════════════════════════════════ */}
      {tab === 'circulo' && (
        <div>
          <div style={{ marginBottom: 20 }}>
            <h3 style={{ color: COLORS.gold, marginBottom: 8 }}>🌙 Contenidos del Círculo</h3>
            <p style={{ color: COLORS.textMuted }}>Todo el contenido generado para El Círculo</p>
          </div>

          {contenidos.length === 0 ? (
            <div style={{ ...estilos.card, textAlign: 'center', padding: 40 }}>
              <p style={{ fontSize: 48, marginBottom: 16 }}>🌙</p>
              <p style={{ color: COLORS.textMuted }}>No hay contenidos generados para este mes</p>
              <button onClick={generarMes} style={{ ...estilos.btn(), marginTop: 16 }}>
                ✨ Generar mes completo
              </button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
              {contenidos.sort((a, b) => a.dia - b.dia).map(c => (
                <div key={c.id} style={{ ...estilos.card, cursor: 'pointer' }} onClick={() => abrirEnEditor(c)}>
                  {c.imagen && (
                    <img src={c.imagen} alt="" style={{ width: '100%', height: 150, objectFit: 'cover', borderRadius: 8, marginBottom: 12 }} />
                  )}
                  <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                    <span style={{ padding: '4px 10px', background: `${COLORS.purple}22`, borderRadius: 6, fontSize: 11, color: COLORS.purple }}>
                      {c.categoria}
                    </span>
                    <span style={{
                      padding: '4px 10px', borderRadius: 6, fontSize: 11,
                      background: c.estado === 'publicado' ? `${COLORS.success}22` : `${COLORS.amber}22`,
                      color: c.estado === 'publicado' ? COLORS.success : COLORS.amber
                    }}>
                      {c.estado === 'publicado' ? '✓ Publicado' : 'Borrador'}
                    </span>
                  </div>
                  <h4 style={{ marginBottom: 8 }}>{c.titulo}</h4>
                  <p style={{ fontSize: 12, color: COLORS.textMuted }}>
                    Día {c.dia} de {MESES[c.mes - 1]}
                  </p>
                  <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
                    <button onClick={(e) => { e.stopPropagation(); abrirEnEditor(c); }} style={{ ...estilos.btn('secondary'), padding: '8px 12px', fontSize: 12, flex: 1 }}>
                      ✏️ Editar
                    </button>
                    {c.estado !== 'publicado' && (
                      <button onClick={(e) => { e.stopPropagation(); publicar(c); }} style={{ ...estilos.btn(), padding: '8px 12px', fontSize: 12, flex: 1 }}>
                        🚀 Publicar
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════ */}
      {/* TAB: GUARDIANES */}
      {/* ════════════════════════════════════════════════════════════ */}
      {tab === 'guardianes' && (
        <div>
          <div style={{ marginBottom: 20 }}>
            <h3 style={{ color: COLORS.gold, marginBottom: 8 }}>🧙 Canalizar desde Guardianes</h3>
            <p style={{ color: COLORS.textMuted }}>Seleccioná un guardián para crear contenido desde su perspectiva</p>
          </div>

          {guardianSeleccionado && (
            <div style={{ ...estilos.card, marginBottom: 24, border: `2px solid ${COLORS.gold}` }}>
              <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 16 }}>
                {guardianSeleccionado.imagen && (
                  <img src={guardianSeleccionado.imagen} alt="" style={{ width: 80, height: 80, borderRadius: 12, objectFit: 'cover' }} />
                )}
                <div>
                  <h4 style={{ color: COLORS.gold, marginBottom: 4 }}>{guardianSeleccionado.nombre}</h4>
                  <p style={{ fontSize: 13, color: COLORS.textMuted }}>{guardianSeleccionado.descripcion?.slice(0, 100)}...</p>
                </div>
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={estilos.label}>Tipo de contenido</label>
                <select value={editorContenido.tipo} onChange={(e) => setEditorContenido(prev => ({ ...prev, tipo: e.target.value }))} style={{ ...estilos.select, width: '100%' }}>
                  {TIPOS.map(t => (
                    <option key={t.id} value={t.id}>{t.icono} {t.nombre}</option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={estilos.label}>Instrucción extra (opcional)</label>
                <textarea
                  placeholder="Ej: Que hable sobre protección del hogar..."
                  value={instruccionExtra}
                  onChange={(e) => setInstruccionExtra(e.target.value)}
                  style={{ ...estilos.textarea, minHeight: 80 }}
                />
              </div>

              <div style={{ display: 'flex', gap: 12 }}>
                <button onClick={generarDesdeGuardian} disabled={loading} style={{ ...estilos.btn(), flex: 1 }}>
                  {loading ? '⏳ Canalizando...' : '✨ Canalizar mensaje'}
                </button>
                <button onClick={() => setGuardianSeleccionado(null)} style={{ ...estilos.btn('secondary') }}>
                  Cancelar
                </button>
              </div>
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
            {guardianes.map(g => (
              <div
                key={g.id}
                onClick={() => setGuardianSeleccionado(g)}
                style={{
                  ...estilos.card,
                  cursor: 'pointer',
                  textAlign: 'center',
                  border: guardianSeleccionado?.id === g.id ? `2px solid ${COLORS.gold}` : `1px solid ${COLORS.border}`,
                  transition: 'all 0.2s'
                }}
              >
                {g.imagen ? (
                  <img src={g.imagen} alt="" style={{ width: '100%', height: 140, objectFit: 'cover', borderRadius: 8, marginBottom: 12 }} />
                ) : (
                  <div style={{ width: '100%', height: 140, background: COLORS.bgElevated, borderRadius: 8, marginBottom: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40 }}>
                    🧙
                  </div>
                )}
                <h4 style={{ fontSize: 14, marginBottom: 4 }}>{g.nombre}</h4>
                <p style={{ fontSize: 11, color: COLORS.textMuted }}>{g.precio ? `$${g.precio}` : 'Sin precio'}</p>
              </div>
            ))}
          </div>

          {guardianes.length === 0 && (
            <div style={{ ...estilos.card, textAlign: 'center', padding: 40 }}>
              <p style={{ fontSize: 48, marginBottom: 16 }}>🧙</p>
              <p style={{ color: COLORS.textMuted }}>No se encontraron guardianes</p>
              <p style={{ fontSize: 12, color: COLORS.textDim, marginTop: 8 }}>
                Verificá que la API de productos esté funcionando
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
