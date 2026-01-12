'use client';
import { useState, useEffect } from 'react';

// ═══════════════════════════════════════════════════════════════
// ESTUDIO CREATIVO - SISTEMA AUTOMATIZADO
// Un clic = mes completo con Guardián de la Semana
// ═══════════════════════════════════════════════════════════════

const MESES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
const DIAS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

const ESTRUCTURA = {
  0: { nombre: 'Ritual', icono: '🕯️', color: '#F97316' },
  1: { nombre: 'Meditación', icono: '🧘', color: '#10B981' },
  2: { nombre: 'Sabiduría', icono: '🔮', color: '#A78BFA' },
  3: { nombre: 'DIY', icono: '✂️', color: '#EC4899' },
  4: { nombre: 'Guardián', icono: '🧙', color: '#F59E0B' },
  5: { nombre: 'Luna', icono: '🌙', color: '#8B5CF6' },
  6: { nombre: 'Bienestar', icono: '💚', color: '#14B8A6' },
};

// Colores cálidos
const C = {
  bg: '#1f1a24',
  card: '#2a2430',
  elevated: '#352f3a',
  hover: '#3f3845',
  border: '#4a4350',
  gold: '#D4A853',
  goldLight: '#E8C97D',
  text: '#fff',
  muted: '#a09aab',
  dim: '#706a7a',
  success: '#22c55e',
  purple: '#8B5CF6',
  error: '#ef4444',
};

