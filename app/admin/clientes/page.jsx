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
  // Clientes = Blue
  blue: '#3B82F6',
  blueLight: '#60A5FA',
  blueDark: '#2563EB',
  // Secundarios
  purple: '#8B5CF6',
  pink: '#EC4899',
  cyan: '#06B6D4',
  emerald: '#10B981',
  orange: '#F97316',
  rose: '#F43F5E',
  amber: '#F59E0B',
  gold: '#D4A853',
  success: '#22c55e',
  error: '#ef4444',
  warning: '#f59e0b',
};

const RANGOS = [
  { id: 'semilla', nombre: 'Semilla Magica', min: 0, icono: '🌱', color: COLORS.emerald },
  { id: 'brote', nombre: 'Brote de Luz', min: 50, icono: '🌿', color: '#4ade80' },
  { id: 'aprendiz', nombre: 'Aprendiz Elemental', min: 150, icono: '✨', color: COLORS.amber },
  { id: 'guardian', nombre: 'Guardiana del Bosque', min: 300, icono: '🌳', color: '#16a34a' },
  { id: 'hechicera', nombre: 'Hechicera de Cristal', min: 500, icono: '💎', color: COLORS.purple },
  { id: 'alquimista', nombre: 'Alquimista del Alba', min: 800, icono: '⚗️', color: COLORS.rose },
  { id: 'maestra', nombre: 'Maestra Elemental', min: 1200, icono: '👑', color: COLORS.gold }
];

function getRango(gastado) {
  for (let i = RANGOS.length - 1; i >= 0; i--) {
    if (gastado >= RANGOS[i].min) return RANGOS[i];
  }
  return RANGOS[0];
}

// ═══════════════════════════════════════════════════════════════
// CLIENTES PAGE
// ═══════════════════════════════════════════════════════════════

