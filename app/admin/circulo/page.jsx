'use client';
import { useState, useEffect } from 'react';

// ═══════════════════════════════════════════════════════════════
// SISTEMA AUTOMÁTICO DE EL CÍRCULO
// Todo en uno: Contenido + Calendario + Regalos + Automatización
// ═══════════════════════════════════════════════════════════════

const COLORS = {
  bg: '#0a0a0f',
  bgCard: '#12121a',
  bgElevated: '#1a1a25',
  bgHover: '#22222f',
  border: '#2a2a3a',
  borderLight: '#3a3a4a',
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
  rose: '#F43F5E',
  success: '#22c55e',
  error: '#ef4444',
};

// Fechas especiales (hemisferio sur)
const FECHAS_ESPECIALES = [
  { fecha: '02-02', nombre: 'Imbolc', tipo: 'sabbat', regalo: 'lectura', icono: '🕯️' },
  { fecha: '03-20', nombre: 'Ostara', tipo: 'sabbat', regalo: 'meditacion', icono: '🌸' },
  { fecha: '05-01', nombre: 'Beltane', tipo: 'sabbat', regalo: 'ritual', icono: '🔥' },
  { fecha: '06-21', nombre: 'Litha', tipo: 'sabbat', regalo: 'lectura', icono: '☀️' },
  { fecha: '08-01', nombre: 'Lammas', tipo: 'sabbat', regalo: 'treboles', icono: '🌾' },
  { fecha: '09-21', nombre: 'Mabon', tipo: 'sabbat', regalo: 'runas', icono: '🍂' },
  { fecha: '10-31', nombre: 'Samhain', tipo: 'sabbat', regalo: 'lectura', icono: '🎃' },
  { fecha: '12-21', nombre: 'Yule', tipo: 'sabbat', regalo: 'lectura', icono: '❄️' },
];

const TIPOS_REGALO = {
  lectura: { nombre: 'Lectura Gratis', icono: '🔮', cantidad: 1 },
  runas: { nombre: '10 Runas', icono: '🪨', cantidad: 10 },
  treboles: { nombre: '25 Tréboles', icono: '☘️', cantidad: 25 },
  meditacion: { nombre: 'Meditación', icono: '🧘', cantidad: 1 },
  ritual: { nombre: 'Ritual Especial', icono: '🕯️', cantidad: 1 },
};

const ESTRUCTURA_SEMANAL = {
  domingo: { tipo: 'ritual', categoria: 'rituales', icono: '✨', nombre: 'Ritual de preparación' },
  lunes: { tipo: 'motivacion', categoria: 'sanacion', icono: '🌱', nombre: 'Mensaje semanal' },
  martes: { tipo: 'articulo', categoria: 'esoterico', icono: '📚', nombre: 'Enseñanza' },
  miercoles: { tipo: 'practica', categoria: 'rituales', icono: '🔮', nombre: 'Práctica' },
  jueves: { tipo: 'historia', categoria: 'duendes', icono: '🧙', nombre: 'Duendes' },
  viernes: { tipo: 'reflexion', categoria: 'sanacion', icono: '🌙', nombre: 'Reflexión' },
  sabado: { tipo: 'guia', categoria: 'cosmos', icono: '📖', nombre: 'Guía profunda' },
};

const DIAS = ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'];
const MESES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