export default function EstudioCreativo() {
  const [mes, setMes] = useState(new Date().getMonth() + 1);
  const [año, setAño] = useState(new Date().getFullYear());
  const [contenidos, setContenidos] = useState([]);
  const [guardianesSemana, setGuardianesSemana] = useState([]);
  const [loading, setLoading] = useState(false);
  const [diaSeleccionado, setDiaSeleccionado] = useState(null);
  const [mensaje, setMensaje] = useState(null);

  useEffect(() => {
    cargarMes();
  }, [mes, año]);

  const mostrarMensaje = (texto, tipo = 'ok') => {
    setMensaje({ texto, tipo });
    setTimeout(() => setMensaje(null), 5000);
  };

  const cargarMes = async () => {
    try {
      const res = await fetch(`/api/admin/circulo/contenidos?mes=${mes}&año=${año}`);
      const data = await res.json();
      if (data.success) {
        setContenidos(data.contenidos || []);
        // Extraer guardianes por semana si existen
        if (data.indice?.guardianesPorSemana) {
          setGuardianesSemana(data.indice.guardianesPorSemana);
        }
      }
    } catch (e) {
      console.error('Error cargando:', e);
    }
  };

  // ════════════════════════════════════════════════════════════
  // GENERAR MES COMPLETO - UN SOLO CLIC
  // ════════════════════════════════════════════════════════════
  const generarMesCompleto = async () => {
    if (loading) return;

    if (!confirm(`¿Generar contenido completo para ${MESES[mes-1]} ${año}?\n\nEsto generará contenido para todos los días con Guardianes de la Semana asignados automáticamente.\n\nPuede tardar varios minutos.`)) {
      return;
    }

    setLoading(true);
    mostrarMensaje('Generando mes completo con Guardianes... (esto puede tardar varios minutos)', 'info');

    try {
      const res = await fetch('/api/admin/circulo/generar-mes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mes, año })
      });
      const data = await res.json();

      if (data.success) {
        setContenidos(data.contenidos || []);
        setGuardianesSemana(data.guardianesPorSemana || []);
        mostrarMensaje(`¡Listo! ${data.contenidos?.length || 0} contenidos generados con ${data.guardianesPorSemana?.length || 0} guardianes`);
      } else {
        mostrarMensaje(data.error || 'Error al generar', 'error');
      }
    } catch (e) {
      mostrarMensaje(e.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  // Publicar todo el mes
  const publicarMes = async () => {
    if (!confirm(`¿Publicar todos los contenidos de ${MESES[mes-1]}?`)) return;

    mostrarMensaje('Publicando...', 'info');
    try {
      const res = await fetch('/api/admin/circulo/publicar-mes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mes, año })
      });
      const data = await res.json();
      if (data.success) {
        await cargarMes();
        mostrarMensaje(`¡${data.publicados} contenidos publicados!`);
      }
    } catch (e) {
      mostrarMensaje(e.message, 'error');
    }
  };

  // ════════════════════════════════════════════════════════════
  // CALENDARIO
  // ════════════════════════════════════════════════════════════
  const getCalendario = () => {
    const primerDia = new Date(año, mes - 1, 1);
    const ultimoDia = new Date(año, mes, 0);
    const dias = [];

    // Días vacíos antes del primer día
    for (let i = 0; i < primerDia.getDay(); i++) {
      dias.push(null);
    }

    // Días del mes
    for (let d = 1; d <= ultimoDia.getDate(); d++) {
      dias.push(d);
    }

    return dias;
  };

  const getContenidoDia = (dia) => contenidos.find(c => c.dia === dia);

  const getNumeroSemana = (dia) => {
    const fecha = new Date(año, mes - 1, dia);
    const primerDia = new Date(año, mes - 1, 1);
    return Math.ceil((dia + primerDia.getDay()) / 7);
  };

  const getGuardianSemana = (semana) => {
    return guardianesSemana.find(g => g.semana === semana)?.guardian;
  };

  const contenidoSeleccionado = diaSeleccionado ? getContenidoDia(diaSeleccionado) : null;

  // ════════════════════════════════════════════════════════════
  // RENDER
  // ════════════════════════════════════════════════════════════
  return (
    <div style={{ minHeight: '100vh', background: `linear-gradient(135deg, ${C.bg} 0%, #15111a 100%)`, color: C.text, display: 'flex' }}>

      {/* ÁREA PRINCIPAL */}
      <div style={{ flex: 1, padding: 24, overflowY: 'auto' }}>

        {/* Toast */}
        {mensaje && (
          <div style={{
            position: 'fixed', top: 20, right: 20, padding: '16px 24px', zIndex: 1000,
            background: mensaje.tipo === 'error' ? C.error : mensaje.tipo === 'info' ? C.purple : C.success,
            borderRadius: 12, fontWeight: 500, boxShadow: '0 4px 20px rgba(0,0,0,0.4)', maxWidth: 400
          }}>
            {mensaje.texto}
          </div>
        )}

        {/* Header */}
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontSize: 28, fontWeight: 'bold', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 32 }}>🎨</span> Estudio Creativo
          </h1>
          <p style={{ color: C.muted }}>
            Sistema automatizado • Un clic genera el mes completo con Guardianes de la Semana
          </p>
        </div>

        {/* Controles */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>

          {/* Navegación mes */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button onClick={() => { if (mes === 1) { setMes(12); setAño(año - 1); } else setMes(mes - 1); }}
              style={{ padding: '10px 16px', background: C.elevated, border: 'none', borderRadius: 10, color: C.text, cursor: 'pointer' }}>
              ←
            </button>
            <h2 style={{ fontSize: 22, fontWeight: 'bold', minWidth: 180, textAlign: 'center' }}>
              {MESES[mes - 1]} {año}
            </h2>
            <button onClick={() => { if (mes === 12) { setMes(1); setAño(año + 1); } else setMes(mes + 1); }}
              style={{ padding: '10px 16px', background: C.elevated, border: 'none', borderRadius: 10, color: C.text, cursor: 'pointer' }}>
              →
            </button>
          </div>

          {/* Stats + Botón principal */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ padding: '8px 14px', background: `${C.purple}22`, border: `1px solid ${C.purple}`, borderRadius: 8, color: C.purple, fontSize: 13 }}>
              {contenidos.length} generados
            </span>
            <span style={{ padding: '8px 14px', background: `${C.success}22`, border: `1px solid ${C.success}`, borderRadius: 8, color: C.success, fontSize: 13 }}>
              {contenidos.filter(c => c.estado === 'publicado').length} publicados
            </span>

            {contenidos.length > 0 && (
              <button onClick={publicarMes} style={{
                padding: '12px 20px', background: C.success, border: 'none', borderRadius: 10,
                color: '#fff', fontWeight: 600, cursor: 'pointer'
              }}>
                🚀 Publicar mes
              </button>
            )}

            <button onClick={generarMesCompleto} disabled={loading} style={{
              padding: '12px 24px',
              background: loading ? C.dim : `linear-gradient(135deg, ${C.gold}, ${C.goldLight})`,
              border: 'none', borderRadius: 10, color: loading ? C.muted : '#000',
              fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', fontSize: 14
            }}>
              {loading ? '⏳ Generando...' : '✨ Generar mes completo'}
            </button>
          </div>
        </div>

        {/* Guardianes de la Semana */}
        {guardianesSemana.length > 0 && (
          <div style={{ marginBottom: 24, padding: 20, background: C.card, borderRadius: 16, border: `1px solid ${C.border}` }}>
            <h3 style={{ fontSize: 14, color: C.gold, marginBottom: 16, fontWeight: 600 }}>🧙 GUARDIANES DEL MES</h3>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              {guardianesSemana.map(({ semana, guardian }) => (
                <div key={semana} style={{
                  padding: '12px 16px', background: C.elevated, borderRadius: 12,
                  border: `2px solid ${guardian.color}44`, flex: '1 1 150px', minWidth: 150
                }}>
                  <div style={{ fontSize: 11, color: C.muted, marginBottom: 4 }}>Semana {semana}</div>
                  <div style={{ fontWeight: 600, color: guardian.color }}>{guardian.nombre}</div>
                  <div style={{ fontSize: 11, color: C.dim }}>{guardian.titulo}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Días de la semana */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 6, marginBottom: 8 }}>
          {DIAS.map((d, i) => (
            <div key={d} style={{ padding: '10px', textAlign: 'center', fontSize: 12, color: C.muted, background: C.card, borderRadius: 8 }}>
              {d}
              <div style={{ fontSize: 10, color: ESTRUCTURA[i]?.color, marginTop: 4 }}>
                {ESTRUCTURA[i]?.icono} {ESTRUCTURA[i]?.nombre}
              </div>
            </div>
          ))}
        </div>

        {/* Calendario */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 6 }}>
          {getCalendario().map((dia, i) => {
            if (!dia) return <div key={i} style={{ background: C.card, borderRadius: 12, minHeight: 100, opacity: 0.3 }} />;

            const contenido = getContenidoDia(dia);
            const esHoy = dia === new Date().getDate() && mes === new Date().getMonth() + 1 && año === new Date().getFullYear();
            const diaSemana = new Date(año, mes - 1, dia).getDay();
            const estructura = ESTRUCTURA[diaSemana];
            const seleccionado = diaSeleccionado === dia;
            const semana = getNumeroSemana(dia);
            const guardian = getGuardianSemana(semana);

            return (
              <div
                key={i}
                onClick={() => setDiaSeleccionado(dia)}
                style={{
                  background: seleccionado ? `${C.gold}30` : esHoy ? `${C.gold}15` : C.card,
                  border: `2px solid ${seleccionado ? C.gold : esHoy ? C.gold + '80' : contenido?.estado === 'publicado' ? C.success : contenido ? C.purple : C.border}`,
                  borderRadius: 12,
                  padding: 10,
                  minHeight: 100,
                  cursor: 'pointer',
                  position: 'relative',
                  transition: 'all 0.2s'
                }}
              >
                {/* Estado */}
                <div style={{
                  position: 'absolute', top: 8, right: 8,
                  width: 10, height: 10, borderRadius: '50%',
                  background: contenido?.estado === 'publicado' ? C.success : contenido ? C.purple : C.border
                }} />

                {/* Guardián badge */}
                {contenido?.guardian && (
                  <div style={{
                    position: 'absolute', top: 6, left: 6,
                    background: contenido.guardian.color, borderRadius: '50%',
                    width: 22, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 12
                  }} title={contenido.guardian.nombre}>
                    🧙
                  </div>
                )}

                <div style={{
                  fontWeight: esHoy ? 700 : 500,
                  color: esHoy ? C.gold : 'white',
                  marginBottom: 4,
                  fontSize: 16,
                  marginTop: contenido?.guardian ? 20 : 0
                }}>
                  {dia}
                </div>

                {contenido ? (
                  <div>
                    <div style={{
                      fontSize: 11, color: '#e5e7eb', lineHeight: 1.3,
                      overflow: 'hidden', display: '-webkit-box',
                      WebkitLineClamp: 2, WebkitBoxOrient: 'vertical'
                    }}>
                      {contenido.titulo}
                    </div>
                    {contenido.guardian && (
                      <div style={{ fontSize: 9, color: contenido.guardian.color, marginTop: 4 }}>
                        por {contenido.guardian.nombre}
                      </div>
                    )}
                  </div>
                ) : (
                  <div style={{ fontSize: 10, color: estructura?.color, marginTop: 8 }}>
                    {estructura?.icono} {estructura?.nombre}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Leyenda */}
        <div style={{ display: 'flex', gap: 20, padding: '16px', background: C.card, borderRadius: 10, marginTop: 16, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: C.muted }}>
            <span style={{ width: 12, height: 12, borderRadius: '50%', background: C.success }} /> Publicado
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: C.muted }}>
            <span style={{ width: 12, height: 12, borderRadius: '50%', background: C.purple }} /> Generado
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: C.muted }}>
            <span style={{ width: 12, height: 12, borderRadius: '50%', background: C.border }} /> Sin contenido
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: C.muted }}>
            <span style={{ width: 22, height: 22, borderRadius: '50%', background: C.gold, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12 }}>🧙</span>
            Con Guardián
          </div>
        </div>
      </div>

      {/* PANEL LATERAL - Vista del contenido */}
      <div style={{
        width: diaSeleccionado ? 420 : 0,
        background: C.card,
        borderLeft: `1px solid ${C.border}`,
        transition: 'width 0.3s ease',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {diaSeleccionado && (
          <div style={{ padding: 24, overflowY: 'auto', flex: 1, width: 420 }}>

            {/* Header panel */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ color: C.gold, fontSize: 18 }}>
                📝 Día {diaSeleccionado}
              </h3>
              <button onClick={() => setDiaSeleccionado(null)} style={{
                background: 'none', border: 'none', color: C.muted, cursor: 'pointer', fontSize: 20
              }}>
                ✕
              </button>
            </div>

            {contenidoSeleccionado ? (
              <>
                {/* Info del Guardián */}
                {contenidoSeleccionado.guardian && (
                  <div style={{
                    background: `${contenidoSeleccionado.guardian.color}15`,
                    border: `1px solid ${contenidoSeleccionado.guardian.color}`,
                    borderRadius: 12, padding: 16, marginBottom: 20
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <span style={{ fontSize: 28 }}>🧙</span>
                      <div>
                        <div style={{ fontWeight: 600, color: contenidoSeleccionado.guardian.color }}>
                          {contenidoSeleccionado.guardian.nombre}
                        </div>
                        <div style={{ fontSize: 12, color: C.muted }}>
                          {contenidoSeleccionado.guardian.titulo} • {contenidoSeleccionado.guardian.elemento}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Título */}
                <div style={{ marginBottom: 16 }}>
                  <label style={{ fontSize: 12, color: C.muted, display: 'block', marginBottom: 6 }}>Título</label>
                  <div style={{ fontSize: 18, fontWeight: 600, color: C.gold }}>
                    {contenidoSeleccionado.titulo}
                  </div>
                </div>

                {/* Extracto */}
                <div style={{ marginBottom: 16 }}>
                  <label style={{ fontSize: 12, color: C.muted, display: 'block', marginBottom: 6 }}>Extracto</label>
                  <div style={{ fontSize: 14, color: C.text, lineHeight: 1.5 }}>
                    {contenidoSeleccionado.extracto}
                  </div>
                </div>

                {/* Estado y tipo */}
                <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
                  <span style={{
                    padding: '6px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600,
                    background: contenidoSeleccionado.estado === 'publicado' ? `${C.success}22` : `${C.purple}22`,
                    color: contenidoSeleccionado.estado === 'publicado' ? C.success : C.purple
                  }}>
                    {contenidoSeleccionado.estado === 'publicado' ? '✓ Publicado' : '○ Borrador'}
                  </span>
                  <span style={{
                    padding: '6px 12px', borderRadius: 20, fontSize: 12,
                    background: C.elevated, color: C.muted
                  }}>
                    {contenidoSeleccionado.icono} {contenidoSeleccionado.tipo}
                  </span>
                </div>

                {/* Secciones */}
                {['intro', 'desarrollo', 'practica', 'cierre'].map(seccion => (
                  <div key={seccion} style={{ marginBottom: 16 }}>
                    <label style={{
                      fontSize: 11, color: C.gold, display: 'block', marginBottom: 6,
                      textTransform: 'uppercase', letterSpacing: 1
                    }}>
                      {seccion}
                    </label>
                    <div style={{
                      fontSize: 13, color: C.text, lineHeight: 1.7,
                      background: C.elevated, padding: 12, borderRadius: 8,
                      maxHeight: 150, overflowY: 'auto'
                    }}>
                      {contenidoSeleccionado.secciones?.[seccion] || 'Sin contenido'}
                    </div>
                  </div>
                ))}

                {/* Fecha especial */}
                {contenidoSeleccionado.especial && (
                  <div style={{
                    background: `${C.gold}15`, border: `1px solid ${C.gold}`,
                    borderRadius: 12, padding: 16, marginTop: 16
                  }}>
                    <div style={{ fontWeight: 600, color: C.gold }}>
                      ✨ {contenidoSeleccionado.especial.nombre}
                    </div>
                    <div style={{ fontSize: 13, color: C.muted, marginTop: 4 }}>
                      {contenidoSeleccionado.especial.tematica}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div style={{ textAlign: 'center', padding: '40px 20px', color: C.muted }}>
                <span style={{ fontSize: 48, display: 'block', marginBottom: 16 }}>📝</span>
                <p>No hay contenido generado para este día.</p>
                <p style={{ fontSize: 13, marginTop: 8 }}>Usá "Generar mes completo" para crear todo el contenido.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
