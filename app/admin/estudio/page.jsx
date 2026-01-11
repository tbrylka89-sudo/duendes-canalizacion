'use client';
import { useState, useEffect } from 'react';

// ═══════════════════════════════════════════════════════════════
// ESTUDIO UNIFICADO - CALENDARIO + GUARDIANES INTEGRADOS
// Cada día puede tener un Guardián asignado que "presenta" el contenido
// ═══════════════════════════════════════════════════════════════

// COLORES CÁLIDOS - No negro puro
const COLORS = {
  bg: '#2a1f2f',           // Charcoal cálido con toque púrpura
  bgCard: '#352a3a',       // Card background más cálido
  bgElevated: '#3f3445',   // Elevated surfaces
  bgHover: '#4a3f50',      // Hover states
  border: '#4a3f50',       // Borders
  borderLight: '#5a4f60',  // Light borders
  text: '#ffffff',
  textMuted: '#b8b0c0',
  textDim: '#8a8090',
  gold: '#D4A853',
  goldLight: '#E8C97D',
  goldDark: '#B8922F',
  purple: '#8B5CF6',
  pink: '#EC4899',
  cyan: '#06B6D4',
  emerald: '#10B981',
  orange: '#F97316',
  amber: '#F59E0B',
  teal: '#14B8A6',
  success: '#22c55e',
  error: '#ef4444',
  rose: '#f43f5e',
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
  0: { tipo: 'ritual', categoria: 'rituales', nombre: 'Ritual Semanal', color: '#F97316' },
  1: { tipo: 'meditacion', categoria: 'sanacion', nombre: 'Meditación', color: '#10B981' },
  2: { tipo: 'articulo', categoria: 'esoterico', nombre: 'Sabiduría', color: '#A78BFA' },
  3: { tipo: 'guia', categoria: 'diy', nombre: 'DIY Mágico', color: '#EC4899' },
  4: { tipo: 'historia', categoria: 'duendes', nombre: 'Historia Duende', color: '#F59E0B' },
  5: { tipo: 'reflexion', categoria: 'cosmos', nombre: 'Luna y Cosmos', color: '#8B5CF6' },
  6: { tipo: 'articulo', categoria: 'sanacion', nombre: 'Bienestar', color: '#14B8A6' },
};

// ═══════════════════════════════════════════════════════════════
// COMPONENTE PRINCIPAL
// ═══════════════════════════════════════════════════════════════