export default function CirculoAutomatico() {
  const [tab, setTab] = useState('calendario');
  const [mes, setMes] = useState(new Date().getMonth());
  const [año, setAño] = useState(new Date().getFullYear());
  const [contenidos, setContenidos] = useState({});
  const [miembros, setMiembros] = useState([]);
  const [config, setConfig] = useState({
    autoGenerar: true,
    autoPublicar: true,
    horaPublicacion: '09:00',
    regaloLunaLlena: true,
    regalosSabbats: true,
    notificarEmail: true,
  });
  const [loading, setLoading] = useState({});
  const [fasesLunares, setFasesLunares] = useState({});
  const [stats, setStats] = useState({ miembros: 0, activos: 0, publicados: 0 });
  const [generandoMes, setGenerandoMes] = useState(false);
  const [contenidoSeleccionado, setContenidoSeleccionado] = useState(null);
  const [toast, setToast] = useState(null);

  // Cargar datos
  useEffect(() => {
    cargarDatos();
    calcularFasesLunares();
  }, [mes, año]);

  const mostrarToast = (mensaje, tipo = 'success') => {
    setToast({ mensaje, tipo });
    setTimeout(() => setToast(null), 3000);
  };

  const cargarDatos = async () => {
    try {
      // Cargar contenidos guardados del mes
      const resContenidos = await fetch(`/api/admin/circulo/contenidos?mes=${mes + 1}&año=${año}`);
      const dataContenidos = await resContenidos.json();
      if (dataContenidos.success && dataContenidos.contenidos) {
        const map = {};
        dataContenidos.contenidos.forEach(c => {
          // Usar fecha ISO como key
          const fechaKey = c.fecha ? c.fecha.split('T')[0] : `${c.año}-${String(c.mes).padStart(2,'0')}-${String(c.dia).padStart(2,'0')}`;
          map[fechaKey] = c;
        });
        setContenidos(map);
      }

      // Cargar miembros
      const resMiembros = await fetch('/api/admin/circulo/miembros');
      const dataMiembros = await resMiembros.json();
      if (dataMiembros.success) {
        setMiembros(dataMiembros.miembros || []);
        setStats({
          miembros: dataMiembros.total || 0,
          activos: dataMiembros.activos || 0,
          publicados: Object.values(contenidos).filter(c => c?.estado === 'publicado').length,
        });
      }

      // Cargar config
      const resConfig = await fetch('/api/admin/circulo/config');
      const dataConfig = await resConfig.json();
      if (dataConfig.success && dataConfig.config) {
        setConfig(prev => ({ ...prev, ...dataConfig.config }));
      }
    } catch (e) {
      console.error('Error cargando datos:', e);
    }
  };

  // Fases lunares
  const calcularFasesLunares = () => {
    const fases = {};
    const primerDia = new Date(año, mes, 1);
    const ultimoDia = new Date(año, mes + 1, 0);

    for (let d = new Date(primerDia); d <= ultimoDia; d.setDate(d.getDate() + 1)) {
      const fase = getFaseLunar(new Date(d));
      if (fase.esEspecial) {
        fases[d.toISOString().split('T')[0]] = fase;
      }
    }
    setFasesLunares(fases);
  };

  const getFaseLunar = (fecha) => {
    const lunarCycle = 29.53059;
    const knownNewMoon = new Date(2024, 0, 11);
    const diff = fecha.getTime() - knownNewMoon.getTime();
    const days = diff / (1000 * 60 * 60 * 24);
    const phase = ((days % lunarCycle) + lunarCycle) % lunarCycle;

    if (phase < 1 || phase > 28.5) return { nombre: 'Luna Nueva', icono: '🌑', esEspecial: true, tipo: 'nueva' };
    if (phase > 13.5 && phase < 15.5) return { nombre: 'Luna Llena', icono: '🌕', esEspecial: true, tipo: 'llena' };
    return { nombre: '', icono: '', esEspecial: false };
  };

  const getFechaEspecial = (fecha) => {
    const mesdia = `${String(fecha.getMonth() + 1).padStart(2, '0')}-${String(fecha.getDate()).padStart(2, '0')}`;
    return FECHAS_ESPECIALES.find(f => f.fecha === mesdia);
  };

  // ═══════════════════════════════════════════════════════════════
  // GENERAR MES COMPLETO
  // ═══════════════════════════════════════════════════════════════
  const generarMesCompleto = async () => {
    setGenerandoMes(true);
    mostrarToast('Generando contenido del mes... Esto puede tardar unos minutos.', 'info');

    try {
      const response = await fetch('/api/admin/circulo/generar-mes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mes: mes + 1,
          año,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Convertir array de contenidos a mapa por fecha
        const map = {};
        (data.contenidos || []).forEach(c => {
          const fechaKey = c.fecha ? c.fecha.split('T')[0] : `${c.año}-${String(c.mes).padStart(2,'0')}-${String(c.dia).padStart(2,'0')}`;
          map[fechaKey] = c;
        });
        setContenidos(map);
        mostrarToast(`${data.contenidos?.length || 0} contenidos generados`);

        if (data.errores && data.errores.length > 0) {
          console.log('Errores durante generación:', data.errores);
        }
      } else {
        mostrarToast(data.error || 'Error al generar', 'error');
      }
    } catch (e) {
      mostrarToast(e.message, 'error');
    } finally {
      setGenerandoMes(false);
    }
  };

  // Generar día individual
  const generarDia = async (fechaKey) => {
    setLoading(prev => ({ ...prev, [fechaKey]: true }));

    try {
      const fecha = new Date(fechaKey);

      const response = await fetch('/api/admin/circulo/generar-dia', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dia: fecha.getDate(),
          mes: fecha.getMonth() + 1,
          año: fecha.getFullYear(),
        }),
      });

      const data = await response.json();

      if (data.success) {
        setContenidos(prev => ({ ...prev, [fechaKey]: data.contenido }));
        mostrarToast('Contenido generado');
      } else {
        mostrarToast(data.error || 'Error al generar', 'error');
      }
    } catch (e) {
      mostrarToast(e.message, 'error');
    } finally {
      setLoading(prev => ({ ...prev, [fechaKey]: false }));
    }
  };

  // Publicar contenido
  const publicarContenido = async (fechaKey) => {
    setLoading(prev => ({ ...prev, [`pub-${fechaKey}`]: true }));

    try {
      const contenido = contenidos[fechaKey];

      // Construir contenido completo para publicar
      const contenidoCompleto = contenido.secciones
        ? `${contenido.secciones.intro}\n\n${contenido.secciones.desarrollo}\n\n${contenido.secciones.practica}\n\n${contenido.secciones.cierre}`
        : contenido.contenido || contenido.extracto;

      const response = await fetch('/api/circulo/contenido', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          titulo: contenido.titulo,
          contenido: contenidoCompleto,
          extracto: contenido.extracto,
          categoria: contenido.categoria,
          tipo: contenido.tipo,
          imagen: contenido.imagen,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Actualizar estado en nuestra base
        await fetch('/api/admin/circulo/contenidos', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            dia: contenido.dia,
            mes: contenido.mes,
            año: contenido.año,
            estado: 'publicado'
          }),
        });

        setContenidos(prev => ({
          ...prev,
          [fechaKey]: { ...prev[fechaKey], estado: 'publicado', idPublicado: data.contenido?.id },
        }));
        mostrarToast('Contenido publicado en El Círculo');
      } else {
        mostrarToast(data.error || 'Error al publicar', 'error');
      }
    } catch (e) {
      mostrarToast(e.message, 'error');
    } finally {
      setLoading(prev => ({ ...prev, [`pub-${fechaKey}`]: false }));
    }
  };

  // Regalo masivo
  const enviarRegaloMasivo = async (tipo) => {
    if (!confirm(`¿Enviar ${TIPOS_REGALO[tipo].nombre} a ${stats.activos} miembros?`)) return;

    setLoading(prev => ({ ...prev, regalo: true }));

    try {
      const response = await fetch('/api/admin/circulo/regalo-masivo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tipo, cantidad: TIPOS_REGALO[tipo].cantidad }),
      });

      const data = await response.json();

      if (data.success) {
        mostrarToast(`Regalo enviado a ${data.enviados} miembros`);
      }
    } catch (e) {
      mostrarToast(e.message, 'error');
    } finally {
      setLoading(prev => ({ ...prev, regalo: false }));
    }
  };

  // Guardar config
  const guardarConfig = async () => {
    setLoading(prev => ({ ...prev, config: true }));

    try {
      await fetch('/api/admin/circulo/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });
      mostrarToast('Configuración guardada');
    } catch (e) {
      mostrarToast(e.message, 'error');
    } finally {
      setLoading(prev => ({ ...prev, config: false }));
    }
  };

  // Generar calendario visual
  const generarCalendario = () => {
    const primerDia = new Date(año, mes, 1);
    const ultimoDia = new Date(año, mes + 1, 0);
    const diasEnMes = ultimoDia.getDate();
    const primerDiaSemana = primerDia.getDay();

    const dias = [];
    for (let i = 0; i < primerDiaSemana; i++) dias.push(null);

    for (let d = 1; d <= diasEnMes; d++) {
      const fecha = new Date(año, mes, d);
      const fechaKey = fecha.toISOString().split('T')[0];
      const diaSemana = DIAS[fecha.getDay()];
      const contenido = contenidos[fechaKey];
      const faseLunar = fasesLunares[fechaKey];
      const fechaEspecial = getFechaEspecial(fecha);
      const estructura = ESTRUCTURA_SEMANAL[diaSemana];
      const esHoy = new Date().toISOString().split('T')[0] === fechaKey;
      const esPasado = fecha < new Date(new Date().setHours(0, 0, 0, 0));

      dias.push({ dia: d, fecha, fechaKey, diaSemana, contenido, faseLunar, fechaEspecial, estructura, esHoy, esPasado });
    }

    return dias;
  };

  const calendario = generarCalendario();

  return (
    <div style={{ minHeight: '100vh', background: COLORS.bg, color: COLORS.text }}>
      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          padding: '14px 24px',
          background: toast.tipo === 'error' ? COLORS.error : toast.tipo === 'info' ? COLORS.cyan : COLORS.emerald,
          borderRadius: '10px',
          color: 'white',
          fontWeight: '500',
          zIndex: 1000,
          boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
        }}>
          {toast.mensaje}
        </div>
      )}

      {/* Header */}
      <div style={{
        padding: '20px 24px',
        borderBottom: `1px solid ${COLORS.border}`,
        background: `linear-gradient(135deg, ${COLORS.gold}10, ${COLORS.amber}10)`,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{
              width: '56px',
              height: '56px',
              background: `linear-gradient(135deg, ${COLORS.gold}, ${COLORS.amber})`,
              borderRadius: '14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '28px',
            }}>🌙</div>
            <div>
              <h1 style={{ fontSize: '26px', fontWeight: 'bold', marginBottom: '4px' }}>
                El Círculo - Automático
              </h1>
              <p style={{ color: COLORS.textMuted, fontSize: '14px' }}>
                Contenido + Regalos + Automatización en un solo lugar
              </p>
            </div>
          </div>

          {/* Stats */}
          <div style={{ display: 'flex', gap: '12px' }}>
            {[
              { label: 'Miembros', value: stats.activos, color: COLORS.cyan },
              { label: 'Generados', value: Object.keys(contenidos).length, color: COLORS.purple },
              { label: 'Publicados', value: Object.values(contenidos).filter(c => c?.estado === 'publicado').length, color: COLORS.emerald },
            ].map(s => (
              <div key={s.label} style={{
                padding: '10px 18px',
                background: `${s.color}15`,
                border: `1px solid ${s.color}40`,
                borderRadius: '10px',
                textAlign: 'center',
              }}>
                <div style={{ fontSize: '22px', fontWeight: 'bold', color: s.color }}>{s.value}</div>
                <div style={{ fontSize: '11px', color: COLORS.textMuted }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '8px' }}>
          {[
            { id: 'calendario', label: 'Calendario', icon: '📅' },
            { id: 'automatizacion', label: 'Automatización', icon: '⚡' },
            { id: 'regalos', label: 'Regalos', icon: '🎁' },
            { id: 'miembros', label: 'Miembros', icon: '👥' },
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              style={{
                padding: '12px 24px',
                background: tab === t.id ? COLORS.gold : COLORS.bgCard,
                border: `1px solid ${tab === t.id ? COLORS.gold : COLORS.border}`,
                borderRadius: '10px',
                color: tab === t.id ? '#000' : COLORS.text,
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: tab === t.id ? '600' : '400',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ padding: '24px' }}>
        {/* ═══ TAB: CALENDARIO ═══ */}
        {tab === 'calendario' && (
          <>
            {/* Controles */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <button
                  onClick={() => { if (mes === 0) { setMes(11); setAño(año - 1); } else setMes(mes - 1); }}
                  style={{ padding: '10px 16px', background: COLORS.bgCard, border: `1px solid ${COLORS.border}`, borderRadius: '8px', color: COLORS.text, cursor: 'pointer' }}
                >←</button>
                <h2 style={{ fontSize: '24px', fontWeight: 'bold', minWidth: '180px', textAlign: 'center' }}>
                  {MESES[mes]} {año}
                </h2>
                <button
                  onClick={() => { if (mes === 11) { setMes(0); setAño(año + 1); } else setMes(mes + 1); }}
                  style={{ padding: '10px 16px', background: COLORS.bgCard, border: `1px solid ${COLORS.border}`, borderRadius: '8px', color: COLORS.text, cursor: 'pointer' }}
                >→</button>
              </div>

              <button
                onClick={generarMesCompleto}
                disabled={generandoMes}
                style={{
                  padding: '14px 28px',
                  background: generandoMes ? COLORS.bgElevated : `linear-gradient(135deg, ${COLORS.gold}, ${COLORS.amber})`,
                  border: 'none',
                  borderRadius: '12px',
                  color: generandoMes ? COLORS.textMuted : '#000',
                  cursor: generandoMes ? 'not-allowed' : 'pointer',
                  fontSize: '15px',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                }}
              >
                {generandoMes ? (
                  <><span className="spinner" /> Generando...</>
                ) : (
                  <>✨ Generar mes completo</>
                )}
              </button>
            </div>

            {/* Leyenda */}
            <div style={{ display: 'flex', gap: '20px', marginBottom: '16px', padding: '10px 14px', background: COLORS.bgCard, borderRadius: '8px', flexWrap: 'wrap' }}>
              {[
                { color: COLORS.emerald, label: 'Publicado' },
                { color: COLORS.purple, label: 'Borrador' },
                { color: COLORS.border, label: 'Sin generar' },
                { icon: '🌕', label: 'Luna llena' },
                { icon: '🌑', label: 'Luna nueva' },
                { icon: '🎃', label: 'Sabbat' },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: COLORS.textMuted }}>
                  {item.color ? <span style={{ width: '10px', height: '10px', borderRadius: '3px', background: item.color }} /> : <span>{item.icon}</span>}
                  {item.label}
                </div>
              ))}
            </div>

            {/* Días header */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', marginBottom: '4px' }}>
              {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(d => (
                <div key={d} style={{ padding: '8px', textAlign: 'center', color: COLORS.textMuted, fontSize: '12px', fontWeight: '600' }}>{d}</div>
              ))}
            </div>

            {/* Calendario grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px' }}>
              {calendario.map((dia, idx) => {
                if (!dia) return <div key={`e-${idx}`} style={{ background: COLORS.bgCard, borderRadius: '8px', minHeight: '110px' }} />;

                const estado = dia.contenido?.estado || 'pendiente';
                const estadoColor = { publicado: COLORS.emerald, borrador: COLORS.purple, generado: COLORS.purple, pendiente: COLORS.border }[estado] || COLORS.purple;

                return (
                  <div
                    key={dia.fechaKey}
                    onClick={() => dia.contenido && setContenidoSeleccionado(dia.fechaKey)}
                    style={{
                      background: dia.esHoy ? `${COLORS.gold}15` : COLORS.bgCard,
                      border: `1px solid ${dia.esHoy ? COLORS.gold : COLORS.border}`,
                      borderRadius: '10px',
                      padding: '10px',
                      minHeight: '110px',
                      cursor: dia.contenido ? 'pointer' : 'default',
                      opacity: dia.esPasado && !dia.contenido ? 0.4 : 1,
                      position: 'relative',
                    }}
                  >
                    {/* Estado dot */}
                    <div style={{ position: 'absolute', top: '8px', right: '8px', width: '8px', height: '8px', borderRadius: '50%', background: estadoColor }} />

                    {/* Número */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <span style={{ fontSize: '16px', fontWeight: dia.esHoy ? '700' : '500', color: dia.esHoy ? COLORS.gold : COLORS.text }}>{dia.dia}</span>
                      <div style={{ display: 'flex', gap: '2px' }}>
                        {dia.faseLunar && <span title={dia.faseLunar.nombre}>{dia.faseLunar.icono}</span>}
                        {dia.fechaEspecial && <span title={dia.fechaEspecial.nombre}>{dia.fechaEspecial.icono}</span>}
                      </div>
                    </div>

                    {/* Tipo del día */}
                    <div style={{ fontSize: '10px', color: COLORS.textDim, marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <span>{dia.estructura.icono}</span>
                      <span>{dia.estructura.nombre}</span>
                    </div>

                    {/* Contenido o botón generar */}
                    {dia.contenido ? (
                      <div style={{
                        fontSize: '11px',
                        color: COLORS.text,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        lineHeight: '1.4',
                      }}>
                        {dia.contenido.titulo}
                      </div>
                    ) : !dia.esPasado && (
                      <button
                        onClick={(e) => { e.stopPropagation(); generarDia(dia.fechaKey); }}
                        disabled={loading[dia.fechaKey]}
                        style={{
                          fontSize: '10px',
                          padding: '4px 8px',
                          background: COLORS.bgElevated,
                          border: `1px solid ${COLORS.border}`,
                          borderRadius: '4px',
                          color: COLORS.textMuted,
                          cursor: 'pointer',
                        }}
                      >
                        {loading[dia.fechaKey] ? '...' : '+ Generar'}
                      </button>
                    )}

                    {/* Sabbat badge */}
                    {dia.fechaEspecial && (
                      <div style={{
                        position: 'absolute',
                        bottom: '6px',
                        left: '6px',
                        right: '6px',
                        fontSize: '8px',
                        padding: '2px 4px',
                        background: `${COLORS.orange}22`,
                        border: `1px solid ${COLORS.orange}`,
                        borderRadius: '4px',
                        color: COLORS.orange,
                        textAlign: 'center',
                        textOverflow: 'ellipsis',
                        overflow: 'hidden',
                        whiteSpace: 'nowrap',
                      }}>
                        {dia.fechaEspecial.nombre}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Panel de contenido seleccionado */}
            {contenidoSeleccionado && contenidos[contenidoSeleccionado] && (
              <div style={{
                marginTop: '24px',
                background: COLORS.bgCard,
                border: `1px solid ${COLORS.border}`,
                borderRadius: '16px',
                overflow: 'hidden',
              }}>
                <div style={{
                  padding: '20px 24px',
                  borderBottom: `1px solid ${COLORS.border}`,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                }}>
                  <div>
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
                      <span style={{ padding: '4px 10px', background: `${COLORS.purple}22`, borderRadius: '20px', fontSize: '11px', color: COLORS.purple }}>
                        {contenidos[contenidoSeleccionado].categoria}
                      </span>
                      <span style={{ padding: '4px 10px', background: `${COLORS.cyan}22`, borderRadius: '20px', fontSize: '11px', color: COLORS.cyan }}>
                        {contenidos[contenidoSeleccionado].tipo}
                      </span>
                      <span style={{
                        padding: '4px 10px',
                        background: contenidos[contenidoSeleccionado].estado === 'publicado' ? `${COLORS.emerald}22` : `${COLORS.amber}22`,
                        borderRadius: '20px',
                        fontSize: '11px',
                        color: contenidos[contenidoSeleccionado].estado === 'publicado' ? COLORS.emerald : COLORS.amber,
                      }}>
                        {contenidos[contenidoSeleccionado].estado === 'publicado' ? '✓ Publicado' : 'Borrador'}
                      </span>
                    </div>
                    <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '6px' }}>
                      {contenidos[contenidoSeleccionado].titulo}
                    </h3>
                    <p style={{ color: COLORS.textMuted, fontSize: '13px' }}>{contenidoSeleccionado}</p>
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => generarDia(contenidoSeleccionado)}
                      disabled={loading[contenidoSeleccionado]}
                      style={{ padding: '10px 14px', background: COLORS.bgElevated, border: `1px solid ${COLORS.border}`, borderRadius: '8px', color: COLORS.text, cursor: 'pointer', fontSize: '13px' }}
                    >
                      {loading[contenidoSeleccionado] ? '...' : '🔄 Regenerar'}
                    </button>

                    {contenidos[contenidoSeleccionado].estado !== 'publicado' && (
                      <button
                        onClick={() => publicarContenido(contenidoSeleccionado)}
                        disabled={loading[`pub-${contenidoSeleccionado}`]}
                        style={{ padding: '10px 14px', background: COLORS.emerald, border: 'none', borderRadius: '8px', color: 'white', cursor: 'pointer', fontSize: '13px', fontWeight: '600' }}
                      >
                        {loading[`pub-${contenidoSeleccionado}`] ? '...' : '🚀 Publicar'}
                      </button>
                    )}

                    <button
                      onClick={() => setContenidoSeleccionado(null)}
                      style={{ padding: '10px', background: COLORS.bgElevated, border: `1px solid ${COLORS.border}`, borderRadius: '8px', color: COLORS.textMuted, cursor: 'pointer' }}
                    >✕</button>
                  </div>
                </div>

                <div style={{ padding: '20px 24px', maxHeight: '500px', overflowY: 'auto' }}>
                  {/* Imagen si existe */}
                  {contenidos[contenidoSeleccionado].imagen && (
                    <img
                      src={contenidos[contenidoSeleccionado].imagen}
                      alt=""
                      style={{ width: '100%', maxHeight: '250px', objectFit: 'cover', borderRadius: '12px', marginBottom: '20px' }}
                    />
                  )}

                  {/* Extracto */}
                  {contenidos[contenidoSeleccionado].extracto && (
                    <p style={{ fontStyle: 'italic', color: COLORS.gold, marginBottom: '20px', fontSize: '15px' }}>
                      {contenidos[contenidoSeleccionado].extracto}
                    </p>
                  )}

                  {/* Contenido por secciones */}
                  {contenidos[contenidoSeleccionado].secciones ? (
                    <div style={{ fontSize: '14px', lineHeight: '1.8', color: COLORS.textMuted }}>
                      {['intro', 'desarrollo', 'practica', 'cierre'].map(seccion => (
                        contenidos[contenidoSeleccionado].secciones[seccion] && (
                          <div key={seccion} style={{ marginBottom: '20px' }}>
                            <h4 style={{ color: COLORS.text, fontWeight: '600', marginBottom: '8px', textTransform: 'capitalize' }}>
                              {seccion === 'practica' ? 'Práctica' : seccion}
                            </h4>
                            <p style={{ whiteSpace: 'pre-wrap' }}>{contenidos[contenidoSeleccionado].secciones[seccion]}</p>
                          </div>
                        )
                      ))}
                    </div>
                  ) : (
                    <div style={{ fontSize: '14px', lineHeight: '1.8', whiteSpace: 'pre-wrap', color: COLORS.textMuted }}>
                      {contenidos[contenidoSeleccionado].contenido}
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}

        {/* ═══ TAB: AUTOMATIZACIÓN ═══ */}
        {tab === 'automatizacion' && (
          <div style={{ maxWidth: '800px' }}>
            <div style={{ background: COLORS.bgCard, border: `1px solid ${COLORS.border}`, borderRadius: '16px', padding: '24px', marginBottom: '24px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '20px' }}>⚡ Configuración</h3>

              {[
                { key: 'autoGenerar', label: 'Generar contenido automáticamente', desc: 'Claude genera la semana cada domingo' },
                { key: 'autoPublicar', label: 'Publicar automáticamente', desc: `Publicar diario a las ${config.horaPublicacion}`, hasTime: true },
                { key: 'regaloLunaLlena', label: '🌕 Regalo en Luna Llena', desc: 'Enviar lectura gratis a todos' },
                { key: 'regalosSabbats', label: '🎃 Regalos en Sabbats', desc: 'Regalo especial en cada sabbat' },
                { key: 'notificarEmail', label: '📧 Notificar por email', desc: 'Email cuando hay contenido nuevo' },
              ].map(item => (
                <div key={item.key} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '16px',
                  background: COLORS.bgElevated,
                  borderRadius: '12px',
                  marginBottom: '12px',
                }}>
                  <div>
                    <div style={{ fontWeight: '600', marginBottom: '4px' }}>{item.label}</div>
                    <div style={{ fontSize: '13px', color: COLORS.textMuted }}>{item.desc}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {item.hasTime && (
                      <input
                        type="time"
                        value={config.horaPublicacion}
                        onChange={(e) => setConfig(prev => ({ ...prev, horaPublicacion: e.target.value }))}
                        style={{ padding: '6px 10px', background: COLORS.bgCard, border: `1px solid ${COLORS.border}`, borderRadius: '6px', color: COLORS.text, fontSize: '13px' }}
                      />
                    )}
                    <button
                      onClick={() => setConfig(prev => ({ ...prev, [item.key]: !prev[item.key] }))}
                      style={{
                        width: '52px',
                        height: '28px',
                        borderRadius: '14px',
                        background: config[item.key] ? COLORS.emerald : COLORS.bgCard,
                        border: `1px solid ${config[item.key] ? COLORS.emerald : COLORS.border}`,
                        cursor: 'pointer',
                        position: 'relative',
                      }}
                    >
                      <span style={{
                        position: 'absolute',
                        top: '3px',
                        left: config[item.key] ? '26px' : '3px',
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%',
                        background: 'white',
                        transition: 'left 0.2s',
                      }} />
                    </button>
                  </div>
                </div>
              ))}

              <button
                onClick={guardarConfig}
                disabled={loading.config}
                style={{
                  marginTop: '12px',
                  width: '100%',
                  padding: '14px',
                  background: `linear-gradient(135deg, ${COLORS.gold}, ${COLORS.amber})`,
                  border: 'none',
                  borderRadius: '10px',
                  color: '#000',
                  fontSize: '15px',
                  fontWeight: '600',
                  cursor: 'pointer',
                }}
              >
                {loading.config ? 'Guardando...' : '💾 Guardar configuración'}
              </button>
            </div>

            {/* Próximos eventos */}
            <div style={{ background: COLORS.bgCard, border: `1px solid ${COLORS.border}`, borderRadius: '16px', padding: '24px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '20px' }}>📅 Próximos eventos automáticos</h3>

              {FECHAS_ESPECIALES.slice(0, 5).map((evento, i) => {
                const [mm, dd] = evento.fecha.split('-');
                let fechaEvento = new Date(año, parseInt(mm) - 1, parseInt(dd));
                if (fechaEvento < new Date()) fechaEvento.setFullYear(año + 1);
                const diasPara = Math.ceil((fechaEvento - new Date()) / (1000 * 60 * 60 * 24));

                return (
                  <div key={i} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '14px',
                    padding: '12px',
                    background: COLORS.bgElevated,
                    borderRadius: '10px',
                    marginBottom: '8px',
                  }}>
                    <span style={{ fontSize: '26px' }}>{evento.icono}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: '600' }}>{evento.nombre}</div>
                      <div style={{ fontSize: '12px', color: COLORS.textMuted }}>Regalo: {TIPOS_REGALO[evento.regalo]?.nombre}</div>
                    </div>
                    <span style={{
                      padding: '5px 12px',
                      background: diasPara <= 7 ? `${COLORS.amber}22` : COLORS.bgCard,
                      borderRadius: '16px',
                      fontSize: '12px',
                      color: diasPara <= 7 ? COLORS.amber : COLORS.textMuted,
                    }}>
                      {diasPara === 0 ? 'HOY' : `${diasPara} días`}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ═══ TAB: REGALOS ═══ */}
        {tab === 'regalos' && (
          <div>
            <div style={{
              background: `linear-gradient(135deg, ${COLORS.pink}15, ${COLORS.purple}15)`,
              border: `1px solid ${COLORS.pink}40`,
              borderRadius: '16px',
              padding: '24px',
              marginBottom: '24px',
            }}>
              <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '8px' }}>🎁 Enviar regalo a TODOS</h3>
              <p style={{ color: COLORS.textMuted, marginBottom: '20px' }}>
                Envía un regalo a los {stats.activos} miembros activos
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '12px' }}>
                {Object.entries(TIPOS_REGALO).map(([id, regalo]) => (
                  <button
                    key={id}
                    onClick={() => enviarRegaloMasivo(id)}
                    disabled={loading.regalo}
                    style={{
                      padding: '18px',
                      background: COLORS.bgCard,
                      border: `1px solid ${COLORS.border}`,
                      borderRadius: '12px',
                      cursor: loading.regalo ? 'not-allowed' : 'pointer',
                      textAlign: 'center',
                      opacity: loading.regalo ? 0.5 : 1,
                    }}
                  >
                    <span style={{ fontSize: '32px', display: 'block', marginBottom: '8px' }}>{regalo.icono}</span>
                    <div style={{ fontWeight: '600', color: COLORS.text, marginBottom: '2px' }}>{regalo.nombre}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Regalos programados del mes */}
            <div style={{ background: COLORS.bgCard, border: `1px solid ${COLORS.border}`, borderRadius: '16px', padding: '24px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '20px' }}>📜 Regalos automáticos de {MESES[mes]}</h3>

              {/* Lunas llenas */}
              {Object.entries(fasesLunares).filter(([_, f]) => f.tipo === 'llena').map(([fecha, fase]) => (
                <div key={fecha} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  padding: '12px',
                  background: COLORS.bgElevated,
                  borderRadius: '10px',
                  marginBottom: '8px',
                }}>
                  <span style={{ fontSize: '24px' }}>{fase.icono}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: '600' }}>{fase.nombre}</div>
                    <div style={{ fontSize: '12px', color: COLORS.textMuted }}>{fecha}</div>
                  </div>
                  <span style={{ padding: '5px 12px', background: `${COLORS.purple}22`, borderRadius: '16px', fontSize: '12px', color: COLORS.purple }}>
                    {config.regaloLunaLlena ? TIPOS_REGALO.lectura.nombre : 'Desactivado'}
                  </span>
                </div>
              ))}

              {/* Sabbats del mes */}
              {FECHAS_ESPECIALES.filter(f => {
                const [mm] = f.fecha.split('-');
                return parseInt(mm) === mes + 1;
              }).map((evento, i) => (
                <div key={i} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  padding: '12px',
                  background: COLORS.bgElevated,
                  borderRadius: '10px',
                  marginBottom: '8px',
                }}>
                  <span style={{ fontSize: '24px' }}>{evento.icono}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: '600' }}>{evento.nombre}</div>
                    <div style={{ fontSize: '12px', color: COLORS.textMuted }}>{año}-{evento.fecha}</div>
                  </div>
                  <span style={{ padding: '5px 12px', background: `${COLORS.orange}22`, borderRadius: '16px', fontSize: '12px', color: COLORS.orange }}>
                    {config.regalosSabbats ? TIPOS_REGALO[evento.regalo]?.nombre : 'Desactivado'}
                  </span>
                </div>
              ))}

              {Object.keys(fasesLunares).filter(f => fasesLunares[f].tipo === 'llena').length === 0 &&
               FECHAS_ESPECIALES.filter(f => parseInt(f.fecha.split('-')[0]) === mes + 1).length === 0 && (
                <p style={{ color: COLORS.textMuted, textAlign: 'center', padding: '20px' }}>
                  No hay eventos especiales este mes
                </p>
              )}
            </div>
          </div>
        )}

        {/* ═══ TAB: MIEMBROS ═══ */}
        {tab === 'miembros' && (
          <div style={{ background: COLORS.bgCard, border: `1px solid ${COLORS.border}`, borderRadius: '16px', overflow: 'hidden' }}>
            <div style={{ padding: '20px 24px', borderBottom: `1px solid ${COLORS.border}` }}>
              <h3 style={{ fontSize: '18px', fontWeight: 'bold' }}>👥 Miembros ({stats.activos} activos)</h3>
            </div>

            <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
              {miembros.length === 0 ? (
                <div style={{ padding: '60px', textAlign: 'center', color: COLORS.textMuted }}>
                  <span style={{ fontSize: '48px', display: 'block', marginBottom: '16px' }}>👥</span>
                  No hay miembros
                </div>
              ) : miembros.map((m, i) => (
                <div key={i} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  padding: '14px 24px',
                  borderBottom: `1px solid ${COLORS.border}`,
                }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: `linear-gradient(135deg, ${COLORS.gold}, ${COLORS.amber})`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#000',
                    fontWeight: 'bold',
                  }}>
                    {(m.nombre || m.email)?.[0]?.toUpperCase()}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: '600' }}>{m.nombre || m.email}</div>
                    <div style={{ fontSize: '12px', color: COLORS.textMuted }}>{m.email}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{
                      padding: '4px 10px',
                      background: m.activo ? `${COLORS.emerald}22` : `${COLORS.error}22`,
                      borderRadius: '16px',
                      fontSize: '11px',
                      color: m.activo ? COLORS.emerald : COLORS.error,
                    }}>
                      {m.activo ? 'Activo' : 'Inactivo'}
                    </span>
                    <div style={{ fontSize: '10px', color: COLORS.textDim, marginTop: '4px' }}>
                      {m.expira ? `Vence: ${new Date(m.expira).toLocaleDateString()}` : ''}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        .spinner {
          width: 18px;
          height: 18px;
          border: 2px solid rgba(0,0,0,0.2);
          border-top-color: #000;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
      `}</style>
    </div>
  );
}