export default function ClientesPage() {
  const [busqueda, setBusqueda] = useState('');
  const [resultados, setResultados] = useState([]);
  const [buscando, setBuscando] = useState(false);
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
  const [cargandoCliente, setCargandoCliente] = useState(false);
  const [modalMoneda, setModalMoneda] = useState(null);
  const [cantidadMoneda, setCantidadMoneda] = useState('');
  const [motivoMoneda, setMotivoMoneda] = useState('');
  const [accionMoneda, setAccionMoneda] = useState('agregar');
  const [guardandoMoneda, setGuardandoMoneda] = useState(false);
  const [toast, setToast] = useState(null);

  const mostrarToast = (mensaje, tipo = 'success') => {
    setToast({ mensaje, tipo });
    setTimeout(() => setToast(null), 3000);
  };

  const buscar = async () => {
    if (!busqueda.trim()) return;
    setBuscando(true);
    try {
      const res = await fetch(`/api/admin/clientes?q=${encodeURIComponent(busqueda)}`);
      const data = await res.json();
      setResultados(data.clientes || []);
    } catch (e) {
      mostrarToast('Error al buscar', 'error');
    }
    setBuscando(false);
  };

  const seleccionarCliente = async (email) => {
    setCargandoCliente(true);
    try {
      const res = await fetch(`/api/admin/clientes/${encodeURIComponent(email)}`);
      const data = await res.json();
      if (data.success) {
        setClienteSeleccionado(data.cliente);
      } else {
        mostrarToast('Error al cargar cliente', 'error');
      }
    } catch (e) {
      mostrarToast('Error de conexion', 'error');
    }
    setCargandoCliente(false);
  };

  const guardarMoneda = async () => {
    if (!cantidadMoneda || !clienteSeleccionado) return;
    setGuardandoMoneda(true);

    try {
      const cantidad = parseInt(cantidadMoneda);
      const cambio = accionMoneda === 'agregar' ? cantidad : -cantidad;

      const res = await fetch(`/api/admin/clientes/${encodeURIComponent(clienteSeleccionado.email)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          campo: modalMoneda,
          valor: (clienteSeleccionado[modalMoneda] || 0) + cambio,
          motivo: motivoMoneda
        })
      });

      const data = await res.json();
      if (data.success) {
        setClienteSeleccionado(prev => ({
          ...prev,
          [modalMoneda]: (prev[modalMoneda] || 0) + cambio
        }));
        mostrarToast(`${modalMoneda === 'runas' ? 'Runas' : 'Treboles'} actualizados`);
        setModalMoneda(null);
        setCantidadMoneda('');
        setMotivoMoneda('');
      } else {
        mostrarToast('Error al actualizar', 'error');
      }
    } catch (e) {
      mostrarToast('Error de conexion', 'error');
    }
    setGuardandoMoneda(false);
  };

  const copiarLink = () => {
    if (clienteSeleccionado?.token) {
      navigator.clipboard.writeText(`https://duendesdeluruguay.com/mi-magia?token=${clienteSeleccionado.token}`);
      mostrarToast('Link copiado');
    }
  };

  return (
    <div style={{ maxWidth: 1400, margin: '0 auto' }}>
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
          background: `linear-gradient(90deg, ${COLORS.blue}, ${COLORS.cyan}, ${COLORS.purple})`
        }} />

        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
            <div style={{
              width: 48,
              height: 48,
              borderRadius: 14,
              background: `linear-gradient(135deg, ${COLORS.blue}33, ${COLORS.blue}11)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 24
            }}>
              👥
            </div>
            <div>
              <h1 style={{ color: COLORS.text, fontSize: 26, fontWeight: 700, margin: 0 }}>
                Clientes
              </h1>
              <p style={{ color: COLORS.textMuted, margin: 0, fontSize: 14 }}>
                Busca, edita y gestiona usuarios de tu tienda magica
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Info Box */}
      <div style={{
        padding: 20,
        background: `linear-gradient(135deg, ${COLORS.blue}11, ${COLORS.cyan}11)`,
        borderRadius: 16,
        border: `1px solid ${COLORS.blue}33`,
        marginBottom: 24,
        display: 'flex',
        alignItems: 'center',
        gap: 16
      }}>
        <span style={{ fontSize: 28 }}>💡</span>
        <div>
          <p style={{ color: COLORS.text, margin: 0, fontWeight: 500 }}>
            Gestion de usuarios
          </p>
          <p style={{ color: COLORS.textMuted, margin: '4px 0 0', fontSize: 14 }}>
            Busca clientes por email o nombre. Podes ver su actividad, gestionar runas/treboles, copiar su link magico y mas.
          </p>
        </div>
      </div>

      {/* Buscador */}
      <div style={{
        display: 'flex',
        gap: 14,
        marginBottom: 28
      }}>
        <input
          type="text"
          placeholder="Buscar por email o nombre..."
          value={busqueda}
          onChange={e => setBusqueda(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && buscar()}
          style={{
            flex: 1,
            padding: '16px 20px',
            background: COLORS.bgCard,
            border: `2px solid ${busqueda.trim() ? COLORS.blue : COLORS.border}`,
            borderRadius: 14,
            color: COLORS.text,
            fontSize: 16,
            outline: 'none',
            transition: 'border-color 0.2s'
          }}
        />
        <button
          onClick={buscar}
          disabled={buscando}
          style={{
            padding: '16px 32px',
            background: `linear-gradient(135deg, ${COLORS.blue}, ${COLORS.blueDark})`,
            border: 'none',
            borderRadius: 14,
            color: '#fff',
            fontSize: 16,
            fontWeight: 600,
            cursor: buscando ? 'wait' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            boxShadow: `0 4px 20px ${COLORS.blue}44`
          }}
        >
          {buscando ? (
            <>
              <div style={{
                width: 18, height: 18,
                border: '2px solid transparent',
                borderTopColor: '#fff',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }} />
              Buscando...
            </>
          ) : (
            <>🔍 Buscar</>
          )}
        </button>
      </div>

      {/* Layout de dos columnas */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '420px 1fr',
        gap: 24
      }}>
        {/* Lista de resultados */}
        <div style={{
          background: COLORS.bgCard,
          border: `1px solid ${COLORS.border}`,
          borderRadius: 20,
          overflow: 'hidden'
        }}>
          <div style={{
            padding: '16px 20px',
            borderBottom: `1px solid ${COLORS.border}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <h3 style={{ color: COLORS.text, fontSize: 15, fontWeight: 600, margin: 0 }}>
              Resultados
            </h3>
            <span style={{
              padding: '5px 12px',
              background: `${COLORS.blue}22`,
              color: COLORS.blue,
              borderRadius: 10,
              fontSize: 13,
              fontWeight: 600
            }}>
              {resultados.length}
            </span>
          </div>
          <div style={{
            maxHeight: 'calc(100vh - 380px)',
            overflowY: 'auto'
          }}>
            {resultados.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: 60,
                color: COLORS.textDim
              }}>
                <span style={{ fontSize: 40, display: 'block', marginBottom: 16 }}>🔍</span>
                <p style={{ margin: 0 }}>Busca un cliente para comenzar</p>
              </div>
            ) : (
              resultados.map((cliente, i) => {
                const rango = getRango(cliente.gastado || 0);
                const activo = clienteSeleccionado?.email === cliente.email;
                return (
                  <div
                    key={i}
                    onClick={() => seleccionarCliente(cliente.email)}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '16px 20px',
                      borderBottom: `1px solid ${COLORS.border}`,
                      cursor: 'pointer',
                      background: activo ? `${COLORS.blue}15` : 'transparent',
                      borderLeft: activo ? `3px solid ${COLORS.blue}` : '3px solid transparent',
                      transition: 'all 0.2s'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                      <span style={{ fontSize: 24 }}>{rango.icono}</span>
                      <div>
                        <div style={{ color: COLORS.text, fontSize: 15, fontWeight: 500 }}>
                          {cliente.nombre || cliente.nombrePreferido || 'Sin nombre'}
                        </div>
                        <div style={{ color: COLORS.textMuted, fontSize: 13 }}>{cliente.email}</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                      <span style={{
                        color: COLORS.purple,
                        fontSize: 13,
                        fontWeight: 500,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4
                      }}>
                        <span style={{ fontSize: 16 }}>ᚱ</span> {cliente.runas || 0}
                      </span>
                      <span style={{
                        color: COLORS.emerald,
                        fontSize: 13,
                        fontWeight: 500,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4
                      }}>
                        <span style={{ fontSize: 16 }}>☘</span> {cliente.treboles || 0}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Detalle del cliente */}
        <div style={{
          background: COLORS.bgCard,
          border: `1px solid ${COLORS.border}`,
          borderRadius: 20,
          minHeight: 500
        }}>
          {cargandoCliente ? (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              minHeight: 500
            }}>
              <div style={{
                width: 40,
                height: 40,
                border: `3px solid ${COLORS.border}`,
                borderTopColor: COLORS.blue,
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }} />
              <p style={{ color: COLORS.textMuted, marginTop: 16 }}>Cargando cliente...</p>
            </div>
          ) : clienteSeleccionado ? (
            <ClienteDetalle
              cliente={clienteSeleccionado}
              onAbrirMoneda={setModalMoneda}
              onCopiarLink={copiarLink}
            />
          ) : (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              minHeight: 500,
              color: COLORS.textDim
            }}>
              <span style={{ fontSize: 48, marginBottom: 16 }}>👤</span>
              <p>Selecciona un cliente para ver detalles</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal de moneda */}
      {modalMoneda && (
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
          onClick={() => setModalMoneda(null)}
        >
          <div
            style={{
              background: COLORS.bgCard,
              border: `1px solid ${COLORS.border}`,
              borderRadius: 24,
              padding: 28,
              width: '100%',
              maxWidth: 440,
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
              background: modalMoneda === 'runas'
                ? `linear-gradient(90deg, ${COLORS.purple}, ${COLORS.pink})`
                : `linear-gradient(90deg, ${COLORS.emerald}, ${COLORS.cyan})`
            }} />

            <h3 style={{
              color: COLORS.text,
              fontSize: 20,
              fontWeight: 600,
              marginBottom: 24,
              display: 'flex',
              alignItems: 'center',
              gap: 12
            }}>
              <span style={{
                width: 44,
                height: 44,
                borderRadius: 14,
                background: modalMoneda === 'runas' ? `${COLORS.purple}22` : `${COLORS.emerald}22`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 22
              }}>
                {modalMoneda === 'runas' ? 'ᚱ' : '☘'}
              </span>
              Gestionar {modalMoneda === 'runas' ? 'Runas' : 'Treboles'}
            </h3>

            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', color: COLORS.textMuted, fontSize: 13, marginBottom: 10, fontWeight: 500 }}>
                Accion
              </label>
              <div style={{ display: 'flex', gap: 10 }}>
                <button
                  onClick={() => setAccionMoneda('agregar')}
                  style={{
                    flex: 1,
                    padding: '14px',
                    background: accionMoneda === 'agregar' ? `${COLORS.success}22` : COLORS.bgElevated,
                    border: `2px solid ${accionMoneda === 'agregar' ? COLORS.success : COLORS.border}`,
                    borderRadius: 12,
                    color: accionMoneda === 'agregar' ? COLORS.success : COLORS.textMuted,
                    fontSize: 15,
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  + Agregar
                </button>
                <button
                  onClick={() => setAccionMoneda('quitar')}
                  style={{
                    flex: 1,
                    padding: '14px',
                    background: accionMoneda === 'quitar' ? `${COLORS.error}22` : COLORS.bgElevated,
                    border: `2px solid ${accionMoneda === 'quitar' ? COLORS.error : COLORS.border}`,
                    borderRadius: 12,
                    color: accionMoneda === 'quitar' ? COLORS.error : COLORS.textMuted,
                    fontSize: 15,
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  - Quitar
                </button>
              </div>
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', color: COLORS.textMuted, fontSize: 13, marginBottom: 10, fontWeight: 500 }}>
                Cantidad
              </label>
              <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                {[5, 10, 20, 50, 100].map(n => (
                  <button
                    key={n}
                    onClick={() => setCantidadMoneda(n.toString())}
                    style={{
                      flex: 1,
                      padding: '12px 8px',
                      background: cantidadMoneda === n.toString()
                        ? (modalMoneda === 'runas' ? `${COLORS.purple}22` : `${COLORS.emerald}22`)
                        : COLORS.bgElevated,
                      border: `2px solid ${cantidadMoneda === n.toString()
                        ? (modalMoneda === 'runas' ? COLORS.purple : COLORS.emerald)
                        : COLORS.border}`,
                      borderRadius: 10,
                      color: cantidadMoneda === n.toString()
                        ? (modalMoneda === 'runas' ? COLORS.purple : COLORS.emerald)
                        : COLORS.textMuted,
                      fontSize: 15,
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    {n}
                  </button>
                ))}
              </div>
              <input
                type="number"
                placeholder="O escribe cantidad..."
                value={cantidadMoneda}
                onChange={e => setCantidadMoneda(e.target.value)}
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  background: COLORS.bgElevated,
                  border: `2px solid ${COLORS.border}`,
                  borderRadius: 12,
                  color: COLORS.text,
                  fontSize: 15,
                  outline: 'none'
                }}
              />
            </div>

            <div style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', color: COLORS.textMuted, fontSize: 13, marginBottom: 10, fontWeight: 500 }}>
                Motivo (opcional)
              </label>
              <input
                type="text"
                placeholder="Ej: Regalo por cumple..."
                value={motivoMoneda}
                onChange={e => setMotivoMoneda(e.target.value)}
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  background: COLORS.bgElevated,
                  border: `2px solid ${COLORS.border}`,
                  borderRadius: 12,
                  color: COLORS.text,
                  fontSize: 15,
                  outline: 'none'
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: 14 }}>
              <button
                onClick={() => setModalMoneda(null)}
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
                onClick={guardarMoneda}
                disabled={!cantidadMoneda || guardandoMoneda}
                style={{
                  flex: 1,
                  padding: '16px',
                  background: !cantidadMoneda ? COLORS.bgElevated
                    : (modalMoneda === 'runas'
                      ? `linear-gradient(135deg, ${COLORS.purple}, ${COLORS.pink})`
                      : `linear-gradient(135deg, ${COLORS.emerald}, ${COLORS.cyan})`),
                  border: 'none',
                  borderRadius: 14,
                  color: cantidadMoneda ? '#fff' : COLORS.textDim,
                  fontSize: 15,
                  fontWeight: 600,
                  cursor: cantidadMoneda && !guardandoMoneda ? 'pointer' : 'not-allowed',
                  boxShadow: cantidadMoneda
                    ? `0 4px 20px ${modalMoneda === 'runas' ? COLORS.purple : COLORS.emerald}44`
                    : 'none'
                }}
              >
                {guardandoMoneda ? 'Guardando...' : 'Confirmar'}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// COMPONENTE DETALLE CLIENTE
// ═══════════════════════════════════════════════════════════════

function ClienteDetalle({ cliente, onAbrirMoneda, onCopiarLink }) {
  const rango = getRango(cliente.gastado || 0);
  const [tab, setTab] = useState('info');
  const [actividad, setActividad] = useState(null);
  const [cargandoActividad, setCargandoActividad] = useState(false);

  const cargarActividad = async () => {
    if (actividad) return;
    setCargandoActividad(true);
    try {
      const res = await fetch(`/api/admin/clientes/${encodeURIComponent(cliente.email)}/actividad`);
      const data = await res.json();
      if (data.success) {
        setActividad(data.actividad);
      }
    } catch (e) {
      console.error('Error cargando actividad:', e);
    }
    setCargandoActividad(false);
  };

  const abrirMiMagia = () => {
    if (cliente.token) {
      window.open(`/mi-magia?token=${cliente.token}`, '_blank');
    }
  };

  return (
    <div style={{ padding: 28 }}>
      {/* Cabecera */}
      <div style={{
        display: 'flex',
        gap: 20,
        marginBottom: 28,
        padding: 24,
        background: COLORS.bgElevated,
        borderRadius: 20,
        border: `1px solid ${COLORS.border}`
      }}>
        <div style={{
          width: 72,
          height: 72,
          borderRadius: 20,
          background: `${rango.color}22`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 36
        }}>
          {rango.icono}
        </div>
        <div style={{ flex: 1 }}>
          <h2 style={{ color: COLORS.text, fontSize: 22, fontWeight: 600, margin: '0 0 6px' }}>
            {cliente.nombre || cliente.nombrePreferido || 'Sin nombre'}
          </h2>
          <p style={{ color: COLORS.textMuted, fontSize: 14, margin: '0 0 12px' }}>{cliente.email}</p>
          <span style={{
            display: 'inline-block',
            padding: '6px 14px',
            borderRadius: 10,
            fontSize: 13,
            fontWeight: 600,
            background: `${rango.color}22`,
            color: rango.color
          }}>
            {rango.nombre}
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex',
        gap: 10,
        marginBottom: 24,
        borderBottom: `1px solid ${COLORS.border}`,
        paddingBottom: 16
      }}>
        {[
          { id: 'info', label: 'Informacion', icon: '📋' },
          { id: 'actividad', label: 'Mi Magia', icon: '✨' }
        ].map(t => (
          <button
            key={t.id}
            onClick={() => { setTab(t.id); if (t.id === 'actividad') cargarActividad(); }}
            style={{
              padding: '12px 20px',
              background: tab === t.id ? `${COLORS.blue}22` : 'transparent',
              border: `2px solid ${tab === t.id ? COLORS.blue : 'transparent'}`,
              borderRadius: 12,
              color: tab === t.id ? COLORS.blue : COLORS.textMuted,
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 8
            }}
          >
            <span>{t.icon}</span>
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab: Informacion */}
      {tab === 'info' && (
        <>
          {/* Monedas */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 16,
            marginBottom: 24
          }}>
            <div
              onClick={() => onAbrirMoneda('runas')}
              style={{
                background: `linear-gradient(135deg, ${COLORS.purple}15, ${COLORS.purple}05)`,
                border: `2px solid ${COLORS.purple}44`,
                borderRadius: 20,
                padding: 24,
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              <span style={{ fontSize: 32, display: 'block', marginBottom: 8 }}>ᚱ</span>
              <span style={{ display: 'block', color: COLORS.purple, fontSize: 36, fontWeight: 700, marginBottom: 4 }}>
                {cliente.runas || 0}
              </span>
              <span style={{ display: 'block', color: COLORS.textMuted, fontSize: 14, marginBottom: 14 }}>Runas</span>
              <button style={{
                padding: '10px 20px',
                background: `${COLORS.purple}22`,
                border: `1px solid ${COLORS.purple}44`,
                borderRadius: 10,
                color: COLORS.purple,
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer'
              }}>
                Gestionar
              </button>
            </div>
            <div
              onClick={() => onAbrirMoneda('treboles')}
              style={{
                background: `linear-gradient(135deg, ${COLORS.emerald}15, ${COLORS.emerald}05)`,
                border: `2px solid ${COLORS.emerald}44`,
                borderRadius: 20,
                padding: 24,
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              <span style={{ fontSize: 32, display: 'block', marginBottom: 8 }}>☘</span>
              <span style={{ display: 'block', color: COLORS.emerald, fontSize: 36, fontWeight: 700, marginBottom: 4 }}>
                {cliente.treboles || 0}
              </span>
              <span style={{ display: 'block', color: COLORS.textMuted, fontSize: 14, marginBottom: 14 }}>Treboles</span>
              <button style={{
                padding: '10px 20px',
                background: `${COLORS.emerald}22`,
                border: `1px solid ${COLORS.emerald}44`,
                borderRadius: 10,
                color: COLORS.emerald,
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer'
              }}>
                Gestionar
              </button>
            </div>
          </div>

          {/* Info basica */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: 14,
            marginBottom: 24
          }}>
            {[
              { label: 'Total gastado', value: `$${cliente.gastado || cliente.totalCompras || 0}`, color: COLORS.gold },
              { label: 'Miembro Circulo', value: cliente.esCirculo ? 'Si' : 'No', color: cliente.esCirculo ? COLORS.success : COLORS.textDim },
              ...(cliente.esCirculo && cliente.circuloExpira ? [{
                label: 'Expira',
                value: new Date(cliente.circuloExpira).toLocaleDateString('es-UY'),
                color: COLORS.amber
              }] : []),
              { label: 'Guardianes', value: cliente.guardianes?.length || 0, color: COLORS.purple }
            ].map((item, i) => (
              <div key={i} style={{
                background: COLORS.bgElevated,
                padding: 18,
                borderRadius: 14,
                border: `1px solid ${COLORS.border}`
              }}>
                <span style={{ display: 'block', color: COLORS.textMuted, fontSize: 12, marginBottom: 6 }}>{item.label}</span>
                <span style={{ color: item.color, fontSize: 18, fontWeight: 600 }}>{item.value}</span>
              </div>
            ))}
          </div>

          {/* Acciones */}
          <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
            {cliente.token && (
              <>
                <button
                  onClick={onCopiarLink}
                  style={{
                    padding: '14px 24px',
                    background: COLORS.bgElevated,
                    border: `2px solid ${COLORS.border}`,
                    borderRadius: 14,
                    color: COLORS.text,
                    fontSize: 14,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10
                  }}
                >
                  <span>📋</span> Copiar link magico
                </button>
                <button
                  onClick={abrirMiMagia}
                  style={{
                    padding: '14px 24px',
                    background: `linear-gradient(135deg, ${COLORS.blue}, ${COLORS.blueDark})`,
                    border: 'none',
                    borderRadius: 14,
                    color: '#fff',
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    boxShadow: `0 4px 20px ${COLORS.blue}44`
                  }}
                >
                  <span>✨</span> Ver Mi Magia
                </button>
              </>
            )}
          </div>

          {/* Guardianes */}
          {cliente.guardianes?.length > 0 && (
            <div>
              <h4 style={{ color: COLORS.text, fontSize: 15, fontWeight: 600, marginBottom: 14 }}>
                Guardianes ({cliente.guardianes.length})
              </h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                {cliente.guardianes.map((g, i) => (
                  <div key={i} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '10px 16px',
                    background: `${COLORS.purple}15`,
                    border: `1px solid ${COLORS.purple}33`,
                    borderRadius: 12,
                    color: COLORS.text,
                    fontSize: 14
                  }}>
                    <span>🧙</span>
                    <span>{g.nombre || g}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* Tab: Mi Magia / Actividad */}
      {tab === 'actividad' && (
        <div>
          {cargandoActividad ? (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 60,
              color: COLORS.textMuted
            }}>
              <div style={{
                width: 40,
                height: 40,
                border: `3px solid ${COLORS.border}`,
                borderTopColor: COLORS.blue,
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }} />
              <p style={{ marginTop: 16 }}>Cargando actividad...</p>
            </div>
          ) : actividad ? (
            <>
              {/* Resumen */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: 14,
                marginBottom: 24
              }}>
                {[
                  { valor: actividad.grimorio.totalEntradas, label: 'Entradas grimorio', color: COLORS.purple },
                  { valor: actividad.canjes.totalCanjes, label: 'Canjes realizados', color: COLORS.emerald },
                  { valor: actividad.regalos.totalRegalos, label: 'Regalos recibidos', color: COLORS.pink },
                  { valor: actividad.estadisticas.diasComoMiembro, label: 'Dias con nosotros', color: COLORS.cyan }
                ].map((item, i) => (
                  <div key={i} style={{
                    background: `${item.color}15`,
                    border: `1px solid ${item.color}33`,
                    borderRadius: 14,
                    padding: 18,
                    textAlign: 'center'
                  }}>
                    <span style={{ display: 'block', color: item.color, fontSize: 28, fontWeight: 700, marginBottom: 4 }}>
                      {item.valor}
                    </span>
                    <span style={{ color: COLORS.textMuted, fontSize: 12 }}>{item.label}</span>
                  </div>
                ))}
              </div>

              {/* Circulo */}
              {actividad.circulo && (
                <div style={{ marginBottom: 20 }}>
                  <h4 style={{ color: COLORS.text, fontSize: 15, fontWeight: 600, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span>☽</span> Estado del Circulo
                  </h4>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 14,
                    padding: 18,
                    background: COLORS.bgElevated,
                    borderRadius: 14,
                    border: `1px solid ${COLORS.border}`
                  }}>
                    <span style={{
                      padding: '8px 16px',
                      borderRadius: 10,
                      fontSize: 13,
                      fontWeight: 600,
                      background: actividad.circulo.activo ? `${COLORS.success}22` : `${COLORS.error}22`,
                      color: actividad.circulo.activo ? COLORS.success : COLORS.error
                    }}>
                      {actividad.circulo.activo ? 'Activo' : 'Inactivo'}
                      {actividad.circulo.esPrueba && ' (Prueba)'}
                    </span>
                    <span style={{ color: COLORS.text, fontSize: 14 }}>{actividad.circulo.plan}</span>
                    {actividad.circulo.expira && (
                      <span style={{ color: COLORS.textMuted, fontSize: 13, marginLeft: 'auto' }}>
                        Expira: {new Date(actividad.circulo.expira).toLocaleDateString('es-UY')}
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Grimorio */}
              {actividad.grimorio.ultimasEntradas.length > 0 && (
                <div style={{ marginBottom: 20 }}>
                  <h4 style={{ color: COLORS.text, fontSize: 15, fontWeight: 600, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span>📖</span> Ultimas entradas del Grimorio
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {actividad.grimorio.ultimasEntradas.map((entrada, i) => (
                      <div key={i} style={{
                        background: COLORS.bgElevated,
                        borderRadius: 14,
                        padding: 16,
                        border: `1px solid ${COLORS.border}`
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                          <span style={{ color: COLORS.purple, fontSize: 13, fontWeight: 500, textTransform: 'capitalize' }}>
                            {entrada.tipo}
                          </span>
                          <span style={{ color: COLORS.textDim, fontSize: 12 }}>
                            {new Date(entrada.fecha).toLocaleDateString('es-UY')}
                          </span>
                        </div>
                        <p style={{ color: COLORS.text, fontSize: 14, lineHeight: 1.6, margin: 0 }}>{entrada.contenido}</p>
                        {entrada.lunaFase && (
                          <span style={{
                            display: 'inline-block',
                            marginTop: 10,
                            padding: '5px 10px',
                            background: `${COLORS.amber}15`,
                            borderRadius: 8,
                            color: COLORS.amber,
                            fontSize: 12
                          }}>
                            Luna: {entrada.lunaFase}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Canjes */}
              {actividad.canjes.historial.length > 0 && (
                <div style={{ marginBottom: 20 }}>
                  <h4 style={{ color: COLORS.text, fontSize: 15, fontWeight: 600, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span>☘</span> Historial de Canjes
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {actividad.canjes.historial.map((canje, i) => (
                      <div key={i} style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 14,
                        padding: '14px 16px',
                        background: COLORS.bgElevated,
                        borderRadius: 12,
                        border: `1px solid ${COLORS.border}`
                      }}>
                        <span style={{ color: COLORS.text, fontSize: 14, flex: 1 }}>{canje.tipo}</span>
                        <span style={{ color: COLORS.emerald, fontSize: 14, fontWeight: 600 }}>{canje.costo} treboles</span>
                        <span style={{ color: COLORS.textDim, fontSize: 13 }}>
                          {new Date(canje.fecha).toLocaleDateString('es-UY')}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Regalos */}
              {actividad.regalos.historial.length > 0 && (
                <div style={{ marginBottom: 20 }}>
                  <h4 style={{ color: COLORS.text, fontSize: 15, fontWeight: 600, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span>🎁</span> Regalos Recibidos
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {actividad.regalos.historial.map((regalo, i) => (
                      <div key={i} style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        padding: '14px 16px',
                        background: COLORS.bgElevated,
                        borderRadius: 12,
                        border: `1px solid ${COLORS.border}`
                      }}>
                        <div>
                          <span style={{ display: 'block', color: COLORS.text, fontSize: 14 }}>{regalo.descripcion}</span>
                          {regalo.mensaje && (
                            <span style={{ display: 'block', color: COLORS.textMuted, fontSize: 13, fontStyle: 'italic', marginTop: 4 }}>
                              "{regalo.mensaje}"
                            </span>
                          )}
                        </div>
                        <span style={{ color: COLORS.textDim, fontSize: 13 }}>
                          {new Date(regalo.fecha).toLocaleDateString('es-UY')}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Beneficios pendientes */}
              {(actividad.lecturasGratis.length > 0 || actividad.cupones.length > 0) && (
                <div>
                  <h4 style={{ color: COLORS.text, fontSize: 15, fontWeight: 600, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span>🎟️</span> Beneficios Pendientes
                  </h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                    {actividad.lecturasGratis.map((l, i) => (
                      <div key={`l${i}`} style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                        padding: '12px 16px',
                        background: `${COLORS.cyan}15`,
                        border: `1px solid ${COLORS.cyan}33`,
                        borderRadius: 12,
                        color: COLORS.text,
                        fontSize: 14
                      }}>
                        <span>📜</span>
                        <span>Lectura: {l.tipo}</span>
                      </div>
                    ))}
                    {actividad.cupones.map((c, i) => (
                      <div key={`c${i}`} style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                        padding: '12px 16px',
                        background: `${COLORS.amber}15`,
                        border: `1px solid ${COLORS.amber}33`,
                        borderRadius: 12,
                        color: COLORS.text,
                        fontSize: 14
                      }}>
                        <span>🎟️</span>
                        <span>Cupon {c.descuento}: {c.codigo}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: 40, color: COLORS.textDim }}>
              <span style={{ fontSize: 40, display: 'block', marginBottom: 16 }}>🌿</span>
              <p>No se pudo cargar la actividad</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
