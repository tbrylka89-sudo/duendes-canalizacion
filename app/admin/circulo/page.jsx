'use client';
import { useState, useEffect } from 'react';

// ═══════════════════════════════════════════════════════════════
// NUEVA PALETA DE COLORES VIBRANTE
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
  // Círculo = Emerald
  emerald: '#10B981',
  emeraldLight: '#34D399',
  emeraldDark: '#059669',
  // Secundarios
  purple: '#8B5CF6',
  pink: '#EC4899',
  cyan: '#06B6D4',
  blue: '#3B82F6',
  orange: '#F97316',
  rose: '#F43F5E',
  amber: '#F59E0B',
  gold: '#D4A853',
  success: '#22c55e',
  error: '#ef4444',
  warning: '#f59e0b',
};

// ═══════════════════════════════════════════════════════════════
// CIRCULO PAGE
// ═══════════════════════════════════════════════════════════════

export default function CirculoPage() {
  const [miembros, setMiembros] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [filtro, setFiltro] = useState('todos');
  const [busqueda, setBusqueda] = useState('');
  const [toast, setToast] = useState(null);
  const [modalExtender, setModalExtender] = useState(null);
  const [diasExtender, setDiasExtender] = useState(30);
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    cargarMiembros();
  }, []);

  const mostrarToast = (mensaje, tipo = 'success') => {
    setToast({ mensaje, tipo });
    setTimeout(() => setToast(null), 3000);
  };

  const cargarMiembros = async () => {
    setCargando(true);
    try {
      const res = await fetch('/api/admin/circulo');
      const data = await res.json();
      if (data.success) {
        setMiembros(data.miembros || []);
      }
    } catch (e) {
      mostrarToast('Error al cargar miembros', 'error');
    }
    setCargando(false);
  };

  const toggleMiembro = async (email, activar) => {
    try {
      const res = await fetch(`/api/admin/circulo/${encodeURIComponent(email)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accion: activar ? 'activar' : 'desactivar' })
      });
      const data = await res.json();
      if (data.success) {
        setMiembros(prev => prev.map(m =>
          m.email === email ? { ...m, activo: activar } : m
        ));
        mostrarToast(activar ? 'Membresia activada' : 'Membresia desactivada');
      }
    } catch (e) {
      mostrarToast('Error al actualizar', 'error');
    }
  };

  const extenderMembresia = async () => {
    if (!modalExtender) return;
    setGuardando(true);

    try {
      const res = await fetch(`/api/admin/circulo/${encodeURIComponent(modalExtender.email)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accion: 'extender', dias: diasExtender })
      });
      const data = await res.json();
      if (data.success) {
        setMiembros(prev => prev.map(m =>
          m.email === modalExtender.email
            ? { ...m, expira: data.nuevaExpiracion, activo: true }
            : m
        ));
        mostrarToast(`Membresia extendida ${diasExtender} dias`);
        setModalExtender(null);
      }
    } catch (e) {
      mostrarToast('Error al extender', 'error');
    }
    setGuardando(false);
  };

  // Filtrar miembros
  const ahora = new Date();
  const en7Dias = new Date(ahora.getTime() + 7 * 24 * 60 * 60 * 1000);

  const miembrosFiltrados = miembros.filter(m => {
    if (busqueda) {
      const q = busqueda.toLowerCase();
      if (!m.email?.toLowerCase().includes(q) && !m.nombre?.toLowerCase().includes(q)) {
        return false;
      }
    }

    const expira = m.expira ? new Date(m.expira) : null;

    if (filtro === 'activos') return m.activo && expira && expira > ahora;
    if (filtro === 'por-vencer') return m.activo && expira && expira <= en7Dias && expira > ahora;
    if (filtro === 'vencidos') return !m.activo || (expira && expira <= ahora);
    return true;
  });

  // Estadisticas
  const totalActivos = miembros.filter(m => m.activo).length;
  const porVencer = miembros.filter(m => {
    const expira = m.expira ? new Date(m.expira) : null;
    return m.activo && expira && expira <= en7Dias && expira > ahora;
  }).length;
  const vencidos = miembros.filter(m => {
    const expira = m.expira ? new Date(m.expira) : null;
    return expira && expira <= ahora;
  }).length;

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto' }}>
      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed',
          top: 20,
          right: 20,
          padding: '14px 24px',
          borderRadius: 14,
          color: '#fff',
          fontSize: 14,
          fontWeight: 500,
          zIndex: 1000,
          background: toast.tipo === 'error' ? COLORS.error : COLORS.success,
          boxShadow: `0 4px 20px ${toast.tipo === 'error' ? COLORS.error : COLORS.success}44`
        }}>
          {toast.mensaje}
        </div>
      )}

      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 32,
        padding: 24,
        background: COLORS.bgCard,
        borderRadius: 20,
        border: `1px solid ${COLORS.border}`,
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 3,
          background: `linear-gradient(90deg, ${COLORS.emerald}, ${COLORS.cyan}, ${COLORS.purple})`
        }} />

        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
            <div style={{
              width: 48,
              height: 48,
              borderRadius: 14,
              background: `linear-gradient(135deg, ${COLORS.emerald}33, ${COLORS.emerald}11)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 24
            }}>
              ☽
            </div>
            <div>
              <h1 style={{ color: COLORS.text, fontSize: 26, fontWeight: 700, margin: 0 }}>
                Circulo
              </h1>
              <p style={{ color: COLORS.textMuted, margin: 0, fontSize: 14 }}>
                Gestiona las membresias premium de tu comunidad magica
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={cargarMiembros}
          style={{
            padding: '12px 24px',
            background: COLORS.bgElevated,
            border: `1px solid ${COLORS.border}`,
            borderRadius: 12,
            color: COLORS.textMuted,
            fontSize: 14,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 8
          }}
        >
          <span style={{ fontSize: 18 }}>↻</span>
          Actualizar
        </button>
      </div>

      {/* Info Box */}
      <div style={{
        padding: 20,
        background: `linear-gradient(135deg, ${COLORS.emerald}11, ${COLORS.cyan}11)`,
        borderRadius: 16,
        border: `1px solid ${COLORS.emerald}33`,
        marginBottom: 24,
        display: 'flex',
        alignItems: 'center',
        gap: 16
      }}>
        <span style={{ fontSize: 28 }}>💡</span>
        <div>
          <p style={{ color: COLORS.text, margin: 0, fontWeight: 500 }}>
            Membresias del Circulo
          </p>
          <p style={{ color: COLORS.textMuted, margin: '4px 0 0', fontSize: 14 }}>
            Gestiona los miembros premium. Podes activar/desactivar membresias, extender tiempo y filtrar por estado.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 16,
        marginBottom: 28
      }}>
        <div
          onClick={() => setFiltro('activos')}
          style={{
            background: filtro === 'activos' ? `${COLORS.emerald}22` : COLORS.bgCard,
            border: `2px solid ${filtro === 'activos' ? COLORS.emerald : COLORS.border}`,
            borderRadius: 20,
            padding: 24,
            textAlign: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
        >
          <span style={{ display: 'block', color: COLORS.emerald, fontSize: 36, fontWeight: 700, marginBottom: 4 }}>
            {totalActivos}
          </span>
          <span style={{ color: COLORS.textMuted, fontSize: 14 }}>Activos</span>
        </div>

        <div
          onClick={() => setFiltro('por-vencer')}
          style={{
            background: filtro === 'por-vencer' ? `${COLORS.amber}22` : COLORS.bgCard,
            border: `2px solid ${filtro === 'por-vencer' ? COLORS.amber : COLORS.border}`,
            borderRadius: 20,
            padding: 24,
            textAlign: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
        >
          <span style={{ display: 'block', color: COLORS.amber, fontSize: 36, fontWeight: 700, marginBottom: 4 }}>
            {porVencer}
          </span>
          <span style={{ color: COLORS.textMuted, fontSize: 14 }}>Por vencer (7d)</span>
        </div>

        <div
          onClick={() => setFiltro('vencidos')}
          style={{
            background: filtro === 'vencidos' ? `${COLORS.rose}22` : COLORS.bgCard,
            border: `2px solid ${filtro === 'vencidos' ? COLORS.rose : COLORS.border}`,
            borderRadius: 20,
            padding: 24,
            textAlign: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
        >
          <span style={{ display: 'block', color: COLORS.rose, fontSize: 36, fontWeight: 700, marginBottom: 4 }}>
            {vencidos}
          </span>
          <span style={{ color: COLORS.textMuted, fontSize: 14 }}>Vencidos</span>
        </div>

        <div
          onClick={() => setFiltro('todos')}
          style={{
            background: filtro === 'todos' ? `${COLORS.purple}22` : COLORS.bgCard,
            border: `2px solid ${filtro === 'todos' ? COLORS.purple : COLORS.border}`,
            borderRadius: 20,
            padding: 24,
            textAlign: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
        >
          <span style={{ display: 'block', color: COLORS.purple, fontSize: 36, fontWeight: 700, marginBottom: 4 }}>
            {miembros.length}
          </span>
          <span style={{ color: COLORS.textMuted, fontSize: 14 }}>Total</span>
        </div>
      </div>

      {/* Filtros y busqueda */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
        gap: 16
      }}>
        <div style={{ display: 'flex', gap: 10 }}>
          {[
            { id: 'todos', label: 'Todos', color: COLORS.purple },
            { id: 'activos', label: 'Activos', color: COLORS.emerald },
            { id: 'por-vencer', label: 'Por vencer', color: COLORS.amber },
            { id: 'vencidos', label: 'Vencidos', color: COLORS.rose }
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setFiltro(f.id)}
              style={{
                padding: '12px 20px',
                background: filtro === f.id ? `${f.color}22` : COLORS.bgCard,
                border: `2px solid ${filtro === f.id ? f.color : COLORS.border}`,
                borderRadius: 12,
                color: filtro === f.id ? f.color : COLORS.textMuted,
                fontSize: 14,
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              {f.label}
            </button>
          ))}
        </div>
        <input
          type="text"
          placeholder="Buscar por email o nombre..."
          value={busqueda}
          onChange={e => setBusqueda(e.target.value)}
          style={{
            padding: '14px 18px',
            background: COLORS.bgCard,
            border: `2px solid ${busqueda ? COLORS.emerald : COLORS.border}`,
            borderRadius: 12,
            color: COLORS.text,
            fontSize: 14,
            width: 280,
            outline: 'none',
            transition: 'border-color 0.2s'
          }}
        />
      </div>

      {/* Lista de miembros */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {cargando ? (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 80
          }}>
            <div style={{
              width: 48,
              height: 48,
              border: `3px solid ${COLORS.border}`,
              borderTopColor: COLORS.emerald,
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }} />
            <p style={{ color: COLORS.textMuted, marginTop: 16 }}>Cargando miembros...</p>
          </div>
        ) : miembrosFiltrados.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: 80,
            color: COLORS.textDim
          }}>
            <span style={{ fontSize: 48, display: 'block', marginBottom: 16 }}>🌙</span>
            <p>No hay miembros en esta categoria</p>
          </div>
        ) : (
          miembrosFiltrados.map((miembro, i) => {
            const expira = miembro.expira ? new Date(miembro.expira) : null;
            const diasRestantes = expira ? Math.ceil((expira - ahora) / (24 * 60 * 60 * 1000)) : null;
            const vencido = expira && expira <= ahora;
            const porVencerProx = diasRestantes !== null && diasRestantes <= 7 && diasRestantes > 0;

            return (
              <div key={i} style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: 24,
                background: COLORS.bgCard,
                border: `1px solid ${COLORS.border}`,
                borderRadius: 16,
                transition: 'all 0.2s'
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{ color: COLORS.text, fontSize: 16, fontWeight: 500, marginBottom: 4 }}>
                    {miembro.nombre || miembro.nombrePreferido || 'Sin nombre'}
                  </div>
                  <div style={{ color: COLORS.textMuted, fontSize: 14, marginBottom: 8 }}>{miembro.email}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ color: COLORS.textDim, fontSize: 13 }}>
                      {miembro.plan || 'Sin plan'}
                    </span>
                    {miembro.esPrueba && (
                      <span style={{
                        padding: '4px 10px',
                        background: `${COLORS.blue}22`,
                        borderRadius: 8,
                        color: COLORS.blue,
                        fontSize: 12,
                        fontWeight: 600
                      }}>
                        Prueba
                      </span>
                    )}
                  </div>
                </div>

                <div style={{ textAlign: 'center', minWidth: 120 }}>
                  {expira ? (
                    <>
                      <div style={{
                        fontSize: 20,
                        fontWeight: 700,
                        marginBottom: 2,
                        color: vencido ? COLORS.rose : porVencerProx ? COLORS.amber : COLORS.emerald
                      }}>
                        {vencido ? 'Vencido' : `${diasRestantes} dias`}
                      </div>
                      <div style={{ color: COLORS.textDim, fontSize: 13 }}>
                        {expira.toLocaleDateString('es-UY')}
                      </div>
                    </>
                  ) : (
                    <div style={{ color: COLORS.textDim, fontSize: 14 }}>Sin fecha</div>
                  )}
                </div>

                <div style={{ display: 'flex', gap: 12, marginLeft: 24 }}>
                  <button
                    onClick={() => setModalExtender(miembro)}
                    style={{
                      padding: '12px 20px',
                      background: `${COLORS.emerald}22`,
                      border: `1px solid ${COLORS.emerald}44`,
                      borderRadius: 12,
                      color: COLORS.emerald,
                      fontSize: 14,
                      fontWeight: 500,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6
                    }}
                  >
                    <span>+</span> Extender
                  </button>
                  <button
                    onClick={() => toggleMiembro(miembro.email, !miembro.activo)}
                    style={{
                      padding: '12px 20px',
                      background: miembro.activo ? `${COLORS.success}22` : `${COLORS.error}22`,
                      border: 'none',
                      borderRadius: 12,
                      fontSize: 14,
                      fontWeight: 600,
                      cursor: 'pointer',
                      minWidth: 100,
                      color: miembro.activo ? COLORS.success : COLORS.error
                    }}
                  >
                    {miembro.activo ? 'Activo' : 'Inactivo'}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal extender */}
      {modalExtender && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            backdropFilter: 'blur(8px)'
          }}
          onClick={() => setModalExtender(null)}
        >
          <div
            style={{
              background: COLORS.bgCard,
              border: `1px solid ${COLORS.border}`,
              borderRadius: 24,
              padding: 28,
              width: '100%',
              maxWidth: 480,
              position: 'relative',
              overflow: 'hidden'
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: 3,
              background: `linear-gradient(90deg, ${COLORS.emerald}, ${COLORS.cyan})`
            }} />

            <h3 style={{
              color: COLORS.text,
              fontSize: 20,
              fontWeight: 600,
              marginBottom: 8,
              display: 'flex',
              alignItems: 'center',
              gap: 12
            }}>
              <span style={{
                width: 44,
                height: 44,
                borderRadius: 14,
                background: `${COLORS.emerald}22`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 22
              }}>
                ☽
              </span>
              Extender membresia
            </h3>
            <p style={{ color: COLORS.textMuted, fontSize: 14, marginBottom: 28 }}>
              {modalExtender.nombre || modalExtender.email}
            </p>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(5, 1fr)',
              gap: 10,
              marginBottom: 28
            }}>
              {[7, 15, 30, 60, 90].map(d => (
                <button
                  key={d}
                  onClick={() => setDiasExtender(d)}
                  style={{
                    padding: '16px 8px',
                    background: diasExtender === d ? `${COLORS.emerald}22` : COLORS.bgElevated,
                    border: `2px solid ${diasExtender === d ? COLORS.emerald : COLORS.border}`,
                    borderRadius: 12,
                    color: diasExtender === d ? COLORS.emerald : COLORS.textMuted,
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  {d} dias
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', gap: 14 }}>
              <button
                onClick={() => setModalExtender(null)}
                style={{
                  flex: 1,
                  padding: '16px',
                  background: COLORS.bgElevated,
                  border: `2px solid ${COLORS.border}`,
                  borderRadius: 14,
                  color: COLORS.textMuted,
                  fontSize: 15,
                  cursor: 'pointer'
                }}
              >
                Cancelar
              </button>
              <button
                onClick={extenderMembresia}
                disabled={guardando}
                style={{
                  flex: 1,
                  padding: '16px',
                  background: `linear-gradient(135deg, ${COLORS.emerald}, ${COLORS.emeraldDark})`,
                  border: 'none',
                  borderRadius: 14,
                  color: '#fff',
                  fontSize: 15,
                  fontWeight: 600,
                  cursor: guardando ? 'wait' : 'pointer',
                  boxShadow: `0 4px 20px ${COLORS.emerald}44`
                }}
              >
                {guardando ? 'Guardando...' : 'Extender'}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