export default function EstudioUnificado() {
  // Estado compartido entre todas las pestañas
  const [mes, setMes] = useState(new Date().getMonth() + 1);
  const [año, setAño] = useState(new Date().getFullYear());
  const [contenidos, setContenidos] = useState([]);
  const [guardianes, setGuardianes] = useState([]);
  const [diaSeleccionado, setDiaSeleccionado] = useState(null);
  const [guardianSeleccionado, setGuardianSeleccionado] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingDia, setLoadingDia] = useState(null);
  const [mensaje, setMensaje] = useState(null);

  // Panel lateral abierto
  const [panelAbierto, setPanelAbierto] = useState(null); // 'editor' | 'guardian' | null

  // Editor state
  const [editorData, setEditorData] = useState({
    titulo: '',
    extracto: '',
    categoria: 'cosmos',
    tipo: 'articulo',
    secciones: { intro: '', desarrollo: '', practica: '', cierre: '' },
    guardian: null // Guardián asignado
  });

  // Instrucciones extra
  const [instruccionExtra, setInstruccionExtra] = useState('');

  // ════════════════════════════════════════════════════════════
  // CARGAR DATOS
  // ════════════════════════════════════════════════════════════

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
      console.error('Error cargando contenidos:', e);
    }
  };

  const cargarGuardianes = async () => {
    try {
      const res = await fetch('/api/admin/productos?categoria=guardianes');
      const data = await res.json();
      if (data.success) setGuardianes(data.productos || []);
    } catch (e) {
      // Si falla, usar guardianes de ejemplo
      setGuardianes([
        { id: 1, nombre: 'Finnegan', descripcion: 'Guardián del Bosque Ancestral', imagen: null, proposito: 'Protección del hogar' },
        { id: 2, nombre: 'Bramble', descripcion: 'Guardián de los Secretos', imagen: null, proposito: 'Sabiduría oculta' },
        { id: 3, nombre: 'Elderwood', descripcion: 'El Anciano Sabio', imagen: null, proposito: 'Guía espiritual' },
        { id: 4, nombre: 'Thornwick', descripcion: 'Protector de Umbrales', imagen: null, proposito: 'Protección energética' },
        { id: 5, nombre: 'Moss', descripcion: 'Sanador del Bosque', imagen: null, proposito: 'Sanación y bienestar' },
        { id: 6, nombre: 'Willow', descripcion: 'Guardiana de los Sueños', imagen: null, proposito: 'Intuición y sueños' },
      ]);
    }
  };

  // ════════════════════════════════════════════════════════════
  // FUNCIONES DE CONTENIDO
  // ════════════════════════════════════════════════════════════

  const getContenidoDia = (dia) => contenidos.find(c => c.dia === dia);

  const generarMes = async () => {
    if (loading) return;
    setLoading(true);
    mostrarMensaje('Generando contenido del mes completo... (puede tardar varios minutos)', 'info');

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

  const generarDia = async (dia, conGuardian = false) => {
    setLoadingDia(dia);
    const guardianInfo = conGuardian && guardianSeleccionado
      ? `\n\nGUARDIÁN PRESENTADOR: ${guardianSeleccionado.nombre} - ${guardianSeleccionado.descripcion}. El contenido debe ser presentado como si este guardián lo estuviera compartiendo.`
      : '';

    mostrarMensaje(conGuardian ? `Generando con ${guardianSeleccionado?.nombre}...` : 'Generando contenido + imagen...', 'info');

    try {
      const res = await fetch('/api/admin/circulo/generar-dia', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dia, mes, año,
          instruccionExtra: instruccionExtra + guardianInfo
        })
      });
      const data = await res.json();

      if (data.success && data.contenido) {
        // Guardar con info del guardián
        const contenidoConGuardian = {
          ...data.contenido,
          guardian: conGuardian ? guardianSeleccionado : null
        };

        setContenidos(prev => {
          const filtered = prev.filter(c => c.dia !== dia);
          return [...filtered, contenidoConGuardian];
        });

        // Actualizar editor si está abierto
        if (diaSeleccionado === dia) {
          setEditorData({
            titulo: data.contenido.titulo,
            extracto: data.contenido.extracto,
            categoria: data.contenido.categoria,
            tipo: data.contenido.tipo,
            secciones: data.contenido.secciones || { intro: '', desarrollo: '', practica: '', cierre: '' },
            guardian: conGuardian ? guardianSeleccionado : null
          });
        }

        mostrarMensaje('¡Contenido generado!');
      } else {
        mostrarMensaje(data.error || 'Error', 'error');
      }
    } catch (e) {
      mostrarMensaje(e.message, 'error');
    } finally {
      setLoadingDia(null);
    }
  };

  const publicar = async (contenido) => {
    mostrarMensaje('Publicando...', 'info');
    try {
      const textoCompleto = contenido.secciones
        ? `${contenido.secciones.intro}\n\n${contenido.secciones.desarrollo}\n\n${contenido.secciones.practica}\n\n${contenido.secciones.cierre}`
        : '';

      const res = await fetch('/api/circulo/contenido', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          titulo: contenido.titulo,
          contenido: textoCompleto,
          extracto: contenido.extracto,
          categoria: contenido.categoria,
          tipo: contenido.tipo,
          imagen: contenido.imagen,
          guardian: contenido.guardian?.nombre
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

  const seleccionarDia = (dia) => {
    setDiaSeleccionado(dia);
    const contenido = getContenidoDia(dia);
    if (contenido) {
      setEditorData({
        titulo: contenido.titulo || '',
        extracto: contenido.extracto || '',
        categoria: contenido.categoria || 'cosmos',
        tipo: contenido.tipo || 'articulo',
        secciones: contenido.secciones || { intro: '', desarrollo: '', practica: '', cierre: '' },
        guardian: contenido.guardian || null
      });
      setGuardianSeleccionado(contenido.guardian || null);
    } else {
      const estructura = ESTRUCTURA_SEMANAL[new Date(año, mes - 1, dia).getDay()];
      setEditorData({
        titulo: '',
        extracto: '',
        categoria: estructura?.categoria || 'cosmos',
        tipo: estructura?.tipo || 'articulo',
        secciones: { intro: '', desarrollo: '', practica: '', cierre: '' },
        guardian: null
      });
    }
    setPanelAbierto('editor');
  };

  const asignarGuardianADia = () => {
    if (!diaSeleccionado || !guardianSeleccionado) return;

    setEditorData(prev => ({ ...prev, guardian: guardianSeleccionado }));

    // Actualizar el contenido del día con el guardián
    setContenidos(prev => prev.map(c =>
      c.dia === diaSeleccionado ? { ...c, guardian: guardianSeleccionado } : c
    ));

    setPanelAbierto('editor');
    mostrarMensaje(`${guardianSeleccionado.nombre} asignado al día ${diaSeleccionado}`);
  };

  // ════════════════════════════════════════════════════════════
  // CALENDARIO
  // ════════════════════════════════════════════════════════════

  const diasEnMes = new Date(año, mes, 0).getDate();
  const primerDia = new Date(año, mes - 1, 1).getDay();
  const calendario = [];
  for (let i = 0; i < primerDia; i++) calendario.push(null);
  for (let d = 1; d <= diasEnMes; d++) calendario.push(d);

  // ════════════════════════════════════════════════════════════
  // ESTILOS
  // ════════════════════════════════════════════════════════════

  const estilos = {
    container: {
      minHeight: '100vh',
      background: `linear-gradient(135deg, ${COLORS.bg} 0%, #1f1a24 100%)`,
      color: COLORS.text,
      display: 'flex'
    },
    main: {
      flex: 1,
      padding: '24px',
      overflowY: 'auto'
    },
    panel: {
      width: panelAbierto ? '420px' : '0',
      background: COLORS.bgCard,
      borderLeft: `1px solid ${COLORS.border}`,
      transition: 'width 0.3s ease',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column'
    },
    panelContent: {
      padding: '24px',
      overflowY: 'auto',
      flex: 1,
      width: '420px'
    },
    header: {
      marginBottom: 24,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: 16
    },
    btn: (variante = 'primary', disabled = false) => ({
      padding: '12px 24px',
      background: disabled ? COLORS.bgElevated : variante === 'primary' ? `linear-gradient(135deg, ${COLORS.gold}, ${COLORS.amber})` : COLORS.bgElevated,
      border: variante === 'primary' ? 'none' : `1px solid ${COLORS.border}`,
      borderRadius: 12,
      color: disabled ? COLORS.textDim : variante === 'primary' ? '#000' : COLORS.text,
      cursor: disabled ? 'not-allowed' : 'pointer',
      fontSize: 14,
      fontWeight: 600,
      transition: 'all 0.2s'
    }),
    input: {
      width: '100%',
      padding: 14,
      background: COLORS.bgElevated,
      border: `1px solid ${COLORS.border}`,
      borderRadius: 12,
      color: COLORS.text,
      fontSize: 15,
      outline: 'none'
    },
    textarea: {
      width: '100%',
      padding: 14,
      background: COLORS.bgElevated,
      border: `1px solid ${COLORS.border}`,
      borderRadius: 12,
      color: COLORS.text,
      fontSize: 15,
      resize: 'vertical',
      minHeight: 120,
      lineHeight: 1.6,
      outline: 'none'
    },
    label: { display: 'block', marginBottom: 8, color: COLORS.textMuted, fontSize: 14 },
    calendarDay: (esHoy, contenido, seleccionado) => ({
      background: seleccionado ? `${COLORS.gold}30` : esHoy ? `${COLORS.gold}15` : COLORS.bgCard,
      border: `2px solid ${seleccionado ? COLORS.gold : esHoy ? COLORS.goldDark : contenido?.estado === 'publicado' ? COLORS.success : contenido ? COLORS.purple : COLORS.border}`,
      borderRadius: 12,
      padding: 10,
      minHeight: 100,
      cursor: 'pointer',
      position: 'relative',
      transition: 'all 0.2s'
    }),
    guardianCard: (seleccionado) => ({
      background: seleccionado ? `${COLORS.gold}20` : COLORS.bgElevated,
      border: `2px solid ${seleccionado ? COLORS.gold : COLORS.border}`,
      borderRadius: 12,
      padding: 16,
      cursor: 'pointer',
      transition: 'all 0.2s',
      marginBottom: 12
    })
  };

  return (
    <div style={estilos.container}>
      {/* Mensaje toast */}
      {mensaje && (
        <div style={{
          position: 'fixed', top: 20, right: 20, padding: '14px 24px', zIndex: 1000,
          background: mensaje.tipo === 'error' ? COLORS.error : mensaje.tipo === 'info' ? COLORS.cyan : COLORS.success,
          borderRadius: 12, fontWeight: 500, boxShadow: '0 4px 20px rgba(0,0,0,0.4)'
        }}>
          {mensaje.texto}
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════ */}
      {/* ÁREA PRINCIPAL - CALENDARIO */}
      {/* ════════════════════════════════════════════════════════════ */}
      <div style={estilos.main}>
        {/* Header */}
        <div style={estilos.header}>
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 'bold', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: 32 }}>🎨</span> Estudio Creativo
            </h1>
            <p style={{ color: COLORS.textMuted }}>
              Calendario + Guardianes integrados • Hacé clic en un día para editar
            </p>
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <span style={{ padding: '8px 16px', background: `${COLORS.purple}22`, border: `1px solid ${COLORS.purple}`, borderRadius: 8, color: COLORS.purple, fontSize: 13 }}>
              {contenidos.length} generados
            </span>
            <span style={{ padding: '8px 16px', background: `${COLORS.success}22`, border: `1px solid ${COLORS.success}`, borderRadius: 8, color: COLORS.success, fontSize: 13 }}>
              {contenidos.filter(c => c.estado === 'publicado').length} publicados
            </span>
          </div>
        </div>

        {/* Controles de mes */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button onClick={() => { if (mes === 1) { setMes(12); setAño(año - 1); } else setMes(mes - 1); }}
              style={estilos.btn('secondary')}>← Anterior</button>
            <h2 style={{ fontSize: 22, fontWeight: 'bold', minWidth: 180, textAlign: 'center' }}>
              {MESES[mes - 1]} {año}
            </h2>
            <button onClick={() => { if (mes === 12) { setMes(1); setAño(año + 1); } else setMes(mes + 1); }}
              style={estilos.btn('secondary')}>Siguiente →</button>
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={() => setPanelAbierto(panelAbierto === 'guardian' ? null : 'guardian')}
              style={{ ...estilos.btn('secondary'), background: panelAbierto === 'guardian' ? COLORS.gold : COLORS.bgElevated, color: panelAbierto === 'guardian' ? '#000' : COLORS.text }}>
              🧙 Guardianes
            </button>
            <button onClick={generarMes} disabled={loading} style={estilos.btn('primary', loading)}>
              {loading ? '⏳ Generando...' : '✨ Generar mes'}
            </button>
          </div>
        </div>

        {/* Días de la semana */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 6, marginBottom: 6 }}>
          {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map((d, i) => (
            <div key={d} style={{
              padding: 10,
              textAlign: 'center',
              color: COLORS.textMuted,
              fontSize: 12,
              fontWeight: 600,
              background: COLORS.bgCard,
              borderRadius: 8
            }}>
              {d}
              <div style={{ fontSize: 10, color: ESTRUCTURA_SEMANAL[i]?.color, marginTop: 2 }}>
                {ESTRUCTURA_SEMANAL[i]?.nombre}
              </div>
            </div>
          ))}
        </div>

        {/* Calendario */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 6, marginBottom: 24 }}>
          {calendario.map((dia, i) => {
            if (!dia) return <div key={i} style={{ background: COLORS.bgCard, borderRadius: 12, minHeight: 100, opacity: 0.3 }} />;

            const contenido = getContenidoDia(dia);
            const esHoy = dia === new Date().getDate() && mes === new Date().getMonth() + 1 && año === new Date().getFullYear();
            const estructura = ESTRUCTURA_SEMANAL[new Date(año, mes - 1, dia).getDay()];
            const seleccionado = diaSeleccionado === dia;

            return (
              <div
                key={i}
                onClick={() => seleccionarDia(dia)}
                style={estilos.calendarDay(esHoy, contenido, seleccionado)}
              >
                {/* Indicador de estado */}
                <div style={{
                  position: 'absolute', top: 8, right: 8,
                  width: 10, height: 10, borderRadius: '50%',
                  background: contenido?.estado === 'publicado' ? COLORS.success : contenido ? COLORS.purple : COLORS.border
                }} />

                {/* Guardián asignado */}
                {contenido?.guardian && (
                  <div style={{
                    position: 'absolute', top: 6, left: 6,
                    fontSize: 16, background: COLORS.gold, borderRadius: '50%',
                    width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }} title={contenido.guardian.nombre}>
                    🧙
                  </div>
                )}

                <div style={{ fontWeight: esHoy ? 700 : 500, color: esHoy ? COLORS.gold : 'white', marginBottom: 4, fontSize: 16, marginTop: contenido?.guardian ? 24 : 0 }}>
                  {dia}
                </div>

                {contenido ? (
                  <div>
                    {contenido.imagen && <div style={{ fontSize: 10, color: COLORS.success, marginBottom: 2 }}>🖼️</div>}
                    <div style={{
                      fontSize: 11,
                      color: '#e5e7eb',
                      lineHeight: 1.3,
                      overflow: 'hidden',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical'
                    }}>
                      {contenido.titulo}
                    </div>
                  </div>
                ) : (
                  <div style={{ fontSize: 10, color: estructura?.color, marginTop: 8 }}>
                    {estructura?.nombre}
                  </div>
                )}

                {loadingDia === dia && (
                  <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.7)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontSize: 20 }}>⏳</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Leyenda */}
        <div style={{ display: 'flex', gap: 20, padding: '12px 16px', background: COLORS.bgCard, borderRadius: 10, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: COLORS.textMuted }}>
            <span style={{ width: 12, height: 12, borderRadius: '50%', background: COLORS.success }} /> Publicado
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: COLORS.textMuted }}>
            <span style={{ width: 12, height: 12, borderRadius: '50%', background: COLORS.purple }} /> Generado
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: COLORS.textMuted }}>
            <span style={{ width: 12, height: 12, borderRadius: '50%', background: COLORS.border }} /> Sin contenido
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: COLORS.textMuted }}>
            <span style={{ width: 24, height: 24, borderRadius: '50%', background: COLORS.gold, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>🧙</span> Con Guardián
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════ */}
      {/* PANEL LATERAL */}
      {/* ════════════════════════════════════════════════════════════ */}
      <div style={estilos.panel}>
        {panelAbierto && (
          <div style={estilos.panelContent}>
            {/* Header del panel */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ color: COLORS.gold, fontSize: 18 }}>
                {panelAbierto === 'editor' ? `📝 Día ${diaSeleccionado}` : '🧙 Guardianes'}
              </h3>
              <button onClick={() => setPanelAbierto(null)} style={{ background: 'none', border: 'none', color: COLORS.textMuted, cursor: 'pointer', fontSize: 20 }}>
                ✕
              </button>
            </div>

            {/* ════════════════════════════════════════════════════════════ */}
            {/* PANEL: EDITOR */}
            {/* ════════════════════════════════════════════════════════════ */}
            {panelAbierto === 'editor' && diaSeleccionado && (
              <>
                {/* Guardián asignado */}
                {editorData.guardian && (
                  <div style={{ background: `${COLORS.gold}15`, border: `1px solid ${COLORS.gold}`, borderRadius: 12, padding: 12, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ fontSize: 28 }}>🧙</span>
                    <div>
                      <div style={{ fontWeight: 600, color: COLORS.gold }}>{editorData.guardian.nombre}</div>
                      <div style={{ fontSize: 12, color: COLORS.textMuted }}>Presenta este contenido</div>
                    </div>
                    <button onClick={() => setEditorData(prev => ({ ...prev, guardian: null }))} style={{ marginLeft: 'auto', background: 'none', border: 'none', color: COLORS.textMuted, cursor: 'pointer' }}>✕</button>
                  </div>
                )}

                {/* Botones de acción */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20 }}>
                  <button
                    onClick={() => generarDia(diaSeleccionado, !!editorData.guardian)}
                    disabled={loadingDia === diaSeleccionado}
                    style={estilos.btn('primary', loadingDia === diaSeleccionado)}
                  >
                    {loadingDia === diaSeleccionado ? '⏳' : '✨'} Generar
                  </button>
                  <button
                    onClick={() => setPanelAbierto('guardian')}
                    style={estilos.btn('secondary')}
                  >
                    🧙 Asignar Guardián
                  </button>
                </div>

                {/* Instrucción extra */}
                <div style={{ marginBottom: 16 }}>
                  <label style={estilos.label}>Instrucción extra (opcional)</label>
                  <textarea
                    placeholder="Ej: Enfocate en la luna llena, mencioná cristales..."
                    value={instruccionExtra}
                    onChange={(e) => setInstruccionExtra(e.target.value)}
                    style={{ ...estilos.textarea, minHeight: 60 }}
                  />
                </div>

                {/* Contenido existente */}
                {getContenidoDia(diaSeleccionado) && (
                  <>
                    <div style={{ marginBottom: 16 }}>
                      <label style={estilos.label}>Título</label>
                      <input
                        type="text"
                        value={editorData.titulo}
                        onChange={(e) => setEditorData(prev => ({ ...prev, titulo: e.target.value }))}
                        style={estilos.input}
                      />
                    </div>

                    <div style={{ marginBottom: 16 }}>
                      <label style={estilos.label}>Extracto</label>
                      <textarea
                        value={editorData.extracto}
                        onChange={(e) => setEditorData(prev => ({ ...prev, extracto: e.target.value }))}
                        style={{ ...estilos.textarea, minHeight: 60 }}
                      />
                    </div>

                    {/* Preview de secciones */}
                    {Object.entries(editorData.secciones).map(([key, value]) => value && (
                      <div key={key} style={{ marginBottom: 12 }}>
                        <label style={{ ...estilos.label, color: COLORS.gold }}>{key.charAt(0).toUpperCase() + key.slice(1)}</label>
                        <div style={{ fontSize: 13, color: COLORS.textMuted, maxHeight: 100, overflow: 'hidden', lineHeight: 1.5 }}>
                          {value.slice(0, 200)}...
                        </div>
                      </div>
                    ))}

                    {/* Publicar */}
                    {getContenidoDia(diaSeleccionado)?.estado !== 'publicado' && (
                      <button
                        onClick={() => publicar(getContenidoDia(diaSeleccionado))}
                        style={{ ...estilos.btn('primary'), width: '100%', marginTop: 16 }}
                      >
                        🚀 Publicar en El Círculo
                      </button>
                    )}
                  </>
                )}
              </>
            )}

            {/* ════════════════════════════════════════════════════════════ */}
            {/* PANEL: GUARDIANES */}
            {/* ════════════════════════════════════════════════════════════ */}
            {panelAbierto === 'guardian' && (
              <>
                <p style={{ color: COLORS.textMuted, marginBottom: 16, fontSize: 13 }}>
                  {diaSeleccionado
                    ? `Seleccioná un Guardián para el día ${diaSeleccionado}`
                    : 'Primero seleccioná un día en el calendario'
                  }
                </p>

                {guardianes.map(g => (
                  <div
                    key={g.id}
                    onClick={() => setGuardianSeleccionado(guardianSeleccionado?.id === g.id ? null : g)}
                    style={estilos.guardianCard(guardianSeleccionado?.id === g.id)}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      {g.imagen ? (
                        <img src={g.imagen} alt="" style={{ width: 50, height: 50, borderRadius: 10, objectFit: 'cover' }} />
                      ) : (
                        <div style={{ width: 50, height: 50, borderRadius: 10, background: COLORS.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>
                          🧙
                        </div>
                      )}
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600, color: guardianSeleccionado?.id === g.id ? COLORS.gold : COLORS.text }}>{g.nombre}</div>
                        <div style={{ fontSize: 12, color: COLORS.textMuted }}>{g.descripcion || g.proposito}</div>
                      </div>
                      {guardianSeleccionado?.id === g.id && (
                        <span style={{ color: COLORS.gold }}>✓</span>
                      )}
                    </div>
                  </div>
                ))}

                {diaSeleccionado && guardianSeleccionado && (
                  <button
                    onClick={asignarGuardianADia}
                    style={{ ...estilos.btn('primary'), width: '100%', marginTop: 16 }}
                  >
                    ✨ Asignar {guardianSeleccionado.nombre} al día {diaSeleccionado}
                  </button>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
