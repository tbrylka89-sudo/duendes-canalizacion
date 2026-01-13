'use client';
import { useState, useEffect } from 'react';

// ═══════════════════════════════════════════════════════════════
// EL CÍRCULO - SISTEMA AUTOMÁTICO UNIFICADO
// ═══════════════════════════════════════════════════════════════

const MESES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

export default function CirculoPage() {
  const [mes, setMes] = useState(new Date().getMonth() + 1);
  const [año, setAño] = useState(new Date().getFullYear());
  const [contenidos, setContenidos] = useState([]);
  const [contenidoAbierto, setContenidoAbierto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingDia, setLoadingDia] = useState(null);
  const [mensaje, setMensaje] = useState(null);

  // Cargar contenidos del mes
  useEffect(() => {
    cargarContenidos();
  }, [mes, año]);

  const mostrarMensaje = (texto, tipo = 'ok') => {
    setMensaje({ texto, tipo });
    setTimeout(() => setMensaje(null), 4000);
  };

  const cargarContenidos = async () => {
    try {
      const res = await fetch(`/api/admin/circulo/contenidos?mes=${mes}&año=${año}`);
      const data = await res.json();
      if (data.success) {
        setContenidos(data.contenidos || []);
      }
    } catch (e) {
      console.error('Error cargando:', e);
    }
  };

  // Buscar contenido por día
  const getContenidoDia = (dia) => {
    return contenidos.find(c => c.dia === dia);
  };

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
        body: JSON.stringify({ dia, mes, año, soloImagen })
      });
      const data = await res.json();

      if (data.success && data.contenido) {
        setContenidos(prev => {
          const filtered = prev.filter(c => c.dia !== dia);
          return [...filtered, data.contenido];
        });
        if (contenidoAbierto?.dia === dia) {
          setContenidoAbierto(data.contenido);
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

  // Eliminar contenido
  const eliminarContenido = async (contenido) => {
    if (!confirm(`¿Eliminar el contenido del día ${contenido.dia}?`)) return;

    try {
      const res = await fetch(`/api/admin/circulo/contenidos?dia=${contenido.dia}&mes=${contenido.mes}&año=${contenido.año}`, {
        method: 'DELETE'
      });
      const data = await res.json();

      if (data.success) {
        setContenidos(prev => prev.filter(c => c.dia !== contenido.dia));
        setContenidoAbierto(null);
        mostrarMensaje('Contenido eliminado');
      } else {
        mostrarMensaje(data.error || 'Error al eliminar', 'error');
      }
    } catch (e) {
      mostrarMensaje(e.message, 'error');
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
          tipo: contenido.tipo
        })
      });

      const data = await res.json();
      if (data.success) {
        // Marcar como publicado
        await fetch('/api/admin/circulo/contenidos', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ dia: contenido.dia, mes: contenido.mes, año: contenido.año, estado: 'publicado' })
        });

        setContenidos(prev => prev.map(c =>
          c.dia === contenido.dia ? { ...c, estado: 'publicado' } : c
        ));
        mostrarMensaje('¡Publicado en El Círculo!');
      }
    } catch (e) {
      mostrarMensaje(e.message, 'error');
    }
  };

  // Generar calendario
  const diasEnMes = new Date(año, mes, 0).getDate();
  const primerDia = new Date(año, mes - 1, 1).getDay();
  const calendario = [];

  for (let i = 0; i < primerDia; i++) calendario.push(null);
  for (let d = 1; d <= diasEnMes; d++) calendario.push(d);

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0f', color: 'white', padding: '20px' }}>
      {/* Mensaje */}
      {mensaje && (
        <div style={{
          position: 'fixed', top: 20, right: 20, padding: '14px 24px', zIndex: 1000,
          background: mensaje.tipo === 'error' ? '#ef4444' : mensaje.tipo === 'info' ? '#0ea5e9' : '#22c55e',
          borderRadius: 10, fontWeight: 500
        }}>
          {mensaje.texto}
        </div>
      )}

      {/* Header */}
      <div style={{ marginBottom: 30, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 20 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 'bold', marginBottom: 4 }}>🌙 El Círculo - Contenido Automático</h1>
          <p style={{ color: '#9ca3af' }}>Genera y publica contenido para todo el mes</p>
        </div>

        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <span style={{ padding: '8px 16px', background: '#8B5CF615', border: '1px solid #8B5CF6', borderRadius: 8, color: '#8B5CF6' }}>
            {contenidos.length} generados
          </span>
          <span style={{ padding: '8px 16px', background: '#22c55e15', border: '1px solid #22c55e', borderRadius: 8, color: '#22c55e' }}>
            {contenidos.filter(c => c.estado === 'publicado').length} publicados
          </span>
        </div>
      </div>

      {/* Controles de mes */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={() => { if (mes === 1) { setMes(12); setAño(año - 1); } else setMes(mes - 1); }}
            style={{ padding: '10px 18px', background: '#1a1a25', border: '1px solid #2a2a3a', borderRadius: 8, color: 'white', cursor: 'pointer', fontSize: 18 }}>
            ←
          </button>
          <h2 style={{ fontSize: 24, fontWeight: 'bold', minWidth: 200, textAlign: 'center' }}>
            {MESES[mes - 1]} {año}
          </h2>
          <button onClick={() => { if (mes === 12) { setMes(1); setAño(año + 1); } else setMes(mes + 1); }}
            style={{ padding: '10px 18px', background: '#1a1a25', border: '1px solid #2a2a3a', borderRadius: 8, color: 'white', cursor: 'pointer', fontSize: 18 }}>
            →
          </button>
        </div>

        <button onClick={generarMes} disabled={loading}
          style={{
            padding: '14px 28px',
            background: loading ? '#333' : 'linear-gradient(135deg, #D4A853, #F59E0B)',
            border: 'none', borderRadius: 12,
            color: loading ? '#666' : '#000',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: 16, fontWeight: 600
          }}>
          {loading ? '⏳ Generando...' : '✨ Generar mes completo'}
        </button>
      </div>

      {/* Días de la semana */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4, marginBottom: 4 }}>
        {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(d => (
          <div key={d} style={{ padding: 8, textAlign: 'center', color: '#6b7280', fontSize: 12, fontWeight: 600 }}>{d}</div>
        ))}
      </div>

      {/* Calendario */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4, marginBottom: 30 }}>
        {calendario.map((dia, i) => {
          if (!dia) return <div key={i} style={{ background: '#12121a', borderRadius: 8, minHeight: 100 }} />;

          const contenido = getContenidoDia(dia);
          const esHoy = dia === new Date().getDate() && mes === new Date().getMonth() + 1 && año === new Date().getFullYear();

          return (
            <div key={i}
              onClick={() => contenido && setContenidoAbierto(contenido)}
              style={{
                background: esHoy ? '#D4A85315' : '#12121a',
                border: `1px solid ${esHoy ? '#D4A853' : contenido ? '#8B5CF640' : '#2a2a3a'}`,
                borderRadius: 10, padding: 10, minHeight: 100,
                cursor: contenido ? 'pointer' : 'default',
                position: 'relative'
              }}>

              {/* Estado indicator */}
              <div style={{
                position: 'absolute', top: 8, right: 8,
                width: 8, height: 8, borderRadius: '50%',
                background: contenido?.estado === 'publicado' ? '#22c55e' : contenido ? '#8B5CF6' : '#2a2a3a'
              }} />

              <div style={{ fontWeight: esHoy ? 700 : 500, color: esHoy ? '#D4A853' : 'white', marginBottom: 6 }}>{dia}</div>

              {contenido ? (
                <div>
                  {contenido.imagen && (
                    <div style={{ fontSize: 10, color: '#22c55e', marginBottom: 4 }}>🖼️ con imagen</div>
                  )}
                  <div style={{ fontSize: 11, color: '#e5e7eb', lineHeight: 1.4, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                    {contenido.titulo}
                  </div>
                </div>
              ) : (
                <button
                  onClick={(e) => { e.stopPropagation(); generarDia(dia); }}
                  disabled={loadingDia === dia}
                  style={{
                    fontSize: 10, padding: '4px 8px',
                    background: '#1a1a25', border: '1px solid #2a2a3a',
                    borderRadius: 4, color: '#9ca3af', cursor: 'pointer'
                  }}>
                  {loadingDia === dia ? '...' : '+ Generar'}
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Modal de contenido */}
      {contenidoAbierto && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000, padding: 20
        }} onClick={() => setContenidoAbierto(null)}>
          <div onClick={e => e.stopPropagation()} style={{
            background: '#12121a', borderRadius: 16, maxWidth: 800, width: '100%',
            maxHeight: '90vh', overflow: 'hidden', display: 'flex', flexDirection: 'column'
          }}>
            {/* Header del modal */}
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #2a2a3a' }}>
              <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
                <span style={{ padding: '4px 12px', background: '#8B5CF622', borderRadius: 20, fontSize: 12, color: '#8B5CF6' }}>
                  {contenidoAbierto.categoria}
                </span>
                <span style={{ padding: '4px 12px', background: '#06B6D422', borderRadius: 20, fontSize: 12, color: '#06B6D4' }}>
                  {contenidoAbierto.tipo}
                </span>
                <span style={{
                  padding: '4px 12px', borderRadius: 20, fontSize: 12,
                  background: contenidoAbierto.estado === 'publicado' ? '#22c55e22' : '#F59E0B22',
                  color: contenidoAbierto.estado === 'publicado' ? '#22c55e' : '#F59E0B'
                }}>
                  {contenidoAbierto.estado === 'publicado' ? '✓ Publicado' : 'Borrador'}
                </span>
              </div>

              <h2 style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 8 }}>{contenidoAbierto.titulo}</h2>
              <p style={{ color: '#9ca3af', fontSize: 14 }}>Día {contenidoAbierto.dia} de {MESES[contenidoAbierto.mes - 1]} {contenidoAbierto.año}</p>
            </div>

            {/* Contenido */}
            <div style={{ padding: '20px 24px', overflowY: 'auto', flex: 1 }}>
              {/* Imagen */}
              {contenidoAbierto.imagen ? (
                <div style={{ marginBottom: 20, position: 'relative' }}>
                  <img src={contenidoAbierto.imagen} alt={contenidoAbierto.titulo}
                    style={{ width: '100%', maxHeight: 300, objectFit: 'cover', borderRadius: 12 }} />
                  <button onClick={() => generarDia(contenidoAbierto.dia, true)}
                    disabled={loadingDia === contenidoAbierto.dia}
                    style={{
                      position: 'absolute', top: 10, right: 10,
                      padding: '6px 12px', background: 'rgba(0,0,0,0.7)', border: 'none',
                      borderRadius: 6, color: 'white', cursor: 'pointer', fontSize: 12
                    }}>
                    {loadingDia === contenidoAbierto.dia ? '...' : '🖼️ Nueva imagen'}
                  </button>
                </div>
              ) : (
                <button onClick={() => generarDia(contenidoAbierto.dia, true)}
                  disabled={loadingDia === contenidoAbierto.dia}
                  style={{
                    width: '100%', padding: 20, marginBottom: 20,
                    background: '#1a1a25', border: '2px dashed #3a3a4a',
                    borderRadius: 12, color: '#9ca3af', cursor: 'pointer', fontSize: 14
                  }}>
                  {loadingDia === contenidoAbierto.dia ? '⏳ Generando imagen...' : '🖼️ Generar imagen con DALL-E'}
                </button>
              )}

              {contenidoAbierto.extracto && (
                <p style={{ fontStyle: 'italic', color: '#D4A853', marginBottom: 20, fontSize: 15, lineHeight: 1.6 }}>
                  {contenidoAbierto.extracto}
                </p>
              )}

              {contenidoAbierto.secciones ? (
                <div style={{ fontSize: 14, lineHeight: 1.8, color: '#d1d5db' }}>
                  {contenidoAbierto.secciones.intro && (
                    <div style={{ marginBottom: 24 }}>
                      <h3 style={{ color: '#22c55e', fontWeight: 600, marginBottom: 8 }}>Introducción</h3>
                      <p style={{ whiteSpace: 'pre-wrap' }}>{contenidoAbierto.secciones.intro}</p>
                    </div>
                  )}
                  {contenidoAbierto.secciones.desarrollo && (
                    <div style={{ marginBottom: 24 }}>
                      <h3 style={{ color: '#8B5CF6', fontWeight: 600, marginBottom: 8 }}>Desarrollo</h3>
                      <p style={{ whiteSpace: 'pre-wrap' }}>{contenidoAbierto.secciones.desarrollo}</p>
                    </div>
                  )}
                  {contenidoAbierto.secciones.practica && (
                    <div style={{ marginBottom: 24 }}>
                      <h3 style={{ color: '#F59E0B', fontWeight: 600, marginBottom: 8 }}>Práctica</h3>
                      <p style={{ whiteSpace: 'pre-wrap' }}>{contenidoAbierto.secciones.practica}</p>
                    </div>
                  )}
                  {contenidoAbierto.secciones.cierre && (
                    <div style={{ marginBottom: 24 }}>
                      <h3 style={{ color: '#EC4899', fontWeight: 600, marginBottom: 8 }}>Cierre</h3>
                      <p style={{ whiteSpace: 'pre-wrap' }}>{contenidoAbierto.secciones.cierre}</p>
                    </div>
                  )}
                </div>
              ) : (
                <p style={{ whiteSpace: 'pre-wrap', color: '#d1d5db', lineHeight: 1.8 }}>
                  {contenidoAbierto.contenido}
                </p>
              )}
            </div>

            {/* Footer con acciones */}
            <div style={{ padding: '16px 24px', borderTop: '1px solid #2a2a3a', display: 'flex', gap: 12, justifyContent: 'space-between' }}>
              <button onClick={() => eliminarContenido(contenidoAbierto)}
                style={{ padding: '10px 20px', background: '#ef444422', border: '1px solid #ef4444', borderRadius: 8, color: '#ef4444', cursor: 'pointer' }}>
                🗑️ Eliminar
              </button>

              <div style={{ display: 'flex', gap: 12 }}>
                <button onClick={() => { generarDia(contenidoAbierto.dia); setContenidoAbierto(null); }}
                  style={{ padding: '10px 20px', background: '#1a1a25', border: '1px solid #2a2a3a', borderRadius: 8, color: 'white', cursor: 'pointer' }}>
                  🔄 Regenerar
                </button>

                {contenidoAbierto.estado !== 'publicado' && (
                  <button onClick={() => { publicar(contenidoAbierto); setContenidoAbierto(null); }}
                    style={{ padding: '10px 20px', background: '#22c55e', border: 'none', borderRadius: 8, color: 'white', cursor: 'pointer', fontWeight: 600 }}>
                    🚀 Publicar
                  </button>
                )}

                <button onClick={() => setContenidoAbierto(null)}
                  style={{ padding: '10px 20px', background: '#2a2a3a', border: 'none', borderRadius: 8, color: 'white', cursor: 'pointer' }}>
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Leyenda */}
      <div style={{ display: 'flex', gap: 20, padding: '12px 16px', background: '#12121a', borderRadius: 8, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#9ca3af' }}>
          <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#22c55e' }} /> Publicado
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#9ca3af' }}>
          <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#8B5CF6' }} /> Generado (borrador)
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#9ca3af' }}>
          <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#2a2a3a' }} /> Sin generar
        </div>
      </div>
    </div>
  );
}
